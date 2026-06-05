<template>
  <section ref="rootRef" class="sf-root">
    <!-- 光爆背景 -->
    <div ref="bgFlare1" class="sf-bg-flare sf-bg-flare--1"></div>
    <div ref="bgFlare2" class="sf-bg-flare sf-bg-flare--2"></div>
    <div ref="bgFlare3" class="sf-bg-flare sf-bg-flare--3"></div>

    <!-- 光线束容器 -->
    <div ref="raysRef" class="sf-rays">
      <span
        v-for="n in 18"
        :key="n"
        :ref="(el) => setRayRef(el, n - 1)"
        class="sf-ray"
        :style="{ transform: `rotate(${(n - 1) * 20}deg)` }"
      ></span>
    </div>

    <!-- 镜头光晕粒子 -->
    <canvas ref="canvasRef" class="sf-canvas"></canvas>

    <!-- 滚动容器 -->
    <div ref="scrollRef" class="sf-scroll">
      <div ref="trackRef" class="sf-track" :style="{ height: trackHeight }">
        <div class="sf-sticky">

          <!-- 标题区 -->
          <header ref="headerRef" class="sf-header">
            <span class="sf-kicker">☀ Solar Flare · 日冕耀斑 ☀</span>
            <h1 class="sf-title">
              <span ref="titleWord1" class="sf-title__word">日冕</span>
              <span ref="titleWord2" class="sf-title__word">耀斑</span>
            </h1>
            <div ref="headerLineRef" class="sf-header-line"></div>
            <p class="sf-subtitle">向下滚动 · 光芒四射 · 每一帧从曝光中显影而出</p>
          </header>

          <!-- 中心日冕 -->
          <div ref="coronaRef" class="sf-corona">
            <div class="sf-corona__ring sf-corona__ring--outer"></div>
            <div class="sf-corona__ring sf-corona__ring--mid"></div>
            <div class="sf-corona__ring sf-corona__ring--inner"></div>
            <div class="sf-corona__core"></div>
          </div>

          <!-- 图片舞台 -->
          <div class="sf-stage">
            <article
              v-for="(frame, idx) in frames"
              :key="frame.id"
              :ref="(el) => setFrameRef(el, idx)"
              class="sf-frame"
            >
              <!-- 过度曝光层 -->
              <div
                :ref="(el) => setOverexposeRef(el, idx)"
                class="sf-frame__overexpose"
              ></div>
              <!-- 图片 -->
              <img
                :ref="(el) => setImgRef(el, idx)"
                class="sf-frame__img"
                :src="frame.image"
                :alt="frame.alt"
                loading="lazy"
              />
              <!-- 色差边缘 -->
              <div
                :ref="(el) => setChromaticRef(el, idx)"
                class="sf-frame__chromatic"
              ></div>
              <!-- 光漏 -->
              <div
                :ref="(el) => setLightLeakRef(el, idx)"
                class="sf-frame__leak"
              ></div>
              <!-- 文字 -->
              <div
                :ref="(el) => setCaptionRef(el, idx)"
                class="sf-frame__caption"
              >
                <span class="sf-frame__num">{{ frame.label }}</span>
                <h2 class="sf-frame__title">{{ frame.title }}</h2>
                <p class="sf-frame__desc">{{ frame.description }}</p>
              </div>
            </article>
          </div>

          <!-- 底部光线进度 -->
          <div class="sf-progress">
            <div ref="progressFillRef" class="sf-progress__fill"></div>
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
//  CardImageSolarFlare — 日冕耀斑
//
//  核心概念：
//  1. 图片以"过度曝光"状态出现 — 亮到看不清
//  2. 用户竖滚 → 曝光逐渐降低 → 图片从白光中显影而出
//  3. 18道光束围绕中心旋转，模拟日冕射线
//  4. 中心"日冕"光环脉动
//  5. Canvas 镜头光晕粒子
//  6. 色差(chromatic aberration)过场效果
//  7. 明亮青春：奶油白 · 香槟金 · 暖琥珀 · 柔和珊瑚
// ═══════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

interface FlareFrame {
  id: string
  label: string
  title: string
  description: string
  image: string
  alt: string
}

const frames: FlareFrame[] = [
  {
    id: 'golden-hour',
    label: 'Frame 01',
    title: '金色时刻',
    description: '过度曝光褪去，金色阳光在画面中温柔显影。',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80',
    alt: '金色阳光洒落田野',
  },
  {
    id: 'light-bloom',
    label: 'Frame 02',
    title: '光之绽放',
    description: '白光消散后，绚烂的色彩如花朵般从画面中央绽开。',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1920&q=80',
    alt: '鲜艳花朵在阳光下绽放',
  },
  {
    id: 'radiant-wave',
    label: 'Frame 03',
    title: '辐射波澜',
    description: '日冕射线扫过画面，青蓝海面折射出万千光斑。',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80',
    alt: '阳光穿透碧蓝海浪',
  },
  {
    id: 'crepuscular',
    label: 'Frame 04',
    title: '云隙圣光',
    description: '如同云层缝隙中倾泻的上帝之光，画面在光束中清晰。',
    image: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=1920&q=80',
    alt: '云隙光照亮山脊',
  },
  {
    id: 'solar-peak',
    label: 'Frame 05',
    title: '日冕之巅',
    description: '光芒达到顶峰，整个世界被包裹在温暖的白金光辉中。',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80',
    alt: '俯瞰大地被阳光普照',
  },
]

const FRAME_COUNT = frames.length
const trackHeight = `${(FRAME_COUNT + 1) * 100}vh`
const RAY_COUNT = 18

// ── Refs ─────────────────────────────────────────────────────
const rootRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const headerLineRef = ref<HTMLElement | null>(null)
const titleWord1 = ref<HTMLElement | null>(null)
const titleWord2 = ref<HTMLElement | null>(null)
const coronaRef = ref<HTMLElement | null>(null)
const raysRef = ref<HTMLElement | null>(null)
const progressFillRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const bgFlare1 = ref<HTMLElement | null>(null)
const bgFlare2 = ref<HTMLElement | null>(null)
const bgFlare3 = ref<HTMLElement | null>(null)

const rayRefs = ref<HTMLElement[]>([])
const setRayRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) rayRefs.value[i] = el }

const frameRefs = ref<HTMLElement[]>([])
const overexposeRefs = ref<HTMLElement[]>([])
const imgRefs = ref<HTMLImageElement[]>([])
const chromaticRefs = ref<HTMLElement[]>([])
const lightLeakRefs = ref<HTMLElement[]>([])
const captionRefs = ref<HTMLElement[]>([])

const setFrameRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) frameRefs.value[i] = el }
const setOverexposeRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) overexposeRefs.value[i] = el }
const setImgRef = (el: Element | null, i: number) => { if (el instanceof HTMLImageElement) imgRefs.value[i] = el }
const setChromaticRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) chromaticRefs.value[i] = el }
const setLightLeakRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) lightLeakRefs.value[i] = el }
const setCaptionRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) captionRefs.value[i] = el }

const cleanupFns: TweenCleanup[] = []

// ═════════════════════════════════════════════════════════════
//  Canvas 镜头光晕粒子
// ═════════════════════════════════════════════════════════════
interface FlareParticle {
  x: number; y: number
  vx: number; vy: number
  r: number
  alpha: number
  life: number; maxLife: number
  hue: number
  ring: number // 0=core, 1=mid, 2=outer
}

let canvasCtx: CanvasRenderingContext2D | null = null
let cw = 0; let ch = 0
const flareParticles: FlareParticle[] = []
let flareAnimId = 0
const MAX_FLARES = 120
const BASE_FLARES = 40

function createFlareParticle(x?: number, y?: number): FlareParticle {
  const cx = x ?? Math.random() * cw
  const cy = y ?? Math.random() * ch
  const angle = Math.random() * Math.PI * 2
  const speed = 0.3 + Math.random() * 1.8
  return {
    x: cx, y: cy,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    r: 2 + Math.random() * 6,
    alpha: 0.15 + Math.random() * 0.5,
    life: 0,
    maxLife: 80 + Math.random() * 200,
    hue: 35 + Math.random() * 25, // 35-60 暖金到琥珀
    ring: Math.floor(Math.random() * 3),
  }
}

function flareBurst(cx: number, cy: number, count: number) {
  for (let i = 0; i < count; i++) {
    flareParticles.push(createFlareParticle(cx, cy))
  }
  while (flareParticles.length > MAX_FLARES) flareParticles.shift()
}

function initFlareCanvas() {
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

  for (let i = 0; i < BASE_FLARES; i++) {
    flareParticles.push(createFlareParticle())
  }

  function animate() {
    if (!canvasCtx) return

    // 维持基础粒子数
    if (flareParticles.length < BASE_FLARES) {
      flareParticles.push(createFlareParticle())
    }

    canvasCtx.clearRect(0, 0, cw, ch)

    for (let i = flareParticles.length - 1; i >= 0; i--) {
      const p = flareParticles[i]
      p.life++
      if (p.life >= p.maxLife) { flareParticles.splice(i, 1); continue }

      const t = p.life / p.maxLife
      const fade = t < 0.2 ? t / 0.2 : t > 0.7 ? 1 - (t - 0.7) / 0.3 : 1
      p.x += p.vx
      p.y += p.vy

      // 光晕渲染：多层径向渐变
      const glow = canvasCtx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5)
      const hueStr = `hsla(${p.hue}, 95%, 80%`
      glow.addColorStop(0, `${hueStr}, ${p.alpha * fade})`)
      glow.addColorStop(0.2, `${hueStr}, ${p.alpha * fade * 0.6})`)
      glow.addColorStop(0.5, `${hueStr}, ${p.alpha * fade * 0.2})`)
      glow.addColorStop(1, `${hueStr}, 0)`)

      canvasCtx!.beginPath()
      canvasCtx!.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2)
      canvasCtx!.fillStyle = glow
      canvasCtx!.fill()

      // 核心亮点
      canvasCtx!.beginPath()
      canvasCtx!.arc(p.x, p.y, p.r * 0.6, 0, Math.PI * 2)
      canvasCtx!.fillStyle = `rgba(255, 255, 240, ${p.alpha * fade * 1.2})`
      canvasCtx!.fill()

      // 边界折返
      if (p.x < -30) p.x = cw + 30
      if (p.x > cw + 30) p.x = -30
      if (p.y < -30) p.y = ch + 30
      if (p.y > ch + 30) p.y = -30
    }

    flareAnimId = requestAnimationFrame(animate)
  }
  flareAnimId = requestAnimationFrame(animate)
}

// ═════════════════════════════════════════════════════════════
//  入场动画
// ═════════════════════════════════════════════════════════════
function setupEntrance() {
  if (!scrollRef.value || !headerRef.value || !coronaRef.value || !raysRef.value) return

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: scrollRef.value,
      scroller: scrollRef.value,
      start: 'top 75%',
      toggleActions: 'play none none reverse',
    },
  })

  tl
    .fromTo(headerRef.value, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.85, ease: 'power3.out' })
    .fromTo(titleWord1.value, { autoAlpha: 0, x: -40, scale: 0.7 }, { autoAlpha: 1, x: 0, scale: 1, duration: 0.7, ease: 'back.out(1.8)' }, '-=0.45')
    .fromTo(titleWord2.value, { autoAlpha: 0, x: 40, scale: 0.7 }, { autoAlpha: 1, x: 0, scale: 1, duration: 0.7, ease: 'back.out(1.8)' }, '-=0.55')
    .fromTo(headerLineRef.value, { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'power3.inOut' }, '-=0.35')
    .fromTo(coronaRef.value, { autoAlpha: 0, scale: 0.2 }, { autoAlpha: 1, scale: 1, duration: 0.8, ease: 'back.out(2)' }, '-=0.4')
    // 光线束入场
    .fromTo(rayRefs.value.filter(Boolean), { autoAlpha: 0, scaleX: 0 }, { autoAlpha: 0.6, scaleX: 1, duration: 0.6, stagger: 0.02, ease: 'power2.out' }, '-=0.3')

  cleanupFns.push(() => {
    tl.scrollTrigger?.kill()
    tl.kill()
  })
}

// ═════════════════════════════════════════════════════════════
//  核心：日冕耀斑动画
// ═════════════════════════════════════════════════════════════
function setupSolarFlare() {
  if (!scrollRef.value || !trackRef.value) return

  const scroller = scrollRef.value
  const track = trackRef.value
  const frames_ = frameRefs.value
  const overexposes = overexposeRefs.value
  const images = imgRefs.value
  const chromatics = chromaticRefs.value
  const lightLeaks = lightLeakRefs.value
  const captions = captionRefs.value

  if (!frames_.length || !overexposes.length || !images.length || !chromatics.length || !lightLeaks.length || !captions.length) return

  // ── 初始化帧状态 ──
  frames_.forEach((frame, i) => {
    gsap.set(frame, {
      position: 'absolute',
      inset: 0,
      zIndex: FRAME_COUNT - i,
    })

    if (i === 0) {
      // 第一帧：已经"显影"完成
      gsap.set(frame, { autoAlpha: 1 })
      gsap.set(overexposes[i], { opacity: 0 })
      gsap.set(images[i], {
        scale: 1.02,
        filter: 'brightness(1.05) saturate(1.1) contrast(1.02) blur(0px)',
      })
      gsap.set(chromatics[i], { opacity: 0 })
      gsap.set(lightLeaks[i], { opacity: 0.08 })
      gsap.set(captions[i], { autoAlpha: 1, y: 0 })
    } else {
      // 其他帧：过度曝光状态
      gsap.set(frame, { autoAlpha: 0 })
      gsap.set(overexposes[i], { opacity: 0.95 })
      gsap.set(images[i], {
        scale: 1.08,
        filter: 'brightness(3.5) saturate(0.3) contrast(1.4) blur(12px)',
      })
      gsap.set(chromatics[i], { opacity: 0.6 })
      gsap.set(lightLeaks[i], { opacity: 0.5 })
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
      scrub: 1.2,
    },
  })

  frames_.forEach((_frame, i) => {
    const offset = i
    const overexpose = overexposes[i]
    const img = images[i]
    const chromatic = chromatics[i]
    const leak = lightLeaks[i]
    const caption = captions[i]

    // ☀ Phase 1: 曝光逐渐降低 → 图片从白光中显影 (0 → 0.45)
    masterTl
      .to(overexpose, {
        opacity: 0,
        duration: 0.45,
        ease: 'power2.out',
      }, offset)
      .to(img, {
        filter: 'brightness(1.05) saturate(1.1) contrast(1.02) blur(0px)',
        scale: 1.02,
        duration: 0.45,
        ease: 'power2.out',
      }, offset)
      .to(chromatic, {
        opacity: 0,
        duration: 0.38,
        ease: 'power2.out',
      }, offset + 0.04)
      .to(leak, {
        opacity: 0.08,
        duration: 0.4,
        ease: 'power2.out',
      }, offset + 0.05)
      .to(caption, {
        autoAlpha: 1,
        y: 0,
        duration: 0.3,
        ease: 'power2.out',
      }, offset + 0.12)

    // ☀ Phase 2: 清晰驻留，轻微亮度呼吸 (0.45 → 0.58)
    masterTl
      .to(img, { filter: 'brightness(1.1) saturate(1.15) contrast(1.04) blur(0px)', duration: 0.13 }, offset + 0.45)
      .to(img, { filter: 'brightness(1.05) saturate(1.1) contrast(1.02) blur(0px)', duration: 0.13 }, offset + 0.52)

    // ☀ Phase 3: 重新过度曝光 → 燃亮退场 (0.58 → 0.72)
    masterTl
      .to(overexpose, {
        opacity: 0.98,
        duration: 0.2,
        ease: 'power3.in',
      }, offset + 0.58)
      .to(img, {
        filter: 'brightness(4) saturate(0.2) contrast(1.6) blur(16px)',
        scale: 1.1,
        duration: 0.2,
        ease: 'power3.in',
      }, offset + 0.58)
      .to(chromatic, {
        opacity: 0.7,
        duration: 0.18,
      }, offset + 0.58)
      .to(leak, {
        opacity: 0.6,
        duration: 0.18,
      }, offset + 0.59)
      .to(caption, {
        autoAlpha: 0,
        y: -20,
        duration: 0.14,
      }, offset + 0.58)
      .to(_frame, {
        autoAlpha: 0,
        duration: 0.15,
      }, offset + 0.66)

    // ☀ Phase 4: 下一帧从曝光中出现
    if (i < FRAME_COUNT - 1) {
      const nextFrame = frames_[i + 1]
      const nextOverexpose = overexposes[i + 1]
      const nextImg = images[i + 1]
      const nextChromatic = chromatics[i + 1]
      const nextLeak = lightLeaks[i + 1]

      masterTl
        .to(nextFrame, { autoAlpha: 1, duration: 0.1 }, offset + 0.63)
        .to(nextOverexpose, {
          opacity: 0,
          duration: 0.4,
          ease: 'power2.out',
        }, offset + 0.66)
        .to(nextImg, {
          filter: 'brightness(1.05) saturate(1.1) contrast(1.02) blur(0px)',
          scale: 1.02,
          duration: 0.4,
          ease: 'power2.out',
        }, offset + 0.66)
        .to(nextChromatic, {
          opacity: 0,
          duration: 0.35,
          ease: 'power2.out',
        }, offset + 0.68)
        .to(nextLeak, {
          opacity: 0.08,
          duration: 0.35,
          ease: 'power2.out',
        }, offset + 0.69)
    }
  })

  // ── 光束旋转 ──
  if (raysRef.value) {
    masterTl
      .to(raysRef.value, { rotation: 180, duration: FRAME_COUNT, ease: 'none' }, 0)
    // 光束透明度随过场脉动
    frames_.forEach((_frame, i) => {
      masterTl
        .to(raysRef.value, { opacity: 1, duration: 0.1, ease: 'power2.in' }, i + 0.55)
        .to(raysRef.value, { opacity: 0.45, duration: 0.2, ease: 'power2.out' }, i + 0.65)
    })
  }

  // ── 日冕光环脉动 ──
  if (coronaRef.value) {
    frames_.forEach((_frame, i) => {
      const pulseAt = i + 0.55
      masterTl
        .to(coronaRef.value, { scale: 2.5, opacity: 1, duration: 0.12, ease: 'power2.in' }, pulseAt)
        .to(coronaRef.value, { scale: 0.85, opacity: 0.7, duration: 0.22, ease: 'power2.out' }, pulseAt + 0.12)
        .to(coronaRef.value, { scale: 1, opacity: 0.85, duration: 0.15, ease: 'sine.inOut' }, pulseAt + 0.34)
    })
  }

  // ── 背景光斑移动 ──
  if (bgFlare1.value && bgFlare2.value && bgFlare3.value) {
    masterTl
      .to(bgFlare1.value, { x: '10vw', y: '8vh', scale: 1.2, duration: FRAME_COUNT }, 0)
      .to(bgFlare2.value, { x: '-8vw', y: '-10vh', scale: 1.25, duration: FRAME_COUNT }, 0)
      .to(bgFlare3.value, { x: '-6vw', y: '12vh', scale: 1.3, duration: FRAME_COUNT }, 0)
  }

  // ── 进度条 ──
  if (progressFillRef.value) {
    masterTl.to(progressFillRef.value, { width: '100%', duration: FRAME_COUNT }, 0)
  }

  // ── 光晕爆发回调 ──
  frames_.forEach((_frame, i) => {
    const stBurst = ScrollTrigger.create({
      trigger: track,
      scroller,
      start: `${(i / FRAME_COUNT) * 100}% top`,
      onEnter: () => flareBurst(cw / 2, ch / 2, 50),
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
  initFlareCanvas()
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      setupEntrance()
      setupSolarFlare()
    })
  })
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  cancelAnimationFrame(flareAnimId)
  ScrollTrigger.getAll().forEach((st) => st.kill())
  cleanupFns.forEach((fn) => fn())
  cleanupFns.length = 0
  flareParticles.length = 0
})
</script>

<style scoped lang="scss">
/* ═══════════════════════════════════════════════════════════
   Solar Flare — 日冕耀斑
   类名前缀: sf-
   ═══════════════════════════════════════════════════════════ */

/* ── 根容器 ── */
.sf-root {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(160deg, #fff8f0 0%, #fff3e0 25%, #ffe8d0 50%, #fff5ec 75%, #fef9f4 100%);
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif;
}

/* ── 背景光爆 ── */
.sf-bg-flare {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  pointer-events: none;
  will-change: transform;
  z-index: 0;
}

.sf-bg-flare--1 {
  width: 45vw;
  height: 45vw;
  top: -10vh;
  left: -5vw;
  background: radial-gradient(circle, rgba(255, 210, 120, 0.6) 0%, rgba(255, 240, 200, 0.3) 40%, transparent 70%);
}

.sf-bg-flare--2 {
  width: 38vw;
  height: 38vw;
  bottom: -12vh;
  right: -6vw;
  background: radial-gradient(circle, rgba(255, 180, 100, 0.5) 0%, rgba(255, 220, 180, 0.25) 40%, transparent 70%);
}

.sf-bg-flare--3 {
  width: 32vw;
  height: 32vw;
  top: 40vh;
  left: 50vw;
  background: radial-gradient(circle, rgba(255, 240, 200, 0.45) 0%, rgba(255, 200, 140, 0.2) 40%, transparent 70%);
}

/* ── 光线束 ── */
.sf-rays {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  pointer-events: none;
  will-change: transform, opacity;
  opacity: 0.45;
}

.sf-ray {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 2px;
  height: 140vh;
  margin-top: -70vh;
  margin-left: -1px;
  background: linear-gradient(
    0deg,
    transparent 0%,
    rgba(255, 200, 100, 0.1) 30%,
    rgba(255, 230, 160, 0.5) 50%,
    rgba(255, 200, 100, 0.1) 70%,
    transparent 100%
  );
  transform-origin: center center;
}

/* ── Canvas 光晕 ── */
.sf-canvas {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

/* ── 滚动容器 ── */
.sf-scroll {
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
    background: rgba(200, 150, 80, 0.3);
    &:hover { background: rgba(200, 150, 80, 0.5); }
  }
}

.sf-track {
  position: relative;
  width: 100%;
}

.sf-sticky {
  position: sticky;
  top: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

/* ── 标题区 ── */
.sf-header {
  position: absolute;
  top: 3vh;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  text-align: center;
  width: min(90vw, 780px);
}

.sf-kicker {
  display: inline-block;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: rgba(180, 120, 50, 0.85);
  background: rgba(255, 200, 100, 0.15);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(200, 150, 80, 0.25);
  border-radius: 999px;
  padding: 0.3rem 1.3rem;
  margin-bottom: 0.6rem;
}

.sf-title {
  margin: 0;
  display: flex;
  justify-content: center;
  gap: 0.3em;
}

.sf-title__word {
  display: inline-block;
  font-size: clamp(2.2rem, 5.5vw, 4.5rem);
  font-weight: 900;
  background: linear-gradient(180deg, #e8a840 0%, #d4852a 40%, #c07030 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 2px 12px rgba(200, 140, 60, 0.5));
  will-change: transform, opacity;
}

.sf-header-line {
  width: 90px;
  height: 2px;
  margin: 0.45rem auto 0.6rem;
  border-radius: 2px;
  background: linear-gradient(90deg, transparent, #d4a040, #c08030, transparent);
  transform-origin: center;
}

.sf-subtitle {
  margin: 0;
  font-size: clamp(0.76rem, 1.15vw, 0.88rem);
  color: rgba(160, 110, 50, 0.7);
  line-height: 1.5;
  max-width: 440px;
  margin-inline: auto;
}

/* ── 中心日冕 ── */
.sf-corona {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 15;
  pointer-events: none;
  will-change: transform, opacity;
}

.sf-corona__ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;

  &--outer {
    width: 140px;
    height: 140px;
    border: 1px solid rgba(255, 180, 80, 0.3);
    box-shadow:
      0 0 40px rgba(255, 200, 100, 0.2),
      inset 0 0 40px rgba(255, 200, 100, 0.1);
  }

  &--mid {
    width: 90px;
    height: 90px;
    border: 1.5px solid rgba(255, 200, 100, 0.45);
    box-shadow:
      0 0 30px rgba(255, 220, 140, 0.3),
      inset 0 0 30px rgba(255, 220, 140, 0.15);
  }

  &--inner {
    width: 45px;
    height: 45px;
    border: 2px solid rgba(255, 230, 160, 0.6);
    box-shadow:
      0 0 25px rgba(255, 240, 180, 0.4),
      inset 0 0 25px rgba(255, 240, 180, 0.2);
  }
}

.sf-corona__core {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #fff;
  box-shadow:
    0 0 14px rgba(255, 255, 255, 1),
    0 0 40px rgba(255, 230, 150, 0.9),
    0 0 80px rgba(255, 180, 80, 0.6),
    0 0 140px rgba(255, 150, 50, 0.4);
}

/* ── 舞台 ── */
.sf-stage {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

/* ── 帧容器 ── */
.sf-frame {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  will-change: opacity;
}

/* ── 过度曝光层 ── */
.sf-frame__overexpose {
  position: absolute;
  inset: -5%;
  z-index: 5;
  background: radial-gradient(
    ellipse 50% 40% at 50% 50%,
    rgba(255, 255, 250, 1) 0%,
    rgba(255, 250, 240, 0.95) 30%,
    rgba(255, 240, 220, 0.6) 60%,
    transparent 100%
  );
  pointer-events: none;
  will-change: opacity;
  mix-blend-mode: screen;
}

/* ── 图片 ── */
.sf-frame__img {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform-origin: center center;
  will-change: transform, filter;
}

/* ── 色差边缘 ── */
.sf-frame__chromatic {
  position: absolute;
  inset: -3%;
  z-index: 2;
  pointer-events: none;
  background: radial-gradient(
    ellipse 65% 55% at 45% 45%,
    transparent 50%,
    rgba(255, 60, 20, 0.3) 80%,
    rgba(30, 80, 255, 0.25) 100%
  );
  mix-blend-mode: screen;
  will-change: opacity;
}

/* ── 光漏 ── */
.sf-frame__leak {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  background:
    linear-gradient(135deg, rgba(255, 240, 200, 0.4) 0%, transparent 25%),
    linear-gradient(225deg, transparent 60%, rgba(255, 200, 140, 0.35) 100%),
    linear-gradient(315deg, rgba(255, 255, 240, 0.3) 0%, transparent 30%);
  mix-blend-mode: screen;
  will-change: opacity;
}

/* ── 帧文字 ── */
.sf-frame__caption {
  position: absolute;
  left: max(5vw, 24px);
  bottom: 10vh;
  z-index: 20;
  max-width: min(80vw, 600px);
  will-change: transform, opacity;
}

.sf-frame__num {
  display: inline-flex;
  align-items: center;
  height: 1.65rem;
  padding: 0 0.85rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(200, 150, 80, 0.3);
  font-size: 0.64rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #8b6914;
}

.sf-frame__title {
  margin: 0.65rem 0 0;
  font-size: clamp(2rem, 5.2vw, 4rem);
  font-weight: 900;
  line-height: 1.1;
  color: #3d2000;
  text-shadow:
    0 2px 8px rgba(255, 255, 255, 0.6),
    0 0 40px rgba(255, 200, 100, 0.3);
}

.sf-frame__desc {
  margin: 0.45rem 0 0;
  font-size: clamp(0.8rem, 1.25vw, 0.98rem);
  line-height: 1.6;
  color: rgba(80, 40, 10, 0.75);
  text-shadow: 0 1px 4px rgba(255, 255, 255, 0.4);
}

/* ── 进度条 ── */
.sf-progress {
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 30;
  width: 100%;
  height: 3px;
  background: rgba(200, 150, 80, 0.1);
}

.sf-progress__fill {
  width: 0;
  height: 100%;
  background: linear-gradient(90deg, #e8c060, #d49530, #f0d878, #e8a840, #e8c060);
  background-size: 200% 100%;
  box-shadow: 0 0 12px rgba(220, 170, 70, 0.6);
}

/* ── 响应式 ── */
@media (max-width: 768px) {
  .sf-header { top: 2vh; }
  .sf-kicker { font-size: 0.56rem; padding: 0.22rem 0.7rem; }

  .sf-title__word { font-size: 1.7rem; }

  .sf-corona__ring {
    &--outer { width: 80px; height: 80px; }
    &--mid { width: 50px; height: 50px; }
    &--inner { width: 28px; height: 28px; }
  }

  .sf-frame__caption { bottom: 7vh; }
  .sf-frame__title { font-size: 1.4rem; color: #4a2800; }
}
</style>
