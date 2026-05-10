<template>
  <section ref="sectionRef" class="matrix-section">
    <!-- 数字雨背景 -->
    <canvas ref="canvasRef" class="matrix-canvas"></canvas>

    <!-- 主容器 -->
    <div class="matrix-container">
      <!-- 标题 -->
      <div ref="titleRef" class="matrix-title-wrapper">
        <h1 class="matrix-title">
          <span class="title-char" v-for="(char, i) in 'MATRIX'" :key="i">{{ char }}</span>
        </h1>
        <p class="matrix-subtitle">SYSTEM BREACH DETECTED</p>
        <div class="matrix-status">
          <span class="status-dot"></span>
          <span>UPLOADING NEURAL LINK</span>
        </div>
      </div>

      <!-- 黑客卡片 -->
      <div ref="cardsRef" class="matrix-cards">
        <div
          v-for="(card, index) in cards"
          :key="card.id"
          class="matrix-card"
          :ref="el => setCardRef(index, el as HTMLElement)"
        >
          <!-- 扫描线 -->
          <div class="card-scan"></div>
          <!-- 边框 -->
          <div class="card-border">
            <div class="border-line top"></div>
            <div class="border-line right"></div>
            <div class="border-line bottom"></div>
            <div class="border-line left"></div>
          </div>
          <!-- 内容 -->
          <div class="card-content">
            <div class="card-header">
              <span class="card-id">{{ card.id }}</span>
              <span class="card-level" :style="{ color: card.color }">{{ card.level }}</span>
            </div>
            <div class="card-icon">{{ card.icon }}</div>
            <h3>{{ card.title }}</h3>
            <div class="card-progress">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: card.progress + '%', background: card.color }"></div>
              </div>
              <span>{{ card.progress }}%</span>
            </div>
            <div class="card-terminal">
              <span class="prompt">></span>
              <span class="cmd">{{ card.cmd }}</span>
              <span class="cursor">_</span>
            </div>
          </div>
          <!-- 矩阵叠加 -->
          <div class="matrix-overlay"></div>
        </div>
      </div>

      <!-- 底部信息 -->
      <div class="matrix-footer">
        <div class="data-stream">{{ dataStream }}</div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface MatrixCard {
  id: string
  title: string
  icon: string
  level: string
  progress: number
  cmd: string
  color: string
}

const sectionRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const cardsRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const cardRefs = ref<HTMLElement[]>([])
const dataStream = ref('')

const cards: MatrixCard[] = [
  { id: '#SYS_001', title: 'FIREWALL BREACH', icon: '🔥', level: 'CRITICAL', progress: 87, cmd: 'bypass.protocol', color: '#ff0040' },
  { id: '#SYS_002', title: 'DATA EXTRACT', icon: '📡', level: 'HIGH', progress: 64, cmd: 'extract.encrypted', color: '#00ff88' },
  { id: '#SYS_003', title: 'NEURAL LINK', icon: '🧠', level: 'ACTIVE', progress: 92, cmd: 'connect.cortex', color: '#00d4ff' },
  { id: '#SYS_004', title: 'ICE BREAKER', icon: '💀', level: 'PENETRATED', progress: 45, cmd: 'crack.security', color: '#a855f7' }
]

const setCardRef = (index: number, el: HTMLElement | null) => {
  if (el) cardRefs.value[index] = el
}

let cleanupFns: (() => void)[] = []
let animationId: number | null = null

// 数字雨动画
const initMatrixRain = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const charArray = chars.split('')

  const fontSize = 14
  const columns = Math.floor(canvas.width / fontSize)
  const drops: number[] = new Array(columns).fill(1)

  const draw = () => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = '#0f0'
    ctx.font = `${fontSize}px monospace`

    for (let i = 0; i < drops.length; i++) {
      const char = charArray[Math.floor(Math.random() * charArray.length)]
      const x = i * fontSize
      const y = drops[i] * fontSize

      const hue = Math.random() > 0.9 ? '#0ff' : '#0f0'
      ctx.fillStyle = hue
      ctx.fillText(char, x, y)

      if (y > canvas.height && Math.random() > 0.975) {
        drops[i] = 0
      }
      drops[i]++
    }

    animationId = requestAnimationFrame(draw)
  }

  draw()

  window.addEventListener('resize', () => {
    if (canvas) {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
  })
}

// 数据流动画
const updateDataStream = () => {
  const chars = '01'
  let result = ''
  for (let i = 0; i < 100; i++) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  dataStream.value = result
}

const initAnimations = () => {
  if (!sectionRef.value) return

  initMatrixRain()
  updateDataStream()
  setInterval(updateDataStream, 100)

  if (titleRef.value) {
    const chars = titleRef.value.querySelectorAll('.title-char')
    gsap.fromTo(
      chars,
      { opacity: 0, y: -50, skewX: -20 },
      {
        opacity: 1,
        y: 0,
        skewX: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out'
      }
    )

    const subtitle = titleRef.value.querySelector('.matrix-subtitle')
    const status = titleRef.value.querySelector('.matrix-status')
    if (subtitle) {
      gsap.fromTo(subtitle, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.6, delay: 0.8 })
    }
    if (status) {
      gsap.fromTo(status, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.6, delay: 1 })
    }
  }

  cardRefs.value.forEach((card, index) => {
    gsap.set(card, {
      opacity: 0,
      y: 100,
      scale: 0.8,
      rotateY: -30,
      z: -100
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
      rotateY: 0,
      z: 0,
      duration: 1
    })

    const scan = card.querySelector('.card-scan')
    if (scan) {
      gsap.fromTo(
        scan,
        { y: '-100%' },
        {
          y: '200%',
          duration: 2,
          repeat: -1,
          ease: 'none',
          delay: index * 0.3
        }
      )
    }

    const borderLines = card.querySelectorAll('.border-line')
    gsap.to(borderLines, {
      borderColor: cards[index].color,
      boxShadow: `0 0 20px ${cards[index].color}`,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })

    const cursor = card.querySelector('.cursor')
    if (cursor) {
      gsap.to(cursor, {
        opacity: 0,
        duration: 0.5,
        repeat: -1,
        yoyo: true
      })
    }

    const progressFill = card.querySelector('.progress-fill')
    if (progressFill) {
      gsap.fromTo(
        progressFill,
        { width: '0%' },
        {
          width: cards[index].progress + '%',
          duration: 2,
          ease: 'power2.out'
        }
      )
    }

    cleanupFns.push(() => {
      if (scan) gsap.killTweensOf(scan)
      gsap.killTweensOf(borderLines)
      if (cursor) gsap.killTweensOf(cursor)
      if (progressFill) gsap.killTweensOf(progressFill)
    })
  })

  const statusDot = sectionRef.value?.querySelector('.status-dot')
  if (statusDot) {
    gsap.to(statusDot, {
      opacity: 1,
      scale: 1.5,
      boxShadow: '0 0 20px #0f0',
      duration: 0.3,
      repeat: -1,
      yoyo: true
    })
  }
}

onMounted(() => {
  setTimeout(initAnimations, 100)
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  if (animationId) cancelAnimationFrame(animationId)
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
})
</script>

<style scoped lang="scss">
.matrix-section {
  width: 100vw;
  height: 100vh;
  background: #000;
  position: relative;
  overflow: hidden;
}

.matrix-canvas {
  position: absolute;
  inset: 0;
  opacity: 0.3;
}

.matrix-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.matrix-title-wrapper {
  text-align: center;
  margin-bottom: 60px;
  perspective: 1000px;
}

.matrix-title {
  font-size: clamp(48px, 10vw, 100px);
  font-weight: 900;
  margin: 0;
  color: #0f0;
  text-shadow: 0 0 10px #0f0, 0 0 20px #0f0, 0 0 40px #0f0;
  letter-spacing: 15px;
}

.title-char {
  display: inline-block;
}

.matrix-subtitle {
  font-size: 14px;
  color: #f00;
  letter-spacing: 8px;
  margin: 20px 0;
  animation: glitch 0.3s infinite;
}

@keyframes glitch {
  0%, 100% { text-shadow: 2px 0 #0ff, -2px 0 #f00; }
  50% { text-shadow: -2px 0 #0ff, 2px 0 #f00; }
}

.matrix-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 12px;
  color: #0f0;
  letter-spacing: 3px;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #0f0;
  border-radius: 50%;
}

.matrix-cards {
  display: flex;
  gap: 30px;
  perspective: 1500px;
}

.matrix-card {
  width: 220px;
  height: 320px;
  background: rgba(0, 10, 0, 0.9);
  border: 1px solid #0f0;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
  transform-style: preserve-3d;
  box-shadow:
    0 0 30px rgba(0, 255, 0, 0.2),
    inset 0 0 60px rgba(0, 255, 0, 0.05);
}

.card-scan {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(0, 255, 0, 0.1) 50%,
    transparent 100%
  );
  z-index: 10;
  pointer-events: none;
}

.card-border {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.border-line {
  position: absolute;
  border: 1px solid #0f0;

  &.top { top: 0; left: 0; right: 0; }
  &.bottom { bottom: 0; left: 0; right: 0; }
  &.left { top: 0; bottom: 0; left: 0; }
  &.right { top: 0; bottom: 0; right: 0; }
}

.card-content {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
  z-index: 1;
}

.card-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.card-id {
  font-size: 10px;
  color: #0f0;
  font-family: monospace;
  opacity: 0.7;
}

.card-level {
  font-size: 10px;
  font-weight: bold;
  text-shadow: 0 0 10px currentColor;
}

.card-icon {
  font-size: 48px;
  text-align: center;
  margin: 20px 0;
  filter: drop-shadow(0 0 20px #0f0);
}

.card-content h3 {
  font-size: 14px;
  color: #0f0;
  margin: 0 0 20px;
  text-align: center;
  letter-spacing: 2px;
  text-shadow: 0 0 10px #0f0;
}

.card-progress {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.progress-bar {
  flex: 1;
  height: 4px;
  background: rgba(0, 255, 0, 0.2);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 2px;
  box-shadow: 0 0 10px currentColor;
}

.card-progress span {
  font-size: 10px;
  color: #0f0;
  font-family: monospace;
}

.card-terminal {
  background: rgba(0, 20, 0, 0.5);
  padding: 10px;
  border-radius: 2px;
  font-family: monospace;
  font-size: 11px;
  display: flex;
  gap: 5px;
}

.prompt {
  color: #0f0;
}

.cmd {
  color: #0ff;
}

.cursor {
  color: #0f0;
}

.matrix-overlay {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 255, 0, 0.03) 2px,
    rgba(0, 255, 0, 0.03) 4px
  );
  pointer-events: none;
}

.matrix-footer {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  overflow: hidden;
}

.data-stream {
  font-family: monospace;
  font-size: 10px;
  color: rgba(0, 255, 0, 0.5);
  white-space: nowrap;
  animation: scroll-data 20s linear infinite;
}

@keyframes scroll-data {
  from { transform: translateX(100%); }
  to { transform: translateX(-100%); }
}
</style>
