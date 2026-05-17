<template>
  <div class="saa-aurora-aurora-section-181" ref="componentRoot">
    <div class="saa-container-181">
      <h2 class="saa-title-181">极光极光</h2>
      <p class="saa-subtitle-181">Aurora Aurora</p>

      <div class="saa-aurora-stage-181">
        <canvas ref="auroraCanvas" class="saa-canvas-181"></canvas>

        <div class="saa-aurora-cards-181">
          <div
            v-for="(card, index) in cards"
            :key="index"
            class="saa-aurora-card-181"
            :ref="el => { if (el) cardRefs[index] = el as HTMLElement }"
            :data-aurora="index"
            @mousemove="handleAuroraMove($event, index)"
            @mouseleave="handleAuroraLeave(index)"
          >
            <div class="saa-card-aurora-181">
              <div class="saa-aurora-wave-181" v-for="i in 3" :key="i" :style="`--hue: ${card.hue + i * 30}`"></div>
            </div>
            <div class="saa-card-content-181">
              <div class="saa-card-icon-181">{{ card.icon }}</div>
              <h3 class="saa-card-title-181">{{ card.title }}</h3>
              <p class="saa-card-desc-181">{{ card.description }}</p>
            </div>
          </div>
        </div>

        <div class="saa-floating-stars-181">
          <div class="saa-star-181" v-for="i in 20" :key="i"></div>
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

const componentRoot = ref<HTMLElement>()
const auroraCanvas = ref<HTMLCanvasElement>()
const cardRefs = ref<HTMLElement[]>([])

interface Card {
  icon: string
  title: string
  description: string
  hue: number
}

const cards: Card[] = [
  {
    icon: '🌌',
    title: '银河',
    description: 'GALAXY',
    hue: 240
  },
  {
    icon: '✨',
    title: '星光',
    description: 'STARDUST',
    hue: 180
  },
  {
    icon: '🌠',
    title: '流星',
    description: 'METEOR',
    hue: 300
  },
  {
    icon: '🌙',
    title: '月光',
    description: 'MOONLIGHT',
    hue: 260
  }
]

let gsapCtx: gsap.Context
let auroraCtx: CanvasRenderingContext2D | null = null
let animationFrame: number | null = null
let resizeCanvas: () => void = () => {}

const handleAuroraMove = (event: MouseEvent, index: number) => {
  const card = cardRefs.value[index]
  if (!card) return

  const rect = card.getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  const y = ((event.clientY - rect.top) / rect.height) * 2 - 1

  gsap.to(card, {
    rotateX: y * 10,
    rotateY: -x * 10,
    duration: 0.5,
    ease: 'power2.out'
  })

  const aurora = card.querySelector('.saa-card-aurora-181') as HTMLElement
  if (aurora) {
    gsap.to(aurora, {
      opacity: 0.8 + Math.abs(x) * 0.2,
      duration: 0.5,
      ease: 'power2.out'
    })
  }
}

const handleAuroraLeave = (index: number) => {
  const card = cardRefs.value[index]
  if (!card) return

  gsap.to(card, {
    rotateX: 0,
    rotateY: 0,
    duration: 0.6,
    ease: 'elastic.out(1, 0.5)'
  })

  const aurora = card.querySelector('.saa-card-aurora-181') as HTMLElement
  if (aurora) {
    gsap.to(aurora, {
      opacity: 0.6,
      duration: 0.6,
      ease: 'power2.out'
    })
  }
}

onMounted(() => {
  setTimeout(() => {
    if (!componentRoot.value) return

    const canvas = auroraCanvas.value
    if (!canvas) return

    resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight * 0.8
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    auroraCtx = canvas.getContext('2d')
    if (!auroraCtx) return

    const waves = Array.from({ length: 8 }, (_, i) => ({
      y: canvas.height * (0.3 + i * 0.1),
      amplitude: 30 + i * 10,
      frequency: 0.001 + i * 0.0005,
      speed: 0.005 + i * 0.002,
      phase: i * Math.PI * 0.25,
      hue: 240 + i * 30,
      opacity: 0.3 + i * 0.05
    }))

    let time = 0

    const animateAurora = () => {
      if (!auroraCtx || !canvas) return

      auroraCtx.fillStyle = 'rgba(5, 5, 20, 0.02)'
      auroraCtx.fillRect(0, 0, canvas.width, canvas.height)

      waves.forEach((wave) => {
        auroraCtx.beginPath()
        auroraCtx.strokeStyle = `hsla(${wave.hue}, 80%, 60%, ${wave.opacity})`
        auroraCtx.lineWidth = 60

        for (let x = 0; x <= canvas.width; x += 5) {
          const y = wave.y + Math.sin(x * wave.frequency + time + wave.phase) * wave.amplitude
          if (x === 0) {
            auroraCtx.moveTo(x, y)
          } else {
            auroraCtx.lineTo(x, y)
          }
        }
        auroraCtx.stroke()
      })

      time += 0.01
      animationFrame = requestAnimationFrame(animateAurora)
    }

    animateAurora()

    gsapCtx = gsap.context(() => {
      const titleEl = gsap.utils.toArray<HTMLElement>('.saa-title-181', componentRoot.value)
      const subtitleEl = gsap.utils.toArray<HTMLElement>('.saa-subtitle-181', componentRoot.value)
      const auroraCards = gsap.utils.toArray<HTMLElement>('.saa-aurora-card-181', componentRoot.value)
      const stageEl = gsap.utils.toArray<HTMLElement>('.saa-aurora-stage-181', componentRoot.value)
      const cardIcons = gsap.utils.toArray<HTMLElement>('.saa-card-icon-181', componentRoot.value)
      const cardTitles = gsap.utils.toArray<HTMLElement>('.saa-card-title-181', componentRoot.value)
      const cardDescs = gsap.utils.toArray<HTMLElement>('.saa-card-desc-181', componentRoot.value)
      const stars = gsap.utils.toArray<HTMLElement>('.saa-star-181', componentRoot.value)

      if (titleEl.length) {
        gsap.from(titleEl, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          y: 80,
          opacity: 0,
          duration: 1.2,
          ease: 'power3.out'
        })
      }

      if (subtitleEl.length) {
        gsap.from(subtitleEl, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          },
          y: 40,
          opacity: 0,
          duration: 1,
          delay: 0.2,
          ease: 'power3.out'
        })
      }

      if (auroraCards.length) {
        gsap.from(auroraCards, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          },
          y: 100,
          opacity: 0,
          scale: 0.9,
          duration: 1,
          stagger: 0.2,
          ease: 'back.out(1.7)'
        })

        auroraCards.forEach((card) => {
          gsap.to(card, {
            y: -10,
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: Math.random() * 2
          })
        })
      }

      if (cardIcons.length) {
        gsap.from(cardIcons, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 65%',
            toggleActions: 'play none none reverse'
          },
          scale: 0,
          rotation: 180,
          duration: 0.8,
          stagger: 0.2,
          delay: 0.5,
          ease: 'back.out(2)'
        })
      }

      if (cardTitles.length) {
        gsap.from(cardTitles, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 65%',
            toggleActions: 'play none none reverse'
          },
          y: 20,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
          delay: 0.7,
          ease: 'power3.out'
        })
      }

      if (cardDescs.length) {
        gsap.from(cardDescs, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 65%',
            toggleActions: 'play none none reverse'
          },
          y: 20,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
          delay: 0.9,
          ease: 'power3.out'
        })
      }

      if (stars.length) {
        gsap.from(stars, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          scale: 0,
          opacity: 0,
          duration: 1.5,
          stagger: {
            each: 0.05,
            from: 'random'
          },
          ease: 'elastic.out(1, 0.5)'
        })

        stars.forEach((star) => {
          gsap.to(star, {
            opacity: 0.3 + Math.random() * 0.7,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut',
            delay: Math.random() * 2
          })
        })
      }
    }, componentRoot.value)
  }, 100)
})

onUnmounted(() => {
  gsapCtx?.revert()
  window.removeEventListener('resize', resizeCanvas)
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
})
</script>

<style scoped lang="scss">
.saa-aurora-aurora-section-181 {
  position: relative;
  min-height: 100vh;
  padding: 120px 20px;
  background: linear-gradient(180deg, #050515 0%, #0a0a25 50%, #050515 100%);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(ellipse at 50% 30%, rgba(139, 92, 246, 0.15) 0%, transparent 60%),
      radial-gradient(ellipse at 30% 70%, rgba(236, 72, 153, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
}

.saa-container-181 {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  z-index: 1;
}

.saa-title-181 {
  text-align: center;
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 900;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #8b5cf6, #ec4899, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.saa-subtitle-181 {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(139, 92, 246, 0.6);
  margin-bottom: 80px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
}

.saa-aurora-stage-181 {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
}

.saa-canvas-181 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.saa-aurora-cards-181 {
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 40px;
  max-width: 1200px;
  z-index: 2;
}

.saa-aurora-card-181 {
  position: relative;
  background: rgba(10, 10, 30, 0.6);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid rgba(139, 92, 246, 0.2);
  transform-style: preserve-3d;
  cursor: pointer;
  transition: border-color 0.4s ease;

  &:hover {
    border-color: rgba(139, 92, 246, 0.5);
  }
}

.saa-card-aurora-181 {
  position: absolute;
  inset: 0;
  opacity: 0.6;
  overflow: hidden;
  pointer-events: none;
}

.saa-aurora-wave-181 {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, hsla(var(--hue), 70%, 60%, 0.3), transparent);
  animation: auroraWave 3s ease-in-out infinite;
  animation-delay: calc(var(--hue) * 0.01s);
}

@keyframes auroraWave {
  0%, 100% {
    transform: translateY(-50%) rotate(0deg);
  }
  50% {
    transform: translateY(50%) rotate(180deg);
  }
}

.saa-card-content-181 {
  position: relative;
  padding: 40px;
  text-align: center;
  z-index: 1;
}

.saa-card-icon-181 {
  font-size: 4rem;
  margin-bottom: 20px;
  filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.5));
}

.saa-card-title-181 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 10px;
  text-shadow: 0 0 20px rgba(139, 92, 246, 0.5);
}

.saa-card-desc-181 {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.saa-floating-stars-181 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.saa-star-181 {
  position: absolute;
  width: 4px;
  height: 4px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 70%);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

@media (max-width: 768px) {
  .saa-aurora-cards-181 {
    grid-template-columns: 1fr;
  }

  .saa-card-icon-181 {
    font-size: 3rem;
  }

  .saa-card-title-181 {
    font-size: 1.5rem;
  }
}
</style>
