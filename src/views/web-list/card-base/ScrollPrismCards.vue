<template>
  <div class="spc-prism-cards-section-162" ref="componentRoot">
    <div class="spc-container-162">
      <h2 class="spc-title-162">棱镜卡片</h2>
      <p class="spc-subtitle-162">Prism Cards</p>

      <div class="spc-prism-stage-162">
        <div class="spc-light-source-162">
          <div class="spc-light-162"></div>
          <div class="spc-rays-162">
            <div class="spc-ray-162" v-for="i in 8" :key="i" :style="`--angle: ${i * 45}deg`"></div>
          </div>
        </div>

        <div class="spc-cards-162">
          <div
            v-for="(card, index) in prismCards"
            :key="index"
            class="spc-prism-card-162"
            :ref="el => { if (el) cardRefs[index] = el as HTMLElement }"
            :data-color="card.color"
            @mousemove="handlePrismMove($event, index)"
            @mouseleave="handlePrismLeave(index)"
          >
            <div class="spc-prism-body-162">
              <div class="spc-prism-face-162 spc-front-162" :style="{ backgroundImage: `url(${card.image})` }"></div>
              <div class="spc-prism-face-162 spc-back-162"></div>
              <div class="spc-prism-face-162 spc-left-162"></div>
              <div class="spc-prism-face-162 spc-right-162"></div>
              <div class="spc-prism-face-162 spc-top-162"></div>
              <div class="spc-prism-face-162 spc-bottom-162"></div>
            </div>

            <div class="spc-prism-reflection-162" :style="{ background: card.reflection }"></div>
            <div class="spc-prism-glow-162" :style="{ background: card.glow }"></div>

            <div class="spc-card-content-162">
              <span class="spc-card-number-162" :style="{ color: card.color }">
                {{ String(index + 1).padStart(2, '0') }}
              </span>
              <h3 class="spc-card-title-162">{{ card.title }}</h3>
              <p class="spc-card-desc-162">{{ card.description }}</p>
              <div class="spc-spectrum-162">
                <div class="spc-spectrum-bar-162" v-for="i in 7" :key="i" :style="`--hue: ${i * 30}deg`"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="spc-prism-base-162">
          <div class="spc-base-ring-162" v-for="i in 4" :key="i" :style="`--size: ${200 + i * 100}px`"></div>
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
const cardRefs = ref<HTMLElement[]>([])

interface PrismCard {
  image: string
  title: string
  description: string
  color: string
  reflection: string
  glow: string
}

const prismCards: PrismCard[] = [
  {
    image: new URL('@/assets/image/1.png', import.meta.url).href,
    title: '折射',
    description: 'Refraction',
    color: '#ff6b6b',
    reflection: 'linear-gradient(135deg, rgba(255, 107, 107, 0.3), transparent)',
    glow: 'radial-gradient(circle, rgba(255, 107, 107, 0.4) 0%, transparent 70%)'
  },
  {
    image: new URL('@/assets/image/2.png', import.meta.url).href,
    title: '散射',
    description: 'Dispersion',
    color: '#4ecdc4',
    reflection: 'linear-gradient(135deg, rgba(78, 205, 196, 0.3), transparent)',
    glow: 'radial-gradient(circle, rgba(78, 205, 196, 0.4) 0%, transparent 70%)'
  },
  {
    image: new URL('@/assets/image/3.png', import.meta.url).href,
    title: '衍射',
    description: 'Diffraction',
    color: '#ffe66d',
    reflection: 'linear-gradient(135deg, rgba(255, 230, 109, 0.3), transparent)',
    glow: 'radial-gradient(circle, rgba(255, 230, 109, 0.4) 0%, transparent 70%)'
  },
  {
    image: new URL('@/assets/image/4.png', import.meta.url).href,
    title: '干涉',
    description: 'Interference',
    color: '#a855f7',
    reflection: 'linear-gradient(135deg, rgba(168, 85, 247, 0.3), transparent)',
    glow: 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%)'
  }
]

let ctx: gsap.Context

const handlePrismMove = (event: MouseEvent, index: number) => {
  const card = cardRefs.value[index]
  if (!card) return

  const rect = card.getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  const y = ((event.clientY - rect.top) / rect.height) * 2 - 1

  const prismBody = card.querySelector('.spc-prism-body-162') as HTMLElement
  if (prismBody) {
    gsap.to(prismBody, {
      rotateY: x * 20,
      rotateX: -y * 20,
      scale: 1.05,
      duration: 0.4,
      ease: 'power2.out'
    })
  }

  const reflection = card.querySelector('.spc-prism-reflection-162') as HTMLElement
  if (reflection) {
    gsap.to(reflection, {
      opacity: 0.5 + Math.abs(x) * 0.3,
      transform: `translateX(${x * 20}px)`,
      duration: 0.4,
      ease: 'power2.out'
    })
  }

  const glow = card.querySelector('.spc-prism-glow-162') as HTMLElement
  if (glow) {
    gsap.to(glow, {
      opacity: 0.6,
      scale: 1.2,
      duration: 0.4,
      ease: 'power2.out'
    })
  }
}

const handlePrismLeave = (index: number) => {
  const card = cardRefs.value[index]
  if (!card) return

  const prismBody = card.querySelector('.spc-prism-body-162') as HTMLElement
  if (prismBody) {
    gsap.to(prismBody, {
      rotateY: 0,
      rotateX: 0,
      scale: 1,
      duration: 0.5,
      ease: 'power2.out'
    })
  }

  const reflection = card.querySelector('.spc-prism-reflection-162') as HTMLElement
  if (reflection) {
    gsap.to(reflection, {
      opacity: 0.3,
      transform: 'translateX(0)',
      duration: 0.5,
      ease: 'power2.out'
    })
  }

  const glow = card.querySelector('.spc-prism-glow-162') as HTMLElement
  if (glow) {
    gsap.to(glow, {
      opacity: 0.4,
      scale: 1,
      duration: 0.5,
      ease: 'power2.out'
    })
  }
}

onMounted(() => {
  setTimeout(() => {
    if (!componentRoot.value) return
    ctx = gsap.context(() => {
      const titleEl = gsap.utils.toArray<HTMLElement>('.spc-title-162', componentRoot.value)
      const subtitleEl = gsap.utils.toArray<HTMLElement>('.spc-subtitle-162', componentRoot.value)
      const prismCards = gsap.utils.toArray<HTMLElement>('.spc-prism-card-162', componentRoot.value)
      const stageEl = gsap.utils.toArray<HTMLElement>('.spc-prism-stage-162', componentRoot.value)
      const prismBodies = gsap.utils.toArray<HTMLElement>('.spc-prism-body-162', componentRoot.value)
      const cardNumbers = gsap.utils.toArray<HTMLElement>('.spc-card-number-162', componentRoot.value)
      const cardTitles = gsap.utils.toArray<HTMLElement>('.spc-card-title-162', componentRoot.value)
      const cardDescs = gsap.utils.toArray<HTMLElement>('.spc-card-desc-162', componentRoot.value)
      const spectrumBars = gsap.utils.toArray<HTMLElement>('.spc-spectrum-bar-162', componentRoot.value)
      const baseRings = gsap.utils.toArray<HTMLElement>('.spc-base-ring-162', componentRoot.value)
      const rays = gsap.utils.toArray<HTMLElement>('.spc-ray-162', componentRoot.value)

      // 标题动画 - 棱镜折射效果
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

        // 棱镜色彩流动
        gsap.to(titleEl, {
          backgroundPosition: '200% center',
          duration: 3,
          repeat: -1,
          ease: 'none'
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

      // 光线动画
      if (rays.length) {
        gsap.from(rays, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          },
          scaleX: 0,
          opacity: 0,
          duration: 1,
          stagger: 0.1,
          ease: 'power3.out'
        })

        // 光线持续动画
        rays.forEach((ray: HTMLElement, index: number) => {
          gsap.to(ray, {
            opacity: 0.3 + Math.random() * 0.5,
            duration: 0.5,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut',
            delay: index * 0.1
          })
        })
      }

      // 基座环动画
      if (baseRings.length) {
        gsap.from(baseRings, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          scale: 0,
          opacity: 0,
          duration: 1.5,
          stagger: 0.2,
          ease: 'elastic.out(1, 0.5)'
        })

        // 基座环持续旋转
        baseRings.forEach((ring: HTMLElement, index: number) => {
          gsap.to(ring, {
            rotation: 360,
            duration: 30 + index * 10,
            repeat: -1,
            ease: 'none'
          })
        })
      }

      // 棱镜卡片动画
      if (prismCards.length) {
        gsap.from(prismCards, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          },
          y: 100,
          opacity: 0,
          scale: 0.8,
          rotateY: 90,
          duration: 1,
          stagger: 0.2,
          ease: 'back.out(1.7)'
        })
      }

      // 棱镜体动画
      if (prismBodies.length) {
        gsap.from(prismBodies, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 65%',
            toggleActions: 'play none none reverse'
          },
          scale: 0.5,
          opacity: 0,
          duration: 1,
          stagger: 0.2,
          delay: 0.3,
          ease: 'power2.out'
        })
      }

      // 内容动画
      if (cardNumbers.length) {
        gsap.from(cardNumbers, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 60%',
            toggleActions: 'play none none reverse'
          },
          x: -40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
          delay: 0.5,
          ease: 'power3.out'
        })
      }

      if (cardTitles.length) {
        gsap.from(cardTitles, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 60%',
            toggleActions: 'play none none reverse'
          },
          y: 30,
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
            start: 'top 60%',
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

      // 光谱动画
      if (spectrumBars.length) {
        gsap.from(spectrumBars, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 55%',
            toggleActions: 'play none none reverse'
          },
          scaleY: 0,
          opacity: 0,
          duration: 1,
          stagger: 0.1,
          delay: 1,
          ease: 'elastic.out(1, 0.5)'
        })

        // 光谱持续波动
        gsap.to(spectrumBars, {
          scaleY: 0.5 + Math.random() * 1,
          duration: 0.5,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
          stagger: 0.1
        })
      }
    }, componentRoot.value)
  }, 100)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.spc-prism-cards-section-162 {
  min-height: 100vh;
  padding: 100px 20px;
  background: linear-gradient(180deg, #0f0a15 0%, #1a1025 50%, #0f0a15 100%);
  position: relative;
  overflow: hidden;
}

.spc-container-162 {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  z-index: 1;
}

.spc-title-162 {
  text-align: center;
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 900;
  margin-bottom: 20px;
  background: linear-gradient(90deg, #ff6b6b, #4ecdc4, #ffe66d, #a855f7, #ff6b6b);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.spc-subtitle-162 {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(255, 107, 107, 0.6);
  margin-bottom: 80px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
}

.spc-prism-stage-162 {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 2000px;
}

.spc-light-source-162 {
  position: absolute;
  top: -100px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
}

.spc-light-162 {
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 70%);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
}

.spc-rays-162 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.spc-ray-162 {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 300px;
  height: 2px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.3), transparent);
  transform-origin: left center;
  transform: rotate(var(--angle));
}

.spc-cards-162 {
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 60px;
  z-index: 2;
  max-width: 1200px;
}

.spc-prism-card-162 {
  position: relative;
  padding: 40px 30px;
  background: rgba(20, 15, 30, 0.9);
  border-radius: 20px;
  overflow: visible;
  cursor: pointer;
  perspective: 1000px;
}

.spc-prism-body-162 {
  position: relative;
  width: 100%;
  aspect-ratio: 4/3;
  transform-style: preserve-3d;
  transition: transform 0.4s ease;
}

.spc-prism-face-162 {
  position: absolute;
  inset: 0;
  border-radius: 12px;
  background-size: cover;
  background-position: center;
  transition: all 0.4s ease;
}

.spc-front-162 {
  transform: translateZ(20px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
}

.spc-back-162 {
  transform: translateZ(-20px);
  background: rgba(20, 15, 30, 0.95);
}

.spc-left-162 {
  transform: rotateY(-90deg) translateZ(20px);
  width: 40px;
  left: -20px;
}

.spc-right-162 {
  transform: rotateY(90deg) translateZ(20px);
  width: 40px;
  right: -20px;
}

.spc-top-162 {
  transform: rotateX(90deg) translateZ(20px);
  height: 40px;
  top: -20px;
}

.spc-bottom-162 {
  transform: rotateX(-90deg) translateZ(20px);
  height: 40px;
  bottom: -20px;
}

.spc-prism-reflection-162 {
  position: absolute;
  inset: 0;
  opacity: 0.3;
  border-radius: 12px;
  pointer-events: none;
  transition: opacity, transform 0.4s ease;
}

.spc-prism-glow-162 {
  position: absolute;
  inset: -20px;
  opacity: 0.4;
  border-radius: 32px;
  pointer-events: none;
  transition: opacity, transform 0.4s ease;
  filter: blur(20px);
}

.spc-card-content-162 {
  position: relative;
  margin-top: 30px;
  z-index: 1;
}

.spc-card-number-162 {
  position: absolute;
  top: -40px;
  left: 30px;
  font-size: 3.5rem;
  font-weight: 900;
  line-height: 1;
}

.spc-card-title-162 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.spc-card-desc-162 {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 20px;
}

.spc-spectrum-162 {
  display: flex;
  gap: 4px;
  height: 30px;
  align-items: flex-end;
}

.spc-spectrum-bar-162 {
  flex: 1;
  background: hsl(var(--hue), 70%, 60%);
  border-radius: 2px 2px 0 0;
  transition: height 0.5s ease;
}

.spc-prism-base-162 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 0;
}

.spc-base-ring-162 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: var(--size);
  height: var(--size);
  border: 1px solid rgba(255, 107, 107, 0.2);
  border-radius: 50%;
}

@media (max-width: 768px) {
  .spc-cards-162 {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .spc-prism-body-162 {
    aspect-ratio: 1/1;
  }

  .spc-card-number-162 {
    font-size: 3rem;
    top: -30px;
  }

  .spc-card-title-162 {
    font-size: 1.3rem;
  }
}
</style>
