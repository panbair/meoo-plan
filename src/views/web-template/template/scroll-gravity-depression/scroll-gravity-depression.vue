<template>
  <div class="sgd-scrollArea" ref="scrollArea" :style="{ height: `${totalScrollHeight}px` }">
    <div class="sgd-viewport">
      <div class="sgd-grid" ref="gridRef">
        <div
          v-for="(cell, idx) in cells"
          :key="idx"
          :ref="(el) => setCellRef(el as HTMLElement, idx)"
          :class="['sgd-cell', `sgd-cell-${idx}`]"
          :style="cellStyle(idx)"
        >
          <span class="sgd-num">{{ String(idx + 1).padStart(2, '0') }}</span>
        </div>
      </div>
    </div>
    <div class="sgd-nav" ref="navRef"></div>
    <div class="sgd-info">
      <div class="sgd-progress-bar"><div class="sgd-progress-fill" ref="progressFill"></div></div>
      <div class="sgd-pos" ref="posRef">1 / {{ totalCells }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const ROWS = 4
const COLS = 5
const totalCells = ROWS * COLS

const scrollArea = ref<HTMLElement | null>(null)
const gridRef = ref<HTMLElement | null>(null)
const navRef = ref<HTMLElement | null>(null)
const progressFill = ref<HTMLElement | null>(null)
const posRef = ref<HTMLElement | null>(null)

const cellRefs: (HTMLElement | null)[] = Array(totalCells).fill(null)
function setCellRef(el: HTMLElement | null, idx: number) { cellRefs[idx] = el }

const cells = Array.from({ length: totalCells }, (_, i) => ({
  row: Math.floor(i / COLS),
  col: i % COLS,
}))

const totalScrollHeight = (ROWS + COLS - 1) * window.innerHeight * 1.2

let st: ScrollTrigger | null = null

function cellStyle(idx: number) {
  const r = Math.floor(idx / COLS)
  const c = idx % COLS
  return { '--r': r, '--c': c }
}

onMounted(async () => {
  await nextTick()
  if (!scrollArea.value || !gridRef.value) return
  buildNav()

  st = ScrollTrigger.create({
    trigger: scrollArea.value,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1,
    onUpdate(self) {
      const p = self.progress
      updateCells(p)
      updateUI(p)
    },
  })
})

function updateCells(p: number) {
  // 重力井沿八字轨迹移动
  const t = p * Math.PI * 2
  const wellCX = 0.5 + 0.3 * Math.sin(t)
  const wellCY = 0.5 + 0.25 * Math.sin(t * 2)

  for (let i = 0; i < totalCells; i++) {
    const el = cellRefs[i]
    if (!el) continue
    const r = Math.floor(i / COLS)
    const c = i % COLS
    const cx = (c + 0.5) / COLS
    const cy = (r + 0.5) / ROWS
    const dx = wellCX - cx
    const dy = wellCY - cy
    const dist = Math.sqrt(dx * dx + dy * dy)
    // 重力凹陷强度：指数衰减
    const depth = Math.exp(-dist * 2.5)
    // z轴深度缩放：靠近井口的格子缩小（模拟远离观察者）
    const sinkScale = 1 - depth * 0.55
    // 向内下沉位移
    const sinkX = (dx / (dist + 0.01)) * depth * 25
    const sinkY = (dy / (dist + 0.01)) * depth * 25
    // 变暗 + 模糊来模拟空间弯曲
    const darken = 1 - depth * 0.6
    const blur = depth * 6

    el.style.transform = `translate(${sinkX}%, ${sinkY}%) scale(${sinkScale})`
    el.style.filter = `brightness(${darken}) blur(${blur}px)`
    el.style.zIndex = String(Math.floor((1 - depth) * 20))
  }
}

function updateUI(p: number) {
  if (progressFill.value) progressFill.value.style.width = `${p * 100}%`
  const cellIdx = Math.floor(p * totalCells) + 1
  if (posRef.value) posRef.value.textContent = `${Math.min(cellIdx, totalCells)} / ${totalCells}`
}

function buildNav() {
  if (!navRef.value) return
  navRef.value.innerHTML = ''
  const rowDots = document.createElement('div')
  rowDots.className = 'sgd-nav-rows'
  for (let r = 0; r < ROWS; r++) {
    const dot = document.createElement('div')
    dot.className = 'sgd-nav-dot'
    dot.textContent = `R${r + 1}`
    rowDots.appendChild(dot)
  }
  const colDots = document.createElement('div')
  colDots.className = 'sgd-nav-cols'
  for (let c = 0; c < COLS; c++) {
    const dot = document.createElement('div')
    dot.className = 'sgd-nav-dot'
    dot.textContent = `C${c + 1}`
    colDots.appendChild(dot)
  }
  navRef.value.appendChild(rowDots)
  navRef.value.appendChild(colDots)
}

onUnmounted(() => { st?.kill() })
</script>

<style>
.sgd-scrollArea { position: relative; }
.sgd-viewport {
  position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden;
  background: #f5f0f8;
}
.sgd-grid {
  display: grid;
  grid-template-columns: repeat(5, 100vw);
  grid-template-rows: repeat(4, 100vh);
  width: fit-content; height: fit-content;
  transform: translate(0, 0);
}
.sgd-cell {
  position: relative;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
  transition: z-index 0.15s;
}
.sgd-cell::before {
  content: ''; position: absolute; inset: 16px;
  border: 1px solid rgba(255,255,255,0.12);
  pointer-events: none; z-index: 2;
}
.sgd-num {
  position: absolute; bottom: 32px; right: 40px;
  font-size: clamp(4rem, 8vw, 10rem); font-weight: 900;
  color: rgba(26, 26, 46,0.05); z-index: 1;
  font-family: 'Inter', system-ui, sans-serif; line-height: 1;
}
.sgd-cell-0  { background: radial-gradient(ellipse at 30% 30%, #dcdcf0 0%, #0a0a1a 100%); }
.sgd-cell-1  { background: radial-gradient(ellipse at 70% 20%, #2d1b4e 0%, #0a0a1a 100%); }
.sgd-cell-2  { background: radial-gradient(ellipse at 50% 60%, #1b3a4e 0%, #0a0a1a 100%); }
.sgd-cell-3  { background: radial-gradient(ellipse at 20% 70%, #3e1a1a 0%, #0a0a1a 100%); }
.sgd-cell-4  { background: radial-gradient(ellipse at 60% 40%, #1a3e2d 0%, #0a0a1a 100%); }
.sgd-cell-5  { background: radial-gradient(ellipse at 40% 30%, #3e1a3e 0%, #0a0a1a 100%); }
.sgd-cell-6  { background: radial-gradient(ellipse at 80% 50%, #1a2d3e 0%, #0a0a1a 100%); }
.sgd-cell-7  { background: radial-gradient(ellipse at 30% 80%, #2d3e1a 0%, #0a0a1a 100%); }
.sgd-cell-8  { background: radial-gradient(ellipse at 50% 20%, #3e2d1a 0%, #0a0a1a 100%); }
.sgd-cell-9  { background: radial-gradient(ellipse at 70% 70%, #1a1a2d 0%, #0a0a1a 100%); }
.sgd-cell-10 { background: radial-gradient(ellipse at 20% 40%, #2d1a1a 0%, #0a0a1a 100%); }
.sgd-cell-11 { background: radial-gradient(ellipse at 60% 80%, #1a3e3e 0%, #0a0a1a 100%); }
.sgd-cell-12 { background: radial-gradient(ellipse at 40% 50%, #3e1a2d 0%, #0a0a1a 100%); }
.sgd-cell-13 { background: radial-gradient(ellipse at 80% 30%, #2d2d1a 0%, #0a0a1a 100%); }
.sgd-cell-14 { background: radial-gradient(ellipse at 50% 80%, #dcdcf0 0%, #0a0a1a 100%); }
.sgd-cell-15 { background: radial-gradient(ellipse at 30% 50%, #2d3e2d 0%, #0a0a1a 100%); }
.sgd-cell-16 { background: radial-gradient(ellipse at 70% 40%, #1a2d2d 0%, #0a0a1a 100%); }
.sgd-cell-17 { background: radial-gradient(ellipse at 40% 70%, #3e3e1a 0%, #0a0a1a 100%); }
.sgd-cell-18 { background: radial-gradient(ellipse at 60% 20%, #1a2d1a 0%, #0a0a1a 100%); }
.sgd-cell-19 { background: radial-gradient(ellipse at 20% 60%, #2d1a3e 0%, #0a0a1a 100%); }
.sgd-nav { position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; gap: 10px; z-index: 100; }
.sgd-nav-rows, .sgd-nav-cols { display: flex; gap: 8px; justify-content: center; }
.sgd-nav-dot { width: 28px; height: 28px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.3); display: flex; align-items: center; justify-content: center; font-size: 10px; color: rgba(26, 26, 46,0.5); font-family: monospace; }
.sgd-info { position: fixed; bottom: 140px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 6px; z-index: 100; }
.sgd-progress-bar { width: 200px; height: 4px; background: rgba(26, 26, 46,0.08); border-radius: 2px; overflow: hidden; }
.sgd-progress-fill { height: 100%; width: 0%; background: linear-gradient(90deg, #4facfe, #00f2fe); border-radius: 2px; transition: width 0.1s linear; }
.sgd-pos { font-size: 12px; color: rgba(26, 26, 46,0.4); font-family: monospace; }
</style>
