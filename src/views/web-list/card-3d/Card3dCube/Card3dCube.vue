<template>
  <section ref="sectionRef" class="cube-section">
    <!-- 背景层 -->
    <div class="cube-bg">
      <div class="bg-grid"></div>
      <div class="bg-glow bg-glow-1"></div>
      <div class="bg-glow bg-glow-2"></div>
    </div>

    <!-- 星空背景 -->
    <div class="starfield">
      <div
        v-for="i in 40"
        :key="i"
        :ref="el => { if (el) starRefs[i - 1] = el as HTMLElement }"
        class="star"
      ></div>
    </div>

    <!-- 标题区 -->
    <div ref="titleRef" class="cube-title">
      <span class="title-badge">HYPERCUBE</span>
      <h2 class="title-text">超维立方</h2>
      <p class="subtitle">3D Cube · CSS Transforms · Scroll Collapse</p>
    </div>

    <!-- 3D立方体容器 -->
    <div ref="cubeContainerRef" class="cube-container">
      <!-- 立方体核心 -->
      <div ref="cubeCoreRef" class="cube-core">
        <!-- 6个面：前、后、左、右、上、下 -->
        <div
          v-for="(face, index) in cubeFaces"
          :key="face.id"
          :ref="el => { if (el) cubeCardsRef[index] = el as HTMLElement }"
          class="cube-face"
          :class="`face-${face.name}`"
        >
          <div class="face-inner">
            <div class="face-bg" :style="{ background: face.gradient }"></div>
            <div class="face-content">
              <div class="face-icon" v-html="face.icon"></div>
              <h3 class="face-title">{{ face.title }}</h3>
              <p class="face-desc">{{ face.description }}</p>
            </div>
            <div class="face-border"></div>
            <div class="face-shine"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 粒子效果 -->
    <canvas ref="particleCanvasRef" class="particle-canvas"></canvas>

    <!-- 折叠指示器 -->
    <div ref="foldIndicatorRef" class="fold-indicator">
      <div class="indicator-arrow">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
      </div>
      <span class="indicator-text">SCROLL TO UNFOLD</span>
    </div>

    <!-- 进度指示 -->
    <div ref="progressRef" class="cube-progress">
      <div class="progress-ring">
        <svg viewBox="0 0 100 100">
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#00f2fe"/>
              <stop offset="100%" stop-color="#764ba2"/>
            </linearGradient>
          </defs>
          <circle
            class="progress-bg"
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke-width="4"
          />
          <circle
            ref="progressCircleRef"
            class="progress-fill"
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke-width="4"
            stroke-linecap="round"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="progressOffset"
          />
        </svg>
      </div>
      <span class="progress-value">{{ Math.round(currentProgress * 100) }}%</span>
    </div>

    <!-- 折叠线装饰 -->
    <div class="fold-lines">
      <div class="fold-line fold-line-1"></div>
      <div class="fold-line fold-line-2"></div>
      <div class="fold-line fold-line-3"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ==================== 类型定义 ====================
interface CubeFace {
  id: number
  name: string
  title: string
  description: string
  icon: string
  gradient: string
  color: string
}

// ==================== Refs ====================
const sectionRef = ref<HTMLElement>()
const cubeContainerRef = ref<HTMLElement>()
const cubeCoreRef = ref<HTMLElement>()
const titleRef = ref<HTMLElement>()
const particleCanvasRef = ref<HTMLCanvasElement>()
const foldIndicatorRef = ref<HTMLElement>()
const progressRef = ref<HTMLElement>()
const progressCircleRef = ref<SVGElement>()
const cubeCardsRef = ref<HTMLElement[]>([])
const starRefs = ref<HTMLElement[]>([])

// ==================== 状态 ====================
const currentProgress = ref(0)
const circumference = 2 * Math.PI * 45
const progressOffset = computed(() => circumference * (1 - currentProgress.value))

const cubeFaces = reactive<CubeFace[]>([
  {
    id: 1,
    name: 'front',
    title: '时间之门前端',
    description: '穿越时空的门扉',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#667eea'
  },
  {
    id: 2,
    name: 'back',
    title: '维度背面',
    description: '未知的空间背面',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/><path d="M9 12l2 2 4-4"/></svg>',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    color: '#f5576c'
  },
  {
    id: 3,
    name: 'left',
    title: '空间左侧',
    description: '向左的维度延伸',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    color: '#00f2fe'
  },
  {
    id: 4,
    name: 'right',
    title: '空间右侧',
    description: '向右的维度探索',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    color: '#fee140'
  },
  {
    id: 5,
    name: 'top',
    title: '超维顶端',
    description: '俯瞰所有维度',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l10 10-10 10L2 12z"/></svg>',
    gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    color: '#fbc2eb'
  },
  {
    id: 6,
    name: 'bottom',
    title: '深渊底端',
    description: '无尽的深渊凝视',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>',
    gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    color: '#330867'
  }
])

// ==================== 粒子系统 ====================
let particleCtx: CanvasRenderingContext2D | null = null
let particles: Array<{
  x: number
  y: number
  z: number
  vx: number
  vy: number
  vz: number
  size: number
  color: string
  alpha: number
}> = []
let particleAnimId: number | null = null

function initParticles() {
  const canvas = particleCanvasRef.value
  if (!canvas) return

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  particleCtx = canvas.getContext('2d')

  const colors = ['#667eea', '#764ba2', '#00f2fe', '#f5576c', '#fee140']

  particles = Array.from({ length: 80 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    z: Math.random() * 200 - 100,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    vz: (Math.random() - 0.5) * 0.3,
    size: Math.random() * 3 + 1,
    color: colors[Math.floor(Math.random() * colors.length)],
    alpha: Math.random() * 0.5 + 0.3
  }))
}

function animateParticles(progress: number) {
  if (!particleCtx || !particleCanvasRef.value) return

  const canvas = particleCanvasRef.value
  particleCtx.clearRect(0, 0, canvas.width, canvas.height)

  particles.forEach(p => {
    p.x += p.vx * (1 + progress)
    p.y += p.vy * (1 + progress)
    p.z += p.vz

    if (p.z > 200 || p.z < -200) p.vz *= -1
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1

    const scale = 1 + p.z / 200
    const screenX = (p.x - canvas.width / 2) * scale + canvas.width / 2
    const screenY = (p.y - canvas.height / 2) * scale + canvas.height / 2

    particleCtx!.beginPath()
    particleCtx!.arc(screenX, screenY, p.size * scale, 0, Math.PI * 2)
    particleCtx!.fillStyle = p.color
    particleCtx!.globalAlpha = p.alpha * (1 - Math.abs(p.z) / 200)
    particleCtx!.fill()
  })

  particleCtx.globalAlpha = 1
}

function killParticles() {
  if (particleAnimId !== null) {
    cancelAnimationFrame(particleAnimId)
    particleAnimId = null
  }
}

// ==================== 动画控制 ====================
let cubeTimeline: gsap.core.Timeline | null = null
let scrollTriggers: ScrollTrigger[] = []

function initAnimations() {
  if (!sectionRef.value || !cubeCoreRef.value || !cubeCardsRef.value.length) return

  const core = cubeCoreRef.value
  const cards = cubeCardsRef.value

  // 开启3D空间
  gsap.set(sectionRef.value, {
    perspective: 1600,
    transformStyle: 'preserve-3d'
  })

  gsap.set(core, {
    transformStyle: 'preserve-3d',
    transformOrigin: 'center center'
  })

  // 初始状态：立方体折叠闭合
  cards.forEach((card, i) => {
    const rotateX = i < 2 ? (i === 0 ? 90 : -90) : 0
    const rotateY = i >= 2 && i < 4 ? (i === 2 ? 90 : -90) : 0
    const z = i < 2 ? 140 : (i < 4 ? 0 : 0)

    gsap.set(card, {
      position: 'absolute',
      width: '280px',
      height: '280px',
      marginLeft: '-140px',
      marginTop: '-140px',
      left: '50%',
      top: '50%',
      transformStyle: 'preserve-3d',
      backfaceVisibility: 'hidden',
      rotateX,
      rotateY,
      z,
      scale: 0.6,
      opacity: 0,
      transformOrigin: 'center center'
    })
  })

  // 创建3D折叠/展开动画
  cubeTimeline = gsap.timeline({ paused: true })

  // 第一阶段：显现
  cubeTimeline.to(cards, {
    opacity: 1,
    scale: 0.9,
    duration: 0.5,
    ease: 'power2.out'
  })

  // 第二阶段：3D炸裂展开
  cubeTimeline.to(cards, {
    x: (i: number) => {
      const offsets = [-180, 180, -180, 180, 0, 0]
      return offsets[i] || 0
    },
    y: (i: number) => {
      const offsets = [-120, -120, 120, 120, -180, 180]
      return offsets[i] || 0
    },
    z: (i: number) => {
      const offsets = [0, 0, 0, 0, 200, -200]
      return offsets[i] || 0
    },
    rotateX: 0,
    rotateY: 0,
    rotateZ: (i: number) => {
      const rotations = [-15, 15, 10, -10, 5, -5]
      return rotations[i] || 0
    },
    scale: 1,
    stagger: { each: 0.1, from: 'center' },
    duration: 1.4,
    ease: 'expo.out'
  })

  // 第三阶段：悬浮呼吸
  cubeTimeline.to(cards, {
    y: '+=20',
    rotateZ: (i: number) => (i % 2 === 0 ? 3 : -3),
    repeat: -1,
    yoyo: true,
    stagger: { each: 0.08, from: 'random' },
    duration: 2.2,
    ease: 'sine.inOut'
  }, '-=0.3')

  // ScrollTrigger 驱动
  const scrollTrigger = ScrollTrigger.create({
    trigger: sectionRef.value,
    start: 'top 80%',
    end: 'top 10%',
    scrub: 2,
    animation: cubeTimeline,
    toggleActions: 'play reverse play reverse',
    immediateRender: false,
    onUpdate: (self) => {
      currentProgress.value = self.progress
      animateParticles(self.progress)
    }
  })

  scrollTriggers.push(scrollTrigger)

  // 标题动画
  if (titleRef.value) {
    gsap.fromTo(
      titleRef.value.children,
      { opacity: 0, y: 60, rotationX: -45 },
      {
        opacity: 1,
        y: 0,
        rotationX: 0,
        stagger: 0.15,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        }
      }
    )
  }

  // 星空动画
  if (starRefs.value.length) {
    gsap.to(starRefs.value, {
      scale: 1.5,
      opacity: 0.5,
      duration: 2,
      stagger: { each: 0.05, from: 'random' },
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
  }

  // 折叠线动画
  gsap.fromTo('.fold-line', {
    scaleX: 0,
    opacity: 0
  }, {
    scaleX: 1,
    opacity: 1,
    duration: 1,
    stagger: 0.2,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 70%',
      toggleActions: 'play none none reverse'
    }
  })
}

// ==================== 生命周期 ====================
onMounted(async () => {
  await nextTick()

  initParticles()
  initAnimations()

  // 入场动画
  gsap.fromTo(
    cubeContainerRef.value,
    { opacity: 0, scale: 0.5 },
    {
      opacity: 1,
      scale: 1,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    }
  )

  // 指示器入场
  gsap.set([foldIndicatorRef.value, progressRef.value], { opacity: 0, y: 20 })
  gsap.to([foldIndicatorRef.value, progressRef.value], {
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.15,
    delay: 0.5
  })
})

onUnmounted(() => {
  // 清理 ScrollTrigger
  scrollTriggers.forEach(st => st.kill())
  scrollTriggers = []

  // 清理时间线
  if (cubeTimeline) {
    cubeTimeline.kill()
    cubeTimeline = null
  }

  // 清理粒子
  killParticles()

  // 清理所有 GSAP 动画
  ScrollTrigger.getAll().forEach(st => st.kill())
  gsap.killTweensOf('*')

  // 清理元素样式
  if (cubeCardsRef.value.length) {
    gsap.set(cubeCardsRef.value, { clearProps: 'all' })
  }
})
</script>

<style lang="scss" scoped>
// ==================== 变量 ====================
$cube-cyan: #00f2fe;
$cube-purple: #764ba2;
$cube-pink: #f5576c;
$cube-gold: #fee140;

// ==================== 主容器 ====================
.cube-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  min-height: 800px;
  overflow: hidden;
  background: linear-gradient(135deg, #0d0d1a 0%, #1a0a2e 50%, #0a1a2e 100%);
  font-family: 'Inter', -apple-system, sans-serif;
  transform-style: preserve-3d;
}

// ==================== 背景 ====================
.cube-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(102, 126, 234, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(102, 126, 234, 0.05) 1px, transparent 1px);
  background-size: 60px 60px;
  transform: perspective(500px) rotateX(60deg);
  transform-origin: center bottom;
}

.bg-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.4;

  &.bg-glow-1 {
    width: 600px;
    height: 600px;
    background: $cube-purple;
    top: -200px;
    left: -200px;
  }

  &.bg-glow-2 {
    width: 500px;
    height: 500px;
    background: $cube-cyan;
    bottom: -150px;
    right: -150px;
  }
}

// ==================== 星空 ====================
.starfield {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.star {
  position: absolute;
  width: 3px;
  height: 3px;
  background: white;
  border-radius: 50%;
  opacity: 0.6;

  @for $i from 1 through 40 {
    &:nth-child(#{$i}) {
      left: random(100) * 1%;
      top: random(100) * 1%;
      animation-delay: random(3) * 1s;
      animation-duration: (random(2) + 2) * 1s;
    }
  }

  animation: star-twinkle 3s ease-in-out infinite;

  @keyframes star-twinkle {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.3); }
  }
}

// ==================== 标题 ====================
.cube-title {
  position: absolute;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 20;
  perspective: 800px;
}

.title-badge {
  display: inline-block;
  padding: 8px 20px;
  background: linear-gradient(90deg, $cube-cyan, $cube-purple);
  border-radius: 25px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: white;
  margin-bottom: 20px;
  box-shadow: 0 4px 25px rgba($cube-cyan, 0.4);
}

.title-text {
  font-size: clamp(42px, 7vw, 72px);
  font-weight: 900;
  background: linear-gradient(135deg, white 0%, $cube-cyan 50%, $cube-purple 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 14px;
  letter-spacing: -2px;
}

.subtitle {
  font-size: 13px;
  color: rgba(white, 0.6);
  letter-spacing: 5px;
  text-transform: uppercase;
  margin: 0;
}

// ==================== 3D立方体容器 ====================
.cube-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: 400px;
  transform-style: preserve-3d;
}

.cube-core {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
}

// ==================== 立方体面 ====================
.cube-face {
  position: absolute;
  cursor: pointer;
  transform-style: preserve-3d;
  will-change: transform;
  perspective: 1000px;

  &:hover .face-inner {
    transform: translateZ(10px);
    box-shadow:
      0 20px 60px rgba(0, 0, 0, 0.4),
      0 0 40px rgba($cube-cyan, 0.3);
  }
}

.face-inner {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  overflow: hidden;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  box-shadow:
    0 10px 40px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              box-shadow 0.4s ease;
}

.face-bg {
  position: absolute;
  inset: 0;
  opacity: 0.9;
}

.face-content {
  position: relative;
  z-index: 2;
  padding: 30px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.face-icon {
  width: 44px;
  height: 44px;
  margin-bottom: 16px;
  color: white;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));

  svg {
    width: 100%;
    height: 100%;
  }
}

.face-title {
  font-size: 18px;
  font-weight: 700;
  color: white;
  margin: 0 0 8px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.face-desc {
  font-size: 12px;
  color: rgba(white, 0.8);
  margin: 0;
  line-height: 1.5;
}

.face-border {
  position: absolute;
  inset: 0;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  pointer-events: none;
}

.face-shine {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.2) 0%,
    transparent 50%,
    rgba(255, 255, 255, 0.1) 100%
  );
  pointer-events: none;
  border-radius: 20px;
}

// ==================== 粒子画布 ====================
.particle-canvas {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

// ==================== 折叠指示器 ====================
.fold-indicator {
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  z-index: 20;
}

.indicator-arrow {
  width: 30px;
  height: 30px;
  color: $cube-cyan;
  animation: bounce-arrow 2s ease-in-out infinite;

  svg {
    width: 100%;
    height: 100%;
  }

  @keyframes bounce-arrow {
    0%, 100% { transform: translateY(0); opacity: 1; }
    50% { transform: translateY(8px); opacity: 0.5; }
  }
}

.indicator-text {
  font-size: 10px;
  letter-spacing: 4px;
  color: rgba(white, 0.5);
  text-transform: uppercase;
}

// ==================== 进度指示 ====================
.cube-progress {
  position: absolute;
  bottom: 50px;
  right: 50px;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 20;
}

.progress-ring {
  width: 60px;
  height: 60px;
  transform: rotate(-90deg);
}

.progress-bg {
  stroke: rgba(255, 255, 255, 0.1);
}

.progress-fill {
  stroke: url(#progressGradient);
  transition: stroke-dashoffset 0.1s ease;
}

.progress-value {
  font-size: 14px;
  font-weight: 700;
  color: white;
  font-variant-numeric: tabular-nums;
}

// ==================== 折叠线 ====================
.fold-lines {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.fold-line {
  position: absolute;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba($cube-cyan, 0.3) 50%,
    transparent 100%
  );

  &.fold-line-1 {
    width: 100%;
    height: 1px;
    top: 33%;
    transform: scaleX(0);
  }

  &.fold-line-2 {
    width: 100%;
    height: 1px;
    top: 50%;
    transform: scaleX(0);
  }

  &.fold-line-3 {
    width: 100%;
    height: 1px;
    top: 67%;
    transform: scaleX(0);
  }
}

// ==================== 响应式 ====================
@media (max-width: 768px) {
  .cube-title {
    top: 40px;
  }

  .title-text {
    font-size: 32px;
  }

  .subtitle {
    font-size: 11px;
    letter-spacing: 3px;
  }

  .cube-container {
    width: 280px;
    height: 280px;
  }

  .cube-face {
    width: 200px !important;
    height: 200px !important;
    margin-left: -100px !important;
    margin-top: -100px !important;
  }

  .face-content {
    padding: 20px;
  }

  .face-icon {
    width: 32px;
    height: 32px;
  }

  .face-title {
    font-size: 14px;
  }

  .face-desc {
    font-size: 11px;
  }

  .cube-progress {
    bottom: 30px;
    right: 20px;
  }

  .progress-ring {
    width: 45px;
    height: 45px;
  }

  .fold-indicator {
    bottom: 30px;
  }
}
</style>
