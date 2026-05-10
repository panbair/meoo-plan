<template>
  <section ref="sectionRef" class="liquid-section">
    <!-- 液态金属背景 -->
    <div class="liquid-bg">
      <canvas ref="liquidCanvasRef" class="liquid-canvas"></canvas>
      <div class="liquid-gradient"></div>
    </div>

    <!-- 粒子层 -->
    <canvas ref="particleCanvasRef" class="particle-canvas"></canvas>

    <!-- 标题区域 -->
    <div class="liquid-header" ref="headerRef">
      <div class="header-badge">未来科技</div>
      <h1 class="header-title">
        <span class="title-line">液态</span>
        <span class="title-line accent">金属</span>
      </h1>
      <p class="header-subtitle">Metallic Liquid Experience</p>
      <div class="header-line">
        <span class="line-dot"></span>
        <span class="line-bar"></span>
        <span class="line-dot"></span>
      </div>
    </div>

    <!-- 卡片容器 -->
    <div class="liquid-cards" ref="cardsContainerRef">
      <!-- 卡片1: 水滴效应 -->
      <div class="liquid-card card-drop card-item" data-index="0">
        <div class="card-shimmer"></div>
        <div class="card-glow"></div>
        <div class="card-content">
          <div class="card-icon">
            <svg viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="28" r="16" stroke="currentColor" stroke-width="2"/>
              <path d="M24 12C24 12 16 20 16 26C16 30.4183 19.5817 34 24 34C28.4183 34 32 30.4183 32 26C32 20 24 12 24 12Z" fill="currentColor" opacity="0.3"/>
            </svg>
          </div>
          <div class="card-number">01</div>
          <h3 class="card-title">液态水滴</h3>
          <p class="card-desc">模拟真实水滴的表面张力效果，呈现出流动的金属光泽</p>
          <div class="card-metrics">
            <div class="metric">
              <span class="metric-value">96%</span>
              <span class="metric-label">还原度</span>
            </div>
            <div class="metric">
              <span class="metric-value">60fps</span>
              <span class="metric-label">流畅度</span>
            </div>
          </div>
        </div>
        <div class="card-reflection"></div>
      </div>

      <!-- 卡片2: 波浪效应 -->
      <div class="liquid-card card-wave card-item" data-index="1">
        <div class="card-shimmer"></div>
        <div class="card-glow"></div>
        <div class="card-content">
          <div class="card-icon">
            <svg viewBox="0 0 48 48" fill="none">
              <path d="M4 24C8 20 12 28 16 24C20 20 24 28 28 24C32 20 36 28 40 24C44 20 44 24 44 24" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M4 32C8 28 12 36 16 32C20 28 24 36 28 32C32 28 36 36 40 32C44 28 44 32 44 32" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
              <path d="M4 16C8 12 12 20 16 16C20 12 24 20 28 16C32 12 36 20 40 16C44 12 44 16 44 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
            </svg>
          </div>
          <div class="card-number">02</div>
          <h3 class="card-title">动态波浪</h3>
          <p class="card-desc">连续不断的波浪流动，模拟液态金属的动态特性</p>
          <div class="card-metrics">
            <div class="metric">
              <span class="metric-value">98%</span>
              <span class="metric-label">流畅度</span>
            </div>
            <div class="metric">
              <span class="metric-value">12层</span>
              <span class="metric-label">波浪数</span>
            </div>
          </div>
        </div>
        <div class="card-reflection"></div>
      </div>

      <!-- 卡片3: 镜面反射 -->
      <div class="liquid-card card-mirror card-item" data-index="2">
        <div class="card-shimmer"></div>
        <div class="card-glow"></div>
        <div class="card-content">
          <div class="card-icon">
            <svg viewBox="0 0 48 48" fill="none">
              <rect x="6" y="8" width="36" height="28" rx="4" stroke="currentColor" stroke-width="2"/>
              <path d="M6 36L18 28L28 34L42 20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="14" cy="18" r="4" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <div class="card-number">03</div>
          <h3 class="card-title">镜面反射</h3>
          <p class="card-desc">真实的镜面反射效果，呈现金属表面的光泽质感</p>
          <div class="card-metrics">
            <div class="metric">
              <span class="metric-value">4K</span>
              <span class="metric-label">分辨率</span>
            </div>
            <div class="metric">
              <span class="metric-value">180°</span>
              <span class="metric-label">视角</span>
            </div>
          </div>
        </div>
        <div class="card-reflection"></div>
      </div>

      <!-- 卡片4: 融合效果 -->
      <div class="liquid-card card-fusion card-item" data-index="3">
        <div class="card-shimmer"></div>
        <div class="card-glow"></div>
        <div class="card-content">
          <div class="card-icon">
            <svg viewBox="0 0 48 48" fill="none">
              <circle cx="16" cy="20" r="10" stroke="currentColor" stroke-width="2"/>
              <circle cx="32" cy="28" r="10" stroke="currentColor" stroke-width="2"/>
              <circle cx="24" cy="24" r="4" fill="currentColor"/>
              <path d="M16 10V6M16 34V30M6 20H10M26 20H22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M32 18V14M32 38V34M42 28H38M22 28H26" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="card-number">04</div>
          <h3 class="card-title">融合交互</h3>
          <p class="card-desc">元素之间的自然融合，创造无限可能的视觉效果</p>
          <div class="card-metrics">
            <div class="metric">
              <span class="metric-value">∞</span>
              <span class="metric-label">可能性</span>
            </div>
            <div class="metric">
              <span class="metric-value">AI</span>
              <span class="metric-label">驱动</span>
            </div>
          </div>
        </div>
        <div class="card-reflection"></div>
      </div>
    </div>

    <!-- 底部装饰 -->
    <div class="liquid-footer" ref="footerRef">
      <div class="footer-wave"></div>
      <span class="footer-text">Scroll to Explore</span>
      <div class="footer-arrow">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 5v14M19 12l-7 7-7-7"/>
        </svg>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * CardLiquidMetal - 液态金属卡片组件
 * @description 未来科技风格的液态金属效果卡片
 */

import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ============================================================
// 类型定义
// ============================================================

interface LiquidParticle {
  x: number
  y: number
  radius: number
  vx: number
  vy: number
  hue: number
  alpha: number
}

type TweenCleanup = () => void

// ============================================================
// 响应式状态
// ============================================================

const sectionRef = ref<HTMLElement | null>(null)
const liquidCanvasRef = ref<HTMLCanvasElement | null>(null)
const particleCanvasRef = ref<HTMLCanvasElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const cardsContainerRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)

// 卡片 refs
const cardRefsMap = ref(new Map<number, HTMLElement>())

// ============================================================
// Canvas 和动画状态
// ============================================================

let liquidCtx: CanvasRenderingContext2D | null = null
let particleCtx: CanvasRenderingContext2D | null = null
let liquidAnimationId: number | null = null
let particleAnimationId: number | null = null
let time = 0
let scrollProgress = 0

const liquidParticles: LiquidParticle[] = []
const cleanupFns: TweenCleanup[] = []

// ============================================================
// 模板引用处理
// ============================================================

const setCardRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  if (el) {
    const element = el instanceof Element ? el : (el as { $el: Element }).$el
    if (element instanceof HTMLElement) {
      cardRefsMap.value.set(index, element)
    }
  } else {
    cardRefsMap.value.delete(index)
  }
}

// ============================================================
// Canvas 初始化
// ============================================================

const initLiquidCanvas = () => {
  if (!liquidCanvasRef.value) return
  
  liquidCanvasRef.value.width = window.innerWidth
  liquidCanvasRef.value.height = window.innerHeight
  liquidCtx = liquidCanvasRef.value.getContext('2d')
  
  // 初始化液态粒子
  liquidParticles.length = 0
  for (let i = 0; i < 50; i++) {
    liquidParticles.push(createLiquidParticle())
  }
}

const initParticleCanvas = () => {
  if (!particleCanvasRef.value) return
  
  particleCanvasRef.value.width = window.innerWidth
  particleCanvasRef.value.height = window.innerHeight
  particleCtx = particleCanvasRef.value.getContext('2d')
}

const createLiquidParticle = (): LiquidParticle => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  radius: 50 + Math.random() * 150,
  vx: (Math.random() - 0.5) * 0.3,
  vy: (Math.random() - 0.5) * 0.3,
  hue: 200 + Math.random() * 40, // 蓝紫色调
  alpha: 0.03 + Math.random() * 0.05
})

// ============================================================
// 绘制函数
// ============================================================

const drawLiquidBackground = () => {
  if (!liquidCtx) return
  const { width, height } = liquidCtx.canvas
  
  // 深色背景
  liquidCtx.fillStyle = '#0a0a12'
  liquidCtx.fillRect(0, 0, width, height)
  
  // 绘制液态光斑
  liquidParticles.forEach(p => {
    p.x += p.vx
    p.y += p.vy
    
    // 边界反弹
    if (p.x < -p.radius) p.x = width + p.radius
    if (p.x > width + p.radius) p.x = -p.radius
    if (p.y < -p.radius) p.y = height + p.radius
    if (p.y > height + p.radius) p.y = -p.radius
    
    // 创建渐变
    const gradient = liquidCtx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius)
    gradient.addColorStop(0, `hsla(${p.hue}, 80%, 60%, ${p.alpha})`)
    gradient.addColorStop(0.5, `hsla(${p.hue + 20}, 70%, 50%, ${p.alpha * 0.5})`)
    gradient.addColorStop(1, 'transparent')
    
    liquidCtx!.fillStyle = gradient
    liquidCtx!.beginPath()
    liquidCtx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
    liquidCtx!.fill()
  })
  
  // 绘制波浪线
  liquidCtx.strokeStyle = `hsla(210, 80%, 60%, ${0.05 + scrollProgress * 0.1})`
  liquidCtx.lineWidth = 1
  
  for (let i = 0; i < 3; i++) {
    liquidCtx.beginPath()
    for (let x = 0; x < width; x += 5) {
      const y = height * (0.4 + i * 0.15) + 
                Math.sin(x * 0.01 + time * 0.02 + i) * 30 +
                Math.sin(x * 0.02 + time * 0.015) * 15
      if (x === 0) {
        liquidCtx.moveTo(x, y)
      } else {
        liquidCtx.lineTo(x, y)
      }
    }
    liquidCtx.stroke()
  }
}

const drawParticles = () => {
  if (!particleCtx) return
  const { width, height } = particleCtx.canvas
  
  particleCtx.clearRect(0, 0, width, height)
  
  // 绘制闪光粒子
  for (let i = 0; i < 60; i++) {
    const x = (Math.sin(time * 0.01 + i * 0.5) * 0.5 + 0.5) * width
    const y = (Math.cos(time * 0.008 + i * 0.3) * 0.5 + 0.5) * height
    const size = 1 + Math.sin(time * 0.05 + i) * 0.5
    const alpha = 0.3 + Math.sin(time * 0.03 + i * 0.2) * 0.3
    
    const gradient = particleCtx.createRadialGradient(x, y, 0, x, y, size * 3)
    gradient.addColorStop(0, `hsla(200, 100%, 70%, ${alpha})`)
    gradient.addColorStop(1, 'transparent')
    
    particleCtx.fillStyle = gradient
    particleCtx.beginPath()
    particleCtx.arc(x, y, size * 3, 0, Math.PI * 2)
    particleCtx.fill()
  }
}

// ============================================================
// 动画循环
// ============================================================

const animateLiquid = () => {
  time++
  drawLiquidBackground()
  liquidAnimationId = requestAnimationFrame(animateLiquid)
}

const animateParticles = () => {
  drawParticles()
  particleAnimationId = requestAnimationFrame(animateParticles)
}

// ============================================================
// GSAP 动画
// ============================================================

const initAnimations = () => {
  // 标题入场动画 - 从两侧边缘进入
  if (headerRef.value) {
    const tl = gsap.timeline()
    
    // 徽章缩放入场
    tl.fromTo('.header-badge', 
      { scale: 0, opacity: 0, rotation: -180 },
      { scale: 1, opacity: 1, rotation: 0, duration: 0.6, ease: 'back.out(2)' }
    )
    
    // 标题行依次从两侧飞入
    .fromTo('.title-line:first-child',
      { x: -200, opacity: 0, rotationY: -90 },
      { x: 0, opacity: 1, rotationY: 0, duration: 0.8, ease: 'power3.out' },
      '-=0.3'
    )
    .fromTo('.title-line:last-child',
      { x: 200, opacity: 0, rotationY: 90 },
      { x: 0, opacity: 1, rotationY: 0, duration: 0.8, ease: 'power3.out' },
      '<'
    )
    
    // 副标题淡入
    .fromTo('.header-subtitle',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
      '-=0.4'
    )
    
    // 装饰线动画
    .fromTo('.line-bar',
      { scaleX: 0 },
      { scaleX: 1, duration: 0.6, ease: 'power2.inOut' },
      '-=0.2'
    )
    .fromTo('.line-dot',
      { scale: 0 },
      { scale: 1, duration: 0.4, stagger: 0.1, ease: 'back.out(3)' },
      '-=0.4'
    )
    
    cleanupFns.push(() => tl.kill())
  }
  
  // 卡片入场动画 - 使用 querySelectorAll 获取卡片
  const cards = document.querySelectorAll('.card-item')
  if (cards.length > 0) {
    const cardTl = gsap.timeline()
    
    // 设置卡片初始状态
    gsap.set(cards, { opacity: 0, scale: 0.5, y: 100 })
    
    // 卡片1: 从左侧滑入 + 旋转
    cardTl.to(cards[0],
      { 
        x: 0, opacity: 1, rotation: 0, scale: 1, y: 0,
        duration: 1, ease: 'power3.out' 
      },
      0.3
    )
    
    // 卡片2: 从上方落下 + 弹跳
    .to(cards[1],
      { 
        x: 0, opacity: 1, scale: 1, y: 0, 
        duration: 0.9, ease: 'back.out(1.5)' 
      },
      0.5
    )
    
    // 卡片3: 从下方升起 + 缩放
    .to(cards[2],
      { 
        x: 0, opacity: 1, scale: 1, y: 0, 
        duration: 0.9, ease: 'power2.out' 
      },
      0.7
    )
    
    // 卡片4: 从右侧滑入 + 旋转
    .to(cards[3],
      { 
        x: 0, opacity: 1, rotation: 0, scale: 1, y: 0, 
        duration: 1, ease: 'power3.out' 
      },
      0.9
    )
    
    cleanupFns.push(() => cardTl.kill())
  }
  
  // 底部装饰入场
  if (footerRef.value) {
    gsap.fromTo(footerRef.value,
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', delay: 1.2 }
    )
  }
  
  // 滚动动画
  if (sectionRef.value) {
    // 卡片滚动动画 - 依次翻转和位移
    const scrollCards = document.querySelectorAll('.card-item')
    scrollCards.forEach((card, index) => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5
        }
      })
      
      // 位移 + 旋转 + 缩放组合
      scrollTl
        .to(card, {
          y: -80 - index * 20,
          rotation: (index % 2 === 0 ? 1 : -1) * (5 + index * 2),
          scale: 0.9 - index * 0.05,
          duration: 1
        })
        .to(card, {
          opacity: 0,
          duration: 0.5
        }, '-=0.3')
      
      cleanupFns.push(() => scrollTl.kill())
    })
    
    // 标题滚动消失
    if (headerRef.value) {
      const headerTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top top',
          end: '30% top',
          scrub: 1
        }
      })
      headerTl.to(headerRef.value, {
        y: -150,
        opacity: 0,
        rotation: 5
      })
      cleanupFns.push(() => headerTl.kill())
    }
    
    // 背景渐变滚动
    const bgTl = gsap.to('.liquid-gradient', {
      backgroundPosition: '100% 100%',
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top top',
        end: 'bottom top',
        scrub: 2
      }
    })
    cleanupFns.push(() => bgTl.scrollTrigger?.kill())
  }
}

// ============================================================
// 清理函数
// ============================================================

const cleanupAnimations = () => {
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0
  
  if (liquidAnimationId) cancelAnimationFrame(liquidAnimationId)
  if (particleAnimationId) cancelAnimationFrame(particleAnimationId)
  
  cardRefsMap.value.clear()
}

// ============================================================
// 生命周期
// ============================================================

const handleResize = () => {
  initLiquidCanvas()
  initParticleCanvas()
}

onMounted(() => {
  initLiquidCanvas()
  initParticleCanvas()
  animateLiquid()
  animateParticles()
  
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      initAnimations()
    })
  })
  
  window.addEventListener('resize', handleResize)
})

onUnmounted(cleanupAnimations)
</script>

<style scoped lang="scss">
// ============================================================
// 变量定义
// ============================================================
$gold: #c9a227;
$silver: #c0c0c0;
$bronze: #cd7f32;
$primary: #4facfe;
$secondary: #00f2fe;
$accent: #f5576c;

.liquid-section {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: #0a0a12;
  perspective: 1500px;
}

// ============================================================
// 背景层
// ============================================================
.liquid-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.liquid-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.liquid-gradient {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(ellipse at 20% 30%, rgba(79, 172, 254, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 70%, rgba(245, 87, 108, 0.1) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(0, 242, 254, 0.08) 0%, transparent 60%);
  z-index: 1;
  pointer-events: none;
}

.particle-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
}

// ============================================================
// 标题区域
// ============================================================
.liquid-header {
  position: absolute;
  top: 8%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 20;
  transform-style: preserve-3d;
}

.header-badge {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  color: #4facfe;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  padding: 6px 16px;
  background: rgba(79, 172, 254, 0.1);
  border: 1px solid rgba(79, 172, 254, 0.3);
  border-radius: 20px;
  margin-bottom: 20px;
}

.header-title {
  font-size: 5rem;
  font-weight: 900;
  line-height: 1;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.title-line {
  display: block;
  background: linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  &.accent {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 50%, #f5576c 100%);
    background-size: 200% 200%;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: gradientShift 4s ease infinite;
  }
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.header-subtitle {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.3em;
  text-transform: uppercase;
  margin-top: 16px;
}

.header-line {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 24px;
}

.line-dot {
  width: 8px;
  height: 8px;
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(79, 172, 254, 0.5);
}

.line-bar {
  width: 100px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #4facfe, transparent);
  transform-origin: center;
}

// ============================================================
// 卡片容器
// ============================================================
.liquid-cards {
  position: absolute;
  bottom: 12%;
  left: 50%;
  transform: translateX(-50%);
  display: grid;
  grid-template-columns: repeat(4, 260px);
  gap: 24px;
  z-index: 15;
}

// ============================================================
// 液态金属卡片
// ============================================================
.liquid-card {
  position: relative;
  background: linear-gradient(145deg, rgba(20, 20, 35, 0.9), rgba(10, 10, 20, 0.95));
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 28px;
  cursor: pointer;
  transform-style: preserve-3d;
  perspective: 1000px;
  transition: transform 0.5s ease, box-shadow 0.5s ease;
  border: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;
  
  &:hover {
    transform: translateY(-15px) rotateX(5deg) rotateY(-5deg);
    box-shadow: 
      0 30px 60px rgba(79, 172, 254, 0.2),
      0 0 40px rgba(79, 172, 254, 0.1);
    
    .card-shimmer {
      opacity: 1;
      transform: translateX(100%);
    }
    
    .card-glow {
      opacity: 0.6;
    }
    
    &::before {
      opacity: 1;
    }
    
    .card-icon {
      transform: scale(1.1) rotate(5deg);
      filter: drop-shadow(0 0 20px currentColor);
    }
    
    .card-reflection {
      opacity: 0.3;
    }
  }
  
  // 卡片特定颜色
  &.card-drop:hover { box-shadow: 0 30px 60px rgba(79, 172, 254, 0.25); }
  &.card-wave:hover { box-shadow: 0 30px 60px rgba(0, 242, 254, 0.25); }
  &.card-mirror:hover { box-shadow: 0 30px 60px rgba(245, 87, 108, 0.25); }
  &.card-fusion:hover { box-shadow: 0 30px 60px rgba(167, 139, 250, 0.25); }
}

// 闪光效果
.card-shimmer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    105deg,
    transparent 40%,
    rgba(255, 255, 255, 0.15) 50%,
    transparent 60%
  );
  transform: translateX(-100%);
  opacity: 0;
  transition: opacity 0.6s ease, transform 0.8s ease;
  pointer-events: none;
  z-index: 10;
}

// 发光边框效果
.card-glow {
  position: absolute;
  inset: -2px;
  border-radius: 26px;
  background: linear-gradient(45deg, transparent, rgba(79, 172, 254, 0.5), transparent);
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: -1;
  filter: blur(8px);
  
  .card-drop & { background: linear-gradient(45deg, transparent, rgba(79, 172, 254, 0.5), transparent); }
  .card-wave & { background: linear-gradient(45deg, transparent, rgba(0, 242, 254, 0.5), transparent); }
  .card-mirror & { background: linear-gradient(45deg, transparent, rgba(245, 87, 108, 0.5), transparent); }
  .card-fusion & { background: linear-gradient(45deg, transparent, rgba(167, 139, 250, 0.5), transparent); }
}

// 边框动画
.liquid-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 24px;
  padding: 2px;
  background: linear-gradient(135deg, rgba(79, 172, 254, 0.3), transparent 50%, rgba(79, 172, 254, 0.3));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.4s ease;
  
  .card-drop & { background: linear-gradient(135deg, rgba(79, 172, 254, 0.5), transparent 50%, rgba(79, 172, 254, 0.5)); }
  .card-wave & { background: linear-gradient(135deg, rgba(0, 242, 254, 0.5), transparent 50%, rgba(0, 242, 254, 0.5)); }
  .card-mirror & { background: linear-gradient(135deg, rgba(245, 87, 108, 0.5), transparent 50%, rgba(245, 87, 108, 0.5)); }
  .card-fusion & { background: linear-gradient(135deg, rgba(167, 139, 250, 0.5), transparent 50%, rgba(167, 139, 250, 0.5)); }
}

// 卡片内容
.card-content {
  position: relative;
  z-index: 2;
}

.card-icon {
  width: 56px;
  height: 56px;
  color: #4facfe;
  margin-bottom: 16px;
  transition: transform 0.4s ease, filter 0.4s ease;
  
  .card-wave & { color: #00f2fe; }
  .card-mirror & { color: #f5576c; }
  .card-fusion & { color: #a78bfa; }
  
  svg {
    width: 100%;
    height: 100%;
  }
}

.card-number {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 3.5rem;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.03);
  line-height: 1;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 10px;
}

.card-desc {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
  margin: 0 0 20px;
}

.card-metrics {
  display: flex;
  gap: 20px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.metric {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.metric-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #4facfe;
  
  .card-wave & { color: #00f2fe; }
  .card-mirror & { color: #f5576c; }
  .card-fusion & { color: #a78bfa; }
}

.metric-label {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

// 反射效果
.card-reflection {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(to top, rgba(255, 255, 255, 0.03), transparent);
  border-radius: 0 0 24px 24px;
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

// ============================================================
// 底部装饰
// ============================================================
.liquid-footer {
  position: absolute;
  bottom: 3%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 20;
}

.footer-wave {
  width: 200px;
  height: 40px;
  margin: 0 auto 12px;
  background: linear-gradient(90deg, transparent, rgba(79, 172, 254, 0.3), transparent);
  border-radius: 50%;
  filter: blur(10px);
}

.footer-text {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.2em;
}

.footer-arrow {
  width: 24px;
  height: 24px;
  margin: 8px auto 0;
  color: rgba(79, 172, 254, 0.6);
  animation: bounceDown 2s ease-in-out infinite;
  
  svg {
    width: 100%;
    height: 100%;
  }
}

@keyframes bounceDown {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(8px); }
}

// ============================================================
// 响应式
// ============================================================
@media (max-width: 1200px) {
  .liquid-cards {
    grid-template-columns: repeat(2, 260px);
    bottom: 15%;
  }
}

@media (max-width: 768px) {
  .header-title { font-size: 2.8rem; }
  .liquid-cards {
    grid-template-columns: 1fr;
    max-width: 300px;
    bottom: 10%;
  }
  .liquid-header { top: 5%; }
}
</style>
