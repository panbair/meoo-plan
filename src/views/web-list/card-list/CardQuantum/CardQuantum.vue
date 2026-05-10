<template>
  <section ref="sectionRef" class="quantum-section">
    <div ref="particleBgRef" class="particle-background"></div>
    <div ref="waveBgRef" class="wave-background"></div>

    <div ref="headerRef" class="quantum-header">
      <div ref="badgeRef" class="header-badge">
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="3" fill="currentColor"/>
          <ellipse cx="12" cy="12" rx="10" ry="4" stroke="currentColor" stroke-width="1.5" transform="rotate(0 12 12)"/>
          <ellipse cx="12" cy="12" rx="10" ry="4" stroke="currentColor" stroke-width="1.5" transform="rotate(60 12 12)"/>
          <ellipse cx="12" cy="12" rx="10" ry="4" stroke="currentColor" stroke-width="1.5" transform="rotate(120 12 12)"/>
        </svg>
      </div>
      <h1 ref="titleRef" class="quantum-title">量子脉冲</h1>
      <p ref="subtitleRef" class="quantum-subtitle">QUANTUM PULSE</p>
    </div>

    <div class="cards-container">
      <div ref="card0Ref" class="quantum-card" data-index="0">
        <div class="card-orbit card-orbit-1"></div>
        <div class="card-orbit card-orbit-2"></div>
        <div class="card-quantum"></div>
        <div class="card-content">
          <span class="card-index">01</span>
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="2" fill="currentColor"/>
              <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 3"/>
              <circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.5" stroke-dasharray="2 4"/>
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1"/>
            </svg>
          </div>
          <h3 class="card-title">量子纠缠</h3>
          <p class="card-desc">跨越时空的联系</p>
        </div>
      </div>

      <div ref="card1Ref" class="quantum-card" data-index="1">
        <div class="card-orbit card-orbit-1"></div>
        <div class="card-orbit card-orbit-2"></div>
        <div class="card-quantum"></div>
        <div class="card-content">
          <span class="card-index">02</span>
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="currentColor" stroke-width="2"/>
              <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <circle cx="12" cy="12" r="2" fill="currentColor"/>
            </svg>
          </div>
          <h3 class="card-title">态叠加</h3>
          <p class="card-desc">多态并存的可能</p>
        </div>
      </div>

      <div ref="card2Ref" class="quantum-card" data-index="2">
        <div class="card-orbit card-orbit-1"></div>
        <div class="card-orbit card-orbit-2"></div>
        <div class="card-quantum"></div>
        <div class="card-content">
          <span class="card-index">03</span>
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M4 12h16M4 6h16M4 18h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <circle cx="8" cy="6" r="2" fill="currentColor"/>
              <circle cx="16" cy="12" r="2" fill="currentColor"/>
              <circle cx="10" cy="18" r="2" fill="currentColor"/>
            </svg>
          </div>
          <h3 class="card-title">隧穿效应</h3>
          <p class="card-desc">穿墙而过的奇迹</p>
        </div>
      </div>

      <div ref="card3Ref" class="quantum-card" data-index="3">
        <div class="card-orbit card-orbit-1"></div>
        <div class="card-orbit card-orbit-2"></div>
        <div class="card-quantum"></div>
        <div class="card-content">
          <span class="card-index">04</span>
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <circle cx="12" cy="12" r="6" stroke="currentColor" stroke-width="2" stroke-dasharray="4 2"/>
              <circle cx="12" cy="12" r="2" fill="currentColor"/>
              <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="currentColor" stroke-width="1.5"/>
            </svg>
          </div>
          <h3 class="card-title">波粒二象性</h3>
          <p class="card-desc">既是粒子也是波</p>
        </div>
      </div>
    </div>

    <footer ref="footerRef" class="quantum-footer">
      <span>CardQuantum</span>
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
const particleBgRef = ref<HTMLElement | null>(null)
const waveBgRef = ref<HTMLElement | null>(null)
const card0Ref = ref<HTMLElement | null>(null)
const card1Ref = ref<HTMLElement | null>(null)
const card2Ref = ref<HTMLElement | null>(null)
const card3Ref = ref<HTMLElement | null>(null)

let cleanupFns: TweenCleanup[] = []
let bgAnimations: gsap.core.Tween[] = []
let orbitAnimations: gsap.core.Tween[] = []

const initBackground = () => {
  if (!particleBgRef.value) return

  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div')
    particle.className = 'bg-particle'
    const size = 2 + Math.random() * 4
    particle.style.cssText = `
      position: absolute;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      width: ${size}px;
      height: ${size}px;
      background: rgba(34, 211, 238, ${0.3 + Math.random() * 0.5});
      border-radius: 50%;
      box-shadow: 0 0 ${size * 3}px rgba(34, 211, 238, 0.5);
      pointer-events: none;
    `
    particleBgRef.value.appendChild(particle)

    const tl = gsap.timeline({ repeat: -1 })
    const duration = 2 + Math.random() * 4
    tl.fromTo(particle,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: duration * 0.3, ease: 'power2.out' }
    ).to(particle,
      { scale: 0, opacity: 0, duration: duration * 0.7, ease: 'power2.in' },
      `+=${duration * 0.5}`
    )
    bgAnimations.push(tl)
  }

  for (let i = 0; i < 4; i++) {
    const wave = document.createElement('div')
    wave.className = 'bg-wave'
    const size = 200 + i * 150
    wave.style.cssText = `
      position: absolute;
      left: 50%;
      top: 50%;
      width: ${size}px;
      height: ${size}px;
      border: 1px solid rgba(34, 211, 238, ${0.15 - i * 0.03});
      border-radius: 50%;
      transform: translate(-50%, -50%) scale(0);
      pointer-events: none;
    `
    waveBgRef.value?.appendChild(wave)

    const waveTl = gsap.timeline({ repeat: -1, delay: i * 0.8 })
    waveTl.to(wave, {
      scale: 1.5,
      opacity: 0,
      duration: 4,
      ease: 'power2.out'
    })
    bgAnimations.push(waveTl)
  }
}

const initAnimations = () => {
  initBackground()

  // zoom-in 入场动画
  const tl = gsap.timeline({ delay: 0.3 })

  tl.fromTo(badgeRef.value,
    { scale: 0, opacity: 0, rotation: -180, filter: 'blur(20px)' },
    { scale: 1, opacity: 1, rotation: 0, filter: 'blur(0px)', duration: 1, ease: 'back.out(2)' }
  )
  .fromTo(titleRef.value,
    { scale: 0.5, opacity: 0, filter: 'blur(15px)' },
    { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' },
    '-=0.6'
  )
  .fromTo(subtitleRef.value,
    { scale: 0.8, opacity: 0, letterSpacing: '30px' },
    { scale: 1, opacity: 1, letterSpacing: '6px', duration: 0.6, ease: 'power2.out' },
    '-=0.4'
  )

  const cards = [card0Ref.value, card1Ref.value, card2Ref.value, card3Ref.value]

  cards.forEach((card, i) => {
    if (!card) return
    const delay = i * 0.15
    tl.fromTo(card,
      { scale: 0.6, opacity: 0, filter: 'blur(15px)' },
      { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: 'back.out(1.5)' },
      `=-${0.5 - i * 0.1}`
    )
  })

  tl.fromTo(footerRef.value,
    { scale: 0.8, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.5, ease: 'power2.out' },
    '-=0.3'
  )

  cleanupFns.push(() => tl.kill())

  gsap.set('.quantum-card', { scale: 1, opacity: 1, filter: 'blur(0px)' })
  gsap.set([badgeRef.value, titleRef.value, subtitleRef.value], { scale: 1, opacity: 1, filter: 'blur(0px)' })
  gsap.set(footerRef.value, { scale: 1, opacity: 1 })

  // ScrollTrigger - cards zoom out and fade
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
            scale: 1 - p * 0.8,
            opacity: Math.max(0, 1 - p * 2),
            filter: `blur(${p * 10}px)`,
            rotation: p * 10
          })
        } else {
          gsap.set(card, {
            scale: 1, opacity: 1, filter: 'blur(0px)', rotation: 0
          })
        }
      }
    })
    cleanupFns.push(() => trigger.kill())
  })

  // Header scroll - zoom out
  const headerTrigger = ScrollTrigger.create({
    trigger: headerRef.value,
    start: 'top top',
    end: '20% top',
    scrub: 1.5,
    onUpdate: (self) => {
      const p = self.progress
      gsap.set(headerRef.value, {
        scale: 1 - p * 0.5,
        opacity: 1 - p * 2,
        filter: `blur(${p * 8}px)`
      })
    }
  })
  cleanupFns.push(() => headerTrigger.kill())

  // Footer scroll - zoom out
  const footerTrigger = ScrollTrigger.create({
    trigger: sectionRef.value,
    start: '80% top',
    end: 'bottom top',
    scrub: 1.5,
    onUpdate: (self) => {
      const p = self.progress
      gsap.set(footerRef.value, {
        scale: 1 - p * 0.5,
        opacity: 1 - p * 2,
        filter: `blur(${p * 6}px)`
      })
    }
  })
  cleanupFns.push(() => footerTrigger.kill())

  // Orbit animations for cards
  const orbits = document.querySelectorAll('.card-orbit')
  orbits.forEach((orbit, i) => {
    const isOrbit1 = orbit.classList.contains('card-orbit-1')
    const orbitTl = gsap.timeline({ repeat: -1 })
    orbitTl.to(orbit, {
      rotation: isOrbit1 ? 360 : -360,
      duration: isOrbit1 ? 8 : 6,
      ease: 'none'
    })
    orbitAnimations.push(orbitTl)
  })
}

onMounted(() => initAnimations())

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  bgAnimations.forEach(t => t.kill())
  orbitAnimations.forEach(t => t.kill())
  if (particleBgRef.value) {
    particleBgRef.value.innerHTML = ''
  }
  if (waveBgRef.value) {
    waveBgRef.value.innerHTML = ''
  }
})
</script>

<style lang="scss" scoped>
.quantum-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #030712 0%, #0c0a1a 50%, #030712 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  perspective: 1200px;
}

.particle-background {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.wave-background {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.bg-particle {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}

.bg-wave {
  position: absolute;
  pointer-events: none;
}

.quantum-header {
  text-align: center;
  margin-bottom: 60px;
  position: relative;
  z-index: 10;
}

.header-badge {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  background: linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  box-shadow: 
    0 0 40px rgba(34, 211, 238, 0.5),
    0 0 80px rgba(59, 130, 246, 0.3),
    inset 0 0 30px rgba(255, 255, 255, 0.2);

  svg { width: 50px; height: 50px; }
}

.quantum-title {
  font-size: 56px;
  font-weight: 900;
  background: linear-gradient(90deg, #67e8f9, #3b82f6, #a78bfa);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 10px;
  text-shadow: 0 0 40px rgba(34, 211, 238, 0.5);
}

.quantum-subtitle {
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

.quantum-card {
  position: relative;
  width: 260px;
  height: 340px;
  padding: 32px;
  background: linear-gradient(180deg, 
    rgba(34, 211, 238, 0.1) 0%, 
    rgba(59, 130, 246, 0.08) 50%,
    rgba(139, 92, 246, 0.1) 100%);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(34, 211, 238, 0.2);
  border-radius: 24px;
  cursor: pointer;
  transform-style: preserve-3d;
  will-change: transform, opacity, filter;
  overflow: hidden;
  transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-15px) scale(1.05);
    border-color: rgba(34, 211, 238, 0.5);
    box-shadow: 
      0 20px 40px rgba(34, 211, 238, 0.2),
      0 0 60px rgba(59, 130, 246, 0.15);
    
    .card-orbit-1 {
      animation: orbitSpin1 4s linear infinite;
    }
    .card-orbit-2 {
      animation: orbitSpin2 3s linear infinite;
    }
    .card-quantum {
      animation: quantumPulse 1s ease-in-out infinite;
    }
  }
}

.card-orbit {
  position: absolute;
  border-radius: 50%;
  border: 1px dashed rgba(34, 211, 238, 0.3);
  pointer-events: none;
}

.card-orbit-1 {
  width: 180px;
  height: 180px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotateX(70deg);
}

.card-orbit-2 {
  width: 140px;
  height: 140px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotateX(70deg) rotateY(45deg);
}

@keyframes orbitSpin1 {
  from { transform: translate(-50%, -50%) rotateX(70deg) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotateX(70deg) rotate(360deg); }
}

@keyframes orbitSpin2 {
  from { transform: translate(-50%, -50%) rotateX(70deg) rotateY(45deg) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotateX(70deg) rotateY(45deg) rotate(-360deg); }
}

.card-quantum {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 60px;
  height: 60px;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(34, 211, 238, 0.4) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

@keyframes quantumPulse {
  0%, 100% { 
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.4;
  }
  50% { 
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 0.8;
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
  color: #67e8f9;
  opacity: 0.2;
  line-height: 1;
  display: block;
  margin-bottom: 12px;
}

.card-icon {
  width: 64px;
  height: 64px;
  color: #22d3ee;
  margin-bottom: 16px;
  filter: drop-shadow(0 0 10px rgba(34, 211, 238, 0.5));
  
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

.quantum-footer {
  position: absolute;
  bottom: 40px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.3);
  letter-spacing: 3px;
}
</style>
