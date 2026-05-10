<template>
  <section ref="sectionRef" class="combo-section">
    <div class="bg-gradient"></div>

    <header ref="headerRef" class="section-header">
      <div class="header-badge">
        <svg viewBox="0 0 24 24" fill="none">
          <polygon points="12,2 15,9 22,9 17,14 19,22 12,17 5,22 7,14 2,9 9,9" stroke="currentColor" stroke-width="2" fill="currentColor" opacity="0.3"/>
          <polygon points="12,2 15,9 22,9 17,14 19,22 12,17 5,22 7,14 2,9 9,9" stroke="currentColor" stroke-width="2"/>
        </svg>
      </div>
      <h1 class="title">九重效果组合</h1>
      <p class="subtitle">Nine Combo Animation</p>
    </header>

    <div class="cards-container">
      <div class="combo-card" data-index="0">
        <div class="card-glow"></div>
        <div class="card-content">
          <span class="card-num">01</span>
          <h3 class="card-title">九重A</h3>
          <p class="card-desc">最复杂的九重动画效果</p>
        </div>
      </div>

      <div class="combo-card" data-index="1">
        <div class="card-glow"></div>
        <div class="card-content">
          <span class="card-num">02</span>
          <h3 class="card-title">九重B</h3>
          <p class="card-desc">3D旋转九重效果</p>
        </div>
      </div>

      <div class="combo-card" data-index="2">
        <div class="card-glow"></div>
        <div class="card-content">
          <span class="card-num">03</span>
          <h3 class="card-title">九重C</h3>
          <p class="card-desc">弹性九重效果</p>
        </div>
      </div>
    </div>

    <footer ref="footerRef" class="section-footer">
      <span>CardNineCombo</span>
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

  // 三个卡片依次入场
  cards.forEach((card, i) => {
    tl.fromTo(card,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.5)' },
      `=-${0.3 - i * 0.1}`
    )
  })

  // 底部入场
  tl.fromTo(footerRef.value,
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
    '-=0.2'
  )

  // 滚动动画 - 每个卡片独立触发
  cards.forEach((card, i) => {
    const st = ScrollTrigger.create({
      trigger: card,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress
        const dir = self.direction

        if (dir > 0) {
          gsap.set(card, {
            opacity: 1 - progress * 0.8,
            y: progress * -80,
            scale: 1 - progress * 0.15
          })
        } else {
          gsap.set(card, {
            opacity: 1,
            y: 0,
            scale: 1
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

onMounted(() => {
  // 延迟初始化以确保懒加载时 DOM 已完全渲染
  setTimeout(initAnimations, 100)
})

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
  background: linear-gradient(135deg, #0a0a14 0%, #1a1a0a 50%, #0a0a14 100%);
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
    radial-gradient(ellipse at 20% 20%, rgba(245, 158, 11, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 80%, rgba(249, 115, 22, 0.08) 0%, transparent 50%);
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
  background: linear-gradient(135deg, #f59e0b, #f97316, #ef4444);
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
  background: linear-gradient(90deg, #f59e0b, #f97316, #ef4444, #ec4899);
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
  background: radial-gradient(circle at 50% 0%, rgba(245, 158, 11, 0.4), transparent 70%);
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
  color: #f59e0b;
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
