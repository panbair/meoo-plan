<template>
  <section ref="sectionRef" class="ripple-section">
    <div class="bg-gradient"></div>
    <div ref="rippleBgRef" class="ripple-background"></div>

    <header ref="headerRef" class="section-header">
      <div ref="headerBadgeRef" class="header-badge">
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="3" fill="currentColor"/>
          <circle cx="12" cy="12" r="6" stroke="currentColor" stroke-width="1.5" opacity="0.6"/>
          <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1" opacity="0.3"/>
        </svg>
      </div>
      <h1 ref="titleRef" class="title">波纹扩散</h1>
      <p ref="subtitleRef" class="subtitle">RIPPLE EFFECT</p>
    </header>

    <div class="cards-container">
      <div ref="card0Ref" class="ripple-card" data-index="0">
        <div class="card-ripple"></div>
        <div class="card-glow"></div>
        <div class="card-content">
          <span class="card-num">01</span>
          <h3 class="card-title">同心波纹</h3>
          <p class="card-desc">层层扩散的同心圆</p>
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="2" fill="currentColor"/>
              <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="1.5"/>
              <circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1" opacity="0.6"/>
            </svg>
          </div>
        </div>
      </div>

      <div ref="card1Ref" class="ripple-card" data-index="1">
        <div class="card-ripple"></div>
        <div class="card-glow"></div>
        <div class="card-content">
          <span class="card-num">02</span>
          <h3 class="card-title">水滴涟漪</h3>
          <p class="card-desc">落入水中的涟漪效果</p>
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <ellipse cx="12" cy="18" rx="8" ry="2" stroke="currentColor" stroke-width="1.5"/>
              <ellipse cx="12" cy="14" rx="5" ry="1.5" stroke="currentColor" stroke-width="1.5" opacity="0.7"/>
              <ellipse cx="12" cy="11" rx="3" ry="1" stroke="currentColor" stroke-width="1.5" opacity="0.5"/>
              <path d="M12 8V4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <circle cx="12" cy="3" r="2" fill="currentColor"/>
            </svg>
          </div>
        </div>
      </div>

      <div ref="card2Ref" class="ripple-card" data-index="2">
        <div class="card-ripple"></div>
        <div class="card-glow"></div>
        <div class="card-content">
          <span class="card-num">03</span>
          <h3 class="card-title">能量脉冲</h3>
          <p class="card-desc">释放能量的脉冲波</p>
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 2L14 10L22 12L14 14L12 22L10 14L2 12L10 10L12 2Z" fill="currentColor"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <footer ref="footerRef" class="section-footer">
      <span>CardRipple</span>
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
const rippleBgRef = ref<HTMLElement | null>(null)
const card0Ref = ref<HTMLElement | null>(null)
const card1Ref = ref<HTMLElement | null>(null)
const card2Ref = ref<HTMLElement | null>(null)

let cleanupFns: TweenCleanup[] = []
let rippleAnimations: gsap.core.Tween[] = []

const createBackgroundRipples = () => {
  if (!rippleBgRef.value) return
  
  for (let i = 0; i < 5; i++) {
    const ripple = document.createElement('div')
    ripple.className = 'bg-ripple'
    ripple.style.cssText = `
      position: absolute;
      width: 100px;
      height: 100px;
      border: 2px solid rgba(6, 182, 212, 0.3);
      border-radius: 50%;
      left: ${20 + Math.random() * 60}%;
      top: ${20 + Math.random() * 60}%;
      transform: translate(-50%, -50%);
    `
    rippleBgRef.value.appendChild(ripple)
    
    const tl = gsap.timeline({ repeat: -1, delay: i * 1.5 })
    tl.fromTo(ripple, 
      { scale: 0, opacity: 0.8 },
      { scale: 8, opacity: 0, duration: 4, ease: 'power2.out' }
    )
    rippleAnimations.push(tl)
  }
}

const initAnimations = () => {
  // ========== 入场动画 ==========
  const tl = gsap.timeline({ delay: 0.2 })

  // 标题入场 - fade-down效果
  tl.fromTo(headerBadgeRef.value,
    { y: -100, opacity: 0, scale: 0, rotation: -180, filter: 'blur(15px)' },
    { y: 0, opacity: 1, scale: 1, rotation: 0, filter: 'blur(0px)', duration: 0.8, ease: 'back.out(1.7)' }
  )
  .fromTo(titleRef.value,
    { y: -80, opacity: 0, scale: 0.7, filter: 'blur(10px)' },
    { y: 0, opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out' },
    '-=0.4'
  )
  .fromTo(subtitleRef.value,
    { y: -50, opacity: 0, letterSpacing: '-5px' },
    { y: 0, opacity: 1, letterSpacing: '6px', duration: 0.5, ease: 'power2.out' },
    '-=0.3'
  )

  // 卡片入场 - 从上方 fade-down 带波纹扩散
  const cards = [card0Ref.value, card1Ref.value, card2Ref.value]
  const cardEnterConfigs = [
    { y: -150, rotation: -8, scale: 0.5, skewX: -5 },
    { y: -180, rotation: 5, scale: 0.4, skewX: 0 },
    { y: -150, rotation: 8, scale: 0.5, skewX: 5 }
  ]
  const cardEases = ['back.out(1.2)', 'elastic.out(1, 0.5)', 'back.out(1.4)']

  cards.forEach((card, i) => {
    if (!card) return
    const config = cardEnterConfigs[i] ?? { y: -150, rotation: 0, scale: 0.5, skewX: 0 }
    const ease = cardEases[i] ?? 'power3.out'
    tl.fromTo(card,
      { y: config.y, opacity: 0, rotation: config.rotation, scale: config.scale, skewX: config.skewX, filter: 'blur(12px)' },
      { y: 0, opacity: 1, rotation: 0, scale: 1, skewX: 0, filter: 'blur(0px)', duration: 1, ease },
      `=-${0.6 - i * 0.1}`
    )
  })

  // 底部入场
  tl.fromTo(footerRef.value,
    { y: -30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
    '-=0.3'
  )

  cleanupFns.push(() => tl.kill())

  // 创建背景波纹
  createBackgroundRipples()

  // ========== 滚动动画 ==========
  // 初始化状态
  gsap.set('.ripple-card', { x: 0, y: 0, opacity: 1, scale: 1, rotation: 0, skewX: 0, filter: 'blur(0px)' })
  gsap.set([headerBadgeRef.value, titleRef.value, subtitleRef.value], { y: 0, opacity: 1, filter: 'blur(0px)' })
  gsap.set(footerRef.value, { y: 0, opacity: 1 })

  // 卡片滚动配置 - 向下方波纹扩散消失
  const scrollConfigs = [
    { x: -250, y: 200, rotation: -30, scale: 0.2, skewX: -15 },
    { x: 0, y: 250, rotation: 0, scale: 0.15, skewX: 0 },
    { x: 250, y: 200, rotation: 30, scale: 0.2, skewX: 15 }
  ]

  // 每个卡片独立滚动触发
  cards.forEach((card, i) => {
    if (!card) return
    const config = scrollConfigs[i] ?? { x: 0, y: 200, rotation: 0, scale: 0.2, skewX: 0 }

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
            x: (config.x ?? 0) * p,
            y: (config.y ?? 0) * p,
            opacity: Math.max(0, 1 - p * 1.8),
            scale: 1 - p * (1 - (config.scale ?? 0.2)),
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

  // 标题滚动消失
  const headerTrigger = ScrollTrigger.create({
    trigger: headerRef.value,
    start: 'top top',
    end: '20% top',
    scrub: 1.5,
    onUpdate: (self) => {
      const p = self.progress
      gsap.set(headerRef.value, {
        y: -100 * p,
        opacity: 1 - p * 2,
        rotation: p * 10,
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
        y: 60 * p,
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
  rippleAnimations.forEach(t => t.kill())
  if (rippleBgRef.value) {
    rippleBgRef.value.innerHTML = ''
  }
  ScrollTrigger.getAll().forEach(t => t.kill())
})
</script>

<style lang="scss" scoped>
.ripple-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(180deg, #0a1628 0%, #0d1f3c 50%, #0a1628 100%);
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
    radial-gradient(ellipse at 30% 30%, rgba(6, 182, 212, 0.2) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 70%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(6, 182, 212, 0.08) 0%, transparent 60%);
}

.ripple-background {
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
  background: linear-gradient(135deg, #06b6d4, #0891b2, #0e7490);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  box-shadow: 
    0 0 30px rgba(6, 182, 212, 0.5),
    0 0 60px rgba(6, 182, 212, 0.3),
    inset 0 0 20px rgba(255, 255, 255, 0.2);
  
  svg { width: 40px; height: 40px; }
}

.title {
  font-size: 56px;
  font-weight: 900;
  background: linear-gradient(90deg, #67e8f9, #06b6d4, #0891b2);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 10px;
  text-shadow: 0 0 40px rgba(6, 182, 212, 0.5);
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

.ripple-card {
  position: relative;
  width: 280px;
  padding: 32px;
  background: rgba(6, 182, 212, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(6, 182, 212, 0.2);
  border-radius: 20px;
  cursor: pointer;
  transform-style: preserve-3d;
  will-change: transform, opacity, filter;
  transition: transform 0.3s ease, border-color 0.3s ease;

  &:hover {
    transform: translateY(-15px) rotateX(5deg) rotateY(-5deg) scale(1.05);
    border-color: rgba(6, 182, 212, 0.5);
    .card-glow { opacity: 1; }
    .card-ripple { animation: ripplePulse 1.5s ease-out infinite; }
  }
}

.card-ripple {
  position: absolute;
  inset: -20px;
  border: 2px solid rgba(6, 182, 212, 0.3);
  border-radius: 30px;
  opacity: 0;
  transform: scale(0.8);
  pointer-events: none;
}

@keyframes ripplePulse {
  0% { transform: scale(0.8); opacity: 0.5; }
  100% { transform: scale(1.3); opacity: 0; }
}

.card-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.3), transparent 70%);
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
  color: #06b6d4;
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
  color: #06b6d4;
  
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
