<script setup lang="ts">
/**
 * ==================== Scroll H-then-V ====================
 * 横转纵 —— 竖滚驱动两阶段运动：
 *   阶段一(面板1~4)：竖滚 → 横向平移，视口锁定
 *   阶段二(面板4~8)：竖滚 → 纵向平移，视口锁定
 *   面板4是转折点，横向到达后切换为纵向继续
 *
 * 核心机制：
 *   1. scrollArea 撑出足够的纵向滚动空间
 *   2. sticky 视口锁定
 *   3. 前半段 scroll progress → track translateX（横移）
 *   4. 到达面板4后 scroll progress → track translateY（纵移）
 *   5. 面板4~8 纵向排列在面板4的列上
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

// 横向面板数（1~4）
const H_COUNT = 4
// 纵向面板数（从第4个位置向下延伸，含面板4本身）
const V_COUNT = 5
// 总面板 = 4横 + 4纵（面板4共享）= 8
const TOTAL = H_COUNT + V_COUNT - 1

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
    dot.className = 'htv-dot' + (i === 0 ? ' htv-active' : '')
    // 横向阶段的点水平，纵向阶段的点竖直 — 用 data 属性标记
    dot.setAttribute('data-phase', i < H_COUNT ? 'h' : 'v')
    dot.addEventListener('click', () => goTo(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.htv-dot').forEach((d, i) => {
    d.classList.toggle('htv-active', i === index)
  })
  const el = document.querySelector('.htv-indicator .htv-cur')
  if (el) {
    el.textContent = String(index + 1)
  }
  // 指示器显示当前阶段
  const phaseEl = document.querySelector('.htv-indicator .htv-phase')
  if (phaseEl) {
    phaseEl.textContent = index < H_COUNT ? '→' : '↓'
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

  scrollArea = document.getElementById('htvArea') as HTMLElement
  track = document.getElementById('htvTrack') as HTMLElement
  progressBar = document.getElementById('htvProgress')
  navDots = document.getElementById('htvNav')
  if (!scrollArea || !track) {
    return
  }

  // 滚动空间 = TOTAL 个屏
  scrollArea.style.height = TOTAL * 100 + 'vh'

  // 核心动画：根据 scroll progress 分两阶段驱动 track
  ScrollTrigger.create({
    trigger: scrollArea,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.5,
    onUpdate: (self) => {
      const p = self.progress
      // 将总进度分成两段
      // 阶段一：p=0~splitP → 横移面板 1→4（面板0→3）
      // 阶段二：p=splitP~1 → 纵移面板 4→8（面板3→7）
      const splitP = (H_COUNT - 1) / (TOTAL - 1) // 面板4(index=3)的进度位置

      if (p <= splitP) {
        // 阶段一：横向平移
        const hProgress = splitP > 0 ? p / splitP : 0
        const xMove = -hProgress * (H_COUNT - 1) * vw
        if (track) {
          track.style.transform = `translate(${xMove}px, 0px)`
        }
      } else {
        // 阶段二：横向锁定在面板4，纵向平移
        const vProgress = (p - splitP) / (1 - splitP)
        const xLock = -(H_COUNT - 1) * vw
        const yMove = -vProgress * (V_COUNT - 1) * vh
        if (track) {
          track.style.transform = `translate(${xLock}px, ${yMove}px)`
        }
      }

      // 计算当前面板索引
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
  <div class="htv-page">
    <div id="htvProgress" class="htv-progress-bar"></div>
    <nav id="htvNav" class="htv-nav-dots"></nav>
    <div class="htv-indicator">
      <span class="htv-phase">→</span>
      <span class="htv-cur">1</span>
      <span class="htv-tot"> / {{ TOTAL }}</span>
    </div>

    <div id="htvArea" class="htv-scroll-area">
      <div class="htv-viewport">
        <!--
          布局：
          面板1 面板2 面板3 面板4   ← 横向 flex 行
                              面板5 ← 面板4下方
                              面板6
                              面板7
                              面板8
        -->
        <div id="htvTrack" class="htv-track">
          <!-- 横向行：面板 1~4 -->
          <div class="htv-h-row">
            <section
              v-for="n in H_COUNT"
              :key="'h' + n"
              class="htv-panel"
              :style="{
                background: `linear-gradient(${130 + (n - 1) * 25}deg, hsl(${200 + (n - 1) * 30}, 55%, 32%), hsl(${220 + (n - 1) * 30}, 42%, 18%))`,
              }"
            >
              <span class="htv-num">{{ String(n).padStart(2, '0') }}</span>
              <div v-if="n === H_COUNT" class="htv-turn-hint">↓</div>
            </section>
          </div>
          <!-- 纵向列：面板 5~8（定位在面板4的正下方） -->
          <section
            v-for="n in (V_COUNT - 1)"
            :key="'v' + n"
            class="htv-panel htv-v-panel"
            :style="{
              background: `linear-gradient(${180 + n * 20}deg, hsl(${320 + n * 25}, 50%, 30%), hsl(${340 + n * 25}, 38%, 16%))`,
              top: (n) * 100 + 'vh',
              left: (H_COUNT - 1) * 100 + 'vw',
            }"
          >
            <span class="htv-num">{{ String(H_COUNT + n).padStart(2, '0') }}</span>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.htv-page {
  font-family: system-ui, -apple-system, sans-serif;
  background: #0a0a14;
  color: #fff;
}

.htv-scroll-area {
  position: relative;
}

.htv-viewport {
  position: sticky;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.htv-track {
  position: relative;
  will-change: transform;
}

/* 横向行 */
.htv-h-row {
  display: flex;
}

/* 通用面板 */
.htv-panel {
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

/* 纵向面板：绝对定位在面板4的下方 */
.htv-v-panel {
  position: absolute;
  width: 100vw;
}

.htv-num {
  font-size: clamp(4rem, 10vw, 8rem);
  font-weight: 900;
  color: rgba(255, 255, 255, 0.05);
  user-select: none;
  pointer-events: none;
}

/* 转折提示 */
.htv-turn-hint {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 2rem;
  color: rgba(255, 255, 255, 0.12);
  animation: htv-bounce 1.5s ease-in-out infinite;
  pointer-events: none;
}

@keyframes htv-bounce {
  0%,
  100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(8px);
  }
}

@media (max-width: 768px) {
  .htv-num {
    font-size: 3rem;
  }
}
</style>

<style lang="scss">
$accent-h: #60a0ff;
$accent-v: #f472b6;

/* 进度条：颜色随阶段渐变 */
.htv-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  width: 0%;
  background: linear-gradient(90deg, $accent-h, $accent-h 45%, $accent-v 55%, $accent-v);
  z-index: 1001;
  box-shadow: 0 0 8px rgba($accent-h, 0.4);
}

/* 导航点 */
.htv-nav-dots {
  position: fixed;
  z-index: 1000;
  display: flex;
  gap: 10px;
  /* 底部居中，横纵混合排列 */
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  align-items: center;
}

.htv-dot {
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

  /* 横向阶段的点用蓝色 */
  &[data-phase='h'].htv-active {
    background: $accent-h;
    border-color: rgba(255, 255, 255, 0.35);
    transform: scale(1.5);
    box-shadow: 0 0 14px rgba($accent-h, 0.5);
  }

  /* 纵向阶段的点用粉色 */
  &[data-phase='v'].htv-active {
    background: $accent-v;
    border-color: rgba(255, 255, 255, 0.35);
    transform: scale(1.5);
    box-shadow: 0 0 14px rgba($accent-v, 0.5);
  }
}

/* 指示器 */
.htv-indicator {
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

  .htv-phase {
    font-size: 1rem;
    font-weight: 700;
    color: $accent-h;
    transition: color 0.3s;
  }

  .htv-cur {
    color: $accent-h;
    font-weight: 700;
  }
}

@media (max-width: 768px) {
  .htv-nav-dots {
    gap: 8px;
  }
}
</style>

