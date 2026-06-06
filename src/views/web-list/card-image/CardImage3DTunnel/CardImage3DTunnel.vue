<template>
  <section ref="rootRef" class="tn3-root">
    <div ref="glowA" class="tn3-glow tn3-glow--a"></div>
    <div ref="glowB" class="tn3-glow tn3-glow--b"></div>
    <canvas ref="canvasRef" class="tn3-canvas"></canvas>

    <div ref="scrollRef" class="tn3-scroll">
      <div ref="trackRef" class="tn3-track" :style="{ height: trackHeight }">
        <div class="tn3-sticky">

          <header ref="headerRef" class="tn3-header">
            <span class="tn3-kicker">🚇 CSS 3D Tunnel · 穿越隧道 🚇</span>
            <h1 class="tn3-title">
              <span ref="tc1" class="tn3-title__c">穿</span>
              <span ref="tc2" class="tn3-title__c tn3-title__c--3d">越</span>
              <span ref="tc3" class="tn3-title__c">隧</span>
              <span ref="tc4" class="tn3-title__c tn3-title__c--3d">道</span>
            </h1>
            <div ref="lineRef" class="tn3-line"></div>
            <p class="tn3-sub">向下滚动 · 内窥隧道视角 · 6层环从远方逼近穿越</p>
          </header>

          <!-- 🚇 隧道：多层环，内壁贴图，相机看穿 -->
          <div ref="tunnelStage" class="tn3-stage">
            <div ref="tunnelRef" class="tn3-tunnel">
              <div v-for="(ring, rIdx) in RINGS" :key="rIdx"
                :ref="(el) => setRingRef(el, rIdx)" class="tn3-ring"
                :style="ringBaseStyle(rIdx)">
                <div v-for="(_, pIdx) in ring.panels" :key="pIdx"
                  class="tn3-panel"
                  :style="panelStyle(rIdx, pIdx, ring.panels)">
                  <img :src="ringImgs[rIdx % ringImgs.length]" class="tn3-panel__img" />
                </div>
              </div>
            </div>
          </div>

          <div class="tn3-progress"><div ref="progRef" class="tn3-progress__fill"></div></div>
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
//  CardImage3DTunnel — CSS3 3D穿越隧道
//  6层环从远到近排列(Z轴)，每环内壁贴图
//  环半径: 远的环小(透视缩小)，近的环大
//  用户竖滚 → 相机推进穿越隧道，环从远处逼近
//  类似星际穿越的隧道效果
// ═══════════════════════════════════════════════════════════════════

type TweenCleanup = () => void
const ringImgs = ['https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=350&q=80','https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=350&q=80','https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=350&q=80','https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=350&q=80','https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=350&q=80','https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=350&q=80']
const RINGS = [
  { panels: 12, radius: 8, z: -60, scale: 0.2 },
  { panels: 12, radius: 12, z: -38, scale: 0.35 },
  { panels: 12, radius: 16, z: -20, scale: 0.55 },
  { panels: 10, radius: 22, z: 0, scale: 0.75 },
  { panels: 10, radius: 30, z: 22, scale: 0.9 },
  { panels: 8, radius: 40, z: 48, scale: 1.0 },
]
const trackHeight = `${(RINGS.length + 3) * 100}vh`

const rootRef = ref<HTMLElement | null>(null); const scrollRef = ref<HTMLElement | null>(null); const trackRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null); const lineRef = ref<HTMLElement | null>(null)
const tc1 = ref<HTMLElement | null>(null); const tc2 = ref<HTMLElement | null>(null); const tc3 = ref<HTMLElement | null>(null); const tc4 = ref<HTMLElement | null>(null)
const tunnelStage = ref<HTMLElement | null>(null); const tunnelRef = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null); const canvasRef = ref<HTMLCanvasElement | null>(null)
const glowA = ref<HTMLElement | null>(null); const glowB = ref<HTMLElement | null>(null)

const ringRefs = ref<HTMLElement[]>([])
const setRingRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) ringRefs.value[i] = el }
const cleanupFns: TweenCleanup[] = []

function ringBaseStyle(rIdx: number) {
  const r = RINGS[rIdx]
  return { transform: `translateZ(${r.z}vw) scale(${r.scale})`, zIndex: 100 - rIdx }
}

function panelStyle(rIdx: number, pIdx: number, count: number) {
  const angle = (pIdx / count) * 360
  const r = RINGS[rIdx]
  // 内壁贴图：面板面向中心
  return { transform: `rotateY(${angle}deg) translateZ(${r.radius}vw) rotateY(90deg)` }
}

// Canvas streak
interface Streak { x: number; y: number; vy: number; len: number; alpha: number; hue: number; life: number; maxLife: number }
let ctx: CanvasRenderingContext2D | null = null; let cw = 0; let ch = 0; let animId = 0; const streaks: Streak[] = []
function createStreak(): Streak { return { x: Math.random() * cw, y: ch + 30, vy: -(3 + Math.random() * 8), len: 20 + Math.random() * 80, alpha: 0.3 + Math.random() * 0.5, hue: [200, 280, 340, 40][Math.floor(Math.random() * 4)], life: 0, maxLife: 60 + Math.random() * 80 } }

function initCanvas() {
  const c = canvasRef.value; if (!c) return; ctx = c.getContext('2d'); if (!ctx) return
  const resize = () => { cw = window.innerWidth; ch = window.innerHeight; c.width = cw; c.height = ch }
  resize(); window.addEventListener('resize', resize); cleanupFns.push(() => window.removeEventListener('resize', resize))
  function animate() {
    if (!ctx) return; ctx.clearRect(0, 0, cw, ch)
    if (Math.random() > 0.6) streaks.push(createStreak())
    while (streaks.length > 60) streaks.shift()
    for (let i = streaks.length - 1; i >= 0; i--) { const s = streaks[i]; s.life++; if (s.life >= s.maxLife) { streaks.splice(i, 1); continue }; s.y += s.vy; const t = s.life / s.maxLife; const fade = t < 0.1 ? t / 0.1 : t > 0.7 ? 1 - (t - 0.7) / 0.3 : 1; const grad = ctx!.createLinearGradient(s.x, s.y, s.x, s.y + s.len); grad.addColorStop(0, `hsla(${s.hue}, 80%, 75%, ${s.alpha * fade})`); grad.addColorStop(1, `hsla(${s.hue}, 60%, 55%, 0)`); ctx!.beginPath(); ctx!.moveTo(s.x, s.y); ctx!.lineTo(s.x, s.y + s.len); ctx!.strokeStyle = grad; ctx!.lineWidth = 1.5; ctx!.stroke(); if (s.y < -100) streaks.splice(i, 1) }
    animId = requestAnimationFrame(animate)
  }
  animId = requestAnimationFrame(animate)
}

function setupEntrance() {
  if (!scrollRef.value || !headerRef.value || !tunnelStage.value) return
  const tl = gsap.timeline({ scrollTrigger: { trigger: scrollRef.value, scroller: scrollRef.value, start: 'top 75%', toggleActions: 'play none none reverse' } })
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.85, ease: 'power3.out' })
    .fromTo([tc1.value, tc2.value, tc3.value, tc4.value], { autoAlpha: 0, z: -300, scale: 0.2 }, { autoAlpha: 1, z: 0, scale: 1, duration: 0.6, stagger: 0.08, ease: 'back.out(2.2)' }, '-=0.45')
    .fromTo(lineRef.value, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power3.inOut' }, '-=0.25')
    .fromTo(tunnelStage.value, { autoAlpha: 0, scale: 0.5 }, { autoAlpha: 1, scale: 1, duration: 0.8, ease: 'power3.out' }, '-=0.35')
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

function setupTunnel() {
  if (!scrollRef.value || !trackRef.value || !tunnelRef.value) return
  const scroller = scrollRef.value; const track = trackRef.value; const tunnel = tunnelRef.value
  gsap.set(tunnel, { rotateY: 0 })

  const master = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.15 } })

  // 🚇 整个隧道旋转（相机偏转）
  master.to(tunnel, { rotateY: 90, duration: 2, ease: 'power2.inOut' }, 0)
  master.to(tunnel, { rotateY: -60, duration: 2.5, ease: 'power2.inOut' }, 2)
  master.to(tunnel, { rotateY: 30, duration: 2, ease: 'power2.inOut' }, 4)

  // 各环自转微差（管道内部闪烁）
  const rings = ringRefs.value
  rings.forEach((ring, i) => {
    master.to(ring, { rotateZ: `${(i % 2 === 0 ? 1 : -1) * 180}`, duration: RINGS.length + 3, ease: 'none' }, 0)
  })

  // 远近环交替缩放（隧道呼吸）
  for (let w = 0; w <= 5; w++) {
    master.to(tunnel, { scale: 1.04, duration: 0.1, ease: 'sine.inOut' }, w + 0.2)
    master.to(tunnel, { scale: 1, duration: 0.12, ease: 'sine.inOut' }, w + 0.4)
  }
  if (glowA.value && glowB.value) { master.to(glowA.value, { x: '6vw', y: '-4vh', scale: 1.2, duration: 6 }, 0); master.to(glowB.value, { x: '-4vw', y: '5vh', scale: 1.25, duration: 6 }, 0) }
  if (progRef.value) master.to(progRef.value, { width: '100%', duration: 6 }, 0)
  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }
onMounted(() => { initCanvas(); requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupTunnel() })); window.addEventListener('resize', handleResize) })
onUnmounted(() => { window.removeEventListener('resize', handleResize); cancelAnimationFrame(animId); ScrollTrigger.getAll().forEach(st => st.kill()); cleanupFns.forEach(fn => fn()); cleanupFns.length = 0; streaks.length = 0 })
</script>

<style scoped lang="scss">
.tn3-root { position: relative; width: 100vw; height: 100vh; overflow: hidden; background: radial-gradient(ellipse at 50% 48%, #1a2a40 0%, #0a1020 100%); font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif; }
.tn3-glow { position: absolute; border-radius: 50%; filter: blur(60px); pointer-events: none; will-change: transform; z-index: 0; }
.tn3-glow--a { width: 24vw; height: 24vw; top: 40vh; left: 35vw; background: radial-gradient(circle, rgba(100,180,240,.3) 0%, transparent 70%); }
.tn3-glow--b { width: 20vw; height: 20vw; top: 30vh; right: 30vw; background: radial-gradient(circle, rgba(180,100,240,.25) 0%, transparent 70%); }
.tn3-canvas { position: absolute; inset: 0; z-index: 1; pointer-events: none; }

.tn3-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 2;
  &::-webkit-scrollbar { width: 5px; } &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(100,160,220,.3); &:hover { background: rgba(100,160,220,.5); } }
}
.tn3-track { position: relative; width: 100%; } .tn3-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

.tn3-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 30; text-align: center; width: min(92vw, 800px); }
.tn3-kicker { display: inline-block; font-size: .66rem; font-weight: 700; letter-spacing: .26em; text-transform: uppercase; color: rgba(130,190,240,.8); background: rgba(100,160,220,.15); backdrop-filter: blur(8px); border: 1px solid rgba(100,160,230,.25); border-radius: 999px; padding: .3rem 1.2rem; margin-bottom: .55rem; }
.tn3-title { margin: 0; display: flex; justify-content: center; gap: .08em; }
.tn3-title__c { display: inline-block; font-size: clamp(2.2rem, 5.5vw, 4.6rem); font-weight: 900; color: #80c0f0; will-change: transform,opacity;
  &--3d { background: linear-gradient(135deg, #5ac8fa, #a0e0ff, #c0b0ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 2px 16px rgba(120,200,255,.5)); }
}
.tn3-line { width: 90px; height: 2px; margin: .45rem auto .6rem; background: linear-gradient(90deg, transparent, #5ac8fa, #a0e0ff, transparent); }
.tn3-sub { margin: 0; font-size: clamp(.76rem, 1.1vw, .88rem); color: rgba(130,190,230,.5); max-width: 480px; margin-inline: auto; }

.tn3-stage { position: absolute; top: 48%; left: 50%; transform: translate(-50%, -50%); width: 0; height: 0; z-index: 10; perspective: 700px; perspective-origin: 50% 50%; will-change: transform, opacity; }
.tn3-tunnel { position: absolute; width: 0; height: 0; transform-style: preserve-3d; will-change: transform; }

.tn3-ring { position: absolute; width: 0; height: 0; transform-style: preserve-3d; will-change: transform; }
.tn3-panel { position: absolute; width: 4vw; max-width: 40px; height: 6vw; max-height: 60px; margin-left: -2vw; margin-top: -3vw; backface-visibility: hidden; border-radius: 3px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,.2); border: 1px solid rgba(255,255,255,.15); }
.tn3-panel__img { width: 100%; height: 100%; object-fit: cover; }

.tn3-progress { position: absolute; left: 0; bottom: 0; z-index: 30; width: 100%; height: 3px; background: rgba(100,160,220,.08); }
.tn3-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #5ac8fa, #a0e0ff, #c0b0ff, #5ac8fa); background-size: 200% 100%; box-shadow: 0 0 12px rgba(100,180,240,.5); }
@media (max-width: 768px) { .tn3-header { top: 2vh; } .tn3-kicker { font-size: .54rem; } .tn3-title__c { font-size: 1.7rem; } }
</style>
