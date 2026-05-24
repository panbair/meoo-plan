<template>
  <section ref="parentRef" class="ag3d-container">
    <!-- ==================== SVG 定义：红/青通道分离 + 发光滤镜 ==================== -->
    <svg class="ag3d-svg-defs" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <!-- 红色通道提取 -->
        <filter id="ag3d-red-channel" color-interpolation-filters="sRGB">
          <feColorMatrix type="matrix" values="
            1 0 0 0 0
            0 0 0 0 0
            0 0 0 0 0
            0 0 0 1 0
          " />
        </filter>

        <!-- 青色通道提取 (绿色 + 蓝色) -->
        <filter id="ag3d-cyan-channel" color-interpolation-filters="sRGB">
          <feColorMatrix type="matrix" values="
            0 0 0 0 0
            0 1 0 0 0
            0 0 1 0 0
            0 0 0 1 0
          " />
        </filter>
      </defs>
    </svg>

    <!-- ==================== Layer 1: 左眼视图 (红色通道, 偏移 x:-15px) ==================== -->
    <div ref="redLayerRef" class="ag3d-layer ag3d-red">
      <img :src="stereoSrc" class="ag3d-img ag3d-img-red" crossorigin="anonymous" />
    </div>

    <!-- ==================== Layer 2: 右眼视图 (青色通道, 偏移 x:+15px) ==================== -->
    <div ref="cyanLayerRef" class="ag3d-layer ag3d-cyan">
      <img :src="stereoSrc" class="ag3d-img ag3d-img-cyan" crossorigin="anonymous" />
    </div>

    <!-- ==================== Layer 3: 3D 深度图 (灰度叠加层) ==================== -->
    <div ref="depthMapRef" class="ag3d-depth-map">
      <canvas ref="depthCanvasRef" class="ag3d-depth-canvas"></canvas>
    </div>

    <!-- ==================== Layer 4: 视差辅助网格 ==================== -->
    <div ref="parallaxGridRef" class="ag3d-parallax-grid">
      <div v-for="h in 8" :key="'h-'+h" class="ag3d-grid-line ag3d-grid-h"></div>
      <div v-for="v in 12" :key="'v-'+v" class="ag3d-grid-line ag3d-grid-v"></div>
    </div>

    <!-- ==================== Layer 5: 立体指示器 (提示红蓝眼镜) ==================== -->
    <div ref="indicatorRef" class="ag3d-indicator">
      <div class="ag3d-glasses-icon">
        <span class="ag3d-glasses-l ag3d-glasses-left"></span>
        <span class="ag3d-glasses-m"></span>
        <span class="ag3d-glasses-l ag3d-glasses-right"></span>
      </div>
      <span class="ag3d-indicator-text">3D</span>
    </div>

    <!-- ==================== Layer 6: 深度热点 (高亮弹出层) ==================== -->
    <div class="ag3d-hotspots">
      <div ref="hotspot0Ref" class="ag3d-hotspot ag3d-hotspot-0">
        <div class="ag3d-hotspot-ring"></div>
        <span class="ag3d-hotspot-tag">近景</span>
      </div>
      <div ref="hotspot1Ref" class="ag3d-hotspot ag3d-hotspot-1">
        <div class="ag3d-hotspot-ring"></div>
        <span class="ag3d-hotspot-tag">中景</span>
      </div>
      <div ref="hotspot2Ref" class="ag3d-hotspot ag3d-hotspot-2">
        <div class="ag3d-hotspot-ring"></div>
        <span class="ag3d-hotspot-tag">远景</span>
      </div>
    </div>

    <!-- ==================== 信息面板 ==================== -->
    <div ref="infoRef" class="ag3d-info">
      <span class="ag3d-info-label">ANAGLYPH 3D STEREO</span>
      <h2 class="ag3d-info-title">红蓝立体幻影</h2>
      <div class="ag3d-info-divider"></div>
      <span class="ag3d-info-specs">
        立体深度 {{ stereoDepth }}% · 偏移 {{ offsetPx }}px · 通道分离 {{ channelSep }}%
      </span>
    </div>

    <!-- ==================== 进度条 ==================== -->
    <div ref="progressRef" class="ag3d-progress">
      <div ref="progressBarRef" class="ag3d-progress-bar"></div>
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

// ======== 模板引用 ========
const parentRef = ref<HTMLElement | null>(null)
const redLayerRef = ref<HTMLElement | null>(null)
const cyanLayerRef = ref<HTMLElement | null>(null)
const depthMapRef = ref<HTMLElement | null>(null)
const depthCanvasRef = ref<HTMLCanvasElement | null>(null)
const parallaxGridRef = ref<HTMLElement | null>(null)
const indicatorRef = ref<HTMLElement | null>(null)
const hotspot0Ref = ref<HTMLElement | null>(null)
const hotspot1Ref = ref<HTMLElement | null>(null)
const hotspot2Ref = ref<HTMLElement | null>(null)
const infoRef = ref<HTMLElement | null>(null)
const progressRef = ref<HTMLElement | null>(null)
const progressBarRef = ref<HTMLElement | null>(null)

// ======== 响应式状态 ========
const stereoDepth = ref(100)
const offsetPx = ref(15)
const channelSep = ref(100)

const cleanupFns: TweenCleanup[] = []

// ======== 图片资源 ========
const stereoSrc = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=80'

// ======== 最大视差偏移 ========
const MAX_OFFSET = 15

// ======== 深度 Canvas 绘制 ========
let canvasW = 0
let canvasH = 0

const renderDepthCanvas = () => {
  const canvas = depthCanvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, canvasW, canvasH)

  // 模拟深度图：从上到下渐变（上远景深色，下近景浅色）
  const depthGrad = ctx.createLinearGradient(0, 0, 0, canvasH)
  depthGrad.addColorStop(0, 'rgba(0,0,0,0.25)')    // 远景 25% 暗度
  depthGrad.addColorStop(0.35, 'rgba(0,0,0,0.18)') // 远中景 18%
  depthGrad.addColorStop(0.6, 'rgba(0,0,0,0.10)')  // 中近景 10%
  depthGrad.addColorStop(0.85, 'rgba(0,0,0,0.03)') // 近景 3%
  depthGrad.addColorStop(1, 'rgba(0,0,0,0)')       // 前景 0%
  ctx.fillStyle = depthGrad
  ctx.fillRect(0, 0, canvasW, canvasH)

  // 绘制模拟深度纹理：水平波纹条带
  for (let y = 0; y < canvasH; y += 24) {
    const alpha = 0.03 + 0.04 * Math.sin(y * 0.02)
    ctx.fillStyle = `rgba(0,0,0,${alpha})`
    ctx.fillRect(0, y, canvasW, 12)
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
  const dCanvas = depthCanvasRef.value
  if (dCanvas) {
    dCanvas.width = canvasW
    dCanvas.height = canvasH
  }
  renderDepthCanvas()

  // ===== 初始状态：两通道完全对齐，无立体效果 =====
  gsap.set(redLayerRef.value, { x: 0 })
  gsap.set(cyanLayerRef.value, { x: 0 })

  gsap.set(depthMapRef.value, { opacity: 0.08 })
  gsap.set(parallaxGridRef.value, { opacity: 0.08 })
  gsap.set(indicatorRef.value, { opacity: 0, scale: 0.4 })
  gsap.set(infoRef.value, { opacity: 0, y: 15 })
  gsap.set(progressBarRef.value, { width: '0%' })

  // 热点初始隐藏
  gsap.set(hotspot0Ref.value, { opacity: 0, scale: 0.5 })
  gsap.set(hotspot1Ref.value, { opacity: 0, scale: 0.5 })
  gsap.set(hotspot2Ref.value, { opacity: 0, scale: 0.5 })

  stereoDepth.value = 0
  offsetPx.value = 0
  channelSep.value = 0

  // ===== 主时间线 =====
  const mainTl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top 85%',
      end: 'bottom 15%',
      scrub: 1.2,
    },
  })

  // ===== 核心：视差偏移从 0 → ±MAX_OFFSET，3D 深度感随滚动增强 =====
  mainTl.to(
    {},
    {
      duration: 1,
      onUpdate: () => {
        const p = mainTl.progress() // 0 → 1

        // 偏移量：0px → MAX_OFFSET
        // 前半段缓慢积累，后半段快速分离，形成"越来越强"的 3D 感受
        const easedOffset = MAX_OFFSET * (p * p * (3 - 2 * p)) // smoothstep 反向

        const redEl = redLayerRef.value
        const cyanEl = cyanLayerRef.value

        if (redEl) redEl.style.transform = `translateX(${-easedOffset}px)`
        if (cyanEl) cyanEl.style.transform = `translateX(${easedOffset}px)`

        // 通道亮度：偏移越大，红/青通道色调越浓
        const separationFactor = easedOffset / MAX_OFFSET
        ;(container.querySelectorAll('.ag3d-img-red') as NodeListOf<HTMLElement>).forEach((el) => {
          el.style.filter = `url(#ag3d-red-channel) brightness(${0.95 - separationFactor * 0.2})`
        })
        ;(container.querySelectorAll('.ag3d-img-cyan') as NodeListOf<HTMLElement>).forEach((el) => {
          el.style.filter = `url(#ag3d-cyan-channel) brightness(${0.95 - separationFactor * 0.2})`
        })

        // 更新响应式数据
        stereoDepth.value = Math.round((easedOffset / MAX_OFFSET) * 100)
        offsetPx.value = Math.round(easedOffset)
        channelSep.value = Math.round((easedOffset / MAX_OFFSET) * 100)
      },
    },
    0,
  )

  // ===== 深度图透明度：随分离增强逐渐浮现 =====
  mainTl.to(depthMapRef.value, { opacity: 0.65, duration: 0.95, ease: 'power2.out' }, 0.02)

  // ===== 视差网格：后段逐渐增强 =====
  mainTl.to(parallaxGridRef.value, { opacity: 0.08, duration: 0.3, ease: 'none' }, 0)
  mainTl.to(parallaxGridRef.value, { opacity: 0.5, duration: 0.5, ease: 'power2.out' }, 0.55)

  // ===== 立体指示器：渐显 + 放大 =====
  mainTl.to(indicatorRef.value, { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }, 0.15)
  mainTl.to(indicatorRef.value, { opacity: 0.9, scale: 1.05, duration: 0.4, ease: 'power2.inOut' }, 0.85)

  // ===== 信息面板入场 =====
  mainTl.to(infoRef.value, { opacity: 1, y: 0, duration: 0.1, ease: 'power2.out' }, 0.05)

  // ===== 进度条 =====
  mainTl.to(progressBarRef.value, { width: '100%', duration: 0.98, ease: 'none' }, 0.01)

  // ===== 深度热点：随 3D 深度增强逐步弹出 =====
  // 远景 (hotspot 2): 小偏移即感知到远景深度，最先弹出 (p 0.15~0.45)
  mainTl.to(hotspot2Ref.value, { opacity: 0.9, scale: 1, duration: 0.04 }, 0.15)
  mainTl.to(hotspot2Ref.value, { opacity: 0, scale: 0.5, duration: 0.06 }, 0.42)

  // 中景 (hotspot 1): 中等偏移时弹出 (p 0.3~0.6)
  mainTl.to(hotspot1Ref.value, { opacity: 0.9, scale: 1, duration: 0.04 }, 0.32)
  mainTl.to(hotspot1Ref.value, { opacity: 0, scale: 0.5, duration: 0.06 }, 0.58)

  // 近景 (hotspot 0): 大偏移时最强立体，最后弹出 (p 0.55~0.88)
  mainTl.to(hotspot0Ref.value, { opacity: 0.9, scale: 1, duration: 0.04 }, 0.55)
  mainTl.to(hotspot0Ref.value, { opacity: 0, scale: 0.5, duration: 0.06 }, 0.85)

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
    const dCanvas = depthCanvasRef.value
    if (dCanvas) {
      dCanvas.width = canvasW
      dCanvas.height = canvasH
    }
    renderDepthCanvas()
  }, 300)
}

window.addEventListener('resize', handleResize)

onUnmounted(() => {
  if (resizeTimeout) clearTimeout(resizeTimeout)
  window.removeEventListener('resize', handleResize)
  cleanupFns.forEach((fn) => fn())
})
</script>

<style lang="scss" scoped>
/* ==================== 容器 ==================== */
.ag3d-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #0a0a0a;
}

/* ==================== SVG 隐藏定义 ==================== */
.ag3d-svg-defs {
  position: absolute;
  width: 0;
  height: 0;
  pointer-events: none;
}

/* ==================== 通道图层 ==================== */
.ag3d-layer {
  position: absolute;
  inset: 0;
  overflow: hidden;
  will-change: transform;
}

.ag3d-img {
  width: 100vw;
  height: 100vh;
  object-fit: cover;
}

/* 红色通道 (左眼) */
.ag3d-red {
  z-index: 1;
  mix-blend-mode: screen;
}

.ag3d-img-red {
  filter: url(#ag3d-red-channel) brightness(0.8);
}

/* 青色通道 (右眼) — 使用 screen 混合模式 */
.ag3d-cyan {
  z-index: 2;
  mix-blend-mode: screen;
}

.ag3d-img-cyan {
  filter: url(#ag3d-cyan-channel) brightness(0.8);
}

/* ==================== Layer 3: 3D 深度图 ==================== */
.ag3d-depth-map {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  mix-blend-mode: overlay;
}

.ag3d-depth-canvas {
  width: 100%;
  height: 100%;
}

/* ==================== Layer 4: 视差辅助网格 ==================== */
.ag3d-parallax-grid {
  position: absolute;
  inset: 0;
  z-index: 4;
  pointer-events: none;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(8, 1fr);
}

.ag3d-grid-line {
  border: 0.5px solid rgba(255, 255, 255, 0.06);
}

.ag3d-grid-v {
  grid-row: 1 / -1;
  border-left: 0.5px solid rgba(255, 255, 255, 0.06);
  border-right: none;
  border-top: none;
  border-bottom: none;
}

.ag3d-grid-h {
  grid-column: 1 / -1;
  border-top: 0.5px solid rgba(255, 255, 255, 0.06);
  border-right: none;
  border-bottom: none;
  border-left: none;
}

/* ==================== Layer 5: 立体指示器 ==================== */
.ag3d-indicator {
  position: absolute;
  top: 24px;
  right: 28px;
  z-index: 15;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  pointer-events: none;
}

.ag3d-glasses-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
}

.ag3d-glasses-l {
  width: 18px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.6);
  position: relative;
}

.ag3d-glasses-left {
  background: rgba(255, 50, 50, 0.25);
  box-shadow: 0 0 10px rgba(255, 50, 50, 0.4);
}

.ag3d-glasses-right {
  background: rgba(50, 220, 255, 0.25);
  box-shadow: 0 0 10px rgba(50, 220, 255, 0.4);
}

.ag3d-glasses-m {
  width: 6px;
  height: 2px;
  background: rgba(255,255,255,0.5);
}

.ag3d-indicator-text {
  font-family: 'Courier New', monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 3px;
  color: rgba(255,255,255,0.5);
}

/* ==================== Layer 6: 深度热点 ==================== */
.ag3d-hotspots {
  position: absolute;
  inset: 0;
  z-index: 8;
  pointer-events: none;
}

.ag3d-hotspot {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  transform: translate(-50%, -50%);
}

/* 近景 — 前景中央偏下 */
.ag3d-hotspot-0 {
  left: 55%;
  top: 68%;
}

/* 中景 — 中部偏左 */
.ag3d-hotspot-1 {
  left: 30%;
  top: 40%;
}

/* 远景 — 顶部偏右 */
.ag3d-hotspot-2 {
  left: 72%;
  top: 18%;
}

.ag3d-hotspot-ring {
  width: 28px;
  height: 28px;
  border: 2px solid rgba(255,255,255,0.5);
  border-radius: 50%;
  animation: ag3d-hotspot-pulse 2s ease-in-out infinite;
}

.ag3d-hotspot-0 .ag3d-hotspot-ring {
  box-shadow: 0 0 16px rgba(255, 255, 100, 0.5), inset 0 0 8px rgba(255,255,100,0.2);
  border-color: rgba(255,255,100,0.7);
}

.ag3d-hotspot-1 .ag3d-hotspot-ring {
  box-shadow: 0 0 12px rgba(100, 255, 200, 0.4), inset 0 0 6px rgba(100,255,200,0.15);
  border-color: rgba(100,255,200,0.6);
}

.ag3d-hotspot-2 .ag3d-hotspot-ring {
  box-shadow: 0 0 10px rgba(150, 180, 255, 0.35), inset 0 0 5px rgba(150,180,255,0.1);
  border-color: rgba(150,180,255,0.55);
}

.ag3d-hotspot-tag {
  font-family: 'Courier New', monospace;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 2px;
  text-shadow: 0 0 6px rgba(255,255,255,0.3);
}

.ag3d-hotspot-0 .ag3d-hotspot-tag { color: rgba(255,255,150,0.8); }
.ag3d-hotspot-1 .ag3d-hotspot-tag { color: rgba(150,255,220,0.75); }
.ag3d-hotspot-2 .ag3d-hotspot-tag { color: rgba(180,200,255,0.7); }

@keyframes ag3d-hotspot-pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.5);
    opacity: 1;
  }
}

/* ==================== 信息面板 ==================== */
.ag3d-info {
  position: absolute;
  left: 32px;
  bottom: 40px;
  z-index: 12;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ag3d-info-label {
  font-family: 'Courier New', monospace;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 4px;
  color: rgba(255,255,255,0.45);
}

.ag3d-info-title {
  margin: 0;
  font-size: 26px;
  font-weight: 700;
  letter-spacing: 2px;
  color: rgba(255,255,255,0.9);
  text-shadow: 0 0 20px rgba(255,255,255,0.15);
}

.ag3d-info-divider {
  width: 40px;
  height: 2px;
  background: linear-gradient(90deg, rgba(255,50,50,0.7), rgba(50,220,255,0.7));
}

.ag3d-info-specs {
  font-family: 'Courier New', monospace;
  font-size: 10px;
  color: rgba(255,255,255,0.4);
  letter-spacing: 1px;
}

/* ==================== 进度条 ==================== */
.ag3d-progress {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 20;
  height: 3px;
  background: rgba(255,255,255,0.06);
}

.ag3d-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, rgba(255,50,50,0.8) 0%, rgba(200,200,200,0.4) 50%, rgba(50,220,255,0.8) 100%);
}
</style>
