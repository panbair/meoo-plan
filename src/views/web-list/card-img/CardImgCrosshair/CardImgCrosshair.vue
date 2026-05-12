<template>
  <div ref="containerRef" class="crosshair-container">
    <!-- 背景装饰 -->
    <div class="crosshair-bg">
      <div class="bg-glow glow-1" />
      <div class="bg-glow glow-2" />
      <div class="bg-glow glow-3" />
    </div>

    <!-- 装饰粒子 -->
    <div class="particles">
      <div v-for="i in 15" :key="i" class="particle" :style="getParticleStyle(i)" />
    </div>

    <!-- 主体内容 -->
    <div ref="mainContentRef" class="main-content">
      <!-- 图片层 -->
      <div class="image-wrapper">
        <img
          ref="mainImageRef"
          class="main-image"
          src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80"
          alt="Nature Landscape"
        />
        <div class="image-overlay" />
      </div>

      <!-- 左上遮罩 -->
      <div ref="panelTLRef" class="panel panel-tl">
        <div class="panel-surface">
          <img
            class="panel-image"
            src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80"
            alt=""
          />
          <div class="panel-overlay" />
          <div class="panel-glow" />
          <div class="panel-shine" />
        </div>
        <div class="glow-edge edge-right" />
        <div class="glow-edge edge-bottom" />
      </div>

      <!-- 右上遮罩 -->
      <div ref="panelTRRef" class="panel panel-tr">
        <div class="panel-surface">
          <img
            class="panel-image"
            src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80"
            alt=""
          />
          <div class="panel-overlay" />
          <div class="panel-glow" />
          <div class="panel-shine" />
        </div>
        <div class="glow-edge edge-left" />
        <div class="glow-edge edge-bottom" />
      </div>

      <!-- 左下遮罩 -->
      <div ref="panelBLRef" class="panel panel-bl">
        <div class="panel-surface">
          <img
            class="panel-image"
            src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80"
            alt=""
          />
          <div class="panel-overlay" />
          <div class="panel-glow" />
          <div class="panel-shine" />
        </div>
        <div class="glow-edge edge-right" />
        <div class="glow-edge edge-top" />
      </div>

      <!-- 右下遮罩 -->
      <div ref="panelBRRef" class="panel panel-br">
        <div class="panel-surface">
          <img
            class="panel-image"
            src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80"
            alt=""
          />
          <div class="panel-overlay" />
          <div class="panel-glow" />
          <div class="panel-shine" />
        </div>
        <div class="glow-edge edge-left" />
        <div class="glow-edge edge-top" />
      </div>

      <!-- 十字分割线 -->
      <div ref="crossLineHRef" class="cross-line cross-h">
        <div class="line-glow" />
      </div>
      <div ref="crossLineVRef" class="cross-line cross-v">
        <div class="line-glow" />
      </div>

      <!-- 暗角层 -->
      <div ref="vignetteRef" class="vignette-overlay" />

      <!-- 中心菱形光标 -->
      <div ref="diamondRef" class="diamond-marker">
        <div class="diamond-inner" />
        <div class="diamond-ring" />
        <div class="diamond-glow" />
      </div>
    </div>

    <!-- 顶部装饰 -->
    <div class="top-badge">
      <div class="badge-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
          <line x1="12" y1="22" x2="12" y2="15.5" />
          <polyline points="22 8.5 12 15.5 2 8.5" />
        </svg>
      </div>
      <span class="badge-text">PREMIUM</span>
    </div>

    <!-- 信息面板 -->
    <div ref="infoPanelRef" class="info-panel">
      <div class="panel-tag">EXCLUSIVE</div>
      <h2 ref="titleRef" class="panel-title">Nature's Beauty</h2>
      <p ref="subtitleRef" class="panel-subtitle">Discover the Wonders</p>
      <div class="panel-stats">
        <div class="stat">
          <span class="stat-value">4K</span>
          <span class="stat-label">Ultra HD</span>
        </div>
        <div class="stat">
          <span class="stat-value">360°</span>
          <span class="stat-label">Panorama</span>
        </div>
      </div>
    </div>

    <!-- 底部进度 -->
    <div ref="progressRef" class="progress-section">
      <div class="progress-bar">
        <div ref="progressFillRef" class="progress-fill" />
      </div>
      <div class="progress-dots">
        <span v-for="i in 4" :key="i" class="prog-dot" />
      </div>
    </div>

    <!-- 角落装饰 -->
    <div class="corner-accent top-left">
      <svg viewBox="0 0 40 40" fill="none">
        <path d="M0 40V0H40" stroke="currentColor" stroke-width="1" />
      </svg>
    </div>
    <div class="corner-accent top-right">
      <svg viewBox="0 0 40 40" fill="none">
        <path d="M40 40V0H0" stroke="currentColor" stroke-width="1" />
      </svg>
    </div>
    <div class="corner-accent bottom-left">
      <svg viewBox="0 0 40 40" fill="none">
        <path d="M0 0V40H40" stroke="currentColor" stroke-width="1" />
      </svg>
    </div>
    <div class="corner-accent bottom-right">
      <svg viewBox="0 0 40 40" fill="none">
        <path d="M40 0V40H0" stroke="currentColor" stroke-width="1" />
      </svg>
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
const mainImageRef = ref<HTMLElement | null>(null)
const panelTLRef = ref<HTMLElement | null>(null)
const panelTRRef = ref<HTMLElement | null>(null)
const panelBLRef = ref<HTMLElement | null>(null)
const panelBRRef = ref<HTMLElement | null>(null)
const crossLineHRef = ref<HTMLElement | null>(null)
const crossLineVRef = ref<HTMLElement | null>(null)
const vignetteRef = ref<HTMLElement | null>(null)
const diamondRef = ref<HTMLElement | null>(null)
const infoPanelRef = ref<HTMLElement | null>(null)
const progressRef = ref<HTMLElement | null>(null)
const progressFillRef = ref<HTMLElement | null>(null)

const getParticleStyle = (i: number) => {
  const colors = ['#ff6b9d', '#c44569', '#6c5ce7', '#a29bfe', '#fd79a8', '#74b9ff', '#ffeaa7', '#fab1a0']
  const size = 3 + (i % 5) * 2
  const x = 5 + ((i * 53) % 90)
  const y = 5 + ((i * 37) % 90)
  const delay = (i * 0.4) % 4
  const duration = 2.5 + (i % 2)
  const color = colors[i % colors.length]

  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${x}%`,
    top: `${y}%`,
    background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  }
}

function initAnimations() {
  if (!containerRef.value) return

  // 初始状态
  gsap.set([panelTLRef.value, panelTRRef.value, panelBLRef.value, panelBRRef.value], {
    scale: 1,
    opacity: 0.75
  })
  gsap.set(panelTLRef.value, { transformOrigin: 'right bottom' })
  gsap.set(panelTRRef.value, { transformOrigin: 'left bottom' })
  gsap.set(panelBLRef.value, { transformOrigin: 'right top' })
  gsap.set(panelBRRef.value, { transformOrigin: 'left top' })

  gsap.set([crossLineHRef.value, crossLineVRef.value], { opacity: 0.6, scale: 0.5 })
  gsap.set(crossLineHRef.value, { transformOrigin: 'center' })
  gsap.set(crossLineVRef.value, { transformOrigin: 'center' })

  gsap.set(diamondRef.value, { scale: 1, rotation: 45, opacity: 1 })
  gsap.set(vignetteRef.value, { opacity: 0.5 })
  gsap.set(mainImageRef.value, { filter: 'brightness(0.8)', scale: 1.05 })
  gsap.set(infoPanelRef.value, { opacity: 0, y: 30, scale: 0.9 })
  gsap.set(progressRef.value, { opacity: 0, y: 20 })
  gsap.set('.particle', { opacity: 0, scale: 0 })
  gsap.set('.corner-accent', { opacity: 0, scale: 0 })

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
    stagger: { each: 0.04, from: 'random' },
    duration: 0.08
  }, 0)

  // 角落装饰
  tl.to('.corner-accent', {
    opacity: 1,
    scale: 1,
    stagger: 0.02,
    duration: 0.08,
    ease: 'back.out(2)'
  }, 0.02)

  // 十字线预热
  tl.to([crossLineHRef.value, crossLineVRef.value], {
    opacity: 0.8,
    scale: 1,
    duration: 0.08
  }, 0.05)

  // 遮罩微震
  tl.to('.panel', {
    scale: 1.02,
    duration: 0.04,
    ease: 'power2.inOut'
  }, 0.06)

  tl.to('.panel', {
    scale: 1,
    duration: 0.04,
    ease: 'elastic.out(1, 0.5)'
  }, 0.1)

  // 信号阶段 (10-20%)
  // 菱形收缩闪烁
  tl.to(diamondRef.value, {
    scale: 0.3,
    duration: 0.08,
    ease: 'power3.in'
  }, 0.1)

  tl.to(diamondRef.value, {
    scale: 1.5,
    rotation: 225,
    duration: 0.15,
    ease: 'elastic.out(1.2, 0.5)'
  }, 0.18)

  tl.to(diamondRef.value, {
    scale: 0,
    opacity: 0,
    duration: 0.1,
    ease: 'power2.in'
  }, 0.33)

  // 十字线微微扩宽
  tl.to([crossLineHRef.value, crossLineVRef.value], {
    scale: 1.05,
    opacity: 0.9,
    duration: 0.1,
    ease: 'power2.out'
  }, 0.12)

  // 展开阶段 (20-70%)
  // 左上遮罩滑开
  tl.to(panelTLRef.value, {
    x: '-100%',
    y: '-100%',
    opacity: 0,
    duration: 0.5,
    ease: 'power3.inOut'
  }, 0.2)

  // 右上遮罩滑开
  tl.to(panelTRRef.value, {
    x: '100%',
    y: '-100%',
    opacity: 0,
    duration: 0.5,
    ease: 'power3.inOut'
  }, 0.2)

  // 左下遮罩滑开
  tl.to(panelBLRef.value, {
    x: '-100%',
    y: '100%',
    opacity: 0,
    duration: 0.5,
    ease: 'power3.inOut'
  }, 0.2)

  // 右下遮罩滑开
  tl.to(panelBRRef.value, {
    x: '100%',
    y: '100%',
    opacity: 0,
    duration: 0.5,
    ease: 'power3.inOut'
  }, 0.2)

  // 十字线淡出
  tl.to([crossLineHRef.value, crossLineVRef.value], {
    opacity: 0,
    scale: 2,
    duration: 0.3,
    ease: 'power2.in'
  }, 0.25)

  // 图像效果
  tl.to(mainImageRef.value, {
    filter: 'brightness(0.95)',
    scale: 1.02,
    duration: 0.4,
    ease: 'power2.out'
  }, 0.25)

  // 亮相阶段 (70-85%)
  // 图像完全清晰
  tl.to(mainImageRef.value, {
    filter: 'brightness(1)',
    scale: 1,
    duration: 0.2,
    ease: 'back.out(1.5)'
  }, 0.7)

  // 暗角消退
  tl.to(vignetteRef.value, {
    opacity: 0.2,
    duration: 0.2
  }, 0.72)

  // 信息面板入场
  tl.to(infoPanelRef.value, {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 0.2,
    ease: 'back.out(1.8)'
  }, 0.68)

  // 进度指示入场
  tl.to(progressRef.value, {
    opacity: 1,
    y: 0,
    duration: 0.15,
    ease: 'power3.out'
  }, 0.75)

  // 收尾阶段 (85-100%)
  // 暗角加深
  tl.to(vignetteRef.value, {
    opacity: 0.6,
    duration: 0.1
  }, 0.88)

  // 图像暗淡
  tl.to(mainImageRef.value, {
    filter: 'brightness(0.75)',
    scale: 0.98,
    duration: 0.12
  }, 0.88)

  // 遮罩回卷
  tl.to(panelTLRef.value, {
    x: 0,
    y: 0,
    opacity: 0.75,
    duration: 0.15,
    ease: 'power4.inOut'
  }, 0.88)

  tl.to(panelTRRef.value, {
    x: 0,
    y: 0,
    opacity: 0.75,
    duration: 0.15,
    ease: 'power4.inOut'
  }, 0.88)

  tl.to(panelBLRef.value, {
    x: 0,
    y: 0,
    opacity: 0.75,
    duration: 0.15,
    ease: 'power4.inOut'
  }, 0.88)

  tl.to(panelBRRef.value, {
    x: 0,
    y: 0,
    opacity: 0.75,
    duration: 0.15,
    ease: 'power4.inOut'
  }, 0.88)

  // 菱形再现
  tl.to(diamondRef.value, {
    scale: 1,
    opacity: 1,
    duration: 0.15,
    ease: 'back.out(2)'
  }, 0.92)

  // 十字线再现
  tl.to([crossLineHRef.value, crossLineVRef.value], {
    opacity: 0.6,
    scale: 0.5,
    duration: 0.08
  }, 0.94)

  // 信息面板离场
  tl.to(infoPanelRef.value, {
    opacity: 0,
    y: 30,
    scale: 0.9,
    duration: 0.1
  }, 0.92)

  // 进度指示离场
  tl.to(progressRef.value, {
    opacity: 0,
    y: 20,
    duration: 0.08
  }, 0.94)

  // 粒子消失
  tl.to('.particle', {
    opacity: 0,
    scale: 0,
    stagger: { each: 0.03, from: 'random' },
    duration: 0.08
  }, 0.96)

  // 角落装饰消失
  tl.to('.corner-accent', {
    opacity: 0,
    scale: 0,
    duration: 0.06
  }, 0.96)
}

function initParticleAnimation() {
  gsap.to('.particle', {
    y: 'random(-25, 25)',
    x: 'random(-15, 15)',
    rotation: 'random(-90, 90)',
    duration: 'random(2, 4)',
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    stagger: {
      each: 0.15,
      from: 'random'
    }
  })

  cleanupFns.push(() => {
    gsap.killTweensOf('.particle')
  })
}

function initDiamondAnimation() {
  const diamondTl = gsap.timeline({ repeat: -1, repeatDelay: 2 })

  diamondTl.to('.diamond-inner', {
    scale: 0.8,
    opacity: 0.6,
    duration: 0.5,
    ease: 'power2.inOut'
  })
  diamondTl.to('.diamond-inner', {
    scale: 1.2,
    opacity: 1,
    duration: 0.5,
    ease: 'elastic.out(1, 0.5)'
  })
  diamondTl.to('.diamond-ring', {
    scale: 1.5,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out'
  }, '-=0.3')

  cleanupFns.push(() => diamondTl.kill())
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
  initParticleAnimation()
  initDiamondAnimation()
  initProgressAnimation()
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style scoped lang="scss">
.crosshair-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a3e 40%, #2d1b4e 100%);
  overflow: hidden;
}

// 背景装饰
.crosshair-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.bg-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.35;

  &.glow-1 {
    width: 600px;
    height: 600px;
    background: linear-gradient(135deg, #ff6b9d 0%, #c44569 100%);
    top: -200px;
    right: -150px;
    animation: glowFloat 18s ease-in-out infinite;
  }

  &.glow-2 {
    width: 450px;
    height: 450px;
    background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%);
    bottom: -150px;
    left: -100px;
    animation: glowFloat 15s ease-in-out infinite reverse;
  }

  &.glow-3 {
    width: 350px;
    height: 350px;
    background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: glowPulse 10s ease-in-out infinite;
  }
}

@keyframes glowFloat {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(40px, -40px); }
}

@keyframes glowPulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
  50% { transform: translate(-50%, -50%) scale(1.3); opacity: 0.5; }
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
    opacity: 0.5;
  }
  50% {
    transform: translate(8px, -15px) scale(1.1);
    opacity: 0.9;
  }
}

// 主体内容
.main-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60%;
  max-width: 850px;
  aspect-ratio: 16/10;
  perspective: 1500px;
}

// 图片层
.image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  overflow: hidden;
  box-shadow:
    0 40px 120px rgba(0, 0, 0, 0.7),
    0 0 80px rgba(108, 92, 231, 0.25);
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform-origin: center;
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.2) 100%);
  pointer-events: none;
}

// 四象限遮罩
.panel {
  position: absolute;
  width: 50%;
  height: 50%;
  z-index: 10;
  overflow: hidden;

  &.panel-tl {
    top: 0;
    left: 0;
  }

  &.panel-tr {
    top: 0;
    right: 0;
  }

  &.panel-bl {
    bottom: 0;
    left: 0;
  }

  &.panel-br {
    bottom: 0;
    right: 0;
  }
}

.panel-surface {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.panel-image {
  position: absolute;
  width: 200%;
  height: 200%;
  object-fit: cover;
  opacity: 0.65;
  filter: saturate(0.7) brightness(0.85);

  .panel-tl & {
    left: 0;
    top: 0;
  }

  .panel-tr & {
    left: -100%;
    top: 0;
  }

  .panel-bl & {
    left: 0;
    top: -100%;
  }

  .panel-br & {
    left: -100%;
    top: -100%;
  }
}

.panel-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 107, 157, 0.1) 0%,
    rgba(108, 92, 231, 0.08) 50%,
    rgba(116, 185, 255, 0.1) 100%
  );
}

.panel-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.25) 0%, transparent 60%);
  animation: panelGlow 3s ease-in-out infinite;
}

@keyframes panelGlow {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.7; }
}

.panel-shine {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    125deg,
    transparent 20%,
    rgba(255, 255, 255, 0.15) 40%,
    rgba(255, 255, 255, 0.25) 50%,
    rgba(255, 255, 255, 0.15) 60%,
    transparent 80%
  );
  animation: panelShine 5s ease-in-out infinite;
}

@keyframes panelShine {
  0% { transform: translateX(-150%); }
  100% { transform: translateX(150%); }
}

// 暖金边缘光泽
.glow-edge {
  position: absolute;
  background: linear-gradient(
    90deg,
    rgba(255, 215, 0, 0.4),
    rgba(255, 200, 100, 0.2),
    transparent
  );

  &.edge-right {
    right: 0;
    top: 0;
    width: 3px;
    height: 100%;
  }

  &.edge-left {
    left: 0;
    top: 0;
    width: 3px;
    height: 100%;
    transform: scaleX(-1);
  }

  &.edge-bottom {
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(
      0deg,
      rgba(255, 215, 0, 0.6),
      rgba(255, 200, 100, 0.3),
      transparent
    );
  }

  &.edge-top {
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    transform: scaleY(-1);
  }
}

// 十字分割线
.cross-line {
  position: absolute;
  z-index: 15;
  pointer-events: none;

  &.cross-h {
    top: 50%;
    left: -10%;
    right: -10%;
    height: 2px;
    transform: translateY(-50%);
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
  }

  &.cross-v {
    left: 50%;
    top: -10%;
    bottom: -10%;
    width: 2px;
    transform: translateX(-50%);
    background: linear-gradient(180deg, transparent, rgba(255,255,255,0.5), transparent);
  }
}

.line-glow {
  position: absolute;
  inset: -5px;
  background: inherit;
  filter: blur(8px);
  opacity: 0.8;
}

// 暗角层
.vignette-overlay {
  position: absolute;
  inset: 0;
  z-index: 5;
  background: radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.4) 100%);
  pointer-events: none;
}

// 中心菱形光标
.diamond-marker {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
}

.diamond-inner {
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #fff 0%, #ffd700 100%);
  transform: rotate(45deg);
  box-shadow:
    0 0 20px rgba(255, 215, 0, 0.8),
    0 0 40px rgba(255, 215, 0, 0.4);
}

.diamond-ring {
  position: absolute;
  width: 40px;
  height: 40px;
  border: 2px solid rgba(255, 215, 0, 0.6);
  border-radius: 50%;
  transform: rotate(45deg);
}

.diamond-glow {
  position: absolute;
  width: 60px;
  height: 60px;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 70%);
  animation: diamondGlow 2s ease-in-out infinite;
}

@keyframes diamondGlow {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.2); opacity: 0.8; }
}

// 顶部徽章
.top-badge {
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 24px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 30px;
  z-index: 25;
}

.badge-icon {
  width: 20px;
  height: 20px;
  color: #ffd700;

  svg {
    width: 100%;
    height: 100%;
  }
}

.badge-text {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 3px;
  background: linear-gradient(90deg, #ffd700, #fff, #ffd700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

// 信息面板
.info-panel {
  position: absolute;
  left: 6%;
  top: 50%;
  transform: translateY(-50%);
  padding: 28px 32px;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  z-index: 25;
  max-width: 260px;
}

.panel-tag {
  display: inline-block;
  padding: 6px 14px;
  background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%);
  border-radius: 20px;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 2px;
  color: #fff;
  margin-bottom: 14px;
}

.panel-title {
  font-size: 26px;
  font-weight: 800;
  color: #fff;
  margin: 0 0 6px;
  background: linear-gradient(135deg, #fff 0%, #a29bfe 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.panel-subtitle {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0 0 18px;
}

.panel-stats {
  display: flex;
  gap: 20px;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-value {
  font-size: 18px;
  font-weight: 800;
  background: linear-gradient(135deg, #ffd700, #ff6b9d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 9px;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 1px;
  text-transform: uppercase;
}

// 底部进度
.progress-section {
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  z-index: 25;
}

.progress-bar {
  width: 200px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #ff6b9d, #6c5ce7, #74b9ff);
  border-radius: 2px;
  transform-origin: left;
  transform: scaleX(0);
}

.progress-dots {
  display: flex;
  gap: 8px;
}

.prog-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;

  &:nth-child(1) { background: #ff6b9d; }
  &:nth-child(2) { background: #6c5ce7; }
  &:nth-child(3) { background: #74b9ff; }
  &:nth-child(4) { background: #ffd700; }
}

// 角落装饰
.corner-accent {
  position: absolute;
  width: 40px;
  height: 40px;
  color: rgba(255, 255, 255, 0.3);
  z-index: 25;
  transition: color 0.3s ease;

  &:hover {
    color: rgba(255, 255, 255, 0.6);
  }

  &.top-left { top: 30px; left: 30px; }
  &.top-right { top: 30px; right: 30px; }
  &.bottom-left { bottom: 30px; left: 30px; }
  &.bottom-right { bottom: 30px; right: 30px; }
}
</style>
