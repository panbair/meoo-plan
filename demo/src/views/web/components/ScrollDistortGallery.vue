<template>
  <div class="sdg-distort-gallery-section-151" ref="componentRoot">
    <div class="sdg-container-151">
      <h2 class="sdg-title-151">扭曲画廊</h2>
      <p class="sdg-subtitle-151">Distort Gallery Effect</p>

      <div class="sdg-gallery-151">
        <div
          v-for="(item, index) in galleryItems"
          :key="index"
          class="sdg-item-151"
          @mousemove="handleDistort($event, index)"
          @mouseleave="handleReset(index)"
        >
          <div class="sdg-image-wrapper-151">
            <div class="sdg-image-151" :style="{ backgroundImage: `url(${item.image})` }">
              <div class="sdg-distortion-layer-151"></div>
            </div>
          </div>
          <div class="sdg-info-151">
            <h3 class="sdg-item-title-151">{{ item.title }}</h3>
            <p class="sdg-item-desc-151">{{ item.description }}</p>
          </div>
        </div>
      </div>

      <div class="sdg-noise-overlay-151"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const componentRoot = ref<HTMLElement>()

interface GalleryItem {
  image: string
  title: string
  description: string
}

const galleryItems = ref<GalleryItem[]>([
  {
    image: new URL('@/assets/image/1.png', import.meta.url).href,
    title: '幻境',
    description: '超越现实的视觉体验'
  },
  {
    image: new URL('@/assets/image/2.png', import.meta.url).href,
    title: '梦境',
    description: '探索内心的无限想象'
  },
  {
    image: new URL('@/assets/image/3.png', import.meta.url).href,
    title: '奇境',
    description: '发现未知的奇妙世界'
  },
  {
    image: new URL('@/assets/image/4.png', import.meta.url).href,
    title: '仙境',
    description: '沉浸于梦幻般的美景'
  }
])

const handleDistort = (event: MouseEvent, index: number) => {
  const item = event.currentTarget as HTMLElement
  const image = item.querySelector('.sdg-image-151') as HTMLElement
  const distortionLayer = item.querySelector('.sdg-distortion-layer-151') as HTMLElement

  const rect = item.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  const centerX = rect.width / 2
  const centerY = rect.height / 2

  const deltaX = (x - centerX) / centerX
  const deltaY = (y - centerY) / centerY

  // 扭曲效果
  gsap.to(image, {
    scale: 1.05,
    skewX: deltaX * 10,
    skewY: deltaY * 10,
    rotationX: -deltaY * 15,
    rotationY: deltaX * 15,
    duration: 0.5,
    ease: 'power2.out'
  })

  // 扭曲层效果
  gsap.to(distortionLayer, {
    opacity: 0.6,
    scale: 1.1,
    duration: 0.3,
    ease: 'power2.out'
  })

  // 图片位置跟随
  const imageInner = image.querySelector('::before') as HTMLElement
  gsap.to(image, {
    backgroundPosition: `${50 + deltaX * 10}% ${50 + deltaY * 10}%`,
    duration: 0.5,
    ease: 'power2.out'
  })
}

const handleReset = (index: number) => {
  const items = document.querySelectorAll('.sdg-item-151')
  const item = items[index] as HTMLElement
  const image = item.querySelector('.sdg-image-151') as HTMLElement
  const distortionLayer = item.querySelector('.sdg-distortion-layer-151') as HTMLElement

  gsap.to(image, {
    scale: 1,
    skewX: 0,
    skewY: 0,
    rotationX: 0,
    rotationY: 0,
    backgroundPosition: '50% 50%',
    duration: 0.5,
    ease: 'power2.out'
  })

  gsap.to(distortionLayer, {
    opacity: 0,
    scale: 1,
    duration: 0.3,
    ease: 'power2.out'
  })
}

let ctx: gsap.Context

onMounted(() => {
  setTimeout(() => {
    if (!componentRoot.value) return
    ctx = gsap.context(() => {
      const titleEl = gsap.utils.toArray<HTMLElement>('.sdg-title-151', componentRoot.value)
      const subtitleEl = gsap.utils.toArray<HTMLElement>('.sdg-subtitle-151', componentRoot.value)
      const itemsEl = gsap.utils.toArray<HTMLElement>('.sdg-item-151', componentRoot.value)
      const gallery = gsap.utils.toArray<HTMLElement>('.sdg-gallery-151', componentRoot.value)
      const imagesEl = gsap.utils.toArray<HTMLElement>('.sdg-image-151', componentRoot.value)
      const itemTitles = gsap.utils.toArray<HTMLElement>('.sdg-item-title-151', componentRoot.value)
      const itemDescs = gsap.utils.toArray<HTMLElement>('.sdg-item-desc-151', componentRoot.value)
      const distortionLayers = gsap.utils.toArray<HTMLElement>('.sdg-distortion-layer-151', componentRoot.value)

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

      // 画廊项目入场
      if (itemsEl.length && gallery.length) {
        gsap.from(itemsEl, {
          scrollTrigger: {
            trigger: gallery[0],
            start: 'top 85%'
          },
          y: 150,
          opacity: 0,
          scale: 0.8,
          rotationX: -30,
          duration: 1.2,
          ease: 'back.out(1.5)',
          stagger: 0.2
        })

        // 视差效果
        gsap.to(itemsEl, {
          y: (i) => (i % 2 === 0 ? -40 : 40),
          scrollTrigger: {
            trigger: gallery[0],
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          }
        })
      }

      // 图片缩放入场
      if (imagesEl.length) {
        gsap.from(imagesEl, {
          scrollTrigger: {
            trigger: gallery[0] || componentRoot.value,
            start: 'top 80%'
          },
          scale: 1.3,
          opacity: 0,
          duration: 1,
          ease: 'power2.out',
          stagger: 0.15
        })
      }

      // 信息文字淡入
      if (itemTitles.length) {
        gsap.from(itemTitles, {
          scrollTrigger: {
            trigger: gallery[0] || componentRoot.value,
            start: 'top 75%'
          },
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.15
        })
      }

      if (itemDescs.length) {
        gsap.from(itemDescs, {
          scrollTrigger: {
            trigger: gallery[0] || componentRoot.value,
            start: 'top 75%'
          },
          y: 20,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.15,
          delay: 0.1
        })
      }

      // 扭曲层初始动画
      if (distortionLayers.length) {
        gsap.from(distortionLayers, {
          scrollTrigger: {
            trigger: gallery[0] || componentRoot.value,
            start: 'top 85%'
          },
          scale: 2,
          opacity: 0,
          duration: 1.5,
          ease: 'power2.out',
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
.sdg-distort-gallery-section-151 {
  min-height: 100vh;
  padding: 100px 20px;
  background: linear-gradient(135deg, #1a0a2e 0%, #16213e 50%, #0f3460 100%);
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
      radial-gradient(circle at 20% 30%, rgba(236, 72, 153, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(168, 85, 247, 0.1) 0%, transparent 50%);
    pointer-events: none;
  
  opacity: 1 !important;}
}

.sdg-container-151 {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.sdg-title-151 {
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

.sdg-subtitle-151 {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 80px;
  letter-spacing: 0.2em;
  text-transform: uppercase;

  opacity: 1 !important;}

.sdg-gallery-151 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 40px;
  perspective: 2000px;
}

.sdg-item-151 {
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: box-shadow 0.3s ease;
  transform-style: preserve-3d;

  &:hover {
    box-shadow: 0 25px 70px rgba(236, 72, 153, 0.25);
  
  opacity: 1 !important;}
}

.sdg-image-wrapper-151 {
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  margin-bottom: 24px;
}

.sdg-image-151 {
  width: 100%;
  height: 350px;
  background-size: cover;
  background-position: center;
  position: relative;
  transition: all 0.5s ease;
  transform-style: preserve-3d;

  opacity: 1 !important;}

.sdg-distortion-layer-151 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    linear-gradient(45deg, rgba(236, 72, 153, 0.3) 0%, transparent 50%),
    linear-gradient(-45deg, rgba(168, 85, 247, 0.3) 0%, transparent 50%),
    radial-gradient(circle at center, rgba(96, 165, 250, 0.2) 0%, transparent 70%);
  mix-blend-mode: overlay;
  opacity: 0;
  transition: all 0.3s ease;
  pointer-events: none;
}

.sdg-info-151 {
  padding: 0 24px 24px;

  opacity: 1 !important;}

.sdg-item-title-151 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 12px;
  letter-spacing: 0.05em;

  opacity: 1 !important;}

.sdg-item-desc-151 {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;

  opacity: 1 !important;}

.sdg-noise-overlay-151 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  opacity: 0.03;
  background-image: url('data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)"/%3E%3C/svg%3E');
  animation: noise 0.5s steps(1) infinite;
}

@keyframes noise {
  0%, 100% {
    transform: translate(0, 0);
  }
  10% {
    transform: translate(-5%, -5%);
  }
  20% {
    transform: translate(-10%, 5%);
  }
  30% {
    transform: translate(5%, -10%);
  }
  40% {
    transform: translate(-5%, 15%);
  }
  50% {
    transform: translate(-10%, 5%);
  }
  60% {
    transform: translate(15%, 0);
  }
  70% {
    transform: translate(0, 10%);
  }
  80% {
    transform: translate(-15%, 0);
  }
  90% {
    transform: translate(10%, 5%);
  }
}

@media (max-width: 768px) {
  .sdg-gallery-151 {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .sdg-image-151 {
    height: 280px;
  
  opacity: 1 !important;}

  .sdg-item-title-151 {
    font-size: 1.5rem;
  
  opacity: 1 !important;}
}
</style>
