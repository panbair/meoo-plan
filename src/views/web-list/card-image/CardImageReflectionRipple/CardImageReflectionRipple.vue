<template>
  <section ref="parentRef" class="rr-container" @click="handleClick">
    <!-- ==================== SVG 定义：水波纹扭曲 + 发光滤镜 ==================== -->
    <svg class="rr-svg-defs" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <!-- 水波纹扭曲滤镜：feTurbulence + feDisplacementMap -->
        <filter id="rr-ripple-distort" color-interpolation-filters="sRGB">
          <feTurbulence
            id="rr-turbulence"
            type="fractalNoise"
            baseFrequency="0.012 0.06"
            numOctaves="3"
            seed="4"
            result="noise"
          />
          <feDisplacementMap
            id="rr-displacement"
            in="SourceGraphic"
            in2="noise"
            scale="0"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
        </filter>

        <!-- 倒影渐变遮罩 -->
        <linearGradient id="rr-reflection-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="rgba(0,0,0,0)" />
          <stop offset="25%" stop-color="rgba(0,0,0,0.45)" />
          <stop offset="70%" stop-color="rgba(0,0,0,0.85)" />
          <stop offset="100%" stop-color="rgba(0,0,0,1)" />
        </linearGradient>

        <!-- 水面雾气渐变 -->
        <linearGradient id="rr-mist-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="rgba(180,200,220,0)" />
          <stop offset="50%" stop-color="rgba(180,200,220,0.08)" />
          <stop offset="100%" stop-color="rgba(200,215,230,0.15)" />
        </linearGradient>

        <!-- 水面交界线发光 -->
        <filter id="rr-boundary-glow">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
    </svg>

    <!-- ==================== Layer 1: 原图 (上半部分) ==================== -->
    <div ref="originalRef" class="rr-original">
      <img :src="sceneSrc" class="rr-img" crossorigin="anonymous" />
    </div>

    <!-- ==================== Layer 2: 水面交界线 ==================== -->
    <div ref="boundaryWrapRef" class="rr-boundary-wrap">
      <svg class="rr-boundary-svg" viewBox="0 0 1200 40" preserveAspectRatio="none">
        <path
          ref="boundaryPathRef"
          class="rr-boundary-path"
          d="M0,20 Q150,18 300,22 T600,20 T900,18 T1200,20"
          fill="none"
          stroke="rgba(200,225,255,0.6)"
          stroke-width="1.5"
          filter="url(#rr-boundary-glow)"
        />
        <path
          class="rr-boundary-path-2"
          d="M0,20 Q150,18 300,22 T600,20 T900,18 T1200,20"
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          stroke-width="0.8"
        />
      </svg>
    </div>

    <!-- ==================== Layer 3: 倒影图 (垂直翻转, 下半部分) ==================== -->
    <!-- 倒影容器：filter 应用水波纹 -->
    <div ref="reflectionWrapRef" class="rr-reflection-wrap">
      <div class="rr-reflection-img-wrapper">
        <img :src="sceneSrc" class="rr-img rr-img-reflection" crossorigin="anonymous" />
      </div>
      <!-- 倒影渐变遮罩层 -->
      <div class="rr-reflection-mask"></div>
    </div>

    <!-- ==================== Layer 4: 动态水面光斑 Canvas ==================== -->
    <canvas ref="lightSpotsCanvasRef" class="rr-lightspots"></canvas>

    <!-- ==================== Layer 5: 涟漪扩散 Canvas ==================== -->
    <canvas ref="rippleCanvasRef" class="rr-ripple"></canvas>

    <!-- ==================== Layer 6: 水面雾气层 ==================== -->
    <div ref="mistRef" class="rr-mist"></div>

    <!-- ==================== 信息面板 ==================== -->
    <div ref="infoRef" class="rr-info">
      <span class="rr-info-label">REFLECTION RIPPLE</span>
      <h2 class="rr-info-title">倒影涟漪幻境</h2>
      <div class="rr-info-divider"></div>
      <span class="rr-info-specs">
        波纹强度 {{ rippleIntensity }}% · 涟漪 {{ activeRipples }} · 光斑 {{ spotCount }}
      </span>
    </div>

    <!-- ==================== 进度条 ==================== -->
    <div ref="progressRef" class="rr-progress">
      <div ref="progressBarRef" class="rr-progress-bar"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ======== 类型 ========
type TweenCleanup = () => void

interface RippleCircle {
  x: number
  y: number
  radius: number
  maxRadius: number
  opacity: number
  speed: number
}

interface LightSpot {
  x: number
  y: number
  radius: number
  baseRadius: number
  opacity: number
  baseOpacity: number
  phase: number
  speed: number
  flickerSpeed: number
}

// ======== 模板引用 ========
const parentRef = ref<HTMLElement | null>(null)
const originalRef = ref<HTMLElement | null>(null)
const boundaryWrapRef = ref<HTMLElement | null>(null)
const boundaryPathRef = ref<SVGPathElement | null>(null)
const reflectionWrapRef = ref<HTMLElement | null>(null)
const lightSpotsCanvasRef = ref<HTMLCanvasElement | null>(null)
const rippleCanvasRef = ref<HTMLCanvasElement | null>(null)
const mistRef = ref<HTMLElement | null>(null)
const infoRef = ref<HTMLElement | null>(null)
const progressRef = ref<HTMLElement | null>(null)
const progressBarRef = ref<HTMLElement | null>(null)

// ======== 响应式状态 ========
const rippleIntensity = ref(0)
const activeRipples = ref(0)
const spotCount = ref(20)

const cleanupFns: TweenCleanup[] = []

// ======== 图片资源 ========
const sceneSrc = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&q=80'

// ======== 水波配置 ========
const MAX_RIPPLE_SCALE = 18 // feDisplacementMap 最大 scale
const WAVE_FREQ_BASE = 0.012

// ======== 涟漪系统 ========
let ripples: RippleCircle[] = []
let rippleAnimId = 0

// ======== 光斑系统 ========
let lightSpots: LightSpot[] = []
let spotAnimId = 0
let canvasW = 0
let canvasH = 0

// 初始化光斑粒子
const initLightSpots = () => {
  lightSpots = []
  const count = 28
  const hHalf = canvasH / 2
  for (let i = 0; i < count; i++) {
    lightSpots.push({
      x: Math.random() * canvasW,
      y: hHalf + Math.random() * hHalf * 0.7, // 只在下半（水面以下）
      radius: 0.8 + Math.random() * 2.5,
      baseRadius: 0.8 + Math.random() * 2.5,
      opacity: 0.15 + Math.random() * 0.35,
      baseOpacity: 0.15 + Math.random() * 0.35,
      phase: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 0.7,
      flickerSpeed: 0.02 + Math.random() * 0.06,
    })
  }
}

// 渲染光斑
const renderLightSpots = (intensity: number) => {
  const canvas = lightSpotsCanvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, canvasW, canvasH)

  for (const spot of lightSpots) {
    spot.phase += spot.flickerSpeed
    const flicker = 0.5 + 0.5 * Math.sin(spot.phase)
    const r = spot.baseRadius * (0.7 + flicker * 0.3) * (0.3 + intensity * 0.7)
    const alpha = spot.baseOpacity * flicker * (0.15 + intensity * 0.85)

    if (r < 0.3 || alpha < 0.005) continue

    ctx.beginPath()
    ctx.arc(spot.x, spot.y, r, 0, Math.PI * 2)

    // 暖白色光斑
    const g = ctx.createRadialGradient(spot.x, spot.y, 0, spot.x, spot.y, r * 2.5)
    g.addColorStop(0, `rgba(255,255,250,${alpha})`)
    g.addColorStop(0.4, `rgba(255,255,240,${alpha * 0.6})`)
    g.addColorStop(1, 'rgba(255,255,240,0)')
    ctx.fillStyle = g
    ctx.fill()
  }
}

// 渲染涟漪
const renderRipples = () => {
  const canvas = rippleCanvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, canvasW, canvasH)

  // 过滤掉已完成的涟漪
  ripples = ripples.filter((r) => r.opacity > 0.005)

  for (const r of ripples) {
    r.radius += r.speed
    r.opacity -= 0.012

    if (r.opacity <= 0) continue

    // 主圆环
    ctx.beginPath()
    ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(200,230,255,${r.opacity})`
    ctx.lineWidth = 1.5 * r.opacity
    ctx.stroke()

    // 第二圈（外圈）
    const r2 = r.radius * 1.4
    if (r2 < r.maxRadius) {
      ctx.beginPath()
      ctx.arc(r.x, r.y, r2, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(200,230,255,${r.opacity * 0.4})`
      ctx.lineWidth = 1 * r.opacity
      ctx.stroke()
    }

    // 发光光晕
    const glow = ctx.createRadialGradient(r.x, r.y, r.radius * 0.85, r.x, r.y, r.radius * 1.15)
    glow.addColorStop(0, `rgba(200,230,255,${r.opacity * 0.08})`)
    glow.addColorStop(1, 'rgba(200,230,255,0)')
    ctx.beginPath()
    ctx.arc(r.x, r.y, r.radius * 1.2, 0, Math.PI * 2)
    ctx.fillStyle = glow
    ctx.fill()
  }

  activeRipples.value = ripples.length
}

// 循环渲染涟漪
const loopRipple = () => {
  renderRipples()
  rippleAnimId = requestAnimationFrame(loopRipple)
}

// 点击产生涟漪
const handleClick = (e: MouseEvent) => {
  const rect = parentRef.value?.getBoundingClientRect()
  if (!rect) return
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  // 生成 2-3 圈涟漪
  const count = 2 + Math.floor(Math.random() * 2)
  for (let i = 0; i < count; i++) {
    const delay = i * 80
    setTimeout(() => {
      ripples.push({
        x,
        y,
        radius: 4,
        maxRadius: 120 + Math.random() * 80,
        opacity: 0.75 - i * 0.2,
        speed: 2.5 + Math.random() * 2.5,
      })
      activeRipples.value = ripples.length
    }, delay)
  }
}

// ======== 动态水面交界线 ========
const updateBoundaryWave = (p: number) => {
  const path = boundaryPathRef.value
  if (!path) return

  // 动态波浪路径：波纹强度随滚动增强
  const amp = 2 + p * 8 // 振幅 2→10
  const freq = 1.5 + p * 2.5
  const points: string[] = []
  const segments = 12

  for (let i = 0; i <= segments; i++) {
    const sx = (i / segments) * 1200
    const wave = Math.sin((i / segments) * Math.PI * freq + p * 8) * amp
      + Math.sin((i / segments) * Math.PI * freq * 2.3 + p * 12) * amp * 0.4
    const sy = 20 + wave
    points.push(`${sx},${sy}`)
  }

  // 平滑二次贝塞尔曲线
  let d = `M${points[0]}`
  for (let i = 1; i < points.length; i++) {
    const [px, py] = points[i - 1].split(',').map(Number)
    const [cx, cy] = points[i].split(',').map(Number)
    const cpx = (px + cx) / 2
    const cpy = (py + cy) / 2
    d += ` Q${px},${py} ${cpx},${cpy}`
  }
  path.setAttribute('d', d)

  // 更新第二条线（微偏移）
  const path2 = document.querySelector<SVGPathElement>('.rr-boundary-path-2')
  if (path2) {
    const points2: string[] = []
    for (let i = 0; i <= segments; i++) {
      const sx = (i / segments) * 1200
      const wave = Math.sin((i / segments) * Math.PI * (freq * 1.7) + p * 10 + 1) * amp * 0.6
      const sy = 20 + wave
      points2.push(`${sx},${sy}`)
    }
    let d2 = `M${points2[0]}`
    for (let i = 1; i < points2.length; i++) {
      const [px, py] = points2[i - 1].split(',').map(Number)
      const [cx, cy] = points2[i].split(',').map(Number)
      d2 += ` Q${px},${py} ${(px + cx) / 2},${(py + cy) / 2}`
    }
    path2.setAttribute('d', d2)
  }
}

// ======== 初始化 ========
onMounted(() => {
  if (!parentRef.value) return
  requestAnimationFrame(() => setup())
})

const setup = () => {
  const container = parentRef.value
  if (!container) return

  // ===== Canvas 尺寸 =====
  canvasW = window.innerWidth
  canvasH = window.innerHeight

  const lsCanvas = lightSpotsCanvasRef.value
  if (lsCanvas) {
    lsCanvas.width = canvasW
    lsCanvas.height = canvasH
  }
  const rCanvas = rippleCanvasRef.value
  if (rCanvas) {
    rCanvas.width = canvasW
    rCanvas.height = canvasH
  }

  // 初始化光斑
  initLightSpots()

  // 启动光斑渲染循环
  let currentIntensity = 0
  renderLightSpots(currentIntensity)
  spotAnimId = window.setInterval(() => {
    renderLightSpots(currentIntensity)
  }, 50)

  // 启动涟漪渲染循环
  loopRipple()

  // ===== 初始状态 =====
  gsap.set(originalRef.value, { opacity: 0.95 })
  gsap.set(reflectionWrapRef.value, { opacity: 0.15 })

  // 水面交界线初始
  updateBoundaryWave(0)
  gsap.set(boundaryWrapRef.value, { opacity: 0.25 })

  // 初始 feDisplacementMap scale = 0
  const dispMap = document.getElementById('rr-displacement')
  if (dispMap) dispMap.setAttribute('scale', '0')

  // 雾气初始
  gsap.set(mistRef.value, { opacity: 0.4 })
  gsap.set(infoRef.value, { opacity: 0, y: 15 })
  gsap.set(progressBarRef.value, { width: '0%' })

  rippleIntensity.value = 0
  spotCount.value = 28

  // ===== 主时间线 =====
  const mainTl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top 85%',
      end: 'bottom 15%',
      scrub: 1.2,
    },
  })

  // ===== 核心：onUpdate 每帧更新水波 + 倒影 =====
  mainTl.to(
    {},
    {
      duration: 1,
      onUpdate: () => {
        const p = mainTl.progress() // 0 → 1

        currentIntensity = p

        // --- 水波扭曲强度：0 → MAX_RIPPLE_SCALE ---
        const dispScale = MAX_RIPPLE_SCALE * (p * p * (3 - 2 * p))
        const dispMap = document.getElementById('rr-displacement')
        if (dispMap) dispMap.setAttribute('scale', String(dispScale))

        // --- 动态更新 turbulence 频率 ---
        const turbEl = document.getElementById('rr-turbulence')
        if (turbEl) {
          const baseFreqX = WAVE_FREQ_BASE + p * 0.006
          const baseFreqY = 0.06 + p * 0.09
          turbEl.setAttribute('baseFrequency', `${baseFreqX} ${baseFreqY}`)
        }

        // --- 倒影透明度：随水波增强 ---
        const refEl = reflectionWrapRef.value
        if (refEl) {
          refEl.style.opacity = String(0.15 + p * 0.55)
        }

        // --- 水面交界线动态波浪 ---
        updateBoundaryWave(p)

        // --- 交界线透明度 ---
        const bwEl = boundaryWrapRef.value
        if (bwEl) {
          bwEl.style.opacity = String(0.25 + p * 0.65)
        }

        // --- 原图亮度微调：水波强时原图稍暗 ---
        const origEl = originalRef.value
        if (origEl) {
          origEl.style.filter = `brightness(${0.95 - p * 0.1})`
        }

        // --- 倒影水平微晃 ---
        const refImgWrapper = container.querySelector<HTMLElement>('.rr-reflection-img-wrapper')
        if (refImgWrapper) {
          const sway = Math.sin(p * 18) * (1 + p * 2)
          refImgWrapper.style.transform = `scaleY(-1) translateX(${sway}px)`
        }

        // --- 雾气淡出 ---
        const mistEl = mistRef.value
        if (mistEl) {
          mistEl.style.opacity = String(0.4 - p * 0.25)
        }

        // 更新响应式数据
        rippleIntensity.value = Math.round(p * 100)
      },
    },
    0,
  )

  // ===== 信息面板入场 =====
  mainTl.to(infoRef.value, { opacity: 1, y: 0, duration: 0.1, ease: 'power2.out' }, 0.05)

  // ===== 进度条 =====
  mainTl.to(progressBarRef.value, { width: '100%', duration: 0.98, ease: 'none' }, 0.01)

  cleanupFns.push(() => {
    mainTl.scrollTrigger?.kill()
    mainTl.kill()
  })
}

// ======== 窗口缩放 ========
let resizeTimeout: number | null = null
const handleResize = () => {
  if (resizeTimeout) clearTimeout(resizeTimeout)
  resizeTimeout = window.setTimeout(() => {
    canvasW = window.innerWidth
    canvasH = window.innerHeight

    const lsCanvas = lightSpotsCanvasRef.value
    if (lsCanvas) {
      lsCanvas.width = canvasW
      lsCanvas.height = canvasH
    }
    const rCanvas = rippleCanvasRef.value
    if (rCanvas) {
      rCanvas.width = canvasW
      rCanvas.height = canvasH
    }

    initLightSpots()
    renderLightSpots(0)
    spotCount.value = lightSpots.length
  }, 300)
}

window.addEventListener('resize', handleResize)

onUnmounted(() => {
  if (resizeTimeout) clearTimeout(resizeTimeout)
  window.removeEventListener('resize', handleResize)

  if (rippleAnimId) cancelAnimationFrame(rippleAnimId)
  if (spotAnimId) clearInterval(spotAnimId)

  cleanupFns.forEach((fn) => fn())
})
</script>

<style lang="scss" scoped>
/* ==================== 容器 ==================== */
.rr-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #060e18;
  cursor: pointer;
}

/* ==================== SVG 隐藏定义 ==================== */
.rr-svg-defs {
  position: absolute;
  width: 0;
  height: 0;
  pointer-events: none;
}

/* ==================== Layer 1: 原图（上半部分） ==================== */
.rr-original {
  position: absolute;
  inset: 0 0 50% 0; /* 只占上半 */
  z-index: 1;
  overflow: hidden;
}

.rr-img {
  width: 100vw;
  height: 100vh;
  object-fit: cover;
}

/* ==================== Layer 2: 水面交界线 ==================== */
.rr-boundary-wrap {
  position: absolute;
  left: 0;
  right: 0;
  top: 48%;
  z-index: 10;
  pointer-events: none;
  height: 80px;
  transform: translateY(-50%);
}

.rr-boundary-svg {
  width: 100%;
  height: 100%;
}

.rr-boundary-path {
  filter: drop-shadow(0 0 6px rgba(120,180,255,0.5));
}

.rr-boundary-path-2 {
  filter: drop-shadow(0 0 3px rgba(255,255,255,0.3));
}

/* ==================== Layer 3: 倒影图（下半部分） ==================== */
.rr-reflection-wrap {
  position: absolute;
  inset: 50% 0 0 0; /* 只占下半 */
  z-index: 2;
  overflow: hidden;
  filter: url(#rr-ripple-distort);
}

.rr-reflection-img-wrapper {
  width: 100%;
  height: 100%;
  transform-origin: center center;
  will-change: transform;
}

.rr-img-reflection {
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  transform: scaleY(-1);
  /* 倒影整体稍暗 */
  opacity: 0.7;
}

/* 倒影渐变遮罩：从透明到深色 */
.rr-reflection-mask {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(6,14,24,0.6) 0%,
    rgba(6,14,24,0.3) 15%,
    rgba(6,14,24,0.6) 55%,
    rgba(6,14,24,0.9) 100%
  );
  pointer-events: none;
}

/* ==================== Layer 4: 水面光斑 Canvas ==================== */
.rr-lightspots {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  pointer-events: none;
  mix-blend-mode: screen;
}

/* ==================== Layer 5: 涟漪扩散 Canvas ==================== */
.rr-ripple {
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;
}

/* ==================== Layer 6: 水面雾气 ==================== */
.rr-mist {
  position: absolute;
  inset: 60% 0 0 0;
  z-index: 4;
  pointer-events: none;
  background: linear-gradient(
    to bottom,
    rgba(180,200,220,0) 0%,
    rgba(180,200,220,0.06) 30%,
    rgba(200,215,235,0.12) 70%,
    rgba(210,220,240,0.18) 100%
  );
  backdrop-filter: blur(3px);
}

/* ==================== 信息面板 ==================== */
.rr-info {
  position: absolute;
  left: 32px;
  bottom: 40px;
  z-index: 12;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.rr-info-label {
  font-family: 'Courier New', monospace;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 4px;
  color: rgba(200,225,255,0.55);
}

.rr-info-title {
  margin: 0;
  font-size: 26px;
  font-weight: 700;
  letter-spacing: 2px;
  color: rgba(220,240,255,0.9);
  text-shadow: 0 0 20px rgba(150,200,255,0.2);
}

.rr-info-divider {
  width: 40px;
  height: 2px;
  background: linear-gradient(90deg, rgba(150,200,255,0.7), rgba(120,200,255,0.4));
}

.rr-info-specs {
  font-family: 'Courier New', monospace;
  font-size: 10px;
  color: rgba(180,210,240,0.5);
  letter-spacing: 1px;
}

/* ==================== 进度条 ==================== */
.rr-progress {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 20;
  height: 3px;
  background: rgba(150,200,255,0.08);
}

.rr-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, rgba(120,180,255,0.6) 0%, rgba(100,200,255,0.9) 50%, rgba(80,220,255,0.6) 100%);
}
</style>
