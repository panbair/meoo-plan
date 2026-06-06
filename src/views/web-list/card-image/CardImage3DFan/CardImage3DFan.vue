<template>
  <section ref="rootRef" class="fn3-root">
    <div ref="glowA" class="fn3-glow fn3-glow--a"></div>
    <div ref="glowB" class="fn3-glow fn3-glow--b"></div>
    <canvas ref="canvasRef" class="fn3-canvas"></canvas>

    <div ref="scrollRef" class="fn3-scroll">
      <div ref="trackRef" class="fn3-track" :style="{ height: trackHeight }">
        <div class="fn3-sticky">

          <header ref="headerRef" class="fn3-header">
            <span class="fn3-kicker">🪭 CSS 3D Fan · 立体折扇 🪭</span>
            <h1 class="fn3-title">
              <span ref="tc1" class="fn3-title__c">折</span>
              <span ref="tc2" class="fn3-title__c fn3-title__c--3d">扇</span>
              <span ref="tc3" class="fn3-title__c">展</span>
              <span ref="tc4" class="fn3-title__c fn3-title__c--3d">开</span>
            </h1>
            <div ref="lineRef" class="fn3-line"></div>
            <p class="fn3-sub">向下滚动 · 12片扇骨旋转展开 · 如折扇般优雅铺开</p>
          </header>

          <!-- 🪭 3D折扇 -->
          <div ref="fanStage" class="fn3-stage">
            <div ref="fanPivot" class="fn3-pivot">
              <div
                v-for="(img, idx) in fanImages"
                :key="idx"
                :ref="(el) => setRibRef(el, idx)"
                class="fn3-rib"
                :style="ribStyle(idx)"
              >
                <img :src="img" class="fn3-rib__img" loading="eager" />
              </div>
            </div>
          </div>

          <div ref="infoLabel" class="fn3-info">🪭 {{ fanImages.length }}片扇骨</div>
          <div class="fn3-progress"><div ref="progRef" class="fn3-progress__fill"></div></div>
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
//  CardImage3DFan — CSS3 3D立体折扇
//
//  12片扇骨围绕底部铰链(pivot)旋转展开
//  每片扇骨：rotateZ(展开角度) + origin在底部
//  未展开时：所有扇骨堆叠在一起
//  用户竖滚 → rotateZ从叠加大→张开的扇形
//  配合rotateY形成3D扇面（纸面微倾斜）
// ═══════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

const RIBS = 12
const TOTAL_ANGLE = 160 // 展开总角度
const IMGS = [
  'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=350&q=80',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=350&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=350&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=350&q=80',
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=350&q=80',
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=350&q=80',
]
const fanImages = Array.from({ length: RIBS }, (_, i) => IMGS[i % IMGS.length])
const trackHeight = `${(RIBS / 2 + 2) * 100}vh`

const rootRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null); const lineRef = ref<HTMLElement | null>(null)
const tc1 = ref<HTMLElement | null>(null); const tc2 = ref<HTMLElement | null>(null)
const tc3 = ref<HTMLElement | null>(null); const tc4 = ref<HTMLElement | null>(null)
const fanStage = ref<HTMLElement | null>(null); const fanPivot = ref<HTMLElement | null>(null)
const infoLabel = ref<HTMLElement | null>(null); const progRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const glowA = ref<HTMLElement | null>(null); const glowB = ref<HTMLElement | null>(null)

const ribRefs = ref<HTMLElement[]>([])
const setRibRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) ribRefs.value[i] = el }
const cleanupFns: TweenCleanup[] = []

function ribStyle(idx: number) {
  const frac = idx / (RIBS - 1)
  const angle = (frac - 0.5) * TOTAL_ANGLE
  // 每片扇骨：绕Z轴旋转形成扇形，绕Y轴微倾形成3D感
  return {
    transform: `rotateZ(${angle}deg) rotateY(${(frac - 0.5) * 15}deg)`,
    transformOrigin: '50% 100%',
    zIndex: Math.floor(100 - Math.abs(idx - RIBS / 2) * 5),
  }
}

// Canvas 扇动粒子
interface FanPetal { x: number; y: number; vx: number; vy: number; size: number; alpha: number; hue: number; rotation: number; life: number; maxLife: number }
let ctx: CanvasRenderingContext2D | null = null; let cw = 0; let ch = 0
let animId = 0; const petals: FanPetal[] = []

function createPetal(): FanPetal {
  return { x: Math.random() * cw, y: ch + 20, vx: (Math.random() - 0.5) * 1.5, vy: -(0.3 + Math.random() * 2.5), size: 2 + Math.random() * 5, alpha: 0.2 + Math.random() * 0.4, hue: [340, 25, 195, 45, 150][Math.floor(Math.random() * 5)], rotation: Math.random() * 360, life: 0, maxLife: 160 + Math.random() * 320 }
}

function initCanvas() {
  const c = canvasRef.value; if (!c) return
  ctx = c.getContext('2d'); if (!ctx) return
  const resize = () => { cw = window.innerWidth; ch = window.innerHeight; c.width = cw; c.height = ch }
  resize(); window.addEventListener('resize', resize)
  cleanupFns.push(() => window.removeEventListener('resize', resize))
  for (let i = 0; i < 50; i++) petals.push(createPetal())

  function animate() {
    if (!ctx) return; ctx.clearRect(0, 0, cw, ch)
    while (petals.length < 50) petals.push(createPetal())
    for (let i = petals.length - 1; i >= 0; i--) {
      const p = petals[i]; p.life++
      if (p.life >= p.maxLife) { petals.splice(i, 1); continue }
      const t = p.life / p.maxLife; const fade = t < 0.08 ? t / 0.08 : t > 0.7 ? 1 - (t - 0.7) / 0.3 : 1
      p.x += p.vx; p.y += p.vy; p.rotation += 0.8
      ctx!.save(); ctx!.translate(p.x, p.y); ctx!.rotate(p.rotation * Math.PI / 180)
      ctx!.beginPath(); ctx!.ellipse(0, 0, p.size * 0.5, p.size * 0.22, 0, 0, Math.PI * 2)
      ctx!.fillStyle = `hsla(${p.hue}, 70%, 75%, ${p.alpha * fade})`; ctx!.fill()
      ctx!.restore()
      if (p.y < -30) { p.y = ch + 30; p.x = Math.random() * cw; p.life = 0 }
    }
    animId = requestAnimationFrame(animate)
  }
  animId = requestAnimationFrame(animate)
}

function setupEntrance() {
  if (!scrollRef.value || !headerRef.value || !fanStage.value) return
  const tl = gsap.timeline({ scrollTrigger: { trigger: scrollRef.value, scroller: scrollRef.value, start: 'top 75%', toggleActions: 'play none none reverse' } })
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.85, ease: 'power3.out' })
    .fromTo([tc1.value, tc2.value, tc3.value, tc4.value], { autoAlpha: 0, rotateZ: -90, scale: 0.3 }, { autoAlpha: 1, rotateZ: 0, scale: 1, duration: 0.6, stagger: 0.08, ease: 'back.out(2.2)' }, '-=0.45')
    .fromTo(lineRef.value, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power3.inOut' }, '-=0.25')
    .fromTo(fanStage.value, { autoAlpha: 0, scale: 0.5 }, { autoAlpha: 1, scale: 1, duration: 0.8, ease: 'elastic.out(1, 0.5)' }, '-=0.35')
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

function setupFan() {
  if (!scrollRef.value || !trackRef.value || !fanPivot.value) return
  const scroller = scrollRef.value; const track = trackRef.value
  const pivot = fanPivot.value; const ribs = ribRefs.value
  if (!ribs.length) return

  // 🔑 初始：所有扇骨叠在一起 (rotateZ=0)
  ribs.forEach((rib, i) => {
    gsap.set(rib, { rotateZ: 0, rotateY: 0 })
  })

  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.2 },
  })

  // 🔑 展开：每根扇骨绕Z轴展开到目标角度
  ribs.forEach((rib, i) => {
    const frac = i / (RIBS - 1)
    const targetAngle = (frac - 0.5) * TOTAL_ANGLE
    const targetRY = (frac - 0.5) * 15

    // 0→1 展开
    master.to(rib, { rotateZ: targetAngle, rotateY: targetRY, duration: 0.8, ease: 'power3.out' }, 0)

    // 1.5→3 保持展开 + 微振动
    for (let w = 0; w < 3; w++) {
      master.to(rib, { rotateZ: targetAngle + (Math.random() - 0.5) * 3, duration: 0.3, ease: 'sine.inOut' }, 1 + w * 0.8)
      master.to(rib, { rotateZ: targetAngle, duration: 0.3, ease: 'sine.inOut' }, 1.3 + w * 0.8)
    }

    // 最后收拢
    master.to(rib, { rotateZ: 0, rotateY: 0, duration: 0.6, ease: 'power3.in' }, 4)
  })

  // 扇轴整体旋转
  master.to(pivot, { rotateY: 15, duration: 1, ease: 'sine.inOut' }, 0.3)
  master.to(pivot, { rotateY: -10, duration: 1.5, ease: 'sine.inOut' }, 1.5)
  master.to(pivot, { rotateY: 5, duration: 1, ease: 'sine.inOut' }, 3)

  for (let i = 0; i <= 4; i++) {
    master.to(pivot, { scale: 1.03, duration: 0.08, ease: 'sine.inOut' }, i + 0.2)
    master.to(pivot, { scale: 1, duration: 0.1, ease: 'sine.inOut' }, i + 0.35)
  }

  if (glowA.value && glowB.value) {
    master.to(glowA.value, { x: '6vw', y: '-4vh', scale: 1.15, duration: 5 }, 0)
    master.to(glowB.value, { x: '-4vw', y: '5vh', scale: 1.2, duration: 5 }, 0)
  }
  if (progRef.value) master.to(progRef.value, { width: '100%', duration: 5 }, 0)

  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }

onMounted(() => {
  initCanvas()
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupFan() }))
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  cancelAnimationFrame(animId)
  ScrollTrigger.getAll().forEach(st => st.kill())
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0; petals.length = 0
})
</script>

<style scoped lang="scss">
.fn3-root { position: relative; width: 100vw; height: 100vh; overflow: hidden; background: linear-gradient(155deg, #fefaf7 0%, #fcf5ef 20%, #fdf7f3 40%, #fcf6f0 60%, #fdf8f4 80%, #fcf6f1 100%); font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif; }
.fn3-glow { position: absolute; border-radius: 50%; filter: blur(65px); pointer-events: none; will-change: transform; z-index: 0; }
.fn3-glow--a { width: 28vw; height: 28vw; top: -4vh; left: -2vw; background: radial-gradient(circle, rgba(255,150,140,.4) 0%, transparent 70%); }
.fn3-glow--b { width: 24vw; height: 24vw; bottom: -4vh; right: -1vw; background: radial-gradient(circle, rgba(140,200,230,.38) 0%, transparent 70%); }
.fn3-canvas { position: absolute; inset: 0; z-index: 1; pointer-events: none; }

.fn3-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 2;
  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(255,150,120,.3); &:hover { background: rgba(255,150,120,.5); } }
}
.fn3-track { position: relative; width: 100%; }
.fn3-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

.fn3-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 30; text-align: center; width: min(92vw, 800px); }
.fn3-kicker { display: inline-block; font-size: .66rem; font-weight: 700; letter-spacing: .26em; text-transform: uppercase; color: rgba(200,130,110,.8); background: rgba(255,150,120,.1); backdrop-filter: blur(8px); border: 1px solid rgba(255,140,110,.2); border-radius: 999px; padding: .3rem 1.2rem; margin-bottom: .55rem; }
.fn3-title { margin: 0; display: flex; justify-content: center; gap: .08em; }
.fn3-title__c { display: inline-block; font-size: clamp(2.2rem, 5.5vw, 4.6rem); font-weight: 900; color: #c87058; will-change: transform,opacity;
  &--3d { background: linear-gradient(135deg, #ff8c69, #f0abfc, #60b8f0, #5ce0a0); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 2px 14px rgba(200,140,230,.5)); }
}
.fn3-line { width: 90px; height: 2px; margin: .45rem auto .6rem; background: linear-gradient(90deg, transparent, #ff8c69, #f0abfc, #5ce0a0, transparent); }
.fn3-sub { margin: 0; font-size: clamp(.76rem, 1.1vw, .88rem); color: rgba(180,110,90,.5); max-width: 480px; margin-inline: auto; }

/* ═══════════════ 3D折扇 ═══════════════ */
.fn3-stage {
  position: absolute; top: 55%; left: 50%;
  transform: translate(-50%, -50%);
  width: 0; height: 0; z-index: 10;
  perspective: 700px; perspective-origin: 50% 60%;
  will-change: transform, opacity;
}

.fn3-pivot {
  position: absolute; width: 0; height: 0;
  transform-style: preserve-3d; will-change: transform;
}

/* 每片扇骨 = 竖向矩形绕底边旋转 */
.fn3-rib {
  position: absolute;
  width: 8vw; max-width: 70px;
  height: 34vh; max-height: 280px;
  margin-left: -4vw;
  // 底边对齐到原点 (pivot)
  top: 0; margin-top: 0;
  backface-visibility: hidden;
  border-radius: 3px 3px 0 0;
  overflow: hidden;
  box-shadow: 0 4px 18px rgba(0,0,0,.13);
  border: 1px solid rgba(255,255,255,.2);
  will-change: transform;
}

.fn3-rib__img { width: 100%; height: 100%; object-fit: cover; }

.fn3-info { position: absolute; bottom: 4vh; left: 50%; transform: translateX(-50%); z-index: 25; font-size: .7rem; font-weight: 700; letter-spacing: .2em; color: #c87058; background: rgba(255,255,255,.45); backdrop-filter: blur(8px); border-radius: 999px; padding: .25rem 1rem; pointer-events: none; }
.fn3-progress { position: absolute; left: 0; bottom: 0; z-index: 30; width: 100%; height: 3px; background: rgba(255,140,120,.06); }
.fn3-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #ff8c69, #f0abfc, #5ce0a0, #60b8f0, #ff8c69); background-size: 200% 100%; box-shadow: 0 0 12px rgba(200,150,200,.5); }
@media (max-width: 768px) { .fn3-header { top: 2vh; } .fn3-kicker { font-size: .54rem; } .fn3-title__c { font-size: 1.7rem; } .fn3-rib { width: 10vw; height: 28vh; margin-left: -5vw; } }
</style>
