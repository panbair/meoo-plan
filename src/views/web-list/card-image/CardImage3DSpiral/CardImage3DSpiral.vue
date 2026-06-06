<template>
  <section ref="rootRef" class="sp3-root">
    <div ref="glowA" class="sp3-glow sp3-glow--a"></div>
    <div ref="glowB" class="sp3-glow sp3-glow--b"></div>
    <canvas ref="canvasRef" class="sp3-canvas"></canvas>

    <div ref="scrollRef" class="sp3-scroll">
      <div ref="trackRef" class="sp3-track" :style="{ height: trackHeight }">
        <div class="sp3-sticky">

          <header ref="headerRef" class="sp3-header">
            <span class="sp3-kicker">🌀 CSS 3D Spiral · 螺旋上升 🌀</span>
            <h1 class="sp3-title">
              <span ref="tc1" class="sp3-title__c">螺</span>
              <span ref="tc2" class="sp3-title__c sp3-title__c--3d">旋</span>
              <span ref="tc3" class="sp3-title__c">上</span>
              <span ref="tc4" class="sp3-title__c sp3-title__c--3d">升</span>
            </h1>
            <div ref="lineRef" class="sp3-line"></div>
            <p class="sp3-sub">向下滚动 · 12张图片沿Y轴螺旋排列 · 旋转上升的立体画廊</p>
          </header>

          <!-- 🌀 3D螺旋场景 -->
          <div ref="spiralStage" class="sp3-stage">
            <div ref="spiralCore" class="sp3-core">
              <div
                v-for="(img, idx) in spiralImages"
                :key="idx"
                :ref="(el) => setCardRef(el, idx)"
                class="sp3-card"
                :style="cardStyle(idx)"
              >
                <img :src="img.src" :alt="img.alt" class="sp3-card__img" loading="eager" />
                <span class="sp3-card__label">{{ img.label }}</span>
              </div>
            </div>
          </div>

          <div ref="infoLabel" class="sp3-info">{{ spiralImages[currentCard]?.label }}</div>
          <div class="sp3-progress"><div ref="progRef" class="sp3-progress__fill"></div></div>
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
//  CardImage3DSpiral — CSS3 3D螺旋上升
//
//  12张图片沿Y轴螺旋排列：
//  - Y: -50vh → +50vh (垂直分布)
//  - rotateY: 0° → 1080° (3圈螺旋)
//  - translateZ: 推离中心形成环
//  - 配合 perspective 形成强烈的3D螺旋深度感
//
//  用户竖滚 → 整个螺旋绕Y轴旋转 + Y轴上下浮动
// ═══════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

interface SpiralImage { label: string; src: string; alt: string }

const spiralImages: SpiralImage[] = [
  { label: '珊瑚01', src: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=500&q=80', alt: '珊瑚' },
  { label: '田野02', src: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&q=80', alt: '田野' },
  { label: '山峦03', src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&q=80', alt: '山峦' },
  { label: '森林04', src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&q=80', alt: '森林' },
  { label: '花朵05', src: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=500&q=80', alt: '花朵' },
  { label: '云光06', src: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=500&q=80', alt: '云光' },
  { label: '碧海07', src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80', alt: '碧海' },
  { label: '极光08', src: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=500&q=80', alt: '极光' },
  { label: '晨曦09', src: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&q=80', alt: '晨曦' },
  { label: '夕阳10', src: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=500&q=80', alt: '夕阳' },
  { label: '星空11', src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&q=80', alt: '星空' },
  { label: '花海12', src: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=500&q=80', alt: '花海' },
]

const CARD_COUNT = spiralImages.length
const ANGLE_STEP = (360 * 3) / CARD_COUNT // 3圈螺旋 = 1080°
const Y_STEP = 100 / CARD_COUNT // vh per card
const RADIUS = 30 // vw
const trackHeight = `${(CARD_COUNT + 2) * 100}vh`
const currentCard = ref(0)

const rootRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const lineRef = ref<HTMLElement | null>(null)
const tc1 = ref<HTMLElement | null>(null); const tc2 = ref<HTMLElement | null>(null)
const tc3 = ref<HTMLElement | null>(null); const tc4 = ref<HTMLElement | null>(null)
const spiralStage = ref<HTMLElement | null>(null)
const spiralCore = ref<HTMLElement | null>(null)
const infoLabel = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const glowA = ref<HTMLElement | null>(null); const glowB = ref<HTMLElement | null>(null)

const cardRefs = ref<HTMLElement[]>([])
const setCardRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) cardRefs.value[i] = el }
const cleanupFns: TweenCleanup[] = []

function cardStyle(idx: number) {
  const ry = idx * ANGLE_STEP
  const y = (idx - CARD_COUNT / 2) * Y_STEP
  return {
    transform: `rotateY(${ry}deg) translateZ(${RADIUS}vw) translateY(${y}vh)`,
    zIndex: Math.floor(100 + Math.sin(idx / CARD_COUNT * Math.PI * 2) * 50),
  }
}

// Canvas
interface Stardust { x: number; y: number; vy: number; size: number; alpha: number; hue: number; life: number; maxLife: number }
let ctx: CanvasRenderingContext2D | null = null; let cw = 0; let ch = 0
let animId = 0; const stardusts: Stardust[] = []

function createDust(): Stardust {
  return { x: Math.random() * cw, y: ch + 20, vy: -(0.4 + Math.random() * 2), size: 0.8 + Math.random() * 2.5, alpha: 0.2 + Math.random() * 0.4, hue: [25, 195, 45, 330][Math.floor(Math.random() * 4)], life: 0, maxLife: 150 + Math.random() * 350 }
}

function initCanvas() {
  const c = canvasRef.value; if (!c) return
  ctx = c.getContext('2d'); if (!ctx) return
  const resize = () => { cw = window.innerWidth; ch = window.innerHeight; c.width = cw; c.height = ch }
  resize(); window.addEventListener('resize', resize)
  cleanupFns.push(() => window.removeEventListener('resize', resize))
  for (let i = 0; i < 45; i++) stardusts.push(createDust())

  function animate() {
    if (!ctx) return; ctx.clearRect(0, 0, cw, ch)
    while (stardusts.length < 45) stardusts.push(createDust())
    for (let i = stardusts.length - 1; i >= 0; i--) {
      const d = stardusts[i]; d.life++
      if (d.life >= d.maxLife) { stardusts.splice(i, 1); continue }
      d.y += d.vy
      const t = d.life / d.maxLife; const fade = t < 0.08 ? t / 0.08 : t > 0.7 ? 1 - (t - 0.7) / 0.3 : 1
      ctx!.beginPath(); ctx!.arc(d.x, d.y, d.size, 0, Math.PI * 2)
      ctx!.fillStyle = `hsla(${d.hue}, 70%, 72%, ${d.alpha * fade})`; ctx!.fill()
      if (d.y < -20) { d.y = ch + 20; d.x = Math.random() * cw; d.life = 0 }
    }
    animId = requestAnimationFrame(animate)
  }
  animId = requestAnimationFrame(animate)
}

function setupEntrance() {
  if (!scrollRef.value || !headerRef.value || !spiralStage.value) return
  const tl = gsap.timeline({ scrollTrigger: { trigger: scrollRef.value, scroller: scrollRef.value, start: 'top 75%', toggleActions: 'play none none reverse' } })
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.85, ease: 'power3.out' })
    .fromTo([tc1.value, tc2.value, tc3.value, tc4.value], { autoAlpha: 0, rotateX: 90, scale: 0.2 }, { autoAlpha: 1, rotateX: 0, scale: 1, duration: 0.6, stagger: 0.08, ease: 'back.out(2.2)' }, '-=0.45')
    .fromTo(lineRef.value, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power3.inOut' }, '-=0.25')
    .fromTo(spiralStage.value, { autoAlpha: 0, rotateX: -20 }, { autoAlpha: 1, rotateX: 8, duration: 0.8, ease: 'power3.out' }, '-=0.35')
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

function setupSpiral() {
  if (!scrollRef.value || !trackRef.value || !spiralCore.value) return
  const scroller = scrollRef.value; const track = trackRef.value; const core = spiralCore.value

  gsap.set(core, { rotateY: 0 })

  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.2,
      onUpdate(self) {
        currentCard.value = Math.min(CARD_COUNT - 1, Math.max(0, Math.floor(self.progress * CARD_COUNT)))
      },
    },
  })

  // 螺旋绕Y轴旋转整圈 + 微浮动
  master.to(core, { rotateY: 360, duration: 4, ease: 'power2.inOut' }, 0)
  master.to(core, { rotateY: 720, duration: 4, ease: 'power2.inOut' }, 4)
  master.to(core, { rotateY: 1080, duration: CARD_COUNT - 8, ease: 'power2.inOut' }, 8)

  // Y轴轻微浮动
  for (let i = 0; i < CARD_COUNT; i++) {
    master.to(core, { y: -8, duration: 0.3, ease: 'sine.inOut' }, i + 0.2)
    master.to(core, { y: 5, duration: 0.35, ease: 'sine.inOut' }, i + 0.55)
    master.to(core, { y: 0, duration: 0.3, ease: 'sine.inOut' }, i + 0.85)
  }

  for (let i = 0; i <= CARD_COUNT; i++) {
    master.to(core, { scale: 1.03, duration: 0.08, ease: 'sine.inOut' }, i + 0.3)
    master.to(core, { scale: 1, duration: 0.1, ease: 'sine.inOut' }, i + 0.4)
  }

  if (glowA.value && glowB.value) {
    master.to(glowA.value, { x: '6vw', y: '-4vh', scale: 1.15, duration: CARD_COUNT }, 0)
    master.to(glowB.value, { x: '-4vw', y: '5vh', scale: 1.2, duration: CARD_COUNT }, 0)
  }
  if (progRef.value) master.to(progRef.value, { width: '100%', duration: CARD_COUNT }, 0)

  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }

onMounted(() => {
  initCanvas()
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupSpiral() }))
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  cancelAnimationFrame(animId)
  ScrollTrigger.getAll().forEach(st => st.kill())
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0; stardusts.length = 0
})
</script>

<style scoped lang="scss">
.sp3-root { position: relative; width: 100vw; height: 100vh; overflow: hidden; background: linear-gradient(155deg, #fefaf7 0%, #fcf5ef 20%, #fdf7f3 40%, #fcf6f0 60%, #fdf8f4 80%, #fcf6f1 100%); font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif; }
.sp3-glow { position: absolute; border-radius: 50%; filter: blur(65px); pointer-events: none; will-change: transform; z-index: 0; }
.sp3-glow--a { width: 28vw; height: 28vw; top: -4vh; left: -2vw; background: radial-gradient(circle, rgba(255,160,140,.4) 0%, transparent 70%); }
.sp3-glow--b { width: 24vw; height: 24vw; bottom: -4vh; right: -1vw; background: radial-gradient(circle, rgba(140,200,240,.38) 0%, transparent 70%); }
.sp3-canvas { position: absolute; inset: 0; z-index: 1; pointer-events: none; }

.sp3-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 2;
  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(255,150,120,.3); &:hover { background: rgba(255,150,120,.5); } }
}
.sp3-track { position: relative; width: 100%; }
.sp3-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

.sp3-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 30; text-align: center; width: min(92vw, 800px); }
.sp3-kicker { display: inline-block; font-size: .66rem; font-weight: 700; letter-spacing: .26em; text-transform: uppercase; color: rgba(200,130,110,.8); background: rgba(255,150,120,.1); backdrop-filter: blur(8px); border: 1px solid rgba(255,140,110,.2); border-radius: 999px; padding: .3rem 1.2rem; margin-bottom: .55rem; }
.sp3-title { margin: 0; display: flex; justify-content: center; gap: .08em; }
.sp3-title__c { display: inline-block; font-size: clamp(2.2rem, 5.5vw, 4.6rem); font-weight: 900; color: #c87058; will-change: transform,opacity;
  &--3d { background: linear-gradient(180deg, #ff8c69, #60b8f0, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 2px 14px rgba(100,180,230,.45)); }
}
.sp3-line { width: 90px; height: 2px; margin: .45rem auto .6rem; background: linear-gradient(90deg, transparent, #ff8c69, #a78bfa, transparent); }
.sp3-sub { margin: 0; font-size: clamp(.76rem, 1.1vw, .88rem); color: rgba(180,110,90,.5); max-width: 480px; margin-inline: auto; }

/* ═══════════════ 3D螺旋 ═══════════════ */
.sp3-stage {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%) rotateX(8deg);
  width: 0; height: 0; z-index: 10;
  perspective: 900px; perspective-origin: 50% 50%;
  will-change: transform, opacity;
}

.sp3-core {
  position: absolute; width: 0; height: 0;
  transform-style: preserve-3d; will-change: transform;
}

/* 每张卡片 = 螺旋上的一个节点 */
.sp3-card {
  position: absolute;
  width: 24vw; max-width: 220px;
  height: 17vw; max-height: 160px;
  margin-left: calc(-12vw);
  margin-top: calc(-8.5vw);
  backface-visibility: hidden;
  border-radius: 10px; overflow: hidden;
  box-shadow: 0 8px 35px rgba(0,0,0,.18);
  border: 2px solid rgba(255,255,255,.25);
  will-change: transform;
}

.sp3-card__img { width: 100%; height: 100%; object-fit: cover; }
.sp3-card__label { position: absolute; bottom: 4px; left: 50%; transform: translateX(-50%); z-index: 2; font-size: .5rem; font-weight: 700; letter-spacing: .1em; color: #fff; text-shadow: 0 1px 4px rgba(0,0,0,.5); background: rgba(0,0,0,.18); border-radius: 999px; padding: .08rem .45rem; }

.sp3-info { position: absolute; bottom: 4vh; left: 50%; transform: translateX(-50%); z-index: 25; font-size: .7rem; font-weight: 700; letter-spacing: .25em; color: #c87058; background: rgba(255,255,255,.45); backdrop-filter: blur(8px); border-radius: 999px; padding: .25rem 1rem; pointer-events: none; }
.sp3-progress { position: absolute; left: 0; bottom: 0; z-index: 30; width: 100%; height: 3px; background: rgba(255,140,120,.06); }
.sp3-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #ff8c69, #60b8f0, #a78bfa, #ff8c69); background-size: 200% 100%; box-shadow: 0 0 12px rgba(255,140,100,.5); }
@media (max-width: 768px) { .sp3-header { top: 2vh; } .sp3-kicker { font-size: .54rem; } .sp3-title__c { font-size: 1.7rem; } .sp3-card { width: 32vw; height: 23vw; margin-left: -16vw; margin-top: -11.5vw; } }
</style>
