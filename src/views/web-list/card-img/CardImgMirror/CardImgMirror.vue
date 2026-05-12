<template>
  <div ref="parentRef" class="card-img-mirror">
    <!-- 背景层 -->
    <div class="mirror-background">
      <div class="bg-sky"></div>
    </div>

    <!-- 真实景物层 -->
    <div ref="realLayerRef" class="mirror-layer mirror-real">
      <img
        class="mirror-image"
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
        alt="Mountain"
      />
      <div ref="realOverlayRef" class="mirror-overlay"></div>
    </div>

    <!-- 水平分割线 -->
    <div class="horizon-line"></div>

    <!-- 倒影层 -->
    <div ref="reflectionLayerRef" class="mirror-layer mirror-reflection">
      <img
        class="mirror-image mirror-image-flip"
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
        alt="Reflection"
      />
      <div ref="reflectionOverlayRef" class="mirror-overlay mirror-overlay-dark"></div>
    </div>

    <!-- 水纹 SVG 滤镜 -->
    <svg class="water-filter-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <filter id="water-displacement">
          <feTurbulence
            ref="turbulenceRef"
            type="fractalNoise"
            baseFrequency="0.015 0.02"
            numOctaves="3"
            result="noise"
          />
          <feDisplacementMap
            ref="displacementMapRef"
            in="SourceGraphic"
            in2="noise"
            scale="3"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>

    <!-- 涟漪容器 -->
    <div ref="rippleContainerRef" class="ripple-container"></div>

    <!-- 内容层 -->
    <div ref="contentRef" class="mirror-content">
      <div class="content-badge">
        <span class="badge-icon">◈</span>
        <span class="badge-text">镜湖倒影</span>
      </div>

      <div class="content-info">
        <h2 class="info-title">涟漪视差</h2>
        <p class="info-subtitle">静水微澜 · 时光流转</p>
      </div>

      <div class="time-indicator">
        <div class="time-bar">
          <div ref="timeProgressRef" class="time-progress"></div>
        </div>
        <span ref="timeLabelRef" class="time-label">晨曦</span>
      </div>
    </div>

    <!-- 底部装饰 -->
    <div class="bottom-decoration">
      <div class="deco-line"></div>
      <div class="deco-dots">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
      <div class="deco-line"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []

const parentRef = ref<HTMLElement | null>(null)
const realLayerRef = ref<HTMLElement | null>(null)
const reflectionLayerRef = ref<HTMLElement | null>(null)
const realOverlayRef = ref<HTMLElement | null>(null)
const reflectionOverlayRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const timeProgressRef = ref<HTMLElement | null>(null)
const timeLabelRef = ref<HTMLElement | null>(null)
const rippleContainerRef = ref<HTMLElement | null>(null)
const turbulenceRef = ref<SVGFEBlendElement | null>(null)
const displacementMapRef = ref<SVGFEBlendElement | null>(null)

const rippleId = ref(0)

// 入场动画
function initEntryAnimation() {
  if (!realLayerRef.value || !reflectionLayerRef.value || !contentRef.value) return

  gsap.set([realLayerRef.value, reflectionLayerRef.value], { opacity: 0 })
  gsap.set(contentRef.value, { opacity: 0, y: 30 })

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 80%',
      end: 'top 30%',
      scrub: 1.5
    }
  })

  tl.to(realLayerRef.value, {
    opacity: 1,
    duration: 1
  })
  tl.to(reflectionLayerRef.value, {
    opacity: 0.7,
    duration: 1
  }, '<')
  tl.to(contentRef.value, {
    opacity: 1,
    y: 0,
    duration: 1
  }, 0.3)

  cleanupFns.push(() => tl.kill())
}

// 上下视差滚动
function initParallaxScroll() {
  if (!realLayerRef.value || !reflectionLayerRef.value) return

  // 真实层 - 极慢下移 0.04
  const tlReal = gsap.to(realLayerRef.value, {
    yPercent: 4,
    ease: 'none',
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.5
    }
  })
  cleanupFns.push(() => tlReal.kill())

  // 倒影层 - 上浮 -0.1
  const tlReflection = gsap.to(reflectionLayerRef.value, {
    yPercent: -10,
    ease: 'none',
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.5
    }
  })
  cleanupFns.push(() => tlReflection.kill())
}

// 水纹持续波动
function initWaterWave() {
  if (!reflectionLayerRef.value) return

  // 水纹 scale 波动
  gsap.to(reflectionLayerRef.value, {
    scaleY: 1.02,
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  })

  // 局部扭曲变化
  ScrollTrigger.create({
    trigger: parentRef.value,
    start: 'top bottom',
    end: 'bottom top',
    scrub: 2,
    onUpdate: (self) => {
      const progress = self.progress
      const scale = 2 + Math.sin(progress * Math.PI * 4) * 1.5
      const freq = 0.012 + Math.sin(progress * Math.PI * 3) * 0.008

      if (turbulenceRef.value) {
        turbulenceRef.value.setAttribute('baseFrequency', `${freq} ${freq * 1.3}`)
      }
      if (displacementMapRef.value) {
        displacementMapRef.value.setAttribute('scale', String(scale))
      }
    }
  })
}

// 色调过渡
function initColorShift() {
  if (!realLayerRef.value || !realOverlayRef.value) return

  ScrollTrigger.create({
    trigger: parentRef.value,
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,
    onUpdate: (self) => {
      const progress = self.progress

      // 晨曦金粉 → 午后清蓝
      const hueRotate = progress * 30
      const brightness = 1 + progress * 0.15

      gsap.to(realLayerRef.value, {
        filter: `hue-rotate(${hueRotate}deg) brightness(${brightness})`,
        duration: 0.3
      })

      // 时间标签更新
      if (timeLabelRef.value) {
        timeLabelRef.value.textContent = progress < 0.5 ? '晨曦' : '午后'
      }

      // 时间进度条
      if (timeProgressRef.value) {
        gsap.set(timeProgressRef.value, { width: `${progress * 100}%` })
      }
    }
  })
}

// 涟漪交互
function initRippleInteraction() {
  if (!parentRef.value || !rippleContainerRef.value) return

  function createRipple(x: number, y: number) {
    if (!rippleContainerRef.value) return

    const ripple = document.createElement('div')
    ripple.className = 'ripple'
    ripple.id = `ripple-${rippleId.value++}`
    ripple.style.left = `${x}px`
    ripple.style.top = `${y}px`
    rippleContainerRef.value.appendChild(ripple)

    // 涟漪动画
    gsap.fromTo(ripple,
      {
        scale: 0,
        opacity: 0.6,
        borderWidth: 4
      },
      {
        scale: 3,
        opacity: 0,
        borderWidth: 1,
        duration: 1.5,
        ease: 'power2.out',
        onComplete: () => {
          ripple.remove()
        }
      }
    )

    // 局部水纹增强
    if (reflectionLayerRef.value) {
      gsap.to(reflectionLayerRef.value, {
        filter: 'brightness(1.1) saturate(1.1)',
        duration: 0.2,
        yoyo: true,
        repeat: 1
      })
    }
  }

  let rippleTimeout: number | null = null

  function handleClick(e: MouseEvent) {
    const rect = parentRef.value!.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // 只在水面区域触发
    if (y > window.innerHeight / 2) {
      createRipple(x, y)
    }
  }

  function handleMouseMove(e: MouseEvent) {
    const rect = parentRef.value!.getBoundingClientRect()
    const y = e.clientY - rect.top

    // 水面区域悬停产生小涟漪
    if (y > window.innerHeight / 2) {
      if (rippleTimeout) clearTimeout(rippleTimeout)
      rippleTimeout = window.setTimeout(() => {
        const x = e.clientX - rect.left
        createRipple(x, y)
      }, 800)
    }
  }

  parentRef.value.addEventListener('click', handleClick)
  parentRef.value.addEventListener('mousemove', handleMouseMove)

  cleanupFns.push(() => {
    parentRef.value?.removeEventListener('click', handleClick)
    parentRef.value?.removeEventListener('mousemove', handleMouseMove)
    if (rippleTimeout) clearTimeout(rippleTimeout)
  })
}

// 装饰动画
function initDecorations() {
  gsap.to('.dot', {
    scale: 1.5,
    opacity: 0.5,
    duration: 1.5,
    repeat: -1,
    yoyo: true,
    stagger: {
      each: 0.3,
      from: 'random'
    },
    ease: 'sine.inOut'
  })
}

onMounted(() => {
  initEntryAnimation()
  initParallaxScroll()
  initWaterWave()
  initColorShift()
  initRippleInteraction()
  initDecorations()
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0
  ScrollTrigger.getAll().forEach(st => st.kill())
  gsap.killTweensOf('*')
})
</script>

<style scoped lang="scss">
.card-img-mirror {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(
    180deg,
    #ffd4a3 0%,
    #ffecd2 20%,
    #a8e6cf 45%,
    #88d8b0 50%,
    #5bc0be 60%,
    #2c7873 80%,
    #1a4a4a 100%
  );
}

// 背景层
.mirror-background {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.bg-sky {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(255, 212, 163, 0.3) 0%,
    rgba(255, 236, 210, 0.2) 30%,
    rgba(168, 230, 207, 0.1) 50%,
    transparent 60%
  );
}

// 镜像层
.mirror-layer {
  position: absolute;
  left: 0;
  width: 100%;
  height: 60%;
  will-change: transform, filter;
}

// 真实景物层
.mirror-real {
  top: 0;
  z-index: 2;
}

.mirror-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
}

.mirror-image-flip {
  transform: scaleY(-1);
  object-position: center bottom;
}

.mirror-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(255, 220, 180, 0.2) 0%,
    transparent 100%
  );
  pointer-events: none;
}

.mirror-overlay-dark {
  background: linear-gradient(
    0deg,
    rgba(40, 80, 80, 0.4) 0%,
    rgba(20, 60, 60, 0.2) 30%,
    rgba(0, 40, 40, 0.1) 60%,
    transparent 100%
  );
}

// 倒影层
.mirror-reflection {
  top: 50%;
  z-index: 3;
  filter: url(#water-displacement);
}

// 水平分割线
.horizon-line {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.4) 20%,
    rgba(255, 255, 255, 0.6) 50%,
    rgba(255, 255, 255, 0.4) 80%,
    transparent 100%
  );
  z-index: 4;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

// 水纹滤镜 SVG
.water-filter-svg {
  position: absolute;
  width: 0;
  height: 0;
}

// 涟漪容器
.ripple-container {
  position: absolute;
  inset: 0;
  z-index: 10;
  pointer-events: none;
  overflow: hidden;
}

.ripple {
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.6);
  transform: translate(-50%, -50%);
  pointer-events: none;
}

// 内容层
.mirror-content {
  position: absolute;
  top: 15%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 20;
  pointer-events: none;
}

.content-badge {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 12px 28px;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50px;
  backdrop-filter: blur(12px);
  margin-bottom: 30px;
}

.badge-icon {
  font-size: 18px;
  color: #fff;
  animation: iconPulse 2s ease-in-out infinite;
}

@keyframes iconPulse {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.2); opacity: 1; }
}

.badge-text {
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.95);
  letter-spacing: 3px;
}

.content-info {
  margin-bottom: 40px;
}

.info-title {
  font-size: 56px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 12px;
  text-shadow:
    0 4px 30px rgba(255, 180, 100, 0.4),
    0 2px 10px rgba(0, 0, 0, 0.1);
  background: linear-gradient(135deg, #fff 0%, #ffd4a3 50%, #fff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.info-subtitle {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  letter-spacing: 8px;
}

// 时间指示器
.time-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.time-bar {
  width: 200px;
  height: 3px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  overflow: hidden;
}

.time-progress {
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, #ffd4a3, #fff);
  border-radius: 2px;
}

.time-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 2px;
}

// 底部装饰
.bottom-decoration {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 20px;
  z-index: 20;
}

.deco-line {
  width: 80px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
}

.deco-dots {
  display: flex;
  gap: 8px;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
}
</style>
