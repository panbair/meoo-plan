<template>
  <div class="card-eclipse">
    <div ref="bgRef" class="eclipse-bg">
      <div class="sun"></div>
      <div class="corona corona-1"></div>
      <div class="corona corona-2"></div>
      <div class="corona corona-3"></div>
      <div class="particles"></div>
    </div>

    <div class="eclipse-content">
      <div ref="titleRef" class="eclipse-title">
        <span class="title-en">ECLIPSE</span>
        <span class="title-cn">日食奇观</span>
      </div>

      <div ref="cardsWrapRef" class="eclipse-cards">
        <div
          v-for="(card, index) in eclipseCards"
          :key="index"
          :ref="el => cardRefs[index] = el as HTMLElement"
          class="eclipse-item"
        >
          <div class="item-icon">
            <div class="orbit-container">
              <div class="orbit orbit-1"></div>
              <div class="orbit orbit-2"></div>
              <div class="orbit orbit-3"></div>
              <div class="core"></div>
            </div>
          </div>
          <div class="item-num">{{ card.num }}</div>
          <div class="item-title">{{ card.title }}</div>
          <div class="item-desc">{{ card.desc }}</div>
          <div class="item-glow"></div>
        </div>
      </div>
    </div>

    <div ref="lineRef1" class="light-ray ray-1"></div>
    <div ref="lineRef2" class="light-ray ray-2"></div>
    <div ref="lineRef3" class="light-ray ray-3"></div>
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
const cardRefs = ref<(HTMLElement | null)[]>([])
const lineRef1 = ref<HTMLElement | null>(null)
const lineRef2 = ref<HTMLElement | null>(null)
const lineRef3 = ref<HTMLElement | null>(null)

const eclipseCards = [
  { num: '01', title: '初亏', desc: '月球开始遮盖太阳' },
  { num: '02', title: '食既', desc: '太阳完全被月球遮挡' },
  { num: '03', title: '生光', desc: '月球开始离开太阳' },
  { num: '04', title: '复圆', desc: '太阳恢复完整圆形' }
]

const initAnimations = () => {
  const tl = gsap.timeline()

  // Sun
  const sun = bgRef.value?.querySelector('.sun')
  if (sun) {
    tl.fromTo(sun,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.2, ease: 'elastic.out(1, 0.5)' }
    )
    cleanupFns.push(() => gsap.set(sun, { clearProps: 'all' }))
  }

  // Coronas
  const coronas = bgRef.value?.querySelectorAll('.corona')
  coronas?.forEach((corona, i) => {
    tl.fromTo(corona,
      { scale: 0.5, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1, ease: 'power2.out' },
      0.3 + i * 0.15
    )
    cleanupFns.push(() => gsap.set(corona, { clearProps: 'all' }))
  })

  // Particles
  const particles = bgRef.value?.querySelectorAll('.particle')
  particles?.forEach((p, i) => {
    tl.fromTo(p,
      { opacity: 0, scale: 0 },
      { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2)' },
      0.5 + i * 0.03
    )
  })

  // Title with zoom-out
  if (titleRef.value) {
    tl.fromTo(titleRef.value,
      { scale: 1.2, opacity: 0, filter: 'blur(10px)' },
      { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: 'back.out(1.5)' }
    )
    cleanupFns.push(() => gsap.set(titleRef.value, { clearProps: 'all' }))
  }

  // Cards with zoom-out
  cardRefs.value.forEach((card, i) => {
    if (!card) return

    tl.fromTo(card,
      { scale: 1.2, opacity: 0, filter: 'blur(12px)' },
      { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: 'back.out(1.5)' },
      0.4 + i * 0.15
    )

    // Hover animation
    const handleEnter = () => {
      gsap.to(card, {
        scale: 1.05,
        boxShadow: '0 25px 80px rgba(255, 180, 0, 0.4)',
        duration: 0.4,
        ease: 'power2.out'
      })
      gsap.to(card.querySelector('.core'), {
        scale: 1.3,
        duration: 0.4
      })
    }

    const handleLeave = () => {
      gsap.to(card, {
        scale: 1,
        boxShadow: '0 15px 50px rgba(0, 0, 0, 0.3)',
        duration: 0.4,
        ease: 'power2.out'
      })
      gsap.to(card.querySelector('.core'), {
        scale: 1,
        duration: 0.4
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

  // Light rays
  ;[lineRef1.value, lineRef2.value, lineRef3.value].forEach((ray, i) => {
    if (!ray) return
    tl.fromTo(ray,
      { scaleX: 0, opacity: 0 },
      { scaleX: 1, opacity: 1, duration: 0.8, ease: 'power2.out' },
      0.6 + i * 0.2
    )
    cleanupFns.push(() => gsap.set(ray, { clearProps: 'all' }))
  })

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
          scale: 1 + self.progress * 0.5,
          opacity: Math.max(0, 1 - self.progress * 2.5),
          filter: `blur(${self.progress * 12}px)`
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
          scale: 1 + self.progress * 0.3,
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
})
</script>

<style lang="scss" scoped>
.card-eclipse {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(180deg, #0a0a0f 0%, #1a1a2e 50%, #0f0f1a 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.eclipse-bg {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sun {
  position: absolute;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, #fff9e6 0%, #ffd700 30%, #ff8c00 60%, #ff4500 100%);
  border-radius: 50%;
  box-shadow:
    0 0 60px #ffd700,
    0 0 120px rgba(255, 140, 0, 0.6),
    0 0 200px rgba(255, 69, 0, 0.4);
}

.corona {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;

  &.corona-1 {
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(255, 200, 100, 0.3) 0%, transparent 70%);
    animation: coronaPulse 4s ease-in-out infinite;
  }

  &.corona-2 {
    width: 550px;
    height: 550px;
    background: radial-gradient(circle, rgba(255, 150, 50, 0.2) 0%, transparent 70%);
    animation: coronaPulse 5s ease-in-out infinite reverse;
  }

  &.corona-3 {
    width: 700px;
    height: 700px;
    background: radial-gradient(circle, rgba(255, 100, 0, 0.1) 0%, transparent 70%);
    animation: coronaPulse 6s ease-in-out infinite;
  }
}

@keyframes coronaPulse {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 1; }
}

.particles {
  position: absolute;
  inset: 0;
}

:global(.particle) {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 215, 0, 0.8);
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.6);
  animation: particleFloat 6s ease-in-out infinite;
}

@keyframes particleFloat {
  0%, 100% { transform: translateY(0) scale(1); opacity: 0.6; }
  50% { transform: translateY(-20px) scale(1.2); opacity: 1; }
}

.eclipse-content {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 60px;
}

.eclipse-title {
  margin-bottom: 80px;

  .title-en {
    display: block;
    font-family: 'Orbitron', sans-serif;
    font-size: 80px;
    font-weight: 900;
    letter-spacing: 25px;
    background: linear-gradient(180deg, #ffffff 0%, #ffd700 50%, #ff8c00 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 0 80px rgba(255, 200, 0, 0.6);
    filter: drop-shadow(0 0 30px rgba(255, 150, 0, 0.5));
  }

  .title-cn {
    display: block;
    font-family: 'Noto Sans SC', sans-serif;
    font-size: 32px;
    font-weight: 300;
    letter-spacing: 20px;
    color: rgba(255, 200, 100, 0.8);
    margin-top: 15px;
  }
}

.eclipse-cards {
  display: flex;
  gap: 35px;
  justify-content: center;
  flex-wrap: wrap;
}

.eclipse-item {
  position: relative;
  width: 220px;
  padding: 35px 25px;
  background: rgba(20, 15, 10, 0.7);
  border: 1px solid rgba(255, 180, 50, 0.25);
  border-radius: 20px;
  backdrop-filter: blur(15px);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: conic-gradient(
      from 0deg,
      transparent 0deg,
      rgba(255, 200, 100, 0.1) 60deg,
      transparent 120deg
    );
    animation: rotateBg 8s linear infinite;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 1px;
    background: rgba(20, 15, 10, 0.9);
    border-radius: 19px;
    z-index: -1;
  }
}

@keyframes rotateBg {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.item-icon {
  width: 70px;
  height: 70px;
  margin: 0 auto 20px;
}

.orbit-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.orbit {
  position: absolute;
  border: 1px solid rgba(255, 180, 50, 0.4);
  border-radius: 50%;
  animation: orbitSpin 6s linear infinite;

  &.orbit-1 {
    inset: 0;
    animation-duration: 8s;
  }

  &.orbit-2 {
    inset: 15px;
    animation-duration: 6s;
    animation-direction: reverse;
  }

  &.orbit-3 {
    inset: 30px;
    animation-duration: 4s;
  }
}

@keyframes orbitSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.core {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  background: radial-gradient(circle, #ffd700 0%, #ff8c00 100%);
  border-radius: 50%;
  box-shadow: 0 0 20px rgba(255, 200, 0, 0.8);
}

.item-num {
  font-family: 'Orbitron', sans-serif;
  font-size: 42px;
  font-weight: 700;
  color: rgba(255, 180, 50, 0.12);
  margin-bottom: 8px;
}

.item-title {
  font-size: 22px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 10px;
  text-shadow: 0 0 15px rgba(255, 180, 0, 0.4);
}

.item-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.5;
}

.item-glow {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 3px;
  background: linear-gradient(90deg, transparent, #ffd700, transparent);
  border-radius: 2px;
}

.light-ray {
  position: absolute;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255, 200, 100, 0.6), transparent);
  transform-origin: center;

  &.ray-1 {
    top: 20%;
    left: 5%;
    width: 25%;
    transform: rotate(-15deg);
  }

  &.ray-2 {
    bottom: 25%;
    right: 5%;
    width: 20%;
    transform: rotate(10deg);
  }

  &.ray-3 {
    top: 60%;
    left: 10%;
    width: 15%;
    transform: rotate(-5deg);
  }
}
</style>
