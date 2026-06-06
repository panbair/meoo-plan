<template>
  <section ref="rootRef" class="mb3-root">
    <div ref="glowA" class="mb3-glow mb3-glow--a"></div>
    <div ref="glowB" class="mb3-glow mb3-glow--b"></div>
    <canvas ref="canvasRef" class="mb3-canvas"></canvas>

    <div ref="scrollRef" class="mb3-scroll">
      <div ref="trackRef" class="mb3-track" :style="{ height: trackHeight }">
        <div class="mb3-sticky">

          <header ref="headerRef" class="mb3-header">
            <span class="mb3-kicker">∞ CSS 3D Möbius · 莫比乌斯环 ∞</span>
            <h1 class="mb3-title">
              <span ref="tc1" class="mb3-title__c">莫</span>
              <span ref="tc2" class="mb3-title__c mb3-title__c--3d">比</span>
              <span ref="tc3" class="mb3-title__c">乌</span>
              <span ref="tc4" class="mb3-title__c mb3-title__c--3d">斯</span>
            </h1>
            <div ref="lineRef" class="mb3-line"></div>
            <p class="mb3-sub">向下滚动 · 20段半扭转环带 · 数学之美的3D呈现</p>
          </header>

          <!-- ∞ 3D莫比乌斯环 -->
          <div ref="mbStage" class="mb3-stage">
            <div ref="mbRing" class="mb3-ring">
              <div v-for="(img, idx) in mobiusImages" :key="idx"
                :ref="(el) => setSegRef(el, idx)" class="mb3-seg"
                :style="segTransform(idx)">
                <img :src="img" class="mb3-seg__img" />
              </div>
            </div>
          </div>

          <div class="mb3-progress"><div ref="progRef" class="mb3-progress__fill"></div></div>
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
//  CardImage3DMobius — CSS3 3D莫比乌斯环
//
//  20段面板沿圆环分布，每段绕自身轴旋转半圈(180°/20=9°/段)
//  形成经典的半扭转单面曲面
//  公式：rotateY(大圆角度) translateZ(R) rotateX(渐进扭转角)
//  用户竖滚 → 环带流动旋转
// ═══════════════════════════════════════════════════════════════════

type TweenCleanup = () => void
const SEGS = 20
const IMGS = ['https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=300&q=80','https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=300&q=80','https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&q=80','https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&q=80','https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=300&q=80']
const mobiusImages = Array.from({length: SEGS}, (_, i) => IMGS[i % IMGS.length])
const R = 26 // vw 环半径
const trackHeight = `${(SEGS / 5 + 3) * 100}vh`

const rootRef = ref<HTMLElement | null>(null); const scrollRef = ref<HTMLElement | null>(null); const trackRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null); const lineRef = ref<HTMLElement | null>(null)
const tc1 = ref<HTMLElement | null>(null); const tc2 = ref<HTMLElement | null>(null); const tc3 = ref<HTMLElement | null>(null); const tc4 = ref<HTMLElement | null>(null)
const mbStage = ref<HTMLElement | null>(null); const mbRing = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null); const canvasRef = ref<HTMLCanvasElement | null>(null)
const glowA = ref<HTMLElement | null>(null); const glowB = ref<HTMLElement | null>(null)

const segRefs = ref<HTMLElement[]>([])
const setSegRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) segRefs.value[i] = el }
const cleanupFns: TweenCleanup[] = []

// 🔑 莫比乌斯变换：大圆角度 + 半扭转
function segTransform(idx: number) {
  const bigAngle = (idx / SEGS) * 360
  // 半扭转：从0°渐进到180°（莫比乌斯环的精髓）
  const twistAngle = (idx / SEGS) * 180
  return { transform: `rotateY(${bigAngle}deg) translateZ(${R}vw) rotateX(${twistAngle}deg)` }
}

// Canvas
interface MoParticle { x: number; y: number; vy: number; size: number; alpha: number; hue: number; life: number; maxLife: number }
let ctx: CanvasRenderingContext2D | null = null; let cw = 0; let ch = 0; let animId = 0; const particles: MoParticle[] = []
function createParticle(): MoParticle { return { x: Math.random() * cw, y: ch + 20, vy: -(0.3 + Math.random() * 2), size: 0.8 + Math.random() * 2, alpha: 0.2 + Math.random() * 0.4, hue: [280, 200, 340, 45][Math.floor(Math.random() * 4)], life: 0, maxLife: 150 + Math.random() * 300 } }

function initCanvas() {
  const c = canvasRef.value; if (!c) return; ctx = c.getContext('2d'); if (!ctx) return
  const resize = () => { cw = window.innerWidth; ch = window.innerHeight; c.width = cw; c.height = ch }
  resize(); window.addEventListener('resize', resize); cleanupFns.push(() => window.removeEventListener('resize', resize))
  for (let i = 0; i < 45; i++) particles.push(createParticle())

  function animate() {
    if (!ctx) return; ctx.clearRect(0, 0, cw, ch)
    while (particles.length < 45) particles.push(createParticle())
    for (let i = particles.length - 1; i >= 0; i--) { const p = particles[i]; p.life++; if (p.life >= p.maxLife) { particles.splice(i, 1); continue }; p.y += p.vy; const t = p.life / p.maxLife; const fade = t < 0.08 ? t / 0.08 : t > 0.7 ? 1 - (t - 0.7) / 0.3 : 1; ctx!.beginPath(); ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx!.fillStyle = `hsla(${p.hue}, 70%, 72%, ${p.alpha * fade})`; ctx!.fill(); if (p.y < -20) { p.y = ch + 20; p.x = Math.random() * cw; p.life = 0 } }
    animId = requestAnimationFrame(animate)
  }
  animId = requestAnimationFrame(animate)
}

function setupEntrance() {
  if (!scrollRef.value || !headerRef.value || !mbStage.value) return
  const tl = gsap.timeline({ scrollTrigger: { trigger: scrollRef.value, scroller: scrollRef.value, start: 'top 75%', toggleActions: 'play none none reverse' } })
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.85, ease: 'power3.out' })
    .fromTo([tc1.value, tc2.value, tc3.value, tc4.value], { autoAlpha: 0, rotateX: 90, scale: 0.2 }, { autoAlpha: 1, rotateX: 0, scale: 1, duration: 0.6, stagger: 0.08, ease: 'back.out(2.2)' }, '-=0.45')
    .fromTo(lineRef.value, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power3.inOut' }, '-=0.25')
    .fromTo(mbStage.value, { autoAlpha: 0, rotateX: -40, scale: 0.3 }, { autoAlpha: 1, rotateX: -5, scale: 1, duration: 0.9, ease: 'elastic.out(1, 0.5)' }, '-=0.35')
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

function setupMobius() {
  if (!scrollRef.value || !trackRef.value || !mbRing.value) return
  const scroller = scrollRef.value; const track = trackRef.value; const ring = mbRing.value
  gsap.set(ring, { rotateY: 0, rotateX: -5 })

  const master = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.2 } })

  // ∞ 环带绕Y轴旋转
  master.to(ring, { rotateY: 180, duration: 2, ease: 'power2.inOut' }, 0)
  master.to(ring, { rotateY: 360, duration: 2, ease: 'power2.inOut' }, 1.8)
  master.to(ring, { rotateY: 540, duration: 2, ease: 'power2.inOut' }, 3.2)
  // X轴来回倾斜
  master.to(ring, { rotateX: -20, duration: 1.5, ease: 'sine.inOut' }, 0.5)
  master.to(ring, { rotateX: 10, duration: 1.5, ease: 'sine.inOut' }, 2)
  master.to(ring, { rotateX: 0, duration: 1.5, ease: 'sine.inOut' }, 3.5)

  for (let i = 0; i <= 5; i++) { master.to(ring, { scale: 1.05, duration: 0.08, ease: 'sine.inOut' }, i + 0.25); master.to(ring, { scale: 1, duration: 0.1, ease: 'sine.inOut' }, i + 0.4) }
  if (glowA.value && glowB.value) { master.to(glowA.value, { x: '6vw', y: '-4vh', scale: 1.15, duration: 5 }, 0); master.to(glowB.value, { x: '-4vw', y: '5vh', scale: 1.2, duration: 5 }, 0) }
  if (progRef.value) master.to(progRef.value, { width: '100%', duration: 5 }, 0)
  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }
onMounted(() => { initCanvas(); requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupMobius() })); window.addEventListener('resize', handleResize) })
onUnmounted(() => { window.removeEventListener('resize', handleResize); cancelAnimationFrame(animId); ScrollTrigger.getAll().forEach(st => st.kill()); cleanupFns.forEach(fn => fn()); cleanupFns.length = 0; particles.length = 0 })
</script>

<style scoped lang="scss">
.mb3-root { position: relative; width: 100vw; height: 100vh; overflow: hidden; background: linear-gradient(155deg, #fefafe 0%, #fcf7fa 20%, #fdf9fc 40%, #fcf6f9 60%, #fdf8fb 80%, #fcf7fa 100%); font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif; }
.mb3-glow { position: absolute; border-radius: 50%; filter: blur(60px); pointer-events: none; will-change: transform; z-index: 0; }
.mb3-glow--a { width: 28vw; height: 28vw; top: -4vh; left: -2vw; background: radial-gradient(circle, rgba(200,150,240,.38) 0%, transparent 70%); }
.mb3-glow--b { width: 24vw; height: 24vw; bottom: -4vh; right: -1vw; background: radial-gradient(circle, rgba(150,180,230,.35) 0%, transparent 70%); }
.mb3-canvas { position: absolute; inset: 0; z-index: 1; pointer-events: none; }

.mb3-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 2;
  &::-webkit-scrollbar { width: 5px; } &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(180,150,220,.3); &:hover { background: rgba(180,150,220,.5); } }
}
.mb3-track { position: relative; width: 100%; } .mb3-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

.mb3-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 30; text-align: center; width: min(92vw, 800px); }
.mb3-kicker { display: inline-block; font-size: .66rem; font-weight: 700; letter-spacing: .26em; text-transform: uppercase; color: rgba(160,130,210,.8); background: rgba(180,150,230,.1); backdrop-filter: blur(8px); border: 1px solid rgba(160,140,210,.2); border-radius: 999px; padding: .3rem 1.2rem; margin-bottom: .55rem; }
.mb3-title { margin: 0; display: flex; justify-content: center; gap: .08em; }
.mb3-title__c { display: inline-block; font-size: clamp(2.2rem, 5.5vw, 4.6rem); font-weight: 900; color: #9878d0; will-change: transform,opacity;
  &--3d { background: linear-gradient(135deg, #c0a0f0, #8090e0, #c0a0f0); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 2px 14px rgba(150,130,220,.5)); }
}
.mb3-line { width: 100px; height: 2px; margin: .45rem auto .6rem; background: linear-gradient(90deg, transparent, #c0a0f0, #8090e0, transparent); }
.mb3-sub { margin: 0; font-size: clamp(.76rem, 1.1vw, .88rem); color: rgba(150,120,200,.5); max-width: 460px; margin-inline: auto; }

.mb3-stage { position: absolute; top: 48%; left: 50%; transform: translate(-50%, -50%) rotateX(-5deg); width: 0; height: 0; z-index: 10; perspective: 800px; perspective-origin: 50% 50%; will-change: transform, opacity; }
.mb3-ring { position: absolute; width: 0; height: 0; transform-style: preserve-3d; will-change: transform; }

.mb3-seg {
  position: absolute; width: 7vw; max-width: 60px; height: 4vw; max-height: 35px;
  margin-left: -3.5vw; margin-top: -2vw;
  backface-visibility: hidden; border-radius: 4px; overflow: hidden;
  box-shadow: 0 3px 12px rgba(0,0,0,.14); border: 1px solid rgba(255,255,255,.2);
}
.mb3-seg__img { width: 100%; height: 100%; object-fit: cover; }

.mb3-progress { position: absolute; left: 0; bottom: 0; z-index: 30; width: 100%; height: 3px; background: rgba(180,150,220,.06); }
.mb3-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #c0a0f0, #8090e0, #c0a0f0); background-size: 200% 100%; box-shadow: 0 0 12px rgba(160,140,220,.5); }
@media (max-width: 768px) { .mb3-header { top: 2vh; } .mb3-kicker { font-size: .54rem; } .mb3-title__c { font-size: 1.7rem; } .mb3-seg { width: 9vw; height: 5vw; margin-left: -4.5vw; margin-top: -2.5vw; } }
</style>
