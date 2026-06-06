<template>
  <section ref="rootRef" class="nr-root">
    <div ref="glowA" class="nr-glow nr-glow--a"></div>
    <div ref="glowB" class="nr-glow nr-glow--b"></div>

    <div ref="scrollRef" class="nr-scroll">
      <div ref="trackRef" class="nr-track" :style="{ height: trackHeight }">
        <div class="nr-sticky">

          <header ref="headerRef" class="nr-header">
            <span class="nr-kicker">◎ CSS3 3D · 空间嵌套 · 节奏差动画 ◎</span>
            <h1 class="nr-title">
              <span ref="tc1" class="nr-title__c">套</span>
              <span ref="tc2" class="nr-title__c nr-title__c--nest">娃</span>
              <span ref="tc3" class="nr-title__c">旋</span>
              <span ref="tc4" class="nr-title__c nr-title__c--nest">律</span>
            </h1>
            <div ref="dividerRef" class="nr-divider"></div>
            <p ref="subRef" class="nr-sub">
              向下滚动 · preserve-3d 三层嵌套 · 正向/反向/倍速节奏差 · 俄罗斯套娃旋涡
            </p>
          </header>

          <!-- ════════════════ 3D 嵌套场景 ════════════════ -->
          <div ref="sceneRef" class="nr-scene">

            <!-- 🔑 第一层：外层巨环 (Y轴慢速正向) -->
            <div ref="outerRing" class="nr-level1">
              <div
                v-for="(card, i) in outerCards"
                :key="'o'+i"
                class="nr-card nr-card--outer"
                :style="{ transform: `rotateY(${i * 60}deg) translateZ(340px)` }"
              >
                <img :src="card.url" :alt="card.label" class="nr-card__img" loading="lazy" />
                <span class="nr-card__tag nr-card__tag--outer">{{ card.label }}</span>
              </div>

              <!-- 🔑 第二层：中层环 (X轴中速反向) — 嵌套在 Layer1 内 -->
              <div ref="middleRing" class="nr-level2">
                <div
                  v-for="(card, i) in middleCards"
                  :key="'m'+i"
                  class="nr-card nr-card--middle"
                  :style="{ transform: `rotateX(${i * 90}deg) translateZ(200px)` }"
                >
                  <img :src="card.url" :alt="card.label" class="nr-card__img" loading="lazy" />
                  <span class="nr-card__tag nr-card__tag--middle">{{ card.label }}</span>
                </div>

                <!-- 🔑 第三层：内核 (双轴快速交替) — 嵌套在 Layer2 内 -->
                <div ref="innerCore" class="nr-level3">
                  <div
                    v-for="(card, i) in innerCards"
                    :key="'i'+i"
                    class="nr-card nr-card--inner"
                    :style="{ transform: `rotateY(${i * 180}deg) translateZ(80px)` }"
                  >
                    <img :src="card.url" :alt="card.label" class="nr-card__img" loading="lazy" />
                  </div>
                </div>
              </div>

            </div>

          </div>

          <!-- 节奏指示器 -->
          <div ref="rhythmBar" class="nr-rhythm">
            <span class="nr-rhythm__item nr-rhythm__item--outer">外层 Y轴 1× ↻</span>
            <span class="nr-rhythm__item nr-rhythm__item--middle">中层 X轴 3× ↺</span>
            <span class="nr-rhythm__item nr-rhythm__item--inner">内核 双轴 5× ↻</span>
          </div>

          <div class="nr-progress"><div ref="progRef" class="nr-progress__fill"></div></div>
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

// ═══════════════════════════════════════════════════════════════════════
//  CardImage3DNestedRhythm — CSS3 3D 空间嵌套 · 节奏差动画
//
//  核心概念：俄罗斯套娃式 3D 嵌套 + 节奏差
//
//  三层嵌套结构：
//  Layer1 (外层): 6卡片Y轴环 — 慢速正向 1×
//    └── Layer2 (中层): 4卡片X轴环 — 中速反向 3× (嵌套在Layer1内)
//         └── Layer3 (内核): 2卡片双轴 — 快速交替 5× (嵌套在Layer2内)
//
//  节奏差来源：
//  1. 不同旋转轴 (Y → X → Y+X) — 空间维度差异
//  2. 不同速度倍率 (1× / 3× / 5×) — 时间维度差异
//  3. 不同方向 (正向 / 反向 / 交替) — 相位差异
//  4. preserve-3d 层层传递 — 子级自动继承父级3D空间
//
//  设计风格：深邃宇宙空间 · 嵌套旋涡 · 科技感
// ═══════════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

interface CardData { label: string; url: string }

const outerCards: CardData[] = [
  { label: 'NEBULA',  url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80' },
  { label: 'COSMOS',  url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80' },
  { label: 'GALAXY',  url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80' },
  { label: 'STELLAR', url: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=600&q=80' },
  { label: 'ORBIT',   url: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=600&q=80' },
  { label: 'PULSAR',  url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80' },
]

const middleCards: CardData[] = [
  { label: 'AETHER', url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=500&q=80' },
  { label: 'FLUX',   url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&q=80' },
  { label: 'VOID',   url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=80' },
  { label: 'DRIFT',  url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&q=80' },
]

const innerCards: CardData[] = [
  { label: 'CORE-A', url: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=400&q=80' },
  { label: 'CORE-B', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80' },
]

const SCROLL_STAGES = 6
const trackHeight = `${(SCROLL_STAGES + 1) * 100}vh`

// ── Refs ──
const rootRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const subRef = ref<HTMLElement | null>(null)
const dividerRef = ref<HTMLElement | null>(null)
const tc1 = ref<HTMLElement | null>(null); const tc2 = ref<HTMLElement | null>(null)
const tc3 = ref<HTMLElement | null>(null); const tc4 = ref<HTMLElement | null>(null)
const sceneRef = ref<HTMLElement | null>(null)
const outerRing = ref<HTMLElement | null>(null)
const middleRing = ref<HTMLElement | null>(null)
const innerCore = ref<HTMLElement | null>(null)
const glowA = ref<HTMLElement | null>(null)
const glowB = ref<HTMLElement | null>(null)
const rhythmBar = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)

const cleanupFns: TweenCleanup[] = []

// ═══════════════════════ 入场 ═══════════════════════
function setupEntrance() {
  if (!scrollRef.value || !headerRef.value) return
  const scroller = scrollRef.value
  const chars = [tc1.value, tc2.value, tc3.value, tc4.value].filter(Boolean)
  const tl = gsap.timeline({ scrollTrigger: { trigger: scrollRef.value, scroller, start: 'top 75%', toggleActions: 'play none none reverse' } })
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.75, ease: 'power3.out' })
    .fromTo(chars, { autoAlpha: 0, z: -300, scale: 0.2, filter: 'blur(12px)' }, { autoAlpha: 1, z: 0, scale: 1, filter: 'blur(0px)', duration: 0.6, stagger: 0.1, ease: 'back.out(2)' }, '-=0.3')
    .fromTo(dividerRef.value, { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: 'power3.inOut' }, '-=0.15')
    .fromTo(subRef.value, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.08')
    .fromTo(sceneRef.value, { autoAlpha: 0, scale: 0.88 }, { autoAlpha: 1, scale: 1, duration: 0.9, ease: 'power3.out' }, '-=0.3')
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

// ═══════════════════════ 🔑 嵌套节奏差核心动画 ═══════════════════════
function setupNestedRhythm() {
  if (!scrollRef.value || !trackRef.value || !outerRing.value) return
  const scroller = scrollRef.value; const track = trackRef.value
  const D = SCROLL_STAGES

  // 初始状态
  gsap.set(outerRing.value, { rotateY: 0 })
  gsap.set(middleRing.value, { rotateX: 0 })
  gsap.set(innerCore.value, { rotateY: 0, rotateX: 0 })

  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.2,
    },
  })

  // ═══════════════════════ 三层节奏差 ═══════════════════════
  //
  //  层级    轴      速度    方向    完整圈数(6阶段)
  //  ───────────────────────────────────────────
  //  外层    Y轴     1×      正向 ↻    1 圈
  //  中层    X轴     3×      反向 ↺    3 圈 (反向)
  //  内核    Y+X轴   5×      交替 ↻    5 圈 (Y) + 3 圈 (X)

  // 🔑 外层 — Y轴慢速正向 (1圈)
  master.to(outerRing.value, { rotateY: 360, duration: D, ease: 'none' }, 0)

  // 🔑 中层 — X轴中速反向 (3圈，方向相反)
  // 嵌套在外层内 → 外层旋转 + 中层自身反向X旋转 = 复杂合成运动
  master.to(middleRing.value, { rotateX: -1080, duration: D, ease: 'none' }, 0)

  // 🔑 内核 — Y+X双轴快速交替 (5圈Y + 3圈X)
  // 嵌套在中层内 → 三层旋转互相叠加 = 极其复杂的运动轨迹
  master.to(innerCore.value, { rotateY: 1800, duration: D, ease: 'none' }, 0)
  master.to(innerCore.value, { rotateX: 1080, duration: D, ease: 'none' }, 0)

  // 环境光
  if (glowA.value) master.to(glowA.value, { x: '4vw', y: '-3vh', scale: 1.15, duration: D }, 0)
  if (glowB.value) master.to(glowB.value, { x: '-3vw', y: '4vh', scale: 1.2, duration: D }, 0)

  // 节奏指示器
  if (rhythmBar.value) {
    master.fromTo(rhythmBar.value, { autoAlpha: 0.3 }, { autoAlpha: 0.75, duration: 1 }, 0.5)
    // 脉动
    for (let i = 0; i < 3; i++) {
      master.to(rhythmBar.value, { scale: 1.06, duration: 0.3, ease: 'sine.inOut' }, i * 2 + 0.8)
      master.to(rhythmBar.value, { scale: 1, duration: 0.3, ease: 'sine.inOut' }, i * 2 + 1.1)
    }
  }

  if (progRef.value) master.to(progRef.value, { width: '100%', duration: D }, 0)

  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }

onMounted(() => {
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupNestedRhythm() }))
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  ScrollTrigger.getAll().forEach(st => st.kill())
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0
})
</script>

<style scoped lang="scss">
/* ═══════════════════════ 深邃空间 ═══════════════════════ */
.nr-root {
  position: relative; width: 100vw; height: 100vh; overflow: hidden;
  background: radial-gradient(ellipse 55% 45% at 50% 48%, #0e0c1a 0%, #06040e 55%, #020108 100%);
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif;
}

.nr-glow { position: absolute; border-radius: 50%; filter: blur(65px); pointer-events: none; will-change: transform; z-index: 0; }
.nr-glow--a { width: 30vw; height: 30vw; top: -5vh; left: -3vw; background: radial-gradient(circle, rgba(80,100,200,.14) 0%, transparent 70%); }
.nr-glow--b { width: 28vw; height: 28vw; bottom: -4vh; right: -2vw; background: radial-gradient(circle, rgba(160,80,200,.12) 0%, transparent 70%); }

/* ── 滚动 ── */
.nr-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 5;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(80,100,200,.1); }
}
.nr-track { position: relative; width: 100%; }
.nr-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

/* ── 标题 ── */
.nr-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 40; text-align: center; width: min(92vw, 800px); pointer-events: none; }
.nr-kicker { display: inline-block; font-size: .56rem; font-weight: 700; letter-spacing: .26em; color: rgba(120,150,220,.65); background: rgba(60,100,200,.04); backdrop-filter: blur(8px); border: 1px solid rgba(60,100,200,.1); border-radius: 999px; padding: .2rem 1rem; margin-bottom: .48rem; }
.nr-title { margin: 0; display: flex; justify-content: center; gap: .06em; }
.nr-title__c { display: inline-block; font-size: clamp(2.2rem, 5.5vw, 4.6rem); font-weight: 900; color: #7888c8; will-change: transform,opacity,filter;
  &--nest {
    background: linear-gradient(150deg, #6090e0 0%, #80b8f0 25%, #c070e0 55%, #e090f0 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    filter: drop-shadow(0 2px 12px rgba(100,140,220,.5));
  }
}
.nr-divider { width: 110px; height: 2px; margin: .4rem auto .5rem; border-radius: 2px; background: linear-gradient(90deg, transparent, #6090e0, #c070e0, #6090e0, transparent); transform-origin: center; }
.nr-sub { margin: 0; font-size: clamp(.62rem, 1vw, .78rem); color: rgba(100,140,210,.3); max-width: 520px; margin-inline: auto; }

/* ═══════════════════════ 🔑 场景：perspective入口 ═══════════════════════ */
.nr-scene {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 0; height: 0; z-index: 10;
  perspective: 1200px;
  perspective-origin: 50% 48%;
  will-change: transform;
}

/* ═══════════════════════ 🔑 Layer1: 外层巨环 ═══════════════════════ */
.nr-level1 {
  position: absolute; width: 0; height: 0;
  transform-style: preserve-3d; // 🔑 传递3D空间给子级
  will-change: transform;
}

/* ═══════════════════════ 🔑 Layer2: 中层环 (嵌套在Layer1内) ═══════════════════════ */
.nr-level2 {
  position: absolute; width: 0; height: 0;
  transform-style: preserve-3d; // 🔑 继续传递3D空间
  will-change: transform;
}

/* ═══════════════════════ 🔑 Layer3: 内核 (嵌套在Layer2内) ═══════════════════════ */
.nr-level3 {
  position: absolute; width: 0; height: 0;
  transform-style: preserve-3d; // 🔑 3D空间穿透到底
  will-change: transform;
}

/* ═══════════════════════ 卡片通用 ═══════════════════════ */
.nr-card {
  position: absolute; backface-visibility: hidden;
  transform-style: preserve-3d;
  will-change: transform;
}
.nr-card__img {
  display: block; object-fit: cover; border-radius: 8px;
}

/* ── 外层卡片 (最大) ── */
.nr-card--outer {
  width: 240px; height: 160px;
  margin-left: -120px; margin-top: -80px;
}
.nr-card--outer .nr-card__img {
  width: 100%; height: 100%;
  box-shadow: 0 12px 40px rgba(0,0,0,.45), 0 0 0 1px rgba(255,255,255,.06);
  filter: brightness(1.02) saturate(0.95);
}

/* ── 中层卡片 (中等) ── */
.nr-card--middle {
  width: 160px; height: 110px;
  margin-left: -80px; margin-top: -55px;
}
.nr-card--middle .nr-card__img {
  width: 100%; height: 100%;
  box-shadow: 0 8px 28px rgba(0,0,0,.4), 0 0 0 1px rgba(255,255,255,.08);
  filter: brightness(1.05) saturate(1);
}

/* ── 内核卡片 (最小) ── */
.nr-card--inner {
  width: 100px; height: 70px;
  margin-left: -50px; margin-top: -35px;
  border-radius: 50%; overflow: hidden;
}
.nr-card--inner .nr-card__img {
  width: 100%; height: 100%;
  box-shadow: 0 4px 16px rgba(0,0,0,.35), 0 0 12px rgba(120,160,220,.2);
  filter: brightness(1.08) contrast(1.05);
}

/* ── 标签 ── */
.nr-card__tag {
  position: absolute; bottom: -18px; left: 50%; transform: translateX(-50%);
  font-size: .48rem; font-weight: 700; letter-spacing: .16em; white-space: nowrap;
  font-family: 'Courier New', monospace;
  background: rgba(6,4,14,.5); backdrop-filter: blur(6px);
  border-radius: 999px; padding: .06rem .5rem;
}
.nr-card__tag--outer  { color: rgba(120,160,220,.45); border: 1px solid rgba(80,120,200,.1); }
.nr-card__tag--middle { color: rgba(160,120,210,.5);  border: 1px solid rgba(140,100,180,.12); }

/* ═══════════════════════ 节奏指示器 ═══════════════════════ */
.nr-rhythm { position: absolute; bottom: 10vh; left: 50%; transform: translateX(-50%); z-index: 35; pointer-events: none; display: flex; gap: .6rem; will-change: transform,opacity; }
.nr-rhythm__item { font-size: .5rem; font-weight: 700; letter-spacing: .1em; font-family: 'Courier New', monospace; padding: .12rem .65rem; border-radius: 999px; background: rgba(6,4,14,.5); backdrop-filter: blur(8px); white-space: nowrap; }
.nr-rhythm__item--outer  { color: rgba(100,140,210,.5);  border: 1px solid rgba(80,110,200,.1); }
.nr-rhythm__item--middle { color: rgba(160,120,210,.55); border: 1px solid rgba(140,100,200,.12); }
.nr-rhythm__item--inner  { color: rgba(200,100,200,.6);  border: 1px solid rgba(180,80,200,.14); }

.nr-progress { position: absolute; left: 0; bottom: 0; z-index: 40; width: 100%; height: 2px; background: rgba(60,100,200,.02); }
.nr-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #6090e0, #c070e0, #6090e0); box-shadow: 0 0 6px rgba(100,140,220,.2); }

@media (max-width: 768px) {
  .nr-header { top: 2vh; } .nr-kicker { font-size: .4rem; } .nr-title__c { font-size: 1.5rem; }
  .nr-scene { perspective: 800px; }
  .nr-card--outer  { width: 160px; height: 110px; margin-left: -80px; margin-top: -55px; }
  .nr-card--middle { width: 110px; height: 75px;  margin-left: -55px; margin-top: -38px; }
  .nr-card--inner  { width: 70px;  height: 50px;  margin-left: -35px; margin-top: -25px; }
  .nr-rhythm__item { font-size: .4rem; padding: .1rem .45rem; }
}
</style>
