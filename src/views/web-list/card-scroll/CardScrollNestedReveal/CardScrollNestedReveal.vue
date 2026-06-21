<template>
  <section ref="rootRef" class="nr-root">
    <!-- 背景粒子 -->
    <div ref="particlesRef" class="nr-particles">
      <span v-for="p in particlesList" :key="p.id" class="nr-particle" :style="p.style"></span>
    </div>

    <!-- 舞台 -->
    <div ref="stageRef" class="nr-stage">
      <!-- ══════ 第一层图片：横线 → 纵向展开 ══════ -->
      <div ref="layer1Ref" class="nr-layer">
        <img :src="images.img1" alt="第一层" class="nr-layer__img" />
        <div ref="line1Ref" class="nr-line nr-line--h"></div>
      </div>

      <!-- ══════ 第二层图片：竖线 → 横向展开 ══════ -->
      <div ref="layer2Ref" class="nr-layer">
        <img :src="images.img2" alt="第二层" class="nr-layer__img" />
        <div ref="line2Ref" class="nr-line nr-line--v"></div>
      </div>

      <!-- ══════ 第三层图片：横线 → 纵向展开 ══════ -->
      <div ref="layer3Ref" class="nr-layer">
        <img :src="images.img3" alt="第三层" class="nr-layer__img" />
        <div ref="line3Ref" class="nr-line nr-line--h"></div>
      </div>

      <!-- ══════ 标题 ══════ -->
      <header ref="headerRef" class="nr-header">
        <span ref="kickerRef" class="nr-kicker">◇ 向下滚动 · 层层展开 ◇</span>
        <h1 class="nr-title">
          <span ref="t1Ref" class="nr-title__w nr-title__w--1">深</span>
          <span ref="t2Ref" class="nr-title__w nr-title__w--2">层</span>
          <span ref="t3Ref" class="nr-title__w nr-title__w--3">揭</span>
          <span ref="t4Ref" class="nr-title__w nr-title__w--1">秘</span>
        </h1>
        <div ref="dividerRef" class="nr-divider"></div>
        <p ref="subRef" class="nr-sub">一线开天 · 层层递进 · 每一层都是新世界</p>
      </header>

      <!-- 阶段指示器 -->
      <div ref="stageHintRef" class="nr-stage-hint">
        <span ref="stageDot1Ref" class="nr-stage-hint__dot nr-stage-hint__dot--active"></span>
        <span ref="stageDot2Ref" class="nr-stage-hint__dot"></span>
        <span ref="stageDot3Ref" class="nr-stage-hint__dot"></span>
      </div>

      <!-- 进度条 -->
      <div class="nr-progress">
        <div ref="progressFillRef" class="nr-progress__fill"></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ══════════════════════════════════════════════════════════════
//  CardScrollNestedReveal — 层层展开
//  一线出现 → 张开成矩形 → 图片随矩形展开 → 层层递进
//  参考 CardImgCinematicMask 滚动模式
// ══════════════════════════════════════════════════════════════

type TweenCleanup = () => void

// ── 图片 ──
const images = {
  img1: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
  img2: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80',
  img3: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=1920&q=80',
}

// ── 粒子 ──
interface Particle { id: number; style: Record<string, string> }
function genParticles(n: number): Particle[] {
  const pr = (s: number) => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x) }
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    style: {
      '--px': `${pr(i * 3 + 1) * 100}%`, '--py': `${pr(i * 3 + 2) * 100}%`,
      '--ps': `${2 + pr(i * 3 + 3) * 3}px`, '--pd': `${8 + pr(i * 5 + 7) * 14}s`,
      '--pdl': `${pr(i * 7 + 13) * -15}s`, '--po': `${0.12 + pr(i * 2 + 5) * 0.35}`,
    },
  }))
}
const particlesList = ref<Particle[]>(genParticles(30))

// ── Refs ──
const rootRef = ref<HTMLElement | null>(null)
const stageRef = ref<HTMLElement | null>(null)
const layer1Ref = ref<HTMLElement | null>(null)
const layer2Ref = ref<HTMLElement | null>(null)
const layer3Ref = ref<HTMLElement | null>(null)
const line1Ref = ref<HTMLElement | null>(null)
const line2Ref = ref<HTMLElement | null>(null)
const line3Ref = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const kickerRef = ref<HTMLElement | null>(null)
const t1Ref = ref<HTMLElement | null>(null)
const t2Ref = ref<HTMLElement | null>(null)
const t3Ref = ref<HTMLElement | null>(null)
const t4Ref = ref<HTMLElement | null>(null)
const dividerRef = ref<HTMLElement | null>(null)
const subRef = ref<HTMLElement | null>(null)
const stageHintRef = ref<HTMLElement | null>(null)
const stageDot1Ref = ref<HTMLElement | null>(null)
const stageDot2Ref = ref<HTMLElement | null>(null)
const stageDot3Ref = ref<HTMLElement | null>(null)
const progressFillRef = ref<HTMLElement | null>(null)
const particlesRef = ref<HTMLElement | null>(null)

const cleanupFns: TweenCleanup[] = []

// ═══════════════════════ 主时间线 ═══════════════════════
function setupTimeline() {
  const parent = rootRef.value
  const stage = stageRef.value
  if (!parent || !stage || !layer1Ref.value) return

  // —— 初始状态 ——
  gsap.set(stage, { opacity: 0 })

  // 三层图片初始都不可见（clip 闭合为一条线）
  gsap.set(layer1Ref.value, { clipPath: 'inset(50% 0 50% 0)' })
  gsap.set(layer2Ref.value, { clipPath: 'inset(0 50% 0 50%)' })
  gsap.set(layer3Ref.value, { clipPath: 'inset(50% 0 50% 0)' })

  // 三条发光线初始可见（闭合状态的线）
  gsap.set(line1Ref.value, { autoAlpha: 0, scaleY: 1, scaleX: 1 })
  gsap.set(line2Ref.value, { autoAlpha: 0, scaleY: 1, scaleX: 1 })
  gsap.set(line3Ref.value, { autoAlpha: 0, scaleY: 1, scaleX: 1 })

  // 标题
  gsap.set(headerRef.value, { autoAlpha: 0, y: 30 })
  gsap.set(kickerRef.value, { autoAlpha: 0, scale: 0.7 })
  gsap.set([t1Ref.value, t2Ref.value, t3Ref.value, t4Ref.value].filter(Boolean),
    { autoAlpha: 0, y: 18, scale: 0.5 })
  gsap.set(dividerRef.value, { scaleX: 0, autoAlpha: 0 })
  gsap.set(subRef.value, { autoAlpha: 0, y: 8 })

  // 阶段指示器
  gsap.set(stageHintRef.value, { autoAlpha: 0 })
  gsap.set(stageDot1Ref.value, { backgroundColor: 'rgba(255,170,110,0.9)' })
  gsap.set(stageDot2Ref.value, { backgroundColor: 'rgba(255,255,255,0.2)' })
  gsap.set(stageDot3Ref.value, { backgroundColor: 'rgba(255,255,255,0.2)' })

  gsap.set(particlesRef.value, { opacity: 0.3 })

  // —— 时间线 ——
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: parent,
      start: 'top 100%',
      end: 'bottom 50%',
      scrub: 1.5,
      toggleActions: 'play reverse play reverse',
    },
  })

  // ── 0.00–0.08: 舞台 + 标题入场 ──
  tl.to(stage, { opacity: 1, duration: 0.06, ease: 'power2.out' }, 0.01)
  tl.to(headerRef.value, { autoAlpha: 1, y: 0, duration: 0.06, ease: 'power2.out' }, 0.02)
  tl.to(kickerRef.value, { autoAlpha: 1, scale: 1, duration: 0.05, ease: 'power2.out' }, 0.03)
  tl.to([t1Ref.value, t2Ref.value, t3Ref.value, t4Ref.value].filter(Boolean),
    { autoAlpha: 1, y: 0, scale: 1, duration: 0.06, stagger: 0.03, ease: 'back.out(1.8)' }, 0.04)
  tl.to(dividerRef.value, { scaleX: 1, autoAlpha: 1, duration: 0.05, ease: 'power3.inOut' }, 0.07)
  tl.to(subRef.value, { autoAlpha: 1, y: 0, duration: 0.05, ease: 'power2.out' }, 0.08)
  tl.to(stageHintRef.value, { autoAlpha: 1, duration: 0.05, ease: 'power2.out' }, 0.08)
  tl.to(particlesRef.value, { opacity: 0.7, duration: 0.08, ease: 'power2.in' }, 0.02)

  // ══════ 第一层：横线 → 纵向张开 ══════
  // 0.08: 横线亮起
  tl.to(line1Ref.value, { autoAlpha: 1, duration: 0.04, ease: 'power2.out' }, 0.08)
  // 0.10–0.28: 横线纵向张开成矩形，图片1展开
  tl.to(layer1Ref.value, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.18, ease: 'power3.inOut' }, 0.10)
  // 线在张开过程中逐渐消失
  tl.to(line1Ref.value, { autoAlpha: 0, scaleY: 6, duration: 0.15, ease: 'power2.in' }, 0.10)
  // 阶段指示灯
  tl.to(stageDot1Ref.value, { backgroundColor: 'rgba(255,255,255,0.2)', duration: 0.08 }, 0.20)
  tl.to(stageDot2Ref.value, { backgroundColor: 'rgba(255,170,110,0.9)', duration: 0.08 }, 0.28)

  // ══════ 第二层：竖线 → 横向张开 ══════
  // 0.30: 竖线亮起
  tl.to(line2Ref.value, { autoAlpha: 1, duration: 0.04, ease: 'power2.out' }, 0.30)
  // 0.32–0.52: 竖线横向张开成矩形，图片2展开
  tl.to(layer2Ref.value, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.20, ease: 'power3.inOut' }, 0.32)
  tl.to(line2Ref.value, { autoAlpha: 0, scaleX: 6, duration: 0.16, ease: 'power2.in' }, 0.32)
  // 阶段指示灯
  tl.to(stageDot2Ref.value, { backgroundColor: 'rgba(255,255,255,0.2)', duration: 0.08 }, 0.44)
  tl.to(stageDot3Ref.value, { backgroundColor: 'rgba(255,170,110,0.9)', duration: 0.08 }, 0.52)

  // ══════ 第三层：横线 → 纵向张开 ══════
  // 0.55: 横线亮起
  tl.to(line3Ref.value, { autoAlpha: 1, duration: 0.04, ease: 'power2.out' }, 0.55)
  // 0.57–0.77: 横线纵向张开成矩形，图片3展开
  tl.to(layer3Ref.value, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.20, ease: 'power3.inOut' }, 0.57)
  tl.to(line3Ref.value, { autoAlpha: 0, scaleY: 6, duration: 0.16, ease: 'power2.in' }, 0.57)
  // 阶段指示灯
  tl.to(stageDot3Ref.value, { backgroundColor: 'rgba(255,255,255,0.2)', duration: 0.08 }, 0.70)

  // ── 0.80–1.00: 收尾淡出 ──
  tl.to(headerRef.value, { autoAlpha: 0.2, y: -6, duration: 0.08, ease: 'power2.in' }, 0.82)
  tl.to(stageHintRef.value, { autoAlpha: 0, duration: 0.06, ease: 'power2.in' }, 0.82)
  tl.to(particlesRef.value, { opacity: 0.25, duration: 0.10, ease: 'power2.in' }, 0.85)
  tl.to(stage, { opacity: 0.5, duration: 0.10, ease: 'power2.in' }, 0.88)

  // ── 进度条 ──
  tl.to(progressFillRef.value, { width: '100%', duration: 1, ease: 'none' }, 0)

  cleanupFns.push(() => {
    tl.scrollTrigger?.kill()
    tl.kill()
  })
}

function handleResize() { ScrollTrigger.refresh(true) }

onMounted(() => {
  requestAnimationFrame(() => { setupTimeline() })
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  ScrollTrigger.getAll().forEach((st) => st.kill())
  cleanupFns.forEach((fn) => fn())
  cleanupFns.length = 0
})
</script>

<style scoped lang="scss">
/* ═══════════════════════ 根 ═══════════════════════ */
.nr-root {
  position: relative; width: 100vw; height: 100vh; overflow: hidden;
  background: #060410;
  font-family: 'PingFang SC','Inter','Microsoft YaHei',system-ui,sans-serif;
}

/* ── 粒子 ── */
.nr-particles { position: absolute; inset: 0; z-index: 1; pointer-events: none; will-change: opacity; }
.nr-particle {
  --px: 50%; --py: 50%; --ps: 3px; --pd: 12s; --pdl: 0s; --po: 0.3;
  position: absolute; left: var(--px); top: var(--py);
  width: var(--ps); height: var(--ps); border-radius: 50%;
  background: radial-gradient(circle, rgba(255,200,150,.85) 0%, rgba(160,130,230,.45) 40%, transparent 70%);
  box-shadow: 0 0 calc(var(--ps)*3) rgba(180,150,240,.45), 0 0 calc(var(--ps)*6) rgba(255,170,110,.2);
  opacity: var(--po);
  animation: nr-float var(--pd) var(--pdl) infinite ease-in-out;
  will-change: transform, opacity;
}
@keyframes nr-float {
  0%   { transform: translateY(0) translateX(0) scale(1); opacity: var(--po); }
  25%  { transform: translateY(-12vh) translateX(2vw) scale(1.5); opacity: calc(var(--po)*1.4); }
  50%  { transform: translateY(-22vh) translateX(-3vw) scale(.7); opacity: calc(var(--po)*.5); }
  75%  { transform: translateY(-8vh) translateX(4vw) scale(1.3); opacity: calc(var(--po)*1.1); }
  100% { transform: translateY(0) translateX(0) scale(1); opacity: var(--po); }
}

/* ── 舞台 ── */
.nr-stage { position: relative; width: 100%; height: 100vh; overflow: hidden; z-index: 2; will-change: opacity; }

/* ═══════════════════════ 图层 ═══════════════════════ */
.nr-layer {
  position: absolute; inset: 0; z-index: 3;
  will-change: clip-path;
}
.nr-layer__img {
  width: 100%; height: 100%; object-fit: cover; display: block;
}

/* ═══════════════════════ 发光线 ═══════════════════════ */
.nr-line {
  position: absolute; z-index: 10; pointer-events: none; will-change: transform, opacity;
}
/* 横线：水平方向满屏，高度极细 */
.nr-line--h {
  top: 50%; left: 0; width: 100%; height: 2px;
  transform: translateY(-50%);
  background: linear-gradient(90deg,
    transparent 0%, rgba(255,200,140,.2) 20%, rgba(255,220,180,.9) 50%, rgba(255,200,140,.2) 80%, transparent 100%);
  box-shadow: 0 0 12px rgba(255,180,120,.5), 0 0 30px rgba(255,150,100,.25);
}
/* 竖线：垂直方向满屏，宽度极细 */
.nr-line--v {
  top: 0; left: 50%; width: 2px; height: 100%;
  transform: translateX(-50%);
  background: linear-gradient(180deg,
    transparent 0%, rgba(255,200,140,.2) 20%, rgba(255,220,180,.9) 50%, rgba(255,200,140,.2) 80%, transparent 100%);
  box-shadow: 0 0 12px rgba(255,180,120,.5), 0 0 30px rgba(255,150,100,.25);
}

/* ═══════════════════════ 标题 ═══════════════════════ */
.nr-header {
  position: absolute; top: 4vh; left: 50%; transform: translateX(-50%);
  z-index: 20; text-align: center; width: min(88vw,520px); pointer-events: none;
  will-change: transform, opacity;
}
.nr-kicker {
  display: inline-block; font-size: .54rem; font-weight: 700; letter-spacing: .22em;
  color: rgba(200,165,140,.6); background: rgba(10,5,20,.45); backdrop-filter: blur(8px);
  border: 1px solid rgba(170,130,220,.16); border-radius: 999px; padding: .2rem .8rem; margin-bottom: .4rem;
  will-change: transform, opacity;
}
.nr-title { margin: 0; display: flex; justify-content: center; gap: .04em; }
.nr-title__w {
  font-size: clamp(2rem,5vw,3.8rem); font-weight: 900;
  will-change: transform, opacity;
  &--1 { background: linear-gradient(180deg,#ffa880,#f06848); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  &--2 { background: linear-gradient(180deg,#90b0f0,#5078d8); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  &--3 {
    background: linear-gradient(180deg,#ffe0a8,#d09038);
    -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
    filter: drop-shadow(0 2px 10px rgba(240,180,100,.5));
  }
}
.nr-divider {
  width: 60px; height: 1.5px; margin: .3rem auto .4rem; border-radius: 2px;
  background: linear-gradient(90deg,transparent,#f09060,#b080d8,#6098e0,transparent);
  transform-origin: center; will-change: transform, opacity;
}
.nr-sub {
  margin: 0; font-size: clamp(.52rem,.78vw,.66rem); color: rgba(185,155,135,.36);
  max-width: 380px; margin-inline: auto; will-change: transform, opacity;
}

/* ── 阶段指示器 ── */
.nr-stage-hint {
  position: absolute; bottom: 10vh; left: 50%; transform: translateX(-50%);
  z-index: 20; display: flex; gap: .6rem; pointer-events: none; will-change: opacity;
}
.nr-stage-hint__dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: rgba(255,255,255,.2);
  transition: background-color .3s ease;
}
.nr-stage-hint__dot--active { background: rgba(255,170,110,.9); }

/* ── 进度条 ── */
.nr-progress {
  position: absolute; left: 0; bottom: 0; z-index: 25; width: 100%; height: 2px;
  background: rgba(255,170,110,.03);
}
.nr-progress__fill {
  width: 0; height: 100%;
  background: linear-gradient(90deg,#f06848,#f0a060,#b080d8,#5078d8,#b080d8,#f0a060);
  background-size: 300% 100%;
  box-shadow: 0 0 10px rgba(240,130,80,.4);
  animation: nr-prog-shift 4s linear infinite;
}
@keyframes nr-prog-shift {
  0% { background-position: 0% 50%; }
  100% { background-position: 300% 50%; }
}

/* ═══════════════════════ 响应式 ═══════════════════════ */
@media (max-width: 768px) {
  .nr-header { top: 2.5vh; }
  .nr-kicker { font-size: .44rem; }
  .nr-title__w { font-size: 1.5rem; }
  .nr-sub { font-size: .48rem; }
}
</style>
