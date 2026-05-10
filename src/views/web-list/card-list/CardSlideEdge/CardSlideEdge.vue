<template>
  <section ref="sectionRef" class="slide-edge-section">
    <!-- 背景 -->
    <div class="bg-gradient"></div>
    <div class="bg-glow"></div>

    <!-- 标题 -->
    <header ref="headerRef" class="section-header">
      <div class="header-badge">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
      <h1 class="title">边缘滑入</h1>
      <p class="subtitle">Slide Edge Animation</p>
    </header>

    <!-- 卡片容器 -->
    <div class="cards-container">
      <div class="slide-card" data-index="0">
        <div class="card-glow"></div>
        <div class="card-content">
          <span class="card-num">01</span>
          <h3 class="card-title">左侧滑入</h3>
          <p class="card-desc">卡片从左侧边缘滑入视野</p>
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M5 12L12 5M5 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="slide-card" data-index="1">
        <div class="card-glow"></div>
        <div class="card-content">
          <span class="card-num">02</span>
          <h3 class="card-title">右侧滑入</h3>
          <p class="card-desc">卡片从右侧边缘滑入视野</p>
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="slide-card" data-index="2">
        <div class="card-glow"></div>
        <div class="card-content">
          <span class="card-num">03</span>
          <h3 class="card-title">双向滑入</h3>
          <p class="card-desc">卡片从两侧同时滑入</p>
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M4 12H20M4 12L11 5M4 12L11 19M20 12L13 5M20 12L13 19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部 -->
    <footer ref="footerRef" class="section-footer">
      <span>CardSlideEdge</span>
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
  const cards = document.querySelectorAll('.slide-card')

  // 入场动画 - 统一 timeline
  const tl = gsap.timeline({ delay: 0.3 })

  // 标题入场 - 增强旋转缩放入场
  tl.fromTo('.header-badge',
    { scale: 0, opacity: 0, rotation: -360 },
    { scale: 1, opacity: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.7)' }
  )
  .fromTo('.title',
    { y: 40, opacity: 0, scale: 0.8 },
    { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' },
    '-=0.4'
  )
  .fromTo('.subtitle',
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
    '-=0.4'
  )

  // 卡片入场 - 从边缘滑入带旋转和倾斜
  // 卡片1: 左侧边缘滑入 + 逆时针旋转 + skewX
  tl.fromTo(cards[0],
    { x: -400, opacity: 0, rotation: -25, skewX: -15, scale: 0.7 },
    { x: 0, opacity: 1, rotation: 0, skewX: 0, scale: 1, duration: 1, ease: 'back.out(1.2)' },
    '=-0.3'
  )
  // 卡片2: 右侧边缘滑入 + 顺时针旋转 + skewX
  .fromTo(cards[1],
    { x: 400, opacity: 0, rotation: 25, skewX: 15, scale: 0.7 },
    { x: 0, opacity: 1, rotation: 0, skewX: 0, scale: 1, duration: 1, ease: 'back.out(1.2)' },
    '=-0.6'
  )
  // 卡片3: 底部边缘滑入 + 上下抖动旋转 + skewY
  .fromTo(cards[2],
    { y: 300, opacity: 0, rotation: 15, skewY: -10, scale: 0.5 },
    { y: 0, opacity: 1, rotation: 0, skewY: 0, scale: 1, duration: 1.2, ease: 'elastic.out(1, 0.5)' },
    '=-0.6'
  )

  // 底部入场
  tl.fromTo(footerRef.value,
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
    '-=0.3'
  )

  triggers.push(tl)

  // 滚动动画 - 每个卡片独立触发，带边缘滑出效果
  cards.forEach((card, i) => {
    const scrollAnim = [
      { targetX: -350, targetRot: -20, targetSkew: -12, targetScale: 0.6 },  // 卡片1: 向左滑出带旋转
      { targetX: 350, targetRot: 20, targetSkew: 12, targetScale: 0.6 },     // 卡片2: 向右滑出带旋转
      { targetY: -250, targetRot: 15, targetSkew: 8, targetScale: 0.5 }        // 卡片3: 向上滑出带旋转
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
            opacity: Math.max(0, 1 - progress * 1.2),
            x: progress * anim.targetX,
            y: progress * (anim.targetY || 0),
            rotation: progress * anim.targetRot,
            skewX: progress * anim.targetSkew,
            scale: 1 - progress * (1 - anim.targetScale),
            filter: `blur(${progress * 8}px)`
          })
        } else {
          gsap.set(card, {
            opacity: 1,
            x: 0,
            y: 0,
            rotation: 0,
            skewX: 0,
            scale: 1,
            filter: 'blur(0px)'
          })
        }
      }
    })
    triggers.push(st)
  })

  // 标题滚动消失 - 带旋转和模糊
  if (headerRef.value) {
    const st = ScrollTrigger.create({
      trigger: headerRef.value,
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        gsap.set(headerRef.value, {
          opacity: 1 - self.progress * 1.2,
          y: -self.progress * 80,
          rotation: self.progress * 5,
          filter: `blur(${self.progress * 4}px)`
        })
      }
    })
    triggers.push(st)
  }

  // 底部滚动消失
  if (footerRef.value) {
    const st = ScrollTrigger.create({
      trigger: footerRef.value,
      start: 'top bottom',
      end: 'center top',
      scrub: 1,
      onUpdate: (self) => {
        gsap.set(footerRef.value, {
          opacity: 1 - self.progress,
          y: self.progress * 30,
          filter: `blur(${self.progress * 6}px)`
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
.slide-edge-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #0f0a1a 0%, #1a0a2e 50%, #0a1a2e 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  perspective: 1200px;
  perspective-origin: center center;
}

.bg-gradient {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 30% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 80%, rgba(6, 182, 212, 0.1) 0%, transparent 50%);
}

.bg-glow {
  position: absolute;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.1), transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: pulse 4s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.1); }
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
  background: linear-gradient(135deg, #8b5cf6, #06b6d4);
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
  background: linear-gradient(90deg, #8b5cf6, #06b6d4);
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

.slide-card {
  position: relative;
  width: 280px;
  padding: 32px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  cursor: pointer;
  transition: transform 0.3s ease;
  transform-style: preserve-3d;
  will-change: transform, opacity, filter;

  &:hover {
    transform: translateY(-10px) scale(1.02);
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
  margin-bottom: 20px;
}

.card-icon {
  width: 48px;
  height: 48px;
  color: #8b5cf6;
  
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
