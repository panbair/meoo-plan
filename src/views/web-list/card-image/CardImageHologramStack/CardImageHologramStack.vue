<template>
  <section ref="parentRef" class="hs-container">
    <!-- ==================== SVG 定义：通道分离 + 发光滤镜 ==================== -->
    <svg class="hs-svg-defs" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <!-- 红色通道提取 -->
        <filter id="hs-red-channel" color-interpolation-filters="sRGB">
          <feColorMatrix type="matrix" values="
            1 0 0 0 0
            0 0 0 0 0
            0 0 0 0 0
            0 0 0 1 0
          " />
        </filter>

        <!-- 绿色通道提取 -->
        <filter id="hs-green-channel" color-interpolation-filters="sRGB">
          <feColorMatrix type="matrix" values="
            0 0 0 0 0
            0 1 0 0 0
            0 0 0 0 0
            0 0 0 1 0
          " />
        </filter>

        <!-- 蓝色通道提取 -->
        <filter id="hs-blue-channel" color-interpolation-filters="sRGB">
          <feColorMatrix type="matrix" values="
            0 0 0 0 0
            0 0 0 0 0
            0 0 1 0 0
            0 0 0 1 0
          " />
        </filter>

        <!-- 发光滤镜 -->
        <filter id="hs-glow" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
    </svg>

    <!-- ==================== Layer 1: 红色通道层 ==================== -->
    <div ref="redLayerRef" class="hs-layer hs-red">
      <img :src="imageSrc" class="hs-img hs-img-red" crossorigin="anonymous" />
    </div>

    <!-- ==================== Layer 2: 绿色通道层 ==================== -->
    <div ref="greenLayerRef" class="hs-layer hs-green">
      <img :src="imageSrc" class="hs-img hs-img-green" crossorigin="anonymous" />
    </div>

    <!-- ==================== Layer 3: 蓝色通道层 ==================== -->
    <div ref="blueLayerRef" class="hs-layer hs-blue">
      <img :src="imageSrc" class="hs-img hs-img-blue" crossorigin="anonymous" />
    </div>

    <!-- ==================== Layer 4: 全息扫描线 ==================== -->
    <div ref="scanRef" class="hs-scan">
      <div ref="scanGlowRef" class="hs-scan-glow"></div>
      <div ref="scanLineRef" class="hs-scan-line"></div>
    </div>

    <!-- ==================== Layer 5: 全息底片网格 ==================== -->
    <div ref="gridRef" class="hs-grid"></div>

    <!-- ==================== Layer 6: RGB 闪烁噪点 ==================== -->
    <canvas ref="noiseCanvasRef" class="hs-noise"></canvas>

    <!-- ==================== 全息边框 ==================== -->
    <div ref="borderRef" class="hs-border">
      <span class="hs-border-corner hs-border-tl"></span>
      <span class="hs-border-corner hs-border-tr"></span>
      <span class="hs-border-corner hs-border-bl"></span>
      <span class="hs-border-corner hs-border-br"></span>
    </div>

    <!-- ==================== 信息面板 ==================== -->
    <div ref="infoRef" class="hs-info">
      <span class="hs-info-label">HOLOGRAM STACK</span>
      <h2 class="hs-info-title">全息图层堆叠</h2>
      <div class="hs-info-divider"></div>
      <span class="hs-info-specs">
        RGB 通道对齐率 {{ alignmentPercent }}% · 扫描线 {{ scanPos }}%
      </span>
    </div>

    <!-- ==================== 进度指示器 ==================== -->
    <div ref="progressRef" class="hs-progress">
      <div ref="progressBarRef" class="hs-progress-bar"></div>
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
const greenLayerRef = ref<HTMLElement | null>(null)
const blueLayerRef = ref<HTMLElement | null>(null)
const scanRef = ref<HTMLElement | null>(null)
const scanGlowRef = ref<HTMLElement | null>(null)
const scanLineRef = ref<HTMLElement | null>(null)
const gridRef = ref<HTMLElement | null>(null)
const noiseCanvasRef = ref<HTMLCanvasElement | null>(null)
const borderRef = ref<HTMLElement | null>(null)
const infoRef = ref<HTMLElement | null>(null)
const progressRef = ref<HTMLElement | null>(null)
const progressBarRef = ref<HTMLElement | null>(null)

// ======== 响应式状态 ========
const alignmentPercent = ref(0)
const scanPos = ref(0)

const cleanupFns: TweenCleanup[] = []
let noiseIntervalId = 0
let canvasW = 0
let canvasH = 0

// ======== 图片资源 (单张) ========
const imageSrc = 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1400&q=80'

// ======== RGB 噪点渲染 ========
const renderNoise = () => {
  const canvas = noiseCanvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const { width, height } = canvas
  ctx.clearRect(0, 0, width, height)

  // 随机散布 RGB 彩色像素点
  const dotCount = Math.floor((width * height) / 800)
  for (let i = 0; i < dotCount; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    const type = Math.floor(Math.random() * 4)

    switch (type) {
      case 0:
        ctx.fillStyle = `rgba(255, ${Math.floor(Math.random() * 80)}, ${Math.floor(Math.random() * 80)}, ${0.15 + Math.random() * 0.25})`
        break
      case 1:
        ctx.fillStyle = `rgba(${Math.floor(Math.random() * 80)}, 255, ${Math.floor(Math.random() * 80)}, ${0.15 + Math.random() * 0.25})`
        break
      case 2:
        ctx.fillStyle = `rgba(${Math.floor(Math.random() * 80)}, ${Math.floor(Math.random() * 80)}, 255, ${0.15 + Math.random() * 0.25})`
        break
      case 3:
        ctx.fillStyle = `rgba(255, 255, 255, ${0.05 + Math.random() * 0.15})`
        break
    }

    const size = 0.8 + Math.random() * 2.5
    ctx.fillRect(x, y, size, size)
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
  const noiseCanvas = noiseCanvasRef.value
  if (noiseCanvas) {
    noiseCanvas.width = canvasW
    noiseCanvas.height = canvasH
  }

  // 启动噪点定时刷新
  renderNoise()
  noiseIntervalId = window.setInterval(renderNoise, 100)

  // ===== 初始状态 =====
  const maxOffset = 14
  gsap.set(redLayerRef.value, { x: -maxOffset, opacity: 0.9 })
  gsap.set(greenLayerRef.value, { x: 0, opacity: 0.9 })
  gsap.set(blueLayerRef.value, { x: maxOffset, opacity: 0.9 })

  gsap.set(scanRef.value, { top: '0%' })
  gsap.set(gridRef.value, { opacity: 0.5 })
  gsap.set(borderRef.value, { opacity: 0.5 })
  gsap.set(infoRef.value, { opacity: 0, y: 15 })
  gsap.set(progressBarRef.value, { width: '0%' })

  alignmentPercent.value = 0
  scanPos.value = 0

  // ===== 主时间线 =====
  const mainTl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top 85%',
      end: 'bottom 15%',
      scrub: 1.2,
    },
  })

  // 色差对齐动画 (0→100% 进度中 offset 从 maxOffset → 0)
  mainTl.to(
    {},
    {
      duration: 1,
      onUpdate: () => {
        const p = mainTl.progress()
        const eased = p

        // 色差偏移量：14px → 0px
        const offset = maxOffset * (1 - eased)

        const redEl = redLayerRef.value
        const greenEl = greenLayerRef.value
        const blueEl = blueLayerRef.value
        const scanEl = scanRef.value

        if (redEl) redEl.style.transform = `translateX(${-offset}px)`
        if (greenEl) greenEl.style.transform = 'translateX(0px)'
        if (blueEl) blueEl.style.transform = `translateX(${offset}px)`

        // 扫描线位置
        if (scanEl) scanEl.style.top = `${eased * 100}%`

        // 更新显示
        alignmentPercent.value = Math.round(eased * 100)
        scanPos.value = Math.round(eased * 100)
      },
    },
    0,
  )

  // 网格透明度：初始高点，对齐后降低
  mainTl.to(gridRef.value, { opacity: 0.15, duration: 0.6 }, 0.4)
  mainTl.to(gridRef.value, { opacity: 0.35, duration: 0.4 }, 0.9)

  // 边框闪烁
  mainTl.to(borderRef.value, { opacity: 0.8, duration: 0.1 }, 0.05)
  mainTl.to(borderRef.value, { opacity: 0.3, duration: 0.15 }, 0.25)
  mainTl.to(borderRef.value, { opacity: 0.9, duration: 0.1 }, 0.55)
  mainTl.to(borderRef.value, { opacity: 0.25, duration: 0.15 }, 0.75)
  mainTl.to(borderRef.value, { opacity: 0.95, duration: 0.1 }, 0.9)

  // 信息面板入场
  mainTl.to(infoRef.value, { opacity: 1, y: 0, duration: 0.1, ease: 'power2.out' }, 0.05)

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
    const noiseCanvas = noiseCanvasRef.value
    if (noiseCanvas) {
      noiseCanvas.width = canvasW
      noiseCanvas.height = canvasH
    }
    renderNoise()
  }, 300)
}

window.addEventListener('resize', handleResize)

onUnmounted(() => {
  if (resizeTimeout) clearTimeout(resizeTimeout)
  if (noiseIntervalId) clearInterval(noiseIntervalId)
  window.removeEventListener('resize', handleResize)
  cleanupFns.forEach((fn) => fn())
})
</script>

<style lang="scss" scoped>
/* ==================== 容器 ==================== */
.hs-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #020208;
}

/* ==================== SVG 隐藏定义 ==================== */
.hs-svg-defs {
  position: absolute;
  width: 0;
  height: 0;
  pointer-events: none;
}

/* ==================== 通道图层 ==================== */
.hs-layer {
  position: absolute;
  inset: 0;
  overflow: hidden;
  will-change: transform;
}

.hs-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hs-img-red {
  filter: url(#hs-red-channel) brightness(0.9);
}

.hs-img-green {
  filter: url(#hs-green-channel) brightness(1.0);
}

.hs-img-blue {
  filter: url(#hs-blue-channel) brightness(0.9);
}

/* 混合模式：screen 叠加产生合成图像 */
.hs-red {
  z-index: 1;
  mix-blend-mode: screen;
  background: transparent;
}

.hs-green {
  z-index: 2;
  mix-blend-mode: screen;
  background: transparent;
}

.hs-blue {
  z-index: 3;
  mix-blend-mode: screen;
  background: transparent;
}

/* ==================== 全息扫描线 ==================== */
.hs-scan {
  position: absolute;
  left: 3%;
  right: 3%;
  top: 0;
  z-index: 10;
  pointer-events: none;
  height: 0;
}

/* 扫描辉光区域 */
.hs-scan-glow {
  position: absolute;
  left: 0;
  right: 0;
  top: -60px;
  height: 120px;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(0, 255, 200, 0.02) 25%,
    rgba(0, 255, 200, 0.08) 50%,
    rgba(0, 255, 200, 0.02) 75%,
    transparent 100%
  );
  filter: url(#hs-glow);
}

/* 扫描线本身 */
.hs-scan-line {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(0, 255, 200, 0.25) 15%,
    rgba(0, 255, 200, 0.7) 40%,
    rgba(0, 255, 200, 0.9) 50%,
    rgba(0, 255, 200, 0.7) 60%,
    rgba(0, 255, 200, 0.25) 85%,
    transparent 100%
  );
  box-shadow:
    0 0 6px rgba(0, 255, 200, 0.5),
    0 0 16px rgba(0, 255, 200, 0.25),
    0 0 30px rgba(0, 255, 200, 0.1);
  animation: scanLinePulse 2s ease-in-out infinite;
}

@keyframes scanLinePulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

/* ==================== 全息底片网格 ==================== */
.hs-grid {
  position: absolute;
  inset: 0;
  z-index: 4;
  pointer-events: none;
  opacity: 0.5;
  background-image:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0, 255, 200, 0.04) 2px,
      rgba(0, 255, 200, 0.04) 3px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 2px,
      rgba(0, 255, 200, 0.04) 2px,
      rgba(0, 255, 200, 0.04) 3px
    );
  mix-blend-mode: overlay;
}

/* ==================== RGB 噪点 ==================== */
.hs-noise {
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;
  mix-blend-mode: screen;
  opacity: 0.5;
}

/* ==================== 全息边框 ==================== */
.hs-border {
  position: absolute;
  inset: 3%;
  z-index: 11;
  pointer-events: none;
  opacity: 0.5;
}

.hs-border-corner {
  position: absolute;
  width: 50px;
  height: 50px;
  border-color: rgba(0, 255, 200, 0.5);
  border-style: solid;
  filter: drop-shadow(0 0 6px rgba(0, 255, 200, 0.3));
}

.hs-border-tl { top: 0; left: 0; border-width: 1.5px 0 0 1.5px; animation: cornerGlowTL 3s ease-in-out infinite; }
.hs-border-tr { top: 0; right: 0; border-width: 1.5px 1.5px 0 0; animation: cornerGlowTR 3s ease-in-out infinite 0.75s; }
.hs-border-bl { bottom: 0; left: 0; border-width: 0 0 1.5px 1.5px; animation: cornerGlowBL 3s ease-in-out infinite 1.5s; }
.hs-border-br { bottom: 0; right: 0; border-width: 0 1.5px 1.5px 0; animation: cornerGlowBR 3s ease-in-out infinite 2.25s; }

@keyframes cornerGlowTL {
  0%, 100% { border-color: rgba(0, 255, 200, 0.3); }
  50% { border-color: rgba(0, 255, 200, 0.7); }
}
@keyframes cornerGlowTR {
  0%, 100% { border-color: rgba(0, 255, 200, 0.3); }
  50% { border-color: rgba(0, 255, 200, 0.7); }
}
@keyframes cornerGlowBL {
  0%, 100% { border-color: rgba(0, 255, 200, 0.3); }
  50% { border-color: rgba(0, 255, 200, 0.7); }
}
@keyframes cornerGlowBR {
  0%, 100% { border-color: rgba(0, 255, 200, 0.3); }
  50% { border-color: rgba(0, 255, 200, 0.7); }
}

/* ==================== 信息面板 ==================== */
.hs-info {
  position: absolute;
  bottom: 10%;
  left: 8%;
  z-index: 12;
  pointer-events: none;
  max-width: 340px;
}

.hs-info-label {
  display: block;
  font-family: 'Courier New', monospace;
  font-size: 11px;
  letter-spacing: 4px;
  color: rgba(0, 255, 200, 0.5);
  text-transform: uppercase;
  margin-bottom: 6px;
}

.hs-info-title {
  margin: 0 0 8px;
  font-size: clamp(22px, 3vw, 34px);
  font-weight: 300;
  color: rgba(0, 255, 200, 0.9);
  letter-spacing: 6px;
  text-shadow: 0 0 20px rgba(0, 255, 200, 0.2);
}

.hs-info-divider {
  width: 40px;
  height: 1px;
  background: rgba(0, 255, 200, 0.3);
  margin: 8px 0 10px;
}

.hs-info-specs {
  font-family: 'Courier New', monospace;
  font-size: 10px;
  letter-spacing: 1.5px;
  color: rgba(0, 255, 200, 0.35);
}

/* ==================== 进度条 ==================== */
.hs-progress {
  position: absolute;
  bottom: 3%;
  left: 8%;
  right: 8%;
  height: 1.5px;
  background: rgba(0, 255, 200, 0.06);
  z-index: 12;
  pointer-events: none;
}

.hs-progress-bar {
  height: 100%;
  background: linear-gradient(90deg,
    rgba(255, 60, 60, 0.5),
    rgba(0, 255, 80, 0.5),
    rgba(60, 60, 255, 0.5)
  );
  width: 0%;
  box-shadow: 0 0 8px rgba(0, 255, 200, 0.2);
}
</style>
