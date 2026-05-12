<template>
  <section ref="parentRef" class="nebula-breath">
    <!-- 全屏星云背景 -->
    <div ref="nebulaLayerRef" class="nebula-breath__nebula-layer">
      <img
        ref="nebulaImageRef"
        class="nebula-breath__nebula-image"
        :src="imageUrl"
        alt="Nebula Background"
        draggable="false"
      />
      <!-- 星云暗带 -->
      <div ref="dustBandRef" class="nebula-breath__dust-band" />
    </div>

    <!-- 恒星层 -->
    <div ref="starsLayerRef" class="nebula-breath__stars-layer">
      <div
        v-for="i in 80"
        :key="`star-${i}`"
        :ref="el => setStarRef(el, i)"
        class="nebula-breath__star"
        :style="getStarStyle(i)"
      />
    </div>

    <!-- 星云光晕 -->
    <div ref="glowLayerRef" class="nebula-breath__glow-layer">
      <div class="nebula-breath__glow nebula-breath__glow--1" />
      <div class="nebula-breath__glow nebula-breath__glow--2" />
      <div class="nebula-breath__glow nebula-breath__glow--3" />
    </div>

    <!-- 四角暗角 -->
    <div ref="vignetteRef" class="nebula-breath__vignette" />

    <!-- 内容层 -->
    <div ref="contentRef" class="nebula-breath__content">
      <div class="nebula-breath__label">
        <span class="nebula-breath__label-text">DEEP SPACE OBSERVATORY</span>
      </div>
      <h2 ref="titleRef" class="nebula-breath__title">
        <span class="nebula-breath__title-line">NEBULA</span>
        <span class="nebula-breath__title-line nebula-breath__title-line--accent">BREATH</span>
      </h2>
      <p ref="subtitleRef" class="nebula-breath__subtitle">
        感受宇宙的呼吸，聆听星辰的脉动
      </p>
    </div>

    <!-- 底部装饰 -->
    <div ref="footerRef" class="nebula-breath__footer">
      <div class="nebula-breath__footer-line" />
      <span class="nebula-breath__footer-text">UNIVERSE SCALE · 138 BILLION LIGHT YEARS</span>
      <div class="nebula-breath__footer-line" />
    </div>

    <!-- 星尘粒子 -->
    <div class="nebula-breath__particles">
      <div
        v-for="i in 30"
        :key="`dust-${i}`"
        class="nebula-breath__dust"
        :style="{
          '--dx': `${Math.random() * 100}%`,
          '--dy': `${Math.random() * 100}%`,
          '--ds': `${4 + Math.random() * 6}s`,
          '--dd': `${Math.random() * 5}s`,
          '--dsize': `${1 + Math.random() * 2}px`
        }"
      />
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
const nebulaLayerRef = ref<HTMLElement | null>(null)
const nebulaImageRef = ref<HTMLElement | null>(null)
const dustBandRef = ref<HTMLElement | null>(null)
const starsLayerRef = ref<HTMLElement | null>(null)
const glowLayerRef = ref<HTMLElement | null>(null)
const vignetteRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)

const starRefs = ref<(HTMLElement | null)[]>([])
const setStarRef = (el: any, i: number) => { if (el) starRefs.value[i] = el }

const cleanupFns: Array<{ kill: () => void }> = []
let breathTimeline: gsap.core.Timeline | null = null
let starTimelines: gsap.core.Tween[] = []
let parallaxTimeline: gsap.core.Timeline | null = null
let entranceTimeline: gsap.core.Timeline | null = null

function getStarStyle(i: number) {
  const x = (i * 17 + Math.random() * 30) % 100
  const y = (i * 23 + Math.random() * 20) % 100
  const size = 1 + (i % 4) * 0.5
  const hue = 220 + (i % 3) * 30 // 冷蓝到暖紫

  return {
    left: `${x}%`,
    top: `${y}%`,
    width: `${size}px`,
    height: `${size}px`,
    background: `radial-gradient(circle, hsla(${hue}, 80%, 90%, 1) 0%, hsla(${hue}, 70%, 70%, 0.6) 40%, transparent 70%)`,
    boxShadow: `0 0 ${size * 2}px hsla(${hue}, 80%, 80%, 0.5)`,
  }
}

function initBreathingAnimation() {
  if (!nebulaImageRef.value || !vignetteRef.value || !glowLayerRef.value) return

  // 主呼吸 Timeline - 8秒不对称周期
  // 吸气5秒 + 呼气3秒 = 8秒
  breathTimeline = gsap.timeline({ repeat: -1 })

  // 吸气阶段 (0-5秒) - scale 1 -> 1.025
  breathTimeline!.to(
    nebulaImageRef.value,
    {
      scale: 1.025,
      duration: 5,
      ease: 'power1.inOut',
    },
    0
  )

  // 呼气阶段 (5-8秒) - scale 1.025 -> 1
  breathTimeline!.to(
    nebulaImageRef.value,
    {
      scale: 1,
      duration: 3,
      ease: 'power1.inOut',
    },
    5
  )

  // 亮度与缩放错相 0.3 周期
  breathTimeline!.to(
    nebulaImageRef.value,
    {
      filter: 'brightness(1.12) saturate(1.15) hue-rotate(8deg)',
      duration: 5,
      ease: 'power1.inOut',
    },
    1.5 // 错相 0.3 周期
  )
  breathTimeline!.to(
    nebulaImageRef.value,
    {
      filter: 'brightness(0.92) saturate(0.9) hue-rotate(-5deg)',
      duration: 3,
      ease: 'power1.inOut',
    },
    6.5
  )

  // 色温漂移 - 冷蓝到暖紫
  breathTimeline!.to(
    nebulaImageRef.value,
    {
      filter: 'hue-rotate(10deg) saturate(1.1)',
      duration: 8,
      ease: 'sine.inOut',
    },
    0
  )

  // 暗角呼吸 - 与缩放同步
  breathTimeline!.to(
    vignetteRef.value,
    {
      opacity: 0.5,
      duration: 5,
      ease: 'power1.inOut',
    },
    0
  )
  breathTimeline!.to(
    vignetteRef.value,
    {
      opacity: 0.3,
      duration: 3,
      ease: 'power1.inOut',
    },
    5
  )

  // 星云光晕呼吸
  const glows = glowLayerRef.value?.querySelectorAll('.nebula-breath__glow') as NodeListOf<HTMLElement>
  if (glows) {
    glows.forEach((glow, i) => {
      const phase = i * 0.3
      breathTimeline!.to(
        glow,
        {
          opacity: 0.4 + i * 0.1,
          scale: 1.05,
          duration: 5,
          ease: 'power1.inOut',
        },
        phase
      )
      breathTimeline!.to(
        glow,
        {
          opacity: 0.2 + i * 0.05,
          scale: 1,
          duration: 3,
          ease: 'power1.inOut',
        },
        5 + phase
      )
    })
  }

  // 星云暗带微幅漂移 ±3px
  breathTimeline!.to(
    dustBandRef.value,
    {
      backgroundPositionX: '+=3px',
      duration: 8,
      ease: 'sine.inOut',
    },
    0
  )

  cleanupFns.push({ kill: () => breathTimeline?.kill() })
}

function initStarAnimation() {
  const stars = starRefs.value.filter(Boolean) as HTMLElement[]

  stars.forEach((star, i) => {
    // 每颗星独立呼吸，偏离主周期
    const duration = 2 + Math.random() * 4
    const delay = Math.random() * 3

    const tween = gsap.to(star, {
      opacity: 0.3 + Math.random() * 0.5,
      scale: 0.6 + Math.random() * 0.6,
      boxShadow: `0 0 ${3 + Math.random() * 6}px rgba(180, 200, 255, ${0.3 + Math.random() * 0.4})`,
      duration,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay,
    })

    starTimelines.push(tween)
  })
}

function initEntranceAnimation() {
  if (!contentRef.value || !titleRef.value || !subtitleRef.value || !footerRef.value) return

  const titleLines = titleRef.value.querySelectorAll('.nebula-breath__title-line')

  entranceTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 80%',
      once: true,
    }
  })

  // 星云层淡入
  entranceTimeline!.fromTo(
    nebulaLayerRef.value,
    { opacity: 0 },
    { opacity: 1, duration: 2, ease: 'power2.out' },
    0
  )

  // 恒星层淡入
  entranceTimeline!.fromTo(
    starsLayerRef.value,
    { opacity: 0 },
    { opacity: 1, duration: 1.5, ease: 'power2.out' },
    0.3
  )

  // 标题行
  entranceTimeline!.fromTo(
    titleLines,
    {
      opacity: 0,
      y: 60,
      filter: 'blur(10px)',
    },
    {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out',
    },
    0.5
  )

  // 副标题
  entranceTimeline!.fromTo(
    subtitleRef.value,
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
    1
  )

  // Label
  entranceTimeline!.fromTo(
    contentRef.value.querySelector('.nebula-breath__label') as HTMLElement,
    { opacity: 0, y: -20 },
    { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
    0.3
  )

  // Footer
  entranceTimeline!.fromTo(
    footerRef.value,
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
    1.2
  )

  cleanupFns.push({ kill: () => entranceTimeline?.kill() })
}

function initParallaxAnimation() {
  if (!parentRef.value || !nebulaImageRef.value || !starsLayerRef.value) return

  parallaxTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 2,
    }
  })

  // 星云层视差
  parallaxTimeline!.to(
    nebulaImageRef.value,
    {
      y: 120,
      duration: 1,
      ease: 'none',
    },
    0
  )

  // 恒星层视差
  parallaxTimeline!.to(
    starsLayerRef.value,
    {
      y: -60,
      duration: 1,
      ease: 'none',
    },
    0
  )

  // 内容层视差
  parallaxTimeline!.to(
    contentRef.value,
    {
      y: -100,
      duration: 1,
      ease: 'none',
    },
    0
  )

  cleanupFns.push({ kill: () => parallaxTimeline?.kill() })
}

function handleMouseMove(e: MouseEvent) {
  if (!parentRef.value || !nebulaImageRef.value || !starsLayerRef.value) return

  const rect = parentRef.value.getBoundingClientRect()
  const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2)
  const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2)

  // 星云跟随鼠标
  gsap.to(nebulaImageRef.value, {
    x: x * 50,
    y: y * 40,
    duration: 2.5,
    ease: 'power2.out',
  })

  // 恒星跟随鼠标（速度不同）
  gsap.to(starsLayerRef.value, {
    x: x * 25,
    y: y * 20,
    duration: 2,
    ease: 'power2.out',
  })

  // 光晕跟随鼠标
  gsap.to(glowLayerRef.value, {
    x: x * 80,
    y: y * 60,
    duration: 1.5,
    ease: 'power2.out',
  })
}

function handleMouseLeave() {
  gsap.to(nebulaImageRef.value, {
    x: 0,
    y: 0,
    duration: 3,
    ease: 'elastic.out(1, 0.5)',
  })

  gsap.to(starsLayerRef.value, {
    x: 0,
    y: 0,
    duration: 2.5,
    ease: 'elastic.out(1, 0.5)',
  })

  gsap.to(glowLayerRef.value, {
    x: 0,
    y: 0,
    duration: 2,
    ease: 'elastic.out(1, 0.5)',
  })
}

onMounted(() => {
  // 初始化呼吸动画（自动播放）
  initBreathingAnimation()
  initStarAnimation()

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

  // 清理星动画
  starTimelines.forEach(tween => tween.kill())
  starTimelines = []

  // 清理 GSAP 动画
  gsap.killTweensOf([
    nebulaImageRef.value,
    starsLayerRef.value,
    glowLayerRef.value,
    vignetteRef.value,
    dustBandRef.value,
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
.nebula-breath {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #050510 0%, #0a0a20 50%, #050515 100%);
  cursor: crosshair;

  &__nebula-layer {
    position: absolute;
    inset: -5%;
    z-index: 1;
  }

  &__nebula-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform-origin: center center;
    will-change: transform, filter;
  }

  &__dust-band {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      transparent 0%,
      rgba(10, 10, 30, 0.3) 30%,
      rgba(10, 10, 30, 0.4) 50%,
      rgba(10, 10, 30, 0.3) 70%,
      transparent 100%
    );
    background-size: 100% 200%;
    background-position: 0 0;
    pointer-events: none;
  }

  // 恒星层
  &__stars-layer {
    position: absolute;
    inset: 0;
    z-index: 2;
    pointer-events: none;
    will-change: transform;
  }

  &__star {
    position: absolute;
    border-radius: 50%;
    will-change: opacity, transform;
  }

  // 光晕层
  &__glow-layer {
    position: absolute;
    inset: 0;
    z-index: 3;
    pointer-events: none;
    will-change: transform, opacity;
  }

  &__glow {
    position: absolute;
    border-radius: 50%;
    mix-blend-mode: screen;

    &--1 {
      top: 20%;
      left: 30%;
      width: 400px;
      height: 400px;
      background: radial-gradient(
        circle,
        rgba(150, 120, 200, 0.3) 0%,
        rgba(100, 80, 180, 0.15) 40%,
        transparent 70%
      );
      filter: blur(60px);
      opacity: 0.3;
    }

    &--2 {
      top: 40%;
      right: 20%;
      width: 300px;
      height: 300px;
      background: radial-gradient(
        circle,
        rgba(80, 150, 200, 0.25) 0%,
        rgba(60, 120, 180, 0.12) 40%,
        transparent 70%
      );
      filter: blur(50px);
      opacity: 0.25;
    }

    &--3 {
      bottom: 20%;
      left: 40%;
      width: 350px;
      height: 350px;
      background: radial-gradient(
        circle,
        rgba(180, 100, 180, 0.2) 0%,
        rgba(150, 80, 160, 0.1) 40%,
        transparent 70%
      );
      filter: blur(55px);
      opacity: 0.2;
    }
  }

  // 四角暗角
  &__vignette {
    position: absolute;
    inset: 0;
    background: radial-gradient(
      ellipse at center,
      transparent 15%,
      rgba(5, 5, 16, 0.4) 50%,
      rgba(5, 5, 16, 0.85) 100%
    );
    opacity: 0.4;
    z-index: 4;
    pointer-events: none;
    will-change: opacity;
  }

  // 内容层
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

  &__label {
    margin-bottom: 1rem;

    &-text {
      font-family: 'Orbitron', 'Rajdhani', sans-serif;
      font-size: clamp(0.55rem, 1vw, 0.75rem);
      font-weight: 500;
      letter-spacing: 0.5em;
      color: rgba(180, 200, 255, 0.5);
      text-shadow: 0 0 20px rgba(150, 180, 255, 0.3);
    }
  }

  &__title {
    display: flex;
    flex-direction: column;
    gap: 0.05em;
    margin: 0;
    font-family: 'Orbitron', 'Rajdhani', 'Segoe UI', sans-serif;
    font-size: clamp(3.5rem, 14vw, 9rem);
    font-weight: 900;
    letter-spacing: 0.1em;
    line-height: 0.95;
    color: transparent;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.95) 0%,
      rgba(200, 220, 255, 0.85) 50%,
      rgba(150, 180, 255, 0.65) 100%
    );
    background-clip: text;
    -webkit-background-clip: text;
    filter: drop-shadow(0 0 40px rgba(150, 180, 255, 0.4));

    &-line {
      display: block;

      &--accent {
        background: linear-gradient(
          180deg,
          rgba(180, 150, 255, 1) 0%,
          rgba(150, 100, 200, 0.9) 50%,
          rgba(120, 80, 180, 0.7) 100%
        );
        background-clip: text;
        -webkit-background-clip: text;
        filter: drop-shadow(0 0 50px rgba(150, 100, 200, 0.5));
      }
    }
  }

  &__subtitle {
    margin-top: 1.5rem;
    font-family: 'Noto Sans SC', 'Microsoft YaHei', sans-serif;
    font-size: clamp(0.85rem, 1.8vw, 1.1rem);
    font-weight: 300;
    letter-spacing: 0.3em;
    color: rgba(180, 200, 255, 0.55);
    text-shadow: 0 0 25px rgba(150, 180, 255, 0.3);
  }

  // 底部装饰
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
      width: 80px;
      height: 1px;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(150, 180, 255, 0.4),
        transparent
      );
    }

    &-text {
      font-family: 'Orbitron', 'Rajdhani', sans-serif;
      font-size: 8px;
      font-weight: 500;
      letter-spacing: 3px;
      color: rgba(150, 180, 255, 0.4);
      text-shadow: 0 0 15px rgba(150, 180, 255, 0.2);
    }
  }

  // 星尘粒子
  &__particles {
    position: absolute;
    inset: 0;
    z-index: 5;
    pointer-events: none;
    overflow: hidden;
  }

  &__dust {
    position: absolute;
    left: var(--dx);
    top: var(--dy);
    width: var(--dsize);
    height: var(--dsize);
    background: radial-gradient(
      circle,
      rgba(200, 220, 255, 0.6) 0%,
      rgba(180, 200, 255, 0.3) 40%,
      transparent 70%
    );
    border-radius: 50%;
    box-shadow: 0 0 4px rgba(200, 220, 255, 0.3);
    animation: dustFloat var(--ds) ease-in-out infinite;
    animation-delay: var(--dd);
  }
}

@keyframes dustFloat {
  0%,
  100% {
    transform: translateY(0) translateX(0) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-25px) translateX(10px) scale(1.2);
    opacity: 0.6;
  }
}

@media (max-width: 768px) {
  .nebula-breath {
    &__footer {
      bottom: 20px;

      &-line {
        width: 40px;
      }

      &-text {
        font-size: 6px;
        letter-spacing: 2px;
      }
    }

    &__glow {
      &--1 {
        width: 200px;
        height: 200px;
      }

      &--2 {
        width: 150px;
        height: 150px;
      }

      &--3 {
        width: 180px;
        height: 180px;
      }
    }
  }
}
</style>
