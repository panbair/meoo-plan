<template>
  <section ref="rippleSection" class="ir-section-230">
    <!-- 动态背景 -->
    <div class="ir-bg-gradient-230"></div>
    <canvas ref="particleCanvas" class="ir-particles-230"></canvas>

    <div class="ir-header-230">
      <h2 class="ir-title-230">涟漪扭曲效果</h2>
      <p class="ir-subtitle-230">Ripple Distortion Effect</p>
    </div>

    <!-- 涟漪容器 -->
    <div class="ir-ripple-container-230">
      <!-- 原始图片 -->
      <div ref="originalImgContainer" class="ir-original-image-230">
        <img ref="originalImg" :src="currentImage" alt="Original" />
      </div>

      <!-- 涟漪层 -->
      <canvas ref="rippleCanvas" class="ir-ripple-canvas-230"></canvas>

      <!-- 波纹指示器 -->
      <div class="ir-wave-indicators-230">
        <div
          v-for="i in ripples"
          :key="i"
          :ref="el => { if (el) waveRefs[i] = el as HTMLElement }"
          class="ir-wave-indicator-230"
          :class="`ir-wave-indicator-${i}`"
          :style="{
            width: `${(i / ripples) * 100}%`,
            height: `${(i / ripples) * 100}%`
          }"
        ></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const rippleSection = ref<HTMLElement>()
const originalImgContainer = ref<HTMLElement>()
const originalImg = ref<HTMLImageElement>()
const rippleCanvas = ref<HTMLCanvasElement>()
const particleCanvas = ref<HTMLCanvasElement>()
const waveRefs = ref<Record<number, HTMLElement>>({})

// 固定配置（由滚动控制效果）
const intensity = 5
const frequency = 2
const ripples = 8

// 当前图片索引
const currentImageIndex = ref(0)

// 图片列表
const images = [
  new URL('@/assets/image/1.png', import.meta.url).href,
  new URL('@/assets/image/2.png', import.meta.url).href,
  new URL('@/assets/image/3.png', import.meta.url).href
]

// 当前图片
const currentImage = computed(() => images[currentImageIndex.value])

// 鼠标位置
const mouseX = ref(0)
const mouseY = ref(0)

// Canvas上下文
let ctx: CanvasRenderingContext2D | null = null
let particleCtx: CanvasRenderingContext2D | null = null
let animationId: number | null = null
let particleAnimationId: number | null = null
let time = 0

let ctxGSAP: gsap.Context

// 初始化涟漪动画
const initRippleAnimation = () => {
  if (!originalImg.value || !rippleCanvas.value || !rippleSection.value) return

  const img = originalImg.value
  const canvas = rippleCanvas.value

  if (!img.complete || img.naturalWidth === 0) {
    setTimeout(initRippleAnimation, 100)
    return
  }

  const maxSize = 600
  const scale = Math.min(maxSize / img.naturalWidth, maxSize / img.naturalHeight)
  const width = Math.floor(img.naturalWidth * scale)
  const height = Math.floor(img.naturalHeight * scale)

  canvas.width = width
  canvas.height = height

  ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return

  // 绘制原始图片
  ctx.drawImage(img, 0, 0, width, height)

  ctxGSAP = gsap.context(() => {
    // 滚动触发涟漪效果
    const animObj = { value: 0 }

    gsap.from(animObj, {
      value: 0,
      scrollTrigger: {
        trigger: rippleSection.value,
        start: 'top bottom',
        end: 'center center',
        scrub: 1.5
      },
      onUpdate: () => {
        // 根据滚动进度更新涟漪参数
        const progress = gsap.getProperty(animObj, 'value') as number
        const currentInt = progress * intensity * 2
        const currentFreq = progress * frequency * 2

        mouseX.value = currentInt * 50
        mouseY.value = currentFreq * 30
      },
      ease: 'none'
    })

    // 波纹指示器动画
    Object.values(waveRefs.value).forEach((wave, index) => {
      gsap.from(wave, {
        opacity: 0,
        scale: 0.5,
        scrollTrigger: {
          trigger: rippleSection.value,
          start: 'top bottom',
          end: 'center center',
          scrub: 1
        },
        delay: index * 0.1,
        ease: 'power2.out'
      })

      // 悬停效果
      wave.addEventListener('mouseenter', () => {
        gsap.to(wave, {
          scale: 1.2,
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out'
        })
      })

      wave.addEventListener('mouseleave', () => {
        gsap.to(wave, {
          scale: 1,
          opacity: 0.6,
          duration: 0.3,
          ease: 'power2.out'
        })
      })
    })
  }, rippleSection.value)

  // 开始动画循环
  animateRipple()
}

// 涟漪动画循环
const animateRipple = () => {
  if (!ctx || !rippleCanvas.value || !originalImg.value) return

  const img = originalImg.value
  const canvas = rippleCanvas.value
  const width = canvas.width
  const height = canvas.height

  // 清除画布
  ctx.clearRect(0, 0, width, height)

  // 绘制原始图片
  ctx.drawImage(img, 0, 0, width, height)

  // 获取图像数据
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data

  // 创建新图像数据
  const newImageData = ctx.createImageData(width, height)
  const newData = newImageData.data

  // 涟漪中心点
  const centerX = width / 2 + mouseX.value * 0.5
  const centerY = height / 2 + mouseY.value * 0.5

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dx = x - centerX
      const dy = y - centerY
      const distance = Math.sqrt(dx * dx + dy * dy)

      // 计算涟漪效果
      const waveOffset = Math.sin(distance * frequency * 0.1 - time * 2) * intensity * 2
      const angle = Math.atan2(dy, dx)
      const sourceX = x + Math.cos(angle) * waveOffset
      const sourceY = y + Math.sin(angle) * waveOffset

      // 边界检查
      const sx = Math.max(0, Math.min(width - 1, Math.floor(sourceX)))
      const sy = Math.max(0, Math.min(height - 1, Math.floor(sourceY)))

      // 复制像素
      const sourceIndex = (sy * width + sx) * 4
      const targetIndex = (y * width + x) * 4

      newData[targetIndex] = data[sourceIndex]
      newData[targetIndex + 1] = data[sourceIndex + 1]
      newData[targetIndex + 2] = data[sourceIndex + 2]
      newData[targetIndex + 3] = data[sourceIndex + 3]
    }
  }

  // 绘制新图像
  ctx.putImageData(newImageData, 0, 0)

  time += 0.05
  animationId = requestAnimationFrame(animateRipple)
}

// 初始化背景粒子
const initParticles = () => {
  if (!particleCanvas.value || !rippleSection.value) return

  const canvas = particleCanvas.value
  const rect = rippleSection.value.getBoundingClientRect()

  canvas.width = rect.width
  canvas.height = rect.height

  particleCtx = canvas.getContext('2d')
  if (!particleCtx) return

  const particles: Array<{
    x: number
    y: number
    size: number
    speedX: number
    speedY: number
    opacity: number
    color: string
  }> = []

  const colors = ['#06b6d4', '#8b5cf6', '#ec4899']

  const createParticle = () => {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)]
    }
  }

  // 创建粒子
  for (let i = 0; i < 80; i++) {
    particles.push(createParticle())
  }

  const animateParticles = () => {
    if (!particleCtx || !particleCanvas.value) return

    particleCtx.clearRect(0, 0, canvas.width, canvas.height)

    particles.forEach(particle => {
      particle.x += particle.speedX
      particle.y += particle.speedY

      // 边界检测
      if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1
      if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1

      // 绘制粒子
      particleCtx.beginPath()
      particleCtx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      particleCtx.fillStyle = particle.color
      particleCtx.globalAlpha = particle.opacity
      particleCtx.fill()
    })

    particleAnimationId = requestAnimationFrame(animateParticles)
  }

  animateParticles()

  // 窗口大小变化时调整画布
  window.addEventListener('resize', () => {
    if (particleCanvas.value && rippleSection.value) {
      const rect = rippleSection.value.getBoundingClientRect()
      particleCanvas.value.width = rect.width
      particleCanvas.value.height = rect.height
    }
  })
}

onMounted(() => {
  setTimeout(() => {
    initParticles()
    setTimeout(() => {
      initRippleAnimation()
    }, 200)
  }, 200)
})

onUnmounted(() => {
  ctxGSAP?.revert()

  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  if (particleAnimationId) {
    cancelAnimationFrame(particleAnimationId)
  }
})
</script>

<style scoped lang="scss">
.ir-section-230 {
  min-height: 100vh;
  padding: 60px 20px;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 50%, #0a0a2a 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  position: relative;

  opacity: 1 !important;}

.ir-bg-gradient-230 {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 30% 50%, rgba(6, 182, 212, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 70% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
  pointer-events: none;
  z-index: 1;

  opacity: 1 !important;}

.ir-particles-230 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;

  opacity: 1 !important;}

.ir-header-230 {
  text-align: center;
  margin-bottom: 40px;
  z-index: 10;

  opacity: 1 !important;}

.ir-title-230 {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 12px;
  background: linear-gradient(135deg, #06b6d4, #8b5cf6, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 2px;
  animation: titleGlow 3s ease-in-out infinite;

  opacity: 1 !important;}

@keyframes titleGlow {
  0%, 100% {
    filter: drop-shadow(0 0 10px rgba(6, 182, 212, 0.5));
  }
  50% {
    filter: drop-shadow(0 0 30px rgba(139, 92, 246, 0.8));
  }
}

.ir-subtitle-230 {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 300;
  letter-spacing: 4px;

  opacity: 1 !important;}

// 涟漪容器
.ir-ripple-container-230 {
  position: relative;
  width: 100%;
  max-width: 700px;
  height: 500px;
  margin-bottom: 40px;
  perspective: 1000px;
  z-index: 10;

  opacity: 1 !important;}

.ir-original-image-230 {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  
  opacity: 1 !important;}
}

.ir-ripple-canvas-230 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  opacity: 0.9;
  mix-blend-mode: overlay;
  cursor: pointer;
}

// 波纹指示器
.ir-wave-indicators-230 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 5;

  opacity: 1 !important;}

.ir-wave-indicator-230 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 2px solid rgba(6, 182, 212, 0.3);
  border-radius: 50%;
  opacity: 0.6;
  transition: all 0.3s;
  animation: wavePulse 3s ease-in-out infinite;
  cursor: pointer;
  pointer-events: auto;
}

@keyframes wavePulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.6;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.1);
    opacity: 0.8;
  }
}

@media (max-width: 768px) {
  .ir-title-230 {
    font-size: 2rem;
  
  opacity: 1 !important;}

  .ir-ripple-container-230 {
    height: 400px;
  
  opacity: 1 !important;}
}
</style>
