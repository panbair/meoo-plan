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
    dot.className = 'counter-scroll-nav-dot' + (i === 0 ? ' counter-scroll-active' : '')
    dot.addEventListener('click', () => goToPanel(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.counter-scroll-nav-dot').forEach((dot, i) => {
    dot.classList.toggle('counter-scroll-active', i === index)
  })
  const currentEl = document.querySelector('.counter-scroll-page-indicator .counter-scroll-current')
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

// ==================== 数字递增动画 ====================
function animateCounter(el: HTMLElement, target: number, suffix: string) {
  const obj = { val: 0 }
  gsap.to(obj, {
    val: target,
    duration: 1.5,
    ease: 'power2.out',
    snap: { val: target >= 100 ? 1 : 0.1 },
    onUpdate: () => {
      el.textContent = Math.floor(obj.val).toLocaleString() + suffix
    }
  })
}

function initCounterAnimations() {
  const panels = gsap.utils.toArray('.counter-scroll-panel') as HTMLElement[]
  panels.forEach((panel) => {
    const counterEl = panel.querySelector('.counter-number') as HTMLElement
    if (!counterEl) return
    const targetAttr = counterEl.getAttribute('data-target')
    const suffix = counterEl.getAttribute('data-suffix') || ''
    const target = targetAttr ? parseFloat(targetAttr) : 0

    const st = ScrollTrigger.create({
      trigger: panel,
      start: 'top 70%',
      onEnter: () => animateCounter(counterEl, target, suffix),
      onLeaveBack: () => { counterEl.textContent = '0' + suffix }
    })
    scrollTriggers.push(st)
  })
}

// ==================== 初始化 / 销毁 ====================
function init() {
  vh = window.innerHeight
  containerEl = document.getElementById('counterScrollContainer') as HTMLElement
  progressBar = document.getElementById('counterScrollProgressBar')
  navDots = document.getElementById('counterScrollNavDots')
  if (!containerEl || !progressBar || !navDots) return

  scrollTriggers.push(ScrollTrigger.create({
    trigger: containerEl,
    start: 'top top',
    end: `+=${totalPanels * 100}%`,
    snap: { snapTo: 1 / totalPanels, duration: { min: 0.2, max: 0.45 }, delay: 0.05, ease: 'power1.inOut' }
  }))

  initCounterAnimations()

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
  <div class="counter-scroll-brand-page">
    <div id="counterScrollProgressBar" class="counter-scroll-progress-bar"></div>
    <nav id="counterScrollNavDots" class="counter-scroll-nav-dots"></nav>
    <div class="counter-scroll-page-indicator">
      <span class="counter-scroll-current">1</span><span class="counter-scroll-total"> / {{ totalPanels }}</span>
    </div>

    <div id="counterScrollContainer" class="counter-scroll-container">
      <section class="counter-scroll-panel counter-scroll-panel-0">
        <span class="counter-label">指标 1</span>
        <span class="counter-number" data-target="1280" data-suffix="+">0+</span>
      </section>
      <section class="counter-scroll-panel counter-scroll-panel-1">
        <span class="counter-label">指标 2</span>
        <span class="counter-number" data-target="3800" data-suffix="">0</span>
      </section>
      <section class="counter-scroll-panel counter-scroll-panel-2">
        <span class="counter-label">指标 3</span>
        <span class="counter-number" data-target="5200" data-suffix="+">0+</span>
      </section>
      <section class="counter-scroll-panel counter-scroll-panel-3">
        <span class="counter-label">指标 4</span>
        <span class="counter-number" data-target="99.9" data-suffix="%">0%</span>
      </section>
      <section class="counter-scroll-panel counter-scroll-panel-4">
        <span class="counter-label">指标 5</span>
        <span class="counter-number" data-target="326" data-suffix="">0</span>
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
.counter-scroll-brand-page {
  height: 100vh;
  overflow: hidden;
  font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif;
  background: #0a0a0f;
  color: #fff;
}

.counter-scroll-container {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

.counter-scroll-panel {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  gap: 16px;

  &::before {
    content: '';
    position: absolute;
    inset: 20px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    pointer-events: none;
  }
}

.counter-label {
  font-size: 0.8rem;
  letter-spacing: 4px;
  opacity: 0.4;
  text-transform: uppercase;
}

.counter-number {
  font-size: 5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #6c8cff, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.counter-scroll-panel-0 { background: linear-gradient(180deg, #0a0f24, #1a1a5e); }
.counter-scroll-panel-1 { background: linear-gradient(135deg, #0f2027, #2c5364); }
.counter-scroll-panel-2 { background: linear-gradient(135deg, #141e30, #243b55); }
.counter-scroll-panel-3 { background: linear-gradient(135deg, #1a1a2e, #0f3460); }
.counter-scroll-panel-4 { background: linear-gradient(135deg, #0b1331, #1c2856); }

@media (max-width: 768px) {
  .counter-scroll-panel { padding: 60px 20px; }
  .counter-number { font-size: 3rem; }
}
</style>

<style lang="scss">
.counter-scroll-nav-dots {
  position: fixed;
  right: 28px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.counter-scroll-nav-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  &:hover { background: rgba(255, 255, 255, 0.5); transform: scale(1.3); }
  &.counter-scroll-active {
    background: #6c8cff;
    border-color: rgba(108, 140, 255, 0.5);
    transform: scale(1.4);
    box-shadow: 0 0 20px rgba(108, 140, 255, 0.5);
  }
}
.counter-scroll-progress-bar {
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
.counter-scroll-page-indicator {
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
  .counter-scroll-nav-dots { right: 12px; gap: 10px; }
}
</style>
