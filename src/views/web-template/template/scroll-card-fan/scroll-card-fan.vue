<script setup lang="ts">
/**
 * ==================== Scroll Card Fan ====================
 * 扇形展牌 —— 面板从底部中心扇形展开，像手持扑克牌
 * 竖滚驱动"展开角度"，依次将面板从扇形堆叠展开到正面
 *
 * 核心：transform-origin: bottom center + rotate + translateX
 * 所有面板锚点在底部中心，通过旋转角度排列成扇形
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const TOTAL = 8
const FAN_ANGLE = 12 // 相邻面板间的扇形角度

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
    dot.className = 'cfn-dot' + (i === 0 ? ' cfn-active' : '')
    dot.addEventListener('click', () => goTo(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.cfn-dot').forEach((d, i) => {
    d.classList.toggle('cfn-active', i === index)
  })
  const el = document.querySelector('.cfn-indicator .cfn-cur')
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
  scrollArea = document.getElementById('cfnArea') as HTMLElement
  progressBar = document.getElementById('cfnProgress')
  navDots = document.getElementById('cfnNav')
  if (!scrollArea) {
    return
  }

  scrollArea.style.height = TOTAL * 100 + 'vh'
  const panels = gsap.utils.toArray('.cfn-card') as HTMLElement[]

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

        // 扇形角度：焦点面板居中(0°)，前后面板向两侧展开
        const angle = dist * FAN_ANGLE
        // 横向偏移：让扇形更明显
        const xShift = dist * 3
        // 纵向微移：越远越向下沉
        const yShift = absDist * 15
        const opacity = Math.max(0.08, 1 - absDist * 0.35)
        const scale = Math.max(0.7, 1 - absDist * 0.06)

        panel.style.transform = `rotate(${angle}deg) translateX(${xShift}%) translateY(${yShift}px) scale(${scale})`
        panel.style.opacity = String(opacity)
        panel.style.zIndex = String(TOTAL - Math.round(absDist))
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
  <div class="cfn-page">
    <div id="cfnProgress" class="cfn-progress-bar"></div>
    <nav id="cfnNav" class="cfn-nav-dots"></nav>
    <div class="cfn-indicator">
      <span class="cfn-cur">1</span> / {{ TOTAL }}
    </div>

    <div id="cfnArea" class="cfn-scroll-area">
      <div class="cfn-viewport">
        <div class="cfn-hand">
          <div
            v-for="n in TOTAL"
            :key="n"
            class="cfn-card"
            :style="{
              background: `linear-gradient(${160 + (n - 1) * 20}deg, hsl(${(n - 1) * 44}, 50%, 30%), hsl(${(n - 1) * 44 + 20}, 38%, 15%))`,
            }"
          >
            <span class="cfn-num">{{ String(n).padStart(2, '0') }}</span>
            <div class="cfn-corner cfn-tl"></div>
            <div class="cfn-corner cfn-tr"></div>
            <div class="cfn-corner cfn-bl"></div>
            <div class="cfn-corner cfn-br"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cfn-page {
  font-family: system-ui, -apple-system, sans-serif;
  background: #060610;
  color: #fff;
}

.cfn-scroll-area {
  position: relative;
}

.cfn-viewport {
  position: sticky;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 5vh;
}

.cfn-hand {
  position: relative;
  width: 60vw;
  height: 75vh;
}

.cfn-card {
  position: absolute;
  inset: 0;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-origin: bottom center;
  will-change: transform, opacity;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 -4px 30px rgba(0, 0, 0, 0.3);
}

.cfn-num {
  font-size: clamp(4rem, 8vw, 7rem);
  font-weight: 900;
  color: rgba(255, 255, 255, 0.06);
  user-select: none;
  pointer-events: none;
}

.cfn-corner {
  position: absolute;
  width: 20px;
  height: 20px;
  border-color: rgba(255, 255, 255, 0.06);
  border-style: solid;
  border-width: 0;
  pointer-events: none;
}

.cfn-tl {
  top: 16px;
  left: 16px;
  border-top-width: 1px;
  border-left-width: 1px;
  border-radius: 4px 0 0 0;
}

.cfn-tr {
  top: 16px;
  right: 16px;
  border-top-width: 1px;
  border-right-width: 1px;
  border-radius: 0 4px 0 0;
}

.cfn-bl {
  bottom: 16px;
  left: 16px;
  border-bottom-width: 1px;
  border-left-width: 1px;
  border-radius: 0 0 0 4px;
}

.cfn-br {
  bottom: 16px;
  right: 16px;
  border-bottom-width: 1px;
  border-right-width: 1px;
  border-radius: 0 0 4px 0;
}

@media (max-width: 768px) {
  .cfn-hand {
    width: 85vw;
    height: 65vh;
  }
}
</style>

<style lang="scss">
$accent: #10b981;

.cfn-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  width: 0%;
  background: linear-gradient(90deg, $accent, #6ee7b7);
  z-index: 1001;
}

.cfn-nav-dots {
  position: fixed;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cfn-dot {
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

  &.cfn-active {
    background: $accent;
    border-color: rgba(255, 255, 255, 0.35);
    transform: scale(1.5);
    box-shadow: 0 0 14px rgba($accent, 0.5);
  }
}

.cfn-indicator {
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

  .cfn-cur {
    color: $accent;
    font-weight: 700;
  }
}
</style>

