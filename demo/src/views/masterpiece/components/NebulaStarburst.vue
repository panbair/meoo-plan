<template>
  <div ref="containerRef" class="nebula-container">
    <div class="nebula-title">星云星暴</div>
    <canvas ref="canvasRef" class="nebula-canvas"></canvas>
    <div class="nebula-info">
      <span class="info-item">恒星: {{ stars.length }}</span>
      <span class="info-item">爆发强度: {{ eruptionIntensity.toFixed(1) }}x</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const containerRef = ref<HTMLElement>()
const canvasRef = ref<HTMLCanvasElement>()
const eruptionIntensity = ref(1.0)

let ctx: CanvasRenderingContext2D | null = null
let animationId: number | null = null
let time = 0
let stars: Star[] = []
let nebulaClouds: NebulaCloud[] = []
let explosionParticles: ExplosionParticle[] = []
let shockwaves: Shockwave[] = []

interface Star {
  x: number
  y: number
  radius: number
  brightness: number
  color: string
  temperature: number
  phase: number
  isErupting: boolean
  eruptionTime: number
}

interface NebulaCloud {
  x: number
  y: number
  radius: number
  color: string
  opacity: number
  driftX: number
  driftY: number
  turbulence: number
}

interface ExplosionParticle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  life: number
  maxLife: number
  color: string
  trail: { x: number; y: number; alpha: number }[]
}

interface Shockwave {
  x: number
  y: number
  radius: number
  maxRadius: number
  alpha: number
  color: string
}

const initNebula = (width: number, height: number) => {
  stars = []
  nebulaClouds = []
  explosionParticles = []
  shockwaves = []
  
  // 生成恒星
  const numStars = 150
  for (let i = 0; i < numStars; i++) {
    const temp = Math.random()
    let color, radius
    
    if (temp < 0.3) {
      // 蓝色高温恒星
      color = '#66ccff'
      radius = Math.random() * 2 + 1
    } else if (temp < 0.6) {
      // 黄色中等恒星
      color = '#ffdd66'
      radius = Math.random() * 3 + 1
    } else if (temp < 0.85) {
      // 红色低温恒星
      color = '#ff6666'
      radius = Math.random() * 4 + 2
    } else {
      // 超巨星（可能爆发）
      color = '#ffcc00'
      radius = Math.random() * 6 + 4
    }
    
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius,
      brightness: Math.random() * 0.5 + 0.5,
      color,
      temperature: temp,
      phase: Math.random() * Math.PI * 2,
      isErupting: false,
      eruptionTime: 0
    })
  }
  
  // 生成星云云团
  const numClouds = 15
  for (let i = 0; i < numClouds; i++) {
    nebulaClouds.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 200 + 100,
      color: getNebulaColor(),
      opacity: Math.random() * 0.3 + 0.1,
      driftX: (Math.random() - 0.5) * 0.2,
      driftY: (Math.random() - 0.5) * 0.2,
      turbulence: Math.random() * 0.5 + 0.5
    })
  }
}

const getNebulaColor = () => {
  const colors = [
    { r: 255, g: 100, b: 100 },
    { r: 100, g: 100, b: 255 },
    { r: 100, g: 255, b: 200 },
    { r: 255, g: 100, b: 255 },
    { r: 100, g: 150, b: 255 }
  ]
  const color = colors[Math.floor(Math.random() * colors.length)]
  return `rgb(${color.r}, ${color.g}, ${color.b})`
}

const hexToRgb = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
}

const triggerEruption = (width: number, height: number) => {
  // 随机选择一颗超巨星爆发
  const supergiants = stars.filter(s => s.radius > 5 && !s.isErupting)
  if (supergiants.length === 0) return
  
  const star = supergiants[Math.floor(Math.random() * supergiants.length)]
  star.isErupting = true
  star.eruptionTime = time
  
  // 生成爆炸粒子
  const numParticles = 200
  const rgb = hexToRgb(star.color)
  
  for (let i = 0; i < numParticles; i++) {
    const angle = (i / numParticles) * Math.PI * 2
    const speed = Math.random() * 5 + 3
    
    explosionParticles.push({
      x: star.x,
      y: star.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: Math.random() * 4 + 2,
      life: Math.random() * 300 + 200,
      maxLife: Math.random() * 300 + 200,
      color: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      trail: []
    })
  }
  
  // 生成冲击波
  shockwaves.push({
    x: star.x,
    y: star.y,
    radius: star.radius,
    maxRadius: 400,
    alpha: 1,
    color: star.color
  })
  
  eruptionIntensity.value = 3.0
}

const updateNebula = (deltaTime: number, width: number, height: number) => {
  time += deltaTime
  
  // 更新爆发强度
  eruptionIntensity.value = Math.max(1, eruptionIntensity.value - deltaTime * 0.001)
  
  // 更新恒星
  stars.forEach(star => {
    star.phase += deltaTime * 0.002
    star.brightness = 0.7 + Math.sin(star.phase) * 0.3
    
    // 检查爆发结束
    if (star.isErupting && time - star.eruptionTime > 500) {
      star.isErupting = false
      star.radius = Math.random() * 6 + 4 // 重置大小
    }
  })
  
  // 更新星云云团
  nebulaClouds.forEach(cloud => {
    cloud.x += cloud.driftX
    cloud.y += cloud.driftY
    
    // 边界循环
    if (cloud.x < -cloud.radius) cloud.x = width + cloud.radius
    if (cloud.x > width + cloud.radius) cloud.x = -cloud.radius
    if (cloud.y < -cloud.radius) cloud.y = height + cloud.radius
    if (cloud.y > height + cloud.radius) cloud.y = -cloud.radius
    
    // 湍流效果
    cloud.turbulence += deltaTime * 0.0005
  })
  
  // 更新爆炸粒子
  explosionParticles.forEach((p, index) => {
    p.trail.push({ x: p.x, y: p.y, alpha: 1 })
    if (p.trail.length > 10) {
      p.trail.shift()
    }
    
    p.x += p.vx * deltaTime * 0.05
    p.y += p.vy * deltaTime * 0.05
    p.vx *= 0.99
    p.vy *= 0.99
    p.life -= deltaTime * 0.05
    
    // 移除死亡粒子
    if (p.life <= 0) {
      explosionParticles.splice(index, 1)
    }
    
    p.trail.forEach((t, i) => {
      t.alpha = (i + 1) / p.trail.length * (p.life / p.maxLife)
    })
  })
  
  // 更新冲击波
  shockwaves.forEach((wave, index) => {
    wave.radius += deltaTime * 0.1
    wave.alpha = 1 - (wave.radius / wave.maxRadius)
    
    if (wave.alpha <= 0) {
      shockwaves.splice(index, 1)
    }
  })
  
  // 随机触发爆发
  if (Math.random() < 0.002 && eruptionIntensity.value <= 1) {
    triggerEruption(width, height)
  }
}

const drawNebula = (width: number, height: number) => {
  if (!ctx) return
  
  // 清空画布
  const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height) / 2)
  gradient.addColorStop(0, '#0a0a20')
  gradient.addColorStop(0.5, '#050510')
  gradient.addColorStop(1, '#000000')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
  
  // 绘制星云云团
  nebulaClouds.forEach(cloud => {
    drawNebulaCloud(cloud)
  })
  
  // 绘制冲击波
  shockwaves.forEach(wave => {
    drawShockwave(wave)
  })
  
  // 绘制爆炸粒子
  explosionParticles.forEach(p => {
    drawExplosionParticle(p)
  })
  
  // 绘制恒星
  stars.forEach(star => {
    drawStar(star)
  })
}

const drawNebulaCloud = (cloud: NebulaCloud) => {
  if (!ctx) return
  
  const rgb = cloud.color.match(/\d+/g)
  if (!rgb) return
  
  const gradient = ctx.createRadialGradient(cloud.x, cloud.y, 0, cloud.x, cloud.y, cloud.radius)
  
  // 多层云团
  for (let i = 3; i >= 0; i--) {
    const turbulence = Math.sin(cloud.turbulence + i) * cloud.turbulence * 20
    const layerOpacity = cloud.opacity * (1 - i * 0.2)
    
    gradient.addColorStop(0, `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${layerOpacity})`)
    gradient.addColorStop(0.5, `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${layerOpacity * 0.5})`)
    gradient.addColorStop(1, 'transparent')
    
    ctx.beginPath()
    ctx.arc(cloud.x + turbulence, cloud.y, cloud.radius * (1 - i * 0.2), 0, Math.PI * 2)
    ctx.fillStyle = gradient
    ctx.fill()
  }
}

const drawShockwave = (wave: Shockwave) => {
  if (!ctx) return
  
  const gradient = ctx.createRadialGradient(wave.x, wave.y, wave.radius * 0.9, wave.x, wave.y, wave.radius)
  gradient.addColorStop(0, 'transparent')
  gradient.addColorStop(0.5, `${wave.color}${Math.floor(wave.alpha * 50).toString(16).padStart(2, '0')}`)
  gradient.addColorStop(1, 'transparent')
  
  ctx.beginPath()
  ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2)
  ctx.fillStyle = gradient
  ctx.fill()
  
  // 内圈
  ctx.beginPath()
  ctx.arc(wave.x, wave.y, wave.radius * 0.95, 0, Math.PI * 2)
  ctx.strokeStyle = `${wave.color}${Math.floor(wave.alpha * 100).toString(16).padStart(2, '0')}`
  ctx.lineWidth = 2
  ctx.stroke()
}

const drawExplosionParticle = (p: ExplosionParticle) => {
  if (!ctx) return
  
  // 绘制轨迹
  p.trail.forEach((t, i) => {
    if (i === 0) return
    const prev = p.trail[i - 1]
    ctx.beginPath()
    ctx.moveTo(prev.x, prev.y)
    ctx.lineTo(t.x, t.y)
    ctx.strokeStyle = p.color.replace(')', `, ${t.alpha * 0.3})`).replace('rgb', 'rgba')
    ctx.lineWidth = p.size * 0.5
    ctx.stroke()
  })
  
  // 绘制粒子
  const rgb = p.color.match(/\d+/g)
  if (!rgb) return
  
  const alpha = p.life / p.maxLife
  const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2)
  gradient.addColorStop(0, `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`)
  gradient.addColorStop(0.5, `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha * 0.5})`)
  gradient.addColorStop(1, 'transparent')
  
  ctx.beginPath()
  ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2)
  ctx.fillStyle = gradient
  ctx.fill()
}

const drawStar = (star: Star) => {
  if (!ctx) return
  
  const radius = star.isErupting ? star.radius * (1 + Math.sin(time * 0.02) * 0.5) : star.radius
  const brightness = star.brightness * (star.isErupting ? 2 : 1)
  
  // 外发光
  const glowGradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, radius * 4)
  const rgb = hexToRgb(star.color)
  glowGradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${brightness * 0.8})`)
  glowGradient.addColorStop(0.5, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${brightness * 0.3})`)
  glowGradient.addColorStop(1, 'transparent')
  
  ctx.beginPath()
  ctx.arc(star.x, star.y, radius * 4, 0, Math.PI * 2)
  ctx.fillStyle = glowGradient
  ctx.fill()
  
  // 星星核心
  const coreGradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, radius)
  coreGradient.addColorStop(0, '#ffffff')
  coreGradient.addColorStop(0.5, star.color)
  coreGradient.addColorStop(1, `${star.color}88`)
  
  ctx.beginPath()
  ctx.arc(star.x, star.y, radius, 0, Math.PI * 2)
  ctx.fillStyle = coreGradient
  ctx.fill()
  
  // 星芒效果（只对亮星）
  if (brightness > 0.8) {
    const rayLength = radius * 6 * brightness
    const rayWidth = 1
    
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI + Math.PI / 4
      ctx.beginPath()
      ctx.moveTo(
        star.x + Math.cos(angle) * radius,
        star.y + Math.sin(angle) * radius
      )
      ctx.lineTo(
        star.x + Math.cos(angle) * rayLength,
        star.y + Math.sin(angle) * rayLength
      )
      ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${brightness * 0.5})`
      ctx.lineWidth = rayWidth
      ctx.stroke()
    }
  }
}

let lastTime = 0
const animate = (timestamp: number) => {
  if (!canvasRef.value) return
  
  const width = canvasRef.value.width
  const height = canvasRef.value.height
  const deltaTime = timestamp - lastTime
  lastTime = timestamp
  
  updateNebula(deltaTime, width, height)
  drawNebula(width, height)
  
  animationId = requestAnimationFrame(animate)
}

const resize = () => {
  if (!canvasRef.value || !containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  canvasRef.value.width = rect.width
  canvasRef.value.height = rect.height
  initNebula(canvasRef.value.width, canvasRef.value.height)
}

onMounted(() => {
  if (canvasRef.value) {
    ctx = canvasRef.value.getContext('2d')
    resize()
    window.addEventListener('resize', resize)
    lastTime = performance.now()
    animationId = requestAnimationFrame(animate)
  }
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('resize', resize)
})
</script>

<style scoped lang="scss">
.nebula-container {
  position: relative;
  width: 100%;
  height: 600px;
  background: #000000;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 0 60px rgba(255, 150, 50, 0.3);
}

.nebula-canvas {
  width: 100%;
  height: 100%;
}

.nebula-title {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 2rem;
  font-weight: bold;
  color: #ffaa00;
  text-shadow: 0 0 20px rgba(255, 170, 0, 0.8);
  z-index: 10;
  letter-spacing: 4px;
}

.nebula-info {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 40px;
  z-index: 10;
}

.info-item {
  font-size: 0.9rem;
  color: #ffcc66;
  text-shadow: 0 0 10px rgba(255, 204, 102, 0.6);
}
</style>
