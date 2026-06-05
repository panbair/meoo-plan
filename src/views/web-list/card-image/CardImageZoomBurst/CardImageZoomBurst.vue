<template>
  <section ref="rootRef" class="zb-root">
    <!-- 动态背景光晕 -->
    <div ref="bgOrbA" class="zb-bg-orb zb-bg-orb--a"></div>
    <div ref="bgOrbB" class="zb-bg-orb zb-bg-orb--b"></div>
    <div ref="bgOrbC" class="zb-bg-orb zb-bg-orb--c"></div>

    <!-- 粒子画布 -->
    <canvas ref="canvasRef" class="zb-particles"></canvas>

    <!-- 滚动容器 -->
    <div ref="scrollRef" class="zb-scroll">
      <div ref="trackRef" class="zb-track" :style="{ height: trackHeight }">
        <div class="zb-sticky">

          <!-- 标题区 -->
          <header ref="headerRef" class="zb-header">
            <span class="zb-kicker">Zoom Burst · 镜头爆发</span>
            <h1 class="zb-title">缩放迸裂</h1>
            <div ref="headerLineRef" class="zb-header-line"></div>
            <p class="zb-subtitle">向下滚动 — 镜头从微缩画面拉远，每一帧从 50×50 爆发至全屏</p>
          </header>

          <!-- 图片舞台 -->
          <div class="zb-stage">
            <!-- 中心瞄准框 -->
            <div ref="crosshairRef" class="zb-crosshair">
              <span class="zb-crosshair__line zb-crosshair__line--t"></span>
              <span class="zb-crosshair__line zb-crosshair__line--r"></span>
              <span class="zb-crosshair__line zb-crosshair__line--b"></span>
              <span class="zb-crosshair__line zb-crosshair__line--l"></span>
              <span class="zb-crosshair__dot"></span>
            </div>

            <article
              v-for="(frame, idx) in frames"
              :key="frame.id"
              :ref="(el) => setFrameRef(el, idx)"
              class="zb-frame"
            >
              <div
                :ref="(el) => setFrameInnerRef(el, idx)"
                class="zb-frame__inner"
              >
                <img
                  :ref="(el) => setImgRef(el, idx)"
                  class="zb-frame__img"
                  :src="frame.image"
                  :alt="frame.alt"
                  loading="lazy"
                />
                <div
                  :ref="(el) => setOverlayRef(el, idx)"
                  class="zb-frame__overlay"
                ></div>
              </div>
              <div
                :ref="(el) => setCaptionRef(el, idx)"
                class="zb-frame__caption"
              >
                <span class="zb-frame__index">{{ frame.label }}</span>
                <h2 class="zb-frame__title">{{ frame.title }}</h2>
                <p class="zb-frame__desc">{{ frame.description }}</p>
              </div>
            </article>
          </div>

          <!-- 底部进度 -->
          <div class="zb-progress-bar">
            <div ref="progressFillRef" class="zb-progress-bar__fill"></div>
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

// ═══════════════════════════════════════════════════════════
//  CardImageZoomBurst — 镜头爆发·缩放迸裂
//
//  核心动画：
//  1. 每帧图片从 50×50px 的中心小框开始
//  2. 用户竖滚 → 镜头拉远，图片从小框爆发缩放至屏幕 80%
//  3. 达到峰值后淡出，下一帧接力爆发
//  4. 中心十字瞄准线随滚动节奏脉动
//  5. Canvas 粒子在爆发瞬间喷射
//  6. 青春时尚配色：珊瑚橙→电光紫→荧光青
// ═══════════════════════════════════════════════════════════

type TweenCleanup = () => void

interface ZoomFrame {
  id: string
  label: string
  title: string
  description: string
  image: string
  alt: string
}

const frames: ZoomFrame[] = [
  {
    id: 'coral-sunrise',
    label: 'Frame 01',
    title: '珊瑚破晓',
    description: '炽热珊瑚色从微缩画面中炸裂而出，第一束光撕裂暗夜。',
    image: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=1920&q=80',
    alt: '珊瑚色日出海岸，金色阳光穿透云层',
  },
  {
    id: 'electric-bloom',
    label: 'Frame 02',
    title: '电光花海',
    description: '紫电般的花簇从 50×50 的方寸之间涌出，色彩奔涌如瀑布。',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1920&q=80',
    alt: '高饱和紫粉色花朵特写，散景效果绚丽',
  },
  {
    id: 'neon-wave',
    label: 'Frame 03',
    title: '霓虹浪峰',
    description: '青蓝海浪冲破画框束缚，荧光滑过每一道波纹。',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80',
    alt: '青绿色海浪近景，阳光穿透水面',
  },
  {
    id: 'golden-plume',
    label: 'Frame 04',
    title: '金羽飞扬',
    description: '金色光羽从微观画框中挣脱，漫天飞舞如凤凰涅槃。',
    image: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=1920&q=80',
    alt: '金色夕阳下层层山脊剪影',
  },
  {
    id: 'aurora-drift',
    label: 'Frame 05',
    title: '极光漂流',
    description: '极光般的色彩在画面中流淌，从方寸之间铺满整个视界。',
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1920&q=80',
    alt: '极光在夜空中舞动，绿色紫色交织',
  },
]

const FRAME_COUNT = frames.length
const trackHeight = `${(FRAME_COUNT + 1) * 100}vh`

// ── Refs ─────────────────────────────────────────────
const rootRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const headerLineRef = ref<HTMLElement | null>(null)
const crosshairRef = ref<HTMLElement | null>(null)
const progressFillRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const bgOrbA = ref<HTMLElement | null>(null)
const bgOrbB = ref<HTMLElement | null>(null)
const bgOrbC = ref<HTMLElement | null>(null)

const frameRefs = ref<HTMLElement[]>([])
const frameInnerRefs = ref<HTMLElement[]>([])
const imgRefs = ref<HTMLImageElement[]>([])
const overlayRefs = ref<HTMLElement[]>([])
const captionRefs = ref<HTMLElement[]>([])

const setFrameRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) frameRefs.value[i] = el }
const setFrameInnerRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) frameInnerRefs.value[i] = el }
const setImgRef = (el: Element | null, i: number) => { if (el instanceof HTMLImageElement) imgRefs.value[i] = el }
const setOverlayRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) overlayRefs.value[i] = el }
const setCaptionRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) captionRefs.value[i] = el }

const cleanupFns: TweenCleanup[] = []

// ── Canvas 粒子系统 ──────────────────────────────────
let particleAnimId = 0
let canvasCtx: CanvasRenderingContext2D | null = null
let canvasW = 0
let canvasH = 0

interface Particle {
  x: number; y: number; vx: number; vy: number
  r: number; alpha: number; life: number; maxLife: number
  hue: number
}

const particles: Particle[] = []
const MAX_PARTICLES = 80

function spawnBurst(centerX: number, centerY: number, count: number, hueRange: [number, number]) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2
    const speed = 1.5 + Math.random() * 5
    particles.push({
      x: centerX,
      y: centerY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: 1.5 + Math.random() * 3.5,
      alpha: 0.7 + Math.random() * 0.3,
      life: 0,
      maxLife: 40 + Math.random() * 60,
      hue: hueRange[0] + Math.random() * (hueRange[1] - hueRange[0]),
    })
  }
  // 裁剪超出上限的粒子
  while (particles.length > MAX_PARTICLES) {
    particles.shift()
  }
}

function initCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return
  canvasCtx = canvas.getContext('2d')
  if (!canvasCtx) return

  const resize = () => {
    canvasW = window.innerWidth
    canvasH = window.innerHeight
    canvas.width = canvasW
    canvas.height = canvasH
  }
  resize()
  window.addEventListener('resize', resize)
  cleanupFns.push(() => window.removeEventListener('resize', resize))

  function animate() {
    if (!canvasCtx) return
    canvasCtx.clearRect(0, 0, canvasW, canvasH)

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]
      p.life++
      if (p.life >= p.maxLife) { particles.splice(i, 1); continue }

      const t = p.life / p.maxLife
      const fade = t > 0.6 ? 1 - (t - 0.6) / 0.4 : 1
      p.x += p.vx
      p.y += p.vy
      p.vx *= 0.98
      p.vy *= 0.98

      canvasCtx!.beginPath()
      canvasCtx!.arc(p.x, p.y, p.r * fade, 0, Math.PI * 2)
      canvasCtx!.fillStyle = `hsla(${p.hue}, 90%, 65%, ${p.alpha * fade})`
      canvasCtx!.fill()
    }

    particleAnimId = requestAnimationFrame(animate)
  }
  particleAnimId = requestAnimationFrame(animate)
}

// ── 入场动画 ─────────────────────────────────────────
function setupEntrance() {
  if (!scrollRef.value || !headerRef.value || !headerLineRef.value) return

  const entranceTl = gsap.timeline({
    scrollTrigger: {
      trigger: scrollRef.value,
      scroller: scrollRef.value,
      start: 'top 78%',
      toggleActions: 'play none none reverse',
    },
  })

  entranceTl
    .fromTo(headerRef.value, { autoAlpha: 0, y: 48 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out' })
    .fromTo(headerLineRef.value, { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: 'power3.inOut' }, '-=0.4')
    .fromTo(crosshairRef.value, { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.65, ease: 'back.out(1.7)' }, '-=0.3')

  cleanupFns.push(() => {
    entranceTl.scrollTrigger?.kill()
    entranceTl.kill()
  })
}

// ── 核心：缩放爆发动画 ──────────────────────────────
function setupZoomBurst() {
  if (!scrollRef.value || !trackRef.value) return

  const scroller = scrollRef.value
  const track = trackRef.value
  const frames_ = frameRefs.value
  const inners = frameInnerRefs.value
  const images = imgRefs.value
  const overlays = overlayRefs.value
  const captions = captionRefs.value

  if (!frames_.length || !inners.length || !images.length || !overlays.length || !captions.length) return

  // ── 初始化所有帧的初始状态 ──
  frames_.forEach((frame, i) => {
    // 所有帧都绝对定位在舞台中央
    gsap.set(frame, { position: 'absolute', inset: 0, zIndex: FRAME_COUNT - i })

    if (i === 0) {
      // 第一帧：可见，但内层缩小为 50×50
      gsap.set(frame, { autoAlpha: 1 })
      gsap.set(inners[i], {
        width: 50,
        height: 50,
        borderRadius: 4,
        overflow: 'hidden',
        position: 'absolute',
        top: '50%',
        left: '50%',
        xPercent: -50,
        yPercent: -50,
      })
      gsap.set(images[i], { scale: 1, filter: 'brightness(1.1) saturate(1.3)' })
      gsap.set(overlays[i], { opacity: 0 })
      gsap.set(captions[i], { autoAlpha: 0, y: 40 })
    } else {
      // 其他帧：完全隐藏，内层也缩成 50×50
      gsap.set(frame, { autoAlpha: 0 })
      gsap.set(inners[i], {
        width: 50,
        height: 50,
        borderRadius: 4,
        overflow: 'hidden',
        position: 'absolute',
        top: '50%',
        left: '50%',
        xPercent: -50,
        yPercent: -50,
      })
      gsap.set(images[i], { scale: 1 })
      gsap.set(overlays[i], { opacity: 0 })
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

  // ── 每个帧的爆发序列 ──
  frames_.forEach((_frame, i) => {
    const offset = i // 每帧占 1 个 scrub 单位
    const inner = inners[i]
    const img = images[i]
    const overlay = overlays[i]
    const caption = captions[i]
    const nextInner = inners[i + 1]
    const nextCaption = captions[i + 1]
    const nextFrame = frames_[i + 1]

    // Phase A: 内层从 50×50 爆发放大到屏幕 80%（持续 0.55）
    masterTl
      .to(inner, {
        width: '80vw',
        height: '80vh',
        borderRadius: 20,
        duration: 0.55,
        ease: 'power3.out',
      }, offset)
      .to(img, {
        scale: 1.08,
        filter: 'brightness(1.15) saturate(1.35)',
        duration: 0.55,
        ease: 'power2.out',
      }, offset)
      .to(overlay, {
        opacity: 0.35,
        duration: 0.4,
      }, offset + 0.1)

    // Phase B: 标题文字淡入
    masterTl.to(caption, {
      autoAlpha: 1,
      y: 0,
      duration: 0.35,
      ease: 'power2.out',
    }, offset + 0.18)

    // Phase C: 爆发达到峰值后开始淡出，同时下一帧准备
    if (nextInner && nextFrame && nextCaption) {
      // 当前帧淡出
      masterTl
        .to(inner, {
          width: '95vw',
          height: '95vh',
          borderRadius: 28,
          duration: 0.3,
        }, offset + 0.55)
        .to(img, {
          scale: 1.18,
          filter: 'brightness(1.5) saturate(1.8) blur(3px)',
          duration: 0.3,
        }, offset + 0.55)
        .to(overlay, {
          opacity: 0.7,
          duration: 0.25,
        }, offset + 0.55)
        .to(caption, {
          autoAlpha: 0,
          y: -20,
          duration: 0.2,
        }, offset + 0.58)
        .to(_frame, {
          autoAlpha: 0,
          duration: 0.22,
        }, offset + 0.62)

      // 下一帧出现（内层已是 50×50）
      masterTl
        .to(nextFrame, {
          autoAlpha: 1,
          duration: 0.15,
        }, offset + 0.62)
    } else if (i === frames_.length - 1) {
      // 最后一帧：停留在 80% 状态，轻微呼吸
      masterTl
        .to(inner, {
          width: '84vw',
          height: '84vh',
          duration: 0.3,
        }, offset + 0.55)
        .to(inner, {
          width: '80vw',
          height: '80vh',
          duration: 0.3,
        }, offset + 0.7)
    }
  })

  // ── 中心十字线动画 ──
  if (crosshairRef.value) {
    masterTl
      .to(crosshairRef.value, { scale: 1.15, borderColor: 'rgba(255,255,255,0.9)', duration: 0.3 }, 0)
      .to(crosshairRef.value, { scale: 1, borderColor: 'rgba(255,255,255,0.5)', duration: 0.3 }, 0.3)
      .to(crosshairRef.value, { scale: 1.15, borderColor: 'rgba(255,255,255,0.9)', duration: 0.3 }, 1)
      .to(crosshairRef.value, { scale: 1, borderColor: 'rgba(255,255,255,0.5)', duration: 0.3 }, 1.3)
      .to(crosshairRef.value, { scale: 1.15, borderColor: 'rgba(255,255,255,0.9)', duration: 0.3 }, 2)
      .to(crosshairRef.value, { scale: 1, borderColor: 'rgba(255,255,255,0.5)', duration: 0.3 }, 2.3)
      .to(crosshairRef.value, { scale: 1.15, borderColor: 'rgba(255,255,255,0.9)', duration: 0.3 }, 3)
      .to(crosshairRef.value, { scale: 1, borderColor: 'rgba(255,255,255,0.5)', duration: 0.3 }, 3.3)
      .to(crosshairRef.value, { autoAlpha: 0, scale: 1.5, duration: 0.25 }, 4)
  }

  // ── 背景光晕色相轮转 ──
  if (bgOrbA.value && bgOrbB.value && bgOrbC.value) {
    masterTl
      .to(bgOrbA.value, { x: '15vw', y: '10vh', scale: 1.2, duration: 5 }, 0)
      .to(bgOrbB.value, { x: '-10vw', y: '-5vh', scale: 1.3, duration: 5 }, 0)
      .to(bgOrbC.value, { x: '8vw', y: '-12vh', scale: 1.15, duration: 5 }, 0)
  }

  // ── 进度条 ──
  if (progressFillRef.value) {
    masterTl.to(progressFillRef.value, { width: '100%', duration: FRAME_COUNT }, 0)
  }

  // ── 粒子爆发回调 ──
  const burstHues: [number, number][] = [
    [10, 35],   // 珊瑚橙
    [270, 310], // 电光紫
    [170, 200], // 荧光青
    [35, 55],   // 金琥珀
    [140, 170], // 极光绿
  ]

  frames_.forEach((_frame, i) => {
    const stBurst = ScrollTrigger.create({
      trigger: track,
      scroller,
      start: `${(i / FRAME_COUNT) * 100}% top`,
      onEnter: () => {
        spawnBurst(canvasW / 2, canvasH / 2, 25, burstHues[i] || [10, 35])
      },
    })
    cleanupFns.push(() => stBurst.kill())
  })

  cleanupFns.push(() => {
    masterTl.scrollTrigger?.kill()
    masterTl.kill()
  })
}

// ── 生命周期 ─────────────────────────────────────────
function handleResize() {
  ScrollTrigger.refresh(true)
}

onMounted(() => {
  initCanvas()
  // 延迟确保 DOM 完全就绪
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      setupEntrance()
      setupZoomBurst()
    })
  })
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  cancelAnimationFrame(particleAnimId)
  // 清除所有 ScrollTrigger
  ScrollTrigger.getAll().forEach((st) => st.kill())
  // 执行清理函数
  cleanupFns.forEach((fn) => fn())
  cleanupFns.length = 0
  // 清空粒子
  particles.length = 0
})
</script>

<style scoped lang="scss">
/* ═══════════════════════════════════════════════════════
   Zoom Burst — 镜头爆发·缩放迸裂
   类名前缀: zb-
   ═══════════════════════════════════════════════════════ */

/* ── 根容器 ── */
.zb-root {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #0f0c29 0%, #1a1040 30%, #302b63 60%, #24243e 100%);
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, -apple-system, sans-serif;
}

/* ── 背景光晕 ── */
.zb-bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  will-change: transform;
  z-index: 0;
}

.zb-bg-orb--a {
  width: 40vw;
  height: 40vw;
  top: -10vh;
  left: -8vw;
  background: radial-gradient(circle, rgba(255, 107, 53, 0.55) 0%, transparent 70%);
  animation: zb-orb-float-a 8s ease-in-out infinite;
}

.zb-bg-orb--b {
  width: 35vw;
  height: 35vw;
  bottom: -12vh;
  right: -6vw;
  background: radial-gradient(circle, rgba(138, 43, 226, 0.5) 0%, transparent 70%);
  animation: zb-orb-float-b 10s ease-in-out infinite;
}

.zb-bg-orb--c {
  width: 28vw;
  height: 28vw;
  top: 40vh;
  left: 50vw;
  background: radial-gradient(circle, rgba(0, 255, 255, 0.4) 0%, transparent 70%);
  animation: zb-orb-float-c 9s ease-in-out infinite;
}

@keyframes zb-orb-float-a {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(5vw, 8vh) scale(1.15); }
  66% { transform: translate(-3vw, -5vh) scale(0.9); }
}

@keyframes zb-orb-float-b {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(-4vw, -6vh) scale(1.2); }
  66% { transform: translate(3vw, 4vh) scale(0.85); }
}

@keyframes zb-orb-float-c {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-6vw, -8vh) scale(1.25); }
}

/* ── Canvas 粒子 ── */
.zb-particles {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

/* ── 滚动容器 ── */
.zb-scroll {
  position: relative;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior-y: auto;
  z-index: 2;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.18);
    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }
}

.zb-track {
  position: relative;
  width: 100%;
}

.zb-sticky {
  position: sticky;
  top: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

/* ── 标题区 ── */
.zb-header {
  position: absolute;
  top: 3.5vh;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  text-align: center;
  width: min(90vw, 820px);
}

.zb-kicker {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  padding: 0.35rem 1.2rem;
  margin-bottom: 0.8rem;
}

.zb-title {
  margin: 0;
  font-size: clamp(2rem, 5.5vw, 4rem);
  font-weight: 900;
  letter-spacing: 0.04em;
  background: linear-gradient(135deg, #ff6b6b, #ffa235, #c471f5, #40e0d0);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: zb-title-shimmer 4s ease-in-out infinite;
  text-shadow: none;
  line-height: 1.1;
}

@keyframes zb-title-shimmer {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.zb-header-line {
  width: 70px;
  height: 2.5px;
  margin: 0.6rem auto 0.8rem;
  border-radius: 2px;
  background: linear-gradient(90deg, transparent, #ffa235, #c471f5, transparent);
  transform-origin: center;
}

.zb-subtitle {
  margin: 0;
  font-size: clamp(0.8rem, 1.3vw, 0.95rem);
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.65);
  max-width: 500px;
  margin-inline: auto;
}

/* ── 舞台 ── */
.zb-stage {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

/* ── 中心十字瞄准线 ── */
.zb-crosshair {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 58px;
  height: 58px;
  z-index: 30;
  pointer-events: none;
  will-change: transform, opacity, border-color;
}

.zb-crosshair__line {
  position: absolute;
  background: rgba(255, 255, 255, 0.7);
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.4);
}

.zb-crosshair__line--t {
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 1.5px;
  height: 16px;
}

.zb-crosshair__line--r {
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  width: 16px;
  height: 1.5px;
}

.zb-crosshair__line--b {
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 1.5px;
  height: 16px;
}

.zb-crosshair__line--l {
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: 16px;
  height: 1.5px;
}

.zb-crosshair__dot {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.9), 0 0 24px rgba(255, 150, 50, 0.6);
}

/* ── 帧容器 ── */
.zb-frame {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  will-change: opacity;
}

.zb-frame__inner {
  will-change: width, height, border-radius;
  box-shadow:
    0 0 60px rgba(255, 107, 53, 0.25),
    0 0 120px rgba(138, 43, 226, 0.2),
    0 20px 60px rgba(0, 0, 0, 0.4);
}

.zb-frame__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  will-change: transform, filter;
  transform-origin: center center;
}

.zb-frame__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 107, 53, 0.25) 0%,
    rgba(138, 43, 226, 0.2) 40%,
    rgba(0, 255, 255, 0.2) 100%
  );
  mix-blend-mode: screen;
  pointer-events: none;
  will-change: opacity;
}

/* ── 帧文字 ── */
.zb-frame__caption {
  position: absolute;
  left: max(5vw, 24px);
  bottom: 10vh;
  z-index: 25;
  max-width: min(80vw, 620px);
  will-change: transform, opacity;
}

.zb-frame__index {
  display: inline-flex;
  align-items: center;
  height: 1.75rem;
  padding: 0 0.85rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #fff;
}

.zb-frame__title {
  margin: 0.75rem 0 0;
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 900;
  line-height: 1.1;
  color: #fff;
  text-shadow: 0 4px 30px rgba(0, 0, 0, 0.5), 0 0 80px rgba(255, 255, 255, 0.2);
}

.zb-frame__desc {
  margin: 0.6rem 0 0;
  font-size: clamp(0.85rem, 1.4vw, 1.05rem);
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
}

/* ── 进度条 ── */
.zb-progress-bar {
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 30;
  width: 100%;
  height: 3px;
  background: rgba(255, 255, 255, 0.08);
}

.zb-progress-bar__fill {
  width: 0;
  height: 100%;
  background: linear-gradient(
    90deg,
    #ff6b6b 0%,
    #ffa235 25%,
    #c471f5 50%,
    #40e0d0 75%,
    #ff6b6b 100%
  );
  background-size: 200% 100%;
  box-shadow: 0 0 14px rgba(255, 162, 53, 0.6);
}

/* ── 响应式 ── */
@media (max-width: 768px) {
  .zb-header {
    top: 2.5vh;
  }

  .zb-kicker {
    font-size: 0.6rem;
    padding: 0.3rem 0.9rem;
  }

  .zb-crosshair {
    width: 40px;
    height: 40px;
  }

  .zb-crosshair__line--t,
  .zb-crosshair__line--b {
    height: 10px;
  }

  .zb-crosshair__line--r,
  .zb-crosshair__line--l {
    width: 10px;
  }

  .zb-frame__caption {
    bottom: 7vh;
  }

  .zb-frame__title {
    font-size: 1.6rem;
  }
}
</style>
