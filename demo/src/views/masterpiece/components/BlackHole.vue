<template>
  <div class="black-hole-container" ref="containerRef">
    <canvas class="black-hole-canvas" ref="canvasRef"></canvas>
    <div class="event-horizon"></div>
    <div class="singularity" ref="singularityRef"></div>
    <div class="accretion-disk" ref="accretionRef"></div>
    <div class="black-hole-info">
      <h3 class="black-hole-title">黑洞视界</h3>
      <p class="black-hole-subtitle">事件视界引力奇点</p>
      <div class="black-hole-stats">
        <div class="stat-item">
          <span class="stat-label">史瓦西半径</span>
          <span class="stat-value">{{ schwarzschildRadius }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">吸积盘温度</span>
          <span class="stat-value">{{ temperature }} K</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

interface Particle {
  angle: number
  radius: number
  speed: number
  size: number
  color: string
  alpha: number
  hue: number
}

interface Props {
  size?: number
  particleCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 350,
  particleCount: 200 // 减少到200
})

const containerRef = ref<HTMLElement>()
const canvasRef = ref<HTMLCanvasElement>()
const singularityRef = ref<HTMLElement>()
const accretionRef = ref<HTMLElement>()
const schwarzschildRadius = ref('2.95 km')
const temperature = ref(1000000)
let ctx: gsap.Context
let animationId: number
let particles: Particle[] = []
let mouseX = 0
let mouseY = 0

const initParticles = () => {
  const canvas = canvasRef.value!
  canvas.width = props.size
  canvas.height = props.size

  particles = []
  for (let i = 0; i < props.particleCount; i++) {
    particles.push({
      angle: Math.random() * Math.PI * 2,
      radius: 80 + Math.random() * 150,
      speed: 0.005 + Math.random() * 0.01,
      size: 1 + Math.random() * 2,
      color: '#ffffff',
      alpha: 0.3 + Math.random() * 0.7,
      hue: Math.random() * 60 + 20
    })
  }

  animateBlackHole()
}

const animateBlackHole = () => {
  const canvas = canvasRef.value!
  const context = canvas.getContext('2d')!
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2

  const animate = () => {
    // 清除画布 - 使用拖影效果
    context.fillStyle = 'rgba(0, 0, 0, 0.15)'
    context.fillRect(0, 0, canvas.width, canvas.height)

    // 更新温度显示
    temperature.value = Math.floor(1000000 + Math.sin(Date.now() * 0.001) * 200000)

    // 绘制粒子
    particles.forEach(particle => {
      // 更新角度 - 越靠近中心越快
      const speedMultiplier = 200 / particle.radius
      particle.angle += particle.speed * speedMultiplier

      // 计算位置
      const x = centerX + Math.cos(particle.angle) * particle.radius
      const y = centerY + Math.sin(particle.angle) * particle.radius * 0.6

      // 计算透视缩放
      const zScale = Math.sin(particle.angle) * 0.3 + 1

      // 根据半径计算颜色
      const colorIntensity = Math.max(0, 1 - (particle.radius - 80) / 150)
      const r = Math.floor(255 * colorIntensity + 50)
      const g = Math.floor(150 * colorIntensity + 50)
      const b = Math.floor(100 * colorIntensity + 100)

      // 绘制粒子
      context.beginPath()
      context.arc(x, y, particle.size * zScale, 0, Math.PI * 2)
      context.fillStyle = `rgba(${r}, ${g}, ${b}, ${particle.alpha * zScale})`
      context.fill()

      // 绘制拖尾
      if (Math.random() > 0.9) {
        const trailLength = 20 + particle.radius * 0.2
        const tailAngle = particle.angle - 0.1
        const tailX = centerX + Math.cos(tailAngle) * particle.radius
        const tailY = centerY + Math.sin(tailAngle) * particle.radius * 0.6

        const gradient = context.createLinearGradient(x, y, tailX, tailY)
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${particle.alpha * 0.5})`)
        gradient.addColorStop(1, 'transparent')

        context.beginPath()
        context.moveTo(x, y)
        context.lineTo(tailX, tailY)
        context.strokeStyle = gradient
        context.lineWidth = particle.size * 0.5
        context.stroke()
      }

      // 慢慢吸入黑洞
      if (particle.radius > 50) {
        particle.radius -= 0.1
      } else {
        // 重置到外部
        particle.radius = 200 + Math.random() * 50
        particle.alpha = 0
      }

      // 渐变alpha
      if (particle.alpha < 0.5 + Math.random() * 0.5) {
        particle.alpha += 0.01
      }
    })

    // 绘制引力透镜效果
    const lensGradient = context.createRadialGradient(
      centerX, centerY, 30,
      centerX, centerY, 150
    )
    lensGradient.addColorStop(0, 'rgba(0, 0, 0, 1)')
    lensGradient.addColorStop(0.3, 'rgba(0, 0, 0, 0.8)')
    lensGradient.addColorStop(0.6, 'rgba(50, 50, 100, 0.3)')
    lensGradient.addColorStop(1, 'transparent')

    context.beginPath()
    context.arc(centerX, centerY, 150, 0, Math.PI * 2)
    context.fillStyle = lensGradient
    context.fill()

    animationId = requestAnimationFrame(animate)
  }

  animate()
}

onMounted(() => {
  ctx = gsap.context(() => {
    initParticles()

    // 奇点脉动
    gsap.to(singularityRef.value, {
      scale: [1, 1.1, 1],
      duration: 2,
      repeat: -1,
      ease: 'sine.inOut'
    })

    // 吸积盘旋转
    gsap.to(accretionRef.value, {
      rotate: 360,
      duration: 20,
      repeat: -1,
      ease: 'none'
    })

    // 鼠标交互 - 改变视角
    containerRef.value?.addEventListener('mousemove', (e) => {
      const rect = containerRef.value!.getBoundingClientRect()
      mouseX = (e.clientX - rect.left - rect.width / 2) / 10
      mouseY = (e.clientY - rect.top - rect.height / 2) / 10

      gsap.to(canvasRef.value, {
        rotateY: mouseX,
        rotateX: -mouseY,
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

    // 点击触发引力爆发
    containerRef.value?.addEventListener('click', () => {
      particles.forEach(particle => {
        particle.radius += 20
        particle.speed *= 2
      })

      gsap.to(singularityRef.value, {
        scale: 1.5,
        duration: 0.2,
        ease: 'power2.out',
        onComplete: () => {
          gsap.to(singularityRef.value, {
            scale: 1,
            duration: 0.8,
            ease: 'elastic.out(1, 0.3)'
          })
        }
      })

      // 粒子加速动画
      setTimeout(() => {
        particles.forEach(particle => {
          particle.speed *= 0.5
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
.black-hole-container {
  position: relative;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  overflow: hidden;
  background: radial-gradient(circle, #000010, #000000);
  perspective: 1000px;
  cursor: pointer;
}

.black-hole-canvas {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.event-horizon {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 60px;
  height: 60px;
  background: radial-gradient(circle, #000000, #000008);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 30px 10px rgba(100, 100, 255, 0.3);
  z-index: 10;
}

.singularity {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 30px;
  height: 30px;
  background: radial-gradient(circle, #ffffff, #a78bfa, #000000);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  z-index: 15;
  animation: singularityPulse 1s infinite;
}

@keyframes singularityPulse {
  0%, 100% {
    box-shadow: 0 0 20px 5px rgba(167, 139, 250, 0.5);
  }
  50% {
    box-shadow: 0 0 40px 10px rgba(167, 139, 250, 0.8);
  }
}

.accretion-disk {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 300px;
  height: 300px;
  background: conic-gradient(from 0deg,
    transparent 0%,
    rgba(255, 150, 50, 0.2) 10%,
    rgba(255, 200, 100, 0.3) 20%,
    transparent 30%,
    rgba(255, 150, 50, 0.2) 40%,
    rgba(255, 200, 100, 0.3) 50%,
    transparent 60%,
    rgba(255, 150, 50, 0.2) 70%,
    rgba(255, 200, 100, 0.3) 80%,
    transparent 100%
  );
  border-radius: 50%;
  transform: translate(-50%, -50%) rotateX(70deg);
  z-index: 5;
  opacity: 0.6;
  pointer-events: none;
}

.black-hole-info {
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  z-index: 20;
  pointer-events: none;
}

.black-hole-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 4px;
  text-shadow: 0 0 10px rgba(167, 139, 250, 0.5);
}

.black-hole-subtitle {
  font-size: 0.75rem;
  color: #94a3b8;
  margin-bottom: 10px;
}

.black-hole-stats {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.stat-label {
  font-size: 0.7rem;
  color: #64748b;
}

.stat-value {
  font-size: 0.75rem;
  font-weight: 600;
  color: #a78bfa;
  font-family: 'Courier New', monospace;
}

@media (max-width: 768px) {
  .black-hole-container {
    width: 300px;
    height: 300px;
  }

  .event-horizon {
    width: 45px;
    height: 45px;
  }

  .singularity {
    width: 22px;
    height: 22px;
  }

  .accretion-disk {
    width: 225px;
    height: 225px;
  }
}
</style>
