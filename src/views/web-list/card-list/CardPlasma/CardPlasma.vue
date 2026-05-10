<template>
  <section ref="sectionRef" class="plasma-section">
    <div ref="plasmaBgRef" class="plasma-background"></div>
    <div ref="waveFieldRef" class="wave-field"></div>

    <div ref="headerRef" class="plasma-header">
      <div ref="badgeRef" class="header-badge">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M12 2C17.5 2 22 6.5 22 12C22 17.5 17.5 22 12 22C6.5 22 2 17.5 2 12C2 6.5 6.5 2 12 2Z" stroke="currentColor" stroke-width="2"/>
          <path d="M12 6C15.3 6 18 8.7 18 12C18 15.3 15.3 18 12 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <path d="M12 10C13.7 10 15 11.3 15 12C15 12.7 14.7 13.3 14.3 13.7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
      <h1 ref="titleRef" class="plasma-title">等离子态</h1>
      <p ref="subtitleRef" class="plasma-subtitle">PLASMA STATE</p>
    </div>

    <div class="cards-container">
      <div ref="card0Ref" class="plasma-card" data-index="0">
        <div class="card-plasma-ring"></div>
        <div class="card-energy-field"></div>
        <div class="card-particle-ring"></div>
        <div class="card-content">
          <span class="card-index">01</span>
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="currentColor"/>
            </svg>
          </div>
          <h3 class="card-title">离子电弧</h3>
          <p class="card-desc">高能粒子的舞蹈</p>
        </div>
      </div>

      <div ref="card1Ref" class="plasma-card" data-index="1">
        <div class="card-plasma-ring"></div>
        <div class="card-energy-field"></div>
        <div class="card-particle-ring"></div>
        <div class="card-content">
          <span class="card-index">02</span>
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <circle cx="12" cy="12" r="6" stroke="currentColor" stroke-width="2"/>
              <circle cx="12" cy="12" r="2" fill="currentColor"/>
              <path d="M12 2V6M12 18V22M2 12H6M18 12H22" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <h3 class="card-title">磁场约束</h3>
          <p class="card-desc">托卡马克的奇迹</p>
        </div>
      </div>

      <div ref="card2Ref" class="plasma-card" data-index="2">
        <div class="card-plasma-ring"></div>
        <div class="card-energy-field"></div>
        <div class="card-particle-ring"></div>
        <div class="card-content">
          <span class="card-index">03</span>
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 3V7M12 17V21M3 12H7M17 12H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2"/>
              <circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1" stroke-dasharray="4 2"/>
            </svg>
          </div>
          <h3 class="card-title">核聚变</h3>
          <p class="card-desc">恒星力量的源泉</p>
        </div>
      </div>

      <div ref="card3Ref" class="plasma-card" data-index="3">
        <div class="card-plasma-ring"></div>
        <div class="card-energy-field"></div>
        <div class="card-particle-ring"></div>
        <div class="card-content">
          <span class="card-index">04</span>
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 2L14.4 8.8H21.6L15.8 12.8L18.2 19.6L12 15.6L5.8 19.6L8.2 12.8L2.4 8.8H9.6L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            </svg>
          </div>
          <h3 class="card-title">能量爆发</h3>
          <p class="card-desc">等离子体的激荡</p>
        </div>
      </div>
    </div>

    <footer ref="footerRef" class="plasma-footer">
      <span>CardPlasma</span>
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
const plasmaBgRef = ref<HTMLElement | null>(null)
const waveFieldRef = ref<HTMLElement | null>(null)
const card0Ref = ref<HTMLElement | null>(null)
const card1Ref = ref<HTMLElement | null>(null)
const card2Ref = ref<HTMLElement | null>(null)
const card3Ref = ref<HTMLElement | null>(null)

let cleanupFns: TweenCleanup[] = []
let bgAnimations: gsap.core.Tween[] = []
let ringAnimations: gsap.core.Tween[] = []

const ANIMATION_DISTANCE = 200

const createPlasmaBackground = () => {
  if (!plasmaBgRef.value) return

  for (let i = 0; i < 40; i++) {
    const particle = document.createElement('div')
    particle.className = 'plasma-particle'
    const size = 3 + Math.random() * 6
    const hue = 280 + Math.random() * 80
    particle.style.cssText = `
      position: absolute;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      width: ${size}px;
      height: ${size}px;
      background: hsla(${hue}, 100%, 65%, ${0.4 + Math.random() * 0.5});
      border-radius: 50%;
      box-shadow: 0 0 ${size * 3}px hsla(${hue}, 100%, 65%, 0.6);
      pointer-events: none;
    `
    plasmaBgRef.value.appendChild(particle)

    const tl = gsap.timeline({ repeat: -1 })
    const duration = 2 + Math.random() * 4
    tl.fromTo(particle,
      { y: 0, scale: 0, opacity: 0 },
      { y: -50 - Math.random() * 100, scale: 1, opacity: 1, duration: duration * 0.4, ease: 'power2.out' }
    ).to(particle,
      { y: -150, scale: 0, opacity: 0, duration: duration * 0.6, ease: 'power2.in' },
      `+=${duration * 0.3}`
    )
    bgAnimations.push(tl)
  }

  for (let i = 0; i < 5; i++) {
    const wave = document.createElement('div')
    wave.className = 'field-wave'
    const size = 150 + i * 100
    const hue = 280 + i * 15
    wave.style.cssText = `
      position: absolute;
      left: 50%;
      top: 50%;
      width: ${size}px;
      height: ${size}px;
      border: 2px solid hsla(${hue}, 100%, 60%, ${0.2 - i * 0.03});
      border-radius: 50%;
      transform: translate(-50%, -50%) scale(0);
      pointer-events: none;
    `
    waveFieldRef.value?.appendChild(wave)

    const waveTl = gsap.timeline({ repeat: -1, delay: i * 1.2 })
    waveTl.to(wave, {
      scale: 2,
      opacity: 0,
      duration: 5,
      ease: 'power2.out'
    })
    bgAnimations.push(waveTl)
  }
}

const initAnimations = () => {
  createPlasmaBackground()

  const tl = gsap.timeline({ delay: 0.3 })

  // zoom-in-up: from bottom with scale
  tl.fromTo(badgeRef.value,
    { y: ANIMATION_DISTANCE, scale: 0.5, opacity: 0, filter: 'blur(20px)' },
    { y: 0, scale: 1, opacity: 1, filter: 'blur(0px)', duration: 1, ease: 'back.out(1.8)' }
  )
  .fromTo(titleRef.value,
    { y: ANIMATION_DISTANCE * 0.8, scale: 0.6, opacity: 0, filter: 'blur(15px)' },
    { y: 0, scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' },
    '-=0.5'
  )
  .fromTo(subtitleRef.value,
    { y: ANIMATION_DISTANCE * 0.5, scale: 0.8, opacity: 0, letterSpacing: '30px' },
    { y: 0, scale: 1, opacity: 1, letterSpacing: '6px', duration: 0.6, ease: 'power2.out' },
    '-=0.4'
  )

  const cards = [card0Ref.value, card1Ref.value, card2Ref.value, card3Ref.value]
  const cardDelays = [0, 0.15, 0.3, 0.45]

  cards.forEach((card, i) => {
    if (!card) return
    tl.fromTo(card,
      { y: ANIMATION_DISTANCE, scale: 0.6, opacity: 0, filter: 'blur(15px)' },
      { y: 0, scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: 'back.out(1.5)' },
      `=-${0.6 - i * 0.1}`
    )
  })

  tl.fromTo(footerRef.value,
    { y: ANIMATION_DISTANCE * 0.3, scale: 0.8, opacity: 0 },
    { y: 0, scale: 1, opacity: 1, duration: 0.5, ease: 'power2.out' },
    '-=0.3'
  )

  cleanupFns.push(() => tl.kill())

  gsap.set('.plasma-card', { y: 0, scale: 1, opacity: 1, filter: 'blur(0px)' })
  gsap.set([badgeRef.value, titleRef.value, subtitleRef.value], { y: 0, scale: 1, opacity: 1, filter: 'blur(0px)' })
  gsap.set(footerRef.value, { y: 0, scale: 1, opacity: 1 })

  // ScrollTrigger - cards zoom-out-up
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
            y: -200 * p,
            scale: 1 - p * 0.8,
            opacity: Math.max(0, 1 - p * 2),
            filter: `blur(${p * 10}px)`,
            rotation: p * -15
          })
        } else {
          gsap.set(card, {
            y: 0, scale: 1, opacity: 1, filter: 'blur(0px)', rotation: 0
          })
        }
      }
    })
    cleanupFns.push(() => trigger.kill())
  })

  // Header scroll - zoom-out-up
  const headerTrigger = ScrollTrigger.create({
    trigger: headerRef.value,
    start: 'top top',
    end: '20% top',
    scrub: 1.5,
    onUpdate: (self) => {
      const p = self.progress
      gsap.set(headerRef.value, {
        y: -100 * p,
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
        y: -50 * p,
        scale: 1 - p * 0.5,
        opacity: 1 - p * 2,
        filter: `blur(${p * 6}px)`
      })
    }
  })
  cleanupFns.push(() => footerTrigger.kill())

  // Card ring animations
  const plasmaRings = document.querySelectorAll('.card-plasma-ring')
  plasmaRings.forEach((ring, i) => {
    const ringTl = gsap.timeline({ repeat: -1 })
    ringTl.to(ring, {
      rotation: 360,
      duration: 10 + i * 2,
      ease: 'none'
    })
    ringAnimations.push(ringTl)
  })
}

onMounted(() => initAnimations())

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  bgAnimations.forEach(t => t.kill())
  ringAnimations.forEach(t => t.kill())
  if (plasmaBgRef.value) {
    plasmaBgRef.value.innerHTML = ''
  }
  if (waveFieldRef.value) {
    waveFieldRef.value.innerHTML = ''
  }
})
</script>

<style lang="scss" scoped>
.plasma-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 50%, #1a0a2e 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  perspective: 1200px;
}

.plasma-background {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.wave-field {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.plasma-particle {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}

.field-wave {
  position: absolute;
  pointer-events: none;
}

.plasma-header {
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

.plasma-title {
  font-size: 56px;
  font-weight: 900;
  background: linear-gradient(90deg, #e9d5ff, #c084fc, #a855f7);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 10px;
  text-shadow: 0 0 40px rgba(168, 85, 247, 0.5);
}

.plasma-subtitle {
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

.plasma-card {
  position: relative;
  width: 260px;
  height: 340px;
  padding: 32px;
  background: linear-gradient(180deg, 
    rgba(168, 85, 247, 0.12) 0%, 
    rgba(139, 92, 246, 0.08) 50%,
    rgba(192, 132, 252, 0.12) 100%);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(168, 85, 247, 0.25);
  border-radius: 24px;
  cursor: pointer;
  transform-style: preserve-3d;
  will-change: transform, opacity, filter;
  overflow: hidden;
  transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-15px) scale(1.05);
    border-color: rgba(168, 85, 247, 0.5);
    box-shadow: 
      0 20px 40px rgba(168, 85, 247, 0.3),
      0 0 60px rgba(192, 132, 252, 0.2);
    
    .card-plasma-ring {
      animation: plasmaSpin 6s linear infinite;
    }
    .card-energy-field {
      animation: energyPulse 1.5s ease-in-out infinite;
    }
    .card-particle-ring {
      animation: particleFlow 3s linear infinite reverse;
    }
  }
}

.card-plasma-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px;
  height: 200px;
  transform: translate(-50%, -50%);
  border: 2px dashed rgba(192, 132, 252, 0.3);
  border-radius: 50%;
  pointer-events: none;
}

@keyframes plasmaSpin {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

.card-energy-field {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 160px;
  height: 160px;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

@keyframes energyPulse {
  0%, 100% { 
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.5;
  }
  50% { 
    transform: translate(-50%, -50%) scale(1.3);
    opacity: 0.9;
  }
}

.card-particle-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 180px;
  height: 180px;
  transform: translate(-50%, -50%);
  border: 1px solid rgba(192, 132, 252, 0.2);
  border-radius: 50%;
  pointer-events: none;
  background: 
    radial-gradient(circle at 30% 30%, rgba(192, 132, 252, 0.4) 2px, transparent 2px),
    radial-gradient(circle at 70% 60%, rgba(168, 85, 247, 0.4) 2px, transparent 2px),
    radial-gradient(circle at 50% 80%, rgba(139, 92, 246, 0.4) 2px, transparent 2px);
}

@keyframes particleFlow {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
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
  opacity: 0.2;
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

.plasma-footer {
  position: absolute;
  bottom: 40px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.3);
  letter-spacing: 3px;
}
</style>
