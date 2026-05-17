<template>
  <div class="snm-neon-matrix-section-168" ref="componentRoot">
    <div class="snm-container-168">
      <h2 class="snm-title-168">霓虹矩阵</h2>
      <p class="snm-subtitle-168">Neon Matrix</p>

      <div class="snm-matrix-stage-168">
        <div class="snm-matrix-grid-168">
          <div
            v-for="(cell, index) in matrixCells"
            :key="index"
            class="snm-matrix-cell-168"
            :ref="el => { if (el) cellRefs[index] = el as HTMLElement }"
            :data-cell="index"
            @mouseenter="handleCellEnter(index)"
            @mouseleave="handleCellLeave(index)"
          >
            <div class="snm-cell-glow-168"></div>
            <div class="snm-cell-content-168">{{ cell.value }}</div>
          </div>
        </div>

        <div class="snm-matrix-cards-168">
          <div
            v-for="(card, index) in cards"
            :key="index"
            class="snm-matrix-card-168"
            :ref="el => { if (el) cardRefs[index] = el as HTMLElement }"
          >
            <div class="snm-card-header-168">
              <span class="snm-card-id-168">{{ String(index + 1).padStart(2, '0') }}</span>
              <div class="snm-card-dots-168">
                <div class="snm-dot-168" v-for="i in 3" :key="i"></div>
              </div>
            </div>
            <div class="snm-card-body-168">
              <div class="snm-card-icon-168">{{ card.icon }}</div>
              <h3 class="snm-card-title-168">{{ card.title }}</h3>
              <p class="snm-card-desc-168">{{ card.description }}</p>
            </div>
            <div class="snm-card-bar-168">
              <div class="snm-bar-fill-168" :style="{ width: card.progress + '%' }"></div>
            </div>
          </div>
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
const cellRefs = ref<HTMLElement[]>([])
const cardRefs = ref<HTMLElement[]>([])

const matrixCells = Array.from({ length: 64 }, (_, i) => ({
  value: Math.floor(Math.random() * 2)
}))

interface Card {
  icon: string
  title: string
  description: string
  progress: number
}

const cards: Card[] = [
  {
    icon: '🎯',
    title: '精准',
    description: 'PRECISION',
    progress: 85
  },
  {
    icon: '⚡',
    title: '速度',
    description: 'VELOCITY',
    progress: 92
  },
  {
    icon: '🔥',
    title: '激情',
    description: 'PASSION',
    progress: 78
  },
  {
    icon: '💎',
    title: '品质',
    description: 'QUALITY',
    progress: 95
  }
]

let gsapCtx: gsap.Context
let matrixInterval: number | null = null

const handleCellEnter = (index: number) => {
  const cell = cellRefs.value[index]
  if (!cell) return

  gsap.to(cell, {
    scale: 1.2,
    boxShadow: '0 0 30px rgba(0, 255, 255, 0.8)',
    duration: 0.3,
    ease: 'power2.out'
  })

  const glow = cell.querySelector('.snm-cell-glow-168') as HTMLElement
  if (glow) {
    gsap.to(glow, {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out'
    })
  }
}

const handleCellLeave = (index: number) => {
  const cell = cellRefs.value[index]
  if (!cell) return

  gsap.to(cell, {
    scale: 1,
    boxShadow: '0 0 10px rgba(0, 255, 255, 0.3)',
    duration: 0.3,
    ease: 'power2.out'
  })

  const glow = cell.querySelector('.snm-cell-glow-168') as HTMLElement
  if (glow) {
    gsap.to(glow, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.out'
    })
  }
}

const animateMatrix = () => {
  cellRefs.value.forEach((cell, index) => {
    if (!cell) return

    const shouldUpdate = Math.random() > 0.7
    if (shouldUpdate) {
      const content = cell.querySelector('.snm-cell-content-168') as HTMLElement
      if (content) {
        content.textContent = Math.random() > 0.5 ? '1' : '0'
      }
    }
  })
}

onMounted(() => {
  setTimeout(() => {
    if (!componentRoot.value) return

    matrixInterval = window.setInterval(animateMatrix, 200)

    gsapCtx = gsap.context(() => {
      const titleEl = gsap.utils.toArray<HTMLElement>('.snm-title-168', componentRoot.value)
      const subtitleEl = gsap.utils.toArray<HTMLElement>('.snm-subtitle-168', componentRoot.value)
      const matrixCells = gsap.utils.toArray<HTMLElement>('.snm-matrix-cell-168', componentRoot.value)
      const stageEl = gsap.utils.toArray<HTMLElement>('.snm-matrix-stage-168', componentRoot.value)
      const matrixCards = gsap.utils.toArray<HTMLElement>('.snm-matrix-card-168', componentRoot.value)
      const cardIds = gsap.utils.toArray<HTMLElement>('.snm-card-id-168', componentRoot.value)
      const cardIcons = gsap.utils.toArray<HTMLElement>('.snm-card-icon-168', componentRoot.value)
      const cardTitles = gsap.utils.toArray<HTMLElement>('.snm-card-title-168', componentRoot.value)
      const cardDescs = gsap.utils.toArray<HTMLElement>('.snm-card-desc-168', componentRoot.value)
      const barFills = gsap.utils.toArray<HTMLElement>('.snm-bar-fill-168', componentRoot.value)

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

        gsap.to(titleEl, {
          textShadow: '0 0 20px #00ffff, 0 0 40px #00ffff',
          duration: 0.5,
          repeat: -1,
          yoyo: true,
          ease: 'power2.inOut'
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

      if (matrixCells.length) {
        gsap.from(matrixCells, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          },
          scale: 0,
          opacity: 0,
          duration: 0.5,
          stagger: {
            each: 0.01,
            from: 'random'
          },
          ease: 'back.out(1.7)'
        })

        matrixCells.forEach((cell, index) => {
          gsap.to(cell, {
            opacity: 0.3 + Math.random() * 0.7,
            duration: 0.3,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut',
            delay: index * 0.01
          })
        })
      }

      if (matrixCards.length) {
        gsap.from(matrixCards, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 60%',
            toggleActions: 'play none none reverse'
          },
          y: 80,
          opacity: 0,
          duration: 1,
          stagger: 0.2,
          ease: 'back.out(1.7)'
        })
      }

      if (cardIds.length) {
        gsap.from(cardIds, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 60%',
            toggleActions: 'play none none reverse'
          },
          x: -30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
          delay: 0.5,
          ease: 'power3.out'
        })
      }

      if (cardIcons.length) {
        gsap.from(cardIcons, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 60%',
            toggleActions: 'play none none reverse'
          },
          scale: 0,
          rotation: 180,
          duration: 0.8,
          stagger: 0.2,
          delay: 0.7,
          ease: 'back.out(2)'
        })
      }

      if (cardTitles.length) {
        gsap.from(cardTitles, {
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
          delay: 1.1,
          ease: 'power3.out'
        })
      }

      if (barFills.length) {
        gsap.from(barFills, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 60%',
            toggleActions: 'play none none reverse'
          },
          width: 0,
          duration: 1.5,
          stagger: 0.2,
          delay: 1.3,
          ease: 'power2.out'
        })
      }
    }, componentRoot.value)
  }, 100)
})

onUnmounted(() => {
  gsapCtx?.revert()
  if (matrixInterval) {
    clearInterval(matrixInterval)
  }
})
</script>

<style scoped lang="scss">
.snm-neon-matrix-section-168 {
  position: relative;
  min-height: 100vh;
  padding: 120px 20px;
  background: linear-gradient(180deg, #050510 0%, #0a0a20 50%, #050510 100%);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(ellipse at 20% 50%, rgba(0, 255, 255, 0.08) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 50%, rgba(0, 255, 136, 0.08) 0%, transparent 50%);
    pointer-events: none;
  }
}

.snm-container-168 {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
}

.snm-title-168 {
  text-align: center;
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 900;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #00ffff, #00ff88, #00ccff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.snm-subtitle-168 {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(0, 255, 255, 0.6);
  margin-bottom: 80px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
}

.snm-matrix-stage-168 {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 80px;
  padding: 40px 0;
}

.snm-matrix-grid-168 {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 6px;
  padding: 20px;
  background: rgba(0, 10, 20, 0.8);
  border: 2px solid rgba(0, 255, 255, 0.3);
  border-radius: 16px;
  box-shadow: 0 0 40px rgba(0, 255, 255, 0.2);
}

.snm-matrix-cell-168 {
  position: relative;
  width: 40px;
  height: 40px;
  background: rgba(0, 20, 40, 0.8);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
}

.snm-cell-glow-168 {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle, rgba(0, 255, 255, 0.8) 0%, transparent 70%);
  border-radius: 6px;
  opacity: 0;
  pointer-events: none;
}

.snm-cell-content-168 {
  position: relative;
  font-family: 'Courier New', monospace;
  font-size: 1.2rem;
  font-weight: 700;
  color: #00ffff;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.8);
  z-index: 1;
}

.snm-matrix-cards-168 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  max-width: 1200px;
}

.snm-matrix-card-168 {
  position: relative;
  background: rgba(0, 10, 20, 0.9);
  border: 2px solid rgba(0, 255, 255, 0.3);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 0 30px rgba(0, 255, 255, 0.2);
  transition: border-color 0.4s ease, transform 0.4s ease;

  &:hover {
    border-color: rgba(0, 255, 255, 0.6);
    transform: translateY(-10px);
  }
}

.snm-card-header-168 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid rgba(0, 255, 255, 0.2);
}

.snm-card-id-168 {
  font-size: 2rem;
  font-weight: 900;
  background: linear-gradient(135deg, #00ffff, #00ff88);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.snm-card-dots-168 {
  display: flex;
  gap: 6px;
}

.snm-dot-168 {
  width: 8px;
  height: 8px;
  background: #00ffff;
  border-radius: 50%;
  animation: pulse 1.5s ease-in-out infinite;

  &:nth-child(2) { animation-delay: 0.2s; }
  &:nth-child(3) { animation-delay: 0.4s; }
}

@keyframes pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

.snm-card-body-168 {
  padding: 30px 20px;
  text-align: center;
}

.snm-card-icon-168 {
  font-size: 3.5rem;
  margin-bottom: 15px;
  filter: drop-shadow(0 0 20px rgba(0, 255, 255, 0.6));
}

.snm-card-title-168 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
  text-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
}

.snm-card-desc-168 {
  font-size: 0.85rem;
  color: rgba(0, 255, 255, 0.7);
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.snm-card-bar-168 {
  height: 4px;
  background: rgba(0, 255, 255, 0.2);
  overflow: hidden;
}

.snm-bar-fill-168 {
  height: 100%;
  background: linear-gradient(90deg, #00ffff, #00ff88);
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.8);
  transition: width 0.3s ease;
}

@media (max-width: 768px) {
  .snm-matrix-grid-168 {
    grid-template-columns: repeat(4, 1fr);
    gap: 4px;
    padding: 15px;
  }

  .snm-matrix-cell-168 {
    width: 30px;
    height: 30px;
  }

  .snm-cell-content-168 {
    font-size: 1rem;
  }

  .snm-matrix-cards-168 {
    grid-template-columns: repeat(2, 1fr);
  }

  .snm-card-icon-168 {
    font-size: 2.5rem;
  }

  .snm-card-title-168 {
    font-size: 1.2rem;
  }
}
</style>
