<template>
  <div class="seg-scrollArea" ref="scrollArea" :style="{ height: `${totalScrollHeight}px` }">
    <div class="seg-viewport">
      <div class="seg-grid" ref="gridRef">
        <div
          v-for="(cell, idx) in cells"
          :key="idx"
          :ref="(el) => setCellRef(el as HTMLElement, idx)"
          :class="['seg-cell', `seg-cell-${idx}`]"
          :style="cellStyle(idx)"
        >
          <span class="seg-num">{{ String(idx + 1).padStart(2, '0') }}</span>
        </div>
      </div>
    </div>
    <div class="seg-nav" ref="navRef"></div>
    <div class="seg-info">
      <div class="seg-progress-bar"><div class="seg-progress-fill" ref="progressFill"></div></div>
      <div class="seg-pos" ref="posRef">1 / {{ totalCells }}</div>
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
  // 波源从左到右移动
  const sourceCol = p * (COLS - 1)
  const sourceRow = (ROWS - 1) / 2
  const waveSpeed = 1.2 // 传播速度因子

  for (let i = 0; i < totalCells; i++) {
    const el = cellRefs[i]
    if (!el) continue
    const r = Math.floor(i / COLS)
    const c = i % COLS
    const dist = Math.sqrt((c - sourceCol) ** 2 + (r - sourceRow) ** 2)
    // 延迟：距离越远，到达越晚
    const delay = dist / (Math.max(ROWS, COLS) * waveSpeed)
    // 回音进度：排除延迟后的有效进度
    const echoP = Math.max(0, Math.min(1, (p - delay) / (1 - delay + 0.001)))
    // 距离衰减因子
    const decay = Math.max(0, 1 - dist / (ROWS + COLS))
    // 回音效果：从上方落下并清晰
    const dropY = (1 - echoP) * 80 * decay
    const opacity = 0.15 + 0.85 * echoP * (0.5 + 0.5 * decay)
    const blur = (1 - echoP) * 12 * decay
    const scale = 0.6 + 0.4 * echoP * (0.5 + 0.5 * decay)

    el.style.transform = `translateY(${dropY}%) scale(${scale})`
    el.style.opacity = String(opacity)
    el.style.filter = `blur(${blur}px)`
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
  rowDots.className = 'seg-nav-rows'
  for (let r = 0; r < ROWS; r++) {
    const dot = document.createElement('div')
    dot.className = 'seg-nav-dot'
    dot.textContent = `R${r + 1}`
    rowDots.appendChild(dot)
  }
  const colDots = document.createElement('div')
  colDots.className = 'seg-nav-cols'
  for (let c = 0; c < COLS; c++) {
    const dot = document.createElement('div')
    dot.className = 'seg-nav-dot'
    dot.textContent = `C${c + 1}`
    colDots.appendChild(dot)
  }
  navRef.value.appendChild(rowDots)
  navRef.value.appendChild(colDots)
}

onUnmounted(() => { st?.kill() })
</script>

<style>
.seg-scrollArea { position: relative; }
.seg-viewport {
  position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden;
  background: #0a0a14;
}
.seg-grid {
  display: grid;
  grid-template-columns: repeat(5, 100vw);
  grid-template-rows: repeat(4, 100vh);
  width: fit-content; height: fit-content;
  transform: translate(0, 0);
}
.seg-cell {
  position: relative;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
}
.seg-cell::before {
  content: ''; position: absolute; inset: 16px;
  border: 1px solid rgba(255,255,255,0.1);
  pointer-events: none; z-index: 2;
}
.seg-num {
  position: absolute; bottom: 32px; right: 40px;
  font-size: clamp(4rem, 8vw, 10rem); font-weight: 900;
  color: rgba(255,255,255,0.06); z-index: 1;
  font-family: 'Inter', system-ui, sans-serif; line-height: 1;
}
.seg-cell-0  { background: linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%); }
.seg-cell-1  { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); }
.seg-cell-2  { background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%); }
.seg-cell-3  { background: linear-gradient(135deg, #141e30 0%, #243b55 100%); }
.seg-cell-4  { background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%); }
.seg-cell-5  { background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); }
.seg-cell-6  { background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%); }
.seg-cell-7  { background: linear-gradient(135deg, #1a2a6c 0%, #b21f1f 50%, #fdbb2d 100%); }
.seg-cell-8  { background: linear-gradient(135deg, #0f2027 0%, #2c5364 100%); }
.seg-cell-9  { background: linear-gradient(135deg, #141e30 0%, #1e3c72 100%); }
.seg-cell-10 { background: linear-gradient(135deg, #302b63 0%, #0f0c29 100%); }
.seg-cell-11 { background: linear-gradient(135deg, #203a43 0%, #0f2027 100%); }
.seg-cell-12 { background: linear-gradient(135deg, #16213e 0%, #1a1a2e 100%); }
.seg-cell-13 { background: linear-gradient(135deg, #2a5298 0%, #1e3c72 100%); }
.seg-cell-14 { background: linear-gradient(135deg, #243b55 0%, #141e30 100%); }
.seg-cell-15 { background: linear-gradient(135deg, #3498db 0%, #2c3e50 100%); }
.seg-cell-16 { background: linear-gradient(135deg, #0f3460 0%, #16213e 100%); }
.seg-cell-17 { background: linear-gradient(135deg, #b21f1f 0%, #1a2a6c 100%); }
.seg-cell-18 { background: linear-gradient(135deg, #fdbb2d 0%, #b21f1f 100%); }
.seg-cell-19 { background: linear-gradient(135deg, #2c5364 0%, #203a43 100%); }
.seg-nav { position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; gap: 10px; z-index: 100; }
.seg-nav-rows, .seg-nav-cols { display: flex; gap: 8px; justify-content: center; }
.seg-nav-dot { width: 28px; height: 28px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.3); display: flex; align-items: center; justify-content: center; font-size: 10px; color: rgba(255,255,255,0.5); font-family: monospace; }
.seg-info { position: fixed; bottom: 140px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 6px; z-index: 100; }
.seg-progress-bar { width: 200px; height: 4px; background: rgba(255,255,255,0.08); border-radius: 2px; overflow: hidden; }
.seg-progress-fill { height: 100%; width: 0%; background: linear-gradient(90deg, #2c5364, #fdbb2d); border-radius: 2px; transition: width 0.1s linear; }
.seg-pos { font-size: 12px; color: rgba(255,255,255,0.4); font-family: monospace; }
</style>
