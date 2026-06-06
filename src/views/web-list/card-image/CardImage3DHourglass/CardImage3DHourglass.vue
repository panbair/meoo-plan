<template>
  <section ref="rootRef" class="hg3-root">
    <div ref="glowA" class="hg3-glow hg3-glow--a"></div>
    <div ref="glowB" class="hg3-glow hg3-glow--b"></div>
    <canvas ref="canvasRef" class="hg3-canvas"></canvas>

    <div ref="scrollRef" class="hg3-scroll">
      <div ref="trackRef" class="hg3-track" :style="{ height: trackHeight }">
        <div class="hg3-sticky">

          <header ref="headerRef" class="hg3-header">
            <span class="hg3-kicker">⏳ CSS 3D Hourglass · 立体沙漏 ⏳</span>
            <h1 class="hg3-title">
              <span ref="tc1" class="hg3-title__c">沙</span>
              <span ref="tc2" class="hg3-title__c hg3-title__c--3d">漏</span>
              <span ref="tc3" class="hg3-title__c">时</span>
              <span ref="tc4" class="hg3-title__c hg3-title__c--3d">光</span>
            </h1>
            <div ref="lineRef" class="hg3-line"></div>
            <p class="hg3-sub">向下滚动 · 双锥沙漏旋转 · 图片如流沙般倾泻</p>
          </header>

          <div ref="hgStage" class="hg3-stage">
            <div ref="hgBody" class="hg3-body">
              <!-- 上半锥 6面 -->
              <div v-for="(_, idx) in 6" :key="'t'+idx"
                :ref="(el) => setTopRef(el, idx)" class="hg3-face hg3-face--top"
                :style="topStyle(idx)">
                <img :src="IMGS[idx % IMGS.length]" class="hg3-face__img" />
              </div>
              <!-- 下半锥 6面 -->
              <div v-for="(_, idx) in 6" :key="'b'+idx"
                :ref="(el) => setBotRef(el, idx)" class="hg3-face hg3-face--bottom"
                :style="bottomStyle(idx)">
                <img :src="IMGS[(idx + 3) % IMGS.length]" class="hg3-face__img" />
              </div>
              <!-- 中间腰线 -->
              <div ref="waistRef" class="hg3-waist"></div>
            </div>
          </div>

          <div class="hg3-progress"><div ref="progRef" class="hg3-progress__fill"></div></div>
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
//  CardImage3DHourglass — CSS3 3D沙漏
//  双圆锥体 = 上半锥(6面向上收缩) + 下半锥(6面向下收缩)
//  腰线处两锥顶点相会
//  每面是 clip-path 三角形
//  用户竖滚 → 沙漏旋转 + 翻转(模拟计时翻转)
// ═══════════════════════════════════════════════════════════════════

type TweenCleanup = () => void
const IMGS = ['https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=400&q=80','https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80','https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&q=80','https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80','https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&q=80','https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=400&q=80']
const trackHeight = `${8 * 100}vh`

const rootRef = ref<HTMLElement | null>(null); const scrollRef = ref<HTMLElement | null>(null); const trackRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null); const lineRef = ref<HTMLElement | null>(null)
const tc1 = ref<HTMLElement | null>(null); const tc2 = ref<HTMLElement | null>(null); const tc3 = ref<HTMLElement | null>(null); const tc4 = ref<HTMLElement | null>(null)
const hgStage = ref<HTMLElement | null>(null); const hgBody = ref<HTMLElement | null>(null); const waistRef = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null); const glowA = ref<HTMLElement | null>(null); const glowB = ref<HTMLElement | null>(null)

const topRefs = ref<HTMLElement[]>([]); const botRefs = ref<HTMLElement[]>([])
const setTopRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) topRefs.value[i] = el }
const setBotRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) botRefs.value[i] = el }
const cleanupFns: TweenCleanup[] = []

function topStyle(idx: number) {
  const ry = idx * 60
  return { transform: `rotateY(${ry}deg) rotateX(60deg) translateZ(14vw)` }
}
function bottomStyle(idx: number) {
  const ry = idx * 60 + 30
  return { transform: `rotateY(${ry}deg) rotateX(-60deg) translateZ(14vw)` }
}

// Canvas sand
interface Sand { x: number; y: number; vy: number; size: number; alpha: number; life: number; maxLife: number }
let ctx: CanvasRenderingContext2D | null = null; let cw = 0; let ch = 0; let animId = 0; const sands: Sand[] = []
function createSand(): Sand { return { x: cw/2 + (Math.random() - 0.5) * 80, y: ch * 0.48, vy: 1 + Math.random() * 3, size: 0.8 + Math.random() * 2.5, alpha: 0.3 + Math.random() * 0.5, life: 0, maxLife: 40 + Math.random() * 80 } }

function initCanvas() {
  const c = canvasRef.value; if (!c) return; ctx = c.getContext('2d'); if (!ctx) return
  const resize = () => { cw = window.innerWidth; ch = window.innerHeight; c.width = cw; c.height = ch }
  resize(); window.addEventListener('resize', resize); cleanupFns.push(() => window.removeEventListener('resize', resize))
  function animate() {
    if (!ctx) return; ctx.clearRect(0, 0, cw, ch)
    if (Math.random() > 0.3) sands.push(createSand())
    while (sands.length > 80) sands.shift()
    for (let i = sands.length - 1; i >= 0; i--) { const s = sands[i]; s.life++; if (s.life >= s.maxLife) { sands.splice(i, 1); continue }; s.y += s.vy; const t = s.life / s.maxLife; const fade = t < 0.1 ? t / 0.1 : t > 0.8 ? 1 - (t - 0.8) / 0.2 : 1; ctx!.beginPath(); ctx!.arc(s.x + (Math.random() - 0.5) * 2, s.y, s.size, 0, Math.PI * 2); ctx!.fillStyle = `rgba(210,180,140,${s.alpha * fade})`; ctx!.fill(); if (s.y > ch + 20) sands.splice(i, 1) }
    animId = requestAnimationFrame(animate)
  }
  animId = requestAnimationFrame(animate)
}

function setupEntrance() {
  if (!scrollRef.value || !headerRef.value || !hgStage.value) return
  const tl = gsap.timeline({ scrollTrigger: { trigger: scrollRef.value, scroller: scrollRef.value, start: 'top 75%', toggleActions: 'play none none reverse' } })
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.85, ease: 'power3.out' })
    .fromTo([tc1.value, tc2.value, tc3.value, tc4.value], { autoAlpha: 0, z: -200, scale: 0.3 }, { autoAlpha: 1, z: 0, scale: 1, duration: 0.6, stagger: 0.08, ease: 'back.out(2.2)' }, '-=0.45')
    .fromTo(lineRef.value, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power3.inOut' }, '-=0.25')
    .fromTo(hgStage.value, { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.9, ease: 'elastic.out(1, 0.5)' }, '-=0.35')
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

function setupHourglass() {
  if (!scrollRef.value || !trackRef.value || !hgBody.value) return
  const scroller = scrollRef.value; const track = trackRef.value; const body = hgBody.value
  gsap.set(body, { rotateY: 0, rotateX: 10 })

  const master = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.1 } })

  // ⏳ 沙漏旋转
  master.to(body, { rotateY: 180, duration: 2, ease: 'power2.inOut' }, 0)
  master.to(body, { rotateY: 360, duration: 2, ease: 'power2.inOut' }, 2)
  // 翻转！模拟沙漏倒转
  master.to(body, { rotateX: -170, duration: 2, ease: 'power3.inOut' }, 4)
  master.to(body, { rotateX: 10, duration: 0.8, ease: 'bounce.out' }, 6)
  master.to(body, { rotateY: 540, duration: 2, ease: 'power2.inOut' }, 6)

  for (let i = 0; i <= 6; i++) { master.to(body, { scale: 1.04, duration: 0.08, ease: 'sine.inOut' }, i + 0.2); master.to(body, { scale: 1, duration: 0.1, ease: 'sine.inOut' }, i + 0.35) }
  if (waistRef.value) { master.to(waistRef.value, { rotateY: 720, duration: 8, ease: 'none' }, 0) }
  if (glowA.value && glowB.value) { master.to(glowA.value, { x: '6vw', y: '-4vh', scale: 1.15, duration: 8 }, 0); master.to(glowB.value, { x: '-4vw', y: '5vh', scale: 1.2, duration: 8 }, 0) }
  if (progRef.value) master.to(progRef.value, { width: '100%', duration: 8 }, 0)
  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }
onMounted(() => { initCanvas(); requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupHourglass() })); window.addEventListener('resize', handleResize) })
onUnmounted(() => { window.removeEventListener('resize', handleResize); cancelAnimationFrame(animId); ScrollTrigger.getAll().forEach(st => st.kill()); cleanupFns.forEach(fn => fn()); cleanupFns.length = 0; sands.length = 0 })
</script>

<style scoped lang="scss">
.hg3-root { position: relative; width: 100vw; height: 100vh; overflow: hidden; background: linear-gradient(155deg, #fefaf7 0%, #fcf5ee 20%, #fdf7f2 40%, #fcf6ef 60%, #fdf8f3 80%, #fcf6f0 100%); font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif; }
.hg3-glow { position: absolute; border-radius: 50%; filter: blur(65px); pointer-events: none; will-change: transform; z-index: 0; }
.hg3-glow--a { width: 28vw; height: 28vw; top: -4vh; left: -2vw; background: radial-gradient(circle, rgba(240,190,120,.38) 0%, transparent 70%); }
.hg3-glow--b { width: 24vw; height: 24vw; bottom: -4vh; right: -1vw; background: radial-gradient(circle, rgba(210,170,120,.35) 0%, transparent 70%); }
.hg3-canvas { position: absolute; inset: 0; z-index: 1; pointer-events: none; }

.hg3-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 2;
  &::-webkit-scrollbar { width: 5px; } &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(210,170,120,.3); &:hover { background: rgba(210,170,120,.5); } }
}
.hg3-track { position: relative; width: 100%; } .hg3-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

.hg3-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 30; text-align: center; width: min(92vw, 800px); }
.hg3-kicker { display: inline-block; font-size: .66rem; font-weight: 700; letter-spacing: .26em; text-transform: uppercase; color: rgba(190,150,100,.8); background: rgba(220,180,130,.12); backdrop-filter: blur(8px); border: 1px solid rgba(200,160,120,.2); border-radius: 999px; padding: .3rem 1.2rem; margin-bottom: .55rem; }
.hg3-title { margin: 0; display: flex; justify-content: center; gap: .08em; }
.hg3-title__c { display: inline-block; font-size: clamp(2.2rem, 5.5vw, 4.6rem); font-weight: 900; color: #c89848; will-change: transform,opacity;
  &--3d { background: linear-gradient(180deg, #f0c860, #d4a030, #b08028); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 2px 14px rgba(220,180,80,.5)); }
}
.hg3-line { width: 90px; height: 2px; margin: .45rem auto .6rem; background: linear-gradient(90deg, transparent, #d4a030, #f0c860, transparent); }
.hg3-sub { margin: 0; font-size: clamp(.76rem, 1.1vw, .88rem); color: rgba(170,130,80,.5); max-width: 460px; margin-inline: auto; }

.hg3-stage { position: absolute; top: 48%; left: 50%; transform: translate(-50%, -50%); width: 0; height: 0; z-index: 10; perspective: 800px; perspective-origin: 50% 50%; will-change: transform, opacity; }
.hg3-body { position: absolute; width: 0; height: 0; transform-style: preserve-3d; will-change: transform; }

.hg3-face { position: absolute; width: 22vw; max-width: 200px; height: 22vw; max-height: 200px; margin-left: -11vw; margin-top: -11vw; backface-visibility: hidden; overflow: hidden;
  &--top { clip-path: polygon(50% 0%, 0% 100%, 100% 100%); transform-origin: 50% 100%; }  // 正三角，顶点在上
  &--bottom { clip-path: polygon(0% 0%, 100% 0%, 50% 100%); transform-origin: 50% 0%; }  // 倒三角，顶点在下
}
.hg3-face__img { width: 100%; height: 100%; object-fit: cover; }

.hg3-waist { position: absolute; width: 12vw; max-width: 100px; height: 12vw; max-height: 100px; margin-left: -6vw; margin-top: -6vw; border-radius: 50%; border: 2px solid rgba(200,160,80,.5); box-shadow: 0 0 20px rgba(200,150,60,.3); transform: rotateX(90deg) translateZ(0); }

.hg3-progress { position: absolute; left: 0; bottom: 0; z-index: 30; width: 100%; height: 3px; background: rgba(210,170,120,.06); }
.hg3-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #d4a030, #f0c860, #d4a030); background-size: 200% 100%; box-shadow: 0 0 12px rgba(220,180,80,.5); }
@media (max-width: 768px) { .hg3-header { top: 2vh; } .hg3-kicker { font-size: .54rem; } .hg3-title__c { font-size: 1.7rem; } .hg3-face { width: 30vw; height: 30vw; margin-left: -15vw; margin-top: -15vw; } }
</style>
