<template>
  <div class="fade-in-stack-32">
    <div class="container-32">
      <h2 class="section-title-32">淡入层叠</h2>
      
      <div class="stack-wrapper-32">
        <div 
          class="stack-item-32" 
          v-for="(img, index) in images" 
          :key="index"
          :style="{ zIndex: images.length - index }"
          ref="items"
        >
          <div class="item-inner-32">
            <img :src="img" :alt="`Image ${index + 1}`" />
            <div class="item-content-32">
              <span class="item-number-32">{{ String(index + 1).padStart(2, '0') }}</span>
              <h3 class="item-title-32">Layer {{ index + 1 }}</h3>
              <p class="item-desc-32">Scroll to reveal</p>
            </div>
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

const items = ref<HTMLElement[]>([])
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
    gsap.from('.section-title-32', {
      scrollTrigger: {
        trigger: '.section-title-32',
        start: 'top 90%'
      },
      y: 50,
      opacity: 0,
      scale: 0.8,
      duration: 1,
      ease: 'power3.out'
    })

    items.value.forEach((item, index) => {
      const img = item.querySelector('img') as HTMLElement
      const content = item.querySelector('.item-content-32') as HTMLElement
      const number = item.querySelector('.item-number-32') as HTMLElement

      // 从底部淡入
      gsap.fromTo(item,
        {
          y: 150,
          opacity: 0,
          scale: 0.9,
          rotation: -5
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotation: 0,
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            end: 'top 40%',
            toggleActions: 'play none none reverse'
          },
          duration: 1.2,
          ease: 'power3.out',
          delay: index * 0.15
        }
      )

      // 图片缩放淡入
      gsap.fromTo(img,
        { scale: 1.3, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            end: 'top 30%',
            scrub: true
          },
          ease: 'power2.out'
        }
      )

      // 滚动时图片视差移动
      gsap.fromTo(img,
        { y: -30 },
        {
          y: 30,
          scrollTrigger: {
            trigger: item,
            start: 'top 100%',
            end: 'bottom 0%',
            scrub: 1
          },
          ease: 'none'
        }
      )

      // 内容从左滑入
      gsap.fromTo(content,
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: item,
            start: 'top 70%',
            end: 'top 30%',
            scrub: true
          }
        }
      )

      // 数字旋转缩放
      gsap.fromTo(number,
        { rotation: -180, scale: 0, opacity: 0 },
        {
          rotation: 0,
          scale: 1,
          opacity: 1,
          scrollTrigger: {
            trigger: item,
            start: 'top 75%',
            end: 'top 35%',
            scrub: true
          }
        }
      )
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.fade-in-stack-32 {
  min-height: 100vh;
  padding: 100px 0;
  background: linear-gradient(180deg, #1a1a2e 0%, #2d1b69 50%, #1a1a2e 100%);
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
      radial-gradient(circle at 10% 20%, rgba(237, 100, 166, 0.1) 0%, transparent 40%),
      radial-gradient(circle at 90% 80%, rgba(66, 220, 219, 0.1) 0%, transparent 40%);
    pointer-events: none;
  
  opacity: 1 !important;}
}

.container-32 {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 40px;
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.section-title-32 {
  text-align: center;
  font-size: 3.5rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 100px;
  background: linear-gradient(135deg, #ed64a6 0%, #8b5cf6 50%, #42dcce 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 40px rgba(237, 100, 166, 0.5);
  
  &::after {
    content: '';
    display: block;
    width: 100px;
    height: 4px;
    background: linear-gradient(90deg, #ed64a6, #8b5cf6, #42dcce);
    margin: 20px auto 0;
    border-radius: 2px;
  
  opacity: 1 !important;}
}

.stack-wrapper-32 {
  position: relative;
  padding: 20px 0;

  opacity: 1 !important;}

.stack-item-32 {
  position: relative;
  margin-bottom: -80px;
  height: 350px;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
  background: #fff;
  transform-style: preserve-3d;
  
  &:last-child {
    margin-bottom: 0;
  
  opacity: 1 !important;}
  
  &:hover {
    transform: translateY(-10px) rotateX(2deg);
    box-shadow: 0 35px 70px rgba(0, 0, 0, 0.5);
  }
}

.item-inner-32 {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: filter 0.3s ease;
}

.stack-item-32:hover img {
  filter: brightness(1.05) saturate(1.1);
}

.item-content-32 {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.4) 50%, transparent 100%);
  padding: 40px 30px 30px;
  color: #fff;

  opacity: 1 !important;}

.item-number-32 {
  display: block;
  font-size: 4rem;
  font-weight: 900;
  background: linear-gradient(135deg, #ed64a6 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: -20px;
  font-family: 'Arial', sans-serif;
  opacity: 0.9;
}

.item-title-32 {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0 0 8px;
  color: #fff;

  opacity: 1 !important;}

.item-desc-32 {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  letter-spacing: 2px;
  text-transform: uppercase;

  opacity: 1 !important;}

@media (max-width: 768px) {
  .stack-item-32 {
    height: 280px;
    margin-bottom: -60px;
  
  opacity: 1 !important;}
  
  .section-title-32 {
    font-size: 2rem;
  
  opacity: 1 !important;}
  
  .item-number-32 {
    font-size: 3rem;
  
  opacity: 1 !important;}
  
  .item-title-32 {
    font-size: 1.4rem;
  
  opacity: 1 !important;}
}
</style>
