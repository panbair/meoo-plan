<script setup lang="ts">
/**
 * ==================== Scroll Diagonal Slide ====================
 * 对角线滑入 —— 每个面板都从左上角向右下角对角线平移入场
 * 前一个面板停留，下一个面板从左上方(-100%, -100%)沿对角线滑到(0,0)覆盖
 *
 * 核心：sticky 视口 + translate(-100%, -100%) → translate(0, 0)
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const TOTAL = 8

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
    dot.className = 'dgs-dot' + (i === 0 ? ' dgs-active' : '')
    dot.addEventListener('click', () => goTo(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.dgs-dot').forEach((d, i) => {
    d.classList.toggle('dgs-active', i === index)
  })
  const el = document.querySelector('.dgs-indicator .dgs-cur')
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
  scrollArea = document.getElementById('dgsArea') as HTMLElement
  progressBar = document.getElementById('dgsProgress')
  navDots = document.getElementById('dgsNav')
  if (!scrollArea) {
    return
  }

  scrollArea.style.height = TOTAL * 100 + 'vh'
  const panels = gsap.utils.toArray('.dgs-panel') as HTMLElement[]

  ScrollTrigger.create({
    trigger: scrollArea,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.5,
    onUpdate: (self) => {
      const p = self.progress
      const focus = p * (TOTAL - 1)

      panels.forEach((panel, i) => {
        const dist = i - focus

        if (dist <= -1) {
          // 已通过，停在原位
          panel.style.transform = 'translate(0%, 0%) scale(1)'
          panel.style.opacity = '1'
          panel.style.zIndex = String(i)
        } else if (dist >= 1) {
          // 还没到，隐藏在左上角外
          panel.style.transform = 'translate(-100%, -100%) scale(0.85)'
          panel.style.opacity = '0'
          panel.style.zIndex = String(TOTAL + i)
        } else if (dist > 0) {
          // 正在从左上角对角线滑入
          const enterProg = 1 - dist // 0→1
          const tx = -100 * (1 - enterProg)
          const ty = -100 * (1 - enterProg)
          const scale = 0.85 + 0.15 * enterProg
          const opacity = Math.min(1, enterProg * 1.8)
          panel.style.transform = `translate(${tx}%, ${ty}%) scale(${scale})`
          panel.style.opacity = String(opacity)
          panel.style.zIndex = String(TOTAL + i)
        } else {
          // 已到位，停留
          panel.style.transform = 'translate(0%, 0%) scale(1)'
          panel.style.opacity = '1'
          panel.style.zIndex = String(i)
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
  <div class="dgs-page">
    <div id="dgsProgress" class="dgs-progress-bar"></div>
    <nav id="dgsNav" class="dgs-nav-dots"></nav>
    <div class="dgs-indicator">
      <span class="dgs-arrow">↘</span>
      <span class="dgs-cur">1</span>
      <span class="dgs-tot"> / {{ TOTAL }}</span>
    </div>

    <div id="dgsArea" class="dgs-scroll-area">
      <div class="dgs-viewport">
        <section
          v-for="n in TOTAL"
          :key="n"
          class="dgs-panel"
          :style="{
            background: `linear-gradient(135deg, hsl(${(n - 1) * 44}, 50%, 30%), hsl(${(n - 1) * 44 + 20}, 38%, 16%))`,
          }"
        >
          <span class="dgs-num">{{ String(n).padStart(2, '0') }}</span>
          <!-- 对角线装饰 -->
          <div class="dgs-diag-line"></div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dgs-page {
  font-family: system-ui, -apple-system, sans-serif;
  background: #08080f;
  color: #fff;
}

.dgs-scroll-area {
  position: relative;
}

.dgs-viewport {
  position: sticky;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.dgs-panel {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  will-change: transform, opacity;

  &::before {
    content: '';
    position: absolute;
    inset: 24px;
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 20px;
    pointer-events: none;
  }
}

.dgs-num {
  font-size: clamp(5rem, 12vw, 10rem);
  font-weight: 900;
  color: rgba(255, 255, 255, 0.05);
  user-select: none;
  pointer-events: none;
}

/* 对角线装饰 */
.dgs-diag-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 141.4%; /* √2 × 100% */
  height: 1px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.01));
  transform-origin: top left;
  transform: rotate(45deg);
  pointer-events: none;
}
</style>

<style lang="scss">
$accent: #a78bfa;

.dgs-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  width: 0%;
  background: linear-gradient(90deg, $accent, #818cf8);
  z-index: 1001;
}

.dgs-nav-dots {
  position: fixed;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.dgs-dot {
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

  &.dgs-active {
    background: $accent;
    border-color: rgba(255, 255, 255, 0.35);
    transform: scale(1.5);
    box-shadow: 0 0 14px rgba($accent, 0.5);
  }
}

.dgs-indicator {
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
  gap: 8px;

  .dgs-arrow {
    font-size: 1rem;
    color: $accent;
    font-weight: 700;
  }

  .dgs-cur {
    color: $accent;
    font-weight: 700;
  }
}
</style>

