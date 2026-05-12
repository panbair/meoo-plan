<template>
  <div class="flip-card" ref="parentRef">
    <!-- 背景层 -->
    <div class="flip-bg" ref="bgRef"></div>

    <!-- 卡片容器 -->
    <div class="flip-container">
      <div
        v-for="(img, index) in images"
        :key="index"
        class="flip-item"
        :ref="el => (cardRefs[index] = el as HTMLElement)"
      >
        <div class="card-inner">
          <img :src="img.url" :alt="`Card ${index + 1}`" />
          <div class="card-overlay"></div>
        </div>
        <div class="card-shadow"></div>
      </div>
    </div>

    <!-- 标题 -->
    <div class="flip-title" ref="titleRef">
      <span class="title-cn">微倾落地</span>
      <span class="title-en">FLIP CARD</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface TweenCleanup {
  revert: () => void
}

const images = [
  { url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&q=80' },
  { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80' },
  { url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80' },
  { url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80' },
  { url: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=600&q=80' },
  { url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80' },
]

const parentRef = ref<HTMLElement | null>(null)
const bgRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const cardRefs = ref<(HTMLElement | null)[]>([])

const cleanupFns: TweenCleanup[] = []

onMounted(() => {
  if (!parentRef.value) return

  const ctx = gsap.context(() => {
    // 初始化卡片状态（微微后倾待落姿态）
    cardRefs.value.forEach((el) => {
      if (!el) return
      gsap.set(el, {
        rotateX: -8,
        y: 15,
        scaleY: 0.96,
        opacity: 0,
      })
      gsap.set(el.querySelector('.card-shadow'), {
        opacity: 0.15,
        filter: 'blur(8px)',
        scale: 0.9,
      })
    })

    // 创建时间线
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: parentRef.value,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1.5,
      },
    })

    // 卡片依次翻转落地
    cardRefs.value.forEach((el, index) => {
      if (!el) return

      const startTime = 0.1 + index * 0.1

      // 翻转落地
      tl.to(
        el,
        {
          rotateX: 0,
          y: 0,
          scaleY: 1,
          opacity: 1,
          duration: 0.7,
          ease: 'power4.out',
        },
        startTime
      )

      // 触地微弹
      tl.to(
        el,
        {
          y: -2,
          duration: 0.12,
          ease: 'power2.out',
        },
        startTime + 0.55
      )

      tl.to(
        el,
        {
          y: 0,
          duration: 0.2,
          ease: 'back.out(1.2)',
        },
        startTime + 0.67
      )

      // 阴影演化
      tl.to(
        el.querySelector('.card-shadow'),
        {
          opacity: 0.35,
          filter: 'blur(3px)',
          scale: 1.1,
          duration: 0.4,
          ease: 'power2.out',
        },
        startTime + 0.55
      )

      // 前缘拍下后阴影回稳
      tl.to(
        el.querySelector('.card-shadow'),
        {
          scale: 1,
          duration: 0.3,
          ease: 'power2.inOut',
        },
        startTime + 0.8
      )
    })

    // 全部落位后阴影微呼吸
    tl.to(
      cardRefs.value.map(el => el?.querySelector('.card-shadow')).filter(Boolean),
      {
        opacity: 0.4,
        duration: 0.5,
        ease: 'power2.inOut',
      },
      1.0
    )

    tl.to(
      cardRefs.value.map(el => el?.querySelector('.card-shadow')).filter(Boolean),
      {
        opacity: 0.35,
        duration: 0.5,
        ease: 'power2.inOut',
      },
      1.5
    )

    // 标题淡入
    tl.fromTo(
      titleRef.value,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
      },
      1.2
    )

    // 背景视差
    tl.to(
      bgRef.value,
      {
        y: -30,
        duration: 1,
        ease: 'none',
      },
      0
    )

    cleanupFns.push({
      revert: () => tl.kill(),
    })
  }, parentRef.value)
})

onUnmounted(() => {
  cleanupFns.forEach((fn) => fn.revert())
  ScrollTrigger.getAll().forEach((st) => st.kill())
})
</script>

<style lang="scss" scoped>
.flip-card {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%);
  perspective: 1200px;
}

.flip-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 20% 30%, rgba(230, 162, 60, 0.06) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 70%, rgba(230, 126, 34, 0.04) 0%, transparent 50%),
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 80px,
      rgba(255, 255, 255, 0.015) 80px,
      rgba(255, 255, 255, 0.015) 81px
    );
  will-change: transform;
}

.flip-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: grid;
  grid-template-columns: repeat(3, 220px);
  grid-template-rows: repeat(2, 160px);
  gap: 24px;
}

.flip-item {
  position: relative;
  transform-style: preserve-3d;
  transform-origin: center bottom;
  will-change: transform, opacity;
  cursor: pointer;

  &:hover {
    .card-inner {
      transform: translateY(-4px) rotateX(2deg);
    }

    .card-shadow {
      transform: scale(1.15) translateY(8px);
      opacity: 0.4;
    }
  }
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  transform-style: preserve-3d;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 50%,
    rgba(0, 0, 0, 0.1) 100%
  );
  pointer-events: none;
}

.card-shadow {
  position: absolute;
  bottom: -8px;
  left: 5%;
  width: 90%;
  height: 20px;
  background: radial-gradient(ellipse, rgba(0, 0, 0, 0.4) 0%, transparent 70%);
  border-radius: 50%;
  transform-origin: center;
  will-change: transform, opacity, filter;
  pointer-events: none;
}

.flip-title {
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 10;

  .title-cn {
    display: block;
    font-size: 28px;
    font-weight: 600;
    color: #fff;
    letter-spacing: 8px;
    text-shadow: 0 0 30px rgba(230, 162, 60, 0.4);
    margin-bottom: 8px;
  }

  .title-en {
    display: block;
    font-size: 12px;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.5);
    letter-spacing: 6px;
    text-transform: uppercase;
  }
}
</style>
