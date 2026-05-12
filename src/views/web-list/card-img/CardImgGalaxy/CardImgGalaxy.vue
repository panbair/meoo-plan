<template>
  <div class="galaxy-container" ref="containerRef">
    <!-- SVG 滤镜定义 -->
    <svg class="galaxy-filters" aria-hidden="true">
      <defs>
        <filter id="lensDistortion">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.01 0.01"
            numOctaves="2"
            seed="10"
            result="turbulence"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="turbulence"
            scale="15"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
        <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="rgba(255, 255, 255, 0.8)" />
          <stop offset="30%" stop-color="rgba(180, 160, 255, 0.4)" />
          <stop offset="60%" stop-color="rgba(100, 80, 180, 0.2)" />
          <stop offset="100%" stop-color="transparent" />
        </radialGradient>
      </defs>
    </svg>

    <!-- 深层：外围暗尘带 -->
    <div class="dust-layer" ref="dustLayerRef">
      <img
        class="dust-image"
        src="https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&q=80"
        alt=""
      />
      <div class="dust-overlay" />
    </div>

    <!-- 中层：旋臂 -->
    <div class="spiral-layer" ref="spiralLayerRef">
      <img
        class="spiral-image"
        src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=80"
        alt=""
      />
      <div class="spiral-overlay" />
    </div>

    <!-- 核心盘面 -->
    <div class="core-layer" ref="coreLayerRef">
      <img
        class="core-image"
        src="https://images.unsplash.com/photo-1534996858221-380b92700493?w=1920&q=80"
        alt=""
      />
      <div class="core-glow" />
    </div>

    <!-- 光粒层 -->
    <div class="particle-layer" ref="particleLayerRef">
      <div
        v-for="i in 100"
        :key="i"
        class="star-particle"
        :ref="el => { if (el) particleRefs[i] = el as HTMLElement }"
        :style="getParticleStyle(i)"
      />
    </div>

    <!-- 引力透镜效果 -->
    <div class="lens-effect" ref="lensRef" />

    <!-- 顶部标签 -->
    <div class="galaxy-badge" ref="badgeRef">
      <div class="badge-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" />
          <ellipse cx="12" cy="12" rx="10" ry="4" />
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
        </svg>
      </div>
      <span>GALACTIC SPIRAL</span>
    </div>

    <!-- 信息面板 -->
    <div class="galaxy-info" ref="infoRef">
      <div class="info-tag">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
        <span>SPIRAL ARM</span>
      </div>
      <h2 class="info-title">Stellar Vortex</h2>
      <p class="info-desc">Journey through the cosmic spiral arms</p>
      <div class="info-stats">
        <div class="stat">
          <span class="stat-value">100B</span>
          <span class="stat-label">Stars</span>
        </div>
        <div class="stat">
          <span class="stat-value">50k</span>
          <span class="stat-label">Light Years</span>
        </div>
        <div class="stat">
          <span class="stat-value">220</span>
          <span class="stat-label">km/s</span>
        </div>
      </div>
    </div>

    <!-- 进度条 -->
    <div class="galaxy-progress" ref="progressRef">
      <div class="progress-bar">
        <div ref="progressFillRef" class="progress-fill" />
      </div>
      <div class="progress-labels">
        <span>COSMIC VOYAGE</span>
        <span class="progress-value">0%</span>
      </div>
    </div>

    <!-- 鼠标引力光晕 -->
    <div class="gravity-halo" ref="haloRef">
      <div class="halo-ring ring-1" />
      <div class="halo-ring ring-2" />
      <div class="halo-core" />
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
const dustLayerRef = ref<HTMLElement | null>(null)
const spiralLayerRef = ref<HTMLElement | null>(null)
const coreLayerRef = ref<HTMLElement | null>(null)
const particleLayerRef = ref<HTMLElement | null>(null)
const particleRefs: Record<number, HTMLElement> = {}
const lensRef = ref<HTMLElement | null>(null)
const badgeRef = ref<HTMLElement | null>(null)
const infoRef = ref<HTMLElement | null>(null)
const progressRef = ref<HTMLElement | null>(null)
const progressFillRef = ref<HTMLElement | null>(null)
const haloRef = ref<HTMLElement | null>(null)

let mouseX = 0
let mouseY = 0
let particleTicker: ((...args: unknown[]) => void) | null = null

const getParticleStyle = (i: number) => {
  const angle = (i * 137.5) % 360
  const radius = 100 + (i * 23) % 300
  const x = 50 + Math.cos((angle * Math.PI) / 180) * (radius / 5)
  const y = 50 + Math.sin((angle * Math.PI) / 180) * (radius / 5)
  const size = 1 + (i % 4) * 0.5
  const delay = (i * 0.1) % 3
  const duration = 4 + (i % 4)
  const brightness = 0.6 + (i % 5) * 0.08

  return {
    left: `${x}%`,
    top: `${y}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    filter: `brightness(${brightness})`
  }
}

function initAnimations() {
  if (!containerRef.value) return

  // 初始状态设置
  gsap.set(dustLayerRef.value, {
    rotation: 0,
    scale: 1,
    filter: 'brightness(0.3) saturate(0.5)'
  })
  gsap.set(spiralLayerRef.value, {
    rotation: 0,
    scale: 1,
    filter: 'brightness(0.5) saturate(0.8)'
  })
  gsap.set(coreLayerRef.value, {
    rotation: 0,
    scale: 1,
    filter: 'brightness(0.7)'
  })
  gsap.set(particleLayerRef.value, { opacity: 0.8 })
  gsap.set(lensRef.value, { opacity: 0, scale: 0 })

  gsap.set(badgeRef.value, { opacity: 0, y: -40 })
  gsap.set(infoRef.value, { opacity: 0, x: -60 })
  gsap.set(progressRef.value, { opacity: 0, y: 30 })
  gsap.set(haloRef.value, { opacity: 0, scale: 0 })

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

  tl.to(haloRef.value, {
    opacity: 1,
    scale: 1,
    duration: 0.15,
    ease: 'back.out(2)'
  }, 0.06)

  // 螺旋旋转视差 (15-85%)
  // 外围暗尘带 - 最快 (0.15系数)
  tl.to(dustLayerRef.value, {
    rotation: 540,
    scale: 0.85,
    duration: 0.7
  }, 0.15)

  // 中层旋臂 - 中速 (0.08系数)
  tl.to(spiralLayerRef.value, {
    rotation: 300,
    scale: 1.1,
    duration: 0.7
  }, 0.15)

  // 核心盘面 - 最慢 (0.03系数)
  tl.to(coreLayerRef.value, {
    rotation: 120,
    scale: 1.15,
    duration: 0.7
  }, 0.15)

  // 色相漂移 - 深靛与冷紫之间
  tl.to([dustLayerRef.value, spiralLayerRef.value], {
    filter: 'hue-rotate(-30deg) saturate(1.2)',
    duration: 0.35
  }, 0.3)

  tl.to([dustLayerRef.value, spiralLayerRef.value], {
    filter: 'hue-rotate(20deg) saturate(1)',
    duration: 0.35
  }, 0.6)

  // 粒子层呼吸
  tl.to(particleLayerRef.value, {
    opacity: 1,
    scale: 1.05,
    duration: 0.25,
    ease: 'sine.inOut'
  }, 0.3)

  tl.to(particleLayerRef.value, {
    opacity: 0.7,
    scale: 0.95,
    duration: 0.25,
    ease: 'sine.inOut'
  }, 0.5)

  // 引力透镜效果
  tl.to(lensRef.value, {
    opacity: 0.4,
    scale: 1.2,
    duration: 0.2
  }, 0.4)

  tl.to(lensRef.value, {
    opacity: 0,
    scale: 0.5,
    duration: 0.2
  }, 0.6)

  // 回卷动画 (85-100%)
  tl.to(dustLayerRef.value, {
    rotation: 0,
    scale: 1,
    filter: 'brightness(0.3) saturate(0.5)',
    duration: 0.15
  }, 0.85)

  tl.to(spiralLayerRef.value, {
    rotation: 0,
    scale: 1,
    filter: 'brightness(0.5) saturate(0.8)',
    duration: 0.15
  }, 0.85)

  tl.to(coreLayerRef.value, {
    rotation: 0,
    scale: 1,
    duration: 0.15
  }, 0.85)

  tl.to([badgeRef.value, infoRef.value, progressRef.value, haloRef.value], {
    opacity: 0,
    duration: 0.1
  }, 0.88)
}

function initParticleDrift() {
  particleTicker = () => {
    Object.values(particleRefs).forEach((particle, index) => {
      if (!particle) return
      const time = Date.now() * 0.0005
      const angle = (time + index * 0.5) * Math.PI
      const driftX = Math.cos(angle) * 3
      const driftY = Math.sin(angle * 0.7) * 2
      gsap.set(particle, {
        x: driftX,
        y: driftY
      })
    })
  }

  gsap.ticker.add(particleTicker)
  cleanupFns.push(() => {
    if (particleTicker) {
      gsap.ticker.remove(particleTicker)
    }
  })
}

function initMouseInteraction() {
  if (!haloRef.value || !spiralLayerRef.value || !coreLayerRef.value) return

  const handleMouseMove = (e: MouseEvent) => {
    if (!containerRef.value) return
    const rect = containerRef.value.getBoundingClientRect()
    mouseX = e.clientX - rect.left
    mouseY = e.clientY - rect.top

    // 引力光晕跟随
    gsap.to(haloRef.value, {
      x: mouseX - 50,
      y: mouseY - 50,
      duration: 0.4,
      ease: 'power2.out'
    })

    // 引力透镜效果 - 星点向中心弯曲
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const dx = mouseX - centerX
    const dy = mouseY - centerY

    gsap.to(spiralLayerRef.value, {
      x: dx * 0.02,
      y: dy * 0.02,
      duration: 0.5,
      ease: 'power2.out'
    })

    gsap.to(coreLayerRef.value, {
      x: dx * 0.01,
      y: dy * 0.01,
      duration: 0.4,
      ease: 'power2.out'
    })

    // 粒子受扰动向四周扩散
    Object.values(particleRefs).forEach((particle) => {
      if (!particle) return
      const particleRect = particle.getBoundingClientRect()
      const particleX = particleRect.left - rect.left
      const particleY = particleRect.top - rect.top
      const pdx = particleX - mouseX
      const pdy = particleY - mouseY
      const dist = Math.sqrt(pdx * pdx + pdy * pdy)
      if (dist < 150) {
        const force = (150 - dist) / 150 * 20
        gsap.to(particle, {
          x: pdx / dist * force,
          y: pdy / dist * force,
          duration: 0.6,
          ease: 'power2.out'
        })
      }
    })

    // 光晕脉冲
    gsap.to(haloRef.value, {
      scale: 1.3,
      duration: 0.2,
      ease: 'power2.out',
      overwrite: 'auto'
    })
  }

  const handleMouseLeave = () => {
    gsap.to(haloRef.value, { opacity: 0, scale: 0, duration: 0.3 })
    gsap.to(spiralLayerRef.value, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.5)' })
    gsap.to(coreLayerRef.value, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' })

    // 粒子恢复
    Object.values(particleRefs).forEach((particle) => {
      if (!particle) return
      gsap.to(particle, {
        x: 0,
        y: 0,
        duration: 1.5,
        ease: 'elastic.out(1, 0.5)'
      })
    })
  }

  const handleMouseEnter = () => {
    gsap.to(haloRef.value, { opacity: 1, scale: 1, duration: 0.3 })
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
  initParticleDrift()
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
.galaxy-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(180deg, #0a0812 0%, #12101a 40%, #0d0a14 70%, #080610 100%);
  overflow: hidden;
}

.galaxy-filters {
  position: absolute;
  width: 0;
  height: 0;
  pointer-events: none;
}

// 外围暗尘带 - 远层
.dust-layer {
  position: absolute;
  inset: -20%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  pointer-events: none;
}

.dust-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.3) saturate(0.5) contrast(1.2);
}

.dust-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at center,
    transparent 20%,
    rgba(10, 8, 18, 0.7) 60%,
    rgba(10, 8, 18, 0.95) 100%
  );
}

// 中层旋臂
.spiral-layer {
  position: absolute;
  inset: -15%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  pointer-events: none;
  mix-blend-mode: screen;
}

.spiral-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.5) saturate(0.8) contrast(1.1);
}

.spiral-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at center,
    rgba(100, 80, 180, 0.1) 0%,
    rgba(60, 40, 120, 0.05) 40%,
    transparent 70%
  );
}

// 核心盘面
.core-layer {
  position: absolute;
  inset: -10%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
  pointer-events: none;
}

.core-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.7) contrast(1.1);
}

.core-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at center,
    rgba(255, 255, 255, 0.4) 0%,
    rgba(180, 160, 255, 0.2) 20%,
    rgba(100, 80, 180, 0.1) 40%,
    transparent 60%
  );
  filter: blur(20px);
}

// 光粒层
.particle-layer {
  position: absolute;
  inset: 0;
  z-index: 15;
  pointer-events: none;
}

.star-particle {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.9) 0%,
    rgba(200, 220, 255, 0.5) 40%,
    rgba(150, 180, 255, 0.2) 70%,
    transparent 100%
  );
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.6);
  animation: starTwinkle ease-in-out infinite;
}

@keyframes starTwinkle {
  0%, 100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.5);
  }
}

// 引力透镜效果
.lens-effect {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 400px;
  height: 400px;
  background: radial-gradient(
    circle,
    rgba(180, 160, 255, 0.15) 0%,
    rgba(100, 80, 200, 0.08) 30%,
    transparent 70%
  );
  filter: blur(30px);
  transform: translate(-50%, -50%);
  z-index: 12;
  pointer-events: none;
  mix-blend-mode: screen;
}

// 顶部标签
.galaxy-badge {
  position: absolute;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 28px;
  background: rgba(100, 80, 180, 0.2);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(180, 160, 255, 0.3);
  border-radius: 60px;
  z-index: 30;
}

.badge-icon {
  width: 22px;
  height: 22px;
  color: #b4a0ff;

  svg {
    width: 100%;
    height: 100%;
  }
}

.galaxy-badge span {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 3px;
  color: #b4a0ff;
}

// 信息面板
.galaxy-info {
  position: absolute;
  bottom: 120px;
  left: 50px;
  padding: 30px;
  background: rgba(10, 8, 18, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(180, 160, 255, 0.2);
  border-radius: 24px;
  max-width: 340px;
  z-index: 30;
}

.info-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(180, 160, 255, 0.8);
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
  color: #fff;
  margin: 0 0 12px;
  background: linear-gradient(135deg, #fff 0%, #b4a0ff 50%, #c8b4ff 100%);
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
  color: #c8b4ff;
}

.stat-label {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 1px;
}

// 进度条
.galaxy-progress {
  position: absolute;
  bottom: 50px;
  right: 50px;
  width: 200px;
  z-index: 30;
}

.progress-bar {
  height: 3px;
  background: rgba(180, 160, 255, 0.15);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-fill {
  height: 100%;
  width: 100%;
  background: linear-gradient(90deg, #fff 0%, #b4a0ff 50%, #c8b4ff 100%);
  border-radius: 2px;
  transform-origin: left;
  box-shadow: 0 0 12px rgba(180, 160, 255, 0.5);
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  letter-spacing: 1.5px;
  color: rgba(180, 160, 255, 0.5);
}

.progress-value {
  color: #c8b4ff;
}

// 鼠标引力光晕
.gravity-halo {
  position: absolute;
  width: 100px;
  height: 100px;
  pointer-events: none;
  z-index: 50;
  opacity: 0;
}

.halo-ring {
  position: absolute;
  inset: 0;
  border: 1px solid rgba(180, 160, 255, 0.4);
  border-radius: 50%;
  transform-origin: center;

  &.ring-1 {
    animation: haloExpand 1.5s ease-out infinite;
  }

  &.ring-2 {
    animation: haloExpand 1.5s ease-out infinite 0.4s;
  }
}

@keyframes haloExpand {
  0% {
    transform: scale(0.4);
    opacity: 0.6;
  }
  100% {
    transform: scale(1.4);
    opacity: 0;
  }
}

.halo-core {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 16px;
  height: 16px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(180, 160, 255, 0.4) 100%);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 25px rgba(180, 160, 255, 0.6);
}
</style>
