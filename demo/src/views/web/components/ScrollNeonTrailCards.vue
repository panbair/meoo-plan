<template>
  <div class="sntc-neon-trail-cards-section-159" ref="componentRoot">
    <div class="sntc-container-159">
      <h2 class="sntc-title-159">霓虹轨迹卡片</h2>
      <p class="sntc-subtitle-159">Neon Trail Cards</p>

      <div class="sntc-trail-canvas-159">
        <canvas ref="trailCanvas"></canvas>
      </div>

      <div class="sntc-cards-159">
        <div
          v-for="(card, index) in cards"
          :key="index"
          class="sntc-neon-card-159"
          :ref="el => { if (el) cardRefs[index] = el as HTMLElement }"
          :data-color="card.color"
          @mousemove="handleMouseMove($event, index)"
          @mouseleave="handleMouseLeave(index)"
        >
          <div class="sntc-card-glow-159" :style="{ background: card.glow }"></div>
          <div class="sntc-card-border-159" :style="{ borderColor: card.color }"></div>
          <div class="sntc-card-inner-159">
            <div class="sntc-card-image-159" :style="{ backgroundImage: `url(${card.image})` }"></div>
            <div class="sntc-card-content-159">
              <span class="sntc-card-number-159" :style="{ color: card.color }">
                {{ String(index + 1).padStart(2, '0') }}
              </span>
              <h3 class="sntc-card-title-159">{{ card.title }}</h3>
              <p class="sntc-card-desc-159">{{ card.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="sntc-neon-lines-159">
        <div class="sntc-line-159" v-for="i in 5" :key="i" :style="`--delay: ${i * 0.2}s`"></div>
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
const trailCanvas = ref<HTMLCanvasElement>()
const cardRefs = ref<HTMLElement[]>([])

interface Card {
  image: string
  title: string
  description: string
  color: string
  glow: string
}

const cards: Card[] = [
  {
    image: new URL('@/assets/image/1.png', import.meta.url).href,
    title: '赛博',
    description: 'Cyberpunk',
    color: '#ff00ff',
    glow: 'radial-gradient(circle, rgba(255, 0, 255, 0.4) 0%, transparent 70%)'
  },
  {
    image: new URL('@/assets/image/2.png', import.meta.url).href,
    title: '霓虹',
    description: 'Neon Light',
    color: '#00ffff',
    glow: 'radial-gradient(circle, rgba(0, 255, 255, 0.4) 0%, transparent 70%)'
  },
  {
    image: new URL('@/assets/image/3.png', import.meta.url).href,
    title: '脉冲',
    description: 'Pulse',
    color: '#ff6600',
    glow: 'radial-gradient(circle, rgba(255, 102, 0, 0.4) 0%, transparent 70%)'
  },
  {
    image: new URL('@/assets/image/4.png', import.meta.url).href,
    title: '量子',
    description: 'Quantum',
    color: '#ffff00',
    glow: 'radial-gradient(circle, rgba(255, 255, 0, 0.4) 0%, transparent 70%)'
  }
]

let gsapCtx: gsap.Context
let trailCtx: CanvasRenderingContext2D | null = null
let trails: Array<{ x: number; y: number; age: number; color: string }>[] = []
let animationFrame: number | null = null
let resizeCanvas: () => void = () => {}

const handleMouseMove = (event: MouseEvent, index: number) => {
  if (!trailCanvas.value) return
  const rect = trailCanvas.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  const card = cards[index]

  trails.push({
    x,
    y,
    age: 0,
    color: card.color
  })
}

const handleMouseLeave = (index: number) => {
  // 鼠标离开时不做特殊处理
}

onMounted(() => {
  setTimeout(() => {
    if (!componentRoot.value) return

    // 轨迹画布设置
    const canvas = trailCanvas.value
    if (!canvas) return

    resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight * 0.8
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    trailCtx = canvas.getContext('2d')
    if (!trailCtx) return

    const animateTrails = () => {
      if (!trailCtx || !trailCanvas.value) return

      trailCtx.fillStyle = 'rgba(10, 10, 20, 0.1)'
      trailCtx.fillRect(0, 0, trailCanvas.value.width, trailCanvas.value.height)

      trails = trails.filter((trail) => {
        trail.age += 1
        const alpha = Math.max(0, 1 - trail.age / 30)
        const radius = Math.max(2, 10 - trail.age * 0.25)

        trailCtx.beginPath()
        trailCtx.arc(trail.x, trail.y, radius, 0, Math.PI * 2)
        trailCtx.fillStyle = trail.color + Math.floor(alpha * 255).toString(16).padStart(2, '0')
        trailCtx.fill()

        // 添加光晕效果
        const gradient = trailCtx.createRadialGradient(trail.x, trail.y, 0, trail.x, trail.y, radius * 2)
        gradient.addColorStop(0, trail.color + Math.floor(alpha * 128).toString(16).padStart(2, '0'))
        gradient.addColorStop(1, 'transparent')
        trailCtx.fillStyle = gradient
        trailCtx.beginPath()
        trailCtx.arc(trail.x, trail.y, radius * 2, 0, Math.PI * 2)
        trailCtx.fill()

        return trail.age < 30
      })

      animationFrame = requestAnimationFrame(animateTrails)
    }

    animateTrails()

    // GSAP 动画
    gsapCtx = gsap.context(() => {
      const titleEl = gsap.utils.toArray<HTMLElement>('.sntc-title-159', componentRoot.value)
      const subtitleEl = gsap.utils.toArray<HTMLElement>('.sntc-subtitle-159', componentRoot.value)
      const neonCards = gsap.utils.toArray<HTMLElement>('.sntc-neon-card-159', componentRoot.value)
      const stageEl = gsap.utils.toArray<HTMLElement>('.sntc-cards-159', componentRoot.value)
      const cardImages = gsap.utils.toArray<HTMLElement>('.sntc-card-image-159', componentRoot.value)
      const cardTitles = gsap.utils.toArray<HTMLElement>('.sntc-card-title-159', componentRoot.value)
      const cardDescs = gsap.utils.toArray<HTMLElement>('.sntc-card-desc-159', componentRoot.value)
      const cardNumbers = gsap.utils.toArray<HTMLElement>('.sntc-card-number-159', componentRoot.value)
      const neonLines = gsap.utils.toArray<HTMLElement>('.sntc-line-159', componentRoot.value)

      // 标题动画 - 霓虹闪烁
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

        // 霓虹闪烁效果
        gsap.to(titleEl, {
          textShadow: '0 0 20px #ff00ff, 0 0 40px #ff00ff, 0 0 60px #ff00ff',
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

      // 霓虹线动画
      if (neonLines.length) {
        gsap.from(neonLines, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          scaleX: 0,
          opacity: 0,
          duration: 1.5,
          stagger: 0.3,
          ease: 'power3.out'
        })

        // 霓虹线持续动画
        neonLines.forEach((line: HTMLElement) => {
          gsap.to(line, {
            opacity: 0.3 + Math.random() * 0.7,
            duration: 0.5,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut'
          })
        })
      }

      // 卡片动画
      if (neonCards.length) {
        gsap.from(neonCards, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          },
          y: 100,
          opacity: 0,
          scale: 0.8,
          duration: 1,
          stagger: 0.2,
          ease: 'back.out(1.7)'
        })
      }

      // 卡片内容动画
      if (cardImages.length) {
        gsap.from(cardImages, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 65%',
            toggleActions: 'play none none reverse'
          },
          scale: 1.3,
          opacity: 0,
          duration: 1,
          stagger: 0.2,
          delay: 0.5,
          ease: 'power2.out'
        })
      }

      if (cardNumbers.length) {
        gsap.from(cardNumbers, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 65%',
            toggleActions: 'play none none reverse'
          },
          x: -30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
          delay: 0.7,
          ease: 'power3.out'
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
            start: 'top 65%',
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

      // 卡片悬停效果
      cardRefs.value.forEach((card, index) => {
        if (!card) return

        card.addEventListener('mouseenter', () => {
          const color = cards[index].color
          gsap.to(card, {
            scale: 1.05,
            duration: 0.4,
            ease: 'power2.out'
          })

          gsap.to(card.querySelector('.sntc-card-glow-159'), {
            opacity: 0.8,
            duration: 0.4,
            ease: 'power2.out'
          })

          gsap.to(card.querySelector('.sntc-card-border-159'), {
            borderWidth: 3,
            duration: 0.4,
            ease: 'power2.out'
          })
        })

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            scale: 1,
            duration: 0.4,
            ease: 'power2.out'
          })

          gsap.to(card.querySelector('.sntc-card-glow-159'), {
            opacity: 0.4,
            duration: 0.4,
            ease: 'power2.out'
          })

          gsap.to(card.querySelector('.sntc-card-border-159'), {
            borderWidth: 2,
            duration: 0.4,
            ease: 'power2.out'
          })
        })
      })
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
.sntc-neon-trail-cards-section-159 {
  min-height: 100vh;
  padding: 100px 20px;
  background: linear-gradient(180deg, #050510 0%, #0a0a20 50%, #050510 100%);
  position: relative;
  overflow: hidden;
}

.sntc-container-159 {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  z-index: 1;
}

.sntc-title-159 {
  text-align: center;
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 900;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #ff00ff, #00ffff, #ff6600);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 20px rgba(255, 0, 255, 0.5);
  filter: drop-shadow(0 0 30px rgba(0, 255, 255, 0.5));
}

.sntc-subtitle-159 {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(255, 0, 255, 0.6);
  margin-bottom: 80px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  text-shadow: 0 0 10px rgba(255, 0, 255, 0.5);
}

.sntc-trail-canvas-159 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.sntc-cards-159 {
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 40px;
  z-index: 2;
}

.sntc-neon-card-159 {
  position: relative;
  background: rgba(10, 10, 20, 0.9);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.4s ease;
}

.sntc-card-glow-159 {
  position: absolute;
  inset: 0;
  opacity: 0.4;
  transition: opacity 0.4s ease;
}

.sntc-card-border-159 {
  position: absolute;
  inset: 0;
  border: 2px solid;
  border-radius: 20px;
  pointer-events: none;
  transition: border-width 0.4s ease;
}

.sntc-card-inner-159 {
  position: relative;
  z-index: 1;
}

.sntc-card-image-159 {
  width: 100%;
  height: 200px;
  background-size: cover;
  background-position: center;
  transition: transform 0.4s ease;
}

.sntc-card-content-159 {
  position: relative;
  padding: 25px;
}

.sntc-card-number-159 {
  position: absolute;
  top: -30px;
  left: 25px;
  font-size: 3.5rem;
  font-weight: 900;
  line-height: 1;
  text-shadow: 0 0 30px currentColor;
}

.sntc-card-title-159 {
  font-size: 1.6rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.sntc-card-desc-159 {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.sntc-neon-lines-159 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

.sntc-line-159 {
  position: absolute;
  width: 2px;
  height: 100vh;
  background: linear-gradient(180deg, transparent, rgba(255, 0, 255, 0.3), transparent);
  animation: slideDown 3s linear infinite;
  animation-delay: var(--delay);
  top: -100vh;
}

@keyframes slideDown {
  to {
    transform: translateY(200vh);
  }
}

@media (max-width: 768px) {
  .sntc-cards-159 {
    grid-template-columns: 1fr;
  }

  .sntc-card-image-159 {
    height: 180px;
  }

  .sntc-card-number-159 {
    font-size: 3rem;
  }

  .sntc-card-title-159 {
    font-size: 1.4rem;
  }

  .sntc-card-desc-159 {
    font-size: 0.85rem;
  }
}
</style>
