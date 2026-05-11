<template>
  <section ref="sectionRef" class="slide-edge-section">
    <div class="bg-gradient"></div>
    <div class="bg-glow"></div>

    <header ref="headerRef" class="section-header">
      <div class="header-badge">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" opacity="0.5"/>
        </svg>
      </div>
      <h1 class="title">边缘滑入</h1>
      <p class="subtitle">Translate Rotate Scale</p>
    </header>

    <div class="cards-container">
      <div class="slide-card" data-index="0">
        <div class="card-glow"></div>
        <div class="card-content">
          <span class="card-num">01</span>
          <h3 class="card-title">左侧滑入</h3>
          <p class="card-desc">从屏幕左侧边缘滑入</p>
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
          <p class="card-desc">从屏幕右侧边缘滑入</p>
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
          <h3 class="card-title">底部滑入</h3>
          <p class="card-desc">从屏幕底部边缘滑入</p>
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <footer ref="footerRef" class="section-footer">
      <span>CardTranslateRotateScale</span>
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

  // 标题入场 - 增强旋转缩放
  tl.fromTo('.header-badge',
    { scale: 0, opacity: 0, rotation: -360 },
    { scale: 1, opacity: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.7)' }
  )
  .fromTo('.title',
    { x: 100, opacity: 0, filter: 'blur(12px)', scale: 0.7 },
    { x: 0, opacity: 1, filter: 'blur(0px)', scale: 1, duration: 0.8, ease: 'power3.out' },
    '-=0.4'
  )
  .fromTo('.subtitle',
    { y: 40, opacity: 0, letterSpacing: '-3px' },
    { y: 0, opacity: 1, letterSpacing: '4px', duration: 0.6, ease: 'power2.out' },
    '-=0.4'
  )

  // 卡片入场 - 从边缘滑入带旋转和倾斜
  // 卡片1: 左侧边缘滑入 + 逆时针旋转 + skewY
  tl.fromTo('.slide-card[data-index="0"]',
    { x: -500, opacity: 0, rotation: -30, skewY: -20, scale: 0.5 },
    { x: 0, opacity: 1, rotation: 0, skewY: 0, scale: 1, duration: 1.2, ease: 'back.out(1.2)' },
    '=-0.3'
  )
  // 卡片2: 右侧边缘滑入 + 顺时针旋转 + skewY
  .fromTo('.slide-card[data-index="1"]',
    { x: 500, opacity: 0, rotation: 30, skewY: 20, scale: 0.5 },
    { x: 0, opacity: 1, rotation: 0, skewY: 0, scale: 1, duration: 1.2, ease: 'back.out(1.2)' },
    '=-0.7'
  )
  // 卡片3: 底部边缘滑入 + 旋转 + skewX + 弹性缓动
  .fromTo('.slide-card[data-index="2"]',
    { y: 400, opacity: 0, rotation: 25, skewX: -15, scale: 0.3 },
    { y: 0, opacity: 1, rotation: 0, skewX: 0, scale: 1, duration: 1.4, ease: 'elastic.out(1, 0.5)' },
    '=-0.7'
  )

  // 底部入场
  tl.fromTo(footerRef.value,
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5 },
    '-=0.3'
  )

  // ========== 滚动动画 ==========
  // 初始化状态
  gsap.set('.slide-card', { x: 0, y: 0, opacity: 1, scale: 1, rotation: 0, skewX: 0, skewY: 0, filter: 'blur(0px)' })
  gsap.set(headerRef.value, { y: 0, opacity: 1, filter: 'blur(0px)' })
  gsap.set(footerRef.value, { y: 0, opacity: 1 })

  // 卡片滚动配置 - 向边缘滑出
  const scrollConfigs = [
    { x: -400, y: 0, rotation: -35, skewY: -15, scale: 0.4 },  // 卡片1: 向左滑出
    { x: 400, y: 0, rotation: 35, skewY: 15, scale: 0.4 },     // 卡片2: 向右滑出
    { x: 0, y: -350, rotation: 30, skewX: -20, scale: 0.3 }    // 卡片3: 向上滑出
  ]

  // 每个卡片独立滚动触发
  document.querySelectorAll('.slide-card').forEach((card, i) => {
    const config = scrollConfigs[i] ?? { x: 0, y: 0, rotation: 0, skewX: 0, skewY: 0, scale: 1 }

    const trigger = ScrollTrigger.create({
      trigger: card,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        const p = self.progress
        const dir = self.direction

        if (dir > 0) {
          gsap.set(card, {
            x: (config.x ?? 0) * p,
            y: (config.y ?? 0) * p,
            opacity: Math.max(0, 1 - p * 1.5),
            scale: 1 - p * (1 - (config.scale ?? 1)),
            rotation: (config.rotation ?? 0) * p,
            skewX: (config.skewX ?? 0) * p,
            skewY: (config.skewY ?? 0) * p,
            filter: `blur(${p * 10}px)`
          })
        } else {
          gsap.set(card, {
            x: 0, y: 0, opacity: 1, scale: 1, rotation: 0, skewX: 0, skewY: 0, filter: 'blur(0px)'
          })
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
        y: -100 * p,
        opacity: 1 - p * 1.5,
        rotation: p * 8,
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
        y: 60 * p,
        opacity: 1 - p * 1.5,
        filter: `blur(${p * 6}px)`
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
.slide-edge-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #0a0a14 0%, #0a1a0a 50%, #0a0a14 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  perspective: 1500px;
  perspective-origin: center center;
}

.bg-gradient {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 30% 20%, rgba(34, 197, 94, 0.15) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 80%, rgba(6, 182, 212, 0.1) 0%, transparent 50%);
}

.bg-glow {
  position: absolute;
  width: 700px;
  height: 700px;
  background: radial-gradient(circle, rgba(34, 197, 94, 0.12), transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: pulse 5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.7; transform: translate(-50%, -50%) scale(1.15); }
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
  background: linear-gradient(135deg, #22c55e, #16a34a);
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
  background: linear-gradient(90deg, #22c55e, #16a34a, #06b6d4);
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
  transform-style: preserve-3d;
  will-change: transform, opacity, filter;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-12px) rotateX(5deg) rotateY(-5deg) scale(1.03);
    .card-glow { opacity: 1; }
  }
}

.card-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 0%, rgba(34, 197, 94, 0.5), transparent 70%);
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
  color: #22c55e;
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
  color: #22c55e;
  
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
