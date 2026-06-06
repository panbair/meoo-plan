<template>
  <section ref="rootRef" class="pw-root">
    <!-- 脉冲光晕背景 -->
    <div ref="pulseA" class="pw-bg-pulse pw-bg-pulse--a"></div>
    <div ref="pulseB" class="pw-bg-pulse pw-bg-pulse--b"></div>
    <div ref="pulseC" class="pw-bg-pulse pw-bg-pulse--c"></div>

    <!-- 波纹画布 -->
    <canvas ref="canvasRef" class="pw-canvas"></canvas>

    <!-- 滚动容器 -->
    <div ref="scrollRef" class="pw-scroll">
      <div ref="trackRef" class="pw-track" :style="{ height: trackHeight }">
        <div class="pw-sticky">

          <!-- 标题 -->
          <header ref="headerRef" class="pw-header">
            <span class="pw-kicker">♡ Pulse Wave · 脉冲波浪 ♡</span>
            <h1 class="pw-title">
              <span ref="tc1" class="pw-title__c">脉</span>
              <span ref="tc2" class="pw-title__c pw-title__c--glow">冲</span>
              <span ref="tc3" class="pw-title__c">波</span>
              <span ref="tc4" class="pw-title__c pw-title__c--glow">浪</span>
            </h1>
            <div ref="lineRef" class="pw-line"></div>
            <p class="pw-sub">向下滚动 · 如心跳般脉冲律动 · 图片在能量波中绽放</p>
          </header>

          <!-- 心跳指示器 -->
          <div ref="heartRef" class="pw-heart">
            <div class="pw-heart__ring" v-for="r in 4" :key="r"></div>
            <div class="pw-heart__core"></div>
          </div>

          <!-- 图片舞台 -->
          <div class="pw-stage">
            <article
              v-for="(frame, idx) in frames"
              :key="frame.id"
              :ref="(el) => setFrameRef(el, idx)"
              class="pw-frame"
            >
              <img
                :ref="(el) => setImgRef(el, idx)"
                class="pw-frame__img"
                :src="frame.image"
                :alt="frame.alt"
                loading="lazy"
              />
              <!-- 脉冲能量环 -->
              <div
                :ref="(el) => setRingRef(el, idx)"
                class="pw-frame__energy-ring"
              ></div>
              <div
                :ref="(el) => setCaptionRef(el, idx)"
                class="pw-frame__caption"
              >
                <span class="pw-frame__num">{{ frame.label }}</span>
                <h2 class="pw-frame__title">{{ frame.title }}</h2>
                <p class="pw-frame__desc">{{ frame.description }}</p>
              </div>
            </article>
          </div>

          <div class="pw-progress"><div ref="progRef" class="pw-progress__fill"></div></div>
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
//  CardImagePulseWave — 脉冲波浪
//
//  核心概念：图片如心跳般脉冲律动
//  1. 脉冲缩放 (scale)  — 图片从中心向外扩张脉冲
//  2. 能量环扩散        — 多层能量环从中心向外扩散
//  3. 清晰过渡          — 模糊→清晰→模糊
//  4. Canvas 波纹粒子   — 从中心向外扩散的涟漪粒子
//  5. 心跳指示器        — 多层光环随脉动扩张收缩
//
//  青春时尚配色：热力粉 · 珊瑚橙 · 日光金 · 玫瑰红
// ═══════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

interface PulseFrame {
  id: string; label: string; title: string; description: string
  image: string; alt: string
}

const frames: PulseFrame[] = [
  {
    id: 'heartbeat-awaken', label: 'Frame 01', title: '心跳初醒',
    description: '第一波脉冲轻柔扩散，画面从沉睡中苏醒。',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1920&q=80',
    alt: '鲜艳花卉绽放',
  },
  {
    id: 'surge-energy', label: 'Frame 02', title: '能量涌动',
    description: '能量波加速扩散，画面在脉冲中展现出耀眼的生命力。',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80',
    alt: '金色阳光照亮大地',
  },
  {
    id: 'electric-blush', label: 'Frame 03', title: '电光绯红',
    description: '绯红色的能量波扫过画面，每一个像素都在跳动。',
    image: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=1920&q=80',
    alt: '绯红日落海岸',
  },
  {
    id: 'golden-rush', label: 'Frame 04', title: '金色冲击',
    description: '金色脉冲以最强力度扩散，画面被彻底唤醒。',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80',
    alt: '金色田野在阳光下',
  },
  {
    id: 'serene-beat', label: 'Frame 05', title: '宁静律动',
    description: '最后的脉冲变得温柔，画面在宁静的律动中完美呈现。',
    image: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=1920&q=80',
    alt: '山脊在阳光下宁静',
  },
]

const FRAME_COUNT = frames.length
const trackHeight = `${(FRAME_COUNT + 1) * 100}vh`

// ── Refs ──
const rootRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const lineRef = ref<HTMLElement | null>(null)
const tc1 = ref<HTMLElement | null>(null); const tc2 = ref<HTMLElement | null>(null)
const tc3 = ref<HTMLElement | null>(null); const tc4 = ref<HTMLElement | null>(null)
const heartRef = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const pulseA = ref<HTMLElement | null>(null)
const pulseB = ref<HTMLElement | null>(null)
const pulseC = ref<HTMLElement | null>(null)

const frameRefs = ref<HTMLElement[]>([])
const imgRefs = ref<HTMLImageElement[]>([])
const ringRefs = ref<HTMLElement[]>([])
const captionRefs = ref<HTMLElement[]>([])

const setFrameRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) frameRefs.value[i] = el }
const setImgRef = (el: Element | null, i: number) => { if (el instanceof HTMLImageElement) imgRefs.value[i] = el }
const setRingRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) ringRefs.value[i] = el }
const setCaptionRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) captionRefs.value[i] = el }

const cleanupFns: TweenCleanup[] = []

// ═════════════════════════════════════════════════════════════
//  Canvas 波纹粒子
// ═════════════════════════════════════════════════════════════
interface RippleRing {
  x: number; y: number
  radius: number; maxRadius: number
  alpha: number; hue: number
  thickness: number
  speed: number
}

let ctx: CanvasRenderingContext2D | null = null
let cw = 0; let ch = 0
const ripples: RippleRing[] = []
let animId = 0
const MAX_RIPPLES = 30
const BASE_RIPPLES = 8

function spawnRipple(cx?: number, cy?: number) {
  ripples.push({
    x: cx ?? cw * 0.5,
    y: cy ?? ch * 0.5,
    radius: 5,
    maxRadius: Math.min(cw, ch) * 0.6,
    alpha: 0.5 + Math.random() * 0.4,
    hue: [340, 15, 30, 45, 355][Math.floor(Math.random() * 5)],
    thickness: 1.5 + Math.random() * 3,
    speed: 3 + Math.random() * 5,
  })
  while (ripples.length > MAX_RIPPLES) ripples.shift()
}

function rippleBurst(count: number) {
  for (let i = 0; i < count; i++) {
    const r: RippleRing = {
      x: cw * 0.5, y: ch * 0.5,
      radius: 5 + Math.random() * 20,
      maxRadius: 80 + Math.random() * 300,
      alpha: 0.4 + Math.random() * 0.5,
      hue: [340, 15, 30, 45, 355][Math.floor(Math.random() * 5)],
      thickness: 1 + Math.random() * 2.5,
      speed: 2 + Math.random() * 3,
    }
    ripples.push(r)
  }
  while (ripples.length > MAX_RIPPLES) ripples.shift()
}

function initCanvas() {
  const c = canvasRef.value; if (!c) return
  ctx = c.getContext('2d'); if (!ctx) return

  const resize = () => { cw = window.innerWidth; ch = window.innerHeight; c.width = cw; c.height = ch }
  resize()
  window.addEventListener('resize', resize)
  cleanupFns.push(() => window.removeEventListener('resize', resize))

  for (let i = 0; i < BASE_RIPPLES; i++) spawnRipple()

  function animate() {
    if (!ctx) return
    ctx.clearRect(0, 0, cw, ch)

    if (ripples.length < BASE_RIPPLES) spawnRipple()

    for (let i = ripples.length - 1; i >= 0; i--) {
      const r = ripples[i]
      r.radius += r.speed
      if (r.radius > r.maxRadius) { ripples.splice(i, 1); continue }

      const t = 1 - r.radius / r.maxRadius
      const fade = t < 0.15 ? t / 0.15 : 1

      ctx!.beginPath()
      ctx!.arc(r.x, r.y, r.radius, 0, Math.PI * 2)
      ctx!.strokeStyle = `hsla(${r.hue}, 80%, 65%, ${r.alpha * fade * 0.7})`
      ctx!.lineWidth = r.thickness * fade
      ctx!.stroke()

      // 外晕
      ctx!.beginPath()
      ctx!.arc(r.x, r.y, r.radius, 0, Math.PI * 2)
      ctx!.strokeStyle = `hsla(${r.hue}, 70%, 75%, ${r.alpha * fade * 0.3})`
      ctx!.lineWidth = r.thickness * fade * 2.5
      ctx!.stroke()
    }
    animId = requestAnimationFrame(animate)
  }
  animId = requestAnimationFrame(animate)
}

// ═════════════════════════════════════════════════════════════
//  入场
// ═════════════════════════════════════════════════════════════
function setupEntrance() {
  if (!scrollRef.value || !headerRef.value || !heartRef.value) return

  const tl = gsap.timeline({
    scrollTrigger: { trigger: scrollRef.value, scroller: scrollRef.value, start: 'top 75%', toggleActions: 'play none none reverse' },
  })

  const chars = [tc1.value, tc2.value, tc3.value, tc4.value]
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.85, ease: 'power3.out' })
    .fromTo(chars, { autoAlpha: 0, scale: 0.2, y: 30 }, {
      autoAlpha: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'back.out(2.4)',
    }, '-=0.45')
    .fromTo(lineRef.value, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power3.inOut' }, '-=0.25')
    .fromTo(heartRef.value, { autoAlpha: 0, scale: 0 }, {
      autoAlpha: 1, scale: 1, duration: 0.7, ease: 'back.out(2.2)',
    }, '-=0.35')

  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

// ═════════════════════════════════════════════════════════════
//  核心：脉冲波浪
// ═════════════════════════════════════════════════════════════
function setupPulseWave() {
  if (!scrollRef.value || !trackRef.value) return

  const scroller = scrollRef.value
  const track = trackRef.value
  const frames_ = frameRefs.value
  const images = imgRefs.value
  const rings = ringRefs.value
  const captions = captionRefs.value

  if (!frames_.length || !images.length || !rings.length || !captions.length) return

  // ── 初始状态 ──
  frames_.forEach((frame, i) => {
    gsap.set(frame, { position: 'absolute', inset: 0, zIndex: FRAME_COUNT - i })
    if (i === 0) {
      gsap.set(frame, { autoAlpha: 1 })
      gsap.set(images[i], { scale: 1, filter: 'brightness(1.05) saturate(1.12) contrast(1.02) blur(0px)' })
      gsap.set(rings[i], { scale: 1, opacity: 0.2, borderWidth: '1px' })
      gsap.set(captions[i], { autoAlpha: 1, y: 0 })
    } else {
      gsap.set(frame, { autoAlpha: 0 })
      gsap.set(images[i], { scale: 0.55, filter: 'brightness(2.5) saturate(0.4) contrast(1.3) blur(16px)' })
      gsap.set(rings[i], { scale: 0.3, opacity: 0.8, borderWidth: '12px' })
      gsap.set(captions[i], { autoAlpha: 0, y: 45, scale: 0.8 })
    }
  })

  // ── 主时间线 ──
  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.3 },
  })

  frames_.forEach((_frame, i) => {
    const o = i
    const img = images[i]
    const ring = rings[i]
    const cap = captions[i]

    // 💓 Phase A: 脉冲扩散入场 (0 → 0.38)
    master
      .to(img, { scale: 1, filter: 'brightness(1.05) saturate(1.12) contrast(1.02) blur(0px)', duration: 0.38, ease: 'power3.out' }, o)
      .to(ring, { scale: 1.15, opacity: 0.15, borderWidth: '1px', duration: 0.38, ease: 'power2.out' }, o)
      .to(cap, { autoAlpha: 1, y: 0, scale: 1, duration: 0.28, ease: 'back.out(1.6)' }, o + 0.12)

    // 💓 Phase B: 脉动舞蹈 — 三波脉冲 (0.38 → 0.62)
    // 第一波
    master
      .to(img, { scale: 1.06, filter: 'brightness(1.12) saturate(1.2) contrast(1.04) blur(0px)', duration: 0.06, ease: 'power2.out' }, o + 0.38)
      .to(ring, { scale: 1.35, opacity: 0.35, borderWidth: '3px', duration: 0.06, ease: 'power2.out' }, o + 0.38)
      .to(img, { scale: 1.02, duration: 0.05, ease: 'power2.in' }, o + 0.44)
      .to(ring, { scale: 1.1, opacity: 0.18, borderWidth: '1px', duration: 0.05, ease: 'power2.in' }, o + 0.44)
    // 第二波
      .to(img, { scale: 1.05, filter: 'brightness(1.1) saturate(1.18) contrast(1.03) blur(0px)', duration: 0.05, ease: 'power2.out' }, o + 0.49)
      .to(ring, { scale: 1.3, opacity: 0.3, borderWidth: '2.5px', duration: 0.05, ease: 'power2.out' }, o + 0.49)
      .to(img, { scale: 1.01, duration: 0.05, ease: 'power2.in' }, o + 0.54)
      .to(ring, { scale: 1.08, opacity: 0.16, borderWidth: '1px', duration: 0.05, ease: 'power2.in' }, o + 0.54)
    // 第三波（微弱余震）
      .to(img, { scale: 1.03, duration: 0.04, ease: 'power2.out' }, o + 0.59)
      .to(img, { scale: 1, duration: 0.04, ease: 'sine.in' }, o + 0.63)

    // 💓 Phase C: 向内收缩退场 (0.62 → 0.8)
    master
      .to(img, { scale: 0.5, filter: 'brightness(3) saturate(0.3) contrast(1.4) blur(18px)', duration: 0.22, ease: 'power3.in' }, o + 0.62)
      .to(ring, { scale: 0.25, opacity: 0.75, borderWidth: '14px', duration: 0.22, ease: 'power2.in' }, o + 0.62)
      .to(cap, { autoAlpha: 0, y: -30, scale: 0.75, duration: 0.12, ease: 'power2.in' }, o + 0.62)
      .to(_frame, { autoAlpha: 0, duration: 0.1 }, o + 0.73)

    // 💓 Phase D: 下一帧脉冲扩散入场
    if (i < FRAME_COUNT - 1) {
      const nf = frames_[i + 1]; const ni = images[i + 1]; const nr = rings[i + 1]
      master
        .to(nf, { autoAlpha: 1, duration: 0.08 }, o + 0.69)
        .to(ni, { scale: 1, filter: 'brightness(1.05) saturate(1.12) contrast(1.02) blur(0px)', duration: 0.36, ease: 'power3.out' }, o + 0.73)
        .to(nr, { scale: 1.15, opacity: 0.15, borderWidth: '1px', duration: 0.36, ease: 'power2.out' }, o + 0.73)
    }
  })

  // ── 心跳指示器脉动 ──
  if (heartRef.value) {
    for (let i = 0; i < FRAME_COUNT; i++) {
      const po = i + 0.38
      master.to(heartRef.value, { scale: 1.5, duration: 0.06, ease: 'power2.out' }, po)
      master.to(heartRef.value, { scale: 1, duration: 0.1, ease: 'power2.in' }, po + 0.06)
      master.to(heartRef.value, { scale: 1.35, duration: 0.05, ease: 'power2.out' }, po + 0.22)
      master.to(heartRef.value, { scale: 1, duration: 0.08, ease: 'power2.in' }, po + 0.27)
    }
  }

  // ── 背景脉冲光晕脉动 ──
  if (pulseA.value && pulseB.value && pulseC.value) {
    master.to(pulseA.value, { x: '8vw', y: '-5vh', scale: 1.2, duration: FRAME_COUNT }, 0)
    master.to(pulseB.value, { x: '-6vw', y: '8vh', scale: 1.25, duration: FRAME_COUNT }, 0)
    master.to(pulseC.value, { x: '4vw', y: '10vh', scale: 1.15, duration: FRAME_COUNT }, 0)
    for (let i = 0; i < FRAME_COUNT; i++) {
      master.to(pulseA.value, { opacity: 0.8, duration: 0.06 }, i + 0.38)
      master.to(pulseA.value, { opacity: 0.5, duration: 0.15 }, i + 0.44)
    }
  }

  if (progRef.value) master.to(progRef.value, { width: '100%', duration: FRAME_COUNT }, 0)

  // ── 波纹爆发 ──
  frames_.forEach((_frame, i) => {
    const st = ScrollTrigger.create({ trigger: track, scroller, start: `${((i + 0.38) / FRAME_COUNT) * 100}% top`, onEnter: () => rippleBurst(8) })
    cleanupFns.push(() => st.kill())
  })

  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }

onMounted(() => {
  initCanvas()
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupPulseWave() }))
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  cancelAnimationFrame(animId)
  ScrollTrigger.getAll().forEach(st => st.kill())
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0
  ripples.length = 0
})
</script>

<style scoped lang="scss">
/* ═══════════════════════════════════════════════════════════
   Pulse Wave — 脉冲波浪  类名前缀: pw-
   ═══════════════════════════════════════════════════════════ */

.pw-root {
  position: relative; width: 100vw; height: 100vh; overflow: hidden;
  background: linear-gradient(155deg, #fff5f3 0%, #ffefea 20%, #fff2ee 40%, #fef3f2 60%, #fff4f0 80%, #fff3ee 100%);
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif;
}

/* ── 背景脉冲光晕 ── */
.pw-bg-pulse {
  position: absolute; border-radius: 50%; pointer-events: none; will-change: transform, opacity; z-index: 0;
  filter: blur(70px);
  &--a { width: 34vw; height: 34vw; top: -5vh; left: -3vw; background: radial-gradient(circle, rgba(255,120,130,.5) 0%, transparent 70%); opacity: .5; }
  &--b { width: 28vw; height: 28vw; bottom: -6vh; right: -2vw; background: radial-gradient(circle, rgba(255,180,130,.45) 0%, transparent 70%); opacity: .45; }
  &--c { width: 24vw; height: 24vw; top: 45vh; left: 55vw; background: radial-gradient(circle, rgba(255,150,140,.4) 0%, transparent 70%); opacity: .4; }
}

/* ── Canvas ── */
.pw-canvas { position: absolute; inset: 0; z-index: 1; pointer-events: none; }

/* ── 滚动 ── */
.pw-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 2;
  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(255,130,120,.3); &:hover { background: rgba(255,130,120,.5); } }
}
.pw-track { position: relative; width: 100%; }
.pw-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

/* ── 标题 ── */
.pw-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 20; text-align: center; width: min(92vw, 800px); }

.pw-kicker { display: inline-block; font-size: .66rem; font-weight: 700; letter-spacing: .26em; text-transform: uppercase; color: rgba(210,90,80,.8); background: rgba(255,130,120,.12); backdrop-filter: blur(8px); border: 1px solid rgba(255,120,110,.2); border-radius: 999px; padding: .3rem 1.2rem; margin-bottom: .55rem; }

.pw-title { margin: 0; display: flex; justify-content: center; gap: .1em; }
.pw-title__c { display: inline-block; font-size: clamp(2.2rem, 5.5vw, 4.6rem); font-weight: 900; color: #e86858; will-change: transform, opacity;
  &--glow { background: linear-gradient(135deg, #ff4d6a, #ff6b5a, #ff9a5c); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 2px 14px rgba(255,77,106,.45)); }
}

.pw-line { width: 90px; height: 2px; margin: .45rem auto .6rem; border-radius: 2px; background: linear-gradient(90deg, transparent, #ff6b5a, #ff9a5c, transparent); transform-origin: center; }
.pw-sub { margin: 0; font-size: clamp(.76rem, 1.1vw, .88rem); color: rgba(200,90,70,.55); max-width: 440px; margin-inline: auto; }

/* ── 心跳指示器 ── */
.pw-heart { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 15; pointer-events: none; will-change: transform; }
.pw-heart__ring { position: absolute; top: 50%; left: 50%; border-radius: 50%; border: 1.5px solid rgba(255,130,110,.45); transform: translate(-50%, -50%); animation: pw-heart-beat 2s ease-in-out infinite;
  &:nth-child(1) { width: 50px; height: 50px; }
  &:nth-child(2) { width: 80px; height: 80px; animation-delay: .25s; }
  &:nth-child(3) { width: 110px; height: 110px; animation-delay: .5s; }
  &:nth-child(4) { width: 140px; height: 140px; animation-delay: .75s; }
}
@keyframes pw-heart-beat { 0%,100%{opacity:.25;transform:translate(-50%,-50%) scale(.85)} 50%{opacity:.7;transform:translate(-50%,-50%) scale(1.15)} }

.pw-heart__core { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 8px; height: 8px; border-radius: 50%; background: #fff; box-shadow: 0 0 12px #fff, 0 0 35px rgba(255,100,90,.9), 0 0 70px rgba(255,80,70,.5); }

/* ── 舞台 & 帧 ── */
.pw-stage { position: absolute; inset: 0; pointer-events: none; }
.pw-frame { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; will-change: opacity; }
.pw-frame__img { position: relative; z-index: 1; width: 100%; height: 100%; object-fit: cover; transform-origin: center center; will-change: transform, filter; }

.pw-frame__energy-ring {
  position: absolute; top: 50%; left: 50%;
  width: 60vw; height: 60vw; max-width: 800px; max-height: 800px;
  transform: translate(-50%, -50%);
  border-radius: 50%; z-index: 2; pointer-events: none;
  border: 1px solid rgba(255,150,120,.4);
  box-shadow: 0 0 30px rgba(255,130,100,.3), inset 0 0 30px rgba(255,130,100,.15);
  will-change: transform, opacity;
}

.pw-frame__caption { position: absolute; left: max(5vw, 24px); bottom: 12vh; z-index: 20; max-width: min(80vw, 580px); will-change: transform, opacity; }

.pw-frame__num { display: inline-flex; align-items: center; height: 1.6rem; padding: 0 .8rem; border-radius: 999px; background: rgba(255,255,255,.5); backdrop-filter: blur(12px); border: 1px solid rgba(255,140,120,.3); font-size: .62rem; font-weight: 700; letter-spacing: .15em; text-transform: uppercase; color: #d45540; }

.pw-frame__title { margin: .6rem 0 0; font-size: clamp(2rem, 5.2vw, 4rem); font-weight: 900; line-height: 1.1; color: #3d0e00; text-shadow: 0 2px 10px rgba(255,255,255,.65), 0 0 40px rgba(255,130,110,.35); }

.pw-frame__desc { margin: .4rem 0 0; font-size: clamp(.8rem, 1.25vw, .96rem); line-height: 1.6; color: rgba(85,22,3,.68); text-shadow: 0 1px 5px rgba(255,255,255,.45); }

.pw-progress { position: absolute; left: 0; bottom: 0; z-index: 30; width: 100%; height: 3px; background: rgba(255,130,110,.06); }
.pw-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #ff4d6a, #ff6b5a, #ff9a5c, #ff4d6a); background-size: 200% 100%; box-shadow: 0 0 12px rgba(255,90,70,.55); }

@media (max-width: 768px) {
  .pw-header { top: 2vh; }
  .pw-kicker { font-size: .54rem; padding: .2rem .65rem; }
  .pw-title__c { font-size: 1.7rem; }
  .pw-frame__caption { bottom: 9vh; }
  .pw-frame__title { font-size: 1.45rem; color: #4a1200; }
}
</style>
