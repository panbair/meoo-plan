<template>
  <section class="sif-scroll-image-flow-124">
    <div class="sif-container-124">
      <h2 class="sif-section-title-124">滚动图片流</h2>
      <p class="sif-section-subtitle-124">Scroll Image Flow Animation</p>

      <div class="sif-image-flow-124">
        <div
          v-for="(img, index) in images"
          :key="index"
          class="sif-flow-item-124"
          :ref="el => { if (el) flowItems[index] = el as HTMLElement }"
        >
          <div class="sif-image-wrapper-124">
            <div class="sif-parallax-layer-124" :ref="el => { if (el) parallaxLayers[index] = el as HTMLElement }">
              <img :src="img.url" :alt="`Image ${index + 1}`" />
              <div class="sif-overlay-124">
                <div class="sif-content-124">
                  <h3 class="sif-image-title-124">{{ img.title }}</h3>
                  <p class="sif-image-desc-124">{{ img.description }}</p>
                  <span class="sif-number-124">{{ String(index + 1).padStart(2, '0') }}</span>
                </div>
              </div>
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

const flowItems = ref<HTMLElement[]>([])
const parallaxLayers = ref<HTMLElement[]>([])

const images = [
  {
    url: new URL('@/assets/image/1.png', import.meta.url).href,
    title: '流动之美',
    description: '自然的韵律与节奏'
  },
  {
    url: new URL('@/assets/image/2.png', import.meta.url).href,
    title: '视觉之旅',
    description: '探索无限的创意空间'
  },
  {
    url: new URL('@/assets/image/3.png', import.meta.url).href,
    title: '动态艺术',
    description: '每帧都是艺术品'
  },
  {
    url: new URL('@/assets/image/4.png', import.meta.url).href,
    title: '灵感源泉',
    description: '设计源于生活'
  },
  {
    url: new URL('@/assets/image/5.png', import.meta.url).href,
    title: '创新思维',
    description: '突破传统界限'
  }
]

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 标题动画 - 文字流动效果
    gsap.from('.sif-section-title-124', {
      scrollTrigger: {
        trigger: '.sif-scroll-image-flow-124',
        start: 'top 90%'
      },
      y: 100,
      opacity: 0,
      scale: 1.2,
      rotationX: 20,
      duration: 1.2,
      ease: 'power3.out'
    })

    // 副标题淡入
    gsap.from('.sif-section-subtitle-124', {
      scrollTrigger: {
        trigger: '.sif-scroll-image-flow-124',
        start: 'top 85%'
      },
      y: 50,
      opacity: 0,
      duration: 1,
      delay: 0.2,
      ease: 'power3.out'
    })

    // 延迟执行项目动画，确保refs已填充
    setTimeout(() => {
      flowItems.value.forEach((item, index) => {
        if (!item) return

        const parallaxLayer = parallaxLayers.value[index]
        const overlay = item.querySelector('.sif-overlay-124') as HTMLElement
        const title = item.querySelector('.sif-image-title-124') as HTMLElement
        const desc = item.querySelector('.sif-image-desc-124') as HTMLElement
        const number = item.querySelector('.sif-number-124') as HTMLElement

        // 初始状态
        gsap.set(item, {
          y: 100,
          scale: 0.9,
          opacity: 0
        })

        // 流动入场动画
        gsap.to(item, {
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            end: 'top 40%',
            scrub: 1
          },
          y: 0,
          scale: 1,
          opacity: 1,
          ease: 'power2.out'
        })

        // 视差滚动效果 - 图片层
        if (parallaxLayer) {
          gsap.to(parallaxLayer, {
            scrollTrigger: {
              trigger: item,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.5
            },
            y: -80,
            ease: 'none'
          })
        }

        // 覆盖层渐变
        if (overlay) {
          gsap.fromTo(overlay,
            { opacity: 0 },
            {
              scrollTrigger: {
                trigger: item,
                start: 'top 70%',
                end: 'top 50%',
                scrub: true
              },
              opacity: 1
            }
          )
        }

        // 标题从底部滑入
        if (title) {
          gsap.fromTo(title,
            { y: 60, opacity: 0, rotationX: -45 },
            {
              scrollTrigger: {
                trigger: item,
                start: 'top 60%',
                end: 'top 40%',
                scrub: 1
              },
              y: 0,
              opacity: 1,
              rotationX: 0,
              ease: 'back.out(1.7)'
            }
          )
        }

        // 描述文字淡入
        if (desc) {
          gsap.fromTo(desc,
            { y: 40, opacity: 0 },
            {
              scrollTrigger: {
                trigger: item,
                start: 'top 55%',
                end: 'top 35%',
                scrub: 1
              },
              y: 0,
              opacity: 1,
              ease: 'power2.out'
            }
          )
        }

        // 数字旋转入场
        if (number) {
          gsap.fromTo(number,
            { rotation: 360, scale: 0, opacity: 0 },
            {
              scrollTrigger: {
                trigger: item,
                start: 'top 50%',
                end: 'top 30%',
                scrub: 1
              },
              rotation: 0,
              scale: 1,
              opacity: 1,
              ease: 'back.out(2)'
            }
          )
        }

        // 悬停效果
        item.addEventListener('mouseenter', () => {
          if (parallaxLayer) {
            gsap.to(parallaxLayer, { scale: 1.05, duration: 0.5, ease: 'power2.out' })
          }
          if (number) {
            gsap.to(number, { scale: 1.2, duration: 0.3, ease: 'back.out(1.7)' })
          }
        })

        item.addEventListener('mouseleave', () => {
          if (parallaxLayer) {
            gsap.to(parallaxLayer, { scale: 1, duration: 0.5, ease: 'power2.out' })
          }
          if (number) {
            gsap.to(number, { scale: 1, duration: 0.3, ease: 'power2.out' })
          }
        })
      })
    }, 100)
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.sif-scroll-image-flow-124 {
  min-height: 100vh;
  padding: 100px 20px;
  background: linear-gradient(180deg, #0a0a1a 0%, #1a1a3e 50%, #0a0a1a 100%);
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
      radial-gradient(circle at 10% 20%, rgba(168, 85, 247, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 90% 80%, rgba(59, 130, 246, 0.08) 0%, transparent 50%);
    pointer-events: none;
  
  opacity: 1 !important;}
}

.sif-container-124 {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.sif-section-title-124 {
  text-align: center;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 900;
  color: #fff;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #a855f7, #3b82f6, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 60px rgba(168, 85, 247, 0.4);

  opacity: 1 !important;}

.sif-section-subtitle-124 {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 120px;
  letter-spacing: 0.2em;
  text-transform: uppercase;

  opacity: 1 !important;}

.sif-image-flow-124 {
  display: flex;
  flex-direction: column;
  gap: 80px;
  max-width: 900px;
  margin: 0 auto;

  opacity: 1 !important;}

.sif-flow-item-124 { position: relative;
  height: 500px;
  border-radius: 30px;
  overflow: hidden;
  background: linear-gradient(135deg, #1e1e3f 0%, #0f0f2f 100%);
  box-shadow: 0 30px 100px rgba(0, 0, 0, 0.5);
  cursor: pointer;
  transition: box-shadow 0.4s ease;

  &:hover {
    box-shadow: 0 40px 120px rgba(168, 85, 247, 0.3);
      opacity: 1;
    }
}

.sif-image-wrapper-124 {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.sif-parallax-layer-124 { width: 100%;
  height: 120%;
  position: absolute;
  top: -10%;
  left: 0;
  transform-origin: center center;
      opacity: 1;
    }

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.sif-overlay-124 {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 60px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.7) 30%, transparent 100%);
  pointer-events: none;
  opacity: 0;
}

.sif-content-124 {
  position: relative;
  z-index: 2;
}

.sif-image-title-124 { font-size: clamp(1.8rem, 4vw, 2.5rem);
  font-weight: 800;
  color: #fff;
  margin-bottom: 16px;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  perspective: 1000px;
      opacity: 1;
    }

.sif-image-desc-124 { font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 20px;
  line-height: 1.6;
      opacity: 1;
    }

.sif-number-124 { position: absolute;
  top: -60px;
  right: 0;
  font-size: 5rem;
  font-weight: 900;
  color: transparent;
  -webkit-text-stroke: 2px rgba(255, 255, 255, 0.3);
  font-family: 'Arial', sans-serif;
  text-shadow: 0 0 40px rgba(168, 85, 247, 0.3);
      opacity: 1;
    }

@media (max-width: 768px) {
  .sif-image-flow-124 {
    gap: 60px;
  }

  .sif-flow-item-124 { height: 400px;
    border-radius: 20px;
      opacity: 1;
    }

  .sif-overlay-124 { padding: 40px 30px;
      opacity: 1;
    }

  .sif-number-124 { font-size: 3.5rem;
    top: -50px;
      opacity: 1;
    }

  .sif-section-title-124 {
    margin-bottom: 80px;
  }

  .sif-section-subtitle-124 {
    margin-bottom: 60px;
    font-size: 0.9rem;
  
  opacity: 1 !important;}

  .sif-container-124 {
    padding: 0 20px;
  
  opacity: 1 !important;}
}
</style>
