<template>
  <div class="neon-plasma-section-230" ref="componentRoot">
    <div class="npl-container-230">
      <h2 class="npl-title-230">霓虹等离子</h2>
      <p class="npl-subtitle-230">Neon Plasma Cards</p>

      <div class="npl-plasma-stage-230">
        <!-- 等离子背景 -->
        <div class="npl-plasma-background-230">
          <div class="npl-plasma-cloud-230" v-for="i in 4" :key="i" :data-cloud="i"></div>
        </div>

        <!-- 等离子粒子 -->
        <div class="npl-plasma-particles-230">
          <div
            v-for="(particle, index) in particles"
            :key="index"
            class="npl-particle-230"
            :style="getParticleStyle(particle, index)"
          ></div>
        </div>

        <!-- 能量网格 -->
        <div class="npl-energy-grid-230">
          <div class="npl-grid-line-230" v-for="i in 8" :key="i" :data-line="i"></div>
        </div>

        <!-- 卡片网格 -->
        <div class="npl-cards-grid-230">
          <div
            v-for="(card, index) in cards"
            :key="index"
            class="npl-plasma-card-230"
            :ref="el => { if (el) cardRefs[index] = el as HTMLElement }"
            :data-card="index"
            :style="{ '--card-color': card.primaryColor, '--card-glow': card.glowColor, '--plasma-color': card.plasmaColor }"
            @mousemove="handleCardHover($event, index)"
            @mouseleave="handleCardLeave(index)"
          >
            <!-- 等离子层 -->
            <div class="npl-plasma-layer-230">
              <div class="npl-plasma-core-230"></div>
              <div class="npl-plasma-shell-230"></div>
              <div class="npl-plasma-aura-230"></div>
            </div>

            <!-- 电弧效果 -->
            <div class="npl-arc-layer-230">
              <div class="npl-arc-segment-230" v-for="i in 6" :key="i" :data-arc="i"></div>
            </div>

            <!-- 边框光效 -->
            <div class="npl-border-glow-230">
              <div class="npl-border-segment-230" v-for="i in 4" :key="i" :data-side="i"></div>
            </div>

            <!-- 卡片内容 -->
            <div class="npl-card-content-230">
              <div class="npl-card-number-230">
                <span class="npl-number-230">{{ String(index + 1).padStart(2, '0') }}</span>
                <div class="npl-number-line-230"></div>
              </div>

              <div class="npl-card-icon-230">
                <div class="npl-icon-plasma-230"></div>
                <span class="npl-icon-230">{{ card.icon }}</span>
              </div>

              <h3 class="npl-card-title-230">{{ card.title }}</h3>
              <p class="npl-card-desc-230">{{ card.description }}</p>

              <!-- 等离子能量 -->
              <div class="npl-plasma-energy-230">
                <div class="npl-energy-core-230"></div>
                <div class="npl-energy-level-230">
                  <div class="npl-level-bar-230">
                    <div class="npl-level-fill-230" :style="{ width: `${card.energy}%` }">
                      <div class="npl-level-pulse-230"></div>
                    </div>
                  </div>
                  <span class="npl-level-value-230">{{ card.energy }}%</span>
                </div>
              </div>

              <!-- 标签 -->
              <div class="npl-card-tags-230">
                <span class="npl-tag-230" :style="{ borderColor: card.tagColor, color: card.tagColor }">
                  {{ card.category }}
                </span>
                <span class="npl-ion-badge-230">
                  {{ card.ion }}
                </span>
              </div>
            </div>

            <!-- 底部等离子条 -->
            <div class="npl-plasma-bar-230">
              <div class="npl-bar-segment-230"></div>
            </div>
          </div>
        </div>

        <!-- 滚动提示 -->
        <div class="npl-scroll-hint-230">
          <div class="npl-hint-plasma-230"></div>
          <div class="npl-hint-text-230">ENERGIZE</div>
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
  ion: string
  primaryColor: string
  glowColor: string
  plasmaColor: string
  tagColor: string
}

const cards: Card[] = [
  {
    icon: '⚡',
    title: '闪电',
    description: 'Electric Storm',
    category: 'VOLTAGE',
    energy: 97,
    ion: '+++',
    primaryColor: '#00ffff',
    glowColor: 'rgba(0, 255, 255, 0.8)',
    plasmaColor: 'rgba(0, 255, 255, 0.5)',
    tagColor: '#00ffff'
  },
  {
    icon: '🔥',
    title: '等离子',
    description: 'Plasma Flame',
    category: 'FUSION',
    energy: 94,
    ion: '++',
    primaryColor: '#ff4500',
    glowColor: 'rgba(255, 69, 0, 0.8)',
    plasmaColor: 'rgba(255, 69, 0, 0.5)',
    tagColor: '#ff4500'
  },
  {
    icon: '💫',
    title: '星云',
    description: 'Nebula Core',
    category: 'COSMIC',
    energy: 91,
    ion: '+',
    primaryColor: '#ff00ff',
    glowColor: 'rgba(255, 0, 255, 0.8)',
    plasmaColor: 'rgba(255, 0, 255, 0.5)',
    tagColor: '#ff00ff'
  },
  {
    icon: '🌟',
    title: '恒星',
    description: 'Stellar Fusion',
    category: 'STAR',
    energy: 99,
    ion: '++++',
    primaryColor: '#ffd700',
    glowColor: 'rgba(255, 215, 0, 0.8)',
    plasmaColor: 'rgba(255, 215, 0, 0.5)',
    tagColor: '#ffd700'
  },
  {
    icon: '🔮',
    title: '能量',
    description: 'Energy Core',
    category: 'POWER',
    energy: 96,
    ion: '+++',
    primaryColor: '#00ff00',
    glowColor: 'rgba(0, 255, 0, 0.8)',
    plasmaColor: 'rgba(0, 255, 0, 0.5)',
    tagColor: '#00ff00'
  },
  {
    icon: '💠',
    title: '量子',
    description: 'Quantum Field',
    category: 'QUANTUM',
    energy: 98,
    ion: '++++',
    primaryColor: '#0080ff',
    glowColor: 'rgba(0, 128, 255, 0.8)',
    plasmaColor: 'rgba(0, 128, 255, 0.5)',
    tagColor: '#0080ff'
  }
]

interface Particle {
  x: number
  y: number
  size: number
  speed: number
  delay: number
  energy: number
}

const particles: Particle[] = Array.from({ length: 30 }, () => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 1.5 + Math.random() * 4,
  speed: 8 + Math.random() * 14,
  delay: Math.random() * 5,
  energy: 0.5 + Math.random() * 0.5
}))

const getParticleStyle = (particle: Particle, index: number) => {
  const colors = ['#00ffff', '#ff4500', '#ff00ff', '#ffd700', '#00ff00', '#0080ff']
  return {
    left: `${particle.x}%`,
    top: `${particle.y}%`,
    width: `${particle.size}px`,
    height: `${particle.size}px`,
    background: `radial-gradient(circle, ${colors[index % colors.length]} 0%, transparent 70%)`,
    opacity: particle.energy,
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
    rotateY: x * 14,
    rotateX: -y * 14,
    scale: 1.07,
    duration: 0.35,
    ease: 'power2.out'
  })

  // 等离子核心增强
  const plasmaCore = card.querySelector('.npl-plasma-core-230') as HTMLElement
  const plasmaShell = card.querySelector('.npl-plasma-shell-230') as HTMLElement
  const plasmaAura = card.querySelector('.npl-plasma-aura-230') as HTMLElement

  if (plasmaCore) {
    gsap.to(plasmaCore, {
      scale: 1.5,
      opacity: 0.9,
      filter: 'blur(30px)',
      duration: 0.35,
      ease: 'power2.out'
    })
  }
  if (plasmaShell) {
    gsap.to(plasmaShell, {
      scale: 1.4,
      opacity: 0.7,
      duration: 0.35,
      ease: 'power2.out'
    })
  }
  if (plasmaAura) {
    gsap.to(plasmaAura, {
      scale: 1.6,
      opacity: 0.8,
      duration: 0.35,
      ease: 'power2.out'
    })
  }

  // 电弧增强
  const arcSegments = card.querySelectorAll('.npl-arc-segment-230')
  arcSegments.forEach((segment, i) => {
    gsap.to(segment, {
      opacity: 0.8,
      duration: 0.25,
      delay: i * 0.04,
      ease: 'power2.out'
    })
  })

  // 边框高亮
  const borderSegments = card.querySelectorAll('.npl-border-segment-230')
  borderSegments.forEach((segment, i) => {
    gsap.to(segment, {
      opacity: 1,
      duration: 0.25,
      delay: i * 0.04,
      ease: 'power2.out'
    })
  })

  // 图标等离子
  const iconPlasma = card.querySelector('.npl-icon-plasma-230') as HTMLElement
  if (iconPlasma) {
    gsap.to(iconPlasma, {
      scale: 1.6,
      opacity: 0.95,
      duration: 0.35,
      ease: 'elastic.out(1, 0.6)'
    })
  }

  // 能量核心
  const energyCore = card.querySelector('.npl-energy-core-230') as HTMLElement
  if (energyCore) {
    gsap.to(energyCore, {
      scale: 1.4,
      opacity: 0.9,
      duration: 0.35,
      ease: 'power2.out'
    })
  }

  // 能量条增强
  const levelFill = card.querySelector('.npl-level-fill-230') as HTMLElement
  if (levelFill) {
    gsap.to(levelFill, {
      filter: 'brightness(1.5) drop-shadow(0 0 12px currentColor)',
      duration: 0.25,
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
    duration: 0.55,
    ease: 'power3.out'
  })

  // 等离子复位
  const plasmaCore = card.querySelector('.npl-plasma-core-230') as HTMLElement
  const plasmaShell = card.querySelector('.npl-plasma-shell-230') as HTMLElement
  const plasmaAura = card.querySelector('.npl-plasma-aura-230') as HTMLElement

  if (plasmaCore) {
    gsap.to(plasmaCore, {
      scale: 1,
      opacity: 0.5,
      filter: 'blur(20px)',
      duration: 0.55,
      ease: 'power3.out'
    })
  }
  if (plasmaShell) {
    gsap.to(plasmaShell, {
      scale: 1,
      opacity: 0.3,
      duration: 0.55,
      ease: 'power3.out'
    })
  }
  if (plasmaAura) {
    gsap.to(plasmaAura, {
      scale: 1,
      opacity: 0.4,
      duration: 0.55,
      ease: 'power3.out'
    })
  }

  // 电弧复位
  const arcSegments = card.querySelectorAll('.npl-arc-segment-230')
  arcSegments.forEach((segment) => {
    gsap.to(segment, {
      opacity: 0.3,
      duration: 0.55,
      ease: 'power3.out'
    })
  })

  // 边框复位
  const borderSegments = card.querySelectorAll('.npl-border-segment-230')
  borderSegments.forEach((segment) => {
    gsap.to(segment, {
      opacity: 0.5,
      duration: 0.55,
      ease: 'power3.out'
    })
  })

  // 图标等离子复位
  const iconPlasma = card.querySelector('.npl-icon-plasma-230') as HTMLElement
  if (iconPlasma) {
    gsap.to(iconPlasma, {
      scale: 1,
      opacity: 0.4,
      duration: 0.55,
      ease: 'power3.out'
    })
  }

  // 能量核心复位
  const energyCore = card.querySelector('.npl-energy-core-230') as HTMLElement
  if (energyCore) {
    gsap.to(energyCore, {
      scale: 1,
      opacity: 0.6,
      duration: 0.55,
      ease: 'power3.out'
    })
  }

  // 能量条复位
  const levelFill = card.querySelector('.npl-level-fill-230') as HTMLElement
  if (levelFill) {
    gsap.to(levelFill, {
      filter: 'none',
      duration: 0.55,
      ease: 'power3.out'
    })
  }
}

onMounted(() => {
  ctx = gsap.context(() => {
    const titleEl = gsap.utils.toArray<HTMLElement>('.npl-title-230', componentRoot.value)
    const subtitleEl = gsap.utils.toArray<HTMLElement>('.npl-subtitle-230', componentRoot.value)
    const stageEl = gsap.utils.toArray<HTMLElement>('.npl-plasma-stage-230', componentRoot.value)
    const cards = gsap.utils.toArray<HTMLElement>('.npl-plasma-card-230', componentRoot.value)
    const plasmaClouds = gsap.utils.toArray<HTMLElement>('.npl-plasma-cloud-230', componentRoot.value)
    const particles = gsap.utils.toArray<HTMLElement>('.npl-particle-230', componentRoot.value)
    const gridLines = gsap.utils.toArray<HTMLElement>('.npl-grid-line-230', componentRoot.value)
    const cardNumbers = gsap.utils.toArray<HTMLElement>('.npl-number-230', componentRoot.value)
    const cardIcons = gsap.utils.toArray<HTMLElement>('.npl-icon-230', componentRoot.value)
    const cardTitles = gsap.utils.toArray<HTMLElement>('.npl-card-title-230', componentRoot.value)
    const cardDescs = gsap.utils.toArray<HTMLElement>('.npl-card-desc-230', componentRoot.value)
    const levelBars = gsap.utils.toArray<HTMLElement>('.npl-level-fill-230', componentRoot.value)
    const plasmaBars = gsap.utils.toArray<HTMLElement>('.npl-plasma-bar-230', componentRoot.value)

    // 标题动画
    if (titleEl.length) {
      gsap.from(titleEl, {
        scrollTrigger: {
          trigger: componentRoot.value,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        y: 90,
        opacity: 0,
        scale: 0.85,
        duration: 1.3,
        ease: 'elastic.out(1, 0.7)'
      })

      // 标题等离子脉冲
      gsap.to(titleEl, {
        filter: 'drop-shadow(0 0 35px #00ffff) drop-shadow(0 0 70px #ff00ff)',
        duration: 0.9,
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
        y: 45,
        opacity: 0,
        duration: 1.1,
        delay: 0.25,
        ease: 'power3.out'
      })
    }

    // 等离子背景动画
    if (plasmaClouds.length) {
      plasmaClouds.forEach((cloud, index) => {
        gsap.from(cloud, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          },
          scale: 0,
          opacity: 0,
          duration: 2,
          delay: index * 0.2,
          ease: 'back.out(2)'
        })

        // 等离子云持续波动
        gsap.to(cloud, {
          x: '20%',
          y: '10%',
          duration: 12 + index * 4,
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
        duration: 1.4,
        stagger: {
          each: 0.06,
          from: 'random'
        },
        ease: 'back.out(1.7)'
      })

      // 粒子持续飘浮
      particles.forEach((particle) => {
        const yMove = -70 - Math.random() * 130
        gsap.to(particle, {
          y: yMove,
          opacity: 0,
          duration: 11 + Math.random() * 7,
          repeat: -1,
          ease: 'none'
        })
      })
    }

    // 能量网格动画
    if (gridLines.length) {
      gsap.from(gridLines, {
        scrollTrigger: {
          trigger: stageEl[0] || componentRoot.value,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        scaleX: 0,
        opacity: 0,
        duration: 1.6,
        stagger: 0.12,
        ease: 'power3.out'
      })

      // 网格线持续闪烁
      gridLines.forEach((line) => {
        gsap.to(line, {
          opacity: 0.3,
          duration: 0.5,
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
        y: 130,
        opacity: 0,
        scale: 0.65,
        rotationX: 50,
        duration: 1.4,
        stagger: 0.16,
        ease: 'back.out(1.8)'
      })

      // 卡片持续悬浮
      cards.forEach((card, index) => {
        gsap.to(card, {
          y: -11,
          duration: 2.3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: index * 0.28
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
        x: -45,
        opacity: 0,
        duration: 0.85,
        stagger: 0.16,
        delay: 0.7,
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
        rotation: -200,
        opacity: 0,
        duration: 0.85,
        stagger: 0.16,
        delay: 0.9,
        ease: 'elastic.out(1, 0.6)'
      })

      // 图标持续脉动
      cardIcons.forEach((icon) => {
        gsap.to(icon, {
          scale: 1.12,
          filter: 'brightness(1.35)',
          duration: 0.7,
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
        y: 32,
        opacity: 0,
        duration: 0.75,
        stagger: 0.16,
        delay: 1.1,
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
        y: 27,
        opacity: 0,
        duration: 0.75,
        stagger: 0.16,
        delay: 1.3,
        ease: 'power3.out'
      })
    }

    // 能量等级动画
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
          duration: 1.15,
          stagger: 0.16,
          delay: 1.5,
          ease: 'elastic.out(1, 0.7)'
        }
      )
    }

    // 等离子条动画
    if (plasmaBars.length) {
      gsap.from(plasmaBars, {
        scrollTrigger: {
          trigger: stageEl[0] || componentRoot.value,
          start: 'top 65%',
          toggleActions: 'play none none reverse'
        },
        scaleX: 0,
        duration: 0.95,
        stagger: 0.16,
        delay: 1.7,
        ease: 'power3.out'
      })

      // 等离子条持续流动
      const barSegments = gsap.utils.toArray<HTMLElement>('.npl-bar-segment-230', componentRoot.value)
      barSegments.forEach((segment) => {
        gsap.to(segment, {
          x: '100%',
          duration: 1.6,
          repeat: -1,
          ease: 'power2.inOut'
        })
      })
    }

    // 滚动控制等离子强度
    if (stageEl.length) {
      ScrollTrigger.create({
        trigger: stageEl[0],
        start: 'top 85%',
        end: 'bottom 20%',
        onUpdate: (self) => {
          const progress = self.progress

          // 卡片等离子随滚动增强
          cards.forEach((card) => {
            const plasmaCore = card.querySelector('.npl-plasma-core-230') as HTMLElement
            if (plasmaCore) {
              gsap.to(plasmaCore, {
                opacity: 0.3 + progress * 0.4,
                scale: 1 + progress * 0.35,
                duration: 0.25,
                ease: 'power1.out'
              })
            }
          })

          // 能量网格加速
          gridLines.forEach((line) => {
            gsap.to(line, {
              opacity: 0.2 + progress * 0.2,
              duration: 0.25,
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
.neon-plasma-section-230 {
  min-height: 100vh;
  padding: 100px 20px;
  background: linear-gradient(180deg, #09091a 0%, #121228 30%, #09091a 60%, #121228 100%);
  position: relative;
  overflow: hidden;
}

.npl-container-230 {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  z-index: 1;
}

.npl-title-230 {
  text-align: center;
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 900;
  margin-bottom: 15px;
  background: linear-gradient(135deg, #00ffff, #ff00ff, #ffd700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.12em;
}

.npl-subtitle-230 {
  text-align: center;
  font-size: 1.25rem;
  color: rgba(0, 255, 255, 0.8);
  margin-bottom: 90px;
  letter-spacing: 0.65em;
  text-transform: uppercase;
}

.npl-plasma-stage-230 {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 2000px;
}

/* 等离子背景 */
.npl-plasma-background-230 {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.npl-plasma-cloud-230 {
  position: absolute;
  width: 130%;
  height: 100%;
  top: 0;
  left: -15%;
  opacity: 0.15;

  &[data-cloud="1"] {
    background: radial-gradient(ellipse at 40% 50%, #00ffff25, transparent 65%);
  }

  &[data-cloud="2"] {
    background: radial-gradient(ellipse at 60% 40%, #ff00ff25, transparent 65%);
    top: 25%;
  }

  &[data-cloud="3"] {
    background: radial-gradient(ellipse at 50% 70%, #ffd70025, transparent 65%);
    top: 45%;
  }

  &[data-cloud="4"] {
    background: radial-gradient(ellipse at 30% 60%, #00ff0025, transparent 65%);
    top: 65%;
  }
}

/* 粒子 */
.npl-plasma-particles-230 {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.npl-particle-230 {
  position: absolute;
  border-radius: 50%;
  filter: blur(1px);
}

/* 能量网格 */
.npl-energy-grid-230 {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.npl-grid-line-230 {
  position: absolute;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.15), transparent);

  &[data-line="1"] { top: 15%; }
  &[data-line="2"] { top: 30%; }
  &[data-line="3"] { top: 45%; }
  &[data-line="4"] { top: 60%; }
  &[data-line="5"] { top: 75%; }
  &[data-line="6"] { top: 90%; }
  &[data-line="7"] { top: 50%; transform: rotate(90deg); width: 50%; left: 25%; }
  &[data-line="8"] { top: 50%; transform: rotate(90deg); width: 30%; left: 35%; }
}

/* 卡片网格 */
.npl-cards-grid-230 {
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 42px;
  max-width: 1220px;
  z-index: 2;
  padding: 40px 0;
}

.npl-plasma-card-230 {
  position: relative;
  min-height: 425px;
  background: rgba(10, 10, 30, 0.88);
  backdrop-filter: blur(22px);
  border-radius: 26px;
  overflow: hidden;
  cursor: pointer;
  transform-style: preserve-3d;
  border: 1px solid var(--card-color);
  transition: border-color 0.5s ease;

  &:hover {
    border-color: var(--card-glow);
  }
}

/* 等离子层 */
.npl-plasma-layer-230 {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.npl-plasma-core-230 {
  position: absolute;
  inset: -30px;
  opacity: 0.5;
  filter: blur(20px);
  background: radial-gradient(circle, var(--plasma-color) 0%, transparent 60%);
  transition: all 0.35s ease;
}

.npl-plasma-shell-230 {
  position: absolute;
  inset: -60px;
  opacity: 0.3;
  filter: blur(50px);
  background: radial-gradient(circle, var(--card-glow) 0%, transparent 70%);
  transition: all 0.35s ease;
}

.npl-plasma-aura-230 {
  position: absolute;
  inset: -90px;
  opacity: 0.4;
  filter: blur(80px);
  background: radial-gradient(circle, var(--card-color) 0%, transparent 80%);
  transition: all 0.35s ease;
}

/* 电弧效果 */
.npl-arc-layer-230 {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.npl-arc-segment-230 {
  position: absolute;
  opacity: 0.3;
  filter: blur(1px);
  transition: all 0.25s ease;

  &[data-arc="1"] {
    top: 20%;
    left: 10%;
    width: 60%;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--card-color), transparent);
  }

  &[data-arc="2"] {
    top: 40%;
    right: 15%;
    width: 50%;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--card-glow), transparent);
  }

  &[data-arc="3"] {
    bottom: 30%;
    left: 20%;
    width: 55%;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--plasma-color), transparent);
  }

  &[data-arc="4"] {
    top: 30%;
    left: 50%;
    width: 1px;
    height: 40%;
    background: linear-gradient(180deg, transparent, var(--card-color), transparent);
  }

  &[data-arc="5"] {
    top: 50%;
    right: 30%;
    width: 1px;
    height: 35%;
    background: linear-gradient(180deg, transparent, var(--card-glow), transparent);
  }

  &[data-arc="6"] {
    bottom: 20%;
    left: 40%;
    width: 1px;
    height: 30%;
    background: linear-gradient(180deg, transparent, var(--plasma-color), transparent);
  }
}

/* 边框光效 */
.npl-border-glow-230 {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.npl-border-segment-230 {
  position: absolute;
  opacity: 0.5;
  transition: all 0.25s ease;

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
.npl-card-content-230 {
  position: relative;
  z-index: 2;
  padding: 42px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  height: 100%;
}

.npl-card-number-230 {
  position: absolute;
  top: 22px;
  left: 28px;
  display: flex;
  align-items: center;
  gap: 14px;
}

.npl-number-230 {
  font-size: 3rem;
  font-weight: 900;
  background: linear-gradient(135deg, var(--card-color), var(--card-glow));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  filter: drop-shadow(0 0 18px var(--card-glow));
}

.npl-number-line-230 {
  width: 45px;
  height: 2px;
  background: linear-gradient(90deg, var(--card-color), transparent);
}

.npl-card-icon-230 {
  position: relative;
  font-size: 4.4rem;
  margin-bottom: 28px;
  filter: drop-shadow(0 0 32px var(--card-glow));
}

.npl-icon-plasma-230 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 95px;
  height: 95px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--plasma-color)40 0%, transparent 70%);
  opacity: 0.4;
  transition: all 0.35s ease;
}

.npl-card-title-230 {
  font-size: 1.75rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 14px;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  text-shadow: 0 0 22px var(--card-glow);
}

.npl-card-desc-230 {
  font-size: 1.02rem;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.19em;
  margin-bottom: 32px;
  line-height: 1.65;
}

/* 等离子能量 */
.npl-plasma-energy-230 {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 28px;
}

.npl-energy-core-230 {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--card-color) 0%, transparent 70%);
  filter: blur(4px);
  transition: all 0.35s ease;
}

.npl-energy-level-230 {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
}

.npl-level-bar-230 {
  flex: 1;
  height: 5px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2.5px;
  overflow: hidden;
  position: relative;
}

.npl-level-fill-230 {
  height: 100%;
  background: linear-gradient(90deg, var(--card-color), var(--card-glow));
  border-radius: 2.5px;
  position: relative;
  overflow: hidden;
  transition: all 0.25s ease;
}

.npl-level-pulse-230 {
  position: absolute;
  top: 0;
  left: 0;
  width: 45px;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.9), transparent);
  animation: levelPulse 1.8s linear infinite;
}

@keyframes levelPulse {
  to { transform: translateX(350%); }
}

.npl-level-value-230 {
  font-size: 1.25rem;
  font-weight: 900;
  background: linear-gradient(135deg, #00ffff, #ff00ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  min-width: 55px;
}

/* 标签 */
.npl-card-tags-230 {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
  margin-top: auto;
}

.npl-tag-230 {
  padding: 9px 20px;
  border: 1px solid;
  border-radius: 22px;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  display: inline-block;
  align-self: center;
  background: rgba(0, 0, 0, 0.45);
}

.npl-ion-badge-230 {
  padding: 7px 18px;
  border-radius: 18px;
  font-size: 0.82rem;
  font-weight: 900;
  letter-spacing: 0.12em;
  background: linear-gradient(135deg, var(--card-color), var(--card-glow));
  color: #000;
  display: inline-block;
  align-self: center;
}

/* 等离子条 */
.npl-plasma-bar-230 {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  overflow: hidden;
}

.npl-bar-segment-230 {
  position: absolute;
  top: 0;
  left: 0;
  width: 75px;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.92), transparent);
}

/* 滚动提示 */
.npl-scroll-hint-230 {
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  z-index: 3;
}

.npl-hint-plasma-230 {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--card-color)30 0%, transparent 70%);
  animation: hintPlasma 2s ease-in-out infinite;
}

@keyframes hintPlasma {
  0%, 100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.4);
    opacity: 0;
  }
}

.npl-hint-text-230 {
  font-size: 0.78rem;
  color: rgba(0, 255, 255, 0.85);
  letter-spacing: 0.42em;
  text-transform: uppercase;
}

@media (max-width: 768px) {
  .npl-cards-grid-230 {
    grid-template-columns: 1fr;
    gap: 38px;
  }

  .npl-plasma-card-230 {
    min-height: 385px;
  }

  .npl-card-icon-230 {
    font-size: 3.6rem;
  }

  .npl-card-title-230 {
    font-size: 1.45rem;
  }

  .npl-number-230 {
    font-size: 2.1rem;
  }
}
</style>
