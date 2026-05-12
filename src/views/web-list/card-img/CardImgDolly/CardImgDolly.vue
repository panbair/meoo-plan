<template>
  <div ref="parentRef" class="dolly-container">
    <!-- 背景层 -->
    <div class="dolly-bg">
      <div class="bg-gradient" />
      <div class="bg-vignette" />
    </div>

    <!-- 远景层 -->
    <div ref="farLayerRef" class="layer-far">
      <img
        src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&q=80"
        alt="远景"
        class="layer-image"
      />
      <div class="layer-overlay" />
    </div>

    <!-- 前景层 -->
    <div ref="nearLayerRef" class="layer-near">
      <img
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=85"
        alt="前景"
        class="layer-image"
      />
      <div class="layer-overlay" />
    </div>

    <!-- 中心裁剪遮罩 -->
    <div class="center-mask" />

    <!-- 标题信息 -->
    <div class="dolly-info">
      <div ref="labelRef" class="info-label">
        <span class="line" />
        <span class="text">CINEMATIC EFFECT</span>
      </div>
      <h1 ref="titleRef" class="info-title">
        <span class="main">希区柯克推轨</span>
        <span class="sub">HITCHCOCK DOLLY</span>
      </h1>
      <p ref="descRef" class="info-desc">
        变焦扭曲视差 · 空间变形仪式
      </p>

      <div ref="progressRef" class="progress-indicator">
        <div class="progress-track">
          <div ref="progressFillRef" class="progress-fill" />
        </div>
        <span ref="progressValueRef" class="progress-value">0%</span>
      </div>
    </div>

    <!-- 边框装饰 -->
    <div class="frame-lines">
      <div class="frame-line top" />
      <div class="frame-line bottom" />
      <div class="frame-line left" />
      <div class="frame-line right" />
    </div>

    <!-- 角落标记 -->
    <div class="corner-marks">
      <div class="mark tl">
        <span class="mark-text">01</span>
      </div>
      <div class="mark tr">
        <span class="mark-text">02</span>
      </div>
      <div class="mark bl">
        <span class="mark-text">03</span>
      </div>
      <div class="mark br">
        <span class="mark-text">04</span>
      </div>
    </div>

    <!-- 中心十字 -->
    <div class="center-cross">
      <div class="cross-h" />
      <div class="cross-v" />
    </div>
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
const farLayerRef = ref<HTMLElement | null>(null)
const nearLayerRef = ref<HTMLElement | null>(null)
const labelRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const descRef = ref<HTMLElement | null>(null)
const progressRef = ref<HTMLElement | null>(null)
const progressFillRef = ref<HTMLElement | null>(null)
const progressValueRef = ref<HTMLElement | null>(null)

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

  // 远景层动画 - 缓慢移动 + 轻微缩小
  tl.fromTo(
    farLayerRef.value,
    {
      y: 0,
      scale: 1,
      filter: 'brightness(1)'
    },
    {
      y: 80,
      scale: 0.97,
      filter: 'brightness(0.9)',
      ease: 'power1.inOut'
    },
    0
  )

  // 前景层动画 - 快速移动 + 轻微放大
  tl.fromTo(
    nearLayerRef.value,
    {
      y: 0,
      scale: 1,
      filter: 'brightness(1)'
    },
    {
      y: 80,
      scale: 1.03,
      filter: 'brightness(1.1)',
      ease: 'power1.inOut'
    },
    0
  )

  // 进度条
  tl.fromTo(
    progressFillRef.value,
    { scaleX: 0 },
    { scaleX: 1, transformOrigin: 'left' },
    0
  )

  tl.fromTo(
    progressValueRef.value,
    { textContent: '0%' },
    { textContent: '100%', snap: { textContent: 1 }, roundProps: 'textContent' },
    0
  )

  // 文字入场
  tl.fromTo(
    labelRef.value,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.6 },
    0.2
  )

  tl.fromTo(
    titleRef.value,
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'back.out(1.4)' },
    0.3
  )

  tl.fromTo(
    descRef.value,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.6 },
    0.5
  )

  tl.fromTo(
    progressRef.value,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.5 },
    0.6
  )

  // 边框动画
  const frameLines = parentRef.value.querySelectorAll('.frame-line')
  tl.fromTo(
    frameLines,
    { scaleX: 0, scaleY: 0 },
    { scaleX: 1, scaleY: 1, duration: 0.8, stagger: 0.1 },
    0.2
  )

  // 角落标记
  const marks = parentRef.value.querySelectorAll('.mark')
  tl.fromTo(
    marks,
    { opacity: 0, scale: 0 },
    { opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(2)' },
    0.4
  )

  // 中心十字
  tl.fromTo(
    '.center-cross',
    { opacity: 0 },
    { opacity: 0.3, duration: 0.8 },
    0.5
  )

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
.dolly-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #0a0a0f;
  color: #ffffff;
  font-family: 'Noto Sans SC', sans-serif;
}

// 背景
.dolly-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;

  .bg-gradient {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 50% 50%, rgba(20, 20, 30, 0.5) 0%, transparent 70%);
  }

  .bg-vignette {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, 0.6) 100%);
  }
}

// 图层基础样式
.layer-far,
.layer-near {
  position: absolute;
  inset: -10%;
  display: flex;
  align-items: center;
  justify-content: center;
  will-change: transform, filter;
}

.layer-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.layer-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.3) 0%,
    transparent 30%,
    transparent 70%,
    rgba(0, 0, 0, 0.3) 100%
  );
}

// 远景层 - 远山云雾
.layer-far {
  z-index: 1;

  .layer-overlay {
    background: linear-gradient(
      180deg,
      rgba(30, 40, 60, 0.4) 0%,
      transparent 40%,
      transparent 60%,
      rgba(20, 30, 50, 0.4) 100%
    );
  }
}

// 前景层 - 山峰
.layer-near {
  z-index: 2;

  .layer-overlay {
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.2) 0%,
      transparent 20%,
      transparent 80%,
      rgba(0, 0, 0, 0.3) 100%
    );
  }
}

// 中心裁剪
.center-mask {
  position: absolute;
  inset: 0;
  z-index: 3;
  background: radial-gradient(
    ellipse at 50% 50%,
    transparent 40%,
    rgba(0, 0, 0, 0.7) 70%,
    rgba(0, 0, 0, 0.9) 100%
  );
  pointer-events: none;
}

// 信息区域
.dolly-info {
  position: absolute;
  bottom: 100px;
  left: 80px;
  z-index: 20;
  max-width: 500px;
}

.info-label {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  font-size: 11px;
  font-family: 'Montserrat', sans-serif;
  letter-spacing: 4px;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;

  .line {
    width: 40px;
    height: 1px;
    background: rgba(255, 255, 255, 0.3);
  }
}

.info-title {
  margin: 0 0 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;

  .main {
    font-size: 48px;
    font-weight: 700;
    letter-spacing: 4px;
    color: #ffffff;
    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  }

  .sub {
    font-size: 14px;
    font-family: 'Montserrat', sans-serif;
    font-weight: 400;
    letter-spacing: 6px;
    color: rgba(255, 255, 255, 0.6);
  }
}

.info-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.4);
  margin: 0 0 30px;
  letter-spacing: 2px;
}

.progress-indicator {
  display: flex;
  align-items: center;
  gap: 16px;

  .progress-track {
    width: 200px;
    height: 2px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 1px;
    overflow: hidden;

    .progress-fill {
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, #4a9eff 0%, #ffffff 100%);
      transform-origin: left;
    }
  }

  .progress-value {
    font-size: 12px;
    font-family: 'JetBrains Mono', monospace;
    color: rgba(255, 255, 255, 0.5);
  }
}

// 边框线条
.frame-lines {
  position: absolute;
  inset: 30px;
  z-index: 15;
  pointer-events: none;
}

.frame-line {
  position: absolute;
  background: rgba(255, 255, 255, 0.15);

  &.top {
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    transform-origin: left;
  }

  &.bottom {
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    transform-origin: right;
  }

  &.left {
    top: 0;
    bottom: 0;
    left: 0;
    width: 1px;
    transform-origin: top;
  }

  &.right {
    top: 0;
    bottom: 0;
    right: 0;
    width: 1px;
    transform-origin: bottom;
  }
}

// 角落标记
.corner-marks {
  position: absolute;
  inset: 0;
  z-index: 16;
  pointer-events: none;
}

.mark {
  position: absolute;
  width: 40px;
  height: 40px;

  &::before,
  &::after {
    content: '';
    position: absolute;
    background: rgba(255, 255, 255, 0.3);
  }

  &::before {
    width: 100%;
    height: 1px;
  }

  &::after {
    width: 1px;
    height: 100%;
  }

  .mark-text {
    position: absolute;
    top: 8px;
    left: 8px;
    font-size: 9px;
    font-family: 'JetBrains Mono', monospace;
    color: rgba(255, 255, 255, 0.4);
  }

  &.tl {
    top: 40px;
    left: 40px;

    &::before { top: 0; left: 0; }
    &::after { top: 0; left: 0; }
  }

  &.tr {
    top: 40px;
    right: 40px;

    &::before { top: 0; right: 0; }
    &::after { top: 0; right: 0; }
  }

  &.bl {
    bottom: 40px;
    left: 40px;

    &::before { bottom: 0; left: 0; }
    &::after { bottom: 0; left: 0; }
  }

  &.br {
    bottom: 40px;
    right: 40px;

    &::before { bottom: 0; right: 0; }
    &::after { bottom: 0; right: 0; }
  }
}

// 中心十字
.center-cross {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 40px;
  height: 40px;
  transform: translate(-50%, -50%);
  z-index: 17;
  pointer-events: none;
  opacity: 0;

  .cross-h,
  .cross-v {
    position: absolute;
    background: rgba(255, 255, 255, 0.2);
  }

  .cross-h {
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    transform: translateY(-50%);
  }

  .cross-v {
    left: 50%;
    top: 0;
    bottom: 0;
    width: 1px;
    transform: translateX(-50%);
  }
}
</style>
