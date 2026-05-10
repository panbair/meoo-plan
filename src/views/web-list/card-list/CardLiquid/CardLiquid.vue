<template>
  <section ref="sectionRef" class="liquid-section">
    <!-- 液态背景 -->
    <div class="liquid-bg">
      <svg class="liquid-svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <defs>
          <linearGradient id="liquidGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#06b6d4;stop-opacity:0.3" />
            <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:0.3" />
          </linearGradient>
          <linearGradient id="liquidGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#ec4899;stop-opacity:0.3" />
            <stop offset="100%" style="stop-color:#f59e0b;stop-opacity:0.3" />
          </linearGradient>
        </defs>
        <path ref="wave1Ref" class="wave-path wave-1" fill="url(#liquidGrad1)">
          <animate
            attributeName="d"
            dur="10s"
            repeatCount="indefinite"
            values="
              M0,160 C360,260 720,60 1080,160 C1260,210 1350,180 1440,160 L1440,320 L0,320 Z;
              M0,200 C360,100 720,300 1080,200 C1260,150 1350,180 1440,200 L1440,320 L0,320 Z;
              M0,160 C360,260 720,60 1080,160 C1260,210 1350,180 1440,160 L1440,320 L0,320 Z
            "
          />
        </path>
        <path ref="wave2Ref" class="wave-path wave-2" fill="url(#liquidGrad2)">
          <animate
            attributeName="d"
            dur="8s"
            repeatCount="indefinite"
            values="
              M0,200 C240,120 480,280 720,200 C960,120 1200,280 1440,200 L1440,320 L0,320 Z;
              M0,140 C240,220 480,80 720,140 C960,220 1200,80 1440,140 L1440,320 L0,320 Z;
              M0,200 C240,120 480,280 720,200 C960,120 1200,280 1440,200 L1440,320 L0,320 Z
            "
          />
        </path>
      </svg>
    </div>

    <!-- 主容器 -->
    <div class="liquid-container">
      <!-- 标题 -->
      <div ref="titleRef" class="liquid-title-wrapper">
        <h1 class="liquid-title">
          <span class="title-char" v-for="(char, i) in titleText" :key="i" :style="{ '--i': i }">
            {{ char }}
          </span>
        </h1>
        <p class="liquid-subtitle">FLUID MOTION DESIGN</p>
      </div>

      <!-- 液态卡片 -->
      <div ref="cardsRef" class="liquid-cards">
        <div
          v-for="(card, index) in cards"
          :key="card.id"
          class="liquid-card"
          :ref="el => setCardRef(index, el as HTMLElement)"
          :style="{ '--card-color': card.color, '--index': index }"
        >
          <div class="card-liquid-surface">
            <div class="liquid-blob"></div>
          </div>
          <div class="card-content">
            <div class="card-icon-wrapper">
              <span class="card-icon">{{ card.icon }}</span>
            </div>
            <h3>{{ card.title }}</h3>
            <p>{{ card.description }}</p>
          </div>
          <div class="card-ripple" ref="el => setRippleRef(index, el as HTMLElement)"></div>
        </div>
      </div>

      <!-- 滚动提示 -->
      <div class="liquid-hint">
        <div ref="hintRef" class="hint-arrow">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <span class="hint-text">SCROLL FOR FLOW</span>
      </div>
    </div>

    <!-- 浮动液滴 -->
    <div class="liquid-drops">
      <div class="drop" v-for="i in 15" :key="i" :style="{ '--drop-index': i }"></div>
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
}

const sectionRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const cardsRef = ref<HTMLElement | null>(null)
const hintRef = ref<HTMLElement | null>(null)
const wave1Ref = ref<SVGPathElement | null>(null)
const wave2Ref = ref<SVGPathElement | null>(null)
const cardRefs = ref<HTMLElement[]>([])

const titleText = 'LIQUID'

const cards: Card[] = [
  { id: 'liquid-1', title: 'FLOW', description: 'Smooth liquid transitions', icon: '🌊', color: '#06b6d4' },
  { id: 'liquid-2', title: 'WAVE', description: 'Dynamic wave motion', icon: '💧', color: '#8b5cf6' },
  { id: 'liquid-3', title: 'BLEND', description: 'Organic color blending', icon: '🎨', color: '#ec4899' },
  { id: 'liquid-4', title: 'DRIP', description: 'Gravity-driven drops', icon: '💦', color: '#f59e0b' }
]

const setCardRef = (index: number, el: HTMLElement | null) => {
  if (el) cardRefs.value[index] = el
}

let cleanupFns: (() => void)[] = []

const initAnimations = () => {
  if (!sectionRef.value) return

  // 标题入场动画
  if (titleRef.value) {
    const chars = titleRef.value.querySelectorAll('.title-char')
    gsap.fromTo(
      chars,
      { opacity: 0, y: 50, filter: 'blur(10px)' },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out'
      }
    )
  }

  // 卡片液态滚动动画
  cardRefs.value.forEach((card, index) => {
    // 初始状态
    gsap.set(card, {
      y: 100 + index * 50,
      opacity: 0,
      scale: 0.8
    })

    // 滚动入场
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 80%',
        end: 'top 30%',
        scrub: 1.5
      }
    })

    // 液态上浮
    tl.to(card, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 1
    })

    // 倾斜旋转
    tl.to(card, {
      rotateY: 15 * (index % 2 === 0 ? 1 : -1),
      rotateX: -10,
      duration: 1
    }, 0)

    // 液态波动效果
    const blob = card.querySelector('.liquid-blob')
    if (blob) {
      gsap.to(blob, {
        borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
        duration: 2 + index * 0.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })

      cleanupFns.push(() => gsap.killTweensOf(blob))
    }

    // 卡片表面光泽
    const surface = card.querySelector('.card-liquid-surface')
    if (surface) {
      gsap.to(surface, {
        backgroundPosition: '200% 200%',
        duration: 3,
        repeat: -1,
        ease: 'none'
      })

      cleanupFns.push(() => gsap.killTweensOf(surface))
    }
  })

  // 波浪增强动画
  if (wave1Ref.value) {
    gsap.to(wave1Ref.value, {
      y: -50,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })

    cleanupFns.push(() => gsap.killTweensOf(wave1Ref.value))
  }

  if (wave2Ref.value) {
    gsap.to(wave2Ref.value, {
      y: 30,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })

    cleanupFns.push(() => gsap.killTweensOf(wave2Ref.value))
  }

  // 提示箭头动画
  if (hintRef.value) {
    const arrows = hintRef.value.querySelectorAll('span')
    gsap.to(arrows, {
      y: 10,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      repeat: -1,
      ease: 'power2.in'
    })
  }

  // 液滴动画
  const drops = sectionRef.value?.querySelectorAll('.drop')
  if (drops) {
    drops.forEach((drop, i) => {
      gsap.to(drop, {
        y: -window.innerHeight,
        x: Math.sin(i) * 100,
        opacity: 0,
        duration: 5 + Math.random() * 5,
        repeat: -1,
        delay: i * 0.5,
        ease: 'none'
      })

      gsap.to(drop, {
        scale: 0.5,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })
    })

    cleanupFns.push(() => gsap.killTweensOf(drops))
  }

  // 背景颜色随滚动变化 - 渐变色方案
  gsap.to(sectionRef.value, {
    background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1
    }
  })
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
.liquid-section {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
  position: relative;
  overflow: hidden;
}

.liquid-bg {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  pointer-events: none;
}

.liquid-svg {
  width: 100%;
  height: 100%;
}

.wave-path {
  transition: d 0.3s ease;
}

.liquid-container {
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

.liquid-title-wrapper {
  text-align: center;
  margin-bottom: 60px;
  perspective: 500px;
}

.liquid-title {
  font-size: clamp(60px, 12vw, 140px);
  font-weight: 900;
  color: #fff;
  margin: 0;
  display: flex;
  justify-content: center;
}

.title-char {
  display: inline-block;
  background: linear-gradient(135deg, #06b6d4, #8b5cf6, #ec4899);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: none;
  filter: drop-shadow(0 0 30px rgba(6, 182, 212, 0.5));
  animation: char-float 3s ease-in-out infinite;
  animation-delay: calc(var(--i) * 0.1s);
}

@keyframes char-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.liquid-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 8px;
  margin-top: 20px;
}

.liquid-cards {
  display: flex;
  gap: 30px;
  perspective: 1000px;
}

.liquid-card {
  width: 200px;
  height: 260px;
  position: relative;
  transform-style: preserve-3d;
  cursor: pointer;
}

.card-liquid-surface {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    var(--card-color) 0%,
    rgba(255, 255, 255, 0.1) 50%,
    var(--card-color) 100%
  );
  background-size: 200% 200%;
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.liquid-blob {
  position: absolute;
  width: 150%;
  height: 150%;
  top: -25%;
  left: -25%;
  background: radial-gradient(
    circle at 30% 30%,
    rgba(255, 255, 255, 0.4) 0%,
    transparent 50%
  );
  border-radius: 50%;
}

.card-content {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  text-align: center;
}

.card-icon-wrapper {
  width: 70px;
  height: 70px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  backdrop-filter: blur(10px);
}

.card-icon {
  font-size: 32px;
}

.card-content h3 {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 8px;
  letter-spacing: 2px;
}

.card-content p {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  line-height: 1.6;
}

.card-ripple {
  position: absolute;
  inset: 0;
  border-radius: 24px;
  border: 2px solid transparent;
  pointer-events: none;
  transition: border-color 0.3s ease;
}

.liquid-card:hover .card-ripple {
  border-color: var(--card-color);
  animation: ripple-effect 1s ease-out;
}

@keyframes ripple-effect {
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1.1); opacity: 0; }
}

.liquid-hint {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.hint-arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;

  span {
    width: 20px;
    height: 3px;
    background: linear-gradient(90deg, transparent, #06b6d4);
    border-radius: 2px;
  }
}

.hint-text {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 4px;
}

.liquid-drops {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.drop {
  position: absolute;
  width: 8px;
  height: 8px;
  background: radial-gradient(circle, #06b6d4, transparent);
  border-radius: 50%;
  bottom: -20px;
  left: calc(var(--drop-index) * 7%);
  opacity: 0.6;
}
</style>
