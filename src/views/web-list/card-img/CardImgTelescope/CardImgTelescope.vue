<template>
  <div class="card-telescope" ref="parentRef" @mousemove="handleMouseMove">
    <!-- 深空背景 -->
    <div ref="starfieldRef" class="starfield">
      <!-- 星云层 -->
      <div class="nebula-layer"></div>
      <!-- 星点 -->
      <div class="stars-container">
        <div v-for="i in 80" :key="i" class="star" :style="getStarStyle(i)"></div>
      </div>
    </div>

    <!-- 前景图片 -->
    <div ref="imageContainerRef" class="image-container">
      <div ref="eyepieceRef" class="eyepiece-frame">
        <img
          ref="mainImgRef"
          class="main-image"
          src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=80"
          alt="Deep Space"
        />
        <!-- 目镜暗角 -->
        <div ref="vignetteRef" class="eyepiece-vignette"></div>
      </div>
    </div>

    <!-- 标题 -->
    <div ref="titleRef" class="telescope-title">
      <h2>Deep Space</h2>
      <p>深空锁定 · 望远镜视差</p>
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

const parentRef = ref<HTMLElement | null>(null)
const starfieldRef = ref<HTMLElement | null>(null)
const imageContainerRef = ref<HTMLElement | null>(null)
const eyepieceRef = ref<HTMLElement | null>(null)
const mainImgRef = ref<HTMLImageElement | null>(null)
const vignetteRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)

const cleanupFns: TweenCleanup[] = []

// 生成星点样式
const getStarStyle = (index: number) => {
  const size = index % 3 === 0 ? 2 : index % 3 === 1 ? 1.5 : 1
  const opacity = 0.3 + (index % 5) * 0.1
  return {
    left: `${(index * 137.508) % 100}%`,
    top: `${(index * 97.368) % 100}%`,
    width: `${size}px`,
    height: `${size}px`,
    opacity,
    animationDelay: `${(index * 0.1) % 3}s`,
  }
}

let mouseX = 0
let mouseY = 0
let quickToX: gsap.core.Tween | null = null
let quickToY: gsap.core.Tween | null = null

const handleMouseMove = (e: MouseEvent) => {
  if (!imageContainerRef.value) return
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2
}

onMounted(() => {
  if (
    !parentRef.value ||
    !starfieldRef.value ||
    !imageContainerRef.value ||
    !eyepieceRef.value ||
    !mainImgRef.value ||
    !vignetteRef.value ||
    !titleRef.value
  ) {
    return
  }

  // 初始状态
  gsap.set(starfieldRef.value, { y: 0 })
  gsap.set(imageContainerRef.value, { y: 0, scale: 1 })
  gsap.set(eyepieceRef.value, { x: 0, y: 0 })
  gsap.set(vignetteRef.value, { opacity: 0.6 })
  gsap.set(titleRef.value, { opacity: 0, y: 30 })

  // 背景视差滚动
  const bgScroll = gsap.to(starfieldRef.value, {
    y: () => window.innerHeight * 0.15,
    ease: 'none',
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  })
  cleanupFns.push({ revert: () => bgScroll.kill() })

  // 前景视差滚动
  const fgScroll = gsap.to(imageContainerRef.value, {
    y: () => window.innerHeight * 0.08,
    ease: 'none',
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  })
  cleanupFns.push({ revert: () => fgScroll.kill() })

  // 前景放大
  const zoomTl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: 1.5,
    },
  })

  zoomTl.fromTo(
    imageContainerRef.value,
    { scale: 1 },
    {
      scale: 1.04,
      duration: 1,
      ease: 'power1.inOut',
    }
  )

  zoomTl.to(
    imageContainerRef.value,
    {
      scale: 1.02,
      duration: 0.8,
      ease: 'power1.inOut',
    },
    1
  )

  cleanupFns.push({ revert: () => zoomTl.kill() })

  // 暗角联动
  const vignetteTl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: 1.5,
    },
  })

  vignetteTl.fromTo(
    vignetteRef.value,
    { opacity: 0.5 },
    {
      opacity: 0.7,
      duration: 1,
      ease: 'power1.inOut',
    }
  )

  vignetteTl.to(
    vignetteRef.value,
    {
      opacity: 0.6,
      duration: 0.8,
      ease: 'power1.inOut',
    },
    1
  )

  cleanupFns.push({ revert: () => vignetteTl.kill() })

  // 鼠标目镜偏移
  if (eyepieceRef.value) {
    quickToX = gsap.quickTo(eyepieceRef.value, 'x', { duration: 0.8, ease: 'power3.out' })
    quickToY = gsap.quickTo(eyepieceRef.value, 'y', { duration: 0.8, ease: 'power3.out' })
  }

  const handleMouseMoveEvent = (e: MouseEvent) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 6
    const y = (e.clientY / window.innerHeight - 0.5) * 6
    if (quickToX) quickToX(x)
    if (quickToY) quickToY(y)
  }

  window.addEventListener('mousemove', handleMouseMoveEvent)
  cleanupFns.push({
    revert: () => window.removeEventListener('mousemove', handleMouseMoveEvent),
  })

  // 标题淡入
  const titleTl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 75%',
      end: 'bottom 30%',
      scrub: 1.5,
    },
  })

  titleTl.fromTo(
    titleRef.value,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
    }
  )

  cleanupFns.push({ revert: () => titleTl.kill() })
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn.revert())
  ScrollTrigger.getAll().forEach(t => t.kill())
})
</script>

<style scoped lang="scss">
.card-telescope {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: #000005;
  cursor: crosshair;
}

.starfield {
  position: absolute;
  inset: -20%;
  width: 140%;
  height: 140%;
  z-index: 0;
}

.nebula-layer {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 60% at 30% 40%, rgba(80, 40, 120, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse 60% 80% at 70% 60%, rgba(40, 60, 120, 0.12) 0%, transparent 50%),
    radial-gradient(ellipse 50% 50% at 50% 50%, rgba(100, 50, 80, 0.08) 0%, transparent 60%);
}

.stars-container {
  position: absolute;
  inset: 0;
}

.star {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #ffffff, rgba(200, 220, 255, 0.8));
  box-shadow: 0 0 3px rgba(255, 255, 255, 0.5);
  animation: twinkle 3s ease-in-out infinite;
}

@keyframes twinkle {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.2);
  }
}

.image-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 75vw;
  max-width: 1000px;
  height: 60vh;
  max-height: 600px;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.eyepiece-frame {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow:
    0 0 0 2px rgba(100, 120, 160, 0.3),
    0 0 40px rgba(80, 100, 150, 0.2),
    0 0 80px rgba(60, 80, 120, 0.1);
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.eyepiece-vignette {
  position: absolute;
  inset: 0;
  border-radius: 8px;
  pointer-events: none;
  background: radial-gradient(
    ellipse 70% 70% at 50% 50%,
    transparent 40%,
    rgba(0, 5, 15, 0.3) 60%,
    rgba(0, 5, 15, 0.6) 75%,
    rgba(0, 5, 15, 0.85) 90%,
    rgba(0, 5, 15, 0.95) 100%
  );
  opacity: 0.6;
}

.telescope-title {
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 20;
  opacity: 0;

  h2 {
    font-family: 'Montserrat', 'Arial', sans-serif;
    font-size: clamp(24px, 4vw, 42px);
    font-weight: 300;
    color: #c8d8f0;
    margin: 0 0 10px;
    letter-spacing: 12px;
    text-transform: uppercase;
    text-shadow: 0 0 30px rgba(100, 150, 200, 0.4);
  }

  p {
    font-family: 'Noto Serif SC', 'STSong', serif;
    font-size: clamp(12px, 2vw, 16px);
    color: rgba(180, 200, 230, 0.6);
    margin: 0;
    letter-spacing: 8px;
  }
}
</style>
