<template>
  <section ref="rootRef" class="sf-root">
    <!-- 背景光晕 -->
    <div ref="bgGlowRef" class="sf-bg-glow"></div>
    <!-- 粒子场 -->
    <div ref="particlesRef" class="sf-particles">
      <span v-for="p in particlesList" :key="p.id" class="sf-particle" :style="p.style"></span>
    </div>

    <!-- 舞台 -->
    <div ref="stageRef" class="sf-stage">
      <!-- ══════ 左侧图片列 ══════ -->
      <div ref="leftColRef" class="sf-col sf-col--left">
        <div ref="leftCard1Ref" class="sf-card sf-card--sm">
          <div class="sf-card__frame">
            <img :src="images.side1" alt="左侧图一" class="sf-card__img" />
            <div class="sf-card__shine"></div>
          </div>
        </div>
        <div ref="leftCard2Ref" class="sf-card sf-card--md">
          <div class="sf-card__frame">
            <img :src="images.side2" alt="左侧图二" class="sf-card__img" />
            <div class="sf-card__shine"></div>
          </div>
        </div>
        <div ref="leftCard3Ref" class="sf-card sf-card--sm">
          <div class="sf-card__frame">
            <img :src="images.side3" alt="左侧图三" class="sf-card__img" />
            <div class="sf-card__shine"></div>
          </div>
        </div>
      </div>

      <!-- ══════ 右侧图片列 ══════ -->
      <div ref="rightColRef" class="sf-col sf-col--right">
        <div ref="rightCard1Ref" class="sf-card sf-card--md">
          <div class="sf-card__frame">
            <img :src="images.side4" alt="右侧图一" class="sf-card__img" />
            <div class="sf-card__shine"></div>
          </div>
        </div>
        <div ref="rightCard2Ref" class="sf-card sf-card--sm">
          <div class="sf-card__frame">
            <img :src="images.side5" alt="右侧图二" class="sf-card__img" />
            <div class="sf-card__shine"></div>
          </div>
        </div>
        <div ref="rightCard3Ref" class="sf-card sf-card--md">
          <div class="sf-card__frame">
            <img :src="images.side6" alt="右侧图三" class="sf-card__img" />
            <div class="sf-card__shine"></div>
          </div>
        </div>
      </div>

      <!-- ══════ 中心主图 ══════ -->
      <div ref="centerRef" class="sf-center">
        <div ref="centerFrameRef" class="sf-center__frame">
          <img :src="images.center" alt="中心主图" class="sf-center__img" />
          <div ref="centerOverlayRef" class="sf-center__overlay"></div>
        </div>
        <div ref="centerGlowRef" class="sf-center__glow"></div>
        <div class="sf-center__ring sf-center__ring--1"></div>
        <div class="sf-center__ring sf-center__ring--2"></div>
      </div>

      <!-- ══════ 标题 ══════ -->
      <header ref="headerRef" class="sf-header">
        <span ref="kickerRef" class="sf-kicker">◆ 向下滚动 · 中流砥柱 ◆</span>
        <h1 class="sf-title">
          <span ref="title1Ref" class="sf-title__w sf-title__w--warm">静</span>
          <span ref="title2Ref" class="sf-title__w sf-title__w--cool">观</span>
          <span ref="title3Ref" class="sf-title__w sf-title__w--gold">其</span>
          <span ref="title4Ref" class="sf-title__w sf-title__w--warm">变</span>
        </h1>
        <div ref="dividerRef" class="sf-divider"></div>
        <p ref="subRef" class="sf-sub">中流砥柱 · 两侧如瀑 · 动静之间见天地</p>
      </header>

      <!-- 底部提示 -->
      <div ref="hintRef" class="sf-hint">
        <span class="sf-hint__arrow">↓</span>
        <span class="sf-hint__text">向下滚动</span>
      </div>

      <!-- 进度条 -->
      <div class="sf-progress">
        <div ref="progressFillRef" class="sf-progress__fill"></div>
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
//  CardScrollSideFlow — 中流砥柱 · 两侧上移
//  中心图片静止，两侧图片列向上流动
//  参考 CardImgCinematicMask 滚动模式
// ══════════════════════════════════════════════════════════════

type TweenCleanup = () => void

// ── 图片资源 ──
const images = {
  center: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=800&q=80',
  side1: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
  side2: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80',
  side3: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=400&q=80',
  side4: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80',
  side5: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&q=80',
  side6: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&q=80',
}

// ── 粒子 ──
interface Particle { id: number; style: Record<string, string> }
function genParticles(n: number): Particle[] {
  const pr = (s: number) => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x) }
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    style: {
      '--px': `${pr(i * 3 + 1) * 100}%`,
      '--py': `${pr(i * 3 + 2) * 100}%`,
      '--ps': `${2 + pr(i * 3 + 3) * 3}px`,
      '--pd': `${8 + pr(i * 5 + 7) * 14}s`,
      '--pdl': `${pr(i * 7 + 13) * -15}s`,
      '--po': `${0.15 + pr(i * 2 + 5) * 0.4}`,
    },
  }))
}
const particlesList = ref<Particle[]>(genParticles(30))

// ── Refs ──
const rootRef = ref<HTMLElement | null>(null)
const stageRef = ref<HTMLElement | null>(null)
const leftColRef = ref<HTMLElement | null>(null)
const leftCard1Ref = ref<HTMLElement | null>(null)
const leftCard2Ref = ref<HTMLElement | null>(null)
const leftCard3Ref = ref<HTMLElement | null>(null)
const rightColRef = ref<HTMLElement | null>(null)
const rightCard1Ref = ref<HTMLElement | null>(null)
const rightCard2Ref = ref<HTMLElement | null>(null)
const rightCard3Ref = ref<HTMLElement | null>(null)
const centerRef = ref<HTMLElement | null>(null)
const centerFrameRef = ref<HTMLElement | null>(null)
const centerOverlayRef = ref<HTMLElement | null>(null)
const centerGlowRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const kickerRef = ref<HTMLElement | null>(null)
const title1Ref = ref<HTMLElement | null>(null)
const title2Ref = ref<HTMLElement | null>(null)
const title3Ref = ref<HTMLElement | null>(null)
const title4Ref = ref<HTMLElement | null>(null)
const dividerRef = ref<HTMLElement | null>(null)
const subRef = ref<HTMLElement | null>(null)
const hintRef = ref<HTMLElement | null>(null)
const bgGlowRef = ref<HTMLElement | null>(null)
const progressFillRef = ref<HTMLElement | null>(null)
const particlesRef = ref<HTMLElement | null>(null)

const cleanupFns: TweenCleanup[] = []

// ═══════════════════════ 主时间线 ═══════════════════════
function setupTimeline() {
  const parent = rootRef.value
  const stage = stageRef.value
  if (!parent || !stage || !centerRef.value) return

  // —— 初始状态 ——
  gsap.set(stage, { opacity: 0, scale: 1.04 })

  // 中心：稍小 + 水平收窄 + 暗角遮罩
  gsap.set(centerRef.value, { autoAlpha: 0, scale: 0.85, scaleX: 0.82, y: 10 })
  gsap.set(centerFrameRef.value, { filter: 'brightness(0.6)' })
  gsap.set(centerOverlayRef.value, { opacity: 0.45 })
  gsap.set(centerGlowRef.value, { autoAlpha: 0, scale: 0.5, scaleX: 0.5 })

  // 左侧列：初始在下方
  gsap.set(leftColRef.value, { y: '60vh' })
  gsap.set(leftCard1Ref.value, { autoAlpha: 0, scale: 0.75 })
  gsap.set(leftCard2Ref.value, { autoAlpha: 0, scale: 0.8 })
  gsap.set(leftCard3Ref.value, { autoAlpha: 0, scale: 0.7 })

  // 右侧列：初始在下方
  gsap.set(rightColRef.value, { y: '70vh' })
  gsap.set(rightCard1Ref.value, { autoAlpha: 0, scale: 0.7 })
  gsap.set(rightCard2Ref.value, { autoAlpha: 0, scale: 0.75 })
  gsap.set(rightCard3Ref.value, { autoAlpha: 0, scale: 0.8 })

  // 标题
  gsap.set(headerRef.value, { autoAlpha: 0, y: 30 })
  gsap.set(kickerRef.value, { autoAlpha: 0, scale: 0.7 })
  gsap.set([title1Ref.value, title2Ref.value, title3Ref.value, title4Ref.value].filter(Boolean),
    { autoAlpha: 0, y: 20, scale: 0.5 })
  gsap.set(dividerRef.value, { scaleX: 0, autoAlpha: 0 })
  gsap.set(subRef.value, { autoAlpha: 0, y: 10 })
  gsap.set(hintRef.value, { autoAlpha: 0, y: 8 })

  // 背景
  gsap.set(bgGlowRef.value, { opacity: 0.2 })
  gsap.set(particlesRef.value, { opacity: 0.4 })

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

  // ── 0.00–0.18: 舞台 + 标题入场 ──
  tl.to(stage, { opacity: 1, scale: 1, duration: 0.10, ease: 'power2.out' }, 0.01)
  tl.to(headerRef.value, { autoAlpha: 1, y: 0, duration: 0.08, ease: 'power2.out' }, 0.03)
  tl.to(kickerRef.value, { autoAlpha: 1, scale: 1, duration: 0.07, ease: 'power2.out' }, 0.05)
  tl.to([title1Ref.value, title2Ref.value, title3Ref.value, title4Ref.value].filter(Boolean),
    { autoAlpha: 1, y: 0, scale: 1, duration: 0.08, stagger: 0.03, ease: 'back.out(1.8)' }, 0.06)
  tl.to(dividerRef.value, { scaleX: 1, autoAlpha: 1, duration: 0.07, ease: 'power3.inOut' }, 0.10)
  tl.to(subRef.value, { autoAlpha: 1, y: 0, duration: 0.06, ease: 'power2.out' }, 0.11)
  tl.to(hintRef.value, { autoAlpha: 1, y: 0, duration: 0.06, ease: 'power2.out' }, 0.12)
  tl.to(bgGlowRef.value, { opacity: 0.5, duration: 0.12, ease: 'power2.in' }, 0.02)
  tl.to(particlesRef.value, { opacity: 0.7, duration: 0.12, ease: 'power2.in' }, 0.04)

  // ── 0.12–0.22: 中心图片淡入（scale 到 1，scaleX 保持收窄）──
  tl.to(centerRef.value, { autoAlpha: 1, scale: 1, y: 0, duration: 0.10, ease: 'power3.out' }, 0.12)
  tl.to(centerFrameRef.value, { filter: 'brightness(1)', duration: 0.10, ease: 'power2.out' }, 0.14)
  tl.to(centerOverlayRef.value, { opacity: 0.08, duration: 0.08, ease: 'power2.out' }, 0.16)
  tl.to(centerGlowRef.value, { autoAlpha: 0.5, scale: 1, duration: 0.08, ease: 'power2.out' }, 0.16)

  // ── 0.20–0.70: 中心向两边慢慢伸展 ──
  tl.to(centerRef.value, { scaleX: 1.12, duration: 0.50, ease: 'none' }, 0.20)
  tl.to(centerGlowRef.value, { scaleX: 1.15, duration: 0.50, ease: 'none' }, 0.20)

  // ── 0.20–0.55: 左侧列上移（视差：三张卡片不同速度）──
  tl.to(leftColRef.value, { y: '-50vh', duration: 0.35, ease: 'none' }, 0.20)
  tl.to(leftCard1Ref.value, { autoAlpha: 1, scale: 1, duration: 0.06, ease: 'power2.out' }, 0.22)
  tl.to(leftCard2Ref.value, { autoAlpha: 1, scale: 1, duration: 0.07, ease: 'power2.out' }, 0.28)
  tl.to(leftCard3Ref.value, { autoAlpha: 1, scale: 1, duration: 0.06, ease: 'power2.out' }, 0.34)

  // ── 0.25–0.60: 右侧列上移（略晚于左侧，交错感）──
  tl.to(rightColRef.value, { y: '-55vh', duration: 0.35, ease: 'none' }, 0.25)
  tl.to(rightCard1Ref.value, { autoAlpha: 1, scale: 1, duration: 0.06, ease: 'power2.out' }, 0.27)
  tl.to(rightCard2Ref.value, { autoAlpha: 1, scale: 1, duration: 0.07, ease: 'power2.out' }, 0.33)
  tl.to(rightCard3Ref.value, { autoAlpha: 1, scale: 1, duration: 0.06, ease: 'power2.out' }, 0.39)

  // ── 0.55–0.75: 中心光晕脉冲 ──
  tl.to(centerGlowRef.value, { autoAlpha: 0.9, scale: 1.3, duration: 0.12, ease: 'power2.out' }, 0.55)
  tl.to(centerGlowRef.value, { autoAlpha: 0.4, scale: 0.9, duration: 0.12, ease: 'power2.in' }, 0.67)
  tl.to(bgGlowRef.value, { opacity: 0.75, duration: 0.15, ease: 'power2.in' }, 0.55)
  tl.to(particlesRef.value, { opacity: 0.95, duration: 0.12, ease: 'power2.in' }, 0.58)

  // ── 0.75–0.90: 两侧列继续上移淡出 ──
  tl.to(leftColRef.value, { y: '-110vh', duration: 0.15, ease: 'power2.in' }, 0.75)
  tl.to(rightColRef.value, { y: '-115vh', duration: 0.15, ease: 'power2.in' }, 0.75)
  tl.to([leftCard1Ref.value, leftCard2Ref.value, leftCard3Ref.value].filter(Boolean),
    { autoAlpha: 0, duration: 0.10, ease: 'power2.in' }, 0.78)
  tl.to([rightCard1Ref.value, rightCard2Ref.value, rightCard3Ref.value].filter(Boolean),
    { autoAlpha: 0, duration: 0.10, ease: 'power2.in' }, 0.80)

  // ── 0.85–1.00: 收尾 ──
  tl.to(headerRef.value, { autoAlpha: 0.25, y: -8, duration: 0.08, ease: 'power2.in' }, 0.85)
  tl.to(hintRef.value, { autoAlpha: 0, duration: 0.06, ease: 'power2.in' }, 0.85)
  tl.to(centerOverlayRef.value, { opacity: 0.35, duration: 0.10, ease: 'power2.in' }, 0.88)
  tl.to(centerFrameRef.value, { filter: 'brightness(0.55)', duration: 0.10, ease: 'power2.in' }, 0.88)
  tl.to(bgGlowRef.value, { opacity: 0.25, duration: 0.10, ease: 'power2.in' }, 0.88)
  tl.to(stage, { opacity: 0.6, duration: 0.10, ease: 'power2.in' }, 0.90)

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
.sf-root {
  position: relative; width: 100vw; height: 100vh; overflow: hidden;
  background: radial-gradient(ellipse 55% 45% at 50% 48%, #1a1230 0%, #0e0a22 45%, #060412 100%);
  font-family: 'PingFang SC','Inter','Microsoft YaHei',system-ui,sans-serif;
}

/* ── 背景光晕 ── */
.sf-bg-glow {
  position: absolute; inset: 0; z-index: 0; pointer-events: none;
  background:
    radial-gradient(ellipse 35% 40% at 50% 50%, rgba(160,120,240,.22) 0%, transparent 55%),
    radial-gradient(ellipse 25% 25% at 25% 45%, rgba(255,150,80,.12) 0%, transparent 50%),
    radial-gradient(ellipse 25% 25% at 75% 45%, rgba(80,160,255,.12) 0%, transparent 50%);
  will-change: opacity;
}

/* ── 粒子 ── */
.sf-particles { position: absolute; inset: 0; z-index: 1; pointer-events: none; will-change: opacity; }
.sf-particle {
  --px: 50%; --py: 50%; --ps: 3px; --pd: 12s; --pdl: 0s; --po: 0.3;
  position: absolute; left: var(--px); top: var(--py);
  width: var(--ps); height: var(--ps); border-radius: 50%;
  background: radial-gradient(circle, rgba(255,200,150,.9) 0%, rgba(160,130,230,.5) 40%, transparent 70%);
  box-shadow: 0 0 calc(var(--ps)*3) rgba(180,150,240,.5), 0 0 calc(var(--ps)*6) rgba(255,170,110,.25);
  opacity: var(--po);
  animation: sf-float var(--pd) var(--pdl) infinite ease-in-out;
  will-change: transform, opacity;
}
@keyframes sf-float {
  0%   { transform: translateY(0) translateX(0) scale(1); opacity: var(--po); }
  25%  { transform: translateY(-14vh) translateX(2vw) scale(1.5); opacity: calc(var(--po)*1.4); }
  50%  { transform: translateY(-24vh) translateX(-3vw) scale(.7); opacity: calc(var(--po)*.5); }
  75%  { transform: translateY(-10vh) translateX(4vw) scale(1.3); opacity: calc(var(--po)*1.1); }
  100% { transform: translateY(0) translateX(0) scale(1); opacity: var(--po); }
}

/* ── 舞台 ── */
.sf-stage { position: relative; width: 100%; height: 100vh; overflow: hidden; z-index: 2; will-change: opacity,transform; }

/* ═══════════════════════ 图片列（两侧）═══════════════════════ */
.sf-col {
  position: absolute; top: 0; z-index: 3;
  display: flex; flex-direction: column; gap: 1.2vh;
  width: 18vw; will-change: transform;
}
.sf-col--left  { left: 1.5vw; align-items: flex-start; }
.sf-col--right { right: 1.5vw; align-items: flex-end; }

.sf-card {
  will-change: transform, opacity;
  &--sm { width: 14vw; }
  &--md { width: 17vw; }
}
.sf-card__frame {
  position: relative; width: 100%; border-radius: 6px; overflow: hidden;
  box-shadow: 0 0 0 1.5px rgba(255,190,140,.12), 0 10px 32px rgba(0,0,0,.35);
  aspect-ratio: 3/4;
}
.sf-card__img { width: 100%; height: 100%; object-fit: cover; display: block; }
.sf-card__shine {
  position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(135deg, rgba(255,255,255,.06) 0%, transparent 50%, rgba(255,200,150,.04) 100%);
}

/* ═══════════════════════ 中心主图 ═══════════════════════ */
.sf-center {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); z-index: 5;
  will-change: transform, opacity;
}
.sf-center__frame {
  position: relative; width: 38vw; max-width: 420px; border-radius: 10px; overflow: hidden;
  box-shadow:
    0 0 0 3px rgba(255,190,130,.18),
    0 0 0 6px rgba(255,170,100,.06),
    0 20px 56px rgba(0,0,0,.45);
  aspect-ratio: 3/4;
}
.sf-center__img { width: 100%; height: 100%; object-fit: cover; display: block; }
.sf-center__overlay {
  position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(ellipse 70% 70% at 50% 50%, transparent 40%, rgba(8,4,16,.6) 100%);
  will-change: opacity;
}
.sf-center__glow {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
  width: 110%; height: 110%; border-radius: 14px;
  background: radial-gradient(ellipse 60% 60% at 50% 50%,
    rgba(200,150,255,.25) 0%, rgba(255,160,100,.15) 35%, transparent 70%);
  filter: blur(20px); pointer-events: none; will-change: transform, opacity;
}
.sf-center__ring {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); border-radius: 50%;
  border: 1px solid rgba(255,190,140,.08); pointer-events: none;
  &--1 { width: calc(100% + 40px); height: calc(100% + 40px); }
  &--2 { width: calc(100% + 80px); height: calc(100% + 80px); border-color: rgba(180,140,220,.05); }
}

/* ═══════════════════════ 标题 ═══════════════════════ */
.sf-header {
  position: absolute; top: 3.5vh; left: 50%; transform: translateX(-50%);
  z-index: 20; text-align: center; width: min(88vw,520px); pointer-events: none;
  will-change: transform, opacity;
}
.sf-kicker {
  display: inline-block; font-size: .56rem; font-weight: 700; letter-spacing: .22em;
  color: rgba(200,165,140,.6); background: rgba(16,8,32,.4); backdrop-filter: blur(8px);
  border: 1px solid rgba(170,130,220,.18); border-radius: 999px; padding: .2rem .8rem; margin-bottom: .4rem;
  will-change: transform, opacity;
}
.sf-title { margin: 0; display: flex; justify-content: center; gap: .04em; }
.sf-title__w {
  font-size: clamp(2rem,5vw,3.8rem); font-weight: 900;
  will-change: transform, opacity;
  &--warm { background: linear-gradient(180deg,#ffb08c,#f07050); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  &--cool { background: linear-gradient(180deg,#98b8f0,#5880d8); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  &--gold {
    background: linear-gradient(180deg,#ffe0b0,#d09840);
    -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
    filter: drop-shadow(0 2px 12px rgba(240,180,100,.5));
  }
}
.sf-divider {
  width: 60px; height: 1.5px; margin: .3rem auto .4rem; border-radius: 2px;
  background: linear-gradient(90deg,transparent,#f09060,#b080d8,#6098e0,transparent);
  transform-origin: center; will-change: transform, opacity;
}
.sf-sub {
  margin: 0; font-size: clamp(.55rem,.82vw,.7rem); color: rgba(185,155,135,.38);
  max-width: 380px; margin-inline: auto; will-change: transform, opacity;
}

/* ── 底部提示 ── */
.sf-hint {
  position: absolute; bottom: 7vh; left: 50%; transform: translateX(-50%); z-index: 20;
  display: flex; flex-direction: column; align-items: center; gap: .2rem;
  pointer-events: none; will-change: transform, opacity;
}
.sf-hint__arrow {
  font-size: .8rem; color: rgba(255,170,120,.5);
  animation: sf-bounce 1.8s ease-in-out infinite;
}
@keyframes sf-bounce {
  0%,100% { transform: translateY(0); opacity: .4; }
  50%     { transform: translateY(6px); opacity: .8; }
}
.sf-hint__text { font-size: .52rem; letter-spacing: .18em; color: rgba(190,155,135,.35); }

/* ── 进度条 ── */
.sf-progress {
  position: absolute; left: 0; bottom: 0; z-index: 25; width: 100%; height: 2px;
  background: rgba(255,170,110,.03);
}
.sf-progress__fill {
  width: 0; height: 100%;
  background: linear-gradient(90deg,#f07050,#f0a060,#b080d8,#6098e0,#b080d8,#f0a060);
  background-size: 300% 100%;
  box-shadow: 0 0 10px rgba(240,130,80,.4);
  animation: sf-prog-shift 4s linear infinite;
}
@keyframes sf-prog-shift {
  0% { background-position: 0% 50%; }
  100% { background-position: 300% 50%; }
}

/* ═══════════════════════ 响应式 ═══════════════════════ */
@media (max-width: 1024px) {
  .sf-col { width: 20vw; }
  .sf-card--sm { width: 16vw; }
  .sf-card--md { width: 19vw; }
  .sf-center__frame { width: 42vw; }
}
@media (max-width: 768px) {
  .sf-col { width: 22vw; }
  .sf-card--sm { width: 18vw; }
  .sf-card--md { width: 21vw; }
  .sf-center__frame { width: 46vw; }
  .sf-title__w { font-size: 1.5rem; }
  .sf-header { top: 2vh; }
  .sf-kicker { font-size: .44rem; }
  .sf-sub { font-size: .5rem; }
}
</style>
