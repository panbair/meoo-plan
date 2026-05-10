<template>
  <section ref="sectionRef" class="combo-section">
    <div class="bg-gradient"></div>

    <header ref="headerRef" class="section-header">
      <div class="header-badge">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2"/>
          <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2"/>
          <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2"/>
        </svg>
      </div>
      <h1 class="title">旋转缩放位移</h1>
      <p class="subtitle">Rotate Scale Translate</p>
    </header>

    <div class="cards-container">
      <div class="combo-card" data-index="0">
        <div class="card-glow"></div>
        <div class="card-content">
          <span class="card-num">01</span>
          <h3 class="card-title">右上进入</h3>
          <p class="card-desc">旋转+缩放+位移组合</p>
        </div>
      </div>

      <div class="combo-card" data-index="1">
        <div class="card-glow"></div>
        <div class="card-content">
          <span class="card-num">02</span>
          <h3 class="card-title">左下进入</h3>
          <p class="card-desc">反向旋转组合动画</p>
        </div>
      </div>

      <div class="combo-card" data-index="2">
        <div class="card-glow"></div>
        <div class="card-content">
          <span class="card-num">03</span>
          <h3 class="card-title">中心扩散</h3>
          <p class="card-desc">从中心向外扩散</p>
        </div>
      </div>
    </div>

    <footer ref="footerRef" class="section-footer">
      <span>CardRotateScaleTranslate</span>
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

  // 标题入场：缩放 + 旋转 + 渐显
  tl.fromTo('.header-badge',
    { scale: 0, opacity: 0, rotation: -360 },
    { scale: 1, opacity: 1, rotation: 0, duration: 0.8, ease: 'back.out(2)' }
  )
  .fromTo('.title',
    { x: 100, opacity: 0, filter: 'blur(10px)', skewX: 20 },
    { x: 0, opacity: 1, filter: 'blur(0px)', skewX: 0, duration: 0.8, ease: 'power3.out' },
    '-=0.4'
  )
  .fromTo('.subtitle',
    { y: 30, opacity: 0, letterSpacing: '-5px' },
    { y: 0, opacity: 1, letterSpacing: '4px', duration: 0.6, ease: 'power2.out' },
    '-=0.3'
  )

  // 卡片入场配置 - 旋转+缩放+位移组合
  const cardEnterConfigs = [
    { x: -180, y: 120, rotation: -180, scale: 0.2, skewY: 15 },   // 卡片1: 左下角大旋转
    { x: 180, y: -80, rotation: 270, scale: 0.3, skewY: -15 },     // 卡片2: 右上角螺旋
    { x: 0, y: 150, rotation: 540, scale: 0.1, skewY: 0 }          // 卡片3: 正下方多重旋转
  ]
  const cardEnterEases = ['back.out(1.2)', 'elastic.out(1, 0.5)', 'power4.out']

  const cards = document.querySelectorAll('.combo-card')
  cards.forEach((card, i) => {
    const config = cardEnterConfigs[i] || { x: 0, y: 0, rotation: 0, scale: 1, skewY: 0 }
    const ease = cardEnterEases[i] || 'power3.out'
    tl.fromTo(card,
      { ...config, opacity: 0 },
      { x: 0, y: 0, scale: 1, rotation: 0, skewY: 0, opacity: 1, duration: 1.3, ease },
      `=-${0.9 - i * 0.15}`
    )
  })

  // 底部入场
  tl.fromTo(footerRef.value,
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5 },
    '-=0.3'
  )

  triggers.push(tl)

  // ========== 滚动动画 ==========
  // 初始化状态
  gsap.set('.combo-card', { x: 0, y: 0, opacity: 1, scale: 1, rotation: 0, skewY: 0, skewX: 0, filter: 'blur(0px)' })
  gsap.set(headerRef.value, { y: 0, opacity: 1, filter: 'blur(0px)' })
  gsap.set(footerRef.value, { y: 0, opacity: 1 })

  // 卡片滚动配置 - 旋转+缩放+位移消失
  const scrollConfigs = [
    { x: 100, y: -80, rotation: 180, scale: 0.3, skewX: 20 },   // 卡片1: 向右上螺旋消失
    { x: -100, y: -80, rotation: -180, scale: 0.3, skewX: -20 }, // 卡片2: 向左上螺旋消失
    { x: 0, y: -100, rotation: 360, scale: 0.2, skewX: 0 }       // 卡片3: 向上旋转消失
  ]

  // 每个卡片独立滚动触发
  cards.forEach((card, i) => {
    const config = scrollConfigs[i] || { x: 0, y: 0, rotation: 0, scale: 1, skewX: 0 }

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
            x: (config.x ?? 0) * p,
            y: (config.y ?? 0) * p,
            opacity: 1 - p * 1.5,
            scale: 1 - p * (1 - configScale),
            rotation: (config.rotation ?? 0) * p,
            skewX: (config.skewX ?? 0) * p,
            filter: `blur(${p * 10}px)`
          })
        } else {
          gsap.set(card, { x: 0, y: 0, opacity: 1, scale: 1, rotation: 0, skewX: 0, filter: 'blur(0px)' })
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
        filter: `blur(${p * 12}px)`,
        rotation: 10 * p
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

onMounted(() => {
  // 延迟初始化以确保懒加载时 DOM 已完全渲染
  setTimeout(initAnimations, 100)
})

onUnmounted(() => {
  triggers.forEach(t => t.kill())
  triggers = []
})
</script>

<style lang="scss" scoped>
.combo-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #0a0a14 0%, #1a0a14 50%, #0a0a14 100%);
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
  background: radial-gradient(ellipse at 50% 50%, rgba(236, 72, 153, 0.1) 0%, transparent 60%);
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
  background: linear-gradient(135deg, #ec4899, #f43f5e);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  
  svg { width: 32px; height: 32px; }
}

.title {
  font-size: 48px;
  font-weight: 900;
  background: linear-gradient(90deg, #ec4899, #f43f5e);
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
  background: radial-gradient(circle at 50% 0%, rgba(236, 72, 153, 0.4), transparent 70%);
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
}

.section-footer {
  position: absolute;
  bottom: 40px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.3);
  letter-spacing: 3px;
}
</style>
