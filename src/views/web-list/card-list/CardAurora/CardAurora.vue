<template>
  <div class="card-aurora">
    <div ref="bgRef" class="aurora-bg">
      <div class="aurora-wave wave-1"></div>
      <div class="aurora-wave wave-2"></div>
      <div class="aurora-wave wave-3"></div>
      <div class="stars"></div>
    </div>

    <div class="aurora-content">
      <div ref="titleRef" class="aurora-title">
        <span class="title-en">AURORA</span>
        <span class="title-cn">极光之舞</span>
      </div>

      <div ref="cardsWrapRef" class="aurora-cards">
        <div
          v-for="(card, index) in auroraCards"
          :key="index"
          :ref="el => cardRefs[index] = el as HTMLElement"
          class="aurora-item"
        >
          <div class="item-icon">
            <svg viewBox="0 0 100 100" class="icon-svg">
              <circle cx="50" cy="50" r="40" class="icon-ring ring-1" />
              <circle cx="50" cy="50" r="28" class="icon-ring ring-2" />
              <circle cx="50" cy="50" r="16" class="icon-core" />
            </svg>
          </div>
          <div class="item-num">{{ card.num }}</div>
          <div class="item-title">{{ card.title }}</div>
          <div class="item-desc">{{ card.desc }}</div>
          <div class="item-line"></div>
        </div>
      </div>
    </div>

    <div ref="cornerRef" class="corner-decor top-left"></div>
    <div ref="cornerRef2" class="corner-decor bottom-right"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []

const bgRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const cardsWrapRef = ref<HTMLElement | null>(null)
const cardRefs = ref<(HTMLElement | null)[]>([])
const cornerRef = ref<HTMLElement | null>(null)
const cornerRef2 = ref<HTMLElement | null>(null)

const auroraCards = [
  { num: '01', title: '光带形成', desc: '太阳粒子与大气碰撞' },
  { num: '02', title: '磁场舞动', desc: '极光随磁力线摆动' },
  { num: '03', title: '色彩变幻', desc: '不同气体的发光反应' },
  { num: '04', title: '极光风暴', desc: '绚烂的宇宙光影秀' }
]

const initAnimations = () => {
  const tl = gsap.timeline()

  // Background aurora waves
  const waves = bgRef.value?.querySelectorAll('.aurora-wave')
  waves?.forEach((wave, i) => {
    tl.fromTo(wave,
      { scaleX: 0, opacity: 0 },
      { scaleX: 1, opacity: 0.6, duration: 1.5, ease: 'power2.out' },
      i * 0.2
    )
    cleanupFns.push(() => {
      gsap.to(wave, { clearProps: 'all' })
    })
  })

  // Stars
  const stars = bgRef.value?.querySelectorAll('.star')
  stars?.forEach((star, i) => {
    tl.fromTo(star,
      { opacity: 0, scale: 0 },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' },
      0.3 + i * 0.05
    )
  })

  // Title
  if (titleRef.value) {
    tl.fromTo(titleRef.value,
      { x: 200, scale: 0.6, opacity: 0, filter: 'blur(10px)' },
      { x: 0, scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: 'back.out(1.5)' }
    )
    cleanupFns.push(() => {
      gsap.set(titleRef.value, { clearProps: 'all' })
    })
  }

  // Cards with zoom-in-left
  cardRefs.value.forEach((card, i) => {
    if (!card) return

    tl.fromTo(card,
      { x: 200, scale: 0.6, opacity: 0, filter: 'blur(12px)' },
      { x: 0, scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: 'back.out(1.5)' },
      0.4 + i * 0.15
    )

    // Hover animation
    const handleEnter = () => {
      gsap.to(card, {
        y: -8,
        scale: 1.02,
        boxShadow: '0 20px 60px rgba(0, 255, 200, 0.3)',
        duration: 0.3,
        ease: 'power2.out'
      })
    }

    const handleLeave = () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
        duration: 0.3,
        ease: 'power2.out'
      })
    }

    card.addEventListener('mouseenter', handleEnter)
    card.addEventListener('mouseleave', handleLeave)

    cleanupFns.push(() => {
      card.removeEventListener('mouseenter', handleEnter)
      card.removeEventListener('mouseleave', handleLeave)
      gsap.set(card, { clearProps: 'all' })
    })
  })

  // Corner decorations
  if (cornerRef.value) {
    tl.fromTo(cornerRef.value,
      { x: -100, y: -100, opacity: 0 },
      { x: 0, y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
      0.2
    )
    cleanupFns.push(() => {
      gsap.set(cornerRef.value, { clearProps: 'all' })
    })
  }

  if (cornerRef2.value) {
    tl.fromTo(cornerRef2.value,
      { x: 100, y: 100, opacity: 0 },
      { x: 0, y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
      0.3
    )
    cleanupFns.push(() => {
      gsap.set(cornerRef2.value, { clearProps: 'all' })
    })
  }

  // ScrollTrigger for cards
  cardRefs.value.forEach((card) => {
    if (!card) return

    const st = ScrollTrigger.create({
      trigger: card,
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1.5,
      onUpdate: (self) => {
        gsap.set(card, {
          x: -200 * self.progress,
          scale: 1 - self.progress * 0.8,
          opacity: Math.max(0, 1 - self.progress * 2),
          filter: `blur(${self.progress * 8}px)`
        })
      }
    })
    cleanupFns.push(() => st.kill())
  })

  // ScrollTrigger for title
  if (titleRef.value) {
    const st = ScrollTrigger.create({
      trigger: titleRef.value,
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1.5,
      onUpdate: (self) => {
        gsap.set(titleRef.value, {
          x: -150 * self.progress,
          opacity: Math.max(0, 1 - self.progress * 2)
        })
      }
    })
    cleanupFns.push(() => st.kill())
  }
}

onMounted(() => {
  initAnimations()
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style lang="scss" scoped>
.card-aurora {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #0a0a1a 0%, #0d1a2d 50%, #0a1a2a 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.aurora-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.aurora-wave {
  position: absolute;
  width: 200%;
  height: 60%;
  top: 10%;
  left: -50%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(0, 255, 200, 0.15) 25%,
    rgba(100, 200, 255, 0.2) 50%,
    rgba(150, 100, 255, 0.15) 75%,
    transparent 100%
  );
  transform-origin: center;
  filter: blur(40px);
  animation: waveFloat 8s ease-in-out infinite;

  &.wave-1 {
    top: 5%;
    animation-delay: 0s;
    opacity: 0.6;
  }

  &.wave-2 {
    top: 35%;
    animation-delay: -3s;
    opacity: 0.4;
    transform: scaleY(0.7);
  }

  &.wave-3 {
    top: 60%;
    animation-delay: -5s;
    opacity: 0.3;
    transform: scaleY(0.5);
  }
}

@keyframes waveFloat {
  0%, 100% { transform: translateX(-5%) rotate(-2deg); }
  50% { transform: translateX(5%) rotate(2deg); }
}

.stars {
  position: absolute;
  inset: 0;
}

:global(.star) {
  position: absolute;
  width: 3px;
  height: 3px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
  animation: twinkle 3s ease-in-out infinite;
}

@keyframes twinkle {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

.aurora-content {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 60px;
}

.aurora-title {
  margin-bottom: 80px;

  .title-en {
    display: block;
    font-family: 'Orbitron', sans-serif;
    font-size: 72px;
    font-weight: 900;
    letter-spacing: 30px;
    background: linear-gradient(135deg, #00ffc8, #00ff88, #00ccff, #8800ff);
    background-size: 300% 300%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: gradientShift 5s ease infinite;
    text-shadow: 0 0 60px rgba(0, 255, 200, 0.5);
  }

  .title-cn {
    display: block;
    font-family: 'Noto Sans SC', sans-serif;
    font-size: 28px;
    font-weight: 300;
    letter-spacing: 15px;
    color: rgba(0, 255, 200, 0.7);
    margin-top: 15px;
  }
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.aurora-cards {
  display: flex;
  gap: 40px;
  justify-content: center;
  flex-wrap: wrap;
}

.aurora-item {
  position: relative;
  width: 240px;
  padding: 40px 30px;
  background: rgba(0, 20, 30, 0.6);
  border: 1px solid rgba(0, 255, 200, 0.2);
  border-radius: 20px;
  backdrop-filter: blur(20px);
  transition: border-color 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: 20px;
    background: linear-gradient(135deg, rgba(0, 255, 200, 0.3), transparent, rgba(0, 200, 255, 0.3));
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    border-color: rgba(0, 255, 200, 0.5);

    &::before {
      opacity: 1;
    }

    .icon-ring {
      animation-play-state: running;
    }
  }
}

.item-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 25px;
}

.icon-svg {
  width: 100%;
  height: 100%;
}

.icon-ring {
  fill: none;
  stroke-width: 2;
  transform-origin: center;
  transform: rotate(-90deg);

  &.ring-1 {
    stroke: url(#auroraGradient);
    stroke-dasharray: 251;
    animation: ringRotate 4s linear infinite;
  }

  &.ring-2 {
    stroke: rgba(0, 255, 200, 0.5);
    stroke-dasharray: 176;
    animation: ringRotate 3s linear infinite reverse;
  }
}

.icon-core {
  fill: url(#auroraGradient);
  filter: drop-shadow(0 0 10px rgba(0, 255, 200, 0.8));
}

@keyframes ringRotate {
  from { transform: rotate(-90deg); }
  to { transform: rotate(270deg); }
}

.item-num {
  font-family: 'Orbitron', sans-serif;
  font-size: 48px;
  font-weight: 700;
  color: rgba(0, 255, 200, 0.15);
  margin-bottom: 10px;
}

.item-title {
  font-size: 24px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 12px;
  text-shadow: 0 0 20px rgba(0, 255, 200, 0.3);
}

.item-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
}

.item-line {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(0, 255, 200, 0.5), transparent);
  border-radius: 1px;
}

.corner-decor {
  position: absolute;
  width: 200px;
  height: 200px;
  pointer-events: none;

  &.top-left {
    top: -50px;
    left: -50px;
    background: radial-gradient(circle at center, rgba(0, 255, 200, 0.2) 0%, transparent 70%);
  }

  &.bottom-right {
    bottom: -50px;
    right: -50px;
    background: radial-gradient(circle at center, rgba(150, 100, 255, 0.2) 0%, transparent 70%);
  }
}

svg {
  position: absolute;
  width: 0;
  height: 0;
}
</style>
