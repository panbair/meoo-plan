<template>
  <section ref="sectionRef" class="holo-section">
    <div ref="bgGridRef" class="bg-grid"></div>
    <div ref="holoBgRef" class="holo-background"></div>

    <div ref="headerRef" class="holo-header">
      <div ref="badgeRef" class="header-badge">
        <svg viewBox="0 0 24 24" fill="none">
          <polygon points="12,2 15,8 22,9 17,14 18,21 12,18 6,21 7,14 2,9 9,8" fill="currentColor"/>
        </svg>
      </div>
      <h1 ref="titleRef" class="holo-title">全息矩阵</h1>
      <p ref="subtitleRef" class="holo-subtitle">HOLOGRAPHIC MATRIX</p>
    </div>

    <div class="cards-container">
      <div ref="card0Ref" class="holo-card" data-index="0">
        <div class="card-scan-line"></div>
        <div class="card-hologram"></div>
        <div class="card-glitch"></div>
        <div class="card-content">
          <span class="card-index">01</span>
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" stroke-width="2"/>
              <path d="M8 21H16M12 17V21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M7 8L10 11L7 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h3 class="card-title">数据投影</h3>
          <p class="card-desc">全息信息的投射</p>
        </div>
      </div>

      <div ref="card1Ref" class="holo-card" data-index="1">
        <div class="card-scan-line"></div>
        <div class="card-hologram"></div>
        <div class="card-glitch"></div>
        <div class="card-content">
          <span class="card-index">02</span>
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            </svg>
          </div>
          <h3 class="card-title">维度折叠</h3>
          <p class="card-desc">空间层的交错</p>
        </div>
      </div>

      <div ref="card2Ref" class="holo-card" data-index="2">
        <div class="card-scan-line"></div>
        <div class="card-hologram"></div>
        <div class="card-glitch"></div>
        <div class="card-content">
          <span class="card-index">03</span>
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <circle cx="12" cy="12" r="2" fill="currentColor"/>
            </svg>
          </div>
          <h3 class="card-title">时空锚点</h3>
          <p class="card-desc">穿越坐标的锁定</p>
        </div>
      </div>

      <div ref="card3Ref" class="holo-card" data-index="3">
        <div class="card-scan-line"></div>
        <div class="card-hologram"></div>
        <div class="card-glitch"></div>
        <div class="card-content">
          <span class="card-index">04</span>
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M21 16V8a2 2 0 00-1-1.73L13 2.27a2 2 0 00-2 0L4 6.27A2 2 0 003 8v8a2 2 0 001 1.73L11 21.73a2 2 0 002 0l7-4a2 2 0 001-1.73z" stroke="currentColor" stroke-width="2"/>
              <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <h3 class="card-title">矩阵重建</h3>
          <p class="card-desc">数据结构的重塑</p>
        </div>
      </div>
    </div>

    <footer ref="footerRef" class="holo-footer">
      <span>CardHolographic</span>
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
const holoBgRef = ref<HTMLElement | null>(null)
const bgGridRef = ref<HTMLElement | null>(null)
const card0Ref = ref<HTMLElement | null>(null)
const card1Ref = ref<HTMLElement | null>(null)
const card2Ref = ref<HTMLElement | null>(null)
const card3Ref = ref<HTMLElement | null>(null)

let cleanupFns: TweenCleanup[] = []
let bgAnimations: gsap.core.Tween[] = []

const ANIMATION_DISTANCE = 200

const createHoloBackground = () => {
  if (!holoBgRef.value) return

  for (let i = 0; i < 40; i++) {
    const dot = document.createElement('div')
    dot.className = 'holo-dot'
    const hue = Math.random() > 0.5 ? 180 : 300
    dot.style.cssText = `
      position: absolute;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      width: ${Math.random() * 4 + 2}px;
      height: ${Math.random() * 4 + 2}px;
      background: hsla(${hue}, 100%, 60%, ${0.3 + Math.random() * 0.5});
      border-radius: 50%;
      box-shadow: 0 0 ${10 + Math.random() * 20}px hsla(${hue}, 100%, 60%, 0.6);
      pointer-events: none;
    `
    holoBgRef.value.appendChild(dot)

    const dotTl = gsap.timeline({ repeat: -1 })
    dotTl.fromTo(dot,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.3 + Math.random() * 0.5, ease: 'power2.out' }
    ).to(dot,
      { scale: 0, opacity: 0, duration: 0.3 + Math.random() * 0.5, ease: 'power2.in' },
      `+=${2 + Math.random() * 4}`
    )
    bgAnimations.push(dotTl)
  }

  for (let i = 0; i < 6; i++) {
    const beam = document.createElement('div')
    beam.className = 'holo-beam'
    const angle = (i / 6) * 360
    const hue = i % 2 === 0 ? 180 : 300
    beam.style.cssText = `
      position: absolute;
      left: 50%;
      top: 50%;
      width: 2px;
      height: ${400 + Math.random() * 200}px;
      background: linear-gradient(to bottom, hsla(${hue}, 100%, 60%, 0.8), transparent);
      transform: rotate(${angle}deg) translateY(-50%);
      transform-origin: center top;
      pointer-events: none;
      opacity: 0.3;
    `
    holoBgRef.value.appendChild(beam)

    const beamTl = gsap.timeline({ repeat: -1, yoyo: true })
    beamTl.to(beam, {
      opacity: 0.6,
      scaleY: 1.1,
      duration: 2 + Math.random() * 2,
      ease: 'sine.inOut'
    })
    bgAnimations.push(beamTl)
  }

  if (bgGridRef.value) {
    const gridTl = gsap.timeline({ repeat: -1 })
    gridTl.fromTo(bgGridRef.value,
      { backgroundPosition: '0 0' },
      { backgroundPosition: '50px 50px', duration: 8, ease: 'none' }
    )
    bgAnimations.push(gridTl)
  }
}

const initAnimations = () => {
  createHoloBackground()

  const tl = gsap.timeline({ delay: 0.3 })

  // fade-down-right: from top-left (-200, -200) to (0, 0)
  tl.fromTo(badgeRef.value,
    { x: -ANIMATION_DISTANCE, y: -ANIMATION_DISTANCE, opacity: 0, scale: 0, rotation: -360, filter: 'blur(15px)' },
    { x: 0, y: 0, opacity: 1, scale: 1, rotation: 0, filter: 'blur(0px)', duration: 1, ease: 'back.out(1.7)' }
  )
  .fromTo(titleRef.value,
    { x: -ANIMATION_DISTANCE * 0.8, y: -ANIMATION_DISTANCE * 0.6, opacity: 0, scale: 0.7, filter: 'blur(10px)' },
    { x: 0, y: 0, opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' },
    '-=0.5'
  )
  .fromTo(subtitleRef.value,
    { x: -ANIMATION_DISTANCE * 0.5, y: -ANIMATION_DISTANCE * 0.4, opacity: 0, letterSpacing: '-10px' },
    { x: 0, y: 0, opacity: 1, letterSpacing: '6px', duration: 0.6, ease: 'power2.out' },
    '-=0.4'
  )

  const cards = [card0Ref.value, card1Ref.value, card2Ref.value, card3Ref.value]
  const cardConfigs = [
    { x: -ANIMATION_DISTANCE * 0.9, y: -ANIMATION_DISTANCE * 0.8, rotation: 15, scale: 0.35, skewX: 8 },
    { x: -ANIMATION_DISTANCE * 1.1, y: -ANIMATION_DISTANCE * 0.9, rotation: 0, scale: 0.3, skewX: 0 },
    { x: -ANIMATION_DISTANCE * 0.9, y: -ANIMATION_DISTANCE * 0.8, rotation: -15, scale: 0.35, skewX: -8 },
    { x: -ANIMATION_DISTANCE * 1.0, y: -ANIMATION_DISTANCE * 0.85, rotation: 8, scale: 0.33, skewX: 4 }
  ]
  const cardEases = ['back.out(1.2)', 'elastic.out(1, 0.5)', 'back.out(1.4)', 'back.out(1.3)']

  cards.forEach((card, i) => {
    if (!card) return
    const config = cardConfigs[i] ?? { x: -ANIMATION_DISTANCE, y: -ANIMATION_DISTANCE, rotation: 0, scale: 0.35, skewX: 0 }
    const ease = cardEases[i] ?? 'power3.out'
    tl.fromTo(card,
      { x: config.x, y: config.y, opacity: 0, rotation: config.rotation, scale: config.scale, skewX: config.skewX, filter: 'blur(12px)' },
      { x: 0, y: 0, opacity: 1, rotation: 0, scale: 1, skewX: 0, filter: 'blur(0px)', duration: 1, ease },
      `=-${0.7 - i * 0.1}`
    )
  })

  tl.fromTo(footerRef.value,
    { x: -ANIMATION_DISTANCE * 0.4, y: -ANIMATION_DISTANCE * 0.3, opacity: 0 },
    { x: 0, y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
    '-=0.3'
  )

  cleanupFns.push(() => tl.kill())

  gsap.set('.holo-card', { x: 0, y: 0, opacity: 1, scale: 1, rotation: 0, skewX: 0, filter: 'blur(0px)' })
  gsap.set([badgeRef.value, titleRef.value, subtitleRef.value], { x: 0, y: 0, opacity: 1, filter: 'blur(0px)' })
  gsap.set(footerRef.value, { x: 0, y: 0, opacity: 1 })

  // ScrollTrigger - cards fly to bottom-right
  const scrollConfigs = [
    { x: 280, y: 200, rotation: 30, scale: 0.2, skewX: 15 },
    { x: 320, y: 240, rotation: 0, scale: 0.15, skewX: 0 },
    { x: 280, y: 200, rotation: -30, scale: 0.2, skewX: -15 },
    { x: 300, y: 220, rotation: 15, scale: 0.18, skewX: 8 }
  ]

  cards.forEach((card, i) => {
    if (!card) return
    const config = scrollConfigs[i] ?? { x: 280, y: 200, rotation: 0, scale: 0.2, skewX: 0 }

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
            x: (config.x ?? 280) * p,
            y: (config.y ?? 200) * p,
            opacity: Math.max(0, 1 - p * 1.8),
            scale: 1 - p * (1 - (config.scale ?? 0.2)),
            rotation: (config.rotation ?? 0) * p,
            skewX: (config.skewX ?? 0) * p,
            filter: `blur(${p * 12}px)`
          })
        } else {
          gsap.set(card, {
            x: 0, y: 0, opacity: 1, scale: 1, rotation: 0, skewX: 0, filter: 'blur(0px)'
          })
        }
      }
    })
    cleanupFns.push(() => trigger.kill())
  })

  // Header scroll - fade to top-right
  const headerTrigger = ScrollTrigger.create({
    trigger: headerRef.value,
    start: 'top top',
    end: '20% top',
    scrub: 1.5,
    onUpdate: (self) => {
      const p = self.progress
      gsap.set(headerRef.value, {
        x: -ANIMATION_DISTANCE * 0.6 * p,
        y: -ANIMATION_DISTANCE * 0.5 * p,
        opacity: 1 - p * 2,
        rotation: -p * 10,
        filter: `blur(${p * 10}px)`
      })
    }
  })
  cleanupFns.push(() => headerTrigger.kill())

  // Footer scroll - fade to top-right
  const footerTrigger = ScrollTrigger.create({
    trigger: sectionRef.value,
    start: '80% top',
    end: 'bottom top',
    scrub: 1.5,
    onUpdate: (self) => {
      const p = self.progress
      gsap.set(footerRef.value, {
        x: -ANIMATION_DISTANCE * 0.3 * p,
        y: -ANIMATION_DISTANCE * 0.25 * p,
        opacity: 1 - p * 2,
        filter: `blur(${p * 8}px)`
      })
    }
  })
  cleanupFns.push(() => footerTrigger.kill())
}

onMounted(() => {
  // 延迟初始化以确保懒加载时 DOM 已完全渲染
  setTimeout(initAnimations, 100)
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  bgAnimations.forEach(t => t.kill())
  if (holoBgRef.value) {
    holoBgRef.value.innerHTML = ''
  }
})
</script>

<style lang="scss" scoped>
.holo-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #050510 0%, #0a0a1a 50%, #0f0a1a 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  perspective: 1200px;
}

.bg-grid {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(180, 100, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(180, 100, 255, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  pointer-events: none;
}

.holo-background {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.holo-dot {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}

.holo-beam {
  position: absolute;
  pointer-events: none;
}

.holo-header {
  text-align: center;
  margin-bottom: 60px;
  position: relative;
  z-index: 10;
}

.header-badge {
  width: 70px;
  height: 70px;
  margin: 0 auto 20px;
  background: linear-gradient(135deg, #06b6d4, #8b5cf6, #ec4899);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  box-shadow: 
    0 0 30px rgba(139, 92, 246, 0.5),
    0 0 60px rgba(6, 182, 212, 0.3),
    inset 0 0 20px rgba(255, 255, 255, 0.2);
  
  svg { width: 40px; height: 40px; }
}

.holo-title {
  font-size: 56px;
  font-weight: 900;
  background: linear-gradient(90deg, #67e8f9, #a78bfa, #f472b6);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 10px;
  text-shadow: 0 0 40px rgba(139, 92, 246, 0.5);
}

.holo-subtitle {
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

.holo-card {
  position: relative;
  width: 260px;
  height: 340px;
  padding: 32px;
  background: linear-gradient(180deg, 
    rgba(6, 182, 212, 0.08) 0%, 
    rgba(139, 92, 246, 0.05) 50%,
    rgba(236, 72, 153, 0.08) 100%);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(139, 92, 246, 0.25);
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
    background: linear-gradient(
      135deg,
      transparent 0%,
      rgba(6, 182, 212, 0.1) 50%,
      transparent 100%
    );
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:hover {
    transform: translateY(-15px) rotateX(5deg) rotateY(-5deg) scale(1.05);
    border-color: rgba(139, 92, 246, 0.5);
    box-shadow: 
      0 20px 40px rgba(139, 92, 246, 0.2),
      0 0 60px rgba(6, 182, 212, 0.15);
    
    &::before { opacity: 1; }
    
    .card-scan-line {
      animation: scanMove 1.5s linear infinite;
    }
    .card-hologram {
      animation: holoFlicker 0.1s linear infinite;
    }
    .card-glitch {
      animation: glitchFlash 0.3s linear infinite;
    }
  }
}

.card-scan-line {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.8), transparent);
  opacity: 0;
  pointer-events: none;
}

@keyframes scanMove {
  0% { top: -4px; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}

.card-hologram {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(6, 182, 212, 0.03) 2px,
    rgba(6, 182, 212, 0.03) 4px
  );
  pointer-events: none;
  opacity: 0;
}

@keyframes holoFlicker {
  0%, 100% { opacity: 0; }
  50% { opacity: 0.5; }
}

.card-glitch {
  position: absolute;
  inset: 0;
  background: transparent;
  pointer-events: none;
  opacity: 0;
}

@keyframes glitchFlash {
  0%, 100% { 
    background: transparent;
    transform: translateX(0);
  }
  25% { 
    background: rgba(6, 182, 212, 0.1);
    transform: translateX(-2px);
  }
  75% { 
    background: rgba(236, 72, 153, 0.1);
    transform: translateX(2px);
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
  color: #a78bfa;
  opacity: 0.2;
  line-height: 1;
  display: block;
  margin-bottom: 12px;
}

.card-icon {
  width: 64px;
  height: 64px;
  color: #67e8f9;
  margin-bottom: 16px;
  filter: drop-shadow(0 0 10px rgba(6, 182, 212, 0.5));
  
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

.holo-footer {
  position: absolute;
  bottom: 40px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.3);
  letter-spacing: 3px;
}
</style>
