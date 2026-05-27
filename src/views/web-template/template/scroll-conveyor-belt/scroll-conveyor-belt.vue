<script setup lang="ts">
/**
 * ==================== Scroll Conveyor Belt ====================
 * 传送带 —— 面板像工厂传送带上的物品：
 *   从右侧远处滑入 → 到达中央展示位放大 → 继续向左滑出缩小
 *   同时带有轻微的 rotateY 透视倾斜，模拟传送带弧度
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
    dot.className = 'cvb-dot' + (i === 0 ? ' cvb-active' : '')
    dot.addEventListener('click', () => goTo(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.cvb-dot').forEach((d, i) => {
    d.classList.toggle('cvb-active', i === index)
  })
  const el = document.querySelector('.cvb-indicator .cvb-cur')
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
  scrollArea = document.getElementById('cvbArea') as HTMLElement
  progressBar = document.getElementById('cvbProgress')
  navDots = document.getElementById('cvbNav')
  if (!scrollArea) {
    return
  }

  scrollArea.style.height = TOTAL * 100 + 'vh'
  const panels = gsap.utils.toArray('.cvb-item') as HTMLElement[]

  ScrollTrigger.create({
    trigger: scrollArea,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.5,
    onUpdate: (self) => {
      const p = self.progress
      const focus = p * (TOTAL - 1)

      panels.forEach((panel, i) => {
        const dist = i - focus // 正=右侧等待, 负=左侧已过
        const absDist = Math.abs(dist)

        // X 位移：传送带从右到左
        const xShift = dist * 70 // vw 百分比
        // Y 微移：中央微抬
        const yShift = absDist * 20
        // 透视旋转：右侧面板面向左，左侧面板面向右
        const rotY = dist * -15
        // 缩放：中央最大
        const scale = Math.max(0.5, 1 - absDist * 0.15)
        const opacity = Math.max(0.05, 1 - absDist * 0.4)

        panel.style.transform = `perspective(1000px) translateX(${xShift}%) translateY(${yShift}px) rotateY(${rotY}deg) scale(${scale})`
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
  <div class="cvb-page">
    <div id="cvbProgress" class="cvb-progress-bar"></div>
    <nav id="cvbNav" class="cvb-nav-dots"></nav>
    <div class="cvb-indicator">
      <span class="cvb-cur">1</span> / {{ TOTAL }}
    </div>
    <!-- 传送带轨道装饰 -->
    <div class="cvb-rail cvb-rail-top"></div>
    <div class="cvb-rail cvb-rail-bottom"></div>

    <div id="cvbArea" class="cvb-scroll-area">
      <div class="cvb-viewport">
        <div class="cvb-belt">
          <div
            v-for="n in TOTAL"
            :key="n"
            class="cvb-item"
            :style="{
              background: `linear-gradient(${155 + (n - 1) * 20}deg, hsl(${(n - 1) * 44}, 52%, 30%), hsl(${(n - 1) * 44 + 20}, 38%, 15%))`,
            }"
          >
            <span class="cvb-num">{{ String(n).padStart(2, '0') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cvb-page {
  font-family: system-ui, -apple-system, sans-serif;
  background: #060610;
  color: #fff;
}

.cvb-scroll-area {
  position: relative;
}

.cvb-viewport {
  position: sticky;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cvb-belt {
  position: relative;
  width: 50vw;
  height: 65vh;
}

.cvb-item {
  position: absolute;
  inset: 0;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  will-change: transform, opacity;
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.4);
}

.cvb-num {
  font-size: clamp(4rem, 8vw, 7rem);
  font-weight: 900;
  color: rgba(255, 255, 255, 0.05);
  user-select: none;
  pointer-events: none;
}

.cvb-rail {
  position: fixed;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent 5%, rgba(255, 255, 255, 0.04) 30%, rgba(255, 255, 255, 0.04) 70%, transparent 95%);
  z-index: 50;
  pointer-events: none;
}

.cvb-rail-top {
  top: 14vh;
}

.cvb-rail-bottom {
  bottom: 14vh;
}

@media (max-width: 768px) {
  .cvb-belt {
    width: 80vw;
    height: 55vh;
  }
}
</style>

<style lang="scss">
$accent: #f472b6;

.cvb-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  width: 0%;
  background: linear-gradient(90deg, $accent, #c084fc);
  z-index: 1001;
}

.cvb-nav-dots {
  position: fixed;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  gap: 12px;
}

.cvb-dot {
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

  &.cvb-active {
    background: $accent;
    border-color: rgba(255, 255, 255, 0.35);
    transform: scale(1.5);
    box-shadow: 0 0 14px rgba($accent, 0.5);
  }
}

.cvb-indicator {
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

  .cvb-cur {
    color: $accent;
    font-weight: 700;
  }
}
</style>

