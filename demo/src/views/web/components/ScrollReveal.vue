<template>
  <div class="sr-scroll-reveal-section-52">
    <div class="sr-section-header-52">
      <h2 class="sr-title-52">SCROLL REVEAL</h2>
      <p class="sr-subtitle-52">滚动渐显效果</p>
    </div>

    <div class="sr-reveal-container-52">
      <div class="sr-reveal-item-52" v-for="(item, index) in items" :key="index">
        <div class="sr-item-image-52">
          <div class="sr-image-inner-52" :style="{ backgroundImage: `url(${item.image})` }"></div>
          <div class="sr-item-number-52">{{ String(index + 1).padStart(2, '0') }}</div>
        </div>
        <div class="sr-item-content-52">
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
        </div>
      </div>
    </div>

    <div class="sr-scroll-indicator-52">
      <div class="sr-arrow-52">↓</div>
      <p>向下滚动查看效果</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const items = ref([
  { image: new URL('@/assets/image/1.png', import.meta.url).href, title: 'Fade Up', description: '从下方渐显' },
  { image: new URL('@/assets/image/2.png', import.meta.url).href, title: 'Fade In', description: '淡入显示' },
  { image: new URL('@/assets/image/3.png', import.meta.url).href, title: 'Slide Left', description: '从左侧滑入' },
  { image: new URL('@/assets/image/4.png', import.meta.url).href, title: 'Slide Right', description: '从右侧滑入' },
  { image: new URL('@/assets/image/5.png', import.meta.url).href, title: 'Scale Up', description: '从小到大' },
  { image: new URL('@/assets/image/6.png', import.meta.url).href, title: 'Rotate In', description: '旋转进入' }
])

let ctx: gsap.Context

const initAnimations = () => {
  ctx = gsap.context(() => {
    // 标题渐显
    gsap.from('.sr-title-52', {
      scrollTrigger: {
        trigger: '.sr-scroll-reveal-section-52',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      y: 50,
      opacity: 0,
      ease: 'power3.out',
      duration: 0.8
    })

    // 副标题渐显
    gsap.from('.sr-subtitle-52', {
      scrollTrigger: {
        trigger: '.sr-scroll-reveal-section-52',
        start: 'top 75%',
        toggleActions: 'play none none reverse'
      },
      y: 30,
      opacity: 0,
      ease: 'power3.out',
      duration: 0.8,
      delay: 0.2
    })

    // 元素1：从下方渐显
    gsap.from('.sr-reveal-item-52:nth-child(1)', {
      scrollTrigger: {
        trigger: '.sr-reveal-item-52:nth-child(1)',
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      y: 100,
      opacity: 0,
      ease: 'power3.out',
      duration: 0.8
    })

    // 元素2：淡入
    gsap.from('.sr-reveal-item-52:nth-child(2)', {
      scrollTrigger: {
        trigger: '.sr-reveal-item-52:nth-child(2)',
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      scale: 0.9,
      ease: 'power3.out',
      duration: 0.8
    })

    // 元素3：从左侧滑入
    gsap.from('.sr-reveal-item-52:nth-child(3)', {
      scrollTrigger: {
        trigger: '.sr-reveal-item-52:nth-child(3)',
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      x: -100,
      opacity: 0,
      ease: 'power3.out',
      duration: 0.8
    })

    // 元素4：从右侧滑入
    gsap.from('.sr-reveal-item-52:nth-child(4)', {
      scrollTrigger: {
        trigger: '.sr-reveal-item-52:nth-child(4)',
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      x: 100,
      opacity: 0,
      ease: 'power3.out',
      duration: 0.8
    })

    // 元素5：从小到大
    gsap.from('.sr-reveal-item-52:nth-child(5)', {
      scrollTrigger: {
        trigger: '.sr-reveal-item-52:nth-child(5)',
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      scale: 0,
      opacity: 0,
      ease: 'back.out(1.7)',
      duration: 0.8
    })

    // 元素6：旋转进入
    gsap.from('.sr-reveal-item-52:nth-child(6)', {
      scrollTrigger: {
        trigger: '.sr-reveal-item-52:nth-child(6)',
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      rotation: 180,
      scale: 0.5,
      opacity: 0,
      ease: 'back.out(1.5)',
      duration: 0.8
    })

    // 图片视差效果
    gsap.to('.sr-image-inner-52', {
      scrollTrigger: {
        trigger: '.sr-reveal-container-52',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      },
      y: (i) => (i % 2 === 0 ? -30 : 30),
      ease: 'none'
    })

    // 数字旋转
    gsap.to('.sr-item-number-52', {
      scrollTrigger: {
        trigger: '.sr-reveal-container-52',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      },
      rotation: 180,
      ease: 'none'
    })

    // 滚动指示器动画
    gsap.to('.sr-scroll-indicator-52 .sr-arrow-52', {
      scrollTrigger: {
        trigger: '.sr-scroll-indicator-52',
        start: 'top 90%',
        end: 'top 70%',
        scrub: true
      },
      y: 20,
      opacity: 0,
      ease: 'none'
    })

    // 滚动指示器淡出
    gsap.to('.sr-scroll-indicator-52', {
      scrollTrigger: {
        trigger: '.sr-reveal-container-52',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out'
    })

    // 悬停效果 - 使用gsap.utils.toArray自动清理
    gsap.utils.toArray('.sr-reveal-item-52').forEach((item: Element) => {
      const itemEl = item as HTMLElement
      itemEl.addEventListener('mouseenter', () => {
        gsap.to(itemEl.querySelector('.sr-image-inner-52'), {
          scale: 1.1,
          duration: 0.4,
          ease: 'power2.out'
        })
        gsap.to(itemEl.querySelector('.sr-item-number-52'), {
          scale: 1.2,
          rotation: 15,
          duration: 0.3,
          ease: 'back.out(1.7)'
        })
      })

      itemEl.addEventListener('mouseleave', () => {
        gsap.to(itemEl.querySelector('.sr-image-inner-52'), {
          scale: 1,
          duration: 0.4,
          ease: 'power2.out'
        })
        gsap.to(itemEl.querySelector('.sr-item-number-52'), {
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
})
</script>

<style scoped>
/* GSAP opacity fix: ensure content is always visible */

.sr-scroll-reveal-section-52 {
  min-height: 100vh;
  padding: 80px 40px;
  background: linear-gradient(135deg, #0d1b2a 0%, #1b263b 50%, #415a77 100%);
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.sr-section-header-52 {
  text-align: center;
  margin-bottom: 80px;

  opacity: 1 !important;}

.sr-title-52 {
  font-size: 56px;
  font-weight: 900;
  color: #fff;
  letter-spacing: 6px;
  text-transform: uppercase;
  text-shadow: 0 0 30px rgba(65, 90, 119, 0.5);

  opacity: 1 !important;}

.sr-subtitle-52 {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 16px;
  letter-spacing: 3px;
  text-transform: uppercase;

  opacity: 1 !important;}

.sr-reveal-container-52 {
  display: flex;
  flex-direction: column;
  gap: 48px;
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 0;

  opacity: 1 !important;}

.sr-reveal-item-52 {
  display: flex;
  gap: 32px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: box-shadow 0.4s ease;

  opacity: 1 !important;}

.sr-reveal-item-52:hover {
  box-shadow: 0 15px 40px rgba(65, 90, 119, 0.3);
}

.sr-item-image-52 {
  position: relative;
  flex-shrink: 0;
  width: 200px;
  height: 200px;
  border-radius: 16px;
  overflow: hidden;

  opacity: 1 !important;}

.sr-image-inner-52 {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transition: transform 0.4s ease;

  opacity: 1 !important;}

.sr-item-number-52 {
  position: absolute;
  top: 12px;
  left: 12px;
  width: 40px;
  height: 40px;
  background: rgba(65, 90, 119, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  border: 2px solid rgba(65, 90, 119, 0.5);
  transition: all 0.4s ease;

  opacity: 1 !important;}

.sr-item-content-52 {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.sr-item-content-52 h3 {
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 10px;
}

.sr-item-content-52 p {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
}

.sr-scroll-indicator-52 {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 10;

  opacity: 1 !important;}

.sr-arrow-52 {
  font-size: 32px;
  color: #fff;
  margin-bottom: 8px;
  animation: bounce 2s infinite;

  opacity: 1 !important;}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.sr-scroll-indicator-52 p {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 2px;
}

@media (max-width: 768px) {
  .sr-title-52 {
    font-size: 32px;
    letter-spacing: 3px;
  
  opacity: 1 !important;}

  .sr-subtitle-52 {
    font-size: 14px;
  
  opacity: 1 !important;}

  .sr-reveal-item-52 {
    flex-direction: column;
    gap: 16px;
  }

  .sr-item-image-52 {
    width: 100%;
    height: 200px;
  
  opacity: 1 !important;}
}
</style>
