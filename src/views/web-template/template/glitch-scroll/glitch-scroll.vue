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
    dot.className = 'glitch-scroll-nav-dot' + (i === 0 ? ' glitch-scroll-active' : '')
    dot.addEventListener('click', () => goToPanel(i))
    navDots.appendChild(dot)
  }
}

// ==================== UI 更新 ====================
function updateUI(index: number) {
  document.querySelectorAll('.glitch-scroll-nav-dot').forEach((dot, i) => {
    dot.classList.toggle('glitch-scroll-active', i === index)
  })
  const currentEl = document.querySelector('.glitch-scroll-page-indicator .glitch-scroll-current')
  if (currentEl) currentEl.textContent = String(index + 1)
  if (progressBar) {
    progressBar.style.width = ((index + 1) / totalPanels) * 100 + '%'
  }
}

// ==================== 页面跳转 ====================
function goToPanel(index: number) {
  if (!containerEl) return
  index = ((index % totalPanels) + totalPanels) % totalPanels
  currentIndex = index
  updateUI(index)
  scrollTriggers.forEach((st) => st.disable())
  containerEl.scrollTop = index * vh
  requestAnimationFrame(() => scrollTriggers.forEach((st) => st.enable()))
}

// ==================== 键盘导航 ====================
function onKeydown(e: KeyboardEvent) {
  const keyMap: Record<string, number> = {
    ArrowDown: 1, PageDown: 1,
    ArrowUp: -1, PageUp: -1,
    Home: 0, End: totalPanels - 1
  }
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

// ==================== 滚动监听 ====================
function onScroll() {
  if (!containerEl || isJumping) return
  const scrollTop = containerEl.scrollTop
  const maxScroll = containerEl.scrollHeight - containerEl.clientHeight
  let index = Math.round(scrollTop / vh) % totalPanels
  if (scrollTop >= maxScroll - 10) { isJumping = true; containerEl.scrollTop = 2; setTimeout(() => (isJumping = false), 500); index = 0 }
  else if (scrollTop <= 10) { isJumping = true; containerEl.scrollTop = maxScroll - 2; setTimeout(() => (isJumping = false), 500); index = totalPanels - 1 }
  if (index !== currentIndex) { currentIndex = index; updateUI(currentIndex) }
}

// ==================== 故障动画层 ====================
function initGlitchAnimations() {
  const panels = gsap.utils.toArray('.glitch-scroll-panel')
  panels.forEach((panel, i) => {
    const rgbR = (panel as HTMLElement).querySelector('.glitch-rgb-r') as HTMLElement
    const rgbG = (panel as HTMLElement).querySelector('.glitch-rgb-g') as HTMLElement
    const rgbB = (panel as HTMLElement).querySelector('.glitch-rgb-b') as HTMLElement
    if (!rgbR || !rgbG || !rgbB) return

    // RGB 分离入场动画
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: panel,
        start: 'top 75%',
        end: 'top 25%',
        scrub: 0.5
      }
    })
    tl.fromTo(rgbR, { x: -20, opacity: 0.3 }, { x: 0, opacity: 1, ease: 'power2.out' }, 0)
    tl.fromTo(rgbG, { x: 0, opacity: 1 }, { x: 0, opacity: 1, ease: 'power2.out' }, 0)
    tl.fromTo(rgbB, { x: 20, opacity: 0.3 }, { x: 0, opacity: 1, ease: 'power2.out' }, 0)

    // 面板内容入场
    const content = (panel as HTMLElement).querySelector('.glitch-content')
    if (content) {
      ScrollTrigger.create({
        trigger: panel,
        start: 'top 80%',
        onEnter: () => gsap.fromTo(content, { opacity: 0, scale: 0.92, filter: 'blur(8px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.7, ease: 'power2.out' }),
        onLeaveBack: () => gsap.to(content, { opacity: 0, scale: 0.92, filter: 'blur(8px)', duration: 0.4, ease: 'power2.in' })
      })
    }
  })
}

// ==================== 初始化 / 销毁 ====================
function init() {
  vh = window.innerHeight
  containerEl = document.getElementById('glitchScrollContainer') as HTMLElement
  progressBar = document.getElementById('glitchScrollProgressBar')
  navDots = document.getElementById('glitchScrollNavDots')
  if (!containerEl || !progressBar || !navDots) return

  // Snap 全屏吸附
  scrollTriggers.push(ScrollTrigger.create({
    trigger: containerEl,
    start: 'top top',
    end: `+=${totalPanels * 100}%`,
    snap: { snapTo: 1 / totalPanels, duration: { min: 0.2, max: 0.45 }, delay: 0.05, ease: 'power1.inOut' }
  }))

  initGlitchAnimations()

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
  <div class="glitch-scroll-brand-page">
    <div id="glitchScrollProgressBar" class="glitch-scroll-progress-bar"></div>
    <nav id="glitchScrollNavDots" class="glitch-scroll-nav-dots"></nav>
    <div class="glitch-scroll-page-indicator">
      <span class="glitch-scroll-current">1</span><span class="glitch-scroll-total"> / {{ totalPanels }}</span>
    </div>

    <div id="glitchScrollContainer" class="glitch-scroll-container">
      <section class="glitch-scroll-panel glitch-scroll-panel-0">
        <div class="glitch-rgb-split">
          <div class="glitch-rgb-r"></div><div class="glitch-rgb-g"></div><div class="glitch-rgb-b"></div>
        </div>
        <div class="glitch-content">第一屏</div>
      </section>
      <section class="glitch-scroll-panel glitch-scroll-panel-1">
        <div class="glitch-rgb-split">
          <div class="glitch-rgb-r"></div><div class="glitch-rgb-g"></div><div class="glitch-rgb-b"></div>
        </div>
        <div class="glitch-content">第二屏</div>
      </section>
      <section class="glitch-scroll-panel glitch-scroll-panel-2">
        <div class="glitch-rgb-split">
          <div class="glitch-rgb-r"></div><div class="glitch-rgb-g"></div><div class="glitch-rgb-b"></div>
        </div>
        <div class="glitch-content">第三屏</div>
      </section>
      <section class="glitch-scroll-panel glitch-scroll-panel-3">
        <div class="glitch-rgb-split">
          <div class="glitch-rgb-r"></div><div class="glitch-rgb-g"></div><div class="glitch-rgb-b"></div>
        </div>
        <div class="glitch-content">第四屏</div>
      </section>
      <section class="glitch-scroll-panel glitch-scroll-panel-4">
        <div class="glitch-rgb-split">
          <div class="glitch-rgb-r"></div><div class="glitch-rgb-g"></div><div class="glitch-rgb-b"></div>
        </div>
        <div class="glitch-content">第五屏</div>
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
.glitch-scroll-brand-page {
  height: 100vh;
  overflow: hidden;
  font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif;
  background: #050510;
  color: #f0f0f8;
}

.glitch-scroll-container {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

.glitch-scroll-panel {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  flex-direction: column;
  font-size: 3rem;
  font-weight: 900;

  &::before {
    content: '';
    position: absolute;
    inset: 20px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    pointer-events: none;
    z-index: 2;
  }
}

.glitch-content {
  position: relative;
  z-index: 3;
  font-size: 3.5rem;
  font-weight: 900;
  letter-spacing: 4px;
}

/* RGB 分离层 */
.glitch-rgb-split {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}
.glitch-rgb-r, .glitch-rgb-g, .glitch-rgb-b {
  position: absolute;
  inset: 0;
  mix-blend-mode: screen;
  opacity: 0.06;
}
.glitch-rgb-r { background: linear-gradient(135deg, #ff3366, #ff0033); }
.glitch-rgb-g { background: linear-gradient(135deg, #33ff66, #00ff33); }
.glitch-rgb-b { background: linear-gradient(135deg, #3366ff, #0033ff); }

/* 各屏背景 */
.glitch-scroll-panel-0 { background: radial-gradient(ellipse 70% 50% at 50% 40%, rgba(255,0,100,0.06), transparent 70%), linear-gradient(180deg, #07081c, #101848, #0a0e30); }
.glitch-scroll-panel-1 { background: radial-gradient(ellipse 60% 50% at 30% 60%, rgba(0,255,200,0.05), transparent 65%), linear-gradient(135deg, #071820, #0e3040, #164050); }
.glitch-scroll-panel-2 { background: radial-gradient(ellipse 50% 60% at 70% 30%, rgba(100,0,255,0.06), transparent 65%), linear-gradient(135deg, #0a1025, #162450, #1a2d5c); }
.glitch-scroll-panel-3 { background: radial-gradient(ellipse 60% 50% at 40% 50%, rgba(0,100,255,0.07), transparent 65%), linear-gradient(135deg, #0c0c22, #0e2850, #0a1840); }
.glitch-scroll-panel-4 { background: radial-gradient(ellipse 60% 50% at 50% 40%, rgba(255,50,100,0.06), transparent 70%), linear-gradient(135deg, #080e28, #121e48, #0e1838); }

@media (max-width: 768px) {
  .glitch-scroll-panel { padding: 60px 20px; font-size: 2rem; }
  .glitch-content { font-size: 2.2rem; }
}
</style>

<style lang="scss">
.glitch-scroll-nav-dots {
  position: fixed;
  right: 28px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.glitch-scroll-nav-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  &:hover { background: rgba(255, 255, 255, 0.5); transform: scale(1.3); }
  &.glitch-scroll-active {
    background: #ff3366;
    border-color: rgba(255, 51, 102, 0.5);
    transform: scale(1.4);
    box-shadow: 0 0 20px rgba(255, 51, 102, 0.5);
  }
}
.glitch-scroll-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #ff3366, #ff6600, #ffcc00);
  z-index: 1001;
  width: 0%;
  box-shadow: 0 0 10px rgba(255, 51, 102, 0.4);
  transition: width 0.4s ease;
}
.glitch-scroll-page-indicator {
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
  .glitch-scroll-nav-dots { right: 12px; gap: 10px; }
}
</style>
