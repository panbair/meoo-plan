<template>
  <section ref="rootRef" class="dm3-root">
    <div ref="glowA" class="dm3-glow dm3-glow--a"></div>
    <div ref="glowB" class="dm3-glow dm3-glow--b"></div>
    <canvas ref="canvasRef" class="dm3-canvas"></canvas>

    <div ref="scrollRef" class="dm3-scroll">
      <div ref="trackRef" class="dm3-track" :style="{ height: trackHeight }">
        <div class="dm3-sticky">

          <header ref="headerRef" class="dm3-header">
            <span class="dm3-kicker">💎 CSS 3D Diamond · 立体钻石 💎</span>
            <h1 class="dm3-title">
              <span ref="tc1" class="dm3-title__c">钻</span>
              <span ref="tc2" class="dm3-title__c dm3-title__c--3d">石</span>
              <span ref="tc3" class="dm3-title__c">切</span>
              <span ref="tc4" class="dm3-title__c dm3-title__c--3d">面</span>
            </h1>
            <div ref="lineRef" class="dm3-line"></div>
            <p class="dm3-sub">向下滚动 · 8面体钻石旋转 · 每个切面都是精美图片</p>
          </header>

          <!-- 💎 3D钻石场景 -->
          <div ref="gemStage" class="dm3-stage">
            <div ref="gemRef" class="dm3-gem">
              <!-- 上半金字塔 (4面) -->
              <div v-for="(face, idx) in topFaces" :key="'t'+idx"
                :ref="(el) => setFaceRef(el, idx)" class="dm3-face dm3-face--top"
                :style="topFaceStyle(idx)">
                <img :src="face.src" :alt="face.alt" class="dm3-face__img" />
              </div>
              <!-- 下半金字塔 (4面) -->
              <div v-for="(face, idx) in bottomFaces" :key="'b'+idx"
                :ref="(el) => setFaceRef(el, idx + 4)" class="dm3-face dm3-face--bottom"
                :style="bottomFaceStyle(idx)">
                <img :src="face.src" :alt="face.alt" class="dm3-face__img" />
              </div>
            </div>
          </div>

          <!-- 光芒 -->
          <div ref="sparkle1" class="dm3-sparkle dm3-sparkle--1"></div>
          <div ref="sparkle2" class="dm3-sparkle dm3-sparkle--2"></div>

          <div ref="infoLabel" class="dm3-info">💎 {{ FACES[currentFace]?.label }}</div>
          <div class="dm3-progress"><div ref="progRef" class="dm3-progress__fill"></div></div>
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
//  CardImage3DDiamond — CSS3 3D立体钻石
//
//  八面体（双四棱锥）= 上半4面 + 下半4面
//  上半：rotateX(45°) 的4个三角面（金字塔顶）
//  下半：rotateX(-45°) 的4个三角面（金字塔底）
//  每面是三角形（clip-path: polygon）+ rotateY(0/90/180/270)
//  用户竖滚 → 钻石绕Y轴旋转展示切面
// ═══════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

interface GemFace { label: string; src: string; alt: string }

const FACES: GemFace[] = [
  { label: '珊瑚', src: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=500&q=80', alt: '珊瑚' },
  { label: '金色', src: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&q=80', alt: '金色' },
  { label: '山峦', src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&q=80', alt: '山峦' },
  { label: '森林', src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&q=80', alt: '森林' },
  { label: '花海', src: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=500&q=80', alt: '花海' },
  { label: '云光', src: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=500&q=80', alt: '云光' },
  { label: '碧海', src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80', alt: '碧海' },
  { label: '极光', src: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=500&q=80', alt: '极光' },
]

const topFaces = FACES.slice(0, 4)
const bottomFaces = FACES.slice(4, 8)
const currentFace = ref(0)
const trackHeight = `${(FACES.length / 2 + 2) * 100}vh`

const rootRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const lineRef = ref<HTMLElement | null>(null)
const tc1 = ref<HTMLElement | null>(null); const tc2 = ref<HTMLElement | null>(null)
const tc3 = ref<HTMLElement | null>(null); const tc4 = ref<HTMLElement | null>(null)
const gemStage = ref<HTMLElement | null>(null)
const gemRef = ref<HTMLElement | null>(null)
const sparkle1 = ref<HTMLElement | null>(null); const sparkle2 = ref<HTMLElement | null>(null)
const infoLabel = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const glowA = ref<HTMLElement | null>(null); const glowB = ref<HTMLElement | null>(null)

const faceRefs = ref<HTMLElement[]>([])
const setFaceRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) faceRefs.value[i] = el }
const cleanupFns: TweenCleanup[] = []

function topFaceStyle(idx: number) {
  const ry = idx * 90
  // 上半：金字塔形 → rotateX(35deg) 向上倾斜的三角面
  return { transform: `rotateY(${ry}deg) rotateX(35deg) translateZ(15vw)` }
}
function bottomFaceStyle(idx: number) {
  const ry = idx * 90 + 45 // 底部面错开45度
  return { transform: `rotateY(${ry}deg) rotateX(-35deg) translateZ(15vw)` }
}

// Canvas 钻石光尘
interface GemDust { x: number; y: number; vy: number; size: number; alpha: number; life: number; maxLife: number }
let ctx: CanvasRenderingContext2D | null = null; let cw = 0; let ch = 0
let animId = 0; const gemDusts: GemDust[] = []

function createGemDust(): GemDust {
  return { x: Math.random() * cw, y: ch + 20, vy: -(0.4 + Math.random() * 2.5), size: 0.5 + Math.random() * 2, alpha: 0.3 + Math.random() * 0.6, life: 0, maxLife: 120 + Math.random() * 250 }
}

function initCanvas() {
  const c = canvasRef.value; if (!c) return
  ctx = c.getContext('2d'); if (!ctx) return
  const resize = () => { cw = window.innerWidth; ch = window.innerHeight; c.width = cw; c.height = ch }
  resize(); window.addEventListener('resize', resize)
  cleanupFns.push(() => window.removeEventListener('resize', resize))
  for (let i = 0; i < 55; i++) gemDusts.push(createGemDust())

  function animate() {
    if (!ctx) return; ctx.clearRect(0, 0, cw, ch)
    while (gemDusts.length < 55) gemDusts.push(createGemDust())
    for (let i = gemDusts.length - 1; i >= 0; i--) {
      const d = gemDusts[i]; d.life++
      if (d.life >= d.maxLife) { gemDusts.splice(i, 1); continue }
      d.y += d.vy
      const t = d.life / d.maxLife; const fade = t < 0.06 ? t / 0.06 : t > 0.7 ? 1 - (t - 0.7) / 0.3 : 1
      // 钻石光尘 = 白色为主 + 七彩闪烁
      const isWhite = Math.random() > 0.3
      ctx!.beginPath(); ctx!.arc(d.x, d.y, d.size, 0, Math.PI * 2)
      if (isWhite) {
        ctx!.fillStyle = `rgba(255,255,255,${d.alpha * fade})`
      } else {
        const hue = [200, 340, 50, 280][Math.floor(Math.random() * 4)]
        ctx!.fillStyle = `hsla(${hue}, 80%, 70%, ${d.alpha * fade * 0.6})`
      }
      ctx!.fill()
      // 十字光芒
      ctx!.strokeStyle = `rgba(255,255,255,${d.alpha * fade * 0.3})`
      ctx!.lineWidth = 0.5
      ctx!.beginPath(); ctx!.moveTo(d.x - d.size * 2, d.y); ctx!.lineTo(d.x + d.size * 2, d.y); ctx!.stroke()
      ctx!.beginPath(); ctx!.moveTo(d.x, d.y - d.size * 2); ctx!.lineTo(d.x, d.y + d.size * 2); ctx!.stroke()
      if (d.y < -30) { d.y = ch + 30; d.x = Math.random() * cw; d.life = 0 }
    }
    animId = requestAnimationFrame(animate)
  }
  animId = requestAnimationFrame(animate)
}

function setupEntrance() {
  if (!scrollRef.value || !headerRef.value || !gemStage.value) return
  const tl = gsap.timeline({ scrollTrigger: { trigger: scrollRef.value, scroller: scrollRef.value, start: 'top 75%', toggleActions: 'play none none reverse' } })
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.85, ease: 'power3.out' })
    .fromTo([tc1.value, tc2.value, tc3.value, tc4.value], { autoAlpha: 0, z: -200, scale: 0.2 }, { autoAlpha: 1, z: 0, scale: 1, duration: 0.6, stagger: 0.08, ease: 'back.out(2.5)' }, '-=0.45')
    .fromTo(lineRef.value, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power3.inOut' }, '-=0.25')
    .fromTo(gemStage.value, { autoAlpha: 0, scale: 0.3 }, { autoAlpha: 1, scale: 0.9, duration: 0.9, ease: 'elastic.out(1, 0.6)' }, '-=0.35')
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

function setupDiamond() {
  if (!scrollRef.value || !trackRef.value || !gemRef.value) return
  const scroller = scrollRef.value; const track = trackRef.value; const gem = gemRef.value

  gsap.set(gem, { rotateY: 0, rotateX: -4 })

  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.1,
      onUpdate(self) { currentFace.value = Math.floor((self.progress * FACES.length) % FACES.length) },
    },
  })

  // 钻石绕Y轴旋转2圈
  master.to(gem, { rotateY: 360, duration: 3, ease: 'power2.inOut' }, 0)
  master.to(gem, { rotateY: 720, duration: FACES.length / 2 - 1, ease: 'power2.inOut' }, 2)

  // 上下浮动闪烁
  for (let i = 0; i <= FACES.length / 2; i++) {
    master.to(gem, { scale: 0.95, duration: 0.06, ease: 'power2.in' }, i + 0.2)
    master.to(gem, { scale: 0.9, duration: 0.12, ease: 'elastic.out(1, 0.5)' }, i + 0.3)
    master.to(gem, { rotateX: -7, duration: 0.08, ease: 'power2.out' }, i + 0.25)
    master.to(gem, { rotateX: -2, duration: 0.1, ease: 'power2.in' }, i + 0.35)
  }

  // 闪烁光
  if (sparkle1.value && sparkle2.value) {
    for (let i = 0; i <= FACES.length / 2; i++) {
      master.to(sparkle1.value, { opacity: 0.9, scale: 1.5, duration: 0.05, ease: 'power2.out' }, i + 0.22)
      master.to(sparkle1.value, { opacity: 0, scale: 0.5, duration: 0.15, ease: 'power2.in' }, i + 0.28)
      master.to(sparkle2.value, { opacity: 0.8, scale: 1.3, duration: 0.04, ease: 'power2.out' }, i + 0.5)
      master.to(sparkle2.value, { opacity: 0, scale: 0.5, duration: 0.15, ease: 'power2.in' }, i + 0.55)
    }
  }

  if (glowA.value && glowB.value) {
    master.to(glowA.value, { x: '6vw', y: '-4vh', scale: 1.2, duration: FACES.length / 2 + 2 }, 0)
    master.to(glowB.value, { x: '-4vw', y: '5vh', scale: 1.25, duration: FACES.length / 2 + 2 }, 0)
  }
  if (progRef.value) master.to(progRef.value, { width: '100%', duration: FACES.length / 2 + 2 }, 0)

  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }

onMounted(() => {
  initCanvas()
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupDiamond() }))
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  cancelAnimationFrame(animId)
  ScrollTrigger.getAll().forEach(st => st.kill())
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0; gemDusts.length = 0
})
</script>

<style scoped lang="scss">
.dm3-root { position: relative; width: 100vw; height: 100vh; overflow: hidden; background: linear-gradient(155deg, #fefafc 0%, #fcf7fa 20%, #fdf9fc 40%, #fcf6f8 60%, #fdf8fb 80%, #fcf7f9 100%); font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif; }
.dm3-glow { position: absolute; border-radius: 50%; filter: blur(60px); pointer-events: none; will-change: transform; z-index: 0; }
.dm3-glow--a { width: 26vw; height: 26vw; top: -4vh; left: -2vw; background: radial-gradient(circle, rgba(240,180,255,.35) 0%, transparent 70%); }
.dm3-glow--b { width: 24vw; height: 24vw; bottom: -4vh; right: -1vw; background: radial-gradient(circle, rgba(180,220,255,.35) 0%, transparent 70%); }
.dm3-canvas { position: absolute; inset: 0; z-index: 1; pointer-events: none; }

.dm3-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 2;
  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(200,160,220,.3); &:hover { background: rgba(200,160,220,.5); } }
}
.dm3-track { position: relative; width: 100%; }
.dm3-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

.dm3-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 30; text-align: center; width: min(92vw, 800px); }
.dm3-kicker { display: inline-block; font-size: .66rem; font-weight: 700; letter-spacing: .26em; text-transform: uppercase; color: rgba(160,110,190,.8); background: rgba(200,160,230,.1); backdrop-filter: blur(8px); border: 1px solid rgba(180,140,210,.2); border-radius: 999px; padding: .3rem 1.2rem; margin-bottom: .55rem; }
.dm3-title { margin: 0; display: flex; justify-content: center; gap: .08em; }
.dm3-title__c { display: inline-block; font-size: clamp(2.2rem, 5.5vw, 4.6rem); font-weight: 900; color: #a878c0; will-change: transform,opacity;
  &--3d { background: linear-gradient(135deg, #e8b4f8, #c0a0f0, #a0d8f8, #f0c8ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 2px 18px rgba(200,160,240,.6)); }
}
.dm3-line { width: 90px; height: 2px; margin: .45rem auto .6rem; background: linear-gradient(90deg, transparent, #e8b4f8, #a0d8f8, #f0c8ff, transparent); }
.dm3-sub { margin: 0; font-size: clamp(.76rem, 1.1vw, .88rem); color: rgba(150,100,180,.5); max-width: 460px; margin-inline: auto; }

/* ═══════════════ 3D钻石 ═══════════════ */
.dm3-stage {
  position: absolute; top: 48%; left: 50%;
  transform: translate(-50%, -50%);
  width: 0; height: 0; z-index: 10;
  perspective: 800px; perspective-origin: 50% 50%;
  will-change: transform, opacity;
}

.dm3-gem {
  position: absolute; width: 0; height: 0;
  transform-style: preserve-3d; transform: scale(0.9);
  will-change: transform;
}

/* 🔑 钻石切面 = 三角形（clip-path裁剪） */
.dm3-face {
  position: absolute;
  width: 28vw; max-width: 260px;
  height: 28vw; max-height: 260px;
  margin-left: calc(-14vw); margin-top: calc(-14vw);
  backface-visibility: hidden;
  overflow: hidden;

  &--top {
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%); // 正三角
  }
  &--bottom {
    clip-path: polygon(0% 0%, 100% 0%, 50% 100%); // 倒三角
  }
}

.dm3-face__img { width: 100%; height: 100%; object-fit: cover; }

/* 闪烁光 */
.dm3-sparkle {
  position: absolute; top: 45%; left: 50%; z-index: 12;
  width: 8px; height: 8px; border-radius: 50%;
  background: #fff; transform: translate(-50%, -50%);
  pointer-events: none; opacity: 0;
  box-shadow: 0 0 8px #fff, 0 0 30px rgba(200,160,255,.8), 0 0 60px rgba(150,200,255,.5);
  will-change: transform, opacity;
  &--1 { margin-left: 10px; margin-top: -10px; }
  &--2 { margin-left: -8px; margin-top: 12px; }
}

.dm3-info { position: absolute; bottom: 4vh; left: 50%; transform: translateX(-50%); z-index: 25; font-size: .7rem; font-weight: 700; letter-spacing: .25em; color: #a878c0; background: rgba(255,255,255,.45); backdrop-filter: blur(8px); border-radius: 999px; padding: .25rem 1rem; pointer-events: none; }
.dm3-progress { position: absolute; left: 0; bottom: 0; z-index: 30; width: 100%; height: 3px; background: rgba(200,160,220,.06); }
.dm3-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #e8b4f8, #a0d8f8, #f0c8ff, #e8b4f8); background-size: 200% 100%; box-shadow: 0 0 12px rgba(200,160,240,.5); }
@media (max-width: 768px) { .dm3-header { top: 2vh; } .dm3-kicker { font-size: .54rem; } .dm3-title__c { font-size: 1.7rem; } .dm3-face { width: 38vw; height: 38vw; margin-left: -19vw; margin-top: -19vw; } }
</style>
