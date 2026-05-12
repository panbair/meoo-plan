<template>
  <div class="gilded-container" ref="containerRef">
    <!-- SVG 滤镜定义 -->
    <svg class="gilded-filters" aria-hidden="true">
      <defs>
        <filter id="fluidTurbulence">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.015 0.008"
            numOctaves="3"
            seed="5"
            result="turbulence"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="turbulence"
            scale="30"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
        <filter id="grainNoise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="4"
            result="noise"
          />
          <feColorMatrix
            type="saturate"
            values="0"
          />
          <feBlend
            in="SourceGraphic"
            mode="overlay"
          />
        </filter>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f4d03f" />
          <stop offset="30%" stop-color="#d4af37" />
          <stop offset="50%" stop-color="#f5b041" />
          <stop offset="70%" stop-color="#d4af37" />
          <stop offset="100%" stop-color="#c9a227" />
        </linearGradient>
        <linearGradient id="copperGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#b87333" />
          <stop offset="50%" stop-color="#cd7f32" />
          <stop offset="100%" stop-color="#8b5a2b" />
        </linearGradient>
      </defs>
    </svg>

    <!-- 动态渐变背景 -->
    <div class="gilded-bg">
      <div class="bg-orb orb-1" />
      <div class="bg-orb orb-2" />
      <div class="bg-orb orb-3" />
    </div>

    <!-- 流体背景层 -->
    <div class="fluid-layer" ref="fluidLayerRef">
      <!-- 主流体 -->
      <div class="fluid-main" ref="fluidMainRef">
        <img
          class="fluid-image"
          src="https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1920&q=80"
          alt=""
        />
        <div class="fluid-overlay" />
      </div>

      <!-- 金属层 -->
      <div class="metal-layer" ref="metalLayerRef">
        <img
          class="metal-image"
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80"
          alt=""
        />
        <div class="metal-sheen" />
      </div>

      <!-- 漩涡层 -->
      <div class="vortex-layer" ref="vortexLayerRef">
        <div class="vortex vortex-1" />
        <div class="vortex vortex-2" />
        <div class="vortex vortex-3" />
      </div>

      <!-- 噪点层 -->
      <div class="grain-layer" ref="grainLayerRef">
        <div class="grain-particles">
          <div v-for="i in 50" :key="i" class="grain-dot" :style="getGrainStyle(i)" />
        </div>
      </div>
    </div>

    <!-- 顶部标签 -->
    <div class="gilded-badge" ref="badgeRef">
      <div class="badge-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      </div>
      <span>GILDED EFFECT</span>
    </div>

    <!-- 信息面板 -->
    <div class="gilded-info" ref="infoRef">
      <div class="info-tag">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
        <span>METALLIC FLOW</span>
      </div>
      <h2 class="info-title">Fluid Gold</h2>
      <p class="info-desc">Experience the mesmerizing flow of liquid metal</p>
      <div class="info-stats">
        <div class="stat">
          <span class="stat-value">24K</span>
          <span class="stat-label">Pure Gold</span>
        </div>
        <div class="stat">
          <span class="stat-value">Liquid</span>
          <span class="stat-label">State</span>
        </div>
        <div class="stat">
          <span class="stat-value">Infinite</span>
          <span class="stat-label">Flow</span>
        </div>
      </div>
    </div>

    <!-- 进度条 -->
    <div class="gilded-progress" ref="progressRef">
      <div class="progress-bar">
        <div ref="progressFillRef" class="progress-fill" />
      </div>
      <div class="progress-labels">
        <span>FLOW STATE</span>
        <span class="progress-value">0%</span>
      </div>
    </div>

    <!-- 鼠标引力指示 -->
    <div class="gravity-indicator" ref="gravityRef">
      <div class="gravity-ring ring-1" />
      <div class="gravity-ring ring-2" />
      <div class="gravity-ring ring-3" />
      <div class="gravity-core" />
    </div>

    <!-- 角落装饰 -->
    <div class="corner-accent top-left" />
    <div class="corner-accent bottom-right" />
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
const fluidLayerRef = ref<HTMLElement | null>(null)
const fluidMainRef = ref<HTMLElement | null>(null)
const metalLayerRef = ref<HTMLElement | null>(null)
const vortexLayerRef = ref<HTMLElement | null>(null)
const grainLayerRef = ref<HTMLElement | null>(null)
const badgeRef = ref<HTMLElement | null>(null)
const infoRef = ref<HTMLElement | null>(null)
const progressRef = ref<HTMLElement | null>(null)
const progressFillRef = ref<HTMLElement | null>(null)
const gravityRef = ref<HTMLElement | null>(null)

let turbulenceEl: SVGFEType | null = null

let mouseX = 0.5
let mouseY = 0.5
let fluidSeed = 5
let tickerCallback: ((...args: unknown[]) => void) | null = null

const getGrainStyle = (i: number) => {
  const x = (i * 37) % 100
  const y = (i * 53) % 100
  const size = 1 + (i % 3)
  const delay = (i * 0.2) % 2
  const duration = 3 + (i % 3)

  return {
    left: `${x}%`,
    top: `${y}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    opacity: 0.1 + (i % 4) * 0.05
  }
}

function initAnimations() {
  if (!containerRef.value) return

  // 初始状态
  gsap.set(fluidLayerRef.value, { y: 0, filter: 'hue-rotate(0deg)' })
  gsap.set(metalLayerRef.value, { y: 0, opacity: 0.7 })
  gsap.set(vortexLayerRef.value, { rotation: 0, scale: 1 })
  gsap.set(grainLayerRef.value, { opacity: 0.3 })

  gsap.set(badgeRef.value, { opacity: 0, y: -40 })
  gsap.set(infoRef.value, { opacity: 0, x: -60 })
  gsap.set(progressRef.value, { opacity: 0, y: 30 })
  gsap.set(gravityRef.value, { opacity: 0, scale: 0 })

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: containerRef.value,
      start: 'top 100%',
      end: 'bottom -100%',
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

  tl.to(infoRef.value, {
    opacity: 1,
    x: 0,
    duration: 0.12,
    ease: 'power3.out'
  }, 0.02)

  tl.to(progressRef.value, {
    opacity: 1,
    y: 0,
    duration: 0.1
  }, 0.04)

  tl.to(gravityRef.value, {
    opacity: 1,
    scale: 1,
    duration: 0.15,
    ease: 'back.out(2)'
  }, 0.06)

  tl.to(grainLayerRef.value, {
    opacity: 0.5,
    duration: 0.1
  }, 0.05)

  // 漂移动画 (15-85%) - 速度系数 0.08
  tl.to(fluidLayerRef.value, {
    y: -120,
    duration: 0.7
  }, 0.15)

  tl.to(metalLayerRef.value, {
    y: -100,
    duration: 0.7
  }, 0.15)

  // 色相循环 - 暖金到冷铜
  tl.to(fluidLayerRef.value, {
    filter: 'hue-rotate(30deg) saturate(1.2)',
    duration: 0.35
  }, 0.3)

  tl.to(fluidLayerRef.value, {
    filter: 'hue-rotate(0deg) saturate(1)',
    duration: 0.35
  }, 0.6)

  // 漩涡旋转
  tl.to(vortexLayerRef.value, {
    rotation: 360,
    scale: 1.1,
    duration: 0.7
  }, 0.15)

  // 噪点呼吸
  tl.to(grainLayerRef.value, {
    opacity: 0.7,
    duration: 0.25,
    ease: 'sine.inOut'
  }, 0.3)

  tl.to(grainLayerRef.value, {
    opacity: 0.3,
    duration: 0.25,
    ease: 'sine.inOut'
  }, 0.5)

  // 回卷动画 (85-100%)
  tl.to(fluidLayerRef.value, {
    y: 0,
    filter: 'hue-rotate(0deg)',
    duration: 0.15
  }, 0.85)

  tl.to(metalLayerRef.value, {
    y: 0,
    duration: 0.15
  }, 0.85)

  tl.to(vortexLayerRef.value, {
    rotation: 0,
    scale: 1,
    duration: 0.15
  }, 0.85)

  tl.to([badgeRef.value, infoRef.value, progressRef.value, gravityRef.value], {
    opacity: 0,
    duration: 0.1
  }, 0.88)
}

function initFluidTicker() {
  // 流体持续变形 - 使用 querySelector 获取 SVG 滤镜元素
  turbulenceEl = document.querySelector('#fluidTurbulence feTurbulence') as SVGFEType | null
  
  tickerCallback = () => {
    if (!turbulenceEl) return
    fluidSeed += 0.01
    turbulenceEl.setAttribute('seed', String(Math.floor(fluidSeed)))
  }

  gsap.ticker.add(tickerCallback)
  cleanupFns.push(() => {
    if (tickerCallback) {
      gsap.ticker.remove(tickerCallback)
    }
  })
}

function initMouseInteraction() {
  if (!gravityRef.value || !fluidLayerRef.value) return

  const handleMouseMove = (e: MouseEvent) => {
    if (!containerRef.value) return
    const rect = containerRef.value.getBoundingClientRect()
    mouseX = (e.clientX - rect.left) / rect.width
    mouseY = (e.clientY - rect.top) / rect.height

    // 引力指示器跟随
    gsap.to(gravityRef.value, {
      x: e.clientX - rect.left - 40,
      y: e.clientY - rect.top - 40,
      duration: 0.4,
      ease: 'power2.out'
    })

    // 流体引力扰动
    gsap.to(fluidLayerRef.value, {
      x: (mouseX - 0.5) * 20,
      duration: 0.6,
      ease: 'power2.out'
    })

    gsap.to(metalLayerRef.value, {
      x: (mouseX - 0.5) * 15,
      duration: 0.5,
      ease: 'power2.out'
    })

    // 漩涡扰动
    gsap.to(vortexLayerRef.value, {
      x: (mouseX - 0.5) * 10,
      y: (mouseY - 0.5) * 10,
      duration: 0.4,
      ease: 'power2.out'
    })

    // 引力环动画
    gsap.to('.gravity-ring', {
      scale: 1.3,
      opacity: 0.3,
      duration: 0.3,
      stagger: 0.05
    })
  }

  const handleMouseLeave = () => {
    gsap.to(gravityRef.value, { opacity: 0, scale: 0, duration: 0.3 })
    gsap.to(fluidLayerRef.value, { x: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' })
    gsap.to(metalLayerRef.value, { x: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' })
    gsap.to(vortexLayerRef.value, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' })
  }

  const handleMouseEnter = () => {
    gsap.to(gravityRef.value, { opacity: 1, scale: 1, duration: 0.3 })
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

function initProgressAnimation() {
  ScrollTrigger.create({
    trigger: containerRef.value,
    start: 'top 100%',
    end: 'bottom -100%',
    onUpdate: (self) => {
      if (progressFillRef.value) {
        gsap.to(progressFillRef.value, { scaleX: self.progress, duration: 0.1 })
      }
    }
  })
}

onMounted(() => {
  initAnimations()
  initFluidTicker()
  initMouseInteraction()
  initProgressAnimation()
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style scoped lang="scss">
.gilded-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #1a0a00 0%, #2d1810 40%, #1a0a00 70%, #0d0500 100%);
  overflow: hidden;
}

.gilded-filters {
  position: absolute;
  width: 0;
  height: 0;
  pointer-events: none;
}

// 动态背景
.gilded-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);

  &.orb-1 {
    width: 500px;
    height: 500px;
    background: linear-gradient(135deg, #f4d03f 0%, #c9a227 100%);
    top: -150px;
    right: -100px;
    opacity: 0.3;
    animation: orbFloat 20s ease-in-out infinite;
  }

  &.orb-2 {
    width: 400px;
    height: 400px;
    background: linear-gradient(135deg, #cd7f32 0%, #b87333 100%);
    bottom: -100px;
    left: -80px;
    opacity: 0.25;
    animation: orbFloat 18s ease-in-out infinite reverse;
  }

  &.orb-3 {
    width: 300px;
    height: 300px;
    background: linear-gradient(135deg, #f5b041 0%, #d4af37 100%);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0.2;
    animation: orbFloat 15s ease-in-out infinite;
  }
}

@keyframes orbFloat {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.2;
  }
  33% {
    transform: translate(40px, -30px) scale(1.1);
    opacity: 0.35;
  }
  66% {
    transform: translate(-30px, 40px) scale(0.9);
    opacity: 0.25;
  }
}

// 流体层
.fluid-layer {
  position: absolute;
  inset: -10%;
  z-index: 10;
}

.fluid-main {
  position: absolute;
  inset: 0;
  filter: url(#fluidTurbulence) brightness(0.6) saturate(1.2);
}

.fluid-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.fluid-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(26, 10, 0, 0.3) 0%,
    transparent 30%,
    transparent 70%,
    rgba(26, 10, 0, 0.4) 100%
  );
}

.metal-layer {
  position: absolute;
  inset: 0;
  mix-blend-mode: overlay;
  opacity: 0.7;
}

.metal-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(0.5) brightness(0.8);
}

.metal-sheen {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    45deg,
    transparent 0%,
    rgba(244, 208, 63, 0.1) 30%,
    rgba(205, 127, 50, 0.15) 50%,
    rgba(244, 208, 63, 0.1) 70%,
    transparent 100%
  );
  animation: metalSheen 8s ease-in-out infinite;
}

@keyframes metalSheen {
  0%, 100% {
    transform: translateX(-50%);
    opacity: 0.5;
  }
  50% {
    transform: translateX(50%);
    opacity: 1;
  }
}

// 漩涡层
.vortex-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.vortex {
  position: absolute;
  border-radius: 50%;
  border: 2px solid transparent;
  background: radial-gradient(
    circle,
    transparent 30%,
    rgba(244, 208, 63, 0.1) 60%,
    rgba(205, 127, 50, 0.05) 80%,
    transparent 100%
  );

  &.vortex-1 {
    width: 600px;
    height: 600px;
    top: 20%;
    left: 10%;
    animation: vortexSpin 30s linear infinite;
  }

  &.vortex-2 {
    width: 400px;
    height: 400px;
    bottom: 20%;
    right: 15%;
    animation: vortexSpin 25s linear infinite reverse;
  }

  &.vortex-3 {
    width: 300px;
    height: 300px;
    top: 50%;
    right: 30%;
    animation: vortexSpin 20s linear infinite;
  }
}

@keyframes vortexSpin {
  0% {
    transform: rotate(0deg);
    border-color: rgba(244, 208, 63, 0.1);
  }
  25% {
    border-color: rgba(205, 127, 50, 0.15);
  }
  50% {
    transform: rotate(180deg);
    border-color: rgba(244, 208, 63, 0.1);
  }
  75% {
    border-color: rgba(205, 127, 50, 0.1);
  }
  100% {
    transform: rotate(360deg);
    border-color: rgba(244, 208, 63, 0.1);
  }
}

// 噪点层
.grain-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  mix-blend-mode: overlay;
}

.grain-particles {
  position: absolute;
  inset: 0;
}

.grain-dot {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.8);
  animation: grainFlicker ease-in-out infinite;
}

@keyframes grainFlicker {
  0%, 100% {
    opacity: 0.05;
    transform: scale(1);
  }
  50% {
    opacity: 0.15;
    transform: scale(1.2);
  }
}

// 顶部标签
.gilded-badge {
  position: absolute;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 28px;
  background: rgba(244, 208, 63, 0.15);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(244, 208, 63, 0.3);
  border-radius: 60px;
  z-index: 30;
}

.badge-icon {
  width: 22px;
  height: 22px;
  color: #f4d03f;

  svg {
    width: 100%;
    height: 100%;
  }
}

.gilded-badge span {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 3px;
  color: #f4d03f;
}

// 信息面板
.gilded-info {
  position: absolute;
  bottom: 120px;
  left: 50px;
  padding: 30px;
  background: rgba(26, 10, 0, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(244, 208, 63, 0.2);
  border-radius: 24px;
  max-width: 340px;
  z-index: 30;
}

.info-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #cd7f32;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 2px;
  margin-bottom: 16px;

  svg {
    width: 16px;
    height: 16px;
  }
}

.info-title {
  font-size: 32px;
  font-weight: 700;
  color: #f4d03f;
  margin: 0 0 12px;
  background: linear-gradient(135deg, #f4d03f 0%, #cd7f32 50%, #f5b041 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.info-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 24px;
  line-height: 1.6;
}

.info-stats {
  display: flex;
  gap: 24px;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  color: #f5b041;
}

.stat-label {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 1px;
}

// 进度条
.gilded-progress {
  position: absolute;
  bottom: 50px;
  right: 50px;
  width: 200px;
  z-index: 30;
}

.progress-bar {
  height: 3px;
  background: rgba(244, 208, 63, 0.15);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-fill {
  height: 100%;
  width: 100%;
  background: linear-gradient(90deg, #f4d03f 0%, #cd7f32 50%, #b87333 100%);
  border-radius: 2px;
  transform-origin: left;
  box-shadow: 0 0 12px rgba(244, 208, 63, 0.5);
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  letter-spacing: 1.5px;
  color: rgba(244, 208, 63, 0.5);
}

.progress-value {
  color: #f5b041;
}

// 鼠标引力指示
.gravity-indicator {
  position: absolute;
  width: 80px;
  height: 80px;
  pointer-events: none;
  z-index: 40;
}

.gravity-ring {
  position: absolute;
  inset: 0;
  border: 1px solid rgba(244, 208, 63, 0.4);
  border-radius: 50%;
  transform-origin: center;

  &.ring-1 {
    animation: ringExpand 1.5s ease-out infinite;
  }

  &.ring-2 {
    animation: ringExpand 1.5s ease-out infinite 0.3s;
  }

  &.ring-3 {
    animation: ringExpand 1.5s ease-out infinite 0.6s;
  }
}

@keyframes ringExpand {
  0% {
    transform: scale(0.3);
    opacity: 0.8;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.gravity-core {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 12px;
  height: 12px;
  background: radial-gradient(circle, #f4d03f 0%, #cd7f32 100%);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 20px rgba(244, 208, 63, 0.6);
}

// 角落装饰
.corner-accent {
  position: absolute;
  width: 100px;
  height: 100px;
  z-index: 20;

  &.top-left {
    top: 0;
    left: 0;
    background: linear-gradient(135deg, rgba(244, 208, 63, 0.2) 0%, transparent 50%);
  }

  &.bottom-right {
    bottom: 0;
    right: 0;
    background: linear-gradient(315deg, rgba(244, 208, 63, 0.2) 0%, transparent 50%);
  }
}
</style>
