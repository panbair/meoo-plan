<script setup lang="ts">
/**
 * ==================== Scroll Zoom Lane ====================
 * 缩放车道 —— 面板从远处缩放飞入视口中心，
 * 交替从左右两侧(甚至上下)以不同角度进场，
 * 前一个面板缩小飞出后方
 *
 * 核心：每个面板用 scale + translate + rotate 组合，
 * scroll progress 驱动进场/退场的全过程
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const TOTAL = 8

// 每个面板的进场方向和角度
const LANES = [
  { x: 0, y: 0, rot: 0 },        // 01 居中(初始)
  { x: 120, y: 40, rot: 8 },      // 02 从右下飞入
  { x: -130, y: -30, rot: -10 },   // 03 从左上飞入
  { x: 100, y: -50, rot: 6 },     // 04 从右上飞入
  { x: -110, y: 60, rot: -8 },    // 05 从左下飞入
  { x: 140, y: 0, rot: 12 },      // 06 从右侧飞入
  { x: -120, y: -40, rot: -6 },   // 07 从左上飞入
  { x: 0, y: 80, rot: -4 },       // 08 从下方飞入
]

let currentIndex = 0
let scrollArea: HTMLElement | null = null
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
    dot.className = 'zml-dot' + (i === 0 ? ' zml-active' : '')
    dot.addEventListener('click', () => goTo(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.zml-dot').forEach((d, i) => {
    d.classList.toggle('zml-active', i === index)
  })
  const el = document.querySelector('.zml-indicator .zml-cur')
  if (el) {
    el.textContent = String(index + 1)
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
  scrollArea = document.getElementById('zmlArea') as HTMLElement
  progressBar = document.getElementById('zmlProgress')
  navDots = document.getElementById('zmlNav')
  if (!scrollArea) {
    return
  }

  scrollArea.style.height = TOTAL * 100 + 'vh'
  const panels = gsap.utils.toArray('.zml-panel') as HTMLElement[]

  ScrollTrigger.create({
    trigger: scrollArea,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.5,
    onUpdate: (self) => {
      const p = self.progress
      const focus = p * (TOTAL - 1) // 当前焦点(浮点索引)

      panels.forEach((panel, i) => {
        const dist = i - focus // 正=还没到，负=已过
        const absDist = Math.abs(dist)
        const lane = LANES[i]

        if (absDist < 0.01) {
          // 当前面板：正中央
          panel.style.transform = 'translate(0, 0) scale(1) rotate(0deg)'
          panel.style.opacity = '1'
          panel.style.zIndex = '10'
          panel.style.filter = 'none'
        } else if (dist > 0) {
          // 未到：从远处等待飞入
          const t = Math.min(1, absDist)
          const scale = 0.3 + (1 - t) * 0.7
          const x = lane.x * t
          const y = lane.y * t
          const rot = lane.rot * t
          const opacity = Math.max(0, 1 - t * 1.5)

          panel.style.transform = `translate(${x}%, ${y}%) scale(${scale}) rotate(${rot}deg)`
          panel.style.opacity = String(opacity)
          panel.style.zIndex = String(5 - Math.round(absDist))
          panel.style.filter = `blur(${Math.min(6, t * 8)}px)`
        } else {
          // 已过：缩小飞走
          const t = Math.min(1, absDist)
          const scale = 1 - t * 0.6
          const x = -lane.x * t * 0.5
          const y = -lane.y * t * 0.5
          const rot = -lane.rot * t * 0.5
          const opacity = Math.max(0, 1 - t * 2)

          panel.style.transform = `translate(${x}%, ${y}%) scale(${scale}) rotate(${rot}deg)`
          panel.style.opacity = String(opacity)
          panel.style.zIndex = String(3 - Math.round(absDist))
          panel.style.filter = `blur(${Math.min(8, t * 10)}px)`
        }
      })

      const idx = Math.round(focus)
      if (idx !== currentIndex) {
        currentIndex = idx
        updateUI(idx)
      }
    },
  })

  mainST = ScrollTrigger.getAll()[ScrollTrigger.getAll().length - 1]
  document.addEventListener('keydown', onKeydown)
  createNavDots()
  updateUI(0)
}

function destroy() {
  mainST?.kill()
  mainST = null
  document.removeEventListener('keydown', onKeydown)
}

onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>

<template>
  <div class="zml-page">
    <div id="zmlProgress" class="zml-progress-bar"></div>
    <nav id="zmlNav" class="zml-nav-dots"></nav>
    <div class="zml-indicator">
      <span class="zml-cur">1</span> / {{ TOTAL }}
    </div>

    <div id="zmlArea" class="zml-scroll-area">
      <div class="zml-viewport">
        <div class="zml-stage">
          <section
            v-for="n in TOTAL"
            :key="n"
            class="zml-panel"
            :style="{
              background: `radial-gradient(ellipse at ${40 + (n % 3) * 15}% ${35 + (n % 2) * 20}%, hsl(${(n - 1) * 42}, 55%, 32%) 0%, hsl(${(n - 1) * 42 + 25}, 40%, 14%) 100%)`,
            }"
          >
            <span class="zml-num">{{ String(n).padStart(2, '0') }}</span>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.zml-page {
  font-family: system-ui, -apple-system, sans-serif;
  background: #060610;
  color: #fff;
}

.zml-scroll-area {
  position: relative;
}

.zml-viewport {
  position: sticky;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.zml-stage {
  position: relative;
  width: 100%;
  height: 100%;
}

.zml-panel {
  position: absolute;
  inset: 4vh 4vw;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  will-change: transform, opacity, filter;
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.4);
}

.zml-num {
  font-size: clamp(4rem, 10vw, 8rem);
  font-weight: 900;
  color: rgba(255, 255, 255, 0.06);
  user-select: none;
  pointer-events: none;
}
</style>

<style lang="scss">
$accent: #ec4899;

.zml-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  width: 0%;
  background: linear-gradient(90deg, $accent, #f59e0b);
  z-index: 1001;
}

.zml-nav-dots {
  position: fixed;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.zml-dot {
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

  &.zml-active {
    background: $accent;
    border-color: rgba(255, 255, 255, 0.35);
    transform: scale(1.5);
    box-shadow: 0 0 14px rgba($accent, 0.5);
  }
}

.zml-indicator {
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

  .zml-cur {
    color: $accent;
    font-weight: 700;
  }
}
</style>

