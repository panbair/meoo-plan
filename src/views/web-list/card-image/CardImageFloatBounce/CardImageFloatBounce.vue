<template>
  <section ref="rootRef" class="fb-root">
    <div ref="blob1" class="fb-blob fb-blob--sky"></div>
    <div ref="blob2" class="fb-blob fb-blob--coral"></div>
    <div ref="blob3" class="fb-blob fb-blob--mint"></div>

    <canvas ref="canvasRef" class="fb-canvas"></canvas>

    <div ref="scrollRef" class="fb-scroll">
      <div ref="trackRef" class="fb-track" :style="{ height: trackHeight }">
        <div class="fb-sticky">

          <header ref="headerRef" class="fb-header">
            <span class="fb-kicker">○ Float Bounce · 漂浮弹跳 ○</span>
            <h1 class="fb-title">
              <span ref="tw1" class="fb-title__w">漂</span>
              <span ref="tw2" class="fb-title__w fb-title__w--pop">浮</span>
              <span ref="tw3" class="fb-title__w">弹</span>
              <span ref="tw4" class="fb-title__w fb-title__w--pop">跳</span>
            </h1>
            <div ref="lineRef" class="fb-line"></div>
            <p class="fb-sub">向下滚动 · 图片如气泡般漂浮弹跳 · 轻盈又灵动</p>
          </header>

          <div ref="floatDot" class="fb-float-dot">
            <span class="fb-float-dot__ring" v-for="n in 3" :key="n"></span>
          </div>

          <div class="fb-stage">
            <article
              v-for="(frame, idx) in frames"
              :key="frame.id"
              :ref="(el) => setFrameRef(el, idx)"
              class="fb-frame"
            >
              <img
                :ref="(el) => setImgRef(el, idx)"
                class="fb-frame__img"
                :src="frame.image" :alt="frame.alt" loading="lazy"
              />
              <div :ref="(el) => setSheenRef(el, idx)" class="fb-frame__sheen"></div>
              <div :ref="(el) => setCaptionRef(el, idx)" class="fb-frame__caption">
                <span class="fb-frame__num">{{ frame.label }}</span>
                <h2 class="fb-frame__title">{{ frame.title }}</h2>
                <p class="fb-frame__desc">{{ frame.description }}</p>
              </div>
            </article>
          </div>

          <div class="fb-progress"><div ref="progRef" class="fb-progress__fill"></div></div>
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
//  CardImageFloatBounce — 漂浮弹跳
//
//  核心概念：图片如气泡般从底部漂浮上升，带着弹性弹跳
//  1. y轴浮动       — 图片从下方浮起，中心点弹跳
//  2. 弹性缩放       — 落地瞬间压扁，弹起瞬间拉长
//  3. 轻微旋转       — 漂浮时微微晃动
//  4. Canvas 气泡    — 圆润泡泡从底部升起
//  5. 光泽扫过       — 一道光从图片表面划过
//
//  青春时尚配色：天空蓝 · 珊瑚粉 · 薄荷绿 · 阳光黄
// ═══════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

interface FloatFrame {
  id: string; label: string; title: string; description: string
  image: string; alt: string
}

const frames: FloatFrame[] = [
  { id: 'sky-float', label: 'Frame 01', title: '天空漂浮', description: '图片如气球般从底部轻轻浮起，在天空中轻盈弹跳。', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80', alt: '金色天空下漂浮' },
  { id: 'coral-bob', label: 'Frame 02', title: '珊瑚浮动', description: '珊瑚色的画面在水中上下浮动，每个弹跳都充满弹性。', image: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=1920&q=80', alt: '珊瑚色画面浮动' },
  { id: 'mint-bounce', label: 'Frame 03', title: '薄荷弹跳', description: '清新的薄荷绿中，画面带着弹簧般的弹性轻盈跳跃。', image: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=1920&q=80', alt: '薄荷清新弹跳' },
  { id: 'golden-float', label: 'Frame 04', title: '金色漂浮', description: '金色阳光下，画面缓缓漂浮上升，如同温暖的上升气流。', image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80', alt: '金色漂浮上升' },
  { id: 'peach-rise', label: 'Frame 05', title: '蜜桃升起', description: '蜜桃色的温柔中，画面做最后一次优美的弹跳，缓缓升空。', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80', alt: '蜜桃色森林光影' },
]

const FRAME_COUNT = frames.length
const trackHeight = `${(FRAME_COUNT + 1) * 100}vh`

const rootRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const lineRef = ref<HTMLElement | null>(null)
const tw1 = ref<HTMLElement | null>(null); const tw2 = ref<HTMLElement | null>(null)
const tw3 = ref<HTMLElement | null>(null); const tw4 = ref<HTMLElement | null>(null)
const floatDot = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const blob1 = ref<HTMLElement | null>(null); const blob2 = ref<HTMLElement | null>(null)
const blob3 = ref<HTMLElement | null>(null)

const frameRefs = ref<HTMLElement[]>([])
const imgRefs = ref<HTMLImageElement[]>([])
const sheenRefs = ref<HTMLElement[]>([])
const captionRefs = ref<HTMLElement[]>([])

const setFrameRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) frameRefs.value[i] = el }
const setImgRef = (el: Element | null, i: number) => { if (el instanceof HTMLImageElement) imgRefs.value[i] = el }
const setSheenRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) sheenRefs.value[i] = el }
const setCaptionRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) captionRefs.value[i] = el }

const cleanupFns: TweenCleanup[] = []

// ═══════════════════════════ Canvas 气泡 ═══════════════════════════
interface Bubble { x: number; y: number; r: number; vy: number; vx: number; alpha: number; hue: number; life: number; maxLife: number; phase: number }
let ctx: CanvasRenderingContext2D | null = null
let cw = 0; let ch = 0
const bubbles: Bubble[] = []
let animId = 0
const MAX_B = 120; const BASE_B = 50

function createBubble(fromBottom?: boolean): Bubble {
  return {
    x: Math.random() * cw, y: fromBottom ? ch + 40 : Math.random() * ch,
    r: 3 + Math.random() * 14, vy: -(0.4 + Math.random() * 2.2),
    vx: (Math.random() - 0.5) * 0.6, alpha: 0.25 + Math.random() * 0.45,
    hue: [195, 10, 155, 45, 280][Math.floor(Math.random() * 5)],
    life: 0, maxLife: 200 + Math.random() * 400, phase: Math.random() * Math.PI * 2,
  }
}

function bubbleBurst(cx: number, cy: number, count: number) {
  for (let i = 0; i < count; i++) {
    const b = createBubble()
    b.x = cx + (Math.random() - 0.5) * 250; b.y = cy + (Math.random() - 0.5) * 100
    b.r = 4 + Math.random() * 16; b.vy = -(1 + Math.random() * 5)
    b.alpha = 0.4 + Math.random() * 0.5; bubbles.push(b)
  }
  while (bubbles.length > MAX_B) bubbles.shift()
}

function initCanvas() {
  const c = canvasRef.value; if (!c) return
  ctx = c.getContext('2d'); if (!ctx) return
  const resize = () => { cw = window.innerWidth; ch = window.innerHeight; c.width = cw; c.height = ch }
  resize(); window.addEventListener('resize', resize)
  cleanupFns.push(() => window.removeEventListener('resize', resize))
  for (let i = 0; i < BASE_B; i++) bubbles.push(createBubble())

  function animate() {
    if (!ctx) return
    ctx.clearRect(0, 0, cw, ch)
    while (bubbles.length < BASE_B) bubbles.push(createBubble(true))
    for (let i = bubbles.length - 1; i >= 0; i--) {
      const b = bubbles[i]; b.life++
      if (b.life >= b.maxLife) { bubbles.splice(i, 1); continue }
      const t = b.life / b.maxLife; const fade = t < 0.08 ? t / 0.08 : t > 0.75 ? 1 - (t - 0.75) / 0.25 : 1
      b.phase += 0.02; b.x += b.vx + Math.sin(b.phase) * 0.3; b.y += b.vy

      // 泡泡光晕
      const grad = ctx!.createRadialGradient(b.x - b.r * 0.25, b.y - b.r * 0.3, b.r * 0.1, b.x, b.y, b.r)
      grad.addColorStop(0, `hsla(${b.hue}, 40%, 92%, ${b.alpha * fade * 0.9})`)
      grad.addColorStop(0.4, `hsla(${b.hue}, 60%, 78%, ${b.alpha * fade * 0.4})`)
      grad.addColorStop(1, `hsla(${b.hue}, 50%, 65%, 0)`)
      ctx!.beginPath(); ctx!.arc(b.x, b.y, b.r, 0, Math.PI * 2)
      ctx!.fillStyle = grad; ctx!.fill()

      // 高光点
      ctx!.beginPath()
      ctx!.arc(b.x - b.r * 0.25, b.y - b.r * 0.3, b.r * 0.22, 0, Math.PI * 2)
      ctx!.fillStyle = `rgba(255,255,255,${b.alpha * fade * 0.7})`; ctx!.fill()

      if (b.y < -60) { b.y = ch + 40; b.x = Math.random() * cw; b.life = 0 }
    }
    animId = requestAnimationFrame(animate)
  }
  animId = requestAnimationFrame(animate)
}

// ═══════════════════════════ 入场 ═══════════════════════════
function setupEntrance() {
  if (!scrollRef.value || !headerRef.value || !floatDot.value) return
  const tl = gsap.timeline({ scrollTrigger: { trigger: scrollRef.value, scroller: scrollRef.value, start: 'top 75%', toggleActions: 'play none none reverse' } })
  const chars = [tw1.value, tw2.value, tw3.value, tw4.value]
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.85, ease: 'power3.out' })
    .fromTo(chars, { autoAlpha: 0, y: -30, scale: 0.3 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.08, ease: 'back.out(2.5)' }, '-=0.45')
    .fromTo(lineRef.value, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power3.inOut' }, '-=0.25')
    .fromTo(floatDot.value, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.65, ease: 'back.out(1.8)' }, '-=0.3')
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

// ═══════════════════════════ 漂浮弹跳 ═══════════════════════════
function setupFloatBounce() {
  if (!scrollRef.value || !trackRef.value) return
  const scroller = scrollRef.value; const track = trackRef.value
  const frames_ = frameRefs.value; const images = imgRefs.value
  const sheens = sheenRefs.value; const captions = captionRefs.value
  if (!frames_.length || !images.length || !sheens.length || !captions.length) return

  // 初始状态
  frames_.forEach((frame, i) => {
    gsap.set(frame, { position: 'absolute', inset: 0, zIndex: FRAME_COUNT - i })
    if (i === 0) {
      gsap.set(frame, { autoAlpha: 1 })
      gsap.set(images[i], { y: 0, scaleY: 1, scaleX: 1, rotation: 0, filter: 'brightness(1.05) saturate(1.12) contrast(1.02) blur(0px)' })
      gsap.set(sheens[i], { opacity: 0.08, y: '-100%' })
      gsap.set(captions[i], { autoAlpha: 1, y: 0 })
    } else {
      gsap.set(frame, { autoAlpha: 0 })
      gsap.set(images[i], { y: 80, scaleY: 0.7, scaleX: 1.3, rotation: -4, filter: 'brightness(2.2) saturate(0.5) contrast(1.2) blur(14px)' })
      gsap.set(sheens[i], { opacity: 0.5, y: '100%' })
      gsap.set(captions[i], { autoAlpha: 0, y: 50 })
    }
  })

  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.3 },
  })

  frames_.forEach((_frame, i) => {
    const o = i; const img = images[i]; const sheen = sheens[i]; const cap = captions[i]

    // 🫧 Phase A: 从底部浮起入场 (0 → 0.36)
    // y: 80→0 (弹跳过冲), scaleY: 压扁→拉伸→正常, rotation: -4→0
    master
      .to(img, { y: -10, scaleY: 1.08, scaleX: 0.93, rotation: 0, duration: 0.2, ease: 'power2.out' }, o)
      .to(img, { y: 0, scaleY: 1, scaleX: 1, duration: 0.16, ease: 'bounce.out' }, o + 0.2)
      .to(img, { filter: 'brightness(1.05) saturate(1.12) contrast(1.02) blur(0px)', duration: 0.36, ease: 'power2.out' }, o)
      .to(sheen, { opacity: 0.08, y: '-100%', duration: 0.36, ease: 'power2.out' }, o)
      .to(cap, { autoAlpha: 1, y: 0, duration: 0.28, ease: 'back.out(1.6)' }, o + 0.12)

    // 🫧 Phase B: 弹跳舞蹈 — 连续弹跳 (0.36 → 0.62)
    // 弹跳1: 弹起
    master.to(img, { y: -18, scaleY: 0.92, scaleX: 1.06, duration: 0.07, ease: 'power2.out' }, o + 0.36)
    master.to(img, { y: 0, scaleY: 1.04, scaleX: 0.96, duration: 0.07, ease: 'bounce.out' }, o + 0.43)
    master.to(img, { y: 0, scaleY: 1, scaleX: 1, duration: 0.04, ease: 'sine.in' }, o + 0.5)
    // 弹跳2: 更小的弹跳
    master.to(img, { y: -8, scaleY: 0.96, scaleX: 1.03, duration: 0.05, ease: 'power2.out' }, o + 0.54)
    master.to(img, { y: 0, scaleY: 1.02, scaleX: 0.98, duration: 0.06, ease: 'bounce.out' }, o + 0.59)
    master.to(img, { y: 0, scaleY: 1, scaleX: 1, duration: 0.03, ease: 'sine.in' }, o + 0.65)
    // 轻微晃动
    master.to(img, { rotation: 2, duration: 0.05, ease: 'sine.inOut' }, o + 0.38)
    master.to(img, { rotation: -1.5, duration: 0.06, ease: 'sine.inOut' }, o + 0.46)
    master.to(img, { rotation: 0, duration: 0.05, ease: 'sine.inOut' }, o + 0.54)

    // 🫧 Phase C: 向上浮起退场 (0.62 → 0.8)
    master
      .to(img, { y: -70, scaleY: 0.75, scaleX: 1.22, rotation: 3, filter: 'brightness(2.5) saturate(0.4) contrast(1.3) blur(15px)', duration: 0.22, ease: 'power3.in' }, o + 0.62)
      .to(sheen, { opacity: 0.55, y: '100%', duration: 0.2, ease: 'power2.in' }, o + 0.63)
      .to(cap, { autoAlpha: 0, y: -35, duration: 0.12, ease: 'power2.in' }, o + 0.62)
      .to(_frame, { autoAlpha: 0, duration: 0.1 }, o + 0.74)

    // 🫧 Phase D: 下一帧从底部浮起
    if (i < FRAME_COUNT - 1) {
      const nf = frames_[i + 1]; const ni = images[i + 1]; const ns = sheens[i + 1]
      master
        .to(nf, { autoAlpha: 1, duration: 0.08 }, o + 0.7)
        .to(ni, { y: -8, scaleY: 1.06, scaleX: 0.94, rotation: 0, duration: 0.18, ease: 'power2.out' }, o + 0.74)
        .to(ni, { y: 0, scaleY: 1, scaleX: 1, duration: 0.14, ease: 'bounce.out' }, o + 0.92)
        .to(ni, { filter: 'brightness(1.05) saturate(1.12) contrast(1.02) blur(0px)', duration: 0.34, ease: 'power2.out' }, o + 0.74)
        .to(ns, { opacity: 0.08, y: '-100%', duration: 0.34, ease: 'power2.out' }, o + 0.74)
    }
  })

  // 浮动指示点
  if (floatDot.value) {
    for (let i = 0; i < FRAME_COUNT; i++) {
      master.to(floatDot.value, { y: -15, duration: 0.06, ease: 'power2.out' }, i + 0.36)
      master.to(floatDot.value, { y: 0, duration: 0.08, ease: 'bounce.out' }, i + 0.42)
    }
  }

  // 背景
  if (blob1.value && blob2.value && blob3.value) {
    master.to(blob1.value, { y: '-12vh', x: '5vw', scale: 1.15, duration: FRAME_COUNT }, 0)
    master.to(blob2.value, { y: '-8vh', x: '-4vw', scale: 1.2, duration: FRAME_COUNT }, 0)
    master.to(blob3.value, { y: '-10vh', x: '3vw', scale: 1.1, duration: FRAME_COUNT }, 0)
  }

  if (progRef.value) master.to(progRef.value, { width: '100%', duration: FRAME_COUNT }, 0)

  frames_.forEach((_frame, i) => {
    const st = ScrollTrigger.create({ trigger: track, scroller, start: `${((i + 0.36) / FRAME_COUNT) * 100}% top`, onEnter: () => bubbleBurst(cw / 2, ch * 0.7, 30) })
    cleanupFns.push(() => st.kill())
  })

  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }

onMounted(() => {
  initCanvas()
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupFloatBounce() }))
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  cancelAnimationFrame(animId)
  ScrollTrigger.getAll().forEach(st => st.kill())
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0; bubbles.length = 0
})
</script>

<style scoped lang="scss">
.fb-root { position: relative; width: 100vw; height: 100vh; overflow: hidden; background: linear-gradient(160deg, #f5faff 0%, #fef5f8 25%, #f8fdfb 50%, #fefaf5 75%, #f6fafe 100%); font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif; }

.fb-blob { position: absolute; border-radius: 50%; filter: blur(75px); pointer-events: none; will-change: transform; z-index: 0; }
.fb-blob--sky { width: 34vw; height: 34vw; top: -5vh; left: -3vw; background: radial-gradient(circle, rgba(140,200,240,.4) 0%, transparent 70%); }
.fb-blob--coral { width: 28vw; height: 28vw; bottom: -6vh; right: -2vw; background: radial-gradient(circle, rgba(255,160,140,.4) 0%, transparent 70%); }
.fb-blob--mint { width: 24vw; height: 24vw; top: 40vh; left: 50vw; background: radial-gradient(circle, rgba(140,220,190,.35) 0%, transparent 70%); }

.fb-canvas { position: absolute; inset: 0; z-index: 1; pointer-events: none; }

.fb-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 2;
  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(140,190,230,.3); &:hover { background: rgba(140,190,230,.5); } }
}
.fb-track { position: relative; width: 100%; }
.fb-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

.fb-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 20; text-align: center; width: min(92vw, 800px); }
.fb-kicker { display: inline-block; font-size: .66rem; font-weight: 700; letter-spacing: .26em; text-transform: uppercase; color: rgba(100,150,200,.8); background: rgba(140,190,230,.12); backdrop-filter: blur(8px); border: 1px solid rgba(130,180,220,.2); border-radius: 999px; padding: .3rem 1.2rem; margin-bottom: .55rem; }
.fb-title { margin: 0; display: flex; justify-content: center; gap: .1em; }
.fb-title__w { display: inline-block; font-size: clamp(2.2rem, 5.5vw, 4.6rem); font-weight: 900; color: #5a9ec8; will-change: transform,opacity;
  &--pop { background: linear-gradient(135deg, #ff7b7b, #ff9a8b, #ffb347); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 2px 12px rgba(255,123,123,.4)); }
}
.fb-line { width: 90px; height: 2px; margin: .45rem auto .6rem; border-radius: 2px; background: linear-gradient(90deg, transparent, #7bb8e0, #ff9a8b, transparent); transform-origin: center; }
.fb-sub { margin: 0; font-size: clamp(.76rem, 1.1vw, .88rem); color: rgba(100,140,180,.55); max-width: 440px; margin-inline: auto; }

.fb-float-dot { position: absolute; bottom: 15vh; left: 50%; transform: translateX(-50%); z-index: 15; pointer-events: none; will-change: transform; }
.fb-float-dot__ring { display: block; width: 10px; height: 10px; margin: 5px auto; border-radius: 50%; background: rgba(140,200,240,.5); box-shadow: 0 0 8px rgba(140,200,240,.4); animation: fb-dot-float 2s ease-in-out infinite;
  &:nth-child(2) { width: 7px; height: 7px; animation-delay: .3s; opacity: .6; }
  &:nth-child(3) { width: 5px; height: 5px; animation-delay: .6s; opacity: .35; }
}
@keyframes fb-dot-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }

.fb-stage { position: absolute; inset: 0; pointer-events: none; }
.fb-frame { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; will-change: opacity; }
.fb-frame__img { position: relative; z-index: 1; width: 100%; height: 100%; object-fit: cover; transform-origin: center center; will-change: transform, filter; }
.fb-frame__sheen { position: absolute; inset: -5%; z-index: 2; pointer-events: none; background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.35) 45%, rgba(255,255,255,.5) 50%, rgba(255,255,255,.35) 55%, transparent 100%); will-change: transform, opacity; }

.fb-frame__caption { position: absolute; left: max(5vw,24px); bottom: 16vh; z-index: 20; max-width: min(80vw,580px); will-change: transform,opacity; }
.fb-frame__num { display: inline-flex; align-items: center; height: 1.6rem; padding: 0 .8rem; border-radius: 999px; background: rgba(255,255,255,.5); backdrop-filter: blur(12px); border: 1px solid rgba(140,190,230,.3); font-size: .62rem; font-weight: 700; letter-spacing: .15em; text-transform: uppercase; color: #5a8eb8; }
.fb-frame__title { margin: .6rem 0 0; font-size: clamp(2rem, 5.2vw, 4rem); font-weight: 900; line-height: 1.1; color: #0a2a40; text-shadow: 0 2px 10px rgba(255,255,255,.65), 0 0 40px rgba(140,200,240,.35); }
.fb-frame__desc { margin: .4rem 0 0; font-size: clamp(.8rem, 1.25vw, .96rem); line-height: 1.6; color: rgba(10,50,80,.65); text-shadow: 0 1px 5px rgba(255,255,255,.45); }

.fb-progress { position: absolute; left: 0; bottom: 0; z-index: 30; width: 100%; height: 3px; background: rgba(140,190,230,.06); }
.fb-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #5ac8fa, #ff7b7b, #5ac8fa); background-size: 200% 100%; box-shadow: 0 0 12px rgba(90,180,240,.5); }

@media (max-width: 768px) {
  .fb-header { top: 2vh; } .fb-kicker { font-size: .54rem; padding: .2rem .65rem; } .fb-title__w { font-size: 1.7rem; }
  .fb-frame__caption { bottom: 12vh; } .fb-frame__title { font-size: 1.45rem; color: #0d3048; }
}
</style>
