<template>
  <div class="crystal-container" ref="containerRef">
    <canvas class="crystal-canvas" ref="canvasRef"></canvas>
    <div class="crystal-overlay">
      <div class="crystal-reflection"></div>
    </div>
    <div class="crystal-info">
      <h3 class="crystal-title">晶体形成</h3>
      <p class="crystal-subtitle">Voronoi 几何模拟</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

interface Props {
  width?: number
  height?: number
  cellCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  width: 500,
  height: 400,
  cellCount: 30
})

const containerRef = ref<HTMLElement>()
const canvasRef = ref<HTMLCanvasElement>()
let ctx: gsap.Context
let animationId: number
let time = 0

class CrystalCell {
  x: number
  y: number
  size: number
  rotation: number
  color: string
  sides: number
  glowIntensity: number

  constructor(width: number, height: number, colors: string[]) {
    this.x = Math.random() * width
    this.y = Math.random() * height
    this.size = 20 + Math.random() * 40
    this.rotation = Math.random() * Math.PI * 2
    this.color = colors[Math.floor(Math.random() * colors.length)]
    this.sides = 6
    this.glowIntensity = Math.random()
  }

  draw(context: CanvasRenderingContext2D, t: number) {
    context.save()
    context.translate(this.x, this.y)
    context.rotate(this.rotation + t * 0.0005)

    // 晶体辉光
    const glow = 0.3 + Math.sin(t * 0.002 + this.glowIntensity * 10) * 0.2
    context.shadowBlur = 15
    context.shadowColor = this.color

    // 绘制多边形
    context.beginPath()
    for (let i = 0; i <= this.sides; i++) {
      const angle = (i / this.sides) * Math.PI * 2
      const x = Math.cos(angle) * this.size
      const y = Math.sin(angle) * this.size
      if (i === 0) {
        context.moveTo(x, y)
      } else {
        context.lineTo(x, y)
      }
    }
    context.closePath()

    // 渐变填充
    const gradient = context.createRadialGradient(0, 0, 0, 0, 0, this.size)
    gradient.addColorStop(0, this.color)
    gradient.addColorStop(1, 'transparent')
    context.fillStyle = gradient
    context.globalAlpha = glow
    context.fill()

    // 边缘
    context.strokeStyle = this.color
    context.lineWidth = 2
    context.globalAlpha = glow * 0.8
    context.stroke()

    context.restore()
  }

  update(t: number) {
    // 轻微旋转
    this.rotation += 0.001
    // 脉动
    this.size = 30 + Math.sin(t * 0.002 + this.glowIntensity * 10) * 5
  }
}

const initCrystals = () => {
  const canvas = canvasRef.value!
  const context = canvas.getContext('2d')!
  canvas.width = props.width
  canvas.height = props.height

  const colors = [
    'rgba(139, 92, 246, 0.3)',
    'rgba(59, 130, 246, 0.3)',
    'rgba(236, 72, 153, 0.3)',
    'rgba(16, 185, 129, 0.3)',
    'rgba(245, 158, 11, 0.3)'
  ]

  const crystals = Array.from({ length: props.cellCount }, () =>
    new CrystalCell(canvas.width, canvas.height, colors)
  )

  const animate = () => {
    time++

    // 清除画布
    context.fillStyle = 'rgba(0, 0, 0, 0.1)'
    context.fillRect(0, 0, canvas.width, canvas.height)

    // 更新和绘制晶体
    crystals.forEach(crystal => {
      crystal.update(time)
      crystal.draw(context, time)
    })

    // 绘制晶体间的连接线
    context.strokeStyle = 'rgba(255, 255, 255, 0.05)'
    context.lineWidth = 1

    for (let i = 0; i < crystals.length; i++) {
      for (let j = i + 1; j < crystals.length; j++) {
        const dx = crystals[i].x - crystals[j].x
        const dy = crystals[i].y - crystals[j].y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 80) {
          context.beginPath()
          context.moveTo(crystals[i].x, crystals[i].y)
          context.lineTo(crystals[j].x, crystals[j].y)
          context.stroke()
        }
      }
    }

    animationId = requestAnimationFrame(animate)
  }

  animate()
}

onMounted(() => {
  ctx = gsap.context(() => {
    initCrystals()

    // 鼠标交互
    canvasRef.value?.addEventListener('mousemove', (e) => {
      const rect = canvasRef.value!.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // 在鼠标位置创建新的晶体
      if (Math.random() > 0.95) {
        const newCrystal = new CrystalCell(props.width, props.height, [])
        newCrystal.x = x + (Math.random() - 0.5) * 50
        newCrystal.y = y + (Math.random() - 0.5) * 50
        newCrystal.size = 10 + Math.random() * 20
      }
    })
  }, containerRef.value)
})

onUnmounted(() => {
  ctx?.revert()
  if (animationId) cancelAnimationFrame(animationId)
})
</script>

<style scoped lang="scss">
.crystal-container {
  position: relative;
  width: 100%;
  max-width: 500px;
  height: 400px;
  border-radius: 20px;
  overflow: hidden;
  background: linear-gradient(135deg, #0a0a2a, #000010);
}

.crystal-canvas {
  width: 100%;
  height: 100%;
}

.crystal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), transparent);
  pointer-events: none;
}

.crystal-reflection {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 50%;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.1), transparent);
  pointer-events: none;
}

.crystal-info {
  position: absolute;
  bottom: 20px;
  left: 20px;
  z-index: 10;
}

.crystal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 8px;
  text-shadow: 0 0 20px rgba(139, 92, 246, 0.5);
}

.crystal-subtitle {
  font-size: 0.85rem;
  color: #94a3b8;
}

@media (max-width: 768px) {
  .crystal-container {
    height: 300px;
  }
}
</style>
