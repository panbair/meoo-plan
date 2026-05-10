<template>
  <div class="warp-container" ref="containerRef">
    <canvas class="warp-canvas" ref="canvasRef"></canvas>
    <div class="warp-overlay"></div>
    <div class="warp-center"></div>
    <div class="warp-controls">
      <button class="warp-btn" @click="activateWarp">进入跃迁</button>
      <div class="warp-speed">
        <span class="speed-label">速度</span>
        <div class="speed-bar">
          <div class="speed-fill" :style="{ width: warpSpeed + '%' }"></div>
        </div>
        <span class="speed-value">{{ warpSpeed.toFixed(0) }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

interface Star {
  x: number
  y: number
  z: number
  speed: number
  size: number
}

interface Props {
  width?: number
  height?: number
  starCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  width: 600,
  height: 400,
  starCount: 500
})

const containerRef = ref<HTMLElement>()
const canvasRef = ref<HTMLCanvasElement>()
const warpSpeed = ref(0)
let ctx: gsap.Context
let animationId: number
let stars: Star[] = []
let warpActive = false
let warpProgress = 0

const generateStars = () => {
  const canvas = canvasRef.value!
  canvas.width = props.width
  canvas.height = props.height

  stars = []
  for (let i = 0; i < props.starCount; i++) {
    stars.push({
      x: (Math.random() - 0.5) * 2000,
      y: (Math.random() - 0.5) * 2000,
      z: Math.random() * 2000,
      speed: 2 + Math.random() * 8,
      size: Math.random() * 2 + 0.5
    })
  }

  animateWarp()
}

const animateWarp = () => {
  const canvas = canvasRef.value!
  const context = canvas.getContext('2d')!
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2

  const animate = () => {
    // 清除画布
    context.fillStyle = 'rgba(0, 0, 0, 0.2)'
    context.fillRect(0, 0, canvas.width, canvas.height)

    // 更新速度
    if (warpActive) {
      warpProgress += 0.02
      warpSpeed.value = Math.min(100, warpProgress * 100)
    } else {
      warpProgress = Math.max(0, warpProgress - 0.01)
      warpSpeed.value = warpProgress * 100
    }

    const currentSpeed = 2 + (warpSpeed.value / 100) * 48

    // 绘制星星
    stars.forEach(star => {
      // 移动星星
      star.z -= currentSpeed

      // 重置星星
      if (star.z <= 0) {
        star.z = 2000
        star.x = (Math.random() - 0.5) * 2000
        star.y = (Math.random() - 0.5) * 2000
      }

      // 计算 3D 投影
      const scale = 200 / star.z
      const screenX = centerX + star.x * scale
      const screenY = centerY + star.y * scale
      const size = star.size * scale * (1 + warpSpeed.value / 50)

      // 绘制轨迹
      if (warpSpeed.value > 30) {
        const tailLength = (warpSpeed.value / 100) * 100
        const tailX = centerX + star.x * (200 / (star.z + tailLength))
        const tailY = centerY + star.y * (200 / (star.z + tailLength))

        context.beginPath()
        context.moveTo(tailX, tailY)
        context.lineTo(screenX, screenY)
        context.strokeStyle = `rgba(255, 255, 255, ${0.3 + warpSpeed.value / 200})`
        context.lineWidth = size * 0.5
        context.stroke()
      }

      // 绘制星星
      context.beginPath()
      context.arc(screenX, screenY, size, 0, Math.PI * 2)
      context.fillStyle = `rgba(255, 255, 255, ${0.5 + warpSpeed.value / 200})`
      context.fill()
    })

    // 跃迁效果
    if (warpSpeed.value > 80) {
      context.fillStyle = `rgba(100, 150, 255, ${(warpSpeed.value - 80) / 500})`
      context.fillRect(0, 0, canvas.width, canvas.height)
    }

    animationId = requestAnimationFrame(animate)
  }

  animate()
}

const activateWarp = () => {
  warpActive = !warpActive

  if (warpActive) {
    gsap.to('.warp-center', {
      scale: 5,
      opacity: 0,
      duration: 1.5,
      ease: 'power2.in'
    })
  } else {
    gsap.to('.warp-center', {
      scale: 1,
      opacity: 1,
      duration: 1.5,
      ease: 'power2.out'
    })
  }
}

onMounted(() => {
  ctx = gsap.context(() => {
    generateStars()

    // 鼠标交互
    canvasRef.value?.addEventListener('mousemove', (e) => {
      const rect = canvasRef.value!.getBoundingClientRect()
      const x = (e.clientX - rect.left - rect.width / 2) / 10
      const y = (e.clientY - rect.top - rect.height / 2) / 10

      gsap.to(canvasRef.value, {
        rotateY: x,
        rotateX: -y,
        duration: 0.3
      })
    })

    canvasRef.value?.addEventListener('mouseleave', () => {
      gsap.to(canvasRef.value, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.5
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
.warp-container {
  position: relative;
  width: 100%;
  max-width: 600px;
  height: 400px;
  border-radius: 20px;
  overflow: hidden;
  background: #000000;
  perspective: 1000px;
}

.warp-canvas {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.warp-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, transparent 30%, rgba(0, 0, 0, 0.8));
  pointer-events: none;
}

.warp-center {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.8), rgba(100, 150, 255, 0.4), transparent);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 60px 30px rgba(100, 150, 255, 0.5);
}

.warp-controls {
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  z-index: 10;
}

.warp-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: 2px;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 30px rgba(139, 92, 246, 0.6);
  }
}

.warp-speed {
  display: flex;
  align-items: center;
  gap: 10px;
}

.speed-label {
  font-size: 0.75rem;
  color: #94a3b8;
  min-width: 60px;
}

.speed-bar {
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.speed-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
  transition: width 0.1s;
}

.speed-value {
  font-size: 0.75rem;
  color: #e2e8f0;
  min-width: 50px;
  text-align: right;
  font-family: monospace;
}

@media (max-width: 768px) {
  .warp-container {
    height: 300px;
  }
}
</style>
