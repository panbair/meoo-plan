<template>
  <div ref="parentRef" class="folded-fan-container">
    <!-- 深色展台背景 -->
    <div class="fan-stage-bg">
      <div class="stage-gradient" />
      <div class="stage-particles" />
    </div>

    <!-- 顶部装饰 -->
    <div ref="headerRef" class="fan-header">
      <span class="header-line" />
      <span class="header-text">GALLERY SCREEN</span>
      <span class="header-line" />
    </div>

    <!-- 折扇画廊容器 -->
    <div ref="galleryRef" class="fan-gallery">
      <!-- 折扇图片组 -->
      <div
        v-for="(img, index) in galleryImages"
        :key="img.id"
        :ref="el => setFanCardRef(el, index)"
        class="fan-card"
      >
        <div class="fan-card-inner">
          <img :src="img.url" :alt="img.title" class="fan-image" />
          <div class="fan-highlight" />
        </div>
        <div class="fan-spine" />
      </div>

      <!-- 底部公共阴影 -->
      <div ref="shadowRef" class="fan-shadow" />
    </div>

    <!-- 标题 -->
    <div ref="titleRef" class="fan-title">
      <h2 class="title-cn">折扇展骨</h2>
      <p class="title-en">FOLDED SCREEN GALLERY</p>
    </div>

    <!-- 装饰角标 -->
    <div ref="cornerDecorRef" class="corner-decoration">
      <span class="corner-line" />
      <span class="corner-dot" />
      <span class="corner-line" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface GalleryImage {
  id: number
  url: string
  title: string
}

const galleryImages: GalleryImage[] = [
  { id: 1, url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=85', title: 'Mountain Dawn' },
  { id: 2, url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=85', title: 'Alpine Peak' },
  { id: 3, url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=85', title: 'Nature Vista' },
  { id: 4, url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=85', title: 'Lake View' },
  { id: 5, url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=85', title: 'Ocean Breeze' },
  { id: 6, url: 'https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?w=800&q=85', title: 'Forest Path' }
]

const parentRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const galleryRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const shadowRef = ref<HTMLElement | null>(null)
const cornerDecorRef = ref<HTMLElement | null>(null)

const fanCardRefs = ref<(HTMLElement | null)[]>([])
const setFanCardRef = (el: unknown, index: number) => {
  fanCardRefs.value[index] = el as HTMLElement | null
}

let scrollTriggerInstance: ScrollTrigger | null = null
let entranceTimeline: gsap.core.Timeline | null = null
const cardTimelines: gsap.core.Tween[] = []

const initAnimations = () => {
  if (!parentRef.value) return

  const validCards = fanCardRefs.value.filter(Boolean)

  // 设置初始状态
  gsap.set(headerRef.value, { opacity: 0, y: -20 })
  gsap.set(titleRef.value, { opacity: 0, y: 30 })
  gsap.set(cornerDecorRef.value, { opacity: 0 })

  // 折扇初始状态 - 全部折叠在左侧
  validCards.forEach((card, index) => {
    gsap.set(card, {
      rotateY: -85,
      transformOrigin: 'left center',
      transformStyle: 'preserve-3d'
    })
    // 高光线初始
    const highlight = card.querySelector('.fan-highlight') as HTMLElement
    if (highlight) {
      gsap.set(highlight, { opacity: 0.8 })
    }
  })

  // 底部阴影初始
  gsap.set(shadowRef.value, { scaleX: 0.1, opacity: 0.3, transformOrigin: 'left center' })

  // 入场动画
  entranceTimeline = gsap.timeline()

  entranceTimeline
    .to(headerRef.value, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
    .to(titleRef.value, { opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.4)' }, '-=0.2')
    .to(cornerDecorRef.value, { opacity: 1, duration: 0.4 }, '-=0.1')

  // 滚动触发展开动画
  scrollTriggerInstance = ScrollTrigger.create({
    trigger: parentRef.value,
    start: 'top 80%',
    end: 'bottom 20%',
    scrub: 1.5,
    onUpdate: (self) => {
      const progress = self.progress

      // 折扇依次展开
      validCards.forEach((card, index) => {
        const cardProgress = Math.max(0, Math.min(1, (progress - index * 0.08) * 1.5))
        const easeProgress = gsap.parseEase('power3.out')(cardProgress)

        // rotateY 从 -85 到 0
        const rotateY = -85 + 85 * easeProgress
        // 添加微弱的回弹
        const overshoot = cardProgress > 0.95 ? (1 - cardProgress) * 6 : 0

        gsap.set(card, { rotateY: rotateY + overshoot })

        // 高光线随角度移动
        const highlight = card.querySelector('.fan-highlight') as HTMLElement
        if (highlight) {
          const highlightOpacity = 0.8 - 0.6 * easeProgress
          gsap.set(highlight, { opacity: highlightOpacity })
        }

        // 扇骨效果
        const spine = card.querySelector('.fan-spine') as HTMLElement
        if (spine) {
          gsap.set(spine, { opacity: 0.6 - 0.5 * easeProgress })
        }
      })

      // 底部阴影展开
      const shadowProgress = Math.max(0, Math.min(1, (progress - 0.3) * 1.5))
      if (shadowRef.value) {
        gsap.set(shadowRef.value, {
          scaleX: 0.1 + 0.9 * gsap.parseEase('power2.out')(shadowProgress),
          opacity: 0.3 + 0.4 * gsap.parseEase('power2.out')(shadowProgress)
        })
      }
    },
    onLeaveBack: () => {
      // 滚动回顶部时恢复折叠状态
      validCards.forEach((card) => {
        gsap.to(card, { rotateY: -85, duration: 0.4, ease: 'power2.in' })
      })
      gsap.to(shadowRef.value, { scaleX: 0.1, opacity: 0.3, duration: 0.3 })

      gsap.to(headerRef.value, { opacity: 0, y: -20, duration: 0.3 })
      gsap.to(titleRef.value, { opacity: 0, y: 30, duration: 0.3 })
    }
  })

  // 持续微颤效果（展开后）
  validCards.forEach((card, index) => {
    const microShake = gsap.to(card, {
      rotateY: 2,
      duration: 0.8 + index * 0.1,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: index * 0.05
    })
    cardTimelines.push(microShake)
  })
}

onMounted(() => {
  nextTick(() => {
    initAnimations()
  })
})

onUnmounted(() => {
  if (scrollTriggerInstance) {
    scrollTriggerInstance.kill()
  }
  if (entranceTimeline) {
    entranceTimeline.kill()
  }
  cardTimelines.forEach(t => t.kill())
  ScrollTrigger.getAll().forEach(st => st.kill())
  gsap.killTweensOf('*')
})
</script>

<style scoped lang="scss">
.folded-fan-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #1a1420 0%, #0f0a14 50%, #1a1020 100%);
  color: #ffffff;
  font-family: 'Noto Sans SC', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fan-stage-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.stage-gradient {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 30% 50%, rgba(100, 80, 120, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 30%, rgba(80, 60, 100, 0.1) 0%, transparent 40%),
    radial-gradient(ellipse at 50% 80%, rgba(60, 40, 80, 0.08) 0%, transparent 30%);
}

.stage-particles {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(1px 1px at 15% 25%, rgba(255, 255, 255, 0.15) 0%, transparent 100%),
    radial-gradient(1px 1px at 35% 65%, rgba(255, 255, 255, 0.1) 0%, transparent 100%),
    radial-gradient(1px 1px at 55% 35%, rgba(255, 255, 255, 0.12) 0%, transparent 100%),
    radial-gradient(1px 1px at 75% 55%, rgba(255, 255, 255, 0.08) 0%, transparent 100%),
    radial-gradient(1px 1px at 85% 15%, rgba(255, 255, 255, 0.1) 0%, transparent 100%);
}

.fan-header {
  position: absolute;
  top: 40px;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  z-index: 20;

  .header-line {
    width: 60px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(200, 180, 220, 0.3), transparent);
  }

  .header-text {
    font-size: 10px;
    letter-spacing: 6px;
    color: rgba(200, 180, 220, 0.5);
    font-weight: 500;
  }
}

.fan-gallery {
  position: relative;
  display: flex;
  gap: 16px;
  perspective: 1500px;
  perspective-origin: 30% 50%;
}

.fan-card {
  position: relative;
  width: 180px;
  height: 260px;
  transform-style: preserve-3d;
  will-change: transform;
  cursor: pointer;

  &:hover .fan-card-inner {
    box-shadow:
      0 30px 60px rgba(0, 0, 0, 0.5),
      0 0 40px rgba(160, 140, 200, 0.15);
  }
}

.fan-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 6px;
  overflow: hidden;
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.4),
    0 0 20px rgba(100, 80, 120, 0.1);
  transition: box-shadow 0.3s ease;
}

.fan-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.fan-highlight {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.25) 0%,
    transparent 30%
  );
  pointer-events: none;
}

.fan-spine {
  position: absolute;
  left: 0;
  top: 5%;
  width: 4px;
  height: 90%;
  background: linear-gradient(
    to right,
    rgba(180, 160, 200, 0.4),
    rgba(180, 160, 200, 0.1)
  );
  border-radius: 2px;
  opacity: 0.6;
}

.fan-shadow {
  position: absolute;
  bottom: -30px;
  left: 0;
  width: 100%;
  height: 20px;
  background: radial-gradient(
    ellipse at center,
    rgba(0, 0, 0, 0.5) 0%,
    transparent 70%
  );
  filter: blur(8px);
  transform-origin: left center;
}

.fan-title {
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 20;

  .title-cn {
    font-size: 32px;
    font-weight: 600;
    letter-spacing: 12px;
    color: rgba(220, 200, 240, 0.9);
    margin: 0 0 10px;
    text-shadow: 0 4px 30px rgba(100, 80, 120, 0.5);
  }

  .title-en {
    font-size: 11px;
    letter-spacing: 4px;
    color: rgba(180, 160, 200, 0.4);
    margin: 0;
  }
}

.corner-decoration {
  position: absolute;
  bottom: 40px;
  right: 40px;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 20;

  .corner-line {
    width: 40px;
    height: 1px;
    background: linear-gradient(90deg, rgba(200, 180, 220, 0.3), transparent);
  }

  .corner-dot {
    width: 6px;
    height: 6px;
    background: rgba(200, 180, 220, 0.4);
    border-radius: 50%;
  }
}

@media (max-width: 1200px) {
  .fan-card {
    width: 150px;
    height: 220px;
  }

  .fan-gallery {
    gap: 12px;
  }

  .fan-title {
    .title-cn {
      font-size: 26px;
      letter-spacing: 10px;
    }
  }
}

@media (max-width: 900px) {
  .fan-card {
    width: 120px;
    height: 180px;
  }

  .fan-gallery {
    gap: 10px;
  }

  .fan-title {
    bottom: 60px;

    .title-cn {
      font-size: 22px;
      letter-spacing: 8px;
    }

    .title-en {
      font-size: 9px;
    }
  }
}

@media (max-width: 600px) {
  .fan-card {
    width: 90px;
    height: 140px;
  }

  .fan-gallery {
    gap: 8px;
  }

  .fan-title {
    bottom: 50px;

    .title-cn {
      font-size: 18px;
      letter-spacing: 6px;
    }

    .title-en {
      font-size: 8px;
      letter-spacing: 2px;
    }
  }

  .corner-decoration {
    bottom: 25px;
    right: 20px;

    .corner-line {
      width: 25px;
    }
  }

  .fan-header {
    top: 25px;

    .header-line {
      width: 40px;
    }

    .header-text {
      font-size: 8px;
      letter-spacing: 4px;
    }
  }
}
</style>
