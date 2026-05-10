<template>
  <div class="saf-aurora-field-section-157" ref="componentRoot">
    <div class="saf-container-157">
      <h2 class="saf-title-157">极光领域</h2>
      <p class="saf-subtitle-157">Aurora Field Effect</p>

      <div class="saf-aurora-stage-157">
        <canvas ref="auroraCanvas" class="saf-canvas-157"></canvas>

        <div class="saf-cards-157">
          <div
            v-for="(card, index) in cards"
            :key="index"
            class="saf-aurora-card-157"
            :ref="el => { if (el) cardRefs[index] = el as HTMLElement }"
            :data-color="card.color"
          >
            <div class="saf-card-glow-157" :style="{ background: card.color }"></div>
            <div class="saf-card-inner-157">
              <div class="saf-card-icon-157">{{ card.icon }}</div>
              <h3 class="saf-card-title-157">{{ card.title }}</h3>
              <p class="saf-card-desc-157">{{ card.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="saf-particles-157">
        <div class="saf-particle-157" v-for="i in 20" :key="i"></div>
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
  color: string
}

const cards: Card[] = [
  {
    icon: '🌌',
    title: '星光',
    description: 'Starlight',
    color: 'linear-gradient(135deg, #667eea, #764ba2)'
  },
  {
    icon: '✨',
    title: '极光',
    description: 'Aurora',
    color: 'linear-gradient(135deg, #f093fb, #f5576c)'
  },
  {
    icon: '🌠',
    title: '流星',
    description: 'Meteor',
    color: 'linear-gradient(135deg, #4facfe, #00f2fe)'
  },
  {
    icon: '🌙',
    title: '月影',
    description: 'Moonlight',
    color: 'linear-gradient(135deg, #fa709a, #fee140)'
  }
]

let gsapCtx: gsap.Context
let animationFrame: number | null = null
let resizeCanvas: () => void = () => {}

onMounted(() => {
  setTimeout(() => {
    if (!componentRoot.value) return

    // Canvas 极光动画
    const canvas = auroraCanvas.value
    if (!canvas) return

    resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight * 0.8
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const auroraWaves = Array.from({ length: 5 }, (_, i) => ({
      x: 0,
      y: canvas.height * (0.3 + i * 0.15),
      amplitude: 50 + i * 20,
      frequency: 0.002 + i * 0.001,
      speed: 0.01 + i * 0.005,
      phase: i * Math.PI * 0.5,
      color: `hsla(${280 + i * 20}, 70%, 50%, 0.3)`
    }))

    let time = 0

    const animateAurora = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      auroraWaves.forEach((wave, index) => {
        ctx.beginPath()
        ctx.strokeStyle = wave.color
        ctx.lineWidth = 80

        for (let x = 0; x <= canvas.width; x += 5) {
          const y = wave.y + Math.sin(x * wave.frequency + time + wave.phase) * wave.amplitude
          if (x === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.stroke()
      })

      time += 0.016
      animationFrame = requestAnimationFrame(animateAurora)
    }

    animateAurora()

    // GSAP 动画
    gsapCtx = gsap.context(() => {
      const titleEl = gsap.utils.toArray<HTMLElement>('.saf-title-157', componentRoot.value)
      const subtitleEl = gsap.utils.toArray<HTMLElement>('.saf-subtitle-157', componentRoot.value)
      const auroraCards = gsap.utils.toArray<HTMLElement>('.saf-aurora-card-157', componentRoot.value)
      const stageEl = gsap.utils.toArray<HTMLElement>('.saf-aurora-stage-157', componentRoot.value)
      const cardIcons = gsap.utils.toArray<HTMLElement>('.saf-card-icon-157', componentRoot.value)
      const cardTitles = gsap.utils.toArray<HTMLElement>('.saf-card-title-157', componentRoot.value)
      const cardDescs = gsap.utils.toArray<HTMLElement>('.saf-card-desc-157', componentRoot.value)
      const particles = gsap.utils.toArray<HTMLElement>('.saf-particle-157', componentRoot.value)

      // 标题动画
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

      // 卡片动画
      if (auroraCards.length) {
        gsap.from(auroraCards, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          },
          y: 100,
          opacity: 0,
          scale: 0.8,
          rotation: (i) => (i % 2 === 0 ? 5 : -5),
          duration: 1,
          stagger: 0.2,
          ease: 'back.out(1.7)'
        })

        // 卡片浮动动画
        auroraCards.forEach((card: HTMLElement, index: number) => {
          gsap.to(card, {
            y: -10,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: index * 0.3
          })
        })

        // 卡片悬停效果
        auroraCards.forEach((card: HTMLElement) => {
          const glow = card.querySelector('.saf-glow-157') as HTMLElement

          card.addEventListener('mouseenter', () => {
            gsap.to(card, {
              scale: 1.1,
              y: -20,
              duration: 0.4,
              ease: 'power2.out'
            })

            if (glow) {
              gsap.to(glow, {
                opacity: 0.8,
                scale: 1.5,
                duration: 0.4,
                ease: 'power2.out'
              })
            }
          })

          card.addEventListener('mouseleave', () => {
            gsap.to(card, {
              scale: 1,
              y: 0,
              duration: 0.4,
              ease: 'power2.out'
            })

            if (glow) {
              gsap.to(glow, {
                opacity: 0.4,
                scale: 1,
                duration: 0.4,
                ease: 'power2.out'
              })
            }
          })
        })
      }

      // 卡片内容动画
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

      // 粒子动画
      if (particles.length) {
        gsap.from(particles, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          scale: 0,
          opacity: 0,
          duration: 1.5,
          stagger: {
            each: 0.1,
            from: 'random'
          },
          ease: 'elastic.out(1, 0.5)'
        })

        // 粒子持续动画
        particles.forEach((particle: HTMLElement, index: number) => {
          const duration = 3 + Math.random() * 4
          const delay = Math.random() * 2

          gsap.to(particle, {
            y: -window.innerHeight * 0.5,
            x: (Math.random() - 0.5) * 100,
            opacity: 0,
            duration,
            repeat: -1,
            delay,
            ease: 'none'
          })
        })
      }

      // 滚动控制极光强度
      if (stageEl.length) {
        ScrollTrigger.create({
          trigger: stageEl[0],
          start: 'top 80%',
          end: 'bottom 20%',
          onUpdate: (self) => {
            const progress = self.progress
            auroraWaves.forEach((wave, index) => {
              wave.amplitude = (50 + index * 20) * (1 + progress * 2)
            })
          }
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
.saf-aurora-field-section-157 {
  min-height: 100vh;
  padding: 100px 20px;
  background: linear-gradient(180deg, #0a0a1a 0%, #0f0a1a 30%, #0a0a2a 60%, #0f0a1a 100%);
  position: relative;
  overflow: hidden;
}

.saf-container-157 {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  z-index: 1;
}

.saf-title-157 {
  text-align: center;
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 900;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #a78bfa, #f472b6, #60a5fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 60px rgba(167, 139, 250, 0.5);
}

.saf-subtitle-157 {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(167, 139, 250, 0.6);
  margin-bottom: 80px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
}

.saf-aurora-stage-157 {
  position: relative;
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 60px;
}

.saf-canvas-157 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.saf-cards-157 {
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  max-width: 1200px;
  z-index: 2;
}

.saf-aurora-card-157 {
  position: relative;
  min-height: 300px;
  background: rgba(20, 10, 30, 0.6);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid rgba(167, 139, 250, 0.2);
  cursor: pointer;
  transition: border-color 0.4s ease;

  &:hover {
    border-color: rgba(167, 139, 250, 0.5);
  }
}

.saf-card-glow-157 {
  position: absolute;
  inset: 0;
  opacity: 0.4;
  filter: blur(40px);
  transition: opacity, transform 0.4s ease;
}

.saf-card-inner-157 {
  position: relative;
  z-index: 1;
  padding: 40px;
  text-align: center;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.saf-card-icon-157 {
  font-size: 4rem;
  margin-bottom: 20px;
  filter: drop-shadow(0 0 20px rgba(167, 139, 250, 0.5));
}

.saf-card-title-157 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 10px;
  text-shadow: 0 0 20px rgba(167, 139, 250, 0.5);
}

.saf-card-desc-157 {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.saf-particles-157 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.saf-particle-157 {
  position: absolute;
  width: 4px;
  height: 4px;
  background: radial-gradient(circle, rgba(167, 139, 250, 0.8) 0%, transparent 70%);
  border-radius: 50%;
  bottom: -20px;
}

@media (max-width: 768px) {
  .saf-cards-157 {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .saf-aurora-card-157 {
    min-height: 250px;
  }

  .saf-card-icon-157 {
    font-size: 3rem;
  }

  .saf-card-title-157 {
    font-size: 1.5rem;
  }
}
</style>
