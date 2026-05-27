<script setup lang="ts">
/**
 * ==================== Scroll Infinite Horizontal ====================
 * 无限横移 —— 竖滚驱动横向移动，到末尾无缝循环回到开头
 *
 * 核心机制：
 *   1. scrollArea 撑出很大的纵向空间（TOTAL×3 屏，给足循环缓冲）
 *   2. sticky 视口锁定，track flex 横排面板（含首屏克隆）
 *   3. scroll 监听手动计算 translateX（不用 gsap tween，避免跳转时残留态）
 *   4. 滚到末尾→瞬移回开头，滚到开头→瞬移到末尾，双向无限循环
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const TOTAL = 7

let currentIndex = 0
let vw = 0
let isJumping = false

let scrollArea: HTMLElement | null = null
let track: HTMLElement | null = null
let progressBar: HTMLElement | null = null
let navDots: HTMLElement | null = null

// 滚动空间倍率：中间区域是真实的 TOTAL 屏，前后各加 1 屏作为跳转缓冲
const PADDING = 1
const SCROLL_SCREENS = TOTAL + PADDING * 2 // 9

function createNavDots() {
  if (!navDots) {
    return
  }
  navDots.innerHTML = ''
  for (let i = 0; i < TOTAL; i++) {
    const dot = document.createElement('button')
    dot.className = 'sih-dot' + (i === 0 ? ' sih-active' : '')
    dot.addEventListener('click', () => goTo(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  index = ((index % TOTAL) + TOTAL) % TOTAL
  document.querySelectorAll('.sih-dot').forEach((d, i) => {
    d.classList.toggle('sih-active', i === index)
  })
  const el = document.querySelector('.sih-indicator .sih-cur')
  if (el) {
    el.textContent = String(index + 1)
  }
  if (progressBar) {
    progressBar.style.width = ((index + 1) / TOTAL) * 100 + '%'
  }
}

function goTo(index: number) {
  index = ((index % TOTAL) + TOTAL) % TOTAL
  const vh = window.innerHeight
  // 实际 scrollY：加上 PADDING 的偏移
  gsap.to(window, {
    scrollTo: { y: (index + PADDING) * vh, autoKill: false },
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

let touchStartY = 0
function onTouchStart(e: TouchEvent) {
  touchStartY = e.touches[0].clientY
}
function onTouchEnd(e: TouchEvent) {
  const diff = touchStartY - e.changedTouches[0].clientY
  if (Math.abs(diff) > 50) {
    goTo(currentIndex + (diff > 0 ? 1 : -1))
  }
}

function onScroll() {
  if (isJumping) {
    return
  }

  const vh = window.innerHeight
  const sy = window.scrollY

  // 当前在"真实区域"中的位置（去掉 PADDING 偏移）
  const realPos = sy / vh - PADDING // 可以是负数(上缓冲区)或超过TOTAL(下缓冲区)
  const floatIdx = Math.max(0, Math.min(TOTAL - 0.001, realPos))

  // 横移：面板索引 → translateX
  // 使用 modulo 让横移值在 0~TOTAL 之间循环
  const wrappedPos = ((realPos % TOTAL) + TOTAL) % TOTAL
  const tx = -wrappedPos * vw
  if (track) {
    track.style.transform = `translateX(${tx}px)`
  }

  // 当前面板索引
  const idx = ((Math.round(wrappedPos) % TOTAL) + TOTAL) % TOTAL
  if (idx !== currentIndex) {
    currentIndex = idx
    updateUI(idx)
  }

  // 无限循环跳转
  const maxScroll = (SCROLL_SCREENS - 1) * vh
  if (sy >= (TOTAL + PADDING) * vh) {
    // 滚过了下缓冲 → 跳回上面对应位置
    isJumping = true
    const jumpTo = sy - TOTAL * vh
    window.scrollTo(0, jumpTo)
    requestAnimationFrame(() => {
      setTimeout(() => { isJumping = false }, 50)
    })
  } else if (sy <= (PADDING - 1) * vh && sy < 10) {
    // 滚过了上缓冲 → 跳到下面对应位置
    isJumping = true
    const jumpTo = sy + TOTAL * vh
    window.scrollTo(0, Math.min(jumpTo, maxScroll - 2))
    requestAnimationFrame(() => {
      setTimeout(() => { isJumping = false }, 50)
    })
  }
}

function init() {
  vw = window.innerWidth

  scrollArea = document.getElementById('sihArea') as HTMLElement
  track = document.getElementById('sihTrack') as HTMLElement
  progressBar = document.getElementById('sihProgress')
  navDots = document.getElementById('sihNav')
  if (!scrollArea || !track) {
    return
  }

  // 滚动空间
  scrollArea.style.height = SCROLL_SCREENS * 100 + 'vh'

  // 初始滚到 PADDING 位置（面板1）
  window.scrollTo(0, PADDING * window.innerHeight)

  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('keydown', onKeydown)
  document.addEventListener('touchstart', onTouchStart, { passive: true })
  document.addEventListener('touchend', onTouchEnd, { passive: true })
  window.addEventListener('resize', onResize)

  createNavDots()
  updateUI(0)
  // 触发一次渲染
  onScroll()
}

function onResize() {
  vw = window.innerWidth
}

function destroy() {
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('touchstart', onTouchStart)
  document.removeEventListener('touchend', onTouchEnd)
  window.removeEventListener('resize', onResize)
}

onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>

<template>
  <div class="sih-page">
    <!-- 进度条 -->
    <div id="sihProgress" class="sih-progress-bar"></div>

    <!-- 导航点 -->
    <nav id="sihNav" class="sih-nav-dots"></nav>

    <!-- 指示器 -->
    <div class="sih-indicator">
      <span class="sih-cur">1</span>
      <span class="sih-tot"> / {{ TOTAL }}</span>
      <span class="sih-loop-badge">∞</span>
    </div>

    <!-- 滚动空间 -->
    <div id="sihArea" class="sih-scroll-area">
      <!-- 吸顶视口 -->
      <div class="sih-viewport">
        <!-- 横向轨道 -->
        <div id="sihTrack" class="sih-track">
          <section
            v-for="n in TOTAL"
            :key="n"
            class="sih-panel"
            :style="{
              background: `linear-gradient(${130 + (n - 1) * 18}deg, hsl(${(n - 1) * 48 + 200}, 55%, 30%), hsl(${(n - 1) * 48 + 230}, 45%, 18%))`,
            }"
          >
            <span class="sih-num">{{ String(n).padStart(2, '0') }}</span>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.sih-page {
  font-family: system-ui, -apple-system, sans-serif;
  background: #0a0a16;
  color: #fff;
}

/* 滚动空间 */
.sih-scroll-area {
  position: relative;
}

/* 吸顶视口 */
.sih-viewport {
  position: sticky;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

/* 横向轨道 */
.sih-track {
  display: flex;
  will-change: transform;
}

/* 面板 */
.sih-panel {
  min-width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;

  &::before {
    content: '';
    position: absolute;
    inset: 24px;
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 20px;
    pointer-events: none;
  }
}

.sih-num {
  font-size: clamp(4rem, 10vw, 8rem);
  font-weight: 900;
  color: rgba(255, 255, 255, 0.05);
  user-select: none;
  pointer-events: none;
}

@media (max-width: 768px) {
  .sih-num {
    font-size: 3rem;
  }
}
</style>

<style lang="scss">
$accent: #60c0ff;

/* 进度条 */
.sih-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  width: 0%;
  background: linear-gradient(90deg, $accent, #a78bfa, $accent);
  z-index: 1001;
  box-shadow: 0 0 8px rgba($accent, 0.4);
}

/* 导航点（底部居中） */
.sih-nav-dots {
  position: fixed;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: row;
  gap: 14px;
}

.sih-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  cursor: pointer;
  border: 2px solid transparent;
  padding: 0;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.45);
    transform: scale(1.3);
  }

  &.sih-active {
    background: $accent;
    border-color: rgba(255, 255, 255, 0.4);
    transform: scale(1.4);
    box-shadow: 0 0 18px rgba($accent, 0.5);
  }
}

/* 指示器 */
.sih-indicator {
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
  gap: 6px;

  .sih-cur {
    color: $accent;
    font-weight: 700;
  }

  .sih-loop-badge {
    margin-left: 6px;
    font-size: 0.7rem;
    color: rgba($accent, 0.7);
    border: 1px solid rgba($accent, 0.3);
    padding: 1px 6px;
    border-radius: 8px;
  }
}

@media (max-width: 768px) {
  .sih-nav-dots {
    gap: 10px;
  }
}
</style>
