<template>
  <div class="spcs-parallax-cards-scroll-section-170" ref="componentRoot">
    <div class="spcs-container-170">
      <h2 class="spcs-title-170">视差卡片滚动</h2>
      <p class="spcs-subtitle-170">Parallax Cards Scroll</p>

      <div class="spcs-cards-wrapper-170">
        <div
          v-for="(card, index) in cards"
          :key="index"
          class="spcs-parallax-card-170"
          :ref="el => { if (el) cardRefs[index] = el as HTMLElement }"
          :data-card="index"
        >
          <div class="spcs-card-bg-170" :style="{ backgroundImage: card.bgImage }"></div>
          <div class="spcs-card-content-170">
            <div class="spcs-card-number-170">{{ String(index + 1).padStart(2, '0') }}</div>
            <h3 class="spcs-card-title-170">{{ card.title }}</h3>
            <p class="spcs-card-desc-170">{{ card.description }}</p>
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
  title: string
  description: string
  bgImage: string
}

const cards: Card[] = [
  {
    title: '视差深度',
    description: 'PARALLAX DEPTH',
    bgImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    title: '层次分明',
    description: 'CLEAR LAYERS',
    bgImage: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    title: '流畅滚动',
    description: 'SMOOTH SCROLL',
    bgImage: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  {
    title: '视觉冲击',
    description: 'VISUAL IMPACT',
    bgImage: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  },
  {
    title: '动感十足',
    description: 'DYNAMIC MOTION',
    bgImage: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  }
]

let gsapCtx: gsap.Context

onMounted(() => {
  if (!componentRoot.value) return

  gsapCtx = gsap.context(() => {
    const titleEl = gsap.utils.toArray<HTMLElement>('.spcs-title-170', componentRoot.value)
    const subtitleEl = gsap.utils.toArray<HTMLElement>('.spcs-subtitle-170', componentRoot.value)
    const cards = gsap.utils.toArray<HTMLElement>('.spcs-parallax-card-170', componentRoot.value)
    const cardContents = gsap.utils.toArray<HTMLElement>('.spcs-card-content-170', componentRoot.value)
    const cardNumbers = gsap.utils.toArray<HTMLElement>('.spcs-card-number-170', componentRoot.value)

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
      const content = cardContents[index] as HTMLElement
      const number = cardNumbers[index] as HTMLElement

      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          end: 'top 30%',
          scrub: 1.5
        },
        y: 150,
        opacity: 0.3,
        scale: 0.9,
        ease: 'power2.out'
      })

      gsap.from(content, {
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          end: 'top 40%',
          scrub: 1
        },
        y: 100,
        opacity: 0,
        ease: 'power2.out'
      })

      gsap.from(number, {
        scrollTrigger: {
          trigger: card,
          start: 'top 75%',
          end: 'top 45%',
          scrub: 1
        },
        scale: 0,
        rotation: -90,
        opacity: 0,
        ease: 'back.out(1.5)'
      })
    })
  }, componentRoot.value)
})

onUnmounted(() => {
  gsapCtx?.revert()
})
</script>

<style scoped lang="scss">
.spcs-parallax-cards-scroll-section-170 {
  position: relative;
  min-height: 100vh;
  padding: 120px 20px;
  background: linear-gradient(180deg, #0a0a1a 0%, #1a1a2e 50%, #0a0a1a 100%);
  overflow: hidden;

  opacity: 1 !important;}

.spcs-container-170 {
  max-width: 1400px;
  margin: 0 auto;

  opacity: 1 !important;}

.spcs-title-170 {
  text-align: center;
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 900;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #667eea, #f093fb, #4facfe);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 40px rgba(102, 126, 234, 0.3);

  opacity: 1 !important;}

.spcs-subtitle-170 {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 100px;
  letter-spacing: 0.3em;
  text-transform: uppercase;

  opacity: 1 !important;}

.spcs-cards-wrapper-170 {
  display: flex;
  flex-direction: column;
  gap: 120px;
}

.spcs-parallax-card-170 { position: relative;
  width: 100%;
  max-width: 1000px;
  height: 400px;
  margin: 0 auto;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
      opacity: 1;
    }

.spcs-card-bg-170 {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0.8;
  transition: transform 0.5s ease;
}

.spcs-parallax-card-170:hover .spcs-card-bg-170 { transform: scale(1.05);
      opacity: 1;
    }

.spcs-card-content-170 {
  position: absolute;
  inset: 0;
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 100%);

  opacity: 1 !important;}

.spcs-card-number-170 {
  font-size: 5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #fff, rgba(255, 255, 255, 0.6));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 20px;
  text-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);

  opacity: 1 !important;}

.spcs-card-title-170 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 10px;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);

  opacity: 1 !important;}

.spcs-card-desc-170 {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 0.2em;
  text-transform: uppercase;

  opacity: 1 !important;}

@media (max-width: 768px) {
  .spcs-cards-wrapper-170 {
    gap: 80px;
  }

  .spcs-parallax-card-170 { height: 300px;
      opacity: 1;
    }

  .spcs-card-content-170 {
    padding: 40px;
  
  opacity: 1 !important;}

  .spcs-card-number-170 {
    font-size: 3rem;
  
  opacity: 1 !important;}

  .spcs-card-title-170 {
    font-size: 1.8rem;
  
  opacity: 1 !important;}
}
</style>
