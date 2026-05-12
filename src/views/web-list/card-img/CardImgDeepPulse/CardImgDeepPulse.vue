<template>
  <section ref="parentRef" class="deep-pulse">
    <!-- 全屏背景 -->
    <div ref="bgContainerRef" class="deep-pulse__bg-container">
      <img
        ref="bgImageRef"
        class="deep-pulse__bg-image"
        :src="imageUrl"
        alt="Deep Space Background"
        draggable="false"
      />
      <!-- 暗角遮罩 -->
      <div ref="vignetteRef" class="deep-pulse__vignette" />
      <!-- 色温偏移层 -->
      <div ref="colorShiftRef" class="deep-pulse__color-shift" />
    </div>

    <!-- 内容层 -->
    <div ref="contentRef" class="deep-pulse__content">
      <!-- 标题 -->
      <h2 ref="titleRef" class="deep-pulse__title">
        <span class="deep-pulse__title-line">DEEP</span>
        <span class="deep-pulse__title-line deep-pulse__title-line--accent">SPACE</span>
        <span class="deep-pulse__title-line">PULSE</span>
      </h2>

      <!-- 副标题 -->
      <p ref="subtitleRef" class="deep-pulse__subtitle">
        感受宇宙的呼吸，聆听星辰的脉动
      </p>

      <!-- 装饰圆环 -->
      <div class="deep-pulse__rings">
        <div ref="ring1Ref" class="deep-pulse__ring deep-pulse__ring--1" />
        <div ref="ring2Ref" class="deep-pulse__ring deep-pulse__ring--2" />
        <div ref="ring3Ref" class="deep-pulse__ring deep-pulse__ring--3" />
      </div>
    </div>

    <!-- 星尘粒子 -->
    <div class="deep-pulse__particles">
      <div
        v-for="i in 50"
        :key="`star-${i}`"
        ref="starRefs"
        class="deep-pulse__star"
        :style="{
          '--sx': `${5 + Math.random() * 90}%`,
          '--sy': `${5 + Math.random() * 90}%`,
          '--ss': `${1.5 + Math.random() * 3}s`,
          '--sd': `${Math.random() * 5}s`,
          '--ssize': `${1 + Math.random() * 2}px`
        }"
      />
    </div>

    <!-- 底部信息 -->
    <div ref="footerRef" class="deep-pulse__footer">
      <div class="deep-pulse__footer-line" />
      <span class="deep-pulse__footer-text">DEEP SPACE OBSERVATORY</span>
      <div class="deep-pulse__footer-line" />
    </div>

    <!-- 角落装饰 -->
    <div class="deep-pulse__corner deep-pulse__corner--tl">
      <svg viewBox="0 0 60 60" fill="none">
        <path d="M0 60V0h60" stroke="currentColor" stroke-width="1" />
        <circle cx="5" cy="5" r="2" fill="currentColor" />
      </svg>
    </div>
    <div class="deep-pulse__corner deep-pulse__corner--br">
      <svg viewBox="0 0 60 60" fill="none">
        <path d="M60 0v60H0" stroke="currentColor" stroke-width="1" />
        <circle cx="55" cy="55" r="2" fill="currentColor" />
      </svg>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const imageUrl = 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=80'

const parentRef = ref<HTMLElement | null>(null)
const bgContainerRef = ref<HTMLElement | null>(null)
const bgImageRef = ref<HTMLElement | null>(null)
const vignetteRef = ref<HTMLElement | null>(null)
const colorShiftRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const ring1Ref = ref<HTMLElement | null>(null)
const ring2Ref = ref<HTMLElement | null>(null)
const ring3Ref = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const starRefs = ref<HTMLElement[]>([])

const cleanupFns: Array<{ kill: () => void }> = []
let breathTimeline: gsap.core.Timeline | null = null
let parallaxTimeline: gsap.core.Timeline | null = null
let entranceTimeline: gsap.core.Timeline | null = null

function initBreathingAnimation() {
  if (!bgContainerRef.value || !bgImageRef.value || !vignetteRef.value) return

  // 主呼吸 Timeline - 循环播放
  breathTimeline = gsap.timeline({ repeat: -1, yoyo: true })

  // 背景缩放 1.00 到 1.04，周期 7 秒
  breathTimeline!.to(
    bgImageRef.value,
    {
      scale: 1.04,
      duration: 3.5,
      ease: 'power1.inOut',
    },
    0
  )

  // 亮度与缩放错相 0.5 周期
  breathTimeline!.to(
    bgImageRef.value,
    {
      filter: 'brightness(1.15) saturate(1.1)',
      duration: 3.5,
      ease: 'power1.inOut',
    },
    1.75 // 错相 0.5 周期
  )

  // 暗角强度变化
  breathTimeline!.to(
    vignetteRef.value,
    {
      opacity: 0.5,
      duration: 3.5,
      ease: 'power1.inOut',
    },
    0
  )

  // 色温偏移
  if (colorShiftRef.value) {
    breathTimeline!.to(
      colorShiftRef.value,
      {
        background: 'radial-gradient(ellipse at center, rgba(255, 200, 150, 0.08) 0%, transparent 70%)',
        duration: 3.5,
        ease: 'power1.inOut',
      },
      0
    )

    breathTimeline!.to(
      colorShiftRef.value,
      {
        background: 'radial-gradient(ellipse at center, rgba(150, 180, 255, 0.08) 0%, transparent 70%)',
        duration: 3.5,
        ease: 'power1.inOut',
      },
      3.5 // 错相
    )
  }

  cleanupFns.push({ kill: () => breathTimeline?.kill() })
}

function initEntranceAnimation() {
  if (!contentRef.value || !titleRef.value || !subtitleRef.value) return

  const titleLines = titleRef.value.querySelectorAll('.deep-pulse__title-line')
  const rings = [ring1Ref.value, ring2Ref.value, ring3Ref.value].filter(Boolean)
  const footerLines = footerRef.value?.querySelectorAll('.deep-pulse__footer-line')

  entranceTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 80%',
      once: true,
    }
  })

  // 背景淡入
  entranceTimeline!.fromTo(
    bgContainerRef.value,
    { opacity: 0 },
    { opacity: 1, duration: 1.5, ease: 'power2.out' },
    0
  )

  // 标题行依次出现
  entranceTimeline!.fromTo(
    titleLines,
    {
      opacity: 0,
      y: 40,
      filter: 'blur(10px)',
    },
    {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
    },
    0.3
  )

  // 副标题
  entranceTimeline!.fromTo(
    subtitleRef.value,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
    0.8
  )

  // 圆环动画
  rings.forEach((ring, i) => {
    if (!ring) return
    entranceTimeline!.fromTo(
      ring,
      {
        scale: 0,
        opacity: 0,
      },
      {
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
      },
      0.5 + i * 0.2
    )
  })

  // Footer
  if (footerLines) {
    entranceTimeline!.fromTo(
      footerLines,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.8, ease: 'power2.out', stagger: 0.1 },
      1
    )
    entranceTimeline!.fromTo(
      footerRef.value?.querySelector('.deep-pulse__footer-text') as HTMLElement,
      { opacity: 0 },
      { opacity: 1, duration: 0.5 },
      1.2
    )
  }

  cleanupFns.push({ kill: () => entranceTimeline?.kill() })
}

function initParallaxAnimation() {
  if (!bgContainerRef.value || !parentRef.value) return

  parallaxTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 2,
    }
  })

  // 背景视差下移
  parallaxTimeline!.to(
    bgImageRef.value,
    {
      y: 80,
      duration: 1,
      ease: 'none',
    },
    0
  )

  // 暗角随滚动变化
  parallaxTimeline!.to(
    vignetteRef.value,
    {
      opacity: 0.8,
      duration: 1,
      ease: 'none',
    },
    0
  )

  // 内容层视差
  parallaxTimeline!.to(
    contentRef.value,
    {
      y: -50,
      duration: 1,
      ease: 'none',
    },
    0
  )

  cleanupFns.push({ kill: () => parallaxTimeline?.kill() })
}

function initRingsAnimation() {
  const rings = [ring1Ref.value, ring2Ref.value, ring3Ref.value].filter(Boolean) as HTMLElement[]

  rings.forEach((ring, i) => {
    const direction = i % 2 === 0 ? 1 : -1
    gsap.to(ring, {
      rotation: direction * (360 + i * 120),
      duration: 20 + i * 5,
      ease: 'none',
      repeat: -1,
    })

    gsap.to(ring, {
      scale: 1 + (i + 1) * 0.05,
      opacity: 0.3 - i * 0.08,
      duration: 4 + i,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    })
  })
}

function initStarTwinkle() {
  const stars = starRefs.value
  stars.forEach((star, i) => {
    gsap.to(star, {
      opacity: 0.2 + Math.random() * 0.6,
      scale: 0.5 + Math.random() * 1,
      duration: 1 + Math.random() * 2,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay: Math.random() * 3,
    })
  })
}

function handleMouseMove(e: MouseEvent) {
  if (!bgContainerRef.value || !contentRef.value) return

  const rect = parentRef.value!.getBoundingClientRect()
  const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2)
  const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2)

  // 背景跟随鼠标
  gsap.to(bgImageRef.value, {
    x: x * 30,
    y: y * 30,
    duration: 2,
    ease: 'power2.out',
  })

  // 暗角跟随鼠标偏移
  gsap.to(vignetteRef.value, {
    background: `radial-gradient(ellipse at ${50 + x * 20}% ${50 + y * 20}%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 40%, transparent 70%)`,
    duration: 1,
    ease: 'power2.out',
  })
}

function handleMouseLeave() {
  gsap.to(bgImageRef.value, {
    x: 0,
    y: 0,
    duration: 2,
    ease: 'elastic.out(1, 0.5)',
  })
}

onMounted(() => {
  // 初始化呼吸动画（无触发，自动播放）
  initBreathingAnimation()
  initRingsAnimation()
  initStarTwinkle()

  // 初始化入场动画（滚动触发）
  initEntranceAnimation()
  initParallaxAnimation()

  // 鼠标交互
  if (parentRef.value) {
    parentRef.value.addEventListener('mousemove', handleMouseMove)
    parentRef.value.addEventListener('mouseleave', handleMouseLeave)
  }
})

onUnmounted(() => {
  // 清理所有时间线
  cleanupFns.forEach(fn => fn.kill())
  breathTimeline?.kill()
  parallaxTimeline?.kill()
  entranceTimeline?.kill()

  // 清理 GSAP 动画
  gsap.killTweensOf([
    bgImageRef.value,
    vignetteRef.value,
    colorShiftRef.value,
    contentRef.value,
    ...starRefs.value,
  ])

  // 清理事件监听
  if (parentRef.value) {
    parentRef.value.removeEventListener('mousemove', handleMouseMove)
    parentRef.value.removeEventListener('mouseleave', handleMouseLeave)
  }

  // 清理 ScrollTrigger
  ScrollTrigger.getAll().forEach(st => {
    if (st.vars.trigger === parentRef.value) {
      st.kill()
    }
  })
})
</script>

<style scoped lang="scss">
.deep-pulse {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 50%, #0f0f2a 100%);
  cursor: crosshair;

  &__bg-container {
    position: absolute;
    inset: -5%;
    z-index: 1;
  }

  &__bg-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform-origin: center center;
    will-change: transform, filter;
  }

  &__vignette {
    position: absolute;
    inset: 0;
    background: radial-gradient(
      ellipse at center,
      rgba(0, 0, 0, 0.3) 0%,
      rgba(0, 0, 0, 0.5) 50%,
      rgba(0, 0, 0, 0.8) 100%
    );
    opacity: 0.6;
    pointer-events: none;
    will-change: opacity;
  }

  &__color-shift {
    position: absolute;
    inset: 0;
    background: radial-gradient(
      ellipse at center,
      rgba(200, 220, 255, 0.05) 0%,
      transparent 70%
    );
    pointer-events: none;
    mix-blend-mode: soft-light;
  }

  &__content {
    position: relative;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
    pointer-events: none;
  }

  &__title {
    display: flex;
    flex-direction: column;
    gap: 0.1em;
    margin: 0;
    font-family: 'Orbitron', 'Rajdhani', 'Segoe UI', sans-serif;
    font-size: clamp(3rem, 12vw, 8rem);
    font-weight: 900;
    letter-spacing: 0.15em;
    line-height: 1;
    color: transparent;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.95) 0%,
      rgba(200, 220, 255, 0.8) 50%,
      rgba(150, 180, 255, 0.6) 100%
    );
    background-clip: text;
    -webkit-background-clip: text;
    text-shadow: none;
    filter: drop-shadow(0 0 30px rgba(150, 180, 255, 0.5));

    &-line {
      display: block;

      &--accent {
        background: linear-gradient(
          180deg,
          rgba(255, 200, 150, 1) 0%,
          rgba(255, 150, 100, 0.9) 50%,
          rgba(200, 100, 150, 0.7) 100%
        );
        background-clip: text;
        -webkit-background-clip: text;
        filter: drop-shadow(0 0 40px rgba(255, 180, 150, 0.6));
      }
    }
  }

  &__subtitle {
    margin-top: 1.5rem;
    font-family: 'Noto Sans SC', 'Microsoft YaHei', sans-serif;
    font-size: clamp(0.9rem, 2vw, 1.2rem);
    font-weight: 300;
    letter-spacing: 0.3em;
    color: rgba(200, 220, 255, 0.7);
    text-shadow: 0 0 20px rgba(150, 180, 255, 0.4);
  }

  &__rings {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  &__ring {
    position: absolute;
    top: 50%;
    left: 50%;
    border-radius: 50%;
    border: 1px solid rgba(150, 180, 255, 0.3);
    transform: translate(-50%, -50%);

    &--1 {
      width: 300px;
      height: 300px;
      border-color: rgba(255, 200, 150, 0.4);
      box-shadow:
        0 0 20px rgba(255, 200, 150, 0.2),
        inset 0 0 30px rgba(255, 200, 150, 0.1);
    }

    &--2 {
      width: 450px;
      height: 450px;
      border-color: rgba(150, 180, 255, 0.3);
      box-shadow:
        0 0 30px rgba(150, 180, 255, 0.15),
        inset 0 0 40px rgba(150, 180, 255, 0.08);
    }

    &--3 {
      width: 600px;
      height: 600px;
      border-color: rgba(100, 150, 200, 0.2);
      box-shadow:
        0 0 40px rgba(100, 150, 200, 0.1),
        inset 0 0 50px rgba(100, 150, 200, 0.05);
    }
  }

  &__particles {
    position: absolute;
    inset: 0;
    z-index: 5;
    pointer-events: none;
  }

  &__star {
    position: absolute;
    left: var(--sx);
    top: var(--sy);
    width: var(--ssize);
    height: var(--ssize);
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.9) 0%,
      rgba(200, 220, 255, 0.6) 40%,
      transparent 70%
    );
    border-radius: 50%;
    box-shadow: 0 0 6px rgba(255, 255, 255, 0.5);
    animation: starTwinkle var(--ss) ease-in-out infinite;
    animation-delay: var(--sd);
  }

  &__footer {
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 20px;
    z-index: 20;

    &-line {
      width: 60px;
      height: 1px;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(150, 180, 255, 0.5),
        transparent
      );
    }

    &-text {
      font-family: 'Orbitron', 'Rajdhani', sans-serif;
      font-size: 10px;
      font-weight: 500;
      letter-spacing: 4px;
      color: rgba(150, 180, 255, 0.6);
      text-shadow: 0 0 10px rgba(150, 180, 255, 0.3);
    }
  }

  &__corner {
    position: absolute;
    width: 60px;
    height: 60px;
    z-index: 20;
    color: rgba(150, 180, 255, 0.4);

    &--tl {
      top: 20px;
      left: 20px;
    }

    &--br {
      bottom: 100px;
      right: 20px;
    }
  }
}

@keyframes starTwinkle {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

@media (max-width: 768px) {
  .deep-pulse {
    &__footer {
      bottom: 20px;

      &-line {
        width: 30px;
      }

      &-text {
        font-size: 8px;
        letter-spacing: 2px;
      }
    }

    &__ring {
      &--1 {
        width: 180px;
        height: 180px;
      }

      &--2 {
        width: 280px;
        height: 280px;
      }

      &--3 {
        width: 380px;
        height: 380px;
      }
    }

    &__corner {
      width: 40px;
      height: 40px;
    }
  }
}
</style>
