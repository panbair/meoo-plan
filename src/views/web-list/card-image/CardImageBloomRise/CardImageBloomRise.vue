<template>
  <section ref="rootRef" class="br-root">
    <!-- 动态背景光斑 -->
    <div ref="bgBlob1" class="br-bg-blob br-bg-blob--1"></div>
    <div ref="bgBlob2" class="br-bg-blob br-bg-blob--2"></div>
    <div ref="bgBlob3" class="br-bg-blob br-bg-blob--3"></div>
    <div ref="bgBlob4" class="br-bg-blob br-bg-blob--4"></div>

    <!-- 花瓣粒子画布 -->
    <canvas ref="canvasRef" class="br-canvas"></canvas>

    <!-- 滚动容器 -->
    <div ref="scrollRef" class="br-scroll">
      <div ref="trackRef" class="br-track" :style="{ height: trackHeight }">
        <div class="br-sticky">

          <!-- 标题区域 -->
          <header ref="headerRef" class="br-header">
            <span class="br-kicker">✿ Bloom Rise · 绽放升起 ✿</span>
            <h1 class="br-title">
              <span ref="titleWord1" class="br-title__word br-title__word--bloom">绽</span>
              <span ref="titleWord2" class="br-title__word br-title__word--rise">放</span>
            </h1>
            <div ref="headerLineRef" class="br-header-line"></div>
            <p class="br-subtitle">向下滚动 · 图片从底部绽放升起 · 从朦胧到清晰</p>
          </header>

          <!-- 生长指示器（底部光条） -->
          <div ref="growBarRef" class="br-grow-bar">
            <div ref="growBarGlowRef" class="br-grow-bar__glow"></div>
          </div>

          <!-- 图片舞台 -->
          <div class="br-stage">
            <article
              v-for="(frame, idx) in frames"
              :key="frame.id"
              :ref="(el) => setFrameRef(el, idx)"
              class="br-frame"
            >
              <!-- 底部生长光晕 -->
              <div
                :ref="(el) => setBloomGlowRef(el, idx)"
                class="br-frame__bloom-glow"
              ></div>
              <!-- 主图 -->
              <img
                :ref="(el) => setImgRef(el, idx)"
                class="br-frame__img"
                :src="frame.image"
                :alt="frame.alt"
                loading="lazy"
              />
              <!-- 柔光覆盖层 -->
              <div
                :ref="(el) => setSoftLightRef(el, idx)"
                class="br-frame__soft-light"
              ></div>
              <!-- 文字信息 -->
              <div
                :ref="(el) => setCaptionRef(el, idx)"
                class="br-frame__caption"
              >
                <span class="br-frame__num">{{ frame.label }}</span>
                <h2 class="br-frame__title">{{ frame.title }}</h2>
                <p class="br-frame__desc">{{ frame.description }}</p>
              </div>
            </article>
          </div>

          <!-- 底部进度指示 -->
          <div class="br-progress">
            <div ref="progressFillRef" class="br-progress__fill"></div>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ═══════════════════════════════════════════════════════════════════
//  CardImageBloomRise — 绽放升起
//
//  核心概念：
//  1. 图片从视口底部"生长"出来 — 如同花朵从土壤中绽放
//  2. 用户竖滚 → 图片从底部升起、放大、变清晰
//  3. Canvas 花瓣粒子飘浮，营造浪漫青春氛围
//  4. 底部光条作为"生长基线"，引导视觉
//  5. 图片从 clipPath: inset(100% 0% 0% 0%) → inset(0% 0% 0% 0%)
//     配合 blur(20px) → blur(0px)，scale 0.75 → 1.0，y 30vh → 0
//  6. 青春时尚配色：蜜桃 · 珊瑚 · 薄荷 · 阳光金 · 薰衣草
// ═══════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

interface BloomFrame {
  id: string
  label: string
  title: string
  description: string
  image: string
  alt: string
}

const frames: BloomFrame[] = [
  {
    id: 'peach-dawn',
    label: 'Frame 01',
    title: '蜜桃破晓',
    description: '第一缕晨光中，花朵从朦胧中缓缓升起，清晰绽放。',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1920&q=80',
    alt: '绽放的花朵在晨光中',
  },
  {
    id: 'coral-bloom',
    label: 'Frame 02',
    title: '珊瑚花海',
    description: '珊瑚色的花瓣层层绽放，从模糊的梦影中苏醒。',
    image: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=1920&q=80',
    alt: '珊瑚色花海盛开',
  },
  {
    id: 'mint-breeze',
    label: 'Frame 03',
    title: '薄荷微风',
    description: '清新的薄荷绿意中，画面如微风拂过般清晰呈现。',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80',
    alt: '金色阳光洒落绿色田野',
  },
  {
    id: 'lavender-dream',
    label: 'Frame 04',
    title: '薰衣草梦',
    description: '紫色薰衣草田在阳光中升起，从柔焦梦境走向澄澈现实。',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80',
    alt: '薰衣草般的日落山景',
  },
  {
    id: 'golden-hour',
    label: 'Frame 05',
    title: '金色时刻',
    description: '太阳的金色光芒中，整个画面如获新生般清晰明亮。',
    image: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=1920&q=80',
    alt: '金色日落穿透山间',
  },
]

const FRAME_COUNT = frames.length
const trackHeight = `${(FRAME_COUNT + 1) * 100}vh`

// ── Refs ─────────────────────────────────────────────────────
const rootRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const headerLineRef = ref<HTMLElement | null>(null)
const titleWord1 = ref<HTMLElement | null>(null)
const titleWord2 = ref<HTMLElement | null>(null)
const growBarRef = ref<HTMLElement | null>(null)
const growBarGlowRef = ref<HTMLElement | null>(null)
const progressFillRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const bgBlob1 = ref<HTMLElement | null>(null)
const bgBlob2 = ref<HTMLElement | null>(null)
const bgBlob3 = ref<HTMLElement | null>(null)
const bgBlob4 = ref<HTMLElement | null>(null)

const frameRefs = ref<HTMLElement[]>([])
const bloomGlowRefs = ref<HTMLElement[]>([])
const imgRefs = ref<HTMLImageElement[]>([])
const softLightRefs = ref<HTMLElement[]>([])
const captionRefs = ref<HTMLElement[]>([])

const setFrameRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) frameRefs.value[i] = el }
const setBloomGlowRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) bloomGlowRefs.value[i] = el }
const setImgRef = (el: Element | null, i: number) => { if (el instanceof HTMLImageElement) imgRefs.value[i] = el }
const setSoftLightRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) softLightRefs.value[i] = el }
const setCaptionRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) captionRefs.value[i] = el }

const cleanupFns: TweenCleanup[] = []

// ═════════════════════════════════════════════════════════════
//  Canvas 花瓣粒子系统
// ═════════════════════════════════════════════════════════════
interface Petal {
  x: number; y: number
  vx: number; vy: number
  rotation: number; rotationSpeed: number
  size: number
  alpha: number
  life: number; maxLife: number
  hue: number          // 0-60 暖色系
  petalType: number     // 0=圆瓣 1=尖瓣 2=心形
  wobblePhase: number
  wobbleAmp: number
}

let canvasCtx: CanvasRenderingContext2D | null = null
let cw = 0; let ch = 0
const petals: Petal[] = []
let petalAnimId = 0
const MAX_PETALS = 150
const BASE_PETALS = 60

function createPetal(x?: number, y?: number): Petal {
  const cx = x ?? Math.random() * cw
  const cy = y ?? Math.random() * ch * 0.3 + ch * 0.6 // 底部区域
  return {
    x: cx, y: cy,
    vx: (Math.random() - 0.5) * 0.8,
    vy: -Math.random() * 1.5 - 0.3, // 向上飘
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.03,
    size: 4 + Math.random() * 10,
    alpha: 0.3 + Math.random() * 0.5,
    life: 0,
    maxLife: 150 + Math.random() * 350,
    hue: Math.random() < 0.5
      ? 5 + Math.random() * 25    // 蜜桃珊瑚系 5-30
      : 280 + Math.random() * 30, // 薰衣草系 280-310
    petalType: Math.floor(Math.random() * 3),
    wobblePhase: Math.random() * Math.PI * 2,
    wobbleAmp: 0.3 + Math.random() * 1.2,
  }
}

/** 底部爆发粒子（模拟花朵绽放） */
function petalBurst(cx: number, cy: number, count: number) {
  for (let i = 0; i < count; i++) {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI // 向上扇形
    const speed = 2 + Math.random() * 6
    const p = createPetal(cx, cy)
    p.vx = Math.cos(angle) * speed
    p.vy = Math.sin(angle) * speed
    p.size = 6 + Math.random() * 14
    p.alpha = 0.5 + Math.random() * 0.5
    petals.push(p)
  }
  while (petals.length > MAX_PETALS) petals.shift()
}

function drawPetalShape(ctx: CanvasRenderingContext2D, p: Petal) {
  const { size } = p
  ctx.save()
  ctx.translate(p.x, p.y)
  ctx.rotate(p.rotation)

  if (p.petalType === 0) {
    // 圆形花瓣
    ctx.beginPath()
    ctx.arc(0, 0, size * 0.5, 0, Math.PI * 2)
    ctx.fill()
  } else if (p.petalType === 1) {
    // 尖瓣花瓣 (椭圆形)
    ctx.beginPath()
    ctx.ellipse(0, -size * 0.15, size * 0.35, size * 0.6, 0, 0, Math.PI * 2)
    ctx.fill()
  } else {
    // 心形花瓣
    const s = size * 0.5
    ctx.beginPath()
    ctx.moveTo(0, s * 0.3)
    ctx.bezierCurveTo(-s * 0.5, -s * 0.3, -s * 0.4, -s * 0.8, 0, -s * 0.4)
    ctx.bezierCurveTo(s * 0.4, -s * 0.8, s * 0.5, -s * 0.3, 0, s * 0.3)
    ctx.fill()
  }
  ctx.restore()
}

function initPetalCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return
  canvasCtx = canvas.getContext('2d')
  if (!canvasCtx) return

  const resize = () => {
    cw = window.innerWidth
    ch = window.innerHeight
    canvas.width = cw
    canvas.height = ch
  }
  resize()
  window.addEventListener('resize', resize)
  cleanupFns.push(() => window.removeEventListener('resize', resize))

  // 初始填充
  for (let i = 0; i < BASE_PETALS; i++) {
    petals.push(createPetal())
  }

  function animate() {
    if (!canvasCtx) return
    canvasCtx.clearRect(0, 0, cw, ch)

    // 维持基础粒子数
    while (petals.length < BASE_PETALS) {
      petals.push(createPetal())
    }

    for (let i = petals.length - 1; i >= 0; i--) {
      const p = petals[i]
      p.life++
      if (p.life >= p.maxLife) { petals.splice(i, 1); continue }

      // 生命周期淡入淡出
      const t = p.life / p.maxLife
      const fade = t < 0.1 ? t / 0.1 : t > 0.75 ? 1 - (t - 0.75) / 0.25 : 1

      // 摆动
      p.wobblePhase += 0.02
      const wobbleX = Math.sin(p.wobblePhase) * p.wobbleAmp

      p.x += p.vx + wobbleX
      p.y += p.vy
      p.rotation += p.rotationSpeed

      // 光晕
      const glow = canvasCtx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size)
      glow.addColorStop(0, `hsla(${p.hue}, 80%, 70%, ${p.alpha * fade * 0.8})`)
      glow.addColorStop(0.5, `hsla(${p.hue}, 60%, 60%, ${p.alpha * fade * 0.4})`)
      glow.addColorStop(1, `hsla(${p.hue}, 50%, 50%, 0)`)

      canvasCtx!.beginPath()
      canvasCtx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      canvasCtx!.fillStyle = glow
      canvasCtx!.fill()

      // 花瓣形状
      canvasCtx!.fillStyle = `hsla(${p.hue}, 70%, 80%, ${p.alpha * fade * 0.7})`
      drawPetalShape(canvasCtx!, p)

      // 边界处理：超出顶部或侧边太远就重生在底部
      if (p.y < -60 || p.x < -80 || p.x > cw + 80) {
        p.y = ch + 40
        p.x = Math.random() * cw
        p.life = 0
      }
    }

    petalAnimId = requestAnimationFrame(animate)
  }
  petalAnimId = requestAnimationFrame(animate)
}

// ═════════════════════════════════════════════════════════════
//  入场动画
// ═════════════════════════════════════════════════════════════
function setupEntrance() {
  if (!scrollRef.value || !headerRef.value) return

  const entranceTl = gsap.timeline({
    scrollTrigger: {
      trigger: scrollRef.value,
      scroller: scrollRef.value,
      start: 'top 75%',
      toggleActions: 'play none none reverse',
    },
  })

  entranceTl
    .fromTo(headerRef.value, { autoAlpha: 0, y: 60 }, {
      autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out',
    })
    .fromTo(titleWord1.value, { autoAlpha: 0, x: -50, scale: 0.5, rotation: -10 }, {
      autoAlpha: 1, x: 0, scale: 1, rotation: 0,
      duration: 0.7, ease: 'back.out(2)',
    }, '-=0.5')
    .fromTo(titleWord2.value, { autoAlpha: 0, x: 50, scale: 0.5, rotation: 10 }, {
      autoAlpha: 1, x: 0, scale: 1, rotation: 0,
      duration: 0.7, ease: 'back.out(2)',
    }, '-=0.6')
    .fromTo(headerLineRef.value, { scaleX: 0 }, {
      scaleX: 1, duration: 0.55, ease: 'power3.inOut',
    }, '-=0.35')
    .fromTo(growBarRef.value, { autoAlpha: 0, scaleY: 0 }, {
      autoAlpha: 1, scaleY: 1, duration: 0.65, ease: 'back.out(1.6)',
    }, '-=0.3')

  cleanupFns.push(() => {
    entranceTl.scrollTrigger?.kill()
    entranceTl.kill()
  })
}

// ═════════════════════════════════════════════════════════════
//  核心：绽放升起动画
// ═════════════════════════════════════════════════════════════
function setupBloomRise() {
  if (!scrollRef.value || !trackRef.value) return

  const scroller = scrollRef.value
  const track = trackRef.value
  const frames_ = frameRefs.value
  const bloomGlows = bloomGlowRefs.value
  const images = imgRefs.value
  const softLights = softLightRefs.value
  const captions = captionRefs.value

  if (!frames_.length || !bloomGlows.length || !images.length || !softLights.length || !captions.length) return

  // ── 初始化帧状态 ──
  frames_.forEach((frame, i) => {
    gsap.set(frame, {
      position: 'absolute',
      inset: 0,
      zIndex: FRAME_COUNT - i,
    })

    if (i === 0) {
      // 第一帧：已完全绽放
      gsap.set(frame, { autoAlpha: 1 })
      gsap.set(bloomGlows[i], { opacity: 0.15, scale: 1 })
      gsap.set(images[i], {
        scale: 1,
        y: 0,
        filter: 'brightness(1.08) saturate(1.15) contrast(1.03) blur(0px)',
        clipPath: 'inset(0% 0% 0% 0%)',
      })
      gsap.set(softLights[i], { opacity: 0.1 })
      gsap.set(captions[i], { autoAlpha: 1, y: 0 })
    } else {
      // 其他帧：从底部初始状态
      gsap.set(frame, { autoAlpha: 0 })
      gsap.set(bloomGlows[i], { opacity: 0.8, scale: 0.4 })
      gsap.set(images[i], {
        scale: 0.7,
        y: 35, // vh百分比 — 从画面下方升起
        filter: 'brightness(1.5) saturate(0.6) contrast(1.15) blur(18px)',
        clipPath: 'inset(85% 0% 0% 0%)', // 只有底部15%可见
      })
      gsap.set(softLights[i], { opacity: 0.5 })
      gsap.set(captions[i], { autoAlpha: 0, y: 40 })
    }
  })

  // ── 主时间线 ──
  const masterTl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track,
      scroller,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.2,
    },
  })

  frames_.forEach((_frame, i) => {
    const offset = i
    const bloomGlow = bloomGlows[i]
    const img = images[i]
    const softLight = softLights[i]
    const caption = captions[i]

    // 🌸 Phase 1: 绽放升起 (0 → 0.5)
    // 图片从底部 clipPath 展开，blur 降低，scale 增长，y 从底部升到中心
    masterTl
      .to(img, {
        clipPath: 'inset(0% 0% 0% 0%)',
        filter: 'brightness(1.08) saturate(1.15) contrast(1.03) blur(0px)',
        scale: 1,
        y: 0,
        duration: 0.5,
        ease: 'power3.out',
      }, offset)
      .to(bloomGlow, {
        opacity: 0.15,
        scale: 1,
        duration: 0.5,
        ease: 'power2.out',
      }, offset)
      .to(softLight, {
        opacity: 0.1,
        duration: 0.45,
        ease: 'power2.out',
      }, offset + 0.05)
      .to(caption, {
        autoAlpha: 1,
        y: 0,
        duration: 0.35,
        ease: 'power3.out',
      }, offset + 0.18)

    // 🌸 Phase 2: 清晰驻留 + 轻微呼吸 (0.5 → 0.65)
    masterTl
      .to(img, {
        filter: 'brightness(1.12) saturate(1.2) contrast(1.05) blur(0px)',
        duration: 0.08,
        ease: 'sine.inOut',
      }, offset + 0.5)
      .to(img, {
        filter: 'brightness(1.08) saturate(1.15) contrast(1.03) blur(0px)',
        duration: 0.08,
        ease: 'sine.inOut',
      }, offset + 0.55)
      .to(bloomGlow, {
        opacity: 0.25,
        scale: 1.05,
        duration: 0.07,
        ease: 'sine.inOut',
      }, offset + 0.5)
      .to(bloomGlow, {
        opacity: 0.15,
        scale: 1,
        duration: 0.08,
        ease: 'sine.inOut',
      }, offset + 0.55)

    // 🌸 Phase 3: 向上收拢退场 — 图片向上收缩模糊 (0.65 → 0.82)
    masterTl
      .to(img, {
        clipPath: 'inset(0% 0% 85% 0%)', // 只有顶部15%可见
        filter: 'brightness(2.5) saturate(0.4) contrast(1.3) blur(16px)',
        scale: 0.75,
        y: -30, // 向上升起离开
        duration: 0.22,
        ease: 'power3.in',
      }, offset + 0.65)
      .to(bloomGlow, {
        opacity: 0.9,
        scale: 0.5,
        duration: 0.2,
        ease: 'power2.in',
      }, offset + 0.65)
      .to(softLight, {
        opacity: 0.55,
        duration: 0.18,
      }, offset + 0.66)
      .to(caption, {
        autoAlpha: 0,
        y: -25,
        duration: 0.16,
        ease: 'power2.in',
      }, offset + 0.65)
      .to(_frame, {
        autoAlpha: 0,
        duration: 0.12,
      }, offset + 0.76)

    // 🌸 Phase 4: 下一帧从底部绽放升起
    if (i < FRAME_COUNT - 1) {
      const nextFrame = frames_[i + 1]
      const nextBloomGlow = bloomGlows[i + 1]
      const nextImg = images[i + 1]
      const nextSoftLight = softLights[i + 1]

      masterTl
        .to(nextFrame, { autoAlpha: 1, duration: 0.1 }, offset + 0.72)
        .to(nextImg, {
          clipPath: 'inset(0% 0% 0% 0%)',
          filter: 'brightness(1.08) saturate(1.15) contrast(1.03) blur(0px)',
          scale: 1,
          y: 0,
          duration: 0.45,
          ease: 'power3.out',
        }, offset + 0.76)
        .to(nextBloomGlow, {
          opacity: 0.15,
          scale: 1,
          duration: 0.45,
          ease: 'power2.out',
        }, offset + 0.76)
        .to(nextSoftLight, {
          opacity: 0.1,
          duration: 0.4,
          ease: 'power2.out',
        }, offset + 0.78)
    }
  })

  // ── 底部光条呼吸脉动 ──
  if (growBarRef.value && growBarGlowRef.value) {
    for (let i = 0; i < FRAME_COUNT; i++) {
      const pulseOffset = i + 0.5
      masterTl
        .to(growBarGlowRef.value, {
          opacity: 1,
          scaleX: 1.3,
          duration: 0.1,
          ease: 'power2.in',
        }, pulseOffset)
        .to(growBarGlowRef.value, {
          opacity: 0.6,
          scaleX: 1,
          duration: 0.2,
          ease: 'power2.out',
        }, pulseOffset + 0.1)
    }
  }

  // ── 背景光斑漂移 ──
  if (bgBlob1.value && bgBlob2.value && bgBlob3.value && bgBlob4.value) {
    masterTl
      .to(bgBlob1.value, { x: '8vw', y: '-6vh', scale: 1.2, duration: FRAME_COUNT }, 0)
      .to(bgBlob2.value, { x: '-10vw', y: '8vh', scale: 1.3, duration: FRAME_COUNT }, 0)
      .to(bgBlob3.value, { x: '6vw', y: '10vh', scale: 1.15, duration: FRAME_COUNT }, 0)
      .to(bgBlob4.value, { x: '-5vw', y: '-10vh', scale: 1.25, duration: FRAME_COUNT }, 0)
  }

  // ── 进度条 ──
  if (progressFillRef.value) {
    masterTl.to(progressFillRef.value, { width: '100%', duration: FRAME_COUNT }, 0)
  }

  // ── 花瓣爆发回调 ──
  frames_.forEach((_frame, i) => {
    const stBurst = ScrollTrigger.create({
      trigger: track,
      scroller,
      start: `${((i + 0.5) / FRAME_COUNT) * 100}% top`,
      onEnter: () => petalBurst(cw / 2, ch * 0.85, 40),
    })
    cleanupFns.push(() => stBurst.kill())
  })

  cleanupFns.push(() => {
    masterTl.scrollTrigger?.kill()
    masterTl.kill()
  })
}

// ═════════════════════════════════════════════════════════════
//  生命周期
// ═════════════════════════════════════════════════════════════
function handleResize() {
  ScrollTrigger.refresh(true)
}

onMounted(() => {
  initPetalCanvas()
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      setupEntrance()
      setupBloomRise()
    })
  })
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  cancelAnimationFrame(petalAnimId)
  ScrollTrigger.getAll().forEach((st) => st.kill())
  cleanupFns.forEach((fn) => fn())
  cleanupFns.length = 0
  petals.length = 0
})
</script>

<style scoped lang="scss">
/* ═══════════════════════════════════════════════════════════
   Bloom Rise — 绽放升起
   类名前缀: br-
   ═══════════════════════════════════════════════════════════ */

/* ── 根容器 ── */
.br-root {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(
    160deg,
    #fff5f0 0%,
    #ffede4 15%,
    #fff0e8 30%,
    #fdf2f8 50%,
    #fef7f6 70%,
    #fff5ee 85%,
    #ffefe8 100%
  );
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif;
}

/* ── 背景光斑（柔和有机形状） ── */
.br-bg-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  pointer-events: none;
  will-change: transform;
  z-index: 0;
}

.br-bg-blob--1 {
  width: 40vw;
  height: 40vw;
  top: -8vh;
  left: -6vw;
  background: radial-gradient(
    circle,
    rgba(255, 182, 155, 0.55) 0%,
    rgba(255, 160, 130, 0.3) 35%,
    transparent 70%
  );
}

.br-bg-blob--2 {
  width: 35vw;
  height: 35vw;
  bottom: -10vh;
  right: -5vw;
  background: radial-gradient(
    circle,
    rgba(255, 210, 180, 0.5) 0%,
    rgba(200, 230, 200, 0.25) 40%,
    transparent 70%
  );
}

.br-bg-blob--3 {
  width: 30vw;
  height: 30vw;
  top: 40vh;
  left: 50vw;
  background: radial-gradient(
    circle,
    rgba(220, 200, 240, 0.4) 0%,
    rgba(200, 210, 240, 0.2) 40%,
    transparent 70%
  );
}

.br-bg-blob--4 {
  width: 28vw;
  height: 28vw;
  top: 15vh;
  right: 20vw;
  background: radial-gradient(
    circle,
    rgba(255, 240, 180, 0.4) 0%,
    rgba(255, 220, 150, 0.2) 40%,
    transparent 70%
  );
}

/* ── Canvas 花瓣层 ── */
.br-canvas {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

/* ── 滚动容器 ── */
.br-scroll {
  position: relative;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior-y: auto;
  z-index: 2;

  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-thumb {
    border-radius: 999px;
    background: rgba(255, 160, 130, 0.3);
    &:hover { background: rgba(255, 160, 130, 0.5); }
  }
}

.br-track {
  position: relative;
  width: 100%;
}

.br-sticky {
  position: sticky;
  top: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

/* ── 标题区 ── */
.br-header {
  position: absolute;
  top: 3vh;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  text-align: center;
  width: min(92vw, 800px);
}

.br-kicker {
  display: inline-block;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: rgba(220, 120, 90, 0.8);
  background: rgba(255, 180, 150, 0.15);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 160, 130, 0.2);
  border-radius: 999px;
  padding: 0.3rem 1.3rem;
  margin-bottom: 0.6rem;
}

.br-title {
  margin: 0;
  display: flex;
  justify-content: center;
  gap: 0.2em;
}

.br-title__word {
  display: inline-block;
  font-size: clamp(2.4rem, 6vw, 5rem);
  font-weight: 900;
  will-change: transform, opacity;

  &--bloom {
    background: linear-gradient(135deg, #ff7b5a 0%, #ff9a7b 40%, #ff6347 70%, #ff8c69 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 2px 14px rgba(255, 110, 80, 0.45));
  }

  &--rise {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 30%, #ffa751 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 2px 14px rgba(245, 87, 108, 0.4));
  }
}

.br-header-line {
  width: 100px;
  height: 2.5px;
  margin: 0.5rem auto 0.65rem;
  border-radius: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    #ff9a7b,
    #f5576c,
    #ffa751,
    transparent
  );
  transform-origin: center;
}

.br-subtitle {
  margin: 0;
  font-size: clamp(0.78rem, 1.15vw, 0.9rem);
  color: rgba(200, 110, 80, 0.6);
  line-height: 1.5;
  max-width: 460px;
  margin-inline: auto;
}

/* ── 底部生长光条 ── */
.br-grow-bar {
  position: absolute;
  left: 0;
  bottom: 8vh;
  z-index: 18;
  width: 100%;
  height: 2px;
  pointer-events: none;
  will-change: transform, opacity;
}

.br-grow-bar__glow {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 5%,
    rgba(255, 140, 100, 0.2) 20%,
    rgba(255, 160, 120, 0.7) 50%,
    rgba(255, 140, 100, 0.2) 80%,
    transparent 95%
  );
  box-shadow:
    0 0 20px rgba(255, 150, 110, 0.5),
    0 -4px 16px rgba(255, 180, 140, 0.3);
  will-change: transform, opacity;
}

/* ── 舞台 ── */
.br-stage {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

/* ── 帧容器 ── */
.br-frame {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  will-change: opacity;
}

/* ── 底部绽放光晕 ── */
.br-frame__bloom-glow {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 35vh;
  z-index: 3;
  pointer-events: none;
  background: linear-gradient(
    0deg,
    rgba(255, 200, 160, 0.6) 0%,
    rgba(255, 170, 130, 0.35) 25%,
    rgba(255, 210, 180, 0.12) 55%,
    transparent 100%
  );
  transform-origin: center bottom;
  will-change: transform, opacity;
}

/* ── 图片 ── */
.br-frame__img {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform-origin: center center;
  will-change: transform, filter, clip-path;
}

/* ── 柔光覆盖层 ── */
.br-frame__soft-light {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background: radial-gradient(
    ellipse 55% 45% at 50% 55%,
    rgba(255, 240, 225, 0.35) 0%,
    rgba(255, 200, 170, 0.15) 40%,
    transparent 70%
  );
  mix-blend-mode: soft-light;
  will-change: opacity;
}

/* ── 帧文字 ── */
.br-frame__caption {
  position: absolute;
  left: max(5vw, 24px);
  bottom: 14vh;
  z-index: 20;
  max-width: min(80vw, 600px);
  will-change: transform, opacity;
}

.br-frame__num {
  display: inline-flex;
  align-items: center;
  height: 1.65rem;
  padding: 0 0.85rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 180, 150, 0.3);
  font-size: 0.64rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #d47050;
}

.br-frame__title {
  margin: 0.65rem 0 0;
  font-size: clamp(2rem, 5.5vw, 4.2rem);
  font-weight: 900;
  line-height: 1.1;
  color: #3d1500;
  text-shadow:
    0 2px 12px rgba(255, 255, 255, 0.7),
    0 0 50px rgba(255, 180, 140, 0.4);
}

.br-frame__desc {
  margin: 0.45rem 0 0;
  font-size: clamp(0.82rem, 1.3vw, 1rem);
  line-height: 1.65;
  color: rgba(100, 35, 10, 0.7);
  text-shadow: 0 1px 6px rgba(255, 255, 255, 0.5);
}

/* ── 进度条 ── */
.br-progress {
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 30;
  width: 100%;
  height: 3px;
  background: rgba(255, 170, 140, 0.08);
}

.br-progress__fill {
  width: 0;
  height: 100%;
  background: linear-gradient(
    90deg,
    #ff7b5a,
    #f5576c,
    #ffa751,
    #ff9a7b,
    #ff7b5a
  );
  background-size: 200% 100%;
  box-shadow: 0 0 14px rgba(255, 130, 90, 0.6);
}

/* ── 响应式 ── */
@media (max-width: 768px) {
  .br-header { top: 2vh; }
  .br-kicker { font-size: 0.56rem; padding: 0.22rem 0.7rem; }

  .br-title__word { font-size: 1.8rem; }

  .br-grow-bar { bottom: 6vh; }

  .br-frame__caption { bottom: 10vh; }
  .br-frame__title { font-size: 1.5rem; color: #4a1a00; }
}
</style>
