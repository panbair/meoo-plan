<template>
  <section ref="sectionRef" class="spectrum-section">
    <!-- 光谱背景 -->
    <div class="spectrum-bg">
      <!-- 光谱光晕 -->
      <div class="spectrum-halo"></div>
      <div class="spectrum-halo halo-2"></div>
      <div class="spectrum-halo halo-3"></div>

      <!-- 光谱网格 -->
      <div class="spectrum-grid">
        <div v-for="i in 20" :key="i" class="grid-line horizontal"></div>
        <div v-for="i in 20" :key="'v' + i" class="grid-line vertical"></div>
      </div>

      <!-- 光谱波纹 -->
      <div class="spectrum-waves">
        <div v-for="i in 5" :key="i" class="wave-ring" :style="getWaveStyle(i)"></div>
      </div>
    </div>

    <!-- 粒子星空 -->
    <div class="particle-field">
      <canvas ref="particleCanvasRef" class="particle-canvas"></canvas>
    </div>

    <!-- 标题区 -->
    <div ref="titleRef" class="spectrum-title">
      <span class="title-badge">SPECTRUM WARP</span>
      <h2 class="title-text">光谱折跃</h2>
      <p class="subtitle">CSS3 Filter · 3D Transform · Neon Shadow</p>
    </div>

    <!-- 光谱容器 -->
    <div ref="spectrumContainerRef" class="spectrum-container">
      <!-- 奇点中心 -->
      <div class="singularity-core"></div>

      <!-- 光谱卡片 -->
      <div
        v-for="(card, i) in spectrumCards"
        :key="card.id"
        :ref="el => { if (el) cardRefs[i] = el as HTMLElement }"
        class="spectrum-card"
        :style="{ '--card-color': card.color, '--card-glow': card.glow }"
      >
        <div class="card-inner">
          <!-- 光谱背景层 -->
          <div class="card-spectrum-bg"></div>
          <div class="card-chromatic"></div>

          <!-- 卡片内容 -->
          <div class="card-content">
            <div class="card-icon" v-html="card.icon"></div>
            <h3 class="card-title">{{ card.title }}</h3>
            <p class="card-desc">{{ card.description }}</p>
          </div>

          <!-- 光谱边框 -->
          <div class="card-chroma-border"></div>

          <!-- 霓虹光晕 -->
          <div class="card-neon-glow"></div>
        </div>
      </div>
    </div>

    <!-- 滚动提示 -->
    <div ref="scrollTipRef" class="scroll-tip">
      <div class="tip-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
      </div>
      <span class="tip-text">SCROLL TO WARP</span>
    </div>

    <!-- 进度条 -->
    <div ref="progressRef" class="spectrum-progress">
      <div class="progress-bar">
        <div ref="progressFillRef" class="progress-fill"></div>
      </div>
      <span class="progress-label">{{ Math.round(warpProgress * 100) }}%</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ==================== 类型定义 ====================
interface SpectrumCard {
  id: number
  title: string
  description: string
  icon: string
  color: string
  glow: string
}

// ==================== Refs ====================
const sectionRef = ref<HTMLElement>()
const spectrumContainerRef = ref<HTMLElement>()
const particleCanvasRef = ref<HTMLCanvasElement>()
const progressFillRef = ref<HTMLElement>()
const titleRef = ref<HTMLElement>()
const scrollTipRef = ref<HTMLElement>()
const progressRef = ref<HTMLElement>()
const cardRefs = ref<HTMLElement[]>([])

// ==================== 状态 ====================
const warpProgress = ref(0)

const spectrumCards = reactive<SpectrumCard[]>([
  {
    id: 1,
    title: '紫外边界',
    description: '光谱尽头的能量禁区',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v18M3 12h18"/><circle cx="12" cy="12" r="8"/></svg>',
    color: '#8b5cf6',
    glow: 'rgba(139, 92, 246, 0.6)'
  },
  {
    id: 2,
    title: '可见光域',
    description: '人眼可感知的色彩空间',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>',
    color: '#06b6d4',
    glow: 'rgba(6, 182, 212, 0.6)'
  },
  {
    id: 3,
    title: '红外脉冲',
    description: '热辐射的神秘波动',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v10M12 12v10M8 6l4 4 4-4"/></svg>',
    color: '#f43f5e',
    glow: 'rgba(244, 63, 94, 0.6)'
  },
  {
    id: 4,
    title: '伽马射线',
    description: '宇宙最强的穿透辐射',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5"/><line x1="12" y1="22" x2="12" y2="15.5"/><polyline points="22,8.5 12,15.5 2,8.5"/></svg>',
    color: '#f97316',
    glow: 'rgba(249, 115, 22, 0.6)'
  },
  {
    id: 5,
    title: 'X光穿透',
    description: '洞察万物内部结构',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>',
    color: '#10b981',
    glow: 'rgba(16, 185, 129, 0.6)'
  },
  {
    id: 6,
    title: '微波回荡',
    description: '宇宙背景辐射的余韵',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12a8 8 0 0 1 16 0M8 12a4 4 0 0 1 8 0"/><circle cx="12" cy="12" r="1"/></svg>',
    color: '#ec4899',
    glow: 'rgba(236, 72, 153, 0.6)'
  },
  {
    id: 7,
    title: '射频链接',
    description: '跨越星际的通讯桥梁',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12.55a11 11 0 0 1 14.08 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/></svg>',
    color: '#6366f1',
    glow: 'rgba(99, 102, 241, 0.6)'
  },
  {
    id: 8,
    title: '全息投影',
    description: '虚实之间的光影艺术',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>',
    color: '#a855f7',
    glow: 'rgba(168, 85, 247, 0.6)'
  }
])

// ==================== 样式辅助 ====================
function getWaveStyle(index: number) {
  const size = 100 + index * 80
  const delay = index * 0.4
  return {
    width: `${size}px`,
    height: `${size}px`,
    animationDelay: `${delay}s`
  }
}

// ==================== 粒子系统 ====================
let particleCtx: CanvasRenderingContext2D | null = null
let particles: Array<{
  x: number
  y: number
  z: number
  vx: number
  vy: number
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

  const colors = ['#8b5cf6', '#06b6d4', '#f43f5e', '#f97316', '#ec4899', '#a855f7']

  particles = Array.from({ length: 60 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    z: Math.random() * 200 - 100,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
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
    p.x += p.vx * (1 + progress * 2)
    p.y += p.vy * (1 + progress * 2)

    if (p.x < 0 || p.x > canvas.width) p.vx *= -1
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1

    // 3D投影
    const scale = 1 + p.z / 200
    const screenX = (p.x - canvas.width / 2) * scale + canvas.width / 2
    const screenY = (p.y - canvas.height / 2) * scale + canvas.height / 2

    // 绘制粒子
    particleCtx!.beginPath()
    particleCtx!.arc(screenX, screenY, p.size * Math.abs(scale), 0, Math.PI * 2)
    particleCtx!.fillStyle = p.color
    particleCtx!.globalAlpha = p.alpha * progress
    particleCtx!.fill()

    // 光晕
    particleCtx!.beginPath()
    particleCtx!.arc(screenX, screenY, p.size * 3, 0, Math.PI * 2)
    particleCtx!.fillStyle = p.color
    particleCtx!.globalAlpha = p.alpha * 0.2 * progress
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
let scrollTriggers: ScrollTrigger[] = []
let timeline: gsap.core.Timeline | null = null

function initAnimations() {
  if (!sectionRef.value || !spectrumContainerRef.value || !cardRefs.value.length) return

  const container = spectrumContainerRef.value
  const cards = cardRefs.value

  // 3D空间配置
  gsap.set(container, {
    perspective: 2000,
    transformStyle: 'preserve-3d',
    backfaceVisibility: 'hidden'
  })

  // 初始奇点状态：模糊+收缩+隐藏
  cards.forEach((card, i) => {
    gsap.set(card, {
      position: 'absolute',
      left: '50%',
      top: '50%',
      xPercent: -50,
      yPercent: -50,
      x: 0,
      y: 0,
      z: -1000,
      scale: 0,
      rotateX: 540,
      rotateY: 540,
      rotateZ: 0,
      opacity: 0,
      filter: 'blur(20px) brightness(0) saturate(0)',
      transformStyle: 'preserve-3d',
      backfaceVisibility: 'hidden',
      transformOrigin: 'center center',
      force3D: true
    })
  })

  // 光谱折跃动画
  timeline = gsap.timeline({ paused: true })

  // 阶段1：穿透3D空间 + 滤镜渐变
  timeline.to(cards, {
    z: -200,
    scale: 0.4,
    opacity: 0.5,
    filter: 'blur(8px) brightness(1.2) saturate(0.5)',
    rotateX: 180,
    rotateY: 180,
    duration: 0.8,
    ease: 'power2.in',
    stagger: { each: 0.08, from: 'center' }
  })

  // 阶段2：3D炸裂展开 + 滤镜清晰化
  timeline.to(cards, {
    z: 0,
    x: (i: number) => {
      // 8方向散开
      const angles = [0, 45, 90, 135, 180, 225, 270, 315]
      const angle = angles[i % 8] * (Math.PI / 180)
      const distance = 180 + (i % 2) * 60
      return Math.cos(angle) * distance
    },
    y: (i: number) => {
      const angles = [0, 45, 90, 135, 180, 225, 270, 315]
      const angle = angles[i % 8] * (Math.PI / 180)
      const distance = 180 + (i % 2) * 60
      return Math.sin(angle) * distance
    },
    rotateX: 0,
    rotateY: 0,
    rotateZ: (i: number) => {
      const rots = [-15, 15, -10, 10, -20, 20, -5, 5]
      return rots[i % 8]
    },
    scale: 1,
    opacity: 1,
    filter: 'blur(0px) brightness(1) saturate(1.4)',
    duration: 1.2,
    ease: 'expo.out',
    stagger: { each: 0.1, from: 'center' }
  })

  // 阶段3：悬浮呼吸 + 光影动态
  timeline.to(cards, {
    y: '+=15',
    rotateZ: '+=5',
    filter: 'brightness(1.1) saturate(1.2)',
    duration: 1.5,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true,
    stagger: { each: 0.1, from: 'random' }
  }, '-=0.5')

  // ScrollTrigger 驱动
  const scrollTrigger = ScrollTrigger.create({
    trigger: sectionRef.value,
    start: 'top 80%',
    end: 'top 15%',
    scrub: 2,
    animation: timeline,
    toggleActions: 'play reverse play reverse',
    immediateRender: false,
    onUpdate: (self) => {
      warpProgress.value = self.progress
      animateParticles(self.progress)
      if (progressFillRef.value) {
        progressFillRef.value.style.width = `${self.progress * 100}%`
      }
    }
  })

  scrollTriggers.push(scrollTrigger)

  // 标题动画
  if (titleRef.value) {
    gsap.fromTo(
      titleRef.value.children,
      { opacity: 0, y: 50, rotationX: -30 },
      {
        opacity: 1,
        y: 0,
        rotationX: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        }
      }
    )
  }

  // 光谱光晕动画
  gsap.to('.spectrum-halo', {
    scale: 1.3,
    opacity: 0.4,
    duration: 3,
    stagger: { each: 1, from: 'start' },
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  })

  // 网格线动画
  gsap.to('.grid-line', {
    opacity: 0.15,
    duration: 2,
    stagger: { each: 0.05, from: 'random' },
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  })

  // 奇点动画
  gsap.to('.singularity-core', {
    scale: 1.5,
    boxShadow: '0 0 100px rgba(139, 92, 246, 0.8)',
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  })
}

// ==================== 生命周期 ====================
onMounted(async () => {
  await nextTick()

  initParticles()
  initAnimations()

  // 入场动画
  gsap.fromTo(
    sectionRef.value,
    { opacity: 0 },
    {
      opacity: 1,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 90%',
        toggleActions: 'play none none reverse'
      }
    }
  )

  // 提示入场
  gsap.set([scrollTipRef.value, progressRef.value], { opacity: 0, y: 20 })
  gsap.to([scrollTipRef.value, progressRef.value], {
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.1,
    delay: 0.5
  })
})

onUnmounted(() => {
  // 清理 ScrollTrigger
  scrollTriggers.forEach(st => st.kill())
  scrollTriggers = []

  // 清理时间线
  if (timeline) {
    timeline.kill()
    timeline = null
  }

  // 清理粒子
  killParticles()

  // 清理所有 GSAP 动画
  ScrollTrigger.getAll().forEach(st => st.kill())
  gsap.killTweensOf('*')

  // 清理元素样式
  if (cardRefs.value.length) {
    gsap.set(cardRefs.value, { clearProps: 'all' })
  }
})
</script>

<style lang="scss" scoped>
// ==================== 变量 ====================
$spectrum-purple: #8b5cf6;
$spectrum-cyan: #06b6d4;
$spectrum-pink: #f43f5e;
$spectrum-orange: #f97316;
$spectrum-deep: #050510;

// ==================== 主容器 ====================
.spectrum-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  min-height: 900px;
  overflow: hidden;
  background: radial-gradient(ellipse at center, $spectrum-deep 0%, #000 70%);
  font-family: 'Inter', -apple-system, sans-serif;
  transform-style: preserve-3d;
}

// ==================== 背景层 ====================
.spectrum-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

// 光谱光晕
.spectrum-halo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 600px;
  background: radial-gradient(
    circle,
    rgba($spectrum-purple, 0.3) 0%,
    rgba($spectrum-cyan, 0.2) 30%,
    rgba($spectrum-pink, 0.1) 60%,
    transparent 70%
  );
  border-radius: 50%;
  filter: blur(60px);

  &.halo-2 {
    width: 400px;
    height: 400px;
    background: radial-gradient(
      circle,
      rgba($spectrum-cyan, 0.4) 0%,
      transparent 60%
    );
  }

  &.halo-3 {
    width: 300px;
    height: 300px;
    background: radial-gradient(
      circle,
      rgba($spectrum-pink, 0.3) 0%,
      transparent 60%
    );
  }
}

// 光谱网格
.spectrum-grid {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.grid-line {
  position: absolute;
  background: linear-gradient(
    90deg,
    transparent,
    rgba($spectrum-purple, 0.1),
    transparent
  );
  opacity: 0.05;

  &.horizontal {
    width: 100%;
    height: 1px;
    top: 50%;

    @for $i from 1 through 20 {
      &:nth-child(#{$i}) {
        top: #{$i * 5}%;
      }
    }
  }

  &.vertical {
    width: 1px;
    height: 100%;
    left: 50%;

    @for $i from 1 through 20 {
      &:nth-child(#{$i}) {
        left: #{$i * 5}%;
      }
    }
  }
}

// 光谱波纹
.spectrum-waves {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.wave-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid rgba($spectrum-cyan, 0.2);
  border-radius: 50%;
  animation: wave-pulse 4s ease-out infinite;
  opacity: 0;

  @keyframes wave-pulse {
    0% {
      transform: translate(-50%, -50%) scale(0.5);
      opacity: 0.6;
    }
    100% {
      transform: translate(-50%, -50%) scale(2);
      opacity: 0;
    }
  }
}

// ==================== 粒子画布 ====================
.particle-field {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.particle-canvas {
  width: 100%;
  height: 100%;
}

// ==================== 标题 ====================
.spectrum-title {
  position: absolute;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 30;
  perspective: 1000px;
}

.title-badge {
  display: inline-block;
  padding: 8px 24px;
  background: linear-gradient(90deg, transparent, rgba($spectrum-purple, 0.2), transparent);
  border: 1px solid rgba($spectrum-cyan, 0.3);
  border-radius: 25px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: $spectrum-cyan;
  margin-bottom: 20px;
}

.title-text {
  font-size: clamp(40px, 8vw, 72px);
  font-weight: 900;
  background: linear-gradient(135deg, white 0%, $spectrum-cyan 30%, $spectrum-purple 60%, $spectrum-pink 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 14px;
  letter-spacing: -3px;
  filter: drop-shadow(0 0 30px rgba($spectrum-purple, 0.5));
}

.subtitle {
  font-size: 11px;
  color: rgba(white, 0.4);
  letter-spacing: 5px;
  text-transform: uppercase;
  margin: 0;
}

// ==================== 光谱容器 ====================
.spectrum-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  height: 500px;
  transform-style: preserve-3d;
}

// 奇点中心
.singularity-core {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  background: radial-gradient(circle, white 0%, $spectrum-purple 50%, transparent 70%);
  border-radius: 50%;
  box-shadow: 0 0 50px rgba($spectrum-purple, 0.6);
  z-index: 100;
}

// ==================== 光谱卡片 ====================
.spectrum-card {
  width: 240px;
  height: 300px;
  border-radius: 20px;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  will-change: transform, filter;
  cursor: pointer;

  // 霓虹光影
  box-shadow:
    0 0 35px var(--card-glow),
    0 0 70px rgba(80, 150, 255, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);

  // 滤镜基础
  filter: drop-shadow(0 0 15px var(--card-glow));

  &:hover {
    box-shadow:
      0 0 50px var(--card-glow),
      0 0 100px rgba(80, 150, 255, 0.35),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);

    .card-inner {
      transform: translateZ(20px) scale(1.02);
    }

    .card-neon-glow {
      opacity: 1;
      transform: scale(1.2);
    }
  }
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  overflow: hidden;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.4s ease;
  background: rgba(15, 10, 30, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

// 光谱背景层
.card-spectrum-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.05) 0%,
    transparent 50%,
    rgba(255, 255, 255, 0.03) 100%
  );
}

.card-chromatic {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    45deg,
    transparent 40%,
    rgba(var(--card-color), 0.1) 50%,
    transparent 60%
  );
  background-color: rgba(255, 255, 255, 0.02);
}

// 卡片内容
.card-content {
  position: relative;
  z-index: 2;
  height: 100%;
  padding: 28px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.card-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 16px;
  color: var(--card-color);
  filter: drop-shadow(0 0 10px var(--card-glow));

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
  text-shadow: 0 2px 15px rgba(0, 0, 0, 0.5);
}

.card-desc {
  font-size: 12px;
  color: rgba(white, 0.6);
  margin: 0;
  line-height: 1.5;
}

// 光谱边框
.card-chroma-border {
  position: absolute;
  inset: 0;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 30%,
    transparent 70%,
    rgba(255, 255, 255, 0.05) 100%
  );
  pointer-events: none;
}

// 霓虹光晕
.card-neon-glow {
  position: absolute;
  top: -20%;
  left: -20%;
  width: 140%;
  height: 140%;
  background: radial-gradient(
    circle at center,
    var(--card-glow) 0%,
    transparent 50%
  );
  opacity: 0.3;
  transition: opacity 0.3s, transform 0.3s;
  pointer-events: none;
  filter: blur(20px);
}

// ==================== 滚动提示 ====================
.scroll-tip {
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  z-index: 30;
}

.tip-icon {
  width: 36px;
  height: 36px;
  color: $spectrum-cyan;
  animation: tip-pulse 2s ease-in-out infinite;

  svg {
    width: 100%;
    height: 100%;
  }

  @keyframes tip-pulse {
    0%, 100% { transform: translateY(0); opacity: 0.4; }
    50% { transform: translateY(10px); opacity: 1; }
  }
}

.tip-text {
  font-size: 9px;
  letter-spacing: 4px;
  color: rgba(white, 0.3);
  text-transform: uppercase;
}

// ==================== 进度条 ====================
.spectrum-progress {
  position: absolute;
  top: 60px;
  right: 50px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  z-index: 30;
}

.progress-bar {
  width: 120px;
  height: 4px;
  background: rgba(white, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, $spectrum-purple, $spectrum-cyan, $spectrum-pink);
  background-size: 200% 100%;
  border-radius: 2px;
  transition: width 0.1s ease;
  animation: progress-shimmer 2s linear infinite;
}

@keyframes progress-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.progress-label {
  font-size: 9px;
  font-family: 'Courier New', monospace;
  letter-spacing: 2px;
  color: rgba(white, 0.4);
  text-transform: uppercase;
}

// ==================== 响应式 ====================
@media (max-width: 1024px) {
  .spectrum-container {
    width: 400px;
    height: 400px;
  }

  .spectrum-card {
    width: 180px;
    height: 220px;
  }
}

@media (max-width: 768px) {
  .spectrum-title {
    top: 40px;
  }

  .title-text {
    font-size: 28px;
  }

  .subtitle {
    font-size: 9px;
    letter-spacing: 3px;
  }

  .spectrum-container {
    width: 320px;
    height: 320px;
  }

  .spectrum-card {
    width: 140px;
    height: 180px;
  }

  .card-content {
    padding: 16px;
  }

  .card-icon {
    width: 32px;
    height: 32px;
    margin-bottom: 10px;
  }

  .card-title {
    font-size: 14px;
  }

  .card-desc {
    font-size: 10px;
  }

  .spectrum-progress {
    top: 20px;
    right: 20px;

    .progress-bar {
      width: 80px;
    }
  }

  .scroll-tip {
    bottom: 30px;
  }
}
</style>
