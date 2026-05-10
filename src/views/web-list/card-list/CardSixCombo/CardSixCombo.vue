<template>
  <section ref="sectionRef" class="combo-section">
    <div class="bg-gradient"></div>

    <header ref="headerRef" class="section-header">
      <div class="header-badge">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2"/>
          <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2"/>
          <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2"/>
          <circle cx="12" cy="12" r="3" fill="currentColor"/>
        </svg>
      </div>
      <h1 class="title">六重效果组合</h1>
      <p class="subtitle">Six Combo Animation</p>
    </header>

    <div class="cards-container">
      <div class="combo-card" data-index="0">
        <div class="card-glow"></div>
        <div class="card-content">
          <span class="card-num">01</span>
          <h3 class="card-title">六重A</h3>
          <p class="card-desc">位移→旋转→缩放→渐变→旋转→位移</p>
        </div>
      </div>

      <div class="combo-card" data-index="1">
        <div class="card-glow"></div>
        <div class="card-content">
          <span class="card-num">02</span>
          <h3 class="card-title">六重B</h3>
          <p class="card-desc">不同顺序的六重效果</p>
        </div>
      </div>

      <div class="combo-card" data-index="2">
        <div class="card-glow"></div>
        <div class="card-content">
          <span class="card-num">03</span>
          <h3 class="card-title">六重C</h3>
          <p class="card-desc">弹性缓动六重效果</p>
        </div>
      </div>
    </div>

    <footer ref="footerRef" class="section-footer">
      <span>CardSixCombo</span>
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
  
  const cards = document.querySelectorAll('.combo-card')

  // 入场动画 - 统一 timeline
  const tl = gsap.timeline({ delay: 0.3 })

  // 标题入场
  tl.fromTo('.header-badge',
    { scale: 0, opacity: 0, rotation: -180 },
    { scale: 1, opacity: 1, rotation: 0, duration: 0.6, ease: 'back.out(2)' }
  )
  .fromTo('.title',
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
    '-=0.3'
  )
  .fromTo('.subtitle',
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
    '-=0.4'
  )

  // 卡片入场配置 - 六重效果（位移+旋转+缩放+倾斜+3D+渐变）
  const cardEnterConfigs = [
    { x: -120, y: 60, rotation: -30, scale: 0.5, skewX: 15 },  // 卡片1: 左上
    { x: 120, y: 60, rotation: 30, scale: 0.5, skewX: -15 },   // 卡片2: 右上
    { x: 0, y: 100, rotation: 0, scale: 0.6, skewX: 0, rotationX: 20 } // 卡片3: 下方
  ]

  cards.forEach((card, i) => {
    const config = cardEnterConfigs[i] || { x: 0, y: 0, rotation: 0, scale: 1, skewX: 0, rotationX: 0 }
    tl.fromTo(card,
      { ...config, opacity: 0 },
      { x: 0, y: 0, scale: 1, rotation: 0, skewX: 0, rotationX: 0, opacity: 1, duration: 1, ease: 'back.out(1.5)' },
      `=-${0.6 - i * 0.15}`
    )
  })

  // 底部入场
  tl.fromTo(footerRef.value,
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
    '-=0.2'
  )

  triggers.push(tl)

  // 滚动动画配置
  const scrollConfigs = [
    { x: 80, y: -50, rotation: 20, scale: 0.8 },    // 卡片1: 右上+旋转
    { x: -80, y: -50, rotation: -20, scale: 0.8 },  // 卡片2: 左上+旋转
    { x: 0, y: -60, rotation: 0, scale: 0.85 }      // 卡片3: 上移缩小
  ]

  // 滚动动画 - 每个卡片独立触发
  cards.forEach((card, i) => {
    const config = scrollConfigs[i] || { x: 0, y: 0, rotation: 0, scale: 1 }

    const st = ScrollTrigger.create({
      trigger: card,
      start: 'top bottom',
      end: 'center center',
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress
        const dir = self.direction

        if (dir > 0) {
          gsap.set(card, {
            opacity: 1 - progress * 0.8,
            y: progress * (config.y ?? 0),
            scale: 1 - progress * (1 - (config.scale ?? 1)),
            rotation: progress * (config.rotation ?? 0),
            x: progress * (config.x ?? 0)
          })
        } else {
          gsap.set(card, {
            opacity: 1,
            y: 0,
            scale: 1,
            rotation: 0,
            x: 0
          })
        }
      }
    })
    triggers.push(st)
  })

  // 标题滚动消失
  if (headerRef.value) {
    const st = ScrollTrigger.create({
      trigger: headerRef.value,
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        gsap.set(headerRef.value, {
          opacity: 1 - self.progress,
          y: -self.progress * 60
        })
      }
    })
    triggers.push(st)
  }
}

onMounted(() => initAnimations())

onUnmounted(() => {
  triggers.forEach(st => st.kill())
})
</script>

<style lang="scss" scoped>
.combo-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #0a0a14 0%, #0a0a1a 50%, #0a0a14 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  perspective: 1000px;
}

.bg-gradient {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(ellipse at 30% 30%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 70%, rgba(139, 92, 246, 0.08) 0%, transparent 50%);
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
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  
  svg { width: 32px; height: 32px; }
}

.title {
  font-size: 42px;
  font-weight: 900;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
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

.combo-card {
  position: relative;
  width: 280px;
  padding: 32px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  cursor: pointer;
  transform-style: preserve-3d;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-10px) rotateX(5deg) rotateY(-5deg);
    .card-glow { opacity: 1; }
  }
}

.card-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.4), transparent 70%);
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
  color: #3b82f6;
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
