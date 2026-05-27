<script setup lang="ts">
/**
 * ==================== Scroll U-Turn ====================
 * U型回转 —— 三阶段 ↓→↑ 路径：
 *   阶段一：纵向下行(面板1~3)
 *   阶段二：横向右移(面板3~5)
 *   阶段三：纵向上行(面板5~7)
 *
 * 布局：
 *   01               07
 *   02               06
 *   03 → 04 → 05 ──↑
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

// 下行3 + 横移3(含转折面板) + 上行3(含转折面板) = 7
const DOWN = 3
const RIGHT = 3
const UP = 3
const TOTAL = DOWN + (RIGHT - 1) + (UP - 1) // 7

// 每个面板的 (col, row) 坐标
// 下行: (0,0)(0,1)(0,2)
// 横移: (1,2)(2,2)
// 上行: (2,1)(2,0)
const PATH: Array<[number, number]> = [
  [0, 0], [0, 1], [0, 2], // ↓ 下行
  [1, 2], [2, 2],          // → 横移
  [2, 1], [2, 0],          // ↑ 上行
]

let currentIndex = 0
let vw = 0
let vh = 0
let scrollArea: HTMLElement | null = null
let track: HTMLElement | null = null
let progressBar: HTMLElement | null = null
let navDots: HTMLElement | null = null
let mainST: ScrollTrigger | null = null

function createNavDots() {
  if (!navDots) {
    return
  }
  navDots.innerHTML = ''
  for (let i = 0; i < TOTAL; i++) {
    const dot = document.createElement('button')
    dot.className = 'utn-dot' + (i === 0 ? ' utn-active' : '')
    dot.addEventListener('click', () => goTo(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.utn-dot').forEach((d, i) => {
    d.classList.toggle('utn-active', i === index)
  })
  const el = document.querySelector('.utn-indicator .utn-cur')
  if (el) {
    el.textContent = String(index + 1)
  }
  const phaseEl = document.querySelector('.utn-indicator .utn-phase')
  if (phaseEl) {
    if (index < DOWN) {
      phaseEl.textContent = '↓'
    } else if (index < DOWN + RIGHT - 1) {
      phaseEl.textContent = '→'
    } else {
      phaseEl.textContent = '↑'
    }
  }
  if (progressBar) {
    progressBar.style.width = ((index + 1) / TOTAL) * 100 + '%'
  }
}

function goTo(index: number) {
  index = Math.max(0, Math.min(index, TOTAL - 1))
  gsap.to(window, {
    scrollTo: { y: index * window.innerHeight, autoKill: false },
    duration: 0.6,
    ease: 'power2.inOut',
  })
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
    e.preventDefault()
    goTo(currentIndex + 1)
  } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
    e.preventDefault()
    goTo(currentIndex - 1)
  }
}

function init() {
  vw = window.innerWidth
  vh = window.innerHeight

  scrollArea = document.getElementById('utnArea') as HTMLElement
  track = document.getElementById('utnTrack') as HTMLElement
  progressBar = document.getElementById('utnProgress')
  navDots = document.getElementById('utnNav')
  if (!scrollArea || !track) {
    return
  }

  scrollArea.style.height = TOTAL * 100 + 'vh'

  ScrollTrigger.create({
    trigger: scrollArea,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.5,
    onUpdate: (self) => {
      const p = self.progress
      const floatIdx = p * (TOTAL - 1)
      const segIdx = Math.min(Math.floor(floatIdx), TOTAL - 2)
      const segProg = floatIdx - segIdx

      const [cx, cy] = PATH[segIdx]
      const [nx, ny] = PATH[segIdx + 1]

      const tx = -(cx + (nx - cx) * segProg) * vw
      const ty = -(cy + (ny - cy) * segProg) * vh

      if (track) {
        track.style.transform = `translate(${tx}px, ${ty}px)`
      }

      const idx = Math.round(floatIdx)
      if (idx !== currentIndex) {
        currentIndex = idx
        updateUI(idx)
      }
    },
  })

  mainST = ScrollTrigger.getAll()[ScrollTrigger.getAll().length - 1]
  window.addEventListener('resize', onResize)
  document.addEventListener('keydown', onKeydown)
  createNavDots()
  updateUI(0)
}

function onResize() {
  vw = window.innerWidth
  vh = window.innerHeight
  if (mainST) {
    mainST.refresh()
  }
}

function destroy() {
  mainST?.kill()
  mainST = null
  window.removeEventListener('resize', onResize)
  document.removeEventListener('keydown', onKeydown)
}

onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>

<template>
  <div class="utn-page">
    <div id="utnProgress" class="utn-progress-bar"></div>
    <nav id="utnNav" class="utn-nav-dots"></nav>
    <div class="utn-indicator">
      <span class="utn-phase">↓</span>
      <span class="utn-cur">1</span>
      <span class="utn-tot"> / {{ TOTAL }}</span>
    </div>

    <div id="utnArea" class="utn-scroll-area">
      <div class="utn-viewport">
        <div id="utnTrack" class="utn-track">
          <section
            v-for="(pos, i) in PATH"
            :key="i"
            class="utn-panel"
            :style="{
              left: pos[0] * 100 + 'vw',
              top: pos[1] * 100 + 'vh',
              background: `linear-gradient(${145 + i * 28}deg, hsl(${190 + i * 24}, 52%, 30%), hsl(${210 + i * 24}, 38%, 16%))`,
            }"
          >
            <span class="utn-num">{{ String(i + 1).padStart(2, '0') }}</span>
            <div v-if="i === DOWN - 1" class="utn-hint utn-hint-right">→</div>
            <div v-if="i === DOWN + RIGHT - 2" class="utn-hint utn-hint-up">↑</div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.utn-page {
  font-family: system-ui, -apple-system, sans-serif;
  background: #08080f;
  color: #fff;
}

.utn-scroll-area {
  position: relative;
}

.utn-viewport {
  position: sticky;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.utn-track {
  position: relative;
  will-change: transform;
  width: 300vw;
  height: 300vh;
}

.utn-panel {
  position: absolute;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 24px;
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 20px;
    pointer-events: none;
  }
}

.utn-num {
  font-size: clamp(4rem, 10vw, 8rem);
  font-weight: 900;
  color: rgba(255, 255, 255, 0.05);
  user-select: none;
  pointer-events: none;
}

.utn-hint {
  position: absolute;
  font-size: 2rem;
  color: rgba(255, 255, 255, 0.12);
  pointer-events: none;
}

.utn-hint-right {
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
  animation: utn-px 1.5s ease-in-out infinite;
}

.utn-hint-up {
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  animation: utn-py 1.5s ease-in-out infinite;
}

@keyframes utn-px {
  0%,
  100% {
    transform: translateY(-50%) translateX(0);
  }
  50% {
    transform: translateY(-50%) translateX(8px);
  }
}

@keyframes utn-py {
  0%,
  100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(-8px);
  }
}
</style>

<style lang="scss">
$c-down: #38bdf8;
$c-right: #fbbf24;
$c-up: #a78bfa;

.utn-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  width: 0%;
  background: linear-gradient(90deg, $c-down, $c-right 50%, $c-up);
  z-index: 1001;
}

.utn-nav-dots {
  position: fixed;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  gap: 10px;
}

.utn-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  cursor: pointer;
  border: 2px solid transparent;
  padding: 0;
  transition: all 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.4);
    transform: scale(1.3);
  }

  &.utn-active {
    background: $c-down;
    border-color: rgba(255, 255, 255, 0.35);
    transform: scale(1.5);
    box-shadow: 0 0 14px rgba($c-down, 0.5);
  }
}

.utn-indicator {
  position: fixed;
  top: 28px;
  right: 28px;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(12px);
  padding: 8px 20px;
  border-radius: 24px;
  font-size: 0.85rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.75);
  display: flex;
  align-items: center;
  gap: 6px;

  .utn-phase {
    font-size: 1rem;
    font-weight: 700;
    color: $c-down;
  }

  .utn-cur {
    color: $c-down;
    font-weight: 700;
  }
}
</style>

