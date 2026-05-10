<template>
  <section ref="sectionRef" class="circuit-section">
    <div class="bg-gradient"></div>
    <div ref="circuitBgRef" class="circuit-background"></div>

    <header ref="headerRef" class="section-header">
      <div ref="headerBadgeRef" class="header-badge">
        <svg viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
          <path d="M3 9H21M9 21V9" stroke="currentColor" stroke-width="2"/>
          <circle cx="6" cy="6" r="1" fill="currentColor"/>
          <circle cx="18" cy="18" r="1" fill="currentColor"/>
          <circle cx="9" cy="9" r="1" fill="currentColor"/>
        </svg>
      </div>
      <h1 ref="titleRef" class="title">电路脉冲</h1>
      <p ref="subtitleRef" class="subtitle">CIRCUIT PULSE</p>
    </header>

    <div class="cards-container">
      <div ref="card0Ref" class="circuit-card" data-index="0">
        <div class="card-circuit-line"></div>
        <div class="card-glow"></div>
        <div class="card-content">
          <span class="card-num">01</span>
          <h3 class="card-title">电流传导</h3>
          <p class="card-desc">电子流动的轨迹</p>
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="currentColor"/>
            </svg>
          </div>
        </div>
      </div>

      <div ref="card1Ref" class="circuit-card" data-index="1">
        <div class="card-circuit-line"></div>
        <div class="card-glow"></div>
        <div class="card-content">
          <span class="card-num">02</span>
          <h3 class="card-title">芯片互联</h3>
          <p class="card-desc">精密芯片的连接</p>
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" stroke-width="2"/>
              <path d="M9 1V4M15 1V4M9 20V23M15 20V23M1 9H4M1 15H4M20 9H23M20 15H23" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
        </div>
      </div>

      <div ref="card2Ref" class="circuit-card" data-index="2">
        <div class="card-circuit-line"></div>
        <div class="card-glow"></div>
        <div class="card-content">
          <span class="card-num">03</span>
          <h3 class="card-title">信号传输</h3>
          <p class="card-desc">高速信号脉冲</p>
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M22 12H18L15 21L11 3L8 12H2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <footer ref="footerRef" class="section-footer">
      <span>CardCircuit</span>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void

const sectionRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const headerBadgeRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const circuitBgRef = ref<HTMLElement | null>(null)
const card0Ref = ref<HTMLElement | null>(null)
const card1Ref = ref<HTMLElement | null>(null)
const card2Ref = ref<HTMLElement | null>(null)

let cleanupFns: TweenCleanup[] = []
let circuitAnimations: gsap.core.Tween[] = []

const createCircuitBackground = () => {
  if (!circuitBgRef.value) return
  
  // 创建电路线路
  const lines = [
    { x1: 0, y1: '20%', x2: '30%', y2: '20%' },
    { x1: '30%', y1: '20%', x2: '30%', y2: '40%' },
    { x1: '30%', y1: '40%', x2: '50%', y2: '40%' },
    { x1: '50%', y1: '40%', x2: '50%', y2: '60%' },
    { x1: '50%', y1: '60%', x2: '70%', y2: '60%' },
    { x1: '70%', y1: '60%', x2: '70%', y2: '80%' },
    { x1: '70%', y1: '80%', x2: '100%', y2: '80%' },
  ]

  lines.forEach((line, i) => {
    const lineEl = document.createElement('div')
    lineEl.className = 'circuit-line'
    lineEl.style.cssText = `
      position: absolute;
      left: ${line.x1};
      top: ${line.y1};
      width: ${line.x1 === line.x2 ? '2px' : '0'};
      height: ${line.x1 === line.x2 ? '0' : '2px'};
      background: linear-gradient(90deg, rgba(16, 185, 129, 0.4), rgba(16, 185, 129, 0.1));
      transform-origin: left center;
    `
    circuitBgRef.value?.appendChild(lineEl)

    // 节点
    const node = document.createElement('div')
    node.className = 'circuit-node'
    node.style.cssText = `
      position: absolute;
      left: ${line.x2};
      top: ${line.y2};
      width: 8px;
      height: 8px;
      background: #10b981;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 10px rgba(16, 185, 129, 0.8);
    `
    circuitBgRef.value?.appendChild(node)

    // 节点脉冲动画
    const nodeTl = gsap.timeline({ repeat: -1, delay: i * 0.3 })
    nodeTl.fromTo(node, 
      { scale: 0.5, opacity: 0.5 },
      { scale: 1.5, opacity: 0, duration: 1.5, ease: 'power2.out' }
    )
    circuitAnimations.push(nodeTl)
  })
}

const initAnimations = () => {
  // ========== 入场动画 ==========
  const tl = gsap.timeline({ delay: 0.2 })

  // 标题入场 - fade-up-right效果（从右下角滑入）
  tl.fromTo(headerBadgeRef.value,
    { x: -200, y: 150, opacity: 0, scale: 0, rotation: -360, filter: 'blur(15px)' },
    { x: 0, y: 0, opacity: 1, scale: 1, rotation: 0, filter: 'blur(0px)', duration: 1, ease: 'back.out(1.7)' }
  )
  .fromTo(titleRef.value,
    { x: -150, y: 120, opacity: 0, scale: 0.7, filter: 'blur(10px)' },
    { x: 0, y: 0, opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' },
    '-=0.5'
  )
  .fromTo(subtitleRef.value,
    { x: -100, y: 80, opacity: 0, letterSpacing: '-5px' },
    { x: 0, y: 0, opacity: 1, letterSpacing: '6px', duration: 0.6, ease: 'power2.out' },
    '-=0.4'
  )

  // 卡片入场 - fade-up-right 从右下角滑入
  const cards = [card0Ref.value, card1Ref.value, card2Ref.value]
  const cardEnterConfigs = [
    { x: -180, y: 120, rotation: -15, scale: 0.5, skewX: -8 },
    { x: -220, y: 150, rotation: 0, scale: 0.4, skewX: 0 },
    { x: -180, y: 120, rotation: 15, scale: 0.5, skewX: 8 }
  ]
  const cardEases = ['back.out(1.2)', 'elastic.out(1, 0.5)', 'back.out(1.4)']

  cards.forEach((card, i) => {
    if (!card) return
    const config = cardEnterConfigs[i] ?? { x: -180, y: 120, rotation: 0, scale: 0.5, skewX: 0 }
    const ease = cardEases[i] ?? 'power3.out'
    tl.fromTo(card,
      { x: config.x, y: config.y, opacity: 0, rotation: config.rotation, scale: config.scale, skewX: config.skewX, filter: 'blur(12px)' },
      { x: 0, y: 0, opacity: 1, rotation: 0, scale: 1, skewX: 0, filter: 'blur(0px)', duration: 1, ease },
      `=-${0.7 - i * 0.1}`
    )
  })

  // 底部入场
  tl.fromTo(footerRef.value,
    { x: -80, y: 50, opacity: 0 },
    { x: 0, y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
    '-=0.3'
  )

  cleanupFns.push(() => tl.kill())

  // 创建电路背景
  createCircuitBackground()

  // ========== 滚动动画 ==========
  // 初始化状态
  gsap.set('.circuit-card', { x: 0, y: 0, opacity: 1, scale: 1, rotation: 0, skewX: 0, filter: 'blur(0px)' })
  gsap.set([headerBadgeRef.value, titleRef.value, subtitleRef.value], { x: 0, y: 0, opacity: 1, filter: 'blur(0px)' })
  gsap.set(footerRef.value, { x: 0, y: 0, opacity: 1 })

  // 卡片滚动配置 - 向左上方飞出
  const scrollConfigs = [
    { x: -280, y: -200, rotation: -35, scale: 0.25, skewX: -18 },
    { x: -320, y: -250, rotation: 0, scale: 0.2, skewX: 0 },
    { x: -280, y: -200, rotation: 35, scale: 0.25, skewX: 18 }
  ]

  // 每个卡片独立滚动触发
  cards.forEach((card, i) => {
    if (!card) return
    const config = scrollConfigs[i] ?? { x: -280, y: -200, rotation: 0, scale: 0.25, skewX: 0 }

    const trigger = ScrollTrigger.create({
      trigger: card,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.5,
      onUpdate: (self) => {
        const p = self.progress
        const dir = self.direction

        if (dir > 0) {
          gsap.set(card, {
            x: (config.x ?? -280) * p,
            y: (config.y ?? -200) * p,
            opacity: Math.max(0, 1 - p * 1.8),
            scale: 1 - p * (1 - (config.scale ?? 0.25)),
            rotation: (config.rotation ?? 0) * p,
            skewX: (config.skewX ?? 0) * p,
            filter: `blur(${p * 12}px)`
          })
        } else {
          gsap.set(card, {
            x: 0, y: 0, opacity: 1, scale: 1, rotation: 0, skewX: 0, filter: 'blur(0px)'
          })
        }
      }
    })
    cleanupFns.push(() => trigger.kill())
  })

  // 标题滚动消失 - 向右下角滑出
  const headerTrigger = ScrollTrigger.create({
    trigger: headerRef.value,
    start: 'top top',
    end: '20% top',
    scrub: 1.5,
    onUpdate: (self) => {
      const p = self.progress
      gsap.set(headerRef.value, {
        x: -120 * p,
        y: 100 * p,
        opacity: 1 - p * 2,
        rotation: -p * 12,
        filter: `blur(${p * 10}px)`
      })
    }
  })
  cleanupFns.push(() => headerTrigger.kill())

  // 底部滚动消失
  const footerTrigger = ScrollTrigger.create({
    trigger: sectionRef.value,
    start: '80% top',
    end: 'bottom top',
    scrub: 1.5,
    onUpdate: (self) => {
      const p = self.progress
      gsap.set(footerRef.value, {
        x: -60 * p,
        y: 40 * p,
        opacity: 1 - p * 2,
        filter: `blur(${p * 8}px)`
      })
    }
  })
  cleanupFns.push(() => footerTrigger.kill())
}

onMounted(() => initAnimations())

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  circuitAnimations.forEach(t => t.kill())
  if (circuitBgRef.value) {
    circuitBgRef.value.innerHTML = ''
  }
  ScrollTrigger.getAll().forEach(t => t.kill())
})
</script>

<style lang="scss" scoped>
.circuit-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #0a1a0a 0%, #0d2818 50%, #0a1a0a 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  perspective: 1200px;
}

.bg-gradient {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(ellipse at 20% 30%, rgba(16, 185, 129, 0.2) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 70%, rgba(5, 150, 105, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(16, 185, 129, 0.08) 0%, transparent 60%);
}

.circuit-background {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
  position: relative;
  z-index: 10;
}

.header-badge {
  width: 70px;
  height: 70px;
  margin: 0 auto 20px;
  background: linear-gradient(135deg, #10b981, #059669, #047857);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  box-shadow: 
    0 0 30px rgba(16, 185, 129, 0.5),
    0 0 60px rgba(5, 150, 105, 0.3),
    inset 0 0 20px rgba(255, 255, 255, 0.2);
  
  svg { width: 40px; height: 40px; }
}

.title {
  font-size: 56px;
  font-weight: 900;
  background: linear-gradient(90deg, #6ee7b7, #10b981, #059669);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 10px;
  text-shadow: 0 0 40px rgba(16, 185, 129, 0.5);
}

.subtitle {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 6px;
  font-weight: 300;
}

.cards-container {
  display: flex;
  gap: 30px;
  position: relative;
  z-index: 10;
}

.circuit-card {
  position: relative;
  width: 280px;
  padding: 32px;
  background: rgba(16, 185, 129, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 16px;
  cursor: pointer;
  transform-style: preserve-3d;
  will-change: transform, opacity, filter;
  transition: transform 0.3s ease, border-color 0.3s ease;
  overflow: hidden;

  &:hover {
    transform: translateY(-15px) rotateX(5deg) rotateY(-5deg) scale(1.05);
    border-color: rgba(16, 185, 129, 0.5);
    .card-glow { opacity: 1; }
    .card-circuit-line { animation: circuitFlow 1s linear infinite; }
  }
}

.card-circuit-line {
  position: absolute;
  inset: 0;
  background: 
    linear-gradient(90deg, transparent 0%, rgba(16, 185, 129, 0.1) 50%, transparent 100%);
  background-size: 200% 100%;
  opacity: 0;
  pointer-events: none;
}

@keyframes circuitFlow {
  0% { background-position: -200% 0; opacity: 0; }
  50% { opacity: 1; }
  100% { background-position: 200% 0; opacity: 0; }
}

.card-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.3), transparent 70%);
  opacity: 0;
  transition: opacity 0.3s;
  border-radius: inherit;
}

.card-content {
  position: relative;
  z-index: 1;
}

.card-num {
  font-size: 48px;
  font-weight: 900;
  color: #10b981;
  opacity: 0.3;
  line-height: 1;
  display: block;
  margin-bottom: 12px;
}

.card-title {
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
}

.card-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 20px;
}

.card-icon {
  width: 48px;
  height: 48px;
  color: #10b981;
  
  svg { width: 100%; height: 100%; }
}

.section-footer {
  position: absolute;
  bottom: 40px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.3);
  letter-spacing: 3px;
}
</style>
