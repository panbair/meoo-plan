<template>
  <section ref="sectionRef" class="void-section">
    <div ref="voidBgRef" class="void-background"></div>
    <div ref="portalBgRef" class="portal-background"></div>

    <div ref="headerRef" class="void-header">
      <div ref="badgeRef" class="header-badge">
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
          <circle cx="12" cy="12" r="6" stroke="currentColor" stroke-width="2"/>
          <circle cx="12" cy="12" r="2" fill="currentColor"/>
          <path d="M12 2V6M12 18V22M2 12H6M18 12H22" stroke="currentColor" stroke-width="2"/>
        </svg>
      </div>
      <h1 ref="titleRef" class="void-title">虚空之门</h1>
      <p ref="subtitleRef" class="void-subtitle">VOID PORTAL</p>
    </div>

    <div class="cards-container">
      <div ref="card0Ref" class="void-card" data-index="0">
        <div class="card-vortex"></div>
        <div class="card-portal-ring"></div>
        <div class="card-dimension-line"></div>
        <div class="card-content">
          <span class="card-index">01</span>
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <ellipse cx="12" cy="12" rx="10" ry="4" stroke="currentColor" stroke-width="1.5" transform="rotate(45 12 12)"/>
              <ellipse cx="12" cy="12" rx="10" ry="4" stroke="currentColor" stroke-width="1.5" transform="rotate(-45 12 12)"/>
            </svg>
          </div>
          <h3 class="card-title">时空裂缝</h3>
          <p class="card-desc">维度的撕裂与重组</p>
        </div>
      </div>

      <div ref="card1Ref" class="void-card" data-index="1">
        <div class="card-vortex"></div>
        <div class="card-portal-ring"></div>
        <div class="card-dimension-line"></div>
        <div class="card-content">
          <span class="card-index">02</span>
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              <circle cx="12" cy="12" r="3" fill="currentColor"/>
            </svg>
          </div>
          <h3 class="card-title">维度跳跃</h3>
          <p class="card-desc">跨越平行宇宙</p>
        </div>
      </div>

      <div ref="card2Ref" class="void-card" data-index="2">
        <div class="card-vortex"></div>
        <div class="card-portal-ring"></div>
        <div class="card-dimension-line"></div>
        <div class="card-content">
          <span class="card-index">03</span>
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-dasharray="4 2"/>
              <circle cx="12" cy="12" r="6" stroke="currentColor" stroke-width="2"/>
              <circle cx="12" cy="12" r="2" fill="currentColor"/>
              <path d="M12 2V6M12 18V22M2 12H6M18 12H22" stroke="currentColor" stroke-width="1.5"/>
            </svg>
          </div>
          <h3 class="card-title">虫洞穿越</h3>
          <p class="card-desc">空间的折叠通道</p>
        </div>
      </div>

      <div ref="card3Ref" class="void-card" data-index="3">
        <div class="card-vortex"></div>
        <div class="card-portal-ring"></div>
        <div class="card-dimension-line"></div>
        <div class="card-content">
          <span class="card-index">04</span>
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              <polygon points="12,6 17,9 17,15 12,18 7,15 7,9" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              <circle cx="12" cy="12" r="2" fill="currentColor"/>
            </svg>
          </div>
          <h3 class="card-title">虚空核心</h3>
          <p class="card-desc">无尽能量的源泉</p>
        </div>
      </div>
    </div>

    <footer ref="footerRef" class="void-footer">
      <span>CardVoid</span>
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
const voidBgRef = ref<HTMLElement | null>(null)
const portalBgRef = ref<HTMLElement | null>(null)
const card0Ref = ref<HTMLElement | null>(null)
const card1Ref = ref<HTMLElement | null>(null)
const card2Ref = ref<HTMLElement | null>(null)
const card3Ref = ref<HTMLElement | null>(null)

let cleanupFns: TweenCleanup[] = []
let bgAnimations: gsap.core.Tween[] = []
let portalAnimations: gsap.core.Tween[] = []

const ANIMATION_DISTANCE = 200

const createVoidBackground = () => {
  if (!voidBgRef.value) return

  for (let i = 0; i < 35; i++) {
    const particle = document.createElement('div')
    particle.className = 'void-particle'
    const size = 2 + Math.random() * 5
    const hue = 260 + Math.random() * 60
    particle.style.cssText = `
      position: absolute;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      width: ${size}px;
      height: ${size}px;
      background: hsla(${hue}, 80%, 60%, ${0.3 + Math.random() * 0.5});
      border-radius: 50%;
      box-shadow: 0 0 ${size * 4}px hsla(${hue}, 80%, 60%, 0.5);
      pointer-events: none;
    `
    voidBgRef.value.appendChild(particle)

    const tl = gsap.timeline({ repeat: -1 })
    const duration = 3 + Math.random() * 5
    tl.fromTo(particle,
      { scale: 0, opacity: 0, rotation: 0 },
      { scale: 1, opacity: 1, rotation: 180, duration: duration * 0.4, ease: 'power2.out' }
    ).to(particle,
      { scale: 0, opacity: 0, rotation: 360, duration: duration * 0.6, ease: 'power2.in' },
      `+=${duration * 0.3}`
    )
    bgAnimations.push(tl)
  }

  for (let i = 0; i < 4; i++) {
    const portal = document.createElement('div')
    portal.className = 'void-portal'
    const size = 300 + i * 150
    const hue = 280 + i * 15
    portal.style.cssText = `
      position: absolute;
      left: 50%;
      top: 50%;
      width: ${size}px;
      height: ${size}px;
      border: 2px solid hsla(${hue}, 80%, 60%, ${0.15 - i * 0.03});
      border-radius: 50%;
      transform: translate(-50%, -50%) rotate(${i * 15}deg);
      pointer-events: none;
    `
    portalBgRef.value?.appendChild(portal)

    const portalTl = gsap.timeline({ repeat: -1 })
    portalTl.to(portal, {
      rotation: `+=${360 * (i % 2 === 0 ? 1 : -1)}`,
      scale: 1 + i * 0.1,
      duration: 15 + i * 5,
      ease: 'none'
    })
    portalAnimations.push(portalTl)
  }
}

const initAnimations = () => {
  createVoidBackground()

  const tl = gsap.timeline({ delay: 0.3 })

  // zoom-in-right: from left with scale
  tl.fromTo(badgeRef.value,
    { x: -ANIMATION_DISTANCE, scale: 0.5, opacity: 0, filter: 'blur(20px)' },
    { x: 0, scale: 1, opacity: 1, filter: 'blur(0px)', duration: 1, ease: 'back.out(1.8)' }
  )
  .fromTo(titleRef.value,
    { x: -ANIMATION_DISTANCE * 0.8, scale: 0.6, opacity: 0, filter: 'blur(15px)' },
    { x: 0, scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' },
    '-=0.5'
  )
  .fromTo(subtitleRef.value,
    { x: -ANIMATION_DISTANCE * 0.5, scale: 0.8, opacity: 0, letterSpacing: '-10px' },
    { x: 0, scale: 1, opacity: 1, letterSpacing: '6px', duration: 0.6, ease: 'power2.out' },
    '-=0.4'
  )

  const cards = [card0Ref.value, card1Ref.value, card2Ref.value, card3Ref.value]

  cards.forEach((card, i) => {
    if (!card) return
    tl.fromTo(card,
      { x: -ANIMATION_DISTANCE, scale: 0.6, opacity: 0, filter: 'blur(15px)' },
      { x: 0, scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: 'back.out(1.5)' },
      `=-${0.6 - i * 0.1}`
    )
  })

  tl.fromTo(footerRef.value,
    { x: -ANIMATION_DISTANCE * 0.3, scale: 0.8, opacity: 0 },
    { x: 0, scale: 1, opacity: 1, duration: 0.5, ease: 'power2.out' },
    '-=0.3'
  )

  cleanupFns.push(() => tl.kill())

  gsap.set('.void-card', { x: 0, scale: 1, opacity: 1, filter: 'blur(0px)' })
  gsap.set([badgeRef.value, titleRef.value, subtitleRef.value], { x: 0, scale: 1, opacity: 1, filter: 'blur(0px)' })
  gsap.set(footerRef.value, { x: 0, scale: 1, opacity: 1 })

  // ScrollTrigger - cards zoom-out-right
  cards.forEach((card, i) => {
    if (!card) return

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
            x: 200 * p,
            scale: 1 - p * 0.8,
            opacity: Math.max(0, 1 - p * 2),
            filter: `blur(${p * 10}px)`,
            rotation: p * 15
          })
        } else {
          gsap.set(card, {
            x: 0, scale: 1, opacity: 1, filter: 'blur(0px)', rotation: 0
          })
        }
      }
    })
    cleanupFns.push(() => trigger.kill())
  })

  // Header scroll - zoom-out-right
  const headerTrigger = ScrollTrigger.create({
    trigger: headerRef.value,
    start: 'top top',
    end: '20% top',
    scrub: 1.5,
    onUpdate: (self) => {
      const p = self.progress
      gsap.set(headerRef.value, {
        x: 100 * p,
        scale: 1 - p * 0.5,
        opacity: 1 - p * 2,
        filter: `blur(${p * 8}px)`
      })
    }
  })
  cleanupFns.push(() => headerTrigger.kill())

  // Footer scroll - fade out
  const footerTrigger = ScrollTrigger.create({
    trigger: sectionRef.value,
    start: '80% top',
    end: 'bottom top',
    scrub: 1.5,
    onUpdate: (self) => {
      const p = self.progress
      gsap.set(footerRef.value, {
        x: 50 * p,
        scale: 1 - p * 0.5,
        opacity: 1 - p * 2,
        filter: `blur(${p * 6}px)`
      })
    }
  })
  cleanupFns.push(() => footerTrigger.kill())
}

onMounted(() => initAnimations())

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  bgAnimations.forEach(t => t.kill())
  portalAnimations.forEach(t => t.kill())
  if (voidBgRef.value) {
    voidBgRef.value.innerHTML = ''
  }
  if (portalBgRef.value) {
    portalBgRef.value.innerHTML = ''
  }
})
</script>

<style lang="scss" scoped>
.void-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #0a0015 0%, #1a0a2e 50%, #0a0015 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  perspective: 1200px;
}

.void-background {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.portal-background {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.void-particle {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}

.void-portal {
  position: absolute;
  pointer-events: none;
}

.void-header {
  text-align: center;
  margin-bottom: 60px;
  position: relative;
  z-index: 10;
}

.header-badge {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  background: linear-gradient(135deg, #c084fc, #a855f7, #7c3aed);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  box-shadow: 
    0 0 40px rgba(168, 85, 247, 0.6),
    0 0 80px rgba(124, 58, 237, 0.4),
    inset 0 0 30px rgba(255, 255, 255, 0.2);

  svg { width: 50px; height: 50px; }
}

.void-title {
  font-size: 56px;
  font-weight: 900;
  background: linear-gradient(90deg, #e9d5ff, #c084fc, #a855f7);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 10px;
  text-shadow: 0 0 40px rgba(168, 85, 247, 0.5);
}

.void-subtitle {
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

.void-card {
  position: relative;
  width: 260px;
  height: 340px;
  padding: 32px;
  background: linear-gradient(180deg, 
    rgba(168, 85, 247, 0.1) 0%, 
    rgba(139, 92, 246, 0.06) 50%,
    rgba(192, 132, 252, 0.1) 100%);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(168, 85, 247, 0.2);
  border-radius: 24px;
  cursor: pointer;
  transform-style: preserve-3d;
  will-change: transform, opacity, filter;
  overflow: hidden;
  transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.15) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:hover {
    transform: translateY(-15px) scale(1.05);
    border-color: rgba(168, 85, 247, 0.5);
    box-shadow: 
      0 20px 40px rgba(168, 85, 247, 0.25),
      0 0 80px rgba(192, 132, 252, 0.15);
    
    &::before { opacity: 1; }
    
    .card-vortex {
      animation: vortexSpin 4s linear infinite;
    }
    .card-portal-ring {
      animation: portalPulse 2s ease-in-out infinite;
    }
    .card-dimension-line {
      animation: dimensionShift 1.5s ease-in-out infinite;
    }
  }
}

.card-vortex {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px;
  height: 200px;
  transform: translate(-50%, -50%);
  background: 
    repeating-conic-gradient(
      from 0deg,
      rgba(168, 85, 247, 0.1) 0deg 10deg,
      transparent 10deg 20deg
    );
  border-radius: 50%;
  pointer-events: none;
}

@keyframes vortexSpin {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

.card-portal-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 160px;
  height: 160px;
  transform: translate(-50%, -50%);
  border: 2px solid rgba(192, 132, 252, 0.3);
  border-radius: 50%;
  pointer-events: none;
}

@keyframes portalPulse {
  0%, 100% { 
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.5;
  }
  50% { 
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 1;
  }
}

.card-dimension-line {
  position: absolute;
  inset: 20px;
  border: 1px dashed rgba(168, 85, 247, 0.15);
  border-radius: 16px;
  pointer-events: none;
}

@keyframes dimensionShift {
  0%, 100% { 
    transform: scale(1) rotate(0deg);
    opacity: 0.3;
  }
  50% { 
    transform: scale(1.05) rotate(2deg);
    opacity: 0.6;
  }
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
  color: #c084fc;
  opacity: 0.15;
  line-height: 1;
  display: block;
  margin-bottom: 12px;
}

.card-icon {
  width: 64px;
  height: 64px;
  color: #e9d5ff;
  margin-bottom: 16px;
  filter: drop-shadow(0 0 10px rgba(168, 85, 247, 0.6));
  
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

.void-footer {
  position: absolute;
  bottom: 40px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.3);
  letter-spacing: 3px;
}
</style>
