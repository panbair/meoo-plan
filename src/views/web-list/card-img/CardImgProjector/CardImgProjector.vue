<template>
  <div ref="containerRef" class="projector-container">
    <!-- 深色背景 -->
    <div ref="bgRef" class="projector-bg">
      <div class="bg-grid" />
      <div class="bg-radial" />
    </div>

    <!-- 投影仪装置 -->
    <div ref="projectorRef" class="projector-device">
      <div class="device-body">
        <div class="device-lens" />
        <div class="device-ring" />
        <div class="device-glow" />
      </div>
      <!-- 投影光束 -->
      <div ref="lightBeamRef" class="light-beam">
        <div class="beam-cone" />
        <div class="beam-edge left" />
        <div class="beam-edge right" />
      </div>
    </div>

    <!-- 微尘粒子层 -->
    <div ref="dustLayerRef" class="dust-layer">
      <div
        v-for="i in 40"
        :key="i"
        class="dust-particle"
        :class="`dust-${i}`"
        :style="getDustStyle(i)"
      />
    </div>

    <!-- 投影幕布 -->
    <div ref="screenRef" class="screen-frame">
      <div ref="screenInnerRef" class="screen-inner">
        <!-- 投影内容层 -->
        <div ref="contentLayerRef" class="content-layer">
          <!-- 青色层 -->
          <div ref="cyanLayerRef" class="color-layer cyan-layer">
            <img
              class="color-image"
              src="https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1920&q=80"
              alt=""
            />
          </div>

          <!-- 蓝色层 -->
          <div ref="blueLayerRef" class="color-layer blue-layer">
            <img
              class="color-image"
              src="https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1920&q=80"
              alt=""
            />
          </div>

          <!-- 红色层 -->
          <div ref="redLayerRef" class="color-layer red-layer">
            <img
              class="color-image"
              src="https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1920&q=80"
              alt=""
            />
          </div>

          <!-- 主图层 -->
          <div ref="mainImageLayerRef" class="main-image-layer">
            <img
              ref="mainImageRef"
              class="main-image"
              src="https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1920&q=80"
              alt="Cinematic Scene"
            />
          </div>

          <!-- 色散光斑 -->
          <div ref="aberrationGlowRef" class="aberration-glow">
            <div class="glow-red" />
            <div class="glow-blue" />
            <div class="glow-cyan" />
          </div>
        </div>

        <!-- 模糊叠加 -->
        <div ref="blurOverlayRef" class="blur-overlay" />
      </div>

      <!-- 幕布边框 -->
      <div class="screen-border top" />
      <div class="screen-border bottom" />
      <div class="screen-border left" />
      <div class="screen-border right" />

      <!-- 最终暗角 -->
      <div class="screen-vignette" />
    </div>

    <!-- 镜头反光 -->
    <div ref="lensFlareRef" class="lens-flare">
      <div class="flare-streak" />
      <div class="flare-dot" />
    </div>

    <!-- 闪烁效果 -->
    <div ref="flickerRef" class="flicker-overlay" />

    <!-- 信息面板 -->
    <div ref="infoPanelRef" class="info-panel">
      <div class="panel-tag">PROJECTOR MODE</div>
      <h2 ref="titleRef" class="panel-title">Chromatic Focus</h2>
      <p ref="subtitleRef" class="panel-subtitle">Digital Keystone Correction</p>
      <div ref="statusRef" class="panel-status">
        <div class="status-item">
          <span class="status-indicator" ref="focusIndicatorRef" />
          <span class="status-text" ref="focusTextRef">CALIBRATING</span>
        </div>
      </div>
    </div>

    <!-- 进度条 -->
    <div ref="progressRef" class="progress-bar">
      <div class="progress-fill" />
      <span ref="progressTextRef" class="progress-text">FOCUSING</span>
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
const bgRef = ref<HTMLElement | null>(null)
const projectorRef = ref<HTMLElement | null>(null)
const lightBeamRef = ref<HTMLElement | null>(null)
const dustLayerRef = ref<HTMLElement | null>(null)
const screenRef = ref<HTMLElement | null>(null)
const screenInnerRef = ref<HTMLElement | null>(null)
const contentLayerRef = ref<HTMLElement | null>(null)
const cyanLayerRef = ref<HTMLElement | null>(null)
const blueLayerRef = ref<HTMLElement | null>(null)
const redLayerRef = ref<HTMLElement | null>(null)
const mainImageLayerRef = ref<HTMLElement | null>(null)
const mainImageRef = ref<HTMLElement | null>(null)
const aberrationGlowRef = ref<HTMLElement | null>(null)
const blurOverlayRef = ref<HTMLElement | null>(null)
const lensFlareRef = ref<HTMLElement | null>(null)
const flickerRef = ref<HTMLElement | null>(null)
const infoPanelRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const statusRef = ref<HTMLElement | null>(null)
const focusIndicatorRef = ref<HTMLElement | null>(null)
const focusTextRef = ref<HTMLElement | null>(null)
const progressRef = ref<HTMLElement | null>(null)
const progressTextRef = ref<HTMLElement | null>(null)

function getDustStyle(index: number) {
  const size = Math.random() * 3 + 1
  const x = 30 + Math.random() * 40
  const y = 20 + Math.random() * 60
  const duration = 8 + Math.random() * 6
  const delay = Math.random() * 5
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${x}%`,
    top: `${y}%`,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`
  }
}

function initAnimations() {
  if (!containerRef.value) return

  // 初始状态设置
  gsap.set(mainImageRef.value, { scale: 1.5, filter: 'blur(12px)' })
  gsap.set(redLayerRef.value, { x: 15, opacity: 0.5 })
  gsap.set(blueLayerRef.value, { x: -12, opacity: 0.5 })
  gsap.set(cyanLayerRef.value, { y: 8, opacity: 0.3 })
  gsap.set(aberrationGlowRef.value, { opacity: 1 })
  gsap.set(blurOverlayRef.value, { opacity: 0.6 })
  gsap.set(screenInnerRef.value, { opacity: 0, scale: 0.8 })
  gsap.set(lightBeamRef.value, { opacity: 0 })
  gsap.set(lensFlareRef.value, { opacity: 0 })
  gsap.set(flickerRef.value, { opacity: 0 })
  gsap.set(projectorRef.value, { opacity: 0, scale: 0.9 })

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: containerRef.value,
      start: 'top 100%',
      end: 'bottom -100%',
      scrub: 1.5
    }
  })

  cleanupFns.push(() => tl.kill())

  // 投影仪出现
  tl.to(projectorRef.value, {
    opacity: 1,
    scale: 1,
    duration: 0.15
  }, 0)

  // 光束出现
  tl.to(lightBeamRef.value, {
    opacity: 1,
    duration: 0.2
  }, 0.05)

  // 幕布显现
  tl.to(screenInnerRef.value, {
    opacity: 1,
    scale: 1,
    duration: 0.2
  }, 0.08)

  // 对焦阶段 (0-30%) - 投射模糊
  // 闪烁效果
  tl.to(flickerRef.value, {
    opacity: 0.3,
    duration: 0.05,
    repeat: 3,
    yoyo: true
  }, 0.1)

  // 对焦阶段 (30-70%) - 核心对焦
  // 图片缩放
  tl.to(mainImageRef.value, {
    scale: 1.15,
    filter: 'blur(6px)',
    duration: 0.25,
    ease: 'power2.inOut'
  }, 0.3)

  // 色差层收拢
  tl.to(redLayerRef.value, {
    x: 8,
    opacity: 0.4,
    duration: 0.25
  }, 0.32)

  tl.to(blueLayerRef.value, {
    x: -6,
    opacity: 0.4,
    duration: 0.25
  }, 0.32)

  tl.to(cyanLayerRef.value, {
    y: 4,
    opacity: 0.25,
    duration: 0.25
  }, 0.32)

  // 模糊减弱
  tl.to(blurOverlayRef.value, {
    opacity: 0.2,
    duration: 0.2
  }, 0.4)

  // 第二阶段对焦
  tl.to(mainImageRef.value, {
    scale: 1.05,
    filter: 'blur(2px)',
    duration: 0.2,
    ease: 'power2.inOut'
  }, 0.55)

  // 色差进一步收拢
  tl.to(redLayerRef.value, {
    x: 3,
    opacity: 0.2,
    duration: 0.2
  }, 0.58)

  tl.to(blueLayerRef.value, {
    x: -2,
    opacity: 0.2,
    duration: 0.2
  }, 0.58)

  tl.to(cyanLayerRef.value, {
    y: 1,
    opacity: 0.1,
    duration: 0.2
  }, 0.58)

  // 完全对焦
  tl.to(mainImageRef.value, {
    scale: 1,
    filter: 'blur(0px)',
    duration: 0.15,
    ease: 'power2.out'
  }, 0.72)

  // 色差完全消失
  tl.to(redLayerRef.value, {
    x: 0,
    opacity: 0,
    duration: 0.1
  }, 0.75)

  tl.to(blueLayerRef.value, {
    x: 0,
    opacity: 0,
    duration: 0.1
  }, 0.76)

  tl.to(cyanLayerRef.value, {
    y: 0,
    opacity: 0,
    duration: 0.1
  }, 0.77)

  // 色散光斑消失
  tl.to(aberrationGlowRef.value, {
    opacity: 0,
    duration: 0.1
  }, 0.78)

  // 模糊叠加消失
  tl.to(blurOverlayRef.value, {
    opacity: 0,
    duration: 0.1
  }, 0.8)

  // 稳定阶段 (70-85%) - 光束闪烁 + 微尘
  tl.to(flickerRef.value, {
    opacity: 0.1,
    duration: 0.08,
    repeat: 5,
    yoyo: true
  }, 0.7)

  // 镜头反光
  tl.to(lensFlareRef.value, {
    opacity: 1,
    duration: 0.05
  }, 0.75)

  tl.fromTo('.flare-streak',
    { scaleX: 0, x: -50 },
    { scaleX: 1, x: 0, duration: 0.15, ease: 'power2.out' },
    0.75
  )

  tl.to(lensFlareRef.value, {
    opacity: 0,
    duration: 0.2
  }, 0.88)

  // 信息面板入场
  tl.fromTo(infoPanelRef.value,
    { opacity: 0, x: -80 },
    { opacity: 1, x: 0, duration: 0.12 },
    0.65
  )

  // 进度条入场
  tl.fromTo(progressRef.value,
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.1 },
    0.7
  )

  // 收尾阶段 (85-100%) - 投影关闭
  // 光束减弱
  tl.to(lightBeamRef.value, {
    opacity: 0.3,
    duration: 0.1
  }, 0.85)

  // 图片暗淡
  tl.to(mainImageLayerRef.value, {
    opacity: 0.5,
    filter: 'brightness(0.7)',
    duration: 0.1
  }, 0.88)

  // 幕布消失
  tl.to(screenInnerRef.value, {
    opacity: 0,
    scale: 0.95,
    duration: 0.1
  }, 0.92)

  // 光束消失
  tl.to(lightBeamRef.value, {
    opacity: 0,
    duration: 0.08
  }, 0.94)

  // 投影仪消失
  tl.to(projectorRef.value, {
    opacity: 0,
    scale: 0.8,
    duration: 0.08
  }, 0.96)
}

function initDustParticles() {
  if (!dustLayerRef.value) return

  const particles = dustLayerRef.value.querySelectorAll('.dust-particle')

  particles.forEach((particle, i) => {
    const tl = gsap.timeline({ repeat: -1 })

    tl.to(particle, {
      y: -100 - Math.random() * 50,
      x: `+=${Math.random() * 40 - 20}`,
      opacity: 0.3,
      duration: 6 + Math.random() * 4,
      ease: 'none'
    })

    tl.to(particle, {
      y: 0,
      x: `+=${Math.random() * 30 - 15}`,
      opacity: 0.8,
      duration: 2 + Math.random() * 2,
      ease: 'power2.in'
    })

    cleanupFns.push(() => tl.kill())
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
        if (progress < 0.3) {
          progressTextRef.value.textContent = 'CALIBRATING'
        } else if (progress < 0.7) {
          progressTextRef.value.textContent = 'FOCUSING'
        } else if (progress < 0.9) {
          progressTextRef.value.textContent = 'LOCKED'
        } else {
          progressTextRef.value.textContent = 'SHUTDOWN'
        }
      }

      // 更新焦点指示器
      if (focusIndicatorRef.value) {
        if (progress > 0.7 && progress < 0.9) {
          focusIndicatorRef.value.classList.add('active')
        } else {
          focusIndicatorRef.value.classList.remove('active')
        }
      }

      if (focusTextRef.value) {
        if (progress < 0.3) {
          focusTextRef.value.textContent = 'CALIBRATING'
        } else if (progress < 0.7) {
          focusTextRef.value.textContent = 'FOCUSING'
        } else if (progress < 0.9) {
          focusTextRef.value.textContent = 'LOCKED'
        } else {
          focusTextRef.value.textContent = 'SHUTDOWN'
        }
      }
    }
  })
}

function initProjectorLens() {
  if (!projectorRef.value) return

  // 镜头轻微旋转
  gsap.to('.device-lens', {
    rotation: 360,
    duration: 20,
    repeat: -1,
    ease: 'none'
  })

  cleanupFns.push(() => {
    gsap.killTweensOf('.device-lens')
  })

  // 镜头环脉冲
  gsap.to('.device-ring', {
    boxShadow: '0 0 30px rgba(100, 200, 255, 0.6)',
    duration: 1.5,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  })

  cleanupFns.push(() => {
    gsap.killTweensOf('.device-ring')
  })
}

onMounted(() => {
  initAnimations()
  initDustParticles()
  initScrollProgress()
  initProjectorLens()
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style scoped lang="scss">
.projector-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(180deg, #0a0a0a 0%, #12121a 50%, #0a0a0a 100%);
  overflow: hidden;
}

// 背景
.projector-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.bg-grid {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0.5;
}

.bg-radial {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center bottom, rgba(60, 100, 150, 0.1) 0%, transparent 60%);
}

// 投影仪装置
.projector-device {
  position: absolute;
  bottom: 15%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}

.device-body {
  position: relative;
  width: 120px;
  height: 80px;
  background: linear-gradient(180deg, #2a2a3a 0%, #1a1a2a 100%);
  border-radius: 12px 12px 20px 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}

.device-lens {
  position: absolute;
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 50px;
  background: radial-gradient(circle, #1a1a2a 30%, #0a0a15 100%);
  border: 3px solid #3a3a4a;
  border-radius: 50%;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.8);
}

.device-ring {
  position: absolute;
  top: 18px;
  left: 50%;
  transform: translateX(-50%);
  width: 56px;
  height: 56px;
  border: 2px solid rgba(100, 200, 255, 0.3);
  border-radius: 50%;
}

.device-glow {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 30px;
  background: radial-gradient(circle, rgba(100, 200, 255, 0.4) 0%, transparent 70%);
  border-radius: 50%;
  animation: lensGlow 2s ease-in-out infinite;
}

@keyframes lensGlow {
  0%, 100% { opacity: 0.5; transform: translateX(-50%) scale(1); }
  50% { opacity: 1; transform: translateX(-50%) scale(1.2); }
}

// 投影光束
.light-beam {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 400px;
  height: 500px;
  pointer-events: none;
}

.beam-cone {
  position: absolute;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 200px solid transparent;
  border-right: 200px solid transparent;
  border-top: 450px solid rgba(100, 200, 255, 0.05);
  filter: blur(20px);
}

.beam-edge {
  position: absolute;
  top: 60px;
  width: 2px;
  height: 440px;
  background: linear-gradient(180deg, rgba(100, 200, 255, 0.3) 0%, transparent 100%);

  &.left {
    left: calc(50% - 195px);
    transform: skewX(25deg);
  }

  &.right {
    right: calc(50% - 195px);
    transform: skewX(-25deg);
  }
}

// 微尘层
.dust-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.dust-particle {
  position: absolute;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 70%);
  border-radius: 50%;
  opacity: 0;
  animation: dustFloat 10s ease-in-out infinite;
}

@keyframes dustFloat {
  0%, 100% {
    opacity: 0;
    transform: translate(0, 0);
  }
  10% {
    opacity: 0.6;
  }
  90% {
    opacity: 0.4;
  }
}

// 投影幕布
.screen-frame {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 75%;
  max-width: 1000px;
  aspect-ratio: 16/10;
}

.screen-inner {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 4px;
  box-shadow:
    0 30px 100px rgba(0, 0, 0, 0.8),
    0 0 60px rgba(100, 200, 255, 0.1);
}

// 内容层
.content-layer {
  position: relative;
  width: 100%;
  height: 100%;
}

.color-layer {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.color-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.red-layer {
  mix-blend-mode: screen;
}

.blue-layer {
  mix-blend-mode: screen;
}

.cyan-layer {
  mix-blend-mode: screen;
}

.main-image-layer {
  position: absolute;
  inset: 0;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform-origin: center;
}

// 色散光斑
.aberration-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.glow-red {
  position: absolute;
  top: 10%;
  left: 5%;
  width: 30%;
  height: 40%;
  background: radial-gradient(ellipse, rgba(255, 50, 50, 0.2) 0%, transparent 70%);
  filter: blur(20px);
}

.glow-blue {
  position: absolute;
  top: 20%;
  right: 8%;
  width: 25%;
  height: 35%;
  background: radial-gradient(ellipse, rgba(50, 50, 255, 0.2) 0%, transparent 70%);
  filter: blur(15px);
}

.glow-cyan {
  position: absolute;
  bottom: 15%;
  left: 30%;
  width: 35%;
  height: 25%;
  background: radial-gradient(ellipse, rgba(0, 200, 255, 0.15) 0%, transparent 70%);
  filter: blur(18px);
}

// 模糊叠加
.blur-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 20%, rgba(0, 0, 0, 0.6) 100%);
  pointer-events: none;
}

// 幕布边框
.screen-border {
  position: absolute;
  background: linear-gradient(to var(--dir), #1a1a2a, #0a0a0a);

  &.top {
    top: -8px;
    left: -20px;
    right: -20px;
    height: 8px;
    --dir: bottom;
  }

  &.bottom {
    bottom: -8px;
    left: -20px;
    right: -20px;
    height: 8px;
    --dir: top;
  }

  &.left {
    top: -8px;
    bottom: -8px;
    left: -20px;
    width: 8px;
    --dir: right;
  }

  &.right {
    top: -8px;
    bottom: -8px;
    right: -20px;
    width: 8px;
    --dir: left;
  }
}

// 最终暗角
.screen-vignette {
  position: absolute;
  inset: 0;
  box-shadow: inset 0 0 80px rgba(0, 0, 0, 0.5);
  pointer-events: none;
  border-radius: 4px;
}

// 镜头反光
.lens-flare {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 20;
}

.flare-streak {
  position: absolute;
  top: 45%;
  left: 20%;
  width: 60%;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
  transform-origin: left center;
}

.flare-dot {
  position: absolute;
  top: 43%;
  left: 75%;
  width: 8px;
  height: 8px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 70%);
  border-radius: 50%;
}

// 闪烁效果
.flicker-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.05);
  pointer-events: none;
  z-index: 15;
}

// 信息面板
.info-panel {
  position: absolute;
  left: 6%;
  top: 50%;
  transform: translateY(-50%);
  padding: 24px 28px;
  background: rgba(10, 10, 15, 0.9);
  border: 1px solid rgba(100, 200, 255, 0.2);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  z-index: 25;
  max-width: 240px;
}

.panel-tag {
  display: inline-block;
  padding: 4px 10px;
  background: linear-gradient(90deg, #3b82f6, #06b6d4);
  border-radius: 16px;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 2px;
  color: #fff;
  margin-bottom: 12px;
}

.panel-title {
  font-size: 22px;
  font-weight: 800;
  color: #fff;
  margin: 0 0 5px;
  background: linear-gradient(90deg, #fff, #67e8f9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.panel-subtitle {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0 0 16px;
}

.panel-status {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #3b82f6;
  transition: all 0.3s ease;

  &.active {
    background: #10b981;
    box-shadow: 0 0 10px rgba(16, 185, 129, 0.6);
  }
}

.status-text {
  font-size: 10px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 1px;
}

// 进度条
.progress-bar {
  position: absolute;
  right: 6%;
  bottom: 8%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  z-index: 25;
}

.progress-fill {
  width: 150px;
  height: 3px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, #3b82f6, #06b6d4, #22d3ee);
    transform-origin: left;
    transform: scaleX(0);
  }
}

.progress-text {
  font-size: 9px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 2px;
}
</style>
