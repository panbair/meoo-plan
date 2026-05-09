<template>
  <section ref="pixelateSection" class="px-section-232">
    <!-- 动态背景 -->
    <div class="px-bg-grid-232"></div>
    <canvas ref="particleCanvas" class="px-particle-canvas-232"></canvas>

    <!-- 标题区域 -->
    <div class="px-header-232">
      <div class="px-title-container-232">
        <h2 class="px-title-232">
          <span class="px-title-text-232">PIXEL</span>
          <span class="px-title-accent-232">MORPH</span>
        </h2>
        <div class="px-subtitle-232">
          <span class="px-subtitle-text-232">数字像素转换 · 量子重组艺术</span>
        </div>
      </div>
    </div>

    <!-- 主显示区域 -->
    <div class="px-main-container-232">
      <!-- 像素画布 -->
      <div class="px-canvas-wrapper-232">
        <canvas ref="pixelCanvas" class="px-canvas-232"></canvas>

        <!-- 扫描线效果 -->
        <div class="px-scanline-232"></div>
        <div class="px-scanline-glow-232"></div>
      </div>
    </div>

    <!-- 原始图片（隐藏，用于提取像素） -->
    <img
      ref="sourceImage"
      :src="currentImage"
      alt="Source"
      style="display: none;"
      @load="onImageLoad"
    />
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const pixelateSection = ref<HTMLElement>()
const pixelCanvas = ref<HTMLCanvasElement>()
const particleCanvas = ref<HTMLCanvasElement>()
const sourceImage = ref<HTMLImageElement>()

// 图片索引
const currentImageIndex = ref(0)

// 图片列表
const images = [
  new URL('@/assets/image/1.png', import.meta.url).href,
  new URL('@/assets/image/2.png', import.meta.url).href,
  new URL('@/assets/image/3.png', import.meta.url).href
]

const currentImage = computed(() => images[currentImageIndex.value])

// 固定配置（由滚动控制效果）
const pixelSize = 12
const morphStrength = 50
const rotation = 90
const speed = 1

// 像素数据
interface Pixel {
  x: number
  y: number
  targetX: number
  targetY: number
  color: string
  brightness: number
  size: number
  rotation: number
  targetRotation: number
  opacity: number
  delay: number
  element?: HTMLElement
}

const pixels = ref<Pixel[]>([])

// Canvas上下文
let ctx: CanvasRenderingContext2D | null = null
let particleCtx: CanvasRenderingContext2D | null = null
let animationId: number | null = null
let particleAnimationId: number | null = null
let isAnimating = false

let ctxGSAP: gsap.Context

// 生成像素网格
const generatePixels = () => {
  if (!sourceImage.value || !pixelCanvas.value) return

  const img = sourceImage.value

  if (!img.complete || img.naturalWidth === 0) {
    setTimeout(generatePixels, 100)
    return
  }

  const canvas = pixelCanvas.value
  const maxSize = 600
  const scale = Math.min(maxSize / img.naturalWidth, maxSize / img.naturalHeight)
  const width = Math.floor(img.naturalWidth * scale)
  const height = Math.floor(img.naturalHeight * scale)

  canvas.width = width
  canvas.height = height

  ctx = canvas.getContext('2d')
  if (!ctx) return

  // 绘制图片到临时canvas
  const tempCanvas = document.createElement('canvas')
  const tempCtx = tempCanvas.getContext('2d')
  if (!tempCtx) return

  tempCanvas.width = width
  tempCanvas.height = height
  tempCtx.drawImage(img, 0, 0, width, height)

  // 获取像素数据
  const imageData = tempCtx.getImageData(0, 0, width, height)
  const data = imageData.data

  const cols = Math.ceil(width / pixelSize)
  const rows = Math.ceil(height / pixelSize)
  const newPixels: Pixel[] = []

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * pixelSize
      const y = row * pixelSize

      // 采样中心像素颜色
      const sampleX = Math.min(x + Math.floor(pixelSize / 2), width - 1)
      const sampleY = Math.min(y + Math.floor(pixelSize / 2), height - 1)
      const index = (sampleY * width + sampleX) * 4

      const r = data[index]
      const g = data[index + 1]
      const b = data[index + 2]
      const a = data[index + 3]

      if (a < 50) continue

      const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255
      const distance = Math.sqrt(
        Math.pow(col - cols / 2, 2) +
        Math.pow(row - rows / 2, 2)
      )
      const maxDistance = Math.sqrt(Math.pow(cols / 2, 2) + Math.pow(rows / 2, 2))

      newPixels.push({
        x: x,
        y: y,
        targetX: x,
        targetY: y,
        color: `rgb(${r}, ${g}, ${b})`,
        brightness,
        size: pixelSize * (0.8 + brightness * 0.4),
        rotation: 0,
        targetRotation: 0,
        opacity: 1,
        delay: distance / maxDistance
      })
    }
  }

  pixels.value = newPixels

  // 开始动画
  startPixelAnimation()
}

// 像素动画
const startPixelAnimation = () => {
  if (!pixelateSection.value || !ctx) return

  isAnimating = true
  const strength = morphStrength / 100

  ctxGSAP = gsap.context(() => {
    pixels.value.forEach((pixel, i) => {
      // 随机散开位置
      const scatterX = (Math.random() - 0.5) * 200 * strength
      const scatterY = (Math.random() - 0.5) * 200 * strength

      // 使用 from 实现双向滚动
      gsap.from(pixel, {
        x: pixel.targetX + scatterX,
        y: pixel.targetY + scatterY,
        size: pixelSize * 0.3,
        rotation: rotation,
        opacity: 0.3,
        scrollTrigger: {
          trigger: pixelateSection.value,
          start: 'top bottom',
          end: 'center center',
          scrub: 1.5
        },
        onUpdate: () => {
          pixel.size = pixelSize * (0.8 + pixel.brightness * 0.4)
        },
        ease: 'elastic.out(1, 0.5)'
      })
    })
  }, pixelateSection.value)

  // 开始渲染循环
  renderLoop()
}

// 渲染循环
const renderLoop = () => {
  if (!ctx || !pixelCanvas.value || !isAnimating) return

  const canvas = pixelCanvas.value
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // 绘制像素
  pixels.value.forEach(pixel => {
    ctx.save()
    ctx.translate(pixel.x + pixel.size / 2, pixel.y + pixel.size / 2)
    ctx.rotate((pixel.rotation * Math.PI) / 180)

    ctx.globalAlpha = pixel.opacity
    ctx.fillStyle = pixel.color
    ctx.shadowColor = pixel.color
    ctx.shadowBlur = 10 * pixel.brightness

    ctx.fillRect(-pixel.size / 2, -pixel.size / 2, pixel.size, pixel.size)
    ctx.restore()
  })

  animationId = requestAnimationFrame(renderLoop)
}

// 初始化背景粒子
const initParticles = () => {
  if (!particleCanvas.value || !pixelateSection.value) return

  const canvas = particleCanvas.value
  const rect = pixelateSection.value.getBoundingClientRect()

  canvas.width = rect.width
  canvas.height = rect.height

  particleCtx = canvas.getContext('2d')
  if (!particleCtx) return

  // 创建粒子
  const particles: Array<{
    x: number
    y: number
    vx: number
    vy: number
    size: number
    life: number
    color: string
  }> = []

  for (let i = 0; i < 80; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      size: Math.random() * 3 + 1,
      life: Math.random(),
      color: Math.random() > 0.5 ? '#22d3ee' : '#a3e635'
    })
  }

  // 启动粒子动画
  const particleLoop = () => {
    if (!particleCtx || !particleCanvas.value) return

    particleCtx.clearRect(0, 0, canvas.width, canvas.height)

    particles.forEach(p => {
      p.x += p.vx
      p.y += p.vy
      p.life -= 0.002

      // 边界检查
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1

      // 重置死亡粒子
      if (p.life <= 0) {
        p.x = Math.random() * canvas.width
        p.y = Math.random() * canvas.height
        p.life = 1
      }

      // 绘制粒子
      particleCtx.beginPath()
      particleCtx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2)
      particleCtx.fillStyle = p.color
      particleCtx.globalAlpha = p.life * 0.6
      particleCtx.fill()
    })

    particleAnimationId = requestAnimationFrame(particleLoop)
  }

  particleLoop()

  // 窗口大小变化
  window.addEventListener('resize', () => {
    if (particleCanvas.value && pixelateSection.value) {
      const rect = pixelateSection.value.getBoundingClientRect()
      particleCanvas.value.width = rect.width
      particleCanvas.value.height = rect.height
    }
  })
}

// 图片加载完成
const onImageLoad = () => {
  setTimeout(generatePixels, 150)
}

onMounted(() => {
  initParticles()

  // 检查图片是否已加载
  if (sourceImage.value?.complete) {
    onImageLoad()
  }
})

onUnmounted(() => {
  isAnimating = false

  ctxGSAP?.revert()

  if (animationId) cancelAnimationFrame(animationId)
  if (particleAnimationId) cancelAnimationFrame(particleAnimationId)
})
</script>

<style scoped lang="scss">
.px-section-232 {
  min-height: 100vh;
  padding: 60px 20px;
  background: linear-gradient(135deg, #0a0a1f 0%, #1a1a3f 50%, #0f0f2f 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  position: relative;

  opacity: 1 !important;}

// 背景网格
.px-bg-grid-232 {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(34, 211, 238, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(34, 211, 238, 0.05) 1px, transparent 1px);
  background-size: 40px 40px;
  animation: gridFloat 30s linear infinite;
  pointer-events: none;
}

@keyframes gridFloat {
  0% { transform: translate(0, 0); }
  100% { transform: translate(-40px, -40px); }
}

// 背景粒子Canvas
.px-particle-canvas-232 {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

// 标题区域
.px-header-232 {
  text-align: center;
  margin-bottom: 50px;
  z-index: 10;

  opacity: 1 !important;}

.px-title-container-232 {
  animation: titleFloat 4s ease-in-out infinite;
}

@keyframes titleFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.px-title-232 {
  font-size: 4rem;
  font-weight: 900;
  margin-bottom: 15px;
  letter-spacing: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;

  opacity: 1 !important;}

.px-title-text-232 {
  background: linear-gradient(135deg, #22d3ee, #818cf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 40px rgba(34, 211, 238, 0.5);

  opacity: 1 !important;}

.px-title-accent-232 {
  background: linear-gradient(135deg, #a3e635, #22d3ee);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 40px rgba(163, 230, 53, 0.5);

  opacity: 1 !important;}

.px-subtitle-232 {
  margin-top: 20px;
}

.px-subtitle-text-232 {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 6px;
  text-transform: uppercase;
  font-weight: 500;

  opacity: 1 !important;}

// 主容器
.px-main-container-232 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  z-index: 10;
  width: 100%;
  max-width: 800px;

  opacity: 1 !important;}

// 画布包装器
.px-canvas-wrapper-232 {
  position: relative;
  padding: 20px;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  overflow: hidden;
  cursor: pointer;

  &::before {
    content: '';
    position: absolute;
    inset: -2px;
    background: linear-gradient(135deg, #22d3ee, #a3e635, #818cf8);
    border-radius: 26px;
    z-index: -1;
    opacity: 0.3;
    filter: blur(20px);
    animation: borderGlow 3s ease-in-out infinite;
  }
}

@keyframes borderGlow {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
}

.px-canvas-232 {
  display: block;
  border-radius: 16px;
  background: rgba(0, 0, 0, 0.3);

  opacity: 1 !important;}

// 扫描线效果
.px-scanline-232 {
  position: absolute;
  inset: 20px;
  background: linear-gradient(
    transparent 0%,
    rgba(34, 211, 238, 0.03) 50%,
    transparent 100%
  );
  background-size: 100% 4px;
  animation: scanline 0.1s linear infinite;
  pointer-events: none;

  opacity: 1 !important;}

@keyframes scanline {
  0% { transform: translateY(0); }
  100% { transform: translateY(4px); }
}

.px-scanline-glow-232 {
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #22d3ee, transparent);
  animation: scanlineMove 3s ease-in-out infinite;
  pointer-events: none;
  opacity: 0.5;
}

@keyframes scanlineMove {
  0%, 100% { top: 20px; opacity: 0; }
  50% { opacity: 0.8; }
  100% { top: calc(100% - 20px); opacity: 0; }
}

// 响应式
@media (max-width: 768px) {
  .px-title-232 {
    font-size: 2.5rem;
    flex-direction: column;
    gap: 10px;
    letter-spacing: 4px;
  
  opacity: 1 !important;}
}
</style>
