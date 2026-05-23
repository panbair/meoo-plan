<template>
  <section ref="parentRef" class="ba-container" :class="{ 'ba-dragging': isDragging }">
    <!-- ==================== Layer 1: Before 图片 (底层全幅) ==================== -->
    <div class="ba-before-layer">
      <img :src="beforeUrl" alt="before" class="ba-img" />
    </div>

    <!-- ==================== Layer 2: After 图片 (clip-path 动态裁剪) ==================== -->
    <div ref="afterLayerRef" class="ba-after-layer" :style="{ clipPath: clipPathStyle }">
      <img :src="afterUrl" alt="after" class="ba-img" />
    </div>

    <!-- ==================== Layer 3: 分割滑动条 ==================== -->
    <div
      ref="sliderRef"
      class="ba-slider"
      :style="{ left: splitPercent + '%' }"
      @mousedown="onDragStart"
      @touchstart.prevent="onDragStart"
    >
      <div class="ba-slider-line"></div>
      <div class="ba-slider-handle">
        <svg class="ba-arrow ba-arrow-left" viewBox="0 0 24 24" width="18" height="18">
          <path d="M15 4l-8 8 8 8" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <svg class="ba-arrow ba-arrow-right" viewBox="0 0 24 24" width="18" height="18">
          <path d="M9 4l8 8-8 8" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>

    <!-- ==================== Layer 4: 放大镜层 ==================== -->
    <div
      v-show="showMagnifier"
      ref="magnifierRef"
      class="ba-magnifier"
      :style="magnifierStyle"
    >
      <div class="ba-mag-outer">
        <div class="ba-mag-inner">
          <!-- 放大镜中分屏显示 Before(左) / After(右) -->
          <div class="ba-mag-split">
            <div class="ba-mag-half ba-mag-before">
              <img :src="beforeUrl" alt="before" class="ba-mag-img" />
            </div>
            <div class="ba-mag-half ba-mag-after">
              <img :src="afterUrl" alt="after" class="ba-mag-img" />
            </div>
          </div>
          <div class="ba-mag-divider"></div>
        </div>
      </div>
    </div>

    <!-- ==================== Layer 5: 标签指示器 ==================== -->
    <div ref="labelBeforeRef" class="ba-label ba-label-before" :style="{ left: `calc(${splitPercent}% - 100px)` }">
      <span class="ba-label-text">BEFORE</span>
    </div>
    <div ref="labelAfterRef" class="ba-label ba-label-after" :style="{ left: `calc(${splitPercent}% + 20px)` }">
      <span class="ba-label-text">AFTER</span>
    </div>

    <!-- ==================== 文字信息 ==================== -->
    <div ref="infoRef" class="ba-info">
      <span class="ba-info-label">BEFORE / AFTER</span>
      <h2 class="ba-info-title">前后对比</h2>
      <p class="ba-info-sub">Slide · Compare · Reveal</p>
      <div class="ba-info-divider"></div>
      <p class="ba-info-desc">拖动滑块对比变化</p>
      <p class="ba-info-percent">{{ splitPercent }}%</p>
    </div>

    <!-- ==================== 进度指示器 ==================== -->
    <div ref="progressRef" class="ba-progress">
      <div ref="progressBarRef" class="ba-progress-bar"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ======== 类型 ========
type TweenCleanup = () => void

// ======== 模板引用 ========
const parentRef = ref<HTMLElement | null>(null)
const afterLayerRef = ref<HTMLElement | null>(null)
const sliderRef = ref<HTMLElement | null>(null)
const magnifierRef = ref<HTMLElement | null>(null)
const labelBeforeRef = ref<HTMLElement | null>(null)
const labelAfterRef = ref<HTMLElement | null>(null)
const infoRef = ref<HTMLElement | null>(null)
const progressRef = ref<HTMLElement | null>(null)
const progressBarRef = ref<HTMLElement | null>(null)

const cleanupFns: TweenCleanup[] = []

// ======== 图片资源 ========
// Before：山脉湖泊冬季景观
const beforeUrl = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80'
// After：山脉湖泊夏季景观
const afterUrl = 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&q=80'

// ======== 响应式状态 ========
const splitPercent = ref(50)
const isDragging = ref(false)
const showMagnifier = ref(false)
const mouseX = ref(0)
const mouseY = ref(0)
const magX = ref(0)
const magY = ref(0)

// 放大镜尺寸
const MAG_SIZE = 200
const MAG_ZOOM = 2.0

// clip-path 动态样式
const clipPathStyle = computed(() => {
  const p = splitPercent.value
  return `inset(0 ${100 - p}% 0 0)`
})

// 放大镜样式（位置 + 图片偏移）
const magnifierStyle = computed(() => {
  const w = window.innerWidth
  const h = window.innerHeight
  const half = MAG_SIZE / 2

  // 约束放大镜不超出视野
  const clampedX = Math.min(Math.max(magX.value, half), w - half)
  const clampedY = Math.min(Math.max(magY.value, half), h - half)

  // 背景偏移量：使放大镜下的图像跟随鼠标位置
  const bgOffsetX = -(clampedX * MAG_ZOOM - half)
  const bgOffsetY = -(clampedY * MAG_ZOOM - half)

  return {
    left: `${clampedX - half}px`,
    top: `${clampedY - half}px`,
    '--mag-bg-offset-x': `${bgOffsetX.toFixed(1)}px`,
    '--mag-bg-offset-y': `${bgOffsetY.toFixed(1)}px`,
  }
})

// ======== 拖拽处理 ========
let dragRafId = 0

const onDragStart = (e: MouseEvent | TouchEvent) => {
  isDragging.value = true
  showMagnifier.value = false
  document.body.style.userSelect = 'none'
  document.body.style.cursor = 'ew-resize'

  document.addEventListener('mousemove', onDragMove)
  document.addEventListener('mouseup', onDragEnd)
  document.addEventListener('touchmove', onDragMove, { passive: false })
  document.addEventListener('touchend', onDragEnd)
}

const onDragMove = (e: MouseEvent | TouchEvent) => {
  if (!isDragging.value) return

  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  const container = parentRef.value
  if (!container) return

  const rect = container.getBoundingClientRect()
  const p = ((clientX - rect.left) / rect.width) * 100
  splitPercent.value = Math.min(95, Math.max(5, Math.round(p)))
}

const onDragEnd = () => {
  isDragging.value = false
  document.body.style.userSelect = ''
  document.body.style.cursor = ''

  document.removeEventListener('mousemove', onDragMove)
  document.removeEventListener('mouseup', onDragEnd)
  document.removeEventListener('touchmove', onDragMove)
  document.removeEventListener('touchend', onDragEnd)
}

// ======== 鼠标悬停 → 放大镜 ========
const handleMouseMove = (e: MouseEvent) => {
  mouseX.value = e.clientX
  mouseY.value = e.clientY

  if (isDragging.value) return

  magX.value = e.clientX
  magY.value = e.clientY
}

const handleMouseEnter = () => {
  if (isDragging.value) return
  showMagnifier.value = true
}

const handleMouseLeave = () => {
  showMagnifier.value = false
}

// ======== 初始化 GSAP 时间线 ========
onMounted(() => {
  if (!parentRef.value) return
  requestAnimationFrame(() => setup())
})

const setup = () => {
  const container = parentRef.value
  if (!container) return

  // ===== 初始状态 =====
  gsap.set(afterLayerRef.value, { clipPath: 'inset(0 50% 0 0)' })
  gsap.set(sliderRef.value, { left: '50%' })
  gsap.set(magnifierRef.value, { opacity: 0, scale: 0.5 })
  gsap.set(labelBeforeRef.value, { opacity: 0.75 })
  gsap.set(labelAfterRef.value, { opacity: 0.75 })
  gsap.set(infoRef.value, { opacity: 0, y: 30 })
  gsap.set(progressBarRef.value, { width: '0%' })

  // ===== 主时间线：滚动驱动自动滑动 =====
  const mainTl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top 85%',
      end: 'bottom 15%',
      scrub: 1.2,
    },
  })

  // 阶段1 (0-30%): 初始状态 → 微微拉开到 35%
  mainTl.call(
    () => { splitPercent.value = 50 },
    [],
    0,
  )

  mainTl.to(
    {},
    {
      duration: 0.3,
      onUpdate: () => {
        const p = mainTl.progress()
        // 0→0.3: 从50%滑到35%，展示after更多
        const mapped = gsap.utils.mapRange(0, 0.3, 50, 35)
        splitPercent.value = Math.round(mapped(p))
      },
    },
    0,
  )

  // 阶段2 (30-60%): 快速滑到70%
  mainTl.to(
    {},
    {
      duration: 0.3,
      onUpdate: () => {
        const p = mainTl.progress()
        const mapped = gsap.utils.mapRange(0.3, 0.6, 35, 75)
        splitPercent.value = Math.round(mapped(p))
      },
    },
    0.3,
  )

  // 阶段3 (60-85%): 回弹到50%，展示before更多
  mainTl.to(
    {},
    {
      duration: 0.25,
      onUpdate: () => {
        const p = mainTl.progress()
        const mapped = gsap.utils.mapRange(0.6, 0.85, 75, 45)
        splitPercent.value = Math.round(mapped(p))
      },
    },
    0.6,
  )

  // 阶段4 (85-100%): 文字入场 + 稳定50%
  mainTl.to(
    {},
    {
      duration: 0.15,
      onUpdate: () => {
        const p = mainTl.progress()
        const mapped = gsap.utils.mapRange(0.85, 1, 45, 50)
        splitPercent.value = Math.round(mapped(p))
      },
    },
    0.85,
  )

  // 文字入场
  mainTl.to(infoRef.value, { opacity: 1, y: 0, duration: 0.1, ease: 'power2.out' }, 0.85)

  // 标签微动
  mainTl.to(labelBeforeRef.value, { opacity: 0.9, duration: 0.08 }, 0.3)
  mainTl.to(labelBeforeRef.value, { opacity: 0.45, duration: 0.08 }, 0.7)
  mainTl.to(labelAfterRef.value, { opacity: 0.9, duration: 0.08 }, 0.3)
  mainTl.to(labelAfterRef.value, { opacity: 0.45, duration: 0.08 }, 0.7)

  // 进度条
  mainTl.to(progressBarRef.value, { width: '100%', duration: 0.95, ease: 'none' }, 0)

  cleanupFns.push(() => {
    mainTl.scrollTrigger?.kill()
    mainTl.kill()
  })

  // ===== 鼠标事件 =====
  const el = container
  el.addEventListener('mousemove', handleMouseMove)
  el.addEventListener('mouseenter', handleMouseEnter)
  el.addEventListener('mouseleave', handleMouseLeave)

  cleanupFns.push(() => {
    el.removeEventListener('mousemove', handleMouseMove)
    el.removeEventListener('mouseenter', handleMouseEnter)
    el.removeEventListener('mouseleave', handleMouseLeave)
  })
}

// ======== 清理 ========
onUnmounted(() => {
  if (dragRafId) cancelAnimationFrame(dragRafId)
  cleanupFns.forEach((fn) => fn())
})
</script>

<style lang="scss" scoped>
/* ==================== 容器 ==================== */
.ba-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #0a0a0e;
  cursor: default;

  &.ba-dragging {
    cursor: ew-resize;
  }
}

/* ==================== 通用图片 ==================== */
.ba-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  user-select: none;
  -webkit-user-drag: none;
}

/* ==================== Layer 1: Before 图片 ==================== */
.ba-before-layer {
  position: absolute;
  inset: 0;
  z-index: 1;
}

/* ==================== Layer 2: After 图片 (clip-path) ==================== */
.ba-after-layer {
  position: absolute;
  inset: 0;
  z-index: 2;
  will-change: clip-path;
  // 默认 clip-path 由 JS 动态设置
}

/* ==================== Layer 3: 分割滑动条 ==================== */
.ba-slider {
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 4;
  transform: translateX(-50%);
  pointer-events: auto;
  cursor: ew-resize;

  &:hover .ba-slider-handle {
    transform: translate(-50%, -50%) scale(1.15);
    box-shadow:
      0 0 30px rgba(255, 255, 255, 0.3),
      0 0 60px rgba(255, 255, 255, 0.1);
  }

  &:active .ba-slider-handle {
    transform: translate(-50%, -50%) scale(1.25);
  }
}

.ba-slider-line {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 3px;
  transform: translateX(-50%);
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.85) 15%,
    rgba(255, 255, 255, 0.85) 85%,
    rgba(255, 255, 255, 0) 100%
  );
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.25);
}

.ba-slider-handle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.92);
  box-shadow:
    0 0 15px rgba(255, 255, 255, 0.25),
    0 2px 20px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  transition: transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    box-shadow 0.2s ease;
  pointer-events: none;
}

.ba-arrow {
  color: #333;
  pointer-events: none;
}

.ba-arrow-left {
  margin-right: 1px;
}

.ba-arrow-right {
  margin-left: 1px;
}

/* ==================== Layer 4: 放大镜 ==================== */
.ba-magnifier {
  position: fixed;
  z-index: 10;
  pointer-events: none;
  will-change: left, top;
}

.ba-mag-outer {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.7);
  box-shadow:
    0 8px 40px rgba(0, 0, 0, 0.5),
    0 0 0 6px rgba(0, 0, 0, 0.15),
    inset 0 0 30px rgba(255, 255, 255, 0.05);
  overflow: hidden;
  backdrop-filter: blur(0.5px);
}

.ba-mag-inner {
  width: 100%;
  height: 100%;
  position: relative;
}

.ba-mag-split {
  width: 200%;
  height: 200%;
  transform: translate(
    var(--mag-bg-offset-x, 0px),
    var(--mag-bg-offset-y, 0px)
  );
  display: flex;
}

.ba-mag-half {
  width: 50%;
  height: 100%;
  overflow: hidden;
}

.ba-mag-img {
  width: 200%;
  height: 200%;
  object-fit: cover;
}

.ba-mag-before .ba-mag-img {
  transform: translateX(0);
}

.ba-mag-after .ba-mag-img {
  transform: translateX(-100%);
}

.ba-mag-divider {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 2px;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.6);
  box-shadow: 0 0 4px rgba(255, 255, 255, 0.3);
}

/* ==================== Layer 5: 标签指示器 ==================== */
.ba-label {
  position: absolute;
  top: 24px;
  z-index: 3;
  pointer-events: none;
  user-select: none;
  transition: opacity 0.3s ease;
}

.ba-label-before {
  transform: translateX(-100%);
}

.ba-label-text {
  display: inline-block;
  padding: 6px 16px;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: #fff;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 6px;
}

.ba-label-before .ba-label-text {
  border-right: 2px solid rgba(255, 150, 100, 0.8);
}

.ba-label-after .ba-label-text {
  border-left: 2px solid rgba(100, 200, 255, 0.8);
}

/* ==================== 文字信息 ==================== */
.ba-info {
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 5;
  text-align: center;
  pointer-events: none;
  user-select: none;
  will-change: transform, opacity;
}

.ba-info-label {
  display: block;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.25em;
  color: rgba(255, 255, 255, 0.55);
  margin-bottom: 8px;
}

.ba-info-title {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-size: 38px;
  font-weight: 800;
  color: #fff;
  margin: 0 0 6px;
  letter-spacing: -0.02em;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.5);
}

.ba-info-sub {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.4);
  margin: 0 0 12px;
  letter-spacing: 0.08em;
}

.ba-info-divider {
  width: 40px;
  height: 2px;
  background: linear-gradient(90deg, rgba(255, 150, 100, 0.6), rgba(100, 200, 255, 0.6));
  margin: 0 auto 12px;
  border-radius: 1px;
}

.ba-info-desc {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0 0 6px;
}

.ba-info-percent {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.35);
  margin: 0;
  letter-spacing: 0.05em;
}

/* ==================== 进度指示器 ==================== */
.ba-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  z-index: 6;
  pointer-events: none;
}

.ba-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #ff9664, #64c8ff);
  width: 0%;
  will-change: width;
}

/* ==================== 响应式 ==================== */
@media (max-width: 768px) {
  .ba-slider-handle {
    width: 38px;
    height: 38px;
  }

  .ba-mag-outer {
    width: 140px;
    height: 140px;
  }

  .ba-info-title {
    font-size: 28px;
  }

  .ba-label-text {
    font-size: 11px;
    padding: 4px 10px;
  }
}
</style>
