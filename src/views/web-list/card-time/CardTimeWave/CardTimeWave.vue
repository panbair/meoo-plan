<template>
  <section class="card-time-wave">
    <div ref="containerRef" class="wave-container">
      <div ref="waveBgRef" class="wave-background">
        <svg class="wave-svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path ref="wavePath1Ref" class="wave-path wave-1" d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,149.3C672,149,768,203,864,208C960,213,1056,171,1152,149.3C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"/>
          <path ref="wavePath2Ref" class="wave-path wave-2" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,234.7C672,267,768,309,864,298.7C960,288,1056,224,1152,197.3C1248,171,1344,181,1392,186.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"/>
        </svg>
      </div>

      <div ref="headerRef" class="wave-header">
        <div ref="badgeRef" class="header-badge">
          <span class="badge-dot"></span>
          New Arrivals
        </div>
        <h1 ref="titleRef" class="wave-title">WAVE</h1>
        <p ref="subtitleRef" class="wave-subtitle">
          Embrace the flow of modern design
        </p>
      </div>

      <div ref="cardsWrapperRef" class="cards-wrapper">
        <div ref="card1Ref" class="card-item" data-index="1">
          <div class="card-inner">
            <div class="card-wave-line"></div>
            <div class="card-image">
              <div class="image-placeholder">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <path d="M21 15l-5-5L5 21"/>
                </svg>
              </div>
            </div>
            <div class="card-body">
              <h3 class="card-title">Flowing</h3>
              <p class="card-text">Dynamic elements that adapt to your rhythm</p>
            </div>
            <div class="card-price">$129</div>
          </div>
        </div>

        <div ref="card2Ref" class="card-item" data-index="2">
          <div class="card-inner">
            <div class="card-wave-line"></div>
            <div class="card-image">
              <div class="image-placeholder">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
            </div>
            <div class="card-body">
              <h3 class="card-title">Adaptive</h3>
              <p class="card-text">Smart systems that learn and evolve</p>
            </div>
            <div class="card-price">$249</div>
          </div>
        </div>

        <div ref="card3Ref" class="card-item featured" data-index="3">
          <div class="card-inner">
            <div class="card-wave-line"></div>
            <div class="card-image">
              <div class="image-placeholder">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              </div>
            </div>
            <div class="card-body">
              <h3 class="card-title">Timeless</h3>
              <p class="card-text">Classic design meets contemporary needs</p>
            </div>
            <div class="card-price featured-price">$399</div>
          </div>
        </div>

        <div ref="card4Ref" class="card-item" data-index="4">
          <div class="card-inner">
            <div class="card-wave-line"></div>
            <div class="card-image">
              <div class="image-placeholder">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
            </div>
            <div class="card-body">
              <h3 class="card-title">Secure</h3>
              <p class="card-text">Your data protected at every layer</p>
            </div>
            <div class="card-price">$199</div>
          </div>
        </div>

        <div ref="card5Ref" class="card-item" data-index="5">
          <div class="card-inner">
            <div class="card-wave-line"></div>
            <div class="card-image">
              <div class="image-placeholder">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
            </div>
            <div class="card-body">
              <h3 class="card-title">Seamless</h3>
              <p class="card-text">Connected experiences without boundaries</p>
            </div>
            <div class="card-price">$159</div>
          </div>
        </div>
      </div>

      <div ref="footerRef" class="wave-footer">
        <div class="footer-pagination">
          <span class="dot active"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
        <span class="footer-text">Scroll to explore</span>
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
const waveBgRef = ref<HTMLElement | null>(null)
const wavePath1Ref = ref<SVGPathElement | null>(null)
const wavePath2Ref = ref<SVGPathElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const badgeRef = ref<HTMLElement | null>(null)
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

  const cardInners = cards.map(card => card?.querySelector('.card-inner') as HTMLElement)
  const waveLines = cards.map(card => card?.querySelector('.card-wave-line') as HTMLElement)

  const tl = gsap.timeline({
    defaults: { duration: 0.65, ease: 'power3.out' },
    paused: true
  })

  gsap.set([badgeRef.value, titleRef.value, subtitleRef.value], {
    opacity: 0,
    y: -30
  })

  gsap.set(cards, {
    y: 100,
    opacity: 0
  })

  gsap.set(waveLines, {
    scaleX: 0,
    transformOrigin: 'left center'
  })

  gsap.set(footerRef.value, { opacity: 0, y: 20 })

  tl.to([badgeRef.value, titleRef.value, subtitleRef.value], {
    opacity: 1,
    y: 0,
    duration: 0.5,
    stagger: 0.1
  })

  tl.to(cards, {
    y: 0,
    opacity: 1,
    stagger: {
      each: 0.1,
      ease: 'circ.out'
    }
  }, '-=0.2')

  tl.to(waveLines, {
    scaleX: 1,
    duration: 0.6,
    stagger: {
      each: 0.08,
      ease: 'power2.inOut'
    }
  }, '-=0.4')

  tl.to(footerRef.value, {
    opacity: 1,
    y: 0,
    duration: 0.4
  }, '-=0.2')

  tl.play()

  if (wavePath1Ref.value && wavePath2Ref.value) {
    gsap.to(wavePath1Ref.value, {
      x: -50,
      duration: 8,
      ease: 'none',
      repeat: -1,
      yoyo: true
    })
    gsap.to(wavePath2Ref.value, {
      x: 50,
      duration: 10,
      ease: 'none',
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
    x: -45,
    y: 25,
    rotation: -5,
    opacity: 0.7,
    scale: 0.9
  })

  scrollTl.to(card2Ref.value, {
    x: -22,
    y: 12,
    rotation: -2.5,
    opacity: 0.85,
    scale: 0.95
  }, '-=0.45')

  scrollTl.to(card3Ref.value, {
    scale: 1.1,
    y: -25,
    boxShadow: '0 30px 60px rgba(0, 0, 0, 0.2)'
  }, '-=0.45')

  scrollTl.to(card4Ref.value, {
    x: 22,
    y: 12,
    rotation: 2.5,
    opacity: 0.85,
    scale: 0.95
  }, '-=0.5')

  scrollTl.to(card5Ref.value, {
    x: 45,
    y: 25,
    rotation: 5,
    opacity: 0.7,
    scale: 0.9
  }, '-=0.5')

  const continuousWave = gsap.timeline({ paused: true })
  continuousWave.to(cards, {
    y: () => gsap.utils.random(-15, -5),
    rotation: () => gsap.utils.random(-3, 3),
    duration: 2.5,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true,
    stagger: {
      each: 0.2,
      ease: 'circ.out'
    }
  })

  ScrollTrigger.create({
    trigger: containerRef.value,
    start: 'top 80%',
    onEnter: () => continuousWave.play(),
    onLeave: () => continuousWave.pause(),
    onEnterBack: () => continuousWave.play(),
    onLeaveBack: () => continuousWave.pause()
  })

  cleanupFns.push(
    () => {
      tl.kill()
      scrollTl.kill()
      continuousWave.kill()
    }
  )
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style lang="scss" scoped>
.card-time-wave {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(180deg, #e0f7fa 0%, #80deea 50%, #4dd0e1 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

.wave-container {
  width: 100%;
  max-width: 1400px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 45px;
  position: relative;
  z-index: 1;
}

.wave-background {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 200px;
  overflow: hidden;
  pointer-events: none;
}

.wave-svg {
  position: absolute;
  bottom: 0;
  width: 200%;
  height: 100%;
}

.wave-path {
  fill: rgba(255, 255, 255, 0.3);

  &.wave-1 {
    opacity: 0.6;
  }

  &.wave-2 {
    opacity: 0.4;
    fill: rgba(255, 255, 255, 0.2);
  }
}

.wave-header {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.header-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: 'Nunito Sans', 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 700;
  color: #00838f;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding: 8px 20px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 24px;
  box-shadow: 0 4px 15px rgba(0, 131, 143, 0.15);

  .badge-dot {
    width: 8px;
    height: 8px;
    background: #00acc1;
    border-radius: 50%;
    animation: badgePulse 1.5s infinite;
  }
}

@keyframes badgePulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.3); opacity: 0.6; }
}

.wave-title {
  font-family: 'Nunito Sans', 'Inter', sans-serif;
  font-size: 68px;
  font-weight: 800;
  color: #006064;
  letter-spacing: 16px;
  margin: 0;
  text-transform: uppercase;
}

.wave-subtitle {
  font-family: 'Nunito Sans', 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #00838f;
  letter-spacing: 3px;
  margin: 0;
}

.cards-wrapper {
  display: flex;
  gap: 24px;
  perspective: 1200px;
  transform-style: preserve-3d;
}

.card-item {
  width: 200px;
  height: 300px;
  position: relative;
  z-index: 1;

  &.featured {
    z-index: 5;

    .card-inner {
      background: linear-gradient(160deg, #ffffff, #e0f7fa);
      border-color: #00acc1;
      box-shadow: 0 20px 50px rgba(0, 131, 143, 0.25);

      .card-wave-line {
        background: linear-gradient(90deg, #00acc1, #26c6da);
      }

      .card-price {
        color: #00838f;
      }
    }
  }
}

.card-inner {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 105, 108, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-14px);
    box-shadow: 0 25px 50px rgba(0, 105, 108, 0.15);

    .card-wave-line {
      transform: scaleX(1.1);
    }

    .card-title {
      color: #00838f;
    }
  }
}

.card-wave-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #4dd0e1, #80deea);
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 0.4s ease;
}

.card-image {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.image-placeholder {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #e0f7fa, #b2ebf2);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00838f;

  svg {
    width: 40px;
    height: 40px;
  }
}

.card-body {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.card-title {
  font-family: 'Nunito Sans', 'Inter', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #006064;
  margin: 0;
  transition: color 0.3s ease;
}

.card-text {
  font-family: 'Nunito Sans', 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 400;
  color: #607d8b;
  line-height: 1.5;
  margin: 0;
}

.card-price {
  font-family: 'Nunito Sans', 'Inter', sans-serif;
  font-size: 22px;
  font-weight: 800;
  color: #00838f;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid rgba(0, 131, 143, 0.1);

  &.featured-price {
    color: #006064;
  }
}

.wave-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-top: auto;
  padding-bottom: 20px;
}

.footer-pagination {
  display: flex;
  gap: 8px;

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: rgba(0, 131, 143, 0.3);
    transition: all 0.3s ease;

    &.active {
      width: 30px;
      border-radius: 5px;
      background: #00838f;
    }
  }
}

.footer-text {
  font-family: 'Nunito Sans', 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: rgba(0, 96, 100, 0.6);
  letter-spacing: 2px;
  text-transform: uppercase;
}

@media (max-width: 1200px) {
  .cards-wrapper {
    gap: 18px;
  }

  .card-item {
    width: 170px;
    height: 270px;
  }
}

@media (max-width: 900px) {
  .cards-wrapper {
    flex-wrap: wrap;
    justify-content: center;
    max-width: 400px;
  }

  .card-item {
    width: 150px;
    height: 240px;
  }

  .wave-title {
    font-size: 42px;
    letter-spacing: 8px;
  }
}
</style>
