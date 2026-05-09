<template>
  <div ref="containerRef" class="tunnel-container">
    <div class="tunnel-title">光流隧道</div>
    <canvas ref="canvasRef" class="tunnel-canvas"></canvas>
    <div class="tunnel-info">
      <span class="info-item">速度: {{ tunnelSpeed.toFixed(1) }}x</span>
      <span class="info-item">光粒子: {{ particles.length }}</span>
    </div>
    <div class="tunnel-controls">
      <button @click="accelerate" class="accelerate-btn">加速</button>
      <button @click="reverse" class="reverse-btn">反转</button>
      <button @click="colorShift" class="color-btn">变色</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

const containerRef = ref<HTMLElement>()
const canvasRef = ref<HTMLCanvasElement>()
const tunnelSpeed = ref(1.0)

let ctx: CanvasRenderingContext2D | null = null
let animationId: number | null = null
let time = 0
let tunnelRings: TunnelRing[] = []
let particles: LightParticle[] = []
let currentColorIndex = 0
let direction = 1

interface TunnelRing {
  z: number
  radius: number
  color: string
  thickness: number
  opacity: number
}

interface LightParticle {
  x: number
  y: number
  z: number
  size: number
  speed: number
  color: string
  trail: { x: number; y: number; alpha: number }[]
}

const colorSchemes = [
  {
    primary: '#00ffff',
    secondary: '#ff00ff',
    tertiary: '#ffff00'
  },
  {
    primary: '#ff6666',
    secondary: '#66ff66',
    tertiary: '#6666ff'
  },
  {
    primary: '#ffd700',
    secondary: '#ff8c00',
    tertiary: '#ff1493'
  },
  {
    primary: '#00ff7f',
    secondary: '#00bfff',
    tertiary: '#9400d3'
  }
]

const initTunnel = (width: number, height: number) => {
  tunnelRings = []
  particles = []

  // 初始化隧道环
  const numRings = 30
  for (let i = 0; i < numRings; i++) {
    tunnelRings.push({
      z: i * 50,
      radius: 50 + i * 10,
      color: getRingColor(i, numRings),
      thickness: 2 + Math.random() * 3,
      opacity: 1 - i / numRings
    })
  }

  // 初始化光粒子
  for (let i = 0; i < 100; i++) {
    const angle = Math.random() * Math.PI * 2
    const radius = 50 + Math.random() * 150

    particles.push({
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      z: Math.random() * 1500,
      size: Math.random() * 4 + 2,
      speed: 2 + Math.random() * 3,
      color: colorSchemes[currentColorIndex].primary,
      trail: []
    })
  }
}

const getRingColor = (index: number, total: number) => {
  const scheme = colorSchemes[currentColorIndex]
  const progress = index / total

  if (progress < 0.33) {
    return scheme.primary
  } else if (progress < 0.66) {
    return scheme.secondary
  } else {
    return scheme.tertiary
  }
}

const updateTunnel = (deltaTime: number, width: number, height: number) => {
  time += deltaTime * 0.001

  const baseSpeed = 2 * tunnelSpeed.value * direction

  // 更新隧道环
  tunnelRings.forEach(ring => {
    ring.z -= baseSpeed

    // 循环
    if (ring.z < 0) {
      ring.z = 1500
      ring.radius = 50
    } else if (ring.z > 1500) {
      ring.z = 0
      ring.radius = 350
    }

    // 根据深度调整半径
    const progress = ring.z / 1500
    ring.radius = 50 + progress * 300
    ring.opacity = 1 - progress * 0.7

    // 更新颜色
    const ringIndex = Math.floor((ring.z / 1500) * tunnelRings.length)
    ring.color = getRingColor(ringIndex, tunnelRings.length)
  })

  // 更新光粒子
  particles.forEach(p => {
    p.z -= p.speed * tunnelSpeed.value * direction

    // 循环
    if (p.z < 0) {
      p.z = 1500
      p.trail = []
    } else if (p.z > 1500) {
      p.z = 0
      p.trail = []
    }

    // 更新轨迹
    const angle = Math.atan2(p.y, p.x)
    const radius = Math.sqrt(p.x * p.x + p.y * p.y)
    const speed = 0.5 * tunnelSpeed.value

    p.trail.push({
      x: p.x,
      y: p.y,
      alpha: 1
    })

    if (p.trail.length > 15) {
      p.trail.shift()
    }

    p.trail.forEach((t, i) => {
      t.alpha = (i + 1) / p.trail.length
    })

    // 旋转粒子
    const newAngle = angle + speed * 0.01
    p.x = Math.cos(newAngle) * radius
    p.y = Math.sin(newAngle) * radius
  })
}

const drawTunnel = (width: number, height: number) => {
  if (!ctx) return

  // 清空画布
  const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height) / 2)
  gradient.addColorStop(0, '#000000')
  gradient.addColorStop(0.5, '#0a0a15')
  gradient.addColorStop(1, '#000000')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  const centerX = width / 2
  const centerY = height / 2

  // 绘制隧道环（从远到近）
  const sortedRings = [...tunnelRings].sort((a, b) => b.z - a.z)
  sortedRings.forEach(ring => {
    const scale = 1 + (1500 - ring.z) / 1000
    const x = centerX + ring.x * scale
    const y = centerY + ring.y * scale

    const alpha = ring.opacity * (1500 - ring.z) / 1500
    const drawRadius = ring.radius * scale

    // 绘制环
    ctx.beginPath()
    ctx.arc(centerX, centerY, drawRadius, 0, Math.PI * 2)
    ctx.strokeStyle = ring.color
    ctx.lineWidth = ring.thickness * scale
    ctx.globalAlpha = alpha
    ctx.stroke()

    // 绘制光晕
    const glowGradient = ctx.createRadialGradient(centerX, centerY, drawRadius * 0.95, centerX, centerY, drawRadius * 1.05)
    glowGradient.addColorStop(0, 'transparent')
    glowGradient.addColorStop(0.5, ring.color)
    glowGradient.addColorStop(1, 'transparent')

    ctx.beginPath()
    ctx.arc(centerX, centerY, drawRadius * 1.05, 0, Math.PI * 2)
    ctx.fillStyle = glowGradient
    ctx.globalAlpha = alpha * 0.3
    ctx.fill()
  })

  ctx.globalAlpha = 1

  // 绘制光粒子
  const sortedParticles = [...particles].sort((a, b) => b.z - a.z)
  sortedParticles.forEach(p => {
    const scale = 1 + (1500 - p.z) / 800
    const drawX = centerX + p.x * scale
    const drawY = centerY + p.y * scale
    const drawSize = p.size * scale
    const alpha = (1500 - p.z) / 1500

    // 绘制轨迹
    p.trail.forEach((t, i) => {
      if (i === 0) return
      const prev = p.trail[i - 1]
      const trailScale = 1 + (1500 - p.z) / 800

      ctx.beginPath()
      ctx.moveTo(centerX + prev.x * trailScale, centerY + prev.y * trailScale)
      ctx.lineTo(centerX + t.x * trailScale, centerY + t.y * trailScale)
      ctx.strokeStyle = p.color
      ctx.lineWidth = drawSize * 0.5 * t.alpha
      ctx.globalAlpha = alpha * t.alpha * 0.5
      ctx.stroke()
    })

    // 绘制粒子发光
    const glowGradient = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, drawSize * 4)
    glowGradient.addColorStop(0, p.color)
    glowGradient.addColorStop(0.5, `${p.color}44`)
    glowGradient.addColorStop(1, 'transparent')

    ctx.beginPath()
    ctx.arc(drawX, drawY, drawSize * 4, 0, Math.PI * 2)
    ctx.fillStyle = glowGradient
    ctx.globalAlpha = alpha
    ctx.fill()

    // 绘制粒子核心
    const coreGradient = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, drawSize)
    coreGradient.addColorStop(0, '#ffffff')
    coreGradient.addColorStop(0.5, p.color)
    coreGradient.addColorStop(1, 'transparent')

    ctx.beginPath()
    ctx.arc(drawX, drawY, drawSize, 0, Math.PI * 2)
    ctx.fillStyle = coreGradient
    ctx.fill()
  })

  ctx.globalAlpha = 1

  // 中心光晕
  const centerGlow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 100)
  centerGlow.addColorStop(0, colorSchemes[currentColorIndex].primary)
  centerGlow.addColorStop(0.3, `${colorSchemes[currentColorIndex].primary}33`)
  centerGlow.addColorStop(1, 'transparent')

  ctx.beginPath()
  ctx.arc(centerX, centerY, 100, 0, Math.PI * 2)
  ctx.fillStyle = centerGlow
  ctx.globalAlpha = 0.3 + Math.sin(time * 2) * 0.1
  ctx.fill()

  ctx.globalAlpha = 1
}

const accelerate = () => {
  gsap.to(containerRef.value, {}, {
    duration: 0,
    onStart: () => {
      const targetSpeed = Math.min(5, tunnelSpeed.value + 1)
      gsap.to(tunnelSpeed, {
        value: targetSpeed,
        duration: 1,
        ease: 'power2.out'
      })

      setTimeout(() => {
        gsap.to(tunnelSpeed, {
          value: 1,
          duration: 1,
          ease: 'power2.in'
        })
      }, 2000)
    }
  })
}

const reverse = () => {
  direction *= -1

  gsap.to(containerRef.value, {
    filter: 'hue-rotate(180deg)',
    duration: 0.5,
    yoyo: true,
    repeat: 1,
    ease: 'power2.inOut'
  })
}

const colorShift = () => {
  currentColorIndex = (currentColorIndex + 1) % colorSchemes.length

  particles.forEach((p, index) => {
    gsap.to(p, {
      duration: 0,
      onComplete: () => {
        p.color = colorSchemes[currentColorIndex].primary
      }
    })
  })
}

const onMouseMove = (e: MouseEvent) => {
  if (!containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2

  const mouseX = e.clientX - centerX
  const mouseY = e.clientY - centerY

  // 调整视点
  gsap.to(canvasRef.value, {
    x: mouseX * 0.1,
    y: mouseY * 0.1,
    duration: 0.3,
    ease: 'power2.out'
  })
}

let lastTime = 0
const animate = (timestamp: number) => {
  if (!canvasRef.value) return

  const width = canvasRef.value.width
  const height = canvasRef.value.height
  const deltaTime = timestamp - lastTime
  lastTime = timestamp

  updateTunnel(deltaTime, width, height)
  drawTunnel(width, height)

  animationId = requestAnimationFrame(animate)
}

const resize = () => {
  if (!canvasRef.value || !containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  canvasRef.value.width = rect.width
  canvasRef.value.height = rect.height
  initTunnel(canvasRef.value.width, canvasRef.value.height)
}

const pauseAnimation = () => {
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
  gsap.globalTimeline.pause()
}

const resumeAnimation = () => {
  if (!animationId && canvasRef.value) {
    lastTime = performance.now()
    animationId = requestAnimationFrame(animate)
  }
  gsap.globalTimeline.resume()
}

onMounted(() => {
  if (canvasRef.value) {
    ctx = canvasRef.value.getContext('2d')
    resize()
    window.addEventListener('resize', resize)
    containerRef.value?.addEventListener('mousemove', onMouseMove)
    lastTime = performance.now()
    animationId = requestAnimationFrame(animate)
  }
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
  window.removeEventListener('resize', resize)
  containerRef.value?.removeEventListener('mousemove', onMouseMove)
  gsap.killTweensOf(tunnelSpeed)
})

defineExpose({
  pauseAnimation,
  resumeAnimation
})
</script>

<style scoped lang="scss">
.tunnel-container {
  position: relative;
  width: 100%;
  height: 600px;
  background: #000000;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 0 60px rgba(0, 255, 255, 0.3);
}

.tunnel-canvas {
  width: 100%;
  height: 100%;
}

.tunnel-title {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 2rem;
  font-weight: bold;
  background: linear-gradient(135deg, #00ffff 0%, #ff00ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 40px rgba(0, 255, 255, 0.5);
  z-index: 10;
  letter-spacing: 4px;
}

.tunnel-info {
  position: absolute;
  top: 20px;
  right: 30px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 10;
}

.info-item {
  font-size: 0.9rem;
  color: #00ffff;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.6);
}

.tunnel-controls {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 20px;
  z-index: 10;
}

.accelerate-btn,
.reverse-btn,
.color-btn {
  padding: 12px 30px;
  border: none;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 2px;
  backdrop-filter: blur(10px);
}

.accelerate-btn {
  background: linear-gradient(135deg, #00ffff 0%, #00bfff 100%);
  color: #000;
  box-shadow: 0 4px 15px rgba(0, 255, 255, 0.4);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 255, 255, 0.6);
  }
}

.reverse-btn {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 2px solid rgba(255, 255, 255, 0.3);

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
}

.color-btn {
  background: rgba(255, 0, 255, 0.2);
  color: #fff;
  border: 2px solid rgba(255, 0, 255, 0.5);

  &:hover {
    background: rgba(255, 0, 255, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 0, 255, 0.3);
  }
}

// CSS3 动画效果
.tunnel-container::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: conic-gradient(from 0deg, transparent, rgba(0, 255, 255, 0.05), transparent, rgba(255, 0, 255, 0.05), transparent);
  animation: rotate 15s linear infinite;
  pointer-events: none;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.tunnel-container::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle, rgba(0, 255, 255, 0.05) 0%, transparent 70%);
  animation: pulse 3s ease-in-out infinite;
  pointer-events: none;
}

@keyframes pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.7; }
}
</style>
