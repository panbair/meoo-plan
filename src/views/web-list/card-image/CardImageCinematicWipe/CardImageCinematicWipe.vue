<template>
  <section ref="parentRef" class="cw-container">
    <!-- ==================== SVG 滤镜定义 ==================== -->
    <svg class="cw-svg-defs" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <filter id="cw-vignette-filter" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="40" result="blur" />
          <feComponentTransfer in="blur" result="vignette">
            <feFuncA type="linear" slope="1" />
          </feComponentTransfer>
        </filter>
      </defs>
    </svg>

    <!-- ==================== Layer 1-5: Canvas 图片序列渲染 ==================== -->
    <canvas ref="mainCanvasRef" class="cw-canvas"></canvas>

    <!-- ==================== Layer 7: 黑色颗粒叠加 ==================== -->
    <canvas ref="grainCanvasRef" class="cw-grain"></canvas>

    <!-- ==================== Layer 7: 电影上下黑边 ==================== -->
    <div class="cw-cinema-bar cw-bar-top"></div>
    <div class="cw-cinema-bar cw-bar-bottom"></div>

    <!-- ==================== Layer 7: 胶片齿孔装饰 ==================== -->
    <div class="cw-film-holes cw-holes-left">
      <span v-for="i in 12" :key="'l'+i" class="cw-hole"></span>
    </div>
    <div class="cw-film-holes cw-holes-right">
      <span v-for="i in 12" :key="'r'+i" class="cw-hole"></span>
    </div>

    <!-- ==================== Layer 8: 字幕层 ==================== -->
    <div ref="subtitleRef" class="cw-subtitle">
      <span class="cw-subtitle-index">SCENE {{ currentImage + 1 }} / {{ imageCount }}</span>
      <h2 class="cw-subtitle-title">{{ currentTitle }}</h2>
      <span class="cw-subtitle-wipe">{{ currentWipeName }}</span>
      <div class="cw-subtitle-line"></div>
    </div>

    <!-- ==================== 进度指示器 (底部) ==================== -->
    <div ref="progressRef" class="cw-progress">
      <div ref="progressBarRef" class="cw-progress-bar"></div>
    </div>

    <!-- ==================== 角标：当前划像类型 ==================== -->
    <div ref="wipeLabelRef" class="cw-wipe-label">
      <span class="cw-wipe-label-text">{{ currentWipeIcon }}</span>
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
type WipeType = 'horizontal' | 'blinds' | 'circle' | 'star' | 'diamond'

interface ImageData {
  url: string
  title: string
  wipeLabel: string
}

// ======== 模板引用 ========
const parentRef = ref<HTMLElement | null>(null)
const mainCanvasRef = ref<HTMLCanvasElement | null>(null)
const grainCanvasRef = ref<HTMLCanvasElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const progressRef = ref<HTMLElement | null>(null)
const progressBarRef = ref<HTMLElement | null>(null)
const wipeLabelRef = ref<HTMLElement | null>(null)

// ======== 响应式状态 ========
const imageCount = 5
const currentImage = ref(1)
const currentTitle = ref('')
const currentWipeName = ref('')
const currentWipeIcon = ref('')

const cleanupFns: TweenCleanup[] = []

// ======== 图片资源 ========
const imageMeta: ImageData[] = [
  {
    url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1400&q=80',
    title: '都市交响曲',
    wipeLabel: '线形划像',
  },
  {
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400&q=80',
    title: '远山呼唤',
    wipeLabel: '百叶窗式',
  },
  {
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&q=80',
    title: '碧海潮生',
    wipeLabel: '圆形扩展',
  },
  {
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1400&q=80',
    title: '林深见鹿',
    wipeLabel: '星形擦除',
  },
  {
    url: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=1400&q=80',
    title: '大漠孤烟',
    wipeLabel: '菱形揭示',
  },
]

const wipeNames: Record<WipeType, string> = {
  horizontal: 'Horizontal Line Wipe',
  blinds: 'Vertical Blinds Wipe',
  circle: 'Circle Expand Wipe',
  star: 'Star Erase Wipe',
  diamond: 'Diamond Reveal Wipe',
}

const wipeIcons: Record<WipeType, string> = {
  horizontal: '⟷ 线形',
  blinds: '▮ 百叶窗',
  circle: '● 圆形',
  star: '★ 星形',
  diamond: '◆ 菱形',
}

const wipeSequence: { from: number; to: number; start: number; end: number; wipe: WipeType }[] = [
  { from: 0, to: 1, start: 0.00, end: 0.22, wipe: 'horizontal' },
  { from: 1, to: 2, start: 0.22, end: 0.44, wipe: 'blinds' },
  { from: 2, to: 3, start: 0.44, end: 0.66, wipe: 'circle' },
  { from: 3, to: 4, start: 0.66, end: 1.00, wipe: 'star' },
]

const loadedImages: HTMLImageElement[] = []

// ======== Canvas 尺寸 ========
let canvasW = 0
let canvasH = 0

// ======== 预加载图片 ========
const preloadImages = (): Promise<void> => {
  return new Promise((resolve) => {
    let loaded = 0
    imageMeta.forEach((meta, idx) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = meta.url
      img.onload = () => {
        loadedImages[idx] = img
        loaded++
        if (loaded === imageCount) resolve()
      }
      img.onerror = () => {
        loadedImages[idx] = img
        loaded++
        if (loaded === imageCount) resolve()
      }
    })
  })
}

// ======== 绘制完整图片 ========
const drawFullImage = (index: number) => {
  const canvas = mainCanvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const img = loadedImages[index]
  if (!img) return

  ctx.clearRect(0, 0, canvasW, canvasH)
  ctx.drawImage(img, 0, 0, canvasW, canvasH)
}

// ======== 绘制转场 ========
const drawTransition = (fromIdx: number, toIdx: number, t: number, wipeType: WipeType) => {
  const canvas = mainCanvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const fromImg = loadedImages[fromIdx]
  const toImg = loadedImages[toIdx]
  if (!fromImg || !toImg) return

  const cx = canvasW / 2
  const cy = canvasH / 2
  const maxR = Math.hypot(cx, cy)

  ctx.clearRect(0, 0, canvasW, canvasH)

  // 绘制底图 (from image)
  ctx.drawImage(fromImg, 0, 0, canvasW, canvasH)

  // 绘制划像遮罩 + 目标图 (to image)
  ctx.save()
  ctx.beginPath()

  switch (wipeType) {
    case 'horizontal': {
      // 水平线从左向右推进
      const w = canvasW * t
      ctx.rect(0, 0, w, canvasH)
      break
    }

    case 'blinds': {
      // 垂直百叶窗：10条竖条，前后各有偏移
      const stripCount = 10
      const stripW = canvasW / stripCount
      for (let i = 0; i < stripCount; i++) {
        const stripT = gsap.utils.clamp(0, 1, (t - i / stripCount) * (stripCount / (stripCount - 1)))
        const x = i * stripW
        const w = stripW * stripT
        ctx.rect(x, 0, w, canvasH)
      }
      break
    }

    case 'circle': {
      // 圆形从中心扩展
      const r = maxR * t
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      break
    }

    case 'star': {
      // 五角星从中心扩展
      const points = 5
      const outerR = maxR * t
      const innerR = outerR * 0.4
      for (let i = 0; i < points * 2; i++) {
        const angle = (i * Math.PI) / points - Math.PI / 2
        const r = i % 2 === 0 ? outerR : innerR
        const x = cx + Math.cos(angle) * r
        const y = cy + Math.sin(angle) * r
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
      break
    }

    case 'diamond': {
      // 菱形从中心扩展
      const r = maxR * t
      ctx.moveTo(cx, cy - r)
      ctx.lineTo(cx + r, cy)
      ctx.lineTo(cx, cy + r)
      ctx.lineTo(cx - r, cy)
      ctx.closePath()
      break
    }
  }

  ctx.clip()
  ctx.drawImage(toImg, 0, 0, canvasW, canvasH)
  ctx.restore()
}

// ======== 渲染当前帧 ========
const renderFrame = (progress: number) => {
  const p = gsap.utils.clamp(0, 1, progress)

  // 查找当前所在段落
  let activeSegment: (typeof wipeSequence)[number] | null = null

  for (const seg of wipeSequence) {
    if (p >= seg.start && p < seg.end) {
      activeSegment = seg
      break
    }
  }

  if (!activeSegment) {
    if (p >= 1) {
      // 最后一张图片 + 菱形装饰揭示
      drawFullImage(4)
      currentImage.value = 5
      currentTitle.value = imageMeta[4].title
      currentWipeName.value = wipeNames['diamond']
      currentWipeIcon.value = wipeIcons['diamond']
    } else {
      drawFullImage(0)
      currentImage.value = 1
      currentTitle.value = imageMeta[0].title
      currentWipeName.value = ''
      currentWipeIcon.value = ''
    }
    return
  }

  const { from, to, wipe } = activeSegment
  const segmentT = (p - activeSegment.start) / (activeSegment.end - activeSegment.start)
  const easedT = gsap.utils.clamp(0, 1, segmentT)

  drawTransition(from, to, easedT, wipe)

  // 更新UI状态
  if (easedT < 0.5) {
    currentImage.value = from + 1
    currentTitle.value = imageMeta[from].title
  } else {
    currentImage.value = to + 1
    currentTitle.value = imageMeta[to].title
  }
  currentWipeName.value = wipeNames[wipe]
  currentWipeIcon.value = wipeIcons[wipe]
}

// ======== 胶片颗粒渲染 ========
let grainFrameId = 0
const renderGrain = () => {
  const canvas = grainCanvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return

  const { width, height } = canvas
  const imageData = ctx.createImageData(width, height)
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    const noise = Math.random() * 25
    data[i] = noise
    data[i + 1] = noise
    data[i + 2] = noise
    data[i + 3] = Math.random() * 40
  }

  ctx.putImageData(imageData, 0, 0)
  grainFrameId = requestAnimationFrame(renderGrain)
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
  const mainCanvas = mainCanvasRef.value
  const grainCanvas = grainCanvasRef.value

  canvasW = window.innerWidth
  canvasH = window.innerHeight

  if (mainCanvas) {
    mainCanvas.width = canvasW
    mainCanvas.height = canvasH
  }
  if (grainCanvas) {
    grainCanvas.width = canvasW
    grainCanvas.height = canvasH
  }

  // 初始渲染
  drawFullImage(0)
  currentImage.value = 1
  currentTitle.value = imageMeta[0].title
  currentWipeName.value = ''
  currentWipeIcon.value = ''

  // 启动颗粒动画
  renderGrain()

  // ===== 初始状态 =====
  gsap.set(subtitleRef.value, { opacity: 0, y: 20 })
  gsap.set(wipeLabelRef.value, { opacity: 0, scale: 0.8 })
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

  // 空 tween 驱动 onUpdate 渲染
  mainTl.to(
    {},
    {
      duration: 1,
      onUpdate: () => {
        const p = mainTl.progress()
        renderFrame(p)
      },
    },
    0,
  )

  // 字幕入场
  mainTl.to(subtitleRef.value, { opacity: 1, y: 0, duration: 0.08, ease: 'power2.out' }, 0.01)
  mainTl.to(wipeLabelRef.value, { opacity: 0.7, scale: 1, duration: 0.05 }, 0.02)

  // 进度条
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
    const mainCanvas = mainCanvasRef.value
    const grainCanvas = grainCanvasRef.value
    if (mainCanvas) {
      mainCanvas.width = canvasW
      mainCanvas.height = canvasH
    }
    if (grainCanvas) {
      grainCanvas.width = canvasW
      grainCanvas.height = canvasH
    }
    // 重绘当前状态
    const tl = gsap.getTweensOf({})
    // 简单重绘第一张
    drawFullImage(currentImage.value - 1)
  }, 300)
}

window.addEventListener('resize', handleResize)

onUnmounted(() => {
  if (resizeTimeout) clearTimeout(resizeTimeout)
  window.removeEventListener('resize', handleResize)
  if (grainFrameId) cancelAnimationFrame(grainFrameId)
  cleanupFns.forEach((fn) => fn())
})
</script>

<style lang="scss" scoped>
/* ==================== 容器 ==================== */
.cw-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #000;
}

/* ==================== SVG 隐藏定义 ==================== */
.cw-svg-defs {
  position: absolute;
  width: 0;
  height: 0;
  pointer-events: none;
}

/* ==================== 主 Canvas ==================== */
.cw-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ==================== 胶片颗粒层 ==================== */
.cw-grain {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 3;
  mix-blend-mode: overlay;
  opacity: 0.6;
}

/* ==================== 电影上下黑边 ==================== */
.cw-cinema-bar {
  position: absolute;
  left: 0;
  right: 0;
  height: 8%;
  background: #000;
  z-index: 4;
  pointer-events: none;
}

.cw-bar-top {
  top: 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);
}

.cw-bar-bottom {
  bottom: 0;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.8);
}

/* ==================== 胶片齿孔 ==================== */
.cw-film-holes {
  position: absolute;
  top: 8%;
  bottom: 8%;
  width: 16px;
  z-index: 5;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2% 0;
}

.cw-holes-left {
  left: 8px;
}

.cw-holes-right {
  right: 8px;
}

.cw-hole {
  display: block;
  width: 12px;
  height: 8px;
  background: #000;
  border-radius: 2px;
  opacity: 0.5;
}

/* ==================== 字幕层 ==================== */
.cw-subtitle {
  position: absolute;
  bottom: 14%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 6;
  text-align: center;
  pointer-events: none;
}

.cw-subtitle-index {
  display: block;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  letter-spacing: 4px;
  color: rgba(255, 255, 255, 0.55);
  margin-bottom: 10px;
  text-transform: uppercase;
}

.cw-subtitle-title {
  margin: 0 0 8px;
  font-size: clamp(28px, 4vw, 48px);
  font-weight: 700;
  color: #fff;
  letter-spacing: 4px;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.6);
}

.cw-subtitle-wipe {
  display: block;
  font-family: 'Courier New', monospace;
  font-size: 11px;
  letter-spacing: 3px;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
}

.cw-subtitle-line {
  width: 60px;
  height: 2px;
  background: rgba(255, 255, 255, 0.4);
  margin: 12px auto 0;
}

/* ==================== 进度条 ==================== */
.cw-progress {
  position: absolute;
  bottom: 8.5%;
  left: 12%;
  right: 12%;
  height: 2px;
  background: rgba(255, 255, 255, 0.1);
  z-index: 6;
  pointer-events: none;
}

.cw-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.3));
  width: 0%;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
}

/* ==================== 划像角标 ==================== */
.cw-wipe-label {
  position: absolute;
  top: 4%;
  right: 5%;
  z-index: 6;
  pointer-events: none;
  padding: 6px 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.45);
}

.cw-wipe-label-text {
  font-family: 'Courier New', monospace;
  font-size: 13px;
  letter-spacing: 2px;
  color: rgba(255, 255, 255, 0.7);
}
</style>
