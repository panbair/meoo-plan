<template>
  <div ref="sectionRef" class="card-spiral-section">
    <!-- 3D 视口容器 -->
    <div ref="viewportRef" class="spiral-viewport">
      <!-- 螺旋舞台 -->
      <div ref="stageRef" class="spiral-stage">
        <div
          v-for="(card, i) in spiralCards"
          :key="'spiral-card-' + i"
          :ref="el => cardRefs.set(i, el as HTMLElement)"
          class="spiral-card"
          :style="{ '--i': i, '--card-hue': card.hue }"
        >
          <div class="card-glow"></div>
          <div class="card-content">
            <div class="card-icon">{{ card.icon }}</div>
            <div class="card-title">{{ card.title }}</div>
            <div class="card-subtitle">{{ card.subtitle }}</div>
            <div class="card-energy">
              <div class="energy-line" :style="{ width: card.energy + '%' }"></div>
            </div>
          </div>
          <div class="card-shine"></div>
        </div>
      </div>
    </div>

    <!-- 标题区域 -->
    <div ref="headerRef" class="spiral-header">
      <div ref="badgeRef" class="header-badge">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
      </div>
      <h2 ref="titleRef" class="spiral-title">光之螺旋</h2>
      <p ref="subtitleRef" class="spiral-subtitle">SPIRAL ASCENSION · 环形阶梯上升</p>
    </div>

    <!-- 滚动提示 -->
    <div ref="scrollHintRef" class="scroll-hint">
      <div class="hint-line"></div>
      <span>滚动探索</span>
      <div class="hint-line"></div>
    </div>

    <!-- 装饰元素 -->
    <div class="spiral-decorations">
      <div class="orbit-ring ring-1"></div>
      <div class="orbit-ring ring-2"></div>
      <div class="orbit-ring ring-3"></div>
    </div>

    <!-- 底部信息 -->
    <div ref="footerRef" class="spiral-footer">
      <span>CardTimeSpiral</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []

// DOM refs
const sectionRef = ref<HTMLElement | null>(null)
const viewportRef = ref<HTMLElement | null>(null)
const stageRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const badgeRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const scrollHintRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const cardRefs = ref(new Map<number, HTMLElement>())

// 螺旋卡片数据
const spiralCards = [
  { title: '起源', subtitle: 'Origin', icon: '✦', hue: 280, energy: 92 },
  { title: '混沌', subtitle: 'Chaos', icon: '◈', hue: 200, energy: 78 },
  { title: '秩序', subtitle: 'Order', icon: '◇', hue: 160, energy: 85 },
  { title: '光芒', subtitle: 'Light', icon: '❖', hue: 45, energy: 95 },
  { title: '生命', subtitle: 'Life', icon: '✧', hue: 320, energy: 88 },
  { title: '意识', subtitle: 'Mind', icon: '✴', hue: 60, energy: 91 },
]

const RADIUS = 320
const ANGLE_STEP = 60
const VERTICAL_STEP = 60

const initSpiralLayout = () => {
  if (!stageRef.value) return

  const cards = Array.from(cardRefs.value.values())
  const totalCards = cards.length

  cards.forEach((card, i) => {
    const angle = i * ANGLE_STEP
    const yOffset = i * VERTICAL_STEP - (totalCards * VERTICAL_STEP) / 2

    gsap.set(card, {
      rotationY: angle,
      x: Math.sin((angle * Math.PI) / 180) * RADIUS,
      y: yOffset,
      z: Math.cos((angle * Math.PI) / 180) * RADIUS + RADIUS,
    })
  })
}

const initAnimations = () => {
  if (!sectionRef.value || !viewportRef.value || !stageRef.value) return

  // 标题入场动画
  if (headerRef.value) {
    gsap.from(headerRef.value, {
      y: 40,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
    })
  }

  // 滚动提示动画
  if (scrollHintRef.value) {
    gsap.from(scrollHintRef.value, {
      y: 20,
      opacity: 0,
      duration: 0.8,
      delay: 0.5,
    })
    gsap.to('.hint-line', {
      scaleY: 0.5,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: 0.2,
    })
  }

  // 卡片浮动动画
  const cards = Array.from(cardRefs.value.values())
  cards.forEach((card, i) => {
    const floatTL = gsap.timeline({
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })

    floatTL.to(card, {
      y: `+=${Math.sin(i) * 15}`,
      duration: 2 + Math.random(),
      ease: 'sine.inOut',
    })

    cleanupFns.push(() => floatTL.kill())
  })

  // 3D 螺旋旋转动画 - 核心效果
  const spiralTL = gsap.timeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.5,
    },
  })

  spiralTL.to(stageRef.value, {
    rotationY: 360,
    y: -300,
    ease: 'none',
  })

  cleanupFns.push(() => spiralTL.kill())

  // 卡片高光追踪
  const highlightTL = gsap.timeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
    },
  })

  cards.forEach((card, i) => {
    const phase = i / cards.length
    highlightTL.to(card.querySelector('.card-glow'), {
      opacity: 0.8,
      scale: 1.2,
      duration: 0.5,
    }, phase * 0.3)
  })

  cleanupFns.push(() => highlightTL.kill())

  // 装饰轨道旋转
  gsap.to('.orbit-ring.ring-1', {
    rotation: 360,
    duration: 20,
    repeat: -1,
    ease: 'none',
  })
  gsap.to('.orbit-ring.ring-2', {
    rotation: -360,
    duration: 25,
    repeat: -1,
    ease: 'none',
  })
  gsap.to('.orbit-ring.ring-3', {
    rotation: 360,
    duration: 30,
    repeat: -1,
    ease: 'none',
  })
}

onMounted(() => {
  // 延迟初始化以确保懒加载时 DOM 已完全渲染
  initSpiralLayout()
  setTimeout(initAnimations, 100)
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style lang="scss" scoped>
.card-spiral-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: radial-gradient(ellipse at center, #0a0f1e 0%, #02040a 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1400px;
  perspective-origin: 50% 50%;

  .spiral-viewport {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    perspective: 1400px;
  }

  .spiral-stage {
    position: relative;
    width: 0;
    height: 0;
    transform-style: preserve-3d;
    transform: rotateY(0deg) translateY(0);
  }

  .spiral-card {
    position: absolute;
    width: 200px;
    height: 120px;
    margin-left: -100px;
    margin-top: -60px;
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    transform-style: preserve-3d;
    cursor: pointer;
    overflow: hidden;
    transition: border-color 0.3s;

    &:hover {
      border-color: rgba(255, 255, 255, 0.3);

      .card-shine {
        opacity: 1;
      }
    }

    .card-glow {
      position: absolute;
      inset: -50%;
      background: radial-gradient(
        circle at center,
        hsla(var(--card-hue), 80%, 60%, 0.3) 0%,
        transparent 70%
      );
      opacity: 0;
      transform: scale(0.8);
      transition: opacity 0.3s;
      pointer-events: none;
    }

    .card-content {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      padding: 16px;
      text-align: center;
      transform: translateZ(30px);
    }

    .card-icon {
      font-size: 28px;
      margin-bottom: 8px;
      color: hsl(var(--card-hue), 80%, 70%);
    }

    .card-title {
      font-size: 18px;
      font-weight: 600;
      color: #fff;
      letter-spacing: 2px;
      margin-bottom: 4px;
    }

    .card-subtitle {
      font-size: 11px;
      color: rgba(255, 255, 255, 0.5);
      letter-spacing: 3px;
      text-transform: uppercase;
      margin-bottom: 12px;
    }

    .card-energy {
      width: 80%;
      height: 2px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 1px;
      overflow: hidden;

      .energy-line {
        height: 100%;
        background: linear-gradient(
          90deg,
          hsl(var(--card-hue), 80%, 50%),
          hsl(var(--card-hue), 80%, 70%)
        );
        border-radius: 1px;
      }
    }

    .card-shine {
      position: absolute;
      top: 0;
      left: -100%;
      width: 50%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.1),
        transparent
      );
      transform: skewX(-20deg);
      opacity: 0;
      transition: opacity 0.3s;
    }
  }

  .spiral-header {
    position: absolute;
    top: 60px;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    z-index: 10;

    .header-badge {
      width: 40px;
      height: 40px;
      margin: 0 auto 16px;
      color: rgba(255, 255, 255, 0.6);

      svg {
        width: 100%;
        height: 100%;
      }
    }

    .spiral-title {
      font-size: 48px;
      font-weight: 700;
      color: #fff;
      letter-spacing: 8px;
      margin: 0 0 12px;
      background: linear-gradient(135deg, #fff, rgba(255, 255, 255, 0.6));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .spiral-subtitle {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.4);
      letter-spacing: 4px;
      margin: 0;
    }
  }

  .scroll-hint {
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 16px;
    color: rgba(255, 255, 255, 0.4);
    font-size: 11px;
    letter-spacing: 2px;
    z-index: 10;

    .hint-line {
      width: 40px;
      height: 1px;
      background: rgba(255, 255, 255, 0.3);
      transform-origin: center;
    }
  }

  .spiral-decorations {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;

    .orbit-ring {
      position: absolute;
      left: 50%;
      top: 50%;
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 50%;
      transform: translate(-50%, -50%);

      &.ring-1 {
        width: 600px;
        height: 600px;
      }

      &.ring-2 {
        width: 800px;
        height: 800px;
        border-style: dashed;
      }

      &.ring-3 {
        width: 1000px;
        height: 1000px;
      }
    }
  }

  .spiral-footer {
    position: absolute;
    bottom: 20px;
    right: 30px;
    font-size: 11px;
    color: rgba(255, 255, 255, 0.2);
    letter-spacing: 1px;
    z-index: 10;
  }
}
</style>
