<template>
  <section ref="sectionRef" class="particle-section">
    <!-- 粒子背景 -->
    <canvas ref="canvasRef" class="particle-canvas"></canvas>

    <!-- 连接线 -->
    <svg class="connection-svg">
      <line
        v-for="(line, i) in connections"
        :key="i"
        :x1="line.x1"
        :y1="line.y1"
        :x2="line.x2"
        :y2="line.y2"
        class="connection-line"
        :style="{ opacity: line.opacity }"
      />
    </svg>

    <!-- 主容器 -->
    <div class="particle-container">
      <!-- 标题 -->
      <div ref="titleRef" class="particle-title-wrapper">
        <h1 class="particle-title">
          <span class="title-word" v-for="(word, i) in titleWords" :key="i">{{ word }}</span>
        </h1>
        <p class="particle-subtitle">CONNECTED UNIVERSE</p>
      </div>

      <!-- 粒子卡片 -->
      <div ref="cardsRef" class="particle-cards">
        <div
          v-for="(card, index) in cards"
          :key="card.id"
          class="particle-card"
          :ref="el => setCardRef(index, el as HTMLElement)"
          :style="{ '--card-color': card.color, '--index': index }"
        >
          <div class="card-glow"></div>
          <div class="card-particles">
            <span v-for="i in 20" :key="i" class="mini-particle" :style="{ '--p-index': i }"></span>
          </div>
          <div class="card-core">
            <div class="core-atom">
              <div class="orbit orbit-1"></div>
              <div class="orbit orbit-2"></div>
              <div class="orbit orbit-3"></div>
              <div class="nucleus">{{ card.icon }}</div>
            </div>
          </div>
          <div class="card-info">
            <h3>{{ card.title }}</h3>
            <p>{{ card.description }}</p>
          </div>
        </div>
      </div>

      <!-- 滚动粒子指示器 -->
      <div class="scroll-particles">
        <span v-for="i in 30" :key="i" class="scroll-particle" :style="{ '--sp-index': i }"></span>
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
  x: number
  y: number
}

interface Connection {
  x1: number
  y1: number
  x2: number
  y2: number
  opacity: number
}

const sectionRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const cardsRef = ref<HTMLElement | null>(null)
const cardRefs = ref<HTMLElement[]>([])
const connections = ref<Connection[]>([])

const titleWords = ['PARTICLE', 'NETWORK']

const cards: Card[] = [
  { id: 'particle-1', title: 'QUANTUM', description: 'Superposition states', icon: '⚛️', color: '#00d4ff', x: 15, y: 25 },
  { id: 'particle-2', title: 'PHOTON', description: 'Light particles', icon: '💡', color: '#ff6b9d', x: 75, y: 20 },
  { id: 'particle-3', title: 'NEUTRON', description: 'Neutral mass', icon: '⚪', color: '#a855f7', x: 25, y: 65 },
  { id: 'particle-4', title: 'ELECTRON', description: 'Negative charge', icon: '🔵', color: '#f59e0b', x: 70, y: 70 },
  { id: 'particle-5', title: 'PROTON', description: 'Positive energy', icon: '🔴', color: '#10b981', x: 45, y: 45 }
]

const setCardRef = (index: number, el: HTMLElement | null) => {
  if (el) cardRefs.value[index] = el
}

let cleanupFns: (() => void)[] = []
let animationFrameId: number | null = null
let particles: Array<{ x: number; y: number; vx: number; vy: number; size: number; opacity: number }> = []

const initParticles = () => {
  if (!canvasRef.value) return
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const resize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  resize()
  window.addEventListener('resize', resize)

  // 创建粒子
  particles = Array.from({ length: 100 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    size: Math.random() * 3 + 1,
    opacity: Math.random() * 0.5 + 0.2
  }))

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    particles.forEach(p => {
      p.x += p.vx
      p.y += p.vy

      if (p.x < 0 || p.x > canvas.width) p.vx *= -1
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1

      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(0, 212, 255, ${p.opacity})`
      ctx.fill()
    })

    // 绘制连线
    particles.forEach((p1, i) => {
      particles.slice(i + 1).forEach(p2 => {
        const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y)
        if (dist < 150) {
          ctx.beginPath()
          ctx.moveTo(p1.x, p1.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.strokeStyle = `rgba(0, 212, 255, ${0.2 * (1 - dist / 150)})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      })
    })

    animationFrameId = requestAnimationFrame(animate)
  }

  animate()

  cleanupFns.push(() => {
    window.removeEventListener('resize', resize)
    if (animationFrameId) cancelAnimationFrame(animationFrameId)
  })
}

const initAnimations = () => {
  if (!sectionRef.value) return

  // 标题入场动画
  if (titleRef.value) {
    const words = titleRef.value.querySelectorAll('.title-word')
    gsap.fromTo(
      words,
      { opacity: 0, y: 80, scale: 0.5 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        stagger: 0.2,
        ease: 'elastic.out(1, 0.5)'
      }
    )
  }

  // 卡片粒子动画
  cardRefs.value.forEach((card, index) => {
    const cardData = cards[index]

    // 初始位置（分散在屏幕各处）
    gsap.set(card, {
      x: `${cardData.x}%`,
      y: `${cardData.y}%`,
      opacity: 0,
      scale: 0,
      rotation: Math.random() * 360
    })

    // 滚动时聚集到中心
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top top',
        end: 'center center',
        scrub: 1.5
      }
    })

    // 飞向中心
    tl.to(card, {
      x: '0%',
      y: '0%',
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 1
    })

    // 3D旋转
    tl.to(card, {
      rotateY: 360 * (index % 2 === 0 ? 1 : -1),
      rotateX: 180,
      duration: 1
    }, 0)

    // 迷你粒子动画
    const miniParticles = card.querySelectorAll('.mini-particle')
    miniParticles.forEach((p, i) => {
      gsap.to(p, {
        x: Math.sin(i) * 50,
        y: Math.cos(i) * 50,
        scale: 1.5,
        opacity: 0.8,
        duration: 2 + Math.random(),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })
    })

    // 原子轨道旋转
    const atom = card.querySelector('.atom')
    if (atom) {
      gsap.to(atom, {
        rotation: 360,
        duration: 3,
        repeat: -1,
        ease: 'none'
      })
    }
  })

  // 连接线动画
  const updateConnections = () => {
    if (!sectionRef.value) return
    const rect = sectionRef.value.getBoundingClientRect()
    const newConnections: Connection[] = []

    cardRefs.value.forEach((card1, i) => {
      cardRefs.value.slice(i + 1).forEach((card2, j) => {
        const r1 = card1.getBoundingClientRect()
        const r2 = card2.getBoundingClientRect()

        newConnections.push({
          x1: r1.left + r1.width / 2 - rect.left,
          y1: r1.top + r1.height / 2 - rect.top,
          x2: r2.left + r2.width / 2 - rect.left,
          y2: r2.top + r2.height / 2 - rect.top,
          opacity: 0.3 + Math.random() * 0.4
        })
      })
    })

    connections.value = newConnections
  }

  ScrollTrigger.create({
    trigger: sectionRef.value,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: updateConnections
  })

  // 滚动粒子效果
  const scrollParticles = sectionRef.value?.querySelectorAll('.scroll-particle')
  if (scrollParticles) {
    gsap.to(scrollParticles, {
      y: -200,
      x: () => Math.random() * 100 - 50,
      opacity: 0,
      duration: 3,
      stagger: {
        each: 0.1,
        from: 'random'
      },
      repeat: -1,
      ease: 'none'
    })

    cleanupFns.push(() => gsap.killTweensOf(scrollParticles))
  }
}

onMounted(() => {
  initParticles()
  setTimeout(initAnimations, 100)
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
})
</script>

<style scoped lang="scss">
.particle-section {
  width: 100vw;
  height: 100vh;
  background: radial-gradient(ellipse at center, #0a1628 0%, #050a12 100%);
  position: relative;
  overflow: hidden;
}

.particle-canvas {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.connection-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.connection-line {
  stroke: rgba(0, 212, 255, 0.3);
  stroke-width: 1;
}

.particle-container {
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

.particle-title-wrapper {
  text-align: center;
  margin-bottom: 60px;
}

.particle-title {
  font-size: clamp(48px, 10vw, 100px);
  font-weight: 900;
  color: #fff;
  margin: 0;
  display: flex;
  gap: 30px;
  text-shadow:
    0 0 20px rgba(0, 212, 255, 0.8),
    0 0 40px rgba(0, 212, 255, 0.6),
    0 0 60px rgba(0, 212, 255, 0.4);
}

.title-word {
  display: inline-block;
}

.particle-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 8px;
  margin-top: 20px;
}

.particle-cards {
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
  justify-content: center;
  perspective: 1200px;
}

.particle-card {
  width: 160px;
  height: 200px;
  position: relative;
  transform-style: preserve-3d;
}

.card-glow {
  position: absolute;
  inset: -20px;
  background: radial-gradient(circle, var(--card-color) 0%, transparent 70%);
  opacity: 0.3;
  filter: blur(20px);
  transition: opacity 0.3s ease;
}

.particle-card:hover .card-glow {
  opacity: 0.6;
}

.card-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.mini-particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: var(--card-color);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 10px var(--card-color);
  opacity: 0.6;

  &:nth-child(odd) {
    animation-delay: 0.5s;
  }
}

.card-core {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.core-atom {
  width: 100px;
  height: 100px;
  position: relative;
}

.orbit {
  position: absolute;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  inset: 0;
}

.orbit-1 {
  animation: orbit-rotate 4s linear infinite;
  transform: rotateX(60deg);
}

.orbit-2 {
  animation: orbit-rotate 6s linear infinite reverse;
  transform: rotateY(60deg);
}

.orbit-3 {
  animation: orbit-rotate 8s linear infinite;
  transform: rotateX(-30deg) rotateY(30deg);
}

@keyframes orbit-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.nucleus {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 36px;
  filter: drop-shadow(0 0 20px var(--card-color));
}

.card-info {
  position: absolute;
  bottom: -70px;
  left: 0;
  right: 0;
  text-align: center;

  h3 {
    font-size: 16px;
    font-weight: 700;
    color: #fff;
    margin: 0;
    letter-spacing: 2px;
  }

  p {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.5);
    margin: 8px 0 0;
  }
}

.scroll-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.scroll-particle {
  position: absolute;
  width: 3px;
  height: 3px;
  background: #00d4ff;
  border-radius: 50%;
  bottom: 0;
  left: calc(var(--sp-index) * 3.33%);
  box-shadow: 0 0 10px #00d4ff;
}
</style>
