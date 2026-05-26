<script setup lang="ts">
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ==================== 状态 ====================
const totalSlides = 5
let currentIndex = 0
let vw = 0
let autoPlayTimer: ReturnType<typeof setInterval> | null = null
let isPaused = false

let containerEl: HTMLElement | null = null
let progressBar: HTMLElement | null = null
let navDots: HTMLElement | null = null
let scrollTriggers: ScrollTrigger[] = []

// ==================== 导航点 ====================
function createNavDots() {
  if (!navDots) return
  navDots.innerHTML = ''
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('button')
    dot.className = 'carousel-scroll-nav-dot' + (i === 0 ? ' carousel-scroll-active' : '')
    dot.addEventListener('click', () => goToSlide(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.carousel-scroll-nav-dot').forEach((dot, i) => {
    dot.classList.toggle('carousel-scroll-active', i === index)
  })
  const currentEl = document.querySelector('.carousel-scroll-page-indicator .carousel-scroll-current')
  if (currentEl) currentEl.textContent = String(index + 1)
  if (progressBar) progressBar.style.width = ((index + 1) / totalSlides) * 100 + '%'
}

function goToSlide(index: number) {
  if (!containerEl) return
  index = ((index % totalSlides) + totalSlides) % totalSlides
  currentIndex = index
  updateUI(index)
  scrollTriggers.forEach((st) => st.disable())
  containerEl.scrollLeft = index * vw
  requestAnimationFrame(() => scrollTriggers.forEach((st) => st.enable()))
}

// ==================== 自动播放 ====================
function startAutoPlay() {
  if (autoPlayTimer) return
  autoPlayTimer = setInterval(() => {
    if (!isPaused && containerEl) goToSlide(currentIndex + 1)
  }, 4000)
}
function stopAutoPlay() {
  if (autoPlayTimer) { clearInterval(autoPlayTimer); autoPlayTimer = null }
}
function onMouseEnter() { isPaused = true }
function onMouseLeave() { isPaused = false }

// ==================== 键盘导航 ====================
function onKeydown(e: KeyboardEvent) {
  const keyMap: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, Home: 0, End: totalSlides - 1 }
  if (keyMap[e.key] !== undefined) {
    e.preventDefault()
    e.key === 'Home' || e.key === 'End'
      ? goToSlide(keyMap[e.key])
      : goToSlide(currentIndex + keyMap[e.key])
  }
}

let touchStartX = 0
function onTouchStart(e: TouchEvent) { touchStartX = e.touches[0].clientX }
function onTouchEnd(e: TouchEvent) {
  const diff = touchStartX - e.changedTouches[0].clientX
  if (Math.abs(diff) > 50) goToSlide(currentIndex + (diff > 0 ? 1 : -1))
}

// ==================== 滚动监听 ====================
function onScroll() {
  if (!containerEl) return
  const scrollLeft = containerEl.scrollLeft
  const index = Math.round(scrollLeft / vw)
  if (index !== currentIndex) { currentIndex = index; updateUI(currentIndex) }
}

// ==================== 初始化 / 销毁 ====================
function init() {
  vw = window.innerWidth
  containerEl = document.getElementById('carouselScrollContainer') as HTMLElement
  progressBar = document.getElementById('carouselScrollProgressBar')
  navDots = document.getElementById('carouselScrollNavDots')
  if (!containerEl || !progressBar || !navDots) return

  // Snap 全屏吸附
  scrollTriggers.push(ScrollTrigger.create({
    trigger: containerEl,
    start: 'left left',
    end: `+=${(totalSlides - 1) * 100}%`,
    horizontal: true,
    snap: { snapTo: 1 / (totalSlides - 1), duration: { min: 0.2, max: 0.45 }, ease: 'power1.inOut' }
  }))

  // 自动播放
  startAutoPlay()

  containerEl.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('keydown', onKeydown)
  document.addEventListener('touchstart', onTouchStart, { passive: true })
  document.addEventListener('touchend', onTouchEnd, { passive: true })

  createNavDots()
  updateUI(0)
}

function destroy() {
  stopAutoPlay()
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
  <div class="carousel-scroll-brand-page">
    <div id="carouselScrollProgressBar" class="carousel-scroll-progress-bar"></div>
    <nav id="carouselScrollNavDots" class="carousel-scroll-nav-dots"></nav>
    <div class="carousel-scroll-page-indicator">
      <span class="carousel-scroll-current">1</span><span class="carousel-scroll-total"> / {{ totalSlides }}</span>
    </div>

    <div
      id="carouselScrollContainer"
      class="carousel-scroll-container"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
    >
      <section class="carousel-slide carousel-slide-0">第一屏</section>
      <section class="carousel-slide carousel-slide-1">第二屏</section>
      <section class="carousel-slide carousel-slide-2">第三屏</section>
      <section class="carousel-slide carousel-slide-3">第四屏</section>
      <section class="carousel-slide carousel-slide-4">第五屏</section>
    </div>
  </div>
</template>

<style scoped lang="scss">
.carousel-scroll-brand-page {
  height: 100vh;
  overflow: hidden;
  font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif;
  background: #0a0a0f;
  color: #fff;
}

.carousel-scroll-container {
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  display: flex;
  flex-wrap: nowrap;
  scroll-snap-type: x mandatory;
}

.carousel-slide {
  min-width: 100vw;
  height: 100vh;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  font-size: 3rem;
  font-weight: 900;

  &::before {
    content: '';
    position: absolute;
    inset: 20px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    pointer-events: none;
  }
}

.carousel-slide-0 { background: linear-gradient(135deg, #0a0f24, #1a1a5e); }
.carousel-slide-1 { background: linear-gradient(135deg, #0f2027, #2c5364); }
.carousel-slide-2 { background: linear-gradient(135deg, #141e30, #243b55); }
.carousel-slide-3 { background: linear-gradient(135deg, #1a1a2e, #0f3460); }
.carousel-slide-4 { background: linear-gradient(135deg, #0b1331, #1c2856); }

@media (max-width: 768px) {
  .carousel-slide { font-size: 2rem; padding: 60px 20px; }
}
</style>

<style lang="scss">
.carousel-scroll-nav-dots {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  gap: 10px;
}
.carousel-scroll-nav-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  &:hover { background: rgba(255, 255, 255, 0.5); transform: scale(1.3); }
  &.carousel-scroll-active {
    width: 28px;
    border-radius: 5px;
    background: #6c8cff;
    border-color: rgba(108, 140, 255, 0.5);
    box-shadow: 0 0 20px rgba(108, 140, 255, 0.5);
  }
}
.carousel-scroll-progress-bar {
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
.carousel-scroll-page-indicator {
  position: fixed;
  top: 30px;
  right: 30px;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(12px);
  padding: 7px 18px;
  border-radius: 20px;
  font-size: 0.85rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
}
@media (max-width: 768px) {
  .carousel-scroll-nav-dots { gap: 8px; }
  .carousel-scroll-page-indicator { top: auto; bottom: 60px; right: 16px; }
}
</style>
