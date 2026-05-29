<script setup lang="ts">
/**
 * ==================== 滚动轨道旋转 ====================
 * 全视口网格中，scroll 驱动整个网格绕中心旋转，
 * 内圈角速度快、外圈角速度慢（类星系旋转曲线）。
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const ROWS = 4
const COLS = 4
const N = ROWS * COLS
const MAX_ANGLE = 720 // 总旋转角度(度)

let vw = 0, vh = 0

let scrollArea: HTMLElement | null = null
let track: HTMLElement | null = null
let progressBar: HTMLElement | null = null
let mainST: ScrollTrigger | null = null

function createDots() {
  const rd = document.getElementById('sogRowDots')
  const cd = document.getElementById('sogColDots')
  if (rd) {
    rd.innerHTML = ''
    for (let i = 0; i < ROWS; i++) {
      const d = document.createElement('button')
      d.className = 'sog-dot'
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
      d.className = 'sog-dot'
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
    document.querySelectorAll('#sogRowDots .sog-dot').forEach((d, i) => d.classList.toggle('sog-active', i === r))
    document.querySelectorAll('#sogColDots .sog-dot').forEach((d, i) => d.classList.toggle('sog-active', i === c))
    document.querySelectorAll('.sog-cur-r').forEach(el => el.textContent = String(r + 1))
    document.querySelectorAll('.sog-cur-c').forEach(el => el.textContent = String(c + 1))
  }
  if (progressBar) progressBar.style.width = (progress * 100) + '%'

  const totalRad = progress * MAX_ANGLE * Math.PI / 180
  const centerCol = (COLS - 1) / 2
  const centerRow = (ROWS - 1) / 2
  const maxDist = Math.sqrt(centerCol * centerCol + centerRow * centerRow)

  // 旋转整个 track
  if (track) {
    track.style.transform = `rotate(${(totalRad * 180 / Math.PI).toFixed(1)}deg)`
  }

  // 每格独立调整亮度和 counter-rotate
  const cells = gsap.utils.toArray('.sog-cell') as HTMLElement[]
  cells.forEach((el, i) => {
    const ri = Math.floor(i / COLS)
    const ci = i % COLS
    const dx = ci - centerCol
    const dy = ri - centerRow
    const dist = Math.sqrt(dx * dx + dy * dy)
    const normD = maxDist > 0 ? dist / maxDist : 0
    const speedF = Math.pow(Math.max(0.2, 1 - normD), 0.6)

    // counter-rotate 内圈快
    const counterAngle = -totalRad * speedF
    const glow = 0.3 + 0.7 * speedF

    el.style.transform = `rotate(${counterAngle.toFixed(2)}deg)`
    el.style.filter = `brightness(${glow.toFixed(2)})`
    el.style.zIndex = String(1 + Math.round(speedF * 9))
    el.classList.toggle('sog-hot', speedF > 0.8)
  })
}

function init() {
  vw = window.innerWidth; vh = window.innerHeight
  lastRow = -1; lastCol = -1
  scrollArea = document.getElementById('sogScrollArea') as HTMLElement
  track = document.getElementById('sogTrack') as HTMLElement
  progressBar = document.getElementById('sogProgressBar')
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
  <div class="sog-page">
    <div id="sogProgressBar" class="sog-progress-bar"></div>
    <nav id="sogRowDots" class="sog-row-dots"></nav>
    <nav id="sogColDots" class="sog-col-dots"></nav>
    <div class="sog-indicator">
      (<span class="sog-cur-r">1</span>, <span class="sog-cur-c">1</span>) / {{ ROWS }}×{{ COLS }}
    </div>

    <div id="sogScrollArea" class="sog-scroll-area">
      <div class="sog-viewport">
        <div id="sogTrack" class="sog-track">
          <section
            v-for="i in N" :key="i"
            class="sog-cell"
            :class="'sog-c' + (i - 1)"
          >
            <span class="sog-num">{{ String(i).padStart(2, '0') }}</span>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$bg: #05050c;
.sog-page { font-family: system-ui, -apple-system, sans-serif; background: $bg; }
.sog-scroll-area { position: relative; }
.sog-viewport {
  position: sticky; top: 0; width: 100vw; height: 100vh; overflow: hidden;
}
.sog-track {
  display: grid;
  grid-template-columns: repeat(4, 100vw);
  grid-template-rows: repeat(4, 100vh);
  will-change: transform;
}
.sog-cell {
  display: flex; align-items: center; justify-content: center;
  position: relative; overflow: hidden;
  will-change: transform, filter;
}
.sog-num {
  font-size: 5rem; font-weight: 900;
  color: rgba(26, 26, 46,0.08); pointer-events: none; user-select: none;
}

@for $ri from 0 through 3 {
  @for $ci from 0 through 3 {
    $i: $ri * 4 + $ci;
    $hue: 210 + $ri * 20 + $ci * 15;
    .sog-c#{$i} {
      background: linear-gradient(135deg, hsl($hue,30%,7%), hsl($hue+20,35%,12%), hsl($hue+40, 25%, 92%));
      &::before {
        content: ''; position: absolute; inset: 16px;
        border: 1px solid hsla($hue,40%,50%,0.1); border-radius: 16px; pointer-events: none;
      }
    }
  }
}

.sog-cell.sog-hot {
  &::before { border-color: rgba(180,200,255,0.25); }
  .sog-num { color: rgba(170,200,255,0.16); }
}

@media (max-width: 600px) {
  .sog-num { font-size: 3rem; }
}
</style>

<style lang="scss">
$accent: #8af;
.sog-progress-bar {
  position: fixed; top: 0; left: 0; height: 3px; width: 0%;
  background: linear-gradient(90deg, $accent, #c8f, #f8c);
  z-index: 1001;
}
#sogRowDots {
  position: fixed; right: 24px; top: 50%; transform: translateY(-50%);
  z-index: 1000; display: flex; flex-direction: column; gap: 12px;
}
#sogColDots {
  position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
  z-index: 1000; display: flex; flex-direction: row; gap: 12px;
}
.sog-dot {
  width: 10px; height: 10px; border-radius: 50%;
  background: rgba(26, 26, 46,0.15); cursor: pointer;
  border: 2px solid transparent; padding: 0; transition: all 0.3s;
  &:hover { background: rgba(26, 26, 46,0.4); transform: scale(1.3); }
  &.sog-active {
    background: $accent; border-color: rgba(26, 26, 46,0.35);
    transform: scale(1.4); box-shadow: 0 0 16px rgba($accent, 0.45);
  }
}
.sog-indicator {
  position: fixed; top: 20px; right: 20px; z-index: 1000;
  background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(8px);
  padding: 6px 18px; border-radius: 20px; font-size: 0.8rem;
  color: rgba(26, 26, 46,0.7); border: 1px solid rgba(255,255,255,0.08);
  .sog-cur-r { color: $accent; font-weight: 700; }
  .sog-cur-c { color: #c8f; font-weight: 700; }
}
</style>
