<template>
  <div class="card-fusion">
    <div ref="bgRef" class="fusion-bg">
      <div class="reactor-core">
        <div class="plasma-ring ring-outer"></div>
        <div class="plasma-ring ring-middle"></div>
        <div class="plasma-ring ring-inner"></div>
        <div class="core-center"></div>
      </div>
      <div class="magnetic-field">
        <div class="field-line line-1"></div>
        <div class="field-line line-2"></div>
        <div class="field-line line-3"></div>
        <div class="field-line line-4"></div>
      </div>
      <div class="fusion-particles"></div>
    </div>

    <div class="fusion-content">
      <div ref="titleRef" class="fusion-title">
        <span class="title-en">FUSION</span>
        <span class="title-cn">核聚变反应</span>
      </div>

      <div ref="cardsWrapRef" class="fusion-cards">
        <div
          v-for="(card, index) in fusionCards"
          :key="index"
          :ref="el => cardRefs[index] = el as HTMLElement"
          class="fusion-item"
        >
          <div class="item-icon">
            <div class="atom-container">
              <div class="electron-path path-1"></div>
              <div class="electron-path path-2"></div>
              <div class="electron-path path-3"></div>
              <div class="nucleus"></div>
            </div>
          </div>
          <div class="item-num">{{ card.num }}</div>
          <div class="item-title">{{ card.title }}</div>
          <div class="item-desc">{{ card.desc }}</div>
          <div class="item-energy">
            <div class="energy-ring" :style="{ '--energy-level': card.energy }"></div>
            <span class="energy-value">{{ card.energy }}MeV</span>
          </div>
        </div>
      </div>
    </div>

    <div ref="glowRef" class="reactor-glow"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []

const bgRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const cardRefs = ref<(HTMLElement | null)[]>([])
const glowRef = ref<HTMLElement | null>(null)

const fusionCards = [
  { num: '01', title: '氘氚聚变', desc: '氢的两种同位素融合', energy: '17.6' },
  { num: '02', title: '等离子体', desc: '万亿度高温下的物质态', energy: '100' },
  { num: '03', title: '磁场约束', desc: '托卡马克装置的奇迹', energy: '50' },
  { num: '04', title: '能量输出', desc: '清洁能源的无限可能', energy: '500' }
]

const initAnimations = () => {
  const tl = gsap.timeline()

  // Reactor core
  const rings = bgRef.value?.querySelectorAll('.plasma-ring')
  rings?.forEach((ring, i) => {
    tl.fromTo(ring,
      { scale: 0, opacity: 0, rotation: -180 },
      { scale: 1, opacity: 1, rotation: 0, duration: 1.5, ease: 'elastic.out(1, 0.5)' },
      i * 0.2
    )
    cleanupFns.push(() => gsap.set(ring, { clearProps: 'all' }))
  })

  // Core center
  const core = bgRef.value?.querySelector('.core-center')
  if (core) {
    tl.fromTo(core,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1, ease: 'back.out(1.7)' },
      0.3
    )
    cleanupFns.push(() => gsap.set(core, { clearProps: 'all' }))
  }

  // Magnetic field lines
  const fieldLines = bgRef.value?.querySelectorAll('.field-line')
  fieldLines?.forEach((line, i) => {
    tl.fromTo(line,
      { scaleX: 0, opacity: 0 },
      { scaleX: 1, opacity: 0.4, duration: 1.2, ease: 'power2.out' },
      0.5 + i * 0.15
    )
  })

  // Fusion particles
  const particles = bgRef.value?.querySelectorAll('.f-particle')
  particles?.forEach((p, i) => {
    tl.fromTo(p,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 0.8, duration: 0.6, ease: 'back.out(2)' },
      0.4 + i * 0.05
    )
  })

  // Reactor glow
  if (glowRef.value) {
    tl.fromTo(glowRef.value,
      { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1, duration: 2, ease: 'power2.out' },
      0.2
    )
    cleanupFns.push(() => gsap.set(glowRef.value, { clearProps: 'all' }))
  }

  // Title with slide-up
  if (titleRef.value) {
    tl.fromTo(titleRef.value,
      { y: '100%', visibility: 'hidden', opacity: 0 },
      { y: 0, visibility: 'visible', opacity: 1, duration: 0.8, ease: 'power3.out' }
    )
    cleanupFns.push(() => gsap.set(titleRef.value, { clearProps: 'all' }))
  }

  // Cards with slide-up
  cardRefs.value.forEach((card, i) => {
    if (!card) return

    tl.fromTo(card,
      { y: '100%', visibility: 'hidden', opacity: 0 },
      { y: 0, visibility: 'visible', opacity: 1, duration: 0.8, ease: 'power3.out' },
      0.3 + i * 0.15
    )

    // Hover animation
    const handleEnter = () => {
      gsap.to(card, {
        y: -12,
        boxShadow: '0 30px 80px rgba(0, 200, 255, 0.4)',
        duration: 0.35,
        ease: 'power2.out'
      })
      gsap.to(card.querySelector('.nucleus'), {
        scale: 1.5,
        duration: 0.3
      })
    }

    const handleLeave = () => {
      gsap.to(card, {
        y: 0,
        boxShadow: '0 15px 50px rgba(0, 0, 0, 0.3)',
        duration: 0.35,
        ease: 'power2.out'
      })
      gsap.to(card.querySelector('.nucleus'), {
        scale: 1,
        duration: 0.3
      })
    }

    card.addEventListener('mouseenter', handleEnter)
    card.addEventListener('mouseleave', handleLeave)

    cleanupFns.push(() => {
      card.removeEventListener('mouseenter', handleEnter)
      card.removeEventListener('mouseleave', handleLeave)
      gsap.set(card, { clearProps: 'all' })
    })
  })

  // ScrollTrigger for cards
  cardRefs.value.forEach((card) => {
    if (!card) return

    const st = ScrollTrigger.create({
      trigger: card,
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1.5,
      onUpdate: (self) => {
        gsap.set(card, {
          y: 200 * self.progress,
          opacity: Math.max(0, 1 - self.progress * 2),
          visibility: self.progress < 1 ? 'visible' : 'hidden'
        })
      }
    })
    cleanupFns.push(() => st.kill())
  })

  // ScrollTrigger for title
  if (titleRef.value) {
    const st = ScrollTrigger.create({
      trigger: titleRef.value,
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1.5,
      onUpdate: (self) => {
        gsap.set(titleRef.value, {
          y: 150 * self.progress,
          opacity: Math.max(0, 1 - self.progress * 2)
        })
      }
    })
    cleanupFns.push(() => st.kill())
  }
}

onMounted(() => {
  initAnimations()
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
})
</script>

<style lang="scss" scoped>
.card-fusion {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(180deg, #050510 0%, #0a0a20 50%, #050515 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fusion-bg {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.reactor-core {
  position: relative;
  width: 500px;
  height: 500px;
}

.plasma-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  border: 3px solid;
  animation: plasmaRotate linear infinite;

  &.ring-outer {
    width: 500px;
    height: 500px;
    border-color: rgba(0, 150, 255, 0.3);
    animation-duration: 20s;
  }

  &.ring-middle {
    width: 380px;
    height: 380px;
    border-color: rgba(0, 200, 255, 0.4);
    animation-duration: 15s;
    animation-direction: reverse;
  }

  &.ring-inner {
    width: 260px;
    height: 260px;
    border-color: rgba(100, 220, 255, 0.5);
    animation-duration: 10s;
  }
}

@keyframes plasmaRotate {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

.core-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
  background: radial-gradient(circle,
    #ffffff 0%,
    #00d4ff 20%,
    #0099ff 40%,
    #0066cc 70%,
    transparent 100%
  );
  border-radius: 50%;
  box-shadow:
    0 0 60px rgba(0, 200, 255, 0.8),
    0 0 120px rgba(0, 150, 255, 0.5),
    0 0 200px rgba(0, 100, 200, 0.3);
  animation: corePulse 2s ease-in-out infinite;
}

@keyframes corePulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.9; }
  50% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
}

.magnetic-field {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 600px;
}

.field-line {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 300px;
  height: 2px;
  background: linear-gradient(90deg, rgba(0, 200, 255, 0.5), transparent);
  transform-origin: left center;
  animation: fieldPulse 3s ease-in-out infinite;

  &.line-1 { transform: translate(0, -50%) rotate(0deg); }
  &.line-2 { transform: translate(0, -50%) rotate(45deg); }
  &.line-3 { transform: translate(0, -50%) rotate(90deg); }
  &.line-4 { transform: translate(0, -50%) rotate(135deg); }
}

@keyframes fieldPulse {
  0%, 100% { opacity: 0.3; width: 250px; }
  50% { opacity: 0.6; width: 350px; }
}

.fusion-particles {
  position: absolute;
  inset: 0;
}

:global(.f-particle) {
  position: absolute;
  width: 8px;
  height: 8px;
  background: radial-gradient(circle, #00d4ff 0%, rgba(0, 200, 255, 0.5) 50%, transparent 100%);
  border-radius: 50%;
  box-shadow: 0 0 15px rgba(0, 200, 255, 0.8);
  animation: particleOrbit 8s linear infinite;

  @for $i from 1 through 16 {
    &:nth-child(#{$i}) {
      top: 50%;
      left: 50%;
      animation-delay: -$i * 0.5s;
    }
  }
}

@keyframes particleOrbit {
  from {
    transform: rotate(0deg) translateX(200px) rotate(0deg);
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  to {
    transform: rotate(360deg) translateX(200px) rotate(-360deg);
    opacity: 0.6;
  }
}

.fusion-content {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 60px;
}

.fusion-title {
  margin-bottom: 80px;
  will-change: transform, opacity;

  .title-en {
    display: block;
    font-family: 'Orbitron', sans-serif;
    font-size: 72px;
    font-weight: 900;
    letter-spacing: 20px;
    background: linear-gradient(180deg, #ffffff 0%, #00d4ff 50%, #0066ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 0 60px rgba(0, 200, 255, 0.6);
    filter: drop-shadow(0 0 30px rgba(0, 180, 255, 0.5));
  }

  .title-cn {
    display: block;
    font-family: 'Noto Sans SC', sans-serif;
    font-size: 28px;
    font-weight: 300;
    letter-spacing: 15px;
    color: rgba(0, 200, 255, 0.8);
    margin-top: 15px;
  }
}

.fusion-cards {
  display: flex;
  gap: 30px;
  justify-content: center;
  flex-wrap: wrap;
}

.fusion-item {
  position: relative;
  width: 240px;
  padding: 35px 25px;
  background: rgba(10, 15, 30, 0.85);
  border: 1px solid rgba(0, 200, 255, 0.2);
  border-radius: 18px;
  backdrop-filter: blur(20px);
  overflow: hidden;
  will-change: transform, opacity;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 50%, rgba(0, 200, 255, 0.1) 0%, transparent 70%);
    pointer-events: none;
  }
}

.item-icon {
  width: 70px;
  height: 70px;
  margin: 0 auto 20px;
}

.atom-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.electron-path {
  position: absolute;
  top: 50%;
  left: 50%;
  border: 1px solid rgba(0, 200, 255, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);

  &.path-1 {
    width: 70px;
    height: 70px;
    animation: electronOrbit 3s linear infinite;
  }

  &.path-2 {
    width: 50px;
    height: 50px;
    animation: electronOrbit 2.5s linear infinite reverse;
  }

  &.path-3 {
    width: 30px;
    height: 30px;
    animation: electronOrbit 2s linear infinite;
  }

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width: 6px;
    height: 6px;
    background: #00d4ff;
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(0, 200, 255, 0.8);
    transform: translate(-50%, -50%);
  }
}

@keyframes electronOrbit {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

.nucleus {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  background: radial-gradient(circle, #ffffff 0%, #00d4ff 100%);
  border-radius: 50%;
  box-shadow: 0 0 15px rgba(0, 200, 255, 0.8);
}

.item-num {
  font-family: 'Orbitron', sans-serif;
  font-size: 42px;
  font-weight: 700;
  color: rgba(0, 200, 255, 0.1);
  margin-bottom: 8px;
}

.item-title {
  font-size: 22px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 10px;
  text-shadow: 0 0 15px rgba(0, 200, 255, 0.4);
}

.item-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.5;
  margin-bottom: 15px;
}

.item-energy {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.energy-ring {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 200, 255, 0.3);
  border-radius: 50%;
  position: relative;
  animation: energySpin 2s linear infinite;

  &::before {
    content: '';
    position: absolute;
    top: -3px;
    left: 50%;
    width: 8px;
    height: 8px;
    background: #00d4ff;
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(0, 200, 255, 0.8);
    transform: translateX(-50%);
  }
}

@keyframes energySpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.energy-value {
  font-family: 'Orbitron', sans-serif;
  font-size: 14px;
  color: rgba(0, 200, 255, 0.9);
}

.reactor-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  height: 800px;
  background: radial-gradient(circle, rgba(0, 150, 255, 0.15) 0%, transparent 60%);
  pointer-events: none;
}
</style>
