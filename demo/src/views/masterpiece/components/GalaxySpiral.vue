<template>
  <div class="galaxy-container" ref="containerRef">
    <canvas class="galaxy-canvas" ref="canvasRef"></canvas>
    <div class="galaxy-core"></div>
    <div class="galaxy-info">
      <h3 class="galaxy-title">螺旋星系</h3>
      <p class="galaxy-subtitle">万有引力模拟</p>
      <div class="galaxy-stats">
        <span class="stat">恒星: {{ starCount }}</span>
        <span class="stat">星臂: 4</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

interface Star {
  angle: number
  radius: number
  speed: number
  size: number
  color: string
  brightness: number
  z: number
}

interface Props {
  width?: number
  height?: number
  starCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  width: 500,
  height: 350,
  starCount: 500 // 减少到500
})

const containerRef = ref<HTMLElement>()
const canvasRef = ref<HTMLCanvasElement>()
const starCount = ref(props.starCount)
let ctx: gsap.Context
let animationId: number
let stars: Star[] = []
let rotation = 0

const generateGalaxy = () => {
  const canvas = canvasRef.value!
  const context = canvas.getContext('2d')!
  canvas.width = props.width
  canvas.height = props.height

  const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd']
  stars = []

  for (let i = 0; i < props.starCount; i++) {
    const armIndex = i % 4
    const armOffset = (armIndex * Math.PI * 2) / 4
    const distanceFactor = Math.random()
    const maxRadius = Math.min(canvas.width, canvas.height) / 2 - 20

    const angle = armOffset + distanceFactor * Math.PI * 1.5 + (Math.random() - 0.5) * 0.5
    const radius = distanceFactor * maxRadius + (Math.random() - 0.5) * 30

    stars.push({
      angle,
      radius,
      speed: (1 - distanceFactor) * 0.001 + 0.0002,
      size: Math.random() * 2 + 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      brightness: Math.random(),
      z: Math.random() * 2 - 1
    })
  }

  animateGalaxy()
}

const animateGalaxy = () => {
  const canvas = canvasRef.value!
  const context = canvas.getContext('2d')!
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2

  const animate = () => {
    rotation += 0.0005

    // 清除画布（带拖尾效果）
    context.fillStyle = 'rgba(0, 0, 0, 0.1)'
    context.fillRect(0, 0, canvas.width, canvas.height)

    // 绘制星系
    stars.forEach((star, index) => {
      const currentAngle = star.angle + rotation * (1 - star.radius / 200)
      const x = centerX + Math.cos(currentAngle) * star.radius
      const y = centerY + Math.sin(currentAngle) * star.radius
      const zScale = (star.z + 1) / 2

      // 闪烁效果
      star.brightness = 0.5 + Math.sin(Date.now() * 0.003 + index) * 0.5

      // 绘制恒星
      context.beginPath()
      context.arc(x, y, star.size * zScale, 0, Math.PI * 2)
      context.fillStyle = star.color
      context.globalAlpha = star.brightness * zScale
      context.fill()

      // 辉光效果
      if (star.size > 1.5) {
        const glowGradient = context.createRadialGradient(x, y, 0, x, y, star.size * 3)
        glowGradient.addColorStop(0, star.color)
        glowGradient.addColorStop(1, 'transparent')
        context.beginPath()
        context.arc(x, y, star.size * 3, 0, Math.PI * 2)
        context.fillStyle = glowGradient
        context.globalAlpha = star.brightness * 0.3 * zScale
        context.fill()
      }
    })

    context.globalAlpha = 1

    animationId = requestAnimationFrame(animate)
  }

  animate()
}

onMounted(() => {
  ctx = gsap.context(() => {
    generateGalaxy()

    // 鼠标交互
    canvasRef.value?.addEventListener('mousemove', (e) => {
      const rect = canvasRef.value!.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // 计算鼠标到中心的距离和角度
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const dx = x - centerX
      const dy = y - centerY
      const distance = Math.sqrt(dx * dx + dy * dy)
      const angle = Math.atan2(dy, dx)

      // 影响附近的恒星
      stars.forEach(star => {
        const starAngle = star.angle + rotation * (1 - star.radius / 200)
        const starX = centerX + Math.cos(starAngle) * star.radius
        const starY = centerY + Math.sin(starAngle) * star.radius

        const d = Math.sqrt((x - starX) ** 2 + (y - starY) ** 2)
        if (d < 100) {
          star.brightness = 1
          star.z = 1
        }
      })
    })
  }, containerRef.value)
})

onUnmounted(() => {
  ctx?.revert()
  if (animationId) cancelAnimationFrame(animationId)
})
</script>

<style scoped lang="scss">
.galaxy-container {
  position: relative;
  width: 100%;
  max-width: 600px;
  height: 400px;
  border-radius: 20px;
  overflow: hidden;
  background: #000010;
}

.galaxy-canvas {
  width: 100%;
  height: 100%;
}

.galaxy-core {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 40px;
  height: 40px;
  background: radial-gradient(circle, #ffffff, #ffdd00, #ff6600, transparent);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 60px 30px rgba(255, 200, 0, 0.3);
  animation: corePulse 2s ease-in-out infinite;
}

@keyframes corePulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.8;
  }
}

.galaxy-info {
  position: absolute;
  bottom: 20px;
  left: 20px;
  z-index: 10;
}

.galaxy-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 8px;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
}

.galaxy-subtitle {
  font-size: 0.85rem;
  color: #94a3b8;
  margin-bottom: 10px;
}

.galaxy-stats {
  display: flex;
  gap: 15px;
}

.stat {
  font-size: 0.75rem;
  color: #64748b;
  background: rgba(255, 255, 255, 0.05);
  padding: 4px 8px;
  border-radius: 4px;
}

@media (max-width: 768px) {
  .galaxy-container {
    height: 300px;
  }
}
</style>
