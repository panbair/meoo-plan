<template>
  <div class="tyndall-container" ref="containerRef">
    <!-- SVG 滤镜定义 -->
    <svg class="tyndall-filters" aria-hidden="true">
      <defs>
        <filter id="dustGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="beamBlur">
          <feGaussianBlur stdDeviation="8" />
        </filter>
        <linearGradient id="beamGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="rgba(255, 250, 240, 0.4)" />
          <stop offset="50%" stop-color="rgba(200, 220, 255, 0.2)" />
          <stop offset="100%" stop-color="rgba(100, 150, 200, 0)" />
        </linearGradient>
        <linearGradient id="beamGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="rgba(255, 245, 230, 0.3)" />
          <stop offset="50%" stop-color="rgba(255, 220, 180, 0.15)" />
          <stop offset="100%" stop-color="rgba(200, 150, 100, 0)" />
        </linearGradient>
      </defs>
    </svg>

    <!-- 深层背景：极暗的密林剪影 -->
    <div class="forest-layer" ref="forestLayerRef">
      <img
        class="forest-image"
        src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&q=80"
        alt=""
      />
      <div class="forest-overlay" />
    </div>

    <!-- 中层：斜射光柱 -->
    <div class="beam-layer" ref="beamLayerRef">
      <div class="beam beam-1" ref="beam1Ref" />
      <div class="beam beam-2" ref="beam2Ref" />
      <div class="beam beam-3" ref="beam3Ref" />
      <div class="beam-glow" />
    </div>

    <!-- 近层：微尘粒子 -->
    <div class="dust-layer" ref="dustLayerRef">
      <div
        v-for="i in 150"
        :key="i"
        class="dust-particle"
        :ref="el => { if (el) dustRefs[i] = el as HTMLElement }"
        :style="getDustStyle(i)"
      />
    </div>

    <!-- 光柱光晕 -->
    <div class="beam-halo" ref="haloRef" />

    <!-- 顶部标签 -->
    <div class="tyndall-badge" ref="badgeRef">
      <div class="badge-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
          <circle cx="12" cy="12" r="4" />
        </svg>
      </div>
      <span>TYNDALL LIGHT</span>
    </div>

    <!-- 信息面板 -->
    <div class="tyndall-info" ref="infoRef">
      <div class="info-tag">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
        <span>LIGHT SCATTERING</span>
      </div>
      <h2 class="info-title">Dusty Rays</h2>
      <p class="info-desc">Witness the divine light piercing through darkness</p>
      <div class="info-stats">
        <div class="stat">
          <span class="stat-value">450nm</span>
          <span class="stat-label">Wavelength</span>
        </div>
        <div class="stat">
          <span class="stat-value">∞</span>
          <span class="stat-label">Particles</span>
        </div>
        <div class="stat">
          <span class="stat-value">45°</span>
          <span class="stat-label">Angle</span>
        </div>
      </div>
    </div>

    <!-- 进度条 -->
    <div class="tyndall-progress" ref="progressRef">
      <div class="progress-bar">
        <div ref="progressFillRef" class="progress-fill" />
      </div>
      <div class="progress-labels">
        <span>DUSTY ATMOSPHERE</span>
        <span class="progress-value">0%</span>
      </div>
    </div>

    <!-- 鼠标光晕 -->
    <div class="cursor-glow" ref="cursorGlowRef">
      <div class="glow-ring" />
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
const forestLayerRef = ref<HTMLElement | null>(null)
const beamLayerRef = ref<HTMLElement | null>(null)
const beam1Ref = ref<HTMLElement | null>(null)
const beam2Ref = ref<HTMLElement | null>(null)
const beam3Ref = ref<HTMLElement | null>(null)
const dustLayerRef = ref<HTMLElement | null>(null)
const dustRefs: Record<number, HTMLElement> = {}
const haloRef = ref<HTMLElement | null>(null)
const badgeRef = ref<HTMLElement | null>(null)
const infoRef = ref<HTMLElement | null>(null)
const progressRef = ref<HTMLElement | null>(null)
const progressFillRef = ref<HTMLElement | null>(null)
const cursorGlowRef = ref<HTMLElement | null>(null)

let mouseX = 0
let mouseY = 0
let dustTickerCallback: ((...args: unknown[]) => void) | null = null

const getDustStyle = (i: number) => {
  const x = (i * 29 + Math.random() * 20) % 100
  const y = (i * 37 + Math.random() * 15) % 100
  const size = 1 + (i % 3) * 0.5
  const delay = (i * 0.15) % 5
  const duration = 8 + (i % 6) * 2
  const brightness = 0.5 + (i % 5) * 0.1

  return {
    left: `${x}%`,
    top: `${y}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    opacity: 0.3 + (i % 4) * 0.1,
    filter: `brightness(${brightness})`
  }
}

function initAnimations() {
  if (!containerRef.value) return

  // 初始状态设置
  gsap.set(forestLayerRef.value, { y: 0, filter: 'brightness(0.15) saturate(0.3)' })
  gsap.set(beamLayerRef.value, { y: 0, rotation: -15, x: 0 })
  gsap.set([beam1Ref.value, beam2Ref.value, beam3Ref.value], { opacity: 0.6, skewX: 0 })
  gsap.set(dustLayerRef.value, { y: 0, opacity: 0.8 })
  gsap.set(haloRef.value, { opacity: 0, scale: 0.5 })

  gsap.set(badgeRef.value, { opacity: 0, y: -40 })
  gsap.set(infoRef.value, { opacity: 0, x: -60 })
  gsap.set(progressRef.value, { opacity: 0, y: 30 })
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

  tl.to(cursorGlowRef.value, {
    opacity: 1,
    scale: 1,
    duration: 0.15,
    ease: 'back.out(2)'
  }, 0.06)

  // 视差漂移 (15-85%)
  // 森林层 - 几乎静止 (0.02系数)
  tl.to(forestLayerRef.value, {
    y: -50,
    duration: 0.7
  }, 0.15)

  // 光柱层 - 缓慢移动 (0.1系数)
  tl.to(beamLayerRef.value, {
    y: -250,
    rotation: -10,
    duration: 0.7
  }, 0.15)

  tl.to(beam1Ref.value, {
    opacity: 0.8,
    skewX: 5,
    duration: 0.35
  }, 0.3)

  tl.to(beam1Ref.value, {
    opacity: 0.5,
    skewX: -3,
    duration: 0.35
  }, 0.6)

  tl.to(beam2Ref.value, {
    opacity: 0.7,
    duration: 0.4
  }, 0.25)

  tl.to(beam3Ref.value, {
    opacity: 0.6,
    duration: 0.4
  }, 0.45)

  // 微尘层 - 较快上升 (0.25系数)
  tl.to(dustLayerRef.value, {
    y: -600,
    opacity: 1,
    duration: 0.7
  }, 0.15)

  // 光晕呼吸
  tl.to(haloRef.value, {
    opacity: 0.6,
    scale: 1.2,
    duration: 0.25,
    ease: 'sine.inOut'
  }, 0.3)

  tl.to(haloRef.value, {
    opacity: 0.3,
    scale: 0.8,
    duration: 0.25,
    ease: 'sine.inOut'
  }, 0.5)

  // 色相循环 - 青灰到暖金
  tl.to(beamLayerRef.value, {
    filter: 'hue-rotate(-20deg) saturate(1.3)',
    duration: 0.35
  }, 0.3)

  tl.to(beamLayerRef.value, {
    filter: 'hue-rotate(0deg) saturate(1)',
    duration: 0.35
  }, 0.6)

  // 回卷动画 (85-100%)
  tl.to(forestLayerRef.value, {
    y: 0,
    duration: 0.15
  }, 0.85)

  tl.to(beamLayerRef.value, {
    y: 0,
    rotation: -15,
    duration: 0.15
  }, 0.85)

  tl.to(dustLayerRef.value, {
    y: 0,
    opacity: 0.8,
    duration: 0.15
  }, 0.85)

  tl.to([badgeRef.value, infoRef.value, progressRef.value, cursorGlowRef.value], {
    opacity: 0,
    duration: 0.1
  }, 0.88)
}

function initDustAnimation() {
  // 微尘粒子持续上浮动画
  dustTickerCallback = () => {
    Object.values(dustRefs).forEach((particle, index) => {
      if (!particle) return
      const time = Date.now() * 0.001
      const offsetX = Math.sin(time + index * 0.5) * 2
      const offsetY = Math.cos(time * 0.7 + index * 0.3) * 1.5
      gsap.set(particle, {
        x: offsetX,
        y: offsetY
      })
    })
  }

  gsap.ticker.add(dustTickerCallback)
  cleanupFns.push(() => {
    if (dustTickerCallback) {
      gsap.ticker.remove(dustTickerCallback)
    }
  })
}

function initMouseInteraction() {
  if (!cursorGlowRef.value || !beamLayerRef.value || !dustLayerRef.value) return

  const handleMouseMove = (e: MouseEvent) => {
    if (!containerRef.value) return
    const rect = containerRef.value.getBoundingClientRect()
    mouseX = e.clientX - rect.left
    mouseY = e.clientY - rect.top

    // 光晕跟随
    gsap.to(cursorGlowRef.value, {
      x: mouseX - 60,
      y: mouseY - 60,
      duration: 0.4,
      ease: 'power2.out'
    })

    // 光柱微幅偏转
    gsap.to(beamLayerRef.value, {
      x: (mouseX - rect.width / 2) * 0.02,
      duration: 0.6,
      ease: 'power2.out'
    })

    // 微尘粒子受扰动向外飘散
    Object.values(dustRefs).forEach((particle) => {
      if (!particle) return
      const rect = particle.getBoundingClientRect()
      const particleX = rect.left - containerRef.value!.getBoundingClientRect().left
      const particleY = rect.top - containerRef.value!.getBoundingClientRect().top
      const dx = particleX - mouseX
      const dy = particleY - mouseY
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 200) {
        const force = (200 - dist) / 200 * 30
        gsap.to(particle, {
          x: dx / dist * force,
          y: dy / dist * force - 10,
          duration: 0.5,
          ease: 'power2.out'
        })
      }
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
    gsap.to(beamLayerRef.value, { x: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' })
    
    // 微尘粒子恢复
    Object.values(dustRefs).forEach((particle) => {
      if (!particle) return
      gsap.to(particle, {
        x: 0,
        y: 0,
        duration: 1.2,
        ease: 'elastic.out(1, 0.5)'
      })
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

function initProgressAnimation() {
  ScrollTrigger.create({
    trigger: containerRef.value,
    start: 'top 100%',
    end: 'bottom 20%',
    onUpdate: (self) => {
      if (progressFillRef.value) {
        gsap.to(progressFillRef.value, { scaleX: self.progress, duration: 0.1 })
      }
    }
  })
}

onMounted(() => {
  initAnimations()
  initDustAnimation()
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
.tyndall-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(180deg, #0a0e14 0%, #0d1219 40%, #111820 70%, #0a0e14 100%);
  overflow: hidden;
}

.tyndall-filters {
  position: absolute;
  width: 0;
  height: 0;
  pointer-events: none;
}

// 森林层 - 远层极暗剪影
.forest-layer {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.forest-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.15) saturate(0.3) contrast(1.2);
}

.forest-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(10, 14, 20, 0.8) 0%,
    rgba(10, 14, 20, 0.4) 30%,
    rgba(10, 14, 20, 0.2) 60%,
    rgba(10, 14, 20, 0.9) 100%
  );
}

// 光柱层 - 中层斜射光
.beam-layer {
  position: absolute;
  inset: 0;
  z-index: 10;
  pointer-events: none;
  mix-blend-mode: screen;
}

.beam {
  position: absolute;
  transform-origin: top center;

  &.beam-1 {
    top: -20%;
    left: 10%;
    width: 300px;
    height: 150%;
    background: linear-gradient(
      160deg,
      rgba(255, 250, 240, 0.35) 0%,
      rgba(200, 220, 255, 0.2) 40%,
      rgba(150, 180, 220, 0.05) 70%,
      transparent 100%
    );
    filter: blur(8px);
    transform: skewX(-15deg);
    opacity: 0.6;
  }

  &.beam-2 {
    top: -30%;
    left: 25%;
    width: 200px;
    height: 180%;
    background: linear-gradient(
      165deg,
      rgba(255, 245, 230, 0.25) 0%,
      rgba(255, 220, 180, 0.12) 50%,
      transparent 100%
    );
    filter: blur(12px);
    transform: skewX(-20deg);
    opacity: 0.5;
  }

  &.beam-3 {
    top: -15%;
    right: 20%;
    width: 250px;
    height: 160%;
    background: linear-gradient(
      155deg,
      rgba(240, 250, 255, 0.3) 0%,
      rgba(180, 210, 240, 0.15) 40%,
      transparent 100%
    );
    filter: blur(10px);
    transform: skewX(-12deg);
    opacity: 0.45;
  }
}

.beam-glow {
  position: absolute;
  top: 0;
  left: 20%;
  width: 400px;
  height: 100%;
  background: radial-gradient(
    ellipse at top,
    rgba(255, 250, 240, 0.15) 0%,
    rgba(200, 220, 255, 0.08) 30%,
    transparent 70%
  );
  filter: blur(30px);
}

// 微尘层 - 近层粒子
.dust-layer {
  position: absolute;
  inset: 0;
  z-index: 15;
  pointer-events: none;
}

.dust-particle {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.9) 0%,
    rgba(255, 250, 230, 0.5) 40%,
    rgba(200, 220, 255, 0.2) 70%,
    transparent 100%
  );
  box-shadow: 0 0 4px rgba(255, 255, 255, 0.5);
  animation: dustFloat ease-in-out infinite;
}

@keyframes dustFloat {
  0%, 100% {
    transform: translateY(0) translateX(0);
    opacity: 0.4;
  }
  50% {
    transform: translateY(-20px) translateX(5px);
    opacity: 0.8;
  }
}

// 光柱光晕
.beam-halo {
  position: absolute;
  top: 5%;
  left: 15%;
  width: 500px;
  height: 600px;
  background: radial-gradient(
    ellipse at center,
    rgba(255, 250, 240, 0.2) 0%,
    rgba(200, 220, 255, 0.1) 30%,
    transparent 70%
  );
  filter: blur(40px);
  z-index: 12;
  pointer-events: none;
  mix-blend-mode: screen;
}

// 顶部标签
.tyndall-badge {
  position: absolute;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 28px;
  background: rgba(255, 250, 240, 0.1);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 250, 240, 0.2);
  border-radius: 60px;
  z-index: 30;
}

.badge-icon {
  width: 22px;
  height: 22px;
  color: #fff8f0;

  svg {
    width: 100%;
    height: 100%;
  }
}

.tyndall-badge span {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 3px;
  color: #fff8f0;
}

// 信息面板
.tyndall-info {
  position: absolute;
  bottom: 120px;
  left: 50px;
  padding: 30px;
  background: rgba(10, 14, 20, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 250, 240, 0.15);
  border-radius: 24px;
  max-width: 340px;
  z-index: 30;
}

.info-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(200, 220, 255, 0.8);
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
  color: #fff8f0;
  margin: 0 0 12px;
  background: linear-gradient(135deg, #fff8f0 0%, #c8dcff 50%, #ffe4c4 100%);
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
  color: #c8dcff;
}

.stat-label {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 1px;
}

// 进度条
.tyndall-progress {
  position: absolute;
  bottom: 50px;
  right: 50px;
  width: 200px;
  z-index: 30;
}

.progress-bar {
  height: 3px;
  background: rgba(255, 250, 240, 0.1);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-fill {
  height: 100%;
  width: 100%;
  background: linear-gradient(90deg, #fff8f0 0%, #c8dcff 50%, #ffe4c4 100%);
  border-radius: 2px;
  transform-origin: left;
  box-shadow: 0 0 12px rgba(255, 250, 240, 0.5);
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  letter-spacing: 1.5px;
  color: rgba(255, 250, 240, 0.5);
}

.progress-value {
  color: #c8dcff;
}

// 鼠标光晕
.cursor-glow {
  position: absolute;
  width: 120px;
  height: 120px;
  pointer-events: none;
  z-index: 50;
  opacity: 0;
}

.glow-ring {
  position: absolute;
  inset: 0;
  border: 2px solid rgba(255, 250, 240, 0.3);
  border-radius: 50%;
  animation: glowPulse 2s ease-out infinite;

  &::before {
    content: '';
    position: absolute;
    inset: 10px;
    border: 1px solid rgba(200, 220, 255, 0.3);
    border-radius: 50%;
  }

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    background: radial-gradient(circle, rgba(255, 250, 240, 0.6) 0%, transparent 70%);
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }
}

@keyframes glowPulse {
  0% {
    transform: scale(0.8);
    opacity: 0.6;
  }
  100% {
    transform: scale(1.3);
    opacity: 0;
  }
}
</style>
