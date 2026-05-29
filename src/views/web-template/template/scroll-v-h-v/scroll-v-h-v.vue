<script setup lang="ts">
/**
 * ==================== Scroll V-H-V ====================
 * 纵横纵 —— 三阶段运动：
 *   阶段一(面板1~4)：竖滚 → 纵向平移
 *   阶段二(面板4~7)：竖滚 → 横向平移
 *   阶段三(面板7~10)：竖滚 → 纵向平移
 *
 * 布局（L型路径）：
 *   01
 *   02
 *   03
 *   04 → 05 → 06 → 07
 *                    08
 *                    09
 *                    10
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

// 阶段一：纵向 面板1~4
const V1 = 4
// 阶段二：横向 面板4~7（面板4共享）
const H = 4
// 阶段三：纵向 面板7~10（面板7共享）
const V2 = 4
// 总面板 = V1 + (H-1) + (V2-1) = 4+3+3 = 10
const TOTAL = V1 + (H - 1) + (V2 - 1)

let currentIndex = 0
let vw = 0
let vh = 0

let scrollArea: HTMLElement | null = null
let track: HTMLElement | null = null
let progressBar: HTMLElement | null = null
let navDots: HTMLElement | null = null
let mainST: ScrollTrigger | null = null

// 阶段分割点(progress)
const SPLIT1 = (V1 - 1) / (TOTAL - 1) // 面板4
const SPLIT2 = (V1 - 1 + H - 1) / (TOTAL - 1) // 面板7

function getPhase(index: number): 'v1' | 'h' | 'v2' {
  if (index < V1) {
    return 'v1'
  }
  if (index < V1 + H - 1) {
    return 'h'
  }
  return 'v2'
}

function createNavDots() {
  if (!navDots) {
    return
  }
  navDots.innerHTML = ''
  for (let i = 0; i < TOTAL; i++) {
    const dot = document.createElement('button')
    dot.className = 'vhv-dot' + (i === 0 ? ' vhv-active' : '')
    dot.setAttribute('data-phase', getPhase(i))
    dot.addEventListener('click', () => goTo(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.vhv-dot').forEach((d, i) => {
    d.classList.toggle('vhv-active', i === index)
  })
  const el = document.querySelector('.vhv-indicator .vhv-cur')
  if (el) {
    el.textContent = String(index + 1)
  }
  const phaseEl = document.querySelector('.vhv-indicator .vhv-phase')
  if (phaseEl) {
    const phase = getPhase(index)
    phaseEl.textContent = phase === 'h' ? '→' : '↓'
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

  scrollArea = document.getElementById('vhvArea') as HTMLElement
  track = document.getElementById('vhvTrack') as HTMLElement
  progressBar = document.getElementById('vhvProgress')
  navDots = document.getElementById('vhvNav')
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
      let tx = 0
      let ty = 0

      if (p <= SPLIT1) {
        // 阶段一：纵移 面板1→4
        const vProg = SPLIT1 > 0 ? p / SPLIT1 : 0
        ty = -vProg * (V1 - 1) * vh
      } else if (p <= SPLIT2) {
        // 阶段二：横移 面板4→7
        const hProg = (p - SPLIT1) / (SPLIT2 - SPLIT1)
        ty = -(V1 - 1) * vh // 纵向锁定在面板4
        tx = -hProg * (H - 1) * vw
      } else {
        // 阶段三：纵移 面板7→10
        const v2Prog = (p - SPLIT2) / (1 - SPLIT2)
        ty = -(V1 - 1) * vh - v2Prog * (V2 - 1) * vh // 从面板7继续向下
        tx = -(H - 1) * vw // 横向锁定在面板7列
      }

      if (track) {
        track.style.transform = `translate(${tx}px, ${ty}px)`
      }

      const idx = Math.round(p * (TOTAL - 1))
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
  <div class="vhv-page">
    <div id="vhvProgress" class="vhv-progress-bar"></div>
    <nav id="vhvNav" class="vhv-nav-dots"></nav>
    <div class="vhv-indicator">
      <span class="vhv-phase">↓</span>
      <span class="vhv-cur">1</span>
      <span class="vhv-tot"> / {{ TOTAL }}</span>
    </div>

    <div id="vhvArea" class="vhv-scroll-area">
      <div class="vhv-viewport">
        <div id="vhvTrack" class="vhv-track">
          <!-- 阶段一：纵向列 面板1~4 -->
          <div class="vhv-col-1">
            <section
              v-for="n in V1"
              :key="'v1-' + n"
              class="vhv-panel"
              :style="{
                background: `linear-gradient(${155 + (n - 1) * 18}deg, hsl(${200 + (n - 1) * 22}, 50%, 72%), hsl(${220 + (n - 1) * 22}, 40%, 84%))`,
              }"
            >
              <span class="vhv-num">{{ String(n).padStart(2, '0') }}</span>
              <div v-if="n === V1" class="vhv-turn-hint vhv-hint-right">→</div>
            </section>
          </div>

          <!-- 阶段二：横向面板 5~7，绝对定位在面板4右侧 -->
          <section
            v-for="n in (H - 1)"
            :key="'h-' + n"
            class="vhv-panel vhv-abs-panel"
            :style="{
              background: `linear-gradient(${130 + n * 22}deg, hsl(${30 + n * 30}, 55%, 32%), hsl(${50 + n * 30}, 42%, 18%))`,
              top: (V1 - 1) * 100 + 'vh',
              left: n * 100 + 'vw',
            }"
          >
            <span class="vhv-num">{{ String(V1 + n).padStart(2, '0') }}</span>
            <div v-if="n === H - 1" class="vhv-turn-hint vhv-hint-down">↓</div>
          </section>

          <!-- 阶段三：纵向面板 8~10，绝对定位在面板7下方 -->
          <section
            v-for="n in (V2 - 1)"
            :key="'v2-' + n"
            class="vhv-panel vhv-abs-panel"
            :style="{
              background: `linear-gradient(${170 + n * 20}deg, hsl(${280 + n * 25}, 48%, 72%), hsl(${300 + n * 25}, 38%, 84%))`,
              top: ((V1 - 1) + n) * 100 + 'vh',
              left: (H - 1) * 100 + 'vw',
            }"
          >
            <span class="vhv-num">{{ String(V1 + H - 1 + n).padStart(2, '0') }}</span>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.vhv-page {
  font-family: system-ui, -apple-system, sans-serif;
  background: #0a0a14;
  color: #1a1a2e;
}

.vhv-scroll-area {
  position: relative;
}

.vhv-viewport {
  position: sticky;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.vhv-track {
  position: relative;
  will-change: transform;
}

.vhv-col-1 {
  display: flex;
  flex-direction: column;
}

.vhv-panel {
  min-width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;

  &::before {
    content: '';
    position: absolute;
    inset: 24px;
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 20px;
    pointer-events: none;
  }
}

.vhv-abs-panel {
  position: absolute;
  width: 100vw;
}

.vhv-num {
  font-size: clamp(4rem, 10vw, 8rem);
  font-weight: 900;
  color: rgba(26, 26, 46, 0.05);
  user-select: none;
  pointer-events: none;
}

.vhv-turn-hint {
  position: absolute;
  font-size: 2rem;
  color: rgba(26, 26, 46, 0.12);
  pointer-events: none;
}

.vhv-hint-right {
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
  animation: vhv-pulse-x 1.5s ease-in-out infinite;
}

.vhv-hint-down {
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  animation: vhv-pulse-y 1.5s ease-in-out infinite;
}

@keyframes vhv-pulse-x {
  0%,
  100% {
    transform: translateY(-50%) translateX(0);
  }
  50% {
    transform: translateY(-50%) translateX(8px);
  }
}

@keyframes vhv-pulse-y {
  0%,
  100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(8px);
  }
}

@media (max-width: 768px) {
  .vhv-num {
    font-size: 3rem;
  }
}
</style>

<style lang="scss">
$c-v1: #38bdf8;
$c-h: #fb923c;
$c-v2: #c084fc;

.vhv-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  width: 0%;
  background: linear-gradient(90deg, $c-v1 0%, $c-v1 30%, $c-h 45%, $c-h 65%, $c-v2 80%, $c-v2 100%);
  z-index: 1001;
  box-shadow: 0 0 8px rgba($c-v1, 0.4);
}

.vhv-nav-dots {
  position: fixed;
  z-index: 1000;
  display: flex;
  gap: 8px;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  align-items: center;
}

.vhv-dot {
  width: 9px;
  height: 9px;
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

  &[data-phase='v1'].vhv-active {
    background: $c-v1;
    border-color: rgba(26, 26, 46, 0.35);
    transform: scale(1.5);
    box-shadow: 0 0 12px rgba($c-v1, 0.5);
  }

  &[data-phase='h'].vhv-active {
    background: $c-h;
    border-color: rgba(26, 26, 46, 0.35);
    transform: scale(1.5);
    box-shadow: 0 0 12px rgba($c-h, 0.5);
  }

  &[data-phase='v2'].vhv-active {
    background: $c-v2;
    border-color: rgba(26, 26, 46, 0.35);
    transform: scale(1.5);
    box-shadow: 0 0 12px rgba($c-v2, 0.5);
  }
}

.vhv-indicator {
  position: fixed;
  top: 28px;
  right: 28px;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(12px);
  padding: 8px 20px;
  border-radius: 24px;
  font-size: 0.85rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(26, 26, 46, 0.75);
  display: flex;
  align-items: center;
  gap: 6px;

  .vhv-phase {
    font-size: 1rem;
    font-weight: 700;
    transition: color 0.3s;
  }

  .vhv-cur {
    font-weight: 700;
  }
}

@media (max-width: 768px) {
  .vhv-nav-dots {
    gap: 6px;
  }
}
</style>

