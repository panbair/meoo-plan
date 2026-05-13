<template>
  <section ref="parentRef" class="stardust-container">
    <!-- 深空背景 -->
    <div class="cosmic-bg">
      <div class="nebula"></div>
      <div class="stars"></div>
    </div>

    <!-- 图片底层 -->
    <div class="base-layer">
      <img :src="imageUrl" alt="" class="base-img" />
    </div>

    <!-- 星尘粒子层 -->
    <div ref="particlesRef" class="particles-layer">
      <div
        v-for="(particle, index) in particles"
        :key="index"
        :ref="(el) => setParticleRef(el, index)"
        class="particle"
        :style="{
          '--px': `${particle.posX}%`,
          '--py': `${particle.posY}%`,
          '--bx': `${-particle.gridX * 100}%`,
          '--by': `${-particle.gridY * 100}%`,
        }"
      >
        <img :src="imageUrl" alt="" class="particle-img" />
        <div class="particle-glow"></div>
      </div>
    </div>

    <!-- 中心引力场 -->
    <div ref="gravityFieldRef" class="gravity-field">
      <div class="gravity-ring ring-1"></div>
      <div class="gravity-ring ring-2"></div>
      <div class="gravity-ring ring-3"></div>
      <div class="gravity-core"></div>
    </div>

    <!-- 丝线 -->
    <div class="filaments">
      <svg class="filament-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path v-for="i in 8" :key="i" :d="filamentPaths[i - 1]" class="filament-path" />
      </svg>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void

const parentRef = ref<HTMLElement | null>(null)
const particlesRef = ref<HTMLElement | null>(null)
const gravityFieldRef = ref<HTMLElement | null>(null)

const particleRefs: HTMLElement[] = []
const cleanupFns: TweenCleanup[] = []

// 配置
const COLS = 8
const ROWS = 6
const CENTER_X = (COLS - 1) / 2
const CENTER_Y = (ROWS - 1) / 2

// 宇宙星云图片
const imageUrl = 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&q=80'

interface Particle {
  gridX: number
  gridY: number
  posX: number
  posY: number
  scatterX: number
  scatterY: number
  rotation: number
  delay: number
  layer: number
}

const particles = reactive<Particle[]>([])

// 生成丝线路径
const filamentPaths = computed(() => {
  const paths: string[] = []
  for (let i = 0; i < 8; i++) {
    const startX = 50 + Math.cos(i * Math.PI / 4) * 40
    const startY = 50 + Math.sin(i * Math.PI / 4) * 40
    const endX = 50 + Math.cos(i * Math.PI / 4 + 0.3) * 10
    const endY = 50 + Math.sin(i * Math.PI / 4 + 0.3) * 10
    const ctrlX = 50 + Math.cos(i * Math.PI / 4 + 0.15) * 25
    const ctrlY = 50 + Math.sin(i * Math.PI / 4 + 0.15) * 25
    paths.push(`M ${startX} ${startY} Q ${ctrlX} ${ctrlY} ${endX} ${endY}`)
  }
  return paths
})

let seed = 88888
const random = () => {
  seed = (seed * 9301 + 49297) % 233280
  return seed / 233280
}
const randRange = (min: number, max: number) => min + random() * (max - min)

const initParticles = () => {
  particles.length = 0
  seed = 88888

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const dx = col - CENTER_X + 0.5
      const dy = row - CENTER_Y + 0.5
      const dist = Math.sqrt(dx * dx + dy * dy)
      const layer = Math.ceil(dist)
      const angle = Math.atan2(dy, dx)

      // 边缘粒子散射更远
      const edgeRatio = dist / Math.sqrt(CENTER_X * CENTER_X + CENTER_Y * CENTER_Y)
      const scatterMag = 80 + edgeRatio * 120

      particles.push({
        gridX: col,
        gridY: row,
        posX: col * (100 / COLS),
        posY: row * (100 / ROWS),
        scatterX: Math.cos(angle) * scatterMag + randRange(-30, 30),
        scatterY: Math.sin(angle) * scatterMag + randRange(-30, 30),
        rotation: randRange(-20, 20),
        delay: layer * 0.15,
        layer,
      })
    }
  }
}

const setParticleRef = (el: Element | null, index: number) => {
  if (el) particleRefs[index] = el as HTMLElement
}

onMounted(() => {
  if (!parentRef.value) return
  initParticles()
  requestAnimationFrame(() => setupAnimations())
})

const setupAnimations = () => {
  if (!parentRef.value || !particlesRef.value) return

  // ========== 阶段1: 初始布朗运动 ==========
  const brownianFns: (() => void)[] = []
  
  particles.forEach((particle, idx) => {
    const el = particleRefs[idx]
    if (!el) return

    // 初始散射位置
    gsap.set(el, {
      x: particle.scatterX,
      y: particle.scatterY,
      rotation: particle.rotation,
      opacity: 0.3,
      scale: 0.9,
    })

    // 布朗运动漂移
    let brownianX = particle.scatterX
    let brownianY = particle.scatterY
    let brownianRot = particle.rotation

    const brownian = () => {
      brownianX += randRange(-3, 3)
      brownianY += randRange(-2, 2)
      brownianRot += randRange(-1, 1)
      
      gsap.to(el, {
        x: brownianX,
        y: brownianY,
        rotation: brownianRot,
        duration: 0.8,
        ease: 'sine.inOut',
        onComplete: brownian,
      })
    }
    brownian()
    brownianFns.push(() => gsap.killTweensOf(el))
  })

  // ========== 阶段2: 引力吸引 ==========
  const attractTl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 85%',
      end: 'center center',
      scrub: 2,
    },
  })

  // 引力场显现
  if (gravityFieldRef.value) {
    gsap.set(gravityFieldRef.value, { opacity: 0, scale: 0.8 })
    attractTl.to(gravityFieldRef.value, {
      opacity: 1,
      scale: 1,
      duration: 0.5,
    }, 0)
  }

  // 引力环旋转
  const rings = gravityFieldRef.value?.querySelectorAll('.gravity-ring')
  rings?.forEach((ring, i) => {
    gsap.set(ring, { rotation: 0 })
    const ringAnim = gsap.to(ring, {
      rotation: 360 * (i % 2 === 0 ? 1 : -1),
      duration: 8 - i * 1.5,
      repeat: -1,
      ease: 'none',
    })
    cleanupFns.push(() => ringAnim.kill())
  })

  // 粒子向心聚合
  particles.forEach((particle, idx) => {
    const el = particleRefs[idx]
    if (!el) return

    // 主聚合动画
    attractTl.to(el, {
      x: 0,
      y: 0,
      rotation: 0,
      opacity: 1,
      scale: 1,
      duration: 3,
      ease: 'power3.inOut',
    }, particle.delay * 0.5)

    // 粒子发光
    const glow = el.querySelector('.particle-glow') as HTMLElement
    if (glow) {
      gsap.set(glow, { opacity: 0 })
      attractTl.fromTo(glow,
        { opacity: 0 },
        { opacity: 0.8, duration: 0.3 },
        particle.delay * 0.5 + 2.5
      )
      attractTl.to(glow,
        { opacity: 0, duration: 0.4 },
        particle.delay * 0.5 + 2.8
      )
    }
  })

  // 丝线显现
  const filaments = parentRef.value?.querySelectorAll('.filament-path')
  filaments?.forEach((path, i) => {
    gsap.set(path, { strokeDashoffset: 100, opacity: 0 })
    attractTl.to(path, {
      strokeDashoffset: 0,
      opacity: 0.6,
      duration: 1.5,
      ease: 'power2.out',
    }, i * 0.1)
    attractTl.to(path, {
      opacity: 0,
      duration: 1,
    }, 2.5 + i * 0.1)
  })

  // 引力场消失
  if (gravityFieldRef.value) {
    attractTl.to(gravityFieldRef.value, {
      opacity: 0,
      scale: 1.5,
      duration: 0.8,
    }, 2.8)
  }

  // 停止布朗运动
  setTimeout(() => brownianFns.forEach((fn) => fn()), 500)
  cleanupFns.push(() => brownianFns.forEach((fn) => fn()))

  cleanupFns.push(() => attractTl.scrollTrigger?.kill())
  cleanupFns.push(() => attractTl.kill())

  // ========== 阶段3: 最终显现 ==========
  const revealTl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'center center',
      end: 'bottom top',
      scrub: 1,
    },
  })

  // 图片亮度渐亮
  const baseImg = parentRef.value.querySelector('.base-img') as HTMLElement
  if (baseImg) {
    gsap.set(baseImg, { filter: 'brightness(0.6) contrast(1.1)' })
    revealTl.to(baseImg, {
      filter: 'brightness(1) contrast(1)',
      duration: 1,
      ease: 'power2.out',
    }, 0)
  }
}

onUnmounted(() => {
  cleanupFns.forEach((fn) => fn())
  ScrollTrigger.getAll().forEach((st) => st.kill())
  gsap.killTweensOf('*')
})
</script>

<style scoped lang="scss">
.stardust-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #030308;
}

// 深空背景
.cosmic-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 50%, #080818 0%, #03030a 60%, #010106 100%);

  .nebula {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 30% 35%, rgba(100, 80, 180, 0.25) 0%, transparent 45%),
      radial-gradient(ellipse at 70% 65%, rgba(80, 100, 200, 0.2) 0%, transparent 40%),
      radial-gradient(ellipse at 50% 50%, rgba(120, 100, 200, 0.15) 0%, transparent 55%);
  }

  .stars {
    position: absolute;
    inset: 0;
    background-image:
      radial-gradient(1.5px 1.5px at 15% 25%, rgba(255, 255, 255, 0.8), transparent),
      radial-gradient(1px 1px at 35% 55%, rgba(200, 210, 255, 0.6), transparent),
      radial-gradient(1.5px 1.5px at 55% 15%, rgba(255, 255, 255, 0.7), transparent),
      radial-gradient(1px 1px at 75% 75%, rgba(180, 200, 255, 0.5), transparent),
      radial-gradient(1px 1px at 85% 35%, rgba(255, 255, 255, 0.6), transparent),
      radial-gradient(1.5px 1.5px at 25% 85%, rgba(200, 220, 255, 0.7), transparent),
      radial-gradient(1px 1px at 45% 45%, rgba(180, 200, 255, 0.5), transparent),
      radial-gradient(1px 1px at 65% 85%, rgba(255, 255, 255, 0.4), transparent);
  }
}

// 图片底层
.base-layer {
  position: absolute;
  inset: 0;
  z-index: 1;

  .base-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.6) contrast(1.1);
  }
}

// 粒子层
.particles-layer {
  position: absolute;
  inset: 0;
  z-index: 10;
  perspective: 2500px;
}

// 单个粒子
.particle {
  position: absolute;
  width: calc(100% / 8);
  height: calc(100% / 6);
  left: var(--px);
  top: var(--py);
  transform-style: preserve-3d;
  will-change: transform, opacity;

  .particle-img {
    position: absolute;
    width: calc(100% * 8);
    height: calc(100% * 6);
    left: var(--bx);
    top: var(--by);
    object-fit: cover;
    filter: brightness(1.15) saturate(1.2);
  }

  .particle-glow {
    position: absolute;
    inset: -4px;
    background: radial-gradient(
      circle at center,
      rgba(200, 220, 255, 0.9) 0%,
      rgba(150, 180, 255, 0.5) 40%,
      transparent 70%
    );
    mix-blend-mode: screen;
  }
}

// 引力场
.gravity-field {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 400px;
  height: 400px;
  transform: translate(-50%, -50%);
  z-index: 15;
  pointer-events: none;
  mix-blend-mode: screen;

  .gravity-ring {
    position: absolute;
    top: 50%;
    left: 50%;
    border-radius: 50%;
    border: 1px solid rgba(180, 200, 255, 0.25);
    transform: translate(-50%, -50%);
  }

  .ring-1 {
    width: 200px;
    height: 200px;
    box-shadow:
      0 0 30px rgba(150, 180, 255, 0.3),
      inset 0 0 30px rgba(150, 180, 255, 0.2);
  }

  .ring-2 {
    width: 320px;
    height: 320px;
    border-color: rgba(150, 180, 255, 0.15);
    box-shadow:
      0 0 50px rgba(150, 180, 255, 0.2),
      inset 0 0 50px rgba(150, 180, 255, 0.15);
  }

  .ring-3 {
    width: 440px;
    height: 440px;
    border-color: rgba(150, 180, 255, 0.1);
    box-shadow:
      0 0 70px rgba(150, 180, 255, 0.15),
      inset 0 0 70px rgba(150, 180, 255, 0.1);
  }

  .gravity-core {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 60px;
    height: 60px;
    transform: translate(-50%, -50%);
    background: radial-gradient(
      circle,
      rgba(220, 235, 255, 1) 0%,
      rgba(180, 210, 255, 0.8) 30%,
      rgba(150, 180, 255, 0.4) 60%,
      transparent 80%
    );
    border-radius: 50%;
    filter: blur(3px);
    box-shadow:
      0 0 40px rgba(180, 200, 255, 0.8),
      0 0 80px rgba(150, 180, 255, 0.5);
  }
}

// 丝线
.filaments {
  position: absolute;
  inset: 0;
  z-index: 20;
  pointer-events: none;
  opacity: 0.8;

  .filament-svg {
    width: 100%;
    height: 100%;
  }

  .filament-path {
    fill: none;
    stroke: rgba(200, 220, 255, 0.6);
    stroke-width: 0.3;
    stroke-dasharray: 100;
    stroke-dashoffset: 100;
    filter: blur(0.5px);
  }
}
</style>
