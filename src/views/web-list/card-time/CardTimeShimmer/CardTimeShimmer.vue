<template>
  <section ref="containerRef" class="card-time-shimmer">
    <div ref="bgRef" class="shimmer-bg">
      <div ref="gradient1Ref" class="bg-gradient gradient-1"></div>
      <div ref="gradient2Ref" class="bg-gradient gradient-2"></div>
      <div class="bg-dots">
        <div v-for="i in 50" :key="i" class="dot"></div>
      </div>
    </div>

    <div ref="contentRef" class="shimmer-content">
      <div ref="headerRef" class="shimmer-header">
        <div ref="badgeRef" class="header-badge">
          <span class="badge-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </span>
          <span class="badge-text">Premium Collection</span>
        </div>
        <h1 ref="titleRef" class="shimmer-title">SHIMMER</h1>
        <p ref="subtitleRef" class="shimmer-subtitle">
          Where light meets luxury in perfect harmony
        </p>
      </div>

      <div ref="cardsWrapperRef" class="cards-wrapper">
        <div
          v-for="(card, index) in cards"
          :key="index"
          :ref="el => cardRefs[index] = el as HTMLElement"
          class="lux-card"
          :data-index="index + 1"
        >
          <div class="card-shine-effect"></div>
          <div class="card-inner">
            <div class="card-ornament">
              <div class="ornament-line"></div>
              <div class="ornament-diamond"></div>
              <div class="ornament-line"></div>
            </div>
            <div class="card-visual">
              <div class="visual-frame">
                <div class="frame-corner top-left"></div>
                <div class="frame-corner top-right"></div>
                <div class="frame-corner bottom-left"></div>
                <div class="frame-corner bottom-right"></div>
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
            </div>
            <div class="card-body">
              <span class="card-number">{{ String(index + 1).padStart(2, '0') }}</span>
              <h3 class="card-title">{{ card.title }}</h3>
              <p class="card-desc">{{ card.desc }}</p>
            </div>
            <div class="card-footer">
              <span class="card-tag">{{ card.tag }}</span>
              <div class="card-price">{{ card.price }}</div>
            </div>
          </div>
        </div>
      </div>

      <div ref="footerRef" class="shimmer-footer">
        <div ref="line1Ref" class="footer-line"></div>
        <span ref="footerTextRef" class="footer-text">Elegant by Design</span>
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
const gradient1Ref = ref<HTMLElement | null>(null)
const gradient2Ref = ref<HTMLElement | null>(null)
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
  { title: 'Radiance', desc: 'Inner light that captivates and inspires', tag: 'Luminous', price: '$299' },
  { title: 'Luxe', desc: 'Uncompromising quality meets refined taste', tag: 'Premium', price: '$499' },
  { title: 'Eclat', desc: 'Brilliance that stands the test of time', tag: 'Exclusive', price: '$799' },
  { title: 'Majesty', desc: 'Regal elegance in every intricate detail', tag: 'Royal', price: '$599' },
  { title: 'Opulence', desc: 'Abundant beauty beyond compare', tag: 'Elite', price: '$899' }
]

const cleanupFns: TweenCleanup[] = []

onMounted(() => {
  const allCards = cardRefs.value.filter(Boolean) as HTMLElement[]
  const cardInners = allCards.map(card => card.querySelector('.card-inner') as HTMLElement)
  const cardShines = allCards.map(card => card.querySelector('.card-shine-effect') as HTMLElement)
  const visualIcons = allCards.map(card => card.querySelector('.visual-icon') as HTMLElement)

  const tl = gsap.timeline({
    defaults: { duration: 0.7, ease: 'power3.out' },
    paused: true
  })

  gsap.set([badgeRef.value, titleRef.value, subtitleRef.value], {
    opacity: 0,
    y: -30
  })

  gsap.set(allCards, {
    y: 80,
    opacity: 0,
    scale: 0.9,
    backgroundColor: 'rgba(30, 25, 40, 0.4)'
  })

  gsap.set(cardShines, {
    left: '-100%'
  })

  gsap.set(cardInners, {
    boxShadow: '0 0 0 rgba(212, 175, 55, 0)',
    borderColor: 'rgba(212, 175, 55, 0.15)'
  })

  gsap.set([line1Ref.value, footerTextRef.value, line2Ref.value], {
    opacity: 0,
    scaleX: 0
  })

  tl.to([badgeRef.value, titleRef.value, subtitleRef.value], {
    opacity: 1,
    y: 0,
    duration: 0.5,
    stagger: 0.1
  })

  tl.to(allCards, {
    y: 0,
    opacity: 1,
    scale: 1,
    stagger: 0.12
  }, '-=0.2')

  tl.to(cardShines, {
    left: '100%',
    duration: 0.9,
    stagger: 0.12,
    ease: 'power2.inOut'
  }, '-=0.5')

  tl.to(cardInners, {
    boxShadow: '0 25px 60px rgba(212, 175, 55, 0.2)',
    borderColor: 'rgba(212, 175, 55, 0.4)',
    stagger: 0.12,
    duration: 0.6
  }, '-=0.6')

  tl.to(allCards, {
    backgroundColor: 'rgba(40, 35, 55, 0.95)',
    stagger: 0.12,
    duration: 0.5
  }, '-=0.5')

  tl.from(visualIcons, {
    scale: 0,
    rotation: -90,
    opacity: 0,
    stagger: 0.1,
    duration: 0.6,
    ease: 'back.out(1.5)'
  }, '-=0.5')

  tl.from('.lux-card .card-number', {
    y: 20,
    opacity: 0,
    stagger: 0.08,
    duration: 0.4
  }, '-=0.4')

  tl.from('.lux-card .card-title', {
    y: 15,
    opacity: 0,
    stagger: 0.08,
    duration: 0.4
  }, '-=0.4')

  tl.from('.lux-card .card-desc', {
    y: 10,
    opacity: 0,
    stagger: 0.08,
    duration: 0.4
  }, '-=0.4')

  tl.from('.lux-card .card-footer', {
    y: 10,
    opacity: 0,
    stagger: 0.08,
    duration: 0.3
  }, '-=0.4')

  tl.to([line1Ref.value, footerTextRef.value, line2Ref.value], {
    opacity: 1,
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
    x: -60,
    y: 40,
    scale: 0.88,
    opacity: 0.7
  })

  scrollTl.to(allCards[1], {
    x: -30,
    y: 20,
    scale: 0.94,
    opacity: 0.85
  }, '-=0.4')

  scrollTl.to(allCards[2], {
    scale: 1.12,
    y: -30,
    zIndex: 10,
    filter: 'brightness(1.15) saturate(1.2)'
  }, '-=0.4')

  scrollTl.to(allCards[3], {
    x: 30,
    y: 20,
    scale: 0.94,
    opacity: 0.85
  }, '-=0.5')

  scrollTl.to(allCards[4], {
    x: 60,
    y: 40,
    scale: 0.88,
    opacity: 0.7
  }, '-=0.5')

  const continuousShimmer = gsap.timeline({ paused: true })
  continuousShimmer.to(cardShines, {
    left: '100%',
    duration: 2,
    ease: 'power2.inOut',
    stagger: { each: 0.4, from: 'random' }
  })

  continuousShimmer.to(allCards, {
    y: () => gsap.utils.random(-10, -3),
    rotation: () => gsap.utils.random(-2, 2),
    duration: 2.5,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true,
    stagger: { each: 0.2, from: 'random' }
  }, 0)

  ScrollTrigger.create({
    trigger: containerRef.value,
    start: 'top 80%',
    onEnter: () => continuousShimmer.play(),
    onLeave: () => continuousShimmer.pause(),
    onEnterBack: () => continuousShimmer.play(),
    onLeaveBack: () => continuousShimmer.pause()
  })

  gsap.to(gradient1Ref.value, {
    x: 100,
    y: 50,
    scale: 1.2,
    duration: 8,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true
  })

  gsap.to(gradient2Ref.value, {
    x: -80,
    y: -60,
    scale: 0.9,
    duration: 10,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true
  })

  cleanupFns.push(
    () => {
      tl.kill()
      scrollTl.kill()
      continuousShimmer.kill()
    }
  )
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style lang="scss" scoped>
.card-time-shimmer {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #1a1525 0%, #252035 50%, #1a1525 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

.shimmer-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.bg-gradient {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.25;

  &.gradient-1 {
    top: -10%;
    right: -10%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, #d4af37, transparent);
  }

  &.gradient-2 {
    bottom: -15%;
    left: -10%;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, #c9a227, transparent);
  }
}

.bg-dots {
  position: absolute;
  inset: 0;
  opacity: 0.08;

  .dot {
    position: absolute;
    width: 3px;
    height: 3px;
    background: #d4af37;
    border-radius: 50%;

    @for $i from 1 through 50 {
      &:nth-child(#{$i}) {
        left: #{$i * 2}%;
        top: #{$i * 1.8}%;
      }
    }
  }
}

.shimmer-content {
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

.shimmer-header {
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
  color: rgba(212, 175, 55, 0.9);
  letter-spacing: 3px;
  text-transform: uppercase;
  padding: 10px 24px;
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 30px;
  background: rgba(212, 175, 55, 0.08);

  .badge-icon {
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 14px;
      height: 14px;
      color: #d4af37;
    }
  }
}

.shimmer-title {
  font-family: 'Cormorant Garamond', 'Playfair Display', serif;
  font-size: 72px;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 16px;
  text-transform: uppercase;
  margin: 0;
  font-style: italic;
  background: linear-gradient(135deg, #ffffff 0%, #d4af37 30%, #f5e6a3 50%, #d4af37 70%, #ffffff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.shimmer-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 3px;
  margin: 0;
  max-width: 450px;
}

.cards-wrapper {
  display: flex;
  gap: 24px;
  perspective: 1500px;
  transform-style: preserve-3d;
}

.lux-card {
  width: 200px;
  height: 340px;
  position: relative;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  z-index: 1;

  &:nth-child(3) {
    z-index: 5;
  }

  &:hover {
    .card-shine-effect {
      animation: shimmerSweep 1.5s ease-in-out;
    }

    .visual-icon {
      transform: scale(1.1);
    }
  }
}

.card-shine-effect {
  position: absolute;
  top: 0;
  left: -100%;
  width: 60%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.08),
    rgba(255, 255, 255, 0.15),
    rgba(255, 255, 255, 0.08),
    transparent
  );
  transform: skewX(-20deg);
  pointer-events: none;
  z-index: 10;
}

@keyframes shimmerSweep {
  0% { left: -100%; }
  100% { left: 200%; }
}

.card-inner {
  width: 100%;
  height: 100%;
  background: rgba(35, 30, 50, 0.95);
  backdrop-filter: blur(30px);
  border: 1px solid rgba(212, 175, 55, 0.25);
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-16px) rotateX(3deg);
    border-color: rgba(212, 175, 55, 0.5);
    box-shadow: 0 30px 70px rgba(212, 175, 55, 0.2);
  }
}

.card-ornament {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;

  .ornament-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.4), transparent);
  }

  .ornament-diamond {
    width: 8px;
    height: 8px;
    background: #d4af37;
    transform: rotate(45deg);
  }
}

.card-visual {
  margin-bottom: 20px;
}

.visual-frame {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto;
}

.frame-corner {
  position: absolute;
  width: 16px;
  height: 16px;
  border-color: rgba(212, 175, 55, 0.5);
  border-style: solid;
  border-width: 0;

  &.top-left {
    top: 0;
    left: 0;
    border-top-width: 2px;
    border-left-width: 2px;
  }

  &.top-right {
    top: 0;
    right: 0;
    border-top-width: 2px;
    border-right-width: 2px;
  }

  &.bottom-left {
    bottom: 0;
    left: 0;
    border-bottom-width: 2px;
    border-left-width: 2px;
  }

  &.bottom-right {
    bottom: 0;
    right: 0;
    border-bottom-width: 2px;
    border-right-width: 2px;
  }
}

.visual-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(212, 175, 55, 0.05));
  border-radius: 14px;
  transition: transform 0.4s ease;

  svg {
    width: 26px;
    height: 26px;
    color: #d4af37;
  }
}

.card-body {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.card-number {
  font-family: 'Cormorant Garamond', serif;
  font-size: 12px;
  font-weight: 600;
  color: rgba(212, 175, 55, 0.4);
  letter-spacing: 3px;
}

.card-title {
  font-family: 'Cormorant Garamond', 'Playfair Display', serif;
  font-size: 22px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
  font-style: italic;
  letter-spacing: 1px;
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
  border-top: 1px solid rgba(212, 175, 55, 0.15);
}

.card-tag {
  font-family: 'Inter', sans-serif;
  font-size: 9px;
  font-weight: 600;
  color: #d4af37;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding: 4px 10px;
  background: rgba(212, 175, 55, 0.1);
  border-radius: 10px;
}

.card-price {
  font-family: 'Cormorant Garamond', serif;
  font-size: 18px;
  font-weight: 600;
  color: #d4af37;
  font-style: italic;
}

.shimmer-footer {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-top: 10px;
}

.footer-line {
  width: 100px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.4), transparent);
}

.footer-text {
  font-family: 'Cormorant Garamond', serif;
  font-size: 12px;
  font-weight: 500;
  color: rgba(212, 175, 55, 0.6);
  letter-spacing: 4px;
  text-transform: uppercase;
  font-style: italic;
}

@media (max-width: 1200px) {
  .cards-wrapper {
    gap: 18px;
  }

  .lux-card {
    width: 170px;
    height: 300px;
  }

  .shimmer-title {
    font-size: 56px;
    letter-spacing: 12px;
  }
}

@media (max-width: 900px) {
  .cards-wrapper {
    flex-wrap: wrap;
    justify-content: center;
    max-width: 400px;
  }

  .lux-card {
    width: 150px;
    height: 270px;
  }

  .shimmer-title {
    font-size: 40px;
    letter-spacing: 8px;
  }
}
</style>
