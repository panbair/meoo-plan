<template>
  <div ref="containerRef" class="bloom-container">
    <!-- 深色背景 -->
    <div ref="bgRef" class="bloom-bg">
      <div class="bg-gradient" />
      <div class="bg-particles">
        <div v-for="i in 30" :key="i" class="bg-dot" :style="getDotStyle(i)" />
      </div>
    </div>

    <!-- 背景光晕 -->
    <div ref="glowRef" class="center-glow" />

    <!-- 花瓣容器 -->
    <div ref="petalContainerRef" class="petal-container">
      <!-- 12 片花瓣，每片包含图像片段 -->
      <div
        v-for="i in 12"
        :key="i"
        :ref="el => setPetalRef(el, i)"
        class="petal"
        :class="`petal-${i}`"
      >
        <div class="petal-content">
          <img
            class="petal-image"
            :src="`https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80`"
            alt=""
          />
          <div class="petal-blur" />
        </div>
        <div class="petal-shine" />
      </div>
    </div>

    <!-- 全局图像层 -->
    <div ref="globalImageRef" class="global-image-layer">
      <img
        class="main-image"
        src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1920&q=80"
        alt="Flowers"
      />
      <div ref="globalBlurRef" class="global-blur-overlay" />
    </div>

    <!-- 花蕊中心 -->
    <div ref="centerRef" class="bloom-center">
      <div class="center-core" />
      <div class="center-pulse" />
    </div>

    <!-- 花粉粒子 -->
    <div ref="pollenLayerRef" class="pollen-layer">
      <div v-for="i in 25" :key="i" class="pollen" :style="getPollenStyle(i)" />
    </div>

    <!-- 花丝纹理 -->
    <div ref="filamentRef" class="filament-overlay">
      <div v-for="i in 8" :key="i" class="filament-line" :class="`filament-${i}`" />
    </div>

    <!-- 信息面板 -->
    <div ref="infoPanelRef" class="info-panel">
      <div class="panel-tag">NATURE EFFECTS</div>
      <h2 ref="titleRef" class="panel-title">Petal Bloom</h2>
      <p ref="subtitleRef" class="panel-subtitle">Organic Unfolding Animation</p>
      <div ref="stageRef" class="panel-stage">
        <span ref="stageTextRef" class="stage-text">DORMANT</span>
        <div class="stage-bar">
          <div ref="stageFillRef" class="stage-fill" />
        </div>
      </div>
    </div>

    <!-- 露珠光泽 -->
    <div ref="dewDropRef" class="dew-drop-layer">
      <div v-for="i in 6" :key="i" class="dew-drop" :class="`dew-${i}`" />
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
const glowRef = ref<HTMLElement | null>(null)
const petalContainerRef = ref<HTMLElement | null>(null)
const globalImageRef = ref<HTMLElement | null>(null)
const globalBlurRef = ref<HTMLElement | null>(null)
const centerRef = ref<HTMLElement | null>(null)
const pollenLayerRef = ref<HTMLElement | null>(null)
const filamentRef = ref<HTMLElement | null>(null)
const infoPanelRef = ref<HTMLElement | null>(null)
const stageRef = ref<HTMLElement | null>(null)
const stageTextRef = ref<HTMLElement | null>(null)
const stageFillRef = ref<HTMLElement | null>(null)
const dewDropRef = ref<HTMLElement | null>(null)

const petalRefs: (HTMLElement | null)[] = []

function setPetalRef(el: any, index: number) {
  petalRefs[index - 1] = el as HTMLElement | null
}

let mouseX = 0
let mouseY = 0

function getDotStyle(index: number) {
  const size = Math.random() * 2 + 1
  const x = Math.random() * 100
  const y = Math.random() * 100
  const delay = Math.random() * 3
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${x}%`,
    top: `${y}%`,
    animationDelay: `${delay}s`
  }
}

function getPollenStyle(index: number) {
  const size = Math.random() * 2 + 1
  const x = 20 + Math.random() * 60
  const y = 30 + Math.random() * 40
  const duration = 6 + Math.random() * 4
  const delay = Math.random() * 4
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

  // 初始状态 - 花苞紧闭
  petalRefs.forEach((petal, i) => {
    if (petal) {
      const angle = (360 / 12) * i
      gsap.set(petal, {
        rotation: angle,
        scale: 0.15,
        opacity: 1,
        transformOrigin: 'center bottom'
      })
    }
  })

  gsap.set(centerRef.value, { scale: 0, opacity: 0 })
  gsap.set(glowRef.value, { scale: 0.3, opacity: 0 })
  gsap.set(globalImageRef.value, { scale: 0.4, opacity: 0 })
  gsap.set(globalBlurRef.value, { opacity: 0.8 })
  gsap.set(pollenLayerRef.value, { opacity: 0 })
  gsap.set(filamentRef.value, { opacity: 0 })
  gsap.set(dewDropRef.value, { opacity: 0 })
  gsap.set('.petal-blur', { opacity: 0.7 })

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: containerRef.value,
      start: 'top 100%',
      end: 'bottom -100%',
      scrub: 1.5
    }
  })

  cleanupFns.push(() => tl.kill())

  // 萌芽阶段 (0-20%)
  // 中心光晕出现
  tl.to(glowRef.value, {
    scale: 1,
    opacity: 1,
    duration: 0.15,
    ease: 'power2.out'
  }, 0)

  // 中心花蕊显现
  tl.to(centerRef.value, {
    scale: 1,
    opacity: 1,
    duration: 0.12,
    ease: 'back.out(1.7)'
  }, 0.05)

  // 全局图像显现
  tl.to(globalImageRef.value, {
    scale: 0.5,
    opacity: 1,
    duration: 0.15
  }, 0.08)

  // 花丝纹理
  tl.to(filamentRef.value, {
    opacity: 0.6,
    duration: 0.1
  }, 0.1)

  // 绽放阶段 (20-70%) - 花瓣逐层展开
  // 外层花瓣 (1-4) 最先展开
  const outerPetalDelay = 0.2
  for (let i = 0; i < 4; i++) {
    if (petalRefs[i]) {
      tl.to(petalRefs[i], {
        rotation: (360 / 12) * i + 15,
        scale: 1,
        opacity: 0.9,
        duration: 0.15,
        ease: 'power2.out'
      }, outerPetalDelay + i * 0.04)
    }
  }

  // 中层花瓣 (5-8)
  const midPetalDelay = 0.32
  for (let i = 4; i < 8; i++) {
    if (petalRefs[i]) {
      tl.to(petalRefs[i], {
        rotation: (360 / 12) * i + 10,
        scale: 1,
        opacity: 0.85,
        duration: 0.12,
        ease: 'power2.out'
      }, midPetalDelay + (i - 4) * 0.04)
    }
  }

  // 内层花瓣 (9-12)
  const innerPetalDelay = 0.42
  for (let i = 8; i < 12; i++) {
    if (petalRefs[i]) {
      tl.to(petalRefs[i], {
        rotation: (360 / 12) * i + 5,
        scale: 1,
        opacity: 0.8,
        duration: 0.1,
        ease: 'power2.out'
      }, innerPetalDelay + (i - 8) * 0.03)
    }
  }

  // 图像渐显
  tl.to(globalImageRef.value, {
    scale: 0.8,
    duration: 0.3,
    ease: 'power2.inOut'
  }, 0.25)

  // 模糊逐渐消失
  tl.to(globalBlurRef.value, {
    opacity: 0.3,
    duration: 0.25
  }, 0.3)

  tl.to(globalBlurRef.value, {
    opacity: 0,
    duration: 0.2
  }, 0.55)

  // 花瓣模糊消失
  tl.to('.petal-blur', {
    opacity: 0,
    duration: 0.25
  }, 0.5)

  // 盛开阶段 (70-85%)
  // 图像完全显现
  tl.to(globalImageRef.value, {
    scale: 1,
    duration: 0.15,
    ease: 'power2.out'
  }, 0.7)

  // 花粉粒子出现
  tl.to(pollenLayerRef.value, {
    opacity: 1,
    duration: 0.1
  }, 0.72)

  // 花丝消失
  tl.to(filamentRef.value, {
    opacity: 0,
    duration: 0.1
  }, 0.75)

  // 露珠光泽
  tl.to(dewDropRef.value, {
    opacity: 1,
    duration: 0.08
  }, 0.73)

  // 信息面板
  tl.fromTo(infoPanelRef.value,
    { opacity: 0, x: 80 },
    { opacity: 1, x: 0, duration: 0.12 },
    0.65
  )

  // 凋零阶段 (85-100%)
  // 花瓣收拢
  tl.to(petalRefs.slice(0, 4), {
    scale: 0.6,
    opacity: 0.3,
    rotation: '+=-20',
    stagger: 0.02,
    duration: 0.12,
    ease: 'power2.in'
  }, 0.85)

  tl.to(petalRefs.slice(4, 8), {
    scale: 0.5,
    opacity: 0.2,
    rotation: '+=-15',
    stagger: 0.02,
    duration: 0.1,
    ease: 'power2.in'
  }, 0.88)

  tl.to(petalRefs.slice(8, 12), {
    scale: 0.4,
    opacity: 0.1,
    rotation: '+=-10',
    stagger: 0.02,
    duration: 0.08,
    ease: 'power2.in'
  }, 0.91)

  // 图像淡出
  tl.to(globalImageRef.value, {
    scale: 0.6,
    opacity: 0,
    filter: 'blur(8px)',
    duration: 0.1,
    ease: 'power2.in'
  }, 0.88)

  // 中心收拢
  tl.to(centerRef.value, {
    scale: 0,
    opacity: 0,
    duration: 0.08
  }, 0.93)

  // 光晕消失
  tl.to(glowRef.value, {
    scale: 0.2,
    opacity: 0,
    duration: 0.08
  }, 0.94)

  // 花粉消失
  tl.to(pollenLayerRef.value, {
    opacity: 0,
    duration: 0.08
  }, 0.9)
}

function initPollenAnimation() {
  if (!pollenLayerRef.value) return

  const pollenElements = pollenLayerRef.value.querySelectorAll('.pollen')

  pollenElements.forEach((pollen, i) => {
    const tl = gsap.timeline({ repeat: -1 })

    tl.to(pollen, {
      y: -80 - Math.random() * 60,
      x: `+=${Math.random() * 40 - 20}`,
      rotation: Math.random() * 360,
      opacity: 0.3,
      duration: 5 + Math.random() * 4,
      ease: 'none'
    })

    tl.to(pollen, {
      y: 0,
      x: `+=${Math.random() * 30 - 15}`,
      rotation: Math.random() * 360,
      opacity: 0.8,
      duration: 3 + Math.random() * 2,
      ease: 'power2.in'
    })

    cleanupFns.push(() => tl.kill())
  })
}

function initMouseSway() {
  if (!containerRef.value) return

  const handleMouseMove = (e: MouseEvent) => {
    const rect = containerRef.value!.getBoundingClientRect()
    mouseX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2)
    mouseY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2)
  }

  containerRef.value.addEventListener('mousemove', handleMouseMove)
  cleanupFns.push(() => {
    containerRef.value?.removeEventListener('mousemove', handleMouseMove)
  })

  // 花瓣随风起伏
  petalRefs.forEach((petal, i) => {
    if (petal) {
      gsap.to(petal, {
        rotateY: () => mouseX * 8,
        rotateX: () => -mouseY * 5,
        duration: 1.2,
        ease: 'power2.out'
      })
    }
  })
}

function initCenterPulse() {
  if (!centerRef.value) return

  gsap.to('.center-pulse', {
    scale: 1.5,
    opacity: 0,
    duration: 2,
    repeat: -1,
    ease: 'power2.out'
  })

  cleanupFns.push(() => {
    gsap.killTweensOf('.center-pulse')
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
        if (progress < 0.2) {
          stageTextRef.value.textContent = 'DORMANT'
        } else if (progress < 0.7) {
          stageTextRef.value.textContent = 'BLOOMING'
        } else if (progress < 0.85) {
          stageTextRef.value.textContent = 'FULL BLOOM'
        } else {
          stageTextRef.value.textContent = 'FADING'
        }
      }

      // 更新进度条
      if (stageFillRef.value) {
        gsap.to(stageFillRef.value, { scaleX: progress, duration: 0.1 })
      }
    }
  })
}

onMounted(() => {
  initAnimations()
  initPollenAnimation()
  initMouseSway()
  initCenterPulse()
  initScrollProgress()
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style scoped lang="scss">
.bloom-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #0a1a0a 0%, #1a2a1a 50%, #0a1a10 100%);
  overflow: hidden;
  perspective: 1200px;
}

// 背景
.bloom-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.bg-gradient {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 30% 20%, rgba(100, 200, 100, 0.05) 0%, transparent 40%),
    radial-gradient(ellipse at 70% 80%, rgba(150, 100, 200, 0.05) 0%, transparent 40%);
}

.bg-particles {
  position: absolute;
  inset: 0;
}

.bg-dot {
  position: absolute;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, transparent 70%);
  border-radius: 50%;
  animation: dotTwinkle 4s ease-in-out infinite;
}

@keyframes dotTwinkle {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.6; }
}

// 中心光晕
.center-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 400px;
  height: 400px;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(255, 200, 150, 0.15) 0%, rgba(100, 200, 100, 0.08) 40%, transparent 70%);
  border-radius: 50%;
  filter: blur(30px);
  pointer-events: none;
}

// 花瓣容器
.petal-container {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 600px;
  height: 600px;
  transform: translate(-50%, -50%);
  transform-style: preserve-3d;
  pointer-events: none;
}

.petal {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 280px;
  height: 280px;
  margin-left: -140px;
  margin-top: -280px;
  transform-origin: center bottom;
  overflow: hidden;
}

.petal-content {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50% 50% 50% 50% / 80% 80% 20% 20%;
  overflow: hidden;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.3);
}

.petal-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.petal-blur {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
}

.petal-shine {
  position: absolute;
  top: 10%;
  left: 20%;
  width: 30%;
  height: 20%;
  background: radial-gradient(ellipse, rgba(255, 255, 255, 0.4) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

// 花瓣旋转角度
@for $i from 1 through 12 {
  .petal-#{$i} {
    transform: rotate((($i - 1) * 30) * 1deg);
  }
}

// 全局图像层
.global-image-layer {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 65%;
  max-width: 800px;
  aspect-ratio: 1;
  transform: translate(-50%, -50%);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 30px 100px rgba(0, 0, 0, 0.6);
  z-index: 5;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform-origin: center;
}

.global-blur-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 30%, rgba(0, 0, 0, 0.7) 100%);
  pointer-events: none;
}

// 中心花蕊
.bloom-center {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80px;
  height: 80px;
  transform: translate(-50%, -50%);
  z-index: 10;
}

.center-core {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 40px;
  height: 40px;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, #ffd700 0%, #ff8c00 50%, transparent 70%);
  border-radius: 50%;
  box-shadow: 0 0 30px rgba(255, 200, 0, 0.5);
}

.center-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 60px;
  height: 60px;
  transform: translate(-50%, -50%);
  border: 2px solid rgba(255, 200, 0, 0.3);
  border-radius: 50%;
}

// 花粉粒子
.pollen-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 15;
}

.pollen {
  position: absolute;
  background: radial-gradient(circle, rgba(255, 255, 200, 0.8) 0%, transparent 70%);
  border-radius: 50%;
  animation: pollenFloat 8s ease-in-out infinite;
}

@keyframes pollenFloat {
  0%, 100% {
    opacity: 0;
    transform: translate(0, 0) rotate(0deg);
  }
  20% {
    opacity: 0.8;
  }
  80% {
    opacity: 0.5;
  }
}

// 花丝纹理
.filament-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 8;
}

.filament-line {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1px;
  height: 35%;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%);
  transform-origin: top center;
}

@for $i from 1 through 8 {
  .filament-#{$i} {
    transform: rotate((($i - 1) * 45) * 1deg);
  }
}

// 信息面板
.info-panel {
  position: absolute;
  right: 6%;
  top: 50%;
  transform: translateY(-50%);
  padding: 24px 28px;
  background: rgba(10, 20, 10, 0.9);
  border: 1px solid rgba(100, 200, 100, 0.2);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  z-index: 20;
  max-width: 220px;
}

.panel-tag {
  display: inline-block;
  padding: 4px 10px;
  background: linear-gradient(90deg, #22c55e, #16a34a);
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
  background: linear-gradient(90deg, #fff, #86efac);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.panel-subtitle {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0 0 16px;
}

.panel-stage {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.stage-text {
  font-size: 10px;
  font-weight: 600;
  color: #86efac;
  letter-spacing: 2px;
}

.stage-bar {
  width: 100%;
  height: 3px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.stage-fill {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #22c55e, #86efac);
  transform-origin: left;
  transform: scaleX(0);
}

// 露珠光泽
.dew-drop-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 18;
}

.dew-drop {
  position: absolute;
  width: 4px;
  height: 4px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.3) 50%, transparent 70%);
  border-radius: 50%;
  animation: dewShine 3s ease-in-out infinite;

  &.dew-1 { top: 25%; left: 35%; animation-delay: 0s; }
  &.dew-2 { top: 30%; right: 38%; animation-delay: 0.5s; }
  &.dew-3 { top: 40%; left: 25%; animation-delay: 1s; }
  &.dew-4 { top: 45%; right: 30%; animation-delay: 1.5s; }
  &.dew-5 { top: 35%; left: 45%; animation-delay: 2s; }
  &.dew-6 { top: 50%; right: 42%; animation-delay: 2.5s; }
}

@keyframes dewShine {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.3); }
}
</style>
