<template>
  <section ref="sectionRef" class="temporal-section">
    <!-- 时空裂缝背景 -->
    <div ref="voidBgRef" class="void-background">
      <div class="time-rifts">
        <div class="rift" v-for="i in 8" :key="i" :style="{ '--rift-i': i }"></div>
      </div>
      <div class="chrono-ring"></div>
    </div>

    <!-- 时间粒子 -->
    <div ref="particleContainerRef" class="particle-container"></div>

    <!-- 主容器 -->
    <div class="temporal-container">
      <!-- 标题 -->
      <div ref="headerRef" class="temporal-header">
        <div ref="badgeRef" class="header-badge">
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <polyline points="12,6 12,12 16,14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M2 12h4M18 12h4M12 2v4M12 18v4" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
          </svg>
        </div>
        <h1 ref="titleRef" class="temporal-title">TEMPORAL</h1>
        <p ref="subtitleRef" class="temporal-subtitle">TIME RIFT ANOMALY</p>
      </div>

      <!-- 卡片组 -->
      <div ref="cardsContainerRef" class="cards-container">
        <div
          v-for="(card, index) in cards"
          :key="card.id"
          class="temporal-card"
          :ref="el => setCardRef(el, index)"
          :style="{ '--card-color': card.color, '--index': index }"
        >
          <div class="card-time-distortion"></div>
          <div class="card-rift-lines">
            <div class="rift-line" v-for="i in 3" :key="i"></div>
          </div>
          <div class="card-content">
            <div ref="el => setIconRef(el, index)" class="card-icon-wrapper">
              <div class="card-time-ring">
                <span class="card-icon">{{ card.icon }}</span>
              </div>
              <div class="time-hand hour-hand"></div>
              <div class="time-hand minute-hand"></div>
            </div>
            <h3 class="card-title">{{ card.title }}</h3>
            <p class="card-desc">{{ card.desc }}</p>
            <div class="card-time-bar">
              <div class="time-progress" :style="{ '--progress': card.time + '%', '--bar-color': card.color }"></div>
              <span class="time-label">{{ card.timeLabel }}</span>
            </div>
            <div class="card-metrics">
              <div class="metric" v-for="metric in card.metrics" :key="metric.label">
                <span class="metric-value" :style="{ color: card.color }">{{ metric.value }}</span>
                <span class="metric-label">{{ metric.label }}</span>
              </div>
            </div>
          </div>
          <div class="card-particles">
            <span v-for="i in 6" :key="i" class="time-particle" :style="{ '--p-i': i }"></span>
          </div>
        </div>
      </div>

      <!-- 底部 -->
      <footer ref="footerRef" class="temporal-footer">
        <span>CardTemporal</span>
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

interface Metric {
  value: string
  label: string
}

interface TemporalCard {
  id: string
  title: string
  icon: string
  desc: string
  color: string
  time: number
  timeLabel: string
  metrics: Metric[]
}

const sectionRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const badgeRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const cardsContainerRef = ref<HTMLElement | null>(null)
const voidBgRef = ref<HTMLElement | null>(null)
const particleContainerRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)

const cardRefs = ref<Map<number, HTMLElement>>(new Map())
const iconRefs = ref<Map<number, HTMLElement>>(new Map())
const cleanupFns: TweenCleanup[] = []

const cards: TemporalCard[] = [
  {
    id: 'temporal-1',
    title: 'Chrono Shift',
    icon: '⏳',
    desc: 'Time dilation effect in action',
    color: '#00d4ff',
    time: 73,
    timeLabel: 'DILATION',
    metrics: [{ value: '7.2y', label: 'FUTURE' }, { value: '∞', label: 'LOOPS' }]
  },
  {
    id: 'temporal-2',
    title: 'Time Fracture',
    icon: '💫',
    desc: 'Breaking the fabric of spacetime',
    color: '#a855f7',
    time: 88,
    timeLabel: 'FRACTURE',
    metrics: [{ value: '0.01s', label: 'DELTA' }, { value: '4D', label: 'SPACE' }]
  },
  {
    id: 'temporal-3',
    title: 'Paradox Gate',
    icon: '🌀',
    desc: 'Entering the time loop',
    color: '#22d3ee',
    time: 95,
    timeLabel: 'PARADOX',
    metrics: [{ value: 'C', label: 'SPEED' }, { value: 'T', label: 'TIME' }]
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

const setIconRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  const element = el instanceof Element ? el : (el as any)?.$el
  if (element) {
    iconRefs.value.set(index, element as HTMLElement)
  } else {
    iconRefs.value.delete(index)
  }
}

const createTimeParticles = () => {
  if (!particleContainerRef.value) return

  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div')
    particle.className = 'time-particle-bg'
    const hue = 180 + Math.random() * 60
    particle.style.cssText = `
      position: absolute;
      width: ${2 + Math.random() * 3}px;
      height: ${2 + Math.random() * 3}px;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      background: hsla(${hue}, 80%, 60%, 0.8);
      border-radius: 50%;
      box-shadow: 0 0 ${3 + Math.random() * 6}px hsla(${hue}, 80%, 60%, 0.6);
    `
    particleContainerRef.value.appendChild(particle)

    const tl = gsap.timeline({ repeat: -1 })
    tl.fromTo(particle,
      { opacity: 0, scale: 0, y: 0 },
      { opacity: 1, scale: 1, y: -30 - Math.random() * 50, duration: 2 + Math.random() * 2, ease: 'power2.out' }
    ).to(particle,
      { opacity: 0, scale: 0, y: -80 - Math.random() * 50, duration: 1 + Math.random(), ease: 'power2.in' },
      '+=0.5'
    )
    cleanupFns.push(() => tl.kill())
  }
}

const initAnimations = () => {
  if (!sectionRef.value) return

  createTimeParticles()

  // 背景裂缝动画
  if (voidBgRef.value) {
    const rifts = voidBgRef.value.querySelectorAll('.rift')
    rifts.forEach((rift, i) => {
      gsap.to(rift, {
        scaleY: 1.3,
        opacity: 0.6,
        duration: 3 + i * 0.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })
    })

    // 时间环旋转
    gsap.to('.chrono-ring', {
      rotation: 360,
      duration: 30,
      repeat: -1,
      ease: 'none'
    })
  }

  // ========== 入场动画 ==========
  const tl = gsap.timeline({ delay: 0.3 })

  // 标题 - 缩放 + 旋转 + 弹性
  tl.fromTo(badgeRef.value,
    { scale: 0, rotation: -360, opacity: 0 },
    { scale: 1, rotation: 0, opacity: 1, duration: 1, ease: 'elastic.out(1, 0.5)' }
  )
  .fromTo(titleRef.value,
    { scale: 0.5, rotation: 15, opacity: 0, filter: 'blur(15px)' },
    { scale: 1, rotation: 0, opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: 'back.out(1.7)' },
    '-=0.6'
  )
  .fromTo(subtitleRef.value,
    { y: 30, opacity: 0, letterSpacing: '30px' },
    { y: 0, opacity: 1, letterSpacing: '8px', duration: 0.6, ease: 'power2.out' },
    '-=0.4'
  )

  // 卡片入场 - 缩放 + 旋转 + 弹性登场
  cardRefs.value.forEach((card, index) => {
    const rotation = index === 0 ? -15 : index === 2 ? 15 : 0
    gsap.set(card, {
      opacity: 0,
      scale: 0.6,
      y: 80,
      rotation: rotation,
      filter: 'blur(10px)'
    })

    tl.to(card,
      {
        opacity: 1,
        scale: 1,
        y: 0,
        rotation: 0,
        filter: 'blur(0px)',
        duration: 0.8,
        ease: 'elastic.out(1, 0.6)'
      },
      `-=${0.6 - index * 0.1}`
    )
  })

  // 底部入场
  tl.fromTo(footerRef.value,
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
    '-=0.2'
  )

  cleanupFns.push(() => tl.kill())

  // ========== 滚动动画 ==========
  // 卡片滚动 - 缩放 + 扭曲
  cardRefs.value.forEach((card, index) => {
    const trigger = ScrollTrigger.create({
      trigger: card,
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1.5,
      onUpdate: (self) => {
        const p = self.progress
        const rotate = Math.sin(p * Math.PI) * 10 * (index === 0 ? -1 : index === 2 ? 1 : 0)
        const skew = Math.sin(p * Math.PI * 2) * 5

        gsap.to(card, {
          scale: 1 - p * 0.15,
          rotateY: rotate,
          skewX: skew,
          filter: `blur(${p * 3}px)`,
          duration: 0.1
        })
      }
    })
    cleanupFns.push(() => trigger.kill())
  })

  // 时钟指针动画
  iconRefs.value.forEach((iconWrapper, index) => {
    const hourHand = iconWrapper.querySelector('.hour-hand') as HTMLElement
    const minuteHand = iconWrapper.querySelector('.minute-hand') as HTMLElement

    if (hourHand && minuteHand) {
      gsap.to(hourHand, {
        rotation: 360,
        duration: 60,
        repeat: -1,
        ease: 'none'
      })
      gsap.to(minuteHand, {
        rotation: -360,
        duration: 10,
        repeat: -1,
        ease: 'none'
      })
    }
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
        rotation: p * 10,
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
.temporal-section {
  width: 100vw;
  height: 100vh;
  position: relative;
  background: linear-gradient(180deg, #0a0a1a 0%, #0f1a2e 50%, #0a0a1a 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

// 时空裂缝背景
.void-background {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.time-rifts {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 600px;
}

.rift {
  position: absolute;
  top: 50%;
  left: 50%;
  width: calc(200px + var(--rift-i) * 50px);
  height: calc(200px + var(--rift-i) * 50px);
  transform: translate(-50%, -50%) rotate(calc(var(--rift-i) * 45deg));
  border: 1px solid rgba(0, 212, 255, calc(0.2 - var(--rift-i) * 0.02));
  border-radius: 50%;
  opacity: 0.3;
}

.chrono-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  height: 800px;
  border: 2px dashed rgba(168, 85, 247, 0.1);
  border-radius: 50%;
}

// 粒子容器
.particle-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

// 主容器
.temporal-container {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 40px;
}

// 标题
.temporal-header {
  text-align: center;
  margin-bottom: 60px;
}

.header-badge {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: linear-gradient(135deg, #0891b2, #0e7490, #a855f7);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  box-shadow:
    0 0 60px rgba(0, 212, 255, 0.6),
    0 0 120px rgba(168, 85, 247, 0.3),
    inset 0 0 30px rgba(255, 255, 255, 0.2);

  svg {
    width: 50px;
    height: 50px;
    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.8));
  }
}

.temporal-title {
  font-size: clamp(48px, 8vw, 80px);
  font-weight: 900;
  background: linear-gradient(90deg, #00d4ff, #a855f7, #22d3ee, #00d4ff);
  background-size: 300% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 12px;
  text-shadow: 0 0 40px rgba(0, 212, 255, 0.5);
  animation: titleGlow 6s linear infinite;
}

@keyframes titleGlow {
  0% { background-position: 0% center; }
  100% { background-position: 300% center; }
}

.temporal-subtitle {
  font-size: 14px;
  color: rgba(0, 212, 255, 0.6);
  letter-spacing: 8px;
  margin: 0;
}

// 卡片容器
.cards-container {
  display: flex;
  gap: 35px;
  perspective: 1200px;
}

// 卡片
.temporal-card {
  position: relative;
  width: 260px;
  height: 380px;
  background: linear-gradient(
    180deg,
    rgba(0, 212, 255, 0.08) 0%,
    rgba(10, 10, 26, 0.95) 100%
  );
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 212, 255, 0.15);
  border-radius: 24px;
  overflow: hidden;
  cursor: pointer;
  transform-style: preserve-3d;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-15px) rotateY(5deg);
    box-shadow: 0 30px 60px rgba(0, 212, 255, 0.2);
  }
}

.card-time-distortion {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at 50% 0%,
    rgba(168, 85, 247, 0.2) 0%,
    transparent 50%
  );
  pointer-events: none;
}

.card-rift-lines {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}

.rift-line {
  position: absolute;
  width: 1px;
  height: 100%;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    var(--card-color) 50%,
    transparent 100%
  );
  opacity: 0.2;
  animation: riftPulse 3s ease-in-out infinite;

  &:nth-child(1) { left: 20%; animation-delay: 0s; }
  &:nth-child(2) { left: 50%; animation-delay: 1s; }
  &:nth-child(3) { left: 80%; animation-delay: 2s; }
}

@keyframes riftPulse {
  0%, 100% { opacity: 0.1; transform: scaleY(0.8); }
  50% { opacity: 0.4; transform: scaleY(1); }
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

.card-time-ring {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--card-color), rgba(168, 85, 247, 0.6));
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

.time-hand {
  position: absolute;
  bottom: 50%;
  left: 50%;
  transform-origin: bottom center;
  background: #fff;
  border-radius: 2px;

  &.hour-hand {
    width: 3px;
    height: 20px;
    transform: translateX(-50%) rotate(0deg);
  }

  &.minute-hand {
    width: 2px;
    height: 28px;
    transform: translateX(-50%) rotate(180deg);
  }
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
  color: rgba(0, 212, 255, 0.7);
  margin: 0 0 16px;
  text-align: center;
  line-height: 1.5;
}

.card-time-bar {
  width: 100%;
  margin-bottom: 16px;
}

.time-progress {
  height: 6px;
  width: var(--progress);
  background: linear-gradient(90deg, var(--bar-color), rgba(255, 255, 255, 0.8));
  border-radius: 3px;
  box-shadow: 0 0 10px var(--bar-color);
  margin-bottom: 6px;
}

.time-label {
  font-size: 10px;
  color: rgba(0, 212, 255, 0.5);
  letter-spacing: 2px;
}

.card-metrics {
  display: flex;
  gap: 24px;
  margin-top: auto;
}

.metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.metric-value {
  font-size: 18px;
  font-weight: 800;
  text-shadow: 0 0 10px currentColor;
}

.metric-label {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 1px;
}

.card-particles {
  position: absolute;
  top: 40%;
  left: 50%;
  width: 0;
  height: 0;
  pointer-events: none;
}

.time-particle {
  position: absolute;
  width: 3px;
  height: 3px;
  background: var(--card-color);
  border-radius: 50%;
  box-shadow: 0 0 6px var(--card-color);
  animation: timeFloat 4s ease-in-out infinite;
  animation-delay: calc(var(--p-i) * 0.5s);
}

@keyframes timeFloat {
  0%, 100% {
    transform: translate(
      calc(cos(calc(var(--p-i) * 60deg)) * 50px),
      0
    );
    opacity: 0.3;
  }
  50% {
    transform: translate(
      calc(cos(calc(var(--p-i) * 60deg + 180deg)) * 70px),
      -30px
    );
    opacity: 1;
  }
}

// 底部
.temporal-footer {
  position: absolute;
  bottom: 30px;
  font-size: 12px;
  color: rgba(0, 212, 255, 0.3);
  letter-spacing: 3px;
}
</style>
