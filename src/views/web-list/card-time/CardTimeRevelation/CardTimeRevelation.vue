<template>
  <section ref="containerRef" class="card-time-revelation">
    <div ref="bgRef" class="revelation-bg">
      <div ref="gridRef" class="bg-grid">
        <div v-for="i in 20" :key="i" class="grid-line"></div>
      </div>
      <div ref="glowRef" class="bg-glow"></div>
    </div>

    <div ref="contentRef" class="revelation-content">
      <div ref="headerRef" class="revelation-header">
        <div ref="badgeRef" class="header-badge">
          <span class="badge-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </span>
          <span class="badge-text">Infinite Wisdom</span>
        </div>
        <h1 ref="titleRef" class="revelation-title">REVELATION</h1>
        <p ref="subtitleRef" class="revelation-subtitle">
          Unveil the layers of tomorrow's design
        </p>
      </div>

      <div ref="cardsWrapperRef" class="cards-wrapper">
        <div
          v-for="(card, index) in cards"
          :key="index"
          :ref="el => cardRefs[index] = el as HTMLElement"
          class="reveal-card"
          :data-index="index + 1"
        >
          <div class="card-inner">
            <div class="card-border"></div>
            <div class="card-shine"></div>
            <div class="card-content">
              <div class="card-number">{{ String(index + 1).padStart(2, '0') }}</div>
              <div class="card-icon">
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
              <h3 class="card-title">{{ card.title }}</h3>
              <p class="card-desc">{{ card.desc }}</p>
              <div class="card-meta">
                <span class="meta-tag">{{ card.tag }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div ref="footerRef" class="revelation-footer">
        <div ref="footerLineRef" class="footer-line"></div>
        <span ref="footerTextRef" class="footer-text">Discover More</span>
        <div ref="footerLine2Ref" class="footer-line"></div>
      </div>
    </div>

    <div ref="scrollIndicatorRef" class="scroll-indicator">
      <div class="scroll-mouse">
        <div class="scroll-wheel"></div>
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
const glowRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const badgeRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const cardsWrapperRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const footerLineRef = ref<HTMLElement | null>(null)
const footerTextRef = ref<HTMLElement | null>(null)
const footerLine2Ref = ref<HTMLElement | null>(null)
const scrollIndicatorRef = ref<HTMLElement | null>(null)

const cardRefs = ref<(HTMLElement | null)[]>([])
const cardInnerRefs = ref<(HTMLElement | null)[]>([])

const cards = [
  { title: 'Clarity', desc: 'Cutting through complexity to reveal essential truth', tag: 'Insight' },
  { title: 'Depth', desc: 'Layers of meaning waiting to be discovered', tag: 'Wisdom' },
  { title: 'Essence', desc: 'The soul of design distilled to perfection', tag: 'Purity' },
  { title: 'Momentum', desc: 'Forward motion that defies convention', tag: 'Energy' },
  { title: 'Harmony', desc: 'Balance between structure and expression', tag: 'Unity' }
]

const cleanupFns: TweenCleanup[] = []

onMounted(() => {
  const allCards = cardRefs.value.filter(Boolean) as HTMLElement[]
  const allCardInners = allCards.map((card, i) => {
    const inner = card.querySelector('.card-inner') as HTMLElement
    cardInnerRefs.value[i] = inner
    return inner
  }).filter(Boolean)

  const tl = gsap.timeline({
    defaults: { duration: 0.9, ease: 'power3.inOut' },
    paused: true
  })

  gsap.set([badgeRef.value, titleRef.value, subtitleRef.value], {
    opacity: 0,
    y: -30
  })

  gsap.set(allCards, {
    clipPath: 'inset(0 100% 100% 0)'
  })

  gsap.set(allCardInners, {
    boxShadow: '0 0 0 rgba(99, 102, 241, 0)',
    borderColor: 'rgba(99, 102, 241, 0)'
  })

  gsap.set([footerLineRef.value, footerTextRef.value, footerLine2Ref.value], {
    scaleX: 0,
    transformOrigin: 'center'
  })

  tl.to([badgeRef.value, titleRef.value, subtitleRef.value], {
    opacity: 1,
    y: 0,
    duration: 0.6,
    stagger: 0.15
  })

  tl.to(allCards, {
    clipPath: 'inset(0 0% 0% 0)',
    stagger: 0.15
  }, '-=0.3')

  tl.to(allCardInners, {
    boxShadow: '0 25px 80px rgba(99, 102, 241, 0.3)',
    borderColor: 'rgba(99, 102, 241, 0.6)',
    stagger: 0.15,
    duration: 0.8
  }, '-=0.8')

  tl.from('.reveal-card .card-number', {
    y: 20,
    opacity: 0,
    stagger: 0.1,
    duration: 0.5,
    ease: 'power2.out'
  }, '-=0.6')

  tl.from('.reveal-card .card-icon', {
    y: 15,
    opacity: 0,
    stagger: 0.1,
    duration: 0.5,
    ease: 'power2.out'
  }, '-=0.4')

  tl.from('.reveal-card .card-title', {
    y: 15,
    opacity: 0,
    stagger: 0.1,
    duration: 0.5,
    ease: 'power2.out'
  }, '-=0.4')

  tl.from('.reveal-card .card-desc', {
    y: 10,
    opacity: 0,
    stagger: 0.1,
    duration: 0.4,
    ease: 'power2.out'
  }, '-=0.4')

  tl.to([footerLineRef.value, footerTextRef.value, footerLine2Ref.value], {
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
    scale: 0.85,
    opacity: 0.6
  })

  scrollTl.to(allCards[1], {
    x: -30,
    y: 20,
    scale: 0.92,
    opacity: 0.8
  }, '-=0.4')

  scrollTl.to(allCards[2], {
    scale: 1.15,
    y: -30,
    zIndex: 10,
    boxShadow: '0 40px 100px rgba(99, 102, 241, 0.4)',
    borderColor: 'rgba(168, 85, 247, 0.8)'
  }, '-=0.4')

  scrollTl.to(allCards[3], {
    x: 30,
    y: 20,
    scale: 0.92,
    opacity: 0.8
  }, '-=0.5')

  scrollTl.to(allCards[4], {
    x: 60,
    y: 40,
    scale: 0.85,
    opacity: 0.6
  }, '-=0.5')

  const continuousFloat = gsap.timeline({ paused: true })
  continuousFloat.to(allCards, {
    y: () => gsap.utils.random(-12, -4),
    rotation: () => gsap.utils.random(-3, 3),
    duration: 3,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true,
    stagger: { each: 0.2, from: 'random' }
  })

  ScrollTrigger.create({
    trigger: containerRef.value,
    start: 'top 80%',
    onEnter: () => continuousFloat.play(),
    onLeave: () => continuousFloat.pause(),
    onEnterBack: () => continuousFloat.play(),
    onLeaveBack: () => continuousFloat.pause()
  })

  const gridLines = gridRef.value?.querySelectorAll('.grid-line') as NodeListOf<HTMLElement>
  if (gridLines) {
    gsap.to(gridLines, {
      x: () => gsap.utils.random(-50, 50),
      y: () => gsap.utils.random(-30, 30),
      rotation: () => gsap.utils.random(-10, 10),
      opacity: () => gsap.utils.random(0.3, 0.8),
      duration: 5,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      stagger: { each: 0.15, from: 'random' }
    })
  }

  gsap.to(glowRef.value, {
    scale: 1.3,
    opacity: 0.6,
    duration: 4,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true
  })

  gsap.to(scrollIndicatorRef.value, {
    y: 10,
    opacity: 0.5,
    duration: 1.2,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true
  })

  cleanupFns.push(
    () => {
      tl.kill()
      scrollTl.kill()
      continuousFloat.kill()
      ScrollTrigger.getAll().forEach(st => st.kill())
    }
  )
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style lang="scss" scoped>
.card-time-revelation {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #0f0a1f 0%, #1a1033 50%, #0d0a1a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

.revelation-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.bg-grid {
  position: absolute;
  inset: 0;
  opacity: 0.15;

  .grid-line {
    position: absolute;
    width: 1px;
    height: 150%;
    background: linear-gradient(to bottom, transparent, rgba(168, 85, 247, 0.5), transparent);
    left: 5%;

    @for $i from 1 through 20 {
      &:nth-child(#{$i}) {
        left: #{$i * 5}%;
        transform: rotate(#{$i * 2 - 20}deg);
      }
    }
  }
}

.bg-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 600px;
  height: 600px;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%);
  filter: blur(60px);
}

.revelation-content {
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

.revelation-header {
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
  color: rgba(168, 85, 247, 0.9);
  letter-spacing: 3px;
  text-transform: uppercase;
  padding: 10px 24px;
  border: 1px solid rgba(168, 85, 247, 0.3);
  border-radius: 30px;
  background: rgba(168, 85, 247, 0.08);

  .badge-icon {
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 14px;
      height: 14px;
      color: #a855f7;
    }
  }

  .badge-text {
    color: rgba(168, 85, 247, 0.9);
  }
}

.revelation-title {
  font-family: 'Outfit', 'Inter', sans-serif;
  font-size: 80px;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: 20px;
  text-transform: uppercase;
  margin: 0;
  background: linear-gradient(135deg, #ffffff 0%, #a855f7 50%, #6366f1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.revelation-subtitle {
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

.reveal-card {
  width: 200px;
  height: 320px;
  position: relative;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  z-index: 1;

  &:nth-child(3) {
    z-index: 5;
  }
}

.card-inner {
  width: 100%;
  height: 100%;
  background: linear-gradient(165deg, rgba(30, 20, 50, 0.9), rgba(15, 10, 30, 0.95));
  backdrop-filter: blur(30px);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 24px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(99, 102, 241, 0.2);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-18px) rotateX(5deg) rotateY(-5deg);
    box-shadow: 0 30px 80px rgba(168, 85, 247, 0.3);

    .card-shine {
      opacity: 1;
    }

    .card-icon {
      transform: scale(1.1) rotate(5deg);
    }
  }
}

.card-border {
  position: absolute;
  inset: 0;
  border-radius: 24px;
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.5), transparent, rgba(99, 102, 241, 0.5));
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.card-shine {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent 30%,
    rgba(255, 255, 255, 0.03) 50%,
    transparent 70%
  );
  transform: rotate(45deg);
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.card-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
}

.card-number {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 700;
  color: rgba(168, 85, 247, 0.4);
  letter-spacing: 3px;
  margin-bottom: 16px;
}

.card-icon {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2));
  border-radius: 16px;
  margin-bottom: 20px;
  transition: transform 0.4s ease;

  svg {
    width: 32px;
    height: 32px;
    color: #a855f7;
  }
}

.card-title {
  font-family: 'Outfit', 'Inter', sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 12px 0;
  letter-spacing: 1px;
}

.card-desc {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.6;
  margin: 0;
  flex-grow: 1;
}

.card-meta {
  margin-top: auto;
  padding-top: 16px;
}

.meta-tag {
  display: inline-block;
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  font-weight: 600;
  color: #a855f7;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding: 6px 14px;
  background: rgba(168, 85, 247, 0.15);
  border-radius: 20px;
}

.revelation-footer {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 10px;
}

.footer-line {
  width: 80px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.5), transparent);
}

.footer-text {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: rgba(168, 85, 247, 0.6);
  letter-spacing: 4px;
  text-transform: uppercase;
}

.scroll-indicator {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
}

.scroll-mouse {
  width: 24px;
  height: 38px;
  border: 2px solid rgba(168, 85, 247, 0.4);
  border-radius: 12px;
  display: flex;
  justify-content: center;
  padding-top: 8px;
}

.scroll-wheel {
  width: 4px;
  height: 8px;
  background: rgba(168, 85, 247, 0.6);
  border-radius: 2px;
  animation: scrollWheel 1.5s infinite;
}

@keyframes scrollWheel {
  0% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(8px); }
}

@media (max-width: 1200px) {
  .cards-wrapper {
    gap: 18px;
  }

  .reveal-card {
    width: 170px;
    height: 280px;
  }

  .revelation-title {
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

  .reveal-card {
    width: 150px;
    height: 250px;
  }

  .revelation-title {
    font-size: 42px;
    letter-spacing: 10px;
  }
}
</style>
