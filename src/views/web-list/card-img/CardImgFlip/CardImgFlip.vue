<template>
  <div ref="parentRef" class="flip-container">
    <!-- 深色画廊背景 -->
    <div class="flip-bg">
      <div class="bg-gradient" />
      <div class="bg-particles" />
    </div>

    <!-- 顶部装饰 -->
    <div class="flip-header">
      <div ref="headerRef" class="header-content">
        <span class="header-line" />
        <span class="header-text">GALLERY EXHIBITION</span>
        <span class="header-line" />
      </div>
    </div>

    <!-- 画廊框架 -->
    <div ref="galleryRef" class="gallery-frame">
      <!-- 图片序列 -->
      <div
        v-for="(photo, index) in photos"
        :key="index"
        :ref="(el) => setFlipCardRef(el, index)"
        class="flip-card"
        :style="{ zIndex: photos.length - index }"
      >
        <div class="card-inner">
          <img
            :src="photo.url"
            :alt="photo.title"
            class="card-image"
          />
          <div class="card-highlight" />
        </div>
        <div class="card-shadow" />
      </div>
    </div>

    <!-- 底部信息 -->
    <div class="flip-footer">
      <div ref="footerRef" class="footer-content">
        <h2 ref="titleRef" class="gallery-title">
          <span class="title-cn">画廊序列展卷</span>
          <span class="title-en">GALLERY FLIP SEQUENCE</span>
        </h2>
        <div ref="counterRef" class="flip-counter">
          <span class="counter-label">FLIP</span>
          <span ref="currentIndexRef" class="counter-value">01</span>
          <span class="counter-sep">/</span>
          <span class="counter-total">{{ String(photos.length).padStart(2, '0') }}</span>
        </div>
      </div>
    </div>

    <!-- 边框装饰 -->
    <div class="frame-decoration">
      <div class="frame-corner tl" />
      <div class="frame-corner tr" />
      <div class="frame-corner bl" />
      <div class="frame-corner br" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []

interface Photo {
  url: string
  title: string
}

const photos: Photo[] = [
  { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80', title: 'Mountain Dawn' },
  { url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80', title: 'Alpine Peak' },
  { url: 'https://images.unsplash.com/photo-1472121672133-4a42c7e9b0cd?w=600&q=80', title: 'Forest Mist' },
  { url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&q=80', title: 'Nature Vista' }
]

const parentRef = ref<HTMLElement | null>(null)
const galleryRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const counterRef = ref<HTMLElement | null>(null)
const currentIndexRef = ref<HTMLElement | null>(null)

const flipCardRefs: (HTMLElement | null)[] = []

const setFlipCardRef = (el: unknown, index: number) => {
  flipCardRefs[index] = el as HTMLElement | null
}

onMounted(() => {
  nextTick(() => {
    initAnimations()
  })
})

const initAnimations = () => {
  if (!parentRef.value) return

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: 1.5
    }
  })

  // 头部入场
  tl.fromTo(
    headerRef.value,
    { opacity: 0, y: -30 },
    { opacity: 1, y: 0, duration: 0.6 },
    0
  )

  // 翻页动画 - 每张图片依次立起
  flipCardRefs.forEach((card, index) => {
    if (!card) return

    // 初始状态：向外翻倒
    gsap.set(card, {
      rotateY: 85,
      transformOrigin: 'left center',
      perspective: 1000
    })

    // 翻页动画
    tl.to(
      card,
      {
        rotateY: 0,
        duration: 0.7,
        ease: 'back.out(1.2)'
      },
      index * 0.2
    )

    // 高光线效果
    const highlight = card.querySelector('.card-highlight') as HTMLElement
    if (highlight) {
      tl.fromTo(
        highlight,
        { opacity: 0 },
        { opacity: 0.6, duration: 0.3 },
        index * 0.2
      )
      tl.to(
        highlight,
        { opacity: 0.15, duration: 0.4 },
        index * 0.2 + 0.3
      )
    }

    // 阴影效果
    const shadow = card.querySelector('.card-shadow') as HTMLElement
    if (shadow) {
      tl.fromTo(
        shadow,
        { opacity: 0.8, x: -5 },
        { opacity: 0.3, x: 0, duration: 0.5 },
        index * 0.2
      )
    }
  })

  // 全部立起后整体前移
  tl.to(
    flipCardRefs.filter(Boolean),
    {
      translateZ: 20,
      boxShadow: '0 30px 60px rgba(0, 0, 0, 0.4)',
      duration: 0.5,
      ease: 'power2.out'
    },
    photos.length * 0.2 + 0.2
  )

  // 底部信息入场
  tl.fromTo(
    footerRef.value,
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 0.6 },
    0.5
  )

  tl.fromTo(
    titleRef.value,
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'back.out(1.4)' },
    0.6
  )

  tl.fromTo(
    counterRef.value,
    { opacity: 0 },
    { opacity: 1, duration: 0.4 },
    0.8
  )

  // 更新计数器动画
  flipCardRefs.forEach((_, index) => {
    if (!currentIndexRef.value) return
    tl.to(
      {},
      {
        duration: 0.1,
        onUpdate: function() {
          const progress = this.progress()
          const currentIndex = Math.min(
            Math.floor(progress * photos.length) + 1,
            photos.length
          )
          if (currentIndexRef.value) {
            currentIndexRef.value.textContent = String(currentIndex).padStart(2, '0')
          }
        }
      },
      index * 0.2
    )
  })

  cleanupFns.push(() => {
    ScrollTrigger.getAll().forEach(t => t.kill())
  })
}

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  gsap.killTweensOf('*')
})
</script>

<style scoped lang="scss">
.flip-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%);
  color: #ffffff;
  font-family: 'Noto Sans SC', sans-serif;
}

// 深色画廊背景
.flip-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;

  .bg-gradient {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 50% 30%, rgba(40, 40, 80, 0.4) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 80%, rgba(20, 30, 60, 0.3) 0%, transparent 40%);
  }

  .bg-particles {
    position: absolute;
    inset: 0;
    background-image:
      radial-gradient(1px 1px at 10% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 100%),
      radial-gradient(1px 1px at 30% 60%, rgba(255, 255, 255, 0.08) 0%, transparent 100%),
      radial-gradient(1px 1px at 70% 40%, rgba(255, 255, 255, 0.1) 0%, transparent 100%),
      radial-gradient(1px 1px at 90% 70%, rgba(255, 255, 255, 0.06) 0%, transparent 100%);
  }
}

// 顶部装饰
.flip-header {
  position: absolute;
  top: 40px;
  left: 0;
  right: 0;
  z-index: 20;
  display: flex;
  justify-content: center;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 24px;

  .header-line {
    width: 60px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  }

  .header-text {
    font-size: 11px;
    font-family: 'Montserrat', sans-serif;
    letter-spacing: 6px;
    color: rgba(255, 255, 255, 0.5);
    text-transform: uppercase;
  }
}

// 画廊框架
.gallery-frame {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 24px;
  perspective: 1500px;
  padding: 40px;
}

// 翻页卡片
.flip-card {
  position: relative;
  width: 260px;
  height: 350px;
  transform-style: preserve-3d;
  will-change: transform;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  overflow: hidden;
  box-shadow:
    0 20px 50px rgba(0, 0, 0, 0.5),
    0 10px 30px rgba(0, 0, 0, 0.3);
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-highlight {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 30%
  );
  pointer-events: none;
  opacity: 0;
}

.card-shadow {
  position: absolute;
  top: 10%;
  left: -8px;
  width: 8px;
  height: 80%;
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.6) 0%,
    transparent 100%
  );
  border-radius: 4px;
  opacity: 0.5;
}

// 底部信息
.flip-footer {
  position: absolute;
  bottom: 60px;
  left: 0;
  right: 0;
  z-index: 20;
  display: flex;
  justify-content: center;
}

.footer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.gallery-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin: 0;

  .title-cn {
    font-size: 36px;
    font-weight: 700;
    letter-spacing: 8px;
    color: #ffffff;
    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  }

  .title-en {
    font-size: 12px;
    font-family: 'Montserrat', sans-serif;
    letter-spacing: 4px;
    color: rgba(255, 255, 255, 0.4);
    text-transform: uppercase;
  }
}

.flip-counter {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 30px;

  .counter-label {
    font-size: 10px;
    letter-spacing: 2px;
    color: rgba(255, 255, 255, 0.4);
  }

  .counter-value {
    font-size: 18px;
    font-family: 'JetBrains Mono', monospace;
    font-weight: 600;
    color: #ffd700;
  }

  .counter-sep {
    color: rgba(255, 255, 255, 0.3);
  }

  .counter-total {
    font-size: 14px;
    font-family: 'JetBrains Mono', monospace;
    color: rgba(255, 255, 255, 0.4);
  }
}

// 边框装饰
.frame-decoration {
  position: absolute;
  inset: 30px;
  pointer-events: none;
  z-index: 15;
}

.frame-corner {
  position: absolute;
  width: 50px;
  height: 50px;
  border-color: rgba(255, 255, 255, 0.15);
  border-style: solid;
  border-width: 0;

  &.tl {
    top: 0;
    left: 0;
    border-top-width: 2px;
    border-left-width: 2px;
  }

  &.tr {
    top: 0;
    right: 0;
    border-top-width: 2px;
    border-right-width: 2px;
  }

  &.bl {
    bottom: 0;
    left: 0;
    border-bottom-width: 2px;
    border-left-width: 2px;
  }

  &.br {
    bottom: 0;
    right: 0;
    border-bottom-width: 2px;
    border-right-width: 2px;
  }
}
</style>
