<template>
  <div class="sge-glitch-effect-section-156" ref="componentRoot">
    <div class="sge-container-156">
      <h2 class="sge-title-156">故障艺术效果</h2>
      <p class="sge-subtitle-156">Glitch Art Effect</p>

      <div class="sge-stage-156">
        <div class="sge-glitch-card-156" ref="glitchCard">
          <div class="sge-image-container-156">
            <div class="sge-image-layer-156 sge-main-156" :style="{ backgroundImage: `url(${mainImage})` }"></div>
            <div class="sge-image-layer-156 sge-red-156" :style="{ backgroundImage: `url(${mainImage})` }"></div>
            <div class="sge-image-layer-156 sge-blue-156" :style="{ backgroundImage: `url(${mainImage})` }"></div>
          </div>
          <div class="sge-content-156">
            <h3 class="sge-card-title-156">数字故障</h3>
            <p class="sge-card-desc-156">Digital Glitch Art</p>
            <div class="sge-glitch-lines-156">
              <div class="sge-line-156"></div>
              <div class="sge-line-156"></div>
              <div class="sge-line-156"></div>
            </div>
          </div>
        </div>

        <div class="sge-grid-156">
          <div
            v-for="(item, index) in gridItems"
            :key="index"
            class="sge-grid-item-156"
            :ref="el => { if (el) gridItemsRefs[index] = el as HTMLElement }"
          >
            <div class="sge-grid-image-156" :style="{ backgroundImage: `url(${item.image})` }"></div>
            <div class="sge-grid-overlay-156">
              <span class="sge-grid-number-156">{{ String(index + 1).padStart(2, '0') }}</span>
              <h4>{{ item.title }}</h4>
            </div>
          </div>
        </div>
      </div>

      <div class="sge-noise-156"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const componentRoot = ref<HTMLElement>()
const glitchCard = ref<HTMLElement>()
const gridItemsRefs = ref<HTMLElement[]>([])

const mainImage = new URL('@/assets/image/1.png', import.meta.url).href

interface GridItem {
  image: string
  title: string
}

const gridItems: GridItem[] = [
  {
    image: new URL('@/assets/image/2.png', import.meta.url).href,
    title: 'Chaos'
  },
  {
    image: new URL('@/assets/image/3.png', import.meta.url).href,
    title: 'Distort'
  },
  {
    image: new URL('@/assets/image/4.png', import.meta.url).href,
    title: 'Static'
  },
  {
    image: new URL('@/assets/image/5.png', import.meta.url).href,
    title: 'Signal'
  }
]

let ctx: gsap.Context
let glitchInterval: number | null = null

onMounted(() => {
  setTimeout(() => {
    if (!componentRoot.value) return
    ctx = gsap.context(() => {
      const titleEl = gsap.utils.toArray<HTMLElement>('.sge-title-156', componentRoot.value)
      const subtitleEl = gsap.utils.toArray<HTMLElement>('.sge-subtitle-156', componentRoot.value)
      const glitchCardEl = gsap.utils.toArray<HTMLElement>('.sge-glitch-card-156', componentRoot.value)
      const cardTitleEl = gsap.utils.toArray<HTMLElement>('.sge-card-title-156', componentRoot.value)
      const cardDescEl = gsap.utils.toArray<HTMLElement>('.sge-card-desc-156', componentRoot.value)
      const gridItemsEl = gsap.utils.toArray<HTMLElement>('.sge-grid-item-156', componentRoot.value)
      const stageEl = gsap.utils.toArray<HTMLElement>('.sge-stage-156', componentRoot.value)

      // 标题动画 - 故障效果
      if (titleEl.length) {
        const glitchTitle = (titleEl[0] as HTMLElement)
        gsap.from(titleEl, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          y: 80,
          opacity: 0,
          duration: 1,
          ease: 'power3.out'
        })

        // 持续的故障效果
        const createGlitch = () => {
          const duration = 0.05 + Math.random() * 0.1
          const skewX = (Math.random() - 0.5) * 10
          const skewY = (Math.random() - 0.5) * 5
          const translateX = (Math.random() - 0.5) * 5

          gsap.to(glitchTitle, {
            skewX,
            skewY,
            x: translateX,
            duration,
            ease: 'none'
          }).then(() => {
            gsap.to(glitchTitle, {
              skewX: 0,
              skewY: 0,
              x: 0,
              duration: 0.1,
              ease: 'power2.out'
            })
          })
        }

        glitchInterval = window.setInterval(createGlitch, 2000 + Math.random() * 3000)
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

      // 主卡片故障动画
      if (glitchCardEl.length) {
        const card = glitchCardEl[0] as HTMLElement
        const redLayer = card.querySelector('.sge-red-156') as HTMLElement
        const blueLayer = card.querySelector('.sge-blue-156') as HTMLElement

        gsap.from(glitchCardEl, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          },
          scale: 0.8,
          opacity: 0,
          rotation: 5,
          duration: 1,
          ease: 'power3.out'
        })

        // 滚动时的故障效果
        ScrollTrigger.create({
          trigger: stageEl[0] || componentRoot.value,
          start: 'top 60%',
          end: 'bottom 40%',
          onUpdate: (self) => {
            const progress = self.progress
            const intensity = Math.sin(progress * Math.PI * 4) * 5

            if (redLayer) {
              gsap.set(redLayer, {
                x: intensity,
                opacity: 0.5 + Math.random() * 0.3
              })
            }
            if (blueLayer) {
              gsap.set(blueLayer, {
                x: -intensity,
                opacity: 0.5 + Math.random() * 0.3
              })
            }
          }
        })
      }

      // 卡片内容动画
      if (cardTitleEl.length) {
        gsap.from(cardTitleEl, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 65%',
            toggleActions: 'play none none reverse'
          },
          y: 30,
          opacity: 0,
          duration: 0.8,
          delay: 0.3,
          ease: 'power3.out'
        })
      }

      if (cardDescEl.length) {
        gsap.from(cardDescEl, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 65%',
            toggleActions: 'play none none reverse'
          },
          y: 20,
          opacity: 0,
          duration: 0.8,
          delay: 0.5,
          ease: 'power3.out'
        })
      }

      // 网格项动画
      if (gridItemsEl.length) {
        gsap.from(gridItemsEl, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 60%',
            toggleActions: 'play none none reverse'
          },
          y: 60,
          opacity: 0,
          scale: 0.8,
          rotation: (i) => (i % 2 === 0 ? 10 : -10),
          duration: 0.8,
          stagger: 0.15,
          ease: 'back.out(1.7)'
        })

        // 网格项悬停故障效果
        gridItemsEl.forEach((item: HTMLElement, index: number) => {
          item.addEventListener('mouseenter', () => {
            gsap.to(item, {
              scale: 1.1,
              rotation: (Math.random() - 0.5) * 5,
              boxShadow: '0 20px 60px rgba(255, 0, 100, 0.4)',
              duration: 0.3,
              ease: 'power2.out'
            })

            gsap.to(item.querySelector('.sge-grid-image-156'), {
              filter: 'hue-rotate(45deg) contrast(1.3)',
              duration: 0.2
            })

            // 故障闪烁
            const flicker = () => {
              gsap.to(item.querySelector('.sge-grid-overlay-156'), {
                opacity: 0.3,
                duration: 0.05,
                yoyo: true,
                repeat: 3,
                ease: 'none'
              })
            }
            flicker()
          })

          item.addEventListener('mouseleave', () => {
            gsap.to(item, {
              scale: 1,
              rotation: 0,
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
              duration: 0.4,
              ease: 'power2.out'
            })

            gsap.to(item.querySelector('.sge-grid-image-156'), {
              filter: 'none',
              duration: 0.3
            })
          })
        })
      }
    }, componentRoot.value)
  }, 100)
})

onUnmounted(() => {
  ctx?.revert()
  if (glitchInterval) {
    clearInterval(glitchInterval)
  }
})
</script>

<style scoped lang="scss">
.sge-glitch-effect-section-156 {
  min-height: 100vh;
  padding: 100px 20px;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a0a1a 50%, #0a0a1a 100%);
  position: relative;
  overflow: hidden;
}

.sge-noise-156 {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  z-index: 0;
}

.sge-container-156 {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  z-index: 1;
}

.sge-title-156 {
  text-align: center;
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 900;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #ff00ff, #00ffff, #ff0080);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: none;
  position: relative;
  letter-spacing: 0.05em;

  &::before,
  &::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}

.sge-subtitle-156 {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(255, 0, 255, 0.6);
  margin-bottom: 80px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  font-family: 'Courier New', monospace;
}

.sge-stage-156 {
  display: flex;
  flex-direction: column;
  gap: 60px;
  align-items: center;
}

.sge-glitch-card-156 {
  position: relative;
  width: 100%;
  max-width: 500px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 20px;
  overflow: hidden;
  border: 2px solid rgba(255, 0, 255, 0.3);
  cursor: pointer;
  box-shadow: 0 20px 60px rgba(255, 0, 255, 0.2);
  transition: box-shadow 0.4s ease;

  &:hover {
    box-shadow: 0 30px 80px rgba(255, 0, 255, 0.4);
  }
}

.sge-image-container-156 {
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
}

.sge-image-layer-156 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  mix-blend-mode: screen;
  will-change: transform, opacity;
}

.sge-main-156 {
  z-index: 1;
}

.sge-red-156 {
  z-index: 2;
  mix-blend-mode: multiply;
  filter: sepia(1) hue-rotate(-50deg) saturate(5);
  opacity: 0.7;
}

.sge-blue-156 {
  z-index: 3;
  mix-blend-mode: multiply;
  filter: sepia(1) hue-rotate(180deg) saturate(5);
  opacity: 0.7;
}

.sge-content-156 {
  padding: 30px;
  text-align: center;
  background: rgba(0, 0, 0, 0.9);
}

.sge-card-title-156 {
  font-size: 2rem;
  font-weight: 900;
  color: #fff;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.sge-card-desc-156 {
  font-size: 1rem;
  color: rgba(255, 0, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  margin-bottom: 20px;
}

.sge-glitch-lines-156 {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.sge-line-156 {
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #ff00ff, #00ffff);
  transform: scaleX(0);
  transform-origin: left;
}

.sge-grid-156 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 900px;
}

.sge-grid-item-156 {
  position: relative;
  aspect-ratio: 1;
  border-radius: 15px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid rgba(255, 0, 255, 0.2);
  background: rgba(0, 0, 0, 0.6);
  transition: border-color 0.3s ease;

  &:hover {
    border-color: rgba(255, 0, 255, 0.6);
  }
}

.sge-grid-image-156 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transition: filter 0.3s ease;
}

.sge-grid-overlay-156 {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));
  z-index: 2;
  transition: opacity 0.3s ease;
}

.sge-grid-number-156 {
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 2rem;
  font-weight: 900;
  color: rgba(255, 0, 255, 0.5);
  text-shadow: 0 0 20px rgba(255, 0, 255, 0.5);
}

.sge-grid-item-156 h4 {
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

@media (max-width: 768px) {
  .sge-glitch-card-156 {
    max-width: 100%;
  }

  .sge-image-container-156 {
    height: 300px;
  }

  .sge-card-title-156 {
    font-size: 1.5rem;
  }

  .sge-grid-156 {
    grid-template-columns: repeat(2, 1fr);
  }

  .sge-grid-number-156 {
    font-size: 1.5rem;
  }
}
</style>
