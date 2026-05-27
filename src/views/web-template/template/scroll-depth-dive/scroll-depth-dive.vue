<script setup lang="ts">
/**
 * ==================== Scroll Depth Dive ====================
 * 纵深潜入 —— 面板沿 Z 轴纵深排列(从近到远)，
 * 竖滚驱动"镜头"沿 Z 轴向前穿越，逐个穿过面板
 *
 * 核心机制：
 *   1. scrollArea 撑出纵向空间
 *   2. sticky viewport + perspective 创建 3D 深度
 *   3. 每个面板 translateZ 定位在不同深度
 *   4. scroll → 整个容器 translateZ 向前推进
 *   5. 面板从远处飞来→充满屏幕→飞过头顶消失
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const TOTAL = 8
const Z_GAP = 800 // 每层 Z 间距

let currentIndex = 0
let scrollArea: HTMLElement | null = null
let tunnel: HTMLElement | null = null
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
    dot.className = 'ddv-dot' + (i === 0 ? ' ddv-active' : '')
    dot.addEventListener('click', () => goTo(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.ddv-dot').forEach((d, i) => {
    d.classList.toggle('ddv-active', i === index)
  })
  const el = document.querySelector('.ddv-indicator .ddv-cur')
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
  scrollArea = document.getElementById('ddvArea') as HTMLElement
  tunnel = document.getElementById('ddvTunnel')
  progressBar = document.getElementById('ddvProgress')
  navDots = document.getElementById('ddvNav')
  if (!scrollArea || !tunnel) {
    return
  }

  scrollArea.style.height = TOTAL * 100 + 'vh'

  // 面板定位到不同深度
  const panels = gsap.utils.toArray('.ddv-layer') as HTMLElement[]
  panels.forEach((panel, i) => {
    panel.style.transform = `translateZ(${-i * Z_GAP}px)`
  })

  // 滚动驱动镜头前推
  ScrollTrigger.create({
    trigger: scrollArea,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.5,
    onUpdate: (self) => {
      const p = self.progress
      const zMove = p * (TOTAL - 1) * Z_GAP
      if (tunnel) {
        tunnel.style.transform = `translateZ(${zMove}px)`
      }

      // 计算当前面板
      const idx = Math.min(TOTAL - 1, Math.floor(p * TOTAL))
      if (idx !== currentIndex) {
        currentIndex = idx
        updateUI(idx)
      }

      // 面板透明度：即将穿过的清晰，已穿过的消失
      panels.forEach((panel, i) => {
        const layerZ = -i * Z_GAP + zMove
        // layerZ ≈ 0 表示正在面前
        const dist = Math.abs(layerZ)
        const behind = layerZ > 200 // 已经飞过去了

        if (behind) {
          panel.style.opacity = '0'
          panel.style.pointerEvents = 'none'
        } else {
          const vis = Math.max(0.05, 1 - dist / (Z_GAP * 1.5))
          panel.style.opacity = String(vis)
          panel.style.pointerEvents = vis > 0.3 ? 'auto' : 'none'
        }
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
  <div class="ddv-page">
    <div id="ddvProgress" class="ddv-progress-bar"></div>
    <nav id="ddvNav" class="ddv-nav-dots"></nav>
    <div class="ddv-indicator">
      <span class="ddv-cur">1</span> / {{ TOTAL }}
    </div>

    <div id="ddvArea" class="ddv-scroll-area">
      <div class="ddv-viewport">
        <div id="ddvTunnel" class="ddv-tunnel">
          <div
            v-for="n in TOTAL"
            :key="n"
            class="ddv-layer"
            :style="{
              background: `radial-gradient(ellipse at center, hsl(${(n - 1) * 40 + 200}, 55%, 32%) 0%, hsl(${(n - 1) * 40 + 220}, 40%, 16%) 100%)`,
            }"
          >
            <span class="ddv-num">{{ String(n).padStart(2, '0') }}</span>
            <div class="ddv-ring"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ddv-page {
  font-family: system-ui, -apple-system, sans-serif;
  background: #080814;
  color: #fff;
}

.ddv-scroll-area {
  position: relative;
}

.ddv-viewport {
  position: sticky;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  perspective: 1000px;
  perspective-origin: 50% 50%;
}

.ddv-tunnel {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  will-change: transform;
}

.ddv-layer {
  position: absolute;
  inset: 5vh 5vw;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  backface-visibility: hidden;
  border: 1px solid rgba(255, 255, 255, 0.06);
  will-change: transform, opacity;
}

.ddv-num {
  font-size: clamp(4rem, 10vw, 8rem);
  font-weight: 900;
  color: rgba(255, 255, 255, 0.06);
  user-select: none;
  pointer-events: none;
  z-index: 1;
}

.ddv-ring {
  position: absolute;
  width: 50%;
  height: 50%;
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 50%;
  pointer-events: none;
}
</style>

<style lang="scss">
$accent: #4ae0c0;

.ddv-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  width: 0%;
  background: linear-gradient(90deg, $accent, #60a0ff);
  z-index: 1001;
}

.ddv-nav-dots {
  position: fixed;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ddv-dot {
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

  &.ddv-active {
    background: $accent;
    border-color: rgba(255, 255, 255, 0.35);
    transform: scale(1.5);
    box-shadow: 0 0 14px rgba($accent, 0.5);
  }
}

.ddv-indicator {
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

  .ddv-cur {
    color: $accent;
    font-weight: 700;
  }
}
</style>



