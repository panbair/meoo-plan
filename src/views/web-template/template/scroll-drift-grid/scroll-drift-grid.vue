<script setup lang="ts">
/**
 * ==================== Scroll Drift Grid ====================
 * 纯动画架构：滚动驱动对角漂移
 * 结合 fake-horizontal-scroll(scrub横移)+infinite-scroll(包裹循环)+two-d-gallery(二维网格)
 * 核心：一个滚动轴同时驱动 X/Y 双轴平移，在 M×N 网格上斜向扫掠
 * 仿 scrollArea → sticky viewport → GSAP scrub translate(x,y)
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ═══════ 配置 ═══════ */
const ROWS = 5
const COLS = 4
const N = ROWS * COLS

let vw = 0, vh = 0

/* ═══════ DOM refs ═══════ */
let scrollArea: HTMLElement | null = null
let track: HTMLElement | null = null
let progressBar: HTMLElement | null = null
let mainST: ScrollTrigger | null = null

/* ═══════ 导航点 ═══════ */
function createDots() {
  const rowDots = document.getElementById('driftRowDots')
  const colDots = document.getElementById('driftColDots')
  if (rowDots) {
    rowDots.innerHTML = ''
    for (let i = 0; i < ROWS; i++) {
      const d = document.createElement('button')
      d.className = 'drift-dot'
      d.addEventListener('click', () => {
        window.scrollTo({ top: (i / (ROWS - 1)) * (ROWS - 1) * vh, behavior: 'smooth' })
      })
      rowDots.appendChild(d)
    }
  }
  if (colDots) {
    colDots.innerHTML = ''
    for (let i = 0; i < COLS; i++) {
      const d = document.createElement('button')
      d.className = 'drift-dot'
      d.addEventListener('click', () => {
        window.scrollTo({ top: (i / (COLS - 1)) * (ROWS - 1) * vh, behavior: 'smooth' })
      })
      colDots.appendChild(d)
    }
  }
}

/* ═══════ UI 更新 ═══════ */
let lastRow = -1, lastCol = -1
function updateUI(progress: number) {
  const r = Math.round(progress * (ROWS - 1))
  const c = Math.round(progress * (COLS - 1))
  if (r !== lastRow || c !== lastCol) {
    lastRow = r; lastCol = c
    const rowDots = document.querySelectorAll('#driftRowDots .drift-dot')
    const colDots = document.querySelectorAll('#driftColDots .drift-dot')
    rowDots.forEach((d, i) => d.classList.toggle('drift-active', i === r))
    colDots.forEach((d, i) => d.classList.toggle('drift-active', i === c))
  }
  if (progressBar) progressBar.style.width = (progress * 100) + '%'
}

/* ═══════ 初始化 ═══════ */
function init() {
  vw = window.innerWidth
  vh = window.innerHeight
  lastRow = -1; lastCol = -1

  scrollArea = document.getElementById('driftScrollArea') as HTMLElement
  track = document.getElementById('driftTrack') as HTMLElement
  progressBar = document.getElementById('driftProgressBar')
  if (!scrollArea || !track) return

  // scrollArea 高度 = ROWS * 100vh（撑出纵向滚动空间）
  scrollArea.style.height = ROWS * 100 + 'vh'

  // 核心：滚动进度 0→1 驱动斜向平移
  // x: 0 → -(COLS-1)*100vw  (左移)
  // y: 0 → -(ROWS-1)*100vh  (上移)
  const tween = gsap.to(track, {
    x: () => -(COLS - 1) * vw,
    y: () => -(ROWS - 1) * vh,
    ease: 'none',
    scrollTrigger: {
      trigger: scrollArea,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5,
      onUpdate: (self) => updateUI(self.progress)
    }
  })
  mainST = tween.scrollTrigger

  createDots()
  updateUI(0)
}

function onResize() {
  vw = window.innerWidth
  vh = window.innerHeight
  if (scrollArea) scrollArea.style.height = ROWS * 100 + 'vh'
  if (mainST) mainST.refresh()
  lastRow = -1; lastCol = -1
}

/* ═══════ 键盘导航 ═══════ */
function onKeydown(e: KeyboardEvent) {
  const step = 0.06
  const total = (ROWS - 1) * vh
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
    e.preventDefault()
    window.scrollBy({ top: step * total, behavior: 'smooth' })
  } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
    e.preventDefault()
    window.scrollBy({ top: -step * total, behavior: 'smooth' })
  }
}

function destroy() {
  mainST?.kill()
  mainST = null
  window.removeEventListener('resize', onResize)
  document.removeEventListener('keydown', onKeydown)
}

onMounted(() => {
  nextTick(init)
  window.addEventListener('resize', onResize)
  document.addEventListener('keydown', onKeydown)
})
onUnmounted(destroy)
</script>

<template>
  <div class="drift-page">
    <!-- 进度条 -->
    <div id="driftProgressBar" class="drift-progress-bar"></div>

    <!-- 行列导航点 -->
    <nav id="driftRowDots" class="drift-row-dots"></nav>
    <nav id="driftColDots" class="drift-col-dots"></nav>

    <!-- 滚动空间 -->
    <div id="driftScrollArea" class="drift-scroll-area">
      <!-- 吸顶视口 -->
      <div class="drift-viewport">
        <!-- 网格轨道（被 GSAP 对角平移） -->
        <div id="driftTrack" class="drift-track">
          <section
            v-for="i in N"
            :key="i"
            class="drift-cell"
            :class="'cell' + (i - 1)"
          >
            <span class="drift-num">{{ String(i).padStart(2, '0') }}</span>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$bg: #08080f;
$accent: #7c8cfc;

.drift-page {
  font-family: system-ui, -apple-system, sans-serif;
  background: $bg;
}

/* ═══════ 滚动空间 ═══════ */
.drift-scroll-area { position: relative; }

/* ═══════ 吸顶视口 ═══════ */
.drift-viewport {
  position: sticky;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

/* ═══════ 网格轨道 ═══════ */
.drift-track {
  display: grid;
  grid-template-columns: repeat(4, 100vw);
  grid-template-rows: repeat(5, 100vh);
  will-change: transform;
}

/* ═══════ 单元格 ═══════ */
.drift-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.drift-num {
  font-size: 5rem;
  font-weight: 900;
  color: rgba(26, 26, 46, 0.08);
  pointer-events: none;
  user-select: none;
}

/* ═══════ 单元格背景色（行列渐变色轮） ═══════ */
@for $ri from 0 through 4 {
  @for $ci from 0 through 3 {
    $i: $ri * 4 + $ci;
    $hue: $ri * 30 + $ci * 15;
    .cell#{$i} {
      background: linear-gradient(
        135deg,
        hsl($hue, 30%, 7%),
        hsl($hue + 20, 35%, 12%),
        hsl($hue + 40, 25%, 92%)
      );
      &::before {
        content: '';
        position: absolute;
        inset: 16px;
        border: 1px solid hsla($hue, 40%, 50%, 0.1);
        border-radius: 16px;
        pointer-events: none;
      }
    }
  }
}

/* ═══════ 响应式 ═══════ */
@media (max-width: 600px) {
  .drift-num { font-size: 3rem; }
}
</style>

<style lang="scss">
$accent: #7c8cfc;

/* ═══════ 进度条 ═══════ */
.drift-progress-bar {
  position: fixed;
  top: 0; left: 0;
  height: 3px;
  width: 0%;
  background: linear-gradient(90deg, $accent, #a78bfa, #f472b6);
  z-index: 1001;
}

/* ═══════ 行导航点（右侧垂直居中） ═══════ */
#driftRowDots {
  position: fixed;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* ═══════ 列导航点（底部水平居中） ═══════ */
#driftColDots {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: row;
  gap: 12px;
}

/* ═══════ 通用导航点 ═══════ */
.drift-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(26, 26, 46, 0.15);
  cursor: pointer;
  border: 2px solid transparent;
  padding: 0;
  transition: all 0.3s;
  &:hover {
    background: rgba(26, 26, 46, 0.4);
    transform: scale(1.3);
  }
  &.drift-active {
    background: $accent;
    border-color: rgba(26, 26, 46, 0.35);
    transform: scale(1.4);
    box-shadow: 0 0 16px rgba($accent, 0.45);
  }
}
</style>
