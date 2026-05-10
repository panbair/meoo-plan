<template>
  <section class="card-time-diagonal">
    <div ref="containerRef" class="diagonal-container">
      <div ref="bgPatternRef" class="bg-pattern">
        <div class="pattern-line" v-for="i in 8" :key="i"></div>
      </div>

      <div ref="headerRef" class="diagonal-header">
        <div ref="tagRef" class="header-tag">
          <span class="tag-dot"></span>
          Design Philosophy
        </div>
        <h1 ref="titleRef" class="diagonal-title">DIAGONAL</h1>
        <p ref="subtitleRef" class="diagonal-subtitle">
          Breaking the grid, embracing the unconventional
        </p>
      </div>

      <div ref="cardsWrapperRef" class="cards-wrapper">
        <div ref="card1Ref" class="card-item" data-index="1">
          <div class="card-inner">
            <div class="card-accent"></div>
            <div class="card-index">01</div>
            <h3 class="card-title">Structure</h3>
            <p class="card-desc">Foundational elements that define the visual language</p>
            <div class="card-visual">
              <div class="visual-shape rect"></div>
            </div>
          </div>
        </div>

        <div ref="card2Ref" class="card-item" data-index="2">
          <div class="card-inner">
            <div class="card-accent"></div>
            <div class="card-index">02</div>
            <h3 class="card-title">Balance</h3>
            <p class="card-desc">Harmonious compositions that guide the eye naturally</p>
            <div class="card-visual">
              <div class="visual-shape circle"></div>
            </div>
          </div>
        </div>

        <div ref="card3Ref" class="card-item featured" data-index="3">
          <div class="card-inner">
            <div class="card-accent"></div>
            <div class="card-index">03</div>
            <h3 class="card-title">Perspective</h3>
            <p class="card-desc">Unique viewpoints that transform ordinary into extraordinary</p>
            <div class="card-visual">
              <div class="visual-shape triangle"></div>
            </div>
          </div>
        </div>

        <div ref="card4Ref" class="card-item" data-index="4">
          <div class="card-inner">
            <div class="card-accent"></div>
            <div class="card-index">04</div>
            <h3 class="card-title">Rhythm</h3>
            <p class="card-desc">Visual flow patterns that create dynamic movement</p>
            <div class="card-visual">
              <div class="visual-shape wave"></div>
            </div>
          </div>
        </div>

        <div ref="card5Ref" class="card-item" data-index="5">
          <div class="card-inner">
            <div class="card-accent"></div>
            <div class="card-index">05</div>
            <h3 class="card-title">Contrast</h3>
            <p class="card-desc">Bold interactions between elements and space</p>
            <div class="card-visual">
              <div class="visual-shape gradient"></div>
            </div>
          </div>
        </div>
      </div>

      <div ref="footerRef" class="diagonal-footer">
        <div class="footer-decoration">
          <span class="deco-line"></span>
          <span class="deco-text">Asymmetric by Design</span>
          <span class="deco-line"></span>
        </div>
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
const bgPatternRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const tagRef = ref<HTMLElement | null>(null)
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
    defaults: { duration: 0.65, ease: 'power3.out' },
    paused: true
  })

  gsap.set([tagRef.value, titleRef.value, subtitleRef.value], {
    opacity: 0,
    y: -20
  })
  gsap.set(cards, {
    opacity: 0,
    x: 50,
    y: -100,
    rotate: 3
  })
  gsap.set(footerRef.value, { opacity: 0, y: 20 })

  tl.to(tagRef.value, {
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
    x: 0,
    y: 0,
    opacity: 1,
    rotate: 0,
    stagger: 0.12
  }, '-=0.2')

  tl.to(cards, {
    rotate: 0,
    duration: 0.3
  }, '-=0.4')

  tl.to(footerRef.value, {
    opacity: 1,
    y: 0,
    duration: 0.4
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

  scrollTl.to(card1Ref.value, {
    x: -40,
    y: 30,
    rotate: -6,
    opacity: 0.7,
    scale: 0.9
  })

  scrollTl.to(card2Ref.value, {
    x: -20,
    y: 15,
    rotate: -3,
    opacity: 0.85,
    scale: 0.95
  }, '-=0.45')

  scrollTl.to(card3Ref.value, {
    scale: 1.1,
    y: -25,
    zIndex: 10,
    boxShadow: '0 30px 60px rgba(255, 107, 107, 0.25)',
    borderColor: 'rgba(255, 107, 107, 0.6)'
  }, '-=0.45')

  scrollTl.to(card4Ref.value, {
    x: 20,
    y: 15,
    rotate: 3,
    opacity: 0.85,
    scale: 0.95
  }, '-=0.5')

  scrollTl.to(card5Ref.value, {
    x: 40,
    y: 30,
    rotate: 6,
    opacity: 0.7,
    scale: 0.9
  }, '-=0.5')

  const continuousFloat = gsap.timeline({ paused: true })
  continuousFloat.to(cards, {
    y: 'random(-15, -5)',
    x: 'random(-10, 10)',
    rotation: 'random(-4, 4)',
    duration: 2.8,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true,
    stagger: { each: 0.18, from: 'random' }
  })

  ScrollTrigger.create({
    trigger: containerRef.value,
    start: 'top 80%',
    onEnter: () => continuousFloat.play(),
    onLeave: () => continuousFloat.pause(),
    onEnterBack: () => continuousFloat.play(),
    onLeaveBack: () => continuousFloat.pause()
  })

  const patternLines = bgPatternRef.value?.querySelectorAll('.pattern-line') as NodeListOf<HTMLElement>
  if (patternLines) {
    gsap.to(patternLines, {
      x: () => gsap.utils.random(-30, 30),
      y: () => gsap.utils.random(-30, 30),
      rotation: () => gsap.utils.random(-15, 15),
      duration: 4,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      stagger: { each: 0.15, from: 'random' }
    })
  }

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
.card-time-diagonal {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(160deg, #1a1a2e 0%, #0f0f1a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

.diagonal-container {
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

.bg-pattern {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.pattern-line {
  position: absolute;
  width: 1px;
  height: 200%;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(255, 107, 107, 0.1) 30%,
    rgba(255, 107, 107, 0.1) 70%,
    transparent
  );
  transform-origin: top center;

  &:nth-child(1) { left: 10%; transform: rotate(-15deg); }
  &:nth-child(2) { left: 25%; transform: rotate(-8deg); }
  &:nth-child(3) { left: 40%; transform: rotate(5deg); }
  &:nth-child(4) { left: 55%; transform: rotate(-12deg); }
  &:nth-child(5) { left: 70%; transform: rotate(10deg); }
  &:nth-child(6) { left: 85%; transform: rotate(-5deg); }
  &:nth-child(7) { left: 5%; transform: rotate(8deg); }
  &:nth-child(8) { left: 95%; transform: rotate(-10deg); }
}

.diagonal-header {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.header-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 107, 107, 0.8);
  letter-spacing: 3px;
  text-transform: uppercase;
  padding: 8px 20px;
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: 24px;
  background: rgba(255, 107, 107, 0.05);

  .tag-dot {
    width: 6px;
    height: 6px;
    background: #ff6b6b;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}

.diagonal-title {
  font-family: 'Syne', 'Inter', sans-serif;
  font-size: 72px;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: 16px;
  text-transform: uppercase;
  margin: 0;
  background: linear-gradient(135deg, #ffffff 0%, #ff6b6b 50%, #ffd93d 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.diagonal-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 2px;
  margin: 0;
  max-width: 400px;
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
  transform-style: preserve-3d;
  backface-visibility: hidden;
  z-index: 1;

  &.featured {
    z-index: 5;
  }

  &.featured .card-inner {
    border-color: rgba(255, 107, 107, 0.5);
    box-shadow:
      0 20px 50px rgba(255, 107, 107, 0.2),
      inset 0 0 30px rgba(255, 107, 107, 0.05);

    .card-accent {
      background: linear-gradient(135deg, #ff6b6b, #ffd93d);
      width: 60px;
    }

    .card-title {
      color: #ff6b6b;
    }

    .visual-shape {
      background: linear-gradient(135deg, #ff6b6b, #ffd93d);
    }
  }
}

.card-inner {
  width: 100%;
  height: 100%;
  background: linear-gradient(165deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-14px) rotateX(5deg);
    border-color: rgba(255, 107, 107, 0.4);
    box-shadow: 0 25px 50px rgba(255, 107, 107, 0.15);
  }
}

.card-accent {
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, #ff6b6b, #ffd93d);
  border-radius: 20px 0 0 20px;
}

.card-index {
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.3);
  letter-spacing: 2px;
  margin-bottom: 12px;
  padding-left: 12px;
}

.card-title {
  font-family: 'Syne', 'Inter', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 10px 0;
  padding-left: 12px;
  transition: color 0.3s ease;
}

.card-desc {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.6;
  margin: 0;
  flex-grow: 1;
  padding-left: 12px;
}

.card-visual {
  margin-top: auto;
  padding-left: 12px;
  display: flex;
  align-items: flex-end;
}

.visual-shape {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.6), rgba(255, 217, 61, 0.6));
  transition: all 0.4s ease;

  &.rect {
    border-radius: 8px;
  }

  &.circle {
    border-radius: 50%;
  }

  &.triangle {
    background: transparent;
    width: 0;
    height: 0;
    border-left: 22px solid transparent;
    border-right: 22px solid transparent;
    border-bottom: 40px solid;
    border-bottom-color: linear-gradient(135deg, #ff6b6b, #ffd93d);
  }

  &.wave {
    border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  }

  &.gradient {
    border-radius: 8px;
    background: conic-gradient(from 0deg, #ff6b6b, #ffd93d, #ff6b6b);
  }
}

.card-item:hover .visual-shape {
  transform: scale(1.15) rotate(10deg);
}

.diagonal-footer {
  margin-top: 20px;
}

.footer-decoration {
  display: flex;
  align-items: center;
  gap: 20px;

  .deco-line {
    width: 60px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 107, 107, 0.5), transparent);
  }

  .deco-text {
    font-family: 'Inter', sans-serif;
    font-size: 10px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.4);
    letter-spacing: 4px;
    text-transform: uppercase;
  }
}

@media (max-width: 1200px) {
  .cards-wrapper {
    gap: 16px;
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

  .diagonal-title {
    font-size: 42px;
    letter-spacing: 8px;
  }
}
</style>
