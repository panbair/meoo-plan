<template>
  <div class="matter-container" ref="containerRef">
    <canvas class="matter-canvas" ref="canvasRef"></canvas>
    <div class="collision-zone"></div>
    <div class="matter-info">
      <h3 class="matter-title">物质反物质</h3>
      <p class="matter-subtitle">E = mc² 粒子对撞</p>
      <div class="matter-stats">
        <div class="stat-group">
          <span class="stat-label">物质粒子</span>
          <span class="stat-value matter-color">{{ matterCount }}</span>
        </div>
        <div class="stat-group">
          <span class="stat-label">反物质</span>
          <span class="stat-value antimatter-color">{{ antimatterCount }}</span>
        </div>
        <div class="stat-group">
          <span class="stat-label">湮灭事件</span>
          <span class="stat-value">{{ annihilations }}</span>
        </div>
      </div>
    </div>
    <div class="matter-controls">
      <button class="matter-btn" @click="spawnParticles">生成粒子对</button>
      <button class="matter-btn accelerate" @click="accelerateParticles">加速对撞</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  type: 'matter' | 'antimatter'
  size: number
  color: string
  life: number
  trail: { x: number; y: number }[]
}

interface Props {
  width?: number
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  width: 600,
  height: 400
})

const containerRef = ref<HTMLElement>()
const canvasRef = ref<HTMLCanvasElement>()
const particles = ref<Particle[]>([])
const matterCount = ref(0)
const antimatterCount = ref(0)
const annihilations = ref(0)
let ctx: gsap.Context
let animationId: number

const spawnParticles = () => {
  const canvas = canvasRef.value!
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2

  // 创建粒子对
  const matter: Particle = {
    x: centerX - 100,
    y: centerY,
    vx: 2 + Math.random() * 2,
    vy: (Math.random() - 0.5) * 0.5,
    type: 'matter',
    size: 8,
    color: '#3b82f6',
    life: 200,
    trail: []
  }

  const antimatter: Particle = {
    x: centerX + 100,
    y: centerY,
    vx: -2 - Math.random() * 2,
    vy: (Math.random() - 0.5) * 0.5,
    type: 'antimatter',
    size: 8,
    color: '#ef4444',
    life: 200,
    trail: []
  }

  particles.value.push(matter, antimatter)
  matterCount.value++
  antimatterCount.value++

  // 入场动画
  gsap.from(matter, { scale: 0, duration: 0.5, ease: 'back.out(1.7)' })
  gsap.from(antimatter, { scale: 0, duration: 0.5, ease: 'back.out(1.7)' })
}

const accelerateParticles = () => {
  particles.value.forEach(particle => {
    particle.vx *= 2
    particle.vy *= 2
  })

  gsap.to('.collision-zone', {
    scale: 1.5,
    opacity: 1,
    duration: 0.3,
    yoyo: true,
    repeat: 1
  })
}

const createExplosion = (x: number, y: number) => {
  const canvas = canvasRef.value!
  const explosionCount = 20

  for (let i = 0; i < explosionCount; i++) {
    const angle = (i / explosionCount) * Math.PI * 2
    const speed = 3 + Math.random() * 5

    particles.value.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      type: 'matter',
      size: 2 + Math.random() * 3,
      color: Math.random() > 0.5 ? '#fbbf24' : '#f59e0b',
      life: 30 + Math.random() * 20,
      trail: []
    })
  }

  annihilations.value++
}

const initSimulation = () => {
  const canvas = canvasRef.value!
  canvas.width = props.width
  canvas.height = props.height

  animateSimulation()
}

const animateSimulation = () => {
  const canvas = canvasRef.value!
  const context = canvas.getContext('2d')!

  const animate = () => {
    // 清除画布
    context.fillStyle = 'rgba(0, 0, 0, 0.1)'
    context.fillRect(0, 0, canvas.width, canvas.height)

    // 绘制对撞区域
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    // 更新和绘制粒子
    for (let i = particles.value.length - 1; i >= 0; i--) {
      const particle = particles.value[i]

      // 保存轨迹
      particle.trail.push({ x: particle.x, y: particle.y })
      if (particle.trail.length > 20) particle.trail.shift()

      // 更新位置
      particle.x += particle.vx
      particle.y += particle.vy
      particle.life--

      // 绘制轨迹
      if (particle.trail.length > 1) {
        context.beginPath()
        context.moveTo(particle.trail[0].x, particle.trail[0].y)
        particle.trail.forEach(point => {
          context.lineTo(point.x, point.y)
        })
        context.strokeStyle = particle.color
        context.lineWidth = 2
        context.globalAlpha = particle.life / 200
        context.stroke()
      }

      // 绘制粒子
      context.beginPath()
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      context.fillStyle = particle.color
      context.globalAlpha = particle.life / 200

      // 辉光
      if (particle.type === 'matter') {
        context.shadowBlur = 15
        context.shadowColor = '#3b82f6'
      } else {
        context.shadowBlur = 15
        context.shadowColor = '#ef4444'
      }

      context.fill()
      context.shadowBlur = 0

      // 检测碰撞
      if (particle.type === 'matter' || particle.type === 'antimatter') {
        for (let j = i + 1; j < particles.value.length; j++) {
          const other = particles.value[j]
          if ((particle.type === 'matter' && other.type === 'antimatter') ||
              (particle.type === 'antimatter' && other.type === 'matter')) {
            const dx = particle.x - other.x
            const dy = particle.y - other.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < particle.size + other.size) {
              // 湮灭！
              createExplosion((particle.x + other.x) / 2, (particle.y + other.y) / 2)
              particles.value.splice(j, 1)
              particles.value.splice(i, 1)

              if (particle.type === 'matter') matterCount.value--
              else antimatterCount.value--
              if (other.type === 'matter') matterCount.value--
              else antimatterCount.value--

              break
            }
          }
        }
      }

      // 移除死亡粒子或出界粒子
      if (particle.life <= 0 || particle.x < -50 || particle.x > canvas.width + 50) {
        particles.value.splice(i, 1)
      }
    }

    context.globalAlpha = 1

    animationId = requestAnimationFrame(animate)
  }

  animate()
}

onMounted(() => {
  initSimulation()

  ctx = gsap.context(() => {
    // 自动生成一些初始粒子
    setTimeout(spawnParticles, 1000)
    setTimeout(spawnParticles, 2000)
  }, containerRef.value)
})

onUnmounted(() => {
  ctx?.revert()
  if (animationId) cancelAnimationFrame(animationId)
})
</script>

<style scoped lang="scss">
.matter-container {
  position: relative;
  width: 100%;
  max-width: 600px;
  height: 400px;
  border-radius: 20px;
  overflow: hidden;
  background: #000010;
}

.matter-canvas {
  width: 100%;
  height: 100%;
}

.collision-zone {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(251, 191, 36, 0.3), transparent);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  opacity: 0;
}

.matter-info {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
}

.matter-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 8px;
}

.matter-subtitle {
  font-size: 0.85rem;
  color: #94a3b8;
  margin-bottom: 15px;
}

.matter-stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.stat-label {
  font-size: 0.75rem;
  color: #64748b;
}

.stat-value {
  font-size: 0.85rem;
  font-weight: 600;
  font-family: 'Courier New', monospace;
}

.matter-color {
  color: #3b82f6;
}

.antimatter-color {
  color: #ef4444;
}

.matter-controls {
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
  z-index: 10;
}

.matter-btn {
  flex: 1;
  padding: 12px 20px;
  background: rgba(139, 92, 246, 0.2);
  border: 1px solid rgba(139, 92, 246, 0.4);
  border-radius: 8px;
  color: #e2e8f0;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: rgba(139, 92, 246, 0.4);
    transform: translateY(-2px);
  }

  &.accelerate {
    background: rgba(239, 68, 68, 0.2);
    border-color: rgba(239, 68, 68, 0.4);

    &:hover {
      background: rgba(239, 68, 68, 0.4);
    }
  }
}

@media (max-width: 768px) {
  .matter-container {
    height: 300px;
  }

  .matter-controls {
    flex-direction: column;
  }
}
</style>
