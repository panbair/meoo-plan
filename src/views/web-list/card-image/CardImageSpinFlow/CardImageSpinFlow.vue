<template>
  <section ref="rootRef" class="sf2-root">
    <!-- 螺旋光斑 -->
    <div ref="spiralA" class="sf2-spiral sf2-spiral--a"></div>
    <div ref="spiralB" class="sf2-spiral sf2-spiral--b"></div>
    <div ref="spiralC" class="sf2-spiral sf2-spiral--c"></div>

    <!-- 旋转粒子画布 -->
    <canvas ref="canvasRef" class="sf2-canvas"></canvas>

    <!-- 滚动容器 -->
    <div ref="scrollRef" class="sf2-scroll">
      <div ref="trackRef" class="sf2-track" :style="{ height: trackHeight }">
        <div class="sf2-sticky">

          <!-- 标题 -->
          <header ref="headerRef" class="sf2-header">
            <div ref="ringL" class="sf2-ring sf2-ring--l"></div>
            <div ref="ringR" class="sf2-ring sf2-ring--r"></div>
            <span class="sf2-kicker">⟳ Spin Flow · 旋转流动 ⟳</span>
            <h1 class="sf2-title">
              <span ref="tw1" class="sf2-title__w">旋</span>
              <span ref="tw2" class="sf2-title__w sf2-title__w--hot">转</span>
              <span ref="tw3" class="sf2-title__w">流</span>
              <span ref="tw4" class="sf2-title__w sf2-title__w--hot">动</span>
            </h1>
            <div ref="lineRef" class="sf2-line"></div>
            <p class="sf2-sub">向下滚动 · 图片旋转流动 · 如漩涡般令人着迷</p>
          </header>

          <!-- 中心涡旋指示 -->
          <div ref="vortexRef" class="sf2-vortex">
            <div class="sf2-vortex__ring" v-for="n in 3" :key="n"></div>
            <div class="sf2-vortex__core"></div>
          </div>

          <!-- 图片舞台 -->
          <div class="sf2-stage">
            <article
              v-for="(frame, idx) in frames"
              :key="frame.id"
              :ref="(el) => setFrameRef(el, idx)"
              class="sf2-frame"
            >
              <img
                :ref="(el) => setImgRef(el, idx)"
                class="sf2-frame__img"
                :src="frame.image"
                :alt="frame.alt"
                loading="lazy"
              />
              <div
                :ref="(el) => setGlowRef(el, idx)"
                class="sf2-frame__glow"
              ></div>
              <div
                :ref="(el) => setCaptionRef(el, idx)"
                class="sf2-frame__caption"
              >
                <span class="sf2-frame__num">{{ frame.label }}</span>
                <h2 class="sf2-frame__title">{{ frame.title }}</h2>
                <p class="sf2-frame__desc">{{ frame.description }}</p>
              </div>
            </article>
          </div>

          <div class="sf2-progress"><div ref="progRef" class="sf2-progress__fill"></div></div>
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
//  CardImageSpinFlow — 旋转流动
//
//  核心概念：图片如漩涡般旋转流动
//  1. 旋转 (rotation) — 图片绕中心旋转，顺逆交替
//  2. 偏移 (x)       — 伴随旋转的水平位移
//  3. 缩放 (scale)   — 旋转同时呼吸缩放
//  4. 清晰度         — 模糊→清晰→模糊过场
//  5. Canvas 螺旋粒子 — 围绕中心旋转的粒子流
//
//  青春时尚配色：珊瑚红 · 柑橘橙 · 蜜桃粉 · 日光金
// ═══════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

interface SpinFrame {
  id: string; label: string; title: string; description: string
  image: string; alt: string
}

const frames: SpinFrame[] = [
  {
    id: 'coral-twirl', label: 'Frame 01', title: '珊瑚旋转',
    description: '珊瑚色的画面从远方旋转而来，如同优雅的芭蕾舞者。',
    image: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=1920&q=80',
    alt: '珊瑚色日落海岸',
  },
  {
    id: 'tangerine-spin', label: 'Frame 02', title: '柑橘漩涡',
    description: '明亮的橘色中，画面如漩涡般旋转流动，充满活力。',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80',
    alt: '金色阳光麦田',
  },
  {
    id: 'peach-orbit', label: 'Frame 03', title: '蜜桃轨道',
    description: '蜜桃色的温暖画面沿轨道旋转，柔和而又灵动。',
    image: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=1920&q=80',
    alt: '云隙光照亮山脊',
  },
  {
    id: 'golden-whirl', label: 'Frame 04', title: '金色回旋',
    description: '金色阳光中画面快速回旋，释放出耀眼的生命力。',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80',
    alt: '金色山谷俯瞰',
  },
  {
    id: 'sunset-vortex', label: 'Frame 05', title: '落日涡流',
    description: '落日时分，画面在最后一道光中完成绝美的旋转。',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80',
    alt: '落日森林光影',
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
const ringL = ref<HTMLElement | null>(null)
const ringR = ref<HTMLElement | null>(null)
const tw1 = ref<HTMLElement | null>(null); const tw2 = ref<HTMLElement | null>(null)
const tw3 = ref<HTMLElement | null>(null); const tw4 = ref<HTMLElement | null>(null)
const vortexRef = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const spiralA = ref<HTMLElement | null>(null)
const spiralB = ref<HTMLElement | null>(null)
const spiralC = ref<HTMLElement | null>(null)

const frameRefs = ref<HTMLElement[]>([])
const imgRefs = ref<HTMLImageElement[]>([])
const glowRefs = ref<HTMLElement[]>([])
const captionRefs = ref<HTMLElement[]>([])

const setFrameRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) frameRefs.value[i] = el }
const setImgRef = (el: Element | null, i: number) => { if (el instanceof HTMLImageElement) imgRefs.value[i] = el }
const setGlowRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) glowRefs.value[i] = el }
const setCaptionRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) captionRefs.value[i] = el }

const cleanupFns: TweenCleanup[] = []

// ═════════════════════════════════════════════════════════════
//  Canvas 螺旋粒子
// ═════════════════════════════════════════════════════════════
interface OrbitParticle {
  angle: number; radius: number; speed: number
  size: number; alpha: number; hue: number
  centerX: number; centerY: number
}

let ctx: CanvasRenderingContext2D | null = null
let cw = 0; let ch = 0
const particles: OrbitParticle[] = []
let animId = 0
const MAX_P = 200; const BASE_P = 90

function createOrbitParticle(): OrbitParticle {
  return {
    angle: Math.random() * Math.PI * 2,
    radius: 60 + Math.random() * Math.min(cw, ch) * 0.55,
    speed: 0.003 + Math.random() * 0.012,
    size: 1.5 + Math.random() * 3.5,
    alpha: 0.25 + Math.random() * 0.5,
    hue: [10, 25, 35, 45, 55][Math.floor(Math.random() * 5)],
    centerX: cw * 0.5, centerY: ch * 0.5,
  }
}

function orbitBurst(count: number) {
  for (let i = 0; i < count; i++) {
    const p = createOrbitParticle()
    p.radius = 40 + Math.random() * 150
    p.alpha = 0.5 + Math.random() * 0.5
    p.size = 3 + Math.random() * 6
    particles.push(p)
  }
  while (particles.length > MAX_P) particles.shift()
}

function initCanvas() {
  const c = canvasRef.value; if (!c) return
  ctx = c.getContext('2d'); if (!ctx) return

  const resize = () => { cw = window.innerWidth; ch = window.innerHeight; c.width = cw; c.height = ch }
  resize()
  window.addEventListener('resize', resize)
  cleanupFns.push(() => window.removeEventListener('resize', resize))

  for (let i = 0; i < BASE_P; i++) particles.push(createOrbitParticle())

  function animate() {
    if (!ctx) return
    ctx.clearRect(0, 0, cw, ch)

    while (particles.length < BASE_P) particles.push(createOrbitParticle())

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]
      p.angle += p.speed
      p.radius += 0.15 // 缓慢向外螺旋
      if (p.radius > Math.min(cw, ch) * 0.6) { particles.splice(i, 1); continue }

      p.centerX = cw * 0.5 + Math.cos(Date.now() * 0.0003) * 20
      p.centerY = ch * 0.5 + Math.sin(Date.now() * 0.0003) * 20

      const x = p.centerX + Math.cos(p.angle) * p.radius
      const y = p.centerY + Math.sin(p.angle) * p.radius

      // 拖尾
      const tailAngle = p.angle - 0.15
      const tx = p.centerX + Math.cos(tailAngle) * p.radius
      const ty = p.centerY + Math.sin(tailAngle) * p.radius

      const grad = ctx!.createLinearGradient(x, y, tx, ty)
      grad.addColorStop(0, `hsla(${p.hue}, 90%, 75%, ${p.alpha})`)
      grad.addColorStop(1, `hsla(${p.hue}, 70%, 55%, 0)`)

      ctx!.beginPath()
      ctx!.moveTo(x, y)
      ctx!.lineTo(tx, ty)
      ctx!.strokeStyle = grad
      ctx!.lineWidth = p.size
      ctx!.lineCap = 'round'
      ctx!.stroke()

      // 亮点
      ctx!.beginPath()
      ctx!.arc(x, y, p.size * 0.6, 0, Math.PI * 2)
      ctx!.fillStyle = `hsla(${p.hue}, 100%, 85%, ${p.alpha * 1.3})`
      ctx!.fill()
    }
    animId = requestAnimationFrame(animate)
  }
  animId = requestAnimationFrame(animate)
}

// ═════════════════════════════════════════════════════════════
//  入场
// ═════════════════════════════════════════════════════════════
function setupEntrance() {
  if (!scrollRef.value || !headerRef.value || !vortexRef.value) return

  const tl = gsap.timeline({
    scrollTrigger: { trigger: scrollRef.value, scroller: scrollRef.value, start: 'top 75%', toggleActions: 'play none none reverse' },
  })

  const chars = [tw1.value, tw2.value, tw3.value, tw4.value]
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 55 }, { autoAlpha: 1, y: 0, duration: 0.85, ease: 'power3.out' })
    .fromTo(chars, { autoAlpha: 0, y: 35, scale: 0.3, rotation: -20 }, {
      autoAlpha: 1, y: 0, scale: 1, rotation: 0, duration: 0.6, stagger: 0.08, ease: 'back.out(2.3)',
    }, '-=0.45')
    .fromTo(lineRef.value, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power3.inOut' }, '-=0.25')
    .fromTo(vortexRef.value, { autoAlpha: 0, scale: 0, rotation: -90 }, {
      autoAlpha: 1, scale: 1, rotation: 0, duration: 0.7, ease: 'back.out(2)',
    }, '-=0.35')
    .fromTo([ringL.value, ringR.value], { autoAlpha: 0, scale: 0, rotation: -45 }, {
      autoAlpha: 1, scale: 1, rotation: 0, duration: 0.55, stagger: 0.06, ease: 'back.out(1.8)',
    }, '-=0.3')

  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

// ═════════════════════════════════════════════════════════════
//  核心：旋转流动
// ═════════════════════════════════════════════════════════════
function setupSpinFlow() {
  if (!scrollRef.value || !trackRef.value) return

  const scroller = scrollRef.value
  const track = trackRef.value
  const frames_ = frameRefs.value
  const images = imgRefs.value
  const glows = glowRefs.value
  const captions = captionRefs.value

  if (!frames_.length || !images.length || !glows.length || !captions.length) return

  // ── 初始状态 ──
  frames_.forEach((frame, i) => {
    gsap.set(frame, { position: 'absolute', inset: 0, zIndex: FRAME_COUNT - i })
    if (i === 0) {
      gsap.set(frame, { autoAlpha: 1 })
      gsap.set(images[i], { rotation: 0, x: 0, scale: 1, filter: 'brightness(1.06) saturate(1.12) contrast(1.02) blur(0px)' })
      gsap.set(glows[i], { opacity: 0.12, rotation: 0 })
      gsap.set(captions[i], { autoAlpha: 1, y: 0 })
    } else {
      gsap.set(frame, { autoAlpha: 0 })
      gsap.set(images[i], { rotation: 15, x: 70, scale: 0.75, filter: 'brightness(2.2) saturate(0.5) contrast(1.2) blur(15px)' })
      gsap.set(glows[i], { opacity: 0.7, rotation: 30 })
      gsap.set(captions[i], { autoAlpha: 0, y: 40 })
    }
  })

  // ── 主时间线 ──
  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.25 },
  })

  frames_.forEach((_frame, i) => {
    const o = i
    const img = images[i]
    const glow = glows[i]
    const cap = captions[i]

    // 🌪 Phase A: 旋转入场 (0 → 0.4)
    master
      .to(img, { rotation: 0, x: 0, scale: 1, filter: 'brightness(1.06) saturate(1.12) contrast(1.02) blur(0px)', duration: 0.4, ease: 'power3.out' }, o)
      .to(glow, { opacity: 0.12, rotation: 0, duration: 0.4, ease: 'power2.out' }, o)
      .to(cap, { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power3.out' }, o + 0.13)

    // 🌪 Phase B: 旋转舞蹈 (0.4 → 0.6) — 顺逆交替旋转
    master
      .to(img, { rotation: -5, duration: 0.06, ease: 'sine.inOut' }, o + 0.4)
      .to(img, { rotation: 4, duration: 0.07, ease: 'sine.inOut' }, o + 0.46)
      .to(img, { rotation: 0, duration: 0.07, ease: 'sine.inOut' }, o + 0.53)
      .to(img, { scale: 1.05, duration: 0.09, ease: 'sine.inOut' }, o + 0.42)
      .to(img, { scale: 1, duration: 0.11, ease: 'sine.inOut' }, o + 0.51)
      .to(glow, { opacity: 0.25, rotation: -8, duration: 0.08 }, o + 0.42)
      .to(glow, { opacity: 0.12, rotation: 0, duration: 0.12 }, o + 0.5)

    // 🌪 Phase C: 旋转退场 (0.6 → 0.8)
    master
      .to(img, { rotation: -14, x: -65, scale: 0.78, filter: 'brightness(2.5) saturate(0.4) contrast(1.3) blur(14px)', duration: 0.24, ease: 'power3.in' }, o + 0.6)
      .to(glow, { opacity: 0.65, rotation: -25, duration: 0.22, ease: 'power2.in' }, o + 0.61)
      .to(cap, { autoAlpha: 0, y: -25, duration: 0.13, ease: 'power2.in' }, o + 0.6)
      .to(_frame, { autoAlpha: 0, duration: 0.1 }, o + 0.73)

    // 🌪 Phase D: 下一帧旋转入场
    if (i < FRAME_COUNT - 1) {
      const nf = frames_[i + 1]; const ni = images[i + 1]; const ng = glows[i + 1]
      master
        .to(nf, { autoAlpha: 1, duration: 0.08 }, o + 0.69)
        .to(ni, { rotation: 0, x: 0, scale: 1, filter: 'brightness(1.06) saturate(1.12) contrast(1.02) blur(0px)', duration: 0.38, ease: 'power3.out' }, o + 0.73)
        .to(ng, { opacity: 0.12, rotation: 0, duration: 0.38, ease: 'power2.out' }, o + 0.73)
    }
  })

  // ── 涡旋指示器旋转 ──
  if (vortexRef.value) {
    master.to(vortexRef.value, { rotation: 360, duration: FRAME_COUNT, ease: 'none' }, 0)
    for (let i = 0; i < FRAME_COUNT; i++) {
      master.to(vortexRef.value, { scale: 1.5, duration: 0.08, ease: 'power2.in' }, i + 0.4)
      master.to(vortexRef.value, { scale: 1, duration: 0.2, ease: 'power2.out' }, i + 0.48)
    }
  }

  // ── 螺旋背景旋转 ──
  if (spiralA.value && spiralB.value && spiralC.value) {
    master.to(spiralA.value, { rotation: 180, scale: 1.15, duration: FRAME_COUNT }, 0)
    master.to(spiralB.value, { rotation: -120, scale: 1.2, duration: FRAME_COUNT }, 0)
    master.to(spiralC.value, { rotation: 90, scale: 1.1, duration: FRAME_COUNT }, 0)
  }

  if (progRef.value) master.to(progRef.value, { width: '100%', duration: FRAME_COUNT }, 0)

  // ── 粒子爆发 ──
  frames_.forEach((_frame, i) => {
    const st = ScrollTrigger.create({ trigger: track, scroller, start: `${((i + 0.4) / FRAME_COUNT) * 100}% top`, onEnter: () => orbitBurst(40) })
    cleanupFns.push(() => st.kill())
  })

  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }

onMounted(() => {
  initCanvas()
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupSpinFlow() }))
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  cancelAnimationFrame(animId)
  ScrollTrigger.getAll().forEach(st => st.kill())
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0
  particles.length = 0
})
</script>

<style scoped lang="scss">
/* ═══════════════════════════════════════════════════════════
   Spin Flow — 旋转流动  类名前缀: sf2-
   ═══════════════════════════════════════════════════════════ */

.sf2-root {
  position: relative; width: 100vw; height: 100vh; overflow: hidden;
  background: linear-gradient(150deg, #fff7f2 0%, #fff3ea 20%, #fef5ee 40%, #fff6f0 60%, #fef7f2 80%, #fff5ed 100%);
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif;
}

/* ── 螺旋背景光斑 ── */
.sf2-spiral {
  position: absolute; border-radius: 50%; pointer-events: none; will-change: transform; z-index: 0;
  filter: blur(80px);
  &--a { width: 36vw; height: 36vw; top: -5vh; left: -4vw; background: radial-gradient(circle, rgba(255,150,110,0.45) 0%, transparent 70%); }
  &--b { width: 30vw; height: 30vw; bottom: -8vh; right: -3vw; background: radial-gradient(circle, rgba(255,200,140,0.4) 0%, transparent 70%); }
  &--c { width: 26vw; height: 26vw; top: 40vh; left: 50vw; background: radial-gradient(circle, rgba(255,180,130,0.35) 0%, transparent 70%); }
}

/* ── Canvas ── */
.sf2-canvas { position: absolute; inset: 0; z-index: 1; pointer-events: none; }

/* ── 滚动 ── */
.sf2-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 2;
  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(255,150,110,0.3); &:hover { background: rgba(255,150,110,0.5); } }
}
.sf2-track { position: relative; width: 100%; }
.sf2-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

/* ── 标题 ── */
.sf2-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 20; text-align: center; width: min(92vw, 800px); }

.sf2-ring { position: absolute; top: -8px; width: 50px; height: 50px; border: 2.5px dashed rgba(255,150,110,0.4); border-radius: 50%; pointer-events: none; animation: sf2-ring-spin 6s linear infinite;
  &--l { left: 12px; animation-delay: 0s; }
  &--r { right: 12px; animation-delay: -3s; }
}
@keyframes sf2-ring-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

.sf2-kicker { display: inline-block; font-size: 0.66rem; font-weight: 700; letter-spacing: 0.26em; text-transform: uppercase; color: rgba(210,110,75,0.8); background: rgba(255,150,120,0.12); backdrop-filter: blur(8px); border: 1px solid rgba(255,140,100,0.2); border-radius: 999px; padding: 0.3rem 1.2rem; margin-bottom: 0.55rem; }

.sf2-title { margin: 0; display: flex; justify-content: center; gap: 0.1em; }
.sf2-title__w { display: inline-block; font-size: clamp(2.2rem, 5.5vw, 4.6rem); font-weight: 900; color: #e87850; will-change: transform, opacity;
  &--hot { background: linear-gradient(135deg, #ff6b4a, #ff8c69, #ffa751); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 2px 12px rgba(255,107,74,0.4)); }
}

.sf2-line { width: 90px; height: 2px; margin: 0.45rem auto 0.6rem; border-radius: 2px; background: linear-gradient(90deg, transparent, #ff8c69, #ffa751, transparent); transform-origin: center; }
.sf2-sub { margin: 0; font-size: clamp(0.76rem, 1.1vw, 0.88rem); color: rgba(200,100,65,0.55); max-width: 440px; margin-inline: auto; }

/* ── 中心涡旋 ── */
.sf2-vortex { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 15; pointer-events: none; will-change: transform; }
.sf2-vortex__ring { position: absolute; top: 50%; left: 50%; border-radius: 50%; border: 1.5px solid rgba(255,160,120,0.4); transform: translate(-50%, -50%); animation: sf2-vortex-pulse 2.5s ease-in-out infinite;
  &:nth-child(1) { width: 60px; height: 60px; }
  &:nth-child(2) { width: 100px; height: 100px; animation-delay: 0.4s; }
  &:nth-child(3) { width: 140px; height: 140px; animation-delay: 0.8s; }
}
@keyframes sf2-vortex-pulse { 0%,100%{opacity:.3;transform:translate(-50%,-50%) scale(.9)} 50%{opacity:.7;transform:translate(-50%,-50%) scale(1.1)} }

.sf2-vortex__core { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 6px; height: 6px; border-radius: 50%; background: #fff; box-shadow: 0 0 10px #fff, 0 0 30px rgba(255,150,100,.8), 0 0 60px rgba(255,120,70,.5); }

/* ── 舞台 & 帧 ── */
.sf2-stage { position: absolute; inset: 0; pointer-events: none; }
.sf2-frame { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; will-change: opacity; }
.sf2-frame__img { position: relative; z-index: 1; width: 100%; height: 100%; object-fit: cover; transform-origin: center center; will-change: transform, filter; }

.sf2-frame__glow { position: absolute; inset: -5%; z-index: 2; pointer-events: none; background: radial-gradient(ellipse 55% 45% at 50% 50%, rgba(255,180,130,.35) 0%, rgba(255,150,110,.15) 40%, transparent 70%); will-change: opacity, transform; }

.sf2-frame__caption { position: absolute; left: max(5vw, 24px); bottom: 12vh; z-index: 20; max-width: min(80vw, 580px); will-change: transform, opacity; }

.sf2-frame__num { display: inline-flex; align-items: center; height: 1.6rem; padding: 0 0.8rem; border-radius: 999px; background: rgba(255,255,255,.5); backdrop-filter: blur(12px); border: 1px solid rgba(255,150,120,.3); font-size: .62rem; font-weight: 700; letter-spacing: .15em; text-transform: uppercase; color: #d46842; }

.sf2-frame__title { margin: .6rem 0 0; font-size: clamp(2rem, 5.2vw, 4rem); font-weight: 900; line-height: 1.1; color: #3d1200; text-shadow: 0 2px 10px rgba(255,255,255,.65), 0 0 40px rgba(255,150,110,.35); }

.sf2-frame__desc { margin: .4rem 0 0; font-size: clamp(.8rem, 1.25vw, .96rem); line-height: 1.6; color: rgba(85,28,5,.68); text-shadow: 0 1px 5px rgba(255,255,255,.45); }

.sf2-progress { position: absolute; left: 0; bottom: 0; z-index: 30; width: 100%; height: 3px; background: rgba(255,150,110,.06); }
.sf2-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #ff6b4a, #ff8c69, #ffa751, #ff6b4a); background-size: 200% 100%; box-shadow: 0 0 12px rgba(255,120,80,.55); }

@media (max-width: 768px) {
  .sf2-header { top: 2vh; }
  .sf2-kicker { font-size: .54rem; padding: .2rem .65rem; }
  .sf2-title__w { font-size: 1.7rem; }
  .sf2-vortex__ring { &:nth-child(1) { width: 40px; height: 40px; } &:nth-child(2) { width: 65px; height: 65px; } &:nth-child(3) { width: 90px; height: 90px; } }
  .sf2-frame__caption { bottom: 9vh; }
  .sf2-frame__title { font-size: 1.45rem; color: #4a1600; }
}
</style>
