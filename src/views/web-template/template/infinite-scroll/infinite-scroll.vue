<script setup lang="ts">
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ==================== 状态 ====================
const totalPanels = 7
let currentIndex = 0
let vh = 0
let isJumping = false
let touchStartY = 0

// DOM 引用
let containerEl: HTMLElement | null = null
let progressBar: HTMLElement | null = null
let navDots: HTMLElement | null = null
let scrollTriggers: ScrollTrigger[] = []

// ==================== 导航点 ====================
function createNavDots() {
  if (!navDots) {
    return
  }
  navDots.innerHTML = ''
  for (let i = 0; i < totalPanels; i++) {
    const dot = document.createElement('button')
    dot.className = 'infinite-scroll-nav-dot' + (i === 0 ? ' infinite-scroll-active' : '')
    dot.addEventListener('click', () => goToPanel(i))
    navDots.appendChild(dot)
  }
}

// ==================== UI 更新 ====================
function updateUI(index: number) {
  document.querySelectorAll('.infinite-scroll-nav-dot').forEach((dot, i) => {
    dot.classList.toggle('infinite-scroll-active', i === index)
  })
  const currentEl = document.querySelector('.infinite-scroll-page-indicator .infinite-scroll-current')
  if (currentEl) {
    currentEl.textContent = String(index + 1)
  }
  if (progressBar) {
    progressBar.style.width = ((index + 1) / totalPanels) * 100 + '%'
  }
}

// ==================== 页面跳转 ====================
function goToPanel(index: number) {
  if (!containerEl) {
    return
  }
  index = ((index % totalPanels) + totalPanels) % totalPanels // 循环取模
  currentIndex = index
  updateUI(index)
  scrollTriggers.forEach((st) => st.disable())
  containerEl.scrollTop = index * vh
  requestAnimationFrame(() => scrollTriggers.forEach((st) => st.enable()))
}

// ==================== 滚动监听（无限循环） ====================
function onScroll() {
  if (!containerEl || isJumping) {
    return
  }

  const scrollTop = containerEl.scrollTop
  const maxScroll = containerEl.scrollHeight - containerEl.clientHeight
  let index = Math.round(scrollTop / vh) % totalPanels

  if (scrollTop >= maxScroll - 10) {
    isJumping = true
    containerEl.scrollTop = 2
    setTimeout(() => (isJumping = false), 500)
    index = 0
  } else if (scrollTop <= 10) {
    isJumping = true
    containerEl.scrollTop = maxScroll - 2
    setTimeout(() => (isJumping = false), 500)
    index = totalPanels - 1
  }

  if (index !== currentIndex) {
    currentIndex = index
    updateUI(currentIndex)
  }
}

// ==================== 键盘导航 ====================
function onKeydown(e: KeyboardEvent) {
  const keyMap: Record<string, number> = {
    ArrowDown: 1,
    PageDown: 1,
    ArrowUp: -1,
    PageUp: -1,
    Home: 0,
    End: totalPanels - 1
  }
  if (keyMap[e.key] !== undefined) {
    e.preventDefault()
    e.key === 'Home' || e.key === 'End'
      ? goToPanel(keyMap[e.key])
      : goToPanel(currentIndex + keyMap[e.key])
  }
}

// ==================== 触摸滑动 ====================
function onTouchStart(e: TouchEvent) {
  touchStartY = e.touches[0].clientY
}
function onTouchEnd(e: TouchEvent) {
  const diff = touchStartY - e.changedTouches[0].clientY
  if (Math.abs(diff) > 50) {
    goToPanel(currentIndex + (diff > 0 ? 1 : -1))
  }
}

// ==================== 初始化 / 销毁 ====================
function init() {
  vh = window.innerHeight
  containerEl = document.getElementById('infiniteScrollBrandContainer') as HTMLElement
  progressBar = document.getElementById('infiniteScrollProgressBar')
  navDots = document.getElementById('infiniteScrollNavDots')
  if (!containerEl || !progressBar || !navDots) {
    return
  }

  // 克隆首屏 → 无限循环
  const panels = gsap.utils.toArray('.infinite-scroll-panel')
  const clonedNode = panels[0].cloneNode(true) as HTMLElement
  clonedNode.setAttribute('data-cloned', 'true')
  containerEl.appendChild(clonedNode)

  // Snap 全屏吸附
  const snapST = ScrollTrigger.create({
    trigger: containerEl,
    start: 'top top',
    end: `+=${totalPanels * 100}%`,
    snap: {
      snapTo: 1 / totalPanels,
      duration: { min: 0.2, max: 0.45 },
      delay: 0.05,
      ease: 'power1.inOut'
    }
  })
  scrollTriggers.push(snapST)

  // 事件绑定
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
  <div class="infinite-scroll-brand-page">
    <div id="infiniteScrollProgressBar" class="infinite-scroll-progress-bar"></div>
    <nav id="infiniteScrollNavDots" class="infinite-scroll-nav-dots"></nav>
    <div class="infinite-scroll-page-indicator">
      <span class="infinite-scroll-current">1</span><span class="infinite-scroll-total"> / 7</span>
    </div>

    <div id="infiniteScrollBrandContainer" class="infinite-scroll-container">
      <section class="infinite-scroll-panel infinite-scroll-panel-hero" data-index="0">第一屏</section>
      <section class="infinite-scroll-panel infinite-scroll-panel-about" data-index="1">第二屏</section>
      <section class="infinite-scroll-panel infinite-scroll-panel-timeline" data-index="2">第三屏</section>
      <section class="infinite-scroll-panel infinite-scroll-panel-team" data-index="3">第四屏</section>
      <section class="infinite-scroll-panel infinite-scroll-panel-stats" data-index="4">第五屏</section>
      <section class="infinite-scroll-panel infinite-scroll-panel-partners" data-index="5">第六屏</section>
      <section class="infinite-scroll-panel infinite-scroll-panel-contact" data-index="6">第七屏</section>
    </div>
  </div>
</template>

<style scoped lang="scss">
.infinite-scroll-brand-page {
  height: 100vh;
  overflow: hidden;
  font-family:
    'Noto Sans SC',
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
  background: #f5f2fa;
  color: #1a1a2e;
}

.infinite-scroll-container {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

/* 通用面板 */
.infinite-scroll-panel {
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
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-radius: 24px;
    pointer-events: none;
    background: radial-gradient(ellipse 60% 40% at 50% 50%, rgba(0, 0, 0, 0.02), transparent);
  }
}

/* 各屏背景 — 精致浅色粉彩渐变配色 */
.infinite-scroll-panel-hero {
  background:
    radial-gradient(ellipse 80% 50% at 30% 20%, rgba(99, 102, 241, 0.08) 0%, transparent 70%),
    radial-gradient(ellipse 50% 40% at 80% 80%, rgba(236, 72, 153, 0.05) 0%, transparent 60%),
    linear-gradient(180deg, #f3f0fc 0%, #e8e3f7 30%, #dcd4f2 60%, #ece8f7 100%);
}
.infinite-scroll-panel-about {
  background:
    radial-gradient(ellipse 60% 50% at 70% 30%, rgba(6, 182, 212, 0.07) 0%, transparent 70%),
    linear-gradient(135deg, #eef8fb 0%, #ddf0f5 40%, #cce8f2 70%, #e2f3f8 100%);
}
.infinite-scroll-panel-timeline {
  background:
    radial-gradient(ellipse 50% 60% at 20% 70%, rgba(139, 92, 246, 0.06) 0%, transparent 65%),
    linear-gradient(150deg, #f1f0fb 0%, #e3e1f7 50%, #d8d5f2 80%, #eae8f7 100%);
}
.infinite-scroll-panel-team {
  background:
    radial-gradient(ellipse 70% 40% at 50% 30%, rgba(59, 130, 246, 0.07) 0%, transparent 65%),
    linear-gradient(135deg, #f2f1fb 0%, #e5e3f7 40%, #e0ddf5 70%, #ebe9f7 100%);
}
.infinite-scroll-panel-stats {
  background:
    radial-gradient(ellipse 60% 50% at 40% 50%, rgba(168, 85, 247, 0.06) 0%, transparent 65%),
    linear-gradient(160deg, #f2f0fb 0%, #e6e2f7 40%, #dfd8f5 60%, #ece8f7 100%);
}
.infinite-scroll-panel-partners {
  background:
    radial-gradient(ellipse 70% 50% at 60% 40%, rgba(20, 184, 166, 0.1) 0%, transparent 65%),
    linear-gradient(135deg, #f0f6fb 0%, #deedf7 40%, #d0eaf2 70%, #e2f1f8 100%);
}
.infinite-scroll-panel-contact {
  background:
    radial-gradient(ellipse 50% 50% at 50% 50%, rgba(99, 102, 241, 0.06) 0%, transparent 70%),
    linear-gradient(180deg, #f1f0fb 0%, #e1e0f7 40%, #eae8f7 70%, #f0eff8 100%);
}

@media (max-width: 768px) {
  .infinite-scroll-panel {
    padding: 60px 20px;
    font-size: 2rem;
  }
}
</style>

<style lang="scss">
/* 导航点 */
.infinite-scroll-nav-dots {
  position: fixed;
  right: 28px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.infinite-scroll-nav-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(26, 26, 46, 0.2);
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(26, 26, 46, 0.5);
    transform: scale(1.3);
  }

  &.infinite-scroll-active {
    background: #6c8cff;
    border-color: rgba(26, 26, 46, 0.4);
    transform: scale(1.4);
    box-shadow: 0 0 20px rgba(108, 140, 255, 0.5);
  }
}

/* 进度条 */
.infinite-scroll-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #6c8cff, #a78bfa, #f472b6);
  z-index: 1001;
  width: 0%;
  box-shadow: 0 0 10px rgba(108, 140, 255, 0.4);
}

/* 页面指示器 */
.infinite-scroll-page-indicator {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(12px);
  padding: 8px 22px;
  border-radius: 25px;
  font-size: 0.9rem;
  border: 1px solid rgba(0, 0, 0, 0.06);
  color: rgba(26, 26, 46, 0.8);
}

@media (max-width: 768px) {
  .infinite-scroll-nav-dots {
    right: 12px;
    gap: 10px;
  }
}
</style>
