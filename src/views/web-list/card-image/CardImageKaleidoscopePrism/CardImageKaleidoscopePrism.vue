<template>
  <section ref="parentRef" class="kp-container">
    <!-- ==================== SVG 定义：彩虹棱镜渐变 & 光晕 ==================== -->
    <svg class="kp-svg-defs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" aria-hidden="true">
      <defs>
        <!-- === 彩虹光谱渐变（棱镜边缘折射） === -->
        <linearGradient id="prism-rainbow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ff6b6b">
            <animate attributeName="stop-color" values="#ff6b6b;#ffa500;#ff6b6b" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="20%" stop-color="#ffa500">
            <animate attributeName="stop-color" values="#ffa500;#ffe066;#ffa500" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="40%" stop-color="#ffe066">
            <animate attributeName="stop-color" values="#ffe066;#69db7c;#ffe066" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="60%" stop-color="#69db7c">
            <animate attributeName="stop-color" values="#69db7c;#4dabf7;#69db7c" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="80%" stop-color="#4dabf7">
            <animate attributeName="stop-color" values="#4dabf7;#9775fa;#4dabf7" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stop-color="#9775fa">
            <animate attributeName="stop-color" values="#9775fa;#ff6b6b;#9775fa" dur="4s" repeatCount="indefinite" />
          </stop>
        </linearGradient>

        <!-- === 棱镜边缘发光 === -->
        <filter id="prism-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <!-- === 顶点光斑 === -->
        <radialGradient id="vertex-flare" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="rgba(255,255,255,0.9)" />
          <stop offset="30%" stop-color="rgba(255,255,255,0.4)" />
          <stop offset="70%" stop-color="rgba(255,255,255,0.05)" />
          <stop offset="100%" stop-color="rgba(255,255,255,0)" />
        </radialGradient>

        <!-- === 中心渐变 === -->
        <radialGradient id="center-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="rgba(255,255,255,0.25)" />
          <stop offset="50%" stop-color="rgba(255,255,255,0.08)" />
          <stop offset="100%" stop-color="rgba(255,255,255,0)" />
        </radialGradient>

        <!-- === 暗角 === -->
        <radialGradient id="kp-vignette" cx="50%" cy="50%" r="70%">
          <stop offset="40%" stop-color="rgba(0,0,0,0)" />
          <stop offset="70%" stop-color="rgba(0,0,0,0.15)" />
          <stop offset="100%" stop-color="rgba(0,0,0,0.6)" />
        </radialGradient>
      </defs>
    </svg>

    <!-- ==================== Layer 1+2: Canvas 万花筒渲染 ==================== -->
    <canvas ref="kaleidoCanvasRef" class="kp-canvas"></canvas>

    <!-- ==================== SVG 六边形框架 & 彩虹边缘 ==================== -->
    <div ref="frameLayerRef" class="kp-frame-layer">
      <svg class="kp-frame-svg" viewBox="-550 -550 1100 1100" preserveAspectRatio="xMidYMid slice">
        <!-- 六边形外框 -->
        <polygon
          ref="hexBorderRef"
          :points="hexPointsStr"
          fill="none"
          stroke="url(#prism-rainbow)"
          stroke-width="3"
          filter="url(#prism-glow)"
          stroke-linejoin="round"
        />
        <!-- 六边形内线（扇形分割） -->
        <g ref="sectorLinesRef" :transform="`rotate(${sectorRotateDeg}, 0, 0)`">
          <line v-for="i in 6" :key="i"
            x1="0" y1="0"
            :x2="(430 * Math.cos((i-1) * Math.PI/3 - Math.PI/6)).toFixed(2)"
            :y2="(430 * Math.sin((i-1) * Math.PI/3 - Math.PI/6)).toFixed(2)"
            stroke="rgba(255,255,255,0.15)"
            stroke-width="1"
          />
        </g>
        <!-- 中心圆 -->
        <circle cx="0" cy="0" r="70" fill="url(#center-grad)" />
        <circle cx="0" cy="0" r="70" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" />
      </svg>
    </div>

    <!-- ==================== Layer 3: 中心旋转曼陀罗 ==================== -->
    <div ref="mandalaRef" class="kp-mandala" :style="{ transform: `rotate(${mandalaAngle}deg)` }">
      <div v-for="i in 6" :key="i" class="kp-mandala-arm"
        :style="{
          transform: `rotate(${(i-1) * 60}deg)`,
          width: '80px',
        }">
        <div class="kp-mandala-line"></div>
        <div class="kp-mandala-dot"></div>
      </div>
    </div>

    <!-- ==================== Layer 4: 顶点光斑 ==================== -->
    <div ref="flaresRef" class="kp-flares">
      <div v-for="i in 6" :key="i" class="kp-flare"
        :style="{
          top: `${50 + 43 * Math.sin((i-1) * Math.PI/3)}%`,
          left: `${50 + 43 * Math.cos((i-1) * Math.PI/3)}%`,
        }">
      </div>
    </div>

    <!-- ==================== 暗角 ==================== -->
    <div class="kp-vignette"></div>

    <!-- ==================== 文字信息 ==================== -->
    <div ref="infoRef" class="kp-info">
      <span class="kp-info-label">KALEIDOSCOPE PRISM</span>
      <h2 class="kp-info-title">万花筒棱镜</h2>
      <p class="kp-info-sub">6-Face · Mirror · Rainbow</p>
      <div class="kp-info-divider"></div>
      <p class="kp-info-desc">旋转角度 {{ Math.round(currentRotation) }}° · 面 {{ activeFace }}</p>
    </div>

    <!-- ==================== 进度指示器 ==================== -->
    <div ref="progressRef" class="kp-progress">
      <div ref="progressBarRef" class="kp-progress-bar"></div>
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
const kaleidoCanvasRef = ref<HTMLCanvasElement | null>(null)
const hexBorderRef = ref<SVGPolygonElement | null>(null)
const sectorLinesRef = ref<SVGElement | null>(null)
const mandalaRef = ref<HTMLElement | null>(null)
const frameLayerRef = ref<HTMLElement | null>(null)
const flaresRef = ref<HTMLElement | null>(null)
const infoRef = ref<HTMLElement | null>(null)
const progressRef = ref<HTMLElement | null>(null)
const progressBarRef = ref<HTMLElement | null>(null)

const currentRotation = ref(0)
const mandalaAngle = ref(0)
const sectorRotateDeg = ref(0)
const activeFace = ref(1)

const cleanupFns: TweenCleanup[] = []

// ======== 图片资源 (6张) ========
const imageUrls = [
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80', // 山脉
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80', // 海滩
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80', // 森林
  'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1200&q=80', // 城市
  'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=1200&q=80', // 沙漠
  'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1200&q=80', // 极光
]

const loadedImages: HTMLImageElement[] = []
const DEG = Math.PI / 180

// ======== 六边形顶点计算 ========
let hexRadius = 430
const hexPoints = [
  { x: 0, y: -hexRadius },
  { x: hexRadius * Math.cos(DEG * 30), y: -hexRadius * Math.sin(DEG * 30) },
  { x: hexRadius * Math.cos(DEG * 30), y: hexRadius * Math.sin(DEG * 30) },
  { x: 0, y: hexRadius },
  { x: -hexRadius * Math.cos(DEG * 30), y: hexRadius * Math.sin(DEG * 30) },
  { x: -hexRadius * Math.cos(DEG * 30), y: -hexRadius * Math.sin(DEG * 30) },
]

const hexPointsStr = computed(() =>
  hexPoints.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' '),
)

// ======== Canvas 尺寸 ========
let canvasW = 0
let canvasH = 0
let cx = 0, cy = 0

// ======== 预加载所有图片 ========
let allLoaded = false
const preloadImages = (): Promise<void> => {
  return new Promise((resolve) => {
    let loaded = 0
    imageUrls.forEach((url, idx) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = url
      img.onload = () => {
        loadedImages[idx] = img
        loaded++
        if (loaded === 6) {
          allLoaded = true
          resolve()
        }
      }
      img.onerror = () => {
        loadedImages[idx] = img
        loaded++
        if (loaded === 6) resolve()
      }
    })
  })
}

// ======== 绘制万花筒 ========
const drawKaleidoscope = (rotation: number) => {
  const canvas = kaleidoCanvasRef.value
  if (!canvas || !allLoaded) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, canvasW, canvasH)

  ctx.save()
  ctx.translate(cx, cy)

  // 裁剪到圆形区域
  ctx.beginPath()
  ctx.arc(0, 0, hexRadius - 2, 0, Math.PI * 2)
  ctx.clip()

  // 全局旋转
  ctx.rotate(rotation * DEG)

  // ===== 绘制 6 个扇区 =====
  for (let face = 0; face < 6; face++) {
    const startAngle = face * 60 * DEG
    const midAngle = startAngle + 30 * DEG
    const endAngle = startAngle + 60 * DEG

    const img = loadedImages[face]
    if (!img) continue

    // ---- 前半扇区（30°）：正常绘制 ----
    ctx.save()
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(hexRadius * Math.cos(startAngle), hexRadius * Math.sin(startAngle))
    ctx.lineTo(hexRadius * Math.cos(midAngle), hexRadius * Math.sin(midAngle))
    ctx.closePath()
    ctx.clip()
    ctx.drawImage(img, -hexRadius, -hexRadius, hexRadius * 2, hexRadius * 2)
    ctx.restore()

    // ---- 后半扇区（30°）：镜像反射 ----
    ctx.save()
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(hexRadius * Math.cos(midAngle), hexRadius * Math.sin(midAngle))
    ctx.lineTo(hexRadius * Math.cos(endAngle), hexRadius * Math.sin(endAngle))
    ctx.closePath()
    ctx.clip()

    // 镜像：先旋转到二分线对齐Y轴，再scale(-1,1)，再旋转回来
    ctx.rotate(midAngle)
    ctx.scale(-1, 1)
    ctx.rotate(-midAngle)

    ctx.drawImage(img, -hexRadius, -hexRadius, hexRadius * 2, hexRadius * 2)
    ctx.restore()
  }

  ctx.restore()

  // ===== 外围暗色环 =====
  ctx.beginPath()
  ctx.arc(cx, cy, hexRadius - 1, 0, Math.PI * 2)
  ctx.strokeStyle = 'rgba(255,255,255,0.12)'
  ctx.lineWidth = 2
  ctx.stroke()
}

// ======== 初始化 ========
onMounted(async () => {
  if (!parentRef.value) return
  await preloadImages()
  requestAnimationFrame(() => setup())
})

const setup = () => {
  const container = parentRef.value
  if (!container) return

  // ===== Canvas 尺寸 =====
  const size = Math.min(window.innerWidth, window.innerHeight) * 0.85
  canvasW = size
  canvasH = size
  cx = size / 2
  cy = size / 2
  hexRadius = size * 0.42

  // 更新六边形顶点
  hexPoints[0] = { x: 0, y: -hexRadius }
  hexPoints[1] = { x: hexRadius * Math.cos(DEG * 30), y: -hexRadius * Math.sin(DEG * 30) }
  hexPoints[2] = { x: hexRadius * Math.cos(DEG * 30), y: hexRadius * Math.sin(DEG * 30) }
  hexPoints[3] = { x: 0, y: hexRadius }
  hexPoints[4] = { x: -hexRadius * Math.cos(DEG * 30), y: hexRadius * Math.sin(DEG * 30) }
  hexPoints[5] = { x: -hexRadius * Math.cos(DEG * 30), y: -hexRadius * Math.sin(DEG * 30) }

  const canvas = kaleidoCanvasRef.value
  if (canvas) {
    canvas.width = canvasW
    canvas.height = canvasH
  }

  // 初始渲染
  drawKaleidoscope(0)

  // ===== 初始状态 =====
  gsap.set(frameLayerRef.value, { opacity: 0.7 })
  gsap.set(flaresRef.value, { opacity: 0.4 })
  gsap.set(infoRef.value, { opacity: 0, y: 30 })
  gsap.set(progressBarRef.value, { width: '0%' })

  // ===== 主时间线 =====
  const mainTl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top 85%',
      end: 'bottom 15%',
      scrub: 1.2,
    },
  })

  // 阶段1 (0-20%): 开始旋转，初始状态展示
  mainTl.to(
    {},
    {
      duration: 0.2,
      onUpdate: () => {
        const p = mainTl.progress()
        const rot = gsap.utils.mapRange(0, 0.2, 0, 45)
        currentRotation.value = Math.round(rot(p))
        mandalaAngle.value = rot(p) * 1.5
        sectorRotateDeg.value = Math.round(rot(p))
        activeFace.value = 1 + Math.floor((rot(p) % 360) / 60)
        drawKaleidoscope(rot(p))
      },
    },
    0,
  )

  // 框架渐显
  mainTl.to(frameLayerRef.value, { opacity: 0.9, duration: 0.1 }, 0.05)
  mainTl.to(flaresRef.value, { opacity: 0.7, duration: 0.1 }, 0.08)

  // 阶段2 (20-55%): 快速旋转，展示多面
  mainTl.to(
    {},
    {
      duration: 0.35,
      onUpdate: () => {
        const p = mainTl.progress()
        const rot = gsap.utils.mapRange(0.2, 0.55, 45, 210)
        const rv = rot(p)
        currentRotation.value = Math.round(rv)
        mandalaAngle.value = rv * 2.2
        sectorRotateDeg.value = Math.round(rv)
        activeFace.value = 1 + Math.floor((rv % 360) / 60)
        drawKaleidoscope(rv)
      },
    },
    0.2,
  )

  // 阶段3 (55-80%): 减速，停留展示细节
  mainTl.to(
    {},
    {
      duration: 0.25,
      onUpdate: () => {
        const p = mainTl.progress()
        const rot = gsap.utils.mapRange(0.55, 0.8, 210, 280)
        const rv = rot(p)
        currentRotation.value = Math.round(rv)
        mandalaAngle.value = rv * 3.0
        sectorRotateDeg.value = Math.round(rv)
        activeFace.value = 1 + Math.floor((rv % 360) / 60)
        drawKaleidoscope(rv)
      },
    },
    0.55,
  )

  // 光斑峰值
  mainTl.to(flaresRef.value, { opacity: 0.9, duration: 0.08 }, 0.6)
  mainTl.to(flaresRef.value, { opacity: 0.3, duration: 0.12 }, 0.72)

  // 阶段4 (80-100%): 最终停驻，文字入场
  mainTl.to(
    {},
    {
      duration: 0.2,
      onUpdate: () => {
        const p = mainTl.progress()
        const rot = gsap.utils.mapRange(0.8, 1, 280, 360)
        const rv = rot(p)
        currentRotation.value = Math.round(rv)
        mandalaAngle.value = rv * 3.5
        sectorRotateDeg.value = Math.round(rv)
        activeFace.value = 1 + Math.floor((rv % 360) / 60)
        drawKaleidoscope(rv)
      },
    },
    0.8,
  )

  // 文字入场
  mainTl.to(infoRef.value, { opacity: 1, y: 0, duration: 0.1, ease: 'power2.out' }, 0.85)
  mainTl.to(infoRef.value, { opacity: 0.5, duration: 0.06 }, 0.93)

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
    const size = Math.min(window.innerWidth, window.innerHeight) * 0.85
    canvasW = size
    canvasH = size
    cx = size / 2
    cy = size / 2
    hexRadius = size * 0.42

    hexPoints[0] = { x: 0, y: -hexRadius }
    hexPoints[1] = { x: hexRadius * Math.cos(DEG * 30), y: -hexRadius * Math.sin(DEG * 30) }
    hexPoints[2] = { x: hexRadius * Math.cos(DEG * 30), y: hexRadius * Math.sin(DEG * 30) }
    hexPoints[3] = { x: 0, y: hexRadius }
    hexPoints[4] = { x: -hexRadius * Math.cos(DEG * 30), y: hexRadius * Math.sin(DEG * 30) }
    hexPoints[5] = { x: -hexRadius * Math.cos(DEG * 30), y: -hexRadius * Math.sin(DEG * 30) }

    const canvas = kaleidoCanvasRef.value
    if (canvas) {
      canvas.width = canvasW
      canvas.height = canvasH
    }
    drawKaleidoscope(currentRotation.value)
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
.kp-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: radial-gradient(ellipse at 50% 50%, #14141c 0%, #0a0a10 70%, #050508 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ==================== SVG 隐藏定义 ==================== */
.kp-svg-defs {
  position: absolute;
  width: 0;
  height: 0;
  pointer-events: none;
  z-index: 0;
}

/* ==================== Canvas 渲染层 ==================== */
.kp-canvas {
  position: relative;
  z-index: 1;
  max-width: 85vmin;
  max-height: 85vmin;
  border-radius: 8px;
}

/* ==================== SVG 框架层 ==================== */
.kp-frame-layer {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  will-change: opacity;
}

.kp-frame-svg {
  width: 85vmin;
  height: 85vmin;
  filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.12));
}

/* ==================== 中心曼陀罗 ==================== */
.kp-mandala {
  position: absolute;
  z-index: 3;
  pointer-events: none;
  width: 160px;
  height: 160px;
  will-change: transform;
}

.kp-mandala-arm {
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: 0 50%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
}

.kp-mandala-line {
  width: 55px;
  height: 1.5px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5));
  border-radius: 1px;
}

.kp-mandala-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.7);
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
}

/* ==================== 顶点光斑 ==================== */
.kp-flares {
  position: absolute;
  inset: 0;
  z-index: 4;
  pointer-events: none;
  will-change: opacity;
}

.kp-flare {
  position: absolute;
  width: 20px;
  height: 20px;
  transform: translate(-50%, -50%);
  background: radial-gradient(
    circle at center,
    rgba(255, 255, 255, 0.8) 0%,
    rgba(255, 255, 255, 0.3) 25%,
    rgba(255, 255, 255, 0.05) 60%,
    transparent 100%
  );
  border-radius: 50%;
  animation: flare-pulse 2.5s ease-in-out infinite;

  &:nth-child(1) { animation-delay: 0s; }
  &:nth-child(2) { animation-delay: 0.4s; }
  &:nth-child(3) { animation-delay: 0.8s; }
  &:nth-child(4) { animation-delay: 1.2s; }
  &:nth-child(5) { animation-delay: 1.6s; }
  &:nth-child(6) { animation-delay: 2.0s; }
}

@keyframes flare-pulse {
  0%, 100% {
    opacity: 0.3;
    transform: translate(-50%, -50%) scale(0.8);
  }
  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.4);
  }
}

/* ==================== 暗角 ==================== */
.kp-vignette {
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;
  background: radial-gradient(
    ellipse at 50% 50%,
    transparent 40%,
    rgba(0, 0, 0, 0.2) 70%,
    rgba(0, 0, 0, 0.6) 100%
  );
}

/* ==================== 文字信息 ==================== */
.kp-info {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 6;
  text-align: center;
  pointer-events: none;
  user-select: none;
  will-change: transform, opacity;
}

.kp-info-label {
  display: block;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.25em;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 8px;
}

.kp-info-title {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-size: 38px;
  font-weight: 800;
  color: #fff;
  margin: 0 0 6px;
  letter-spacing: -0.02em;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.5);
}

.kp-info-sub {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.4);
  margin: 0 0 12px;
  letter-spacing: 0.08em;
}

.kp-info-divider {
  width: 40px;
  height: 2px;
  margin: 0 auto 12px;
  border-radius: 1px;
  background: linear-gradient(90deg,
    #ff6b6b, #ffa500, #ffe066, #69db7c, #4dabf7, #9775fa
  );
}

.kp-info-desc {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.38);
  margin: 0;
}

/* ==================== 进度指示器 ==================== */
.kp-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  z-index: 7;
  pointer-events: none;
}

.kp-progress-bar {
  height: 100%;
  background: linear-gradient(90deg,
    #ff6b6b, #ffa500, #ffe066, #69db7c, #4dabf7, #9775fa
  );
  width: 0%;
  will-change: width;
}

/* ==================== 响应式 ==================== */
@media (max-width: 768px) {
  .kp-info-title {
    font-size: 28px;
  }

  .kp-mandala {
    width: 120px;
    height: 120px;
  }

  .kp-mandala-line {
    width: 40px;
  }
}
</style>
