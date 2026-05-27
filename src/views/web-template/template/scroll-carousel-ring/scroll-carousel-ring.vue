<script setup lang="ts">
/**
 * ==================== Scroll Carousel Ring ====================
 * 旋转木马环 —— 面板围成 3D 圆环，竖滚驱动整个圆环绕 Y 轴旋转
 *
 * 核心机制：
 *   1. scrollArea 撑出 TOTAL×100vh 的纵向滚动空间
 *   2. sticky viewport 锁住视口
 *   3. 每个面板用 rotateY + translateZ 定位在圆环上
 *   4. scroll progress → 整个容器 rotateY(0 → -360°)
 *   5. 面对镜头的面板放大突出(scale + opacity)
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const TOTAL = 8
const ANGLE_STEP = 360 / TOTAL
const RADIUS = 600 // 圆环半径(px)

let currentIndex = 0
let scrollArea: HTMLElement | null = null
let ring: HTMLElement | null = null
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
    dot.className = 'crr-dot' + (i === 0 ? ' crr-active' : '')
    dot.addEventListener('click', () => goTo(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.crr-dot').forEach((d, i) => {
    d.classList.toggle('crr-active', i === index)
  })
  const el = document.querySelector('.crr-indicator .crr-cur')
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
  scrollArea = document.getElementById('crrArea') as HTMLElement
  ring = document.getElementById('crrRing')
  progressBar = document.getElementById('crrProgress')
  navDots = document.getElementById('crrNav')
  if (!scrollArea || !ring) {
    return
  }

  scrollArea.style.height = TOTAL * 100 + 'vh'

  // 面板定位到圆环上
  const panels = gsap.utils.toArray('.crr-card') as HTMLElement[]
  panels.forEach((panel, i) => {
    const angle = i * ANGLE_STEP
    panel.style.transform = `rotateY(${angle}deg) translateZ(${RADIUS}px)`
  })

  // 滚动驱动圆环旋转
  ScrollTrigger.create({
    trigger: scrollArea,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.5,
    onUpdate: (self) => {
      const p = self.progress
      const rotation = -p * 360
      if (ring) {
        ring.style.transform = `rotateY(${rotation}deg)`
      }

      // 计算当前面对镜头的面板
      const idx = Math.round(p * (TOTAL - 1))
      if (idx !== currentIndex) {
        currentIndex = idx
        updateUI(idx)
      }

      // 高亮面对镜头的面板
      panels.forEach((panel, i) => {
        const panelAngle = i * ANGLE_STEP
        // 面板在世界空间的角度
        const worldAngle = ((panelAngle + rotation) % 360 + 360) % 360
        // 面对镜头 = worldAngle ≈ 0 (或 360)
        const dist = Math.min(worldAngle, 360 - worldAngle)
        const isFront = dist < ANGLE_STEP * 0.8
        panel.classList.toggle('crr-front', isFront)
      })
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
  <div class="crr-page">
    <div id="crrProgress" class="crr-progress-bar"></div>
    <nav id="crrNav" class="crr-nav-dots"></nav>
    <div class="crr-indicator">
      <span class="crr-cur">1</span> / {{ TOTAL }}
    </div>

    <div id="crrArea" class="crr-scroll-area">
      <div class="crr-viewport">
        <div id="crrRing" class="crr-ring">
          <div
            v-for="n in TOTAL"
            :key="n"
            class="crr-card"
            :style="{
              background: `linear-gradient(160deg, hsl(${(n - 1) * 45}, 55%, 35%), hsl(${(n - 1) * 45 + 30}, 40%, 20%))`,
            }"
          >
            <span class="crr-num">{{ String(n).padStart(2, '0') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.crr-page {
  font-family: system-ui, -apple-system, sans-serif;
  background: #0a0a18;
  color: #fff;
}

.crr-scroll-area {
  position: relative;
}

.crr-viewport {
  position: sticky;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  perspective: 1400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.crr-ring {
  position: relative;
  width: 320px;
  height: 420px;
  transform-style: preserve-3d;
  will-change: transform;
}

.crr-card {
  position: absolute;
  inset: 0;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  backface-visibility: hidden;
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  transition:
    opacity 0.3s,
    filter 0.3s;
  opacity: 0.4;
  filter: brightness(0.5);

  &.crr-front {
    opacity: 1;
    filter: brightness(1);
    box-shadow:
      0 12px 48px rgba(0, 0, 0, 0.5),
      0 0 40px rgba(108, 140, 255, 0.1);
  }
}

.crr-num {
  font-size: clamp(3rem, 8vw, 5rem);
  font-weight: 900;
  color: rgba(255, 255, 255, 0.08);
  user-select: none;
  pointer-events: none;
}

@media (max-width: 600px) {
  .crr-ring {
    width: 240px;
    height: 320px;
  }
}
</style>

<style lang="scss">
$accent: #6c8cff;

.crr-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  width: 0%;
  background: linear-gradient(90deg, $accent, #a78bfa);
  z-index: 1001;
}

.crr-nav-dots {
  position: fixed;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.crr-dot {
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

  &.crr-active {
    background: $accent;
    border-color: rgba(255, 255, 255, 0.35);
    transform: scale(1.5);
    box-shadow: 0 0 14px rgba($accent, 0.5);
  }
}

.crr-indicator {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.08);

  .crr-cur {
    color: $accent;
    font-weight: 700;
  }
}
</style>



