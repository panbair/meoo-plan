<template>
  <section ref="rootRef" class="sd-root">
    <!-- 动态光斑 -->
    <div ref="blobCoral" class="sd-blob sd-blob--coral"></div>
    <div ref="blobMint" class="sd-blob sd-blob--mint"></div>
    <div ref="blobGold" class="sd-blob sd-blob--gold"></div>
    <div ref="blobLavender" class="sd-blob sd-blob--lavender"></div>

    <!-- 流光粒子画布 -->
    <canvas ref="canvasRef" class="sd-canvas"></canvas>

    <!-- 滚动容器 -->
    <div ref="scrollRef" class="sd-scroll">
      <div ref="trackRef" class="sd-track" :style="{ height: trackHeight }">
        <div class="sd-sticky">

          <!-- 标题 -->
          <header ref="headerRef" class="sd-header">
            <div class="sd-header__deco sd-header__deco--l" ref="decoL"></div>
            <div class="sd-header__deco sd-header__deco--r" ref="decoR"></div>
            <span class="sd-kicker">♪ Sway Dance · 摇曳舞动 ♪</span>
            <h1 class="sd-title">
              <span ref="t1" class="sd-title__c">摇</span>
              <span ref="t2" class="sd-title__c sd-title__c--accent">曳</span>
              <span ref="t3" class="sd-title__c">舞</span>
              <span ref="t4" class="sd-title__c sd-title__c--accent">动</span>
            </h1>
            <div ref="lineRef" class="sd-line"></div>
            <p class="sd-sub">向下滚动 · 图片随滚轮摇曳起舞 · 每一帧都有生命</p>
          </header>

          <!-- 节奏指示点 -->
          <div ref="rhythmRef" class="sd-rhythm">
            <span class="sd-rhythm__dot" v-for="n in 5" :key="n"></span>
          </div>

          <!-- 图片舞台 -->
          <div class="sd-stage">
            <article
              v-for="(frame, idx) in frames"
              :key="frame.id"
              :ref="(el) => setFrameRef(el, idx)"
              class="sd-frame"
            >
              <!-- 光扫层 -->
              <div
                :ref="(el) => setSweepRef(el, idx)"
                class="sd-frame__sweep"
              ></div>
              <!-- 主图 -->
              <img
                :ref="(el) => setImgRef(el, idx)"
                class="sd-frame__img"
                :src="frame.image"
                :alt="frame.alt"
                loading="lazy"
              />
              <!-- 柔光膜 -->
              <div
                :ref="(el) => setFilmRef(el, idx)"
                class="sd-frame__film"
              ></div>
              <!-- 文字 -->
              <div
                :ref="(el) => setCaptionRef(el, idx)"
                class="sd-frame__caption"
              >
                <span class="sd-frame__num">{{ frame.label }}</span>
                <h2 class="sd-frame__title">{{ frame.title }}</h2>
                <p class="sd-frame__desc">{{ frame.description }}</p>
              </div>
            </article>
          </div>

          <!-- 进度条 -->
          <div class="sd-progress">
            <div ref="progressRef" class="sd-progress__fill"></div>
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
//  CardImageSwayDance — 摇曳舞动
//
//  核心概念：图片随滚动"跳舞"
//  1. 横向摇曳 (x)    — 图片像钟摆一样左右摇摆
//  2. 纵向浮动 (y)    — 轻微上下浮动
//  3. 旋转微倾 (rotation) — 图像微微倾斜，增加灵动感
//  4. 呼吸缩放 (scale) — 图片像在呼吸般缩放
//  5. 清晰过渡 (blur)  — 从模糊到清晰再到模糊
//  6. 光扫过场         — 一道光从图片表面扫过
//
//  整体效果：仿佛图片在跟随音乐跳舞，拥有生命般的律动
//
//  青春时尚配色：珊瑚 · 柑橘 · 薄荷 · 薰衣草 · 蜜桃
// ═══════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

interface DanceFrame {
  id: string
  label: string
  title: string
  description: string
  image: string
  alt: string
}

const frames: DanceFrame[] = [
  {
    id: 'coral-sway',
    label: 'Frame 01',
    title: '珊瑚摇曳',
    description: '图片如珊瑚在水中轻柔摇曳，从朦胧中苏醒舞动。',
    image: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=1920&q=80',
    alt: '珊瑚色日落海岸线摇曳',
  },
  {
    id: 'tangerine-bounce',
    label: 'Frame 02',
    title: '柑橘跳动',
    description: '明亮的橘色画面充满弹性地跳跃，每一帧都在欢快律动。',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80',
    alt: '金色阳光洒落麦田',
  },
  {
    id: 'mint-float',
    label: 'Frame 03',
    title: '薄荷漂浮',
    description: '清新的薄荷绿意中，画面如风中的叶子般轻盈飘浮。',
    image: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=1920&q=80',
    alt: '山间阳光穿透云层',
  },
  {
    id: 'lavender-waltz',
    label: 'Frame 04',
    title: '薰衣草圆舞',
    description: '紫色薰衣草的圆舞曲中，图片优雅旋转着进入视野。',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80',
    alt: '薰衣草色山谷日落',
  },
  {
    id: 'peach-finale',
    label: 'Frame 05',
    title: '蜜桃终章',
    description: '蜜桃色的温柔终章，画面在最后的摇曳中完美绽放。',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80',
    alt: '阳光穿透森林',
  },
]

const FRAME_COUNT = frames.length
const trackHeight = `${(FRAME_COUNT + 1) * 100}vh`

// ── Refs ─────────────────────────────────────────────────────
const rootRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const lineRef = ref<HTMLElement | null>(null)
const decoL = ref<HTMLElement | null>(null)
const decoR = ref<HTMLElement | null>(null)
const t1 = ref<HTMLElement | null>(null)
const t2 = ref<HTMLElement | null>(null)
const t3 = ref<HTMLElement | null>(null)
const t4 = ref<HTMLElement | null>(null)
const rhythmRef = ref<HTMLElement | null>(null)
const progressRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const blobCoral = ref<HTMLElement | null>(null)
const blobMint = ref<HTMLElement | null>(null)
const blobGold = ref<HTMLElement | null>(null)
const blobLavender = ref<HTMLElement | null>(null)

const frameRefs = ref<HTMLElement[]>([])
const sweepRefs = ref<HTMLElement[]>([])
const imgRefs = ref<HTMLImageElement[]>([])
const filmRefs = ref<HTMLElement[]>([])
const captionRefs = ref<HTMLElement[]>([])

const setFrameRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) frameRefs.value[i] = el }
const setSweepRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) sweepRefs.value[i] = el }
const setImgRef = (el: Element | null, i: number) => { if (el instanceof HTMLImageElement) imgRefs.value[i] = el }
const setFilmRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) filmRefs.value[i] = el }
const setCaptionRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) captionRefs.value[i] = el }

const cleanupFns: TweenCleanup[] = []

// ═════════════════════════════════════════════════════════════
//  Canvas 流光粒子系统
// ═════════════════════════════════════════════════════════════
interface Streamer {
  x: number; y: number
  vx: number; vy: number
  len: number
  alpha: number
  life: number; maxLife: number
  hue: number
  thickness: number
  phase: number
}

let ctx: CanvasRenderingContext2D | null = null
let cw = 0; let ch = 0
const streamers: Streamer[] = []
let animId = 0
const MAX_STREAMERS = 180
const BASE_STREAMERS = 70

function createStreamer(fromBottom?: boolean): Streamer {
  return {
    x: Math.random() * cw,
    y: fromBottom ? ch + 20 : Math.random() * ch,
    vx: (Math.random() - 0.5) * 1.2,
    vy: -(Math.random() * 2 + 1),
    len: 15 + Math.random() * 50,
    alpha: 0.2 + Math.random() * 0.45,
    life: 0,
    maxLife: 120 + Math.random() * 300,
    hue: [5, 25, 160, 280, 40][Math.floor(Math.random() * 5)] + Math.random() * 15,
    thickness: 0.5 + Math.random() * 2,
    phase: Math.random() * Math.PI * 2,
  }
}

function streamerBurst(cx: number, cy: number, count: number) {
  for (let i = 0; i < count; i++) {
    const s = createStreamer()
    s.x = cx + (Math.random() - 0.5) * 200
    s.y = cy + (Math.random() - 0.5) * 100
    s.vx = (Math.random() - 0.5) * 4
    s.vy = -(Math.random() * 5 + 2)
    s.len = 30 + Math.random() * 70
    s.alpha = 0.4 + Math.random() * 0.5
    streamers.push(s)
  }
  while (streamers.length > MAX_STREAMERS) streamers.shift()
}

function initCanvas() {
  const c = canvasRef.value
  if (!c) return
  ctx = c.getContext('2d')
  if (!ctx) return

  const resize = () => { cw = window.innerWidth; ch = window.innerHeight; c.width = cw; c.height = ch }
  resize()
  window.addEventListener('resize', resize)
  cleanupFns.push(() => window.removeEventListener('resize', resize))

  for (let i = 0; i < BASE_STREAMERS; i++) streamers.push(createStreamer())

  function animate() {
    if (!ctx) return
    ctx.clearRect(0, 0, cw, ch)

    while (streamers.length < BASE_STREAMERS) streamers.push(createStreamer(true))

    for (let i = streamers.length - 1; i >= 0; i--) {
      const s = streamers[i]
      s.life++
      if (s.life >= s.maxLife) { streamers.splice(i, 1); continue }

      const t = s.life / s.maxLife
      const fade = t < 0.1 ? t / 0.1 : t > 0.7 ? 1 - (t - 0.7) / 0.3 : 1

      s.phase += 0.03
      s.x += s.vx + Math.sin(s.phase) * 0.5
      s.y += s.vy

      // 绘制流光带
      const grad = ctx!.createLinearGradient(s.x, s.y, s.x - s.vx * s.len, s.y - s.vy * s.len)
      grad.addColorStop(0, `hsla(${s.hue}, 80%, 75%, ${s.alpha * fade})`)
      grad.addColorStop(0.4, `hsla(${s.hue}, 60%, 65%, ${s.alpha * fade * 0.5})`)
      grad.addColorStop(1, `hsla(${s.hue}, 50%, 55%, 0)`)

      ctx!.beginPath()
      ctx!.moveTo(s.x, s.y)
      ctx!.lineTo(s.x - s.vx * s.len, s.y - s.vy * s.len)
      ctx!.strokeStyle = grad
      ctx!.lineWidth = s.thickness
      ctx!.lineCap = 'round'
      ctx!.stroke()

      // 头部亮点
      ctx!.beginPath()
      ctx!.arc(s.x, s.y, s.thickness * 1.5, 0, Math.PI * 2)
      ctx!.fillStyle = `hsla(${s.hue}, 90%, 85%, ${s.alpha * fade * 1.2})`
      ctx!.fill()

      // 超出屏幕处理
      if (s.y < -100 || s.x < -100 || s.x > cw + 100) {
        s.y = ch + 30
        s.x = Math.random() * cw
        s.life = 0
      }
    }
    animId = requestAnimationFrame(animate)
  }
  animId = requestAnimationFrame(animate)
}

// ═════════════════════════════════════════════════════════════
//  入场动画
// ═════════════════════════════════════════════════════════════
function setupEntrance() {
  if (!scrollRef.value || !headerRef.value || !rhythmRef.value) return

  const el = gsap.timeline({
    scrollTrigger: {
      trigger: scrollRef.value,
      scroller: scrollRef.value,
      start: 'top 75%',
      toggleActions: 'play none none reverse',
    },
  })

  el
    .fromTo(headerRef.value, { autoAlpha: 0, y: 55 }, { autoAlpha: 1, y: 0, duration: 0.85, ease: 'power3.out' })
    .fromTo([t1.value, t2.value, t3.value, t4.value], { autoAlpha: 0, y: 30, scale: 0.4, rotation: -8 }, {
      autoAlpha: 1, y: 0, scale: 1, rotation: 0,
      duration: 0.6, stagger: 0.07, ease: 'back.out(2.2)',
    }, '-=0.45')
    .fromTo(lineRef.value, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power3.inOut' }, '-=0.25')
    .fromTo([decoL.value, decoR.value], { autoAlpha: 0, scale: 0, rotation: -30 }, {
      autoAlpha: 1, scale: 1, rotation: 0,
      duration: 0.5, stagger: 0.05, ease: 'back.out(2)',
    }, '-=0.2')
    .fromTo(rhythmRef.value, { autoAlpha: 0, scale: 0.5 }, { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'back.out(1.8)' }, '-=0.25')

  cleanupFns.push(() => { el.scrollTrigger?.kill(); el.kill() })
}

// ═════════════════════════════════════════════════════════════
//  核心：摇曳舞动动画
// ═════════════════════════════════════════════════════════════
function setupSwayDance() {
  if (!scrollRef.value || !trackRef.value) return

  const scroller = scrollRef.value
  const track = trackRef.value
  const frames_ = frameRefs.value
  const sweeps = sweepRefs.value
  const images = imgRefs.value
  const films = filmRefs.value
  const captions = captionRefs.value

  if (!frames_.length || !sweeps.length || !images.length || !films.length || !captions.length) return

  // ── 初始状态 ──
  frames_.forEach((frame, i) => {
    gsap.set(frame, { position: 'absolute', inset: 0, zIndex: FRAME_COUNT - i })

    if (i === 0) {
      gsap.set(frame, { autoAlpha: 1 })
      gsap.set(sweeps[i], { opacity: 0, x: '-100%' })
      gsap.set(images[i], {
        x: 0, y: 0, rotation: 0, scale: 1,
        filter: 'brightness(1.06) saturate(1.12) contrast(1.02) blur(0px)',
      })
      gsap.set(films[i], { opacity: 0.08 })
      gsap.set(captions[i], { autoAlpha: 1, y: 0 })
    } else {
      gsap.set(frame, { autoAlpha: 0 })
      gsap.set(sweeps[i], { opacity: 0.6, x: '100%' })
      gsap.set(images[i], {
        x: 80, y: 25, rotation: 5, scale: 0.82,
        filter: 'brightness(2.2) saturate(0.5) contrast(1.2) blur(14px)',
      })
      gsap.set(films[i], { opacity: 0.45 })
      gsap.set(captions[i], { autoAlpha: 0, y: 35 })
    }
  })

  // ── 主时间线 ──
  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track,
      scroller,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.3,
    },
  })

  frames_.forEach((_frame, i) => {
    const o = i
    const sweep = sweeps[i]
    const img = images[i]
    const film = films[i]
    const caption = captions[i]

    // 🎵 Phase A: 从右侧摇曳入场 → 摆荡到中心 (0 → 0.42)
    // x: 80→0, y: 25→0, rotation: 5°→0°, scale: 0.82→1.0, blur: 14→0
    master
      .to(img, {
        x: 0, y: 0, rotation: 0, scale: 1,
        filter: 'brightness(1.06) saturate(1.12) contrast(1.02) blur(0px)',
        duration: 0.42, ease: 'power3.out',
      }, o)
      .to(sweep, { opacity: 0, x: '-100%', duration: 0.38, ease: 'power2.out' }, o + 0.03)
      .to(film, { opacity: 0.08, duration: 0.38, ease: 'power2.out' }, o + 0.04)
      .to(caption, { autoAlpha: 1, y: 0, duration: 0.32, ease: 'power3.out' }, o + 0.14)

    // 🎵 Phase B: 舞蹈驻留 — 小幅摇摆 + 呼吸 (0.42 → 0.62)
    // 三段微摆：左→右→中
    master
      .to(img, { x: -12, rotation: -1.2, duration: 0.06, ease: 'sine.inOut' }, o + 0.42)
      .to(img, { x: 10, rotation: 1, duration: 0.07, ease: 'sine.inOut' }, o + 0.48)
      .to(img, { x: 0, rotation: 0, duration: 0.07, ease: 'sine.inOut' }, o + 0.55)
      // 呼吸缩放
      .to(img, { scale: 1.04, duration: 0.1, ease: 'sine.inOut' }, o + 0.44)
      .to(img, { scale: 1, duration: 0.12, ease: 'sine.inOut' }, o + 0.54)

    // 🎵 Phase C: 向左摇曳退场 (0.62 → 0.82)
    master
      .to(img, {
        x: -75, y: -20, rotation: -4.5, scale: 0.84,
        filter: 'brightness(2.4) saturate(0.45) contrast(1.25) blur(12px)',
        duration: 0.25, ease: 'power3.in',
      }, o + 0.62)
      .to(sweep, { opacity: 0.55, x: '100%', duration: 0.22, ease: 'power2.in' }, o + 0.63)
      .to(film, { opacity: 0.5, duration: 0.2 }, o + 0.63)
      .to(caption, { autoAlpha: 0, y: -20, duration: 0.14, ease: 'power2.in' }, o + 0.62)
      .to(_frame, { autoAlpha: 0, duration: 0.1 }, o + 0.74)

    // 🎵 Phase D: 下一帧从右侧摇曳入场
    if (i < FRAME_COUNT - 1) {
      const nf = frames_[i + 1]
      const ns = sweeps[i + 1]
      const ni = images[i + 1]
      const nfl = films[i + 1]

      master
        .to(nf, { autoAlpha: 1, duration: 0.08 }, o + 0.7)
        .to(ni, {
          x: 0, y: 0, rotation: 0, scale: 1,
          filter: 'brightness(1.06) saturate(1.12) contrast(1.02) blur(0px)',
          duration: 0.4, ease: 'power3.out',
        }, o + 0.74)
        .to(ns, { opacity: 0, x: '-100%', duration: 0.36, ease: 'power2.out' }, o + 0.75)
        .to(nfl, { opacity: 0.08, duration: 0.36, ease: 'power2.out' }, o + 0.76)
    }
  })

  // ── 节奏指示器动画 ──
  if (rhythmRef.value) {
    const dots = rhythmRef.value.querySelectorAll('.sd-rhythm__dot')
    for (let i = 0; i < FRAME_COUNT; i++) {
      master
        .to(dots, {
          scale: (idx: number) => idx === i ? 1.8 : 0.8,
          opacity: (idx: number) => idx === i ? 1 : 0.3,
          duration: 0.15, ease: 'back.out(2)',
        }, i + 0.42)
    }
  }

  // ── 背景光斑漂移 ──
  if (blobCoral.value && blobMint.value && blobGold.value && blobLavender.value) {
    master
      .to(blobCoral.value, { x: '10vw', y: '-6vh', scale: 1.2, duration: FRAME_COUNT }, 0)
      .to(blobMint.value, { x: '-8vw', y: '10vh', scale: 1.25, duration: FRAME_COUNT }, 0)
      .to(blobGold.value, { x: '5vw', y: '-10vh', scale: 1.15, duration: FRAME_COUNT }, 0)
      .to(blobLavender.value, { x: '-12vw', y: '-4vh', scale: 1.3, duration: FRAME_COUNT }, 0)
  }

  // ── 进度条 ──
  if (progressRef.value) {
    master.to(progressRef.value, { width: '100%', duration: FRAME_COUNT }, 0)
  }

  // ── 粒子爆发回调 (每次摇摆到中心时触发) ──
  frames_.forEach((_frame, i) => {
    const st = ScrollTrigger.create({
      trigger: track, scroller,
      start: `${((i + 0.45) / FRAME_COUNT) * 100}% top`,
      onEnter: () => streamerBurst(cw / 2, ch / 2, 50),
    })
    cleanupFns.push(() => st.kill())
  })

  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

// ═════════════════════════════════════════════════════════════
//  生命周期
// ═════════════════════════════════════════════════════════════
function handleResize() { ScrollTrigger.refresh(true) }

onMounted(() => {
  initCanvas()
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      setupEntrance()
      setupSwayDance()
    })
  })
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  cancelAnimationFrame(animId)
  ScrollTrigger.getAll().forEach(st => st.kill())
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0
  streamers.length = 0
})
</script>

<style scoped lang="scss">
/* ═══════════════════════════════════════════════════════════
   Sway Dance — 摇曳舞动
   类名前缀: sd-
   ═══════════════════════════════════════════════════════════ */

/* ── 根容器 ── */
.sd-root {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(
    155deg,
    #fff8f5 0%,
    #fff3ee 18%,
    #fef6f3 36%,
    #fdf5fa 54%,
    #fff7f3 72%,
    #fef8f4 100%
  );
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif;
}

/* ── 背景光斑 ── */
.sd-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(85px);
  pointer-events: none;
  will-change: transform;
  z-index: 0;
}

.sd-blob--coral {
  width: 38vw; height: 38vw;
  top: -6vh; left: -4vw;
  background: radial-gradient(circle, rgba(255, 140, 110, 0.5) 0%, transparent 70%);
}
.sd-blob--mint {
  width: 32vw; height: 32vw;
  bottom: -8vh; right: -3vw;
  background: radial-gradient(circle, rgba(140, 220, 190, 0.4) 0%, transparent 70%);
}
.sd-blob--gold {
  width: 28vw; height: 28vw;
  top: 35vh; left: 55vw;
  background: radial-gradient(circle, rgba(255, 210, 130, 0.4) 0%, transparent 70%);
}
.sd-blob--lavender {
  width: 30vw; height: 30vw;
  top: 10vh; right: 25vw;
  background: radial-gradient(circle, rgba(200, 180, 230, 0.38) 0%, transparent 70%);
}

/* ── Canvas ── */
.sd-canvas {
  position: absolute; inset: 0; z-index: 1; pointer-events: none;
}

/* ── 滚动容器 ── */
.sd-scroll {
  position: relative; width: 100%; height: 100%;
  overflow-x: hidden; overflow-y: auto;
  overscroll-behavior-y: auto;
  z-index: 2;

  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-thumb {
    border-radius: 999px;
    background: rgba(255, 150, 120, 0.3);
    &:hover { background: rgba(255, 150, 120, 0.5); }
  }
}

.sd-track { position: relative; width: 100%; }

.sd-sticky {
  position: sticky; top: 0;
  width: 100%; height: 100vh;
  overflow: hidden;
}

/* ── 标题 ── */
.sd-header {
  position: absolute; top: 3vh; left: 50%;
  transform: translateX(-50%);
  z-index: 20; text-align: center;
  width: min(92vw, 800px);
}

.sd-header__deco {
  position: absolute; top: 5%;
  width: 28px; height: 28px;
  border-radius: 6px;
  pointer-events: none;
  animation: sd-deco-spin 4s linear infinite;

  &--l {
    left: 20px;
    background: linear-gradient(135deg, #ff8c69, #ffa751);
    box-shadow: 0 0 16px rgba(255, 140, 105, 0.5);
  }
  &--r {
    right: 20px;
    background: linear-gradient(135deg, #f093fb, #f5576c);
    box-shadow: 0 0 16px rgba(240, 147, 251, 0.45);
    animation-delay: -2s;
  }
}

@keyframes sd-deco-spin {
  0% { transform: rotate(0deg) scale(1); }
  25% { transform: rotate(90deg) scale(1.15); }
  50% { transform: rotate(180deg) scale(1); }
  75% { transform: rotate(270deg) scale(0.9); }
  100% { transform: rotate(360deg) scale(1); }
}

.sd-kicker {
  display: inline-block;
  font-size: 0.66rem; font-weight: 700;
  letter-spacing: 0.26em; text-transform: uppercase;
  color: rgba(220, 110, 80, 0.8);
  background: rgba(255, 160, 130, 0.12);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 150, 110, 0.2);
  border-radius: 999px;
  padding: 0.3rem 1.2rem;
  margin-bottom: 0.55rem;
}

.sd-title {
  margin: 0; display: flex; justify-content: center; gap: 0.1em;
}

.sd-title__c {
  display: inline-block;
  font-size: clamp(2.2rem, 5.5vw, 4.6rem);
  font-weight: 900;
  color: #ff7b5a;
  will-change: transform, opacity;

  &--accent {
    background: linear-gradient(135deg, #f093fb, #f5576c, #ffa751);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 2px 12px rgba(245, 87, 108, 0.4));
  }
}

.sd-line {
  width: 90px; height: 2px;
  margin: 0.45rem auto 0.6rem; border-radius: 2px;
  background: linear-gradient(90deg, transparent, #ff8c69, #f5576c, #ffa751, transparent);
  transform-origin: center;
}

.sd-sub {
  margin: 0;
  font-size: clamp(0.76rem, 1.1vw, 0.88rem);
  color: rgba(200, 100, 70, 0.55);
  line-height: 1.5;
  max-width: 440px; margin-inline: auto;
}

/* ── 节奏指示器 ── */
.sd-rhythm {
  position: absolute;
  top: 50%; right: max(3vw, 16px);
  transform: translateY(-50%);
  z-index: 25;
  display: flex; flex-direction: column; gap: 14px;
  pointer-events: none;
  will-change: transform, opacity;
}

.sd-rhythm__dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: rgba(255, 150, 110, 0.6);
  box-shadow: 0 0 10px rgba(255, 140, 100, 0.45);
  transition: transform 0.2s, opacity 0.2s;
}

/* ── 舞台 ── */
.sd-stage { position: absolute; inset: 0; pointer-events: none; }

/* ── 帧 ── */
.sd-frame {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  will-change: opacity;
}

/* ── 光扫层 ── */
.sd-frame__sweep {
  position: absolute; inset: 0; z-index: 3;
  pointer-events: none;
  background: linear-gradient(
    105deg,
    transparent 0%,
    transparent 35%,
    rgba(255, 255, 255, 0.5) 45%,
    rgba(255, 240, 220, 0.7) 50%,
    rgba(255, 255, 255, 0.5) 55%,
    transparent 65%,
    transparent 100%
  );
  mix-blend-mode: overlay;
  will-change: transform, opacity;
}

/* ── 图片 ── */
.sd-frame__img {
  position: relative; z-index: 1;
  width: 100%; height: 100%;
  object-fit: cover;
  transform-origin: center center;
  will-change: transform, filter;
}

/* ── 柔光膜 ── */
.sd-frame__film {
  position: absolute; inset: 0; z-index: 2;
  pointer-events: none;
  background: radial-gradient(
    ellipse 55% 45% at 50% 50%,
    rgba(255, 230, 210, 0.3) 0%,
    rgba(255, 200, 170, 0.12) 40%,
    transparent 70%
  );
  mix-blend-mode: soft-light;
  will-change: opacity;
}

/* ── 文字 ── */
.sd-frame__caption {
  position: absolute; left: max(5vw, 24px); bottom: 12vh;
  z-index: 20;
  max-width: min(80vw, 580px);
  will-change: transform, opacity;
}

.sd-frame__num {
  display: inline-flex; align-items: center;
  height: 1.6rem; padding: 0 0.8rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 160, 130, 0.3);
  font-size: 0.62rem; font-weight: 700;
  letter-spacing: 0.15em; text-transform: uppercase;
  color: #d46848;
}

.sd-frame__title {
  margin: 0.6rem 0 0;
  font-size: clamp(2rem, 5.2vw, 4rem);
  font-weight: 900; line-height: 1.1;
  color: #3d1400;
  text-shadow: 0 2px 10px rgba(255, 255, 255, 0.65), 0 0 40px rgba(255, 160, 120, 0.35);
}

.sd-frame__desc {
  margin: 0.4rem 0 0;
  font-size: clamp(0.8rem, 1.25vw, 0.96rem);
  line-height: 1.6;
  color: rgba(85, 30, 8, 0.68);
  text-shadow: 0 1px 5px rgba(255, 255, 255, 0.45);
}

/* ── 进度条 ── */
.sd-progress {
  position: absolute; left: 0; bottom: 0; z-index: 30;
  width: 100%; height: 3px;
  background: rgba(255, 150, 110, 0.06);
}

.sd-progress__fill {
  width: 0; height: 100%;
  background: linear-gradient(90deg, #ff8c69, #f5576c, #ffa751, #f093fb, #ff8c69);
  background-size: 200% 100%;
  box-shadow: 0 0 12px rgba(255, 130, 90, 0.55);
}

/* ── 响应式 ── */
@media (max-width: 768px) {
  .sd-header { top: 2vh; }
  .sd-kicker { font-size: 0.54rem; padding: 0.2rem 0.65rem; }
  .sd-title__c { font-size: 1.7rem; }
  .sd-rhythm { right: 2vw; gap: 10px; }
  .sd-rhythm__dot { width: 6px; height: 6px; }
  .sd-frame__caption { bottom: 9vh; }
  .sd-frame__title { font-size: 1.45rem; color: #4a1800; }
}
</style>
