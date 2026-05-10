<template>
  <div class="sic-image-clip-section-215" ref="componentRoot">
    <div class="sic-container-215">
      <h2 class="sic-title-215">图片裁剪</h2>
      <p class="sic-subtitle-215">Image Clip Reveal Effect</p>

      <!-- 形状选择器 -->
      <div class="sic-shape-selector-215">
        <button
          v-for="shape in shapes"
          :key="shape.type"
          class="sic-shape-btn-215"
          :class="{ 'sic-active-215': currentShape === shape.type }"
          @click="setShape(shape.type)"
        >
          {{ shape.name }}
        </button>
      </div>

      <div class="sic-clip-gallery-215">
        <div
          v-for="(item, index) in galleryItems"
          :key="index"
          class="sic-clip-item-215"
          ref="clipItems"
        >
          <div class="sic-image-wrapper-215" :class="`sic-shape-${currentShape}-215`">
            <img :src="item.image" :alt="item.title" class="sic-image-215" />
            <div class="sic-overlay-215">
              <div class="sic-content-215">
                <h3 class="sic-card-title-215">{{ item.title }}</h3>
                <p class="sic-card-desc-215">{{ item.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 自定义裁剪展示 -->
      <div class="sic-custom-section-215">
        <h3 class="sic-section-title-215">自定义形状裁剪</h3>
        <div class="sic-custom-grid-215">
          <div class="sic-custom-item-215" v-for="(custom, index) in customShapes" :key="index">
            <div
              class="sic-custom-wrapper-215"
              :style="{ clipPath: custom.clipPath }"
            >
              <img :src="custom.image" :alt="custom.name" class="sic-custom-image-215" />
              <div class="sic-custom-overlay-215">
                <span class="sic-custom-name-215">{{ custom.name }}</span>
              </div>
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

const componentRoot = ref<HTMLElement>()
const clipItems = ref<HTMLElement[]>([])

const currentShape = ref<'circle' | 'square' | 'polygon' | 'star'>('circle')

interface Shape {
  type: 'circle' | 'square' | 'polygon' | 'star'
  name: string
}

const shapes: Shape[] = [
  { type: 'circle', name: '圆形' },
  { type: 'square', name: '方形' },
  { type: 'polygon', name: '多边形' },
  { type: 'star', name: '星形' }
]

interface GalleryItem {
  image: string
  title: string
  desc: string
}

const galleryItems = ref<GalleryItem[]>([
  {
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
    title: '山脉风景',
    desc: '雄伟的山脉景观'
  },
  {
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
    title: '海浪海滩',
    desc: '平静的海滩风光'
  },
  {
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600',
    title: '森林深处',
    desc: '神秘的森林角落'
  },
  {
    image: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600',
    title: '日落时光',
    desc: '美丽的日落景色'
  }
])

interface CustomShape {
  name: string
  clipPath: string
  image: string
}

const customShapes = ref<CustomShape[]>([
  {
    name: '菱形',
    clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400'
  },
  {
    name: '三角形',
    clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400'
  },
  {
    name: '六边形',
    clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400'
  },
  {
    name: '箭头',
    clipPath: 'polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)',
    image: 'https://images.unsplash.com/photo-1504198458649-3128b932f49e?w=400'
  }
])

const setShape = (shape: 'circle' | 'square' | 'polygon' | 'star') => {
  currentShape.value = shape
}

let ctx: gsap.Context

onMounted(() => {
  setTimeout(() => {
    if (!componentRoot.value) return
    ctx = gsap.context(() => {
      const titleEl = gsap.utils.toArray<HTMLElement>('.sic-title-215', componentRoot.value)
      const subtitleEl = gsap.utils.toArray<HTMLElement>('.sic-subtitle-215', componentRoot.value)
      const shapeBtns = gsap.utils.toArray<HTMLElement>('.sic-shape-btn-215', componentRoot.value)
      const clipItems = gsap.utils.toArray<HTMLElement>('.sic-clip-item-215', componentRoot.value)
      const imageWrappers = gsap.utils.toArray<HTMLElement>('.sic-image-wrapper-215', componentRoot.value)
      const images = gsap.utils.toArray<HTMLElement>('.sic-image-215', componentRoot.value)
      const overlays = gsap.utils.toArray<HTMLElement>('.sic-overlay-215', componentRoot.value)
      const sectionTitle = gsap.utils.toArray<HTMLElement>('.sic-section-title-215', componentRoot.value)
      const customItems = gsap.utils.toArray<HTMLElement>('.sic-custom-item-215', componentRoot.value)
      const customWrappers = gsap.utils.toArray<HTMLElement>('.sic-custom-wrapper-215', componentRoot.value)

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

      // 形状选择器动画
      if (shapeBtns.length) {
        gsap.from(shapeBtns, {
          scrollTrigger: {
            trigger: '.sic-shape-selector-215',
            start: 'top 90%'
          },
          y: 30,
          opacity: 0,
          scale: 0.9,
          duration: 0.6,
          ease: 'back.out(1.5)',
          stagger: 0.1
        })
      }

      // 图片裁剪动画 - 主要画廊
      if (imageWrappers.length && clipItems.length) {
        // 初始状态：裁剪为0
        gsap.set(imageWrappers, {
          clipPath: 'circle(0% at 50% 50%)'
        })

        // 裁剪揭示动画
        imageWrappers.forEach((wrapper, index) => {
          const clipValues: Record<string, string> = {
            circle: 'circle(50% at 50% 50%)',
            square: 'inset(0% 0% 0% 0%)',
            polygon: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
            star: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
          }

          gsap.to(wrapper, {
            clipPath: clipValues[currentShape.value],
            scrollTrigger: {
              trigger: clipItems[index],
              start: 'top 85%',
              end: 'top 50%',
              scrub: 1
            },
            ease: 'power2.inOut',
            duration: 1
          })
        })

        // 卡片入场动画
        gsap.from(clipItems, {
          scrollTrigger: {
            trigger: '.sic-clip-gallery-215',
            start: 'top 90%'
          },
          y: 100,
          opacity: 0,
          scale: 0.8,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.2
        })
      }

      // 图片淡入
      if (images.length) {
        gsap.from(images, {
          scrollTrigger: {
            trigger: '.sic-clip-gallery-215',
            start: 'top 85%'
          },
          scale: 1.1,
          duration: 1.5,
          ease: 'power2.out',
          stagger: 0.2
        })
      }

      // 遮罩层淡入
      if (overlays.length) {
        gsap.from(overlays, {
          scrollTrigger: {
            trigger: '.sic-clip-gallery-215',
            start: 'top 80%'
          },
          opacity: 0,
          duration: 0.8,
          delay: 0.5,
          ease: 'power2.out',
          stagger: 0.15
        })
      }

      // 自定义形状区域
      if (sectionTitle.length) {
        gsap.from(sectionTitle, {
          scrollTrigger: {
            trigger: '.sic-custom-section-215',
            start: 'top 85%'
          },
          y: 40,
          opacity: 0,
          duration: 1,
          ease: 'power3.out'
        })
      }

      if (customItems.length) {
        gsap.from(customItems, {
          scrollTrigger: {
            trigger: '.sic-custom-section-215',
            start: 'top 90%'
          },
          y: 80,
          opacity: 0,
          rotation: -10,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.15
        })
      }

      // 自定义裁剪动画
      if (customWrappers.length) {
        customWrappers.forEach((wrapper) => {
          const originalClipPath = wrapper.style.clipPath

          gsap.fromTo(
            wrapper,
            { clipPath: 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%)' },
            {
              clipPath: originalClipPath,
              scrollTrigger: {
                trigger: wrapper,
                start: 'top 85%',
                end: 'top 50%',
                scrub: 1
              },
              ease: 'power2.inOut'
            }
          )
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
.sic-image-clip-section-215 {
  min-height: 100vh;
  padding: 100px 20px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
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
      radial-gradient(circle at 20% 20%, rgba(229, 62, 62, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(15, 52, 96, 0.15) 0%, transparent 50%);
    pointer-events: none;
  
  opacity: 1 !important;}
}

.sic-container-215 {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.sic-title-215 {
  text-align: center;
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 900;
  color: #fff;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #e53e3e, #ed8936, #e53e3e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  opacity: 1 !important;}

.sic-subtitle-215 {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 60px;
  letter-spacing: 0.2em;
  text-transform: uppercase;

  opacity: 1 !important;}

.sic-shape-selector-215 {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 60px;
}

.sic-shape-btn-215 {
  padding: 12px 28px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 30px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  
  opacity: 1 !important;}

  &.sic-active-215 {
    background: linear-gradient(135deg, #e53e3e, #ed8936);
    border-color: transparent;
    color: #fff;
    box-shadow: 0 8px 25px rgba(229, 62, 62, 0.3);
  
  opacity: 1 !important;}
}

.sic-clip-gallery-215 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 40px;
  margin-bottom: 100px;
}

.sic-clip-item-215 {
  position: relative;
  height: 400px;
  perspective: 1000px;

  opacity: 1 !important;}

.sic-image-wrapper-215 {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  transition: all 0.5s ease;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);

  &:hover {
    transform: translateY(-10px) scale(1.05);
    box-shadow: 0 30px 80px rgba(229, 62, 62, 0.4);
  
  opacity: 1 !important;}

  &.sic-shape-circle-215 {
    border-radius: 50%;
  }

  &.sic-shape-square-215 {
    border-radius: 20px;
  }

  &.sic-shape-polygon-215 {
    border-radius: 30px;
  }

  &.sic-shape-star-215 {
    border-radius: 30px;
  }
}

.sic-image-215 {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;

  opacity: 1 !important;}

.sic-image-wrapper-215:hover .sic-image-215 {
  transform: scale(1.1);
}

.sic-overlay-215 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 50%);
  display: flex;
  align-items: flex-end;
  padding: 30px;
  pointer-events: none;

  opacity: 1 !important;}

.sic-content-215 {
  text-align: center;
  width: 100%;

  opacity: 1 !important;}

.sic-card-title-215 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 10px;
  letter-spacing: 0.05em;

  opacity: 1 !important;}

.sic-card-desc-215 {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;

  opacity: 1 !important;}

.sic-custom-section-215 {
  padding-top: 80px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.sic-section-title-215 {
  text-align: center;
  font-size: 1.8rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 50px;

  opacity: 1 !important;}

.sic-custom-grid-215 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.sic-custom-item-215 {
  height: 300px;
  position: relative;

  opacity: 1 !important;}

.sic-custom-wrapper-215 {
  width: 100%;
  height: 100%;
  overflow: hidden;
  transition: all 0.4s ease;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);

  &:hover {
    transform: translateY(-8px) rotateY(5deg);
    box-shadow: 0 25px 60px rgba(229, 62, 62, 0.4);
  
  opacity: 1 !important;}
}

.sic-custom-image-215 {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;

  opacity: 1 !important;}

.sic-custom-wrapper-215:hover .sic-custom-image-215 {
  transform: scale(1.15);
}

.sic-custom-overlay-215 {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);

  opacity: 1 !important;}

.sic-custom-name-215 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
  text-align: center;

  opacity: 1 !important;}

@media (max-width: 768px) {
  .sic-clip-gallery-215 {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .sic-shape-selector-215 {
    flex-wrap: wrap;
    gap: 10px;
  }

  .sic-shape-btn-215 {
    padding: 10px 20px;
    font-size: 0.85rem;
  
  opacity: 1 !important;}

  .sic-custom-grid-215 {
    grid-template-columns: 1fr;
  }

  .sic-clip-item-215 {
    height: 350px;
  
  opacity: 1 !important;}
}
</style>
