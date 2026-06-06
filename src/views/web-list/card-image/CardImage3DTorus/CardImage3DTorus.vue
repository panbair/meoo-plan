<template>
  <section ref="rootRef" class="tr3-root">
    <div ref="glowA" class="tr3-glow tr3-glow--a"></div>
    <div ref="glowB" class="tr3-glow tr3-glow--b"></div>
    <canvas ref="canvasRef" class="tr3-canvas"></canvas>

    <div ref="scrollRef" class="tr3-scroll">
      <div ref="trackRef" class="tr3-track" :style="{ height: trackHeight }">
        <div class="tr3-sticky">

          <header ref="headerRef" class="tr3-header">
            <span class="tr3-kicker">🍩 CSS 3D Torus · 甜甜圈环 🍩</span>
            <h1 class="tr3-title">
              <span ref="tc1" class="tr3-title__c">甜</span>
              <span ref="tc2" class="tr3-title__c tr3-title__c--3d">甜</span>
              <span ref="tc3" class="tr3-title__c">圈</span>
              <span ref="tc4" class="tr3-title__c tr3-title__c--3d">环</span>
            </h1>
            <div ref="lineRef" class="tr3-line"></div>
            <p class="tr3-sub">向下滚动 · 16段组成3D圆环 · 绕中心轴旋转的图片甜甜圈</p>
          </header>

          <!-- 🍩 3D Torus -->
          <div ref="torusStage" class="tr3-stage">
            <div ref="torusMaster" class="tr3-torus-master">
              <div
                v-for="(img, idx) in torusImages"
                :key="idx"
                :ref="(el) => setSegRef(el, idx)"
                class="tr3-segment"
                :style="segStyle(idx)"
              >
                <img :src="img" class="tr3-segment__img" loading="eager" />
              </div>
            </div>
          </div>

          <div class="tr3-progress"><div ref="progRef" class="tr3-progress__fill"></div></div>
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
//  CardImage3DTorus — CSS3 3D甜甜圈环
//
//  Torus = 环面体
//  16段沿大圆(ring)排列，每段本身又是一组小圆(tube)上的面板
//  简化：每段 rotateY(N×22.5°) translateZ(大圆半径)
//  然后每段自身再绕X轴旋转不同的角度模拟管状截面
//  用户竖滚 → Torus绕Y轴旋转 + 绕X轴翻滚 → 甜甜圈转动效果
// ═══════════════════════════════════════════════════════════════════

type TweenCleanup = () => void
const SEGS = 16
const IMGS = ['https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=350&q=80','https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=350&q=80','https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=350&q=80','https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=350&q=80','https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=350&q=80','https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=350&q=80']
const torusImages = Array.from({length: SEGS}, (_, i) => IMGS[i % IMGS.length])
const RING_R = 28 // vw 大圆半径
const TUBE_R = 6  // vw 管半径
const ANGLES = Array.from({length: SEGS}, (_, i) => (i / SEGS) * 360)
const trackHeight = `${(SEGS / 4 + 3) * 100}vh`

const rootRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const lineRef = ref<HTMLElement | null>(null)
const tc1 = ref<HTMLElement | null>(null); const tc2 = ref<HTMLElement | null>(null)
const tc3 = ref<HTMLElement | null>(null); const tc4 = ref<HTMLElement | null>(null)
const torusStage = ref<HTMLElement | null>(null)
const torusMaster = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const glowA = ref<HTMLElement | null>(null); const glowB = ref<HTMLElement | null>(null)

const segRefs = ref<HTMLElement[]>([])
const setSegRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) segRefs.value[i] = el }
const cleanupFns: TweenCleanup[] = []

function segStyle(idx: number) {
  const angle = ANGLES[idx]
  const tubeAngle = (idx / SEGS) * 360
  // 大圆位置 + 管截面偏移
  return {
    transform: `rotateY(${angle}deg) translateZ(${RING_R}vw) rotateX(${tubeAngle}deg) translateZ(${TUBE_R}vw)`,
  }
}

// Canvas
interface TorusDust { x: number; y: number; vy: number; size: number; alpha: number; hue: number; life: number; maxLife: number }
let ctx: CanvasRenderingContext2D | null = null; let cw = 0; let ch = 0
let animId = 0; const dusts: TorusDust[] = []

function createDust(): TorusDust {
  return { x: Math.random() * cw, y: ch + 20, vy: -(0.3 + Math.random() * 2), size: 1 + Math.random() * 2.5, alpha: 0.2 + Math.random() * 0.4, hue: [25, 35, 195, 330][Math.floor(Math.random() * 4)], life: 0, maxLife: 150 + Math.random() * 300 }
}

function initCanvas() {
  const c = canvasRef.value; if (!c) return
  ctx = c.getContext('2d'); if (!ctx) return
  const resize = () => { cw = window.innerWidth; ch = window.innerHeight; c.width = cw; c.height = ch }
  resize(); window.addEventListener('resize', resize)
  cleanupFns.push(() => window.removeEventListener('resize', resize))
  for (let i = 0; i < 45; i++) dusts.push(createDust())

  function animate() {
    if (!ctx) return; ctx.clearRect(0, 0, cw, ch)
    while (dusts.length < 45) dusts.push(createDust())
    for (let i = dusts.length - 1; i >= 0; i--) {
      const d = dusts[i]; d.life++
      if (d.life >= d.maxLife) { dusts.splice(i, 1); continue }
      d.y += d.vy
      const t = d.life / d.maxLife; const fade = t < 0.08 ? t / 0.08 : t > 0.7 ? 1 - (t - 0.7) / 0.3 : 1
      ctx!.beginPath(); ctx!.arc(d.x, d.y, d.size, 0, Math.PI * 2)
      ctx!.fillStyle = `hsla(${d.hue}, 70%, 72%, ${d.alpha * fade})`; ctx!.fill()
      if (d.y < -20) { d.y = ch + 20; d.x = Math.random() * cw; d.life = 0 }
    }
    animId = requestAnimationFrame(animate)
  }
  animId = requestAnimationFrame(animate)
}

function setupEntrance() {
  if (!scrollRef.value || !headerRef.value || !torusStage.value) return
  const tl = gsap.timeline({ scrollTrigger: { trigger: scrollRef.value, scroller: scrollRef.value, start: 'top 75%', toggleActions: 'play none none reverse' } })
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.85, ease: 'power3.out' })
    .fromTo([tc1.value, tc2.value, tc3.value, tc4.value], { autoAlpha: 0, rotateX: 90, scale: 0.3 }, { autoAlpha: 1, rotateX: 0, scale: 1, duration: 0.6, stagger: 0.08, ease: 'back.out(2.2)' }, '-=0.45')
    .fromTo(lineRef.value, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power3.inOut' }, '-=0.25')
    .fromTo(torusStage.value, { autoAlpha: 0, rotateX: -30, scale: 0.5 }, { autoAlpha: 1, rotateX: -10, scale: 1, duration: 0.8, ease: 'power3.out' }, '-=0.35')
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

function setupTorus() {
  if (!scrollRef.value || !trackRef.value || !torusMaster.value) return
  const scroller = scrollRef.value; const track = trackRef.value; const master = torusMaster.value

  gsap.set(master, { rotateY: 0, rotateX: -10 })

  const mtl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.15 },
  })

  // 🍩 绕Y轴旋转(主转) + 绕X轴翻滚(甜甜圈翻滚)
  mtl.to(master, { rotateY: 180, duration: 2, ease: 'power2.inOut' }, 0)
  mtl.to(master, { rotateY: 360, duration: 2, ease: 'power2.inOut' }, 2)
  mtl.to(master, { rotateY: 540, duration: 2, ease: 'power2.inOut' }, 3)
  // 同时绕X轴来回翻滚
  mtl.to(master, { rotateX: -25, duration: 1.5, ease: 'sine.inOut' }, 0)
  mtl.to(master, { rotateX: 5, duration: 1.5, ease: 'sine.inOut' }, 1.5)
  mtl.to(master, { rotateX: -15, duration: 1.5, ease: 'sine.inOut' }, 3)

  for (let i = 0; i <= 4; i++) {
    mtl.to(master, { scale: 1.05, duration: 0.1, ease: 'sine.inOut' }, i + 0.25)
    mtl.to(master, { scale: 1, duration: 0.12, ease: 'sine.inOut' }, i + 0.4)
  }

  if (glowA.value && glowB.value) {
    mtl.to(glowA.value, { x: '6vw', y: '-4vh', scale: 1.15, duration: 4 }, 0)
    mtl.to(glowB.value, { x: '-4vw', y: '5vh', scale: 1.2, duration: 4 }, 0)
  }
  if (progRef.value) mtl.to(progRef.value, { width: '100%', duration: 4 }, 0)

  cleanupFns.push(() => { mtl.scrollTrigger?.kill(); mtl.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }

onMounted(() => {
  initCanvas()
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupTorus() }))
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  cancelAnimationFrame(animId)
  ScrollTrigger.getAll().forEach(st => st.kill())
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0; dusts.length = 0
})
</script>

<style scoped lang="scss">
.tr3-root { position: relative; width: 100vw; height: 100vh; overflow: hidden; background: linear-gradient(155deg, #fefaf7 0%, #fcf5ef 20%, #fdf7f3 40%, #fcf6f0 60%, #fdf8f4 80%, #fcf6f1 100%); font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif; }
.tr3-glow { position: absolute; border-radius: 50%; filter: blur(65px); pointer-events: none; will-change: transform; z-index: 0; }
.tr3-glow--a { width: 28vw; height: 28vw; top: -4vh; left: -2vw; background: radial-gradient(circle, rgba(255,160,140,.4) 0%, transparent 70%); }
.tr3-glow--b { width: 24vw; height: 24vw; bottom: -4vh; right: -1vw; background: radial-gradient(circle, rgba(140,200,230,.38) 0%, transparent 70%); }
.tr3-canvas { position: absolute; inset: 0; z-index: 1; pointer-events: none; }

.tr3-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 2;
  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(255,150,120,.3); &:hover { background: rgba(255,150,120,.5); } }
}
.tr3-track { position: relative; width: 100%; }
.tr3-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

.tr3-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 30; text-align: center; width: min(92vw, 800px); }
.tr3-kicker { display: inline-block; font-size: .66rem; font-weight: 700; letter-spacing: .26em; text-transform: uppercase; color: rgba(200,130,110,.8); background: rgba(255,150,120,.1); backdrop-filter: blur(8px); border: 1px solid rgba(255,140,110,.2); border-radius: 999px; padding: .3rem 1.2rem; margin-bottom: .55rem; }
.tr3-title { margin: 0; display: flex; justify-content: center; gap: .08em; }
.tr3-title__c { display: inline-block; font-size: clamp(2.2rem, 5.5vw, 4.6rem); font-weight: 900; color: #c87058; will-change: transform,opacity;
  &--3d { background: linear-gradient(135deg, #ff8c69, #c87058, #ffb347, #ff8c69); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 2px 14px rgba(255,140,80,.45)); }
}
.tr3-line { width: 90px; height: 2px; margin: .45rem auto .6rem; background: linear-gradient(90deg, transparent, #ff8c69, #ffb347, transparent); }
.tr3-sub { margin: 0; font-size: clamp(.76rem, 1.1vw, .88rem); color: rgba(180,110,90,.5); max-width: 480px; margin-inline: auto; }

/* ═══════════════ 3D Torus ═══════════════ */
.tr3-stage {
  position: absolute; top: 48%; left: 50%;
  transform: translate(-50%, -50%) rotateX(-10deg);
  width: 0; height: 0; z-index: 10;
  perspective: 900px; perspective-origin: 50% 50%;
  will-change: transform, opacity;
}

.tr3-torus-master {
  position: absolute; width: 0; height: 0;
  transform-style: preserve-3d; will-change: transform;
}

.tr3-segment {
  position: absolute;
  width: 8vw; max-width: 80px;
  height: 5vw; max-height: 55px;
  margin-left: -4vw; margin-top: -2.5vw;
  backface-visibility: hidden;
  border-radius: 8px; overflow: hidden;
  box-shadow: 0 3px 15px rgba(0,0,0,.15);
  border: 1px solid rgba(255,255,255,.25);
}

.tr3-segment__img { width: 100%; height: 100%; object-fit: cover; }

.tr3-progress { position: absolute; left: 0; bottom: 0; z-index: 30; width: 100%; height: 3px; background: rgba(255,140,120,.06); }
.tr3-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #ff8c69, #ffb347, #ff8c69); background-size: 200% 100%; box-shadow: 0 0 12px rgba(255,140,80,.5); }
@media (max-width: 768px) { .tr3-header { top: 2vh; } .tr3-kicker { font-size: .54rem; } .tr3-title__c { font-size: 1.7rem; } .tr3-segment { width: 10vw; height: 7vw; margin-left: -5vw; margin-top: -3.5vw; } }
</style>
