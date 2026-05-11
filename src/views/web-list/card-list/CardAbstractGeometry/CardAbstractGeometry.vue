<template>
  <section ref="sectionRef" class="abstract-section">
    <!-- 主背景渐变层 -->
    <div class="bg-gradient-layer"></div>

    <!-- 网格背景 -->
    <canvas ref="gridCanvasRef" class="grid-canvas"></canvas>

    <!-- 粒子轨迹层 -->
    <canvas ref="trailCanvasRef" class="trail-canvas"></canvas>

    <!-- 几何形状层 -->
    <canvas ref="shapeCanvasRef" class="shape-canvas"></canvas>

    <!-- 粒子光点层 -->
    <canvas ref="particleCanvasRef" class="particle-canvas"></canvas>

    <!-- 摩尔纹叠加 -->
    <div class="moire-overlay"></div>

    <!-- 发光网格背景 -->
    <div class="glow-grid">
      <div v-for="i in 5" :key="i" class="glow-line" :style="{ '--delay': `${i * 0.5}s` }"></div>
    </div>

    <!-- 中心装饰 -->
    <div class="center-orb" ref="centerOrbRef">
      <div class="orb-core">
        <div class="orb-inner"></div>
        <div class="orb-ring orb-ring-1"></div>
        <div class="orb-ring orb-ring-2"></div>
        <div class="orb-ring orb-ring-3"></div>
        <div class="orb-particles">
          <span v-for="i in 8" :key="i" class="orb-dot" :style="{ '--i': i }"></span>
        </div>
      </div>
      <svg viewBox="0 0 100 100" class="orb-symbol">
        <defs>
          <linearGradient id="symbolGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#00d4ff" />
            <stop offset="50%" stop-color="#7c3aed" />
            <stop offset="100%" stop-color="#f472b6" />
          </linearGradient>
        </defs>
        <polygon points="50,15 85,75 15,75" fill="none" stroke="url(#symbolGrad)" stroke-width="2" />
        <circle cx="50" cy="55" r="12" fill="none" stroke="url(#symbolGrad)" stroke-width="1.5" />
      </svg>
    </div>

    <!-- 装饰性几何边框 -->
    <div class="geo-frame">
      <div class="frame-corner top-left">
        <div class="frame-line horizontal"></div>
        <div class="frame-line vertical"></div>
        <div class="frame-dot"></div>
      </div>
      <div class="frame-corner top-right">
        <div class="frame-line horizontal"></div>
        <div class="frame-line vertical"></div>
        <div class="frame-dot"></div>
      </div>
      <div class="frame-corner bottom-left">
        <div class="frame-line horizontal"></div>
        <div class="frame-line vertical"></div>
        <div class="frame-dot"></div>
      </div>
      <div class="frame-corner bottom-right">
        <div class="frame-line horizontal"></div>
        <div class="frame-line vertical"></div>
        <div class="frame-dot"></div>
      </div>
    </div>

    <!-- 标题区域 -->
    <div class="title-container" ref="titleRef">
      <div class="title-bg-text">GEOMETRIC</div>
      <h1 class="title-main">
        <span class="title-word">Abstract</span>
        <span class="title-accent">Art</span>
      </h1>
      <p class="title-sub">Creative Digital Experience</p>
      <div class="title-decoration">
        <span class="deco-line"></span>
        <span class="deco-diamond"></span>
        <span class="deco-line"></span>
      </div>
    </div>

    <!-- 环绕标签 -->
    <div class="orbit-labels">
      <span v-for="(label, i) in orbitLabels" :key="i"
            class="orbit-label"
            :style="{ '--angle': `${i * 60}deg`, '--delay': `${i * 0.2}s` }">
        {{ label }}
      </span>
    </div>

    <!-- 几何艺术卡片 -->
    <div class="geo-cards" ref="cardsRef">
      <div v-for="(card, index) in geoCards" :key="index" class="geo-card" :class="`card-${index + 1}`">
        <div class="card-visual">
          <svg viewBox="0 0 120 120" class="geo-svg" v-html="card.svgContent"></svg>
        </div>
        <div class="card-content">
          <span class="card-badge">{{ card.badge }}</span>
          <h3 class="card-title">{{ card.title }}</h3>
          <p class="card-desc">{{ card.description }}</p>
          <div class="card-tags">
            <span v-for="tag in card.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>
        <div class="card-border-anim"></div>
      </div>
    </div>

    <!-- 底部装饰线 -->
    <div class="bottom-deco" ref="bottomDecoRef">
      <svg viewBox="0 0 400 20" class="deco-svg">
        <defs>
          <linearGradient id="decoGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="transparent" />
            <stop offset="30%" stop-color="#00d4ff" />
            <stop offset="70%" stop-color="#7c3aed" />
            <stop offset="100%" stop-color="transparent" />
          </linearGradient>
        </defs>
        <path d="M0,10 Q100,0 200,10 T400,10" fill="none" stroke="url(#decoGrad)" stroke-width="1" />
        <circle cx="200" cy="10" r="3" fill="#00d4ff" />
      </svg>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface GeoShape {
  x: number; y: number; size: number; rotation: number; rotationSpeed: number
  type: 'triangle' | 'square' | 'hexagon' | 'octagon'
  color: string; opacity: number; pulsePhase: number; pulseSpeed: number
}

interface Particle {
  x: number; y: number; vx: number; vy: number; size: number
  opacity: number; hue: number; life: number; maxLife: number
}

interface Trail { x: number; y: number; opacity: number; size: number }

// 几何卡片数据
const geoCards = [
  {
    badge: '神圣几何',
    title: 'Sacred Geometry',
    description: '源自古代文明的黄金比例与几何美学，探索宇宙和谐之美',
    tags: ['黄金比例', '螺旋', '基础'],
    svgContent: `<circle cx="60" cy="60" r="45" fill="none" stroke="#00d4ff" stroke-width="1" opacity="0.3"/>
      <circle cx="60" cy="60" r="35" fill="none" stroke="#00d4ff" stroke-width="1" opacity="0.5"/>
      <circle cx="60" cy="60" r="25" fill="none" stroke="#7c3aed" stroke-width="1" opacity="0.5"/>
      <circle cx="60" cy="60" r="15" fill="none" stroke="#f472b6" stroke-width="1" opacity="0.7"/>
      <circle cx="60" cy="15" r="4" fill="#00d4ff"/>
      <circle cx="98" cy="78" r="4" fill="#7c3aed"/>
      <circle cx="22" cy="78" r="4" fill="#f472b6"/>`
  },
  {
    badge: '立体主义',
    title: 'Platonic Solids',
    description: '五大柏拉图多面体的数学完美与视觉震撼',
    tags: ['多面体', '3D', '进阶'],
    svgContent: `<polygon points="60,15 95,75 25,75" fill="none" stroke="#00d4ff" stroke-width="1.5"/>
      <polygon points="60,35 85,70 35,70" fill="none" stroke="#7c3aed" stroke-width="1.5"/>
      <line x1="60" y1="15" x2="60" y2="35" stroke="#f472b6" stroke-width="1"/>
      <line x1="95" y1="75" x2="85" y2="70" stroke="#f472b6" stroke-width="1"/>
      <line x1="25" y1="75" x2="35" y2="70" stroke="#f472b6" stroke-width="1"/>`
  },
  {
    badge: '密铺图案',
    title: 'Tessellation',
    description: '无限延伸的几何重复，创造视觉节奏与秩序',
    tags: ['重复', '平铺', '进阶'],
    svgContent: `<polygon points="30,20 50,20 60,40 50,60 30,60 20,40" fill="none" stroke="#00d4ff" stroke-width="1" transform="translate(15, 15)"/>
      <polygon points="30,20 50,20 60,40 50,60 30,60 20,40" fill="none" stroke="#7c3aed" stroke-width="1" transform="translate(55, 15)"/>
      <polygon points="30,20 50,20 60,40 50,60 30,60 20,40" fill="none" stroke="#f472b6" stroke-width="1" transform="translate(15, 55)"/>
      <polygon points="30,20 50,20 60,40 50,60 30,60 20,40" fill="none" stroke="#00d4ff" stroke-width="1" transform="translate(55, 55)"/>`
  },
  {
    badge: '生成艺术',
    title: 'Generative Art',
    description: '算法与数学之美交织的无限创作可能',
    tags: ['算法', '程序', '高级'],
    svgContent: `<circle cx="60" cy="60" r="40" fill="none" stroke="#00d4ff" stroke-width="0.5" opacity="0.3"/>
      <circle cx="60" cy="60" r="30" fill="none" stroke="#00d4ff" stroke-width="0.5" opacity="0.4"/>
      <circle cx="60" cy="60" r="20" fill="none" stroke="#7c3aed" stroke-width="0.5" opacity="0.5"/>
      <circle cx="60" cy="60" r="10" fill="none" stroke="#f472b6" stroke-width="1" opacity="0.7"/>
      <path d="M60,20 Q80,60 60,100 Q40,60 60,20" fill="none" stroke="#00d4ff" stroke-width="0.5" opacity="0.5"/>`
  }
]

const sectionRef = ref<HTMLElement | null>(null)
const gridCanvasRef = ref<HTMLCanvasElement | null>(null)
const trailCanvasRef = ref<HTMLCanvasElement | null>(null)
const shapeCanvasRef = ref<HTMLCanvasElement | null>(null)
const particleCanvasRef = ref<HTMLCanvasElement | null>(null)
const centerOrbRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const bottomDecoRef = ref<HTMLElement | null>(null)
const cardsRef = ref<HTMLElement | null>(null)

let gridCtx: CanvasRenderingContext2D | null = null
let trailCtx: CanvasRenderingContext2D | null = null
let shapeCtx: CanvasRenderingContext2D | null = null
let particleCtx: CanvasRenderingContext2D | null = null
let animationId = 0
let time = 0
const orbitLabels = ['DESIGN', 'CODE', 'CREATE', 'INSPIRE', 'BUILD', 'DREAM']

const shapes: GeoShape[] = []
const particles: Particle[] = []
const trails: Trail[] = []

const cleanupFns: (() => void)[] = []

const initCanvases = () => {
  if (gridCanvasRef.value) {
    gridCanvasRef.value.width = window.innerWidth
    gridCanvasRef.value.height = window.innerHeight
    gridCtx = gridCanvasRef.value.getContext('2d')
  }
  if (trailCanvasRef.value) {
    trailCanvasRef.value.width = window.innerWidth
    trailCanvasRef.value.height = window.innerHeight
    trailCtx = trailCanvasRef.value.getContext('2d')
  }
  if (shapeCanvasRef.value) {
    shapeCanvasRef.value.width = window.innerWidth
    shapeCanvasRef.value.height = window.innerHeight
    shapeCtx = shapeCanvasRef.value.getContext('2d')
  }
  if (particleCanvasRef.value) {
    particleCanvasRef.value.width = window.innerWidth
    particleCanvasRef.value.height = window.innerHeight
    particleCtx = particleCanvasRef.value.getContext('2d')
  }
  initShapes()
  initParticles()
}

const initShapes = () => {
  shapes.length = 0
  const colors = ['rgba(0, 212, 255, 0.15)', 'rgba(124, 58, 237, 0.15)', 'rgba(244, 114, 182, 0.12)', 'rgba(16, 185, 129, 0.12)']
  const types: GeoShape['type'][] = ['triangle', 'square', 'hexagon', 'octagon']
  for (let i = 0; i < 18; i++) {
    shapes.push({
      x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
      size: 40 + Math.random() * 100, rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 0.8,
      type: types[Math.floor(Math.random() * types.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: 0.1 + Math.random() * 0.15, pulsePhase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.02 + Math.random() * 0.02
    })
  }
}

const initParticles = () => {
  particles.length = 0
  for (let i = 0; i < 80; i++) { particles.push(createParticle()) }
}

const createParticle = (): Particle => ({
  x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
  vx: (Math.random() - 0.5) * 0.8, vy: (Math.random() - 0.5) * 0.8,
  size: 1 + Math.random() * 2, opacity: 0.3 + Math.random() * 0.5,
  hue: Math.random() * 60 + 180, life: 0, maxLife: 200 + Math.random() * 300
})

const drawGrid = () => {
  if (!gridCtx) return
  const { width, height } = gridCtx.canvas
  gridCtx.fillStyle = '#0a0a0f'
  gridCtx.fillRect(0, 0, width, height)
  const bgGrad = gridCtx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width * 0.7)
  bgGrad.addColorStop(0, 'rgba(20, 20, 40, 1)')
  bgGrad.addColorStop(0.5, 'rgba(15, 15, 30, 1)')
  bgGrad.addColorStop(1, 'rgba(8, 8, 18, 1)')
  gridCtx.fillStyle = bgGrad
  gridCtx.fillRect(0, 0, width, height)
  gridCtx.strokeStyle = 'rgba(100, 120, 180, 0.03)'
  gridCtx.lineWidth = 1
  const gridSize = 60
  for (let x = 0; x <= width; x += gridSize) {
    gridCtx.beginPath(); gridCtx.moveTo(x, 0); gridCtx.lineTo(x, height); gridCtx.stroke()
  }
  for (let y = 0; y <= height; y += gridSize) {
    gridCtx.beginPath(); gridCtx.moveTo(0, y); gridCtx.lineTo(width, y); gridCtx.stroke()
  }
}

const drawShapes = () => {
  if (!shapeCtx) return
  const { width, height } = shapeCtx.canvas
  shapeCtx.clearRect(0, 0, width, height)
  shapes.forEach(shape => {
    shape.rotation += shape.rotationSpeed
    shape.pulsePhase += shape.pulseSpeed
    const pulseScale = 1 + Math.sin(shape.pulsePhase) * 0.1
    const currentOpacity = shape.opacity * (0.8 + Math.sin(shape.pulsePhase) * 0.2)
    shapeCtx!.save()
    shapeCtx!.translate(shape.x, shape.y)
    shapeCtx!.rotate(shape.rotation * Math.PI / 180)
    shapeCtx!.scale(pulseScale, pulseScale)
    shapeCtx!.globalAlpha = currentOpacity
    shapeCtx!.beginPath()
    drawShapePath(shapeCtx!, shape.type, shape.size)
    shapeCtx!.fillStyle = shape.color
    shapeCtx!.fill()
    shapeCtx!.strokeStyle = 'rgba(255, 255, 255, 0.2)'
    shapeCtx!.lineWidth = 1
    shapeCtx!.stroke()
    shapeCtx!.restore()
  })
}

const drawShapePath = (ctx: CanvasRenderingContext2D, type: GeoShape['type'], size: number) => {
  switch (type) {
    case 'triangle':
      ctx.moveTo(0, -size / 2); ctx.lineTo(size / 2, size / 2); ctx.lineTo(-size / 2, size / 2); ctx.closePath(); break
    case 'square':
      ctx.rect(-size / 2, -size / 2, size, size); break
    case 'hexagon':
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 - Math.PI / 2
        const x = Math.cos(angle) * size / 2, y = Math.sin(angle) * size / 2
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
      }
      ctx.closePath(); break
    case 'octagon':
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 - Math.PI / 8
        const x = Math.cos(angle) * size / 2, y = Math.sin(angle) * size / 2
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
      }
      ctx.closePath(); break
  }
}

const drawTrails = () => {
  if (!trailCtx) return
  const { width, height } = trailCtx.canvas
  const mouseX = width / 2 + Math.sin(time * 0.01) * 100
  const mouseY = height / 2 + Math.cos(time * 0.015) * 80
  trails.push({ x: mouseX, y: mouseY, opacity: 1, size: 3 })
  if (trails.length > 50) trails.shift()
  trailCtx.clearRect(0, 0, width, height)
  trails.forEach((trail, i) => {
    trail.opacity -= 0.02
    trail.size *= 0.98
    if (trail.opacity <= 0) return
    trailCtx!.beginPath()
    if (i > 0) { trailCtx!.moveTo(trails[i - 1].x, trails[i - 1].y); trailCtx!.lineTo(trail.x, trail.y) }
    trailCtx!.strokeStyle = `hsla(${180 + Math.sin(time * 0.02) * 40}, 80%, 60%, ${trail.opacity * 0.5})`
    trailCtx!.lineWidth = trail.size
    trailCtx!.lineCap = 'round'
    trailCtx!.stroke()
  })
  trails.forEach(trail => {
    if (trail.opacity <= 0) return
    const gradient = trailCtx!.createRadialGradient(trail.x, trail.y, 0, trail.x, trail.y, trail.size * 4)
    gradient.addColorStop(0, `rgba(0, 212, 255, ${trail.opacity * 0.3})`)
    gradient.addColorStop(1, 'transparent')
    trailCtx!.fillStyle = gradient
    trailCtx!.beginPath()
    trailCtx!.arc(trail.x, trail.y, trail.size * 4, 0, Math.PI * 2)
    trailCtx!.fill()
  })
}

const drawParticles = () => {
  if (!particleCtx) return
  const { width, height } = particleCtx.canvas
  particleCtx.clearRect(0, 0, width, height)
  particles.forEach((p, i) => {
    p.life++
    p.x += p.vx; p.y += p.vy
    if (p.x < 0 || p.x > width) p.vx *= -1
    if (p.y < 0 || p.y > height) p.vy *= -1
    if (p.life > p.maxLife) { Object.assign(p, createParticle()) }
    const fadeIn = Math.min(p.life / 30, 1)
    const fadeOut = Math.min((p.maxLife - p.life) / 30, 1)
    const alpha = p.opacity * fadeIn * fadeOut
    const glow = particleCtx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 6)
    glow.addColorStop(0, `hsla(${p.hue}, 80%, 60%, ${alpha * 0.8})`)
    glow.addColorStop(0.3, `hsla(${p.hue}, 80%, 60%, ${alpha * 0.3})`)
    glow.addColorStop(1, 'transparent')
    particleCtx!.fillStyle = glow
    particleCtx!.beginPath()
    particleCtx!.arc(p.x, p.y, p.size * 6, 0, Math.PI * 2)
    particleCtx!.fill()
    particleCtx!.fillStyle = `hsla(${p.hue}, 80%, 90%, ${alpha})`
    particleCtx!.beginPath()
    particleCtx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    particleCtx!.fill()
  })
}

const animate = () => {
  time++
  drawGrid()
  drawTrails()
  drawShapes()
  drawParticles()
  animationId = requestAnimationFrame(animate)
}

const initAnimations = () => {
  initCanvases()
  animate()

  // 入场动画 - 页面加载时直接播放，不使用ScrollTrigger
  const tl = gsap.timeline({ delay: 0.2 })

  // 标题入场
  tl.fromTo(titleRef.value,
      { y: 80, opacity: 0, rotationX: -20 },
      { y: 0, opacity: 1, rotationX: 0, duration: 1.2, ease: 'power3.out' }
  )
  tl.fromTo('.title-word', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.2)' }, '-=0.6')
  tl.fromTo('.title-accent', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.2)' }, '-=0.5')
  tl.fromTo('.deco-line', { scaleX: 0 }, { scaleX: 1, duration: 0.6, stagger: 0.1, ease: 'power2.inOut' }, '-=0.3')
  tl.fromTo('.deco-diamond', { scale: 0, rotation: -180 }, { scale: 1, rotation: 0, duration: 0.5, ease: 'back.out(2)' }, '-=0.4')
  tl.fromTo(centerOrbRef.value, { scale: 0, rotation: -360 }, { scale: 1, rotation: 0, duration: 1.5, ease: 'elastic.out(1, 0.5)' }, '-=0.8')
  tl.fromTo('.orbit-label', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'back.out(1.7)' }, '-=0.6')
  tl.fromTo(bottomDecoRef.value, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.4')

  // 卡片入场动画 - 简单的从下方升起
  tl.fromTo('.geo-card',
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out' },
      '-=0.3'
  )

  cleanupFns.push(() => tl.kill())

  if (sectionRef.value) {
    // 标题滚动消失
    gsap.to(titleRef.value, {
      y: -100,
      opacity: 0,
      rotationX: 20,
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top top',
        end: '40% top',
        scrub: 1
      }
    })

    // 中心球体滚动放大效果
    gsap.to(centerOrbRef.value, {
      scale: 1.3,
      rotation: 180,
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top top',
        end: '60% top',
        scrub: 1.5
      }
    })

    // 环绕标签淡出
    gsap.to('.orbit-label', {
      opacity: 0,
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top top',
        end: '50% top',
        scrub: 1
      }
    })

    // 底部装饰淡出
    gsap.to(bottomDecoRef.value, {
      y: 30,
      opacity: 0,
      scrollTrigger: {
        trigger: sectionRef.value,
        start: '60% top',
        end: '90% top',
        scrub: 1
      }
    })

    // 每个卡片独立的滚动动画 - 向上漂浮淡出
    const geoCards = document.querySelectorAll('.geo-card')
    geoCards.forEach((card, index) => {
      gsap.to(card, {
        y: -50,
        scale: 0.95,
        opacity: 0.8,
        scrollTrigger: {
          trigger: card,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      })
    })
  }
}

const handleResize = () => { initCanvases() }

onMounted(() => {
  requestAnimationFrame(() => { requestAnimationFrame(() => { initAnimations() }) })
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', handleResize)
  ScrollTrigger.getAll().forEach(t => t.kill())
})
</script>

<style scoped lang="scss">
.abstract-section {
  width: 100vw;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: #0a0a0f;
  perspective: 1000px;
}

.bg-gradient-layer {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 30% 20%, rgba(0, 212, 255, 0.08) 0%, transparent 50%),
  radial-gradient(ellipse at 70% 80%, rgba(124, 58, 237, 0.08) 0%, transparent 50%),
  radial-gradient(ellipse at 50% 50%, rgba(244, 114, 182, 0.05) 0%, transparent 60%);
  z-index: 0;
}

.grid-canvas, .trail-canvas, .shape-canvas, .particle-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.trail-canvas { z-index: 1; }
.shape-canvas { z-index: 2; }
.particle-canvas { z-index: 3; pointer-events: none; }

.moire-overlay {
  position: absolute;
  inset: 0;
  background: repeating-conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(255, 255, 255, 0.002) 1deg, transparent 2deg);
  z-index: 4;
  pointer-events: none;
  animation: moireMove 30s linear infinite;
}

@keyframes moireMove {
  from { transform: rotate(0deg) scale(1.5); }
  to { transform: rotate(360deg) scale(1.5); }
}

.glow-grid {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 1;
  pointer-events: none;
}

.glow-line {
  position: absolute;
  width: 1px;
  height: 100%;
  background: linear-gradient(to bottom, transparent, rgba(0, 212, 255, 0.1), transparent);
  left: calc(20% + var(--delay, 0) * 10);
  animation: glowPulse 4s ease-in-out infinite;
  animation-delay: var(--delay);

  &:nth-child(2) { left: 40%; }
  &:nth-child(3) { left: 60%; }
  &:nth-child(4) { left: 80%; }
}

@keyframes glowPulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.8; }
}

// 中心球体
.center-orb {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 180px;
  height: 180px;
  z-index: 20;
}

.orb-core {
  position: relative;
  width: 100%;
  height: 100%;
}

.orb-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background: radial-gradient(circle, rgba(0, 212, 255, 0.4) 0%, rgba(124, 58, 237, 0.2) 50%, transparent 70%);
  border-radius: 50%;
  filter: blur(8px);
  animation: orbPulse 3s ease-in-out infinite;
}

@keyframes orbPulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
  50% { transform: translate(-50%, -50%) scale(1.3); opacity: 1; }
}

.orb-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 50%;
  animation: ringRotate 10s linear infinite;

  &.orb-ring-1 { width: 100px; height: 100px; margin: -50px 0 0 -50px; animation-duration: 15s; }
  &.orb-ring-2 { width: 140px; height: 140px; margin: -70px 0 0 -70px; animation-duration: 20s; animation-direction: reverse; border-color: rgba(124, 58, 237, 0.3); }
  &.orb-ring-3 { width: 180px; height: 180px; margin: -90px 0 0 -90px; animation-duration: 25s; border-color: rgba(244, 114, 182, 0.2); }
}

@keyframes ringRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.orb-particles {
  position: absolute;
  width: 100%;
  height: 100%;
}

.orb-dot {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #00d4ff;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: rotate(calc(var(--i) * 45deg)) translateX(80px);
  animation: dotOrbit 8s linear infinite;
  animation-delay: calc(var(--i) * -0.5s);
  box-shadow: 0 0 8px rgba(0, 212, 255, 0.8);

  &:nth-child(even) { background: #7c3aed; box-shadow: 0 0 8px rgba(124, 58, 237, 0.8); }
}

@keyframes dotOrbit {
  from { transform: rotate(calc(var(--i) * 45deg)) translateX(80px); }
  to { transform: rotate(calc(var(--i) * 45deg + 360deg)) translateX(80px); }
}

.orb-symbol {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  animation: symbolRotate 20s linear infinite;

  polygon { filter: drop-shadow(0 0 10px rgba(0, 212, 255, 0.5)); }
  circle { animation: symbolPulse 3s ease-in-out infinite; }
}

@keyframes symbolRotate {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

@keyframes symbolPulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

// 几何边框
.geo-frame {
  position: absolute;
  inset: 40px;
  z-index: 15;
  pointer-events: none;
}

.frame-corner {
  position: absolute;
  width: 60px;
  height: 60px;

  &.top-left { top: 0; left: 0; }
  &.top-right { top: 0; right: 0; transform: scaleX(-1); }
  &.bottom-left { bottom: 0; left: 0; transform: scaleY(-1); }
  &.bottom-right { bottom: 0; right: 0; transform: scale(-1); }
}

.frame-line {
  position: absolute;
  background: linear-gradient(90deg, rgba(0, 212, 255, 0.5), transparent);

  &.horizontal { width: 60px; height: 1px; top: 0; }
  &.vertical { width: 1px; height: 60px; top: 0; background: linear-gradient(180deg, rgba(0, 212, 255, 0.5), transparent); }
}

.frame-dot {
  position: absolute;
  width: 6px;
  height: 6px;
  background: #00d4ff;
  border-radius: 50%;
  top: -2px;
  left: -2px;
  box-shadow: 0 0 10px rgba(0, 212, 255, 0.8);
}

// 标题区域
.title-container {
  position: absolute;
  top: 8%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 25;
  transform-style: preserve-3d;
}

.title-bg-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 8vw;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.02);
  letter-spacing: 0.2em;
  white-space: nowrap;
  pointer-events: none;
  user-select: none;
}

.title-main {
  font-size: 4.5rem;
  font-weight: 800;
  line-height: 1.1;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.2em;
}

.title-word {
  display: block;
  background: linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.1em;
}

.title-accent {
  display: block;
  background: linear-gradient(135deg, #00d4ff 0%, #7c3aed 50%, #f472b6 100%);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.15em;
  animation: gradientFlow 4s ease infinite;
}

@keyframes gradientFlow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.title-sub {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.5em;
  margin-top: 1rem;
  text-transform: uppercase;
}

.title-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 1.5rem;
}

.deco-line {
  width: 60px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.5), transparent);
  transform-origin: center;
}

.deco-diamond {
  width: 8px;
  height: 8px;
  background: #00d4ff;
  transform: rotate(45deg);
  box-shadow: 0 0 15px rgba(0, 212, 255, 0.6);
}

// 环绕标签
.orbit-labels {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 500px;
  height: 500px;
  transform: translate(-50%, -50%);
  z-index: 18;
  pointer-events: none;
}

.orbit-label {
  position: absolute;
  top: 50%;
  left: 50%;
  font-size: 0.7rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 0.3em;
  text-transform: uppercase;
  transform: rotate(calc(var(--angle))) translateY(-220px) rotate(calc(var(--angle) * -1));
  animation: labelFloat 6s ease-in-out infinite;
  animation-delay: var(--delay);
}

@keyframes labelFloat {
  0%, 100% { opacity: 0.4; transform: rotate(calc(var(--angle))) translateY(-220px) rotate(calc(var(--angle) * -1)) translateY(0); }
  50% { opacity: 0.7; transform: rotate(calc(var(--angle))) translateY(-220px) rotate(calc(var(--angle) * -1)) translateY(-8px); }
}

// 几何艺术卡片
.geo-cards {
  position: absolute;
  bottom: 8%;
  left: 50%;
  transform: translateX(-50%);
  display: grid;
  grid-template-columns: repeat(4, 260px);
  gap: 20px;
  z-index: 25;
  padding: 0 20px;
}

.geo-card {
  position: relative;
  background: rgba(10, 15, 30, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 1px solid rgba(0, 212, 255, 0.2);
  padding: 24px;
  cursor: pointer;
  transform-style: preserve-3d;
  perspective: 1000px;
  opacity: 0;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  transition: transform 0.4s ease, box-shadow 0.4s ease;

  &:hover {
    transform: translateY(-10px) rotateX(5deg) rotateY(-5deg);
    box-shadow: 0 25px 50px rgba(0, 212, 255, 0.15), 0 0 30px rgba(124, 58, 237, 0.1);

    .card-border-anim { opacity: 1; }
    .geo-svg { transform: scale(1.1) rotate(5deg); }
    .card-title { color: #00d4ff; }
  }

  &.card-1 { border-color: rgba(0, 212, 255, 0.3); }
  &.card-2 { border-color: rgba(124, 58, 237, 0.3); }
  &.card-3 { border-color: rgba(244, 114, 182, 0.3); }
  &.card-4 { border-color: rgba(16, 185, 129, 0.3); }

  &.card-1:hover { box-shadow: 0 25px 50px rgba(0, 212, 255, 0.2); }
  &.card-2:hover { box-shadow: 0 25px 50px rgba(124, 58, 237, 0.2); }
  &.card-3:hover { box-shadow: 0 25px 50px rgba(244, 114, 182, 0.2); }
  &.card-4:hover { box-shadow: 0 25px 50px rgba(16, 185, 129, 0.2); }
}

.card-visual {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 120px;
  margin-bottom: 20px;
}

.geo-svg {
  width: 120px;
  height: 120px;
  transition: transform 0.4s ease;
  filter: drop-shadow(0 0 20px rgba(0, 212, 255, 0.3));
}

.card-content { position: relative; }

.card-badge {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 600;
  color: #00d4ff;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 4px 10px;
  background: rgba(0, 212, 255, 0.1);
  border-radius: 4px;
  margin-bottom: 10px;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 8px;
  transition: color 0.3s ease;
}

.card-desc {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.5;
  margin: 0 0 14px;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  padding: 3px 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.card-border-anim {
  position: absolute;
  inset: 0;
  border-radius: 16px;
  padding: 1px;
  background: linear-gradient(135deg, #00d4ff, #7c3aed, #f472b6);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

// 底部装饰
.bottom-deco {
  position: absolute;
  bottom: 3%;
  left: 50%;
  transform: translateX(-50%);
  width: 400px;
  max-width: 80vw;
  z-index: 20;
}

.deco-svg {
  width: 100%;
  height: auto;
  opacity: 0.6;
  animation: decoWave 4s ease-in-out infinite;
}

@keyframes decoWave {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

// 响应式
@media (max-width: 1200px) {
  .geo-cards { grid-template-columns: repeat(2, 260px); }
}

@media (max-width: 768px) {
  .title-main { font-size: 2.5rem; }
  .title-bg-text { font-size: 12vw; }
  .geo-cards { grid-template-columns: 1fr; max-width: 300px; bottom: 4%; }
  .title-container { top: 5%; }
  .orbit-labels { width: 300px; height: 300px; }
  .orbit-label { transform: rotate(calc(var(--angle))) translateY(-130px) rotate(calc(var(--angle) * -1)); }
  .center-orb { width: 120px; height: 120px; }
  .geo-frame { inset: 20px; }
  .frame-corner { width: 40px; height: 40px; }
}
</style>
