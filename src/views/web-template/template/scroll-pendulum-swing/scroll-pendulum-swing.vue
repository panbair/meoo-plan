<script setup lang="ts">
/**
 * ==================== Scroll Pendulum Swing ====================
 * 钟摆摆动 —— 面板从顶部中心悬挂，
 * 竖滚驱动整个钟摆旋转角度，每个面板在不同摆角上
 * 当前面板摆到正中(0°)，前后面板分别摆向左右
 *
 * 核心：transform-origin: top center + rotate
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const TOTAL = 8
const MAX_ANGLE = 55 // 最大摆角(度)

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
    dot.className = 'psw-dot' + (i === 0 ? ' psw-active' : '')
    dot.addEventListener('click', () => goTo(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.psw-dot').forEach((d, i) => {
    d.classList.toggle('psw-active', i === index)
  })
  const el = document.querySelector('.psw-indicator .psw-cur')
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
  scrollArea = document.getElementById('pswArea') as HTMLElement
  progressBar = document.getElementById('pswProgress')
  navDots = document.getElementById('pswNav')
  if (!scrollArea) {
    return
  }

  scrollArea.style.height = TOTAL * 100 + 'vh'
  const panels = gsap.utils.toArray('.psw-panel') as HTMLElement[]

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
        const absDist = Math.abs(dist)

        // 摆角：当前面板0°，左右面板交替摆开
        const angle = dist * MAX_ANGLE
        // 越远越暗越小
        const opacity = Math.max(0.05, 1 - absDist * 0.5)
        const scale = Math.max(0.6, 1 - absDist * 0.1)

        panel.style.transform = `rotate(${angle}deg) scale(${scale})`
        panel.style.opacity = String(opacity)
        panel.style.zIndex = String(TOTAL - Math.round(absDist))
        panel.style.filter = absDist > 1 ? `blur(${Math.min(6, (absDist - 1) * 4)}px)` : 'none'
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
  <div class="psw-page">
    <div id="pswProgress" class="psw-progress-bar"></div>
    <nav id="pswNav" class="psw-nav-dots"></nav>
    <div class="psw-indicator">
      <span class="psw-cur">1</span> / {{ TOTAL }}
    </div>

    <div id="pswArea" class="psw-scroll-area">
      <div class="psw-viewport">
        <!-- 悬挂点 -->
        <div class="psw-pivot"></div>
        <div class="psw-stage">
          <section
            v-for="n in TOTAL"
            :key="n"
            class="psw-panel"
            :style="{
              background: `linear-gradient(${170 + (n - 1) * 18}deg, hsl(${(n - 1) * 44}, 52%, 72%), hsl(${(n - 1) * 44 + 22}, 40%, 15%))`,
            }"
          >
            <span class="psw-num">{{ String(n).padStart(2, '0') }}</span>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.psw-page {
  font-family: system-ui, -apple-system, sans-serif;
  background: #f5f0f8;
  color: #1a1a2e;
}

.psw-scroll-area {
  position: relative;
}

.psw-viewport {
  position: sticky;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.psw-pivot {
  position: absolute;
  top: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 12px;
  height: 12px;
  background: rgba(26, 26, 46, 0.15);
  border-radius: 50%;
  z-index: 100;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
}

.psw-stage {
  position: relative;
  width: 100%;
  height: 100%;
}

.psw-panel {
  position: absolute;
  inset: 8vh 12vw;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-origin: top center;
  will-change: transform, opacity, filter;
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 12px 40px rgba(255, 255, 255, 0.75);

  &::before {
    content: '';
    position: absolute;
    top: -8vh;
    left: 50%;
    width: 1px;
    height: 8vh;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.03));
    pointer-events: none;
  }
}

.psw-num {
  font-size: clamp(4rem, 10vw, 8rem);
  font-weight: 900;
  color: rgba(26, 26, 46, 0.05);
  user-select: none;
  pointer-events: none;
}
</style>

<style lang="scss">
$accent: #f97316;

.psw-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  width: 0%;
  background: linear-gradient(90deg, $accent, #eab308);
  z-index: 1001;
}

.psw-nav-dots {
  position: fixed;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.psw-dot {
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

  &.psw-active {
    background: $accent;
    border-color: rgba(26, 26, 46, 0.35);
    transform: scale(1.5);
    box-shadow: 0 0 14px rgba($accent, 0.5);
  }
}

.psw-indicator {
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

  .psw-cur {
    color: $accent;
    font-weight: 700;
  }
}
</style>

