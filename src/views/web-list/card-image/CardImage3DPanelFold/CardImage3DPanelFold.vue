<template>
  <section ref="rootRef" class="pf3-root">
    <div ref="glowA" class="pf3-glow pf3-glow--a"></div>
    <div ref="glowB" class="pf3-glow pf3-glow--b"></div>
    <canvas ref="canvasRef" class="pf3-canvas"></canvas>

    <div ref="scrollRef" class="pf3-scroll">
      <div ref="trackRef" class="pf3-track" :style="{ height: trackHeight }">
        <div class="pf3-sticky">

          <header ref="headerRef" class="pf3-header">
            <span class="pf3-kicker">▦ CSS 3D Panel Fold · 立体折叠 ▦</span>
            <h1 class="pf3-title">
              <span ref="tc1" class="pf3-title__c">折</span>
              <span ref="tc2" class="pf3-title__c pf3-title__c--3d">叠</span>
              <span ref="tc3" class="pf3-title__c">波</span>
              <span ref="tc4" class="pf3-title__c pf3-title__c--3d">浪</span>
            </h1>
            <div ref="lineRef" class="pf3-line"></div>
            <p class="pf3-sub">向下滚动 · 6段面板沿X轴3D折叠 · 如手风琴般优雅开合</p>
          </header>

          <!-- ▦ 3D折叠场景 -->
          <div ref="foldStage" class="pf3-stage">
            <div ref="foldContainer" class="pf3-fold-container">
              <!-- 面板条 -->
              <div
                v-for="(panel, idx) in panels"
                :key="panel.id"
                :ref="(el) => setPanelRef(el, idx)"
                class="pf3-panel"
                :style="{ backgroundImage: `url(${panel.image})` }"
              >
                <div class="pf3-panel__overlay"></div>
                <span class="pf3-panel__label">{{ panel.label }}</span>
              </div>
            </div>
          </div>

          <div ref="infoLabel" class="pf3-info">{{ panels[currentPanel]?.title }}</div>
          <div class="pf3-progress"><div ref="progRef" class="pf3-progress__fill"></div></div>
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
//  CardImage3DPanelFold — CSS3 3D立体折叠波浪
//
//  核心概念：6段水平面板沿X轴3D折叠
//  1. 每个面板是一段水平条带
//  2. 折叠 = rotateX(0° → ±90°) + transform-origin: top/bottom
//  3. 奇偶面板交替折叠方向（向上/向下）
//  4. 形成手风琴/百叶窗式的波浪折叠效果
//  5. 折叠时露出背景色，形成鲜明对比
//
//  用户竖滚 → 面板依次折叠→展开→折叠 → 波浪般的效果
// ═══════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

interface FoldPanel {
  id: string; label: string; title: string; image: string; alt: string
}

const panels: FoldPanel[] = [
  { id: 'p1', label: '01', title: '琥珀晨光', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80', alt: '琥珀晨光' },
  { id: 'p2', label: '02', title: '珊瑚海岸', image: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=1200&q=80', alt: '珊瑚海岸' },
  { id: 'p3', label: '03', title: '金色山谷', image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80', alt: '金色山谷' },
  { id: 'p4', label: '04', title: '森林之光', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80', alt: '森林之光' },
  { id: 'p5', label: '05', title: '云中漫步', image: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=1200&q=80', alt: '云中漫步' },
  { id: 'p6', label: '06', title: '蜜桃花海', image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200&q=80', alt: '蜜桃花海' },
]

const PANEL_COUNT = panels.length
const trackHeight = `${(PANEL_COUNT + 2) * 100}vh`
const currentPanel = ref(0)

const rootRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const lineRef = ref<HTMLElement | null>(null)
const tc1 = ref<HTMLElement | null>(null); const tc2 = ref<HTMLElement | null>(null)
const tc3 = ref<HTMLElement | null>(null); const tc4 = ref<HTMLElement | null>(null)
const foldStage = ref<HTMLElement | null>(null)
const foldContainer = ref<HTMLElement | null>(null)
const infoLabel = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const glowA = ref<HTMLElement | null>(null)
const glowB = ref<HTMLElement | null>(null)

const panelRefs = ref<HTMLElement[]>([])
const setPanelRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) panelRefs.value[i] = el }

const cleanupFns: TweenCleanup[] = []

// Canvas
interface FoldSpark { x: number; y: number; vy: number; size: number; alpha: number; hue: number; life: number; maxLife: number }
let ctx: CanvasRenderingContext2D | null = null; let cw = 0; let ch = 0
const foldSparks: FoldSpark[] = []; let animId = 0

function createFoldSpark(): FoldSpark {
  return { x: Math.random() * cw, y: ch + 20, vy: -(0.5 + Math.random() * 2), size: 1 + Math.random() * 3, alpha: 0.25 + Math.random() * 0.4, hue: [20, 35, 190, 45][Math.floor(Math.random() * 4)], life: 0, maxLife: 160 + Math.random() * 300 }
}

function initCanvas() {
  const c = canvasRef.value; if (!c) return
  ctx = c.getContext('2d'); if (!ctx) return
  const resize = () => { cw = window.innerWidth; ch = window.innerHeight; c.width = cw; c.height = ch }
  resize(); window.addEventListener('resize', resize)
  cleanupFns.push(() => window.removeEventListener('resize', resize))
  for (let i = 0; i < 45; i++) foldSparks.push(createFoldSpark())

  function animate() {
    if (!ctx) return; ctx.clearRect(0, 0, cw, ch)
    while (foldSparks.length < 45) foldSparks.push(createFoldSpark())
    for (let i = foldSparks.length - 1; i >= 0; i--) {
      const s = foldSparks[i]; s.life++
      if (s.life >= s.maxLife) { foldSparks.splice(i, 1); continue }
      const t = s.life / s.maxLife; const fade = t < 0.08 ? t / 0.08 : t > 0.7 ? 1 - (t - 0.7) / 0.3 : 1
      s.y += s.vy
      ctx!.beginPath(); ctx!.arc(s.x, s.y, s.size, 0, Math.PI * 2)
      ctx!.fillStyle = `hsla(${s.hue}, 70%, 70%, ${s.alpha * fade})`; ctx!.fill()
      if (s.y < -20) { s.y = ch + 20; s.x = Math.random() * cw; s.life = 0 }
    }
    animId = requestAnimationFrame(animate)
  }
  animId = requestAnimationFrame(animate)
}

function setupEntrance() {
  if (!scrollRef.value || !headerRef.value || !foldStage.value) return
  const tl = gsap.timeline({ scrollTrigger: { trigger: scrollRef.value, scroller: scrollRef.value, start: 'top 75%', toggleActions: 'play none none reverse' } })
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.85, ease: 'power3.out' })
    .fromTo([tc1.value, tc2.value, tc3.value, tc4.value], { autoAlpha: 0, rotateX: 90, scale: 0.3 }, { autoAlpha: 1, rotateX: 0, scale: 1, duration: 0.6, stagger: 0.08, ease: 'back.out(2.2)' }, '-=0.45')
    .fromTo(lineRef.value, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power3.inOut' }, '-=0.25')
    .fromTo(foldStage.value, { autoAlpha: 0, rotateX: 20, scale: 0.7 }, { autoAlpha: 1, rotateX: 0, scale: 1, duration: 0.8, ease: 'power3.out' }, '-=0.35')
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

function setupPanelFold() {
  if (!scrollRef.value || !trackRef.value || !foldContainer.value) return
  const scroller = scrollRef.value; const track = trackRef.value
  const panelEls = panelRefs.value
  if (!panelEls.length) return

  // 🔑 初始化：所有面板平展 (rotateX=0)
  panelEls.forEach((panel, i) => {
    gsap.set(panel, {
      transformOrigin: i % 2 === 0 ? 'center top' : 'center bottom',
      rotateX: 0,
    })
  })

  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.15,
      onUpdate(self) {
        currentPanel.value = Math.min(PANEL_COUNT - 1, Math.max(0, Math.floor(self.progress * PANEL_COUNT)))
      },
    },
  })

  // 🔑 波浪折叠：依次折叠→展开→折叠
  // 每个面板：展开(0°) → 折叠(90°/-90°) → 展开(0°)
  panelEls.forEach((panel, i) => {
    const o = i
    const foldAngle = i % 2 === 0 ? 85 : -85 // 偶数向上折，奇数向下折

    // 展开状态 (0°)
    master.set(panel, { rotateX: 0 }, o)

    // 折叠动画 (0° → foldAngle)
    master.to(panel, { rotateX: foldAngle, duration: 0.55, ease: 'power2.in' }, o + 0.25)
    // 保持折叠
    master.set(panel, { rotateX: foldAngle }, o + 0.8)
    // 展开动画 (foldAngle → 0°)
    master.to(panel, { rotateX: 0, duration: 0.55, ease: 'elastic.out(1, 0.5)' }, o + 0.8)
  })

  // 整组缩放呼吸
  if (foldContainer.value) {
    for (let i = 0; i <= PANEL_COUNT; i++) {
      master.to(foldContainer.value, { scale: 1.03, duration: 0.12, ease: 'sine.inOut' }, i + 0.2)
      master.to(foldContainer.value, { scale: 1, duration: 0.18, ease: 'sine.inOut' }, i + 0.35)
    }
  }

  if (glowA.value && glowB.value) {
    master.to(glowA.value, { x: '6vw', y: '-4vh', scale: 1.15, duration: PANEL_COUNT }, 0)
    master.to(glowB.value, { x: '-4vw', y: '5vh', scale: 1.2, duration: PANEL_COUNT }, 0)
  }
  if (progRef.value) master.to(progRef.value, { width: '100%', duration: PANEL_COUNT }, 0)

  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }

onMounted(() => {
  initCanvas()
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupPanelFold() }))
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  cancelAnimationFrame(animId)
  ScrollTrigger.getAll().forEach(st => st.kill())
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0; foldSparks.length = 0
})
</script>

<style scoped lang="scss">
.pf3-root { position: relative; width: 100vw; height: 100vh; overflow: hidden; background: linear-gradient(160deg, #fefaf6 0%, #fdf5ef 20%, #fef8f3 40%, #fdf6f0 60%, #fef9f5 80%, #fdf7f1 100%); font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif; }

.pf3-glow { position: absolute; border-radius: 50%; filter: blur(65px); pointer-events: none; will-change: transform; z-index: 0; }
.pf3-glow--a { width: 28vw; height: 28vw; top: -4vh; left: -2vw; background: radial-gradient(circle, rgba(255,160,140,.45) 0%, transparent 70%); }
.pf3-glow--b { width: 24vw; height: 24vw; bottom: -4vh; right: -1vw; background: radial-gradient(circle, rgba(140,200,230,.4) 0%, transparent 70%); }

.pf3-canvas { position: absolute; inset: 0; z-index: 1; pointer-events: none; }

.pf3-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 2;
  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(255,150,130,.3); &:hover { background: rgba(255,150,130,.5); } }
}
.pf3-track { position: relative; width: 100%; }
.pf3-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

.pf3-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 30; text-align: center; width: min(92vw, 800px); }
.pf3-kicker { display: inline-block; font-size: .66rem; font-weight: 700; letter-spacing: .26em; text-transform: uppercase; color: rgba(200,130,110,.8); background: rgba(255,150,120,.1); backdrop-filter: blur(8px); border: 1px solid rgba(255,140,110,.2); border-radius: 999px; padding: .3rem 1.2rem; margin-bottom: .55rem; }
.pf3-title { margin: 0; display: flex; justify-content: center; gap: .08em; }
.pf3-title__c { display: inline-block; font-size: clamp(2.2rem, 5.5vw, 4.6rem); font-weight: 900; color: #c87058; will-change: transform,opacity;
  &--3d { background: linear-gradient(135deg, #ff8c69, #60b8f0, #5ce0a0); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 2px 14px rgba(100,180,230,.45)); }
}
.pf3-line { width: 90px; height: 2px; margin: .45rem auto .6rem; border-radius: 2px; background: linear-gradient(90deg, transparent, #ff8c69, #60b8f0, #5ce0a0, transparent); transform-origin: center; }
.pf3-sub { margin: 0; font-size: clamp(.76rem, 1.1vw, .88rem); color: rgba(180,110,90,.5); max-width: 480px; margin-inline: auto; }

/* ═══════════════════════ CSS3 3D 折叠 ═══════════════════════ */
.pf3-stage {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 0; height: 0;
  z-index: 10;
  perspective: 800px;
  perspective-origin: 50% 50%;
  will-change: transform, opacity;
}

.pf3-fold-container {
  position: absolute;
  width: 80vw; max-width: 700px;
  height: 60vh; max-height: 480px;
  margin-left: -40vw; margin-top: -30vh;
  transform-style: preserve-3d;       // 🔑
  will-change: transform;
}

/* 🔑 每个面板是一个水平条带 */
.pf3-panel {
  position: absolute;
  left: 0; right: 0;
  height: calc(100% / 6);             // 6等分
  background-size: cover;
  background-position: center;
  border-radius: 2px;
  backface-visibility: visible;       // 可以看到背面（折叠时）
  overflow: hidden;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.15);

  &:nth-child(1) { top: 0;  z-index: 6; background-position-y: 0%; }
  &:nth-child(2) { top: 16.66%; z-index: 5; background-position-y: 20%; }
  &:nth-child(3) { top: 33.33%; z-index: 4; background-position-y: 40%; }
  &:nth-child(4) { top: 50%; z-index: 3; background-position-y: 60%; }
  &:nth-child(5) { top: 66.66%; z-index: 2; background-position-y: 80%; }
  &:nth-child(6) { top: 83.33%; z-index: 1; background-position-y: 100%; }
}

/* 面板上的半透明覆盖 */
.pf3-panel__overlay {
  position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(255,255,255,.08), rgba(0,0,0,.05));
}

.pf3-panel__label {
  position: absolute; bottom: 4px; right: 8px; z-index: 2;
  font-size: .52rem; font-weight: 700; letter-spacing: .12em;
  color: #fff; text-shadow: 0 1px 4px rgba(0,0,0,.5);
  background: rgba(0,0,0,.18); border-radius: 999px; padding: .1rem .45rem;
}

.pf3-info { position: absolute; bottom: 4vh; left: 50%; transform: translateX(-50%); z-index: 25; font-size: .7rem; font-weight: 700; letter-spacing: .25em; color: #c87058; background: rgba(255,255,255,.45); backdrop-filter: blur(8px); border-radius: 999px; padding: .25rem 1rem; pointer-events: none; }

.pf3-progress { position: absolute; left: 0; bottom: 0; z-index: 30; width: 100%; height: 3px; background: rgba(255,140,120,.06); }
.pf3-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #ff8c69, #60b8f0, #5ce0a0, #ff8c69); background-size: 200% 100%; box-shadow: 0 0 12px rgba(255,140,110,.5); }

@media (max-width: 768px) {
  .pf3-header { top: 2vh; } .pf3-kicker { font-size: .54rem; padding: .2rem .65rem; } .pf3-title__c { font-size: 1.7rem; }
  .pf3-fold-container { width: 92vw; height: 50vh; margin-left: -46vw; margin-top: -25vh; }
}
</style>
