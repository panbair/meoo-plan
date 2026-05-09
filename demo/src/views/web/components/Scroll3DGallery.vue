<template>
  <section class="s3d-scroll-3d-gallery-123">
    <div class="s3d-container-123">
      <h2 class="s3d-section-title-123">3D 滚动画廊</h2>
      <p class="s3d-section-subtitle-123">3D Scroll Gallery</p>

      <div class="s3d-gallery-wrapper-123" ref="galleryWrapper">
        <div class="s3d-gallery-123" ref="gallery">
          <div
            v-for="(item, index) in galleryItems"
            :key="index"
            class="s3d-item-123"
            :ref="el => { if (el) itemRefs[index] = el as HTMLElement }"
            :style="getItemStyle(index)"
          >
            <div class="s3d-card-123">
              <div class="s3d-card-inner-123">
                <div class="s3d-card-front-123">
                  <img :src="item.image" :alt="item.title" />
                  <div class="s3d-card-overlay-123">
                    <h3 class="s3d-card-title-123">{{ item.title }}</h3>
                    <p class="s3d-card-desc-123">{{ item.desc }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 滚动提示 -->
      <div class="s3d-scroll-hint-123">
        <div class="s3d-hint-text-123">向下滚动探索</div>
        <div class="s3d-hint-arrow-123"></div>
      </div>

      <!-- 导航控制 -->
      <div class="s3d-navigation-123">
        <button class="s3d-nav-btn-123" @click="prevSlide">←</button>
        <div class="s3d-indicators-123">
          <span
            v-for="(item, index) in galleryItems"
            :key="index"
            :class="['s3d-indicator-123', { 's3d-active-123': currentIndex === index }]"
            @click="goToSlide(index)"
          ></span>
        </div>
        <button class="s3d-nav-btn-123" @click="nextSlide">→</button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const galleryWrapper = ref<HTMLElement>()
const gallery = ref<HTMLElement>()
const itemRefs = ref<HTMLElement[]>([])
const currentIndex = ref(0)

const galleryItems = [
  {
    title: '创新',
    desc: '突破传统，引领未来',
    image: new URL('@/assets/image/1.png', import.meta.url).href
  },
  {
    title: '设计',
    desc: '精致美学，完美呈现',
    image: new URL('@/assets/image/2.png', import.meta.url).href
  },
  {
    title: '技术',
    desc: '前沿科技，极致性能',
    image: new URL('@/assets/image/3.png', import.meta.url).href
  },
  {
    title: '体验',
    desc: '流畅交互，愉悦感受',
    image: new URL('@/assets/image/4.png', import.meta.url).href
  },
  {
    title: '品质',
    desc: '精益求精，追求卓越',
    image: new URL('@/assets/image/5.png', import.meta.url).href
  }
]

const getItemStyle = (index: number) => {
  const offset = index - currentIndex.value
  const absOffset = Math.abs(offset)

  let scale = 1 - absOffset * 0.15
  scale = Math.max(0.6, scale)

  let opacity = 1 - absOffset * 0.3
  opacity = Math.max(0.2, opacity)

  const z = -absOffset * 200
  const rotateY = offset * 25

  return {
    transform: `translateZ(${z}px) rotateY(${rotateY}deg) scale(${scale})`,
    opacity,
    zIndex: 100 - absOffset
  }
}

const prevSlide = () => {
  gsap.to(
    {},
    {
      duration: 0.3,
      onComplete: () => {
        currentIndex.value = (currentIndex.value - 1 + galleryItems.length) % galleryItems.length
      }
    }
  )
}

const nextSlide = () => {
  gsap.to(
    {},
    {
      duration: 0.3,
      onComplete: () => {
        currentIndex.value = (currentIndex.value + 1) % galleryItems.length
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
        currentIndex.value = index
      }
    }
  )
}

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 标题动画
    gsap.from('.s3d-section-title-123', {
      scrollTrigger: {
        trigger: '.s3d-scroll-3d-gallery-123',
        start: 'top 90%'
      },
      y: 100,
      opacity: 0,
      rotationX: 45,
      duration: 1.2,
      ease: 'power3.out'
    })

    gsap.from('.s3d-section-subtitle-123', {
      scrollTrigger: {
        trigger: '.s3d-scroll-3d-gallery-123',
        start: 'top 85%'
      },
      y: 50,
      opacity: 0,
      duration: 1,
      delay: 0.2,
      ease: 'power3.out'
    })

    // 画廊整体旋转效果
    gsap.fromTo('.s3d-gallery-123',
      { rotateY: -15, scale: 0.9 },
      {
        scrollTrigger: {
          trigger: '.s3d-scroll-3d-gallery-123',
          start: 'top 85%',
          end: 'bottom 15%',
          scrub: 1
        },
        rotateY: 15,
        scale: 1,
        ease: 'power1.inOut'
      }
    )

    // 画廊入场动画 - 使用nextTick确保ref已绑定
    setTimeout(() => {
      gsap.from('.s3d-item-123', {
        scrollTrigger: {
          trigger: '.s3d-gallery-123',
          start: 'top 80%'
        },
        scale: 0,
        opacity: 0,
        rotationY: 180,
        duration: 1,
        ease: 'back.out(1.7)',
        stagger: 0.15
      })
    }, 100)

    // 滚动控制 3D 旋转 - 扩大触发范围
    gsap.to(
      {},
      {
        scrollTrigger: {
          trigger: '.s3d-scroll-3d-gallery-123',
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 0.8,
          onUpdate: self => {
            const progress = self.progress
            const newIndex = Math.floor(progress * galleryItems.length)
            if (newIndex >= 0 && newIndex < galleryItems.length) {
              currentIndex.value = newIndex
            }
          }
        }
      }
    )

    // 滚动提示动画
    gsap.from('.s3d-scroll-hint-123', {
      scrollTrigger: {
        trigger: '.s3d-gallery-123',
        start: 'top 95%',
        end: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out'
    })

    // 提示箭头动画
    gsap.to('.s3d-hint-arrow-123', {
      y: 10,
      duration: 0.8,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1
    })

    // 导航按钮动画
    gsap.from('.s3d-nav-btn-123', {
      scrollTrigger: {
        trigger: '.s3d-navigation-123',
        start: 'top 90%'
      },
      scale: 0,
      rotation: -180,
      duration: 0.6,
      ease: 'back.out(1.7)',
      stagger: 0.2
    })

    // 指示器动画
    gsap.from('.s3d-indicator-123', {
      scrollTrigger: {
        trigger: '.s3d-navigation-123',
        start: 'top 85%'
      },
      scale: 0,
      opacity: 0,
      duration: 0.5,
      ease: 'back.out(1.5)',
      stagger: 0.1
    })

    // 延迟绑定悬停效果，确保refs已填充
    setTimeout(() => {
      itemRefs.value.forEach((item, index) => {
        const card = item?.querySelector('.s3d-card-123') as HTMLElement
        if (!card) return

        item.addEventListener('mouseenter', () => {
          gsap.to(card, {
            y: -20,
            scale: 1.05,
            duration: 0.5,
            ease: 'power2.out'
          })
        })

        item.addEventListener('mouseleave', () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            duration: 0.5,
            ease: 'power2.out'
          })
        })
      })
    }, 200)
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.s3d-scroll-3d-gallery-123 {
  min-height: 100vh;
  padding: 100px 0;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 50%, #0f0f2a 100%);
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
      radial-gradient(circle at 50% 50%, rgba(167, 139, 250, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 30% 70%, rgba(240, 147, 251, 0.05) 0%, transparent 50%);
    pointer-events: none;
  
  opacity: 1 !important;}
}

.s3d-container-123 {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.s3d-section-title-123 {
  text-align: center;
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 800;
  color: #fff;
  margin-bottom: 80px;
  background: linear-gradient(135deg, #a78bfa, #f472b6, #60a5fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 40px rgba(167, 139, 250, 0.5);

  &::after {
    content: '';
    display: block;
    width: 120px;
    height: 4px;
    background: linear-gradient(90deg, #a78bfa, #f472b6, #60a5fa);
    margin: 24px auto 0;
    border-radius: 2px;
  
  opacity: 1 !important;}
}

.s3d-gallery-wrapper-123 {
  height: 600px;
  perspective: 2000px;
  position: relative;

  opacity: 1 !important;}

.s3d-gallery-123 {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  display: flex;
  align-items: center;
  justify-content: center;

  opacity: 1 !important;}

.s3d-item-123 {
  position: absolute;
  width: 320px;
  height: 450px;
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  will-change: transform, opacity;

  opacity: 1 !important;}

.s3d-card-123 {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  cursor: pointer;

  opacity: 1 !important;}

.s3d-card-inner-123 {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s;

  opacity: 1 !important;}

.s3d-card-front-123 {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.4);
  background: linear-gradient(135deg, #1a1a3a 0%, #0f0f2a 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);

  opacity: 1 !important;}

img {
  width: 100%;
  height: 60%;
  object-fit: cover;
  display: block;
}

.s3d-card-overlay-123 {
  position: absolute;
  top: 60%;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.4) 40%, transparent 70%);
  padding: 30px 20px 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  text-align: center;

  opacity: 1 !important;}

.s3d-card-title-123 {
  font-size: 1.8rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #a78bfa, #60a5fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  opacity: 1 !important;}

.s3d-card-desc-123 {
  font-size: 0.95rem;
  color: #cbd5e1;
  line-height: 1.6;

  opacity: 1 !important;}

.s3d-scroll-hint-123 {
  position: absolute;
  bottom: 140px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  z-index: 10;
}

.s3d-hint-text-123 {
  font-size: 0.9rem;
  color: #94a3b8;
  font-weight: 500;

  opacity: 1 !important;}

.s3d-hint-arrow-123 {
  width: 24px;
  height: 24px;
  border-right: 3px solid rgba(167, 139, 250, 0.6);
  border-bottom: 3px solid rgba(167, 139, 250, 0.6);
  transform: rotate(45deg);

  opacity: 1 !important;}

.s3d-navigation-123 {
  margin-top: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
}

.s3d-nav-btn-123 {
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
    background: rgba(167, 139, 250, 0.8);
    border-color: #a78bfa;
    transform: scale(1.1);
  
  opacity: 1 !important;}
}

.s3d-indicators-123 {
  display: flex;
  gap: 12px;
}

.s3d-indicator-123 {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.4);
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;

  &.s3d-active-123 {
    background: linear-gradient(135deg, #a78bfa, #60a5fa);
    border-color: transparent;
    transform: scale(1.3);
  
  opacity: 1 !important;}

  &:hover {
    transform: scale(1.2);
    border-color: #a78bfa;
  }
}

@media (max-width: 768px) {
  .s3d-gallery-wrapper-123 {
    height: 500px;
  
  opacity: 1 !important;}

  .s3d-item-123 {
    width: 260px;
    height: 380px;
  
  opacity: 1 !important;}

  .s3d-section-title-123 {
    margin-bottom: 60px;
  }
}
</style>
