<template>
  <section ref="sectionRef" class="chladni-section-116">
    <!-- 深色振动平面背景 -->
    <div class="chladni-plane-116"></div>

    <!-- 粒子画布 -->
    <canvas ref="particleCanvasRef" class="chladni-canvas-116"></canvas>

    <!-- 涟漪效果容器 -->
    <div ref="rippleContainerRef" class="chladni-ripples-116"></div>

    <!-- 主内容 -->
    <div class="chladni-content-116">
      <h1 class="chladni-title-116">
        <span
          v-for="(char, idx) in displayTitle"
          :key="idx"
          class="chladni-char-116"
          :data-index="idx"
        >{{ char }}</span>
      </h1>
      <p class="chladni-subtitle-116">{{ subtitle }}</p>
      <div class="chladni-paragraphs-116">
        <p v-for="(para, idx) in paragraphs" :key="idx" class="chladni-para-116">{{ para }}</p>
      </div>
    </div>

    <!-- 频率指示器 -->
    <div class="chladni-freq-116">
      <span class="chladni-freq-label-116">FREQ</span>
      <div class="chladni-freq-bar-116">
        <div class="chladni-freq-fill-116" :style="{ width: `${freqProgress}%` }"></div>
      </div>
    </div>

    <!-- 滚动提示 -->
    <div class="chladni-scroll-hint-116" :class="{ hidden: scrollHintHidden }">
      <span>滚动激发</span>
      <div class="chladni-scroll-arrow-116">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" stroke-width="2"/>
        </svg>
      </div>
    </div>

    <!-- 进度 -->
    <div class="chladni-progress-116">
      <div class="chladni-progress-bar-116" :style="{ width: `${progress}%` }"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Props {
  title?: string
  subtitle?: string
  paragraphs?: string[]
  autoPlay?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'CHLADNI',
  subtitle: 'Standing Wave Resonance',
  paragraphs: () => [
    'Sand grains dancing to invisible frequencies',
    'Patterns emerge from chaos at the nodal lines'
  ],
  autoPlay: true
})

const emit = defineEmits<{
  'scroll-progress': [progress: number]
  'animation-start': []
  'animation-complete': []
}>()

// Refs
const sectionRef = ref<HTMLElement | null>(null)
const particleCanvasRef = ref<HTMLCanvasElement | null>(null)
const rippleContainerRef = ref<HTMLElement | null>(null)

// State
const progress = ref(0)
const freqProgress = ref(0)
const scrollHintHidden = ref(false)
const isActivated = ref(false)
const displayTitle = ref(props.title.split('').map(c => c === ' ' ? '\u00A0' : c))

// Animation state
let ctx: gsap.Context | null = null
let scrollTriggerInstance: ScrollTrigger | null = null
let animationFrameId: number | null = null
let particles: Particle[] = []
let ripples: Ripple[] = []
const cleanupFns: (() => void)[] = []

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  targetX: number
  targetY: number
  size: number
  alpha: number
}

interface Ripple {
  x: number
  y: number
  radius: number
  maxRadius: number
  opacity: number
  el: HTMLElement
}

// Particle system
interface ParticleData {
  canvas: HTMLCanvasElement
  particles: Particle[]
  isForming: boolean
  targetPositions: { x: number; y: number }[]
}

// Initialize particles
const initParticles = (): ParticleData | null => {
  const canvas = particleCanvasRef.value
  if (!canvas) return null

  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const newParticles: Particle[] = []
  const width = canvas.width
  const height = canvas.height

  // Create scattered particles
  for (let i = 0; i < 800; i++) {
    newParticles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      targetX: 0,
      targetY: 0,
      size: Math.random() * 2 + 1,
      alpha: Math.random() * 0.5 + 0.3
    })
  }

  return { canvas, particles: newParticles, isForming: false, targetPositions: [] }
}

// Calculate target positions based on text
const calculateTargetPositions = (canvas: HTMLCanvasElement, chars: NodeListOf<Element>): { x: number; y: number }[] => {
  const positions: { x: number; y: number }[] = []
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2

  chars.forEach((char, charIdx) => {
    const el = char as HTMLElement
    const rect = el.getBoundingClientRect()
    const sectionRect = sectionRef.value?.getBoundingClientRect()

    if (sectionRect && rect) {
      const charCenterX = rect.left - sectionRect.left + rect.width / 2
      const charCenterY = rect.top - sectionRect.top + rect.height / 2

      // Distribute particles around the character
      const particlesPerChar = 80
      for (let i = 0; i < particlesPerChar; i++) {
        const angle = (Math.PI * 2 * i) / particlesPerChar
        const radius = Math.random() * Math.min(rect.width, rect.height) * 0.6 + 5
        positions.push({
          x: charCenterX + Math.cos(angle) * radius + (Math.random() - 0.5) * 10,
          y: charCenterY + Math.sin(angle) * radius + (Math.random() - 0.5) * 10
        })
      }
    }
  })

  return positions
}

// Animate particles
const animateParticles = (data: ParticleData) => {
  const ctx = data.canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, data.canvas.width, data.canvas.height)

  data.particles.forEach((p, idx) => {
    if (data.isForming && data.targetPositions.length > 0) {
      // Move towards target
      const target = data.targetPositions[idx % data.targetPositions.length]
      const dx = target.x - p.x
      const dy = target.y - p.y
      p.vx += dx * 0.03
      p.vy += dy * 0.03
      p.vx *= 0.92
      p.vy *= 0.92
      p.x += p.vx
      p.y += p.vy
    } else {
      // Brownian motion
      p.vx += (Math.random() - 0.5) * 0.3
      p.vy += (Math.random() - 0.5) * 0.3
      p.vx *= 0.98
      p.vy *= 0.98
      p.x += p.vx
      p.y += p.vy

      // Boundary
      if (p.x < 0 || p.x > data.canvas.width) p.vx *= -1
      if (p.y < 0 || p.y > data.canvas.height) p.vy *= -1
    }

    // Draw particle
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(200, 220, 255, ${p.alpha})`
    ctx.fill()

    // Glow
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(150, 180, 255, ${p.alpha * 0.15})`
    ctx.fill()
  })

  animationFrameId = requestAnimationFrame(() => animateParticles(data))
}

// Create ripple
const createRipple = (x: number, y: number) => {
  const container = rippleContainerRef.value
  if (!container) return

  const ripple = document.createElement('div')
  ripple.className = 'chladni-ripple-116'
  ripple.style.cssText = `left:${x}px;top:${y}px;position:absolute;width:20px;height:20px;border-radius:50%;border:2px solid rgba(180,200,255,0.6);transform:translate(-50%,-50%);pointer-events:none;`

  container.appendChild(ripple)

  gsap.fromTo(ripple,
    { scale: 0, opacity: 1 },
    {
      scale: 20,
      opacity: 0,
      duration: 1.5,
      ease: 'power2.out',
      onComplete: () => ripple.remove()
    }
  )
}

// Play resonance animation
const playResonance = () => {
  if (isActivated.value) return
  isActivated.value = true
  emit('animation-start')

  const chars = document.querySelectorAll('.chladni-char-116')
  const subtitle = document.querySelector('.chladni-subtitle-116')
  const paras = document.querySelectorAll('.chladni-para-116')
  const canvas = particleCanvasRef.value

  if (!chars.length) return

  // Start particle animation
  const particleData = initParticles()
  if (particleData) {
    const targetPositions = calculateTargetPositions(canvas!, chars)
    particleData.targetPositions = targetPositions
    particleData.isForming = true
    animateParticles(particleData)
  }

  const tl = gsap.timeline({
    onComplete: () => {
      emit('animation-complete')
      // Create formation ripples
      chars.forEach((char, idx) => {
        const el = char as HTMLElement
        const rect = el.getBoundingClientRect()
        const section = sectionRef.value
        if (section && rect) {
          const sRect = section.getBoundingClientRect()
          const x = rect.left - sRect.left + rect.width / 2
          const y = rect.top - sRect.top + rect.height / 2
          setTimeout(() => createRipple(x, y), idx * 100)
        }
      })
    }
  })

  // Frequency sweep indicator
  tl.to({ val: 0 }, {
    val: 100,
    duration: 2,
    ease: 'power1.inOut',
    onUpdate: function () {
      freqProgress.value = this.targets()[0].val
    }
  })

  // Character formation
  chars.forEach((char, idx) => {
    const el = char as HTMLElement
    const delay = idx * 0.15 + 0.3

    // Fade in with vibration
    tl.fromTo(el,
      { opacity: 0, filter: 'blur(8px)', x: () => Math.random() * 20 - 10, y: () => Math.random() * 20 - 10 },
      {
        opacity: 1,
        filter: 'blur(0px)',
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'power2.out'
      },
      delay
    )

    // Start micro-vibration after forming
    tl.call(() => {
      gsap.to(el, {
        x: '+=1',
        y: '+=0.5',
        duration: 0.05,
        repeat: 10,
        yoyo: true,
        ease: 'none',
        onComplete: () => {
          // Continue subtle vibration
          gsap.to(el, {
            x: '+=0.5',
            y: '+=0.25',
            duration: 0.08,
            repeat: -1,
            yoyo: true,
            ease: 'none'
          })
        }
      })
    }, [], delay + 0.6)
  })

  // Subtitle reveal
  if (subtitle) {
    tl.fromTo(subtitle,
      { opacity: 0, y: 20, letterSpacing: '0.6em' },
      { opacity: 0.7, y: 0, letterSpacing: '0.3em', duration: 1, ease: 'power2.out' },
      '-=0.5'
    )
  }

  // Paragraphs
  if (paras.length) {
    tl.fromTo(paras,
      { opacity: 0, y: 15 },
      { opacity: 0.5, y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.15 },
      '-=0.6'
    )
  }
}

// Reset animation
const resetAnimation = () => {
  isActivated.value = false
  freqProgress.value = 0
  gsap.killTweensOf('.chladni-char-116')

  const chars = document.querySelectorAll('.chladni-char-116')
  chars.forEach(char => {
    const el = char as HTMLElement
    gsap.set(el, { opacity: 0, filter: 'blur(8px)', x: 0, y: 0 })
  })

  const subtitle = document.querySelector('.chladni-subtitle-116')
  if (subtitle) gsap.set(subtitle, { opacity: 0, y: 20, letterSpacing: '0.6em' })

  const paras = document.querySelectorAll('.chladni-para-116')
  paras.forEach(para => gsap.set(para, { opacity: 0, y: 15 }))
}

// Mouse interaction
const handleMouseMove = (e: MouseEvent) => {
  if (!isActivated.value) return

  // Create ripple at mouse position
  if (Math.random() > 0.92) {
    const section = sectionRef.value
    if (section) {
      const rect = section.getBoundingClientRect()
      createRipple(e.clientX - rect.left, e.clientY - rect.top)
    }
  }
}

// Initialize
const init = () => {
  const rootEl = sectionRef.value
  if (!rootEl) return

  // Initial states
  gsap.set('.chladni-char-116', { opacity: 0, filter: 'blur(8px)' })
  gsap.set('.chladni-subtitle-116', { opacity: 0, y: 20, letterSpacing: '0.6em' })
  gsap.set('.chladni-para-116', { opacity: 0, y: 15 })

  // Start particle animation
  const particleData = initParticles()
  if (particleData) {
    animateParticles(particleData)
  }

  ctx = gsap.context(() => {
    scrollTriggerInstance = ScrollTrigger.create({
      trigger: rootEl,
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1.5,
      onUpdate: (self) => {
        progress.value = self.progress * 100
        emit('scroll-progress', self.progress)
        if (self.progress > 0.05) scrollHintHidden.value = true
      },
      onEnter: () => {
        if (props.autoPlay) playResonance()
      },
      onLeaveBack: () => {
        resetAnimation()
      }
    })
    cleanupFns.push(() => scrollTriggerInstance?.kill())
  }, rootEl)
}

onMounted(() => {
  nextTick(() => init())

  window.addEventListener('resize', () => {
    const canvas = particleCanvasRef.value
    if (canvas) {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
  })
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ctx?.revert()
  scrollTriggerInstance?.kill()
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
  gsap.killTweensOf('.chladni-char-116')
})

watch(() => props.title, (newTitle) => {
  displayTitle.value = newTitle.split('').map(c => c === ' ' ? '\u00A0' : c)
})
</script>

<style lang="scss" scoped>
.chladni-section-116 {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(180deg, #0a0a15 0%, #050510 50%, #020208 100%);
  font-family: 'Cormorant Garamond', 'EB Garamond', serif;
}

.chladni-plane-116 {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 50% 50%, rgba(30, 40, 80, 0.3) 0%, transparent 70%),
    linear-gradient(180deg, rgba(10, 15, 30, 0.8) 0%, rgba(5, 8, 20, 0.9) 100%);
  pointer-events: none;
}

.chladni-canvas-116 {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.chladni-ripples-116 {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 15;
}

.chladni-content-116 {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 2rem;
  max-width: 1000px;
}

.chladni-title-116 {
  font-size: clamp(4rem, 16vw, 14rem);
  font-weight: 300;
  letter-spacing: 0.3em;
  margin: 0 0 2rem;
  line-height: 1;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.08em;
}

.chladni-char-116 {
  display: inline-block;
  color: rgba(220, 235, 255, 0.9);
  text-shadow: 0 0 10px rgba(150, 180, 255, 0.5), 0 0 20px rgba(100, 140, 200, 0.3);
  cursor: default;
  transition: text-shadow 0.3s ease;
}

.chladni-subtitle-116 {
  font-size: clamp(0.85rem, 1.8vw, 1.2rem);
  color: rgba(180, 200, 230, 0.6);
  letter-spacing: 0.3em;
  text-transform: uppercase;
  margin: 0 0 3rem;
  font-weight: 300;
}

.chladni-paragraphs-116 {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.chladni-para-116 {
  font-size: clamp(0.8rem, 1.4vw, 1rem);
  color: rgba(160, 190, 220, 0.45);
  line-height: 1.9;
  margin: 0;
  font-weight: 300;
  letter-spacing: 0.05em;
  font-style: italic;
}

.chladni-freq-116 {
  position: absolute;
  bottom: 5rem;
  right: 3rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 20;
}

.chladni-freq-label-116 {
  font-size: 0.7rem;
  color: rgba(150, 180, 220, 0.4);
  letter-spacing: 0.2em;
  font-family: monospace;
}

.chladni-freq-bar-116 {
  width: 100px;
  height: 4px;
  background: rgba(60, 80, 120, 0.3);
  border-radius: 2px;
  overflow: hidden;
}

.chladni-freq-fill-116 {
  height: 100%;
  background: linear-gradient(90deg, rgba(100, 150, 200, 0.6), rgba(150, 200, 255, 0.8));
  border-radius: 2px;
  transition: width 0.1s ease;
  box-shadow: 0 0 8px rgba(100, 150, 200, 0.5);
}

.chladni-scroll-hint-116 {
  position: absolute;
  bottom: 3rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: rgba(150, 180, 220, 0.35);
  font-size: 0.8rem;
  letter-spacing: 0.2em;
  transition: opacity 0.5s ease;

  &.hidden {
    opacity: 0;
    pointer-events: none;
  }
}

.chladni-scroll-arrow-116 {
  width: 24px;
  height: 24px;
  animation: bounce 2s infinite;

  svg {
    width: 100%;
    height: 100%;
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(8px); }
  60% { transform: translateY(4px); }
}

.chladni-progress-116 {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(60, 80, 120, 0.2);
}

.chladni-progress-bar-116 {
  height: 100%;
  background: linear-gradient(90deg, rgba(100, 150, 200, 0.7), rgba(150, 200, 255, 0.7));
  transition: width 0.1s ease;
  box-shadow: 0 0 8px rgba(100, 150, 200, 0.4);
}
</style>
