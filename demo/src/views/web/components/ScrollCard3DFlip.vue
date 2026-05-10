<template>
  <section class="cf3d-scroll-card-3d-flip-134">
    <div class="cf3d-container-134">
      <h2 class="cf3d-title-134">3D卡片翻转</h2>
      <p class="cf3d-subtitle-134">3D Card Flip</p>

      <div class="cf3d-stage-134" ref="stage">
        <div
          v-for="(card, index) in cards"
          :key="index"
          :ref="el => { if (el) cardRefs[index] = el as HTMLElement }"
          :class="`cf3d-card-${134} cf3d-card-${index}-134`"
          @click="flipCard(index)"
        >
          <div class="cf3d-card-inner-134" :class="{ flipped: flippedCards[index] }">
            <div class="cf3d-card-front-134">
              <div class="cf3d-card-number-134">{{ String(index + 1).padStart(2, '0') }}</div>
              <h3 class="cf3d-card-title-134">{{ card.title }}</h3>
              <p class="cf3d-card-desc-134">{{ card.description }}</p>
              <div class="cf3d-card-icon-134">{{ card.icon }}</div>
            </div>
            <div class="cf3d-card-back-134">
              <h4 class="cf3d-card-back-title-134">{{ card.backTitle }}</h4>
              <p class="cf3d-card-back-text-134">{{ card.backText }}</p>
              <div class="cf3d-card-back-icon-134">✨</div>
            </div>
          </div>
        </div>
      </div>

      <div class="cf3d-hint-134">
        <p>点击卡片翻转 · 滚动查看更多</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const stage = ref<HTMLElement>()
const cardRefs = ref<HTMLElement[]>([])
const flippedCards = ref<Record<number, boolean>>({})

const cards = [
  {
    title: '创新',
    description: 'Innovation',
    icon: '🚀',
    backTitle: '突破极限',
    backText: '探索无限可能，创造前所未有的体验。'
  },
  {
    title: '品质',
    description: 'Quality',
    icon: '💎',
    backTitle: '追求卓越',
    backText: '每一个细节都精雕细琢，呈现完美品质。'
  },
  {
    title: '效率',
    description: 'Efficiency',
    icon: '⚡',
    backTitle: '极速响应',
    backText: '流畅的交互体验，感受速度的力量。'
  },
  {
    title: '安全',
    description: 'Security',
    icon: '🔒',
    backTitle: '值得信赖',
    backText: '全方位的安全保障，让用户安心使用。'
  }
]

const flipCard = (index: number) => {
  flippedCards.value[index] = !flippedCards.value[index]
  const card = cardRefs.value[index]
  if (card) {
    const inner = card.querySelector('.cf3d-card-inner-134') as HTMLElement
    if (inner) {
      inner.classList.toggle('flipped')
    }
  }
}

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 标题动画
    gsap.from('.cf3d-title-134', {
      scrollTrigger: {
        trigger: '.cf3d-scroll-card-3d-flip-134',
        start: 'top 90%',
        end: 'top 70%',
        scrub: 1
      },
      opacity: 0,
      y: -50,
      filter: 'blur(20px)',
      ease: 'power2.out'
    })

    gsap.from('.cf3d-subtitle-134', {
      scrollTrigger: {
        trigger: '.cf3d-scroll-card-3d-flip-134',
        start: 'top 85%',
        end: 'top 65%',
        scrub: 1
      },
      opacity: 0,
      y: 30,
      ease: 'power2.out'
    })

    // 卡片入场动画
    cardRefs.value.forEach((card, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          end: 'top 30%',
          scrub: 1.5
        },
        y: 150 + index * 50,
        x: (index - 1.5) * 100,
        rotateX: 30,
        rotateY: (index - 1.5) * 20,
        scale: 0.7,
        opacity: 0.3,
        filter: 'blur(10px)',
        ease: 'power3.inOut'
      })
    })

    // 卡片悬停效果
    cardRefs.value.forEach((card, index) => {
      const inner = card.querySelector('.cf3d-card-inner-134')

      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          scale: 1.1,
          y: -20,
          duration: 0.5,
          ease: 'power2.out'
        })

        gsap.to(inner, {
          rotateY: 180,
          duration: 0.6,
          ease: 'back.out(1.7)'
        })
      })

      card.addEventListener('mouseleave', () => {
        if (!flippedCards.value[index]) {
          gsap.to(card, {
            scale: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out'
          })

          gsap.to(inner, {
            rotateY: 0,
            duration: 0.6,
            ease: 'power2.out'
          })
        }
      })
    })

    // 提示动画
    gsap.from('.cf3d-hint-134', {
      scrollTrigger: {
        trigger: stage.value,
        start: 'bottom 25%',
        end: 'bottom 15%',
        scrub: 1
      },
      opacity: 0,
      y: 20,
      ease: 'power2.out'
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.cf3d-scroll-card-3d-flip-134 {
  min-height: 100vh;
  padding: 100px 20px;
  background: linear-gradient(180deg, #0a0a1a 0%, #1a1a3a 30%, #0f0f2a 60%, #1a1a3a 100%);
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.cf3d-container-134 {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;

  opacity: 1 !important;}

.cf3d-title-134 {
  text-align: center;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 900;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #a855f7, #3b82f6, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 80px rgba(168, 85, 247, 0.5);

  opacity: 1 !important;}

.cf3d-subtitle-134 {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 120px;
  letter-spacing: 0.3em;
  text-transform: uppercase;

  opacity: 1 !important;}

.cf3d-stage-134 {
  position: relative;
  min-height: 800px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  flex-wrap: wrap;
  perspective: 2000px;

  opacity: 1 !important;}

.cf3d-card-134 {
  width: 300px;
  height: 400px;
  cursor: pointer;
  perspective: 1000px;

  opacity: 1 !important;}

.cf3d-card-inner-134 {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform-style: preserve-3d;

  opacity: 1 !important;}

.cf3d-card-inner-134.flipped {
  transform: rotateY(180deg);
}

.cf3d-card-front-134,
.cf3d-card-back-134 {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  border-radius: 24px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);

  opacity: 1 !important;}

.cf3d-card-front-134 {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(59, 130, 246, 0.2));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);

  opacity: 1 !important;}

.cf3d-card-back-134 {
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(168, 85, 247, 0.2));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transform: rotateY(180deg);

  opacity: 1 !important;}

.cf3d-card-number-134 {
  position: absolute;
  top: 20px;
  right: 30px;
  font-size: 3rem;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.1);
  font-family: monospace;

  opacity: 1 !important;}

.cf3d-card-title-134 {
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 10px;
  text-align: center;

  opacity: 1 !important;}

.cf3d-card-desc-134 {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  margin-bottom: 30px;

  opacity: 1 !important;}

.cf3d-card-icon-134 {
  font-size: 4rem;
  filter: drop-shadow(0 0 20px rgba(168, 85, 247, 0.5));

  opacity: 1 !important;}

.cf3d-card-back-title-134 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 20px;
  text-align: center;

  opacity: 1 !important;}

.cf3d-card-back-text-134 {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  line-height: 1.8;
  margin-bottom: 30px;

  opacity: 1 !important;}

.cf3d-card-back-icon-134 {
  font-size: 3rem;
  animation: sparkle 2s ease-in-out infinite;

  opacity: 1 !important;}

@keyframes sparkle {
  0%, 100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.2) rotate(10deg);
  }
}

.cf3d-hint-134 {
  text-align: center;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.9rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-top: 60px;

  opacity: 1 !important;}

@media (max-width: 768px) {
  .cf3d-stage-134 {
    gap: 30px;
    min-height: 600px;
  
  opacity: 1 !important;}

  .cf3d-card-134 {
    width: 260px;
    height: 350px;
  
  opacity: 1 !important;}

  .cf3d-card-title-134 {
    font-size: 1.5rem;
  
  opacity: 1 !important;}

  .cf3d-card-icon-134 {
    font-size: 3rem;
  
  opacity: 1 !important;}
}
</style>
