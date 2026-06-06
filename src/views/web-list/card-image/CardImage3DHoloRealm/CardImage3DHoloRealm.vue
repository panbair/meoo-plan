<template>
  <section ref="rootRef" class="holo-root">
    <!-- 全息网格背景 -->
    <div class="holo-grid-bg"></div>
    <div ref="scanLineRef" class="holo-scan-line"></div>

    <!-- 环境光 -->
    <div ref="glowA" class="holo-glow holo-glow--a"></div>
    <div ref="glowB" class="holo-glow holo-glow--b"></div>

    <!-- 滚动容器 -->
    <div ref="scrollRef" class="holo-scroll">
      <div ref="trackRef" class="holo-track" :style="{ height: trackHeight }">
        <div class="holo-sticky">

          <!-- 标题 — 全息霓虹风格 -->
          <header ref="headerRef" class="holo-header">
            <span class="holo-kicker">◈ CSS3 3D · 全息投影 · 玻璃拟态 ◈</span>
            <h1 class="holo-title">
              <span ref="tc1" class="holo-title__c">全</span>
              <span ref="tc2" class="holo-title__c holo-title__c--holo">息</span>
              <span ref="tc3" class="holo-title__c">幻</span>
              <span ref="tc4" class="holo-title__c holo-title__c--holo">境</span>
            </h1>
            <div ref="dividerRef" class="holo-divider"></div>
            <p ref="subRef" class="holo-sub">
              向下滚动 · mix-blend-mode:screen 全息投影 · 赛博朋克幻境
            </p>
          </header>

          <!-- ════════════════ CSS3 3D 全息场景 ════════════════ -->
          <div ref="sceneRef" class="holo-scene">
            <div ref="holoStage" class="holo-stage">

              <!-- 全息投影卡片 — 使用 screen 混合模式 -->
              <div
                v-for="(card, i) in holoCards"
                :key="card.id"
                :ref="el => { cardRefs[i] = el as HTMLElement | null }"
                class="holo-card"
                :style="{ transform: card.baseTransform }"
              >
                <!-- 全息图像层 (screen 混合) -->
                <div class="holo-card__projection">
                  <img :src="card.image" :alt="card.label" class="holo-card__img" loading="lazy" />
                  <!-- 全息色彩偏移层 -->
                  <div class="holo-card__chroma holo-card__chroma--cyan"></div>
                  <div class="holo-card__chroma holo-card__chroma--magenta"></div>
                  <!-- 扫描线 -->
                  <div class="holo-card__scanlines"></div>
                  <!-- 闪烁线 -->
                  <div class="holo-card__flicker"></div>
                </div>
                <!-- 全息边框 (渐变发光) -->
                <div class="holo-card__border"></div>
                <!-- 全息光柱 -->
                <div class="holo-card__beam"></div>
                <!-- 数据标签 -->
                <span class="holo-card__tag">{{ card.label }}</span>
              </div>

              <!-- 玻璃拟态面板 (backdrop-filter) -->
              <div ref="glassPanelA" class="holo-glass holo-glass--left">
                <div class="holo-glass__content">
                  <span class="holo-glass__icon">⬡</span>
                  <span class="holo-glass__label">SYSTEM.ONLINE</span>
                </div>
              </div>
              <div ref="glassPanelB" class="holo-glass holo-glass--right">
                <div class="holo-glass__content">
                  <span class="holo-glass__icon">◈</span>
                  <span class="holo-glass__label">HOLO.ACTIVE</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 数据流指示器 -->
          <div ref="dataStream" class="holo-data-stream">
            <span class="holo-data-stream__char" v-for="c in dataStreamChars" :key="c.id">{{ c.char }}</span>
          </div>

          <div class="holo-progress"><div ref="progRef" class="holo-progress__fill"></div></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, reactive } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

// ═══════════════════════════════════════════════════════════════════════
//  CardImage3DHoloRealm — CSS3 3D 全息投影幻境 · 玻璃拟态
//
//  核心创新：mix-blend-mode + semi-transparency + glass morphism
//
//  全息投影技术栈：
//  1. mix-blend-mode: screen — 全息图像在黑色背景上的发光投影
//  2. mix-blend-mode: overlay — 增强全息对比度和光感
//  3. filter: hue-rotate() — 全息色彩偏移（青/品红双色）
//  4. backdrop-filter: blur() — 玻璃拟态面板
//  5. CSS @keyframes — 扫描线/闪烁/色彩偏移动画
//  6. 半透明渐变边框 — 全息发光边框
//  7. text-shadow 多层霓虹 — 全息文字发光
//  8. 3D transform — 全息卡片在空间中浮动排列
//  9. 数据流粒子 — 赛博朋克风格装饰
//
//  设计风格：赛博朋克 · 黑底青品红全息 · 玻璃拟态UI
// ═══════════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

interface HoloCard {
  id: number
  label: string
  image: string
  baseTransform: string
  chromaHue: number // 色相偏移角度
}

const holoCards: HoloCard[] = [
  {
    id: 0, label: 'CYBER.GATE', chromaHue: 180, // 青色
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    baseTransform: 'translateZ(-180px) translateY(-18vh) rotateX(5deg)',
  },
  {
    id: 1, label: 'NEON.GRID', chromaHue: 300, // 品红
    image: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=800&q=80',
    baseTransform: 'translateZ(-60px) translateY(-5vh) rotateX(3deg)',
  },
  {
    id: 2, label: 'DATA.VAULT', chromaHue: 190, // 青蓝
    image: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=800&q=80',
    baseTransform: 'translateZ(40px) translateY(5vh) rotateX(-2deg)',
  },
  {
    id: 3, label: 'HOLO.CORE', chromaHue: 280, // 紫品红
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
    baseTransform: 'translateZ(160px) translateY(16vh) rotateX(-5deg)',
  },
]

const CARD_COUNT = holoCards.length
const trackHeight = `${(CARD_COUNT + 2) * 100}vh` // 600vh

// 数据流字符
interface StreamChar { id: number; char: string }
function genDataStream(count: number): StreamChar[] {
  const chars = '01アイウエオカキクケコ△▽◈◇◆⬡⬢⬣◉◎●○◐◑◒◓◔◕'
  const hash = (s: number) => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x) }
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    char: chars[Math.floor(hash(i * 7 + 3) * chars.length)],
  }))
}
const dataStreamChars = reactive(genDataStream(40))

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
const holoStage = ref<HTMLElement | null>(null)
const cardRefs = ref<(HTMLElement | null)[]>(Array(CARD_COUNT).fill(null))
const glassPanelA = ref<HTMLElement | null>(null)
const glassPanelB = ref<HTMLElement | null>(null)
const scanLineRef = ref<HTMLElement | null>(null)
const glowA = ref<HTMLElement | null>(null)
const glowB = ref<HTMLElement | null>(null)
const dataStream = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)

const cleanupFns: TweenCleanup[] = []

// ═══════════════════════ 入场动画 ═══════════════════════
function setupEntrance() {
  if (!scrollRef.value || !headerRef.value) return
  const scroller = scrollRef.value
  const chars = [tc1.value, tc2.value, tc3.value, tc4.value].filter(Boolean)

  const tl = gsap.timeline({
    scrollTrigger: { trigger: scrollRef.value, scroller, start: 'top 75%', toggleActions: 'play none none reverse' },
  })
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out' })
    // 全息字符从不同方向飞入
    .fromTo([tc1.value, tc3.value], { autoAlpha: 0, x: -80, filter: 'blur(10px) hue-rotate(90deg)' }, { autoAlpha: 1, x: 0, filter: 'blur(0px) hue-rotate(0deg)', duration: 0.7, stagger: 0.12, ease: 'power3.out' }, '-=0.35')
    .fromTo([tc2.value, tc4.value], { autoAlpha: 0, x: 80, filter: 'blur(10px) hue-rotate(-90deg)' }, { autoAlpha: 1, x: 0, filter: 'blur(0px) hue-rotate(0deg)', duration: 0.7, stagger: 0.12, ease: 'power3.out' }, '-=0.6')
    .fromTo(dividerRef.value, { scaleX: 0, autoAlpha: 0 }, { scaleX: 1, autoAlpha: 1, duration: 0.5, ease: 'power3.inOut' }, '-=0.2')
    .fromTo(subRef.value, { autoAlpha: 0, y: 10, filter: 'blur(4px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.6, ease: 'power2.out' }, '-=0.1')
    // 场景从透明中浮现
    .fromTo(sceneRef.value, { autoAlpha: 0, scale: 0.95, filter: 'brightness(3) blur(8px)' }, { autoAlpha: 1, scale: 1, filter: 'brightness(1) blur(0px)', duration: 1.0, ease: 'power3.out' }, '-=0.3')
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

// ═══════════════════════ 全息3D滚动 ═══════════════════════
function setupHoloScroll() {
  if (!scrollRef.value || !trackRef.value || !holoStage.value) return
  const scroller = scrollRef.value; const track = trackRef.value; const stage = holoStage.value

  gsap.set(stage, { rotateX: 0, rotateY: 0 })

  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.5,
    },
  })

  const D = CARD_COUNT

  // ── Stage 0→1: 远景全息浮现 ──
  // 场景微微前倾，远景卡片进入视野
  master.to(stage, { rotateX: -8, rotateY: 5, duration: 0.8, ease: 'power2.inOut' }, 0)
  master.to(cardRefs.value[0], { translateZ: -120, filter: 'hue-rotate(20deg) brightness(1.3)', duration: 0.8 }, 0)
  master.to(cardRefs.value[1], { filter: 'hue-rotate(15deg) brightness(1.15)', duration: 0.8 }, 0)

  // ── Stage 1→2: 中景全息激活 ──
  master.to(stage, { rotateX: -4, rotateY: -8, duration: 0.8, ease: 'power2.inOut' }, 1)
  master.to(cardRefs.value[1], { translateZ: 0, filter: 'hue-rotate(-10deg) brightness(1.4)', duration: 0.8 }, 1)
  master.to(cardRefs.value[2], { filter: 'hue-rotate(-20deg) brightness(1.25)', duration: 0.8 }, 1)
  // 玻璃面板A淡入
  master.to(glassPanelA.value, { autoAlpha: 0.85, x: 0, duration: 0.6, ease: 'power2.out' }, 1.2)

  // ── Stage 2→3: 近景全息核心 ──
  master.to(stage, { rotateX: 3, rotateY: 6, duration: 0.8, ease: 'power2.inOut' }, 2)
  master.to(cardRefs.value[2], { translateZ: 80, filter: 'hue-rotate(15deg) brightness(1.45)', duration: 0.8 }, 2)
  master.to(cardRefs.value[3], { translateZ: 200, filter: 'hue-rotate(-30deg) brightness(1.5)', duration: 0.8 }, 2)
  master.to(glassPanelA.value, { autoAlpha: 0.5, duration: 0.4 }, 2)
  master.to(glassPanelB.value, { autoAlpha: 0.85, x: 0, duration: 0.6, ease: 'power2.out' }, 2.3)

  // ── Stage 3→4: 全息爆发，所有层激活 ──
  master.to(stage, { rotateX: 0, rotateY: 0, duration: 0.8, ease: 'power2.inOut' }, 3)
  master.to(cardRefs.value[0], { translateZ: -60, filter: 'hue-rotate(40deg) brightness(1.2)', duration: 0.8 }, 3)
  master.to(cardRefs.value[1], { translateZ: 40, filter: 'hue-rotate(-25deg) brightness(1.3)', duration: 0.8 }, 3)
  master.to(cardRefs.value[2], { translateZ: 120, filter: 'hue-rotate(10deg) brightness(1.35)', duration: 0.8 }, 3)
  master.to(cardRefs.value[3], { translateZ: 240, filter: 'hue-rotate(-15deg) brightness(1.55)', duration: 0.8 }, 3)
  master.to(glassPanelB.value, { autoAlpha: 0.5, duration: 0.4 }, 3.5)

  // ── 扫描线动画 ──
  if (scanLineRef.value) {
    master.fromTo(scanLineRef.value, { top: '-2%' }, { top: '102%', duration: D }, 0)
    // 重复扫描
    for (let i = 0; i < CARD_COUNT - 1; i++) {
      master.set(scanLineRef.value, { top: '-2%' }, i + 0.95)
      master.to(scanLineRef.value, { top: '102%', duration: 0.8 }, i + 0.95)
    }
  }

  // ── 环境光脉动 ──
  if (glowA.value) {
    master.to(glowA.value, { x: '10vw', y: '-8vh', scale: 1.3, opacity: 0.6, duration: D }, 0)
    master.to(glowA.value, { x: '-8vw', y: '6vh', scale: 0.9, opacity: 0.8, duration: D * 0.5 }, D * 0.5)
  }
  if (glowB.value) {
    master.to(glowB.value, { x: '-6vw', y: '10vh', scale: 1.25, opacity: 0.7, duration: D }, 0)
  }

  // ── 数据流 ──
  if (dataStream.value) {
    master.fromTo(dataStream.value, { autoAlpha: 0.3 }, { autoAlpha: 0.8, duration: 1 }, 0.5)
    master.to(dataStream.value, { autoAlpha: 0.35, duration: 1.5 }, 3)
  }

  if (progRef.value) master.to(progRef.value, { width: '100%', duration: D }, 0)

  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }

onMounted(() => {
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupHoloScroll() }))
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
/* ═══════════════════════ 全息暗黑环境 ═══════════════════════ */
.holo-root {
  position: relative; width: 100vw; height: 100vh; overflow: hidden;
  background: #020205; // 纯黑底
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, monospace;
}

/* ── 网格背景 (赛博朋克网格) ── */
.holo-grid-bg {
  position: absolute; inset: 0; z-index: 0; pointer-events: none; opacity: 0.12;
  background-image:
    linear-gradient(rgba(0,240,255,.15) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,240,255,.1) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 70%);
}

/* ── 扫描线 ── */
.holo-scan-line {
  position: absolute; left: 0; width: 100%; height: 2px; z-index: 2; pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(0,240,255,.5) 20%, rgba(0,240,255,.8) 50%, rgba(0,240,255,.5) 80%, transparent);
  box-shadow: 0 0 20px rgba(0,240,255,.5), 0 0 60px rgba(0,240,255,.2), 0 0 100px rgba(0,200,255,.1);
  filter: blur(1px);
}

/* ── 环境光 ── */
.holo-glow { position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; will-change: transform,opacity; z-index: 1; }
.holo-glow--a { width: 35vw; height: 35vw; top: -8vh; left: -5vw; background: radial-gradient(circle, rgba(0,240,255,.2) 0%, transparent 70%); }
.holo-glow--b { width: 30vw; height: 30vw; bottom: -6vh; right: -3vw; background: radial-gradient(circle, rgba(255,0,255,.18) 0%, transparent 70%); }

/* ── 滚动 ── */
.holo-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 5;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(0,240,255,.2); &:hover { background: rgba(0,240,255,.4); } }
}
.holo-track { position: relative; width: 100%; }
.holo-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

/* ── 标题 (全息霓虹) ── */
.holo-header { position: absolute; top: 3.5vh; left: 50%; transform: translateX(-50%); z-index: 30; text-align: center; width: min(92vw, 800px); pointer-events: none; }
.holo-kicker { display: inline-block; font-size: .6rem; font-weight: 700; letter-spacing: .3em; color: rgba(0,240,255,.7); background: rgba(0,240,255,.06); backdrop-filter: blur(8px); border: 1px solid rgba(0,240,255,.18); border-radius: 999px; padding: .25rem 1.2rem; margin-bottom: .5rem; }
.holo-title { margin: 0; display: flex; justify-content: center; gap: .06em; }
.holo-title__c { display: inline-block; font-size: clamp(2.4rem, 6vw, 5rem); font-weight: 900; color: rgba(0,240,255,.8); will-change: transform,opacity,filter; text-shadow: 0 0 20px rgba(0,240,255,.5), 0 0 60px rgba(0,200,255,.25), 0 0 100px rgba(0,160,255,.15);
  &--holo {
    background: linear-gradient(160deg, #00f0ff 0%, #a0f0ff 25%, #ff40ff 55%, #ff90ff 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    filter: drop-shadow(0 0 18px rgba(0,240,255,.7)) drop-shadow(0 0 40px rgba(255,0,255,.4));
    animation: holo-char-glitch 3s ease-in-out infinite;
  }
}
@keyframes holo-char-glitch {
  0%,90%,100% { transform: translate(0); }
  91% { transform: translate(-3px, 1px); }
  92% { transform: translate(2px, -1px); }
  93% { transform: translate(0); }
}
.holo-divider { width: 120px; height: 2px; margin: .45rem auto .6rem; border-radius: 2px; background: linear-gradient(90deg, transparent, #00f0ff, #ff40ff, #00f0ff, transparent); transform-origin: center; box-shadow: 0 0 10px rgba(0,240,255,.5); }
.holo-sub { margin: 0; font-size: clamp(.7rem, 1.1vw, .86rem); color: rgba(0,220,240,.4); max-width: 460px; margin-inline: auto; }

/* ═══════════════════════ CSS3 3D 全息场景 ═══════════════════════ */
.holo-scene {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 0; height: 0; z-index: 10;
  perspective: 1000px;
  perspective-origin: 50% 45%;
  will-change: transform, opacity, filter;
}

/* 🔑 全息舞台 (preserve-3d) */
.holo-stage {
  position: absolute; width: 0; height: 0;
  transform-style: preserve-3d;
  will-change: transform;
}

/* ═══════════════════════ 全息投影卡片 ═══════════════════════ */
.holo-card {
  position: absolute; transform-style: preserve-3d; will-change: transform, filter;
}
.holo-card__projection {
  position: absolute;
  width: min(52vw, 380px); height: min(35vw, 260px);
  margin-left: calc(min(52vw, 380px) / -2);
  margin-top: calc(min(35vw, 260px) / -2);
  border-radius: 8px; overflow: hidden;
  background: rgba(0,20,30,.3);
  // 🔑 screen 混合模式 — 全息投影在黑色背景上发光
  mix-blend-mode: screen;
  isolation: isolate;
  box-shadow: 0 0 40px rgba(0,240,255,.15), 0 0 80px rgba(0,200,255,.08);
  backface-visibility: hidden;
}
.holo-card__img {
  width: 100%; height: 100%; object-fit: cover; display: block;
  opacity: .75; // 半透明 — 全息感
  filter: saturate(1.3) contrast(1.1);
  mix-blend-mode: screen;
}

/* 🔑 全息色彩偏移层 (色散效果) */
.holo-card__chroma {
  position: absolute; inset: 0; pointer-events: none;
  mix-blend-mode: screen;
  opacity: .4;
}
.holo-card__chroma--cyan {
  background: linear-gradient(160deg,
    rgba(0,240,255,.5) 0%, transparent 40%, rgba(0,200,255,.4) 60%, transparent 100%);
  animation: holo-chroma-shift 4s ease-in-out infinite;
}
.holo-card__chroma--magenta {
  background: linear-gradient(200deg,
    transparent 30%, rgba(255,0,200,.4) 50%, transparent 70%, rgba(200,0,255,.3) 100%);
  animation: holo-chroma-shift 4s ease-in-out infinite reverse;
  opacity: .3;
}
@keyframes holo-chroma-shift {
  0%,100% { opacity: .35; filter: hue-rotate(0deg); }
  25% { opacity: .5; filter: hue-rotate(15deg); }
  50% { opacity: .3; filter: hue-rotate(-10deg); }
  75% { opacity: .45; filter: hue-rotate(5deg); }
}

/* ── 扫描线 (每张卡片) ── */
.holo-card__scanlines {
  position: absolute; inset: 0; pointer-events: none; z-index: 2;
  background: repeating-linear-gradient(
    0deg, transparent, transparent 2px, rgba(0,0,0,.08) 2px, rgba(0,0,0,.08) 4px
  );
  mix-blend-mode: multiply;
  opacity: .6;
}

/* ── 闪烁线 ── */
.holo-card__flicker {
  position: absolute; left: 0; width: 100%; height: 1px; z-index: 3; pointer-events: none;
  background: rgba(0,240,255,.8);
  box-shadow: 0 0 8px rgba(0,240,255,.6);
  animation: holo-flicker-sweep 3.5s ease-in-out infinite;
  opacity: 0;
}
@keyframes holo-flicker-sweep {
  0% { top: -5%; opacity: 0; }
  10% { top: 20%; opacity: .8; }
  15% { top: 25%; opacity: 0; }
  45% { top: 60%; opacity: .6; }
  48% { top: 63%; opacity: 0; }
  80% { top: 85%; opacity: .7; }
  83% { top: 88%; opacity: 0; }
  100% { top: 105%; opacity: 0; }
}

/* 🔑 全息边框 (渐变发光) */
.holo-card__border {
  position: absolute; inset: -2px;
  width: calc(min(52vw, 380px) + 4px); height: calc(min(35vw, 260px) + 4px);
  margin-left: calc((min(52vw, 380px) + 4px) / -2);
  margin-top: calc((min(35vw, 260px) + 4px) / -2);
  border-radius: 10px;
  background: linear-gradient(135deg,
    rgba(0,240,255,.6), rgba(0,200,255,.2) 30%,
    rgba(255,0,255,.3) 60%, rgba(0,240,255,.5)
  );
  z-index: -1;
  filter: blur(2px);
  opacity: .7;
  animation: holo-border-pulse 2.5s ease-in-out infinite;
}
@keyframes holo-border-pulse {
  0%,100% { opacity: .5; }
  50% { opacity: .85; }
}

/* ── 全息光柱 (从卡片底部向上发射) ── */
.holo-card__beam {
  position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
  width: 60%; height: 40vh;
  background: linear-gradient(0deg,
    rgba(0,240,255,.15) 0%, rgba(0,200,255,.06) 30%, transparent 100%);
  filter: blur(15px);
  pointer-events: none; z-index: -1;
  animation: holo-beam-flicker 2s ease-in-out infinite;
}
@keyframes holo-beam-flicker {
  0%,100% { opacity: .6; transform: translateX(-50%) scaleY(1); }
  30% { opacity: .9; transform: translateX(-50%) scaleY(1.1); }
  60% { opacity: .4; transform: translateX(-50%) scaleY(.95); }
}

.holo-card__tag {
  position: absolute; bottom: -24px; left: 50%; transform: translateX(-50%); z-index: 4;
  font-size: .64rem; font-weight: 700; letter-spacing: .22em; white-space: nowrap;
  color: rgba(0,240,255,.8); font-family: 'Courier New', monospace;
  background: rgba(0,20,30,.6); backdrop-filter: blur(6px);
  border-radius: 999px; padding: .15rem .75rem;
  border: 1px solid rgba(0,240,255,.2);
  text-shadow: 0 0 8px rgba(0,240,255,.4);
}

/* ═══════════════════════ 玻璃拟态面板 ═══════════════════════ */
.holo-glass {
  position: absolute; z-index: 20; pointer-events: none; will-change: transform,opacity;
  opacity: 0; // GSAP控制淡入
}
.holo-glass--left {
  top: 30vh; left: 5vw;
  transform: translateX(-30px);
}
.holo-glass--right {
  top: 55vh; right: 5vw;
  transform: translateX(30px);
}
.holo-glass__content {
  display: flex; align-items: center; gap: .5rem;
  padding: .5rem 1rem;
  // 🔑 玻璃拟态核心：backdrop-filter + 半透明背景 + 边框
  background: rgba(0,30,40,.25);
  backdrop-filter: blur(16px) saturate(1.2);
  -webkit-backdrop-filter: blur(16px) saturate(1.2);
  border: 1px solid rgba(0,240,255,.15);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.05);
}
.holo-glass__icon { font-size: 1rem; color: rgba(0,240,255,.8); text-shadow: 0 0 10px rgba(0,240,255,.5); animation: holo-icon-glow 2s ease-in-out infinite; }
@keyframes holo-icon-glow { 0%,100% { opacity: .7; } 50% { opacity: 1; } }
.holo-glass__label { font-size: .6rem; font-weight: 700; letter-spacing: .2em; color: rgba(0,240,255,.7); font-family: 'Courier New', monospace; text-shadow: 0 0 6px rgba(0,240,255,.3); }

/* ── 数据流 ── */
.holo-data-stream {
  position: absolute; bottom: 12vh; left: 50%; transform: translateX(-50%);
  z-index: 25; pointer-events: none; display: flex; gap: .15rem;
  will-change: opacity;
}
.holo-data-stream__char {
  font-size: .62rem; font-family: 'Courier New', monospace;
  color: rgba(0,240,255,.25);
  animation: holo-stream-fade 1.5s ease-in-out infinite;
  animation-delay: calc(var(--i, 0) * 0.1s);
}

/* ── 进度条 ── */
.holo-progress { position: absolute; left: 0; bottom: 0; z-index: 30; width: 100%; height: 2px; background: rgba(0,240,255,.04); }
.holo-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #00f0ff, #ff40ff, #00f0ff, #ff40ff); background-size: 200% 100%; box-shadow: 0 0 10px rgba(0,240,255,.5), 0 0 30px rgba(255,0,255,.3); }

@media (max-width: 768px) {
  .holo-header { top: 2vh; } .holo-kicker { font-size: .48rem; padding: .18rem .6rem; } .holo-title__c { font-size: 1.8rem; }
  .holo-card__projection { width: 70vw; height: 46vw; margin-left: -35vw; margin-top: -23vw; }
  .holo-card__border { width: calc(70vw + 4px); height: calc(46vw + 4px); margin-left: calc((70vw + 4px) / -2); margin-top: calc((46vw + 4px) / -2); }
  .holo-scene { perspective: 700px; }
  .holo-glass--left { left: 2vw; } .holo-glass--right { right: 2vw; }
  .holo-glass__label { font-size: .5rem; }
}
</style>
