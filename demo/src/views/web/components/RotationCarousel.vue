<template>
  <div class="rc-rotation-carousel-31">
    <div class="rc-container-31">
      <h2 class="rc-section-title-31">旋转轮播</h2>

      <div ref="carouselWrapper" class="rc-carousel-wrapper-31">
        <div ref="carouselTrack" class="rc-carousel-track-31">
          <div
            v-for="(img, index) in images"
            :key="index"
            class="rc-carousel-item-31"
            :class="{ 'rc-active-31': activeIndex === index }"
            :style="getItemStyle(index)"
          >
            <div class="rc-card-content-31">
              <img :src="img" :alt="`Image ${index + 1}`" />
              <div class="rc-card-info-31">
                <span class="rc-card-title-31">Image {{ index + 1 }}</span>
                <span class="rc-card-desc-31">滑动查看更多</span>
              </div>
            </div>
          </div>
        </div>

        <div class="rc-carousel-nav-31">
          <button class="rc-nav-btn-31 rc-prev-31" @click="prevSlide">←</button>
          <div class="rc-indicators-31">
            <span
              v-for="(img, index) in images"
              :key="index"
              class="rc-indicator-31"
              :class="{ 'rc-active-31': activeIndex === index }"
              @click="goToSlide(index)"
            ></span>
          </div>
          <button class="rc-nav-btn-31 rc-next-31" @click="nextSlide">→</button>
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

const images = [
  new URL('@/assets/image/1.png', import.meta.url).href,
  new URL('@/assets/image/2.png', import.meta.url).href,
  new URL('@/assets/image/3.png', import.meta.url).href,
  new URL('@/assets/image/4.png', import.meta.url).href,
  new URL('@/assets/image/5.png', import.meta.url).href,
  new URL('@/assets/image/6.png', import.meta.url).href
]

const activeIndex = ref(0)
const carouselWrapper = ref<HTMLElement | null>(null)
const carouselTrack = ref<HTMLElement | null>(null)

const radius = 350

const getItemStyle = (index: number) => {
  const offset = (index - activeIndex.value + images.length) % images.length
  const angle = offset * (360 / images.length) * (Math.PI / 180)
  const x = Math.sin(angle) * radius
  const z = Math.cos(angle) * radius - radius
  const scale = 1 + (offset === 0 ? 0.2 : 0)
  const opacity = offset === 0 ? 1 : 0.5
  const zIndex = offset === 0 ? 10 : 1

  return {
    transform: `translateX(${x}px) translateZ(${z}px) scale(${scale})`,
    opacity,
    zIndex
  }
}

const nextSlide = () => {
  gsap.to(
    {},
    {
      duration: 0.3,
      onComplete: () => {
        activeIndex.value = (activeIndex.value + 1) % images.length
      }
    }
  )
}

const prevSlide = () => {
  gsap.to(
    {},
    {
      duration: 0.3,
      onComplete: () => {
        activeIndex.value = (activeIndex.value - 1 + images.length) % images.length
      }
    }
  )
}

const goToSlide = (index: number) => {
  gsap.to(
    {},
    {
      duration: 0.3,
      onComplete: () => {
        activeIndex.value = index
      }
    }
  )
}

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 标题动画
    gsap.from('.rc-section-title-31', {
      scrollTrigger: {
        trigger: '.rc-section-title-31',
        start: 'top 90%'
      },
      y: 50,
      opacity: 0,
      rotationY: 30,
      duration: 1,
      ease: 'power3.out'
    })

    // 轮播入场动画
    gsap.from('.rc-carousel-item-31', {
      scrollTrigger: {
        trigger: '.rc-carousel-wrapper-31',
        start: 'top 80%'
      },
      opacity: 0,
      scale: 0.5,
      rotationY: 90,
      duration: 1.2,
      ease: 'back.out(1.7)',
      stagger: 0.1
    })

    // 导航按钮动画
    gsap.from('.rc-nav-btn-31', {
      scrollTrigger: {
        trigger: '.rc-carousel-nav-31',
        start: 'top 85%'
      },
      scale: 0,
      rotation: 180,
      duration: 0.6,
      ease: 'back.out(2)',
      stagger: 0.2
    })

    // 指示器动画
    gsap.from('.rc-indicator-31', {
      scrollTrigger: {
        trigger: '.rc-indicators-31',
        start: 'top 85%'
      },
      scale: 0,
      opacity: 0,
      duration: 0.5,
      ease: 'back.out(1.5)',
      stagger: 0.08
    })

    // 滚动时轮播旋转
    gsap.to(
      {},
      {
        scrollTrigger: {
          trigger: '.rc-carousel-wrapper-31',
          start: 'top 90%',
          end: 'bottom 10%',
          scrub: 0.5,
          onUpdate: self => {
            const totalRotation = self.progress * images.length * 2
            activeIndex.value = Math.floor(totalRotation) % images.length
          }
        }
      }
    )
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.rc-rotation-carousel-31 {
  min-height: 100vh;
  padding: 100px 0;
  background: linear-gradient(180deg, #0f0f23 0%, #1a1a3e 50%, #0f0f23 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1500px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(102, 126, 234, 0.15) 0%, transparent 70%);
    pointer-events: none;
  
  opacity: 1 !important;}
}

.rc-container-31 {
  width: 100%;
  max-width: 1400px;
  padding: 0 40px;
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.rc-section-title-31 {
  text-align: center;
  font-size: 3.5rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 100px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #4facfe 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 40px rgba(240, 147, 251, 0.5);

  &::after {
    content: '';
    display: block;
    width: 100px;
    height: 4px;
    background: linear-gradient(90deg, #f093fb, #f5576c, #4facfe);
    margin: 20px auto 0;
    border-radius: 2px;
  
  opacity: 1 !important;}
}

.rc-carousel-wrapper-31 {
  width: 100%;
  height: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;

  opacity: 1 !important;}

.rc-carousel-track-31 {
  width: 100%;
  height: 400px;
  position: relative;
  transform-style: preserve-3d;
  display: flex;
  justify-content: center;
  align-items: center;

  opacity: 1 !important;}

.rc-carousel-item-31 {
  position: absolute;
  width: 320px;
  height: 400px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  cursor: pointer;

  &.active-31 {
    box-shadow: 0 40px 80px rgba(102, 126, 234, 0.4);
  
  opacity: 1 !important;}

  &:hover {
    transform: translateY(-20px);
  }
}

.rc-card-content-31 {
  width: 100%;
  height: 100%;
  position: relative;
  background: #fff;
  overflow: hidden;

  opacity: 1 !important;}

.rc-carousel-item-31:hover img {
  transform: scale(1.1);
}

.rc-card-info-31 {
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  text-align: center;

  opacity: 1 !important;}

.rc-card-title-31 {
  display: block;
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 5px;

  opacity: 1 !important;}

.rc-card-desc-31 {
  display: block;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);

  opacity: 1 !important;}

.rc-carousel-nav-31 {
  margin-top: 60px;
  display: flex;
  align-items: center;
  gap: 40px;
}

.rc-nav-btn-31 {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(102, 126, 234, 0.8);
    border-color: #667eea;
    transform: scale(1.1);
  
  opacity: 1 !important;}
}

.rc-indicators-31 {
  display: flex;
  gap: 12px;
}

.rc-indicator-31 {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.4);
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;

  &.active-31 {
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-color: transparent;
    transform: scale(1.3);
  
  opacity: 1 !important;}

  &:hover {
    transform: scale(1.2);
    border-color: #667eea;
  }
}

@media (max-width: 768px) {
  .rc-section-title-31 {
    font-size: 2rem;
  
  opacity: 1 !important;}

  .rc-carousel-item-31 {
    width: 260px;
    height: 340px;
  
  opacity: 1 !important;}

  img {
    height: 260px;
  }
}
</style>
