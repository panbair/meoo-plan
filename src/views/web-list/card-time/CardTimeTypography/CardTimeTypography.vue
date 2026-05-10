<template>
  <section ref="containerRef" class="card-time-typography">
    <div ref="bgRef" class="typography-bg">
      <div ref="mesh1Ref" class="bg-mesh mesh-1"></div>
      <div ref="mesh2Ref" class="bg-mesh mesh-2"></div>
      <div class="bg-texture">
        <div v-for="i in 100" :key="i" class="texture-dot"></div>
      </div>
    </div>

    <div ref="contentRef" class="typography-content">
      <div ref="headerRef" class="typography-header">
        <div ref="badgeRef" class="header-badge">
          <span class="badge-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="4 7 4 4 20 4 20 7"/>
              <line x1="9" y1="20" x2="15" y2="20"/>
              <line x1="12" y1="4" x2="12" y2="20"/>
            </svg>
          </span>
          <span class="badge-text">Typographic Art</span>
        </div>
        <h1 ref="titleRef" class="typography-title">
          <span v-for="(char, i) in 'TYPOGRAPHY'.split('')" :key="i" class="title-char">{{ char }}</span>
        </h1>
        <p ref="subtitleRef" class="typography-subtitle">
          <span v-for="(word, i) in ['Letters', 'that', 'speak', 'louder']" :key="i" class="subtitle-word">
            <span v-for="(char, j) in word.split('')" :key="j" class="subtitle-char">{{ char }}</span>
            <span v-if="i < 3" class="word-space">&nbsp;</span>
          </span>
        </p>
      </div>

      <div ref="cardsWrapperRef" class="cards-wrapper">
        <div
          v-for="(card, index) in cards"
          :key="index"
          :ref="el => cardRefs[index] = el as HTMLElement"
          class="type-card"
          :data-index="index + 1"
        >
          <div class="card-inner">
            <div class="card-index">
              <span v-for="(char, i) in String(index + 1).padStart(2, '0').split('')" :key="i" class="index-char">{{ char }}</span>
            </div>
            <div class="card-title-wrap">
              <h3 class="card-title">
                <span v-for="(char, i) in card.title.split('')" :key="i" class="char">{{ char }}</span>
              </h3>
            </div>
            <div class="card-desc-wrap">
              <p class="card-desc">
                <span v-for="(char, i) in card.desc.split('')" :key="i" class="char">{{ char === ' ' ? '\u00A0' : char }}</span>
              </p>
            </div>
            <div class="card-divider">
              <div class="divider-line"></div>
              <div class="divider-diamond"></div>
              <div class="divider-line"></div>
            </div>
            <div class="card-tag-wrap">
              <span v-for="(char, i) in card.tag.split('')" :key="i" class="tag-char">{{ char }}</span>
            </div>
          </div>
        </div>
      </div>

      <div ref="footerRef" class="typography-footer">
        <div ref="line1Ref" class="footer-line"></div>
        <span ref="footerTextRef" class="footer-text">
          <span v-for="(char, i) in 'Crafted with precision'.split('')" :key="i" class="footer-char">{{ char }}</span>
        </span>
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
const mesh1Ref = ref<HTMLElement | null>(null)
const mesh2Ref = ref<HTMLElement | null>(null)
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
  { title: 'Serif', desc: 'Classic elegance meets modern sensibility', tag: 'Traditional' },
  { title: 'Sans', desc: 'Clean lines that speak with clarity', tag: 'Modern' },
  { title: 'Script', desc: 'Fluid strokes dance across the page', tag: 'Elegant' },
  { title: 'Display', desc: 'Bold statements demand attention', tag: 'Bold' },
  { title: 'Mono', desc: 'Precision in every pixel and space', tag: 'Technical' }
]

const cleanupFns: TweenCleanup[] = []

onMounted(() => {
  const allCards = cardRefs.value.filter(Boolean) as HTMLElement[]

  const tl = gsap.timeline({
    defaults: { duration: 0.5, ease: 'power3.out' },
    paused: true
  })

  gsap.set([badgeRef.value], {
    opacity: 0,
    y: -20
  })

  const titleChars = titleRef.value?.querySelectorAll('.title-char') as NodeListOf<HTMLElement>
  const subtitleChars = subtitleRef.value?.querySelectorAll('.subtitle-char') as NodeListOf<HTMLElement>
  const footerChars = footerTextRef.value?.querySelectorAll('.footer-char') as NodeListOf<HTMLElement>

  gsap.set(titleChars, {
    y: 40,
    opacity: 0,
    rotateX: -90,
    transformOrigin: '50% 100%'
  })

  gsap.set(subtitleChars, {
    y: 25,
    opacity: 0,
    rotateX: -45
  })

  gsap.set(allCards, {
    y: 60,
    opacity: 0,
    scale: 0.9
  })

  const cardTitleChars: NodeListOf<HTMLElement>[] = allCards.map(card =>
    card.querySelectorAll('.card-title .char')
  )
  const cardDescChars: NodeListOf<HTMLElement>[] = allCards.map(card =>
    card.querySelectorAll('.card-desc .char')
  )
  const cardIndexChars: NodeListOf<HTMLElement>[] = allCards.map(card =>
    card.querySelectorAll('.index-char')
  )
  const cardTagChars: NodeListOf<HTMLElement>[] = allCards.map(card =>
    card.querySelectorAll('.tag-char')
  )

  gsap.set(cardTitleChars.flat(), { y: 20, opacity: 0, rotateX: -45 })
  gsap.set(cardDescChars.flat(), { y: 15, opacity: 0 })
  gsap.set(cardIndexChars.flat(), { y: 10, opacity: 0 })
  gsap.set(cardTagChars.flat(), { y: 8, opacity: 0, letterSpacing: '0px' })

  gsap.set([line1Ref.value, line2Ref.value], {
    scaleX: 0,
    transformOrigin: 'center'
  })

  tl.to(badgeRef.value, {
    opacity: 1,
    y: 0,
    duration: 0.4
  })

  tl.to(titleChars, {
    y: 0,
    opacity: 1,
    rotateX: 0,
    stagger: 0.04,
    duration: 0.6,
    ease: 'power4.out'
  }, '-=0.2')

  tl.to(subtitleChars, {
    y: 0,
    opacity: 1,
    rotateX: 0,
    stagger: 0.02,
    duration: 0.5,
    ease: 'power3.out'
  }, '-=0.3')

  allCards.forEach((card, cardIndex) => {
    const delay = cardIndex * 0.15

    tl.to(card, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.6,
      ease: 'power3.out'
    }, `-=${0.4 - cardIndex * 0.05}`)

    const indexChars = card.querySelectorAll('.index-char')
    tl.to(indexChars, {
      y: 0,
      opacity: 1,
      stagger: 0.05,
      duration: 0.4
    }, `-=${0.3}`)

    const titleChars = card.querySelectorAll('.card-title .char')
    tl.to(titleChars, {
      y: 0,
      opacity: 1,
      rotateX: 0,
      stagger: 0.03,
      duration: 0.5
    }, `-=${0.3}`)

    const descChars = card.querySelectorAll('.card-desc .char')
    tl.to(descChars, {
      y: 0,
      opacity: 1,
      stagger: 0.015,
      duration: 0.4
    }, `-=${0.25}`)

    const tagChars = card.querySelectorAll('.tag-char')
    tl.to(tagChars, {
      y: 0,
      opacity: 1,
      letterSpacing: '2px',
      stagger: 0.04,
      duration: 0.4
    }, `-=${0.2}`)
  })

  tl.to([line1Ref.value, line2Ref.value], {
    scaleX: 1,
    duration: 0.5,
    ease: 'power2.out'
  }, '-=0.3')

  tl.to(footerChars, {
    opacity: 1,
    stagger: 0.03,
    duration: 0.4
  }, `-=${0.3}`)

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
    rotationY: -10
  })

  scrollTl.to(allCards[1], {
    x: -35,
    y: 22,
    scale: 0.93,
    opacity: 0.8,
    rotationY: -5
  }, '-=0.4')

  scrollTl.to(allCards[2], {
    scale: 1.15,
    y: -35,
    zIndex: 10,
    rotationY: 0,
    textShadow: '0 0 30px rgba(236, 72, 153, 0.5)'
  }, '-=0.4')

  scrollTl.to(allCards[3], {
    x: 35,
    y: 22,
    scale: 0.93,
    opacity: 0.8,
    rotationY: 5
  }, '-=0.5')

  scrollTl.to(allCards[4], {
    x: 70,
    y: 45,
    scale: 0.85,
    opacity: 0.6,
    rotationY: 10
  }, '-=0.5')

  const continuousFloat = gsap.timeline({ paused: true })
  continuousFloat.to(allCards, {
    y: () => gsap.utils.random(-15, -5),
    rotationX: () => gsap.utils.random(-5, 5),
    rotationY: () => gsap.utils.random(-3, 3),
    duration: 3,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true,
    stagger: { each: 0.25, from: 'random' }
  })

  ScrollTrigger.create({
    trigger: containerRef.value,
    start: 'top 80%',
    onEnter: () => continuousFloat.play(),
    onLeave: () => continuousFloat.pause(),
    onEnterBack: () => continuousFloat.play(),
    onLeaveBack: () => continuousFloat.pause()
  })

  gsap.to(mesh1Ref.value, {
    x: 120,
    y: 60,
    rotation: 15,
    duration: 10,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true
  })

  gsap.to(mesh2Ref.value, {
    x: -100,
    y: -80,
    rotation: -20,
    duration: 12,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true
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
.card-time-typography {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #0f0f1a 0%, #1a1025 50%, #0f0f1a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

.typography-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.bg-mesh {
  position: absolute;
  width: 600px;
  height: 600px;
  opacity: 0.08;
  border-radius: 50%;

  &.mesh-1 {
    top: -200px;
    right: -200px;
    background: radial-gradient(circle, #ec4899, transparent);
    filter: blur(80px);
  }

  &.mesh-2 {
    bottom: -200px;
    left: -200px;
    background: radial-gradient(circle, #8b5cf6, transparent);
    filter: blur(80px);
  }
}

.bg-texture {
  position: absolute;
  inset: 0;
  opacity: 0.05;

  .texture-dot {
    position: absolute;
    width: 1px;
    height: 1px;
    background: #ffffff;
    border-radius: 50%;

    @for $i from 1 through 100 {
      &:nth-child(#{$i}) {
        left: #{$i % 10 * 10}%;
        top: #{floor($i / 10) * 10}%;
      }
    }
  }
}

.typography-content {
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

.typography-header {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  perspective: 800px;
}

.header-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: rgba(236, 72, 153, 0.9);
  letter-spacing: 3px;
  text-transform: uppercase;
  padding: 10px 24px;
  border: 1px solid rgba(236, 72, 153, 0.3);
  border-radius: 30px;
  background: rgba(236, 72, 153, 0.08);

  .badge-icon {
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 14px;
      height: 14px;
      color: #ec4899;
    }
  }
}

.typography-title {
  font-family: 'Space Grotesk', 'Inter', sans-serif;
  font-size: 72px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 8px;
  margin: 0;
  display: flex;
  perspective: 800px;

  .title-char {
    display: inline-block;
    background: linear-gradient(135deg, #ffffff 0%, #ec4899 50%, #8b5cf6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}

.typography-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 4px;
  margin: 0;
  perspective: 600px;

  .subtitle-word {
    display: inline-flex;
  }

  .subtitle-char {
    display: inline-block;
  }

  .word-space {
    display: inline-block;
    width: 0.4em;
  }
}

.cards-wrapper {
  display: flex;
  gap: 24px;
  perspective: 1500px;
  transform-style: preserve-3d;
}

.type-card {
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
    .card-title .char {
      text-shadow: 0 0 20px rgba(236, 72, 153, 0.5);
    }
  }
}

.card-inner {
  width: 100%;
  height: 100%;
  background: linear-gradient(175deg, rgba(30, 20, 45, 0.95), rgba(15, 10, 26, 0.98));
  backdrop-filter: blur(30px);
  border: 1px solid rgba(139, 92, 246, 0.15);
  border-radius: 20px;
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(139, 92, 246, 0.1);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-18px) rotateX(5deg) rotateY(-5deg);
    border-color: rgba(236, 72, 153, 0.3);
    box-shadow: 0 30px 80px rgba(236, 72, 153, 0.15);
  }
}

.card-index {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  font-weight: 700;
  color: rgba(236, 72, 153, 0.35);
  letter-spacing: 3px;
  margin-bottom: 16px;
  perspective: 400px;

  .index-char {
    display: inline-block;
  }
}

.card-title-wrap {
  margin-bottom: 12px;
  perspective: 500px;
}

.card-title {
  font-family: 'Space Grotesk', 'Inter', sans-serif;
  font-size: 26px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  letter-spacing: 1px;
  line-height: 1.2;
  perspective: 500px;

  .char {
    display: inline-block;
    transition: text-shadow 0.3s ease;
  }
}

.card-desc-wrap {
  flex-grow: 1;
  perspective: 400px;
}

.card-desc {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.7;
  margin: 0;
  perspective: 400px;

  .char {
    display: inline-block;
  }
}

.card-divider {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 20px 0 16px;

  .divider-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(236, 72, 153, 0.3), transparent);
  }

  .divider-diamond {
    width: 6px;
    height: 6px;
    background: #ec4899;
    transform: rotate(45deg);
  }
}

.card-tag-wrap {
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  font-weight: 600;
  color: #ec4899;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-top: auto;

  .tag-char {
    display: inline-block;
  }
}

.typography-footer {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-top: 10px;
}

.footer-line {
  width: 80px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.4), transparent);
}

.footer-text {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 400;
  color: rgba(139, 92, 246, 0.6);
  letter-spacing: 3px;
  text-transform: uppercase;

  .footer-char {
    display: inline-block;
  }
}

@media (max-width: 1200px) {
  .cards-wrapper {
    gap: 18px;
  }

  .type-card {
    width: 170px;
    height: 280px;
  }

  .typography-title {
    font-size: 56px;
    letter-spacing: 6px;
  }
}

@media (max-width: 900px) {
  .cards-wrapper {
    flex-wrap: wrap;
    justify-content: center;
    max-width: 400px;
  }

  .type-card {
    width: 150px;
    height: 250px;
  }

  .typography-title {
    font-size: 40px;
    letter-spacing: 4px;
  }
}
</style>
