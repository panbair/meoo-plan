<template>
  <div ref="parentRef" class="flower-container">
    <!-- 渐变背景 -->
    <div class="flower-bg">
      <div class="bg-gradient" />
      <div class="bg-moon" />
    </div>

    <!-- 水纹滤镜 SVG -->
    <svg class="water-filter" aria-hidden="true">
      <defs>
        <filter id="water-ripple">
          <feTurbulence
            ref="feTurbulenceRef"
            type="fractalNoise"
            baseFrequency="0.01"
            numOctaves="3"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="8"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>

    <!-- 顶部装饰 -->
    <div class="flower-header">
      <div ref="headerRef" class="header-content">
        <span class="header-line" />
        <span class="header-text">MIRROR WORLD</span>
        <span class="header-line" />
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="flower-content">
      <!-- 主体图片 -->
      <div ref="mainWrapperRef" class="main-wrapper">
        <div ref="mainImageRef" class="main-image">
          <img
            src="https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1200&q=85"
            alt="镜花水月"
            class="main-img"
          />
        </div>
      </div>

      <!-- 倒影 -->
      <div ref="reflectionWrapperRef" class="reflection-wrapper">
        <div ref="reflectionImageRef" class="reflection-image">
          <img
            src="https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1200&q=85"
            alt="倒影"
            class="reflection-img"
          />
        </div>
        <!-- 水深渐变 -->
        <div ref="waterFadeRef" class="water-fade" />
      </div>

      <!-- 水纹层 -->
      <div ref="rippleLayerRef" class="ripple-layer" />
    </div>

    <!-- 标题 -->
    <div class="flower-title">
      <h1 ref="titleRef" class="title">
        <span class="title-cn">镜花水月</span>
        <span class="title-en">MIRROR BLOOM</span>
      </h1>
      <p ref="descRef" class="description">
        倒影微动视差 · 静谧湖面之境
      </p>
    </div>

    <!-- 底部装饰 -->
    <div ref="footerRef" class="flower-footer">
      <div class="footer-decor">
        <span class="decor-line" />
        <span class="decor-moon">◯</span>
        <span class="decor-line" />
      </div>
      <div ref="progressRef" class="scroll-progress">
        <div ref="progressFillRef" class="progress-fill" />
        <span ref="progressTextRef" class="progress-text">0%</span>
      </div>
    </div>

    <!-- 月光效果 -->
    <div ref="moonlightRef" class="moonlight" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []

const parentRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const descRef = ref<HTMLElement | null>(null)
const mainWrapperRef = ref<HTMLElement | null>(null)
const mainImageRef = ref<HTMLElement | null>(null)
const reflectionWrapperRef = ref<HTMLElement | null>(null)
const reflectionImageRef = ref<HTMLElement | null>(null)
const waterFadeRef = ref<HTMLElement | null>(null)
const rippleLayerRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const progressRef = ref<HTMLElement | null>(null)
const progressFillRef = ref<HTMLElement | null>(null)
const progressTextRef = ref<HTMLElement | null>(null)
const moonlightRef = ref<HTMLElement | null>(null)
const feTurbulenceRef = ref<SVGFE turbulenceElement | null>(null)

onMounted(() => {
  nextTick(() => {
    initAnimations()
  })
})

const initAnimations = () => {
  if (!parentRef.value) return

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: 1.5
    }
  })

  // 头部入场
  tl.fromTo(
    headerRef.value,
    { opacity: 0, y: -20 },
    { opacity: 1, y: 0, duration: 0.5 },
    0
  )

  // 主体图片入场
  tl.fromTo(
    mainWrapperRef.value,
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
    0.1
  )

  // 主体向上微移（悬浮）
  tl.fromTo(
    mainWrapperRef.value,
    { y: 0 },
    { y: -6, ease: 'power1.inOut' },
    0
  )

  // 倒影入场
  tl.fromTo(
    reflectionWrapperRef.value,
    { opacity: 0, y: -20 },
    { opacity: 1, y: 0, duration: 0.6 },
    0.2
  )

  // 倒影反向微沉
  tl.fromTo(
    reflectionWrapperRef.value,
    { y: 0 },
    { y: 4, ease: 'power1.inOut' },
    0
  )

  // 倒影微缩
  tl.fromTo(
    reflectionImageRef.value,
    { scaleY: 1, opacity: 0.3 },
    { scaleY: 0.96, opacity: 0.15, ease: 'power1.inOut' },
    0
  )

  // 水纹波动增强
  if (feTurbulenceRef.value) {
    tl.fromTo(
      feTurbulenceRef.value,
      { attributes: { 'baseFrequency': '0.01' } },
      { attrs: { 'baseFrequency': '0.015' }, duration: 0.8 },
      0
    )
  }

  // 水深渐变
  tl.fromTo(
    waterFadeRef.value,
    { opacity: 0.4 },
    { opacity: 0.6, duration: 0.5 },
    0
  )

  // 月光效果
  tl.fromTo(
    moonlightRef.value,
    { opacity: 0, scale: 0.9 },
    { opacity: 0.12, scale: 1, duration: 1 },
    0.3
  )

  // 水纹涟漪
  tl.fromTo(
    rippleLayerRef.value,
    { opacity: 0, scale: 0.95 },
    { opacity: 0.08, scale: 1, duration: 0.8 },
    0.2
  )

  // 标题
  tl.fromTo(
    titleRef.value,
    { opacity: 0, y: 25 },
    { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.4)' },
    0.4
  )

  tl.fromTo(
    descRef.value,
    { opacity: 0, y: 15 },
    { opacity: 1, y: 0, duration: 0.5 },
    0.5
  )

  // 底部装饰
  tl.fromTo(
    footerRef.value,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.4 },
    0.6
  )

  // 进度条
  tl.fromTo(
    progressFillRef.value,
    { scaleX: 0 },
    { scaleX: 1, transformOrigin: 'left', duration: 1 },
    0
  )

  tl.fromTo(
    progressTextRef.value,
    { textContent: '0%' },
    { textContent: '100%', snap: { textContent: 1 }, roundProps: 'textContent', duration: 1 },
    0
  )

  // 持续水纹动画
  gsap.to(rippleLayerRef.value, {
    scale: 1.02,
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  })

  cleanupFns.push(() => {
    ScrollTrigger.getAll().forEach(t => t.kill())
  })
}

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  gsap.killTweensOf('*')
})
</script>

<style scoped lang="scss">
.flower-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(180deg, #0a1628 0%, #1a2744 40%, #0d1f3c 100%);
  color: #ffffff;
  font-family: 'Noto Sans SC', sans-serif;
}

// 水纹滤镜
.water-filter {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
}

// 渐变背景
.flower-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;

  .bg-gradient {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 50% 30%, rgba(100, 140, 180, 0.15) 0%, transparent 50%),
      radial-gradient(ellipse at 20% 70%, rgba(60, 80, 120, 0.1) 0%, transparent 40%);
  }

  .bg-moon {
    position: absolute;
    top: 8%;
    right: 15%;
    width: 120px;
    height: 120px;
    background: radial-gradient(circle at 40% 40%, rgba(255, 255, 240, 0.15) 0%, rgba(255, 255, 240, 0.05) 40%, transparent 70%);
    border-radius: 50%;
    filter: blur(20px);
  }
}

// 月光效果
.moonlight {
  position: absolute;
  top: 0;
  right: 10%;
  width: 40%;
  height: 70%;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 240, 0.08) 0%,
    transparent 100%
  );
  clip-path: polygon(60% 0%, 100% 0%, 100% 100%, 20% 100%);
  pointer-events: none;
  opacity: 0;
}

// 顶部装饰
.flower-header {
  position: absolute;
  top: 40px;
  left: 0;
  right: 0;
  z-index: 20;
  display: flex;
  justify-content: center;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 20px;

  .header-line {
    width: 60px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  }

  .header-text {
    font-size: 10px;
    font-family: 'Montserrat', sans-serif;
    letter-spacing: 5px;
    color: rgba(255, 255, 255, 0.4);
    text-transform: uppercase;
  }
}

// 主内容区
.flower-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 600px;
}

// 主体图片
.main-wrapper {
  position: relative;
  width: 100%;
  z-index: 5;
}

.main-image {
  position: relative;
  width: 100%;
  height: 350px;
  border-radius: 8px 8px 0 0;
  overflow: hidden;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.4),
    0 0 80px rgba(100, 140, 180, 0.1);
}

.main-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

// 倒影
.reflection-wrapper {
  position: relative;
  width: 100%;
  height: 180px;
  margin-top: -2px;
  z-index: 3;
}

.reflection-image {
  position: relative;
  width: 100%;
  height: 100%;
  transform-origin: top center;
  filter: blur(2px);
  opacity: 0.3;
  mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.5) 0%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.5) 0%, transparent 100%);
}

.reflection-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scaleY(-1);
  filter: brightness(0.7);
}

.water-fade {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(10, 22, 40, 0.3) 0%,
    rgba(10, 22, 40, 0.8) 100%
  );
  opacity: 0.4;
}

// 水纹涟漪层
.ripple-layer {
  position: absolute;
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%);
  width: 120%;
  height: 80px;
  background: radial-gradient(
    ellipse at 50% 100%,
    rgba(100, 140, 180, 0.15) 0%,
    transparent 70%
  );
  pointer-events: none;
  z-index: 2;
}

// 标题
.flower-title {
  position: absolute;
  bottom: 120px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 20;
}

.title {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin: 0 0 16px;

  .title-cn {
    font-size: 48px;
    font-weight: 600;
    letter-spacing: 16px;
    color: rgba(255, 255, 255, 0.9);
    text-shadow: 0 4px 30px rgba(100, 140, 180, 0.3);
  }

  .title-en {
    font-size: 13px;
    font-family: 'Montserrat', sans-serif;
    letter-spacing: 8px;
    color: rgba(255, 255, 255, 0.35);
  }
}

.description {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.3);
  margin: 0;
  letter-spacing: 3px;
}

// 底部装饰
.flower-footer {
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  z-index: 20;
}

.footer-decor {
  display: flex;
  align-items: center;
  gap: 20px;

  .decor-line {
    width: 80px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
  }

  .decor-moon {
    font-size: 10px;
    color: rgba(255, 255, 240, 0.3);
  }
}

.scroll-progress {
  display: flex;
  align-items: center;
  gap: 14px;

  .progress-fill {
    width: 120px;
    height: 2px;
    background: linear-gradient(90deg, rgba(100, 140, 180, 0.4), rgba(100, 140, 180, 0.7));
    border-radius: 1px;
    transform-origin: left;
  }

  .progress-text {
    font-size: 10px;
    font-family: 'JetBrains Mono', monospace;
    color: rgba(255, 255, 255, 0.3);
  }
}
</style>
