<template>
  <div class="sib-image-blur-section-216" ref="componentRoot">
    <div class="sib-container-216">
      <h2 class="sib-title-216">模糊揭示</h2>
      <p class="sib-subtitle-216">Image Blur Reveal Effect</p>

      <!-- 模糊强度控制器 -->
      <div class="sib-blur-control-216">
        <label class="sib-control-label-216">初始模糊强度</label>
        <input
          type="range"
          min="10"
          max="40"
          v-model.number="blurIntensity"
          class="sib-range-slider-216"
        />
        <span class="sib-control-value-216">{{ blurIntensity }}px</span>
      </div>

      <!-- 主画廊 -->
      <div class="sib-blur-gallery-216">
        <div
          v-for="(item, index) in galleryItems"
          :key="index"
          class="sib-blur-item-216"
          ref="blurItems"
        >
          <div class="sib-blur-wrapper-216">
            <img :src="item.image" :alt="item.title" class="sib-blur-image-216" />
            <div class="sib-blur-overlay-216">
              <div class="sib-blur-content-216">
                <h3 class="sib-card-title-216">{{ item.title }}</h3>
                <p class="sib-card-desc-216">{{ item.desc }}</p>
                <div class="sib-blur-indicator-216">
                  <div class="sib-indicator-bar-216"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 渐进模糊效果 -->
      <div class="sib-progressive-section-216">
        <h3 class="sib-section-title-216">渐进模糊效果</h3>
        <div class="sib-progressive-gallery-216">
          <div class="sib-progressive-item-216" v-for="(item, index) in progressiveItems" :key="index">
            <div class="sib-progressive-wrapper-216">
              <img :src="item.image" :alt="item.title" class="sib-progressive-image-216" :data-blur="item.initialBlur" />
              <div class="sib-progressive-overlay-216">
                <div class="sib-progressive-info-216">
                  <span class="sib-progressive-blur-216">{{ item.initialBlur }}px</span>
                  <span class="sib-progressive-arrow-216">→</span>
                  <span class="sib-progressive-clear-216">0px</span>
                </div>
                <h4 class="sib-progressive-title-216">{{ item.title }}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 区域模糊 -->
      <div class="sib-regional-section-216">
        <h3 class="sib-section-title-216">区域模糊效果</h3>
        <div class="sib-regional-container-216">
          <div class="sib-regional-item-216">
            <div class="sib-regional-wrapper-216">
              <img
                src="https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800"
                alt="Regional Blur"
                class="sib-regional-image-216"
              />
              <div class="sib-regional-blur-layer-216"></div>
              <div class="sib-regional-clear-zone-216"></div>
              <div class="sib-regional-content-216">
                <h4 class="sib-regional-title-216">清晰区域</h4>
                <p class="sib-regional-desc-216">滚动查看区域模糊效果</p>
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
const blurItems = ref<HTMLElement[]>([])
const blurIntensity = ref(20)

interface GalleryItem {
  image: string
  title: string
  desc: string
}

const galleryItems = ref<GalleryItem[]>([
  {
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
    title: '雄伟山脉',
    desc: '从模糊到清晰的视觉旅程'
  },
  {
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
    title: '海滩宁静',
    desc: '随着滚动逐渐揭示细节'
  },
  {
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600',
    title: '森林深处',
    desc: '模糊中的清晰视野'
  },
  {
    image: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600',
    title: '日落时分',
    desc: '光影渐变的视觉效果'
  }
])

interface ProgressiveItem {
  image: string
  title: string
  initialBlur: number
}

const progressiveItems = ref<ProgressiveItem[]>([
  {
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400',
    title: '轻度模糊',
    initialBlur: 10
  },
  {
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400',
    title: '中度模糊',
    initialBlur: 20
  },
  {
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400',
    title: '重度模糊',
    initialBlur: 30
  },
  {
    image: 'https://images.unsplash.com/photo-1504198458649-3128b932f49e?w=400',
    title: '极度模糊',
    initialBlur: 40
  }
])

let ctx: gsap.Context

onMounted(() => {
  setTimeout(() => {
    if (!componentRoot.value) return
    ctx = gsap.context(() => {
      const titleEl = gsap.utils.toArray<HTMLElement>('.sib-title-216', componentRoot.value)
      const subtitleEl = gsap.utils.toArray<HTMLElement>('.sib-subtitle-216', componentRoot.value)
      const blurControl = gsap.utils.toArray<HTMLElement>('.sib-blur-control-216', componentRoot.value)
      const blurItems = gsap.utils.toArray<HTMLElement>('.sib-blur-item-216', componentRoot.value)
      const blurWrappers = gsap.utils.toArray<HTMLElement>('.sib-blur-wrapper-216', componentRoot.value)
      const blurImages = gsap.utils.toArray<HTMLElement>('.sib-blur-image-216', componentRoot.value)
      const overlays = gsap.utils.toArray<HTMLElement>('.sib-blur-overlay-216', componentRoot.value)
      const contents = gsap.utils.toArray<HTMLElement>('.sib-blur-content-216', componentRoot.value)
      const cardTitles = gsap.utils.toArray<HTMLElement>('.sib-card-title-216', componentRoot.value)
      const cardDescs = gsap.utils.toArray<HTMLElement>('.sib-card-desc-216', componentRoot.value)
      const indicators = gsap.utils.toArray<HTMLElement>('.sib-blur-indicator-216', componentRoot.value)
      const sectionTitles = gsap.utils.toArray<HTMLElement>('.sib-section-title-216', componentRoot.value)
      const progressiveItems = gsap.utils.toArray<HTMLElement>('.sib-progressive-item-216', componentRoot.value)
      const progressiveWrappers = gsap.utils.toArray<HTMLElement>('.sib-progressive-wrapper-216', componentRoot.value)
      const progressiveImages = gsap.utils.toArray<HTMLElement>('.sib-progressive-image-216', componentRoot.value)
      const progressiveOverlays = gsap.utils.toArray<HTMLElement>('.sib-progressive-overlay-216', componentRoot.value)
      const regionalItem = gsap.utils.toArray<HTMLElement>('.sib-regional-item-216', componentRoot.value)
      const regionalImage = gsap.utils.toArray<HTMLElement>('.sib-regional-image-216', componentRoot.value)
      const regionalBlurLayer = gsap.utils.toArray<HTMLElement>('.sib-regional-blur-layer-216', componentRoot.value)

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

      // 模糊控制器动画
      if (blurControl.length) {
        gsap.from(blurControl, {
          scrollTrigger: {
            trigger: '.sib-blur-control-216',
            start: 'top 90%'
          },
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out'
        })
      }

      // 主画廊卡片入场
      if (blurItems.length) {
        gsap.from(blurItems, {
          scrollTrigger: {
            trigger: '.sib-blur-gallery-216',
            start: 'top 90%'
          },
          y: 100,
          opacity: 0,
          scale: 0.9,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.2
        })
      }

      // 模糊揭示动画 - 主画廊
      if (blurWrappers.length) {
        blurWrappers.forEach((wrapper) => {
          gsap.fromTo(
            wrapper,
            {
              filter: `blur(${blurIntensity.value}px)`
            },
            {
              filter: 'blur(0px)',
              scrollTrigger: {
                trigger: wrapper,
                start: 'top 85%',
                end: 'top 30%',
                scrub: 1.5
              },
              ease: 'power2.inOut'
            }
          )
        })
      }

      // 图片缩放动画
      if (blurImages.length) {
        gsap.from(blurImages, {
          scrollTrigger: {
            trigger: '.sib-blur-gallery-216',
            start: 'top 85%'
          },
          scale: 1.15,
          duration: 1.5,
          ease: 'power2.out',
          stagger: 0.2
        })
      }

      // 遮罩层淡入
      if (overlays.length) {
        gsap.from(overlays, {
          scrollTrigger: {
            trigger: '.sib-blur-gallery-216',
            start: 'top 80%'
          },
          opacity: 0,
          duration: 0.6,
          delay: 0.3,
          ease: 'power2.out',
          stagger: 0.15
        })
      }

      // 内容淡入
      if (contents.length) {
        gsap.from(contents, {
          scrollTrigger: {
            trigger: '.sib-blur-gallery-216',
            start: 'top 75%'
          },
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.15
        })
      }

      // 标题动画
      if (cardTitles.length) {
        gsap.from(cardTitles, {
          scrollTrigger: {
            trigger: '.sib-blur-gallery-216',
            start: 'top 75%'
          },
          y: 20,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.15
        })
      }

      // 描述动画
      if (cardDescs.length) {
        gsap.from(cardDescs, {
          scrollTrigger: {
            trigger: '.sib-blur-gallery-216',
            start: 'top 70%'
          },
          y: 15,
          opacity: 0,
          duration: 0.8,
          delay: 0.1,
          ease: 'power3.out',
          stagger: 0.15
        })
      }

      // 进度条动画
      if (indicators.length) {
        indicators.forEach((indicator) => {
          const bar = indicator.querySelector('.sib-indicator-bar-216') as HTMLElement
          if (bar) {
            gsap.fromTo(
              bar,
              { width: '0%' },
              {
                width: '100%',
                scrollTrigger: {
                  trigger: indicator,
                  start: 'top 80%',
                  end: 'top 30%',
                  scrub: 1
                },
                ease: 'none'
              }
            )
          }
        })
      }

      // 渐进模糊区域
      if (sectionTitles.length) {
        sectionTitles.forEach((title) => {
          gsap.from(title, {
            scrollTrigger: {
              trigger: title.parentElement,
              start: 'top 85%'
            },
            y: 40,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
          })
        })
      }

      // 渐进模糊动画
      if (progressiveItems.length) {
        gsap.from(progressiveItems, {
          scrollTrigger: {
            trigger: '.sib-progressive-section-216',
            start: 'top 90%'
          },
          y: 80,
          opacity: 0,
          scale: 0.95,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.15
        })
      }

      if (progressiveImages.length) {
        progressiveImages.forEach((image) => {
          const initialBlur = parseInt(image.dataset.blur || '20')
          gsap.fromTo(
            image,
            { filter: `blur(${initialBlur}px)` },
            {
              filter: 'blur(0px)',
              scrollTrigger: {
                trigger: image,
                start: 'top 85%',
                end: 'top 30%',
                scrub: 1.5
              },
              ease: 'power2.inOut'
            }
          )
        })
      }

      if (progressiveOverlays.length) {
        gsap.from(progressiveOverlays, {
          scrollTrigger: {
            trigger: '.sib-progressive-section-216',
            start: 'top 85%'
          },
          opacity: 0,
          duration: 0.6,
          delay: 0.4,
          ease: 'power2.out',
          stagger: 0.1
        })
      }

      // 区域模糊效果
      if (regionalItem.length) {
        gsap.from(regionalItem, {
          scrollTrigger: {
            trigger: '.sib-regional-section-216',
            start: 'top 90%'
          },
          y: 100,
          opacity: 0,
          duration: 1,
          ease: 'power3.out'
        })
      }

      if (regionalBlurLayer.length) {
        gsap.fromTo(
          regionalBlurLayer,
          { opacity: 1, backdropFilter: 'blur(20px)' },
          {
            opacity: 0,
            backdropFilter: 'blur(0px)',
            scrollTrigger: {
              trigger: '.sib-regional-section-216',
              start: 'top 80%',
              end: 'top 30%',
              scrub: 1.5
            },
            ease: 'power2.inOut'
          }
        )
      }

    }, componentRoot.value)
  }, 100)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.sib-image-blur-section-216 {
  min-height: 100vh;
  padding: 100px 20px;
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
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
      radial-gradient(circle at 30% 70%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 70% 30%, rgba(240, 147, 251, 0.1) 0%, transparent 50%);
    pointer-events: none;
  
  opacity: 1 !important;}
}

.sib-container-216 {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.sib-title-216 {
  text-align: center;
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 900;
  color: #fff;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #667eea, #764ba2, #f093fb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  opacity: 1 !important;}

.sib-subtitle-216 {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 60px;
  letter-spacing: 0.2em;
  text-transform: uppercase;

  opacity: 1 !important;}

.sib-blur-control-216 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 60px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);

  opacity: 1 !important;}

.sib-control-label-216 {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 600;

  opacity: 1 !important;}

.sib-range-slider-216 {
  width: 200px;
  height: 6px;
  -webkit-appearance: none;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 50%;
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
      transform: scale(1.2);
    
  opacity: 1 !important;}
  }
}

.sib-control-value-216 {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 600;
  min-width: 50px;

  opacity: 1 !important;}

.sib-blur-gallery-216 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 40px;
  margin-bottom: 100px;
}

.sib-blur-item-216 { position: relative;
  height: 400px;
  perspective: 1000px;
      opacity: 1;
    }

.sib-blur-wrapper-216 {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  transition: all 0.4s ease;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 30px 80px rgba(102, 126, 234, 0.4);
  
  opacity: 1 !important;}
}

.sib-blur-image-216 {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;

  opacity: 1 !important;}

.sib-blur-wrapper-216:hover .sib-blur-image-216 {
  transform: scale(1.1);
}

.sib-blur-overlay-216 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, transparent 60%);
  display: flex;
  align-items: flex-end;
  padding: 30px;

  opacity: 1 !important;}

.sib-blur-content-216 {
  width: 100%;

  opacity: 1 !important;}

.sib-card-title-216 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 10px;
  letter-spacing: 0.05em;

  opacity: 1 !important;}

.sib-card-desc-216 {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
  margin-bottom: 20px;

  opacity: 1 !important;}

.sib-blur-indicator-216 {
  width: 100%;
  height: 3px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;

  opacity: 1 !important;}

.sib-indicator-bar-216 {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 2px;
  width: 0%;

  opacity: 1 !important;}

.sib-progressive-section-216,
.sib-regional-section-216 {
  padding-top: 80px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 60px;
}

.sib-section-title-216 {
  text-align: center;
  font-size: 1.8rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 50px;

  opacity: 1 !important;}

.sib-progressive-gallery-216 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 30px;
}

.sib-progressive-item-216 {
  height: 280px;
  position: relative;

  opacity: 1 !important;}

.sib-progressive-wrapper-216 {
  width: 100%;
  height: 100%;
  border-radius: 15px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
  transition: all 0.4s ease;

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 25px 60px rgba(240, 147, 251, 0.4);
  
  opacity: 1 !important;}
}

.sib-progressive-image-216 {
  width: 100%;
  height: 100%;
  object-fit: cover;

  opacity: 1 !important;}

.sib-progressive-overlay-216 {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.95), transparent);

  opacity: 1 !important;}

.sib-progressive-info-216 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 10px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 600;

  opacity: 1 !important;}

.sib-progressive-blur-216 {
  color: rgba(102, 126, 234, 0.8);

  opacity: 1 !important;}

.sib-progressive-clear-216 {
  color: #4ade80;

  opacity: 1 !important;}

.sib-progressive-arrow-216 {
  color: rgba(255, 255, 255, 0.5);

  opacity: 1 !important;}

.sib-progressive-title-216 {
  text-align: center;
  font-size: 1.2rem;
  font-weight: 600;
  color: #fff;

  opacity: 1 !important;}

.sib-regional-container-216 {
  display: flex;
  justify-content: center;
}

.sib-regional-item-216 {
  max-width: 800px;
  width: 100%;
  height: 500px;
  position: relative;

  opacity: 1 !important;}

.sib-regional-wrapper-216 {
  width: 100%;
  height: 100%;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.4);

  opacity: 1 !important;}

.sib-regional-image-216 {
  width: 100%;
  height: 100%;
  object-fit: cover;

  opacity: 1 !important;}

.sib-regional-blur-layer-216 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px);
  transition: all 0.4s ease;

  opacity: 1 !important;}

.sib-regional-clear-zone-216 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  background: transparent;
  border-radius: 50%;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;

  opacity: 1 !important;}

.sib-regional-content-216 {
  text-align: center;
  padding: 20px;

  opacity: 1 !important;}

.sib-regional-title-216 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 10px;

  opacity: 1 !important;}

.sib-regional-desc-216 {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);

  opacity: 1 !important;}

@media (max-width: 768px) {
  .sib-blur-gallery-216 {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .sib-progressive-gallery-216 {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  .sib-blur-control-216 {
    flex-wrap: wrap;
    gap: 15px;
  }

  .sib-range-slider-216 {
    width: 100%;
  
  opacity: 1 !important;}

  .sib-regional-item-216 {
    height: 350px;
  
  opacity: 1 !important;}

  .sib-regional-clear-zone-216 {
    width: 150px;
    height: 150px;
  
  opacity: 1 !important;}
}

@media (max-width: 480px) {
  .sib-progressive-gallery-216 {
    grid-template-columns: 1fr;
  }
}
</style>
