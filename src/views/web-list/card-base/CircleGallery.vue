<template>
  <div class="cg-circle-gallery-46">
    <div class="cg-container-46">
      <h2 class="cg-section-title-46">圆形画廊</h2>

      <div class="cg-circle-container-46" ref="circleContainer">
        <div
          class="cg-circle-item-46"
          v-for="(img, index) in images"
          :key="index"
          :style="getItemStyle(index)"
          ref="items"
        >
          <div class="cg-item-inner-46">
            <img :src="img" :alt="`Image ${index + 1}`" />
            <div class="cg-item-overlay-46">
              <span class="cg-item-number-46">{{ index + 1 }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="cg-center-circle-46">
        <span class="cg-center-text-46">ROTATE</span>
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
const circleContainer = ref<HTMLElement | null>(null)
const images = [
  new URL('@/assets/image/1.png', import.meta.url).href,
  new URL('@/assets/image/2.png', import.meta.url).href,
  new URL('@/assets/image/3.png', import.meta.url).href,
  new URL('@/assets/image/4.png', import.meta.url).href,
  new URL('@/assets/image/5.png', import.meta.url).href,
  new URL('@/assets/image/6.png', import.meta.url).href
]

const radius = 280

const getItemStyle = (index: number) => {
  const angle = (index / images.length) * 360 * (Math.PI / 180)
  const x = Math.cos(angle) * radius
  const y = Math.sin(angle) * radius
  return {
    transform: `translate(${x}px, ${y}px)`
  }
}

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 标题动画
    gsap.from('.cg-section-title-46', {
      scrollTrigger: {
        trigger: '.cg-section-title-46',
        start: 'top 90%'
      },
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    })

    // 圆形容器入场
    gsap.from('.cg-circle-container-46', {
      scrollTrigger: {
        trigger: '.cg-circle-container-46',
        start: 'top 85%'
      },
      scale: 0,
      opacity: 0,
      duration: 1,
      ease: 'back.out(1.5)'
    })

    // 中心圆动画
    gsap.from('.cg-center-circle-46', {
      scrollTrigger: {
        trigger: '.cg-center-circle-46',
        start: 'top 85%'
      },
      scale: 0,
      rotate: 180,
      duration: 0.8,
      ease: 'back.out(2)'
    })

    items.value.forEach((item, index) => {
      const inner = item.querySelector('.cg-item-inner-46') as HTMLElement
      const img = item.querySelector('img') as HTMLElement
      const overlay = item.querySelector('.cg-item-overlay-46') as HTMLElement
      const number = item.querySelector('.cg-item-number-46') as HTMLElement

      const angle = (index / images.length) * 360

      // 从中心爆发
      gsap.fromTo(item,
        {
          x: 0,
          y: 0,
          scale: 0,
          opacity: 0,
          rotate: angle - 180
        },
        {
          scrollTrigger: {
            trigger: '.cg-circle-container-46',
            start: 'top 80%'
          },
          x: Math.cos(angle * Math.PI / 180) * radius,
          y: Math.sin(angle * Math.PI / 180) * radius,
          scale: 1,
          opacity: 1,
          rotate: 0,
          duration: 1.2,
          ease: 'back.out(1.7)',
          delay: index * 0.1
        }
      )

      // 滚动时旋转整个圆
      gsap.to('.cg-circle-container-46', {
        rotate: 360,
        scrollTrigger: {
          trigger: '.cg-circle-container-46',
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 1
        },
        ease: 'none'
      })

      // 图片缩放
      gsap.fromTo(img,
        { scale: 1.4 },
        {
          scale: 1,
          scrollTrigger: {
            trigger: item,
            start: 'top 90%',
            end: 'top 30%',
            scrub: true
          },
          ease: 'power2.out'
        }
      )

      // 覆盖层淡入
      gsap.fromTo(overlay,
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

      // 数字旋转
      gsap.fromTo(number,
        { rotate: -360, scale: 0 },
        {
          rotate: -angle,
          scale: 1,
          scrollTrigger: {
            trigger: item,
            start: 'top 65%',
            end: 'top 25%',
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
.cg-circle-gallery-46 {
  min-height: 100vh;
  padding: 100px 0;
  background: linear-gradient(180deg, #0f0f23 0%, #1a1a3e 50%, #0f0f23 100%);
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
    width: 700px;
    height: 700px;
    background: radial-gradient(circle, rgba(102, 126, 234, 0.15) 0%, transparent 70%);
    pointer-events: none;
  
  opacity: 1 !important;}
}

.cg-container-46 {
  width: 100%;
  max-width: 1000px;
  padding: 0 40px;
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.cg-section-title-46 {
  text-align: center;
  font-size: 3.5rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 100px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 40px rgba(102, 126, 234, 0.5);

  &::after {
    content: '';
    display: block;
    width: 100px;
    height: 4px;
    background: linear-gradient(90deg, #667eea, #764ba2);
    margin: 20px auto 0;
    border-radius: 2px;
  
  opacity: 1 !important;}
}

.cg-circle-container-46 {
  position: relative;
  width: 100%;
  height: 700px;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1000px;

  opacity: 1 !important;}

.cg-circle-item-46 {
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
  background: #fff;
  transition: all 0.4s ease;
  cursor: pointer;

  &:hover {
    z-index: 10;
    transform: translate(var(--x), var(--y)) scale(1.2);
    box-shadow: 0 30px 70px rgba(0, 0, 0, 0.5);
  
  opacity: 1 !important;}
}

.cg-item-inner-46 {
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

.cg-circle-item-46:hover img {
  filter: brightness(1.1) saturate(1.1);
}

.cg-item-overlay-46 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle, transparent 0%, rgba(0, 0, 0, 0.7) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;

  opacity: 1 !important;}

.cg-item-number-46 {
  font-size: 3rem;
  font-weight: 900;
  color: #fff;
  text-shadow: 0 0 20px rgba(102, 126, 234, 0.8);
  font-family: 'Arial', sans-serif;

  opacity: 1 !important;}

.cg-center-circle-46 {
  position: absolute;
  top: 220px;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 150px;
  height: 150px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 20px 50px rgba(102, 126, 234, 0.5);
  z-index: 5;

  opacity: 1 !important;}

.cg-center-text-46 {
  font-size: 1.5rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: 3px;

  opacity: 1 !important;}

@media (max-width: 768px) {
  .cg-circle-item-46 {
    width: 120px;
    height: 120px;
  
  opacity: 1 !important;}

  .cg-center-circle-46 {
    width: 100px;
    height: 100px;
  
  opacity: 1 !important;}

  .cg-item-number-46 {
    font-size: 2rem;
  
  opacity: 1 !important;}

  .cg-section-title-46 {
    font-size: 2rem;
  
  opacity: 1 !important;}
}
</style>
