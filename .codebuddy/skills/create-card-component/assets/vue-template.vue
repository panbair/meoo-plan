<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ==================== Props ====================
interface Props {
  imageUrl?: string
  title?: string
  subtitle?: string
}

const props = withDefaults(defineProps<Props>(), {
  imageUrl: '',
  title: '标题',
  subtitle: '副标题',
})

// ==================== Refs ====================
const containerRef = ref<HTMLElement>()
const stageRef = ref<HTMLElement>()
const canvasRef = ref<HTMLCanvasElement>()

// ==================== Animation State ====================
const progress = ref(0)

// ==================== Canvas Particle System ====================
let animationFrameId: number | null = null
let ctx: CanvasRenderingContext2D | null = null

interface Particle {
  x: number
  y: number
  r: number
  vx: number
  vy: number
  alpha: number
}

const particles: Particle[] = []

function initCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return
  ctx = canvas.getContext('2d')
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
  createParticles()
}

function resizeCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

function createParticles() {
  const count = 50
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 2 + 1,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      alpha: Math.random() * 0.5 + 0.2,
    })
  }
}

function animateParticles() {
  if (!ctx) return
  const canvas = canvasRef.value
  if (!canvas) return
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  for (const p of particles) {
    p.x += p.vx
    p.y += p.vy
    if (p.x < 0) p.x = canvas.width
    if (p.x > canvas.width) p.x = 0
    if (p.y < 0) p.y = canvas.height
    if (p.y > canvas.height) p.y = 0

    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`
    ctx.fill()
  }
  animationFrameId = requestAnimationFrame(animateParticles)
}

// ==================== ScrollTrigger Animation ====================
function setupScrollAnimation() {
  const container = containerRef.value
  if (!container) return

  ScrollTrigger.create({
    trigger: container,
    start: 'top 90%',
    end: 'bottom 10%',
    scrub: 1.2,
    onUpdate: (self) => {
      progress.value = self.progress
      // TODO: Implement component-specific animation logic here
      // Example: animate elements based on self.progress (0 → 1)
    },
    onLeaveBack: () => {
      // TODO: Reset all elements to initial state
    },
  })

  // Text entrance animation (independent of scrub)
  gsap.fromTo(
    '.ComponentName-text-title',
    { y: 60, opacity: 0, filter: 'blur(10px)' },
    {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: container,
        start: 'top 85%',
      },
    },
  )
}

// ==================== Lifecycle ====================
onMounted(() => {
  initCanvas()
  animateParticles()
  setupScrollAnimation()
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeCanvas)
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
  ScrollTrigger.getAll().forEach((st) => st.kill())
})
</script>

<template>
  <div ref="containerRef" class="ComponentName">
    <!-- Layer 1: Particle Background (z-index: 1) -->
    <canvas ref="canvasRef" class="ComponentName-canvas"></canvas>

    <!-- Layer 2: Main Stage (z-index: 2) -->
    <div ref="stageRef" class="ComponentName-stage">
      <!-- TODO: Add component-specific stage elements here -->
    </div>

    <!-- Layer 3: Center Element (z-index: 3) -->
    <div class="ComponentName-center">
      <!-- TODO: Add center glow/pulse element -->
    </div>

    <!-- Layer 4: Reflection/Ground (z-index: 4) -->
    <div class="ComponentName-ground">
      <!-- TODO: Add ground reflection element -->
    </div>

    <!-- Layer 5: Vignette (z-index: 8) -->
    <div class="ComponentName-vignette"></div>

    <!-- Layer 6: Overlay Text & Progress (z-index: 14-15) -->
    <div class="ComponentName-text-overlay">
      <h2 class="ComponentName-text-title">{{ props.title }}</h2>
      <div class="ComponentName-text-divider"></div>
      <p class="ComponentName-text-subtitle">{{ props.subtitle }}</p>
      <div class="ComponentName-progress-bar">
        <div
          class="ComponentName-progress-fill"
          :style="{ width: `${progress * 100}%` }"
        ></div>
      </div>
    </div>

    <!-- Scroll hint -->
    <div class="ComponentName-scroll-hint">
      <span class="ComponentName-scroll-arrow">↓</span>
      <span class="ComponentName-scroll-text">滚动探索</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ComponentName {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  // Deep space background
  background: radial-gradient(ellipse at center, #1a1a2e 0%, #0a0a15 70%, #000 100%);

  // ===== Layer 1: Canvas (z-index: 1) =====
  &-canvas {
    position: absolute;
    inset: 0;
    z-index: 1;
  }

  // ===== Layer 2: Stage (z-index: 2) =====
  &-stage {
    position: absolute;
    inset: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    perspective: 1400px;
    perspective-origin: 50% 42%;
  }

  // ===== Layer 3: Center (z-index: 3) =====
  &-center {
    position: absolute;
    inset: 0;
    z-index: 3;
    pointer-events: none;
  }

  // ===== Layer 4: Ground (z-index: 4) =====
  &-ground {
    position: absolute;
    inset: 0;
    z-index: 4;
    pointer-events: none;
  }

  // ===== Layer 5: Vignette (z-index: 8) =====
  &-vignette {
    position: absolute;
    inset: 0;
    z-index: 8;
    pointer-events: none;
    background:
      radial-gradient(ellipse at center, transparent 55%, rgba(0, 0, 0, 0.5) 100%);
    opacity: 0.3;
  }

  // ===== Layer 6: Text Overlay (z-index: 14-15) =====
  &-text-overlay {
    position: absolute;
    bottom: 8%;
    left: 5%;
    z-index: 14;
    pointer-events: none;
  }

  &-text-title {
    font-size: clamp(2rem, 5vw, 4rem);
    font-weight: 700;
    color: #fff;
    margin: 0 0 0.25em;
    text-shadow: 0 0 40px rgba(255, 255, 255, 0.3);
    letter-spacing: 0.04em;
  }

  &-text-divider {
    width: 80px;
    height: 3px;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.6), transparent);
    margin: 0.5em 0;
  }

  &-text-subtitle {
    font-size: clamp(0.9rem, 1.5vw, 1.3rem);
    color: rgba(255, 255, 255, 0.65);
    margin: 0;
    letter-spacing: 0.06em;
  }

  &-progress-bar {
    margin-top: 1.5em;
    width: 200px;
    height: 2px;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 1px;
    overflow: hidden;
  }

  &-progress-fill {
    height: 100%;
    background: #fff;
    border-radius: 1px;
    transition: width 0.1s linear;
  }

  // ===== Scroll Hint =====
  &-scroll-hint {
    position: absolute;
    bottom: 3%;
    right: 5%;
    z-index: 15;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    color: rgba(255, 255, 255, 0.4);
  }

  &-scroll-arrow {
    font-size: 1.2rem;
    animation: scrollBounce 2s ease-in-out infinite;
  }

  &-scroll-text {
    font-size: 0.75rem;
    letter-spacing: 0.1em;
    animation: scrollBlink 2s ease-in-out infinite;
  }
}

@keyframes scrollBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(6px); }
}

@keyframes scrollBlink {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}
</style>
