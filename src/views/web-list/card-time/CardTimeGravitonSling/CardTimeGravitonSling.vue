<template>
  <section ref="containerRef" class="graviton-sling">
    <!-- 粒子画布层 -->
    <canvas ref="trailCanvasRef" class="trail-canvas"></canvas>

    <!-- 背景星云 -->
    <div class="nebula-bg">
      <div v-for="i in 6" :key="i" class="nebula-cloud" :style="getNebulaStyle(i)"></div>
    </div>

    <!-- 引力场指示器 -->
    <div ref="gravityFieldRef" class="gravity-field">
      <div class="gravity-ring ring-1"></div>
      <div class="gravity-ring ring-2"></div>
      <div class="gravity-ring ring-3"></div>
      <div class="gravity-core"></div>
    </div>

    <!-- 标题区域 -->
    <div ref="headerRef" class="sling-header">
      <div ref="badgeRef" class="sling-badge">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
        </svg>
        <span>GRAVITON SLING</span>
      </div>
      <h1 ref="titleRef" class="sling-title">LIGHT YEAR TRAJECTORY</h1>
      <p ref="subtitleRef" class="sling-subtitle">
        Witness the cosmic acceleration through dimensional rifts
      </p>
    </div>

    <!-- 卡片容器 -->
    <div ref="cardsContainerRef" class="cards-container">
      <div
        v-for="(card, index) in cards"
        :key="card.id"
        :ref="el => setCardRef(el, index)"
        class="sling-card"
        :data-index="index"
      >
        <div class="card-trail-glow"></div>
        <div class="card-inner">
          <div class="card-singularity">
            <div class="singularity-ring"></div>
            <div class="singularity-core"></div>
          </div>
          <div class="card-body">
            <span class="card-id">{{ card.id }}</span>
            <h3 class="card-title">{{ card.title }}</h3>
            <p class="card-desc">{{ card.desc }}</p>
          </div>
          <div class="card-footer">
            <span class="card-energy">{{ card.energy }}</span>
            <span class="card-mass">{{ card.mass }}</span>
          </div>
        </div>
        <div class="card-light-streak"></div>
      </div>
    </div>

    <!-- 底部状态 -->
    <div ref="footerRef" class="sling-footer">
      <div ref="progressRef" class="slingshot-progress">
        <div class="progress-track">
          <div ref="progressBarRef" class="progress-fill"></div>
        </div>
        <span class="progress-label">RIFT DEPTH: <span ref="progressValueRef">0</span>%</span>
      </div>
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
  title: string
  desc: string
  energy: string
  mass: string
}

const cards: Card[] = [
  { id: 1, title: 'Antimatter', desc: 'Opposite matter creating quantum void', energy: '1.8TeV', mass: '0.511MeV' },
  { id: 2, title: 'Dark Energy', desc: 'Accelerating cosmic expansion', energy: '3.2μeV', mass: '∞' },
  { id: 3, title: 'Quantum Foam', desc: 'Spacetime at Planck scale', energy: '1.22TeV', mass: '21.1μg' },
  { id: 4, title: 'Neutrino Wind', desc: 'Ghost particles traversing dimensions', energy: '0.1eV', mass: '<0.12eV' },
  { id: 5, title: 'Graviton', desc: 'Force carrier of gravity', energy: '10^-33GeV', mass: '10^-66g' },
  { id: 6, title: 'Higgs Field', desc: 'Giving mass to particles', energy: '126GeV', mass: '125GeV' },
  { id: 7, title: 'String Vibration', desc: 'Fundamental cosmic strings', energy: '10^19GeV', mass: '10^-8kg' },
  { id: 8, title: 'Vacuum State', desc: 'Lowest energy quantum state', energy: '-0.5ℏω', mass: '0' },
  { id: 9, title: 'Cosmic Ray', desc: 'High-energy particles from space', energy: '10^20eV', mass: 'proton' },
  { id: 10, title: 'Hawking Radiation', desc: 'Black hole quantum emission', energy: 'T = ℏc³/8πGMk', mass: 'variable' },
  { id: 11, title: 'Zero Point', desc: 'Quantum vacuum fluctuation', energy: '1/2ℏω', mass: 'virtual' },
  { id: 12, title: 'Cosmic Origin', desc: 'The birth of everything', energy: '∞', mass: '0' }
]

// Refs
const containerRef = ref<HTMLElement | null>(null)
const trailCanvasRef = ref<HTMLCanvasElement | null>(null)
const gravityFieldRef = ref<HTMLElement | null>(null)
const cardsContainerRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const badgeRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const progressRef = ref<HTMLElement | null>(null)
const progressBarRef = ref<HTMLElement | null>(null)
const progressValueRef = ref<HTMLElement | null>(null)

const cardRefs = ref<(HTMLElement | null)[]>([])
const setCardRef = (el: any, index: number) => {
  if (el) cardRefs.value[index] = el
}

// Trail storage
interface TrailPoint {
  x: number
  y: number
  time: number
  color: string
}

const trails: TrailPoint[][] = []
const trailMaxAge = 1.8

// Colors for cards
const cardColors = [
  '#00f5ff', '#ff00ff', '#00ff88', '#ffff00',
  '#ff6600', '#ff0066', '#6600ff', '#00ffcc',
  '#ff3300', '#33ff00', '#ff00cc', '#0099ff'
]

// Nebula styles
const getNebulaStyle = (index: number) => {
  const hue = 180 + index * 30
  const size = 200 + index * 80
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${10 + index * 15}%`,
    top: `${5 + (index % 4) * 25}%`,
    background: `radial-gradient(circle, hsla(${hue}, 80%, 50%, 0.08) 0%, transparent 70%)`,
    animationDelay: `${index * 0.8}s`,
    animationDuration: `${20 + index * 3}s`
  }
}

// Bezier path calculation
const getBezierPoint = (
  t: number,
  start: { x: number; y: number },
  control: { x: number; y: number },
  end: { x: number; y: number }
) => {
  const u = 1 - t
  return {
    x: u * u * start.x + 2 * u * t * control.x + t * t * end.x,
    y: u * u * start.y + 2 * u * t * control.y + t * t * end.y
  }
}

// Cleanup functions
let tl: gsap.core.Timeline | null = null
let st: ScrollTrigger | null = null
let animationFrameId: number | null = null
let ctx: CanvasRenderingContext2D | null = null

// Draw light trails
const drawTrails = (now: number) => {
  if (!trailCanvasRef.value || !ctx) return

  ctx.clearRect(0, 0, trailCanvasRef.value.width, trailCanvasRef.value.height)

  trails.forEach((points, cardIndex) => {
    if (points.length < 2) return

    const color = cardColors[cardIndex % cardColors.length]

    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i]
      const p2 = points[i + 1]
      const age1 = now - p1.time
      const age2 = now - p2.time

      if (age1 > trailMaxAge || age2 > trailMaxAge) continue

      const alpha1 = Math.max(0, 1 - age1 / trailMaxAge)
      const alpha2 = Math.max(0, 1 - age2 / trailMaxAge)

      const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y)
      gradient.addColorStop(0, color.replace(')', `, ${alpha1})`).replace('rgb', 'rgba').replace('#', 'rgba(').replace(/([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/i, (_, r, g, b) => `${parseInt(r, 16)}, ${parseInt(g, 16)}, ${parseInt(b, 16)}`))

      ctx.beginPath()
      ctx.moveTo(p1.x, p1.y)
      ctx.lineTo(p2.x, p2.y)
      ctx.strokeStyle = color
      ctx.globalAlpha = alpha1 * 0.8
      ctx.lineWidth = 3 * alpha1 + 1
      ctx.lineCap = 'round'
      ctx.stroke()
    }
  })

  ctx.globalAlpha = 1

  // Clean old points
  trails.forEach(arr => {
    while (arr.length > 0 && now - arr[0].time > trailMaxAge) {
      arr.shift()
    }
  })
}

// Animation loop
const startTrailAnimation = () => {
  const animate = () => {
    const now = performance.now() / 1000
    drawTrails(now)
    animationFrameId = requestAnimationFrame(animate)
  }
  animate()
}

const stopTrailAnimation = () => {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
}

// Main init
const initAnimation = async () => {
  await nextTick()

  const container = containerRef.value
  const canvas = trailCanvasRef.value
  const cardsContainer = cardsContainerRef.value
  const allCards = cardRefs.value.filter(Boolean) as HTMLElement[]

  if (!container || !canvas || !cardsContainer || !allCards.length) return

  // Setup canvas
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  ctx = canvas.getContext('2d')
  trails.forEach(() => {})
  allCards.forEach(() => trails.push([]))

  const vw = window.innerWidth
  const vh = window.innerHeight
  const cardW = 220
  const cardH = 300

  // Calculate final grid positions (4x3)
  const cols = 4
  const rows = 3
  const gapX = 40
  const gapY = 30
  const totalW = cols * cardW + (cols - 1) * gapX
  const totalH = rows * cardH + (rows - 1) * gapY
  const startX = (vw - totalW) / 2
  const startY = (vh - totalH) / 2 + 40

  const finalPositions = allCards.map((_, i) => {
    const col = i % cols
    const row = Math.floor(i / cols)
    return {
      x: startX + col * (cardW + gapX),
      y: startY + row * (cardH + gapY),
      w: cardW,
      h: cardH
    }
  })

  // Center point (singularity)
  const centerX = vw / 2 - cardW / 2
  const centerY = vh / 2 - cardH / 2

  // Calculate bezier paths for each card
  const paths = allCards.map((_, i) => {
    const start = { x: centerX, y: centerY }
    const end = { x: finalPositions[i].x, y: finalPositions[i].y }

    // Control point creates arc away from center
    const midX = (start.x + end.x) / 2
    const midY = (start.y + end.y) / 2
    const dx = end.x - start.x
    const dy = end.y - start.y
    const dist = Math.sqrt(dx * dx + dy * dy)

    // Perpendicular offset for arc
    const perpX = -dy / (dist || 1)
    const perpY = dx / (dist || 1)
    const arcHeight = dist * 0.6 * (i % 2 === 0 ? 1 : -1) * (1 + Math.random() * 0.3)

    return {
      start,
      control: {
        x: midX + perpX * arcHeight,
        y: midY + perpY * arcHeight - dist * 0.3 // Arc upward
      },
      end
    }
  })

  // Initialize cards at singularity
  allCards.forEach((card, i) => {
    gsap.set(card, {
      x: centerX,
      y: centerY,
      scale: 0,
      rotation: i % 2 === 0 ? 180 : -180,
      opacity: 0,
      filter: 'brightness(3) blur(8px)',
      force3D: true
    })
  })

  // Initialize gravity field
  gsap.set(gravityFieldRef.value, {
    scale: 0,
    opacity: 0
  })

  // Initialize header
  gsap.set([badgeRef.value, titleRef.value, subtitleRef.value], {
    opacity: 0,
    y: -40,
    filter: 'blur(10px)'
  })

  // Initialize footer
  gsap.set(footerRef.value, {
    opacity: 0,
    y: 30
  })

  // Create timeline
  tl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top 80%',
      end: 'top 10%',
      scrub: 2,
      onUpdate: (self) => {
        // Update trails
        const now = performance.now() / 1000
        allCards.forEach((card, i) => {
          const x = gsap.getProperty(card, 'x') as number
          const y = gsap.getProperty(card, 'y') as number
          const prevPoint = trails[i][trails[i].length - 1]

          if (!prevPoint || Math.abs(prevPoint.x - x) > 2 || Math.abs(prevPoint.y - y) > 2) {
            trails[i].push({
              x: x + cardW / 2,
              y: y + cardH / 2,
              time: now,
              color: cardColors[i % cardColors.length]
            })
          }
        })

        // Update progress
        if (progressValueRef.value) {
          progressValueRef.value.textContent = Math.round(self.progress * 100).toString()
        }
        if (progressBarRef.value) {
          gsap.set(progressBarRef.value, { scaleX: self.progress })
        }
      },
      onEnter: () => {
        startTrailAnimation()
      },
      onLeaveBack: () => {
        stopTrailAnimation()
        trails.forEach(t => t.length = 0)
      }
    }
  })

  // Gravity field appear
  tl.to(gravityFieldRef.value, {
    scale: 1,
    opacity: 1,
    duration: 0.8,
    ease: 'power2.out'
  }, 0)

  // Header appear
  tl.to([badgeRef.value, titleRef.value, subtitleRef.value], {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    stagger: 0.1,
    duration: 0.8
  }, 0.2)

  // Cards fly out with bezier paths
  allCards.forEach((card, i) => {
    const path = paths[i]
    const progressObj = { t: 0 }

    // Custom bezier animation
    tl!.to(progressObj, {
      t: 1,
      duration: 1.5,
      ease: 'power3.out',
      onUpdate: () => {
        const pos = getBezierPoint(progressObj.t, path.start, path.control, path.end)
        gsap.set(card, { x: pos.x, y: pos.y })
      }
    }, i * 0.06)

    // Scale, rotation, opacity
    tl!.to(card, {
      scale: 1,
      rotation: 0,
      opacity: 1,
      filter: 'brightness(1) blur(0px)',
      duration: 1.5,
      ease: 'power3.out'
    }, i * 0.06)
  })

  // Footer appear
  tl.to(footerRef.value, {
    opacity: 1,
    y: 0,
    duration: 0.6
  }, 0.5)

  // Continuous floating after animation
  allCards.forEach((card, i) => {
    const floatY = -8 - Math.random() * 8
    tl!.to(card, {
      y: `+=${floatY}`,
      duration: 2.5 + Math.random(),
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    }, 1.5 + i * 0.1)
  })

  st = tl.scrollTrigger
}

// Handle resize
const handleResize = () => {
  if (st) st.kill()
  if (tl) tl.kill()
  stopTrailAnimation()
  trails.forEach(t => t.length = 0)
  nextTick(initAnimation)
}

onMounted(() => {
  initAnimation()
  window.addEventListener('resize', handleResize, { passive: true })
})

onUnmounted(() => {
  if (tl) tl.kill()
  if (st) st.kill()
  stopTrailAnimation()
  ScrollTrigger.getAll().forEach(instance => {
    if (instance.vars.trigger === containerRef.value) {
      instance.kill()
    }
  })
  gsap.killTweensOf('.sling-card')
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped lang="scss">
.graviton-sling {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, #0a0015 0%, #150030 50%, #0a0015 100%);
}

.trail-canvas {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 15;
}

.nebula-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;

  .nebula-cloud {
    position: absolute;
    border-radius: 50%;
    filter: blur(60px);
    animation: nebulaDrift linear infinite;

    @keyframes nebulaDrift {
      0% { transform: translate(0, 0) rotate(0deg); }
      50% { transform: translate(40px, -40px) rotate(180deg); }
      100% { transform: translate(0, 0) rotate(360deg); }
    }
  }
}

.gravity-field {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: 400px;
  pointer-events: none;
  z-index: 1;

  .gravity-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 1px solid rgba(0, 245, 255, 0.2);
    animation: gravityPulse 3s ease-in-out infinite;

    &.ring-1 {
      animation-delay: 0s;
      transform: scale(0.5);
    }

    &.ring-2 {
      animation-delay: 1s;
      transform: scale(0.75);
    }

    &.ring-3 {
      animation-delay: 2s;
      transform: scale(1);
    }

    @keyframes gravityPulse {
      0%, 100% { opacity: 0.2; transform: scale(var(--ring-scale, 1)); }
      50% { opacity: 0.4; }
    }
  }

  .gravity-core {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0, 245, 255, 0.3) 0%, transparent 70%);
    box-shadow: 0 0 100px rgba(0, 245, 255, 0.4);
    animation: coreGlow 2s ease-in-out infinite;
  }

  @keyframes coreGlow {
    0%, 100% { box-shadow: 0 0 100px rgba(0, 245, 255, 0.4); }
    50% { box-shadow: 0 0 150px rgba(0, 245, 255, 0.6); }
  }
}

.sling-header {
  position: absolute;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.sling-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 20px;
  background: rgba(0, 245, 255, 0.08);
  border: 1px solid rgba(0, 245, 255, 0.3);
  border-radius: 30px;
  font-family: 'Orbitron', sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: rgba(0, 245, 255, 0.9);
  letter-spacing: 3px;

  svg {
    width: 16px;
    height: 16px;
    color: #00f5ff;
  }
}

.sling-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 56px;
  font-weight: 700;
  color: #fff;
  margin: 0;
  letter-spacing: 10px;
  background: linear-gradient(135deg, #fff 0%, #00f5ff 30%, #ff00ff 50%, #00f5ff 70%, #fff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 60px rgba(0, 245, 255, 0.5);
}

.sling-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
  letter-spacing: 2px;
  max-width: 500px;
}

.cards-container {
  position: absolute;
  inset: 0;
  z-index: 5;
}

.sling-card {
  position: absolute;
  width: 220px;
  height: 300px;
  cursor: pointer;
  transform-style: preserve-3d;
  backface-visibility: hidden;

  &:hover {
    .card-inner {
      border-color: rgba(0, 245, 255, 0.5);
      box-shadow:
        0 30px 60px rgba(0, 0, 0, 0.5),
        0 0 40px rgba(0, 245, 255, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
    }

    .card-singularity {
      transform: translate(-50%, -50%) scale(1.1);
    }

    .singularity-ring {
      animation-duration: 1s;
    }
  }
}

.card-trail-glow {
  position: absolute;
  inset: -20px;
  background: radial-gradient(ellipse at center, rgba(0, 245, 255, 0.15) 0%, transparent 70%);
  filter: blur(15px);
  pointer-events: none;
}

.card-inner {
  width: 100%;
  height: 100%;
  background: linear-gradient(145deg, rgba(10, 0, 30, 0.95), rgba(20, 10, 40, 0.9));
  border: 1px solid rgba(0, 245, 255, 0.2);
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
    background: linear-gradient(90deg, transparent, rgba(0, 245, 255, 0.5), transparent);
  }
}

.card-singularity {
  position: absolute;
  top: 30px;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  transition: transform 0.4s ease;

  .singularity-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 1px solid rgba(0, 245, 255, 0.3);
    animation: singularityRotate 4s linear infinite;
  }

  .singularity-core {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0, 245, 255, 0.5) 0%, transparent 70%);
    box-shadow: 0 0 20px rgba(0, 245, 255, 0.3);
  }

  @keyframes singularityRotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
}

.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  text-align: center;
  gap: 10px;
  margin-top: 40px;
}

.card-id {
  font-family: 'Orbitron', sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: rgba(0, 245, 255, 0.5);
  letter-spacing: 2px;
}

.card-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin: 0;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.card-desc {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.5;
  margin: 0;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid rgba(0, 245, 255, 0.1);
  margin-top: auto;
}

.card-energy,
.card-mass {
  font-family: 'Orbitron', sans-serif;
  font-size: 10px;
  font-weight: 500;
  color: rgba(0, 245, 255, 0.7);
  letter-spacing: 1px;
}

.card-light-streak {
  position: absolute;
  top: 0;
  left: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(180deg, rgba(0, 245, 255, 0.5), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.sling-card:hover .card-light-streak {
  opacity: 1;
}

.sling-footer {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
}

.slingshot-progress {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.progress-track {
  width: 300px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #00f5ff, #ff00ff);
  border-radius: 2px;
  transform-origin: left;
}

.progress-label {
  font-family: 'Orbitron', sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 2px;
}

@media (max-width: 1200px) {
  .sling-card {
    width: 180px;
    height: 260px;
  }

  .sling-title {
    font-size: 42px;
    letter-spacing: 8px;
  }

  .card-title {
    font-size: 14px;
  }
}

@media (max-width: 768px) {
  .sling-card {
    width: 150px;
    height: 220px;
  }

  .sling-title {
    font-size: 28px;
    letter-spacing: 6px;
  }

  .sling-subtitle {
    font-size: 11px;
    padding: 0 20px;
  }

  .card-desc {
    font-size: 9px;
  }

  .progress-track {
    width: 200px;
  }
}

@media (max-width: 480px) {
  .sling-card {
    width: 130px;
    height: 190px;
  }

  .sling-title {
    font-size: 20px;
    letter-spacing: 4px;
  }

  .card-singularity {
    width: 40px;
    height: 40px;
    top: 25px;
  }

  .card-body {
    margin-top: 30px;
  }

  .card-title {
    font-size: 12px;
  }
}
</style>
