<template>
  <section ref="sectionRef" class="gravity-section">
    <!-- 背景网格 -->
    <div class="gravity-grid">
      <div class="grid-line" v-for="i in 20" :key="i" :style="{ '--index': i }"></div>
    </div>

    <!-- 引力波纹 -->
    <div class="gravity-waves">
      <div class="wave wave-1"></div>
      <div class="wave wave-2"></div>
      <div class="wave wave-3"></div>
    </div>

    <!-- 主容器 -->
    <div class="gravity-container">
      <!-- 标题 -->
      <div ref="titleRef" class="gravity-title-wrapper">
        <h1 class="gravity-title">
          <span class="title-line" v-for="(line, i) in titleLines" :key="i">{{ line }}</span>
        </h1>
        <p class="gravity-subtitle">GRAVITATIONAL ATTRACTION</p>
      </div>

      <!-- 重力卡片 -->
      <div ref="cardsRef" class="gravity-cards">
        <div
            v-for="(card, index) in cards"
            :key="card.id"
            class="gravity-card"
            :ref="el => setCardRef(index, el as HTMLElement)"
            :style="{ '--card-color': card.color, '--index': index }"
        >
          <div class="card-orbit">
            <div class="orbit-dot"></div>
          </div>
          <div class="card-core">
            <div class="core-inner">
              <span class="card-icon">{{ card.icon }}</span>
            </div>
          </div>
          <div class="card-gravity-field"></div>
          <div class="card-info">
            <h3>{{ card.title }}</h3>
            <p>{{ card.description }}</p>
          </div>
          <div class="card-particles">
            <span v-for="i in 6" :key="i" class="particle"></span>
          </div>
        </div>
      </div>

      <!-- 引力指示器 -->
      <div class="gravity-indicator">
        <div ref="indicatorRef" class="indicator-line"></div>
        <span class="indicator-text">SCROLL TO ATTRACT</span>
      </div>
    </div>

    <!-- 中心引力点 -->
    <div ref="centerRef" class="gravity-center">
      <div class="center-core"></div>
      <div class="center-ring ring-1"></div>
      <div class="center-ring ring-2"></div>
      <div class="center-ring ring-3"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Card {
  id: string
  title: string
  description: string
  icon: string
  color: string
  distance: number
}

const sectionRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const cardsRef = ref<HTMLElement | null>(null)
const indicatorRef = ref<HTMLElement | null>(null)
const centerRef = ref<HTMLElement | null>(null)
const cardRefs = ref<HTMLElement[]>([])

const cards: Card[] = [
  { id: 'gravity-1', title: 'ATTract', description: 'Pull elements together', icon: '🌀', color: '#ff6b6b', distance: 300 },
  { id: 'gravity-2', title: 'PULSE', description: 'Rhythmic energy waves', icon: '💫', color: '#4ecdc4', distance: 350 },
  { id: 'gravity-3', title: 'BEND', description: 'Space-time curvature', icon: '🕳️', color: '#a855f7', distance: 300 },
  { id: 'gravity-4', title: 'MERGE', description: 'Combine into one', icon: '✨', color: '#f59e0b', distance: 350 }
]

const titleLines = ['GRAVITY', 'PULL']

const setCardRef = (index: number, el: HTMLElement | null) => {
  if (el) cardRefs.value[index] = el
}

let cleanupFns: (() => void)[] = []

const initAnimations = () => {
  if (!sectionRef.value) return

  // 标题入场动画
  if (titleRef.value) {
    const lines = titleRef.value.querySelectorAll('.title-line')
    gsap.fromTo(
        lines,
        { opacity: 0, y: 100, scale: 0.8 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          stagger: 0.2,
          ease: 'elastic.out(1, 0.5)'
        }
    )
  }

  // 卡片重力吸附动画
  cardRefs.value.forEach((card, index) => {
    const distance = cards[index].distance

    // 初始位置（分散在外围）
    gsap.set(card, {
      x: (index % 2 === 0 ? 1 : -1) * distance,
      y: (index < 2 ? 1 : -1) * distance * 0.5,
      scale: 0.5,
      opacity: 0.3
    })

    // 滚动时向中心聚集
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top top',
        end: 'center center',
        scrub: 1.5
      }
    })

    // 向中心移动
    tl.to(card, {
      x: (index % 2 === 0 ? 1 : -1) * 150,
      y: (index < 2 ? 1 : -1) * 80,
      scale: 1,
      opacity: 1,
      duration: 1
    })

    // 旋转
    tl.to(card, {
      rotate: 360 * (index % 2 === 0 ? 1 : -1),
      duration: 1
    }, 0)

    // 引力场增强
    const field = card.querySelector('.card-gravity-field')
    if (field) {
      tl.to(field, {
        scale: 2,
        opacity: 0.5,
        duration: 1
      }, 0)
    }

    // 轨道点动画
    const orbit = card.querySelector('.orbit-dot')
    if (orbit) {
      tl.to(orbit, {
        scale: 1.5,
        backgroundColor: cards[index].color,
        duration: 0.5
      }, 0.5)
    }
  })

  // 中心引力点动画
  if (centerRef.value) {
    const rings = centerRef.value.querySelectorAll('.center-ring')

    gsap.to(rings, {
      scale: 1.5,
      opacity: 0,
      duration: 2,
      stagger: 0.5,
      repeat: -1,
      ease: 'power2.out'
    })

    gsap.to(centerRef.value.querySelector('.center-core'), {
      scale: 1.2,
      boxShadow: '0 0 60px rgba(168, 85, 247, 0.8)',
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })

    cleanupFns.push(() => {
      gsap.killTweensOf(rings)
      gsap.killTweensOf(centerRef.value?.querySelector('.center-core'))
    })
  }

  // 指示器动画
  if (indicatorRef.value) {
    gsap.to(indicatorRef.value, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5
      }
    })
  }

  // 背景网格动画
  const gridLines = sectionRef.value?.querySelectorAll('.grid-line')
  if (gridLines) {
    gsap.to(gridLines, {
      opacity: 0.3,
      scaleY: 1.5,
      stagger: {
        each: 0.1,
        from: 'center'
      },
      duration: 1,
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    })
  }

  // 波纹动画
  const waves = sectionRef.value?.querySelectorAll('.wave')
  if (waves) {
    waves.forEach((wave, i) => {
      gsap.to(wave, {
        scale: 2,
        opacity: 0,
        duration: 3,
        repeat: -1,
        delay: i * 1,
        ease: 'none'
      })
    })
    cleanupFns.push(() => gsap.killTweensOf(waves))
  }
}

onMounted(() => {
  setTimeout(initAnimations, 100)
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
})
</script>

<style scoped lang="scss">
.gravity-section {
  width: 100vw;
  height: 100vh;
  background: radial-gradient(ellipse at center, #1a1a2e 0%, #0a0a0f 100%);
  position: relative;
  overflow: hidden;
}

.gravity-grid {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: space-evenly;
  pointer-events: none;
}

.grid-line {
  width: 1px;
  height: 100%;
  background: linear-gradient(
          to bottom,
          transparent 0%,
          rgba(168, 85, 247, 0.1) 50%,
          transparent 100%
  );
  transform-origin: top;
}

.gravity-waves {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.wave {
  position: absolute;
  width: 200px;
  height: 200px;
  border: 2px solid rgba(168, 85, 247, 0.3);
  border-radius: 50%;
}

.gravity-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  position: relative;
  z-index: 1;
}

.gravity-title-wrapper {
  text-align: center;
  margin-bottom: 60px;
}

.gravity-title {
  font-size: clamp(48px, 10vw, 100px);
  font-weight: 900;
  color: #fff;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
  line-height: 1;
  text-shadow:
      0 0 20px rgba(168, 85, 247, 0.8),
      0 0 40px rgba(168, 85, 247, 0.6);
}

.title-line {
  display: block;
}

.gravity-subtitle {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 6px;
  margin-top: 20px;
}

.gravity-cards {
  display: flex;
  gap: 60px;
  perspective: 1000px;
}

.gravity-card {
  width: 180px;
  height: 220px;
  position: relative;
  transform-style: preserve-3d;
}

.card-orbit {
  position: absolute;
  inset: -20px;
  border: 1px dashed rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  animation: orbit-rotate 10s linear infinite;
}

@keyframes orbit-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.orbit-dot {
  position: absolute;
  width: 12px;
  height: 12px;
  background: var(--card-color);
  border-radius: 50%;
  top: -6px;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 0 0 20px var(--card-color);
}

.card-core {
  width: 100%;
  height: 100%;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.core-inner {
  width: 80px;
  height: 80px;
  background: linear-gradient(145deg, var(--card-color), rgba(0, 0, 0, 0.3));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
      0 0 30px var(--card-color),
      inset 0 0 20px rgba(255, 255, 255, 0.2);
}

.card-icon {
  font-size: 32px;
}

.card-gravity-field {
  position: absolute;
  inset: -40px;
  background: radial-gradient(circle, var(--card-color)20 0%, transparent 70%);
  border-radius: 50%;
  opacity: 0.5;
  pointer-events: none;
}

.card-info {
  position: absolute;
  bottom: -80px;
  left: 0;
  right: 0;
  text-align: center;

  h3 {
    font-size: 18px;
    font-weight: 700;
    color: #fff;
    margin: 0;
    letter-spacing: 2px;
  }

  p {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
    margin: 8px 0 0;
  }
}

.card-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: var(--card-color);
  border-radius: 50%;
  animation: particle-float 3s ease-in-out infinite;

  &:nth-child(1) { top: 10%; left: 10%; animation-delay: 0s; }
  &:nth-child(2) { top: 20%; right: 15%; animation-delay: 0.5s; }
  &:nth-child(3) { bottom: 30%; left: 5%; animation-delay: 1s; }
  &:nth-child(4) { bottom: 10%; right: 10%; animation-delay: 1.5s; }
  &:nth-child(5) { top: 50%; left: 0; animation-delay: 2s; }
  &:nth-child(6) { top: 40%; right: 0; animation-delay: 2.5s; }
}

@keyframes particle-float {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 1; }
  50% { transform: translate(10px, -20px) scale(0.5); opacity: 0.5; }
}

.gravity-indicator {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.indicator-line {
  width: 100px;
  height: 3px;
  background: linear-gradient(90deg, transparent, #a855f7, transparent);
  transform-origin: left;
  transform: scaleX(0);
}

.indicator-text {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 4px;
}

.gravity-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
}

.center-core {
  position: absolute;
  inset: 15px;
  background: radial-gradient(circle, #a855f7, #6366f1);
  border-radius: 50%;
  box-shadow: 0 0 40px rgba(168, 85, 247, 0.6);
}

.center-ring {
  position: absolute;
  inset: 0;
  border: 2px solid rgba(168, 85, 247, 0.5);
  border-radius: 50%;
}

.ring-1 { animation: ring-pulse 2s ease-out infinite 0s; }
.ring-2 { animation: ring-pulse 2s ease-out infinite 0.6s; }
.ring-3 { animation: ring-pulse 2s ease-out infinite 1.2s; }

@keyframes ring-pulse {
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(3); opacity: 0; }
}
</style>
