<script setup lang="ts">
/**
 * ==================== Scroll Telescope Zoom ====================
 * 望远镜变焦 —— 面板从极小的点逐步放大充满全屏
 * 每个面板在远处是一个小矩形，scroll 驱动它放大到全屏
 * 放大到满屏后保持一段，然后继续放大超过屏幕消失，露出下一个
 *
 * 核心：scale(0.02→1→3) + opacity 配合
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
    dot.className = 'tlz-dot' + (i === 0 ? ' tlz-active' : '')
    dot.addEventListener('click', () => goTo(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.tlz-dot').forEach((d, i) => {
    d.classList.toggle('tlz-active', i === index)
  })
  const el = document.querySelector('.tlz-indicator .tlz-cur')
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
  scrollArea = document.getElementById('tlzArea') as HTMLElement
  progressBar = document.getElementById('tlzProgress')
  navDots = document.getElementById('tlzNav')
  if (!scrollArea) {
    return
  }

  scrollArea.style.height = TOTAL * 100 + 'vh'
  const panels = gsap.utils.toArray('.tlz-lens') as HTMLElement[]

  ScrollTrigger.create({
    trigger: scrollArea,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.4,
    onUpdate: (self) => {
      const p = self.progress
      const focus = p * (TOTAL - 1)

      panels.forEach((panel, i) => {
        const dist = i - focus // 正=远处等待, 负=已放大飞过

        if (dist >= 1.5) {
          // 远处：极小的点
          panel.style.transform = 'scale(0.03)'
          panel.style.opacity = '0.6'
          panel.style.zIndex = String(i)
          panel.style.borderRadius = '50%'
        } else if (dist > 0) {
          // 正在拉近：从小点放大到全屏
          const zoomProg = 1 - dist / 1.5
          const scale = 0.03 + zoomProg * 0.97
          const opacity = 0.6 + zoomProg * 0.4
          const radius = Math.max(0, (1 - zoomProg) * 50)
          panel.style.transform = `scale(${scale})`
          panel.style.opacity = String(opacity)
          panel.style.zIndex = String(TOTAL + Math.round(zoomProg * 5))
          panel.style.borderRadius = radius + '%'
        } else if (dist > -1) {
          // 当前/正在飞过：满屏→继续放大消失
          const overProg = -dist // 0→1
          const scale = 1 + overProg * 4
          const opacity = Math.max(0, 1 - overProg * 1.5)
          panel.style.transform = `scale(${scale})`
          panel.style.opacity = String(opacity)
          panel.style.zIndex = String(TOTAL + 10 - Math.round(overProg * 5))
          panel.style.borderRadius = '0%'
        } else {
          // 完全飞过
          panel.style.transform = 'scale(5)'
          panel.style.opacity = '0'
          panel.style.zIndex = '0'
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
  <div class="tlz-page">
    <div id="tlzProgress" class="tlz-progress-bar"></div>
    <nav id="tlzNav" class="tlz-nav-dots"></nav>
    <div class="tlz-indicator">
      <span class="tlz-cur">1</span> / {{ TOTAL }}
    </div>
    <!-- 望远镜准星 -->
    <div class="tlz-crosshair">
      <div class="tlz-cross-h"></div>
      <div class="tlz-cross-v"></div>
      <div class="tlz-cross-ring"></div>
    </div>

    <div id="tlzArea" class="tlz-scroll-area">
      <div class="tlz-viewport">
        <div class="tlz-stage">
          <section
            v-for="n in TOTAL"
            :key="n"
            class="tlz-lens"
            :style="{
              background: `radial-gradient(circle at center, hsl(${(n - 1) * 44}, 50%, 32%) 0%, hsl(${(n - 1) * 44 + 20}, 38%, 12%) 100%)`,
            }"
          >
            <span class="tlz-num">{{ String(n).padStart(2, '0') }}</span>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tlz-page {
  font-family: system-ui, -apple-system, sans-serif;
  background: #f5f0f8;
  color: #1a1a2e;
}

.tlz-scroll-area {
  position: relative;
}

.tlz-viewport {
  position: sticky;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.tlz-stage {
  position: relative;
  width: 100%;
  height: 100%;
}

.tlz-lens {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  will-change: transform, opacity, border-radius;
  overflow: hidden;
}

.tlz-num {
  font-size: clamp(4rem, 10vw, 8rem);
  font-weight: 900;
  color: rgba(26, 26, 46, 0.05);
  user-select: none;
  pointer-events: none;
}

/* 望远镜准星 */
.tlz-crosshair {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 500;
  pointer-events: none;
}

.tlz-cross-h,
.tlz-cross-v {
  position: absolute;
  background: rgba(26, 26, 46, 0.06);
}

.tlz-cross-h {
  width: 40px;
  height: 1px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.tlz-cross-v {
  width: 1px;
  height: 40px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.tlz-cross-ring {
  width: 60px;
  height: 60px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>

<style lang="scss">
$accent: #22d3ee;

.tlz-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  width: 0%;
  background: linear-gradient(90deg, $accent, #818cf8);
  z-index: 1001;
}

.tlz-nav-dots {
  position: fixed;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tlz-dot {
  width: 10px;
  height: 10px;
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

  &.tlz-active {
    background: $accent;
    border-color: rgba(26, 26, 46, 0.35);
    transform: scale(1.5);
    box-shadow: 0 0 14px rgba($accent, 0.5);
  }
}

.tlz-indicator {
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

  .tlz-cur {
    color: $accent;
    font-weight: 700;
  }
}
</style>

