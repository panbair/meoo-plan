<template>
  <section ref="sectionRef" class="portal-section">
    <!-- 背景星空 -->
    <canvas ref="bgCanvasRef" class="portal-bg"></canvas>

    <!-- 星云效果 -->
    <div class="nebula-layer"></div>

    <!-- 传送门主体 -->
    <div class="portal-container" ref="portalRef">
      <!-- 外层光环 -->
      <div class="portal-ring ring-outer">
        <div class="ring-segment" v-for="i in 8" :key="i" :style="{ '--i': i }"></div>
      </div>

      <!-- 中层光环 -->
      <div class="portal-ring ring-middle">
        <div class="ring-dash"></div>
      </div>

      <!-- 内层光环 -->
      <div class="portal-ring ring-inner"></div>

      <!-- 传送门核心 -->
      <div class="portal-core">
        <div class="core-vortex"></div>
        <div class="core-inner"></div>
      </div>

      <!-- 能量粒子 -->
      <canvas ref="particleCanvasRef" class="portal-particles-canvas"></canvas>
    </div>

    <!-- 悬浮卡片组 -->
    <div class="cards-orbit" ref="cardsOrbitRef">
      <div v-for="(card, i) in cards" :key="i" 
           class="floating-card"
           :style="{ 
             '--i': i,
             '--angle': `${(i * 360) / cards.length}deg`,
             '--orbit-radius': `${orbitRadius}px`
           }"
           ref="cardRefs">
        <div class="card-glow"></div>
        <div class="card-content">
          <div class="card-icon" v-html="card.icon"></div>
          <h3 class="card-title">{{ card.title }}</h3>
          <p class="card-desc">{{ card.description }}</p>
          <div class="card-tags">
            <span v-for="(tag, j) in card.tags" :key="j" class="card-tag">{{ tag }}</span>
          </div>
        </div>
        <div class="card-border"></div>
      </div>
    </div>

    <!-- 中心标题 -->
    <div class="portal-title" ref="titleRef">
      <div class="title-decoration">
        <span class="deco-star">✦</span>
        <span class="deco-line"></span>
      </div>
      <h1>Portal</h1>
      <p class="title-sub">探索无限可能</p>
      <div class="title-decoration reverse">
        <span class="deco-line"></span>
        <span class="deco-star">✦</span>
      </div>
    </div>

    <!-- 角落装饰 -->
    <div class="corner-decor top-left">
      <svg viewBox="0 0 100 100" class="corner-svg">
        <path d="M0,50 L0,0 L50,0" fill="none" stroke="currentColor" stroke-width="2"/>
        <circle cx="0" cy="0" r="4" fill="currentColor"/>
      </svg>
    </div>
    <div class="corner-decor bottom-right">
      <svg viewBox="0 0 100 100" class="corner-svg">
        <path d="M100,50 L100,100 L50,100" fill="none" stroke="currentColor" stroke-width="2"/>
        <circle cx="100" cy="100" r="4" fill="currentColor"/>
      </svg>
    </div>

    <!-- 底部提示 -->
    <div class="scroll-hint" ref="scrollHintRef">
      <span>向下滚动穿越传送门</span>
      <div class="hint-arrow">
        <span></span>
        <span></span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []

// SVG 图标组件
const RocketIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>`

const GlobeIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`

const BoltIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`

const HeartIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`

// 卡片数据
const cards = ref([
  {
    title: '星际探索',
    description: '穿越无尽宇宙，发现未知星球与文明',
    tags: ['太空', '探索', '冒险'],
    icon: RocketIcon
  },
  {
    title: '全球互联',
    description: '连接世界每个角落，零距离沟通',
    tags: ['网络', '连接', '未来'],
    icon: GlobeIcon
  },
  {
    title: '能量觉醒',
    description: '释放无限潜能，点燃创造之火',
    tags: ['能量', '动力', '创新'],
    icon: BoltIcon
  },
  {
    title: '心灵共鸣',
    description: '跨越时空的羁绊，灵魂的交汇',
    tags: ['情感', '连接', '共鸣'],
    icon: HeartIcon
  }
])

// 模板引用
const sectionRef = ref<HTMLElement | null>(null)
const bgCanvasRef = ref<HTMLCanvasElement | null>(null)
const particleCanvasRef = ref<HTMLCanvasElement | null>(null)
const portalRef = ref<HTMLElement | null>(null)
const cardsOrbitRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const scrollHintRef = ref<HTMLElement | null>(null)
const cardRefs = ref<HTMLElement[]>([])

// 计算轨道半径
const orbitRadius = computed(() => {
  if (typeof window !== 'undefined') {
    return window.innerWidth < 768 ? 180 : 280
  }
  return 280
})

// 动画状态
let bgCtx: CanvasRenderingContext2D | null = null
let particleCtx: CanvasRenderingContext2D | null = null
let animationId: number | null = null
let time = 0

interface Star {
  x: number
  y: number
  size: number
  speed: number
  opacity: number
  twinkleSpeed: number
}

interface Particle {
  angle: number
  radius: number
  speed: number
  size: number
  hue: number
  life: number
  maxLife: number
}

const stars: Star[] = []
const particles: Particle[] = []

// 初始化背景
const initBackground = () => {
  if (!bgCanvasRef.value) return
  bgCanvasRef.value.width = window.innerWidth
  bgCanvasRef.value.height = window.innerHeight
  bgCtx = bgCanvasRef.value.getContext('2d')

  stars.length = 0
  for (let i = 0; i < 200; i++) {
    stars.push({
      x: Math.random() * bgCanvasRef.value.width,
      y: Math.random() * bgCanvasRef.value.height,
      size: Math.random() * 2 + 0.5,
      speed: Math.random() * 0.3 + 0.1,
      opacity: Math.random() * 0.5 + 0.3,
      twinkleSpeed: Math.random() * 0.05 + 0.02
    })
  }
}

// 初始化粒子
const initParticles = () => {
  if (!particleCanvasRef.value) return
  particleCanvasRef.value.width = 600
  particleCanvasRef.value.height = 600
  particleCtx = particleCanvasRef.value.getContext('2d')

  particles.length = 0
  for (let i = 0; i < 60; i++) {
    particles.push(createParticle())
  }
}

const createParticle = (): Particle => ({
  angle: Math.random() * Math.PI * 2,
  radius: 50 + Math.random() * 250,
  speed: (Math.random() * 0.015 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
  size: Math.random() * 3 + 1,
  hue: Math.random() * 120 + 160,
  life: 0,
  maxLife: 100 + Math.random() * 150
})

// 绘制背景
const drawBackground = () => {
  if (!bgCtx) return
  const { width, height } = bgCtx.canvas

  // 深色背景
  const bgGrad = bgCtx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width * 0.7)
  bgGrad.addColorStop(0, '#0d0d1a')
  bgGrad.addColorStop(0.5, '#080812')
  bgGrad.addColorStop(1, '#020208')
  bgCtx.fillStyle = bgGrad
  bgCtx.fillRect(0, 0, width, height)

  // 绘制星星
  stars.forEach(star => {
    star.y += star.speed
    if (star.y > height) {
      star.y = 0
      star.x = Math.random() * width
    }

    const twinkle = Math.sin(time * star.twinkleSpeed) * 0.4 + 0.6
    bgCtx!.beginPath()
    bgCtx!.arc(star.x, star.y, star.size, 0, Math.PI * 2)
    bgCtx!.fillStyle = `rgba(200, 220, 255, ${star.opacity * twinkle})`
    bgCtx!.fill()

    // 星星光芒
    if (star.size > 1.5) {
      const glow = bgCtx!.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 4)
      glow.addColorStop(0, `rgba(150, 180, 255, ${star.opacity * 0.3})`)
      glow.addColorStop(1, 'transparent')
      bgCtx!.fillStyle = glow
      bgCtx!.fillRect(star.x - star.size * 4, star.y - star.size * 4, star.size * 8, star.size * 8)
    }
  })
}

// 绘制传送门粒子
const drawPortalParticles = () => {
  if (!particleCtx) return
  const { width, height } = particleCtx.canvas
  const centerX = width / 2
  const centerY = height / 2

  particleCtx.clearRect(0, 0, width, height)

  particles.forEach(p => {
    p.life++
    p.angle += p.speed

    const x = centerX + Math.cos(p.angle) * p.radius
    const y = centerY + Math.sin(p.angle) * p.radius

    // 拖尾
    for (let i = 0; i < 4; i++) {
      const trailAngle = p.angle - i * 0.08
      const trailX = centerX + Math.cos(trailAngle) * p.radius
      const trailY = centerY + Math.sin(trailAngle) * p.radius
      const trailOpacity = (1 - i / 4) * 0.5

      particleCtx!.beginPath()
      particleCtx!.arc(trailX, trailY, p.size * (1 - i * 0.2), 0, Math.PI * 2)
      particleCtx!.fillStyle = `hsla(${p.hue}, 80%, 60%, ${trailOpacity})`
      particleCtx!.fill()
    }

    // 发光效果
    const glow = particleCtx!.createRadialGradient(x, y, 0, x, y, p.size * 5)
    glow.addColorStop(0, `hsla(${p.hue}, 80%, 70%, 0.8)`)
    glow.addColorStop(0.3, `hsla(${p.hue}, 80%, 60%, 0.3)`)
    glow.addColorStop(1, 'transparent')
    particleCtx!.fillStyle = glow
    particleCtx!.beginPath()
    particleCtx!.arc(x, y, p.size * 5, 0, Math.PI * 2)
    particleCtx!.fill()
  })
}

// 动画循环
const animate = () => {
  time++
  drawBackground()
  drawPortalParticles()
  animationId = requestAnimationFrame(animate)
}

// 初始化动画
const initAnimations = () => {
  initBackground()
  initParticles()
  animate()

  const tl = gsap.timeline()

  // 传送门入场
  tl.fromTo(portalRef.value,
    { scale: 0, opacity: 0 },
    { scale: 1, opacity: 1, duration: 1.5, ease: 'power3.out' }
  )

  // 卡片依次入场
  tl.fromTo('.floating-card',
    { scale: 0, rotationY: -90, opacity: 0 },
    {
      scale: 1,
      rotationY: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.15,
      ease: 'back.out(1.2)'
    },
    '-=0.8'
  )

  // 标题入场
  tl.fromTo(titleRef.value,
    { y: 60, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
    '-=0.5'
  )

  // 提示文字
  tl.fromTo(scrollHintRef.value,
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
    '-=0.3'
  )

  cleanupFns.push(() => tl.kill())

  // 卡片旋转动画
  if (cardsOrbitRef.value) {
    gsap.to(cardsOrbitRef.value, {
      rotation: 360,
      duration: 60,
      ease: 'none',
      repeat: -1
    })
  }

  // 卡片悬浮动画
  cardRefs.value.forEach((card, i) => {
    if (!card) return
    gsap.to(card, {
      y: -15,
      duration: 2 + i * 0.3,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: i * 0.2
    })
  })

  // 滚动动画
  if (sectionRef.value) {
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5
      }
    })

    scrollTl.to(portalRef.value, {
      scale: 1.8,
      filter: 'blur(10px) brightness(1.3)',
      duration: 1
    })

    scrollTl.to('.floating-card', {
      scale: 0.8,
      opacity: 0,
      stagger: 0.05,
      duration: 0.5
    }, '<')

    scrollTl.to(titleRef.value, {
      y: -100,
      opacity: 0,
      duration: 0.5
    }, '<')

    scrollTl.to(scrollHintRef.value, {
      opacity: 0,
      duration: 0.3
    }, '<')

    cleanupFns.push(() => scrollTl.kill())
  }
}

// 窗口调整
const handleResize = () => {
  initBackground()
}

// 生命周期
onMounted(() => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      initAnimations()
    })
  })
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  if (animationId) cancelAnimationFrame(animationId)
  window.removeEventListener('resize', handleResize)
  ScrollTrigger.getAll().forEach(t => t.kill())
})
</script>

<style scoped lang="scss">
.portal-section {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: #020208;
}

.portal-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.nebula-layer {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(ellipse at 30% 30%, rgba(120, 0, 255, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 70%, rgba(0, 200, 255, 0.06) 0%, transparent 50%);
  pointer-events: none;
}

// 传送门容器
.portal-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 600px;
  z-index: 5;
}

.portal-particles-canvas {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
}

// 传送门光环
.portal-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  transform: translate(-50%, -50%);

  &.ring-outer {
    width: 500px;
    height: 500px;
    border: 2px solid rgba(0, 200, 255, 0.3);
    animation: ringRotate 30s linear infinite;

    .ring-segment {
      position: absolute;
      width: 60px;
      height: 4px;
      background: linear-gradient(90deg, transparent, #00c8ff, transparent);
      top: 50%;
      left: 50%;
      transform-origin: center;
      transform: translate(-50%, -50%) rotate(calc(var(--i) * 45deg)) translateX(230px);
      animation: segmentPulse 2s ease-in-out infinite;
      animation-delay: calc(var(--i) * 0.25s);
      box-shadow: 0 0 20px rgba(0, 200, 255, 0.5);
    }
  }

  &.ring-middle {
    width: 380px;
    height: 380px;
    border: 1px dashed rgba(200, 0, 255, 0.4);
    animation: ringRotate 20s linear infinite reverse;

    .ring-dash {
      position: absolute;
      inset: -2px;
      border-radius: 50%;
      border: 3px solid transparent;
      border-top-color: #c800ff;
      border-bottom-color: #00c8ff;
      animation: dashSpin 3s linear infinite;
    }
  }

  &.ring-inner {
    width: 260px;
    height: 260px;
    border: 2px solid rgba(255, 200, 100, 0.3);
    animation: ringRotate 15s linear infinite;
  }
}

@keyframes ringRotate {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

@keyframes segmentPulse {
  0%, 100% { opacity: 0.5; width: 60px; }
  50% { opacity: 1; width: 80px; }
}

@keyframes dashSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

// 传送门核心
.portal-core {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 150px;
  height: 150px;
  z-index: 10;
}

.core-vortex {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    transparent 0deg,
    rgba(0, 200, 255, 0.3) 60deg,
    transparent 120deg,
    rgba(200, 0, 255, 0.3) 180deg,
    transparent 240deg,
    rgba(0, 200, 255, 0.3) 300deg,
    transparent 360deg
  );
  animation: vortexSpin 4s linear infinite;
  filter: blur(8px);
}

@keyframes vortexSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.core-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(0, 200, 255, 0.5) 40%, transparent 70%);
  box-shadow: 
    0 0 40px rgba(0, 200, 255, 0.8),
    0 0 80px rgba(200, 0, 255, 0.4),
    inset 0 0 30px rgba(255, 255, 255, 0.5);
  animation: corePulse 2s ease-in-out infinite;
}

@keyframes corePulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.8; }
}

// 卡片轨道
.cards-orbit {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transform-style: preserve-3d;
  perspective: 1000px;
  z-index: 15;
}

// 悬浮卡片
.floating-card {
  position: absolute;
  width: 180px;
  padding: 20px;
  background: linear-gradient(135deg, rgba(20, 20, 40, 0.9) 0%, rgba(10, 10, 25, 0.95) 100%);
  border: 1px solid rgba(0, 200, 255, 0.2);
  border-radius: 16px;
  transform-style: preserve-3d;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  backdrop-filter: blur(10px);

  // 轨道定位
  top: 50%;
  left: 50%;
  transform: 
    translate(-50%, -50%)
    rotate(var(--angle))
    translateY(calc(var(--orbit-radius) * -1))
    rotate(calc(var(--angle) * -1));

  &:hover {
    transform: 
      translate(-50%, -50%)
      rotate(var(--angle))
      translateY(calc(var(--orbit-radius) * -1.15))
      rotate(calc(var(--angle) * -1))
      scale(1.08);
    border-color: rgba(0, 200, 255, 0.5);
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.4),
      0 0 30px rgba(0, 200, 255, 0.2);

    .card-glow {
      opacity: 1;
    }

    .card-icon {
      transform: scale(1.1);
      color: #00c8ff;
    }

    .card-border {
      opacity: 1;
    }
  }
}

.card-glow {
  position: absolute;
  inset: -2px;
  background: linear-gradient(135deg, rgba(0, 200, 255, 0.1), rgba(200, 0, 255, 0.1));
  border-radius: 18px;
  opacity: 0;
  transition: opacity 0.3s;
  z-index: -1;
}

.card-border {
  position: absolute;
  inset: 0;
  border-radius: 16px;
  border: 1px solid transparent;
  background: linear-gradient(135deg, #00c8ff, #c800ff) border-box;
  -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: destination-out;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s;
}

.card-content {
  position: relative;
  z-index: 1;
}

.card-icon {
  font-size: 2rem;
  color: rgba(0, 200, 255, 0.7);
  margin-bottom: 12px;
  transition: all 0.3s;
}

.card-title {
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 8px;
  letter-spacing: 0.05em;
}

.card-desc {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 12px;
  line-height: 1.5;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.card-tag {
  font-size: 0.65rem;
  padding: 3px 8px;
  background: rgba(0, 200, 255, 0.1);
  border: 1px solid rgba(0, 200, 255, 0.2);
  border-radius: 20px;
  color: rgba(0, 200, 255, 0.8);
}

// 标题
.portal-title {
  position: absolute;
  bottom: 12%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 25;

  h1 {
    font-size: 4.5rem;
    font-weight: 900;
    margin: 0;
    background: linear-gradient(135deg, #00c8ff 0%, #c800ff 50%, #ffc800 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: 0.2em;
    text-shadow: 0 0 60px rgba(0, 200, 255, 0.5);
  }
}

.title-sub {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 8px 0 0;
  letter-spacing: 0.5em;
}

.title-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 12px;

  &.reverse {
    flex-direction: row-reverse;
    margin-bottom: 0;
    margin-top: 12px;
  }
}

.deco-star {
  font-size: 0.8rem;
  color: #00c8ff;
  animation: starTwinkle 2s ease-in-out infinite;
}

@keyframes starTwinkle {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

.deco-line {
  width: 60px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 200, 255, 0.5), transparent);
}

// 角落装饰
.corner-decor {
  position: absolute;
  width: 60px;
  height: 60px;
  z-index: 20;

  &.top-left {
    top: 30px;
    left: 30px;
  }

  &.bottom-right {
    bottom: 30px;
    right: 30px;
    transform: rotate(180deg);
  }
}

.corner-svg {
  width: 100%;
  height: 100%;
  color: rgba(0, 200, 255, 0.3);
}

// 底部提示
.scroll-hint {
  position: absolute;
  bottom: 4%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 25;

  span {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.4);
    letter-spacing: 0.2em;
  }
}

.hint-arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 8px;

  span {
    width: 1px;
    height: 20px;
    background: linear-gradient(to bottom, rgba(0, 200, 255, 0.6), transparent);
    animation: arrowBounce 1.5s ease-in-out infinite;

    &:last-child {
      height: 15px;
      animation-delay: 0.2s;
    }
  }
}

@keyframes arrowBounce {
  0%, 100% { transform: translateY(0); opacity: 1; }
  50% { transform: translateY(5px); opacity: 0.5; }
}

// 响应式
@media (max-width: 768px) {
  .portal-container {
    width: 300px;
    height: 300px;
  }

  .ring-outer { width: 250px; height: 250px; }
  .ring-middle { width: 190px; height: 190px; }
  .ring-inner { width: 130px; height: 130px; }
  .portal-core { width: 80px; height: 80px; }
  .core-inner { width: 50px; height: 50px; }

  .floating-card {
    width: 140px;
    padding: 15px;
  }

  .card-icon { font-size: 1.5rem; }
  .card-title { font-size: 0.85rem; }
  .card-desc { font-size: 0.7rem; }

  .portal-title h1 {
    font-size: 2.5rem;
  }
}
</style>
