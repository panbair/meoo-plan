<template>
  <section ref="parentRef" class="cloud-tide">
    <!-- 全屏背景层 -->
    <div ref="bgLayerRef" class="cloud-tide__bg-layer">
      <img
        ref="mainImageRef"
        class="cloud-tide__main-image"
        :src="imageUrl"
        alt="Cloud Tide Background"
        draggable="false"
      />
    </div>

    <!-- 云层叠加层 -->
    <div ref="cloudLayerRef" class="cloud-tide__cloud-layer">
      <div class="cloud-tide__cloud cloud-tide__cloud--1" />
      <div class="cloud-tide__cloud cloud-tide__cloud--2" />
      <div class="cloud-tide__cloud cloud-tide__cloud--3" />
    </div>

    <!-- 丁达尔光束层 -->
    <div ref="beamLayerRef" class="cloud-tide__beam-layer">
      <div ref="beam1Ref" class="cloud-tide__beam cloud-tide__beam--1" />
      <div ref="beam2Ref" class="cloud-tide__beam cloud-tide__beam--2" />
      <div ref="beam3Ref" class="cloud-tide__beam cloud-tide__beam--3" />
      <div ref="beam4Ref" class="cloud-tide__beam cloud-tide__beam--4" />
    </div>

    <!-- 四角柔光 -->
    <div ref="cornerLightRef" class="cloud-tide__corner-lights">
      <div class="cloud-tide__corner cloud-tide__corner--tl" />
      <div class="cloud-tide__corner cloud-tide__corner--tr" />
      <div class="cloud-tide__corner cloud-tide__corner--bl" />
      <div class="cloud-tide__corner cloud-tide__corner--br" />
    </div>

    <!-- 暗角遮罩 -->
    <div ref="vignetteRef" class="cloud-tide__vignette" />

    <!-- 内容层 -->
    <div ref="contentRef" class="cloud-tide__content">
      <div class="cloud-tide__label">
        <span class="cloud-tide__label-text">ATMOSPHERIC PHENOMENA</span>
      </div>
      <h2 ref="titleRef" class="cloud-tide__title">
        <span class="cloud-tide__title-line">CLOUD</span>
        <span class="cloud-tide__title-line cloud-tide__title-line--accent">TIDE</span>
      </h2>
      <p ref="subtitleRef" class="cloud-tide__subtitle">
        感受云层的呼吸，聆听光与影的对话
      </p>
    </div>

    <!-- 光斑装饰 -->
    <div ref="flareRef" class="cloud-tide__flare" />

    <!-- 底部装饰 -->
    <div ref="footerRef" class="cloud-tide__footer">
      <div class="cloud-tide__footer-bar">
        <div class="cloud-tide__footer-dot" />
        <span class="cloud-tide__footer-text">HEAVENLY ATMOSPHERE</span>
        <div class="cloud-tide__footer-dot" />
      </div>
    </div>

    <!-- 粒子层 -->
    <div class="cloud-tide__particles">
      <div
        v-for="i in 40"
        :key="`mist-${i}`"
        class="cloud-tide__mist"
        :style="{
          '--mx': `${5 + Math.random() * 90}%`,
          '--my': `${5 + Math.random() * 90}%`,
          '--ms': `${3 + Math.random() * 5}s`,
          '--md': `${Math.random() * 4}s`,
          '--msize': `${20 + Math.random() * 40}px`
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

const imageUrl = 'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?w=1920&q=80'

const parentRef = ref<HTMLElement | null>(null)
const bgLayerRef = ref<HTMLElement | null>(null)
const mainImageRef = ref<HTMLElement | null>(null)
const cloudLayerRef = ref<HTMLElement | null>(null)
const beamLayerRef = ref<HTMLElement | null>(null)
const beam1Ref = ref<HTMLElement | null>(null)
const beam2Ref = ref<HTMLElement | null>(null)
const beam3Ref = ref<HTMLElement | null>(null)
const beam4Ref = ref<HTMLElement | null>(null)
const cornerLightRef = ref<HTMLElement | null>(null)
const vignetteRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const flareRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)

const cleanupFns: Array<{ kill: () => void }> = []
let breathTimeline: gsap.core.Timeline | null = null
let parallaxTimeline: gsap.core.Timeline | null = null
let entranceTimeline: gsap.core.Timeline | null = null

function initBreathingAnimation() {
  if (!mainImageRef.value || !beamLayerRef.value || !vignetteRef.value || !cornerLightRef.value) return

  // 主呼吸 Timeline - 7秒周期，极度柔和
  breathTimeline = gsap.timeline({ repeat: -1, yoyo: true })

  // 背景缩放 1.00 -> 1.03
  breathTimeline!.to(
    mainImageRef.value,
    {
      scale: 1.03,
      duration: 3.5,
      ease: 'power1.inOut',
    },
    0
  )

  // 光束透明度 - 与缩放错相 0.5 周期
  breathTimeline!.to(
    beam1Ref.value,
    {
      opacity: 0.5,
      duration: 3.5,
      ease: 'power1.inOut',
    },
    1.75
  )
  breathTimeline!.to(
    beam2Ref.value,
    {
      opacity: 0.45,
      duration: 3.5,
      ease: 'power1.inOut',
    },
    2
  )
  breathTimeline!.to(
    beam3Ref.value,
    {
      opacity: 0.55,
      duration: 3.5,
      ease: 'power1.inOut',
    },
    1.5
  )
  breathTimeline!.to(
    beam4Ref.value,
    {
      opacity: 0.4,
      duration: 3.5,
      ease: 'power1.inOut',
    },
    2.25
  )

  // 色温偏移 - hue-rotate ±5 度
  breathTimeline!.to(
    mainImageRef.value,
    {
      filter: 'brightness(1.1) saturate(1.1) hue-rotate(5deg)',
      duration: 3.5,
      ease: 'power1.inOut',
    },
    0
  )
  breathTimeline!.to(
    mainImageRef.value,
    {
      filter: 'brightness(0.95) saturate(0.95) hue-rotate(-5deg)',
      duration: 3.5,
      ease: 'power1.inOut',
    },
    3.5
  )

  // 暗角呼吸
  breathTimeline!.to(
    vignetteRef.value,
    {
      opacity: 0.7,
      duration: 3.5,
      ease: 'power1.inOut',
    },
    0
  )
  breathTimeline!.to(
    vignetteRef.value,
    {
      opacity: 0.5,
      duration: 3.5,
      ease: 'power1.inOut',
    },
    3.5
  )

  // 四角柔光呼吸
  const corners = cornerLightRef.value?.querySelectorAll('.cloud-tide__corner') as NodeListOf<HTMLElement>
  if (corners) {
    corners.forEach((corner, i) => {
      breathTimeline!.to(
        corner,
        {
          opacity: 0.6 + i * 0.1,
          duration: 3.5,
          ease: 'power1.inOut',
        },
        i * 0.5
      )
      breathTimeline!.to(
        corner,
        {
          opacity: 0.3 + i * 0.05,
          duration: 3.5,
          ease: 'power1.inOut',
        },
        3.5 + i * 0.5
      )
    })
  }

  cleanupFns.push({ kill: () => breathTimeline?.kill() })
}

function initCloudAnimation() {
  if (!cloudLayerRef.value) return

  const clouds = cloudLayerRef.value.querySelectorAll('.cloud-tide__cloud')
  clouds.forEach((cloud, i) => {
    // 云层缓慢漂移
    gsap.to(cloud, {
      x: 50 + i * 20,
      y: 20 + i * 10,
      opacity: 0.15 + i * 0.05,
      duration: 15 + i * 5,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    })
  })
}

function initEntranceAnimation() {
  if (!contentRef.value || !titleRef.value || !subtitleRef.value || !footerRef.value) return

  const titleLines = titleRef.value.querySelectorAll('.cloud-tide__title-line')

  entranceTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 80%',
      once: true,
    }
  })

  // 背景淡入
  entranceTimeline!.fromTo(
    bgLayerRef.value,
    { opacity: 0 },
    { opacity: 1, duration: 2, ease: 'power2.out' },
    0
  )

  // 标题行
  entranceTimeline!.fromTo(
    titleLines,
    {
      opacity: 0,
      y: 50,
      filter: 'blur(8px)',
    },
    {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out',
    },
    0.3
  )

  // 副标题
  entranceTimeline!.fromTo(
    subtitleRef.value,
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
    0.8
  )

  // Label
  entranceTimeline!.fromTo(
    contentRef.value.querySelector('.cloud-tide__label') as HTMLElement,
    { opacity: 0, y: -20 },
    { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
    0
  )

  // Footer
  entranceTimeline!.fromTo(
    footerRef.value,
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
    1
  )

  cleanupFns.push({ kill: () => entranceTimeline?.kill() })
}

function initParallaxAnimation() {
  if (!parentRef.value || !mainImageRef.value || !beamLayerRef.value) return

  parallaxTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 2,
    }
  })

  // 背景视差
  parallaxTimeline!.to(
    mainImageRef.value,
    {
      y: 100,
      duration: 1,
      ease: 'none',
    },
    0
  )

  // 光束视差
  parallaxTimeline!.to(
    beamLayerRef.value,
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
      y: -80,
      duration: 1,
      ease: 'none',
    },
    0
  )

  cleanupFns.push({ kill: () => parallaxTimeline?.kill() })
}

function initFlareAnimation() {
  if (!flareRef.value) return

  gsap.to(flareRef.value, {
    opacity: 0.3,
    scale: 1.2,
    duration: 4,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true,
  })
}

function handleMouseMove(e: MouseEvent) {
  if (!parentRef.value || !mainImageRef.value) return

  const rect = parentRef.value.getBoundingClientRect()
  const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2)
  const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2)

  // 背景跟随鼠标
  gsap.to(mainImageRef.value, {
    x: x * 40,
    y: y * 30,
    duration: 2.5,
    ease: 'power2.out',
  })

  // 光束跟随鼠标
  gsap.to(beamLayerRef.value, {
    x: x * 20,
    y: y * 15,
    duration: 2,
    ease: 'power2.out',
  })

  // 光斑跟随
  gsap.to(flareRef.value, {
    x: x * 100,
    y: y * 80,
    duration: 1.5,
    ease: 'power2.out',
  })
}

function handleMouseLeave() {
  gsap.to(mainImageRef.value, {
    x: 0,
    y: 0,
    duration: 3,
    ease: 'elastic.out(1, 0.5)',
  })

  gsap.to(beamLayerRef.value, {
    x: 0,
    y: 0,
    duration: 2.5,
    ease: 'elastic.out(1, 0.5)',
  })

  gsap.to(flareRef.value, {
    x: 0,
    y: 0,
    duration: 2,
    ease: 'elastic.out(1, 0.5)',
  })
}

onMounted(() => {
  // 初始化呼吸动画（自动播放）
  initBreathingAnimation()
  initCloudAnimation()
  initFlareAnimation()

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
    mainImageRef.value,
    beamLayerRef.value,
    vignetteRef.value,
    cornerLightRef.value,
    flareRef.value,
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
.cloud-tide {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #1a2a4a 0%, #2d3a5a 50%, #1a2a3a 100%);
  cursor: crosshair;

  &__bg-layer {
    position: absolute;
    inset: -5%;
    z-index: 1;
  }

  &__main-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform-origin: center center;
    will-change: transform, filter;
  }

  // 云层叠加
  &__cloud-layer {
    position: absolute;
    inset: 0;
    z-index: 2;
    pointer-events: none;
    mix-blend-mode: soft-light;
  }

  &__cloud {
    position: absolute;
    border-radius: 50%;
    background: radial-gradient(
      ellipse at center,
      rgba(255, 255, 255, 0.4) 0%,
      rgba(255, 255, 255, 0.2) 40%,
      transparent 70%
    );
    filter: blur(40px);

    &--1 {
      top: 10%;
      left: -10%;
      width: 60%;
      height: 40%;
      opacity: 0.3;
    }

    &--2 {
      top: 30%;
      right: -15%;
      width: 50%;
      height: 50%;
      opacity: 0.25;
    }

    &--3 {
      bottom: 20%;
      left: 20%;
      width: 70%;
      height: 35%;
      opacity: 0.2;
    }
  }

  // 丁达尔光束
  &__beam-layer {
    position: absolute;
    inset: 0;
    z-index: 3;
    pointer-events: none;
    mix-blend-mode: screen;
  }

  &__beam {
    position: absolute;
    opacity: 0.35;
    will-change: opacity;

    &--1 {
      top: -30%;
      left: 15%;
      width: 400px;
      height: 150%;
      background: linear-gradient(
        170deg,
        rgba(255, 250, 235, 0.6) 0%,
        rgba(255, 245, 220, 0.3) 30%,
        rgba(255, 240, 210, 0.1) 60%,
        transparent 100%
      );
      filter: blur(20px);
      transform: skewX(-12deg);
    }

    &--2 {
      top: -25%;
      left: 35%;
      width: 300px;
      height: 140%;
      background: linear-gradient(
        175deg,
        rgba(255, 250, 240, 0.5) 0%,
        rgba(250, 245, 230, 0.25) 40%,
        transparent 100%
      );
      filter: blur(15px);
      transform: skewX(-8deg);
    }

    &--3 {
      top: -20%;
      right: 25%;
      width: 350px;
      height: 130%;
      background: linear-gradient(
        168deg,
        rgba(255, 248, 235, 0.55) 0%,
        rgba(255, 242, 225, 0.28) 35%,
        transparent 100%
      );
      filter: blur(18px);
      transform: skewX(-15deg);
    }

    &--4 {
      top: -15%;
      right: 10%;
      width: 250px;
      height: 120%;
      background: linear-gradient(
        172deg,
        rgba(255, 250, 240, 0.45) 0%,
        rgba(248, 245, 235, 0.22) 45%,
        transparent 100%
      );
      filter: blur(12px);
      transform: skewX(-10deg);
    }
  }

  // 四角柔光
  &__corner-lights {
    position: absolute;
    inset: 0;
    z-index: 4;
    pointer-events: none;
  }

  &__corner {
    position: absolute;
    width: 40%;
    height: 40%;
    opacity: 0.4;
    will-change: opacity;

    &--tl {
      top: 0;
      left: 0;
      background: radial-gradient(
        ellipse at top left,
        rgba(255, 250, 240, 0.3) 0%,
        transparent 70%
      );
    }

    &--tr {
      top: 0;
      right: 0;
      background: radial-gradient(
        ellipse at top right,
        rgba(255, 250, 240, 0.25) 0%,
        transparent 70%
      );
    }

    &--bl {
      bottom: 0;
      left: 0;
      background: radial-gradient(
        ellipse at bottom left,
        rgba(255, 250, 240, 0.2) 0%,
        transparent 70%
      );
    }

    &--br {
      bottom: 0;
      right: 0;
      background: radial-gradient(
        ellipse at bottom right,
        rgba(255, 250, 240, 0.25) 0%,
        transparent 70%
      );
    }
  }

  // 暗角遮罩
  &__vignette {
    position: absolute;
    inset: 0;
    background: radial-gradient(
      ellipse at center,
      transparent 20%,
      rgba(10, 15, 30, 0.3) 60%,
      rgba(10, 15, 30, 0.7) 100%
    );
    opacity: 0.6;
    z-index: 5;
    pointer-events: none;
    will-change: opacity;
  }

  // 内容层
  &__content {
    position: relative;
    z-index: 20;
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
      font-size: clamp(0.6rem, 1.2vw, 0.8rem);
      font-weight: 500;
      letter-spacing: 0.4em;
      color: rgba(255, 245, 230, 0.6);
      text-shadow: 0 0 20px rgba(255, 250, 240, 0.3);
    }
  }

  &__title {
    display: flex;
    flex-direction: column;
    gap: 0.05em;
    margin: 0;
    font-family: 'Orbitron', 'Rajdhani', 'Segoe UI', sans-serif;
    font-size: clamp(4rem, 15vw, 10rem);
    font-weight: 900;
    letter-spacing: 0.12em;
    line-height: 0.95;
    color: transparent;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.95) 0%,
      rgba(240, 248, 255, 0.85) 50%,
      rgba(220, 235, 255, 0.7) 100%
    );
    background-clip: text;
    -webkit-background-clip: text;
    filter: drop-shadow(0 0 40px rgba(255, 250, 240, 0.4));

    &-line {
      display: block;

      &--accent {
        background: linear-gradient(
          180deg,
          rgba(255, 220, 150, 1) 0%,
          rgba(255, 200, 120, 0.9) 50%,
          rgba(255, 180, 100, 0.7) 100%
        );
        background-clip: text;
        -webkit-background-clip: text;
        filter: drop-shadow(0 0 50px rgba(255, 200, 150, 0.5));
      }
    }
  }

  &__subtitle {
    margin-top: 1.5rem;
    font-family: 'Noto Sans SC', 'Microsoft YaHei', sans-serif;
    font-size: clamp(0.9rem, 2vw, 1.1rem);
    font-weight: 300;
    letter-spacing: 0.25em;
    color: rgba(240, 248, 255, 0.65);
    text-shadow: 0 0 25px rgba(255, 250, 240, 0.3);
  }

  // 光斑装饰
  &__flare {
    position: absolute;
    top: 15%;
    right: 20%;
    width: 300px;
    height: 300px;
    background: radial-gradient(
      ellipse at center,
      rgba(255, 250, 240, 0.15) 0%,
      rgba(255, 245, 225, 0.08) 30%,
      transparent 60%
    );
    filter: blur(40px);
    z-index: 6;
    pointer-events: none;
    opacity: 0.5;
    will-change: transform, opacity;
  }

  // 底部装饰
  &__footer {
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 20;

    &-bar {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    &-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: linear-gradient(
        135deg,
        rgba(255, 250, 240, 0.8),
        rgba(255, 220, 180, 0.6)
      );
      box-shadow: 0 0 10px rgba(255, 250, 240, 0.4);
    }

    &-text {
      font-family: 'Orbitron', 'Rajdhani', sans-serif;
      font-size: 9px;
      font-weight: 500;
      letter-spacing: 4px;
      color: rgba(255, 250, 240, 0.5);
      text-shadow: 0 0 15px rgba(255, 250, 240, 0.25);
    }
  }

  // 粒子层
  &__particles {
    position: absolute;
    inset: 0;
    z-index: 7;
    pointer-events: none;
    overflow: hidden;
  }

  &__mist {
    position: absolute;
    left: var(--mx);
    top: var(--my);
    width: var(--msize);
    height: var(--msize);
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.15) 0%,
      rgba(255, 255, 255, 0.05) 40%,
      transparent 70%
    );
    border-radius: 50%;
    filter: blur(15px);
    animation: mistFloat var(--ms) ease-in-out infinite;
    animation-delay: var(--md);
  }
}

@keyframes mistFloat {
  0%,
  100% {
    transform: translateY(0) translateX(0) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-30px) translateX(15px) scale(1.1);
    opacity: 0.5;
  }
}

@media (max-width: 768px) {
  .cloud-tide {
    &__footer {
      bottom: 20px;

      &-text {
        font-size: 7px;
        letter-spacing: 2px;
      }

      &-dot {
        width: 4px;
        height: 4px;
      }
    }

    &__flare {
      width: 180px;
      height: 180px;
    }

    &__beam {
      &--1 {
        width: 200px;
        height: 120%;
      }

      &--2 {
        width: 150px;
        height: 110%;
      }

      &--3 {
        width: 180px;
        height: 100%;
      }

      &--4 {
        width: 130px;
        height: 90%;
      }
    }
  }
}
</style>
