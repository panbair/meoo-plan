<template>
  <div class="smp-scrollArea" ref="scrollArea" :style="{ height: `${totalScrollHeight}px` }">
    <div class="smp-viewport">
      <div class="smp-grid" ref="gridRef">
        <div
          v-for="(cell, idx) in cells"
          :key="idx"
          :ref="(el) => setCellRef(el as HTMLElement, idx)"
          :class="['smp-cell', `smp-cell-${idx}`]"
          :style="cellStyle(idx)"
        >
          <span class="smp-num">{{ String(idx + 1).padStart(2, '0') }}</span>
        </div>
      </div>
    </div>
    <div class="smp-nav" ref="navRef"></div>
    <div class="smp-info">
      <div class="smp-progress-bar"><div class="smp-progress-fill" ref="progressFill"></div></div>
      <div class="smp-pos" ref="posRef">1 / {{ totalCells }}</div>
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

  // 构建导航
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
  // 磁力点沿螺旋轨迹移动
  const angle = p * Math.PI * 5
  const radius = 0.35 + 0.15 * Math.sin(p * Math.PI * 2)
  const magnetCX = 0.5 + radius * Math.cos(angle)
  const magnetCY = 0.5 + radius * Math.sin(angle)

  for (let i = 0; i < totalCells; i++) {
    const el = cellRefs[i]
    if (!el) continue
    const r = Math.floor(i / COLS)
    const c = i % COLS
    const cx = (c + 0.5) / COLS
    const cy = (r + 0.5) / ROWS
    const dx = magnetCX - cx
    const dy = magnetCY - cy
    const dist = Math.sqrt(dx * dx + dy * dy)
    const force = 1 / (dist * dist + 0.08)
    const clampForce = Math.min(force, 6)
    const pullX = (dx / (dist + 0.01)) * clampForce * 0.35
    const pullY = (dy / (dist + 0.01)) * clampForce * 0.35
    const glow = clampForce / 6
    el.style.transform = `translate(${pullX * 100}%, ${pullY * 100}%) scale(${1 + glow * 0.12})`
    el.style.filter = `brightness(${0.5 + glow * 1.5}) drop-shadow(0 0 ${glow * 20}px rgba(255,255,255,${glow * 0.8}))`
    el.style.zIndex = String(Math.floor(glow * 20))
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
  rowDots.className = 'smp-nav-rows'
  for (let r = 0; r < ROWS; r++) {
    const dot = document.createElement('div')
    dot.className = 'smp-nav-dot'
    dot.textContent = `R${r + 1}`
    rowDots.appendChild(dot)
  }
  const colDots = document.createElement('div')
  colDots.className = 'smp-nav-cols'
  for (let c = 0; c < COLS; c++) {
    const dot = document.createElement('div')
    dot.className = 'smp-nav-dot'
    dot.textContent = `C${c + 1}`
    colDots.appendChild(dot)
  }
  navRef.value.appendChild(rowDots)
  navRef.value.appendChild(colDots)
}

onUnmounted(() => { st?.kill() })
</script>

<style>
.smp-scrollArea { position: relative; }
.smp-viewport {
  position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden;
  background: #f5f0f8;
}
.smp-grid {
  display: grid;
  grid-template-columns: repeat(5, 100vw);
  grid-template-rows: repeat(4, 100vh);
  width: fit-content; height: fit-content;
  transform: translate(0, 0);
}
.smp-cell {
  position: relative;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
  transition: z-index 0.1s;
}
.smp-cell::before {
  content: ''; position: absolute; inset: 16px;
  border: 1px solid rgba(255,255,255,0.15);
  pointer-events: none; z-index: 2;
}
.smp-num {
  position: absolute; bottom: 32px; right: 40px;
  font-size: clamp(4rem, 8vw, 10rem); font-weight: 900;
  color: rgba(26, 26, 46,0.06); z-index: 1;
  font-family: 'Inter', system-ui, sans-serif; line-height: 1;
}
.smp-cell-0  { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.smp-cell-1  { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.smp-cell-2  { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.smp-cell-3  { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
.smp-cell-4  { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
.smp-cell-5  { background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%); }
.smp-cell-6  { background: linear-gradient(135deg, #fccb90 0%, #d57eeb 100%); }
.smp-cell-7  { background: linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%); }
.smp-cell-8  { background: linear-gradient(135deg, #f5576c 0%, #ff6a88 100%); }
.smp-cell-9  { background: linear-gradient(135deg, #30cfd0 0%, #330867 100%); }
.smp-cell-10 { background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); }
.smp-cell-11 { background: linear-gradient(135deg, #5ee7df 0%, #b490ca 100%); }
.smp-cell-12 { background: linear-gradient(135deg, #d299c2 0%, #fef9d7 100%); }
.smp-cell-13 { background: linear-gradient(135deg, #f6d365 0%, #fda085 100%); }
.smp-cell-14 { background: linear-gradient(135deg, #96fbc4 0%, #f9f586 100%); }
.smp-cell-15 { background: linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%); }
.smp-cell-16 { background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%); }
.smp-cell-17 { background: linear-gradient(135deg, #cfd9df 0%, #e2ebf0 100%); }
.smp-cell-18 { background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%); }
.smp-cell-19 { background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); }
.smp-nav { position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; gap: 10px; z-index: 100; }
.smp-nav-rows, .smp-nav-cols { display: flex; gap: 8px; justify-content: center; }
.smp-nav-dot { width: 28px; height: 28px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.4); display: flex; align-items: center; justify-content: center; font-size: 10px; color: rgba(26, 26, 46,0.6); font-family: monospace; }
.smp-info { position: fixed; bottom: 140px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 6px; z-index: 100; }
.smp-progress-bar { width: 200px; height: 4px; background: rgba(26, 26, 46,0.1); border-radius: 2px; overflow: hidden; }
.smp-progress-fill { height: 100%; width: 0%; background: linear-gradient(90deg, #667eea, #f093fb); border-radius: 2px; transition: width 0.1s linear; }
.smp-pos { font-size: 12px; color: rgba(26, 26, 46,0.5); font-family: monospace; }
</style>
