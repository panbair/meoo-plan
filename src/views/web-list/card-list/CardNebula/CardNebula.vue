<template>
  <section ref="nebulaRef" class="nebula-container">
    <!-- 背景星星层 -->
    <div class="stars-layer stars-1" ref="stars1Ref"></div>
    <div class="stars-layer stars-2" ref="stars2Ref"></div>
    <div class="stars-layer stars-3" ref="stars3Ref"></div>

    <!-- 星云层 -->
    <div class="nebula-layer nebula-1" ref="nebula1Ref"></div>
    <div class="nebula-layer nebula-2" ref="nebula2Ref"></div>
    <div class="nebula-layer nebula-3" ref="nebula3Ref"></div>

    <!-- 内容区域 -->
    <div class="nebula-content" ref="contentRef">
      <!-- 头部 -->
      <header class="nebula-header" ref="headerRef">
        <div class="header-icon" ref="headerIconRef">
          <svg viewBox="0 0 100 100" class="nebula-icon">
            <defs>
              <radialGradient id="coreGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#fff" />
                <stop offset="30%" stop-color="#a78bfa" />
                <stop offset="70%" stop-color="#6366f1" />
                <stop offset="100%" stop-color="#312e81" />
              </radialGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <circle cx="50" cy="50" r="15" fill="url(#coreGradient)" filter="url(#glow)" />
            <ellipse cx="50" cy="50" rx="35" ry="12" fill="none" stroke="#c4b5fd" stroke-width="1" opacity="0.6" />
            <ellipse cx="50" cy="50" rx="40" ry="20" fill="none" stroke="#a78bfa" stroke-width="0.8" opacity="0.4" />
            <ellipse cx="50" cy="50" rx="45" ry="28" fill="none" stroke="#8b5cf6" stroke-width="0.5" opacity="0.3" />
          </svg>
        </div>
        <span class="header-badge" ref="headerBadgeRef">02</span>
        <h1 class="header-title">星云奇观</h1>
        <p class="header-subtitle">Nebula Wonders</p>
      </header>

      <!-- 主视觉 -->
      <div class="nebula-visual" ref="visualRef">
        <div class="nebula-core" ref="coreRef"></div>
        <div class="nebula-ring ring-1"></div>
        <div class="nebula-ring ring-2"></div>
        <div class="nebula-ring ring-3"></div>
      </div>

      <!-- 卡片列表 -->
      <div class="nebula-cards" ref="cardsRef">
        <article
          v-for="(item, index) in cardsData"
          :key="item.id"
          class="nebula-card"
          :ref="el => cardItemRefs[index] = el as HTMLElement"
        >
          <div class="card-index">{{ item.id }}</div>
          <div class="card-content">
            <h3 class="card-title">{{ item.title }}</h3>
            <p class="card-description">{{ item.description }}</p>
          </div>
          <div class="card-divider"></div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void

const nebulaRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const headerIconRef = ref<HTMLElement | null>(null)
const headerBadgeRef = ref<HTMLElement | null>(null)
const visualRef = ref<HTMLElement | null>(null)
const coreRef = ref<HTMLElement | null>(null)
const cardsRef = ref<HTMLElement | null>(null)
const stars1Ref = ref<HTMLElement | null>(null)
const stars2Ref = ref<HTMLElement | null>(null)
const stars3Ref = ref<HTMLElement | null>(null)
const nebula1Ref = ref<HTMLElement | null>(null)
const nebula2Ref = ref<HTMLElement | null>(null)
const nebula3Ref = ref<HTMLElement | null>(null)
const cardItemRefs = ref<HTMLElement[]>([])

const cardsData = [
  { id: '01', title: '恒星摇篮', description: '气体与尘埃的密集区域，孕育着新生的恒星' },
  { id: '02', title: '行星状星云', description: '恒星晚期的华美绽放，形成美丽的外壳结构' },
  { id: '03', title: '发射星云', description: '氢气云中的新生光芒，被年轻恒星照亮' },
  { id: '04', title: '暗星云', description: '遮挡星光的神秘剪影，由浓密尘埃组成' }
]

let cleanupFns: TweenCleanup[] = []

const generateStars = () => {
  const layers = [
    { ref: stars1Ref.value, count: 80, size: '1px' },
    { ref: stars2Ref.value, count: 50, size: '2px' },
    { ref: stars3Ref.value, count: 20, size: '3px' }
  ]

  layers.forEach(layer => {
    if (!layer.ref) return
    let starsHTML = ''
    for (let i = 0; i < layer.count; i++) {
      const x = Math.random() * 100
      const y = Math.random() * 100
      const delay = Math.random() * 3
      const duration = 2 + Math.random() * 2
      starsHTML += `<div class="star" style="left: ${x}%; top: ${y}%; width: ${layer.size}; height: ${layer.size}; animation-delay: ${delay}s; animation-duration: ${duration}s;"></div>`
    }
    layer.ref.innerHTML = starsHTML
  })
}

const initAnimations = () => {
  const card = contentRef.value
  if (!card) return

  // slide-right 入场动画
  const tl = gsap.timeline()

  // 卡片入场
  tl.fromTo(card,
    { x: '-100%', visibility: 'hidden', opacity: 0 },
    { x: 0, visibility: 'visible', opacity: 1, duration: 1, ease: 'power3.out' }
  )

  // 头部动画
  if (headerRef.value) {
    tl.fromTo(headerRef.value,
      { y: -30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.2)' },
      '-=0.5'
    )
  }

  // 图标旋转
  if (headerIconRef.value) {
    tl.fromTo(headerIconRef.value,
      { rotation: -180, scale: 0 },
      { rotation: 0, scale: 1, duration: 1, ease: 'back.out(1.7)' },
      '-=0.4'
    )
  }

  // Badge 动画
  if (headerBadgeRef.value) {
    tl.fromTo(headerBadgeRef.value,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(2)' },
      '-=0.3'
    )
  }

  // 视觉区域动画
  if (visualRef.value) {
    tl.fromTo(visualRef.value,
      { scale: 0.5, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, ease: 'elastic.out(1, 0.5)' },
      '-=0.6'
    )
  }

  // 核心脉动
  if (coreRef.value) {
    tl.fromTo(coreRef.value,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.5)' },
      '-=0.4'
    )
  }

  // 卡片列表动画
  if (cardsRef.value) {
    tl.fromTo(cardsRef.value,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
      '-=0.3'
    )
  }

  cardItemRefs.value.forEach((cardItem, index) => {
    if (cardItem) {
      tl.fromTo(cardItem,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
        `-=${0.4 - index * 0.1}`
      )
    }
  })

  // 星云层动画
  const nebulaLayers = [nebula1Ref.value, nebula2Ref.value, nebula3Ref.value]
  nebulaLayers.forEach((layer, index) => {
    if (layer) {
      tl.fromTo(layer,
        { x: '-20%', opacity: 0 },
        { x: '0%', opacity: 0.6 + index * 0.1, duration: 2, ease: 'sine.inOut' },
        `-=${1.5 - index * 0.3}`
      )
    }
  })

  // ScrollTrigger 滚动动画
  const scrollTriggerInstance = ScrollTrigger.create({
    trigger: card,
    start: 'top 80%',
    end: 'top 20%',
    scrub: 1.5,
    onUpdate: (self) => {
      gsap.set(card, {
        x: 200 * self.progress,
        opacity: Math.max(0, 1 - self.progress * 2),
        visibility: self.progress < 1 ? 'visible' : 'hidden'
      })

      if (visualRef.value) {
        gsap.set(visualRef.value, {
          scale: 1 - self.progress * 0.3,
          rotation: self.progress * 30
        })
      }
    }
  })

  cleanupFns.push(() => scrollTriggerInstance.kill())

  // 星星闪烁动画
  const starLayers = [stars1Ref.value, stars2Ref.value, stars3Ref.value]
  const starTweens: gsap.core.Tween[] = []
  starLayers.forEach((layer, index) => {
    if (!layer) return
    const stars = layer.querySelectorAll('.star')
    stars.forEach((star, i) => {
      const tween = gsap.to(star, {
        opacity: 0.2 + Math.random() * 0.8,
        scale: 0.5 + Math.random() * 1,
        duration: 1 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.05
      })
      starTweens.push(tween)
    })
  })
  cleanupFns.push(() => starTweens.forEach(t => t.kill()))

  // 星云飘动动画
  const nebulaMoveTl = gsap.timeline({ repeat: -1, yoyo: true })
  if (nebula1Ref.value) {
    nebulaMoveTl.to(nebula1Ref.value, {
      x: '15%',
      duration: 8,
      ease: 'sine.inOut'
    })
  }
  if (nebula2Ref.value) {
    nebulaMoveTl.to(nebula2Ref.value, {
      x: '-10%',
      duration: 10,
      ease: 'sine.inOut'
    }, '<')
  }
  if (nebula3Ref.value) {
    nebulaMoveTl.to(nebula3Ref.value, {
      x: '20%',
      duration: 12,
      ease: 'sine.inOut'
    }, '<')
  }

  cleanupFns.push(() => nebulaMoveTl.kill())

  // 核心脉动动画
  if (coreRef.value) {
    const corePulse = gsap.timeline({ repeat: -1, yoyo: true })
    corePulse.to(coreRef.value, {
      scale: 1.2,
      duration: 2,
      ease: 'sine.inOut'
    })
    cleanupFns.push(() => corePulse.kill())
  }

  // 环旋转动画
  const ringTweens: gsap.core.Tween[] = []
  const rings = document.querySelectorAll('.nebula-ring')
  rings.forEach((ring, index) => {
    const tween = gsap.to(ring, {
      rotation: index % 2 === 0 ? 360 : -360,
      duration: 10 + index * 5,
      ease: 'none',
      repeat: -1
    })
    ringTweens.push(tween)
  })
  cleanupFns.push(() => ringTweens.forEach(t => t.kill()))
}

onMounted(() => {
  generateStars()
  initAnimations()
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
})
</script>

<style scoped lang="scss">
.nebula-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #0f0c29 0%, #1a1a3e 50%, #24243e 100%);
}

// 星星层
.stars-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;

  .star {
    position: absolute;
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 0 6px 2px rgba(255, 255, 255, 0.5);
  }
}

// 星云层
.nebula-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  mix-blend-mode: screen;
}

.nebula-1 {
  background: radial-gradient(ellipse at 30% 40%, rgba(138, 43, 226, 0.3) 0%, transparent 50%);
  animation: nebulaDrift1 15s ease-in-out infinite;
}

.nebula-2 {
  background: radial-gradient(ellipse at 70% 60%, rgba(75, 0, 130, 0.3) 0%, transparent 40%);
  animation: nebulaDrift2 18s ease-in-out infinite;
}

.nebula-3 {
  background: radial-gradient(ellipse at 50% 80%, rgba(72, 61, 139, 0.2) 0%, transparent 45%);
  animation: nebulaDrift3 20s ease-in-out infinite;
}

@keyframes nebulaDrift1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(5%, -3%) scale(1.1); }
}

@keyframes nebulaDrift2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-4%, 4%) scale(1.05); }
}

@keyframes nebulaDrift3 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(3%, -2%) scale(1.08); }
}

// 内容区域
.nebula-content {
  position: relative;
  z-index: 10;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
}

// 头部
.nebula-header {
  text-align: center;
  margin-bottom: 50px;

  .header-icon {
    width: 120px;
    height: 120px;
    margin: 0 auto 20px;
    transform-origin: center;

    .nebula-icon {
      width: 100%;
      height: 100%;
    }
  }

  .header-badge {
    display: inline-block;
    padding: 6px 16px;
    background: linear-gradient(135deg, rgba(167, 139, 250, 0.3), rgba(109, 40, 217, 0.3));
    border: 1px solid rgba(167, 139, 250, 0.5);
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;
    color: #c4b5fd;
    margin-bottom: 16px;
  }

  .header-title {
    font-size: 56px;
    font-weight: 700;
    background: linear-gradient(135deg, #fff 0%, #a78bfa 50%, #7c3aed 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 12px;
    letter-spacing: 4px;
  }

  .header-subtitle {
    font-size: 18px;
    color: #a5b4fc;
    letter-spacing: 6px;
    text-transform: uppercase;
    margin: 0;
  }
}

// 视觉区域
.nebula-visual {
  position: relative;
  width: 200px;
  height: 200px;
  margin-bottom: 60px;
  transform-origin: center;

  .nebula-core {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60px;
    height: 60px;
    background: radial-gradient(circle, #fff 0%, #c4b5fd 40%, #8b5cf6 70%, transparent 100%);
    border-radius: 50%;
    box-shadow: 0 0 40px 20px rgba(139, 92, 246, 0.5), 0 0 80px 40px rgba(109, 40, 217, 0.3);
    transform-origin: center;
  }

  .nebula-ring {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    border: 2px solid transparent;
    border-top-color: rgba(196, 181, 253, 0.6);
    border-right-color: rgba(167, 139, 250, 0.4);
  }

  .ring-1 {
    width: 100px;
    height: 100px;
    border-width: 2px;
  }

  .ring-2 {
    width: 140px;
    height: 140px;
    border-width: 1.5px;
    border-bottom-color: rgba(139, 92, 246, 0.5);
    border-left-color: rgba(109, 40, 217, 0.3);
  }

  .ring-3 {
    width: 180px;
    height: 180px;
    border-width: 1px;
    border-bottom-color: rgba(124, 58, 237, 0.4);
  }
}

// 卡片列表
.nebula-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  max-width: 900px;
  width: 100%;
}

.nebula-card {
  background: linear-gradient(135deg, rgba(30, 27, 75, 0.8), rgba(49, 46, 129, 0.6));
  border: 1px solid rgba(167, 139, 250, 0.3);
  border-radius: 16px;
  padding: 28px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, #a78bfa, transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(167, 139, 250, 0.6);
    box-shadow: 0 20px 40px rgba(109, 40, 217, 0.3);

    &::before {
      opacity: 1;
    }

    .card-index {
      transform: scale(1.1);
      color: #fff;
    }
  }

  .card-index {
    font-size: 32px;
    font-weight: 800;
    background: linear-gradient(135deg, #a78bfa, #7c3aed);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 16px;
    transition: all 0.3s ease;
  }

  .card-title {
    font-size: 22px;
    font-weight: 600;
    color: #e0e7ff;
    margin: 0 0 10px;
  }

  .card-description {
    font-size: 15px;
    color: #a5b4fc;
    line-height: 1.6;
    margin: 0;
  }

  .card-divider {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(167, 139, 250, 0.3), transparent);
  }
}
</style>
