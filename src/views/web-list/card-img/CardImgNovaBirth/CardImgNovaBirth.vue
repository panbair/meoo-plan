<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ==================== 图片数据 ====================
interface ImageCard {
  id: number
  url: string
  title: string
  description: string
}

const imageCards: ImageCard[] = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1462332420958-a05d1e002413?w=800&q=80',
    title: '星云诞生',
    description: '宇宙洪荒中的第一道光',
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1451186859696-371d9477be93?w=800&q=80',
    title: '星辰汇聚',
    description: '万千星尘凝为一体',
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    title: '极光绽放',
    description: '穿越大气层的光之舞',
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
    title: '大地回响',
    description: '群山在星光下苏醒',
  }
]

// ==================== Refs ====================
const sectionRef = ref<HTMLElement>()
const cardsContainerRef = ref<HTMLElement>()
const singularityRef = ref<HTMLElement>()
const shockwaveRef = ref<HTMLElement>()
const titleRef = ref<HTMLElement>()
const displacementRef = ref<SVGElement>()

const starRefs = ref<HTMLElement[]>([])
const cardRefs = ref<HTMLElement[]>([])

const setStarRef = (el: any, i: number) => {
  if (el) {
    starRefs.value[i - 1] = el
  }
}
const setCardRef = (el: any, i: number) => {
  if (el) {
    cardRefs.value[i] = el
  }
}

const cleanupFns: Array<() => void> = []

// ==================== 动画编排 ====================
function initAnimations() {
  const section = sectionRef.value
  if (!section) {
    return
  }

  const cards = cardRefs.value.filter(Boolean)
  if (!cards.length) {
    return
  }

  // --- 背景星星闪烁 ---
  starRefs.value.filter(Boolean).forEach((star) => {
    const size = 1 + Math.random() * 2
    gsap.set(star, {
      width: size,
      height: size,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      opacity: 0,
      borderRadius: '50%',
      background: `hsl(${200 + Math.random() * 60}, 80%, ${70 + Math.random() * 30}%)`,
    })
    const tw = gsap.to(star, {
      opacity: 0.3 + Math.random() * 0.7,
      duration: 1.5 + Math.random() * 3,
      repeat: -1,
      yoyo: true,
      delay: Math.random() * 2,
      ease: 'sine.inOut',
    })
    cleanupFns.push(() => tw.kill())
  })

  // --- 初始状态 ---
  cards.forEach((card, i) => {
    gsap.set(card, {
      scale: 0,
      opacity: 0,
      rotation: (i - 1.5) * 90,
      x: 0,
      y: 0,
    })
    const sparks = card.querySelectorAll('.spark')
    gsap.set(sparks, { scale: 0, opacity: 0 })
    const warpLayer = card.querySelector('.card-warp-layer') as HTMLElement
    if (warpLayer) {
      gsap.set(warpLayer, { opacity: 0 })
    }
    const halo = card.querySelector('.card-halo') as HTMLElement
    if (halo) {
      gsap.set(halo, { scale: 0, opacity: 0 })
    }
    const border = card.querySelector('.card-energy-border') as HTMLElement
    if (border) {
      gsap.set(border, { opacity: 0 })
    }
    const overlay = card.querySelector('.card-overlay') as HTMLElement
    if (overlay) {
      gsap.set(overlay, { opacity: 0, y: 30 })
    }
  })

  gsap.set(singularityRef.value, { scale: 0.3, opacity: 0 })
  gsap.set(shockwaveRef.value, { scale: 0, opacity: 0 })
  gsap.set(titleRef.value, { opacity: 0, y: 40 })

  // --- 主时间线 ---
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 100%',
      end: 'bottom -100%',
      scrub: 2,
      toggleActions: 'play reverse play reverse',
    },})

  // ======= 阶段1: 奇点出现 + 脉冲 (0-10%) =======
  tl.to(
    singularityRef.value,
    {
      scale: 1,
      opacity: 1,
      duration: 0.08,
      ease: 'power3.out',
    },
    0,
  )

  tl.to(
    singularityRef.value,
    {
      scale: 1.5,
      duration: 0.04,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut',
    },
    0.06,
  )

  // 标题入场
  tl.to(
    titleRef.value,
    {
      opacity: 1,
      y: 0,
      duration: 0.1,
      ease: 'power2.out',
    },
    0.02,
  )

  // ======= 阶段2: 爆发 — 冲击波 + 卡片从中心飞出 (10-40%) =======
  tl.to(
    shockwaveRef.value,
    {
      scale: 5,
      opacity: 0.7,
      duration: 0.08,
      ease: 'power2.out',
    },
    0.1,
  )
  tl.to(
    shockwaveRef.value,
    {
      scale: 15,
      opacity: 0,
      duration: 0.12,
      ease: 'power1.out',
    },
    0.18,
  )

  tl.to(
    singularityRef.value,
    {
      scale: 0,
      opacity: 0,
      duration: 0.1,
      ease: 'power2.in',
    },
    0.12,
  )

  // SVG 扭曲
  if (displacementRef.value) {
    tl.to(displacementRef.value, { attr: { scale: 40 }, duration: 0.15, ease: 'power2.out' }, 0.1)
    tl.to(displacementRef.value, { attr: { scale: 0 }, duration: 0.2, ease: 'power2.inOut' }, 0.35)
  }

  // 卡片从中心爆炸飞出到 2x2 网格位置
  const positions = [
    { x: -160, y: -140 },
    { x: 160, y: -140 },
    { x: -160, y: 140 },
    { x: 160, y: 140 },
  ]

  cards.forEach((card, i) => {
    const pos = positions[i] || { x: 0, y: 0 }
    const delay = 0.12 + i * 0.03

    tl.to(
      card,
      {
        scale: 1,
        opacity: 1,
        rotation: 0,
        x: pos.x,
        y: pos.y,
        duration: 0.2,
        ease: 'back.out(1.4)',
      },
      delay,
    )

    // 扭曲叠加层短暂闪现
    const warpLayer = card.querySelector('.card-warp-layer') as HTMLElement
    if (warpLayer) {
      tl.to(warpLayer, { opacity: 0.6, duration: 0.08 }, delay)
      tl.to(warpLayer, { opacity: 0, duration: 0.15 }, delay + 0.12)
    }

    // 光环爆发
    const halo = card.querySelector('.card-halo') as HTMLElement
    if (halo) {
      tl.to(
        halo,
        {
          scale: 1.2,
          opacity: 0.5,
          duration: 0.1,
          ease: 'power2.out',
        },
        delay + 0.02,
      )
      tl.to(halo, { scale: 1.8, opacity: 0, duration: 0.15 }, delay + 0.15)
    }

    // 火花喷射
    const sparks = card.querySelectorAll('.spark')
    sparks.forEach((spark, si) => {
      const angle = (si / sparks.length) * Math.PI * 2
      const dist = 60 + Math.random() * 40
      tl.to(
        spark,
        {
          scale: 1,
          opacity: 1,
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist,
          duration: 0.1,
          ease: 'power2.out',
        },
        delay + 0.02,
      )
      tl.to(spark, { opacity: 0, scale: 0, duration: 0.1 }, delay + 0.15)
    })
  })

  // ======= 阶段3: 稳态展示 — 能量边框 + 信息 (40-70%) =======
  cards.forEach((card, i) => {
    const delay = 0.4 + i * 0.03

    const border = card.querySelector('.card-energy-border') as HTMLElement
    if (border) {
      tl.to(border, { opacity: 1, duration: 0.15, ease: 'power2.out' }, delay)
    }

    const overlay = card.querySelector('.card-overlay') as HTMLElement
    if (overlay) {
      tl.to(
        overlay,
        {
          opacity: 1,
          y: 0,
          duration: 0.12,
          ease: 'power2.out',
        },
        delay + 0.05,
      )
    }

    // 微视差漂移
    const driftX = (i % 2 === 0 ? -1 : 1) * 8
    const driftY = (i < 2 ? -1 : 1) * 6
    tl.to(
      card,
      {
        x: `+=${driftX}`,
        y: `+=${driftY}`,
        duration: 0.3,
        ease: 'sine.inOut',
      },
      0.5,
    )
  })

  // ======= 阶段4: 收束淡出 (70-100%) =======
  cards.forEach((card, i) => {
    const delay = 0.75 + i * 0.02

    const border = card.querySelector('.card-energy-border') as HTMLElement
    if (border) {
      tl.to(border, { opacity: 0, duration: 0.1 }, delay)
    }

    const overlay = card.querySelector('.card-overlay') as HTMLElement
    if (overlay) {
      tl.to(overlay, { opacity: 0, y: -20, duration: 0.1 }, delay)
    }

    tl.to(
      card,
      {
        scale: 0.8,
        opacity: 0,
        x: 0,
        y: 0,
        rotation: (i - 1.5) * -45,
        duration: 0.2,
        ease: 'power2.in',
      },
      delay + 0.05,
    )
  })

  tl.to(titleRef.value, { opacity: 0, y: -30, duration: 0.1 }, 0.85)

  cleanupFns.push(() => {
    tl.scrollTrigger?.kill()
    tl.kill()
  })
}

// ==================== 生命周期 ====================
onMounted(async () => {
  await nextTick()
  initAnimations()
})

onUnmounted(() => {
  cleanupFns.forEach((fn) => fn())
})
</script>

<template>
  <section ref="sectionRef" class="nova-section">
    <!-- SVG 滤镜 -->
    <svg class="nova-filter-svg" aria-hidden="true">
      <defs>
        <filter id="nova-nebula-warp" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            ref="turbulenceRef"
            type="fractalNoise"
            baseFrequency="0.015"
            numOctaves="3"
            result="noise"
            seed="42"
          />
          <feDisplacementMap
            ref="displacementRef"
            in="SourceGraphic"
            in2="noise"
            scale="0"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>

    <!-- 深空背景 -->
    <div class="nova-deep-space">
      <div
        v-for="i in 50"
        :key="`star-${i}`"
        :ref="(el) => setStarRef(el, i)"
        class="bg-star"
      ></div>
      <div class="nebula-glow nebula-1"></div>
      <div class="nebula-glow nebula-2"></div>
    </div>

    <!-- ========== 图片卡片组 ========== -->
    <div ref="cardsContainerRef" class="nova-cards-container">
      <div
        v-for="(card, i) in imageCards"
        :key="card.id"
        :ref="(el) => setCardRef(el, i)"
        class="nova-card"
      >
        <div class="card-inner">
          <!-- 图片 -->
          <img :src="card.url" :alt="card.title" class="card-image" />
          <!-- 星云扭曲叠加层 -->
          <div class="card-warp-layer" style="filter: url(#nova-nebula-warp)">
            <img :src="card.url" :alt="card.title" class="card-image-warp" />
          </div>
          <!-- 光环 -->
          <div class="card-halo"></div>
          <!-- 能量边框 -->
          <div class="card-energy-border"></div>
          <!-- 粒子喷射点 -->
          <div class="card-sparks">
            <span v-for="s in 8" :key="s" class="spark"></span>
          </div>
          <!-- 信息叠层 -->
          <div class="card-overlay">
            <span class="card-number">{{ String(i + 1).padStart(2, '0') }}</span>
            <h3 class="card-title">{{ card.title }}</h3>
            <p class="card-desc">{{ card.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 中心奇点（装饰） -->
    <div ref="singularityRef" class="singularity">
      <div class="singularity-core"></div>
      <div class="singularity-ring ring-1"></div>
      <div class="singularity-ring ring-2"></div>
    </div>

    <!-- 冲击波 -->
    <div ref="shockwaveRef" class="nova-shockwave"></div>

    <!-- 标题层 -->
    <div ref="titleRef" class="nova-title-layer">
      <span class="nova-label">NOVA BIRTH</span>
      <h2 class="nova-title">超新星诞生</h2>
    </div>
  </section>
</template>

<style scoped>
.nova-section {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #040412;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nova-filter-svg {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
}

/* 深空背景 */
.nova-deep-space {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.bg-star {
  position: absolute;
  border-radius: 50%;
  will-change: opacity;
}

.nebula-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.12;
}
.nebula-1 {
  width: 50vw;
  height: 50vh;
  left: -5%;
  top: -5%;
  background: radial-gradient(circle, rgba(100, 80, 255, 0.4), transparent 70%);
}
.nebula-2 {
  width: 40vw;
  height: 40vh;
  right: -5%;
  bottom: -5%;
  background: radial-gradient(circle, rgba(200, 80, 180, 0.3), transparent 70%);
}

/* ========== 卡片容器 ========== */
.nova-cards-container {
  position: relative;
  z-index: 10;
  width: 680px;
  height: 520px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nova-card {
  position: absolute;
  width: 280px;
  height: 200px;
  will-change: transform, opacity;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 14px;
  overflow: hidden;
  background: #111;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.card-warp-layer {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  mix-blend-mode: screen;
}

.card-image-warp {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.card-halo {
  position: absolute;
  inset: -30%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(160, 140, 255, 0.25), transparent 60%);
  pointer-events: none;
  will-change: transform, opacity;
}

.card-energy-border {
  position: absolute;
  inset: -2px;
  border-radius: 16px;
  border: 1.5px solid transparent;
  background:
    linear-gradient(#040412, #040412) padding-box,
    linear-gradient(
        135deg,
        rgba(140, 120, 255, 0.8),
        rgba(255, 180, 100, 0.6),
        rgba(100, 200, 255, 0.7)
      )
      border-box;
  pointer-events: none;
  will-change: opacity;
  box-shadow:
    0 0 12px 2px rgba(140, 120, 255, 0.2),
    0 0 30px 4px rgba(140, 120, 255, 0.08);
}

.card-sparks {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.spark {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(200, 180, 255, 0.9);
  box-shadow: 0 0 6px 2px rgba(180, 160, 255, 0.5);
  will-change: transform, opacity;
}

.card-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 16px 18px;
  background: linear-gradient(180deg, transparent 40%, rgba(0, 0, 0, 0.65) 100%);
  will-change: opacity, transform;
}

.card-number {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: rgba(180, 160, 255, 0.7);
  margin-bottom: 4px;
}

.card-title {
  font-size: 18px;
  font-weight: 800;
  color: #fff;
  margin: 0 0 4px;
  letter-spacing: -0.01em;
}

.card-desc {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  line-height: 1.4;
}

/* ========== 奇点 ========== */
.singularity {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 20;
  will-change: transform, opacity;
  pointer-events: none;
}

.singularity-core {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #fff;
  box-shadow:
    0 0 20px 8px rgba(200, 180, 255, 0.8),
    0 0 60px 20px rgba(150, 120, 255, 0.4),
    0 0 100px 40px rgba(100, 80, 255, 0.2);
}

.singularity-ring {
  position: absolute;
  border: 1px solid rgba(180, 160, 255, 0.35);
  border-radius: 50%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  animation: ring-pulse 2.5s ease-in-out infinite;
}
.ring-1 {
  width: 50px;
  height: 50px;
}
.ring-2 {
  width: 90px;
  height: 90px;
  animation-delay: 0.8s;
}

@keyframes ring-pulse {
  0%,
  100% {
    opacity: 0.2;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.6;
    transform: translate(-50%, -50%) scale(1.15);
  }
}

.nova-shockwave {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid rgba(200, 180, 255, 0.5);
  box-shadow:
    0 0 20px 6px rgba(160, 140, 255, 0.2),
    inset 0 0 15px 3px rgba(200, 180, 255, 0.15);
  z-index: 15;
  pointer-events: none;
  will-change: transform, opacity;
}

.nova-title-layer {
  position: absolute;
  top: 6%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 25;
  will-change: transform, opacity;
}

.nova-label {
  display: block;
  font-size: 10px;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: rgba(180, 160, 255, 0.6);
  margin-bottom: 8px;
}

.nova-title {
  font-size: clamp(24px, 4vw, 44px);
  font-weight: 900;
  color: #fff;
  letter-spacing: -0.02em;
  margin: 0;
  text-shadow: 0 0 30px rgba(140, 120, 255, 0.3);
}

@media (max-width: 768px) {
  .nova-cards-container {
    width: 320px;
    height: 480px;
  }
  .nova-card {
    width: 140px;
    height: 110px;
  }
  .card-title {
    font-size: 14px;
  }
  .card-desc {
    font-size: 11px;
  }
  .singularity-ring {
    display: none;
  }
}
</style>
