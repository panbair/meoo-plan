<template>
  <section ref="rootRef" class="co3-root">
    <div ref="glowA" class="co3-glow co3-glow--a"></div>
    <div ref="glowB" class="co3-glow co3-glow--b"></div>
    <canvas ref="canvasRef" class="co3-canvas"></canvas>

    <div ref="scrollRef" class="co3-scroll">
      <div ref="trackRef" class="co3-track" :style="{ height: trackHeight }">
        <div class="co3-sticky">

          <header ref="headerRef" class="co3-header">
            <span class="co3-kicker">📐 CSS 3D Cone · 立体圆锥 📐</span>
            <h1 class="co3-title">
              <span ref="tc1" class="co3-title__c">圆</span>
              <span ref="tc2" class="co3-title__c co3-title__c--3d">锥</span>
              <span ref="tc3" class="co3-title__c">尖</span>
              <span ref="tc4" class="co3-title__c co3-title__c--3d">顶</span>
            </h1>
            <div ref="lineRef" class="co3-line"></div>
            <p class="co3-sub">向下滚动 · 12片三角面围成圆锥 · 顶点汇聚旋转展示</p>
          </header>

          <div ref="coneStage" class="co3-stage">
            <div ref="coneRef" class="co3-cone">
              <div v-for="(img, idx) in coneImages" :key="idx"
                :ref="(el) => setFaceRef(el, idx)" class="co3-face"
                :style="faceStyle(idx)">
                <img :src="img" class="co3-face__img" />
              </div>
              <!-- 底面圆 -->
              <div ref="baseRef" class="co3-base">
                <img :src="coneImages[0]" class="co3-base__img" />
              </div>
            </div>
          </div>

          <div class="co3-progress"><div ref="progRef" class="co3-progress__fill"></div></div>
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
//  CardImage3DCone — CSS3 3D圆锥体
//  12片三角面围绕顶点旋转，形成圆锥面
//  每面 rotateY(N×30°) rotateX(锥角) 向上汇聚于顶点
//  用户竖滚 → 圆锥旋转 + 俯仰
// ═══════════════════════════════════════════════════════════════════

type TweenCleanup = () => void
const PANELS = 12
const IMGS = ['https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=350&q=80','https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=350&q=80','https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=350&q=80','https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=350&q=80','https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=350&q=80','https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=350&q=80']
const coneImages = Array.from({length: PANELS}, (_, i) => IMGS[i % IMGS.length])
const CONE_ANGLE = 65 // 锥面倾斜角
const trackHeight = `${(PANELS / 4 + 3) * 100}vh`

const rootRef = ref<HTMLElement | null>(null); const scrollRef = ref<HTMLElement | null>(null); const trackRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null); const lineRef = ref<HTMLElement | null>(null)
const tc1 = ref<HTMLElement | null>(null); const tc2 = ref<HTMLElement | null>(null); const tc3 = ref<HTMLElement | null>(null); const tc4 = ref<HTMLElement | null>(null)
const coneStage = ref<HTMLElement | null>(null); const coneRef = ref<HTMLElement | null>(null); const baseRef = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null); const canvasRef = ref<HTMLCanvasElement | null>(null)
const glowA = ref<HTMLElement | null>(null); const glowB = ref<HTMLElement | null>(null)

const faceRefs = ref<HTMLElement[]>([])
const setFaceRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) faceRefs.value[i] = el }
const cleanupFns: TweenCleanup[] = []

function faceStyle(idx: number) {
  const ry = idx * (360 / PANELS)
  return { transform: `rotateY(${ry}deg) rotateX(${CONE_ANGLE}deg) translateZ(16vw)` }
}

// Canvas
interface ConeDust { x: number; y: number; vy: number; size: number; alpha: number; hue: number; life: number; maxLife: number }
let ctx: CanvasRenderingContext2D | null = null; let cw = 0; let ch = 0; let animId = 0; const dusts: ConeDust[] = []
function createDust(): ConeDust { return { x: Math.random() * cw, y: ch + 20, vy: -(0.3 + Math.random() * 2), size: 0.8 + Math.random() * 2, alpha: 0.2 + Math.random() * 0.35, hue: [30, 45, 25][Math.floor(Math.random() * 3)], life: 0, maxLife: 150 + Math.random() * 280 } }

function initCanvas() { const c = canvasRef.value; if (!c) return; ctx = c.getContext('2d'); if (!ctx) return
  const resize = () => { cw = window.innerWidth; ch = window.innerHeight; c.width = cw; c.height = ch }; resize(); window.addEventListener('resize', resize); cleanupFns.push(() => window.removeEventListener('resize', resize))
  for (let i = 0; i < 40; i++) dusts.push(createDust())
  function animate() { if (!ctx) return; ctx.clearRect(0, 0, cw, ch); while (dusts.length < 40) dusts.push(createDust())
    for (let i = dusts.length - 1; i >= 0; i--) { const d = dusts[i]; d.life++; if (d.life >= d.maxLife) { dusts.splice(i, 1); continue }; d.y += d.vy; const t = d.life / d.maxLife; const fade = t < 0.08 ? t / 0.08 : t > 0.7 ? 1 - (t - 0.7) / 0.3 : 1; ctx!.beginPath(); ctx!.arc(d.x, d.y, d.size, 0, Math.PI * 2); ctx!.fillStyle = `hsla(${d.hue}, 70%, 70%, ${d.alpha * fade})`; ctx!.fill(); if (d.y < -20) { d.y = ch + 20; d.x = Math.random() * cw; d.life = 0 } }
    animId = requestAnimationFrame(animate) }; animId = requestAnimationFrame(animate) }

function setupEntrance() { if (!scrollRef.value || !headerRef.value || !coneStage.value) return
  const tl = gsap.timeline({ scrollTrigger: { trigger: scrollRef.value, scroller: scrollRef.value, start: 'top 75%', toggleActions: 'play none none reverse' } })
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.85, ease: 'power3.out' })
    .fromTo([tc1.value, tc2.value, tc3.value, tc4.value], { autoAlpha: 0, rotateX: 90, scale: 0.3 }, { autoAlpha: 1, rotateX: 0, scale: 1, duration: 0.6, stagger: 0.08, ease: 'back.out(2.2)' }, '-=0.45')
    .fromTo(lineRef.value, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power3.inOut' }, '-=0.25')
    .fromTo(coneStage.value, { autoAlpha: 0, scale: 0.3, rotateX: -30 }, { autoAlpha: 1, scale: 1, rotateX: 15, duration: 0.9, ease: 'elastic.out(1, 0.5)' }, '-=0.35')
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() }) }

function setupCone() { if (!scrollRef.value || !trackRef.value || !coneRef.value) return
  const scroller = scrollRef.value; const track = trackRef.value; const cone = coneRef.value
  gsap.set(cone, { rotateY: 0, rotateX: 15 })
  const master = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.15 } })
  master.to(cone, { rotateY: 180, duration: 2, ease: 'power2.inOut' }, 0)
  master.to(cone, { rotateY: 360, duration: 2, ease: 'power2.inOut' }, 2)
  master.to(cone, { rotateX: 30, duration: 1.5, ease: 'sine.inOut' }, 0.5)
  master.to(cone, { rotateX: 5, duration: 1.5, ease: 'sine.inOut' }, 2)
  if (baseRef.value) { master.to(baseRef.value, { rotateY: 720, duration: 5, ease: 'none' }, 0) }
  for (let i = 0; i <= 4; i++) { master.to(cone, { scale: 1.04, duration: 0.1, ease: 'sine.inOut' }, i + 0.25); master.to(cone, { scale: 1, duration: 0.1, ease: 'sine.inOut' }, i + 0.4) }
  if (glowA.value && glowB.value) { master.to(glowA.value, { x: '6vw', y: '-4vh', scale: 1.15, duration: 4 }, 0); master.to(glowB.value, { x: '-4vw', y: '5vh', scale: 1.2, duration: 4 }, 0) }
  if (progRef.value) master.to(progRef.value, { width: '100%', duration: 4 }, 0)
  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() }) }

function handleResize() { ScrollTrigger.refresh(true) }
onMounted(() => { initCanvas(); requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupCone() })); window.addEventListener('resize', handleResize) })
onUnmounted(() => { window.removeEventListener('resize', handleResize); cancelAnimationFrame(animId); ScrollTrigger.getAll().forEach(st => st.kill()); cleanupFns.forEach(fn => fn()); cleanupFns.length = 0; dusts.length = 0 })
</script>

<style scoped lang="scss">
.co3-root { position: relative; width: 100vw; height: 100vh; overflow: hidden; background: linear-gradient(155deg, #fefaf7 0%, #fcf5ee 20%, #fdf7f2 40%, #fcf6ef 60%, #fdf8f3 80%, #fcf6f0 100%); font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif; }
.co3-glow { position: absolute; border-radius: 50%; filter: blur(65px); pointer-events: none; will-change: transform; z-index: 0; }
.co3-glow--a { width: 28vw; height: 28vw; top: -4vh; left: -2vw; background: radial-gradient(circle, rgba(255,160,130,.4) 0%, transparent 70%); }
.co3-glow--b { width: 24vw; height: 24vw; bottom: -4vh; right: -1vw; background: radial-gradient(circle, rgba(140,200,230,.35) 0%, transparent 70%); }
.co3-canvas { position: absolute; inset: 0; z-index: 1; pointer-events: none; }

.co3-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 2;
  &::-webkit-scrollbar { width: 5px; } &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(255,140,110,.3); &:hover { background: rgba(255,140,110,.5); } }
}
.co3-track { position: relative; width: 100%; } .co3-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

.co3-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 30; text-align: center; width: min(92vw, 800px); }
.co3-kicker { display: inline-block; font-size: .66rem; font-weight: 700; letter-spacing: .26em; text-transform: uppercase; color: rgba(200,130,110,.8); background: rgba(255,150,120,.1); backdrop-filter: blur(8px); border: 1px solid rgba(255,140,110,.2); border-radius: 999px; padding: .3rem 1.2rem; margin-bottom: .55rem; }
.co3-title { margin: 0; display: flex; justify-content: center; gap: .08em; }
.co3-title__c { display: inline-block; font-size: clamp(2.2rem, 5.5vw, 4.6rem); font-weight: 900; color: #c87058; will-change: transform,opacity;
  &--3d { background: linear-gradient(135deg, #ff8c69, #c87058, #ffb347); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 2px 14px rgba(255,120,80,.45)); }
}
.co3-line { width: 90px; height: 2px; margin: .45rem auto .6rem; background: linear-gradient(90deg, transparent, #ff8c69, #ffb347, transparent); }
.co3-sub { margin: 0; font-size: clamp(.76rem, 1.1vw, .88rem); color: rgba(180,110,90,.5); max-width: 460px; margin-inline: auto; }

.co3-stage { position: absolute; top: 48%; left: 50%; transform: translate(-50%, -50%) rotateX(15deg); width: 0; height: 0; z-index: 10; perspective: 800px; perspective-origin: 50% 40%; will-change: transform, opacity; }
.co3-cone { position: absolute; width: 0; height: 0; transform-style: preserve-3d; will-change: transform; }

.co3-face { position: absolute; width: 15vw; max-width: 130px; height: 20vw; max-height: 180px; margin-left: -7.5vw; margin-top: 0; backface-visibility: hidden; overflow: hidden; clip-path: polygon(50% 0%, 0% 100%, 100% 100%); transform-origin: 50% 0%; border-radius: 3px; box-shadow: 0 4px 15px rgba(0,0,0,.12); border: 1px solid rgba(255,255,255,.2); }
.co3-face__img { width: 100%; height: 100%; object-fit: cover; }

.co3-base { position: absolute; width: 18vw; max-width: 160px; height: 18vw; max-height: 160px; margin-left: -9vw; margin-top: 20vw; backface-visibility: hidden; border-radius: 50%; overflow: hidden; transform: rotateX(90deg) translateZ(-16vw); box-shadow: 0 0 30px rgba(0,0,0,.1); }
.co3-base__img { width: 100%; height: 100%; object-fit: cover; }

.co3-progress { position: absolute; left: 0; bottom: 0; z-index: 30; width: 100%; height: 3px; background: rgba(255,140,110,.06); }
.co3-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #ff8c69, #ffb347, #ff8c69); background-size: 200% 100%; box-shadow: 0 0 12px rgba(255,140,80,.5); }
@media (max-width: 768px) { .co3-header { top: 2vh; } .co3-kicker { font-size: .54rem; } .co3-title__c { font-size: 1.7rem; } }
</style>
