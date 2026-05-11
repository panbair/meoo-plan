<template>
  <div ref="sectionRef" class="card-aether">
    <!-- 以太粒子背景 -->
    <div class="aether-bg">
      <div class="energy-flow flow-1"></div>
      <div class="energy-flow flow-2"></div>
      <div class="energy-flow flow-3"></div>
      <div class="aether-particles"></div>
      <div class="cosmic-dust"></div>
    </div>

    <!-- 中心能量核心 -->
    <div ref="coreRef" class="energy-core">
      <div class="core-ring ring-1"></div>
      <div class="core-ring ring-2"></div>
      <div class="core-ring ring-3"></div>
      <div class="core-glow"></div>
    </div>

    <!-- 内容区域 -->
    <div class="aether-content">
      <div ref="badgeRef" class="aether-badge">ETHER</div>
      <h2 ref="titleRef" class="aether-title">以太能量</h2>
      <p ref="subtitleRef" class="aether-subtitle">穿越虚空的能量之流 · 宇宙的本源</p>

      <!-- 能量卡片堆叠区域 -->
      <div ref="cardsStackRef" class="aether-cards" :class="{ 'is-expanded': isExpanded }">
        <div
          v-for="(card, i) in energyCards"
          :key="i"
          :ref="el => cardRefs.set(i, el as HTMLElement)"
          class="energy-card"
          :style="{ '--card-index': i }"
        >
          <div class="card-glow"></div>
          <div class="card-icon-wrapper">
            <svg class="card-icon-svg" viewBox="0 0 100 100">
              <circle class="icon-bg" cx="50" cy="50" r="45" />
              <path class="icon-path" :d="card.path" />
            </svg>
          </div>
          <h3 class="card-title">{{ card.title }}</h3>
          <p class="card-desc">{{ card.desc }}</p>
          <div class="card-energy-bar">
            <div class="energy-fill" :style="{ width: card.energy }"></div>
          </div>
        </div>
      </div>

      <div ref="footerRef" class="aether-footer">
        <span>感知以太的脉动</span>
      </div>
    </div>

    <!-- 光晕效果 -->
    <div class="aether-halo"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

// @ts-ignore
import Flip from 'gsap/Flip'

gsap.registerPlugin(ScrollTrigger, Flip)

type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []

const sectionRef = ref<HTMLElement | null>(null)
const badgeRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const coreRef = ref<HTMLElement | null>(null)
const cardRefs = ref(new Map<number, HTMLElement>())
const cardsStackRef = ref<HTMLElement | null>(null)
const isExpanded = ref(false)

// 能量卡片数据
const energyCards = [
  {
    title: '虚空之力',
    desc: '源自宇宙深处的神秘能量',
    energy: '92%',
    path: 'M50 10 L90 50 L50 90 L10 50 Z'
  },
  {
    title: '以太之魂',
    desc: '连接万物本质的精纯能量',
    energy: '85%',
    path: 'M50 5 L95 50 L50 95 L5 50 Z M50 20 L80 50 L50 80 L20 50 Z'
  },
  {
    title: '星辰之息',
    desc: '承载恒星光芒的永恒力量',
    energy: '78%',
    path: 'M50 10 L58 40 L90 45 L65 60 L75 90 L50 72 L25 90 L35 60 L10 45 L42 40 Z'
  },
  {
    title: '维度裂隙',
    desc: '穿梭多元宇宙的空间通道',
    energy: '88%',
    path: 'M20 20 L80 20 L80 80 L20 80 Z M35 35 L65 35 L65 65 L35 65 Z'
  }
]

const createAetherParticles = () => {
  if (!sectionRef.value) return
  const container = sectionRef.value.querySelector('.aether-particles') as HTMLElement
  if (!container) return

  for (let i = 0; i < 40; i++) {
    const particle = document.createElement('div')
    particle.className = 'aether-particle'
    particle.style.left = `${Math.random() * 100}%`
    particle.style.top = `${Math.random() * 100}%`
    particle.style.animationDelay = `${Math.random() * 5}s`
    particle.style.animationDuration = `${3 + Math.random() * 4}s`
    container.appendChild(particle)
    cleanupFns.push(() => particle.remove())
  }
}

const initAnimations = () => {
  if (!sectionRef.value) return

  createAetherParticles()

  // 能量核心脉冲动画
  if (coreRef.value) {
    gsap.to(coreRef.value.querySelector('.core-glow'), {
      scale: 1.3,
      opacity: 0.8,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })

    const rings = coreRef.value.querySelectorAll('.core-ring')
    rings.forEach((ring, i) => {
      gsap.to(ring, {
        rotation: i % 2 === 0 ? 360 : -360,
        duration: 8 + i * 3,
        repeat: -1,
        ease: 'none'
      })
    })
  }

  // ========== 入场动画 - 弹性登场 ==========
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 85%',
      toggleActions: 'play none none none'
    }
  })

  tl.fromTo(badgeRef.value,
    { scale: 0, opacity: 0, rotation: -30 },
    { scale: 1, opacity: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.7)' }
  )
  .fromTo(titleRef.value,
    { y: 80, scale: 0.7, opacity: 0, filter: 'blur(10px)' },
    { y: 0, scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.7, ease: 'back.out(1.4)' },
    '-=0.4'
  )
  .fromTo(subtitleRef.value,
    { y: 50, opacity: 0, letterSpacing: '15px' },
    { y: 0, opacity: 1, letterSpacing: '4px', duration: 0.6, ease: 'power2.out' },
    '-=0.3'
  )

  // 卡片弹性登场
  const cards = cardRefs.value
  cards.forEach((card, i) => {
    if (!card) return
    gsap.set(card, { opacity: 0, y: 80, scale: 0.7, rotation: 5 })
    tl.to(card,
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotation: 0,
        duration: 0.8,
        ease: 'back.out(1.7)'
      },
      `-=${0.5 - i * 0.08}`
    )
  })

  tl.fromTo(footerRef.value,
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
    '-=0.2'
  )

  cleanupFns.push(() => tl.kill())

  // ========== 滚动动画 ==========
  // 标题滚动消失
  if (titleRef.value) {
    const st1 = ScrollTrigger.create({
      trigger: titleRef.value,
      start: 'top 80%',
      end: 'top 30%',
      scrub: 1.5,
      onUpdate: (self) => {
        gsap.set(titleRef.value, {
          y: -120 * self.progress,
          opacity: Math.max(0, 1 - self.progress * 2.5),
          scale: 1 - self.progress * 0.3,
          filter: `blur(${self.progress * 8}px)`
        })
      }
    })
    cleanupFns.push(() => st1.kill())
  }

  // 副标题滚动效果
  if (subtitleRef.value) {
    const st2 = ScrollTrigger.create({
      trigger: subtitleRef.value,
      start: 'top 80%',
      end: 'top 30%',
      scrub: 1.5,
      onUpdate: (self) => {
        gsap.set(subtitleRef.value, {
          y: -60 * self.progress,
          opacity: Math.max(0, 1 - self.progress * 2),
          rotateX: self.progress * 20,
          filter: `blur(${self.progress * 5}px)`
        })
      }
    })
    cleanupFns.push(() => st2.kill())
  }

  // 卡片滚动翻转
  cards.forEach((card, i) => {
    if (!card) return

    const st = ScrollTrigger.create({
      trigger: card,
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1.5,
      onUpdate: (self) => {
        gsap.set(card, {
          y: -40 * self.progress,
          rotateY: self.progress * 20,
          rotateZ: self.progress * (i % 2 === 0 ? 5 : -5),
          scale: 1 - self.progress * 0.15,
          filter: `brightness(${1 + self.progress * 0.5})`
        })
      }
    })
    cleanupFns.push(() => st.kill())
  })

  // 能量核心滚动效果
  if (coreRef.value) {
    const stCore = ScrollTrigger.create({
      trigger: sectionRef.value,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 2,
      onUpdate: (self) => {
        gsap.set(coreRef.value, {
          scale: 1 + self.progress * 0.5,
          filter: `brightness(${1 + self.progress})`
        })
      }
    })
    cleanupFns.push(() => stCore.kill())
  }

  // 卡片 Flip 展开动画
  setupFlipAnimation()
}

// ========== Flip 展开动画 ==========
const setupFlipAnimation = () => {
  if (!cardsStackRef.value) return

  nextTick(() => {
    const cards = cardsStackRef.value.querySelectorAll('.energy-card')
    if (cards.length === 0) return

    // 获取初始状态（堆叠状态）
    const state = Flip.getState(cards)

    // 添加展开类
    cardsStackRef.value.classList.add('is-expanded')

    // Flip 动画 - 使用 scrub 模式实现双向动画
    const flipTween = Flip.from(state, {
      duration: 1.5,
      stagger: {
        each: 0.08,
        from: 'end' // 从最后一个开始展开，收起时从最后一个开始
      },
      ease: 'power2.inOut',
      absolute: true,
      spin: true,
      scrollTrigger: {
        trigger: cardsStackRef.value,
        start: 'top 75%',
        end: 'top 15%',
        scrub: 2, // 增大数值让动画更平滑
        onUpdate: (self) => {
          // 更新展开状态
          isExpanded.value = self.progress > 0.5
        },
        onToggle: (self) => {
          // 切换时同步状态
          isExpanded.value = self.isActive
        }
      }
    })

    // 保存清理函数
    cleanupFns.push(() => flipTween.kill())

    // 卡片悬停效果
    cards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          scale: 1.05,
          z: 20,
          duration: 0.3,
          ease: 'power2.out'
        })
      })

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          scale: 1,
          z: 0,
          duration: 0.4,
          ease: 'elastic.out(1, 0.5)'
        })
      })

      card.addEventListener('mousemove', (e: Event) => {
        const mouseEvent = e as MouseEvent
        const rect = card.getBoundingClientRect()
        const x = (mouseEvent.clientX - rect.left) / rect.width - 0.5
        const y = (mouseEvent.clientY - rect.top) / rect.height - 0.5

        gsap.to(card, {
          rotateY: x * 8,
          rotateX: -y * 8,
          duration: 0.3,
          ease: 'power2.out'
        })
      })
    })
  })
}

onMounted(() => {
  initAnimations()
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(st => {
    if (st.vars.trigger && sectionRef.value?.contains(st.vars.trigger as Element)) {
      st.kill()
    }
  })
})
</script>

<style scoped lang="scss">
@use 'sass:math';

.card-aether {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(180deg, #0a0015 0%, #1a0a30 40%, #2d1b4e 70%, #1a0a30 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.aether-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.energy-flow {
  position: absolute;
  width: 200%;
  height: 2px;
  background: linear-gradient(90deg,
    transparent,
    rgba(138, 43, 226, 0.6),
    rgba(75, 0, 130, 0.8),
    rgba(138, 43, 226, 0.6),
    transparent
  );
  opacity: 0.4;
}

.flow-1 {
  top: 20%;
  animation: energyFlow1 8s linear infinite;
}

.flow-2 {
  top: 50%;
  animation: energyFlow2 10s linear infinite;
}

.flow-3 {
  top: 80%;
  animation: energyFlow3 12s linear infinite;
}

@keyframes energyFlow1 {
  0% { transform: translateX(-50%) rotate(-5deg); }
  100% { transform: translateX(0%) rotate(-5deg); }
}

@keyframes energyFlow2 {
  0% { transform: translateX(0%) rotate(3deg); }
  100% { transform: translateX(-50%) rotate(3deg); }
}

@keyframes energyFlow3 {
  0% { transform: translateX(-50%) rotate(-2deg); }
  100% { transform: translateX(0%) rotate(-2deg); }
}

.aether-particles {
  position: absolute;
  inset: 0;
}

:global(.aether-particle) {
  position: absolute;
  width: 4px;
  height: 4px;
  background: radial-gradient(circle, rgba(138, 43, 226, 0.8) 0%, transparent 70%);
  border-radius: 50%;
  animation: particleFloat 4s ease-in-out infinite;
}

@keyframes particleFloat {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-30px) scale(1.5);
    opacity: 1;
  }
}

.cosmic-dust {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 30%, rgba(138, 43, 226, 0.1) 0%, transparent 40%),
    radial-gradient(circle at 80% 70%, rgba(75, 0, 130, 0.15) 0%, transparent 40%);
}

.energy-core {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 300px;
}

.core-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  border: 2px solid transparent;
  transform: translate(-50%, -50%);
}

.ring-1 {
  width: 300px;
  height: 300px;
  border-color: rgba(138, 43, 226, 0.3);
}

.ring-2 {
  width: 220px;
  height: 220px;
  border-color: rgba(75, 0, 130, 0.5);
}

.ring-3 {
  width: 140px;
  height: 140px;
  border-color: rgba(138, 43, 226, 0.7);
}

.core-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background: radial-gradient(circle, rgba(138, 43, 226, 1) 0%, rgba(75, 0, 130, 0.8) 50%, transparent 70%);
  border-radius: 50%;
  box-shadow:
    0 0 40px rgba(138, 43, 226, 0.8),
    0 0 80px rgba(138, 43, 226, 0.4);
}

.aether-content {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 60px;
}

.aether-badge {
  display: inline-block;
  padding: 8px 24px;
  background: rgba(138, 43, 226, 0.2);
  border: 1px solid rgba(138, 43, 226, 0.4);
  border-radius: 30px;
  color: #b366ff;
  font-size: 12px;
  letter-spacing: 5px;
  margin-bottom: 30px;
  backdrop-filter: blur(10px);
}

.aether-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 72px;
  font-weight: 900;
  letter-spacing: 10px;
  background: linear-gradient(180deg, #fff 0%, #b366ff 50%, #8a2be2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 20px;
  filter: drop-shadow(0 0 30px rgba(138, 43, 226, 0.5));
}

.aether-subtitle {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 4px;
  margin-bottom: 60px;
}

.aether-cards {
  position: relative;
  display: flex;
  gap: 25px;
  justify-content: center;
  flex-wrap: wrap;
  perspective: 1200px;
  min-height: 300px;
  margin: 0 auto;
  max-width: 280px;
  height: 320px;

  // 展开后的网格布局
  &.is-expanded {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    max-width: 900px;
    height: auto;
    min-height: auto;

    .energy-card {
      position: relative;
      top: auto;
      left: auto;
      transform: none;
      opacity: 1;
    }
  }

  // 堆叠状态 - 非展开时
  &:not(.is-expanded) {
    .energy-card {
      position: absolute;
      top: 10px;
      left: 10px;
      transform: rotate(calc((var(--card-index) - 1.5) * 6deg)) scale(calc(1 - abs(var(--card-index) - 1.5) * 0.08));
      z-index: calc(10 - var(--card-index));
    }
  }
}

.energy-card {
  position: relative;
  width: 220px;
  padding: 35px 25px;
  background: rgba(10, 0, 21, 0.8);
  border: 1px solid rgba(138, 43, 226, 0.3);
  border-radius: 20px;
  backdrop-filter: blur(20px);
  transform-style: preserve-3d;
  cursor: pointer;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 0%, rgba(138, 43, 226, 0.15) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.4s;
  }

  &:hover {
    border-color: rgba(138, 43, 226, 0.7);
    box-shadow: 0 0 40px rgba(138, 43, 226, 0.3);

    &::before {
      opacity: 1;
    }

    .card-icon-wrapper {
      transform: scale(1.1) rotate(10deg);
    }

    .energy-fill {
      width: 100% !important;
    }
  }
}

.card-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(138, 43, 226, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.card-icon-wrapper {
  width: 70px;
  height: 70px;
  margin: 0 auto 20px;
  transition: transform 0.4s;
}

.card-icon-svg {
  width: 100%;
  height: 100%;
}

.icon-bg {
  fill: rgba(138, 43, 226, 0.2);
  stroke: rgba(138, 43, 226, 0.6);
  stroke-width: 2;
}

.icon-path {
  fill: none;
  stroke: #b366ff;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
  filter: drop-shadow(0 0 8px rgba(138, 43, 226, 0.8));
}

.card-title {
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 10px;
}

.card-desc {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.5;
  margin-bottom: 20px;
}

.card-energy-bar {
  height: 3px;
  background: rgba(138, 43, 226, 0.2);
  border-radius: 2px;
  overflow: hidden;
}

.energy-fill {
  height: 100%;
  background: linear-gradient(90deg, #8a2be2, #b366ff);
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(138, 43, 226, 0.5);
  transition: width 0.5s ease;
}

.aether-footer {
  margin-top: 60px;
  color: rgba(255, 255, 255, 0.4);
  font-size: 14px;
  letter-spacing: 3px;
}

.aether-halo {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%,
    transparent 30%,
    rgba(138, 43, 226, 0.05) 50%,
    transparent 70%
  );
  pointer-events: none;
}

@media (max-width: 768px) {
  .aether-title {
    font-size: 42px;
    letter-spacing: 5px;
  }

  .aether-subtitle {
    font-size: 14px;
    letter-spacing: 2px;
  }

  .aether-cards {
    gap: 15px;

    &.is-expanded {
      grid-template-columns: repeat(2, 1fr);
    }

    &:not(.is-expanded) {
      .energy-card {
        position: relative;
        top: auto;
        left: auto;
        transform: none !important;
      }
    }
  }

  .energy-card {
    width: 160px;
    padding: 25px 15px;
  }

  .card-icon-wrapper {
    width: 50px;
    height: 50px;
  }
}
</style>
