<template>
  <section ref="sectionRef" class="holo-section">
    <!-- 全息背景 -->
    <div class="holo-bg">
      <canvas ref="bgCanvasRef" class="bg-canvas"></canvas>
      <div class="grid-overlay"></div>
      <div class="holo-overlay"></div>
    </div>

    <!-- 标题区域 -->
    <div ref="headerRef" class="holo-header">
      <div class="header-badge">
        <span class="badge-dot"></span>
        Holographic Tech
      </div>
      <h1 class="header-title">
        <span class="title-line">全息</span>
        <span class="title-line accent">未来</span>
      </h1>
      <p class="header-subtitle">Holographic Technology Experience</p>
      <div class="header-scanline"></div>
    </div>

    <!-- 卡片容器 -->
    <div ref="cardsRef" class="holo-cards">
      <div
        v-for="(card, index) in cards"
        :key="card.id"
        :ref="(el) => setCardRef(el, index)"
        class="holo-card"
        :class="card.className"
      >
        <!-- 全息扫描线 -->
        <div class="card-scanline"></div>
        
        <!-- 全息边框 -->
        <div class="card-border">
          <span class="corner tl"></span>
          <span class="corner tr"></span>
          <span class="corner bl"></span>
          <span class="corner br"></span>
        </div>

        <!-- 卡片内容 -->
        <div :ref="(el) => setInnerRef(el, index)" class="card-inner">
          <div class="card-front">
            <div class="card-holo-effect"></div>
            <div class="card-icon" v-html="card.icon"></div>
            <div class="card-badge">{{ card.badge }}</div>
            <h3 class="card-title">{{ card.title }}</h3>
            <p class="card-desc">{{ card.desc }}</p>
            <div class="card-data">
              <span class="data-label">DATA</span>
              <span class="data-value">{{ card.data }}</span>
            </div>
          </div>
          <div class="card-back" :style="{ background: card.gradient }">
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

        <!-- 全息粒子 -->
        <div class="card-particles">
          <span v-for="i in 8" :key="i" class="particle" :style="{ '--i': i }"></span>
        </div>
      </div>
    </div>

    <!-- 底部提示 -->
    <div ref="footerRef" class="holo-footer">
      <span>Scroll to Explore</span>
      <div class="footer-indicator"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * CardHologram - 全息投影卡片组件
 * @description 全息科技主题的创新卡片，展示全息显示、全息存储等技术概念
 */

import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ============================================================
// 类型定义
// ============================================================

interface SpecItem {
  label: string
  value: string
}

interface HoloCard {
  id: string
  icon: string
  badge: string
  title: string
  desc: string
  descBack: string
  gradient: string
  className: string
  data: string
  specs: SpecItem[]
}

type TweenCleanup = () => void

// ============================================================
// 常量数据
// ============================================================

const CARDS_DATA: HoloCard[] = [
  {
    id: 'display',
    icon: '<svg viewBox="0 0 48 48" fill="none"><rect x="6" y="10" width="36" height="24" rx="2" stroke="currentColor" stroke-width="2"/><path d="M6 34l8-10 8 6 8-10 10 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="24" cy="8" r="2" fill="currentColor"/><path d="M24 14v2" stroke="currentColor" stroke-width="2"/></svg>',
    badge: 'Display',
    title: '全息显示',
    desc: '真正的裸眼3D全息投影技术',
    descBack: '无需特殊眼镜即可观看立体影像，开启视觉革命新时代',
    gradient: 'linear-gradient(135deg, #00d9ff 0%, #0066ff 100%)',
    className: 'card-display',
    data: '4K/60FPS',
    specs: [
      { label: '分辨率', value: '4096×2160' },
      { label: '刷新率', value: '60Hz' },
      { label: '视角', value: '180°' }
    ]
  },
  {
    id: 'storage',
    icon: '<svg viewBox="0 0 48 48" fill="none"><ellipse cx="24" cy="24" rx="18" ry="8" stroke="currentColor" stroke-width="2"/><ellipse cx="24" cy="24" rx="18" ry="8" stroke="currentColor" stroke-width="2" transform="rotate(60 24 24)"/><ellipse cx="24" cy="24" rx="18" ry="8" stroke="currentColor" stroke-width="2" transform="rotate(120 24 24)"/><circle cx="24" cy="24" r="4" fill="currentColor"/></svg>',
    badge: 'Storage',
    title: '全息存储',
    desc: '基于光全息术的超高密度数据存储',
    descBack: '单张全息光盘可存储数TB数据，读写速度达到GB级别',
    gradient: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
    className: 'card-storage',
    data: '10TB/Disc',
    specs: [
      { label: '容量', value: '10TB' },
      { label: '速度', value: '1GB/s' },
      { label: '寿命', value: '100年' }
    ]
  },
  {
    id: 'communication',
    icon: '<svg viewBox="0 0 48 48" fill="none"><path d="M8 16a28 28 0 0 1 32 0" stroke="currentColor" stroke-width="2"/><circle cx="24" cy="24" r="8" stroke="currentColor" stroke-width="2"/><circle cx="24" cy="24" r="3" fill="currentColor"/><path d="M24 36v6M20 40h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    badge: 'Comm',
    title: '全息通信',
    desc: '实时全息投影远程通信技术',
    descBack: '将对方以全息形式投射到真实空间，实现沉浸式远程交流',
    gradient: 'linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)',
    className: 'card-communication',
    data: 'Real-Time',
    specs: [
      { label: '延迟', value: '<50ms' },
      { label: '带宽', value: '10Gbps' },
      { label: '同步', value: '99.9%' }
    ]
  },
  {
    id: 'medical',
    icon: '<svg viewBox="0 0 48 48" fill="none"><path d="M24 6v36M6 24h36" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><circle cx="24" cy="24" r="18" stroke="currentColor" stroke-width="2"/><circle cx="24" cy="24" r="6" stroke="currentColor" stroke-width="2"/></svg>',
    badge: 'Medical',
    title: '全息医疗',
    desc: '全息影像辅助的精准医疗方案',
    descBack: '医生可360度观察患者器官全息图，提高诊断和手术精度',
    gradient: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
    className: 'card-medical',
    data: '360° View',
    specs: [
      { label: '精度', value: '0.1mm' },
      { label: '实时', value: '同步' },
      { label: '3D', value: '建模' }
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

interface GridLine {
  x1: number
  y1: number
  x2: number
  y2: number
  alpha: number
}

const gridLines: GridLine[] = []

const initBgCanvas = () => {
  if (!bgCanvasRef.value) return
  
  bgCanvasRef.value.width = window.innerWidth
  bgCanvasRef.value.height = window.innerHeight
  bgCtx = bgCanvasRef.value.getContext('2d')
  
  gridLines.length = 0
  const spacing = 60
  for (let x = 0; x < window.innerWidth; x += spacing) {
    gridLines.push({ x1: x, y1: 0, x2: x, y2: window.innerHeight, alpha: 0.1 })
  }
  for (let y = 0; y < window.innerHeight; y += spacing) {
    gridLines.push({ x1: 0, y1: y, x2: window.innerWidth, y2: y, alpha: 0.1 })
  }
}

const drawBg = () => {
  if (!bgCtx) return
  const { width, height } = bgCtx.canvas
  
  bgCtx.fillStyle = 'rgba(5, 5, 15, 0.1)'
  bgCtx.fillRect(0, 0, width, height)
  
  // 绘制网格
  bgCtx.strokeStyle = `rgba(0, 217, 255, 0.05)`
  bgCtx.lineWidth = 1
  gridLines.forEach(line => {
    bgCtx!.beginPath()
    bgCtx!.moveTo(line.x1, line.y1)
    bgCtx!.lineTo(line.x2, line.y2)
    bgCtx!.stroke()
  })
  
  // 扫描线效果
  const scanY = (time * 0.5) % height
  const gradient = bgCtx.createLinearGradient(0, scanY - 50, 0, scanY + 50)
  gradient.addColorStop(0, 'transparent')
  gradient.addColorStop(0.5, 'rgba(0, 217, 255, 0.1)')
  gradient.addColorStop(1, 'transparent')
  bgCtx.fillStyle = gradient
  bgCtx.fillRect(0, scanY - 50, width, 100)
  
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
      { scale: 0, opacity: 0, x: -100 },
      { scale: 1, opacity: 1, x: 0, duration: 0.6, ease: 'back.out(2)' }
    )
    .fromTo('.title-line:first-child',
      { x: -200, opacity: 0, skewX: -20 },
      { x: 0, opacity: 1, skewX: 0, duration: 0.8, ease: 'power3.out' },
      '-=0.3'
    )
    .fromTo('.title-line:last-child',
      { x: 200, opacity: 0, skewX: 20 },
      { x: 0, opacity: 1, skewX: 0, duration: 0.8, ease: 'power3.out' },
      '<'
    )
    .fromTo('.header-subtitle',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
      '-=0.3'
    )
    .fromTo('.header-scanline',
      { scaleX: 0 },
      { scaleX: 1, duration: 0.8, ease: 'power2.inOut' },
      '-=0.2'
    )
    
    cleanupFns.push(() => tl.kill())
  }
  
  // 卡片入场动画 - 多种效果组合
  const cards = Array.from(cardRefsMap.value.values())
  if (cards.length > 0) {
    const cardTl = gsap.timeline()
    
    // 卡片1: 从左侧滑入 + 扭曲
    gsap.set(cards[0], { x: -250, opacity: 0, rotationY: -45, scale: 0.7 })
    cardTl.to(cards[0],
      { x: 0, opacity: 1, rotationY: 0, scale: 1, duration: 1, ease: 'power3.out' },
      0.2
    )
    
    // 卡片2: 从上方落下 + 弹跳
    gsap.set(cards[1], { y: -200, opacity: 0, scale: 0.5, rotationX: -30 })
    cardTl.to(cards[1],
      { y: 0, opacity: 1, scale: 1, rotationX: 0, duration: 0.9, ease: 'back.out(1.7)' },
      0.35
    )
    
    // 卡片3: 淡入 + 缩放
    gsap.set(cards[2], { opacity: 0, scale: 1.3, rotation: 10 })
    cardTl.to(cards[2],
      { opacity: 1, scale: 1, rotation: 0, duration: 0.7, ease: 'power2.out' },
      0.5
    )
    
    // 卡片4: 从右侧滑入 + 扭曲
    gsap.set(cards[3], { x: 250, opacity: 0, rotationY: 45, scale: 0.7 })
    cardTl.to(cards[3],
      { x: 0, opacity: 1, rotationY: 0, scale: 1, duration: 1, ease: 'power3.out' },
      0.65
    )
    
    cleanupFns.push(() => cardTl.kill())
  }
  
  // 全息效果入场
  gsap.fromTo('.card-scanline',
    { y: '-100%' },
    { y: '100%', duration: 1.5, stagger: 0.2, ease: 'power2.inOut' }
  )
  
  gsap.fromTo('.card-border .corner',
    { scale: 0, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.4, stagger: 0.1, ease: 'back.out(2)' }
  )
  
  // 底部入场
  if (footerRef.value) {
    gsap.fromTo(footerRef.value,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', delay: 1.5 }
    )
  }
  
  // 滚动动画
  if (sectionRef.value) {
    // 卡片翻转滚动动画
    innerRefsMap.value.forEach((inner, index) => {
      const parent = inner.parentElement
      if (!parent) return
      
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5
        }
      })
      
      scrollTl
        .to(inner, {
          rotateY: 180,
          duration: 1
        })
        .to(parent, {
          y: -120 - index * 40,
          opacity: 0,
          scale: 0.7 - index * 0.1,
          rotation: (index % 2 === 0 ? 1 : -1) * (5 + index * 3),
          duration: 0.5
        }, '-=0.3')
      
      cleanupFns.push(() => scrollTl.kill())
    })
    
    // 标题滚动消失
    if (headerRef.value && sectionRef.value) {
      const headerSt = ScrollTrigger.create({
        trigger: sectionRef.value,
        start: 'top top',
        end: '30% top',
        scrub: 1,
        onUpdate: (self) => {
          gsap.set(headerRef.value, {
            y: -200 * self.progress,
            opacity: 1 - self.progress,
            scale: 1 - 0.2 * self.progress
          })
        }
      })
      cleanupFns.push(() => headerSt.kill())
    }
    
    // 扫描线加速
    gsap.to('.card-scanline', {
      y: '100%',
      duration: 0.8,
      repeat: -1,
      ease: 'none'
    })
    
    // 粒子动画
    gsap.to('.particle', {
      y: 'random(-20, 20)',
      x: 'random(-20, 20)',
      opacity: 'random(0.3, 1)',
      duration: 'random(1, 2)',
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: {
        each: 0.2,
        from: 'random'
      }
    })
    
    cleanupFns.push(() => gsap.killTweensOf('.card-scanline'))
    cleanupFns.push(() => gsap.killTweensOf('.particle'))
  }
}

// ============================================================
// 清理函数
// ============================================================

const cleanupAnimations = () => {
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
$primary: #00d9ff;
$secondary: #0066ff;
$accent: #a29bfe;

.holo-section {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: #050510;
}

// ============================================================
// 背景层
// ============================================================
.holo-bg {
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

.grid-overlay {
  position: absolute;
  inset: 0;
  background: 
    linear-gradient(180deg, rgba(0, 217, 255, 0.02) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 0%, rgba(0, 217, 255, 0.08) 0%, transparent 60%);
  pointer-events: none;
}

.holo-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 50%, rgba($primary, 0.05) 0%, transparent 70%);
  pointer-events: none;
  animation: holoPulse 4s ease-in-out infinite;
}

@keyframes holoPulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

// ============================================================
// 标题区域
// ============================================================
.holo-header {
  position: absolute;
  top: 6%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 20;
}

.header-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.7rem;
  font-weight: 600;
  color: $primary;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  padding: 6px 18px;
  background: rgba(0, 217, 255, 0.08);
  border: 1px solid rgba(0, 217, 255, 0.2);
  border-radius: 20px;
  margin-bottom: 16px;
}

.badge-dot {
  width: 6px;
  height: 6px;
  background: $primary;
  border-radius: 50%;
  animation: dotPulse 1.5s ease-in-out infinite;
}

@keyframes dotPulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 5px $primary; }
  50% { opacity: 0.5; box-shadow: 0 0 15px $primary; }
}

.header-title {
  font-size: 4.5rem;
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
    background: linear-gradient(135deg, $primary 0%, $secondary 50%, $accent 100%);
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

.header-scanline {
  width: 200px;
  height: 2px;
  margin: 20px auto 0;
  background: linear-gradient(90deg, transparent, $primary, transparent);
  transform-origin: center;
}

// ============================================================
// 卡片容器
// ============================================================
.holo-cards {
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 28px;
  z-index: 15;
  perspective: 1500px;
}

// ============================================================
// 全息卡片
// ============================================================
.holo-card {
  position: relative;
  width: 240px;
  height: 340px;
  perspective: 1000px;
  cursor: pointer;
  
  &:hover {
    .card-inner {
      transform: translateY(-12px) rotateX(3deg);
    }
    .card-front, .card-back {
      box-shadow: 
        0 30px 60px rgba($primary, 0.3),
        0 0 40px rgba($primary, 0.2),
        inset 0 0 30px rgba($primary, 0.1);
    }
    .card-scanline {
      animation-duration: 0.5s;
    }
    .card-border .corner {
      box-shadow: 0 0 10px currentColor;
    }
  }
}

// 扫描线
.card-scanline {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 50%;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba($primary, 0.1) 50%,
    transparent 100%
  );
  z-index: 10;
  pointer-events: none;
  animation: scanMove 2s ease-in-out infinite;
}

@keyframes scanMove {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(200%); }
}

// 全息边框
.card-border {
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;
}

.corner {
  position: absolute;
  width: 20px;
  height: 20px;
  border-color: $primary;
  border-style: solid;
  transition: box-shadow 0.3s ease;
  
  &.tl { top: -1px; left: -1px; border-width: 2px 0 0 2px; color: $primary; }
  &.tr { top: -1px; right: -1px; border-width: 2px 2px 0 0; color: $primary; }
  &.bl { bottom: -1px; left: -1px; border-width: 0 0 2px 2px; color: $primary; }
  &.br { bottom: -1px; right: -1px; border-width: 0 2px 2px 0; color: $primary; }
  
  .card-storage & { border-color: #feca57; }
  .card-communication & { border-color: $accent; }
  .card-medical & { border-color: #00cec9; }
}

// 卡片内部
.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.6s ease;
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
  background: linear-gradient(145deg, rgba(10, 15, 30, 0.95), rgba(5, 8, 20, 0.98));
  border: 1px solid rgba($primary, 0.15);
  backdrop-filter: blur(20px);
  overflow: hidden;
}

.card-holo-effect {
  position: absolute;
  inset: 0;
  background: 
    linear-gradient(135deg, rgba($primary, 0.03) 0%, transparent 50%),
    linear-gradient(225deg, rgba($accent, 0.03) 0%, transparent 50%);
  pointer-events: none;
}

.card-back {
  transform: rotateY(180deg);
  color: #fff;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  h3 { font-size: 1.3rem; margin-bottom: 12px; }
  p { font-size: 0.85rem; line-height: 1.6; opacity: 0.9; }
}

.card-icon {
  width: 56px;
  height: 56px;
  color: $primary;
  margin-bottom: 16px;
  position: relative;
  z-index: 2;
  
  svg { width: 100%; height: 100%; }
  
  .card-storage & { color: #feca57; }
  .card-communication & { color: $accent; }
  .card-medical & { color: #00cec9; }
}

.card-badge {
  font-size: 0.65rem;
  font-weight: 600;
  color: $primary;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  padding: 4px 12px;
  background: rgba($primary, 0.1);
  border-radius: 12px;
  margin-bottom: 12px;
  position: relative;
  z-index: 2;
  
  .card-storage & { color: #feca57; background: rgba(254, 202, 87, 0.1); }
  .card-communication & { color: $accent; background: rgba(162, 155, 254, 0.1); }
  .card-medical & { color: #00cec9; background: rgba(0, 206, 201, 0.1); }
}

.card-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 10px;
  text-align: center;
  position: relative;
  z-index: 2;
}

.card-desc {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
  text-align: center;
  margin: 0;
  position: relative;
  z-index: 2;
}

.card-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  position: relative;
  z-index: 2;
}

.data-label {
  font-size: 0.6rem;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 0.2em;
}

.data-value {
  font-size: 1rem;
  font-weight: 700;
  color: $primary;
  
  .card-storage & { color: #feca57; }
  .card-communication & { color: $accent; }
  .card-medical & { color: #00cec9; }
}

// 规格列表
.card-specs {
  display: flex;
  flex-direction: column;
  gap: 12px;
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

// 粒子效果
.card-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.particle {
  position: absolute;
  width: 3px;
  height: 3px;
  background: $primary;
  border-radius: 50%;
  opacity: 0.6;
  
  &:nth-child(1) { top: 15%; left: 10%; }
  &:nth-child(2) { top: 25%; right: 15%; }
  &:nth-child(3) { bottom: 20%; left: 15%; }
  &:nth-child(4) { bottom: 30%; right: 10%; }
  &:nth-child(5) { top: 40%; left: 5%; }
  &:nth-child(6) { top: 50%; right: 20%; }
  &:nth-child(7) { bottom: 40%; left: 25%; }
  &:nth-child(8) { top: 35%; right: 5%; }
  
  .card-storage & { background: #feca57; }
  .card-communication & { background: $accent; }
  .card-medical & { background: #00cec9; }
}

// ============================================================
// 底部提示
// ============================================================
.holo-footer {
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

.footer-indicator {
  width: 40px;
  height: 40px;
  margin: 12px auto 0;
  border: 1px solid rgba($primary, 0.3);
  border-radius: 50%;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 8px;
    height: 8px;
    background: $primary;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: indicatorPulse 1.5s ease-in-out infinite;
  }
}

@keyframes indicatorPulse {
  0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.5; transform: translate(-50%, -50%) scale(1.5); }
}

// ============================================================
// 响应式
// ============================================================
@media (max-width: 1100px) {
  .holo-cards {
    flex-wrap: wrap;
    max-width: 540px;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .header-title { font-size: 2.8rem; }
  .holo-header { top: 4%; }
  .holo-cards {
    bottom: 8%;
    gap: 20px;
  }
  .holo-card {
    width: 200px;
    height: 280px;
  }
}
</style>
