<script setup lang="ts">
/**
 * ==================== 滚动扫描揭示 ====================
 * 全视口网格中，scroll 推动一条水平扫描线扫过格子，
 * 线上方全亮(scale=1)、线下方暗隐(scale=0.4)，
 * 过渡带锐利如雷达/声纳扫描。
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const ROWS = 5
const COLS = 4
const N = ROWS * COLS
const BLEND = 0.07 // 扫描线过渡带宽度(行单位)

let vw = 0, vh = 0

let scrollArea: HTMLElement | null = null
let track: HTMLElement | null = null
let progressBar: HTMLElement | null = null
let mainST: ScrollTrigger | null = null

function createDots() {
  const rd = document.getElementById('ssrRowDots')
  const cd = document.getElementById('ssrColDots')
  if (rd) {
    rd.innerHTML = ''
    for (let i = 0; i < ROWS; i++) {
      const d = document.createElement('button')
      d.className = 'ssr-dot'
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
      d.className = 'ssr-dot'
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
    document.querySelectorAll('#ssrRowDots .ssr-dot').forEach((d, i) => d.classList.toggle('ssr-active', i === r))
    document.querySelectorAll('#ssrColDots .ssr-dot').forEach((d, i) => d.classList.toggle('ssr-active', i === c))
    document.querySelectorAll('.ssr-cur-r').forEach(el => el.textContent = String(r + 1))
    document.querySelectorAll('.ssr-cur-c').forEach(el => el.textContent = String(c + 1))
  }
  if (progressBar) progressBar.style.width = (progress * 100) + '%'

  const lineY = progress * (ROWS - 1)
  const cells = gsap.utils.toArray('.ssr-cell') as HTMLElement[]
  cells.forEach((el, i) => {
    const ri = Math.floor(i / COLS)
    const dist = (ri + 0.5) - (lineY + 0.5)
    const absNorm = Math.abs(dist) / BLEND

    if (absNorm <= 1) {
      const t = absNorm * absNorm * (3 - 2 * absNorm)
      const s = 0.35 + 0.65 * (1 - t)
      const o = 0.06 + 0.94 * (1 - t)
      el.style.transform = `scale(${s.toFixed(3)})`
      el.style.opacity = String(Math.round(o * 1000) / 1000)
      el.style.zIndex = String(1 + Math.round((1 - t) * 8))
      el.classList.toggle('ssr-glow', t < 0.4)
    } else if (dist > 0) {
      el.style.transform = 'scale(0.35)'
      el.style.opacity = '0.06'
      el.style.zIndex = '0'
      el.classList.remove('ssr-glow')
    } else {
      el.style.transform = 'scale(1)'
      el.style.opacity = '1'
      el.style.zIndex = '1'
      el.classList.remove('ssr-glow')
    }
  })
}

function init() {
  vw = window.innerWidth; vh = window.innerHeight
  lastRow = -1; lastCol = -1
  scrollArea = document.getElementById('ssrScrollArea') as HTMLElement
  track = document.getElementById('ssrTrack') as HTMLElement
  progressBar = document.getElementById('ssrProgressBar')
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
  <div class="ssr-page">
    <div id="ssrProgressBar" class="ssr-progress-bar"></div>
    <nav id="ssrRowDots" class="ssr-row-dots"></nav>
    <nav id="ssrColDots" class="ssr-col-dots"></nav>
    <div class="ssr-indicator">
      (<span class="ssr-cur-r">1</span>, <span class="ssr-cur-c">1</span>) / {{ ROWS }}×{{ COLS }}
    </div>

    <div id="ssrScrollArea" class="ssr-scroll-area">
      <div class="ssr-viewport">
        <div id="ssrTrack" class="ssr-track">
          <section
            v-for="i in N" :key="i"
            class="ssr-cell"
            :class="'ssr-c' + (i - 1)"
          >
            <span class="ssr-num">{{ String(i).padStart(2, '0') }}</span>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$bg: #04040a;
.ssr-page { font-family: system-ui, -apple-system, sans-serif; background: $bg; }
.ssr-scroll-area { position: relative; }
.ssr-viewport {
  position: sticky; top: 0; width: 100vw; height: 100vh; overflow: hidden;
}
.ssr-track {
  display: grid;
  grid-template-columns: repeat(4, 100vw);
  grid-template-rows: repeat(5, 100vh);
  will-change: transform;
}
.ssr-cell {
  display: flex; align-items: center; justify-content: center;
  position: relative; overflow: hidden;
}
.ssr-num {
  font-size: 5rem; font-weight: 900;
  color: rgba(255,255,255,0.08); pointer-events: none; user-select: none;
}

@for $ri from 0 through 4 {
  @for $ci from 0 through 3 {
    $i: $ri * 4 + $ci;
    $hue: 240 + $ri * 18 + $ci * 12;
    .ssr-c#{$i} {
      background: linear-gradient(135deg, hsl($hue,30%,7%), hsl($hue+15,35%,12%), hsl($hue+30,25%,8%));
      &::before {
        content: ''; position: absolute; inset: 16px;
        border: 1px solid hsla($hue,40%,50%,0.1); border-radius: 16px; pointer-events: none;
      }
    }
  }
}

.ssr-cell.ssr-glow {
  &::before { border-color: rgba(140,180,255,0.35); box-shadow: inset 0 0 60px rgba(100,150,255,0.15); }
  .ssr-num { color: rgba(140,180,255,0.2); }
}

@media (max-width: 600px) {
  .ssr-num { font-size: 3rem; }
}
</style>

<style lang="scss">
$accent: #69f;
.ssr-progress-bar {
  position: fixed; top: 0; left: 0; height: 3px; width: 0%;
  background: linear-gradient(90deg, $accent, #8af, #a9f);
  z-index: 1001;
}
#ssrRowDots {
  position: fixed; right: 24px; top: 50%; transform: translateY(-50%);
  z-index: 1000; display: flex; flex-direction: column; gap: 12px;
}
#ssrColDots {
  position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
  z-index: 1000; display: flex; flex-direction: row; gap: 12px;
}
.ssr-dot {
  width: 10px; height: 10px; border-radius: 50%;
  background: rgba(255,255,255,0.15); cursor: pointer;
  border: 2px solid transparent; padding: 0; transition: all 0.3s;
  &:hover { background: rgba(255,255,255,0.4); transform: scale(1.3); }
  &.ssr-active {
    background: $accent; border-color: rgba(255,255,255,0.35);
    transform: scale(1.4); box-shadow: 0 0 16px rgba($accent, 0.45);
  }
}
.ssr-indicator {
  position: fixed; top: 20px; right: 20px; z-index: 1000;
  background: rgba(0,0,0,0.5); backdrop-filter: blur(8px);
  padding: 6px 18px; border-radius: 20px; font-size: 0.8rem;
  color: rgba(255,255,255,0.7); border: 1px solid rgba(255,255,255,0.08);
  .ssr-cur-r { color: $accent; font-weight: 700; }
  .ssr-cur-c { color: #8af; font-weight: 700; }
}
</style>
