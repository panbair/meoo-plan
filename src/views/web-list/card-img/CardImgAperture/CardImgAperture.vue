<template>
  <div ref="containerRef" class="aperture-container">
    <!-- 背景 -->
    <div ref="bgRef" class="aperture-bg">
      <div class="bg-vignette" />
      <div class="bg-gradient" />
    </div>

    <!-- 背景装饰层 -->
    <div ref="backLayerRef" class="layer back-layer">
      <div class="back-element back-circle-1" />
      <div class="back-element back-circle-2" />
      <div class="back-element back-lines" />
    </div>

    <!-- 主体图片层 -->
    <div ref="mainLayerRef" class="layer main-layer">
      <div ref="imageWrapperRef" class="image-wrapper">
        <img
          ref="mainImageRef"
          class="main-image"
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
          alt="Mountain Landscape"
        />
        <div ref="blurOverlayRef" class="blur-overlay" />
        <div ref="centerCircleRef" class="center-circle" />
      </div>
    </div>

    <!-- 前景装饰层 -->
    <div ref="frontLayerRef" class="layer front-layer">
      <div class="front-element front-frame" />
      <div class="front-element front-corner tl" />
      <div class="front-element front-corner tr" />
      <div class="front-element front-corner bl" />
      <div class="front-element front-corner br" />
    </div>

    <!-- 光圈叶片层 -->
    <div ref="irisLayerRef" class="iris-layer">
      <div
        v-for="i in 8"
        :key="i"
        :ref="el => setBladeRef(el, i)"
        class="iris-blade"
        :class="`blade-${i}`"
      />
      <div ref="irisCenterRef" class="iris-center" />
      <div ref="irisGlintRef" class="iris-glint" />
    </div>

    <!-- 暗角层 -->
    <div ref="vignetteLayerRef" class="vignette-layer">
      <div class="vignette-shadow vignette-t" />
      <div class="vignette-shadow vignette-b" />
      <div class="vignette-shadow vignette-l" />
      <div class="vignette-shadow vignette-r" />
    </div>

    <!-- 信息面板 -->
    <div ref="infoPanelRef" class="info-panel">
      <div class="panel-badge">OPTICAL LENS</div>
      <h2 ref="titleRef" class="panel-title">Aperture Effect</h2>
      <p ref="subtitleRef" class="panel-subtitle">Mechanical Iris Blades Animation</p>
      <div ref="statsRef" class="panel-stats">
        <div class="stat-item">
          <span class="stat-value" ref="apertureValueRef">f/1.4</span>
          <span class="stat-label">Aperture</span>
        </div>
        <div class="stat-item">
          <span class="stat-value" ref="focalValueRef">24mm</span>
          <span class="stat-label">Focal Length</span>
        </div>
      </div>
    </div>

    <!-- 进度指示 -->
    <div ref="progressRef" class="progress-indicator">
      <div class="progress-track">
        <div class="progress-fill" />
      </div>
      <span ref="progressTextRef" class="progress-text">CLOSING</span>
    </div>

    <!-- 金属反光特效 -->
    <div ref="glintLayerRef" class="glint-layer">
      <div v-for="i in 6" :key="i" class="glint-line" :class="`glint-${i}`" />
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
const backLayerRef = ref<HTMLElement | null>(null)
const mainLayerRef = ref<HTMLElement | null>(null)
const imageWrapperRef = ref<HTMLElement | null>(null)
const mainImageRef = ref<HTMLElement | null>(null)
const blurOverlayRef = ref<HTMLElement | null>(null)
const centerCircleRef = ref<HTMLElement | null>(null)
const frontLayerRef = ref<HTMLElement | null>(null)
const irisLayerRef = ref<HTMLElement | null>(null)
const irisCenterRef = ref<HTMLElement | null>(null)
const irisGlintRef = ref<HTMLElement | null>(null)
const vignetteLayerRef = ref<HTMLElement | null>(null)
const infoPanelRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const statsRef = ref<HTMLElement | null>(null)
const apertureValueRef = ref<HTMLElement | null>(null)
const focalValueRef = ref<HTMLElement | null>(null)
const progressRef = ref<HTMLElement | null>(null)
const progressTextRef = ref<HTMLElement | null>(null)
const glintLayerRef = ref<HTMLElement | null>(null)

const bladeRefs: (HTMLElement | null)[] = []

function setBladeRef(el: any, index: number) {
  bladeRefs[index - 1] = el as HTMLElement | null
}

let mouseX = 0
let mouseY = 0

function initAnimations() {
  if (!containerRef.value) return

  // 光圈叶片初始状态 - 完全闭合
  bladeRefs.forEach((blade, i) => {
    if (blade) {
      gsap.set(blade, {
        rotation: (360 / 8) * i,
        scale: 1.5,
        opacity: 1
      })
    }
  })

  gsap.set(irisCenterRef.value, { scale: 0, opacity: 0 })
  gsap.set(blurOverlayRef.value, { opacity: 0.8 })
  gsap.set(mainImageRef.value, { scale: 1.8, filter: 'blur(20px)' })
  gsap.set(centerCircleRef.value, { scale: 0 })
  gsap.set(glintLayerRef.value, { opacity: 0 })

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: containerRef.value,
      start: 'top 100%',
      end: 'bottom -100%',
      scrub: 1.5
    }
  })

  cleanupFns.push(() => tl.kill())

  // 开镜阶段 (0-40%)
  // 中心光斑先出现
  tl.to(centerCircleRef.value, {
    scale: 0.15,
    opacity: 1,
    duration: 0.15,
    ease: 'power2.out'
  }, 0)

  // 光圈叶片旋转张开
  bladeRefs.forEach((blade, i) => {
    if (blade) {
      const startAngle = (360 / 8) * i
      const endAngle = startAngle + 40 // 向外旋转40度
      tl.to(blade, {
        rotation: endAngle,
        scale: 0.6,
        duration: 0.4,
        ease: 'power2.inOut'
      }, 0.05 * i)
    }
  })

  // 图片渐显 + 缩放
  tl.to(mainImageRef.value, {
    scale: 1.2,
    filter: 'blur(8px)',
    duration: 0.35,
    ease: 'power2.out'
  }, 0.02)

  tl.to(blurOverlayRef.value, {
    opacity: 0,
    duration: 0.3
  }, 0.1)

  // 中心圆域扩大
  tl.to(centerCircleRef.value, {
    scale: 0.6,
    duration: 0.35,
    ease: 'power2.inOut'
  }, 0.05)

  // 清晰化阶段 (40-60%)
  tl.to(mainImageRef.value, {
    scale: 1,
    filter: 'blur(0px)',
    duration: 0.2,
    ease: 'power2.inOut'
  }, 0.4)

  // 中心圆域消失
  tl.to(centerCircleRef.value, {
    scale: 1,
    opacity: 0,
    duration: 0.15,
    ease: 'power2.in'
  }, 0.45)

  // 中心光斑缩小消失
  tl.to(centerCircleRef.value, {
    scale: 0,
    duration: 0.1
  }, 0.55)

  // 叶片继续张开
  bladeRefs.forEach((blade, i) => {
    if (blade) {
      const startAngle = (360 / 8) * i + 40
      const endAngle = startAngle + 30
      tl.to(blade, {
        rotation: endAngle,
        scale: 0.2,
        duration: 0.2,
        ease: 'power2.inOut'
      }, 0.4 + 0.03 * i)
    }
  })

  // 金属反光
  tl.to(glintLayerRef.value, {
    opacity: 1,
    duration: 0.05
  }, 0.55)

  tl.to('.glint-line', {
    scaleX: 1,
    opacity: 0,
    stagger: 0.02,
    duration: 0.3,
    ease: 'power2.out'
  }, 0.55)

  tl.to(glintLayerRef.value, {
    opacity: 0,
    duration: 0.15
  }, 0.8)

  // 信息面板入场
  tl.fromTo(infoPanelRef.value,
    { opacity: 0, x: 80 },
    { opacity: 1, x: 0, duration: 0.15 },
    0.3
  )

  // 进度指示入场
  tl.fromTo(progressRef.value,
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.1 },
    0.35
  )

  // 景深层动画 (前景快，背景慢)
  tl.fromTo(frontLayerRef.value,
    { opacity: 0, scale: 0.9 },
    { opacity: 1, scale: 1, duration: 0.25 },
    0.15
  )

  tl.fromTo(backLayerRef.value,
    { opacity: 0, scale: 1.1 },
    { opacity: 0.6, scale: 1, duration: 0.3 },
    0.1
  )

  // 关镜阶段 (80-100%)
  // 叶片合拢
  bladeRefs.forEach((blade, i) => {
    if (blade) {
      const startAngle = (360 / 8) * i + 70
      const endAngle = startAngle - 10
      tl.to(blade, {
        rotation: endAngle,
        scale: 1.5,
        opacity: 1,
        duration: 0.2,
        ease: 'power2.inOut'
      }, 0.8 + 0.02 * i)
    }
  })

  // 中心光斑重新出现
  tl.to(centerCircleRef.value, {
    scale: 0.15,
    opacity: 1,
    duration: 0.1
  }, 0.85)

  // 图片模糊 + 消失
  tl.to(mainImageRef.value, {
    scale: 1.5,
    filter: 'blur(15px)',
    opacity: 0,
    duration: 0.15,
    ease: 'power2.in'
  }, 0.85)

  // 中心圆域缩小
  tl.to(centerCircleRef.value, {
    scale: 0,
    duration: 0.1,
    ease: 'power2.in'
  }, 0.95)

  // 信息面板离场
  tl.to(infoPanelRef.value, {
    opacity: 0,
    x: -80,
    duration: 0.1
  }, 0.88)
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
        if (progress < 0.4) {
          progressTextRef.value.textContent = 'OPENING'
        } else if (progress < 0.8) {
          progressTextRef.value.textContent = 'FOCUSING'
        } else {
          progressTextRef.value.textContent = 'CLOSING'
        }
      }

      // 更新光圈值
      if (apertureValueRef.value) {
        const fValue = progress < 0.5
          ? `f/${(1.4 + progress * 10).toFixed(1)}`
          : `f/${(6.4 - (progress - 0.5) * 10).toFixed(1)}`
        apertureValueRef.value.textContent = fValue
      }

      // 景深层视差
      if (frontLayerRef.value) {
        gsap.to(frontLayerRef.value, {
          y: progress * -60,
          duration: 0.1
        })
      }

      if (backLayerRef.value) {
        gsap.to(backLayerRef.value, {
          y: progress * -30,
          duration: 0.1
        })
      }
    }
  })
}

function initMouseInteraction() {
  if (!containerRef.value || !irisLayerRef.value || !mainLayerRef.value) return

  const handleMouseMove = (e: MouseEvent) => {
    const rect = containerRef.value!.getBoundingClientRect()
    mouseX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2)
    mouseY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2)
  }

  containerRef.value.addEventListener('mousemove', handleMouseMove)
  cleanupFns.push(() => {
    containerRef.value?.removeEventListener('mousemove', handleMouseMove)
  })

  // 鼠标移动产生镜头偏移
  gsap.to(irisLayerRef.value, {
    x: () => mouseX * 15,
    y: () => mouseY * 10,
    rotateX: () => mouseY * 3,
    rotateY: () => mouseX * 3,
    duration: 0.6,
    ease: 'power2.out'
  })

  gsap.to(mainLayerRef.value, {
    x: () => mouseX * 8,
    y: () => mouseY * 5,
    duration: 0.5,
    ease: 'power2.out'
  })

  // 暗角跟随鼠标
  gsap.to(vignetteLayerRef.value, {
    '--vignette-x': () => mouseX * 20,
    '--vignette-y': () => mouseY * 15,
    duration: 0.4
  })
}

function initBladesBreathing() {
  // 叶片微小呼吸
  const bladesTl = gsap.timeline({ repeat: -1, yoyo: true })

  bladeRefs.forEach((blade, i) => {
    if (blade) {
      bladesTl.to(blade, {
        scale: '+=0.02',
        duration: 2 + Math.random(),
        ease: 'sine.inOut'
      }, i * 0.1)
    }
  })

  cleanupFns.push(() => bladesTl.kill())
}

onMounted(() => {
  initAnimations()
  initScrollProgress()
  initMouseInteraction()
  initBladesBreathing()
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style scoped lang="scss">
.aperture-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0f0f1a 100%);
  overflow: hidden;
  perspective: 1200px;
  transform-style: preserve-3d;
}

// 背景
.aperture-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.bg-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, 0.8) 100%);
}

.bg-gradient {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 30%, rgba(100, 100, 255, 0.05) 0%, transparent 40%),
    radial-gradient(circle at 80% 70%, rgba(255, 100, 100, 0.05) 0%, transparent 40%);
}

// 景深层
.layer {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.back-layer {
  opacity: 0.6;
}

.back-element {
  position: absolute;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 50%;
}

.back-circle-1 {
  width: 500px;
  height: 500px;
  animation: backRotate 60s linear infinite;
}

.back-circle-2 {
  width: 700px;
  height: 700px;
  animation: backRotate 90s linear infinite reverse;
}

@keyframes backRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.back-lines {
  width: 100%;
  height: 100%;
  background:
    repeating-linear-gradient(0deg, transparent, transparent 49px, rgba(255,255,255,0.02) 50px),
    repeating-linear-gradient(90deg, transparent, transparent 49px, rgba(255,255,255,0.02) 50px);
  animation: gridPulse 4s ease-in-out infinite;
}

@keyframes gridPulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
}

// 主图片层
.main-layer {
  z-index: 2;
}

.image-wrapper {
  position: relative;
  width: 70%;
  max-width: 900px;
  aspect-ratio: 16/10;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 30px 100px rgba(0, 0, 0, 0.8);
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform-origin: center;
}

.blur-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, transparent 0%, rgba(10, 10, 15, 0.95) 60%);
  pointer-events: none;
}

.center-circle {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100px;
  height: 100px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
  pointer-events: none;
}

// 前景装饰层
.front-layer {
  z-index: 10;
  opacity: 0;
}

.front-element {
  position: absolute;
}

.front-frame {
  width: 85%;
  max-width: 1100px;
  height: 65%;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 4px;
}

.front-corner {
  width: 40px;
  height: 40px;
  border: 2px solid rgba(255, 255, 255, 0.4);

  &.tl { top: 8%; left: 8%; border-right: none; border-bottom: none; }
  &.tr { top: 8%; right: 8%; border-left: none; border-bottom: none; }
  &.bl { bottom: 8%; left: 8%; border-right: none; border-top: none; }
  &.br { bottom: 8%; right: 8%; border-left: none; border-top: none; }
}

// 光圈层
.iris-layer {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 800px;
  height: 800px;
  transform: translate(-50%, -50%);
  z-index: 5;
  transform-style: preserve-3d;
  pointer-events: none;
}

.iris-blade {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 400px;
  height: 400px;
  margin-left: -200px;
  margin-top: -200px;
  background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
  clip-path: polygon(
    50% 0%,
    60% 35%,
    100% 50%,
    60% 65%,
    50% 100%,
    40% 65%,
    0% 50%,
    40% 35%
  );
  transform-origin: center;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.8);
}

.blade-1 { transform: rotate(0deg); }
.blade-2 { transform: rotate(45deg); }
.blade-3 { transform: rotate(90deg); }
.blade-4 { transform: rotate(135deg); }
.blade-5 { transform: rotate(180deg); }
.blade-6 { transform: rotate(225deg); }
.blade-7 { transform: rotate(270deg); }
.blade-8 { transform: rotate(315deg); }

.iris-center {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80px;
  height: 80px;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, #fff 0%, rgba(255,255,255,0.8) 50%, transparent 70%);
  border-radius: 50%;
  z-index: 6;
}

.iris-glint {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 600px;
  height: 600px;
  transform: translate(-50%, -50%);
  background: conic-gradient(
    from 0deg,
    transparent 0deg,
    rgba(255, 255, 255, 0.3) 30deg,
    transparent 60deg
  );
  border-radius: 50%;
  opacity: 0;
  pointer-events: none;
}

// 暗角层
.vignette-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  --vignette-x: 0px;
  --vignette-y: 0px;
  z-index: 8;
}

.vignette-shadow {
  position: absolute;
  background: linear-gradient(to var(--dir), rgba(0,0,0,0.9) 0%, transparent 60%);
  transition: transform 0.3s ease;
}

.vignette-t {
  top: 0;
  left: 0;
  right: 0;
  height: 25%;
  --dir: bottom;
  transform: translateY(calc(-10% + var(--vignette-y) * 0.5));
}

.vignette-b {
  bottom: 0;
  left: 0;
  right: 0;
  height: 25%;
  --dir: top;
  transform: translateY(calc(10% + var(--vignette-y) * 0.5));
}

.vignette-l {
  top: 0;
  bottom: 0;
  left: 0;
  width: 25%;
  --dir: right;
  transform: translateX(calc(-10% + var(--vignette-x) * 0.5));
}

.vignette-r {
  top: 0;
  bottom: 0;
  right: 0;
  width: 25%;
  --dir: left;
  transform: translateX(calc(10% + var(--vignette-x) * 0.5));
}

// 信息面板
.info-panel {
  position: absolute;
  right: 6%;
  top: 50%;
  transform: translateY(-50%);
  padding: 28px 32px;
  background: rgba(10, 10, 15, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(12px);
  z-index: 15;
  max-width: 260px;
}

.panel-badge {
  display: inline-block;
  padding: 5px 12px;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
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
  background: linear-gradient(90deg, #fff, #a5b4fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.panel-subtitle {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0 0 20px;
}

.panel-stats {
  display: flex;
  gap: 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  color: #a5b4fc;
  font-variant-numeric: tabular-nums;
}

.stat-label {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 1px;
}

// 进度指示
.progress-indicator {
  position: absolute;
  left: 50%;
  bottom: 6%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  z-index: 15;
}

.progress-track {
  width: 180px;
  height: 2px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 1px;
  overflow: hidden;
}

.progress-fill {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #8b5cf6, #a855f7);
  transform-origin: left;
  transform: scaleX(0);
}

.progress-text {
  font-size: 10px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 3px;
}

// 金属反光层
.glint-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 9;
  opacity: 0;
}

.glint-line {
  position: absolute;
  width: 150px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent);
  transform-origin: left center;
  transform: scaleX(0);
}

.glint-1 { top: 20%; left: 10%; rotate: -15deg; }
.glint-2 { top: 35%; left: 15%; rotate: -10deg; }
.glint-3 { top: 50%; left: 5%; rotate: -5deg; }
.glint-4 { top: 65%; left: 12%; rotate: 0deg; }
.glint-5 { top: 80%; left: 8%; rotate: 5deg; }
.glint-6 { top: 30%; right: 15%; rotate: 20deg; }
</style>
