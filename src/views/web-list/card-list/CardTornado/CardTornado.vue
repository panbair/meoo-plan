<template>
  <div class="card-tornado">
    <div ref="bgRef" class="tornado-bg">
      <div class="vortex-container">
        <div class="vortex-ring ring-1"></div>
        <div class="vortex-ring ring-2"></div>
        <div class="vortex-ring ring-3"></div>
        <div class="vortex-ring ring-4"></div>
        <div class="vortex-ring ring-5"></div>
      </div>
      <div class="wind-lines"></div>
      <div class="debris"></div>
    </div>

    <div class="tornado-content">
      <div ref="titleRef" class="tornado-title">
        <span class="title-en">TORNADO</span>
        <span class="title-cn">龙卷风暴</span>
      </div>

      <div ref="cardsWrapRef" class="tornado-cards">
        <div
          v-for="(card, index) in tornadoCards"
          :key="index"
          :ref="el => cardRefs[index] = el as HTMLElement"
          class="tornado-item"
        >
          <div class="item-icon">
            <svg viewBox="0 0 100 100" class="icon-svg">
              <defs>
                <linearGradient id="spiralGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#00d4ff"/>
                  <stop offset="100%" stop-color="#7b2fff"/>
                </linearGradient>
              </defs>
              <path class="spiral-path" d="M50,50 m0,-40 a40,40 0 1,1 0,80 a32,32 0 1,0 0,-64 a24,24 0 1,1 0,48 a16,16 0 1,0 0,-32 a8,8 0 1,1 0,16" fill="none" stroke="url(#spiralGrad)" stroke-width="3"/>
            </svg>
          </div>
          <div class="item-num">{{ card.num }}</div>
          <div class="item-title">{{ card.title }}</div>
          <div class="item-desc">{{ card.desc }}</div>
          <div class="item-bar">
            <div class="bar-fill" :style="{ width: card.barWidth }"></div>
          </div>
        </div>
      </div>
    </div>

    <div ref="flashRef" class="lightning-flash"></div>
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

const tornadoCards = [
  { num: '01', title: '气旋形成', desc: '冷暖气流的剧烈交汇', barWidth: '85%' },
  { num: '02', title: '旋转加强', desc: '角动量守恒的体现', barWidth: '92%' },
  { num: '03', title: '漏斗延伸', desc: '垂直涡管的拉伸', barWidth: '78%' },
  { num: '04', title: '风眼出现', desc: '风暴中心的宁静', barWidth: '65%' }
]

const initAnimations = () => {
  const tl = gsap.timeline()

  // Vortex rings
  const rings = bgRef.value?.querySelectorAll('.vortex-ring')
  rings?.forEach((ring, i) => {
    tl.fromTo(ring,
      { scale: 0.3, opacity: 0, rotation: -180 },
      { scale: 1, opacity: 1, rotation: 0, duration: 1.2, ease: 'elastic.out(1, 0.6)' },
      i * 0.15
    )
    cleanupFns.push(() => gsap.set(ring, { clearProps: 'all' }))
  })

  // Wind lines
  const windLines = bgRef.value?.querySelectorAll('.wind-line')
  windLines?.forEach((line, i) => {
    tl.fromTo(line,
      { x: -100, opacity: 0 },
      { x: 100, opacity: 0.6, duration: 1.5, ease: 'power1.inOut' },
      0.3 + i * 0.08
    )
  })

  // Debris particles
  const debris = bgRef.value?.querySelectorAll('.debris-particle')
  debris?.forEach((p, i) => {
    tl.fromTo(p,
      { y: 100, rotation: 0, opacity: 0 },
      { y: -200, rotation: 360, opacity: 1, duration: 2, ease: 'power1.out' },
      0.5 + i * 0.1
    )
  })

  // Title with zoom-out-up
  if (titleRef.value) {
    tl.fromTo(titleRef.value,
      { y: 200, scale: 1.2, opacity: 0, filter: 'blur(10px)' },
      { y: 0, scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: 'back.out(1.5)' }
    )
    cleanupFns.push(() => gsap.set(titleRef.value, { clearProps: 'all' }))
  }

  // Cards with zoom-out-up
  cardRefs.value.forEach((card, i) => {
    if (!card) return

    tl.fromTo(card,
      { y: 200, scale: 1.2, opacity: 0, filter: 'blur(12px)' },
      { y: 0, scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: 'back.out(1.5)' },
      0.4 + i * 0.15
    )

    // Spiral animation on icon
    const iconSvg = card.querySelector('.spiral-path')
    if (iconSvg) {
      gsap.to(iconSvg, {
        rotation: 360,
        transformOrigin: '50px 50px',
        duration: 4 + i * 0.5,
        ease: 'none',
        repeat: -1
      })
      cleanupFns.push(() => gsap.killTweensOf(iconSvg))
    }

    // Hover animation
    const handleEnter = () => {
      gsap.to(card, {
        y: -10,
        scale: 1.03,
        boxShadow: '0 30px 80px rgba(0, 200, 255, 0.35)',
        duration: 0.35,
        ease: 'power2.out'
      })
      gsap.to(card.querySelector('.bar-fill'), {
        width: '100%',
        duration: 0.5,
        ease: 'power2.out'
      })
    }

    const handleLeave = () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        boxShadow: '0 15px 50px rgba(0, 0, 0, 0.3)',
        duration: 0.35,
        ease: 'power2.out'
      })
      const barFill = card.querySelector('.bar-fill')
      if (barFill) {
        gsap.to(barFill, {
          width: card.dataset.originalWidth || '85%',
          duration: 0.5,
          ease: 'power2.out'
        })
      }
    }

    // Store original width
    const barFill = card.querySelector('.bar-fill') as HTMLElement
    if (barFill) {
      card.dataset.originalWidth = barFill.style.width
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
          y: -200 * self.progress,
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
          y: -150 * self.progress,
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
.card-tornado {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(180deg, #0a0f1a 0%, #0f1a2a 50%, #0a1520 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tornado-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.vortex-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 600px;
}

.vortex-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  border: 2px solid;
  transform: translate(-50%, -50%);

  &.ring-1 {
    width: 600px;
    height: 600px;
    border-color: rgba(0, 212, 255, 0.15);
    animation: vortexSpin 20s linear infinite;
  }

  &.ring-2 {
    width: 480px;
    height: 480px;
    border-color: rgba(0, 180, 255, 0.2);
    animation: vortexSpin 16s linear infinite reverse;
  }

  &.ring-3 {
    width: 360px;
    height: 360px;
    border-color: rgba(100, 180, 255, 0.25);
    animation: vortexSpin 12s linear infinite;
  }

  &.ring-4 {
    width: 240px;
    height: 240px;
    border-color: rgba(150, 200, 255, 0.3);
    animation: vortexSpin 8s linear infinite reverse;
  }

  &.ring-5 {
    width: 120px;
    height: 120px;
    border-color: rgba(200, 220, 255, 0.4);
    animation: vortexSpin 4s linear infinite;
  }
}

@keyframes vortexSpin {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

.wind-lines {
  position: absolute;
  inset: 0;
}

:global(.wind-line) {
  position: absolute;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.4), transparent);
  animation: windFlow 3s linear infinite;

  @for $i from 1 through 12 {
    &:nth-child(#{$i}) {
      top: 5% + $i * 7%;
      width: 30% + math.random(40) * 1%;
      animation-delay: -$i * 0.2s;
    }
  }
}

@keyframes windFlow {
  0% { transform: translateX(-100%); opacity: 0; }
  50% { opacity: 0.6; }
  100% { transform: translateX(200%); opacity: 0; }
}

.debris {
  position: absolute;
  inset: 0;
}

:global(.debris-particle) {
  position: absolute;
  width: 6px;
  height: 6px;
  background: linear-gradient(135deg, #00d4ff, #7b2fff);
  border-radius: 2px;
  box-shadow: 0 0 15px rgba(0, 212, 255, 0.6);
  animation: debrisFloat 4s ease-in-out infinite;

  @for $i from 1 through 15 {
    &:nth-child(#{$i}) {
      left: 10% + math.random(80) * 1%;
      bottom: 20%;
      animation-delay: -$i * 0.3s;
      animation-duration: 3 + math.random(2) * 1s;
    }
  }
}

@keyframes debrisFloat {
  0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.7; }
  50% { transform: translateY(-30px) rotate(180deg); opacity: 1; }
}

.tornado-content {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 60px;
}

.tornado-title {
  margin-bottom: 80px;

  .title-en {
    display: block;
    font-family: 'Orbitron', sans-serif;
    font-size: 72px;
    font-weight: 900;
    letter-spacing: 20px;
    background: linear-gradient(180deg, #00d4ff 0%, #7b2fff 50%, #ff2d95 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 0 60px rgba(0, 200, 255, 0.5);
    filter: drop-shadow(0 0 30px rgba(123, 47, 255, 0.4));
  }

  .title-cn {
    display: block;
    font-family: 'Noto Sans SC', sans-serif;
    font-size: 28px;
    font-weight: 300;
    letter-spacing: 15px;
    color: rgba(0, 212, 255, 0.7);
    margin-top: 15px;
  }
}

.tornado-cards {
  display: flex;
  gap: 30px;
  justify-content: center;
  flex-wrap: wrap;
}

.tornado-item {
  position: relative;
  width: 250px;
  padding: 35px 25px;
  background: rgba(10, 20, 35, 0.75);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 18px;
  backdrop-filter: blur(20px);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.1), transparent);
    transition: left 0.5s ease;
  }

  &:hover::before {
    left: 100%;
  }
}

.item-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 20px;
}

.icon-svg {
  width: 100%;
  height: 100%;
}

.spiral-path {
  filter: drop-shadow(0 0 8px rgba(0, 212, 255, 0.6));
}

.item-num {
  font-family: 'Orbitron', sans-serif;
  font-size: 38px;
  font-weight: 700;
  color: rgba(0, 212, 255, 0.1);
  margin-bottom: 8px;
}

.item-title {
  font-size: 22px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 10px;
  text-shadow: 0 0 15px rgba(0, 212, 255, 0.4);
}

.item-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.5;
  margin-bottom: 20px;
}

.item-bar {
  height: 4px;
  background: rgba(0, 212, 255, 0.15);
  border-radius: 2px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #00d4ff, #7b2fff);
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
  transition: width 0.3s ease;
}

.lightning-flash {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0);
  pointer-events: none;
  animation: lightning 8s ease-in-out infinite;
}

@keyframes lightning {
  0%, 89%, 91%, 93%, 100% { background: rgba(255, 255, 255, 0); }
  90%, 92% { background: rgba(200, 220, 255, 0.1); }
}
</style>
