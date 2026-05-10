<template>
  <section ref="sectionRef" class="meteor-section">
    <div class="bg-gradient"></div>
    <div class="bg-stars"></div>
    
    <!-- 流星容器 -->
    <div ref="meteorContainerRef" class="meteor-container"></div>

    <header ref="headerRef" class="section-header">
      <div ref="headerBadgeRef" class="header-badge">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M12 2L8 12L12 10L16 12L12 2Z" fill="currentColor"/>
          <path d="M12 22L16 12L12 14L8 12L12 22Z" fill="currentColor" opacity="0.6"/>
          <circle cx="12" cy="12" r="2" fill="white"/>
        </svg>
      </div>
      <h1 ref="titleRef" class="title">流星雨</h1>
      <p ref="subtitleRef" class="subtitle">METEOR SHOWER</p>
    </header>

    <div class="cards-container">
      <div ref="card0Ref" class="meteor-card" data-index="0">
        <div class="card-glow"></div>
        <div class="card-content">
          <span class="card-num">01</span>
          <h3 class="card-title">火流星</h3>
          <p class="card-desc">炽热的火球划过夜空</p>
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 2C12 2 4 10 4 14C4 18.4 7.6 22 12 22C16.4 22 20 18.4 20 14C20 10 12 2 12 2Z" fill="url(#fireGrad)"/>
              <defs>
                <linearGradient id="fireGrad" x1="12" y1="2" x2="12" y2="22">
                  <stop offset="0%" stop-color="#fbbf24"/>
                  <stop offset="100%" stop-color="#f97316"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      <div ref="card1Ref" class="meteor-card" data-index="1">
        <div class="card-glow"></div>
        <div class="card-content">
          <span class="card-num">02</span>
          <h3 class="card-title">冰流星</h3>
          <p class="card-desc">冰冷的蓝色光芒闪烁</p>
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 2C12 2 4 10 4 14C4 18.4 7.6 22 12 22C16.4 22 20 18.4 20 14C20 10 12 2 12 2Z" fill="url(#iceGrad)"/>
              <defs>
                <linearGradient id="iceGrad" x1="12" y1="2" x2="12" y2="22">
                  <stop offset="0%" stop-color="#60a5fa"/>
                  <stop offset="100%" stop-color="#3b82f6"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      <div ref="card2Ref" class="meteor-card" data-index="2">
        <div class="card-glow"></div>
        <div class="card-content">
          <span class="card-num">03</span>
          <h3 class="card-title">星尘流</h3>
          <p class="card-desc">闪耀的星尘轨迹</p>
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 2C12 2 4 10 4 14C4 18.4 7.6 22 12 22C16.4 22 20 18.4 20 14C20 10 12 2 12 2Z" fill="url(#starGrad)"/>
              <defs>
                <linearGradient id="starGrad" x1="12" y1="2" x2="12" y2="22">
                  <stop offset="0%" stop-color="#fef3c7"/>
                  <stop offset="100%" stop-color="#fcd34d"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <footer ref="footerRef" class="section-footer">
      <span>CardMeteor</span>
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
const meteorContainerRef = ref<HTMLElement | null>(null)
const card0Ref = ref<HTMLElement | null>(null)
const card1Ref = ref<HTMLElement | null>(null)
const card2Ref = ref<HTMLElement | null>(null)

let cleanupFns: TweenCleanup[] = []
let meteorAnimations: gsap.core.Tween[] = []

const createMeteor = (index: number) => {
  if (!meteorContainerRef.value) return null
  
  const meteor = document.createElement('div')
  meteor.className = 'meteor'
  meteor.style.cssText = `
    position: absolute;
    width: ${80 + Math.random() * 120}px;
    height: 2px;
    background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 50%, white 100%);
    border-radius: 50%;
    left: ${Math.random() * 100}%;
    top: ${Math.random() * 30}%;
    opacity: 0;
    transform: rotate(${35 + Math.random() * 20}deg);
    filter: blur(0.5px);
    box-shadow: 0 0 10px rgba(255,255,255,0.5), 0 0 20px rgba(255,200,100,0.3);
  `
  
  meteorContainerRef.value.appendChild(meteor)
  
  const tl = gsap.timeline({ repeat: -1, delay: index * 0.8 })
  
  tl.set(meteor, { x: -200, opacity: 0 })
    .to(meteor, { 
      x: '+=150vw', 
      y: '+=80vh', 
      opacity: [0, 1, 1, 0], 
      duration: 1.5, 
      ease: 'power2.inOut'
    })
    .set(meteor, { x: -200, y: 0, opacity: 0 })
  
  meteorAnimations.push(tl)
  
  return meteor
}

const initAnimations = () => {
  // ========== 入场动画 ==========
  const tl = gsap.timeline({ delay: 0.2 })

  // 标题入场 - 流星旋转缩放入场
  tl.fromTo(headerBadgeRef.value,
    { scale: 0, opacity: 0, rotation: -720, filter: 'blur(20px)' },
    { scale: 1, opacity: 1, rotation: 0, filter: 'blur(0px)', duration: 1, ease: 'back.out(1.7)' }
  )
  .fromTo(titleRef.value,
    { y: 60, opacity: 0, scale: 0.5, filter: 'blur(15px)' },
    { y: 0, opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' },
    '-=0.5'
  )
  .fromTo(subtitleRef.value,
    { y: 40, opacity: 0, letterSpacing: '-5px' },
    { y: 0, opacity: 1, letterSpacing: '6px', duration: 0.6, ease: 'power2.out' },
    '-=0.4'
  )

  // 卡片入场 - 从下方滑入带旋转
  const cards = [card0Ref.value, card1Ref.value, card2Ref.value]
  const cardEnterConfigs = [
    { y: 200, x: -80, rotation: -15, scale: 0.6, skewX: -10 },
    { y: 200, x: 0, rotation: 10, scale: 0.5, skewX: 0 },
    { y: 200, x: 80, rotation: 15, scale: 0.6, skewX: 10 }
  ]
  const cardEases = ['back.out(1.2)', 'elastic.out(1, 0.5)', 'back.out(1.4)']

  cards.forEach((card, i) => {
    if (!card) return
    const config = cardEnterConfigs[i]
    const ease = cardEases[i]
    tl.fromTo(card,
      { y: config.y, x: config.x, opacity: 0, rotation: config.rotation, scale: config.scale, skewX: config.skewX, filter: 'blur(10px)' },
      { y: 0, x: 0, opacity: 1, rotation: 0, scale: 1, skewX: 0, filter: 'blur(0px)', duration: 1, ease },
      `=-${0.6 - i * 0.1}`
    )
  })

  // 底部入场
  tl.fromTo(footerRef.value,
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
    '-=0.3'
  )

  cleanupFns.push(() => tl.kill())

  // ========== 创建流星 ==========
  for (let i = 0; i < 8; i++) {
    createMeteor(i)
  }

  // ========== 滚动动画 ==========
  // 初始化状态
  gsap.set('.meteor-card', { x: 0, y: 0, opacity: 1, scale: 1, rotation: 0, skewX: 0, filter: 'blur(0px)' })
  gsap.set([headerBadgeRef.value, titleRef.value, subtitleRef.value], { y: 0, opacity: 1, filter: 'blur(0px)' })
  gsap.set(footerRef.value, { y: 0, opacity: 1 })

  // 卡片滚动配置 - 向斜上方飞出
  const scrollConfigs = [
    { x: -300, y: -250, rotation: -45, scale: 0.3, skewX: -20 },
    { x: 0, y: -300, rotation: 0, scale: 0.2, skewX: 0 },
    { x: 300, y: -250, rotation: 45, scale: 0.3, skewX: 20 }
  ]

  // 每个卡片独立滚动触发
  cards.forEach((card, i) => {
    if (!card) return
    const config = scrollConfigs[i]

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
            scale: 1 - p * (1 - (config.scale ?? 1)),
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
        y: -120 * p,
        opacity: 1 - p * 2,
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
        y: 80 * p,
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
  meteorAnimations.forEach(t => t.kill())
  if (meteorContainerRef.value) {
    meteorContainerRef.value.innerHTML = ''
  }
  ScrollTrigger.getAll().forEach(t => t.kill())
})
</script>

<style lang="scss" scoped>
.meteor-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(180deg, #0a0015 0%, #1a0030 50%, #0a1020 100%);
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
    radial-gradient(ellipse at 20% 20%, rgba(139, 92, 246, 0.2) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(245, 158, 11, 0.1) 0%, transparent 60%);
}

.bg-stars {
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(2px 2px at 20px 30px, white, transparent),
    radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
    radial-gradient(1px 1px at 90px 40px, white, transparent),
    radial-gradient(2px 2px at 160px 120px, rgba(255,255,255,0.9), transparent),
    radial-gradient(1px 1px at 230px 80px, white, transparent),
    radial-gradient(2px 2px at 300px 150px, rgba(255,255,255,0.7), transparent),
    radial-gradient(1px 1px at 370px 50px, white, transparent),
    radial-gradient(2px 2px at 450px 200px, white, transparent),
    radial-gradient(1px 1px at 520px 100px, rgba(255,255,255,0.8), transparent),
    radial-gradient(2px 2px at 600px 180px, white, transparent);
  background-size: 650px 250px;
  animation: twinkle 4s ease-in-out infinite;
  opacity: 0.6;
}

@keyframes twinkle {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
}

.meteor-container {
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
  background: linear-gradient(135deg, #fbbf24, #f97316, #ef4444);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  box-shadow: 
    0 0 30px rgba(251, 191, 36, 0.5),
    0 0 60px rgba(249, 115, 22, 0.3),
    inset 0 0 20px rgba(255, 255, 255, 0.3);
  
  svg { width: 40px; height: 40px; }
}

.title {
  font-size: 56px;
  font-weight: 900;
  background: linear-gradient(90deg, #fef3c7, #fbbf24, #f97316);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 10px;
  text-shadow: 0 0 40px rgba(251, 191, 36, 0.5);
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

.meteor-card {
  position: relative;
  width: 280px;
  padding: 32px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  cursor: pointer;
  transform-style: preserve-3d;
  will-change: transform, opacity, filter;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-15px) rotateX(5deg) rotateY(-5deg) scale(1.05);
    .card-glow { opacity: 1; }
  }
}

.card-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 0%, rgba(251, 191, 36, 0.4), transparent 70%);
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
  color: #fbbf24;
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
