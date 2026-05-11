<template>
  <div class="card-magma">
    <div ref="bgRef" class="magma-bg">
      <div class="lava-flow">
        <div class="lava lava-1"></div>
        <div class="lava lava-2"></div>
        <div class="lava lava-3"></div>
      </div>
      <div class="heat-waves"></div>
      <div class="ember-particles"></div>
    </div>

    <div class="magma-content">
      <div ref="titleRef" class="magma-title">
        <span class="title-en">MAGMA</span>
        <span class="title-cn">岩浆涌动</span>
      </div>

      <div ref="cardsWrapRef" class="magma-cards">
        <div
          v-for="(card, index) in magmaCards"
          :key="index"
          :ref="el => cardRefs[index] = el as HTMLElement"
          class="magma-item"
        >
          <div class="item-icon">
            <div class="heat-container">
              <div class="heat-ring ring-1"></div>
              <div class="heat-ring ring-2"></div>
              <div class="heat-core"></div>
              <div class="heat-pulse"></div>
            </div>
          </div>
          <div class="item-num">{{ card.num }}</div>
          <div class="item-title">{{ card.title }}</div>
          <div class="item-desc">{{ card.desc }}</div>
          <div class="item-meter">
            <div class="meter-value" :style="{ '--meter-level': card.heat }"></div>
          </div>
        </div>
      </div>
    </div>

    <div ref="smokeRef" class="smoke-overlay"></div>
    <div ref="glowRef" class="bottom-glow"></div>
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
const smokeRef = ref<HTMLElement | null>(null)
const glowRef = ref<HTMLElement | null>(null)

const magmaCards = [
  { num: '01', title: '地核熔岩', desc: '地球内部的高温熔融物质', heat: '95' },
  { num: '02', title: '火山通道', desc: '岩浆上升的地壳裂缝', heat: '88' },
  { num: '03', title: '熔岩流动', desc: '缓慢而毁灭性的蔓延', heat: '82' },
  { num: '04', title: '冷却凝固', desc: '从液态到固态的转变', heat: '60' }
]

const initAnimations = () => {
  const tl = gsap.timeline()

  // Lava flows
  const lavas = bgRef.value?.querySelectorAll('.lava')
  lavas?.forEach((lava, i) => {
    tl.fromTo(lava,
      { x: '-100%', opacity: 0 },
      { x: '100%', opacity: 0.7, duration: 3, ease: 'power1.inOut' },
      i * 0.5
    )
    cleanupFns.push(() => gsap.set(lava, { clearProps: 'all' }))
  })

  // Heat waves
  const heatWaves = bgRef.value?.querySelectorAll('.heat-wave')
  heatWaves?.forEach((wave, i) => {
    tl.fromTo(wave,
      { x: 0, opacity: 0 },
      { x: 50, opacity: 0.3, duration: 2, ease: 'sine.inOut' },
      0.5 + i * 0.2
    )
  })

  // Ember particles
  const embers = bgRef.value?.querySelectorAll('.ember')
  embers?.forEach((ember, i) => {
    tl.fromTo(ember,
      { y: 0, opacity: 0, scale: 0 },
      { y: -300, opacity: 1, scale: 1, duration: 2.5, ease: 'power0.out' },
      0.3 + i * 0.08
    )
  })

  // Bottom glow
  if (glowRef.value) {
    tl.fromTo(glowRef.value,
      { opacity: 0, scaleY: 0 },
      { opacity: 1, scaleY: 1, duration: 1.5, ease: 'power2.out' },
      0.2
    )
    cleanupFns.push(() => gsap.set(glowRef.value, { clearProps: 'all' }))
  }

  // Smoke
  if (smokeRef.value) {
    tl.fromTo(smokeRef.value,
      { opacity: 0 },
      { opacity: 0.4, duration: 1.2, ease: 'power2.out' },
      0.4
    )
    cleanupFns.push(() => gsap.set(smokeRef.value, { clearProps: 'all' }))
  }

  // Title with zoom-out-down
  if (titleRef.value) {
    tl.fromTo(titleRef.value,
      { y: -200, scale: 1.2, opacity: 0, filter: 'blur(10px)' },
      { y: 0, scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: 'back.out(1.5)' }
    )
    cleanupFns.push(() => gsap.set(titleRef.value, { clearProps: 'all' }))
  }

  // Cards with zoom-out-down
  cardRefs.value.forEach((card, i) => {
    if (!card) return

    tl.fromTo(card,
      { y: -200, scale: 1.2, opacity: 0, filter: 'blur(12px)' },
      { y: 0, scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: 'back.out(1.5)' },
      0.4 + i * 0.15
    )

    // Heat pulse animation
    const heatPulse = card.querySelector('.heat-pulse')
    if (heatPulse) {
      gsap.to(heatPulse, {
        scale: 1.5,
        opacity: 0,
        duration: 1.5,
        ease: 'power0.out',
        repeat: -1,
        delay: i * 0.3
      })
    }

    // Hover animation
    const handleEnter = () => {
      gsap.to(card, {
        y: -12,
        scale: 1.04,
        boxShadow: '0 35px 80px rgba(255, 80, 0, 0.5)',
        duration: 0.35,
        ease: 'power2.out'
      })
      gsap.to(card.querySelector('.heat-core'), {
        scale: 1.4,
        duration: 0.3
      })
    }

    const handleLeave = () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        boxShadow: '0 15px 50px rgba(0, 0, 0, 0.4)',
        duration: 0.35,
        ease: 'power2.out'
      })
      gsap.to(card.querySelector('.heat-core'), {
        scale: 1,
        duration: 0.3
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
          y: 200 * self.progress,
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
          y: 150 * self.progress,
          opacity: Math.max(0, 1 - self.progress * 2)
        })
      }
    })
    cleanupFns.push(() => st.kill())
  }
}

onMounted(() => {
  // 延迟初始化以确保懒加载时 DOM 已完全渲染
  setTimeout(initAnimations, 100)
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
})
</script>

<style lang="scss" scoped>
@use 'sass:math';
.card-magma {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(180deg, #1a0a05 0%, #2d1510 50%, #0f0805 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.magma-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.lava-flow {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40%;
}

.lava {
  position: absolute;
  width: 200%;
  height: 100%;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(255, 50, 0, 0.3) 20%,
    rgba(255, 100, 0, 0.5) 50%,
    rgba(255, 150, 50, 0.7) 80%,
    rgba(255, 200, 100, 0.9) 100%
  );
  filter: blur(30px);
  animation: lavaFlow 8s ease-in-out infinite;

  &.lava-1 {
    animation-delay: 0s;
  }

  &.lava-2 {
    opacity: 0.6;
    animation-delay: -3s;
    filter: blur(40px);
  }

  &.lava-3 {
    opacity: 0.4;
    animation-delay: -5s;
    filter: blur(50px);
  }
}

@keyframes lavaFlow {
  0%, 100% { transform: translateX(-25%); }
  50% { transform: translateX(0%); }
}

.heat-waves {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

:global(.heat-wave) {
  position: absolute;
  bottom: 30%;
  height: 3px;
  background: linear-gradient(90deg, transparent, rgba(255, 100, 0, 0.3), transparent);
  animation: heatWave 3s ease-in-out infinite;

  @for $i from 1 through 8 {
    &:nth-child(#{$i}) {
      left: 5% + $i * 10%;
      width: 15% + math.random(10) * 1%;
      animation-delay: -$i * 0.3s;
    }
  }
}

@keyframes heatWave {
  0%, 100% { transform: translateX(0) scaleX(1); opacity: 0.2; }
  50% { transform: translateX(30px) scaleX(1.2); opacity: 0.4; }
}

.ember-particles {
  position: absolute;
  inset: 0;
}

:global(.ember) {
  position: absolute;
  width: 6px;
  height: 6px;
  background: radial-gradient(circle, #ff6600 0%, #ff3300 50%, transparent 100%);
  border-radius: 50%;
  box-shadow: 0 0 15px rgba(255, 100, 0, 0.8);
  animation: emberRise 4s ease-out infinite;

  @for $i from 1 through 20 {
    &:nth-child(#{$i}) {
      left: 5% + math.random(90) * 1%;
      bottom: 10% + math.random(30) * 1%;
      animation-delay: -$i * 0.25s;
      animation-duration: 3 + math.random(2) * 1s;
    }
  }
}

@keyframes emberRise {
  0% { transform: translateY(0) scale(1); opacity: 0.8; }
  100% { transform: translateY(-400px) scale(0); opacity: 0; }
}

.magma-content {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 60px;
}

.magma-title {
  margin-bottom: 80px;

  .title-en {
    display: block;
    font-family: 'Orbitron', sans-serif;
    font-size: 80px;
    font-weight: 900;
    letter-spacing: 20px;
    background: linear-gradient(180deg, #ffdd44 0%, #ff6600 40%, #ff3300 70%, #cc0000 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 0 80px rgba(255, 100, 0, 0.7);
    filter: drop-shadow(0 0 40px rgba(255, 50, 0, 0.6));
  }

  .title-cn {
    display: block;
    font-family: 'Noto Sans SC', sans-serif;
    font-size: 30px;
    font-weight: 300;
    letter-spacing: 18px;
    color: rgba(255, 150, 50, 0.8);
    margin-top: 15px;
  }
}

.magma-cards {
  display: flex;
  gap: 30px;
  justify-content: center;
  flex-wrap: wrap;
}

.magma-item {
  position: relative;
  width: 240px;
  padding: 35px 25px;
  background: rgba(30, 15, 10, 0.85);
  border: 1px solid rgba(255, 100, 50, 0.25);
  border-radius: 18px;
  backdrop-filter: blur(15px);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 100%, rgba(255, 80, 0, 0.15) 0%, transparent 60%);
    pointer-events: none;
  }
}

.item-icon {
  width: 70px;
  height: 70px;
  margin: 0 auto 20px;
}

.heat-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.heat-ring {
  position: absolute;
  border-radius: 50%;
  border: 2px solid;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  &.ring-1 {
    width: 70px;
    height: 70px;
    border-color: rgba(255, 100, 0, 0.5);
    animation: heatRing 3s ease-in-out infinite;
  }

  &.ring-2 {
    width: 50px;
    height: 50px;
    border-color: rgba(255, 150, 50, 0.6);
    animation: heatRing 2.5s ease-in-out infinite reverse;
  }
}

@keyframes heatRing {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
  50% { transform: translate(-50%, -50%) scale(1.15); opacity: 1; }
}

.heat-core {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 25px;
  height: 25px;
  background: radial-gradient(circle, #ffcc00 0%, #ff6600 60%, #ff3300 100%);
  border-radius: 50%;
  box-shadow: 0 0 25px rgba(255, 100, 0, 0.9);
}

.heat-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(255, 100, 0, 0.4);
}

.item-num {
  font-family: 'Orbitron', sans-serif;
  font-size: 40px;
  font-weight: 700;
  color: rgba(255, 100, 0, 0.12);
  margin-bottom: 8px;
}

.item-title {
  font-size: 22px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 10px;
  text-shadow: 0 0 15px rgba(255, 100, 0, 0.5);
}

.item-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.5;
  margin-bottom: 20px;
}

.item-meter {
  height: 6px;
  background: rgba(255, 100, 0, 0.15);
  border-radius: 3px;
  overflow: hidden;
}

.meter-value {
  height: 100%;
  width: calc(var(--meter-level) * 1%);
  background: linear-gradient(90deg, #ff3300, #ff6600, #ffcc00);
  border-radius: 3px;
  box-shadow: 0 0 15px rgba(255, 100, 0, 0.6);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 10px;
    height: 10px;
    background: #ffcc00;
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(255, 200, 0, 0.8);
  }
}

.smoke-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(30, 20, 15, 0.3) 0%, transparent 30%, transparent 70%, rgba(20, 10, 5, 0.4) 100%);
  pointer-events: none;
}

.bottom-glow {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30%;
  background: linear-gradient(0deg, rgba(255, 80, 0, 0.3) 0%, transparent 100%);
  transform-origin: bottom;
  filter: blur(40px);
}
</style>
