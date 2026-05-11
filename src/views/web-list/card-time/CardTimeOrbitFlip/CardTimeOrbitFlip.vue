<template>
  <section ref="sectionRef" class="orbit-flip-section">
    <!-- 背景层 -->
    <div ref="bgCanvasRef" class="bg-canvas"></div>

    <!-- 星空背景 -->
    <div class="starfield">
      <div
        v-for="i in 60"
        :key="i"
        :ref="el => { if (el) starRefs[i - 1] = el as HTMLElement }"
        class="star"
        :style="getStarStyle(i)"
      ></div>
    </div>

    <!-- 标题区 -->
    <div ref="titleRef" class="orbit-title">
      <span class="title-badge">Awwwards Edition</span>
      <h2 class="title-text">星轨旋舞</h2>
      <p class="subtitle">Flip Magic · 3D Spiral · Scroll Dance</p>
    </div>

    <!-- 卡片容器 -->
    <div ref="containerRef" class="orbit-container">
      <!-- 星轨路径（视觉引导线） -->
      <svg ref="trailSvgRef" class="trail-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="trailGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#00d4ff" stop-opacity="0.6" />
            <stop offset="50%" stop-color="#a855f7" stop-opacity="0.8" />
            <stop offset="100%" stop-color="#f472b6" stop-opacity="0.4" />
          </linearGradient>
        </defs>
        <path
          ref="spiralPathRef"
          class="spiral-trail"
          d="M50,50 Q30,30 50,10 Q70,10 80,30 Q90,50 70,60 Q50,80 30,70 Q20,50 40,40 Q60,30 50,50"
          fill="none"
          stroke="url(#trailGradient)"
          stroke-width="0.5"
          stroke-dasharray="4,4"
        />
      </svg>

      <!-- 卡片堆叠组 -->
      <div ref="cardStackRef" class="card-stack">
        <div
          v-for="(card, index) in cards"
          :key="card.id"
          :ref="el => { if (el) cardRefs[index] = el as HTMLElement }"
          class="orbit-card"
          :class="{ 'is-active': activeIndex === index }"
          :style="card.style"
          @mouseenter="handleCardHover(index)"
          @mouseleave="handleCardLeave"
        >
          <div class="card-inner">
            <!-- 卡片背景 -->
            <div class="card-bg" :style="{ background: card.gradient }"></div>

            <!-- 卡片内容 -->
            <div class="card-content">
              <div class="card-icon" v-html="card.icon"></div>
              <h3 class="card-title">{{ card.title }}</h3>
              <p class="card-desc">{{ card.description }}</p>
            </div>

            <!-- 卡片装饰 -->
            <div class="card-decoration">
              <div class="deco-ring"></div>
              <div class="deco-dot"></div>
            </div>

            <!-- 辉光层 -->
            <div class="card-glow" :style="{ '--glow-color': card.color }"></div>

            <!-- Flip指示器 -->
            <div class="flip-indicator">
              <span class="flip-num">{{ String(index + 1).padStart(2, '0') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 粒子效果层 -->
    <canvas ref="particleCanvasRef" class="particle-canvas"></canvas>

    <!-- 脉冲环 -->
    <div ref="pulseContainerRef" class="pulse-container">
      <div v-for="i in 3" :key="i" class="pulse-ring"></div>
    </div>

    <!-- 底部指示器 -->
    <div ref="indicatorRef" class="scroll-indicator">
      <div class="indicator-line"></div>
      <span class="indicator-text">SCROLL TO ORBIT</span>
    </div>

    <!-- 进度指示 -->
    <div ref="progressRef" class="orbit-progress">
      <div class="progress-track">
        <div class="progress-fill"></div>
      </div>
      <span class="progress-label">ORBIT PROGRESS</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'

gsap.registerPlugin(ScrollTrigger, Flip)

// ==================== 类型定义 ====================
interface CardData {
  id: number
  title: string
  description: string
  icon: string
  gradient: string
  color: string
  style: Record<string, string>
}

// ==================== Refs ====================
const sectionRef = ref<HTMLElement>()
const containerRef = ref<HTMLElement>()
const cardStackRef = ref<HTMLElement>()
const trailSvgRef = ref<HTMLElement>()
const spiralPathRef = ref<SVGPathElement>()
const titleRef = ref<HTMLElement>()
const bgCanvasRef = ref<HTMLElement>()
const particleCanvasRef = ref<HTMLCanvasElement>()
const pulseContainerRef = ref<HTMLElement>()
const indicatorRef = ref<HTMLElement>()
const progressRef = ref<HTMLElement>()

const cardRefs = ref<HTMLElement[]>([])
const starRefs = ref<HTMLElement[]>([])

// ==================== 状态 ====================
const activeIndex = ref(-1)
const cards = reactive<CardData[]>([
  {
    id: 1,
    title: '星核能量',
    description: '来自深空的原始能量源',
    icon: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" fill="currentColor"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="currentColor" stroke-width="2"/></svg>',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#a855f7',
    style: {}
  },
  {
    id: 2,
    title: '量子纠缠',
    description: '跨越维度的神秘连接',
    icon: '<svg viewBox="0 0 24 24"><path d="M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" fill="currentColor"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="currentColor" stroke-width="2" fill="none"/></svg>',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    color: '#f472b6',
    style: {}
  },
  {
    id: 3,
    title: '时空折叠',
    description: '扭曲空间的神秘力量',
    icon: '<svg viewBox="0 0 24 24"><path d="M4 4l16 16M20 4L4 20" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    color: '#00d4ff',
    style: {}
  },
  {
    id: 4,
    title: '暗物质流',
    description: '看不见的力量在涌动',
    icon: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/><path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2"/></svg>',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    color: '#fbbf24',
    style: {}
  },
  {
    id: 5,
    title: '光子跃迁',
    description: '光的瞬间转移现象',
    icon: '<svg viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor"/></svg>',
    gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    color: '#a855f7',
    style: {}
  },
  {
    id: 6,
    title: '引力波纹',
    description: '时空的涟漪效应',
    icon: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="2" fill="currentColor"/><circle cx="12" cy="12" r="6" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/></svg>',
    gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    color: '#f9a8d4',
    style: {}
  }
])

// ==================== 工具函数 ====================
function getStarStyle(index: number) {
  const size = Math.random() * 3 + 1
  const x = Math.random() * 100
  const y = Math.random() * 100
  const delay = Math.random() * 3
  const duration = Math.random() * 2 + 2
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${x}%`,
    top: `${y}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  }
}

function getSpiralPosition(index: number, total: number, progress: number) {
  const angle = (index / total) * Math.PI * 4 * progress
  const radius = 150 + index * 30 - 150 * progress
  const x = Math.cos(angle) * radius
  const y = Math.sin(angle) * radius
  const z = index * 20 - 60 * progress
  const rotation = index * 30 + angle * (180 / Math.PI)
  return { x, y, z, rotation }
}

// ==================== 粒子系统 ====================
let particleCtx: CanvasRenderingContext2D | null = null
let particles: Array<{
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  alpha: number
  life: number
}> = []
let particleAnimFrame: number | null = null

function initParticles() {
  const canvas = particleCanvasRef.value
  if (!canvas) return

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  particleCtx = canvas.getContext('2d')

  particles = Array.from({ length: 50 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2,
    size: Math.random() * 3 + 1,
    color: ['#00d4ff', '#a855f7', '#f472b6'][Math.floor(Math.random() * 3)],
    alpha: Math.random() * 0.5 + 0.3,
    life: Math.random() * 100
  }))
}

function animateParticles(progress: number) {
  if (!particleCtx || !particleCanvasRef.value) return

  const canvas = particleCanvasRef.value
  particleCtx.clearRect(0, 0, canvas.width, canvas.height)

  particles.forEach((p, i) => {
    p.x += p.vx * (1 + progress * 2)
    p.y += p.vy * (1 + progress * 2)
    p.life -= 1

    if (p.life <= 0 || p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) {
      p.x = canvas.width / 2
      p.y = canvas.height / 2
      p.life = 100
    }

    particleCtx!.beginPath()
    particleCtx!.arc(p.x, p.y, p.size * (1 + progress), 0, Math.PI * 2)
    particleCtx!.fillStyle = p.color
    particleCtx!.globalAlpha = p.alpha * (1 - progress * 0.5)
    particleCtx!.fill()
  })

  particleCtx.globalAlpha = 1
}

function killParticleAnimation() {
  if (particleAnimFrame !== null) {
    cancelAnimationFrame(particleAnimFrame)
    particleAnimFrame = null
  }
}

// ==================== 动画控制 ====================
let masterTl: gsap.core.Timeline | null = null
let scrollTriggers: ScrollTrigger[] = []

function initAnimations() {
  if (!sectionRef.value || !containerRef.value || !cardRefs.value.length) return

  const container = containerRef.value
  const cards = cardRefs.value

  // 设置初始状态
  gsap.set(container, {
    perspective: 2000,
    transformStyle: 'preserve-3d'
  })

  // 记录最终网格状态（用于Flip）
  const finalState = Flip.getState(cards)

  // 初始化为魔法堆叠状态
  cards.forEach((card, i) => {
    gsap.set(card, {
      position: 'absolute',
      top: '50%',
      left: '50%',
      xPercent: -50,
      yPercent: -50,
      z: -i * 25,
      rotation: i * 12,
      scale: 0.85,
      opacity: 0.9,
      transformOrigin: 'center center',
      force3D: true
    })
  })

  // 创建星轨散开动画
  masterTl = gsap.timeline({ paused: true })

  // 星轨螺旋散开
  cards.forEach((card, i) => {
    const delay = i * 0.12
    const angle = (i / cards.length) * Math.PI * 3
    const radius = 180
    const targetX = Math.cos(angle) * radius
    const targetY = Math.sin(angle) * radius
    const targetZ = i * 40 + 100
    const targetRotation = i * 60

    masterTl!.to(card, {
      x: targetX,
      y: targetY,
      z: targetZ,
      rotationX: 0,
      rotationY: 0,
      rotation: targetRotation,
      scale: 1,
      opacity: 1,
      duration: 1.2,
      ease: 'expo.out',
      transformOrigin: 'center center'
    }, delay)
  })

  // 网格归位动画
  masterTl!.to(cards, {
    x: 0,
    y: 0,
    z: 0,
    rotation: 0,
    scale: 1,
    stagger: { each: 0.1, from: 'edges' },
    duration: 1,
    ease: 'elastic.out(1, 0.6)',
    onStart: () => {
      sectionRef.value?.classList.add('is-expanded')
    }
  }, '+=0.3')

  // 自由漂浮
  masterTl!.to(cards, {
    y: '+=15',
    repeat: -1,
    yoyo: true,
    stagger: { each: 0.15, from: 'random' },
    duration: 2.5,
    ease: 'sine.inOut'
  }, '-=0.5')

  // 创建ScrollTrigger
  const scrollTrigger = ScrollTrigger.create({
    trigger: sectionRef.value,
    start: 'top 80%',
    end: 'top 20%',
    scrub: 2,
    animation: masterTl,
    toggleActions: 'play reverse play reverse',
    onUpdate: (self) => {
      const progress = self.progress
      animateParticles(progress)
      updateProgressBar(progress)
      updatePulseRings(progress)
    }
  })

  scrollTriggers.push(scrollTrigger)

  // 标题动画
  if (titleRef.value) {
    gsap.fromTo(
      titleRef.value.children,
      { opacity: 0, y: 50, rotationX: -45 },
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
      opacity: 0.3,
      duration: 2,
      stagger: { each: 0.1, from: 'random' },
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
  }

  // 星轨路径动画
  if (spiralPathRef.value) {
    gsap.fromTo(
      spiralPathRef.value,
      { strokeDashoffset: 1000 },
      {
        strokeDashoffset: 0,
        duration: 2,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        }
      }
    )
  }
}

function updateProgressBar(progress: number) {
  const fill = progressRef.value?.querySelector('.progress-fill') as HTMLElement
  if (fill) {
    gsap.set(fill, { width: `${progress * 100}%` })
  }
}

function updatePulseRings(progress: number) {
  if (!pulseContainerRef.value) return
  const rings = pulseContainerRef.value.querySelectorAll('.pulse-ring')
  rings.forEach((ring, i) => {
    const scale = 1 + progress * (i + 1) * 0.5
    const opacity = 1 - progress * 0.7
    gsap.set(ring, { scale, opacity })
  })
}

// ==================== 交互处理 ====================
function handleCardHover(index: number) {
  activeIndex.value = index
  const card = cardRefs.value[index]
  if (!card) return

  gsap.to(card, {
    scale: 1.08,
    z: 50,
    rotationY: 15,
    boxShadow: '0 25px 50px rgba(168, 85, 247, 0.4)',
    duration: 0.4,
    ease: 'power2.out'
  })

  gsap.to(card.querySelector('.card-glow'), {
    opacity: 1,
    scale: 1.5,
    duration: 0.4
  })
}

function handleCardLeave() {
  activeIndex.value = -1
  cardRefs.value.forEach(card => {
    if (!card) return
    gsap.to(card, {
      scale: 1,
      z: 0,
      rotationY: 0,
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
      duration: 0.4,
      ease: 'power2.out'
    })

    gsap.to(card.querySelector('.card-glow'), {
      opacity: 0,
      scale: 1,
      duration: 0.4
    })
  })
}

// ==================== 生命周期 ====================
onMounted(async () => {
  await nextTick()

  // 初始化
  initParticles()
  initAnimations()

  // 卡片入场动画
  gsap.fromTo(
    containerRef.value,
    { opacity: 0, scale: 0.8 },
    {
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    }
  )

  // 指示器入场
  gsap.to([progressRef.value, indicatorRef.value], {
    opacity: 1,
    duration: 1,
    stagger: 0.2,
    delay: 0.3
  })
})

onUnmounted(() => {
  // 清理所有ScrollTrigger
  scrollTriggers.forEach(st => st.kill())
  scrollTriggers = []

  // 清理主时间线
  if (masterTl) {
    masterTl.kill()
    masterTl = null
  }

  // 清理粒子动画
  killParticleAnimation()

  // 清理所有GSAP动画
  ScrollTrigger.getAll().forEach(st => st.kill())
  gsap.killTweensOf('*')
})
</script>

<style lang="scss" scoped>
// ==================== 变量 ====================
$primary-cyan: #00d4ff;
$primary-purple: #a855f7;
$primary-pink: #f472b6;
$card-width: 280px;
$card-height: 340px;

// ==================== 主容器 ====================
.orbit-flip-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  min-height: 600px;
  overflow: hidden;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0a1a2e 100%);
  font-family: 'Inter', -apple-system, sans-serif;
}

// ==================== 背景 ====================
.bg-canvas {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 30% 20%, rgba(168, 85, 247, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 80%, rgba(0, 212, 255, 0.1) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(244, 114, 182, 0.08) 0%, transparent 60%);
  pointer-events: none;
}

// ==================== 星空 ====================
.starfield {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.star {
  position: absolute;
  background: white;
  border-radius: 50%;
  animation: twinkle 3s ease-in-out infinite;

  @keyframes twinkle {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.2); }
  }
}

// ==================== 标题 ====================
.orbit-title {
  position: absolute;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 10;
  perspective: 800px;
}

.title-badge {
  display: inline-block;
  padding: 6px 16px;
  background: linear-gradient(90deg, $primary-cyan, $primary-purple);
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: white;
  margin-bottom: 16px;
  box-shadow: 0 4px 20px rgba($primary-cyan, 0.4);
}

.title-text {
  font-size: clamp(36px, 6vw, 64px);
  font-weight: 800;
  background: linear-gradient(135deg, white 0%, $primary-cyan 50%, $primary-purple 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 12px;
  letter-spacing: -1px;
  text-shadow: 0 0 40px rgba($primary-cyan, 0.3);
}

.subtitle {
  font-size: 14px;
  color: rgba(white, 0.6);
  letter-spacing: 4px;
  text-transform: uppercase;
  margin: 0;
}

// ==================== 容器 ====================
.orbit-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.trail-svg {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0.4;
}

.spiral-trail {
  stroke-linecap: round;
}

// ==================== 卡片堆叠 ====================
.card-stack {
  position: relative;
  width: 320px;
  height: 400px;
  transform-style: preserve-3d;

  // 展开状态
  &.is-expanded {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 24px;
    width: auto;
    height: auto;

    .orbit-card {
      position: relative !important;
      top: auto !important;
      left: auto !important;
      transform: none !important;
    }
  }
}

// ==================== 单卡片 ====================
.orbit-card {
  width: $card-width;
  height: $card-height;
  cursor: pointer;
  transform-style: preserve-3d;
  will-change: transform;
  perspective: 1000px;

  &:hover .card-inner {
    transform: translateY(-8px) rotateX(5deg);
  }
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  overflow: hidden;
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform-style: preserve-3d;
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  backdrop-filter: blur(10px);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 50%);
    pointer-events: none;
    z-index: 1;
  }
}

.card-bg {
  position: absolute;
  inset: 0;
  opacity: 0.9;
}

.card-content {
  position: relative;
  z-index: 2;
  padding: 28px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.card-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 16px;
  color: white;
  filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3));

  svg {
    width: 100%;
    height: 100%;
  }
}

.card-title {
  font-size: 20px;
  font-weight: 700;
  color: white;
  margin: 0 0 8px;
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
}

.card-desc {
  font-size: 13px;
  color: rgba(white, 0.8);
  margin: 0;
  line-height: 1.5;
}

.card-decoration {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 3;
}

.deco-ring {
  width: 50px;
  height: 50px;
  border: 2px solid rgba(255,255,255,0.2);
  border-radius: 50%;
  animation: deco-spin 8s linear infinite;
}

.deco-dot {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 0 10px white;

  @keyframes deco-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
}

.card-glow {
  position: absolute;
  inset: -20px;
  background: radial-gradient(circle at center, var(--glow-color) 0%, transparent 70%);
  opacity: 0;
  pointer-events: none;
  z-index: 0;
  filter: blur(20px);
  transition: opacity 0.3s;
}

.flip-indicator {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 4;
}

.flip-num {
  font-size: 12px;
  font-weight: 700;
  color: rgba(white, 0.6);
  letter-spacing: 1px;
}

// ==================== 粒子 ====================
.particle-canvas {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

// ==================== 脉冲环 ====================
.pulse-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.pulse-ring {
  position: absolute;
  width: 200px;
  height: 200px;
  border: 2px solid rgba($primary-cyan, 0.3);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(1);
  animation: pulse-expand 4s ease-out infinite;

  &:nth-child(2) {
    animation-delay: 1.3s;
    border-color: rgba($primary-purple, 0.3);
  }

  &:nth-child(3) {
    animation-delay: 2.6s;
    border-color: rgba($primary-pink, 0.3);
  }

  @keyframes pulse-expand {
    0% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0.6;
    }
    100% {
      transform: translate(-50%, -50%) scale(4);
      opacity: 0;
    }
  }
}

// ==================== 指示器 ====================
.scroll-indicator {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  z-index: 10;
}

.indicator-line {
  width: 1px;
  height: 40px;
  background: linear-gradient(to bottom, $primary-cyan, transparent);
  animation: line-scroll 2s ease-in-out infinite;
}

.indicator-text {
  font-size: 10px;
  letter-spacing: 3px;
  color: rgba(white, 0.5);
  text-transform: uppercase;

  @keyframes line-scroll {
    0%, 100% { transform: scaleY(1); opacity: 1; }
    50% { transform: scaleY(0.5); opacity: 0.5; }
  }
}

.orbit-progress {
  position: absolute;
  bottom: 40px;
  right: 40px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  z-index: 10;
}

.progress-track {
  width: 120px;
  height: 4px;
  background: rgba(white, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, $primary-cyan, $primary-purple);
  border-radius: 2px;
  transition: width 0.1s;
}

.progress-label {
  font-size: 9px;
  letter-spacing: 2px;
  color: rgba(white, 0.4);
  text-transform: uppercase;
}

// ==================== 响应式 ====================
@media (max-width: 768px) {
  .orbit-title {
    top: 40px;
  }

  .title-text {
    font-size: 28px;
  }

  .card-stack {
    &.is-expanded {
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      padding: 20px;
    }
  }

  .orbit-card {
    width: 150px;
    height: 200px;
  }

  .card-content {
    padding: 16px;
  }

  .card-icon {
    width: 32px;
    height: 32px;
  }

  .card-title {
    font-size: 14px;
  }

  .card-desc {
    font-size: 11px;
  }

  .orbit-progress {
    bottom: 20px;
    right: 20px;
  }

  .progress-track {
    width: 80px;
  }
}
</style>
