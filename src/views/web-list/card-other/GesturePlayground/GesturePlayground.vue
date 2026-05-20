<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'

const parentRef = ref<HTMLElement | null>(null)
const stageRef = ref<HTMLElement | null>(null)
const cubeWrapperRef = ref<HTMLElement | null>(null)
const cubeRef = ref<HTMLElement | null>(null)
const infoPanelRef = ref<HTMLElement | null>(null)

// ==================== 3D 状态 ====================
const rotX = ref(-25)
const rotY = ref(35)
const rotZ = ref(0)
const cubeScale = ref(1)
const gestureName = ref('待机')
const gestureIcon = ref('✋')

interface TouchPoint {
  id: number
  x: number
  y: number
}

const touchPoints = reactive<TouchPoint[]>([])
const trail = reactive<{ x: number; y: number }[]>([])

const cubeTransform = computed(() => ({ transform: `
    perspective(800px)
    rotateX(${rotX.value}deg)
    rotateY(${rotY.value}deg)
    rotateZ(${rotZ.value}deg)
    scale3d(${cubeScale.value}, ${cubeScale.value}, ${cubeScale.value})
  `
}))

const shadowStyle = computed(() => {
  const s = cubeScale.value
  const blur = 30 + (1 - s) * 20
  const opa = Math.max(0.05, 0.2 - Math.abs(s - 1) * 0.1)
  return { transform: `rotateX(90deg) translateZ(-80px) scale(${s * 1.2})`,
    filter: `blur(${blur}px)`,
    opacity: opa
  }
})

// ==================== 鼠标拖拽旋转 ====================
let isDragging = false
let dragStartX = 0
let dragStartY = 0
let dragStartRotX = 0
let dragStartRotY = 0

// 惯性
let velocityX = 0
let velocityY = 0
let lastMoveX = 0
let lastMoveY = 0
let lastMoveTime = 0
let inertiaRaf = 0

const onMouseDown = (e: MouseEvent) => {
  if (e.button !== 0) {
    return
  }
  isDragging = true
  dragStartX = e.clientX
  dragStartY = e.clientY
  dragStartRotX = rotX.value
  dragStartRotY = rotY.value
  velocityX = 0
  velocityY = 0
  lastMoveX = e.clientX
  lastMoveY = e.clientY
  lastMoveTime = Date.now()
  cancelAnimationFrame(inertiaRaf)

  gestureName.value = '拖拽旋转'
  gestureIcon.value = '🔄'

  trail.length = 0
  addTrailPoint(e)
}

const onMouseMove = (e: MouseEvent) => {
  if (!isDragging) {
    return
  }
  const dx = e.clientX - dragStartX
  const dy = e.clientY - dragStartY
  rotY.value = dragStartRotY + dx * 0.5
  rotX.value = dragStartRotX - dy * 0.5

  const now = Date.now()
  const dt = now - lastMoveTime || 16
  velocityX = ((e.clientX - lastMoveX) / dt) * 16
  velocityY = ((e.clientY - lastMoveY) / dt) * 16
  lastMoveX = e.clientX
  lastMoveY = e.clientY
  lastMoveTime = now

  addTrailPoint(e)
}

const onMouseUp = () => {
  if (!isDragging) {
    return
  }
  isDragging = false
  gestureName.value = '待机'
  gestureIcon.value = '✋'

  // 惯性旋转
  if (Math.abs(velocityX) > 1 || Math.abs(velocityY) > 1) {
    gestureName.value = '惯性滑动'
    gestureIcon.value = '💨'
    startInertia()
  }

  setTimeout(() => {
    trail.length = 0
  }, 500)
}

const startInertia = () => {
  const decay = 0.95
  const tick = () => {
    velocityX *= decay
    velocityY *= decay
    rotY.value += velocityX * 0.5
    rotX.value -= velocityY * 0.5
    if (Math.abs(velocityX) > 0.1 || Math.abs(velocityY) > 0.1) {
      inertiaRaf = requestAnimationFrame(tick)
    } else {
      gestureName.value = '待机'
      gestureIcon.value = '✋'
    }
  }
  inertiaRaf = requestAnimationFrame(tick)
}

// ==================== 滚轮缩放 ====================
const onWheel = (e: WheelEvent) => {
  e.preventDefault()
  const delta = e.deltaY > 0 ? -0.05 : 0.05
  cubeScale.value = Math.max(0.3, Math.min(3, cubeScale.value + delta))
  gestureName.value = '滚轮缩放'
  gestureIcon.value = '🔍'
  clearTimeout(wheelTimer)
  wheelTimer = window.setTimeout(() => {
    gestureName.value = '待机'
    gestureIcon.value = '✋'
  }, 600)
}
let wheelTimer = 0

// ==================== 双击重置 ====================
let lastClickTime = 0
const onDblClick = () => {
  const now = Date.now()
  if (now - lastClickTime < 400) {
    return
  }
  lastClickTime = now

  gestureName.value = '重置'
  gestureIcon.value = '🎯'

  gsap.to(rotX, { value: -25, duration: 0.6, ease: 'back.out(1.4)' })
  gsap.to(rotY, { value: 35, duration: 0.6, ease: 'back.out(1.4)' })
  gsap.to(rotZ, { value: 0, duration: 0.6, ease: 'back.out(1.4)' })
  gsap.to(cubeScale, {
    value: 1,
    duration: 0.6,
    ease: 'back.out(1.4)',
    onComplete: () => {
      gestureName.value = '待机'
      gestureIcon.value = '✋'
    }
  })
}

// ==================== 触摸手势 ====================
let touchStartDist = 0
let touchStartAngle = 0
let touchStartScale = 1
let touchStartRotZ = 0
let isTwoFinger = false

const onTouchStart = (e: TouchEvent) => {
  e.preventDefault()
  updateTouchPoints(e)

  if (e.touches.length === 1) {
    isDragging = true
    dragStartX = e.touches[0].clientX
    dragStartY = e.touches[0].clientY
    dragStartRotX = rotX.value
    dragStartRotY = rotY.value
    gestureName.value = '单指旋转'
    gestureIcon.value = '☝️'
    trail.length = 0
  } else if (e.touches.length === 2) {
    isDragging = false
    isTwoFinger = true
    const t = e.touches
    touchStartDist = Math.hypot(t[1].clientX - t[0].clientX, t[1].clientY - t[0].clientY)
    touchStartAngle = Math.atan2(t[1].clientY - t[0].clientY, t[1].clientX - t[0].clientX)
    touchStartScale = cubeScale.value
    touchStartRotZ = rotZ.value
    gestureName.value = '双指操控'
    gestureIcon.value = '🤏'
  }
}

const onTouchMove = (e: TouchEvent) => {
  e.preventDefault()
  updateTouchPoints(e)

  if (e.touches.length === 1 && isDragging) {
    const dx = e.touches[0].clientX - dragStartX
    const dy = e.touches[0].clientY - dragStartY
    rotY.value = dragStartRotY + dx * 0.5
    rotX.value = dragStartRotX - dy * 0.5
  } else if (e.touches.length === 2 && isTwoFinger) {
    const t = e.touches
    const dist = Math.hypot(t[1].clientX - t[0].clientX, t[1].clientY - t[0].clientY)
    const angle = Math.atan2(t[1].clientY - t[0].clientY, t[1].clientX - t[0].clientX)

    cubeScale.value = Math.max(0.3, Math.min(3, touchStartScale * (dist / touchStartDist)))
    rotZ.value = touchStartRotZ + (angle - touchStartAngle) * (180 / Math.PI)

    gestureName.value = '捏合+旋转'
    gestureIcon.value = '🤏'
  }
}

const onTouchEnd = (e: TouchEvent) => {
  updateTouchPoints(e)
  if (e.touches.length === 0) {
    isDragging = false
    isTwoFinger = false
    gestureName.value = '待机'
    gestureIcon.value = '✋'
  } else if (e.touches.length === 1) {
    isTwoFinger = false
    isDragging = true
    dragStartX = e.touches[0].clientX
    dragStartY = e.touches[0].clientY
    dragStartRotX = rotX.value
    dragStartRotY = rotY.value
    gestureName.value = '单指旋转'
    gestureIcon.value = '☝️'
  }
}

const updateTouchPoints = (e: TouchEvent) => {
  touchPoints.length = 0
  const rect = stageRef.value?.getBoundingClientRect()
  if (!rect) {
    return
  }
  for (let i = 0; i < e.touches.length; i++) {
    touchPoints.push({ id: e.touches[i].identifier,
      x: e.touches[i].clientX - rect.left,
      y: e.touches[i].clientY - rect.top
    })
  }
}

const addTrailPoint = (e: MouseEvent) => {
  const rect = stageRef.value?.getBoundingClientRect()
  if (!rect) {
    return
  }
  trail.push({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  if (trail.length > 40) {
    trail.shift()
  }
}

// ==================== 生命周期 ====================
onMounted(() => {
  const stage = stageRef.value
  if (!stage) {
    return
  }

  stage.addEventListener('mousedown', onMouseDown)
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
  stage.addEventListener('wheel', onWheel, { passive: false })
  stage.addEventListener('dblclick', onDblClick)
  stage.addEventListener('touchstart', onTouchStart, { passive: false })
  stage.addEventListener('touchmove', onTouchMove, { passive: false })
  stage.addEventListener('touchend', onTouchEnd)

  // 入场动画
  gsap.from(cubeScale, { value: 0, duration: 0.8, ease: 'back.out(1.6)' })
  if (infoPanelRef.value) {
    gsap.from(infoPanelRef.value, {
      y: 30,
      opacity: 0,
      duration: 0.6,
      delay: 0.3,
      ease: 'power3.out'
    })
  }
})

onUnmounted(() => {
  const stage = stageRef.value
  if (stage) {
    stage.removeEventListener('mousedown', onMouseDown)
    stage.removeEventListener('wheel', onWheel)
    stage.removeEventListener('dblclick', onDblClick)
    stage.removeEventListener('touchstart', onTouchStart)
    stage.removeEventListener('touchmove', onTouchMove)
    stage.removeEventListener('touchend', onTouchEnd)
  }
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', onMouseUp)
  cancelAnimationFrame(inertiaRaf)
})
</script>

<template>
  <div ref="parentRef" class="gesture-playground">
    <!-- 3D 舞台 -->
    <div ref="stageRef" class="gp-stage">
      <div ref="cubeWrapperRef" class="gp-cube-wrapper" :style="cubeTransform">
        <div ref="cubeRef" class="gp-cube">
          <div class="gp-face gp-front">
            <span class="gp-face-label">前 FRONT</span>
            <div class="gp-face-pattern"></div>
          </div>
          <div class="gp-face gp-back">
            <span class="gp-face-label">后 BACK</span>
            <div class="gp-face-pattern"></div>
          </div>
          <div class="gp-face gp-right">
            <span class="gp-face-label">右 RIGHT</span>
            <div class="gp-face-pattern"></div>
          </div>
          <div class="gp-face gp-left">
            <span class="gp-face-label">左 LEFT</span>
            <div class="gp-face-pattern"></div>
          </div>
          <div class="gp-face gp-top">
            <span class="gp-face-label">上 TOP</span>
            <div class="gp-face-pattern"></div>
          </div>
          <div class="gp-face gp-bottom">
            <span class="gp-face-label">下 BOTTOM</span>
            <div class="gp-face-pattern"></div>
          </div>
        </div>
      </div>

      <!-- 阴影 -->
      <div class="gp-shadow" :style="shadowStyle"></div>

      <!-- 触摸点可视化 -->
      <div
        v-for="tp in touchPoints"
        :key="tp.id"
        class="gp-touch-point"
        :style="{ left: tp.x + 'px', top: tp.y + 'px' }"
      >
        <div class="gp-touch-ripple"></div>
      </div>

      <!-- 手势轨迹 -->
      <svg v-if="trail.length > 1" class="gp-trail-svg">
        <polyline
          :points="trail.map((p) => `${p.x},${p.y}`).join(' ')"
          fill="none"
          stroke="rgba(100,180,255,0.4)"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
    </div>

    <!-- 信息面板 -->
    <div ref="infoPanelRef" class="gp-info-panel">
      <div class="gp-info-header">
        <div class="gp-gesture-name">
          <span class="gp-gesture-icon">{{ gestureIcon }}</span>
          <span>{{ gestureName }}</span>
        </div>
      </div>
      <div class="gp-info-grid">
        <div class="gp-info-item">
          <span class="gp-info-label">旋转 X</span>
          <span class="gp-info-value">{{ rotX.toFixed(1) }}°</span>
        </div>
        <div class="gp-info-item">
          <span class="gp-info-label">旋转 Y</span>
          <span class="gp-info-value">{{ rotY.toFixed(1) }}°</span>
        </div>
        <div class="gp-info-item">
          <span class="gp-info-label">旋转 Z</span>
          <span class="gp-info-value">{{ rotZ.toFixed(1) }}°</span>
        </div>
        <div class="gp-info-item">
          <span class="gp-info-label">缩放</span>
          <span class="gp-info-value">{{ cubeScale.toFixed(2) }}x</span>
        </div>
      </div>
      <div class="gp-hint">
        <div>🖱️ 拖拽旋转 · 滚轮缩放 · 双击重置</div>
        <div>📱 单指旋转 · 双指缩放/旋转</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.gesture-playground {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: radial-gradient(ellipse at center, #1a1a3e 0%, #0d0d1a 100%);
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Segoe UI', sans-serif;
}

// ==================== 3D 舞台 ====================
.gp-stage {
  flex: 1;
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  touch-action: none;

  &:active {
    cursor: grabbing;
  }
}

.gp-cube-wrapper {
  transform-style: preserve-3d;
  transition: none;
}

.gp-cube {
  width: 140px;
  height: 140px;
  position: relative;
  transform-style: preserve-3d;
}

.gp-face {
  position: absolute;
  width: 140px;
  height: 140px;
  border: 1.5px solid rgba(100, 180, 255, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
  backface-visibility: visible;
  overflow: hidden;

  &.gp-front {
    background: linear-gradient(135deg, rgba(60, 130, 255, 0.35), rgba(40, 80, 200, 0.25));
    transform: translateZ(70px);
  }
  &.gp-back {
    background: linear-gradient(135deg, rgba(200, 60, 100, 0.35), rgba(150, 30, 80, 0.25));
    transform: rotateY(180deg) translateZ(70px);
  }
  &.gp-right {
    background: linear-gradient(135deg, rgba(60, 200, 130, 0.35), rgba(30, 150, 80, 0.25));
    transform: rotateY(90deg) translateZ(70px);
  }
  &.gp-left {
    background: linear-gradient(135deg, rgba(200, 180, 60, 0.35), rgba(150, 130, 30, 0.25));
    transform: rotateY(-90deg) translateZ(70px);
  }
  &.gp-top {
    background: linear-gradient(135deg, rgba(180, 60, 200, 0.35), rgba(130, 30, 150, 0.25));
    transform: rotateX(90deg) translateZ(70px);
  }
  &.gp-bottom {
    background: linear-gradient(135deg, rgba(60, 180, 200, 0.35), rgba(30, 130, 150, 0.25));
    transform: rotateX(-90deg) translateZ(70px);
  }
}

.gp-face-label {
  position: relative;
  z-index: 1;
  letter-spacing: 2px;
  text-shadow: 0 0 10px rgba(100, 180, 255, 0.5);
}

.gp-face-pattern {
  position: absolute;
  inset: 8px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 4px;

  &::before {
    content: '';
    position: absolute;
    inset: 4px;
    border: 1px dashed rgba(255, 255, 255, 0.06);
    border-radius: 2px;
  }
}

.gp-shadow {
  position: absolute;
  bottom: 60px;
  width: 160px;
  height: 160px;
  background: radial-gradient(ellipse, rgba(100, 180, 255, 0.15), transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

// ==================== 触摸点 ====================
.gp-touch-point {
  position: absolute;
  width: 40px;
  height: 40px;
  margin-left: -20px;
  margin-top: -20px;
  pointer-events: none;
  z-index: 50;
}

.gp-touch-ripple {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid rgba(100, 200, 255, 0.5);
  background: rgba(100, 200, 255, 0.1);
  animation: gp-ripple 0.6s ease-out infinite;
}

@keyframes gp-ripple {
  0% {
    transform: scale(0.5);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.gp-trail-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 40;
}

// ==================== 信息面板 ====================
.gp-info-panel {
  width: 100%;
  padding: 12px 20px 16px;
  background: rgba(15, 15, 35, 0.8);
  backdrop-filter: blur(12px);
  border-top: 1px solid rgba(100, 180, 255, 0.12);
}

.gp-info-header {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.gp-gesture-name {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(100, 180, 255, 0.12);
  padding: 4px 16px;
  border-radius: 20px;
  font-size: 14px;
  color: #8cf;
  font-weight: 600;
}

.gp-gesture-icon {
  font-size: 18px;
}

.gp-info-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 8px;
}

.gp-info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 8px;
}

.gp-info-label {
  font-size: 10px;
  color: #667;
  margin-bottom: 2px;
}

.gp-info-value {
  font-size: 14px;
  color: #adf;
  font-weight: 700;
  font-family: 'Consolas', monospace;
}

.gp-hint {
  text-align: center;
  font-size: 11px;
  color: #556;
  line-height: 1.6;
}
</style>

