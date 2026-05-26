<script setup lang="ts">
/**
 * ==================== 滚动钟摆网格 ====================
 * 全视口网格中，每格绕自身中心做钟摆式 rotateZ 摆动，
 * scroll 控制摆动幅度(0→max→0)，行列相位差形成对角线穿波效果。
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const ROWS = 4
const COLS = 5
const N = ROWS * COLS
const MAX_ANGLE = 20    // 最大摆角(度)
const FREQ = 2.5        // 钟摆频率(相对 scroll 进度)
const ROW_PHASE = 0.8   // 行间相位差
const COL_PHASE = 1.3   // 列间相位差

let vw = 0, vh = 0

let scrollArea: HTMLElement | null = null
let track: HTMLElement | null = null
let progressBar: HTMLElement | null = null
let mainST: ScrollTrigger | null = null

function createDots() {
  const rd = document.getElementById('spgRowDots')
  const cd = document.getElementById('spgColDots')
  if (rd) {
    rd.innerHTML = ''
    for (let i = 0; i < ROWS; i++) {
      const d = document.createElement('button')
      d.className = 'spg-dot'
      d.addEventListener('click', () => {
        window.scrollTo({ top: (i / (ROWS - 1)) * (ROWS - 1) * vh, behavior: 'smooth' })
      })
      rd.appendChild(d)
    }
  }
  if (cd) {
    cd.innerHTML = ''
    for (let i = 0; i < COLS; i++) {
      const d = document.createElement('button')
      d.className = 'spg-dot'
      d.addEventListener('click', () => {
        window.scrollTo({ top: (i / (COLS - 1)) * (ROWS - 1) * vh, behavior: 'smooth' })
      })
      cd.appendChild(d)
    }
  }
}

let lastRow = -1, lastCol = -1
function updateUI(progress: number) {
  const r = Math.round(progress * (ROWS - 1))
  const c = Math.round(progress * (COLS - 1))
  if (r !== lastRow || c !== lastCol) {
    lastRow = r; lastCol = c
    document.querySelectorAll('#spgRowDots .spg-dot').forEach((d, i) => d.classList.toggle('spg-active', i === r))
    document.querySelectorAll('#spgColDots .spg-dot').forEach((d, i) => d.classList.toggle('spg-active', i === c))
    document.querySelectorAll('.spg-cur-r').forEach(el => el.textContent = String(r + 1))
    document.querySelectorAll('.spg-cur-c').forEach(el => el.textContent = String(c + 1))
  }
  if (progressBar) progressBar.style.width = (progress * 100) + '%'

  // 振幅轮廓：sin(πp) — 0%和100%静止，50%最大
  const amp = Math.sin(progress * Math.PI) * MAX_ANGLE
  const cells = gsap.utils.toArray('.spg-cell') as HTMLElement[]
  cells.forEach((el, i) => {
    const ri = Math.floor(i / COLS)
    const ci = i % COLS
    const phase = ri * ROW_PHASE + ci * COL_PHASE
    const angle = Math.sin(progress * FREQ * Math.PI * 2 + phase) * amp
    const absA = Math.abs(angle)
    el.style.transform = `rotateZ(${angle.toFixed(2)}deg)`
    el.style.filter = `brightness(${(1 + 0.6 * absA / MAX_ANGLE).toFixed(2)})`
    el.style.zIndex = String(1 + Math.round(absA / MAX_ANGLE * 6))
    el.classList.toggle('spg-swing', absA > MAX_ANGLE * 0.7)
  })
}

function init() {
  vw = window.innerWidth; vh = window.innerHeight
  lastRow = -1; lastCol = -1
  scrollArea = document.getElementById('spgScrollArea') as HTMLElement
  track = document.getElementById('spgTrack') as HTMLElement
  progressBar = document.getElementById('spgProgressBar')
  if (!scrollArea || !track) return

  scrollArea.style.height = ROWS * 100 + 'vh'

  const tween = gsap.to(track, {
    x: () => -(COLS - 1) * vw,
    y: () => -(ROWS - 1) * vh,
    ease: 'none',
    scrollTrigger: {
      trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.5,
      onUpdate: (self) => updateUI(self.progress)
    }
  })
  mainST = tween.scrollTrigger
  createDots()
  updateUI(0)
}

function onResize() {
  vw = window.innerWidth; vh = window.innerHeight
  if (scrollArea) scrollArea.style.height = ROWS * 100 + 'vh'
  mainST?.refresh()
  lastRow = -1; lastCol = -1
}

function onKeydown(e: KeyboardEvent) {
  const step = 0.06; const total = (ROWS - 1) * vh
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); window.scrollBy({ top: step * total, behavior: 'smooth' }) }
  else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); window.scrollBy({ top: -step * total, behavior: 'smooth' }) }
}

function destroy() {
  mainST?.kill(); mainST = null
  window.removeEventListener('resize', onResize)
  document.removeEventListener('keydown', onKeydown)
}

onMounted(() => { nextTick(init); window.addEventListener('resize', onResize); document.addEventListener('keydown', onKeydown) })
onUnmounted(destroy)
</script>

<template>
  <div class="spg-page">
    <div id="spgProgressBar" class="spg-progress-bar"></div>
    <nav id="spgRowDots" class="spg-row-dots"></nav>
    <nav id="spgColDots" class="spg-col-dots"></nav>
    <div class="spg-indicator">
      (<span class="spg-cur-r">1</span>, <span class="spg-cur-c">1</span>) / {{ ROWS }}×{{ COLS }}
    </div>

    <div id="spgScrollArea" class="spg-scroll-area">
      <div class="spg-viewport">
        <div id="spgTrack" class="spg-track">
          <section
            v-for="i in N" :key="i"
            class="spg-cell"
            :class="'spg-c' + (i - 1)"
          >
            <span class="spg-num">{{ String(i).padStart(2, '0') }}</span>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$bg: #070710;
.spg-page { font-family: system-ui, -apple-system, sans-serif; background: $bg; }
.spg-scroll-area { position: relative; }
.spg-viewport {
  position: sticky; top: 0; width: 100vw; height: 100vh; overflow: hidden;
}
.spg-track {
  display: grid;
  grid-template-columns: repeat(5, 100vw);
  grid-template-rows: repeat(4, 100vh);
  will-change: transform;
}
.spg-cell {
  display: flex; align-items: center; justify-content: center;
  position: relative; overflow: hidden;
  will-change: transform, filter;
}
.spg-num {
  font-size: 5rem; font-weight: 900;
  color: rgba(255,255,255,0.08); pointer-events: none; user-select: none;
}

@for $ri from 0 through 3 {
  @for $ci from 0 through 4 {
    $i: $ri * 5 + $ci;
    $hue: 20 + $ri * 25 + $ci * 16;
    .spg-c#{$i} {
      background: linear-gradient(135deg, hsl($hue,30%,7%), hsl($hue+18,35%,12%), hsl($hue+36,25%,8%));
      &::before {
        content: ''; position: absolute; inset: 16px;
        border: 1px solid hsla($hue,40%,50%,0.1); border-radius: 16px; pointer-events: none;
      }
    }
  }
}

.spg-cell.spg-swing {
  &::before { border-color: rgba(255,200,120,0.3); }
  .spg-num { color: rgba(255,190,100,0.16); }
}

@media (max-width: 600px) {
  .spg-num { font-size: 3rem; }
}
</style>

<style lang="scss">
$accent: #fa0;
.spg-progress-bar {
  position: fixed; top: 0; left: 0; height: 3px; width: 0%;
  background: linear-gradient(90deg, $accent, #fc6, #f84);
  z-index: 1001;
}
#spgRowDots {
  position: fixed; right: 24px; top: 50%; transform: translateY(-50%);
  z-index: 1000; display: flex; flex-direction: column; gap: 12px;
}
#spgColDots {
  position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
  z-index: 1000; display: flex; flex-direction: row; gap: 12px;
}
.spg-dot {
  width: 10px; height: 10px; border-radius: 50%;
  background: rgba(255,255,255,0.15); cursor: pointer;
  border: 2px solid transparent; padding: 0; transition: all 0.3s;
  &:hover { background: rgba(255,255,255,0.4); transform: scale(1.3); }
  &.spg-active {
    background: $accent; border-color: rgba(255,255,255,0.35);
    transform: scale(1.4); box-shadow: 0 0 16px rgba($accent, 0.45);
  }
}
.spg-indicator {
  position: fixed; top: 20px; right: 20px; z-index: 1000;
  background: rgba(0,0,0,0.5); backdrop-filter: blur(8px);
  padding: 6px 18px; border-radius: 20px; font-size: 0.8rem;
  color: rgba(255,255,255,0.7); border: 1px solid rgba(255,255,255,0.08);
  .spg-cur-r { color: $accent; font-weight: 700; }
  .spg-cur-c { color: #fc6; font-weight: 700; }
}
</style>
