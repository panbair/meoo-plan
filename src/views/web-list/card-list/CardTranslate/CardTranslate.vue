<template>
  <section ref="sectionRef" class="translate-section">
    <div class="bg-gradient"></div>

    <header ref="headerRef" class="section-header">
      <div class="header-badge">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <path d="M5 5L12 12M5 19L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
        </svg>
      </div>
      <h1 class="title">位移动画</h1>
      <p class="subtitle">Translate Animation</p>
    </header>

    <div class="cards-container">
      <div class="translate-card" data-index="0">
        <div class="card-glow"></div>
        <div class="card-content">
          <span class="card-num">01</span>
          <h3 class="card-title">底部升起</h3>
          <p class="card-desc">从下方移动到视野内</p>
        </div>
      </div>

      <div class="translate-card" data-index="1">
        <div class="card-glow"></div>
        <div class="card-content">
          <span class="card-num">02</span>
          <h3 class="card-title">顶部降落</h3>
          <p class="card-desc">从上方移动到视野内</p>
        </div>
      </div>

      <div class="translate-card" data-index="2">
        <div class="card-glow"></div>
        <div class="card-content">
          <span class="card-num">03</span>
          <h3 class="card-title">斜向进入</h3>
          <p class="card-desc">从斜方向移动进入</p>
        </div>
      </div>
    </div>

    <footer ref="footerRef" class="section-footer">
      <span>CardTranslate</span>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
let triggers: ScrollTrigger[] = []

const initAnimations = () => {
  if (!sectionRef.value) return

  // ========== 入场动画 ==========
  const tl = gsap.timeline({ delay: 0.2 })

  // 标题入场
  tl.fromTo('.header-badge',
    { scale: 0, opacity: 0, rotation: -180 },
    { scale: 1, opacity: 1, rotation: 0, duration: 0.6, ease: 'back.out(2)' }
  )
  .fromTo('.title',
    { y: -60, opacity: 0, filter: 'blur(10px)' },
    { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' },
    '-=0.3'
  )
  .fromTo('.subtitle',
    { y: 30, opacity: 0, letterSpacing: '-5px' },
    { y: 0, opacity: 1, letterSpacing: '4px', duration: 0.6, ease: 'power2.out' },
    '-=0.3'
  )

  // 卡片入场配置
  const cardEnterConfigs = [
    { x: 0, y: 200, rotation: 0, scale: 0.8 },     // 卡片1: 从底部升起
    { x: 0, y: -200, rotation: 0, scale: 0.8 },   // 卡片2: 从顶部降落
    { x: 200, y: 100, rotation: -20, scale: 0.6 }  // 卡片3: 从右下斜向进入
  ]
  const cardEnterEases = ['back.out(1.5)', 'power3.out', 'elastic.out(1, 0.5)']

  const cards = document.querySelectorAll('.translate-card')
  cards.forEach((card, i) => {
    const config = cardEnterConfigs[i] || { x: 0, y: 0, rotation: 0, scale: 1 }
    const ease = cardEnterEases[i] || 'power3.out'
    tl.fromTo(card,
      { ...config, opacity: 0 },
      { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1, duration: 1, ease },
      `=-${0.7 - i * 0.1}`
    )
  })

  // 底部入场
  tl.fromTo(footerRef.value,
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5 },
    '-=0.3'
  )

  // ========== 滚动动画 ==========
  // 初始化状态
  gsap.set('.translate-card', { y: 0, x: 0, opacity: 1, scale: 1, rotation: 0, filter: 'blur(0px)' })
  gsap.set(headerRef.value, { y: 0, opacity: 1, filter: 'blur(0px)' })
  gsap.set(footerRef.value, { y: 0, opacity: 1 })

  // 卡片滚动配置
  const scrollConfigs = [
    { x: 0, y: -120, rotation: 0, scale: 0.85 },  // 卡片1: 向上位移
    { x: 100, y: -120, rotation: 10, scale: 0.85 }, // 卡片2: 向右上方位移
    { x: -100, y: -120, rotation: -10, scale: 0.85 } // 卡片3: 向左上方位移
  ]

  // 每个卡片独立滚动触发
  cards.forEach((card, i) => {
    const config = scrollConfigs[i] || { x: 0, y: 0, rotation: 0, scale: 1 }

    const trigger = ScrollTrigger.create({
      trigger: card,
      start: 'top bottom',
      end: 'center center',
      scrub: 1,
      onUpdate: (self) => {
        const p = self.progress
        const dir = self.direction
        const configScale = config.scale ?? 1

        if (dir > 0) {
          gsap.set(card, {
            y: config.y * p,
            x: (config.x ?? 0) * p,
            opacity: 1 - p * 1.2,
            scale: 1 - p * (1 - configScale),
            rotation: (config.rotation ?? 0) * p,
            filter: `blur(${p * 6}px)`
          })
        } else {
          gsap.set(card, { y: 0, x: 0, opacity: 1, scale: 1, rotation: 0, filter: 'blur(0px)' })
        }
      }
    })
    triggers.push(trigger)
  })

  // 标题滚动消失
  const headerTrigger = ScrollTrigger.create({
    trigger: headerRef.value,
    start: 'top top',
    end: '30% top',
    scrub: 1,
    onUpdate: (self) => {
      const p = self.progress
      gsap.set(headerRef.value, {
        y: -80 * p,
        opacity: 1 - p * 1.5,
        filter: `blur(${p * 8}px)`
      })
    }
  })
  triggers.push(headerTrigger)

  // 底部滚动消失
  const footerTrigger = ScrollTrigger.create({
    trigger: sectionRef.value,
    start: '80% top',
    end: 'bottom top',
    scrub: 1,
    onUpdate: (self) => {
      const p = self.progress
      gsap.set(footerRef.value, {
        y: 50 * p,
        opacity: 1 - p * 1.5
      })
    }
  })
  triggers.push(footerTrigger)
}

onMounted(() => initAnimations())

onUnmounted(() => {
  triggers.forEach(t => t.kill())
  triggers = []
})
</script>

<style lang="scss" scoped>
.translate-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #0a0a14 0%, #1a0a0a 50%, #0a0a14 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
}

.bg-gradient {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 50%, rgba(249, 115, 22, 0.1) 0%, transparent 60%);
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
  position: relative;
  z-index: 1;
}

.header-badge {
  width: 60px;
  height: 60px;
  margin: 0 auto 20px;
  background: linear-gradient(135deg, #f97316, #ef4444);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  
  svg { width: 32px; height: 32px; }
}

.title {
  font-size: 56px;
  font-weight: 900;
  background: linear-gradient(90deg, #f97316, #ef4444);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 4px;
}

.cards-container {
  display: flex;
  gap: 30px;
  position: relative;
  z-index: 1;
}

.translate-card {
  position: relative;
  width: 280px;
  padding: 32px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    .card-glow { opacity: 1; }
  }
}

.card-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 0%, rgba(249, 115, 22, 0.4), transparent 70%);
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
  color: #f97316;
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
}

.section-footer {
  position: absolute;
  bottom: 40px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.3);
  letter-spacing: 3px;
}
</style>
