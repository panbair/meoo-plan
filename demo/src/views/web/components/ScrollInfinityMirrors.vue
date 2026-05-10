<template>
  <div class="sim-infinity-mirrors-section-172" ref="componentRoot">
    <div class="sim-container-172">
      <h2 class="sim-title-172">无限镜像</h2>
      <p class="sim-subtitle-172">Infinity Mirrors</p>

      <div class="sim-mirrors-stage-172">
        <div class="sim-mirror-tunnel-172">
          <div class="sim-mirror-frame-172" v-for="i in 6" :key="i" :data-depth="i">
            <div class="sim-mirror-surface-172"></div>
            <div class="sim-mirror-reflection-172"></div>
          </div>
        </div>

        <div class="sim-mirror-cards-172">
          <div
            v-for="(card, index) in mirrorCards"
            :key="index"
            class="sim-mirror-card-172"
            :ref="el => { if (el) cardRefs[index] = el as HTMLElement }"
            :data-mirror="index"
          >
            <div class="sim-card-reflection-172">
              <div class="sim-reflection-layer-172" v-for="i in 3" :key="i"></div>
            </div>
            <div class="sim-card-content-172">
              <div class="sim-card-number-172">{{ String(index + 1).padStart(2, '0') }}</div>
              <div class="sim-card-icon-172">{{ card.icon }}</div>
              <h3 class="sim-card-title-172">{{ card.title }}</h3>
              <p class="sim-card-desc-172">{{ card.description }}</p>
            </div>
            <div class="sim-card-shine-172"></div>
          </div>
        </div>

        <div class="sim-infinity-particles-172">
          <div class="sim-infinity-particle-172" v-for="i in 30" :key="i"></div>
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

interface MirrorCard {
  icon: string
  title: string
  description: string
}

const mirrorCards: MirrorCard[] = [
  {
    icon: '🪞',
    title: '反射',
    description: 'REFLECTION'
  },
  {
    icon: '🔮',
    title: '镜像',
    description: 'MIRROR'
  },
  {
    icon: '💎',
    title: '棱镜',
    description: 'PRISM'
  },
  {
    icon: '✨',
    title: '光辉',
    description: 'RADIANCE'
  }
]

let gsapCtx: gsap.Context

onMounted(() => {
  setTimeout(() => {
    if (!componentRoot.value) return

    gsapCtx = gsap.context(() => {
      const titleEl = gsap.utils.toArray<HTMLElement>('.sim-title-172', componentRoot.value)
      const subtitleEl = gsap.utils.toArray<HTMLElement>('.sim-subtitle-172', componentRoot.value)
      const mirrorTunnel = gsap.utils.toArray<HTMLElement>('.sim-mirror-tunnel-172', componentRoot.value)
      const stageEl = gsap.utils.toArray<HTMLElement>('.sim-mirrors-stage-172', componentRoot.value)
      const mirrorFrames = gsap.utils.toArray<HTMLElement>('.sim-mirror-frame-172', componentRoot.value)
      const mirrorCards = gsap.utils.toArray<HTMLElement>('.sim-mirror-card-172', componentRoot.value)
      const cardNumbers = gsap.utils.toArray<HTMLElement>('.sim-card-number-172', componentRoot.value)
      const cardIcons = gsap.utils.toArray<HTMLElement>('.sim-card-icon-172', componentRoot.value)
      const cardTitles = gsap.utils.toArray<HTMLElement>('.sim-card-title-172', componentRoot.value)
      const cardDescs = gsap.utils.toArray<HTMLElement>('.sim-card-desc-172', componentRoot.value)
      const cardShines = gsap.utils.toArray<HTMLElement>('.sim-card-shine-172', componentRoot.value)
      const infinityParticles = gsap.utils.toArray<HTMLElement>('.sim-infinity-particle-172', componentRoot.value)

      if (titleEl.length) {
        gsap.from(titleEl, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          y: 80,
          opacity: 0,
          scale: 0.9,
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

      if (mirrorTunnel.length) {
        gsap.from(mirrorTunnel, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          },
          scale: 0.5,
          opacity: 0,
          duration: 1.5,
          ease: 'power3.out'
        })
      }

      if (mirrorFrames.length) {
        mirrorFrames.forEach((frame, index) => {
          const scale = 1 - index * 0.1
          const opacity = 1 - index * 0.15

          gsap.fromTo(frame,
            {
              scale: scale * 0.8,
              opacity: 0
            },
            {
              scrollTrigger: {
                trigger: stageEl[0] || componentRoot.value,
                start: 'top 70%',
                toggleActions: 'play none none reverse'
              },
              scale: scale,
              opacity: opacity,
              duration: 1,
              delay: index * 0.1,
              ease: 'power3.out'
            }
          )

          gsap.to(frame, {
            rotate: index * 5,
            duration: 10 + index * 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
          })
        })
      }

      if (mirrorCards.length) {
        gsap.from(mirrorCards, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 65%',
            toggleActions: 'play none none reverse'
          },
          y: 80,
          opacity: 0,
          scale: 0.8,
          duration: 1,
          stagger: 0.2,
          delay: 0.5,
          ease: 'back.out(1.7)'
        })

        mirrorCards.forEach((card) => {
          gsap.to(card, {
            y: -15,
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: Math.random() * 2
          })
        })
      }

      if (cardNumbers.length) {
        gsap.from(cardNumbers, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 65%',
            toggleActions: 'play none none reverse'
          },
          scale: 0,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
          delay: 0.8,
          ease: 'back.out(2)'
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
          delay: 1,
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
          delay: 1.2,
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
          delay: 1.4,
          ease: 'power3.out'
        })
      }

      if (cardShines.length) {
        cardShines.forEach((shine) => {
          gsap.to(shine, {
            opacity: 0.8,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: 'power2.inOut',
            delay: Math.random() * 3
          })
        })
      }

      if (infinityParticles.length) {
        gsap.from(infinityParticles, {
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
          delay: 1.5,
          ease: 'elastic.out(1, 0.5)'
        })

        infinityParticles.forEach((particle) => {
          gsap.to(particle, {
            opacity: 0.3 + Math.random() * 0.7,
            duration: 3 + Math.random() * 4,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut',
            delay: Math.random() * 3
          })
        })
      }
    }, componentRoot.value)
  }, 100)
})

onUnmounted(() => {
  gsapCtx?.revert()
})
</script>

<style scoped lang="scss">
.sim-infinity-mirrors-section-172 {
  position: relative;
  min-height: 100vh;
  padding: 120px 20px;
  background: linear-gradient(180deg, #0a0a1a 0%, #151530 50%, #0a0a1a 100%);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(ellipse at 50% 50%, rgba(147, 51, 234, 0.15) 0%, transparent 60%),
      radial-gradient(ellipse at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
}

.sim-container-172 {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  z-index: 1;
}

.sim-title-172 {
  text-align: center;
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 900;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #c0c0c0, #e8e8e8, #ffffff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.sim-subtitle-172 {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(192, 192, 192, 0.6);
  margin-bottom: 80px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
}

.sim-mirrors-stage-172 {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 80px;
  padding: 60px 0;
}

.sim-mirror-tunnel-172 {
  position: relative;
  width: 400px;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1000px;
}

.sim-mirror-frame-172 {
  position: absolute;
  border: 3px solid rgba(192, 192, 192, 0.6);
  border-radius: 50%;
  box-shadow: 0 0 20px rgba(192, 192, 192, 0.4), inset 0 0 20px rgba(192, 192, 192, 0.2);
  transform-style: preserve-3d;

  &[data-depth="1"] { width: 100%; height: 100%; }
  &[data-depth="2"] { width: 90%; height: 90%; }
  &[data-depth="3"] { width: 80%; height: 80%; }
  &[data-depth="4"] { width: 70%; height: 70%; }
  &[data-depth="5"] { width: 60%; height: 60%; }
  &[data-depth="6"] { width: 50%; height: 50%; }
}

.sim-mirror-surface-172 {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(192, 192, 192, 0.3), rgba(232, 232, 232, 0.1));
  border-radius: 50%;
  backdrop-filter: blur(5px);
}

.sim-mirror-reflection-172 {
  position: absolute;
  inset: 10%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.2), transparent);
  border-radius: 50%;
  animation: reflectionPulse 3s ease-in-out infinite;
}

@keyframes reflectionPulse {
  0%, 100% { opacity: 0.3; transform: scale(0.95); }
  50% { opacity: 0.8; transform: scale(1.05); }
}

.sim-mirror-cards-172 {
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  max-width: 1200px;
}

.sim-mirror-card-172 {
  position: relative;
  background: rgba(10, 10, 30, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 35px;
  border: 2px solid rgba(192, 192, 192, 0.3);
  text-align: center;
  overflow: hidden;
  transition: border-color 0.4s ease, transform 0.4s ease;

  &:hover {
    border-color: rgba(192, 192, 192, 0.6);
    transform: translateY(-10px);
  }
}

.sim-card-reflection-172 {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.sim-reflection-layer-172 {
  position: absolute;
  inset: 10%;
  background: linear-gradient(135deg, rgba(192, 192, 192, 0.2), transparent);
  border-radius: 15px;
  transform: translateY(10px) scale(0.95);
  filter: blur(2px);
  opacity: 0.5;

  &:nth-child(2) {
    transform: translateY(20px) scale(0.9);
    opacity: 0.3;
  }

  &:nth-child(3) {
    transform: translateY(30px) scale(0.85);
    opacity: 0.15;
  }
}

.sim-card-content-172 {
  position: relative;
}

.sim-card-number-172 {
  position: absolute;
  top: -25px;
  left: 20px;
  font-size: 3rem;
  font-weight: 900;
  background: linear-gradient(135deg, #c0c0c0, #e8e8e8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  text-shadow: 0 0 20px rgba(192, 192, 192, 0.5);
}

.sim-card-icon-172 {
  font-size: 3.5rem;
  margin-bottom: 15px;
  filter: drop-shadow(0 0 20px rgba(192, 192, 192, 0.6));
}

.sim-card-title-172 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
  text-shadow: 0 0 20px rgba(192, 192, 192, 0.5);
}

.sim-card-desc-172 {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.sim-card-shine-172 {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  opacity: 0;
  pointer-events: none;
}

.sim-infinity-particles-172 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.sim-infinity-particle-172 {
  position: absolute;
  width: 4px;
  height: 4px;
  background: radial-gradient(circle, rgba(192, 192, 192, 0.8) 0%, transparent 70%);
  border-radius: 50%;
  top: 50%;
  left: 50%;
}

@media (max-width: 768px) {
  .sim-mirror-cards-172 {
    grid-template-columns: repeat(2, 1fr);
  }

  .sim-mirror-tunnel-172 {
    width: 280px;
    height: 280px;
  }

  .sim-card-icon-172 {
    font-size: 2.5rem;
  }

  .sim-card-number-172 {
    font-size: 2.5rem;
  }
}
</style>
