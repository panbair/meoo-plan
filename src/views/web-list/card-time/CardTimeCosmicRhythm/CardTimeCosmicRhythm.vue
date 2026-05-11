<template>
  <section ref="containerRef" class="cosmic-rhythm">
    <!-- 背景粒子层 -->
    <canvas ref="particleCanvasRef" class="particle-canvas"></canvas>

    <!-- 能量网格背景 -->
    <div class="energy-grid">
      <div v-for="i in 20" :key="i" class="grid-line" :style="getGridLineStyle(i)"></div>
    </div>

    <!-- 脉冲环 -->
    <div ref="pulseRingsRef" class="pulse-rings">
      <div class="pulse-ring" v-for="i in 3" :key="i"></div>
    </div>

    <!-- 标题区域 -->
    <div ref="headerRef" class="rhythm-header">
      <div ref="badgeRef" class="rhythm-badge">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 6v6l4 2"/>
        </svg>
        <span>STELLAR ARRAY</span>
      </div>
      <h1 ref="titleRef" class="rhythm-title">COSMIC RHYTHM</h1>
      <p ref="subtitleRef" class="rhythm-subtitle">
        Dance of particles through dimensional space
      </p>
    </div>

    <!-- 卡片容器 -->
    <div ref="cardsContainerRef" class="cards-container">
      <div
        v-for="(card, index) in cards"
        :key="card.id"
        :ref="el => setCardRef(el, index)"
        class="rhythm-card"
        :data-index="index"
      >
        <div class="card-pulse-ring"></div>
        <div class="card-inner">
          <div class="card-waveform">
            <div
              v-for="j in 8"
              :key="j"
              class="wave-bar"
              :style="{ animationDelay: `${j * 0.05}s` }"
            ></div>
          </div>
          <div class="card-body">
            <span class="card-number">{{ String(card.number).padStart(2, '0') }}</span>
            <h3 class="card-title">{{ card.title }}</h3>
            <p class="card-desc">{{ card.desc }}</p>
          </div>
          <div class="card-footer">
            <span class="card-freq">{{ card.frequency }}</span>
            <div class="card-dot"></div>
          </div>
        </div>
        <div class="card-glow"></div>
      </div>
    </div>

    <!-- 底部节奏指示 -->
    <div ref="footerRef" class="rhythm-footer">
      <div ref="beatIndicatorRef" class="beat-indicator">
        <div class="beat-bar" v-for="i in 8" :key="i"></div>
      </div>
      <span class="footer-text">STELLAR FREQUENCY ACTIVE</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Card {
  id: number
  number: number
  title: string
  desc: string
  frequency: string
}

const cards: Card[] = [
  { id: 1, number: 1, title: 'Pulsar', desc: 'Rotating neutron star broadcasting cosmic beacons', frequency: '1420MHz' },
  { id: 2, number: 2, title: 'Quasar', desc: 'Active galactic nucleus radiating intense energy', frequency: '3C273' },
  { id: 3, number: 3, title: 'Magnetar', desc: 'Neutron star with extreme magnetic field', frequency: '10¹⁴T' },
  { id: 4, number: 4, title: 'Blazar', desc: 'Active galaxy with jet pointing to Earth', frequency: 'γ-ray' },
  { id: 5, number: 5, title: 'Seyfert', desc: 'Spiral galaxy with luminous core', frequency: 'UV' },
  { id: 6, number: 6, title: 'Nova', desc: 'Thermonuclear explosion on stellar surface', frequency: '10⁶L☉' },
  { id: 7, number: 7, title: 'Supernova', desc: 'Catastrophic stellar death explosion', frequency: '10¹⁰L☉' },
  { id: 8, number: 8, title: 'Pulsar', desc: 'Rotating neutron star broadcasting cosmic beacons', frequency: '1420MHz' },
  { id: 9, number: 9, title: 'Quasar', desc: 'Active galactic nucleus radiating intense energy', frequency: '3C273' },
]

// Card colors
const cardColors = [
  '#00ffcc', '#ff00ff', '#00ff88', '#ff6600',
  '#ff0066', '#6600ff', '#00f5ff', '#ffff00',
  '#ff3300'
]

// Refs
const containerRef = ref<HTMLElement | null>(null)
const particleCanvasRef = ref<HTMLCanvasElement | null>(null)
const pulseRingsRef = ref<HTMLElement | null>(null)
const cardsContainerRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const badgeRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const beatIndicatorRef = ref<HTMLElement | null>(null)

const cardRefs = ref<(HTMLElement | null)[]>([])
const setCardRef = (el: any, index: number) => {
  if (el) cardRefs.value[index] = el
}

// Grid line styles
const getGridLineStyle = (index: number) => {
  if (index <= 10) {
    return { left: `${index * 10}%`, animationDelay: `${index * 0.2}s` }
  } else {
    return { top: `${(index - 10) * 10}%`, animationDelay: `${(index - 10) * 0.2}s` }
  }
}

// Particle system
interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  size: number
  color: string
}

const particles: Particle[] = []
let animationFrameId: number | null = null
let ctx: CanvasRenderingContext2D | null = null

// Cleanup
let tl: gsap.core.Timeline | null = null
let st: ScrollTrigger | null = null
let floatTl: gsap.core.Timeline | null = null

const initParticles = () => {
  if (!particleCanvasRef.value) return
  particleCanvasRef.value.width = window.innerWidth
  particleCanvasRef.value.height = window.innerHeight
  ctx = particleCanvasRef.value.getContext('2d')

  // Create initial particles
  for (let i = 0; i < 50; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      life: 1,
      size: Math.random() * 2 + 1,
      color: cardColors[Math.floor(Math.random() * cardColors.length)]
    })
  }
}

const animateParticles = () => {
  if (!ctx || !particleCanvasRef.value) return

  ctx.clearRect(0, 0, particleCanvasRef.value.width, particleCanvasRef.value.height)

  particles.forEach((p, i) => {
    p.x += p.vx
    p.y += p.vy
    p.life -= 0.002

    if (p.life <= 0) {
      particles[i] = {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        life: 1,
        size: Math.random() * 2 + 1,
        color: cardColors[Math.floor(Math.random() * cardColors.length)]
      }
    }

    ctx!.beginPath()
    ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    ctx!.fillStyle = p.color
    ctx!.globalAlpha = p.life * 0.6
    ctx!.fill()
  })

  ctx.globalAlpha = 1
  animationFrameId = requestAnimationFrame(animateParticles)
}

const stopParticles = () => {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
}

const initAnimation = async () => {
  await nextTick()

  const container = containerRef.value
  const cardsContainer = cardsContainerRef.value
  const allCards = cardRefs.value.filter(Boolean) as HTMLElement[]

  if (!container || !cardsContainer || !allCards.length) return

  const vw = window.innerWidth
  const vh = window.innerHeight
  const cardW = 200
  const cardH = 280

  // Calculate final grid positions (3x3)
  const cols = 3
  const rows = 3
  const gapX = 50
  const gapY = 40
  const totalW = cols * cardW + (cols - 1) * gapX
  const totalH = rows * cardH + (rows - 1) * gapY
  const startX = (vw - totalW) / 2
  const startY = (vh - totalH) / 2 + 30

  // 初始状态：堆叠在中心的能量方块
  const centerX = vw / 2
  const centerY = vh / 2

  allCards.forEach((card, i) => {
    const row = Math.floor(i / cols)
    const col = i % cols
    const finalX = startX + col * (cardW + gapX)
    const finalY = startY + row * (cardH + gapY)

    // 存储最终位置
    card.dataset.finalX = String(finalX)
    card.dataset.finalY = String(finalY)

    // 初始：堆叠在中心，压缩成一维
    gsap.set(card, {
      x: centerX - cardW / 2,
      y: centerY - cardH / 2,
      z: -600 - i * 50,
      scaleX: 0.02,
      scaleY: 0.02,
      scale: 0.02,
      rotationX: 45,
      rotationY: 45,
      rotationZ: i * 15,
      opacity: 0,
      filter: 'blur(20px) brightness(0.5)',
      force3D: true
    })
  })

  // 设置3D透视
  gsap.set(cardsContainer, {
    perspective: 1500,
    transformStyle: 'preserve-3d'
  })

  // 标题初始状态
  gsap.set([badgeRef.value, titleRef.value, subtitleRef.value], {
    opacity: 0,
    y: -50,
    filter: 'blur(15px)'
  })

  // 页脚初始状态
  gsap.set(footerRef.value, {
    opacity: 0,
    y: 30
  })

  // 脉冲环初始状态
  gsap.set(pulseRingsRef.value, {
    scale: 0,
    opacity: 0
  })

  // 创建主时间线
  tl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top 80%',
      end: 'top 10%',
      scrub: 1.8,
      toggleActions: 'play reverse play reverse'
    }
  })

  // 脉冲环出现
  tl.to(pulseRingsRef.value, {
    scale: 1,
    opacity: 1,
    duration: 0.5,
    ease: 'power2.out'
  }, 0)

  // 标题出现
  tl.to([badgeRef.value, titleRef.value, subtitleRef.value], {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    stagger: 0.1,
    duration: 0.6
  }, 0.2)

  // 阶段1：节奏散开 - 波浪式扩散
  allCards.forEach((card, i) => {
    const row = Math.floor(i / cols)
    const col = i % cols

    // 计算波浪延迟：从中心向外扩散
    const distFromCenter = Math.abs(row - 1) + Math.abs(col - 1)
    const waveDelay = distFromCenter * 0.12

    tl!.to(card, {
      x: String(card.dataset.finalX),
      y: String(card.dataset.finalY),
      z: 0,
      scaleX: 1,
      scaleY: 1,
      scale: 1,
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      opacity: 1,
      filter: 'blur(0px) brightness(1)',
      duration: 1.2,
      ease: 'back.out(1.2)',
      delay: waveDelay
    }, 0.4)
  })

  // 阶段2：悬浮升空 - Z轴高度差
  allCards.forEach((card, i) => {
    tl!.to(card, {
      z: 60 - i * 5,
      duration: 0.6,
      ease: 'power2.out'
    }, 1.2 + i * 0.04)
  })

  // 阶段3：姿态完美重组（微调）
  allCards.forEach((card, i) => {
    tl!.to(card, {
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      duration: 0.4,
      ease: 'power2.inOut'
    }, 1.4 + i * 0.03)
  })

  // 页脚出现
  tl.to(footerRef.value, {
    opacity: 1,
    y: 0,
    duration: 0.5
  }, 1.5)

  // 自由漂浮飞行（循环）
  allCards.forEach((card, i) => {
    const floatY = -10 - Math.random() * 10
    const floatRotZ = (i % 2 === 0 ? 1 : -1) * (1 + Math.random())

    floatTl = gsap.to(card, {
      y: `+=${floatY}`,
      z: 30 + Math.random() * 40,
      rotationZ: floatRotZ,
      duration: 2 + Math.random(),
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay: i * 0.15
    })
  })

  st = tl.scrollTrigger

  // 启动粒子动画
  initParticles()
  animateParticles()
}

const handleResize = () => {
  if (st) st.kill()
  if (tl) tl.kill()
  if (floatTl) floatTl.kill()
  stopParticles()
  nextTick(initAnimation)
}

onMounted(() => {
  initAnimation()
  window.addEventListener('resize', handleResize, { passive: true })
})

onUnmounted(() => {
  if (tl) tl.kill()
  if (st) st.kill()
  if (floatTl) floatTl.kill()
  stopParticles()
  ScrollTrigger.getAll().forEach(instance => {
    if (instance.vars.trigger === containerRef.value) {
      instance.kill()
    }
  })
  gsap.killTweensOf('.rhythm-card')
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped lang="scss">
.cosmic-rhythm {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, #0a0a1a 0%, #1a0a2e 50%, #0a0a1a 100%);
}

.particle-canvas {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.energy-grid {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;

  .grid-line {
    position: absolute;
    background: linear-gradient(90deg, transparent, rgba(0, 255, 200, 0.03), transparent);
    animation: gridPulse 4s ease-in-out infinite;

    @for $i from 1 through 10 {
      &:nth-child(#{$i}) {
        top: 0;
        width: 1px;
        height: 100%;
      }
    }

    @for $i from 11 through 20 {
      &:nth-child(#{$i}) {
        left: 0;
        height: 1px;
        width: 100%;
        background: linear-gradient(90deg, transparent, rgba(0, 255, 200, 0.03), transparent);
      }
    }

    @keyframes gridPulse {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 0.6; }
    }
  }
}

.pulse-rings {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: 400px;
  pointer-events: none;
  z-index: 2;

  .pulse-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 1px solid rgba(0, 255, 200, 0.2);
    animation: pulseExpand 3s ease-out infinite;

    &:nth-child(1) { animation-delay: 0s; }
    &:nth-child(2) { animation-delay: 1s; }
    &:nth-child(3) { animation-delay: 2s; }

    @keyframes pulseExpand {
      0% {
        transform: scale(0.3);
        opacity: 0.6;
        border-color: rgba(0, 255, 200, 0.4);
      }
      100% {
        transform: scale(1.5);
        opacity: 0;
        border-color: rgba(0, 255, 200, 0);
      }
    }
  }
}

.rhythm-header {
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.rhythm-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 20px;
  background: rgba(0, 255, 200, 0.08);
  border: 1px solid rgba(0, 255, 200, 0.3);
  border-radius: 30px;
  font-family: 'Orbitron', sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: rgba(0, 255, 200, 0.9);
  letter-spacing: 3px;

  svg {
    width: 16px;
    height: 16px;
    color: #00ffc8;
  }
}

.rhythm-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 52px;
  font-weight: 700;
  color: #fff;
  margin: 0;
  letter-spacing: 12px;
  background: linear-gradient(135deg, #fff 0%, #00ffc8 30%, #ff00ff 50%, #00ffc8 70%, #fff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.rhythm-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
  letter-spacing: 2px;
}

.cards-container {
  position: absolute;
  inset: 0;
  z-index: 5;
}

.rhythm-card {
  position: absolute;
  width: 200px;
  height: 280px;
  cursor: pointer;
  transform-style: preserve-3d;
  backface-visibility: hidden;

  &:hover {
    .card-inner {
      border-color: rgba(0, 255, 200, 0.5);
      box-shadow:
        0 30px 60px rgba(0, 0, 0, 0.5),
        0 0 50px rgba(0, 255, 200, 0.15);
    }

    .card-waveform {
      .wave-bar {
        animation-play-state: running;
      }
    }

    .card-glow {
      opacity: 0.3;
    }
  }
}

.card-pulse-ring {
  position: absolute;
  inset: -10px;
  border-radius: 20px;
  border: 1px solid rgba(0, 255, 200, 0.2);
  animation: cardPulse 2s ease-in-out infinite;
  opacity: 0;

  @keyframes cardPulse {
    0%, 100% { transform: scale(0.95); opacity: 0.2; }
    50% { transform: scale(1.05); opacity: 0.4; }
  }
}

.rhythm-card:hover .card-pulse-ring {
  opacity: 1;
}

.card-inner {
  width: 100%;
  height: 100%;
  background: linear-gradient(145deg, rgba(10, 20, 40, 0.95), rgba(20, 10, 40, 0.9));
  border: 1px solid rgba(0, 255, 200, 0.2);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  transition: all 0.4s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0, 255, 200, 0.5), transparent);
  }
}

.card-waveform {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 3px;
  height: 40px;
  margin-bottom: 16px;

  .wave-bar {
    width: 4px;
    background: linear-gradient(180deg, #00ffc8, #ff00ff);
    border-radius: 2px;
    animation: waveJump 0.5s ease-in-out infinite alternate;
    animation-play-state: paused;

    @keyframes waveJump {
      0% { height: 8px; }
      100% { height: 30px; }
    }
  }
}

.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 8px;
}

.card-number {
  font-family: 'Orbitron', sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: rgba(0, 255, 200, 0.5);
  letter-spacing: 2px;
}

.card-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  margin: 0;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.card-desc {
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.4;
  margin: 0;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid rgba(0, 255, 200, 0.1);
  margin-top: auto;
}

.card-freq {
  font-family: 'Orbitron', sans-serif;
  font-size: 10px;
  font-weight: 500;
  color: rgba(0, 255, 200, 0.7);
  letter-spacing: 1px;
}

.card-dot {
  width: 8px;
  height: 8px;
  background: #00ffc8;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(0, 255, 200, 0.5);
  animation: dotPulse 1s ease-in-out infinite;
}

@keyframes dotPulse {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

.card-glow {
  position: absolute;
  inset: -30px;
  background: radial-gradient(ellipse at center, rgba(0, 255, 200, 0.1) 0%, transparent 70%);
  filter: blur(20px);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.rhythm-footer {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  z-index: 20;
}

.beat-indicator {
  display: flex;
  gap: 6px;

  .beat-bar {
    width: 4px;
    height: 20px;
    background: rgba(0, 255, 200, 0.3);
    border-radius: 2px;
    animation: beatJump 0.6s ease-in-out infinite;

    @for $i from 1 through 8 {
      &:nth-child(#{$i}) {
        animation-delay: #{$i * 0.08}s;
      }
    }

    @keyframes beatJump {
      0%, 100% { height: 10px; opacity: 0.3; }
      50% { height: 25px; opacity: 1; background: rgba(0, 255, 200, 0.8); }
    }
  }
}

.footer-text {
  font-family: 'Orbitron', sans-serif;
  font-size: 10px;
  font-weight: 500;
  color: rgba(0, 255, 200, 0.5);
  letter-spacing: 3px;
}

@media (max-width: 1200px) {
  .rhythm-card {
    width: 170px;
    height: 250px;
  }

  .rhythm-title {
    font-size: 40px;
    letter-spacing: 10px;
  }
}

@media (max-width: 768px) {
  .rhythm-card {
    width: 150px;
    height: 220px;
  }

  .rhythm-title {
    font-size: 28px;
    letter-spacing: 6px;
  }

  .rhythm-subtitle {
    font-size: 11px;
    padding: 0 20px;
  }

  .card-title {
    font-size: 13px;
  }

  .card-desc {
    font-size: 9px;
  }
}

@media (max-width: 480px) {
  .rhythm-card {
    width: 130px;
    height: 190px;
  }

  .rhythm-title {
    font-size: 20px;
    letter-spacing: 4px;
  }

  .card-waveform {
    height: 30px;
    .wave-bar {
      width: 3px;
    }
  }

  .card-body {
    gap: 6px;
  }

  .card-title {
    font-size: 11px;
  }
}
</style>
