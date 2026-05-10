<template>
  <section ref="sectionRef" class="solar-flare-section">
    <!-- 太阳核心背景 -->
    <div ref="sunCoreRef" class="sun-core">
      <div class="sun-pulse"></div>
      <div class="sun-glow"></div>
      <div class="sun-corona"></div>
    </div>

    <!-- 耀斑粒子 -->
    <div ref="flareContainerRef" class="flare-container"></div>

    <!-- 能量波 -->
    <div class="energy-waves">
      <div class="energy-ring" v-for="i in 5" :key="i" :style="{ '--ring-i': i }"></div>
    </div>

    <!-- 主容器 -->
    <div class="solar-container">
      <!-- 标题 -->
      <div ref="headerRef" class="solar-header">
        <div ref="badgeRef" class="header-badge">
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="5" fill="currentColor"/>
            <path d="M12 2V4M12 20V22M2 12H4M20 12H22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M4.93 4.93L6.34 6.34M17.66 17.66L19.07 19.07M4.93 19.07L6.34 17.66M17.66 6.34L19.07 4.93" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <h1 ref="titleRef" class="solar-title">SOLAR FLARE</h1>
        <p ref="subtitleRef" class="solar-subtitle">STELLAR ENERGY ERUPTION</p>
      </div>

      <!-- 卡片组 -->
      <div ref="cardsContainerRef" class="cards-container">
        <div
          v-for="(card, index) in cards"
          :key="card.id"
          class="solar-card"
          :ref="el => setCardRef(el, index)"
          :style="{ '--card-color': card.color, '--index': index }"
        >
          <div class="card-flare-effect"></div>
          <div class="card-heat-wave"></div>
          <div class="card-corona-ring"></div>
          <div class="card-content">
            <div class="card-icon-wrapper">
              <div class="card-energy-core">
                <span class="card-icon">{{ card.icon }}</span>
              </div>
              <div class="energy-ripple" v-for="i in 3" :key="i"></div>
            </div>
            <h3 class="card-title">{{ card.title }}</h3>
            <p class="card-desc">{{ card.desc }}</p>
            <div class="card-energy-bar">
              <div class="energy-fill" :style="{ '--fill-width': card.energy + '%', '--bar-color': card.color }"></div>
            </div>
            <div class="card-stats">
              <div class="stat" v-for="stat in card.stats" :key="stat.label">
                <span class="stat-value" :style="{ color: card.color }">{{ stat.value }}</span>
                <span class="stat-label">{{ stat.label }}</span>
              </div>
            </div>
          </div>
          <div class="card-particles">
            <span v-for="i in 8" :key="i" class="solar-particle" :style="{ '--p-i': i }"></span>
          </div>
        </div>
      </div>

      <!-- 底部信息 -->
      <footer ref="footerRef" class="solar-footer">
        <span>CardSolarFlare</span>
      </footer>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void

interface Stat {
  value: string
  label: string
}

interface SolarCard {
  id: string
  title: string
  icon: string
  desc: string
  color: string
  energy: number
  stats: Stat[]
}

const sectionRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const badgeRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const cardsContainerRef = ref<HTMLElement | null>(null)
const sunCoreRef = ref<HTMLElement | null>(null)
const flareContainerRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)

const cardRefs = ref<Map<number, HTMLElement>>(new Map())
const cleanupFns: TweenCleanup[] = []

const cards: SolarCard[] = [
  {
    id: 'solar-1',
    title: 'Corona Mass',
    icon: '🌞',
    desc: 'Massive plasma eruption from stellar surface',
    color: '#ff6b35',
    energy: 92,
    stats: [{ value: '10⁷ K', label: 'TEMP' }, { value: '10³ km', label: 'HEIGHT' }]
  },
  {
    id: 'solar-2',
    title: 'Plasma Jets',
    icon: '⚡',
    desc: 'High-energy particle streams冲向太空',
    color: '#ffd93d',
    energy: 87,
    stats: [{ value: '2000 km/s', label: 'SPEED' }, { value: '∞', label: 'POWER' }]
  },
  {
    id: 'solar-3',
    title: 'Radiation Burst',
    icon: '☄️',
    desc: 'Electromagnetic radiation explosion',
    color: '#ff8c42',
    energy: 95,
    stats: [{ value: 'X-class', label: 'LEVEL' }, { value: '10²⁰ J', label: 'ENERGY' }]
  }
]

const setCardRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  const element = el instanceof Element ? el : (el as any)?.$el
  if (element) {
    cardRefs.value.set(index, element as HTMLElement)
  } else {
    cardRefs.value.delete(index)
  }
}

const createSolarFlares = () => {
  if (!flareContainerRef.value) return

  for (let i = 0; i < 20; i++) {
    const flare = document.createElement('div')
    flare.className = 'solar-flare'
    const angle = Math.random() * 360
    const distance = 100 + Math.random() * 200
    flare.style.cssText = `
      position: absolute;
      width: ${2 + Math.random() * 4}px;
      height: ${2 + Math.random() * 4}px;
      background: radial-gradient(circle, rgba(255, 215, 0, 0.9), transparent);
      border-radius: 50%;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%) rotate(${angle}deg) translateY(-${distance}px);
      box-shadow: 0 0 ${5 + Math.random() * 10}px rgba(255, 165, 0, 0.8);
    `
    flareContainerRef.value.appendChild(flare)

    const tl = gsap.timeline({ repeat: -1 })
    tl.fromTo(flare,
      { opacity: 0, scale: 0 },
      { opacity: 1, scale: 1, duration: 1 + Math.random() * 2, ease: 'power2.out' }
    ).to(flare,
      { opacity: 0, scale: 2, duration: 1 + Math.random() * 2, ease: 'power2.in' },
      '+=0.5'
    )
    cleanupFns.push(() => tl.kill())
  }
}

const initAnimations = () => {
  if (!sectionRef.value) return

  // ========== 初始化状态 ==========
  // 先设置初始状态（内容可见）
  gsap.set(badgeRef.value, { scale: 1, rotation: 0, opacity: 1 })
  gsap.set(titleRef.value, { y: 0, opacity: 1, filter: 'blur(0px)' })
  gsap.set(subtitleRef.value, { y: 0, opacity: 1, letterSpacing: '6px' })
  cardRefs.value.forEach((card) => {
    gsap.set(card, { opacity: 1, y: 0, scale: 1 })
  })
  gsap.set(footerRef.value, { y: 0, opacity: 1 })

  // ========== 组件进入视口时的入场动画 ==========
  // 使用 ScrollTrigger 检测组件进入视口，然后执行隐藏再动画出现的效果
  const entryTrigger = ScrollTrigger.create({
    trigger: sectionRef.value,
    start: 'top 80%',
    onEnter: () => {
      // 先快速隐藏所有内容
      gsap.set(badgeRef.value, { scale: 0, rotation: -180, opacity: 0 })
      gsap.set(titleRef.value, { y: 50, opacity: 0, filter: 'blur(10px)' })
      gsap.set(subtitleRef.value, { y: 30, opacity: 0, letterSpacing: '20px' })
      cardRefs.value.forEach((card) => {
        gsap.set(card, { opacity: 0, y: 80, scale: 0.8 })
      })
      gsap.set(footerRef.value, { y: 30, opacity: 0 })

      // 然后依次动画出现
      const tl = gsap.timeline()

      tl.to(badgeRef.value,
        { scale: 1, rotation: 0, opacity: 1, duration: 1, ease: 'back.out(1.7)' }
      )
      .to(titleRef.value,
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' },
        '-=0.5'
      )
      .to(subtitleRef.value,
        { y: 0, opacity: 1, letterSpacing: '6px', duration: 0.6, ease: 'power2.out' },
        '-=0.4'
      )

      // 卡片依次淡入上浮
      cardRefs.value.forEach((card, index) => {
        tl.to(card,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: 'back.out(1.4)'
          },
          `-=${0.5 - index * 0.1}`
        )
      })

      tl.to(footerRef.value,
        { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
        '-=0.2'
      )

      cleanupFns.push(() => tl.kill())
    },
    once: true // 只执行一次
  })
  cleanupFns.push(() => entryTrigger.kill())

  createSolarFlares()

  // 太阳核心脉冲动画
  if (sunCoreRef.value) {
    gsap.to(sunCoreRef.value, {
      scale: 1.1,
      filter: 'brightness(1.3)',
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
  }

  // ========== 滚动动画 ==========
  // 卡片滚动效果 - 旋转 + 发光增强
  cardRefs.value.forEach((card, index) => {
    const trigger = ScrollTrigger.create({
      trigger: card,
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1.5,
      onUpdate: (self) => {
        const p = self.progress
        const rotate = Math.sin(p * Math.PI * 2) * 8
        const glowIntensity = 0.5 + p * 0.5

        gsap.to(card, {
          rotateY: rotate,
          boxShadow: `0 20px 60px rgba(255, 150, 50, ${glowIntensity})`,
          duration: 0.1
        })
      }
    })
    cleanupFns.push(() => trigger.kill())
  })

  // 标题滚动消失
  const headerTrigger = ScrollTrigger.create({
    trigger: headerRef.value,
    start: 'top top',
    end: '30% top',
    scrub: 1.5,
    onUpdate: (self) => {
      const p = self.progress
      gsap.to(headerRef.value, {
        y: -100 * p,
        opacity: 1 - p * 2,
        scale: 1 - p * 0.3,
        filter: `blur(${p * 10}px)`,
        duration: 0.1
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
      gsap.to(footerRef.value, {
        y: 60 * p,
        opacity: 1 - p * 2,
        duration: 0.1
      })
    }
  })
  cleanupFns.push(() => footerTrigger.kill())
}

onMounted(() => {
  setTimeout(initAnimations, 100)
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
})
</script>

<style scoped lang="scss">
.solar-flare-section {
  width: 100vw;
  height: 100vh;
  position: relative;
  background: radial-gradient(ellipse at 50% 30%, #1a0a00 0%, #0a0505 50%, #000000 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

// 太阳核心
.sun-core {
  position: absolute;
  top: 15%;
  left: 50%;
  transform: translateX(-50%);
  width: 300px;
  height: 300px;
  pointer-events: none;
}

.sun-pulse {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle, #fff 0%, #ffd93d 30%, #ff6b35 60%, transparent 70%);
  border-radius: 50%;
  animation: sunPulse 3s ease-in-out infinite;
}

.sun-glow {
  position: absolute;
  inset: -50%;
  background: radial-gradient(circle, rgba(255, 150, 50, 0.3) 0%, transparent 60%);
  animation: glowPulse 4s ease-in-out infinite;
}

.sun-corona {
  position: absolute;
  inset: -100%;
  background: radial-gradient(
    circle,
    rgba(255, 200, 100, 0.1) 0%,
    rgba(255, 150, 50, 0.05) 30%,
    transparent 50%
  );
  animation: coronaSpin 20s linear infinite;
}

@keyframes sunPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

@keyframes glowPulse {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

@keyframes coronaSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

// 耀斑容器
.flare-container {
  position: absolute;
  top: 15%;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  pointer-events: none;
  z-index: 1;
}

// 能量波
.energy-waves {
  position: absolute;
  top: 15%;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none;
}

.energy-ring {
  position: absolute;
  width: calc(300px + var(--ring-i) * 150px);
  height: calc(300px + var(--ring-i) * 150px);
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid rgba(255, 150, 50, calc(0.3 - var(--ring-i) * 0.05));
  border-radius: 50%;
  animation: ringExpand calc(3s + var(--ring-i) * 0.5s) ease-out infinite;
  animation-delay: calc(var(--ring-i) * 0.3s);
}

@keyframes ringExpand {
  0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0.8; }
  100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
}

// 主容器
.solar-container {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 40px;
}

// 标题
.solar-header {
  text-align: center;
  margin-bottom: 60px;
}

.header-badge {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: linear-gradient(135deg, #ffd93d, #ff6b35, #ff4500);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  box-shadow:
    0 0 60px rgba(255, 150, 50, 0.8),
    0 0 120px rgba(255, 100, 50, 0.4),
    inset 0 0 30px rgba(255, 255, 255, 0.3);

  svg {
    width: 50px;
    height: 50px;
    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.8));
  }
}

.solar-title {
  font-size: clamp(48px, 8vw, 80px);
  font-weight: 900;
  background: linear-gradient(90deg, #ffd93d, #ff8c42, #ff6b35, #ffd93d);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 12px;
  text-shadow: 0 0 40px rgba(255, 150, 50, 0.5);
  animation: titleShine 4s linear infinite;
}

@keyframes titleShine {
  to { background-position: 200% center; }
}

.solar-subtitle {
  font-size: 14px;
  color: rgba(255, 200, 150, 0.6);
  letter-spacing: 6px;
  margin: 0;
}

// 卡片容器
.cards-container {
  display: flex;
  gap: 35px;
  perspective: 1200px;
}

// 卡片
.solar-card {
  position: relative;
  width: 260px;
  height: 360px;
  background: linear-gradient(
    180deg,
    rgba(255, 100, 50, 0.15) 0%,
    rgba(30, 15, 10, 0.9) 100%
  );
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 150, 50, 0.2);
  border-radius: 24px;
  overflow: hidden;
  cursor: pointer;
  transform-style: preserve-3d;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-15px) rotateY(5deg);
    box-shadow: 0 30px 60px rgba(255, 100, 50, 0.4);
  }
}

.card-flare-effect {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at 50% 0%,
    rgba(255, 200, 100, 0.3) 0%,
    transparent 60%
  );
  pointer-events: none;
}

.card-heat-wave {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60%;
  background: linear-gradient(
    to top,
    rgba(255, 100, 50, 0.1) 0%,
    transparent 100%
  );
  pointer-events: none;
  animation: heatWave 3s ease-in-out infinite;
}

@keyframes heatWave {
  0%, 100% { opacity: 0.5; transform: scaleY(1); }
  50% { opacity: 0.8; transform: scaleY(1.1); }
}

.card-corona-ring {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 120px;
  border: 2px solid rgba(255, 200, 100, 0.2);
  border-radius: 50%;
  pointer-events: none;
  animation: coronaRing 4s ease-in-out infinite;
}

@keyframes coronaRing {
  0%, 100% { transform: translateX(-50%) scale(1); opacity: 0.3; }
  50% { transform: translateX(-50%) scale(1.2); opacity: 0.6; }
}

.card-content {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 28px 24px;
}

.card-icon-wrapper {
  position: relative;
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
}

.card-energy-core {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--card-color), rgba(255, 200, 100, 0.8));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 30px var(--card-color);
}

.card-icon {
  font-size: 36px;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.8));
}

.energy-ripple {
  position: absolute;
  inset: -15px;
  border: 2px solid var(--card-color);
  border-radius: 50%;
  opacity: 0;
  animation: ripple 2s ease-out infinite;

  &:nth-child(2) { animation-delay: 0.5s; }
  &:nth-child(3) { animation-delay: 1s; }
}

@keyframes ripple {
  0% { transform: scale(0.8); opacity: 0.8; }
  100% { transform: scale(1.5); opacity: 0; }
}

.card-title {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 8px;
  text-align: center;
}

.card-desc {
  font-size: 12px;
  color: rgba(255, 200, 150, 0.7);
  margin: 0 0 16px;
  text-align: center;
  line-height: 1.5;
}

.card-energy-bar {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 16px;
}

.energy-fill {
  height: 100%;
  width: var(--fill-width);
  background: linear-gradient(90deg, var(--bar-color), rgba(255, 255, 255, 0.8));
  border-radius: 3px;
  box-shadow: 0 0 10px var(--bar-color);
}

.card-stats {
  display: flex;
  gap: 20px;
  margin-top: auto;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-value {
  font-size: 16px;
  font-weight: 800;
  text-shadow: 0 0 10px currentColor;
}

.stat-label {
  font-size: 10px;
  color: rgba(255, 200, 150, 0.5);
  letter-spacing: 1px;
}

.card-particles {
  position: absolute;
  top: 30%;
  left: 50%;
  width: 0;
  height: 0;
  pointer-events: none;
}

.solar-particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: var(--card-color);
  border-radius: 50%;
  box-shadow: 0 0 8px var(--card-color);
  animation: particleFloat 3s ease-in-out infinite;
  animation-delay: calc(var(--p-i) * 0.3s);
}

@keyframes particleFloat {
  0%, 100% {
    transform: translate(
      calc(cos(calc(var(--p-i) * 45deg)) * 60px),
      calc(sin(calc(var(--p-i) * 45deg)) * 60px)
    );
    opacity: 0.3;
  }
  50% {
    transform: translate(
      calc(cos(calc(var(--p-i) * 45deg + 180deg)) * 80px),
      calc(sin(calc(var(--p-i) * 45deg + 180deg)) * 80px)
    );
    opacity: 1;
  }
}

// 底部
.solar-footer {
  position: absolute;
  bottom: 30px;
  font-size: 12px;
  color: rgba(255, 150, 50, 0.3);
  letter-spacing: 3px;
}
</style>
