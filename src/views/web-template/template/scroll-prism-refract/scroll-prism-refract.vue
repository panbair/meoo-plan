<template>
  <div class="spr-scrollArea" ref="scrollArea" :style="{ height: `${totalScrollHeight}px` }">
    <div class="spr-viewport">
      <div class="spr-grid" ref="gridRef">
        <div
          v-for="(cell, idx) in cells"
          :key="idx"
          :ref="(el) => setCellRef(el as HTMLElement, idx)"
          :class="['spr-cell', `spr-cell-${idx}`]"
          :style="cellStyle(idx)"
        >
          <span class="spr-num">{{ String(idx + 1).padStart(2, '0') }}</span>
        </div>
      </div>
    </div>
    <div class="spr-nav" ref="navRef"></div>
    <div class="spr-info">
      <div class="spr-progress-bar"><div class="spr-progress-fill" ref="progressFill"></div></div>
      <div class="spr-pos" ref="posRef">1 / {{ totalCells }}</div>
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

// 预计算每个格子的基准色相(去重、均匀分布)
function getBaseHue(r: number, c: number): number {
  return ((r * 137 + c * 73) % 360)
}

function updateCells(p: number) {
  // 棱镜折射中心：在网格中移动
  const centerR = (ROWS - 1) / 2 + 1 * Math.sin(p * Math.PI * 2)
  const centerC = (COLS - 1) / 2 + 1.5 * Math.cos(p * Math.PI * 2)
  const maxDist = Math.sqrt((ROWS - 1) ** 2 + (COLS - 1) ** 2)

  for (let i = 0; i < totalCells; i++) {
    const el = cellRefs[i]
    if (!el) continue
    const r = Math.floor(i / COLS)
    const c = i % COLS
    const dr = r - centerR
    const dc = c - centerC
    const dist = Math.sqrt(dr * dr + dc * dc)
    const normDist = dist / (maxDist + 0.01)
    // 色相偏移：离中心越远，偏移越大
    const hueShift = normDist * 360
    // 饱和度：远距离高饱和，中心保持中性
    const saturate = 0.2 + normDist * 1.5
    // 亮度：中心亮、边缘微弱变暗
    const brightness = 1.3 - normDist * 0.6
    // 轻微缩放：中心略大
    const scale = 1.02 - normDist * 0.06

    el.style.filter = `hue-rotate(${hueShift}deg) saturate(${saturate}) brightness(${brightness})`
    el.style.transform = `scale(${scale})`
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
  rowDots.className = 'spr-nav-rows'
  for (let r = 0; r < ROWS; r++) {
    const dot = document.createElement('div')
    dot.className = 'spr-nav-dot'
    dot.textContent = `R${r + 1}`
    rowDots.appendChild(dot)
  }
  const colDots = document.createElement('div')
  colDots.className = 'spr-nav-cols'
  for (let c = 0; c < COLS; c++) {
    const dot = document.createElement('div')
    dot.className = 'spr-nav-dot'
    dot.textContent = `C${c + 1}`
    colDots.appendChild(dot)
  }
  navRef.value.appendChild(rowDots)
  navRef.value.appendChild(colDots)
}

onUnmounted(() => { st?.kill() })
</script>

<style>
.spr-scrollArea { position: relative; }
.spr-viewport {
  position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden;
  background: #f5f0f8;
}
.spr-grid {
  display: grid;
  grid-template-columns: repeat(5, 100vw);
  grid-template-rows: repeat(4, 100vh);
  width: fit-content; height: fit-content;
  transform: translate(0, 0);
}
.spr-cell {
  position: relative;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
}
.spr-cell::before {
  content: ''; position: absolute; inset: 16px;
  border: 1px solid rgba(255,255,255,0.12);
  pointer-events: none; z-index: 2;
}
.spr-num {
  position: absolute; bottom: 32px; right: 40px;
  font-size: clamp(4rem, 8vw, 10rem); font-weight: 900;
  color: rgba(26, 26, 46,0.07); z-index: 1;
  font-family: 'Inter', system-ui, sans-serif; line-height: 1;
}
/* 纯白基底，靠 hue-rotate 产生色散 */
.spr-cell-0  { background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%); }
.spr-cell-1  { background: linear-gradient(135deg, #ffffff 0%, #f1f3f5 50%, #e9ecef 100%); }
.spr-cell-2  { background: linear-gradient(135deg, #f8f9fa 0%, #dee2e6 50%, #ced4da 100%); }
.spr-cell-3  { background: linear-gradient(135deg, #ffffff 0%, #e9ecef 50%, #dee2e6 100%); }
.spr-cell-4  { background: linear-gradient(135deg, #f1f3f5 0%, #e9ecef 50%, #f8f9fa 100%); }
.spr-cell-5  { background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #e9ecef 100%); }
.spr-cell-6  { background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 50%, #ced4da 100%); }
.spr-cell-7  { background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 50%, #f1f3f5 100%); }
.spr-cell-8  { background: linear-gradient(135deg, #ffffff 0%, #dee2e6 50%, #e9ecef 100%); }
.spr-cell-9  { background: linear-gradient(135deg, #f1f3f5 0%, #f8f9fa 50%, #e9ecef 100%); }
.spr-cell-10 { background: linear-gradient(135deg, #e9ecef 0%, #f8f9fa 50%, #ffffff 100%); }
.spr-cell-11 { background: linear-gradient(135deg, #dee2e6 0%, #e9ecef 50%, #f8f9fa 100%); }
.spr-cell-12 { background: linear-gradient(135deg, #ffffff 0%, #f1f3f5 50%, #dee2e6 100%); }
.spr-cell-13 { background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #ffffff 100%); }
.spr-cell-14 { background: linear-gradient(135deg, #ced4da 0%, #dee2e6 50%, #e9ecef 100%); }
.spr-cell-15 { background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #e9ecef 100%); }
.spr-cell-16 { background: linear-gradient(135deg, #e9ecef 0%, #ffffff 50%, #f1f3f5 100%); }
.spr-cell-17 { background: linear-gradient(135deg, #f1f3f5 0%, #dee2e6 50%, #f8f9fa 100%); }
.spr-cell-18 { background: linear-gradient(135deg, #ffffff 0%, #e9ecef 50%, #ced4da 100%); }
.spr-cell-19 { background: linear-gradient(135deg, #dee2e6 0%, #f8f9fa 50%, #e9ecef 100%); }
.spr-nav { position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; gap: 10px; z-index: 100; }
.spr-nav-rows, .spr-nav-cols { display: flex; gap: 8px; justify-content: center; }
.spr-nav-dot { width: 28px; height: 28px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.35); display: flex; align-items: center; justify-content: center; font-size: 10px; color: rgba(26, 26, 46,0.55); font-family: monospace; }
.spr-info { position: fixed; bottom: 140px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 6px; z-index: 100; }
.spr-progress-bar { width: 200px; height: 4px; background: rgba(26, 26, 46,0.1); border-radius: 2px; overflow: hidden; }
.spr-progress-fill { height: 100%; width: 0%; background: linear-gradient(90deg, #ff0000, #ff8800, #ffff00, #00ff00, #0088ff, #8800ff); border-radius: 2px; transition: width 0.1s linear; }
.spr-pos { font-size: 12px; color: rgba(255, 255, 255, 0.8); font-family: monospace; }
</style>
