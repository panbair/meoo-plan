<template>
  <section ref="rootRef" class="pf-root">
    <!-- 深度光斑 -->
    <div ref="deepBlob1" class="pf-deep-blob pf-deep-blob--1"></div>
    <div ref="deepBlob2" class="pf-deep-blob pf-deep-blob--2"></div>
    <div ref="deepBlob3" class="pf-deep-blob pf-deep-blob--3"></div>

    <!-- 深度粒子画布 -->
    <canvas ref="canvasRef" class="pf-canvas"></canvas>

    <!-- 滚动容器 -->
    <div ref="scrollRef" class="pf-scroll">
      <div ref="trackRef" class="pf-track" :style="{ height: trackHeight }">
        <div class="pf-sticky">

          <!-- 标题 -->
          <header ref="headerRef" class="pf-header">
            <span class="pf-kicker">◈ Parallax Flow · 视差流动 ◈</span>
            <h1 class="pf-title">
              <span ref="tw1" class="pf-title__w pf-title__w--near">视</span>
              <span ref="tw2" class="pf-title__w pf-title__w--mid">差</span>
              <span ref="tw3" class="pf-title__w pf-title__w--far">流</span>
              <span ref="tw4" class="pf-title__w pf-title__w--near">动</span>
            </h1>
            <div ref="lineRef" class="pf-line"></div>
            <p class="pf-sub">向下滚动 · 三层深度视差 · 如同透过窗户看3D世界</p>
          </header>

          <!-- 景深指示器 -->
          <div ref="depthIndicator" class="pf-depth-indicator">
            <span class="pf-depth-indicator__layer pf-depth-indicator__layer--near">近</span>
            <span class="pf-depth-indicator__layer pf-depth-indicator__layer--mid">中</span>
            <span class="pf-depth-indicator__layer pf-depth-indicator__layer--far">远</span>
          </div>

          <!-- 图片舞台 -->
          <div class="pf-stage">
            <article
              v-for="(frame, idx) in frames"
              :key="frame.id"
              :ref="(el) => setFrameRef(el, idx)"
              class="pf-frame"
            >
              <!-- 🎯 远景层 — 移动最慢，微微模糊 -->
              <div
                :ref="(el) => setBgLayerRef(el, idx)"
                class="pf-layer pf-layer--bg"
              >
                <img :src="frame.image" :alt="frame.alt" class="pf-layer__img" loading="lazy" />
              </div>

              <!-- 🎯 中景层 — 正常速度，主体画面 -->
              <div
                :ref="(el) => setMidLayerRef(el, idx)"
                class="pf-layer pf-layer--mid"
              >
                <img :src="frame.image" :alt="frame.alt" class="pf-layer__img" loading="lazy" />
              </div>

              <!-- 🎯 近景层 — 移动最快，局部放大 -->
              <div
                :ref="(el) => setFgLayerRef(el, idx)"
                class="pf-layer pf-layer--fg"
              >
                <img :src="frame.image" :alt="frame.alt" class="pf-layer__img" loading="lazy" />
              </div>

              <!-- 文字信息 -->
              <div
                :ref="(el) => setCaptionRef(el, idx)"
                class="pf-frame__caption"
              >
                <span class="pf-frame__num">{{ frame.label }}</span>
                <h2 class="pf-frame__title">{{ frame.title }}</h2>
                <p class="pf-frame__desc">{{ frame.description }}</p>
              </div>
            </article>
          </div>

          <div class="pf-progress"><div ref="progRef" class="pf-progress__fill"></div></div>
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
//  CardImageParallaxFlow — 视差流动
//
//  核心概念：三层深度视差
//  1. 远景层 (bg) — scale 0.72, y移动最慢(0.4x), blur 6px, 营造深远感
//  2. 中景层 (mid) — scale 1.0, y移动正常(1.0x), blur 0px, 视觉焦点
//  3. 近景层 (fg) — scale 1.35, y移动最快(1.8x), 局部裁剪, 仿佛触手可及
//
//  用户竖滚 → 三层以不同速度位移 → 强烈3D视差深度感
//  配合景深模糊变化、Canvas深度粒子
//
//  青春时尚配色：暖桃 · 珊瑚金 · 琥珀 · 天蓝
// ═══════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

interface ParallaxFrame {
  id: string; label: string; title: string; description: string
  image: string; alt: string
}

const frames: ParallaxFrame[] = [
  {
    id: 'depth-sunrise', label: 'Frame 01', title: '深度破晓',
    description: '近处的阳光、远处的山峦——三层视差让画面拥有呼吸般的深度。',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80',
    alt: '日出金色田野',
  },
  {
    id: 'layer-ocean', label: 'Frame 02', title: '层叠海岸',
    description: '近景的浪花、中景的海面、远景的天空，每一层都有自己的速度。',
    image: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=1920&q=80',
    alt: '层叠珊瑚海岸',
  },
  {
    id: 'parallax-forest', label: 'Frame 03', title: '视差森林',
    description: '透过树枝的近景，看到中景的森林，再远是朦胧的山脉。',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80',
    alt: '阳光穿透森林',
  },
  {
    id: 'depth-valley', label: 'Frame 04', title: '纵深山谷',
    description: '三层景深让山谷画面有了走进其中的冲动，每个深度都在流动。',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80',
    alt: '纵深山谷景色',
  },
  {
    id: 'flow-mountain', label: 'Frame 05', title: '流动山峦',
    description: '山在远处静默，云在中景飘移，光在近处闪烁——完美的视差交响。',
    image: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=1920&q=80',
    alt: '云隙光照亮山峦',
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
const tw1 = ref<HTMLElement | null>(null); const tw2 = ref<HTMLElement | null>(null)
const tw3 = ref<HTMLElement | null>(null); const tw4 = ref<HTMLElement | null>(null)
const depthIndicator = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const deepBlob1 = ref<HTMLElement | null>(null)
const deepBlob2 = ref<HTMLElement | null>(null)
const deepBlob3 = ref<HTMLElement | null>(null)

const frameRefs = ref<HTMLElement[]>([])
const bgLayerRefs = ref<HTMLElement[]>([])
const midLayerRefs = ref<HTMLElement[]>([])
const fgLayerRefs = ref<HTMLElement[]>([])
const captionRefs = ref<HTMLElement[]>([])

const setFrameRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) frameRefs.value[i] = el }
const setBgLayerRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) bgLayerRefs.value[i] = el }
const setMidLayerRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) midLayerRefs.value[i] = el }
const setFgLayerRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) fgLayerRefs.value[i] = el }
const setCaptionRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) captionRefs.value[i] = el }

const cleanupFns: TweenCleanup[] = []

// ═══════════════════════════ Canvas 深度粒子 ═══════════════════════════
interface DepthParticle {
  x: number; y: number
  vx: number; vy: number
  size: number; alpha: number
  hue: number; depth: number // 0=近(near) 1=中(mid) 2=远(far)
  life: number; maxLife: number
}

let ctx: CanvasRenderingContext2D | null = null
let cw = 0; let ch = 0
const depthParticles: DepthParticle[] = []
let animId = 0
const MAX_DP = 200; const BASE_DP = 80

function createDepthParticle(fromBottom?: boolean): DepthParticle {
  const depth = Math.floor(Math.random() * 3) // 0=near, 1=mid, 2=far
  return {
    x: Math.random() * cw,
    y: fromBottom ? ch + 30 : Math.random() * ch,
    vx: (Math.random() - 0.5) * (depth === 0 ? 2.5 : depth === 1 ? 1.5 : 0.6),
    vy: -(depth === 0 ? 3.5 : depth === 1 ? 1.8 : 0.7) * (0.6 + Math.random() * 0.8),
    size: depth === 0 ? 2 + Math.random() * 4 : depth === 1 ? 1.5 + Math.random() * 3 : 1 + Math.random() * 2,
    alpha: depth === 0 ? 0.4 + Math.random() * 0.5 : depth === 1 ? 0.25 + Math.random() * 0.4 : 0.15 + Math.random() * 0.25,
    hue: [25, 35, 195, 45, 15][Math.floor(Math.random() * 5)],
    depth, life: 0, maxLife: 150 + Math.random() * 350,
  }
}

function depthBurst(cx: number, cy: number, count: number) {
  for (let i = 0; i < count; i++) {
    const p = createDepthParticle()
    p.x = cx + (Math.random() - 0.5) * 300
    p.y = cy + (Math.random() - 0.5) * 150
    depthParticles.push(p)
  }
  while (depthParticles.length > MAX_DP) depthParticles.shift()
}

function initCanvas() {
  const c = canvasRef.value; if (!c) return
  ctx = c.getContext('2d'); if (!ctx) return
  const resize = () => { cw = window.innerWidth; ch = window.innerHeight; c.width = cw; c.height = ch }
  resize(); window.addEventListener('resize', resize)
  cleanupFns.push(() => window.removeEventListener('resize', resize))
  for (let i = 0; i < BASE_DP; i++) depthParticles.push(createDepthParticle())

  function animate() {
    if (!ctx) return
    ctx.clearRect(0, 0, cw, ch)
    while (depthParticles.length < BASE_DP) depthParticles.push(createDepthParticle(true))

    // 按深度排序：远的先画
    const sorted = [...depthParticles].sort((a, b) => b.depth - a.depth)
    for (let i = sorted.length - 1; i >= 0; i--) {
      const p = sorted[i]
      p.life++
      if (p.life >= p.maxLife) {
        const idx = depthParticles.indexOf(p)
        if (idx >= 0) depthParticles.splice(idx, 1)
        continue
      }
      const t = p.life / p.maxLife
      const fade = t < 0.08 ? t / 0.08 : t > 0.72 ? 1 - (t - 0.72) / 0.28 : 1
      p.x += p.vx; p.y += p.vy

      // 近景粒子大而亮，远景粒子小而淡
      const blur = p.depth === 0 ? 0 : p.depth === 1 ? 1.5 : 3
      const grad = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * (1 + p.depth * 0.5))
      grad.addColorStop(0, `hsla(${p.hue}, 80%, ${75 - p.depth * 8}%, ${p.alpha * fade})`)
      grad.addColorStop(0.5, `hsla(${p.hue}, 60%, ${60 - p.depth * 10}%, ${p.alpha * fade * 0.4})`)
      grad.addColorStop(1, `hsla(${p.hue}, 50%, 45%, 0)`)

      ctx!.filter = `blur(${blur}px)`
      ctx!.beginPath(); ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx!.fillStyle = grad; ctx!.fill()
      ctx!.filter = 'none'

      if (p.y < -80 || p.x < -80 || p.x > cw + 80) {
        p.y = ch + 40; p.x = Math.random() * cw; p.life = 0
      }
    }
    animId = requestAnimationFrame(animate)
  }
  animId = requestAnimationFrame(animate)
}

// ═══════════════════════════ 入场 ═══════════════════════════
function setupEntrance() {
  if (!scrollRef.value || !headerRef.value || !depthIndicator.value) return
  const tl = gsap.timeline({
    scrollTrigger: { trigger: scrollRef.value, scroller: scrollRef.value, start: 'top 75%', toggleActions: 'play none none reverse' },
  })
  const chars = [tw1.value, tw2.value, tw3.value, tw4.value]
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 55 }, { autoAlpha: 1, y: 0, duration: 0.85, ease: 'power3.out' })
    .fromTo(chars, { autoAlpha: 0, y: 35, scale: 0.4, z: -100 }, {
      autoAlpha: 1, y: 0, scale: 1, z: 0, duration: 0.65, stagger: 0.08, ease: 'back.out(2.2)',
    }, '-=0.45')
    .fromTo(lineRef.value, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power3.inOut' }, '-=0.25')
    .fromTo(depthIndicator.value, { autoAlpha: 0, x: 40 }, { autoAlpha: 1, x: 0, duration: 0.6, ease: 'power3.out' }, '-=0.2')
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

// ═══════════════════════════ 三层视差流动 ═══════════════════════════
function setupParallaxFlow() {
  if (!scrollRef.value || !trackRef.value) return

  const scroller = scrollRef.value
  const track = trackRef.value
  const frames_ = frameRefs.value
  const bgLayers = bgLayerRefs.value
  const midLayers = midLayerRefs.value
  const fgLayers = fgLayerRefs.value
  const captions = captionRefs.value

  if (!frames_.length || !bgLayers.length || !midLayers.length || !fgLayers.length || !captions.length) return

  // ── 初始状态 ──
  frames_.forEach((frame, i) => {
    gsap.set(frame, { position: 'absolute', inset: 0, zIndex: FRAME_COUNT - i })

    if (i === 0) {
      gsap.set(frame, { autoAlpha: 1 })
      // 远景：缩小、微模糊、位置稍偏
      gsap.set(bgLayers[i], { y: 0, scale: 0.72, filter: 'blur(6px) brightness(1.05)', opacity: 1 })
      // 中景：正常
      gsap.set(midLayers[i], { y: 0, scale: 1, filter: 'blur(0px) brightness(1.05) saturate(1.1)', opacity: 1 })
      // 近景：放大、清晰、裁剪
      gsap.set(fgLayers[i], { y: 0, scale: 1.35, filter: 'blur(0px) brightness(1.08) contrast(1.04)', opacity: 0.55, clipPath: 'inset(8% 5% 55% 5%)' })
      gsap.set(captions[i], { autoAlpha: 1, y: 0 })
    } else {
      gsap.set(frame, { autoAlpha: 0 })
      // 隐藏态：三层都偏移到下方
      gsap.set(bgLayers[i], { y: 40, scale: 0.72, filter: 'blur(10px) brightness(1.3)', opacity: 0.5 })
      gsap.set(midLayers[i], { y: 65, scale: 1, filter: 'blur(16px) brightness(1.3) saturate(0.6)', opacity: 1 })
      gsap.set(fgLayers[i], { y: 90, scale: 1.35, filter: 'blur(8px) brightness(1.4) contrast(1.1)', opacity: 0, clipPath: 'inset(5% 3% 92% 3%)' })
      gsap.set(captions[i], { autoAlpha: 0, y: 55 })
    }
  })

  // ── 主时间线 ──
  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.4 },
  })

  frames_.forEach((_frame, i) => {
    const o = i
    const bgLayer = bgLayers[i]
    const midLayer = midLayers[i]
    const fgLayer = fgLayers[i]
    const cap = captions[i]

    // 🔭 Phase A: 三层视差入场 (0 → 0.45)
    // 近景移动最快(1.8x speed)，中景正常(1.0x)，远景最慢(0.4x)
    master
      // 远景 — 移动最少 (0.4x)
      .to(bgLayer, { y: 0, filter: 'blur(6px) brightness(1.05)', opacity: 1, duration: 0.45, ease: 'power2.out' }, o)
      // 中景 — 正常速度 (1.0x)
      .to(midLayer, { y: 0, filter: 'blur(0px) brightness(1.05) saturate(1.1)', opacity: 1, duration: 0.45, ease: 'power2.out' }, o)
      // 近景 — 移动最快 (1.8x)
      .to(fgLayer, {
        y: 0, filter: 'blur(0px) brightness(1.08) contrast(1.04)',
        opacity: 0.55, clipPath: 'inset(8% 5% 55% 5%)',
        duration: 0.45, ease: 'power2.out',
      }, o)
      .to(cap, { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power3.out' }, o + 0.16)

    // 🔭 Phase B: 视差驻留 — 三层微微波动 (0.45 → 0.62)
    // 近景轻微摆动，远景几乎不动
    master
      .to(fgLayer, { y: -4, opacity: 0.6, duration: 0.08, ease: 'sine.inOut' }, o + 0.45)
      .to(fgLayer, { y: 0, opacity: 0.55, duration: 0.1, ease: 'sine.inOut' }, o + 0.53)
      .to(midLayer, { scale: 1.02, duration: 0.08, ease: 'sine.inOut' }, o + 0.46)
      .to(midLayer, { scale: 1, duration: 0.1, ease: 'sine.inOut' }, o + 0.54)
      .to(bgLayer, { filter: 'blur(4px) brightness(1.08)', duration: 0.07, ease: 'sine.inOut' }, o + 0.47)
      .to(bgLayer, { filter: 'blur(6px) brightness(1.05)', duration: 0.08, ease: 'sine.inOut' }, o + 0.54)

    // 🔭 Phase C: 视差退场 — 三层以不同速度向下退出 (0.62 → 0.82)
    master
      // 远景 — 退出最慢 (0.4x)
      .to(bgLayer, { y: 45, filter: 'blur(10px) brightness(1.3)', opacity: 0.5, duration: 0.25, ease: 'power3.in' }, o + 0.62)
      // 中景 — 正常退出 (1.0x)
      .to(midLayer, { y: 70, filter: 'blur(16px) brightness(1.3) saturate(0.6)', opacity: 1, duration: 0.25, ease: 'power3.in' }, o + 0.62)
      // 近景 — 退出最快 (1.8x)
      .to(fgLayer, { y: 100, filter: 'blur(8px) brightness(1.4) contrast(1.1)', opacity: 0, clipPath: 'inset(5% 3% 92% 3%)', duration: 0.25, ease: 'power3.in' }, o + 0.62)
      .to(cap, { autoAlpha: 0, y: -25, duration: 0.13, ease: 'power2.in' }, o + 0.62)
      .to(_frame, { autoAlpha: 0, duration: 0.1 }, o + 0.74)

    // 🔭 Phase D: 下一帧三层视差入场
    if (i < FRAME_COUNT - 1) {
      const nf = frames_[i + 1]
      const nbg = bgLayers[i + 1]; const nmid = midLayers[i + 1]; const nfg = fgLayers[i + 1]

      master
        .to(nf, { autoAlpha: 1, duration: 0.08 }, o + 0.7)
        .to(nbg, { y: 0, filter: 'blur(6px) brightness(1.05)', opacity: 1, duration: 0.42, ease: 'power2.out' }, o + 0.74)
        .to(nmid, { y: 0, filter: 'blur(0px) brightness(1.05) saturate(1.1)', opacity: 1, duration: 0.42, ease: 'power2.out' }, o + 0.74)
        .to(nfg, { y: 0, filter: 'blur(0px) brightness(1.08) contrast(1.04)', opacity: 0.55, clipPath: 'inset(8% 5% 55% 5%)', duration: 0.42, ease: 'power2.out' }, o + 0.74)
    }
  })

  // ── 景深指示器 ──
  if (depthIndicator.value) {
    for (let i = 0; i < FRAME_COUNT; i++) {
      master.to(depthIndicator.value, { scale: 1.15, duration: 0.06, ease: 'power2.out' }, i + 0.45)
      master.to(depthIndicator.value, { scale: 1, duration: 0.12, ease: 'power2.in' }, i + 0.51)
    }
  }

  // ── 深度光斑漂移（不同速度模拟深度） ──
  if (deepBlob1.value && deepBlob2.value && deepBlob3.value) {
    // 近景光斑移动快
    master.to(deepBlob1.value, { x: '12vw', y: '-10vh', scale: 1.3, duration: FRAME_COUNT }, 0)
    // 中景光斑正常
    master.to(deepBlob2.value, { x: '-8vw', y: '6vh', scale: 1.15, duration: FRAME_COUNT }, 0)
    // 远景光斑移动慢
    master.to(deepBlob3.value, { x: '4vw', y: '-4vh', scale: 1.05, duration: FRAME_COUNT }, 0)
  }

  if (progRef.value) master.to(progRef.value, { width: '100%', duration: FRAME_COUNT }, 0)

  // ── 深度粒子爆发 ──
  frames_.forEach((_frame, i) => {
    const st = ScrollTrigger.create({
      trigger: track, scroller,
      start: `${((i + 0.45) / FRAME_COUNT) * 100}% top`,
      onEnter: () => depthBurst(cw / 2, ch / 2, 50),
    })
    cleanupFns.push(() => st.kill())
  })

  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }

onMounted(() => {
  initCanvas()
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupParallaxFlow() }))
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  cancelAnimationFrame(animId)
  ScrollTrigger.getAll().forEach(st => st.kill())
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0; depthParticles.length = 0
})
</script>

<style scoped lang="scss">
/* ═══════════════════════════════════════════════════════════
   Parallax Flow — 视差流动  类名前缀: pf-
   ═══════════════════════════════════════════════════════════ */

.pf-root {
  position: relative; width: 100vw; height: 100vh; overflow: hidden;
  background: linear-gradient(160deg, #fffaf6 0%, #fff5ec 20%, #fef7f2 40%, #fff8f3 60%, #fef6ef 80%, #fff7f1 100%);
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif;
  perspective: 1200px;
}

/* ── 深度光斑（不同移动速度） ── */
.pf-deep-blob { position: absolute; border-radius: 50%; pointer-events: none; will-change: transform; z-index: 0; }
.pf-deep-blob--1 { width: 32vw; height: 32vw; top: -4vh; left: -2vw; filter: blur(65px); background: radial-gradient(circle, rgba(255,160,130,.5) 0%, transparent 70%); }
.pf-deep-blob--2 { width: 26vw; height: 26vw; bottom: -5vh; right: -2vw; filter: blur(85px); background: radial-gradient(circle, rgba(255,200,150,.4) 0%, transparent 70%); }
.pf-deep-blob--3 { width: 22vw; height: 22vw; top: 40vh; left: 55vw; filter: blur(100px); background: radial-gradient(circle, rgba(180,210,240,.35) 0%, transparent 70%); }

/* ── Canvas ── */
.pf-canvas { position: absolute; inset: 0; z-index: 1; pointer-events: none; }

/* ── 滚动 ── */
.pf-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 2;
  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(255,160,130,.3); &:hover { background: rgba(255,160,130,.5); } }
}
.pf-track { position: relative; width: 100%; }
.pf-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

/* ── 标题 ── */
.pf-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 20; text-align: center; width: min(92vw, 800px); }
.pf-kicker { display: inline-block; font-size: .66rem; font-weight: 700; letter-spacing: .26em; text-transform: uppercase; color: rgba(200,130,100,.8); background: rgba(255,160,130,.1); backdrop-filter: blur(8px); border: 1px solid rgba(255,150,120,.2); border-radius: 999px; padding: .3rem 1.2rem; margin-bottom: .55rem; }

.pf-title { margin: 0; display: flex; justify-content: center; gap: .08em; }
.pf-title__w { display: inline-block; font-size: clamp(2.2rem, 5.5vw, 4.6rem); font-weight: 900; will-change: transform,opacity;
  &--near { color: #e87050; text-shadow: 0 3px 18px rgba(232,112,80,.5); }
  &--mid { color: #d49560; text-shadow: 0 2px 10px rgba(212,149,96,.35); }
  &--far { color: #b8b0a8; text-shadow: 0 1px 5px rgba(184,176,168,.2); }
}

.pf-line { width: 100px; height: 2px; margin: .45rem auto .6rem; border-radius: 2px; background: linear-gradient(90deg, transparent, #e87050, #d49560, #a0c8e8, transparent); transform-origin: center; }
.pf-sub { margin: 0; font-size: clamp(.76rem, 1.1vw, .88rem); color: rgba(190,120,90,.5); max-width: 480px; margin-inline: auto; }

/* ── 景深指示器 ── */
.pf-depth-indicator {
  position: absolute; right: max(2vw, 12px); top: 50%; transform: translateY(-50%);
  z-index: 25; display: flex; flex-direction: column; gap: 20px;
  pointer-events: none; will-change: transform;
}
.pf-depth-indicator__layer {
  writing-mode: vertical-rl; font-size: .6rem; font-weight: 800; letter-spacing: .3em;
  padding: .6rem .35rem; border-radius: 6px;
  &--near { color: #e87050; background: rgba(255,160,130,.2); border-left: 3px solid #e87050; }
  &--mid { color: #d49560; background: rgba(255,180,140,.15); border-left: 3px solid #d49560; }
  &--far { color: #a0b8c8; background: rgba(160,200,220,.12); border-left: 3px solid #a0b8c8; }
}

/* ── 舞台 & 帧 ── */
.pf-stage { position: absolute; inset: 0; pointer-events: none; }
.pf-frame { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; will-change: opacity; }

/* ── 三层视差 ── */
.pf-layer {
  position: absolute; inset: 0;
  overflow: hidden;
  will-change: transform, filter, opacity;
  transform-origin: center center;
}

.pf-layer--bg {
  z-index: 0;
  .pf-layer__img { transform: scale(1.38); } // 缩小后覆盖全屏
}

.pf-layer--mid {
  z-index: 1;
  .pf-layer__img { transform: scale(1); }
}

.pf-layer--fg {
  z-index: 3;
  .pf-layer__img { transform: scale(0.74); } // 放大1.35后再缩小显示
}

.pf-layer__img {
  width: 100%; height: 100%;
  object-fit: cover;
}

/* ── 文字 ── */
.pf-frame__caption { position: absolute; left: max(5vw,24px); bottom: 12vh; z-index: 20; max-width: min(75vw, 540px); will-change: transform,opacity; }
.pf-frame__num { display: inline-flex; align-items: center; height: 1.6rem; padding: 0 .8rem; border-radius: 999px; background: rgba(255,255,255,.5); backdrop-filter: blur(12px); border: 1px solid rgba(255,150,120,.3); font-size: .62rem; font-weight: 700; letter-spacing: .15em; text-transform: uppercase; color: #c86840; }
.pf-frame__title { margin: .6rem 0 0; font-size: clamp(2rem, 5.2vw, 4rem); font-weight: 900; line-height: 1.1; color: #3d1400; text-shadow: 0 2px 10px rgba(255,255,255,.65), 0 0 40px rgba(255,150,120,.35); }
.pf-frame__desc { margin: .4rem 0 0; font-size: clamp(.8rem, 1.25vw, .96rem); line-height: 1.6; color: rgba(80,20,5,.65); text-shadow: 0 1px 5px rgba(255,255,255,.45); }

.pf-progress { position: absolute; left: 0; bottom: 0; z-index: 30; width: 100%; height: 3px; background: rgba(255,150,120,.06); }
.pf-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #e87050, #d49560, #a0c8e8, #e87050); background-size: 200% 100%; box-shadow: 0 0 12px rgba(220,130,90,.5); }

@media (max-width: 768px) {
  .pf-header { top: 2vh; } .pf-kicker { font-size: .54rem; padding: .2rem .65rem; } .pf-title__w { font-size: 1.7rem; }
  .pf-depth-indicator { right: 1vw; gap: 14px; } .pf-depth-indicator__layer { font-size: .5rem; padding: .4rem .25rem; }
  .pf-frame__caption { bottom: 9vh; } .pf-frame__title { font-size: 1.45rem; color: #4a1800; }
}
</style>
