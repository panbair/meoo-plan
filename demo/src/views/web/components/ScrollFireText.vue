<template>
  <div class="fire-text-wrapper-178">
    <div class="ft-stage-178" ref="stageRef">
      <div class="ft-fire-bg-178">
        <canvas class="ft-fire-canvas-178" ref="fireCanvasRef"></canvas>
      </div>
      <div class="ft-fire-container-178" ref="containerRef">
        <h2 class="ft-title-178">FIRE BLAZE</h2>
        <div class="ft-embers-178">
          <div class="ft-ember-178" v-for="i in 40" :key="i"></div>
        </div>
        <div class="ft-fire-text-178">
          <span class="ft-char-178" v-for="(char, i) in text.split('')" :key="i">{{ char }}</span>
        </div>
        <div class="ft-smoke-trails-178">
          <div class="ft-smoke-178" v-for="i in 6" :key="i"></div>
        </div>
      </div>
      <div class="ft-heat-waves-178">
        <div class="ft-wave-178" v-for="i in 5" :key="i"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const stageRef = ref<HTMLElement>()
const containerRef = ref<HTMLElement>()
const fireCanvasRef = ref<HTMLCanvasElement>()
const text = 'INFERNO POWER'

let ctx: gsap.Context
let fireAnimationId: number | null = null

// 火焰效果
const initFireEffect = () => {
  const canvas = fireCanvasRef.value
  if (!canvas) return

  const stage = stageRef.value
  if (!stage) return

  canvas.width = stage.offsetWidth
  canvas.height = stage.offsetHeight

  const context = canvas.getContext('2d')
  if (!context) return

  type Particle = {
    x: number
    y: number
    vy: number
    life: number
    size: number
  }

  const particles: Particle[] = []

  const createParticle = (): Particle => {
    return {
      x: Math.random() * canvas.width,
      y: canvas.height + 20,
      vy: -2 - Math.random() * 3,
      life: 1,
      size: 2 + Math.random() * 4
    }
  }

  const update = () => {
    context.fillStyle = 'rgba(10, 5, 0, 0.1)'
    context.fillRect(0, 0, canvas.width, canvas.height)

    if (particles.length < 100) {
      particles.push(createParticle())
    }

    particles.forEach((particle, index) => {
      particle.y += particle.vy
      particle.life -= 0.01
      particle.x += Math.sin(particle.y * 0.05) * 0.5

      if (particle.life <= 0) {
        particles[index] = createParticle()
      }

      const gradient = context.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size * 2
      )

      const alpha = particle.life
      gradient.addColorStop(0, `rgba(255, ${150 + Math.random() * 100}, 0, ${alpha})`)
      gradient.addColorStop(0.5, `rgba(255, 50, 0, ${alpha * 0.5})`)
      gradient.addColorStop(1, `rgba(255, 0, 0, 0)`)

      context.fillStyle = gradient
      context.beginPath()
      context.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2)
      context.fill()
    })

    fireAnimationId = requestAnimationFrame(update)
  }

  update()
}

onMounted(() => {
  ctx = gsap.context(() => {
    const stage = stageRef.value
    const container = containerRef.value
    if (!stage || !container) return

    initFireEffect()

    const chars = gsap.utils.toArray('.ft-char-178') as HTMLElement[]
    const embers = gsap.utils.toArray('.ft-ember-178') as HTMLElement[]
    const smokes = gsap.utils.toArray('.ft-smoke-178') as HTMLElement[]
    const waves = gsap.utils.toArray('.ft-wave-178') as HTMLElement[]
    const title = stage.querySelector('.ft-title-178')

    // 标题火焰效果
    if (title) {
      gsap.fromTo(title,
        { opacity: 0, scale: 0.8, filter: 'blur(5px)' },
        {
          scrollTrigger: {
            trigger: stage,
            start: 'top 80%',
            end: 'top 60%',
            scrub: 1
          },
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)'
        }
      )

      // 标题火焰闪烁
      gsap.to(title, {
        textShadow: '0 0 20px #ff4500, 0 0 40px #ff0000, 0 0 60px #ff6600',
        duration: 0.5,
        repeat: -1,
        yoyo: true
      })
    }

    // 火焰文字动画
    gsap.fromTo(chars,
      {
        color: '#330000',
        textShadow: 'none',
        opacity: 0,
        y: 50
      },
      {
        scrollTrigger: {
          trigger: stage,
          start: 'top 60%',
          end: 'center 50%',
          scrub: 1
        },
        color: '#ff6600',
        textShadow: '0 0 10px #ff4500, 0 0 20px #ff0000, 0 0 30px #ff6600',
        opacity: 1,
        y: 0,
        stagger: 0.06
      }
    )

    // 字符悬停燃烧效果
    chars.forEach((char) => {
      char.addEventListener('mouseenter', () => {
        gsap.to(char, {
          color: '#ffff00',
          textShadow: '0 0 30px #ff4500, 0 0 60px #ff0000, 0 0 90px #ff6600',
          scale: 1.3,
          duration: 0.2
        })
      })
      char.addEventListener('mouseleave', () => {
        gsap.to(char, {
          color: '#ff6600',
          textShadow: '0 0 10px #ff4500, 0 0 20px #ff0000, 0 0 30px #ff6600',
          scale: 1,
          duration: 0.2
        })
      })
    })

    // 火星飞溅
    gsap.fromTo(embers,
      { scale: 0, opacity: 0 },
      {
        scrollTrigger: {
          trigger: stage,
          start: 'top 50%',
          end: 'bottom 30%',
          scrub: 1
        },
        scale: 1,
        opacity: 1,
        stagger: 0.03
      }
    )

    embers.forEach((ember, i) => {
      const startX = Math.random() * 100 - 50
      const startY = Math.random() * 100
      gsap.to(ember, {
        x: startX,
        y: -startY,
        opacity: 0,
        duration: 1 + Math.random() * 2,
        repeat: -1,
        delay: Math.random() * 2
      })
    })

    // 烟雾效果
    gsap.fromTo(smokes,
      { scaleY: 0, opacity: 0 },
      {
        scrollTrigger: {
          trigger: stage,
          start: 'top 40%',
          end: 'bottom 20%',
          scrub: 1
        },
        scaleY: 1,
        opacity: 0.6,
        stagger: 0.2
      }
    )

    smokes.forEach((smoke, i) => {
      gsap.to(smoke, {
        x: Math.random() * 40 - 20,
        scaleX: 1 + Math.random() * 0.5,
        opacity: 0.2 + Math.random() * 0.4,
        duration: 2 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        delay: i * 0.3
      })
    })

    // 热浪效果
    gsap.fromTo(waves,
      { scaleY: 0, opacity: 0 },
      {
        scrollTrigger: {
          trigger: stage,
          start: 'top 30%',
          end: 'bottom 10%',
          scrub: 1
        },
        scaleY: 1,
        opacity: 0.4,
        stagger: 0.15
      }
    )

    waves.forEach((wave, i) => {
      gsap.to(wave, {
        scaleY: 0.8 + Math.random() * 0.4,
        duration: 1 + Math.random() * 1,
        repeat: -1,
        yoyo: true,
        delay: i * 0.2
      })
    })

    // 容器热力效果
    gsap.to(container, {
      boxShadow: '0 0 80px rgba(255, 100, 0, 0.6), 0 0 120px rgba(255, 50, 0, 0.4), inset 0 0 60px rgba(255, 100, 0, 0.2)',
      scrollTrigger: {
        trigger: stage,
        start: 'top 20%',
        end: 'bottom 0%',
        scrub: 1
      }
    })

  }, stageRef.value)
})

onUnmounted(() => {
  ctx?.revert()
  if (fireAnimationId !== null) {
    cancelAnimationFrame(fireAnimationId)
  }
})
</script>

<style scoped lang="scss">
.fire-text-wrapper-178 {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #1a0a00 0%, #0a0500 50%, #0a0500 100%);
  overflow: hidden;

  opacity: 1 !important;}

.ft-stage-178 {
  position: relative;
  width: 100%;
  max-width: 1200px;
  padding: 60px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;

  opacity: 1 !important;}

.ft-fire-bg-178 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
}

.ft-fire-canvas-178 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.4;
}

.ft-fire-container-178 {
  position: relative;
  text-align: center;
  padding: 100px 80px;
  background: rgba(20, 10, 0, 0.7);
  border: 3px solid #ff6600;
  border-radius: 20px;
  overflow: hidden;
  backdrop-filter: blur(5px);

  opacity: 1 !important;}

.ft-fire-container-178::before {
  content: '';
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  background: linear-gradient(45deg, #ff4500, #ff0000, #ff6600, #ff4500);
  border-radius: 20px;
  z-index: -1;
  animation: fireBorder 3s linear infinite;
}

.ft-title-178 {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 900;
  color: #ff6600;
  text-transform: uppercase;
  letter-spacing: 6px;
  margin-bottom: 30px;

  opacity: 1 !important;}

.ft-embers-178 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.ft-ember-178 {
  position: absolute;
  width: 6px;
  height: 6px;
  background: #ff6600;
  border-radius: 50%;
  box-shadow: 0 0 10px #ff4500, 0 0 20px #ff0000;

  opacity: 1 !important;}

.ft-fire-text-178 {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 4px;
  margin: 50px 0;

  opacity: 1 !important;}

.ft-char-178 {
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 900;
  text-transform: uppercase;
  position: relative;
  display: inline-block;
  transition: all 0.3s ease;

  opacity: 1 !important;}

.ft-smoke-trails-178 {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 60px;
}

.ft-smoke-178 {
  width: 60px;
  height: 200px;
  background: linear-gradient(180deg, rgba(100, 100, 100, 0), rgba(80, 80, 80, 0.4), rgba(60, 60, 60, 0));
  border-radius: 30px;
  transform-origin: bottom center;
  filter: blur(5px);

  opacity: 1 !important;}

.ft-heat-waves-178 {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 20px;
  padding-bottom: 40px;
}

.ft-wave-178 {
  width: 100%;
  height: 80px;
  background: linear-gradient(180deg, transparent, rgba(255, 100, 0, 0.2), transparent);
  transform-origin: center;

  opacity: 1 !important;}

@keyframes fireBorder {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
}
</style>
