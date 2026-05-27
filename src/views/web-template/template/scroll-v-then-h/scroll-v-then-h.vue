<script setup lang="ts">
/**
 * ==================== Scroll V-then-H ====================
 * 纵转横 —— 竖滚驱动两阶段运动：
 *   阶段一(面板1~4)：竖滚 → 纵向平移，视口锁定
 *   阶段二(面板4~8)：竖滚 → 横向平移，视口锁定
 *   面板4是转折点，纵向到达后切换为横向继续
 *
 * 布局：
 *   面板1        ← 纵向列(面板1~4)
 *   面板2
 *   面板3
 *   面板4 → 面板5 → 面板6 → 面板7 → 面板8   ← 横向行(面板4~8)
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const V_COUNT = 4 // 纵向面板数(1~4)
const H_COUNT = 5 // 横向面板数(从第4个向右延伸，含面板4)
const TOTAL = V_COUNT + H_COUNT - 1 // = 8

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
    dot.className = 'vth-dot' + (i === 0 ? ' vth-active' : '')
    dot.setAttribute('data-phase', i < V_COUNT ? 'v' : 'h')
    dot.addEventListener('click', () => goTo(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.vth-dot').forEach((d, i) => {
    d.classList.toggle('vth-active', i === index)
  })
  const el = document.querySelector('.vth-indicator .vth-cur')
  if (el) {
    el.textContent = String(index + 1)
  }
  const phaseEl = document.querySelector('.vth-indicator .vth-phase')
  if (phaseEl) {
    phaseEl.textContent = index < V_COUNT ? '↓' : '→'
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

  scrollArea = document.getElementById('vthArea') as HTMLElement
  track = document.getElementById('vthTrack') as HTMLElement
  progressBar = document.getElementById('vthProgress')
  navDots = document.getElementById('vthNav')
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
      // splitP = 面板4(index=3)所在的进度点
      const splitP = (V_COUNT - 1) / (TOTAL - 1)

      if (p <= splitP) {
        // 阶段一：纵向平移(面板1→4)
        const vProgress = splitP > 0 ? p / splitP : 0
        const yMove = -vProgress * (V_COUNT - 1) * vh
        if (track) {
          track.style.transform = `translate(0px, ${yMove}px)`
        }
      } else {
        // 阶段二：纵向锁定在面板4，横向平移
        const hProgress = (p - splitP) / (1 - splitP)
        const yLock = -(V_COUNT - 1) * vh
        const xMove = -hProgress * (H_COUNT - 1) * vw
        if (track) {
          track.style.transform = `translate(${xMove}px, ${yLock}px)`
        }
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
  <div class="vth-page">
    <div id="vthProgress" class="vth-progress-bar"></div>
    <nav id="vthNav" class="vth-nav-dots"></nav>
    <div class="vth-indicator">
      <span class="vth-phase">↓</span>
      <span class="vth-cur">1</span>
      <span class="vth-tot"> / {{ TOTAL }}</span>
    </div>

    <div id="vthArea" class="vth-scroll-area">
      <div class="vth-viewport">
        <div id="vthTrack" class="vth-track">
          <!-- 纵向列：面板 1~4 -->
          <div class="vth-v-col">
            <section
              v-for="n in V_COUNT"
              :key="'v' + n"
              class="vth-panel"
              :style="{
                background: `linear-gradient(${160 + (n - 1) * 20}deg, hsl(${180 + (n - 1) * 25}, 50%, 30%), hsl(${200 + (n - 1) * 25}, 40%, 16%))`,
              }"
            >
              <span class="vth-num">{{ String(n).padStart(2, '0') }}</span>
              <div v-if="n === V_COUNT" class="vth-turn-hint">→</div>
            </section>
          </div>
          <!-- 横向面板 5~8：绝对定位在面板4的右侧 -->
          <section
            v-for="n in (H_COUNT - 1)"
            :key="'h' + n"
            class="vth-panel vth-h-panel"
            :style="{
              background: `linear-gradient(${130 + n * 22}deg, hsl(${30 + n * 35}, 55%, 32%), hsl(${50 + n * 35}, 42%, 18%))`,
              top: (V_COUNT - 1) * 100 + 'vh',
              left: n * 100 + 'vw',
            }"
          >
            <span class="vth-num">{{ String(V_COUNT + n).padStart(2, '0') }}</span>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.vth-page {
  font-family: system-ui, -apple-system, sans-serif;
  background: #0a0a14;
  color: #fff;
}

.vth-scroll-area {
  position: relative;
}

.vth-viewport {
  position: sticky;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.vth-track {
  position: relative;
  will-change: transform;
}

/* 纵向列 */
.vth-v-col {
  display: flex;
  flex-direction: column;
}

/* 通用面板 */
.vth-panel {
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

/* 横向面板：绝对定位在面板4的右侧 */
.vth-h-panel {
  position: absolute;
  width: 100vw;
}

.vth-num {
  font-size: clamp(4rem, 10vw, 8rem);
  font-weight: 900;
  color: rgba(255, 255, 255, 0.05);
  user-select: none;
  pointer-events: none;
}

/* 转折提示 */
.vth-turn-hint {
  position: absolute;
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 2rem;
  color: rgba(255, 255, 255, 0.12);
  animation: vth-pulse 1.5s ease-in-out infinite;
  pointer-events: none;
}

@keyframes vth-pulse {
  0%,
  100% {
    transform: translateY(-50%) translateX(0);
  }
  50% {
    transform: translateY(-50%) translateX(8px);
  }
}

@media (max-width: 768px) {
  .vth-num {
    font-size: 3rem;
  }
}
</style>

<style lang="scss">
$accent-v: #38bdf8;
$accent-h: #fb923c;

.vth-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  width: 0%;
  background: linear-gradient(90deg, $accent-v, $accent-v 40%, $accent-h 60%, $accent-h);
  z-index: 1001;
  box-shadow: 0 0 8px rgba($accent-v, 0.4);
}

.vth-nav-dots {
  position: fixed;
  z-index: 1000;
  display: flex;
  gap: 10px;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  align-items: center;
}

.vth-dot {
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

  &[data-phase='v'].vth-active {
    background: $accent-v;
    border-color: rgba(255, 255, 255, 0.35);
    transform: scale(1.5);
    box-shadow: 0 0 14px rgba($accent-v, 0.5);
  }

  &[data-phase='h'].vth-active {
    background: $accent-h;
    border-color: rgba(255, 255, 255, 0.35);
    transform: scale(1.5);
    box-shadow: 0 0 14px rgba($accent-h, 0.5);
  }
}

.vth-indicator {
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

  .vth-phase {
    font-size: 1rem;
    font-weight: 700;
    color: $accent-v;
    transition: color 0.3s;
  }

  .vth-cur {
    color: $accent-v;
    font-weight: 700;
  }
}

@media (max-width: 768px) {
  .vth-nav-dots {
    gap: 8px;
  }
}
</style>

