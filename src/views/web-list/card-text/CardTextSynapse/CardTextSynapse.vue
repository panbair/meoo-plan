<template>
  <section ref="sectionRef" class="synapse-section-114" @mousemove="handleMouseMove">
    <!-- 神经网络背景 -->
    <canvas ref="bgCanvasRef" class="synapse-canvas-114"></canvas>

    <!-- 主内容 -->
    <div class="synapse-content-114">
      <!-- 标题 -->
      <h1 class="synapse-title-114">
        <span v-for="(char, idx) in displayTitle" :key="idx" class="synapse-char-114">{{ char }}</span>
      </h1>

      <!-- 副标题 -->
      <p class="synapse-subtitle-114">{{ subtitle }}</p>

      <!-- 段落 -->
      <div class="synapse-paragraphs-114">
        <p v-for="(para, idx) in paragraphs" :key="idx" class="synapse-para-114">{{ para }}</p>
      </div>
    </div>

    <!-- 放电粒子容器 -->
    <div ref="particleContainerRef" class="synapse-particles-114"></div>

    <!-- 滚动提示 -->
    <div class="synapse-scroll-hint-114" :class="{ hidden: scrollHintHidden }">
      <span>滚动探索</span>
      <div class="synapse-scroll-arrow-114">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" stroke-width="2"/>
        </svg>
      </div>
    </div>

    <!-- 进度 -->
    <div class="synapse-progress-114">
      <div class="synapse-progress-bar-114" :style="{ width: `${progress}%` }"></div>
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
  title: 'SYNAPSE',
  subtitle: 'Neural Pulse Activation',
  paragraphs: () => [
    'Bio-digital consciousness emerging from silicon dreams',
    'Synaptic pathways illuminate the path to digital evolution'
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
const bgCanvasRef = ref<HTMLCanvasElement | null>(null)
const particleContainerRef = ref<HTMLElement | null>(null)

// State
const progress = ref(0)
const scrollHintHidden = ref(false)
const isActivated = ref(false)
const displayTitle = ref(props.title.split('').map(c => c === ' ' ? '\u00A0' : c))

// Animation state
let ctx: gsap.Context | null = null
let scrollTriggerInstance: ScrollTrigger | null = null
let animationFrameId: number | null = null
let bgAnimationId: number | null = null
let breathAnimId: number | null = null
let particles: { el: HTMLElement; x: number; y: number; vx: number; vy: number; life: number; maxLife: number }[] = []
const cleanupFns: (() => void)[] = []

// Mouse state
const mouseState = ref({ x: 0, y: 0 })

// Create spark particle
const createSpark = (x: number, y: number) => {
  const container = particleContainerRef.value
  if (!container) return

  const spark = document.createElement('div')
  spark.className = 'synapse-spark-114'
  spark.style.cssText = `left:${x}px;top:${y}px;position:absolute;width:6px;height:6px;border-radius:50%;background:radial-gradient(circle, rgba(180,220,255,1) 0%, rgba(120,180,255,0.5) 50%, transparent 100%);pointer-events:none;box-shadow:0 0 10px rgba(120,180,255,0.8),0 0 20px rgba(180,100,255,0.5);`

  container.appendChild(spark)

  const angle = Math.random() * Math.PI * 2
  const speed = Math.random() * 80 + 40

  particles.push({
    el: spark,
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    life: 0,
    maxLife: 30 + Math.random() * 20
  })
}

// Animate particles
const animateParticles = () => {
  particles = particles.filter(p => {
    p.life++
    p.x += p.vx * 0.05
    p.y += p.vy * 0.05
    p.vy += 0.5

    const opacity = 1 - p.life / p.maxLife
    p.el.style.opacity = String(opacity)
    p.el.style.transform = `translate(${p.x - parseFloat(p.el.style.left)}px, ${p.y - parseFloat(p.el.style.top)}px) scale(${opacity})`

    if (p.life >= p.maxLife) {
      p.el.remove()
      return false
    }
    return true
  })

  if (particles.length > 0) {
    animationFrameId = requestAnimationFrame(animateParticles)
  }
}

// Mouse handler
const handleMouseMove = (e: MouseEvent) => {
  mouseState.value.x = (e.clientX / window.innerWidth - 0.5) * 20
  mouseState.value.y = (e.clientY / window.innerHeight - 0.5) * 20

  if (isActivated.value && Math.random() > 0.95) {
    const section = sectionRef.value
    if (section) {
      const rect = section.getBoundingClientRect()
      createSpark(e.clientX - rect.left, e.clientY - rect.top)
    }
  }
}

// Background canvas animation
const initBackgroundCanvas = () => {
  const canvas = bgCanvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const networkParticles: { x: number; y: number; vx: number; vy: number; size: number }[] = []
  for (let i = 0; i < 80; i++) {
    networkParticles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 1
    })
  }

  const animate = () => {
    ctx.fillStyle = 'rgba(5, 5, 15, 0.08)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    networkParticles.forEach(p => {
      p.x += p.vx
      p.y += p.vy
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1

      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(100, 150, 255, ${0.3 + Math.sin(Date.now() * 0.001 + p.x) * 0.15})`
      ctx.fill()
    })

    // Draw connections
    for (let i = 0; i < networkParticles.length; i++) {
      for (let j = i + 1; j < networkParticles.length; j++) {
        const dx = networkParticles[i].x - networkParticles[j].x
        const dy = networkParticles[i].y - networkParticles[j].y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 120) {
          ctx.beginPath()
          ctx.moveTo(networkParticles[i].x, networkParticles[i].y)
          ctx.lineTo(networkParticles[j].x, networkParticles[j].y)
          ctx.strokeStyle = `rgba(100, 150, 255, ${(1 - dist / 120) * 0.15})`
          ctx.stroke()
        }
      }
    }

    bgAnimationId = requestAnimationFrame(animate)
  }

  animate()
}

// Play activation animation
const playActivation = () => {
  if (isActivated.value) return
  isActivated.value = true
  emit('animation-start')

  const chars = document.querySelectorAll('.synapse-char-114')
  const subtitle = document.querySelector('.synapse-subtitle-114')
  const paras = document.querySelectorAll('.synapse-para-114')

  if (!chars.length) return

  const tl = gsap.timeline({
    onComplete: () => {
      startBreathingGlow()
      emit('animation-complete')
    }
  })

  // Animate characters with pulse effect
  tl.fromTo(chars,
    {
      opacity: 0,
      textShadow: '0 0 0px rgba(120, 180, 255, 0)',
      filter: 'brightness(1)'
    },
    {
      opacity: 1,
      textShadow: '0 0 20px rgba(120, 180, 255, 0.8), 0 0 40px rgba(180, 100, 255, 0.5)',
      filter: 'brightness(1.5)',
      duration: 0.4,
      stagger: 0.1,
      ease: 'power2.out'
    }
  )

  // Create sparks
  tl.call(() => {
    chars.forEach((char, idx) => {
      if (idx % 2 === 0) {
        const rect = char.getBoundingClientRect()
        const section = sectionRef.value
        if (section && rect) {
          const sRect = section.getBoundingClientRect()
          const x = rect.left - sRect.left + rect.width / 2
          const y = rect.top - sRect.top + rect.height / 2
          for (let i = 0; i < 3; i++) {
            setTimeout(() => createSpark(x, y), i * 50)
          }
        }
      }
    })
  })

  // Subtitle
  if (subtitle) {
    tl.fromTo(subtitle,
      { opacity: 0, y: 20 },
      { opacity: 0.7, y: 0, duration: 0.8, ease: 'power2.out' },
      '-=0.3'
    )
  }

  // Paragraphs
  if (paras.length) {
    tl.fromTo(paras,
      { opacity: 0, y: 30 },
      { opacity: 0.6, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.2 },
      '-=0.5'
    )
  }
}

// Breathing glow
const startBreathingGlow = () => {
  const chars = document.querySelectorAll('.synapse-char-114')
  if (!chars.length) return

  const animate = () => {
    const time = Date.now() * 0.002
    chars.forEach((char, idx) => {
      const breath = Math.sin(time + idx * 0.2) * 0.3 + 0.7
      ;(char as HTMLElement).style.textShadow = `0 0 ${10 + breath * 20}px rgba(120, 180, 255, ${breath * 0.8}), 0 0 ${20 + breath * 30}px rgba(180, 100, 255, ${breath * 0.4})`
    })
    breathAnimId = requestAnimationFrame(animate)
  }
  animate()
}

const stopBreathingGlow = () => {
  if (breathAnimId) {
    cancelAnimationFrame(breathAnimId)
    breathAnimId = null
  }
}

// Reset
const resetAnimation = () => {
  isActivated.value = false
  stopBreathingGlow()

  const chars = document.querySelectorAll('.synapse-char-114')
  chars.forEach(char => {
    ;(char as HTMLElement).style.textShadow = '0 0 0px rgba(120, 180, 255, 0)'
    gsap.set(char, { opacity: 0, filter: 'brightness(1)' })
  })

  const subtitle = document.querySelector('.synapse-subtitle-114')
  if (subtitle) gsap.set(subtitle, { opacity: 0, y: 20 })

  const paras = document.querySelectorAll('.synapse-para-114')
  paras.forEach(para => gsap.set(para, { opacity: 0, y: 30 }))

  // Clear particles
  particles.forEach(p => p.el.remove())
  particles = []
}

// Initialize
const init = () => {
  const rootEl = sectionRef.value
  if (!rootEl) return

  // Initial states
  gsap.set('.synapse-char-114', { opacity: 0, filter: 'brightness(1)', textShadow: '0 0 0px rgba(120, 180, 255, 0)' })
  gsap.set('.synapse-subtitle-114', { opacity: 0, y: 20 })
  gsap.set('.synapse-para-114', { opacity: 0, y: 30 })

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
        if (props.autoPlay) playActivation()
      },
      onLeaveBack: () => {
        resetAnimation()
      }
    })
    cleanupFns.push(() => scrollTriggerInstance?.kill())
  }, rootEl)
}

onMounted(() => {
  initBackgroundCanvas()
  nextTick(() => init())
  animateParticles()

  window.addEventListener('resize', () => {
    const canvas = bgCanvasRef.value
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
  stopBreathingGlow()
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
  if (bgAnimationId) cancelAnimationFrame(bgAnimationId)
  particles.forEach(p => p.el.remove())
})

watch(() => props.title, (newTitle) => {
  displayTitle.value = newTitle.split('').map(c => c === ' ' ? '\u00A0' : c)
})
</script>

<style lang="scss" scoped>
.synapse-section-114 {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(135deg, #030308 0%, #0a0a1a 50%, #050510 100%);
  font-family: 'Orbitron', 'Rajdhani', system-ui, sans-serif;
}

.synapse-canvas-114 {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.synapse-content-114 {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 2rem;
  max-width: 900px;
}

.synapse-title-114 {
  font-size: clamp(4rem, 15vw, 12rem);
  font-weight: 900;
  letter-spacing: 0.15em;
  margin: 0 0 1.5rem;
  line-height: 1.1;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.05em;
}

.synapse-char-114 {
  display: inline-block;
  color: #e0e8ff;
  background: linear-gradient(180deg, #ffffff 0%, #a0c0ff 50%, #6080d0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: none;
  filter: drop-shadow(0 0 10px rgba(120, 180, 255, 0.3));
  cursor: default;
  transition: transform 0.1s ease;
}

.synapse-subtitle-114 {
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  color: rgba(160, 200, 255, 0.7);
  letter-spacing: 0.4em;
  text-transform: uppercase;
  margin: 0 0 3rem;
  font-weight: 300;
}

.synapse-paragraphs-114 {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.synapse-para-114 {
  font-size: clamp(0.9rem, 1.8vw, 1.2rem);
  color: rgba(180, 200, 230, 0.6);
  line-height: 1.8;
  margin: 0;
  font-weight: 300;
  letter-spacing: 0.05em;
}

.synapse-particles-114 {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 20;
}

.synapse-scroll-hint-114 {
  position: absolute;
  bottom: 3rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: rgba(120, 160, 220, 0.5);
  font-size: 0.85rem;
  letter-spacing: 0.2em;
  transition: opacity 0.5s ease;

  &.hidden {
    opacity: 0;
    pointer-events: none;
  }
}

.synapse-scroll-arrow-114 {
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

.synapse-progress-114 {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(60, 80, 120, 0.3);
}

.synapse-progress-bar-114 {
  height: 100%;
  background: linear-gradient(90deg, rgba(120, 180, 255, 0.8), rgba(180, 100, 255, 0.8));
  transition: width 0.1s ease;
  box-shadow: 0 0 10px rgba(120, 180, 255, 0.5);
}
</style>
