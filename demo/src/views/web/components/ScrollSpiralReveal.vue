<template>
  <div class="ssr-spiral-reveal-section-155" ref="componentRoot">
    <div class="ssr-container-155">
      <h2 class="ssr-title-155">螺旋揭示</h2>
      <p class="ssr-subtitle-155">Spiral Reveal Effect</p>

      <div class="ssr-spiral-wrapper-155">
        <div class="ssr-spiral-path-155" ref="spiralPath">
          <div
            v-for="(item, index) in spiralItems"
            :key="index"
            class="ssr-spiral-item-155"
            :style="{
              '--angle': index * 45,
              '--radius': 100 + index * 40
            }"
          >
            <div class="ssr-item-card-155" :ref="el => { if (el) cards[index] = el as HTMLElement }">
              <div class="ssr-card-image-155" :style="{ backgroundImage: `url(${item.image})` }"></div>
              <div class="ssr-card-info-155">
                <h3 class="ssr-card-title-155">{{ item.title }}</h3>
                <p class="ssr-card-desc-155">{{ item.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="ssr-spiral-lines-155">
        <div class="ssr-spiral-line-155" v-for="i in 3" :key="i" :style="{ '--duration': 20 + i * 5 }"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const componentRoot = ref<HTMLElement>()
const spiralPath = ref<HTMLElement>()
const cards = ref<HTMLElement[]>([])

interface SpiralItem {
  image: string
  title: string
  description: string
}

const spiralItems = ref<SpiralItem[]>([
  {
    image: new URL('@/assets/image/1.png', import.meta.url).href,
    title: '起点',
    description: '从中心开始的旅程'
  },
  {
    image: new URL('@/assets/image/2.png', import.meta.url).href,
    title: '探索',
    description: '不断向外延伸'
  },
  {
    image: new URL('@/assets/image/3.png', import.meta.url).href,
    title: '发现',
    description: '揭示隐藏的美'
  },
  {
    image: new URL('@/assets/image/4.png', import.meta.url).href,
    title: '终点',
    description: '完整的循环'
  }
])

let ctx: gsap.Context

onMounted(() => {
  setTimeout(() => {
    if (!componentRoot.value) return
    ctx = gsap.context(() => {
      const titleEl = gsap.utils.toArray<HTMLElement>('.ssr-title-155', componentRoot.value)
      const subtitleEl = gsap.utils.toArray<HTMLElement>('.ssr-subtitle-155', componentRoot.value)
      const spiralItems = gsap.utils.toArray<HTMLElement>('.ssr-spiral-item-155', componentRoot.value)
      const spiralWrapper = gsap.utils.toArray<HTMLElement>('.ssr-spiral-wrapper-155', componentRoot.value)
      const spiralPath = gsap.utils.toArray<HTMLElement>('.ssr-spiral-path-155', componentRoot.value)
      const cardImages = gsap.utils.toArray<HTMLElement>('.ssr-card-image-155', componentRoot.value)
      const cardTitles = gsap.utils.toArray<HTMLElement>('.ssr-card-title-155', componentRoot.value)
      const cardDescs = gsap.utils.toArray<HTMLElement>('.ssr-card-desc-155', componentRoot.value)
      const spiralLines = gsap.utils.toArray<HTMLElement>('.ssr-spiral-line-155', componentRoot.value)
      const spiralLinesContainer = gsap.utils.toArray<HTMLElement>('.ssr-spiral-lines-155', componentRoot.value)

      // 标题动画
      if (titleEl.length) {
        gsap.from(titleEl, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          y: 60,
          opacity: 0,
          duration: 1,
          ease: 'power3.out'
        })
      }

      if (subtitleEl.length) {
        gsap.from(subtitleEl, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          },
          y: 40,
          opacity: 0,
          duration: 1,
          delay: 0.2,
          ease: 'power3.out'
        })
      }

      // 螺旋项目初始设置
      if (spiralItems.length) {
        gsap.set(spiralItems, {
          rotation: 0,
          scale: 0,
          opacity: 0
        })

        // 螺旋展开动画
        gsap.to(spiralItems, {
          rotation: (i) => i * 45,
          scale: 1,
          opacity: 1,
          duration: 1.5,
          ease: 'back.out(1.5)',
          stagger: 0.2,
          scrollTrigger: {
            trigger: spiralWrapper[0] || componentRoot.value,
            start: 'top 80%'
          }
        })

        // 滚动时螺旋展开
        gsap.to(spiralItems, {
          '--radius': (i) => 120 + i * 40,
          scrollTrigger: {
            trigger: spiralWrapper[0] || componentRoot.value,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          }
        })
      }

      // 螺旋旋转动画
      if (spiralPath.length) {
        gsap.to(spiralPath, {
          rotation: 360,
          duration: 60,
          repeat: -1,
          ease: 'none'
        })
      }

      // 卡片悬停效果
      cards.value.forEach((card, index) => {
        if (!card) return
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            scale: 1.15,
            boxShadow: '0 25px 60px rgba(236, 72, 153, 0.4)',
            duration: 0.4,
            ease: 'back.out(1.7)'
          })

          const image = card.querySelector('.ssr-card-image-155') as HTMLElement
          if (image) {
            gsap.to(image, {
              scale: 1.1,
              duration: 0.4,
              ease: 'power2.out'
            })
          }
        })

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            scale: 1,
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2)',
            duration: 0.4,
            ease: 'power2.out'
          })

          const image = card.querySelector('.ssr-card-image-155') as HTMLElement
          if (image) {
            gsap.to(image, {
              scale: 1,
              duration: 0.4,
              ease: 'power2.out'
            })
          }
        })
      })

      // 图片缩放动画
      if (cardImages.length) {
        gsap.from(cardImages, {
          scrollTrigger: {
            trigger: spiralWrapper[0] || componentRoot.value,
            start: 'top 80%'
          },
          scale: 1.3,
          opacity: 0,
          duration: 1.2,
          ease: 'power2.out',
          stagger: 0.2
        })
      }

      // 文字淡入
      if (cardTitles.length) {
        gsap.from(cardTitles, {
          scrollTrigger: {
            trigger: spiralWrapper[0] || componentRoot.value,
            start: 'top 75%'
          },
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.2
        })
      }

      if (cardDescs.length) {
        gsap.from(cardDescs, {
          scrollTrigger: {
            trigger: spiralWrapper[0] || componentRoot.value,
            start: 'top 75%'
          },
          y: 20,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.2,
          delay: 0.1
        })
      }

      // 螺旋线动画
      if (spiralLines.length && spiralLinesContainer.length) {
        gsap.from(spiralLines, {
          scrollTrigger: {
            trigger: spiralLinesContainer[0],
            start: 'top 90%'
          },
          scale: 0,
          opacity: 0,
          duration: 2,
          ease: 'elastic.out(1, 0.5)',
          stagger: 0.3
        })

        // 螺旋线旋转
        gsap.to(spiralLines, {
          rotation: 360,
          duration: (i) => 20 + i * 5,
          repeat: -1,
          ease: 'none',
          stagger: 0.2
        })
      }
    }, componentRoot.value)
  }, 100)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.ssr-spiral-reveal-section-155 {
  min-height: 100vh;
  padding: 100px 20px;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #0f0f23 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  opacity: 1 !important;}

.ssr-container-155 {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.ssr-title-155 {
  text-align: center;
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 900;
  color: #fff;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #f472b6, #a78bfa, #60a5fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  opacity: 1 !important;}

.ssr-subtitle-155 {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 80px;
  letter-spacing: 0.2em;
  text-transform: uppercase;

  opacity: 1 !important;}

.ssr-spiral-wrapper-155 {
  position: relative;
  width: 100%;
  height: 700px;
  display: flex;
  align-items: center;
  justify-content: center;

  opacity: 1 !important;}

.ssr-spiral-path-155 {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  opacity: 1 !important;}

.ssr-spiral-item-155 {
  position: absolute;
  transform: rotate(var(--angle)deg) translateX(var(--radius));
  transform-origin: center;
}

.ssr-item-card-155 {
  position: absolute;
  width: 200px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transform: rotate(calc(-1 * var(--angle))) translateX(calc(var(--radius) * -1));
  transition: box-shadow 0.4s ease;

  &:hover {
    box-shadow: 0 25px 60px rgba(236, 72, 153, 0.3);
  
  opacity: 1 !important;}
}

.ssr-card-image-155 {
  width: 100%;
  height: 150px;
  background-size: cover;
  background-position: center;
  transition: transform 0.4s ease;

  opacity: 1 !important;}

.ssr-card-info-155 {
  padding: 20px;

  opacity: 1 !important;}

.ssr-card-title-155 {
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;

  opacity: 1 !important;}

.ssr-card-desc-155 {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.4;

  opacity: 1 !important;}

.ssr-spiral-lines-155 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.ssr-spiral-line-155 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid rgba(236, 72, 153, 0.1);
  border-radius: 50%;
  animation: rotate var(--duration) linear infinite;

  opacity: 1 !important;}

.ssr-spiral-line-155:nth-child(1) {
  width: 300px;
  height: 300px;
}

.ssr-spiral-line-155:nth-child(2) {
  width: 450px;
  height: 450px;
}

.ssr-spiral-line-155:nth-child(3) {
  width: 600px;
  height: 600px;
}

@keyframes rotate {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

@media (max-width: 768px) {
  .ssr-spiral-wrapper-155 {
    height: 600px;
  
  opacity: 1 !important;}

  .ssr-item-card-155 {
    width: 160px;
  
  opacity: 1 !important;}

  .ssr-card-image-155 {
    height: 120px;
  
  opacity: 1 !important;}

  .ssr-card-title-155 {
    font-size: 1rem;
  
  opacity: 1 !important;}

  .ssr-card-desc-155 {
    font-size: 0.8rem;
  
  opacity: 1 !important;}

  .ssr-spiral-line-155 {
    transform: translate(-50%, -50%) scale(0.7);
  }
}
</style>
