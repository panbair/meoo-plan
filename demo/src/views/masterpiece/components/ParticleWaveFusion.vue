<template>
  <div ref="containerRef" class="particle-wave-container">
    <div class="particle-wave-title">粒子波浪融合</div>
    <canvas ref="canvasRef" class="particle-wave-canvas"></canvas>
    <div class="particle-wave-info">
      <span class="info-item">粒子数: {{ particles.length }}</span>
      <span class="info-item">融合度: {{ fusionLevel.toFixed(1) }}%</span>
    </div>
    <div class="particle-wave-controls">
      <button @click="toggleMode" class="mode-btn">{{ waveMode ? '切换波浪' : '切换融合' }}</button>
      <button @click="burstParticles" class="burst-btn">粒子爆发</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

const containerRef = ref<HTMLElement>()
const canvasRef = ref<HTMLCanvasElement>()
const fusionLevel = ref(50)
const waveMode = ref(true)

let ctx: CanvasRenderingContext2D | null = null
let animationId: number | null = null
let time = 0
let particles: Particle[] = []
let mouse = { x: 0, y: 0, active: false }

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  baseX: number
  baseY: number
  size: number
  color: { r: number, g: number, b: number, str: string }
  phase: number
  frequency: number
  amplitude: number
}

const initParticles = (width: number, height: number) => {
  particles = []
  const gridSize = 25
  const rows = Math.floor(height / gridSize)
  const cols = Math.floor(width / gridSize)

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * gridSize + gridSize / 2
      const y = row * gridSize + gridSize / 2

      particles.push({
        x,
        y,
        vx: 0,
        vy: 0,
        baseX: x,
        baseY: y,
        size: Math.random() * 3 + 2,
        color: getParticleColor(row, rows),
        phase: (row + col) * 0.2,
        frequency: 0.02 + Math.random() * 0.01,
        amplitude: 20 + Math.random() * 30
      })
    }
  }
}

const getParticleColor = (row: number, totalRows: number) => {
  const gradient = row / totalRows
  const r = Math.floor(100 + gradient * 155)
  const g = Math.floor(150 + (1 - gradient) * 105)
  const b = Math.floor(255 - gradient * 100)
  return { r, g, b, str: `rgb(${r}, ${g}, ${b})` }
}

const updateParticles = (deltaTime: number, width: number, height: number) => {
  time += deltaTime * 0.001
  fusionLevel.value = 50 + Math.sin(time * 0.5) * 40

  particles.forEach(p => {
    if (waveMode.value) {
      // 波浪模式 - 直接计算，不使用GSAP
      const waveY = Math.sin(p.baseX * p.frequency + time) * p.amplitude
      const waveX = Math.cos(p.baseY * p.frequency + time) * p.amplitude * 0.5
      p.x = p.baseX + waveX
      p.y = p.baseY + waveY
    } else {
      // 融合模式 - 螺旋运动
      const centerX = width / 2
      const centerY = height / 2
      const dx = p.baseX - centerX
      const dy = p.baseY - centerY
      const dist = Math.sqrt(dx * dx + dy * dy)
      const angle = Math.atan2(dy, dx)

      const spiralRadius = dist * (0.5 + Math.sin(time * 0.3) * 0.3)
      const spiralAngle = angle + time * 0.5 * (1 - dist / Math.max(width, height))

      p.x = centerX + Math.cos(spiralAngle) * spiralRadius
      p.y = centerY + Math.sin(spiralAngle) * spiralRadius
    }

    // 鼠标交互
    if (mouse.active) {
      const dx = mouse.x - p.x
      const dy = mouse.y - p.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      const maxDist = 150

      if (dist < maxDist) {
        const force = (maxDist - dist) / maxDist
        const angle = Math.atan2(dy, dx)
        p.vx -= Math.cos(angle) * force * 5
        p.vy -= Math.sin(angle) * force * 5
      }
    }

    // 阻尼
    p.vx *= 0.9
    p.vy *= 0.9

    // 应用速度
    p.x += p.vx
    p.y += p.vy

    // 相位更新
    p.phase += deltaTime * 0.002
  })
}

const drawParticles = (width: number, height: number) => {
  if (!ctx) return

  // 清空画布 - 渐变背景
  const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height) / 2)
  gradient.addColorStop(0, '#0a1628')
  gradient.addColorStop(0.5, '#050a14')
  gradient.addColorStop(1, '#000000')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  // 绘制连线
  ctx.lineWidth = 0.5
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const p1 = particles[i]
      const p2 = particles[j]
      const dx = p1.x - p2.x
      const dy = p1.y - p2.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < 80) {
        const alpha = (1 - dist / 80) * 0.3
        ctx.strokeStyle = `rgba(100, 150, 255, ${alpha})`
        ctx.beginPath()
        ctx.moveTo(p1.x, p1.y)
        ctx.lineTo(p2.x, p2.y)
        ctx.stroke()
      }
    }
  }

  // 绘制粒子
  particles.forEach(p => {
    const pulse = Math.sin(p.phase) * 0.5 + 0.5
    const size = p.size * (1 + pulse * 0.5)

    // 粒子发光
    const glowGradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 3)
    glowGradient.addColorStop(0, p.color.str)
    glowGradient.addColorStop(0.5, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0.5)`)
    glowGradient.addColorStop(1, 'transparent')

    ctx.beginPath()
    ctx.arc(p.x, p.y, size * 3, 0, Math.PI * 2)
    ctx.fillStyle = glowGradient
    ctx.fill()

    // 粒子核心
    const coreGradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size)
    coreGradient.addColorStop(0, '#ffffff')
    coreGradient.addColorStop(0.5, p.color.str)
    coreGradient.addColorStop(1, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0.3)`)

    ctx.beginPath()
    ctx.arc(p.x, p.y, size, 0, Math.PI * 2)
    ctx.fillStyle = coreGradient
    ctx.fill()
  })
}

const toggleMode = () => {
  waveMode.value = !waveMode.value

  // GSAP过渡动画
  particles.forEach((p, index) => {
    gsap.to(p, {
      size: waveMode.value ? Math.random() * 3 + 2 : Math.random() * 2 + 1,
      duration: 0.5,
      delay: index * 0.001,
      ease: 'power2.out'
    })
  })
}

const burstParticles = () => {
  const centerX = containerRef.value!.clientWidth / 2
  const centerY = containerRef.value!.clientHeight / 2

  particles.forEach((p, index) => {
    const dx = p.x - centerX
    const dy = p.y - centerY
    const dist = Math.sqrt(dx * dx + dy * dy)
    const angle = Math.atan2(dy, dx)

    gsap.to(p, {
      vx: Math.cos(angle) * 10,
      vy: Math.sin(angle) * 10,
      duration: 0.1,
      delay: index * 0.0005,
      ease: 'power2.out',
      onComplete: () => {
        gsap.to(p, {
          vx: 0,
          vy: 0,
          duration: 1,
          ease: 'power2.out'
        })
      }
    })
  })
}

const onMouseMove = (e: MouseEvent) => {
  if (!containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  mouse.x = e.clientX - rect.left
  mouse.y = e.clientY - rect.top
  mouse.active = true
}

const onMouseLeave = () => {
  mouse.active = false
}

let lastTime = 0
const animate = (timestamp: number) => {
  if (!canvasRef.value) return

  const width = canvasRef.value.width
  const height = canvasRef.value.height
  const deltaTime = timestamp - lastTime
  lastTime = timestamp

  updateParticles(deltaTime, width, height)
  drawParticles(width, height)

  animationId = requestAnimationFrame(animate)
}

const resize = () => {
  if (!canvasRef.value || !containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  canvasRef.value.width = rect.width
  canvasRef.value.height = rect.height
  initParticles(canvasRef.value.width, canvasRef.value.height)
}

onMounted(() => {
  if (canvasRef.value) {
    ctx = canvasRef.value.getContext('2d')
    resize()
    window.addEventListener('resize', resize)
    containerRef.value?.addEventListener('mousemove', onMouseMove)
    containerRef.value?.addEventListener('mouseleave', onMouseLeave)
    lastTime = performance.now()
    animationId = requestAnimationFrame(animate)
  }
})

const pauseAnimation = () => {
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
}

const resumeAnimation = () => {
  if (!animationId && canvasRef.value) {
    lastTime = performance.now()
    animationId = requestAnimationFrame(animate)
  }
}

onMounted(() => {
  if (canvasRef.value) {
    ctx = canvasRef.value.getContext('2d')
    resize()
    window.addEventListener('resize', resize)
    containerRef.value?.addEventListener('mousemove', onMouseMove)
    containerRef.value?.addEventListener('mouseleave', onMouseLeave)
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
  containerRef.value?.removeEventListener('mouseleave', onMouseLeave)
})

defineExpose({
  pauseAnimation,
  resumeAnimation
})
</script>

<style scoped lang="scss">
.particle-wave-container {
  position: relative;
  width: 100%;
  height: 600px;
  background: #000000;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 0 60px rgba(100, 150, 255, 0.3);
}

.particle-wave-canvas {
  width: 100%;
  height: 100%;
}

.particle-wave-title {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 2rem;
  font-weight: bold;
  background: linear-gradient(135deg, #66a6ff 0%, #9b59b6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 40px rgba(100, 150, 255, 0.5);
  z-index: 10;
  letter-spacing: 4px;
}

.particle-wave-info {
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
  color: #6699ff;
  text-shadow: 0 0 10px rgba(100, 150, 255, 0.6);
}

.particle-wave-controls {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 20px;
  z-index: 10;
}

.mode-btn,
.burst-btn {
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

.mode-btn {
  background: rgba(100, 150, 255, 0.2);
  color: #fff;
  border: 2px solid rgba(100, 150, 255, 0.3);

  &:hover {
    background: rgba(100, 150, 255, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(100, 150, 255, 0.3);
  }
}

.burst-btn {
  background: rgba(255, 100, 150, 0.8);
  color: #fff;

  &:hover {
    background: rgba(255, 100, 150, 1);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 100, 150, 0.5);
  }
}

// CSS3 动画效果
.particle-wave-container::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: conic-gradient(from 0deg, transparent, rgba(100, 150, 255, 0.05), transparent, rgba(150, 100, 255, 0.05), transparent);
  animation: rotate 30s linear infinite;
  pointer-events: none;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
