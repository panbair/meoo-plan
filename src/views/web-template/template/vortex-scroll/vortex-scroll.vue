<script setup lang="ts">
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ==================== 状态 ====================
const totalPanels = 6
let currentIndex = 0
let vh = 0
let isJumping = false
let touchStartY = 0

let containerEl: HTMLElement | null = null
let progressBar: HTMLElement | null = null
let navDots: HTMLElement | null = null
let scrollTriggers: ScrollTrigger[] = []

// ==================== 导航点 ====================
function createNavDots() {
  if (!navDots) return
  navDots.innerHTML = ''
  for (let i = 0; i < totalPanels; i++) {
    const dot = document.createElement('button')
    dot.className = 'vortex-scroll-nav-dot' + (i === 0 ? ' vortex-scroll-active' : '')
    dot.addEventListener('click', () => goToPanel(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.vortex-scroll-nav-dot').forEach((dot, i) => {
    dot.classList.toggle('vortex-scroll-active', i === index)
  })
  const currentEl = document.querySelector('.vortex-scroll-page-indicator .vortex-scroll-current')
  if (currentEl) currentEl.textContent = String(index + 1)
  if (progressBar) progressBar.style.width = ((index + 1) / totalPanels) * 100 + '%'
}

function goToPanel(index: number) {
  if (!containerEl) return
  index = ((index % totalPanels) + totalPanels) % totalPanels
  currentIndex = index
  updateUI(index)
  scrollTriggers.forEach((st) => st.disable())
  containerEl.scrollTop = index * vh
  requestAnimationFrame(() => scrollTriggers.forEach((st) => st.enable()))
}

function onKeydown(e: KeyboardEvent) {
  const keyMap: Record<string, number> = { ArrowDown: 1, PageDown: 1, ArrowUp: -1, PageUp: -1, Home: 0, End: totalPanels - 1 }
  if (keyMap[e.key] !== undefined) {
    e.preventDefault()
    e.key === 'Home' || e.key === 'End'
      ? goToPanel(keyMap[e.key])
      : goToPanel(currentIndex + keyMap[e.key])
  }
}

function onTouchStart(e: TouchEvent) { touchStartY = e.touches[0].clientY }
function onTouchEnd(e: TouchEvent) {
  const diff = touchStartY - e.changedTouches[0].clientY
  if (Math.abs(diff) > 50) goToPanel(currentIndex + (diff > 0 ? 1 : -1))
}

function onScroll() {
  if (!containerEl || isJumping) return
  const scrollTop = containerEl.scrollTop
  let index = Math.round(scrollTop / vh) % totalPanels
  if (index !== currentIndex) { currentIndex = index; updateUI(currentIndex) }
}

// ==================== 漩涡动画 ====================
function initVortexAnimations() {
  const panels = gsap.utils.toArray('.vortex-scroll-panel') as HTMLElement[]
  const stage = document.getElementById('vortexScrollStage') as HTMLElement
  if (!stage) return

  // 主 ST：驱动面板轨道旋转
  const mainST = ScrollTrigger.create({
    trigger: containerEl,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.6,
    onUpdate: (self) => {
      const progress = self.progress
      panels.forEach((panel, i) => {
        const angle = (i * 360 / totalPanels) + progress * 360
        const dist = 200 + Math.sin(progress * Math.PI * 2 + i) * 60
        const rad = (angle * Math.PI) / 180
        const tx = Math.cos(rad) * dist
        const ty = Math.sin(rad) * dist
        const scale = 0.4 + Math.abs(Math.sin(progress * Math.PI)) * 0.5
        gsap.set(panel, {
          x: tx, y: ty,
          scale: scale,
          rotate: angle * 0.2
        })
      })
    }
  })
  scrollTriggers.push(mainST)
}

// ==================== 初始化 / 销毁 ====================
function init() {
  vh = window.innerHeight
  containerEl = document.getElementById('vortexScrollContainer') as HTMLElement
  progressBar = document.getElementById('vortexScrollProgressBar')
  navDots = document.getElementById('vortexScrollNavDots')
  if (!containerEl || !progressBar || !navDots) return

  // 初始：所有面板散开到轨道上
  const panels = gsap.utils.toArray('.vortex-scroll-panel') as HTMLElement[]
  panels.forEach((panel, i) => {
    const angle = (i * 360) / totalPanels
    const rad = (angle * Math.PI) / 180
    gsap.set(panel, {
      x: Math.cos(rad) * 200,
      y: Math.sin(rad) * 200,
      scale: 0.4,
      opacity: 0.8
    })
  })

  scrollTriggers.push(ScrollTrigger.create({
    trigger: containerEl,
    start: 'top top',
    end: `+=${totalPanels * 100}%`,
    snap: { snapTo: 1 / totalPanels, duration: { min: 0.2, max: 0.45 }, delay: 0.05, ease: 'power1.inOut' }
  }))

  initVortexAnimations()

  containerEl.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('keydown', onKeydown)
  document.addEventListener('touchstart', onTouchStart, { passive: true })
  document.addEventListener('touchend', onTouchEnd, { passive: true })

  createNavDots()
  updateUI(0)
}

function destroy() {
  scrollTriggers.forEach((st) => st.kill())
  scrollTriggers = []
  containerEl?.removeEventListener('scroll', onScroll)
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('touchstart', onTouchStart)
  document.removeEventListener('touchend', onTouchEnd)
}

onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>

<template>
  <div class="vortex-scroll-brand-page">
    <div id="vortexScrollProgressBar" class="vortex-scroll-progress-bar"></div>
    <nav id="vortexScrollNavDots" class="vortex-scroll-nav-dots"></nav>
    <div class="vortex-scroll-page-indicator">
      <span class="vortex-scroll-current">1</span><span class="vortex-scroll-total"> / {{ totalPanels }}</span>
    </div>

    <div id="vortexScrollContainer" class="vortex-scroll-container">
      <div class="vortex-stage-sticky">
        <div id="vortexScrollStage" class="vortex-stage">
          <div class="vortex-center"></div>
          <section class="vortex-scroll-panel vortex-scroll-panel-0" data-index="0">第一屏</section>
          <section class="vortex-scroll-panel vortex-scroll-panel-1" data-index="1">第二屏</section>
          <section class="vortex-scroll-panel vortex-scroll-panel-2" data-index="2">第三屏</section>
          <section class="vortex-scroll-panel vortex-scroll-panel-3" data-index="3">第四屏</section>
          <section class="vortex-scroll-panel vortex-scroll-panel-4" data-index="4">第五屏</section>
          <section class="vortex-scroll-panel vortex-scroll-panel-5" data-index="5">第六屏</section>
        </div>
      </div>
      <!-- 滚动空间 -->
      <div class="vortex-scroll-spacer" :style="{ height: totalPanels * 100 + 'vh' }"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.vortex-scroll-brand-page {
  height: 100vh;
  overflow: hidden;
  font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif;
  background: #08080f;
  color: #fff;
}

.vortex-scroll-container {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
}

.vortex-scroll-spacer {
  pointer-events: none;
}

.vortex-stage-sticky {
  position: sticky;
  top: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.vortex-stage {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.vortex-center {
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6c8cff, #a78bfa);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 40px rgba(108, 140, 255, 0.4);
  animation: vortexCenterPulse 2s ease-in-out infinite;
}

@keyframes vortexCenterPulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); box-shadow: 0 0 40px rgba(108, 140, 255, 0.4); }
  50% { transform: translate(-50%, -50%) scale(1.15); box-shadow: 0 0 70px rgba(108, 140, 255, 0.7); }
}

.vortex-scroll-panel {
  position: absolute;
  width: 120px;
  height: 120px;
  top: 50%;
  left: 50%;
  margin: -60px 0 0 -60px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 700;
  will-change: transform;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
}

.vortex-scroll-panel-0 { background: rgba(108, 140, 255, 0.15); }
.vortex-scroll-panel-1 { background: rgba(167, 139, 250, 0.15); }
.vortex-scroll-panel-2 { background: rgba(244, 114, 182, 0.15); }
.vortex-scroll-panel-3 { background: rgba(74, 222, 128, 0.15); }
.vortex-scroll-panel-4 { background: rgba(250, 204, 21, 0.15); }
.vortex-scroll-panel-5 { background: rgba(56, 189, 248, 0.15); }

@media (max-width: 768px) {
  .vortex-scroll-panel { width: 80px; height: 80px; margin: -40px 0 0 -40px; font-size: 0.75rem; }
}
</style>

<style lang="scss">
.vortex-scroll-nav-dots {
  position: fixed;
  right: 28px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.vortex-scroll-nav-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  &:hover { background: rgba(255, 255, 255, 0.5); transform: scale(1.3); }
  &.vortex-scroll-active {
    background: #6c8cff;
    border-color: rgba(108, 140, 255, 0.5);
    transform: scale(1.4);
    box-shadow: 0 0 20px rgba(108, 140, 255, 0.5);
  }
}
.vortex-scroll-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #6c8cff, #a78bfa, #f472b6);
  z-index: 1001;
  width: 0%;
  box-shadow: 0 0 10px rgba(108, 140, 255, 0.4);
  transition: width 0.4s ease;
}
.vortex-scroll-page-indicator {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(12px);
  padding: 8px 22px;
  border-radius: 25px;
  font-size: 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
}
@media (max-width: 768px) {
  .vortex-scroll-nav-dots { right: 12px; gap: 10px; }
}
</style>
