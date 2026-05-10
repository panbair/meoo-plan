<template>
  <div class="shg-hologram-gallery-section-160" ref="componentRoot">
    <div class="shg-container-160">
      <h2 class="shg-title-160">全息画廊</h2>
      <p class="shg-subtitle-160">Hologram Gallery</p>

      <div class="shg-hologram-stage-160">
        <div class="shg-grid-160">
          <div
            v-for="(item, index) in galleryItems"
            :key="index"
            class="shg-hologram-item-160"
            :ref="el => { if (el) itemRefs[index] = el as HTMLElement }"
            @mousemove="handleHologramMove($event, index)"
            @mouseleave="handleHologramLeave(index)"
          >
            <div class="shg-hologram-base-160">
              <div class="shg-base-circle-160"></div>
              <div class="shg-base-ring-160"></div>
            </div>

            <div class="shg-hologram-projector-160" ref="projector">
              <div class="shg-beam-160"></div>
              <div class="shg-light-160"></div>
            </div>

            <div class="shg-hologram-image-160" ref="hologramImage">
              <div class="shg-image-layer-160" :style="{ backgroundImage: `url(${item.image})` }"></div>
              <div class="shg-image-layer-160 shg-scanline-160"></div>
              <div class="shg-image-layer-160 shg-noise-160"></div>
            </div>

            <div class="shg-hologram-content-160">
              <span class="shg-item-number-160">{{ String(index + 1).padStart(2, '0') }}</span>
              <h3 class="shg-item-title-160">{{ item.title }}</h3>
              <p class="shg-item-desc-160">{{ item.description }}</p>
              <div class="shg-hologram-status-160">
                <span class="shg-status-dot-160"></span>
                <span class="shg-status-text-160">ACTIVE</span>
              </div>
            </div>
          </div>
        </div>

        <div class="shg-hologram-grid-160">
          <div class="shg-grid-line-160" v-for="i in 8" :key="i" :style="`--rotation: ${i * 22.5}deg`"></div>
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

const componentRoot = ref<HTMLElement>()
const itemRefs = ref<HTMLElement[]>([])

interface GalleryItem {
  image: string
  title: string
  description: string
}

const galleryItems: GalleryItem[] = [
  {
    image: new URL('@/assets/image/1.png', import.meta.url).href,
    title: '量子投影',
    description: 'Quantum Projection'
  },
  {
    image: new URL('@/assets/image/2.png', import.meta.url).href,
    title: '全息显示',
    description: 'Holographic Display'
  },
  {
    image: new URL('@/assets/image/3.png', import.meta.url).href,
    title: '虚拟现实',
    description: 'Virtual Reality'
  },
  {
    image: new URL('@/assets/image/4.png', import.meta.url).href,
    title: '增强现实',
    description: 'Augmented Reality'
  },
  {
    image: new URL('@/assets/image/5.png', import.meta.url).href,
    title: '混合现实',
    description: 'Mixed Reality'
  },
  {
    image: new URL('@/assets/image/6.png', import.meta.url).href,
    title: '空间计算',
    description: 'Spatial Computing'
  }
]

let ctx: gsap.Context

const handleHologramMove = (event: MouseEvent, index: number) => {
  const item = itemRefs.value[index]
  if (!item) return

  const rect = item.getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  const y = ((event.clientY - rect.top) / rect.height) * 2 - 1

  const hologramImage = item.querySelector('.shg-hologram-image-160') as HTMLElement
  if (hologramImage) {
    gsap.to(hologramImage, {
      rotateY: x * 15,
      rotateX: -y * 15,
      duration: 0.3,
      ease: 'power2.out'
    })
  }

  const beam = item.querySelector('.shg-beam-160') as HTMLElement
  if (beam) {
    gsap.to(beam, {
      opacity: 0.3 + Math.abs(x) * 0.4,
      scaleX: 1 + Math.abs(x) * 0.3,
      duration: 0.3,
      ease: 'power2.out'
    })
  }
}

const handleHologramLeave = (index: number) => {
  const item = itemRefs.value[index]
  if (!item) return

  const hologramImage = item.querySelector('.shg-hologram-image-160') as HTMLElement
  if (hologramImage) {
    gsap.to(hologramImage, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.5,
      ease: 'power2.out'
    })
  }

  const beam = item.querySelector('.shg-beam-160') as HTMLElement
  if (beam) {
    gsap.to(beam, {
      opacity: 0.2,
      scaleX: 1,
      duration: 0.5,
      ease: 'power2.out'
    })
  }
}

onMounted(() => {
  setTimeout(() => {
    if (!componentRoot.value) return
    ctx = gsap.context(() => {
      const titleEl = gsap.utils.toArray<HTMLElement>('.shg-title-160', componentRoot.value)
      const subtitleEl = gsap.utils.toArray<HTMLElement>('.shg-subtitle-160', componentRoot.value)
      const hologramItems = gsap.utils.toArray<HTMLElement>('.shg-hologram-item-160', componentRoot.value)
      const stageEl = gsap.utils.toArray<HTMLElement>('.shg-hologram-stage-160', componentRoot.value)
      const hologramImages = gsap.utils.toArray<HTMLElement>('.shg-hologram-image-160', componentRoot.value)
      const itemNumbers = gsap.utils.toArray<HTMLElement>('.shg-item-number-160', componentRoot.value)
      const itemTitles = gsap.utils.toArray<HTMLElement>('.shg-item-title-160', componentRoot.value)
      const itemDescs = gsap.utils.toArray<HTMLElement>('.shg-item-desc-160', componentRoot.value)
      const gridLines = gsap.utils.toArray<HTMLElement>('.shg-grid-line-160', componentRoot.value)
      const baseCircles = gsap.utils.toArray<HTMLElement>('.shg-base-circle-160', componentRoot.value)
      const baseRings = gsap.utils.toArray<HTMLElement>('.shg-base-ring-160', componentRoot.value)

      // 标题动画
      if (titleEl.length) {
        gsap.from(titleEl, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          y: 80,
          opacity: 0,
          scale: 0.8,
          duration: 1.2,
          ease: 'power3.out'
        })

        // 全息闪烁效果
        gsap.to(titleEl, {
          filter: 'drop-shadow(0 0 20px rgba(6, 182, 212, 0.8))',
          duration: 0.5,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut'
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

      // 全息网格动画
      if (gridLines.length) {
        gsap.from(gridLines, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          },
          scaleY: 0,
          opacity: 0,
          duration: 1.5,
          stagger: 0.1,
          ease: 'power3.out'
        })
      }

      // 全息项目动画
      if (hologramItems.length) {
        gsap.from(hologramItems, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          },
          y: 80,
          opacity: 0,
          scale: 0.7,
          duration: 0.8,
          stagger: 0.1,
          ease: 'back.out(1.7)'
        })

        // 全息项目持续浮动
        hologramItems.forEach((item: HTMLElement, index: number) => {
          gsap.to(item, {
            y: -10,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: index * 0.2
          })
        })
      }

      // 全息图像动画
      if (hologramImages.length) {
        gsap.from(hologramImages, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 65%',
            toggleActions: 'play none none reverse'
          },
          opacity: 0,
          rotateX: 90,
          scale: 0.5,
          duration: 1,
          stagger: 0.1,
          delay: 0.3,
          ease: 'back.out(2)'
        })

        // 全息图像持续闪烁
        hologramImages.forEach((image: HTMLElement) => {
          const scanline = image.querySelector('.shg-scanline-160') as HTMLElement
          const noise = image.querySelector('.shg-noise-160') as HTMLElement

          if (scanline) {
            gsap.to(scanline, {
              backgroundPositionY: '100%',
              duration: 3,
              repeat: -1,
              ease: 'none'
            })
          }

          if (noise) {
            gsap.to(noise, {
              opacity: 0.3 + Math.random() * 0.4,
              duration: 0.1,
              repeat: -1,
              yoyo: true,
              ease: 'power1.inOut'
            })
          }
        })
      }

      // 基底动画
      if (baseCircles.length) {
        gsap.from(baseCircles, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 65%',
            toggleActions: 'play none none reverse'
          },
          scale: 0,
          opacity: 0,
          duration: 1,
          stagger: 0.1,
          delay: 0.5,
          ease: 'elastic.out(1, 0.5)'
        })
      }

      if (baseRings.length) {
        gsap.from(baseRings, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 65%',
            toggleActions: 'play none none reverse'
          },
          scale: 0,
          opacity: 0,
          duration: 1,
          stagger: 0.1,
          delay: 0.6,
          ease: 'elastic.out(1, 0.5)'
        })

        // 基底环持续旋转
        baseRings.forEach((ring: HTMLElement, index: number) => {
          gsap.to(ring, {
            rotation: 360,
            duration: 20 + index * 5,
            repeat: -1,
            ease: 'none'
          })
        })
      }

      // 内容动画
      if (itemNumbers.length) {
        gsap.from(itemNumbers, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 60%',
            toggleActions: 'play none none reverse'
          },
          x: -30,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          delay: 0.8,
          ease: 'power3.out'
        })
      }

      if (itemTitles.length) {
        gsap.from(itemTitles, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 60%',
            toggleActions: 'play none none reverse'
          },
          y: 20,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          delay: 1,
          ease: 'power3.out'
        })
      }

      if (itemDescs.length) {
        gsap.from(itemDescs, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 60%',
            toggleActions: 'play none none reverse'
          },
          y: 20,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          delay: 1.2,
          ease: 'power3.out'
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
.shg-hologram-gallery-section-160 {
  min-height: 100vh;
  padding: 100px 20px;
  background: linear-gradient(180deg, #0a0a15 0%, #0f1520 50%, #0a0a15 100%);
  position: relative;
  overflow: hidden;
}

.shg-container-160 {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  z-index: 1;
}

.shg-title-160 {
  text-align: center;
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 900;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 30px rgba(6, 182, 212, 0.6));
}

.shg-subtitle-160 {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(6, 182, 212, 0.6);
  margin-bottom: 80px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  text-shadow: 0 0 10px rgba(6, 182, 212, 0.3);
}

.shg-hologram-stage-160 {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.shg-hologram-grid-160 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  height: 800px;
  pointer-events: none;
}

.shg-grid-line-160 {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 2px;
  height: 50%;
  background: linear-gradient(transparent, rgba(6, 182, 212, 0.2), transparent);
  transform-origin: top center;
  transform: rotate(var(--rotation));
}

.shg-grid-160 {
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 60px;
  z-index: 2;
  max-width: 1200px;
}

.shg-hologram-item-160 {
  position: relative;
  padding: 40px 30px;
  background: rgba(10, 15, 25, 0.8);
  border-radius: 20px;
  border: 1px solid rgba(6, 182, 212, 0.3);
  cursor: pointer;
  perspective: 1000px;
}

.shg-hologram-base-160 {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
}

.shg-base-circle-160 {
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  position: relative;
}

.shg-base-ring-160 {
  position: absolute;
  top: -20px;
  left: -20px;
  width: 140px;
  height: 140px;
  border: 2px solid rgba(6, 182, 212, 0.3);
  border-radius: 50%;
  border-style: dashed;
}

.shg-hologram-projector-160 {
  position: absolute;
  bottom: 120px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 0;
}

.shg-beam-160 {
  width: 2px;
  height: 200px;
  background: linear-gradient(transparent, rgba(6, 182, 212, 0.5));
  margin: 0 auto;
  opacity: 0.2;
  transform-origin: bottom center;
}

.shg-light-160 {
  width: 20px;
  height: 20px;
  background: radial-gradient(circle, rgba(6, 182, 212, 0.8) 0%, transparent 70%);
  border-radius: 50%;
  margin: 0 auto;
  filter: blur(5px);
}

.shg-hologram-image-160 {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 30px;
  transform-style: preserve-3d;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.shg-image-layer-160 {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
}

.shg-scanline-160 {
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(6, 182, 212, 0.1) 2px,
    rgba(6, 182, 212, 0.1) 4px
  );
  background-size: 100% 200%;
  pointer-events: none;
}

.shg-noise-160 {
  opacity: 0.3;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  pointer-events: none;
}

.shg-hologram-content-160 {
  position: relative;
  z-index: 2;
}

.shg-item-number-160 {
  position: absolute;
  top: -30px;
  left: 30px;
  font-size: 4rem;
  font-weight: 900;
  background: linear-gradient(135deg, #06b6d4, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  filter: drop-shadow(0 0 20px rgba(6, 182, 212, 0.5));
}

.shg-item-title-160 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.shg-item-desc-160 {
  font-size: 0.9rem;
  color: rgba(6, 182, 212, 0.8);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 20px;
}

.shg-hologram-status-160 {
  display: flex;
  align-items: center;
  gap: 8px;
}

.shg-status-dot-160 {
  width: 8px;
  height: 8px;
  background: #06b6d4;
  border-radius: 50%;
  animation: blink 1s ease-in-out infinite;
}

.shg-status-text-160 {
  font-size: 0.75rem;
  color: rgba(6, 182, 212, 0.8);
  font-weight: 600;
  letter-spacing: 0.2em;
}

@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

@media (max-width: 768px) {
  .shg-grid-160 {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .shg-item-number-160 {
    font-size: 3rem;
    top: -20px;
  }

  .shg-item-title-160 {
    font-size: 1.3rem;
  }
}
</style>
