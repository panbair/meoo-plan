<template>
  <div ref="containerRef" class="wireless-container">
    <!-- 深空背景 -->
    <div ref="bgRef" class="wireless-bg">
      <!-- 背景粒子 -->
      <div v-for="i in 60" :key="i" class="bg-particle" :style="getParticleStyle(i)" />
      <!-- 星云光晕 -->
      <div class="nebula-halo" />
    </div>

    <!-- 无线充电底座层 -->
    <div ref="chargerBaseRef" class="charger-base">
      <!-- 底座主体 -->
      <div ref="baseRef" class="base-body">
        <div class="base-ring" />
        <div class="base-center" />
        <div class="base-glow" />
      </div>

      <!-- 旋转能量环 -->
      <div ref="energyRingRef" class="energy-rings">
        <div class="ring ring-1" />
        <div class="ring ring-2" />
        <div class="ring ring-3" />
      </div>

      <!-- 底座光晕 -->
      <div class="base-aura" />
    </div>

    <!-- 电磁感应光弧层 -->
    <div ref="arcLayerRef" class="arc-layer">
      <!-- SVG 电弧 -->
      <svg ref="arcSvgRef" class="arc-svg" viewBox="0 0 200 300" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="arcGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#00f5ff" stop-opacity="0.9" />
            <stop offset="50%" stop-color="#00f5ff" stop-opacity="0.5" />
            <stop offset="100%" stop-color="#a855f7" stop-opacity="0.9" />
          </linearGradient>
          <filter id="arcGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          ref="arcPathRef"
          class="arc-path"
          d="M100,20 Q60,100 100,150 Q140,200 100,280"
          fill="none"
          stroke="url(#arcGradient)"
          stroke-width="2"
          filter="url(#arcGlow)"
        />
        <!-- 电弧闪烁点 -->
        <circle ref="arcSparkRef" class="arc-spark" r="3" fill="#00f5ff" />
      </svg>
    </div>

    <!-- 产品主体层 -->
    <div ref="productLayerRef" class="product-layer">
      <div ref="productRef" class="product-body">
        <img
          ref="productImgRef"
          class="product-image"
          src="https://images.unsplash.com/photo-1606220838315-056192d5e927?w=800&q=80"
          alt="Wireless Device"
        />
        <div class="product-reflection" />
        <div class="product-edge-glow" />
      </div>

      <!-- 产品悬浮光晕 -->
      <div class="product-aura">
        <div class="aura-ring aura-ring-1" />
        <div class="aura-ring aura-ring-2" />
      </div>
    </div>

    <!-- 能量脉冲层 -->
    <div ref="pulseLayerRef" class="pulse-layer">
      <div v-for="i in 5" :key="i" class="pulse-ring" :class="`pulse-ring-${i}`" />
    </div>

    <!-- 信息面板 -->
    <div ref="infoPanelRef" class="info-panel">
      <div class="panel-tag">MAGNETIC INDUCTION</div>
      <h2 class="panel-title">Wireless Charge</h2>
      <p class="panel-subtitle">Magnetic Suspension Technology</p>
      <div class="status-bar">
        <div class="status-item">
          <span class="status-label">Power</span>
          <span ref="powerValueRef" class="status-value">0%</span>
        </div>
        <div class="status-item">
          <span class="status-label">Efficiency</span>
          <span ref="efficiencyRef" class="status-value">0%</span>
        </div>
      </div>
    </div>

    <!-- 磁吸指示器 -->
    <div ref="magnetIndicatorRef" class="magnet-indicator">
      <div class="magnet-icon">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M4 8V6a2 2 0 012-2h2v10H6a2 2 0 01-2-2V8z" fill="#ef4444"/>
          <path d="M20 8V6a2 2 0 00-2-2h-2v10h2a2 2 0 002-2V8z" fill="#3b82f6"/>
        </svg>
      </div>
      <span ref="magnetTextRef" class="magnet-text">Magnetic Field Active</span>
    </div>

    <!-- 阶段指示 -->
    <div ref="stageIndicatorRef" class="stage-indicator">
      <span ref="stageTextRef" class="stage-text">INITIALIZING</span>
      <div ref="progressBarRef" class="progress-bar">
        <div class="progress-fill" />
      </div>
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
const chargerBaseRef = ref<HTMLElement | null>(null)
const baseRef = ref<HTMLElement | null>(null)
const energyRingRef = ref<HTMLElement | null>(null)
const arcLayerRef = ref<HTMLElement | null>(null)
const arcSvgRef = ref<HTMLElement | null>(null)
const arcPathRef = ref<SVGPathElement | null>(null)
const arcSparkRef = ref<SVGCircleElement | null>(null)
const productLayerRef = ref<HTMLElement | null>(null)
const productRef = ref<HTMLElement | null>(null)
const productImgRef = ref<HTMLElement | null>(null)
const pulseLayerRef = ref<HTMLElement | null>(null)
const infoPanelRef = ref<HTMLElement | null>(null)
const powerValueRef = ref<HTMLElement | null>(null)
const efficiencyRef = ref<HTMLElement | null>(null)
const magnetIndicatorRef = ref<HTMLElement | null>(null)
const magnetTextRef = ref<HTMLElement | null>(null)
const stageIndicatorRef = ref<HTMLElement | null>(null)
const stageTextRef = ref<HTMLElement | null>(null)
const progressBarRef = ref<HTMLElement | null>(null)

let mouseX = 0
let mouseY = 0
let productXTo: gsap.core.Tween | null = null
let productYTo: gsap.core.Tween | null = null
let isPulseActive = false

function getParticleStyle(index: number) {
  const size = Math.random() * 2 + 1
  const x = Math.random() * 100
  const y = Math.random() * 100
  const delay = Math.random() * 5
  const duration = Math.random() * 3 + 2
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${x}%`,
    top: `${y}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  }
}

function initAnimations() {
  if (!containerRef.value) return

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: containerRef.value,
      start: 'top 100%',
      end: 'bottom -100%',
      scrub: 1.5
    }
  })

  cleanupFns.push(() => tl.kill())

  // 入场动画阶段 (0-25%)
  // 底座入场
  tl.fromTo(
    chargerBaseRef.value,
    { opacity: 0, scale: 0.3, y: 100 },
    { opacity: 1, scale: 1, y: 0, duration: 0.25 },
    0
  )

  // 能量环入场
  tl.fromTo(
    energyRingRef.value,
    { opacity: 0, scale: 0.5 },
    { opacity: 1, scale: 1, duration: 0.25 },
    0.05
  )

  // 光弧入场
  tl.fromTo(
    arcLayerRef.value,
    { opacity: 0 },
    { opacity: 1, duration: 0.2 },
    0.1
  )

  // 产品入场
  tl.fromTo(
    productLayerRef.value,
    { opacity: 0, y: -200, scale: 0.8 },
    { opacity: 1, y: 0, scale: 1, duration: 0.25 },
    0.15
  )

  // 产品悬浮呼吸 (独立循环)
  const floatTl = gsap.timeline({ repeat: -1, yoyo: true })
  floatTl.to(productRef.value, {
    y: -15,
    rotateY: 5,
    duration: 2.5,
    ease: 'sine.inOut'
  })

  cleanupFns.push(() => floatTl.kill())

  // 信息面板入场
  tl.fromTo(
    infoPanelRef.value,
    { opacity: 0, x: 100 },
    { opacity: 1, x: 0, duration: 0.2 },
    0.2
  )

  // 磁吸指示器入场
  tl.fromTo(
    magnetIndicatorRef.value,
    { opacity: 0 },
    { opacity: 1, duration: 0.15 },
    0.22
  )

  // 阶段指示入场
  tl.fromTo(
    stageIndicatorRef.value,
    { opacity: 0, y: 50 },
    { opacity: 1, y: 0, duration: 0.15 },
    0.25
  )

  // 展示阶段 (25-75%) - 视差滚动
  // 底座视差移动
  tl.to(
    chargerBaseRef.value,
    { y: -80, duration: 0.5 },
    0.25
  )

  // 产品视差移动 (更快)
  tl.to(
    productLayerRef.value,
    { y: -160, duration: 0.5 },
    0.25
  )

  // 光弧视差 (介于两者之间)
  tl.to(
    arcLayerRef.value,
    { y: -120, duration: 0.5 },
    0.25
  )

  // 离场阶段 (75-100%)
  // 产品下落
  tl.to(
    productLayerRef.value,
    { y: 150, opacity: 0, duration: 0.25 },
    0.75
  )

  // 光弧断开
  tl.to(
    arcLayerRef.value,
    { opacity: 0, scaleY: 0.3, duration: 0.2 },
    0.78
  )

  // 底座消失
  tl.to(
    chargerBaseRef.value,
    { y: 100, opacity: 0, scale: 0.5, duration: 0.2 },
    0.82
  )

  // 信息面板离场
  tl.to(
    infoPanelRef.value,
    { opacity: 0, x: -100, duration: 0.15 },
    0.8
  )
}

function initMouseInteraction() {
  if (!containerRef.value || !productRef.value) return

  // 鼠标移动监听
  const handleMouseMove = (e: MouseEvent) => {
    const rect = containerRef.value!.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    mouseX = (e.clientX - rect.left - centerX) / centerX
    mouseY = (e.clientY - rect.top - centerY) / centerY
  }

  containerRef.value.addEventListener('mousemove', handleMouseMove)
  cleanupFns.push(() => {
    containerRef.value?.removeEventListener('mousemove', handleMouseMove)
  })

  // 磁吸牵引效果
  if (productXTo) productXTo.kill()
  if (productYTo) productYTo.kill()

  productXTo = gsap.quickTo(productRef.value, 'x', { duration: 0.8, ease: 'power3.out' })
  productYTo = gsap.quickTo(productRef.value, 'y', { duration: 0.8, ease: 'power3.out' })

  const updatePosition = () => {
    if (productXTo && productYTo) {
      productXTo(mouseX * 30)
      productYTo(mouseY * 20)
    }
    requestAnimationFrame(updatePosition)
  }
  updatePosition()
  cleanupFns.push(() => {
    if (productXTo) productXTo.kill()
    if (productYTo) productYTo.kill()
  })
}

function initEnergyRings() {
  if (!energyRingRef.value) return

  // 旋转动画
  gsap.to(energyRingRef.value, {
    rotation: 360,
    duration: 8,
    repeat: -1,
    ease: 'none'
  })

  cleanupFns.push(() => {
    gsap.killTweensOf(energyRingRef.value)
  })
}

function initArcAnimation() {
  if (!arcPathRef.value || !arcSparkRef.value) return

  const pathLength = arcPathRef.value.getTotalLength()

  // 电弧路径动画
  gsap.set(arcPathRef.value, {
    strokeDasharray: pathLength,
    strokeDashoffset: pathLength
  })

  gsap.to(arcPathRef.value, {
    strokeDashoffset: 0,
    duration: 2,
    ease: 'power2.inOut',
    repeat: -1,
    yoyo: true
  })

  cleanupFns.push(() => {
    gsap.killTweensOf(arcPathRef.value)
  })

  // 电弧闪烁点动画 - 使用透明度闪烁替代 motionPath
  const sparkTl = gsap.timeline({ repeat: -1 })
  sparkTl.to(arcSparkRef.value, {
    opacity: 0.2,
    scale: 0.5,
    duration: 0.3,
    ease: 'power2.in'
  })
  sparkTl.to(arcSparkRef.value, {
    opacity: 1,
    scale: 1.5,
    duration: 0.3,
    ease: 'power2.out'
  })
  sparkTl.to(arcSparkRef.value, {
    opacity: 0.5,
    scale: 1,
    duration: 0.3,
    ease: 'power2.inOut'
  })

  cleanupFns.push(() => sparkTl.kill())
}

function triggerPulse() {
  if (isPulseActive || !pulseLayerRef.value || !productRef.value) return
  isPulseActive = true

  const rings = pulseLayerRef.value.querySelectorAll('.pulse-ring')
  const tl = gsap.timeline({
    onComplete: () => {
      isPulseActive = false
      gsap.set(rings, { scale: 0, opacity: 0 })
    }
  })

  rings.forEach((ring, i) => {
    tl.to(ring, {
      scale: 4,
      opacity: 0.8 - i * 0.15,
      duration: 0.8,
      ease: 'power2.out',
      delay: i * 0.1
    }, 0)

    tl.to(ring, {
      opacity: 0,
      duration: 0.5
    }, 0.3)
  })

  // 产品上弹
  tl.to(productRef.value, {
    y: -50,
    duration: 0.3,
    ease: 'power2.out'
  }, 0)

  tl.to(productRef.value, {
    y: 0,
    duration: 1,
    ease: 'elastic.out(1, 0.5)'
  }, 0.3)
}

function initClickInteraction() {
  if (!chargerBaseRef.value) return

  chargerBaseRef.value.addEventListener('click', triggerPulse)
  cleanupFns.push(() => {
    chargerBaseRef.value?.removeEventListener('click', triggerPulse)
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

      // 更新阶段文字
      if (stageTextRef.value) {
        if (progress < 0.25) {
          stageTextRef.value.textContent = 'CHARGING'
        } else if (progress < 0.75) {
          stageTextRef.value.textContent = 'ACTIVE'
        } else {
          stageTextRef.value.textContent = 'COMPLETING'
        }
      }

      // 更新进度条
      if (progressBarRef.value) {
        const fill = progressBarRef.value.querySelector('.progress-fill')
        if (fill) {
          gsap.to(fill, { scaleX: progress, duration: 0.1 })
        }
      }

      // 更新数值
      if (powerValueRef.value) {
        const power = Math.min(100, Math.round(progress * 120))
        powerValueRef.value.textContent = `${power}%`
      }

      if (efficiencyRef.value) {
        const eff = Math.min(98, Math.round(60 + progress * 40))
        efficiencyRef.value.textContent = `${eff}%`
      }
    }
  })
}

onMounted(() => {
  initAnimations()
  initMouseInteraction()
  initEnergyRings()
  initArcAnimation()
  initClickInteraction()
  initScrollProgress()
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style scoped lang="scss">
.wireless-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0a1a2a 100%);
  overflow: hidden;
  perspective: 1000px;
}

// 深空背景
.wireless-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.bg-particle {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 70%);
  animation: particleTwinkle 3s ease-in-out infinite;
}

@keyframes particleTwinkle {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

.nebula-halo {
  position: absolute;
  width: 600px;
  height: 600px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, rgba(0, 245, 255, 0.08) 40%, transparent 70%);
  animation: nebulaPulse 6s ease-in-out infinite;
}

@keyframes nebulaPulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
  50% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
}

// 底座层
.charger-base {
  position: absolute;
  bottom: 20%;
  left: 50%;
  transform: translateX(-50%);
  width: 280px;
  height: 80px;
  transform-style: preserve-3d;
}

.base-body {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%) translateZ(50px);
  width: 260px;
  height: 60px;
  background: linear-gradient(180deg, #2a2a3a 0%, #1a1a2a 100%);
  border-radius: 130px / 30px;
  box-shadow:
    0 5px 30px rgba(0, 245, 255, 0.3),
    inset 0 2px 10px rgba(255, 255, 255, 0.1),
    inset 0 -5px 20px rgba(0, 0, 0, 0.5);
}

.base-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 180px;
  height: 35px;
  border: 2px solid rgba(0, 245, 255, 0.5);
  border-radius: 90px / 17px;
  animation: ringPulse 2s ease-in-out infinite;
}

@keyframes ringPulse {
  0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 1; transform: translate(-50%, -50%) scale(1.05); }
}

.base-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  background: radial-gradient(circle, #00f5ff 0%, #0088aa 100%);
  border-radius: 50%;
  box-shadow: 0 0 30px rgba(0, 245, 255, 0.8);
}

.base-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 60px;
  background: radial-gradient(ellipse, rgba(0, 245, 255, 0.4) 0%, transparent 70%);
  animation: glowPulse 1.5s ease-in-out infinite;
}

@keyframes glowPulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

// 能量环
.energy-rings {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%) translateZ(40px);
  width: 240px;
  height: 70px;
  pointer-events: none;
}

.ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  border: 1px solid;
  opacity: 0.4;
}

.ring-1 {
  width: 200px;
  height: 50px;
  border-color: #00f5ff;
  animation: ringExpand 3s ease-out infinite;
}

.ring-2 {
  width: 220px;
  height: 55px;
  border-color: #a855f7;
  animation: ringExpand 3s ease-out infinite 1s;
}

.ring-3 {
  width: 240px;
  height: 60px;
  border-color: #00f5ff;
  animation: ringExpand 3s ease-out infinite 2s;
}

@keyframes ringExpand {
  0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.6; }
  100% { transform: translate(-50%, -50%) scale(1.3); opacity: 0; }
}

.base-aura {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 300px;
  height: 40px;
  background: radial-gradient(ellipse, rgba(0, 245, 255, 0.3) 0%, transparent 70%);
  filter: blur(10px);
}

// 光弧层
.arc-layer {
  position: absolute;
  bottom: 25%;
  left: 50%;
  transform: translateX(-50%) translateZ(25px);
  width: 200px;
  height: 300px;
  pointer-events: none;
}

.arc-svg {
  width: 100%;
  height: 100%;
}

.arc-spark {
  filter: url(#arcGlow);
}

// 产品层
.product-layer {
  position: absolute;
  top: 25%;
  left: 50%;
  transform: translateX(-50%) translateZ(150px);
  width: 220px;
  height: 380px;
  cursor: pointer;
}

.product-body {
  position: relative;
  width: 100%;
  height: 100%;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 30px;
  box-shadow:
    0 25px 80px rgba(0, 0, 0, 0.6),
    0 0 60px rgba(0, 245, 255, 0.3);
}

.product-reflection {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, transparent 30%);
  border-radius: 30px;
  pointer-events: none;
}

.product-edge-glow {
  position: absolute;
  inset: -2px;
  border-radius: 32px;
  background: linear-gradient(135deg, #00f5ff 0%, #a855f7 50%, #00f5ff 100%);
  z-index: -1;
  opacity: 0.6;
  animation: edgeGlow 2s linear infinite;
  background-size: 200% 200%;
}

@keyframes edgeGlow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.product-aura {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 260px;
  height: 420px;
  pointer-events: none;
}

.aura-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  border: 1px solid;
}

.aura-ring-1 {
  width: 240px;
  height: 400px;
  border-color: rgba(0, 245, 255, 0.3);
  animation: auraExpand 2s ease-in-out infinite;
}

.aura-ring-2 {
  width: 260px;
  height: 420px;
  border-color: rgba(168, 85, 247, 0.2);
  animation: auraExpand 2s ease-in-out infinite 0.5s;
}

@keyframes auraExpand {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.4; }
  50% { transform: translate(-50%, -50%) scale(1.05); opacity: 0.8; }
}

// 脉冲层
.pulse-layer {
  position: absolute;
  bottom: 15%;
  left: 50%;
  transform: translateX(-50%);
  width: 280px;
  height: 100px;
  pointer-events: none;
}

.pulse-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 280px;
  height: 80px;
  border: 3px solid #00f5ff;
  border-radius: 50%;
  opacity: 0;
  box-shadow: 0 0 30px rgba(0, 245, 255, 0.5);
}

// 信息面板
.info-panel {
  position: absolute;
  right: 8%;
  top: 50%;
  transform: translateY(-50%);
  padding: 30px;
  background: rgba(10, 10, 26, 0.8);
  border: 1px solid rgba(0, 245, 255, 0.3);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  max-width: 280px;
}

.panel-tag {
  display: inline-block;
  padding: 6px 12px;
  background: linear-gradient(90deg, #00f5ff, #a855f7);
  border-radius: 20px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
  color: #0a0a1a;
  margin-bottom: 16px;
}

.panel-title {
  font-size: 28px;
  font-weight: 800;
  color: #fff;
  margin: 0 0 8px;
  background: linear-gradient(90deg, #fff, #00f5ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.panel-subtitle {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 24px;
}

.status-bar {
  display: flex;
  gap: 24px;
}

.status-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.status-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.status-value {
  font-size: 20px;
  font-weight: 700;
  color: #00f5ff;
}

// 磁吸指示器
.magnet-indicator {
  position: absolute;
  left: 8%;
  bottom: 15%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  background: rgba(10, 10, 26, 0.8);
  border: 1px solid rgba(168, 85, 247, 0.3);
  border-radius: 30px;
  backdrop-filter: blur(10px);
}

.magnet-icon {
  width: 24px;
  height: 24px;

  svg {
    width: 100%;
    height: 100%;
  }
}

.magnet-text {
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 1px;
}

// 阶段指示
.stage-indicator {
  position: absolute;
  left: 50%;
  bottom: 5%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.stage-text {
  font-size: 12px;
  font-weight: 700;
  color: #00f5ff;
  letter-spacing: 3px;
}

.progress-bar {
  width: 200px;
  height: 3px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #00f5ff, #a855f7);
  transform-origin: left;
  transform: scaleX(0);
}
</style>
