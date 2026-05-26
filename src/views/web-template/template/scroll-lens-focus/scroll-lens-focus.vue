<script setup lang="ts">
/**
 * ==================== 滚动聚焦透镜 ====================
 * 全视口网格中，scroll 推动一个"焦点行"扫掠，
 * 焦点行内的格子全亮(scale=1)，远离焦点渐暗渐缩。
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const ROWS = 4
const COLS = 4
const N = ROWS * COLS
const FOCUS_BAND = 0.65 // 焦点影响带宽度(行单位)

let vw = 0, vh = 0

let scrollArea: HTMLElement | null = null
let track: HTMLElement | null = null
let progressBar: HTMLElement | null = null
let mainST: ScrollTrigger | null = null

/* ─── 导航 ─── */
function createDots() {
  const rowDots = document.getElementById('slfRowDots')
  const colDots = document.getElementById('slfColDots')
  if (rowDots) {
    rowDots.innerHTML = ''
    for (let i = 0; i < ROWS; i++) {
      const d = document.createElement('button')
      d.className = 'slf-dot'
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
      d.className = 'slf-dot'
      d.addEventListener('click', () => {
        window.scrollTo({ top: (i / (COLS - 1)) * (ROWS - 1) * vh, behavior: 'smooth' })
      })
      colDots.appendChild(d)
    }
  }
}

let lastRow = -1, lastCol = -1
function updateUI(progress: number) {
  const r = Math.round(progress * (ROWS - 1))
  const c = Math.round(progress * (COLS - 1))
  if (r !== lastRow || c !== lastCol) {
    lastRow = r; lastCol = c
    const rd = document.querySelectorAll('#slfRowDots .slf-dot')
    const cd = document.querySelectorAll('#slfColDots .slf-dot')
    rd.forEach((d, i) => d.classList.toggle('slf-active', i === r))
    cd.forEach((d, i) => d.classList.toggle('slf-active', i === c))
    document.querySelectorAll('.slf-cur-r').forEach(el => el.textContent = String(r + 1))
    document.querySelectorAll('.slf-cur-c').forEach(el => el.textContent = String(c + 1))
  }
  if (progressBar) progressBar.style.width = (progress * 100) + '%'

  // 更新格子 opacity/scale（焦点透镜效果）
  const focusRow = progress * (ROWS - 1)
  const cells = gsap.utils.toArray('.slf-cell') as HTMLElement[]
  cells.forEach((el, i) => {
    const ri = Math.floor(i / COLS)
    const dist = Math.abs(ri - focusRow) / FOCUS_BAND
    const t = Math.max(0, 1 - dist)
    const ease = t * t * (3 - 2 * t)
    const s = 0.45 + 0.55 * ease
    const o = 0.12 + 0.88 * ease
    el.style.transform = `scale(${s.toFixed(3)})`
    el.style.opacity = String(Math.round(o * 1000) / 1000)
    el.classList.toggle('slf-focus', t > 0.6)
  })
}

/* ─── 初始化 ─── */
function init() {
  vw = window.innerWidth; vh = window.innerHeight
  lastRow = -1; lastCol = -1
  scrollArea = document.getElementById('slfScrollArea') as HTMLElement
  track = document.getElementById('slfTrack') as HTMLElement
  progressBar = document.getElementById('slfProgressBar')
  if (!scrollArea || !track) return

  scrollArea.style.height = ROWS * 100 + 'vh'

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
  vw = window.innerWidth; vh = window.innerHeight
  if (scrollArea) scrollArea.style.height = ROWS * 100 + 'vh'
  mainST?.refresh()
  lastRow = -1; lastCol = -1
}

function onKeydown(e: KeyboardEvent) {
  const step = 0.06
  const total = (ROWS - 1) * vh
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
    e.preventDefault(); window.scrollBy({ top: step * total, behavior: 'smooth' })
  } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
    e.preventDefault(); window.scrollBy({ top: -step * total, behavior: 'smooth' })
  }
}

function destroy() {
  mainST?.kill(); mainST = null
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
  <div class="slf-page">
    <div id="slfProgressBar" class="slf-progress-bar"></div>
    <nav id="slfRowDots" class="slf-row-dots"></nav>
    <nav id="slfColDots" class="slf-col-dots"></nav>
    <div class="slf-indicator">
      (<span class="slf-cur-r">1</span>, <span class="slf-cur-c">1</span>) / {{ ROWS }}×{{ COLS }}
    </div>

    <div id="slfScrollArea" class="slf-scroll-area">
      <div class="slf-viewport">
        <div id="slfTrack" class="slf-track">
          <section
            v-for="i in N" :key="i"
            class="slf-cell"
            :class="'slf-c' + (i - 1)"
          >
            <span class="slf-num">{{ String(i).padStart(2, '0') }}</span>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$bg: #08080f;
.slf-page { font-family: system-ui, -apple-system, sans-serif; background: $bg; }
.slf-scroll-area { position: relative; }
.slf-viewport {
  position: sticky; top: 0; width: 100vw; height: 100vh; overflow: hidden;
}
.slf-track {
  display: grid;
  grid-template-columns: repeat(4, 100vw);
  grid-template-rows: repeat(4, 100vh);
  will-change: transform;
}
.slf-cell {
  display: flex; align-items: center; justify-content: center;
  position: relative; overflow: hidden;
}
.slf-num {
  font-size: 5rem; font-weight: 900;
  color: rgba(255,255,255,0.08); pointer-events: none; user-select: none;
}

@for $ri from 0 through 3 {
  @for $ci from 0 through 3 {
    $i: $ri * 4 + $ci;
    $hue: $ri * 35 + $ci * 20;
    .slf-c#{$i} {
      background: linear-gradient(135deg, hsl($hue,30%,7%), hsl($hue+20,35%,12%), hsl($hue+40,25%,8%));
      &::before {
        content: ''; position: absolute; inset: 16px;
        border: 1px solid hsla($hue,40%,50%,0.1); border-radius: 16px; pointer-events: none;
      }
    }
  }
}

.slf-cell.slf-focus {
  &::before { border-color: rgba(255,255,255,0.2); }
}

@media (max-width: 600px) {
  .slf-num { font-size: 3rem; }
}
</style>

<style lang="scss">
$accent: #6cf;
.slf-progress-bar {
  position: fixed; top: 0; left: 0; height: 3px; width: 0%;
  background: linear-gradient(90deg, $accent, #a7f, #f6c);
  z-index: 1001;
}
#slfRowDots {
  position: fixed; right: 24px; top: 50%; transform: translateY(-50%);
  z-index: 1000; display: flex; flex-direction: column; gap: 12px;
}
#slfColDots {
  position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
  z-index: 1000; display: flex; flex-direction: row; gap: 12px;
}
.slf-dot {
  width: 10px; height: 10px; border-radius: 50%;
  background: rgba(255,255,255,0.15); cursor: pointer;
  border: 2px solid transparent; padding: 0; transition: all 0.3s;
  &:hover { background: rgba(255,255,255,0.4); transform: scale(1.3); }
  &.slf-active {
    background: $accent; border-color: rgba(255,255,255,0.35);
    transform: scale(1.4); box-shadow: 0 0 16px rgba($accent, 0.45);
  }
}
.slf-indicator {
  position: fixed; top: 20px; right: 20px; z-index: 1000;
  background: rgba(0,0,0,0.5); backdrop-filter: blur(8px);
  padding: 6px 18px; border-radius: 20px; font-size: 0.8rem;
  color: rgba(255,255,255,0.7); border: 1px solid rgba(255,255,255,0.08);
  .slf-cur-r { color: $accent; font-weight: 700; }
  .slf-cur-c { color: #f6c; font-weight: 700; }
}
</style>
