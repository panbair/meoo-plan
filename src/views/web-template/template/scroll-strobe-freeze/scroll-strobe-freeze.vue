<template>
  <div class="ssf-scrollArea" ref="scrollArea" :style="{ height: `${totalScrollHeight}px` }">
    <div class="ssf-viewport">
      <div class="ssf-grid" ref="gridRef">
        <div
          v-for="(cell, idx) in cells"
          :key="idx"
          :ref="(el) => setCellRef(el as HTMLElement, idx)"
          :class="['ssf-cell', `ssf-cell-${idx}`]"
          :style="cellStyle(idx)"
        >
          <span class="ssf-num">{{ String(idx + 1).padStart(2, '0') }}</span>
        </div>
      </div>
    </div>
    <div class="ssf-nav" ref="navRef"></div>
    <div class="ssf-info">
      <div class="ssf-progress-bar"><div class="ssf-progress-fill" ref="progressFill"></div></div>
      <div class="ssf-pos" ref="posRef">1 / {{ totalCells }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
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

// 确定性种子随机数（每个格子固定值）
const cellSeeds: number[] = []
for (let i = 0; i < totalCells; i++) {
  const r = Math.floor(i / COLS)
  const c = i % COLS
  cellSeeds[i] = ((r * 79 + c * 131) % 9973) / 9973
}

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
    scrub: 0.5,
    onUpdate(self) {
      const p = self.progress
      updateCells(p)
      updateUI(p)
    },
  })
})

function updateCells(p: number) {
  // 频闪阈值随滚动振荡变化
  // 使用多层正弦叠加创建不规则节奏
  const baseThreshold = 0.25
  const amplitude = 0.55
  const freq1 = Math.sin(p * Math.PI * 3)
  const freq2 = Math.sin(p * Math.PI * 7 + 1.5) * 0.5
  const freq3 = Math.cos(p * Math.PI * 11) * 0.3
  const threshold = baseThreshold + amplitude * (freq1 + freq2 + freq3) / 1.8

  for (let i = 0; i < totalCells; i++) {
    const el = cellRefs[i]
    if (!el) continue
    const seed = cellSeeds[i]
    const visible = seed > threshold
    // 不可见时淡化 + 缩小（浅色主题：亮度提升 + 透明代替暗化）
    el.style.opacity = visible ? '1' : '0.06'
    el.style.transform = visible ? 'scale(1)' : 'scale(0.7)'
    el.style.filter = visible ? 'none' : 'blur(6px) brightness(1.6) saturate(0.3)'
    el.style.pointerEvents = visible ? 'auto' : 'none'
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
  rowDots.className = 'ssf-nav-rows'
  for (let r = 0; r < ROWS; r++) {
    const dot = document.createElement('div')
    dot.className = 'ssf-nav-dot'
    dot.textContent = `R${r + 1}`
    rowDots.appendChild(dot)
  }
  const colDots = document.createElement('div')
  colDots.className = 'ssf-nav-cols'
  for (let c = 0; c < COLS; c++) {
    const dot = document.createElement('div')
    dot.className = 'ssf-nav-dot'
    dot.textContent = `C${c + 1}`
    colDots.appendChild(dot)
  }
  navRef.value.appendChild(rowDots)
  navRef.value.appendChild(colDots)
}

onUnmounted(() => { st?.kill() })
</script>

<style>
.ssf-scrollArea { position: relative; }
.ssf-viewport {
  position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden;
  background: #f7f8fc;
}
.ssf-grid {
  display: grid;
  grid-template-columns: repeat(5, 100vw);
  grid-template-rows: repeat(4, 100vh);
  width: fit-content; height: fit-content;
  transform: translate(0, 0);
}
.ssf-cell {
  position: relative;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
  transition: transform 0.08s ease, opacity 0.08s ease, filter 0.08s ease;
}
.ssf-cell::before {
  content: ''; position: absolute; inset: 16px;
  border: 1px solid rgba(0,0,0,0.06);
  pointer-events: none; z-index: 2;
}
.ssf-num {
  position: absolute; bottom: 32px; right: 40px;
  font-size: clamp(4rem, 8vw, 10rem); font-weight: 900;
  color: rgba(0,0,0,0.04); z-index: 1;
  font-family: 'Inter', system-ui, sans-serif; line-height: 1;
}
/* 明亮青春糖果配色 */
.ssf-cell-0  { background: #ff7eb3; }
.ssf-cell-1  { background: #c084fc; }
.ssf-cell-2  { background: #60a5fa; }
.ssf-cell-3  { background: #2dd4bf; }
.ssf-cell-4  { background: #fbbf24; }
.ssf-cell-5  { background: #fb923c; }
.ssf-cell-6  { background: #a78bfa; }
.ssf-cell-7  { background: #f472b6; }
.ssf-cell-8  { background: #38bdf8; }
.ssf-cell-9  { background: #34d399; }
.ssf-cell-10 { background: #f87171; }
.ssf-cell-11 { background: #facc15; }
.ssf-cell-12 { background: #818cf8; }
.ssf-cell-13 { background: #4ade80; }
.ssf-cell-14 { background: #fb923c; }
.ssf-cell-15 { background: #e879f9; }
.ssf-cell-16 { background: #22d3ee; }
.ssf-cell-17 { background: #a5b4fc; }
.ssf-cell-18 { background: #fb7185; }
.ssf-cell-19 { background: #6ee7b7; }
.ssf-nav { position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; gap: 10px; z-index: 100; }
.ssf-nav-rows, .ssf-nav-cols { display: flex; gap: 8px; justify-content: center; }
.ssf-nav-dot { width: 28px; height: 28px; border-radius: 50%; border: 2px solid rgba(0,0,0,0.15); display: flex; align-items: center; justify-content: center; font-size: 10px; color: rgba(0,0,0,0.4); font-family: monospace; background: rgba(255,255,255,0.7); }
.ssf-info { position: fixed; bottom: 140px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 6px; z-index: 100; }
.ssf-progress-bar { width: 200px; height: 4px; background: rgba(0,0,0,0.06); border-radius: 2px; overflow: hidden; }
.ssf-progress-fill { height: 100%; width: 0%; background: linear-gradient(90deg, #ff7eb3, #c084fc, #60a5fa, #2dd4bf, #fbbf24); border-radius: 2px; transition: width 0.1s linear; }
.ssf-pos { font-size: 12px; color: rgba(0,0,0,0.45); font-family: monospace; font-weight: 500; }
</style>
