<template>
  <section ref="sectionRef" class="glitch-section">
    <!-- 故障背景 -->
    <div class="glitch-bg">
      <div class="scan-line" v-for="i in 5" :key="i" :style="{ '--i': i }"></div>
    </div>

    <!-- RGB分离层 -->
    <div class="rgb-layers">
      <div ref="rgbRedRef" class="rgb-layer rgb-red"></div>
      <div ref="rgbGreenRef" class="rgb-layer rgb-green"></div>
      <div ref="rgbBlueRef" class="rgb-layer rgb-blue"></div>
    </div>

    <!-- 主容器 -->
    <div class="glitch-container">
      <!-- 标题 -->
      <div ref="titleRef" class="glitch-title-wrapper">
        <h1 ref="titleElementRef" class="glitch-title" data-text="GLITCH">
          <span class="title-word">GLITCH</span>
        </h1>
        <p class="glitch-subtitle">DIGITAL CORRUPTION</p>
      </div>

      <!-- 故障卡片 -->
      <div ref="cardsRef" class="glitch-cards">
        <div
          v-for="(card, index) in cards"
          :key="card.id"
          class="glitch-card"
          :ref="el => setCardRef(index, el as HTMLElement)"
          :style="{ '--card-color': card.color, '--index': index }"
        >
          <div class="card-scan"></div>
          <div class="card-noise"></div>
          <div class="card-content">
            <div class="card-icon-wrapper">
              <span class="card-icon">{{ card.icon }}</span>
              <span class="icon-ghost">{{ card.icon }}</span>
            </div>
            <h3 :data-text="card.title">{{ card.title }}</h3>
            <p>{{ card.description }}</p>
          </div>
          <div class="card-glitch-line" v-for="i in 3" :key="i"></div>
        </div>
      </div>

      <!-- 故障条 -->
      <div class="glitch-bars">
        <div class="bar" v-for="i in 8" :key="i" :style="{ '--bar-index': i }"></div>
      </div>

      <!-- 滚动提示 -->
      <div class="scroll-indicator">
        <div ref="scrollLineRef" class="scroll-line"></div>
        <span class="scroll-text">SCROLL TO CORRUPT</span>
      </div>
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
const titleElementRef = ref<HTMLElement | null>(null)
const cardsRef = ref<HTMLElement | null>(null)
const scrollLineRef = ref<HTMLElement | null>(null)
const rgbRedRef = ref<HTMLElement | null>(null)
const rgbGreenRef = ref<HTMLElement | null>(null)
const rgbBlueRef = ref<HTMLElement | null>(null)
const cardRefs = ref<HTMLElement[]>([])

const cards: Card[] = [
  { id: 'glitch-1', title: 'CORRUPT', description: 'Data corruption effect', icon: '💀', color: '#ff0055' },
  { id: 'glitch-2', title: 'SHIFT', description: 'RGB channel shift', icon: '📺', color: '#00ff88' },
  { id: 'glitch-3', title: 'FLICKER', description: 'Screen flicker noise', icon: '⚡', color: '#ffaa00' },
  { id: 'glitch-4', title: 'NOISE', description: 'Static interference', icon: '📡', color: '#aa00ff' }
]

const setCardRef = (index: number, el: HTMLElement | null) => {
  if (el) cardRefs.value[index] = el
}

let cleanupFns: (() => void)[] = []

const initAnimations = () => {
  if (!sectionRef.value) return

  // 标题入场动画
  if (titleRef.value) {
    gsap.fromTo(
      titleRef.value,
      { opacity: 0, y: 100, skewX: -10 },
      {
        opacity: 1,
        y: 0,
        skewX: 0,
        duration: 1,
        ease: 'power4.out'
      }
    )
  }

  // RGB分离动画
  const rgbLayers = [rgbRedRef.value, rgbGreenRef.value, rgbBlueRef.value]
  rgbLayers.forEach((layer, i) => {
    if (!layer) return
    gsap.to(layer, {
      x: (i % 2 === 0 ? 1 : -1) * (5 + Math.random() * 10),
      y: (i % 2 === 0 ? -1 : 1) * (3 + Math.random() * 5),
      duration: 0.1,
      repeat: -1,
      yoyo: true,
      ease: 'none'
    })
    cleanupFns.push(() => gsap.killTweensOf(layer))
  })

  // 标题故障动画
  if (titleElementRef.value) {
    const glitchTl = gsap.timeline({ repeat: -1, repeatDelay: 3 })

    glitchTl
      .to(titleElementRef.value, {
        x: -5,
        duration: 0.05,
        ease: 'none'
      })
      .to(titleElementRef.value, {
        x: 5,
        duration: 0.05,
        ease: 'none'
      })
      .to(titleElementRef.value, {
        x: -3,
        duration: 0.05,
        ease: 'none'
      })
      .to(titleElementRef.value, {
        x: 0,
        duration: 0.05,
        ease: 'none'
      })

    cleanupFns.push(() => glitchTl.kill())
  }

  // 卡片故障动画
  cardRefs.value.forEach((card, index) => {
    // 初始状态
    gsap.set(card, {
      opacity: 0,
      y: 100,
      skewX: Math.random() * 20 - 10
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

    // 故障飞入
    tl.to(card, {
      opacity: 1,
      y: 0,
      skewX: 0,
      duration: 1
    })

    // Y轴抖动
    tl.to(card, {
      y: -10,
      duration: 0.1,
      repeat: 5,
      yoyo: true,
      ease: 'none'
    }, 0.5)

    // 随机RGB分离
    const content = card.querySelector('.card-content')
    if (content) {
      const icon = content.querySelector('.card-icon')
      const ghost = content.querySelector('.icon-ghost')

      if (ghost) {
        gsap.to(ghost, {
          x: 3,
          opacity: 0.5,
          duration: 0.1,
          repeat: -1,
          yoyo: true,
          ease: 'none'
        })
        cleanupFns.push(() => gsap.killTweensOf(ghost))
      }
    }

    // 扫描线动画
    const scan = card.querySelector('.card-scan')
    if (scan) {
      gsap.fromTo(
        scan,
        { y: '-100%' },
        {
          y: '200%',
          duration: 2,
          repeat: -1,
          ease: 'none'
        }
      )
      cleanupFns.push(() => gsap.killTweensOf(scan))
    }

    // 故障线条动画
    const lines = card.querySelectorAll('.card-glitch-line')
    lines.forEach((line, i) => {
      gsap.to(line, {
        scaleX: 1,
        opacity: 0.8,
        duration: 0.5 + Math.random() * 0.5,
        repeat: -1,
        yoyo: true,
        delay: i * 0.3,
        ease: 'none'
      })
    })
  })

  // 滚动故障条动画
  const bars = sectionRef.value?.querySelectorAll('.bar')
  if (bars) {
    gsap.to(bars, {
      scaleX: 1,
      stagger: {
        each: 0.1,
        from: 'random'
      },
      duration: 0.3,
      repeat: -1,
      yoyo: true,
      ease: 'none'
    })

    cleanupFns.push(() => gsap.killTweensOf(bars))
  }

  // 滚动指示线
  if (scrollLineRef.value) {
    gsap.to(scrollLineRef.value, {
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
.glitch-section {
  width: 100vw;
  height: 100vh;
  background: #0a0a0f;
  position: relative;
  overflow: hidden;
}

.glitch-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.scan-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 100%
  );
  animation: scan-move 3s linear infinite;
  animation-delay: calc(var(--i) * 0.6s);
}

@keyframes scan-move {
  0% { top: calc(var(--i) * -20%); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { top: calc(100% + var(--i) * 20%); opacity: 0; }
}

.rgb-layers {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.rgb-layer {
  position: absolute;
  inset: 0;
  background: transparent;
}

.rgb-red {
  box-shadow: inset 0 0 100px rgba(255, 0, 85, 0.1);
}

.rgb-green {
  box-shadow: inset 0 0 100px rgba(0, 255, 136, 0.1);
}

.rgb-blue {
  box-shadow: inset 0 0 100px rgba(0, 170, 255, 0.1);
}

.glitch-container {
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

.glitch-title-wrapper {
  text-align: center;
  margin-bottom: 60px;
  position: relative;
}

.glitch-title {
  font-size: clamp(60px, 15vw, 160px);
  font-weight: 900;
  color: #fff;
  margin: 0;
  position: relative;
  text-shadow:
    0 0 20px rgba(255, 0, 85, 0.8),
    0 0 40px rgba(0, 255, 136, 0.6),
    0 0 60px rgba(0, 170, 255, 0.4);

  &::before,
  &::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  &::before {
    color: #ff0055;
    animation: glitch-1 0.3s infinite linear alternate-reverse;
    clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%);
  }

  &::after {
    color: #00ff88;
    animation: glitch-2 0.3s infinite linear alternate;
    clip-path: polygon(0 65%, 100% 65%, 100% 100%, 0 100%);
  }
}

@keyframes glitch-1 {
  0% { transform: translateX(0); }
  20% { transform: translateX(-3px); }
  40% { transform: translateX(3px); }
  60% { transform: translateX(-1px); }
  80% { transform: translateX(1px); }
  100% { transform: translateX(0); }
}

@keyframes glitch-2 {
  0% { transform: translateX(0); }
  20% { transform: translateX(3px); }
  40% { transform: translateX(-3px); }
  60% { transform: translateX(1px); }
  80% { transform: translateX(-1px); }
  100% { transform: translateX(0); }
}

.glitch-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 8px;
  margin-top: 20px;
}

.glitch-cards {
  display: flex;
  gap: 30px;
  perspective: 1000px;
}

.glitch-card {
  width: 200px;
  height: 260px;
  background: rgba(20, 20, 30, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  transform-style: preserve-3d;
}

.card-scan {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 100%
  );
  pointer-events: none;
  z-index: 10;
}

.card-noise {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  opacity: 0.05;
  pointer-events: none;
}

.card-content {
  position: relative;
  z-index: 5;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  text-align: center;
}

.card-icon-wrapper {
  position: relative;
  margin-bottom: 20px;
}

.card-icon {
  font-size: 48px;
  position: relative;
  z-index: 2;
}

.icon-ghost {
  position: absolute;
  top: 0;
  left: 0;
  font-size: 48px;
  color: #ff0055;
  opacity: 0;
  z-index: 1;
}

.card-content h3 {
  font-size: 20px;
  font-weight: 800;
  color: #fff;
  margin: 0 0 12px;
  letter-spacing: 3px;
  position: relative;

  &::before {
    content: attr(data-text);
    position: absolute;
    left: 2px;
    color: #00ff88;
    clip-path: inset(0 0 50% 0);
  }
}

.card-content p {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  line-height: 1.6;
}

.card-glitch-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--card-color);
  transform: scaleX(0);
  opacity: 0;

  &:nth-child(4) { top: 30%; }
  &:nth-child(5) { top: 50%; }
  &:nth-child(6) { top: 70%; }
}

.glitch-bars {
  position: absolute;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}

.bar {
  width: 40px;
  height: 4px;
  background: linear-gradient(90deg, #ff0055, #00ff88, #ffaa00, #aa00ff);
  transform: scaleX(0);
  transform-origin: center;
}

.scroll-indicator {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.scroll-line {
  width: 100px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #fff, transparent);
  transform-origin: left;
  transform: scaleX(0);
}

.scroll-text {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 4px;
}
</style>
