<template>
  <section ref="containerRef" class="card-time-neon">
    <div ref="bgRef" class="neon-bg">
      <div ref="gridRef" class="bg-grid"></div>
      <div ref="scanLineRef" class="scan-line"></div>
    </div>

    <div ref="contentRef" class="neon-content">
      <div ref="headerRef" class="neon-header">
        <div ref="badgeRef" class="header-badge">
          <span class="badge-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </span>
          <span class="badge-text">Cyber Pulse</span>
        </div>
        <h1 ref="titleRef" class="neon-title">NEON</h1>
        <p ref="subtitleRef" class="neon-subtitle">
          Electric dreams pulse through digital veins
        </p>
      </div>

      <div ref="cardsWrapperRef" class="cards-wrapper">
        <div
          v-for="(card, index) in cards"
          :key="index"
          :ref="el => cardRefs[index] = el as HTMLElement"
          class="neon-card"
          :data-index="index + 1"
        >
          <div class="card-glow"></div>
          <div class="card-inner">
            <div class="card-scan-line"></div>
            <div class="card-header">
              <span class="card-index">{{ String(index + 1).padStart(2, '0') }}</span>
              <span class="card-status">{{ card.status }}</span>
            </div>
            <div class="card-visual">
              <div class="visual-icon">
                <svg v-if="index === 0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
                <svg v-else-if="index === 1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
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
              <div class="visual-pulse"></div>
            </div>
            <h3 class="card-title">{{ card.title }}</h3>
            <p class="card-desc">{{ card.desc }}</p>
            <div class="card-footer">
              <span class="card-tag">{{ card.tag }}</span>
              <div class="card-indicator"></div>
            </div>
          </div>
        </div>
      </div>

      <div ref="footerRef" class="neon-footer">
        <div ref="line1Ref" class="footer-line"></div>
        <span ref="footerTextRef" class="footer-text">System Online</span>
        <div ref="line2Ref" class="footer-line"></div>
      </div>
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
const gridRef = ref<HTMLElement | null>(null)
const scanLineRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const badgeRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const cardsWrapperRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const footerTextRef = ref<HTMLElement | null>(null)
const line1Ref = ref<HTMLElement | null>(null)
const line2Ref = ref<HTMLElement | null>(null)

const cardRefs = ref<(HTMLElement | null)[]>([])

const cards = [
  { title: 'Cyber', desc: 'Digital consciousness awakens in the neon glow', tag: 'Active', status: 'Online' },
  { title: 'Pulse', desc: 'Rhythmic energy flows through fiber optic veins', tag: 'Live', status: 'Active' },
  { title: 'Nova', desc: 'Stellar explosions of color and light converge', tag: 'Hot', status: 'Online' },
  { title: 'Matrix', desc: 'Interconnected nodes pulse in perfect harmony', tag: 'Secure', status: 'Active' },
  { title: 'Flux', desc: 'Constant change drives the digital evolution', tag: 'Dynamic', status: 'Online' }
]

const cleanupFns: TweenCleanup[] = []

onMounted(() => {
  const allCards = cardRefs.value.filter(Boolean) as HTMLElement[]
  const cardGlows = allCards.map(card => card.querySelector('.card-glow') as HTMLElement)

  const tl = gsap.timeline({
    defaults: { duration: 0.6, ease: 'power2.out' },
    paused: true
  })

  gsap.set([badgeRef.value, titleRef.value, subtitleRef.value], {
    opacity: 0,
    y: -30
  })

  gsap.set(allCards, {
    opacity: 0,
    y: 50,
    borderColor: 'rgba(255, 45, 149, 0.1)',
    boxShadow: '0 0 0 rgba(255, 45, 149, 0)',
    backgroundColor: 'rgba(15, 10, 25, 0.6)'
  })

  gsap.set(cardGlows, {
    opacity: 0,
    scale: 0.5
  })

  gsap.set([line1Ref.value, line2Ref.value], {
    scaleX: 0,
    transformOrigin: 'center'
  })

  tl.to([badgeRef.value, titleRef.value, subtitleRef.value], {
    opacity: 1,
    y: 0,
    duration: 0.5,
    stagger: 0.1
  })

  tl.to(allCards, {
    opacity: 1,
    y: 0,
    stagger: 0.1,
    duration: 0.5
  })

  tl.to(allCards, {
    borderColor: '#ff2d95',
    boxShadow: '0 0 20px #ff2d95, 0 0 60px rgba(255, 45, 149, 0.25)',
    backgroundColor: 'rgba(26, 0, 32, 0.95)',
    stagger: 0.1,
    duration: 0.5
  })

  tl.to(cardGlows, {
    opacity: 1,
    scale: 1,
    stagger: 0.08,
    duration: 0.4
  }, '-=0.3')

  tl.to(allCards, {
    boxShadow: '0 0 60px #ff2d95, 0 0 120px rgba(255, 45, 149, 0.4)',
    stagger: 0.08,
    duration: 0.3,
    ease: 'power2.out'
  }, '-=0.2')

  tl.to(allCards, {
    boxShadow: '0 0 15px rgba(255, 45, 149, 0.67)',
    borderColor: 'rgba(255, 45, 149, 0.47)',
    stagger: 0.05,
    duration: 0.5
  }, '-=0.1')

  tl.from('.neon-card .card-index', {
    opacity: 0,
    x: -10,
    stagger: 0.06,
    duration: 0.4
  }, '-=0.4')

  tl.from('.neon-card .card-title', {
    opacity: 0,
    y: 15,
    stagger: 0.06,
    duration: 0.4
  }, '-=0.3')

  tl.from('.neon-card .card-desc', {
    opacity: 0,
    y: 10,
    stagger: 0.06,
    duration: 0.4
  }, '-=0.3')

  tl.to([line1Ref.value, line2Ref.value], {
    scaleX: 1,
    stagger: 0.1,
    duration: 0.5,
    ease: 'power2.out'
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
    y: 45,
    scale: 0.85,
    opacity: 0.6,
    filter: 'brightness(0.7)'
  })

  scrollTl.to(allCards[1], {
    x: -35,
    y: 22,
    scale: 0.92,
    opacity: 0.8,
    filter: 'brightness(0.85)'
  }, '-=0.4')

  scrollTl.to(allCards[2], {
    scale: 1.18,
    y: -35,
    zIndex: 10,
    boxShadow: '0 0 80px #ff2d95, 0 0 150px rgba(255, 45, 149, 0.5)',
    filter: 'brightness(1.3)'
  }, '-=0.4')

  scrollTl.to(allCards[3], {
    x: 35,
    y: 22,
    scale: 0.92,
    opacity: 0.8,
    filter: 'brightness(0.85)'
  }, '-=0.5')

  scrollTl.to(allCards[4], {
    x: 70,
    y: 45,
    scale: 0.85,
    opacity: 0.6,
    filter: 'brightness(0.7)'
  }, '-=0.5')

  allCards.forEach((card, i) => {
    gsap.to(card, {
      boxShadow: '0 0 25px rgba(255, 45, 149, 0.8)',
      borderColor: 'rgba(255, 45, 149, 0.67)',
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: i * 0.2
    })
  })

  gsap.to('.card-glow', {
    scale: 1.3,
    opacity: 0.8,
    duration: 1.5,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    stagger: { each: 0.3, from: 'random' }
  })

  gsap.to('.visual-pulse', {
    scale: 1.5,
    opacity: 0,
    duration: 1.2,
    repeat: -1,
    ease: 'power2.out'
  })

  gsap.to(scanLineRef.value, {
    y: '200%',
    duration: 3,
    repeat: -1,
    ease: 'none'
  })

  gsap.to(gridRef.value, {
    backgroundPosition: '50px 50px',
    duration: 0.5,
    repeat: -1,
    yoyo: true,
    ease: 'none'
  })

  cleanupFns.push(
    () => {
      tl.kill()
      scrollTl.kill()
      allCards.forEach(card => gsap.killTweensOf(card))
    }
  )
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style lang="scss" scoped>
.card-time-neon {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #0a0612 0%, #150a20 50%, #0a0612 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

.neon-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 45, 149, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 45, 149, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
}

.scan-line {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255, 45, 149, 0.3), transparent);
  filter: blur(1px);
}

.neon-content {
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

.neon-header {
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
  font-family: 'Orbitron', 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 45, 149, 0.9);
  letter-spacing: 3px;
  text-transform: uppercase;
  padding: 10px 24px;
  border: 1px solid rgba(255, 45, 149, 0.4);
  border-radius: 4px;
  background: rgba(255, 45, 149, 0.05);
  box-shadow: 0 0 15px rgba(255, 45, 149, 0.2);

  .badge-icon {
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 14px;
      height: 14px;
      color: #ff2d95;
    }
  }
}

.neon-title {
  font-family: 'Orbitron', 'Inter', sans-serif;
  font-size: 80px;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: 20px;
  text-transform: uppercase;
  margin: 0;
  text-shadow:
    0 0 10px rgba(255, 45, 149, 0.8),
    0 0 30px rgba(255, 45, 149, 0.5),
    0 0 60px rgba(255, 45, 149, 0.3);
}

.neon-subtitle {
  font-family: 'Orbitron', 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: rgba(255, 45, 149, 0.6);
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

.neon-card {
  width: 200px;
  height: 320px;
  position: relative;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  z-index: 1;
  border: 1px solid rgba(255, 45, 149, 0.2);
  border-radius: 8px;
  background: rgba(15, 10, 25, 0.7);

  &:nth-child(3) {
    z-index: 5;
  }

  &:hover {
    .card-glow {
      opacity: 1 !important;
      transform: scale(1.4);
    }

    .visual-icon {
      transform: scale(1.1);
      filter: drop-shadow(0 0 15px rgba(255, 45, 149, 0.8));
    }
  }
}

.card-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 160px;
  height: 160px;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(255, 45, 149, 0.4), transparent 70%);
  filter: blur(40px);
  pointer-events: none;
  z-index: 0;
}

.card-inner {
  width: 100%;
  height: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 0 15px rgba(255, 45, 149, 0.3);
  transition: all 0.4s ease;

  &:hover {
    box-shadow: 0 0 40px rgba(255, 45, 149, 0.5);
  }
}

.card-scan-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255, 45, 149, 0.5), transparent);
  opacity: 0.5;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.card-index {
  font-family: 'Orbitron', monospace;
  font-size: 12px;
  font-weight: 700;
  color: rgba(255, 45, 149, 0.6);
  letter-spacing: 2px;
}

.card-status {
  font-family: 'Orbitron', sans-serif;
  font-size: 9px;
  font-weight: 600;
  color: #00ff88;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding: 3px 8px;
  background: rgba(0, 255, 136, 0.1);
  border: 1px solid rgba(0, 255, 136, 0.3);
  border-radius: 3px;
}

.card-visual {
  position: relative;
  width: 70px;
  height: 70px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.visual-icon {
  position: relative;
  z-index: 1;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 45, 149, 0.1);
  border: 1px solid rgba(255, 45, 149, 0.3);
  border-radius: 8px;
  transition: all 0.4s ease;

  svg {
    width: 30px;
    height: 30px;
    color: #ff2d95;
  }
}

.visual-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50px;
  height: 50px;
  transform: translate(-50%, -50%);
  border: 1px solid rgba(255, 45, 149, 0.5);
  border-radius: 50%;
  opacity: 0;
}

.card-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 10px 0;
  letter-spacing: 2px;
  text-align: center;
}

.card-desc {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.6;
  margin: 0;
  flex-grow: 1;
  text-align: center;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 45, 149, 0.15);
}

.card-tag {
  font-family: 'Orbitron', sans-serif;
  font-size: 9px;
  font-weight: 600;
  color: #ff2d95;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.card-indicator {
  width: 8px;
  height: 8px;
  background: #00ff88;
  border-radius: 50%;
  box-shadow: 0 0 10px #00ff88;
  animation: indicatorPulse 1.5s ease-in-out infinite;
}

@keyframes indicatorPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}

.neon-footer {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-top: 10px;
}

.footer-line {
  width: 80px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 45, 149, 0.5), transparent);
  box-shadow: 0 0 10px rgba(255, 45, 149, 0.3);
}

.footer-text {
  font-family: 'Orbitron', sans-serif;
  font-size: 10px;
  font-weight: 500;
  color: rgba(255, 45, 149, 0.7);
  letter-spacing: 4px;
  text-transform: uppercase;
}

@media (max-width: 1200px) {
  .cards-wrapper {
    gap: 18px;
  }

  .neon-card {
    width: 170px;
    height: 280px;
  }

  .neon-title {
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

  .neon-card {
    width: 150px;
    height: 250px;
  }

  .neon-title {
    font-size: 42px;
    letter-spacing: 10px;
  }
}
</style>
