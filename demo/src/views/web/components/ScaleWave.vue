<template>
  <div class="sw-scale-wave-33">
    <div class="sw-container-33">
      <h2 class="sw-section-title-33">缩放波浪</h2>

      <div class="sw-wave-container-33">
        <div
          class="sw-wave-item-33"
          v-for="(img, index) in images"
          :key="index"
          ref="items"
          :style="{ transform: getItemStyle(index) }"
        >
          <div class="sw-item-wrapper-33">
            <img :src="img" :alt="`Image ${index + 1}`" />
            <div class="sw-item-overlay-33">
              <span class="sw-item-index-33">{{ index + 1 }}</span>
              <h3 class="sw-item-name-33">{{ ['探索', '创造', '设计', '灵感', '艺术', '未来'][index] }}</h3>
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

const getItemStyle = (index: number) => {
  const scale = 1 - Math.abs(index - 2) * 0.15
  const opacity = 1 - Math.abs(index - 2) * 0.25
  const translateY = (index - 2) * 20
  return {
    transform: `translateY(${translateY}px) scale(${scale})`,
    opacity
  }
}

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 标题动画
    gsap.from('.sw-section-title-33', {
      scrollTrigger: {
        trigger: '.sw-section-title-33',
        start: 'top 90%'
      },
      y: 60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    })

    // 容器入场
    gsap.from('.sw-wave-container-33', {
      scrollTrigger: {
        trigger: '.sw-wave-container-33',
        start: 'top 85%'
      },
      opacity: 0,
      scale: 0.8,
      duration: 1,
      ease: 'power2.out'
    })

    items.value.forEach((item, index) => {
      const img = item.querySelector('img') as HTMLElement
      const overlay = item.querySelector('.sw-item-overlay-33') as HTMLElement
      const itemIndex = item.querySelector('.sw-item-index-33') as HTMLElement
      const itemName = item.querySelector('.sw-item-name-33') as HTMLElement

      // 卡片依次入场
      gsap.fromTo(item,
        {
          y: 100,
          opacity: 0,
          scale: 0.5,
          rotation: (index - 2) * 10
        },
        {
          y: (index - 2) * 20,
          opacity: 1 - Math.abs(index - 2) * 0.25,
          scale: 1 - Math.abs(index - 2) * 0.15,
          rotation: 0,
          scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            end: 'top 40%',
            toggleActions: 'play none none reverse'
          },
          duration: 1,
          ease: 'back.out(1.2)',
          delay: index * 0.1
        }
      )

      // 图片缩放动画
      gsap.fromTo(img,
        { scale: 1.4 },
        {
          scale: 1,
          scrollTrigger: {
            trigger: item,
            start: 'top 90%',
            end: 'top 20%',
            scrub: true
          },
          ease: 'power2.out'
        }
      )

      // 滚动时图片轻微旋转
      gsap.fromTo(img,
        { rotate: -5 },
        {
          rotate: 5,
          scrollTrigger: {
            trigger: item,
            start: 'top 100%',
            end: 'bottom 0%',
            scrub: 1
          },
          ease: 'none'
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

      // 数字缩放旋转
      gsap.fromTo(itemIndex,
        { scale: 0, rotate: -180, opacity: 0 },
        {
          scale: 1,
          rotate: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: item,
            start: 'top 65%',
            end: 'top 25%',
            scrub: true
          }
        }
      )

      // 标题从下升起
      gsap.fromTo(itemName,
        { y: 30, opacity: 0 },
        {
          y: 0,
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

    // 滚动时整体波浪效果
    gsap.to('.sw-wave-container-33', {
      scrollTrigger: {
        trigger: '.sw-wave-container-33',
        start: 'top 100%',
        end: 'bottom 0%',
        scrub: 0.5
      },
      rotateX: 5
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.sw-scale-wave-33 {
  min-height: 100vh;
  padding: 100px 0;
  background: linear-gradient(180deg, #1e3c72 0%, #2a5298 50%, #1e3c72 100%);
  display: flex;
  align-items: center;
  justify-content: center;
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
      radial-gradient(circle at 30% 40%, rgba(102, 126, 234, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 70% 60%, rgba(240, 147, 251, 0.1) 0%, transparent 50%);
    pointer-events: none;
  
  opacity: 1 !important;}
}

.sw-container-33 {
  width: 100%;
  max-width: 1400px;
  padding: 0 40px;
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.sw-section-title-33 {
  text-align: center;
  font-size: 3.5rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 20px rgba(102, 126, 234, 0.8));

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

.sw-wave-container-33 {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
  padding: 60px 0;
  perspective: 1000px;

  opacity: 1 !important;}

.sw-wave-item-33 {
  width: 220px;
  height: 300px;
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  cursor: pointer;

  &:hover {
    transform: translateY(-15px) scale(1.05);
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.4);
  
  opacity: 1 !important;}
}

.sw-item-wrapper-33 {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.sw-wave-item-33:hover img {
  transform: scale(1.1);
}

.sw-item-overlay-33 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.7) 100%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  padding: 30px 20px;
  pointer-events: none;

  opacity: 1 !important;}

.sw-item-index-33 {
  font-size: 3.5rem;
  font-weight: 900;
  color: #fff;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 10px;
  font-family: 'Arial', sans-serif;
  opacity: 0.9;
}

.sw-item-name-33 {
  font-size: 1.4rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
  text-align: center;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);

  opacity: 1 !important;}

@media (max-width: 1024px) {
  .sw-wave-container-33 {
    gap: 15px;
  }

  .sw-wave-item-33 {
    width: 160px;
    height: 220px;
  
  opacity: 1 !important;}

  .sw-item-index-33 {
    font-size: 2.5rem;
  
  opacity: 1 !important;}

  .sw-item-name-33 {
    font-size: 1rem;
  
  opacity: 1 !important;}
}

@media (max-width: 768px) {
  .sw-wave-container-33 {
    flex-wrap: wrap;
    gap: 20px;
  }

  .sw-wave-item-33 {
    width: calc(50% - 10px);
    height: 200px;
  
  opacity: 1 !important;}

  .sw-section-title-33 {
    font-size: 2rem;
  
  opacity: 1 !important;}
}
</style>
