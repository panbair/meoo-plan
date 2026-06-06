<template>
  <section ref="rootRef" class="ws-root">
    <div ref="blobA" class="ws-blob ws-blob--a"></div>
    <div ref="blobB" class="ws-blob ws-blob--b"></div>
    <div ref="blobC" class="ws-blob ws-blob--c"></div>
    <div ref="blobD" class="ws-blob ws-blob--d"></div>

    <canvas ref="canvasRef" class="ws-canvas"></canvas>

    <div ref="scrollRef" class="ws-scroll">
      <div ref="trackRef" class="ws-track" :style="{ height: trackHeight }">
        <div class="ws-sticky">

          <header ref="headerRef" class="ws-header">
            <span class="ws-kicker">≈ Wiggle Shake · 扭动摇摆 ≈</span>
            <h1 class="ws-title">
              <span ref="tc1" class="ws-title__c">扭</span>
              <span ref="tc2" class="ws-title__c ws-title__c--wiggle">动</span>
              <span ref="tc3" class="ws-title__c">摇</span>
              <span ref="tc4" class="ws-title__c ws-title__c--wiggle">摆</span>
            </h1>
            <div ref="lineRef" class="ws-line"></div>
            <p class="ws-sub">向下滚动 · 图片如Q弹果冻般扭动摇摆 · 欢乐十足</p>
          </header>

          <div ref="wiggleBar" class="ws-wiggle-bar">
            <span v-for="n in 8" :key="n" class="ws-wiggle-bar__seg" :ref="(el) => setSegRef(el, n-1)"></span>
          </div>

          <div class="ws-stage">
            <article
              v-for="(frame, idx) in frames"
              :key="frame.id"
              :ref="(el) => setFrameRef(el, idx)"
              class="ws-frame"
            >
              <img
                :ref="(el) => setImgRef(el, idx)"
                class="ws-frame__img"
                :src="frame.image" :alt="frame.alt" loading="lazy"
              />
              <div :ref="(el) => setOverlayRef(el, idx)" class="ws-frame__overlay"></div>
              <div :ref="(el) => setCaptionRef(el, idx)" class="ws-frame__caption">
                <span class="ws-frame__num">{{ frame.label }}</span>
                <h2 class="ws-frame__title">{{ frame.title }}</h2>
                <p class="ws-frame__desc">{{ frame.description }}</p>
              </div>
            </article>
          </div>

          <div class="ws-progress"><div ref="progRef" class="ws-progress__fill"></div></div>
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
//  CardImageWiggleShake — 扭动摇摆
//
//  核心概念：图片如Q弹果冻般扭动摇摆
//  1. x轴扭动        — 图片左右快速摆动 (wiggle)
//  2. 弹性形变        — scaleX/scaleY 交替变化模拟挤压拉伸
//  3. 旋转抖动        — 轻微的旋转抖动叠加
//  4. 摆动条          — 底部8段指示器逐段波浪摆动
//  5. Canvas 弹珠     — 彩色弹珠粒子在画面中弹跳
//
//  青春时尚配色：糖果粉 · 青柠绿 · 橘子橙 · 葡萄紫 · 柠檬黄
// ═══════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

interface WiggleFrame {
  id: string; label: string; title: string; description: string
  image: string; alt: string
}

const frames: WiggleFrame[] = [
  { id: 'jello-pop', label: 'Frame 01', title: '果冻弹跳', description: '图片如果冻般Q弹扭动，从左到右摆动着进入视野。', image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1920&q=80', alt: '果冻般弹跳的花朵' },
  { id: 'wiggle-wave', label: 'Frame 02', title: '扭动波浪', description: '波浪般的扭动从画面一端传到另一端，充满弹性。', image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80', alt: '波浪般扭动的山谷' },
  { id: 'shake-pop', label: 'Frame 03', title: '摇摆弹跳', description: '画面剧烈摇摆后突然弹回，释放出欢乐的能量。', image: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=1920&q=80', alt: '摇摆的日落海岸' },
  { id: 'bounce-wiggle', label: 'Frame 04', title: '弹跳扭摆', description: '弹跳与扭动完美结合，画面充满节奏感和生命力。', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80', alt: '弹跳扭动的麦田' },
  { id: 'happy-shake', label: 'Frame 05', title: '欢乐摇摆', description: '最后的欢乐摇摆中，整个画面都沉浸在愉悦的律动里。', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80', alt: '欢乐摇摆的森林' },
]

const FRAME_COUNT = frames.length
const trackHeight = `${(FRAME_COUNT + 1) * 100}vh`

const rootRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const lineRef = ref<HTMLElement | null>(null)
const tc1 = ref<HTMLElement | null>(null); const tc2 = ref<HTMLElement | null>(null)
const tc3 = ref<HTMLElement | null>(null); const tc4 = ref<HTMLElement | null>(null)
const wiggleBar = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const blobA = ref<HTMLElement | null>(null); const blobB = ref<HTMLElement | null>(null)
const blobC = ref<HTMLElement | null>(null); const blobD = ref<HTMLElement | null>(null)

const frameRefs = ref<HTMLElement[]>([])
const imgRefs = ref<HTMLImageElement[]>([])
const overlayRefs = ref<HTMLElement[]>([])
const captionRefs = ref<HTMLElement[]>([])
const segRefs = ref<HTMLElement[]>([])
const setSegRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) segRefs.value[i] = el }

const setFrameRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) frameRefs.value[i] = el }
const setImgRef = (el: Element | null, i: number) => { if (el instanceof HTMLImageElement) imgRefs.value[i] = el }
const setOverlayRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) overlayRefs.value[i] = el }
const setCaptionRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) captionRefs.value[i] = el }

const cleanupFns: TweenCleanup[] = []

// ═══════════════════════════ Canvas 弹珠 ═══════════════════════════
interface Marble { x: number; y: number; vx: number; vy: number; r: number; hue: number; alpha: number; life: number; maxLife: number }
let ctx: CanvasRenderingContext2D | null = null
let cw = 0; let ch = 0
const marbles: Marble[] = []
let animId = 0
const MAX_M = 100; const BASE_M = 40
const GRAVITY = 0.3

function createMarble(cx?: number, cy?: number): Marble {
  return {
    x: cx ?? Math.random() * cw, y: cy ?? Math.random() * ch * 0.4,
    vx: (Math.random() - 0.5) * 8, vy: -(Math.random() * 6 + 4),
    r: 3 + Math.random() * 8, hue: [330, 40, 80, 280, 55][Math.floor(Math.random() * 5)],
    alpha: 0.4 + Math.random() * 0.5, life: 0, maxLife: 80 + Math.random() * 200,
  }
}

function marbleBurst(cx: number, cy: number, count: number) {
  for (let i = 0; i < count; i++) {
    const m = createMarble(cx, cy)
    m.vx = (Math.random() - 0.5) * 12; m.vy = -(Math.random() * 8 + 6)
    marbles.push(m)
  }
  while (marbles.length > MAX_M) marbles.shift()
}

function initCanvas() {
  const c = canvasRef.value; if (!c) return
  ctx = c.getContext('2d'); if (!ctx) return
  const resize = () => { cw = window.innerWidth; ch = window.innerHeight; c.width = cw; c.height = ch }
  resize(); window.addEventListener('resize', resize)
  cleanupFns.push(() => window.removeEventListener('resize', resize))
  for (let i = 0; i < BASE_M; i++) marbles.push(createMarble())

  function animate() {
    if (!ctx) return
    ctx.clearRect(0, 0, cw, ch)
    while (marbles.length < BASE_M) marbles.push(createMarble())

    for (let i = marbles.length - 1; i >= 0; i--) {
      const m = marbles[i]; m.life++
      if (m.life >= m.maxLife) { marbles.splice(i, 1); continue }

      const t = m.life / m.maxLife; const fade = t < 0.1 ? t / 0.1 : t > 0.7 ? 1 - (t - 0.7) / 0.3 : 1
      m.vy += GRAVITY; m.x += m.vx; m.y += m.vy

      // 底部弹跳
      if (m.y > ch - m.r) { m.y = ch - m.r; m.vy *= -0.65; m.vx *= 0.9 }
      if (m.x < m.r || m.x > cw - m.r) { m.vx *= -0.7 }

      // 弹珠光晕
      const grad = ctx!.createRadialGradient(m.x - m.r * 0.2, m.y - m.r * 0.25, m.r * 0.08, m.x, m.y, m.r)
      grad.addColorStop(0, `hsla(${m.hue}, 85%, 75%, ${m.alpha * fade})`)
      grad.addColorStop(0.5, `hsla(${m.hue}, 70%, 58%, ${m.alpha * fade * 0.5})`)
      grad.addColorStop(1, `hsla(${m.hue}, 60%, 40%, 0)`)
      ctx!.beginPath(); ctx!.arc(m.x, m.y, m.r, 0, Math.PI * 2)
      ctx!.fillStyle = grad; ctx!.fill()

      // 高光
      ctx!.beginPath()
      ctx!.arc(m.x - m.r * 0.2, m.y - m.r * 0.3, m.r * 0.25, 0, Math.PI * 2)
      ctx!.fillStyle = `rgba(255,255,255,${m.alpha * fade * 0.6})`; ctx!.fill()

      if (m.y > ch + 50 && m.vy > 0) { marbles.splice(i, 1) }
    }
    animId = requestAnimationFrame(animate)
  }
  animId = requestAnimationFrame(animate)
}

// ═══════════════════════════ 入场 ═══════════════════════════
function setupEntrance() {
  if (!scrollRef.value || !headerRef.value || !wiggleBar.value) return
  const tl = gsap.timeline({ scrollTrigger: { trigger: scrollRef.value, scroller: scrollRef.value, start: 'top 75%', toggleActions: 'play none none reverse' } })
  const chars = [tc1.value, tc2.value, tc3.value, tc4.value]
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 55 }, { autoAlpha: 1, y: 0, duration: 0.85, ease: 'power3.out' })
    .fromTo(chars, { autoAlpha: 0, x: (i: number) => i % 2 === 0 ? -60 : 60, scale: 0.2, rotation: (i: number) => i % 2 === 0 ? -25 : 25 }, {
      autoAlpha: 1, x: 0, scale: 1, rotation: 0, duration: 0.6, stagger: 0.08, ease: 'elastic.out(1, 0.5)',
    }, '-=0.45')
    .fromTo(lineRef.value, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power3.inOut' }, '-=0.25')
    .fromTo(wiggleBar.value, { autoAlpha: 0, scaleY: 0 }, { autoAlpha: 1, scaleY: 1, duration: 0.6, ease: 'back.out(2)' }, '-=0.3')
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

// ═══════════════════════════ 扭动摇摆 ═══════════════════════════
function setupWiggleShake() {
  if (!scrollRef.value || !trackRef.value) return
  const scroller = scrollRef.value; const track = trackRef.value
  const frames_ = frameRefs.value; const images = imgRefs.value
  const overlays = overlayRefs.value; const captions = captionRefs.value
  const segs = segRefs.value
  if (!frames_.length || !images.length || !overlays.length || !captions.length) return

  // 初始状态
  frames_.forEach((frame, i) => {
    gsap.set(frame, { position: 'absolute', inset: 0, zIndex: FRAME_COUNT - i })
    if (i === 0) {
      gsap.set(frame, { autoAlpha: 1 })
      gsap.set(images[i], { x: 0, scaleX: 1, scaleY: 1, rotation: 0, filter: 'brightness(1.05) saturate(1.15) contrast(1.02) blur(0px)' })
      gsap.set(overlays[i], { opacity: 0.06 })
      gsap.set(captions[i], { autoAlpha: 1, y: 0 })
    } else {
      gsap.set(frame, { autoAlpha: 0 })
      gsap.set(images[i], { x: 60, scaleX: 0.6, scaleY: 1.4, rotation: 8, filter: 'brightness(2.3) saturate(0.45) contrast(1.25) blur(14px)' })
      gsap.set(overlays[i], { opacity: 0.5 })
      gsap.set(captions[i], { autoAlpha: 0, y: 40, x: 20 })
    }
  })

  // 摆动条初始
  if (segs.length) segs.forEach(s => gsap.set(s, { y: 0 }))

  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.2 },
  })

  frames_.forEach((_frame, i) => {
    const o = i; const img = images[i]; const overlay = overlays[i]; const cap = captions[i]

    // 🍮 Phase A: 扭动入场 (0 → 0.38)
    // Wiggle: 快速多次左右摆动 + 弹性形变逐渐恢复正常
    master
      .to(img, { x: -25, scaleX: 1.35, scaleY: 0.7, rotation: -2, duration: 0.06, ease: 'power2.out' }, o)
      .to(img, { x: 18, scaleX: 0.75, scaleY: 1.25, rotation: 2.5, duration: 0.06, ease: 'power2.out' }, o + 0.06)
      .to(img, { x: -10, scaleX: 1.15, scaleY: 0.85, rotation: -1.2, duration: 0.05, ease: 'power2.out' }, o + 0.12)
      .to(img, { x: 6, scaleX: 0.92, scaleY: 1.08, rotation: 0.8, duration: 0.05, ease: 'power2.out' }, o + 0.17)
      .to(img, { x: -2, scaleX: 1.03, scaleY: 0.97, rotation: -0.3, duration: 0.04, ease: 'power2.out' }, o + 0.22)
      .to(img, { x: 0, scaleX: 1, scaleY: 1, rotation: 0, duration: 0.12, ease: 'elastic.out(1, 0.4)' }, o + 0.26)
      .to(img, { filter: 'brightness(1.05) saturate(1.15) contrast(1.02) blur(0px)', duration: 0.38, ease: 'power2.out' }, o)
      .to(overlay, { opacity: 0.06, duration: 0.38, ease: 'power2.out' }, o)
      .to(cap, { autoAlpha: 1, y: 0, x: 0, duration: 0.26, ease: 'elastic.out(1, 0.5)' }, o + 0.14)

    // 🍮 Phase B: 摇摆舞蹈 — 持续微摆 (0.38 → 0.62)
    master
      .to(img, { x: -8, scaleX: 1.06, scaleY: 0.94, rotation: -1.5, duration: 0.05, ease: 'sine.inOut' }, o + 0.38)
      .to(img, { x: 7, scaleX: 0.94, scaleY: 1.05, rotation: 1.3, duration: 0.05, ease: 'sine.inOut' }, o + 0.43)
      .to(img, { x: -4, scaleX: 1.03, scaleY: 0.97, rotation: -0.7, duration: 0.05, ease: 'sine.inOut' }, o + 0.48)
      .to(img, { x: 3, scaleX: 0.98, scaleY: 1.02, rotation: 0.4, duration: 0.05, ease: 'sine.inOut' }, o + 0.53)
      .to(img, { x: 0, scaleX: 1, scaleY: 1, rotation: 0, duration: 0.06, ease: 'elastic.out(1, 0.3)' }, o + 0.58)

    // 🍮 Phase C: 扭动退场 (0.62 → 0.8)
    master
      .to(img, { x: -55, scaleX: 0.65, scaleY: 1.35, rotation: -7, filter: 'brightness(2.6) saturate(0.35) contrast(1.3) blur(13px)', duration: 0.22, ease: 'power3.in' }, o + 0.62)
      .to(overlay, { opacity: 0.55, duration: 0.2, ease: 'power2.in' }, o + 0.63)
      .to(cap, { autoAlpha: 0, y: -25, x: -15, duration: 0.12, ease: 'power2.in' }, o + 0.62)
      .to(_frame, { autoAlpha: 0, duration: 0.1 }, o + 0.73)

    // 🍮 Phase D: 下一帧扭动入场
    if (i < FRAME_COUNT - 1) {
      const nf = frames_[i + 1]; const ni = images[i + 1]; const no = overlays[i + 1]
      master
        .to(nf, { autoAlpha: 1, duration: 0.08 }, o + 0.69)
        .to(ni, { x: -20, scaleX: 1.3, scaleY: 0.72, rotation: -3, duration: 0.05, ease: 'power2.out' }, o + 0.73)
        .to(ni, { x: 14, scaleX: 0.78, scaleY: 1.2, rotation: 2, duration: 0.05, ease: 'power2.out' }, o + 0.78)
        .to(ni, { x: 0, scaleX: 1, scaleY: 1, rotation: 0, duration: 0.1, ease: 'elastic.out(1, 0.4)' }, o + 0.83)
        .to(ni, { filter: 'brightness(1.05) saturate(1.15) contrast(1.02) blur(0px)', duration: 0.32, ease: 'power2.out' }, o + 0.73)
        .to(no, { opacity: 0.06, duration: 0.32, ease: 'power2.out' }, o + 0.73)
    }
  })

  // ── 摆动条波浪动画 ──
  if (segs.length) {
    const SEG_COUNT = segs.length
    for (let idx = 0; idx < SEG_COUNT; idx++) {
      const phaseOffset = (idx / SEG_COUNT) * 0.6
      frames_.forEach((_frame, i) => {
        const so = i + phaseOffset
        // 每帧每段都摆动
        master.to(segs[idx], { y: -18, duration: 0.04, ease: 'power2.out' }, so + 0.38)
        master.to(segs[idx], { y: 14, duration: 0.04, ease: 'power2.in' }, so + 0.42)
        master.to(segs[idx], { y: -8, duration: 0.03, ease: 'power2.out' }, so + 0.48)
        master.to(segs[idx], { y: 0, duration: 0.05, ease: 'elastic.out(1,0.3)' }, so + 0.53)
      })
    }
  }

  // 背景光斑
  if (blobA.value && blobB.value && blobC.value && blobD.value) {
    master.to(blobA.value, { x: '10vw', y: '-5vh', scale: 1.2, duration: FRAME_COUNT }, 0)
    master.to(blobB.value, { x: '-8vw', y: '8vh', scale: 1.25, duration: FRAME_COUNT }, 0)
    master.to(blobC.value, { x: '6vw', y: '-8vh', scale: 1.15, duration: FRAME_COUNT }, 0)
    master.to(blobD.value, { x: '-4vw', y: '6vh', scale: 1.3, duration: FRAME_COUNT }, 0)
  }

  if (progRef.value) master.to(progRef.value, { width: '100%', duration: FRAME_COUNT }, 0)

  // 弹珠爆发
  frames_.forEach((_frame, i) => {
    const st = ScrollTrigger.create({ trigger: track, scroller, start: `${((i + 0.38) / FRAME_COUNT) * 100}% top`, onEnter: () => marbleBurst(cw / 2, ch / 2, 35) })
    cleanupFns.push(() => st.kill())
  })

  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }

onMounted(() => {
  initCanvas()
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupWiggleShake() }))
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  cancelAnimationFrame(animId)
  ScrollTrigger.getAll().forEach(st => st.kill())
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0; marbles.length = 0
})
</script>

<style scoped lang="scss">
.ws-root { position: relative; width: 100vw; height: 100vh; overflow: hidden; background: linear-gradient(150deg, #fffaf5 0%, #fff6f0 20%, #fefaf7 40%, #fff7f5 60%, #fef8f3 80%, #fff9f6 100%); font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif; }

.ws-blob { position: absolute; border-radius: 50%; filter: blur(75px); pointer-events: none; will-change: transform; z-index: 0; }
.ws-blob--a { width: 30vw; height: 30vw; top: -4vh; left: -3vw; background: radial-gradient(circle, rgba(255,140,190,.45) 0%, transparent 70%); }
.ws-blob--b { width: 26vw; height: 26vw; bottom: -5vh; right: -2vw; background: radial-gradient(circle, rgba(160,230,120,.4) 0%, transparent 70%); }
.ws-blob--c { width: 24vw; height: 24vw; top: 35vh; left: 55vw; background: radial-gradient(circle, rgba(255,190,90,.38) 0%, transparent 70%); }
.ws-blob--d { width: 22vw; height: 22vw; top: 12vh; right: 20vw; background: radial-gradient(circle, rgba(200,150,240,.35) 0%, transparent 70%); }

.ws-canvas { position: absolute; inset: 0; z-index: 1; pointer-events: none; }

.ws-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 2;
  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(255,150,180,.3); &:hover { background: rgba(255,150,180,.5); } }
}
.ws-track { position: relative; width: 100%; }
.ws-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

.ws-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 20; text-align: center; width: min(92vw, 800px); }
.ws-kicker { display: inline-block; font-size: .66rem; font-weight: 700; letter-spacing: .26em; text-transform: uppercase; color: rgba(200,100,150,.8); background: rgba(255,150,200,.1); backdrop-filter: blur(8px); border: 1px solid rgba(255,140,180,.2); border-radius: 999px; padding: .3rem 1.2rem; margin-bottom: .55rem; }
.ws-title { margin: 0; display: flex; justify-content: center; gap: .08em; }
.ws-title__c { display: inline-block; font-size: clamp(2.2rem, 5.5vw, 4.6rem); font-weight: 900; color: #d46090; will-change: transform,opacity;
  &--wiggle { background: linear-gradient(135deg, #ff6b9d, #ff8c69, #ffb347, #8ce060); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 2px 12px rgba(255,107,157,.4)); }
}
.ws-line { width: 90px; height: 2px; margin: .45rem auto .6rem; border-radius: 2px; background: linear-gradient(90deg, transparent, #ff8c69, #8ce060, #ff6b9d, transparent); transform-origin: center; }
.ws-sub { margin: 0; font-size: clamp(.76rem, 1.1vw, .88rem); color: rgba(180,90,130,.5); max-width: 440px; margin-inline: auto; }

/* ── 摆动条 ── */
.ws-wiggle-bar { position: absolute; bottom: 10vh; left: 50%; transform: translateX(-50%); z-index: 25; display: flex; gap: 4px; pointer-events: none; will-change: transform; }
.ws-wiggle-bar__seg { display: block; width: 14px; height: 14px; border-radius: 4px; will-change: transform;
  &:nth-child(1) { background: #ff6b9d; } &:nth-child(2) { background: #ff8c69; }
  &:nth-child(3) { background: #ffb347; } &:nth-child(4) { background: #8ce060; }
  &:nth-child(5) { background: #5ac8fa; } &:nth-child(6) { background: #a78bfa; }
  &:nth-child(7) { background: #f472b6; } &:nth-child(8) { background: #fb923c; }
}

.ws-stage { position: absolute; inset: 0; pointer-events: none; }
.ws-frame { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; will-change: opacity; }
.ws-frame__img { position: relative; z-index: 1; width: 100%; height: 100%; object-fit: cover; transform-origin: center center; will-change: transform, filter; }
.ws-frame__overlay { position: absolute; inset: -3%; z-index: 2; pointer-events: none; background: radial-gradient(ellipse 55% 45% at 50% 50%, rgba(255,200,180,.25) 0%, transparent 65%); mix-blend-mode: soft-light; will-change: opacity; }

.ws-frame__caption { position: absolute; left: max(5vw,24px); bottom: 14vh; z-index: 20; max-width: min(80vw,580px); will-change: transform,opacity; }
.ws-frame__num { display: inline-flex; align-items: center; height: 1.6rem; padding: 0 .8rem; border-radius: 999px; background: rgba(255,255,255,.5); backdrop-filter: blur(12px); border: 1px solid rgba(255,150,180,.3); font-size: .62rem; font-weight: 700; letter-spacing: .15em; text-transform: uppercase; color: #c45080; }
.ws-frame__title { margin: .6rem 0 0; font-size: clamp(2rem, 5.2vw, 4rem); font-weight: 900; line-height: 1.1; color: #3d0020; text-shadow: 0 2px 10px rgba(255,255,255,.65), 0 0 40px rgba(255,140,180,.35); }
.ws-frame__desc { margin: .4rem 0 0; font-size: clamp(.8rem, 1.25vw, .96rem); line-height: 1.6; color: rgba(60,10,30,.65); text-shadow: 0 1px 5px rgba(255,255,255,.45); }

.ws-progress { position: absolute; left: 0; bottom: 0; z-index: 30; width: 100%; height: 3px; background: rgba(255,150,180,.06); }
.ws-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #ff6b9d, #ff8c69, #ffb347, #8ce060, #ff6b9d); background-size: 200% 100%; box-shadow: 0 0 12px rgba(255,120,160,.5); }

@media (max-width: 768px) {
  .ws-header { top: 2vh; } .ws-kicker { font-size: .54rem; padding: .2rem .65rem; } .ws-title__c { font-size: 1.7rem; }
  .ws-wiggle-bar { bottom: 7vh; gap: 3px; } .ws-wiggle-bar__seg { width: 10px; height: 10px; }
  .ws-frame__caption { bottom: 11vh; } .ws-frame__title { font-size: 1.45rem; color: #4a0028; }
}
</style>
