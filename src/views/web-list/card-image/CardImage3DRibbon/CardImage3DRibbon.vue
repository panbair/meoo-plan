<template>
  <section ref="rootRef" class="rb3-root">
    <div ref="glowA" class="rb3-glow rb3-glow--a"></div>
    <div ref="glowB" class="rb3-glow rb3-glow--b"></div>
    <canvas ref="canvasRef" class="rb3-canvas"></canvas>

    <div ref="scrollRef" class="rb3-scroll">
      <div ref="trackRef" class="rb3-track" :style="{ height: trackHeight }">
        <div class="rb3-sticky">

          <header ref="headerRef" class="rb3-header">
            <span class="rb3-kicker">🎀 CSS 3D Ribbon · 立体飘带 🎀</span>
            <h1 class="rb3-title">
              <span ref="tc1" class="rb3-title__c">飘</span>
              <span ref="tc2" class="rb3-title__c rb3-title__c--3d">带</span>
              <span ref="tc3" class="rb3-title__c">流</span>
              <span ref="tc4" class="rb3-title__c rb3-title__c--3d">动</span>
            </h1>
            <div ref="lineRef" class="rb3-line"></div>
            <p class="rb3-sub">向下滚动 · 16段连接成3D飘带 · 如丝绸在空间中舞动</p>
          </header>

          <!-- 🎀 3D飘带场景 -->
          <div ref="ribbonStage" class="rb3-stage">
            <div ref="ribbonRef" class="rb3-ribbon">
              <div
                v-for="(seg, idx) in segments"
                :key="idx"
                :ref="(el) => setSegRef(el, idx)"
                class="rb3-segment"
                :style="segmentStyle(idx)"
              >
                <div class="rb3-segment__img" :style="{ backgroundImage: `url(${seg})` }"></div>
              </div>
            </div>
          </div>

          <div ref="infoLabel" class="rb3-info">丝带飘动 · {{ segments.length }}段连接</div>
          <div class="rb3-progress"><div ref="progRef" class="rb3-progress__fill"></div></div>
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
//  CardImage3DRibbon — CSS3 3D立体飘带
//
//  核心概念：16段图片面板沿X轴连接成飘带
//  每段有独立的 rotateY + rotateZ 构成波浪弯曲
//  translateZ 推离形成3D空间感
//  整体旋转+缩放形成流动的丝绸效果
//
//  用户竖滚 → 飘带波浪传播 + 整体3D旋转
// ═══════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

const SEG_COUNT = 16
const images = [
  'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=500&q=80',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&q=80',
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=500&q=80',
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=500&q=80',
]
const segments = Array.from({ length: SEG_COUNT }, (_, i) => images[i % images.length])
const trackHeight = `${(SEG_COUNT / 4 + 2) * 100}vh`

const rootRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const lineRef = ref<HTMLElement | null>(null)
const tc1 = ref<HTMLElement | null>(null); const tc2 = ref<HTMLElement | null>(null)
const tc3 = ref<HTMLElement | null>(null); const tc4 = ref<HTMLElement | null>(null)
const ribbonStage = ref<HTMLElement | null>(null)
const ribbonRef = ref<HTMLElement | null>(null)
const infoLabel = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const glowA = ref<HTMLElement | null>(null); const glowB = ref<HTMLElement | null>(null)

const segRefs = ref<HTMLElement[]>([])
const setSegRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) segRefs.value[i] = el }
const cleanupFns: TweenCleanup[] = []

// 🔑 飘带波浪参数（sin/cos 生成弯曲形状）
const WAVE_AMP = 22 // 度，旋转幅度
const WAVE_LEN = 5 // 每几个segment一个完整波浪

function segmentStyle(idx: number) {
  const wave = Math.sin(idx / WAVE_LEN * Math.PI * 2)
  const ry = wave * WAVE_AMP
  const rz = Math.cos(idx / WAVE_LEN * Math.PI * 2) * WAVE_AMP * 0.6
  const tz = 15 + wave * 8 // 前后波动
  const ty = wave * 6 // 上下微倾
  return {
    transform: `rotateY(${ry}deg) rotateZ(${rz}deg) translateZ(${tz}vw) translateY(${ty}vh)`,
    zIndex: Math.floor(100 + wave * 50),
  }
}

// Canvas
interface RibbonPetal { x: number; y: number; vx: number; vy: number; size: number; alpha: number; hue: number; rotation: number; life: number; maxLife: number }
let ctx: CanvasRenderingContext2D | null = null; let cw = 0; let ch = 0
let animId = 0; const petals: RibbonPetal[] = []

function createPetal(): RibbonPetal {
  return { x: Math.random() * cw, y: ch + 20, vx: (Math.random() - 0.5) * 1, vy: -(0.3 + Math.random() * 2), size: 2 + Math.random() * 6, alpha: 0.2 + Math.random() * 0.4, hue: [340, 25, 195, 45][Math.floor(Math.random() * 4)], rotation: Math.random() * 360, life: 0, maxLife: 180 + Math.random() * 350 }
}

function initCanvas() {
  const c = canvasRef.value; if (!c) return
  ctx = c.getContext('2d'); if (!ctx) return
  const resize = () => { cw = window.innerWidth; ch = window.innerHeight; c.width = cw; c.height = ch }
  resize(); window.addEventListener('resize', resize)
  cleanupFns.push(() => window.removeEventListener('resize', resize))
  for (let i = 0; i < 50; i++) petals.push(createPetal())

  function animate() {
    if (!ctx) return; ctx.clearRect(0, 0, cw, ch)
    while (petals.length < 50) petals.push(createPetal())
    for (let i = petals.length - 1; i >= 0; i--) {
      const p = petals[i]; p.life++
      if (p.life >= p.maxLife) { petals.splice(i, 1); continue }
      const t = p.life / p.maxLife; const fade = t < 0.08 ? t / 0.08 : t > 0.7 ? 1 - (t - 0.7) / 0.3 : 1
      p.x += p.vx; p.y += p.vy; p.rotation += 0.5
      ctx!.save(); ctx!.translate(p.x, p.y); ctx!.rotate(p.rotation * Math.PI / 180)
      ctx!.beginPath()
      // 椭圆花瓣形状
      ctx!.ellipse(0, 0, p.size * 0.5, p.size * 0.25, 0, 0, Math.PI * 2)
      ctx!.fillStyle = `hsla(${p.hue}, 70%, 75%, ${p.alpha * fade})`; ctx!.fill()
      ctx!.restore()
      if (p.y < -30) { p.y = ch + 30; p.x = Math.random() * cw; p.life = 0 }
    }
    animId = requestAnimationFrame(animate)
  }
  animId = requestAnimationFrame(animate)
}

function setupEntrance() {
  if (!scrollRef.value || !headerRef.value || !ribbonStage.value) return
  const tl = gsap.timeline({ scrollTrigger: { trigger: scrollRef.value, scroller: scrollRef.value, start: 'top 75%', toggleActions: 'play none none reverse' } })
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.85, ease: 'power3.out' })
    .fromTo([tc1.value, tc2.value, tc3.value, tc4.value], { autoAlpha: 0, rotateX: 90, scale: 0.2 }, { autoAlpha: 1, rotateX: 0, scale: 1, duration: 0.6, stagger: 0.08, ease: 'back.out(2.2)' }, '-=0.45')
    .fromTo(lineRef.value, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power3.inOut' }, '-=0.25')
    .fromTo(ribbonStage.value, { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.8, ease: 'power3.out' }, '-=0.35')
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

function setupRibbon() {
  if (!scrollRef.value || !trackRef.value || !ribbonRef.value) return
  const scroller = scrollRef.value; const track = trackRef.value; const ribbon = ribbonRef.value
  const segs = segRefs.value

  // 初始：飘带平展
  if (segs.length) {
    segs.forEach((seg, i) => {
      gsap.set(seg, { rotateY: 0, rotateZ: 0, translateZ: 5, translateY: 0 })
    })
  }

  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.15 },
  })

  // 🔑 波浪传播：正弦波沿着飘带移动
  // 飘带整体绕Y轴旋转
  master.to(ribbon, { rotateY: 360, duration: 4, ease: 'power2.inOut' }, 0)
  master.to(ribbon, { rotateY: 0, duration: 4, ease: 'power2.inOut' }, 2)

  // 飘带整体上下浮动
  for (let c = 0; c < 4; c++) {
    master.to(ribbon, { y: -10, duration: 0.4, ease: 'sine.inOut' }, c * 1 + 0.2)
    master.to(ribbon, { y: 8, duration: 0.4, ease: 'sine.inOut' }, c * 1 + 0.6)
    master.to(ribbon, { y: 0, duration: 0.3, ease: 'sine.inOut' }, c * 1 + 0.9)
  }

  // 每段的波浪偏移（随时间偏移，形成波浪传播效果）
  segs.forEach((seg, i) => {
    for (let w = 0; w < 4; w++) {
      const phaseOffset = w + i * 0.06
      const wave = Math.sin(phaseOffset * Math.PI)
      master.to(seg, {
        rotateY: wave * WAVE_AMP * 0.5,
        rotateZ: Math.cos(phaseOffset * Math.PI) * WAVE_AMP * 0.3,
        translateZ: 15 + wave * 5,
        duration: 0.4, ease: 'sine.inOut',
      }, w * 1)
      master.to(seg, {
        rotateY: -wave * WAVE_AMP * 0.5,
        rotateZ: -Math.cos(phaseOffset * Math.PI) * WAVE_AMP * 0.3,
        translateZ: 15 - wave * 5,
        duration: 0.5, ease: 'sine.inOut',
      }, w * 1 + 0.5)
    }
  })

  for (let i = 0; i <= 4; i++) {
    master.to(ribbon, { scale: 1.03, duration: 0.1, ease: 'sine.inOut' }, i + 0.25)
    master.to(ribbon, { scale: 1, duration: 0.12, ease: 'sine.inOut' }, i + 0.4)
  }

  if (glowA.value && glowB.value) {
    master.to(glowA.value, { x: '6vw', y: '-4vh', scale: 1.15, duration: 4 }, 0)
    master.to(glowB.value, { x: '-4vw', y: '5vh', scale: 1.2, duration: 4 }, 0)
  }
  if (progRef.value) master.to(progRef.value, { width: '100%', duration: 4 }, 0)

  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }

onMounted(() => {
  initCanvas()
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupRibbon() }))
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  cancelAnimationFrame(animId)
  ScrollTrigger.getAll().forEach(st => st.kill())
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0; petals.length = 0
})
</script>

<style scoped lang="scss">
.rb3-root { position: relative; width: 100vw; height: 100vh; overflow: hidden; background: linear-gradient(155deg, #fefaf7 0%, #fcf5ef 20%, #fdf7f3 40%, #fcf6f0 60%, #fdf8f4 80%, #fcf6f1 100%); font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif; }
.rb3-glow { position: absolute; border-radius: 50%; filter: blur(65px); pointer-events: none; will-change: transform; z-index: 0; }
.rb3-glow--a { width: 30vw; height: 30vw; top: -4vh; left: -2vw; background: radial-gradient(circle, rgba(255,160,150,.4) 0%, transparent 70%); }
.rb3-glow--b { width: 26vw; height: 26vw; bottom: -4vh; right: -1vw; background: radial-gradient(circle, rgba(150,200,230,.38) 0%, transparent 70%); }
.rb3-canvas { position: absolute; inset: 0; z-index: 1; pointer-events: none; }

.rb3-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 2;
  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(255,150,130,.3); &:hover { background: rgba(255,150,130,.5); } }
}
.rb3-track { position: relative; width: 100%; }
.rb3-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

.rb3-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 30; text-align: center; width: min(92vw, 800px); }
.rb3-kicker { display: inline-block; font-size: .66rem; font-weight: 700; letter-spacing: .26em; text-transform: uppercase; color: rgba(200,130,110,.8); background: rgba(255,150,120,.1); backdrop-filter: blur(8px); border: 1px solid rgba(255,140,110,.2); border-radius: 999px; padding: .3rem 1.2rem; margin-bottom: .55rem; }
.rb3-title { margin: 0; display: flex; justify-content: center; gap: .08em; }
.rb3-title__c { display: inline-block; font-size: clamp(2.2rem, 5.5vw, 4.6rem); font-weight: 900; color: #c87058; will-change: transform,opacity;
  &--3d { background: linear-gradient(135deg, #ff8c69, #60b8f0, #f0abfc, #5ce0a0); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 2px 14px rgba(160,130,230,.5)); }
}
.rb3-line { width: 90px; height: 2px; margin: .45rem auto .6rem; background: linear-gradient(90deg, transparent, #ff8c69, #f0abfc, #5ce0a0, transparent); }
.rb3-sub { margin: 0; font-size: clamp(.76rem, 1.1vw, .88rem); color: rgba(180,110,90,.5); max-width: 480px; margin-inline: auto; }

/* ═══════════════ 3D飘带 ═══════════════ */
.rb3-stage {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 0; height: 0; z-index: 10;
  perspective: 900px; perspective-origin: 50% 50%;
  will-change: transform, opacity;
}

.rb3-ribbon {
  position: absolute; width: 0; height: 0;
  transform-style: preserve-3d; will-change: transform;
}

/* 每个飘带段 */
.rb3-segment {
  position: absolute;
  width: 6vw; max-width: 70px;
  height: 40vh; max-height: 320px;
  margin-left: -3vw; margin-top: -20vh;
  backface-visibility: hidden;
  border-radius: 8px; overflow: hidden;
  box-shadow: 0 5px 25px rgba(0,0,0,.15);
  border: 1px solid rgba(255,255,255,.2);
  will-change: transform;
}

.rb3-segment__img {
  width: 100%; height: 100%;
  background-size: cover;
  background-position: center;
}

.rb3-info { position: absolute; bottom: 4vh; left: 50%; transform: translateX(-50%); z-index: 25; font-size: .7rem; font-weight: 700; letter-spacing: .2em; color: #c87058; background: rgba(255,255,255,.45); backdrop-filter: blur(8px); border-radius: 999px; padding: .25rem 1rem; pointer-events: none; }
.rb3-progress { position: absolute; left: 0; bottom: 0; z-index: 30; width: 100%; height: 3px; background: rgba(255,140,120,.06); }
.rb3-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #ff8c69, #f0abfc, #5ce0a0, #60b8f0, #ff8c69); background-size: 200% 100%; box-shadow: 0 0 12px rgba(230,140,200,.5); }
@media (max-width: 768px) { .rb3-header { top: 2vh; } .rb3-kicker { font-size: .54rem; } .rb3-title__c { font-size: 1.7rem; } .rb3-segment { width: 8vw; height: 32vh; margin-left: -4vw; margin-top: -16vh; } }
</style>
