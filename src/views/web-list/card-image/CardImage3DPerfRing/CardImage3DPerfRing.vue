<template>
  <!--
    ═══════════════════════════════════════════════════════════════
    CardImage3DPerfRing — 极致渲染性能 · 工程化优化
    ═══════════════════════════════════════════════════════════════
  -->
  <section
    ref="rootRef"
    class="pr-root"
    :style="rootCssVars"
  >
    <!-- 环境光 -->
    <div ref="glowA" class="pr-glow pr-glow--a"></div>
    <div ref="glowB" class="pr-glow pr-glow--b"></div>

    <div ref="scrollRef" class="pr-scroll">
      <div ref="trackRef" class="pr-track" :style="{ height: trackHeight }">
        <div class="pr-sticky">

          <header ref="headerRef" class="pr-header">
            <span class="pr-kicker">⚡ CSS3 3D · 极致性能 · 工程化优化 ⚡</span>
            <h1 class="pr-title">
              <span ref="tc1" class="pr-title__c">极</span>
              <span ref="tc2" class="pr-title__c pr-title__c--perf">速</span>
              <span ref="tc3" class="pr-title__c">光</span>
              <span ref="tc4" class="pr-title__c pr-title__c--perf">环</span>
            </h1>
            <div ref="dividerRef" class="pr-divider"></div>
            <p ref="subRef" class="pr-sub">
              向下滚动 · will-change GPU加速 · backface-visibility 防闪烁 · CSS变量全局配置
            </p>
          </header>

          <!-- ════════════════ 3D 光环场景 ════════════════ -->
          <div ref="sceneRef" class="pr-scene">
            <div ref="ringRef" class="pr-ring">

              <!-- 🔑 每张卡片：will-change + backface-visibility + CSS变量 -->
              <div
                v-for="(card, i) in cards"
                :key="card.id"
                :ref="el => { cardRefs[i] = el as HTMLElement | null }"
                class="pr-card"
                :style="cardStyle(i)"
              >
                <div class="pr-card__face">
                  <img :src="card.image" :alt="card.label" class="pr-card__img" loading="lazy" />
                  <div class="pr-card__overlay"></div>
                </div>
                <!-- 卡片背面 (防闪烁) -->
                <div class="pr-card__back" aria-hidden="true"></div>
                <span class="pr-card__tag">{{ card.label }}</span>
              </div>

            </div>
          </div>

          <!-- 性能监控面板 -->
          <div ref="perfPanel" class="pr-perf">
            <span class="pr-perf__fps" ref="fpsEl">60 FPS</span>
            <span class="pr-perf__label">GPU 加速层 · {{ CARD_COUNT }}张卡片</span>
          </div>

          <div class="pr-progress"><div ref="progRef" class="pr-progress__fill"></div></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, reactive, computed } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

// ═══════════════════════════════════════════════════════════════════════
//  CardImage3DPerfRing — 极致渲染性能 · 工程化优化
//
//  三大工程化优化：
//
//  1. 🔑 will-change: transform — GPU加速图层提升
//     · 所有动画元素提前告知浏览器触发GPU合成层
//     · 规避移动端常见的重排/重绘卡顿
//     · 动画结束移除 will-change 释放GPU内存
//
//  2. 🔑 backface-visibility: hidden — 防闪烁机制
//     · 3D环形旋转时严格隐藏元素背面
//     · 防止内容重叠或镜像翻转的视觉异常
//     · 每个卡片带有 .pr-card__back 背面覆盖层
//
//  3. 🔑 CSS变量全局配置化 — 一处修改全局生效
//     · --pr-perspective  透视强度
//     · --pr-radius       环形半径
//     · --pr-card-w/card-h 卡片尺寸
//     · --pr-duration     旋转周期
//     · --pr-bg           场景背景
//     · JS可实时读写 CSS变量，无需触碰核心CSS
//
//  设计风格：深色性能仪表盘 · 青蓝科技感 · 工程化美学
// ═══════════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

// ═══════════════ 🔑 CSS变量全局配置 ═══════════════
// 所有场景参数集中在此，JS可动态读写
interface SceneConfig {
  perspective: number    // 透视强度 (px)
  radius: number         // 环形半径 (px)
  cardW: number          // 卡片宽度 (px)
  cardH: number          // 卡片高度 (px)
  duration: number       // 完整旋转对应的滚动阶段数
}

const cfg: SceneConfig = {
  perspective: 1100,
  radius: 340,
  cardW: 280,
  cardH: 200,
  duration: 6, // 6阶段 = 完整一圈
}

// 🔑 CSS变量响应式对象 → 注入 :root style
const rootCssVars = computed(() => ({
  '--pr-perspective': `${cfg.perspective}px`,
  '--pr-radius': `${cfg.radius}px`,
  '--pr-card-w': `${cfg.cardW}px`,
  '--pr-card-h': `${cfg.cardH}px`,
  '--pr-bg': '#0a0812',
}))

interface CardData {
  id: number; label: string; image: string
}

const cards: CardData[] = [
  { id: 0, label: 'VELOCITY', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80' },
  { id: 1, label: 'MOMENTUM', image: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=600&q=80' },
  { id: 2, label: 'KINETIC',  image: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=600&q=80' },
  { id: 3, label: 'DYNAMIC',  image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80' },
  { id: 4, label: 'PHOTON',   image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80' },
  { id: 5, label: 'QUANTUM',  image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&q=80' },
  { id: 6, label: 'PRISMA',   image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80' },
  { id: 7, label: 'SPECTRUM', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80' },
]

const CARD_COUNT = cards.length
const ANGLE_STEP = 360 / CARD_COUNT // 45° 间隔
const trackHeight = `${(cfg.duration + 1) * 100}vh`

// 🔑 动态计算卡片3D位置 (基于CSS变量中的半径)
function cardStyle(i: number) {
  const angle = i * ANGLE_STEP
  return {
    transform: `rotateY(${angle}deg) translateZ(var(--pr-radius))`,
    width: 'var(--pr-card-w)',
    height: 'var(--pr-card-h)',
  }
}

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
const ringRef = ref<HTMLElement | null>(null)
const cardRefs = ref<(HTMLElement | null)[]>(Array(CARD_COUNT).fill(null))
const glowA = ref<HTMLElement | null>(null)
const glowB = ref<HTMLElement | null>(null)
const perfPanel = ref<HTMLElement | null>(null)
const fpsEl = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)

const cleanupFns: TweenCleanup[] = []

// ═══════════════════════ 入场 ═══════════════════════
function setupEntrance() {
  if (!scrollRef.value || !headerRef.value) return
  const scroller = scrollRef.value
  const chars = [tc1.value, tc2.value, tc3.value, tc4.value].filter(Boolean)
  const tl = gsap.timeline({
    scrollTrigger: { trigger: scrollRef.value, scroller, start: 'top 75%', toggleActions: 'play none none reverse' },
  })
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.75, ease: 'power3.out' })
    .fromTo(chars, { autoAlpha: 0, z: -200, scale: 0.4, filter: 'blur(8px)' }, { autoAlpha: 1, z: 0, scale: 1, filter: 'blur(0px)', duration: 0.55, stagger: 0.07, ease: 'back.out(1.6)' }, '-=0.3')
    .fromTo(dividerRef.value, { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: 'power3.inOut' }, '-=0.15')
    .fromTo(subRef.value, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.08')
    .fromTo(sceneRef.value, { autoAlpha: 0, scale: 0.92 }, { autoAlpha: 1, scale: 1, duration: 0.8, ease: 'power3.out' }, '-=0.25')
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

// ═══════════════════════ 光环旋转 ═══════════════════════
function setupRing() {
  if (!scrollRef.value || !trackRef.value || !ringRef.value) return
  const scroller = scrollRef.value; const track = trackRef.value; const ring = ringRef.value

  gsap.set(ring, { rotateY: 0 })

  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.2,
    },
  })

  // 完整旋转 + 轻微上下浮动
  master.to(ring, { rotateY: 360, duration: cfg.duration, ease: 'none' }, 0)
  // 微浮动增加动态感
  master.to(ring, { rotateX: 6, duration: cfg.duration * 0.25, ease: 'sine.inOut' }, 0)
  master.to(ring, { rotateX: -4, duration: cfg.duration * 0.5, ease: 'sine.inOut' }, cfg.duration * 0.25)
  master.to(ring, { rotateX: 0, duration: cfg.duration * 0.25, ease: 'sine.inOut' }, cfg.duration * 0.75)

  if (glowA.value) master.to(glowA.value, { x: '5vw', y: '-3vh', duration: cfg.duration }, 0)
  if (glowB.value) master.to(glowB.value, { x: '-3vw', y: '4vh', duration: cfg.duration }, 0)
  if (progRef.value) master.to(progRef.value, { width: '100%', duration: cfg.duration }, 0)

  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

// ═══════════════════════ FPS 监测 ═══════════════════════
let fpsFrames = 0; let fpsLastTime = performance.now(); let fpsRaf = 0
function fpsLoop() {
  fpsFrames++
  const now = performance.now()
  if (now - fpsLastTime >= 1000) {
    const fps = Math.round(fpsFrames / ((now - fpsLastTime) / 1000))
    if (fpsEl.value) {
      fpsEl.value.textContent = `${fps} FPS`
      fpsEl.value.style.color = fps >= 55 ? '#4eca80' : fps >= 30 ? '#f0c060' : '#f06060'
    }
    fpsFrames = 0; fpsLastTime = now
  }
  fpsRaf = requestAnimationFrame(fpsLoop)
}

// 🔑 自适应透视 (响应式调整)
function adaptPerspective() {
  const w = window.innerWidth
  if (w < 480)      cfg.perspective = 500
  else if (w < 768)  cfg.perspective = 700
  else if (w < 1024) cfg.perspective = 900
  else               cfg.perspective = 1100

  // 同步调整半径
  cfg.radius = Math.round(cfg.perspective * 0.31)
  ScrollTrigger.refresh(true)
}

function handleResize() { adaptPerspective() }

onMounted(() => {
  adaptPerspective()
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupRing() }))
  window.addEventListener('resize', handleResize)
  fpsRaf = requestAnimationFrame(fpsLoop)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  cancelAnimationFrame(fpsRaf)
  ScrollTrigger.getAll().forEach(st => st.kill())

  // 🔑 释放GPU资源 — 移除will-change
  cardRefs.value.forEach(el => { if (el) el.style.willChange = 'auto' })
  if (ringRef.value) ringRef.value.style.willChange = 'auto'

  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0
})
</script>

<style scoped lang="scss">
/* ═══════════════════════ 场景配置 (CSS变量全局管理) ═══════════════════════ */
/*
  🔑 所有场景参数通过CSS变量集中管理：
  --pr-perspective  : 透视强度 (JS响应式注入)
  --pr-radius       : 环形半径
  --pr-card-w/h     : 卡片尺寸
  --pr-bg           : 背景色

  一处修改，全局生效。JS可通过 rootRef.style.setProperty() 实时调整。
*/

.pr-root {
  --pr-perspective: 1100px;
  --pr-radius: 340px;
  --pr-card-w: 280px;
  --pr-card-h: 200px;
  --pr-bg: #0a0812;

  position: relative; width: 100vw; height: 100vh; overflow: hidden;
  background: radial-gradient(ellipse 55% 45% at 50% 45%, #100e18 0%, var(--pr-bg) 55%, #040308 100%);
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif;
}

/* ── 环境光 ── */
.pr-glow { position: absolute; border-radius: 50%; filter: blur(65px); pointer-events: none; z-index: 0; }
.pr-glow--a { width: 30vw; height: 30vw; top: -5vh; left: -3vw; background: radial-gradient(circle, rgba(60,160,220,.12) 0%, transparent 70%); will-change: transform; }
.pr-glow--b { width: 26vw; height: 26vw; bottom: -4vh; right: -2vw; background: radial-gradient(circle, rgba(140,100,200,.1) 0%, transparent 70%); will-change: transform; }

/* ── 滚动 ── */
.pr-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 5;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(80,180,220,.12); }
}
.pr-track { position: relative; width: 100%; }
.pr-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

/* ── 标题 ── */
.pr-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 35; text-align: center; width: min(92vw, 800px); pointer-events: none; }
.pr-kicker { display: inline-block; font-size: .56rem; font-weight: 700; letter-spacing: .24em; color: rgba(80,180,220,.65); background: rgba(60,160,220,.05); backdrop-filter: blur(8px); border: 1px solid rgba(60,160,220,.12); border-radius: 999px; padding: .2rem 1rem; margin-bottom: .48rem; }
.pr-title { margin: 0; display: flex; justify-content: center; gap: .06em; }
.pr-title__c { display: inline-block; font-size: clamp(2rem, 5.5vw, 4.4rem); font-weight: 900; color: #68b8d8; will-change: transform, opacity, filter;
  &--perf {
    background: linear-gradient(150deg, #38c0e0 0%, #68e0f0 25%, #9050e0 55%, #b870f0 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    filter: drop-shadow(0 2px 10px rgba(60,200,230,.5));
  }
}
.pr-divider { width: 110px; height: 2px; margin: .4rem auto .5rem; border-radius: 2px; background: linear-gradient(90deg, transparent, #38c0e0, #9050e0, #38c0e0, transparent); transform-origin: center; }
.pr-sub { margin: 0; font-size: clamp(.62rem, 1vw, .78rem); color: rgba(80,170,200,.35); max-width: 520px; margin-inline: auto; }

/* ═══════════════════════ 🔑 CSS3 3D 场景 (CSS变量驱动) ═══════════════════════ */
.pr-scene {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 0; height: 0; z-index: 10;
  perspective: var(--pr-perspective);           // 🔑 CSS变量: 透视强度
  perspective-origin: 50% 45%;
  will-change: transform;
}

/* 🔑 3D 光环 */
.pr-ring {
  position: absolute; width: 0; height: 0;
  transform-style: preserve-3d;
  will-change: transform;                        // 🔑 GPU加速
}

/* ═══════════════════════ 🔑 性能优化卡片 ═══════════════════════ */
.pr-card {
  position: absolute;
  // 🔑 CSS变量驱动尺寸
  width: var(--pr-card-w);
  height: var(--pr-card-h);
  margin-left: calc(var(--pr-card-w) / -2);
  margin-top: calc(var(--pr-card-h) / -2);
  transform-style: preserve-3d;
  will-change: transform;                        // 🔑 GPU加速图层提升
  border-radius: 10px;
}

/* 🔑 卡片正面 */
.pr-card__face {
  position: absolute; inset: 0; border-radius: 10px; overflow: hidden;
  backface-visibility: hidden;                   // 🔑 防闪烁: 隐藏背面
  -webkit-backface-visibility: hidden;           // Safari兼容
  box-shadow: 0 8px 32px rgba(0,0,0,.35), 0 0 0 1px rgba(255,255,255,.05);
  will-change: transform;                        // 🔑 GPU加速
}
.pr-card__img { width: 100%; height: 100%; object-fit: cover; display: block; }
.pr-card__overlay {
  position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(160deg, rgba(255,255,255,.06) 0%, transparent 40%, rgba(0,0,0,.1) 100%);
}

/* 🔑 卡片背面覆盖层 — 彻底防止镜像穿透 */
.pr-card__back {
  position: absolute; inset: 0; border-radius: 10px;
  backface-visibility: hidden;                   // 🔑 防闪烁
  -webkit-backface-visibility: hidden;
  background: #0a0812;
  transform: rotateY(180deg);                    // 背面朝向
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.03);
}

.pr-card__tag {
  position: absolute; bottom: -22px; left: 50%; transform: translateX(-50%); z-index: 2;
  font-size: .54rem; font-weight: 700; letter-spacing: .2em; white-space: nowrap;
  color: rgba(80,180,220,.55); font-family: 'Courier New', monospace;
  background: rgba(8,6,16,.55); backdrop-filter: blur(6px);
  border-radius: 999px; padding: .1rem .65rem;
  border: 1px solid rgba(60,160,220,.1);
}

/* ── 性能面板 ── */
.pr-perf { position: absolute; bottom: 10vh; left: 50%; transform: translateX(-50%); z-index: 30; pointer-events: none; display: flex; align-items: center; gap: .5rem; opacity: .7; }
.pr-perf__fps { font-size: .72rem; font-weight: 900; font-family: 'Courier New', monospace; color: #4eca80; background: rgba(8,6,16,.6); backdrop-filter: blur(8px); border-radius: 6px; padding: .15rem .55rem; border: 1px solid rgba(78,202,128,.15); }
.pr-perf__label { font-size: .56rem; font-weight: 600; letter-spacing: .12em; color: rgba(80,180,220,.5); font-family: 'Courier New', monospace; }

.pr-progress { position: absolute; left: 0; bottom: 0; z-index: 35; width: 100%; height: 2px; background: rgba(60,160,220,.03); }
.pr-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #38c0e0, #9050e0, #38c0e0); box-shadow: 0 0 6px rgba(60,200,230,.25); }

/* ═══════════════════════ 响应式: CSS变量自动调整 ═══════════════════════ */
/*
  🔑 响应式不需要修改任何CSS规则 — 只需JS更新CSS变量值
  cfg.perspective 改变 → --pr-perspective 改变 → 全局生效
  cfg.radius 改变 → --pr-radius 改变 → 所有卡片位置更新
*/
@media (max-width: 768px) {
  .pr-header { top: 2vh; } .pr-kicker { font-size: .42rem; } .pr-title__c { font-size: 1.4rem; }
  .pr-perf__fps { font-size: .6rem; } .pr-perf__label { font-size: .48rem; }
}
</style>
