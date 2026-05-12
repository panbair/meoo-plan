<template>
  <div class="depth-container" ref="containerRef">
    <!-- 背景装饰 -->
    <div class="depth-bg">
      <div class="bg-blur-1" />
      <div class="bg-blur-2" />
      <div class="bg-blur-3" />
    </div>

    <!-- 远景尘埃 -->
    <div class="dust-layer" ref="dustRef">
      <div v-for="i in 20" :key="i" class="dust-particle" :style="getDustStyle(i)" />
    </div>

    <!-- 主内容 -->
    <div class="depth-main" ref="mainRef">
      <!-- 远景层 (最慢) -->
      <div class="layer-far" ref="layerFarRef">
        <img
          class="layer-img"
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
          alt=""
        />
        <div class="far-overlay" />
        <div class="far-mist mist-1" />
        <div class="far-mist mist-2" />
      </div>

      <!-- 中景层 (中等) -->
      <div class="layer-mid" ref="layerMidRef">
        <img
          class="layer-img"
          src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80"
          alt=""
        />
        <div class="mid-overlay" />
      </div>

      <!-- 前景层 (最快) -->
      <div class="layer-near" ref="layerNearRef">
        <img
          class="layer-img"
          src="https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=1920&q=80"
          alt=""
        />
        <div class="near-overlay" />
        <div class="near-vignette" />
      </div>

      <!-- 光粒子带 -->
      <div class="light-stream" ref="lightStreamRef">
        <div v-for="i in 30" :key="i" class="stream-particle" :style="getStreamStyle(i)" />
      </div>
    </div>

    <!-- 顶部标题 -->
    <div class="depth-header" ref="headerRef">
      <div class="header-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </div>
      <span>DEPTH JOURNEY</span>
    </div>

    <!-- 左侧信息 -->
    <div class="depth-info" ref="infoRef">
      <div class="info-label">IMMERSIVE</div>
      <h2 class="info-title">Multi-Dimensional</h2>
      <p class="info-desc">Experience the depth perception through layered parallax scrolling</p>
      <div class="info-metrics">
        <div class="metric">
          <span class="metric-value">3</span>
          <span class="metric-label">Layers</span>
        </div>
        <div class="metric">
          <span class="metric-value">360</span>
          <span class="metric-label">View</span>
        </div>
        <div class="metric">
          <span class="metric-value">4K</span>
          <span class="metric-label">Quality</span>
        </div>
      </div>
    </div>

    <!-- 右侧进度 -->
    <div class="depth-progress" ref="progressRef">
      <div class="progress-track">
        <div ref="progressFillRef" class="progress-fill" />
      </div>
      <div class="progress-labels">
        <span>DEPTH</span>
        <span class="depth-value">0%</span>
      </div>
    </div>

    <!-- 角落装饰 -->
    <div class="corner-graphic top-left">
      <svg viewBox="0 0 100 100" fill="none">
        <path d="M0 0 L40 0 L40 5 L5 5 L5 40 L0 40 Z" fill="currentColor" />
      </svg>
    </div>
    <div class="corner-graphic bottom-right">
      <svg viewBox="0 0 100 100" fill="none">
        <path d="M100 100 L60 100 L60 95 L95 95 L95 60 L100 60 Z" fill="currentColor" />
      </svg>
    </div>

    <!-- 鼠标指示器 -->
    <div class="mouse-indicator" ref="mouseIndicatorRef">
      <div class="indicator-ring" />
      <div class="indicator-dot" />
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
const mainRef = ref<HTMLElement | null>(null)
const layerFarRef = ref<HTMLElement | null>(null)
const layerMidRef = ref<HTMLElement | null>(null)
const layerNearRef = ref<HTMLElement | null>(null)
const dustRef = ref<HTMLElement | null>(null)
const lightStreamRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const infoRef = ref<HTMLElement | null>(null)
const progressRef = ref<HTMLElement | null>(null)
const progressFillRef = ref<HTMLElement | null>(null)
const mouseIndicatorRef = ref<HTMLElement | null>(null)

let mouseX = 0.5
let mouseY = 0.5

const getDustStyle = (i: number) => {
  const x = 5 + ((i * 37) % 90)
  const y = 5 + ((i * 53) % 90)
  const size = 1 + (i % 2)
  const delay = (i * 0.5) % 4
  const duration = 8 + (i % 4)

  return {
    left: `${x}%`,
    top: `${y}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    opacity: 0.1 + (i % 3) * 0.05
  }
}

const getStreamStyle = (i: number) => {
  const x = 10 + ((i * 29) % 80)
  const size = 1 + (i % 3)
  const delay = (i * 0.2) % 3
  const duration = 2 + (i % 2)
  const y = 100 + ((i * 15) % 200)

  return {
    left: `${x}%`,
    bottom: `${y}%`,
    width: `${size}px`,
    height: `${size * 3}px`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    opacity: 0.2 + (i % 4) * 0.1
  }
}

function initAnimations() {
  if (!containerRef.value) return

  gsap.set([layerFarRef.value, layerMidRef.value, layerNearRef.value], {
    y: 0,
    scale: 1,
    rotation: 0
  })

  gsap.set(layerFarRef.value, { scale: 1.1, filter: 'blur(2px) brightness(0.7)' })
  gsap.set(layerMidRef.value, { scale: 1.05, filter: 'blur(1px) brightness(0.85)' })
  gsap.set(layerNearRef.value, { scale: 1.02, filter: 'blur(0.5px) brightness(0.95)' })

  gsap.set(headerRef.value, { opacity: 0, y: -50 })
  gsap.set(infoRef.value, { opacity: 0, x: -60 })
  gsap.set(progressRef.value, { opacity: 0, y: 30 })
  gsap.set('.dust-particle', { opacity: 0 })
  gsap.set('.stream-particle', { opacity: 0, y: 0 })

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
  tl.to(headerRef.value, {
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

  tl.to('.dust-particle', {
    opacity: 0.3,
    stagger: { each: 0.02, from: 'random' },
    duration: 0.08
  }, 0.05)

  tl.to('.stream-particle', {
    opacity: 0.6,
    stagger: { each: 0.03, from: 'random' },
    y: -200,
    duration: 0.15
  }, 0.08)

  // 远景层 - 最慢
  tl.to(layerFarRef.value, {
    y: -80,
    scale: 1.15,
    rotation: 0.3,
    filter: 'blur(3px) brightness(0.8)',
    duration: 0.7
  }, 0.15)

  // 中景层 - 中等
  tl.to(layerMidRef.value, {
    y: -200,
    scale: 1.1,
    rotation: -0.2,
    filter: 'blur(1.5px) brightness(0.9)',
    duration: 0.7
  }, 0.15)

  // 前景层 - 最快
  tl.to(layerNearRef.value, {
    y: -350,
    scale: 1.08,
    rotation: 0.1,
    filter: 'blur(0px) brightness(1)',
    duration: 0.7
  }, 0.15)

  // 呼吸效果
  tl.to([layerFarRef.value, layerMidRef.value, layerNearRef.value], {
    scale: '+=0.02',
    duration: 0.25,
    ease: 'sine.inOut'
  }, 0.4)

  tl.to([layerFarRef.value, layerMidRef.value, layerNearRef.value], {
    scale: '-=0.02',
    duration: 0.25,
    ease: 'sine.inOut'
  }, 0.6)

  // 粒子流动
  tl.to('.stream-particle', {
    y: -600,
    opacity: 0,
    stagger: { each: 0.02, from: 'random' },
    duration: 0.4
  }, 0.2)

  // 回卷动画 (85-100%)
  tl.to(layerNearRef.value, {
    y: 0,
    scale: 1.02,
    rotation: 0,
    duration: 0.15
  }, 0.85)

  tl.to(layerMidRef.value, {
    y: 0,
    scale: 1.05,
    rotation: 0,
    duration: 0.15
  }, 0.85)

  tl.to(layerFarRef.value, {
    y: 0,
    scale: 1.1,
    rotation: 0,
    duration: 0.15
  }, 0.85)

  tl.to('.stream-particle', {
    opacity: 0,
    duration: 0.1
  }, 0.85)
}

function initMouseInteraction() {
  if (!mainRef.value || !layerFarRef.value || !layerMidRef.value || !layerNearRef.value || !mouseIndicatorRef.value) return

  const handleMouseMove = (e: MouseEvent) => {
    if (!containerRef.value) return
    const rect = containerRef.value.getBoundingClientRect()
    mouseX = (e.clientX - rect.left) / rect.width
    mouseY = (e.clientY - rect.top) / rect.height

    gsap.to(mouseIndicatorRef.value, {
      x: e.clientX - rect.left - 30,
      y: e.clientY - rect.top - 30,
      duration: 0.3,
      ease: 'power2.out'
    })

    gsap.to(layerFarRef.value, {
      x: (mouseX - 0.5) * 10,
      y: (mouseY - 0.5) * 8 - 80,
      duration: 0.8,
      ease: 'power2.out'
    })

    gsap.to(layerMidRef.value, {
      x: (mouseX - 0.5) * 20,
      y: (mouseY - 0.5) * 15 - 200,
      duration: 0.6,
      ease: 'power2.out'
    })

    gsap.to(layerNearRef.value, {
      x: (mouseX - 0.5) * 35,
      y: (mouseY - 0.5) * 25 - 350,
      duration: 0.4,
      ease: 'power2.out'
    })
  }

  const handleMouseLeave = () => {
    gsap.to(mouseIndicatorRef.value, { opacity: 0, duration: 0.3 })
    gsap.to([layerFarRef.value, layerMidRef.value, layerNearRef.value], {
      x: 0,
      duration: 0.6,
      ease: 'power2.out'
    })
  }

  containerRef.value?.addEventListener('mousemove', handleMouseMove)
  containerRef.value?.addEventListener('mouseleave', handleMouseLeave)

  gsap.to(mouseIndicatorRef.value, { opacity: 1, duration: 0.3 })

  cleanupFns.push(() => {
    containerRef.value?.removeEventListener('mousemove', handleMouseMove)
    containerRef.value?.removeEventListener('mouseleave', handleMouseLeave)
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
.depth-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 40%, #24243e 70%, #1a1a2e 100%);
  overflow: hidden;
}

.depth-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.bg-blur-1,
.bg-blur-2,
.bg-blur-3 {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
}

.bg-blur-1 {
  width: 500px;
  height: 500px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  top: -150px;
  right: -100px;
  opacity: 0.3;
  animation: bgFloat 20s ease-in-out infinite;
}

.bg-blur-2 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  bottom: -100px;
  left: -80px;
  opacity: 0.25;
  animation: bgFloat 18s ease-in-out infinite reverse;
}

.bg-blur-3 {
  width: 350px;
  height: 350px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  top: 50%;
  left: 30%;
  opacity: 0.2;
  animation: bgFloat 15s ease-in-out infinite;
}

@keyframes bgFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -20px) scale(1.1); }
  66% { transform: translate(-20px, 30px) scale(0.9); }
}

.dust-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 5;
}

.dust-particle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.8);
  animation: dustFloat linear infinite;
}

@keyframes dustFloat {
  0%, 100% {
    transform: translateY(0) translateX(0);
    opacity: 0.1;
  }
  50% {
    transform: translateY(-30px) translateX(20px);
    opacity: 0.3;
  }
}

.depth-main {
  position: absolute;
  inset: -20%;
  z-index: 10;
}

.layer-far,
.layer-mid,
.layer-near {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.layer-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.layer-far {
  z-index: 1;

  .layer-img {
    filter: saturate(0.7);
  }
}

.far-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at center,
    rgba(48, 43, 99, 0.4) 0%,
    rgba(15, 12, 41, 0.6) 100%
  );
}

.far-mist {
  position: absolute;
  width: 150%;
  height: 200px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.03) 30%,
    rgba(255, 255, 255, 0.05) 50%,
    rgba(255, 255, 255, 0.03) 70%,
    transparent 100%
  );
  animation: mistDrift 20s ease-in-out infinite;

  &.mist-1 {
    top: 30%;
  }

  &.mist-2 {
    top: 60%;
    animation-delay: -10s;
    animation-direction: reverse;
  }
}

@keyframes mistDrift {
  0%, 100% { transform: translateX(-25%); }
  50% { transform: translateX(0%); }
}

.layer-mid {
  z-index: 2;

  .layer-img {
    filter: saturate(0.9);
  }
}

.mid-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at center,
    rgba(100, 126, 234, 0.2) 0%,
    rgba(15, 12, 41, 0.3) 100%
  );
}

.layer-near {
  z-index: 3;

  .layer-img {
    filter: saturate(1.1);
  }
}

.near-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(15, 12, 41, 0.2) 0%,
    transparent 30%,
    transparent 70%,
    rgba(15, 12, 41, 0.3) 100%
  );
}

.near-vignette {
  position: absolute;
  inset: 0;
  box-shadow: inset 0 0 150px rgba(15, 12, 41, 0.5);
}

.light-stream {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 4;
  overflow: hidden;
}

.stream-particle {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.8) 0%,
    rgba(162, 155, 254, 0.4) 100%
  );
  animation: streamFlow linear infinite;
}

@keyframes streamFlow {
  0% {
    transform: translateY(0);
    opacity: 0;
  }
  10% {
    opacity: 0.6;
  }
  90% {
    opacity: 0.3;
  }
  100% {
    transform: translateY(-600px);
    opacity: 0;
  }
}

.depth-header {
  position: absolute;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 28px;
  background: rgba(48, 43, 99, 0.5);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(162, 155, 254, 0.3);
  border-radius: 60px;
  z-index: 20;
}

.header-icon {
  width: 22px;
  height: 22px;
  color: #ffeaa7;

  svg {
    width: 100%;
    height: 100%;
  }
}

.depth-header span {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 3px;
  color: rgba(255, 255, 255, 0.9);
}

.depth-info {
  position: absolute;
  bottom: 120px;
  left: 50px;
  padding: 30px;
  background: rgba(48, 43, 99, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(162, 155, 254, 0.2);
  border-radius: 24px;
  max-width: 340px;
  z-index: 20;
}

.info-label {
  display: inline-block;
  padding: 6px 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
  color: #fff;
  margin-bottom: 16px;
}

.info-title {
  font-size: 32px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 12px;
  background: linear-gradient(135deg, #fff 0%, #a29bfe 50%, #667eea 100%);
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

.info-metrics {
  display: flex;
  gap: 24px;
}

.metric {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.metric-value {
  font-size: 22px;
  font-weight: 700;
  color: #4facfe;
}

.metric-label {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.depth-progress {
  position: absolute;
  bottom: 50px;
  right: 50px;
  width: 200px;
  z-index: 20;
}

.progress-track {
  height: 3px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-fill {
  height: 100%;
  width: 100%;
  background: linear-gradient(90deg, #4facfe 0%, #667eea 50%, #f093fb 100%);
  border-radius: 2px;
  transform-origin: left;
  box-shadow: 0 0 12px rgba(79, 172, 254, 0.6);
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  letter-spacing: 1.5px;
  color: rgba(255, 255, 255, 0.4);
}

.depth-value {
  color: #ffeaa7;
}

.corner-graphic {
  position: absolute;
  width: 80px;
  height: 80px;
  color: rgba(162, 155, 254, 0.4);
  z-index: 20;

  &.top-left {
    top: 20px;
    left: 20px;
  }

  &.bottom-right {
    bottom: 20px;
    right: 20px;
  }

  svg {
    width: 100%;
    height: 100%;
  }
}

.mouse-indicator {
  position: absolute;
  width: 60px;
  height: 60px;
  pointer-events: none;
  z-index: 30;
  opacity: 0;
}

.indicator-ring {
  position: absolute;
  inset: 0;
  border: 1px solid rgba(162, 155, 254, 0.5);
  border-radius: 50%;
  animation: ringPulse 1.5s ease-in-out infinite;
}

.indicator-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  background: #ffeaa7;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 15px rgba(255, 234, 167, 0.8);
}

@keyframes ringPulse {
  0%, 100% {
    transform: scale(0.8);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.6;
  }
}
</style>
