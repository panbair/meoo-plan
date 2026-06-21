<template>
  <section ref="rootRef" class="sr-root">
    <!-- 粒子 -->
    <div ref="particlesRef" class="sr-particles">
      <span v-for="p in plist" :key="p.id" class="sr-particle" :style="p.style"></span>
    </div>

    <div ref="stageRef" class="sr-stage">
      <!-- ══════ 底层内容（分裂后露出）══════ -->
      <div ref="contentRef" class="sr-content">
        <div ref="contentInnerRef" class="sr-content__inner">
          <!-- 大标题 -->
          <h2 ref="bigTitleRef" class="sr-content__title">揭开序幕</h2>
          <p ref="descRef" class="sr-content__desc">
            每一次分裂 · 都是新的开始<br />向下滚动 · 探索更多精彩
          </p>
          <!-- 5排图片网格 -->
          <div ref="gridRef" class="sr-grid">
            <div v-for="(row, ri) in thumbGrid" :key="'r'+ri" class="sr-grid__row" style="gap:1.8vw;margin-bottom:2vh">
              <div v-for="(thumb, ti) in row" :key="'t'+ri+'-'+ti" class="sr-thumb" style="width:clamp(200px,36vw,480px)">
                <img :src="thumb.url" class="sr-thumb__img" style="border-radius:12px;box-shadow:0 0 0 4px rgba(255,200,150,.3),0 20px 60px rgba(0,0,0,.55)" />
                <span class="sr-thumb__label" style="font-size:.75rem;letter-spacing:.18em;color:rgba(230,190,160,.8)">{{ thumb.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ══════ 左半图 ══════ -->
      <div ref="leftHalfRef" class="sr-half sr-half--left">
        <img :src="imgs.main" class="sr-half__img sr-half__img--left" />
        <div class="sr-half__edge"></div>
      </div>

      <!-- ══════ 右半图 ══════ -->
      <div ref="rightHalfRef" class="sr-half sr-half--right">
        <img :src="imgs.main" class="sr-half__img sr-half__img--right" />
        <div class="sr-half__edge"></div>
      </div>

      <!-- 中心裂缝光 -->
      <div ref="crackRef" class="sr-crack"></div>

      <!-- ══════ 标题 ══════ -->
      <header ref="hRef" class="sr-header">
        <span ref="kRef" class="sr-kicker">◈ 向下滚动 · 分幕揭晓 ◈</span>
        <h1 class="sr-title">
          <span ref="t1Ref" class="sr-t__w sr-t__w--1">分</span>
          <span ref="t2Ref" class="sr-t__w sr-t__w--2">幕</span>
          <span ref="t3Ref" class="sr-t__w sr-t__w--3">揭</span>
          <span ref="t4Ref" class="sr-t__w sr-t__w--1">晓</span>
        </h1>
        <div ref="dRef" class="sr-divider"></div>
        <p ref="sRef" class="sr-sub">分裂帷幕 · 揭开新篇 · 见所未见</p>
      </header>

      <!-- 进度条 -->
      <div class="sr-progress"><div ref="pfRef" class="sr-progress__fill"></div></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
type TC = () => void

const imgs = {
  main: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
}

const thumbSources = [
  { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80', label: '山 峦' },
  { url: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=400&q=80', label: '晨 曦' },
  { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80', label: '海 洋' },
  { url: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=400&q=80', label: '湖 泊' },
  { url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80', label: '森 林' },
  { url: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&q=80', label: '花 卉' },
  { url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&q=80', label: '草 原' },
  { url: 'https://images.unsplash.com/photo-1505144808419-1957a94ca61e?w=400&q=80', label: '湖 光' },
  { url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&q=80', label: '山 色' },
  { url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&q=80', label: '海 浪' },
  { url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400&q=80', label: '秋 色' },
  { url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80', label: '田 野' },
  { url: 'https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?w=400&q=80', label: '自 然' },
  { url: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=400&q=80', label: '海 岸' },
  { url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&q=80', label: '山 水' },
  { url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&q=80', label: '瀑 布' },
  { url: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400&q=80', label: '飞 鸟' },
  { url: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400&q=80', label: '旷 野' },
  { url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=80', label: '远 山' },
  { url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400&q=80', label: '秘 境' },
]
const COLS = 4
const ROWS = 5
const thumbGrid = Array.from({ length: ROWS }, (_, ri) =>
  thumbSources.slice(ri * COLS, (ri + 1) * COLS)
)

interface P { id: number; style: Record<string, string> }
const pr = (s: number) => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x) }
const plist = ref<P[]>(Array.from({ length: 25 }, (_, i) => ({
  id: i,
  style: {
    '--px': `${pr(i * 3 + 1) * 100}%`, '--py': `${pr(i * 3 + 2) * 100}%`,
    '--ps': `${2 + pr(i * 3 + 3) * 3}px`, '--pd': `${8 + pr(i * 5 + 7) * 14}s`,
    '--pdl': `${pr(i * 7 + 13) * -15}s`, '--po': `${.08 + pr(i * 2 + 5) * .28}`,
  },
})))

const rootRef = ref<HTMLElement | null>(null)
const stageRef = ref<HTMLElement | null>(null)
const leftHalfRef = ref<HTMLElement | null>(null)
const rightHalfRef = ref<HTMLElement | null>(null)
const crackRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const contentInnerRef = ref<HTMLElement | null>(null)
const bigTitleRef = ref<HTMLElement | null>(null)
const descRef = ref<HTMLElement | null>(null)
const gridRef = ref<HTMLElement | null>(null)
const hRef = ref<HTMLElement | null>(null)
const kRef = ref<HTMLElement | null>(null)
const t1Ref = ref<HTMLElement | null>(null)
const t2Ref = ref<HTMLElement | null>(null)
const t3Ref = ref<HTMLElement | null>(null)
const t4Ref = ref<HTMLElement | null>(null)
const dRef = ref<HTMLElement | null>(null)
const sRef = ref<HTMLElement | null>(null)
const pfRef = ref<HTMLElement | null>(null)
const particlesRef = ref<HTMLElement | null>(null)
const cleanupFns: TC[] = []

function setup() {
  const p = rootRef.value
  const st = stageRef.value
  if (!p || !st || !leftHalfRef.value || !rightHalfRef.value) return

  // —— 初始状态 ——
  gsap.set(st, { opacity: 0 })

  // 两半图初始闭合
  gsap.set(leftHalfRef.value, { x: 0 })
  gsap.set(rightHalfRef.value, { x: 0 })

  // 裂缝光初始不可见
  gsap.set(crackRef.value, { autoAlpha: 0, scaleY: 0.1 })

  // 底层内容初始在下方
  gsap.set(contentRef.value, { autoAlpha: 0 })
  gsap.set(contentInnerRef.value, { y: '40vh' })
  gsap.set(bigTitleRef.value, { autoAlpha: 0, y: 30 })
  gsap.set(descRef.value, { autoAlpha: 0, y: 20 })
  gsap.set(gridRef.value, { autoAlpha: 0, y: 50 })

  // 标题
  gsap.set(hRef.value, { autoAlpha: 0, y: 28 })
  gsap.set(kRef.value, { autoAlpha: 0, scale: 0.7 })
  gsap.set([t1Ref.value, t2Ref.value, t3Ref.value, t4Ref.value].filter(Boolean),
    { autoAlpha: 0, y: 16, scale: 0.5 })
  gsap.set(dRef.value, { scaleX: 0, autoAlpha: 0 })
  gsap.set(sRef.value, { autoAlpha: 0, y: 8 })
  gsap.set(particlesRef.value, { opacity: 0.25 })

  // —— 时间线 ——
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: p,
      start: 'top 100%',
      end: 'bottom 30%',
      scrub: 1.5,
      toggleActions: 'play reverse play reverse',
    },
  })

  // ── 0.00–0.06: 入场 ──
  tl.to(st, { opacity: 1, duration: 0.04, ease: 'power2.out' }, 0.01)
  tl.to(hRef.value, { autoAlpha: 1, y: 0, duration: 0.05, ease: 'power2.out' }, 0.02)
  tl.to(kRef.value, { autoAlpha: 1, scale: 1, duration: 0.04, ease: 'power2.out' }, 0.03)
  tl.to([t1Ref.value, t2Ref.value, t3Ref.value, t4Ref.value].filter(Boolean),
    { autoAlpha: 1, y: 0, scale: 1, duration: 0.05, stagger: 0.03, ease: 'back.out(1.8)' }, 0.03)
  tl.to(dRef.value, { scaleX: 1, autoAlpha: 1, duration: 0.04, ease: 'power3.inOut' }, 0.05)
  tl.to(sRef.value, { autoAlpha: 1, y: 0, duration: 0.04, ease: 'power2.out' }, 0.06)
  tl.to(particlesRef.value, { opacity: 0.6, duration: 0.06, ease: 'power2.in' }, 0.02)

  // ── 0.08–0.25: 图片分裂 → 各移动300px → 裂缝光出现 ──
  tl.to(leftHalfRef.value, { x: -300, duration: 0.17, ease: 'power3.inOut' }, 0.08)
  tl.to(rightHalfRef.value, { x: 300, duration: 0.17, ease: 'power3.inOut' }, 0.08)
  // 裂缝光：分裂到100px左右时开始亮起
  tl.to(crackRef.value, { autoAlpha: 0.5, scaleY: 0.4, duration: 0.06, ease: 'power2.out' }, 0.10)
  tl.to(crackRef.value, { autoAlpha: 1, scaleY: 1, duration: 0.08, ease: 'power2.out' }, 0.14)

  // ── 0.15–0.70: 底层内容从下方浮现并持续上移 ──
  tl.to(contentRef.value, { autoAlpha: 1, duration: 0.04, ease: 'power2.out' }, 0.15)
  tl.to(contentInnerRef.value, { y: '-20vh', duration: 0.10, ease: 'power2.out' }, 0.15)
  tl.to(bigTitleRef.value, { autoAlpha: 1, y: 0, duration: 0.08, ease: 'power2.out' }, 0.18)
  tl.to(descRef.value, { autoAlpha: 1, y: 0, duration: 0.08, ease: 'power2.out' }, 0.20)
  tl.to(gridRef.value, { autoAlpha: 1, y: 0, duration: 0.12, ease: 'power2.out' }, 0.22)
  // 五排图片持续上移
  tl.to(contentInnerRef.value, { y: '-60vh', duration: 0.35, ease: 'none' }, 0.30)
  // 标题和描述同时上移淡出
  tl.to(bigTitleRef.value, { y: -30, autoAlpha: 0.3, duration: 0.25, ease: 'power2.in' }, 0.40)
  tl.to(descRef.value, { y: -20, autoAlpha: 0.2, duration: 0.25, ease: 'power2.in' }, 0.42)

  // ── 0.35–0.55: 继续扩大分裂 → 半图到边界隐藏 ──
  tl.to(leftHalfRef.value, { x: '-52vw', duration: 0.20, ease: 'power3.in' }, 0.35)
  tl.to(rightHalfRef.value, { x: '52vw', duration: 0.20, ease: 'power3.in' }, 0.35)
  // 裂缝光达到最亮后消隐
  tl.to(crackRef.value, { autoAlpha: 1.2, scaleY: 1, duration: 0.06, ease: 'power2.in' }, 0.38)
  tl.to(crackRef.value, { autoAlpha: 0, duration: 0.10, ease: 'power2.in' }, 0.44)

  // ── 0.55–0.70: 半图完全消失，内容继续上移至完全离开 ──
  tl.to([leftHalfRef.value, rightHalfRef.value], { autoAlpha: 0, duration: 0.08, ease: 'power2.in' }, 0.55)
  tl.to(contentInnerRef.value, { y: '-100vh', duration: 0.15, ease: 'power2.in' }, 0.55)

  // ── 0.70–1.00: 收尾 ──
  tl.to(hRef.value, { autoAlpha: 0.15, y: -6, duration: 0.06, ease: 'power2.in' }, 0.72)
  tl.to(bigTitleRef.value, { autoAlpha: 0.2, duration: 0.06, ease: 'power2.in' }, 0.74)
  tl.to(particlesRef.value, { opacity: 0.12, duration: 0.08 }, 0.76)
  tl.to(st, { opacity: 0.4, duration: 0.08 }, 0.78)

  tl.to(pfRef.value, { width: '100%', duration: 1, ease: 'none' }, 0)
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

function hr() { ScrollTrigger.refresh(true) }
onMounted(() => { requestAnimationFrame(() => setup()); window.addEventListener('resize', hr) })
onUnmounted(() => { window.removeEventListener('resize', hr); ScrollTrigger.getAll().forEach(s => s.kill()); cleanupFns.forEach(f => f()); cleanupFns.length = 0 })
</script>

<style scoped lang="scss">
.sr-root {
  position: relative; width: 100vw; height: 100vh; overflow: hidden;
  background: #060410;
  font-family: 'PingFang SC','Inter','Microsoft YaHei',system-ui,sans-serif;
}

/* ── 粒子 ── */
.sr-particles { position: absolute; inset: 0; z-index: 1; pointer-events: none; will-change: opacity; }
.sr-particle {
  --px: 50%; --py: 50%; --ps: 3px; --pd: 12s; --pdl: 0s; --po: .3;
  position: absolute; left: var(--px); top: var(--py);
  width: var(--ps); height: var(--ps); border-radius: 50%;
  background: radial-gradient(circle, rgba(255,200,150,.85) 0%, rgba(150,120,220,.4) 40%, transparent 70%);
  box-shadow: 0 0 calc(var(--ps)*3) rgba(170,140,230,.4), 0 0 calc(var(--ps)*6) rgba(255,170,110,.2);
  opacity: var(--po);
  animation: sr-float var(--pd) var(--pdl) infinite ease-in-out;
  will-change: transform, opacity;
}
@keyframes sr-float {
  0% { transform: translateY(0) translateX(0) scale(1); opacity: var(--po); }
  25% { transform: translateY(-10vh) translateX(2vw) scale(1.5); opacity: calc(var(--po)*1.4); }
  50% { transform: translateY(-20vh) translateX(-3vw) scale(.7); opacity: calc(var(--po)*.5); }
  75% { transform: translateY(-7vh) translateX(4vw) scale(1.3); opacity: calc(var(--po)*1.1); }
  100% { transform: translateY(0) translateX(0) scale(1); opacity: var(--po); }
}

.sr-stage { position: relative; width: 100%; height: 100vh; overflow: hidden; z-index: 2; will-change: opacity; }

/* ═══════════════════════ 底层内容 ═══════════════════════ */
.sr-content {
  position: absolute; inset: 0; z-index: 3;
  display: flex; align-items: center; justify-content: center;
  will-change: opacity;
}
.sr-content__inner {
  text-align: center; width: 90vw;
  will-change: transform;
}
.sr-content__title {
  margin: 0 0 .3rem;
  font-size: clamp(1.8rem, 4vw, 3rem); font-weight: 900;
  background: linear-gradient(180deg, #ffe0b0, #d09038);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  filter: drop-shadow(0 2px 16px rgba(240, 180, 100, .5));
  will-change: transform, opacity;
}
.sr-content__desc {
  margin: 0 0 1.5rem;
  font-size: clamp(.6rem, .9vw, .8rem); line-height: 1.8;
  color: rgba(200, 170, 150, .45);
  will-change: transform, opacity;
}
/* ── 5排图片网格 ── */
.sr-grid {
  width: 100%; will-change: transform, opacity;
}
.sr-grid__row {
  display: flex; justify-content: center; gap: 1vw; margin-bottom: 1vh;
}
.sr-thumb {
  width: clamp(100px, 18vw, 240px); text-align: center;
}
.sr-thumb__img {
  width: 100%; aspect-ratio: 3/4; object-fit: cover; border-radius: 8px; display: block;
  box-shadow: 0 0 0 2px rgba(255, 190, 140, .22), 0 12px 36px rgba(0, 0, 0, .4);
}
.sr-thumb__label {
  display: block; margin-top: .35rem; font-size: .55rem; font-weight: 700; letter-spacing: .14em;
  color: rgba(200, 160, 140, .6);
}

/* ═══════════════════════ 半图 ═══════════════════════ */
.sr-half {
  position: absolute; top: 0; width: 50vw; height: 100vh; overflow: hidden; z-index: 5;
  will-change: transform, opacity;
}
.sr-half--left  { left: 0; }
.sr-half--right { right: 0; }

.sr-half__img {
  position: absolute; top: 0; width: 200%; height: 100%; object-fit: cover; display: block;
}
.sr-half__img--left  { left: 0; }
.sr-half__img--right { right: 0; }

/* 裂缝边缘发光 */
.sr-half__edge {
  position: absolute; top: 0; width: 1px; height: 100%;
  background: linear-gradient(180deg, transparent 5%, rgba(255, 200, 140, .3) 30%, rgba(255, 230, 190, .8) 50%, rgba(255, 200, 140, .3) 70%, transparent 95%);
  box-shadow: 0 0 8px rgba(255, 170, 100, .4);
}
.sr-half--left  .sr-half__edge { right: 0; }
.sr-half--right .sr-half__edge { left: 0; }

/* ═══════════════════════ 中心裂缝光 ═══════════════════════ */
.sr-crack {
  position: absolute; top: 0; left: 50%; transform: translateX(-50%);
  width: 4px; height: 100%; z-index: 6; pointer-events: none;
  background: linear-gradient(180deg,
    transparent 0%, rgba(255, 210, 150, .2) 15%, rgba(255, 240, 210, .9) 40%,
    rgba(255, 255, 240, 1) 50%, rgba(255, 240, 210, .9) 60%,
    rgba(255, 210, 150, .2) 85%, transparent 100%);
  box-shadow:
    0 0 20px rgba(255, 180, 120, .6),
    0 0 50px rgba(255, 150, 100, .3),
    0 0 80px rgba(200, 120, 80, .15);
  will-change: transform, opacity;
}

/* ═══════════════════════ 标题 ═══════════════════════ */
.sr-header {
  position: absolute; top: 4vh; left: 50%; transform: translateX(-50%);
  z-index: 20; text-align: center; width: min(88vw, 520px); pointer-events: none;
  will-change: transform, opacity;
}
.sr-kicker {
  display: inline-block; font-size: .54rem; font-weight: 700; letter-spacing: .22em;
  color: rgba(200, 165, 140, .6); background: rgba(10, 5, 20, .45); backdrop-filter: blur(8px);
  border: 1px solid rgba(170, 130, 220, .16); border-radius: 999px;
  padding: .2rem .8rem; margin-bottom: .4rem; will-change: transform, opacity;
}
.sr-title { margin: 0; display: flex; justify-content: center; gap: .04em; }
.sr-t__w {
  font-size: clamp(2rem, 5vw, 3.8rem); font-weight: 900; will-change: transform, opacity;
  &--1 { background: linear-gradient(180deg, #ffa880, #f06848); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  &--2 { background: linear-gradient(180deg, #90b0f0, #5078d8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  &--3 { background: linear-gradient(180deg, #ffe0a8, #d09038); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 2px 10px rgba(240, 180, 100, .5)); }
}
.sr-divider {
  width: 60px; height: 1.5px; margin: .3rem auto .4rem; border-radius: 2px;
  background: linear-gradient(90deg, transparent, #f09060, #b080d8, #6098e0, transparent);
  transform-origin: center; will-change: transform, opacity;
}
.sr-sub { margin: 0; font-size: clamp(.52rem, .78vw, .66rem); color: rgba(185, 155, 135, .36); max-width: 420px; margin-inline: auto; will-change: transform, opacity; }

.sr-progress { position: absolute; left: 0; bottom: 0; z-index: 25; width: 100%; height: 2px; background: rgba(255, 170, 110, .02); }
.sr-progress__fill {
  width: 0; height: 100%;
  background: linear-gradient(90deg, #f06848, #f0a060, #b080d8, #5078d8, #b080d8, #f0a060);
  background-size: 300% 100%; box-shadow: 0 0 10px rgba(240, 130, 80, .4);
  animation: sr-ps 4s linear infinite;
}
@keyframes sr-ps { 0% { background-position: 0% 50%; } 100% { background-position: 300% 50%; } }

@media (max-width: 768px) {
  .sr-header { top: 2.5vh; } .sr-kicker { font-size: .44rem; } .sr-t__w { font-size: 1.5rem; } .sr-sub { font-size: .48rem; }
  .sr-content__title { font-size: 1.4rem; }
  .sr-thumb { width: 70px; }
}
</style>
