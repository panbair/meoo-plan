<template>
  <div class="aurora-text-wrapper-182">
    <div class="at-stage-182" ref="stageRef">
      <div class="at-aurora-bg-182">
        <canvas class="at-aurora-canvas-182" ref="canvasRef"></canvas>
      </div>
      <div class="at-wave-layers-182">
        <div class="at-wave-182" v-for="i in 5" :key="i"></div>
      </div>
      <div class="at-aurora-container-182" ref="containerRef">
        <h2 class="at-title-182">AURORA LIGHTS</h2>
        <div class="at-color-rings-182">
          <div class="at-color-ring-182" v-for="i in 3" :key="i"></div>
        </div>
        <div class="at-aurora-text-182">
          <span class="at-char-182" v-for="(char, i) in text.split('')" :key="i">{{ char }}</span>
        </div>
        <div class="at-light-particles-182">
          <div class="at-light-particle-182" v-for="i in 30" :key="i"></div>
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

const stageRef = ref<HTMLElement>()
const containerRef = ref<HTMLElement>()
const canvasRef = ref<HTMLCanvasElement>()
const text = 'NORTHERN LIGHTS'

let ctx: gsap.Context
let auroraAnimationId: number | null = null

const initAuroraEffect = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  const stage = stageRef.value
  if (!stage) return

  canvas.width = stage.offsetWidth
  canvas.height = stage.offsetHeight

  const context = canvas.getContext('2d')
  if (!context) return

  type Wave = {
    x: number
    y: number
    amplitude: number
    frequency: number
    speed: number
    phase: number
    color: string
  }

  const waves: Wave[] = [
    { x: 0, y: canvas.height * 0.3, amplitude: 80, frequency: 0.005, speed: 0.02, phase: 0, color: 'rgba(0, 255, 127, 0.3)' },
    { x: 0, y: canvas.height * 0.35, amplitude: 100, frequency: 0.004, speed: 0.015, phase: 1, color: 'rgba(0, 191, 255, 0.3)' },
    { x: 0, y: canvas.height * 0.4, amplitude: 90, frequency: 0.006, speed: 0.018, phase: 2, color: 'rgba(138, 43, 226, 0.25)' },
    { x: 0, y: canvas.height * 0.45, amplitude: 70, frequency: 0.005, speed: 0.02, phase: 3, color: 'rgba(65, 105, 225, 0.2)' },
    { x: 0, y: canvas.height * 0.5, amplitude: 60, frequency: 0.004, speed: 0.015, phase: 4, color: 'rgba(0, 206, 209, 0.2)' }
  ]

  let time = 0

  const update = () => {
    context.fillStyle = 'rgba(0, 10, 30, 0.05)'
    context.fillRect(0, 0, canvas.width, canvas.height)

    time += 0.01

    waves.forEach(wave => {
      wave.phase += wave.speed

      context.beginPath()
      context.moveTo(0, canvas.height)

      for (let x = 0; x <= canvas.width; x += 5) {
        const y = wave.y + Math.sin(x * wave.frequency + wave.phase) * wave.amplitude
        context.lineTo(x, y)
      }

      context.lineTo(canvas.width, canvas.height)
      context.closePath()

      context.fillStyle = wave.color
      context.fill()

      const gradient = context.createLinearGradient(0, wave.y - wave.amplitude, 0, canvas.height)
      gradient.addColorStop(0, wave.color)
      gradient.addColorStop(1, 'transparent')
      context.fillStyle = gradient
      context.fill()
    })

    auroraAnimationId = requestAnimationFrame(update)
  }

  update()
}

onMounted(() => {
  ctx = gsap.context(() => {
    const stage = stageRef.value
    const container = containerRef.value
    if (!stage || !container) return

    initAuroraEffect()

    const chars = gsap.utils.toArray('.at-char-182') as HTMLElement[]
    const waves = gsap.utils.toArray('.at-wave-182') as HTMLElement[]
    const colorRings = gsap.utils.toArray('.at-color-ring-182') as HTMLElement[]
    const lightParticles = gsap.utils.toArray('.at-light-particle-182') as HTMLElement[]
    const title = stage.querySelector('.at-title-182')

    if (title) {
      gsap.fromTo(title,
        { opacity: 0, scale: 0.8, filter: 'blur(10px)' },
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

      gsap.to(title, {
        textShadow: '0 0 30px #00ff7f, 0 0 60px #00bfff',
        duration: 3,
        repeat: -1,
        yoyo: true
      })
    }

    gsap.fromTo(waves,
      { scaleY: 0, opacity: 0 },
      {
        scrollTrigger: {
          trigger: stage,
          start: 'top 70%',
          end: 'top 50%',
          scrub: 1
        },
        scaleY: 1,
        opacity: 1,
        stagger: 0.2
      }
    )

    waves.forEach((wave, i) => {
      gsap.to(wave, {
        scaleY: 0.8 + Math.sin(i * 0.5) * 0.2,
        duration: 2 + i * 0.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })
    })

    gsap.fromTo(colorRings,
      { scale: 0, opacity: 0 },
      {
        scrollTrigger: {
          trigger: stage,
          start: 'top 60%',
          end: 'center 50%',
          scrub: 1
        },
        scale: 1,
        opacity: 0.5,
        stagger: 0.3
      }
    )

    gsap.fromTo(chars,
      {
        color: '#001a1a',
        textShadow: 'none',
        opacity: 0,
        translateY: 50
      },
      {
        scrollTrigger: {
          trigger: stage,
          start: 'top 50%',
          end: 'center 50%',
          scrub: 1
        },
        color: '#00ff7f',
        textShadow: '0 0 15px #00bfff, 0 0 30px #8a2be2',
        opacity: 1,
        translateY: 0,
        stagger: 0.06
      }
    )

    chars.forEach((char) => {
      char.addEventListener('mouseenter', () => {
        gsap.to(char, {
          color: '#fff',
          textShadow: '0 0 40px #00ff7f, 0 0 80px #00bfff',
          scale: 1.3,
          duration: 0.3
        })
      })
      char.addEventListener('mouseleave', () => {
        gsap.to(char, {
          color: '#00ff7f',
          textShadow: '0 0 15px #00bfff, 0 0 30px #8a2be2',
          scale: 1,
          duration: 0.3
        })
      })
    })

    gsap.fromTo(lightParticles,
      { scale: 0, opacity: 0 },
      {
        scrollTrigger: {
          trigger: stage,
          start: 'top 40%',
          end: 'bottom 20%',
          scrub: 1
        },
        scale: 1,
        opacity: 1,
        stagger: 0.05
      }
    )

    lightParticles.forEach((particle) => {
      gsap.to(particle, {
        x: (Math.random() - 0.5) * 50,
        y: (Math.random() - 0.5) * 50,
        opacity: 0.3 + Math.random() * 0.7,
        duration: 1 + Math.random() * 2,
        repeat: -1,
        yoyo: true
      })
    })

    gsap.to(container, {
      boxShadow: '0 0 80px rgba(0, 255, 127, 0.4), 0 0 120px rgba(0, 191, 255, 0.2)',
      scrollTrigger: {
        trigger: stage,
        start: 'top 30%',
        end: 'bottom 10%',
        scrub: 1
      }
    })

  }, stageRef.value)
})

onUnmounted(() => {
  ctx?.revert()
  if (auroraAnimationId !== null) {
    cancelAnimationFrame(auroraAnimationId)
  }
})
</script>

<style scoped lang="scss">
.aurora-text-wrapper-182 {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #000a14 0%, #001428 30%, #001a33 70%, #000a14 100%);
  overflow: hidden;

  opacity: 1 !important;}

.at-stage-182 {
  position: relative;
  width: 100%;
  max-width: 1200px;
  padding: 60px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;

  opacity: 1 !important;}

.at-aurora-bg-182 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
}

.at-aurora-canvas-182 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.6;
}

.at-wave-layers-182 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.at-wave-182 {
  position: absolute;
  top: 20%;
  left: 0;
  right: 0;
  height: 60%;
  background: linear-gradient(180deg, transparent, rgba(0, 255, 127, 0.1), rgba(0, 191, 255, 0.1), transparent);
  transform-origin: center;

  opacity: 1 !important;}

.at-aurora-container-182 {
  position: relative;
  text-align: center;
  padding: 100px 80px;
  background: rgba(0, 20, 40, 0.6);
  border: 2px solid rgba(0, 255, 127, 0.3);
  border-radius: 20px;
  overflow: hidden;
  backdrop-filter: blur(10px);

  opacity: 1 !important;}

.at-title-182 {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 900;
  color: #00ff7f;
  text-transform: uppercase;
  letter-spacing: 6px;
  margin-bottom: 30px;

  opacity: 1 !important;}

.at-color-rings-182 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.at-color-ring-182 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 3px solid;
  border-radius: 50%;
  animation: pulseRing 4s ease-in-out infinite;

  opacity: 1 !important;}

.at-color-ring-182:nth-child(1) {
  width: 400px;
  height: 400px;
  border-color: rgba(0, 255, 127, 0.3);
  animation-delay: 0s;
}

.at-color-ring-182:nth-child(2) {
  width: 500px;
  height: 500px;
  border-color: rgba(0, 191, 255, 0.25);
  animation-delay: 1s;
}

.at-color-ring-182:nth-child(3) {
  width: 600px;
  height: 600px;
  border-color: rgba(138, 43, 226, 0.2);
  animation-delay: 2s;
}

@keyframes pulseRing {
  0%, 100% {
    opacity: 0.3;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.6;
    transform: translate(-50%, -50%) scale(1.05);
  }
}

.at-aurora-text-182 {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 6px;
  margin: 50px 0;

  opacity: 1 !important;}

.at-char-182 {
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 900;
  text-transform: uppercase;
  position: relative;
  display: inline-block;
  color: #00ff7f;
  transition: all 0.3s ease;

  opacity: 1 !important;}

.at-light-particles-182 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.at-light-particle-182 {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 0 10px #00ff7f, 0 0 20px #00bfff;

  opacity: 1 !important;}
</style>
