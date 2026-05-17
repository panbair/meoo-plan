<template>
  <div class="cp-cascade-parallax-40">
    <div class="cp-container-40">
      <h2 class="cp-section-title-40" ref="sectionTitle">级联视差</h2>

      <div class="cp-cascade-container-40" ref="cascadeContainer">
        <div
          v-for="(img, index) in images"
          :key="index"
          ref="items"
          class="cp-cascade-item-40"
          :style="{
            transform: `translateX(${index * 30}px) translateY(${index * 40}px)`,
            zIndex: images.length - index
          }"
        >
          <div class="cp-item-wrapper-40">
            <img :src="img" :alt="`Image ${index + 1}`" />
            <div class="cp-item-overlay-40">
              <span class="cp-item-layer-40">Layer {{ images.length - index }}</span>
              <h3 class="cp-item-title-40">{{ titles[index] }}</h3>
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
const sectionTitle = ref<HTMLElement | null>(null)
const cascadeContainer = ref<HTMLElement | null>(null)
const images = [
  new URL('@/assets/image/1.png', import.meta.url).href,
  new URL('@/assets/image/2.png', import.meta.url).href,
  new URL('@/assets/image/3.png', import.meta.url).href,
  new URL('@/assets/image/4.png', import.meta.url).href,
  new URL('@/assets/image/5.png', import.meta.url).href,
  new URL('@/assets/image/6.png', import.meta.url).href
]

const titles = ['深度一', '深度二', '深度三', '深度四', '深度五', '深度六']

let ctx: gsap.Context

onMounted(() => {
  if (!sectionTitle.value || !cascadeContainer.value) return

  ctx = gsap.context(() => {
    // 标题动画
    gsap.from(sectionTitle.value, {
      scrollTrigger: {
        trigger: sectionTitle.value,
        start: 'top 90%'
      },
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    })

    items.value.forEach((item, index) => {
      const img = item.querySelector('img') as HTMLElement
      const overlay = item.querySelector('.cp-item-overlay-40') as HTMLElement
      const layer = item.querySelector('.cp-item-layer-40') as HTMLElement
      const title = item.querySelector('.cp-item-title-40') as HTMLElement

      // 从右下滑入
      gsap.fromTo(
        item,
        {
          x: 200,
          y: 200,
          opacity: 0,
          rotate: 15,
          scale: 0.7
        },
        {
          x: index * 30,
          y: index * 40,
          opacity: 1,
          rotate: 0,
          scale: 1,
          scrollTrigger: {
            trigger: item,
            start: 'top 90%',
            end: 'top 40%',
            toggleActions: 'play none none reverse'
          },
          duration: 1.2,
          ease: 'power3.out',
          delay: index * 0.15
        }
      )

      // 滚动时级联视差
      gsap.to(item, {
        x: index * 30 + 50,
        y: index * 40 + 80,
        scrollTrigger: {
          trigger: cascadeContainer.value,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 1
        },
        ease: 'power1.inOut'
      })

      // 图片缩放
      gsap.fromTo(
        img,
        { scale: 1.4 },
        {
          scale: 1,
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            end: 'top 30%',
            scrub: true
          },
          ease: 'power2.out'
        }
      )

      // 覆盖层渐入
      gsap.fromTo(
        overlay,
        { opacity: 0 },
        {
          opacity: 1,
          scrollTrigger: {
            trigger: item,
            start: 'top 70%',
            end: 'top 30%',
            scrub: true
          }
        }
      )

      // 层级文字旋转
      gsap.fromTo(
        layer,
        { rotate: -180, scale: 0, opacity: 0 },
        {
          rotate: 0,
          scale: 1,
          opacity: 1,
          scrollTrigger: {
            trigger: item,
            start: 'top 65%',
            end: 'top 25%',
            scrub: true
          }
        }
      )

      // 标题滑入
      gsap.fromTo(
        title,
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: item,
            start: 'top 60%',
            end: 'top 20%',
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
.cp-cascade-parallax-40 {
  min-height: 100vh;
  padding: 100px 0;
  background: linear-gradient(180deg, #1a1a2e 0%, #4a1942 50%, #1a1a2e 100%);
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
      radial-gradient(circle at 30% 40%, rgba(237, 100, 166, 0.1) 0%, transparent 40%),
      radial-gradient(circle at 70% 60%, rgba(102, 126, 234, 0.1) 0%, transparent 40%);
    pointer-events: none;
  
  opacity: 1 !important;}
}

.cp-container-40 {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.cp-section-title-40 {
  text-align: center;
  font-size: 3.5rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 100px;
  background: linear-gradient(135deg, #ed64a6 0%, #667eea 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 40px rgba(237, 100, 166, 0.5);

  &::after {
    content: '';
    display: block;
    width: 100px;
    height: 4px;
    background: linear-gradient(90deg, #ed64a6, #667eea);
    margin: 20px auto 0;
    border-radius: 2px;
  
  opacity: 1 !important;}
}

.cp-cascade-container-40 {
  position: relative;
  padding: 80px 0;
  height: 800px;

  opacity: 1 !important;}

.cp-cascade-item-40 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 380px;
  height: 480px;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4);
  background: #fff;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  cursor: pointer;

  &:hover {
    z-index: 100 !important;
    transform: translate(-50%, -50%) scale(1.05);
    box-shadow: 0 35px 80px rgba(0, 0, 0, 0.5);
  
  opacity: 1 !important;}
}

.cp-item-wrapper-40 {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.cp-cascade-item-40 img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: filter 0.3s ease;
}

.cp-cascade-item-40:hover img {
  filter: brightness(1.1) saturate(1.1);
}

.cp-item-overlay-40 {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.9) 0%,
    rgba(0, 0, 0, 0.4) 60%,
    transparent 100%
  );
  padding: 40px 30px 30px;
  pointer-events: none;

  opacity: 1 !important;}

.cp-item-layer-40 {
  display: block;
  font-size: 3.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #ed64a6 0%, #667eea 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: -15px;
  font-family: 'Arial', sans-serif;
  opacity: 0.9;
}

.cp-item-title-40 {
  font-size: 1.6rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);

  opacity: 1 !important;}

@media (max-width: 768px) {
  .cp-cascade-item-40 {
    width: 280px;
    height: 360px;
  
  opacity: 1 !important;}

  .cp-item-layer-40 {
    font-size: 2.5rem;
  
  opacity: 1 !important;}

  .cp-section-title-40 {
    font-size: 2rem;
  
  opacity: 1 !important;}
}
</style>
