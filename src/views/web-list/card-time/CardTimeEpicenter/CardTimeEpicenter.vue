<template>
  <section class="card-time-epicenter">
    <div ref="containerRef" class="epicenter-container">
      <div class="epicenter-bg">
        <div ref="ring1Ref" class="bg-ring ring-1"></div>
        <div ref="ring2Ref" class="bg-ring ring-2"></div>
        <div ref="ring3Ref" class="bg-ring ring-3"></div>
      </div>

      <div ref="headerRef" class="epicenter-header">
        <div ref="titleRef" class="epicenter-title">EPICENTER</div>
        <div ref="subtitleRef" class="epicenter-subtitle">
          <span>From the Center of Innovation</span>
        </div>
      </div>

      <div ref="cardsWrapperRef" class="cards-wrapper">
        <div ref="card1Ref" class="card-item" data-index="1">
          <div class="card-inner">
            <div class="card-glow"></div>
            <div class="card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div class="card-title">Foundation</div>
            <div class="card-desc">Building the core infrastructure for tomorrow's digital ecosystem</div>
            <div class="card-meta">
              <span class="meta-year">2024</span>
              <span class="meta-status">Phase 1</span>
            </div>
          </div>
        </div>

        <div ref="card2Ref" class="card-item" data-index="2">
          <div class="card-inner">
            <div class="card-glow"></div>
            <div class="card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
              </svg>
            </div>
            <div class="card-title">Evolution</div>
            <div class="card-desc">Continuous refinement through feedback and innovation cycles</div>
            <div class="card-meta">
              <span class="meta-year">2025</span>
              <span class="meta-status">Phase 2</span>
            </div>
          </div>
        </div>

        <div ref="card3Ref" class="card-item featured" data-index="3">
          <div class="card-inner">
            <div class="card-glow center"></div>
            <div class="card-icon large">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>
            <div class="card-title">Nexus</div>
            <div class="card-desc">The convergence point where ideas transform into impact</div>
            <div class="card-meta">
              <span class="meta-year">2026</span>
              <span class="meta-status current">Now</span>
            </div>
          </div>
        </div>

        <div ref="card4Ref" class="card-item" data-index="4">
          <div class="card-inner">
            <div class="card-glow"></div>
            <div class="card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M18 20V10M12 20V4M6 20v-6"/>
              </svg>
            </div>
            <div class="card-title">Metrics</div>
            <div class="card-desc">Data-driven decisions powered by real-time analytics</div>
            <div class="card-meta">
              <span class="meta-year">2027</span>
              <span class="meta-status">Phase 4</span>
            </div>
          </div>
        </div>

        <div ref="card5Ref" class="card-item" data-index="5">
          <div class="card-inner">
            <div class="card-glow"></div>
            <div class="card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div class="card-title">Security</div>
            <div class="card-desc">Enterprise-grade protection for your most valuable assets</div>
            <div class="card-meta">
              <span class="meta-year">2028</span>
              <span class="meta-status">Phase 5</span>
            </div>
          </div>
        </div>
      </div>

      <div ref="footerRef" class="epicenter-footer">
        <div class="footer-line"></div>
        <span class="footer-text">Impact radiates from the center</span>
        <div class="footer-line"></div>
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
const headerRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const cardsWrapperRef = ref<HTMLElement | null>(null)
const card1Ref = ref<HTMLElement | null>(null)
const card2Ref = ref<HTMLElement | null>(null)
const card3Ref = ref<HTMLElement | null>(null)
const card4Ref = ref<HTMLElement | null>(null)
const card5Ref = ref<HTMLElement | null>(null)
const ring1Ref = ref<HTMLElement | null>(null)
const ring2Ref = ref<HTMLElement | null>(null)
const ring3Ref = ref<HTMLElement | null>(null)
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

  const rings = [ring1Ref.value, ring2Ref.value, ring3Ref.value].filter(Boolean) as HTMLElement[]

  const tl = gsap.timeline({
    defaults: { duration: 0.6, ease: 'power2.out' },
    paused: true
  })

  gsap.set(cards, { opacity: 0, scale: 0.6, y: 30 })
  gsap.set(rings, { opacity: 0, scale: 0.5 })
  gsap.set([titleRef.value, subtitleRef.value], { opacity: 0, y: -40 })
  gsap.set(footerRef.value, { opacity: 0 })

  tl.to(rings, {
    opacity: 1,
    scale: 1,
    duration: 1.2,
    stagger: 0.2,
    ease: 'power3.out'
  })

  tl.to([titleRef.value, subtitleRef.value], {
    opacity: 1,
    y: 0,
    duration: 0.5,
    stagger: 0.1
  }, '-=0.8')

  tl.to(card3Ref.value, {
    opacity: 1,
    scale: 1,
    y: 0,
    duration: 0.7,
    ease: 'back.out(1.4)'
  })

  tl.to([card2Ref.value, card4Ref.value], {
    opacity: 1,
    scale: 1,
    y: 0
  }, '-=0.35')

  tl.to([card1Ref.value, card5Ref.value], {
    opacity: 1,
    scale: 1,
    y: 0
  }, '-=0.3')

  tl.to(cards, {
    y: -6,
    duration: 1.5,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    stagger: { each: 0.1, from: 'center' }
  }, '+=0.2')

  tl.to(footerRef.value, {
    opacity: 1,
    duration: 0.4
  }, '-=1')

  tl.play()

  const scrollTl = gsap.timeline({
    scrollTrigger: {
      trigger: containerRef.value,
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1.5
    }
  })

  scrollTl.to(card1Ref.value, {
    x: -60,
    y: 40,
    rotation: -8,
    opacity: 0.6,
    scale: 0.85,
    duration: 0.5
  })

  scrollTl.to(card2Ref.value, {
    x: -30,
    y: 20,
    rotation: -4,
    opacity: 0.8,
    scale: 0.92,
    duration: 0.5
  }, '-=0.45')

  scrollTl.to(card3Ref.value, {
    scale: 1.15,
    y: -30,
    boxShadow: '0 30px 60px rgba(0, 245, 212, 0.3)',
    duration: 0.5
  }, '-=0.45')

  scrollTl.to(card4Ref.value, {
    x: 30,
    y: 20,
    rotation: 4,
    opacity: 0.8,
    scale: 0.92,
    duration: 0.5
  }, '-=0.5')

  scrollTl.to(card5Ref.value, {
    x: 60,
    y: 40,
    rotation: 8,
    opacity: 0.6,
    scale: 0.85,
    duration: 0.5
  }, '-=0.5')

  const headerStCleanup = ScrollTrigger.create({
    trigger: headerRef.value,
    start: 'top 85%',
    onEnter: () => {
      gsap.to([titleRef.value, subtitleRef.value], {
        filter: 'blur(6px)',
        opacity: 0.3,
        scale: 0.95,
        duration: 0.6,
        ease: 'power2.in'
      })
    },
    onLeaveBack: () => {
      gsap.to([titleRef.value, subtitleRef.value], {
        filter: 'blur(0px)',
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: 'power2.out'
      })
    }
  })

  const ringAnim = gsap.timeline({ repeat: -1, ease: 'none' })
  ringAnim
    .to(ring1Ref.value, { scale: 1.1, opacity: 0.3, duration: 3, ease: 'sine.inOut' })
    .to(ring1Ref.value, { scale: 1, opacity: 0.6, duration: 3, ease: 'sine.inOut' }, '-=3')
    .to(ring2Ref.value, { scale: 1.15, opacity: 0.25, duration: 4, ease: 'sine.inOut' }, '<')
    .to(ring2Ref.value, { scale: 1, opacity: 0.5, duration: 4, ease: 'sine.inOut' }, '-=4')
    .to(ring3Ref.value, { scale: 1.2, opacity: 0.2, duration: 5, ease: 'sine.inOut' }, '<')
    .to(ring3Ref.value, { scale: 1, opacity: 0.4, duration: 5, ease: 'sine.inOut' }, '-=5')

  const continuousFloat = gsap.timeline({ paused: true })
  continuousFloat.to(cards, {
    y: 'random(-12, -4)',
    x: 'random(-8, 8)',
    rotation: 'random(-3, 3)',
    duration: 2.5,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true,
    stagger: { each: 0.2, from: 'center' }
  })

  ScrollTrigger.create({
    trigger: containerRef.value,
    start: 'top 80%',
    onEnter: () => {
      continuousFloat.play()
    },
    onLeave: () => {
      continuousFloat.pause()
    },
    onEnterBack: () => {
      continuousFloat.play()
    },
    onLeaveBack: () => {
      continuousFloat.pause()
    }
  })

  cleanupFns.push(
    () => {
      tl.kill()
      scrollTl.kill()
      ringAnim.kill()
      continuousFloat.kill()
      headerStCleanup.kill()
    }
  )
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style lang="scss" scoped>
.card-time-epicenter {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(180deg, #0a0a0f 0%, #12121a 50%, #0a0a0f 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

.epicenter-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.epicenter-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.bg-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  border: 1px solid rgba(0, 245, 212, 0.3);
  background: radial-gradient(circle, rgba(0, 245, 212, 0.05) 0%, transparent 70%);

  &.ring-1 {
    width: 400px;
    height: 400px;
  }

  &.ring-2 {
    width: 700px;
    height: 700px;
    border-color: rgba(0, 245, 212, 0.2);
  }

  &.ring-3 {
    width: 1000px;
    height: 1000px;
    border-color: rgba(0, 245, 212, 0.1);
  }
}

.epicenter-header {
  text-align: center;
  margin-bottom: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.epicenter-title {
  font-family: 'Bebas Neue', 'Impact', sans-serif;
  font-size: 72px;
  font-weight: 400;
  color: #00f5d4;
  letter-spacing: 20px;
  text-transform: uppercase;
  text-shadow:
    0 0 40px rgba(0, 245, 212, 0.5),
    0 0 80px rgba(0, 245, 212, 0.3);
  line-height: 1;
}

.epicenter-subtitle {
  font-family: 'Space Grotesk', 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 8px;
  text-transform: uppercase;
  padding: 12px 32px;
  border: 1px solid rgba(0, 245, 212, 0.3);
  border-radius: 40px;
  background: rgba(0, 245, 212, 0.05);
}

.cards-wrapper {
  display: flex;
  gap: 28px;
  perspective: 1400px;
  transform-style: preserve-3d;
}

.card-item {
  width: 220px;
  height: 340px;
  position: relative;
  transform-style: preserve-3d;
  backface-visibility: hidden;

  &.featured {
    .card-inner {
      border-color: rgba(0, 245, 212, 0.6);
      box-shadow:
        0 0 40px rgba(0, 245, 212, 0.2),
        inset 0 0 30px rgba(0, 245, 212, 0.05);

      .card-glow {
        &.center {
          background: radial-gradient(ellipse at center, rgba(0, 245, 212, 0.4) 0%, transparent 70%);
        }
      }
    }
  }
}

.card-inner {
  width: 100%;
  height: 100%;
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02));
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(0, 245, 212, 0.5), transparent);
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  &:hover {
    transform: translateY(-16px) scale(1.02);
    border-color: rgba(0, 245, 212, 0.4);
    box-shadow:
      0 25px 50px rgba(0, 245, 212, 0.15),
      inset 0 0 20px rgba(0, 245, 212, 0.05);

    &::before {
      opacity: 1;
    }

    .card-icon {
      color: #00f5d4;
      transform: scale(1.1) translateY(-4px);
    }

    .card-glow {
      opacity: 0.8;
    }
  }
}

.card-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(ellipse at center top, rgba(0, 245, 212, 0.15) 0%, transparent 50%);
  opacity: 0.3;
  pointer-events: none;
  transition: opacity 0.4s ease;
}

.card-icon {
  width: 56px;
  height: 56px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 20px;
  transition: all 0.4s ease;

  &.large {
    width: 72px;
    height: 72px;
    color: #00f5d4;
  }

  svg {
    width: 100%;
    height: 100%;
  }
}

.card-title {
  font-family: 'Space Grotesk', 'Inter', sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 12px;
  letter-spacing: 1px;
}

.card-desc {
  font-family: 'Space Grotesk', 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.7;
  margin-bottom: 20px;
  flex-grow: 1;
}

.card-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  .meta-year {
    font-family: 'Space Mono', monospace;
    font-size: 12px;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.7);
  }

  .meta-status {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 10px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.5);
    padding: 4px 10px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.05);
    text-transform: uppercase;
    letter-spacing: 0.5px;

    &.current {
      color: #00f5d4;
      background: rgba(0, 245, 212, 0.15);
      box-shadow: 0 0 12px rgba(0, 245, 212, 0.2);
    }
  }
}

.epicenter-footer {
  margin-top: 60px;
  display: flex;
  align-items: center;
  gap: 24px;

  .footer-line {
    width: 80px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0, 245, 212, 0.5), transparent);
  }

  .footer-text {
    font-family: 'Space Grotesk', 'Inter', sans-serif;
    font-size: 12px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.4);
    letter-spacing: 4px;
    text-transform: uppercase;
  }
}

@media (max-width: 1300px) {
  .cards-wrapper {
    gap: 20px;
  }

  .card-item {
    width: 180px;
    height: 300px;
  }
}

@media (max-width: 1000px) {
  .cards-wrapper {
    flex-wrap: wrap;
    justify-content: center;
    max-width: 500px;
  }

  .card-item {
    width: 160px;
    height: 260px;
  }

  .epicenter-title {
    font-size: 48px;
    letter-spacing: 12px;
  }
}
</style>
