<template>
  <div ref="containerRef" class="polarize-container">
    <!-- 背景图片 -->
    <div ref="imageWrapperRef" class="image-wrapper">
      <img
        ref="mainImageRef"
        class="main-image"
        src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&q=80"
        alt="Aurora"
      />
    </div>

    <!-- RGB 色散层 -->
    <div ref="redChannelRef" class="channel-layer red-channel">
      <img
        class="channel-image"
        src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&q=80"
        alt=""
      />
    </div>
    <div ref="greenChannelRef" class="channel-layer green-channel">
      <img
        class="channel-image"
        src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&q=80"
        alt=""
      />
    </div>
    <div ref="blueChannelRef" class="channel-layer blue-channel">
      <img
        class="channel-image"
        src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&q=80"
        alt=""
      />
    </div>

    <!-- 偏振遮罩层 -->
    <div ref="polarizerRef" class="polarizer-layer">
      <!-- 主遮罩 -->
      <div ref="polarizerMainRef" class="polarizer-main" />
      <!-- 边缘虹彩光晕 -->
      <div ref="polarizerEdgeRef" class="polarizer-edge" />
    </div>

    <!-- 偏振光旋转指示 -->
    <div ref="polarIndicatorRef" class="polar-indicator">
      <div class="indicator-ring" />
      <div ref="polarLineRef" class="indicator-line" />
    </div>

    <!-- 四角光学镀膜反光 -->
    <div ref="coatingRef" class="coating-layer">
      <div ref="coatingTlRef" class="coating-corner coating-tl" />
      <div ref="coatingTrRef" class="coating-corner coating-tr" />
      <div ref="coatingBlRef" class="coating-corner coating-bl" />
      <div ref="coatingBrRef" class="coating-corner coating-br" />
    </div>

    <!-- 内容区域 -->
    <div ref="contentRef" class="polarize-content">
      <div class="content-inner">
        <h2 ref="subtitleRef" class="polarize-subtitle">光学解锁</h2>
        <h1 ref="titleRef" class="polarize-title">
          <span class="title-line">偏振</span>
          <span class="title-line accent">显像</span>
        </h1>
        <p ref="descRef" class="polarize-desc">
          透振方向旋转<br />
          图像层层解封
        </p>
      </div>
    </div>

    <!-- 角度指示 -->
    <div ref="angleDisplayRef" class="angle-display">
      <span ref="angleValueRef" class="angle-value">0°</span>
    </div>

    <!-- 角落装饰 -->
    <svg ref="cornerSvgRef" class="corner-frame corner-tl" viewBox="0 0 100 100">
      <path d="M0 30 L0 0 L30 0" fill="none" stroke="currentColor" stroke-width="1" />
      <circle cx="0" cy="0" r="4" fill="currentColor" />
    </svg>
    <svg class="corner-frame corner-br" viewBox="0 0 100 100">
      <path d="M100 70 L100 100 L70 100" fill="none" stroke="currentColor" stroke-width="1" />
      <circle cx="100" cy="100" r="4" fill="currentColor" />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface TweenCleanup {
  kill: () => void
}

const containerRef = ref<HTMLElement | null>(null)
const imageWrapperRef = ref<HTMLElement | null>(null)
const mainImageRef = ref<HTMLElement | null>(null)
const redChannelRef = ref<HTMLElement | null>(null)
const greenChannelRef = ref<HTMLElement | null>(null)
const blueChannelRef = ref<HTMLElement | null>(null)
const polarizerRef = ref<HTMLElement | null>(null)
const polarizerMainRef = ref<HTMLElement | null>(null)
const polarizerEdgeRef = ref<HTMLElement | null>(null)
const polarIndicatorRef = ref<HTMLElement | null>(null)
const polarLineRef = ref<HTMLElement | null>(null)
const coatingRef = ref<HTMLElement | null>(null)
const coatingTlRef = ref<HTMLElement | null>(null)
const coatingTrRef = ref<HTMLElement | null>(null)
const coatingBlRef = ref<HTMLElement | null>(null)
const coatingBrRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const descRef = ref<HTMLElement | null>(null)
const angleDisplayRef = ref<HTMLElement | null>(null)
const angleValueRef = ref<HTMLElement | null>(null)

const cleanupFns: TweenCleanup[] = []

function initScrollAnimation() {
  if (!containerRef.value) return

  const ctx = gsap.context(() => {
    // 初始状态
    gsap.set(polarizerMainRef.value, { opacity: 0.95, filter: 'brightness(0.02)' })
    gsap.set(polarizerEdgeRef.value, { opacity: 0.4 })
    gsap.set(imageWrapperRef.value, { opacity: 0, filter: 'brightness(0.3) saturate(0.3)' })
    gsap.set([redChannelRef.value, greenChannelRef.value, blueChannelRef.value], {
      opacity: 0,
      clipPath: 'circle(0% at 50% 50%)'
    })

    // 主解锁动画
    const unlockTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.value,
        start: 'top 100%',
        end: 'center center',
        scrub: 1.5
      }
    })

    // 偏振旋转角度映射 (0 -> 90度)
    unlockTl
      // 偏振主遮罩渐透
      .to(polarizerMainRef.value, {
        opacity: 0,
        filter: 'brightness(1)',
        duration: 1,
        ease: 'power2.inOut'
      }, 0)
      // 边缘虹彩渐隐
      .to(polarizerEdgeRef.value, {
        opacity: 0,
        duration: 1,
        ease: 'power2.inOut'
      }, 0)
      // 图片渐显
      .to(imageWrapperRef.value, {
        opacity: 1,
        filter: 'brightness(1) saturate(1)',
        duration: 1,
        ease: 'power2.inOut'
      }, 0)
      // 偏振线旋转指示
      .to(polarLineRef.value, {
        rotation: 90,
        duration: 1,
        ease: 'power2.inOut'
      }, 0)
      // 角度显示
      .to(angleValueRef.value, {
        innerText: '90°',
        duration: 1,
        snap: { innerText: 1 },
        ease: 'power2.inOut'
      }, 0)

    cleanupFns.push({ kill: () => unlockTl.kill() })

    // 色散效果 - 在 30-60 度区间出现
    const chromaticTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.value,
        start: 'top 60%',
        end: 'center center',
        scrub: 1.5
      }
    })

    // 红色通道偏移
    chromaticTl
      .to(redChannelRef.value, {
        opacity: 0.5,
        x: 8,
        duration: 1,
        ease: 'power2.inOut'
      }, 0)
      // 绿色通道居中
      .to(greenChannelRef.value, {
        opacity: 0.6,
        x: 0,
        duration: 1,
        ease: 'power2.inOut'
      }, 0)
      // 蓝色通道反向偏移
      .to(blueChannelRef.value, {
        opacity: 0.5,
        x: -8,
        duration: 1,
        ease: 'power2.inOut'
      }, 0)
      // 圆形展开
      .to([redChannelRef.value, greenChannelRef.value, blueChannelRef.value], {
        clipPath: 'circle(100% at 50% 50%)',
        duration: 1,
        ease: 'power2.inOut'
      }, 0)

    cleanupFns.push({ kill: () => chromaticTl.kill() })

    // 色散消失
    const chromaticFadeTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.value,
        start: 'center center',
        end: 'bottom -20%',
        scrub: 1
      }
    })

    chromaticFadeTl
      .to([redChannelRef.value, greenChannelRef.value, blueChannelRef.value], {
        opacity: 0,
        x: 0,
        duration: 0.5,
        ease: 'power2.inOut'
      }, 0)

    cleanupFns.push({ kill: () => chromaticFadeTl.kill() })

    // 四角光学镀膜反光
    const coatingEls = [
      coatingTlRef.value,
      coatingTrRef.value,
      coatingBlRef.value,
      coatingBrRef.value
    ].filter(Boolean)

    coatingEls.forEach((el, i) => {
      if (!el) return

      gsap.set(el, { opacity: 0 })

      // 入场时显示
      const coatingTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.value,
          start: 'center center',
          toggleActions: 'play none none reverse'
        }
      })

      coatingTl.to(el, {
        opacity: 0.15 + Math.random() * 0.1,
        duration: 1,
        ease: 'power2.out'
      })

      // 呼吸动画
      gsap.to(el, {
        opacity: 0.08 + Math.random() * 0.08,
        duration: 4 + i * 0.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: i * 0.8
      })

      cleanupFns.push({ kill: () => coatingTl.kill() })
    })

    // 内容入场
    const contentTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.value,
        start: 'center center',
        toggleActions: 'play none none reverse'
      }
    })

    contentTl
      .fromTo(subtitleRef.value,
        { opacity: 0, y: 30, letterSpacing: '0.6em' },
        { opacity: 1, y: 0, letterSpacing: '0.25em', duration: 1, ease: 'power2.out' }
      )
      .fromTo(titleRef.value,
        { opacity: 0, y: 50, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power2.out' },
        '-=0.5'
      )
      .fromTo(descRef.value,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        '-=0.3'
      )

    cleanupFns.push({ kill: () => contentTl.kill() })

    // 内容视差
    const contentParallaxTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.value,
        start: 'top 100%',
        end: 'bottom 20%',
        scrub: 1.5
      }
    })

    contentParallaxTl
      .to(contentRef.value, { y: '-12%', duration: 1 }, 0)
      .to(imageWrapperRef.value, { y: '8%', duration: 1 }, 0)

    cleanupFns.push({ kill: () => contentParallaxTl.kill() })

  }, containerRef.value)

  cleanupFns.push({ kill: () => ctx.revert() })
}

function handleMouseMove(e: MouseEvent) {
  const x = e.clientX / window.innerWidth
  const y = e.clientY / window.innerHeight

  // 偏振指示器跟随
  if (polarIndicatorRef.value) {
    gsap.to(polarIndicatorRef.value, {
      x: (x - 0.5) * 30,
      y: (y - 0.5) * 30,
      duration: 1.5,
      ease: 'power2.out'
    })
  }

  // 偏振线轻微摆动
  if (polarLineRef.value) {
    gsap.to(polarLineRef.value, {
      rotation: `+=${(x - 0.5) * 10}`,
      duration: 1,
      ease: 'power2.out'
    })
  }

  // 遮罩微扰
  if (polarizerMainRef.value) {
    gsap.to(polarizerMainRef.value, {
      x: (x - 0.5) * -10,
      y: (y - 0.5) * -8,
      duration: 2,
      ease: 'power2.out'
    })
  }

  // 边缘虹彩跟随
  if (polarizerEdgeRef.value) {
    gsap.to(polarizerEdgeRef.value, {
      x: (x - 0.5) * 15,
      y: (y - 0.5) * 15,
      duration: 1.8,
      ease: 'power2.out'
    })
  }
}

function handleMouseLeave() {
  if (polarIndicatorRef.value) {
    gsap.to(polarIndicatorRef.value, {
      x: 0,
      y: 0,
      duration: 2,
      ease: 'elastic.out(1, 0.5)'
    })
  }

  if (polarizerMainRef.value) {
    gsap.to(polarizerMainRef.value, {
      x: 0,
      y: 0,
      duration: 2.5,
      ease: 'elastic.out(1, 0.5)'
    })
  }

  if (polarizerEdgeRef.value) {
    gsap.to(polarizerEdgeRef.value, {
      x: 0,
      y: 0,
      duration: 2,
      ease: 'elastic.out(1, 0.5)'
    })
  }
}

onMounted(() => {
  initScrollAnimation()

  if (containerRef.value) {
    containerRef.value.addEventListener('mousemove', handleMouseMove)
    containerRef.value.addEventListener('mouseleave', handleMouseLeave)
  }
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn.kill())

  if (containerRef.value) {
    containerRef.value.removeEventListener('mousemove', handleMouseMove)
    containerRef.value.removeEventListener('mouseleave', handleMouseLeave)
  }

  ScrollTrigger.getAll().forEach(st => {
    if (st.vars.trigger === containerRef.value) {
      st.kill()
    }
  })
})
</script>

<style scoped lang="scss">
.polarize-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #0a0a0f;
  cursor: crosshair;
}

// 图片包装
.image-wrapper {
  position: absolute;
  inset: 0;
  z-index: 1;

  .main-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

// RGB 色散层
.channel-layer {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;

  .channel-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    mix-blend-mode: screen;
  }
}

.red-channel {
  .channel-image {
    filter: saturate(2) hue-rotate(-20deg) brightness(0.8);
  }
}

.green-channel {
  .channel-image {
    filter: saturate(1.5) brightness(0.7);
  }
}

.blue-channel {
  .channel-image {
    filter: saturate(2) hue-rotate(30deg) brightness(0.8);
  }
}

// 偏振遮罩层
.polarizer-layer {
  position: absolute;
  inset: 0;
  z-index: 10;
  pointer-events: none;
}

.polarizer-main {
  position: absolute;
  inset: 0;
  background: #050508;
  filter: brightness(0.02);
}

.polarizer-edge {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      ellipse 80% 60% at 30% 40%,
      rgba(100, 80, 180, 0.3) 0%,
      transparent 50%
    ),
    radial-gradient(
      ellipse 70% 50% at 70% 60%,
      rgba(80, 100, 180, 0.25) 0%,
      transparent 45%
    ),
    radial-gradient(
      ellipse 60% 40% at 50% 50%,
      rgba(120, 80, 160, 0.2) 0%,
      transparent 40%
    );
  filter: blur(2px);
  mix-blend-mode: screen;
}

// 偏振指示器
.polar-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 120px;
  height: 120px;
  transform: translate(-50%, -50%);
  z-index: 15;
  pointer-events: none;
  opacity: 0.6;

  .indicator-ring {
    position: absolute;
    inset: 0;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 50%;

    &::before {
      content: '';
      position: absolute;
      inset: 20px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 50%;
    }
  }

  .indicator-line {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 50%;
    height: 1px;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.6),
      transparent
    );
    transform-origin: left center;
    transform: translateY(-50%);
  }
}

// 四角光学镀膜反光
.coating-layer {
  position: absolute;
  inset: 0;
  z-index: 12;
  pointer-events: none;
}

.coating-corner {
  position: absolute;
  width: 200px;
  height: 200px;

  &.coating-tl {
    top: 0;
    left: 0;
    background: radial-gradient(
      ellipse at 0% 0%,
      rgba(200, 180, 255, 0.4) 0%,
      rgba(180, 160, 240, 0.2) 30%,
      transparent 60%
    );
  }

  &.coating-tr {
    top: 0;
    right: 0;
    background: radial-gradient(
      ellipse at 100% 0%,
      rgba(200, 180, 255, 0.4) 0%,
      rgba(180, 160, 240, 0.2) 30%,
      transparent 60%
    );
  }

  &.coating-bl {
    bottom: 0;
    left: 0;
    background: radial-gradient(
      ellipse at 0% 100%,
      rgba(200, 180, 255, 0.4) 0%,
      rgba(180, 160, 240, 0.2) 30%,
      transparent 60%
    );
  }

  &.coating-br {
    bottom: 0;
    right: 0;
    background: radial-gradient(
      ellipse at 100% 100%,
      rgba(200, 180, 255, 0.4) 0%,
      rgba(180, 160, 240, 0.2) 30%,
      transparent 60%
    );
  }
}

// 内容区域
.polarize-content {
  position: absolute;
  inset: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.content-inner {
  text-align: center;
  padding: 2rem;
}

.polarize-subtitle {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(0.7rem, 1.2vw, 0.9rem);
  font-weight: 400;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: rgba(200, 180, 255, 0.7);
  margin: 0 0 1.5rem 0;
}

.polarize-title {
  font-family: 'Noto Serif SC', 'STSong', Georgia, serif;
  font-size: clamp(4rem, 12vw, 9rem);
  font-weight: 200;
  line-height: 1.0;
  color: rgba(255, 255, 255, 0.95);
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.1em;
  text-shadow:
    0 0 60px rgba(150, 120, 255, 0.3),
    0 0 120px rgba(100, 80, 200, 0.2);

  .title-line {
    display: block;
  }

  .accent {
    background: linear-gradient(
      135deg,
      rgba(200, 180, 255, 0.9) 0%,
      rgba(150, 200, 255, 0.85) 50%,
      rgba(180, 220, 255, 0.8) 100%
    );
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

.polarize-desc {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(1rem, 2vw, 1.3rem);
  font-weight: 400;
  line-height: 2;
  color: rgba(200, 180, 255, 0.6);
  margin: 2rem 0 0 0;
  letter-spacing: 0.1em;
}

// 角度显示
.angle-display {
  position: absolute;
  bottom: 50px;
  right: 50px;
  z-index: 25;
  font-family: 'Courier New', monospace;

  .angle-value {
    font-size: 1.2rem;
    color: rgba(200, 180, 255, 0.5);
    letter-spacing: 0.1em;
  }
}

// 角落装饰
.corner-frame {
  position: absolute;
  width: 60px;
  height: 60px;
  color: rgba(200, 180, 255, 0.25);
  z-index: 25;

  &.corner-tl {
    top: 25px;
    left: 25px;
  }

  &.corner-br {
    bottom: 25px;
    right: 25px;
  }
}
</style>
