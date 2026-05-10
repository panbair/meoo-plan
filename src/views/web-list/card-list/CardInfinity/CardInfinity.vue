<template>
  <section ref="sectionRef" class="infinity-section">
    <!-- 无限镜像背景 -->
    <div class="infinity-bg">
      <div class="mirror-container">
        <div class="mirror-glow" v-for="i in 5" :key="i" :style="{ '--i': i }"></div>
      </div>
    </div>

    <!-- 粒子流 -->
    <div class="particle-flow">
      <div class="flow-particle" v-for="i in 30" :key="i" :style="{ '--i': i }"></div>
    </div>

    <!-- 主容器 -->
    <div class="infinity-container">
      <!-- 标题 -->
      <div ref="titleRef" class="infinity-title-wrapper">
        <div class="title-infinity">
          <svg viewBox="0 0 100 50" class="infinity-svg">
            <path
              d="M10,25 C10,15 20,15 30,15 C40,15 45,5 50,25 C55,45 60,35 70,35 C80,35 90,35 90,25 C90,15 80,15 70,15 C60,15 55,25 50,25 C45,25 40,35 30,35 C20,35 10,35 10,25"
              fill="none"
              stroke="url(#infinityGrad)"
              stroke-width="3"
              class="infinity-path"
            />
            <defs>
              <linearGradient id="infinityGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#ff6b9d" />
                <stop offset="50%" stop-color="#a855f7" />
                <stop offset="100%" stop-color="#00d4ff" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <h1 class="infinity-title">INFINITY</h1>
        <p class="infinity-subtitle">ENDLESS REFLECTION LOOP</p>
      </div>

      <!-- 无限卡片 -->
      <div ref="cardsRef" class="infinity-cards">
        <div
          v-for="(card, index) in cards"
          :key="card.id"
          class="infinity-card"
          :ref="el => setCardRef(index, el as HTMLElement)"
        >
          <!-- 镜像层 -->
          <div class="mirror-layers">
            <div class="mirror-layer" v-for="j in 5" :key="j" :style="{ '--j': j }"></div>
          </div>

          <!-- 内容 -->
          <div class="card-content">
            <div class="card-symbol">
              <svg viewBox="0 0 100 100" class="symbol-svg">
                <circle cx="50" cy="50" r="40" fill="none" :stroke="card.color" stroke-width="2" class="outer-ring" />
                <circle cx="50" cy="50" r="30" fill="none" :stroke="card.color" stroke-width="2" class="middle-ring" />
                <circle cx="50" cy="50" r="20" :fill="card.color" opacity="0.3" class="inner-circle" />
                <circle :cx="50 + 25 * Math.cos(0)" :cy="50 + 25 * Math.sin(0)" r="5" :fill="card.color" class="orbit-dot" />
              </svg>
            </div>
            <h3>{{ card.title }}</h3>
            <p>{{ card.description }}</p>
            <div class="card-reflection">
              <div class="refl-line" v-for="k in 4" :key="k"></div>
            </div>
          </div>

          <!-- 边缘光 -->
          <div class="edge-glow"></div>
        </div>
      </div>

      <!-- 循环指示 -->
      <div class="loop-indicator">
        <span class="loop-arrow">∞</span>
        <span class="loop-text">ETERNAL MOTION</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface InfinityCard {
  id: string
  title: string
  description: string
  color: string
}

const sectionRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const cardsRef = ref<HTMLElement | null>(null)
const cardRefs = ref<HTMLElement[]>([])

const cards: InfinityCard[] = [
  { id: 'inf-1', title: 'TIME LOOP', description: 'Past meets future', color: '#ff6b9d' },
  { id: 'inf-2', title: 'SPACE FOLD', description: 'Dimension breach', color: '#a855f7' },
  { id: 'inf-3', title: 'REALITY RIP', description: 'Parallel layers', color: '#00d4ff' },
  { id: 'inf-4', title: 'VOID ECHO', description: 'Infinite return', color: '#00ff88' }
]

const setCardRef = (index: number, el: HTMLElement | null) => {
  if (el) cardRefs.value[index] = el
}

let cleanupFns: (() => void)[] = []

const initAnimations = () => {
  if (!sectionRef.value) return

  // 镜像背景动画
  const mirrorGlows = sectionRef.value?.querySelectorAll('.mirror-glow')
  if (mirrorGlows) {
    mirrorGlows.forEach((glow, i) => {
      gsap.to(glow, {
        scale: 1.5,
        opacity: 0.2,
        rotation: 180,
        duration: 6 + i * 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })
    })
  }

  // 粒子流动画
  const particles = sectionRef.value?.querySelectorAll('.flow-particle')
  if (particles) {
    particles.forEach((particle, i) => {
      gsap.to(particle, {
        y: -window.innerHeight,
        x: Math.sin(i) * 200,
        opacity: 0,
        rotation: 360 * (i % 2 === 0 ? 1 : -1),
        duration: 5 + Math.random() * 5,
        repeat: -1,
        delay: i * 0.2,
        ease: 'none'
      })
    })
  }

  // 标题动画
  if (titleRef.value) {
    const infinitySvg = titleRef.value.querySelector('.infinity-svg')
    const title = titleRef.value.querySelector('.infinity-title')
    const subtitle = titleRef.value.querySelector('.infinity-subtitle')

    if (infinitySvg) {
      gsap.fromTo(
        infinitySvg,
        { strokeDashoffset: 1000, opacity: 0 },
        { strokeDashoffset: 0, opacity: 1, duration: 2, ease: 'power2.inOut' }
      )
    }

    if (title) {
      gsap.fromTo(
        title,
        { opacity: 0, y: 50, letterSpacing: '50px' },
        { opacity: 1, y: 0, letterSpacing: '15px', duration: 1.5, delay: 0.5, ease: 'power3.out' }
      )
    }

    if (subtitle) {
      gsap.fromTo(subtitle, { opacity: 0 }, { opacity: 1, duration: 1, delay: 1 })
    }
  }

  // 卡片滚动动画
  cardRefs.value.forEach((card, index) => {
    gsap.set(card, {
      opacity: 0,
      y: 200,
      scale: 0.5,
      filter: 'blur(20px)'
    })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 1.5
      }
    })

    tl.to(card, {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      duration: 1
    })

    // 镜像层动画
    const mirrorLayers = card.querySelectorAll('.mirror-layer')
    mirrorLayers.forEach((layer, i) => {
      gsap.to(layer, {
        x: (i % 2 === 0 ? 1 : -1) * (2 + i),
        y: (i % 2 === 0 ? -1 : 1) * (1 + i * 0.5),
        opacity: 0.3 - i * 0.05,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.3
      })
    })

    // 外环旋转
    const outerRing = card.querySelector('.outer-ring')
    if (outerRing) {
      gsap.to(outerRing, {
        rotation: 360,
        duration: 8,
        repeat: -1,
        ease: 'none',
        transformOrigin: '50% 50%'
      })
    }

    // 中环反向旋转
    const middleRing = card.querySelector('.middle-ring')
    if (middleRing) {
      gsap.to(middleRing, {
        rotation: -360,
        duration: 6,
        repeat: -1,
        ease: 'none',
        transformOrigin: '50% 50%'
      })
    }

    // 轨道点运动 - 使用旋转代替motionPath
    const orbitDot = card.querySelector('.orbit-dot')
    if (orbitDot) {
      gsap.to(orbitDot, {
        rotation: 360,
        duration: 2,
        repeat: -1,
        ease: 'none',
        transformOrigin: '50px 50px'
      })
    }

    // 反射线动画
    const reflLines = card.querySelectorAll('.refl-line')
    gsap.to(reflLines, {
      opacity: 0.8,
      duration: 1,
      repeat: -1,
      yoyo: true,
      stagger: 0.2,
      ease: 'sine.inOut'
    })

    // 边缘光动画
    const edgeGlow = card.querySelector('.edge-glow')
    if (edgeGlow) {
      gsap.fromTo(
        edgeGlow,
        { backgroundPosition: '-200% 0' },
        {
          backgroundPosition: '200% 0',
          duration: 3,
          repeat: -1,
          ease: 'none'
        }
      )
    }

    cleanupFns.push(() => {
      gsap.killTweensOf(mirrorLayers)
      if (outerRing) gsap.killTweensOf(outerRing)
      if (middleRing) gsap.killTweensOf(middleRing)
      if (orbitDot) gsap.killTweensOf(orbitDot)
      gsap.killTweensOf(reflLines)
      if (edgeGlow) gsap.killTweensOf(edgeGlow)
    })
  })

  // 循环指示动画
  const loopArrow = sectionRef.value?.querySelector('.loop-arrow')
  if (loopArrow) {
    gsap.to(loopArrow, {
      rotation: 360,
      duration: 10,
      repeat: -1,
      ease: 'none'
    })
  }
}

onMounted(() => {
  setTimeout(initAnimations, 100)
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
})
</script>

<style scoped lang="scss">
.infinity-section {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(180deg, #0a0a1a 0%, #1a0a2e 50%, #0a0a1a 100%);
  position: relative;
  overflow: hidden;
}

.infinity-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.mirror-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.mirror-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, transparent 70%);
  opacity: 0.5;

  @for $i from 1 through 5 {
    &:nth-child(#{$i}) {
      width: #{400 + $i * 100}px;
      height: #{400 + $i * 100}px;
      animation-delay: #{$i * 0.5}s;
    }
  }
}

.particle-flow {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.flow-particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 0 10px #a855f7;
  bottom: 0;

  @for $i from 1 through 30 {
    &:nth-child(#{$i}) {
      left: random(100) * 1%;
      animation-delay: #{$i * 0.3}s;
    }
  }
}

.infinity-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.infinity-title-wrapper {
  text-align: center;
  margin-bottom: 50px;
}

.title-infinity {
  width: 150px;
  height: 75px;
  margin: 0 auto 20px;
}

.infinity-svg {
  width: 100%;
  height: 100%;
}

.infinity-path {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
}

.infinity-title {
  font-size: clamp(48px, 10vw, 100px);
  font-weight: 900;
  margin: 0;
  background: linear-gradient(135deg, #ff6b9d, #a855f7, #00d4ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: drop-shadow(0 0 30px rgba(168, 85, 247, 0.5));
  letter-spacing: 15px;
}

.infinity-subtitle {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 8px;
  margin-top: 15px;
}

.infinity-cards {
  display: flex;
  gap: 30px;
  perspective: 1500px;
}

.infinity-card {
  width: 200px;
  height: 280px;
  position: relative;
  transform-style: preserve-3d;
}

.mirror-layers {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.mirror-layer {
  position: absolute;
  inset: 0;
  border-radius: 20px;
  background: rgba(168, 85, 247, 0.1);
  border: 1px solid rgba(168, 85, 247, 0.2);

  &:nth-child(1) {
    inset: 5px;
    background: rgba(148, 95, 217, 0.08);
    border-color: rgba(148, 95, 217, 0.15);
  }

  &:nth-child(2) {
    inset: 10px;
    background: rgba(128, 105, 187, 0.06);
    border-color: rgba(128, 105, 187, 0.12);
  }

  &:nth-child(3) {
    inset: 15px;
    background: rgba(108, 115, 157, 0.05);
    border-color: rgba(108, 115, 157, 0.1);
  }

  &:nth-child(4) {
    inset: 20px;
    background: rgba(88, 125, 127, 0.04);
    border-color: rgba(88, 125, 127, 0.08);
  }

  &:nth-child(5) {
    inset: 25px;
    background: rgba(68, 135, 97, 0.03);
    border-color: rgba(68, 135, 97, 0.06);
  }
}

.card-content {
  position: relative;
  height: 100%;
  background: rgba(15, 10, 30, 0.9);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 25px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
}

.card-symbol {
  width: 120px;
  height: 120px;
  margin-bottom: 20px;
}

.symbol-svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 0 20px currentColor);
}

.outer-ring {
  transform-origin: center;
}

.middle-ring {
  transform-origin: center;
}

.inner-circle {
  transform-origin: center;
}

.orbit-dot {
  transform-origin: 50px 50px;
}

.card-content h3 {
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 10px;
  letter-spacing: 3px;
  text-shadow: 0 0 20px rgba(168, 85, 247, 0.5);
}

.card-content p {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  text-align: center;
}

.card-reflection {
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  height: 2px;
  display: flex;
  gap: 10px;
}

.refl-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.5), transparent);
  opacity: 0.3;
}

.edge-glow {
  position: absolute;
  inset: 0;
  border-radius: 20px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.1) 25%,
    rgba(168, 85, 247, 0.3) 50%,
    rgba(255, 255, 255, 0.1) 75%,
    transparent 100%
  );
  background-size: 200% 100%;
  pointer-events: none;
  opacity: 0.5;
}

.loop-indicator {
  position: absolute;
  bottom: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.loop-arrow {
  font-size: 30px;
  background: linear-gradient(135deg, #ff6b9d, #a855f7);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.loop-text {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 4px;
}
</style>
