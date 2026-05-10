<template>
  <section class="card-time-luminous">
    <div ref="containerRef" class="luminous-container">
      <div ref="ambientRef" class="ambient-glow">
        <div class="glow-orb orb-1"></div>
        <div class="glow-orb orb-2"></div>
        <div class="glow-orb orb-3"></div>
      </div>

      <div ref="headerRef" class="luminous-header">
        <div ref="eyebrowRef" class="header-eyebrow">
          <span class="eyebrow-line"></span>
          <span>Serene Collection</span>
          <span class="eyebrow-line"></span>
        </div>
        <h1 ref="titleRef" class="luminous-title">LUMINOUS</h1>
        <p ref="subtitleRef" class="luminous-subtitle">
          Where elegance meets tranquility
        </p>
      </div>

      <div ref="cardsWrapperRef" class="cards-wrapper">
        <div ref="card1Ref" class="card-item" data-index="1">
          <div class="card-glow"></div>
          <div class="card-icon-wrap">
            <div class="icon-circle">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
          </div>
          <div class="card-content">
            <h3 class="card-title">Serenity</h3>
            <p class="card-desc">Find peace in every moment with our thoughtfully designed spaces</p>
          </div>
          <div class="card-footer">
            <span class="card-tag">Wellness</span>
          </div>
        </div>

        <div ref="card2Ref" class="card-item" data-index="2">
          <div class="card-glow"></div>
          <div class="card-icon-wrap">
            <div class="icon-circle">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4M12 8h.01"/>
              </svg>
            </div>
          </div>
          <div class="card-content">
            <h3 class="card-title">Clarity</h3>
            <p class="card-desc">Crystal clear thinking emerges from simplified environments</p>
          </div>
          <div class="card-footer">
            <span class="card-tag">Focus</span>
          </div>
        </div>

        <div ref="card3Ref" class="card-item featured" data-index="3">
          <div class="card-glow"></div>
          <div class="card-icon-wrap">
            <div class="icon-circle large">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>
          </div>
          <div class="card-content">
            <h3 class="card-title">Harmony</h3>
            <p class="card-desc">The perfect balance between form and function, beauty and purpose</p>
          </div>
          <div class="card-footer">
            <span class="card-tag highlight">Featured</span>
          </div>
        </div>

        <div ref="card4Ref" class="card-item" data-index="4">
          <div class="card-glow"></div>
          <div class="card-icon-wrap">
            <div class="icon-circle">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/>
              </svg>
            </div>
          </div>
          <div class="card-content">
            <h3 class="card-title">Twilight</h3>
            <p class="card-desc">Embrace the gentle transition between day and night</p>
          </div>
          <div class="card-footer">
            <span class="card-tag">Atmosphere</span>
          </div>
        </div>

        <div ref="card5Ref" class="card-item" data-index="5">
          <div class="card-glow"></div>
          <div class="card-icon-wrap">
            <div class="icon-circle">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
          </div>
          <div class="card-content">
            <h3 class="card-title">Journey</h3>
            <p class="card-desc">Every step forward is a discovery of new possibilities</p>
          </div>
          <div class="card-footer">
            <span class="card-tag">Progress</span>
          </div>
        </div>
      </div>

      <div ref="footerRef" class="luminous-footer">
        <p class="footer-quote">"Simplicity is the ultimate sophistication"</p>
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
const ambientRef = ref<HTMLElement | null>(null)
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
    defaults: { duration: 0.8, ease: 'sine.out' },
    paused: true
  })

  gsap.set([eyebrowRef.value, titleRef.value, subtitleRef.value], {
    opacity: 0,
    y: -20
  })

  gsap.set(cards, {
    opacity: 0,
    scale: 0.75,
    boxShadow: '0 0 0 rgba(0,0,0,0)'
  })

  gsap.set(footerRef.value, { opacity: 0, y: 20 })

  tl.to([eyebrowRef.value, titleRef.value, subtitleRef.value], {
    opacity: 1,
    y: 0,
    duration: 0.6,
    stagger: 0.1
  })

  tl.to(cards, {
    opacity: 1,
    scale: 1,
    boxShadow: '0 10px 40px rgba(255, 255, 255, 0.08)',
    stagger: 0.12
  }, '-=0.3')

  tl.to(footerRef.value, {
    opacity: 1,
    y: 0,
    duration: 0.5
  }, '-=0.3')

  tl.play()

  const orbs = ambientRef.value?.querySelectorAll('.glow-orb') as NodeListOf<HTMLElement>
  if (orbs) {
    const orbAnim = gsap.to(orbs, {
      scale: () => gsap.utils.random(1, 1.3),
      opacity: () => gsap.utils.random(0.3, 0.6),
      duration: () => gsap.utils.random(3, 5),
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      stagger: { each: 1, from: 'random' }
    })
    cleanupFns.push(() => orbAnim.kill())
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
    x: -40,
    y: 20,
    opacity: 0.7,
    scale: 0.9,
    filter: 'brightness(0.8)'
  })

  scrollTl.to(card2Ref.value, {
    x: -20,
    y: 10,
    opacity: 0.85,
    scale: 0.95,
    filter: 'brightness(0.9)'
  }, '-=0.45')

  scrollTl.to(card3Ref.value, {
    scale: 1.08,
    y: -20,
    boxShadow: '0 20px 60px rgba(255, 255, 255, 0.15)',
    filter: 'brightness(1.1) saturate(1.1)'
  }, '-=0.45')

  scrollTl.to(card4Ref.value, {
    x: 20,
    y: 10,
    opacity: 0.85,
    scale: 0.95,
    filter: 'brightness(0.9)'
  }, '-=0.5')

  scrollTl.to(card5Ref.value, {
    x: 40,
    y: 20,
    opacity: 0.7,
    scale: 0.9,
    filter: 'brightness(0.8)'
  }, '-=0.5')

  const continuousFloat = gsap.timeline({ paused: true })
  continuousFloat.to(cards, {
    y: () => gsap.utils.random(-8, -3),
    duration: 3,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true,
    stagger: { each: 0.4, from: 'center' }
  })

  ScrollTrigger.create({
    trigger: containerRef.value,
    start: 'top 80%',
    onEnter: () => continuousFloat.play(),
    onLeave: () => continuousFloat.pause(),
    onEnterBack: () => continuousFloat.play(),
    onLeaveBack: () => continuousFloat.pause()
  })

  cleanupFns.push(
    () => {
      tl.kill()
      scrollTl.kill()
      continuousFloat.kill()
    }
  )
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style lang="scss" scoped>
.card-time-luminous {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(180deg, #f8f6f4 0%, #ffffff 50%, #f0ece8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

.luminous-container {
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

.ambient-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.glow-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);

  &.orb-1 {
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(255, 182, 193, 0.4) 0%, transparent 70%);
    top: -100px;
    left: -100px;
  }

  &.orb-2 {
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(176, 224, 230, 0.35) 0%, transparent 70%);
    bottom: -150px;
    right: -100px;
  }

  &.orb-3 {
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(255, 218, 185, 0.3) 0%, transparent 70%);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

.luminous-header {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.header-eyebrow {
  display: flex;
  align-items: center;
  gap: 16px;
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 12px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.5);
  letter-spacing: 4px;
  text-transform: uppercase;

  .eyebrow-line {
    width: 40px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.2), transparent);
  }
}

.luminous-title {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 72px;
  font-weight: 300;
  color: #2c2c2c;
  letter-spacing: 20px;
  margin: 0;
  font-style: italic;
}

.luminous-subtitle {
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.45);
  letter-spacing: 3px;
  margin: 0;
}

.cards-wrapper {
  display: flex;
  gap: 28px;
  perspective: 1200px;
  transform-style: preserve-3d;
}

.card-item {
  width: 200px;
  height: 300px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 20px;
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  overflow: hidden;
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);

  &.featured {
    border-color: rgba(255, 255, 255, 0.8);
    box-shadow: 0 15px 50px rgba(0, 0, 0, 0.1);

    .card-glow {
      background: radial-gradient(ellipse at center, rgba(255, 182, 193, 0.4) 0%, transparent 70%);
    }

    .icon-circle {
      background: linear-gradient(135deg, #ffb6c1, #bae1ff);
      border-color: rgba(255, 255, 255, 0.9);
    }

    .card-title {
      color: #2c2c2c;
    }
  }

  &:hover {
    transform: translateY(-12px);
    box-shadow:
      0 20px 40px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);

    .card-glow {
      opacity: 0.6;
      transform: scale(1.1);
    }

    .icon-circle {
      transform: scale(1.1);
    }
  }
}

.card-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 150%;
  height: 150%;
  background: radial-gradient(ellipse at center, rgba(176, 224, 230, 0.25) 0%, transparent 60%);
  opacity: 0.3;
  pointer-events: none;
  transition: all 0.5s ease;
}

.card-icon-wrap {
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
}

.icon-circle {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(176, 224, 230, 0.4), rgba(255, 182, 193, 0.3));
  border: 1px solid rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: all 0.4s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  &.large {
    width: 72px;
    height: 72px;
  }

  svg {
    width: 28px;
    height: 28px;
  }
}

.card-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  position: relative;
  z-index: 1;
}

.card-title {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 22px;
  font-weight: 500;
  color: #333;
  margin: 0;
  font-style: italic;
}

.card-desc {
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.5);
  line-height: 1.7;
  margin: 0;
}

.card-footer {
  margin-top: auto;
  padding-top: 16px;
  position: relative;
  z-index: 1;
}

.card-tag {
  font-family: 'Montserrat', sans-serif;
  font-size: 9px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.5);
  padding: 6px 14px;
  border-radius: 20px;
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.06);
  text-transform: uppercase;
  letter-spacing: 1px;

  &.highlight {
    background: linear-gradient(135deg, rgba(255, 182, 193, 0.4), rgba(176, 224, 230, 0.4));
    border-color: rgba(255, 255, 255, 0.6);
    color: #555;
  }
}

.luminous-footer {
  text-align: center;
}

.footer-quote {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 14px;
  font-weight: 400;
  font-style: italic;
  color: rgba(0, 0, 0, 0.35);
  margin: 0;
  letter-spacing: 1px;
}

@media (max-width: 1200px) {
  .cards-wrapper {
    gap: 20px;
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

  .luminous-title {
    font-size: 42px;
    letter-spacing: 10px;
  }
}
</style>
