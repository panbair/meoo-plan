<template>
  <div class="neon-flux-section-231" ref="componentRoot">
    <div class="nfl-container-231">
      <h2 class="nfl-title-231">霓虹流光</h2>
      <p class="nfl-subtitle-231">Neon Flux Cards</p>

      <div class="nfl-flux-stage-231">
        <!-- 流光背景 -->
        <div class="nfl-flux-background-231">
          <div class="nfl-flux-wave-231" v-for="i in 4" :key="i" :data-wave="i"></div>
        </div>

        <!-- 流光粒子 -->
        <div class="nfl-flux-particles-231">
          <div
            v-for="(particle, index) in particles"
            :key="index"
            class="nfl-particle-231"
            :style="getParticleStyle(particle, index)"
          ></div>
        </div>

        <!-- 流场网格 -->
        <div class="nfl-flux-grid-231">
          <div class="nfl-grid-cell-231" v-for="i in 12" :key="i" :data-cell="i"></div>
        </div>

        <!-- 卡片网格 -->
        <div class="nfl-cards-grid-231">
          <div
            v-for="(card, index) in cards"
            :key="index"
            class="nfl-flux-card-231"
            :ref="el => { if (el) cardRefs[index] = el as HTMLElement }"
            :data-card="index"
            :style="{ '--card-color': card.primaryColor, '--card-glow': card.glowColor, '--flux-color': card.fluxColor }"
            @mousemove="handleCardHover($event, index)"
            @mouseleave="handleCardLeave(index)"
          >
            <!-- 流光层 -->
            <div class="nfl-flux-layer-231">
              <div class="nfl-flux-core-231"></div>
              <div class="nfl-flux-stream-231"></div>
              <div class="nfl-flux-aura-231"></div>
            </div>

            <!-- 光流效果 -->
            <div class="nfl-flow-effect-231">
              <div class="nfl-flow-ray-231" v-for="i in 5" :key="i" :data-ray="i"></div>
            </div>

            <!-- 边框光效 -->
            <div class="nfl-border-glow-231">
              <div class="nfl-border-segment-231" v-for="i in 4" :key="i" :data-side="i"></div>
            </div>

            <!-- 卡片内容 -->
            <div class="nfl-card-content-231">
              <div class="nfl-card-number-231">
                <span class="nfl-number-231">{{ String(index + 1).padStart(2, '0') }}</span>
                <div class="nfl-number-line-231"></div>
              </div>

              <div class="nfl-card-icon-231">
                <div class="nfl-icon-flux-231"></div>
                <span class="nfl-icon-231">{{ card.icon }}</span>
              </div>

              <h3 class="nfl-card-title-231">{{ card.title }}</h3>
              <p class="nfl-card-desc-231">{{ card.description }}</p>

              <!-- 流光能量 -->
              <div class="nfl-flux-energy-231">
                <div class="nfl-flux-indicator-231"></div>
                <div class="nfl-flux-level-231">
                  <div class="nfl-level-bar-231">
                    <div class="nfl-level-fill-231" :style="{ width: `${card.energy}%` }">
                      <div class="nfl-level-wave-231"></div>
                    </div>
                  </div>
                  <span class="nfl-level-text-231">{{ card.energy }}%</span>
                </div>
              </div>

              <!-- 标签 -->
              <div class="nfl-card-tags-231">
                <span class="nfl-tag-231" :style="{ borderColor: card.tagColor, color: card.tagColor }">
                  {{ card.category }}
                </span>
                <span class="nfl-flux-badge-231">
                  {{ card.flux }}
                </span>
              </div>
            </div>

            <!-- 底部流光条 -->
            <div class="nfl-flux-bar-231">
              <div class="nfl-bar-flow-231"></div>
            </div>
          </div>
        </div>

        <!-- 滚动提示 -->
        <div class="nfl-scroll-hint-231">
          <div class="nfl-hint-flux-231"></div>
          <div class="nfl-hint-text-231">FLOW</div>
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
  flux: string
  primaryColor: string
  glowColor: string
  fluxColor: string
  tagColor: string
}

const cards: Card[] = [
  {
    icon: '🌊',
    title: '海潮',
    description: 'Ocean Tide',
    category: 'AQUATIC',
    energy: 93,
    flux: 'WAVE',
    primaryColor: '#00bfff',
    glowColor: 'rgba(0, 191, 255, 0.8)',
    fluxColor: 'rgba(0, 191, 255, 0.5)',
    tagColor: '#00bfff'
  },
  {
    icon: '🌀',
    title: '旋涡',
    description: 'Vortex Flow',
    category: 'FLUID',
    energy: 96,
    flux: 'SWIRL',
    primaryColor: '#ff0066',
    glowColor: 'rgba(255, 0, 102, 0.8)',
    fluxColor: 'rgba(255, 0, 102, 0.5)',
    tagColor: '#ff0066'
  },
  {
    icon: '✨',
    title: '星光',
    description: 'Star Stream',
    category: 'COSMIC',
    energy: 94,
    flux: 'GLOW',
    primaryColor: '#ffcc00',
    glowColor: 'rgba(255, 204, 0, 0.8)',
    fluxColor: 'rgba(255, 204, 0, 0.5)',
    tagColor: '#ffcc00'
  },
  {
    icon: '🔥',
    title: '烈焰',
    description: 'Flame Flow',
    category: 'FIRE',
    energy: 97,
    flux: 'BLAZE',
    primaryColor: '#ff4500',
    glowColor: 'rgba(255, 69, 0, 0.8)',
    fluxColor: 'rgba(255, 69, 0, 0.5)',
    tagColor: '#ff4500'
  },
  {
    icon: '💫',
    title: '彗星',
    description: 'Comet Trail',
    category: 'SPACE',
    energy: 95,
    flux: 'TRAIL',
    primaryColor: '#9966ff',
    glowColor: 'rgba(153, 102, 255, 0.8)',
    fluxColor: 'rgba(153, 102, 255, 0.5)',
    tagColor: '#9966ff'
  },
  {
    icon: '💧',
    title: '水晶',
    description: 'Crystal Stream',
    category: 'PURE',
    energy: 98,
    flux: 'PURE',
    primaryColor: '#00ffcc',
    glowColor: 'rgba(0, 255, 204, 0.8)',
    fluxColor: 'rgba(0, 255, 204, 0.5)',
    tagColor: '#00ffcc'
  }
]

interface Particle {
  x: number
  y: number
  size: number
  speed: number
  delay: number
  flow: number
}

const particles: Particle[] = Array.from({ length: 32 }, () => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 2 + Math.random() * 4,
  speed: 7 + Math.random() * 13,
  delay: Math.random() * 5,
  flow: 0.4 + Math.random() * 0.6
}))

const getParticleStyle = (particle: Particle, index: number) => {
  const colors = ['#00bfff', '#ff0066', '#ffcc00', '#ff4500', '#9966ff', '#00ffcc']
  return {
    left: `${particle.x}%`,
    top: `${particle.y}%`,
    width: `${particle.size}px`,
    height: `${particle.size}px`,
    background: `radial-gradient(circle, ${colors[index % colors.length]} 0%, transparent 70%)`,
    opacity: particle.flow,
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
    rotateY: x * 13,
    rotateX: -y * 13,
    scale: 1.065,
    duration: 0.38,
    ease: 'power2.out'
  })

  // 流光核心增强
  const fluxCore = card.querySelector('.nfl-flux-core-231') as HTMLElement
  const fluxStream = card.querySelector('.nfl-flux-stream-231') as HTMLElement
  const fluxAura = card.querySelector('.nfl-flux-aura-231') as HTMLElement

  if (fluxCore) {
    gsap.to(fluxCore, {
      scale: 1.45,
      opacity: 0.85,
      filter: 'blur(28px)',
      duration: 0.38,
      ease: 'power2.out'
    })
  }
  if (fluxStream) {
    gsap.to(fluxStream, {
      scale: 1.35,
      opacity: 0.75,
      duration: 0.38,
      ease: 'power2.out'
    })
  }
  if (fluxAura) {
    gsap.to(fluxAura, {
      scale: 1.55,
      opacity: 0.8,
      duration: 0.38,
      ease: 'power2.out'
    })
  }

  // 光流增强
  const flowRays = card.querySelectorAll('.nfl-flow-ray-231')
  flowRays.forEach((ray, i) => {
    gsap.to(ray, {
      opacity: 0.75,
      duration: 0.28,
      delay: i * 0.045,
      ease: 'power2.out'
    })
  })

  // 边框高亮
  const borderSegments = card.querySelectorAll('.nfl-border-segment-231')
  borderSegments.forEach((segment, i) => {
    gsap.to(segment, {
      opacity: 1,
      duration: 0.28,
      delay: i * 0.045,
      ease: 'power2.out'
    })
  })

  // 图标流光
  const iconFlux = card.querySelector('.nfl-icon-flux-231') as HTMLElement
  if (iconFlux) {
    gsap.to(iconFlux, {
      scale: 1.55,
      opacity: 0.92,
      duration: 0.38,
      ease: 'elastic.out(1, 0.55)'
    })
  }

  // 流光指示器
  const fluxIndicator = card.querySelector('.nfl-flux-indicator-231') as HTMLElement
  if (fluxIndicator) {
    gsap.to(fluxIndicator, {
      scale: 1.35,
      opacity: 0.88,
      duration: 0.38,
      ease: 'power2.out'
    })
  }

  // 能量条增强
  const levelFill = card.querySelector('.nfl-level-fill-231') as HTMLElement
  if (levelFill) {
    gsap.to(levelFill, {
      filter: 'brightness(1.45) drop-shadow(0 0 11px currentColor)',
      duration: 0.28,
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
    duration: 0.58,
    ease: 'power3.out'
  })

  // 流光复位
  const fluxCore = card.querySelector('.nfl-flux-core-231') as HTMLElement
  const fluxStream = card.querySelector('.nfl-flux-stream-231') as HTMLElement
  const fluxAura = card.querySelector('.nfl-flux-aura-231') as HTMLElement

  if (fluxCore) {
    gsap.to(fluxCore, {
      scale: 1,
      opacity: 0.5,
      filter: 'blur(18px)',
      duration: 0.58,
      ease: 'power3.out'
    })
  }
  if (fluxStream) {
    gsap.to(fluxStream, {
      scale: 1,
      opacity: 0.35,
      duration: 0.58,
      ease: 'power3.out'
    })
  }
  if (fluxAura) {
    gsap.to(fluxAura, {
      scale: 1,
      opacity: 0.42,
      duration: 0.58,
      ease: 'power3.out'
    })
  }

  // 光流复位
  const flowRays = card.querySelectorAll('.nfl-flow-ray-231')
  flowRays.forEach((ray) => {
    gsap.to(ray, {
      opacity: 0.35,
      duration: 0.58,
      ease: 'power3.out'
    })
  })

  // 边框复位
  const borderSegments = card.querySelectorAll('.nfl-border-segment-231')
  borderSegments.forEach((segment) => {
    gsap.to(segment, {
      opacity: 0.48,
      duration: 0.58,
      ease: 'power3.out'
    })
  })

  // 图标流光复位
  const iconFlux = card.querySelector('.nfl-icon-flux-231') as HTMLElement
  if (iconFlux) {
    gsap.to(iconFlux, {
      scale: 1,
      opacity: 0.42,
      duration: 0.58,
      ease: 'power3.out'
    })
  }

  // 流光指示器复位
  const fluxIndicator = card.querySelector('.nfl-flux-indicator-231') as HTMLElement
  if (fluxIndicator) {
    gsap.to(fluxIndicator, {
      scale: 1,
      opacity: 0.65,
      duration: 0.58,
      ease: 'power3.out'
    })
  }

  // 能量条复位
  const levelFill = card.querySelector('.nfl-level-fill-231') as HTMLElement
  if (levelFill) {
    gsap.to(levelFill, {
      filter: 'none',
      duration: 0.58,
      ease: 'power3.out'
    })
  }
}

onMounted(() => {
  ctx = gsap.context(() => {
    const titleEl = gsap.utils.toArray<HTMLElement>('.nfl-title-231', componentRoot.value)
    const subtitleEl = gsap.utils.toArray<HTMLElement>('.nfl-subtitle-231', componentRoot.value)
    const stageEl = gsap.utils.toArray<HTMLElement>('.nfl-flux-stage-231', componentRoot.value)
    const cards = gsap.utils.toArray<HTMLElement>('.nfl-flux-card-231', componentRoot.value)
    const fluxWaves = gsap.utils.toArray<HTMLElement>('.nfl-flux-wave-231', componentRoot.value)
    const particles = gsap.utils.toArray<HTMLElement>('.nfl-particle-231', componentRoot.value)
    const gridCells = gsap.utils.toArray<HTMLElement>('.nfl-grid-cell-231', componentRoot.value)
    const cardNumbers = gsap.utils.toArray<HTMLElement>('.nfl-number-231', componentRoot.value)
    const cardIcons = gsap.utils.toArray<HTMLElement>('.nfl-icon-231', componentRoot.value)
    const cardTitles = gsap.utils.toArray<HTMLElement>('.nfl-card-title-231', componentRoot.value)
    const cardDescs = gsap.utils.toArray<HTMLElement>('.nfl-card-desc-231', componentRoot.value)
    const levelBars = gsap.utils.toArray<HTMLElement>('.nfl-level-fill-231', componentRoot.value)
    const fluxBars = gsap.utils.toArray<HTMLElement>('.nfl-flux-bar-231', componentRoot.value)

    // 标题动画
    if (titleEl.length) {
      gsap.from(titleEl, {
        scrollTrigger: {
          trigger: componentRoot.value,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        y: 85,
        opacity: 0,
        scale: 0.88,
        duration: 1.25,
        ease: 'elastic.out(1, 0.65)'
      })

      // 标题流光脉冲
      gsap.to(titleEl, {
        filter: 'drop-shadow(0 0 32px #00bfff) drop-shadow(0 0 64px #ff0066)',
        duration: 0.85,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })
    }

    if (subtitleEl.length) {
      gsap.from(subtitleEl, {
        scrollTrigger: {
          trigger: componentRoot.value,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        y: 42,
        opacity: 0,
        duration: 1.05,
        delay: 0.22,
        ease: 'power3.out'
      })
    }

    // 流光背景动画
    if (fluxWaves.length) {
      fluxWaves.forEach((wave, index) => {
        gsap.from(wave, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          },
          scale: 0,
          opacity: 0,
          duration: 1.9,
          delay: index * 0.18,
          ease: 'back.out(1.9)'
        })

        // 流光持续波动
        gsap.to(wave, {
          x: '18%',
          y: '12%',
          duration: 11 + index * 3.5,
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
        duration: 1.3,
        stagger: {
          each: 0.055,
          from: 'random'
        },
        ease: 'back.out(1.65)'
      })

      // 粒子持续飘浮
      particles.forEach((particle) => {
        const yMove = -65 - Math.random() * 125
        gsap.to(particle, {
          y: yMove,
          opacity: 0,
          duration: 10.5 + Math.random() * 6.5,
          repeat: -1,
          ease: 'none'
        })
      })
    }

    // 流场网格动画
    if (gridCells.length) {
      gsap.from(gridCells, {
        scrollTrigger: {
          trigger: stageEl[0] || componentRoot.value,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        scale: 0,
        opacity: 0,
        duration: 1.55,
        stagger: 0.11,
        ease: 'back.out(1.5)'
      })

      // 网格持续闪烁
      gridCells.forEach((cell) => {
        gsap.to(cell, {
          opacity: 0.25,
          duration: 0.45,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
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
        y: 125,
        opacity: 0,
        scale: 0.68,
        rotationX: 48,
        duration: 1.35,
        stagger: 0.155,
        ease: 'back.out(1.75)'
      })

      // 卡片持续悬浮
      cards.forEach((card, index) => {
        gsap.to(card, {
          y: -10.5,
          duration: 2.4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: index * 0.265
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
        x: -42,
        opacity: 0,
        duration: 0.82,
        stagger: 0.155,
        delay: 0.68,
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
        rotation: -190,
        opacity: 0,
        duration: 0.82,
        stagger: 0.155,
        delay: 0.88,
        ease: 'elastic.out(1, 0.55)'
      })

      // 图标持续脉动
      cardIcons.forEach((icon) => {
        gsap.to(icon, {
          scale: 1.11,
          filter: 'brightness(1.32)',
          duration: 0.75,
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
        y: 31,
        opacity: 0,
        duration: 0.72,
        stagger: 0.155,
        delay: 1.08,
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
        y: 26,
        opacity: 0,
        duration: 0.72,
        stagger: 0.155,
        delay: 1.28,
        ease: 'power3.out'
      })
    }

    // 流光能量动画
    if (levelBars.length) {
      gsap.fromTo(levelBars,
        { width: 0 },
        {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 65%',
            toggleActions: 'play none none reverse'
          },
          width: (index) => `${cards[index as number]?.getAttribute('data-card') ? cards[index as number] as HTMLElement : '0'}%`,
          duration: 1.12,
          stagger: 0.155,
          delay: 1.48,
          ease: 'elastic.out(1, 0.65)'
        }
      )
    }

    // 流光条动画
    if (fluxBars.length) {
      gsap.from(fluxBars, {
        scrollTrigger: {
          trigger: stageEl[0] || componentRoot.value,
          start: 'top 65%',
          toggleActions: 'play none none reverse'
        },
        scaleX: 0,
        duration: 0.92,
        stagger: 0.155,
        delay: 1.68,
        ease: 'power3.out'
      })

      // 流光条持续流动
      const barFlows = gsap.utils.toArray<HTMLElement>('.nfl-bar-flow-231', componentRoot.value)
      barFlows.forEach((flow) => {
        gsap.to(flow, {
          x: '100%',
          duration: 1.7,
          repeat: -1,
          ease: 'power2.inOut'
        })
      })
    }

    // 滚动控制流光强度
    if (stageEl.length) {
      ScrollTrigger.create({
        trigger: stageEl[0],
        start: 'top 85%',
        end: 'bottom 20%',
        onUpdate: (self) => {
          const progress = self.progress

          // 卡片流光随滚动增强
          cards.forEach((card) => {
            const fluxCore = card.querySelector('.nfl-flux-core-231') as HTMLElement
            if (fluxCore) {
              gsap.to(fluxCore, {
                opacity: 0.35 + progress * 0.35,
                scale: 1 + progress * 0.32,
                duration: 0.28,
                ease: 'power1.out'
              })
            }
          })

          // 流场网格增强
          gridCells.forEach((cell) => {
            gsap.to(cell, {
              opacity: 0.15 + progress * 0.15,
              duration: 0.28,
              ease: 'power1.out'
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
.neon-flux-section-231 {
  min-height: 100vh;
  padding: 100px 20px;
  background: linear-gradient(180deg, #0a0a1a 0%, #131328 30%, #0a0a1a 60%, #131328 100%);
  position: relative;
  overflow: hidden;
}

.nfl-container-231 {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  z-index: 1;
}

.nfl-title-231 {
  text-align: center;
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 900;
  margin-bottom: 15px;
  background: linear-gradient(135deg, #00bfff, #ff0066, #ffcc00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.11em;
}

.nfl-subtitle-231 {
  text-align: center;
  font-size: 1.22rem;
  color: rgba(0, 191, 255, 0.82);
  margin-bottom: 90px;
  letter-spacing: 0.63em;
  text-transform: uppercase;
}

.nfl-flux-stage-231 {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 2000px;
}

/* 流光背景 */
.nfl-flux-background-231 {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.nfl-flux-wave-231 {
  position: absolute;
  width: 135%;
  height: 100%;
  top: 0;
  left: -17.5%;
  opacity: 0.14;

  &[data-wave="1"] {
    background: radial-gradient(ellipse at 35% 50%, #00bfff22, transparent 62%);
  }

  &[data-wave="2"] {
    background: radial-gradient(ellipse at 65% 42%, #ff006622, transparent 62%);
    top: 22%;
  }

  &[data-wave="3"] {
    background: radial-gradient(ellipse at 52% 78%, #ffcc0022, transparent 62%);
    top: 42%;
  }

  &[data-wave="4"] {
    background: radial-gradient(ellipse at 28% 65%, #9966ff22, transparent 62%);
    top: 62%;
  }
}

/* 粒子 */
.nfl-flux-particles-231 {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.nfl-particle-231 {
  position: absolute;
  border-radius: 50%;
  filter: blur(1.2px);
}

/* 流场网格 */
.nfl-flux-grid-231 {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.nfl-grid-cell-231 {
  position: absolute;
  width: 100px;
  height: 100px;
  border: 1px solid rgba(0, 191, 255, 0.08);
  opacity: 0.2;

  &[data-cell="1"] { top: 10%; left: 5%; }
  &[data-cell="2"] { top: 10%; right: 5%; }
  &[data-cell="3"] { top: 30%; left: 15%; }
  &[data-cell="4"] { top: 30%; right: 15%; }
  &[data-cell="5"] { top: 50%; left: 5%; }
  &[data-cell="6"] { top: 50%; right: 5%; }
  &[data-cell="7"] { top: 70%; left: 15%; }
  &[data-cell="8"] { top: 70%; right: 15%; }
  &[data-cell="9"] { top: 85%; left: 5%; }
  &[data-cell="10"] { top: 85%; right: 5%; }
  &[data-cell="11"] { top: 45%; left: 30%; }
  &[data-cell="12"] { top: 55%; right: 30%; }
}

/* 卡片网格 */
.nfl-cards-grid-231 {
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(315px, 1fr));
  gap: 41px;
  max-width: 1210px;
  z-index: 2;
  padding: 40px 0;
}

.nfl-flux-card-231 {
  position: relative;
  min-height: 422px;
  background: rgba(11, 11, 29, 0.86);
  backdrop-filter: blur(21px);
  border-radius: 25px;
  overflow: hidden;
  cursor: pointer;
  transform-style: preserve-3d;
  border: 1px solid var(--card-color);
  transition: border-color 0.5s ease;

  &:hover {
    border-color: var(--card-glow);
  }
}

/* 流光层 */
.nfl-flux-layer-231 {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.nfl-flux-core-231 {
  position: absolute;
  inset: -32px;
  opacity: 0.5;
  filter: blur(18px);
  background: radial-gradient(circle, var(--flux-color) 0%, transparent 58%);
  transition: all 0.38s ease;
}

.nfl-flux-stream-231 {
  position: absolute;
  inset: -64px;
  opacity: 0.35;
  filter: blur(48px);
  background: radial-gradient(circle, var(--card-glow) 0%, transparent 68%);
  transition: all 0.38s ease;
}

.nfl-flux-aura-231 {
  position: absolute;
  inset: -96px;
  opacity: 0.42;
  filter: blur(78px);
  background: radial-gradient(circle, var(--card-color) 0%, transparent 78%);
  transition: all 0.38s ease;
}

/* 光流效果 */
.nfl-flow-effect-231 {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.nfl-flow-ray-231 {
  position: absolute;
  opacity: 0.35;
  filter: blur(0.8px);
  transition: all 0.28s ease;

  &[data-ray="1"] {
    top: 22%;
    left: 12%;
    width: 58%;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--card-color), transparent);
  }

  &[data-ray="2"] {
    top: 42%;
    right: 16%;
    width: 48%;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--card-glow), transparent);
  }

  &[data-ray="3"] {
    bottom: 32%;
    left: 22%;
    width: 52%;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--flux-color), transparent);
  }

  &[data-ray="4"] {
    top: 32%;
    left: 52%;
    width: 1px;
    height: 38%;
    background: linear-gradient(180deg, transparent, var(--card-color), transparent);
  }

  &[data-ray="5"] {
    top: 52%;
    right: 32%;
    width: 1px;
    height: 33%;
    background: linear-gradient(180deg, transparent, var(--card-glow), transparent);
  }
}

/* 边框光效 */
.nfl-border-glow-231 {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.nfl-border-segment-231 {
  position: absolute;
  opacity: 0.48;
  transition: all 0.28s ease;

  &[data-side="1"] {
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--card-color), transparent);
  }

  &[data-side="2"] {
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--card-color), transparent);
  }

  &[data-side="3"] {
    left: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(180deg, transparent, var(--card-color), transparent);
  }

  &[data-side="4"] {
    right: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(180deg, transparent, var(--card-color), transparent);
  }
}

/* 卡片内容 */
.nfl-card-content-231 {
  position: relative;
  z-index: 2;
  padding: 41px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  height: 100%;
}

.nfl-card-number-231 {
  position: absolute;
  top: 21px;
  left: 26px;
  display: flex;
  align-items: center;
  gap: 13px;
}

.nfl-number-231 {
  font-size: 2.9rem;
  font-weight: 900;
  background: linear-gradient(135deg, var(--card-color), var(--card-glow));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  filter: drop-shadow(0 0 17px var(--card-glow));
}

.nfl-number-line-231 {
  width: 42px;
  height: 2px;
  background: linear-gradient(90deg, var(--card-color), transparent);
}

.nfl-card-icon-231 {
  position: relative;
  font-size: 4.3rem;
  margin-bottom: 26px;
  filter: drop-shadow(0 0 31px var(--card-glow));
}

.nfl-icon-flux-231 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 92px;
  height: 92px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--flux-color)42 0%, transparent 68%);
  opacity: 0.42;
  transition: all 0.38s ease;
}

.nfl-card-title-231 {
  font-size: 1.72rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 13px;
  text-transform: uppercase;
  letter-spacing: 0.145em;
  text-shadow: 0 0 21px var(--card-glow);
}

.nfl-card-desc-231 {
  font-size: 1.01rem;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.185em;
  margin-bottom: 31px;
  line-height: 1.62;
}

/* 流光能量 */
.nfl-flux-energy-231 {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 13px;
  margin-bottom: 27px;
}

.nfl-flux-indicator-231 {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--card-color) 0%, transparent 70%);
  filter: blur(3.5px);
  transition: all 0.38s ease;
}

.nfl-flux-level-231 {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 11px;
}

.nfl-level-bar-231 {
  flex: 1;
  height: 5.5px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2.75px;
  overflow: hidden;
  position: relative;
}

.nfl-level-fill-231 {
  height: 100%;
  background: linear-gradient(90deg, var(--card-color), var(--card-glow));
  border-radius: 2.75px;
  position: relative;
  overflow: hidden;
  transition: all 0.28s ease;
}

.nfl-level-wave-231 {
  position: absolute;
  top: 0;
  left: 0;
  width: 47px;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.88), transparent);
  animation: levelWave 1.7s linear infinite;
}

@keyframes levelWave {
  to { transform: translateX(340%); }
}

.nfl-level-text-231 {
  font-size: 1.22rem;
  font-weight: 900;
  background: linear-gradient(135deg, #00bfff, #ff0066);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  min-width: 53px;
}

/* 标签 */
.nfl-card-tags-231 {
  display: flex;
  flex-direction: column;
  gap: 13px;
  width: 100%;
  margin-top: auto;
}

.nfl-tag-231 {
  padding: 8.5px 19px;
  border: 1px solid;
  border-radius: 21px;
  font-size: 0.755rem;
  font-weight: 700;
  letter-spacing: 0.29em;
  text-transform: uppercase;
  display: inline-block;
  align-self: center;
  background: rgba(0, 0, 0, 0.425);
}

.nfl-flux-badge-231 {
  padding: 6.5px 17px;
  border-radius: 17px;
  font-size: 0.81rem;
  font-weight: 900;
  letter-spacing: 0.115em;
  background: linear-gradient(135deg, var(--card-color), var(--card-glow));
  color: #000;
  display: inline-block;
  align-self: center;
}

/* 流光条 */
.nfl-flux-bar-231 {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  overflow: hidden;
}

.nfl-bar-flow-231 {
  position: absolute;
  top: 0;
  left: 0;
  width: 72px;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.91), transparent);
}

/* 滚动提示 */
.nfl-scroll-hint-231 {
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 13px;
  z-index: 3;
}

.nfl-hint-flux-231 {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--card-color)35 0%, transparent 68%);
  animation: hintFlux 1.9s ease-in-out infinite;
}

@keyframes hintFlux {
  0%, 100% {
    transform: scale(1);
    opacity: 0.52;
  }
  50% {
    transform: scale(1.35);
    opacity: 0;
  }
}

.nfl-hint-text-231 {
  font-size: 0.765rem;
  color: rgba(0, 191, 255, 0.83);
  letter-spacing: 0.41em;
  text-transform: uppercase;
}

@media (max-width: 768px) {
  .nfl-cards-grid-231 {
    grid-template-columns: 1fr;
    gap: 37px;
  }

  .nfl-flux-card-231 {
    min-height: 382px;
  }

  .nfl-card-icon-231 {
    font-size: 3.5rem;
  }

  .nfl-card-title-231 {
    font-size: 1.42rem;
  }

  .nfl-number-231 {
    font-size: 2.05rem;
  }
}
</style>
