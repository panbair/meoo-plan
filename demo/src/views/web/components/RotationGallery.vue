<template>
  <div class="rg-rotation-gallery-36">
    <div class="rg-container-36">
      <h2 class="rg-section-title-36" ref="sectionTitle">旋转画廊</h2>

      <div class="rg-gallery-container-36" ref="galleryContainer">
        <div
          class="rg-gallery-item-36"
          v-for="(img, index) in images"
          :key="index"
          :style="{ transform: `rotateY(${index * 45}deg) translateZ(350px)` }"
          :data-index="index"
          ref="items"
        >
          <div class="rg-item-inner-36">
            <img :src="img" :alt="`Image ${index + 1}`" />
            <div class="rg-item-content-36">
              <span class="rg-item-number-36">{{ index + 1 }}</span>
              <h3 class="rg-item-title-36">Rotate {{ index + 1 }}</h3>
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
const galleryContainer = ref<HTMLElement | null>(null)
const sectionTitle = ref<HTMLElement | null>(null)
const images = [
  new URL('@/assets/image/1.png', import.meta.url).href,
  new URL('@/assets/image/2.png', import.meta.url).href,
  new URL('@/assets/image/3.png', import.meta.url).href,
  new URL('@/assets/image/4.png', import.meta.url).href,
  new URL('@/assets/image/5.png', import.meta.url).href,
  new URL('@/assets/image/6.png', import.meta.url).href,
  new URL('@/assets/image/1.png', import.meta.url).href,
  new URL('@/assets/image/2.png', import.meta.url).href
]

let ctx: gsap.Context

onMounted(() => {
  if (!galleryContainer.value || !sectionTitle.value) return

  ctx = gsap.context(() => {
    // 标题动画
    gsap.from(sectionTitle.value, {
      scrollTrigger: {
        trigger: sectionTitle.value,
        start: 'top 90%'
      },
      y: 50,
      opacity: 0,
      rotateX: 15,
      duration: 1,
      ease: 'power3.out'
    })

    // 容器3D旋转
    gsap.set(galleryContainer.value, {
      transformStyle: 'preserve-3d'
    })

    // 滚动时旋转整个3D圆柱体
    gsap.to(galleryContainer.value, {
      rotateY: 360,
      scrollTrigger: {
        trigger: galleryContainer.value,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      },
      ease: 'none'
    })

    items.value.forEach((item, index) => {
      const img = item.querySelector('img') as HTMLElement
      const content = item.querySelector('.rg-item-content-36') as HTMLElement
      const number = item.querySelector('.rg-item-number-36') as HTMLElement

      // 3D入场动画
      gsap.fromTo(item,
        {
          rotateY: index * 45,
          translateZ: -200,
          opacity: 0,
          scale: 0.5
        },
        {
          rotateY: index * 45,
          translateZ: 350,
          opacity: 1,
          scale: 1,
          scrollTrigger: {
            trigger: galleryContainer.value,
            start: 'top 80%',
            end: 'top 40%',
            toggleActions: 'play none none reverse'
          },
          duration: 1.2,
          ease: 'back.out(1.7)',
          delay: index * 0.08
        }
      )

      // 滚动时卡片独立旋转效果
      gsap.to(item, {
        rotateY: index * 45 + 20,
        scrollTrigger: {
          trigger: galleryContainer.value,
          start: 'top 50%',
          end: 'bottom 20%',
          scrub: 0.8
        },
        ease: 'power1.inOut'
      })

      // 图片视差效果
      gsap.to(img, {
        scale: 1.1,
        scrollTrigger: {
          trigger: galleryContainer.value,
          start: 'top 60%',
          end: 'bottom 30%',
          scrub: 0.5
        },
        ease: 'none'
      })

      // 内容淡入
      gsap.fromTo(content,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: galleryContainer.value,
            start: 'top 70%',
            end: 'top 50%',
            scrub: true
          }
        }
      )

      // 数字3D旋转
      gsap.fromTo(number,
        {
          rotateX: -90,
          scale: 0
        },
        {
          rotateX: 0,
          scale: 1,
          scrollTrigger: {
            trigger: galleryContainer.value,
            start: 'top 65%',
            end: 'top 45%',
            scrub: true
          },
          ease: 'power2.out'
        }
      )
    })
  }, galleryContainer.value)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.rg-rotation-gallery-36 {
  min-height: 100vh;
  padding: 100px 0;
  background: linear-gradient(180deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 800px;
    height: 800px;
    background: radial-gradient(circle, rgba(48, 43, 99, 0.3) 0%, transparent 70%);
    pointer-events: none;
  
  opacity: 1 !important;}

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    pointer-events: none;
  }
}

.rg-container-36 {
  width: 100%;
  max-width: 1000px;
  padding: 0 40px;
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.rg-section-title-36 {
  text-align: center;
  font-size: 3.5rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 100px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 30px rgba(102, 126, 234, 0.5));

  &::after {
    content: '';
    display: block;
    width: 120px;
    height: 4px;
    background: linear-gradient(90deg, transparent, #667eea, #764ba2, transparent);
    margin: 25px auto 0;
    border-radius: 2px;
  
  opacity: 1 !important;}
}

.rg-gallery-container-36 {
  position: relative;
  width: 100%;
  height: 600px;
  perspective: 2000px;
  display: flex;
  justify-content: center;
  align-items: center;
  transform-style: preserve-3d;

  opacity: 1 !important;}

.rg-gallery-item-36 {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 280px;
  height: 380px;
  margin-left: -140px;
  margin-top: -190px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow:
    0 25px 60px rgba(0, 0, 0, 0.6),
    0 0 40px rgba(102, 126, 234, 0.2),
    inset 0 0 40px rgba(255, 255, 255, 0.05);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  backface-visibility: hidden;

  &:hover {
    z-index: 100;
    box-shadow:
      0 40px 80px rgba(0, 0, 0, 0.7),
      0 0 60px rgba(102, 126, 234, 0.4),
      inset 0 0 60px rgba(255, 255, 255, 0.1);
  
  opacity: 1 !important;}
}

.rg-item-inner-36 {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);

  opacity: 1 !important;}

.rg-gallery-item-36:hover img {
  filter: brightness(1.15) saturate(1.1);
  transform: scale(1.05);
}

.rg-item-content-36 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.9) 0%,
    rgba(0, 0, 0, 0.5) 40%,
    transparent 70%
  );
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 25px;
  pointer-events: none;
  backdrop-filter: blur(2px);

  opacity: 1 !important;}

.rg-item-number-36 {
  font-size: 4.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: -15px;
  font-family: 'Arial', sans-serif;
  opacity: 0.95;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5));
}

.rg-item-title-36 {
  font-size: 1.4rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
  text-shadow: 0 2px 15px rgba(0, 0, 0, 0.7);
  letter-spacing: 1px;

  opacity: 1 !important;}

@media (max-width: 768px) {
  .rg-gallery-container-36 {
    height: 500px;
    perspective: 1500px;
  
  opacity: 1 !important;}

  .rg-gallery-item-36 {
    width: 220px;
    height: 300px;
    margin-left: -110px;
    margin-top: -150px;
  
  opacity: 1 !important;}

  .rg-section-title-36 {
    font-size: 2.2rem;
    margin-bottom: 60px;
  
  opacity: 1 !important;}

  .rg-item-number-36 {
    font-size: 3.5rem;
  
  opacity: 1 !important;}

  .rg-item-title-36 {
    font-size: 1.1rem;
  
  opacity: 1 !important;}
}
</style>
