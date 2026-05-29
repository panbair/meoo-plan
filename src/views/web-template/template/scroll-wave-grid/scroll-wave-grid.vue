<script setup lang="ts">
/**
 * ==================== 滚动行波网格 ====================
 * 全视口网格中，scroll 推动波峰扫过行，
 * 波峰附近的格子产生 sin 位移上下波动，远离波峰静止。
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const ROWS = 5
const COLS = 4
const N = ROWS * COLS
const WAVE_SPREAD = 1.6 // 波影响范围(行单位)
const WAVE_AMP = 0.18   // 最大位移(比例)
const WAVE_FREQ = 2.2   // 空间频率

let vw = 0, vh = 0

let scrollArea: HTMLElement | null = null
let track: HTMLElement | null = null
let progressBar: HTMLElement | null = null
let mainST: ScrollTrigger | null = null

function createDots() {
  const rd = document.getElementById('swgRowDots')
  const cd = document.getElementById('swgColDots')
  if (rd) {
    rd.innerHTML = ''
    for (let i = 0; i < ROWS; i++) {
      const d = document.createElement('button')
      d.className = 'swg-dot'
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
      d.className = 'swg-dot'
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
    document.querySelectorAll('#swgRowDots .swg-dot').forEach((d, i) => d.classList.toggle('swg-active', i === r))
    document.querySelectorAll('#swgColDots .swg-dot').forEach((d, i) => d.classList.toggle('swg-active', i === c))
    document.querySelectorAll('.swg-cur-r').forEach(el => el.textContent = String(r + 1))
    document.querySelectorAll('.swg-cur-c').forEach(el => el.textContent = String(c + 1))
  }
  if (progressBar) progressBar.style.width = (progress * 100) + '%'

  const waveY = progress * (ROWS - 1 + WAVE_SPREAD * 2) - WAVE_SPREAD
  const cells = gsap.utils.toArray('.swg-cell') as HTMLElement[]
  cells.forEach((el, i) => {
    const ri = Math.floor(i / COLS)
    const dy = ri - waveY
    const absD = Math.abs(dy)
    const env = Math.max(0, 1 - absD / WAVE_SPREAD)
    const offset = Math.sin(dy * WAVE_FREQ * Math.PI) * WAVE_AMP * env * 100
    const s = 1 + 0.08 * env * (env > 0.3 ? 1 : env / 0.3)
    el.style.transform = `translateY(${offset.toFixed(1)}%) scale(${s.toFixed(3)})`
    el.style.zIndex = String(1 + Math.round(env * 6))
    el.classList.toggle('swg-peak', env > 0.7)
  })
}

function init() {
  vw = window.innerWidth; vh = window.innerHeight
  lastRow = -1; lastCol = -1
  scrollArea = document.getElementById('swgScrollArea') as HTMLElement
  track = document.getElementById('swgTrack') as HTMLElement
  progressBar = document.getElementById('swgProgressBar')
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
  <div class="swg-page">
    <div id="swgProgressBar" class="swg-progress-bar"></div>
    <nav id="swgRowDots" class="swg-row-dots"></nav>
    <nav id="swgColDots" class="swg-col-dots"></nav>
    <div class="swg-indicator">
      (<span class="swg-cur-r">1</span>, <span class="swg-cur-c">1</span>) / {{ ROWS }}×{{ COLS }}
    </div>

    <div id="swgScrollArea" class="swg-scroll-area">
      <div class="swg-viewport">
        <div id="swgTrack" class="swg-track">
          <section
            v-for="i in N" :key="i"
            class="swg-cell"
            :class="'swg-c' + (i - 1)"
          >
            <span class="swg-num">{{ String(i).padStart(2, '0') }}</span>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$bg: #06060e;
.swg-page { font-family: system-ui, -apple-system, sans-serif; background: $bg; }
.swg-scroll-area { position: relative; }
.swg-viewport {
  position: sticky; top: 0; width: 100vw; height: 100vh; overflow: hidden;
}
.swg-track {
  display: grid;
  grid-template-columns: repeat(4, 100vw);
  grid-template-rows: repeat(5, 100vh);
  will-change: transform;
}
.swg-cell {
  display: flex; align-items: center; justify-content: center;
  position: relative; overflow: hidden;
  will-change: transform;
}
.swg-num {
  font-size: 5rem; font-weight: 900;
  color: rgba(26, 26, 46,0.08); pointer-events: none; user-select: none;
}

@for $ri from 0 through 4 {
  @for $ci from 0 through 3 {
    $i: $ri * 4 + $ci;
    $hue: 180 + $ri * 25 + $ci * 15;
    .swg-c#{$i} {
      background: linear-gradient(135deg, hsl($hue,30%,7%), hsl($hue+20,35%,12%), hsl($hue+40, 25%, 92%));
      &::before {
        content: ''; position: absolute; inset: 16px;
        border: 1px solid hsla($hue,40%,50%,0.1); border-radius: 16px; pointer-events: none;
      }
    }
  }
}

.swg-cell.swg-peak {
  &::before { border-color: rgba(120,200,255,0.25); }
  .swg-num { color: rgba(120,200,255,0.18); }
}

@media (max-width: 600px) {
  .swg-num { font-size: 3rem; }
}
</style>

<style lang="scss">
$accent: #78c8ff;
.swg-progress-bar {
  position: fixed; top: 0; left: 0; height: 3px; width: 0%;
  background: linear-gradient(90deg, $accent, #a7f, #6cf);
  z-index: 1001;
}
#swgRowDots {
  position: fixed; right: 24px; top: 50%; transform: translateY(-50%);
  z-index: 1000; display: flex; flex-direction: column; gap: 12px;
}
#swgColDots {
  position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
  z-index: 1000; display: flex; flex-direction: row; gap: 12px;
}
.swg-dot {
  width: 10px; height: 10px; border-radius: 50%;
  background: rgba(26, 26, 46,0.15); cursor: pointer;
  border: 2px solid transparent; padding: 0; transition: all 0.3s;
  &:hover { background: rgba(26, 26, 46,0.4); transform: scale(1.3); }
  &.swg-active {
    background: $accent; border-color: rgba(26, 26, 46,0.35);
    transform: scale(1.4); box-shadow: 0 0 16px rgba($accent, 0.45);
  }
}
.swg-indicator {
  position: fixed; top: 20px; right: 20px; z-index: 1000;
  background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(8px);
  padding: 6px 18px; border-radius: 20px; font-size: 0.8rem;
  color: rgba(26, 26, 46,0.7); border: 1px solid rgba(255,255,255,0.08);
  .swg-cur-r { color: $accent; font-weight: 700; }
  .swg-cur-c { color: #a7f; font-weight: 700; }
}
</style>
