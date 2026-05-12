<template>
  <div ref="containerRef" class="curtain-container">
    <!-- 渐变背景 -->
    <div class="curtain-bg">
      <div class="bg-blur-circle circle-1" />
      <div class="bg-blur-circle circle-2" />
      <div class="bg-blur-circle circle-3" />
    </div>

    <!-- 装饰粒子 -->
    <div class="particles" ref="particlesRef">
      <div v-for="i in 20" :key="i" class="particle" :style="getParticleStyle(i)" />
    </div>

    <!-- 主体内容 -->
    <div ref="mainContentRef" class="main-content">
      <!-- 图片层 -->
      <div ref="imageWrapperRef" class="image-wrapper">
        <img
          ref="mainImageRef"
          class="main-image"
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
          alt="Mountain Landscape"
        />
        <div class="image-vignette" />
        <div class="image-shimmer" />
      </div>

      <!-- 左侧遮罩 - 半透明图片背景 -->
      <div ref="leftCurtainRef" class="curtain curtain-left">
        <div class="curtain-surface">
          <img
            class="curtain-image"
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
            alt=""
          />
          <div class="curtain-overlay" />
          <div class="curtain-bubbles">
            <div class="bubble b1" />
            <div class="bubble b2" />
            <div class="bubble b3" />
          </div>
        </div>
        <div class="curtain-glow glow-left" />
      </div>

      <!-- 右侧遮罩 - 半透明图片背景 -->
      <div ref="rightCurtainRef" class="curtain curtain-right">
        <div class="curtain-surface">
          <img
            class="curtain-image"
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
            alt=""
          />
          <div class="curtain-overlay" />
          <div class="curtain-bubbles">
            <div class="bubble b4" />
            <div class="bubble b5" />
            <div class="bubble b6" />
          </div>
        </div>
        <div class="curtain-glow glow-right" />
      </div>

      <!-- 中央光芒 -->
      <div ref="centerSeamRef" class="center-seam">
        <div class="seam-glow" />
        <div class="seam-particles">
          <div class="spark s1" />
          <div class="spark s2" />
          <div class="spark s3" />
        </div>
      </div>
    </div>

    <!-- 顶部装饰带 -->
    <div class="top-decor">
      <div class="deco-line line-1" />
      <div class="deco-line line-2" />
      <div class="deco-dots">
        <span v-for="i in 5" :key="i" class="dot" />
      </div>
    </div>

    <!-- 信息面板 - 青春风格 -->
    <div ref="infoPanelRef" class="info-panel">
      <div class="panel-tag">
        <svg class="tag-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        <span>LIMITED</span>
      </div>
      <h2 ref="titleRef" class="panel-title">Dream Adventure</h2>
      <p ref="subtitleRef" class="panel-subtitle">Explore the Unknown</p>
      <div ref="statusRef" class="panel-actions">
        <button class="action-btn primary">
          <span>Discover</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
        <button class="action-btn secondary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </div>
    </div>

    <!-- 右下角装饰 -->
    <div class="bottom-decor">
      <div class="float-shapes">
        <div class="shape circle" />
        <div class="shape square" />
        <div class="shape triangle" />
      </div>
    </div>

    <!-- 进度指示 - 青春风格 -->
    <div ref="progressRef" class="progress-indicator">
      <div class="progress-track">
        <div ref="progressFillRef" class="progress-fill" />
        <div class="progress-glow" />
      </div>
      <div class="progress-labels">
        <span ref="progressTextRef" class="progress-text">READY</span>
        <span class="progress-percent">0%</span>
      </div>
    </div>

    <!-- 角落装饰 -->
    <div class="corner-decor top-left">
      <div class="corner-line h" />
      <div class="corner-line v" />
    </div>
    <div class="corner-decor top-right">
      <div class="corner-line h" />
      <div class="corner-line v" />
    </div>
    <div class="corner-decor bottom-left">
      <div class="corner-line h" />
      <div class="corner-line v" />
    </div>
    <div class="corner-decor bottom-right">
      <div class="corner-line h" />
      <div class="corner-line v" />
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
const mainContentRef = ref<HTMLElement | null>(null)
const imageWrapperRef = ref<HTMLElement | null>(null)
const mainImageRef = ref<HTMLElement | null>(null)
const leftCurtainRef = ref<HTMLElement | null>(null)
const rightCurtainRef = ref<HTMLElement | null>(null)
const centerSeamRef = ref<HTMLElement | null>(null)
const particlesRef = ref<HTMLElement | null>(null)
const infoPanelRef = ref<HTMLElement | null>(null)
const progressRef = ref<HTMLElement | null>(null)
const progressFillRef = ref<HTMLElement | null>(null)
const progressTextRef = ref<HTMLElement | null>(null)

const getParticleStyle = (i: number) => {
  const colors = ['#ff6b9d', '#c44569', '#6c5ce7', '#a29bfe', '#fd79a8', '#74b9ff']
  const size = 4 + (i % 4) * 2
  const x = 10 + ((i * 47) % 80)
  const y = 10 + ((i * 31) % 80)
  const delay = (i * 0.3) % 3
  const duration = 3 + (i % 3)
  const color = colors[i % colors.length]

  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${x}%`,
    top: `${y}%`,
    background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    opacity: 0.3 + (i % 3) * 0.2
  }
}

function initAnimations() {
  if (!containerRef.value) return

  // 初始状态
  gsap.set(leftCurtainRef.value, { scaleX: 1, x: 0 })
  gsap.set(rightCurtainRef.value, { scaleX: 1, x: 0 })
  gsap.set(centerSeamRef.value, { opacity: 0, scaleY: 0.3 })
  gsap.set(mainImageRef.value, { filter: 'brightness(0.7) saturate(0.8)', scale: 1.08 })
  gsap.set(infoPanelRef.value, { opacity: 0, x: -50, y: 20 })
  gsap.set(progressRef.value, { opacity: 0, y: 30 })
  gsap.set('.particle', { opacity: 0, scale: 0 })
  gsap.set('.corner-decor', { opacity: 0 })

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: containerRef.value,
      start: 'top 100%',
      end: 'bottom -100%',
      scrub: 1.5
    }
  })

  cleanupFns.push(() => tl.kill())

  // 准备阶段 (0-10%)
  // 粒子显现
  tl.to('.particle', {
    opacity: 1,
    scale: 1,
    stagger: { each: 0.05, from: 'random' },
    duration: 0.08
  }, 0)

  // 角落装饰
  tl.to('.corner-decor', {
    opacity: 1,
    stagger: 0.02,
    duration: 0.06
  }, 0.02)

  // 中央光芒
  tl.to(centerSeamRef.value, {
    opacity: 1,
    scaleY: 1,
    duration: 0.1,
    ease: 'back.out(2)'
  }, 0.05)

  // 遮罩轻微震动
  tl.to([leftCurtainRef.value, rightCurtainRef.value], {
    scaleX: 1.01,
    scaleY: 1.02,
    duration: 0.04,
    ease: 'power2.inOut'
  }, 0.06)

  tl.to([leftCurtainRef.value, rightCurtainRef.value], {
    scaleX: 1,
    scaleY: 1,
    duration: 0.04,
    ease: 'elastic.out(1, 0.5)'
  }, 0.1)

  // 开启阶段 (10-70%)
  // 左遮罩滑开
  tl.to(leftCurtainRef.value, {
    scaleX: 0,
    x: '-100%',
    duration: 0.55,
    ease: 'power4.out'
  }, 0.1)

  // 右遮罩滑开
  tl.to(rightCurtainRef.value, {
    scaleX: 0,
    x: '100%',
    duration: 0.55,
    ease: 'power4.out'
  }, 0.1)

  // 图像效果
  tl.to(mainImageRef.value, {
    filter: 'brightness(0.95) saturate(1.1)',
    scale: 1.02,
    duration: 0.5,
    ease: 'power2.out'
  }, 0.12)

  // 中央光芒消失
  tl.to(centerSeamRef.value, {
    opacity: 0,
    scaleY: 1.5,
    duration: 0.2,
    ease: 'power2.in'
  }, 0.15)

  // 图像最终调整
  tl.to(mainImageRef.value, {
    filter: 'brightness(1) saturate(1)',
    scale: 1,
    duration: 0.2,
    ease: 'back.out(1.5)'
  }, 0.7)

  // 阶段 (70-85%)
  // 信息面板入场
  tl.to(infoPanelRef.value, {
    opacity: 1,
    x: 0,
    y: 0,
    duration: 0.2,
    ease: 'back.out(1.7)'
  }, 0.65)

  // 进度指示入场
  tl.to(progressRef.value, {
    opacity: 1,
    y: 0,
    duration: 0.15,
    ease: 'power3.out'
  }, 0.72)

  // 气泡动画
  tl.to('.bubble', {
    y: -100,
    opacity: 0,
    stagger: 0.1,
    duration: 0.4,
    ease: 'power2.out'
  }, 0.15)

  // 关闭阶段 (85-100%)
  // 粒子消失
  tl.to('.particle', {
    opacity: 0,
    scale: 0,
    stagger: { each: 0.03, from: 'random' },
    duration: 0.1
  }, 0.88)

  // 图像暗淡
  tl.to(mainImageRef.value, {
    filter: 'brightness(0.6) saturate(0.8)',
    scale: 0.98,
    duration: 0.12
  }, 0.9)

  // 遮罩关闭
  tl.to(leftCurtainRef.value, {
    scaleX: 1,
    x: 0,
    duration: 0.15,
    ease: 'power4.inOut'
  }, 0.88)

  tl.to(rightCurtainRef.value, {
    scaleX: 1,
    x: 0,
    duration: 0.15,
    ease: 'power4.inOut'
  }, 0.88)

  // 中央光芒再次显现
  tl.to(centerSeamRef.value, {
    opacity: 0.8,
    scaleY: 0.8,
    duration: 0.08,
    ease: 'back.out(2)'
  }, 0.96)

  // 信息面板离场
  tl.to(infoPanelRef.value, {
    opacity: 0,
    x: -60,
    duration: 0.1
  }, 0.92)

  // 进度指示离场
  tl.to(progressRef.value, {
    opacity: 0,
    y: 30,
    duration: 0.08
  }, 0.94)

  // 角落装饰消失
  tl.to('.corner-decor', {
    opacity: 0,
    stagger: 0.01,
    duration: 0.06
  }, 0.96)
}

function initParticleAnimation() {
  // 粒子漂浮动画
  gsap.to('.particle', {
    y: 'random(-30, 30)',
    x: 'random(-20, 20)',
    rotation: 'random(-180, 180)',
    duration: 'random(2, 4)',
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    stagger: {
      each: 0.2,
      from: 'random'
    }
  })

  cleanupFns.push(() => {
    gsap.killTweensOf('.particle')
  })
}

function initScrollProgress() {
  if (!containerRef.value) return

  ScrollTrigger.create({
    trigger: containerRef.value,
    start: 'top 100%',
    end: 'bottom -100%',
    onUpdate: (self) => {
      const progress = self.progress

      // 更新进度文字
      if (progressTextRef.value) {
        const percent = Math.round(progress * 100)
        progressTextRef.value.textContent = percent < 100 ? `${percent}%` : 'DONE'
      }

      // 更新进度条
      if (progressFillRef.value) {
        gsap.to(progressFillRef.value, { scaleX: progress, duration: 0.1 })
      }
    }
  })
}

function initBubbleAnimation() {
  gsap.to('.bubble', {
    y: -80,
    x: 'random(-20, 20)',
    scale: 1.5,
    opacity: 0,
    duration: 'random(1.5, 2.5)',
    repeat: -1,
    stagger: {
      each: 0.8,
      from: 'random'
    },
    ease: 'power2.out'
  })

  cleanupFns.push(() => {
    gsap.killTweensOf('.bubble')
  })
}

function initShapeAnimation() {
  const shapes = gsap.to('.shape', {
    y: 'random(-15, 15)',
    rotation: 'random(-20, 20)',
    duration: 'random(2, 3)',
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    stagger: 0.3
  })

  cleanupFns.push(() => shapes.kill())
}

onMounted(() => {
  initAnimations()
  initParticleAnimation()
  initScrollProgress()
  initBubbleAnimation()
  initShapeAnimation()
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style scoped lang="scss">
.curtain-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  overflow: hidden;
}

// 背景装饰
.curtain-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.bg-blur-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;

  &.circle-1 {
    width: 500px;
    height: 500px;
    background: linear-gradient(135deg, #ff6b9d 0%, #c44569 100%);
    top: -150px;
    right: -100px;
    animation: floatSlow 15s ease-in-out infinite;
  }

  &.circle-2 {
    width: 400px;
    height: 400px;
    background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%);
    bottom: -100px;
    left: -80px;
    animation: floatSlow 12s ease-in-out infinite reverse;
  }

  &.circle-3 {
    width: 300px;
    height: 300px;
    background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: pulseSoft 8s ease-in-out infinite;
  }
}

@keyframes floatSlow {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(30px, -30px); }
}

@keyframes pulseSoft {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
  50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.5; }
}

// 粒子
.particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 30;
}

.particle {
  position: absolute;
  border-radius: 50%;
  animation: particleFloat 3s ease-in-out infinite;
}

@keyframes particleFloat {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.4;
  }
  50% {
    transform: translate(10px, -20px) scale(1.2);
    opacity: 0.8;
  }
}

// 主体内容
.main-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 65%;
  max-width: 900px;
  aspect-ratio: 16/10;
  perspective: 1500px;
}

// 图片层
.image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
  box-shadow:
    0 30px 100px rgba(0, 0, 0, 0.6),
    0 0 60px rgba(108, 92, 231, 0.2);
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform-origin: center;
}

.image-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.3) 100%);
  pointer-events: none;
}

.image-shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    110deg,
    transparent 20%,
    rgba(255, 255, 255, 0.05) 40%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0.05) 60%,
    transparent 80%
  );
  animation: shimmer 4s ease-in-out infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

// 遮罩
.curtain {
  position: absolute;
  top: 0;
  width: 50%;
  height: 100%;
  transform-origin: left center;
  z-index: 10;
  overflow: hidden;
}

.curtain-left {
  left: 0;
  transform-origin: left center;
}

.curtain-right {
  right: 0;
  transform-origin: right center;
}

.curtain-surface {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.curtain-image {
  position: absolute;
  width: 200%;
  height: 100%;
  object-fit: cover;
  opacity: 0.7;
  filter: saturate(0.8) brightness(0.9);

  .curtain-left & {
    left: 0;
  }

  .curtain-right & {
    left: -100%;
  }
}

.curtain-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(255, 107, 157, 0.15) 0%,
    rgba(108, 92, 231, 0.1) 50%,
    rgba(116, 185, 255, 0.15) 100%
  );

  .curtain-right & {
    background: linear-gradient(
      -90deg,
      rgba(116, 185, 255, 0.15) 0%,
      rgba(108, 92, 231, 0.1) 50%,
      rgba(255, 107, 157, 0.15) 100%
    );
  }
}

.curtain-glow {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0.6;
  mix-blend-mode: overlay;

  &.glow-left {
    background: linear-gradient(90deg, rgba(255,255,255,0.3) 0%, transparent 50%);
    animation: glowPulse 2s ease-in-out infinite;
  }

  &.glow-right {
    background: linear-gradient(-90deg, rgba(255,255,255,0.3) 0%, transparent 50%);
    animation: glowPulse 2s ease-in-out infinite 0.5s;
  }
}

@keyframes glowPulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
}

.curtain-bubbles {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.bubble {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), rgba(255,255,255,0.2));
  box-shadow: 0 0 20px rgba(255,255,255,0.3);

  &.b1 { width: 40px; height: 40px; left: 30%; top: 70%; }
  &.b2 { width: 25px; height: 25px; left: 50%; top: 80%; }
  &.b3 { width: 15px; height: 15px; left: 70%; top: 60%; }
  &.b4 { width: 30px; height: 30px; left: 20%; top: 75%; }
  &.b5 { width: 20px; height: 20px; left: 40%; top: 85%; }
  &.b6 { width: 35px; height: 35px; left: 60%; top: 65%; }
}

// 中央光芒
.center-seam {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 100%;
  z-index: 15;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.seam-glow {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(255, 255, 255, 0.6) 20%,
    rgba(255, 255, 255, 1) 50%,
    rgba(255, 255, 255, 0.6) 80%,
    transparent 100%
  );
  box-shadow:
    0 0 30px rgba(255, 255, 255, 0.5),
    0 0 60px rgba(108, 92, 231, 0.5);
}

.seam-particles {
  position: absolute;
  width: 100%;
  height: 100%;
}

.spark {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 0 10px #fff;

  &.s1 { top: 20%; left: 50%; transform: translateX(-50%); animation: sparkMove 1.5s ease-in-out infinite; }
  &.s2 { top: 50%; left: 50%; transform: translateX(-50%); animation: sparkMove 1.5s ease-in-out infinite 0.3s; }
  &.s3 { top: 80%; left: 50%; transform: translateX(-50%); animation: sparkMove 1.5s ease-in-out infinite 0.6s; }
}

@keyframes sparkMove {
  0%, 100% { opacity: 1; transform: translateX(-50%) scale(1); }
  50% { opacity: 0.5; transform: translateX(-50%) scale(0.5); }
}

// 顶部装饰
.top-decor {
  position: absolute;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 20px;
  z-index: 25;
}

.deco-line {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);

  &.line-1 { width: 100px; }
  &.line-2 { width: 60px; }
}

.deco-dots {
  display: flex;
  gap: 8px;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6b9d, #6c5ce7);
  animation: dotPulse 1.5s ease-in-out infinite;

  &:nth-child(2) { animation-delay: 0.2s; }
  &:nth-child(3) { animation-delay: 0.4s; }
  &:nth-child(4) { animation-delay: 0.6s; }
  &:nth-child(5) { animation-delay: 0.8s; }
}

@keyframes dotPulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.3); opacity: 0.7; }
}

// 信息面板
.info-panel {
  position: absolute;
  left: 5%;
  top: 50%;
  transform: translateY(-50%);
  padding: 28px 32px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  z-index: 25;
  max-width: 280px;
}

.panel-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: linear-gradient(135deg, #ff6b9d 0%, #c44569 100%);
  border-radius: 20px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
  color: #fff;
  margin-bottom: 16px;
}

.tag-icon {
  width: 12px;
  height: 12px;
}

.panel-title {
  font-size: 28px;
  font-weight: 800;
  color: #fff;
  margin: 0 0 8px;
  background: linear-gradient(135deg, #fff 0%, #a29bfe 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.panel-subtitle {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 20px;
  font-weight: 500;
}

.panel-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: none;
  border-radius: 25px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  svg {
    width: 16px;
    height: 16px;
  }

  &.primary {
    background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%);
    color: #fff;
    box-shadow: 0 4px 15px rgba(108, 92, 231, 0.4);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(108, 92, 231, 0.5);
    }
  }

  &.secondary {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    padding: 10px;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: scale(1.05);
    }
  }
}

// 右下角装饰
.bottom-decor {
  position: absolute;
  right: 5%;
  bottom: 10%;
  z-index: 25;
}

.float-shapes {
  display: flex;
  gap: 15px;
}

.shape {
  opacity: 0.4;

  &.circle {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: linear-gradient(135deg, #ff6b9d, #c44569);
  }

  &.square {
    width: 18px;
    height: 18px;
    border-radius: 4px;
    background: linear-gradient(135deg, #6c5ce7, #a29bfe);
    transform: rotate(15deg);
  }

  &.triangle {
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 18px solid #74b9ff;
  }
}

// 进度指示
.progress-indicator {
  position: absolute;
  right: 5%;
  bottom: 6%;
  z-index: 25;
}

.progress-track {
  position: relative;
  width: 180px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: visible;
}

.progress-fill {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #ff6b9d, #6c5ce7, #74b9ff);
  border-radius: 2px;
  transform-origin: left;
  transform: scaleX(0);
}

.progress-glow {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translate(50%, -50%);
  width: 8px;
  height: 8px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 0 15px rgba(108, 92, 231, 0.8);
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
}

.progress-text {
  font-size: 10px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 2px;
}

.progress-percent {
  font-size: 10px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.8);
  font-variant-numeric: tabular-nums;
}

// 角落装饰
.corner-decor {
  position: absolute;
  width: 60px;
  height: 60px;
  z-index: 20;

  &.top-left { top: 30px; left: 30px; }
  &.top-right { top: 30px; right: 30px; }
  &.bottom-left { bottom: 30px; left: 30px; }
  &.bottom-right { bottom: 30px; right: 30px; }
}

.corner-line {
  position: absolute;
  background: linear-gradient(90deg, rgba(255,255,255,0.4), transparent);

  &.h {
    width: 100%;
    height: 1px;
    top: 0;

    .top-left &, .bottom-left & { transform-origin: left; }
    .top-right &, .bottom-right & { transform-origin: right; }
  }

  &.v {
    width: 1px;
    height: 100%;
    left: 0;

    .top-left &, .top-right & { transform-origin: top; }
    .bottom-left &, .bottom-right & { transform-origin: bottom; }
  }
}

.top-left .corner-line.h,
.bottom-left .corner-line.h { transform: scaleX(0); }
.top-right .corner-line.h,
.bottom-right .corner-line.h { transform: scaleX(0); }
.top-left .corner-line.v,
.top-right .corner-line.v { transform: scaleY(0); }
.bottom-left .corner-line.v,
.bottom-right .corner-line.v { transform: scaleY(0); }
</style>
