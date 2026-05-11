<template>
  <div class="card-supernova">
    <div ref="bgRef" class="supernova-bg">
      <div class="explosion-core">
        <div class="shock-wave wave-1"></div>
        <div class="shock-wave wave-2"></div>
        <div class="shock-wave wave-3"></div>
        <div class="core-pulse"></div>
      </div>
      <div class="debris-field"></div>
      <div class="cosmic-dust"></div>
    </div>

    <div class="supernova-content">
      <div ref="titleRef" class="supernova-title">
        <span class="title-en">SUPERNOVA</span>
        <span class="title-cn">超新星爆发</span>
      </div>

      <div ref="cardsWrapRef" class="supernova-cards">
        <div
          v-for="(card, index) in supernovaCards"
          :key="index"
          :ref="el => cardRefs[index] = el as HTMLElement"
          class="supernova-item"
        >
          <div class="item-icon">
            <div class="nova-container">
              <div class="nova-ring ring-1"></div>
              <div class="nova-ring ring-2"></div>
              <div class="nova-ring ring-3"></div>
              <div class="nova-core"></div>
            </div>
          </div>
          <div class="item-num">{{ card.num }}</div>
          <div class="item-title">{{ card.title }}</div>
          <div class="item-desc">{{ card.desc }}</div>
          <div class="item-radiation">
            <div class="rad-bar">
              <div class="rad-fill" :style="{ width: card.radiation + '%' }"></div>
            </div>
            <span class="rad-label">{{ card.radiation }}%</span>
          </div>
        </div>
      </div>
    </div>

    <div ref="glowRef" class="cosmic-glow"></div>
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
const glowRef = ref<HTMLElement | null>(null)

const supernovaCards = [
  { num: '01', title: '核心坍缩', desc: '恒星生命的最终阶段', radiation: 85 },
  { num: '02', title: '中微子爆发', desc: '比光子更早逃离的能量', radiation: 92 },
  { num: '03', title: '光球膨胀', desc: '以光速扩张的冲击波', radiation: 78 },
  { num: '04', title: '重元素合成', desc: '宇宙中金元素的起源', radiation: 65 }
]

const initAnimations = () => {
  const tl = gsap.timeline()

  // Shock waves
  const waves = bgRef.value?.querySelectorAll('.shock-wave')
  waves?.forEach((wave, i) => {
    tl.fromTo(wave,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.5, ease: 'power2.out' },
      i * 0.3
    )
    cleanupFns.push(() => gsap.set(wave, { clearProps: 'all' }))
  })

  // Core pulse
  const core = bgRef.value?.querySelector('.core-pulse')
  if (core) {
    tl.fromTo(core,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1, ease: 'back.out(2)' },
      0.2
    )
    cleanupFns.push(() => gsap.set(core, { clearProps: 'all' }))
  }

  // Debris particles
  const debris = bgRef.value?.querySelectorAll('.debris-p')
  debris?.forEach((p, i) => {
    tl.fromTo(p,
      { x: 0, y: 0, opacity: 0, scale: 0 },
      {
        x: (Math.random() - 0.5) * 400,
        y: (Math.random() - 0.5) * 400,
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: 'power2.out'
      },
      0.5 + i * 0.05
    )
  })

  // Cosmic dust
  const dust = bgRef.value?.querySelectorAll('.dust')
  dust?.forEach((d, i) => {
    tl.fromTo(d,
      { opacity: 0, scale: 0 },
      { opacity: 0.5, scale: 1, duration: 1, ease: 'power2.out' },
      0.4 + i * 0.03
    )
  })

  // Cosmic glow
  if (glowRef.value) {
    tl.fromTo(glowRef.value,
      { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1, duration: 2, ease: 'power2.out' },
      0.2
    )
    cleanupFns.push(() => gsap.set(glowRef.value, { clearProps: 'all' }))
  }

  // Title with slide-left
  if (titleRef.value) {
    tl.fromTo(titleRef.value,
      { x: '100%', visibility: 'hidden', opacity: 0 },
      { x: 0, visibility: 'visible', opacity: 1, duration: 0.8, ease: 'power3.out' }
    )
    cleanupFns.push(() => gsap.set(titleRef.value, { clearProps: 'all' }))
  }

  // Cards with slide-left
  cardRefs.value.forEach((card, i) => {
    if (!card) return

    tl.fromTo(card,
      { x: '100%', visibility: 'hidden', opacity: 0 },
      { x: 0, visibility: 'visible', opacity: 1, duration: 0.8, ease: 'power3.out' },
      0.3 + i * 0.15
    )

    // Hover animation
    const handleEnter = () => {
      gsap.to(card, {
        x: -10,
        scale: 1.03,
        boxShadow: '0 30px 80px rgba(255, 150, 50, 0.5)',
        duration: 0.35,
        ease: 'power2.out'
      })
      gsap.to(card.querySelector('.nova-core'), {
        scale: 1.5,
        duration: 0.3
      })
    }

    const handleLeave = () => {
      gsap.to(card, {
        x: 0,
        scale: 1,
        boxShadow: '0 15px 50px rgba(0, 0, 0, 0.3)',
        duration: 0.35,
        ease: 'power2.out'
      })
      gsap.to(card.querySelector('.nova-core'), {
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
          x: -200 * self.progress,
          opacity: Math.max(0, 1 - self.progress * 2),
          visibility: self.progress < 1 ? 'visible' : 'hidden'
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
  // 延迟初始化以确保懒加载时 DOM 已完全渲染
  setTimeout(initAnimations, 100)
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
})
</script>

<style lang="scss" scoped>
@use 'sass:math';
.card-supernova {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(180deg, #0a0005 0%, #1a0a10 30%, #0f0510 70%, #050008 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.supernova-bg {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.explosion-core {
  position: relative;
  width: 500px;
  height: 500px;
}

.shock-wave {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  border: 3px solid;
  animation: shockExpand 4s ease-out infinite;

  &.wave-1 {
    width: 200px;
    height: 200px;
    border-color: rgba(255, 200, 100, 0.8);
    animation-delay: 0s;
  }

  &.wave-2 {
    width: 350px;
    height: 350px;
    border-color: rgba(255, 150, 50, 0.5);
    animation-delay: 0.5s;
  }

  &.wave-3 {
    width: 500px;
    height: 500px;
    border-color: rgba(255, 100, 0, 0.3);
    animation-delay: 1s;
  }
}

@keyframes shockExpand {
  0% { transform: translate(-50%, -50%) scale(0.3); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
}

.core-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  background: radial-gradient(circle,
    #ffffff 0%,
    #ffdd88 20%,
    #ffaa44 40%,
    #ff6600 70%,
    transparent 100%
  );
  border-radius: 50%;
  box-shadow:
    0 0 80px rgba(255, 200, 100, 0.9),
    0 0 150px rgba(255, 150, 50, 0.6),
    0 0 250px rgba(255, 100, 0, 0.4);
  animation: coreGlow 1.5s ease-in-out infinite;
}

@keyframes coreGlow {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.9; }
  50% { transform: translate(-50%, -50%) scale(1.15); opacity: 1; }
}

.debris-field {
  position: absolute;
  inset: 0;
}

:global(.debris-p) {
  position: absolute;
  width: 8px;
  height: 8px;
  background: radial-gradient(circle, #ffcc66 0%, #ff8844 60%, transparent 100%);
  border-radius: 50%;
  box-shadow: 0 0 15px rgba(255, 150, 50, 0.8);

  @for $i from 1 through 20 {
    &:nth-child(#{$i}) {
      top: 50%;
      left: 50%;
      animation: debrisFly 3s ease-out infinite;
      animation-delay: -$i * 0.15s;
    }
  }
}

@keyframes debrisFly {
  0% { transform: translate(0, 0) scale(1); opacity: 1; }
  100% { transform: translate((math.random(400) - 200) * 1px, (math.random(400) - 200) * 1px) scale(0); opacity: 0; }
}

.cosmic-dust {
  position: absolute;
  inset: 0;
}

:global(.dust) {
  position: absolute;
  background: radial-gradient(circle, rgba(255, 200, 150, 0.4) 0%, transparent 70%);

  @for $i from 1 through 30 {
    &:nth-child(#{$i}) {
      left: math.random(100) * 1%;
      top: math.random(100) * 1%;
      width: 3 + math.random(5) * 1px;
      height: width;
      animation: dustFloat 5s ease-in-out infinite;
      animation-delay: -$i * 0.2s;
    }
  }
}

@keyframes dustFloat {
  0%, 100% { transform: translateY(0); opacity: 0.3; }
  50% { transform: translateY(-15px); opacity: 0.6; }
}

.supernova-content {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 60px;
}

.supernova-title {
  margin-bottom: 80px;
  will-change: transform, opacity;

  .title-en {
    display: block;
    font-family: 'Orbitron', sans-serif;
    font-size: 72px;
    font-weight: 900;
    letter-spacing: 15px;
    background: linear-gradient(180deg, #ffffff 0%, #ffcc66 40%, #ff8844 70%, #ff4400 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 0 60px rgba(255, 200, 100, 0.7);
    filter: drop-shadow(0 0 30px rgba(255, 150, 50, 0.6));
  }

  .title-cn {
    display: block;
    font-family: 'Noto Sans SC', sans-serif;
    font-size: 28px;
    font-weight: 300;
    letter-spacing: 15px;
    color: rgba(255, 200, 120, 0.85);
    margin-top: 15px;
  }
}

.supernova-cards {
  display: flex;
  gap: 30px;
  justify-content: center;
  flex-wrap: wrap;
}

.supernova-item {
  position: relative;
  width: 240px;
  padding: 35px 25px;
  background: rgba(25, 10, 15, 0.85);
  border: 1px solid rgba(255, 150, 50, 0.25);
  border-radius: 18px;
  backdrop-filter: blur(20px);
  overflow: hidden;
  will-change: transform, opacity;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 30%, rgba(255, 150, 50, 0.15) 0%, transparent 60%);
    pointer-events: none;
  }
}

.item-icon {
  width: 70px;
  height: 70px;
  margin: 0 auto 20px;
}

.nova-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.nova-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  border: 2px solid;
  animation: novaExpand 2s ease-out infinite;

  &.ring-1 {
    width: 70px;
    height: 70px;
    border-color: rgba(255, 200, 100, 0.7);
    animation-delay: 0s;
  }

  &.ring-2 {
    width: 50px;
    height: 50px;
    border-color: rgba(255, 150, 50, 0.5);
    animation-delay: 0.3s;
  }

  &.ring-3 {
    width: 30px;
    height: 30px;
    border-color: rgba(255, 100, 0, 0.4);
    animation-delay: 0.6s;
  }
}

@keyframes novaExpand {
  0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
}

.nova-core {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  background: radial-gradient(circle, #ffffff 0%, #ffcc66 100%);
  border-radius: 50%;
  box-shadow: 0 0 20px rgba(255, 200, 100, 0.9);
}

.item-num {
  font-family: 'Orbitron', sans-serif;
  font-size: 42px;
  font-weight: 700;
  color: rgba(255, 150, 50, 0.1);
  margin-bottom: 8px;
}

.item-title {
  font-size: 22px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 10px;
  text-shadow: 0 0 15px rgba(255, 150, 50, 0.5);
}

.item-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.5;
  margin-bottom: 15px;
}

.item-radiation {
  display: flex;
  align-items: center;
  gap: 10px;
}

.rad-bar {
  flex: 1;
  height: 4px;
  background: rgba(255, 150, 50, 0.15);
  border-radius: 2px;
  overflow: hidden;
}

.rad-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff8844, #ffcc66, #ffffff);
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(255, 200, 100, 0.5);
}

.rad-label {
  font-family: 'Orbitron', sans-serif;
  font-size: 12px;
  color: rgba(255, 200, 100, 0.8);
  min-width: 40px;
}

.cosmic-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 900px;
  height: 900px;
  background: radial-gradient(circle, rgba(255, 150, 50, 0.12) 0%, rgba(255, 100, 0, 0.06) 40%, transparent 70%);
  pointer-events: none;
}
</style>
