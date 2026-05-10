<template>
  <section ref="crystalRef" class="crystal-container">
    <!-- 背景折射层 -->
    <div class="refraction-layer refraction-1" ref="refraction1Ref"></div>
    <div class="refraction-layer refraction-2" ref="refraction2Ref"></div>
    <div class="refraction-layer refraction-3" ref="refraction3Ref"></div>

    <!-- 光线效果 -->
    <div class="light-rays" ref="lightRaysRef">
      <div class="ray ray-1"></div>
      <div class="ray ray-2"></div>
      <div class="ray ray-3"></div>
      <div class="ray ray-4"></div>
    </div>

    <!-- 碎片层 -->
    <div class="fragments-layer" ref="fragmentsRef"></div>

    <!-- 内容区域 -->
    <div class="crystal-content" ref="contentRef">
      <!-- 头部 -->
      <header class="crystal-header" ref="headerRef">
        <div class="header-badge" ref="headerBadgeRef">03</div>
        <div class="header-icon" ref="headerIconRef">
          <svg viewBox="0 0 100 100" class="crystal-icon">
            <defs>
              <linearGradient id="crystalGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#67e8f9" />
                <stop offset="50%" stop-color="#06b6d4" />
                <stop offset="100%" stop-color="#0891b2" />
              </linearGradient>
              <linearGradient id="crystalGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#a5f3fc" />
                <stop offset="50%" stop-color="#22d3ee" />
                <stop offset="100%" stop-color="#0e7490" />
              </linearGradient>
              <filter id="crystalGlow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <!-- 主水晶体 -->
            <polygon points="50,10 70,40 65,85 50,95 35,85 30,40" fill="url(#crystalGradient1)" filter="url(#crystalGlow)" opacity="0.9" />
            <!-- 左水晶体 -->
            <polygon points="25,30 35,50 30,80 20,75 15,50" fill="url(#crystalGradient2)" filter="url(#crystalGlow)" opacity="0.8" />
            <!-- 右水晶体 -->
            <polygon points="75,25 85,45 80,75 70,80 68,45" fill="url(#crystalGradient1)" filter="url(#crystalGlow)" opacity="0.7" />
            <!-- 内部折射线 -->
            <line x1="50" y1="10" x2="50" y2="95" stroke="#fff" stroke-width="0.5" opacity="0.4" />
            <line x1="30" y1="40" x2="70" y2="40" stroke="#fff" stroke-width="0.5" opacity="0.3" />
          </svg>
        </div>
        <h1 class="header-title">水晶奇珍</h1>
        <p class="header-subtitle">Crystal Wonders</p>
      </header>

      <!-- 主视觉 -->
      <div class="crystal-visual" ref="visualRef">
        <div class="crystal-main" ref="crystalMainRef">
          <div class="crystal-facet facet-1"></div>
          <div class="crystal-facet facet-2"></div>
          <div class="crystal-facet facet-3"></div>
          <div class="crystal-facet facet-4"></div>
          <div class="crystal-highlight"></div>
        </div>
        <div class="crystal-satellite satellite-1"></div>
        <div class="crystal-satellite satellite-2"></div>
        <div class="crystal-satellite satellite-3"></div>
      </div>

      <!-- 卡片列表 -->
      <div class="crystal-cards" ref="cardsRef">
        <article
          v-for="(item, index) in cardsData"
          :key="item.id"
          class="crystal-card"
          :ref="el => cardItemRefs[index] = el as HTMLElement"
        >
          <div class="card-index">{{ item.id }}</div>
          <div class="card-content">
            <h3 class="card-title">{{ item.title }}</h3>
            <p class="card-description">{{ item.description }}</p>
          </div>
          <div class="card-divider"></div>
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

const crystalRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const headerBadgeRef = ref<HTMLElement | null>(null)
const headerIconRef = ref<HTMLElement | null>(null)
const visualRef = ref<HTMLElement | null>(null)
const crystalMainRef = ref<HTMLElement | null>(null)
const cardsRef = ref<HTMLElement | null>(null)
const fragmentsRef = ref<HTMLElement | null>(null)
const refraction1Ref = ref<HTMLElement | null>(null)
const refraction2Ref = ref<HTMLElement | null>(null)
const refraction3Ref = ref<HTMLElement | null>(null)
const lightRaysRef = ref<HTMLElement | null>(null)
const cardItemRefs = ref<HTMLElement[]>([])

const cardsData = [
  { id: '01', title: '晶核形成', description: '过饱和溶液中的晶种萌发，开启结晶之旅' },
  { id: '02', title: '棱面生长', description: '原子排列成规整的晶格结构，形成几何之美' },
  { id: '03', title: '光线折射', description: '棱面将白光分解为七彩光谱，彩虹在晶体内舞动' },
  { id: '04', title: '完美晶体', description: '缺陷最少的天然矿物珍品，大自然的艺术品' }
]

let cleanupFns: TweenCleanup[] = []
let fragmentAnims: gsap.core.Tween[] = []
let lightRayAnims: gsap.core.Tween[] = []
let satelliteAnims: gsap.core.Tween[] = []
let facetAnims: gsap.core.Tween[] = []

const generateFragments = () => {
  if (!fragmentsRef.value) return
  let fragmentsHTML = ''
  for (let i = 0; i < 30; i++) {
    const x = Math.random() * 100
    const y = Math.random() * 100
    const size = 2 + Math.random() * 6
    const delay = Math.random() * 5
    const duration = 3 + Math.random() * 4
    const hue = 180 + Math.random() * 40
    fragmentsHTML += `<div class="fragment" style="left: ${x}%; top: ${y}%; width: ${size}px; height: ${size}px; background: hsl(${hue}, 80%, 70%); animation-delay: ${delay}s; animation-duration: ${duration}s;"></div>`
  }
  fragmentsRef.value.innerHTML = fragmentsHTML
}

const initAnimations = () => {
  const card = contentRef.value
  if (!card) return

  // flip-up 入场动画
  const tl = gsap.timeline()

  // 卡片翻转入场
  tl.fromTo(card,
    { opacity: 0, rotationX: -100, transformPerspective: 1000, transformOrigin: '50% 50%' },
    { opacity: 1, rotationX: 0, duration: 1, ease: 'back.out(1.2)' }
  )

  // 头部动画
  if (headerRef.value) {
    tl.fromTo(headerRef.value,
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.4)' },
      '-=0.4'
    )
  }

  // Badge 动画
  if (headerBadgeRef.value) {
    tl.fromTo(headerBadgeRef.value,
      { scale: 0, opacity: 0, rotation: -180 },
      { scale: 1, opacity: 1, rotation: 0, duration: 0.5, ease: 'back.out(2)' },
      '-=0.3'
    )
  }

  // 图标动画
  if (headerIconRef.value) {
    tl.fromTo(headerIconRef.value,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, ease: 'elastic.out(1, 0.5)' },
      '-=0.3'
    )
  }

  // 视觉区域动画
  if (visualRef.value) {
    tl.fromTo(visualRef.value,
      { scale: 0.3, opacity: 0, rotationY: -90 },
      { scale: 1, opacity: 1, rotationY: 0, duration: 0.8, ease: 'power2.out' },
      '-=0.5'
    )
  }

  // 主水晶动画
  if (crystalMainRef.value) {
    tl.fromTo(crystalMainRef.value,
      { scale: 0, opacity: 0, rotationZ: 180 },
      { scale: 1, opacity: 1, rotationZ: 0, duration: 0.7, ease: 'back.out(1.7)' },
      '-=0.4'
    )
  }

  // 卡片列表动画
  cardItemRefs.value.forEach((cardItem, index) => {
    if (cardItem) {
      tl.fromTo(cardItem,
        { y: 80, opacity: 0, rotationX: -45 },
        { y: 0, opacity: 1, rotationX: 0, duration: 0.5, ease: 'power2.out' },
        `-=${0.4 - index * 0.08}`
      )
    }
  })

  // 折射层动画
  if (refraction1Ref.value) {
    tl.fromTo(refraction1Ref.value,
      { scale: 0.5, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.2, ease: 'sine.out' },
      '-=0.8'
    )
  }
  if (refraction2Ref.value) {
    tl.fromTo(refraction2Ref.value,
      { scale: 0.5, opacity: 0 },
      { scale: 1, opacity: 0.8, duration: 1.4, ease: 'sine.out' },
      '-=1'
    )
  }
  if (refraction3Ref.value) {
    tl.fromTo(refraction3Ref.value,
      { scale: 0.5, opacity: 0 },
      { scale: 1, opacity: 0.6, duration: 1.6, ease: 'sine.out' },
      '-=1.2'
    )
  }

  // ScrollTrigger 滚动动画
  const scrollTriggerInstance = ScrollTrigger.create({
    trigger: card,
    start: 'top 80%',
    end: 'top 20%',
    scrub: 1.5,
    onUpdate: (self) => {
      gsap.set(card, {
        opacity: Math.max(0, 1 - self.progress * 2.5),
        rotationX: -100 * self.progress,
        y: 150 * self.progress,
        transformPerspective: 1000
      })

      if (visualRef.value) {
        gsap.set(visualRef.value, {
          scale: 1 - self.progress * 0.4,
          rotationY: self.progress * 45
        })
      }
    }
  })

  cleanupFns.push(() => scrollTriggerInstance.kill())

  // 碎片漂浮动画
  const fragments = fragmentsRef.value?.querySelectorAll('.fragment')
  fragments?.forEach((fragment, i) => {
    const anim = gsap.to(fragment, {
      y: -20 - Math.random() * 30,
      x: (Math.random() - 0.5) * 20,
      opacity: 0.3 + Math.random() * 0.7,
      duration: 2 + Math.random() * 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: i * 0.1
    })
    fragmentAnims.push(anim)
  })

  // 水晶脉动动画
  if (crystalMainRef.value) {
    const crystalPulse = gsap.timeline({ repeat: -1, yoyo: true })
    crystalPulse.to(crystalMainRef.value, {
      scale: 1.08,
      filter: 'brightness(1.2)',
      duration: 2.5,
      ease: 'sine.inOut'
    })
    cleanupFns.push(() => crystalPulse.kill())
  }

  // 光线旋转动画
  if (lightRaysRef.value) {
    const anim = gsap.to(lightRaysRef.value, {
      rotation: 360,
      duration: 30,
      repeat: -1,
      ease: 'none'
    })
    lightRayAnims.push(anim)
  }

  // 卫星水晶动画
  const satellites = document.querySelectorAll('.crystal-satellite')
  satellites.forEach((satellite, index) => {
    const anim = gsap.to(satellite, {
      y: -15 - index * 5,
      scale: 1.1 + index * 0.05,
      duration: 2 + index * 0.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: index * 0.3
    })
    satelliteAnims.push(anim)
  })

  // 棱面闪烁动画
  const facets = document.querySelectorAll('.crystal-facet')
  facets.forEach((facet, index) => {
    const anim = gsap.to(facet, {
      opacity: 0.3 + Math.random() * 0.7,
      duration: 1 + Math.random() * 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: index * 0.2
    })
    facetAnims.push(anim)
  })
}

onMounted(() => {
  generateFragments()
  initAnimations()
})

onBeforeUnmount(() => {
  cleanupFns.forEach(fn => fn())
  fragmentAnims.forEach(a => a.kill())
  lightRayAnims.forEach(a => a.kill())
  satelliteAnims.forEach(a => a.kill())
  facetAnims.forEach(a => a.kill())
})
</script>

<style scoped lang="scss">
.crystal-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(180deg, #0c4a6e 0%, #164e63 50%, #0f172a 100%);
  perspective: 1000px;
}

// 折射层
.refraction-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  mix-blend-mode: screen;
}

.refraction-1 {
  background: radial-gradient(ellipse at 20% 30%, rgba(103, 232, 249, 0.2) 0%, transparent 40%);
  animation: refractShift1 12s ease-in-out infinite;
}

.refraction-2 {
  background: radial-gradient(ellipse at 80% 70%, rgba(34, 211, 238, 0.15) 0%, transparent 35%);
  animation: refractShift2 15s ease-in-out infinite;
}

.refraction-3 {
  background: radial-gradient(ellipse at 50% 50%, rgba(6, 182, 212, 0.1) 0%, transparent 50%);
  animation: refractShift3 18s ease-in-out infinite;
}

@keyframes refractShift1 {
  0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
  50% { transform: translate(3%, -2%) scale(1.1) rotate(5deg); }
}

@keyframes refractShift2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-4%, 3%) scale(1.08); }
}

@keyframes refractShift3 {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(2%, 2%); }
}

// 光线效果
.light-rays {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 150%;
  height: 150%;
  transform: translate(-50%, -50%);
  pointer-events: none;

  .ray {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 2px;
    height: 50%;
    transform-origin: top center;
    background: linear-gradient(to bottom, rgba(165, 243, 252, 0.6), transparent);
  }

  .ray-1 { transform: translate(-50%, 0) rotate(0deg); }
  .ray-2 { transform: translate(-50%, 0) rotate(90deg); }
  .ray-3 { transform: translate(-50%, 0) rotate(180deg); }
  .ray-4 { transform: translate(-50%, 0) rotate(270deg); }
}

// 碎片层
.fragments-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;

  .fragment {
    position: absolute;
    border-radius: 2px;
    opacity: 0.6;
    box-shadow: 0 0 8px 2px currentColor;
  }
}

// 内容区域
.crystal-content {
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
.crystal-header {
  text-align: center;
  margin-bottom: 40px;
  transform-style: preserve-3d;

  .header-badge {
    display: inline-block;
    padding: 6px 16px;
    background: linear-gradient(135deg, rgba(103, 232, 249, 0.3), rgba(6, 182, 212, 0.3));
    border: 1px solid rgba(103, 232, 249, 0.5);
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;
    color: #67e8f9;
    margin-bottom: 16px;
  }

  .header-icon {
    width: 100px;
    height: 100px;
    margin: 0 auto 20px;

    .crystal-icon {
      width: 100%;
      height: 100%;
      filter: drop-shadow(0 0 20px rgba(103, 232, 249, 0.5));
    }
  }

  .header-title {
    font-size: 56px;
    font-weight: 700;
    background: linear-gradient(135deg, #fff 0%, #67e8f9 50%, #06b6d4 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 12px;
    letter-spacing: 4px;
  }

  .header-subtitle {
    font-size: 18px;
    color: #a5f3fc;
    letter-spacing: 6px;
    text-transform: uppercase;
    margin: 0;
  }
}

// 主视觉
.crystal-visual {
  position: relative;
  width: 220px;
  height: 220px;
  margin-bottom: 50px;
  transform-style: preserve-3d;

  .crystal-main {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100px;
    height: 160px;
    background: linear-gradient(135deg, rgba(103, 232, 249, 0.9), rgba(6, 182, 212, 0.7), rgba(8, 145, 178, 0.5));
    clip-path: polygon(50% 0%, 100% 25%, 85% 100%, 15% 100%, 0% 25%);
    box-shadow: 0 0 40px 10px rgba(103, 232, 249, 0.4), inset 0 0 30px rgba(255, 255, 255, 0.3);
    transform-style: preserve-3d;
  }

  .crystal-facet {
    position: absolute;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.4), transparent);
    opacity: 0.6;
  }

  .facet-1 {
    top: 10%;
    left: 20%;
    width: 30%;
    height: 20%;
    clip-path: polygon(0 0, 100% 30%, 80% 100%, 20% 100%);
  }

  .facet-2 {
    top: 40%;
    right: 15%;
    width: 25%;
    height: 30%;
    clip-path: polygon(0 30%, 100% 0, 100% 100%, 0 70%);
  }

  .facet-3 {
    bottom: 10%;
    left: 30%;
    width: 40%;
    height: 15%;
    clip-path: polygon(10% 0, 90% 20%, 100% 100%, 0 100%);
  }

  .facet-4 {
    top: 25%;
    left: 10%;
    width: 20%;
    height: 25%;
    clip-path: polygon(100% 0, 100% 100%, 0 80%);
  }

  .crystal-highlight {
    position: absolute;
    top: 15%;
    left: 25%;
    width: 20%;
    height: 15%;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.8), transparent);
    border-radius: 50%;
    filter: blur(3px);
  }

  .crystal-satellite {
    position: absolute;
    width: 30px;
    height: 50px;
    background: linear-gradient(135deg, rgba(165, 243, 252, 0.8), rgba(6, 182, 212, 0.6));
    clip-path: polygon(50% 0%, 100% 30%, 80% 100%, 20% 100%, 0% 30%);
    box-shadow: 0 0 15px 3px rgba(103, 232, 249, 0.3);
  }

  .satellite-1 {
    top: 10%;
    left: 20%;
    transform: rotate(-20deg);
  }

  .satellite-2 {
    top: 5%;
    right: 25%;
    width: 25px;
    height: 40px;
    transform: rotate(15deg);
  }

  .satellite-3 {
    bottom: 15%;
    right: 15%;
    width: 20px;
    height: 35px;
    transform: rotate(-10deg);
  }
}

// 卡片列表
.crystal-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  max-width: 900px;
  width: 100%;
  transform-style: preserve-3d;
}

.crystal-card {
  background: linear-gradient(135deg, rgba(14, 116, 144, 0.6), rgba(7, 89, 133, 0.4));
  border: 1px solid rgba(103, 232, 249, 0.3);
  border-radius: 16px;
  padding: 28px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transform-style: preserve-3d;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(165, 243, 252, 0.1), transparent);
    transition: left 0.5s ease;
  }

  &:hover {
    transform: translateY(-6px) rotateX(5deg);
    border-color: rgba(103, 232, 249, 0.6);
    box-shadow: 0 25px 50px rgba(6, 182, 212, 0.3), 0 0 30px rgba(103, 232, 249, 0.2);

    &::before {
      left: 100%;
    }

    .card-index {
      transform: scale(1.15) rotateY(20deg);
      text-shadow: 0 0 20px rgba(103, 232, 249, 0.8);
    }
  }

  .card-index {
    font-size: 32px;
    font-weight: 800;
    background: linear-gradient(135deg, #67e8f9, #06b6d4);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 16px;
    transition: all 0.3s ease;
  }

  .card-title {
    font-size: 22px;
    font-weight: 600;
    color: #e0f2fe;
    margin: 0 0 10px;
  }

  .card-description {
    font-size: 15px;
    color: #a5f3fc;
    line-height: 1.6;
    margin: 0;
  }

  .card-divider {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(103, 232, 249, 0.4), transparent);
  }
}
</style>
