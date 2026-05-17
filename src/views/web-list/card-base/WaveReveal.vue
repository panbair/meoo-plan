<template>
  <div class="wr-wave-reveal-section-49">
    <div class="wr-section-header-49">
      <h2 class="wr-title-49">
        <span class="wr-char-49" v-for="(char, i) in 'WAVE REVEAL'" :key="i">{{ char }}</span>
      </h2>
      <p class="wr-subtitle-49">波浪揭示效果</p>
    </div>

    <div class="wr-wave-container-49">
      <div class="wr-wave-card-49" v-for="(card, index) in cards" :key="index">
        <div class="wr-card-image-wrapper-49">
          <div class="wr-card-image-49" :style="{ backgroundImage: `url(${card.image})` }"></div>
          <div class="wr-wave-overlay-49"></div>
          <div class="wr-card-number-49">{{ String(index + 1).padStart(2, '0') }}</div>
        </div>
        <div class="wr-card-content-49">
          <h3>{{ card.title }}</h3>
          <p>{{ card.description }}</p>
        </div>
      </div>
    </div>

    <div class="wr-replay-btn-49" @click="replayAnimation">
      <span>重播动画</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const cards = ref([
  { image: new URL('@/assets/image/1.png', import.meta.url).href, title: 'Ocean Waves', description: 'The rhythm of the sea' },
  { image: new URL('@/assets/image/2.png', import.meta.url).href, title: 'Mountain Breeze', description: 'Whispers of nature' },
  { image: new URL('@/assets/image/3.png', import.meta.url).href, title: 'Forest Echo', description: 'Songs of the wild' },
  { image: new URL('@/assets/image/4.png', import.meta.url).href, title: 'Sky Dreams', description: 'Above the clouds' },
  { image: new URL('@/assets/image/5.png', import.meta.url).href, title: 'Desert Wind', description: 'Golden sands' },
  { image: new URL('@/assets/image/6.png', import.meta.url).href, title: 'Arctic Glow', description: 'Northern lights' }
])

let ctx: gsap.Context

const replayAnimation = () => {
  if (ctx) {
    ctx.revert()
  }
  initAnimations()
}

const initAnimations = () => {
  ctx = gsap.context(() => {
    // 标题波浪揭示
    gsap.from('.wr-section-header-49 .wr-title-49 .wr-char-49', {
      scrollTrigger: {
        trigger: '.wr-section-header-49',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      y: 100,
      opacity: 0,
      stagger: {
        each: 0.05,
        from: 'center',
        ease: 'power2.out'
      },
      ease: 'back.out(1.7)',
      duration: 0.8
    })

    // 卡片波浪入场
    gsap.from('.wr-wave-card-49', {
      scrollTrigger: {
        trigger: '.wr-wave-container-49',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
      },
      y: 200,
      opacity: 0,
      rotationX: 45,
      stagger: {
        each: 0.1,
        ease: 'power2.out'
      },
      ease: 'power3.out',
      duration: 1
    })

    // 图片波浪显示
    gsap.from('.wr-card-image-49', {
      scrollTrigger: {
        trigger: '.wr-wave-container-49',
        start: 'top 60%',
        toggleActions: 'play none none reverse'
      },
      scale: 1.5,
      opacity: 0,
      stagger: {
        each: 0.1,
        ease: 'power2.out'
      },
      ease: 'power2.out',
      duration: 1,
      delay: 0.2
    })

    // 数字波浪旋转
    gsap.from('.wr-wave-card-49 .wr-card-number-49', {
      scrollTrigger: {
        trigger: '.wr-wave-container-49',
        start: 'top 60%',
        toggleActions: 'play none none reverse'
      },
      rotation: -180,
      scale: 0,
      opacity: 0,
      stagger: {
        each: 0.1,
        ease: 'power2.out'
      },
      ease: 'back.out(1.7)',
      duration: 0.8
    })

    // 内容波浪滑入
    gsap.from('.wr-wave-card-49 .wr-card-content-49', {
      scrollTrigger: {
        trigger: '.wr-wave-container-49',
        start: 'top 50%',
        toggleActions: 'play none none reverse'
      },
      x: -100,
      opacity: 0,
      stagger: {
        each: 0.1,
        ease: 'power2.out'
      },
      ease: 'power3.out',
      duration: 0.8
    })

    // 滚动时波浪波动
    gsap.to('.wr-wave-card-49', {
      scrollTrigger: {
        trigger: '.wr-wave-container-49',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      },
      y: (i) => i * 20 - 50,
      ease: 'none'
    })

    // 图片滚动缩放波浪
    gsap.to('.wr-card-image-49', {
      scrollTrigger: {
        trigger: '.wr-wave-container-49',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      },
      scale: (i) => 1 + Math.sin(i * 0.5) * 0.1,
      ease: 'none'
    })

    // 覆盖层渐变
    gsap.fromTo('.wr-wave-overlay-49',
      { opacity: 1 },
      {
        scrollTrigger: {
          trigger: '.wr-wave-container-49',
          start: 'top 60%',
          end: 'top 20%',
          scrub: true
        },
        opacity: 0,
        ease: 'none'
      }
    )

    // 重播按钮渐入
    gsap.from('.wr-replay-btn-49', {
      scrollTrigger: {
        trigger: '.wr-replay-btn-49',
        start: 'top 90%',
        toggleActions: 'play none none reverse'
      },
      y: 30,
      opacity: 0,
      ease: 'power3.out',
      duration: 0.6
    })

    // 悬停效果 - 使用gsap.context自动清理
    gsap.utils.toArray('.wr-wave-card-49').forEach((card: Element) => {
      const cardEl = card as HTMLElement
      cardEl.addEventListener('mouseenter', () => {
        gsap.to(cardEl.querySelector('.wr-card-image-49'), {
          scale: 1.1,
          duration: 0.4,
          ease: 'power2.out'
        })
        gsap.to(cardEl.querySelector('.wr-card-number-49'), {
          scale: 1.2,
          rotation: 10,
          duration: 0.4,
          ease: 'back.out(1.7)'
        })
      })

      cardEl.addEventListener('mouseleave', () => {
        gsap.to(cardEl.querySelector('.wr-card-image-49'), {
          scale: 1,
          duration: 0.4,
          ease: 'power2.out'
        })
        gsap.to(cardEl.querySelector('.wr-card-number-49'), {
          scale: 1,
          rotation: 0,
          duration: 0.4,
          ease: 'power2.out'
        })
      })
    })
  })
}

onMounted(() => {
  initAnimations()
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped>
/* GSAP opacity fix: ensure content is always visible */

.wr-wave-reveal-section-49 {
  min-height: 100vh;
  padding: 80px 40px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.wr-section-header-49 {
  text-align: center;
  margin-bottom: 80px;

  opacity: 1 !important;}

.wr-title-49 {
  font-size: 64px;
  font-weight: 900;
  color: #fff;
  display: inline-block;
  overflow: hidden;
  perspective: 1000px;

  opacity: 1 !important;}

.wr-title-49 .wr-char-49 {
  display: inline-block;
  text-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
}

.wr-subtitle-49 {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 20px;
  letter-spacing: 4px;

  opacity: 1 !important;}

.wr-wave-container-49 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 40px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 0;

  opacity: 1 !important;}

.wr-wave-card-49 {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  transform-style: preserve-3d;
  transition: box-shadow 0.3s ease;

  opacity: 1 !important;}

.wr-wave-card-49:hover {
  box-shadow: 0 20px 60px rgba(0, 255, 255, 0.2);
}

.wr-card-image-wrapper-49 {
  position: relative;
  height: 280px;
  overflow: hidden;

  opacity: 1 !important;}

.wr-card-image-49 {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transition: transform 0.4s ease;

  opacity: 1 !important;}

.wr-wave-overlay-49 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, transparent 0%, rgba(26, 26, 46, 0.8) 100%);
  pointer-events: none;

  opacity: 1 !important;}

.wr-card-number-49 {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  background: rgba(0, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  color: #00ffff;
  border: 2px solid rgba(0, 255, 255, 0.3);
  transition: all 0.4s ease;

  opacity: 1 !important;}

.wr-card-content-49 {
  padding: 30px;
  transform: translateZ(20px);

  opacity: 1 !important;}

.wr-card-content-49 h3 {
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 12px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.wr-card-content-49 p {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
}

.wr-replay-btn-49 {
  display: block;
  margin: 60px auto 0;
  padding: 16px 40px;
  background: linear-gradient(135deg, #00ffff 0%, #0080ff 100%);
  border: none;
  border-radius: 30px;
  color: #1a1a2e;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(0, 255, 255, 0.3);

  opacity: 1 !important;}

.wr-replay-btn-49:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(0, 255, 255, 0.4);
}

.wr-replay-btn-49:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .wr-title-49 {
    font-size: 36px;
  
  opacity: 1 !important;}

  .wr-subtitle-49 {
    font-size: 14px;
  
  opacity: 1 !important;}

  .wr-wave-container-49 {
    gap: 24px;
  }

  .wr-card-image-wrapper-49 {
    height: 220px;
  
  opacity: 1 !important;}
}
</style>
