<template>
  <section ref="phantomRef" class="phantom-container">
    <!-- 动态星空背景 -->
    <div class="starfield" ref="starfieldRef"></div>

    <!-- 幽灵轮廓发光层 -->
    <div class="ghost-outline" ref="ghostOutlineRef">
      <svg viewBox="0 0 400 500" class="ghost-svg">
        <defs>
          <filter id="ghostGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>
          <linearGradient id="ghostGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#e879f9"/>
            <stop offset="50%" stop-color="#c026d3"/>
            <stop offset="100%" stop-color="#86198f" stop-opacity="0.6"/>
          </linearGradient>
          <radialGradient id="auraGrad" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stop-color="#f0abfc" stop-opacity="0.4"/>
            <stop offset="70%" stop-color="#d946ef" stop-opacity="0.1"/>
            <stop offset="100%" stop-color="#86198f" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <!-- 幽灵光晕 -->
        <ellipse cx="200" cy="200" rx="150" ry="180" fill="url(#auraGrad)" class="aura"/>
        <!-- 幽灵主体 -->
        <path
          class="ghost-body"
          d="M200 50
             C120 50, 80 120, 80 200
             C80 280, 100 320, 120 350
             L120 420 C120 430, 130 440, 145 430
             C160 420, 160 400, 160 400
             L160 350 C160 350, 180 370, 200 370
             C220 370, 240 350, 240 350
             L240 400 C240 400, 240 420, 255 430
             C270 440, 280 430, 280 420
             L280 350 C300 320, 320 280, 320 200
             C320 120, 280 50, 200 50"
          fill="url(#ghostGrad)"
          filter="url(#ghostGlow)"
        />
        <!-- 眼睛 -->
        <ellipse cx="155" cy="180" rx="20" ry="25" fill="#fdf4ff"/>
        <ellipse cx="245" cy="180" rx="20" ry="25" fill="#fdf4ff"/>
        <circle cx="155" cy="185" r="10" fill="#1e1b4b"/>
        <circle cx="245" cy="185" r="10" fill="#1e1b4b"/>
        <circle cx="150" cy="178" r="5" fill="#fff" opacity="0.9"/>
        <circle cx="240" cy="178" r="5" fill="#fff" opacity="0.9"/>
        <!-- 腮红 -->
        <ellipse cx="130" cy="220" rx="15" ry="10" fill="#f9a8d4" opacity="0.4"/>
        <ellipse cx="270" cy="220" rx="15" ry="10" fill="#f9a8d4" opacity="0.4"/>
      </svg>
    </div>

    <!-- 漂浮灵魂球 -->
    <div class="soul-orbs" ref="soulOrbsRef"></div>

    <!-- 裂隙光效 -->
    <div class="rift-lines" ref="riftRef"></div>

    <!-- 主内容区域 -->
    <div class="phantom-main" ref="mainRef">
      <!-- 顶部标题区 -->
      <header class="phantom-header" ref="headerRef">
        <div class="header-badge" ref="badgeRef">
          <span class="badge-text">04</span>
          <span class="badge-glow"></span>
        </div>
        <h1 class="header-title" ref="titleRef">幽冥幻境</h1>
        <p class="header-subtitle" ref="subtitleRef">Phantom Dimension</p>
      </header>

      <!-- 灵魂摆动动画区 -->
      <div class="soul-section" ref="soulSectionRef">
        <div class="soul-core" ref="soulCoreRef">
          <div class="soul-inner"></div>
          <div class="soul-ring ring-1"></div>
          <div class="soul-ring ring-2"></div>
          <div class="soul-ring ring-3"></div>
        </div>
      </div>

      <!-- 信息卡片组 -->
      <div class="info-cards" ref="cardsRef">
        <article
          v-for="(item, index) in cardsData"
          :key="item.id"
          class="info-card"
          :ref="el => cardRefs[index] = el as HTMLElement"
        >
          <div class="card-shimmer"></div>
          <span class="card-number">{{ item.id }}</span>
          <h3 class="card-title">{{ item.title }}</h3>
          <p class="card-text">{{ item.description }}</p>
          <div class="card-corners">
            <span class="corner corner-tl"></span>
            <span class="corner corner-tr"></span>
            <span class="corner corner-bl"></span>
            <span class="corner corner-br"></span>
          </div>
        </article>
      </div>
    </div>

    <!-- 扫描线效果 -->
    <div class="scan-line" ref="scanLineRef"></div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void

const phantomRef = ref<HTMLElement | null>(null)
const mainRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const badgeRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const soulSectionRef = ref<HTMLElement | null>(null)
const soulCoreRef = ref<HTMLElement | null>(null)
const cardsRef = ref<HTMLElement | null>(null)
const cardRefs = ref<HTMLElement[]>([])
const starfieldRef = ref<HTMLElement | null>(null)
const soulOrbsRef = ref<HTMLElement | null>(null)
const ghostOutlineRef = ref<HTMLElement | null>(null)
const riftRef = ref<HTMLElement | null>(null)
const scanLineRef = ref<HTMLElement | null>(null)

const cardsData = [
  { id: '01', title: '灵魂浮现', description: '意识挣脱物质束缚，化为游荡的灵魂之光' },
  { id: '02', title: '幽魂漫步', description: '穿越维度的边界，在生与死的夹缝中游走' },
  { id: '03', title: '冥火闪烁', description: '幽暗中跳动的磷火，指引迷失的灵魂归途' },
  { id: '04', title: '彼岸之门', description: '连接两界的通道，窥探永眠的彼岸世界' }
]

let cleanupFns: TweenCleanup[] = []
let continuousAnims: gsap.core.Tween[] = []

// 生成星空粒子
const generateStarfield = () => {
  if (!starfieldRef.value) return
  let starsHTML = ''
  for (let i = 0; i < 80; i++) {
    const x = Math.random() * 100
    const y = Math.random() * 100
    const size = 1 + Math.random() * 2.5
    const delay = Math.random() * 5
    const dur = 2 + Math.random() * 4
    starsHTML += `<div class="star" style="
      left: ${x}%;
      top: ${y}%;
      width: ${size}px;
      height: ${size}px;
      animation-delay: ${delay}s;
      animation-duration: ${dur}s;
    "></div>`
  }
  starfieldRef.value.innerHTML = starsHTML
}

// 生成漂浮灵魂球
const generateSoulOrbs = () => {
  if (!soulOrbsRef.value) return
  let orbsHTML = ''
  for (let i = 0; i < 20; i++) {
    const x = 10 + Math.random() * 80
    const y = 10 + Math.random() * 80
    const size = 3 + Math.random() * 8
    const delay = Math.random() * 6
    const dur = 3 + Math.random() * 5
    orbsHTML += `<div class="soul-orb" style="
      left: ${x}%;
      top: ${y}%;
      width: ${size}px;
      height: ${size}px;
      animation-delay: ${delay}s;
      animation-duration: ${dur}s;
    "></div>`
  }
  soulOrbsRef.value.innerHTML = orbsHTML
}

// 生成裂隙光效
const generateRifts = () => {
  if (!riftRef.value) return
  let riftsHTML = ''
  const riftCount = 6
  for (let i = 0; i < riftCount; i++) {
    const angle = (360 / riftCount) * i
    riftsHTML += `<div class="rift" style="transform: rotate(${angle}deg)"></div>`
  }
  riftRef.value.innerHTML = riftsHTML
}

const initAnimations = () => {
  const main = mainRef.value
  if (!main) return

  // flip-down 入场动画 - 核心翻转效果
  const tl = gsap.timeline()

  // 主容器 flip-down 翻转
  tl.fromTo(main,
    {
      opacity: 0,
      rotationX: 100,
      transformPerspective: 1200,
      transformOrigin: '50% 0%'
    },
    {
      opacity: 1,
      rotationX: 0,
      duration: 1.2,
      ease: 'power3.out'
    }
  )

  // 幽灵轮廓入场
  if (ghostOutlineRef.value) {
    tl.fromTo(ghostOutlineRef.value,
      { scale: 0.3, opacity: 0, y: 100 },
      { scale: 1, opacity: 0.6, y: 0, duration: 1, ease: 'back.out(1.4)' },
      '-=0.6'
    )
  }

  // 标题入场
  if (badgeRef.value) {
    tl.fromTo(badgeRef.value,
      { scale: 0, opacity: 0, rotationY: -180 },
      { scale: 1, opacity: 1, rotationY: 0, duration: 0.6, ease: 'back.out(2)' },
      '-=0.4'
    )
  }

  if (titleRef.value) {
    tl.fromTo(titleRef.value,
      { y: -60, opacity: 0, filter: 'blur(10px)' },
      { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power2.out' },
      '-=0.3'
    )
  }

  if (subtitleRef.value) {
    tl.fromTo(subtitleRef.value,
      { y: -40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
      '-=0.5'
    )
  }

  // 灵魂核心入场
  if (soulCoreRef.value) {
    tl.fromTo(soulCoreRef.value,
      { scale: 0, opacity: 0, rotationZ: -180 },
      { scale: 1, opacity: 1, rotationZ: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' },
      '-=0.4'
    )
  }

  // 卡片依次入场
  cardRefs.value.forEach((card, index) => {
    if (card) {
      tl.fromTo(card,
        {
          y: 100,
          opacity: 0,
          rotationX: 60,
          transformPerspective: 800,
          transformOrigin: '50% 0%'
        },
        {
          y: 0,
          opacity: 1,
          rotationX: 0,
          duration: 0.6,
          ease: 'back.out(1.2)'
        },
        `-=${0.5 - index * 0.1}`
      )
    }
  })

  // ScrollTrigger 滚动动画 - 继续向下翻转滑出
  const scrollTriggerInstance = ScrollTrigger.create({
    trigger: main,
    start: 'top 80%',
    end: 'top 20%',
    scrub: 1.5,
    onUpdate: (self) => {
      const p = self.progress

      // 整体向下翻转并滑出
      gsap.set(main, {
        opacity: Math.max(0, 1 - p * 2.5),
        rotationX: 90 * p,
        y: 200 * p,
        transformPerspective: 1200,
        transformOrigin: '50% 0%'
      })

      // 幽灵轮廓缩小消失
      if (ghostOutlineRef.value) {
        gsap.set(ghostOutlineRef.value, {
          scale: 1 - p * 0.5,
          opacity: 0.6 * (1 - p * 2),
          y: 100 * p
        })
      }

      // 灵魂核心缩小
      if (soulCoreRef.value) {
        gsap.set(soulCoreRef.value, {
          scale: 1 - p * 0.6,
          opacity: 1 - p * 2
        })
      }
    }
  })

  cleanupFns.push(() => scrollTriggerInstance.kill())

  // 持续的循环动画

  // 幽灵身体呼吸动画
  const ghostBody = document.querySelector('.ghost-body')
  if (ghostBody) {
    const breathAnim = gsap.timeline({ repeat: -1, yoyo: true })
    breathAnim.to(ghostBody, {
      scaleY: 1.03,
      scaleX: 1.02,
      duration: 3,
      ease: 'sine.inOut'
    })
    continuousAnims.push(breathAnim)
  }

  // 幽灵光晕脉动
  const aura = document.querySelector('.aura')
  if (aura) {
    const auraAnim = gsap.timeline({ repeat: -1, yoyo: true })
    auraAnim.to(aura, {
      scale: 1.15,
      opacity: 0.6,
      duration: 2.5,
      ease: 'sine.inOut'
    })
    continuousAnims.push(auraAnim)
  }

  // 灵魂核心脉动
  if (soulCoreRef.value) {
    const pulseAnim = gsap.timeline({ repeat: -1, yoyo: true })
    pulseAnim.to(soulCoreRef.value, {
      scale: 1.2,
      filter: 'brightness(1.4)',
      duration: 1.5,
      ease: 'sine.inOut'
    })
    continuousAnims.push(pulseAnim)
  }

  // 光环旋转
  const rings = document.querySelectorAll('.soul-ring')
  rings.forEach((ring, i) => {
    const dir = i % 2 === 0 ? 360 : -360
    const ringAnim = gsap.to(ring, {
      rotation: dir,
      duration: 6 + i * 2,
      repeat: -1,
      ease: 'none'
    })
    continuousAnims.push(ringAnim)
  })

  // 裂隙旋转
  if (riftRef.value) {
    const riftAnim = gsap.to(riftRef.value, {
      rotation: 360,
      duration: 30,
      repeat: -1,
      ease: 'none'
    })
    continuousAnims.push(riftAnim)
  }

  // 扫描线动画
  if (scanLineRef.value) {
    const scanAnim = gsap.timeline({ repeat: -1 })
    scanAnim.fromTo(scanLineRef.value,
      { top: '-10%', opacity: 0 },
      { top: '110%', opacity: 0.5, duration: 3, ease: 'none' }
    )
    continuousAnims.push(scanAnim)
  }
}

onMounted(() => {
  generateStarfield()
  generateSoulOrbs()
  generateRifts()
  initAnimations()
})

onBeforeUnmount(() => {
  cleanupFns.forEach(fn => fn())
  continuousAnims.forEach(anim => anim.kill())
})
</script>

<style scoped lang="scss">
.phantom-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(180deg,
    #0a0612 0%,
    #1a0a2e 30%,
    #150826 70%,
    #0a0612 100%
  );
  perspective: 1000px;
}

// 星空背景
.starfield {
  position: absolute;
  inset: 0;
  pointer-events: none;

  .star {
    position: absolute;
    background: #e9d5ff;
    border-radius: 50%;
    opacity: 0;
    animation: twinkle linear infinite;

    &::after {
      content: '';
      position: absolute;
      inset: -2px;
      background: inherit;
      border-radius: 50%;
      filter: blur(2px);
    }
  }
}

@keyframes twinkle {
  0%, 100% { opacity: 0; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.3); }
}

// 幽灵轮廓
.ghost-outline {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: 500px;
  pointer-events: none;

  .ghost-svg {
    width: 100%;
    height: 100%;
    filter: drop-shadow(0 0 30px rgba(192, 132, 252, 0.5));
  }

  .ghost-body {
    transform-origin: center top;
  }
}

// 漂浮灵魂球
.soul-orbs {
  position: absolute;
  inset: 0;
  pointer-events: none;

  .soul-orb {
    position: absolute;
    background: radial-gradient(circle, #f0abfc 0%, #e879f9 50%, #c026d3 100%);
    border-radius: 50%;
    opacity: 0;
    box-shadow: 0 0 15px 5px rgba(232, 121, 249, 0.5);
    animation: orbFloat ease-in-out infinite;

    &::before {
      content: '';
      position: absolute;
      inset: -50%;
      background: radial-gradient(circle, rgba(240, 171, 252, 0.3), transparent);
      border-radius: 50%;
    }
  }
}

@keyframes orbFloat {
  0% {
    opacity: 0;
    transform: translateY(0) scale(0.5);
  }
  20% {
    opacity: 0.8;
  }
  80% {
    opacity: 0.6;
  }
  100% {
    opacity: 0;
    transform: translateY(-120px) scale(0.2);
  }
}

// 裂隙光效
.rift-lines {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 600px;
  height: 600px;
  transform: translate(-50%, -50%);
  pointer-events: none;

  .rift {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 300px;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(232, 121, 249, 0.6), transparent);
    transform-origin: left center;
    animation: riftPulse ease-in-out infinite;

    @for $i from 1 through 6 {
      &:nth-child(#{$i}) {
        animation-duration: #{3 + $i * 0.5}s;
        animation-delay: #{$i * 0.3}s;
      }
    }
  }
}

@keyframes riftPulse {
  0%, 100% { opacity: 0.2; width: 200px; }
  50% { opacity: 0.8; width: 350px; }
}

// 主内容区
.phantom-main {
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
}

// 头部
.phantom-header {
  text-align: center;
  margin-bottom: 30px;
  transform-style: preserve-3d;

  .header-badge {
    position: relative;
    display: inline-block;
    padding: 8px 20px;
    background: linear-gradient(135deg, rgba(232, 121, 249, 0.2), rgba(192, 132, 252, 0.2));
    border: 1px solid rgba(232, 121, 249, 0.5);
    border-radius: 25px;
    margin-bottom: 20px;
    overflow: hidden;

    .badge-text {
      position: relative;
      z-index: 1;
      font-size: 14px;
      font-weight: 700;
      color: #f0abfc;
      letter-spacing: 2px;
    }

    .badge-glow {
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, transparent, rgba(240, 171, 252, 0.4), transparent);
      animation: badgeSweep 3s linear infinite;
    }
  }

  .header-title {
    font-size: 64px;
    font-weight: 800;
    background: linear-gradient(135deg, #fdf4ff 0%, #e879f9 50%, #c026d3 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 12px;
    letter-spacing: 8px;
    text-shadow: 0 0 40px rgba(232, 121, 249, 0.6);
  }

  .header-subtitle {
    font-size: 16px;
    color: #d8b4fe;
    letter-spacing: 8px;
    text-transform: uppercase;
    margin: 0;
  }
}

@keyframes badgeSweep {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

// 灵魂核心区
.soul-section {
  position: relative;
  width: 200px;
  height: 200px;
  margin-bottom: 40px;
  transform-style: preserve-3d;

  .soul-core {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80px;
    height: 80px;

    .soul-inner {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle, #fdf4ff 0%, #f0abfc 40%, #e879f9 70%, #c026d3 100%);
      border-radius: 50%;
      box-shadow:
        0 0 40px 15px rgba(232, 121, 249, 0.6),
        0 0 80px 30px rgba(192, 132, 252, 0.4),
        inset 0 0 30px rgba(255, 255, 255, 0.3);
    }

    .soul-ring {
      position: absolute;
      top: 50%;
      left: 50%;
      border-radius: 50%;
      border: 2px solid transparent;
      transform: translate(-50%, -50%);
    }

    .ring-1 {
      width: 120px;
      height: 120px;
      border-top-color: rgba(240, 171, 252, 0.7);
      border-right-color: rgba(232, 121, 249, 0.4);
    }

    .ring-2 {
      width: 160px;
      height: 160px;
      border-width: 1.5px;
      border-bottom-color: rgba(216, 180, 254, 0.5);
      border-left-color: rgba(192, 132, 252, 0.3);
    }

    .ring-3 {
      width: 200px;
      height: 200px;
      border-width: 1px;
      border-top-color: rgba(233, 213, 255, 0.4);
      border-right-color: rgba(216, 180, 254, 0.2);
    }
  }
}

// 卡片组
.info-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  max-width: 900px;
  width: 100%;
  transform-style: preserve-3d;
}

.info-card {
  position: relative;
  background: linear-gradient(145deg,
    rgba(30, 20, 50, 0.9),
    rgba(50, 30, 80, 0.7)
  );
  border: 1px solid rgba(232, 121, 249, 0.3);
  border-radius: 20px;
  padding: 32px;
  overflow: hidden;
  cursor: pointer;
  backdrop-filter: blur(15px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  .card-shimmer {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg,
      transparent,
      rgba(240, 171, 252, 0.15),
      transparent
    );
    transition: left 0.6s ease;
  }

  &:hover {
    transform: translateY(-8px) rotateX(5deg);
    border-color: rgba(232, 121, 249, 0.7);
    box-shadow:
      0 30px 60px rgba(192, 132, 252, 0.3),
      0 0 50px rgba(232, 121, 249, 0.15);

    .card-shimmer {
      left: 100%;
    }

    .card-number {
      transform: scale(1.2);
      text-shadow: 0 0 25px rgba(240, 171, 252, 0.9);
    }

    .corner {
      opacity: 1;
    }
  }

  .card-number {
    font-size: 36px;
    font-weight: 800;
    background: linear-gradient(135deg, #f0abfc, #e879f9);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 16px;
    transition: all 0.3s ease;
  }

  .card-title {
    font-size: 22px;
    font-weight: 600;
    color: #fdf4ff;
    margin: 0 0 10px;
  }

  .card-text {
    font-size: 14px;
    color: #d8b4fe;
    line-height: 1.7;
    margin: 0;
  }

  .card-corners {
    .corner {
      position: absolute;
      width: 20px;
      height: 20px;
      border-color: rgba(232, 121, 249, 0.8);
      border-style: solid;
      border-width: 0;
      opacity: 0.5;
      transition: opacity 0.3s ease;

      &.corner-tl {
        top: 10px;
        left: 10px;
        border-top-width: 2px;
        border-left-width: 2px;
      }

      &.corner-tr {
        top: 10px;
        right: 10px;
        border-top-width: 2px;
        border-right-width: 2px;
      }

      &.corner-bl {
        bottom: 10px;
        left: 10px;
        border-bottom-width: 2px;
        border-left-width: 2px;
      }

      &.corner-br {
        bottom: 10px;
        right: 10px;
        border-bottom-width: 2px;
        border-right-width: 2px;
      }
    }
  }
}

// 扫描线
.scan-line {
  position: absolute;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg,
    transparent,
    rgba(232, 121, 249, 0.6),
    rgba(240, 171, 252, 0.8),
    rgba(232, 121, 249, 0.6),
    transparent
  );
  pointer-events: none;
  z-index: 100;
  box-shadow: 0 0 20px 5px rgba(232, 121, 249, 0.4);
}
</style>
