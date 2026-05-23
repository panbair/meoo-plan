<template>
  <section ref="sectionRef" class="shadow-puppet-section">
    <!-- 戏台背景（暖黄底光） -->
    <div class="backstage-bg">
      <div class="warm-glow"></div>
      <div class="stage-curtains"></div>
    </div>

    <!-- 完整彩色原图（幕布后面） -->
    <img
      ref="imageRef"
      :src="imageUrl"
      alt=""
      class="source-image"
      crossorigin="anonymous"
    />

    <!-- Canvas 幕布叠加层（剪影+镂空） -->
    <canvas ref="curtainCanvasRef" class="curtain-canvas"></canvas>

    <!-- 牛皮纸纹理（feTurbulence 叠加在幕布上） -->
    <svg
      class="leather-texture"
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
    >
      <filter id="leatherTex">
        <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="5" result="noise" />
        <feColorMatrix
          type="matrix"
          in="noise"
          values="0 0 0 0 0.12   0 0 0 0 0.09   0 0 0 0 0.06   0 0 0 0.10 0"
        />
      </filter>
      <rect width="100%" height="100%" filter="url(#leatherTex)" />
    </svg>

    <!-- 镂空边缘微光 -->
    <div ref="cutoutGlowRef" class="cutout-glow"></div>

    <!-- 文字覆盖层 -->
    <div ref="contentRef" class="content-overlay">
      <h2 class="title">Shadow Puppet</h2>
      <p class="subtitle">Chinese Shadow Play · Layered Cutout</p>
      <div class="divider"></div>
      <p class="desc">皮影戏 · 剪影镂空 · 层次透光 · 关节渐显</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []

const imageUrl = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80'

// ==================== Refs ====================
const sectionRef   = ref<HTMLElement | null>(null)
const imageRef     = ref<HTMLImageElement | null>(null)
const curtainCanvasRef = ref<HTMLCanvasElement | null>(null)
const cutoutGlowRef = ref<HTMLElement | null>(null)
const contentRef   = ref<HTMLElement | null>(null)

// ==================== Canvas 状态 ====================
let curtainCtx: CanvasRenderingContext2D | null = null
let canvasW = 0, canvasH = 0
let dpr = 1

// 三阶阈值掩码（0=纯黑幕布, 255=透出原图）
let maskCoarse: Uint8ClampedArray | null = null   // threshold 30
let maskMedium: Uint8ClampedArray | null = null   // threshold 100
let maskFine: Uint8ClampedArray | null = null     // threshold 180
let blackMask: Uint8ClampedArray | null = null    // 全黑（全遮盖）
let imageDataBuffer: ImageData | null = null      // 当前帧缓冲区

// 当前滚动进度
let scrollProgress = 0

/** 计算像素亮度 */
function brightness(r: number, g: number, b: number): number {
  return 0.299 * r + 0.587 * g + 0.114 * b
}

/** 对原图生成阈值掩码（white=镂空/透明, black=幕布） */
function generateThresholdMask(
  srcData: Uint8ClampedArray,
  threshold: number,
  width: number,
  height: number,
): Uint8ClampedArray {
  const len = width * height * 4
  const mask = new Uint8ClampedArray(len)
  for (let i = 0; i < len; i += 4) {
    const bri = brightness(srcData[i], srcData[i + 1], srcData[i + 2])
    if (bri > threshold) {
      // 镂空（白色 = 透明）
      mask[i] = 255
      mask[i + 1] = 255
      mask[i + 2] = 255
      mask[i + 3] = 255
    } else {
      // 幕布（黑色 = 不透明）
      mask[i] = 0
      mask[i + 1] = 0
      mask[i + 2] = 0
      mask[i + 3] = 255
    }
  }
  return mask
}

/** 两帧掩码之间混合（线性插值） */
function blendMasks(
  maskA: Uint8ClampedArray,
  maskB: Uint8ClampedArray,
  t: number,
): void {
  if (!imageDataBuffer) return
  const data = imageDataBuffer.data
  const len = data.length
  const tClamped = Math.max(0, Math.min(1, t))
  for (let i = 0; i < len; i += 4) {
    const v = maskA[i] + (maskB[i] - maskA[i]) * tClamped
    const vc = Math.max(0, Math.min(255, Math.round(v)))
    data[i] = vc
    data[i + 1] = vc
    data[i + 2] = vc
    data[i + 3] = 255
  }
}

/** 根据滚动进度，生成当前帧掩码并绘制到幕布 Canvas */
function updateCurtain(progress: number) {
  if (!curtainCtx || !maskCoarse || !maskMedium || !maskFine || !blackMask || !imageDataBuffer) return

  let t: number
  if (progress < 0.30) {
    // 阶段一：全黑 → 粗轮廓 (0→30%)
    t = progress / 0.30
    blendMasks(blackMask, maskCoarse, t)
  } else if (progress < 0.65) {
    // 阶段二：粗轮廓 → 中景细节 (30%→65%)
    t = (progress - 0.30) / 0.35
    blendMasks(maskCoarse, maskMedium, t)
  } else {
    // 阶段三：中景细节 → 精细细节 (65%→100%)
    t = (progress - 0.65) / 0.35
    blendMasks(maskMedium, maskFine, t)
  }

  curtainCtx.putImageData(imageDataBuffer, 0, 0)
}

/** 初始化所有掩码 */
async function initMasks() {
  if (!imageRef.value || !curtainCanvasRef.value) return

  const img = imageRef.value
  const canvas = curtainCanvasRef.value
  const rect = canvas.getBoundingClientRect()

  dpr = window.devicePixelRatio || 1
  canvasW = rect.width * dpr
  canvasH = rect.height * dpr

  canvas.width = canvasW
  canvas.height = canvasH
  curtainCtx = canvas.getContext('2d')
  if (!curtainCtx) return

  // 用离屏 Canvas 读取图片像素
  const offscreen = document.createElement('canvas')
  offscreen.width = canvasW
  offscreen.height = canvasH
  const offCtx = offscreen.getContext('2d')
  if (!offCtx) return
  offCtx.drawImage(img, 0, 0, canvasW, canvasH)
  const srcImageData = offCtx.getImageData(0, 0, canvasW, canvasH)
  const srcData = srcImageData.data

  // 生成三阶阈值掩码
  maskCoarse = generateThresholdMask(srcData, 30, canvasW, canvasH)
  maskMedium = generateThresholdMask(srcData, 100, canvasW, canvasH)
  maskFine   = generateThresholdMask(srcData, 180, canvasW, canvasH)

  // 全黑掩码
  const len = canvasW * canvasH * 4
  blackMask = new Uint8ClampedArray(len)
  blackMask.fill(0)
  for (let i = 3; i < len; i += 4) blackMask[i] = 255

  // 创建图像数据缓冲区
  imageDataBuffer = new ImageData(canvasW, canvasH)

  // 第一帧：全黑
  updateCurtain(0)
}

// ==================== GSAP ====================
onMounted(async () => {
  if (!sectionRef.value || !curtainCanvasRef.value) return

  // 等待图片加载
  const img = imageRef.value
  if (img) {
    if (img.complete) {
      await initMasks()
    } else {
      await new Promise<void>(resolve => { img.onload = () => resolve() })
      await initMasks()
    }
  }

  // ========== ScrollTrigger：驱动镂空进度 ==========
  const st = ScrollTrigger.create({
    trigger: sectionRef.value,
    start: 'top 78%',
    end: 'bottom 15%',
    onUpdate(self) {
      scrollProgress = self.progress
      updateCurtain(self.progress)
    },
  })
  cleanupFns.push(() => st.kill())

  // ========== 镂空边缘暖光渐显 ==========
  if (cutoutGlowRef.value) gsap.set(cutoutGlowRef.value, { opacity: 0 })
  if (cutoutGlowRef.value) {
    const glowTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 72%',
        end: 'top 25%',
        scrub: 1.0,
      },
    })
    glowTl.to(cutoutGlowRef.value, { opacity: 1, duration: 1, ease: 'power2.in' })
    cleanupFns.push(() => { glowTl.scrollTrigger?.kill(); glowTl.kill() })
  }

  // ========== 文字渐显 ==========
  if (contentRef.value) gsap.set(contentRef.value, { opacity: 0, y: 26 })
  if (contentRef.value) {
    const textTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 58%',
        end: 'top 22%',
        scrub: 1.0,
      },
    })
    textTl.to(contentRef.value, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' })
    cleanupFns.push(() => { textTl.scrollTrigger?.kill(); textTl.kill() })
  }

  // ========== 窗口缩放时重新生成掩码 ==========
  let resizeTimer: ReturnType<typeof setTimeout>
  const onResize = () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => initMasks(), 300)
  }
  window.addEventListener('resize', onResize)
  cleanupFns.push(() => window.removeEventListener('resize', onResize))
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
})
</script>

<style lang="scss" scoped>
/* ==================== 容器 ==================== */
.shadow-puppet-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #14100c;
}

/* ==================== 戏台背景 ==================== */
.backstage-bg {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.warm-glow {
  width: 100%;
  height: 100%;
  background:
    radial-gradient(ellipse 65% 60% at 50% 45%, rgba(200, 155, 80, 0.13) 0%, transparent 55%),
    radial-gradient(ellipse 50% 50% at 50% 48%, rgba(220, 180, 100, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse 80% 70% at 50% 40%, rgba(80, 50, 20, 0.04) 0%, transparent 70%);
}

.stage-curtains {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg,
      rgba(40, 20, 10, 0.3) 0%,
      rgba(60, 35, 20, 0.15) 8%,
      transparent 14%,
      transparent 86%,
      rgba(60, 35, 20, 0.15) 92%,
      rgba(40, 20, 10, 0.3) 100%
    );
}

/* ==================== 原图 ==================== */
.source-image {
  position: absolute;
  top: 50%;
  left: 50%;
  width: min(72vmin, 680px);
  height: min(72vmin, 680px);
  transform: translate(-50%, -50%);
  object-fit: cover;
  z-index: 2;
  // 原图稍微偏暗，让幕布撤去后逐渐亮起
  filter: brightness(0.75) saturate(0.9);
  transition: filter 0.6s ease;
}

/* ==================== Canvas 幕布 ==================== */
.curtain-canvas {
  position: absolute;
  top: 50%;
  left: 50%;
  width: min(72vmin, 680px);
  height: min(72vmin, 680px);
  transform: translate(-50%, -50%);
  z-index: 5;
}

/* ==================== 牛皮纸纹理 ==================== */
.leather-texture {
  position: absolute;
  top: 50%;
  left: 50%;
  width: min(72vmin, 680px);
  height: min(72vmin, 680px);
  transform: translate(-50%, -50%);
  z-index: 6;
  pointer-events: none;
}

/* ==================== 镂空边缘暖光 ==================== */
.cutout-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: min(72vmin, 680px);
  height: min(72vmin, 680px);
  transform: translate(-50%, -50%);
  z-index: 3;
  pointer-events: none;
  background:
    radial-gradient(ellipse 55% 50% at 50% 50%, rgba(220, 170, 80, 0.12) 0%, transparent 55%),
    radial-gradient(circle 35% at 50% 48%, rgba(255, 200, 100, 0.06) 0%, transparent 50%);
}

/* ==================== 文字覆盖层 ==================== */
.content-overlay {
  position: absolute;
  z-index: 20;
  bottom: 12%;
  left: 8%;
  pointer-events: none;
  will-change: opacity, transform;

  .title {
    margin: 0;
    font-family: 'Georgia', 'STKaiti', 'KaiTi', 'SimSun', serif;
    font-size: clamp(30px, 4.5vmin, 54px);
    color: #ddd0b8;
    letter-spacing: 0.12em;
    text-shadow:
      0 0 12px rgba(180, 140, 80, 0.5),
      0 0 30px rgba(140, 100, 50, 0.25);
    line-height: 1.15;
  }

  .subtitle {
    margin: 6px 0 0;
    font-family: 'Georgia', 'STKaiti', 'KaiTi', 'SimSun', serif;
    font-size: clamp(13px, 1.7vmin, 17px);
    color: #8a7a60;
    letter-spacing: 0.1em;
    font-style: italic;
  }

  .divider {
    width: 50px;
    height: 1px;
    margin: 12px 0;
    background: linear-gradient(90deg, rgba(180, 150, 100, 0.5), transparent 80%);
  }

  .desc {
    margin: 0;
    font-size: clamp(11px, 1.3vmin, 14px);
    color: #5a4d3a;
    letter-spacing: 0.08em;
  }
}

/* ==================== 响应式 ==================== */
@media (max-width: 768px) {
  .source-image,
  .curtain-canvas,
  .leather-texture,
  .cutout-glow {
    width: 84vmin;
    height: 84vmin;
  }
  .content-overlay {
    bottom: 10%;
    left: 5%;
  }
}

@media (max-width: 480px) {
  .content-overlay {
    bottom: 8%;
    left: 4%;
  }
}
</style>
