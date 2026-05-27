<script setup lang="ts">
import { onMounted, onUnmounted, nextTick } from 'vue'

// ==================== 状态 ====================
const totalPanels = 7
let currentIndex = 0
let vw = 0
let isJumping = false
let touchStartX = 0

// DOM 引用
let containerEl: HTMLElement | null = null
let progressBar: HTMLElement | null = null
let navDots: HTMLElement | null = null

// ==================== 导航点 ====================
function createNavDots() {
  if (!navDots) return
  navDots.innerHTML = ''
  for (let i = 0; i < totalPanels; i++) {
    const dot = document.createElement('button')
    dot.className = 'hscroll-nav-dot' + (i === 0 ? ' hscroll-active' : '')
    dot.addEventListener('click', () => goToPanel(i))
    navDots.appendChild(dot)
  }
}

// ==================== UI 更新 ====================
function updateUI(index: number) {
  document.querySelectorAll('.hscroll-nav-dot').forEach((dot, i) => {
    dot.classList.toggle('hscroll-active', i === index)
  })
  const currentEl = document.querySelector('.hscroll-page-indicator .hscroll-current')
  if (currentEl) currentEl.textContent = String(index + 1)
  if (progressBar) progressBar.style.width = ((index + 1) / totalPanels) * 100 + '%'
}

// ==================== 页面跳转 ====================
function goToPanel(index: number) {
  if (!containerEl) return
  index = ((index % totalPanels) + totalPanels) % totalPanels
  currentIndex = index
  updateUI(index)
  containerEl.scrollLeft = index * vw
}

// ==================== 滚动监听（无限循环） ====================
function onScroll() {
  if (!containerEl || isJumping) return

  const scrollLeft = containerEl.scrollLeft
  const maxScroll = containerEl.scrollWidth - containerEl.clientWidth
  let index = Math.round(scrollLeft / vw) % totalPanels

  if (scrollLeft >= maxScroll - 10) {
    isJumping = true
    containerEl.scrollLeft = 2
    setTimeout(() => (isJumping = false), 500)
    index = 0
  } else if (scrollLeft <= 10) {
    isJumping = true
    containerEl.scrollLeft = maxScroll - 2
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
    ArrowRight: 1,
    ArrowLeft: -1,
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
  touchStartX = e.touches[0].clientX
}
function onTouchEnd(e: TouchEvent) {
  const diff = touchStartX - e.changedTouches[0].clientX
  if (Math.abs(diff) > 50) {
    goToPanel(currentIndex + (diff > 0 ? 1 : -1))
  }
}

// ==================== 初始化 / 销毁 ====================
function init() {
  vw = window.innerWidth
  containerEl = document.getElementById('hscrollBrandContainer') as HTMLElement
  progressBar = document.getElementById('hscrollProgressBar')
  navDots = document.getElementById('hscrollNavDots')
  if (!containerEl || !progressBar || !navDots) return

  // 克隆首屏 → 无限循环
  const panels = containerEl.querySelectorAll('.hscroll-panel:not([data-cloned])')
  const clonedNode = panels[0].cloneNode(true) as HTMLElement
  clonedNode.setAttribute('data-cloned', 'true')
  containerEl.appendChild(clonedNode)

  // 事件绑定
  containerEl.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('keydown', onKeydown)
  document.addEventListener('touchstart', onTouchStart, { passive: true })
  document.addEventListener('touchend', onTouchEnd, { passive: true })

  createNavDots()
  updateUI(0)
}

function destroy() {
  containerEl?.removeEventListener('scroll', onScroll)
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('touchstart', onTouchStart)
  document.removeEventListener('touchend', onTouchEnd)
}

onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>

<template>
  <div class="hscroll-brand-page">
    <div id="hscrollProgressBar" class="hscroll-progress-bar"></div>
    <nav id="hscrollNavDots" class="hscroll-nav-dots"></nav>
    <div class="hscroll-page-indicator">
      <span class="hscroll-current">1</span><span class="hscroll-total"> / 7</span>
    </div>

    <div id="hscrollBrandContainer" class="hscroll-container">
      <section class="hscroll-panel hscroll-panel-intro" data-index="0">
        <div class="hscroll-content">
          <div class="hscroll-badge">INTRO</div>
          <h2>第一屏</h2>
          <p>横向全屏滚动 · 自由布局</p>
        </div>
      </section>
      <section class="hscroll-panel hscroll-panel-features" data-index="1">
        <div class="hscroll-content">
          <div class="hscroll-badge">FEATURES</div>
          <h2>第二屏</h2>
          <p>展示产品核心功能</p>
        </div>
      </section>
      <section class="hscroll-panel hscroll-panel-work" data-index="2">
        <div class="hscroll-content">
          <div class="hscroll-badge">WORK</div>
          <h2>第三屏</h2>
          <p>作品案例展示</p>
        </div>
      </section>
      <section class="hscroll-panel hscroll-panel-tech" data-index="3">
        <div class="hscroll-content">
          <div class="hscroll-badge">TECH</div>
          <h2>第四屏</h2>
          <p>技术栈与架构</p>
        </div>
      </section>
      <section class="hscroll-panel hscroll-panel-team" data-index="4">
        <div class="hscroll-content">
          <div class="hscroll-badge">TEAM</div>
          <h2>第五屏</h2>
          <p>团队成员介绍</p>
        </div>
      </section>
      <section class="hscroll-panel hscroll-panel-stats" data-index="5">
        <div class="hscroll-content">
          <div class="hscroll-badge">STATS</div>
          <h2>第六屏</h2>
          <p>数据统计面板</p>
        </div>
      </section>
      <section class="hscroll-panel hscroll-panel-contact" data-index="6">
        <div class="hscroll-content">
          <div class="hscroll-badge">CONTACT</div>
          <h2>第七屏</h2>
          <p>联系我们</p>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
.hscroll-brand-page {
  height: 100vh;
  overflow: hidden;
  font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif;
  background: #060610;
  color: #f0f0f8;
}

.hscroll-container {
  height: 100%;
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
}

/* 通用面板 */
.hscroll-panel {
  min-width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
  scroll-snap-align: start;

  &::before {
    content: '';
    position: absolute;
    inset: 20px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    pointer-events: none;
  }
}

/* 内容居中 */
.hscroll-content {
  text-align: center;
  z-index: 1;

  h2 {
    font-size: 3.5rem;
    font-weight: 900;
    margin: 0 0 16px;
  }
  p {
    font-size: 1.2rem;
    opacity: 0.6;
    margin: 0;
  }
}

.hscroll-badge {
  display: inline-block;
  padding: 6px 20px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 20px;
  font-size: 0.75rem;
  letter-spacing: 3px;
  margin-bottom: 24px;
}

/* 各屏背景 */
.hscroll-panel-intro {
  background: radial-gradient(ellipse 70% 50% at 40% 30%, rgba(99,102,241,0.1), transparent 70%), linear-gradient(135deg, #07081c, #0e1240, #14164a);
}
.hscroll-panel-features {
  background: radial-gradient(ellipse 60% 50% at 70% 40%, rgba(6,182,212,0.08), transparent 65%), linear-gradient(135deg, #071820, #0e3040, #164e5c);
}
.hscroll-panel-work {
  background: radial-gradient(ellipse 50% 60% at 30% 60%, rgba(139,92,246,0.07), transparent 65%), linear-gradient(135deg, #0a1025, #162450, #1a2d5c);
}
.hscroll-panel-tech {
  background: radial-gradient(ellipse 60% 50% at 50% 30%, rgba(59,130,246,0.08), transparent 65%), linear-gradient(135deg, #0c0c22, #0e2850, #0a1840);
}
.hscroll-panel-team {
  background: radial-gradient(ellipse 50% 50% at 40% 50%, rgba(168,85,247,0.07), transparent 65%), linear-gradient(135deg, #08081a, #12123a, #0e0e28);
}
.hscroll-panel-stats {
  background: radial-gradient(ellipse 70% 50% at 60% 40%, rgba(20,184,166,0.12), transparent 65%), linear-gradient(135deg, #081e38, #10506e, #0e3858);
}
.hscroll-panel-contact {
  background: radial-gradient(ellipse 60% 50% at 50% 40%, rgba(99,102,241,0.08), transparent 70%), linear-gradient(135deg, #080e28, #121e48, #0e1838);
}

@media (max-width: 768px) {
  .hscroll-content {
    h2 { font-size: 2.2rem; }
    p { font-size: 1rem; }
  }
}
</style>

<style lang="scss">
/* 导航点（底部居中） */
.hscroll-nav-dots {
  position: fixed;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: row;
  gap: 14px;
}

.hscroll-nav-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.5);
    transform: scale(1.3);
  }

  &.hscroll-active {
    background: #6c8cff;
    border-color: rgba(255, 255, 255, 0.4);
    transform: scale(1.4);
    box-shadow: 0 0 20px rgba(108, 140, 255, 0.5);
  }
}

/* 进度条 */
.hscroll-progress-bar {
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
.hscroll-page-indicator {
  position: fixed;
  top: 30px;
  right: 30px;
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
  .hscroll-nav-dots { gap: 10px; }
}
</style>
