<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void

const parent = ref<HTMLElement | null>(null)
const cleanupFns: TweenCleanup[] = []

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
    title: '引力透镜',
    subtitle: 'GRAVITATIONAL LENSING',
    description: '质量巨大的天体弯曲周围时空，使后方光线偏折形成爱因斯坦环',
    icon: '◐',
    color: '#00f5d4'
  },
  {
    id: '02',
    title: '暗物质晕',
    subtitle: 'DARK MATTER HALO',
    description: '不可见的暗物质包裹着星系，提供额外的引力束缚',
    icon: '◑',
    color: '#f9c846'
  },
  {
    id: '03',
    title: '引力红移',
    subtitle: 'GRAVITATIONAL REDSHIFT',
    description: '光从强引力场中逃逸时波长拉长，频率降低的现象',
    icon: '◒',
    color: '#a78bfa'
  },
  {
    id: '04',
    title: '潮汐力',
    subtitle: 'TIDAL FORCE',
    description: '天体不同部位受到的引力差异导致拉伸和挤压效应',
    icon: '◓',
    color: '#ff6b6b'
  }
]

const initAnimations = () => {
  if (!parent.value) return

  const tl = gsap.timeline()

  // ===== roll-up 入场动画 =====
  // 整体容器从下方滚入
  tl.fromTo(
    parent.value,
    {
      y: '100%',
      rotation: -10,
      opacity: 0
    },
    {
      y: 0,
      rotation: 0,
      opacity: 1,
      duration: 1,
      ease: 'expo.out'
    }
  )

  // 星星从透明到可见
  tl.fromTo(
    '.g2-star',
    { opacity: 0, scale: 0 },
    { opacity: 1, scale: 1, duration: 0.4, stagger: 0.01 },
    0.2
  )

  // 引力环依次放大入场
  tl.fromTo(
    '.g2-ring',
    { scale: 0, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'back.out(1.5)' },
    0.4
  )

  // 中心核心弹入
  tl.fromTo(
    '.g2-core',
    { scale: 0, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(2)' },
    0.7
  )

  // 粒子淡入
  tl.fromTo(
    '.g2-particle',
    { opacity: 0, scale: 0 },
    { opacity: 0.8, scale: 1, duration: 0.3, stagger: 0.02 },
    0.5
  )

  // 标题组入场
  tl.fromTo(
    '.g2-badge',
    { y: -30, opacity: 0, scale: 0.8 },
    { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.4)' },
    0.6
  )

  tl.fromTo(
    '.g2-title',
    { y: 50, opacity: 0, filter: 'blur(10px)' },
    { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' },
    0.7
  )

  tl.fromTo(
    '.g2-subtitle',
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
    0.85
  )

  tl.fromTo(
    '.g2-desc',
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
    0.95
  )

  // ===== 卡片错落依次入场 =====
  tl.fromTo(
    '.g2-card',
    (index) => ({
      y: 100,
      opacity: 0,
      rotation: index % 2 === 0 ? -8 : 8,
      scale: 0.85
    }),
    {
      y: 0,
      opacity: 1,
      rotation: 0,
      scale: 1,
      duration: 0.9,
      stagger: 0.15,
      ease: 'back.out(1.2)'
    },
    1.1
  )

  // 卡片图标旋转弹入
  tl.fromTo(
    '.g2-card-icon',
    { scale: 0, rotation: -180 },
    { scale: 1, rotation: 0, duration: 0.5, stagger: 0.15, ease: 'back.out(2)' },
    1.3
  )

  // 卡片内容依次显现
  tl.fromTo(
    '.g2-card-title',
    { y: 15, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.4, stagger: 0.12 },
    1.4
  )

  tl.fromTo(
    '.g2-card-subtitle',
    { y: 10, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.35, stagger: 0.12 },
    1.45
  )

  tl.fromTo(
    '.g2-card-desc',
    { y: 10, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.35, stagger: 0.12 },
    1.5
  )

  // ===== 持续动画 =====
  // 引力环旋转
  gsap.to('.g2-ring-1', { rotation: 360, duration: 25, repeat: -1, ease: 'none' })
  gsap.to('.g2-ring-2', { rotation: -360, duration: 30, repeat: -1, ease: 'none' })
  gsap.to('.g2-ring-3', { rotation: 360, duration: 35, repeat: -1, ease: 'none' })

  // 核心脉动
  gsap.to('.g2-core-pulse', {
    scale: 1.3,
    opacity: 0.3,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  })

  // 星星闪烁
  gsap.utils.toArray<HTMLElement>('.g2-star').forEach((star) => {
    gsap.to(star, {
      opacity: 0.3 + Math.random() * 0.7,
      scale: 0.6 + Math.random() * 0.8,
      duration: 1.5 + Math.random() * 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
  })

  // 粒子漂浮
  gsap.utils.toArray<HTMLElement>('.g2-particle').forEach((p) => {
    gsap.to(p, {
      y: `-=${20 + Math.random() * 40}`,
      x: `+=${(Math.random() - 0.5) * 20}`,
      scale: 0.5 + Math.random() * 0.5,
      opacity: 0.3 + Math.random() * 0.5,
      duration: 2 + Math.random() * 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
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
  gsap.to(target, { y: -8, scale: 1.02, duration: 0.3, ease: 'power2.out' })
}

const onCardLeave = (event: MouseEvent) => {
  const target = event.currentTarget as HTMLElement
  gsap.to(target, { y: 0, scale: 1, duration: 0.4, ease: 'power2.out' })
}

// 星星数据
const stars = Array.from({ length: 100 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  top: Math.random() * 100,
  size: 1 + Math.random() * 2
}))

// 粒子数据
const particles = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  top: Math.random() * 100,
  size: 2 + Math.random() * 3
}))

onMounted(() => {
  initAnimations()
})

onUnmounted(() => {
  cleanupFns.forEach((fn) => fn())
})
</script>

<template>
  <div ref="parent" class="g2-parent">
    <!-- 星星背景 -->
    <div
      v-for="star in stars"
      :key="'star-' + star.id"
      class="g2-star"
      :style="{
        left: `${star.left}%`,
        top: `${star.top}%`,
        width: `${star.size}px`,
        height: `${star.size}px`
      }"
    ></div>

    <!-- 引力环 -->
    <div class="g2-ring g2-ring-1"></div>
    <div class="g2-ring g2-ring-2"></div>
    <div class="g2-ring g2-ring-3"></div>

    <!-- 中心核心 -->
    <div class="g2-core">
      <div class="g2-core-inner"></div>
      <div class="g2-core-pulse"></div>
    </div>

    <!-- 漂浮粒子 -->
    <div
      v-for="p in particles"
      :key="'particle-' + p.id"
      class="g2-particle"
      :style="{
        left: `${p.left}%`,
        top: `${p.top}%`,
        width: `${p.size}px`,
        height: `${p.size}px`
      }"
    ></div>

    <!-- 主内容 -->
    <div class="g2-content">
      <div class="g2-header">
        <div class="g2-badge">
          <span class="g2-badge-icon">⚛</span>
          <span class="g2-badge-text">GRAVITY FIELD</span>
        </div>
        <h1 class="g2-title">引力场效应</h1>
        <p class="g2-subtitle">探索宇宙最深层的奥秘</p>
        <p class="g2-desc">
          引力是宇宙中最普遍也最神秘的力量。从苹果落地到星系旋转，从黑洞形成到宇宙膨胀，引力支配着万物运行的法则。
        </p>
      </div>

      <div class="g2-cards">
        <div
          v-for="card in cardData"
          :key="card.id"
          class="g2-card"
          :style="{ '--card-color': card.color }"
          @mouseenter="onCardHover"
          @mouseleave="onCardLeave"
        >
          <span class="g2-card-icon">{{ card.icon }}</span>
          <span class="g2-card-id">{{ card.id }}</span>
          <h3 class="g2-card-title">{{ card.title }}</h3>
          <span class="g2-card-subtitle">{{ card.subtitle }}</span>
          <p class="g2-card-desc">{{ card.description }}</p>
          <div class="g2-card-line"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.g2-parent {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #0a0a1a;
  isolation: isolate;
}

.g2-star {
  position: absolute;
  z-index: 1;
  background: white;
  border-radius: 50%;
  box-shadow: 0 0 4px 1px rgba(255, 255, 255, 0.5);
}

.g2-ring {
  position: absolute;
  z-index: 2;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  border: 1px solid rgba(0, 245, 212, 0.2);
  transform: translate(-50%, -50%) scale(0);
}

.g2-ring-1 {
  width: 320px;
  height: 320px;
  box-shadow: 0 0 30px rgba(0, 245, 212, 0.15);
}

.g2-ring-2 {
  width: 480px;
  height: 480px;
  border-style: dashed;
  border-color: rgba(167, 139, 250, 0.15);
  box-shadow: 0 0 40px rgba(167, 139, 250, 0.1);
}

.g2-ring-3 {
  width: 640px;
  height: 640px;
  border-color: rgba(249, 200, 70, 0.1);
  box-shadow: 0 0 50px rgba(249, 200, 70, 0.08);
}

.g2-core {
  position: absolute;
  z-index: 3;
  top: 50%;
  left: 50%;
  width: 80px;
  height: 80px;
  transform: translate(-50%, -50%);
}

.g2-core-inner {
  position: absolute;
  inset: 20px;
  background: radial-gradient(circle, #00f5d4 0%, #00a896 60%, transparent 80%);
  border-radius: 50%;
  box-shadow: 0 0 40px rgba(0, 245, 212, 0.8);
}

.g2-core-pulse {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 245, 212, 0.5) 0%, transparent 70%);
  box-shadow: 0 0 60px rgba(0, 245, 212, 0.5);
}

.g2-particle {
  position: absolute;
  z-index: 2;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(167, 139, 250, 0.8) 0%, transparent 70%);
  box-shadow: 0 0 6px rgba(167, 139, 250, 0.4);
}

.g2-content {
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

.g2-header {
  text-align: center;
  margin-bottom: 50px;
}

.g2-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 24px;
  background: rgba(0, 245, 212, 0.1);
  border: 1px solid rgba(0, 245, 212, 0.3);
  border-radius: 30px;
  margin-bottom: 24px;

  .g2-badge-icon {
    font-size: 16px;
  }

  .g2-badge-text {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 3px;
    color: #00f5d4;
  }
}

.g2-title {
  font-size: 56px;
  font-weight: 900;
  color: #ffffff;
  margin: 0 0 12px;
  text-shadow: 0 0 40px rgba(0, 245, 212, 0.5);
}

.g2-subtitle {
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 6px;
  color: rgba(167, 139, 250, 0.9);
  margin: 0 0 18px;
  text-transform: uppercase;
}

.g2-desc {
  font-size: 14px;
  line-height: 1.8;
  color: rgba(200, 210, 230, 0.75);
  max-width: 540px;
  margin: 0 auto;
}

.g2-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  width: 100%;
  max-width: 1200px;
}

.g2-card {
  --card-color: #00f5d4;
  position: relative;
  padding: 28px 22px;
  background: rgba(15, 18, 30, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  cursor: pointer;
  transition: border-color 0.3s ease, background 0.3s ease;

  &:hover {
    background: rgba(20, 25, 40, 0.95);
    border-color: var(--card-color);

    .g2-card-title {
      color: var(--card-color);
    }

    .g2-card-line {
      width: 100%;
    }

    .g2-card-icon {
      transform: scale(1.15) rotate(10deg);
    }
  }

  .g2-card-icon {
    display: block;
    font-size: 32px;
    margin-bottom: 16px;
    color: var(--card-color);
    transition: transform 0.3s ease;
  }

  .g2-card-id {
    display: block;
    font-size: 36px;
    font-weight: 900;
    color: rgba(255, 255, 255, 0.06);
    margin-bottom: 8px;
    font-family: Georgia, serif;
    line-height: 1;
  }

  .g2-card-title {
    font-size: 18px;
    font-weight: 700;
    color: #ffffff;
    margin: 0 0 5px;
    transition: color 0.3s ease;
  }

  .g2-card-subtitle {
    display: block;
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 1.5px;
    color: var(--card-color);
    margin-bottom: 12px;
    opacity: 0.9;
  }

  .g2-card-desc {
    font-size: 12px;
    line-height: 1.65;
    color: rgba(200, 210, 230, 0.7);
    margin: 0;
  }

  .g2-card-line {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 35px;
    height: 2px;
    background: var(--card-color);
    transition: width 0.35s ease;
  }
}
</style>
