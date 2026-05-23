<template>
  <section ref="parentRef" class="mt-container">
    <!-- ==================== SVG 滤镜定义 ==================== -->
    <svg class="mt-svg-defs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 800" aria-hidden="true">
      <defs>
        <!-- === 液态波纹扭曲滤镜 === -->
        <filter id="morph-liquid" x="-10%" y="-10%" width="120%" height="120%"
          color-interpolation-filters="sRGB">
          <!-- 湍流噪声：模拟液体表面波动 -->
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.015 0.025"
            numOctaves="4"
            seed="7"
            result="turbulence"
          >
            <!-- baseFrequency 由 GSAP 动态控制 -->
            <animate
              attributeName="baseFrequency"
              values="0.015 0.025;0.04 0.06;0.015 0.025"
              dur="8s"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <!-- 位移映射：用噪声扭曲图像 -->
          <feDisplacementMap
            in="SourceGraphic"
            in2="turbulence"
            scale="0"
            xChannelSelector="R"
            yChannelSelector="G"
            class="mt-disp-map"
          />
        </filter>

        <!-- === 涟漪扩散遮罩 === -->
        <radialGradient id="ripple-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="rgba(255,255,255,0.15)">
            <animate attributeName="stop-color"
              values="rgba(255,255,255,0.15);rgba(255,255,255,0.35);rgba(255,255,255,0.15)"
              dur="3s" repeatCount="indefinite" />
          </stop>
          <stop offset="70%" stop-color="rgba(255,255,255,0.03)" />
          <stop offset="100%" stop-color="rgba(255,255,255,0)" />
        </radialGradient>

        <!-- === 暗角 === -->
        <radialGradient id="mt-vignette" cx="50%" cy="50%" r="70%">
          <stop offset="55%" stop-color="rgba(0,0,0,0)" />
          <stop offset="85%" stop-color="rgba(0,0,0,0.2)" />
          <stop offset="100%" stop-color="rgba(0,0,0,0.55)" />
        </radialGradient>
      </defs>
    </svg>

    <!-- ==================== 隐藏：图片 A 预加载 ==================== -->
    <img ref="imgARef" :src="imageAUrl" class="mt-hidden-img" crossorigin="anonymous" />

    <!-- ==================== Layer 1+2: Canvas 网格变形（图片A → 变形 → 图片B） ==================== -->
    <canvas ref="renderCanvasRef" class="mt-render-canvas"></canvas>

    <!-- ==================== Layer 3: 图片 B 交叉淡化层 ==================== -->
    <div ref="layerBRef" class="mt-layer-b">
      <img :src="imageBUrl" alt="target" class="mt-img" />
    </div>

    <!-- ==================== Layer 4: 液态波纹遮罩 ==================== -->
    <div ref="rippleRef" class="mt-ripple-layer">
      <svg class="mt-ripple-svg" viewBox="0 0 1000 800" preserveAspectRatio="xMidYMid slice">
        <rect width="1000" height="800" fill="url(#ripple-gradient)" opacity="0.5" />
        <!-- 同心涟漪圆 -->
        <circle cx="500" cy="400" r="250" fill="none" stroke="rgba(255,255,255,0.25)"
          stroke-width="2" class="mt-ripple-circle mt-ripple-c1" />
        <circle cx="500" cy="400" r="450" fill="none" stroke="rgba(255,255,255,0.15)"
          stroke-width="1.5" class="mt-ripple-circle mt-ripple-c2" />
      </svg>
    </div>

    <!-- ==================== 网格顶点可视化层 ==================== -->
    <canvas ref="gridCanvasRef" class="mt-grid-canvas"></canvas>

    <!-- ==================== 暗角 ==================== -->
    <div class="mt-vignette"></div>

    <!-- ==================== 文字信息 ==================== -->
    <div ref="infoRef" class="mt-info">
      <span class="mt-info-label">MORPH TRANSITION</span>
      <h2 class="mt-info-title">变形转场</h2>
      <p class="mt-info-sub">Mesh Warp · Liquid · Crossfade</p>
      <div class="mt-info-divider"></div>
      <p class="mt-info-desc">{{ morphPercent }}% 变形进度</p>
    </div>

    <!-- ==================== 顶点计数器 ==================== -->
    <div ref="statsRef" class="mt-stats">
      <span>VERTICES: 121</span>
      <span>QUADS: 100</span>
    </div>

    <!-- ==================== 进度指示器 ==================== -->
    <div ref="progressRef" class="mt-progress">
      <div ref="progressBarRef" class="mt-progress-bar"></div>
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

interface Vertex {
  x: number
  y: number
}

// ======== 模板引用 ========
const parentRef = ref<HTMLElement | null>(null)
const imgARef = ref<HTMLImageElement | null>(null)
const renderCanvasRef = ref<HTMLCanvasElement | null>(null)
const gridCanvasRef = ref<HTMLCanvasElement | null>(null)
const layerBRef = ref<HTMLElement | null>(null)
const rippleRef = ref<HTMLElement | null>(null)
const infoRef = ref<HTMLElement | null>(null)
const statsRef = ref<HTMLElement | null>(null)
const progressRef = ref<HTMLElement | null>(null)
const progressBarRef = ref<HTMLElement | null>(null)

const morphPercent = ref(0)
const cleanupFns: TweenCleanup[] = []

// ======== 图片资源 ========
// 图A（起始）：山脉湖泊
const imageAUrl = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80'
// 图B（目标）：海岸灯塔
const imageBUrl = 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1920&q=80'

// ======== 网格参数 ========
const GRID_COLS = 10
const GRID_ROWS = 10
// 顶点数组：11×11 = 121 个
const identVertices: Vertex[] = []
const warpedVertices: Vertex[] = []

// Canvas 尺寸
let canvasW = 0
let canvasH = 0

// 图片 A 已加载
let imageA: HTMLImageElement | null = null

// ======== 构建标识顶点（均匀网格） ========
const buildIdentityVertices = (w: number, h: number) => {
  identVertices.length = 0
  for (let row = 0; row <= GRID_ROWS; row++) {
    for (let col = 0; col <= GRID_COLS; col++) {
      identVertices.push({
        x: (col / GRID_COLS) * w,
        y: (row / GRID_ROWS) * h,
      })
    }
  }
}

// ======== 构建变形目标顶点 ========
const buildWarpedVertices = (w: number, h: number, seed: number = 42) => {
  // 简易 PRNG
  let s = seed
  const rand = () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }

  warpedVertices.length = 0
  const cx = w / 2
  const cy = h / 2

  for (let row = 0; row <= GRID_ROWS; row++) {
    for (let col = 0; col <= GRID_COLS; col++) {
      // 基础标识位置
      const ix = (col / GRID_COLS) * w
      const iy = (row / GRID_ROWS) * h

      // 距中心的归一化距离
      const dx = (ix - cx) / cx
      const dy = (iy - cy) / cy
      const dist = Math.sqrt(dx * dx + dy * dy)

      // === 多频率位移叠加 ===
      // 低频大波浪
      const waveAmpX = 0.12 * w
      const waveAmpY = 0.08 * h
      const waveX = Math.sin(dy * 3.5 + 0.7) * Math.cos(dx * 2.1 - 0.3) * waveAmpX
      const waveY = Math.cos(dx * 2.8 + 1.2) * Math.sin(dy * 3.1 - 0.5) * waveAmpY

      // 中频湍流
      const turbAmp = 0.06 * w
      const turbX = rand() * turbAmp * 2 - turbAmp
      const turbY = rand() * turbAmp * 2 - turbAmp

      // 漩涡效应（越靠近中心越强）
      const vortexStrength = Math.max(0, 1 - dist * 1.3)
      const vortexAngle = Math.atan2(dy, dx) + 1.8
      const vortexX = Math.cos(vortexAngle) * vortexStrength * 0.15 * w
      const vortexY = Math.sin(vortexAngle) * vortexStrength * 0.15 * h

      // 边缘拉伸：四角向外拉
      const edgeStrength = Math.pow(dist, 1.5)
      const edgeX = dx * edgeStrength * 0.08 * w
      const edgeY = dy * edgeStrength * 0.08 * h

      warpedVertices.push({
        x: ix + waveX + turbX + vortexX + edgeX,
        y: iy + waveY + turbY + vortexY + edgeY,
      })
    }
  }
}

// ======== 渲染网格变形 ========
let renderRafId = 0

const renderMeshFrame = (progress: number) => {
  const canvas = renderCanvasRef.value
  if (!canvas || !imageA) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const w = canvasW
  const h = canvasH

  // 清空画布
  ctx.clearRect(0, 0, w, h)

  // 对每个 quad 进行渲染
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      // 获取 4 个角的索引
      const tlIdx = row * (GRID_COLS + 1) + col
      const trIdx = tlIdx + 1
      const blIdx = (row + 1) * (GRID_COLS + 1) + col
      const brIdx = blIdx + 1

      // 插值：identity → warped
      const lerp = (a: number, b: number, t: number) => a + (b - a) * t

      const tl = {
        x: lerp(identVertices[tlIdx].x, warpedVertices[tlIdx].x, progress),
        y: lerp(identVertices[tlIdx].y, warpedVertices[tlIdx].y, progress),
      }
      const tr = {
        x: lerp(identVertices[trIdx].x, warpedVertices[trIdx].x, progress),
        y: lerp(identVertices[trIdx].y, warpedVertices[trIdx].y, progress),
      }
      const bl = {
        x: lerp(identVertices[blIdx].x, warpedVertices[blIdx].x, progress),
        y: lerp(identVertices[blIdx].y, warpedVertices[blIdx].y, progress),
      }
      const br = {
        x: lerp(identVertices[brIdx].x, warpedVertices[brIdx].x, progress),
        y: lerp(identVertices[brIdx].y, warpedVertices[brIdx].y, progress),
      }

      // 计算源图区域
      const srcX = identVertices[tlIdx].x
      const srcY = identVertices[tlIdx].y
      const srcW = identVertices[trIdx].x - srcX
      const srcH = identVertices[blIdx].y - srcY

      // 画出变形 quad 的路径
      ctx.save()
      ctx.beginPath()
      ctx.moveTo(tl.x, tl.y)
      ctx.lineTo(tr.x, tr.y)
      ctx.lineTo(br.x, br.y)
      ctx.lineTo(bl.x, bl.y)
      ctx.closePath()
      ctx.clip()

      // 计算近似变换矩阵（用简单的矩形映射 + 位移）
      const avgX = (tl.x + tr.x + bl.x + br.x) / 4
      const avgY = (tl.y + tr.y + bl.y + br.y) / 4
      const scaleW = ((tr.x - tl.x) + (br.x - bl.x)) / 2 / srcW
      const scaleH = ((bl.y - tl.y) + (br.y - tr.y)) / 2 / srcH

      ctx.translate(avgX, avgY)
      ctx.scale(Math.abs(scaleW || 1), Math.abs(scaleH || 1))
      ctx.translate(-srcX - srcW / 2, -srcY - srcH / 2)

      // 绘制图像片段
      ctx.drawImage(
        imageA,
        srcX, srcY, srcW, srcH,
        srcX, srcY, srcW, srcH,
      )

      ctx.restore()
    }
  }

  // 同时绘制到网格可视化 Canvas
  drawGridOverlay(progress)
}

// ======== 网格线可视化 ========
const drawGridOverlay = (progress: number) => {
  const canvas = gridCanvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const w = canvasW
  const h = canvasH
  ctx.clearRect(0, 0, w, h)

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t

  // 生成插值后的顶点
  const currentVerts: Vertex[] = []
  for (let i = 0; i < identVertices.length; i++) {
    currentVerts.push({
      x: lerp(identVertices[i].x, warpedVertices[i].x, progress),
      y: lerp(identVertices[i].y, warpedVertices[i].y, progress),
    })
  }

  const rowStride = GRID_COLS + 1
  const alpha = 0.18 + progress * 0.35

  // 水平线
  for (let row = 0; row <= GRID_ROWS; row++) {
    ctx.beginPath()
    for (let col = 0; col <= GRID_COLS; col++) {
      const v = currentVerts[row * rowStride + col]
      if (col === 0) ctx.moveTo(v.x, v.y)
      else ctx.lineTo(v.x, v.y)
    }
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`
    ctx.lineWidth = 0.8
    ctx.stroke()
  }

  // 竖直线
  for (let col = 0; col <= GRID_COLS; col++) {
    ctx.beginPath()
    for (let row = 0; row <= GRID_ROWS; row++) {
      const v = currentVerts[row * rowStride + col]
      if (row === 0) ctx.moveTo(v.x, v.y)
      else ctx.lineTo(v.x, v.y)
    }
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`
    ctx.lineWidth = 0.8
    ctx.stroke()
  }

  // 顶点圆点
  if (progress > 0.1) {
    const dotAlpha = Math.min(1, progress * 1.5) * 0.7
    for (let i = 0; i < currentVerts.length; i++) {
      const v = currentVerts[i]
      ctx.beginPath()
      ctx.arc(v.x, v.y, 3 * progress, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255, 255, 255, ${dotAlpha})`
      ctx.fill()
    }
  }
}

// ======== 初始化 ========
onMounted(() => {
  // 预加载图片 A
  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.src = imageAUrl
  img.onload = () => {
    imageA = img
    requestAnimationFrame(() => initCanvases())
  }
})

const initCanvases = () => {
  if (!imageA) return

  const maxW = 1400
  const ratio = imageA.naturalHeight / imageA.naturalWidth
  canvasW = Math.min(maxW, window.innerWidth)
  canvasH = Math.round(canvasW * ratio)

  // 构建顶点
  buildIdentityVertices(canvasW, canvasH)
  buildWarpedVertices(canvasW, canvasH)

  // 设置 Canvas 尺寸
  const rCanvas = renderCanvasRef.value
  const gCanvas = gridCanvasRef.value
  if (rCanvas) {
    rCanvas.width = canvasW
    rCanvas.height = canvasH
  }
  if (gCanvas) {
    gCanvas.width = canvasW
    gCanvas.height = canvasH
  }

  // 初始渲染（progress=0：identity 状态）
  renderMeshFrame(0)

  // 启动 GSAP
  setupTimeline()
}

// ======== GSAP 时间线 ========
const setupTimeline = () => {
  const container = parentRef.value
  if (!container) return

  // 初始状态
  gsap.set(layerBRef.value, { opacity: 0 })
  gsap.set(rippleRef.value, { opacity: 0.2 })
  gsap.set(infoRef.value, { opacity: 0, y: 30 })
  gsap.set(statsRef.value, { opacity: 0, x: 20 })
  gsap.set(progressBarRef.value, { width: '0%' })

  // SVG displacement 初始 scale=0
  const dispMapEl = container.querySelector('.mt-disp-map') as SVGElement
  if (dispMapEl) {
    dispMapEl.setAttribute('scale', '0')
  }

  const mainTl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top 85%',
      end: 'bottom 15%',
      scrub: 1.2,
    },
  })

  // 阶段1 (0-15%): 微形变，网格渐显，液体涟漪开始
  mainTl.to(
    {},
    {
      duration: 0.15,
      onUpdate: () => {
        const p = mainTl.progress()
        const mapped = gsap.utils.mapRange(0, 0.15, 0, 0.08)
        morphPercent.value = Math.round(mapped(p) * 100)
        renderMeshFrame(mapped(p))
      },
    },
    0,
  )

  // 增加 displacement scale
  mainTl.to(
    {},
    {
      duration: 0.15,
      onUpdate: () => {
        const p = mainTl.progress()
        const scale = gsap.utils.mapRange(0, 0.15, 0, 12)
        if (dispMapEl) dispMapEl.setAttribute('scale', String(Math.round(scale(p))))
      },
    },
    0,
  )

  // 波纹层增强
  mainTl.to(rippleRef.value, { opacity: 0.45, duration: 0.12 }, 0)

  // 阶段2 (15-50%): 加速变形，网格清晰，液体效果峰期
  mainTl.to(
    {},
    {
      duration: 0.35,
      onUpdate: () => {
        const p = mainTl.progress()
        const mapped = gsap.utils.mapRange(0.15, 0.5, 0.08, 0.65)
        morphPercent.value = Math.round(mapped(p) * 100)
        renderMeshFrame(mapped(p))
      },
    },
    0.15,
  )

  // displacement 峰值
  mainTl.to(
    {},
    {
      duration: 0.35,
      onUpdate: () => {
        const p = mainTl.progress()
        const scale = gsap.utils.mapRange(0.15, 0.5, 12, 40)
        if (dispMapEl) dispMapEl.setAttribute('scale', String(Math.round(scale(p))))
      },
    },
    0.15,
  )

  // 阶段3 (40-65%): 图片B开始淡入（交叉淡化）
  mainTl.to(layerBRef.value, { opacity: 0, duration: 0.01 }, 0)
  mainTl.to(layerBRef.value, { opacity: 0.15, duration: 0.1 }, 0.4)
  mainTl.to(layerBRef.value, { opacity: 0.55, duration: 0.15, ease: 'power2.in' }, 0.5)
  mainTl.to(layerBRef.value, { opacity: 0.85, duration: 0.1, ease: 'power2.out' }, 0.65)

  // 阶段4 (50-80%): 变形到达峰值后开始收缩
  mainTl.to(
    {},
    {
      duration: 0.3,
      onUpdate: () => {
        const p = mainTl.progress()
        const mapped = gsap.utils.mapRange(0.5, 0.8, 0.65, 0.95)
        morphPercent.value = Math.round(mapped(p) * 100)
        renderMeshFrame(mapped(p))
      },
    },
    0.5,
  )

  // displacement 减弱（让图片B更清晰）
  mainTl.to(
    {},
    {
      duration: 0.3,
      onUpdate: () => {
        const p = mainTl.progress()
        const scale = gsap.utils.mapRange(0.5, 0.8, 40, 5)
        if (dispMapEl) dispMapEl.setAttribute('scale', String(Math.round(scale(p))))
      },
    },
    0.5,
  )

  // 波纹层减弱
  mainTl.to(rippleRef.value, { opacity: 0.12, duration: 0.25 }, 0.55)

  // 阶段5 (80-100%): 图片B完全呈现，变形收束，网格消退
  mainTl.to(
    {},
    {
      duration: 0.2,
      onUpdate: () => {
        const p = mainTl.progress()
        const mapped = gsap.utils.mapRange(0.8, 1, 0.95, 1.0)
        morphPercent.value = Math.round(mapped(p) * 100)
        renderMeshFrame(mapped(p))
      },
    },
    0.8,
  )

  // displacement 归零
  mainTl.to(
    {},
    {
      duration: 0.2,
      onUpdate: () => {
        const p = mainTl.progress()
        const scale = gsap.utils.mapRange(0.8, 1, 5, 0)
        if (dispMapEl) dispMapEl.setAttribute('scale', String(Math.round(scale(p))))
      },
    },
    0.8,
  )

  // B 完全呈现
  mainTl.to(layerBRef.value, { opacity: 1, duration: 0.1 }, 0.88)

  // 文字入场
  mainTl.to(infoRef.value, { opacity: 1, y: 0, duration: 0.1, ease: 'power2.out' }, 0.85)
  mainTl.to(statsRef.value, { opacity: 0.8, x: 0, duration: 0.08 }, 0.82)
  // 文字持续渐隐
  mainTl.to(infoRef.value, { opacity: 0.5, duration: 0.08 }, 0.93)
  mainTl.to(statsRef.value, { opacity: 0.2, duration: 0.06 }, 0.9)

  // 进度条
  mainTl.to(progressBarRef.value, { width: '100%', duration: 0.95, ease: 'none' }, 0)

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
    if (!imageA) return
    const maxW = 1400
    const ratio = imageA.naturalHeight / imageA.naturalWidth
    canvasW = Math.min(maxW, window.innerWidth)
    canvasH = Math.round(canvasW * ratio)

    buildIdentityVertices(canvasW, canvasH)
    buildWarpedVertices(canvasW, canvasH)

    const rCanvas = renderCanvasRef.value
    const gCanvas = gridCanvasRef.value
    if (rCanvas) { rCanvas.width = canvasW; rCanvas.height = canvasH }
    if (gCanvas) { gCanvas.width = canvasW; gCanvas.height = canvasH }

    renderMeshFrame(morphPercent.value / 100)
  }, 300)
}

// ======== 生命周期 ========
window.addEventListener('resize', handleResize)

onUnmounted(() => {
  if (renderRafId) cancelAnimationFrame(renderRafId)
  if (resizeTimeout) clearTimeout(resizeTimeout)
  window.removeEventListener('resize', handleResize)
  cleanupFns.forEach((fn) => fn())
})
</script>

<style lang="scss" scoped>
/* ==================== 容器 ==================== */
.mt-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #08080c;
}

/* ==================== SVG 隐藏定义 ==================== */
.mt-svg-defs {
  position: absolute;
  width: 0;
  height: 0;
  pointer-events: none;
  z-index: 0;
}

/* ==================== 隐藏图片预加载 ==================== */
.mt-hidden-img {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
}

/* ==================== Canvas 渲染层 ==================== */
.mt-render-canvas {
  position: absolute;
  inset: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: url(#morph-liquid);
}

/* ==================== Layer 3: 图片 B 交叉淡化 ==================== */
.mt-layer-b {
  position: absolute;
  inset: 0;
  z-index: 2;
  will-change: opacity;
}

.mt-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* ==================== Layer 4: 液态波纹遮罩 ==================== */
.mt-ripple-layer {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  will-change: opacity;
}

.mt-ripple-svg {
  width: 100%;
  height: 100%;
}

.mt-ripple-circle {
  transform-origin: center;
  animation: ripple-expand 3s ease-out infinite;
}

.mt-ripple-c1 {
  animation-delay: 0s;
}

.mt-ripple-c2 {
  animation-delay: 1.5s;
}

@keyframes ripple-expand {
  0% {
    opacity: 0.5;
    transform: scale(0.3);
  }
  60% {
    opacity: 0.15;
  }
  100% {
    opacity: 0;
    transform: scale(1.8);
  }
}

/* ==================== 网格可视化 Canvas ==================== */
.mt-grid-canvas {
  position: absolute;
  inset: 0;
  z-index: 4;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}

/* ==================== 暗角 ==================== */
.mt-vignette {
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;
  background: radial-gradient(
    ellipse at 50% 50%,
    transparent 55%,
    rgba(0, 0, 0, 0.2) 85%,
    rgba(0, 0, 0, 0.55) 100%
  );
}

/* ==================== 文字信息 ==================== */
.mt-info {
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 6;
  text-align: center;
  pointer-events: none;
  user-select: none;
  will-change: transform, opacity;
}

.mt-info-label {
  display: block;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.25em;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 8px;
}

.mt-info-title {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-size: 38px;
  font-weight: 800;
  color: #fff;
  margin: 0 0 6px;
  letter-spacing: -0.02em;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.5);
}

.mt-info-sub {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.4);
  margin: 0 0 12px;
  letter-spacing: 0.08em;
}

.mt-info-divider {
  width: 40px;
  height: 2px;
  background: linear-gradient(90deg,
    rgba(160, 120, 255, 0.6),
    rgba(80, 180, 255, 0.6));
  margin: 0 auto 12px;
  border-radius: 1px;
}

.mt-info-desc {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.45);
  margin: 0;
}

/* ==================== 顶点统计 ==================== */
.mt-stats {
  position: absolute;
  top: 24px;
  right: 24px;
  z-index: 6;
  pointer-events: none;
  user-select: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.5);
}

/* ==================== 进度指示器 ==================== */
.mt-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  z-index: 7;
  pointer-events: none;
}

.mt-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #a078ff, #50b4ff);
  width: 0%;
  will-change: width;
}

/* ==================== 响应式 ==================== */
@media (max-width: 768px) {
  .mt-info-title {
    font-size: 28px;
  }

  .mt-stats {
    top: 14px;
    right: 14px;
    font-size: 10px;
  }
}
</style>
