<template>
  <section ref="containerRef" class="card-time-elastic">
    <div ref="bgRef" class="elastic-bg">
      <div ref="orb1Ref" class="bg-orb orb-1"></div>
      <div ref="orb2Ref" class="bg-orb orb-2"></div>
      <div ref="orb3Ref" class="bg-orb orb-3"></div>
      <div class="bg-particles">
        <div v-for="i in 30" :key="i" class="particle"></div>
      </div>
    </div>

    <div ref="contentRef" class="elastic-content">
      <div ref="headerRef" class="elastic-header">
        <div ref="badgeRef" class="header-badge">
          <span class="badge-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
          </span>
          <span class="badge-text">Kinetic Design</span>
        </div>
        <h1 ref="titleRef" class="elastic-title">ELASTIC</h1>
        <p ref="subtitleRef" class="elastic-subtitle">
          Bounce into the future of interaction
        </p>
      </div>

      <div ref="cardsWrapperRef" class="cards-wrapper">
        <div
          v-for="(card, index) in cards"
          :key="index"
          :ref="el => cardRefs[index] = el as HTMLElement"
          class="elastic-card"
          :data-index="index + 1"
        >
          <div class="card-glow"></div>
          <div class="card-inner">
            <div class="card-visual">
              <div class="visual-ring ring-outer"></div>
              <div class="visual-ring ring-inner"></div>
              <div class="visual-icon">
                <svg v-if="index === 0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
                <svg v-else-if="index === 1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
                <svg v-else-if="index === 2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                <svg v-else-if="index === 3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
            </div>
            <div class="card-body">
              <span class="card-number">{{ String(index + 1).padStart(2, '0') }}</span>
              <h3 class="card-title">{{ card.title }}</h3>
              <p class="card-desc">{{ card.desc }}</p>
            </div>
            <div class="card-footer">
              <span class="card-tag">{{ card.tag }}</span>
              <span class="card-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div ref="footerRef" class="elastic-footer">
        <div ref="deco1Ref" class="footer-deco deco-left"></div>
        <span ref="footerTextRef" class="footer-text">Feel the Bounce</span>
        <div ref="deco2Ref" class="footer-deco deco-right"></div>
      </div>
    </div>

    <div ref="particlesRef" class="floating-particles">
      <div v-for="i in 20" :key="i" class="float-particle"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void

const containerRef = ref<HTMLElement | null>(null)
const bgRef = ref<HTMLElement | null>(null)
const orb1Ref = ref<HTMLElement | null>(null)
const orb2Ref = ref<HTMLElement | null>(null)
const orb3Ref = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const badgeRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const cardsWrapperRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const footerTextRef = ref<HTMLElement | null>(null)
const deco1Ref = ref<HTMLElement | null>(null)
const deco2Ref = ref<HTMLElement | null>(null)
const particlesRef = ref<HTMLElement | null>(null)

const cardRefs = ref<(HTMLElement | null)[]>([])

const cards = [
  { title: 'Rebound', desc: 'Energy that springs back with renewed force', tag: 'Dynamic' },
  { title: 'Kinetic', desc: 'Motion captured in perfect equilibrium', tag: 'Active' },
  { title: 'Vibrate', desc: 'Subtle tremors that speak volumes', tag: 'Alive' },
  { title: 'Momentum', desc: 'Forward thrust that defies resistance', tag: 'Force' },
  { title: 'Impact', desc: 'The moment of contact, transformed', tag: 'Power' }
]

const cleanupFns: TweenCleanup[] = []

onMounted(() => {
  const allCards = cardRefs.value.filter(Boolean) as HTMLElement[]
  const cardInners = allCards.map(card => card.querySelector('.card-inner') as HTMLElement)
  const cardGlows = allCards.map(card => card.querySelector('.card-glow') as HTMLElement)
  const cardVisuals = allCards.map(card => card.querySelector('.visual-icon') as HTMLElement)

  const tl = gsap.timeline({
    defaults: { duration: 0.8, ease: 'back.out(1.7)' },
    paused: true
  })

  gsap.set([badgeRef.value, titleRef.value, subtitleRef.value], {
    opacity: 0,
    y: -30
  })

  gsap.set(allCards, {
    y: 150,
    opacity: 0,
    scale: 0.7,
    rotate: -5
  })

  gsap.set(cardGlows, {
    opacity: 0,
    scale: 0.5
  })

  gsap.set([footerTextRef.value, deco1Ref.value, deco2Ref.value], {
    opacity: 0,
    scaleX: 0
  })

  tl.to([badgeRef.value, titleRef.value, subtitleRef.value], {
    opacity: 1,
    y: 0,
    duration: 0.6,
    stagger: 0.12,
    ease: 'power3.out'
  })

  tl.to(allCards, {
    y: 0,
    opacity: 1,
    scale: 1,
    rotate: 0,
    stagger: 0.12
  }, '-=0.2')

  tl.to(cardGlows, {
    opacity: 1,
    scale: 1,
    stagger: 0.12,
    duration: 0.6
  }, '-=0.6')

  tl.to(allCards, {
    y: -15,
    scale: 1.02,
    ease: 'power2.out',
    stagger: 0.1,
    duration: 0.4
  }, '-=0.3')

  tl.to(allCards, {
    y: 0,
    scale: 1,
    ease: 'elastic.out(1, 0.5)',
    stagger: 0.08,
    duration: 0.6
  }, '-=0.4')

  tl.from(cardVisuals, {
    scale: 0,
    rotation: -180,
    stagger: 0.1,
    duration: 0.8,
    ease: 'back.out(2)'
  }, '-=0.5')

  tl.from('.elastic-card .card-number', {
    y: 20,
    opacity: 0,
    stagger: 0.08,
    duration: 0.5,
    ease: 'power2.out'
  }, '-=0.6')

  tl.from('.elastic-card .card-title', {
    y: 15,
    opacity: 0,
    stagger: 0.08,
    duration: 0.5,
    ease: 'power2.out'
  }, '-=0.4')

  tl.from('.elastic-card .card-desc', {
    y: 10,
    opacity: 0,
    stagger: 0.08,
    duration: 0.4,
    ease: 'power2.out'
  }, '-=0.4')

  tl.to([footerTextRef.value, deco1Ref.value, deco2Ref.value], {
    opacity: 1,
    scaleX: 1,
    stagger: 0.1,
    duration: 0.5,
    ease: 'back.out(1.5)'
  }, '-=0.2')

  tl.play()

  const scrollTl = gsap.timeline({
    scrollTrigger: {
      trigger: containerRef.value,
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1.5
    }
  })

  scrollTl.to(allCards[0], {
    x: -70,
    y: 50,
    scale: 0.85,
    opacity: 0.6,
    rotation: -8
  })

  scrollTl.to(allCards[1], {
    x: -35,
    y: 25,
    scale: 0.92,
    opacity: 0.8,
    rotation: -4
  }, '-=0.4')

  scrollTl.to(allCards[2], {
    scale: 1.2,
    y: -40,
    zIndex: 10,
    filter: 'brightness(1.2)'
  }, '-=0.4')

  scrollTl.to(allCards[3], {
    x: 35,
    y: 25,
    scale: 0.92,
    opacity: 0.8,
    rotation: 4
  }, '-=0.5')

  scrollTl.to(allCards[4], {
    x: 70,
    y: 50,
    scale: 0.85,
    opacity: 0.6,
    rotation: 8
  }, '-=0.5')

  const continuousBounce = gsap.timeline({ paused: true })
  continuousBounce.to(allCards, {
    y: () => gsap.utils.random(-20, -8),
    rotation: () => gsap.utils.random(-4, 4),
    scale: () => gsap.utils.random(0.98, 1.02),
    duration: 2.2,
    ease: 'elastic.out(1, 0.4)',
    repeat: -1,
    yoyo: true,
    stagger: { each: 0.25, from: 'random' }
  })

  ScrollTrigger.create({
    trigger: containerRef.value,
    start: 'top 80%',
    onEnter: () => continuousBounce.play(),
    onLeave: () => continuousBounce.pause(),
    onEnterBack: () => continuousBounce.play(),
    onLeaveBack: () => continuousBounce.pause()
  })

  gsap.to(orb1Ref.value, {
    x: 100,
    y: 50,
    scale: 1.2,
    duration: 6,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true
  })

  gsap.to(orb2Ref.value, {
    x: -80,
    y: -60,
    scale: 0.8,
    duration: 8,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true
  })

  gsap.to(orb3Ref.value, {
    x: 60,
    y: 100,
    scale: 1.1,
    duration: 7,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true
  })

  const floatParticles = particlesRef.value?.querySelectorAll('.float-particle') as NodeListOf<HTMLElement>
  if (floatParticles) {
    gsap.to(floatParticles, {
      y: () => gsap.utils.random(-100, -30),
      x: () => gsap.utils.random(-50, 50),
      opacity: () => gsap.utils.random(0.3, 0.8),
      scale: () => gsap.utils.random(0.5, 1.5),
      duration: () => gsap.utils.random(3, 6),
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      stagger: { each: 0.3, from: 'random' }
    })
  }

  cleanupFns.push(
    () => {
      tl.kill()
      scrollTl.kill()
      continuousBounce.kill()
    }
  )
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style lang="scss" scoped>
.card-time-elastic {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #0c1222 0%, #1a1f35 50%, #0d1425 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

.elastic-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;

  &.orb-1 {
    top: 10%;
    left: 20%;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, #06b6d4, transparent);
  }

  &.orb-2 {
    bottom: 20%;
    right: 15%;
    width: 350px;
    height: 350px;
    background: radial-gradient(circle, #8b5cf6, transparent);
  }

  &.orb-3 {
    top: 60%;
    left: 60%;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, #f472b6, transparent);
  }
}

.bg-particles {
  position: absolute;
  inset: 0;

  .particle {
    position: absolute;
    width: 2px;
    height: 2px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;

    @for $i from 1 through 30 {
      &:nth-child(#{$i}) {
        left: #{$i * 3.3}%;
        top: #{$i * 2.5}%;
        animation: particleFloat #{$i * 0.5 + 3}s ease-in-out infinite;
        animation-delay: #{$i * 0.1}s;
      }
    }
  }
}

@keyframes particleFloat {
  0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; }
  50% { transform: translateY(-30px) scale(1.5); opacity: 0.7; }
}

.elastic-content {
  width: 100%;
  max-width: 1500px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 50px;
  position: relative;
  z-index: 1;
}

.elastic-header {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.header-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: rgba(6, 182, 212, 0.9);
  letter-spacing: 3px;
  text-transform: uppercase;
  padding: 10px 24px;
  border: 1px solid rgba(6, 182, 212, 0.3);
  border-radius: 30px;
  background: rgba(6, 182, 212, 0.08);

  .badge-icon {
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 14px;
      height: 14px;
      color: #06b6d4;
    }
  }
}

.elastic-title {
  font-family: 'Outfit', 'Inter', sans-serif;
  font-size: 80px;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: 20px;
  text-transform: uppercase;
  margin: 0;
  background: linear-gradient(135deg, #ffffff 0%, #06b6d4 50%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.elastic-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 4px;
  margin: 0;
  max-width: 450px;
}

.cards-wrapper {
  display: flex;
  gap: 24px;
  perspective: 1500px;
  transform-style: preserve-3d;
}

.elastic-card {
  width: 200px;
  height: 320px;
  position: relative;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  z-index: 1;

  &:nth-child(3) {
    z-index: 5;
  }

  &:hover {
    .card-glow {
      opacity: 1;
      transform: scale(1.2);
    }

    .visual-icon {
      transform: scale(1.15) rotate(10deg);
    }

    .card-arrow {
      transform: translateX(5px);
    }
  }
}

.card-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 180px;
  height: 180px;
  transform: translate(-50%, -50%) scale(1);
  background: radial-gradient(circle, rgba(6, 182, 212, 0.3), transparent 70%);
  border-radius: 50%;
  filter: blur(30px);
  opacity: 0.6;
  transition: all 0.4s ease;
  pointer-events: none;
}

.card-inner {
  width: 100%;
  height: 100%;
  background: linear-gradient(165deg, rgba(20, 30, 50, 0.95), rgba(12, 18, 34, 0.98));
  backdrop-filter: blur(30px);
  border: 1px solid rgba(6, 182, 212, 0.2);
  border-radius: 24px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(6, 182, 212, 0.15);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-20px) rotateX(5deg) rotateY(-5deg);
    border-color: rgba(139, 92, 246, 0.5);
    box-shadow: 0 30px 80px rgba(139, 92, 246, 0.25);
  }
}

.card-visual {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.visual-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(6, 182, 212, 0.3);

  &.ring-outer {
    width: 80px;
    height: 80px;
    animation: ringPulse 3s ease-in-out infinite;
  }

  &.ring-inner {
    width: 60px;
    height: 60px;
    animation: ringPulse 3s ease-in-out infinite 0.5s;
  }
}

@keyframes ringPulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

.visual-icon {
  position: relative;
  z-index: 1;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(139, 92, 246, 0.2));
  border-radius: 14px;
  transition: transform 0.4s ease;

  svg {
    width: 28px;
    height: 28px;
    color: #06b6d4;
  }
}

.card-body {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card-number {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  color: rgba(6, 182, 212, 0.4);
  letter-spacing: 3px;
}

.card-title {
  font-family: 'Outfit', 'Inter', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  letter-spacing: 0.5px;
}

.card-desc {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.6;
  margin: 0;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid rgba(6, 182, 212, 0.1);
}

.card-tag {
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  font-weight: 600;
  color: #06b6d4;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding: 4px 10px;
  background: rgba(6, 182, 212, 0.1);
  border-radius: 12px;
}

.card-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  transition: transform 0.3s ease;

  svg {
    width: 18px;
    height: 18px;
    color: rgba(6, 182, 212, 0.6);
  }
}

.elastic-footer {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-top: 10px;
}

.footer-deco {
  width: 100px;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.5), transparent);
  border-radius: 1px;
}

.footer-text {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: rgba(139, 92, 246, 0.7);
  letter-spacing: 5px;
  text-transform: uppercase;
}

.floating-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;

  .float-particle {
    position: absolute;
    width: 4px;
    height: 4px;
    background: rgba(6, 182, 212, 0.4);
    border-radius: 50%;

    @for $i from 1 through 20 {
      &:nth-child(#{$i}) {
        left: #{$i * 4.5}%;
        bottom: #{$i * 3}%;
      }
    }
  }
}

@media (max-width: 1200px) {
  .cards-wrapper {
    gap: 18px;
  }

  .elastic-card {
    width: 170px;
    height: 280px;
  }

  .elastic-title {
    font-size: 60px;
    letter-spacing: 14px;
  }
}

@media (max-width: 900px) {
  .cards-wrapper {
    flex-wrap: wrap;
    justify-content: center;
    max-width: 400px;
  }

  .elastic-card {
    width: 150px;
    height: 250px;
  }

  .elastic-title {
    font-size: 42px;
    letter-spacing: 10px;
  }
}
</style>
