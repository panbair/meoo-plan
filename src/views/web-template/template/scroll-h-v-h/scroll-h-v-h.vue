<script setup lang="ts">
/**
 * ==================== Scroll H-V-H ====================
 * 横纵横 —— 三阶段运动：
 *   阶段一(面板1~4)：竖滚 → 横向平移
 *   阶段二(面板4~7)：竖滚 → 纵向平移
 *   阶段三(面板7~10)：竖滚 → 横向平移
 *
 * 布局（┐型路径）：
 *   01 → 02 → 03 → 04
 *                    ↓
 *                    05
 *                    06
 *                    07 → 08 → 09 → 10
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

// 阶段一：横向 面板1→4
const H1 = 4
// 阶段二：纵向 面板4→7（面板4共享）
const V = 4
// 阶段三：横向 面板7→10（面板7共享）
const H2 = 4
// 总面板 = H1 + (V-1) + (H2-1) = 4+3+3 = 10
const TOTAL = H1 + (V - 1) + (H2 - 1)

let currentIndex = 0
let vw = 0
let vh = 0

let scrollArea: HTMLElement | null = null
let track: HTMLElement | null = null
let progressBar: HTMLElement | null = null
let navDots: HTMLElement | null = null
let mainST: ScrollTrigger | null = null

// 阶段分割点(progress)
const SPLIT1 = (H1 - 1) / (TOTAL - 1) // 面板4 (3/9)
const SPLIT2 = (H1 - 1 + V - 1) / (TOTAL - 1) // 面板7 (6/9)

function getPhase(index: number): 'h1' | 'v' | 'h2' {
  if (index < H1) return 'h1'
  if (index < H1 + V - 1) return 'v'
  return 'h2'
}

function createNavDots() {
  if (!navDots) return
  navDots.innerHTML = ''
  for (let i = 0; i < TOTAL; i++) {
    const dot = document.createElement('button')
    dot.className = 'hvh-dot' + (i === 0 ? ' hvh-active' : '')
    dot.setAttribute('data-phase', getPhase(i))
    dot.addEventListener('click', () => goTo(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.hvh-dot').forEach((d, i) => {
    d.classList.toggle('hvh-active', i === index)
  })
  const el = document.querySelector('.hvh-indicator .hvh-cur')
  if (el) el.textContent = String(index + 1)
  const phaseEl = document.querySelector('.hvh-indicator .hvh-phase')
  if (phaseEl) {
    const phase = getPhase(index)
    phaseEl.textContent = phase === 'v' ? '↓' : '→'
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

  scrollArea = document.getElementById('hvhArea') as HTMLElement
  track = document.getElementById('hvhTrack') as HTMLElement
  progressBar = document.getElementById('hvhProgress')
  navDots = document.getElementById('hvhNav')
  if (!scrollArea || !track) return

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
        // 阶段一：横移 面板1→4 (→)
        const h1Prog = SPLIT1 > 0 ? p / SPLIT1 : 0
        tx = -h1Prog * (H1 - 1) * vw
      } else if (p <= SPLIT2) {
        // 阶段二：纵移 面板4→7 (↓)
        const vProg = (p - SPLIT1) / (SPLIT2 - SPLIT1)
        tx = -(H1 - 1) * vw // 横向锁定在面板4列
        ty = -vProg * (V - 1) * vh
      } else {
        // 阶段三：横移 面板7→10 (→)
        const h2Prog = (p - SPLIT2) / (1 - SPLIT2)
        tx = -(H1 - 1) * vw - h2Prog * (H2 - 1) * vw
        ty = -(V - 1) * vh // 纵向锁定在面板7行
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
  if (mainST) mainST.refresh()
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
  <div class="hvh-page">
    <div id="hvhProgress" class="hvh-progress-bar"></div>
    <nav id="hvhNav" class="hvh-nav-dots"></nav>
    <div class="hvh-indicator">
      <span class="hvh-phase">→</span>
      <span class="hvh-cur">1</span>
      <span class="hvh-tot"> / {{ TOTAL }}</span>
    </div>

    <div id="hvhArea" class="hvh-scroll-area">
      <div class="hvh-viewport">
        <div id="hvhTrack" class="hvh-track">
          <!-- 阶段一：横向行 面板1→4 -->
          <div class="hvh-row-1">
            <section
              v-for="n in H1"
              :key="'h1-' + n"
              class="hvh-panel"
              :style="{
                background: `linear-gradient(${135 + (n - 1) * 18}deg, hsl(${160 + (n - 1) * 22}, 60%, 70%), hsl(${140 + (n - 1) * 22}, 55%, 84%))`,
              }"
            >
              <span class="hvh-num">{{ String(n).padStart(2, '0') }}</span>
              <div v-if="n === H1" class="hvh-turn-hint hvh-hint-down">↓</div>
            </section>
          </div>

          <!-- 阶段二：纵向面板 5→7，绝对定位在面板4下方 -->
          <section
            v-for="n in (V - 1)"
            :key="'v-' + n"
            class="hvh-panel hvh-abs-panel"
            :style="{
              background: `linear-gradient(${180 + n * 16}deg, hsl(${280 + n * 25}, 52%, 70%), hsl(${310 + n * 25}, 45%, 85%))`,
              top: n * 100 + 'vh',
              left: (H1 - 1) * 100 + 'vw',
            }"
          >
            <span class="hvh-num">{{ String(H1 + n).padStart(2, '0') }}</span>
            <div v-if="n === V - 1" class="hvh-turn-hint hvh-hint-right">→</div>
          </section>

          <!-- 阶段三：横向面板 8→10，绝对定位在面板7右侧 -->
          <section
            v-for="n in (H2 - 1)"
            :key="'h2-' + n"
            class="hvh-panel hvh-abs-panel"
            :style="{
              background: `linear-gradient(${142 + n * 20}deg, hsl(${30 + n * 35}, 68%, 56%), hsl(${18 + n * 35}, 60%, 38%))`,
              top: (V - 1) * 100 + 'vh',
              left: ((H1 - 1) + n) * 100 + 'vw',
            }"
          >
            <span class="hvh-num">{{ String(H1 + V - 1 + n).padStart(2, '0') }}</span>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.hvh-page {
  font-family: system-ui, -apple-system, sans-serif;
  background: #0a0a14;
  color: #1a1a2e;
}

.hvh-scroll-area {
  position: relative;
}

.hvh-viewport {
  position: sticky;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.hvh-track {
  position: relative;
  will-change: transform;
}

.hvh-row-1 {
  display: flex;
  flex-direction: row;
}

.hvh-panel {
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

.hvh-abs-panel {
  position: absolute;
  width: 100vw;
}

.hvh-num {
  font-size: clamp(4rem, 10vw, 8rem);
  font-weight: 900;
  color: rgba(26, 26, 46, 0.05);
  user-select: none;
  pointer-events: none;
}

.hvh-turn-hint {
  position: absolute;
  font-size: 2rem;
  color: rgba(26, 26, 46, 0.12);
  pointer-events: none;
}

.hvh-hint-down {
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  animation: hvh-pulse-y 1.5s ease-in-out infinite;
}

.hvh-hint-right {
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
  animation: hvh-pulse-x 1.5s ease-in-out infinite;
}

@keyframes hvh-pulse-x {
  0%,
  100% { transform: translateY(-50%) translateX(0); }
  50% { transform: translateY(-50%) translateX(8px); }
}

@keyframes hvh-pulse-y {
  0%,
  100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(8px); }
}

@media (max-width: 768px) {
  .hvh-num { font-size: 3rem; }
}
</style>

<style lang="scss">
$c-h1: #22c55e;
$c-v: #a855f7;
$c-h2: #f97316;

.hvh-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  width: 0%;
  background: linear-gradient(90deg, $c-h1 0%, $c-h1 30%, $c-v 45%, $c-v 65%, $c-h2 80%, $c-h2 100%);
  z-index: 1001;
  box-shadow: 0 0 8px rgba($c-h1, 0.4);
}

.hvh-nav-dots {
  position: fixed;
  z-index: 1000;
  display: flex;
  gap: 8px;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  align-items: center;
}

.hvh-dot {
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

  &[data-phase='h1'].hvh-active {
    background: $c-h1;
    border-color: rgba(26, 26, 46, 0.35);
    transform: scale(1.5);
    box-shadow: 0 0 12px rgba($c-h1, 0.5);
  }

  &[data-phase='v'].hvh-active {
    background: $c-v;
    border-color: rgba(26, 26, 46, 0.35);
    transform: scale(1.5);
    box-shadow: 0 0 12px rgba($c-v, 0.5);
  }

  &[data-phase='h2'].hvh-active {
    background: $c-h2;
    border-color: rgba(26, 26, 46, 0.35);
    transform: scale(1.5);
    box-shadow: 0 0 12px rgba($c-h2, 0.5);
  }
}

.hvh-indicator {
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

  .hvh-phase {
    font-size: 1rem;
    font-weight: 700;
    color: $c-h1;
    transition: color 0.3s;
  }

  .hvh-cur {
    font-weight: 700;
    color: $c-h1;
  }
}

@media (max-width: 768px) {
  .hvh-nav-dots { gap: 6px; }
}
</style>
