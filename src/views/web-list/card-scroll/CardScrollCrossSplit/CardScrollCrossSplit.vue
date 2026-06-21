<template>
  <section ref="rootRef" class="cs-root">
    <!-- 背景粒子 -->
    <div ref="particlesRef" class="cs-particles">
      <span v-for="p in particlesList" :key="p.id" class="cs-particle" :style="p.style"></span>
    </div>

    <!-- 舞台 -->
    <div ref="stageRef" class="cs-stage">
      <!-- ══════ 第1层（最底）══════ -->
      <div class="cs-layer" style="z-index:3">
        <img :src="images.img1" alt="图1" class="cs-layer__full" />
      </div>

      <!-- ══════ 第2层 ══════ -->
      <div ref="layer2Ref" class="cs-layer" style="z-index:4">
        <div ref="l2TL" class="cs-quad cs-quad--tl"><img :src="images.img2" class="cs-quad__img cs-quad__img--tl" /></div>
        <div ref="l2TR" class="cs-quad cs-quad--tr"><img :src="images.img2" class="cs-quad__img cs-quad__img--tr" /></div>
        <div ref="l2BL" class="cs-quad cs-quad--bl"><img :src="images.img2" class="cs-quad__img cs-quad__img--bl" /></div>
        <div ref="l2BR" class="cs-quad cs-quad--br"><img :src="images.img2" class="cs-quad__img cs-quad__img--br" /></div>
        <div ref="l2CrossH" class="cs-cross cs-cross--h"></div>
        <div ref="l2CrossV" class="cs-cross cs-cross--v"></div>
      </div>

      <!-- ══════ 第3层 ══════ -->
      <div ref="layer3Ref" class="cs-layer" style="z-index:5">
        <div ref="l3TL" class="cs-quad cs-quad--tl"><img :src="images.img3" class="cs-quad__img cs-quad__img--tl" /></div>
        <div ref="l3TR" class="cs-quad cs-quad--tr"><img :src="images.img3" class="cs-quad__img cs-quad__img--tr" /></div>
        <div ref="l3BL" class="cs-quad cs-quad--bl"><img :src="images.img3" class="cs-quad__img cs-quad__img--bl" /></div>
        <div ref="l3BR" class="cs-quad cs-quad--br"><img :src="images.img3" class="cs-quad__img cs-quad__img--br" /></div>
        <div ref="l3CrossH" class="cs-cross cs-cross--h"></div>
        <div ref="l3CrossV" class="cs-cross cs-cross--v"></div>
      </div>

      <!-- ══════ 第4层（最顶）══════ -->
      <div ref="layer4Ref" class="cs-layer" style="z-index:6">
        <div ref="l4TL" class="cs-quad cs-quad--tl"><img :src="images.img4" class="cs-quad__img cs-quad__img--tl" /></div>
        <div ref="l4TR" class="cs-quad cs-quad--tr"><img :src="images.img4" class="cs-quad__img cs-quad__img--tr" /></div>
        <div ref="l4BL" class="cs-quad cs-quad--bl"><img :src="images.img4" class="cs-quad__img cs-quad__img--bl" /></div>
        <div ref="l4BR" class="cs-quad cs-quad--br"><img :src="images.img4" class="cs-quad__img cs-quad__img--br" /></div>
        <div ref="l4CrossH" class="cs-cross cs-cross--h"></div>
        <div ref="l4CrossV" class="cs-cross cs-cross--v"></div>
      </div>

      <!-- ══════ 标题 ══════ -->
      <header ref="headerRef" class="cs-header">
        <span ref="kickerRef" class="cs-kicker">✚ 向下滚动 · 十字分裂 ✚</span>
        <h1 class="cs-title">
          <span ref="t1Ref" class="cs-title__w cs-title__w--1">四</span>
          <span ref="t2Ref" class="cs-title__w cs-title__w--2">分</span>
          <span ref="t3Ref" class="cs-title__w cs-title__w--3">五</span>
          <span ref="t4Ref" class="cs-title__w cs-title__w--1">裂</span>
        </h1>
        <div ref="dividerRef" class="cs-divider"></div>
        <p ref="subRef" class="cs-sub">十字裂空 · 四象分离 · 层层揭晓新视界</p>
      </header>

      <!-- 阶段点 -->
      <div ref="dotsRef" class="cs-dots">
        <span ref="dot1Ref" class="cs-dots__dot cs-dots__dot--on"></span>
        <span ref="dot2Ref" class="cs-dots__dot"></span>
        <span ref="dot3Ref" class="cs-dots__dot"></span>
        <span ref="dot4Ref" class="cs-dots__dot"></span>
      </div>

      <!-- 进度条 -->
      <div class="cs-progress"><div ref="progressFillRef" class="cs-progress__fill"></div></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ══════════════════════════════════════════════════════════════
//  CardScrollCrossSplit — 十字分裂
//  十字光痕出现 → 四象限向外飞散 → 揭示下一层图片
//  融合 Merge + SideFlow + NestedReveal + LineExpand 精华
// ══════════════════════════════════════════════════════════════

type TweenCleanup = () => void

const images = {
  img1: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
  img2: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=1920&q=80',
  img3: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80',
  img4: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=1920&q=80',
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
      '--pdl': `${pr(i * 7 + 13) * -15}s`, '--po': `${0.08 + pr(i * 2 + 5) * 0.28}`,
    },
  }))
}
const particlesList = ref<Particle[]>(genP(35))

// ── Refs（层2/3/4 各有 4 quad + 2 cross）──
const rootRef = ref<HTMLElement | null>(null)
const stageRef = ref<HTMLElement | null>(null)
const layer2Ref = ref<HTMLElement | null>(null)
const layer3Ref = ref<HTMLElement | null>(null)
const layer4Ref = ref<HTMLElement | null>(null)
const l2TL = ref<HTMLElement | null>(null); const l2TR = ref<HTMLElement | null>(null)
const l2BL = ref<HTMLElement | null>(null); const l2BR = ref<HTMLElement | null>(null)
const l2CrossH = ref<HTMLElement | null>(null); const l2CrossV = ref<HTMLElement | null>(null)
const l3TL = ref<HTMLElement | null>(null); const l3TR = ref<HTMLElement | null>(null)
const l3BL = ref<HTMLElement | null>(null); const l3BR = ref<HTMLElement | null>(null)
const l3CrossH = ref<HTMLElement | null>(null); const l3CrossV = ref<HTMLElement | null>(null)
const l4TL = ref<HTMLElement | null>(null); const l4TR = ref<HTMLElement | null>(null)
const l4BL = ref<HTMLElement | null>(null); const l4BR = ref<HTMLElement | null>(null)
const l4CrossH = ref<HTMLElement | null>(null); const l4CrossV = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const kickerRef = ref<HTMLElement | null>(null)
const t1Ref = ref<HTMLElement | null>(null); const t2Ref = ref<HTMLElement | null>(null)
const t3Ref = ref<HTMLElement | null>(null); const t4Ref = ref<HTMLElement | null>(null)
const dividerRef = ref<HTMLElement | null>(null); const subRef = ref<HTMLElement | null>(null)
const dotsRef = ref<HTMLElement | null>(null)
const dot1Ref = ref<HTMLElement | null>(null); const dot2Ref = ref<HTMLElement | null>(null)
const dot3Ref = ref<HTMLElement | null>(null); const dot4Ref = ref<HTMLElement | null>(null)
const progressFillRef = ref<HTMLElement | null>(null)
const particlesRef = ref<HTMLElement | null>(null)

const cleanupFns: TweenCleanup[] = []

// ── 分裂函数：十字出现 → 四象限飞散 ──
function splitLayer(
  tl: gsap.core.Timeline,
  quads: HTMLElement[],  // [TL, TR, BL, BR]
  crossH: HTMLElement,
  crossV: HTMLElement,
  startT: number,
) {
  const [tl_q, tr_q, bl_q, br_q] = quads

  // 初始：四象限在正常位置，十字隐藏
  gsap.set([tl_q, tr_q, bl_q, br_q], { x: 0, y: 0, autoAlpha: 1 })
  gsap.set(crossH, { scaleX: 0, autoAlpha: 0, transformOrigin: 'center center' })
  gsap.set(crossV, { scaleY: 0, autoAlpha: 0, transformOrigin: 'center center' })

  // ① 十字浮现
  tl.to(crossH, { scaleX: 1, autoAlpha: 1, duration: 0.06, ease: 'power3.out' }, startT)
  tl.to(crossV, { scaleY: 1, autoAlpha: 1, duration: 0.06, ease: 'power3.out' }, startT + 0.02)

  // ② 十字光痕增亮
  tl.to(crossH, { autoAlpha: 1, duration: 0.04, ease: 'power2.in' }, startT + 0.06)
  tl.to(crossV, { autoAlpha: 1, duration: 0.04, ease: 'power2.in' }, startT + 0.08)

  // ③ 四象限飞散
  const t3 = startT + 0.10
  tl.to(tl_q, { x: '-52vw', y: '-52vh', duration: 0.16, ease: 'power3.in' }, t3)
  tl.to(tr_q, { x: '52vw', y: '-52vh', duration: 0.16, ease: 'power3.in' }, t3)
  tl.to(bl_q, { x: '-52vw', y: '52vh', duration: 0.16, ease: 'power3.in' }, t3)
  tl.to(br_q, { x: '52vw', y: '52vh', duration: 0.16, ease: 'power3.in' }, t3)

  // ④ 飞散同时淡出
  tl.to([tl_q, tr_q, bl_q, br_q], { autoAlpha: 0, duration: 0.10, ease: 'power2.in' }, t3 + 0.08)

  // ⑤ 十字消隐
  tl.to([crossH, crossV], { autoAlpha: 0, duration: 0.06, ease: 'power2.in' }, t3 + 0.12)
}

// ═══════════════════════ 主时间线 ═══════════════════════
function setupTimeline() {
  const parent = rootRef.value
  const stage = stageRef.value
  if (!parent || !stage || !layer2Ref.value) return

  gsap.set(stage, { opacity: 0 })
  gsap.set(headerRef.value, { autoAlpha: 0, y: 28 })
  gsap.set(kickerRef.value, { autoAlpha: 0, scale: 0.7 })
  gsap.set([t1Ref.value, t2Ref.value, t3Ref.value, t4Ref.value].filter(Boolean),
    { autoAlpha: 0, y: 16, scale: 0.5 })
  gsap.set(dividerRef.value, { scaleX: 0, autoAlpha: 0 })
  gsap.set(subRef.value, { autoAlpha: 0, y: 8 })
  gsap.set(dotsRef.value, { autoAlpha: 0 })
  gsap.set(particlesRef.value, { opacity: 0.25 })

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: parent,
      start: 'top 100%',
      end: 'bottom 40%',
      scrub: 1.5,
      toggleActions: 'play reverse play reverse',
    },
  })

  // ── 0.00–0.07: 入场 ──
  tl.to(stage, { opacity: 1, duration: 0.04, ease: 'power2.out' }, 0.01)
  tl.to(headerRef.value, { autoAlpha: 1, y: 0, duration: 0.05, ease: 'power2.out' }, 0.02)
  tl.to(kickerRef.value, { autoAlpha: 1, scale: 1, duration: 0.04, ease: 'power2.out' }, 0.03)
  tl.to([t1Ref.value, t2Ref.value, t3Ref.value, t4Ref.value].filter(Boolean),
    { autoAlpha: 1, y: 0, scale: 1, duration: 0.05, stagger: 0.03, ease: 'back.out(1.8)' }, 0.03)
  tl.to(dividerRef.value, { scaleX: 1, autoAlpha: 1, duration: 0.04, ease: 'power3.inOut' }, 0.06)
  tl.to(subRef.value, { autoAlpha: 1, y: 0, duration: 0.04, ease: 'power2.out' }, 0.07)
  tl.to(dotsRef.value, { autoAlpha: 1, duration: 0.04, ease: 'power2.out' }, 0.07)
  tl.to(particlesRef.value, { opacity: 0.6, duration: 0.06, ease: 'power2.in' }, 0.02)

  // ══════ 第2层分裂 → 揭示第1层 ══════
  splitLayer(tl, [l2TL.value!, l2TR.value!, l2BL.value!, l2BR.value!], l2CrossH.value!, l2CrossV.value!, 0.10)
  tl.to(dot1Ref.value, { backgroundColor: 'rgba(255,255,255,0.15)', duration: 0.04 }, 0.22)
  tl.to(dot2Ref.value, { backgroundColor: 'rgba(255,180,110,0.9)', duration: 0.04 }, 0.28)

  // ══════ 第3层分裂 → 揭示第2层 ══════
  splitLayer(tl, [l3TL.value!, l3TR.value!, l3BL.value!, l3BR.value!], l3CrossH.value!, l3CrossV.value!, 0.30)
  tl.to(dot2Ref.value, { backgroundColor: 'rgba(255,255,255,0.15)', duration: 0.04 }, 0.42)
  tl.to(dot3Ref.value, { backgroundColor: 'rgba(255,180,110,0.9)', duration: 0.04 }, 0.48)

  // ══════ 第4层分裂 → 揭示第3层 ══════
  splitLayer(tl, [l4TL.value!, l4TR.value!, l4BL.value!, l4BR.value!], l4CrossH.value!, l4CrossV.value!, 0.50)
  tl.to(dot3Ref.value, { backgroundColor: 'rgba(255,255,255,0.15)', duration: 0.04 }, 0.62)
  tl.to(dot4Ref.value, { backgroundColor: 'rgba(255,180,110,0.9)', duration: 0.04 }, 0.68)

  // ── 0.70–1.00: 收尾 ──
  tl.to(dot4Ref.value, { backgroundColor: 'rgba(255,255,255,0.12)', duration: 0.04 }, 0.74)
  tl.to(headerRef.value, { autoAlpha: 0.15, y: -6, duration: 0.06, ease: 'power2.in' }, 0.76)
  tl.to(dotsRef.value, { autoAlpha: 0, duration: 0.05, ease: 'power2.in' }, 0.76)
  tl.to(particlesRef.value, { opacity: 0.12, duration: 0.08, ease: 'power2.in' }, 0.80)
  tl.to(stage, { opacity: 0.4, duration: 0.08, ease: 'power2.in' }, 0.82)

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
.cs-root {
  position: relative; width: 100vw; height: 100vh; overflow: hidden;
  background: #060410;
  font-family: 'PingFang SC','Inter','Microsoft YaHei',system-ui,sans-serif;
}

/* ── 粒子 ── */
.cs-particles { position: absolute; inset: 0; z-index: 1; pointer-events: none; will-change: opacity; }
.cs-particle {
  --px: 50%; --py: 50%; --ps: 3px; --pd: 12s; --pdl: 0s; --po: 0.3;
  position: absolute; left: var(--px); top: var(--py);
  width: var(--ps); height: var(--ps); border-radius: 50%;
  background: radial-gradient(circle, rgba(255,200,150,.85) 0%, rgba(150,120,220,.4) 40%, transparent 70%);
  box-shadow: 0 0 calc(var(--ps)*3) rgba(170,140,230,.4), 0 0 calc(var(--ps)*6) rgba(255,170,110,.2);
  opacity: var(--po);
  animation: cs-float var(--pd) var(--pdl) infinite ease-in-out;
  will-change: transform, opacity;
}
@keyframes cs-float {
  0%{transform:translateY(0)translateX(0)scale(1);opacity:var(--po)}
  25%{transform:translateY(-10vh)translateX(2vw)scale(1.5);opacity:calc(var(--po)*1.4)}
  50%{transform:translateY(-20vh)translateX(-3vw)scale(.7);opacity:calc(var(--po)*.5)}
  75%{transform:translateY(-7vh)translateX(4vw)scale(1.3);opacity:calc(var(--po)*1.1)}
  100%{transform:translateY(0)translateX(0)scale(1);opacity:var(--po)}
}

.cs-stage { position: relative; width: 100%; height: 100vh; overflow: hidden; z-index: 2; will-change: opacity; }

/* ═══════════════════════ 图层 ═══════════════════════ */
.cs-layer { position: absolute; inset: 0; }
.cs-layer__full { width: 100%; height: 100%; object-fit: cover; display: block; }

/* ═══════════════════════ 四象限 ═══════════════════════ */
.cs-quad {
  position: absolute; width: 50%; height: 50%; overflow: hidden;
  will-change: transform, opacity;
}
.cs-quad--tl { top: 0; left: 0; }
.cs-quad--tr { top: 0; right: 0; }
.cs-quad--bl { bottom: 0; left: 0; }
.cs-quad--br { bottom: 0; right: 0; }

.cs-quad__img { position: absolute; width: 200%; height: 200%; object-fit: cover; display: block; }
.cs-quad__img--tl { top: 0; left: 0; }
.cs-quad__img--tr { top: 0; right: 0; }
.cs-quad__img--bl { bottom: 0; left: 0; }
.cs-quad__img--br { bottom: 0; right: 0; }

/* ═══════════════════════ 十字光痕 ═══════════════════════ */
.cs-cross {
  position: absolute; pointer-events: none; z-index: 3;
  will-change: transform, opacity;
}
.cs-cross--h {
  top: 50%; left: 0; width: 100%; height: 2px; transform: translateY(-50%);
  background: linear-gradient(90deg, transparent 5%, rgba(255,200,140,.3) 30%, rgba(255,230,190,.9) 50%, rgba(255,200,140,.3) 70%, transparent 95%);
  box-shadow: 0 0 16px rgba(255,170,100,.5), 0 0 40px rgba(255,140,80,.2);
}
.cs-cross--v {
  top: 0; left: 50%; width: 2px; height: 100%; transform: translateX(-50%);
  background: linear-gradient(180deg, transparent 5%, rgba(255,200,140,.3) 30%, rgba(255,230,190,.9) 50%, rgba(255,200,140,.3) 70%, transparent 95%);
  box-shadow: 0 0 16px rgba(255,170,100,.5), 0 0 40px rgba(255,140,80,.2);
}

/* ═══════════════════════ 标题 ═══════════════════════ */
.cs-header {
  position: absolute; top: 4vh; left: 50%; transform: translateX(-50%);
  z-index: 20; text-align: center; width: min(88vw,520px); pointer-events: none;
  will-change: transform, opacity;
}
.cs-kicker {
  display: inline-block; font-size: .54rem; font-weight: 700; letter-spacing: .22em;
  color: rgba(200,165,140,.6); background: rgba(10,5,20,.45); backdrop-filter: blur(8px);
  border: 1px solid rgba(170,130,220,.16); border-radius: 999px; padding: .2rem .8rem; margin-bottom: .4rem;
  will-change: transform, opacity;
}
.cs-title { margin: 0; display: flex; justify-content: center; gap: .04em; }
.cs-title__w {
  font-size: clamp(2rem,5vw,3.8rem); font-weight: 900; will-change: transform, opacity;
  &--1 { background: linear-gradient(180deg,#ffa880,#f06848); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  &--2 { background: linear-gradient(180deg,#90b0f0,#5078d8); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  &--3 { background: linear-gradient(180deg,#ffe0a8,#d09038); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; filter: drop-shadow(0 2px 10px rgba(240,180,100,.5)); }
}
.cs-divider {
  width: 60px; height: 1.5px; margin: .3rem auto .4rem; border-radius: 2px;
  background: linear-gradient(90deg,transparent,#f09060,#b080d8,#6098e0,transparent);
  transform-origin: center; will-change: transform, opacity;
}
.cs-sub { margin: 0; font-size: clamp(.52rem,.78vw,.66rem); color: rgba(185,155,135,.36); max-width: 420px; margin-inline: auto; will-change: transform, opacity; }

.cs-dots { position: absolute; bottom: 10vh; left: 50%; transform: translateX(-50%); z-index: 20; display: flex; gap: .6rem; pointer-events: none; will-change: opacity; }
.cs-dots__dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,.15); transition: background-color .3s; }
.cs-dots__dot--on { background: rgba(255,170,110,.9); }

.cs-progress { position: absolute; left: 0; bottom: 0; z-index: 25; width: 100%; height: 2px; background: rgba(255,170,110,.02); }
.cs-progress__fill {
  width: 0; height: 100%;
  background: linear-gradient(90deg,#f06848,#f0a060,#b080d8,#5078d8,#b080d8,#f0a060);
  background-size: 300% 100%;
  box-shadow: 0 0 10px rgba(240,130,80,.4);
  animation: cs-prog-shift 4s linear infinite;
}
@keyframes cs-prog-shift { 0%{background-position:0% 50%} 100%{background-position:300% 50%} }

@media (max-width: 768px) {
  .cs-header { top: 2.5vh; }
  .cs-kicker { font-size: .44rem; }
  .cs-title__w { font-size: 1.5rem; }
  .cs-sub { font-size: .48rem; }
}
</style>
