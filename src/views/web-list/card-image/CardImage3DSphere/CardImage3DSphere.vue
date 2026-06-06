<template>
  <section ref="rootRef" class="gs3-root">
    <div ref="glowA" class="gs3-glow gs3-glow--a"></div>
    <div ref="glowB" class="gs3-glow gs3-glow--b"></div>
    <canvas ref="canvasRef" class="gs3-canvas"></canvas>

    <div ref="scrollRef" class="gs3-scroll">
      <div ref="trackRef" class="gs3-track" :style="{ height: trackHeight }">
        <div class="gs3-sticky">

          <header ref="headerRef" class="gs3-header">
            <span class="gs3-kicker">🌐 CSS 3D Sphere · 立体球体 🌐</span>
            <h1 class="gs3-title">
              <span ref="tc1" class="gs3-title__c">球</span>
              <span ref="tc2" class="gs3-title__c gs3-title__c--3d">体</span>
              <span ref="tc3" class="gs3-title__c">地</span>
              <span ref="tc4" class="gs3-title__c gs3-title__c--3d">球</span>
            </h1>
            <div ref="lineRef" class="gs3-line"></div>
            <p class="gs3-sub">向下滚动 · 5纬线×8经线=40面片球体 · 像地球仪般旋转</p>
          </header>

          <div ref="sphereStage" class="gs3-stage">
            <div ref="sphereRef" class="gs3-sphere">
              <div v-for="(panel, idx) in spherePanels" :key="idx"
                :ref="(el) => setPanelRef(el, idx)" class="gs3-panel"
                :style="panel.style">
                <img :src="panel.src" class="gs3-panel__img" loading="eager" />
              </div>
            </div>
          </div>

          <div class="gs3-progress"><div ref="progRef" class="gs3-progress__fill"></div></div>
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
//  CardImage3DSphere — CSS3 3D球体
//  5条纬线(lat) × 8条经线(lon) = 40个四边形面片
//  每面片：rotateY(lon) rotateX(lat) translateZ(R)
//  形成近似的球面，用户竖滚 → 球体旋转
// ═══════════════════════════════════════════════════════════════════

type TweenCleanup = () => void
const LATS = 5; const LONS = 8
const R = 24 // vw 球半径
const IMGS = ['https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=250&q=80','https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=250&q=80','https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=250&q=80','https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=250&q=80','https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=250&q=80','https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=250&q=80']

interface SpherePanel { src: string; style: string }
const spherePanels: SpherePanel[] = []

for (let lat = 0; lat < LATS; lat++) {
  for (let lon = 0; lon < LONS; lon++) {
    const latAngle = (lat / (LATS - 1) - 0.5) * 160 // -80° → +80°
    const lonAngle = (lon / LONS) * 360
    spherePanels.push({
      src: IMGS[(lat * LONS + lon) % IMGS.length],
      style: `transform: rotateY(${lonAngle}deg) rotateX(${latAngle}deg) translateZ(${R}vw)`,
    })
  }
}

const trackHeight = `${(LATS + 3) * 100}vh`

const rootRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null); const trackRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null); const lineRef = ref<HTMLElement | null>(null)
const tc1 = ref<HTMLElement | null>(null); const tc2 = ref<HTMLElement | null>(null)
const tc3 = ref<HTMLElement | null>(null); const tc4 = ref<HTMLElement | null>(null)
const sphereStage = ref<HTMLElement | null>(null); const sphereRef = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const glowA = ref<HTMLElement | null>(null); const glowB = ref<HTMLElement | null>(null)

const panelRefs = ref<HTMLElement[]>([])
const setPanelRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) panelRefs.value[i] = el }
const cleanupFns: TweenCleanup[] = []

// Canvas orbit
interface OrbitDust { x: number; y: number; vy: number; size: number; alpha: number; hue: number; life: number; maxLife: number }
let ctx: CanvasRenderingContext2D | null = null; let cw = 0; let ch = 0
let animId = 0; const dusts: OrbitDust[] = []
function createDust(): OrbitDust { return { x: Math.random() * cw, y: ch + 20, vy: -(0.3 + Math.random() * 2.2), size: 1 + Math.random() * 2.2, alpha: 0.2 + Math.random() * 0.4, hue: [200, 340, 40, 280][Math.floor(Math.random() * 4)], life: 0, maxLife: 150 + Math.random() * 300 } }

function initCanvas() {
  const c = canvasRef.value; if (!c) return; ctx = c.getContext('2d'); if (!ctx) return
  const resize = () => { cw = window.innerWidth; ch = window.innerHeight; c.width = cw; c.height = ch }
  resize(); window.addEventListener('resize', resize)
  cleanupFns.push(() => window.removeEventListener('resize', resize))
  for (let i = 0; i < 50; i++) dusts.push(createDust())
  function animate() {
    if (!ctx) return; ctx.clearRect(0, 0, cw, ch)
    while (dusts.length < 50) dusts.push(createDust())
    for (let i = dusts.length - 1; i >= 0; i--) { const d = dusts[i]; d.life++; if (d.life >= d.maxLife) { dusts.splice(i, 1); continue }; d.y += d.vy; const t = d.life / d.maxLife; const fade = t < 0.08 ? t / 0.08 : t > 0.7 ? 1 - (t - 0.7) / 0.3 : 1; ctx!.beginPath(); ctx!.arc(d.x, d.y, d.size, 0, Math.PI * 2); ctx!.fillStyle = `hsla(${d.hue}, 70%, 72%, ${d.alpha * fade})`; ctx!.fill(); if (d.y < -20) { d.y = ch + 20; d.x = Math.random() * cw; d.life = 0 } }
    animId = requestAnimationFrame(animate)
  }
  animId = requestAnimationFrame(animate)
}

function setupEntrance() {
  if (!scrollRef.value || !headerRef.value || !sphereStage.value) return
  const tl = gsap.timeline({ scrollTrigger: { trigger: scrollRef.value, scroller: scrollRef.value, start: 'top 75%', toggleActions: 'play none none reverse' } })
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.85, ease: 'power3.out' })
    .fromTo([tc1.value, tc2.value, tc3.value, tc4.value], { autoAlpha: 0, rotateX: 90, scale: 0.2 }, { autoAlpha: 1, rotateX: 0, scale: 1, duration: 0.6, stagger: 0.08, ease: 'back.out(2.2)' }, '-=0.45')
    .fromTo(lineRef.value, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power3.inOut' }, '-=0.25')
    .fromTo(sphereStage.value, { autoAlpha: 0, scale: 0.3 }, { autoAlpha: 1, scale: 1, duration: 0.9, ease: 'elastic.out(1, 0.5)' }, '-=0.35')
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

function setupSphere() {
  if (!scrollRef.value || !trackRef.value || !sphereRef.value) return
  const scroller = scrollRef.value; const track = trackRef.value; const sphere = sphereRef.value
  gsap.set(sphere, { rotateY: 0, rotateX: 5 })
  const master = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.1 } })

  // 🌐 经线旋转(Y) + 纬线倾斜(X)
  master.to(sphere, { rotateY: 180, duration: 1.5, ease: 'power2.inOut' }, 0)
  master.to(sphere, { rotateY: 360, duration: 1.5, ease: 'power2.inOut' }, 1.5)
  master.to(sphere, { rotateY: 540, duration: 1.5, ease: 'power2.inOut' }, 2.8)
  master.to(sphere, { rotateX: -15, duration: 1.8, ease: 'sine.inOut' }, 0.5)
  master.to(sphere, { rotateX: 20, duration: 1.8, ease: 'sine.inOut' }, 2.3)

  for (let i = 0; i <= 4; i++) { master.to(sphere, { scale: 1.04, duration: 0.08, ease: 'sine.inOut' }, i + 0.25); master.to(sphere, { scale: 1, duration: 0.1, ease: 'sine.inOut' }, i + 0.4) }
  if (glowA.value && glowB.value) { master.to(glowA.value, { x: '6vw', y: '-4vh', scale: 1.15, duration: 4 }, 0); master.to(glowB.value, { x: '-4vw', y: '5vh', scale: 1.2, duration: 4 }, 0) }
  if (progRef.value) master.to(progRef.value, { width: '100%', duration: 4 }, 0)
  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }
onMounted(() => { initCanvas(); requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupSphere() })); window.addEventListener('resize', handleResize) })
onUnmounted(() => { window.removeEventListener('resize', handleResize); cancelAnimationFrame(animId); ScrollTrigger.getAll().forEach(st => st.kill()); cleanupFns.forEach(fn => fn()); cleanupFns.length = 0; dusts.length = 0 })
</script>

<style scoped lang="scss">
.gs3-root { position: relative; width: 100vw; height: 100vh; overflow: hidden; background: linear-gradient(150deg, #f6fafe 0%, #fef9fb 25%, #f8fcfd 50%, #fdf8fa 75%, #f7fbfe 100%); font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif; }
.gs3-glow { position: absolute; border-radius: 50%; filter: blur(65px); pointer-events: none; will-change: transform; z-index: 0; }
.gs3-glow--a { width: 30vw; height: 30vw; top: -4vh; left: -2vw; background: radial-gradient(circle, rgba(130,190,240,.35) 0%, transparent 70%); }
.gs3-glow--b { width: 26vw; height: 26vw; bottom: -4vh; right: -1vw; background: radial-gradient(circle, rgba(200,160,230,.33) 0%, transparent 70%); }
.gs3-canvas { position: absolute; inset: 0; z-index: 1; pointer-events: none; }

.gs3-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 2;
  &::-webkit-scrollbar { width: 5px; } &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(130,180,220,.3); &:hover { background: rgba(130,180,220,.5); } }
}
.gs3-track { position: relative; width: 100%; } .gs3-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

.gs3-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 30; text-align: center; width: min(92vw, 800px); }
.gs3-kicker { display: inline-block; font-size: .66rem; font-weight: 700; letter-spacing: .26em; text-transform: uppercase; color: rgba(90,140,200,.8); background: rgba(130,180,230,.1); backdrop-filter: blur(8px); border: 1px solid rgba(120,170,220,.2); border-radius: 999px; padding: .3rem 1.2rem; margin-bottom: .55rem; }
.gs3-title { margin: 0; display: flex; justify-content: center; gap: .08em; }
.gs3-title__c { display: inline-block; font-size: clamp(2.2rem, 5.5vw, 4.6rem); font-weight: 900; color: #5090c8; will-change: transform,opacity;
  &--3d { background: linear-gradient(135deg, #5ac8fa, #5090c8, #a0d0f0); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 2px 16px rgba(80,150,210,.55)); }
}
.gs3-line { width: 90px; height: 2px; margin: .45rem auto .6rem; background: linear-gradient(90deg, transparent, #5ac8fa, #a0d0f0, transparent); }
.gs3-sub { margin: 0; font-size: clamp(.76rem, 1.1vw, .88rem); color: rgba(80,130,180,.5); max-width: 480px; margin-inline: auto; }

.gs3-stage { position: absolute; top: 48%; left: 50%; transform: translate(-50%, -50%); width: 0; height: 0; z-index: 10; perspective: 900px; perspective-origin: 50% 50%; will-change: transform, opacity; }
.gs3-sphere { position: absolute; width: 0; height: 0; transform-style: preserve-3d; will-change: transform; }

.gs3-panel {
  position: absolute;
  width: 9vw; max-width: 75px;
  height: 9vw; max-height: 75px;
  margin-left: -4.5vw; margin-top: -4.5vw;
  backface-visibility: hidden;
  border-radius: 4px; overflow: hidden;
  box-shadow: 0 3px 12px rgba(0,0,0,.12);
  border: 1px solid rgba(255,255,255,.2);
}
.gs3-panel__img { width: 100%; height: 100%; object-fit: cover; }

.gs3-progress { position: absolute; left: 0; bottom: 0; z-index: 30; width: 100%; height: 3px; background: rgba(130,180,220,.06); }
.gs3-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #5ac8fa, #5090c8, #a0d0f0, #5ac8fa); background-size: 200% 100%; box-shadow: 0 0 12px rgba(80,150,210,.5); }
@media (max-width: 768px) { .gs3-header { top: 2vh; } .gs3-kicker { font-size: .54rem; } .gs3-title__c { font-size: 1.7rem; } .gs3-panel { width: 12vw; height: 12vw; margin-left: -6vw; margin-top: -6vw; } }
</style>
