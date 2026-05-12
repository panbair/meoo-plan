<template>
  <section ref="containerRef" class="ripple-section">
    <!-- 深色背景 -->
    <div ref="bgRef" class="ripple-bg">
      <div class="bg-gradient" />
      <div class="bg-particles">
        <div v-for="i in 40" :key="i" class="bg-dot" :style="getDotStyle(i)" />
      </div>
    </div>

    <!-- 中心涟漪原点 -->
    <div ref="centerRef" class="ripple-origin">
      <div class="origin-core" />
      <div class="origin-ring" />
      <div class="origin-pulse" />
    </div>

    <!-- 涟漪波纹 -->
    <div class="ripple-waves">
      <div v-for="i in 5" :key="i" :ref="el => setWaveRef(el, i)" class="ripple-wave" :class="`wave-${i}`" />
    </div>

    <!-- 环形卡片排列 -->
    <div ref="ringRef" class="ripple-ring-container">
      <div
        v-for="(card, i) in cards"
        :key="card.id"
        :ref="el => setCardRef(el, i)"
        class="ripple-card"
        :class="`card-${i}`"
      >
        <div class="card-inner">
          <img :src="card.url" :alt="card.title" class="card-image" />
          <div class="card-shine" />
          <div class="card-content">
            <span class="card-num">{{ String(i + 1).padStart(2, '0') }}</span>
            <h3 class="card-title">{{ card.title }}</h3>
          </div>
        </div>
        <div class="card-burst" />
      </div>
    </div>

    <!-- 全局亮度遮罩 -->
    <div ref="brightnessRef" class="brightness-overlay" />

    <!-- 信息面板 -->
    <div ref="infoRef" class="ripple-info">
      <div class="info-tag">涟漪绽放</div>
      <h2 ref="titleRef" class="info-title">Ripple Unfold</h2>
      <p ref="subtitleRef" class="info-subtitle">中心奇点释放涟漪，精密优雅的扩散仪式</p>
      <div ref="progressRef" class="info-progress">
        <div class="progress-fill" />
      </div>
    </div>

    <!-- 进度指示器 -->
    <div ref="indicatorRef" class="ripple-indicator">
      <span class="indicator-label">RIPPLE</span>
      <span ref="progressTextRef" class="indicator-value">0%</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Card {
  id: number
  url: string
  title: string
}

const cards: Card[] = [
  { id: 1, url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80', title: '群峰' },
  { id: 2, url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80', title: '峭壁' },
  { id: 3, url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80', title: '星河' },
  { id: 4, url: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=600&q=80', title: '极光' },
  { id: 5, url: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600&q=80', title: '飞瀑' },
  { id: 6, url: 'https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=600&q=80', title: '冰川' },
]

const containerRef = ref<HTMLElement | null>(null)
const bgRef = ref<HTMLElement | null>(null)
const centerRef = ref<HTMLElement | null>(null)
const ringRef = ref<HTMLElement | null>(null)
const brightnessRef = ref<HTMLElement | null>(null)
const infoRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const progressRef = ref<HTMLElement | null>(null)
const indicatorRef = ref<HTMLElement | null>(null)
const progressTextRef = ref<HTMLElement | null>(null)

const cardRefs = ref<(HTMLElement | null)[]>([])
const waveRefs = ref<(HTMLElement | null)[]>([])

const setCardRef = (el: HTMLElement | null, index: number) => {
  cardRefs.value[index] = el
}

const setWaveRef = (el: HTMLElement | null, index: number) => {
  waveRefs.value[index] = el
}

const getDotStyle = (i: number) => {
  const x = Math.random() * 100
  const y = Math.random() * 100
  const delay = Math.random() * 3
  const duration = 4 + Math.random() * 4
  return {
    left: `${x}%`,
    top: `${y}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
  }
}

const cleanupFns: Array<() => void> = []

onMounted(async () => {
  await nextTick()

  const container = containerRef.value
  const ring = ringRef.value
  if (!container || !ring) return

  // 计算环形排列的位置（以视口中心为圆心）
  const centerX = window.innerWidth / 2
  const centerY = window.innerHeight / 2
  const radiusX = Math.min(centerX * 0.6, 400) // 水平半径
  const radiusY = Math.min(centerY * 0.5, 280) // 垂直半径
  const cardAngle = (2 * Math.PI) / cards.length

  // 计算每张卡片的最终位置
  const positions = cards.map((_, i) => {
    const angle = cardAngle * i - Math.PI / 2 // 从顶部开始
    return {
      x: Math.cos(angle) * radiusX,
      y: Math.sin(angle) * radiusY,
    }
  })

  // 初始化所有卡片在中心
  cardRefs.value.forEach((card) => {
    if (card) {
      gsap.set(card, {
        x: 0,
        y: 0,
        scale: 0,
        opacity: 0,
        transformOrigin: 'center center',
      })
    }
  })

  // 初始化波纹
  waveRefs.value.forEach((wave) => {
    if (wave) {
      gsap.set(wave, {
        scale: 0,
        opacity: 0,
        transformOrigin: 'center center',
      })
    }
  })

  // 创建涟漪扩散时间线
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top 100%',
      end: 'bottom 20%',
      scrub: 1.5,
      onUpdate: (self) => {
        const progress = Math.round(self.progress * 100)
        if (progressTextRef.value) {
          progressTextRef.value.textContent = `${progress}%`
        }
        if (progressRef.value) {
          const fill = progressRef.value.querySelector('.progress-fill') as HTMLElement
          if (fill) {
            gsap.set(fill, { scaleX: self.progress })
          }
        }
      },
    },
  })

  // 中心原点脉动
  tl.fromTo(
    centerRef.value,
    { scale: 0, opacity: 1 },
    { scale: 2, opacity: 0, duration: 0.8, ease: 'power2.out' },
    0
  )

  // 波纹依次扩散
  waveRefs.value.forEach((wave, i) => {
    if (!wave) return
    tl.fromTo(
      wave,
      { scale: 0, opacity: 0.6 },
      {
        scale: 12 + i * 2,
        opacity: 0,
        duration: 1.2,
        ease: 'power1.out',
      },
      i * 0.12
    )
  })

  // 卡片依次扩散 - 按角度顺序
  cards.forEach((_, i) => {
    const card = cardRefs.value[i]
    if (!card) return

    const delay = i * 0.08

    tl.to(card, {
      x: positions[i].x,
      y: positions[i].y,
      scale: 1,
      opacity: 1,
      duration: 0.5,
      ease: 'back.out(1.4)',
    }, delay)

    // 扩散时的爆发光效
    tl.fromTo(
      card.querySelector('.card-burst') as HTMLElement,
      { scale: 0, opacity: 0.8 },
      { scale: 2, opacity: 0, duration: 0.4, ease: 'power2.out' },
      delay + 0.3
    )
  })

  // 全局亮度变化
  if (brightnessRef.value) {
    tl.fromTo(
      brightnessRef.value,
      { opacity: 0.2 },
      { opacity: 0, duration: 1.5 },
      0
    )
  }

  cleanupFns.push(() => {
    tl.kill()
    ScrollTrigger.getAll().forEach(st => st.kill())
  })

  // 内容入场动画
  if (titleRef.value && subtitleRef.value) {
    gsap.set([titleRef.value, subtitleRef.value], { opacity: 0, y: 30 })
    gsap.set(infoRef.value, { opacity: 0 })

    const contentTl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top 60%',
        toggleActions: 'play none none reverse',
      },
    })

    contentTl
      .to(infoRef.value, { opacity: 1, duration: 0.4 })
      .to(titleRef.value, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2')
      .to(subtitleRef.value, { opacity: 1, y: 0, duration: 0.4 }, '-=0.3')

    cleanupFns.push(() => contentTl.kill())
  }

  // 卡片悬停效果
  cardRefs.value.forEach((card) => {
    if (!card) return

    const handleMouseEnter = () => {
      gsap.to(card, {
        scale: 1.1,
        duration: 0.3,
        ease: 'power2.out',
      })
      const content = card.querySelector('.card-content') as HTMLElement
      if (content) gsap.to(content, { opacity: 1, y: 0, duration: 0.3 })
    }

    const handleMouseLeave = () => {
      gsap.to(card, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      })
      const content = card.querySelector('.card-content') as HTMLElement
      if (content) gsap.to(content, { opacity: 0, y: 10, duration: 0.3 })
    }

    card.addEventListener('mouseenter', handleMouseEnter)
    card.addEventListener('mouseleave', handleMouseLeave)

    cleanupFns.push(() => {
      card.removeEventListener('mouseenter', handleMouseEnter)
      card.removeEventListener('mouseleave', handleMouseLeave)
    })
  })

  // 背景粒子动画
  const dots = bgRef.value?.querySelectorAll('.bg-dot')
  dots?.forEach((dot) => {
    gsap.to(dot, {
      y: -20,
      opacity: 0.5,
      duration: 3 + Math.random() * 2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    })
  })

  // 完成后卡片低频呼吸
  ScrollTrigger.create({
    trigger: container,
    start: 'bottom 20%',
    onEnter: () => {
      cardRefs.value.forEach((card, i) => {
        if (!card) return
        gsap.to(card, {
          y: '+=2',
          duration: 2 + i * 0.3,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        })
      })
    },
  })
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(st => st.kill())
  gsap.killTweensOf('*')
})
</script>

<style scoped lang="scss">
.ripple-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(160deg, #0a0a1f 0%, #1a1a3e 50%, #0d0d2b 100%);
  font-family: 'system-ui', -apple-system, sans-serif;
}

.ripple-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;

  .bg-gradient {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at center, rgba(100, 150, 255, 0.1) 0%, transparent 60%);
  }

  .bg-particles {
    position: absolute;
    inset: 0;
  }

  .bg-dot {
    position: absolute;
    width: 2px;
    height: 2px;
    background: rgba(150, 200, 255, 0.5);
    border-radius: 50%;
    opacity: 0.3;
  }
}

.ripple-origin {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;
  pointer-events: none;

  .origin-core {
    width: 16px;
    height: 16px;
    background: radial-gradient(circle, rgba(100, 220, 255, 1) 0%, rgba(100, 180, 255, 0) 70%);
    border-radius: 50%;
    box-shadow: 0 0 40px rgba(100, 220, 255, 0.8);
  }

  .origin-ring {
    position: absolute;
    inset: -8px;
    border: 2px solid rgba(100, 220, 255, 0.3);
    border-radius: 50%;
  }

  .origin-pulse {
    position: absolute;
    inset: -20px;
    border: 1px solid rgba(100, 220, 255, 0.2);
    border-radius: 50%;
    animation: origin-pulse 2s ease-out infinite;
  }
}

@keyframes origin-pulse {
  0% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

.ripple-waves {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 3;
}

.ripple-wave {
  position: absolute;
  width: 80px;
  height: 80px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid rgba(100, 220, 255, 0.4);
  border-radius: 50%;
  box-shadow:
    0 0 20px rgba(100, 220, 255, 0.2),
    inset 0 0 20px rgba(100, 220, 255, 0.1);
}

.ripple-ring-container {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}

.ripple-card {
  position: absolute;
  width: 180px;
  height: 240px;
  cursor: pointer;
  transform: translate(-50%, -50%);

  .card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 16px;
    overflow: hidden;
    box-shadow:
      0 20px 60px rgba(0, 0, 0, 0.5),
      0 0 1px rgba(255, 255, 255, 0.2);

    .card-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .card-shine {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.1) 0%,
        transparent 50%,
        rgba(100, 200, 255, 0.05) 100%
      );
      pointer-events: none;
    }

    .card-content {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 20px;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 100%);
      opacity: 0;
      transform: translateY(10px);

      .card-num {
        display: block;
        font-size: 11px;
        font-weight: 600;
        color: rgba(100, 220, 255, 0.8);
        letter-spacing: 1px;
        margin-bottom: 4px;
      }

      .card-title {
        font-size: 18px;
        font-weight: 700;
        color: #fff;
        margin: 0;
      }
    }
  }

  .card-burst {
    position: absolute;
    inset: -20px;
    background: radial-gradient(circle, rgba(100, 220, 255, 0.4) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    opacity: 0;
  }

  &:hover .card-inner {
    box-shadow:
      0 25px 70px rgba(0, 0, 0, 0.6),
      0 0 30px rgba(100, 220, 255, 0.2);
  }
}

.brightness-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.1);
  pointer-events: none;
  z-index: 15;
  opacity: 0;
}

.ripple-info {
  position: absolute;
  bottom: 80px;
  left: 80px;
  z-index: 20;

  .info-tag {
    display: inline-block;
    padding: 8px 16px;
    background: rgba(100, 220, 255, 0.12);
    border: 1px solid rgba(100, 220, 255, 0.3);
    border-radius: 24px;
    font-size: 11px;
    font-weight: 600;
    color: rgba(100, 220, 255, 0.9);
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 20px;
  }

  .info-title {
    font-size: 42px;
    font-weight: 800;
    color: #fff;
    margin: 0 0 16px 0;
    text-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
  }

  .info-subtitle {
    font-size: 15px;
    color: rgba(255, 255, 255, 0.5);
    margin: 0 0 24px 0;
    max-width: 360px;
    line-height: 1.6;
  }

  .info-progress {
    width: 240px;
    height: 3px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    overflow: hidden;

    .progress-fill {
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, rgba(100, 220, 255, 0.4), rgba(100, 220, 255, 1));
      transform-origin: left;
      transform: scaleX(0);
    }
  }
}

.ripple-indicator {
  position: absolute;
  bottom: 80px;
  right: 80px;
  z-index: 20;
  text-align: right;

  .indicator-label {
    display: block;
    font-size: 10px;
    font-weight: 600;
    color: rgba(100, 220, 255, 0.4);
    letter-spacing: 3px;
    margin-bottom: 8px;
  }

  .indicator-value {
    font-size: 48px;
    font-weight: 800;
    color: rgba(255, 255, 255, 0.8);
    font-variant-numeric: tabular-nums;
    line-height: 1;
  }
}
</style>
