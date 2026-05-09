<template>
  <div class="quantum-portal" ref="portalRef">
    <div class="portal-container">
      <!-- 核心能量环 -->
      <div class="energy-ring ring-1" ref="ring1Ref"></div>
      <div class="energy-ring ring-2" ref="ring2Ref"></div>
      <div class="energy-ring ring-3" ref="ring3Ref"></div>

      <!-- 粒子场 -->
      <canvas class="particle-canvas" ref="canvasRef"></canvas>

      <!-- 中心核心 -->
      <div class="portal-core" ref="coreRef">
        <div class="core-glow"></div>
        <div class="core-pulse"></div>
      </div>

      <!-- 光束 -->
      <div class="light-beam beam-1"></div>
      <div class="light-beam beam-2"></div>
      <div class="light-beam beam-3"></div>

      <!-- 轨道粒子 -->
      <div class="orbit-particles">
        <div
          v-for="i in 8"
          :key="i"
          class="orbit-particle"
          :style="{ '--angle': i * 45 }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

interface Props {
  size?: number
  colors?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  size: 400,
  colors: () => ['#8b5cf6', '#3b82f6', '#ec4899', '#06b6d4']
})

const portalRef = ref<HTMLElement>()
const coreRef = ref<HTMLElement>()
const ring1Ref = ref<HTMLElement>()
const ring2Ref = ref<HTMLElement>()
const ring3Ref = ref<HTMLElement>()
const canvasRef = ref<HTMLCanvasElement>()
let ctx: gsap.Context
let animationId: number
let particles: any[] = []

// 粒子动画
const initParticles = () => {
  const canvas = canvasRef.value!
  const context = canvas.getContext('2d')!
  canvas.width = props.size
  canvas.height = props.size

  for (let i = 0; i < 100; i++) {
    particles.push({
      x: props.size / 2,
      y: props.size / 2,
      angle: Math.random() * Math.PI * 2,
      radius: Math.random() * 150 + 50,
      speed: Math.random() * 0.02 + 0.01,
      size: Math.random() * 3 + 1,
      color: props.colors[Math.floor(Math.random() * props.colors.length)],
      alpha: Math.random()
    })
  }

  const animateParticles = () => {
    context.clearRect(0, 0, canvas.width, canvas.height)

    particles.forEach(p => {
      p.angle += p.speed
      p.x = canvas.width / 2 + Math.cos(p.angle) * p.radius
      p.y = canvas.height / 2 + Math.sin(p.angle) * p.radius
      p.alpha = 0.5 + Math.sin(p.angle * 3) * 0.3

      context.beginPath()
      context.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      context.fillStyle = p.color
      context.globalAlpha = p.alpha
      context.fill()
      context.globalAlpha = 1
    })

    animationId = requestAnimationFrame(animateParticles)
  }

  animateParticles()
}

onMounted(() => {
  ctx = gsap.context(() => {
    // 能量环旋转动画
    const rings = [ring1Ref.value, ring2Ref.value, ring3Ref.value]
    rings.forEach((ring, index) => {
      if (!ring) return

      gsap.to(ring, {
        rotate: 360,
        duration: 4 + index * 2,
        repeat: -1,
        ease: 'none',
        rotationOrigin: '50% 50%'
      })

      gsap.to(ring, {
        scale: [1, 1.2, 1],
        opacity: [0.5, 1, 0.5],
        duration: 2 + index * 0.5,
        repeat: -1,
        delay: index * 0.3
      })
    })

    // 核心脉动
    gsap.to(coreRef.value, {
      scale: [1, 1.3, 1],
      boxShadow: '0 0 50px rgba(139, 92, 246, 0.8)',
      duration: 1.5,
      repeat: -1,
      ease: 'sine.inOut'
    })

    // 光束动画 - 使用gsap.utils.toArray自动清理
    gsap.utils.toArray('.light-beam').forEach((beam: Element, index: number) => {
      gsap.to(beam, {
        rotate: 360,
        duration: 8,
        repeat: -1,
        ease: 'none',
        delay: index * 2
      })
    })

    // 轨道粒子
    gsap.to('.orbit-particle', {
      rotate: -360,
      duration: 10,
      repeat: -1,
      ease: 'none'
    })

    // 粒子场初始化
    initParticles()

    // 鼠标交互
    portalRef.value?.addEventListener('mousemove', (e) => {
      const rect = portalRef.value!.getBoundingClientRect()
      const x = (e.clientX - rect.left - rect.width / 2) / 20
      const y = (e.clientY - rect.top - rect.height / 2) / 20

      gsap.to(portalRef.value.querySelector('.portal-container'), {
        rotateY: x,
        rotateX: -y,
        duration: 0.5,
        ease: 'power2.out'
      })
    })

    portalRef.value?.addEventListener('mouseleave', () => {
      gsap.to(portalRef.value.querySelector('.portal-container'), {
        rotateY: 0,
        rotateX: 0,
        duration: 0.5,
        ease: 'power2.out'
      })
    })

    // 点击核心爆发效果
    coreRef.value?.addEventListener('click', () => {
      gsap.to(coreRef.value, {
        scale: 2,
        duration: 0.2,
        ease: 'power2.out',
        onComplete: () => {
          gsap.to(coreRef.value, {
            scale: 1,
            duration: 0.5,
            ease: 'elastic.out(1, 0.3)'
          })
        }
      })

      rings.forEach(ring => {
        gsap.to(ring, {
          scale: 1.5,
          duration: 0.2,
          onComplete: () => {
            gsap.to(ring, {
              scale: 1,
              duration: 0.5,
              ease: 'elastic.out(1, 0.3)'
            })
          }
        })
      })
    })
  }, portalRef.value)
})

onUnmounted(() => {
  ctx?.revert()
  if (animationId) cancelAnimationFrame(animationId)
})
</script>

<style scoped lang="scss">
.quantum-portal {
  position: relative;
  width: 400px;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1000px;
  cursor: pointer;
}

.portal-container {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
}

.energy-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  border: 3px solid transparent;
  box-shadow: 0 0 20px currentColor, inset 0 0 20px currentColor;
}

.ring-1 {
  width: 200px;
  height: 200px;
  border-color: #8b5cf6;
}

.ring-2 {
  width: 280px;
  height: 280px;
  border-color: #3b82f6;
}

.ring-3 {
  width: 360px;
  height: 360px;
  border-color: #ec4899;
}

.particle-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.portal-core {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(139, 92, 246, 0.8), rgba(59, 130, 246, 0.4));
  box-shadow: 0 0 30px rgba(139, 92, 246, 0.6);
  z-index: 10;
}

.core-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.5), transparent);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: corePulse 2s infinite;
}

@keyframes corePulse {
  0%, 100% { opacity: 0.5; scale: 1; }
  50% { opacity: 1; scale: 1.2; }
}

.light-beam {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 2px;
  height: 180px;
  background: linear-gradient(to top, transparent, currentColor, transparent);
  transform-origin: bottom center;
  opacity: 0.6;
}

.beam-1 {
  color: #8b5cf6;
  transform: translate(-50%, -100%) rotate(0deg);
}

.beam-2 {
  color: #3b82f6;
  transform: translate(-50%, -100%) rotate(120deg);
}

.beam-3 {
  color: #ec4899;
  transform: translate(-50%, -100%) rotate(240deg);
}

.orbit-particles {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 300px;
  height: 300px;
  transform: translate(-50%, -50%);
}

.orbit-particle {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  background: radial-gradient(circle, white, #8b5cf6);
  border-radius: 50%;
  box-shadow: 0 0 10px #8b5cf6;
  transform: rotate(var(--angle)) translateX(150px);
}

@media (max-width: 768px) {
  .quantum-portal {
    width: 300px;
    height: 300px;
  }

  .ring-1 { width: 150px; height: 150px; }
  .ring-2 { width: 210px; height: 210px; }
  .ring-3 { width: 270px; height: 270px; }
  .portal-core { width: 45px; height: 45px; }
  .light-beam { height: 135px; }
  .orbit-particles { width: 225px; height: 225px; }
  .orbit-particle { transform: rotate(var(--angle)) translateX(112.5px); }
}
</style>
