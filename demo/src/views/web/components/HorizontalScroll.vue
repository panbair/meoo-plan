<template>
  <div class="hs-horizontal-scroll-34">
    <div class="hs-container-34">
      <h2 class="hs-section-title-34">横向滚动</h2>

      <div class="hs-scroll-track-34" ref="scrollTrack">
        <div
          class="hs-scroll-item-34"
          v-for="(img, index) in images"
          :key="index"
          ref="items"
        >
          <div class="hs-card-inner-34">
            <img :src="img" :alt="`Image ${index + 1}`" />
            <div class="hs-card-content-34">
              <span class="hs-card-number-34">0{{ index + 1 }}</span>
              <h3 class="hs-card-title-34">Slide {{ index + 1 }}</h3>
              <p class="hs-card-desc-34">水平滚动查看</p>
            </div>
          </div>
        </div>
      </div>

      <div class="hs-scroll-indicator-34">
        <span class="hs-indicator-text-34">← 向右滚动 →</span>
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
const scrollTrack = ref<HTMLElement | null>(null)
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
    gsap.from('.hs-section-title-34', {
      scrollTrigger: {
        trigger: '.hs-section-title-34',
        start: 'top 90%'
      },
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    })

    // 横向滚动
    const sections = gsap.utils.toArray('.hs-scroll-item-34')
    if (sections.length === 0) return
    gsap.to(sections, {
      xPercent: -100 * (sections.length - 1),
      ease: 'none',
      scrollTrigger: {
        trigger: '.hs-scroll-track-34',
        pin: true,
        scrub: 1,
        snap: 1 / (sections.length - 1),
        end: () => '+=' + scrollTrack.value?.offsetWidth
      }
    })

    // 卡片入场动画
    items.value.forEach((item, index) => {
      const img = item.querySelector('img') as HTMLElement
      const content = item.querySelector('.hs-card-content-34') as HTMLElement
      const number = item.querySelector('.hs-card-number-34') as HTMLElement

      // 从右侧滑入 - 确保初始可见
      gsap.fromTo(item,
        { x: 100, opacity: 1 },
        {
          x: 0,
          opacity: 1,
          rotateY: 0,
          scrollTrigger: {
            trigger: item,
            start: 'left 80%',
            end: 'left 20%',
            toggleActions: 'play none none reverse'
          },
          duration: 1,
          ease: 'power3.out'
        }
      )

      // 图片缩放 - 确保初始可见
      gsap.fromTo(img,
        { scale: 1 },
        {
          scale: 1,
          scrollTrigger: {
            trigger: item,
            start: 'left 70%',
            end: 'left 10%',
            scrub: true
          },
          ease: 'power2.out'
        }
      )

      // 内容从下升起 - 确保初始可见
      gsap.fromTo(content,
        { y: 0, opacity: 1 },
        {
          y: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: item,
            start: 'left 60%',
            end: 'left 0%',
            scrub: true
          }
        }
      )

      // 数字旋转缩放 - 确保初始可见
      gsap.fromTo(number,
        { rotate: 0, scale: 1 },
        {
          rotate: 0,
          scale: 1,
          scrollTrigger: {
            trigger: item,
            start: 'left 65%',
            end: 'left 5%',
            scrub: true
          }
        }
      )
    })

    // 指示器淡入淡出
    gsap.fromTo('.hs-scroll-indicator-34',
      { opacity: 0 },
      {
        opacity: 1,
        scrollTrigger: {
          trigger: '.hs-scroll-track-34',
          start: 'top 90%',
          end: 'top 70%',
          toggleActions: 'play none none reverse'
        },
        duration: 0.8
      }
    )

    gsap.to('.hs-scroll-indicator-34', {
      scrollTrigger: {
        trigger: '.hs-scroll-track-34',
        start: 'top 10%',
        end: 'top 0%',
        toggleActions: 'none reverse play none'
      },
      opacity: 0,
      duration: 0.8
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.hs-horizontal-scroll-34 {
  min-height: 100vh;
  background: linear-gradient(180deg, #1a1a2e 0%, #4a1942 50%, #1a1a2e 100%);
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
    background: radial-gradient(circle, rgba(233, 69, 96, 0.1) 0%, transparent 70%);
    pointer-events: none;
  
  opacity: 1 !important;}
}

.hs-container-34 {
  width: 100%;
  max-width: 1800px;
  margin: 0 auto;
  padding: 0 40px;
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.hs-section-title-34 {
  text-align: center;
  font-size: 3.5rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 60px;
  background: linear-gradient(135deg, #e94560 0%, #ff6b6b 50%, #feca57 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 20px rgba(233, 69, 96, 0.8));
  padding-top: 60px;

  &::after {
    content: '';
    display: block;
    width: 100px;
    height: 4px;
    background: linear-gradient(90deg, #e94560, #ff6b6b, #feca57);
    margin: 20px auto 0;
    border-radius: 2px;
  
  opacity: 1 !important;}
}

.hs-scroll-track-34 {
  display: flex;
  flex-wrap: nowrap;
  gap: 40px;
  padding: 60px 0;
  overflow: hidden;
  width: 100%;
  height: 500px;

  opacity: 1 !important;}

.hs-scroll-item-34 {
  flex: 0 0 auto;
  width: 400px;
  height: 500px;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  background: #fff;
  transition: transform 0.4s ease;

  &:hover {
    transform: translateY(-10px);
  
  opacity: 1 !important;}
}

.hs-card-inner-34 {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.hs-scroll-item-34 img {
  width: 100%;
  height: 350px;
  object-fit: cover;
  transition: filter 0.3s ease;
}

.hs-scroll-item-34:hover img {
  filter: brightness(1.1) saturate(1.1);
}

.hs-card-content-34 {
  padding: 30px;
  background: linear-gradient(135deg, #e94560 0%, #ff6b6b 100%);
  text-align: center;

  opacity: 1 !important;}

.hs-card-number-34 {
  display: block;
  font-size: 3rem;
  font-weight: 900;
  color: #fff;
  opacity: 0.9;
  margin-bottom: -15px;
  font-family: 'Arial', sans-serif;
}

.hs-card-title-34 {
  font-size: 1.4rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 8px;

  opacity: 1 !important;}

.hs-card-desc-34 {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;

  opacity: 1 !important;}

.hs-scroll-indicator-34 {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 15px 30px;
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 100;

  opacity: 1 !important;}

.hs-indicator-text-34 {
  font-size: 1.1rem;
  color: #fff;
  font-weight: 500;
  letter-spacing: 2px;
  animation: pulse 2s infinite;

  opacity: 1 !important;}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@media (max-width: 768px) {
  .hs-scroll-track-34 {
    gap: 20px;
  }

  .hs-scroll-item-34 {
    width: 300px;
    height: 400px;
  
  opacity: 1 !important;}

  .hs-scroll-item-34 img {
    height: 280px;
  }

  .hs-section-title-34 {
    font-size: 2rem;
  
  opacity: 1 !important;}
}
</style>
