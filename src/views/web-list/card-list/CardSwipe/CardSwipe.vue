<template>
  <section ref="sectionRef" class="swipe-section">
    <div class="bg-gradient"></div>
    <div ref="swipeLinesRef" class="swipe-lines"></div>

    <header ref="headerRef" class="section-header">
      <div ref="headerBadgeRef" class="header-badge">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M4 12H20M20 12L13 5M20 12L13 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h1 ref="titleRef" class="title">滑动刷新</h1>
      <p ref="subtitleRef" class="subtitle">SWIPE REFRESH</p>
    </header>

    <div class="cards-container">
      <div ref="card0Ref" class="swipe-card" data-index="0">
        <div class="card-swipe-line"></div>
        <div class="card-glow"></div>
        <div class="card-content">
          <span class="card-num">01</span>
          <h3 class="card-title">下拉刷新</h3>
          <p class="card-desc">向下滑动刷新内容</p>
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M12 19L6 13M12 19L18 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      <div ref="card1Ref" class="swipe-card" data-index="1">
        <div class="card-swipe-line"></div>
        <div class="card-glow"></div>
        <div class="card-content">
          <span class="card-num">02</span>
          <h3 class="card-title">侧滑操作</h3>
          <p class="card-desc">左右滑动执行操作</p>
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M19 12L12 5M19 12L12 19M5 12L12 5M5 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      <div ref="card2Ref" class="swipe-card" data-index="2">
        <div class="card-swipe-line"></div>
        <div class="card-glow"></div>
        <div class="card-content">
          <span class="card-num">03</span>
          <h3 class="card-title">弹性回弹</h3>
          <p class="card-desc">滑动后的弹性效果</p>
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="2"/>
              <path d="M12 4V12L16 16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <footer ref="footerRef" class="section-footer">
      <span>CardSwipe</span>
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
const swipeLinesRef = ref<HTMLElement | null>(null)
const card0Ref = ref<HTMLElement | null>(null)
const card1Ref = ref<HTMLElement | null>(null)
const card2Ref = ref<HTMLElement | null>(null)

let cleanupFns: TweenCleanup[] = []
let swipeAnimations: gsap.core.Tween[] = []

const createSwipeLines = () => {
  if (!swipeLinesRef.value) return
  
  for (let i = 0; i < 8; i++) {
    const line = document.createElement('div')
    line.className = 'swipe-line'
    line.style.cssText = `
      position: absolute;
      width: 3px;
      height: ${60 + Math.random() * 100}px;
      background: linear-gradient(180deg, transparent, rgba(236, 72, 153, 0.6), transparent);
      left: ${10 + i * 12}%;
      top: -100px;
      border-radius: 3px;
    `
    swipeLinesRef.value.appendChild(line)
    
    const tl = gsap.timeline({ repeat: -1, delay: i * 0.4 })
    tl.fromTo(line, 
      { y: 0, opacity: 0 },
      { y: '+=120vh', opacity: [0, 1, 1, 0], duration: 2, ease: 'power2.inOut' }
    )
    swipeAnimations.push(tl)
  }
}

const initAnimations = () => {
  // ========== 入场动画 ==========
  const tl = gsap.timeline({ delay: 0.2 })

  // 标题入场 - fade-left效果
  tl.fromTo(headerBadgeRef.value,
    { x: 150, opacity: 0, scale: 0, rotation: 180, filter: 'blur(15px)' },
    { x: 0, opacity: 1, scale: 1, rotation: 0, filter: 'blur(0px)', duration: 0.8, ease: 'back.out(1.7)' }
  )
  .fromTo(titleRef.value,
    { x: 120, opacity: 0, scale: 0.8, filter: 'blur(10px)' },
    { x: 0, opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out' },
    '-=0.4'
  )
  .fromTo(subtitleRef.value,
    { x: 80, opacity: 0, letterSpacing: '-5px' },
    { x: 0, opacity: 1, letterSpacing: '6px', duration: 0.5, ease: 'power2.out' },
    '-=0.3'
  )

  // 卡片入场 - fade-left 从右侧滑入
  const cards = [card0Ref.value, card1Ref.value, card2Ref.value]
  const cardEnterConfigs = [
    { x: 200, y: 0, rotation: -10, scale: 0.6, skewY: 5 },
    { x: 250, y: 0, rotation: 0, scale: 0.5, skewY: 0 },
    { x: 200, y: 0, rotation: 10, scale: 0.6, skewY: -5 }
  ]
  const cardEases = ['back.out(1.2)', 'elastic.out(1, 0.5)', 'back.out(1.4)']

  cards.forEach((card, i) => {
    if (!card) return
    const config = cardEnterConfigs[i] ?? { x: 200, y: 0, rotation: 0, scale: 0.6, skewY: 0 }
    const ease = cardEases[i] ?? 'power3.out'
    tl.fromTo(card,
      { x: config.x, y: config.y, opacity: 0, rotation: config.rotation, scale: config.scale, skewY: config.skewY, filter: 'blur(12px)' },
      { x: 0, y: 0, opacity: 1, rotation: 0, scale: 1, skewY: 0, filter: 'blur(0px)', duration: 1, ease },
      `=-${0.6 - i * 0.1}`
    )
  })

  // 底部入场
  tl.fromTo(footerRef.value,
    { x: 100, opacity: 0 },
    { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
    '-=0.3'
  )

  cleanupFns.push(() => tl.kill())

  // 创建滑动线条动画
  createSwipeLines()

  // ========== 滚动动画 ==========
  // 初始化状态
  gsap.set('.swipe-card', { x: 0, y: 0, opacity: 1, scale: 1, rotation: 0, skewY: 0, filter: 'blur(0px)' })
  gsap.set([headerBadgeRef.value, titleRef.value, subtitleRef.value], { x: 0, y: 0, opacity: 1, filter: 'blur(0px)' })
  gsap.set(footerRef.value, { x: 0, opacity: 1 })

  // 卡片滚动配置 - 向左滑出消失
  const scrollConfigs = [
    { x: -300, y: 0, rotation: -25, scale: 0.3, skewY: -10 },
    { x: -350, y: 0, rotation: 0, scale: 0.2, skewY: 0 },
    { x: -300, y: 0, rotation: 25, scale: 0.3, skewY: 10 }
  ]

  // 每个卡片独立滚动触发
  cards.forEach((card, i) => {
    if (!card) return
    const config = scrollConfigs[i] ?? { x: -300, y: 0, rotation: 0, scale: 0.3, skewY: 0 }

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
            x: (config.x ?? -300) * p,
            y: (config.y ?? 0) * p,
            opacity: Math.max(0, 1 - p * 1.8),
            scale: 1 - p * (1 - (config.scale ?? 0.3)),
            rotation: (config.rotation ?? 0) * p,
            skewY: (config.skewY ?? 0) * p,
            filter: `blur(${p * 12}px)`
          })
        } else {
          gsap.set(card, {
            x: 0, y: 0, opacity: 1, scale: 1, rotation: 0, skewY: 0, filter: 'blur(0px)'
          })
        }
      }
    })
    cleanupFns.push(() => trigger.kill())
  })

  // 标题滚动消失 - 向右滑出
  const headerTrigger = ScrollTrigger.create({
    trigger: headerRef.value,
    start: 'top top',
    end: '20% top',
    scrub: 1.5,
    onUpdate: (self) => {
      const p = self.progress
      gsap.set(headerRef.value, {
        x: 150 * p,
        opacity: 1 - p * 2,
        rotation: p * 15,
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
        x: 80 * p,
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
  swipeAnimations.forEach(t => t.kill())
  if (swipeLinesRef.value) {
    swipeLinesRef.value.innerHTML = ''
  }
})
</script>

<style lang="scss" scoped>
.swipe-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #1a0a20 0%, #2d1b4e 50%, #1a0a20 100%);
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
    radial-gradient(ellipse at 20% 30%, rgba(236, 72, 153, 0.2) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 70%, rgba(168, 85, 247, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(236, 72, 153, 0.1) 0%, transparent 60%);
}

.swipe-lines {
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
  background: linear-gradient(135deg, #ec4899, #a855f7, #ec4899);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  box-shadow: 
    0 0 30px rgba(236, 72, 153, 0.5),
    0 0 60px rgba(168, 85, 247, 0.3),
    inset 0 0 20px rgba(255, 255, 255, 0.2);
  
  svg { width: 40px; height: 40px; }
}

.title {
  font-size: 56px;
  font-weight: 900;
  background: linear-gradient(90deg, #f472b6, #ec4899, #a855f7);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 10px;
  text-shadow: 0 0 40px rgba(236, 72, 153, 0.5);
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

.swipe-card {
  position: relative;
  width: 280px;
  padding: 32px;
  background: rgba(236, 72, 153, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(236, 72, 153, 0.2);
  border-radius: 20px;
  cursor: pointer;
  transform-style: preserve-3d;
  will-change: transform, opacity, filter;
  transition: transform 0.3s ease, border-color 0.3s ease;
  overflow: hidden;

  &:hover {
    transform: translateY(-15px) rotateX(5deg) rotateY(-5deg) scale(1.05);
    border-color: rgba(236, 72, 153, 0.5);
    .card-glow { opacity: 1; }
    .card-swipe-line { animation: swipeSlide 0.8s ease-out; }
  }
}

.card-swipe-line {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(236, 72, 153, 0.2), transparent);
  pointer-events: none;
}

@keyframes swipeSlide {
  0% { left: -100%; }
  100% { left: 100%; }
}

.card-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.3), transparent 70%);
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
  color: #ec4899;
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
  color: #ec4899;
  
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
