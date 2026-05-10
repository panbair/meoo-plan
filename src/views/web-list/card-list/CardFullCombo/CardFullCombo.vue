<template>
  <section ref="sectionRef" class="combo-section">
    <div class="bg-gradient"></div>

    <header ref="headerRef" class="section-header">
      <div ref="headerBadgeRef" class="header-badge">
        <svg viewBox="0 0 24 24" fill="none">
          <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" stroke="currentColor" stroke-width="2"/>
          <circle cx="12" cy="12" r="4" fill="currentColor"/>
        </svg>
      </div>
      <h1 ref="titleRef" class="title">位移旋转缩放渐变</h1>
      <p ref="subtitleRef" class="subtitle">Translate Rotate Scale Opacity</p>
    </header>

    <div ref="cardsContainerRef" class="cards-container">
      <div ref="card0Ref" class="combo-card" data-index="0">
        <div class="card-glow"></div>
        <div class="card-content">
          <span class="card-num">01</span>
          <h3 class="card-title">四重组合A</h3>
          <p class="card-desc">位移+旋转+缩放+渐变</p>
        </div>
      </div>

      <div ref="card1Ref" class="combo-card" data-index="1">
        <div class="card-glow"></div>
        <div class="card-content">
          <span class="card-num">02</span>
          <h3 class="card-title">四重组合B</h3>
          <p class="card-desc">不同顺序的组合效果</p>
        </div>
      </div>

      <div ref="card2Ref" class="combo-card" data-index="2">
        <div class="card-glow"></div>
        <div class="card-content">
          <span class="card-num">03</span>
          <h3 class="card-title">四重组合C</h3>
          <p class="card-desc">弹性缓动组合效果</p>
        </div>
      </div>
    </div>

    <footer ref="footerRef" class="section-footer">
      <span>CardFullCombo</span>
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
const headerBadgeRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const cardsContainerRef = ref<HTMLElement | null>(null)
const card0Ref = ref<HTMLElement | null>(null)
const card1Ref = ref<HTMLElement | null>(null)
const card2Ref = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)

let triggers: ScrollTrigger[] = []

const initAnimations = () => {
  if (!sectionRef.value) return

  // ========== 入场动画 ==========
  const entryTl = gsap.timeline({ delay: 0.2 })

  // 标题徽章：缩放 + 旋转 + 渐入
  if (headerBadgeRef.value) {
    entryTl.fromTo(headerBadgeRef.value,
      { scale: 0, opacity: 0, rotation: -360 },
      { scale: 1, opacity: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.7)' }
    )
  }

  // 标题：从上方滑入 + 缩放
  if (titleRef.value) {
    entryTl.fromTo(titleRef.value,
      { y: -60, opacity: 0, scale: 0.8, filter: 'blur(10px)' },
      { y: 0, opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out' },
      '-=0.4'
    )
  }

  // 副标题：从下方滑入 + 渐显
  if (subtitleRef.value) {
    entryTl.fromTo(subtitleRef.value,
      { y: 30, opacity: 0, letterSpacing: '-5px' },
      { y: 0, opacity: 1, letterSpacing: '4px', duration: 0.6, ease: 'power2.out' },
      '-=0.3'
    )
  }

  const cards = [card0Ref.value, card1Ref.value, card2Ref.value]
  const cardEntryStyles = [
    { x: -200, y: 150, rotation: -45, scale: 0.3, opacity: 0 },  // 左下角飞入
    { x: 200, y: 150, rotation: 45, scale: 0.3, opacity: 0 },     // 右下角飞入
    { x: 0, y: 200, rotation: 0, scale: 0.3, opacity: 0 }          // 正下方弹入
  ]
  const cardEntryEases = ['power3.out', 'back.out(1.2)', 'elastic.out(1, 0.6)']

  cards.forEach((card, i) => {
    if (card) {
      entryTl.fromTo(card,
        cardEntryStyles[i],
        {
          x: 0, y: 0, rotation: 0, scale: 1, opacity: 1,
          duration: 1.2,
          ease: cardEntryEases[i]
        },
        `-=${i === 0 ? 0.6 : 0.5}`
      )
    }
  })

  // 底部入场
  if (footerRef.value) {
    entryTl.fromTo(footerRef.value,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5 },
      '-=0.3'
    )
  }

  // ========== 滚动动画 ==========
  // 设置初始状态（用于滚动恢复）
  gsap.set(headerRef.value, { y: 0, opacity: 1, rotation: 0 })
  gsap.set(cards, { y: 0, opacity: 1, rotation: 0, scale: 1, filter: 'blur(0px)' })
  gsap.set(footerRef.value, { y: 0, opacity: 1 })

  // 标题滚动消失：向上位移 + 旋转 + 模糊
  if (headerRef.value) {
    const headerTrigger = ScrollTrigger.create({
      trigger: sectionRef.value,
      start: 'top top',
      end: '30% top',
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress
        gsap.set(headerRef.value, {
          y: -100 * progress,
          opacity: 1 - progress * 1.5,
          rotation: 15 * progress,
          filter: `blur(${progress * 8}px)`
        })
      }
    })
    triggers.push(headerTrigger)
  }

  // 卡片1滚动动画：向左上方位移 + 旋转 + 缩小 + 渐隐
  if (cards[0]) {
    const card0Trigger = ScrollTrigger.create({
      trigger: cards[0],
      start: 'top bottom',
      end: 'center center',
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress
        gsap.set(cards[0], {
          x: -120 * progress,
          y: -80 * progress,
          rotation: -20 * progress,
          scale: 1 - progress * 0.4,
          opacity: 1 - progress * 1.2,
          filter: `blur(${progress * 4}px)`
        })
      }
    })
    triggers.push(card0Trigger)
  }

  // 卡片2滚动动画：向右上方位移 + 旋转 + 缩小 + 渐隐
  if (cards[1]) {
    const card1Trigger = ScrollTrigger.create({
      trigger: cards[1],
      start: 'top bottom',
      end: 'center center',
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress
        gsap.set(cards[1], {
          x: 120 * progress,
          y: -80 * progress,
          rotation: 20 * progress,
          scale: 1 - progress * 0.4,
          opacity: 1 - progress * 1.2,
          filter: `blur(${progress * 4}px)`
        })
      }
    })
    triggers.push(card1Trigger)
  }

  // 卡片3滚动动画：向上位移 + 缩小 + 渐隐
  if (cards[2]) {
    const card2Trigger = ScrollTrigger.create({
      trigger: cards[2],
      start: 'top bottom',
      end: 'center center',
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress
        gsap.set(cards[2], {
          y: -100 * progress,
          rotation: Math.sin(progress * Math.PI) * 10,
          scale: 1 - progress * 0.5,
          opacity: 1 - progress * 1.3,
          filter: `blur(${progress * 6}px)`
        })
      }
    })
    triggers.push(card2Trigger)
  }

  // 底部滚动消失
  if (footerRef.value) {
    const footerTrigger = ScrollTrigger.create({
      trigger: sectionRef.value,
      start: '80% top',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress
        gsap.set(footerRef.value, {
          y: 50 * progress,
          opacity: 1 - progress * 1.5,
          rotation: -10 * progress
        })
      }
    })
    triggers.push(footerTrigger)
  }
}

onMounted(() => initAnimations())

onUnmounted(() => {
  triggers.forEach(trigger => trigger.kill())
  triggers = []
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style lang="scss" scoped>
.combo-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #0a0a14 0%, #1a0a1a 50%, #0a1a0a 100%);
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
    radial-gradient(ellipse at 20% 50%, rgba(239, 68, 68, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 50%, rgba(59, 130, 246, 0.08) 0%, transparent 50%);
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
  position: relative;
  z-index: 1;
  transform-origin: center center;
}

.header-badge {
  width: 60px;
  height: 60px;
  margin: 0 auto 20px;
  background: linear-gradient(135deg, #ef4444, #3b82f6, #22c55e);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  transform-origin: center center;
  
  svg { width: 32px; height: 32px; }
}

.title {
  font-size: 42px;
  font-weight: 900;
  background: linear-gradient(90deg, #ef4444, #f97316, #eab308, #22c55e, #3b82f6, #8b5cf6);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 10px;
  transform-origin: center center;
}

.subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 4px;
  transform-origin: center center;
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
  height: 280px;
  padding: 32px;
  background: rgba(20, 15, 35, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(249, 115, 22, 0.3);
  border-radius: 20px;
  cursor: pointer;
  opacity: 1;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(249, 115, 22, 0.1);
  transform-style: preserve-3d;
  transition: transform 0.3s ease;
  transform-origin: center center;

  &:hover {
    transform: translateY(-10px) rotateX(5deg) rotateY(-5deg);
    .card-glow { opacity: 1; }
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6), 0 0 30px rgba(249, 115, 22, 0.2);
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
  transform-origin: center center;
}
</style>
