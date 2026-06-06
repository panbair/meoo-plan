<template>
  <section ref="rootRef" class="pm3-root">
    <div ref="glowR" class="pm3-glow pm3-glow--r"></div>
    <div ref="glowG" class="pm3-glow pm3-glow--g"></div>
    <div ref="glowB" class="pm3-glow pm3-glow--b"></div>
    <canvas ref="canvasRef" class="pm3-canvas"></canvas>

    <div ref="scrollRef" class="pm3-scroll">
      <div ref="trackRef" class="pm3-track" :style="{ height: trackHeight }">
        <div class="pm3-sticky">

          <header ref="headerRef" class="pm3-header">
            <span class="pm3-kicker">🔺 CSS 3D Prism · 三棱镜 🔺</span>
            <h1 class="pm3-title">
              <span ref="tc1" class="pm3-title__c pm3-title__c--r">三</span>
              <span ref="tc2" class="pm3-title__c pm3-title__c--g">棱</span>
              <span ref="tc3" class="pm3-title__c pm3-title__c--b">分</span>
              <span ref="tc4" class="pm3-title__c pm3-title__c--rainbow">光</span>
            </h1>
            <div ref="lineRef" class="pm3-line"></div>
            <p class="pm3-sub">向下滚动 · 三角棱镜旋转 · 每面折射出不同光谱色彩</p>
          </header>

          <!-- 🔺 3D三棱镜 -->
          <div ref="prismStage" class="pm3-stage">
            <div ref="prismRef" class="pm3-prism">
              <!-- 3个矩形侧面 -->
              <div v-for="(face, idx) in prismFaces" :key="idx"
                :ref="(el) => setFaceRef(el, idx)" class="pm3-face"
                :style="faceStyle(idx)">
                <img :src="face.src" class="pm3-face__img" />
              </div>
              <!-- 顶部三角形 -->
              <div ref="topTriRef" class="pm3-top-tri">
                <img :src="prismFaces[0].src" class="pm3-top-tri__img" />
              </div>
              <!-- 底部三角形 -->
              <div ref="botTriRef" class="pm3-bot-tri">
                <img :src="prismFaces[2].src" class="pm3-bot-tri__img" />
              </div>
            </div>
            <!-- 光谱投影 -->
            <div ref="spectrumRef" class="pm3-spectrum">
              <span v-for="c in ['#ff4d6a','#ff8c69','#ffb347','#5ce0a0','#5ac8fa','#a78bfa']" :key="c"
                class="pm3-spectrum__band" :style="{ background: c }"></span>
            </div>
          </div>

          <div class="pm3-progress"><div ref="progRef" class="pm3-progress__fill"></div></div>
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
//  CardImage3DPrism — CSS3 3D三棱镜
//  三角棱柱 = 3个矩形侧面 + 2个三角端面
//  侧面：rotateY(0/120/240) 构成等边三角棱柱
//  每面使用 clip-path 三角形裁剪形成光学棱镜效果
//  用户竖滚 → 棱镜旋转 + 光谱投影渐显
// ═══════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

const prismFaces = [
  { src: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=400&q=80', label: '红' },
  { src: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80', label: '绿' },
  { src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&q=80', label: '蓝' },
]
const trackHeight = `${(prismFaces.length + 4) * 100}vh`

const rootRef = ref<HTMLElement | null>(null); const scrollRef = ref<HTMLElement | null>(null); const trackRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null); const lineRef = ref<HTMLElement | null>(null)
const tc1 = ref<HTMLElement | null>(null); const tc2 = ref<HTMLElement | null>(null); const tc3 = ref<HTMLElement | null>(null); const tc4 = ref<HTMLElement | null>(null)
const prismStage = ref<HTMLElement | null>(null); const prismRef = ref<HTMLElement | null>(null)
const topTriRef = ref<HTMLElement | null>(null); const botTriRef = ref<HTMLElement | null>(null)
const spectrumRef = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const glowR = ref<HTMLElement | null>(null); const glowG = ref<HTMLElement | null>(null); const glowB = ref<HTMLElement | null>(null)

const faceRefs = ref<HTMLElement[]>([])
const setFaceRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) faceRefs.value[i] = el }
const cleanupFns: TweenCleanup[] = []

function faceStyle(idx: number) {
  const ry = idx * 120
  return { transform: `rotateY(${ry}deg) translateZ(16vw)` }
}

// Canvas photons
interface Photon { x: number; y: number; vx: number; vy: number; size: number; alpha: number; hue: number; life: number; maxLife: number }
let ctx: CanvasRenderingContext2D | null = null; let cw = 0; let ch = 0; let animId = 0; const photons: Photon[] = []
function createPhoton(): Photon { return { x: cw * 0.5 + (Math.random() - 0.5) * 200, y: ch * 0.48, vx: (Math.random() - 0.5) * 2, vy: -(Math.random() * 3 + 1), size: 1 + Math.random() * 2.5, alpha: 0.4 + Math.random() * 0.5, hue: [340, 25, 45, 155, 200, 280][Math.floor(Math.random() * 6)], life: 0, maxLife: 100 + Math.random() * 200 } }

function initCanvas() {
  const c = canvasRef.value; if (!c) return; ctx = c.getContext('2d'); if (!ctx) return
  const resize = () => { cw = window.innerWidth; ch = window.innerHeight; c.width = cw; c.height = ch }
  resize(); window.addEventListener('resize', resize); cleanupFns.push(() => window.removeEventListener('resize', resize))
  function animate() {
    if (!ctx) return; ctx.clearRect(0, 0, cw, ch)
    if (Math.random() > 0.5) photons.push(createPhoton())
    while (photons.length > 100) photons.shift()
    for (let i = photons.length - 1; i >= 0; i--) { const p = photons[i]; p.life++; if (p.life >= p.maxLife) { photons.splice(i, 1); continue }; p.x += p.vx; p.y += p.vy; const t = p.life / p.maxLife; const fade = t < 0.06 ? t / 0.06 : t > 0.7 ? 1 - (t - 0.7) / 0.3 : 1; ctx!.beginPath(); ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx!.fillStyle = `hsla(${p.hue}, 90%, 72%, ${p.alpha * fade})`; ctx!.fill(); if (p.y < -30) photons.splice(i, 1) }
    animId = requestAnimationFrame(animate)
  }
  animId = requestAnimationFrame(animate)
}

function setupEntrance() {
  if (!scrollRef.value || !headerRef.value || !prismStage.value) return
  const tl = gsap.timeline({ scrollTrigger: { trigger: scrollRef.value, scroller: scrollRef.value, start: 'top 75%', toggleActions: 'play none none reverse' } })
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.85, ease: 'power3.out' })
    .fromTo([tc1.value, tc2.value, tc3.value, tc4.value], { autoAlpha: 0, rotateX: 90, scale: 0.2 }, { autoAlpha: 1, rotateX: 0, scale: 1, duration: 0.6, stagger: 0.08, ease: 'back.out(2.2)' }, '-=0.45')
    .fromTo(lineRef.value, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power3.inOut' }, '-=0.25')
    .fromTo(prismStage.value, { autoAlpha: 0, scale: 0.4, rotateX: -30 }, { autoAlpha: 1, scale: 1, rotateX: 10, duration: 0.9, ease: 'elastic.out(1, 0.5)' }, '-=0.35')
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

function setupPrism() {
  if (!scrollRef.value || !trackRef.value || !prismRef.value) return
  const scroller = scrollRef.value; const track = trackRef.value; const prism = prismRef.value
  gsap.set(prism, { rotateY: 0, rotateX: 10 })

  const master = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.1 } })

  // 🔺 棱镜绕Y轴旋转
  master.to(prism, { rotateY: 180, duration: 2, ease: 'power2.inOut' }, 0)
  master.to(prism, { rotateY: 360, duration: 2, ease: 'power2.inOut' }, 1.8)
  master.to(prism, { rotateY: 540, duration: 2, ease: 'power2.inOut' }, 3.2)
  master.to(prism, { rotateX: 0, duration: 2, ease: 'sine.inOut' }, 0.5)
  master.to(prism, { rotateX: 20, duration: 2, ease: 'sine.inOut' }, 2.5)

  // 光谱投影渐显渐隐
  if (spectrumRef.value) {
    for (let i = 0; i <= 4; i++) {
      master.to(spectrumRef.value, { opacity: 0.8, scaleX: 1.5, duration: 0.3, ease: 'power2.out' }, i + 0.3)
      master.to(spectrumRef.value, { opacity: 0.3, scaleX: 1, duration: 0.5, ease: 'power2.in' }, i + 0.65)
    }
  }

  for (let i = 0; i <= 5; i++) { master.to(prism, { scale: 1.04, duration: 0.08, ease: 'sine.inOut' }, i + 0.2); master.to(prism, { scale: 1, duration: 0.1, ease: 'sine.inOut' }, i + 0.35) }
  if (glowR.value) for (let i = 0; i <= 4; i++) { master.to(glowR.value, { opacity: 0.8, duration: 0.1 }, i + 0.3); master.to(glowR.value, { opacity: 0.4, duration: 0.3 }, i + 0.45) }
  if (progRef.value) master.to(progRef.value, { width: '100%', duration: 5 }, 0)
  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }
onMounted(() => { initCanvas(); requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupPrism() })); window.addEventListener('resize', handleResize) })
onUnmounted(() => { window.removeEventListener('resize', handleResize); cancelAnimationFrame(animId); ScrollTrigger.getAll().forEach(st => st.kill()); cleanupFns.forEach(fn => fn()); cleanupFns.length = 0; photons.length = 0 })
</script>

<style scoped lang="scss">
.pm3-root { position: relative; width: 100vw; height: 100vh; overflow: hidden; background: linear-gradient(155deg, #fefafc 0%, #fcf7f9 20%, #fef9fb 40%, #fdf8fa 60%, #fefafc 80%, #fcf7f9 100%); font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif; }
.pm3-glow { position: absolute; border-radius: 50%; filter: blur(50px); pointer-events: none; will-change: transform, opacity; z-index: 0; }
.pm3-glow--r { width: 20vw; height: 20vw; top: -3vh; left: 30vw; background: radial-gradient(circle, rgba(255,80,100,.4) 0%, transparent 70%); opacity: .4; }
.pm3-glow--g { width: 20vw; height: 20vw; top: 50vh; left: 50vw; background: radial-gradient(circle, rgba(100,220,160,.4) 0%, transparent 70%); opacity: .4; }
.pm3-glow--b { width: 20vw; height: 20vw; bottom: -3vh; right: 25vw; background: radial-gradient(circle, rgba(90,180,240,.4) 0%, transparent 70%); opacity: .4; }
.pm3-canvas { position: absolute; inset: 0; z-index: 1; pointer-events: none; }

.pm3-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 2;
  &::-webkit-scrollbar { width: 5px; } &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(180,160,210,.3); &:hover { background: rgba(180,160,210,.5); } }
}
.pm3-track { position: relative; width: 100%; } .pm3-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

.pm3-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 30; text-align: center; width: min(92vw, 800px); }
.pm3-kicker { display: inline-block; font-size: .66rem; font-weight: 700; letter-spacing: .26em; text-transform: uppercase; color: rgba(150,120,200,.8); background: rgba(180,150,230,.1); backdrop-filter: blur(8px); border: 1px solid rgba(160,140,210,.2); border-radius: 999px; padding: .3rem 1.2rem; margin-bottom: .55rem; }
.pm3-title { margin: 0; display: flex; justify-content: center; gap: .08em; }
.pm3-title__c { display: inline-block; font-size: clamp(2.2rem, 5.5vw, 4.6rem); font-weight: 900; will-change: transform,opacity;
  &--r { color: #ff5070; } &--g { color: #5ce0a0; } &--b { color: #5ac8fa; }
  &--rainbow { background: linear-gradient(90deg, #ff4d6a, #ff8c69, #ffb347, #5ce0a0, #5ac8fa, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 2px 12px rgba(200,160,240,.5)); }
}
.pm3-line { width: 120px; height: 2px; margin: .45rem auto .6rem; background: linear-gradient(90deg, #ff5070, #ffb347, #5ce0a0, #5ac8fa, #a78bfa); }
.pm3-sub { margin: 0; font-size: clamp(.76rem, 1.1vw, .88rem); color: rgba(150,120,190,.5); max-width: 480px; margin-inline: auto; }

.pm3-stage { position: absolute; top: 48%; left: 50%; transform: translate(-50%, -50%) rotateX(10deg); width: 0; height: 0; z-index: 10; perspective: 800px; perspective-origin: 50% 50%; will-change: transform, opacity; }
.pm3-prism { position: absolute; width: 0; height: 0; transform-style: preserve-3d; will-change: transform; }

.pm3-face { position: absolute; width: 16vw; max-width: 150px; height: 36vh; max-height: 300px; margin-left: -8vw; margin-top: -18vh; backface-visibility: hidden; border-radius: 6px; overflow: hidden; box-shadow: 0 5px 25px rgba(0,0,0,.15); border: 1px solid rgba(255,255,255,.25); }
.pm3-face__img { width: 100%; height: 100%; object-fit: cover; }

.pm3-top-tri { position: absolute; width: 16vw; max-width: 150px; height: 16vw; max-height: 150px; margin-left: -8vw; margin-top: -18vh; backface-visibility: hidden; overflow: hidden; clip-path: polygon(50% 0%, 0% 100%, 100% 100%); transform: rotateX(90deg) translateZ(-16vw); transform-origin: 50% 0%; border-radius: 6px 6px 0 0; }
.pm3-top-tri__img { width: 100%; height: 100%; object-fit: cover; }
.pm3-bot-tri { position: absolute; width: 16vw; max-width: 150px; height: 16vw; max-height: 150px; margin-left: -8vw; margin-top: 18vh; backface-visibility: hidden; overflow: hidden; clip-path: polygon(0% 0%, 100% 0%, 50% 100%); transform: rotateX(-90deg) translateZ(-16vw); transform-origin: 50% 100%; border-radius: 0 0 6px 6px; }
.pm3-bot-tri__img { width: 100%; height: 100%; object-fit: cover; }

/* 光谱投影 */
.pm3-spectrum { position: absolute; bottom: -10vh; left: 50%; transform: translateX(-50%); display: flex; height: 3px; border-radius: 3px; overflow: hidden; z-index: 5; opacity: .4; pointer-events: none; will-change: transform, opacity; }
.pm3-spectrum__band { width: 20px; height: 100%; }

.pm3-progress { position: absolute; left: 0; bottom: 0; z-index: 30; width: 100%; height: 3px; background: rgba(180,160,210,.06); }
.pm3-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #ff4d6a, #ffb347, #5ce0a0, #5ac8fa, #a78bfa); background-size: 200% 100%; box-shadow: 0 0 12px rgba(180,150,220,.5); }
@media (max-width: 768px) { .pm3-header { top: 2vh; } .pm3-kicker { font-size: .54rem; } .pm3-title__c { font-size: 1.7rem; } .pm3-face { width: 22vw; height: 28vh; margin-left: -11vw; margin-top: -14vh; } }
</style>
