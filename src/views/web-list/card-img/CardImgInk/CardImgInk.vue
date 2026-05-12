<template>
  <div ref="containerRef" class="ink-container">
    <!-- SVG 滤镜 -->
    <svg class="ink-filters" aria-hidden="true">
      <defs>
        <filter id="ink-edge-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
          <feMorphology in="blur" operator="dilate" radius="2" result="dilated" />
          <feComposite in="dilated" in2="SourceGraphic" operator="out" result="edged" />
        </filter>
      </defs>
    </svg>

    <!-- 宣纸背景 -->
    <div class="ink-paper-bg">
      <div class="paper-grain"></div>
      <div class="paper-vignette"></div>
    </div>

    <!-- 装饰墨点 -->
    <div class="ink-splash-dots">
      <div v-for="i in 8" :key="i" class="splash-dot" :style="getSplashStyle(i)"></div>
    </div>

    <!-- 左侧内容区 -->
    <div class="ink-left-content">
      <div class="ink-vertical-text">
        <span ref="verticalTextRef">墨</span>
      </div>
      <h1 class="ink-main-title" ref="titleRef">
        <span class="title-line">墨漪</span>
        <span class="title-line">生花</span>
      </h1>
      <p class="ink-main-subtitle" ref="subtitleRef">
        水墨浸染 · 径向展开
      </p>
      <div class="ink-title-underline"></div>
    </div>

    <!-- 中央图片区 -->
    <div class="ink-image-area" ref="imageAreaRef">
      <!-- 光晕背景 -->
      <div class="ink-glow-bg"></div>

      <!-- 图片容器 -->
      <div class="ink-image-frame" ref="imageFrameRef">
        <img
          ref="imageRef"
          class="ink-image"
          src="https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?w=1400&q=85"
          alt="水墨山水"
          crossorigin="anonymous"
        />

        <!-- 墨晕遮罩层 -->
        <div ref="inkLayerRef" class="ink-layer">
          <!-- 多层墨晕波纹 -->
          <div
            v-for="i in 5"
            :key="i"
            :ref="el => setRippleRef(el, i)"
            class="ink-ripple"
            :style="getRippleStyle(i)"
          ></div>
        </div>

        <!-- 墨丝群 -->
        <div ref="inkLinesRef" class="ink-fibers">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none">
            <path
              v-for="(fiber, i) in fibers"
              :key="i"
              :ref="el => setFiberRef(el, i)"
              class="fiber-path"
              :d="fiber.path"
              :style="{
                '--start-x': fiber.startX + '%',
                '--start-y': fiber.startY + '%'
              }"
            />
          </svg>
        </div>

        <!-- 水渍边缘 -->
        <div ref="stainRef" class="ink-water-stain"></div>
      </div>

      <!-- 落点光效 -->
      <div ref="dropPointRef" class="ink-drop-point"></div>
    </div>

    <!-- 右侧装饰 -->
    <div class="ink-right-decor">
      <div class="decor-circle" ref="decorCircleRef"></div>
      <div class="decor-line"></div>
    </div>

    <!-- 印章 -->
    <div class="ink-red-seal" ref="sealRef">
      <span>墨</span>
    </div>

    <!-- 底部进度 -->
    <div class="ink-scroll-progress" ref="progressRef">
      <div class="progress-track">
        <div class="progress-fill"></div>
      </div>
      <span class="progress-label">SCROLL</span>
    </div>

    <!-- 墨点粒子 -->
    <div class="ink-particles">
      <div v-for="i in 20" :key="i" class="ink-particle" :style="getParticleStyle(i)"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Fiber {
  path: string
  startX: number
  startY: number
}

// 生成墨丝数据
const fibers: Fiber[] = Array.from({ length: 12 }, () => {
  const startX = 45 + Math.random() * 10
  const startY = 45 + Math.random() * 10
  const angle = Math.random() * 360
  const length = 20 + Math.random() * 40
  const endX = startX + Math.cos(angle) * length * 0.3
  const endY = startY + Math.sin(angle) * length * 0.3
  const ctrlX = startX + (endX - startX) * 0.5 + (Math.random() - 0.5) * 15
  const ctrlY = startY + (endY - startY) * 0.5 + (Math.random() - 0.5) * 15
  return {
    path: `M ${startX} ${startY} Q ${ctrlX} ${ctrlY} ${endX} ${endY}`,
    startX,
    startY
  }
})

const containerRef = ref<HTMLElement | null>(null)
const verticalTextRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const imageAreaRef = ref<HTMLElement | null>(null)
const imageFrameRef = ref<HTMLElement | null>(null)
const imageRef = ref<HTMLImageElement | null>(null)
const inkLayerRef = ref<HTMLElement | null>(null)
const inkLinesRef = ref<HTMLElement | null>(null)
const stainRef = ref<HTMLElement | null>(null)
const dropPointRef = ref<HTMLElement | null>(null)
const decorCircleRef = ref<HTMLElement | null>(null)
const sealRef = ref<HTMLElement | null>(null)
const progressRef = ref<HTMLElement | null>(null)

const rippleRefs = ref<(HTMLElement | null)[]>([])
const fiberRefs = ref<(SVGPathElement | null)[]>([])

const setRippleRef = (el: HTMLElement | null, index: number) => {
  rippleRefs.value[index] = el
}

const setFiberRef = (el: SVGPathElement | null, index: number) => {
  fiberRefs.value[index] = el
}

const getSplashStyle = (i: number) => {
  const angle = (i - 1) * 45
  const distance = 200 + Math.random() * 150
  return {
    '--angle': `${angle}deg`,
    '--distance': `${distance}px`,
    '--delay': `${i * 0.15}s`,
    '--size': `${3 + Math.random() * 4}px`
  }
}

const getRippleStyle = (i: number) => ({
  '--ripple-delay': `${i * 0.2}s`,
  '--ripple-size': `${30 + i * 15}%`,
  '--ripple-blur': `${4 + i * 2}px`
})

const getParticleStyle = (i: number) => {
  const x = Math.random() * 100
  const y = Math.random() * 100
  const size = 1 + Math.random() * 3
  const delay = Math.random() * 3
  const duration = 4 + Math.random() * 4
  return {
    left: `${x}%`,
    top: `${y}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  }
}

interface TweenCleanup {
  kill: () => void
  revert?: () => void
}

const cleanupFns: TweenCleanup[] = []

onMounted(() => {
  if (!containerRef.value) return

  const ctx = gsap.context(() => {
    // 初始化状态
    gsap.set([titleRef.value, subtitleRef.value], { opacity: 0, x: -60 })
    gsap.set(verticalTextRef.value, { opacity: 0, scale: 0 })
    gsap.set(imageRef.value, { scale: 1.2, filter: 'brightness(0.3) blur(20px)' })
    gsap.set(inkLayerRef.value, { opacity: 1 })
    gsap.set(sealRef.value, { opacity: 0, scale: 0, rotate: -20 })

    rippleRefs.value.forEach((ripple) => {
      if (ripple) {
        gsap.set(ripple, { scale: 0, opacity: 0.8 })
      }
    })

    fiberRefs.value.forEach((fiber) => {
      if (fiber) {
        const length = fiber.getTotalLength?.() || 30
        gsap.set(fiber, {
          strokeDasharray: length,
          strokeDashoffset: length
        })
      }
    })

    gsap.set(stainRef.value, { opacity: 0, scale: 0.9 })
    gsap.set(decorCircleRef.value, { scale: 0, opacity: 0 })

    // 创建主时间线
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.value,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1.5,
        onUpdate: (self) => {
          const progressFill = progressRef.value?.querySelector('.progress-fill')
          const progressLabel = progressRef.value?.querySelector('.progress-label')
          if (progressFill) {
            gsap.set(progressFill, { scaleX: self.progress })
          }
          if (progressLabel) {
            progressLabel.textContent = `${Math.round(self.progress * 100)}%`
          }
        }
      }
    })

    // 1. 左侧文字入场
    tl.to(verticalTextRef.value, {
      opacity: 1,
      scale: 1,
      duration: 0.6,
      ease: 'back.out(2)'
    }, 0)

    tl.to(titleRef.value, {
      opacity: 1,
      x: 0,
      duration: 0.8,
      ease: 'power2.out',
      stagger: 0.1
    }, 0.1)

    tl.to(subtitleRef.value, {
      opacity: 1,
      x: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, 0.3)

    // 2. 落点光效闪烁
    tl.fromTo(dropPointRef.value,
      { scale: 0, opacity: 0 },
      { scale: 1.5, opacity: 1, duration: 0.3, ease: 'power2.out' },
      0.2
    )

    tl.to(dropPointRef.value, {
      scale: 3,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out'
    }, 0.4)

    // 3. 图片显现
    tl.to(imageRef.value, {
      scale: 1,
      filter: 'brightness(1) blur(0px)',
      duration: 1.5,
      ease: 'power2.out'
    }, 0.3)

    // 4. 墨晕波纹扩散（核心动画）
    rippleRefs.value.forEach((ripple, i) => {
      if (!ripple) return

      tl.fromTo(ripple,
        { scale: 0, opacity: 0.7 },
        {
          scale: 1,
          opacity: 0,
          duration: 1.2,
          ease: 'power2.out'
        },
        0.4 + i * 0.15
      )
    })

    // 5. 墨丝渗透
    fiberRefs.value.forEach((fiber, i) => {
      if (!fiber) return

      tl.fromTo(fiber,
        { strokeDashoffset: fiber.getTotalLength?.() || 30 },
        {
          strokeDashoffset: 0,
          duration: 0.8,
          ease: 'power2.inOut'
        },
        0.8 + i * 0.08
      )

      tl.to(fiber, {
        opacity: 0.2,
        duration: 0.4
      }, 1.5 + i * 0.08)
    })

    // 6. 装饰元素
    tl.to(decorCircleRef.value, {
      scale: 1,
      opacity: 0.15,
      duration: 1,
      ease: 'power2.out'
    }, 0.5)

    // 7. 水渍边缘
    tl.to(stainRef.value, {
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: 'power2.out'
    }, 1.2)

    // 8. 印章
    tl.to(sealRef.value, {
      opacity: 1,
      scale: 1,
      rotate: 0,
      duration: 0.6,
      ease: 'back.out(2)'
    }, 1.5)

    cleanupFns.push({ kill: () => tl.kill() })

    // 完成后持续动画
    ScrollTrigger.create({
      trigger: containerRef.value,
      start: 'bottom 40%',
      onEnter: () => {
        // 印章微震
        if (sealRef.value) {
          gsap.to(sealRef.value, {
            rotate: 5,
            duration: 3,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1
          })
        }

        // 水渍呼吸
        if (stainRef.value) {
          gsap.to(stainRef.value, {
            opacity: 0.7,
            scale: 1.02,
            duration: 4,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1
          })
        }

        // 图片微浮动
        if (imageRef.value) {
          gsap.to(imageRef.value, {
            scale: 1.02,
            duration: 5,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1
          })
        }
      }
    })

    // 墨点粒子漂浮
    const particles = containerRef.value.querySelectorAll('.ink-particle')
    particles.forEach((particle) => {
      gsap.to(particle, {
        y: -30 + Math.random() * 60,
        x: -20 + Math.random() * 40,
        opacity: 0.3 + Math.random() * 0.4,
        duration: 3 + Math.random() * 3,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1
      })
    })
  }, containerRef.value)

  cleanupFns.push({ kill: () => ctx.revert() })
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn.kill())
  ScrollTrigger.getAll().forEach(st => {
    if (st.vars.trigger === containerRef.value) {
      st.kill()
    }
  })
})
</script>

<style lang="scss" scoped>
$ink-black: #0d0d0d;
$ink-dark: #1a1a1a;
$ink-medium: #3d3d3d;
$paper-white: #faf9f6;
$paper-cream: #f5f0e5;
$seal-red: #a82020;
$stain-blue: #b8c4d0;

.ink-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, $paper-white 0%, $paper-cream 40%, #e8e0d4 100%);
  font-family: 'Noto Serif SC', 'Songti SC', 'SimSun', serif;
}

.ink-filters {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
}

// 宣纸背景
.ink-paper-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;

  .paper-grain {
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.03' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
    opacity: 0.8;
  }

  .paper-vignette {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 20% 20%, rgba(255, 255, 255, 0.4) 0%, transparent 40%),
      radial-gradient(ellipse at 80% 80%, rgba(200, 190, 175, 0.3) 0%, transparent 50%);
  }
}

// 装饰墨点
.ink-splash-dots {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.splash-dot {
  position: absolute;
  width: var(--size);
  height: var(--size);
  background: radial-gradient(circle, $ink-dark 0%, transparent 70%);
  border-radius: 50%;
  opacity: 0;
  transform: translate(
    calc(cos(var(--angle)) * var(--distance)),
    calc(sin(var(--angle)) * var(--distance))
  );
  filter: blur(2px);
}

// 左侧内容
.ink-left-content {
  position: absolute;
  top: 50%;
  left: 6%;
  transform: translateY(-50%);
  z-index: 20;
}

.ink-vertical-text {
  position: absolute;
  top: -80px;
  left: -30px;

  span {
    writing-mode: vertical-rl;
    font-size: 80px;
    font-weight: 700;
    color: $ink-dark;
    opacity: 0.08;
    letter-spacing: 20px;
  }
}

.ink-main-title {
  margin: 0;
  font-size: 72px;
  font-weight: 900;
  line-height: 1.1;
  color: $ink-black;
  letter-spacing: 8px;

  .title-line {
    display: block;

    &:nth-child(2) {
      margin-left: 40px;
      color: $ink-medium;
    }
  }
}

.ink-title-underline {
  width: 120px;
  height: 3px;
  background: linear-gradient(90deg, $ink-black 0%, transparent 100%);
  margin-top: 24px;
}

.ink-main-subtitle {
  margin: 20px 0 0 0;
  font-size: 16px;
  font-weight: 400;
  color: $ink-medium;
  letter-spacing: 6px;
}

// 中央图片区
.ink-image-area {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 65vw;
  max-width: 900px;
  height: 70vh;
  max-height: 700px;
  z-index: 10;
}

.ink-glow-bg {
  position: absolute;
  inset: -100px;
  background: radial-gradient(
    ellipse at center,
    rgba($ink-dark, 0.06) 0%,
    transparent 60%
  );
  filter: blur(40px);
}

.ink-image-frame {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  overflow: hidden;
  box-shadow:
    0 40px 80px rgba($ink-dark, 0.15),
    0 20px 40px rgba($ink-dark, 0.1);
}

.ink-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

// 墨晕遮罩
.ink-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 5;
}

.ink-ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  width: var(--ripple-size);
  height: var(--ripple-size);
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: radial-gradient(
    circle,
    $ink-black 0%,
    rgba($ink-black, 0.8) 30%,
    rgba($ink-black, 0.4) 60%,
    transparent 100%
  );
  filter: blur(var(--ripple-blur));
  mix-blend-mode: multiply;
  opacity: 0;
  transform-origin: center center;
}

// 墨丝
.ink-fibers {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 6;
  overflow: visible;

  svg {
    width: 100%;
    height: 100%;
  }
}

.fiber-path {
  fill: none;
  stroke: $ink-black;
  stroke-width: 0.8;
  stroke-linecap: round;
  opacity: 0.5;
  filter: blur(0.5px);
}

// 水渍
.ink-water-stain {
  position: absolute;
  inset: -10px;
  border-radius: 8px;
  background:
    radial-gradient(ellipse at 10% 10%, rgba($stain-blue, 0.15) 0%, transparent 30%),
    radial-gradient(ellipse at 90% 90%, rgba($stain-blue, 0.12) 0%, transparent 25%),
    radial-gradient(ellipse at 50% 50%, transparent 40%, rgba($stain-blue, 0.08) 100%);
  opacity: 0;
  pointer-events: none;
  filter: blur(6px);
  z-index: 7;
}

// 落点光效
.ink-drop-point {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100px;
  height: 100px;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba($ink-black, 0.8) 0%, transparent 70%);
  border-radius: 50%;
  opacity: 0;
  filter: blur(20px);
  z-index: 4;
}

// 右侧装饰
.ink-right-decor {
  position: absolute;
  top: 50%;
  right: 5%;
  transform: translateY(-50%);
  z-index: 15;

  .decor-circle {
    width: 300px;
    height: 300px;
    border: 1px solid rgba($ink-dark, 0.15);
    border-radius: 50%;
  }

  .decor-line {
    width: 1px;
    height: 200px;
    background: linear-gradient(to bottom, transparent, $ink-dark, transparent);
    margin-left: 50%;
    opacity: 0.2;
  }
}

// 印章
.ink-red-seal {
  position: absolute;
  bottom: 12%;
  right: 10%;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid $seal-red;
  border-radius: 4px;
  background: rgba($seal-red, 0.04);
  z-index: 25;

  span {
    font-size: 40px;
    font-weight: 700;
    color: $seal-red;
    writing-mode: vertical-rl;
    letter-spacing: 4px;
  }
}

// 滚动进度
.ink-scroll-progress {
  position: absolute;
  bottom: 50px;
  left: 6%;
  display: flex;
  align-items: center;
  gap: 16px;
  z-index: 25;

  .progress-track {
    width: 150px;
    height: 2px;
    background: rgba($ink-medium, 0.2);
    border-radius: 1px;
    overflow: hidden;
  }

  .progress-fill {
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, $ink-medium 0%, $ink-black 100%);
    transform-origin: left;
    transform: scaleX(0);
  }

  .progress-label {
    font-size: 10px;
    font-weight: 600;
    color: $ink-medium;
    letter-spacing: 2px;
    font-family: 'Courier New', monospace;
  }
}

// 墨点粒子
.ink-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 3;
}

.ink-particle {
  position: absolute;
  background: radial-gradient(circle, $ink-dark 0%, transparent 70%);
  border-radius: 50%;
  opacity: 0.3;
  animation: particle-float ease-in-out infinite;
}

@keyframes particle-float {
  0%, 100% {
    transform: translate(0, 0);
    opacity: 0.2;
  }
  50% {
    transform: translate(-15px, -20px);
    opacity: 0.5;
  }
}

// 响应式
@media (max-width: 1200px) {
  .ink-main-title {
    font-size: 56px;
  }

  .ink-image-area {
    width: 70vw;
    height: 60vh;
  }
}

@media (max-width: 900px) {
  .ink-left-content {
    left: 4%;
  }

  .ink-main-title {
    font-size: 44px;
  }

  .ink-image-area {
    width: 80vw;
    height: 50vh;
  }

  .ink-red-seal {
    width: 60px;
    height: 60px;
    bottom: 8%;
    right: 6%;

    span {
      font-size: 28px;
    }
  }

  .ink-right-decor {
    display: none;
  }
}

@media (max-width: 600px) {
  .ink-left-content {
    top: 8%;
    left: 5%;
    transform: none;
  }

  .ink-vertical-text {
    display: none;
  }

  .ink-main-title {
    font-size: 36px;
  }

  .ink-image-area {
    top: 45%;
    width: 90vw;
    height: 45vh;
  }

  .ink-scroll-progress {
    bottom: 20px;
    left: 5%;
  }
}
</style>
