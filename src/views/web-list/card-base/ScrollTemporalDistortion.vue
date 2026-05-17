<template>
  <div class="temporal-distortion-163">
    <div class="vortex-container-163">
      <canvas ref="vortexCanvas" class="vortex-canvas-163"></canvas>
    </div>
    <div class="cards-container-163">
      <div
        v-for="(card, index) in cards"
        :key="index"
        :class="['temporal-card-163', `card-${index}`]"
        :style="{ '--card-index': index }"
      >
        <div class="card-inner-163">
          <div class="card-content-163">
            <h3>{{ card.title }}</h3>
            <p>{{ card.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const vortexCanvas = ref<HTMLCanvasElement>()
let ctx: CanvasRenderingContext2D | null = null
let animationFrameId: number | null = null
let time = 0
let mouseX = 0
let mouseY = 0

const cards = [
  { title: '时间漩涡', description: '扭曲时空的奥秘' },
  { title: '时空折叠', description: '跨越维度的旅程' },
  { title: '量子纠缠', description: '超越距离的联系' },
  { title: '时间回响', description: '历史的重现' },
  { title: '维度跳跃', description: '现实的裂缝' }
]

const initCanvas = () => {
  if (!vortexCanvas.value) return

  const canvas = vortexCanvas.value
  ctx = canvas.getContext('2d')

  const resizeCanvas = () => {
    const container = canvas.parentElement
    if (container) {
      canvas.width = container.offsetWidth
      canvas.height = container.offsetHeight
    }
  }

  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
  canvas.addEventListener('mousemove', handleMouseMove)
}

const handleMouseMove = (e: MouseEvent) => {
  if (!vortexCanvas.value) return
  const rect = vortexCanvas.value.getBoundingClientRect()
  mouseX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2)
  mouseY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2)
}

const drawVortex = () => {
  if (!ctx || !vortexCanvas.value) return

  const canvas = vortexCanvas.value
  const width = canvas.width
  const height = canvas.height

  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
  ctx.fillRect(0, 0, width, height)

  const centerX = width / 2 + mouseX * 50
  const centerY = height / 2 + mouseY * 50

  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2 + time * 0.001
    const radius = 50 + Math.sin(time * 0.002 + i) * 20

    const x = centerX + Math.cos(angle) * radius
    const y = centerY + Math.sin(angle) * radius

    ctx.beginPath()
    ctx.arc(x, y, 3 + Math.sin(time * 0.003 + i) * 2, 0, Math.PI * 2)
    ctx.fillStyle = `hsla(${(time * 0.1 + i * 30) % 360}, 80%, 60%, 0.8)`
    ctx.fill()

    for (let j = 0; j < 3; j++) {
      const trailAngle = angle - (j + 1) * 0.3
      const trailRadius = radius + j * 20
      const trailX = centerX + Math.cos(trailAngle) * trailRadius
      const trailY = centerY + Math.sin(trailAngle) * trailRadius

      ctx.beginPath()
      ctx.arc(trailX, trailY, 2, 0, Math.PI * 2)
      ctx.fillStyle = `hsla(${(time * 0.1 + i * 30) % 360}, 80%, 60%, ${0.5 - j * 0.15})`
      ctx.fill()
    }
  }

  for (let i = 0; i < 5; i++) {
    const angle = time * 0.0005 + (i / 5) * Math.PI * 2
    const radius = 100 + i * 40 + Math.sin(time * 0.001 + i) * 20

    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.strokeStyle = `hsla(${(time * 0.05 + i * 40) % 360}, 70%, 50%, ${0.3 - i * 0.05})`
    ctx.lineWidth = 1
    ctx.stroke()
  }

  time++
  animationFrameId = requestAnimationFrame(drawVortex)
}

const initScrollAnimations = () => {
  gsap.utils.toArray<HTMLElement>('.temporal-card-163').forEach((card, index) => {
    gsap.fromTo(
      card,
      {
        rotationX: 90,
        opacity: 0,
        scale: 0.5
      },
      {
        rotationX: 0,
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: 'elastic.out(1, 0.8)',
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          end: 'top 20%',
          scrub: 1
        }
      }
    )

    gsap.to(card, {
      rotationY: 360,
      scrollTrigger: {
        trigger: card,
        start: 'top 60%',
        end: 'bottom 40%',
        scrub: 1
      }
    })

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2

      gsap.to(card, {
        rotationY: x * 0.3,
        rotationX: -y * 0.3,
        duration: 0.5,
        ease: 'power2.out'
      })
    })

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotationY: 0,
        rotationX: 0,
        duration: 0.5,
        ease: 'power2.out'
      })
    })
  })

  ScrollTrigger.create({
    trigger: '.temporal-distortion-163',
    start: 'top center',
    end: 'bottom center',
    onEnter: () => {
      gsap.to('.vortex-canvas-163', {
        scale: 1,
        opacity: 1,
        duration: 1
      })
    },
    onLeave: () => {
      gsap.to('.vortex-canvas-163', {
        scale: 0.5,
        opacity: 0.5,
        duration: 1
      })
    },
    onEnterBack: () => {
      gsap.to('.vortex-canvas-163', {
        scale: 1,
        opacity: 1,
        duration: 1
      })
    },
    onLeaveBack: () => {
      gsap.to('.vortex-canvas-163', {
        scale: 0.5,
        opacity: 0.5,
        duration: 1
      })
    }
  })
}

onMounted(() => {
  initCanvas()
  drawVortex()

  setTimeout(() => {
    initScrollAnimations()
  }, 100)
})

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
})
</script>

<style scoped lang="scss">
.temporal-distortion-163 {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a2a 0%, #1a1a4a 50%, #0a0a2a 100%);
  overflow: hidden;
  padding: 80px 20px;

  opacity: 1 !important;}

.vortex-container-163 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  opacity: 0.5;
}

.vortex-canvas-163 {
  width: 100%;
  height: 100%;

  opacity: 1 !important;}

.cards-container-163 {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  max-width: 1400px;
  margin: 0 auto;
  perspective: 1000px;

  opacity: 1 !important;}

.temporal-card-163 {
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(
      45deg,
      #ff00ff,
      #00ffff,
      #ff00ff,
      #00ffff,
      #ff00ff
    );
    background-size: 400% 400%;
    border-radius: 18px;
    z-index: -1;
    animation: gradientShift 3s ease infinite;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 60px rgba(255, 0, 255, 0.3);

    &::before {
      opacity: 1;
    }
  }
}

.card-inner-163 {
  position: relative;
  padding: 30px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 14px;
  overflow: hidden;

  opacity: 1 !important;}

.card-inner-163::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(255, 0, 255, 0.1) 0%,
    rgba(0, 255, 255, 0.1) 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.temporal-card-163:hover .card-inner-163::after {
  opacity: 1;
}

.card-content-163 {
  position: relative;
  z-index: 1;
  text-align: center;

  opacity: 1 !important;}

.card-content-163 h3 {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 12px;
  background: linear-gradient(135deg, #ff00ff, #00ffff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.card-content-163 p {
  font-size: 1rem;
  color: #a0a0c0;
  line-height: 1.6;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@media (max-width: 768px) {
  .cards-container-163 {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .card-inner-163 {
    padding: 20px;
  
  opacity: 1 !important;}

  .card-content-163 h3 {
    font-size: 1.4rem;
  }
}
</style>
