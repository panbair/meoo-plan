<template>
  <section class="card-time-cube-flip">
    <div ref="containerRef" class="cube-container">
      <div ref="gridBgRef" class="grid-background">
        <div class="grid-line h-line" v-for="i in 12" :key="'h'+i"></div>
        <div class="grid-line v-line" v-for="i in 12" :key="'v'+i"></div>
      </div>

      <div ref="headerRef" class="cube-header">
        <div ref="eyebrowRef" class="header-eyebrow">
          <span class="eyebrow-bar"></span>
          Technology Stack
        </div>
        <h1 ref="titleRef" class="cube-title">CUBE FLIP</h1>
        <p ref="subtitleRef" class="cube-subtitle">
          Next-generation 3D interface components
        </p>
      </div>

      <div ref="cardsWrapperRef" class="cards-wrapper">
        <div ref="card1Ref" class="card-item" data-index="1">
          <div class="card-cube">
            <div class="cube-face cube-front">
              <div class="face-content">
                <div class="tech-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5"/>
                    <path d="M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <span class="tech-label">Frontend</span>
              </div>
            </div>
            <div class="cube-face cube-back">
              <div class="face-content">
                <div class="tech-stat">98%</div>
                <div class="tech-desc">Performance Score</div>
              </div>
            </div>
          </div>
          <div class="card-label">
            <span class="label-num">01</span>
            <span class="label-text">Vue 3 + TypeScript</span>
          </div>
        </div>

        <div ref="card2Ref" class="card-item" data-index="2">
          <div class="card-cube">
            <div class="cube-face cube-front">
              <div class="face-content">
                <div class="tech-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <path d="M3 9h18"/>
                    <path d="M9 21V9"/>
                  </svg>
                </div>
                <span class="tech-label">Backend</span>
              </div>
            </div>
            <div class="cube-face cube-back">
              <div class="face-content">
                <div class="tech-stat">2.4M</div>
                <div class="tech-desc">Requests/sec</div>
              </div>
            </div>
          </div>
          <div class="card-label">
            <span class="label-num">02</span>
            <span class="label-text">Node.js + Go</span>
          </div>
        </div>

        <div ref="card3Ref" class="card-item featured" data-index="3">
          <div class="card-cube">
            <div class="cube-face cube-front">
              <div class="face-content">
                <div class="tech-icon large">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                    <line x1="12" y1="22.08" x2="12" y2="12"/>
                  </svg>
                </div>
                <span class="tech-label">Core</span>
              </div>
            </div>
            <div class="cube-face cube-back">
              <div class="face-content">
                <div class="tech-stat">50ms</div>
                <div class="tech-desc">Avg Response</div>
              </div>
            </div>
          </div>
          <div class="card-label">
            <span class="label-num">03</span>
            <span class="label-text">Kubernetes</span>
          </div>
        </div>

        <div ref="card4Ref" class="card-item" data-index="4">
          <div class="card-cube">
            <div class="cube-face cube-front">
              <div class="face-content">
                <div class="tech-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
                <span class="tech-label">Security</span>
              </div>
            </div>
            <div class="cube-face cube-back">
              <div class="face-content">
                <div class="tech-stat">256</div>
                <div class="tech-desc">Bit Encryption</div>
              </div>
            </div>
          </div>
          <div class="card-label">
            <span class="label-num">04</span>
            <span class="label-text">Zero Trust</span>
          </div>
        </div>

        <div ref="card5Ref" class="card-item" data-index="5">
          <div class="card-cube">
            <div class="cube-face cube-front">
              <div class="face-content">
                <div class="tech-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M18 20V10"/>
                    <path d="M12 20V4"/>
                    <path d="M6 20v-6"/>
                  </svg>
                </div>
                <span class="tech-label">Analytics</span>
              </div>
            </div>
            <div class="cube-face cube-back">
              <div class="face-content">
                <div class="tech-stat">1B+</div>
                <div class="tech-desc">Events/day</div>
              </div>
            </div>
          </div>
          <div class="card-label">
            <span class="label-num">05</span>
            <span class="label-text">Real-time BI</span>
          </div>
        </div>
      </div>

      <div ref="footerRef" class="cube-footer">
        <div class="footer-scanline"></div>
        <span class="footer-text">3D Transform Enabled</span>
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
const gridBgRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const eyebrowRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const cardsWrapperRef = ref<HTMLElement | null>(null)
const card1Ref = ref<HTMLElement | null>(null)
const card2Ref = ref<HTMLElement | null>(null)
const card3Ref = ref<HTMLElement | null>(null)
const card4Ref = ref<HTMLElement | null>(null)
const card5Ref = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)

const cleanupFns: TweenCleanup[] = []

onMounted(() => {
  const cards = [
    card1Ref.value,
    card2Ref.value,
    card3Ref.value,
    card4Ref.value,
    card5Ref.value
  ].filter(Boolean) as HTMLElement[]

  const tl = gsap.timeline({
    defaults: { duration: 0.7, ease: 'power2.out' },
    paused: true
  })

  gsap.set([eyebrowRef.value, titleRef.value, subtitleRef.value], {
    opacity: 0,
    y: -30
  })

  gsap.set(cards, {
    opacity: 0,
    rotateY: 70,
    y: 40,
    scale: 0.85
  })

  gsap.set(footerRef.value, { opacity: 0 })

  tl.to(eyebrowRef.value, {
    opacity: 1,
    y: 0,
    duration: 0.5
  })

  tl.to([titleRef.value, subtitleRef.value], {
    opacity: 1,
    y: 0,
    stagger: 0.1
  }, '-=0.3')

  tl.to(cards, {
    opacity: 1,
    rotateY: 0,
    y: 0,
    scale: 1,
    stagger: 0.15,
    transformOrigin: 'center center'
  }, '-=0.2')

  tl.to(footerRef.value, {
    opacity: 1,
    duration: 0.4
  }, '-=0.3')

  tl.play()

  const gridLines = gridBgRef.value?.querySelectorAll('.grid-line') as NodeListOf<HTMLElement>
  if (gridLines) {
    gsap.to(gridLines, {
      opacity: 0.15,
      duration: 2,
      stagger: {
        each: 0.05,
        from: 'center'
      },
      ease: 'power2.inOut',
      repeat: -1,
      yoyo: true
    })
  }

  const scrollTl = gsap.timeline({
    scrollTrigger: {
      trigger: containerRef.value,
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1.5
    }
  })

  scrollTl.to(card1Ref.value, {
    x: -50,
    rotateY: -15,
    rotateX: 10,
    opacity: 0.6,
    scale: 0.88
  })

  scrollTl.to(card2Ref.value, {
    x: -25,
    rotateY: -8,
    rotateX: 5,
    opacity: 0.8,
    scale: 0.94
  }, '-=0.45')

  scrollTl.to(card3Ref.value, {
    scale: 1.12,
    boxShadow: '0 40px 80px rgba(0, 200, 255, 0.3)',
    borderColor: 'rgba(0, 200, 255, 0.6)'
  }, '-=0.45')

  scrollTl.to(card4Ref.value, {
    x: 25,
    rotateY: 8,
    rotateX: -5,
    opacity: 0.8,
    scale: 0.94
  }, '-=0.5')

  scrollTl.to(card5Ref.value, {
    x: 50,
    rotateY: 15,
    rotateX: -10,
    opacity: 0.6,
    scale: 0.88
  }, '-=0.5')

  const continuousRotate = gsap.timeline({ paused: true })
  continuousRotate.to(cards, {
    rotateY: '+=360',
    duration: 20,
    ease: 'none',
    repeat: -1,
    stagger: {
      each: 4,
      repeat: 1
    }
  })

  ScrollTrigger.create({
    trigger: containerRef.value,
    start: 'top 80%',
    onEnter: () => continuousRotate.play(),
    onLeave: () => continuousRotate.pause(),
    onEnterBack: () => continuousRotate.play(),
    onLeaveBack: () => continuousRotate.pause()
  })

  cards.forEach((card) => {
    const cube = card?.querySelector('.card-cube') as HTMLElement
    if (!cube) return

    card?.addEventListener('mouseenter', () => {
      gsap.to(cube, {
        rotateY: 180,
        duration: 0.6,
        ease: 'power2.inOut'
      })
    })
    card?.addEventListener('mouseleave', () => {
      gsap.to(cube, {
        rotateY: 0,
        duration: 0.6,
        ease: 'power2.inOut'
      })
    })
  })

  cleanupFns.push(
    () => {
      tl.kill()
      scrollTl.kill()
      continuousRotate.kill()
    }
  )
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style lang="scss" scoped>
.card-time-cube-flip {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #0c0c1e 0%, #1a1a3e 50%, #0c0c1e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

.cube-container {
  width: 100%;
  max-width: 1400px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 50px;
  position: relative;
  z-index: 1;
}

.grid-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  perspective: 800px;
  transform-style: preserve-3d;
}

@for $i from 1 through 12 {
  .grid-line.h-line:nth-child(#{$i}) {
    top: (8.33% * $i);
  }
  .grid-line.v-line:nth-child(#{$i + 12}) {
    left: (8.33% * $i);
  }
}

.grid-line {
  position: absolute;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(0, 200, 255, 0.3) 50%,
    transparent
  );
  opacity: 0;

  &.h-line {
    width: 100%;
    height: 1px;
  }

  &.v-line {
    width: 1px;
    height: 100%;
  }
}

.cube-header {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.header-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 11px;
  font-weight: 500;
  color: rgba(0, 200, 255, 0.8);
  letter-spacing: 3px;
  text-transform: uppercase;

  .eyebrow-bar {
    width: 30px;
    height: 2px;
    background: linear-gradient(90deg, #00c8ff, transparent);
  }
}

.cube-title {
  font-family: 'Orbitron', 'Rajdhani', sans-serif;
  font-size: 64px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 12px;
  margin: 0;
  text-shadow:
    0 0 20px rgba(0, 200, 255, 0.5),
    0 0 40px rgba(0, 200, 255, 0.3);
}

.cube-subtitle {
  font-family: 'Rajdhani', 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 4px;
  margin: 0;
}

.cards-wrapper {
  display: flex;
  gap: 28px;
  perspective: 1200px;
  transform-style: preserve-3d;
  overflow: visible;
}

.card-item {
  width: 180px;
  height: 260px;
  position: relative;
  transform-style: preserve-3d;
  cursor: pointer;
  overflow: visible;

  &.featured {
    .card-cube {
      border-color: rgba(0, 200, 255, 0.6);
      box-shadow:
        0 0 30px rgba(0, 200, 255, 0.3),
        inset 0 0 20px rgba(0, 200, 255, 0.1);
    }

    .tech-icon {
      color: #00c8ff;
    }

    .tech-label {
      color: #00c8ff;
    }
  }

  &:hover {
    .card-cube {
      box-shadow: 0 20px 50px rgba(0, 200, 255, 0.2);
    }
  }
}

.card-cube {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s ease;
}

.cube-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border: 1px solid rgba(0, 200, 255, 0.3);
  border-radius: 16px;
  background: linear-gradient(
    145deg,
    rgba(0, 200, 255, 0.08),
    rgba(0, 200, 255, 0.02)
  );
  backdrop-filter: blur(20px);
  box-shadow:
    0 10px 40px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;

  &.cube-back {
    transform: rotateY(180deg);
    background: linear-gradient(
      145deg,
      rgba(0, 200, 255, 0.12),
      rgba(0, 200, 255, 0.04)
    );
  }
}

.face-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 20px;
}

.tech-icon {
  width: 48px;
  height: 48px;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.3s ease;

  &.large {
    width: 64px;
    height: 64px;
  }

  svg {
    width: 100%;
    height: 100%;
  }

  &:hover {
    color: #00c8ff;
    transform: scale(1.1);
  }
}

.tech-label {
  font-family: 'Rajdhani', 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 2px;
  text-transform: uppercase;
  transition: color 0.3s ease;
}

.tech-stat {
  font-family: 'Orbitron', 'Rajdhani', sans-serif;
  font-size: 42px;
  font-weight: 700;
  color: #00c8ff;
  text-shadow: 0 0 20px rgba(0, 200, 255, 0.5);
  line-height: 1;
}

.tech-desc {
  font-family: 'Rajdhani', 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 1px;
  text-transform: uppercase;
}

.card-label {
  position: absolute;
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  white-space: nowrap;

  .label-num {
    font-family: 'Orbitron', monospace;
    font-size: 10px;
    font-weight: 700;
    color: rgba(0, 200, 255, 0.5);
    letter-spacing: 2px;
  }

  .label-text {
    font-family: 'Rajdhani', sans-serif;
    font-size: 11px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.4);
  }
}

.cube-footer {
  display: flex;
  align-items: center;
  gap: 16px;

  .footer-scanline {
    width: 60px;
    height: 2px;
    background: linear-gradient(90deg, transparent, #00c8ff, transparent);
    animation: scan 2s linear infinite;
  }

  .footer-text {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 500;
    color: rgba(0, 200, 255, 0.5);
    letter-spacing: 3px;
    text-transform: uppercase;
  }
}

@keyframes scan {
  0% { transform: translateX(-100%); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateX(100%); opacity: 0; }
}

@media (max-width: 1200px) {
  .cards-wrapper {
    gap: 20px;
  }

  .card-item {
    width: 150px;
    height: 220px;
  }
}

@media (max-width: 900px) {
  .cards-wrapper {
    flex-wrap: wrap;
    justify-content: center;
    max-width: 400px;
  }

  .card-item {
    width: 140px;
    height: 200px;
  }

  .cube-title {
    font-size: 36px;
    letter-spacing: 6px;
  }
}
</style>
