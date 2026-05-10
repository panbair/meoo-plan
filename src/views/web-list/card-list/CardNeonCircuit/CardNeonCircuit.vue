<template>
  <section ref="sectionRef" class="circuit-section">
    <!-- 电路背景 -->
    <div class="circuit-bg">
      <canvas ref="bgCanvasRef" class="bg-canvas"></canvas>
      <div class="circuit-overlay"></div>
    </div>

    <!-- 标题区域 -->
    <div ref="headerRef" class="circuit-header">
      <div class="header-badge">
        <span class="badge-pulse"></span>
        Neon Circuit Tech
      </div>
      <h1 class="header-title">
        <span class="title-line">霓虹</span>
        <span class="title-line accent">电路</span>
      </h1>
      <p class="header-subtitle">Circuit Board Experience</p>
      <div class="header-circuit">
        <svg viewBox="0 0 200 40" class="circuit-svg">
          <path class="circuit-line" d="M0 20 H40 L60 10 L80 30 L100 10 L120 30 L140 20 H200" />
          <circle class="circuit-node" cx="40" cy="20" r="4" />
          <circle class="circuit-node" cx="100" cy="20" r="4" />
          <circle class="circuit-node" cx="160" cy="20" r="4" />
        </svg>
      </div>
    </div>

    <!-- 卡片容器 -->
    <div ref="cardsRef" class="circuit-cards">
      <!-- 左侧卡片组 -->
      <div class="cards-left">
        <div
          v-for="(card, index) in leftCards"
          :key="card.id"
          :ref="(el) => setCardRef(el, index)"
          class="circuit-card"
          :class="card.className"
        >
          <!-- 电路线条 -->
          <div class="card-circuit-lines">
            <svg viewBox="0 0 240 360" class="lines-svg">
              <path class="line-path" d="M0 180 L60 180 L80 140 L120 220 L160 140 L200 180 L240 180" />
              <path class="line-path delay-1" d="M0 180 L60 180 L80 220 L120 140 L160 220 L200 180 L240 180" />
              <circle class="circuit-dot" cx="60" cy="180" r="3" />
              <circle class="circuit-dot delay-1" cx="120" cy="180" r="3" />
              <circle class="circuit-dot delay-2" cx="180" cy="180" r="3" />
            </svg>
          </div>

          <!-- 卡片内容 -->
          <div :ref="(el) => setInnerRef(el, index)" class="card-inner">
            <div class="card-front">
              <div class="card-glow-effect"></div>
              <div class="card-icon" v-html="card.icon"></div>
              <div class="card-badge">{{ card.badge }}</div>
              <h3 class="card-title">{{ card.title }}</h3>
              <p class="card-desc">{{ card.desc }}</p>
              <div class="card-stats">
                <div class="stat">
                  <span class="stat-value">{{ card.statValue }}</span>
                  <span class="stat-label">{{ card.statLabel }}</span>
                </div>
              </div>
            </div>
            <div class="card-back" :style="{ background: card.gradient }">
              <div class="back-circuit"></div>
              <h3>{{ card.title }}</h3>
              <p>{{ card.descBack }}</p>
              <div class="card-specs">
                <div v-for="(spec, i) in card.specs" :key="i" class="spec-item">
                  <span class="spec-label">{{ spec.label }}</span>
                  <span class="spec-value">{{ spec.value }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧卡片组 -->
      <div class="cards-right">
        <div
          v-for="(card, index) in rightCards"
          :key="card.id"
          :ref="(el) => setCardRef(el, index + 2)"
          class="circuit-card"
          :class="card.className"
        >
          <!-- 电路线条 -->
          <div class="card-circuit-lines">
            <svg viewBox="0 0 240 360" class="lines-svg">
              <path class="line-path" d="M0 180 L60 180 L80 220 L120 140 L160 220 L200 180 L240 180" />
              <path class="line-path delay-1" d="M0 180 L60 180 L80 140 L120 220 L160 140 L200 180 L240 180" />
              <circle class="circuit-dot" cx="60" cy="180" r="3" />
              <circle class="circuit-dot delay-1" cx="120" cy="180" r="3" />
              <circle class="circuit-dot delay-2" cx="180" cy="180" r="3" />
            </svg>
          </div>

          <!-- 卡片内容 -->
          <div :ref="(el) => setInnerRef(el, index + 2)" class="card-inner">
            <div class="card-front">
              <div class="card-glow-effect"></div>
              <div class="card-icon" v-html="card.icon"></div>
              <div class="card-badge">{{ card.badge }}</div>
              <h3 class="card-title">{{ card.title }}</h3>
              <p class="card-desc">{{ card.desc }}</p>
              <div class="card-stats">
                <div class="stat">
                  <span class="stat-value">{{ card.statValue }}</span>
                  <span class="stat-label">{{ card.statLabel }}</span>
                </div>
              </div>
            </div>
            <div class="card-back" :style="{ background: card.gradient }">
              <div class="back-circuit"></div>
              <h3>{{ card.title }}</h3>
              <p>{{ card.descBack }}</p>
              <div class="card-specs">
                <div v-for="(spec, i) in card.specs" :key="i" class="spec-item">
                  <span class="spec-label">{{ spec.label }}</span>
                  <span class="spec-value">{{ spec.value }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部提示 -->
    <div ref="footerRef" class="circuit-footer">
      <span>Scroll to Explore</span>
      <div class="footer-circuit">
        <span class="footer-line"></span>
        <span class="footer-dot"></span>
        <span class="footer-line"></span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * CardNeonCircuit - 霓虹电路卡片组件
 * @description 霓虹电路主题的创新卡片，展示电路模块与科技元素
 */

import { ref, onMounted, onUnmounted, computed } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ============================================================
// 类型定义
// ============================================================

interface Spec {
  label: string
  value: string
}

interface CircuitCard {
  id: string
  icon: string
  badge: string
  title: string
  desc: string
  descBack: string
  gradient: string
  color: string
  className: string
  statValue: string
  statLabel: string
  specs: Spec[]
}

type TweenCleanup = () => void

// ============================================================
// 常量数据
// ============================================================

const CARDS_DATA: CircuitCard[] = [
  {
    id: 'cpu',
    icon: '<svg viewBox="0 0 48 48" fill="none"><rect x="12" y="12" width="24" height="24" rx="2" stroke="currentColor" stroke-width="2"/><rect x="16" y="16" width="16" height="16" fill="currentColor" opacity="0.3"/><path d="M18 8v4M24 8v4M30 8v4M18 36v4M24 36v4M30 36v4M8 18h4M8 24h4M8 30h4M36 18h4M36 24h4M36 30h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    badge: 'Core',
    title: '处理器',
    desc: '高性能中央处理单元',
    descBack: '采用先进制程工艺，多核心架构提供极致计算性能',
    gradient: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)',
    color: '#00ff88',
    className: 'card-cpu',
    statValue: '8',
    statLabel: '核心',
    specs: [
      { label: '频率', value: '4.5GHz' },
      { label: '功耗', value: '65W' },
      { label: '缓存', value: '32MB' }
    ]
  },
  {
    id: 'memory',
    icon: '<svg viewBox="0 0 48 48" fill="none"><rect x="6" y="14" width="36" height="20" rx="2" stroke="currentColor" stroke-width="2"/><path d="M10 14v20M16 14v20M22 14v20M28 14v20M34 14v20M38 14v20" stroke="currentColor" stroke-width="1.5"/><path d="M6 18h4M6 24h4M6 30h4M38 18h4M38 24h4M38 30h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    badge: 'Storage',
    title: '存储器',
    desc: '高速数据传输模块',
    descBack: 'DDR5新一代内存技术，超大带宽满足AI计算需求',
    gradient: 'linear-gradient(135deg, #ff0080 0%, #cc0066 100%)',
    color: '#ff0080',
    className: 'card-memory',
    statValue: '64GB',
    statLabel: '容量',
    specs: [
      { label: '频率', value: '4800MHz' },
      { label: '带宽', value: '76.8GB/s' },
      { label: '时序', value: 'CL40' }
    ]
  },
  {
    id: 'sensor',
    icon: '<svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="16" stroke="currentColor" stroke-width="2"/><circle cx="24" cy="24" r="8" stroke="currentColor" stroke-width="2"/><circle cx="24" cy="24" r="3" fill="currentColor"/><path d="M24 8v4M24 36v4M8 24h4M36 24h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    badge: 'Input',
    title: '传感器',
    desc: '高精度环境感知',
    descBack: '多模态传感器融合，实时采集温度、湿度、光照等数据',
    gradient: 'linear-gradient(135deg, #00d4ff 0%, #00a8cc 100%)',
    color: '#00d4ff',
    className: 'card-sensor',
    statValue: '12',
    statLabel: '通道',
    specs: [
      { label: '精度', value: '0.01°' },
      { label: '采样', value: '1kHz' },
      { label: '接口', value: 'I2C/SPI' }
    ]
  },
  {
    id: 'communication',
    icon: '<svg viewBox="0 0 48 48" fill="none"><path d="M8 16c0-8.8 7.2-16 16-16s16 7.2 16 16" stroke="currentColor" stroke-width="2"/><path d="M8 24c0-8.8 7.2-16 16-16s16 7.2 16 16" stroke="currentColor" stroke-width="2" opacity="0.6"/><path d="M8 32c0-8.8 7.2-16 16-16s16 7.2 16 16" stroke="currentColor" stroke-width="2" opacity="0.3"/><circle cx="24" cy="32" r="4" fill="currentColor"/></svg>',
    badge: 'Wireless',
    title: '通信模块',
    desc: '高速无线连接',
    descBack: '5G/WiFi6E双模通信，低延迟高速率物联网解决方案',
    gradient: 'linear-gradient(135deg, #ffaa00 0%, #cc8800 100%)',
    color: '#ffaa00',
    className: 'card-comm',
    statValue: '10Gbps',
    statLabel: '速率',
    specs: [
      { label: '延迟', value: '1ms' },
      { label: '距离', value: '100m' },
      { label: '协议', value: '5G/WiFi6' }
    ]
  }
]

// ============================================================
// 响应式状态
// ============================================================

const sectionRef = ref<HTMLElement | null>(null)
const bgCanvasRef = ref<HTMLCanvasElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const cardsRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)

const cardRefsMap = ref(new Map<number, HTMLElement>())
const innerRefsMap = ref(new Map<number, HTMLElement>())

let bgCtx: CanvasRenderingContext2D | null = null
let animationId: number | null = null
let time = 0
const cleanupFns: TweenCleanup[] = []

const leftCards = computed(() => CARDS_DATA.slice(0, 2))
const rightCards = computed(() => CARDS_DATA.slice(2, 4))

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

const setInnerRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  if (el) {
    const element = el instanceof Element ? el : (el as { $el: Element }).$el
    if (element instanceof HTMLElement) {
      innerRefsMap.value.set(index, element)
    }
  } else {
    innerRefsMap.value.delete(index)
  }
}

// ============================================================
// Canvas 背景
// ============================================================

interface CircuitNode {
  x: number
  y: number
  connections: number[]
  pulsePhase: number
}

const circuitNodes: CircuitNode[] = []
const circuitConnections: { start: number; end: number }[] = []

const initBgCanvas = () => {
  if (!bgCanvasRef.value) return
  
  bgCanvasRef.value.width = window.innerWidth
  bgCanvasRef.value.height = window.innerHeight
  bgCtx = bgCanvasRef.value.getContext('2d')
  
  circuitNodes.length = 0
  const spacing = 80
  for (let x = spacing; x < window.innerWidth; x += spacing) {
    for (let y = spacing; y < window.innerHeight; y += spacing) {
      if (Math.random() > 0.3) {
        circuitNodes.push({
          x,
          y,
          connections: [],
          pulsePhase: Math.random() * Math.PI * 2
        })
      }
    }
  }
  
  circuitConnections.length = 0
  for (let i = 0; i < circuitNodes.length; i++) {
    for (let j = i + 1; j < circuitNodes.length; j++) {
      const dx = circuitNodes[i].x - circuitNodes[j].x
      const dy = circuitNodes[i].y - circuitNodes[j].y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < spacing * 1.5 && Math.random() > 0.5) {
        circuitConnections.push({ start: i, end: j })
        circuitNodes[i].connections.push(j)
        circuitNodes[j].connections.push(i)
      }
    }
  }
}

const drawBg = () => {
  if (!bgCtx) return
  const { width, height } = bgCtx.canvas
  
  bgCtx.fillStyle = 'rgba(5, 5, 15, 0.2)'
  bgCtx.fillRect(0, 0, width, height)
  
  // 绘制连线
  circuitConnections.forEach(conn => {
    const start = circuitNodes[conn.start]
    const end = circuitNodes[conn.end]
    const pulse = (Math.sin(time * 0.03 + start.pulsePhase) + 1) / 2
    
    bgCtx!.beginPath()
    bgCtx!.moveTo(start.x, start.y)
    bgCtx!.lineTo(end.x, end.y)
    bgCtx!.strokeStyle = `rgba(0, 255, 136, ${0.1 + pulse * 0.15})`
    bgCtx!.lineWidth = 1
    bgCtx!.stroke()
  })
  
  // 绘制节点
  circuitNodes.forEach(node => {
    const pulse = (Math.sin(time * 0.05 + node.pulsePhase) + 1) / 2
    
    bgCtx!.beginPath()
    bgCtx!.arc(node.x, node.y, 2 + pulse * 2, 0, Math.PI * 2)
    bgCtx!.fillStyle = `rgba(0, 255, 136, ${0.3 + pulse * 0.5})`
    bgCtx!.fill()
    
    if (pulse > 0.8) {
      bgCtx!.beginPath()
      bgCtx!.arc(node.x, node.y, 6, 0, Math.PI * 2)
      bgCtx!.fillStyle = `rgba(0, 255, 136, ${pulse * 0.3})`
      bgCtx!.fill()
    }
  })
  
  time++
}

const animateBg = () => {
  drawBg()
  animationId = requestAnimationFrame(animateBg)
}

// ============================================================
// GSAP 动画
// ============================================================

const initAnimations = () => {
  // 标题入场动画
  if (headerRef.value) {
    const tl = gsap.timeline()
    
    tl.fromTo('.header-badge',
      { x: -100, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
    )
    .fromTo('.title-line:first-child',
      { x: -150, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
      '-=0.3'
    )
    .fromTo('.title-line:last-child',
      { x: 150, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
      '<'
    )
    .fromTo('.header-subtitle',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
      '-=0.3'
    )
    .fromTo('.circuit-svg',
      { scaleX: 0 },
      { scaleX: 1, duration: 0.8, ease: 'power2.inOut' },
      '-=0.2'
    )
    
    cleanupFns.push(() => tl.kill())
  }
  
  // 左侧卡片入场 - 从左边边缘滑入
  const leftCardsEls = document.querySelectorAll('.cards-left .circuit-card')
  if (leftCardsEls.length > 0) {
    const leftTl = gsap.timeline()
    
    leftCardsEls.forEach((card, index) => {
      gsap.set(card, { x: -window.innerWidth, opacity: 0 })
      leftTl.to(card,
        { x: 0, opacity: 1, duration: 1, ease: 'power3.out' },
        0.3 + index * 0.2
      )
    })
    
    cleanupFns.push(() => leftTl.kill())
  }
  
  // 右侧卡片入场 - 从右边边缘滑入
  const rightCardsEls = document.querySelectorAll('.cards-right .circuit-card')
  if (rightCardsEls.length > 0) {
    const rightTl = gsap.timeline()
    
    rightCardsEls.forEach((card, index) => {
      gsap.set(card, { x: window.innerWidth, opacity: 0 })
      rightTl.to(card,
        { x: 0, opacity: 1, duration: 1, ease: 'power3.out' },
        0.3 + index * 0.2
      )
    })
    
    cleanupFns.push(() => rightTl.kill())
  }
  
  // 电路线条动画
  gsap.fromTo('.line-path',
    { strokeDashoffset: 1000 },
    { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut' }
  )
  
  gsap.fromTo('.circuit-dot',
    { scale: 0, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.4, stagger: 0.15, ease: 'back.out(2)' }
  )
  
  // 底部入场
  if (footerRef.value) {
    gsap.fromTo(footerRef.value,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', delay: 1.5 }
    )
  }
  
  // 滚动动画 - 卡片从两侧边缘进入/退出
  if (sectionRef.value) {
    // 左侧卡片滚动动画
    leftCardsEls.forEach((card, index) => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5
        }
      })
      
      scrollTl
        .to(card, {
          x: -window.innerWidth * 0.5,
          rotation: -10 - index * 5,
          opacity: 0,
          scale: 0.8,
          duration: 1
        })
      
      cleanupFns.push(() => scrollTl.kill())
    })
    
    // 右侧卡片滚动动画
    rightCardsEls.forEach((card, index) => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5
        }
      })
      
      scrollTl
        .to(card, {
          x: window.innerWidth * 0.5,
          rotation: 10 + index * 5,
          opacity: 0,
          scale: 0.8,
          duration: 1
        })
      
      cleanupFns.push(() => scrollTl.kill())
    })
    
    // 标题滚动消失
    if (headerRef.value) {
      gsap.to(headerRef.value, {
        y: -200,
        opacity: 0,
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top top',
          end: '30% top',
          scrub: 1
        }
      })
    }
    
    // 电路线条脉冲动画
    gsap.to('.line-path', {
      strokeDashoffset: -1000,
      duration: 3,
      repeat: -1,
      ease: 'none'
    })
    
    gsap.to('.circuit-dot', {
      opacity: 0.3,
      scale: 0.5,
      duration: 0.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: 0.1
    })
  }
}

// ============================================================
// 清理函数
// ============================================================

const cleanupAnimations = () => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0
  cardRefsMap.value.clear()
  innerRefsMap.value.clear()
  if (animationId) cancelAnimationFrame(animationId)
}

const handleResize = () => {
  initBgCanvas()
}

// ============================================================
// 生命周期
// ============================================================

onMounted(() => {
  initBgCanvas()
  animateBg()
  
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      initAnimations()
    })
  })
  
  window.addEventListener('resize', handleResize)
})

onUnmounted(cleanupAnimations)

// 响应式数据
const cards = ref(CARDS_DATA)
</script>

<style scoped lang="scss">
// ============================================================
// 变量定义
// ============================================================
$neon-green: #00ff88;
$neon-pink: #ff0080;
$neon-cyan: #00d4ff;
$neon-orange: #ffaa00;

.circuit-section {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: #050510;
}

// ============================================================
// 背景层
// ============================================================
.circuit-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.bg-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.circuit-overlay {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(ellipse at 20% 50%, rgba($neon-green, 0.05) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 50%, rgba($neon-pink, 0.05) 0%, transparent 50%);
  pointer-events: none;
}

// ============================================================
// 标题区域
// ============================================================
.circuit-header {
  position: absolute;
  top: 5%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 20;
}

.header-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 0.7rem;
  font-weight: 600;
  color: $neon-green;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  padding: 8px 20px;
  background: rgba($neon-green, 0.08);
  border: 1px solid rgba($neon-green, 0.3);
  border-radius: 25px;
  margin-bottom: 16px;
}

.badge-pulse {
  width: 8px;
  height: 8px;
  background: $neon-green;
  border-radius: 50%;
  animation: badgePulse 1.5s ease-in-out infinite;
}

@keyframes badgePulse {
  0%, 100% { box-shadow: 0 0 5px $neon-green, 0 0 10px $neon-green; }
  50% { box-shadow: 0 0 15px $neon-green, 0 0 30px $neon-green; }
}

.header-title {
  font-size: 4rem;
  font-weight: 900;
  line-height: 1;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.title-line {
  display: block;
  background: linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  &.accent {
    background: linear-gradient(135deg, $neon-green 0%, $neon-cyan 50%, $neon-pink 100%);
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
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 0.3em;
  margin-top: 16px;
}

.header-circuit {
  width: 200px;
  height: 40px;
  margin: 20px auto 0;
  transform-origin: center;
}

.circuit-svg {
  width: 100%;
  height: 100%;
}

.circuit-line {
  fill: none;
  stroke: rgba($neon-green, 0.3);
  stroke-width: 1;
}

.circuit-node {
  fill: $neon-green;
  opacity: 0.5;
}

// ============================================================
// 卡片容器
// ============================================================
.circuit-cards {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 60px;
  z-index: 15;
  perspective: 1500px;
}

.cards-left, .cards-right {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

// ============================================================
// 电路卡片
// ============================================================
.circuit-card {
  position: relative;
  width: 240px;
  height: 320px;
  perspective: 1000px;
  cursor: pointer;
  
  &:hover {
    .card-inner {
      transform: translateY(-12px) rotateX(3deg);
    }
    .card-front, .card-back {
      box-shadow: 
        0 30px 60px rgba($neon-green, 0.3),
        0 0 40px rgba($neon-green, 0.2);
    }
    .card-glow-effect {
      opacity: 0.3;
    }
    .line-path {
      animation-duration: 1s;
    }
    .circuit-dot {
      animation-duration: 0.3s;
    }
  }
}

// 电路线条
.card-circuit-lines {
  position: absolute;
  inset: -20px;
  pointer-events: none;
  opacity: 0.4;
  z-index: -1;
}

.lines-svg {
  width: 100%;
  height: 100%;
}

.line-path {
  fill: none;
  stroke: currentColor;
  stroke-width: 1;
  stroke-dasharray: 1000;
  animation: lineFlow 2s linear infinite;
  
  .card-cpu & { stroke: $neon-green; }
  .card-memory & { stroke: $neon-pink; }
  .card-sensor & { stroke: $neon-cyan; }
  .card-comm & { stroke: $neon-orange; }
}

@keyframes lineFlow {
  0% { stroke-dashoffset: 1000; }
  100% { stroke-dashoffset: 0; }
}

.circuit-dot {
  fill: currentColor;
  animation: dotPulse 1s ease-in-out infinite;
  
  .card-cpu & { fill: $neon-green; }
  .card-memory & { fill: $neon-pink; }
  .card-sensor & { fill: $neon-cyan; }
  .card-comm & { fill: $neon-orange; }
  
  &.delay-1 { animation-delay: 0.3s; }
  &.delay-2 { animation-delay: 0.6s; }
}

@keyframes dotPulse {
  0%, 100% { opacity: 1; r: 3; }
  50% { opacity: 0.3; r: 2; }
}

// 卡片内部
.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.5s ease;
}

.card-front, .card-back {
  position: absolute;
  inset: 0;
  border-radius: 16px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transition: box-shadow 0.4s ease;
}

.card-front {
  background: linear-gradient(145deg, rgba(15, 20, 30, 0.95), rgba(8, 10, 20, 0.98));
  border: 1px solid rgba($neon-green, 0.15);
  backdrop-filter: blur(20px);
  overflow: hidden;
  
  .card-memory & { border-color: rgba($neon-pink, 0.15); }
  .card-sensor & { border-color: rgba($neon-cyan, 0.15); }
  .card-comm & { border-color: rgba($neon-orange, 0.15); }
}

.card-back {
  transform: rotateY(180deg);
  color: #fff;
  text-align: center;
  overflow: hidden;
  
  h3 { font-size: 1.3rem; margin-bottom: 10px; }
  p { font-size: 0.85rem; line-height: 1.6; opacity: 0.9; }
}

.card-glow-effect {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba($neon-green, 0.15) 0%, transparent 50%);
  opacity: 0.1;
  pointer-events: none;
  transition: opacity 0.4s ease;
  
  .card-memory & { background: radial-gradient(circle, rgba($neon-pink, 0.15) 0%, transparent 50%); }
  .card-sensor & { background: radial-gradient(circle, rgba($neon-cyan, 0.15) 0%, transparent 50%); }
  .card-comm & { background: radial-gradient(circle, rgba($neon-orange, 0.15) 0%, transparent 50%); }
}

.back-circuit {
  position: absolute;
  inset: 0;
  background: 
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 20px,
      rgba(255, 255, 255, 0.02) 20px,
      rgba(255, 255, 255, 0.02) 21px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 20px,
      rgba(255, 255, 255, 0.02) 20px,
      rgba(255, 255, 255, 0.02) 21px
    );
  pointer-events: none;
}

.card-icon {
  width: 56px;
  height: 56px;
  color: $neon-green;
  margin-bottom: 16px;
  filter: drop-shadow(0 0 10px currentColor);
  
  svg { width: 100%; height: 100%; }
  
  .card-memory & { color: $neon-pink; }
  .card-sensor & { color: $neon-cyan; }
  .card-comm & { color: $neon-orange; }
}

.card-badge {
  font-size: 0.65rem;
  font-weight: 600;
  color: $neon-green;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  padding: 4px 12px;
  background: rgba($neon-green, 0.1);
  border-radius: 12px;
  margin-bottom: 12px;
  
  .card-memory & { color: $neon-pink; background: rgba($neon-pink, 0.1); }
  .card-sensor & { color: $neon-cyan; background: rgba($neon-cyan, 0.1); }
  .card-comm & { color: $neon-orange; background: rgba($neon-orange, 0.1); }
}

.card-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 10px;
  text-align: center;
}

.card-desc {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
  text-align: center;
  margin: 0;
}

.card-stats {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: $neon-green;
  
  .card-memory & { color: $neon-pink; }
  .card-sensor & { color: $neon-cyan; }
  .card-comm & { color: $neon-orange; }
}

.stat-label {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

// 规格列表
.card-specs {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
  width: 100%;
}

.spec-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.spec-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
}

.spec-value {
  font-size: 0.8rem;
  font-weight: 600;
  color: #fff;
}

// ============================================================
// 底部提示
// ============================================================
.circuit-footer {
  position: absolute;
  bottom: 3%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 20;
  
  span {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.4);
    text-transform: uppercase;
    letter-spacing: 0.2em;
  }
}

.footer-circuit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 12px;
}

.footer-line {
  width: 30px;
  height: 1px;
  background: $neon-green;
}

.footer-dot {
  width: 6px;
  height: 6px;
  background: $neon-green;
  border-radius: 50%;
  animation: dotBlink 1s ease-in-out infinite;
}

@keyframes dotBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

// ============================================================
// 响应式
// ============================================================
@media (max-width: 900px) {
  .circuit-cards {
    flex-direction: column;
    gap: 24px;
  }
  .cards-left, .cards-right {
    flex-direction: row;
    justify-content: center;
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .header-title { font-size: 2.5rem; }
  .circuit-header { top: 3%; }
  .circuit-card {
    width: 200px;
    height: 280px;
  }
  .cards-left, .cards-right {
    flex-direction: column;
  }
}
</style>
