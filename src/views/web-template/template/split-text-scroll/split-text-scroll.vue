<script setup lang="ts">
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ==================== 状态 ====================
const totalPanels = 5
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
    dot.className = 'split-text-scroll-nav-dot' + (i === 0 ? ' split-text-scroll-active' : '')
    dot.addEventListener('click', () => goToPanel(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.split-text-scroll-nav-dot').forEach((dot, i) => {
    dot.classList.toggle('split-text-scroll-active', i === index)
  })
  const currentEl = document.querySelector('.split-text-scroll-page-indicator .split-text-scroll-current')
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

// ==================== 逐字拆分 + 入场动画 ====================
function initSplitTextAnimations() {
  const panels = gsap.utils.toArray('.split-text-scroll-panel') as HTMLElement[]
  panels.forEach((panel) => {
    const titleEl = panel.querySelector('.split-text-title') as HTMLElement
    if (!titleEl) return
    const text = titleEl.textContent || ''
    if (!text.trim()) return
    titleEl.textContent = ''

    // 拆分为独立 span
    const chars = text.split('')
    chars.forEach((char) => {
      const span = document.createElement('span')
      span.className = 'split-char'
      span.textContent = char === ' ' ? '\u00A0' : char
      titleEl.appendChild(span)
    })

    const charEls = titleEl.querySelectorAll('.split-char')

    // 初始化：散开到随机位置
    gsap.set(charEls, {
      opacity: 0,
      y: () => gsap.utils.random(-80, 80),
      x: () => gsap.utils.random(-60, 60),
      rotation: () => gsap.utils.random(-45, 45),
      scale: 0.3
    })

    // 入场：逐字从中间向两侧 stagger 飞入
    const st = ScrollTrigger.create({
      trigger: panel,
      start: 'top 75%',
      onEnter: () => {
        gsap.to(charEls, {
          opacity: 1, y: 0, x: 0, rotation: 0, scale: 1,
          duration: 0.5,
          stagger: { each: 0.03, from: 'center' },
          ease: 'back.out(1.7)'
        })
      },
      onLeaveBack: () => {
        gsap.to(charEls, {
          opacity: 0,
          y: () => gsap.utils.random(-80, 80),
          x: () => gsap.utils.random(-60, 60),
          rotation: () => gsap.utils.random(-45, 45),
          scale: 0.3,
          duration: 0.3,
          stagger: { each: 0.02, from: 'edges' }
        })
      }
    })
    scrollTriggers.push(st)
  })
}

// ==================== 初始化 / 销毁 ====================
function init() {
  vh = window.innerHeight
  containerEl = document.getElementById('splitTextScrollContainer') as HTMLElement
  progressBar = document.getElementById('splitTextScrollProgressBar')
  navDots = document.getElementById('splitTextScrollNavDots')
  if (!containerEl || !progressBar || !navDots) return

  scrollTriggers.push(ScrollTrigger.create({
    trigger: containerEl,
    start: 'top top',
    end: `+=${totalPanels * 100}%`,
    snap: { snapTo: 1 / totalPanels, duration: { min: 0.2, max: 0.45 }, delay: 0.05, ease: 'power1.inOut' }
  }))

  initSplitTextAnimations()

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
  <div class="split-text-scroll-brand-page">
    <div id="splitTextScrollProgressBar" class="split-text-scroll-progress-bar"></div>
    <nav id="splitTextScrollNavDots" class="split-text-scroll-nav-dots"></nav>
    <div class="split-text-scroll-page-indicator">
      <span class="split-text-scroll-current">1</span><span class="split-text-scroll-total"> / {{ totalPanels }}</span>
    </div>

    <div id="splitTextScrollContainer" class="split-text-scroll-container">
      <section class="split-text-scroll-panel split-text-scroll-panel-0">
        <div class="split-text-title">第一屏标题</div>
      </section>
      <section class="split-text-scroll-panel split-text-scroll-panel-1">
        <div class="split-text-title">第二屏标题</div>
      </section>
      <section class="split-text-scroll-panel split-text-scroll-panel-2">
        <div class="split-text-title">第三屏标题</div>
      </section>
      <section class="split-text-scroll-panel split-text-scroll-panel-3">
        <div class="split-text-title">第四屏标题</div>
      </section>
      <section class="split-text-scroll-panel split-text-scroll-panel-4">
        <div class="split-text-title">第五屏标题</div>
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
.split-text-scroll-brand-page {
  height: 100vh;
  overflow: hidden;
  font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif;
  background: #0a0a0f;
  color: #fff;
}

.split-text-scroll-container {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

.split-text-scroll-panel {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 20px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    pointer-events: none;
  }
}

.split-text-title {
  font-size: 3rem;
  font-weight: 900;
  letter-spacing: 2px;
  text-align: center;
  background: linear-gradient(135deg, #6c8cff, #a78bfa, #f472b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.split-char {
  display: inline-block;
  will-change: transform, opacity;
}

.split-text-scroll-panel-0 { background: linear-gradient(180deg, #0a0f24, #1a1a5e); }
.split-text-scroll-panel-1 { background: linear-gradient(135deg, #0f2027, #2c5364); }
.split-text-scroll-panel-2 { background: linear-gradient(135deg, #141e30, #243b55); }
.split-text-scroll-panel-3 { background: linear-gradient(135deg, #1a1a2e, #0f3460); }
.split-text-scroll-panel-4 { background: linear-gradient(135deg, #0b1331, #1c2856); }

@media (max-width: 768px) {
  .split-text-scroll-panel { padding: 60px 20px; }
  .split-text-title { font-size: 2rem; }
}
</style>

<style lang="scss">
.split-text-scroll-nav-dots {
  position: fixed;
  right: 28px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.split-text-scroll-nav-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  &:hover { background: rgba(255, 255, 255, 0.5); transform: scale(1.3); }
  &.split-text-scroll-active {
    background: #a78bfa;
    border-color: rgba(167, 139, 250, 0.5);
    transform: scale(1.4);
    box-shadow: 0 0 20px rgba(167, 139, 250, 0.5);
  }
}
.split-text-scroll-progress-bar {
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
.split-text-scroll-page-indicator {
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
  .split-text-scroll-nav-dots { right: 12px; gap: 10px; }
}
</style>
