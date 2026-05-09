<template>
  <div class="time-travel-container" ref="containerRef">
    <canvas class="time-canvas" ref="canvasRef"></canvas>
    <div class="time-tunnel" ref="tunnelRef"></div>
    <div class="time-portal">
      <div class="portal-ring outer"></div>
      <div class="portal-ring middle"></div>
      <div class="portal-ring inner"></div>
      <div class="portal-core"></div>
    </div>
    <div class="time-particles"></div>
    <div class="time-info">
      <h3 class="time-title">时空穿梭</h3>
      <p class="time-subtitle">时间维度的折叠与展开</p>
      <div class="time-stats">
        <div class="stat-item">
          <span class="stat-label">时间流速</span>
          <span class="stat-value">{{ timeSpeed.toFixed(2) }}x</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">时空曲率</span>
          <span class="stat-value">{{ curvature.toFixed(4) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

interface TimeParticle {
  x: number
  y: number
  z: number
  t: number
  vx: number
  vy: number
  vz: number
  size: number
  color: string
  trail: { x: number; y: number }[]
}

interface Props {
  size?: number
  particleCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 400,
  particleCount: 250 // 减少到250
})

const containerRef = ref<HTMLElement>()
const canvasRef = ref<HTMLCanvasElement>()
const tunnelRef = ref<HTMLElement>()
const timeSpeed = ref(1)
const curvature = ref(0)
let ctx: gsap.Context
let animationId: number
let particles: TimeParticle[] = []
let time = 0
let warping = false

const initParticles = () => {
  const canvas = canvasRef.value!
  canvas.width = props.size
  canvas.height = props.size

  particles = []
  const colors = [
    '#ff006e', '#8338ec', '#3a86ff', '#06ffa5',
    '#ffbe0b', '#fb5607', '#ff5400', '#7209b7'
  ]

  for (let i = 0; i < props.particleCount; i++) {
    particles.push({
      x: (Math.random() - 0.5) * 500,
      y: (Math.random() - 0.5) * 500,
      z: Math.random() * 500 + 50,
      t: Math.random() * Math.PI * 2,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      vz: -Math.random() * 2 - 1,
      size: Math.random() * 3 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      trail: []
    })
  }

  animateTime()
}

const animateTime = () => {
  const canvas = canvasRef.value!
  const context = canvas.getContext('2d')!
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2

  const animate = () => {
    time += 0.016

    // 更新统计数据
    timeSpeed.value = warping ? 5 + Math.sin(time * 2) * 4 : 1 + Math.sin(time * 0.5) * 0.5
    curvature.value = warping ? Math.sin(time) * 0.1 : Math.sin(time * 0.3) * 0.01

    // 清除画布 - 动态拖影效果
    const fadeAmount = warping ? 0.3 : 0.1
    context.fillStyle = `rgba(0, 0, 20, ${fadeAmount})`
    context.fillRect(0, 0, canvas.width, canvas.height)

    // 绘制时间漩涡
    drawTimeVortex(context, centerX, centerY)

    // 更新和绘制粒子
    particles.forEach(particle => {
      // 保存轨迹
      if (warping) {
        particle.trail.push({ x: particle.x, y: particle.y })
        if (particle.trail.length > 30) particle.trail.shift()
      } else if (particle.trail.length > 0) {
        particle.trail.shift()
      }

      // 更新位置
      const speedMultiplier = warping ? 3 : 1
      particle.x += particle.vx * speedMultiplier
      particle.y += particle.vy * speedMultiplier
      particle.z += particle.vz * speedMultiplier
      particle.t += 0.01 * speedMultiplier

      // 时空扭曲效果
      const dist = Math.sqrt(particle.x ** 2 + particle.y ** 2)
      const warpFactor = warping ? Math.sin(time * 5) * 2 : 0
      particle.x += (particle.x / dist) * warpFactor
      particle.y += (particle.y / dist) * warpFactor

      // 重置粒子
      if (particle.z <= 10) {
        particle.z = 500
        particle.x = (Math.random() - 0.5) * 500
        particle.y = (Math.random() - 0.5) * 500
        particle.trail = []
      }

      // 3D 投影
      const perspective = 300
      const scale = perspective / particle.z
      const screenX = centerX + particle.x * scale
      const screenY = centerY + particle.y * scale
      const size = particle.size * scale * (warping ? 1.5 : 1)

      // 绘制轨迹
      if (particle.trail.length > 2) {
        context.beginPath()
        context.moveTo(particle.trail[0].x * scale + centerX, particle.trail[0].y * scale + centerY)
        particle.trail.forEach(point => {
          context.lineTo(point.x * scale + centerX, point.y * scale + centerY)
        })
        context.strokeStyle = particle.color
        context.lineWidth = size * 0.3
        context.globalAlpha = 0.3 * scale
        context.stroke()
        context.globalAlpha = 1
      }

      // 绘制粒子
      const gradient = context.createRadialGradient(
        screenX, screenY, 0,
        screenX, screenY, size * 2
      )
      gradient.addColorStop(0, particle.color)
      gradient.addColorStop(1, 'transparent')

      context.beginPath()
      context.arc(screenX, screenY, size, 0, Math.PI * 2)
      context.fillStyle = gradient
      context.globalAlpha = scale
      context.fill()

      // 辉光
      if (warping) {
        context.shadowBlur = 20
        context.shadowColor = particle.color
        context.fill()
        context.shadowBlur = 0
      }

      context.globalAlpha = 1
    })

    animationId = requestAnimationFrame(animate)
  }

  animate()
}

const drawTimeVortex = (context: CanvasRenderingContext2D, cx: number, cy: number) => {
  const rings = 8
  const vortexIntensity = warping ? 2 : 1

  for (let i = 0; i < rings; i++) {
    const radius = 50 + i * 40
    const rotation = time * (0.5 - i * 0.05) * vortexIntensity
    const opacity = 0.3 - i * 0.03

    context.save()
    context.translate(cx, cy)
    context.rotate(rotation)

    // 绘制螺旋
    context.beginPath()
    for (let angle = 0; angle < Math.PI * 4; angle += 0.1) {
      const r = radius + Math.sin(angle * 3 + time * 2) * 10 * vortexIntensity
      const x = Math.cos(angle) * r
      const y = Math.sin(angle) * r

      if (angle === 0) {
        context.moveTo(x, y)
      } else {
        context.lineTo(x, y)
      }
    }

    const hue = (time * 30 + i * 30) % 360
    context.strokeStyle = `hsla(${hue}, 80%, 60%, ${opacity})`
    context.lineWidth = 2
    context.stroke()

    context.restore()
  }
}

onMounted(() => {
  ctx = gsap.context(() => {
    initParticles()

    // 时间隧道旋转
    gsap.to(tunnelRef.value, {
      rotate: 360,
      duration: 10,
      repeat: -1,
      ease: 'none'
    })

    // 传送门环动画
    gsap.to('.portal-ring', (index) => ({
      rotate: 360,
      duration: 8 - index,
      repeat: -1,
      ease: 'none',
      delay: index * 0.2
    }))

    gsap.to('.portal-ring', (index) => ({
      scale: [1, 1.2, 1],
      opacity: [0.5, 1, 0.5],
      duration: 2 + index * 0.3,
      repeat: -1,
      delay: index * 0.3,
      ease: 'sine.inOut'
    }))

    // 核心脉动
    gsap.to('.portal-core', {
      scale: [1, 1.5, 1],
      boxShadow: '0 0 50px rgba(131, 56, 236, 0.8)',
      duration: 1.5,
      repeat: -1,
      ease: 'sine.inOut'
    })

    // 鼠标交互
    containerRef.value?.addEventListener('mousemove', (e) => {
      const rect = containerRef.value!.getBoundingClientRect()
      const x = (e.clientX - rect.left - rect.width / 2) / 15
      const y = (e.clientY - rect.top - rect.height / 2) / 15

      gsap.to(canvasRef.value, {
        rotateY: x,
        rotateX: -y,
        duration: 0.3,
        ease: 'power2.out'
      })
    })

    containerRef.value?.addEventListener('mouseleave', () => {
      gsap.to(canvasRef.value, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.5,
        ease: 'power2.out'
      })
    })

    // 点击触发时空扭曲
    containerRef.value?.addEventListener('click', () => {
      warping = !warping

      gsap.to('.portal-core', {
        scale: warping ? 3 : 1,
        duration: 0.3,
        ease: 'power2.out'
      })

      gsap.to('.portal-ring', {
        scale: warping ? 1.5 : 1,
        duration: 0.5,
        ease: 'power2.out'
      })

      // 震动效果
      if (warping) {
        gsap.to(containerRef.value, {
          x: [-5, 5, -5, 5, 0],
          y: [-3, 3, -3, 3, 0],
          duration: 0.3
        })
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
.time-travel-container {
  position: relative;
  width: 500px;
  height: 500px;
  border-radius: 20px;
  overflow: hidden;
  background: radial-gradient(circle at center, #0a0a2a, #000010);
  perspective: 1000px;
  cursor: pointer;
}

.time-canvas {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.time-tunnel {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 300px;
  height: 300px;
  transform: translate(-50%, -50%);
  background: conic-gradient(from 0deg,
    transparent,
    rgba(131, 56, 236, 0.3),
    rgba(58, 134, 255, 0.3),
    transparent
  );
  border-radius: 50%;
  pointer-events: none;
  z-index: 2;
  animation: tunnelPulse 3s infinite;
}

@keyframes tunnelPulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.7; }
}

.time-portal {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
  pointer-events: none;
}

.portal-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  border: 3px solid;
  transform: translate(-50%, -50%);
}

.outer {
  width: 200px;
  height: 200px;
  border-color: rgba(131, 56, 236, 0.6);
}

.middle {
  width: 150px;
  height: 150px;
  border-color: rgba(58, 134, 255, 0.6);
}

.inner {
  width: 100px;
  height: 100px;
  border-color: rgba(6, 255, 165, 0.6);
}

.portal-core {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50px;
  height: 50px;
  background: radial-gradient(circle, #ffffff, #8338ec, transparent);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 30px rgba(131, 56, 236, 0.8);
}

.time-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 4;
}

.time-info {
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  z-index: 10;
  pointer-events: none;
}

.time-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 4px;
  text-shadow: 0 0 20px rgba(131, 56, 236, 0.5);
}

.time-subtitle {
  font-size: 0.75rem;
  color: #94a3b8;
  margin-bottom: 10px;
}

.time-stats {
  display: flex;
  gap: 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.stat-label {
  font-size: 0.7rem;
  color: #64748b;
}

.stat-value {
  font-size: 0.85rem;
  font-weight: 600;
  color: #8338ec;
  font-family: 'Courier New', monospace;
  text-shadow: 0 0 5px rgba(131, 56, 236, 0.5);
}

@media (max-width: 768px) {
  .time-travel-container {
    width: 350px;
    height: 350px;
  }

  .time-tunnel {
    width: 210px;
    height: 210px;
  }

  .portal-ring.outer { width: 140px; height: 140px; }
  .portal-ring.middle { width: 105px; height: 105px; }
  .portal-ring.inner { width: 70px; height: 70px; }
  .portal-core { width: 35px; height: 35px; }

  .time-stats {
    flex-direction: column;
    gap: 5px;
  }
}
</style>
