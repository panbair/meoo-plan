 <template>
  <div class="neon-pulse-container" ref="containerRef">
    <canvas class="neon-canvas" ref="canvasRef"></canvas>
    <div class="neon-overlay"></div>
    <div class="neon-core" ref="coreRef"></div>
    <div class="pulse-waves">
      <div v-for="i in 5" :key="i" class="wave" :class="'wave-' + i"></div>
    </div>
    <div class="neon-info">
      <h3 class="neon-title">霓虹脉冲</h3>
      <p class="neon-subtitle">电磁波频率共振</p>
      <div class="neon-stats">
        <div class="stat-item">
          <span class="stat-label">频率</span>
          <span class="stat-value">{{ frequency }} Hz</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">振幅</span>
          <span class="stat-value">{{ amplitude }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

interface Wave {
  offset: number
  speed: number
  amplitude: number
  frequency: number
  color: string
}

interface Props {
  size?: number
  waveCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 400,
  waveCount: 8
})

const containerRef = ref<HTMLElement>()
const canvasRef = ref<HTMLCanvasElement>()
const coreRef = ref<HTMLElement>()
const frequency = ref(440)
const amplitude = ref(80)
let ctx: gsap.Context
let animationId: number
let time = 0
let waves: Wave[] = []

const initWaves = () => {
  waves = []
  const colors = [
    '#ff00ff', '#00ffff', '#ff6b6b', '#4ecdc4',
    '#ffe66d', '#95e1d3', '#f38181', '#aa96da'
  ]

  for (let i = 0; i < props.waveCount; i++) {
    waves.push({
      offset: Math.random() * Math.PI * 2,
      speed: 0.02 + Math.random() * 0.03,
      amplitude: 30 + Math.random() * 50,
      frequency: 0.02 + Math.random() * 0.02,
      color: colors[i % colors.length]
    })
  }
}

const animateNeon = () => {
  const canvas = canvasRef.value!
  canvas.width = props.size
  canvas.height = props.size
  const context = canvas.getContext('2d')!
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2

  const animate = () => {
    time += 0.016

    // 清除画布
    context.fillStyle = 'rgba(10, 10, 30, 0.1)'
    context.fillRect(0, 0, canvas.width, canvas.height)

    // 更新统计数据
    frequency.value = Math.floor(440 + Math.sin(time) * 220)
    amplitude.value = Math.floor(80 + Math.sin(time * 2) * 20)

    // 绘制波纹
    waves.forEach((wave, index) => {
      context.beginPath()
      context.strokeStyle = wave.color
      context.lineWidth = 3
      context.shadowBlur = 20
      context.shadowColor = wave.color

      const radius = 50 + index * 30

      for (let angle = 0; angle < Math.PI * 2; angle += 0.01) {
        const waveOffset = Math.sin(angle * 8 + time * wave.speed * 100 + wave.offset) *
                           wave.amplitude * Math.sin(time * 0.5)
        const x = centerX + Math.cos(angle) * (radius + waveOffset)
        const y = centerY + Math.sin(angle) * (radius + waveOffset)

        if (angle === 0) {
          context.moveTo(x, y)
        } else {
          context.lineTo(x, y)
        }
      }

      context.closePath()
      context.globalAlpha = 0.6 - index * 0.05
      context.stroke()
      context.globalAlpha = 1
    })

    // 绘制霓虹光束
    const beamCount = 12
    for (let i = 0; i < beamCount; i++) {
      const angle = (i / beamCount) * Math.PI * 2 + time * 0.5
      const length = 150 + Math.sin(time * 2 + i) * 50

      const gradient = context.createLinearGradient(
        centerX, centerY,
        centerX + Math.cos(angle) * length,
        centerY + Math.sin(angle) * length
      )

      const hue = (time * 50 + i * 30) % 360
      gradient.addColorStop(0, `hsla(${hue}, 100%, 70%, 0.8)`)
      gradient.addColorStop(0.5, `hsla(${hue + 30}, 100%, 60%, 0.4)`)
      gradient.addColorStop(1, 'transparent')

      context.beginPath()
      context.moveTo(centerX, centerY)
      context.lineTo(
        centerX + Math.cos(angle) * length,
        centerY + Math.sin(angle) * length
      )
      context.strokeStyle = gradient
      context.lineWidth = 2
      context.stroke()
    }

    // 绘制粒子
    const particleCount = 50
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2 + time * 0.3
      const radius = 100 + Math.sin(time * 3 + i * 0.5) * 80

      const x = centerX + Math.cos(angle) * radius
      const y = centerY + Math.sin(angle) * radius

      const hue = (time * 60 + i * 20) % 360

      context.beginPath()
      context.arc(x, y, 2 + Math.sin(time * 2 + i) * 1, 0, Math.PI * 2)
      context.fillStyle = `hsla(${hue}, 100%, 70%, 0.8)`
      context.shadowBlur = 15
      context.shadowColor = `hsla(${hue}, 100%, 70%, 1)`
      context.fill()
    }

    context.shadowBlur = 0

    animationId = requestAnimationFrame(animate)
  }

  animate()
}

onMounted(() => {
  ctx = gsap.context(() => {
    initWaves()
    animateNeon()

    // 核心脉动
    gsap.to(coreRef.value, {
      scale: [1, 1.3, 1],
      boxShadow: '0 0 50px rgba(255, 0, 255, 0.8)',
      duration: 1,
      repeat: -1,
      ease: 'sine.inOut'
    })

    // 波纹动画
    gsap.to('.wave', (index) => ({
      scale: [1, 2, 1],
      opacity: [0.8, 0, 0.8],
      duration: 2 + index * 0.3,
      repeat: -1,
      delay: index * 0.2,
      ease: 'sine.inOut'
    }))

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

      // 影响波纹
      waves.forEach(wave => {
        wave.amplitude = 30 + Math.abs(x) + Math.abs(y) * 2
      })
    })

    containerRef.value?.addEventListener('mouseleave', () => {
      gsap.to(canvasRef.value, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.5,
        ease: 'power2.out'
      })

      // 恢复波纹
      waves.forEach(wave => {
        wave.amplitude = 30 + Math.random() * 50
      })
    })

    // 点击触发爆发
    containerRef.value?.addEventListener('click', () => {
      gsap.to(coreRef.value, {
        scale: 2,
        duration: 0.1,
        ease: 'power2.out',
        onComplete: () => {
          gsap.to(coreRef.value, {
            scale: 1,
            duration: 0.8,
            ease: 'elastic.out(1, 0.3)'
          })
        }
      })

      // 加速波纹
      waves.forEach(wave => {
        wave.speed *= 3
      })

      setTimeout(() => {
        waves.forEach(wave => {
          wave.speed /= 3
        })
      }, 1000)
    })
  }, containerRef.value)
})

onUnmounted(() => {
  ctx?.revert()
  if (animationId) cancelAnimationFrame(animationId)
})
</script>

<style scoped lang="scss">
.neon-pulse-container {
  position: relative;
  width: 400px;
  height: 400px;
  border-radius: 20px;
  overflow: hidden;
  background: radial-gradient(circle at center, #0a0a2a, #000010);
  perspective: 1000px;
  cursor: pointer;
}

.neon-canvas {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.neon-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, transparent 30%, rgba(0, 0, 0, 0.5));
  pointer-events: none;
  z-index: 2;
}

.neon-core {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 40px;
  height: 40px;
  background: radial-gradient(circle, #ffffff, #ff00ff, #00ffff);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  box-shadow: 0 0 30px rgba(255, 0, 255, 0.8);
  animation: corePulse 1s infinite;
}

@keyframes corePulse {
  0%, 100% {
    box-shadow: 0 0 30px 15px rgba(255, 0, 255, 0.5);
  }
  50% {
    box-shadow: 0 0 50px 25px rgba(0, 255, 255, 0.7);
  }
}

.pulse-waves {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 5;
}

.wave {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px;
  height: 200px;
  border: 2px solid rgba(255, 0, 255, 0.5);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: waveExpand 3s infinite;
}

@keyframes waveExpand {
  0% {
    transform: translate(-50%, -50%) scale(0.5);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(2);
    opacity: 0;
  }
}

.wave-2 { animation-delay: 0.6s; }
.wave-3 { animation-delay: 1.2s; }
.wave-4 { animation-delay: 1.8s; }
.wave-5 { animation-delay: 2.4s; }

.neon-info {
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  z-index: 20;
  pointer-events: none;
}

.neon-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 4px;
  text-shadow: 0 0 10px rgba(255, 0, 255, 0.5);
}

.neon-subtitle {
  font-size: 0.75rem;
  color: #94a3b8;
  margin-bottom: 10px;
}

.neon-stats {
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
  color: #ff00ff;
  font-family: 'Courier New', monospace;
  text-shadow: 0 0 5px rgba(255, 0, 255, 0.5);
}

@media (max-width: 768px) {
  .neon-pulse-container {
    width: 300px;
    height: 300px;
  }

  .neon-core {
    width: 30px;
    height: 30px;
  }

  .wave {
    width: 150px;
    height: 150px;
  }

  .neon-stats {
    flex-direction: column;
    gap: 5px;
  }
}
</style>
