<template>
  <section ref="frostRef" class="frost-container">
    <!-- 冰霜纹理层 -->
    <div class="frost-overlay frost-1" ref="frost1Ref"></div>
    <div class="frost-overlay frost-2" ref="frost2Ref"></div>
    <div class="frost-overlay frost-3" ref="frost3Ref"></div>

    <!-- 极光层 -->
    <div class="aurora-layer" ref="auroraRef"></div>

    <!-- 雪花粒子层 -->
    <div class="snow-particles" ref="snowRef"></div>

    <!-- 内容区域 -->
    <div class="frost-content" ref="contentRef">
      <!-- 头部 -->
      <header class="frost-header" ref="headerRef">
        <div class="header-badge" ref="headerBadgeRef">05</div>
        <div class="header-icon" ref="headerIconRef">
          <svg viewBox="0 0 100 100" class="frost-icon">
            <defs>
              <linearGradient id="iceGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#e0f2fe" />
                <stop offset="50%" stop-color="#7dd3fc" />
                <stop offset="100%" stop-color="#0ea5e9" />
              </linearGradient>
              <linearGradient id="iceGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#bae6fd" />
                <stop offset="50%" stop-color="#38bdf8" />
                <stop offset="100%" stop-color="#0284c7" />
              </linearGradient>
              <filter id="iceGlow">
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <!-- 主六边形冰晶 -->
            <polygon points="50,5 80,25 80,65 50,85 20,65 20,25" fill="url(#iceGradient1)" filter="url(#iceGlow)" opacity="0.9" />
            <!-- 内六边形 -->
            <polygon points="50,20 70,35 70,55 50,70 30,55 30,35" fill="none" stroke="#fff" stroke-width="1" opacity="0.6" />
            <!-- 冰晶分支 -->
            <line x1="50" y1="5" x2="50" y2="20" stroke="#fff" stroke-width="1" opacity="0.8" />
            <line x1="50" y1="70" x2="50" y2="85" stroke="#fff" stroke-width="1" opacity="0.8" />
            <line x1="20" y1="25" x2="30" y2="35" stroke="#fff" stroke-width="1" opacity="0.6" />
            <line x1="80" y1="25" x2="70" y2="35" stroke="#fff" stroke-width="1" opacity="0.6" />
            <line x1="20" y1="65" x2="30" y2="55" stroke="#fff" stroke-width="1" opacity="0.6" />
            <line x1="80" y1="65" x2="70" y2="55" stroke="#fff" stroke-width="1" opacity="0.6" />
            <!-- 中心点 -->
            <circle cx="50" cy="45" r="5" fill="#e0f2fe" opacity="0.8" />
          </svg>
        </div>
        <h1 class="header-title">凛冬冰霜</h1>
        <p class="header-subtitle">Winter Frost</p>
      </header>

      <!-- 主视觉 -->
      <div class="frost-visual" ref="visualRef">
        <div class="ice-crystal" ref="crystalRef">
          <div class="crystal-arm arm-1"></div>
          <div class="crystal-arm arm-2"></div>
          <div class="crystal-arm arm-3"></div>
          <div class="crystal-arm arm-4"></div>
          <div class="crystal-arm arm-5"></div>
          <div class="crystal-arm arm-6"></div>
        </div>
        <div class="frost-ring frost-ring-1"></div>
        <div class="frost-ring frost-ring-2"></div>
        <div class="frost-ring frost-ring-3"></div>
      </div>

      <!-- 卡片列表 -->
      <div class="frost-cards" ref="cardsRef">
        <article
          v-for="(item, index) in cardsData"
          :key="item.id"
          class="frost-card"
          :ref="el => cardItemRefs[index] = el as HTMLElement"
        >
          <div class="card-ice-edge"></div>
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

const frostRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const headerBadgeRef = ref<HTMLElement | null>(null)
const headerIconRef = ref<HTMLElement | null>(null)
const visualRef = ref<HTMLElement | null>(null)
const crystalRef = ref<HTMLElement | null>(null)
const cardsRef = ref<HTMLElement | null>(null)
const snowRef = ref<HTMLElement | null>(null)
const frost1Ref = ref<HTMLElement | null>(null)
const frost2Ref = ref<HTMLElement | null>(null)
const frost3Ref = ref<HTMLElement | null>(null)
const auroraRef = ref<HTMLElement | null>(null)
const cardItemRefs = ref<HTMLElement[]>([])

const cardsData = [
  { id: '01', title: '冰晶凝结', description: '水汽遇冷直接凝华成冰晶，绽放冬日的精灵' },
  { id: '02', title: '霜花绽放', description: '冰晶在窗户表面形成的精美图案，大自然的艺术' },
  { id: '03', title: '冰封万物', description: '低温使生物进入休眠状态，生命在此刻静止' },
  { id: '04', title: '极光映雪', description: '寒夜中绚丽的天幕之光，与白雪交相辉映' }
]

let cleanupFns: TweenCleanup[] = []

const generateSnow = () => {
  if (!snowRef.value) return
  let snowHTML = ''
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * 100
    const y = Math.random() * 100
    const size = 2 + Math.random() * 5
    const delay = Math.random() * 8
    const duration = 5 + Math.random() * 8
    snowHTML += `<div class="snowflake" style="left: ${x}%; top: ${y}%; width: ${size}px; height: ${size}px; animation-delay: ${delay}s; animation-duration: ${duration}s;"></div>`
  }
  snowRef.value.innerHTML = snowHTML
}

const initAnimations = () => {
  const card = contentRef.value
  if (!card) return

  // flip-right 入场动画
  const tl = gsap.timeline()

  // 卡片翻转入场
  tl.fromTo(card,
    { opacity: 0, rotationY: 100, transformPerspective: 1200, transformOrigin: '0% 50%' },
    { opacity: 1, rotationY: 0, duration: 1, ease: 'back.out(1.2)' }
  )

  // 头部动画
  if (headerRef.value) {
    tl.fromTo(headerRef.value,
      { x: -50, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.4)' },
      '-=0.4'
    )
  }

  // Badge 动画
  if (headerBadgeRef.value) {
    tl.fromTo(headerBadgeRef.value,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(2.5)' },
      '-=0.3'
    )
  }

  // 图标动画
  if (headerIconRef.value) {
    tl.fromTo(headerIconRef.value,
      { scale: 0, opacity: 0, rotation: -180 },
      { scale: 1, opacity: 1, rotation: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' },
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

  // 冰晶动画
  if (crystalRef.value) {
    tl.fromTo(crystalRef.value,
      { scale: 0, opacity: 0, rotation: 180 },
      { scale: 1, opacity: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.7)' },
      '-=0.4'
    )
  }

  // 卡片列表动画
  cardItemRefs.value.forEach((cardItem, index) => {
    if (cardItem) {
      tl.fromTo(cardItem,
        { x: 100, opacity: 0, rotationY: 45 },
        { x: 0, opacity: 1, rotationY: 0, duration: 0.5, ease: 'power2.out' },
        `-=${0.4 - index * 0.08}`
      )
    }
  })

  // 冰霜层动画
  if (frost1Ref.value) {
    tl.fromTo(frost1Ref.value,
      { x: '20%', opacity: 0 },
      { x: '0%', opacity: 0.5, duration: 1.2, ease: 'sine.out' },
      '-=0.8'
    )
  }
  if (frost2Ref.value) {
    tl.fromTo(frost2Ref.value,
      { x: '15%', opacity: 0 },
      { x: '0%', opacity: 0.4, duration: 1.4, ease: 'sine.out' },
      '-=1'
    )
  }
  if (frost3Ref.value) {
    tl.fromTo(frost3Ref.value,
      { x: '10%', opacity: 0 },
      { x: '0%', opacity: 0.3, duration: 1.6, ease: 'sine.out' },
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
        rotationY: -90 * self.progress,
        x: 200 * self.progress,
        transformPerspective: 1200,
        transformOrigin: '0% 50%'
      })

      if (visualRef.value) {
        gsap.set(visualRef.value, {
          scale: 1 - self.progress * 0.4,
          rotation: self.progress * 30
        })
      }
    }
  })

  cleanupFns.push(() => scrollTriggerInstance.kill())

  // 雪花飘落动画
  const snowflakes = snowRef.value?.querySelectorAll('.snowflake')
  snowflakes?.forEach((flake, i) => {
    gsap.to(flake, {
      y: 100 + Math.random() * 50,
      x: (Math.random() - 0.5) * 30,
      rotation: Math.random() * 360,
      duration: 4 + Math.random() * 6,
      repeat: -1,
      ease: 'none',
      delay: i * 0.05
    })
  })

  // 冰晶旋转动画
  if (crystalRef.value) {
    gsap.to(crystalRef.value, {
      rotation: 360,
      duration: 30,
      repeat: -1,
      ease: 'none'
    })
  }

  // 冰晶臂闪烁
  const arms = document.querySelectorAll('.crystal-arm')
  arms.forEach((arm, index) => {
    gsap.to(arm, {
      opacity: 0.4 + Math.random() * 0.6,
      scaleY: 0.8 + Math.random() * 0.4,
      duration: 1 + Math.random() * 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: index * 0.15
    })
  })

  // 冰霜环旋转
  const frostRings = document.querySelectorAll('.frost-ring')
  frostRings.forEach((ring, index) => {
    const direction = index % 2 === 0 ? 360 : -360
    gsap.to(ring, {
      rotation: direction,
      duration: 12 + index * 4,
      repeat: -1,
      ease: 'none'
    })
  })

  // 极光动画
  if (auroraRef.value) {
    const auroraTl = gsap.timeline({ repeat: -1, yoyo: true })
    auroraTl.to(auroraRef.value, {
      backgroundPosition: '100% 50%',
      duration: 8,
      ease: 'sine.inOut'
    })
    cleanupFns.push(() => auroraTl.kill())
  }

  // 冰霜纹理动画
  const frostMoveTl = gsap.timeline({ repeat: -1, yoyo: true })
  if (frost1Ref.value) {
    frostMoveTl.to(frost1Ref.value, {
      x: '5%',
      duration: 10,
      ease: 'sine.inOut'
    })
  }
  if (frost2Ref.value) {
    frostMoveTl.to(frost2Ref.value, {
      x: '-3%',
      duration: 12,
      ease: 'sine.inOut'
    }, '<')
  }
  if (frost3Ref.value) {
    frostMoveTl.to(frost3Ref.value, {
      x: '4%',
      duration: 8,
      ease: 'sine.inOut'
    }, '<')
  }
  cleanupFns.push(() => frostMoveTl.kill())
}

onMounted(() => {
  generateSnow()
  initAnimations()
})

onBeforeUnmount(() => {
  cleanupFns.forEach(fn => fn())
})
</script>

<style scoped lang="scss">
.frost-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(180deg, #0c4a6e 0%, #164e63 40%, #0f172a 100%);
  perspective: 1200px;
}

// 冰霜纹理层
.frost-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  mix-blend-mode: screen;
}

.frost-1 {
  background: radial-gradient(ellipse at 20% 30%, rgba(186, 230, 253, 0.15) 0%, transparent 45%);
}

.frost-2 {
  background: radial-gradient(ellipse at 80% 70%, rgba(125, 211, 252, 0.12) 0%, transparent 40%);
}

.frost-3 {
  background: radial-gradient(ellipse at 50% 50%, rgba(56, 189, 248, 0.08) 0%, transparent 50%);
}

// 极光层
.aurora-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 40%;
  background: linear-gradient(90deg, 
    transparent 0%,
    rgba(56, 189, 248, 0.1) 25%,
    rgba(125, 211, 252, 0.15) 50%,
    rgba(56, 189, 248, 0.1) 75%,
    transparent 100%
  );
  background-size: 200% 100%;
  filter: blur(30px);
  animation: auroraWave 12s ease-in-out infinite;
}

@keyframes auroraWave {
  0%, 100% { background-position: 0% 50%; opacity: 0.6; }
  50% { background-position: 100% 50%; opacity: 1; }
}

// 雪花层
.snow-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;

  .snowflake {
    position: absolute;
    background: #fff;
    border-radius: 50%;
    opacity: 0.7;
    box-shadow: 0 0 5px 1px rgba(255, 255, 255, 0.5);
  }
}

// 内容区域
.frost-content {
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
.frost-header {
  text-align: center;
  margin-bottom: 40px;
  transform-style: preserve-3d;

  .header-badge {
    display: inline-block;
    padding: 6px 16px;
    background: linear-gradient(135deg, rgba(186, 230, 253, 0.3), rgba(56, 189, 248, 0.3));
    border: 1px solid rgba(186, 230, 253, 0.5);
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;
    color: #e0f2fe;
    margin-bottom: 16px;
  }

  .header-icon {
    width: 100px;
    height: 100px;
    margin: 0 auto 20px;

    .frost-icon {
      width: 100%;
      height: 100%;
      filter: drop-shadow(0 0 20px rgba(125, 211, 252, 0.6));
    }
  }

  .header-title {
    font-size: 56px;
    font-weight: 700;
    background: linear-gradient(135deg, #fff 0%, #7dd3fc 50%, #0ea5e9 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 12px;
    letter-spacing: 4px;
    text-shadow: 0 0 30px rgba(125, 211, 252, 0.5);
  }

  .header-subtitle {
    font-size: 18px;
    color: #bae6fd;
    letter-spacing: 6px;
    text-transform: uppercase;
    margin: 0;
  }
}

// 主视觉
.frost-visual {
  position: relative;
  width: 220px;
  height: 220px;
  margin-bottom: 50px;
  transform-style: preserve-3d;

  .ice-crystal {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 120px;
    height: 120px;
    transform-origin: center;
  }

  .crystal-arm {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 4px;
    height: 60px;
    background: linear-gradient(to top, rgba(186, 230, 253, 0.8), rgba(255, 255, 255, 0.9));
    transform-origin: bottom center;
    border-radius: 2px;
    box-shadow: 0 0 10px 2px rgba(125, 211, 252, 0.5);

    &::before,
    &::after {
      content: '';
      position: absolute;
      width: 2px;
      height: 25px;
      background: linear-gradient(to top, rgba(186, 230, 253, 0.6), transparent);
      border-radius: 1px;
    }

    &::before {
      top: 10px;
      left: -8px;
      transform: rotate(-30deg);
    }

    &::after {
      top: 10px;
      right: -8px;
      transform: rotate(30deg);
    }
  }

  .arm-1 { transform: translate(-50%, -100%) rotate(0deg); }
  .arm-2 { transform: translate(-50%, -100%) rotate(60deg); }
  .arm-3 { transform: translate(-50%, -100%) rotate(120deg); }
  .arm-4 { transform: translate(-50%, -100%) rotate(180deg); }
  .arm-5 { transform: translate(-50%, -100%) rotate(240deg); }
  .arm-6 { transform: translate(-50%, -100%) rotate(300deg); }

  .frost-ring {
    position: absolute;
    top: 50%;
    left: 50%;
    border-radius: 50%;
    border: 2px solid transparent;
    transform: translate(-50%, -50%);
  }

  .frost-ring-1 {
    width: 140px;
    height: 140px;
    border-top-color: rgba(186, 230, 253, 0.7);
    border-right-color: rgba(125, 211, 252, 0.4);
  }

  .frost-ring-2 {
    width: 180px;
    height: 180px;
    border-width: 1.5px;
    border-bottom-color: rgba(56, 189, 248, 0.5);
    border-left-color: rgba(14, 165, 233, 0.3);
  }

  .frost-ring-3 {
    width: 220px;
    height: 220px;
    border-width: 1px;
    border-top-color: rgba(125, 211, 252, 0.4);
  }
}

// 卡片列表
.frost-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  max-width: 900px;
  width: 100%;
  transform-style: preserve-3d;
}

.frost-card {
  background: linear-gradient(135deg, rgba(14, 116, 144, 0.7), rgba(7, 89, 133, 0.5));
  border: 1px solid rgba(186, 230, 253, 0.3);
  border-radius: 16px;
  padding: 28px;
  position: relative;
  overflow: hidden;
  transition: all 0.4s ease;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transform-style: preserve-3d;

  .card-ice-edge {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, transparent, #7dd3fc, transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-6px) rotateY(5deg);
    border-color: rgba(186, 230, 253, 0.6);
    box-shadow: 0 25px 50px rgba(14, 165, 233, 0.4), 0 0 40px rgba(125, 211, 252, 0.2);

    .card-ice-edge {
      opacity: 1;
    }

    .card-index {
      transform: scale(1.15) rotateY(20deg);
      text-shadow: 0 0 20px rgba(125, 211, 252, 0.8);
    }
  }

  .card-index {
    font-size: 32px;
    font-weight: 800;
    background: linear-gradient(135deg, #e0f2fe, #7dd3fc);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 16px;
    transition: all 0.3s ease;
  }

  .card-title {
    font-size: 22px;
    font-weight: 600;
    color: #f0f9ff;
    margin: 0 0 10px;
  }

  .card-description {
    font-size: 15px;
    color: #bae6fd;
    line-height: 1.6;
    margin: 0;
  }

  .card-divider {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(186, 230, 253, 0.4), transparent);
  }
}
</style>
