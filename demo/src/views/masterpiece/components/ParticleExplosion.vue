<template>
  <div ref="containerRef" class="explosion-container">
    <div class="explosion-title">粒子爆炸</div>
    <div class="particle-wrapper" ref="particleWrapper">
      <canvas ref="canvasRef" class="explosion-canvas"></canvas>
    </div>
    <div class="click-hint">点击任意位置触发爆炸</div>
    <div class="explosion-controls">
      <button @click="autoExplode" class="btn-explode">自动爆炸</button>
      <button @click="clearParticles" class="btn-clear">清除</button>
    </div>
    <div class="stats-display">
      <span>粒子数: {{ particleCount }}</span>
      <span>FPS: {{ fps }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

const containerRef = ref<HTMLElement>()
const particleWrapper = ref<HTMLElement>()
const canvasRef = ref<HTMLCanvasElement>()
const particleCount = ref(0)
const fps = ref(0)

let ctx: CanvasRenderingContext2D | null = null
let animationId: number | null = null
let particles: Particle[] = []
let lastTime = 0
let frameCount = 0
let lastFpsUpdate = 0

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
  life: number
  maxLife: number
  trail: { x: number; y: number; alpha: number }[]
  glow: boolean
}

const colors = [
  '#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3', '#667eea',
  '#764ba2', '#f093fb', '#43e97b', '#4facfe', '#00f2fe'
]

const createExplosion = (x: number, y: number) => {
  const numParticles = 150
  
  for (let i = 0; i < numParticles; i++) {
    const angle = (i / numParticles) * Math.PI * 2
    const speed = Math.random() * 15 + 5
    const radius = Math.random() * 6 + 2
    
    const particle: Particle = {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: Math.random() * 100 + 100,
      maxLife: Math.random() * 100 + 100,
      trail: [],
      glow: Math.random() > 0.5
    }
    
    particles.push(particle)
  }
  
  particleCount.value = particles.length
}

const autoExplode = () => {
  if (!canvasRef.value) return
  
  const width = canvasRef.value.width
  const height = canvasRef.value.height
  
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      const x = Math.random() * width
      const y = Math.random() * height
      createExplosion(x, y)
    }, i * 300)
  }
}

const clearParticles = () => {
  particles = []
  particleCount.value = 0
}

const updateParticles = (deltaTime: number) => {
  particles.forEach((p, index) => {
    p.trail.push({ x: p.x, y: p.y, alpha: 1 })
    if (p.trail.length > 20) {
      p.trail.shift()
    }
    
    p.x += p.vx * deltaTime * 0.01
    p.y += p.vy * deltaTime * 0.01
    p.vy += 0.3 * deltaTime * 0.01
    p.vx *= 0.98
    p.vy *= 0.98
    
    if (!canvasRef.value) return
    const width = canvasRef.value.width
    const height = canvasRef.value.height
    
    if (p.x < p.radius) {
      p.x = p.radius
      p.vx *= -0.7
    }
    if (p.x > width - p.radius) {
      p.x = width - p.radius
      p.vx *= -0.7
    }
    if (p.y < p.radius) {
      p.y = p.radius
      p.vy *= -0.7
    }
    if (p.y > height - p.radius) {
      p.y = height - p.radius
      p.vy *= -0.7
    }
    
    p.life -= deltaTime * 0.05
    
    p.trail.forEach((t, i) => {
      t.alpha = (i + 1) / p.trail.length * (p.life / p.maxLife)
    })
    
    if (p.life <= 0) {
      particles.splice(index, 1)
    }
  })
  
  particleCount.value = particles.length
}

const drawParticles = () => {
  if (!ctx || !canvasRef.value) return
  
  const width = canvasRef.value.width
  const height = canvasRef.value.height
  
  ctx.fillStyle = 'rgba(10, 10, 20, 0.15)'
  ctx.fillRect(0, 0, width, height)
  
  particles.forEach(p => {
    p.trail.forEach((t, i) => {
      if (i === 0) return
      const prev = p.trail[i - 1]
      
      const rgb = hexToRgb(p.color)
      ctx.beginPath()
      ctx.moveTo(prev.x, prev.y)
      ctx.lineTo(t.x, t.y)
      ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${t.alpha * 0.4})`
      ctx.lineWidth = p.radius * 0.3
      ctx.stroke()
    })
    
    const rgb = hexToRgb(p.color)
    const alpha = p.life / p.maxLife
    
    if (p.glow) {
      const glowGradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3)
      glowGradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha * 0.5})`)
      glowGradient.addColorStop(1, 'transparent')
      
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2)
      ctx.fillStyle = glowGradient
      ctx.fill()
    }
    
    const gradient = ctx.createRadialGradient(p.x - p.radius * 0.3, p.y - p.radius * 0.3, 0, p.x, p.y, p.radius)
    gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`)
    gradient.addColorStop(0.5, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`)
    gradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha * 0.5})`)
    
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
    ctx.fillStyle = gradient
    ctx.fill()
  })
}

const animate = (timestamp: number) => {
  if (!canvasRef.value) return
  
  const deltaTime = timestamp - lastTime
  lastTime = timestamp
  
  frameCount++
  if (timestamp - lastFpsUpdate >= 1000) {
    fps.value = frameCount
    frameCount = 0
    lastFpsUpdate = timestamp
  }
  
  updateParticles(deltaTime)
  drawParticles()
  
  animationId = requestAnimationFrame(animate)
}

const resize = () => {
  if (!canvasRef.value || !containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  canvasRef.value.width = rect.width
  canvasRef.value.height = rect.height
}

const onClick = (e: MouseEvent) => {
  if (!canvasRef.value) return
  const rect = canvasRef.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  createExplosion(x, y)
}

const hexToRgb = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
}

onMounted(() => {
  if (canvasRef.value) {
    ctx = canvasRef.value.getContext('2d')
    resize()
    window.addEventListener('resize', resize)
    canvasRef.value.addEventListener('click', onClick)
    
    lastTime = performance.now()
    lastFpsUpdate = lastTime
    animationId = requestAnimationFrame(animate)
  }
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('resize', resize)
  if (canvasRef.value) {
    canvasRef.value.removeEventListener('click', onClick)
  }
  gsap.killTweensOf(particles)
})
</script>

<style scoped lang="scss">
.explosion-container {
  position: relative;
  width: 100%;
  height: 600px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 0 60px rgba(255, 107, 107, 0.3);
}

.explosion-title {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 2rem;
  font-weight: bold;
  background: linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 40px rgba(255, 107, 107, 0.5);
  z-index: 10;
  letter-spacing: 4px;
}

.particle-wrapper {
  width: 100%;
  height: 100%;
}

.explosion-canvas {
  width: 100%;
  height: 100%;
  cursor: crosshair;
}

.click-hint {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
  pointer-events: none;
  z-index: 5;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.3;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.7;
    transform: translate(-50%, -50%) scale(1.05);
  }
}

.explosion-controls {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 20px;
  z-index: 10;
}

.btn-explode,
.btn-clear {
  padding: 12px 30px;
  border: none;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.btn-explode {
  background: linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%);
  color: #fff;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 107, 107, 0.6);
  }

  &:active {
    transform: translateY(0);
  }
}

.btn-clear {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 2px solid rgba(255, 255, 255, 0.3);

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
}

.stats-display {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 10;
  
  span {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.7);
    background: rgba(0, 0, 0, 0.3);
    padding: 5px 10px;
    border-radius: 5px;
    backdrop-filter: blur(5px);
  }
}

.explosion-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 50% 50%, transparent 0%, rgba(0, 0, 0, 0.5) 100%);
  pointer-events: none;
  z-index: 1;
}

.explosion-container::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: conic-gradient(from 0deg, transparent, rgba(255, 107, 107, 0.1), transparent 30%);
  animation: rotate 30s linear infinite;
  pointer-events: none;
  z-index: 0;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
