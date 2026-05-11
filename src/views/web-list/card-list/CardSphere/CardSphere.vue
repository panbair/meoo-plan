<template>
  <section class="sphere-section">
    <!-- 背景粒子 -->
    <div class="sphere-particles">
      <span
        v-for="i in 30"
        :key="i"
        class="particle"
        :ref="(el) => setParticleRef(el, i)"
        :style="{ '--delay': `${Math.random() * 5}s`, '--x': `${Math.random() * 100}%`, '--duration': `${5 + Math.random() * 10}s` }"
      ></span>
    </div>

    <div class="sphere-container">
      <div
        v-for="(card, index) in cards"
        :key="card.id"
        class="sphere-card"
        :ref="(el) => setCardRef(el, index)"
        :style="{ '--card-color': card.color }"
        @mousemove="(e) => handleMouseMove(e, index)"
        @mouseleave="(e) => handleMouseLeave(e, index)"
      >
        <div class="sphere-orb" :style="{ background: card.gradient }">
          <div class="orb-highlight"></div>
          <div class="orb-shadow"></div>
          <div class="orb-ring ring-1" :ref="(el) => setRingRef(el, index, 0)"></div>
          <div class="orb-ring ring-2" :ref="(el) => setRingRef(el, index, 1)"></div>
        </div>
        <div class="sphere-content">
          <h3 class="sphere-title" :ref="(el) => setTitleRef(el, index)">{{ card.title }}</h3>
          <p class="sphere-desc" :ref="(el) => setDescRef(el, index)">{{ card.desc }}</p>
          <div class="sphere-stats">
            <span
              v-for="(stat, i) in card.stats"
              :key="i"
              class="stat-item"
              :ref="(el) => setStatRef(el, index, i)"
            >
              <span class="stat-value">{{ stat.value }}</span>
              <span class="stat-label">{{ stat.label }}</span>
            </span>
          </div>
        </div>
        <div class="sphere-glow"></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * CardSphere - 3D悬浮球卡片组件
 * @description 丰富的滚动动画效果：旋转、缩放、光效变化
 */

import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ============================================================
// 类型定义
// ============================================================
interface Stat {
  value: string
  label: string
}

interface SphereCard {
  id: string
  icon: string
  title: string
  desc: string
  gradient: string
  color: string
  stats: Stat[]
}

// ============================================================
// 数据
// ============================================================
const CARDS_DATA: SphereCard[] = [
  {
    id: 'sphere-1',
    icon: '⚡',
    title: 'Lightning Fast',
    desc: 'Optimized for speed and performance across all devices',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#764ba2',
    stats: [
      { value: '2.3s', label: 'Load Time' },
      { value: '99%', label: 'Score' }
    ]
  },
  {
    id: 'sphere-2',
    icon: '🎯',
    title: 'Precision Design',
    desc: 'Every pixel crafted with attention to detail',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    color: '#f5576c',
    stats: [
      { value: '100+', label: 'Components' },
      { value: '60fps', label: 'Animation' }
    ]
  },
  {
    id: 'sphere-3',
    icon: '🌟',
    title: 'Stellar Quality',
    desc: 'Built with modern technologies and best practices',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    color: '#00f2fe',
    stats: [
      { value: 'Vue 3', label: 'Framework' },
      { value: 'TS', label: 'Language' }
    ]
  }
]

// ============================================================
// 响应式数据
// ============================================================
const cards = ref<SphereCard[]>(CARDS_DATA)
const cardRefsMap = ref(new Map<number, HTMLElement>())
const particleRefsMap = ref(new Map<number, HTMLElement>())
const ringRefsMap = ref(new Map<string, HTMLElement>())
const titleRefsMap = ref(new Map<number, HTMLElement>())
const descRefsMap = ref(new Map<number, HTMLElement>())
const statRefsMap = ref(new Map<string, HTMLElement>())
const cleanupFns: (() => void)[] = []

// ============================================================
// 模板引用
// ============================================================
const setCardRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  const element = el instanceof Element ? el : (el as any)?.$el
  if (element) {
    cardRefsMap.value.set(index, element as HTMLElement)
  } else {
    cardRefsMap.value.delete(index)
  }
}

const setParticleRef = (el: Element | null, index: number) => {
  if (el instanceof HTMLElement) {
    particleRefsMap.value.set(index, el)
  } else {
    particleRefsMap.value.delete(index)
  }
}

const setRingRef = (el: Element | null, index: number, ringIndex: number) => {
  if (el instanceof HTMLElement) {
    ringRefsMap.value.set(`${index}-${ringIndex}`, el)
  } else {
    ringRefsMap.value.delete(`${index}-${ringIndex}`)
  }
}

const setTitleRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  const element = el instanceof Element ? el : (el as any)?.$el
  if (element) {
    titleRefsMap.value.set(index, element as HTMLElement)
  } else {
    titleRefsMap.value.delete(index)
  }
}

const setDescRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  const element = el instanceof Element ? el : (el as any)?.$el
  if (element) {
    descRefsMap.value.set(index, element as HTMLElement)
  } else {
    descRefsMap.value.delete(index)
  }
}

const setStatRef = (el: Element | ComponentPublicInstance | null, index: number, statIndex: number) => {
  const element = el instanceof Element ? el : (el as any)?.$el
  const key = `${index}-${statIndex}`
  if (element) {
    statRefsMap.value.set(key, element as HTMLElement)
  } else {
    statRefsMap.value.delete(key)
  }
}

// ============================================================
// 鼠标交互
// ============================================================
const handleMouseMove = (e: MouseEvent, index: number) => {
  const card = cardRefsMap.value.get(index)
  const orb = card?.querySelector('.sphere-orb') as HTMLElement
  if (!card) return

  const rect = card.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const centerX = rect.width / 2
  const centerY = rect.height / 2

  const rotateX = (y - centerY) / 15
  const rotateY = (centerX - x) / 15

  gsap.to(card, {
    rotateX: rotateX,
    rotateY: rotateY,
    scale: 1.08,
    duration: 0.3,
    ease: 'power2.out'
  })

  if (orb) {
    gsap.to(orb, {
      x: (x - centerX) / 10,
      y: (y - centerY) / 10,
      duration: 0.3
    })
  }
}

const handleMouseLeave = (e: MouseEvent, index: number) => {
  const card = cardRefsMap.value.get(index)
  const orb = card?.querySelector('.sphere-orb') as HTMLElement
  if (!card) return

  gsap.to(card, {
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    duration: 0.6,
    ease: 'elastic.out(1, 0.5)'
  })

  if (orb) {
    gsap.to(orb, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.5)'
    })
  }
}

// ============================================================
// 动画初始化
// ============================================================
const initEntryAnimation = () => {
  // 粒子入场
  particleRefsMap.value.forEach((particle) => {
    gsap.fromTo(particle,
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: 'power2.out'
      }
    )
  })

  // 卡片入场
  cardRefsMap.value.forEach((card, index) => {
    gsap.fromTo(card,
      {
        y: 120,
        opacity: 0,
        rotateX: -45,
        scale: 0.6
      },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        scale: 1,
        duration: 1.2,
        delay: index * 0.2,
        ease: 'back.out(1.4)'
      }
    )
  })

  // 标题入场
  titleRefsMap.value.forEach((title, index) => {
    gsap.fromTo(title,
      { y: 30, opacity: 0, skewX: -10 },
      {
        y: 0,
        opacity: 1,
        skewX: 0,
        duration: 0.8,
        delay: 0.5 + index * 0.2,
        ease: 'power3.out'
      }
    )
  })

  // 描述入场
  descRefsMap.value.forEach((desc, index) => {
    gsap.fromTo(desc,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        delay: 0.7 + index * 0.2,
        ease: 'power2.out'
      }
    )
  })

  // 统计数字入场
  statRefsMap.value.forEach((stat, index) => {
    gsap.fromTo(stat,
      { scale: 0, opacity: 0, rotateY: 90 },
      {
        scale: 1,
        opacity: 1,
        rotateY: 0,
        duration: 0.6,
        delay: 0.9 + index * 0.1,
        ease: 'back.out(1.7)'
      }
    )
  })
}

// ==================== 丰富的滚动动画 ====================
const initScrollAnimations = () => {
  // 1. 卡片旋转 + Y轴位移
  cardRefsMap.value.forEach((card, index) => {
    const trigger = ScrollTrigger.create({
      trigger: card,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.5,
      onUpdate: (self) => {
        const progress = self.progress
        const rotateZ = Math.sin(progress * Math.PI * 2) * 8
        const translateY = Math.sin(progress * Math.PI) * -40
        const scale = 1 + Math.sin(progress * Math.PI) * 0.05

        gsap.to(card, {
          rotateZ: rotateZ,
          y: translateY,
          scale: scale,
          duration: 0.1
        })
      }
    })
    cleanupFns.push(() => trigger.kill())
  })

  // 2. 悬浮球光环旋转
  ringRefsMap.value.forEach((ring, key) => {
    const [index, ringIndex] = key.split('-').map(Number)
    const direction = ringIndex === 0 ? 1 : -1
    const trigger = ScrollTrigger.create({
      trigger: cardRefsMap.value.get(index),
      start: 'top bottom',
      end: 'bottom top',
      scrub: 2,
      onUpdate: (self) => {
        const rotate = self.progress * 360 * direction
        gsap.to(ring, {
          rotate: rotate,
          scale: 1 + self.progress * 0.3,
          opacity: 0.3 + self.progress * 0.5,
          duration: 0.1
        })
      }
    })
    cleanupFns.push(() => trigger.kill())
  })

  // 3. 背景粒子漂浮
  particleRefsMap.value.forEach((particle) => {
    gsap.to(particle, {
      y: 'random(-100, 100)',
      x: 'random(-50, 50)',
      duration: 'random(3, 6)',
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    })
  })
  cleanupFns.push(() => {
    particleRefsMap.value.forEach((particle) => {
      gsap.killTweensOf(particle)
    })
  })

  // 4. 标题发光效果
  titleRefsMap.value.forEach((title, index) => {
    const card = cardRefsMap.value.get(index)
    if (!card) return

    const trigger = ScrollTrigger.create({
      trigger: card,
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1,
      onUpdate: (self) => {
        const intensity = self.progress * 20
        gsap.to(title, {
          textShadow: `0 0 ${10 + intensity}px var(--card-color), 0 0 ${20 + intensity}px var(--card-color)`,
          duration: 0.1
        })
      }
    })
    cleanupFns.push(() => trigger.kill())
  })

  // 5. 卡片间距变化
  const container = document.querySelector('.sphere-container') as HTMLElement
  if (container) {
    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 2,
      onUpdate: (self) => {
        const gap = 60 + Math.sin(self.progress * Math.PI) * 30
        gsap.to(container, {
          gap: `${gap}px`,
          duration: 0.1
        })
      }
    })
    cleanupFns.push(() => trigger.kill())
  }

  // 6. 发光效果增强
  cardRefsMap.value.forEach((card, index) => {
    const glow = card.querySelector('.sphere-glow') as HTMLElement
    if (!glow) return

    const trigger = ScrollTrigger.create({
      trigger: card,
      start: 'top 80%',
      end: 'top 30%',
      scrub: 1,
      onUpdate: (self) => {
        gsap.to(glow, {
          opacity: 0.2 + self.progress * 0.4,
          scale: 1 + self.progress * 0.5,
          duration: 0.1
        })
      }
    })
    cleanupFns.push(() => trigger.kill())
  })
}

// ============================================================
// 生命周期
// ============================================================
onMounted(() => {
  requestAnimationFrame(() => {
    initEntryAnimation()
    initScrollAnimations()
  })
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
})
</script>

<style scoped lang="scss">
// ============================================================
// 主体
// ============================================================
.sphere-section {
  width: 100vw;
  height: 100vh;
  padding: 80px 40px;
  background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

// ============================================================
// 背景粒子
// ============================================================
.sphere-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.particle {
  position: absolute;
  left: var(--x);
  top: 50%;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: particleFloat var(--duration) ease-in-out infinite;
  animation-delay: var(--delay);

  &::before {
    content: '';
    position: absolute;
    inset: -4px;
    background: inherit;
    border-radius: 50%;
    filter: blur(4px);
    opacity: 0.5;
  }
}

@keyframes particleFloat {
  0%, 100% { transform: translateY(0) scale(1); opacity: 0.6; }
  50% { transform: translateY(-30px) scale(1.5); opacity: 1; }
}

.sphere-container {
  display: flex;
  gap: 60px;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  z-index: 1;
}

// ============================================================
// 卡片
// ============================================================
.sphere-card {
  position: relative;
  width: 280px;
  height: 380px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 24px;
  padding: 40px 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transform-style: preserve-3d;
  perspective: 1000px;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 24px;
    padding: 1px;
    background: linear-gradient(135deg, rgba(255,255,255,0.2), transparent);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }
}

// ============================================================
// 悬浮球
// ============================================================
.sphere-orb {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin-bottom: 30px;
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.4),
    inset 0 -20px 40px rgba(0, 0, 0, 0.2),
    inset 0 20px 40px rgba(255, 255, 255, 0.2);
  animation: float 3s ease-in-out infinite;

  .orb-highlight {
    position: absolute;
    top: 15%;
    left: 20%;
    width: 30%;
    height: 30%;
    background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%);
    border-radius: 50%;
  }

  .orb-shadow {
    position: absolute;
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 20px;
    background: radial-gradient(ellipse, rgba(0,0,0,0.3) 0%, transparent 70%);
    filter: blur(10px);
  }

  .orb-ring {
    position: absolute;
    inset: -15px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    pointer-events: none;

    &.ring-1 {
      inset: -25px;
      border-color: rgba(255, 255, 255, 0.1);
      animation: ringRotate 8s linear infinite;
    }

    &.ring-2 {
      inset: -35px;
      border-color: rgba(255, 255, 255, 0.05);
      animation: ringRotate 12s linear infinite reverse;
    }
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

@keyframes ringRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

// ============================================================
// 内容
// ============================================================
.sphere-content {
  text-align: center;
  z-index: 1;
}

.sphere-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 10px 0;
  text-shadow: 0 0 10px var(--card-color);
}

.sphere-desc {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 25px 0;
  line-height: 1.5;
}

.sphere-stats {
  display: flex;
  gap: 30px;
  justify-content: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-value {
  font-size: 1.4rem;
  font-weight: 700;
  color: #fff;
}

.stat-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 1px;
}

// ============================================================
// 发光效果
// ============================================================
.sphere-glow {
  position: absolute;
  top: 30%;
  left: 50%;
  width: 200px;
  height: 200px;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, var(--card-color) 0%, transparent 70%);
  opacity: 0.2;
  pointer-events: none;
  filter: blur(40px);
  z-index: -1;
}
</style>
