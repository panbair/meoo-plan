<template>
  <div class="snee-neon-eclipse-section-227" ref="componentRoot">
    <div class="snee-container-227">
      <h2 class="snee-title-227">霓虹蚀光</h2>
      <p class="snee-subtitle-227">Neon Eclipse Cards</p>

      <div class="snee-eclipse-stage-227">
        <!-- 背景光效层 -->
        <div class="snee-background-glow-227">
          <div class="snee-glow-orb-227" v-for="i in 6" :key="i" :style="getGlowStyle(i)"></div>
        </div>

        <!-- 粒子系统 -->
        <div class="snee-particles-227">
          <div
            v-for="(particle, index) in particles"
            :key="index"
            class="snee-particle-227"
            :style="getParticleStyle(particle, index)"
          ></div>
        </div>

        <!-- 蚀光环 -->
        <div class="snee-eclipse-ring-227">
          <div class="snee-ring-227" v-for="i in 3" :key="i" :data-ring="i"></div>
        </div>

        <!-- 卡片网格 -->
        <div class="snee-cards-grid-227">
          <div
            v-for="(card, index) in cards"
            :key="index"
            class="snee-eclipse-card-227"
            :ref="el => { if (el) cardRefs[index] = el as HTMLElement }"
            :data-card="index"
            @mousemove="handleCardHover($event, index)"
            @mouseleave="handleCardLeave(index)"
          >
            <!-- 卡片光晕 -->
            <div class="snee-card-aura-227" :style="{ background: card.auraColor }"></div>
            <div class="snee-card-glow-227" :style="{ background: card.glowColor }"></div>

            <!-- 蚀光效果层 -->
            <div class="snee-eclipse-layer-227">
              <div class="snee-eclipse-mask-227"></div>
              <div class="snee-eclipse-shine-227"></div>
            </div>

            <!-- 3D边框效果 -->
            <div class="snee-border-glow-227">
              <div class="snee-border-segment-227" v-for="i in 4" :key="i" :data-side="i"></div>
            </div>

            <!-- 卡片内容 -->
            <div class="snee-card-content-227">
              <div class="snee-card-number-227">
                <span class="snee-number-227">{{ String(index + 1).padStart(2, '0') }}</span>
                <div class="snee-number-line-227"></div>
              </div>

              <div class="snee-card-icon-227" :style="{ color: card.iconColor }">
                {{ card.icon }}
              </div>

              <h3 class="snee-card-title-227">{{ card.title }}</h3>
              <p class="snee-card-desc-227">{{ card.description }}</p>

              <div class="snee-card-meta-227">
                <span class="snee-meta-tag-227" :style="{ borderColor: card.tagColor, color: card.tagColor }">
                  {{ card.category }}
                </span>
                <span class="snee-meta-stat-227">
                  <span class="snee-stat-value-227">{{ card.stat }}</span>
                  <span class="snee-stat-label-227">点能量</span>
                </span>
              </div>
            </div>

            <!-- 底部霓虹条 -->
            <div class="snee-neon-bar-227" :style="{ background: card.neonColor }">
              <div class="snee-neon-pulse-227"></div>
            </div>
          </div>
        </div>

        <!-- 滚动指示器 -->
        <div class="snee-scroll-indicator-227">
          <div class="snee-indicator-line-227"></div>
          <div class="snee-indicator-text-227">SCROLL</div>
          <div class="snee-indicator-arrow-227"></div>
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
  stat: number
  auraColor: string
  glowColor: string
  iconColor: string
  tagColor: string
  neonColor: string
}

const cards: Card[] = [
  {
    icon: '⚡',
    title: '闪电',
    description: 'Lightning Flash',
    category: 'ELECTRIC',
    stat: 98,
    auraColor: 'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)',
    glowColor: 'radial-gradient(circle, rgba(236, 72, 153, 0.6) 0%, transparent 50%)',
    iconColor: '#ec4899',
    tagColor: '#ec4899',
    neonColor: 'linear-gradient(90deg, #ec4899, #f97316)'
  },
  {
    icon: '🔥',
    title: '烈焰',
    description: 'Blazing Fire',
    category: 'INFERNO',
    stat: 95,
    auraColor: 'radial-gradient(circle, rgba(249, 115, 22, 0.3) 0%, transparent 70%)',
    glowColor: 'radial-gradient(circle, rgba(249, 115, 22, 0.6) 0%, transparent 50%)',
    iconColor: '#f97316',
    tagColor: '#f97316',
    neonColor: 'linear-gradient(90deg, #f97316, #eab308)'
  },
  {
    icon: '💎',
    title: '水晶',
    description: 'Crystal Prism',
    category: 'PRISM',
    stat: 92,
    auraColor: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
    glowColor: 'radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, transparent 50%)',
    iconColor: '#3b82f6',
    tagColor: '#3b82f6',
    neonColor: 'linear-gradient(90deg, #3b82f6, #06b6d4)'
  },
  {
    icon: '🌊',
    title: '波涛',
    description: 'Tidal Wave',
    category: 'AQUATIC',
    stat: 89,
    auraColor: 'radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, transparent 70%)',
    glowColor: 'radial-gradient(circle, rgba(6, 182, 212, 0.6) 0%, transparent 50%)',
    iconColor: '#06b6d4',
    tagColor: '#06b6d4',
    neonColor: 'linear-gradient(90deg, #06b6d4, #10b981)'
  },
  {
    icon: '🌌',
    title: '星云',
    description: 'Nebula Dust',
    category: 'COSMIC',
    stat: 87,
    auraColor: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
    glowColor: 'radial-gradient(circle, rgba(139, 92, 246, 0.6) 0%, transparent 50%)',
    iconColor: '#8b5cf6',
    tagColor: '#8b5cf6',
    neonColor: 'linear-gradient(90deg, #8b5cf6, #d946ef)'
  },
  {
    icon: '🌟',
    title: '星光',
    description: 'Starlight',
    category: 'STELLAR',
    stat: 85,
    auraColor: 'radial-gradient(circle, rgba(251, 191, 36, 0.3) 0%, transparent 70%)',
    glowColor: 'radial-gradient(circle, rgba(251, 191, 36, 0.6) 0%, transparent 50%)',
    iconColor: '#fbbf24',
    tagColor: '#fbbf24',
    neonColor: 'linear-gradient(90deg, #fbbf24, #f97316)'
  }
]

interface Particle {
  x: number
  y: number
  size: number
  speed: number
  delay: number
}

const particles: Particle[] = Array.from({ length: 30 }, () => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 2 + Math.random() * 4,
  speed: 10 + Math.random() * 20,
  delay: Math.random() * 5
}))

const getGlowStyle = (index: number) => {
  const colors = ['#ec4899', '#f97316', '#3b82f6', '#06b6d4', '#8b5cf6', '#fbbf24']
  const positions = [
    { top: '10%', left: '15%' },
    { top: '20%', right: '20%' },
    { top: '60%', left: '10%' },
    { bottom: '15%', right: '15%' },
    { top: '40%', left: '60%' },
    { bottom: '30%', left: '40%' }
  ]
  return {
    ...positions[index - 1],
    background: `radial-gradient(circle, ${colors[index - 1]}33 0%, transparent 50%)`
  }
}

const getParticleStyle = (particle: Particle, index: number) => {
  const colors = ['#ec4899', '#f97316', '#3b82f6', '#06b6d4', '#8b5cf6', '#fbbf24']
  return {
    left: `${particle.x}%`,
    top: `${particle.y}%`,
    width: `${particle.size}px`,
    height: `${particle.size}px`,
    background: `radial-gradient(circle, ${colors[index % colors.length]} 0%, transparent 70%)`,
    animationDelay: `${particle.delay}s`
  }
}

let ctx: gsap.Context

const handleCardHover = (event: MouseEvent, index: number) => {
  const card = cardRefs.value[index]
  if (!card) return

  const rect = card.getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  const y = ((event.clientY - rect.top) / rect.height) * 2 - 1

  gsap.to(card, {
    rotateY: x * 12,
    rotateX: -y * 12,
    scale: 1.05,
    duration: 0.4,
    ease: 'power2.out'
  })

  const aura = card.querySelector('.snee-card-aura-227') as HTMLElement
  if (aura) {
    gsap.to(aura, {
      opacity: 0.6,
      scale: 1.3,
      duration: 0.4,
      ease: 'power2.out'
    })
  }

  const glow = card.querySelector('.snee-card-glow-227') as HTMLElement
  if (glow) {
    gsap.to(glow, {
      opacity: 0.8,
      scale: 1.5,
      duration: 0.4,
      ease: 'power2.out'
    })
  }

  const eclipseMask = card.querySelector('.snee-eclipse-mask-227') as HTMLElement
  if (eclipseMask) {
    gsap.to(eclipseMask, {
      x: x * 30,
      y: y * 30,
      duration: 0.4,
      ease: 'power2.out'
    })
  }

  const borderSegments = card.querySelectorAll('.snee-border-segment-227')
  borderSegments.forEach((segment, i) => {
    gsap.to(segment, {
      opacity: 0.8,
      scale: 1.1,
      duration: 0.3,
      delay: i * 0.05,
      ease: 'power2.out'
    })
  })
}

const handleCardLeave = (index: number) => {
  const card = cardRefs.value[index]
  if (!card) return

  gsap.to(card, {
    rotateY: 0,
    rotateX: 0,
    scale: 1,
    duration: 0.5,
    ease: 'power2.out'
  })

  const aura = card.querySelector('.snee-card-aura-227') as HTMLElement
  if (aura) {
    gsap.to(aura, {
      opacity: 0.3,
      scale: 1,
      duration: 0.5,
      ease: 'power2.out'
    })
  }

  const glow = card.querySelector('.snee-card-glow-227') as HTMLElement
  if (glow) {
    gsap.to(glow, {
      opacity: 0.4,
      scale: 1,
      duration: 0.5,
      ease: 'power2.out'
    })
  }

  const eclipseMask = card.querySelector('.snee-eclipse-mask-227') as HTMLElement
  if (eclipseMask) {
    gsap.to(eclipseMask, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'power2.out'
    })
  }

  const borderSegments = card.querySelectorAll('.snee-border-segment-227')
  borderSegments.forEach((segment) => {
    gsap.to(segment, {
      opacity: 0.4,
      scale: 1,
      duration: 0.5,
      ease: 'power2.out'
    })
  })
}

onMounted(() => {
  setTimeout(() => {
    if (!componentRoot.value) return

    ctx = gsap.context(() => {
      const titleEl = gsap.utils.toArray<HTMLElement>('.snee-title-227', componentRoot.value)
      const subtitleEl = gsap.utils.toArray<HTMLElement>('.snee-subtitle-227', componentRoot.value)
      const stageEl = gsap.utils.toArray<HTMLElement>('.snee-eclipse-stage-227', componentRoot.value)
      const cards = gsap.utils.toArray<HTMLElement>('.snee-eclipse-card-227', componentRoot.value)
      const rings = gsap.utils.toArray<HTMLElement>('.snee-ring-227', componentRoot.value)
      const glowOrbs = gsap.utils.toArray<HTMLElement>('.snee-glow-orb-227', componentRoot.value)
      const particles = gsap.utils.toArray<HTMLElement>('.snee-particle-227', componentRoot.value)
      const cardNumbers = gsap.utils.toArray<HTMLElement>('.snee-number-227', componentRoot.value)
      const cardIcons = gsap.utils.toArray<HTMLElement>('.snee-card-icon-227', componentRoot.value)
      const cardTitles = gsap.utils.toArray<HTMLElement>('.snee-card-title-227', componentRoot.value)
      const cardDescs = gsap.utils.toArray<HTMLElement>('.snee-card-desc-227', componentRoot.value)
      const cardMetas = gsap.utils.toArray<HTMLElement>('.snee-card-meta-227', componentRoot.value)
      const neonBars = gsap.utils.toArray<HTMLElement>('.snee-neon-bar-227', componentRoot.value)
      const neonPulses = gsap.utils.toArray<HTMLElement>('.snee-neon-pulse-227', componentRoot.value)

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
          scale: 0.9,
          rotationX: -30,
          duration: 1.4,
          ease: 'power4.out'
        })

        // 标题霓虹闪烁
        gsap.to(titleEl, {
          filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 0.8)) drop-shadow(0 0 40px rgba(249, 115, 22, 0.5))',
          duration: 0.6,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut'
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

      // 背景光晕动画
      if (glowOrbs.length) {
        gsap.from(glowOrbs, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          },
          scale: 0,
          opacity: 0,
          duration: 1.5,
          stagger: {
            each: 0.15,
            from: 'random'
          },
          ease: 'elastic.out(1, 0.5)'
        })

        // 光晕持续脉动
        glowOrbs.forEach((orb: HTMLElement) => {
          gsap.to(orb, {
            scale: 1.3,
            opacity: 0.6,
            duration: 3,
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
            each: 0.08,
            from: 'random'
          },
          ease: 'back.out(1.7)'
        })

        // 粒子持续飘浮
        particles.forEach((particle: HTMLElement) => {
          const yMove = -100 - Math.random() * 200
          const xMove = (Math.random() - 0.5) * 100
          gsap.to(particle, {
            y: yMove,
            x: xMove,
            opacity: 0,
            duration: 15 + Math.random() * 10,
            repeat: -1,
            ease: 'none'
          })
        })
      }

      // 蚀光环动画
      if (rings.length) {
        gsap.from(rings, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          scale: 0,
          opacity: 0,
          rotation: -180,
          duration: 1.8,
          stagger: 0.2,
          ease: 'power3.out'
        })

        // 环持续旋转
        rings.forEach((ring: HTMLElement, index: number) => {
          gsap.to(ring, {
            rotation: 360,
            duration: 30 + index * 10,
            repeat: -1,
            ease: 'none'
          })
        })
      }

      // 卡片入场动画
      if (cards.length) {
        gsap.from(cards, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          },
          y: 120,
          opacity: 0,
          scale: 0.7,
          rotationX: 45,
          duration: 1.2,
          stagger: 0.15,
          ease: 'back.out(1.5)'
        })

        // 卡片持续浮动
        cards.forEach((card: HTMLElement, index: number) => {
          gsap.to(card, {
            y: -15,
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
            start: 'top 65%',
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
            start: 'top 65%',
            toggleActions: 'play none none reverse'
          },
          scale: 0,
          rotation: -180,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          delay: 0.8,
          ease: 'back.out(2)'
        })

        // 图标持续脉动
        cardIcons.forEach((icon: HTMLElement) => {
          gsap.to(icon, {
            scale: 1.1,
            filter: 'brightness(1.3)',
            duration: 0.8,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut'
          })
        })
      }

      if (cardTitles.length) {
        gsap.from(cardTitles, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 65%',
            toggleActions: 'play none none reverse'
          },
          y: 30,
          opacity: 0,
          duration: 0.7,
          stagger: 0.15,
          delay: 1,
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
          y: 25,
          opacity: 0,
          duration: 0.7,
          stagger: 0.15,
          delay: 1.2,
          ease: 'power3.out'
        })
      }

      if (cardMetas.length) {
        gsap.from(cardMetas, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 60%',
            toggleActions: 'play none none reverse'
          },
          y: 20,
          opacity: 0,
          duration: 0.6,
          stagger: 0.15,
          delay: 1.4,
          ease: 'power3.out'
        })
      }

      // 霓虹条动画
      if (neonBars.length) {
        gsap.from(neonBars, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 60%',
            toggleActions: 'play none none reverse'
          },
          scaleX: 0,
          duration: 0.8,
          stagger: 0.15,
          delay: 1.5,
          ease: 'power3.out'
        })

        // 霓虹脉动
        if (neonPulses.length) {
          neonPulses.forEach((pulse: HTMLElement) => {
            gsap.to(pulse, {
              opacity: 0.8,
              x: '100%',
              duration: 2,
              repeat: -1,
              ease: 'power2.inOut'
            })
          })
        }
      }

      // 滚动控制卡片发光强度
      if (stageEl.length) {
        ScrollTrigger.create({
          trigger: stageEl[0],
          start: 'top 80%',
          end: 'bottom 20%',
          onUpdate: (self) => {
            const progress = self.progress
            cards.forEach((card: HTMLElement) => {
              const aura = card.querySelector('.snee-card-aura-227') as HTMLElement
              if (aura) {
                gsap.to(aura, {
                  opacity: 0.3 + progress * 0.4,
                  scale: 1 + progress * 0.3,
                  duration: 0.3,
                  ease: 'power1.out'
                })
              }
            })

            // 蚀光环随滚动旋转加速
            rings.forEach((ring: HTMLElement, index: number) => {
              const currentRotation = gsap.getProperty(ring, 'rotation') as number
              gsap.to(ring, {
                rotation: currentRotation + (1 + progress * 3),
                duration: 0.3,
                ease: 'none'
              })
            })
          }
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
.snee-neon-eclipse-section-227 {
  min-height: 100vh;
  padding: 100px 20px;
  background: linear-gradient(180deg, #050510 0%, #0a0515 30%, #050510 60%, #0a0515 100%);
  position: relative;
  overflow: hidden;
}

.snee-container-227 {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  z-index: 1;
}

.snee-title-227 {
  text-align: center;
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 900;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #ec4899, #f97316, #fbbf24);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 60px rgba(236, 72, 153, 0.5);
  letter-spacing: 0.05em;
}

.snee-subtitle-227 {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(236, 72, 153, 0.7);
  margin-bottom: 80px;
  letter-spacing: 0.4em;
  text-transform: uppercase;
}

.snee-eclipse-stage-227 {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 2000px;
}

.snee-background-glow-227 {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.snee-glow-orb-227 {
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  filter: blur(60px);
  animation: orbPulse 4s ease-in-out infinite;
}

@keyframes orbPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
}

.snee-particles-227 {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.snee-particle-227 {
  position: absolute;
  border-radius: 50%;
  filter: blur(1px);
  animation: particleFloat 15s linear infinite;
}

@keyframes particleFloat {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-200px) translateX(50px);
    opacity: 0;
  }
}

.snee-eclipse-ring-227 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.snee-ring-227 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 2px solid rgba(236, 72, 153, 0.2);
  border-radius: 50%;

  &[data-ring="1"] {
    width: 600px;
    height: 600px;
    border-style: dashed;
  }

  &[data-ring="2"] {
    width: 800px;
    height: 800px;
    border-color: rgba(249, 115, 22, 0.15);
  }

  &[data-ring="3"] {
    width: 1000px;
    height: 1000px;
    border-color: rgba(59, 130, 246, 0.1);
    border-style: dotted;
  }
}

.snee-cards-grid-227 {
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 50px;
  max-width: 1200px;
  z-index: 2;
  padding: 40px 0;
}

.snee-eclipse-card-227 {
  position: relative;
  min-height: 420px;
  background: rgba(10, 5, 20, 0.85);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  overflow: hidden;
  cursor: pointer;
  transform-style: preserve-3d;
  border: 1px solid rgba(236, 72, 153, 0.2);
  transition: border-color 0.4s ease;

  &:hover {
    border-color: rgba(236, 72, 153, 0.5);
  }
}

.snee-card-aura-227 {
  position: absolute;
  inset: -50px;
  opacity: 0.3;
  filter: blur(40px);
  transition: all 0.4s ease;
  pointer-events: none;
}

.snee-card-glow-227 {
  position: absolute;
  inset: 0;
  opacity: 0.4;
  filter: blur(60px);
  transition: all 0.4s ease;
  pointer-events: none;
}

.snee-eclipse-layer-227 {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.snee-eclipse-mask-227 {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0) 30%, rgba(0, 0, 0, 0.4) 100%);
  transition: transform 0.4s ease;
}

.snee-eclipse-shine-227 {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    transparent 0%,
    rgba(255, 255, 255, 0.05) 50%,
    transparent 100%
  );
  animation: shineMove 3s ease-in-out infinite;
}

@keyframes shineMove {
  0% {
    transform: translateX(-100%) translateY(-100%);
  }
  50% {
    transform: translateX(100%) translateY(100%);
  }
  100% {
    transform: translateX(-100%) translateY(-100%);
  }
}

.snee-border-glow-227 {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.snee-border-segment-227 {
  position: absolute;
  opacity: 0.4;
  transition: all 0.3s ease;

  &[data-side="1"] {
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, currentColor, transparent);
  }

  &[data-side="2"] {
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, currentColor, transparent);
  }

  &[data-side="3"] {
    left: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(180deg, transparent, currentColor, transparent);
  }

  &[data-side="4"] {
    right: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(180deg, transparent, currentColor, transparent);
  }
}

.snee-card-content-227 {
  position: relative;
  z-index: 2;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  height: 100%;
}

.snee-card-number-227 {
  position: absolute;
  top: 20px;
  left: 25px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.snee-number-227 {
  font-size: 3rem;
  font-weight: 900;
  background: linear-gradient(135deg, #ec4899, #f97316);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  filter: drop-shadow(0 0 15px rgba(236, 72, 153, 0.5));
}

.snee-number-line-227 {
  width: 40px;
  height: 2px;
  background: linear-gradient(90deg, #ec4899, transparent);
}

.snee-card-icon-227 {
  font-size: 4.5rem;
  margin-bottom: 25px;
  filter: drop-shadow(0 0 30px currentColor);
  transition: all 0.3s ease;
}

.snee-card-title-227 {
  font-size: 1.8rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-shadow: 0 0 20px rgba(236, 72, 153, 0.5);
}

.snee-card-desc-227 {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin-bottom: 25px;
  line-height: 1.6;
}

.snee-card-meta-227 {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  margin-top: auto;
}

.snee-meta-tag-227 {
  padding: 8px 16px;
  border: 1px solid;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  display: inline-block;
  align-self: center;
  background: rgba(0, 0, 0, 0.3);
}

.snee-meta-stat-227 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.snee-stat-value-227 {
  font-size: 2rem;
  font-weight: 900;
  background: linear-gradient(135deg, #fbbf24, #f97316);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

.snee-stat-label-227 {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.snee-neon-bar-227 {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  overflow: hidden;
}

.snee-neon-pulse-227 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100px;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
  opacity: 0.6;
  transform: translateX(-100%);
}

.snee-scroll-indicator-227 {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  z-index: 3;
}

.snee-indicator-line-227 {
  width: 2px;
  height: 60px;
  background: linear-gradient(180deg, rgba(236, 72, 153, 0.8), transparent);
  animation: scrollLine 2s ease-in-out infinite;
}

@keyframes scrollLine {
  0%, 100% {
    transform: scaleY(0);
    transform-origin: top;
  }
  50% {
    transform: scaleY(1);
    transform-origin: bottom;
  }
}

.snee-indicator-text-227 {
  font-size: 0.75rem;
  color: rgba(236, 72, 153, 0.8);
  letter-spacing: 0.3em;
  text-transform: uppercase;
  animation: textPulse 2s ease-in-out infinite;
}

@keyframes textPulse {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

.snee-indicator-arrow-227 {
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 10px solid rgba(236, 72, 153, 0.8);
  animation: arrowBounce 2s ease-in-out infinite;
}

@keyframes arrowBounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(8px);
  }
}

@media (max-width: 768px) {
  .snee-cards-grid-227 {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .snee-eclipse-card-227 {
    min-height: 380px;
  }

  .snee-card-icon-227 {
    font-size: 3.5rem;
  }

  .snee-card-title-227 {
    font-size: 1.5rem;
  }

  .snee-number-227 {
    font-size: 2rem;
  }

  .snee-ring-227 {
    &[data-ring="1"] {
      width: 300px;
      height: 300px;
    }

    &[data-ring="2"] {
      width: 400px;
      height: 400px;
    }

    &[data-ring="3"] {
      width: 500px;
      height: 500px;
    }
  }
}
</style>
