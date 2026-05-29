<script setup lang="ts">
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ==================== 常量 ====================
const totalPanels = 7
// 每屏滚动 70vh → 总滚动距离 = (totalPanels - 1) * 70vh
const scrollPerPanel = 70
const triggerVh = (totalPanels - 1) * scrollPerPanel

// ==================== 面板数据 ====================
const panelData = [
  { badge: 'INTRO',    title: '全屏横向滚动', subtitle: 'GSAP ScrollTrigger 驱动', color: '#6366f1', accent: '#818cf8' },
  { badge: 'SCRUB',    title: '滚动擦洗',     subtitle: '精准跟随 · 丝滑同步',     color: '#06b6d4', accent: '#22d3ee' },
  { badge: 'PINNED',   title: '视口固定',     subtitle: '滚动时面板保持在视野中', color: '#8b5cf6', accent: '#a78bfa' },
  { badge: 'EASING',   title: '无缓动直线',   subtitle: 'ease: none · 一一对应',    color: '#3b82f6', accent: '#60a5fa' },
  { badge: 'LAYOUT',   title: '自由布局',     subtitle: '每块面板独立设计',      color: '#14b8a6', accent: '#2dd4bf' },
  { badge: 'RESPONSIVE', title: '全端响应式', subtitle: '桌面 · 平板 · 手机',      color: '#f472b6', accent: '#f9a8d4' },
  { badge: 'CLEANUP',  title: '优雅销毁',     subtitle: 'ScrollTrigger 自动管理',  color: '#a78bfa', accent: '#c4b5fd' },
]

// ==================== 状态 ====================
let vw = 0
let st: ScrollTrigger | null = null
let scrollArea: HTMLElement | null = null
let trackEl: HTMLElement | null = null
let progressBar: HTMLElement | null = null

// ==================== 初始化 ====================
function init() {
  vw = window.innerWidth
  scrollArea = document.querySelector('.rhs-scroll-area') as HTMLElement
  trackEl = document.querySelector('.rhs-track') as HTMLElement
  progressBar = document.querySelector('.rhs-progress-fill') as HTMLElement

  if (!scrollArea || !trackEl) return

  // 设置 trigger 高度
  const trigger = document.querySelector('.rhs-trigger') as HTMLElement
  if (trigger) {
    trigger.style.height = `${triggerVh}vh`
  }

  // ScrollTrigger：监听 trigger 的滚动进度，驱动 track 横向位移
  st = ScrollTrigger.create({
    trigger: '.rhs-trigger',
    scroller: scrollArea,
    start: 'top bottom',
    end: 'bottom bottom',
    scrub: 1,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      // 驱动 track 的 translateX
      const x = -self.progress * (totalPanels - 1) * vw
      gsap.set(trackEl, { x })
      // 更新进度条
      if (progressBar) {
        gsap.set(progressBar, { width: `${self.progress * 100}%` })
      }
      // 更新高亮导航点
      const activeIdx = Math.round(self.progress * (totalPanels - 1))
      document.querySelectorAll('.rhs-dot').forEach((dot, i) => {
        dot.classList.toggle('rhs-active', i === activeIdx)
      })
      // 更新页码
      const currentEl = document.querySelector('.rhs-current') as HTMLElement
      if (currentEl) currentEl.textContent = String(activeIdx + 1)
    },
  })

  // 导航点点击 → 滚动到对应位置
  document.querySelectorAll('.rhs-dot').forEach((dot, i) => {
    dot.addEventListener('click', () => scrollToPanel(i))
  })

  // 初始化 UI
  updatePanelVisibility(0)
}

// ==================== 跳转到指定面板 ====================
function scrollToPanel(index: number) {
  if (!scrollArea) return
  const targetScroll = (index / (totalPanels - 1)) * (triggerVh / 100) * vw
  gsap.to(scrollArea, {
    scrollTop: targetScroll,
    duration: 0.7,
    ease: 'power3.inOut',
  })
}

// ==================== 面板入场动画 ====================
function updatePanelVisibility(_activeIndex: number) {
  // 各面板内容的初始透明度 — 由 ScrollTrigger 的 scrub 自然呈现
  // 不需要额外处理，面板随滚动自然出现
}

// ==================== 点击左右箭头 ====================
function handleArrowClick(direction: 'prev' | 'next') {
  if (!scrollArea) return
  const currentScroll = scrollArea.scrollTop
  const maxScroll = scrollArea.scrollHeight - scrollArea.clientHeight
  const step = ((scrollPerPanel / 100) * vw)

  const target = direction === 'next'
    ? Math.min(currentScroll + step, maxScroll)
    : Math.max(currentScroll - step, 0)

  gsap.to(scrollArea, {
    scrollTop: target,
    duration: 0.6,
    ease: 'power3.out',
  })
}

// ==================== 键盘导航 ====================
function onKeydown(e: KeyboardEvent) {
  const focusTag = (document.activeElement?.tagName || '').toLowerCase()
  if (focusTag === 'input' || focusTag === 'textarea' || focusTag === 'select') return

  switch (e.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      e.preventDefault()
      handleArrowClick('next')
      break
    case 'ArrowLeft':
    case 'ArrowUp':
      e.preventDefault()
      handleArrowClick('prev')
      break
    case 'Home':
      e.preventDefault()
      scrollToPanel(0)
      break
    case 'End':
      e.preventDefault()
      scrollToPanel(totalPanels - 1)
      break
  }
}

// ==================== 窗口 resize ====================
function onResize() {
  vw = window.innerWidth
  // ScrollTrigger invalidateOnRefresh 会自动处理
  if (st) {
    st.refresh()
  }
}

// ==================== 销毁 ====================
function destroy() {
  st?.kill()
  st = null
  document.removeEventListener('keydown', onKeydown)
  window.removeEventListener('resize', onResize)
  window.removeEventListener('orientationchange', onOrientationChange)
  scrollArea = null
  trackEl = null
  progressBar = null
}

function onOrientationChange() {
  setTimeout(onResize, 300)
}

// ==================== 生命周期 ====================
onMounted(() => {
  window.addEventListener('resize', onResize)
  window.addEventListener('orientationchange', onOrientationChange)
  document.addEventListener('keydown', onKeydown)
  nextTick(init)
})

onUnmounted(destroy)
</script>

<template>
  <div class="rhs-root">
    <!-- 进度条 -->
    <div class="rhs-progress">
      <div class="rhs-progress-fill"></div>
    </div>

    <!-- 右上角页码 -->
    <div class="rhs-indicator">
      <span class="rhs-current">1</span>
      <span class="rhs-sep">/</span>
      <span class="rhs-total">{{ totalPanels }}</span>
    </div>

    <!-- 底部导航点 -->
    <nav class="rhs-dots">
      <button
        v-for="(panel, i) in panelData"
        :key="i"
        class="rhs-dot"
        :class="{ 'rhs-active': i === 0 }"
        :title="panel.badge"
      ></button>
    </nav>

    <!-- 滚动容器 -->
    <div class="rhs-scroll-area">
      <!-- 粘性视口 — 滚动时始终可见 -->
      <div class="rhs-sticky-vp">
        <div
          class="rhs-track"
          :style="{ width: `${totalPanels * 100}vw` }"
        >
          <section
            v-for="(panel, i) in panelData"
            :key="i"
            class="rhs-panel"
            :style="{
              background: `linear-gradient(160deg, ${panel.color}08 0%, ${panel.color}18 40%, ${panel.color}05 100%)`,
            }"
          >
            <!-- 装饰线条 -->
            <div
              class="rhs-deco-line rhs-deco-line-top"
              :style="{ background: `linear-gradient(90deg, transparent, ${panel.accent}40, transparent)` }"
            ></div>
            <div
              class="rhs-deco-line rhs-deco-line-bottom"
              :style="{ background: `linear-gradient(90deg, transparent, ${panel.accent}25, transparent)` }"
            ></div>

            <div class="rhs-panel-content">
              <!-- Badge -->
              <span
                class="rhs-badge"
                :style="{ borderColor: panel.accent + '50', color: panel.accent }"
              >{{ panel.badge }}</span>

              <!-- 标题 -->
              <h2 class="rhs-title" :style="{ color: panel.accent }">
                {{ panel.title }}
              </h2>

              <!-- 副标题 -->
              <p class="rhs-subtitle">{{ panel.subtitle }}</p>

              <!-- 面板序号 -->
              <div
                class="rhs-panel-num"
                :style="{ color: panel.accent + '15' }"
              >{{ String(i + 1).padStart(2, '0') }}</div>
            </div>

            <!-- 侧边序号标记 -->
            <div
              class="rhs-side-mark"
              :style="{ borderColor: panel.accent + '30' }"
            >
              {{ String(i + 1).padStart(2, '0') }}
            </div>
          </section>
        </div>
      </div>

      <!-- 滚动触发器 → ScrollTrigger 监听此元素的滚动进度 -->
      <div class="rhs-trigger"></div>
    </div>

    <!-- 左右提示箭头 -->
    <button class="rhs-arrow rhs-arrow-left" @click="handleArrowClick('prev')" aria-label="上一屏">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15,18 9,12 15,6"/></svg>
    </button>
    <button class="rhs-arrow rhs-arrow-right" @click="handleArrowClick('next')" aria-label="下一屏">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9,6 15,12 9,18"/></svg>
    </button>
  </div>
</template>

<style scoped lang="scss">
/* ========== 根容器 ========== */
.rhs-root {
  position: relative;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #060612;
  user-select: none;
}

/* ========== 滚动区域 ========== */
.rhs-scroll-area {
  height: 100%;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  scroll-behavior: auto; // GSAP scrub 接管，不启用 smooth

  // 隐藏滚动条但保留功能
  &::-webkit-scrollbar { width: 0; }
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* ========== 粘性视口 ========== */
.rhs-sticky-vp {
  position: sticky;
  top: 0;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  z-index: 1;
}

/* ========== 面板轨道 ========== */
.rhs-track {
  display: flex;
  height: 100%;
  will-change: transform;
}

/* ========== 单个面板 ========== */
.rhs-panel {
  min-width: 100vw;
  height: 100vh;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

/* 装饰线 */
.rhs-deco-line {
  position: absolute;
  left: 5%;
  right: 5%;
  height: 1px;
  pointer-events: none;
}
.rhs-deco-line-top { top: 12%; }
.rhs-deco-line-bottom { bottom: 12%; }

/* 面板内容 */
.rhs-panel-content {
  text-align: center;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  padding: 40px;
}

/* Badge */
.rhs-badge {
  display: inline-block;
  padding: 5px 22px;
  border: 1px solid;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 4px;
  margin-bottom: 24px;
}

/* 标题 */
.rhs-title {
  font-size: clamp(2rem, 4.5vw, 3.8rem);
  font-weight: 900;
  margin: 0 0 12px;
  line-height: 1.15;
  letter-spacing: -0.02em;
}

/* 副标题 */
.rhs-subtitle {
  font-size: clamp(0.95rem, 1.4vw, 1.1rem);
  color: rgba(255, 255, 255, 0.4);
  margin: 0;
  font-weight: 400;
}

/* 面板序号水印 */
.rhs-panel-num {
  position: absolute;
  bottom: -80px;
  left: 50%;
  transform: translateX(-50%);
  font-size: clamp(6rem, 12vw, 12rem);
  font-weight: 900;
  line-height: 1;
  pointer-events: none;
}

/* 侧边序号标记 */
.rhs-side-mark {
  position: absolute;
  top: 50%;
  right: 40px;
  transform: translateY(-50%);
  font-size: clamp(3rem, 6vw, 5rem);
  font-weight: 900;
  color: transparent;
  -webkit-text-stroke: 1px;
  opacity: 0.5;
  pointer-events: none;
}

/* ========== 触发器 ========== */
.rhs-trigger {
  width: 100%;
  pointer-events: none;
  // height 由 JS 动态设置
}

/* ========== 进度条 ========== */
.rhs-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.05);
}

.rhs-progress-fill {
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 30%, #06b6d4 60%, #f472b6 100%);
  border-radius: 0 2px 2px 0;
  box-shadow: 0 0 10px rgba(99, 102, 241, 0.5);
}

/* ========== 页码指示器 ========== */
.rhs-indicator {
  position: fixed;
  top: 24px;
  right: 28px;
  z-index: 1000;
  display: flex;
  align-items: baseline;
  gap: 2px;
  padding: 8px 18px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.rhs-current {
  font-size: 1.4rem;
  font-weight: 700;
  color: #fff;
  min-width: 1.2em;
  text-align: center;
}
.rhs-sep {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.3);
  margin: 0 1px;
}
.rhs-total {
  font-size: 1rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.35);
}

/* ========== 导航点 ========== */
.rhs-dots {
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  gap: 12px;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.rhs-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.35);
    transform: scale(1.3);
  }

  &.rhs-active {
    background: #8b8cff;
    border-color: rgba(139, 140, 255, 0.4);
    width: 14px;
    border-radius: 7px;
    box-shadow: 0 0 16px rgba(139, 140, 255, 0.45);
  }
}

/* ========== 左右箭头 ========== */
.rhs-arrow {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  z-index: 999;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 50%;
  color: rgba(255, 255, 255, 0.45);
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0;
  animation: rhs-fade-in 1s 1s ease forwards;
  padding: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    color: rgba(255, 255, 255, 0.85);
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 0 20px rgba(139, 140, 255, 0.18);
  }
}

.rhs-arrow-left {
  left: 20px;
  animation-name: rhs-fade-in-left;
}
.rhs-arrow-right {
  right: 20px;
  animation-name: rhs-fade-in-right;
}

@keyframes rhs-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes rhs-fade-in-left {
  from { opacity: 0; transform: translateY(-50%) translateX(-10px); }
  to { opacity: 1; transform: translateY(-50%) translateX(0); }
}
@keyframes rhs-fade-in-right {
  from { opacity: 0; transform: translateY(-50%) translateX(10px); }
  to { opacity: 1; transform: translateY(-50%) translateX(0); }
}

/* ========== 响应式 ========== */
@media (max-width: 768px) {
  .rhs-arrow {
    width: 38px;
    height: 38px;
    svg { width: 20px; height: 20px; }
  }
  .rhs-arrow-left { left: 10px; }
  .rhs-arrow-right { right: 10px; }
  .rhs-indicator {
    top: 16px;
    right: 14px;
    padding: 6px 14px;
  }
  .rhs-dots {
    bottom: 20px;
    gap: 10px;
    padding: 8px 16px;
  }
  .rhs-side-mark {
    right: 20px;
  }
}

@media (max-width: 480px) {
  .rhs-panel-content { padding: 24px; }
  .rhs-deco-line-top { top: 8%; }
  .rhs-deco-line-bottom { bottom: 8%; }
}
</style>
