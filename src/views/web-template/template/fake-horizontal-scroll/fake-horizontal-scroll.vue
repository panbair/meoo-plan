<script setup lang="ts">
/**
 * ==================== Fake Horizontal Scroll ====================
 * 垂直滚动 → 水平位移：用户上下滚鼠标，页面内容横向移动。
 * 
 * 核心机制：
 *   1. .vhscroll-scroll-area 撑出 totalPanels×100vh 的高度，制造纵向滚动空间
 *   2. .vhscroll-pinned 使用 position:sticky 固定在视口顶部
 *   3. GSAP ScrollTrigger 将 .vhscroll-track 水平平移 translateX
 *   4. scrub:0.5 让滚动与位移平滑绑定
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ==================== 配置 ====================
const totalPanels = 7           // 面板总数，修改后自动适配
let vw = 0                     // 窗口宽度（px）
let currentIndex = 0           // 当前所在面板索引

// ==================== DOM 引用 ====================
let scrollArea: HTMLElement | null = null
let track: HTMLElement | null = null
let progressBar: HTMLElement | null = null
let navDots: HTMLElement | null = null

// ==================== GSAP 实例 ====================
let mainST: ScrollTrigger | null = null
let contentSTs: ScrollTrigger[] = []

// ==================== 导航点 ====================
function createNavDots() {
  if (!navDots) return
  navDots.innerHTML = ''
  for (let i = 0; i < totalPanels; i++) {
    const dot = document.createElement('button')
    dot.className = 'vhscroll-nav-dot' + (i === 0 ? ' vhscroll-active' : '')
    dot.addEventListener('click', () => goToPanel(i))
    navDots.appendChild(dot)
  }
}

// ==================== UI 更新 ====================
function updateUI(index: number) {
  document.querySelectorAll('.vhscroll-nav-dot').forEach((dot, i) => {
    dot.classList.toggle('vhscroll-active', i === index)
  })
  const currentEl = document.querySelector('.vhscroll-page-indicator .vhscroll-current')
  if (currentEl) currentEl.textContent = String(index + 1)
}

// ==================== 跳转到指定面板 ====================
function goToPanel(index: number) {
  index = Math.max(0, Math.min(index, totalPanels - 1))
  const targetTop = index * window.innerHeight
  gsap.to(window, {
    scrollTo: { y: targetTop, autoKill: false },
    duration: 0.6,
    ease: 'power2.inOut'
  })
}

// ==================== 键盘导航 ====================
function onKeydown(e: KeyboardEvent) {
  const keyMap: Record<string, number> = {
    ArrowDown: 1,
    ArrowUp: -1,
    ArrowRight: 1,
    ArrowLeft: -1,
    Home: 0,
    End: totalPanels - 1
  }
  if (keyMap[e.key] !== undefined) {
    e.preventDefault()
    if (e.key === 'Home' || e.key === 'End') {
      goToPanel(keyMap[e.key])
    } else {
      goToPanel(currentIndex + keyMap[e.key])
    }
  }
}

// ==================== 触摸滑动 ====================
let touchStartY = 0
function onTouchStart(e: TouchEvent) {
  touchStartY = e.touches[0].clientY
}
function onTouchEnd(e: TouchEvent) {
  const diff = touchStartY - e.changedTouches[0].clientY
  if (Math.abs(diff) > 50) {
    goToPanel(currentIndex + (diff > 0 ? 1 : -1))
  }
}

// ==================== 初始化 ====================
function init() {
  vw = window.innerWidth

  scrollArea = document.getElementById('vhscrollScrollArea') as HTMLElement
  track = document.getElementById('vhscrollTrack') as HTMLElement
  progressBar = document.getElementById('vhscrollProgressBar')
  navDots = document.getElementById('vhscrollNavDots')
  if (!scrollArea || !track) return

  // --- 1. 核心横向位移 ---
  const tween = gsap.to(track, {
    x: () => -(totalPanels - 1) * vw,
    ease: 'none',
    scrollTrigger: {
      trigger: scrollArea,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5,
      onUpdate: (self) => {
        const progress = self.progress
        const idx = Math.round(progress * (totalPanels - 1))
        if (idx !== currentIndex) {
          currentIndex = idx
          updateUI(idx)
        }
        if (progressBar) progressBar.style.width = (progress * 100) + '%'
      }
    }
  })
  mainST = tween.scrollTrigger

  // --- 2. 各面板内容入场动画 ---
  const panels = gsap.utils.toArray('.vhscroll-panel')
  panels.forEach((panel, i) => {
    if (i === 0) return
    const el = panel as HTMLElement
    const content = el.querySelector('.vhscroll-content')
    if (!content) return

    // 记录是否已动画过，避免重复
    let animated = false
    const animateIn = (dir: 'forward' | 'backward') => {
      if (animated) return
      animated = true
      gsap.fromTo(content,
        { opacity: 0, y: dir === 'forward' ? 60 : -60 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }
      )
    }

    const st = ScrollTrigger.create({
      trigger: el,
      containerAnimation: tween,
      start: 'left center',
      end: 'center center',
      onEnter: () => animateIn('forward'),
      onEnterBack: () => animateIn('backward'),
      onLeave: () => { animated = false },
      onLeaveBack: () => { animated = false }
    })
    contentSTs.push(st)
  })

  // --- 3. 事件绑定 ---
  document.addEventListener('keydown', onKeydown)
  document.addEventListener('touchstart', onTouchStart, { passive: true })
  document.addEventListener('touchend', onTouchEnd, { passive: true })

  createNavDots()
  updateUI(0)
}

function destroy() {
  mainST?.kill()
  mainST = null
  contentSTs.forEach(st => st.kill())
  contentSTs = []
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('touchstart', onTouchStart)
  document.removeEventListener('touchend', onTouchEnd)
}

onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>

<template>
  <div class="vhscroll-page">
    <!-- 进度条 -->
    <div id="vhscrollProgressBar" class="vhscroll-progress-bar"></div>

    <!-- 导航点 -->
    <nav id="vhscrollNavDots" class="vhscroll-nav-dots"></nav>

    <!-- 页面指示器 -->
    <div class="vhscroll-page-indicator">
      <span class="vhscroll-current">1</span>
      <span class="vhscroll-total"> / {{ totalPanels }}</span>
    </div>

    <!-- 滚动空间（撑出纵向滚动距离） -->
    <div
      id="vhscrollScrollArea"
      class="vhscroll-scroll-area"
      :style="{ height: totalPanels * 100 + 'vh' }"
    >
      <!-- 吸顶容器 -->
      <div class="vhscroll-pinned">
        <!-- 横向轨道（被 GSAP 水平平移） -->
        <div id="vhscrollTrack" class="vhscroll-track">
          <section class="vhscroll-panel vhscroll-panel-intro" data-index="0">
            <div class="vhscroll-content">
              <div class="vhscroll-badge">INTRO</div>
              <h2>第一屏</h2>
              <p>向下滚动 · 横向展开</p>
            </div>
          </section>
          <section class="vhscroll-panel vhscroll-panel-features" data-index="1">
            <div class="vhscroll-content">
              <div class="vhscroll-badge">FEATURES</div>
              <h2>第二屏</h2>
              <p>展示产品核心功能</p>
            </div>
          </section>
          <section class="vhscroll-panel vhscroll-panel-work" data-index="2">
            <div class="vhscroll-content">
              <div class="vhscroll-badge">WORK</div>
              <h2>第三屏</h2>
              <p>作品案例展示</p>
            </div>
          </section>
          <section class="vhscroll-panel vhscroll-panel-tech" data-index="3">
            <div class="vhscroll-content">
              <div class="vhscroll-badge">TECH</div>
              <h2>第四屏</h2>
              <p>技术栈与架构</p>
            </div>
          </section>
          <section class="vhscroll-panel vhscroll-panel-team" data-index="4">
            <div class="vhscroll-content">
              <div class="vhscroll-badge">TEAM</div>
              <h2>第五屏</h2>
              <p>团队成员介绍</p>
            </div>
          </section>
          <section class="vhscroll-panel vhscroll-panel-stats" data-index="5">
            <div class="vhscroll-content">
              <div class="vhscroll-badge">STATS</div>
              <h2>第六屏</h2>
              <p>数据统计面板</p>
            </div>
          </section>
          <section class="vhscroll-panel vhscroll-panel-contact" data-index="6">
            <div class="vhscroll-content">
              <div class="vhscroll-badge">CONTACT</div>
              <h2>第七屏</h2>
              <p>联系我们</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.vhscroll-page {
  font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif;
  background: #0a0a0f;
  color: #fff;
}

/* ═════════ 滚动空间 ═════════ */
.vhscroll-scroll-area {
  position: relative;
}

/* ═════════ 吸顶容器 ═════════ */
.vhscroll-pinned {
  position: sticky;
  top: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

/* ═════════ 横向轨道（GSAP 平移此层） ═════════ */
.vhscroll-track {
  display: flex;
  will-change: transform;
}

/* ═════════ 通用面板 ═════════ */
.vhscroll-panel {
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
    inset: 20px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    pointer-events: none;
  }
}

/* ═════════ 面板编号水印 ═════════ */
.vhscroll-panel::after {
  content: '0' attr(data-index) '0';
  position: absolute;
  bottom: 40px;
  right: 60px;
  font-size: 10rem;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.03);
  pointer-events: none;
  z-index: 0;
}

/* ═════════ 内容层 ═════════ */
.vhscroll-content {
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

.vhscroll-badge {
  display: inline-block;
  padding: 6px 20px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 20px;
  font-size: 0.75rem;
  letter-spacing: 3px;
  margin-bottom: 24px;
}

/* ═════════ 各屏背景 ═════════ */
.vhscroll-panel-intro  { background: linear-gradient(135deg, #0a0f24, #1a1a5e); }
.vhscroll-panel-features { background: linear-gradient(135deg, #0f2027, #2c5364); }
.vhscroll-panel-work     { background: linear-gradient(135deg, #141e30, #243b55); }
.vhscroll-panel-tech     { background: linear-gradient(135deg, #1a1a2e, #0f3460); }
.vhscroll-panel-team     { background: linear-gradient(135deg, #0d0d1a, #1a1a3e); }
.vhscroll-panel-stats    { background: linear-gradient(135deg, #1a2980, #26d0ce); }
.vhscroll-panel-contact  { background: linear-gradient(135deg, #0b1331, #1c2856); }

/* ═════════ 响应式 ═════════ */
@media (max-width: 768px) {
  .vhscroll-content {
    h2 { font-size: 2.2rem; }
    p { font-size: 1rem; }
  }
  .vhscroll-panel::after {
    font-size: 5rem;
    bottom: 30px;
    right: 30px;
  }
}
</style>

<style lang="scss">
/* ═════════ 导航点（底部居中） ═════════ */
.vhscroll-nav-dots {
  position: fixed;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: row;
  gap: 14px;
}

.vhscroll-nav-dot {
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

  &.vhscroll-active {
    background: #6c8cff;
    border-color: rgba(255, 255, 255, 0.4);
    transform: scale(1.4);
    box-shadow: 0 0 20px rgba(108, 140, 255, 0.5);
  }
}

/* ═════════ 进度条 ═════════ */
.vhscroll-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #6c8cff, #a78bfa, #f472b6);
  z-index: 1001;
  width: 0%;
  box-shadow: 0 0 10px rgba(108, 140, 255, 0.4);
}

/* ═════════ 页面指示器 ═════════ */
.vhscroll-page-indicator {
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
  .vhscroll-nav-dots { gap: 10px; }
}
</style>
