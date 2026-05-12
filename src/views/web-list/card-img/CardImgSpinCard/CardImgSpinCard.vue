<template>
  <div class="spin-card" ref="parentRef">
    <!-- 背景层 -->
    <div class="spin-bg" ref="bgRef"></div>

    <!-- 卡片容器 -->
    <div class="spin-container">
      <div
        v-for="(img, index) in images"
        :key="index"
        class="spin-item"
        :ref="el => (cardRefs[index] = el as HTMLElement)"
      >
        <div class="card-inner">
          <img :src="img.url" :alt="`Card ${index + 1}`" />
          <div class="card-shine"></div>
        </div>
      </div>
    </div>

    <!-- 标题 -->
    <div class="spin-title" ref="titleRef">
      <span class="title-cn">瞬闪翻正</span>
      <span class="title-en">SPIN CARD</span>
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
  { url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600&q=80' },
  { url: 'https://images.unsplash.com/photo-1439405326854-014607f694d7?w=600&q=80' },
]

const parentRef = ref<HTMLElement | null>(null)
const bgRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const cardRefs = ref<(HTMLElement | null)[]>([])

const cleanupFns: TweenCleanup[] = []

onMounted(() => {
  if (!parentRef.value) return

  const ctx = gsap.context(() => {
    // 初始化卡片状态（微微旋转待入姿态）
    cardRefs.value.forEach((el) => {
      if (!el) return
      gsap.set(el, {
        rotateY: 12,
        y: 8,
        opacity: 0,
        scale: 0.95,
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

    // 卡片依次旋正归位
    cardRefs.value.forEach((el, index) => {
      if (!el) return

      const startTime = 0.1 + index * 0.09

      // 旋正归位
      tl.to(
        el,
        {
          rotateY: 0,
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.55,
          ease: 'power3.in',
        },
        startTime
      )

      // 到位闪烁
      tl.to(
        el,
        {
          boxShadow: '0 0 20px rgba(255, 255, 255, 0.25), 0 8px 32px rgba(0, 0, 0, 0.4)',
          duration: 0.08,
          ease: 'none',
        },
        startTime + 0.5
      )

      tl.to(
        el,
        {
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
          duration: 0.2,
          ease: 'power2.out',
        },
        startTime + 0.58
      )
    })

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
      1.0
    )

    // 背景视差
    tl.to(
      bgRef.value,
      {
        y: -40,
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
.spin-card {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #0f0f23 100%);
  perspective: 1000px;
}

.spin-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 30% 70%, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 30%, rgba(168, 85, 247, 0.06) 0%, transparent 50%),
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 100px,
      rgba(255, 255, 255, 0.012) 100px,
      rgba(255, 255, 255, 0.012) 101px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 100px,
      rgba(255, 255, 255, 0.012) 100px,
      rgba(255, 255, 255, 0.012) 101px
    );
  will-change: transform;
}

.spin-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: grid;
  grid-template-columns: repeat(4, 180px);
  grid-template-rows: repeat(2, 130px);
  gap: 20px;
}

.spin-item {
  position: relative;
  transform-style: preserve-3d;
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  will-change: transform, opacity, box-shadow;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.03) rotateY(-3deg) translateY(-5px);
    box-shadow: 0 12px 30px rgba(99, 102, 241, 0.3), 0 8px 20px rgba(0, 0, 0, 0.4);
  }
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.card-shine {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.15) 0%,
    transparent 40%,
    transparent 60%,
    rgba(255, 255, 255, 0.05) 100%
  );
  pointer-events: none;
  border-radius: 10px;
}

.spin-title {
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
    text-shadow: 0 0 30px rgba(99, 102, 241, 0.5);
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
