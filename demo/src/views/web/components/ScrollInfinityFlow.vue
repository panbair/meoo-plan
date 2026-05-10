<template>
  <div ref="containerRef" class="infinity-flow-container">
    <!-- 背景动态网格 -->
    <div class="grid-background">
      <div class="grid-line" v-for="i in 20" :key="i" :style="getGridStyle(i)"></div>
    </div>

    <!-- 标题区域 -->
    <div class="hero-section">
      <h1 class="hero-title">
        <span class="title-line title-line-1">无限</span>
        <span class="title-line title-line-2">流畅</span>
        <span class="title-line title-line-3">动效</span>
      </h1>
      <p class="hero-subtitle">INFINITE FLOW ANIMATION</p>
      <div class="hero-divider"></div>
    </div>

    <!-- 卡片展示区 -->
    <div class="cards-wrapper">
      <div
        v-for="(card, index) in cards"
        :key="card.id"
        ref="cardRefs"
        class="flow-card"
        :class="`card-${index}`"
        :style="getCardStyle(index)"
      >
        <!-- 卡片内容 -->
        <div class="card-inner">
          <div class="card-glow" :style="getGlowStyle(index)"></div>
          <div class="card-number">{{ String(index + 1).padStart(2, '0') }}</div>
          <h3 class="card-title">{{ card.title }}</h3>
          <p class="card-description">{{ card.description }}</p>
          <div class="card-icon">{{ card.icon }}</div>
        </div>

        <!-- 装饰粒子 -->
        <div class="card-particles">
          <div
            v-for="i in 8"
            :key="i"
            class="particle"
            :style="getParticleStyle(index, i)"
          ></div>
        </div>
      </div>
    </div>

    <!-- 底部进度指示器 -->
    <div class="progress-indicator">
      <div class="progress-bar" ref="progressBarRef">
        <div class="progress-fill" ref="progressFillRef"></div>
        <div class="progress-glow"></div>
      </div>
      <div class="progress-text">
        <span class="progress-current">{{ currentProgress }}</span>
        <span class="progress-total">/ 100</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// refs
const containerRef = ref<HTMLElement | null>(null)
const cardRefs = ref<HTMLElement[]>([])
const progressBarRef = ref<HTMLElement | null>(null)
const progressFillRef = ref<HTMLElement | null>(null)

// 状态
const currentProgress = ref(0)

// 卡片数据
const cards = [
  { id: 1, title: '流体变形', description: 'Fluid Morph', icon: '🌊' },
  { id: 2, title: '光晕粒子', description: 'Glow Particles', icon: '✨' },
  { id: 3, title: '弹性回弹', description: 'Elastic Bounce', icon: '🎯' },
  { id: 4, title: '透视穿梭', description: 'Perspective Warp', icon: '🔮' },
  { id: 5, title: '磁力吸附', description: 'Magnetic Pull', icon: '🧲' },
  { id: 6, title: '量子纠缠', description: 'Quantum Entangle', icon: '⚛️' },
]

// GSAP 上下文
let ctx: gsap.Context | null = null

// 获取网格样式
const getGridStyle = (index: number) => {
  return {
    top: `${index * 5}%`,
    animationDelay: `${index * 0.2}s`,
    opacity: 0.03 + Math.random() * 0.05
  }
}

// 获取卡片样式
const getCardStyle = (index: number) => {
  const hue = 220 + index * 25
  return {
    '--card-hue': hue
  }
}

// 获取发光样式
const getGlowStyle = (index: number) => {
  const hue = 220 + index * 25
  return {
    background: `radial-gradient(circle at 50% 50%, hsla(${hue}, 80%, 60%, 0.15), transparent 70%)`
  }
}

// 获取粒子样式
const getParticleStyle = (cardIndex: number, particleIndex: number) => {
  const hue = 220 + cardIndex * 25
  const angle = (particleIndex / 8) * 360
  return {
    '--particle-hue': hue,
    '--particle-angle': angle,
    animationDelay: `${particleIndex * 0.1}s`
  }
}

// 初始化动画
const initAnimations = () => {
  if (!containerRef.value || !progressBarRef.value || !progressFillRef.value) return

  ctx = gsap.context(() => {
    // 1. 标题入场动画 - 从不同方向飞入
    gsap.from('.title-line-1', {
      x: -100,
      y: 50,
      opacity: 0,
      rotationY: -30,
      duration: 1.2,
      ease: 'power3.out'
    })

    gsap.from('.title-line-2', {
      y: -80,
      opacity: 0,
      scale: 1.3,
      duration: 1.4,
      ease: 'power3.out',
      delay: 0.2
    })

    gsap.from('.title-line-3', {
      x: 100,
      y: 50,
      opacity: 0,
      rotationY: 30,
      duration: 1.2,
      ease: 'power3.out',
      delay: 0.4
    })

    gsap.from('.hero-subtitle', {
      y: 30,
      opacity: 0,
      duration: 1,
      ease: 'power2.out',
      delay: 0.6
    })

    gsap.from('.hero-divider', {
      width: 0,
      duration: 1.5,
      ease: 'power3.inOut',
      delay: 0.8
    })

    // 2. 卡片入场动画 - 交错飞入
    gsap.from('.flow-card', {
      y: (index) => 150 + index * 20,
      opacity: 0,
      rotationX: 45,
      rotationY: (index) => (index % 2 === 0 ? -15 : 15),
      scale: 0.8,
      duration: 1.2,
      stagger: 0.15,
      ease: 'back.out(1.3)',
      scrollTrigger: {
        trigger: '.cards-wrapper',
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
      }
    })

    // 3. 卡片滚动视差 - 不同速度
    cardRefs.value.forEach((card, index) => {
      gsap.to(card, {
        y: -50 - index * 20,
        rotationX: -15,
        rotationY: index % 2 === 0 ? 10 : -10,
        scale: 1.05,
        duration: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5 - index * 0.1  // 不同的滚动速度
        }
      })
    })

    // 4. 卡片悬停效果 - 3D 翻转
    cardRefs.value.forEach((card, index) => {
      const cardInner = card.querySelector('.card-inner') as HTMLElement

      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -30,
          scale: 1.08,
          rotationY: 10,
          duration: 0.5,
          ease: 'power2.out'
        })

        gsap.to(cardInner, {
          rotationX: -10,
          rotationY: 5,
          duration: 0.5,
          ease: 'power2.out'
        })
      })

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          rotationY: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.4)'
        })

        gsap.to(cardInner, {
          rotationX: 0,
          rotationY: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.4)'
        })
      })
    })

    // 5. 粒子持续动画
    gsap.to('.particle', {
      scale: 1.5,
      opacity: 0.8,
      duration: 2,
      repeat: -1,
      yoyo: true,
      stagger: {
        each: 0.1,
        from: 'random'
      },
      ease: 'sine.inOut'
    })

    // 6. 进度条动画
    gsap.to(progressFillRef.value, {
      width: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.value,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          currentProgress.value = Math.round(self.progress * 100)
        }
      }
    })

    // 7. 背景网格滚动
    gsap.to('.grid-line', {
      y: -100,
      duration: 20,
      repeat: -1,
      ease: 'none',
      stagger: 0.3
    })

  }, containerRef.value)
}

onMounted(() => {
  // 等待 DOM 完全渲染
  setTimeout(() => {
    initAnimations()
  }, 100)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.infinity-flow-container {
  min-height: 300vh;
  position: relative;
  background: linear-gradient(180deg, #0a0a1a 0%, #1a1a3a 50%, #0a0a2a 100%);
  overflow: hidden;

  opacity: 1 !important;}

// 背景网格
.grid-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;

  opacity: 1 !important;}

.grid-line {
  position: absolute;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(167, 139, 250, 0.3) 50%,
    transparent 100%
  );
  animation: gridMove 20s linear infinite;

  opacity: 1 !important;}

@keyframes gridMove {
  0% { transform: translateY(0); }
  100% { transform: translateY(-100vh); }
}

// Hero 区域
.hero-section {
  position: relative;
  padding: 120px 40px;
  text-align: center;
  z-index: 1;

  opacity: 1 !important;}

.hero-title {
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 900;
  margin-bottom: 20px;
  line-height: 1.1;
  perspective: 1000px;
  transform-style: preserve-3d;

  opacity: 1 !important;}

.title-line {
  display: block;
  background: linear-gradient(135deg, #a78bfa, #60a5fa, #f472b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transform-style: preserve-3d;

  opacity: 1 !important;}

.hero-subtitle {
  font-size: 1rem;
  letter-spacing: 8px;
  color: #94a3b8;
  margin-bottom: 30px;
  text-transform: uppercase;

  opacity: 1 !important;}

.hero-divider {
  width: 200px;
  height: 2px;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(167, 139, 250, 0.8) 50%,
    transparent 100%
  );
  margin: 0 auto;

  opacity: 1 !important;}

// 卡片包装器
.cards-wrapper {
  position: relative;
  padding: 80px 20px;
  max-width: 1400px;
  margin: 0 auto;
  z-index: 2;

  opacity: 1 !important;}

// 卡片
.flow-card {
  position: relative;
  min-height: 280px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  margin-bottom: 60px;
  cursor: pointer;
  transform-style: preserve-3d;
  perspective: 1000px;
  transition: border-color 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    inset: -1px;
    background: linear-gradient(135deg,
      hsla(var(--card-hue), 80%, 60%, 0.3),
      transparent 50%
    );
    border-radius: 24px;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  &:hover::before {
    opacity: 1;
  }

  &:hover {
    border-color: hsla(var(--card-hue), 80%, 60%, 0.4);
  }
}

.card-inner {
  position: relative;
  transform-style: preserve-3d;
}

.card-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.flow-card:hover .card-glow {
  opacity: 1;
}

.card-number {
  font-size: 4rem;
  font-weight: 900;
  font-family: 'SF Pro Display', -apple-system, sans-serif;
  background: linear-gradient(135deg, hsla(var(--card-hue), 80%, 70%, 0.3), transparent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 20px;
  opacity: 0.5;
}

.card-title {
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 12px;
  letter-spacing: -0.02em;

  opacity: 1 !important;}

.card-description {
  font-size: 0.9rem;
  color: #94a3b8;
  margin-bottom: 30px;
  text-transform: uppercase;
  letter-spacing: 2px;

  opacity: 1 !important;}

.card-icon {
  font-size: 3rem;
  margin-top: auto;
  filter: drop-shadow(0 0 20px hsla(var(--card-hue), 80%, 60%, 0.5));

  opacity: 1 !important;}

// 粒子
.card-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: hsla(var(--particle-hue), 80%, 70%, 0.6);
  border-radius: 50%;
  box-shadow: 0 0 10px hsla(var(--particle-hue), 80%, 70%, 0.8);
  top: 50%;
  left: 50%;
  transform: rotate(var(--particle-angle)) translateX(60px);

  opacity: 1 !important;}

// 进度指示器
.progress-indicator {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px 32px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50px;
  z-index: 100;

  opacity: 1 !important;}

.progress-bar {
  position: relative;
  width: 200px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;

  opacity: 1 !important;}

.progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 0;
  background: linear-gradient(90deg, #a78bfa, #60a5fa);
  border-radius: 2px;

  opacity: 1 !important;}

.progress-glow {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: linear-gradient(90deg, #a78bfa, #60a5fa);
  filter: blur(8px);
  opacity: 0.5;
}

.progress-text {
  font-size: 0.8rem;
  font-weight: 600;
  color: #94a3b8;
  white-space: nowrap;

  opacity: 1 !important;}

.progress-current {
  color: #a78bfa;
  font-size: 1rem;

  opacity: 1 !important;}

// 响应式
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  
  opacity: 1 !important;}

  .flow-card {
    padding: 30px;
    min-height: 240px;
  
  opacity: 1 !important;}

  .card-number {
    font-size: 3rem;
  
  opacity: 1 !important;}

  .card-title {
    font-size: 1.5rem;
  
  opacity: 1 !important;}

  .card-icon {
    font-size: 2.5rem;
  
  opacity: 1 !important;}

  .progress-indicator {
    bottom: 20px;
    padding: 12px 24px;
  
  opacity: 1 !important;}

  .progress-bar {
    width: 120px;
  
  opacity: 1 !important;}
}
</style>
