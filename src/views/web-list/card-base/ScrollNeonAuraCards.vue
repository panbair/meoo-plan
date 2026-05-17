<template>
  <div ref="componentRoot" class="neon-aura-section-229">
    <div class="nau-container-229">
      <h2 class="nau-title-229">霓虹光晕</h2>
      <p class="nau-subtitle-229">Neon Aura Cards</p>

      <div class="nau-aura-stage-229">
        <!-- 动态光晕背景 -->
        <div class="nau-aura-background-229">
          <div v-for="i in 5" :key="i" class="nau-aura-wave-229" :data-wave="i"></div>
        </div>

        <!-- 光晕粒子 -->
        <div class="nau-aura-particles-229">
          <div
            v-for="(particle, index) in particles"
            :key="index"
            class="nau-particle-229"
            :style="getParticleStyle(particle, index)"
          ></div>
        </div>

        <!-- 能量场 -->
        <div class="nau-energy-field-229">
          <div v-for="i in 3" :key="i" class="nau-energy-ring-229" :data-ring="i"></div>
        </div>

        <!-- 卡片网格 -->
        <div class="nau-cards-grid-229">
          <div
            v-for="(card, index) in cards"
            :key="index"
            :ref="
              el => {
                if (el) cardRefs[index] = el as HTMLElement
              }
            "
            class="nau-aura-card-229"
            :data-card="index"
            :style="{
              '--card-color': card.primaryColor,
              '--card-glow': card.glowColor,
              '--card-aura': card.auraColor
            }"
            @mousemove="handleCardHover($event, index)"
            @mouseleave="handleCardLeave(index)"
          >
            <!-- 光晕层 -->
            <div class="nau-card-aura-layer-229">
              <div class="nau-aura-inner-229"></div>
              <div class="nau-aura-outer-229"></div>
              <div class="nau-aura-glow-229"></div>
            </div>

            <!-- 脉冲光环 -->
            <div class="nau-pulse-ring-229"></div>

            <!-- 边框光效 -->
            <div class="nau-border-glow-229">
              <div v-for="i in 4" :key="i" class="nau-border-segment-229" :data-side="i"></div>
            </div>

            <!-- 卡片内容 -->
            <div class="nau-card-content-229">
              <div class="nau-card-number-229">
                <span class="nau-number-229">{{ String(index + 1).padStart(2, '0') }}</span>
                <div class="nau-number-glow-229"></div>
              </div>

              <div class="nau-card-icon-229">
                <div class="nau-icon-halo-229"></div>
                <span class="nau-icon-229">{{ card.icon }}</span>
              </div>

              <h3 class="nau-card-title-229">{{ card.title }}</h3>
              <p class="nau-card-desc-229">{{ card.description }}</p>

              <!-- 能量指示器 -->
              <div class="nau-energy-indicator-229">
                <div class="nau-energy-bar-229">
                  <div class="nau-energy-fill-229" :style="{ width: `${card.energy}%` }">
                    <div class="nau-energy-pulse-229"></div>
                  </div>
                </div>
                <span class="nau-energy-value-229">{{ card.energy }}%</span>
              </div>

              <!-- 标签 -->
              <div class="nau-card-tags-229">
                <span
                  class="nau-tag-229"
                  :style="{ borderColor: card.tagColor, color: card.tagColor }"
                >
                  {{ card.category }}
                </span>
                <span class="nau-power-badge-229">
                  {{ card.power }}
                </span>
              </div>
            </div>

            <!-- 底部光流 -->
            <div class="nau-light-flow-229">
              <div class="nau-flow-segment-229"></div>
            </div>
          </div>
        </div>

        <!-- 滚动提示 -->
        <div class="nau-scroll-hint-229">
          <div class="nau-hint-ring-229"></div>
          <div class="nau-hint-text-229">EXPLORE</div>
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

interface Card {
  icon: string
  title: string
  description: string
  category: string
  energy: number
  power: string
  primaryColor: string
  glowColor: string
  auraColor: string
  tagColor: string
}

const cards: Card[] = [
  {
    icon: '✨',
    title: '星光',
    description: 'Stellar Radiance',
    category: 'COSMIC',
    energy: 95,
    power: 'SS+',
    primaryColor: '#ffd700',
    glowColor: 'rgba(255, 215, 0, 0.7)',
    auraColor: 'rgba(255, 215, 0, 0.4)',
    tagColor: '#ffd700'
  },
  {
    icon: '🌊',
    title: '海潮',
    description: 'Ocean Tide',
    category: 'AQUATIC',
    energy: 88,
    power: 'S',
    primaryColor: '#00d4ff',
    glowColor: 'rgba(0, 212, 255, 0.7)',
    auraColor: 'rgba(0, 212, 255, 0.4)',
    tagColor: '#00d4ff'
  },
  {
    icon: '🌸',
    title: '樱花',
    description: 'Cherry Blossom',
    category: 'FLORAL',
    energy: 85,
    power: 'A+',
    primaryColor: '#ff69b4',
    glowColor: 'rgba(255, 105, 180, 0.7)',
    auraColor: 'rgba(255, 105, 180, 0.4)',
    tagColor: '#ff69b4'
  },
  {
    icon: '💜',
    title: '紫晶',
    description: 'Amethyst',
    category: 'MYSTIC',
    energy: 92,
    power: 'S+',
    primaryColor: '#9b59b6',
    glowColor: 'rgba(155, 89, 182, 0.7)',
    auraColor: 'rgba(155, 89, 182, 0.4)',
    tagColor: '#9b59b6'
  },
  {
    icon: '🔥',
    title: '烈焰',
    description: 'Blazing Fire',
    category: 'INFERNO',
    energy: 96,
    power: 'SSS',
    primaryColor: '#ff4500',
    glowColor: 'rgba(255, 69, 0, 0.7)',
    auraColor: 'rgba(255, 69, 0, 0.4)',
    tagColor: '#ff4500'
  },
  {
    icon: '💎',
    title: '钻石',
    description: 'Diamond',
    category: 'CRYSTAL',
    energy: 98,
    power: 'SSS',
    primaryColor: '#00ff88',
    glowColor: 'rgba(0, 255, 136, 0.7)',
    auraColor: 'rgba(0, 255, 136, 0.4)',
    tagColor: '#00ff88'
  }
]

interface Particle {
  x: number
  y: number
  size: number
  speed: number
  delay: number
  opacity: number
}

const particles: Particle[] = Array.from({ length: 35 }, () => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 2 + Math.random() * 5,
  speed: 6 + Math.random() * 12,
  delay: Math.random() * 6,
  opacity: 0.3 + Math.random() * 0.5
}))

const getParticleStyle = (particle: Particle, index: number) => {
  const colors = ['#ffd700', '#00d4ff', '#ff69b4', '#9b59b6', '#ff4500', '#00ff88']
  return {
    left: `${particle.x}%`,
    top: `${particle.y}%`,
    width: `${particle.size}px`,
    height: `${particle.size}px`,
    background: `radial-gradient(circle, ${colors[index % colors.length]} 0%, transparent 70%)`,
    opacity: particle.opacity,
    animationDelay: `${particle.delay}s`
  }
}

let ctx: gsap.Context
const eventListeners: Array<{ element: HTMLElement; event: string; handler: () => void }> = []

const handleCardHover = (event: MouseEvent, index: number) => {
  const card = cardRefs.value[index]
  if (!card) return

  const rect = card.getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  const y = ((event.clientY - rect.top) / rect.height) * 2 - 1

  // 3D旋转
  gsap.to(card, {
    rotateY: x * 12,
    rotateX: -y * 12,
    scale: 1.06,
    duration: 0.4,
    ease: 'power2.out'
  })

  // 光晕增强
  const auraInner = card.querySelector('.nau-aura-inner-229') as HTMLElement
  const auraOuter = card.querySelector('.nau-aura-outer-229') as HTMLElement
  const auraGlow = card.querySelector('.nau-aura-glow-229') as HTMLElement

  if (auraInner) {
    gsap.to(auraInner, {
      opacity: 0.8,
      scale: 1.3,
      duration: 0.4,
      ease: 'power2.out'
    })
  }
  if (auraOuter) {
    gsap.to(auraOuter, {
      opacity: 0.5,
      scale: 1.5,
      duration: 0.4,
      ease: 'power2.out'
    })
  }
  if (auraGlow) {
    gsap.to(auraGlow, {
      opacity: 0.9,
      scale: 1.4,
      duration: 0.4,
      ease: 'power2.out'
    })
  }

  // 脉冲环加速
  const pulseRing = card.querySelector('.nau-pulse-ring-229') as HTMLElement
  if (pulseRing) {
    gsap.to(pulseRing, {
      opacity: 0.6,
      scale: 1.8,
      duration: 0.4,
      ease: 'power2.out'
    })
  }

  // 边框高亮
  const borderSegments = card.querySelectorAll('.nau-border-segment-229')
  borderSegments.forEach((segment, i) => {
    gsap.to(segment, {
      opacity: 1,
      duration: 0.3,
      delay: i * 0.05,
      ease: 'power2.out'
    })
  })

  // 图标光环
  const iconHalo = card.querySelector('.nau-icon-halo-229') as HTMLElement
  if (iconHalo) {
    gsap.to(iconHalo, {
      scale: 1.5,
      opacity: 0.9,
      duration: 0.4,
      ease: 'elastic.out(1, 0.5)'
    })
  }

  // 能量条增强
  const energyFill = card.querySelector('.nau-energy-fill-229') as HTMLElement
  if (energyFill) {
    gsap.to(energyFill, {
      filter: 'brightness(1.4) drop-shadow(0 0 8px currentColor)',
      duration: 0.3,
      ease: 'power2.out'
    })
  }
}

const handleCardLeave = (index: number) => {
  const card = cardRefs.value[index]
  if (!card) return

  // 3D旋转复位
  gsap.to(card, {
    rotateY: 0,
    rotateX: 0,
    scale: 1,
    duration: 0.6,
    ease: 'power3.out'
  })

  // 光晕复位
  const auraInner = card.querySelector('.nau-aura-inner-229') as HTMLElement
  const auraOuter = card.querySelector('.nau-aura-outer-229') as HTMLElement
  const auraGlow = card.querySelector('.nau-aura-glow-229') as HTMLElement

  if (auraInner) {
    gsap.to(auraInner, {
      opacity: 0.4,
      scale: 1,
      duration: 0.6,
      ease: 'power3.out'
    })
  }
  if (auraOuter) {
    gsap.to(auraOuter, {
      opacity: 0.2,
      scale: 1,
      duration: 0.6,
      ease: 'power3.out'
    })
  }
  if (auraGlow) {
    gsap.to(auraGlow, {
      opacity: 0.3,
      scale: 1,
      duration: 0.6,
      ease: 'power3.out'
    })
  }

  // 脉冲环复位
  const pulseRing = card.querySelector('.nau-pulse-ring-229') as HTMLElement
  if (pulseRing) {
    gsap.to(pulseRing, {
      opacity: 0.3,
      scale: 1,
      duration: 0.6,
      ease: 'power3.out'
    })
  }

  // 边框复位
  const borderSegments = card.querySelectorAll('.nau-border-segment-229')
  borderSegments.forEach(segment => {
    gsap.to(segment, {
      opacity: 0.4,
      duration: 0.6,
      ease: 'power3.out'
    })
  })

  // 图标光环复位
  const iconHalo = card.querySelector('.nau-icon-halo-229') as HTMLElement
  if (iconHalo) {
    gsap.to(iconHalo, {
      scale: 1,
      opacity: 0.4,
      duration: 0.6,
      ease: 'power3.out'
    })
  }

  // 能量条复位
  const energyFill = card.querySelector('.nau-energy-fill-229') as HTMLElement
  if (energyFill) {
    gsap.to(energyFill, {
      filter: 'none',
      duration: 0.6,
      ease: 'power3.out'
    })
  }
}

onMounted(() => {
  ctx = gsap.context(() => {
    const titleEl = gsap.utils.toArray<HTMLElement>('.nau-title-229', componentRoot.value)
    const subtitleEl = gsap.utils.toArray<HTMLElement>('.nau-subtitle-229', componentRoot.value)
    const stageEl = gsap.utils.toArray<HTMLElement>('.nau-aura-stage-229', componentRoot.value)
    const cards = gsap.utils.toArray<HTMLElement>('.nau-aura-card-229', componentRoot.value)
    const auraWaves = gsap.utils.toArray<HTMLElement>('.nau-aura-wave-229', componentRoot.value)
    const particles = gsap.utils.toArray<HTMLElement>('.nau-particle-229', componentRoot.value)
    const energyRings = gsap.utils.toArray<HTMLElement>('.nau-energy-ring-229', componentRoot.value)
    const cardNumbers = gsap.utils.toArray<HTMLElement>('.nau-number-229', componentRoot.value)
    const cardIcons = gsap.utils.toArray<HTMLElement>('.nau-icon-229', componentRoot.value)
    const cardTitles = gsap.utils.toArray<HTMLElement>('.nau-card-title-229', componentRoot.value)
    const cardDescs = gsap.utils.toArray<HTMLElement>('.nau-card-desc-229', componentRoot.value)
    const energyBars = gsap.utils.toArray<HTMLElement>('.nau-energy-fill-229', componentRoot.value)
    const lightFlows = gsap.utils.toArray<HTMLElement>('.nau-light-flow-229', componentRoot.value)

    // 标题动画
    if (titleEl.length) {
      gsap.from(titleEl, {
        scrollTrigger: {
          trigger: componentRoot.value,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        y: 80,
        opacity: 0,
        scale: 0.9,
        duration: 1.2,
        ease: 'elastic.out(1, 0.6)'
      })
    }

    // 标题光晕脉冲
    gsap.to(titleEl, {
      filter: 'drop-shadow(0 0 30px var(--card-color))',
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })

    if (subtitleEl.length) {
      gsap.from(subtitleEl, {
        scrollTrigger: {
          trigger: componentRoot.value,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        y: 40,
        opacity: 0,
        duration: 1,
        delay: 0.2,
        ease: 'power3.out'
      })
    }

    // 光晕背景动画
    if (auraWaves.length) {
      auraWaves.forEach((wave, index) => {
        gsap.from(wave, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          },
          scale: 0,
          opacity: 0,
          duration: 1.8,
          delay: index * 0.15,
          ease: 'back.out(1.8)'
        })

        // 光晕持续波动
        gsap.to(wave, {
          x: '15%',
          duration: 10 + index * 3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        })
      })
    }

    // 粒子动画
    if (particles.length) {
      gsap.from(particles, {
        scrollTrigger: {
          trigger: stageEl[0] || componentRoot.value,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        scale: 0,
        opacity: 0,
        duration: 1.2,
        stagger: {
          each: 0.05,
          from: 'random'
        },
        ease: 'back.out(1.6)'
      })

      // 粒子持续飘浮
      particles.forEach(particle => {
        const yMove = -60 - Math.random() * 120
        gsap.to(particle, {
          y: yMove,
          opacity: 0,
          duration: 10 + Math.random() * 6,
          repeat: -1,
          ease: 'none'
        })
      })
    }

    // 能量场动画
    if (energyRings.length) {
      gsap.from(energyRings, {
        scrollTrigger: {
          trigger: stageEl[0] || componentRoot.value,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        scale: 0,
        opacity: 0,
        rotation: -180,
        duration: 1.6,
        stagger: 0.2,
        ease: 'elastic.out(1, 0.5)'
      })

      // 能量环持续旋转
      energyRings.forEach((ring, index) => {
        gsap.to(ring, {
          rotation: 360,
          duration: 20 + index * 6,
          repeat: -1,
          ease: 'none',
          direction: index % 2 === 0 ? 1 : -1
        })
      })
    }

    // 卡片入场动画
    if (cards.length) {
      gsap.from(cards, {
        scrollTrigger: {
          trigger: stageEl[0] || componentRoot.value,
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        },
        y: 120,
        opacity: 0,
        scale: 0.7,
        rotationX: 45,
        duration: 1.2,
        stagger: 0.15,
        ease: 'back.out(1.7)'
      })

      // 卡片持续悬浮
      cards.forEach((card, index) => {
        gsap.to(card, {
          y: -10,
          duration: 2.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: index * 0.25
        })
      })
    }

    // 卡片元素动画
    if (cardNumbers.length) {
      gsap.from(cardNumbers, {
        scrollTrigger: {
          trigger: stageEl[0] || componentRoot.value,
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        },
        x: -40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        delay: 0.6,
        ease: 'power3.out'
      })
    }

    if (cardIcons.length) {
      gsap.from(cardIcons, {
        scrollTrigger: {
          trigger: stageEl[0] || componentRoot.value,
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        },
        scale: 0,
        rotation: -180,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        delay: 0.8,
        ease: 'elastic.out(1, 0.5)'
      })

      // 图标持续脉动
      cardIcons.forEach(icon => {
        gsap.to(icon, {
          scale: 1.1,
          filter: 'brightness(1.3)',
          duration: 0.8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        })
      })
    }

    if (cardTitles.length) {
      gsap.from(cardTitles, {
        scrollTrigger: {
          trigger: stageEl[0] || componentRoot.value,
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        },
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        delay: 1.0,
        ease: 'power3.out'
      })
    }

    if (cardDescs.length) {
      gsap.from(cardDescs, {
        scrollTrigger: {
          trigger: stageEl[0] || componentRoot.value,
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        },
        y: 25,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        delay: 1.2,
        ease: 'power3.out'
      })
    }

    // 能量条动画
    if (energyBars.length) {
      gsap.fromTo(
        energyBars,
        { width: 0 },
        {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 65%',
            toggleActions: 'play none none reverse'
          },
          width: index =>
            `${cards[index as number]?.getAttribute('data-card') ? (cards[index as number] as HTMLElement) : '0'}%`,
          duration: 1.1,
          stagger: 0.15,
          delay: 1.4,
          ease: 'elastic.out(1, 0.6)'
        }
      )
    }

    // 光流动画
    if (lightFlows.length) {
      gsap.from(lightFlows, {
        scrollTrigger: {
          trigger: stageEl[0] || componentRoot.value,
          start: 'top 65%',
          toggleActions: 'play none none reverse'
        },
        scaleX: 0,
        duration: 0.9,
        stagger: 0.15,
        delay: 1.6,
        ease: 'power3.out'
      })

      // 光流持续流动
      const flowSegments = gsap.utils.toArray<HTMLElement>(
        '.nau-flow-segment-229',
        componentRoot.value
      )
      flowSegments.forEach(segment => {
        gsap.to(segment, {
          x: '100%',
          duration: 1.8,
          repeat: -1,
          ease: 'power2.inOut'
        })
      })
    }

    // 滚动控制光晕强度
    if (stageEl.length) {
      ScrollTrigger.create({
        trigger: stageEl[0],
        start: 'top 85%',
        end: 'bottom 20%',
        onUpdate: self => {
          const progress = self.progress

          // 卡片光晕随滚动增强
          cards.forEach(card => {
            const auraGlow = card.querySelector('.nau-aura-glow-229') as HTMLElement
            if (auraGlow) {
              gsap.to(auraGlow, {
                opacity: 0.2 + progress * 0.4,
                scale: 1 + progress * 0.3,
                duration: 0.3,
                ease: 'power1.out'
              })
            }
          })

          // 能量环旋转加速
          energyRings.forEach((ring, index) => {
            const currentRotation = gsap.getProperty(ring, 'rotation') as number
            gsap.to(ring, {
              rotation: currentRotation + (1 + progress * 3) * (index % 2 === 0 ? 1 : -1),
              duration: 0.3,
              ease: 'none'
            })
          })
        }
      })
    }
  }, componentRoot.value)
})

onUnmounted(() => {
  ctx?.revert()
  eventListeners.forEach(({ element, event, handler }) => {
    element.removeEventListener(event, handler)
  })
  eventListeners.length = 0
})
</script>

<style scoped lang="scss">
.neon-aura-section-229 {
  min-height: 100vh;
  padding: 100px 20px;
  background: linear-gradient(180deg, #080815 0%, #101025 30%, #080815 60%, #101025 100%);
  position: relative;
  overflow: hidden;
}

.nau-container-229 {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  z-index: 1;
}

.nau-title-229 {
  text-align: center;
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 900;
  margin-bottom: 15px;
  background: linear-gradient(135deg, #ffd700, #ff69b4, #9b59b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.1em;
}

.nau-subtitle-229 {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(255, 215, 0, 0.8);
  margin-bottom: 90px;
  letter-spacing: 0.6em;
  text-transform: uppercase;
}

.nau-aura-stage-229 {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 2000px;
}

/* 光晕背景 */
.nau-aura-background-229 {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.nau-aura-wave-229 {
  position: absolute;
  width: 140%;
  height: 100%;
  top: 0;
  left: -20%;
  opacity: 0.12;

  &[data-wave='1'] {
    background: radial-gradient(ellipse at 30% 50%, #ffd70020, transparent 60%);
  }

  &[data-wave='2'] {
    background: radial-gradient(ellipse at 70% 30%, #ff69b420, transparent 60%);
    top: 20%;
  }

  &[data-wave='3'] {
    background: radial-gradient(ellipse at 50% 80%, #9b59b620, transparent 60%);
    top: 40%;
  }

  &[data-wave='4'] {
    background: radial-gradient(ellipse at 20% 70%, #ff450020, transparent 60%);
    top: 60%;
  }

  &[data-wave='5'] {
    background: radial-gradient(ellipse at 80% 60%, #00d4ff20, transparent 60%);
    top: 30%;
  }
}

/* 粒子 */
.nau-aura-particles-229 {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.nau-particle-229 {
  position: absolute;
  border-radius: 50%;
  filter: blur(1.5px);
}

/* 能量场 */
.nau-energy-field-229 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.nau-energy-ring-229 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;

  &[data-ring='1'] {
    width: 600px;
    height: 600px;
    border: 2px solid rgba(255, 215, 0, 0.15);
    border-style: dashed;
  }

  &[data-ring='2'] {
    width: 800px;
    height: 800px;
    border: 2px solid rgba(255, 105, 180, 0.1);
  }

  &[data-ring='3'] {
    width: 1000px;
    height: 1000px;
    border: 1px solid rgba(155, 89, 182, 0.08);
  }
}

/* 卡片网格 */
.nau-cards-grid-229 {
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 40px;
  max-width: 1200px;
  z-index: 2;
  padding: 40px 0;
}

.nau-aura-card-229 {
  position: relative;
  min-height: 420px;
  background: rgba(12, 12, 28, 0.85);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  overflow: hidden;
  cursor: pointer;
  transform-style: preserve-3d;
  border: 1px solid var(--card-color);
  transition: border-color 0.5s ease;

  &:hover {
    border-color: var(--card-glow);
    opacity: 1;
  }
}

/* 光晕层 */
.nau-card-aura-layer-229 {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.nau-aura-inner-229 {
  position: absolute;
  inset: -40px;
  opacity: 0.4;
  filter: blur(60px);
  background: radial-gradient(circle, var(--card-aura) 0%, transparent 60%);
  transition: all 0.4s ease;
}

.nau-aura-outer-229 {
  position: absolute;
  inset: -80px;
  opacity: 0.2;
  filter: blur(100px);
  background: radial-gradient(circle, var(--card-glow) 0%, transparent 70%);
  transition: all 0.4s ease;
}

.nau-aura-glow-229 {
  position: absolute;
  inset: -20px;
  opacity: 0.3;
  filter: blur(50px);
  background: radial-gradient(circle, var(--card-glow) 0%, transparent 50%);
  transition: all 0.4s ease;
}

/* 脉冲环 */
.nau-pulse-ring-229 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 280px;
  height: 280px;
  border-radius: 50%;
  border: 2px solid var(--card-color);
  opacity: 0.3;
  filter: blur(2px);
  transition: all 0.4s ease;
}

/* 边框光效 */
.nau-border-glow-229 {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.nau-border-segment-229 {
  position: absolute;
  opacity: 0.4;
  transition: all 0.3s ease;

  &[data-side='1'] {
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--card-color), transparent);
  }

  &[data-side='2'] {
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--card-color), transparent);
  }

  &[data-side='3'] {
    left: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(180deg, transparent, var(--card-color), transparent);
  }

  &[data-side='4'] {
    right: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(180deg, transparent, var(--card-color), transparent);
  }
}

/* 卡片内容 */
.nau-card-content-229 {
  position: relative;
  z-index: 2;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  height: 100%;
  opacity: 1;
}

.nau-card-number-229 {
  position: absolute;
  top: 20px;
  left: 25px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.nau-number-229 {
  font-size: 2.8rem;
  font-weight: 900;
  background: linear-gradient(135deg, var(--card-color), var(--card-glow));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  filter: drop-shadow(0 0 15px var(--card-glow));
}

.nau-number-glow-229 {
  width: 40px;
  height: 2px;
  background: linear-gradient(90deg, var(--card-color), transparent);
}

.nau-card-icon-229 {
  position: relative;
  font-size: 4.2rem;
  margin-bottom: 25px;
  filter: drop-shadow(0 0 30px var(--card-glow));
}

.nau-icon-halo-229 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--card-color) 30 0%, transparent 70%);
  opacity: 0.4;
  transition: all 0.4s ease;
}

.nau-card-title-229 {
  font-size: 1.7rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  text-shadow: 0 0 20px var(--card-glow);
}

.nau-card-desc-229 {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  margin-bottom: 30px;
  line-height: 1.6;
}

/* 能量指示器 */
.nau-energy-indicator-229 {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
}

.nau-energy-bar-229 {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
  position: relative;
}

.nau-energy-fill-229 {
  height: 100%;
  background: linear-gradient(90deg, var(--card-color), var(--card-glow));
  border-radius: 3px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.nau-energy-pulse-229 {
  position: absolute;
  top: 0;
  left: 0;
  width: 50px;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.9), transparent);
  animation: energyPulse 2s linear infinite;
}

@keyframes energyPulse {
  to {
    transform: translateX(300%);
  }
}

.nau-energy-value-229 {
  font-size: 1.3rem;
  font-weight: 800;
  background: linear-gradient(135deg, #ffd700, #ff69b4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  min-width: 50px;
}

/* 标签 */
.nau-card-tags-229 {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  margin-top: auto;
}

.nau-tag-229 {
  padding: 8px 18px;
  border: 1px solid;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  display: inline-block;
  align-self: center;
  background: rgba(0, 0, 0, 0.4);
}

.nau-power-badge-229 {
  padding: 6px 16px;
  border-radius: 15px;
  font-size: 0.85rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  background: linear-gradient(135deg, var(--card-color), var(--card-glow));
  color: #000;
  display: inline-block;
  align-self: center;
}

/* 光流 */
.nau-light-flow-229 {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  overflow: hidden;
}

.nau-flow-segment-229 {
  position: absolute;
  top: 0;
  left: 0;
  width: 80px;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.95), transparent);
}

/* 滚动提示 */
.nau-scroll-hint-229 {
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  z-index: 3;
}

.nau-hint-ring-229 {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid rgba(255, 215, 0, 0.6);
  animation: hintRingPulse 2s ease-in-out infinite;
}

@keyframes hintRingPulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.3);
    opacity: 0;
  }
}

.nau-hint-text-229 {
  font-size: 0.75rem;
  color: rgba(255, 215, 0, 0.8);
  letter-spacing: 0.4em;
  text-transform: uppercase;
}

@media (max-width: 768px) {
  .nau-cards-grid-229 {
    grid-template-columns: 1fr;
    gap: 35px;
  }

  .nau-aura-card-229 {
    min-height: 380px;
    opacity: 1;
  }

  .nau-card-icon-229 {
    font-size: 3.4rem;
  }

  .nau-card-title-229 {
    font-size: 1.4rem;
  }

  .nau-number-229 {
    font-size: 2rem;
  }

  .nau-energy-ring-229 {
    &[data-ring='1'] {
      width: 300px;
      height: 300px;
    }

    &[data-ring='2'] {
      width: 400px;
      height: 400px;
    }

    &[data-ring='3'] {
      width: 500px;
      height: 500px;
    }
  }
}
</style>
