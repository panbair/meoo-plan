<template>
  <section ref="rootRef" class="tc-root">
    <div ref="glowA" class="tc-glow tc-glow--a"></div>
    <div ref="glowB" class="tc-glow tc-glow--b"></div>

    <div ref="scrollRef" class="tc-scroll">
      <div ref="trackRef" class="tc-track" :style="{ height: trackHeight }">
        <div class="tc-sticky">

          <header ref="headerRef" class="tc-header">
            <span class="tc-kicker">◈ CSS 3D 拟物化 · 物理按压交互 ◈</span>
            <h1 class="tc-title">
              <span ref="tc1" class="tc-title__c">物</span>
              <span ref="tc2" class="tc-title__c tc-title__c--press">理</span>
              <span ref="tc3" class="tc-title__c">按</span>
              <span ref="tc4" class="tc-title__c tc-title__c--press">压</span>
            </h1>
            <div ref="dividerRef" class="tc-divider"></div>
            <p ref="subRef" class="tc-sub">
              向下滚动 · hover/active 3D按压 · translateZ+box-shadow同步 · 比真实按钮更逼真
            </p>
          </header>

          <!-- ════════════════ 3D 场景 ════════════════ -->
          <div ref="sceneRef" class="tc-scene">
            <div ref="stageRef" class="tc-stage">

              <!-- 🔑 6个物理按压卡片 -->
              <div
                v-for="(card, i) in cards"
                :key="card.id"
                :ref="el => { cardRefs[i] = el as HTMLElement | null }"
                class="tc-card"
                :class="[`tc-card--${card.shadowTone}`]"
                :style="card.baseStyle"
                @mousedown="onPress(i, $event)"
                @mouseup="onRelease(i)"
                @mouseleave="onRelease(i)"
                @touchstart.prevent="onPress(i, $event)"
                @touchend="onRelease(i)"
              >
                <!-- 🔑 3D按钮体 — translateZ + 多层阴影堆叠厚度 -->
                <div
                  :ref="el => { btnRefs[i] = el as HTMLElement | null }"
                  class="tc-btn"
                >
                  <img :src="card.url" :alt="card.label" class="tc-btn__img" loading="lazy" />
                  <!-- 表面微纹理 -->
                  <div class="tc-btn__texture"></div>
                </div>
                <!-- 标签 -->
                <span class="tc-card__label">{{ card.label }}</span>
              </div>

            </div>
          </div>

          <div ref="statusBar" class="tc-status">
            <span class="tc-status__dot" :class="{ 'tc-status__dot--active': pressedIndex >= 0 }"></span>
            <span class="tc-status__text">
              {{ pressedIndex >= 0 ? `按压中: ${cards[pressedIndex]?.label}` : '悬停或点击卡片体验物理按压' }}
            </span>
          </div>

          <div class="tc-progress"><div ref="progRef" class="tc-progress__fill"></div></div>
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
//  CardImage3DTactile — CSS 3D 拟物化 · 物理按压交互
//
//  核心：translate3d + 多层box-shadow同步 → 比真实按钮更逼真
//
//  物理按压技术栈:
//  1. 🔑 多层box-shadow — 默认状态"堆叠"出Z轴厚度
//     · 紧贴阴影 (1px blur) → 锐利接触面
//     · 中层阴影 (4px blur) → 过渡区
//     · 远层阴影 (12px blur) → 环境光遮蔽
//     · 扩散阴影 (24px blur) → 柔光扩散
//  2. 🔑 :active时translateZ(-6px) — 真实"陷"入3D空间
//  3. 🔑 阴影同步压缩 — blur/offset减半模拟接触面增大
//  4. 🔑 transition cubic-bezier — 模拟物理阻尼
//  5. GSAP增强 — 点击时弹性反馈
//  6. 7层box-shadow × 按压/悬停/默认 三态
//
//  设计风格：暖色拟物 · 物理触感 · 微交互
// ═══════════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

interface CardData {
  id: number; label: string; url: string
  baseStyle: Record<string, string>
  shadowTone: string // warm | cool | neutral
}

const cards: CardData[] = [
  { id: 0, label: 'DEEP.PRESS',  url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=80', baseStyle: { transform: 'translateY(-20vh) translateX(-18vw) translateZ(-60px)' }, shadowTone: 'warm' },
  { id: 1, label: 'SOFT.TOUCH',  url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&q=80', baseStyle: { transform: 'translateY(-12vh) translateX(16vw) translateZ(-20px)' }, shadowTone: 'cool' },
  { id: 2, label: 'CLICK.FEEL',  url: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=500&q=80', baseStyle: { transform: 'translateY(2vh) translateX(-20vw) translateZ(20px)' },  shadowTone: 'neutral' },
  { id: 3, label: 'TAP.RESPOND', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&q=80', baseStyle: { transform: 'translateY(8vh) translateX(14vw) translateZ(50px)' },  shadowTone: 'warm' },
  { id: 4, label: 'PUSH.SENSE',  url: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=500&q=80', baseStyle: { transform: 'translateY(18vh) translateX(-12vw) translateZ(80px)' }, shadowTone: 'cool' },
  { id: 5, label: 'HOLD.FIRM',   url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=500&q=80', baseStyle: { transform: 'translateY(24vh) translateX(8vw) translateZ(100px)' }, shadowTone: 'neutral' },
]

const CARD_COUNT = cards.length
const STAGES = 4
const trackHeight = `${(STAGES + 1) * 100}vh`

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
const cardRefs = ref<(HTMLElement | null)[]>(Array(CARD_COUNT).fill(null))
const btnRefs = ref<(HTMLElement | null)[]>(Array(CARD_COUNT).fill(null))
const glowA = ref<HTMLElement | null>(null)
const glowB = ref<HTMLElement | null>(null)
const statusBar = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)

const pressedIndex = ref(-1)
const cleanupFns: TweenCleanup[] = []
let pressTimers: number[] = []

// ═══════════════════════ 🔑 按压处理 ═══════════════════════
function onPress(i: number, _e: Event) {
  pressedIndex.value = i
  const btn = btnRefs.value[i]
  if (!btn) return

  // 🔑 GSAP 增强按压 → 弹性"陷"入
  gsap.to(btn, {
    translateZ: -8,  // 🔑 真实3D凹陷
    duration: 0.12,
    ease: 'power2.in', // 快速按下
    overwrite: 'auto',
  })
}

function onRelease(i: number) {
  if (pressedIndex.value !== i) return
  pressedIndex.value = -1
  const btn = btnRefs.value[i]
  if (!btn) return

  // 🔑 弹性回弹 → 比真实按钮更Q弹
  gsap.to(btn, {
    translateZ: 0,
    duration: 0.35,
    ease: 'back.out(1.8)', // 超调回弹
    overwrite: 'auto',
  })
}

// ═══════════════════════ 入场 ═══════════════════════
function setupEntrance() {
  if (!scrollRef.value || !headerRef.value) return
  const scroller = scrollRef.value
  const chars = [tc1.value, tc2.value, tc3.value, tc4.value].filter(Boolean)
  const tl = gsap.timeline({ scrollTrigger: { trigger: scrollRef.value, scroller, start: 'top 75%', toggleActions: 'play none none reverse' } })
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: .7, ease: 'power3.out' })
    .fromTo(chars, { autoAlpha: 0, z: -150, scale: .4 }, { autoAlpha: 1, z: 0, scale: 1, duration: .5, stagger: .07, ease: 'back.out(1.5)' }, '-=.3')
    .fromTo(dividerRef.value, { scaleX: 0 }, { scaleX: 1, duration: .4, ease: 'power3.inOut' }, '-=.12')
    .fromTo(subRef.value, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .45, ease: 'power2.out' }, '-=.06')
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

// ═══════════════════════ 场景旋转 ═══════════════════════
function setupSceneRotation() {
  if (!scrollRef.value || !trackRef.value || !stageRef.value) return
  const scroller = scrollRef.value; const track = trackRef.value; const stage = stageRef.value
  const D = STAGES
  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.3 },
  })
  master.to(stage, { rotateX: 15, rotateY: -10, duration: D * .45 }, 0)
  master.to(stage, { rotateX: -10, rotateY: 8, duration: D * .45 }, D * .4)
  master.to(stage, { rotateX: 0, rotateY: 0, duration: D * .2 }, D * .8)
  if (glowA.value) master.to(glowA.value, { x: '4vw', y: '-2vh', duration: D }, 0)
  if (progRef.value) master.to(progRef.value, { width: '100%', duration: D }, 0)
  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }

onMounted(() => {
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupSceneRotation() }))
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  pressTimers.forEach(clearTimeout)
  ScrollTrigger.getAll().forEach(st => st.kill())
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0
})
</script>

<style scoped lang="scss">
/* ═══════════════════════ 拟物空间 ═══════════════════════ */
.tc-root {
  position: relative; width: 100vw; height: 100vh; overflow: hidden;
  background: linear-gradient(170deg, #faf6f0 0%, #f5f0e8 30%, #f8f4ec 60%, #f3efe4 100%);
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif;
  user-select: none; -webkit-user-select: none;
}

.tc-glow { position: absolute; border-radius: 50%; filter: blur(55px); pointer-events: none; will-change: transform; z-index: 0; }
.tc-glow--a { width: 28vw; height: 28vw; top: -5vh; left: -3vw; background: radial-gradient(circle, rgba(200,160,120,.1) 0%, transparent 70%); }
.tc-glow--b { width: 24vw; height: 24vw; bottom: -4vh; right: -2vw; background: radial-gradient(circle, rgba(160,140,200,.08) 0%, transparent 70%); }

.tc-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 5;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(180,140,100,.1); }
}
.tc-track { position: relative; width: 100%; }
.tc-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

.tc-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 40; text-align: center; width: min(92vw, 800px); pointer-events: none; }
.tc-kicker { display: inline-block; font-size: .54rem; font-weight: 700; letter-spacing: .22em; color: rgba(160,120,80,.6); background: rgba(200,150,100,.05); backdrop-filter: blur(8px); border: 1px solid rgba(180,130,90,.1); border-radius: 999px; padding: .16rem .85rem; margin-bottom: .45rem; }
.tc-title { margin: 0; display: flex; justify-content: center; gap: .06em; }
.tc-title__c { display: inline-block; font-size: clamp(2rem, 5.5vw, 4.2rem); font-weight: 900; color: #c8a070;
  &--press { background: linear-gradient(150deg, #d4a870 0%, #e8c090 25%, #c09060 55%, #e0b880 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 2px 6px rgba(200,150,100,.35)); }
}
.tc-divider { width: 100px; height: 2px; margin: .35rem auto .45rem; background: linear-gradient(90deg, transparent, #d4a870, #c09060, #d4a870, transparent); }
.tc-sub { margin: 0; font-size: clamp(.56rem, 1vw, .7rem); color: rgba(160,120,80,.3); max-width: 500px; margin-inline: auto; }

/* ═══════════════════════ 3D 场景 ═══════════════════════ */
.tc-scene {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 0; height: 0; z-index: 10;
  perspective: 900px;
  perspective-origin: 50% 48%;
}
.tc-stage { position: absolute; width: 0; height: 0; transform-style: preserve-3d; will-change: transform; }

/* ═══════════════════════ 卡片容器 ═══════════════════════ */
.tc-card {
  position: absolute; transform-style: preserve-3d;
}
.tc-card__label {
  position: absolute; bottom: -18px; left: 50%; transform: translateX(-50%);
  font-size: .46rem; font-weight: 700; letter-spacing: .16em; white-space: nowrap;
  color: rgba(140,100,60,.45); font-family: 'Courier New', monospace;
}

/* ═══════════════════════ 🔑 3D按钮 — 多层阴影堆叠厚度 ═══════════════════════ */
.tc-btn {
  position: absolute;
  width: min(24vw, 180px); height: min(16vw, 120px);
  margin-left: calc(min(24vw, 180px) / -2);
  margin-top: calc(min(16vw, 120px) / -2);
  border-radius: 10px; overflow: hidden; cursor: pointer;
  transform-style: preserve-3d;
  will-change: transform, box-shadow;

  // 🔑 GSAP控制translateZ (0 → -8px 按压)
  transform: translateZ(0);

  // 🔑 transition — 按压回弹的物理阻尼
  transition: box-shadow 0.15s ease-out;
}

.tc-btn__img { width: 100%; height: 100%; object-fit: cover; display: block; }
.tc-btn__texture {
  position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(150deg, rgba(255,255,255,.06) 0%, transparent 35%, rgba(0,0,0,.04) 65%, rgba(0,0,0,.08) 100%);
}

/* ═══════════════ 🔑 三种色调的7层box-shadow ═══════════════ */
/*
  阴影层次 (从近到远):
  L1: 0 1px 2px   — 紧贴接触面 (锐利)
  L2: 0 2px 4px   — 近层过渡
  L3: 0 4px 8px   — 中层
  L4: 0 6px 12px  — 中远层
  L5: 0 10px 20px — 远层扩散
  L6: 0 16px 32px — 环境光遮蔽
  L7: 0 24px 48px — 柔光扩散 (最远)
*/

/* 暖色调 */
.tc-card--warm .tc-btn {
  box-shadow:
    0 1px 2px rgba(120,60,20,.15),   inset 0 1px 0 rgba(255,255,255,.25),
    0 2px 4px rgba(120,60,20,.12),
    0 4px 8px rgba(120,60,20,.1),
    0 6px 12px rgba(120,60,20,.07),
    0 10px 20px rgba(120,60,20,.05),
    0 16px 32px rgba(100,50,15,.04),
    0 24px 48px rgba(100,50,15,.02);

  // 🔑 :hover — 微微浮起
  &:hover {
    box-shadow:
      0 2px 4px rgba(120,60,20,.18),   inset 0 1px 0 rgba(255,255,255,.3),
      0 4px 8px rgba(120,60,20,.14),
      0 8px 16px rgba(120,60,20,.1),
      0 12px 24px rgba(120,60,20,.08),
      0 20px 40px rgba(120,60,20,.06),
      0 30px 60px rgba(100,50,15,.05),
      0 40px 80px rgba(100,50,15,.03);
  }

  // 🔑 :active — 阴影压缩 (偏移减半 + 模糊减半)
  &:active {
    box-shadow:
      0 0px 1px rgba(120,60,20,.2),    inset 0 -1px 0 rgba(0,0,0,.08),
      0 1px 2px rgba(120,60,20,.15),
      0 2px 4px rgba(120,60,20,.1),
      0 3px 6px rgba(120,60,20,.05),
      0 5px 10px rgba(100,50,15,.03);
    transition: box-shadow 0.05s ease-in; // 按下极快
  }
}

/* 冷色调 */
.tc-card--cool .tc-btn {
  box-shadow:
    0 1px 2px rgba(40,60,120,.15),   inset 0 1px 0 rgba(255,255,255,.25),
    0 2px 4px rgba(40,60,120,.12),
    0 4px 8px rgba(40,60,120,.1),
    0 6px 12px rgba(40,60,120,.07),
    0 10px 20px rgba(40,60,120,.05),
    0 16px 32px rgba(30,50,100,.04),
    0 24px 48px rgba(30,50,100,.02);
  &:hover {
    box-shadow:
      0 2px 4px rgba(40,60,120,.18),   inset 0 1px 0 rgba(255,255,255,.3),
      0 4px 8px rgba(40,60,120,.14),   0 8px 16px rgba(40,60,120,.1),
      0 12px 24px rgba(40,60,120,.08), 0 20px 40px rgba(40,60,120,.06),
      0 30px 60px rgba(30,50,100,.05), 0 40px 80px rgba(30,50,100,.03);
  }
  &:active {
    box-shadow:
      0 0px 1px rgba(40,60,120,.2),  inset 0 -1px 0 rgba(0,0,0,.08),
      0 1px 2px rgba(40,60,120,.15), 0 2px 4px rgba(40,60,120,.1),
      0 3px 6px rgba(40,60,120,.05), 0 5px 10px rgba(30,50,100,.03);
    transition: box-shadow 0.05s ease-in;
  }
}

/* 中性色调 */
.tc-card--neutral .tc-btn {
  box-shadow:
    0 1px 2px rgba(60,50,40,.15),   inset 0 1px 0 rgba(255,255,255,.25),
    0 2px 4px rgba(60,50,40,.12),
    0 4px 8px rgba(60,50,40,.1),
    0 6px 12px rgba(60,50,40,.07),
    0 10px 20px rgba(60,50,40,.05),
    0 16px 32px rgba(50,40,30,.04),
    0 24px 48px rgba(50,40,30,.02);
  &:hover {
    box-shadow:
      0 2px 4px rgba(60,50,40,.18),   inset 0 1px 0 rgba(255,255,255,.3),
      0 4px 8px rgba(60,50,40,.14),   0 8px 16px rgba(60,50,40,.1),
      0 12px 24px rgba(60,50,40,.08), 0 20px 40px rgba(60,50,40,.06),
      0 30px 60px rgba(50,40,30,.05), 0 40px 80px rgba(50,40,30,.03);
  }
  &:active {
    box-shadow:
      0 0px 1px rgba(60,50,40,.2),  inset 0 -1px 0 rgba(0,0,0,.08),
      0 1px 2px rgba(60,50,40,.15), 0 2px 4px rgba(60,50,40,.1),
      0 3px 6px rgba(60,50,40,.05), 0 5px 10px rgba(50,40,30,.03);
    transition: box-shadow 0.05s ease-in;
  }
}

/* ── 状态栏 ── */
.tc-status { position: absolute; bottom: 10vh; left: 50%; transform: translateX(-50%); z-index: 35; pointer-events: none; display: flex; align-items: center; gap: .4rem; }
.tc-status__dot { width: 7px; height: 7px; border-radius: 50%; background: rgba(160,120,80,.4); transition: all .2s ease; }
.tc-status__dot--active { background: #e06040; box-shadow: 0 0 10px rgba(220,80,50,.5); transform: scale(1.4); }
.tc-status__text { font-size: .52rem; font-weight: 600; letter-spacing: .1em; color: rgba(140,100,60,.5); font-family: 'Courier New', monospace; }

.tc-progress { position: absolute; left: 0; bottom: 0; z-index: 40; width: 100%; height: 2px; background: rgba(180,130,90,.03); }
.tc-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #d4a870, #c09060, #d4a870); }

@media (max-width: 768px) {
  .tc-header { top: 2vh; } .tc-kicker { font-size: .36rem; } .tc-title__c { font-size: 1.4rem; }
  .tc-btn { width: 32vw; height: 22vw; margin-left: -16vw; margin-top: -11vw; }
}
</style>
