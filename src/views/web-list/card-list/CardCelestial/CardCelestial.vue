<template>
  <section ref="sectionRef" class="celestial-container">
    <!-- 星云层 -->
    <div class="nebula-layer nebula-1" ref="nebula1Ref"></div>
    <div class="nebula-layer nebula-2" ref="nebula2Ref"></div>
    <div class="nebula-layer nebula-3" ref="nebula3Ref"></div>

    <!-- 星星场 -->
    <div class="stars-field stars-1" ref="stars1Ref"></div>
    <div class="stars-field stars-2" ref="stars2Ref"></div>

    <!-- 波纹场 -->
    <div class="ripple-field" ref="rippleFieldRef"></div>

    <!-- 粒子雨 -->
    <div class="particle-rain" ref="particleRainRef"></div>

    <!-- 主内容 -->
    <div class="celestial-main" ref="mainRef">
      <!-- 头部 -->
      <header class="celestial-header" ref="headerRef">
        <div class="header-orb" ref="orbRef">
          <div class="orb-core"></div>
          <div class="orb-ring ring-1"></div>
          <div class="orb-ring ring-2"></div>
          <div class="orb-ring ring-3"></div>
        </div>
        <div class="header-badge" ref="badgeRef">05</div>
        <h1 class="header-title" ref="titleRef">天体融合</h1>
        <p class="header-subtitle" ref="subtitleRef">Celestial Convergence</p>
      </header>

      <!-- 能量视觉 -->
      <div class="energy-visual" ref="visualRef">
        <div class="energy-core" ref="coreRef"></div>
        <div class="energy-pulse" ref="pulseRef"></div>
      </div>

      <!-- 卡片组 -->
      <div class="celestial-cards" ref="cardsRef">
        <article
          v-for="(item, index) in cardsData"
          :key="item.id"
          class="celestial-card"
          :ref="el => cardRefs[index] = el as HTMLElement"
        >
          <div class="card-wave"></div>
          <div class="card-shine"></div>
          <span class="card-index">{{ item.id }}</span>
          <h3 class="card-title">{{ item.title }}</h3>
          <p class="card-desc">{{ item.description }}</p>
          <div class="card-border"></div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void

const sectionRef = ref<HTMLElement | null>(null)
const mainRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const orbRef = ref<HTMLElement | null>(null)
const badgeRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const visualRef = ref<HTMLElement | null>(null)
const coreRef = ref<HTMLElement | null>(null)
const pulseRef = ref<HTMLElement | null>(null)
const cardsRef = ref<HTMLElement | null>(null)
const cardRefs = ref<HTMLElement[]>([])
const nebula1Ref = ref<HTMLElement | null>(null)
const nebula2Ref = ref<HTMLElement | null>(null)
const nebula3Ref = ref<HTMLElement | null>(null)
const stars1Ref = ref<HTMLElement | null>(null)
const stars2Ref = ref<HTMLElement | null>(null)
const rippleFieldRef = ref<HTMLElement | null>(null)
const particleRainRef = ref<HTMLElement | null>(null)

const cardsData = [
  { id: '01', title: '星云聚合', description: '气体与尘埃在引力作用下聚集成云，恒星的摇篮' },
  { id: '02', title: '能量爆发', description: '超新星遗迹中的高能粒子辐射，照亮整个星系' },
  { id: '03', title: '引力透镜', description: '时空弯曲造成的光线偏折，宇宙的哈哈镜效应' },
  { id: '04', title: '暗流涌动', description: '暗物质在宇宙网中的隐形流动，编织时空经纬' }
]

let cleanupFns: TweenCleanup[] = []
let continuousAnims: gsap.core.Tween[] = []
let ringAnims: gsap.core.Tween[] = []

// 生成星星
const generateStars = () => {
  const createStarField = (container: HTMLElement | null, count: number) => {
    if (!container) return
    let html = ''
    for (let i = 0; i < count; i++) {
      const x = Math.random() * 100
      const y = Math.random() * 100
      const size = 1 + Math.random() * 3
      const delay = Math.random() * 5
      const dur = 2 + Math.random() * 4
      const hue = 220 + Math.random() * 60
      html += `<div class="star" style="
        left: ${x}%;
        top: ${y}%;
        width: ${size}px;
        height: ${size}px;
        animation-delay: ${delay}s;
        animation-duration: ${dur}s;
        background: hsl(${hue}, 80%, 80%);
        box-shadow: 0 0 ${size * 2}px hsl(${hue}, 80%, 60%);
      "></div>`
    }
    container.innerHTML = html
  }

  createStarField(stars1Ref.value, 60)
  createStarField(stars2Ref.value, 40)
}

// 生成波纹
const generateRipples = () => {
  if (!rippleFieldRef.value) return
  let html = ''
  for (let i = 0; i < 5; i++) {
    html += `<div class="ripple" style="animation-delay: ${i * 1.5}s"></div>`
  }
  rippleFieldRef.value.innerHTML = html
}

// 生成粒子雨
const generateParticles = () => {
  if (!particleRainRef.value) return
  let html = ''
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * 100
    const delay = Math.random() * 8
    const dur = 3 + Math.random() * 4
    const size = 1 + Math.random() * 2
    const hue = Math.random() > 0.5 ? 270 : 190
    html += `<div class="rain-particle" style="
      left: ${x}%;
      animation-delay: ${delay}s;
      animation-duration: ${dur}s;
      width: ${size}px;
      height: ${size * 3}px;
      background: hsl(${hue}, 90%, 70%);
    "></div>`
  }
  particleRainRef.value.innerHTML = html
}

const initAnimations = () => {
  const main = mainRef.value
  if (!main) return

  // roll-up 入场动画
  const tl = gsap.timeline()

  // 主容器 roll-up 滚入
  tl.fromTo(main,
    {
      y: '100%',
      visibility: 'hidden',
      rotation: -15,
      transformOrigin: '50% 100%'
    },
    {
      y: 0,
      visibility: 'visible',
      rotation: 0,
      duration: 1.2,
      ease: 'power3.out'
    }
  )

  // 星云层入场
  const nebulaLayers = [nebula1Ref.value, nebula2Ref.value, nebula3Ref.value]
  nebulaLayers.forEach((layer, i) => {
    if (layer) {
      tl.fromTo(layer,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1.5, ease: 'power2.out' },
        `-=${1.3 - i * 0.3}`
      )
    }
  })

  // 星星入场
  if (stars1Ref.value) {
    tl.fromTo(stars1Ref.value,
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: 'power2.out' },
      '-=1'
    )
  }
  if (stars2Ref.value) {
    tl.fromTo(stars2Ref.value,
      { opacity: 0 },
      { opacity: 1, duration: 1.2, ease: 'power2.out' },
      '-=0.8'
    )
  }

  // 能量球入场
  if (orbRef.value) {
    tl.fromTo(orbRef.value,
      { scale: 0, opacity: 0, rotation: -180 },
      { scale: 1, opacity: 1, rotation: 0, duration: 1, ease: 'elastic.out(1, 0.5)' },
      '-=0.8'
    )
  }

  // Badge 入场
  if (badgeRef.value) {
    tl.fromTo(badgeRef.value,
      { scale: 0, opacity: 0, y: 30 },
      { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: 'back.out(2)' },
      '-=0.4'
    )
  }

  // 标题入场
  if (titleRef.value) {
    tl.fromTo(titleRef.value,
      { y: 50, opacity: 0, filter: 'blur(10px)' },
      { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power2.out' },
      '-=0.5'
    )
  }

  if (subtitleRef.value) {
    tl.fromTo(subtitleRef.value,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
      '-=0.4'
    )
  }

  // 能量核心入场
  if (coreRef.value) {
    tl.fromTo(coreRef.value,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.5)' },
      '-=0.5'
    )
  }

  // 卡片依次滚入
  cardRefs.value.forEach((card, index) => {
    if (card) {
      tl.fromTo(card,
        {
          y: 100,
          opacity: 0,
          rotation: -10,
          transformOrigin: '50% 100%'
        },
        {
          y: 0,
          opacity: 1,
          rotation: 0,
          duration: 0.7,
          ease: 'back.out(1.2)'
        },
        `-=${0.6 - index * 0.1}`
      )
    }
  })

  // ScrollTrigger 滚动动画 - 向上滚出
  const scrollTriggerInstance = ScrollTrigger.create({
    trigger: main,
    start: 'top 80%',
    end: 'top 20%',
    scrub: 1.5,
    onUpdate: (self) => {
      const p = self.progress

      gsap.set(main, {
        y: -200 * p,
        opacity: Math.max(0, 1 - p * 2.5),
        rotation: 8 * p,
        visibility: p < 1 ? 'visible' : 'hidden'
      })

      if (orbRef.value) {
        gsap.set(orbRef.value, {
          scale: 1 - p * 0.5,
          opacity: 1 - p * 1.5
        })
      }

      if (coreRef.value) {
        gsap.set(coreRef.value, {
          scale: 1 - p * 0.6,
          opacity: Math.max(0, 1 - p * 2)
        })
      }
    }
  })

  cleanupFns.push(() => scrollTriggerInstance.kill())

  // 持续动画

  // 星云漂移
  if (nebula1Ref.value) {
    const drift1 = gsap.to(nebula1Ref.value, {
      x: 50,
      y: 30,
      duration: 20,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
    continuousAnims.push(drift1)
  }

  if (nebula2Ref.value) {
    const drift2 = gsap.to(nebula2Ref.value, {
      x: -40,
      y: -20,
      duration: 25,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
    continuousAnims.push(drift2)
  }

  if (nebula3Ref.value) {
    const drift3 = gsap.to(nebula3Ref.value, {
      x: 30,
      y: -40,
      duration: 30,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
    continuousAnims.push(drift3)
  }

  // 能量环旋转
  const rings = document.querySelectorAll('.orb-ring')
  rings.forEach((ring, i) => {
    const dir = i % 2 === 0 ? 360 : -360
    const ringAnim = gsap.to(ring, {
      rotation: dir,
      duration: 8 + i * 4,
      repeat: -1,
      ease: 'none'
    })
    continuousAnims.push(ringAnim)
    ringAnims.push(ringAnim)
  })

  // 核心脉动
  if (coreRef.value) {
    const pulse = gsap.timeline({ repeat: -1, yoyo: true })
    pulse.to(coreRef.value, {
      scale: 1.3,
      filter: 'brightness(1.5) saturate(1.3)',
      duration: 1.5,
      ease: 'sine.inOut'
    })
    continuousAnims.push(pulse)
  }

  // 脉冲环
  if (pulseRef.value) {
    const pulseRing = gsap.timeline({ repeat: -1 })
    pulseRing.fromTo(pulseRef.value,
      { scale: 0.5, opacity: 0.8 },
      { scale: 2, opacity: 0, duration: 2, ease: 'power2.out' }
    )
    continuousAnims.push(pulseRing)
  }

  // 波纹旋转
  if (rippleFieldRef.value) {
    const rippleRot = gsap.to(rippleFieldRef.value, {
      rotation: 360,
      duration: 60,
      repeat: -1,
      ease: 'none'
    })
    continuousAnims.push(rippleRot)
  }
}

onMounted(() => {
  generateStars()
  generateRipples()
  generateParticles()
  initAnimations()
})

onBeforeUnmount(() => {
  cleanupFns.forEach(fn => fn())
  continuousAnims.forEach(anim => anim.kill())
  ringAnims.forEach(anim => anim.kill())
})
</script>

<style scoped lang="scss">
.celestial-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(180deg,
    #030712 0%,
    #0f0728 40%,
    #1a0a3e 60%,
    #0f0728 100%
  );
}

// 星云层
.nebula-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  mix-blend-mode: screen;
}

.nebula-1 {
  background: radial-gradient(ellipse at 20% 30%, rgba(124, 58, 237, 0.25) 0%, transparent 50%);
  animation: nebulaDrift1 20s ease-in-out infinite;
}

.nebula-2 {
  background: radial-gradient(ellipse at 80% 60%, rgba(6, 182, 212, 0.2) 0%, transparent 45%);
  animation: nebulaDrift2 25s ease-in-out infinite;
}

.nebula-3 {
  background: radial-gradient(ellipse at 50% 80%, rgba(244, 114, 182, 0.15) 0%, transparent 50%);
  animation: nebulaDrift3 30s ease-in-out infinite;
}

@keyframes nebulaDrift1 {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.8; }
  50% { transform: translate(5%, 3%) scale(1.1); opacity: 1; }
}

@keyframes nebulaDrift2 {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.7; }
  50% { transform: translate(-4%, 4%) scale(1.08); opacity: 0.9; }
}

@keyframes nebulaDrift3 {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
  50% { transform: translate(3%, -2%) scale(1.05); opacity: 0.8; }
}

// 星星场
.stars-field {
  position: absolute;
  inset: 0;
  pointer-events: none;

  .star {
    position: absolute;
    border-radius: 50%;
    animation: starTwinkle linear infinite;
  }
}

@keyframes starTwinkle {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.3); }
}

// 波纹场
.ripple-field {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 800px;
  height: 800px;
  transform: translate(-50%, -50%);
  pointer-events: none;
  opacity: 0.4;

  .ripple {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 200px;
    height: 200px;
    border: 2px solid rgba(124, 58, 237, 0.5);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: rippleExpand 6s ease-out infinite;

    @for $i from 1 through 5 {
      &:nth-child(#{$i}) {
        animation-delay: #{$i * 1.2}s;
      }
    }
  }
}

@keyframes rippleExpand {
  0% {
    width: 100px;
    height: 100px;
    opacity: 0.8;
    border-width: 3px;
  }
  100% {
    width: 800px;
    height: 800px;
    opacity: 0;
    border-width: 1px;
  }
}

// 粒子雨
.particle-rain {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;

  .rain-particle {
    position: absolute;
    top: -20px;
    border-radius: 50%;
    animation: particleFall linear infinite;
    opacity: 0.6;
  }
}

@keyframes particleFall {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 0.6;
  }
  90% {
    opacity: 0.4;
  }
  100% {
    transform: translateY(110vh) translateX(20px);
    opacity: 0;
  }
}

// 主内容
.celestial-main {
  position: relative;
  z-index: 10;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  transform-style: preserve-3d;
  transform-origin: center center;
}

// 头部
.celestial-header {
  text-align: center;
  margin-bottom: 30px;
  position: relative;

  .header-orb {
    position: relative;
    width: 120px;
    height: 120px;
    margin: 0 auto 20px;

    .orb-core {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 50px;
      height: 50px;
      background: radial-gradient(circle,
        #fff 0%,
        #c4b5fd 30%,
        #7c3aed 70%,
        #06b6d4 100%
      );
      border-radius: 50%;
      box-shadow:
        0 0 40px 15px rgba(124, 58, 237, 0.6),
        0 0 80px 30px rgba(6, 182, 212, 0.4),
        inset 0 0 20px rgba(255, 255, 255, 0.5);
    }

    .orb-ring {
      position: absolute;
      top: 50%;
      left: 50%;
      border-radius: 50%;
      border: 2px solid transparent;
      transform: translate(-50%, -50%);

      &.ring-1 {
        width: 80px;
        height: 80px;
        border-top-color: rgba(196, 181, 253, 0.8);
        border-right-color: rgba(6, 182, 212, 0.5);
      }

      &.ring-2 {
        width: 100px;
        height: 100px;
        border-width: 1.5px;
        border-bottom-color: rgba(124, 58, 237, 0.6);
        border-left-color: rgba(244, 114, 182, 0.4);
      }

      &.ring-3 {
        width: 120px;
        height: 120px;
        border-width: 1px;
        border-top-color: rgba(103, 232, 249, 0.5);
      }
    }
  }

  .header-badge {
    display: inline-block;
    padding: 6px 18px;
    background: linear-gradient(135deg, rgba(124, 58, 237, 0.3), rgba(6, 182, 212, 0.3));
    border: 1px solid rgba(196, 181, 253, 0.5);
    border-radius: 20px;
    font-size: 13px;
    font-weight: 700;
    color: #c4b5fd;
    letter-spacing: 2px;
    margin-bottom: 16px;
  }

  .header-title {
    font-size: 60px;
    font-weight: 800;
    background: linear-gradient(135deg, #fff 0%, #c4b5fd 40%, #7c3aed 70%, #06b6d4 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 12px;
    letter-spacing: 6px;
    text-shadow: 0 0 50px rgba(124, 58, 237, 0.6);
  }

  .header-subtitle {
    font-size: 16px;
    color: #a5b4fc;
    letter-spacing: 6px;
    text-transform: uppercase;
    margin: 0;
  }
}

// 能量视觉
.energy-visual {
  position: relative;
  width: 200px;
  height: 200px;
  margin-bottom: 40px;

  .energy-core {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60px;
    height: 60px;
    background: radial-gradient(circle,
      rgba(255, 255, 255, 0.9) 0%,
      rgba(196, 181, 253, 0.7) 50%,
      rgba(124, 58, 237, 0.5) 100%
    );
    border-radius: 50%;
    box-shadow:
      0 0 30px 10px rgba(124, 58, 237, 0.5),
      0 0 60px 20px rgba(6, 182, 212, 0.3);
  }

  .energy-pulse {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 80px;
    height: 80px;
    transform: translate(-50%, -50%);
    border: 3px solid rgba(196, 181, 253, 0.6);
    border-radius: 50%;
    box-shadow: 0 0 20px rgba(124, 58, 237, 0.4);
  }
}

// 卡片组
.celestial-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  max-width: 900px;
  width: 100%;
}

.celestial-card {
  position: relative;
  background: linear-gradient(145deg,
    rgba(15, 7, 40, 0.9),
    rgba(30, 20, 70, 0.8)
  );
  border: 1px solid rgba(124, 58, 237, 0.3);
  border-radius: 20px;
  padding: 32px;
  overflow: hidden;
  cursor: pointer;
  backdrop-filter: blur(15px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  .card-wave {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 30% 70%, rgba(124, 58, 237, 0.15), transparent 60%);
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  .card-shine {
    position: absolute;
    top: 0;
    left: -100%;
    width: 60%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transform: skewX(-20deg);
    transition: left 0.6s ease;
  }

  &:hover {
    transform: translateY(-8px) rotate(1deg);
    border-color: rgba(124, 58, 237, 0.7);
    box-shadow:
      0 25px 50px rgba(124, 58, 237, 0.3),
      0 0 40px rgba(6, 182, 212, 0.15),
      inset 0 0 30px rgba(124, 58, 237, 0.1);

    .card-wave {
      opacity: 1;
    }

    .card-shine {
      left: 150%;
    }

    .card-index {
      transform: scale(1.15);
      text-shadow: 0 0 25px rgba(196, 181, 253, 0.9);
    }

    .card-border {
      opacity: 1;
    }
  }

  .card-index {
    font-size: 38px;
    font-weight: 800;
    background: linear-gradient(135deg, #c4b5fd, #7c3aed);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 14px;
    transition: all 0.3s ease;
  }

  .card-title {
    font-size: 22px;
    font-weight: 600;
    color: #f5f3ff;
    margin: 0 0 10px;
  }

  .card-desc {
    font-size: 14px;
    color: #a5b4fc;
    line-height: 1.7;
    margin: 0;
  }

  .card-border {
    position: absolute;
    inset: 0;
    border: 1px solid transparent;
    border-radius: 20px;
    background: linear-gradient(145deg, rgba(196, 181, 253, 0.3), transparent) border-box;
    -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
}
</style>
