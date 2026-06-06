<template>
  <section ref="rootRef" class="sf-root">
    <div ref="glowA" class="sf-glow sf-glow--a"></div>
    <div ref="glowB" class="sf-glow sf-glow--b"></div>
    <div ref="glowC" class="sf-glow sf-glow--c"></div>

    <div ref="scrollRef" class="sf-scroll">
      <div ref="trackRef" class="sf-track" :style="{ height: trackHeight }">
        <div class="sf-sticky">

          <header ref="headerRef" class="sf-header">
            <span class="sf-kicker">◈ CSS3 3D · 立体视差流动 · 多层景深 ◈</span>
            <h1 class="sf-title">
              <span ref="tc1" class="sf-title__c">立</span>
              <span ref="tc2" class="sf-title__c sf-title__c--3d">体</span>
              <span ref="tc3" class="sf-title__c">流</span>
              <span ref="tc4" class="sf-title__c sf-title__c--3d">动</span>
            </h1>
            <div ref="dividerRef" class="sf-divider"></div>
            <p ref="subRef" class="sf-sub">
              向下滚动 · 3条深度轨道逆向流动 · translateZ视差 · 立体感爆棚
            </p>
          </header>

          <!-- ════════════════ 3D 立体流动场景 ════════════════ -->
          <div ref="sceneRef" class="sf-scene">
            <div ref="stageRef" class="sf-stage">

              <!-- 🔑 远景轨道 Z:-300 — 慢速上浮 -->
              <div ref="trackFar" class="sf-flow-track sf-flow-track--far">
                <div
                  v-for="img in trackFarImages"
                  :key="img.id"
                  class="sf-flow-card sf-flow-card--far"
                  :style="{ transform: `translateY(${img.baseY}vh) rotateX(8deg)` }"
                >
                  <img :src="img.url" :alt="img.label" class="sf-flow-card__img" loading="lazy" />
                  <div class="sf-flow-card__fog"></div>
                  <span class="sf-flow-card__label">{{ img.label }}</span>
                </div>
              </div>

              <!-- 🔑 中景轨道 Z:0 — 中速下沉 -->
              <div ref="trackMid" class="sf-flow-track sf-flow-track--mid">
                <div
                  v-for="img in trackMidImages"
                  :key="img.id"
                  class="sf-flow-card sf-flow-card--mid"
                  :style="{ transform: `translateY(${img.baseY}vh) rotateX(-4deg)` }"
                >
                  <img :src="img.url" :alt="img.label" class="sf-flow-card__img" loading="lazy" />
                  <span class="sf-flow-card__label">{{ img.label }}</span>
                </div>
              </div>

              <!-- 🔑 近景轨道 Z:+200 — 快速上浮 -->
              <div ref="trackNear" class="sf-flow-track sf-flow-track--near">
                <div
                  v-for="img in trackNearImages"
                  :key="img.id"
                  class="sf-flow-card sf-flow-card--near"
                  :style="{ transform: `translateY(${img.baseY}vh) rotateX(-10deg) rotateY(5deg)` }"
                >
                  <img :src="img.url" :alt="img.label" class="sf-flow-card__img" loading="lazy" />
                  <div class="sf-flow-card__glint"></div>
                  <span class="sf-flow-card__label">{{ img.label }}</span>
                </div>
              </div>

            </div>
          </div>

          <!-- 深度层指示 -->
          <div ref="depthBar" class="sf-depth-bar">
            <span class="sf-depth-bar__track sf-depth-bar__track--near">近景 2×</span>
            <span class="sf-depth-bar__track sf-depth-bar__track--mid">中景 1×</span>
            <span class="sf-depth-bar__track sf-depth-bar__track--far">远景 0.5×</span>
          </div>

          <div class="sf-progress"><div ref="progRef" class="sf-progress__fill"></div></div>
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
//  CardImage3DStereoFlux — CSS3 3D 立体视差流动
//
//  核心概念：3条图片轨道在3D空间中以不同速度和方向流动
//
//  立体感来源：
//  1. 3条轨道分布在不同的 translateZ 深度 (−300 / 0 / +200)
//  2. 每条轨道以不同速度流动 (0.5× / 1× / 2×)
//  3. 远景上浮 vs 近景下沉 — 方向对比强化深度
//  4. 不同 rotateX 角度 — 远景仰视、近景俯视
//  5. 远景添加大气雾化 — blur + brightness 模拟距离
//  6. 近景添加镜面高光 — 增强临场感
//
//  设计风格：暗色深邃空间 · 冷暖对比 · 立体流动
// ═══════════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

interface FlowImage {
  id: number; label: string; url: string; baseY: number
}

// 远景轨道 — 4张图，初始分布在垂直空间
const trackFarImages: FlowImage[] = [
  { id: 0, label: 'HORIZON', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80', baseY: -50 },
  { id: 1, label: 'SUMMIT',  url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80', baseY: 20 },
  { id: 2, label: 'RIDGE',   url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80', baseY: 90 },
  { id: 3, label: 'PEAK',    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80', baseY: 160 },
]

// 中景轨道 — 4张图
const trackMidImages: FlowImage[] = [
  { id: 0, label: 'CASCADE', url: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=600&q=80', baseY: -30 },
  { id: 1, label: 'STREAM',  url: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=600&q=80', baseY: 40 },
  { id: 2, label: 'TORRENT', url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&q=80', baseY: 110 },
  { id: 3, label: 'DELUGE',  url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80', baseY: 180 },
]

// 近景轨道 — 4张图
const trackNearImages: FlowImage[] = [
  { id: 0, label: 'CURRENT', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80', baseY: -40 },
  { id: 1, label: 'SURGE',   url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80', baseY: 30 },
  { id: 2, label: 'RAPID',   url: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=600&q=80', baseY: 100 },
  { id: 3, label: 'FLUX',    url: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=600&q=80', baseY: 170 },
]

const FLOW_STAGES = 5
const trackHeight = `${(FLOW_STAGES + 1) * 100}vh`

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
const stageRef = ref<HTMLElement | null>(null)
const trackFar = ref<HTMLElement | null>(null)
const trackMid = ref<HTMLElement | null>(null)
const trackNear = ref<HTMLElement | null>(null)
const glowA = ref<HTMLElement | null>(null)
const glowB = ref<HTMLElement | null>(null)
const glowC = ref<HTMLElement | null>(null)
const depthBar = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)

const cleanupFns: TweenCleanup[] = []

// ═══════════════════════ 入场 ═══════════════════════
function setupEntrance() {
  if (!scrollRef.value || !headerRef.value) return
  const scroller = scrollRef.value
  const chars = [tc1.value, tc2.value, tc3.value, tc4.value].filter(Boolean)
  const tl = gsap.timeline({ scrollTrigger: { trigger: scrollRef.value, scroller, start: 'top 75%', toggleActions: 'play none none reverse' } })
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.75, ease: 'power3.out' })
    .fromTo(chars, { autoAlpha: 0, z: -200, scale: 0.4, filter: 'blur(8px)' }, { autoAlpha: 1, z: 0, scale: 1, filter: 'blur(0px)', duration: 0.55, stagger: 0.08, ease: 'back.out(1.6)' }, '-=0.3')
    .fromTo(dividerRef.value, { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: 'power3.inOut' }, '-=0.15')
    .fromTo(subRef.value, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.08')
    .fromTo(sceneRef.value, { autoAlpha: 0, scale: 0.92 }, { autoAlpha: 1, scale: 1, duration: 0.85, ease: 'power3.out' }, '-=0.25')
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

// ═══════════════════════ 🔑 立体流动核心动画 ═══════════════════════
function setupStereoFlux() {
  if (!scrollRef.value || !trackRef.value || !stageRef.value) return
  const scroller = scrollRef.value; const track = trackRef.value

  gsap.set(trackFar.value, { translateZ: -300 })
  gsap.set(trackMid.value, { translateZ: 0 })
  gsap.set(trackNear.value, { translateZ: 200 })

  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.4 },
  })

  const D = FLOW_STAGES

  // 🔑 远景轨道 — 慢速上浮 (0.5× speed)
  // 图片从下往上缓慢流动
  master.to(trackFar.value, { y: '-45vh', duration: D, ease: 'none' }, 0)
  // 大气雾化随滚动增强 (远景观感)
  master.to(trackFar.value, {
    filter: 'brightness(1.15) blur(1.5px)',
    duration: D * 0.4, ease: 'power2.inOut',
  }, 0)
  master.to(trackFar.value, {
    filter: 'brightness(1.08) blur(1px)',
    duration: D * 0.6, ease: 'power2.inOut',
  }, D * 0.4)

  // 🔑 中景轨道 — 中速下沉 (1× speed)
  // 图片从上往下流动 (与远景反向 → 强化立体对比)
  master.to(trackMid.value, { y: '50vh', duration: D, ease: 'none' }, 0)

  // 🔑 近景轨道 — 快速上浮 (2× speed)
  // 近景流动最快，幅度最大 → 极强纵深感
  master.to(trackNear.value, { y: '-80vh', duration: D, ease: 'none' }, 0)

  // ── 环境光 ──
  if (glowA.value) master.to(glowA.value, { x: '6vw', y: '-4vh', scale: 1.15, duration: D }, 0)
  if (glowB.value) master.to(glowB.value, { x: '-4vw', y: '5vh', scale: 1.2, duration: D }, 0)
  if (glowC.value) master.to(glowC.value, { x: '3vw', y: '-6vh', scale: 1.1, duration: D }, 0)

  // ── 深度指示条 ──
  if (depthBar.value) {
    master.fromTo(depthBar.value, { autoAlpha: 0.3 }, { autoAlpha: 0.75, duration: 1 }, 0.5)
  }

  if (progRef.value) master.to(progRef.value, { width: '100%', duration: D }, 0)

  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }

onMounted(() => {
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupStereoFlux() }))
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
/* ═══════════════════════ 立体深邃空间 ═══════════════════════ */
.sf-root {
  position: relative; width: 100vw; height: 100vh; overflow: hidden;
  background: linear-gradient(175deg, #0c0a14 0%, #0e0c18 30%, #0b0a12 60%, #0d0b16 100%);
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif;
}

/* ── 环境光 ── */
.sf-glow { position: absolute; border-radius: 50%; filter: blur(70px); pointer-events: none; will-change: transform; z-index: 0; }
.sf-glow--a { width: 30vw; height: 30vw; top: -6vh; left: -4vw; background: radial-gradient(circle, rgba(80,140,220,.15) 0%, transparent 70%); }
.sf-glow--b { width: 28vw; height: 28vw; bottom: -5vh; right: -3vw; background: radial-gradient(circle, rgba(200,120,180,.12) 0%, transparent 70%); }
.sf-glow--c { width: 24vw; height: 24vw; top: 35vh; left: 50vw; background: radial-gradient(circle, rgba(60,180,200,.1) 0%, transparent 70%); }

/* ── 滚动 ── */
.sf-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 5;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(80,150,210,.12); }
}
.sf-track { position: relative; width: 100%; }
.sf-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

/* ── 标题 ── */
.sf-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 35; text-align: center; width: min(92vw, 800px); pointer-events: none; }
.sf-kicker { display: inline-block; font-size: .56rem; font-weight: 700; letter-spacing: .26em; color: rgba(100,160,220,.65); background: rgba(60,140,200,.05); backdrop-filter: blur(8px); border: 1px solid rgba(60,140,200,.12); border-radius: 999px; padding: .2rem 1.1rem; margin-bottom: .48rem; }
.sf-title { margin: 0; display: flex; justify-content: center; gap: .06em; }
.sf-title__c { display: inline-block; font-size: clamp(2.2rem, 5.5vw, 4.6rem); font-weight: 900; color: #68a8d0; will-change: transform,opacity,filter;
  &--3d {
    background: linear-gradient(150deg, #4098d0 0%, #70c8f0 25%, #d060c0 55%, #f090e0 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    filter: drop-shadow(0 2px 12px rgba(80,180,220,.5));
  }
}
.sf-divider { width: 110px; height: 2px; margin: .4rem auto .5rem; border-radius: 2px; background: linear-gradient(90deg, transparent, #4098d0, #d060c0, #4098d0, transparent); transform-origin: center; }
.sf-sub { margin: 0; font-size: clamp(.64rem, 1vw, .8rem); color: rgba(80,150,200,.35); max-width: 500px; margin-inline: auto; }

/* ═══════════════════════ CSS3 3D 场景 ═══════════════════════ */
.sf-scene {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 0; height: 0; z-index: 10;
  perspective: 1200px;
  perspective-origin: 50% 48%;
  will-change: transform;
}
.sf-stage {
  position: absolute; width: 0; height: 0;
  transform-style: preserve-3d;
  will-change: transform;
}

/* ═══════════════════════ 🔑 流动轨道 (3条) ═══════════════════════ */
.sf-flow-track {
  position: absolute; transform-style: preserve-3d;
  display: flex; flex-direction: column; align-items: center;
  gap: 22vh; // 图片间距
  will-change: transform;
}

/* 远景轨道 — 左侧, Z:-300, 最慢 */
.sf-flow-track--far {
  transform: translateZ(-300px) translateX(-22vw);
  z-index: 5;
}

/* 中景轨道 — 居中, Z:0, 中速 */
.sf-flow-track--mid {
  transform: translateZ(0px) translateX(8vw);
  z-index: 10;
}

/* 近景轨道 — 右侧, Z:+200, 最快 */
.sf-flow-track--near {
  transform: translateZ(200px) translateX(24vw);
  z-index: 15;
}

/* ═══════════════════════ 流动卡片 ═══════════════════════ */
.sf-flow-card {
  position: relative; transform-style: preserve-3d;
  will-change: transform;
  backface-visibility: hidden;
  flex-shrink: 0;
}
.sf-flow-card__img {
  display: block; object-fit: cover; border-radius: 10px;
  box-shadow: 0 12px 36px rgba(0,0,0,.4);
}

/* 远景卡片 — 最小、最模糊 */
.sf-flow-card--far {
  width: min(24vw, 180px); height: min(16vw, 120px);
}
.sf-flow-card--far .sf-flow-card__img {
  width: 100%; height: 100%;
  filter: brightness(1.1) blur(1px) saturate(0.8);
}
.sf-flow-card__fog {
  position: absolute; inset: 0; border-radius: 10px; pointer-events: none;
  background: linear-gradient(180deg, rgba(140,170,210,.3) 0%, rgba(120,150,200,.15) 50%, transparent 100%);
}

/* 中景卡片 — 中等大小 */
.sf-flow-card--mid {
  width: min(30vw, 220px); height: min(20vw, 150px);
}
.sf-flow-card--mid .sf-flow-card__img {
  width: 100%; height: 100%;
  filter: brightness(1.02);
}

/* 近景卡片 — 最大、最清晰 */
.sf-flow-card--near {
  width: min(36vw, 270px); height: min(24vw, 180px);
}
.sf-flow-card--near .sf-flow-card__img {
  width: 100%; height: 100%;
  filter: brightness(0.95) contrast(1.05);
}
/* 近景镜面高光 */
.sf-flow-card__glint {
  position: absolute; inset: 0; border-radius: 10px; pointer-events: none;
  background: radial-gradient(ellipse 30% 20% at 35% 30%, rgba(255,255,255,.12) 0%, transparent 55%);
}

.sf-flow-card__label {
  position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%);
  font-size: .5rem; font-weight: 700; letter-spacing: .18em; white-space: nowrap;
  color: rgba(100,160,210,.5); font-family: 'Courier New', monospace;
  background: rgba(8,6,16,.5); backdrop-filter: blur(6px);
  border-radius: 999px; padding: .08rem .6rem;
  border: 1px solid rgba(60,140,200,.1);
}

/* ═══════════════════════ 深度指示条 ═══════════════════════ */
.sf-depth-bar {
  position: absolute; bottom: 10vh; left: 50%; transform: translateX(-50%);
  z-index: 30; pointer-events: none; display: flex; gap: 1rem;
  will-change: opacity;
}
.sf-depth-bar__track {
  font-size: .52rem; font-weight: 700; letter-spacing: .14em; font-family: 'Courier New', monospace;
  padding: .15rem .7rem; border-radius: 999px;
  background: rgba(8,6,16,.55); backdrop-filter: blur(8px);
}
.sf-depth-bar__track--near { color: rgba(100,200,240,.6); border: 1px solid rgba(80,180,220,.18); }
.sf-depth-bar__track--mid  { color: rgba(140,160,200,.5); border: 1px solid rgba(100,140,180,.14); }
.sf-depth-bar__track--far  { color: rgba(120,140,180,.4); border: 1px solid rgba(80,100,140,.1); }

.sf-progress { position: absolute; left: 0; bottom: 0; z-index: 35; width: 100%; height: 2px; background: rgba(60,140,200,.03); }
.sf-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #4098d0, #d060c0, #4098d0); box-shadow: 0 0 6px rgba(80,180,220,.2); }

@media (max-width: 768px) {
  .sf-header { top: 2vh; } .sf-kicker { font-size: .4rem; } .sf-title__c { font-size: 1.5rem; }
  .sf-scene { perspective: 800px; }
  .sf-flow-track--far { transform: translateZ(-200px) translateX(-16vw); }
  .sf-flow-track--near { transform: translateZ(120px) translateX(18vw); }
  .sf-flow-card--far { width: 28vw; height: 18vw; }
  .sf-flow-card--mid { width: 34vw; height: 22vw; }
  .sf-flow-card--near { width: 40vw; height: 26vw; }
}
</style>
