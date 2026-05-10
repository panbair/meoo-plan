<template>
  <section class="card-time-luxe-drop">
    <div ref="containerRef" class="luxe-container">
      <div class="luxe-header">
        <div ref="titleRef" class="luxe-title">LUXE DROP</div>
        <div ref="subtitleRef" class="luxe-subtitle">
          <span>Premium Collection</span>
        </div>
      </div>

      <div class="cards-wrapper">
        <div ref="card1Ref" class="card-item" data-index="1">
          <div class="card-inner">
            <div class="card-number">01</div>
            <div class="card-title">Prestige</div>
            <div class="card-desc">Exclusive access to premium features and services</div>
            <div class="card-price">
              <span class="currency">$</span>
              <span class="amount">299</span>
              <span class="period">/mo</span>
            </div>
            <div class="card-badge">Best Value</div>
          </div>
        </div>

        <div ref="card2Ref" class="card-item" data-index="2">
          <div class="card-inner">
            <div class="card-number">02</div>
            <div class="card-title">Elite</div>
            <div class="card-desc">Unlimited access with priority support 24/7</div>
            <div class="card-price">
              <span class="currency">$</span>
              <span class="amount">599</span>
              <span class="period">/mo</span>
            </div>
            <div class="card-badge highlight">Popular</div>
          </div>
        </div>

        <div ref="card3Ref" class="card-item" data-index="3">
          <div class="card-inner featured">
            <div class="card-number">03</div>
            <div class="card-title">Supreme</div>
            <div class="card-desc">Full access with VIP concierge and exclusive events</div>
            <div class="card-price">
              <span class="currency">$</span>
              <span class="amount">999</span>
              <span class="period">/mo</span>
            </div>
            <div class="card-badge premium">Premium</div>
          </div>
        </div>

        <div ref="card4Ref" class="card-item" data-index="4">
          <div class="card-inner">
            <div class="card-number">04</div>
            <div class="card-title">Classic</div>
            <div class="card-desc">Essential features for individuals and small teams</div>
            <div class="card-price">
              <span class="currency">$</span>
              <span class="amount">149</span>
              <span class="period">/mo</span>
            </div>
            <div class="card-badge">Basic</div>
          </div>
        </div>

        <div ref="card5Ref" class="card-item" data-index="5">
          <div class="card-inner">
            <div class="card-number">05</div>
            <div class="card-title">Starter</div>
            <div class="card-desc">Get started with core features and community support</div>
            <div class="card-price">
              <span class="currency">$</span>
              <span class="amount">49</span>
              <span class="period">/mo</span>
            </div>
            <div class="card-badge">Free</div>
          </div>
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
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const card1Ref = ref<HTMLElement | null>(null)
const card2Ref = ref<HTMLElement | null>(null)
const card3Ref = ref<HTMLElement | null>(null)
const card4Ref = ref<HTMLElement | null>(null)
const card5Ref = ref<HTMLElement | null>(null)

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
    defaults: { ease: 'back.out(1.7)' },
    paused: true
  })

  gsap.set(cards, {
    opacity: 0,
    y: -100,
    scale: 0.9
  })

  gsap.set([titleRef.value, subtitleRef.value], {
    opacity: 0,
    y: -30
  })

  tl.to([titleRef.value, subtitleRef.value], {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: 'power3.out'
  })

  tl.to(cards, {
    opacity: 1,
    y: 0,
    scale: 1,
    stagger: 0.14,
    duration: 0.7
  }, '-=0.3')

  tl.to(cards, {
    scale: 1.04,
    duration: 0.25,
    stagger: 0.1,
    ease: 'power2.inOut'
  })

  tl.to(cards, {
    scale: 1,
    duration: 0.3,
    stagger: 0.1
  })

  tl.play()

  const scrollTl = gsap.timeline({
    scrollTrigger: {
      trigger: containerRef.value,
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1.5
    }
  })

  scrollTl.to(cards[0], {
    x: -30,
    rotate: -3,
    opacity: 0.7,
    duration: 0.5
  })

  scrollTl.to(cards[1], {
    x: -15,
    rotate: -1.5,
    opacity: 0.85,
    duration: 0.5
  }, '-=0.4')

  scrollTl.to(cards[2], {
    scale: 1.08,
    y: -20,
    boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
    duration: 0.5
  }, '-=0.4')

  scrollTl.to(cards[3], {
    x: 15,
    rotate: 1.5,
    opacity: 0.85,
    duration: 0.5
  }, '-=0.5')

  scrollTl.to(cards[4], {
    x: 30,
    rotate: 3,
    opacity: 0.7,
    duration: 0.5
  }, '-=0.5')

  const stCleanup = ScrollTrigger.create({
    trigger: containerRef.value,
    start: 'top 80%',
    end: 'top 20%',
    scrub: 1.5,
    onLeave: () => {
      gsap.to(cards, {
        y: -15,
        duration: 1.5,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        stagger: {
          each: 0.1,
          from: 'center'
        }
      })
    }
  })

  const continuousTl = gsap.timeline({ paused: true })

  continuousTl.to(cards, {
    x: gsap.utils.wrap([20, 10, 0, -10, -20]),
    duration: 2.5,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true,
    stagger: {
      each: 0.15,
      from: 'edges'
    }
  })

  const titleStCleanup = ScrollTrigger.create({
    trigger: titleRef.value,
    start: 'top 85%',
    onEnter: () => {
      gsap.to(titleRef.value, {
        filter: 'blur(8px)',
        opacity: 0,
        duration: 0.6,
        ease: 'power2.in'
      })
    },
    onLeaveBack: () => {
      gsap.to(titleRef.value, {
        filter: 'blur(0px)',
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out'
      })
    }
  })

  cleanupFns.push(
    () => {
      tl.kill()
      scrollTl.kill()
      continuousTl.kill()
      titleStCleanup.kill()
      stCleanup.kill()
    }
  )
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style lang="scss" scoped>
.card-time-luxe-drop {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(circle at 20% 80%, rgba(233, 69, 96, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(67, 97, 238, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
}

.luxe-container {
  width: 100%;
  max-width: 1400px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 60px;
}

.luxe-header {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.luxe-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 56px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 12px;
  text-transform: uppercase;
  background: linear-gradient(135deg, #e94560, #4361ee, #7209b7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 60px rgba(233, 69, 96, 0.3);
}

.luxe-subtitle {
  font-family: 'Montserrat', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 6px;
  text-transform: uppercase;
  padding: 8px 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.05);
}

.cards-wrapper {
  display: flex;
  gap: 24px;
  perspective: 1200px;
  transform-style: preserve-3d;
}

.card-item {
  width: 200px;
  height: 320px;
  position: relative;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  cursor: pointer;
  z-index: 1;

  &:nth-child(1),
  &:nth-child(5) {
    transform: translateY(20px) scale(0.95);
    z-index: 1;
  }

  &:nth-child(2),
  &:nth-child(4) {
    transform: translateY(10px) scale(0.98);
    z-index: 2;
  }

  &:nth-child(3) {
    transform: translateY(0) scale(1.02);
    z-index: 5;
  }
}

.card-inner {
  width: 100%;
  height: 100%;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 24px;
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #e94560, #4361ee, #7209b7);
    border-radius: 24px 24px 0 0;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-12px);
    border-color: rgba(233, 69, 96, 0.5);
    box-shadow:
      0 20px 60px rgba(233, 69, 96, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);

    &::before {
      opacity: 1;
    }

    .card-title {
      color: #e94560;
    }
  }

  &.featured {
    background: linear-gradient(145deg, rgba(233, 69, 96, 0.2), rgba(67, 97, 238, 0.2));
    border-color: rgba(233, 69, 96, 0.4);
    box-shadow:
      0 12px 40px rgba(233, 69, 96, 0.25),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);

    &::before {
      opacity: 1;
      background: linear-gradient(90deg, #e94560, #7209b7);
    }

    .card-number {
      color: #e94560;
    }

    .card-title {
      background: linear-gradient(135deg, #e94560, #7209b7);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }
}

.card-number {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 48px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.15);
  position: absolute;
  top: 16px;
  right: 20px;
  line-height: 1;
}

.card-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 22px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 12px;
  margin-top: 24px;
  transition: color 0.3s ease;
}

.card-desc {
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
  margin-bottom: 20px;
  flex-grow: 1;
}

.card-price {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 2px;
  margin-bottom: 16px;

  .currency {
    font-family: 'Montserrat', sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.7);
  }

  .amount {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 36px;
    font-weight: 700;
    color: #ffffff;
    line-height: 1;
  }

  .period {
    font-family: 'Montserrat', sans-serif;
    font-size: 12px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.5);
    margin-left: 4px;
  }
}

.card-badge {
  font-family: 'Montserrat', sans-serif;
  font-size: 10px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  padding: 6px 16px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-transform: uppercase;
  letter-spacing: 1px;

  &.highlight {
    background: linear-gradient(135deg, #4361ee, #7209b7);
    border-color: transparent;
    color: #ffffff;
  }

  &.premium {
    background: linear-gradient(135deg, #e94560, #7209b7);
    border-color: transparent;
    color: #ffffff;
  }
}

@media (max-width: 1200px) {
  .cards-wrapper {
    gap: 16px;
  }

  .card-item {
    width: 170px;
    height: 280px;
  }
}

@media (max-width: 900px) {
  .cards-wrapper {
    flex-wrap: wrap;
    justify-content: center;
    max-width: 400px;
  }

  .card-item {
    width: 160px;
    height: 260px;
    transform: none !important;
  }

  .luxe-title {
    font-size: 36px;
    letter-spacing: 6px;
  }
}
</style>
