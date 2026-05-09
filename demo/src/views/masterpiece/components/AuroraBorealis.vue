<template>
  <div class="aurora-container" ref="containerRef">
    <canvas class="aurora-canvas" ref="canvasRef"></canvas>
    <div class="aurora-overlay"></div>
    <div class="stars"></div>
    <div class="aurora-info">
      <h3 class="aurora-title">极光带</h3>
      <p class="aurora-subtitle">粒子流体模拟</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

interface Props {
  width?: number
  height?: number
  particleCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  width: 500,
  height: 350,
  particleCount: 200 // 减少到200
})

const containerRef = ref<HTMLElement>()
const canvasRef = ref<HTMLCanvasElement>()
let ctx: gsap.Context
let animationId: number
let particles: any[] = []
let time = 0

class Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  alpha: number
  targetX: number
  targetY: number

  constructor(width: number, height: number, colors: string[]) {
    this.x = Math.random() * width
    this.y = height + Math.random() * 100
    this.vx = (Math.random() - 0.5) * 2
    this.vy = -Math.random() * 2 - 0.5
    this.size = Math.random() * 3 + 1
    this.color = colors[Math.floor(Math.random() * colors.length)]
    this.alpha = Math.random() * 0.5 + 0.3
    this.targetX = this.x
    this.targetY = this.y
  }

  update(width: number, height: number, t: number) {
    // 波浪运动
    const waveX = Math.sin(t * 0.001 + this.y * 0.01) * 50
    const waveY = Math.cos(t * 0.0015 + this.x * 0.01) * 30

    this.targetX = this.x + waveX
    this.targetY = this.y + waveY

    // 向目标移动
    this.vx += (this.targetX - this.x) * 0.02
    this.vy += (this.targetY - this.y) * 0.02

    this.vx *= 0.95
    this.vy *= 0.95

    this.x += this.vx
    this.y += this.vy

    // 边界处理
    if (this.y < -50) {
      this.y = height + Math.random() * 100
      this.x = Math.random() * width
    }

    if (this.x < -50) this.x = width + 50
    if (this.x > width + 50) this.x = -50
  }

  draw(context: CanvasRenderingContext2D) {
    context.beginPath()
    context.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    context.fillStyle = this.color
    context.globalAlpha = this.alpha
    context.fill()
    context.globalAlpha = 1
  }
}

const initAurora = () => {
  const canvas = canvasRef.value!
  const context = canvas.getContext('2d')!
  canvas.width = props.width
  canvas.height = props.height

  const colors = ['#00ff88', '#00ffff', '#ff00ff', '#ffff00']

  particles = []
  for (let i = 0; i < props.particleCount; i++) {
    particles.push(new Particle(canvas.width, canvas.height, colors))
  }

  const animate = () => {
    time++

    context.fillStyle = 'rgba(0, 0, 0, 0.05)'
    context.fillRect(0, 0, canvas.width, canvas.height)

    particles.forEach(particle => {
      particle.update(canvas.width, canvas.height, time)
      particle.draw(context)
    })

    // 连接相邻粒子
    context.strokeStyle = 'rgba(0, 255, 255, 0.05)'
    context.lineWidth = 0.5

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 50) {
          context.beginPath()
          context.moveTo(particles[i].x, particles[i].y)
          context.lineTo(particles[j].x, particles[j].y)
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
    initAurora()

    // 鼠标交互
    canvasRef.value?.addEventListener('mousemove', (e) => {
      const rect = canvasRef.value!.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      particles.forEach(particle => {
        const dx = particle.x - x
        const dy = particle.y - y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 100) {
          particle.vx += dx / distance * 2
          particle.vy += dy / distance * 2
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
.aurora-container {
  position: relative;
  width: 100%;
  max-width: 600px;
  height: 400px;
  border-radius: 20px;
  overflow: hidden;
  background: linear-gradient(to bottom, #0a0a2a, #000010);
}

.aurora-canvas {
  width: 100%;
  height: 100%;
}

.aurora-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.5));
  pointer-events: none;
}

.stars {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    radial-gradient(2px 2px at 20px 30px, white, transparent),
    radial-gradient(2px 2px at 40px 70px, rgba(255, 255, 255, 0.8), transparent),
    radial-gradient(1px 1px at 90px 40px, white, transparent),
    radial-gradient(2px 2px at 130px 80px, rgba(255, 255, 255, 0.6), transparent),
    radial-gradient(1px 1px at 160px 120px, white, transparent);
  background-repeat: repeat;
  background-size: 200px 200px;
  opacity: 0.5;
  pointer-events: none;
}

.aurora-info {
  position: absolute;
  bottom: 20px;
  left: 20px;
  z-index: 10;
}

.aurora-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 8px;
  text-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
}

.aurora-subtitle {
  font-size: 0.85rem;
  color: #94a3b8;
}

@media (max-width: 768px) {
  .aurora-container {
    height: 300px;
  }
}
</style>
