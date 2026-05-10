<template>
  <section ref="sectionRef" class="prism-section">
    <div ref="bgPrismRef" class="bg-prism-container"></div>
    <div ref="rayBgRef" class="ray-background"></div>

    <div ref="headerRef" class="prism-header">
      <div ref="badgeRef" class="header-badge">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 19H22L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
          <path d="M12 9V13M12 17H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
      <h1 ref="titleRef" class="prism-title">棱镜折射</h1>
      <p ref="subtitleRef" class="prism-subtitle">PRISM REFRACTION</p>
    </div>

    <div class="cards-container">
      <div ref="card0Ref" class="prism-card" data-index="0">
        <div class="card-facet card-facet-top"></div>
        <div class="card-facet card-facet-left"></div>
        <div class="card-shimmer"></div>
        <div class="card-content">
          <span class="card-index">01</span>
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <circle cx="12" cy="12" r="6" stroke="currentColor" stroke-width="2"/>
              <circle cx="12" cy="12" r="2" fill="currentColor"/>
            </svg>
          </div>
          <h3 class="card-title">光线汇聚</h3>
          <p class="card-desc">光的聚焦与发散</p>
        </div>
      </div>

      <div ref="card1Ref" class="prism-card" data-index="1">
        <div class="card-facet card-facet-top"></div>
        <div class="card-facet card-facet-left"></div>
        <div class="card-shimmer"></div>
        <div class="card-content">
          <span class="card-index">02</span>
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 22H22L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              <path d="M12 9L7 22H17L12 9Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            </svg>
          </div>
          <h3 class="card-title">光谱分解</h3>
          <p class="card-desc">白光的多彩分离</p>
        </div>
      </div>

      <div ref="card2Ref" class="prism-card" data-index="2">
        <div class="card-facet card-facet-top"></div>
        <div class="card-facet card-facet-left"></div>
        <div class="card-shimmer"></div>
        <div class="card-content">
          <span class="card-index">03</span>
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 3V7M12 17V21M3 12H7M17 12H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M5.64 5.64L8.17 8.17M15.83 15.83L18.36 18.36M5.64 18.36L8.17 15.83M15.83 8.17L18.36 5.64" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <h3 class="card-title">折射定律</h3>
          <p class="card-desc">光的角度偏移</p>
        </div>
      </div>

      <div ref="card3Ref" class="prism-card" data-index="3">
        <div class="card-facet card-facet-top"></div>
        <div class="card-facet card-facet-left"></div>
        <div class="card-shimmer"></div>
        <div class="card-content">
          <span class="card-index">04</span>
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            </svg>
          </div>
          <h3 class="card-title">全反射</h3>
          <p class="card-desc">临界角的奇迹</p>
        </div>
      </div>
    </div>

    <footer ref="footerRef" class="prism-footer">
      <span>CardPrism</span>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void

const sectionRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const badgeRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const bgPrismRef = ref<HTMLElement | null>(null)
const rayBgRef = ref<HTMLElement | null>(null)
const card0Ref = ref<HTMLElement | null>(null)
const card1Ref = ref<HTMLElement | null>(null)
const card2Ref = ref<HTMLElement | null>(null)
const card3Ref = ref<HTMLElement | null>(null)

let cleanupFns: TweenCleanup[] = []
let bgAnimations: gsap.core.Tween[] = []
let shimmerAnimations: gsap.core.Tween[] = []

const ANIMATION_DISTANCE = 200

const createPrismBackground = () => {
  if (!bgPrismRef.value) return

  const colors = ['#f472b6', '#fb923c', '#facc15', '#4ade80', '#22d3ee', '#818cf8', '#e879f9']

  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div')
    particle.className = 'prism-particle'
    const color = colors[i % colors.length]
    const size = 4 + Math.random() * 8
    particle.style.cssText = `
      position: absolute;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      box-shadow: 0 0 ${size * 2}px ${color};
      pointer-events: none;
    `
    bgPrismRef.value.appendChild(particle)

    const tl = gsap.timeline({ repeat: -1 })
    tl.fromTo(particle,
      { scale: 0, opacity: 0, rotation: 0 },
      { scale: 1, opacity: 1, rotation: 360, duration: 2 + Math.random() * 3, ease: 'power2.out' }
    ).to(particle,
      { scale: 0, opacity: 0, rotation: 720, duration: 2 + Math.random() * 3, ease: 'power2.in' },
      `+=${3 + Math.random() * 5}`
    )
    bgAnimations.push(tl)
  }

  for (let i = 0; i < 8; i++) {
    const ray = document.createElement('div')
    ray.className = 'light-ray'
    const angle = (i / 8) * 360 + Math.random() * 30
    const hue = (i * 40) % 360
    ray.style.cssText = `
      position: absolute;
      left: 50%;
      top: 50%;
      width: 600px;
      height: 4px;
      background: linear-gradient(90deg, hsla(${hue}, 100%, 70%, 0.6), transparent);
      transform: rotate(${angle}deg);
      transform-origin: left center;
      pointer-events: none;
      opacity: 0.4;
      filter: blur(2px);
    `
    rayBgRef.value?.appendChild(ray)

    const rayTl = gsap.timeline({ repeat: -1, yoyo: true })
    rayTl.to(ray, {
      opacity: 0.8,
      scaleX: 1.1,
      duration: 3 + Math.random() * 2,
      ease: 'sine.inOut'
    })
    bgAnimations.push(rayTl)
  }
}

const initAnimations = () => {
  createPrismBackground()

  const tl = gsap.timeline({ delay: 0.3 })

  // fade-down-left: from top-right (200, -200) to (0, 0)
  tl.fromTo(badgeRef.value,
    { x: ANIMATION_DISTANCE, y: -ANIMATION_DISTANCE, opacity: 0, scale: 0, rotation: 360, filter: 'blur(15px)' },
    { x: 0, y: 0, opacity: 1, scale: 1, rotation: 0, filter: 'blur(0px)', duration: 1, ease: 'back.out(1.7)' }
  )
  .fromTo(titleRef.value,
    { x: ANIMATION_DISTANCE * 0.8, y: -ANIMATION_DISTANCE * 0.6, opacity: 0, scale: 0.7, filter: 'blur(10px)' },
    { x: 0, y: 0, opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' },
    '-=0.5'
  )
  .fromTo(subtitleRef.value,
    { x: ANIMATION_DISTANCE * 0.5, y: -ANIMATION_DISTANCE * 0.4, opacity: 0, letterSpacing: '20px' },
    { x: 0, y: 0, opacity: 1, letterSpacing: '6px', duration: 0.6, ease: 'power2.out' },
    '-=0.4'
  )

  const cards = [card0Ref.value, card1Ref.value, card2Ref.value, card3Ref.value]
  const cardConfigs = [
    { x: ANIMATION_DISTANCE * 0.9, y: -ANIMATION_DISTANCE * 0.8, rotation: -12, scale: 0.35, skewY: 6 },
    { x: ANIMATION_DISTANCE * 1.1, y: -ANIMATION_DISTANCE * 0.9, rotation: 0, scale: 0.3, skewY: 0 },
    { x: ANIMATION_DISTANCE * 0.9, y: -ANIMATION_DISTANCE * 0.8, rotation: 12, scale: 0.35, skewY: -6 },
    { x: ANIMATION_DISTANCE * 1.0, y: -ANIMATION_DISTANCE * 0.85, rotation: -6, scale: 0.33, skewY: 3 }
  ]
  const cardEases = ['back.out(1.2)', 'elastic.out(1, 0.5)', 'back.out(1.4)', 'back.out(1.3)']

  cards.forEach((card, i) => {
    if (!card) return
    const config = cardConfigs[i] ?? { x: ANIMATION_DISTANCE, y: -ANIMATION_DISTANCE, rotation: 0, scale: 0.35, skewY: 0 }
    const ease = cardEases[i] ?? 'power3.out'
    tl.fromTo(card,
      { x: config.x, y: config.y, opacity: 0, rotation: config.rotation, scale: config.scale, skewY: config.skewY, filter: 'blur(12px)' },
      { x: 0, y: 0, opacity: 1, rotation: 0, scale: 1, skewY: 0, filter: 'blur(0px)', duration: 1, ease },
      `=-${0.7 - i * 0.1}`
    )
  })

  tl.fromTo(footerRef.value,
    { x: ANIMATION_DISTANCE * 0.4, y: -ANIMATION_DISTANCE * 0.3, opacity: 0 },
    { x: 0, y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
    '-=0.3'
  )

  cleanupFns.push(() => tl.kill())

  gsap.set('.prism-card', { x: 0, y: 0, opacity: 1, scale: 1, rotation: 0, skewY: 0, filter: 'blur(0px)' })
  gsap.set([badgeRef.value, titleRef.value, subtitleRef.value], { x: 0, y: 0, opacity: 1, filter: 'blur(0px)' })
  gsap.set(footerRef.value, { x: 0, y: 0, opacity: 1 })

  // ScrollTrigger - cards fly to bottom-left
  const scrollConfigs = [
    { x: -280, y: 200, rotation: -30, scale: 0.2, skewY: -15 },
    { x: -320, y: 240, rotation: 0, scale: 0.15, skewY: 0 },
    { x: -280, y: 200, rotation: 30, scale: 0.2, skewY: 15 },
    { x: -300, y: 220, rotation: -15, scale: 0.18, skewY: -8 }
  ]

  cards.forEach((card, i) => {
    if (!card) return
    const config = scrollConfigs[i] ?? { x: -280, y: 200, rotation: 0, scale: 0.2, skewY: 0 }

    const trigger = ScrollTrigger.create({
      trigger: card,
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1.5,
      onUpdate: (self) => {
        const p = self.progress
        const dir = self.direction

        if (dir > 0) {
          gsap.set(card, {
            x: (config.x ?? -280) * p,
            y: (config.y ?? 200) * p,
            opacity: Math.max(0, 1 - p * 1.8),
            scale: 1 - p * (1 - (config.scale ?? 0.2)),
            rotation: (config.rotation ?? 0) * p,
            skewY: (config.skewY ?? 0) * p,
            filter: `blur(${p * 12}px)`
          })
        } else {
          gsap.set(card, {
            x: 0, y: 0, opacity: 1, scale: 1, rotation: 0, skewY: 0, filter: 'blur(0px)'
          })
        }
      }
    })
    cleanupFns.push(() => trigger.kill())
  })

  // Header scroll - fade to bottom-right
  const headerTrigger = ScrollTrigger.create({
    trigger: headerRef.value,
    start: 'top top',
    end: '20% top',
    scrub: 1.5,
    onUpdate: (self) => {
      const p = self.progress
      gsap.set(headerRef.value, {
        x: ANIMATION_DISTANCE * 0.6 * p,
        y: -ANIMATION_DISTANCE * 0.5 * p,
        opacity: 1 - p * 2,
        rotation: p * 10,
        filter: `blur(${p * 10}px)`
      })
    }
  })
  cleanupFns.push(() => headerTrigger.kill())

  // Footer scroll - fade to bottom-right
  const footerTrigger = ScrollTrigger.create({
    trigger: sectionRef.value,
    start: '80% top',
    end: 'bottom top',
    scrub: 1.5,
    onUpdate: (self) => {
      const p = self.progress
      gsap.set(footerRef.value, {
        x: ANIMATION_DISTANCE * 0.3 * p,
        y: -ANIMATION_DISTANCE * 0.25 * p,
        opacity: 1 - p * 2,
        filter: `blur(${p * 8}px)`
      })
    }
  })
  cleanupFns.push(() => footerTrigger.kill())

  // Shimmer animation for cards
  const shimmers = document.querySelectorAll('.card-shimmer')
  shimmers.forEach((shimmer) => {
    const shimmerTl = gsap.timeline({ repeat: -1, repeatDelay: 2 })
    shimmerTl.fromTo(shimmer,
      { x: '-100%', opacity: 0 },
      { x: '200%', opacity: 0.6, duration: 2, ease: 'power2.inOut' }
    )
    shimmerAnimations.push(shimmerTl)
  })
}

onMounted(() => initAnimations())

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  bgAnimations.forEach(t => t.kill())
  shimmerAnimations.forEach(t => t.kill())
  if (bgPrismRef.value) {
    bgPrismRef.value.innerHTML = ''
  }
  if (rayBgRef.value) {
    rayBgRef.value.innerHTML = ''
  }
  ScrollTrigger.getAll().forEach(t => t.kill())
})
</script>

<style lang="scss" scoped>
.prism-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #0c0a09 0%, #1c1917 50%, #0c0a09 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  perspective: 1200px;
}

.ray-background {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.light-ray {
  position: absolute;
  pointer-events: none;
}

.bg-prism-container {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.prism-particle {
  position: absolute;
  pointer-events: none;
}

.prism-header {
  text-align: center;
  margin-bottom: 60px;
  position: relative;
  z-index: 10;
}

.header-badge {
  width: 70px;
  height: 70px;
  margin: 0 auto 20px;
  background: linear-gradient(135deg, #f472b6, #fb923c, #facc15, #4ade80, #22d3ee, #818cf8);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  box-shadow: 
    0 0 30px rgba(251, 146, 60, 0.5),
    0 0 60px rgba(244, 114, 182, 0.3),
    inset 0 0 20px rgba(255, 255, 255, 0.3);

  svg { width: 40px; height: 40px; }
}

.prism-title {
  font-size: 56px;
  font-weight: 900;
  background: linear-gradient(90deg, #fda4af, #fb923c, #facc15, #86efac);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 10px;
  text-shadow: 0 0 40px rgba(251, 146, 60, 0.5);
}

.prism-subtitle {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 6px;
  font-weight: 300;
}

.cards-container {
  display: flex;
  gap: 25px;
  position: relative;
  z-index: 10;
}

.prism-card {
  position: relative;
  width: 260px;
  height: 340px;
  padding: 32px;
  background: linear-gradient(180deg, 
    rgba(251, 146, 60, 0.1) 0%, 
    rgba(244, 114, 182, 0.08) 50%,
    rgba(167, 139, 250, 0.1) 100%);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(251, 191, 36, 0.2);
  border-radius: 24px;
  cursor: pointer;
  transform-style: preserve-3d;
  will-change: transform, opacity, filter;
  overflow: hidden;
  transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-15px) rotateX(5deg) rotateY(-5deg) scale(1.05);
    border-color: rgba(251, 146, 60, 0.5);
    box-shadow: 
      0 20px 40px rgba(251, 146, 60, 0.2),
      0 0 80px rgba(244, 114, 182, 0.15);
    
    .card-facet-top { opacity: 0.4; }
    .card-facet-left { opacity: 0.3; }
    .card-shimmer { animation: shimmerMove 1.5s ease-in-out; }
  }
}

.card-facet {
  position: absolute;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.card-facet-top {
  top: 0;
  left: 0;
  right: 0;
  height: 60%;
  background: linear-gradient(180deg, 
    rgba(255, 255, 255, 0.1) 0%, 
    transparent 100%);
  opacity: 0;
  clip-path: polygon(0 0, 100% 0, 80% 100%, 20% 100%);
}

.card-facet-left {
  top: 0;
  left: 0;
  bottom: 0;
  width: 40%;
  background: linear-gradient(90deg, 
    rgba(255, 255, 255, 0.08) 0%, 
    transparent 100%);
  opacity: 0;
  clip-path: polygon(0 0, 100% 20%, 100% 80%, 0 100%);
}

.card-shimmer {
  position: absolute;
  top: 0;
  left: 0;
  width: 30%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transform: translateX(-100%);
  pointer-events: none;
  opacity: 0;
}

@keyframes shimmerMove {
  0% { transform: translateX(-100%); opacity: 0; }
  10% { opacity: 0.6; }
  90% { opacity: 0.6; }
  100% { transform: translateX(400%); opacity: 0; }
}

.card-content {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-index {
  font-size: 48px;
  font-weight: 900;
  color: #fb923c;
  opacity: 0.2;
  line-height: 1;
  display: block;
  margin-bottom: 12px;
}

.card-icon {
  width: 64px;
  height: 64px;
  color: #facc15;
  margin-bottom: 16px;
  filter: drop-shadow(0 0 10px rgba(250, 204, 21, 0.5));
  
  svg { width: 100%; height: 100%; }
}

.card-title {
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
}

.card-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin-top: auto;
}

.prism-footer {
  position: absolute;
  bottom: 40px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.3);
  letter-spacing: 3px;
}
</style>
