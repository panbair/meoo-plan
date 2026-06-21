<template>
  <section ref="rootRef" class="le-root">
    <!-- 背景粒子 -->
    <div ref="particlesRef" class="le-particles">
      <span v-for="p in particlesList" :key="p.id" class="le-particle" :style="p.style"></span>
    </div>

    <!-- 舞台 -->
    <div ref="stageRef" class="le-stage">
      <!-- ══════ 第一层 ══════ -->
      <div ref="box1Ref" class="le-box">
        <div ref="box1GlowRef" class="le-box__glow"></div>
        <img ref="img1Ref" :src="images.img1" alt="图1" class="le-box__img" />
      </div>

      <!-- ══════ 第二层 ══════ -->
      <div ref="box2Ref" class="le-box">
        <div ref="box2GlowRef" class="le-box__glow"></div>
        <img ref="img2Ref" :src="images.img2" alt="图2" class="le-box__img" />
      </div>

      <!-- ══════ 第三层 ══════ -->
      <div ref="box3Ref" class="le-box">
        <div ref="box3GlowRef" class="le-box__glow"></div>
        <img ref="img3Ref" :src="images.img3" alt="图3" class="le-box__img" />
      </div>

      <!-- ══════ 第四层 ══════ -->
      <div ref="box4Ref" class="le-box">
        <div ref="box4GlowRef" class="le-box__glow"></div>
        <img ref="img4Ref" :src="images.img4" alt="图4" class="le-box__img" />
      </div>

      <!-- ══════ 第五层 ══════ -->
      <div ref="box5Ref" class="le-box">
        <div ref="box5GlowRef" class="le-box__glow"></div>
        <img ref="img5Ref" :src="images.img5" alt="图5" class="le-box__img" />
      </div>

      <!-- ══════ 标题 ══════ -->
      <header ref="headerRef" class="le-header">
        <span ref="kickerRef" class="le-kicker">◇ 向下滚动 · 一线开天 ◇</span>
        <h1 class="le-title">
          <span ref="t1Ref" class="le-title__w le-title__w--1">一</span>
          <span ref="t2Ref" class="le-title__w le-title__w--2">线</span>
          <span ref="t3Ref" class="le-title__w le-title__w--3">天</span>
          <span ref="t4Ref" class="le-title__w le-title__w--1">地</span>
        </h1>
        <div ref="dividerRef" class="le-divider"></div>
        <p ref="subRef" class="le-sub">一线裂空 · 方寸之间 · 见天地万象</p>
      </header>

      <!-- 阶段点 -->
      <div ref="dotsRef" class="le-dots">
        <span ref="dot1Ref" class="le-dots__dot le-dots__dot--on"></span>
        <span ref="dot2Ref" class="le-dots__dot"></span>
        <span ref="dot3Ref" class="le-dots__dot"></span>
        <span ref="dot4Ref" class="le-dots__dot"></span>
        <span ref="dot5Ref" class="le-dots__dot"></span>
      </div>

      <!-- 进度条 -->
      <div class="le-progress">
        <div ref="progressFillRef" class="le-progress__fill"></div>
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
//  CardScrollLineExpand — 一线开天
//  10×50 细线 → 纵向伸展至屏幕等高 → 横向延伸至屏幕等宽
//  → 100×100 图片出现 → 图片随矩形展开 → 层层递进
// ══════════════════════════════════════════════════════════════

type TweenCleanup = () => void

const images = {
  img1: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
  img2: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=1920&q=80',
  img3: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80',
  img4: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80',
  img5: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=1920&q=80',
}

// ── 粒子 ──
interface Particle { id: number; style: Record<string, string> }
function genP(n: number): Particle[] {
  const pr = (s: number) => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x) }
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    style: {
      '--px': `${pr(i * 3 + 1) * 100}%`, '--py': `${pr(i * 3 + 2) * 100}%`,
      '--ps': `${2 + pr(i * 3 + 3) * 3}px`, '--pd': `${8 + pr(i * 5 + 7) * 14}s`,
      '--pdl': `${pr(i * 7 + 13) * -15}s`, '--po': `${0.1 + pr(i * 2 + 5) * 0.3}`,
    },
  }))
}
const particlesList = ref<Particle[]>(genP(30))

// ── Refs ──
const rootRef = ref<HTMLElement | null>(null)
const stageRef = ref<HTMLElement | null>(null)
const box1Ref = ref<HTMLElement | null>(null)
const box2Ref = ref<HTMLElement | null>(null)
const box3Ref = ref<HTMLElement | null>(null)
const box4Ref = ref<HTMLElement | null>(null)
const box5Ref = ref<HTMLElement | null>(null)
const box1GlowRef = ref<HTMLElement | null>(null)
const box2GlowRef = ref<HTMLElement | null>(null)
const box3GlowRef = ref<HTMLElement | null>(null)
const box4GlowRef = ref<HTMLElement | null>(null)
const box5GlowRef = ref<HTMLElement | null>(null)
const img1Ref = ref<HTMLElement | null>(null)
const img2Ref = ref<HTMLElement | null>(null)
const img3Ref = ref<HTMLElement | null>(null)
const img4Ref = ref<HTMLElement | null>(null)
const img5Ref = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const kickerRef = ref<HTMLElement | null>(null)
const t1Ref = ref<HTMLElement | null>(null)
const t2Ref = ref<HTMLElement | null>(null)
const t3Ref = ref<HTMLElement | null>(null)
const t4Ref = ref<HTMLElement | null>(null)
const dividerRef = ref<HTMLElement | null>(null)
const subRef = ref<HTMLElement | null>(null)
const dotsRef = ref<HTMLElement | null>(null)
const dot1Ref = ref<HTMLElement | null>(null)
const dot2Ref = ref<HTMLElement | null>(null)
const dot3Ref = ref<HTMLElement | null>(null)
const dot4Ref = ref<HTMLElement | null>(null)
const dot5Ref = ref<HTMLElement | null>(null)
const progressFillRef = ref<HTMLElement | null>(null)
const particlesRef = ref<HTMLElement | null>(null)

const cleanupFns: TweenCleanup[] = []

function expandBox(
  tl: gsap.core.Timeline,
  box: HTMLElement,
  glow: HTMLElement,
  img: HTMLElement,
  startT: number,
) {
  // 盒子初始：10×50 细线，居中
  gsap.set(box, { width: 10, height: 50, autoAlpha: 0 })
  gsap.set(glow, { autoAlpha: 0 })
  // 图片初始：100×100，居中
  gsap.set(img, { width: 100, height: 100, autoAlpha: 0 })

  // ① 盒子出现（细线可见）
  tl.to(box, { autoAlpha: 1, duration: 0.03, ease: 'power2.out' }, startT)
  tl.to(glow, { autoAlpha: 1, duration: 0.03, ease: 'power2.out' }, startT)

  // ② 纵向伸展：高度 50 → 100vh（上下两端延伸）
  const t1 = startT + 0.03
  tl.to(box, { height: '100vh', duration: 0.10, ease: 'power2.inOut' }, t1)
  tl.to(glow, { height: '100vh', duration: 0.10, ease: 'power2.inOut' }, t1)
  // 图片在盒子达到 100px 高后出现（约纵向伸展中段）
  tl.to(img, { autoAlpha: 1, duration: 0.04, ease: 'power2.out' }, t1 + 0.04)
  // 图片高度跟随盒子增长
  tl.to(img, { height: '100vh', duration: 0.08, ease: 'power2.inOut' }, t1 + 0.04)

  // ③ 横向延申：宽度 10 → 100vw（左右两边延申）
  const t2 = t1 + 0.10
  tl.to(box, { width: '100vw', duration: 0.10, ease: 'power2.inOut' }, t2)
  tl.to(glow, { width: '100vw', duration: 0.10, ease: 'power2.inOut' }, t2)
  // 图片宽度跟随盒子增长
  tl.to(img, { width: '100vw', duration: 0.10, ease: 'power2.inOut' }, t2)

  // ④ 图片填满后，盒子光晕消隐
  tl.to(glow, { autoAlpha: 0, duration: 0.05, ease: 'power2.in' }, t2 + 0.10)
}

// ═══════════════════════ 主时间线 ═══════════════════════
function setupTimeline() {
  const parent = rootRef.value
  const stage = stageRef.value
  if (!parent || !stage || !box1Ref.value) return

  // —— 初始状态 ——
  gsap.set(stage, { opacity: 0 })
  gsap.set(headerRef.value, { autoAlpha: 0, y: 28 })
  gsap.set(kickerRef.value, { autoAlpha: 0, scale: 0.7 })
  gsap.set([t1Ref.value, t2Ref.value, t3Ref.value, t4Ref.value].filter(Boolean),
    { autoAlpha: 0, y: 16, scale: 0.5 })
  gsap.set(dividerRef.value, { scaleX: 0, autoAlpha: 0 })
  gsap.set(subRef.value, { autoAlpha: 0, y: 8 })
  gsap.set(dotsRef.value, { autoAlpha: 0 })
  gsap.set(particlesRef.value, { opacity: 0.3 })

  // —— 时间线 ——
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: parent,
      start: 'top 100%',
      end: 'bottom 20%',
      scrub: 1.5,
      toggleActions: 'play reverse play reverse',
    },
  })

  // ── 0.00–0.06: 舞台 + 标题入场 ──
  tl.to(stage, { opacity: 1, duration: 0.04, ease: 'power2.out' }, 0.01)
  tl.to(headerRef.value, { autoAlpha: 1, y: 0, duration: 0.05, ease: 'power2.out' }, 0.02)
  tl.to(kickerRef.value, { autoAlpha: 1, scale: 1, duration: 0.04, ease: 'power2.out' }, 0.03)
  tl.to([t1Ref.value, t2Ref.value, t3Ref.value, t4Ref.value].filter(Boolean),
    { autoAlpha: 1, y: 0, scale: 1, duration: 0.05, stagger: 0.025, ease: 'back.out(1.8)' }, 0.03)
  tl.to(dividerRef.value, { scaleX: 1, autoAlpha: 1, duration: 0.04, ease: 'power3.inOut' }, 0.05)
  tl.to(subRef.value, { autoAlpha: 1, y: 0, duration: 0.04, ease: 'power2.out' }, 0.06)
  tl.to(dotsRef.value, { autoAlpha: 1, duration: 0.04, ease: 'power2.out' }, 0.06)
  tl.to(particlesRef.value, { opacity: 0.65, duration: 0.06, ease: 'power2.in' }, 0.01)

  // ══════ 第一层：0.08 ══════
  expandBox(tl, box1Ref.value!, box1GlowRef.value!, img1Ref.value!, 0.08)
  tl.to(dot2Ref.value, { backgroundColor: 'rgba(255,180,110,0.9)', duration: 0.04 }, 0.16)

  // ══════ 第二层：图1→200×200 (0.16) ══════
  expandBox(tl, box2Ref.value!, box2GlowRef.value!, img2Ref.value!, 0.16)
  tl.to(dot3Ref.value, { backgroundColor: 'rgba(255,180,110,0.9)', duration: 0.04 }, 0.24)

  // ══════ 第三层：图2→200×200 (0.24) ══════
  expandBox(tl, box3Ref.value!, box3GlowRef.value!, img3Ref.value!, 0.24)
  tl.to(dot4Ref.value, { backgroundColor: 'rgba(255,180,110,0.9)', duration: 0.04 }, 0.32)

  // ══════ 第四层：图3→200×200 (0.32) ══════
  expandBox(tl, box4Ref.value!, box4GlowRef.value!, img4Ref.value!, 0.32)
  tl.to(dot5Ref.value, { backgroundColor: 'rgba(255,180,110,0.9)', duration: 0.04 }, 0.40)

  // ══════ 第五层：图4→200×200 (0.40) ══════
  expandBox(tl, box5Ref.value!, box5GlowRef.value!, img5Ref.value!, 0.40)

  // 指示灯依次熄灭
  tl.to(dot1Ref.value, { backgroundColor: 'rgba(255,255,255,0.12)', duration: 0.04 }, 0.20)
  tl.to(dot2Ref.value, { backgroundColor: 'rgba(255,255,255,0.12)', duration: 0.04 }, 0.28)
  tl.to(dot3Ref.value, { backgroundColor: 'rgba(255,255,255,0.12)', duration: 0.04 }, 0.36)
  tl.to(dot4Ref.value, { backgroundColor: 'rgba(255,255,255,0.12)', duration: 0.04 }, 0.44)
  tl.to(dot5Ref.value, { backgroundColor: 'rgba(255,255,255,0.12)', duration: 0.04 }, 0.50)

  // ── 0.52–1.00: 五层同步展开至全屏 + 收尾 ──
  tl.to(headerRef.value, { autoAlpha: 0.15, y: -6, duration: 0.06, ease: 'power2.in' }, 0.54)
  tl.to(dotsRef.value, { autoAlpha: 0, duration: 0.05, ease: 'power2.in' }, 0.54)
  tl.to(particlesRef.value, { opacity: 0.15, duration: 0.08, ease: 'power2.in' }, 0.56)
  tl.to(stage, { opacity: 0.4, duration: 0.08, ease: 'power2.in' }, 0.58)

  // ── 进度条 ──
  tl.to(progressFillRef.value, { width: '100%', duration: 1, ease: 'none' }, 0)

  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
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
.le-root {
  position: relative; width: 100vw; height: 100vh; overflow: hidden;
  background: #060412;
  font-family: 'PingFang SC','Inter','Microsoft YaHei',system-ui,sans-serif;
}

/* ── 粒子 ── */
.le-particles { position: absolute; inset: 0; z-index: 1; pointer-events: none; will-change: opacity; }
.le-particle {
  --px: 50%; --py: 50%; --ps: 3px; --pd: 12s; --pdl: 0s; --po: 0.3;
  position: absolute; left: var(--px); top: var(--py);
  width: var(--ps); height: var(--ps); border-radius: 50%;
  background: radial-gradient(circle, rgba(255,200,150,.8) 0%, rgba(150,120,220,.4) 40%, transparent 70%);
  box-shadow: 0 0 calc(var(--ps)*3) rgba(170,140,230,.4), 0 0 calc(var(--ps)*6) rgba(255,170,110,.2);
  opacity: var(--po);
  animation: le-float var(--pd) var(--pdl) infinite ease-in-out;
  will-change: transform, opacity;
}
@keyframes le-float {
  0%   { transform: translateY(0) translateX(0) scale(1); opacity: var(--po); }
  25%  { transform: translateY(-10vh) translateX(2vw) scale(1.5); opacity: calc(var(--po)*1.4); }
  50%  { transform: translateY(-20vh) translateX(-3vw) scale(.7); opacity: calc(var(--po)*.5); }
  75%  { transform: translateY(-7vh) translateX(4vw) scale(1.3); opacity: calc(var(--po)*1.1); }
  100% { transform: translateY(0) translateX(0) scale(1); opacity: var(--po); }
}

/* ── 舞台 ── */
.le-stage { position: relative; width: 100%; height: 100vh; overflow: hidden; z-index: 2; will-change: opacity; }

/* ═══════════════════════ 扩展盒子 ═══════════════════════ */
.le-box {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  overflow: hidden;
  will-change: width, height, opacity;
}
.le-box:nth-child(1) { z-index: 3; }
.le-box:nth-child(2) { z-index: 4; }
.le-box:nth-child(3) { z-index: 5; }
.le-box:nth-child(4) { z-index: 6; }
.le-box:nth-child(5) { z-index: 7; }

/* ── 盒子光晕边框 ── */
.le-box__glow {
  position: absolute; inset: 0; z-index: 2; pointer-events: none;
  border: 1px solid rgba(255,200,140,.6);
  box-shadow: inset 0 0 20px rgba(255,170,110,.15), 0 0 18px rgba(255,160,100,.3), 0 0 40px rgba(255,140,80,.12);
  will-change: width, height, opacity;
}

/* ── 盒内图片 ── */
.le-box__img {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  object-fit: cover; display: block;
  will-change: width, height, opacity;
}

/* ═══════════════════════ 标题 ═══════════════════════ */
.le-header {
  position: absolute; top: 4vh; left: 50%; transform: translateX(-50%);
  z-index: 20; text-align: center; width: min(88vw,520px); pointer-events: none;
  will-change: transform, opacity;
}
.le-kicker {
  display: inline-block; font-size: .54rem; font-weight: 700; letter-spacing: .22em;
  color: rgba(200,165,140,.6); background: rgba(10,5,20,.45); backdrop-filter: blur(8px);
  border: 1px solid rgba(170,130,220,.16); border-radius: 999px; padding: .2rem .8rem; margin-bottom: .4rem;
  will-change: transform, opacity;
}
.le-title { margin: 0; display: flex; justify-content: center; gap: .04em; }
.le-title__w {
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
.le-divider {
  width: 60px; height: 1.5px; margin: .3rem auto .4rem; border-radius: 2px;
  background: linear-gradient(90deg,transparent,#f09060,#b080d8,#6098e0,transparent);
  transform-origin: center; will-change: transform, opacity;
}
.le-sub {
  margin: 0; font-size: clamp(.52rem,.78vw,.66rem); color: rgba(185,155,135,.36);
  max-width: 380px; margin-inline: auto; will-change: transform, opacity;
}

/* ── 阶段指示器 ── */
.le-dots {
  position: absolute; bottom: 10vh; left: 50%; transform: translateX(-50%);
  z-index: 20; display: flex; gap: .6rem; pointer-events: none; will-change: opacity;
}
.le-dots__dot {
  width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,.18);
  transition: background-color .3s;
}
.le-dots__dot--on { background: rgba(255,170,110,.9); }

/* ── 进度条 ── */
.le-progress {
  position: absolute; left: 0; bottom: 0; z-index: 25; width: 100%; height: 2px;
  background: rgba(255,170,110,.025);
}
.le-progress__fill {
  width: 0; height: 100%;
  background: linear-gradient(90deg,#f06848,#f0a060,#b080d8,#5078d8,#b080d8,#f0a060);
  background-size: 300% 100%;
  box-shadow: 0 0 10px rgba(240,130,80,.4);
  animation: le-prog-shift 4s linear infinite;
}
@keyframes le-prog-shift {
  0% { background-position: 0% 50%; }
  100% { background-position: 300% 50%; }
}

/* ═══════════════════════ 响应式 ═══════════════════════ */
@media (max-width: 768px) {
  .le-header { top: 2.5vh; }
  .le-kicker { font-size: .44rem; }
  .le-title__w { font-size: 1.5rem; }
  .le-sub { font-size: .48rem; }
}
</style>
