<template>
  <section ref="containerRef" class="card-time-pageflip">
    <div ref="bgRef" class="pageflip-bg">
      <div ref="glow1Ref" class="bg-glow glow-1"></div>
      <div ref="glow2Ref" class="bg-glow glow-2"></div>
      <div class="bg-lines">
        <div v-for="i in 15" :key="i" class="bg-line"></div>
      </div>
    </div>

    <div ref="contentRef" class="pageflip-content">
      <div ref="headerRef" class="pageflip-header">
        <div ref="badgeRef" class="header-badge">
          <span class="badge-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
          </span>
          <span class="badge-text">Story Collection</span>
        </div>
        <h1 ref="titleRef" class="pageflip-title">PAGE FLIP</h1>
        <p ref="subtitleRef" class="pageflip-subtitle">
          Turning pages of innovation, one story at a time
        </p>
      </div>

      <div ref="cardsWrapperRef" class="cards-wrapper">
        <div
          v-for="(card, index) in cards"
          :key="index"
          :ref="el => cardRefs[index] = el as HTMLElement"
          class="flip-card"
          :data-index="index + 1"
        >
          <div class="card-page card-front">
            <div class="page-edge"></div>
            <div class="page-content">
              <div class="card-header-section">
                <span class="card-label">Chapter {{ String(index + 1).padStart(2, '0') }}</span>
              </div>
              <div class="card-visual">
                <div class="visual-emblem">
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
              <h3 class="card-title">{{ card.title }}</h3>
              <p class="card-excerpt">{{ card.excerpt }}</p>
              <div class="card-footer-section">
                <span class="read-more">Read More</span>
                <span class="arrow">→</span>
              </div>
            </div>
          </div>
          <div class="card-page card-back">
            <div class="page-edge-back"></div>
            <div class="page-content-back">
              <div class="back-number">{{ String(index + 1).padStart(2, '0') }}</div>
              <div class="back-tag">{{ card.tag }}</div>
              <div class="back-divider"></div>
              <p class="back-detail">{{ card.detail }}</p>
            </div>
          </div>
        </div>
      </div>

      <div ref="footerRef" class="pageflip-footer">
        <div ref="line1Ref" class="footer-line"></div>
        <span ref="footerTextRef" class="footer-text">A Journey Through Design</span>
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
const glow1Ref = ref<HTMLElement | null>(null)
const glow2Ref = ref<HTMLElement | null>(null)
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
  { title: 'Genesis', excerpt: 'Where every great story begins with a single spark', tag: 'Origin', detail: 'The beginning of a journey that transforms ideas into reality' },
  { title: 'Evolution', excerpt: 'Adaptation is the key to lasting excellence', tag: 'Growth', detail: 'Continuous improvement that shapes the future' },
  { title: 'Harmony', excerpt: 'Balance between form and function achieved', tag: 'Balance', detail: 'Perfect synchronization of aesthetics and utility' },
  { title: 'Horizon', excerpt: 'Beyond the edge lies infinite possibility', tag: 'Future', detail: 'Pushing boundaries to discover new frontiers' },
  { title: 'Legacy', excerpt: 'Building timeless value that endures', tag: 'Eternal', detail: 'Creating impact that transcends generations' }
]

const cleanupFns: TweenCleanup[] = []

onMounted(() => {
  const allCards = cardRefs.value.filter(Boolean) as HTMLElement[]

  const tl = gsap.timeline({
    defaults: { duration: 0.8, ease: 'power3.inOut' },
    paused: true
  })

  gsap.set([badgeRef.value, titleRef.value, subtitleRef.value], {
    opacity: 0,
    y: -30
  })

  gsap.set(allCards, {
    transformOrigin: 'left center',
    rotationY: 0,
    opacity: 1
  })

  gsap.set('.card-back', {
    backfaceVisibility: 'hidden',
    transform: 'rotateY(180deg)'
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
    y: 0,
    opacity: 1,
    stagger: 0.12,
    duration: 0.6
  }, '-=0.2')

  tl.to(allCards, {
    rotationY: -180,
    stagger: 0.15,
    duration: 0.7
  }, '-=0.2')

  tl.to(allCards, {
    rotationY: 0,
    opacity: 1,
    stagger: 0.12,
    duration: 0.4,
    ease: 'power2.out'
  }, '+=0.3')

  tl.from('.flip-card .card-label', {
    y: 15,
    opacity: 0,
    stagger: 0.08,
    duration: 0.4
  }, '-=0.6')

  tl.from('.flip-card .card-title', {
    y: 20,
    opacity: 0,
    stagger: 0.08,
    duration: 0.5
  }, '-=0.5')

  tl.from('.flip-card .card-excerpt', {
    y: 10,
    opacity: 0,
    stagger: 0.08,
    duration: 0.4
  }, '-=0.4')

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
    x: -80,
    y: 50,
    scale: 0.85,
    opacity: 0.6,
    rotationY: -15
  })

  scrollTl.to(allCards[1], {
    x: -40,
    y: 25,
    scale: 0.92,
    opacity: 0.8,
    rotationY: -8
  }, '-=0.4')

  scrollTl.to(allCards[2], {
    scale: 1.18,
    y: -40,
    zIndex: 10,
    rotationY: 0
  }, '-=0.4')

  scrollTl.to(allCards[3], {
    x: 40,
    y: 25,
    scale: 0.92,
    opacity: 0.8,
    rotationY: 8
  }, '-=0.5')

  scrollTl.to(allCards[4], {
    x: 80,
    y: 50,
    scale: 0.85,
    opacity: 0.6,
    rotationY: 15
  }, '-=0.5')

  const continuousFlip = gsap.timeline({ paused: true })
  continuousFlip.to(allCards, {
    rotationY: -180,
    duration: 2,
    ease: 'power3.inOut',
    stagger: { each: 0.3, from: 'center' }
  })

  continuousFlip.to(allCards, {
    rotationY: 0,
    duration: 2,
    ease: 'power3.inOut',
    stagger: { each: 0.3, from: 'center' }
  }, '+=0.5')

  ScrollTrigger.create({
    trigger: containerRef.value,
    start: 'top 80%',
    onEnter: () => continuousFlip.play(),
    onLeave: () => continuousFlip.pause(),
    onEnterBack: () => continuousFlip.play(),
    onLeaveBack: () => continuousFlip.pause()
  })

  gsap.to(glow1Ref.value, {
    x: 150,
    y: 80,
    scale: 1.3,
    duration: 8,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true
  })

  gsap.to(glow2Ref.value, {
    x: -120,
    y: -70,
    scale: 0.8,
    duration: 10,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true
  })

  const bgLines = bgRef.value?.querySelectorAll('.bg-line') as NodeListOf<HTMLElement>
  if (bgLines) {
    gsap.to(bgLines, {
      x: () => gsap.utils.random(-30, 30),
      opacity: () => gsap.utils.random(0.1, 0.3),
      duration: 4,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      stagger: { each: 0.2, from: 'random' }
    })
  }

  cleanupFns.push(
    () => {
      tl.kill()
      scrollTl.kill()
      continuousFlip.kill()
    }
  )
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style lang="scss" scoped>
.card-time-pageflip {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #0a1628 0%, #1a2744 50%, #0a1628 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

.pageflip-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.bg-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.2;

  &.glow-1 {
    top: 10%;
    left: 20%;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, #f59e0b, transparent);
  }

  &.glow-2 {
    bottom: 15%;
    right: 15%;
    width: 450px;
    height: 450px;
    background: radial-gradient(circle, #3b82f6, transparent);
  }
}

.bg-lines {
  position: absolute;
  inset: 0;
  opacity: 0.06;

  .bg-line {
    position: absolute;
    width: 1px;
    height: 200%;
    background: linear-gradient(to bottom, transparent, rgba(245, 158, 11, 0.5), transparent);
    left: 6.6%;

    @for $i from 1 through 15 {
      &:nth-child(#{$i}) {
        left: #{$i * 6.6}%;
        transform: rotate(#{$i * 3 - 22}deg);
      }
    }
  }
}

.pageflip-content {
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

.pageflip-header {
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
  color: rgba(245, 158, 11, 0.9);
  letter-spacing: 3px;
  text-transform: uppercase;
  padding: 10px 24px;
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: 30px;
  background: rgba(245, 158, 11, 0.08);

  .badge-icon {
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 14px;
      height: 14px;
      color: #f59e0b;
    }
  }
}

.pageflip-title {
  font-family: 'Playfair Display', 'Inter', sans-serif;
  font-size: 72px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 12px;
  text-transform: uppercase;
  margin: 0;
  font-style: italic;
  background: linear-gradient(135deg, #ffffff 0%, #f59e0b 40%, #fbbf24 60%, #ffffff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.pageflip-subtitle {
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
  perspective: 1800px;
  transform-style: preserve-3d;
}

.flip-card {
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
    .card-front {
      transform: rotateY(-180deg);
    }
    .card-back {
      transform: rotateY(0deg);
    }
  }
}

.card-page {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  transform-style: preserve-3d;
  border-radius: 16px;
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-front {
  background: linear-gradient(170deg, rgba(40, 50, 70, 0.95), rgba(25, 35, 55, 0.98));
  border: 1px solid rgba(245, 158, 11, 0.15);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  transform-origin: left center;
}

.page-edge {
  position: absolute;
  left: 0;
  top: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(to right, rgba(245, 158, 11, 0.6), rgba(245, 158, 11, 0.1));
  border-radius: 16px 0 0 16px;
}

.page-content {
  height: 100%;
  padding: 24px;
  display: flex;
  flex-direction: column;
}

.card-header-section {
  margin-bottom: 16px;
}

.card-label {
  font-family: 'Crimson Text', serif;
  font-size: 11px;
  font-weight: 600;
  color: rgba(245, 158, 11, 0.6);
  letter-spacing: 3px;
  text-transform: uppercase;
  font-style: italic;
}

.card-visual {
  margin-bottom: 20px;
}

.visual-emblem {
  width: 60px;
  height: 60px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(251, 191, 36, 0.1));
  border-radius: 50%;
  border: 1px solid rgba(245, 158, 11, 0.2);

  svg {
    width: 30px;
    height: 30px;
    color: #f59e0b;
  }
}

.card-title {
  font-family: 'Playfair Display', serif;
  font-size: 22px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 12px 0;
  font-style: italic;
  letter-spacing: 1px;
}

.card-excerpt {
  font-family: 'Crimson Text', serif;
  font-size: 13px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.6;
  margin: 0;
  flex-grow: 1;
  font-style: italic;
}

.card-footer-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid rgba(245, 158, 11, 0.15);
}

.read-more {
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  font-weight: 600;
  color: #f59e0b;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.arrow {
  font-size: 16px;
  color: rgba(245, 158, 11, 0.6);
  transition: transform 0.3s ease;
}

.flip-card:hover .arrow {
  transform: translateX(5px);
}

.card-back {
  background: linear-gradient(170deg, rgba(30, 25, 20, 0.98), rgba(20, 15, 10, 1));
  border: 1px solid rgba(245, 158, 11, 0.3);
  box-shadow: 0 20px 60px rgba(245, 158, 11, 0.15);
  transform: rotateY(180deg);
}

.page-edge-back {
  position: absolute;
  right: 0;
  top: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(to left, rgba(245, 158, 11, 0.6), rgba(245, 158, 11, 0.1));
  border-radius: 0 16px 16px 0;
}

.page-content-back {
  height: 100%;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.back-number {
  font-family: 'Playfair Display', serif;
  font-size: 48px;
  font-weight: 700;
  color: rgba(245, 158, 11, 0.2);
  font-style: italic;
  margin-bottom: 8px;
}

.back-tag {
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  font-weight: 600;
  color: #f59e0b;
  letter-spacing: 3px;
  text-transform: uppercase;
  padding: 4px 12px;
  background: rgba(245, 158, 11, 0.15);
  border-radius: 12px;
  margin-bottom: 20px;
}

.back-divider {
  width: 60px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.4), transparent);
  margin-bottom: 20px;
}

.back-detail {
  font-family: 'Crimson Text', serif;
  font-size: 14px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.7;
  margin: 0;
  font-style: italic;
}

.pageflip-footer {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-top: 10px;
}

.footer-line {
  width: 80px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.4), transparent);
}

.footer-text {
  font-family: 'Playfair Display', serif;
  font-size: 12px;
  font-weight: 400;
  color: rgba(245, 158, 11, 0.6);
  letter-spacing: 3px;
  text-transform: uppercase;
  font-style: italic;
}

@media (max-width: 1200px) {
  .cards-wrapper {
    gap: 18px;
  }

  .flip-card {
    width: 170px;
    height: 280px;
  }

  .pageflip-title {
    font-size: 56px;
    letter-spacing: 10px;
  }
}

@media (max-width: 900px) {
  .cards-wrapper {
    flex-wrap: wrap;
    justify-content: center;
    max-width: 400px;
  }

  .flip-card {
    width: 150px;
    height: 250px;
  }

  .pageflip-title {
    font-size: 40px;
    letter-spacing: 6px;
  }
}
</style>
