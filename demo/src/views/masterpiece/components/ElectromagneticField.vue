<template>
  <div ref="containerRef" class="em-container">
    <div class="em-title">电磁力场</div>
    <canvas ref="canvasRef" class="em-canvas"></canvas>
    <div class="em-info">
      <span class="info-item">电场强度: {{ electricFieldStrength.toFixed(2) }} N/C</span>
      <span class="info-item">磁场强度: {{ magneticFieldStrength.toFixed(2) }} T</span>
    </div>
    <div class="em-controls">
      <div class="control-group">
        <label>电场强度</label>
        <input 
          v-model.number="electricIntensity" 
          type="range" 
          min="0.1" 
          max="3" 
          step="0.1"
          class="em-slider"
        >
      </div>
      <div class="control-group">
        <label>磁场强度</label>
        <input 
          v-model.number="magneticIntensity" 
          type="range" 
          min="0.1" 
          max="3" 
          step="0.1"
          class="em-slider"
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

const containerRef = ref<HTMLElement>()
const canvasRef = ref<HTMLCanvasElement>()
const electricIntensity = ref(1.5)
const magneticIntensity = ref(1.0)

const electricFieldStrength = ref(0)
const magneticFieldStrength = ref(0)

let ctx: CanvasRenderingContext2D | null = null
let animationId: number | null = null
let time = 0
let charges: Charge[] = []
let fieldLines: FieldLine[] = []
let magneticPoles: MagneticPole[] = []
let fieldParticles: FieldParticle[] = []

interface Charge {
  x: number
  y: number
  z: number
  type: 'positive' | 'negative'
  magnitude: number
  phase: number
}

interface FieldLine {
  startX: number
  startY: number
  endX: number
  endY: number
  type: 'electric' | 'magnetic'
  strength: number
  phase: number
}

interface MagneticPole {
  x: number
  y: number
  type: 'north' | 'south'
  strength: number
}

interface FieldParticle {
  x: number
  y: number
  vx: number
  vy: number
  type: 'electric' | 'magnetic'
  life: number
  maxLife: number
  trail: { x: number; y: number; alpha: number }[]
}

const initElectromagneticField = (width: number, height: number) => {
  charges = []
  fieldLines = []
  magneticPoles = []
  fieldParticles = []
  
  // 生成电荷
  const numCharges = 6
  for (let i = 0; i < numCharges; i++) {
    charges.push({
      x: width * 0.2 + (i % 3) * width * 0.3,
      y: height * 0.3 + Math.floor(i / 3) * height * 0.4,
      z: 0,
      type: i % 2 === 0 ? 'positive' : 'negative',
      magnitude: 2 + Math.random(),
      phase: Math.random() * Math.PI * 2
    })
  }
  
  // 生成磁极
  magneticPoles.push({
    x: width * 0.2,
    y: height * 0.5,
    type: 'north',
    strength: 3
  })
  
  magneticPoles.push({
    x: width * 0.8,
    y: height * 0.5,
    type: 'south',
    strength: 3
  })
  
  // 初始化场线
  generateFieldLines(width, height)
  
  // 生成场粒子
  for (let i = 0; i < 100; i++) {
    fieldParticles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: 0,
      vy: 0,
      type: Math.random() > 0.5 ? 'electric' : 'magnetic',
      life: Math.random() * 200 + 100,
      maxLife: Math.random() * 200 + 100,
      trail: []
    })
  }
}

const generateFieldLines = (width: number, height: number) => {
  fieldLines = []
  
  // 电场线（从正电荷到负电荷）
  const positiveCharges = charges.filter(c => c.type === 'positive')
  const negativeCharges = charges.filter(c => c.type === 'negative')
  
  positiveCharges.forEach(pc => {
    negativeCharges.forEach(nc => {
      const numLines = 8
      for (let i = 0; i < numLines; i++) {
        const angle = (i / numLines) * Math.PI * 2
        const startX = pc.x + Math.cos(angle) * 20
        const startY = pc.y + Math.sin(angle) * 20
        const endX = nc.x + Math.cos(angle + Math.PI) * 20
        const endY = nc.y + Math.sin(angle + Math.PI) * 20
        
        fieldLines.push({
          startX,
          startY,
          endX,
          endY,
          type: 'electric',
          strength: pc.magnitude * nc.magnitude,
          phase: Math.random() * Math.PI * 2
        })
      }
    })
  })
  
  // 磁场线
  if (magneticPoles.length >= 2) {
    const north = magneticPoles[0]
    const south = magneticPoles[1]
    const numLines = 12
    
    for (let i = 0; i < numLines; i++) {
      const angle = (i / numLines) * Math.PI * 2
      const startX = north.x + Math.cos(angle) * 30
      const startY = north.y + Math.sin(angle) * 30
      const endX = south.x + Math.cos(angle + Math.PI) * 30
      const endY = south.y + Math.sin(angle + Math.PI) * 30
      
      fieldLines.push({
        startX,
        startY,
        endX,
        endY,
        type: 'magnetic',
        strength: north.strength * south.strength,
        phase: Math.random() * Math.PI * 2
      })
    }
  }
}

const updateField = (deltaTime: number, width: number, height: number) => {
  time += deltaTime
  
  electricFieldStrength.value = 5.2e6 * electricIntensity.value
  magneticFieldStrength.value = 1.5 * magneticIntensity.value
  
  // 更新电荷相位
  charges.forEach(charge => {
    charge.phase += deltaTime * 0.002
    charge.z = Math.sin(charge.phase) * 10
  })
  
  // 更新场线相位
  fieldLines.forEach(line => {
    line.phase += deltaTime * 0.001
  })
  
  // 更新场粒子
  fieldParticles.forEach((particle, index) => {
    // 计算电场力
    let ex = 0, ey = 0
    charges.forEach(charge => {
      const dx = charge.x - particle.x
      const dy = charge.y - particle.y
      const dist = Math.sqrt(dx * dx + dy * dy) + 1
      const force = (charge.magnitude * electricIntensity.value) / (dist * dist)
      const sign = charge.type === 'positive' ? 1 : -1
      
      ex += (dx / dist) * force * sign
      ey += (dy / dist) * force * sign
    })
    
    // 计算磁场力
    let mx = 0, my = 0
    magneticPoles.forEach(pole => {
      const dx = pole.x - particle.x
      const dy = pole.y - particle.y
      const dist = Math.sqrt(dx * dx + dy * dy) + 1
      const force = (pole.strength * magneticIntensity.value) / (dist * dist)
      const sign = pole.type === 'north' ? 1 : -1
      
      mx += (dx / dist) * force * sign
      my += (dy / dist) * force * sign
    })
    
    // 更新粒子
    if (particle.type === 'electric') {
      particle.vx += ex * 0.01 * deltaTime
      particle.vy += ey * 0.01 * deltaTime
    } else {
      particle.vx += mx * 0.01 * deltaTime
      particle.vy += my * 0.01 * deltaTime
    }
    
    // 阻尼
    particle.vx *= 0.98
    particle.vy *= 0.98
    
    // 更新位置
    particle.x += particle.vx * deltaTime * 0.05
    particle.y += particle.vy * deltaTime * 0.05
    
    // 边界处理
    if (particle.x < 0) particle.x = width
    if (particle.x > width) particle.x = 0
    if (particle.y < 0) particle.y = height
    if (particle.y > height) particle.y = 0
    
    // 更新生命周期
    particle.life -= deltaTime * 0.05
    if (particle.life <= 0) {
      particle.x = Math.random() * width
      particle.y = Math.random() * height
      particle.vx = 0
      particle.vy = 0
      particle.life = particle.maxLife
      particle.trail = []
    }
    
    // 更新轨迹
    particle.trail.push({ x: particle.x, y: particle.y, alpha: 1 })
    if (particle.trail.length > 15) {
      particle.trail.shift()
    }
    
    particle.trail.forEach((t, i) => {
      t.alpha = (i + 1) / particle.trail.length * (particle.life / particle.maxLife)
    })
  })
}

const drawElectromagneticField = (width: number, height: number) => {
  if (!ctx) return
  
  // 清空画布
  const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height) / 2)
  gradient.addColorStop(0, '#0a0a15')
  gradient.addColorStop(0.5, '#05050a')
  gradient.addColorStop(1, '#000000')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
  
  // 绘制背景场
  drawBackgroundField(width, height)
  
  // 绘制场线
  fieldLines.forEach(line => {
    drawFieldLine(line)
  })
  
  // 绘制场粒子
  fieldParticles.forEach(particle => {
    drawFieldParticle(particle)
  })
  
  // 绘制磁极
  magneticPoles.forEach(pole => {
    drawMagneticPole(pole)
  })
  
  // 绘制电荷
  charges.forEach(charge => {
    drawCharge(charge)
  })
}

const drawBackgroundField = (width: number, height: number) => {
  if (!ctx) return
  
  const gridSize = 40
  
  for (let x = 0; x < width; x += gridSize) {
    for (let y = 0; y < height; y += gridSize) {
      // 计算场方向
      let fx = 0, fy = 0
      
      charges.forEach(charge => {
        const dx = charge.x - x
        const dy = charge.y - y
        const dist = Math.sqrt(dx * dx + dy * dy) + 1
        const sign = charge.type === 'positive' ? 1 : -1
        fx += (dx / dist) / dist * sign
        fy += (dy / dist) / dist * sign
      })
      
      const angle = Math.atan2(fy, fx)
      const length = Math.sqrt(fx * fx + fy * fy) * 50
      
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(angle)
      
      const alpha = Math.min(length / 10, 0.3)
      ctx.strokeStyle = `rgba(100, 150, 255, ${alpha})`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(-length / 2, 0)
      ctx.lineTo(length / 2, 0)
      // 箭头
      ctx.lineTo(length / 2 - 3, -2)
      ctx.moveTo(length / 2, 0)
      ctx.lineTo(length / 2 - 3, 2)
      ctx.stroke()
      
      ctx.restore()
    }
  }
}

const drawFieldLine = (line: FieldLine) => {
  if (!ctx) return
  
  const phase = line.phase
  const strength = line.strength * (line.type === 'electric' ? electricIntensity.value : magneticIntensity.value)
  const color = line.type === 'electric' ? '#ffcc00' : '#66ccff'
  const rgb = hexToRgb(color)
  
  // 绘制弯曲场线（贝塞尔曲线）
  const midX = (line.startX + line.endX) / 2 + Math.sin(phase) * 30
  const midY = (line.startY + line.endY) / 2 + Math.cos(phase) * 30
  
  // 多段绘制以显示流动效果
  const numSegments = 20
  for (let i = 0; i < numSegments; i++) {
    const t1 = i / numSegments
    const t2 = (i + 1) / numSegments
    
    const x1 = (1 - t1) * (1 - t1) * line.startX + 2 * (1 - t1) * t1 * midX + t1 * t1 * line.endX
    const y1 = (1 - t1) * (1 - t1) * line.startY + 2 * (1 - t1) * t1 * midY + t1 * t1 * line.endY
    const x2 = (1 - t2) * (1 - t2) * line.startX + 2 * (1 - t2) * t2 * midX + t2 * t2 * line.endX
    const y2 = (1 - t2) * (1 - t2) * line.startY + 2 * (1 - t2) * t2 * midY + t2 * t2 * line.endY
    
    const flowPhase = (time * 0.001 + t1 * 5) % 1
    const alpha = strength * 0.3 * flowPhase
    
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`
    ctx.lineWidth = 2
    ctx.stroke()
  }
}

const drawFieldParticle = (particle: FieldParticle) => {
  if (!ctx) return
  
  // 绘制轨迹
  particle.trail.forEach((t, i) => {
    if (i === 0) return
    const prev = particle.trail[i - 1]
    const color = particle.type === 'electric' ? '#ffcc00' : '#66ccff'
    const rgb = hexToRgb(color)
    
    ctx.beginPath()
    ctx.moveTo(prev.x, prev.y)
    ctx.lineTo(t.x, t.y)
    ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${t.alpha * 0.4})`
    ctx.lineWidth = 1
    ctx.stroke()
  })
  
  // 绘制粒子
  const color = particle.type === 'electric' ? '#ffcc00' : '#66ccff'
  const rgb = hexToRgb(color)
  const alpha = particle.life / particle.maxLife
  
  const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, 5)
  gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`)
  gradient.addColorStop(1, 'transparent')
  
  ctx.beginPath()
  ctx.arc(particle.x, particle.y, 5, 0, Math.PI * 2)
  ctx.fillStyle = gradient
  ctx.fill()
}

const drawMagneticPole = (pole: MagneticPole) => {
  if (!ctx) return
  
  const color = pole.type === 'north' ? '#ff6666' : '#6666ff'
  const label = pole.type === 'north' ? 'N' : 'S'
  const rgb = hexToRgb(color)
  
  // 发光效果
  const glowGradient = ctx.createRadialGradient(pole.x, pole.y, 0, pole.x, pole.y, 40)
  glowGradient.addColorStop(0, color)
  glowGradient.addColorStop(0.5, `${color}88`)
  glowGradient.addColorStop(1, 'transparent')
  
  ctx.beginPath()
  ctx.arc(pole.x, pole.y, 40, 0, Math.PI * 2)
  ctx.fillStyle = glowGradient
  ctx.fill()
  
  // 磁极本体
  const coreGradient = ctx.createRadialGradient(pole.x - 5, pole.y - 5, 0, pole.x, pole.y, 25)
  coreGradient.addColorStop(0, '#ffffff')
  coreGradient.addColorStop(0.3, color)
  coreGradient.addColorStop(1, `${color}88`)
  
  ctx.beginPath()
  ctx.arc(pole.x, pole.y, 25, 0, Math.PI * 2)
  ctx.fillStyle = coreGradient
  ctx.fill()
  
  // 标签
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 20px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(label, pole.x, pole.y)
}

const drawCharge = (charge: Charge) => {
  if (!ctx) return
  
  const color = charge.type === 'positive' ? '#ff6666' : '#6666ff'
  const symbol = charge.type === 'positive' ? '+' : '-'
  const rgb = hexToRgb(color)
  const pulse = Math.sin(charge.phase) * 0.2 + 0.8
  
  // 发光效果
  const glowGradient = ctx.createRadialGradient(charge.x, charge.y, 0, charge.x, charge.y, 40 * pulse)
  glowGradient.addColorStop(0, color)
  glowGradient.addColorStop(0.5, `${color}88`)
  glowGradient.addColorStop(1, 'transparent')
  
  ctx.beginPath()
  ctx.arc(charge.x, charge.y, 40 * pulse, 0, Math.PI * 2)
  ctx.fillStyle = glowGradient
  ctx.fill()
  
  // 电荷本体
  const coreGradient = ctx.createRadialGradient(charge.x - 5, charge.y - 5, 0, charge.x, charge.y, 20 * pulse)
  coreGradient.addColorStop(0, '#ffffff')
  coreGradient.addColorStop(0.3, color)
  coreGradient.addColorStop(1, `${color}88`)
  
  ctx.beginPath()
  ctx.arc(charge.x, charge.y, 20 * pulse, 0, Math.PI * 2)
  ctx.fillStyle = coreGradient
  ctx.fill()
  
  // 符号
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 18px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(symbol, charge.x, charge.y)
}

const hexToRgb = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
}

let lastTime = 0
const animate = (timestamp: number) => {
  if (!canvasRef.value) return
  
  const width = canvasRef.value.width
  const height = canvasRef.value.height
  const deltaTime = timestamp - lastTime
  lastTime = timestamp
  
  updateField(deltaTime, width, height)
  drawElectromagneticField(width, height)
  
  animationId = requestAnimationFrame(animate)
}

const resize = () => {
  if (!canvasRef.value || !containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  canvasRef.value.width = rect.width
  canvasRef.value.height = rect.height
  initElectromagneticField(canvasRef.value.width, canvasRef.value.height)
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
.em-container {
  position: relative;
  width: 100%;
  height: 600px;
  background: #000000;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 0 60px rgba(100, 200, 255, 0.3);
}

.em-canvas {
  width: 100%;
  height: 100%;
}

.em-title {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 2rem;
  font-weight: bold;
  color: #66ccff;
  text-shadow: 0 0 20px rgba(102, 204, 255, 0.8);
  z-index: 10;
  letter-spacing: 4px;
}

.em-info {
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
  color: #66ccff;
  text-shadow: 0 0 10px rgba(102, 204, 255, 0.6);
}

.em-controls {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 30px;
  z-index: 10;
}

.control-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  label {
    font-size: 0.85rem;
    color: #66ccff;
    text-shadow: 0 0 10px rgba(102, 204, 255, 0.6);
  }
}

.em-slider {
  width: 150px;
  height: 6px;
  -webkit-appearance: none;
  background: linear-gradient(90deg, #ffcc00, #66ccff);
  border-radius: 3px;
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.8);
    cursor: pointer;
  }
}
</style>
