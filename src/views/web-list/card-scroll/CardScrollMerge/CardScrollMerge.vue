<template>
  <section ref="rootRef" class="merge-root">
    <!-- 背景光晕 -->
    <div ref="bgGlowRef" class="merge-bg-glow"></div>

    <!-- 星空粒子 -->
    <div ref="particlesRef" class="merge-particles">
      <span v-for="p in particlesList" :key="p.id" class="merge-particle" :style="p.style"></span>
    </div>

    <!-- 舞台 -->
    <div ref="stageRef" class="merge-stage">
      <!-- 左侧图片面板 -->
      <div ref="leftPanelRef" class="merge-panel merge-panel--left">
        <div class="merge-panel__frame">
          <img :src="images.left" alt="山峦晨曦" class="merge-panel__img" />
          <div ref="leftOverlayRef" class="merge-panel__overlay"></div>
        </div>
        <div ref="leftLabelRef" class="merge-panel__label merge-panel__label--left">
          <span class="merge-panel__label-icon">◆</span>
          <span>晨 曦 · 山 峦</span>
        </div>
      </div>

      <!-- 右侧图片面板 -->
      <div ref="rightPanelRef" class="merge-panel merge-panel--right">
        <div class="merge-panel__frame">
          <img :src="images.right" alt="海洋落日" class="merge-panel__img" />
          <div ref="rightOverlayRef" class="merge-panel__overlay merge-panel__overlay--right"></div>
        </div>
        <div ref="rightLabelRef" class="merge-panel__label merge-panel__label--right">
          <span>落 日 · 海 洋</span>
          <span class="merge-panel__label-icon">◆</span>
        </div>
      </div>

      <!-- 中心合并光柱 -->
      <div ref="centerBeamRef" class="merge-beam">
        <div class="merge-beam__core"></div>
        <div class="merge-beam__glow"></div>
      </div>

      <!-- 合并光爆 -->
      <div ref="burstRef" class="merge-burst">
        <div class="merge-burst__ring merge-burst__ring--1"></div>
        <div class="merge-burst__ring merge-burst__ring--2"></div>
        <div class="merge-burst__spark"></div>
      </div>

      <!-- 标题 -->
      <header ref="headerRef" class="merge-header">
        <span ref="kickerRef" class="merge-kicker">✦ 向下滚动 · 双境合璧 ✦</span>
        <h1 class="merge-title">
          <span ref="titleLRef" class="merge-title__word merge-title__word--left">山</span>
          <span ref="titleSepRef" class="merge-title__sep">海</span>
          <span ref="titleRRef" class="merge-title__word merge-title__word--right">之</span>
          <span class="merge-title__word merge-title__word--end">约</span>
        </h1>
        <div ref="dividerRef" class="merge-divider"></div>
        <p ref="subRef" class="merge-subtitle">竖滚屏幕 · 山海交融 · 双重视界合为一体</p>
      </header>

      <!-- 进度指示 -->
      <div ref="infoRef" class="merge-info">
        <span class="merge-info__icon">◆</span>
        <span class="merge-info__text">双 境 合 璧</span>
      </div>

      <!-- 进度条 -->
      <div class="merge-progress">
        <div ref="progressFillRef" class="merge-progress__fill"></div>
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
//  CardScrollMerge — 双境合璧
//  参考 CardImgCinematicMask 的滚动模式：
//  start: 'top 100%' / end: 'bottom -100%' / toggleActions
//  无 pin，纯 scrub，window 滚动
// ══════════════════════════════════════════════════════════════

type TweenCleanup = () => void

// ── 图片 ──
const images = {
  left: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=960&q=80',
  right: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=960&q=80',
}

// ── 粒子 ──
interface Particle { id: number; style: Record<string, string> }
function generateParticles(count: number): Particle[] {
  const pr = (s: number) => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x) }
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    style: {
      '--px': `${pr(i * 3 + 1) * 100}%`,
      '--py': `${pr(i * 3 + 2) * 100}%`,
      '--psize': `${2 + pr(i * 3 + 3) * 4}px`,
      '--pdur': `${8 + pr(i * 5 + 7) * 14}s`,
      '--pdel': `${pr(i * 7 + 13) * -15}s`,
      '--pop': `${0.2 + pr(i * 3 + 1) * 0.5}`,
    },
  }))
}
const particlesList = ref<Particle[]>(generateParticles(25))

// ── Refs ──
const rootRef = ref<HTMLElement | null>(null)
const stageRef = ref<HTMLElement | null>(null)
const leftPanelRef = ref<HTMLElement | null>(null)
const rightPanelRef = ref<HTMLElement | null>(null)
const leftOverlayRef = ref<HTMLElement | null>(null)
const rightOverlayRef = ref<HTMLElement | null>(null)
const leftLabelRef = ref<HTMLElement | null>(null)
const rightLabelRef = ref<HTMLElement | null>(null)
const centerBeamRef = ref<HTMLElement | null>(null)
const burstRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const kickerRef = ref<HTMLElement | null>(null)
const titleLRef = ref<HTMLElement | null>(null)
const titleSepRef = ref<HTMLElement | null>(null)
const titleRRef = ref<HTMLElement | null>(null)
const dividerRef = ref<HTMLElement | null>(null)
const subRef = ref<HTMLElement | null>(null)
const infoRef = ref<HTMLElement | null>(null)
const bgGlowRef = ref<HTMLElement | null>(null)
const progressFillRef = ref<HTMLElement | null>(null)
const particlesRef = ref<HTMLElement | null>(null)

const cleanupFns: TweenCleanup[] = []

// ═══════════════════════ 主时间线 ═══════════════════════
function setupTimeline() {
  const parent = rootRef.value
  const stage = stageRef.value
  if (!parent || !stage || !leftPanelRef.value || !rightPanelRef.value) return

  // —— 初始状态 ——
  gsap.set(stage, { opacity: 0, scale: 1.03 })
  gsap.set(leftPanelRef.value, { x: '-55vw' })
  gsap.set(rightPanelRef.value, { x: '55vw' })
  gsap.set(leftOverlayRef.value, { opacity: 0.55 })
  gsap.set(rightOverlayRef.value, { opacity: 0.55 })
  gsap.set(centerBeamRef.value, { autoAlpha: 0, scaleY: 0.15 })
  gsap.set(burstRef.value, { autoAlpha: 0, scale: 0.3 })
  gsap.set(leftLabelRef.value, { autoAlpha: 0, x: -30 })
  gsap.set(rightLabelRef.value, { autoAlpha: 0, x: 30 })
  gsap.set(headerRef.value, { autoAlpha: 0, y: 35 })
  gsap.set(kickerRef.value, { autoAlpha: 0, scale: 0.8 })
  gsap.set([titleLRef.value, titleRRef.value].filter(Boolean), { autoAlpha: 0, scale: 0.5, x: -16 })
  gsap.set(titleSepRef.value, { autoAlpha: 0, scale: 0 })
  gsap.set(dividerRef.value, { scaleX: 0, autoAlpha: 0 })
  gsap.set(subRef.value, { autoAlpha: 0, y: 12 })
  gsap.set(infoRef.value, { autoAlpha: 0, y: 8 })
  gsap.set(bgGlowRef.value, { opacity: 0.3 })
  gsap.set(particlesRef.value, { opacity: 0.5 })

  // —— 单一时间线，0→1 映射 start→end 滚动范围 ——
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: parent,
      start: 'top 100%',
      end: 'bottom 50%',
      scrub: 1.5,
      toggleActions: 'play reverse play reverse',
    },
  })

  // ── 0.00–0.20: 舞台淡入 + 标题入场 ──
  tl.to(stage, { opacity: 1, scale: 1, duration: 0.12, ease: 'power2.out' }, 0.02)
  tl.to(headerRef.value, { autoAlpha: 1, y: 0, duration: 0.10, ease: 'power2.out' }, 0.04)
  tl.to(kickerRef.value, { autoAlpha: 1, scale: 1, duration: 0.08, ease: 'power2.out' }, 0.06)
  tl.to([titleLRef.value, titleRRef.value].filter(Boolean),
    { autoAlpha: 1, scale: 1, x: 0, duration: 0.10, stagger: 0.04, ease: 'back.out(1.8)' }, 0.07)
  tl.to(titleSepRef.value, { autoAlpha: 1, scale: 1, duration: 0.08, ease: 'back.out(2.5)' }, 0.09)
  tl.to(dividerRef.value, { scaleX: 1, autoAlpha: 1, duration: 0.08, ease: 'power3.inOut' }, 0.10)
  tl.to(subRef.value, { autoAlpha: 1, y: 0, duration: 0.08, ease: 'power2.out' }, 0.11)
  tl.to(infoRef.value, { autoAlpha: 1, y: 0, duration: 0.06, ease: 'power2.out' }, 0.12)
  tl.to(bgGlowRef.value, { opacity: 0.55, duration: 0.12, ease: 'power2.in' }, 0.03)
  tl.to(particlesRef.value, { opacity: 0.75, duration: 0.12, ease: 'power2.in' }, 0.04)

  // ── 0.20–0.40: 图片启动靠近 ──
  tl.to(leftPanelRef.value, { x: '-38vw', duration: 0.20, ease: 'power2.in' }, 0.20)
  tl.to(rightPanelRef.value, { x: '38vw', duration: 0.20, ease: 'power2.in' }, 0.20)
  tl.to(leftLabelRef.value, { autoAlpha: 0.7, x: -12, duration: 0.15, ease: 'power2.out' }, 0.22)
  tl.to(rightLabelRef.value, { autoAlpha: 0.7, x: 12, duration: 0.15, ease: 'power2.out' }, 0.22)
  tl.to(leftOverlayRef.value, { opacity: 0.35, duration: 0.18, ease: 'power2.out' }, 0.24)
  tl.to(rightOverlayRef.value, { opacity: 0.35, duration: 0.18, ease: 'power2.out' }, 0.24)

  // ── 0.40–0.65: 加速靠近 + 光柱渐显 ──
  tl.to(leftPanelRef.value, { x: '-8vw', duration: 0.25, ease: 'power3.in' }, 0.40)
  tl.to(rightPanelRef.value, { x: '8vw', duration: 0.25, ease: 'power3.in' }, 0.40)
  tl.to(centerBeamRef.value, { autoAlpha: 0.6, scaleY: 0.55, duration: 0.18, ease: 'power2.out' }, 0.48)
  tl.to(bgGlowRef.value, { opacity: 0.85, duration: 0.22, ease: 'power2.in' }, 0.42)
  tl.to(particlesRef.value, { opacity: 1, duration: 0.20, ease: 'power2.in' }, 0.44)

  // ── 0.65–0.80: 减速到位，光柱全亮 ──
  tl.to(leftPanelRef.value, { x: 0, duration: 0.15, ease: 'power3.out' }, 0.65)
  tl.to(rightPanelRef.value, { x: 0, duration: 0.15, ease: 'power3.out' }, 0.65)
  tl.to(centerBeamRef.value, { autoAlpha: 1, scaleY: 1, duration: 0.10, ease: 'power2.out' }, 0.66)
  tl.to(leftOverlayRef.value, { opacity: 0, duration: 0.10, ease: 'power2.out' }, 0.68)
  tl.to(rightOverlayRef.value, { opacity: 0, duration: 0.10, ease: 'power2.out' }, 0.68)
  tl.to(leftLabelRef.value, { autoAlpha: 0, x: -16, duration: 0.08, ease: 'power2.in' }, 0.72)
  tl.to(rightLabelRef.value, { autoAlpha: 0, x: 16, duration: 0.08, ease: 'power2.in' }, 0.72)

  // ── 0.80–0.92: 光爆 ──
  tl.to(burstRef.value, { autoAlpha: 1, scale: 2, duration: 0.06, ease: 'power2.out' }, 0.82)
  tl.to(burstRef.value, { autoAlpha: 0, scale: 3.5, duration: 0.12, ease: 'power2.in' }, 0.88)
  tl.to(centerBeamRef.value, { autoAlpha: 0.3, scaleY: 0.7, duration: 0.08, ease: 'power2.in' }, 0.88)
  tl.to(bgGlowRef.value, { opacity: 0.35, duration: 0.08, ease: 'power2.in' }, 0.88)
  tl.to(particlesRef.value, { opacity: 0.6, duration: 0.10, ease: 'power2.in' }, 0.86)

  // ── 0.90–1.00: 收尾淡出 ──
  tl.to(headerRef.value, { autoAlpha: 0.3, y: -10, duration: 0.08, ease: 'power2.in' }, 0.90)
  tl.to(infoRef.value, { autoAlpha: 0, duration: 0.06, ease: 'power2.in' }, 0.90)
  tl.to(stage, { opacity: 0.7, duration: 0.10, ease: 'power2.in' }, 0.92)

  // ── 进度条 ──
  tl.to(progressFillRef.value, { width: '100%', duration: 1, ease: 'none' }, 0)

  cleanupFns.push(() => {
    tl.scrollTrigger?.kill()
    tl.kill()
  })
}

function handleResize() {
  ScrollTrigger.refresh(true)
}

onMounted(() => {
  requestAnimationFrame(() => {
    setupTimeline()
  })
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
.merge-root {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: radial-gradient(ellipse 55% 45% at 50% 45%, #1a1030 0%, #0d0a20 45%, #060410 100%);
  font-family: 'PingFang SC', 'Inter', 'Microsoft YaHei', system-ui, sans-serif;
}

/* ── 背景光晕 ── */
.merge-bg-glow {
  position: absolute; inset: 0; z-index: 0; pointer-events: none;
  background:
    radial-gradient(ellipse 40% 50% at 50% 50%, rgba(180,130,255,.25) 0%, transparent 60%),
    radial-gradient(ellipse 30% 30% at 30% 50%, rgba(255,160,80,.15) 0%, transparent 50%),
    radial-gradient(ellipse 30% 30% at 70% 50%, rgba(80,180,255,.15) 0%, transparent 50%);
  will-change: opacity;
}

/* ── 粒子 ── */
.merge-particles {
  position: absolute; inset: 0; z-index: 1; pointer-events: none;
  will-change: opacity;
}
.merge-particle {
  --px: 50%; --py: 50%; --psize: 3px; --pdur: 12s; --pdel: 0s; --pop: 0.4;
  position: absolute; left: var(--px); top: var(--py);
  width: var(--psize); height: var(--psize); border-radius: 50%;
  background: radial-gradient(circle, rgba(255,210,160,.9) 0%, rgba(180,140,240,.5) 40%, transparent 70%);
  box-shadow: 0 0 calc(var(--psize)*3) rgba(200,160,255,.5), 0 0 calc(var(--psize)*6) rgba(255,180,120,.25);
  opacity: var(--pop);
  animation: merge-float var(--pdur) var(--pdel) infinite ease-in-out;
  will-change: transform, opacity;
}
@keyframes merge-float {
  0%   { transform: translateY(0) translateX(0) scale(1); opacity: var(--pop); }
  20%  { transform: translateY(-12vh) translateX(3vw) scale(1.4); opacity: calc(var(--pop)*1.5); }
  45%  { transform: translateY(-22vh) translateX(-2vw) scale(.8); opacity: calc(var(--pop)*.6); }
  65%  { transform: translateY(-15vh) translateX(4vw) scale(1.2); opacity: calc(var(--pop)*1.1); }
  85%  { transform: translateY(-6vh) translateX(-3vw) scale(.7); opacity: calc(var(--pop)*.5); }
  100% { transform: translateY(0) translateX(0) scale(1); opacity: var(--pop); }
}

/* ── 舞台 ── */
.merge-stage {
  position: relative; width: 100%; height: 100vh; overflow: hidden; z-index: 2;
  will-change: opacity, transform;
}

/* ═══════════════════════ 图片面板 ═══════════════════════ */
.merge-panel {
  position: absolute; top: 50%; transform: translateY(-50%); width: 54vw; z-index: 3;
  will-change: transform;
}
.merge-panel--left  { left: 0; }
.merge-panel--right { right: 0; }

.merge-panel__frame {
  position: relative; width: 100%; aspect-ratio: 3/4; overflow: hidden; border-radius: 4px;
  box-shadow: 0 0 0 2px rgba(255,200,150,.15), 0 16px 48px rgba(0,0,0,.4);
}
.merge-panel--left .merge-panel__frame  { border-radius: 0 8px 8px 0; margin-left: auto; }
.merge-panel--right .merge-panel__frame { border-radius: 8px 0 0 8px; }
.merge-panel__img { width: 100%; height: 100%; object-fit: cover; display: block; }
.merge-panel__overlay { position: absolute; inset: 0; pointer-events: none; will-change: opacity; }
.merge-panel--left .merge-panel__overlay {
  background: linear-gradient(90deg, rgba(10,8,30,.7) 0%, rgba(20,15,50,.4) 40%, transparent 100%);
}
.merge-panel__overlay--right {
  background: linear-gradient(270deg, rgba(10,8,30,.7) 0%, rgba(20,15,50,.4) 40%, transparent 100%);
}

/* ── 标签 ── */
.merge-panel__label {
  position: absolute; bottom: -36px; display: flex; align-items: center; gap: .4rem;
  font-size: .62rem; font-weight: 700; letter-spacing: .2em; color: rgba(220,190,160,.8);
  white-space: nowrap; will-change: transform, opacity;
}
.merge-panel__label--left  { right: 12px; }
.merge-panel__label--right { left: 12px; }
.merge-panel__label-icon { font-size: .45rem; color: rgba(255,180,120,.9); }

/* ═══════════════════════ 中心光柱 ═══════════════════════ */
.merge-beam {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); z-index: 5;
  pointer-events: none; will-change: transform, opacity;
}
.merge-beam__core {
  position: absolute; top: -35vh; left: -1px; width: 2px; height: 70vh;
  background: linear-gradient(180deg, transparent 0%, rgba(255,210,150,.1) 15%, rgba(255,200,140,.9) 30%,
    rgba(255,240,220,1) 50%, rgba(255,200,140,.9) 70%, rgba(255,210,150,.1) 85%, transparent 100%);
  filter: blur(.5px);
}
.merge-beam__glow {
  position: absolute; top: -38vh; left: -8px; width: 16px; height: 76vh;
  background: linear-gradient(180deg, transparent 0%, rgba(200,140,255,.15) 20%, rgba(255,180,120,.35) 40%,
    rgba(255,220,180,.5) 50%, rgba(255,180,120,.35) 60%, rgba(200,140,255,.15) 80%, transparent 100%);
  filter: blur(12px);
}

/* ═══════════════════════ 光爆 ═══════════════════════ */
.merge-burst {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); z-index: 6;
  pointer-events: none; will-change: transform, opacity;
}
.merge-burst__ring {
  position: absolute; top: 50%; left: 50%; border-radius: 50%;
  border: 1px solid rgba(255,210,160,.5); transform: translate(-50%,-50%);
}
.merge-burst__ring--1 { width: 60px; height: 60px; }
.merge-burst__ring--2 { width: 120px; height: 120px; border-color: rgba(200,140,255,.3); }
.merge-burst__spark {
  position: absolute; top: 50%; left: 50%; width: 6px; height: 6px; margin: -3px 0 0 -3px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,240,220,1) 0%, rgba(255,180,100,.6) 40%, transparent 70%);
  box-shadow: 0 0 16px rgba(255,200,150,.8), 0 0 32px rgba(255,160,120,.5), 0 0 48px rgba(200,120,255,.3);
}

/* ═══════════════════════ 标题 ═══════════════════════ */
.merge-header {
  position: absolute; top: 4vh; left: 50%; transform: translateX(-50%); z-index: 20;
  text-align: center; width: min(90vw,560px); pointer-events: none;
  will-change: transform, opacity;
}
.merge-kicker {
  display: inline-block; font-size: .58rem; font-weight: 700; letter-spacing: .25em;
  color: rgba(200,170,140,.65); background: rgba(20,10,40,.35); backdrop-filter: blur(8px);
  border: 1px solid rgba(180,140,220,.2); border-radius: 999px; padding: .25rem 1rem; margin-bottom: .5rem;
  will-change: transform, opacity;
}
.merge-title { margin: 0; display: flex; justify-content: center; align-items: baseline; gap: .04em; }
.merge-title__word {
  font-size: clamp(2.2rem,5.5vw,4.2rem); font-weight: 900; color: #e0d0c0;
  will-change: transform, opacity;
  &--left  { background: linear-gradient(180deg,#ffb88c,#ff7b5c); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  &--right { background: linear-gradient(180deg,#a8c8ff,#6e90e0); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  &--end {
    background: linear-gradient(180deg,#e0c8a0,#c09060); -webkit-background-clip:text;
    -webkit-text-fill-color:transparent; background-clip:text;
    filter: drop-shadow(0 2px 10px rgba(255,180,120,.5));
  }
}
.merge-title__sep {
  font-size: clamp(2.8rem,7vw,5.2rem); font-weight: 900;
  background: linear-gradient(180deg,#ffd4a0,#e8a060,#c880d0);
  -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
  filter: drop-shadow(0 3px 18px rgba(220,160,255,.6));
  will-change: transform, opacity;
}
.merge-divider {
  width: 70px; height: 1.5px; margin: .4rem auto .5rem; border-radius: 2px;
  background: linear-gradient(90deg,transparent,#ff9b70,#c090e0,#6ea0f0,transparent);
  transform-origin: center; will-change: transform, opacity;
}
.merge-subtitle {
  margin: 0; font-size: clamp(.6rem,.9vw,.75rem); color: rgba(190,160,140,.4);
  max-width: 420px; margin-inline: auto; will-change: transform, opacity;
}

/* ── 合并信息 ── */
.merge-info {
  position: absolute; bottom: 8vh; left: 50%; transform: translateX(-50%); z-index: 20;
  display: flex; align-items: center; gap: .5rem; pointer-events: none;
  will-change: transform, opacity;
}
.merge-info__icon {
  font-size: .7rem; color: rgba(255,180,120,.8);
  animation: merge-icon-pulse 2s ease-in-out infinite;
}
@keyframes merge-icon-pulse {
  0%,100% { opacity: .5; transform: scale(1); }
  50%     { opacity: 1; transform: scale(1.3); }
}
.merge-info__text {
  font-size: .6rem; font-weight: 600; letter-spacing: .12em; color: rgba(200,170,150,.6);
  background: rgba(10,5,20,.4); backdrop-filter: blur(8px); border-radius: 999px;
  padding: .22rem .9rem; border: 1px solid rgba(180,140,220,.15);
}

/* ── 进度条 ── */
.merge-progress {
  position: absolute; left: 0; bottom: 0; z-index: 25; width: 100%; height: 2px;
  background: rgba(255,180,120,.04);
}
.merge-progress__fill {
  width: 0; height: 100%;
  background: linear-gradient(90deg,#ff7b5c,#ffb88c,#d4a0f0,#6ea0f0,#d4a0f0,#ffb88c);
  background-size: 300% 100%;
  box-shadow: 0 0 12px rgba(255,140,100,.5);
  animation: merge-progress-shift 4s linear infinite;
}
@keyframes merge-progress-shift {
  0% { background-position: 0% 50%; }
  100% { background-position: 300% 50%; }
}

/* ═══════════════════════ 响应式 ═══════════════════════ */
@media (max-width: 1024px) {
  .merge-panel { width: 55vw; }
}
@media (max-width: 768px) {
  .merge-header { top: 2.5vh; }
  .merge-kicker { font-size: .48rem; padding: .18rem .6rem; }
  .merge-title__word { font-size: 1.6rem; }
  .merge-title__sep { font-size: 2rem; }
  .merge-subtitle { font-size: .55rem; }
  .merge-panel { width: 58vw; }
  .merge-panel__label { font-size: .5rem; bottom: -28px; }
  .merge-info__text { font-size: .5rem; }
  .merge-beam__core { height: 50vh; top: -25vh; }
  .merge-beam__glow { height: 54vh; top: -27vh; }
}
</style>
