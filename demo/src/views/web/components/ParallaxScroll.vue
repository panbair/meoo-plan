<template>
  <div class="ps-parallax-scroll-section-53">
    <div class="ps-section-header-53">
      <h2 class="ps-title-53">PARALLAX SCROLL</h2>
      <p class="ps-subtitle-53">滚动视差效果</p>
    </div>

    <div class="ps-parallax-container-53">
      <div class="ps-parallax-layer-53" v-for="(layer, index) in layers" :key="index" :class="`ps-layer-${index + 1}`">
        <div class="ps-layer-card-53">
          <div class="ps-card-image-53" :style="{ backgroundImage: `url(${layer.image})` }"></div>
          <div class="ps-card-overlay-53"></div>
          <div class="ps-card-content-53">
            <div class="ps-card-number-53">{{ String(index + 1).padStart(2, '0') }}</div>
            <h3>{{ layer.title }}</h3>
            <p>{{ layer.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="ps-parallax-hint-53">
      <span>不同图层以不同速度滚动</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const layers = ref([
  { image: new URL('@/assets/image/1.png', import.meta.url).href, title: 'Slow Layer', description: '最慢的图层' },
  { image: new URL('@/assets/image/2.png', import.meta.url).href, title: 'Medium Layer', description: '中速图层' },
  { image: new URL('@/assets/image/3.png', import.meta.url).href, title: 'Fast Layer', description: '快速图层' },
  { image: new URL('@/assets/image/4.png', import.meta.url).href, title: 'Ultra Layer', description: '超速图层' },
  { image: new URL('@/assets/image/5.png', import.meta.url).href, title: 'Turbo Layer', description: '极速图层' },
  { image: new URL('@/assets/image/6.png', import.meta.url).href, title: 'Mega Layer', description: '最快图层' }
])

let ctx: gsap.Context

const initAnimations = () => {
  ctx = gsap.context(() => {
    // 标题视差
    gsap.from('.ps-title-53', {
      scrollTrigger: {
        trigger: '.ps-parallax-scroll-section-53',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      y: 80,
      opacity: 0,
      ease: 'power3.out',
      duration: 0.8
    })

    // 副标题视差
    gsap.from('.ps-subtitle-53', {
      scrollTrigger: {
        trigger: '.ps-parallax-scroll-section-53',
        start: 'top 75%',
        toggleActions: 'play none none reverse'
      },
      y: 60,
      opacity: 0,
      ease: 'power3.out',
      duration: 0.8,
      delay: 0.2
    })

    // 图层入场 - 从底部渐显
    gsap.from('.ps-parallax-layer-53', {
      scrollTrigger: {
        trigger: '.ps-parallax-container-53',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
      },
      y: 150,
      opacity: 0,
      stagger: 0.15,
      ease: 'power3.out',
      duration: 1
    })

    // 不同视差速度
    gsap.to('.ps-parallax-layer-53.ps-layer-1', {
      scrollTrigger: {
        trigger: '.ps-parallax-container-53',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      },
      y: -100,
      ease: 'none'
    })

    gsap.to('.ps-parallax-layer-53.ps-layer-2', {
      scrollTrigger: {
        trigger: '.ps-parallax-container-53',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      },
      y: -80,
      ease: 'none'
    })

    gsap.to('.ps-parallax-layer-53.ps-layer-3', {
      scrollTrigger: {
        trigger: '.ps-parallax-container-53',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      },
      y: -60,
      ease: 'none'
    })

    gsap.to('.ps-parallax-layer-53.ps-layer-4', {
      scrollTrigger: {
        trigger: '.ps-parallax-container-53',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      },
      y: -40,
      ease: 'none'
    })

    gsap.to('.ps-parallax-layer-53.ps-layer-5', {
      scrollTrigger: {
        trigger: '.ps-parallax-container-53',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      },
      y: -20,
      ease: 'none'
    })

    gsap.to('.ps-parallax-layer-53.ps-layer-6', {
      scrollTrigger: {
        trigger: '.ps-parallax-container-53',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      },
      y: 0,
      ease: 'none'
    })

    // 图片内部视差
    gsap.to('.ps-card-image-53', {
      scrollTrigger: {
        trigger: '.ps-parallax-container-53',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5
      },
      y: (i) => (i % 2 === 0 ? -40 : 40),
      scale: (i) => 1 + i * 0.05,
      ease: 'none'
    })

    // 覆盖层视差
    gsap.to('.ps-card-overlay-53', {
      scrollTrigger: {
        trigger: '.ps-parallax-container-53',
        start: 'top 60%',
        end: 'top 20%',
        scrub: true
      },
      opacity: 0.8,
      ease: 'none'
    })

    // 数字视差旋转
    gsap.to('.ps-card-number-53', {
      scrollTrigger: {
        trigger: '.ps-parallax-container-53',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      },
      rotation: (i) => i * 60,
      scale: 1.3,
      ease: 'none'
    })

    // 内容视差
    gsap.to('.ps-card-content-53', {
      scrollTrigger: {
        trigger: '.ps-parallax-container-53',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      },
      y: -30,
      ease: 'none'
    })

    // 提示文字渐入
    gsap.from('.ps-parallax-hint-53', {
      scrollTrigger: {
        trigger: '.ps-parallax-hint-53',
        start: 'top 90%',
        toggleActions: 'play none none reverse'
      },
      y: 30,
      opacity: 0,
      ease: 'power3.out',
      duration: 0.6
    })

    // 悬停效果 - 使用gsap.utils.toArray自动清理
    gsap.utils.toArray('.ps-layer-card-53').forEach((item: Element) => {
      const card = item as HTMLElement
      card.addEventListener('mouseenter', () => {
        gsap.to(card.querySelector('.ps-card-image-53'), {
          scale: 1.2,
          y: -20,
          duration: 0.5,
          ease: 'power2.out'
        })
        gsap.to(card.querySelector('.ps-card-number-53'), {
          scale: 1.4,
          rotation: 45,
          duration: 0.3,
          ease: 'back.out(1.7)'
        })
      })

      card.addEventListener('mouseleave', () => {
        gsap.to(card.querySelector('.ps-card-image-53'), {
          scale: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out'
        })
        gsap.to(card.querySelector('.ps-card-number-53'), {
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

.ps-parallax-scroll-section-53 {
  min-height: 100vh;
  padding: 80px 40px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.ps-section-header-53 {
  text-align: center;
  margin-bottom: 80px;

  opacity: 1 !important;}

.ps-title-53 {
  font-size: 56px;
  font-weight: 900;
  color: #fff;
  letter-spacing: 6px;
  text-transform: uppercase;
  text-shadow: 0 0 30px rgba(15, 52, 96, 0.5);

  opacity: 1 !important;}

.ps-subtitle-53 {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 16px;
  letter-spacing: 3px;
  text-transform: uppercase;

  opacity: 1 !important;}

.ps-parallax-container-53 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 40px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 60px 0;

  opacity: 1 !important;}

.ps-parallax-layer-53 {
  perspective: 1000px;
}

.ps-layer-card-53 {
  position: relative;
  height: 400px;
  border-radius: 24px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  transform-style: preserve-3d;
  transition: box-shadow 0.4s ease;

  opacity: 1 !important;}

.ps-layer-card-53:hover {
  box-shadow: 0 20px 60px rgba(15, 52, 96, 0.5);
}

.ps-card-image-53 {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transition: transform 0.5s ease;

  opacity: 1 !important;}

.ps-card-overlay-53 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.8) 100%);
  pointer-events: none;
  transition: opacity 0.4s ease;

  opacity: 1 !important;}

.ps-card-content-53 {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 32px;
  transform: translateZ(30px);

  opacity: 1 !important;}

.ps-card-number-53 {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 56px;
  height: 56px;
  background: rgba(15, 52, 96, 0.8);
  backdrop-filter: blur(12px);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  border: 2px solid rgba(15, 52, 96, 0.5);
  transition: all 0.4s ease;

  opacity: 1 !important;}

.ps-card-content-53 h3 {
  font-size: 32px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 10px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.ps-card-content-53 p {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
}

.ps-parallax-hint-53 {
  text-align: center;
  margin-top: 60px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  display: inline-block;
  margin-left: 50%;
  transform: translateX(-50%);

  opacity: 1 !important;}

.ps-parallax-hint-53 span {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 2px;
  text-transform: uppercase;
}

@media (max-width: 768px) {
  .ps-title-53 {
    font-size: 32px;
    letter-spacing: 3px;
  
  opacity: 1 !important;}

  .ps-subtitle-53 {
    font-size: 14px;
  
  opacity: 1 !important;}

  .ps-parallax-container-53 {
    gap: 24px;
  }

  .ps-layer-card-53 {
    height: 320px;
  
  opacity: 1 !important;}
}
</style>
