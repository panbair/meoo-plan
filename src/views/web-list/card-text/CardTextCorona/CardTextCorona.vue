<template>
  <section ref="sectionRef" class="corona-section-115">
    <!-- 星云背景 -->
    <canvas ref="bgCanvasRef" class="corona-canvas-115"></canvas>

    <!-- 日冕光圈 -->
    <div ref="coronaRingRef" class="corona-ring-115">
      <div class="corona-ring-inner-115"></div>
      <div class="corona-ring-mid-115"></div>
      <div class="corona-ring-outer-115"></div>
    </div>

    <!-- 主内容 -->
    <div class="corona-content-115">
      <h1 class="corona-title-115">
        <span
          v-for="(char, idx) in displayTitle"
          :key="idx"
          class="corona-char-115"
          :data-index="idx"
        >{{ char }}</span>
      </h1>
      <p class="corona-subtitle-115">{{ subtitle }}</p>
      <div class="corona-paragraphs-115">
        <p v-for="(para, idx) in paragraphs" :key="idx" class="corona-para-115">{{ para }}</p>
      </div>
    </div>

    <!-- 粒子容器 -->
    <div ref="particleContainerRef" class="corona-particles-115"></div>

    <!-- 滚动提示 -->
    <div class="corona-scroll-hint-115" :class="{ hidden: scrollHintHidden }">
      <span>滚动触发</span>
      <div class="corona-scroll-arrow-115">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" stroke-width="2"/>
        </svg>
      </div>
    </div>

    <!-- 进度 -->
    <div class="corona-progress-115">
      <div class="corona-progress-bar-115" :style="{ width: `${progress}%` }"></div>
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
  title: 'CORONA',
  subtitle: 'Stellar Birth Sequence',
  paragraphs: () => [
    'Igniting the cosmic forge of consciousness',
    'Where light is born from the void eternal'
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
const coronaRingRef = ref<HTMLElement | null>(null)
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
let particles: { el: HTMLElement; x: number; y: number; vx: number; vy: number; life: number; maxLife: number }[] = []
const cleanupFns: (() => void)[] = []

// Star field data
const stars: { x: number; y: number; size: number; brightness: number; twinkle: number }[] = []

// Create flare particle
const createFlare = (x: number, y: number, count: number = 8) => {
  const container = particleContainerRef.value
  if (!container) return

  for (let i = 0; i < count; i++) {
    const flare = document.createElement('div')
    flare.className = 'corona-flare-115'
    flare.style.cssText = `left:${x}px;top:${y}px;position:absolute;width:4px;height:4px;border-radius:50%;background:radial-gradient(circle, #fff8e0 0%, #ffcc00 40%, #ff6600 70%, transparent 100%);pointer-events:none;`

    container.appendChild(flare)

    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5
    const speed = 50 + Math.random() * 100

    particles.push({
      el: flare,
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0,
      maxLife: 40 + Math.random() * 30
    })
  }
}

// Animate particles
const animateParticles = () => {
  particles = particles.filter(p => {
    p.life++
    p.x += p.vx * 0.03
    p.y += p.vy * 0.03
    p.vx *= 0.98
    p.vy *= 0.98

    const opacity = 1 - p.life / p.maxLife
    const scale = 1 - p.life / p.maxLife * 0.5
    p.el.style.transform = `translate(${p.x - parseFloat(p.el.style.left)}px, ${p.y - parseFloat(p.el.style.top)}px) scale(${scale})`
    p.el.style.opacity = String(opacity * 0.8)

    if (p.life >= p.maxLife) {
      p.el.remove()
      return false
    }
    return true
  })

  if (particles.length > 0 || !isActivated.value) {
    animationFrameId = requestAnimationFrame(animateParticles)
  }
}

// Background star field
const initBackgroundStarField = () => {
  const canvas = bgCanvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  // Create stars
  stars.length = 0
  for (let i = 0; i < 150; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      brightness: Math.random(),
      twinkle: Math.random() * 0.02
    })
  }

  const animate = () => {
    ctx.fillStyle = 'rgba(5, 5, 20, 0.15)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const time = Date.now() * 0.001

    stars.forEach(star => {
      const twinkle = Math.sin(time * star.twinkle * 100 + star.x) * 0.3 + 0.7
      const alpha = star.brightness * twinkle

      ctx.beginPath()
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255, 250, 230, ${alpha})`
      ctx.fill()

      // Glow
      ctx.beginPath()
      ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255, 200, 100, ${alpha * 0.2})`
      ctx.fill()
    })

    bgAnimationId = requestAnimationFrame(animate)
  }

  animate()
}

// Play stellar birth animation
const playStellarBirth = () => {
  if (isActivated.value) return
  isActivated.value = true
  emit('animation-start')

  const chars = document.querySelectorAll('.corona-char-115')
  const subtitle = document.querySelector('.corona-subtitle-115')
  const paras = document.querySelectorAll('.corona-para-115')
  const ring = coronaRingRef.value

  if (!chars.length) return

  const tl = gsap.timeline({
    onComplete: () => {
      startCoronaGlow()
      emit('animation-complete')
      // Continue particle animation
      animateParticles()
    }
  })

  // Phase 1: Corona ring expansion
  if (ring) {
    tl.fromTo(ring,
      { scale: 0, opacity: 0 },
      { scale: 1.5, opacity: 1, duration: 0.6, ease: 'power2.out' }
    )
    tl.to(ring, { scale: 1, opacity: 0, duration: 0.4, ease: 'power2.in' })
  }

  // Phase 2: Character ignition sequence
  chars.forEach((char, idx) => {
    const el = char as HTMLElement
    const delay = idx * 0.15

    // Initial state - hidden
    gsap.set(el, { opacity: 0, color: '#ffffff', textShadow: '0 0 30px #ffffff, 0 0 60px #ffcc00, 0 0 90px #ff6600' })

    // Collapse phase
    tl.fromTo(el,
      {
        opacity: 0,
        scale: 0.3,
        filter: 'blur(10px)',
        textShadow: '0 0 50px #ffffff, 0 0 100px #ffcc00'
      },
      {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        textShadow: '0 0 20px #ffffff, 0 0 40px #ffcc00, 0 0 60px #ff9900',
        duration: 0.4,
        ease: 'power3.out'
      },
      delay
    )

    // Create flares
    tl.call(() => {
      const rect = el.getBoundingClientRect()
      const section = sectionRef.value
      if (section && rect) {
        const sRect = section.getBoundingClientRect()
        const x = rect.left - sRect.left + rect.width / 2
        const y = rect.top - sRect.top + rect.height / 2
        createFlare(x, y, 6)
      }
    }, [], delay + 0.2)

    // Cool down to golden
    tl.to(el,
      {
        color: '#ffd700',
        textShadow: '0 0 15px #ffd700, 0 0 30px #ffaa00',
        duration: 0.6,
        ease: 'power1.out'
      },
      delay + 0.4
    )
  })

  // Phase 3: Subtitle reveal
  if (subtitle) {
    tl.fromTo(subtitle,
      { opacity: 0, y: 30, letterSpacing: '0.8em' },
      { opacity: 0.8, y: 0, letterSpacing: '0.4em', duration: 1, ease: 'power2.out' },
      '-=0.5'
    )
  }

  // Phase 4: Paragraphs
  if (paras.length) {
    tl.fromTo(paras,
      { opacity: 0, y: 20 },
      { opacity: 0.6, y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.15 },
      '-=0.6'
    )
  }
}

// Corona glow animation
let glowAnimId: number | null = null
const startCoronaGlow = () => {
  const chars = document.querySelectorAll('.corona-char-115')
  if (!chars.length) return

  const animate = () => {
    const time = Date.now() * 0.001
    chars.forEach((char, idx) => {
      const el = char as HTMLElement
      const pulse = Math.sin(time * 1.5 + idx * 0.3) * 0.2 + 0.8
      el.style.textShadow = `0 0 ${10 * pulse}px #ffd700, 0 0 ${20 * pulse}px #ffaa00, 0 0 ${30 * pulse}px #ff8800`
    })
    glowAnimId = requestAnimationFrame(animate)
  }
  animate()
}

const stopCoronaGlow = () => {
  if (glowAnimId) {
    cancelAnimationFrame(glowAnimId)
    glowAnimId = null
  }
}

// Reset animation
const resetAnimation = () => {
  isActivated.value = false
  stopCoronaGlow()

  const chars = document.querySelectorAll('.corona-char-115')
  chars.forEach(char => {
    const el = char as HTMLElement
    gsap.set(el, { opacity: 0, scale: 0.3, filter: 'blur(10px)' })
    el.style.textShadow = '0 0 0px #ffffff'
    el.style.color = ''
  })

  const subtitle = document.querySelector('.corona-subtitle-115')
  if (subtitle) gsap.set(subtitle, { opacity: 0, y: 30, letterSpacing: '0.8em' })

  const paras = document.querySelectorAll('.corona-para-115')
  paras.forEach(para => gsap.set(para, { opacity: 0, y: 20 }))

  // Clear particles
  particles.forEach(p => p.el.remove())
  particles = []
}

// Initialize
const init = () => {
  const rootEl = sectionRef.value
  if (!rootEl) return

  // Initial states
  gsap.set('.corona-char-115', { opacity: 0, scale: 0.3, filter: 'blur(10px)' })
  gsap.set('.corona-subtitle-115', { opacity: 0, y: 30, letterSpacing: '0.8em' })
  gsap.set('.corona-para-115', { opacity: 0, y: 20 })
  gsap.set('.corona-ring-115', { scale: 0, opacity: 0 })

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
        if (props.autoPlay) playStellarBirth()
      },
      onLeaveBack: () => {
        resetAnimation()
      }
    })
    cleanupFns.push(() => scrollTriggerInstance?.kill())
  }, rootEl)
}

// Mouse hover flares
const handleMouseEnter = (e: MouseEvent) => {
  if (!isActivated.value) return
  const target = e.target as HTMLElement
  if (target.classList.contains('corona-char-115')) {
    const rect = target.getBoundingClientRect()
    const section = sectionRef.value
    if (section && rect) {
      const sRect = section.getBoundingClientRect()
      const x = rect.left - sRect.left + rect.width / 2
      const y = rect.top - sRect.top + rect.height / 2

      // Bright flash
      gsap.to(target, {
        textShadow: '0 0 30px #ffffff, 0 0 60px #ffcc00, 0 0 90px #ff6600',
        duration: 0.1
      })

      // Create flares
      createFlare(x, y, 10)
    }
  }
}

const handleMouseLeave = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (target.classList.contains('corona-char-115')) {
    gsap.to(target, {
      textShadow: '0 0 15px #ffd700, 0 0 30px #ffaa00',
      duration: 0.3
    })
  }
}

onMounted(() => {
  initBackgroundStarField()
  nextTick(() => init())

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
  stopCoronaGlow()
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
  if (bgAnimationId) cancelAnimationFrame(bgAnimationId)
  particles.forEach(p => p.el.remove())
})

watch(() => props.title, (newTitle) => {
  displayTitle.value = newTitle.split('').map(c => c === ' ' ? '\u00A0' : c)
})
</script>

<style lang="scss" scoped>
.corona-section-115 {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: radial-gradient(ellipse at center, #0a0a20 0%, #050510 50%, #000005 100%);
  font-family: 'Cinzel', 'Playfair Display', serif;
}

.corona-canvas-115 {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.corona-ring-115 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.corona-ring-inner-115,
.corona-ring-mid-115,
.corona-ring-outer-115 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  border: 2px solid rgba(255, 200, 100, 0.5);
}

.corona-ring-inner-115 {
  width: 200px;
  height: 200px;
  border-color: rgba(255, 230, 150, 0.8);
  box-shadow: 0 0 30px rgba(255, 200, 100, 0.5), inset 0 0 30px rgba(255, 200, 100, 0.3);
}

.corona-ring-mid-115 {
  width: 350px;
  height: 350px;
  border-color: rgba(255, 180, 80, 0.4);
  box-shadow: 0 0 50px rgba(255, 150, 50, 0.3);
}

.corona-ring-outer-115 {
  width: 500px;
  height: 500px;
  border-color: rgba(255, 120, 50, 0.2);
  box-shadow: 0 0 80px rgba(255, 100, 0, 0.2);
}

.corona-content-115 {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 2rem;
  max-width: 1000px;
}

.corona-title-115 {
  font-size: clamp(4rem, 16vw, 14rem);
  font-weight: 700;
  letter-spacing: 0.2em;
  margin: 0 0 2rem;
  line-height: 1;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.1em;
}

.corona-char-115 {
  display: inline-block;
  color: #ffd700;
  text-shadow: 0 0 15px #ffd700, 0 0 30px #ffaa00;
  cursor: default;
  transition: transform 0.1s ease;

  &:hover {
    transform: scale(1.15) !important;
  }
}

.corona-subtitle-115 {
  font-size: clamp(0.9rem, 2vw, 1.3rem);
  color: rgba(255, 215, 100, 0.7);
  letter-spacing: 0.4em;
  text-transform: uppercase;
  margin: 0 0 3rem;
  font-weight: 300;
}

.corona-paragraphs-115 {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.corona-para-115 {
  font-size: clamp(0.85rem, 1.5vw, 1.1rem);
  color: rgba(255, 230, 180, 0.5);
  line-height: 1.9;
  margin: 0;
  font-weight: 300;
  letter-spacing: 0.08em;
}

.corona-particles-115 {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 20;
}

.corona-flare-115 {
  box-shadow: 0 0 6px #ffcc00, 0 0 12px #ff8800;
}

.corona-scroll-hint-115 {
  position: absolute;
  bottom: 3rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 200, 100, 0.4);
  font-size: 0.85rem;
  letter-spacing: 0.2em;
  transition: opacity 0.5s ease;

  &.hidden {
    opacity: 0;
    pointer-events: none;
  }
}

.corona-scroll-arrow-115 {
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

.corona-progress-115 {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(100, 80, 50, 0.3);
}

.corona-progress-bar-115 {
  height: 100%;
  background: linear-gradient(90deg, rgba(255, 200, 100, 0.8), rgba(255, 150, 50, 0.8));
  transition: width 0.1s ease;
  box-shadow: 0 0 10px rgba(255, 180, 80, 0.5);
}
</style>
