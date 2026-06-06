<template>
  <section ref="rootRef" class="vx3-root">
    <div ref="glowA" class="vx3-glow vx3-glow--a"></div>
    <div ref="glowB" class="vx3-glow vx3-glow--b"></div>
    <canvas ref="canvasRef" class="vx3-canvas"></canvas>

    <div ref="scrollRef" class="vx3-scroll">
      <div ref="trackRef" class="vx3-track" :style="{ height: trackHeight }">
        <div class="vx3-sticky">

          <header ref="headerRef" class="vx3-header">
            <span class="vx3-kicker">🌪 CSS 3D Vortex · 立体漩涡 🌪</span>
            <h1 class="vx3-title">
              <span ref="tc1" class="vx3-title__c">漩</span>
              <span ref="tc2" class="vx3-title__c vx3-title__c--3d">涡</span>
              <span ref="tc3" class="vx3-title__c">漏</span>
              <span ref="tc4" class="vx3-title__c vx3-title__c--3d">斗</span>
            </h1>
            <div ref="lineRef" class="vx3-line"></div>
            <p class="vx3-sub">向下滚动 · 4层光环逐级缩小 · 图片被吸入3D漩涡中心</p>
          </header>

          <!-- 🌪 3D漩涡场景 -->
          <div ref="vxStage" class="vx3-stage">
            <div ref="vxCore" class="vx3-core">
              <!-- 4层旋转环，逐级缩小 -->
              <div
                v-for="(ring, ringIdx) in RINGS"
                :key="ringIdx"
                :ref="(el) => setRingRef(el, ringIdx)"
                class="vx3-ring"
                :style="ringStyle(ringIdx)"
              >
                <div
                  v-for="(img, imgIdx) in ringImages(ringIdx)"
                  :key="imgIdx"
                  class="vx3-ring__card"
                  :style="cardInRingStyle(ringIdx, imgIdx, ring.count)"
                >
                  <img :src="img" class="vx3-ring__img" loading="eager" />
                </div>
              </div>
            </div>
          </div>

          <!-- 漏斗中心点 -->
          <div ref="funnelDot" class="vx3-dot"></div>

          <div class="vx3-progress"><div ref="progRef" class="vx3-progress__fill"></div></div>
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
//  CardImage3DVortex — CSS3 3D立体漩涡漏斗
//
//  4层光环从大到小嵌套，每层6张图片围成圆环
//  Ring 0 (最外层): Y=0, radius=最大, 图片最多
//  Ring 3 (最内层): Y=沉入, radius=最小, 形成漏斗
//  用户竖滚 → 每层以不同速度自转 → 漩涡吸入效果
// ═══════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

const IMG_SRC = [
  'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=300&q=80',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=300&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&q=80',
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=300&q=80',
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=300&q=80',
]

const RINGS = [
  { count: 8, radius: 34, y: -4, scale: 1.0, speed: 0.6 },
  { count: 8, radius: 26, y:  2, scale: 0.85, speed: 0.9 },
  { count: 6, radius: 18, y:  8, scale: 0.68, speed: 1.3 },
  { count: 6, radius: 10, y: 14, scale: 0.48, speed: 1.8 },
] as const

const trackHeight = `${(RINGS.length + 4) * 100}vh`

const rootRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const lineRef = ref<HTMLElement | null>(null)
const tc1 = ref<HTMLElement | null>(null); const tc2 = ref<HTMLElement | null>(null)
const tc3 = ref<HTMLElement | null>(null); const tc4 = ref<HTMLElement | null>(null)
const vxStage = ref<HTMLElement | null>(null)
const vxCore = ref<HTMLElement | null>(null)
const funnelDot = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const glowA = ref<HTMLElement | null>(null); const glowB = ref<HTMLElement | null>(null)

const ringRefs = ref<HTMLElement[]>([])
const setRingRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) ringRefs.value[i] = el }
const cleanupFns: TweenCleanup[] = []

function ringImages(ringIdx: number): string[] {
  const count = RINGS[ringIdx].count
  return Array.from({ length: count }, (_, i) => IMG_SRC[i % IMG_SRC.length])
}

function ringStyle(ringIdx: number) {
  const r = RINGS[ringIdx]
  return {
    transform: `translateY(${r.y}vh) scale(${r.scale})`,
    zIndex: 100 - ringIdx * 10,
  }
}

function cardInRingStyle(ringIdx: number, cardIdx: number, count: number) {
  const r = RINGS[ringIdx]
  const angle = (cardIdx / count) * 360
  return {
    transform: `rotateY(${angle}deg) translateZ(${r.radius}vw)`,
  }
}

// Canvas 漩涡粒子
interface VortexP { x: number; y: number; angle: number; radius: number; speed: number; size: number; alpha: number; hue: number; life: number; maxLife: number }
let ctx: CanvasRenderingContext2D | null = null; let cw = 0; let ch = 0
let animId = 0; const vps: VortexP[] = []

function createVP(): VortexP {
  const cx = cw * 0.5; const cy = ch * 0.48
  return { x: cx, y: cy, angle: Math.random() * Math.PI * 2, radius: 20 + Math.random() * Math.min(cw, ch) * 0.4, speed: 0.01 + Math.random() * 0.03, size: 1 + Math.random() * 2.5, alpha: 0.2 + Math.random() * 0.4, hue: [20, 35, 195][Math.floor(Math.random() * 3)], life: 0, maxLife: 180 + Math.random() * 350 }
}

function initCanvas() {
  const c = canvasRef.value; if (!c) return
  ctx = c.getContext('2d'); if (!ctx) return
  const resize = () => { cw = window.innerWidth; ch = window.innerHeight; c.width = cw; c.height = ch }
  resize(); window.addEventListener('resize', resize)
  cleanupFns.push(() => window.removeEventListener('resize', resize))
  for (let i = 0; i < 60; i++) vps.push(createVP())

  function animate() {
    if (!ctx) return; ctx.clearRect(0, 0, cw, ch)
    while (vps.length < 60) vps.push(createVP())
    const cx = cw * 0.5; const cy = ch * 0.48
    for (let i = vps.length - 1; i >= 0; i--) {
      const p = vps[i]; p.life++
      if (p.life >= p.maxLife) { vps.splice(i, 1); continue }
      const t = p.life / p.maxLife; const fade = t < 0.08 ? t / 0.08 : t > 0.7 ? 1 - (t - 0.7) / 0.3 : 1
      p.angle += p.speed; p.radius -= 0.3 // 向内螺旋
      if (p.radius < 5) { p.radius = Math.min(cw, ch) * 0.4; p.angle = Math.random() * Math.PI * 2 }
      const x = cx + Math.cos(p.angle) * p.radius; const y = cy + Math.sin(p.angle) * p.radius * 0.6
      ctx!.beginPath(); ctx!.arc(x, y, p.size, 0, Math.PI * 2)
      ctx!.fillStyle = `hsla(${p.hue}, 75%, 68%, ${p.alpha * fade * (1 - p.radius / (Math.min(cw,ch) * 0.45))})`; ctx!.fill()
    }
    animId = requestAnimationFrame(animate)
  }
  animId = requestAnimationFrame(animate)
}

function setupEntrance() {
  if (!scrollRef.value || !headerRef.value || !vxStage.value) return
  const tl = gsap.timeline({ scrollTrigger: { trigger: scrollRef.value, scroller: scrollRef.value, start: 'top 75%', toggleActions: 'play none none reverse' } })
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.85, ease: 'power3.out' })
    .fromTo([tc1.value, tc2.value, tc3.value, tc4.value], { autoAlpha: 0, rotateX: 90, scale: 0.2 }, { autoAlpha: 1, rotateX: 0, scale: 1, duration: 0.6, stagger: 0.08, ease: 'back.out(2.2)' }, '-=0.45')
    .fromTo(lineRef.value, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power3.inOut' }, '-=0.25')
    .fromTo(vxStage.value, { autoAlpha: 0, rotateX: -25, scale: 0.5 }, { autoAlpha: 1, rotateX: 15, scale: 1, duration: 0.8, ease: 'power3.out' }, '-=0.35')
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

function setupVortex() {
  if (!scrollRef.value || !trackRef.value) return
  const scroller = scrollRef.value; const track = trackRef.value; const rings = ringRefs.value
  if (!rings.length) return

  rings.forEach((ring, i) => { gsap.set(ring, { rotateY: i * 30, rotateZ: 0 }) })

  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.2 },
  })

  // 🔑 各层以不同速度自转（内层快外层慢 = 漩涡效果）
  rings.forEach((ring, i) => {
    const speed = RINGS[i].speed
    master.to(ring, { rotateY: `+=${360 * speed * 2}`, duration: RINGS.length + 2, ease: 'none' }, 0)
    // 内层微微下沉
    if (i > 0) {
      master.to(ring, { rotateZ: i * 5, duration: RINGS.length + 2, ease: 'sine.inOut' }, 0)
    }
  })

  // 整体呼吸
  if (vxCore.value) {
    for (let i = 0; i <= RINGS.length + 2; i++) {
      master.to(vxCore.value, { scale: 1.04, duration: 0.1, ease: 'sine.inOut' }, i + 0.25)
      master.to(vxCore.value, { scale: 1, duration: 0.12, ease: 'sine.inOut' }, i + 0.4)
    }
  }

  // 漏斗中心点脉冲
  if (funnelDot.value) {
    for (let i = 0; i <= RINGS.length + 2; i++) {
      master.to(funnelDot.value, { scale: 2.5, opacity: 0.9, duration: 0.08, ease: 'power2.out' }, i + 0.3)
      master.to(funnelDot.value, { scale: 1, opacity: 0.5, duration: 0.2, ease: 'power2.in' }, i + 0.4)
    }
  }

  if (glowA.value && glowB.value) {
    master.to(glowA.value, { x: '6vw', y: '-4vh', scale: 1.15, duration: RINGS.length + 2 }, 0)
    master.to(glowB.value, { x: '-4vw', y: '5vh', scale: 1.2, duration: RINGS.length + 2 }, 0)
  }
  if (progRef.value) master.to(progRef.value, { width: '100%', duration: RINGS.length + 2 }, 0)

  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }

onMounted(() => {
  initCanvas()
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupVortex() }))
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  cancelAnimationFrame(animId)
  ScrollTrigger.getAll().forEach(st => st.kill())
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0; vps.length = 0
})
</script>

<style scoped lang="scss">
.vx3-root { position: relative; width: 100vw; height: 100vh; overflow: hidden; background: linear-gradient(160deg, #fefaf7 0%, #fcf5ef 20%, #fdf7f3 40%, #fcf6f0 60%, #fdf8f4 80%, #fcf6f1 100%); font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif; }
.vx3-glow { position: absolute; border-radius: 50%; filter: blur(65px); pointer-events: none; will-change: transform; z-index: 0; }
.vx3-glow--a { width: 30vw; height: 30vw; top: -4vh; left: -2vw; background: radial-gradient(circle, rgba(255,150,140,.4) 0%, transparent 70%); }
.vx3-glow--b { width: 26vw; height: 26vw; bottom: -4vh; right: -1vw; background: radial-gradient(circle, rgba(140,200,240,.38) 0%, transparent 70%); }
.vx3-canvas { position: absolute; inset: 0; z-index: 1; pointer-events: none; }

.vx3-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 2;
  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(255,140,120,.3); &:hover { background: rgba(255,140,120,.5); } }
}
.vx3-track { position: relative; width: 100%; }
.vx3-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

.vx3-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 30; text-align: center; width: min(92vw, 800px); }
.vx3-kicker { display: inline-block; font-size: .66rem; font-weight: 700; letter-spacing: .26em; text-transform: uppercase; color: rgba(200,130,110,.8); background: rgba(255,150,120,.1); backdrop-filter: blur(8px); border: 1px solid rgba(255,140,110,.2); border-radius: 999px; padding: .3rem 1.2rem; margin-bottom: .55rem; }
.vx3-title { margin: 0; display: flex; justify-content: center; gap: .08em; }
.vx3-title__c { display: inline-block; font-size: clamp(2.2rem, 5.5vw, 4.6rem); font-weight: 900; color: #c87058; will-change: transform,opacity;
  &--3d { background: linear-gradient(180deg, #ff8c69, #c87058, #ff6b4a, #8b4513); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 2px 14px rgba(255,100,70,.55)); }
}
.vx3-line { width: 90px; height: 2px; margin: .45rem auto .6rem; background: linear-gradient(90deg, transparent, #ff8c69, #c87058, #8b4513, transparent); }
.vx3-sub { margin: 0; font-size: clamp(.76rem, 1.1vw, .88rem); color: rgba(180,110,90,.5); max-width: 480px; margin-inline: auto; }

/* ═══════════════ 3D漩涡 ═══════════════ */
.vx3-stage {
  position: absolute; top: 48%; left: 50%;
  transform: translate(-50%, -50%) rotateX(15deg);
  width: 0; height: 0; z-index: 10;
  perspective: 800px; perspective-origin: 50% 60%;
  will-change: transform, opacity;
}

.vx3-core {
  position: absolute; width: 0; height: 0;
  transform-style: preserve-3d; will-change: transform;
}

/* 每一层光环 */
.vx3-ring {
  position: absolute; width: 0; height: 0;
  transform-style: preserve-3d; will-change: transform;
}

.vx3-ring__card {
  position: absolute;
  width: 10vw; max-width: 100px;
  height: 7vw; max-height: 70px;
  margin-left: -5vw; margin-top: -3.5vw;
  backface-visibility: hidden;
  border-radius: 6px; overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,.18);
  border: 1px solid rgba(255,255,255,.3);
}

.vx3-ring__img { width: 100%; height: 100%; object-fit: cover; }

/* 漏斗中心点 */
.vx3-dot {
  position: absolute; top: 52%; left: 50%; transform: translate(-50%, -50%);
  width: 8px; height: 8px; border-radius: 50%; z-index: 15;
  background: #fff;
  box-shadow: 0 0 15px rgba(255,255,255,.8), 0 0 40px rgba(255,100,50,.6), 0 0 80px rgba(255,80,30,.3);
  pointer-events: none; will-change: transform, opacity; opacity: .5;
}

.vx3-progress { position: absolute; left: 0; bottom: 0; z-index: 30; width: 100%; height: 3px; background: rgba(255,140,120,.06); }
.vx3-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #ff8c69, #c87058, #8b4513, #ff8c69); background-size: 200% 100%; box-shadow: 0 0 12px rgba(255,100,70,.5); }
@media (max-width: 768px) { .vx3-header { top: 2vh; } .vx3-kicker { font-size: .54rem; } .vx3-title__c { font-size: 1.7rem; } .vx3-ring__card { width: 14vw; height: 10vw; margin-left: -7vw; margin-top: -5vw; } }
</style>
