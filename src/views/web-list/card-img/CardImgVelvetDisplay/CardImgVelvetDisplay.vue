<template>
  <div class="card-velvet-display" ref="parentRef">
    <!-- 丝绒展柜背景 -->
    <div ref="velvetBgRef" class="velvet-background">
      <div class="velvet-texture"></div>
      <div class="top-light"></div>
    </div>

    <!-- 展品图片 -->
    <div ref="imageContainerRef" class="image-container">
      <div ref="frameRef" class="display-frame">
        <img
          ref="mainImgRef"
          class="main-image"
          src="https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1920&q=80"
          alt="Gallery Art"
        />
        <!-- 悬浮阴影 -->
        <div ref="shadowRef" class="art-shadow"></div>
      </div>
    </div>

    <!-- 标题 -->
    <div ref="titleRef" class="display-title">
      <h2>Velvet Display</h2>
      <p>丝绒展柜 · 聚焦视差</p>
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
const velvetBgRef = ref<HTMLElement | null>(null)
const imageContainerRef = ref<HTMLElement | null>(null)
const frameRef = ref<HTMLElement | null>(null)
const mainImgRef = ref<HTMLImageElement | null>(null)
const shadowRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)

const cleanupFns: TweenCleanup[] = []

onMounted(() => {
  if (
    !parentRef.value ||
    !velvetBgRef.value ||
    !imageContainerRef.value ||
    !frameRef.value ||
    !mainImgRef.value ||
    !shadowRef.value ||
    !titleRef.value
  ) {
    return
  }

  // 初始状态
  gsap.set(velvetBgRef.value, { y: 0 })
  gsap.set(imageContainerRef.value, { y: 0, scale: 1 })
  gsap.set(mainImgRef.value, { filter: 'brightness(0.9)' })
  gsap.set(shadowRef.value, { opacity: 0.3 })
  gsap.set(titleRef.value, { opacity: 0, y: 30 })

  // 背景丝绒极缓下滑
  const bgScroll = gsap.to(velvetBgRef.value, {
    y: () => window.innerHeight * 0.12,
    ease: 'none',
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  })
  cleanupFns.push({ revert: () => bgScroll.kill() })

  // 前景图片轻微前移
  const fgScroll = gsap.to(imageContainerRef.value, {
    y: () => window.innerHeight * 0.06,
    ease: 'none',
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  })
  cleanupFns.push({ revert: () => fgScroll.kill() })

  // 聚焦动画
  const focusTl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: 1.5,
    },
  })

  // 放大聚焦
  focusTl.fromTo(
    imageContainerRef.value,
    { scale: 1 },
    {
      scale: 1.03,
      duration: 1,
      ease: 'power1.inOut',
    }
  )

  // 收敛回落
  focusTl.to(
    imageContainerRef.value,
    {
      scale: 1.015,
      duration: 0.8,
      ease: 'power1.inOut',
    },
    1
  )

  cleanupFns.push({ revert: () => focusTl.kill() })

  // 亮度提升
  const brightnessTl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: 1.5,
    },
  })

  brightnessTl.fromTo(
    mainImgRef.value,
    { filter: 'brightness(0.9)' },
    {
      filter: 'brightness(1)',
      duration: 1,
      ease: 'power1.inOut',
    }
  )

  brightnessTl.to(
    mainImgRef.value,
    {
      filter: 'brightness(0.98)',
      duration: 0.8,
      ease: 'power1.inOut',
    },
    1
  )

  cleanupFns.push({ revert: () => brightnessTl.kill() })

  // 悬浮阴影加深
  const shadowTl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: 1.5,
    },
  })

  shadowTl.fromTo(
    shadowRef.value,
    { opacity: 0.3, scale: 0.95 },
    {
      opacity: 0.5,
      scale: 1,
      duration: 1,
      ease: 'power1.inOut',
    }
  )

  shadowTl.to(
    shadowRef.value,
    {
      opacity: 0.4,
      scale: 0.98,
      duration: 0.8,
      ease: 'power1.inOut',
    },
    1
  )

  cleanupFns.push({ revert: () => shadowTl.kill() })

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
.card-velvet-display {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: #0a0808;
}

.velvet-background {
  position: absolute;
  inset: -20%;
  width: 140%;
  height: 140%;
  z-index: 0;
}

.velvet-texture {
  position: absolute;
  inset: 0;
  background-color: #0d0a0a;
  background-image:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 1px,
      rgba(30, 20, 25, 0.4) 1px,
      rgba(30, 20, 25, 0.4) 2px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 1px,
      rgba(30, 20, 25, 0.3) 1px,
      rgba(30, 20, 25, 0.3) 2px
    );
}

.top-light {
  position: absolute;
  top: -20%;
  left: 30%;
  right: 30%;
  height: 60%;
  background: radial-gradient(
    ellipse 50% 80% at 50% 100%,
    rgba(255, 245, 235, 0.04) 0%,
    rgba(255, 240, 225, 0.02) 40%,
    transparent 70%
  );
  pointer-events: none;
}

.image-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70vw;
  max-width: 900px;
  height: 55vh;
  max-height: 580px;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.display-frame {
  position: relative;
  width: 100%;
  height: 100%;
  box-shadow:
    0 0 0 1px rgba(80, 60, 50, 0.2),
    0 30px 80px rgba(0, 0, 0, 0.6),
    0 10px 30px rgba(0, 0, 0, 0.4);
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.9);
}

.art-shadow {
  position: absolute;
  bottom: -15px;
  left: 5%;
  right: 5%;
  height: 30px;
  background: radial-gradient(
    ellipse 50% 100% at 50% 0%,
    rgba(0, 0, 0, 0.5) 0%,
    transparent 100%
  );
  filter: blur(8px);
  transform: scale(0.95);
}

.display-title {
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 20;
  opacity: 0;

  h2 {
    font-family: 'Playfair Display', 'Georgia', serif;
    font-size: clamp(24px, 4vw, 40px);
    font-weight: 400;
    color: #f0e8e0;
    margin: 0 0 10px;
    letter-spacing: 8px;
    text-transform: uppercase;
    text-shadow: 0 2px 20px rgba(200, 180, 160, 0.3);
  }

  p {
    font-family: 'Noto Serif SC', 'STSong', serif;
    font-size: clamp(12px, 2vw, 16px);
    color: rgba(200, 185, 175, 0.6);
    margin: 0;
    letter-spacing: 6px;
  }
}
</style>
