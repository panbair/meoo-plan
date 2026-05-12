<template>
  <div class="morning-mist" ref="parentRef">
    <!-- 晨雾背景层 -->
    <div class="mist-bg" ref="bgRef"></div>

    <!-- 雾气纹理 -->
    <div class="mist-texture"></div>

    <!-- 主图容器 -->
    <div class="mist-container" ref="containerRef">
      <div class="mist-image" ref="imageRef">
        <img :src="imageUrl" alt="Morning Memory" />
        <div class="image-frost"></div>
        <div class="image-glow" ref="glowRef"></div>
      </div>
    </div>

    <!-- 标题 -->
    <div class="mist-title" ref="titleRef">
      <span class="title-cn">晨雾弥散</span>
      <span class="title-en">MORNING MIST</span>
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

const imageUrl = 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=1200&q=80'

const parentRef = ref<HTMLElement | null>(null)
const bgRef = ref<HTMLElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const imageRef = ref<HTMLElement | null>(null)
const glowRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)

const cleanupFns: TweenCleanup[] = []

onMounted(() => {
  if (!parentRef.value || !containerRef.value || !imageRef.value) return

  const ctx = gsap.context(() => {
    // 初始化状态（雾气笼罩、偏右悬浮）
    gsap.set(containerRef.value, {
      x: 20,
      opacity: 0,
    })

    gsap.set(imageRef.value, {
      filter: 'blur(15px) brightness(0.9)',
    })

    gsap.set(glowRef.value, {
      opacity: 0.6,
    })

    gsap.set(titleRef.value, {
      opacity: 0,
      y: 20,
    })

    // 创建 ScrollTrigger 时间线
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: parentRef.value,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1.5,
      },
    })

    // 画面淡入
    tl.to(containerRef.value, {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out',
    }, 0)

    // 雾气弥散 + 回正位移（主动画）
    tl.to(imageRef.value, {
      filter: 'blur(0px) brightness(1)',
      x: 0,
      duration: 2.5,
      ease: 'sine.inOut',
    }, 0)

    tl.to(containerRef.value, {
      x: 0,
      duration: 2.5,
      ease: 'sine.inOut',
    }, 0)

    // 锐化过冲（模糊消退至90%时）
    tl.to(
      imageRef.value,
      {
        filter: 'blur(-0.3px) brightness(1.02)',
        duration: 0.15,
        ease: 'power2.out',
      },
      2.2
    )

    tl.to(
      imageRef.value,
      {
        filter: 'blur(0px) brightness(1)',
        duration: 0.2,
        ease: 'power2.out',
      },
      2.35
    )

    // 柔光镶边渐隐
    tl.to(glowRef.value, {
      opacity: 0,
      duration: 1.5,
      ease: 'power2.out',
    }, 0.5)

    // 标题淡入
    tl.to(titleRef.value, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
    }, 1.5)

    // 背景微移
    tl.to(bgRef.value, {
      y: -20,
      duration: 1,
      ease: 'none',
    }, 0)

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
.morning-mist {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    #e8e0d8 0%,
    #f5f0eb 30%,
    #faf8f5 60%,
    #f0ebe5 100%
  );
}

.mist-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 30% 70%, rgba(200, 190, 180, 0.3) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 30%, rgba(255, 250, 245, 0.5) 0%, transparent 40%);
  will-change: transform;
}

.mist-texture {
  position: absolute;
  inset: 0;
  background:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 3px,
      rgba(255, 255, 255, 0.02) 3px,
      rgba(255, 255, 255, 0.02) 4px
    );
  pointer-events: none;
  opacity: 0.8;
}

.mist-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  will-change: transform, opacity;
}

.mist-image {
  position: relative;
  width: 60vw;
  max-width: 850px;
  aspect-ratio: 4 / 3;
  border-radius: 6px;
  overflow: hidden;
  box-shadow:
    0 30px 80px rgba(80, 70, 60, 0.15),
    0 60px 120px rgba(80, 70, 60, 0.08);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: saturate(0.9);
  }
}

.image-frost {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.05) 50%,
    rgba(255, 255, 255, 0.15) 100%
  );
  pointer-events: none;
  border-radius: 6px;
}

.image-glow {
  position: absolute;
  inset: -3px;
  border-radius: 8px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.3) 0%,
    transparent 30%,
    transparent 70%,
    rgba(255, 255, 255, 0.2) 100%
  );
  pointer-events: none;
  will-change: opacity;
}

.mist-title {
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 10;
  will-change: transform, opacity;

  .title-cn {
    display: block;
    font-size: 28px;
    font-weight: 600;
    color: #5a504a;
    letter-spacing: 8px;
    text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
    margin-bottom: 8px;
  }

  .title-en {
    display: block;
    font-size: 12px;
    font-weight: 400;
    color: rgba(90, 80, 74, 0.5);
    letter-spacing: 6px;
    text-transform: uppercase;
  }
}
</style>
