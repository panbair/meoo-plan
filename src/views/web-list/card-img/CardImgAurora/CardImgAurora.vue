<template>
  <div class="aurora-container" ref="containerRef">
    <!-- SVG 滤镜定义 -->
    <svg class="aurora-filters" aria-hidden="true">
      <defs>
        <filter id="auroraTurbulence">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.008 0.015"
            numOctaves="3"
            seed="15"
            result="turbulence"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="turbulence"
            scale="20"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
        <filter id="auroraBlend">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>
    </svg>

    <!-- 背景图片层 -->
    <div class="aurora-image-layer" ref="imageLayerRef">
      <img
        class="aurora-image"
        ref="auroraImageRef"
        src="https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1920&q=80"
        alt="Aurora Borealis"
      />
      <div class="aurora-image-overlay" ref="imageOverlayRef"></div>
    </div>

    <!-- 深层：远景极光 - 最慢 -->
    <div class="curtain-far" ref="curtainFarRef">
      <div class="curtain-far-gradient" />
      <div class="curtain-far-gradient curtain-far-gradient-2" />
    </div>

    <!-- 中层：中景极光 -->
    <div class="curtain-mid" ref="curtainMidRef">
      <div class="curtain-mid-gradient" />
      <div class="curtain-mid-gradient curtain-mid-gradient-2" />
    </div>

    <!-- 近层：近景极光 - 最快 -->
    <div class="curtain-near" ref="curtainNearRef">
      <div class="curtain-near-gradient" />
      <div class="curtain-near-gradient curtain-near-gradient-2" />
      <div class="curtain-near-gradient curtain-near-gradient-3" />
    </div>

    <!-- 星光粒子层 -->
    <div class="star-layer" ref="starLayerRef">
      <div
        v-for="i in 60"
        :key="i"
        class="star-particle"
        :ref="el => { if (el) starRefs[i] = el as HTMLElement }"
        :style="getStarStyle(i)"
      />
    </div>

    <!-- 顶部标签 -->
    <div class="aurora-badge" ref="badgeRef">
      <div class="badge-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
          <circle cx="12" cy="12" r="4" />
        </svg>
      </div>
      <span>AURORA BOREALIS</span>
    </div>

    <!-- 主内容区 -->
    <div class="aurora-content" ref="contentRef">
      <div class="content-wrapper" ref="contentWrapperRef">
        <h1 class="aurora-title" ref="titleRef">
          <span class="title-line">极光之舞</span>
        </h1>
        <p class="aurora-subtitle" ref="subtitleRef">NORTHERN LIGHTS</p>
        <div class="aurora-divider" ref="dividerRef"></div>
        <p class="aurora-description" ref="descriptionRef">
          当太阳风与地球磁场相遇<br/>
          便诞生了这自然界最壮观的奇景
        </p>
        <div class="aurora-cta" ref="ctaRef">
          <span>探索更多</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- 底部信息 -->
    <div class="aurora-bottom" ref="bottomRef">
      <div class="location-info">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        <span>Tromsø, Norway</span>
      </div>
      <div class="aurora-weather">
        <span class="temp">-12°C</span>
        <span class="status">Clear Sky</span>
      </div>
    </div>

    <!-- 鼠标光晕 -->
    <div class="cursor-glow" ref="cursorGlowRef">
      <div class="glow-ripple ripple-1" />
      <div class="glow-ripple ripple-2" />
      <div class="glow-core" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []

const containerRef = ref<HTMLElement | null>(null)
const imageLayerRef = ref<HTMLElement | null>(null)
const auroraImageRef = ref<HTMLImageElement | null>(null)
const imageOverlayRef = ref<HTMLElement | null>(null)
const curtainFarRef = ref<HTMLElement | null>(null)
const curtainMidRef = ref<HTMLElement | null>(null)
const curtainNearRef = ref<HTMLElement | null>(null)
const starLayerRef = ref<HTMLElement | null>(null)
const starRefs: Record<number, HTMLElement> = {}
const badgeRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const contentWrapperRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const dividerRef = ref<HTMLElement | null>(null)
const descriptionRef = ref<HTMLElement | null>(null)
const ctaRef = ref<HTMLElement | null>(null)
const bottomRef = ref<HTMLElement | null>(null)
const cursorGlowRef = ref<HTMLElement | null>(null)

let mouseX = 0
let mouseY = 0
let curtainSeed = 15
let curtainTicker: ((...args: unknown[]) => void) | null = null

const getStarStyle = (i: number) => {
  const x = (i * 23 + Math.random() * 15) % 100
  const y = (i * 31 + Math.random() * 20) % 100
  const size = 1 + (i % 3) * 0.5
  const delay = (i * 0.15) % 4
  const duration = 5 + (i % 5) * 1.5
  const brightness = 0.4 + (i % 6) * 0.1

  return {
    left: `${x}%`,
    top: `${y}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    filter: `brightness(${brightness})`
  }
}

function initAnimations() {
  if (!containerRef.value) return

  // 初始状态设置
  gsap.set(auroraImageRef.value, { scale: 1.1 })
  gsap.set(imageOverlayRef.value, { opacity: 0.5 })
  gsap.set(curtainFarRef.value, {
    y: 0,
    opacity: 0.6,
    filter: 'hue-rotate(0deg) brightness(0.8)'
  })
  gsap.set(curtainMidRef.value, {
    y: 0,
    opacity: 0.7,
    filter: 'hue-rotate(0deg) brightness(0.9)'
  })
  gsap.set(curtainNearRef.value, {
    y: 0,
    opacity: 0.8,
    filter: 'hue-rotate(0deg) brightness(1)'
  })
  gsap.set(starLayerRef.value, { opacity: 0.5 })

  gsap.set(badgeRef.value, { opacity: 0, y: -40 })
  gsap.set(contentWrapperRef.value, { opacity: 0, y: 60 })
  gsap.set(bottomRef.value, { opacity: 0, y: 30 })
  gsap.set(cursorGlowRef.value, { opacity: 0, scale: 0 })

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: containerRef.value,
      start: 'top 100%',
      end: 'bottom 20%',
      scrub: 1.5
    }
  })

  cleanupFns.push(() => tl.kill())

  // 入场动画 (0-15%)
  tl.to(badgeRef.value, {
    opacity: 1,
    y: 0,
    duration: 0.1,
    ease: 'back.out(1.7)'
  }, 0)

  tl.to(contentWrapperRef.value, {
    opacity: 1,
    y: 0,
    duration: 0.15,
    ease: 'power3.out'
  }, 0.02)

  tl.to(bottomRef.value, {
    opacity: 1,
    y: 0,
    duration: 0.1
  }, 0.04)

  tl.to(cursorGlowRef.value, {
    opacity: 1,
    scale: 1,
    duration: 0.15,
    ease: 'back.out(2)'
  }, 0.06)

  // 图片缩放
  tl.to(auroraImageRef.value, {
    scale: 1.2,
    duration: 0.7
  }, 0.15)

  // 视差漂移 (15-85%)
  // 背景图片
  tl.to(imageLayerRef.value, {
    y: -100,
    duration: 0.7
  }, 0.15)

  // 远景极光 - 最慢 (0.06系数)
  tl.to(curtainFarRef.value, {
    y: -150,
    opacity: 0.4,
    duration: 0.7
  }, 0.15)

  // 中景极光 - 中速 (0.15系数)
  tl.to(curtainMidRef.value, {
    y: -350,
    opacity: 0.6,
    duration: 0.7
  }, 0.15)

  // 近景极光 - 最快 (0.3系数)
  tl.to(curtainNearRef.value, {
    y: -700,
    opacity: 0.9,
    duration: 0.7
  }, 0.15)

  // 星光粒子上升
  tl.to(starLayerRef.value, {
    y: -500,
    opacity: 0.8,
    duration: 0.7
  }, 0.15)

  // 图片覆盖层色调变化
  tl.to(imageOverlayRef.value, {
    opacity: 0.7,
    duration: 0.35
  }, 0.3)

  // 色相循环 - 翠绿与紫罗兰之间
  tl.to([curtainFarRef.value, curtainMidRef.value], {
    filter: 'hue-rotate(-40deg) saturate(1.3)',
    duration: 0.35
  }, 0.3)

  tl.to([curtainFarRef.value, curtainMidRef.value], {
    filter: 'hue-rotate(30deg) saturate(1.1)',
    duration: 0.35
  }, 0.6)

  // 回卷动画 (85-100%)
  tl.to(auroraImageRef.value, {
    scale: 1.1,
    duration: 0.15
  }, 0.85)

  tl.to(imageLayerRef.value, {
    y: 0,
    duration: 0.15
  }, 0.85)

  tl.to(curtainFarRef.value, {
    y: 0,
    opacity: 0.6,
    filter: 'hue-rotate(0deg) brightness(0.8)',
    duration: 0.15
  }, 0.85)

  tl.to(curtainMidRef.value, {
    y: 0,
    opacity: 0.7,
    filter: 'hue-rotate(0deg) brightness(0.9)',
    duration: 0.15
  }, 0.85)

  tl.to(curtainNearRef.value, {
    y: 0,
    opacity: 0.8,
    duration: 0.15
  }, 0.85)

  tl.to(starLayerRef.value, {
    y: 0,
    opacity: 0.5,
    duration: 0.15
  }, 0.85)

  tl.to([badgeRef.value, contentWrapperRef.value, bottomRef.value, cursorGlowRef.value], {
    opacity: 0,
    duration: 0.1
  }, 0.88)
}

function initCurtainWobble() {
  curtainTicker = () => {
    curtainSeed += 0.02
    if (curtainFarRef.value) {
      const wobbleX = Math.sin(curtainSeed * 0.5) * 5
      gsap.set(curtainFarRef.value, { x: wobbleX })
    }
    if (curtainMidRef.value) {
      const wobbleX = Math.cos(curtainSeed * 0.7) * 8
      gsap.set(curtainMidRef.value, { x: wobbleX })
    }
    if (curtainNearRef.value) {
      const wobbleX = Math.sin(curtainSeed * 0.9) * 10
      gsap.set(curtainNearRef.value, { x: wobbleX })
    }
  }

  gsap.ticker.add(curtainTicker)
  cleanupFns.push(() => {
    if (curtainTicker) {
      gsap.ticker.remove(curtainTicker)
    }
  })
}

function initMouseInteraction() {
  if (!cursorGlowRef.value || !curtainNearRef.value || !curtainMidRef.value) return

  const handleMouseMove = (e: MouseEvent) => {
    if (!containerRef.value) return
    const rect = containerRef.value.getBoundingClientRect()
    mouseX = e.clientX - rect.left
    mouseY = e.clientY - rect.top

    // 光晕跟随
    gsap.to(cursorGlowRef.value, {
      x: mouseX - 50,
      y: mouseY - 50,
      duration: 0.4,
      ease: 'power2.out'
    })

    // 近景极光扰动
    gsap.to(curtainNearRef.value, {
      x: (mouseX - rect.width / 2) * 0.03,
      opacity: 0.95,
      duration: 0.4,
      ease: 'power2.out'
    })

    // 中景极光扰动
    gsap.to(curtainMidRef.value, {
      x: (mouseX - rect.width / 2) * 0.02,
      duration: 0.5,
      ease: 'power2.out'
    })

    // 图片轻微跟随
    gsap.to(auroraImageRef.value, {
      x: (mouseX - rect.width / 2) * 0.01,
      y: (mouseY - rect.height / 2) * 0.01,
      duration: 0.6,
      ease: 'power2.out'
    })

    // 光晕脉冲
    gsap.to(cursorGlowRef.value, {
      scale: 1.2,
      duration: 0.2,
      ease: 'power2.out',
      overwrite: 'auto'
    })
  }

  const handleMouseLeave = () => {
    gsap.to(cursorGlowRef.value, { opacity: 0, scale: 0, duration: 0.3 })
    gsap.to(curtainNearRef.value, {
      x: 0,
      opacity: 0.8,
      duration: 1,
      ease: 'elastic.out(1, 0.5)'
    })
    gsap.to(curtainMidRef.value, {
      x: 0,
      duration: 0.8,
      ease: 'elastic.out(1, 0.5)'
    })
    gsap.to(auroraImageRef.value, {
      x: 0,
      y: 0,
      duration: 1,
      ease: 'elastic.out(1, 0.5)'
    })
  }

  const handleMouseEnter = () => {
    gsap.to(cursorGlowRef.value, { opacity: 1, scale: 1, duration: 0.3 })
  }

  containerRef.value?.addEventListener('mousemove', handleMouseMove)
  containerRef.value?.addEventListener('mouseleave', handleMouseLeave)
  containerRef.value?.addEventListener('mouseenter', handleMouseEnter)

  cleanupFns.push(() => {
    containerRef.value?.removeEventListener('mousemove', handleMouseMove)
    containerRef.value?.removeEventListener('mouseleave', handleMouseLeave)
    containerRef.value?.removeEventListener('mouseenter', handleMouseEnter)
  })
}

onMounted(() => {
  initAnimations()
  initCurtainWobble()
  initMouseInteraction()
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style scoped lang="scss">
.aurora-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: #050a10;
  overflow: hidden;
}

.aurora-filters {
  position: absolute;
  width: 0;
  height: 0;
  pointer-events: none;
}

// 背景图片层
.aurora-image-layer {
  position: absolute;
  inset: -10%;
  z-index: 1;
  overflow: hidden;
}

.aurora-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform-origin: center;
}

.aurora-image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 20, 40, 0.4) 0%,
    rgba(0, 30, 50, 0.2) 30%,
    rgba(0, 40, 30, 0.3) 60%,
    rgba(5, 10, 16, 0.6) 100%
  );
  mix-blend-mode: multiply;
}

// 远景极光层 - 最慢
.curtain-far {
  position: absolute;
  inset: -30%;
  z-index: 2;
  pointer-events: none;
}

.curtain-far-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(0, 180, 120, 0.25) 30%,
    rgba(0, 150, 100, 0.15) 50%,
    rgba(100, 200, 255, 0.12) 70%,
    transparent 100%
  );
  filter: blur(20px);

  &.curtain-far-gradient-2 {
    background: linear-gradient(
      180deg,
      transparent 0%,
      rgba(150, 100, 200, 0.2) 35%,
      rgba(100, 80, 180, 0.12) 55%,
      rgba(180, 150, 255, 0.08) 75%,
      transparent 100%
    );
    transform: translateX(30%);
    filter: blur(25px);
  }
}

// 中景极光层 - 中速
.curtain-mid {
  position: absolute;
  inset: -25%;
  z-index: 3;
  pointer-events: none;
  mix-blend-mode: screen;
}

.curtain-mid-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(0, 200, 150, 0.3) 25%,
    rgba(0, 180, 130, 0.2) 45%,
    rgba(80, 220, 200, 0.15) 65%,
    transparent 100%
  );
  filter: blur(15px);

  &.curtain-mid-gradient-2 {
    background: linear-gradient(
      180deg,
      transparent 0%,
      rgba(100, 150, 255, 0.25) 30%,
      rgba(80, 130, 220, 0.15) 50%,
      rgba(150, 180, 255, 0.1) 70%,
      transparent 100%
    );
    transform: translateX(-25%);
    filter: blur(18px);
  }
}

// 近景极光层 - 最快
.curtain-near {
  position: absolute;
  inset: -20%;
  z-index: 4;
  pointer-events: none;
  mix-blend-mode: screen;
}

.curtain-near-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(0, 220, 170, 0.35) 20%,
    rgba(0, 200, 150, 0.25) 40%,
    rgba(50, 230, 200, 0.2) 60%,
    transparent 100%
  );
  filter: blur(10px);

  &.curtain-near-gradient-2 {
    background: linear-gradient(
      180deg,
      transparent 0%,
      rgba(150, 100, 255, 0.3) 25%,
      rgba(120, 80, 220, 0.2) 45%,
      rgba(180, 150, 255, 0.15) 65%,
      transparent 100%
    );
    transform: translateX(20%);
    filter: blur(12px);
  }

  &.curtain-near-gradient-3 {
    background: linear-gradient(
      180deg,
      transparent 0%,
      rgba(200, 255, 200, 0.25) 30%,
      rgba(150, 230, 180, 0.15) 50%,
      transparent 100%
    );
    transform: translateX(-15%) translateY(10%);
    filter: blur(8px);
  }
}

// 星光粒子层
.star-layer {
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;
}

.star-particle {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(200, 220, 255, 0.9) 0%,
    rgba(150, 180, 220, 0.4) 50%,
    transparent 100%
  );
  box-shadow: 0 0 4px rgba(180, 200, 255, 0.5);
  animation: starFloat ease-in-out infinite;
}

@keyframes starFloat {
  0%, 100% {
    opacity: 0.3;
    transform: translateY(0);
  }
  50% {
    opacity: 0.7;
    transform: translateY(-15px);
  }
}

// 顶部标签
.aurora-badge {
  position: absolute;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 28px;
  background: rgba(0, 200, 150, 0.2);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(0, 220, 170, 0.4);
  border-radius: 60px;
  z-index: 30;
}

.badge-icon {
  width: 22px;
  height: 22px;
  color: #00dc96;

  svg {
    width: 100%;
    height: 100%;
  }
}

.aurora-badge span {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 3px;
  color: #00dc96;
}

// 主内容区
.aurora-content {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
  padding: 40px;
}

.content-wrapper {
  text-align: center;
  max-width: 800px;
}

.aurora-title {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  font-size: clamp(48px, 10vw, 100px);
  font-weight: 900;
  letter-spacing: 0.2em;
  color: transparent;
  margin: 0 0 20px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(200, 255, 230, 0.8) 30%,
    rgba(100, 220, 180, 0.6) 60%,
    rgba(50, 180, 150, 0.4) 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  text-shadow: 0 0 80px rgba(0, 200, 150, 0.5);
}

.aurora-subtitle {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  font-size: clamp(12px, 2vw, 18px);
  font-weight: 500;
  letter-spacing: 0.8em;
  color: rgba(0, 220, 170, 0.9);
  margin: 0 0 30px;
  text-shadow: 0 0 20px rgba(0, 200, 150, 0.5);
}

.aurora-divider {
  width: 100px;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(0, 220, 170, 0.8) 50%,
    transparent 100%
  );
  margin: 0 auto 30px;
}

.aurora-description {
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: clamp(14px, 1.5vw, 18px);
  line-height: 2;
  color: rgba(255, 255, 255, 0.85);
  margin: 0 0 40px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.aurora-cta {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 16px 36px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 2px;
  color: rgba(0, 220, 170, 0.95);
  background: rgba(0, 30, 50, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 220, 170, 0.5);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.4s ease;

  svg {
    width: 18px;
    height: 18px;
    transition: transform 0.3s ease;
  }

  &:hover {
    background: rgba(0, 80, 100, 0.7);
    border-color: rgba(0, 220, 170, 0.8);
    box-shadow: 0 0 40px rgba(0, 200, 150, 0.4);

    svg {
      transform: translateX(6px);
    }
  }
}

// 底部信息
.aurora-bottom {
  position: absolute;
  bottom: 40px;
  left: 50px;
  right: 50px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  z-index: 30;
}

.location-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  background: rgba(0, 30, 50, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 220, 170, 0.2);
  border-radius: 30px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;

  svg {
    width: 18px;
    height: 18px;
    color: #00dc96;
  }
}

.aurora-weather {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;

  .temp {
    font-size: 28px;
    font-weight: 300;
    color: rgba(255, 255, 255, 0.9);
  }

  .status {
    font-size: 12px;
    letter-spacing: 1px;
    color: rgba(0, 220, 170, 0.7);
  }
}

// 鼠标光晕
.cursor-glow {
  position: absolute;
  width: 100px;
  height: 100px;
  pointer-events: none;
  z-index: 50;
  opacity: 0;
}

.glow-ripple {
  position: absolute;
  inset: 0;
  border: 1px solid rgba(0, 220, 170, 0.4);
  border-radius: 50%;
  transform-origin: center;

  &.ripple-1 {
    animation: rippleExpand 1.8s ease-out infinite;
  }

  &.ripple-2 {
    animation: rippleExpand 1.8s ease-out infinite 0.4s;
  }
}

@keyframes rippleExpand {
  0% {
    transform: scale(0.3);
    opacity: 0.7;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.glow-core {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 14px;
  height: 14px;
  background: radial-gradient(circle, rgba(0, 220, 170, 0.9) 0%, rgba(0, 200, 150, 0.5) 100%);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 25px rgba(0, 220, 170, 0.7);
}
</style>
