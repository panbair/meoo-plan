<template>
  <section class="sir-scroll-image-reveal-118">
    <div class="sir-container-118">
      <h2 class="sir-section-title-118">滚动图片揭示</h2>
      <p class="sir-section-subtitle-118">Scroll Image Reveal Animation</p>

      <div class="sir-gallery-118">
        <div
          v-for="(img, index) in images"
          :key="index"
          class="sir-item-118"
          ref="items"
        >
          <div class="sir-image-wrapper-118">
            <div class="sir-image-mask-118" ref="masks">
              <img :src="img" :alt="`Image ${index + 1}`" />
            </div>
            <div class="sir-overlay-118">
              <span class="sir-number-118">{{ String(index + 1).padStart(2, '0') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const items = ref<HTMLElement[]>([])
const masks = ref<HTMLElement[]>([])
const images = [
  new URL('@/assets/image/1.png', import.meta.url).href,
  new URL('@/assets/image/2.png', import.meta.url).href,
  new URL('@/assets/image/3.png', import.meta.url).href,
  new URL('@/assets/image/4.png', import.meta.url).href,
  new URL('@/assets/image/5.png', import.meta.url).href,
  new URL('@/assets/image/6.png', import.meta.url).href
]

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 标题动画
    gsap.from('.sir-section-title-118', {
      scrollTrigger: {
        trigger: '.sir-scroll-image-reveal-118',
        start: 'top 80%'
      },
      y: 60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    })

    gsap.from('.sir-section-subtitle-118', {
      scrollTrigger: {
        trigger: '.sir-scroll-image-reveal-118',
        start: 'top 75%'
      },
      y: 40,
      opacity: 0,
      duration: 1,
      delay: 0.2,
      ease: 'power3.out'
    })

    items.value.forEach((item, index) => {
      const mask = masks.value[index]
      const overlay = item.querySelector('.sir-overlay-118') as HTMLElement
      const number = item.querySelector('.sir-number-118') as HTMLElement
      const img = mask.querySelector('img') as HTMLElement

      // 图片遮罩揭示效果 - 先移除CSS中的初始clipPath
      gsap.set(mask, { clipPath: 'inset(0 100% 0 0)' })

      // 项目入场动画
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: 'top 90%',
          toggleActions: 'play none none reverse'
        },
        y: 100,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: index * 0.1
      })

      // 图片遮罩揭示效果
      gsap.to(mask, {
        clipPath: 'inset(0 0 0 0)',
        scrollTrigger: {
          trigger: item,
          start: 'top 75%',
          end: 'bottom 25%',
          scrub: 1
        },
        ease: 'power2.inOut'
      })

      // 图片缩放效果
      gsap.set(img, { scale: 1.2 })
      gsap.to(img, {
        scale: 1,
        scrollTrigger: {
          trigger: item,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 1
        },
        ease: 'power1.out'
      })

      // 覆盖层渐变显示
      gsap.set(overlay, { opacity: 0 })
      gsap.to(overlay, {
        opacity: 1,
        scrollTrigger: {
          trigger: item,
          start: 'top 70%',
          end: 'top 50%',
          scrub: true
        }
      })

      // 数字旋转入场
      gsap.set(number, { rotation: -180, scale: 0.5, opacity: 0 })
      gsap.to(number, {
        rotation: 0,
        scale: 1,
        opacity: 1,
        scrollTrigger: {
          trigger: item,
          start: 'top 65%',
          end: 'top 45%',
          scrub: 1
        },
        ease: 'back.out(1.7)'
      })

      // 悬停效果
      item.addEventListener('mouseenter', () => {
        gsap.to(mask, { scale: 1.03, duration: 0.4, ease: 'power2.out' })
        gsap.to(number, { scale: 1.15, duration: 0.3, ease: 'back.out(1.7)' })
      })

      item.addEventListener('mouseleave', () => {
        gsap.to(mask, { scale: 1, duration: 0.4, ease: 'power2.out' })
        gsap.to(number, { scale: 1, duration: 0.3, ease: 'power2.out' })
      })
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.sir-scroll-image-reveal-118 {
  min-height: 100vh;
  padding: 80px 0;
  background: linear-gradient(180deg, #0f0f23 0%, #1a1a3e 50%, #0f0f23 100%);
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
      radial-gradient(circle at 20% 30%, rgba(167, 139, 250, 0.06) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(96, 165, 250, 0.06) 0%, transparent 50%);
    pointer-events: none;
  
  opacity: 1 !important;}
}

.sir-container-118 {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 30px;
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.sir-section-title-118 {
  text-align: center;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  color: #fff;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #a78bfa, #60a5fa, #f472b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 30px rgba(167, 139, 250, 0.3);

  opacity: 1 !important;}

.sir-section-subtitle-118 {
  text-align: center;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 80px;
  letter-spacing: 0.1em;
  text-transform: uppercase;

  opacity: 1 !important;}

.sir-gallery-118 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.sir-item-118 {
  position: relative;
  height: 380px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  background: linear-gradient(135deg, #1a1a3a 0%, #0f0f2a 100%);
  cursor: pointer;
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 25px 80px rgba(167, 139, 250, 0.2);
  
  opacity: 1 !important;}
}

.sir-image-wrapper-118 {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.sir-image-mask-118 {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  transform-origin: center center;
  clip-path: inset(0 100% 0 0);

  opacity: 1 !important;}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.sir-overlay-118 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.85) 0%,
    rgba(0, 0, 0, 0.3) 50%,
    transparent 100%
  );
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 20px;
  pointer-events: none;
  opacity: 0;
}

.sir-number-118 {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 900;
  color: #fff;
  background: linear-gradient(135deg, #a78bfa, #60a5fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-family: 'Arial', sans-serif;
  text-shadow: 0 0 30px rgba(167, 139, 250, 0.6);
  transform: rotate(-180deg) scale(0.5);
  opacity: 0;
}

@media (max-width: 1024px) {
  .sir-gallery-118 {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }

  .sir-item-118 {
    height: 340px;
  
  opacity: 1 !important;}
}

@media (max-width: 640px) {
  .sir-gallery-118 {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .sir-item-118 {
    height: 300px;
  
  opacity: 1 !important;}

  .sir-section-title-118 {
    margin-bottom: 50px;
  }

  .sir-section-subtitle-118 {
    margin-bottom: 50px;
    font-size: 0.875rem;
  
  opacity: 1 !important;}

  .sir-container-118 {
    padding: 0 20px;
  
  opacity: 1 !important;}
}
</style>
