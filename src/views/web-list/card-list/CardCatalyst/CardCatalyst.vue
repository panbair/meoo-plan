<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void

const parent = ref<HTMLElement | null>(null)
const cleanupFns: TweenCleanup[] = []
let rippleAnims: gsap.core.Tween[] = []
let corePulseAnims: gsap.core.Tween[] = []
let arcAnims: gsap.core.Tween[] = []
let dataAnims: gsap.core.Tween[] = []
let particleAnims: gsap.core.Tween[] = []
let lineAnims: gsap.core.Tween[] = []

interface CardItem {
  id: string
  title: string
  subtitle: string
  description: string
  icon: string
  color: string
}

const cardData: CardItem[] = [
  {
    id: '01',
    title: '活化能',
    subtitle: 'ACTIVATION ENERGY',
    description: '跨越能垒，触发反应的第一步。足够的能量输入打破原有平衡。',
    icon: '⚡',
    color: '#22d3d3'
  },
  {
    id: '02',
    title: '催化剂',
    subtitle: 'CATALYST',
    description: '降低反应活化能，加速反应进程，自身不被消耗。',
    icon: '🔬',
    color: '#a855f7'
  },
  {
    id: '03',
    title: '链式反应',
    subtitle: 'CHAIN REACTION',
    description: '一个反应引发下一个，指数级增长，能量释放如星火燎原。',
    icon: '🔥',
    color: '#ff6b35'
  },
  {
    id: '04',
    title: '能量释放',
    subtitle: 'ENERGY RELEASE',
    description: '反应结束，能量以光、热、动能的形式释放到环境中。',
    icon: '💥',
    color: '#f472b6'
  }
]

const initAnimations = () => {
  if (!parent.value) return

  const tl = gsap.timeline()

  // ===== slide-up 入场 =====
  tl.fromTo(
    parent.value,
    { y: '100%', opacity: 0 },
    { y: 0, opacity: 1, duration: 1, ease: 'expo.out' }
  )

  // 背景网格线
  tl.fromTo(
    '.cat-line',
    { scaleX: 0, opacity: 0 },
    { scaleX: 1, opacity: 0.4, duration: 0.8, stagger: 0.05 },
    0.3
  )

  // 能量波纹
  tl.fromTo(
    '.cat-ripple',
    { scale: 0, opacity: 0 },
    { scale: 1, opacity: 1, duration: 1, stagger: 0.2 },
    0.5
  )

  // 脉冲核心
  tl.fromTo(
    '.cat-core',
    { scale: 0, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(2)' },
    0.7
  )

  // 数据流
  tl.fromTo(
    '.cat-data-item',
    { opacity: 0, y: -20 },
    { opacity: 1, y: 20, duration: 0.4, stagger: 0.02 },
    0.4
  )

  // 粒子入场
  tl.fromTo(
    '.cat-particle',
    { scale: 0, opacity: 0 },
    { scale: 1, opacity: 0.8, duration: 0.3, stagger: 0.015 },
    0.5
  )

  // 标题组
  tl.fromTo(
    '.cat-badge',
    { y: -30, opacity: 0, scale: 0.8 },
    { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.4)' },
    0.8
  )

  tl.fromTo(
    '.cat-title',
    { y: 60, opacity: 0, filter: 'blur(15px)' },
    { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.9, ease: 'power3.out' },
    0.9
  )

  tl.fromTo(
    '.cat-subtitle',
    { y: 40, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' },
    1.05
  )

  tl.fromTo(
    '.cat-desc',
    { y: 25, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
    1.15
  )

  // ===== 卡片错落依次入场 =====
  tl.fromTo(
    '.cat-card',
    (index) => ({
      y: 120,
      opacity: 0,
      rotation: index % 2 === 0 ? -6 : 6,
      scale: 0.8
    }),
    {
      y: 0,
      opacity: 1,
      rotation: 0,
      scale: 1,
      duration: 1,
      stagger: 0.15,
      ease: 'back.out(1.3)'
    },
    1.3
  )

  // 卡片图标
  tl.fromTo(
    '.cat-card-icon',
    { scale: 0, rotation: -180 },
    { scale: 1, rotation: 0, duration: 0.5, stagger: 0.15, ease: 'back.out(2)' },
    1.5
  )

  // 卡片内容
  tl.fromTo(
    '.cat-card-title',
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.4, stagger: 0.12 },
    1.6
  )

  tl.fromTo(
    '.cat-card-subtitle',
    { y: 12, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.35, stagger: 0.12 },
    1.65
  )

  tl.fromTo(
    '.cat-card-desc',
    { y: 12, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.35, stagger: 0.12 },
    1.7
  )

  // ===== 持续动画 =====

  // 能量波纹扩散
  gsap.utils.toArray<HTMLElement>('.cat-ripple').forEach((ripple) => {
    const anim = gsap.to(ripple, {
      scale: 2,
      opacity: 0,
      duration: 3,
      repeat: -1,
      ease: 'power1.out'
    })
    rippleAnims.push(anim)
  })

  // 脉冲核心
  const corePulseAnim = gsap.to('.cat-core-pulse', {
    scale: 1.4,
    opacity: 0.2,
    duration: 1.5,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  })
  corePulseAnims.push(corePulseAnim)

  // 电弧闪烁
  gsap.utils.toArray<HTMLElement>('.cat-arc').forEach((arc) => {
    const anim = gsap.to(arc, {
      opacity: 0.2 + Math.random() * 0.8,
      duration: 0.1 + Math.random() * 0.2,
      repeat: -1,
      yoyo: true,
      ease: 'steps(2)'
    })
    arcAnims.push(anim)
  })

  // 数据流下落
  gsap.utils.toArray<HTMLElement>('.cat-data-item').forEach((item) => {
    const anim = gsap.to(item, {
      y: '+=150vh',
      duration: 4 + Math.random() * 4,
      repeat: -1,
      ease: 'none'
    })
    dataAnims.push(anim)
  })

  // 粒子漂浮
  gsap.utils.toArray<HTMLElement>('.cat-particle').forEach((p) => {
    const anim = gsap.to(p, {
      y: `-=${20 + Math.random() * 50}`,
      x: `+=${(Math.random() - 0.5) * 30}`,
      scale: 0.4 + Math.random() * 0.8,
      opacity: 0.3 + Math.random() * 0.6,
      duration: 2 + Math.random() * 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
    particleAnims.push(anim)
  })

  // 网格线脉冲
  gsap.utils.toArray<HTMLElement>('.cat-line').forEach((line, i) => {
    const anim = gsap.to(line, {
      opacity: 0.2 + Math.random() * 0.3,
      duration: 1 + Math.random() * 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: i * 0.1
    })
    lineAnims.push(anim)
  })

  // ===== ScrollTrigger =====
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
  gsap.to(target, { y: -10, scale: 1.03, duration: 0.3, ease: 'power2.out' })
}

const onCardLeave = (event: MouseEvent) => {
  const target = event.currentTarget as HTMLElement
  gsap.to(target, { y: 0, scale: 1, duration: 0.4, ease: 'power2.out' })
}

// 网格线数据
const hLines = Array.from({ length: 12 }, (_, i) => i)
const vLines = Array.from({ length: 16 }, (_, i) => i)

// 数据流
const dataChars = '01能量化学催化反应链式!@#$%^&*()+-'
const dataItems = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  char: dataChars[Math.floor(Math.random() * dataChars.length)]
}))

// 粒子
const particles = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 2 + Math.random() * 4
}))

onMounted(() => {
  initAnimations()
})

onBeforeUnmount(() => {
  cleanupFns.forEach((fn) => fn())
  rippleAnims.forEach((a) => a.kill())
  corePulseAnims.forEach((a) => a.kill())
  arcAnims.forEach((a) => a.kill())
  dataAnims.forEach((a) => a.kill())
  particleAnims.forEach((a) => a.kill())
  lineAnims.forEach((a) => a.kill())
})
</script>

<template>
  <div ref="parent" class="cat-parent">
    <!-- 背景 -->
    <div class="cat-bg"></div>

    <!-- 网格线 -->
    <div
      v-for="i in hLines"
      :key="'hline-' + i"
      class="cat-line cat-hline"
      :style="{ top: `${(i / 12) * 100}%` }"
    ></div>
    <div
      v-for="i in vLines"
      :key="'vline-' + i"
      class="cat-line cat-vline"
      :style="{ left: `${(i / 16) * 100}%` }"
    ></div>

    <!-- 能量波纹 -->
    <div class="cat-ripple cat-ripple-1"></div>
    <div class="cat-ripple cat-ripple-2"></div>
    <div class="cat-ripple cat-ripple-3"></div>

    <!-- 脉冲核心 -->
    <div class="cat-core">
      <div class="cat-core-inner"></div>
      <div class="cat-core-pulse"></div>
    </div>

    <!-- 电弧 -->
    <div class="cat-arc cat-arc-1"></div>
    <div class="cat-arc cat-arc-2"></div>
    <div class="cat-arc cat-arc-3"></div>

    <!-- 数据流 -->
    <div
      v-for="item in dataItems"
      :key="'data-' + item.id"
      class="cat-data-item"
      :style="{ left: `${item.x}%`, top: `${item.y}%` }"
    >
      {{ item.char }}
    </div>

    <!-- 粒子 -->
    <div
      v-for="p in particles"
      :key="'particle-' + p.id"
      class="cat-particle"
      :style="{
        left: `${p.x}%`,
        top: `${p.y}%`,
        width: `${p.size}px`,
        height: `${p.size}px`
      }"
    ></div>

    <!-- 主内容 -->
    <div class="cat-content">
      <div class="cat-header">
        <div class="cat-badge">
          <span class="cat-badge-icon">⚡</span>
          <span class="cat-badge-text">CATALYST REACTION</span>
        </div>
        <h1 class="cat-title">催化反应</h1>
        <p class="cat-subtitle">触发连锁 · 释放能量</p>
        <p class="cat-desc">
          催化剂降低反应活化能，让原本缓慢的过程瞬间加速。就像人生中的机遇，一旦触发，将释放无限可能。
        </p>
      </div>

      <div class="cat-cards">
        <div
          v-for="card in cardData"
          :key="card.id"
          class="cat-card"
          :style="{ '--card-color': card.color }"
          @mouseenter="onCardHover"
          @mouseleave="onCardLeave"
        >
          <div class="cat-card-bg"></div>
          <div class="cat-card-glow"></div>
          <span class="cat-card-icon">{{ card.icon }}</span>
          <span class="cat-card-id">{{ card.id }}</span>
          <h3 class="cat-card-title">{{ card.title }}</h3>
          <span class="cat-card-subtitle">{{ card.subtitle }}</span>
          <p class="cat-card-desc">{{ card.description }}</p>
          <div class="cat-card-line"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cat-parent {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #0a0a0f;
  isolation: isolate;
}

.cat-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 50% 50%, rgba(168, 85, 247, 0.1) 0%, transparent 50%),
    radial-gradient(ellipse at 30% 30%, rgba(34, 211, 211, 0.06) 0%, transparent 40%),
    radial-gradient(ellipse at 70% 70%, rgba(255, 107, 53, 0.05) 0%, transparent 40%);
}

// 网格线
.cat-line {
  position: absolute;
  background: linear-gradient(90deg, transparent, rgba(34, 211, 211, 0.4), transparent);
  transform-origin: left center;
  will-change: opacity;
}

.cat-hline {
  width: 100%;
  height: 1px;
  transform: scaleX(0);
}

.cat-vline {
  width: 1px;
  height: 100%;
  background: linear-gradient(180deg, transparent, rgba(168, 85, 247, 0.3), transparent);
  transform-origin: top center;
}

// 能量波纹
.cat-ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  border: 2px solid rgba(34, 211, 211, 0.4);
  transform: translate(-50%, -50%) scale(0);
  pointer-events: none;
}

.cat-ripple-1 {
  width: 200px;
  height: 200px;
  border-color: rgba(34, 211, 211, 0.5);
}

.cat-ripple-2 {
  width: 350px;
  height: 350px;
  border-color: rgba(168, 85, 247, 0.35);
}

.cat-ripple-3 {
  width: 500px;
  height: 500px;
  border-color: rgba(255, 107, 53, 0.25);
}

// 脉冲核心
.cat-core {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80px;
  height: 80px;
  transform: translate(-50%, -50%);
}

.cat-core-inner {
  position: absolute;
  inset: 20px;
  background: radial-gradient(circle, #22d3d3 0%, #a855f7 60%, transparent 80%);
  border-radius: 50%;
  box-shadow:
    0 0 50px rgba(34, 211, 211, 0.8),
    0 0 80px rgba(168, 85, 247, 0.4);
}

.cat-core-pulse {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(34, 211, 211, 0.5) 0%, transparent 70%);
  box-shadow: 0 0 60px rgba(34, 211, 211, 0.5);
}

// 电弧
.cat-arc {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 150px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #22d3d3, #a855f7, transparent);
  transform-origin: left center;
  opacity: 0.6;
}

.cat-arc-1 {
  transform: translate(-50%, -50%) rotate(0deg);
}

.cat-arc-2 {
  transform: translate(-50%, -50%) rotate(120deg);
  background: linear-gradient(90deg, transparent, #a855f7, #ff6b35, transparent);
}

.cat-arc-3 {
  transform: translate(-50%, -50%) rotate(240deg);
  background: linear-gradient(90deg, transparent, #ff6b35, #22d3d3, transparent);
}

// 数据流
.cat-data-item {
  position: absolute;
  font-size: 12px;
  font-weight: 600;
  color: rgba(34, 211, 211, 0.6);
  text-shadow: 0 0 6px rgba(34, 211, 211, 0.8);
  font-family: 'Courier New', monospace;
}

// 粒子
.cat-particle {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(168, 85, 247, 0.9) 0%, transparent 70%);
  box-shadow: 0 0 6px rgba(168, 85, 247, 0.5);
}

// 主内容
.cat-content {
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

.cat-header {
  text-align: center;
  margin-bottom: 50px;
}

.cat-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 24px;
  background: linear-gradient(135deg, rgba(34, 211, 211, 0.15) 0%, rgba(168, 85, 247, 0.12) 100%);
  border: 1px solid rgba(34, 211, 211, 0.3);
  border-radius: 30px;
  margin-bottom: 24px;

  .cat-badge-icon {
    font-size: 16px;
  }

  .cat-badge-text {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 3px;
    color: #22d3d3;
  }
}

.cat-title {
  font-size: 60px;
  font-weight: 900;
  color: transparent;
  background: linear-gradient(135deg, #22d3d3 0%, #a855f7 50%, #ff6b35 100%);
  background-clip: text;
  -webkit-background-clip: text;
  margin: 0 0 12px;
  filter: drop-shadow(0 0 30px rgba(34, 211, 211, 0.4));
}

.cat-subtitle {
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 8px;
  color: rgba(168, 85, 247, 0.9);
  margin: 0 0 18px;
}

.cat-desc {
  font-size: 15px;
  line-height: 1.8;
  color: rgba(200, 210, 230, 0.75);
  max-width: 560px;
  margin: 0 auto;
}

// 卡片
.cat-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 22px;
  width: 100%;
  max-width: 1240px;
  perspective: 1000px;
}

.cat-card {
  --card-color: #22d3d3;
  position: relative;
  padding: 30px 24px;
  border-radius: 18px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.3s ease;

  .cat-card-bg {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      145deg,
      rgba(15, 18, 28, 0.95) 0%,
      rgba(20, 15, 30, 0.92) 100%
    );
    border-radius: 18px;
    border: 1px solid rgba(255, 255, 255, 0.06);
  }

  .cat-card-glow {
    position: absolute;
    inset: -40%;
    background: radial-gradient(
      circle at 50% 100%,
      var(--card-color) 0%,
      transparent 50%
    );
    opacity: 0.08;
    transition: opacity 0.4s ease;
    pointer-events: none;
  }

  &:hover {
    .cat-card-glow {
      opacity: 0.2;
    }

    .cat-card-title {
      color: var(--card-color);
    }

    .cat-card-line {
      width: 100%;
    }

    .cat-card-icon {
      transform: scale(1.2) rotate(15deg);
    }
  }

  .cat-card-icon {
    display: block;
    font-size: 36px;
    margin-bottom: 18px;
    transition: transform 0.35s ease;
  }

  .cat-card-id {
    display: block;
    font-size: 40px;
    font-weight: 900;
    color: rgba(255, 255, 255, 0.05);
    margin-bottom: 10px;
    font-family: Georgia, serif;
    line-height: 1;
  }

  .cat-card-title {
    font-size: 20px;
    font-weight: 700;
    color: #ffffff;
    margin: 0 0 6px;
    transition: color 0.3s ease;
  }

  .cat-card-subtitle {
    display: block;
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 1.5px;
    color: var(--card-color);
    margin-bottom: 14px;
    opacity: 0.9;
  }

  .cat-card-desc {
    font-size: 13px;
    line-height: 1.7;
    color: rgba(200, 210, 230, 0.7);
    margin: 0;
  }

  .cat-card-line {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 40px;
    height: 2px;
    background: var(--card-color);
    transition: width 0.4s ease;
  }
}
</style>
