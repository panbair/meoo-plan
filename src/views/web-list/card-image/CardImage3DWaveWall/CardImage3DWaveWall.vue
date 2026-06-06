<template>
  <section ref="rootRef" class="ww3-root">
    <div ref="glowA" class="ww3-glow ww3-glow--a"></div>
    <div ref="glowB" class="ww3-glow ww3-glow--b"></div>
    <canvas ref="canvasRef" class="ww3-canvas"></canvas>

    <div ref="scrollRef" class="ww3-scroll">
      <div ref="trackRef" class="ww3-track" :style="{ height: trackHeight }">
        <div class="ww3-sticky">

          <header ref="headerRef" class="ww3-header">
            <span class="ww3-kicker">〰 CSS 3D WaveWall · 波浪墙 〰</span>
            <h1 class="ww3-title">
              <span ref="tc1" class="ww3-title__c">波</span>
              <span ref="tc2" class="ww3-title__c ww3-title__c--3d">浪</span>
              <span ref="tc3" class="ww3-title__c">之</span>
              <span ref="tc4" class="ww3-title__c ww3-title__c--3d">墙</span>
            </h1>
            <div ref="lineRef" class="ww3-line"></div>
            <p class="ww3-sub">向下滚动 · 5×4 图片矩阵 · sin波在3D墙面传播起伏</p>
          </header>

          <!-- 〰 3D波浪墙 -->
          <div ref="wallStage" class="ww3-stage">
            <div ref="wallRef" class="ww3-wall">
              <div
                v-for="(cell, idx) in GRID"
                :key="idx"
                :ref="(el) => setCellRef(el, idx)"
                class="ww3-cell"
                :style="cellBaseStyle(idx)"
              >
                <img :src="cell.src" :alt="cell.alt" class="ww3-cell__img" loading="eager" />
              </div>
            </div>
          </div>

          <div class="ww3-progress"><div ref="progRef" class="ww3-progress__fill"></div></div>
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
//  CardImage3DWaveWall — CSS3 3D波浪墙
//
//  5列×4行 = 20张图片排列成矩阵
//  每格：rotateX(Y位置) + translateZ 形成波浪起伏
//  波浪 = sin(col * phaseX + row * phaseY + scrollOffset)
//  用户竖滚 → 相位偏移传播 → 波浪在墙面上流动
// ═══════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

const COLS = 5; const ROWS = 4
const IMGS = [
  'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=400&q=80',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80',
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&q=80',
]

interface Cell { src: string; alt: string; col: number; row: number }
const GRID: Cell[] = []
for (let row = 0; row < ROWS; row++) {
  for (let col = 0; col < COLS; col++) {
    GRID.push({ src: IMGS[(row * COLS + col) % IMGS.length], alt: `R${row}C${col}`, col, row })
  }
}

const CELL_W = 16; const CELL_H = 18 // vw/vh
const GAP = 1.5
const trackHeight = `${(ROWS + 3) * 100}vh`

const rootRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const lineRef = ref<HTMLElement | null>(null)
const tc1 = ref<HTMLElement | null>(null); const tc2 = ref<HTMLElement | null>(null)
const tc3 = ref<HTMLElement | null>(null); const tc4 = ref<HTMLElement | null>(null)
const wallStage = ref<HTMLElement | null>(null)
const wallRef = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const glowA = ref<HTMLElement | null>(null); const glowB = ref<HTMLElement | null>(null)

const cellRefs = ref<HTMLElement[]>([])
const setCellRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) cellRefs.value[i] = el }
const cleanupFns: TweenCleanup[] = []

function cellBaseStyle(idx: number) {
  const cell = GRID[idx]
  const x = (cell.col - (COLS - 1) / 2) * (CELL_W + GAP)
  const y = (cell.row - (ROWS - 1) / 2) * (CELL_H + GAP)
  return {
    left: `${x}vw`,
    top: `${y}vh`,
    width: `${CELL_W}vw`,
    height: `${CELL_H}vh`,
  }
}

// Canvas
interface WaveDrop { x: number; y: number; vy: number; size: number; alpha: number; hue: number; life: number; maxLife: number }
let ctx: CanvasRenderingContext2D | null = null; let cw = 0; let ch = 0
let animId = 0; const drops: WaveDrop[] = []

function createDrop(): WaveDrop {
  return { x: Math.random() * cw, y: ch + 20, vy: -(0.4 + Math.random() * 2), size: 1 + Math.random() * 2.5, alpha: 0.2 + Math.random() * 0.35, hue: [200, 210, 190, 35][Math.floor(Math.random() * 4)], life: 0, maxLife: 150 + Math.random() * 300 }
}

function initCanvas() {
  const c = canvasRef.value; if (!c) return
  ctx = c.getContext('2d'); if (!ctx) return
  const resize = () => { cw = window.innerWidth; ch = window.innerHeight; c.width = cw; c.height = ch }
  resize(); window.addEventListener('resize', resize)
  cleanupFns.push(() => window.removeEventListener('resize', resize))
  for (let i = 0; i < 40; i++) drops.push(createDrop())

  function animate() {
    if (!ctx) return; ctx.clearRect(0, 0, cw, ch)
    while (drops.length < 40) drops.push(createDrop())
    for (let i = drops.length - 1; i >= 0; i--) {
      const d = drops[i]; d.life++
      if (d.life >= d.maxLife) { drops.splice(i, 1); continue }
      d.y += d.vy
      const t = d.life / d.maxLife; const fade = t < 0.08 ? t / 0.08 : t > 0.7 ? 1 - (t - 0.7) / 0.3 : 1
      ctx!.beginPath(); ctx!.arc(d.x, d.y, d.size, 0, Math.PI * 2)
      ctx!.fillStyle = `hsla(${d.hue}, 60%, 72%, ${d.alpha * fade})`; ctx!.fill()
      if (d.y < -20) { d.y = ch + 20; d.x = Math.random() * cw; d.life = 0 }
    }
    animId = requestAnimationFrame(animate)
  }
  animId = requestAnimationFrame(animate)
}

function setupEntrance() {
  if (!scrollRef.value || !headerRef.value || !wallStage.value) return
  const tl = gsap.timeline({ scrollTrigger: { trigger: scrollRef.value, scroller: scrollRef.value, start: 'top 75%', toggleActions: 'play none none reverse' } })
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.85, ease: 'power3.out' })
    .fromTo([tc1.value, tc2.value, tc3.value, tc4.value], { autoAlpha: 0, z: -200, scale: 0.3 }, { autoAlpha: 1, z: 0, scale: 1, duration: 0.6, stagger: 0.08, ease: 'back.out(2.2)' }, '-=0.45')
    .fromTo(lineRef.value, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power3.inOut' }, '-=0.25')
    .fromTo(wallStage.value, { autoAlpha: 0, rotateX: -20, scale: 0.7 }, { autoAlpha: 1, rotateX: 8, scale: 1, duration: 0.8, ease: 'power3.out' }, '-=0.35')
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

function setupWaveWall() {
  if (!scrollRef.value || !trackRef.value) return
  const scroller = scrollRef.value; const track = trackRef.value
  const cells = cellRefs.value
  if (!cells.length) return

  // 🔑 初始波浪状态
  cells.forEach((cell, idx) => {
    const c = GRID[idx]
    const phase = c.col * 0.6 + c.row * 0.5
    const wave = Math.sin(phase * Math.PI)
    gsap.set(cell, {
      rotateX: wave * 25,
      rotateY: Math.cos(phase * Math.PI) * 15,
      translateZ: 15 + wave * 20,
      filter: `brightness(${0.9 + wave * 0.25})`,
    })
  })

  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.15 },
  })

  // 🔑 波浪传播：逐格更新相位
  cells.forEach((cell, idx) => {
    const c = GRID[idx]
    const basePhase = c.col * 0.6 + c.row * 0.5

    // 多个波浪周期
    for (let w = 0; w < ROWS + 3; w++) {
      const offset = w * 0.7
      const phase = basePhase + w * 0.8
      const wave = Math.sin(phase * Math.PI)
      const wave2 = Math.sin((phase + 0.8) * Math.PI)

      master.to(cell, {
        rotateX: wave * 25,
        rotateY: Math.cos(phase * Math.PI) * 15,
        translateZ: 15 + wave * 20,
        filter: `brightness(${0.9 + wave * 0.25})`,
        duration: 0.35, ease: 'sine.inOut',
      }, offset)

      master.to(cell, {
        rotateX: wave2 * 25,
        rotateY: Math.cos((phase + 0.8) * Math.PI) * 15,
        translateZ: 15 + wave2 * 20,
        filter: `brightness(${0.9 + wave2 * 0.25})`,
        duration: 0.35, ease: 'sine.inOut',
      }, offset + 0.35)
    }
  })

  // 墙面整体微动
  if (wallRef.value) {
    master.to(wallRef.value, { rotateY: 5, duration: 1.5, ease: 'sine.inOut' }, 0)
    master.to(wallRef.value, { rotateY: -4, duration: 1.5, ease: 'sine.inOut' }, 1.5)
    master.to(wallRef.value, { rotateY: 3, duration: 1.5, ease: 'sine.inOut' }, 3)
  }

  if (glowA.value && glowB.value) {
    master.to(glowA.value, { x: '6vw', y: '-4vh', scale: 1.15, duration: ROWS + 3 }, 0)
    master.to(glowB.value, { x: '-4vw', y: '5vh', scale: 1.2, duration: ROWS + 3 }, 0)
  }
  if (progRef.value) master.to(progRef.value, { width: '100%', duration: ROWS + 3 }, 0)

  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }

onMounted(() => {
  initCanvas()
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupWaveWall() }))
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  cancelAnimationFrame(animId)
  ScrollTrigger.getAll().forEach(st => st.kill())
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0; drops.length = 0
})
</script>

<style scoped lang="scss">
.ww3-root { position: relative; width: 100vw; height: 100vh; overflow: hidden; background: linear-gradient(155deg, #f8fafc 0%, #f5f7fa 20%, #fafcfe 40%, #f6f8fb 60%, #f9fbfd 80%, #f5f7fa 100%); font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif; }
.ww3-glow { position: absolute; border-radius: 50%; filter: blur(70px); pointer-events: none; will-change: transform; z-index: 0; }
.ww3-glow--a { width: 30vw; height: 30vw; top: -4vh; left: -2vw; background: radial-gradient(circle, rgba(140,200,240,.35) 0%, transparent 70%); }
.ww3-glow--b { width: 26vw; height: 26vw; bottom: -4vh; right: -1vw; background: radial-gradient(circle, rgba(160,220,200,.35) 0%, transparent 70%); }
.ww3-canvas { position: absolute; inset: 0; z-index: 1; pointer-events: none; }

.ww3-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 2;
  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(140,190,230,.3); &:hover { background: rgba(140,190,230,.5); } }
}
.ww3-track { position: relative; width: 100%; }
.ww3-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

.ww3-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 30; text-align: center; width: min(92vw, 800px); }
.ww3-kicker { display: inline-block; font-size: .66rem; font-weight: 700; letter-spacing: .26em; text-transform: uppercase; color: rgba(100,150,200,.8); background: rgba(140,190,230,.1); backdrop-filter: blur(8px); border: 1px solid rgba(130,180,220,.2); border-radius: 999px; padding: .3rem 1.2rem; margin-bottom: .55rem; }
.ww3-title { margin: 0; display: flex; justify-content: center; gap: .08em; }
.ww3-title__c { display: inline-block; font-size: clamp(2.2rem, 5.5vw, 4.6rem); font-weight: 900; color: #5a9ec8; will-change: transform,opacity;
  &--3d { background: linear-gradient(135deg, #5ac8fa, #60b8f0, #a0d8f0, #5ac8fa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 2px 16px rgba(90,180,240,.5)); }
}
.ww3-line { width: 90px; height: 2px; margin: .45rem auto .6rem; background: linear-gradient(90deg, transparent, #5ac8fa, #60b8f0, transparent); }
.ww3-sub { margin: 0; font-size: clamp(.76rem, 1.1vw, .88rem); color: rgba(100,150,190,.5); max-width: 480px; margin-inline: auto; }

/* ═══════════════ 3D波浪墙 ═══════════════ */
.ww3-stage {
  position: absolute; top: 48%; left: 50%;
  transform: translate(-50%, -50%) rotateX(8deg);
  width: 0; height: 0; z-index: 10;
  perspective: 700px; perspective-origin: 50% 50%;
  will-change: transform, opacity;
}

.ww3-wall {
  position: absolute;
  width: 90vw; max-width: 800px;
  height: 85vh; max-height: 500px;
  margin-left: -45vw; margin-top: -42.5vh;
  transform-style: preserve-3d; will-change: transform;
}

.ww3-cell {
  position: absolute;
  border-radius: 6px; overflow: hidden;
  box-shadow: 0 6px 30px rgba(0,0,0,.12);
  border: 1px solid rgba(255,255,255,.2);
  will-change: transform, filter;
}

.ww3-cell__img { width: 100%; height: 100%; object-fit: cover; }

.ww3-progress { position: absolute; left: 0; bottom: 0; z-index: 30; width: 100%; height: 3px; background: rgba(140,190,230,.06); }
.ww3-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #5ac8fa, #60b8f0, #a0d8f0, #5ac8fa); background-size: 200% 100%; box-shadow: 0 0 12px rgba(90,180,240,.5); }
@media (max-width: 768px) { .ww3-header { top: 2vh; } .ww3-kicker { font-size: .54rem; } .ww3-title__c { font-size: 1.7rem; } }
</style>
