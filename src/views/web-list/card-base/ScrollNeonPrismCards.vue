<template>
  <div class="neon-prism-section-228" ref="componentRoot">
    <div class="npr-container-228">
      <h2 class="npr-title-228">霓虹棱镜</h2>
      <p class="npr-subtitle-228">Neon Prism Cards</p>

      <div class="npr-prism-stage-228">
        <!-- 动态光效背景 -->
        <div class="npr-aurora-background-228">
          <div class="npr-aurora-wave-228" v-for="i in 3" :key="i" :data-wave="i"></div>
        </div>

        <!-- 棱镜光晕 -->
        <div class="npr-prism-glow-228">
          <div class="npr-glow-orb-228" v-for="i in 8" :key="i" :style="getOrbStyle(i)"></div>
        </div>

        <!-- 粒子星云 -->
        <div class="npr-nebula-particles-228">
          <div
            v-for="(particle, index) in particles"
            :key="index"
            class="npr-particle-228"
            :style="getParticleStyle(particle, index)"
          ></div>
        </div>

        <!-- 棱镜环系统 -->
        <div class="npr-prism-rings-228">
          <div class="npr-ring-228" v-for="i in 4" :key="i" :data-ring="i"></div>
        </div>

        <!-- 卡片网格 -->
        <div class="npr-cards-grid-228">
          <div
            v-for="(card, index) in cards"
            :key="index"
            class="npr-prism-card-228"
            :ref="el => { if (el) cardRefs[index] = el as HTMLElement }"
            :data-card="index"
            :style="{ '--card-color': card.primaryColor, '--card-glow': card.glowColor }"
            @mousemove="handleCardHover($event, index)"
            @mouseleave="handleCardLeave(index)"
          >
            <!-- 棱镜光层 -->
            <div class="npr-prism-layer-228">
              <div class="npr-prism-reflection-228"></div>
              <div class="npr-prism-refraction-228"></div>
              <div class="npr-prism-dispersion-228"></div>
            </div>

            <!-- 霓虹光晕 -->
            <div class="npr-card-neon-228"></div>
            <div class="npr-card-aura-228"></div>

            <!-- 棱镜边框 -->
            <div class="npr-prism-border-228">
              <div class="npr-border-segment-228" v-for="i in 4" :key="i" :data-side="i"></div>
            </div>

            <!-- 卡片内容 -->
            <div class="npr-card-content-228">
              <div class="npr-card-number-228">
                <span class="npr-number-text-228">{{ String(index + 1).padStart(2, '0') }}</span>
                <div class="npr-number-glow-228"></div>
              </div>

              <div class="npr-card-icon-228">
                <div class="npr-icon-orb-228"></div>
                <span class="npr-icon-228">{{ card.icon }}</span>
              </div>

              <h3 class="npr-card-title-228">{{ card.title }}</h3>
              <p class="npr-card-desc-228">{{ card.description }}</p>

              <!-- 能量条 -->
              <div class="npr-energy-bar-228">
                <div class="npr-energy-track-228"></div>
                <div class="npr-energy-fill-228" :style="{ width: `${card.energy}%` }">
                  <div class="npr-energy-pulse-228"></div>
                </div>
              </div>

              <!-- 标签 -->
              <div class="npr-card-tags-228">
                <span class="npr-tag-228" :style="{ borderColor: card.tagColor, color: card.tagColor }">
                  {{ card.category }}
                </span>
                <span class="npr-stat-228">
                  <span class="npr-stat-value-228">{{ card.energy }}</span>
                  <span class="npr-stat-label-228">能量</span>
                </span>
              </div>
            </div>

            <!-- 底部霓虹线 -->
            <div class="npr-neon-line-228">
              <div class="npr-line-segment-228"></div>
            </div>
          </div>
        </div>

        <!-- 滚动提示 -->
        <div class="npr-scroll-hint-228">
          <div class="npr-hint-icon-228">⟳</div>
          <div class="npr-hint-text-228">SCROLL TO EXPLORE</div>
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
  primaryColor: string
  glowColor: string
  tagColor: string
}

const cards: Card[] = [
  {
    icon: '💎',
    title: '钻石',
    description: 'Diamond Radiance',
    category: 'CRYSTAL',
    energy: 98,
    primaryColor: '#00d4ff',
    glowColor: 'rgba(0, 212, 255, 0.6)',
    tagColor: '#00d4ff'
  },
  {
    icon: '🔮',
    title: '水晶球',
    description: 'Crystal Orb',
    category: 'MYSTIC',
    energy: 95,
    primaryColor: '#ff00ff',
    glowColor: 'rgba(255, 0, 255, 0.6)',
    tagColor: '#ff00ff'
  },
  {
    icon: '⭐',
    title: '星光',
    description: 'Starlight',
    category: 'STELLAR',
    energy: 92,
    primaryColor: '#ffd700',
    glowColor: 'rgba(255, 215, 0, 0.6)',
    tagColor: '#ffd700'
  },
  {
    icon: '🌊',
    title: '海浪',
    description: 'Ocean Wave',
    category: 'AQUATIC',
    energy: 89,
    primaryColor: '#00ff88',
    glowColor: 'rgba(0, 255, 136, 0.6)',
    tagColor: '#00ff88'
  },
  {
    icon: '🌸',
    title: '樱花',
    description: 'Cherry Blossom',
    category: 'FLORAL',
    energy: 87,
    primaryColor: '#ff69b4',
    glowColor: 'rgba(255, 105, 180, 0.6)',
    tagColor: '#ff69b4'
  },
  {
    icon: '🔥',
    title: '烈焰',
    description: 'Blazing Fire',
    category: 'INFERNO',
    energy: 94,
    primaryColor: '#ff4500',
    glowColor: 'rgba(255, 69, 0, 0.6)',
    tagColor: '#ff4500'
  }
]

interface Particle {
  x: number
  y: number
  size: number
  speed: number
  delay: number
  rotation: number
}

const particles: Particle[] = Array.from({ length: 40 }, () => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 2 + Math.random() * 6,
  speed: 8 + Math.random() * 15,
  delay: Math.random() * 8,
  rotation: Math.random() * 360
}))

const getOrbStyle = (index: number) => {
  const colors = ['#00d4ff', '#ff00ff', '#ffd700', '#00ff88', '#ff69b4', '#ff4500', '#00bfff', '#ff1493']
  const positions = [
    { top: '5%', left: '10%' },
    { top: '15%', right: '12%' },
    { top: '45%', left: '5%' },
    { bottom: '10%', right: '8%' },
    { top: '30%', left: '70%' },
    { bottom: '25%', left: '45%' },
    { top: '65%', left: '20%' },
    { bottom: '5%', right: '30%' }
  ]
  return {
    ...positions[index - 1],
    background: `radial-gradient(circle, ${colors[index - 1]}40 0%, transparent 60%)`
  }
}

const getParticleStyle = (particle: Particle, index: number) => {
  const colors = ['#00d4ff', '#ff00ff', '#ffd700', '#00ff88', '#ff69b4', '#ff4500']
  return {
    left: `${particle.x}%`,
    top: `${particle.y}%`,
    width: `${particle.size}px`,
    height: `${particle.size}px`,
    background: `radial-gradient(circle, ${colors[index % colors.length]} 0%, transparent 70%)`,
    animationDelay: `${particle.delay}s`,
    transform: `rotate(${particle.rotation}deg)`
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
    rotateY: x * 15,
    rotateX: -y * 15,
    scale: 1.08,
    duration: 0.4,
    ease: 'power2.out'
  })

  // 霓虹光晕增强
  const neon = card.querySelector('.npr-card-neon-228') as HTMLElement
  if (neon) {
    gsap.to(neon, {
      opacity: 0.9,
      scale: 1.4,
      duration: 0.4,
      ease: 'power2.out'
    })
  }

  // 光环增强
  const aura = card.querySelector('.npr-card-aura-228') as HTMLElement
  if (aura) {
    gsap.to(aura, {
      opacity: 0.7,
      scale: 1.6,
      duration: 0.4,
      ease: 'power2.out'
    })
  }

  // 棱镜折射移动
  const refraction = card.querySelector('.npr-prism-refraction-228') as HTMLElement
  if (refraction) {
    gsap.to(refraction, {
      x: x * 40,
      y: y * 40,
      duration: 0.4,
      ease: 'power2.out'
    })
  }

  // 边框高亮
  const borderSegments = card.querySelectorAll('.npr-border-segment-228')
  borderSegments.forEach((segment, i) => {
    gsap.to(segment, {
      opacity: 1,
      scale: 1.15,
      duration: 0.3,
      delay: i * 0.05,
      ease: 'power2.out'
    })
  })

  // 图标光球放大
  const iconOrb = card.querySelector('.npr-icon-orb-228') as HTMLElement
  if (iconOrb) {
    gsap.to(iconOrb, {
      scale: 1.3,
      opacity: 0.9,
      duration: 0.4,
      ease: 'elastic.out(1, 0.5)'
    })
  }

  // 能量条增强
  const energyFill = card.querySelector('.npr-energy-fill-228') as HTMLElement
  if (energyFill) {
    gsap.to(energyFill, {
      filter: 'brightness(1.5) drop-shadow(0 0 10px currentColor)',
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

  // 霓虹光晕复位
  const neon = card.querySelector('.npr-card-neon-228') as HTMLElement
  if (neon) {
    gsap.to(neon, {
      opacity: 0.5,
      scale: 1,
      duration: 0.6,
      ease: 'power3.out'
    })
  }

  // 光环复位
  const aura = card.querySelector('.npr-card-aura-228') as HTMLElement
  if (aura) {
    gsap.to(aura, {
      opacity: 0.4,
      scale: 1,
      duration: 0.6,
      ease: 'power3.out'
    })
  }

  // 棱镜折射复位
  const refraction = card.querySelector('.npr-prism-refraction-228') as HTMLElement
  if (refraction) {
    gsap.to(refraction, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: 'power3.out'
    })
  }

  // 边框复位
  const borderSegments = card.querySelectorAll('.npr-border-segment-228')
  borderSegments.forEach((segment) => {
    gsap.to(segment, {
      opacity: 0.5,
      scale: 1,
      duration: 0.6,
      ease: 'power3.out'
    })
  })

  // 图标光球复位
  const iconOrb = card.querySelector('.npr-icon-orb-228') as HTMLElement
  if (iconOrb) {
    gsap.to(iconOrb, {
      scale: 1,
      opacity: 0.5,
      duration: 0.6,
      ease: 'power3.out'
    })
  }

  // 能量条复位
  const energyFill = card.querySelector('.npr-energy-fill-228') as HTMLElement
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
    const titleEl = gsap.utils.toArray<HTMLElement>('.npr-title-228', componentRoot.value)
    const subtitleEl = gsap.utils.toArray<HTMLElement>('.npr-subtitle-228', componentRoot.value)
    const stageEl = gsap.utils.toArray<HTMLElement>('.npr-prism-stage-228', componentRoot.value)
    const cards = gsap.utils.toArray<HTMLElement>('.npr-prism-card-228', componentRoot.value)
    const rings = gsap.utils.toArray<HTMLElement>('.npr-ring-228', componentRoot.value)
    const glowOrbs = gsap.utils.toArray<HTMLElement>('.npr-glow-orb-228', componentRoot.value)
    const particles = gsap.utils.toArray<HTMLElement>('.npr-particle-228', componentRoot.value)
    const cardNumbers = gsap.utils.toArray<HTMLElement>('.npr-number-text-228', componentRoot.value)
    const cardIcons = gsap.utils.toArray<HTMLElement>('.npr-icon-228', componentRoot.value)
    const cardTitles = gsap.utils.toArray<HTMLElement>('.npr-card-title-228', componentRoot.value)
    const cardDescs = gsap.utils.toArray<HTMLElement>('.npr-card-desc-228', componentRoot.value)
    const energyBars = gsap.utils.toArray<HTMLElement>('.npr-energy-fill-228', componentRoot.value)
    const neonLines = gsap.utils.toArray<HTMLElement>('.npr-neon-line-228', componentRoot.value)

    // 标题动画
    if (titleEl.length) {
      gsap.from(titleEl, {
        scrollTrigger: {
          trigger: componentRoot.value,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        y: 100,
        opacity: 0,
        scale: 0.8,
        rotationX: -45,
        duration: 1.5,
        ease: 'elastic.out(1, 0.6)'
      })

      // 标题霓虹闪烁
      gsap.to(titleEl, {
        filter: 'drop-shadow(0 0 25px #00d4ff) drop-shadow(0 0 50px #ff00ff)',
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })
    }

    if (subtitleEl.length) {
      gsap.from(subtitleEl, {
        scrollTrigger: {
          trigger: componentRoot.value,
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 1,
        delay: 0.2,
        ease: 'power3.out'
      })
    }

    // 极光背景动画
    const auroraWaves = gsap.utils.toArray<HTMLElement>('.npr-aurora-wave-228', componentRoot.value)
    if (auroraWaves.length) {
      auroraWaves.forEach((wave, index) => {
        gsap.from(wave, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          },
          scaleY: 0,
          opacity: 0,
          duration: 1.5,
          delay: index * 0.2,
          ease: 'power3.out',
          transformOrigin: 'center center'
        })

        // 极光持续波动
        gsap.to(wave, {
          x: '20%',
          duration: 8 + index * 2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        })
      })
    }

    // 光晕动画
    if (glowOrbs.length) {
      gsap.from(glowOrbs, {
        scrollTrigger: {
          trigger: stageEl[0] || componentRoot.value,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        scale: 0,
        opacity: 0,
        duration: 1.8,
        stagger: {
          each: 0.1,
          from: 'random'
        },
        ease: 'back.out(2)'
      })

      // 光晕持续脉动
      glowOrbs.forEach((orb) => {
        gsap.to(orb, {
          scale: 1.4,
          opacity: 0.7,
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
        duration: 1.3,
        stagger: {
          each: 0.06,
          from: 'random'
        },
        ease: 'back.out(1.8)'
      })

      // 粒子持续飘浮
      particles.forEach((particle) => {
        const yMove = -80 - Math.random() * 150
        const xMove = (Math.random() - 0.5) * 80
        gsap.to(particle, {
          y: yMove,
          x: xMove,
          rotation: 360,
          opacity: 0,
          duration: 12 + Math.random() * 8,
          repeat: -1,
          ease: 'none'
        })
      })
    }

    // 棱镜环动画
    if (rings.length) {
      gsap.from(rings, {
        scrollTrigger: {
          trigger: stageEl[0] || componentRoot.value,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        scale: 0,
        opacity: 0,
        rotation: -360,
        duration: 2,
        stagger: 0.25,
        ease: 'elastic.out(1, 0.5)'
      })

      // 环持续旋转
      rings.forEach((ring, index) => {
        gsap.to(ring, {
          rotation: 360,
          duration: 25 + index * 8,
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
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        },
        y: 150,
        opacity: 0,
        scale: 0.6,
        rotationX: 60,
        duration: 1.3,
        stagger: 0.18,
        ease: 'back.out(1.8)'
      })

      // 卡片持续浮动
      cards.forEach((card, index) => {
        gsap.to(card, {
          y: -12,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: index * 0.3
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
        x: -50,
        opacity: 0,
        duration: 0.9,
        stagger: 0.18,
        delay: 0.7,
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
        rotation: -360,
        opacity: 0,
        duration: 0.9,
        stagger: 0.18,
        delay: 0.9,
        ease: 'elastic.out(1, 0.5)'
      })

      // 图标持续脉动
      cardIcons.forEach((icon) => {
        gsap.to(icon, {
          scale: 1.15,
          filter: 'brightness(1.4)',
          duration: 1,
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
          start: 'top 65%',
          toggleActions: 'play none none reverse'
        },
        y: 35,
        opacity: 0,
        duration: 0.8,
        stagger: 0.18,
        delay: 1.1,
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
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.18,
        delay: 1.3,
        ease: 'power3.out'
      })
    }

    // 能量条动画
    if (energyBars.length) {
      gsap.fromTo(energyBars,
        { width: 0 },
        {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 60%',
            toggleActions: 'play none none reverse'
          },
          width: (index) => `${cards[index as number]?.dataset.card ? (cards[index as number] as HTMLElement)?.getAttribute('data-card') : '0'}%`,
          duration: 1.2,
          stagger: 0.18,
          delay: 1.5,
          ease: 'elastic.out(1, 0.6)'
        }
      )
    }

    // 霓虹线动画
    if (neonLines.length) {
      gsap.from(neonLines, {
        scrollTrigger: {
          trigger: stageEl[0] || componentRoot.value,
          start: 'top 60%',
          toggleActions: 'play none none reverse'
        },
        scaleX: 0,
        duration: 1,
        stagger: 0.18,
        delay: 1.7,
        ease: 'power3.out'
      })

      // 霓虹线脉冲
      const lineSegments = gsap.utils.toArray<HTMLElement>('.npr-line-segment-228', componentRoot.value)
      lineSegments.forEach((segment) => {
        gsap.to(segment, {
          x: '100%',
          duration: 2,
          repeat: -1,
          ease: 'power2.inOut'
        })
      })
    }

    // 滚动控制光效强度
    if (stageEl.length) {
      ScrollTrigger.create({
        trigger: stageEl[0],
        start: 'top 80%',
        end: 'bottom 20%',
        onUpdate: (self) => {
          const progress = self.progress

          // 卡片霓虹强度随滚动增强
          cards.forEach((card) => {
            const neon = card.querySelector('.npr-card-neon-228') as HTMLElement
            if (neon) {
              gsap.to(neon, {
                opacity: 0.3 + progress * 0.5,
                scale: 1 + progress * 0.4,
                duration: 0.3,
                ease: 'power1.out'
              })
            }
          })

          // 棱镜环旋转加速
          rings.forEach((ring, index) => {
            const currentRotation = gsap.getProperty(ring, 'rotation') as number
            gsap.to(ring, {
              rotation: currentRotation + (1 + progress * 4) * (index % 2 === 0 ? 1 : -1),
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
  // 清理事件监听器
  eventListeners.forEach(({ element, event, handler }) => {
    element.removeEventListener(event, handler)
  })
  eventListeners.length = 0
})
</script>

<style scoped lang="scss">
.neon-prism-section-228 {
  min-height: 100vh;
  padding: 100px 20px;
  background: linear-gradient(180deg, #050510 0%, #0d0d20 30%, #050510 60%, #0d0d20 100%);
  position: relative;
  overflow: hidden;
}

.npr-container-228 {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  z-index: 1;
}

.npr-title-228 {
  text-align: center;
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 900;
  margin-bottom: 15px;
  background: linear-gradient(135deg, #00d4ff, #ff00ff, #ffd700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.08em;
}

.npr-subtitle-228 {
  text-align: center;
  font-size: 1.3rem;
  color: rgba(0, 212, 255, 0.8);
  margin-bottom: 90px;
  letter-spacing: 0.5em;
  text-transform: uppercase;
}

.npr-prism-stage-228 {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 2000px;
}

/* 极光背景 */
.npr-aurora-background-228 {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.npr-aurora-wave-228 {
  position: absolute;
  width: 150%;
  height: 100%;
  top: 0;
  left: -25%;
  opacity: 0.15;

  &[data-wave="1"] {
    background: linear-gradient(180deg, transparent, #00d4ff33, transparent);
    transform: rotate(-15deg);
  }

  &[data-wave="2"] {
    background: linear-gradient(180deg, transparent, #ff00ff33, transparent);
    transform: rotate(15deg);
    top: 30%;
  }

  &[data-wave="3"] {
    background: linear-gradient(180deg, transparent, #ffd70033, transparent);
    transform: rotate(-10deg);
    top: 60%;
  }
}

/* 光晕 */
.npr-prism-glow-228 {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.npr-glow-orb-228 {
  position: absolute;
  width: 350px;
  height: 350px;
  border-radius: 50%;
  filter: blur(50px);
}

/* 粒子 */
.npr-nebula-particles-228 {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.npr-particle-228 {
  position: absolute;
  border-radius: 50%;
  filter: blur(1px);
}

/* 棱镜环 */
.npr-prism-rings-228 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.npr-ring-228 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;

  &[data-ring="1"] {
    width: 500px;
    height: 500px;
    border: 2px solid rgba(0, 212, 255, 0.15);
    border-style: dashed;
  }

  &[data-ring="2"] {
    width: 700px;
    height: 700px;
    border: 2px solid rgba(255, 0, 255, 0.1);
  }

  &[data-ring="3"] {
    width: 900px;
    height: 900px;
    border: 2px solid rgba(255, 215, 0, 0.08);
    border-style: dotted;
  }

  &[data-ring="4"] {
    width: 1100px;
    height: 1100px;
    border: 1px solid rgba(0, 255, 136, 0.05);
  }
}

/* 卡片网格 */
.npr-cards-grid-228 {
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 45px;
  max-width: 1250px;
  z-index: 2;
  padding: 40px 0;
}

.npr-prism-card-228 {
  position: relative;
  min-height: 440px;
  background: rgba(10, 10, 25, 0.9);
  backdrop-filter: blur(25px);
  border-radius: 28px;
  overflow: hidden;
  cursor: pointer;
  transform-style: preserve-3d;
  border: 1px solid var(--card-color);
  transition: border-color 0.5s ease;

  &:hover {
    border-color: var(--card-glow);
  }
}

/* 棱镜光层 */
.npr-prism-layer-228 {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.npr-prism-reflection-228 {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    transparent 0%,
    rgba(255, 255, 255, 0.03) 50%,
    transparent 100%
  );
  animation: reflectionMove 4s ease-in-out infinite;
}

@keyframes reflectionMove {
  0%, 100% {
    transform: translateX(-100%) translateY(-100%);
  }
  50% {
    transform: translateX(100%) translateY(100%);
  }
}

.npr-prism-refraction-228 {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0) 25%, rgba(0, 0, 0, 0.3) 100%);
  transition: transform 0.4s ease;
}

.npr-prism-dispersion-228 {
  position: absolute;
  inset: 0;
  background: conic-gradient(
    from 0deg,
    transparent,
    var(--card-color) 20%,
    transparent,
    var(--card-color) 20%,
    transparent
  );
  animation: dispersionRotate 10s linear infinite;
  opacity: 0.5;
}

@keyframes dispersionRotate {
  to { transform: rotate(360deg); }
}

/* 霓虹光晕 */
.npr-card-neon-228 {
  position: absolute;
  inset: -60px;
  opacity: 0.3;
  filter: blur(80px);
  background: radial-gradient(circle, var(--card-glow) 0%, transparent 60%);
  transition: all 0.4s ease;
  pointer-events: none;
}

.npr-card-aura-228 {
  position: absolute;
  inset: -20px;
  opacity: 0.2;
  filter: blur(40px);
  background: radial-gradient(circle, var(--card-color)40 0%, transparent 60%);
  transition: all 0.4s ease;
  pointer-events: none;
}

/* 棱镜边框 */
.npr-prism-border-228 {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.npr-border-segment-228 {
  position: absolute;
  opacity: 0.5;
  transition: all 0.3s ease;

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
.npr-card-content-228 {
  position: relative;
  z-index: 2;
  padding: 45px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  height: 100%;
}

.npr-card-number-228 {
  position: absolute;
  top: 25px;
  left: 30px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.npr-number-text-228 {
  font-size: 3.2rem;
  font-weight: 900;
  background: linear-gradient(135deg, var(--card-color), var(--card-glow));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  filter: drop-shadow(0 0 20px var(--card-glow));
}

.npr-number-glow-228 {
  width: 50px;
  height: 2px;
  background: linear-gradient(90deg, var(--card-color), transparent);
}

.npr-card-icon-228 {
  position: relative;
  font-size: 4.8rem;
  margin-bottom: 30px;
  filter: drop-shadow(0 0 35px var(--card-glow));
}

.npr-icon-orb-228 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--card-color)30 0%, transparent 70%);
  opacity: 0.5;
  transition: all 0.4s ease;
}

.npr-card-title-228 {
  font-size: 1.9rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 15px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  text-shadow: 0 0 25px var(--card-glow);
}

.npr-card-desc-228 {
  font-size: 1.05rem;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.18em;
  margin-bottom: 30px;
  line-height: 1.7;
}

/* 能量条 */
.npr-energy-bar-228 {
  width: 100%;
  height: 4px;
  margin-bottom: 25px;
  position: relative;
}

.npr-energy-track-228 {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.npr-energy-fill-228 {
  position: relative;
  height: 100%;
  background: linear-gradient(90deg, var(--card-color), var(--card-glow));
  border-radius: 2px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.npr-energy-pulse-228 {
  position: absolute;
  top: 0;
  left: 0;
  width: 60px;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
  animation: energyPulse 2s linear infinite;
}

@keyframes energyPulse {
  to { transform: translateX(400%); }
}

/* 标签 */
.npr-card-tags-228 {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  margin-top: auto;
}

.npr-tag-228 {
  padding: 10px 20px;
  border: 1px solid;
  border-radius: 25px;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  display: inline-block;
  align-self: center;
  background: rgba(0, 0, 0, 0.4);
}

.npr-stat-228 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.npr-stat-value-228 {
  font-size: 2.2rem;
  font-weight: 900;
  background: linear-gradient(135deg, #ffd700, #ff6b00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

.npr-stat-label-228 {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

/* 霓虹线 */
.npr-neon-line-228 {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  overflow: hidden;
}

.npr-line-segment-228 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100px;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.9), transparent);
}

/* 滚动提示 */
.npr-scroll-hint-228 {
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  z-index: 3;
}

.npr-hint-icon-228 {
  font-size: 2rem;
  color: rgba(0, 212, 255, 0.8);
  animation: hintSpin 2s linear infinite;
}

@keyframes hintSpin {
  to { transform: rotate(360deg); }
}

.npr-hint-text-228 {
  font-size: 0.8rem;
  color: rgba(0, 212, 255, 0.7);
  letter-spacing: 0.35em;
  text-transform: uppercase;
  animation: hintPulse 2s ease-in-out infinite;
}

@keyframes hintPulse {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .npr-cards-grid-228 {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .npr-prism-card-228 {
    min-height: 400px;
  }

  .npr-card-icon-228 {
    font-size: 3.8rem;
  }

  .npr-card-title-228 {
    font-size: 1.6rem;
  }

  .npr-number-text-228 {
    font-size: 2.2rem;
  }

  .npr-ring-228 {
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

    &[data-ring="4"] {
      width: 600px;
      height: 600px;
    }
  }
}
</style>
