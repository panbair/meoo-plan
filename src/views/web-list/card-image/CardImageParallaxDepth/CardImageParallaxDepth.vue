<template>
  <section ref="parentRef" class="pd-container">
    <!-- ========== 隐藏处理 Canvas（深度图生成 & 图层提取） ========== -->
    <canvas ref="sourceCanvasRef" class="pd-hidden-canvas"></canvas>
    <canvas ref="depthMapCanvasRef" class="pd-hidden-canvas"></canvas>

    <!-- ========== 3D 视差场景 ========== -->
    <div ref="sceneRef" class="pd-scene">
      <div
        ref="cameraRef"
        class="pd-camera"
        :style="cameraStyle"
      >
        <!-- 5 个深度图层 -->
        <canvas
          v-for="(layer, i) in layerDefs"
          :key="`layer-${i}`"
          :ref="(el) => setLayerCanvas(el, i)"
          class="pd-layer-canvas"
          :style="{
            transform: `translateZ(${layer.z}px) scale(${layer.scale})`,
          }"
        ></canvas>
      </div>
    </div>

    <!-- ========== 暗角 ========== -->
    <div ref="vignetteRef" class="pd-vignette"></div>

    <!-- ========== 深度指示器图例 ========== -->
    <div ref="legendRef" class="pd-legend">
      <div class="pd-legend-label">DEPTH LAYERS</div>
      <div
        v-for="(layer, i) in layerDefs"
        :key="i"
        class="pd-legend-item"
        :class="{ active: activeLayer === i }"
      >
        <span class="pd-legend-dot" :style="{ background: layer.color }"></span>
        <span class="pd-legend-name">{{ layer.name }}</span>
        <span class="pd-legend-parallax">{{ (layer.parallax * 100).toFixed(0) }}%</span>
      </div>
    </div>

    <!-- ========== 文字信息 ========== -->
    <div ref="infoRef" class="pd-info">
      <span class="pd-label">PARALLAX DEPTH MAP</span>
      <h2 class="pd-title">视差深度图</h2>
      <p class="pd-subtitle">5-Layer · 3D Scene · Mouse Tilt</p>
      <div class="pd-divider"></div>
      <p class="pd-desc">深度分离 × 多层视差 × 3D 倾斜</p>
    </div>

    <!-- ========== 进度指示器 ========== -->
    <div ref="progressRef" class="pd-progress">
      <div ref="progressBarRef" class="pd-progress-bar"></div>
    </div>

    <!-- ========== 鼠标坐标指示 ========== -->
    <div ref="coordRef" class="pd-coords">
      <span>X: {{ coordX }}</span>
      <span>Y: {{ coordY }}</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, reactive, computed } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ======== 类型 ========
type TweenCleanup = () => void

interface LayerDef {
  name: string
  minDepth: number
  maxDepth: number
  z: number
  scale: number
  parallax: number
  color: string
  softMargin: number
}

// ======== 5 层深度定义 ========
const layerDefs: LayerDef[] = [
  {
    name: 'Sky / Clouds',
    minDepth: 0,
    maxDepth: 60,
    z: -140,
    scale: 1.08,
    parallax: 0.12,
    color: '#89c4ff',
    softMargin: 12,
  },
  {
    name: 'Far Mountains',
    minDepth: 45,
    maxDepth: 115,
    z: -70,
    scale: 1.05,
    parallax: 0.28,
    color: '#5b9bd5',
    softMargin: 12,
  },
  {
    name: 'Mid Hills',
    minDepth: 100,
    maxDepth: 165,
    z: -15,
    scale: 1.02,
    parallax: 0.5,
    color: '#70ad47',
    softMargin: 12,
  },
  {
    name: 'Near Trees',
    minDepth: 148,
    maxDepth: 215,
    z: 40,
    scale: 0.97,
    parallax: 0.75,
    color: '#548235',
    softMargin: 12,
  },
  {
    name: 'Foreground',
    minDepth: 198,
    maxDepth: 255,
    z: 90,
    scale: 0.93,
    parallax: 1.05,
    color: '#375623',
    softMargin: 12,
  },
]

// ======== 图片 ========
const imageUrl =
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80'

// ======== 响应式状态 ========
const parentRef = ref<HTMLElement | null>(null)
const sourceCanvasRef = ref<HTMLCanvasElement | null>(null)
const depthMapCanvasRef = ref<HTMLCanvasElement | null>(null)
const sceneRef = ref<HTMLElement | null>(null)
const cameraRef = ref<HTMLElement | null>(null)
const vignetteRef = ref<HTMLElement | null>(null)
const legendRef = ref<HTMLElement | null>(null)
const infoRef = ref<HTMLElement | null>(null)
const progressRef = ref<HTMLElement | null>(null)
const progressBarRef = ref<HTMLElement | null>(null)
const coordRef = ref<HTMLElement | null>(null)

const layerCanvases: HTMLCanvasElement[] = []
const activeLayer = ref(0)
const coordX = ref(0)
const coordY = ref(0)

const mouseX = ref(0)
const mouseY = ref(0)

const cameraStyle = reactive({
  transform: 'rotateX(0deg) rotateY(0deg)',
  transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
})

const cleanupFns: TweenCleanup[] = []

let canvasWidth = 0
let canvasHeight = 0
let sourceImageData: ImageData | null = null
let depthMapData: ImageData | null = null
let resizeTimeout: number | null = null

// ======== Canvas 引用收集 ========
const setLayerCanvas = (el: unknown, i: number) => {
  if (el) {
    layerCanvases[i] = el as HTMLCanvasElement
  }
}

// ======== 深度图生成 ========
/**
 * 生成模拟深度图
 * 策略：
 *   - 基础：顶部深灰(远) → 底部浅灰(近)的垂直渐变
 *   - 山脉：用贝塞尔曲线模拟山峰轮廓，填充中近景
 *   - 噪声：叠加 Perlin-like 细碎纹理，模拟自然不规则
 */
const generateDepthMap = (w: number, h: number): ImageData => {
  const offCanvas = document.createElement('canvas')
  offCanvas.width = w
  offCanvas.height = h
  const ctx = offCanvas.getContext('2d', { willReadFrequently: true })!

  // ---- 基础渐变：上远（亮）→ 下近（暗） ----
  const baseGrad = ctx.createLinearGradient(0, 0, 0, h)
  baseGrad.addColorStop(0, 'rgb(20,20,25)')
  baseGrad.addColorStop(0.15, 'rgb(30,28,32)')
  baseGrad.addColorStop(0.3, 'rgb(65,60,55)')
  baseGrad.addColorStop(0.45, 'rgb(105,95,80)')
  baseGrad.addColorStop(0.6, 'rgb(145,135,115)')
  baseGrad.addColorStop(0.75, 'rgb(185,175,155)')
  baseGrad.addColorStop(0.9, 'rgb(215,208,195)')
  baseGrad.addColorStop(1, 'rgb(235,230,220)')
  ctx.fillStyle = baseGrad
  ctx.fillRect(0, 0, w, h)

  // ---- 山脉轮廓：用径向渐变模拟不规则山峰 ----
  const drawMountain = (cx: number, cy: number, rx: number, ry: number, strength: number) => {
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(rx, ry))
    grad.addColorStop(0, `rgba(0,0,0,${0.55 * strength})`)
    grad.addColorStop(0.4, `rgba(0,0,0,${0.3 * strength})`)
    grad.addColorStop(0.7, `rgba(0,0,0,${0.08 * strength})`)
    grad.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
    ctx.fill()
  }

  // 远山
  drawMountain(w * 0.15, h * 0.38, w * 0.3, h * 0.28, 0.9)
  drawMountain(w * 0.35, h * 0.33, w * 0.28, h * 0.3, 1.0)
  drawMountain(w * 0.7, h * 0.40, w * 0.25, h * 0.26, 0.85)
  drawMountain(w * 0.9, h * 0.36, w * 0.22, h * 0.27, 0.8)

  // 中山
  drawMountain(w * 0.25, h * 0.52, w * 0.22, h * 0.2, 0.7)
  drawMountain(w * 0.55, h * 0.48, w * 0.25, h * 0.22, 0.75)
  drawMountain(w * 0.8, h * 0.55, w * 0.2, h * 0.18, 0.65)

  // 近山/丘陵
  drawMountain(w * 0.1, h * 0.72, w * 0.2, h * 0.15, 0.5)
  drawMountain(w * 0.45, h * 0.68, w * 0.22, h * 0.14, 0.55)
  drawMountain(w * 0.7, h * 0.75, w * 0.18, h * 0.12, 0.45)

  // ---- 噪声纹理 ----
  const imageData = ctx.getImageData(0, 0, w, h)
  const data = imageData.data
  // 简化 Perlin-like：用多重正弦 + 哈希噪声
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4
      const noiseVal =
        Math.sin(x * 0.05 + y * 0.03) * 3 +
        Math.cos(x * 0.08 - y * 0.05) * 2 +
        Math.sin(y * 0.12 + x * 0.06) * 1.5 +
        (Math.random() * 2 - 1) * 1.5
      const r = data[idx]
      const newVal = Math.max(0, Math.min(255, r + noiseVal))
      data[idx] = newVal
      data[idx + 1] = newVal
      data[idx + 2] = newVal
    }
  }
  ctx.putImageData(imageData, 0, 0)

  return ctx.getImageData(0, 0, w, h)
}

// ======== 图层提取 ========
/**
 * 根据深度图提取某一层的图像像素
 * - 深度值在 [minDepth, maxDepth] 范围的像素 → 保留原图颜色
 * - 范围外 → 透明
 * - 范围边缘 → 使用 softMargin 线性过渡（羽化）
 */
const extractLayer = (
  minDepth: number,
  maxDepth: number,
  softMargin: number,
): ImageData => {
  if (!sourceImageData || !depthMapData) {
    // 返回空白
    const empty = new ImageData(canvasWidth || 100, canvasHeight || 100)
    return empty
  }

  const w = canvasWidth
  const h = canvasHeight
  const result = new ImageData(w, h)
  const srcData = sourceImageData.data
  const depthData = depthMapData.data

  for (let i = 0; i < w * h; i++) {
    const pixelIdx = i * 4
    const depth = depthData[pixelIdx] // R channel = depth

    // 计算 alpha（带羽化边缘）
    let alpha: number
    const m = softMargin

    if (depth < minDepth - m || depth > maxDepth + m) {
      alpha = 0
    } else if (depth < minDepth + m) {
      // 下限羽化：minDepth-m → minDepth+m 区间线性过渡
      alpha = (depth - (minDepth - m)) / (2 * m)
    } else if (depth > maxDepth - m) {
      // 上限羽化：maxDepth-m → maxDepth+m 区间线性过渡
      alpha = (maxDepth + m - depth) / (2 * m)
    } else {
      alpha = 1
    }

    // 钳制
    alpha = Math.max(0, Math.min(1, alpha))

    result.data[pixelIdx] = srcData[pixelIdx]
    result.data[pixelIdx + 1] = srcData[pixelIdx + 1]
    result.data[pixelIdx + 2] = srcData[pixelIdx + 2]
    result.data[pixelIdx + 3] = Math.round(alpha * 255)
  }

  return result
}

// ======== 渲染所有图层到 Canvas ========
const renderLayers = () => {
  for (let i = 0; i < layerDefs.length; i++) {
    const canvas = layerCanvases[i]
    if (!canvas) continue
    canvas.width = canvasWidth
    canvas.height = canvasHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) continue

    const layerData = extractLayer(
      layerDefs[i].minDepth,
      layerDefs[i].maxDepth,
      layerDefs[i].softMargin,
    )
    ctx.putImageData(layerData, 0, 0)
  }
}

// ======== 加载图片 & 初始化 ========
const loadAndInit = () => {
  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.src = imageUrl
  img.onload = () => {
    // 计算 Canvas 尺寸（保持比例，限制最大宽度）
    const maxW = 1400
    const ratio = img.naturalHeight / img.naturalWidth
    canvasWidth = Math.min(maxW, window.innerWidth)
    canvasHeight = Math.round(canvasWidth * ratio)

    // 源图 → 隐藏 canvas
    const srcCanvas = sourceCanvasRef.value
    if (!srcCanvas) return
    srcCanvas.width = canvasWidth
    srcCanvas.height = canvasHeight
    const srcCtx = srcCanvas.getContext('2d', { willReadFrequently: true })
    if (!srcCtx) return
    srcCtx.drawImage(img, 0, 0, canvasWidth, canvasHeight)
    sourceImageData = srcCtx.getImageData(0, 0, canvasWidth, canvasHeight)

    // 生成深度图
    depthMapData = generateDepthMap(canvasWidth, canvasHeight)

    // 渲染各层
    renderLayers()

    // 启动动画
    setupAnimation()
  }
}

// ======== 动画 ========
const setupAnimation = () => {
  const container = parentRef.value
  const scene = sceneRef.value
  if (!container || !scene) return

  // ===== 初始状态 =====
  gsap.set(vignetteRef.value, { opacity: 0.55 })
  gsap.set(legendRef.value, { opacity: 0.3, x: 20 })
  gsap.set(infoRef.value, { opacity: 0, y: 40 })
  gsap.set(progressBarRef.value, { width: '0%' })
  gsap.set(coordRef.value, { opacity: 0.2 })

  // 各层初始 transform
  layerCanvases.filter(Boolean).forEach((canvas, i) => {
    const def = layerDefs[i]
    gsap.set(canvas, {
      transformOrigin: 'center center',
      translateZ: def.z,
      scale: def.scale,
    })
  })

  // ===== 主时间线：ScrollTrigger =====
  const mainTl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top 85%',
      end: 'bottom 15%',
      scrub: 1.2,
    },
  })

  // 阶段1：各层按视差速度分离
  layerDefs.forEach((def, i) => {
    const canvas = layerCanvases[i]
    if (!canvas) return
    // 根据 parallax 系数，z 轴移动幅度不同
    const zMove = def.parallax * 80
    mainTl.to(
      canvas,
      { translateZ: def.z - zMove, scale: def.scale + def.parallax * 0.04, duration: 0.6 },
      0.05,
    )

    // 后半程：各层回归
    mainTl.to(
      canvas,
      { translateZ: def.z, scale: def.scale, duration: 0.25 },
      0.7,
    )
  })

  // 暗角变化
  mainTl.to(vignetteRef.value, { opacity: 0.3, duration: 0.3 }, 0.1)
  mainTl.to(vignetteRef.value, { opacity: 0.45, duration: 0.15 }, 0.75)

  // 图例渐显
  mainTl.to(legendRef.value, { opacity: 0.85, x: 0, duration: 0.15 }, 0.15)
  mainTl.to(legendRef.value, { opacity: 0.3, duration: 0.1 }, 0.8)

  // 切换高亮图层指示
  layerDefs.forEach((_, i) => {
    mainTl.call(() => { activeLayer.value = i }, [], 0.1 + i * 0.12)
  })

  // 文字入场
  mainTl.to(infoRef.value, { opacity: 1, y: 0, duration: 0.1, ease: 'power2.out' }, 0.8)

  // 坐标指示
  mainTl.to(coordRef.value, { opacity: 0.6, duration: 0.1 }, 0.2)
  mainTl.to(coordRef.value, { opacity: 0.15, duration: 0.1 }, 0.8)

  // 进度条
  mainTl.to(progressBarRef.value, { width: '100%', duration: 0.95, ease: 'none' }, 0)

  cleanupFns.push(() => {
    mainTl.scrollTrigger?.kill()
    mainTl.kill()
  })
}

// ======== 鼠标 3D 倾斜 ========
let mouseRafId = 0
const handleMouseMove = (e: MouseEvent) => {
  const w = window.innerWidth
  const h = window.innerHeight
  // 归一化到 [-1, 1]
  mouseX.value = (e.clientX / w) * 2 - 1
  mouseY.value = (e.clientY / h) * 2 - 1

  coordX.value = Math.round(e.clientX)
  coordY.value = Math.round(e.clientY)
}

const updateCamera = () => {
  const rotateY = mouseX.value * 15 // ±15deg
  const rotateX = -mouseY.value * 8 // ±8deg
  cameraStyle.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`

  // 各层根据 Z 位置缩放鼠标响应
  layerCanvases.filter(Boolean).forEach((canvas, i) => {
    const def = layerDefs[i]
    const sensitivity = 0.3 + def.parallax * 0.7
    const moveX = mouseX.value * 12 * sensitivity
    const moveY = -mouseY.value * 6 * sensitivity
    canvas.style.transform = `translateZ(${def.z}px) scale(${def.scale}) translateX(${moveX.toFixed(1)}px) translateY(${moveY.toFixed(1)}px)`
  })

  mouseRafId = requestAnimationFrame(updateCamera)
}

// ======== 窗口缩放处理 ========
const handleResize = () => {
  if (resizeTimeout) clearTimeout(resizeTimeout)
  resizeTimeout = window.setTimeout(() => {
    if (!sourceImageData) return
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = imageUrl
    img.onload = () => {
      const maxW = 1400
      const ratio = img.naturalHeight / img.naturalWidth
      canvasWidth = Math.min(maxW, window.innerWidth)
      canvasHeight = Math.round(canvasWidth * ratio)

      const srcCanvas = sourceCanvasRef.value
      if (!srcCanvas) return
      srcCanvas.width = canvasWidth
      srcCanvas.height = canvasHeight
      const srcCtx = srcCanvas.getContext('2d', { willReadFrequently: true })
      if (!srcCtx) return
      srcCtx.drawImage(img, 0, 0, canvasWidth, canvasHeight)
      sourceImageData = srcCtx.getImageData(0, 0, canvasWidth, canvasHeight)

      depthMapData = generateDepthMap(canvasWidth, canvasHeight)
      renderLayers()
    }
  }, 300)
}

// ======== 生命周期 ========
onMounted(() => {
  loadAndInit()
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('resize', handleResize)
  mouseRafId = requestAnimationFrame(updateCamera)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('resize', handleResize)
  if (mouseRafId) cancelAnimationFrame(mouseRafId)
  if (resizeTimeout) clearTimeout(resizeTimeout)
  cleanupFns.forEach((fn) => fn())
})
</script>

<style lang="scss" scoped>
/* ==================== 容器 ==================== */
.pd-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #0e0f14;
  cursor: crosshair;
}

/* ==================== 隐藏 Canvas ==================== */
.pd-hidden-canvas {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
}

/* ==================== 3D 场景 ==================== */
.pd-scene {
  position: absolute;
  inset: 0;
  z-index: 1;
  perspective: 800px;
  perspective-origin: 50% 45%;
}

.pd-camera {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  will-change: transform;
}

/* ==================== 图层 Canvas ==================== */
.pd-layer-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  will-change: transform;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

/* ==================== 暗角 ==================== */
.pd-vignette {
  position: absolute;
  inset: 0;
  z-index: 10;
  pointer-events: none;
  background: radial-gradient(
    ellipse 65% 50% at 50% 45%,
    transparent 40%,
    rgba(0, 0, 0, 0.2) 65%,
    rgba(0, 0, 0, 0.45) 85%,
    rgba(0, 0, 0, 0.65) 100%
  );
  will-change: opacity;
}

/* ==================== 深度图例 ==================== */
.pd-legend {
  position: absolute;
  top: 6%;
  right: 4%;
  z-index: 20;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px 16px;
  background: rgba(10, 11, 16, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  pointer-events: none;
  will-change: transform, opacity;
}

.pd-legend-label {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.25em;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 4px;
  text-transform: uppercase;
}

.pd-legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.35);
  transition: all 0.35s ease;
}

.pd-legend-item.active {
  color: rgba(255, 255, 255, 0.9);
  transform: scale(1.08);
}

.pd-legend-dot {
  display: block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  box-shadow: 0 0 8px currentColor;
  flex-shrink: 0;
}

.pd-legend-name {
  flex: 1;
}

.pd-legend-parallax {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.25);
  font-variant-numeric: tabular-nums;
}

/* ==================== 文字信息 ==================== */
.pd-info {
  position: absolute;
  inset: 0;
  z-index: 18;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  will-change: transform, opacity;
}

.pd-label {
  font-size: 12px;
  font-weight: 600;
  font-family: 'Helvetica Neue', 'Arial', sans-serif;
  letter-spacing: 0.45em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 14px;
  text-shadow: 0 0 15px rgba(100, 160, 255, 0.2);
}

.pd-title {
  font-size: clamp(28px, 5vw, 52px);
  font-weight: 900;
  font-family: 'STKaiti', 'KaiTi', '楷体', 'Noto Serif SC', 'Georgia', serif;
  color: rgba(255, 255, 255, 0.95);
  margin: 0 0 6px 0;
  letter-spacing: 0.18em;
  text-shadow:
    0 0 35px rgba(100, 150, 255, 0.2),
    0 2px 6px rgba(0, 0, 0, 0.5);
}

.pd-subtitle {
  font-size: 13px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.22em;
  margin: 0 0 18px 0;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}

.pd-divider {
  width: 70px;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(100, 160, 255, 0.35) 25%,
    rgba(150, 200, 255, 0.6) 50%,
    rgba(100, 160, 255, 0.35) 75%,
    transparent
  );
  margin-bottom: 14px;
}

.pd-desc {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.3);
  letter-spacing: 0.15em;
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

/* ==================== 进度条 ==================== */
.pd-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  z-index: 25;
  background: rgba(255, 255, 255, 0.04);
}

.pd-progress-bar {
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(80, 140, 255, 0.4),
    rgba(120, 180, 255, 0.6),
    rgba(180, 220, 255, 0.4)
  );
  will-change: width;
  box-shadow: 0 0 10px rgba(100, 160, 255, 0.3);
}

/* ==================== 鼠标坐标 ==================== */
.pd-coords {
  position: absolute;
  bottom: 16px;
  right: 20px;
  z-index: 22;
  display: flex;
  gap: 12px;
  font-size: 10px;
  font-family: 'Menlo', 'Consolas', 'Courier New', monospace;
  color: rgba(255, 255, 255, 0.25);
  letter-spacing: 0.1em;
  pointer-events: none;
  will-change: opacity;
}

.pd-coords span {
  min-width: 36px;
  text-align: right;
}

/* ==================== 响应式 ==================== */
@media (max-width: 768px) {
  .pd-title {
    font-size: clamp(20px, 6vw, 34px);
  }

  .pd-label {
    font-size: 10px;
    letter-spacing: 0.3em;
  }

  .pd-subtitle {
    font-size: 11px;
  }

  .pd-desc {
    font-size: 10px;
  }

  .pd-legend {
    top: auto;
    bottom: 12%;
    right: 3%;
    padding: 10px 12px;
    gap: 4px;
    border-radius: 8px;
  }

  .pd-legend-item {
    font-size: 10px;
    gap: 5px;
  }

  .pd-legend-dot {
    width: 5px;
    height: 5px;
  }

  .pd-legend-label {
    font-size: 8px;
  }

  .pd-coords {
    bottom: 10px;
    right: 12px;
    font-size: 9px;
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .pd-title {
    font-size: clamp(16px, 7vw, 24px);
    letter-spacing: 0.1em;
  }

  .pd-legend {
    display: none;
  }
}
</style>
