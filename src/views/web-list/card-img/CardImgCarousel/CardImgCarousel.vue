<template>
  <div ref="containerRef" class="carousel-container">
    <!-- 深色背景 -->
    <div ref="bgRef" class="carousel-bg">
      <div class="bg-dark"></div>
      <div class="bg-gradient-radial"></div>
      <div class="bg-grid"></div>
    </div>

    <!-- 聚光圈 -->
    <div ref="spotlightRef" class="spotlight-ring"></div>
    <div class="spotlight-glow"></div>

    <!-- 轨道系统 -->
    <div class="orbit-system">
      <div class="orbit-track orbit-1"></div>
      <div class="orbit-track orbit-2"></div>
      <div class="orbit-center-mark"></div>
    </div>

    <!-- 顶部投影仪 -->
    <div ref="projectorRef" class="projector-assembly">
      <div class="projector-body">
        <div class="projector-lens" />
        <div class="projector-ring" />
        <div class="projector-glow" />
      </div>
    </div>

    <!-- 环绕幻灯片 -->
    <div ref="slidesRef" class="slides-orbit">
      <div
        v-for="(slide, i) in slides"
        :key="slide.id"
        :ref="el => setSlideRef(el, i)"
        class="slide-frame"
        :class="`slide-${i}`"
      >
        <div class="slide-inner">
          <img :src="slide.url" :alt="slide.title" class="slide-image" />
          <div class="slide-shine" />
          <div class="slide-reflection" />
        </div>
        <div class="slide-frame-border">
          <div class="frame-corner top-left" />
          <div class="frame-corner top-right" />
          <div class="frame-corner bottom-left" />
          <div class="frame-corner bottom-right" />
        </div>
        <div class="slide-info">
          <span class="slide-num">{{ String(i + 1).padStart(2, '0') }}</span>
          <span class="slide-title">{{ slide.title }}</span>
        </div>
      </div>
    </div>

    <!-- 当前帧指示器 -->
    <div ref="indicatorRef" class="frame-indicator">
      <div class="indicator-ring">
        <div class="indicator-fill" />
      </div>
      <span class="indicator-value" ref="frameNumRef">01</span>
      <span class="indicator-total">/ {{ String(slides.length).padStart(2, '0') }}</span>
    </div>

    <!-- 入场内容 -->
    <div ref="contentRef" class="carousel-content">
      <div class="content-tag">幻灯轮投射</div>
      <h2 ref="titleRef" class="content-title">Slide<br />Projection</h2>
      <p ref="subtitleRef" class="content-subtitle">
        逐帧聚焦 · 精密轮盘节奏<br />
        <span class="sub-detail">Scroll to project</span>
      </p>
    </div>

    <!-- 微尘粒子 -->
    <div ref="dustLayerRef" class="dust-layer">
      <div
        v-for="i in 50"
        :key="i"
        class="dust-particle"
        :style="getDustStyle(i)"
      />
    </div>

    <!-- 底部装饰 -->
    <div class="bottom-decor">
      <div class="decor-line" />
      <span class="decor-text">NATURE PROJECTOR</span>
      <div class="decor-line" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Slide {
  id: number
  url: string
  title: string
}

const slides: Slide[] = [
  { id: 1, url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', title: 'Mountain' },
  { id: 2, url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80', title: 'Cliff' },
  { id: 3, url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80', title: 'Starry' },
  { id: 4, url: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=800&q=80', title: 'Aurora' },
]

const containerRef = ref<HTMLElement | null>(null)
const bgRef = ref<HTMLElement | null>(null)
const spotlightRef = ref<HTMLElement | null>(null)
const projectorRef = ref<HTMLElement | null>(null)
const slidesRef = ref<HTMLElement | null>(null)
const indicatorRef = ref<HTMLElement | null>(null)
const frameNumRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const dustLayerRef = ref<HTMLElement | null>(null)

const slideRefs = ref<(HTMLElement | null)[]>([])

const setSlideRef = (el: HTMLElement | null, index: number) => {
  slideRefs.value[index] = el
}

const getDustStyle = (i: number) => {
  const x = Math.random() * 100
  const y = Math.random() * 100
  const size = 1 + Math.random() * 2
  const delay = Math.random() * 5
  const duration = 3 + Math.random() * 4
  return {
    left: `${x}%`,
    top: `${y}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
  }
}

const cleanupFns: Array<() => void> = []

onMounted(async () => {
  await nextTick()

  const container = containerRef.value
  const slidesEl = slidesRef.value
  if (!container || !slidesEl) return

  // 幻灯片环形排列参数
  const radiusX = 380 // 水平半径
  const radiusY = 200 // 垂直半径
  const startAngle = -90 // 从顶部开始（12点钟方向）

  // 初始化幻灯片 - 全部聚集在中心
  slideRefs.value.forEach((slide) => {
    if (slide) {
      gsap.set(slide, {
        x: 0,
        y: 0,
        scale: 0,
        filter: 'blur(40px)',
        opacity: 0,
        transformOrigin: 'center center',
      })
    }
  })

  // 投影仪入场
  if (projectorRef.value) {
    gsap.fromTo(
      projectorRef.value,
      { y: -80, opacity: 0, scale: 0.5 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'back.out(1.2)',
        scrollTrigger: {
          trigger: container,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    )
  }

  // 聚光灯入场
  if (spotlightRef.value) {
    gsap.fromTo(
      spotlightRef.value,
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    )
  }

  // 创建幻灯片投射时间线
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top 100%',
      end: 'bottom 20%',
      scrub: 1.5,
      onUpdate: (self) => {
        // 更新帧号
        const frame = Math.min(Math.floor(self.progress * slides.length) + 1, slides.length)
        if (frameNumRef.value) {
          frameNumRef.value.textContent = String(frame).padStart(2, '0')
        }

        // 更新指示器
        const indicatorFill = indicatorRef.value?.querySelector('.indicator-fill')
        if (indicatorFill) {
          gsap.set(indicatorFill, { scaleY: self.progress })
        }
      },
    },
  })

  // 依次投射每张幻灯片 - 沿环形轨道扩散
  slides.forEach((_, i) => {
    const slide = slideRefs.value[i]
    if (!slide) return

    // 计算该幻灯片在圆上的最终位置
    const angle = ((startAngle + i * (360 / slides.length)) * Math.PI) / 180
    const finalX = Math.cos(angle) * radiusX
    const finalY = Math.sin(angle) * radiusY

    // 从中心扩散到轨道位置
    tl.fromTo(
      slide,
      {
        x: 0,
        y: 0,
        scale: 0,
        filter: 'blur(40px)',
        opacity: 0,
      },
      {
        x: finalX,
        y: finalY,
        scale: 1,
        filter: 'blur(0px)',
        opacity: 1,
        duration: 0.8,
        ease: 'back.out(1.4)',
      },
      i * 0.5
    )

    // 触地微弹
    tl.to(
      slide,
      {
        scale: 1.03,
        duration: 0.1,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: 1,
      },
      i * 0.5 + 0.6
    )
  })

  cleanupFns.push(() => tl.kill())

  // 内容入场动画
  if (titleRef.value && subtitleRef.value) {
    gsap.set([titleRef.value, subtitleRef.value], { opacity: 0, x: -30 })
    gsap.set(contentRef.value, { opacity: 0 })

    const contentTl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top 60%',
        toggleActions: 'play none none reverse',
      },
    })

    contentTl
      .to(contentRef.value, { opacity: 1, duration: 0.3 })
      .to(titleRef.value, { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }, '-=0.1')
      .to(subtitleRef.value, { opacity: 1, x: 0, duration: 0.5 }, '-=0.2')

    cleanupFns.push(() => contentTl.kill())
  }

  // 完成后幻灯片公转微动
  ScrollTrigger.create({
    trigger: container,
    start: 'bottom 20%',
    onEnter: () => {
      slideRefs.value.forEach((slide, i) => {
        if (!slide) return
        const angle = ((startAngle + i * (360 / slides.length)) * Math.PI) / 180
        const baseX = Math.cos(angle) * radiusX
        const baseY = Math.sin(angle) * radiusY

        gsap.to(slide, {
          x: baseX + Math.sin(i) * 5,
          y: baseY + Math.cos(i) * 3,
          duration: 3 + i * 0.5,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        })
      })
    },
  })

  // 微尘漂浮动画
  const dustParticles = dustLayerRef.value?.querySelectorAll('.dust-particle')
  dustParticles?.forEach((particle) => {
    gsap.to(particle, {
      y: -30 + Math.random() * 60,
      x: -20 + Math.random() * 40,
      duration: 5 + Math.random() * 5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    })
  })

  // 幻灯片悬停效果
  slideRefs.value.forEach((slide, i) => {
    if (!slide) return

    const handleMouseEnter = () => {
      gsap.to(slide, {
        scale: 1.08,
        duration: 0.3,
        ease: 'power2.out',
      })
    }

    const handleMouseLeave = () => {
      gsap.to(slide, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      })
    }

    slide.addEventListener('mouseenter', handleMouseEnter)
    slide.addEventListener('mouseleave', handleMouseLeave)

    cleanupFns.push(() => {
      slide.removeEventListener('mouseenter', handleMouseEnter)
      slide.removeEventListener('mouseleave', handleMouseLeave)
    })
  })
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(st => st.kill())
  gsap.killTweensOf('*')
})
</script>

<style scoped lang="scss">
$accent: #ffd700;
$accent-dim: rgba(255, 215, 0, 0.3);

.carousel-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(180deg, #0a0a12 0%, #12121f 40%, #0d0d18 100%);
  font-family: 'system-ui', -apple-system, sans-serif;
}

.carousel-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;

  .bg-dark {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 50% 45%, rgba(20, 20, 35, 0.6) 0%, transparent 60%);
  }

  .bg-gradient-radial {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 50% 40%, rgba($accent, 0.05) 0%, transparent 50%),
      radial-gradient(ellipse at 30% 70%, rgba(100, 150, 200, 0.03) 0%, transparent 40%);
  }

  .bg-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse at center, black 20%, transparent 70%);
  }
}

// 聚光圈
.spotlight-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 900px;
  height: 600px;
  transform: translate(-50%, -50%);
  border: 1px solid rgba($accent, 0.1);
  border-radius: 50%;
  opacity: 0;
  box-shadow:
    0 0 60px rgba($accent, 0.05),
    inset 0 0 60px rgba($accent, 0.03);

  &::before,
  &::after {
    content: '';
    position: absolute;
    border: 1px solid rgba($accent, 0.05);
    border-radius: 50%;
  }

  &::before {
    inset: -40px;
  }

  &::after {
    inset: 40px;
  }
}

.spotlight-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 600px;
  height: 400px;
  transform: translate(-50%, -50%);
  background: radial-gradient(ellipse, rgba($accent, 0.08) 0%, transparent 60%);
  filter: blur(40px);
  pointer-events: none;
}

// 轨道系统
.orbit-system {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 1;
}

.orbit-track {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px dashed rgba($accent, 0.1);
  border-radius: 50%;

  &.orbit-1 {
    width: 900px;
    height: 500px;
  }

  &.orbit-2 {
    width: 1100px;
    height: 700px;
    border-color: rgba($accent, 0.05);
  }
}

.orbit-center-mark {
  width: 8px;
  height: 8px;
  background: rgba($accent, 0.3);
  border-radius: 50%;
  box-shadow: 0 0 20px rgba($accent, 0.5);
}

// 顶部投影仪
.projector-assembly {
  position: absolute;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 30;

  .projector-body {
    position: relative;
    width: 100px;
    height: 70px;
    background: linear-gradient(145deg, #2a2a35, #1a1a22);
    border-radius: 12px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6);

    .projector-lens {
      position: absolute;
      bottom: -20px;
      left: 50%;
      transform: translateX(-50%);
      width: 40px;
      height: 40px;
      background: radial-gradient(circle at 30% 30%, #5a5a6a, #1a1a22);
      border-radius: 50%;
      border: 3px solid #3a3a45;
      box-shadow:
        0 0 30px rgba(255, 255, 200, 0.4),
        inset 0 0 15px rgba(0, 0, 0, 0.6);
    }

    .projector-ring {
      position: absolute;
      bottom: -28px;
      left: 50%;
      transform: translateX(-50%);
      width: 50px;
      height: 50px;
      border: 3px solid rgba($accent, 0.3);
      border-radius: 50%;
      animation: ring-rotate 8s linear infinite;
    }

    .projector-glow {
      position: absolute;
      bottom: -15px;
      left: 50%;
      transform: translateX(-50%);
      width: 30px;
      height: 30px;
      background: radial-gradient(circle, rgba($accent, 0.6) 0%, transparent 70%);
      border-radius: 50%;
      filter: blur(10px);
      animation: lens-glow 2s ease-in-out infinite;
    }
  }
}

@keyframes ring-rotate {
  from { transform: translateX(-50%) rotate(0deg); }
  to { transform: translateX(-50%) rotate(360deg); }
}

@keyframes lens-glow {
  0%, 100% { opacity: 0.5; transform: translateX(-50%) scale(1); }
  50% { opacity: 1; transform: translateX(-50%) scale(1.2); }
}

// 环绕幻灯片容器
.slides-orbit {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}

.slide-frame {
  position: absolute;
  width: 220px;
  height: 150px;
  cursor: pointer;
  transform: translate(-50%, -50%);

  .slide-inner {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 8px;
    overflow: hidden;
    box-shadow:
      0 20px 60px rgba(0, 0, 0, 0.6),
      0 0 1px rgba($accent, 0.2);

    .slide-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .slide-shine {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.15) 0%,
        transparent 50%,
        rgba(100, 150, 200, 0.08) 100%
      );
      pointer-events: none;
    }

    .slide-reflection {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 40%;
      background: linear-gradient(to bottom, rgba(255, 255, 255, 0.1), transparent);
      pointer-events: none;
    }
  }

  .slide-frame-border {
    position: absolute;
    inset: -6px;
    pointer-events: none;

    .frame-corner {
      position: absolute;
      width: 14px;
      height: 14px;
      border-color: rgba($accent, 0.5);
      border-style: solid;

      &.top-left {
        top: 0;
        left: 0;
        border-width: 2px 0 0 2px;
      }

      &.top-right {
        top: 0;
        right: 0;
        border-width: 2px 2px 0 0;
      }

      &.bottom-left {
        bottom: 0;
        left: 0;
        border-width: 0 0 2px 2px;
      }

      &.bottom-right {
        bottom: 0;
        right: 0;
        border-width: 0 2px 2px 0;
      }
    }
  }

  .slide-info {
    position: absolute;
    bottom: -30px;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    gap: 8px;

    .slide-num {
      font-size: 11px;
      font-weight: 700;
      color: rgba($accent, 0.7);
      font-variant-numeric: tabular-nums;
    }

    .slide-title {
      font-size: 12px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.7);
    }
  }

  &:hover .slide-inner {
    box-shadow:
      0 25px 70px rgba(0, 0, 0, 0.7),
      0 0 40px rgba($accent, 0.15);
  }
}

// 当前帧指示器
.frame-indicator {
  position: absolute;
  top: 50%;
  right: 60px;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  z-index: 25;

  .indicator-ring {
    width: 80px;
    height: 80px;
    border: 2px solid rgba($accent, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;

    .indicator-fill {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 100%;
      background: linear-gradient(to top, rgba($accent, 0.4), rgba($accent, 0.1));
      transform: scaleY(0);
      transform-origin: bottom;
    }
  }

  .indicator-value {
    position: relative;
    z-index: 1;
    font-size: 28px;
    font-weight: 800;
    color: #fff;
    font-variant-numeric: tabular-nums;
    text-shadow: 0 0 20px rgba($accent, 0.5);
  }

  .indicator-total {
    font-size: 14px;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.4);
  }
}

// 入场内容
.carousel-content {
  position: absolute;
  top: 50%;
  left: 80px;
  transform: translateY(-50%);
  z-index: 25;

  .content-tag {
    display: inline-block;
    padding: 6px 14px;
    background: rgba($accent, 0.1);
    border: 1px solid rgba($accent, 0.3);
    border-radius: 20px;
    font-size: 10px;
    font-weight: 600;
    color: rgba($accent, 0.9);
    letter-spacing: 2px;
    margin-bottom: 20px;
  }

  .content-title {
    font-size: 48px;
    font-weight: 800;
    color: #fff;
    margin: 0 0 16px 0;
    line-height: 1.1;
    text-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);

    br {
      display: block;
      margin-bottom: 8px;
    }
  }

  .content-subtitle {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.5);
    margin: 0;
    line-height: 1.8;

    .sub-detail {
      font-size: 11px;
      color: rgba($accent, 0.6);
      letter-spacing: 2px;
    }
  }
}

// 微尘粒子
.dust-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 5;
}

.dust-particle {
  position: absolute;
  background: rgba($accent, 0.4);
  border-radius: 50%;
  opacity: 0.3;
  animation: dust-float linear infinite;

  @keyframes dust-float {
    0%, 100% {
      transform: translate(0, 0);
      opacity: 0.1;
    }
    50% {
      transform: translate(-15px, -25px);
      opacity: 0.5;
    }
  }
}

// 底部装饰
.bottom-decor {
  position: absolute;
  bottom: 40px;
  left: 80px;
  right: 80px;
  display: flex;
  align-items: center;
  gap: 20px;
  z-index: 20;

  .decor-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, rgba($accent, 0.3), transparent);

    &:last-child {
      background: linear-gradient(270deg, rgba($accent, 0.3), transparent);
    }
  }

  .decor-text {
    font-size: 10px;
    font-weight: 600;
    color: rgba($accent, 0.4);
    letter-spacing: 3px;
  }
}

// 响应式
@media (max-width: 1200px) {
  .slide-frame {
    width: 180px;
    height: 120px;
  }

  .carousel-content {
    left: 40px;

    .content-title {
      font-size: 36px;
    }
  }

  .frame-indicator {
    right: 40px;
  }
}

@media (max-width: 768px) {
  .slide-frame {
    width: 140px;
    height: 95px;
  }

  .carousel-content {
    left: 20px;

    .content-title {
      font-size: 28px;
    }
  }

  .frame-indicator {
    right: 20px;

    .indicator-ring {
      width: 60px;
      height: 60px;
    }

    .indicator-value {
      font-size: 22px;
    }
  }
}
</style>
