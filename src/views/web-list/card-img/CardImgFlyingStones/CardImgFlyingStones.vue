<template>
  <div class="card-flying-stones" ref="parentRef">
    <!-- 展墙背景 -->
    <div ref="wallRef" class="wall-background">
      <div class="wall-texture"></div>
      <div class="wall-shadow"></div>
    </div>

    <!-- 图片矩阵容器 -->
    <div class="image-grid" ref="gridRef">
      <div
        v-for="(img, index) in images"
        :key="index"
        :ref="el => { if (el) imageRefs[index] = el as HTMLElement }"
        class="image-item"
        :class="`item-${index}`"
      >
        <img :src="img" :alt="`Gallery ${index + 1}`" class="grid-image" />
        <div class="image-glow"></div>
      </div>
    </div>

    <!-- 标题 -->
    <div ref="titleRef" class="gallery-title">
      <h2>Flying Stones</h2>
      <p>斜阶飞石 · 多图错落</p>
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
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80',
  'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=600&q=80',
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&q=80',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&q=80',
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600&q=80',
  'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600&q=80',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&q=80',
  'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=600&q=80',
]

const parentRef = ref<HTMLElement | null>(null)
const wallRef = ref<HTMLElement | null>(null)
const gridRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const imageRefs = ref<(HTMLElement | null)[]>([])

const cleanupFns: TweenCleanup[] = []

onMounted(() => {
  if (!parentRef.value || !gridRef.value || !titleRef.value) {
    return
  }

  // 初始化所有图片的初始位置（沿对角线错落分布）
  const diagonalOffsets = [
    { x: -120, y: -120 }, // 左上
    { x: 0, y: -150 },
    { x: 120, y: -100 }, // 上中
    { x: -150, y: 0 },
    { x: 0, y: 0 }, // 中心
    { x: 150, y: 0 },
    { x: -120, y: 100 }, // 下左
    { x: 0, y: 150 },
    { x: 120, y: 120 }, // 右下
  ]

  // 设置初始状态
  imageRefs.value.forEach((el, index) => {
    if (!el) return
    const offset = diagonalOffsets[index]
    gsap.set(el, {
      x: offset.x,
      y: offset.y,
      scale: 0.85,
      rotation: (index % 2 === 0 ? 1 : -1) * 3,
      opacity: 0,
      boxShadow: '0 5px 20px rgba(0, 0, 0, 0.3)',
    })
  })

  gsap.set(titleRef.value, { opacity: 0, y: 30 })

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: 1.5,
    },
  })

  cleanupFns.push({
    revert: () => ScrollTrigger.getAll().forEach(t => t.kill()),
  })

  // 图片依次飞入（沿对角线）
  imageRefs.value.forEach((el, index) => {
    if (!el) return

    // 飞入动画
    tl.to(
      el,
      {
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
        opacity: 1,
        duration: 0.65,
        ease: 'power3.in',
      },
      index * 0.12
    )

    // 落地微弹
    tl.to(
      el,
      {
        y: -4,
        duration: 0.1,
        ease: 'power2.out',
      },
      index * 0.12 + 0.65
    )

    tl.to(
      el,
      {
        y: 0,
        duration: 0.15,
        ease: 'back.out(1.3)',
      },
      index * 0.12 + 0.75
    )

    // 阴影加深
    tl.to(
      el,
      {
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
        duration: 0.4,
        ease: 'power2.out',
      },
      index * 0.12 + 0.6
    )
  })

  // 全部落位后亮度齐升
  tl.to(
    '.grid-image',
    {
      filter: 'brightness(1)',
      duration: 0.6,
      ease: 'power2.out',
    },
    0.8 + 9 * 0.12
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
    1.5
  )
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn.revert())
  ScrollTrigger.getAll().forEach(t => t.kill())
})
</script>

<style scoped lang="scss">
.card-flying-stones {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, #0d0f0d 0%, #0a0c0a 50%, #0d0f0d 100%);
}

.wall-background {
  position: absolute;
  inset: 0;
  z-index: 0;

  .wall-texture {
    position: absolute;
    inset: 0;
    background-image:
      repeating-linear-gradient(
        90deg,
        transparent,
        transparent 100px,
        rgba(30, 35, 30, 0.1) 100px,
        rgba(30, 35, 30, 0.1) 101px
      );
  }

  .wall-shadow {
    position: absolute;
    inset: 0;
    background: radial-gradient(
      ellipse 80% 80% at 50% 50%,
      transparent 30%,
      rgba(0, 0, 0, 0.3) 100%
    );
  }
}

.image-grid {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 20px;
  width: 80vw;
  max-width: 900px;
  height: 65vh;
  max-height: 600px;
  z-index: 5;
}

.image-item {
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  &.item-0 { grid-area: 1 / 1; }
  &.item-1 { grid-area: 1 / 2; }
  &.item-2 { grid-area: 1 / 3; }
  &.item-3 { grid-area: 2 / 1; }
  &.item-4 { grid-area: 2 / 2; }
  &.item-5 { grid-area: 2 / 3; }
  &.item-6 { grid-area: 3 / 1; }
  &.item-7 { grid-area: 3 / 2; }
  &.item-8 { grid-area: 3 / 3; }
}

.grid-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.85);
  transition: filter 0.3s ease;
}

.image-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.05) 0%,
    transparent 50%,
    rgba(0, 0, 0, 0.1) 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-item:hover .image-glow {
  opacity: 1;
}

.gallery-title {
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 20;
  opacity: 0;

  h2 {
    font-family: 'Playfair Display', 'Georgia', serif;
    font-size: clamp(24px, 4vw, 40px);
    font-weight: 400;
    color: #e8f0e8;
    margin: 0 0 10px;
    letter-spacing: 8px;
    text-transform: uppercase;
    text-shadow: 0 2px 20px rgba(200, 220, 200, 0.3);
  }

  p {
    font-family: 'Noto Serif SC', 'STSong', serif;
    font-family: 'Noto Serif SC', 'STSong', serif;
    font-size: clamp(12px, 2vw, 16px);
    color: rgba(200, 215, 200, 0.6);
    margin: 0;
    letter-spacing: 6px;
  }
}
</style>
