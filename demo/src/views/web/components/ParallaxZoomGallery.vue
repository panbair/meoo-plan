<template>
  <div class="parallax-zoom-gallery-30">
    <div class="pzg-container-30">
      <h2 class="pzg-section-title-30">视差缩放画廊</h2>

      <div class="pzg-gallery-wrapper-30">
        <div class="pzg-gallery-item-30" v-for="(img, index) in images" :key="index" ref="items">
          <div class="pzg-image-container-30">
            <img :src="img" :alt="`Image ${index + 1}`" />
            <div class="pzg-overlay-30">
              <span class="pzg-number-30">{{ String(index + 1).padStart(2, '0') }}</span>
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
    items.value.forEach((item, index) => {
      const img = item.querySelector('img') as HTMLElement
      const overlay = item.querySelector('.pzg-overlay-30') as HTMLElement
      const number = item.querySelector('.pzg-number-30') as HTMLElement

      // 入场动画
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          end: 'bottom 15%',
          toggleActions: 'play none none reverse'
        },
        y: 100,
        opacity: 0,
        rotationX: 15,
        duration: 1,
        ease: 'power3.out',
        delay: index * 0.1
      })

      // 图片滚动缩放
      gsap.fromTo(img,
        { scale: 1.2 },
        {
          scale: 1,
          scrollTrigger: {
            trigger: item,
            start: 'top 90%',
            end: 'bottom 10%',
            scrub: 1
          },
          ease: 'none'
        }
      )

      // 图片Y轴视差
      gsap.fromTo(img,
        { y: -50 },
        {
          y: 50,
          scrollTrigger: {
            trigger: item,
            start: 'top 100%',
            end: 'bottom 0%',
            scrub: 1.5
          },
          ease: 'none'
        }
      )

      // 覆盖层渐入
      gsap.fromTo(overlay,
        { opacity: 0 },
        {
          opacity: 1,
          scrollTrigger: {
            trigger: item,
            start: 'top 60%',
            end: 'top 30%',
            scrub: true
          }
        }
      )

      // 数字旋转入场
      gsap.fromTo(number,
        { rotation: -180, scale: 0 },
        {
          rotation: 0,
          scale: 1,
          scrollTrigger: {
            trigger: item,
            start: 'top 70%',
            end: 'top 40%',
            scrub: true
          }
        }
      )
    })

    // 标题动画
    gsap.from('.pzg-section-title-30', {
      scrollTrigger: {
        trigger: '.pzg-section-title-30',
        start: 'top 90%'
      },
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.parallax-zoom-gallery-30 {
  min-height: 100vh;
  padding: 100px 0;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
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
      radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%);
    pointer-events: none;
  
  opacity: 1 !important;}
}

.pzg-container-30 {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.pzg-section-title-30 {
  text-align: center;
  font-size: 3.5rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 40px rgba(102, 126, 234, 0.5);
  position: relative;

  &::after {
    content: '';
    display: block;
    width: 100px;
    height: 4px;
    background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
    margin: 20px auto 0;
    border-radius: 2px;
  
  opacity: 1 !important;}
}

.pzg-gallery-wrapper-30 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  padding: 20px 0;

  opacity: 1 !important;}

.pzg-gallery-item-30 {
  position: relative;
  height: 350px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  transform-style: preserve-3d;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    z-index: 2;
  
  opacity: 1 !important;}
}

.pzg-image-container-30 {
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

.pzg-gallery-item-30:hover img {
  filter: brightness(1.1);
}

.pzg-overlay-30 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 60%);
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 20px;
  pointer-events: none;

  opacity: 1 !important;}

.pzg-number-30 {
  font-size: 3rem;
  font-weight: 900;
  color: #fff;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 30px rgba(102, 126, 234, 0.8);
  font-family: 'Arial', sans-serif;

  opacity: 1 !important;}

@media (max-width: 1024px) {
  .pzg-gallery-wrapper-30 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .pzg-gallery-wrapper-30 {
    grid-template-columns: 1fr;
  }

  .pzg-section-title-30 {
    font-size: 2rem;
  
  opacity: 1 !important;}
}
</style>
