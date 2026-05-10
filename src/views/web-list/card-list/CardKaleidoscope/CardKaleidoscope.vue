<template>
  <section ref="sectionRef" class="kaleidoscope-section">
    <!-- 万花筒背景 -->
    <div class="kaleidoscope-bg">
      <div class="kaleido-fragment" v-for="i in 12" :key="i" :style="{ '--i': i }"></div>
    </div>

    <!-- 光晕效果 -->
    <div class="glow-orbs">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
    </div>

    <!-- 主容器 -->
    <div class="kaleido-container">
      <!-- 标题 -->
      <div ref="titleRef" class="kaleido-title-wrapper">
        <h1 class="kaleido-title">
          <span class="title-char" v-for="(char, i) in 'KALEIDO'" :key="i">{{ char }}</span>
        </h1>
        <p class="kaleido-subtitle">INFINITE REFLECTIONS</p>
      </div>

      <!-- 万花筒卡片 -->
      <div ref="cardsRef" class="kaleido-cards">
        <div
          v-for="(card, index) in cards"
          :key="card.id"
          class="kaleido-card"
          :ref="el => setCardRef(index, el as HTMLElement)"
        >
          <!-- 旋转边框 -->
          <div class="card-frame">
            <div class="frame-segment" v-for="j in 8" :key="j"></div>
          </div>

          <!-- 折射层 -->
          <div class="refraction-layer">
            <div class="refract refract-1"></div>
            <div class="refract refract-2"></div>
            <div class="refract refract-3"></div>
          </div>

          <!-- 内容 -->
          <div class="card-content">
            <div class="card-pattern">
              <svg viewBox="0 0 100 100" class="pattern-svg">
                <defs>
                  <linearGradient :id="'grad' + index" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" :style="{ stopColor: card.color1 }" />
                    <stop offset="100%" :style="{ stopColor: card.color2 }" />
                  </linearGradient>
                </defs>
                <polygon
                  points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
                  :fill="'url(#grad' + index + ')'"
                  class="hexagon"
                />
                <polygon
                  points="50,20 80,35 80,65 50,80 20,65 20,35"
                  fill="none"
                  :stroke="card.color1"
                  stroke-width="2"
                  class="inner-hex"
                />
              </svg>
              <span class="card-number">{{ card.number }}</span>
            </div>
            <h3>{{ card.title }}</h3>
            <div class="card-gems">
              <span class="gem" v-for="j in card.gems" :key="j" :style="{ '--j': j }">
                💎
              </span>
            </div>
          </div>

          <!-- 闪光效果 -->
          <div class="card-shine"></div>
        </div>
      </div>

      <!-- 底部装饰 -->
      <div class="kaleido-footer">
        <div class="mirror-line"></div>
        <span>REFLECTION COUNT: 360°</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface KaleidoCard {
  id: string
  title: string
  number: string
  gems: number
  color1: string
  color2: string
}

const sectionRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const cardsRef = ref<HTMLElement | null>(null)
const cardRefs = ref<HTMLElement[]>([])

const cards: KaleidoCard[] = [
  { id: 'k1', title: 'CRYSTAL DREAM', number: '01', gems: 3, color1: '#ff6b9d', color2: '#c850c0' },
  { id: 'k2', title: 'PRISM LIGHT', number: '02', gems: 5, color1: '#00d4ff', color2: '#7c3aed' },
  { id: 'k3', title: 'GEM HEART', number: '03', gems: 7, color1: '#ffaa00', color2: '#ff6b9d' },
  { id: 'k4', title: 'JEWEL SKY', number: '04', gems: 4, color1: '#00ff88', color2: '#00d4ff' }
]

const setCardRef = (index: number, el: HTMLElement | null) => {
  if (el) cardRefs.value[index] = el
}

let cleanupFns: (() => void)[] = []

const initAnimations = () => {
  if (!sectionRef.value) return

  // 背景万花筒片段动画
  const fragments = sectionRef.value?.querySelectorAll('.kaleido-fragment')
  if (fragments) {
    fragments.forEach((frag, i) => {
      gsap.to(frag, {
        rotation: 360,
        x: Math.cos((i * 30 * Math.PI) / 180) * 100,
        y: Math.sin((i * 30 * Math.PI) / 180) * 100,
        duration: 20 + i * 2,
        repeat: -1,
        ease: 'none'
      })
      gsap.to(frag, {
        scale: 1.5,
        opacity: 0.3,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })
    })
  }

  // 光晕动画
  const orbs = sectionRef.value?.querySelectorAll('.orb')
  if (orbs) {
    orbs.forEach((orb, i) => {
      gsap.to(orb, {
        x: Math.sin(i * 2) * 100,
        y: Math.cos(i * 2) * 100,
        scale: 1.2,
        duration: 3 + i,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })
    })
  }

  // 标题入场
  if (titleRef.value) {
    const chars = titleRef.value.querySelectorAll('.title-char')
    gsap.fromTo(
      chars,
      { opacity: 0, scale: 0, rotation: -180 },
      {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'back.out(1.7)'
      }
    )

    const subtitle = titleRef.value.querySelector('.kaleido-subtitle')
    if (subtitle) {
      gsap.fromTo(subtitle, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.8 })
    }
  }

  // 卡片滚动动画
  cardRefs.value.forEach((card, index) => {
    gsap.set(card, {
      opacity: 0,
      scale: 0,
      rotation: -45,
      filter: 'hue-rotate(180deg)'
    })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 1.5
      }
    })

    tl.to(card, {
      opacity: 1,
      scale: 1,
      rotation: 0,
      filter: 'hue-rotate(0deg)',
      duration: 1
    })

    // 边框旋转
    const frame = card.querySelector('.card-frame')
    if (frame) {
      gsap.to(frame, {
        rotation: 360,
        duration: 10 + index * 2,
        repeat: -1,
        ease: 'none'
      })
    }

    // 折射层动画
    const refracts = card.querySelectorAll('.refract')
    refracts.forEach((refract, i) => {
      gsap.to(refract, {
        x: (i % 2 === 0 ? 5 : -5),
        y: (i % 2 === 0 ? -3 : 3),
        opacity: 0.5,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.2
      })
    })

    // 六边形脉冲
    const hexagon = card.querySelector('.hexagon')
    if (hexagon) {
      gsap.to(hexagon, {
        scale: 1.1,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })
    }

    // 内六边形反向旋转
    const innerHex = card.querySelector('.inner-hex')
    if (innerHex) {
      gsap.to(innerHex, {
        rotation: -360,
        duration: 8,
        repeat: -1,
        ease: 'none'
      })
    }

    // 宝石动画
    const gems = card.querySelectorAll('.gem')
    gems.forEach((gem, i) => {
      gsap.to(gem, {
        y: -10,
        scale: 1.2,
        duration: 0.8 + i * 0.1,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.1
      })
    })

    // 闪光效果
    const shine = card.querySelector('.card-shine')
    if (shine) {
      gsap.fromTo(
        shine,
        { x: '-100%', opacity: 1 },
        {
          x: '200%',
          duration: 3,
          repeat: -1,
          ease: 'power2.inOut',
          delay: index * 0.5
        }
      )
    }

    cleanupFns.push(() => {
      if (frame) gsap.killTweensOf(frame)
      gsap.killTweensOf(refracts)
      if (hexagon) gsap.killTweensOf(hexagon)
      if (innerHex) gsap.killTweensOf(innerHex)
      gsap.killTweensOf(gems)
      if (shine) gsap.killTweensOf(shine)
    })
  })

  // 底部镜像线动画
  const mirrorLine = sectionRef.value?.querySelector('.mirror-line')
  if (mirrorLine) {
    gsap.to(mirrorLine, {
      scaleX: 1,
      duration: 1.5,
      ease: 'power2.out'
    })
  }
}

onMounted(() => {
  setTimeout(initAnimations, 100)
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
})
</script>

<style scoped lang="scss">
.kaleidoscope-section {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #1a0a2e 0%, #16213e 50%, #0f0f23 100%);
  position: relative;
  overflow: hidden;
}

.kaleidoscope-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.kaleido-fragment {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px;
  height: 400px;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(255, 107, 157, 0.1) 30%,
    rgba(200, 80, 192, 0.1) 70%,
    transparent 100%
  );
  transform-origin: center top;
  clip-path: polygon(50% 0%, 100% 100%, 0% 100%);

  &:nth-child(1) { transform: translate(-50%, 0) rotate(30deg); background: linear-gradient(180deg, transparent, rgba(340, 70%, 60%, 0.15), rgba(20, 70%, 60%, 0.15), transparent); }
  &:nth-child(2) { transform: translate(-50%, 0) rotate(60deg); background: linear-gradient(180deg, transparent, rgba(10, 70%, 60%, 0.15), rgba(50, 70%, 60%, 0.15), transparent); }
  &:nth-child(3) { transform: translate(-50%, 0) rotate(90deg); background: linear-gradient(180deg, transparent, rgba(40, 70%, 60%, 0.15), rgba(80, 70%, 60%, 0.15), transparent); }
  &:nth-child(4) { transform: translate(-50%, 0) rotate(120deg); background: linear-gradient(180deg, transparent, rgba(70, 70%, 60%, 0.15), rgba(110, 70%, 60%, 0.15), transparent); }
  &:nth-child(5) { transform: translate(-50%, 0) rotate(150deg); background: linear-gradient(180deg, transparent, rgba(100, 70%, 60%, 0.15), rgba(140, 70%, 60%, 0.15), transparent); }
  &:nth-child(6) { transform: translate(-50%, 0) rotate(180deg); background: linear-gradient(180deg, transparent, rgba(130, 70%, 60%, 0.15), rgba(170, 70%, 60%, 0.15), transparent); }
  &:nth-child(7) { transform: translate(-50%, 0) rotate(210deg); background: linear-gradient(180deg, transparent, rgba(160, 70%, 60%, 0.15), rgba(200, 70%, 60%, 0.15), transparent); }
  &:nth-child(8) { transform: translate(-50%, 0) rotate(240deg); background: linear-gradient(180deg, transparent, rgba(190, 70%, 60%, 0.15), rgba(230, 70%, 60%, 0.15), transparent); }
  &:nth-child(9) { transform: translate(-50%, 0) rotate(270deg); background: linear-gradient(180deg, transparent, rgba(220, 70%, 60%, 0.15), rgba(260, 70%, 60%, 0.15), transparent); }
  &:nth-child(10) { transform: translate(-50%, 0) rotate(300deg); background: linear-gradient(180deg, transparent, rgba(250, 70%, 60%, 0.15), rgba(290, 70%, 60%, 0.15), transparent); }
  &:nth-child(11) { transform: translate(-50%, 0) rotate(330deg); background: linear-gradient(180deg, transparent, rgba(280, 70%, 60%, 0.15), rgba(320, 70%, 60%, 0.15), transparent); }
  &:nth-child(12) { transform: translate(-50%, 0) rotate(360deg); background: linear-gradient(180deg, transparent, rgba(310, 70%, 60%, 0.15), rgba(350, 70%, 60%, 0.15), transparent); }
}

.glow-orbs {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.5;

  &.orb-1 {
    top: 20%;
    left: 20%;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, #ff6b9d 0%, transparent 70%);
    animation: orb-pulse 4s ease-in-out infinite;
  }

  &.orb-2 {
    bottom: 20%;
    right: 20%;
    width: 250px;
    height: 250px;
    background: radial-gradient(circle, #00d4ff 0%, transparent 70%);
    animation: orb-pulse 5s ease-in-out infinite 1s;
  }

  &.orb-3 {
    top: 50%;
    left: 50%;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, #a855f7 0%, transparent 70%);
    animation: orb-pulse 6s ease-in-out infinite 2s;
  }
}

@keyframes orb-pulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.2); }
}

.kaleido-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.kaleido-title-wrapper {
  text-align: center;
  margin-bottom: 60px;
}

.kaleido-title {
  font-size: clamp(48px, 10vw, 100px);
  font-weight: 900;
  margin: 0;
  background: linear-gradient(135deg, #ff6b9d, #c850c0, #00d4ff, #a855f7);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: kaleido-gradient 5s ease infinite;
  filter: drop-shadow(0 0 30px rgba(200, 80, 192, 0.5));
}

@keyframes kaleido-gradient {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.title-char {
  display: inline-block;
}

.kaleido-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 10px;
  margin-top: 20px;
}

.kaleido-cards {
  display: flex;
  gap: 40px;
  perspective: 1500px;
}

.kaleido-card {
  width: 180px;
  height: 260px;
  position: relative;
  transform-style: preserve-3d;
}

.card-frame {
  position: absolute;
  inset: -10px;
  pointer-events: none;
}

.frame-segment {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #fff, transparent);
  transform-origin: center;
  opacity: 0.3;

  @for $i from 1 through 8 {
    &:nth-child(#{$i}) {
      transform: translate(-50%, -50%) rotate(#{$i * 45}deg);
    }
  }
}

.refraction-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.refract {
  position: absolute;
  inset: 0;
  border-radius: 16px;

  &.refract-1 {
    background: rgba(255, 107, 157, 0.1);
    transform: translateX(-3px);
  }

  &.refract-2 {
    background: rgba(0, 212, 255, 0.1);
    transform: translateY(2px);
  }

  &.refract-3 {
    background: rgba(168, 85, 247, 0.1);
    transform: translateX(3px) translateY(-2px);
  }
}

.card-content {
  position: relative;
  height: 100%;
  background: rgba(20, 10, 40, 0.9);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow:
    0 25px 50px rgba(0, 0, 0, 0.5),
    inset 0 0 60px rgba(200, 80, 192, 0.1);
}

.card-pattern {
  position: relative;
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
}

.pattern-svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 0 20px rgba(255, 107, 157, 0.5));
}

.hexagon {
  transform-origin: center;
}

.inner-hex {
  transform-origin: center;
}

.card-number {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px;
  font-weight: 900;
  color: #fff;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
}

.card-content h3 {
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 15px;
  letter-spacing: 2px;
  text-align: center;
}

.card-gems {
  display: flex;
  gap: 8px;
}

.gem {
  font-size: 20px;
  filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.5));
  @for $i from 1 through 7 {
    &:nth-child(#{$i}) {
      animation-delay: #{$i * 0.1}s;
    }
  }
}

.card-shine {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    transparent 40%,
    rgba(255, 255, 255, 0.4) 50%,
    transparent 60%
  );
  border-radius: 16px;
  pointer-events: none;
}

.kaleido-footer {
  position: absolute;
  bottom: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.mirror-line {
  width: 200px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #fff, transparent);
  transform-origin: center;
  transform: scaleX(0);
}

.kaleido-footer span {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 3px;
}
</style>
