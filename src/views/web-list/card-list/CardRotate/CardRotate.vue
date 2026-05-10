<template>
  <section ref="sectionRef" class="rotate-section">
    <div class="bg-gradient"></div>

    <header ref="headerRef" class="section-header">
      <div class="header-badge">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
          <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
      <h1 class="title">旋转动画</h1>
      <p class="subtitle">Rotate Animation</p>
    </header>

    <div class="cards-container">
      <div class="rotate-card" data-index="0">
        <div class="card-glow"></div>
        <div class="card-content">
          <span class="card-num">01</span>
          <h3 class="card-title">Y轴旋转</h3>
          <p class="card-desc">绕Y轴的旋转动画</p>
        </div>
      </div>

      <div class="rotate-card" data-index="1">
        <div class="card-glow"></div>
        <div class="card-content">
          <span class="card-num">02</span>
          <h3 class="card-title">X轴旋转</h3>
          <p class="card-desc">绕X轴的翻转动画</p>
        </div>
      </div>

      <div class="rotate-card" data-index="2">
        <div class="card-glow"></div>
        <div class="card-content">
          <span class="card-num">03</span>
          <h3 class="card-title">3D旋转</h3>
          <p class="card-desc">多轴组合的3D旋转</p>
        </div>
      </div>
    </div>

    <footer ref="footerRef" class="section-footer">
      <span>CardRotate</span>
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
  const cards = document.querySelectorAll('.rotate-card')

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

  // 卡片入场 - 带有3D旋转效果
  const cardAnimations = [
    { x: -100, rotationY: -90 },  // 卡片1: 从左旋转
    { y: -80, rotationX: 90 },     // 卡片2: 从上翻转
    { x: 100, rotationY: 90 }      // 卡片3: 从右旋转
  ]

  cards.forEach((card, i) => {
    const anim = cardAnimations[i]
    tl.fromTo(card,
      { ...anim, opacity: 0 },
      { x: 0, y: 0, rotationX: 0, rotationY: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.5)' },
      `=-${0.4 - i * 0.1}`
    )
  })

  // 底部入场
  tl.fromTo(footerRef.value,
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
    '-=0.2'
  )

  triggers.push(tl)

  // 滚动动画 - 每个卡片独立触发
  cards.forEach((card, i) => {
    const scrollAnim = [
      { rotationY: -30, x: -30 },   // 卡片1: 向左倾斜
      { rotationX: 20, y: -20 },     // 卡片2: 向上翻转
      { rotationY: 30, x: 30 }       // 卡片3: 向右倾斜
    ]
    const anim = scrollAnim[i]

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
            opacity: 1 - progress * 0.7,
            y: progress * -60,
            scale: 1 - progress * 0.1,
            rotationY: progress * anim.rotationY,
            rotationX: progress * anim.rotationX,
            x: progress * anim.x
          })
        } else {
          gsap.set(card, {
            opacity: 1,
            y: 0,
            scale: 1,
            rotationY: 0,
            rotationX: 0,
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
.rotate-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #0a0a14 0%, #140a1a 50%, #0a0a14 100%);
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
  background: radial-gradient(ellipse at 50% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 60%);
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
  background: linear-gradient(135deg, #8b5cf6, #a855f7);
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
  background: linear-gradient(90deg, #8b5cf6, #a855f7);
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
  transform-style: preserve-3d;
}

.rotate-card {
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
    transform: translateY(-10px) rotateY(10deg);
    .card-glow { opacity: 1; }
  }
}

.card-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.4), transparent 70%);
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
  color: #8b5cf6;
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
