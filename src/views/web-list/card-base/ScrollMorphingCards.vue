<template>
  <div class="smc-morphing-cards-section-149" ref="componentRoot">
    <div class="smc-container-149">
      <h2 class="smc-title-149">变形卡片</h2>
      <p class="smc-subtitle-149">Morphing Cards Effect</p>

      <div class="smc-cards-wrapper-149">
        <div
          v-for="(card, index) in cards"
          :key="index"
          class="smc-card-149"
          :class="`smc-card-${index + 1}-149`"
          @mouseenter="handleCardHover(index)"
          @mouseleave="handleCardLeave(index)"
        >
          <div class="smc-card-inner-149">
            <div class="smc-card-front-149">
              <div class="smc-card-number-149">{{ String(index + 1).padStart(2, '0') }}</div>
              <h3 class="smc-card-title-149">{{ card.title }}</h3>
              <p class="smc-card-desc-149">{{ card.description }}</p>
            </div>
            <div class="smc-card-back-149">
              <div class="smc-card-icon-149">{{ card.icon }}</div>
              <h4 class="smc-card-back-title-149">{{ card.title }}</h4>
              <p class="smc-card-back-text-149">{{ card.detail }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="smc-shape-decoration-149">
        <div class="smc-shape-149 smc-shape-1-149"></div>
        <div class="smc-shape-149 smc-shape-2-149"></div>
        <div class="smc-shape-149 smc-shape-3-149"></div>
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

interface Card {
  title: string
  description: string
  icon: string
  detail: string
}

const cards = ref<Card[]>([
  {
    title: '创新',
    description: '突破常规，探索未知',
    icon: '✨',
    detail: '通过创新的思维方式和独特的设计理念，打造令人惊叹的视觉体验。'
  },
  {
    title: '技术',
    description: '前沿技术，极致体验',
    icon: '🚀',
    detail: '运用最新的动画技术，创造流畅自然的交互效果，提升用户体验。'
  },
  {
    title: '设计',
    description: '美学至上，细节为王',
    icon: '🎨',
    detail: '注重每一个设计细节，追求完美的视觉呈现，让设计更有温度。'
  },
  {
    title: '互动',
    description: '触动人心的交互体验',
    icon: '💫',
    detail: '通过精心设计的交互效果，让用户在每一次操作中都能感受到设计的力量。'
  }
])

const handleCardHover = (index: number) => {
  const card = document.querySelector(`.smc-card-${index + 1}-149`) as HTMLElement
  const cardInner = card.querySelector('.smc-card-inner-149') as HTMLElement

  gsap.to(cardInner, {
    rotateY: 180,
    duration: 0.8,
    ease: 'back.out(1.5)'
  })

  gsap.to(card, {
    scale: 1.05,
    boxShadow: '0 30px 60px rgba(236, 72, 153, 0.3)',
    duration: 0.5,
    ease: 'power2.out'
  })
}

const handleCardLeave = (index: number) => {
  const card = document.querySelector(`.smc-card-${index + 1}-149`) as HTMLElement
  const cardInner = card.querySelector('.smc-card-inner-149') as HTMLElement

  gsap.to(cardInner, {
    rotateY: 0,
    duration: 0.8,
    ease: 'back.out(1.5)'
  })

  gsap.to(card, {
    scale: 1,
    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2)',
    duration: 0.5,
    ease: 'power2.out'
  })
}

let ctx: gsap.Context

onMounted(() => {
  // 使用 setTimeout 确保 DOM 完全渲染
  setTimeout(() => {
    if (!componentRoot.value) return
    ctx = gsap.context(() => {
      const titleEl = gsap.utils.toArray<HTMLElement>('.smc-title-149', componentRoot.value)
      const subtitleEl = gsap.utils.toArray<HTMLElement>('.smc-subtitle-149', componentRoot.value)
      const cardsEl = gsap.utils.toArray<HTMLElement>('.smc-card-149', componentRoot.value)
      const cardsWrapper = gsap.utils.toArray<HTMLElement>('.smc-cards-wrapper-149', componentRoot.value)
      const cardNumbers = gsap.utils.toArray<HTMLElement>('.smc-card-number-149', componentRoot.value)
      const cardTitles = gsap.utils.toArray<HTMLElement>('.smc-card-title-149', componentRoot.value)
      const cardDescs = gsap.utils.toArray<HTMLElement>('.smc-card-desc-149', componentRoot.value)
      const shapes = gsap.utils.toArray<HTMLElement>('.smc-shape-149', componentRoot.value)
      const shapeDecoration = gsap.utils.toArray<HTMLElement>('.smc-shape-decoration-149', componentRoot.value)
      const shape1 = gsap.utils.toArray<HTMLElement>('.smc-shape-1-149', componentRoot.value)
      const shape2 = gsap.utils.toArray<HTMLElement>('.smc-shape-2-149', componentRoot.value)
      const shape3 = gsap.utils.toArray<HTMLElement>('.smc-shape-3-149', componentRoot.value)

      // 标题动画
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
          y: 40,
          opacity: 0,
          duration: 1,
          delay: 0.2,
          ease: 'power3.out'
        })
      }

      // 卡片入场动画
      if (cardsEl.length && cardsWrapper.length) {
        gsap.from(cardsEl, {
          scrollTrigger: {
            trigger: cardsWrapper[0],
            start: 'top 85%'
          },
          y: 150,
          opacity: 0,
          scale: 0.7,
          rotationX: -45,
          duration: 1.2,
          ease: 'back.out(1.5)',
          stagger: 0.15
        })

        // 卡片视差滚动
        gsap.to(cardsEl, {
          y: (i) => (i % 2 === 0 ? -60 : 60),
          scrollTrigger: {
            trigger: cardsWrapper[0],
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          }
        })
      }

      // 卡片内容淡入
      if (cardNumbers.length) {
        gsap.from(cardNumbers, {
          scrollTrigger: {
            trigger: cardsWrapper[0] || componentRoot.value,
            start: 'top 80%'
          },
          scale: 0,
          opacity: 0,
          duration: 0.6,
          ease: 'back.out(1.7)',
          stagger: 0.1
        })
      }

      if (cardTitles.length) {
        gsap.from(cardTitles, {
          scrollTrigger: {
            trigger: cardsWrapper[0] || componentRoot.value,
            start: 'top 80%'
          },
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.1
        })
      }

      if (cardDescs.length) {
        gsap.from(cardDescs, {
          scrollTrigger: {
            trigger: cardsWrapper[0] || componentRoot.value,
            start: 'top 80%'
          },
          y: 20,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.1,
          delay: 0.2
        })
      }

      // 装饰形状动画
      if (shapes.length && shapeDecoration.length) {
        gsap.from(shapes, {
          scrollTrigger: {
            trigger: shapeDecoration[0],
            start: 'top 90%'
          },
          scale: 0,
          opacity: 0,
          duration: 1.5,
          ease: 'elastic.out(1, 0.5)',
          stagger: 0.2
        })

        // 形状浮动
        gsap.to(shapes, {
          y: 'random(-30, 30)',
          duration: 'random(3, 5)',
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          stagger: {
            each: 0.3,
            from: 'random'
          }
        })
      }

      // 形状持续旋转
      if (shape1.length) {
        gsap.to(shape1, {
          rotation: 360,
          duration: 20,
          repeat: -1,
          ease: 'none'
        })
      }

      if (shape2.length) {
        gsap.to(shape2, {
          rotation: -360,
          duration: 25,
          repeat: -1,
          ease: 'none'
        })
      }

      if (shape3.length) {
        gsap.to(shape3, {
          rotation: 360,
          duration: 30,
          repeat: -1,
          ease: 'none'
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
.smc-morphing-cards-section-149 {
  min-height: 100vh;
  padding: 100px 20px;
  background: linear-gradient(135deg, #0d1b2a 0%, #1b263b 50%, #415a77 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(circle at 30% 20%, rgba(236, 72, 153, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 70% 80%, rgba(168, 85, 247, 0.08) 0%, transparent 50%);
    pointer-events: none;
  
  opacity: 1 !important;}
}

.smc-container-149 {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.smc-title-149 {
  text-align: center;
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 900;
  color: #fff;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #f472b6, #a78bfa, #60a5fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  opacity: 1 !important;}

.smc-subtitle-149 {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 80px;
  letter-spacing: 0.2em;
  text-transform: uppercase;

  opacity: 1 !important;}

.smc-cards-wrapper-149 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 40px;
  perspective: 2000px;
  margin-bottom: 60px;
}

.smc-card-149 {
  position: relative;
  height: 400px;
  cursor: pointer;
  perspective: 1000px;

  opacity: 1 !important;}

.smc-card-inner-149 {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.8s ease;

  opacity: 1 !important;}

.smc-card-front-149,
.smc-card-back-149 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 40px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);

  opacity: 1 !important;}

.smc-card-back-149 {
  transform: rotateY(180deg);
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(168, 85, 247, 0.15));

  opacity: 1 !important;}

.smc-card-number-149 {
  position: absolute;
  top: 20px;
  left: 20px;
  font-size: 2rem;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.2);
  font-family: monospace;

  opacity: 1 !important;}

.smc-card-title-149 {
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 16px;
  letter-spacing: 0.05em;

  opacity: 1 !important;}

.smc-card-desc-149 {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;

  opacity: 1 !important;}

.smc-card-icon-149 {
  font-size: 4rem;
  margin-bottom: 20px;

  opacity: 1 !important;}

.smc-card-back-title-149 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 16px;

  opacity: 1 !important;}

.smc-card-back-text-149 {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.7;

  opacity: 1 !important;}

.smc-shape-decoration-149 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.smc-shape-149 {
  position: absolute;
  border: 2px solid rgba(236, 72, 153, 0.2);
  opacity: 0.5;
}

.smc-shape-1-149 {
  width: 200px;
  height: 200px;
  top: 10%;
  right: 5%;
  border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
  border-color: rgba(236, 72, 153, 0.2);

  opacity: 1 !important;}

.smc-shape-2-149 {
  width: 150px;
  height: 150px;
  bottom: 15%;
  left: 10%;
  border-radius: 50%;
  border-color: rgba(168, 85, 247, 0.2);

  opacity: 1 !important;}

.smc-shape-3-149 {
  width: 180px;
  height: 180px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  border-color: rgba(96, 165, 250, 0.2);

  opacity: 1 !important;}

@media (max-width: 768px) {
  .smc-cards-wrapper-149 {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .smc-card-149 {
    height: 350px;
  
  opacity: 1 !important;}

  .smc-card-front-149,
  .smc-card-back-149 {
    padding: 30px;
  
  opacity: 1 !important;}

  .smc-card-title-149 {
    font-size: 1.5rem;
  
  opacity: 1 !important;}

  .smc-card-icon-149 {
    font-size: 3rem;
  
  opacity: 1 !important;}
}
</style>
