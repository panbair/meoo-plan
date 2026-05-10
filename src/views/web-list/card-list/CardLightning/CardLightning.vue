<template>
  <div class="card-lightning">
    <div ref="bgRef" class="lightning-bg">
      <div class="storm-clouds">
        <div class="cloud cloud-1"></div>
        <div class="cloud cloud-2"></div>
        <div class="cloud cloud-3"></div>
      </div>
      <div class="lightning-bolts">
        <div class="bolt bolt-1"></div>
        <div class="bolt bolt-2"></div>
        <div class="bolt bolt-3"></div>
      </div>
      <div class="rain-container"></div>
    </div>

    <div class="lightning-content">
      <div ref="titleRef" class="lightning-title">
        <span class="title-en">LIGHTNING</span>
        <span class="title-cn">闪电风暴</span>
      </div>

      <div ref="cardsWrapRef" class="lightning-cards">
        <div
          v-for="(card, index) in lightningCards"
          :key="index"
          :ref="el => cardRefs[index] = el as HTMLElement"
          class="lightning-item"
        >
          <div class="item-icon">
            <div class="spark-container">
              <div class="spark-line line-1"></div>
              <div class="spark-line line-2"></div>
              <div class="spark-line line-3"></div>
              <div class="spark-line line-4"></div>
              <div class="spark-core"></div>
            </div>
          </div>
          <div class="item-num">{{ card.num }}</div>
          <div class="item-title">{{ card.title }}</div>
          <div class="item-desc">{{ card.desc }}</div>
          <div class="item-voltage">
            <div class="voltage-bar" :style="{ '--volt': card.volt }"></div>
            <span class="voltage-label">{{ card.volt }}kV</span>
          </div>
        </div>
      </div>
    </div>

    <div ref="flashRef" class="flash-overlay"></div>
    <div ref="staticRef" class="static-noise"></div>
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
const flashRef = ref<HTMLElement | null>(null)
const staticRef = ref<HTMLElement | null>(null)

const lightningCards = [
  { num: '01', title: '云闪', desc: '云层内部电荷的释放', volt: '10' },
  { num: '02', title: '地闪', desc: '云与地面之间的放电', volt: '100' },
  { num: '03', title: '球闪', desc: '罕见的球形闪电现象', volt: '50' },
  { num: '04', title: '超级闪电', desc: '超出普通闪电百倍', volt: '1000' }
]

let lightningInterval: ReturnType<typeof setInterval> | null = null

const initAnimations = () => {
  const tl = gsap.timeline()

  // Clouds
  const clouds = bgRef.value?.querySelectorAll('.cloud')
  clouds?.forEach((cloud, i) => {
    tl.fromTo(cloud,
      { x: '-100%', opacity: 0 },
      { x: '0%', opacity: 1, duration: 2, ease: 'power1.out' },
      i * 0.4
    )
    cleanupFns.push(() => gsap.set(cloud, { clearProps: 'all' }))
  })

  // Lightning bolts
  const bolts = bgRef.value?.querySelectorAll('.bolt')
  bolts?.forEach((bolt, i) => {
    tl.fromTo(bolt,
      { scaleY: 0, opacity: 0 },
      { scaleY: 1, opacity: 1, duration: 0.1 },
      0.8 + i * 0.3
    )
  })

  // Rain
  const raindrops = bgRef.value?.querySelectorAll('.raindrop')
  raindrops?.forEach((drop, i) => {
    tl.fromTo(drop,
      { y: -20, opacity: 0 },
      { y: window.innerHeight + 20, opacity: 0.6, duration: 0.8 + Math.random() * 0.4, ease: 'linear' },
      0.5 + i * 0.02
    )
  })

  // Flash overlay
  if (flashRef.value) {
    tl.fromTo(flashRef.value,
      { opacity: 0 },
      { opacity: 0.8, duration: 0.05 },
      1
    )
    tl.to(flashRef.value, { opacity: 0, duration: 0.1 })
    cleanupFns.push(() => gsap.set(flashRef.value, { clearProps: 'all' }))
  }

  // Static noise
  if (staticRef.value) {
    tl.fromTo(staticRef.value,
      { opacity: 0 },
      { opacity: 0.15, duration: 0.8, ease: 'power2.out' },
      0.6
    )
    cleanupFns.push(() => gsap.set(staticRef.value, { clearProps: 'all' }))
  }

  // Title with zoom-out-left
  if (titleRef.value) {
    tl.fromTo(titleRef.value,
      { x: 200, scale: 1.2, opacity: 0, filter: 'blur(10px)' },
      { x: 0, scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: 'back.out(1.5)' }
    )
    cleanupFns.push(() => gsap.set(titleRef.value, { clearProps: 'all' }))
  }

  // Cards with zoom-out-left
  cardRefs.value.forEach((card, i) => {
    if (!card) return

    tl.fromTo(card,
      { x: 200, scale: 1.2, opacity: 0, filter: 'blur(12px)' },
      { x: 0, scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: 'back.out(1.5)' },
      0.4 + i * 0.15
    )

    // Hover animation
    const handleEnter = () => {
      gsap.to(card, {
        y: -10,
        scale: 1.04,
        boxShadow: '0 30px 80px rgba(255, 255, 100, 0.4)',
        duration: 0.3,
        ease: 'power2.out'
      })
      // Spark effect on hover
      if (flashRef.value) {
        gsap.to(flashRef.value, {
          opacity: 0.3,
          duration: 0.05,
          yoyo: true,
          repeat: 1
        })
      }
    }

    const handleLeave = () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        boxShadow: '0 15px 50px rgba(0, 0, 0, 0.3)',
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
          scale: 1 + self.progress * 0.4,
          opacity: Math.max(0, 1 - self.progress * 2.2),
          filter: `blur(${self.progress * 10}px)`
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

  // Random lightning flash effect
  lightningInterval = setInterval(() => {
    if (Math.random() > 0.7 && flashRef.value) {
      gsap.to(flashRef.value, {
        opacity: 0.6,
        duration: 0.05,
        ease: 'none',
        onComplete: () => {
          gsap.to(flashRef.value, { opacity: 0, duration: 0.15 })
        }
      })
    }
  }, 3000)
}

onMounted(() => {
  initAnimations()
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  if (lightningInterval) clearInterval(lightningInterval)
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style lang="scss" scoped>
.card-lightning {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(180deg, #0a0a15 0%, #151525 50%, #0d0d1a 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightning-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.storm-clouds {
  position: absolute;
  inset: 0;
}

.cloud {
  position: absolute;
  background: linear-gradient(180deg, rgba(40, 40, 60, 0.9) 0%, rgba(30, 30, 50, 0.6) 100%);
  border-radius: 50%;
  filter: blur(40px);

  &.cloud-1 {
    width: 80%;
    height: 40%;
    top: -5%;
    left: -10%;
    animation: cloudMove 20s ease-in-out infinite;
  }

  &.cloud-2 {
    width: 70%;
    height: 35%;
    top: -10%;
    left: 20%;
    animation: cloudMove 25s ease-in-out infinite reverse;
  }

  &.cloud-3 {
    width: 60%;
    height: 30%;
    top: 0%;
    right: -10%;
    animation: cloudMove 18s ease-in-out infinite;
    animation-delay: -5s;
  }
}

@keyframes cloudMove {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(10%); }
}

.lightning-bolts {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.bolt {
  position: absolute;
  width: 4px;
  background: linear-gradient(180deg, #fff9c4 0%, #ffee58 30%, #ffd54f 100%);
  box-shadow:
    0 0 20px #ffee58,
    0 0 40px rgba(255, 238, 88, 0.6),
    0 0 60px rgba(255, 213, 79, 0.4);
  transform-origin: top center;
  clip-path: polygon(50% 0%, 40% 30%, 60% 35%, 30% 60%, 70% 65%, 20% 100%, 80% 100%, 70% 65%, 60% 60%, 65% 35%, 55% 30%);

  &.bolt-1 {
    left: 20%;
    height: 50%;
    top: 15%;
    animation: boltFlash 4s ease-in-out infinite;
  }

  &.bolt-2 {
    left: 70%;
    height: 60%;
    top: 10%;
    animation: boltFlash 5s ease-in-out infinite;
    animation-delay: -2s;
  }

  &.bolt-3 {
    left: 45%;
    height: 45%;
    top: 20%;
    animation: boltFlash 6s ease-in-out infinite;
    animation-delay: -3.5s;
  }
}

@keyframes boltFlash {
  0%, 100% { opacity: 0; }
  5% { opacity: 1; }
  10% { opacity: 0.3; }
  15% { opacity: 1; }
  20% { opacity: 0; }
}

.rain-container {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

:global(.raindrop) {
  position: absolute;
  width: 2px;
  height: 20px;
  background: linear-gradient(180deg, transparent, rgba(150, 180, 255, 0.4));
  animation: rainfall linear infinite;

  $durations: 0.3s, 0.5s, 0.7s, 0.4s, 0.6s, 0.8s, 0.45s, 0.55s, 0.65s, 0.75s,
                0.35s, 0.6s, 0.5s, 0.7s, 0.4s, 0.55s, 0.75s, 0.45s, 0.65s, 0.8s,
                0.5s, 0.7s, 0.4s, 0.6s, 0.8s, 0.45s, 0.55s, 0.65s, 0.75s, 0.35s,
                0.6s, 0.5s, 0.7s, 0.4s, 0.8s, 0.55s, 0.45s, 0.75s, 0.65s, 0.3s;

  $delays: -0.3s, -0.5s, -1.2s, -0.7s, -1.5s, -0.4s, -0.9s, -1.8s, -0.6s, -1.1s,
           -0.2s, -1.3s, -0.8s, -1.6s, -0.5s, -1.0s, -1.4s, -0.3s, -1.7s, -0.1s,
           -1.9s, -0.6s, -1.2s, -0.4s, -0.8s, -1.5s, -0.2s, -1.0s, -0.7s, -1.3s,
           -0.9s, -1.1s, -0.1s, -1.8s, -0.5s, -1.6s, -1.4s, -0.3s, -0.2s, -1.7s;

  @for $i from 1 through 40 {
    &:nth-child(#{$i}) {
      left: random(100) * 1%;
      top: random(100) * 1%;
      animation-duration: nth($durations, $i);
      animation-delay: nth($delays, $i);
    }
  }
}

@keyframes rainfall {
  0% { transform: translateY(-20px); opacity: 0; }
  10% { opacity: 0.6; }
  90% { opacity: 0.6; }
  100% { transform: translateY(100vh); opacity: 0; }
}

.lightning-content {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 60px;
}

.lightning-title {
  margin-bottom: 80px;

  .title-en {
    display: block;
    font-family: 'Orbitron', sans-serif;
    font-size: 80px;
    font-weight: 900;
    letter-spacing: 15px;
    background: linear-gradient(180deg, #fff9c4 0%, #ffee58 40%, #ffd54f 70%, #ffb300 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 0 80px rgba(255, 238, 88, 0.8);
    filter: drop-shadow(0 0 40px rgba(255, 213, 79, 0.6));
    animation: titleGlow 2s ease-in-out infinite;
  }

  .title-cn {
    display: block;
    font-family: 'Noto Sans SC', sans-serif;
    font-size: 30px;
    font-weight: 300;
    letter-spacing: 20px;
    color: rgba(255, 238, 120, 0.85);
    margin-top: 15px;
  }
}

@keyframes titleGlow {
  0%, 100% { filter: drop-shadow(0 0 30px rgba(255, 213, 79, 0.4)); }
  50% { filter: drop-shadow(0 0 50px rgba(255, 213, 79, 0.7)); }
}

.lightning-cards {
  display: flex;
  gap: 30px;
  justify-content: center;
  flex-wrap: wrap;
}

.lightning-item {
  position: relative;
  width: 240px;
  padding: 35px 25px;
  background: rgba(20, 20, 35, 0.85);
  border: 1px solid rgba(255, 238, 120, 0.2);
  border-radius: 18px;
  backdrop-filter: blur(15px);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 0%, rgba(255, 238, 88, 0.1) 0%, transparent 60%);
    pointer-events: none;
  }
}

.item-icon {
  width: 70px;
  height: 70px;
  margin: 0 auto 20px;
}

.spark-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.spark-line {
  position: absolute;
  top: 50%;
  left: 50%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #ffee58, transparent);
  transform-origin: left center;

  &.line-1 {
    width: 35px;
    transform: translate(0, -50%) rotate(0deg);
    animation: sparkFlash 1.5s ease-in-out infinite;
  }

  &.line-2 {
    width: 30px;
    transform: translate(0, -50%) rotate(90deg);
    animation: sparkFlash 1.5s ease-in-out infinite 0.1s;
  }

  &.line-3 {
    width: 25px;
    transform: translate(0, -50%) rotate(180deg);
    animation: sparkFlash 1.5s ease-in-out infinite 0.2s;
  }

  &.line-4 {
    width: 25px;
    transform: translate(0, -50%) rotate(270deg);
    animation: sparkFlash 1.5s ease-in-out infinite 0.3s;
  }
}

@keyframes sparkFlash {
  0%, 100% { opacity: 0.3; width: 20px; }
  50% { opacity: 1; width: 35px; }
}

.spark-core {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  background: radial-gradient(circle, #fff9c4 0%, #ffee58 60%, #ffb300 100%);
  border-radius: 50%;
  box-shadow:
    0 0 20px #ffee58,
    0 0 40px rgba(255, 238, 88, 0.6);
  animation: corePulse 1s ease-in-out infinite;
}

@keyframes corePulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(1.2); }
}

.item-num {
  font-family: 'Orbitron', sans-serif;
  font-size: 42px;
  font-weight: 700;
  color: rgba(255, 238, 88, 0.1);
  margin-bottom: 8px;
}

.item-title {
  font-size: 22px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 10px;
  text-shadow: 0 0 15px rgba(255, 238, 88, 0.5);
}

.item-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.5;
  margin-bottom: 15px;
}

.item-voltage {
  display: flex;
  align-items: center;
  gap: 10px;
}

.voltage-bar {
  flex: 1;
  height: 4px;
  background: rgba(255, 238, 88, 0.15);
  border-radius: 2px;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    height: 100%;
    width: calc(var(--volt) / 10 * 1%);
    background: linear-gradient(90deg, #ffee58, #ffd54f, #ffb300);
    border-radius: 2px;
    box-shadow: 0 0 10px rgba(255, 238, 88, 0.5);
  }
}

.voltage-label {
  font-family: 'Orbitron', sans-serif;
  font-size: 12px;
  color: rgba(255, 238, 88, 0.8);
  min-width: 50px;
}

.flash-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0);
  pointer-events: none;
  z-index: 100;
}

.static-noise {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  opacity: 0.08;
  pointer-events: none;
  mix-blend-mode: overlay;
}
</style>
