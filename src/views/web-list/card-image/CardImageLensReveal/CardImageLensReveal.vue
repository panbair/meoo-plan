<template>
  <section ref="parentRef" class="lr-container">
    <!-- ==================== SVG 定义：镜头光晕渐变 ==================== -->
    <svg class="lr-svg-defs" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <radialGradient id="lr-flare-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="rgba(255,255,240,0.6)" />
          <stop offset="15%" stop-color="rgba(255,255,240,0.3)" />
          <stop offset="35%" stop-color="rgba(255,220,180,0.1)" />
          <stop offset="60%" stop-color="rgba(255,255,255,0.02)" />
          <stop offset="100%" stop-color="rgba(0,0,0,0)" />
        </radialGradient>

        <radialGradient id="lr-flare-ring" cx="50%" cy="50%" r="50%">
          <stop offset="70%" stop-color="rgba(255,255,255,0)" />
          <stop offset="85%" stop-color="rgba(255,255,240,0.15)" />
          <stop offset="100%" stop-color="rgba(255,255,240,0.25)" />
        </radialGradient>
      </defs>
    </svg>

    <!-- ==================== Layer 1: 远景图 ==================== -->
    <div ref="farLayerRef" class="lr-layer lr-far">
      <img
        :src="images[0].src"
        :alt="images[0].title"
        class="lr-img"
        crossorigin="anonymous"
      />
    </div>

    <!-- ==================== Layer 2: 中景图 ==================== -->
    <div ref="midLayerRef" class="lr-layer lr-mid">
      <img
        :src="images[1].src"
        :alt="images[1].title"
        class="lr-img"
        crossorigin="anonymous"
      />
    </div>

    <!-- ==================== Layer 3: 近景图 ==================== -->
    <div ref="nearLayerRef" class="lr-layer lr-near">
      <img
        :src="images[2].src"
        :alt="images[2].title"
        class="lr-img"
        crossorigin="anonymous"
      />
    </div>

    <!-- ==================== Layer 4: 镜头光晕 ==================== -->
    <div ref="flareRef" class="lr-flare">
      <!-- 主光斑 -->
      <div ref="flareCoreRef" class="lr-flare-core"></div>
      <!-- 光环 -->
      <div ref="flareRingRef" class="lr-flare-ring"></div>
      <!-- 次级光斑 (3个小光斑) -->
      <div v-for="i in 3" :key="i" :ref="(el) => { if (el) flareGhosts[i - 1] = el as HTMLElement }"
        class="lr-flare-ghost"
        :class="`lr-flare-ghost-${i}`">
      </div>
    </div>

    <!-- ==================== Layer 5: 对焦框 ==================== -->
    <div ref="focusFrameRef" class="lr-focus-frame">
      <!-- 四角 L 形标线 -->
      <span class="lr-corner lr-corner-tl"></span>
      <span class="lr-corner lr-corner-tr"></span>
      <span class="lr-corner lr-corner-bl"></span>
      <span class="lr-corner lr-corner-br"></span>
      <!-- 中央十字准星 -->
      <div ref="crosshairRef" class="lr-crosshair">
        <span class="lr-crosshair-h"></span>
        <span class="lr-crosshair-v"></span>
      </div>
      <!-- 对焦环 -->
      <div ref="focusRingRef" class="lr-focus-ring"></div>
    </div>

    <!-- ==================== 暗角 ==================== -->
    <div class="lr-vignette"></div>

    <!-- ==================== 信息面板 ==================== -->
    <div ref="infoRef" class="lr-info">
      <span class="lr-info-label">{{ focusLabel }}</span>
      <h2 class="lr-info-title">{{ focusTitle }}</h2>
      <div class="lr-info-divider"></div>
      <span class="lr-info-specs">
        焦距 {{ focalLength }}mm · 光圈 f/{{ fStop }} · {{ focusStage }}
      </span>
    </div>

    <!-- ==================== 进度指示器 ==================== -->
    <div ref="progressRef" class="lr-progress">
      <div ref="progressBarRef" class="lr-progress-bar"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, reactive } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ======== 类型 ========
type TweenCleanup = () => void

interface ImageLayer {
  src: string
  title: string
  label: string
}

// ======== 模板引用 ========
const parentRef = ref<HTMLElement | null>(null)
const farLayerRef = ref<HTMLElement | null>(null)
const midLayerRef = ref<HTMLElement | null>(null)
const nearLayerRef = ref<HTMLElement | null>(null)
const flareRef = ref<HTMLElement | null>(null)
const flareCoreRef = ref<HTMLElement | null>(null)
const flareRingRef = ref<HTMLElement | null>(null)
const focusFrameRef = ref<HTMLElement | null>(null)
const crosshairRef = ref<HTMLElement | null>(null)
const focusRingRef = ref<HTMLElement | null>(null)
const infoRef = ref<HTMLElement | null>(null)
const progressRef = ref<HTMLElement | null>(null)
const progressBarRef = ref<HTMLElement | null>(null)

const flareGhosts = reactive<HTMLElement[]>([])

// ======== 响应式状态 ========
const focusLabel = ref('远景 · FAR')
const focusTitle = ref('层峦叠嶂')
const focalLength = ref('200')
const fStop = ref('16')
const focusStage = ref('对焦中...')

const cleanupFns: TweenCleanup[] = []

// ======== 图片资源 ========
const images: ImageLayer[] = [
  {
    src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400&q=80',
    title: '层峦叠嶂',
    label: '远景 · FAR',
  },
  {
    src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1400&q=80',
    title: '林间幽径',
    label: '中景 · MID',
  },
  {
    src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1400&q=80',
    title: '花语细语',
    label: '近景 · NEAR',
  },
]

// ======== 鼠标状态 ========
let mouseX = 0.5
let mouseY = 0.5

const handleMouseMove = (e: MouseEvent) => {
  mouseX = e.clientX / window.innerWidth
  mouseY = e.clientY / window.innerHeight
}

// ======== 镜头光晕颜色映射 ========
const flareColors: Record<string, string> = {
  far: 'rgba(180,210,255,0.4)',
  mid: 'rgba(180,240,210,0.4)',
  near: 'rgba(255,200,150,0.4)',
}

const frameColors: Record<string, string> = {
  far: 'rgba(100,160,240,0.7)',
  mid: 'rgba(80,210,160,0.7)',
  near: 'rgba(255,160,80,0.7)',
}

// ======== 计算三阶段模糊值 ========
const computeBlurs = (progress: number) => {
  const p = gsap.utils.clamp(0, 1, progress)
  let farBlur: number, midBlur: number, nearBlur: number
  let stage: string, fStopVal: string, focalVal: string

  if (p < 0.33) {
    // 阶段1: 远景对焦 (远→近)
    const t = p / 0.33
    farBlur = 8 * (1 - t)          // 8 → 0
    midBlur = 5                    // 保持
    nearBlur = 3                   // 保持
    stage = '深景深'
    fStopVal = Math.round(16 - t * 8).toString()     // f/16 → f/8
    focalVal = '∞'
  } else if (p < 0.66) {
    // 阶段2: 中景对焦
    const t = (p - 0.33) / 0.33
    farBlur = 0 + t * 3            // 0 → 3
    midBlur = 5 * (1 - t)          // 5 → 0
    nearBlur = 3                   // 保持
    stage = '中景深'
    fStopVal = Math.round(8 + t * 8).toString()      // f/8 → f/16
    focalVal = '85'
  } else {
    // 阶段3: 近景对焦 (近景特写)
    const t = (p - 0.66) / 0.34
    farBlur = 3 + t * 4            // 3 → 7
    midBlur = 0 + t * 3            // 0 → 3
    nearBlur = 3 * (1 - t)         // 3 → 0
    stage = '浅景深'
    fStopVal = Math.round(16 - t * 14).toString()    // f/16 → f/2
    focalVal = '35'
  }

  return { farBlur, midBlur, nearBlur, stage, fStopVal, focalVal }
}

// ======== 应用模糊值 ========
const applyBlurs = (farBlur: number, midBlur: number, nearBlur: number) => {
  const farEl = farLayerRef.value
  const midEl = midLayerRef.value
  const nearEl = nearLayerRef.value

  if (farEl) farEl.style.filter = `blur(${farBlur.toFixed(1)}px)`
  if (midEl) midEl.style.filter = `blur(${midBlur.toFixed(1)}px)`
  if (nearEl) nearEl.style.filter = `blur(${nearBlur.toFixed(1)}px)`
}

// ======== 更新UI状态 ========
const updateUI = (progress: number, stage: string, fStopVal: string, focalVal: string) => {
  const p = gsap.utils.clamp(0, 1, progress)

  // 计算当前焦点层
  let activeLayer: 'far' | 'mid' | 'near'
  if (p < 0.33) activeLayer = 'far'
  else if (p < 0.66) activeLayer = 'mid'
  else activeLayer = 'near'

  focusLabel.value = images[activeLayer === 'far' ? 0 : activeLayer === 'mid' ? 1 : 2].label
  focusTitle.value = images[activeLayer === 'far' ? 0 : activeLayer === 'mid' ? 1 : 2].title
  focalLength.value = focalVal
  fStop.value = fStopVal
  focusStage.value = stage

  // 对焦框颜色
  const frameColor = frameColors[activeLayer]
  if (focusFrameRef.value) {
    focusFrameRef.value.style.setProperty('--frame-color', frameColor)
  }

  // 光晕颜色
  const flareColor = flareColors[activeLayer]
  if (flareRef.value) {
    flareRef.value.style.setProperty('--flare-color', flareColor)
  }
}

// ======== 更新镜头光晕位置(跟随鼠标) ========
const updateFlarePosition = () => {
  const flareEl = flareRef.value
  if (!flareEl) return

  const x = mouseX * 100
  const y = mouseY * 100
  flareEl.style.setProperty('--flare-x', `${x}%`)
  flareEl.style.setProperty('--flare-y', `${y}%`)
}

// ======== 渲染帧 ========
let rafId = 0
const renderLoop = () => {
  updateFlarePosition()
  rafId = requestAnimationFrame(renderLoop)
}

// ======== 初始化 ========
onMounted(() => {
  if (!parentRef.value) return
  requestAnimationFrame(() => setup())
})

const setup = () => {
  const container = parentRef.value
  if (!container) return

  // ===== 初始渲染 =====
  applyBlurs(8, 5, 3)

  // 初始焦点框
  focusFrameRef.value?.style.setProperty('--frame-color', frameColors['far'])
  flareRef.value?.style.setProperty('--flare-color', flareColors['far'])

  gsap.set(farLayerRef.value, { opacity: 1 })
  gsap.set(midLayerRef.value, { opacity: 1 })
  gsap.set(nearLayerRef.value, { opacity: 1 })
  gsap.set(flareRef.value, { opacity: 0.3 })
  gsap.set(focusFrameRef.value, { opacity: 0.4 })
  gsap.set(infoRef.value, { opacity: 0, y: 20 })
  gsap.set(progressBarRef.value, { width: '0%' })

  // ===== 鼠标跟踪 =====
  window.addEventListener('mousemove', handleMouseMove)
  rafId = requestAnimationFrame(renderLoop)

  // ===== 主时间线 =====
  const mainTl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top 85%',
      end: 'bottom 15%',
      scrub: 1.2,
    },
  })

  // 空 tween 驱动 onUpdate
  mainTl.to(
    {},
    {
      duration: 1,
      onUpdate: () => {
        const p = mainTl.progress()
        const { farBlur, midBlur, nearBlur, stage, fStopVal, focalVal } = computeBlurs(p)
        applyBlurs(farBlur, midBlur, nearBlur)
        updateUI(p, stage, fStopVal, focalVal)
      },
    },
    0,
  )

  // 光晕强度变化 (每阶段峰值)
  mainTl.to(flareRef.value, { opacity: 0.7, duration: 0.08 }, 0.12)   // 远景峰值
  mainTl.to(flareRef.value, { opacity: 0.35, duration: 0.05 }, 0.28)
  mainTl.to(flareRef.value, { opacity: 0.8, duration: 0.08 }, 0.45)   // 中景峰值
  mainTl.to(flareRef.value, { opacity: 0.35, duration: 0.05 }, 0.60)
  mainTl.to(flareRef.value, { opacity: 0.9, duration: 0.08 }, 0.78)   // 近景峰值(最强)
  mainTl.to(flareRef.value, { opacity: 0.4, duration: 0.05 }, 0.95)

  // 对焦框脉冲
  mainTl.to(focusFrameRef.value, { opacity: 0.8, duration: 0.06 }, 0.10)
  mainTl.to(focusFrameRef.value, { opacity: 0.4, duration: 0.06 }, 0.20)
  mainTl.to(focusFrameRef.value, { opacity: 0.85, duration: 0.06 }, 0.42)
  mainTl.to(focusFrameRef.value, { opacity: 0.4, duration: 0.06 }, 0.52)
  mainTl.to(focusFrameRef.value, { opacity: 0.9, duration: 0.06 }, 0.75)
  mainTl.to(focusFrameRef.value, { opacity: 0.5, duration: 0.06 }, 0.88)

  // 信息面板入场
  mainTl.to(infoRef.value, { opacity: 1, y: 0, duration: 0.1, ease: 'power2.out' }, 0.05)
  mainTl.to(infoRef.value, { opacity: 0.8, duration: 0.1 }, 0.92)

  // 进度条
  mainTl.to(progressBarRef.value, { width: '100%', duration: 0.98, ease: 'none' }, 0.01)

  cleanupFns.push(() => {
    mainTl.scrollTrigger?.kill()
    mainTl.kill()
  })
}

// ======== 清理 ========
onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  if (rafId) cancelAnimationFrame(rafId)
  cleanupFns.forEach((fn) => fn())
})
</script>

<style lang="scss" scoped>
/* ==================== 容器 ==================== */
.lr-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #0a0a0f;
  perspective: 1200px;
}

/* ==================== SVG 隐藏定义 ==================== */
.lr-svg-defs {
  position: absolute;
  width: 0;
  height: 0;
  pointer-events: none;
}

/* ==================== 图片层 ==================== */
.lr-layer {
  position: absolute;
  inset: -5%;
  overflow: hidden;
}

.lr-img {
  width: 110%;
  height: 110%;
  object-fit: cover;
  transition: filter 0.05s linear;
  will-change: filter;
}

/* 远景: 推开 + 初始模糊 8px */
.lr-far {
  z-index: 1;
  transform: translateZ(-100px) scale(1.1);
}

.lr-far .lr-img {
  filter: blur(8px);
}

/* 中景: 微推开 + 初始模糊 5px */
.lr-mid {
  z-index: 2;
  transform: translateZ(-50px) scale(1.05);
}

.lr-mid .lr-img {
  filter: blur(5px);
}

/* 近景: 在焦平面 + 初始模糊 3px */
.lr-near {
  z-index: 3;
  transform: translateZ(0px);
}

.lr-near .lr-img {
  filter: blur(3px);
}

/* ==================== 镜头光晕 ==================== */
.lr-flare {
  position: absolute;
  inset: 0;
  z-index: 10;
  pointer-events: none;
  opacity: 0.3;
  --flare-x: 50%;
  --flare-y: 50%;
  --flare-color: rgba(180, 210, 255, 0.4);
}

/* 主光斑 */
.lr-flare-core {
  position: absolute;
  top: var(--flare-y);
  left: var(--flare-x);
  transform: translate(-50%, -50%);
  width: 300px;
  height: 300px;
  background: radial-gradient(circle,
    var(--flare-color) 0%,
    rgba(255, 255, 255, 0.15) 20%,
    rgba(255, 255, 255, 0.03) 50%,
    transparent 70%
  );
  border-radius: 50%;
  mix-blend-mode: screen;
}

/* 光环 */
.lr-flare-ring {
  position: absolute;
  top: var(--flare-y);
  left: var(--flare-x);
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 1px solid var(--flare-color);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.08);
  opacity: 0.5;
}

/* 次级光斑 (鬼影) */
.lr-flare-ghost {
  position: absolute;
  top: var(--flare-y);
  left: var(--flare-x);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: radial-gradient(circle,
    var(--flare-color) 0%,
    transparent 70%
  );
  mix-blend-mode: screen;
  opacity: 0.3;
}

.lr-flare-ghost-1 {
  transform: translate(-130%, -110%);
  width: 55px;
  height: 55px;
}

.lr-flare-ghost-2 {
  transform: translate(120%, -90%);
  width: 30px;
  height: 30px;
  opacity: 0.2;
}

.lr-flare-ghost-3 {
  transform: translate(90%, 130%);
  width: 25px;
  height: 25px;
  opacity: 0.15;
}

/* ==================== 对焦框 ==================== */
.lr-focus-frame {
  position: absolute;
  inset: 5%;
  z-index: 11;
  pointer-events: none;
  opacity: 0.4;
  --frame-color: rgba(100, 160, 240, 0.7);
}

/* 四角 L 形标线 */
.lr-corner {
  position: absolute;
  width: 40px;
  height: 40px;
  border-color: var(--frame-color);
  border-style: solid;
}

.lr-corner-tl { top: 0; left: 0; border-width: 2px 0 0 2px; }
.lr-corner-tr { top: 0; right: 0; border-width: 2px 2px 0 0; }
.lr-corner-bl { bottom: 0; left: 0; border-width: 0 0 2px 2px; }
.lr-corner-br { bottom: 0; right: 0; border-width: 0 2px 2px 0; }

/* 中央十字准星 */
.lr-crosshair {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  opacity: 0.6;
}

.lr-crosshair-h,
.lr-crosshair-v {
  position: absolute;
  background: var(--frame-color);
}

.lr-crosshair-h {
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  transform: translateY(-50%);
}

.lr-crosshair-v {
  left: 50%;
  top: 0;
  bottom: 0;
  width: 1px;
  transform: translateX(-50%);
}

/* 对焦环 */
.lr-focus-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 14px;
  height: 14px;
  border: 1.5px solid var(--frame-color);
  border-radius: 50%;
  opacity: 0.8;

  &::after {
    content: '';
    position: absolute;
    inset: 3px;
    border-radius: 50%;
    background: var(--frame-color);
    opacity: 0.4;
    animation: focus-pulse 2s ease-in-out infinite;
  }
}

@keyframes focus-pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.8; }
}

/* ==================== 暗角 ==================== */
.lr-vignette {
  position: absolute;
  inset: 0;
  z-index: 4;
  pointer-events: none;
  background: radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(0,0,0,0.45) 100%);
  mix-blend-mode: multiply;
}

/* ==================== 信息面板 ==================== */
.lr-info {
  position: absolute;
  bottom: 8%;
  left: 8%;
  z-index: 12;
  pointer-events: none;
  max-width: 320px;
}

.lr-info-label {
  display: block;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  letter-spacing: 3px;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  margin-bottom: 6px;
}

.lr-info-title {
  margin: 0 0 8px;
  font-size: clamp(24px, 3vw, 36px);
  font-weight: 300;
  color: #fff;
  letter-spacing: 6px;
}

.lr-info-divider {
  width: 40px;
  height: 1px;
  background: rgba(255, 255, 255, 0.3);
  margin: 8px 0 10px;
}

.lr-info-specs {
  font-family: 'Courier New', monospace;
  font-size: 11px;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.4);
}

/* ==================== 进度条 ==================== */
.lr-progress {
  position: absolute;
  bottom: 3%;
  left: 8%;
  right: 8%;
  height: 1.5px;
  background: rgba(255, 255, 255, 0.08);
  z-index: 12;
  pointer-events: none;
}

.lr-progress-bar {
  height: 100%;
  background: linear-gradient(90deg,
    rgba(100, 160, 240, 0.7),
    rgba(80, 210, 160, 0.7),
    rgba(255, 160, 80, 0.7)
  );
  width: 0%;
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.15);
}
</style>
