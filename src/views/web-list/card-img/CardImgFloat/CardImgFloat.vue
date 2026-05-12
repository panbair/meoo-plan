<template>
  <div ref="parentRef" class="float-container">
    <!-- 柔和渐变背景 -->
    <div class="float-bg">
      <div class="bg-gradient" />
      <div class="bg-glow" />
    </div>

    <!-- 顶部装饰 -->
    <div class="float-header">
      <div ref="headerRef" class="header-content">
        <span class="header-icon">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 3v1m0 16v1m-8-9H3m18 0h-1m-2.636-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.5"/>
          </svg>
        </span>
        <span class="header-text">FLOATING PHOTO</span>
      </div>
    </div>

    <!-- 主内容 -->
    <div class="float-content">
      <!-- 左侧 -->
      <div class="float-left">
        <div ref="leftDecorRef" class="left-decor">
          <div class="decor-line" />
          <div class="decor-circle" />
          <div class="decor-line" />
        </div>
      </div>

      <!-- 中央相框 -->
      <div class="float-center">
        <div ref="frameRef" class="photo-frame">
          <!-- 外框装饰 -->
          <div class="frame-outer">
            <div class="corner top-left" />
            <div class="corner top-right" />
            <div class="corner bottom-left" />
            <div class="corner bottom-right" />
          </div>

          <!-- 相片 -->
          <div ref="photoWrapperRef" class="photo-wrapper">
            <div ref="photoRef" class="photo">
              <img
                src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=80"
                alt="浮光掠影"
                class="photo-image"
              />
              <!-- 照片纹理 -->
              <div class="photo-texture" />
            </div>
            
            <!-- 投影 -->
            <div ref="shadowRef" class="photo-shadow" />
          </div>

          <!-- 内框 -->
          <div class="frame-inner" />
        </div>

        <!-- 底部装饰 -->
        <div ref="frameInfoRef" class="frame-info">
          <span class="info-brand">FLOAT STUDIO</span>
          <span class="info-divider">·</span>
          <span class="info-series">SERIES 001</span>
        </div>
      </div>

      <!-- 右侧 -->
      <div class="float-right">
        <div ref="rightDecorRef" class="right-decor">
          <div class="decor-dot" />
          <div class="decor-line" />
        </div>
      </div>
    </div>

    <!-- 标题 -->
    <div class="float-title">
      <h1 ref="titleRef" class="title">
        <span class="title-cn">浮光掠影</span>
        <span class="title-en">FLOATING LIGHT</span>
      </h1>
      <p ref="descRef" class="description">
        悬浮相片微视差 · 安静的生命感
      </p>
    </div>

    <!-- 底部进度 -->
    <div class="float-footer">
      <div ref="progressRef" class="progress">
        <div class="progress-track">
          <div ref="progressFillRef" class="progress-fill" />
        </div>
        <span ref="progressTextRef" class="progress-text">0%</span>
      </div>
    </div>

    <!-- 光效装饰 -->
    <div ref="glowRef" class="ambient-glow" />
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
const frameRef = ref<HTMLElement | null>(null)
const photoWrapperRef = ref<HTMLElement | null>(null)
const photoRef = ref<HTMLElement | null>(null)
const shadowRef = ref<HTMLElement | null>(null)
const frameInfoRef = ref<HTMLElement | null>(null)
const progressRef = ref<HTMLElement | null>(null)
const progressFillRef = ref<HTMLElement | null>(null)
const progressTextRef = ref<HTMLElement | null>(null)
const leftDecorRef = ref<HTMLElement | null>(null)
const rightDecorRef = ref<HTMLElement | null>(null)
const glowRef = ref<HTMLElement | null>(null)

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
    { opacity: 1, y: 0, duration: 0.6 },
    0
  )

  // 装饰入场
  tl.fromTo(
    leftDecorRef.value,
    { opacity: 0, x: -30 },
    { opacity: 1, x: 0, duration: 0.5 },
    0.2
  )

  tl.fromTo(
    rightDecorRef.value,
    { opacity: 0, x: 30 },
    { opacity: 1, x: 0, duration: 0.5 },
    0.2
  )

  // 相框入场
  tl.fromTo(
    frameRef.value,
    { opacity: 0, y: 40, scale: 0.95 },
    { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.4)' },
    0.3
  )

  // 悬浮微视差动画
  // 图片向上微移
  tl.fromTo(
    photoWrapperRef.value,
    { y: 0, rotateX: 0 },
    { y: -8, rotateX: 1.5, ease: 'power1.inOut' },
    0
  )

  // 投影反向微沉
  tl.fromTo(
    shadowRef.value,
    { y: 0, scale: 1, opacity: 0.2 },
    { y: 4, scale: 0.94, opacity: 0.08, ease: 'power1.inOut' },
    0
  )

  // 光效
  tl.fromTo(
    glowRef.value,
    { opacity: 0, scale: 0.8 },
    { opacity: 0.15, scale: 1, duration: 0.8 },
    0.2
  )

  // 标题
  tl.fromTo(
    titleRef.value,
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.4)' },
    0.4
  )

  tl.fromTo(
    descRef.value,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.5 },
    0.5
  )

  // 框架信息
  tl.fromTo(
    frameInfoRef.value,
    { opacity: 0, y: 15 },
    { opacity: 1, y: 0, duration: 0.4 },
    0.6
  )

  // 进度条
  tl.fromTo(
    progressFillRef.value,
    { scaleX: 0 },
    { scaleX: 1, transformOrigin: 'left', duration: 1.2 },
    0
  )

  tl.fromTo(
    progressTextRef.value,
    { textContent: '0%' },
    { textContent: '100%', snap: { textContent: 1 }, roundProps: 'textContent', duration: 1.2 },
    0
  )

  // 底部入场
  tl.fromTo(
    progressRef.value,
    { opacity: 0 },
    { opacity: 1, duration: 0.4 },
    0.3
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
.float-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%);
  color: #ffffff;
  font-family: 'Noto Sans SC', sans-serif;
}

// 柔和渐变背景
.float-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;

  .bg-gradient {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 30% 20%, rgba(100, 120, 180, 0.15) 0%, transparent 50%),
      radial-gradient(ellipse at 70% 80%, rgba(80, 100, 160, 0.1) 0%, transparent 50%);
  }

  .bg-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 60%;
    height: 60%;
    transform: translate(-50%, -50%);
    background: radial-gradient(ellipse, rgba(100, 120, 180, 0.08) 0%, transparent 70%);
  }
}

// 光效装饰
.ambient-glow {
  position: absolute;
  top: 30%;
  left: 50%;
  width: 500px;
  height: 500px;
  transform: translate(-50%, -50%);
  background: radial-gradient(ellipse, rgba(180, 160, 220, 0.1) 0%, transparent 60%);
  pointer-events: none;
  opacity: 0;
}

// 顶部装饰
.float-header {
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
  gap: 12px;
  padding: 10px 24px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 30px;

  .header-icon {
    width: 18px;
    height: 18px;
    color: rgba(180, 160, 220, 0.6);
  }

  .header-text {
    font-size: 10px;
    font-family: 'Montserrat', sans-serif;
    letter-spacing: 4px;
    color: rgba(255, 255, 255, 0.5);
    text-transform: uppercase;
  }
}

// 主内容
.float-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 60px;
  width: 100%;
  max-width: 1000px;
  padding: 40px;
}

// 装饰
.float-left,
.float-right {
  flex: 0 0 80px;
}

.left-decor,
.right-decor {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  .decor-line {
    width: 1px;
    height: 100px;
    background: linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  }

  .decor-circle {
    width: 8px;
    height: 8px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
  }

  .decor-dot {
    width: 4px;
    height: 4px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
  }
}

.right-decor {
  .decor-line {
    height: 60px;
  }
}

// 中央相框
.float-center {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.photo-frame {
  position: relative;
  padding: 20px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
}

.frame-outer {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.corner {
  position: absolute;
  width: 20px;
  height: 20px;
  border-color: rgba(180, 160, 220, 0.4);
  border-style: solid;
  border-width: 0;

  &.top-left {
    top: 0;
    left: 0;
    border-top-width: 2px;
    border-left-width: 2px;
  }

  &.top-right {
    top: 0;
    right: 0;
    border-top-width: 2px;
    border-right-width: 2px;
  }

  &.bottom-left {
    bottom: 0;
    left: 0;
    border-bottom-width: 2px;
    border-left-width: 2px;
  }

  &.bottom-right {
    bottom: 0;
    right: 0;
    border-bottom-width: 2px;
    border-right-width: 2px;
  }
}

.photo-wrapper {
  position: relative;
  perspective: 1000px;
}

.photo {
  position: relative;
  width: 500px;
  height: 650px;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.4);
  transform-style: preserve-3d;
}

.photo-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-texture {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  background-size: 4px 4px;
  pointer-events: none;
}

.photo-shadow {
  position: absolute;
  bottom: -30px;
  left: 10%;
  width: 80%;
  height: 30px;
  background: radial-gradient(ellipse, rgba(0, 0, 0, 0.4) 0%, transparent 70%);
  filter: blur(15px);
  transform-origin: center;
}

.frame-inner {
  position: absolute;
  inset: 12px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 2px;
  pointer-events: none;
}

.frame-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 24px;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 4px;

  .info-brand {
    font-size: 10px;
    letter-spacing: 3px;
    color: rgba(180, 160, 220, 0.6);
  }

  .info-divider {
    color: rgba(255, 255, 255, 0.2);
  }

  .info-series {
    font-size: 10px;
    letter-spacing: 2px;
    color: rgba(255, 255, 255, 0.4);
  }
}

// 标题
.float-title {
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
  gap: 8px;
  margin: 0 0 12px;

  .title-cn {
    font-size: 36px;
    font-weight: 600;
    letter-spacing: 12px;
    color: #ffffff;
    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }

  .title-en {
    font-size: 12px;
    font-family: 'Montserrat', sans-serif;
    letter-spacing: 6px;
    color: rgba(255, 255, 255, 0.4);
  }
}

.description {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.3);
  margin: 0;
  letter-spacing: 2px;
}

// 底部进度
.float-footer {
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
}

.progress {
  display: flex;
  align-items: center;
  gap: 16px;

  .progress-track {
    width: 150px;
    height: 2px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 1px;
    overflow: hidden;

    .progress-fill {
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, rgba(180, 160, 220, 0.5), rgba(180, 160, 220, 0.8));
      border-radius: 1px;
      transform-origin: left;
    }
  }

  .progress-text {
    font-size: 11px;
    font-family: 'JetBrains Mono', monospace;
    color: rgba(255, 255, 255, 0.3);
  }
}
</style>
