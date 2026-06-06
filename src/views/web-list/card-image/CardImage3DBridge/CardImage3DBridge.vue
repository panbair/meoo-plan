<template>
  <section ref="rootRef" class="bg3-root">
    <div ref="glowA" class="bg3-glow bg3-glow--a"></div>
    <div ref="glowB" class="bg3-glow bg3-glow--b"></div>
    <canvas ref="canvasRef" class="bg3-canvas"></canvas>

    <div ref="scrollRef" class="bg3-scroll">
      <div ref="trackRef" class="bg3-track" :style="{ height: trackHeight }">
        <div class="bg3-sticky">

          <header ref="headerRef" class="bg3-header">
            <span class="bg3-kicker">🌉 CSS 3D Bridge · 立体拱桥 🌉</span>
            <h1 class="bg3-title">
              <span ref="tc1" class="bg3-title__c">拱</span>
              <span ref="tc2" class="bg3-title__c bg3-title__c--3d">桥</span>
              <span ref="tc3" class="bg3-title__c">飞</span>
              <span ref="tc4" class="bg3-title__c bg3-title__c--3d">渡</span>
            </h1>
            <div ref="lineRef" class="bg3-line"></div>
            <p class="bg3-sub">向下滚动 · 12段拱形桥面 · 图片沿抛物线排列跨越</p>
          </header>

          <!-- 🌉 3D拱桥 -->
          <div ref="bridgeStage" class="bg3-stage">
            <div ref="bridgeRef" class="bg3-bridge">
              <div v-for="(img, idx) in bridgeImages" :key="idx"
                :ref="(el) => setSegRef(el, idx)" class="bg3-seg"
                :style="segStyle(idx)">
                <img :src="img" class="bg3-seg__img" />
              </div>
            </div>
            <!-- 桥墩 -->
            <div ref="pierL" class="bg3-pier bg3-pier--l"></div>
            <div ref="pierR" class="bg3-pier bg3-pier--r"></div>
          </div>

          <div class="bg3-progress"><div ref="progRef" class="bg3-progress__fill"></div></div>
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
//  CardImage3DBridge — CSS3 3D拱桥
//  12段面板沿抛物线(Y = -a*x² + h)排列
//  每段：translateY(抛物线高度) + rotateZ(切线角)
//  形成优美的拱形桥面，两端低中间高
//  用户竖滚 → 桥体俯仰旋转 + 各段微振动
// ═══════════════════════════════════════════════════════════════════

type TweenCleanup = () => void
const SEGS = 12
const IMGS = ['https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=350&q=80','https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=350&q=80','https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=350&q=80','https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=350&q=80','https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=350&q=80','https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=350&q=80']
const bridgeImages = Array.from({length: SEGS}, (_, i) => IMGS[i % IMGS.length])
const ARCH_H = 22 // vh 拱高
const SPAN = 80 // vw 跨度
const trackHeight = `${(SEGS / 4 + 3) * 100}vh`

const rootRef = ref<HTMLElement | null>(null); const scrollRef = ref<HTMLElement | null>(null); const trackRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null); const lineRef = ref<HTMLElement | null>(null)
const tc1 = ref<HTMLElement | null>(null); const tc2 = ref<HTMLElement | null>(null); const tc3 = ref<HTMLElement | null>(null); const tc4 = ref<HTMLElement | null>(null)
const bridgeStage = ref<HTMLElement | null>(null); const bridgeRef = ref<HTMLElement | null>(null)
const pierL = ref<HTMLElement | null>(null); const pierR = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null); const canvasRef = ref<HTMLCanvasElement | null>(null)
const glowA = ref<HTMLElement | null>(null); const glowB = ref<HTMLElement | null>(null)

const segRefs = ref<HTMLElement[]>([])
const setSegRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) segRefs.value[i] = el }
const cleanupFns: TweenCleanup[] = []

// 🔑 抛物线拱桥：Y = -4h * (x/S)² + h（顶点在中心）
function segStyle(idx: number) {
  const xNorm = (idx / (SEGS - 1) - 0.5) * 2 // -1 → +1
  const x = xNorm * SPAN / 2
  const y = -ARCH_H * xNorm * xNorm + ARCH_H // 抛物线
  // 切线角 = dy/dx = -8*h*xNorm
  const tangent = -8 * ARCH_H * xNorm / SPAN
  const angle = Math.atan(tangent) * 180 / Math.PI // 转为度数
  return {
    transform: `translateX(${x}vw) translateY(${-y}vh) rotateZ(${angle}deg)`,
    zIndex: Math.floor(100 - Math.abs(xNorm) * 30),
  }
}

// Canvas 水流
interface WaterDrop { x: number; y: number; vy: number; size: number; alpha: number; life: number; maxLife: number }
let ctx: CanvasRenderingContext2D | null = null; let cw = 0; let ch = 0; let animId = 0; const drops: WaterDrop[] = []
function createDrop(): WaterDrop { return { x: cw * 0.5 + (Math.random() - 0.5) * cw * 0.8, y: ch * 0.65, vy: 1 + Math.random() * 3, size: 1 + Math.random() * 2, alpha: 0.3 + Math.random() * 0.4, life: 0, maxLife: 60 + Math.random() * 100 } }

function initCanvas() {
  const c = canvasRef.value; if (!c) return; ctx = c.getContext('2d'); if (!ctx) return
  const resize = () => { cw = window.innerWidth; ch = window.innerHeight; c.width = cw; c.height = ch }
  resize(); window.addEventListener('resize', resize); cleanupFns.push(() => window.removeEventListener('resize', resize))
  function animate() {
    if (!ctx) return; ctx.clearRect(0, 0, cw, ch)
    if (Math.random() > 0.5) drops.push(createDrop())
    while (drops.length > 50) drops.shift()
    for (let i = drops.length - 1; i >= 0; i--) { const d = drops[i]; d.life++; if (d.life >= d.maxLife) { drops.splice(i, 1); continue }; d.y += d.vy; const t = d.life / d.maxLife; const fade = t < 0.1 ? t / 0.1 : t > 0.7 ? 1 - (t - 0.7) / 0.3 : 1; ctx!.beginPath(); ctx!.arc(d.x, d.y, d.size, 0, Math.PI * 2); ctx!.fillStyle = `rgba(130,190,230,${d.alpha * fade})`; ctx!.fill(); if (d.y > ch + 20) drops.splice(i, 1) }
    animId = requestAnimationFrame(animate)
  }
  animId = requestAnimationFrame(animate)
}

function setupEntrance() {
  if (!scrollRef.value || !headerRef.value || !bridgeStage.value) return
  const tl = gsap.timeline({ scrollTrigger: { trigger: scrollRef.value, scroller: scrollRef.value, start: 'top 75%', toggleActions: 'play none none reverse' } })
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.85, ease: 'power3.out' })
    .fromTo([tc1.value, tc2.value, tc3.value, tc4.value], { autoAlpha: 0, rotateX: -90, scale: 0.3 }, { autoAlpha: 1, rotateX: 0, scale: 1, duration: 0.6, stagger: 0.08, ease: 'back.out(2.2)' }, '-=0.45')
    .fromTo(lineRef.value, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power3.inOut' }, '-=0.25')
    .fromTo(bridgeStage.value, { autoAlpha: 0, scale: 0.5 }, { autoAlpha: 1, scale: 1, duration: 0.8, ease: 'elastic.out(1, 0.5)' }, '-=0.35')
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

function setupBridge() {
  if (!scrollRef.value || !trackRef.value || !bridgeRef.value) return
  const scroller = scrollRef.value; const track = trackRef.value; const bridge = bridgeRef.value

  gsap.set(bridge, { rotateY: 0, rotateX: 10 })

  const master = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.15 } })

  // 🌉 桥体3D旋转
  master.to(bridge, { rotateY: 30, duration: 1.5, ease: 'power2.inOut' }, 0)
  master.to(bridge, { rotateY: -25, duration: 2, ease: 'power2.inOut' }, 1.5)
  master.to(bridge, { rotateY: 15, duration: 1.5, ease: 'power2.inOut' }, 3.2)
  master.to(bridge, { rotateX: 25, duration: 2, ease: 'sine.inOut' }, 0.5)
  master.to(bridge, { rotateX: 0, duration: 2, ease: 'sine.inOut' }, 2.5)

  // 桥墩呼吸
  if (pierL.value && pierR.value) {
    for (let i = 0; i <= 4; i++) {
      master.to([pierL.value, pierR.value], { scaleY: 1.05, duration: 0.08, ease: 'sine.inOut' }, i + 0.3)
      master.to([pierL.value, pierR.value], { scaleY: 1, duration: 0.1, ease: 'sine.inOut' }, i + 0.4)
    }
  }

  for (let i = 0; i <= 4; i++) { master.to(bridge, { scale: 1.03, duration: 0.08, ease: 'sine.inOut' }, i + 0.25); master.to(bridge, { scale: 1, duration: 0.1, ease: 'sine.inOut' }, i + 0.4) }
  if (glowA.value && glowB.value) { master.to(glowA.value, { x: '6vw', y: '-4vh', scale: 1.15, duration: 5 }, 0); master.to(glowB.value, { x: '-4vw', y: '5vh', scale: 1.2, duration: 5 }, 0) }
  if (progRef.value) master.to(progRef.value, { width: '100%', duration: 5 }, 0)
  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }
onMounted(() => { initCanvas(); requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupBridge() })); window.addEventListener('resize', handleResize) })
onUnmounted(() => { window.removeEventListener('resize', handleResize); cancelAnimationFrame(animId); ScrollTrigger.getAll().forEach(st => st.kill()); cleanupFns.forEach(fn => fn()); cleanupFns.length = 0; drops.length = 0 })
</script>

<style scoped lang="scss">
.bg3-root { position: relative; width: 100vw; height: 100vh; overflow: hidden; background: linear-gradient(160deg, #f8fafc 0%, #f5f7f9 20%, #fafcfd 40%, #f6f8fa 60%, #f9fbfc 80%, #f5f7f9 100%); font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif; }
.bg3-glow { position: absolute; border-radius: 50%; filter: blur(65px); pointer-events: none; will-change: transform; z-index: 0; }
.bg3-glow--a { width: 28vw; height: 28vw; top: -4vh; left: -2vw; background: radial-gradient(circle, rgba(180,210,240,.35) 0%, transparent 70%); }
.bg3-glow--b { width: 24vw; height: 24vw; bottom: 30vh; right: -1vw; background: radial-gradient(circle, rgba(140,200,230,.3) 0%, transparent 70%); }
.bg3-canvas { position: absolute; inset: 0; z-index: 1; pointer-events: none; }

.bg3-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 2;
  &::-webkit-scrollbar { width: 5px; } &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(140,190,220,.3); &:hover { background: rgba(140,190,220,.5); } }
}
.bg3-track { position: relative; width: 100%; } .bg3-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

.bg3-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 30; text-align: center; width: min(92vw, 800px); }
.bg3-kicker { display: inline-block; font-size: .66rem; font-weight: 700; letter-spacing: .26em; text-transform: uppercase; color: rgba(100,150,200,.8); background: rgba(140,190,230,.1); backdrop-filter: blur(8px); border: 1px solid rgba(130,180,220,.2); border-radius: 999px; padding: .3rem 1.2rem; margin-bottom: .55rem; }
.bg3-title { margin: 0; display: flex; justify-content: center; gap: .08em; }
.bg3-title__c { display: inline-block; font-size: clamp(2.2rem, 5.5vw, 4.6rem); font-weight: 900; color: #5a90c0; will-change: transform,opacity;
  &--3d { background: linear-gradient(135deg, #5ac8fa, #60a0d0, #80d0f0); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 2px 14px rgba(90,150,210,.5)); }
}
.bg3-line { width: 90px; height: 2px; margin: .45rem auto .6rem; background: linear-gradient(90deg, transparent, #5ac8fa, #80d0f0, transparent); }
.bg3-sub { margin: 0; font-size: clamp(.76rem, 1.1vw, .88rem); color: rgba(100,140,190,.5); max-width: 460px; margin-inline: auto; }

.bg3-stage { position: absolute; top: 48%; left: 50%; transform: translate(-50%, -50%); width: 0; height: 0; z-index: 10; perspective: 800px; perspective-origin: 50% 60%; will-change: transform, opacity; }
.bg3-bridge { position: absolute; width: 0; height: 0; transform-style: preserve-3d; will-change: transform; }

.bg3-seg {
  position: absolute;
  width: 7vw; max-width: 65px;
  height: 5vw; max-height: 45px;
  margin-left: -3.5vw; margin-top: -2.5vw;
  backface-visibility: hidden;
  border-radius: 4px; overflow: hidden;
  box-shadow: 0 4px 18px rgba(0,0,0,.13);
  border: 1px solid rgba(255,255,255,.25);
}
.bg3-seg__img { width: 100%; height: 100%; object-fit: cover; }

/* 桥墩 */
.bg3-pier { position: absolute; width: 3vw; max-width: 30px; height: 10vh; background: linear-gradient(180deg, rgba(180,200,220,.6), rgba(140,160,180,.3)); border-radius: 4px; will-change: transform; }
.bg3-pier--l { left: -42vw; bottom: -18vh; }
.bg3-pier--r { right: -42vw; bottom: -18vh; }

.bg3-progress { position: absolute; left: 0; bottom: 0; z-index: 30; width: 100%; height: 3px; background: rgba(140,190,220,.06); }
.bg3-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #5ac8fa, #60a0d0, #80d0f0, #5ac8fa); background-size: 200% 100%; box-shadow: 0 0 12px rgba(90,160,220,.5); }
@media (max-width: 768px) { .bg3-header { top: 2vh; } .bg3-kicker { font-size: .54rem; } .bg3-title__c { font-size: 1.7rem; } .bg3-seg { width: 9vw; height: 6vw; margin-left: -4.5vw; margin-top: -3vw; } }
</style>
