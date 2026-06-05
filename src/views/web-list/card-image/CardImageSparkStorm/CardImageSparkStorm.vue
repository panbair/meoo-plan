<template>
  <section ref="rootRef" class="ss-root">
    <!-- 动态背景光晕群 -->
    <div ref="orbGold" class="ss-orb ss-orb--gold"></div>
    <div ref="orbCoral" class="ss-orb ss-orb--coral"></div>
    <div ref="orbAmber" class="ss-orb ss-orb--amber"></div>
    <div ref="orbWhite" class="ss-orb ss-orb--white"></div>

    <!-- 火花粒子画布 -->
    <canvas ref="canvasRef" class="ss-canvas"></canvas>

    <!-- 滚动容器 -->
    <div ref="scrollRef" class="ss-scroll">
      <div ref="trackRef" class="ss-track" :style="{ height: trackHeight }">
        <div class="ss-sticky">

          <!-- 标题区域 -->
          <header ref="headerRef" class="ss-header">
            <div ref="headerSparkL" class="ss-header-sparkle ss-header-sparkle--l"></div>
            <div ref="headerSparkR" class="ss-header-sparkle ss-header-sparkle--r"></div>
            <span class="ss-kicker">✦ Spark Storm · 火花风暴 ✦</span>
            <h1 class="ss-title">
              <span ref="titleChar1" class="ss-title__char">火</span>
              <span ref="titleChar2" class="ss-title__char">花</span>
              <span ref="titleChar3" class="ss-title__char">风</span>
              <span ref="titleChar4" class="ss-title__char">暴</span>
            </h1>
            <div ref="headerLineRef" class="ss-header-line"></div>
            <p class="ss-subtitle">向下滚动 · 万千火花迸裂 · 每一帧在烈焰中重生</p>
          </header>

          <!-- 火花核心指示器 -->
          <div ref="coreRef" class="ss-core">
            <div class="ss-core__ring ss-core__ring--1"></div>
            <div class="ss-core__ring ss-core__ring--2"></div>
            <div class="ss-core__ring ss-core__ring--3"></div>
            <div class="ss-core__dot"></div>
          </div>

          <!-- 图片舞台 -->
          <div class="ss-stage">
            <article
              v-for="(frame, idx) in frames"
              :key="frame.id"
              :ref="(el) => setFrameRef(el, idx)"
              class="ss-frame"
            >
              <div
                :ref="(el) => setFrameGlowRef(el, idx)"
                class="ss-frame__glow"
              ></div>
              <img
                :ref="(el) => setImgRef(el, idx)"
                class="ss-frame__img"
                :src="frame.image"
                :alt="frame.alt"
                loading="lazy"
              />
              <div
                :ref="(el) => setBurnEdgeRef(el, idx)"
                class="ss-frame__burn"
              ></div>
              <div
                :ref="(el) => setCaptionRef(el, idx)"
                class="ss-frame__caption"
              >
                <span class="ss-frame__num">{{ frame.label }}</span>
                <h2 class="ss-frame__title">{{ frame.title }}</h2>
                <p class="ss-frame__desc">{{ frame.description }}</p>
              </div>
            </article>
          </div>

          <!-- 底部火花进度 -->
          <div class="ss-progress">
            <div ref="progressFillRef" class="ss-progress__fill"></div>
            <div class="ss-progress__sparks" ref="progressSparksRef"></div>
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
//  CardImageSparkStorm — 火花风暴
//
//  核心概念：
//  1. 数百个金色/琥珀色火花粒子在 Canvas 上飞舞
//  2. 图片在火花笼罩中若隐若现
//  3. 用户竖滚 → 火花爆发扩散 → 旧图燃尽 → 新图从火星中浮现
//  4. 中心火花核心（三层光环）随滚动脉动
//  5. 标题四字逐字闪耀入场
//  6. 暖色调青春时尚：金 · 琥珀 · 珊瑚 · 暖白
// ═══════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

interface SparkFrame {
  id: string
  label: string
  title: string
  description: string
  image: string
  alt: string
}

const frames: SparkFrame[] = [
  {
    id: 'golden-dawn',
    label: 'Frame 01',
    title: '金色破晓',
    description: '万千火星在晨曦中绽放，第一缕金色光芒穿透薄雾。',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80',
    alt: '金色麦田在日出下闪耀',
  },
  {
    id: 'coral-blaze',
    label: 'Frame 02',
    title: '珊瑚烈焰',
    description: '火花粒子燃烧到极致，珊瑚色的火舌舔舐每一寸画面。',
    image: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=1920&q=80',
    alt: '珊瑚色日落海岸线',
  },
  {
    id: 'amber-fields',
    label: 'Frame 03',
    title: '琥珀原野',
    description: '琥珀光芒中，火花如萤火虫般升腾，铺满整个视野。',
    image: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=1920&q=80',
    alt: '琥珀色阳光穿过山脊',
  },
  {
    id: 'starlight-burst',
    label: 'Frame 04',
    title: '星光迸裂',
    description: '无数火星聚为星光，在画面中央炸开成璀璨烟火。',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80',
    alt: '阳光洒落山谷如星光',
  },
  {
    id: 'warm-ember',
    label: 'Frame 05',
    title: '余烬重燃',
    description: '最后的火花也不甘熄灭，在余烬中重新燃起新的画面。',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80',
    alt: '阳光穿过森林的斑驳光影',
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
const headerSparkL = ref<HTMLElement | null>(null)
const headerSparkR = ref<HTMLElement | null>(null)
const titleChar1 = ref<HTMLElement | null>(null)
const titleChar2 = ref<HTMLElement | null>(null)
const titleChar3 = ref<HTMLElement | null>(null)
const titleChar4 = ref<HTMLElement | null>(null)
const coreRef = ref<HTMLElement | null>(null)
const progressFillRef = ref<HTMLElement | null>(null)
const progressSparksRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const orbGold = ref<HTMLElement | null>(null)
const orbCoral = ref<HTMLElement | null>(null)
const orbAmber = ref<HTMLElement | null>(null)
const orbWhite = ref<HTMLElement | null>(null)

const frameRefs = ref<HTMLElement[]>([])
const frameGlowRefs = ref<HTMLElement[]>([])
const imgRefs = ref<HTMLImageElement[]>([])
const burnEdgeRefs = ref<HTMLElement[]>([])
const captionRefs = ref<HTMLElement[]>([])

const setFrameRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) frameRefs.value[i] = el }
const setFrameGlowRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) frameGlowRefs.value[i] = el }
const setImgRef = (el: Element | null, i: number) => { if (el instanceof HTMLImageElement) imgRefs.value[i] = el }
const setBurnEdgeRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) burnEdgeRefs.value[i] = el }
const setCaptionRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) captionRefs.value[i] = el }

const cleanupFns: TweenCleanup[] = []

// ═════════════════════════════════════════════════════════════
//  Canvas 火花粒子系统
// ═════════════════════════════════════════════════════════════
interface Spark {
  x: number; y: number
  vx: number; vy: number
  r: number
  alpha: number
  life: number; maxLife: number
  hue: number        // 30-55 (金→琥珀)
  saturation: number
  lightness: number
  trail: { x: number; y: number }[]
}

let canvasCtx: CanvasRenderingContext2D | null = null
let cw = 0; let ch = 0
const sparks: Spark[] = []
let sparkAnimId = 0
const MAX_SPARKS = 500
const BASE_SPARK_COUNT = 200
const TRAIL_LENGTH = 6

function createSpark(
  x?: number, y?: number,
  vx?: number, vy?: number,
): Spark {
  const cx = x ?? Math.random() * cw
  const cy = y ?? Math.random() * ch
  return {
    x: cx, y: cy,
    vx: vx ?? (Math.random() - 0.5) * 2.5,
    vy: vy ?? -Math.random() * 3 - 1.5,
    r: 0.8 + Math.random() * 3.2,
    alpha: 0.3 + Math.random() * 0.7,
    life: 0,
    maxLife: 60 + Math.random() * 180,
    hue: 25 + Math.random() * 35,       // 25-60 (金→琥珀→珊瑚)
    saturation: 70 + Math.random() * 30,
    lightness: 50 + Math.random() * 40,
    trail: [],
  }
}

/** 在指定区域爆发火花 */
function sparkBurst(cx: number, cy: number, count: number, radius: number) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2
    const speed = 2 + Math.random() * 8
    sparks.push(createSpark(
      cx + (Math.random() - 0.5) * radius * 0.3,
      cy + (Math.random() - 0.5) * radius * 0.3,
      Math.cos(angle) * speed,
      Math.sin(angle) * speed,
    ))
  }
  // 裁剪超出上限
  while (sparks.length > MAX_SPARKS) sparks.shift()
}

/** 在屏幕随机位置持续生成环境火花 */
function spawnAmbient() {
  if (sparks.length < BASE_SPARK_COUNT) {
    const missing = BASE_SPARK_COUNT - sparks.length
    for (let i = 0; i < Math.min(missing, 5); i++) {
      sparks.push(createSpark())
    }
  }
}

function initCanvas() {
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

  // 初始火花填充
  for (let i = 0; i < BASE_SPARK_COUNT; i++) {
    sparks.push(createSpark())
  }

  function animate() {
    if (!canvasCtx) return
    canvasCtx.clearRect(0, 0, cw, ch)

    spawnAmbient()

    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i]
      s.life++
      if (s.life >= s.maxLife) { sparks.splice(i, 1); continue }

      // 物理：轻微重力 + 空气阻力
      s.vy += 0.015
      s.vx *= 0.995
      s.vy *= 0.995
      s.x += s.vx
      s.y += s.vy

      // 轨迹记录
      s.trail.push({ x: s.x, y: s.y })
      if (s.trail.length > TRAIL_LENGTH) s.trail.shift()

      // 生命周期淡入淡出
      const t = s.life / s.maxLife
      const fade = t < 0.15 ? t / 0.15 : t > 0.7 ? 1 - (t - 0.7) / 0.3 : 1

      // 绘制轨迹
      if (s.trail.length > 1) {
        for (let j = 1; j < s.trail.length; j++) {
          const trailAlpha = (j / s.trail.length) * s.alpha * fade * 0.5
          canvasCtx!.beginPath()
          canvasCtx!.moveTo(s.trail[j - 1].x, s.trail[j - 1].y)
          canvasCtx!.lineTo(s.trail[j].x, s.trail[j].y)
          canvasCtx!.strokeStyle = `hsla(${s.hue}, ${s.saturation}%, ${s.lightness}%, ${trailAlpha})`
          canvasCtx!.lineWidth = s.r * (j / s.trail.length)
          canvasCtx!.lineCap = 'round'
          canvasCtx!.stroke()
        }
      }

      // 绘制火花核心
      const glow = canvasCtx!.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4)
      glow.addColorStop(0, `hsla(${s.hue}, 100%, 90%, ${s.alpha * fade})`)
      glow.addColorStop(0.3, `hsla(${s.hue}, 90%, 65%, ${s.alpha * fade * 0.7})`)
      glow.addColorStop(1, `hsla(${s.hue}, 80%, 50%, 0)`)
      canvasCtx!.beginPath()
      canvasCtx!.arc(s.x, s.y, s.r * 4, 0, Math.PI * 2)
      canvasCtx!.fillStyle = glow
      canvasCtx!.fill()

      // 边界折返
      if (s.x < -20) s.x = cw + 20
      if (s.x > cw + 20) s.x = -20
      if (s.y < -20) s.y = ch + 20
      if (s.y > ch + 20) s.y = -20
    }

    sparkAnimId = requestAnimationFrame(animate)
  }
  sparkAnimId = requestAnimationFrame(animate)
}

// ═════════════════════════════════════════════════════════════
//  入场动画
// ═════════════════════════════════════════════════════════════
function setupEntrance() {
  if (!scrollRef.value || !headerRef.value) return

  const titleChars = [titleChar1.value, titleChar2.value, titleChar3.value, titleChar4.value].filter(Boolean)

  const entranceTl = gsap.timeline({
    scrollTrigger: {
      trigger: scrollRef.value,
      scroller: scrollRef.value,
      start: 'top 75%',
      toggleActions: 'play none none reverse',
    },
  })

  entranceTl
    .fromTo(headerRef.value, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.85, ease: 'power3.out' })
    // 标题四字逐字弹入
    .fromTo(titleChars, { autoAlpha: 0, y: 40, scale: 0.3, rotation: -15 }, {
      autoAlpha: 1, y: 0, scale: 1, rotation: 0,
      duration: 0.65, stagger: 0.08, ease: 'back.out(2.2)',
    }, '-=0.4')
    .fromTo(headerLineRef.value, { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'power3.inOut' }, '-=0.3')
    // 火花核心入场
    .fromTo(coreRef.value, { autoAlpha: 0, scale: 0 }, { autoAlpha: 1, scale: 1, duration: 0.7, ease: 'back.out(2)' }, '-=0.35')
    // 标题两端火花装饰
    .fromTo([headerSparkL.value, headerSparkR.value], { autoAlpha: 0, scale: 0, rotation: -45 }, {
      autoAlpha: 1, scale: 1, rotation: 0,
      duration: 0.5, stagger: 0.06, ease: 'back.out(1.8)',
    }, '-=0.3')

  cleanupFns.push(() => {
    entranceTl.scrollTrigger?.kill()
    entranceTl.kill()
  })
}

// ═════════════════════════════════════════════════════════════
//  核心火花风暴动画
// ═════════════════════════════════════════════════════════════
function setupSparkStorm() {
  if (!scrollRef.value || !trackRef.value) return

  const scroller = scrollRef.value
  const track = trackRef.value
  const frames_ = frameRefs.value
  const glows = frameGlowRefs.value
  const images = imgRefs.value
  const burns = burnEdgeRefs.value
  const captions = captionRefs.value

  if (!frames_.length || !glows.length || !images.length || !burns.length || !captions.length) return

  // ── 初始化帧状态 ──
  frames_.forEach((frame, i) => {
    gsap.set(frame, {
      position: 'absolute',
      inset: 0,
      zIndex: FRAME_COUNT - i,
    })

    if (i === 0) {
      gsap.set(frame, { autoAlpha: 1 })
      gsap.set(glows[i], { opacity: 0.25, scale: 0.95 })
      gsap.set(images[i], {
        scale: 1.05,
        filter: 'brightness(1.15) saturate(1.25) contrast(1.05)',
        clipPath: 'inset(0% 0% 0% 0%)',
      })
      gsap.set(burns[i], { opacity: 0 })
      gsap.set(captions[i], { autoAlpha: 1, y: 0 })
    } else {
      gsap.set(frame, { autoAlpha: 0 })
      gsap.set(glows[i], { opacity: 0, scale: 0.5 })
      gsap.set(images[i], {
        scale: 1.35,
        filter: 'brightness(2.5) saturate(2) contrast(1.3) blur(8px)',
        clipPath: 'inset(0% 0% 100% 0%)',
      })
      gsap.set(burns[i], { opacity: 0.8 })
      gsap.set(captions[i], { autoAlpha: 0, y: 30 })
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
      scrub: 1.15,
    },
  })

  frames_.forEach((_frame, i) => {
    const offset = i
    const glow = glows[i]
    const img = images[i]
    const burn = burns[i]
    const caption = captions[i]

    // 🟡 Phase 1: 当前帧的火花从底部向上"燃烧"揭示 (0 → 0.4)
    masterTl
      .to(img, {
        clipPath: 'inset(0% 0% 0% 0%)',
        filter: 'brightness(1.15) saturate(1.25) contrast(1.05)',
        scale: 1.05,
        duration: 0.4,
        ease: 'power2.out',
      }, offset)
      .to(glow, {
        opacity: 0.25,
        scale: 0.95,
        duration: 0.4,
        ease: 'power2.out',
      }, offset)
      .to(burn, {
        opacity: 0,
        duration: 0.35,
      }, offset + 0.05)
      .to(caption, {
        autoAlpha: 1,
        y: 0,
        duration: 0.3,
        ease: 'power2.out',
      }, offset + 0.12)

    // 🟠 Phase 2: 峰值驻留 (0.4 → 0.55) — 轻微呼吸
    masterTl
      .to(glow, { opacity: 0.35, scale: 1.02, duration: 0.15, ease: 'sine.inOut' }, offset + 0.4)
      .to(glow, { opacity: 0.25, scale: 0.95, duration: 0.15, ease: 'sine.inOut' }, offset + 0.48)

    // 🔴 Phase 3: 燃尽退场 — 火光爆发，从底部向上烧毁 (0.55 → 0.7)
    masterTl
      .to(img, {
        clipPath: 'inset(0% 0% 100% 0%)',
        filter: 'brightness(3) saturate(2.5) contrast(1.5) blur(10px)',
        scale: 1.35,
        duration: 0.25,
        ease: 'power3.in',
      }, offset + 0.55)
      .to(glow, {
        opacity: 1.2,
        scale: 1.3,
        duration: 0.2,
        ease: 'power2.in',
      }, offset + 0.55)
      .to(burn, {
        opacity: 0.9,
        duration: 0.2,
      }, offset + 0.57)
      .to(caption, {
        autoAlpha: 0,
        y: -20,
        duration: 0.15,
      }, offset + 0.56)
      .to(_frame, {
        autoAlpha: 0,
        duration: 0.15,
      }, offset + 0.65)

    // 🔵 Phase 4: 下一帧从火花中浮现
    if (i < FRAME_COUNT - 1) {
      const nextFrame = frames_[i + 1]
      const nextGlow = glows[i + 1]
      const nextImg = images[i + 1]
      const nextBurn = burns[i + 1]

      masterTl
        .to(nextFrame, { autoAlpha: 1, duration: 0.12 }, offset + 0.62)
        .to(nextImg, {
          clipPath: 'inset(0% 0% 0% 0%)',
          filter: 'brightness(1.15) saturate(1.25) contrast(1.05)',
          scale: 1.05,
          duration: 0.35,
          ease: 'power2.out',
        }, offset + 0.65)
        .to(nextGlow, {
          opacity: 0.25,
          scale: 0.95,
          duration: 0.35,
          ease: 'power2.out',
        }, offset + 0.65)
        .to(nextBurn, {
          opacity: 0,
          duration: 0.3,
        }, offset + 0.68)
    }
  })

  // ── 火花核心脉动 ──
  if (coreRef.value) {
    for (let i = 0; i < FRAME_COUNT; i++) {
      const pulseOffset = i + 0.55
      masterTl
        .to(coreRef.value, { scale: 2.2, opacity: 1, duration: 0.12, ease: 'power2.in' }, pulseOffset)
        .to(coreRef.value, { scale: 0.9, opacity: 0.6, duration: 0.2, ease: 'power2.out' }, pulseOffset + 0.12)
        .to(coreRef.value, { scale: 1, opacity: 0.8, duration: 0.15, ease: 'sine.inOut' }, pulseOffset + 0.32)
    }
  }

  // ── 背景光晕轮转 ──
  if (orbGold.value && orbCoral.value && orbAmber.value && orbWhite.value) {
    masterTl
      .to(orbGold.value, { x: '12vw', y: '-8vh', scale: 1.25, duration: FRAME_COUNT }, 0)
      .to(orbCoral.value, { x: '-10vw', y: '10vh', scale: 1.3, duration: FRAME_COUNT }, 0)
      .to(orbAmber.value, { x: '-6vw', y: '-14vh', scale: 1.2, duration: FRAME_COUNT }, 0)
      .to(orbWhite.value, { x: '8vw', y: '6vh', scale: 1.35, duration: FRAME_COUNT }, 0)
  }

  // ── 进度条 ──
  if (progressFillRef.value) {
    masterTl.to(progressFillRef.value, { width: '100%', duration: FRAME_COUNT }, 0)
  }

  // ── 火花爆发回调 ──
  frames_.forEach((_frame, i) => {
    const stBurst = ScrollTrigger.create({
      trigger: track,
      scroller,
      start: `${(i / FRAME_COUNT) * 100}% top`,
      onEnter: () => sparkBurst(cw / 2, ch / 2, 80, Math.min(cw, ch) * 0.5),
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
  initCanvas()
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      setupEntrance()
      setupSparkStorm()
    })
  })
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  cancelAnimationFrame(sparkAnimId)
  ScrollTrigger.getAll().forEach((st) => st.kill())
  cleanupFns.forEach((fn) => fn())
  cleanupFns.length = 0
  sparks.length = 0
})
</script>

<style scoped lang="scss">
/* ═══════════════════════════════════════════════════════════
   Spark Storm — 火花风暴
   类名前缀: ss-
   ═══════════════════════════════════════════════════════════ */

/* ── 根容器 ── */
.ss-root {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(170deg, #1a0a00 0%, #2d1a08 25%, #3d1f0a 50%, #1f1005 100%);
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif;
}

/* ── 背景光晕 ── */
.ss-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  pointer-events: none;
  will-change: transform;
  z-index: 0;
}

.ss-orb--gold {
  width: 38vw;
  height: 38vw;
  top: -5vh;
  left: -5vw;
  background: radial-gradient(circle, rgba(255, 185, 30, 0.5) 0%, transparent 70%);
}

.ss-orb--coral {
  width: 34vw;
  height: 34vw;
  bottom: -8vh;
  right: -4vw;
  background: radial-gradient(circle, rgba(255, 98, 80, 0.4) 0%, transparent 70%);
}

.ss-orb--amber {
  width: 30vw;
  height: 30vw;
  top: 50vh;
  left: 55vw;
  background: radial-gradient(circle, rgba(255, 160, 50, 0.35) 0%, transparent 70%);
}

.ss-orb--white {
  width: 24vw;
  height: 24vw;
  top: 15vh;
  left: 40vw;
  background: radial-gradient(circle, rgba(255, 240, 220, 0.3) 0%, transparent 70%);
}

/* ── Canvas 层 ── */
.ss-canvas {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

/* ── 滚动容器 ── */
.ss-scroll {
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
    background: rgba(255, 170, 60, 0.3);
    &:hover { background: rgba(255, 170, 60, 0.5); }
  }
}

.ss-track {
  position: relative;
  width: 100%;
}

.ss-sticky {
  position: sticky;
  top: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

/* ── 标题区 ── */
.ss-header {
  position: absolute;
  top: 3vh;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  text-align: center;
  width: min(92vw, 800px);
}

.ss-header-sparkle {
  position: absolute;
  top: 50%;
  width: 36px;
  height: 36px;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.85) 0%, rgba(255, 180, 30, 0.4) 40%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  animation: ss-sparkle-twinkle 2s ease-in-out infinite;

  &--l { left: -8px; animation-delay: 0s; }
  &--r { right: -8px; animation-delay: 0.6s; }
}

@keyframes ss-sparkle-twinkle {
  0%, 100% { transform: translateY(-50%) scale(0.6); opacity: 0.4; }
  50% { transform: translateY(-50%) scale(1.3); opacity: 1; }
}

.ss-kicker {
  display: inline-block;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(255, 200, 100, 0.85);
  background: rgba(255, 160, 30, 0.1);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 180, 50, 0.2);
  border-radius: 999px;
  padding: 0.35rem 1.4rem;
  margin-bottom: 0.7rem;
}

.ss-title {
  margin: 0;
  display: flex;
  justify-content: center;
  gap: 0.15em;
}

.ss-title__char {
  display: inline-block;
  font-size: clamp(2.4rem, 6vw, 4.8rem);
  font-weight: 900;
  background: linear-gradient(180deg, #ffd700 0%, #ff8c00 50%, #ff6347 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 20px rgba(255, 165, 0, 0.6));
  will-change: transform, opacity;
}

.ss-header-line {
  width: 80px;
  height: 2px;
  margin: 0.5rem auto 0.7rem;
  border-radius: 2px;
  background: linear-gradient(90deg, transparent, #ffb347, #ff6347, transparent);
  transform-origin: center;
}

.ss-subtitle {
  margin: 0;
  font-size: clamp(0.78rem, 1.2vw, 0.9rem);
  color: rgba(255, 210, 140, 0.65);
  line-height: 1.5;
  max-width: 460px;
  margin-inline: auto;
}

/* ── 火花核心指示器 ── */
.ss-core {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 25;
  pointer-events: none;
  will-change: transform, opacity;
}

.ss-core__ring {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 200, 80, 0.5);
  transform: translate(-50%, -50%);
  animation: ss-ring-pulse 3s ease-in-out infinite;

  &--1 { width: 80px; height: 80px; animation-delay: 0s; }
  &--2 { width: 120px; height: 120px; animation-delay: 0.5s; }
  &--3 { width: 160px; height: 160px; animation-delay: 1s; }
}

@keyframes ss-ring-pulse {
  0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(0.9); }
  50% { opacity: 0.7; transform: translate(-50%, -50%) scale(1.1); }
}

.ss-core__dot {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #fff;
  box-shadow:
    0 0 12px rgba(255, 255, 255, 1),
    0 0 30px rgba(255, 200, 50, 0.9),
    0 0 60px rgba(255, 140, 20, 0.6),
    0 0 100px rgba(255, 100, 30, 0.4);
}

/* ── 舞台 ── */
.ss-stage {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

/* ── 帧容器 ── */
.ss-frame {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  will-change: opacity;
}

.ss-frame__glow {
  position: absolute;
  inset: -5%;
  z-index: 2;
  pointer-events: none;
  background: radial-gradient(
    ellipse 60% 50% at 50% 50%,
    rgba(255, 180, 40, 0.35) 0%,
    rgba(255, 120, 30, 0.15) 35%,
    transparent 70%
  );
  will-change: opacity, transform;
}

.ss-frame__img {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform-origin: center center;
  will-change: transform, filter, clip-path;
}

.ss-frame__burn {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  background: linear-gradient(
    0deg,
    rgba(255, 80, 20, 0.7) 0%,
    rgba(255, 160, 30, 0.4) 30%,
    rgba(255, 200, 50, 0.1) 60%,
    transparent 100%
  );
  will-change: opacity;
}

/* ── 帧文字 ── */
.ss-frame__caption {
  position: absolute;
  left: max(5vw, 24px);
  bottom: 10vh;
  z-index: 20;
  max-width: min(80vw, 600px);
  will-change: transform, opacity;
}

.ss-frame__num {
  display: inline-flex;
  align-items: center;
  height: 1.7rem;
  padding: 0 0.9rem;
  border-radius: 999px;
  background: rgba(255, 160, 30, 0.2);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 180, 50, 0.3);
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #ffd080;
}

.ss-frame__title {
  margin: 0.7rem 0 0;
  font-size: clamp(2rem, 5.5vw, 4.2rem);
  font-weight: 900;
  line-height: 1.1;
  color: #fff;
  text-shadow:
    0 3px 20px rgba(0, 0, 0, 0.5),
    0 0 60px rgba(255, 160, 40, 0.4);
}

.ss-frame__desc {
  margin: 0.5rem 0 0;
  font-size: clamp(0.82rem, 1.3vw, 1rem);
  line-height: 1.6;
  color: rgba(255, 230, 190, 0.85);
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}

/* ── 进度条 ── */
.ss-progress {
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 30;
  width: 100%;
  height: 3px;
  background: rgba(255, 180, 60, 0.08);
}

.ss-progress__fill {
  width: 0;
  height: 100%;
  background: linear-gradient(90deg, #ffb347, #ff6347, #ffd700, #ff8c00, #ffb347);
  background-size: 200% 100%;
  box-shadow: 0 0 16px rgba(255, 150, 40, 0.7);
}

.ss-progress__sparks {
  position: absolute;
  top: -6px;
  left: 0;
  width: 100%;
  height: 12px;
  pointer-events: none;
}

/* ── 响应式 ── */
@media (max-width: 768px) {
  .ss-header { top: 2vh; }
  .ss-kicker { font-size: 0.58rem; padding: 0.25rem 0.8rem; }

  .ss-title__char { font-size: 2rem; }

  .ss-core__ring {
    &--1 { width: 50px; height: 50px; }
    &--2 { width: 75px; height: 75px; }
    &--3 { width: 100px; height: 100px; }
  }

  .ss-frame__caption { bottom: 7vh; }
  .ss-frame__title { font-size: 1.5rem; }
}
</style>
