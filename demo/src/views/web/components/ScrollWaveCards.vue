<template>
  <section class="wc-scroll-wave-cards-139">
    <div class="wc-container-139">
      <h2 class="wc-title-139">波浪卡片</h2>
      <p class="wc-subtitle-139">Wave Cards</p>

      <div class="wc-stage-139" ref="stage">
        <div class="wc-wave-container-139">
          <div
            v-for="(card, index) in cards"
            :key="index"
            :ref="el => { if (el) cardRefs[index] = el as HTMLElement }"
            :class="`wc-wave-card-${139} wc-card-${index}-139`"
          >
            <div class="wc-card-inner-139">
              <div class="wc-card-icon-139">{{ card.icon }}</div>
              <h3 class="wc-card-title-139">{{ card.title }}</h3>
              <p class="wc-card-desc-139">{{ card.description }}</p>
              <div class="wc-card-wave-139"></div>
            </div>
          </div>
        </div>

        <div class="wc-water-effect-139" ref="waterEffect">
          <div class="wc-water-layer-139" v-for="i in 3" :key="i"></div>
        </div>
      </div>

      <div class="wc-hint-139">
        <div class="wc-hint-icon-139">🌊</div>
        <p>滚动体验波浪效果</p>
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
const waterEffect = ref<HTMLElement>()
const cardRefs = ref<HTMLElement[]>([])

const cards = [
  {
    icon: '💧',
    title: '流动',
    description: '如水般流畅'
  },
  {
    icon: '🌊',
    title: '波浪',
    description: '自然韵律美'
  },
  {
    icon: '💦',
    title: '涟漪',
    description: '层层递进'
  },
  {
    icon: '🎵',
    title: '旋律',
    description: '和谐共鸣'
  }
]

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 标题动画
    gsap.from('.wc-title-139', {
      scrollTrigger: {
        trigger: '.wc-scroll-wave-cards-139',
        start: 'top 90%',
        end: 'top 70%',
        scrub: 1
      },
      opacity: 0,
      scale: 0.8,
      filter: 'blur(20px)',
      ease: 'power2.out'
    })

    gsap.from('.wc-subtitle-139', {
      scrollTrigger: {
        trigger: '.wc-scroll-wave-cards-139',
        start: 'top 85%',
        end: 'top 65%',
        scrub: 1
      },
      opacity: 0,
      y: 30,
      ease: 'power2.out'
    })

    // 卡片波浪动画
    cardRefs.value.forEach((card, index) => {
      const amplitude = 50 + index * 20
      const frequency = 1 + index * 0.3
      const phase = index * 0.5

      gsap.to(card, {
        scrollTrigger: {
          trigger: stage.value,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 2
        },
        y: (progress) => Math.sin(progress * Math.PI * frequency + phase) * amplitude,
        scale: (progress) => 1 + Math.sin(progress * Math.PI * 2 + phase) * 0.1,
        rotation: (progress) => Math.sin(progress * Math.PI * 4 + phase) * 5,
        ease: 'sine.inOut'
      })
    })

    // 卡片入场动画
    cardRefs.value.forEach((card, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          end: 'top 50%',
          scrub: 1.5
        },
        y: 200 + index * 50,
        scale: 0.7,
        opacity: 0,
        filter: 'blur(15px)',
        ease: 'power3.out',
        delay: index * 0.1
      })
    })

    // 波浪效果动画
    const waterLayers = waterEffect.value?.querySelectorAll('.wc-water-layer-139')
    waterLayers?.forEach((layer, index) => {
      gsap.to(layer, {
        scrollTrigger: {
          trigger: stage.value,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 1.5
        },
        y: (progress) => Math.sin(progress * Math.PI * 2 + index * 0.3) * 100,
        scale: (progress) => 1 + Math.sin(progress * Math.PI * 4 + index * 0.2) * 0.2,
        ease: 'sine.inOut'
      })
    })

    // 卡片内部波浪动画
    cardRefs.value.forEach((card) => {
      const wave = card.querySelector('.wc-card-wave-139')
      if (wave) {
        gsap.to(wave, {
          scrollTrigger: {
            trigger: card,
            start: 'top 60%',
            end: 'bottom 20%',
            scrub: 2
          },
          rotation: 360,
          scale: 1.5,
          opacity: 0.3,
          ease: 'none'
        })
      }
    })

    // 悬停效果
    cardRefs.value.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          scale: 1.1,
          zIndex: 10,
          duration: 0.5,
          ease: 'power2.out'
        })

        gsap.to(card.querySelector('.wc-card-icon-139'), {
          scale: 1.3,
          rotation: 15,
          duration: 0.4,
          ease: 'power2.out'
        })
      })

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          scale: 1,
          zIndex: 1,
          duration: 0.5,
          ease: 'power2.out'
        })

        gsap.to(card.querySelector('.wc-card-icon-139'), {
          scale: 1,
          rotation: 0,
          duration: 0.4,
          ease: 'power2.out'
        })
      })
    })

    // 提示动画
    gsap.from('.wc-hint-139', {
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

    // 提示图标浮动
    gsap.to('.wc-hint-icon-139', {
      y: -10,
      repeat: -1,
      yoyo: true,
      duration: 2,
      ease: 'sine.inOut'
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.wc-scroll-wave-cards-139 {
  min-height: 100vh;
  padding: 100px 20px;
  background: linear-gradient(180deg, #0a0a1a 0%, #1a1a3a 30%, #0f0f2a 60%, #1a1a3a 100%);
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.wc-container-139 {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;

  opacity: 1 !important;}

.wc-title-139 {
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

.wc-subtitle-139 {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 120px;
  letter-spacing: 0.3em;
  text-transform: uppercase;

  opacity: 1 !important;}

.wc-stage-139 {
  position: relative;
  min-height: 800px;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 2000px;

  opacity: 1 !important;}

.wc-wave-container-139 {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  flex-wrap: wrap;
  z-index: 10;

  opacity: 1 !important;}

.wc-wave-card-139 {
  width: 280px;
  height: 380px;
  position: relative;
  cursor: pointer;
  transition: transform 0.5s ease;
  will-change: transform;

  opacity: 1 !important;}

.wc-card-inner-139 {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(168, 85, 247, 0.15));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  overflow: hidden;

  opacity: 1 !important;}

.wc-card-icon-139 {
  font-size: 4.5rem;
  filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.5));
  transition: transform 0.3s ease;

  opacity: 1 !important;}

.wc-card-title-139 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #fff;
  text-align: center;
  margin-bottom: 10px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);

  opacity: 1 !important;}

.wc-card-desc-139 {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  line-height: 1.6;
  text-transform: uppercase;
  letter-spacing: 0.1em;

  opacity: 1 !important;}

.wc-card-wave-139 {
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
  pointer-events: none;
  opacity: 0.5;
  filter: blur(30px);
}

.wc-water-effect-139 {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 1;
}

.wc-water-layer-139 {
  position: absolute;
  bottom: -200px;
  left: -50%;
  width: 200%;
  height: 300px;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(59, 130, 246, 0.05) 50%,
    transparent 100%
  );
  filter: blur(40px);
  transform-origin: center;

  opacity: 1 !important;}

.wc-hint-139 {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 60px;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.9rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;

  opacity: 1 !important;}

.wc-hint-icon-139 {
  font-size: 1.5rem;

  opacity: 1 !important;}

@media (max-width: 768px) {
  .wc-wave-card-139 {
    width: 240px;
    height: 320px;
  
  opacity: 1 !important;}

  .wc-wave-container-139 {
    gap: 30px;
  }

  .wc-card-icon-139 {
    font-size: 3.5rem;
  
  opacity: 1 !important;}

  .wc-card-title-139 {
    font-size: 1.4rem;
  
  opacity: 1 !important;}

  .wc-card-desc-139 {
    font-size: 0.85rem;
  
  opacity: 1 !important;}

  .wc-stage-139 {
    min-height: 600px;
  
  opacity: 1 !important;}
}
</style>
