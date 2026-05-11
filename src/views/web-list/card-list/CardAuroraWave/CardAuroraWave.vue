<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void

const parent = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)

const cleanupFns: TweenCleanup[] = []

interface DataItem {
  id: number
  char: string
  x: number
  y: number
  duration: number
  delay: number
}

interface ParticleItem {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
}

const dataItems = ref<DataItem[]>([])
const particles = ref<ParticleItem[]>([])

const cardData = [
  {
    id: '01',
    title: '极光起源',
    subtitle: 'AURORA ORIGIN',
    description: '太阳风与地球磁场的神奇碰撞，在两极上空编织出绚丽的光幕'
  },
  {
    id: '02',
    title: '光的舞蹈',
    subtitle: 'DANCE OF LIGHT',
    description: '氧气与氮气的电子跃迁，释放出从绿到紫的梦幻色彩'
  },
  {
    id: '03',
    title: '海浪呼应',
    subtitle: 'WAVE ECHO',
    description: '极光如同海浪般起伏，与北大西洋的海浪遥相呼应'
  },
  {
    id: '04',
    title: '时空之门',
    subtitle: 'PORTAL OF TIME',
    description: '传说中连接天地的通道，见证北极原住民的古老神话'
  }
]

const matrixChars = '01アイウエオカキクケコサシスセソタチツテト'.split('')

const initDataItems = () => {
  dataItems.value = []
  for (let i = 0; i < 80; i++) {
    dataItems.value.push({
      id: i,
      char: matrixChars[Math.floor(Math.random() * matrixChars.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 2 + Math.random() * 4,
      delay: Math.random() * 5
    })
  }
}

const initParticles = () => {
  particles.value = []
  for (let i = 0; i < 60; i++) {
    particles.value.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 4,
      duration: 3 + Math.random() * 5,
      delay: Math.random() * 3
    })
  }
}

const initAnimations = () => {
  if (!parent.value) return

  const tl = gsap.timeline()

  // roll-up 入场动画
  tl.fromTo(
    parent.value,
    {
      y: '100%',
      visibility: 'hidden',
      rotation: -15,
      transformOrigin: '50% 100%'
    },
    {
      y: 0,
      visibility: 'visible',
      rotation: 0,
      duration: 1.2,
      ease: 'expo.out'
    }
  )

  // Badge 动画
  tl.fromTo(
    '.aurora-badge',
    { scale: 0, rotation: -180, opacity: 0 },
    { scale: 1, rotation: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.7)' },
    '-=0.6'
  )

  // 极光效果入场
  tl.fromTo(
    '.aurora-layer',
    { opacity: 0, scaleY: 0 },
    { opacity: 1, scaleY: 1, duration: 1.5, stagger: 0.2, ease: 'power2.out' },
    '-=0.8'
  )

  // 主标题动画
  tl.fromTo(
    '.aurora-title',
    { y: 80, opacity: 0, filter: 'blur(20px)' },
    { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1, ease: 'power3.out' },
    '-=1'
  )

  // 副标题展开
  tl.fromTo(
    '.aurora-subtitle',
    { letterSpacing: '30px', opacity: 0 },
    { letterSpacing: '12px', opacity: 1, duration: 1, ease: 'power2.out' },
    '-=0.6'
  )

  // 副标题文字
  tl.fromTo(
    '.aurora-desc',
    { y: 60, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
    '-=0.5'
  )

  // 脉冲环动画
  tl.fromTo(
    '.aurora-pulse',
    { scale: 0, opacity: 0 },
    { scale: 1, opacity: 0.6, duration: 1, stagger: 0.15, ease: 'power2.out' },
    '-=0.6'
  )

  // 卡片动画
  tl.fromTo(
    '.aurora-card',
    { y: 100, opacity: 0, rotationY: 30, transformPerspective: 1000 },
    {
      y: 0,
      opacity: 1,
      rotationY: 0,
      duration: 1,
      stagger: 0.15,
      ease: 'back.out(1.4)'
    },
    '-=0.4'
  )

  // 数据流粒子动画
  tl.fromTo(
    '.aurora-data-item',
    { opacity: 0 },
    { opacity: 1, duration: 0.3, stagger: 0.02 },
    '-=0.5'
  )

  // 浮动粒子动画
  tl.fromTo(
    '.aurora-particle',
    { scale: 0, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.5, stagger: 0.03 },
    '-=0.8'
  )

  // 波浪动画
  tl.fromTo(
    '.aurora-wave',
    { y: '100%', opacity: 0 },
    { y: '0%', opacity: 0.8, duration: 1.5, stagger: 0.3, ease: 'power2.out' },
    '-=1'
  )

  // 持续动画
  const pulseAnim = gsap.to('.aurora-pulse-1', {
    scale: 1.3,
    opacity: 0.3,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  })
  cleanupFns.push(() => pulseAnim.kill())

  const pulseAnim2 = gsap.to('.aurora-pulse-2', {
    scale: 1.2,
    opacity: 0.4,
    duration: 2.5,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  })
  cleanupFns.push(() => pulseAnim2.kill())

  const pulseAnim3 = gsap.to('.aurora-pulse-3', {
    scale: 1.4,
    opacity: 0.2,
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  })
  cleanupFns.push(() => pulseAnim3.kill())

  // 极光波动动画
  const auroraWave = gsap.to('.aurora-layer-1', {
    backgroundPositionX: '100%',
    duration: 8,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  })
  cleanupFns.push(() => auroraWave.kill())

  const auroraWave2 = gsap.to('.aurora-layer-2', {
    backgroundPositionX: '-100%',
    duration: 10,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  })
  cleanupFns.push(() => auroraWave2.kill())

  const auroraWave3 = gsap.to('.aurora-layer-3', {
    backgroundPositionX: '50%',
    duration: 12,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  })
  cleanupFns.push(() => auroraWave3.kill())

  // 数据流下落
  gsap.utils.toArray<HTMLElement>('.aurora-data-item').forEach((el) => {
    gsap.to(el, {
      y: '+=120vh',
      duration: 3 + Math.random() * 4,
      repeat: -1,
      delay: Math.random() * 2,
      ease: 'none',
      onRepeat: () => {
        gsap.set(el, { y: 0 })
        el.textContent = matrixChars[Math.floor(Math.random() * matrixChars.length)]
      }
    })
  })

  // 粒子漂浮
  gsap.utils.toArray<HTMLElement>('.aurora-particle').forEach((particle) => {
    const anim = gsap.to(particle, {
      y: `-=${30 + Math.random() * 50}`,
      x: `+=${(Math.random() - 0.5) * 30}`,
      scale: 0.5 + Math.random() * 1,
      opacity: 0.3 + Math.random() * 0.7,
      duration: 2 + Math.random() * 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
    cleanupFns.push(() => anim.kill())
  })

  // 星星闪烁
  gsap.utils.toArray<HTMLElement>('.aurora-star').forEach((star) => {
    const anim = gsap.to(star, {
      opacity: 0.2 + Math.random() * 0.8,
      scale: 0.5 + Math.random() * 1,
      duration: 1 + Math.random() * 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
    cleanupFns.push(() => anim.kill())
  })

  // ScrollTrigger
  const scrollTrigger = ScrollTrigger.create({
    trigger: parent.value,
    start: 'top 80%',
    end: 'top 20%',
    scrub: 1.5,
    onUpdate: (self) => {
      if (parent.value) {
        gsap.set(parent.value, {
          y: 100 * self.progress,
          opacity: 1 - self.progress * 1.5
        })
      }
    }
  })
  cleanupFns.push(() => scrollTrigger.kill())
}

const onCardHover = (event: MouseEvent) => {
  const target = event.currentTarget as HTMLElement
  gsap.to(target, {
    scale: 1.03,
    rotationY: 5,
    duration: 0.4,
    ease: 'power2.out'
  })
}

const onCardLeave = (event: MouseEvent) => {
  const target = event.currentTarget as HTMLElement
  gsap.to(target, {
    scale: 1,
    rotationY: 0,
    duration: 0.6,
    ease: 'power2.out'
  })
}

onMounted(async () => {
  initDataItems()
  initParticles()
  await nextTick()
  initAnimations()
})

onUnmounted(() => {
  cleanupFns.forEach((fn) => fn())
})
</script>

<template>
  <div ref="parent" class="aurora-parent">
    <!-- 背景渐变 -->
    <div class="aurora-bg"></div>

    <!-- 极光层 -->
    <div class="aurora-layer aurora-layer-1"></div>
    <div class="aurora-layer aurora-layer-2"></div>
    <div class="aurora-layer aurora-layer-3"></div>

    <!-- 星星 -->
    <div
      v-for="i in 100"
      :key="'star-' + i"
      class="aurora-star"
      :style="{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: `${1 + Math.random() * 2}px`,
        height: `${1 + Math.random() * 2}px`,
        animationDelay: `${Math.random() * 3}s`
      }"
    ></div>

    <!-- 数据流 -->
    <div
      v-for="item in dataItems"
      :key="'data-' + item.id"
      class="aurora-data-item"
      :style="{
        left: `${item.x}%`,
        top: `${item.y}%`,
        animationDelay: `${item.delay}s`
      }"
    >
      {{ item.char }}
    </div>

    <!-- 浮动粒子 -->
    <div
      v-for="item in particles"
      :key="'particle-' + item.id"
      class="aurora-particle"
      :style="{
        left: `${item.x}%`,
        top: `${item.y}%`,
        width: `${item.size}px`,
        height: `${item.size}px`,
        animationDelay: `${item.delay}s`
      }"
    ></div>

    <!-- 波浪层 -->
    <div class="aurora-wave aurora-wave-1"></div>
    <div class="aurora-wave aurora-wave-2"></div>
    <div class="aurora-wave aurora-wave-3"></div>

    <!-- 脉冲环 -->
    <div class="aurora-pulse aurora-pulse-1"></div>
    <div class="aurora-pulse aurora-pulse-2"></div>
    <div class="aurora-pulse aurora-pulse-3"></div>

    <!-- 主内容 -->
    <div ref="contentRef" class="aurora-content">
      <div class="aurora-header">
        <div class="aurora-badge">
          <span class="aurora-badge-icon">✧</span>
          <span class="aurora-badge-text">AURORA WAVE</span>
        </div>
        <h1 class="aurora-title">极光与海浪</h1>
        <p class="aurora-subtitle">光影交织的梦幻奇境</p>
        <p class="aurora-desc">
          当北极光倒映在北大西洋的海面上，天空与海洋在黑暗中 共舞，编织出自然界最壮观的光影奇观
        </p>
      </div>

      <div class="aurora-cards">
        <div
          v-for="card in cardData"
          :key="card.id"
          class="aurora-card"
          @mouseenter="onCardHover"
          @mouseleave="onCardLeave"
        >
          <div class="aurora-card-inner">
            <div class="aurora-card-glow"></div>
            <span class="aurora-card-id">{{ card.id }}</span>
            <h3 class="aurora-card-title">{{ card.title }}</h3>
            <span class="aurora-card-subtitle">{{ card.subtitle }}</span>
            <p class="aurora-card-desc">{{ card.description }}</p>
            <div class="aurora-card-line"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部光芒 -->
    <div class="aurora-bottom-glow"></div>
  </div>
</template>

<style lang="scss" scoped>
.aurora-parent {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(180deg, #0a0a1a 0%, #0f1629 50%, #1a0a2e 100%);
  transform-origin: 50% 100%;
}

.aurora-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 20% 20%, rgba(0, 255, 200, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 80%, rgba(255, 0, 255, 0.06) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(0, 100, 255, 0.05) 0%, transparent 60%);
}

// 极光层
.aurora-layer {
  position: absolute;
  width: 200%;
  height: 60%;
  left: -50%;
  transform-origin: center bottom;
  filter: blur(60px);
  opacity: 0;
  will-change: transform, opacity;
}

.aurora-layer-1 {
  top: 5%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(0, 255, 200, 0.4) 20%,
    rgba(0, 200, 255, 0.3) 40%,
    rgba(100, 0, 255, 0.25) 60%,
    transparent 100%
  );
  animation: aurora-wave-1 8s ease-in-out infinite;
}

.aurora-layer-2 {
  top: 12%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 0, 255, 0.35) 25%,
    rgba(255, 100, 200, 0.25) 50%,
    rgba(0, 255, 255, 0.3) 75%,
    transparent 100%
  );
  animation: aurora-wave-2 10s ease-in-out infinite;
  opacity: 0.7;
}

.aurora-layer-3 {
  top: 20%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 215, 0, 0.2) 30%,
    rgba(255, 150, 0, 0.15) 50%,
    rgba(255, 100, 100, 0.2) 70%,
    transparent 100%
  );
  animation: aurora-wave-3 12s ease-in-out infinite;
  opacity: 0.5;
}

@keyframes aurora-wave-1 {
  0%, 100% {
    transform: translateX(-10%) skewX(-5deg) scaleY(1);
  }
  50% {
    transform: translateX(10%) skewX(5deg) scaleY(1.2);
  }
}

@keyframes aurora-wave-2 {
  0%, 100% {
    transform: translateX(15%) skewX(8deg) scaleY(1.1);
  }
  50% {
    transform: translateX(-15%) skewX(-8deg) scaleY(0.9);
  }
}

@keyframes aurora-wave-3 {
  0%, 100% {
    transform: translateX(-5%) scaleY(1);
  }
  50% {
    transform: translateX(5%) scaleY(1.3);
  }
}

// 星星
.aurora-star {
  position: absolute;
  background: white;
  border-radius: 50%;
  box-shadow: 0 0 6px 2px rgba(255, 255, 255, 0.5);
  will-change: opacity, transform;
}

// 数据流
.aurora-data-item {
  position: absolute;
  font-size: 14px;
  font-weight: 600;
  color: rgba(0, 255, 200, 0.7);
  text-shadow: 0 0 8px rgba(0, 255, 200, 0.8);
  font-family: 'Courier New', monospace;
  will-change: transform, opacity;
}

// 浮动粒子
.aurora-particle {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 255, 200, 0.8) 0%, transparent 70%);
  box-shadow: 0 0 10px rgba(0, 255, 200, 0.6);
  will-change: transform, opacity;
}

// 波浪层
.aurora-wave {
  position: absolute;
  bottom: 0;
  width: 200%;
  height: 200px;
  opacity: 0;
  will-change: transform;
}

.aurora-wave-1 {
  left: -50%;
  bottom: -50px;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(0, 255, 200, 0.15) 50%,
    rgba(0, 200, 255, 0.1) 100%
  );
  animation: wave-move-1 6s ease-in-out infinite;
}

.aurora-wave-2 {
  left: -30%;
  bottom: -80px;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(255, 0, 255, 0.1) 50%,
    rgba(255, 100, 200, 0.08) 100%
  );
  animation: wave-move-2 8s ease-in-out infinite;
}

.aurora-wave-3 {
  left: -60%;
  bottom: -100px;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(0, 100, 255, 0.12) 50%,
    rgba(0, 50, 200, 0.08) 100%
  );
  animation: wave-move-3 10s ease-in-out infinite;
}

@keyframes wave-move-1 {
  0%, 100% {
    transform: translateX(-10%) scaleY(1);
  }
  50% {
    transform: translateX(10%) scaleY(1.1);
  }
}

@keyframes wave-move-2 {
  0%, 100% {
    transform: translateX(15%) scaleY(1);
  }
  50% {
    transform: translateX(-15%) scaleY(0.9);
  }
}

@keyframes wave-move-3 {
  0%, 100% {
    transform: translateX(-5%);
  }
  50% {
    transform: translateX(5%);
  }
}

// 脉冲环
.aurora-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  border-radius: 50%;
  border: 2px solid rgba(0, 255, 200, 0.3);
  opacity: 0;
  will-change: transform, opacity;
}

.aurora-pulse-1 {
  width: 300px;
  height: 300px;
  border-color: rgba(0, 255, 200, 0.4);
  box-shadow:
    0 0 30px rgba(0, 255, 200, 0.2),
    inset 0 0 30px rgba(0, 255, 200, 0.1);
}

.aurora-pulse-2 {
  width: 450px;
  height: 450px;
  border-color: rgba(255, 0, 255, 0.3);
  box-shadow:
    0 0 40px rgba(255, 0, 255, 0.15),
    inset 0 0 40px rgba(255, 0, 255, 0.08);
}

.aurora-pulse-3 {
  width: 600px;
  height: 600px;
  border-color: rgba(100, 0, 255, 0.2);
  box-shadow:
    0 0 50px rgba(100, 0, 255, 0.1),
    inset 0 0 50px rgba(100, 0, 255, 0.05);
}

// 主内容
.aurora-content {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 60px 80px;
  box-sizing: border-box;
}

.aurora-header {
  text-align: center;
  margin-bottom: 60px;
}

.aurora-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  background: linear-gradient(135deg, rgba(0, 255, 200, 0.15) 0%, rgba(255, 0, 255, 0.1) 100%);
  border: 1px solid rgba(0, 255, 200, 0.3);
  border-radius: 30px;
  margin-bottom: 30px;
  backdrop-filter: blur(10px);

  .aurora-badge-icon {
    font-size: 18px;
    color: rgba(0, 255, 200, 0.9);
    animation: pulse-icon 2s ease-in-out infinite;
  }

  .aurora-badge-text {
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 3px;
    color: rgba(0, 255, 200, 0.95);
    text-shadow: 0 0 10px rgba(0, 255, 200, 0.5);
  }
}

@keyframes pulse-icon {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
}

.aurora-title {
  font-size: 72px;
  font-weight: 900;
  color: transparent;
  background: linear-gradient(135deg, #00ffc8 0%, #ff00ff 50%, #ffd700 100%);
  background-clip: text;
  -webkit-background-clip: text;
  margin: 0 0 20px;
  text-shadow: none;
  filter: drop-shadow(0 0 30px rgba(0, 255, 200, 0.4));
}

.aurora-subtitle {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 12px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 25px;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

.aurora-desc {
  font-size: 16px;
  line-height: 1.8;
  color: rgba(200, 220, 255, 0.85);
  max-width: 600px;
  margin: 0 auto;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

// 卡片网格
.aurora-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  width: 100%;
  max-width: 1400px;
  perspective: 1000px;
}

.aurora-card {
  position: relative;
  transform-style: preserve-3d;
  cursor: pointer;
  will-change: transform;

  .aurora-card-inner {
    position: relative;
    padding: 32px 28px;
    background: linear-gradient(
      145deg,
      rgba(20, 30, 60, 0.7) 0%,
      rgba(30, 20, 50, 0.6) 100%
    );
    border: 1px solid rgba(0, 255, 200, 0.15);
    border-radius: 20px;
    backdrop-filter: blur(20px);
    overflow: hidden;
    transition: border-color 0.3s ease;

    &:hover {
      border-color: rgba(0, 255, 200, 0.4);

      .aurora-card-glow {
        opacity: 1;
      }

      .aurora-card-title {
        color: #00ffc8;
      }

      .aurora-card-line {
        transform: scaleX(1);
      }
    }
  }

  .aurora-card-glow {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle at center,
      rgba(0, 255, 200, 0.15) 0%,
      transparent 50%
    );
    opacity: 0;
    transition: opacity 0.5s ease;
    pointer-events: none;
  }

  .aurora-card-id {
    display: block;
    font-size: 48px;
    font-weight: 900;
    color: rgba(0, 255, 200, 0.15);
    margin-bottom: 16px;
    font-family: 'Georgia', serif;
  }

  .aurora-card-title {
    font-size: 22px;
    font-weight: 700;
    color: #ffffff;
    margin: 0 0 8px;
    transition: color 0.3s ease;
    text-shadow: 0 0 20px rgba(0, 255, 200, 0.3);
  }

  .aurora-card-subtitle {
    display: block;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 2px;
    color: rgba(255, 0, 255, 0.8);
    margin-bottom: 16px;
  }

  .aurora-card-desc {
    font-size: 14px;
    line-height: 1.7;
    color: rgba(200, 220, 255, 0.75);
    margin: 0;
  }

  .aurora-card-line {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, #00ffc8, #ff00ff, #ffd700);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.5s ease;
  }
}

// 底部光芒
.aurora-bottom-glow {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 150px;
  background: linear-gradient(
    0deg,
    rgba(0, 255, 200, 0.2) 0%,
    transparent 100%
  );
  pointer-events: none;
}
</style>
