<script setup lang="ts">
/**
 * ==================== Scroll Flat-to-3D ====================
 * 平面转3D —— 维度切换模板：
 *   阶段一(面板1~4)：标准纵向滚动，面板全屏平铺
 *   阶段二(面板4~8)：切换为3D透视纵深穿越，面板沿Z轴排列，
 *     scroll 驱动"镜头"沿Z轴前进，穿过叠放的面板
 *
 * 核心：阶段一用 translateY，阶段二用 perspective + translateZ
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const FLAT_COUNT = 4
const DEPTH_COUNT = 5
const TOTAL = FLAT_COUNT + DEPTH_COUNT - 1 // 8, 面板4共享
const Z_GAP = 900

let currentIndex = 0
let vh = 0
let scrollArea: HTMLElement | null = null
let flatTrack: HTMLElement | null = null
let depthTrack: HTMLElement | null = null
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
    dot.className = 'ftd-dot' + (i === 0 ? ' ftd-active' : '')
    dot.setAttribute('data-phase', i < FLAT_COUNT ? 'flat' : 'depth')
    dot.addEventListener('click', () => goTo(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.ftd-dot').forEach((d, i) => {
    d.classList.toggle('ftd-active', i === index)
  })
  const el = document.querySelector('.ftd-indicator .ftd-cur')
  if (el) {
    el.textContent = String(index + 1)
  }
  const phaseEl = document.querySelector('.ftd-indicator .ftd-phase')
  if (phaseEl) {
    phaseEl.textContent = index < FLAT_COUNT ? '2D' : '3D'
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
  vh = window.innerHeight

  scrollArea = document.getElementById('ftdArea') as HTMLElement
  flatTrack = document.getElementById('ftdFlatTrack') as HTMLElement
  depthTrack = document.getElementById('ftdDepthTrack') as HTMLElement
  progressBar = document.getElementById('ftdProgress')
  navDots = document.getElementById('ftdNav')
  if (!scrollArea || !flatTrack || !depthTrack) {
    return
  }

  scrollArea.style.height = TOTAL * 100 + 'vh'

  const splitP = (FLAT_COUNT - 1) / (TOTAL - 1)

  ScrollTrigger.create({
    trigger: scrollArea,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.5,
    onUpdate: (self) => {
      const p = self.progress

      if (p <= splitP) {
        // 阶段一：平面纵向滚动
        const flatProg = splitP > 0 ? p / splitP : 0
        const yMove = -flatProg * (FLAT_COUNT - 1) * vh
        flatTrack!.style.transform = `translateY(${yMove}px)`
        flatTrack!.style.opacity = '1'

        // 隐藏3D轨道
        depthTrack!.style.opacity = '0'
        depthTrack!.style.pointerEvents = 'none'
      } else {
        // 阶段二：3D纵深穿越
        const depthProg = (p - splitP) / (1 - splitP)

        // 隐藏平面轨道（锁定在最后一帧）
        flatTrack!.style.transform = `translateY(${-(FLAT_COUNT - 1) * vh}px)`
        flatTrack!.style.opacity = '0'

        // 显示3D轨道
        depthTrack!.style.opacity = '1'
        depthTrack!.style.pointerEvents = 'auto'

        // 镜头沿Z轴前进
        const zMove = depthProg * (DEPTH_COUNT - 1) * Z_GAP
        depthTrack!.style.transform = `translateZ(${zMove}px)`

        // 每层面板的透明度
        const depthPanels = depthTrack!.querySelectorAll('.ftd-depth-panel') as NodeListOf<HTMLElement>
        depthPanels.forEach((panel, i) => {
          const layerZ = -i * Z_GAP + zMove
          const behind = layerZ > 300
          if (behind) {
            panel.style.opacity = '0'
          } else {
            const dist = Math.abs(layerZ)
            panel.style.opacity = String(Math.max(0.05, 1 - dist / (Z_GAP * 1.5)))
          }
        })
      }

      const idx = Math.round(p * (TOTAL - 1))
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
  <div class="ftd-page">
    <div id="ftdProgress" class="ftd-progress-bar"></div>
    <nav id="ftdNav" class="ftd-nav-dots"></nav>
    <div class="ftd-indicator">
      <span class="ftd-phase">2D</span>
      <span class="ftd-cur">1</span>
      <span class="ftd-tot"> / {{ TOTAL }}</span>
    </div>

    <div id="ftdArea" class="ftd-scroll-area">
      <div class="ftd-viewport">
        <!-- 阶段一：平面纵向轨道 -->
        <div id="ftdFlatTrack" class="ftd-flat-track">
          <section
            v-for="n in FLAT_COUNT"
            :key="'flat' + n"
            class="ftd-panel"
            :style="{
              background: `linear-gradient(${150 + (n - 1) * 20}deg, hsl(${210 + (n - 1) * 20}, 50%, 30%), hsl(${230 + (n - 1) * 20}, 38%, 16%))`,
            }"
          >
            <span class="ftd-num">{{ String(n).padStart(2, '0') }}</span>
            <div v-if="n === FLAT_COUNT" class="ftd-dimension-hint">
              <span class="ftd-hint-text">进入 3D</span>
              <span class="ftd-hint-arrow">⟩</span>
            </div>
          </section>
        </div>

        <!-- 阶段二：3D纵深轨道 -->
        <div id="ftdDepthTrack" class="ftd-depth-track">
          <section
            v-for="n in DEPTH_COUNT"
            :key="'depth' + n"
            class="ftd-panel ftd-depth-panel"
            :style="{
              transform: `translateZ(${-(n - 1) * Z_GAP}px)`,
              background: `radial-gradient(ellipse at center, hsl(${320 + (n - 1) * 25}, 55%, 32%) 0%, hsl(${340 + (n - 1) * 25}, 40%, 14%) 100%)`,
            }"
          >
            <span class="ftd-num">{{ String(FLAT_COUNT - 1 + n).padStart(2, '0') }}</span>
            <div class="ftd-depth-ring"></div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ftd-page {
  font-family: system-ui, -apple-system, sans-serif;
  background: #060610;
  color: #fff;
}

.ftd-scroll-area {
  position: relative;
}

.ftd-viewport {
  position: sticky;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

/* 平面轨道 */
.ftd-flat-track {
  position: absolute;
  inset: 0;
  will-change: transform;
  transition: opacity 0.4s;
}

/* 3D轨道 */
.ftd-depth-track {
  position: absolute;
  inset: 0;
  perspective: 1000px;
  perspective-origin: 50% 50%;
  transform-style: preserve-3d;
  will-change: transform;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s;
}

.ftd-panel {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 24px;
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 20px;
    pointer-events: none;
  }
}

.ftd-depth-panel {
  position: absolute;
  inset: 5vh 5vw;
  width: auto;
  height: auto;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  backface-visibility: hidden;
  will-change: transform, opacity;
}

.ftd-num {
  font-size: clamp(4rem, 10vw, 8rem);
  font-weight: 900;
  color: rgba(255, 255, 255, 0.05);
  user-select: none;
  pointer-events: none;
  z-index: 1;
}

.ftd-depth-ring {
  position: absolute;
  width: 40%;
  height: 40%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 50%;
  pointer-events: none;
}

.ftd-dimension-hint {
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.18);
  font-size: 0.85rem;
  letter-spacing: 2px;
  animation: ftd-glow 2s ease-in-out infinite;
}

.ftd-hint-arrow {
  font-size: 1.2rem;
  animation: ftd-arrow 1.5s ease-in-out infinite;
}

@keyframes ftd-glow {
  0%,
  100% {
    opacity: 0.4;
  }
  50% {
    opacity: 1;
  }
}

@keyframes ftd-arrow {
  0%,
  100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(6px);
  }
}
</style>

<style lang="scss">
$c-flat: #60a5fa;
$c-depth: #f472b6;

.ftd-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  width: 0%;
  background: linear-gradient(90deg, $c-flat, $c-flat 40%, $c-depth 60%, $c-depth);
  z-index: 1001;
}

.ftd-nav-dots {
  position: fixed;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ftd-dot {
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

  &[data-phase='flat'].ftd-active {
    background: $c-flat;
    border-color: rgba(255, 255, 255, 0.35);
    transform: scale(1.5);
    box-shadow: 0 0 14px rgba($c-flat, 0.5);
  }

  &[data-phase='depth'].ftd-active {
    background: $c-depth;
    border-color: rgba(255, 255, 255, 0.35);
    transform: scale(1.5);
    box-shadow: 0 0 14px rgba($c-depth, 0.5);
  }
}

.ftd-indicator {
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

  .ftd-phase {
    font-size: 0.7rem;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 6px;
    transition: all 0.3s;
    background: rgba($c-flat, 0.2);
    color: $c-flat;
    border: 1px solid rgba($c-flat, 0.3);
  }

  .ftd-cur {
    font-weight: 700;
  }
}
</style>

