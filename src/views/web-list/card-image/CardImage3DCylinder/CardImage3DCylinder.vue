<template>
  <section ref="rootRef" class="cy3-root">
    <div ref="glowA" class="cy3-glow cy3-glow--a"></div>
    <div ref="glowB" class="cy3-glow cy3-glow--b"></div>
    <canvas ref="canvasRef" class="cy3-canvas"></canvas>

    <div ref="scrollRef" class="cy3-scroll">
      <div ref="trackRef" class="cy3-track" :style="{ height: trackHeight }">
        <div class="cy3-sticky">

          <header ref="headerRef" class="cy3-header">
            <span class="cy3-kicker">🥁 CSS 3D Cylinder · 旋转圆柱 🥁</span>
            <h1 class="cy3-title">
              <span ref="tc1" class="cy3-title__c">圆</span>
              <span ref="tc2" class="cy3-title__c cy3-title__c--3d">柱</span>
              <span ref="tc3" class="cy3-title__c">旋</span>
              <span ref="tc4" class="cy3-title__c cy3-title__c--3d">转</span>
            </h1>
            <div ref="lineRef" class="cy3-line"></div>
            <p class="cy3-sub">向下滚动 · 24块面板形成光滑圆柱 · 360°环绕旋转展示</p>
          </header>

          <!-- 🥁 3D圆柱 -->
          <div ref="cylStage" class="cy3-stage">
            <div ref="cylDrum" class="cy3-drum">
              <div
                v-for="(_, idx) in PANELS"
                :key="idx"
                :ref="(el) => setStripRef(el, idx)"
                class="cy3-strip"
                :style="stripStyle(idx)"
              >
                <div class="cy3-strip__img" :style="{ backgroundImage: `url(${stripImage(idx)})` }"></div>
              </div>
            </div>
          </div>

          <div ref="infoLabel" class="cy3-info">{{ imageLabels[currentLabel] }}</div>
          <div class="cy3-progress"><div ref="progRef" class="cy3-progress__fill"></div></div>
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
//  CardImage3DCylinder — CSS3 3D旋转圆柱
//  24块窄面板，每块 rotateY(i*15°) + translateZ(radius)
//  形成光滑的360°圆柱面，用户竖滚 → 圆柱绕Y轴旋转
// ═══════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

const PANELS = 24
const ANGLE = 360 / PANELS // 15°
const RADIUS = 38 // vw, 圆柱半径
const IMAGES = [
  'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=400&q=80',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80',
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&q=80',
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=400&q=80',
]
const imageLabels = ['珊瑚海', '金色田', '暖阳山', '天空林', '蜜桃花', '云光峦']
const currentLabel = ref(0)
const trackHeight = `${(PANELS / 6 + 2) * 100}vh`

const rootRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const lineRef = ref<HTMLElement | null>(null)
const tc1 = ref<HTMLElement | null>(null); const tc2 = ref<HTMLElement | null>(null)
const tc3 = ref<HTMLElement | null>(null); const tc4 = ref<HTMLElement | null>(null)
const cylStage = ref<HTMLElement | null>(null)
const cylDrum = ref<HTMLElement | null>(null)
const infoLabel = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const glowA = ref<HTMLElement | null>(null); const glowB = ref<HTMLElement | null>(null)

const stripRefs = ref<HTMLElement[]>([])
const setStripRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) stripRefs.value[i] = el }
const cleanupFns: TweenCleanup[] = []

function stripImage(idx: number) { return IMAGES[idx % IMAGES.length] }
function stripStyle(idx: number) {
  const ry = idx * ANGLE
  return { transform: `rotateY(${ry}deg) translateZ(${RADIUS}vw)` }
}

// Canvas
interface DrumSpark { x: number; y: number; vy: number; size: number; alpha: number; hue: number; life: number; maxLife: number }
let ctx: CanvasRenderingContext2D | null = null; let cw = 0; let ch = 0
let animId = 0; const sparks: DrumSpark[] = []

function createSpark(): DrumSpark {
  return { x: Math.random() * cw, y: ch + 20, vy: -(0.5 + Math.random() * 2), size: 1 + Math.random() * 2.5, alpha: 0.2 + Math.random() * 0.35, hue: [20, 190, 40, 330][Math.floor(Math.random() * 4)], life: 0, maxLife: 150 + Math.random() * 300 }
}

function initCanvas() {
  const c = canvasRef.value; if (!c) return
  ctx = c.getContext('2d'); if (!ctx) return
  const resize = () => { cw = window.innerWidth; ch = window.innerHeight; c.width = cw; c.height = ch }
  resize(); window.addEventListener('resize', resize)
  cleanupFns.push(() => window.removeEventListener('resize', resize))
  for (let i = 0; i < 40; i++) sparks.push(createSpark())

  function animate() {
    if (!ctx) return; ctx.clearRect(0, 0, cw, ch)
    while (sparks.length < 40) sparks.push(createSpark())
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i]; s.life++
      if (s.life >= s.maxLife) { sparks.splice(i, 1); continue }
      s.y += s.vy
      const t = s.life / s.maxLife; const fade = t < 0.08 ? t / 0.08 : t > 0.7 ? 1 - (t - 0.7) / 0.3 : 1
      ctx!.beginPath(); ctx!.arc(s.x, s.y, s.size, 0, Math.PI * 2)
      ctx!.fillStyle = `hsla(${s.hue}, 70%, 70%, ${s.alpha * fade})`; ctx!.fill()
      if (s.y < -20) { s.y = ch + 20; s.x = Math.random() * cw; s.life = 0 }
    }
    animId = requestAnimationFrame(animate)
  }
  animId = requestAnimationFrame(animate)
}

function setupEntrance() {
  if (!scrollRef.value || !headerRef.value || !cylStage.value) return
  const tl = gsap.timeline({ scrollTrigger: { trigger: scrollRef.value, scroller: scrollRef.value, start: 'top 75%', toggleActions: 'play none none reverse' } })
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.85, ease: 'power3.out' })
    .fromTo([tc1.value, tc2.value, tc3.value, tc4.value], { autoAlpha: 0, rotateX: 90, scale: 0.3 }, { autoAlpha: 1, rotateX: 0, scale: 1, duration: 0.6, stagger: 0.08, ease: 'back.out(2.2)' }, '-=0.45')
    .fromTo(lineRef.value, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power3.inOut' }, '-=0.25')
    .fromTo(cylStage.value, { autoAlpha: 0, rotateX: -20, scale: 0.6 }, { autoAlpha: 1, rotateX: 0, scale: 1, duration: 0.8, ease: 'power3.out' }, '-=0.35')
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

function setupCylinder() {
  if (!scrollRef.value || !trackRef.value || !cylDrum.value) return
  const scroller = scrollRef.value; const track = trackRef.value; const drum = cylDrum.value

  gsap.set(drum, { rotateY: 0, rotateX: 5 })

  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.1,
      onUpdate(self) {
        currentLabel.value = Math.floor((self.progress * (PANELS / 6)) % imageLabels.length)
      },
    },
  })

  // 圆柱旋转一圈360°，然后继续
  for (let i = 0; i <= 6; i++) {
    master.to(drum, { rotateY: i * 60, duration: 0.85, ease: 'power2.inOut' }, i * 0.85)
    master.to(drum, { rotateY: i * 60, duration: 0.15, ease: 'none' }, i * 0.85)
  }
  // 快速旋转一圈收尾
  master.to(drum, { rotateY: 720, duration: 1.5, ease: 'power2.inOut' }, 5.5)

  for (let i = 0; i <= 6; i++) {
    master.to(drum, { scale: 1.04, duration: 0.08, ease: 'sine.inOut' }, i * 0.85 + 0.2)
    master.to(drum, { scale: 1, duration: 0.1, ease: 'sine.inOut' }, i * 0.85 + 0.3)
  }

  if (glowA.value && glowB.value) {
    master.to(glowA.value, { x: '6vw', y: '-4vh', scale: 1.15, duration: 6 }, 0)
    master.to(glowB.value, { x: '-4vw', y: '5vh', scale: 1.2, duration: 6 }, 0)
  }
  if (progRef.value) master.to(progRef.value, { width: '100%', duration: 6 }, 0)

  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }

onMounted(() => {
  initCanvas()
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupCylinder() }))
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  cancelAnimationFrame(animId)
  ScrollTrigger.getAll().forEach(st => st.kill())
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0; sparks.length = 0
})
</script>

<style scoped lang="scss">
.cy3-root { position: relative; width: 100vw; height: 100vh; overflow: hidden; background: linear-gradient(155deg, #fefaf7 0%, #fdf6f0 20%, #fef8f4 40%, #fdf7f1 60%, #fef9f5 80%, #fdf7f2 100%); font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif; }
.cy3-glow { position: absolute; border-radius: 50%; filter: blur(65px); pointer-events: none; will-change: transform; z-index: 0; }
.cy3-glow--a { width: 28vw; height: 28vw; top: -4vh; left: -2vw; background: radial-gradient(circle, rgba(255,150,140,.4) 0%, transparent 70%); }
.cy3-glow--b { width: 24vw; height: 24vw; bottom: -4vh; right: -1vw; background: radial-gradient(circle, rgba(130,190,230,.38) 0%, transparent 70%); }
.cy3-canvas { position: absolute; inset: 0; z-index: 1; pointer-events: none; }

.cy3-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 2;
  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(255,140,130,.3); &:hover { background: rgba(255,140,130,.5); } }
}
.cy3-track { position: relative; width: 100%; }
.cy3-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

.cy3-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 30; text-align: center; width: min(92vw, 800px); }
.cy3-kicker { display: inline-block; font-size: .66rem; font-weight: 700; letter-spacing: .26em; text-transform: uppercase; color: rgba(200,130,110,.8); background: rgba(255,150,120,.1); backdrop-filter: blur(8px); border: 1px solid rgba(255,140,110,.2); border-radius: 999px; padding: .3rem 1.2rem; margin-bottom: .55rem; }
.cy3-title { margin: 0; display: flex; justify-content: center; gap: .08em; }
.cy3-title__c { display: inline-block; font-size: clamp(2.2rem, 5.5vw, 4.6rem); font-weight: 900; color: #c87058; will-change: transform,opacity;
  &--3d { background: linear-gradient(135deg, #ff7b5a, #60b8f0, #ffb347); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 2px 14px rgba(100,170,230,.45)); }
}
.cy3-line { width: 90px; height: 2px; margin: .45rem auto .6rem; background: linear-gradient(90deg, transparent, #ff7b5a, #60b8f0, transparent); }
.cy3-sub { margin: 0; font-size: clamp(.76rem, 1.1vw, .88rem); color: rgba(180,110,90,.5); max-width: 480px; margin-inline: auto; }

/* ═══════════════ 3D圆柱 ═══════════════ */
.cy3-stage {
  position: absolute; top: 48%; left: 50%;
  transform: translate(-50%, -50%);
  width: 0; height: 0; z-index: 10;
  perspective: 1000px; perspective-origin: 50% 40%;
  will-change: transform, opacity;
}

.cy3-drum {
  position: absolute; width: 0; height: 0;
  transform-style: preserve-3d; will-change: transform;
}

/* 24条窄面板形成光滑圆柱 */
.cy3-strip {
  position: absolute;
  width: calc(2 * 3.14159 * 38vw / 24); // 周长/面板数
  max-width: 50px;
  height: 52vh; max-height: 420px;
  margin-left: calc(-1 * 3.14159 * 38vw / 24);
  margin-top: -26vh;
  backface-visibility: hidden;
  overflow: hidden;
  border-left: 1px solid rgba(255,255,255,.1);
}

.cy3-strip__img {
  width: 100%; height: 100%;
  background-size: cover;
  background-position: center;
}

.cy3-info { position: absolute; bottom: 4vh; left: 50%; transform: translateX(-50%); z-index: 25; font-size: .7rem; font-weight: 700; letter-spacing: .25em; color: #c87058; background: rgba(255,255,255,.45); backdrop-filter: blur(8px); border-radius: 999px; padding: .25rem 1rem; pointer-events: none; }
.cy3-progress { position: absolute; left: 0; bottom: 0; z-index: 30; width: 100%; height: 3px; background: rgba(255,140,120,.06); }
.cy3-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #ff7b5a, #60b8f0, #ffb347, #ff7b5a); background-size: 200% 100%; box-shadow: 0 0 12px rgba(255,130,100,.5); }
@media (max-width: 768px) { .cy3-header { top: 2vh; } .cy3-kicker { font-size: .54rem; } .cy3-title__c { font-size: 1.7rem; } .cy3-strip { height: 40vh; margin-top: -20vh; } }
</style>
