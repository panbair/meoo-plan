<template>
  <section ref="rootRef" class="wc-root">
    <!-- 速度线背景层 -->
    <div ref="speedLinesRef" class="wc-speedlines">
      <span
        v-for="n in 24"
        :key="n"
        :ref="(el) => setSpeedLineRef(el, n - 1)"
        class="wc-speedline"
        :style="speedLineStyle(n - 1)"
      ></span>
    </div>

    <!-- 动态光效 -->
    <div ref="lightStreakA" class="wc-streak wc-streak--a"></div>
    <div ref="lightStreakB" class="wc-streak wc-streak--b"></div>

    <!-- Canvas 动态粒子 -->
    <canvas ref="canvasRef" class="wc-canvas"></canvas>

    <!-- 滚动容器 -->
    <div ref="scrollRef" class="wc-scroll">
      <div ref="trackRef" class="wc-track" :style="{ height: trackHeight }">
        <div class="wc-sticky">

          <!-- 取景框覆盖层 -->
          <div class="wc-viewfinder">
            <div ref="vfTop" class="wc-vf-bar wc-vf-bar--top"></div>
            <div ref="vfBottom" class="wc-vf-bar wc-vf-bar--bottom"></div>
            <div class="wc-vf-corner wc-vf-corner--tl"></div>
            <div class="wc-vf-corner wc-vf-corner--tr"></div>
            <div class="wc-vf-corner wc-vf-corner--bl"></div>
            <div class="wc-vf-corner wc-vf-corner--br"></div>
            <!-- REC 指示器 -->
            <div ref="recDotRef" class="wc-rec">
              <span class="wc-rec__dot"></span>
              <span class="wc-rec__text">REC</span>
            </div>
            <!-- 焦距指示 -->
            <div ref="focalRef" class="wc-focal">
              <span class="wc-focal__label">FOCUS</span>
              <span class="wc-focal__val">∞</span>
            </div>
          </div>

          <!-- 标题 -->
          <header ref="headerRef" class="wc-header">
            <div class="wc-clap" ref="clapRef">
              <span class="wc-clap__stick"></span>
              <span class="wc-clap__board">
                <span class="wc-clap__text">SLATE</span>
              </span>
            </div>
            <span class="wc-kicker">🎬 Whip Pan · Crash Zoom · 甩镜冲击</span>
            <h1 class="wc-title">
              <span ref="titleWhip" class="wc-title__part">甩镜</span>
              <span ref="titleSlash" class="wc-title__slash">/</span>
              <span ref="titleCrash" class="wc-title__part">冲击</span>
            </h1>
            <div ref="headerLineRef" class="wc-header-line"></div>
            <p class="wc-subtitle">向下滚动 · 镜头闪电横摇 · 变焦冲击着陆</p>
          </header>

          <!-- 图片舞台 -->
          <div class="wc-stage">
            <article
              v-for="(frame, idx) in frames"
              :key="frame.id"
              :ref="(el) => setFrameRef(el, idx)"
              class="wc-frame"
            >
              <!-- 动态模糊层 -->
              <div
                :ref="(el) => setBlurStreakRef(el, idx)"
                class="wc-frame__blur-streak"
              ></div>
              <!-- 图片包裹 -->
              <div
                :ref="(el) => setImgWrapRef(el, idx)"
                class="wc-frame__img-wrap"
              >
                <img
                  :ref="(el) => setImgRef(el, idx)"
                  class="wc-frame__img"
                  :src="frame.image"
                  :alt="frame.alt"
                  loading="lazy"
                />
              </div>
              <!-- 冲击光晕 -->
              <div
                :ref="(el) => setCrashGlowRef(el, idx)"
                class="wc-frame__crash-glow"
              ></div>
              <!-- 文字 -->
              <div
                :ref="(el) => setCaptionRef(el, idx)"
                class="wc-frame__caption"
              >
                <span class="wc-frame__take">{{ frame.label }}</span>
                <h2 class="wc-frame__title">{{ frame.title }}</h2>
                <p class="wc-frame__desc">{{ frame.description }}</p>
              </div>
            </article>
          </div>

          <!-- 底部时间码 -->
          <div class="wc-timecode">
            <div ref="progressFillRef" class="wc-timecode__fill"></div>
            <span class="wc-timecode__text">TC 00:00:00:00</span>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ═══════════════════════════════════════════════════════════════════
//  CardImageWhipCrash — 甩镜冲击
//
//  运镜概念：
//  1. Whip Pan (甩镜头/闪电摇) — 摄像机快速水平横扫
//  2. Crash Zoom (冲击变焦) — 镜头急速推拉产生冲击感
//  3. 速度线 (Speed Lines) — 甩镜过程中的动态模糊条纹
//  4. 取景框 HUD — 电影摄影机取景器 UI 覆盖
//  5. 动态模糊模拟 — CSS filter blur + translate 组合
//  6. 冲击光晕 — 着陆时的爆发光效
//  7. 动作电影美学 — 霓虹电光 · 高速运动 · 视觉冲击
// ═══════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

interface WhipFrame {
  id: string
  label: string
  title: string
  description: string
  image: string
  alt: string
}

const frames: WhipFrame[] = [
  {
    id: 'action-rush',
    label: 'TAKE 01',
    title: '极速追逐',
    description: '镜头闪电横摇，追上一辆划破霓虹夜色的超跑。',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&q=80',
    alt: '高速跑车在霓虹街道飞驰',
  },
  {
    id: 'electric-dive',
    label: 'TAKE 02',
    title: '电光俯冲',
    description: '摄像机急甩而下，捕捉城市灯海中的光影轨迹。',
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&q=80',
    alt: '城市夜景俯瞰灯火辉煌',
  },
  {
    id: 'neon-crash',
    label: 'TAKE 03',
    title: '霓虹着陆',
    description: '冲击变焦锁定目标，霓虹招牌在画面中炸裂开来。',
    image: 'https://images.unsplash.com/photo-1515630278258-407f66498911?w=1920&q=80',
    alt: '霓虹灯招牌近景炫光',
  },
  {
    id: 'velocity-blur',
    label: 'TAKE 04',
    title: '速度虚化',
    description: '镜头横扫而过，一切化为流光，唯有目标清晰定格。',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80',
    alt: '高速运动模糊的自然风光',
  },
  {
    id: 'final-impact',
    label: 'TAKE 05',
    title: '终极冲击',
    description: '最后的变焦冲击，镜头全力推入，画面爆发至极限。',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80',
    alt: '阳光穿透森林形成光束',
  },
]

const FRAME_COUNT = frames.length
const trackHeight = `${(FRAME_COUNT + 1) * 100}vh`
const SPEED_LINE_COUNT = 24

// ── 速度线动态样式 ──
const speedLineStyle = (i: number) => ({
  '--sl-top': `${5 + Math.random() * 90}%`,
  '--sl-width': `${60 + Math.random() * 200}px`,
  '--sl-delay': `${Math.random() * 3}s`,
  '--sl-duration': `${1.5 + Math.random() * 2.5}s`,
  '--sl-opacity': `${0.05 + Math.random() * 0.2}`,
})

// ── Refs ─────────────────────────────────────────────────────
const rootRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const headerLineRef = ref<HTMLElement | null>(null)
const titleWhip = ref<HTMLElement | null>(null)
const titleSlash = ref<HTMLElement | null>(null)
const titleCrash = ref<HTMLElement | null>(null)
const clapRef = ref<HTMLElement | null>(null)
const recDotRef = ref<HTMLElement | null>(null)
const focalRef = ref<HTMLElement | null>(null)
const vfTop = ref<HTMLElement | null>(null)
const vfBottom = ref<HTMLElement | null>(null)
const speedLinesRef = ref<HTMLElement | null>(null)
const lightStreakA = ref<HTMLElement | null>(null)
const lightStreakB = ref<HTMLElement | null>(null)
const progressFillRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

const speedLineRefs = ref<HTMLElement[]>([])
const setSpeedLineRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) speedLineRefs.value[i] = el }

const frameRefs = ref<HTMLElement[]>([])
const blurStreakRefs = ref<HTMLElement[]>([])
const imgWrapRefs = ref<HTMLElement[]>([])
const imgRefs = ref<HTMLImageElement[]>([])
const crashGlowRefs = ref<HTMLElement[]>([])
const captionRefs = ref<HTMLElement[]>([])

const setFrameRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) frameRefs.value[i] = el }
const setBlurStreakRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) blurStreakRefs.value[i] = el }
const setImgWrapRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) imgWrapRefs.value[i] = el }
const setImgRef = (el: Element | null, i: number) => { if (el instanceof HTMLImageElement) imgRefs.value[i] = el }
const setCrashGlowRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) crashGlowRefs.value[i] = el }
const setCaptionRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) captionRefs.value[i] = el }

const cleanupFns: TweenCleanup[] = []

// ═════════════════════════════════════════════════════════════
//  Canvas 速度粒子
// ═════════════════════════════════════════════════════════════
interface StreakParticle {
  x: number; y: number
  vx: number; vy: number
  len: number
  alpha: number
  life: number; maxLife: number
}

let canvasCtx: CanvasRenderingContext2D | null = null
let cw = 0; let ch = 0
const streakParticles: StreakParticle[] = []
let streakAnimId = 0
const MAX_STREAKS = 200
const BASE_STREAKS = 60

function createStreak(): StreakParticle {
  return {
    x: Math.random() * cw,
    y: Math.random() * ch,
    vx: -(4 + Math.random() * 16), // 向左高速
    vy: (Math.random() - 0.5) * 2,
    len: 30 + Math.random() * 120,
    alpha: 0.1 + Math.random() * 0.4,
    life: 0,
    maxLife: 40 + Math.random() * 100,
  }
}

function streakBurst(count: number) {
  for (let i = 0; i < count; i++) {
    streakParticles.push(createStreak())
  }
  while (streakParticles.length > MAX_STREAKS) streakParticles.shift()
}

function initStreakCanvas() {
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

  for (let i = 0; i < BASE_STREAKS; i++) {
    streakParticles.push(createStreak())
  }

  function animate() {
    if (!canvasCtx) return
    if (streakParticles.length < BASE_STREAKS) {
      streakParticles.push(createStreak())
    }

    canvasCtx.clearRect(0, 0, cw, ch)

    for (let i = streakParticles.length - 1; i >= 0; i--) {
      const p = streakParticles[i]
      p.life++
      if (p.life >= p.maxLife) { streakParticles.splice(i, 1); continue }

      const t = p.life / p.maxLife
      const fade = t < 0.15 ? t / 0.15 : t > 0.75 ? 1 - (t - 0.75) / 0.25 : 1
      p.x += p.vx
      p.y += p.vy

      // 绘制水平拖尾线
      const endX = p.x + p.len
      const gradient = canvasCtx!.createLinearGradient(p.x, p.y, endX, p.y)
      gradient.addColorStop(0, `rgba(180, 220, 255, ${p.alpha * fade})`)
      gradient.addColorStop(0.5, `rgba(100, 180, 255, ${p.alpha * fade * 0.6})`)
      gradient.addColorStop(1, `rgba(60, 140, 255, 0)`)

      canvasCtx!.beginPath()
      canvasCtx!.moveTo(p.x, p.y)
      canvasCtx!.lineTo(endX, p.y)
      canvasCtx!.strokeStyle = gradient
      canvasCtx!.lineWidth = 1.5
      canvasCtx!.lineCap = 'round'
      canvasCtx!.stroke()

      // 循环
      if (p.x < -150) { p.x = cw + 150; p.y = Math.random() * ch }
    }

    streakAnimId = requestAnimationFrame(animate)
  }
  streakAnimId = requestAnimationFrame(animate)
}

// ═════════════════════════════════════════════════════════════
//  入场动画
// ═════════════════════════════════════════════════════════════
function setupEntrance() {
  if (!scrollRef.value || !headerRef.value) return

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: scrollRef.value,
      scroller: scrollRef.value,
      start: 'top 76%',
      toggleActions: 'play none none reverse',
    },
  })

  tl
    // 取景框上下黑条展开
    .fromTo([vfTop.value, vfBottom.value], { scaleY: 0 }, { scaleY: 1, duration: 0.6, ease: 'power3.inOut' })
    // REC红点闪烁
    .fromTo(recDotRef.value, { autoAlpha: 0, scale: 0 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, '-=0.3')
    .fromTo(focalRef.value, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35 }, '-=0.2')
    // 场记板拍下
    .fromTo(clapRef.value, { autoAlpha: 0, y: -30, rotation: -20 }, {
      autoAlpha: 1, y: 0, rotation: 0, duration: 0.7, ease: 'back.out(1.8)',
    }, '-=0.2')
    // 标题
    .fromTo(headerRef.value, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.75, ease: 'power3.out' }, '-=0.25')
    .fromTo(titleWhip.value, { autoAlpha: 0, x: -60, scale: 0.5, rotation: -10 }, {
      autoAlpha: 1, x: 0, scale: 1, rotation: 0, duration: 0.6, ease: 'back.out(2)',
    }, '-=0.35')
    .fromTo(titleSlash.value, { autoAlpha: 0, scale: 0, rotation: 90 }, {
      autoAlpha: 1, scale: 1, rotation: 0, duration: 0.4, ease: 'back.out(2.5)',
    }, '-=0.4')
    .fromTo(titleCrash.value, { autoAlpha: 0, x: 60, scale: 0.5, rotation: 10 }, {
      autoAlpha: 1, x: 0, scale: 1, rotation: 0, duration: 0.6, ease: 'back.out(2)',
    }, '-=0.45')
    .fromTo(headerLineRef.value, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power3.inOut' }, '-=0.25')

  cleanupFns.push(() => {
    tl.scrollTrigger?.kill()
    tl.kill()
  })
}

// ═════════════════════════════════════════════════════════════
//  核心：甩镜冲击动画
// ═════════════════════════════════════════════════════════════
function setupWhipCrash() {
  if (!scrollRef.value || !trackRef.value) return

  const scroller = scrollRef.value
  const track = trackRef.value
  const frames_ = frameRefs.value
  const blurStreaks = blurStreakRefs.value
  const imgWraps = imgWrapRefs.value
  const images = imgRefs.value
  const crashGlows = crashGlowRefs.value
  const captions = captionRefs.value

  if (!frames_.length || !blurStreaks.length || !imgWraps.length || !images.length || !crashGlows.length || !captions.length) return

  // ── 初始化帧状态 ──
  frames_.forEach((frame, i) => {
    gsap.set(frame, {
      position: 'absolute',
      inset: 0,
      zIndex: FRAME_COUNT - i,
    })

    if (i === 0) {
      gsap.set(frame, { autoAlpha: 1 })
      gsap.set(imgWraps[i], {
        x: 0,
        scale: 1,
        filter: 'blur(0px) brightness(1)',
      })
      gsap.set(blurStreaks[i], { opacity: 0, scaleX: 0 })
      gsap.set(crashGlows[i], { opacity: 0, scale: 0.5 })
      gsap.set(captions[i], { autoAlpha: 1, y: 0 })
      gsap.set(images[i], { scale: 1.05 })
    } else {
      gsap.set(frame, { autoAlpha: 0 })
      // 从右侧远处准备
      gsap.set(imgWraps[i], {
        x: 180,
        scale: 0.35,
        filter: 'blur(18px) brightness(1.8)',
      })
      gsap.set(blurStreaks[i], { opacity: 0.9, scaleX: 2.5 })
      gsap.set(crashGlows[i], { opacity: 0.7, scale: 1.5 })
      gsap.set(captions[i], { autoAlpha: 0, y: 30 })
      gsap.set(images[i], { scale: 1.3 })
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
      scrub: 1.1,
    },
  })

  frames_.forEach((_frame, i) => {
    const offset = i
    const blurStreak = blurStreaks[i]
    const imgWrap = imgWraps[i]
    const img = images[i]
    const crashGlow = crashGlows[i]
    const caption = captions[i]

    // 🎬 Phase 1: 甩镜 — 图片从右侧高速甩入 (0 → 0.35)
    masterTl
      .to(imgWrap, {
        x: 0,
        scale: 1,
        filter: 'blur(0px) brightness(1)',
        duration: 0.35,
        ease: 'power3.out',
      }, offset)
      .to(img, {
        scale: 1.05,
        duration: 0.35,
        ease: 'power2.out',
      }, offset)
      .to(blurStreak, {
        opacity: 0,
        scaleX: 0.3,
        duration: 0.3,
        ease: 'power2.in',
      }, offset + 0.05)
      .to(crashGlow, {
        opacity: 0.3,
        scale: 0.9,
        duration: 0.3,
        ease: 'power2.out',
      }, offset + 0.08)

    // 🎬 Phase 2: 冲击着陆 — crash zoom (0.35 → 0.48)
    masterTl
      .to(imgWrap, {
        scale: 1.12,
        filter: 'blur(0px) brightness(1.15)',
        duration: 0.08,
        ease: 'power2.in',
      }, offset + 0.32)
      .to(imgWrap, {
        scale: 0.96,
        filter: 'blur(0px) brightness(0.95)',
        duration: 0.1,
        ease: 'power2.out',
      }, offset + 0.38)
      .to(imgWrap, {
        scale: 1,
        filter: 'blur(0px) brightness(1)',
        duration: 0.08,
        ease: 'sine.inOut',
      }, offset + 0.45)
      .to(img, {
        scale: 1.05,
        duration: 0.1,
      }, offset + 0.32)
      .to(crashGlow, {
        opacity: 0.7,
        scale: 1.4,
        duration: 0.07,
        ease: 'power2.in',
      }, offset + 0.32)
      .to(crashGlow, {
        opacity: 0,
        scale: 0.5,
        duration: 0.15,
        ease: 'power2.out',
      }, offset + 0.38)

    // 字幕弹入
    masterTl
      .to(caption, {
        autoAlpha: 1,
        y: 0,
        duration: 0.25,
        ease: 'back.out(1.5)',
      }, offset + 0.28)

    // 🎬 Phase 3: 驻留 (0.48 → 0.58) — 微微呼吸
    masterTl
      .to(img, { scale: 1.08, duration: 0.1, ease: 'sine.inOut' }, offset + 0.48)
      .to(img, { scale: 1.05, duration: 0.1, ease: 'sine.inOut' }, offset + 0.55)

    // 🎬 Phase 4: 甩出 — 向左高速飞离 (0.58 → 0.72)
    masterTl
      .to(imgWrap, {
        x: -180,
        scale: 0.35,
        filter: 'blur(18px) brightness(1.8)',
        duration: 0.2,
        ease: 'power3.in',
      }, offset + 0.58)
      .to(blurStreak, {
        opacity: 0.9,
        scaleX: 2.5,
        duration: 0.18,
        ease: 'power2.in',
      }, offset + 0.58)
      .to(crashGlow, {
        opacity: 0.6,
        scale: 1.3,
        duration: 0.15,
        ease: 'power2.in',
      }, offset + 0.59)
      .to(caption, {
        autoAlpha: 0,
        y: -15,
        duration: 0.12,
      }, offset + 0.58)
      .to(_frame, {
        autoAlpha: 0,
        duration: 0.12,
      }, offset + 0.65)

    // 🎬 Phase 5: 下一帧开始甩入
    if (i < FRAME_COUNT - 1) {
      const nextFrame = frames_[i + 1]
      const nextBlur = blurStreaks[i + 1]
      const nextWrap = imgWraps[i + 1]
      const nextImg = images[i + 1]
      const nextGlow = crashGlows[i + 1]

      masterTl
        .to(nextFrame, { autoAlpha: 1, duration: 0.1 }, offset + 0.62)
        .to(nextWrap, {
          x: 0,
          scale: 1,
          filter: 'blur(0px) brightness(1)',
          duration: 0.32,
          ease: 'power3.out',
        }, offset + 0.65)
        .to(nextImg, {
          scale: 1.05,
          duration: 0.32,
          ease: 'power2.out',
        }, offset + 0.65)
        .to(nextBlur, {
          opacity: 0,
          scaleX: 0.3,
          duration: 0.28,
          ease: 'power2.in',
        }, offset + 0.68)
        .to(nextGlow, {
          opacity: 0.3,
          scale: 0.9,
          duration: 0.28,
          ease: 'power2.out',
        }, offset + 0.7)
    }
  })

  // ── 速度线反应 ──
  if (speedLinesRef.value) {
    frames_.forEach((_frame, i) => {
      // 甩镜开始时速度线加速
      masterTl
        .to(speedLinesRef.value, { opacity: 1, duration: 0.1, ease: 'power2.in' }, i + 0.55)
        .to(speedLinesRef.value, { opacity: 0.25, duration: 0.2, ease: 'power2.out' }, i + 0.65)
    })
  }

  // ── 光效横条 ──
  if (lightStreakA.value && lightStreakB.value) {
    frames_.forEach((_frame, i) => {
      masterTl
        .to(lightStreakA.value, { x: '120vw', opacity: 0.9, duration: 0.15, ease: 'power2.in' }, i + 0.55)
        .to(lightStreakA.value, { x: '-20vw', opacity: 0, duration: 0.05 }, i + 0.7)
        .to(lightStreakB.value, { x: '120vw', opacity: 0.7, duration: 0.12, ease: 'power2.in' }, i + 0.57)
        .to(lightStreakB.value, { x: '-20vw', opacity: 0, duration: 0.05 }, i + 0.69)
    })
  }

  // ── 焦距显示变化 ──
  if (focalRef.value) {
    frames_.forEach((_frame, i) => {
      masterTl
        .to(focalRef.value, { scale: 1.3, opacity: 1, duration: 0.08 }, i + 0.55)
        .to(focalRef.value, { scale: 1, opacity: 0.7, duration: 0.15 }, i + 0.63)
    })
  }

  // ── REC 闪烁 ──
  if (recDotRef.value) {
    frames_.forEach((_frame, i) => {
      masterTl
        .to(recDotRef.value, { opacity: 1, duration: 0.06 }, i + 0.55)
        .to(recDotRef.value, { opacity: 0.3, duration: 0.06 }, i + 0.61)
        .to(recDotRef.value, { opacity: 1, duration: 0.06 }, i + 0.67)
    })
  }

  // ── 进度条 ──
  if (progressFillRef.value) {
    masterTl.to(progressFillRef.value, { width: '100%', duration: FRAME_COUNT }, 0)
  }

  // ── 粒子爆发 ──
  frames_.forEach((_frame, i) => {
    const stBurst = ScrollTrigger.create({
      trigger: track,
      scroller,
      start: `${(i / FRAME_COUNT) * 100}% top`,
      onEnter: () => streakBurst(60),
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
  initStreakCanvas()
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      setupEntrance()
      setupWhipCrash()
    })
  })
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  cancelAnimationFrame(streakAnimId)
  ScrollTrigger.getAll().forEach((st) => st.kill())
  cleanupFns.forEach((fn) => fn())
  cleanupFns.length = 0
  streakParticles.length = 0
})
</script>

<style scoped lang="scss">
/* ═══════════════════════════════════════════════════════════
   Whip Crash — 甩镜冲击
   类名前缀: wc-
   ═══════════════════════════════════════════════════════════ */

/* ── 根容器 ── */
.wc-root {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(165deg, #080018 0%, #0a0a2e 25%, #0d1035 50%, #06081a 100%);
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif;
}

/* ── 速度线层 ── */
.wc-speedlines {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
  opacity: 0.25;
}

.wc-speedline {
  position: absolute;
  top: var(--sl-top);
  right: -200px;
  width: var(--sl-width);
  height: 1.5px;
  background: linear-gradient(90deg, transparent, rgba(100, 200, 255, 0.7), rgba(180, 230, 255, 0.9), transparent);
  animation: wc-speedline-scroll var(--sl-duration) var(--sl-delay) linear infinite;
  opacity: var(--sl-opacity);
}

@keyframes wc-speedline-scroll {
  0% { transform: translateX(0); opacity: var(--sl-opacity); }
  100% { transform: translateX(calc(-100vw - 400px)); opacity: 0; }
}

/* ── 光效横条 ── */
.wc-streak {
  position: absolute;
  top: 30%;
  left: -20vw;
  width: 40vw;
  height: 3px;
  z-index: 1;
  pointer-events: none;
  opacity: 0;
  background: linear-gradient(90deg, transparent, rgba(150, 200, 255, 0.8), rgba(200, 240, 255, 1), rgba(150, 200, 255, 0.8), transparent);
  filter: blur(1px);

  &--b {
    top: 55%;
    height: 2px;
    width: 30vw;
  }
}

/* ── Canvas ── */
.wc-canvas {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

/* ── 取景框覆盖层 ── */
.wc-viewfinder {
  position: absolute;
  inset: 0;
  z-index: 18;
  pointer-events: none;
}

.wc-vf-bar {
  position: absolute;
  left: 0;
  width: 100%;
  height: max(3.5vh, 24px);
  background: rgba(0, 0, 0, 0.85);
  transform-origin: top;

  &--top { top: 0; }
  &--bottom { bottom: 0; transform-origin: bottom; }
}

.wc-vf-corner {
  position: absolute;
  width: 24px;
  height: 24px;
  border-color: rgba(255, 255, 255, 0.5);

  &--tl { top: max(3.5vh, 24px); left: 12px; border-top: 2px solid; border-left: 2px solid; }
  &--tr { top: max(3.5vh, 24px); right: 12px; border-top: 2px solid; border-right: 2px solid; }
  &--bl { bottom: max(3.5vh, 24px); left: 12px; border-bottom: 2px solid; border-left: 2px solid; }
  &--br { bottom: max(3.5vh, 24px); right: 12px; border-bottom: 2px solid; border-right: 2px solid; }
}

/* ── REC 指示器 ── */
.wc-rec {
  position: absolute;
  top: max(4vh, 30px);
  right: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 19;
}

.wc-rec__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ff2244;
  box-shadow: 0 0 10px rgba(255, 34, 68, 0.8), 0 0 24px rgba(255, 34, 68, 0.4);
  animation: wc-rec-blink 1s ease-in-out infinite;
}

@keyframes wc-rec-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.25; }
}

.wc-rec__text {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: #ff4466;
}

/* ── 焦距指示 ── */
.wc-focal {
  position: absolute;
  top: max(4vh, 30px);
  left: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 19;
  will-change: transform, opacity;
  opacity: 0.7;
}

.wc-focal__label {
  font-size: 0.56rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 2px;
}

.wc-focal__val {
  font-size: 1.1rem;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.8);
  font-family: 'Courier New', monospace;
}

/* ── 标题区 ── */
.wc-header {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 20;
  text-align: center;
  width: min(90vw, 760px);
}

.wc-clap {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 0.6rem;
  will-change: transform, opacity;
}

.wc-clap__stick {
  width: 3px;
  height: 14px;
  background: linear-gradient(180deg, #888, #ccc, #888);
  border-radius: 1px;
}

.wc-clap__board {
  width: 44px;
  height: 28px;
  background: linear-gradient(135deg, #222, #333);
  border: 1.5px solid #555;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.4);
}

.wc-clap__text {
  font-size: 0.42rem;
  font-weight: 800;
  letter-spacing: 0.2em;
  color: #999;
}

.wc-kicker {
  display: inline-block;
  font-size: 0.64rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(180, 210, 255, 0.8);
  background: rgba(80, 140, 255, 0.12);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(80, 140, 255, 0.2);
  border-radius: 999px;
  padding: 0.28rem 1.2rem;
  margin-bottom: 0.6rem;
  margin-top: 0.4rem;
}

.wc-title {
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.15em;
}

.wc-title__part {
  display: inline-block;
  font-size: clamp(2.2rem, 5.5vw, 4.5rem);
  font-weight: 900;
  background: linear-gradient(180deg, #e0e8ff 0%, #80b4ff 40%, #4088e0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 20px rgba(100, 160, 255, 0.6));
  will-change: transform, opacity;
}

.wc-title__slash {
  display: inline-block;
  font-size: clamp(1.8rem, 4vw, 3.5rem);
  font-weight: 200;
  color: rgba(180, 210, 255, 0.5);
  will-change: transform, opacity;
}

.wc-header-line {
  width: 80px;
  height: 2px;
  margin: 0.4rem auto 0.55rem;
  border-radius: 2px;
  background: linear-gradient(90deg, transparent, #5090e0, #80b4ff, transparent);
  transform-origin: center;
}

.wc-subtitle {
  margin: 0;
  font-size: clamp(0.74rem, 1.1vw, 0.85rem);
  color: rgba(160, 200, 240, 0.6);
  line-height: 1.5;
  max-width: 400px;
  margin-inline: auto;
}

/* ── 滚动容器 ── */
.wc-scroll {
  position: relative;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior-y: auto;
  z-index: 2;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb {
    border-radius: 999px;
    background: rgba(80, 140, 255, 0.25);
    &:hover { background: rgba(80, 140, 255, 0.4); }
  }
}

.wc-track { position: relative; width: 100%; }

.wc-sticky {
  position: sticky;
  top: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

/* ── 舞台 ── */
.wc-stage {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

/* ── 帧容器 ── */
.wc-frame {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  will-change: opacity;
}

/* ── 动态模糊条纹 ── */
.wc-frame__blur-streak {
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;
  background: repeating-linear-gradient(
    90deg,
    transparent,
    transparent 8px,
    rgba(100, 180, 255, 0.15) 9px,
    transparent 10px,
    transparent 18px,
    rgba(150, 210, 255, 0.1) 19px,
    transparent 20px
  );
  will-change: opacity, transform;
  transform-origin: center;
}

/* ── 图片包裹 ── */
.wc-frame__img-wrap {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  will-change: transform, filter;
  transform-origin: center center;
}

.wc-frame__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform-origin: center center;
  will-change: transform;
}

/* ── 冲击光晕 ── */
.wc-frame__crash-glow {
  position: absolute;
  inset: -8%;
  z-index: 3;
  pointer-events: none;
  background: radial-gradient(
    ellipse 55% 40% at 50% 50%,
    rgba(120, 200, 255, 0.5) 0%,
    rgba(80, 160, 255, 0.25) 30%,
    transparent 70%
  );
  will-change: opacity, transform;
}

/* ── 帧文字 ── */
.wc-frame__caption {
  position: absolute;
  left: max(5vw, 24px);
  bottom: max(10vh, 50px);
  z-index: 20;
  max-width: min(80vw, 560px);
  will-change: transform, opacity;
}

.wc-frame__take {
  display: inline-flex;
  align-items: center;
  height: 1.6rem;
  padding: 0 0.8rem;
  border-radius: 3px;
  background: rgba(20, 40, 80, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(80, 140, 255, 0.3);
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: #80b4ff;
  font-family: 'Courier New', monospace;
}

.wc-frame__title {
  margin: 0.6rem 0 0;
  font-size: clamp(1.8rem, 5vw, 3.8rem);
  font-weight: 900;
  line-height: 1.1;
  color: #fff;
  text-shadow:
    0 3px 20px rgba(0, 0, 0, 0.6),
    0 0 50px rgba(80, 160, 255, 0.4);
}

.wc-frame__desc {
  margin: 0.45rem 0 0;
  font-size: clamp(0.78rem, 1.2vw, 0.95rem);
  line-height: 1.6;
  color: rgba(200, 225, 255, 0.8);
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

/* ── 时间码进度条 ── */
.wc-timecode {
  position: absolute;
  left: 0;
  bottom: max(3.5vh, 24px);
  z-index: 30;
  width: 100%;
  height: 2px;
  background: rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: flex-end;
}

.wc-timecode__fill {
  width: 0;
  height: 100%;
  background: linear-gradient(90deg, #4088e0, #60b0ff, #80d0ff, #4088e0);
  background-size: 200% 100%;
  box-shadow: 0 0 10px rgba(64, 136, 224, 0.6);
}

.wc-timecode__text {
  position: absolute;
  right: 24px;
  bottom: 6px;
  font-size: 0.55rem;
  font-family: 'Courier New', monospace;
  color: rgba(255, 255, 255, 0.3);
  letter-spacing: 0.1em;
}

/* ── 响应式 ── */
@media (max-width: 768px) {
  .wc-vf-bar { height: 20px; }
  .wc-vf-corner { width: 16px; height: 16px; }
  .wc-title__part { font-size: 1.6rem; }
  .wc-title__slash { font-size: 1.3rem; }
  .wc-frame__title { font-size: 1.4rem; }
  .wc-rec__dot { width: 7px; height: 7px; }
  .wc-rec__text { font-size: 0.55rem; }
}
</style>
