<template>
  <div class="scmr-card-morph-reveal-section-178" ref="componentRoot">
    <div class="scmr-container-178">
      <h2 class="scmr-title-178">卡片变形揭示</h2>
      <p class="scmr-subtitle-178">Card Morph Reveal</p>

      <div class="scmr-cards-grid-178">
        <div
          v-for="(card, index) in cards"
          :key="index"
          class="scmr-morph-card-178"
          :ref="el => { if (el) cardRefs[index] = el as HTMLElement }"
        >
          <div class="scmr-card-visual-178">
            <div class="scmr-shape-178" :class="`shape-${card.shape}`"></div>
          </div>
          <div class="scmr-card-info-178">
            <span class="scmr-card-id-178">{{ String(index + 1).padStart(2, '0') }}</span>
            <h3 class="scmr-card-name-178">{{ card.name }}</h3>
            <p class="scmr-card-type-178">{{ card.type }}</p>
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
const cardRefs = ref<HTMLElement[]>([])

interface Card {
  name: string
  type: string
  shape: string
}

const cards: Card[] = [
  {
    name: '圆形变换',
    type: 'CIRCLE MORPH',
    shape: 'circle'
  },
  {
    name: '方形演变',
    type: 'SQUARE EVOLVE',
    shape: 'square'
  },
  {
    name: '三角转换',
    type: 'TRIANGLE TRANSFORM',
    shape: 'triangle'
  },
  {
    name: '六边形变',
    type: 'HEXAGON CHANGE',
    shape: 'hexagon'
  },
  {
    name: '星形变形',
    type: 'STAR MORPH',
    shape: 'star'
  },
  {
    name: '菱形演变',
    type: 'DIAMOND EVOLVE',
    shape: 'diamond'
  }
]

let gsapCtx: gsap.Context

onMounted(() => {
  if (!componentRoot.value) return

  gsapCtx = gsap.context(() => {
    const titleEl = gsap.utils.toArray<HTMLElement>('.scmr-title-178', componentRoot.value)
    const subtitleEl = gsap.utils.toArray<HTMLElement>('.scmr-subtitle-178', componentRoot.value)
    const cards = gsap.utils.toArray<HTMLElement>('.scmr-morph-card-178', componentRoot.value)
    const cardVisuals = gsap.utils.toArray<HTMLElement>('.scmr-card-visual-178', componentRoot.value)
    const cardInfos = gsap.utils.toArray<HTMLElement>('.scmr-card-info-178', componentRoot.value)
    const cardIds = gsap.utils.toArray<HTMLElement>('.scmr-card-id-178', componentRoot.value)

    if (titleEl.length) {
      gsap.from(titleEl, {
        scrollTrigger: {
          trigger: componentRoot.value,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        y: 60,
        opacity: 0,
        duration: 1,
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
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        ease: 'power3.out'
      })
    }

    cards.forEach((card, index) => {
      const visual = cardVisuals[index] as HTMLElement
      const info = cardInfos[index] as HTMLElement
      const id = cardIds[index] as HTMLElement

      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          end: 'top 40%',
          scrub: 1.5
        },
        y: 100,
        opacity: 0,
        scale: 0.8,
        rotation: -10,
        ease: 'power2.out'
      })

      gsap.from(visual, {
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          end: 'top 45%',
          scrub: 1
        },
        scale: 0,
        opacity: 0,
        rotation: -180,
        ease: 'back.out(2)'
      })

      gsap.from(info, {
        scrollTrigger: {
          trigger: card,
          start: 'top 78%',
          end: 'top 48%',
          scrub: 1.2
        },
        x: -50,
        opacity: 0,
        ease: 'power2.out'
      })

      gsap.from(id, {
        scrollTrigger: {
          trigger: card,
          start: 'top 76%',
          end: 'top 50%',
          scrub: 1
        },
        scale: 0,
        opacity: 0,
        ease: 'back.out(1.8)'
      })
    })
  }, componentRoot.value)
})

onUnmounted(() => {
  gsapCtx?.revert()
})
</script>

<style scoped lang="scss">
.scmr-card-morph-reveal-section-178 {
  position: relative;
  min-height: 100vh;
  padding: 120px 20px;
  background: linear-gradient(180deg, #0d0d1d 0%, #1a1a3a 50%, #0d0d1d 100%);
  overflow: hidden;

  opacity: 1 !important;}

.scmr-container-178 {
  max-width: 1400px;
  margin: 0 auto;

  opacity: 1 !important;}

.scmr-title-178 {
  text-align: center;
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 900;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #ff9a9e, #fecfef, #fecfef);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  opacity: 1 !important;}

.scmr-subtitle-178 {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 100px;
  letter-spacing: 0.3em;
  text-transform: uppercase;

  opacity: 1 !important;}

.scmr-cards-grid-178 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
}

.scmr-morph-card-178 {
  position: relative;
  padding: 40px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 154, 158, 0.4);
    transform: translateY(-10px);
  
  opacity: 1 !important;}
}

.scmr-card-visual-178 {
  position: relative;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;

  opacity: 1 !important;}

.scmr-shape-178 {
  position: absolute;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #ff9a9e, #fecfef);
  opacity: 0.8;

  &.shape-circle {
    border-radius: 50%;
  }

  &.shape-square {
    border-radius: 12px;
  }

  &.shape-triangle {
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  }

  &.shape-hexagon {
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  }

  &.shape-star {
    clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  }

  &.shape-diamond {
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  }
}

.scmr-card-info-178 {
  text-align: center;
  position: relative;

  opacity: 1 !important;}

.scmr-card-id-178 {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 2.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #ff9a9e, #fecfef);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;

  opacity: 1 !important;}

.scmr-card-name-178 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;

  opacity: 1 !important;}

.scmr-card-type-178 {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 0.2em;
  text-transform: uppercase;

  opacity: 1 !important;}

@media (max-width: 768px) {
  .scmr-cards-grid-178 {
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
  }

  .scmr-morph-card-178 {
    padding: 30px;
  
  opacity: 1 !important;}

  .scmr-card-visual-178 {
    width: 100px;
    height: 100px;
  
  opacity: 1 !important;}

  .scmr-shape-178 {
    width: 60px;
    height: 60px;
  
  opacity: 1 !important;}

  .scmr-card-id-178 {
    font-size: 2rem;
  
  opacity: 1 !important;}

  .scmr-card-name-178 {
    font-size: 1.2rem;
  
  opacity: 1 !important;}
}
</style>
