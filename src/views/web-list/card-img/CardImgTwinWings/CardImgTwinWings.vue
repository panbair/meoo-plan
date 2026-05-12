<template>
  <div ref="containerRef" class="twin-wings-container">
    <!-- 背景 -->
    <div ref="bgRef" class="wings-bg">
      <div class="bg-gradient" />
      <div class="bg-pattern" />
    </div>

    <!-- 卡片阵列 -->
    <div ref="cardGridRef" class="card-grid">
      <div
        v-for="(card, index) in cards"
        :key="card.id"
        :ref="el => setCardRef(el as HTMLElement | null, index)"
        class="wing-card"
        :class="`card-${index}`"
        :style="{ '--card-index': index }"
      >
        <div class="card-inner">
          <img :src="card.url" :alt="card.title" class="card-image" />
          <div class="card-overlay">
            <span class="card-title">{{ card.title }}</span>
            <span class="card-subtitle">{{ card.subtitle }}</span>
          </div>
        </div>
        <div class="card-shadow" />
      </div>
    </div>

    <!-- 中心指示线 -->
    <div ref="centerLineRef" class="center-line">
      <div class="line-vertical" />
      <div class="line-glow" />
    </div>

    <!-- 内容区域 -->
    <div ref="contentRef" class="wings-content">
      <div class="content-inner">
        <h2 ref="subtitleRef" class="wings-subtitle">DUAL ARRAY</h2>
        <h1 ref="titleRef" class="wings-title">
          <span class="title-line">双翼</span>
          <span class="title-line accent">展翅</span>
        </h1>
        <p ref="descRef" class="wings-desc">
          刀锋交错 向心收敛<br />
          精确编排的入场仪式
        </p>
      </div>
    </div>

    <!-- 入场指示 -->
    <div ref="progressRef" class="wings-progress">
      <span class="progress-text">SCROLL TO DEPLOY</span>
    </div>

    <!-- 角落装饰 -->
    <svg ref="cornerTlRef" class="corner-deco corner-tl" viewBox="0 0 60 60">
      <path d="M0 20 L0 0 L20 0" fill="none" stroke="currentColor" stroke-width="1" />
    </svg>
    <svg ref="cornerBrRef" class="corner-deco corner-br" viewBox="0 0 60 60">
      <path d="M60 40 L60 60 L40 60" fill="none" stroke="currentColor" stroke-width="1" />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface TweenCleanup {
  kill: () => void
}

interface Card {
  id: number
  url: string
  title: string
  subtitle: string
}

const cards: Card[] = [
  { id: 1, url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80', title: '巅峰', subtitle: '群山之巅' },
  { id: 2, url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80', title: '峭壁', subtitle: '悬崖之姿' },
  { id: 3, url: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=600&q=80', title: '极光', subtitle: '天际之舞' },
  { id: 4, url: 'https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=600&q=80', title: '冰川', subtitle: '万年之寒' },
  { id: 5, url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80', title: '星河', subtitle: '宇宙之谜' },
  { id: 6, url: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600&q=80', title: '飞瀑', subtitle: '天水倾泻' },
]

const containerRef = ref<HTMLElement | null>(null)
const bgRef = ref<HTMLElement | null>(null)
const cardGridRef = ref<HTMLElement | null>(null)
const centerLineRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const descRef = ref<HTMLElement | null>(null)
const progressRef = ref<HTMLElement | null>(null)
const cornerTlRef = ref<SVGElement | null>(null)
const cornerBrRef = ref<SVGElement | null>(null)

const cardRefs: (HTMLElement | null)[] = []
const cleanupFns: TweenCleanup[] = []

function setCardRef(el: HTMLElement | null, index: number) {
  cardRefs[index] = el
}

function initScrollAnimation() {
  if (!containerRef.value) return

  const ctx = gsap.context(() => {
    // 初始状态 - 所有卡片隐匿
    cardRefs.forEach((card, index) => {
      if (!card) return

      // 计算从哪侧入场
      const isLeft = index < cards.length / 2
      const distance = 800

      gsap.set(card, {
        x: isLeft ? -distance : distance,
        scale: 0.92,
        opacity: 0,
        rotationY: isLeft ? -15 : 15
      })
      gsap.set(card.querySelector('.card-shadow'), {
        opacity: 0,
        scale: 0.8
      })
    })

    gsap.set(centerLineRef.value, { opacity: 0, scaleY: 0 })
    gsap.set(contentRef.value, { opacity: 0, y: 50 })
    gsap.set(progressRef.value, { opacity: 0 })

    // 中心线入场
    gsap.to(centerLineRef.value, {
      opacity: 0.3,
      scaleY: 1,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: containerRef.value,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    })

    // 主入场动画 - 双翼向心
    const wingTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.value,
        start: 'top 70%',
        end: 'center center',
        scrub: 1.5
      }
    })

    // 计算对称的 stagger 顺序
    const halfLength = Math.ceil(cards.length / 2)
    const entranceOrder: number[] = []

    for (let i = 0; i < halfLength; i++) {
      // 从两端向中心
      entranceOrder.push(i) // 左侧
      if (i < Math.floor(cards.length / 2)) {
        entranceOrder.push(cards.length - 1 - i) // 右侧
      }
    }

    // 去重并确保顺序正确
    const orderedCards = [...entranceOrder].sort((a, b) => {
      const aDist = Math.min(a, cards.length - 1 - a)
      const bDist = Math.min(b, cards.length - 1 - b)
      return aDist - bDist
    })

    // 入场动画
    orderedCards.forEach((cardIndex, i) => {
      const card = cardRefs[cardIndex]
      if (!card) return

      const isLeft = cardIndex < cards.length / 2
      const delay = i * 0.08

      wingTl
        .to(card, {
          x: 0,
          scale: 1,
          opacity: 1,
          rotationY: 0,
          duration: 0.6,
          ease: 'power3.out',
          onComplete: () => {
            // 落地回弹
            gsap.to(card, {
              x: isLeft ? 3 : -3,
              duration: 0.08,
              ease: 'power2.out',
              yoyo: true,
              repeat: 1
            })
            // 阴影加深
            gsap.to(card.querySelector('.card-shadow'), {
              opacity: 0.3,
              scale: 1,
              duration: 0.3,
              ease: 'power2.out'
            })
          }
        }, delay)
    })

    cleanupFns.push({ kill: () => wingTl.kill() })

    // 全局亮度统一
    const brightnessTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.value,
        start: 'center center',
        end: 'bottom 60%',
        scrub: 1
      }
    })

    brightnessTl.to(cardGridRef.value, {
      filter: 'brightness(1)',
      duration: 1
    })

    cleanupFns.push({ kill: () => brightnessTl.kill() })

    // 内容入场
    const contentTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.value,
        start: 'top 75%',
        toggleActions: 'play none none reverse'
      }
    })

    contentTl
      .fromTo(subtitleRef.value,
        { opacity: 0, x: -30, letterSpacing: '0.5em' },
        { opacity: 1, x: 0, letterSpacing: '0.3em', duration: 0.8, ease: 'power2.out' }
      )
      .fromTo(titleRef.value,
        { opacity: 0, y: 40, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power2.out' },
        '-=0.4'
      )
      .fromTo(descRef.value,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        '-=0.3'
      )
      .fromTo(progressRef.value,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: 'power2.out' },
        '-=0.2'
      )

    cleanupFns.push({ kill: () => contentTl.kill() })

    // 滚动视差
    const parallaxTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.value,
        start: 'top 100%',
        end: 'bottom 20%',
        scrub: 1.5
      }
    })

    parallaxTl
      .to(cardGridRef.value, { y: '-8%', duration: 1 }, 0)
      .to(contentRef.value, { y: '-20%', duration: 1 }, 0)
      .to(centerLineRef.value, { y: '-5%', duration: 1 }, 0)

    cleanupFns.push({ kill: () => parallaxTl.kill() })

    // 角落装饰入场
    gsap.fromTo(cornerTlRef.value,
      { opacity: 0, x: -20, y: -20 },
      {
        opacity: 1, x: 0, y: 0, duration: 1, ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.value,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    )

    gsap.fromTo(cornerBrRef.value,
      { opacity: 0, x: 20, y: 20 },
      {
        opacity: 1, x: 0, y: 0, duration: 1, ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.value,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    )

  }, containerRef.value)

  cleanupFns.push({ kill: () => ctx.revert() })
}

function handleMouseMove(e: MouseEvent) {
  const x = e.clientX / window.innerWidth
  const y = e.clientY / window.innerHeight

  // 卡片微旋转跟随
  cardRefs.forEach((card, index) => {
    if (!card) return

    const offsetX = (x - 0.5) * 8
    const offsetY = (y - 0.5) * 5

    gsap.to(card, {
      rotateY: offsetX * (index < cards.length / 2 ? 1 : -1),
      rotateX: -offsetY,
      duration: 1,
      ease: 'power2.out'
    })
  })

  // 中心线跟随
  if (centerLineRef.value) {
    gsap.to(centerLineRef.value, {
      x: (x - 0.5) * 20,
      duration: 1.5,
      ease: 'power2.out'
    })
  }
}

function handleMouseLeave() {
  cardRefs.forEach((card) => {
    if (!card) return

    gsap.to(card, {
      rotateY: 0,
      rotateX: 0,
      duration: 1.5,
      ease: 'elastic.out(1, 0.5)'
    })
  })

  if (centerLineRef.value) {
    gsap.to(centerLineRef.value, {
      x: 0,
      duration: 2,
      ease: 'elastic.out(1, 0.5)'
    })
  }
}

onMounted(() => {
  initScrollAnimation()

  if (containerRef.value) {
    containerRef.value.addEventListener('mousemove', handleMouseMove)
    containerRef.value.addEventListener('mouseleave', handleMouseLeave)
  }
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn.kill())

  if (containerRef.value) {
    containerRef.value.removeEventListener('mousemove', handleMouseMove)
    containerRef.value.removeEventListener('mouseleave', handleMouseLeave)
  }

  ScrollTrigger.getAll().forEach(st => {
    if (st.vars.trigger === containerRef.value) {
      st.kill()
    }
  })
})
</script>

<style scoped lang="scss">
.twin-wings-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    #0d1117 0%,
    #161b22 30%,
    #1a1f26 50%,
    #161b22 70%,
    #0d1117 100%
  );
  cursor: crosshair;
}

// 背景
.wings-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;

  .bg-gradient {
    position: absolute;
    inset: 0;
    background: radial-gradient(
      ellipse 100% 80% at 50% 50%,
      rgba(40, 60, 80, 0.3) 0%,
      transparent 60%
    );
  }

  .bg-pattern {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
    background-size: 40px 40px;
  }
}

// 卡片网格
.card-grid {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 20px;
  z-index: 5;
  filter: brightness(0.9);
  perspective: 1000px;
}

.wing-card {
  width: 200px;
  height: 280px;
  position: relative;
  transform-style: preserve-3d;

  .card-inner {
    width: 100%;
    height: 100%;
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    transform-style: preserve-3d;

    .card-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .card-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        180deg,
        transparent 40%,
        rgba(0, 0, 0, 0.8) 100%
      );
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 20px;
      opacity: 0;
      transition: opacity 0.3s ease;

      .card-title {
        font-family: 'Noto Serif SC', Georgia, serif;
        font-size: 1.4rem;
        font-weight: 600;
        color: #fff;
        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
      }

      .card-subtitle {
        font-family: 'Cormorant Garamond', Georgia, serif;
        font-size: 0.85rem;
        color: rgba(255, 255, 255, 0.7);
        margin-top: 5px;
      }
    }

    &:hover .card-overlay {
      opacity: 1;
    }

    &:hover .card-image {
      transform: scale(1.05);
    }
  }

  .card-shadow {
    position: absolute;
    bottom: -15px;
    left: 5%;
    width: 90%;
    height: 30px;
    background: radial-gradient(
      ellipse at center,
      rgba(0, 0, 0, 0.5) 0%,
      transparent 70%
    );
    filter: blur(10px);
    transform: scale(0.8);
  }
}

// 中心指示线
.center-line {
  position: absolute;
  top: 10%;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 4;
  pointer-events: none;

  .line-vertical {
    width: 1px;
    height: 100%;
    background: linear-gradient(
      180deg,
      transparent,
      rgba(100, 150, 200, 0.3) 30%,
      rgba(100, 150, 200, 0.3) 70%,
      transparent
    );
  }

  .line-glow {
    position: absolute;
    top: 0;
    left: -10px;
    width: 20px;
    height: 100%;
    background: radial-gradient(
      ellipse at center,
      rgba(100, 150, 200, 0.15) 0%,
      transparent 70%
    );
  }
}

// 内容区域
.wings-content {
  position: absolute;
  top: 15%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  text-align: center;
  pointer-events: none;
}

.content-inner {
  padding: 1rem;
}

.wings-subtitle {
  font-family: 'Courier New', monospace;
  font-size: clamp(0.65rem, 1vw, 0.8rem);
  font-weight: 400;
  letter-spacing: 0.3em;
  color: rgba(100, 150, 200, 0.6);
  margin: 0 0 1rem 0;
  text-transform: uppercase;
}

.wings-title {
  font-family: 'Noto Serif SC', Georgia, serif;
  font-size: clamp(3rem, 8vw, 5rem);
  font-weight: 200;
  line-height: 1.1;
  color: #fff;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.1em;
  text-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);

  .title-line {
    display: block;
  }

  .accent {
    background: linear-gradient(
      135deg,
      rgba(100, 150, 200, 0.9) 0%,
      rgba(150, 200, 255, 0.8) 50%,
      rgba(100, 150, 200, 0.9) 100%
    );
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

.wings-desc {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(0.9rem, 1.5vw, 1.1rem);
  font-weight: 400;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.5);
  margin: 1.5rem 0 0 0;
  letter-spacing: 0.1em;
}

// 入场指示
.wings-progress {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;

  .progress-text {
    font-family: 'Courier New', monospace;
    font-size: 0.6rem;
    letter-spacing: 0.4em;
    color: rgba(100, 150, 200, 0.4);
    text-transform: uppercase;
  }
}

// 角落装饰
.corner-deco {
  position: absolute;
  width: 50px;
  height: 50px;
  color: rgba(100, 150, 200, 0.3);
  z-index: 20;

  &.corner-tl {
    top: 25px;
    left: 25px;
  }

  &.corner-br {
    bottom: 25px;
    right: 25px;
  }
}
</style>
