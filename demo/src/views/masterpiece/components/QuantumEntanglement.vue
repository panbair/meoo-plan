<template>
  <div ref="containerRef" class="quantum-container">
    <div class="quantum-title">量子纠缠网络</div>
    <canvas ref="canvasRef" class="quantum-canvas"></canvas>
    <div class="quantum-info">
      <span class="info-item">纠缠对: {{ entangledPairs.length }}</span>
      <span class="info-item"> coherence: {{ coherence.toFixed(2) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

const containerRef = ref<HTMLElement>()
const canvasRef = ref<HTMLCanvasElement>()
const coherence = ref(0.85)

let ctx: CanvasRenderingContext2D | null = null
let animationId: number | null = null
let time = 0
let qubits: Qubit[] = []
let entangledPairs: EntangledPair[] = []
let connections: Connection[] = []

interface Qubit {
  id: number
  x: number
  y: number
  z: number
  spin: number
  phase: number
  state: 'superposition' | 'entangled' | 'collapsed'
  color: string
  pulsePhase: number
}

interface EntangledPair {
  qubit1: number
  qubit2: number
  strength: number
  phaseDiff: number
  history: { x1: number; y1: number; x2: number; y2: number; alpha: number }[]
}

interface Connection {
  from: number
  to: number
  strength: number
  phase: number
}

const initQuantumNetwork = (width: number, height: number) => {
  qubits = []
  entangledPairs = []
  connections = []
  
  const numQubits = 80
  
  for (let i = 0; i < numQubits; i++) {
    qubits.push({
      id: i,
      x: width * 0.1 + Math.random() * width * 0.8,
      y: height * 0.1 + Math.random() * height * 0.8,
      z: Math.random() * 200 - 100,
      spin: Math.random() > 0.5 ? 1 : -1,
      phase: Math.random() * Math.PI * 2,
      state: 'superposition',
      color: getQubitColor(),
      pulsePhase: Math.random() * Math.PI * 2
    })
  }
  
  // 创建纠缠对
  const numPairs = 25
  const usedQubits = new Set<number>()
  
  for (let i = 0; i < numPairs; i++) {
    let idx1, idx2
    do {
      idx1 = Math.floor(Math.random() * numQubits)
    } while (usedQubits.has(idx1))
    usedQubits.add(idx1)
    
    do {
      idx2 = Math.floor(Math.random() * numQubits)
    } while (usedQubits.has(idx2))
    usedQubits.add(idx2)
    
    qubits[idx1].state = 'entangled'
    qubits[idx2].state = 'entangled'
    
    entangledPairs.push({
      qubit1: idx1,
      qubit2: idx2,
      strength: Math.random() * 0.5 + 0.5,
      phaseDiff: Math.random() * Math.PI * 2,
      history: []
    })
  }
  
  // 创建量子连接
  for (let i = 0; i < 60; i++) {
    const from = Math.floor(Math.random() * numQubits)
    const to = Math.floor(Math.random() * numQubits)
    if (from !== to) {
      connections.push({
        from,
        to,
        strength: Math.random() * 0.3 + 0.1,
        phase: Math.random() * Math.PI * 2
      })
    }
  }
}

const getQubitColor = () => {
  const colors = [
    '#00ffff', '#ff00ff', '#ffff00', '#00ff66', '#ff6600',
    '#6666ff', '#ff6666', '#66ffff', '#ffff66', '#9966ff'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

const updateQuantumStates = (deltaTime: number) => {
  time += deltaTime
  coherence.value = 0.85 + Math.sin(time * 0.0005) * 0.1
  
  qubits.forEach(q => {
    q.phase += deltaTime * 0.002
    q.pulsePhase += deltaTime * 0.003
    q.z += Math.sin(time * 0.001 + q.id) * 0.5
    
    // 随机状态坍缩
    if (q.state === 'superposition' && Math.random() < 0.001) {
      q.state = 'collapsed'
      setTimeout(() => {
        q.state = 'superposition'
      }, 2000)
    }
  })
  
  // 更新纠缠对历史
  entangledPairs.forEach(pair => {
    const q1 = qubits[pair.qubit1]
    const q2 = qubits[pair.qubit2]
    
    pair.history.push({
      x1: q1.x,
      y1: q1.y,
      x2: q2.x,
      y2: q2.y,
      alpha: 1
    })
    
    if (pair.history.length > 20) {
      pair.history.shift()
    }
    
    pair.history.forEach((h, i) => {
      h.alpha = (i + 1) / pair.history.length
    })
    
    // 纠缠强度波动
    pair.strength = 0.5 + Math.sin(time * 0.002 + pair.phaseDiff) * 0.3
  })
  
  // 更新连接
  connections.forEach(conn => {
    conn.phase += deltaTime * 0.001
  })
}

const drawQuantumNetwork = (width: number, height: number) => {
  if (!ctx) return
  
  // 清空画布
  const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height) / 2)
  gradient.addColorStop(0, '#0a0515')
  gradient.addColorStop(0.5, '#05000a')
  gradient.addColorStop(1, '#000000')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
  
  // 绘制量子场背景
  drawQuantumField(width, height)
  
  // 绘制连接线
  connections.forEach(conn => {
    const q1 = qubits[conn.from]
    const q2 = qubits[conn.to]
    const strength = conn.strength * Math.abs(Math.sin(conn.phase))
    
    ctx.beginPath()
    ctx.moveTo(q1.x, q1.y)
    ctx.lineTo(q2.x, q2.y)
    ctx.strokeStyle = `rgba(100, 100, 255, ${strength * 0.2})`
    ctx.lineWidth = 1
    ctx.stroke()
  })
  
  // 绘制纠缠对
  entangledPairs.forEach(pair => {
    drawEntanglement(pair, width, height)
  })
  
  // 绘制量子比特
  qubits.forEach(q => {
    drawQubit(q, width, height)
  })
  
  // 绘制相干度指示器
  drawCoherenceIndicator(width, height)
}

const drawQuantumField = (width: number, height: number) => {
  const gridSize = 50
  const amplitude = 20
  
  for (let x = 0; x < width; x += gridSize) {
    for (let y = 0; y < height; y += gridSize) {
      const wave = Math.sin(x * 0.02 + time * 0.001) * Math.cos(y * 0.02 + time * 0.001) * amplitude
      const alpha = 0.05 + Math.abs(wave) / amplitude * 0.05
      
      ctx.beginPath()
      ctx.arc(x + wave, y + wave, 2, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(100, 150, 255, ${alpha})`
      ctx.fill()
    }
  }
}

const drawEntanglement = (pair: EntangledPair, width: number, height: number) => {
  if (!ctx) return
  const q1 = qubits[pair.qubit1]
  const q2 = qubits[pair.qubit2]
  
  // 绘制历史轨迹
  pair.history.forEach((h, i) => {
    if (i === 0) return
    const prev = pair.history[i - 1]
    ctx.beginPath()
    ctx.moveTo(prev.x1, prev.y1)
    ctx.lineTo(h.x1, h.y1)
    ctx.strokeStyle = `rgba(255, 100, 200, ${h.alpha * 0.2})`
    ctx.lineWidth = 1
    ctx.stroke()
    
    ctx.beginPath()
    ctx.moveTo(prev.x2, prev.y2)
    ctx.lineTo(h.x2, h.y2)
    ctx.strokeStyle = `rgba(100, 200, 255, ${h.alpha * 0.2})`
    ctx.lineWidth = 1
    ctx.stroke()
  })
  
  // 绘制纠缠光束
  const gradient = ctx.createLinearGradient(q1.x, q1.y, q2.x, q2.y)
  gradient.addColorStop(0, `rgba(255, 100, 200, ${pair.strength * 0.6})`)
  gradient.addColorStop(0.5, `rgba(200, 100, 255, ${pair.strength * 0.8})`)
  gradient.addColorStop(1, `rgba(100, 200, 255, ${pair.strength * 0.6})`)
  
  ctx.beginPath()
  ctx.moveTo(q1.x, q1.y)
  
  // 贝塞尔曲线
  const midX = (q1.x + q2.x) / 2 + Math.sin(time * 0.002 + pair.phaseDiff) * 30
  const midY = (q1.y + q2.y) / 2 + Math.cos(time * 0.002 + pair.phaseDiff) * 30
  ctx.quadraticCurveTo(midX, midY, q2.x, q2.y)
  ctx.strokeStyle = gradient
  ctx.lineWidth = 3
  ctx.stroke()
  
  // 能量脉冲
  const pulsePos = (time * 0.001) % 1
  const pulseX = q1.x + (q2.x - q1.x) * pulsePos
  const pulseY = q1.y + (q2.y - q1.y) * pulsePos
  const pulseGradient = ctx.createRadialGradient(pulseX, pulseY, 0, pulseX, pulseY, 15)
  pulseGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)')
  pulseGradient.addColorStop(0.5, 'rgba(200, 150, 255, 0.4)')
  pulseGradient.addColorStop(1, 'transparent')
  
  ctx.beginPath()
  ctx.arc(pulseX, pulseY, 15, 0, Math.PI * 2)
  ctx.fillStyle = pulseGradient
  ctx.fill()
}

const drawQubit = (q: Qubit, width: number, height: number) => {
  if (!ctx) return
  
  const perspective = 500
  const scale = perspective / (perspective + q.z)
  const px = (q.x - width / 2) * scale + width / 2
  const py = (q.y - height / 2) * scale + height / 2
  const radius = 8 * scale
  
  const pulse = Math.sin(q.pulsePhase) * 0.5 + 0.5
  
  // 外发光
  let glowColor = q.color
  if (q.state === 'entangled') {
    glowColor = '#ff66ff'
  } else if (q.state === 'collapsed') {
    glowColor = '#ffffff'
  }
  
  const glowGradient = ctx.createRadialGradient(px, py, 0, px, py, radius * 4)
  glowGradient.addColorStop(0, glowColor)
  glowGradient.addColorStop(0.5, `${glowColor}88`)
  glowGradient.addColorStop(1, 'transparent')
  
  ctx.beginPath()
  ctx.arc(px, py, radius * 4, 0, Math.PI * 2)
  ctx.fillStyle = glowGradient
  ctx.fill()
  
  // 量子态核心
  const coreGradient = ctx.createRadialGradient(px, py, 0, px, py, radius)
  coreGradient.addColorStop(0, '#ffffff')
  coreGradient.addColorStop(0.5, glowColor)
  coreGradient.addColorStop(1, `${glowColor}44`)
  
  ctx.beginPath()
  ctx.arc(px, py, radius, 0, Math.PI * 2)
  ctx.fillStyle = coreGradient
  ctx.fill()
  
  // 自旋指示器
  const spinAngle = q.phase
  const spinLength = radius * 0.8
  ctx.beginPath()
  ctx.moveTo(px, py)
  ctx.lineTo(
    px + Math.cos(spinAngle) * spinLength,
    py + Math.sin(spinAngle) * spinLength
  )
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 2
  ctx.stroke()
  
  // 脉冲环
  if (q.state === 'superposition') {
    const pulseRadius = radius * (1 + pulse * 0.5)
    ctx.beginPath()
    ctx.arc(px, py, pulseRadius, 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.5 - pulse * 0.4})`
    ctx.lineWidth = 1
    ctx.stroke()
  }
}

const drawCoherenceIndicator = (width: number, height: number) => {
  if (!ctx) return
  
  const barWidth = 200
  const barHeight = 6
  const x = width - barWidth - 30
  const y = 30
  
  // 背景
  ctx.fillStyle = 'rgba(50, 50, 100, 0.5)'
  ctx.fillRect(x, y, barWidth, barHeight)
  
  // 相干度条
  const fillWidth = barWidth * coherence.value
  const fillGradient = ctx.createLinearGradient(x, y, x + fillWidth, y)
  fillGradient.addColorStop(0, '#00ffff')
  fillGradient.addColorStop(0.5, '#6666ff')
  fillGradient.addColorStop(1, '#ff66ff')
  
  ctx.fillStyle = fillGradient
  ctx.fillRect(x, y, fillWidth, barHeight)
  
  // 边框
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
  ctx.lineWidth = 1
  ctx.strokeRect(x, y, barWidth, barHeight)
}

let lastTime = 0
const animate = (timestamp: number) => {
  if (!canvasRef.value) return
  
  const width = canvasRef.value.width
  const height = canvasRef.value.height
  const deltaTime = timestamp - lastTime
  lastTime = timestamp
  
  updateQuantumStates(deltaTime)
  drawQuantumNetwork(width, height)
  
  animationId = requestAnimationFrame(animate)
}

const resize = () => {
  if (!canvasRef.value || !containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  canvasRef.value.width = rect.width
  canvasRef.value.height = rect.height
  initQuantumNetwork(canvasRef.value.width, canvasRef.value.height)
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
.quantum-container {
  position: relative;
  width: 100%;
  height: 600px;
  background: #000000;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 0 60px rgba(150, 100, 255, 0.3);
}

.quantum-canvas {
  width: 100%;
  height: 100%;
}

.quantum-title {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 2rem;
  font-weight: bold;
  color: #ff66ff;
  text-shadow: 0 0 20px rgba(255, 102, 255, 0.8);
  z-index: 10;
  letter-spacing: 4px;
}

.quantum-info {
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
  color: #6666ff;
  text-shadow: 0 0 10px rgba(102, 102, 255, 0.6);
}
</style>
