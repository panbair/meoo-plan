<template>
  <div class="zp-zoom-pan-section-50">
    <div class="zp-section-header-50">
      <h2 class="zp-title-50">ZOOM PAN GALLERY</h2>
      <p class="zp-subtitle-50">缩放平移效果</p>
    </div>

    <div class="zp-zoom-pan-container-50">
      <div class="zp-zoom-pan-card-50" v-for="(card, index) in cards" :key="index">
        <div class="zp-card-inner-50">
          <div class="zp-card-bg-50" :style="{ backgroundImage: `url(${card.image})` }"></div>
          <div class="zp-card-overlay-50"></div>
          <div class="zp-card-number-50">{{ String(index + 1).padStart(2, '0') }}</div>
          <div class="zp-card-content-50">
            <h3>{{ card.title }}</h3>
            <p>{{ card.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="zp-zoom-hint-50">滚动查看缩放平移效果</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const cards = ref([
  { image: new URL('@/assets/image/1.png', import.meta.url).href, title: 'Urban Life', description: 'City stories unfold' },
  { image: new URL('@/assets/image/2.png', import.meta.url).href, title: 'Nature\'s Art', description: 'Beauty in every leaf' },
  { image: new URL('@/assets/image/3.png', import.meta.url).href, title: 'Ocean Tales', description: 'Deep blue mysteries' },
  { image: new URL('@/assets/image/4.png', import.meta.url).href, title: 'Mountain High', description: 'Touching the sky' },
  { image: new URL('@/assets/image/5.png', import.meta.url).href, title: 'Desert Dreams', description: 'Golden horizons' },
  { image: new URL('@/assets/image/6.png', import.meta.url).href, title: 'Forest Paths', description: 'Into the wild' }
])

let ctx: gsap.Context

const initAnimations = () => {
  ctx = gsap.context(() => {
    // 标题入场
    gsap.from('.zp-title-50', {
      scrollTrigger: {
        trigger: '.zp-zoom-pan-section-50',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      y: 60,
      opacity: 0,
      ease: 'power3.out',
      duration: 0.8
    })

    // 副标题入场
    gsap.from('.zp-subtitle-50', {
      scrollTrigger: {
        trigger: '.zp-zoom-pan-section-50',
        start: 'top 75%',
        toggleActions: 'play none none reverse'
      },
      y: 40,
      opacity: 0,
      ease: 'power3.out',
      duration: 0.8,
      delay: 0.2
    })

    // 卡片从两侧入场
    gsap.from('.zp-zoom-pan-card-50', {
      scrollTrigger: {
        trigger: '.zp-zoom-pan-container-50',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
      },
      x: (i) => i % 2 === 0 ? -200 : 200,
      opacity: 0,
      scale: 0.8,
      rotationY: (i) => i % 2 === 0 ? -30 : 30,
      stagger: {
        each: 0.15,
        ease: 'power2.out'
      },
      ease: 'power3.out',
      duration: 1
    })

    // 背景图片缩放平移
    gsap.to('.zp-card-bg-50', {
      scrollTrigger: {
        trigger: '.zp-zoom-pan-container-50',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5
      },
      scale: 1.3,
      x: (i) => (i % 2 === 0 ? 30 : -30) + '%',
      ease: 'none'
    })

    // 覆盖层渐变
    gsap.to('.zp-card-overlay-50', {
      scrollTrigger: {
        trigger: '.zp-zoom-pan-container-50',
        start: 'top 60%',
        end: 'top 20%',
        scrub: true
      },
      opacity: 0.7,
      ease: 'none'
    })

    // 数字旋转缩放
    gsap.to('.zp-zoom-pan-card-50 .zp-card-number-50', {
      scrollTrigger: {
        trigger: '.zp-zoom-pan-container-50',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      },
      rotation: 360,
      scale: 1.2,
      ease: 'none'
    })

    // 内容从底部滑入
    gsap.from('.zp-zoom-pan-card-50 .zp-card-content-50', {
      scrollTrigger: {
        trigger: '.zp-zoom-pan-container-50',
        start: 'top 50%',
        toggleActions: 'play none none reverse'
      },
      y: 60,
      opacity: 0,
      stagger: {
        each: 0.1,
        ease: 'power2.out'
      },
      ease: 'power3.out',
      duration: 0.8
    })

    // 滚动时内容向上移动
    gsap.to('.zp-zoom-pan-card-50 .zp-card-content-50', {
      scrollTrigger: {
        trigger: '.zp-zoom-pan-container-50',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      },
      y: -30,
      ease: 'none'
    })

    // 提示文字渐入
    gsap.from('.zp-zoom-hint-50', {
      scrollTrigger: {
        trigger: '.zp-zoom-hint-50',
        start: 'top 90%',
        toggleActions: 'play none none reverse'
      },
      y: 30,
      opacity: 0,
      ease: 'power3.out',
      duration: 0.6
    })

    // 悬停效果 - 使用gsap.utils.toArray自动清理
    gsap.utils.toArray('.zp-zoom-pan-card-50').forEach((card: Element) => {
      const cardEl = card as HTMLElement
      cardEl.addEventListener('mouseenter', () => {
        gsap.to(cardEl.querySelector('.zp-card-bg-50'), {
          scale: 1.5,
          duration: 0.6,
          ease: 'power2.out'
        })
        gsap.to(cardEl.querySelector('.zp-card-content-50'), {
          y: -10,
          duration: 0.4,
          ease: 'power2.out'
        })
        gsap.to(cardEl.querySelector('.zp-card-number-50'), {
          scale: 1.3,
          rotation: 180,
          duration: 0.5,
          ease: 'power2.out'
        })
      })

      cardEl.addEventListener('mouseleave', () => {
        gsap.to(cardEl.querySelector('.zp-card-bg-50'), {
          scale: 1,
          duration: 0.6,
          ease: 'power2.out'
        })
        gsap.to(cardEl.querySelector('.zp-card-content-50'), {
          y: 0,
          duration: 0.4,
          ease: 'power2.out'
        })
        gsap.to(cardEl.querySelector('.zp-card-number-50'), {
          scale: 1,
          rotation: 0,
          duration: 0.5,
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

.zp-zoom-pan-section-50 {
  min-height: 100vh;
  padding: 80px 40px;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #2d1b4e 100%);
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.zp-section-header-50 {
  text-align: center;
  margin-bottom: 80px;

  opacity: 1 !important;}

.zp-title-50 {
  font-size: 56px;
  font-weight: 900;
  color: #fff;
  letter-spacing: 8px;
  text-transform: uppercase;
  text-shadow: 0 0 30px rgba(138, 43, 226, 0.5);

  opacity: 1 !important;}

.zp-subtitle-50 {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 16px;
  letter-spacing: 3px;
  text-transform: uppercase;

  opacity: 1 !important;}

.zp-zoom-pan-container-50 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 32px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 0;

  opacity: 1 !important;}

.zp-zoom-pan-card-50 {
  position: relative;
  height: 400px;
  border-radius: 24px;
  overflow: hidden;
  cursor: pointer;
  transform-style: preserve-3d;
  transition: box-shadow 0.4s ease;

  opacity: 1 !important;}

.zp-zoom-pan-card-50:hover {
  box-shadow: 0 25px 70px rgba(138, 43, 226, 0.3);
}

.zp-card-inner-50 {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.zp-card-bg-50 {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transition: transform 0.6s ease;

  opacity: 1 !important;}

.zp-card-overlay-50 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 60%);
  pointer-events: none;
  transition: opacity 0.4s ease;

  opacity: 1 !important;}

.zp-card-number-50 {
  position: absolute;
  top: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  background: rgba(138, 43, 226, 0.3);
  backdrop-filter: blur(12px);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  border: 2px solid rgba(138, 43, 226, 0.5);
  transition: all 0.5s ease;

  opacity: 1 !important;}

.zp-card-content-50 {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 32px;
  transform: translateZ(30px);

  opacity: 1 !important;}

.zp-card-content-50 h3 {
  font-size: 32px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 10px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.zp-card-content-50 p {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
}

.zp-zoom-hint-50 {
  text-align: center;
  margin-top: 60px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 2px;
  text-transform: uppercase;

  opacity: 1 !important;}

@media (max-width: 768px) {
  .zp-title-50 {
    font-size: 32px;
    letter-spacing: 4px;
  
  opacity: 1 !important;}

  .zp-subtitle-50 {
    font-size: 14px;
  
  opacity: 1 !important;}

  .zp-zoom-pan-container-50 {
    gap: 24px;
  }

  .zp-zoom-pan-card-50 {
    height: 320px;
  
  opacity: 1 !important;}
}
</style>
