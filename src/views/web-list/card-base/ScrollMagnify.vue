<template>
  <section class="sm-scroll-magnify-121">
    <div class="sm-container-121">
      <h2 class="sm-section-title-121">滚动放大镜效果</h2>
      <p class="sm-section-subtitle-121">Scroll Magnify Effect</p>

      <div class="sm-showcase-121">
        <div class="sm-magnify-container-121" ref="magnifyContainer">
          <div class="sm-lens-121" ref="lens"></div>
          <div class="sm-result-121" ref="result">
            <img :src="activeImage" alt="Magnified" />
          </div>
          <div class="sm-image-wrapper-121" ref="imageWrapper">
            <img
              v-for="(img, index) in images"
              :key="index"
              :src="img"
              :alt="`Image ${index + 1}`"
              :class="['sm-image-121', { 'sm-active-121': index === activeIndex }]"
              @click="setActiveImage(index)"
            />
          </div>
        </div>

        <div class="sm-controls-121">
          <button
            v-for="(img, index) in images"
            :key="index"
            :class="['sm-thumb-121', { 'sm-active-121': index === activeIndex }]"
            @click="setActiveImage(index)"
          >
            <img :src="img" :alt="`Thumb ${index + 1}`" />
          </button>
        </div>
      </div>

      <!-- 滚动指示器 -->
      <div class="sm-scroll-indicator-121">
        <div class="sm-indicator-bar-121" ref="indicatorBar"></div>
        <div class="sm-indicator-text-121">滚动放大查看细节</div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const magnifyContainer = ref<HTMLElement>()
const lens = ref<HTMLElement>()
const result = ref<HTMLElement>()
const imageWrapper = ref<HTMLElement>()
const indicatorBar = ref<HTMLElement>()
const activeIndex = ref(0)

const images = [
  new URL('@/assets/image/1.png', import.meta.url).href,
  new URL('@/assets/image/2.png', import.meta.url).href,
  new URL('@/assets/image/3.png', import.meta.url).href,
  new URL('@/assets/image/4.png', import.meta.url).href,
  new URL('@/assets/image/5.png', import.meta.url).href,
  new URL('@/assets/image/6.png', import.meta.url).href
]

const activeImage = ref(images[0])

const setActiveImage = (index: number) => {
  if (activeIndex.value === index) return

  // 切换动画
  const oldImg = imageWrapper.value?.querySelector('.sm-active-121') as HTMLElement
  const newImg = imageWrapper.value?.children[index] as HTMLElement

  gsap.to(oldImg, {
    opacity: 0,
    scale: 0.9,
    duration: 0.4,
    ease: 'power2.inOut',
    onComplete: () => {
      oldImg?.classList.remove('sm-active-121')
    }
  })

  gsap.fromTo(newImg,
    { opacity: 0, scale: 1.1 },
    {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      ease: 'power2.out',
      onStart: () => {
        newImg?.classList.add('sm-active-121')
        activeIndex.value = index
        activeImage.value = images[index]
      }
    }
  )
}

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 标题动画
    gsap.from('.sm-section-title-121', {
      scrollTrigger: {
        trigger: '.sm-scroll-magnify-121',
        start: 'top 85%'
      },
      y: 80,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    })

    gsap.from('.sm-section-subtitle-121', {
      scrollTrigger: {
        trigger: '.sm-scroll-magnify-121',
        start: 'top 80%'
      },
      y: 40,
      opacity: 0,
      duration: 1,
      delay: 0.2,
      ease: 'power3.out'
    })

    // 放大镜容器入场
    gsap.set('.sm-magnify-container-121', { scale: 0.8, opacity: 0, rotation: -10 })
    gsap.to('.sm-magnify-container-121', {
      scale: 1,
      opacity: 1,
      rotation: 0,
      duration: 1.2,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: '.sm-magnify-container-121',
        start: 'top 85%'
      }
    })

    // 滚动时放大镜效果
    gsap.to('.sm-magnify-container-121', {
      scale: 1.1,
      scrollTrigger: {
        trigger: '.sm-magnify-container-121',
        start: 'top 70%',
        end: 'bottom 30%',
        scrub: 1
      },
      ease: 'power1.inOut'
    })

    // 放大镜镜头动画
    gsap.to('.sm-lens-121', {
      scale: 1.5,
      scrollTrigger: {
        trigger: '.sm-magnify-container-121',
        start: 'top 60%',
        end: 'bottom 40%',
        scrub: 0.8
      },
      ease: 'power2.inOut'
    })

    // 结果放大镜滚动效果
    gsap.to('.sm-result-121', {
      scale: 2,
      opacity: 0.9,
      scrollTrigger: {
        trigger: '.sm-magnify-container-121',
        start: 'top 65%',
        end: 'bottom 35%',
        scrub: 1
      },
      ease: 'power2.out'
    })

    // 控制按钮动画
    gsap.from('.sm-thumb-121', {
      scrollTrigger: {
        trigger: '.sm-controls-121',
        start: 'top 90%'
      },
      y: 50,
      opacity: 0,
      scale: 0.5,
      duration: 0.6,
      ease: 'back.out(1.7)',
      stagger: 0.1
    })

    // 滚动指示器动画
    gsap.to('.sm-indicator-bar-121', {
      width: '100%',
      scrollTrigger: {
        trigger: '.sm-scroll-indicator-121',
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1
      }
    })

    gsap.from('.sm-indicator-text-121', {
      scrollTrigger: {
        trigger: '.sm-scroll-indicator-121',
        start: 'top 85%'
      },
      y: 30,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    })

    // 实际放大镜逻辑
    const activeImg = imageWrapper.value?.querySelector('.sm-active-121') as HTMLImageElement

    const handleMouseMove = (e: MouseEvent) => {
      if (!magnifyContainer.value || !lens.value || !result.value || !activeImg) return

      const rect = magnifyContainer.value.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // 限制镜头范围
      const lensSize = 150
      const halfLens = lensSize / 2

      // 移动镜头
      gsap.to(lens.value, {
        x: x - halfLens,
        y: y - halfLens,
        duration: 0.15,
        ease: 'power2.out'
      })

      // 计算放大镜中的图片位置
      const resultImg = result.value.querySelector('img') as HTMLImageElement
      if (resultImg) {
        resultImg.src = activeImg.src
        const ratio = 2 // 放大倍数
        resultImg.style.width = `${rect.width * ratio}px`
        resultImg.style.height = `${rect.height * ratio}px`
        resultImg.style.transform = `translate(-${x * ratio - rect.width / 2}px, -${y * ratio - rect.height / 2}px)`
      }
    }

    magnifyContainer.value?.addEventListener('mousemove', handleMouseMove)

    // 放大镜悬停效果
    magnifyContainer.value?.addEventListener('mouseenter', () => {
      gsap.to('.sm-result-121', {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out'
      })
      gsap.to('.sm-lens-121', {
        opacity: 0.8,
        scale: 1.2,
        duration: 0.3,
        ease: 'power2.out'
      })
    })

    magnifyContainer.value?.addEventListener('mouseleave', () => {
      gsap.to('.sm-result-121', {
        opacity: 0.5,
        duration: 0.3,
        ease: 'power2.out'
      })
      gsap.to('.sm-lens-121', {
        opacity: 0.4,
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      })
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.sm-scroll-magnify-121 {
  min-height: 100vh;
  padding: 100px 0;
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
      radial-gradient(circle at 50% 50%, rgba(96, 165, 250, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 20% 80%, rgba(167, 139, 250, 0.05) 0%, transparent 50%);
    pointer-events: none;
  
  opacity: 1 !important;}
}

.sm-container-121 {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.sm-section-title-121 {
  text-align: center;
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 800;
  color: #fff;
  margin-bottom: 100px;
  background: linear-gradient(135deg, #60a5fa, #34d399, #f472b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 40px rgba(96, 165, 250, 0.5);

  &::after {
    content: '';
    display: block;
    width: 120px;
    height: 4px;
    background: linear-gradient(90deg, #60a5fa, #34d399, #f472b6);
    margin: 24px auto 0;
    border-radius: 2px;
  
  opacity: 1 !important;}
}

.sm-showcase-121 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 60px;
}

.sm-magnify-container-121 {
  position: relative;
  width: 600px;
  height: 450px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
  cursor: crosshair;

  opacity: 1 !important;}

.sm-image-wrapper-121 {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  opacity: 1 !important;}

.sm-image-121 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: all 0.4s ease;

  &.sm-active-121 {
    opacity: 1;
  }
}

.sm-lens-121 {
  position: absolute;
  width: 150px;
  height: 150px;
  border: 3px solid rgba(96, 165, 250, 0.9);
  border-radius: 50%;
  background: rgba(96, 165, 250, 0.2);
  backdrop-filter: blur(5px);
  pointer-events: none;
  opacity: 0.4;
  box-shadow: 0 0 30px rgba(96, 165, 250, 0.7), inset 0 0 20px rgba(96, 165, 250, 0.3);
  transition: opacity 0.3s ease;
}

.sm-result-121 {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 200px;
  height: 150px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  border: 3px solid rgba(96, 165, 250, 0.6);
  opacity: 0.5;
  z-index: 10;
  background: rgba(15, 15, 35, 0.9);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform-origin: center center;
  }
}

.sm-controls-121 {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
}

.sm-thumb-121 {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  border: 3px solid transparent;
  transition: all 0.3s ease;
  opacity: 0.6;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &.sm-active-121 {
    border-color: #60a5fa;
    opacity: 1;
    transform: scale(1.1);
    box-shadow: 0 0 20px rgba(96, 165, 250, 0.5);
  }

  &:hover {
    opacity: 1;
    transform: scale(1.05);
  }
}

.sm-scroll-indicator-121 {
  margin-top: 80px;
  text-align: center;

  opacity: 1 !important;}

.sm-indicator-bar-121 {
  width: 0%;
  height: 4px;
  background: linear-gradient(90deg, #60a5fa, #34d399, #f472b6);
  border-radius: 2px;
  margin: 0 auto 20px;

  opacity: 1 !important;}

.sm-indicator-text-121 {
  font-size: 1.1rem;
  color: #94a3b8;
  font-weight: 500;

  opacity: 1 !important;}

@media (max-width: 768px) {
  .sm-magnify-container-121 {
    width: 100%;
    max-width: 500px;
    height: 375px;
  
  opacity: 1 !important;}

  .sm-result-121 {
    width: 150px;
    height: 112px;
  
  opacity: 1 !important;}

  .sm-lens-121 {
    width: 100px;
    height: 100px;
  
  opacity: 1 !important;}

  .sm-thumb-121 {
    width: 60px;
    height: 60px;
  
  opacity: 1 !important;}

  .sm-section-title-121 {
    margin-bottom: 60px;
  }
}
</style>
