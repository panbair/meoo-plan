<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
import gsap from 'gsap'

// ==================== 常量 ====================
const totalPanels = 7
const cloneCount = totalPanels * 2 // 14 个面板（7 原始 + 7 克隆）

// ==================== 面板数据 ====================
const panelData = [
  { badge: 'INFINITE', emoji: '∞', title: '无限循环', desc: '7 屏无缝循环滚动', color: '#6366f1', bg: 'linear-gradient(135deg, #0a0a2e 0%, #1a1a4e 50%, #0d0d3a 100%)' },
  { badge: 'SMOOTH', emoji: '✦', title: '丝滑过渡', desc: 'GSAP power3 弹性缓动', color: '#06b6d4', bg: 'linear-gradient(135deg, #042f2e 0%, #0a4a4a 50%, #052e2e 100%)' },
  { badge: 'REACTIVE', emoji: '◈', title: '全端适配', desc: '桌面/平板/手机完美呈现', color: '#8b5cf6', bg: 'linear-gradient(135deg, #1a0a2e 0%, #2d1a4e 50%, #1a0d3a 100%)' },
  { badge: 'CONTROL', emoji: '◆', title: '多维操控', desc: '滚轮 · 键盘 · 触摸 · 点击', color: '#3b82f6', bg: 'linear-gradient(135deg, #0a1a2e 0%, #1a2d4e 50%, #0d1d3a 100%)' },
  { badge: 'PERFORM', emoji: '⬡', title: '高性能', desc: 'GSAP 优化 · 稳定 60FPS', color: '#14b8a6', bg: 'linear-gradient(135deg, #042e2a 0%, #0a4a42 50%, #052e28 100%)' },
  { badge: 'AESTHETIC', emoji: '◇', title: '精工美学', desc: '渐变背景 · 毛玻璃 UI', color: '#f472b6', bg: 'linear-gradient(135deg, #2e0a1a 0%, #4e1a2d 50%, #3a0d1d 100%)' },
  { badge: 'BOUNDLESS', emoji: '⟡', title: '无界体验', desc: '首尾相接 · 永无止境', color: '#a78bfa', bg: 'linear-gradient(135deg, #1a0a2e 0%, #2d1a4e 50%, #1a0d3a 100%)' },
]

// 克隆面板列表（14 项，前7后7内容相同）
const clonedPanels = computed(() => [...panelData, ...panelData])

// ==================== 状态 ====================
let vw = 0
let activeVisualIndex = 0 // 在 14 个面板中的视觉位置 (0~13)
let isTransitioning = false
let wheelAccumulator = 0
const WHEEL_THRESHOLD = 80 // 累积滚动量阈值 (px)

// DOM 引用
let rootEl: HTMLElement | null = null
let trackEl: HTMLElement | null = null
let progressBar: HTMLElement | null = null

// ==================== 工具函数 ====================
function activePanel(): number {
  return activeVisualIndex % totalPanels
}

function getTrackX(index: number): number {
  return -index * vw
}

// ==================== UI 更新 ====================
function updateUI() {
  const idx = activePanel()
  // 更新导航点
  document.querySelectorAll('.rih-dot').forEach((dot, i) => {
    dot.classList.toggle('rih-active', i === idx)
  })
  // 更新页码
  const currentEl = document.querySelector('.rih-current') as HTMLElement
  if (currentEl) currentEl.textContent = String(idx + 1)
  // 更新进度条
  if (progressBar) {
    gsap.to(progressBar, {
      width: `${((idx + 1) / totalPanels) * 100}%`,
      duration: 0.35,
      ease: 'power2.out',
    })
  }
}

// ==================== 核心：向前翻页 ====================
function goNext() {
  if (isTransitioning || !trackEl) return
  isTransitioning = true

  let targetVisual = activeVisualIndex + 1
  const needsReset = targetVisual >= cloneCount

  gsap.to(trackEl, {
    x: getTrackX(targetVisual),
    duration: 0.55,
    ease: 'power3.out',
    onComplete: () => {
      if (needsReset) {
        // 走到了克隆区起始位置(P0')，视觉上等于 P0，无缝跳回
        activeVisualIndex = 0
        gsap.set(trackEl, { x: getTrackX(0) })
      } else {
        activeVisualIndex = targetVisual
      }
      isTransitioning = false
      updateUI()
    },
  })
}

// ==================== 核心：向后翻页 ====================
function goPrev() {
  if (isTransitioning || !trackEl) return

  if (activeVisualIndex === 0) {
    // 在原始 P0，需要跳回克隆区才能向左动画
    activeVisualIndex = totalPanels // 跳到克隆 P0(P7)
    gsap.set(trackEl, { x: getTrackX(activeVisualIndex) })
  }

  isTransitioning = true
  const targetVisual = activeVisualIndex - 1

  gsap.to(trackEl, {
    x: getTrackX(targetVisual),
    duration: 0.55,
    ease: 'power3.out',
    onComplete: () => {
      activeVisualIndex = targetVisual
      isTransitioning = false
      updateUI()
    },
  })
}

// ==================== 跳转到指定面板（支持一次跨多屏） ====================
function goToPanel(targetIdx: number) {
  if (isTransitioning || !trackEl) return
  targetIdx = ((targetIdx % totalPanels) + totalPanels) % totalPanels
  const current = activePanel()
  if (targetIdx === current) return

  const forwardDist = (targetIdx - current + totalPanels) % totalPanels
  const backwardDist = (current - targetIdx + totalPanels) % totalPanels

  if (forwardDist <= backwardDist) {
    // 向前连续调用 goNext
    isTransitioning = true
    chainNext(forwardDist)
  } else {
    // 向后连续调用 goPrev
    isTransitioning = true
    chainPrev(backwardDist)
  }
}

function chainNext(remaining: number) {
  if (remaining <= 0) {
    isTransitioning = false
    updateUI()
    return
  }
  // 解除 isTransitioning 锁 → 手动执行一次 goNext 核心逻辑
  isTransitioning = false
  let targetVisual = activeVisualIndex + 1
  const needsReset = targetVisual >= cloneCount

  gsap.to(trackEl!, {
    x: getTrackX(targetVisual),
    duration: remaining > 1 ? 0.28 : 0.55, // 多步跳转时加速
    ease: remaining > 1 ? 'power2.inOut' : 'power3.out',
    onComplete: () => {
      if (needsReset) {
        activeVisualIndex = 0
        gsap.set(trackEl!, { x: getTrackX(0) })
      } else {
        activeVisualIndex = targetVisual
      }
      updateUI()
      chainNext(remaining - 1)
    },
  })
}

function chainPrev(remaining: number) {
  if (remaining <= 0) {
    isTransitioning = false
    updateUI()
    return
  }

  if (activeVisualIndex === 0) {
    activeVisualIndex = totalPanels
    gsap.set(trackEl!, { x: getTrackX(activeVisualIndex) })
  }

  const targetVisual = activeVisualIndex - 1

  gsap.to(trackEl!, {
    x: getTrackX(targetVisual),
    duration: remaining > 1 ? 0.28 : 0.55,
    ease: remaining > 1 ? 'power2.inOut' : 'power3.out',
    onComplete: () => {
      activeVisualIndex = targetVisual
      updateUI()
      chainPrev(remaining - 1)
    },
  })
}

// ==================== 滚轮事件 ====================
function onWheel(e: WheelEvent) {
  const rect = rootEl?.getBoundingClientRect()
  if (!rect) return
  // 鼠标不在容器区域 → 穿透
  if (e.clientY < rect.top || e.clientY > rect.bottom) return
  if (e.clientX < rect.left || e.clientX > rect.right) return

  e.preventDefault()
  wheelAccumulator += Math.abs(e.deltaY) > 5 ? e.deltaY : 0

  if (wheelAccumulator >= WHEEL_THRESHOLD) {
    wheelAccumulator = 0
    goNext()
  } else if (wheelAccumulator <= -WHEEL_THRESHOLD) {
    wheelAccumulator = 0
    goPrev()
  }
}

// ==================== 键盘导航 ====================
function onKeydown(e: KeyboardEvent) {
  const focusTag = (document.activeElement?.tagName || '').toLowerCase()
  if (focusTag === 'input' || focusTag === 'textarea' || focusTag === 'select') return

  switch (e.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      e.preventDefault()
      goNext()
      break
    case 'ArrowLeft':
    case 'ArrowUp':
      e.preventDefault()
      goPrev()
      break
    case 'Home':
      e.preventDefault()
      goToPanel(0)
      break
    case 'End':
      e.preventDefault()
      goToPanel(totalPanels - 1)
      break
  }
}

// ==================== 触摸滑动 ====================
let touchStartX = 0
let touchStartY = 0

function onTouchStart(e: TouchEvent) {
  touchStartX = e.touches[0].clientX
  touchStartY = e.touches[0].clientY
}

function onTouchEnd(e: TouchEvent) {
  const dx = touchStartX - e.changedTouches[0].clientX
  const dy = touchStartY - e.changedTouches[0].clientY
  // 水平滑动超过阈值，且不是垂直滑动
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
    dx > 0 ? goNext() : goPrev()
  }
}

// ==================== 窗口 resize ====================
function onResize() {
  vw = window.innerWidth
  if (trackEl) {
    gsap.set(trackEl, { x: getTrackX(activeVisualIndex) })
  }
}

// ==================== 初始化 / 销毁 ====================
function init() {
  vw = window.innerWidth
  rootEl = document.querySelector('.rih-root') as HTMLElement
  trackEl = document.querySelector('.rih-track') as HTMLElement
  progressBar = document.querySelector('.rih-progress-fill') as HTMLElement

  if (!rootEl || !trackEl) return

  // 初始化 track 位置
  gsap.set(trackEl, { x: 0 })

  // 事件绑定
  rootEl.addEventListener('wheel', onWheel, { passive: false })
  document.addEventListener('keydown', onKeydown)
  document.addEventListener('touchstart', onTouchStart, { passive: true })
  document.addEventListener('touchend', onTouchEnd, { passive: true })
  window.addEventListener('resize', onResize)
  window.addEventListener('orientationchange', () => setTimeout(onResize, 200))

  updateUI()
}

function destroy() {
  gsap.killTweensOf(trackEl)
  gsap.killTweensOf(progressBar)
  rootEl?.removeEventListener('wheel', onWheel)
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('touchstart', onTouchStart)
  document.removeEventListener('touchend', onTouchEnd)
  window.removeEventListener('resize', onResize)
  rootEl = null
  trackEl = null
  progressBar = null
}

onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>

<template>
  <div class="rih-root">
    <!-- 进度条 -->
    <div class="rih-progress">
      <div class="rih-progress-fill"></div>
    </div>

    <!-- 右上角页码指示器 -->
    <div class="rih-indicator">
      <span class="rih-current">1</span>
      <span class="rih-sep">/</span>
      <span class="rih-total">{{ totalPanels }}</span>
    </div>

    <!-- 底部导航点 -->
    <nav class="rih-dots">
      <button
        v-for="(_, i) in panelData"
        :key="i"
        class="rih-dot"
        :class="{ 'rih-active': i === 0 }"
        :aria-label="`跳转到第 ${i + 1} 屏`"
        @click="goToPanel(i)"
      ></button>
    </nav>

    <!-- 面板轨道 -->
    <div class="rih-track" :style="{ width: `${cloneCount * 100}vw` }">
      <section
        v-for="(panel, i) in clonedPanels"
        :key="`${i}`"
        class="rih-panel"
        :style="{
          background: panel.bg,
          width: '100vw',
        }"
      >
        <!-- 装饰元素 -->
        <div class="rih-deco-ring" :style="{ borderColor: panel.color + '22' }"></div>
        <div class="rih-deco-ring rih-deco-ring-2" :style="{ borderColor: panel.color + '15' }"></div>

        <div class="rih-content">
          <!-- Badge -->
          <span class="rih-badge" :style="{ borderColor: panel.color + '40', color: panel.color }">
            {{ panel.badge }}
          </span>

          <!-- Emoji -->
          <div class="rih-emoji" :style="{ color: panel.color }">{{ panel.emoji }}</div>

          <!-- 标题 -->
          <h2 class="rih-title">{{ panel.title }}</h2>

          <!-- 描述 -->
          <p class="rih-desc">{{ panel.desc }}</p>

          <!-- 屏幕序号 -->
          <div class="rih-number" :style="{ color: panel.color + '20' }">
            {{ String((i % totalPanels) + 1).padStart(2, '0') }}
          </div>
        </div>
      </section>
    </div>

    <!-- 左右提示箭头 -->
    <div class="rih-hint rih-hint-left" @click="goPrev">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="15,18 9,12 15,6" />
      </svg>
    </div>
    <div class="rih-hint rih-hint-right" @click="goNext">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="9,6 15,12 9,18" />
      </svg>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* ========== 根容器 ========== */
.rih-root {
  position: relative;
  height: 100vh;
  overflow: hidden;
  font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #f5f0f8;
  user-select: none;
  -webkit-user-select: none;
}

/* ========== 进度条 ========== */
.rih-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.06);
}

.rih-progress-fill {
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa, #f472b6, #06b6d4);
  border-radius: 0 2px 2px 0;
  box-shadow: 0 0 12px rgba(99, 102, 241, 0.5);
}

/* ========== 页码指示器 ========== */
.rih-indicator {
  position: fixed;
  top: 24px;
  right: 28px;
  z-index: 1000;
  display: flex;
  align-items: baseline;
  gap: 2px;
  padding: 8px 18px;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.rih-current {
  font-size: 1.4rem;
  font-weight: 700;
  color: #fff;
  min-width: 1.2em;
  text-align: center;
}

.rih-sep {
  font-size: 0.85rem;
  color: rgba(26, 26, 46, 0.3);
  margin: 0 1px;
}

.rih-total {
  font-size: 1rem;
  font-weight: 500;
  color: rgba(26, 26, 46, 0.35);
}

/* ========== 导航点 ========== */
.rih-dots {
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  gap: 12px;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.rih-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.4);
    transform: scale(1.4);
  }

  &.rih-active {
    background: #8b8cff;
    border-color: rgba(139, 140, 255, 0.5);
    width: 14px;
    border-radius: 7px;
    box-shadow: 0 0 16px rgba(139, 140, 255, 0.5), 0 0 32px rgba(139, 140, 255, 0.2);
  }
}

/* ========== 面板轨道 ========== */
.rih-track {
  display: flex;
  height: 100%;
  will-change: transform;
}

/* ========== 单个面板 ========== */
.rih-panel {
  flex-shrink: 0;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

/* 装饰圆环 */
.rih-deco-ring {
  position: absolute;
  width: 70vmin;
  height: 70vmin;
  border-radius: 50%;
  border: 1px solid;
  opacity: 0.4;
  pointer-events: none;
  animation: rih-spin-slow 40s linear infinite;
}

.rih-deco-ring-2 {
  width: 90vmin;
  height: 90vmin;
  opacity: 0.25;
  animation-duration: 55s;
  animation-direction: reverse;
}

@keyframes rih-spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ========== 面板内容 ========== */
.rih-content {
  position: relative;
  z-index: 2;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  padding: 40px;
}

/* Badge */
.rih-badge {
  display: inline-block;
  padding: 5px 22px;
  border: 1px solid;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 4px;
  text-transform: uppercase;
  margin-bottom: 20px;
}

/* Emoji 装饰 */
.rih-emoji {
  font-size: 3rem;
  margin-bottom: 16px;
  line-height: 1;
  opacity: 0.8;
  filter: drop-shadow(0 0 20px currentColor);
}

/* 标题 */
.rih-title {
  font-size: clamp(2.2rem, 5vw, 4rem);
  font-weight: 900;
  color: #fff;
  margin: 0 0 12px;
  line-height: 1.15;
  letter-spacing: -0.02em;
}

/* 描述 */
.rih-desc {
  font-size: clamp(0.95rem, 1.5vw, 1.15rem);
  color: rgba(26, 26, 46, 0.45);
  margin: 0;
  font-weight: 400;
  letter-spacing: 0.02em;
}

/* 面板序号水印 */
.rih-number {
  position: absolute;
  bottom: -120px;
  left: 50%;
  transform: translateX(-50%);
  font-size: clamp(8rem, 15vw, 14rem);
  font-weight: 900;
  pointer-events: none;
  line-height: 1;
  opacity: 0.6;
  letter-spacing: -0.05em;
}

/* ========== 左右提示箭头 ========== */
.rih-hint {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  z-index: 999;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: rgba(26, 26, 46, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0;
  animation: rih-fade-in 1s 1.2s ease forwards;

  &:hover {
    background: rgba(255, 255, 255, 0.14);
    color: rgba(26, 26, 46, 0.9);
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 0 24px rgba(139, 140, 255, 0.2);
  }
}

.rih-hint-left { left: 20px; }
.rih-hint-right { right: 20px; }

@keyframes rih-fade-in {
  from { opacity: 0; transform: translateY(-50%) translateX(-8px); }
  to { opacity: 1; transform: translateY(-50%) translateX(0); }
}

/* ========== 响应式 ========== */
@media (max-width: 768px) {
  .rih-hint {
    width: 38px;
    height: 38px;
    svg { width: 20px; height: 20px; }
  }
  .rih-hint-left { left: 10px; }
  .rih-hint-right { right: 10px; }
  .rih-indicator {
    top: 16px;
    right: 14px;
    padding: 6px 14px;
  }
  .rih-dots {
    bottom: 20px;
    gap: 10px;
    padding: 8px 16px;
  }
  .rih-dot {
    width: 8px;
    height: 8px;
  }
  .rih-dot.rih-active {
    width: 12px;
  }
  .rih-number {
    bottom: -60px;
  }
}

@media (max-width: 480px) {
  .rih-content { padding: 24px; }
  .rih-emoji { font-size: 2.2rem; }
}
</style>
