<template>
  <div class="sound-wave-container" ref="containerRef">
    <canvas class="wave-canvas" ref="canvasRef"></canvas>
    <div class="wave-overlay"></div>
    <div class="wave-center">
      <div class="wave-core"></div>
      <div class="wave-ripple" v-for="i in 3" :key="i" :class="'ripple-' + i"></div>
    </div>
    <div class="sound-info">
      <h3 class="sound-title">声波可视化</h3>
      <p class="sound-subtitle">频率与振幅分析</p>
      <div class="sound-stats">
        <div class="stat-item">
          <span class="stat-label">频率</span>
          <span class="stat-value">{{ frequency.toFixed(2) }} Hz</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">振幅</span>
          <span class="stat-value">{{ amplitude.toFixed(3) }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">波长</span>
          <span class="stat-value">{{ wavelength.toFixed(1) }} m</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

interface WavePoint {
  x: number
  y: number
  amplitude: number
  phase: number
  frequency: number
}

interface Props {
  size?: number
  waveCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 400,
  waveCount: 4 // 减少到4条波
})

const containerRef = ref<HTMLElement>()
const canvasRef = ref<HTMLCanvasElement>()
const frequency = ref(440)
const amplitude = ref(0.5)
const wavelength = ref(0.78)
let ctx: gsap.Context
let animationId: number
let time = 0
let waves: WavePoint[] = []
let audioContext: AudioContext | null = null
let analyser: AnalyserNode | null = null

const initWaves = () => {
  const canvas = canvasRef.value!
  canvas.width = props.size
  canvas.height = props.size

  waves = []
  const waveColors = [
    '#ff006e', '#8338ec', '#3a86ff', '#06ffa5', '#ffbe0b'
  ]

  for (let i = 0; i < props.waveCount; i++) {
    waves.push({
      x: 0,
      y: 0,
      amplitude: 30 + Math.random() * 40,
      phase: Math.random() * Math.PI * 2,
      frequency: 0.02 + Math.random() * 0.03
    })
  }
}

const animateWaves = () => {
  const canvas = canvasRef.value!
  const context = canvas.getContext('2d')!
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2

  const animate = () => {
    time += 0.016

    // 更新统计数据
    frequency.value = 440 + Math.sin(time) * 220
    amplitude.value = 0.5 + Math.sin(time * 2) * 0.3
    wavelength.value = 343 / frequency.value

    // 清除画布
    context.fillStyle = 'rgba(0, 0, 10, 0.08)'
    context.fillRect(0, 0, canvas.width, canvas.height)

    // 绘制背景网格
    drawGrid(context, canvas.width, canvas.height)

    // 绘制声波
    const waveColors = ['#ff006e', '#8338ec', '#3a86ff', '#06ffa5', '#ffbe0b']

    waves.forEach((wave, index) => {
      const color = waveColors[index % waveColors.length]

      // 绘制正弦波
      context.beginPath()
      context.strokeStyle = color
      context.lineWidth = 3
      context.shadowBlur = 15
      context.shadowColor = color

      for (let x = 0; x < canvas.width; x += 2) {
        const y = centerY +
          Math.sin((x * wave.frequency) + time * 2 + wave.phase) *
          wave.amplitude *
          (1 + Math.sin(time * 0.5 + index) * 0.3)

        if (x === 0) {
          context.moveTo(x, y)
        } else {
          context.lineTo(x, y)
        }
      }

      context.globalAlpha = 0.8 - index * 0.1
      context.stroke()
      context.globalAlpha = 1
      context.shadowBlur = 0

      // 绘制镜像波
      context.beginPath()
      context.strokeStyle = color
      context.lineWidth = 2
      context.globalAlpha = 0.3

      for (let x = 0; x < canvas.width; x += 2) {
        const y = centerY +
          Math.sin((x * wave.frequency) + time * 2 + wave.phase + Math.PI) *
          wave.amplitude * 0.5

        if (x === 0) {
          context.moveTo(x, y)
        } else {
          context.lineTo(x, y)
        }
      }

      context.stroke()
      context.globalAlpha = 1
    })

    // 绘制粒子
    const particleCount = 100
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2
      const radius = 100 + Math.sin(time * 3 + i * 0.1) * 50

      const x = centerX + Math.cos(angle) * radius
      const y = centerY + Math.sin(angle) * radius

      const hue = (time * 50 + i * 10) % 360

      context.beginPath()
      context.arc(x, y, 2 + Math.sin(time * 2 + i) * 1, 0, Math.PI * 2)
      context.fillStyle = `hsla(${hue}, 80%, 60%, 0.8)`
      context.shadowBlur = 10
      context.shadowColor = `hsla(${hue}, 80%, 60%, 1)`
      context.fill()
      context.shadowBlur = 0
    }

    // 绘制频谱
    drawFrequencyBars(context, centerX, centerY)

    animationId = requestAnimationFrame(animate)
  }

  animate()
}

const drawGrid = (context: CanvasRenderingContext2D, width: number, height: number) => {
  context.strokeStyle = 'rgba(255, 255, 255, 0.03)'
  context.lineWidth = 1

  const gridSize = 50

  for (let x = 0; x < width; x += gridSize) {
    context.beginPath()
    context.moveTo(x, 0)
    context.lineTo(x, height)
    context.stroke()
  }

  for (let y = 0; y < height; y += gridSize) {
    context.beginPath()
    context.moveTo(0, y)
    context.lineTo(width, y)
    context.stroke()
  }
}

const drawFrequencyBars = (
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number
) => {
  const barCount = 32
  const radius = 150

  for (let i = 0; i < barCount; i++) {
    const angle = (i / barCount) * Math.PI * 2
    const barHeight = 20 + Math.sin(time * 5 + i * 0.5) * 30

    const x1 = centerX + Math.cos(angle) * radius
    const y1 = centerY + Math.sin(angle) * radius
    const x2 = centerX + Math.cos(angle) * (radius + barHeight)
    const y2 = centerY + Math.sin(angle) * (radius + barHeight)

    const hue = (time * 30 + i * 10) % 360

    context.beginPath()
    context.moveTo(x1, y1)
    context.lineTo(x2, y2)
    context.strokeStyle = `hsla(${hue}, 80%, 60%, 0.8)`
    context.lineWidth = 4
    context.lineCap = 'round'
    context.stroke()
  }
}

onMounted(() => {
  ctx = gsap.context(() => {
    initWaves()
    animateWaves()

    // 波纹动画
    gsap.to('.wave-ripple', (index) => ({
      scale: [1, 3, 1],
      opacity: [0.8, 0, 0.8],
      duration: 2 + index * 0.5,
      repeat: -1,
      delay: index * 0.4,
      ease: 'sine.inOut'
    }))

    // 核心脉动
    gsap.to('.wave-core', {
      scale: [1, 1.5, 1],
      duration: 1,
      repeat: -1,
      ease: 'sine.inOut'
    })

    // 鼠标交互
    containerRef.value?.addEventListener('mousemove', (e) => {
      const rect = containerRef.value!.getBoundingClientRect()
      const x = (e.clientX - rect.left - rect.width / 2) / 20
      const y = (e.clientY - rect.top - rect.height / 2) / 20

      gsap.to(canvasRef.value, {
        rotateY: x,
        rotateX: -y,
        duration: 0.3,
        ease: 'power2.out'
      })

      // 影响波形
      waves.forEach(wave => {
        wave.amplitude = 30 + Math.abs(x) * 20 + Math.abs(y) * 20
      })
    })

    containerRef.value?.addEventListener('mouseleave', () => {
      gsap.to(canvasRef.value, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.5,
        ease: 'power2.out'
      })

      waves.forEach(wave => {
        wave.amplitude = 30 + Math.random() * 40
      })
    })

    // 点击触发共振
    containerRef.value?.addEventListener('click', () => {
      gsap.to('.wave-core', {
        scale: 2,
        duration: 0.1,
        ease: 'power2.out',
        onComplete: () => {
          gsap.to('.wave-core', {
            scale: 1,
            duration: 0.8,
            ease: 'elastic.out(1, 0.3)'
          })
        }
      })

      waves.forEach(wave => {
        wave.amplitude *= 2
      })

      setTimeout(() => {
        waves.forEach(wave => {
          wave.amplitude /= 2
        })
      }, 500)
    })
  }, containerRef.value)
})

onUnmounted(() => {
  ctx?.revert()
  if (animationId) cancelAnimationFrame(animationId)
  if (audioContext) {
    audioContext.close()
  }
})
</script>

<style scoped lang="scss">
.sound-wave-container {
  position: relative;
  width: 500px;
  height: 500px;
  border-radius: 20px;
  overflow: hidden;
  background: radial-gradient(circle at center, #0a0a2a, #000010);
  perspective: 1000px;
  cursor: pointer;
}

.wave-canvas {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.wave-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, transparent 40%, rgba(0, 0, 0, 0.4));
  pointer-events: none;
  z-index: 2;
}

.wave-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 3;
}

.wave-core {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 30px;
  height: 30px;
  background: radial-gradient(circle, #ffffff, #8338ec, #3a86ff);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 30px rgba(131, 56, 236, 0.8);
}

.wave-ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 60px;
  height: 60px;
  border: 2px solid rgba(131, 56, 236, 0.5);
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.sound-info {
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  z-index: 10;
  pointer-events: none;
}

.sound-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 4px;
  text-shadow: 0 0 20px rgba(131, 56, 236, 0.5);
}

.sound-subtitle {
  font-size: 0.75rem;
  color: #94a3b8;
  margin-bottom: 10px;
}

.sound-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
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
  .sound-wave-container {
    width: 350px;
    height: 350px;
  }

  .sound-stats {
    grid-template-columns: 1fr;
    gap: 5px;
  }
}
</style>
