<template>
  <div class="card-waterfall" ref="parentRef">
    <!-- 深色虚空背景 -->
    <div ref="bgRef" class="void-background">
      <div class="void-gradient"></div>
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

        <!-- 触地光粒 -->
        <div class="impact-particles" :ref="el => { if (el) particleRefs[index] = el as HTMLElement }">
          <div v-for="p in 6" :key="p" class="particle" :class="`p-${p}`"></div>
        </div>
      </div>
    </div>

    <!-- 标题 -->
    <div ref="titleRef" class="cascade-title">
      <h2>Waterfall Cascade</h2>
      <p>流瀑音阶 · 阶梯坠落</p>
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
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
  'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=600&q=80',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80',
  'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600&q=80',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=600&q=80',
  'https://images.unsplash.com/photo-1439405326854-014607f694d7?w=600&q=80',
]

const parentRef = ref<HTMLElement | null>(null)
const bgRef = ref<HTMLElement | null>(null)
const gridRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const imageRefs = ref<(HTMLElement | null)[]>([])
const particleRefs = ref<(HTMLElement | null)[]>([])

const cleanupFns: TweenCleanup[] = []

onMounted(() => {
  if (!parentRef.value || !gridRef.value || !titleRef.value) {
    return
  }

  // Z字形阶梯分布（自左向右、从上至下）
  const stairOffsets = [
    [-80, -100, -120],   // 列0: 上→中→下
    [-90, -110, -130],   // 列1: 稍低
    [-85, -105, -125],   // 列2: 再稍低
  ]

  // 设置初始状态
  imageRefs.value.forEach((el, index) => {
    if (!el) return
    const col = index % 3
    const row = Math.floor(index / 3)
    const yOffset = stairOffsets[col][row]

    gsap.set(el, {
      y: yOffset,
      scale: 0.9,
      opacity: 0,
      boxShadow: '0 0 0 rgba(100, 150, 255, 0)',
    })
  })

  // 粒子初始状态
  particleRefs.value.forEach(el => {
    if (!el) return
    gsap.set(el, { opacity: 0 })
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

  // Z字形坠落序列（列间交错）
  const colStagger = 0.18
  const rowStagger = 0.06

  imageRefs.value.forEach((el, index) => {
    if (!el) return
    const col = index % 3
    const row = Math.floor(index / 3)
    const startTime = col * colStagger + row * rowStagger

    // 坠落动画
    tl.to(
      el,
      {
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: 'power4.in',
      },
      startTime
    )

    // 首次触地微弹
    tl.to(
      el,
      {
        y: -12,
        duration: 0.08,
        ease: 'power2.out',
      },
      startTime + 0.5
    )

    // 二次回弹锁定
    tl.to(
      el,
      {
        y: 0,
        duration: 0.15,
        ease: 'back.out(1.5)',
      },
      startTime + 0.58
    )

    // 阴影加深
    tl.to(
      el,
      {
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
        duration: 0.3,
        ease: 'power2.out',
      },
      startTime + 0.45
    )

    // 冷光粒子迸发
    tl.to(
      particleRefs.value[index],
      {
        opacity: 1,
        duration: 0.05,
        ease: 'none',
      },
      startTime + 0.5
    )

    // 粒子扩散消散
    tl.to(
      particleRefs.value[index].querySelectorAll('.particle'),
      {
        x: (i: number) => (i % 2 === 0 ? 1 : -1) * (20 + Math.random() * 30),
        y: (i: number) => (i < 3 ? -1 : 1) * (15 + Math.random() * 25),
        opacity: 0,
        scale: 0,
        duration: 0.4,
        ease: 'power2.out',
        stagger: 0.02,
      },
      startTime + 0.52
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
    0.8
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
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn.revert())
  ScrollTrigger.getAll().forEach(t => t.kill())
})
</script>

<style scoped lang="scss">
.card-waterfall {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, #08080c 0%, #0c0c14 50%, #08080c 100%);
}

.void-background {
  position: absolute;
  inset: 0;
  z-index: 0;

  .void-gradient {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 60% 40% at 50% 30%, rgba(60, 80, 120, 0.08) 0%, transparent 60%),
      radial-gradient(ellipse 80% 60% at 50% 80%, rgba(20, 30, 50, 0.3) 0%, transparent 50%);
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
  gap: 16px;
  width: 75vw;
  max-width: 850px;
  height: 60vh;
  max-height: 560px;
  z-index: 5;
}

.image-item {
  position: relative;
  overflow: visible;
  border-radius: 6px;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-3px);
  }
}

.grid-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.8);
  border-radius: 6px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}

.impact-particles {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
}

.particle {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 3px;
  height: 3px;
  background: radial-gradient(
    circle at 30% 30%,
    rgba(180, 220, 255, 0.9),
    rgba(100, 160, 255, 0.6)
  );
  border-radius: 50%;
  box-shadow:
    0 0 4px rgba(150, 200, 255, 0.8),
    0 0 8px rgba(100, 160, 255, 0.5);

  &.p-1 { transform: translate(-50%, 0); }
  &.p-2 { transform: translate(-30%, 0); }
  &.p-3 { transform: translate(-10%, 0); }
  &.p-4 { transform: translate(10%, 0); }
  &.p-5 { transform: translate(30%, 0); }
  &.p-6 { transform: translate(50%, 0); }
}

.cascade-title {
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 20;
  opacity: 0;

  h2 {
    font-family: 'Montserrat', 'Arial', sans-serif;
    font-size: clamp(22px, 3.5vw, 38px);
    font-weight: 300;
    color: #d0e0f0;
    margin: 0 0 10px;
    letter-spacing: 10px;
    text-transform: uppercase;
    text-shadow: 0 2px 20px rgba(100, 150, 220, 0.4);
  }

  p {
    font-family: 'Noto Serif SC', 'STSong', serif;
    font-size: clamp(12px, 2vw, 16px);
    color: rgba(180, 200, 230, 0.6);
    margin: 0;
    letter-spacing: 6px;
  }
}
</style>
