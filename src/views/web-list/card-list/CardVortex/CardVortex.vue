<template>
  <section ref="sectionRef" class="vortex-section">
    <!-- 漩涡背景 -->
    <div class="vortex-bg">
      <div class="vortex-spiral" ref="spiralRef">
        <div class="spiral-arm" v-for="i in 8" :key="i" :style="{ '--arm-i': i }"></div>
      </div>
      <div class="vortex-core"></div>
    </div>

    <!-- 能量波 -->
    <div class="energy-waves">
      <div class="energy-wave" v-for="i in 6" :key="i" :style="{ '--wave-i': i }"></div>
    </div>

    <!-- 主容器 -->
    <div class="vortex-container">
      <!-- 标题 -->
      <div ref="titleRef" class="vortex-title-wrapper">
        <h1 class="vortex-title">VORTEX</h1>
        <p class="vortex-subtitle">ENERGY SPIRAL</p>
      </div>

      <!-- 漩涡卡片 -->
      <div ref="cardsRef" class="vortex-cards">
        <div
          v-for="(card, index) in cards"
          :key="card.id"
          class="vortex-card"
          :ref="el => setCardRef(index, el as HTMLElement)"
          :style="{ '--card-color': card.color, '--index': index }"
        >
          <div class="card-spiral-border">
            <div class="spiral-line" v-for="i in 12" :key="i" :style="{ '--line-i': i }"></div>
          </div>
          <div class="card-content">
            <div class="card-energy-core">
              <div class="energy-ring" v-for="i in 4" :key="i" :style="{ '--ring-i': i }"></div>
              <span class="card-icon">{{ card.icon }}</span>
            </div>
            <h3>{{ card.title }}</h3>
            <div class="card-stats">
              <div class="stat" v-for="stat in card.stats" :key="stat.label">
                <span class="stat-value">{{ stat.value }}</span>
                <span class="stat-label">{{ stat.label }}</span>
              </div>
            </div>
          </div>
          <div class="card-particles">
            <span v-for="i in 12" :key="i" class="vortex-particle" :style="{ '--p-i': i }"></span>
          </div>
        </div>
      </div>

      <!-- 中心指示 -->
      <div class="center-indicator">
        <div class="indicator-ring" v-for="i in 3" :key="i"></div>
        <span>ENTER THE VORTEX</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Stat {
  value: string
  label: string
}

interface Card {
  id: string
  title: string
  icon: string
  color: string
  stats: Stat[]
}

const sectionRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const cardsRef = ref<HTMLElement | null>(null)
const spiralRef = ref<HTMLElement | null>(null)
const cardRefs = ref<HTMLElement[]>([])

const cards: Card[] = [
  {
    id: 'vortex-1',
    title: 'QUANTUM',
    icon: '⚛️',
    color: '#00d4ff',
    stats: [{ value: '∞', label: 'STATES' }, { value: 'ħ', label: 'CONSTANT' }]
  },
  {
    id: 'vortex-2',
    title: 'PLASMA',
    icon: '🔥',
    color: '#ff6b35',
    stats: [{ value: '10K', label: 'TEMP' }, { value: '⚡', label: 'CHARGE' }]
  },
  {
    id: 'vortex-3',
    title: 'SINGULARITY',
    icon: '🕳️',
    color: '#a855f7',
    stats: [{ value: '0', label: 'VOLUME' }, { value: '∞', label: 'DENSITY' }]
  }
]

const setCardRef = (index: number, el: HTMLElement | null) => {
  if (el) cardRefs.value[index] = el
}

let cleanupFns: (() => void)[] = []

const initAnimations = () => {
  if (!sectionRef.value) return

  // 标题入场
  if (titleRef.value) {
    gsap.fromTo(
      titleRef.value,
      { opacity: 0, scale: 0.5, rotation: -10 },
      {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 1.2,
        ease: 'elastic.out(1, 0.5)'
      }
    )
  }

  // 漩涡旋转
  if (spiralRef.value) {
    const arms = spiralRef.value.querySelectorAll('.spiral-arm')
    gsap.to(spiralRef.value, {
      rotation: 360,
      duration: 30,
      repeat: -1,
      ease: 'none'
    })

    arms.forEach((arm, i) => {
      gsap.to(arm, {
        scaleY: 1.5,
        opacity: 0.3,
        duration: 2,
        repeat: -1,
        yoyo: true,
        delay: i * 0.2,
        ease: 'sine.inOut'
      })
    })

    cleanupFns.push(() => {
      gsap.killTweensOf(spiralRef.value)
      gsap.killTweensOf(arms)
    })
  }

  // 能量波动画
  const waves = sectionRef.value?.querySelectorAll('.energy-wave')
  if (waves) {
    waves.forEach((wave, i) => {
      gsap.fromTo(
        wave,
        { scale: 0, opacity: 0.8 },
        {
          scale: 4,
          opacity: 0,
          duration: 3,
          repeat: -1,
          delay: i * 0.5,
          ease: 'none'
        }
      )
    })
    cleanupFns.push(() => gsap.killTweensOf(waves))
  }

  // 卡片漩涡动画
  cardRefs.value.forEach((card, index) => {
    gsap.set(card, {
      opacity: 0,
      rotation: 180 * (index % 2 === 0 ? 1 : -1),
      scale: 0
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
      rotation: 0,
      scale: 1,
      duration: 1
    })

    tl.to(card, {
      rotation: 360,
      duration: 2,
      ease: 'power2.inOut'
    }, 0.5)

    // 漩涡粒子
    const particles = card.querySelectorAll('.vortex-particle')
    particles.forEach((p, i) => {
      const angle = (360 / particles.length) * i
      gsap.to(p, {
        rotation: 360,
        x: Math.cos((angle * Math.PI) / 180) * 80,
        y: Math.sin((angle * Math.PI) / 180) * 80,
        duration: 2 + i * 0.2,
        repeat: -1,
        ease: 'none'
      })
    })

    // 能量环
    const rings = card.querySelectorAll('.energy-ring')
    rings.forEach((ring, i) => {
      gsap.to(ring, {
        scale: 1.5,
        opacity: 0,
        duration: 1.5 + i * 0.3,
        repeat: -1,
        delay: i * 0.3,
        ease: 'none'
      })
    })

    cleanupFns.push(() => {
      gsap.killTweensOf(particles)
      gsap.killTweensOf(rings)
    })
  })

  // 中心指示器动画
  const indicatorRings = sectionRef.value?.querySelectorAll('.indicator-ring')
  if (indicatorRings) {
    indicatorRings.forEach((ring, i) => {
      gsap.to(ring, {
        scale: 2,
        opacity: 0,
        duration: 2,
        repeat: -1,
        delay: i * 0.6,
        ease: 'power2.out'
      })
    })
    cleanupFns.push(() => gsap.killTweensOf(indicatorRings))
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
.vortex-section {
  width: 100vw;
  height: 100vh;
  background: radial-gradient(ellipse at center, #1a0a2e 0%, #0a0a0f 100%);
  position: relative;
  overflow: hidden;
}

.vortex-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  height: 800px;
}

.vortex-spiral {
  position: absolute;
  inset: 0;
}

.spiral-arm {
  position: absolute;
  width: 300px;
  height: 400px;
  top: 50%;
  left: 50%;
  transform-origin: top center;
  transform: translate(-50%, 0) rotate(calc(var(--arm-i) * 45deg));
  background: linear-gradient(
    to bottom,
    var(--card-color, #00d4ff) 0%,
    transparent 100%
  );
  opacity: 0.3;
  filter: blur(40px);
}

.vortex-core {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, #fff 0%, #00d4ff 30%, transparent 70%);
  border-radius: 50%;
  box-shadow:
    0 0 100px #00d4ff,
    0 0 200px rgba(0, 212, 255, 0.5);
  animation: core-pulse 2s ease-in-out infinite;
}

@keyframes core-pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(1.2); }
}

.energy-waves {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.energy-wave {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  border: 2px solid #00d4ff;
  border-radius: 50%;
  opacity: 0;
}

.vortex-container {
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

.vortex-title-wrapper {
  text-align: center;
  margin-bottom: 50px;
}

.vortex-title {
  font-size: clamp(50px, 10vw, 100px);
  font-weight: 900;
  color: #fff;
  margin: 0;
  letter-spacing: 20px;
  text-shadow:
    0 0 20px #00d4ff,
    0 0 40px rgba(0, 212, 255, 0.6),
    0 0 60px rgba(0, 212, 255, 0.4);
}

.vortex-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 10px;
  margin-top: 16px;
}

.vortex-cards {
  display: flex;
  gap: 40px;
  perspective: 1000px;
}

.vortex-card {
  width: 200px;
  height: 280px;
  position: relative;
  transform-style: preserve-3d;
}

.card-spiral-border {
  position: absolute;
  inset: 0;
  border-radius: 20px;
  overflow: hidden;
}

.spiral-line {
  position: absolute;
  width: 2px;
  height: 150%;
  top: -25%;
  left: calc(50% + (var(--line-i) - 6.5) * 20px);
  background: linear-gradient(
    to bottom,
    transparent 0%,
    var(--card-color) 50%,
    transparent 100%
  );
  transform-origin: center;
  animation: spiral-spin 3s linear infinite;
  animation-delay: calc(var(--line-i) * 0.1s);
}

@keyframes spiral-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.card-content {
  position: relative;
  height: 100%;
  background: rgba(10, 10, 20, 0.9);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  backdrop-filter: blur(10px);
}

.card-energy-core {
  position: relative;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.energy-ring {
  position: absolute;
  border: 2px solid var(--card-color);
  border-radius: 50%;
  opacity: 0.6;

  &:nth-child(1) { inset: 0; }
  &:nth-child(2) { inset: -10px; }
  &:nth-child(3) { inset: -20px; }
  &:nth-child(4) { inset: -30px; opacity: 0.2; }
}

.card-icon {
  font-size: 36px;
  z-index: 1;
  filter: drop-shadow(0 0 20px var(--card-color));
}

.card-content h3 {
  font-size: 18px;
  font-weight: 800;
  color: #fff;
  margin: 0 0 20px;
  letter-spacing: 3px;
}

.card-stats {
  display: flex;
  gap: 20px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-value {
  font-size: 20px;
  font-weight: 900;
  color: var(--card-color);
  text-shadow: 0 0 10px var(--card-color);
}

.stat-label {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 1px;
}

.card-particles {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  pointer-events: none;
}

.vortex-particle {
  position: absolute;
  width: 6px;
  height: 6px;
  background: var(--card-color);
  border-radius: 50%;
  box-shadow: 0 0 15px var(--card-color);
}

.center-indicator {
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;

  span {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.4);
    letter-spacing: 6px;
  }
}

.indicator-ring {
  width: 40px;
  height: 40px;
  border: 2px solid rgba(0, 212, 255, 0.5);
  border-radius: 50%;
}
</style>
