<template>
  <div class="fp-fixed-parallax-section-54">
    <div class="fp-section-header-54">
      <h2 class="fp-title-54">FIXED PARALLAX</h2>
      <p class="fp-subtitle-54">固定视差效果</p>
    </div>

    <div class="fp-parallax-spacer-54"></div>

    <div class="fp-fixed-parallax-container-54">
      <div class="fp-fixed-card-54" v-for="(card, index) in cards" :key="index">
        <div class="fp-card-image-54" :style="{ backgroundImage: `url(${card.image})` }"></div>
        <div class="fp-card-info-54">
          <div class="fp-card-number-54">{{ String(index + 1).padStart(2, '0') }}</div>
          <h3>{{ card.title }}</h3>
          <p>{{ card.description }}</p>
        </div>
      </div>
    </div>

    <div class="fp-scroll-progress-54">
      <div class="fp-progress-bar-54"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const cards = ref([
  { image: new URL('@/assets/image/1.png', import.meta.url).href, title: 'Fixed View', description: '固定视图' },
  { image: new URL('@/assets/image/2.png', import.meta.url).href, title: 'Scroll Lock', description: '滚动锁定' },
  { image: new URL('@/assets/image/3.png', import.meta.url).href, title: 'Pin Effect', description: '固定效果' },
  { image: new URL('@/assets/image/4.png', import.meta.url).href, title: 'Sticky Mode', description: '粘性模式' },
  { image: new URL('@/assets/image/5.png', import.meta.url).href, title: 'Hold Position', description: '保持位置' },
  { image: new URL('@/assets/image/6.png', import.meta.url).href, title: 'Stay Put', description: '停留不动' }
])

let ctx: gsap.Context

const initAnimations = () => {
  ctx = gsap.context(() => {
    // 标题渐显
    gsap.from('.fp-fixed-parallax-section-54 .fp-title-54', {
      scrollTrigger: {
        trigger: '.fp-fixed-parallax-section-54',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      y: 50,
      opacity: 0,
      ease: 'power3.out',
      duration: 0.8
    })

    // 副标题渐显
    gsap.from('.fp-fixed-parallax-section-54 .fp-subtitle-54', {
      scrollTrigger: {
        trigger: '.fp-fixed-parallax-section-54',
        start: 'top 75%',
        toggleActions: 'play none none reverse'
      },
      y: 30,
      opacity: 0,
      ease: 'power3.out',
      duration: 0.8,
      delay: 0.2
    })

    // 固定视差容器
    ScrollTrigger.create({
      trigger: '.fp-fixed-parallax-container-54',
      start: 'top top',
      end: '+=300%',
      pin: true,
      scrub: true
    })

    // 卡片入场
    gsap.from('.fp-fixed-card-54', {
      scrollTrigger: {
        trigger: '.fp-fixed-parallax-container-54',
        start: 'top top',
        end: '+=100%',
        scrub: 1
      },
      x: 100,
      opacity: 0,
      stagger: 0.2,
      ease: 'power2.out'
    })

    // 图片缩放视差
    gsap.to('.fp-card-image-54', {
      scrollTrigger: {
        trigger: '.fp-fixed-parallax-container-54',
        start: 'top top',
        end: '+=200%',
        scrub: 1.5
      },
      scale: (i) => 1.2 + i * 0.1,
      ease: 'none'
    })

    // 信息滑入
    gsap.from('.fp-card-info-54', {
      scrollTrigger: {
        trigger: '.fp-fixed-parallax-container-54',
        start: 'top top',
        end: '+=50%',
        scrub: 1
      },
      x: -50,
      opacity: 0,
      stagger: 0.2,
      ease: 'power2.out'
    })

    // 数字旋转
    gsap.to('.fp-card-number-54', {
      scrollTrigger: {
        trigger: '.fp-fixed-parallax-container-54',
        start: 'top top',
        end: '+=150%',
        scrub: 1
      },
      rotation: 360,
      scale: 1.3,
      ease: 'none'
    })

    // 卡片交替视差
    gsap.to('.fp-fixed-card-54:nth-child(odd)', {
      scrollTrigger: {
        trigger: '.fp-fixed-parallax-container-54',
        start: 'top top',
        end: '+=250%',
        scrub: 1
      },
      y: -50,
      ease: 'none'
    })

    gsap.to('.fp-fixed-card-54:nth-child(even)', {
      scrollTrigger: {
        trigger: '.fp-fixed-parallax-container-54',
        start: 'top top',
        end: '+=250%',
        scrub: 1
      },
      y: 50,
      ease: 'none'
    })

    // 进度条
    gsap.to('.fp-progress-bar-54', {
      scrollTrigger: {
        trigger: '.fp-fixed-parallax-container-54',
        start: 'top top',
        end: '+=300%',
        scrub: 0.3
      },
      width: '100%',
      ease: 'none'
    })

    // 进度条渐入
    gsap.from('.fp-scroll-progress-54', {
      scrollTrigger: {
        trigger: '.fp-fixed-parallax-container-54',
        start: 'top top',
        toggleActions: 'play none none reverse'
      },
      y: -20,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out'
    })

    // 悬停效果 - 使用gsap.utils.toArray自动清理
    gsap.utils.toArray('.fp-fixed-card-54').forEach((item: Element) => {
      const card = item as HTMLElement
      card.addEventListener('mouseenter', () => {
        gsap.to(card.querySelector('.fp-card-image-54'), {
          scale: 1.15,
          duration: 0.4,
          ease: 'power2.out'
        })
        gsap.to(card.querySelector('.fp-card-number-54'), {
          scale: 1.4,
          rotation: 90,
          duration: 0.3,
          ease: 'back.out(1.7)'
        })
      })

      card.addEventListener('mouseleave', () => {
        gsap.to(card.querySelector('.fp-card-image-54'), {
          scale: 1,
          duration: 0.4,
          ease: 'power2.out'
        })
        gsap.to(card.querySelector('.fp-card-number-54'), {
          scale: 1,
          rotation: 0,
          duration: 0.3,
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
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
})
</script>

<style scoped>
/* GSAP opacity fix: ensure content is always visible */

.fp-fixed-parallax-section-54 {
  min-height: 100vh;
  padding: 80px 40px;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #2d1b69 100%);
  position: relative;
  overflow-x: hidden;

  opacity: 1 !important;}

.fp-section-header-54 {
  text-align: center;
  margin-bottom: 80px;

  opacity: 1 !important;}

.fp-title-54 {
  font-size: 56px;
  font-weight: 900;
  color: #fff;
  letter-spacing: 6px;
  text-transform: uppercase;
  text-shadow: 0 0 30px rgba(45, 27, 105, 0.5);

  opacity: 1 !important;}

.fp-subtitle-54 {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 16px;
  letter-spacing: 3px;
  text-transform: uppercase;

  opacity: 1 !important;}

.fp-parallax-spacer-54 {
  height: 100vh;

  opacity: 1 !important;}

.fp-fixed-parallax-container-54 {
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px;

  opacity: 1 !important;}

.fp-fixed-card-54 {
  flex: 1;
  height: 500px;
  border-radius: 24px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  position: relative;
  transition: box-shadow 0.4s ease;

  opacity: 1 !important;}

.fp-fixed-card-54:hover {
  box-shadow: 0 20px 60px rgba(45, 27, 105, 0.4);
}

.fp-card-image-54 {
  width: 100%;
  height: 70%;
  background-size: cover;
  background-position: center;
  transition: transform 0.4s ease;

  opacity: 1 !important;}

.fp-card-info-54 {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30%;
  padding: 24px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  transform: translateZ(20px);

  opacity: 1 !important;}

.fp-card-number-54 {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 56px;
  height: 56px;
  background: rgba(45, 27, 105, 0.8);
  backdrop-filter: blur(12px);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  border: 2px solid rgba(45, 27, 105, 0.5);
  transition: all 0.4s ease;

  opacity: 1 !important;}

.fp-card-info-54 h3 {
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.fp-card-info-54 p {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.4;
}

.fp-scroll-progress-54 {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  z-index: 100;

  opacity: 1 !important;}

.fp-progress-bar-54 {
  width: 0;
  height: 100%;
  background: linear-gradient(90deg, #2d1b69, #5c3d7a, #8b5fb8);
  transition: width 0.1s linear;

  opacity: 1 !important;}

@media (max-width: 1024px) {
  .fp-fixed-parallax-container-54 {
    flex-direction: column;
    height: auto;
    min-height: 100vh;
  
  opacity: 1 !important;}

  .fp-fixed-card-54 {
    width: 100%;
    max-width: 400px;
    height: 450px;
  
  opacity: 1 !important;}
}

@media (max-width: 768px) {
  .fp-title-54 {
    font-size: 32px;
    letter-spacing: 3px;
  
  opacity: 1 !important;}

  .fp-subtitle-54 {
    font-size: 14px;
  
  opacity: 1 !important;}

  .fp-fixed-card-54 {
    height: 380px;
  
  opacity: 1 !important;}
}
</style>
