<template>
  <div ref="containerRef" class="maglev-container">
    <!-- 背景 -->
    <div ref="bgRef" class="maglev-bg">
      <div class="bg-gradient" />
      <div class="bg-grid" />
      <!-- 磁场线 -->
      <div ref="fieldLinesRef" class="field-lines">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
          <path
            v-for="i in 8"
            :key="i"
            :d="`M ${i * 12.5} 0 Q ${i * 12.5 + (i % 2 ? 5 : -5)} 50 ${i * 12.5} 100`"
            class="field-path"
            :style="{ animationDelay: `${i * 0.2}s` }"
          />
        </svg>
      </div>
    </div>

    <!-- 卡片网格 -->
    <div ref="cardGridRef" class="card-grid">
      <!-- 第一行 -->
      <div class="card-row">
        <div
          v-for="(card, index) in row1Cards"
          :key="card.id"
          :ref="el => setCardRef(el as HTMLElement | null, index)"
          class="maglev-card"
          :class="`card-${index}`"
        >
          <div class="card-inner">
            <img :src="card.url" :alt="card.title" class="card-image" />
            <div class="card-shine" />
          </div>
          <div class="card-reflection" />
          <div ref="rippleRefs" class="card-ripple" />
        </div>
      </div>

      <!-- 第二行 -->
      <div class="card-row">
        <div
          v-for="(card, index) in row2Cards"
          :key="card.id"
          :ref="el => setCardRef(el as HTMLElement | null, index + 3)"
          class="maglev-card"
          :class="`card-${index + 3}`"
        >
          <div class="card-inner">
            <img :src="card.url" :alt="card.title" class="card-image" />
            <div class="card-shine" />
          </div>
          <div class="card-reflection" />
          <div class="card-ripple" />
        </div>
      </div>

      <!-- 第三行 -->
      <div class="card-row">
        <div
          v-for="(card, index) in row3Cards"
          :key="card.id"
          :ref="el => setCardRef(el as HTMLElement | null, index + 6)"
          class="maglev-card"
          :class="`card-${index + 6}`"
        >
          <div class="card-inner">
            <img :src="card.url" :alt="card.title" class="card-image" />
            <div class="card-shine" />
          </div>
          <div class="card-reflection" />
          <div class="card-ripple" />
        </div>
      </div>
    </div>

    <!-- 磁力线 SVG -->
    <svg ref="magneticLinesRef" class="magnetic-lines">
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color: rgba(100, 200, 255, 0)" />
          <stop offset="50%" style="stop-color: rgba(100, 200, 255, 0.4)" />
          <stop offset="100%" style="stop-color: rgba(100, 200, 255, 0)" />
        </linearGradient>
      </defs>
    </svg>

    <!-- 内容区域 -->
    <div ref="contentRef" class="maglev-content">
      <div class="content-inner">
        <h2 ref="subtitleRef" class="maglev-subtitle">MAGLEV ARRAY</h2>
        <h1 ref="titleRef" class="maglev-title">
          <span class="title-line">磁浮</span>
          <span class="title-line accent">编队</span>
        </h1>
        <p ref="descRef" class="maglev-desc">
          磁场约束 精密吸附<br />
          悬浮编队的入场仪式
        </p>
      </div>
    </div>

    <!-- 磁场强度指示 -->
    <div ref="fieldMeterRef" class="field-meter">
      <div class="meter-label">FIELD</div>
      <div class="meter-bar">
        <div ref="meterFillRef" class="meter-fill" />
      </div>
    </div>

    <!-- 角落装饰 -->
    <svg ref="cornerTlRef" class="corner-deco corner-tl" viewBox="0 0 60 60">
      <circle cx="0" cy="0" r="3" fill="currentColor" />
      <line x1="0" y1="0" x2="25" y2="0" stroke="currentColor" stroke-width="1" />
      <line x1="0" y1="0" x2="0" y2="25" stroke="currentColor" stroke-width="1" />
    </svg>
    <svg ref="cornerBrRef" class="corner-deco corner-br" viewBox="0 0 60 60">
      <circle cx="60" cy="60" r="3" fill="currentColor" />
      <line x1="60" y1="60" x2="35" y2="60" stroke="currentColor" stroke-width="1" />
      <line x1="60" y1="60" x2="60" y2="35" stroke="currentColor" stroke-width="1" />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
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
}

// 9张卡片数据
const allCards: Card[] = [
  { id: 1, url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80', title: '山峰' },
  { id: 2, url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80', title: '峭壁' },
  { id: 3, url: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=400&q=80', title: '极光' },
  { id: 4, url: 'https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=400&q=80', title: '冰川' },
  { id: 5, url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&q=80', title: '星河' },
  { id: 6, url: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&q=80', title: '飞瀑' },
  { id: 7, url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=80', title: '城市' },
  { id: 8, url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&q=80', title: '湖泊' },
  { id: 9, url: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=400&q=80', title: '森林' },
]

const row1Cards = computed(() => allCards.slice(0, 3))
const row2Cards = computed(() => allCards.slice(3, 6))
const row3Cards = computed(() => allCards.slice(6, 9))

const containerRef = ref<HTMLElement | null>(null)
const bgRef = ref<HTMLElement | null>(null)
const cardGridRef = ref<HTMLElement | null>(null)
const fieldLinesRef = ref<HTMLElement | null>(null)
const magneticLinesRef = ref<SVGElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const descRef = ref<HTMLElement | null>(null)
const fieldMeterRef = ref<HTMLElement | null>(null)
const meterFillRef = ref<HTMLElement | null>(null)
const cornerTlRef = ref<SVGElement | null>(null)
const cornerBrRef = ref<SVGElement | null>(null)

const cardRefs: (HTMLElement | null)[] = []
const cleanupFns: TweenCleanup[] = []
let microFloatTimelines: gsap.core.Tween[] = []
let magneticLineInterval: number | null = null

function setCardRef(el: HTMLElement | null, index: number) {
  cardRefs[index] = el
}

function initScrollAnimation() {
  if (!containerRef.value) return

  const ctx = gsap.context(() => {
    // 磁场线入场
    gsap.set(fieldLinesRef.value, { opacity: 0 })
    gsap.set(fieldMeterRef.value, { opacity: 0 })

    // 初始悬浮状态
    cardRefs.forEach((card, index) => {
      if (!card) return

      const row = Math.floor(index / 3)
      const randomX = (Math.random() - 0.5) * 30
      const randomRotateX = (Math.random() - 0.5) * 6
      const randomRotateY = (Math.random() - 0.5) * 6

      gsap.set(card, {
        y: -50 - row * 30,
        x: randomX,
        rotateX: randomRotateX,
        rotateY: randomRotateY,
        opacity: 0.85 + Math.random() * 0.1,
        scale: 0.95 + Math.random() * 0.05
      })
    })

    // 主吸附动画
    const magnetTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.value,
        start: 'top 80%',
        end: 'center center',
        scrub: 1.5
      }
    })

    // 磁场增强
    magnetTl
      .to(fieldLinesRef.value, {
        opacity: 0.6,
        duration: 0.5,
        ease: 'power2.out'
      }, 0)
      .to(fieldMeterRef.value, {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out'
      }, 0)
      .to(meterFillRef.value, {
        scaleX: 1,
        duration: 1,
        ease: 'power2.inOut'
      }, 0)

    // 第一行吸附 (delay: 0.1s)
    cardRefs.slice(0, 3).forEach((card, i) => {
      if (!card) return

      magnetTl.to(card, {
        y: 0,
        x: 0,
        rotateX: 0,
        rotateY: 0,
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: 'power4.in',
        onComplete: () => {
          // 触地回弹
          gsap.to(card, {
            y: -3,
            duration: 0.08,
            ease: 'power2.out',
            yoyo: true,
            repeat: 1
          })
          // 波纹效果
          triggerRipple(card)
        }
      }, 0.1 + i * 0.05)
    })

    // 第二行吸附 (delay: 0.07s 间隔)
    cardRefs.slice(3, 6).forEach((card, i) => {
      if (!card) return

      magnetTl.to(card, {
        y: 0,
        x: 0,
        rotateX: 0,
        rotateY: 0,
        opacity: 1,
        scale: 1,
        duration: 0.55,
        ease: 'power4.in',
        onComplete: () => {
          gsap.to(card, {
            y: -3,
            duration: 0.08,
            ease: 'power2.out',
            yoyo: true,
            repeat: 1
          })
          triggerRipple(card)
        }
      }, 0.35 + i * 0.04)
    })

    // 第三行吸附 (delay: 0.04s 间隔)
    cardRefs.slice(6, 9).forEach((card, i) => {
      if (!card) return

      magnetTl.to(card, {
        y: 0,
        x: 0,
        rotateX: 0,
        rotateY: 0,
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: 'power4.in',
        onComplete: () => {
          gsap.to(card, {
            y: -3,
            duration: 0.08,
            ease: 'power2.out',
            yoyo: true,
            repeat: 1
          })
          triggerRipple(card)
        }
      }, 0.6 + i * 0.03)
    })

    cleanupFns.push({ kill: () => magnetTl.kill() })

    // 全部锁定后进入微浮状态
    magnetTl.call(() => {
      initMicroFloat()
      initMagneticLines()
    }, [], 0.8)

    // 内容入场
    const contentTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.value,
        start: 'top 70%',
        toggleActions: 'play none none reverse'
      }
    })

    contentTl
      .fromTo(subtitleRef.value,
        { opacity: 0, y: 20, letterSpacing: '0.4em' },
        { opacity: 1, y: 0, letterSpacing: '0.25em', duration: 0.8, ease: 'power2.out' }
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

    cleanupFns.push({ kill: () => contentTl.kill() })

    // 角落装饰
    gsap.fromTo(cornerTlRef.value,
      { opacity: 0, x: -15, y: -15 },
      { opacity: 1, x: 0, y: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: containerRef.value, start: 'top 80%', toggleActions: 'play none none reverse' }
      }
    )

    gsap.fromTo(cornerBrRef.value,
      { opacity: 0, x: 15, y: 15 },
      { opacity: 1, x: 0, y: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: containerRef.value, start: 'top 80%', toggleActions: 'play none none reverse' }
      }
    )

  }, containerRef.value)

  cleanupFns.push({ kill: () => ctx.revert() })
}

function triggerRipple(card: HTMLElement) {
  const ripple = card.querySelector('.card-ripple') as HTMLElement
  if (!ripple) return

  gsap.fromTo(ripple,
    { scale: 0, opacity: 0.5 },
    {
      scale: 3,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.out'
    }
  )
}

function initMicroFloat() {
  cardRefs.forEach((card, index) => {
    if (!card) return

    const floatTl = gsap.timeline({ repeat: -1, yoyo: true })

    floatTl.to(card, {
      y: '+=1',
      duration: 3 + Math.random(),
      ease: 'sine.inOut'
    })

    microFloatTimelines.push(floatTl.tween as gsap.core.Tween)
  })
}

function initMagneticLines() {
  const svg = magneticLinesRef.value
  if (!svg) return

  magneticLineInterval = window.setInterval(() => {
    if (!svg) return

    // 随机创建一条磁力线
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    const x1 = 20 + Math.random() * 60
    const y1 = 30 + Math.random() * 40
    const x2 = x1 + (Math.random() - 0.5) * 30
    const y2 = y1 + (Math.random() - 0.5) * 30

    line.setAttribute('x1', `${x1}%`)
    line.setAttribute('y1', `${y1}%`)
    line.setAttribute('x2', `${x2}%`)
    line.setAttribute('y2', `${y2}%`)
    line.setAttribute('stroke', 'rgba(100, 200, 255, 0.4)')
    line.setAttribute('stroke-width', '0.5')
    line.setAttribute('stroke-linecap', 'round')

    svg.appendChild(line)

    // 淡入淡出
    gsap.fromTo(line,
      { opacity: 0, attr: { x1, y1, x2, y2 } },
      {
        opacity: 0.5,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          gsap.to(line, {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.out',
            onComplete: () => line.remove()
          })
        }
      }
    )
  }, 800 + Math.random() * 400)
}

function handleMouseMove(e: MouseEvent) {
  const x = e.clientX / window.innerWidth
  const y = e.clientY / window.innerHeight

  // 磁场线跟随鼠标
  if (fieldLinesRef.value) {
    gsap.to(fieldLinesRef.value, {
      x: (x - 0.5) * 10,
      duration: 1,
      ease: 'power2.out'
    })
  }

  // 卡片微响应
  cardRefs.forEach((card, index) => {
    if (!card) return

    const offsetX = (x - 0.5) * 3
    const offsetY = (y - 0.5) * 2

    gsap.to(card, {
      y: `+=${offsetY}`,
      x: `+=${offsetX}`,
      duration: 0.8,
      ease: 'power2.out'
    })
  })
}

function handleMouseLeave() {
  if (fieldLinesRef.value) {
    gsap.to(fieldLinesRef.value, {
      x: 0,
      duration: 1.5,
      ease: 'elastic.out(1, 0.5)'
    })
  }

  cardRefs.forEach((card) => {
    if (!card) return

    gsap.to(card, {
      x: 0,
      y: '+=0',
      duration: 1.5,
      ease: 'elastic.out(1, 0.5)'
    })
  })
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

  microFloatTimelines.forEach(tween => tween?.kill())

  if (magneticLineInterval) {
    clearInterval(magneticLineInterval)
  }

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
.maglev-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(
    180deg,
    #0a0e14 0%,
    #0f1419 30%,
    #141a21 50%,
    #0f1419 70%,
    #0a0e14 100%
  );
  cursor: crosshair;
}

// 背景
.maglev-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;

  .bg-gradient {
    position: absolute;
    inset: 0;
    background: radial-gradient(
      ellipse 100% 60% at 50% 80%,
      rgba(20, 60, 100, 0.3) 0%,
      transparent 60%
    );
  }

  .bg-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(100, 180, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(100, 180, 255, 0.03) 1px, transparent 1px);
    background-size: 50px 50px;
  }
}

// 磁场线
.field-lines {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  opacity: 0;

  svg {
    width: 100%;
    height: 100%;
  }

  .field-path {
    fill: none;
    stroke: rgba(100, 200, 255, 0.15);
    stroke-width: 0.5;
    animation: fieldPulse 3s ease-in-out infinite;
  }
}

@keyframes fieldPulse {
  0%, 100% { opacity: 0.1; }
  50% { opacity: 0.3; }
}

// 卡片网格
.card-grid {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  gap: 25px;
  z-index: 10;
  perspective: 1200px;
}

.card-row {
  display: flex;
  gap: 25px;
  justify-content: center;
}

.maglev-card {
  width: 180px;
  height: 240px;
  position: relative;
  transform-style: preserve-3d;
  will-change: transform;

  .card-inner {
    width: 100%;
    height: 100%;
    border-radius: 16px;
    overflow: hidden;
    position: relative;
    background: rgba(20, 30, 40, 0.8);
    border: 1px solid rgba(100, 180, 255, 0.15);
    box-shadow:
      0 10px 40px rgba(0, 0, 0, 0.4),
      0 0 20px rgba(100, 180, 255, 0.1);

    .card-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.9;
    }

    .card-shine {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 50%;
      background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.1) 0%,
        transparent 100%
      );
      pointer-events: none;
    }
  }

  .card-reflection {
    position: absolute;
    bottom: -20px;
    left: 5%;
    width: 90%;
    height: 20px;
    background: linear-gradient(
      180deg,
      rgba(100, 180, 255, 0.15) 0%,
      transparent 100%
    );
    filter: blur(8px);
    transform: scaleY(-1);
    opacity: 0.5;
  }

  .card-ripple {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100px;
    height: 100px;
    transform: translate(-50%, -50%) scale(0);
    border-radius: 50%;
    border: 1px solid rgba(100, 200, 255, 0.4);
    pointer-events: none;
    opacity: 0;
  }
}

// 磁力线 SVG
.magnetic-lines {
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;
  width: 100%;
  height: 100%;
}

// 内容区域
.maglev-content {
  position: absolute;
  top: 12%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 25;
  text-align: center;
  pointer-events: none;
}

.content-inner {
  padding: 1rem;
}

.maglev-subtitle {
  font-family: 'Courier New', monospace;
  font-size: clamp(0.6rem, 1vw, 0.75rem);
  font-weight: 400;
  letter-spacing: 0.3em;
  color: rgba(100, 200, 255, 0.6);
  margin: 0 0 1rem 0;
  text-transform: uppercase;
}

.maglev-title {
  font-family: 'Noto Serif SC', 'STSong', Georgia, serif;
  font-size: clamp(3rem, 8vw, 5rem);
  font-weight: 200;
  line-height: 1.1;
  color: #fff;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.1em;
  text-shadow: 0 4px 30px rgba(100, 180, 255, 0.3);

  .title-line {
    display: block;
  }

  .accent {
    background: linear-gradient(
      135deg,
      rgba(100, 200, 255, 0.9) 0%,
      rgba(150, 220, 255, 0.8) 50%,
      rgba(100, 200, 255, 0.9) 100%
    );
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

.maglev-desc {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(0.9rem, 1.5vw, 1.1rem);
  font-weight: 400;
  line-height: 1.8;
  color: rgba(100, 200, 255, 0.5);
  margin: 1.5rem 0 0 0;
  letter-spacing: 0.1em;
}

// 磁场强度指示
.field-meter {
  position: absolute;
  bottom: 50px;
  right: 50px;
  z-index: 25;
  opacity: 0;
  display: flex;
  align-items: center;
  gap: 12px;

  .meter-label {
    font-family: 'Courier New', monospace;
    font-size: 0.55rem;
    letter-spacing: 0.2em;
    color: rgba(100, 200, 255, 0.5);
  }

  .meter-bar {
    width: 80px;
    height: 2px;
    background: rgba(100, 200, 255, 0.15);
    border-radius: 1px;
    overflow: hidden;

    .meter-fill {
      height: 100%;
      width: 100%;
      background: linear-gradient(90deg, rgba(100, 200, 255, 0.4), rgba(100, 200, 255, 0.9));
      border-radius: 1px;
      transform-origin: left;
      transform: scaleX(0);
    }
  }
}

// 角落装饰
.corner-deco {
  position: absolute;
  width: 50px;
  height: 50px;
  color: rgba(100, 200, 255, 0.25);
  z-index: 25;

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
