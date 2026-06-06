<template>
  <section ref="rootRef" class="wg-root">
    <!-- 背景波纹 -->
    <div ref="bgRing1" class="wg-bg-ring wg-bg-ring--1"></div>
    <div ref="bgRing2" class="wg-bg-ring wg-bg-ring--2"></div>

    <!-- 滚动容器 -->
    <div ref="scrollRef" class="wg-scroll">
      <div ref="trackRef" class="wg-track" :style="{ height: trackHeight }">
        <div class="wg-sticky">

          <!-- 标题 -->
          <header ref="headerRef" class="wg-header">
            <span class="wg-kicker">▣ CSS3 3D Wave Grid · 矩阵波动 ◈</span>
            <h1 class="wg-title">
              <span ref="tc1" class="wg-title__c">矩</span>
              <span ref="tc2" class="wg-title__c wg-title__c--wave">阵</span>
              <span ref="tc3" class="wg-title__c">波</span>
              <span ref="tc4" class="wg-title__c wg-title__c--wave">动</span>
            </h1>
            <div ref="lineRef" class="wg-line"></div>
            <p class="wg-sub">向下滚动 · N×M卡片矩阵3D波浪 · 每张卡片独立Z轴起伏</p>
          </header>

          <!-- 🔑 3D 卡片网格 -->
          <div ref="sceneRef" class="wg-scene">
            <div ref="gridRef" class="wg-grid">
              <div
                v-for="(card, idx) in cards"
                :key="idx"
                :ref="(el) => setCardRef(el as HTMLElement, idx)"
                class="wg-card"
                :style="{
                  '--col': card.col,
                  '--row': card.row,
                }"
              >
                <div class="wg-card__face">
                  <img :src="card.image" :alt="card.alt" class="wg-card__img" />
                  <div class="wg-card__shine"></div>
                  <span class="wg-card__label">{{ card.label }}</span>
                </div>
                <!-- 卡片阴影投影到地面 -->
                <div class="wg-card__shadow"></div>
              </div>
            </div>
          </div>

          <!-- 波动强度指示 -->
          <div ref="waveMeter" class="wg-wave-meter">
            <span class="wg-wave-meter__label">波动强度</span>
            <div class="wg-wave-meter__track">
              <div ref="meterFill" class="wg-wave-meter__fill"></div>
            </div>
          </div>

          <div class="wg-progress"><div ref="progRef" class="wg-progress__fill"></div></div>
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

// ═══════════════════════════════════════════════════════════════════
//  CardImage3DWaveGrid — CSS3 3D 卡片矩阵波动
//
//  核心概念：N×M 卡片矩阵在3D空间中产生波浪
//  1. 4列 × 5行 = 20张图片卡片排列成矩阵
//  2. 每张卡片独立的 translateZ 形成高度
//  3. 用户竖滚 → 正弦波从第一行向后传播
//  4. 同时Y轴倾斜让矩阵有透视纵深感
//  5. 每张卡片有独立的投影到"地面"，强化3D高度感
//
//  青春时尚配色：珊瑚粉 · 活力橙 · 柠檬黄 · 薄荷绿 · 天蓝 · 薰衣草紫
// ═══════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

interface CardData {
  id: number; col: number; row: number
  label: string; image: string; alt: string
  baseZ: number // 基础 Z 高度
}

const COLS = 4
const ROWS = 5
const TOTAL = COLS * ROWS

// Unsplash 图片库 — 每行一种色调主题
const rowImagePool = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80', // 海滩
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=500&q=80', // 山谷
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&q=80', // 森林
  'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=500&q=80', // 星空
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=500&q=80', // 花朵
]
const rowLabels = ['海', '山', '森', '星', '花']
const rowAlts = ['海滩', '山谷', '森林', '星空', '花朵']

const cards: CardData[] = Array.from({ length: TOTAL }, (_, i) => {
  const row = Math.floor(i / COLS)
  const col = i % COLS
  return {
    id: i,
    col, row,
    label: `${rowLabels[row]}${col + 1}`,
    image: rowImagePool[row],
    alt: rowAlts[row],
    baseZ: 0,
  }
})

const trackHeight = `${(ROWS + 3) * 100}vh`

const rootRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const lineRef = ref<HTMLElement | null>(null)
const tc1 = ref<HTMLElement | null>(null); const tc2 = ref<HTMLElement | null>(null)
const tc3 = ref<HTMLElement | null>(null); const tc4 = ref<HTMLElement | null>(null)
const sceneRef = ref<HTMLElement | null>(null)
const gridRef = ref<HTMLElement | null>(null)
const waveMeter = ref<HTMLElement | null>(null)
const meterFill = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)
const bgRing1 = ref<HTMLElement | null>(null)
const bgRing2 = ref<HTMLElement | null>(null)

const cardRefs = ref<(HTMLElement | null)[]>([])
const cleanupFns: TweenCleanup[] = []

function setCardRef(el: HTMLElement | null, idx: number) { cardRefs.value[idx] = el }

function setupEntrance() {
  if (!scrollRef.value || !headerRef.value || !sceneRef.value) return
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: scrollRef.value, scroller: scrollRef.value,
      start: 'top 75%', toggleActions: 'play none none reverse'
    }
  })
  const chars = [tc1.value, tc2.value, tc3.value, tc4.value]
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out' })
    .fromTo(chars, { autoAlpha: 0, y: 120, filter: 'blur(20px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.7, stagger: 0.1, ease: 'power3.out' }, '-=0.4')
    .fromTo(lineRef.value, { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: 'power3.inOut' }, '-=0.25')
  // 卡片矩阵交错入场
  const cardEls = cardRefs.value.filter(Boolean) as HTMLElement[]
  if (cardEls.length > 0) {
    tl.fromTo(cardEls, { autoAlpha: 0, scale: 0.3, rotateX: 90 }, { autoAlpha: 1, scale: 1, rotateX: 0, duration: 0.5, stagger: 0.03, ease: 'back.out(1.8)' }, '-=0.3')
  }
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

function setupWaveGrid() {
  if (!scrollRef.value || !trackRef.value || !gridRef.value) return
  const scroller = scrollRef.value; const track = trackRef.value

  // 初始状态：平展
  const cardEls = cardRefs.value.filter(Boolean) as HTMLElement[]
  cardEls.forEach(el => gsap.set(el, { translateZ: 0 }))
  if (sceneRef.value) gsap.set(sceneRef.value, { rotateX: 45, rotateY: 0 })

  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.5,
    },
  })

  // 🌊 正弦波传播 — 每张卡片按 (row*0.4 + col*0.15) 的相位偏移
  const WAVE_AMPLITUDE = 80 // Z轴波幅
  const WAVE_PERIOD = 0.25   // 空间周期

  // 为每张卡片创建独立的波动关键帧
  cardEls.forEach((el, idx) => {
    const card = cards[idx]
    const phase = card.row * 0.25 + card.col * 0.12 // 相位延迟

    // 阶段1: 波峰到达 — 卡片升起
    master.to(el, {
      translateZ: WAVE_AMPLITUDE * 0.7,
      rotateX: -8,
      rotateY: card.col < COLS / 2 ? -6 : 6,
      duration: 0.8,
      ease: 'power2.out',
    }, phase)
    // 阶段2: 波峰顶部微小弹跳
    master.to(el, {
      translateZ: WAVE_AMPLITUDE,
      duration: 0.2,
      ease: 'sine.inOut',
    }, phase + 0.8)
    // 阶段3: 回落
    master.to(el, {
      translateZ: 15,
      rotateX: 3,
      rotateY: 0,
      duration: 0.9,
      ease: 'power2.in',
    }, phase + 1.0)
    // 阶段4: 第二波小浪
    master.to(el, {
      translateZ: WAVE_AMPLITUDE * 0.4,
      rotateX: -4,
      duration: 0.6,
      ease: 'power2.out',
    }, phase + 1.9)
    master.to(el, {
      translateZ: 0,
      rotateX: 0,
      rotateY: 0,
      duration: 0.7,
      ease: 'power2.in',
    }, phase + 2.5)
  })

  // 场景整体旋转 — 展示行列深度
  if (sceneRef.value) {
    master.to(sceneRef.value, { rotateX: 60, rotateY: 8, duration: ROWS, ease: 'sine.inOut' }, 0)
  }

  // 背景波纹缩放
  if (bgRing1.value) master.to(bgRing1.value, { scale: 1.5, opacity: 0.3, duration: ROWS }, 0)
  if (bgRing2.value) master.to(bgRing2.value, { scale: 1.8, opacity: 0.2, duration: ROWS }, 0)

  // 波动仪表
  if (meterFill.value) {
    master.to(meterFill.value, { width: '100%', duration: 1.5 }, 0.5)
    master.to(meterFill.value, { width: '30%', duration: 1 }, 2)
    master.to(meterFill.value, { width: '80%', duration: 1 }, 3)
    master.to(meterFill.value, { width: '0%', duration: 0.5 }, 4.5)
  }

  if (progRef.value) master.to(progRef.value, { width: '100%', duration: ROWS }, 0)

  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }

onMounted(() => {
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupWaveGrid() }))
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
.wg-root {
  position: relative; width: 100vw; height: 100vh; overflow: hidden;
  background: linear-gradient(160deg, #faf7f4 0%, #fdf5f2 15%, #f8f6fc 35%, #fdf4f5 55%, #faf6f3 75%, #fcf7f4 100%);
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif;
}

.wg-bg-ring {
  position: absolute; border-radius: 50%; pointer-events: none; z-index: 0; will-change: transform,opacity;
  border: 1px solid rgba(255,140,120,.08);
  &--1 { width: 60vw; height: 40vw; top: 10vh; left: 20vw; }
  &--2 { width: 45vw; height: 30vw; top: 25vh; left: 28vw; }
}

.wg-scroll {
  position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 2;
  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(255,140,120,.2); &:hover { background: rgba(255,140,120,.4); } }
}
.wg-track { position: relative; width: 100%; }
.wg-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

.wg-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 30; text-align: center; width: min(92vw, 800px); }
.wg-kicker { display: inline-block; font-size: .62rem; font-weight: 700; letter-spacing: .28em; text-transform: uppercase; color: rgba(255,120,100,.8); background: rgba(255,140,120,.08); backdrop-filter: blur(8px); border: 1px solid rgba(255,130,110,.18); border-radius: 999px; padding: .26rem 1rem; margin-bottom: .5rem; }
.wg-title { margin: 0; display: flex; justify-content: center; gap: .08em; }
.wg-title__c { display: inline-block; font-size: clamp(2rem, 5vw, 4.2rem); font-weight: 900; color: #f08060; will-change: transform,opacity,filter;
  &--wave { background: linear-gradient(135deg, #ff7b60, #ffb347, #5cd8a0, #5eaff0); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 2px 14px rgba(255,150,100,.5)); }
}
.wg-line { width: 90px; height: 2px; margin: .4rem auto .55rem; border-radius: 2px; background: linear-gradient(90deg, transparent, #ff7b60, #ffb347, #5cd8a0, #5eaff0, transparent); transform-origin: center; }
.wg-sub { margin: 0; font-size: clamp(.68rem, .95vw, .82rem); color: rgba(200,130,100,.45); max-width: 500px; margin-inline: auto; }

/* ═══════════════════════ CSS3 3D 网格场景 ═══════════════════════ */
.wg-scene {
  position: absolute; top: 53%; left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  perspective: 700px;
  perspective-origin: 50% 45%;
  will-change: transform;
}

.wg-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  transform-style: preserve-3d;
  transform: rotateX(45deg) rotateY(0deg);
  will-change: transform;
}

.wg-card {
  width: min(20vw, 170px);
  height: min(16vw, 135px);
  transform-style: preserve-3d;
  will-change: transform;
  transition: filter .3s;
  cursor: pointer;

  &:hover { filter: brightness(1.15); }

  &__face {
    position: relative;
    width: 100%; height: 100%;
    border-radius: 10px; overflow: hidden;
    backface-visibility: hidden;
    box-shadow: 0 6px 30px rgba(0,0,0,.18), 0 0 0 1px rgba(255,255,255,.25);
  }
  &__img { width: 100%; height: 100%; object-fit: cover; display: block; }
  &__shine {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,.2) 0%, transparent 50%, rgba(255,255,255,.05) 100%);
    pointer-events: none;
  }
  &__label {
    position: absolute; bottom: 6px; right: 8px; z-index: 2;
    font-size: .58rem; font-weight: 700; letter-spacing: .12em;
    color: #fff; background: rgba(0,0,0,.28); backdrop-filter: blur(4px);
    border-radius: 5px; padding: .1rem .5rem;
  }

  /* 地面投影 */
  &__shadow {
    position: absolute; left: 6%; bottom: -18px; width: 88%; height: 16px;
    background: radial-gradient(ellipse, rgba(0,0,0,.2) 0%, transparent 75%);
    border-radius: 50%;
    transform: rotateX(90deg);
    pointer-events: none;
    will-change: transform, opacity;
  }
}

/* 波动仪表 */
.wg-wave-meter {
  position: absolute; bottom: 12vh; left: 50%; transform: translateX(-50%); z-index: 25;
  display: flex; align-items: center; gap: .5rem;
  pointer-events: none;
}
.wg-wave-meter__label { font-size: .6rem; font-weight: 600; color: rgba(200,120,80,.6); letter-spacing: .1em; }
.wg-wave-meter__track { width: 100px; height: 4px; border-radius: 2px; background: rgba(255,130,100,.1); overflow: hidden; }
.wg-wave-meter__fill { width: 0; height: 100%; background: linear-gradient(90deg, #ff7b60, #ffb347); border-radius: 2px; box-shadow: 0 0 8px rgba(255,130,100,.4); }

.wg-progress { position: absolute; left: 0; bottom: 0; z-index: 30; width: 100%; height: 3px; background: rgba(255,130,100,.05); }
.wg-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #ff7b60, #ffb347, #5cd8a0, #5eaff0, #ff7b60); background-size: 200% 100%; box-shadow: 0 0 12px rgba(255,140,100,.5); }

@media (max-width: 768px) {
  .wg-header { top: 2vh; } .wg-kicker { font-size: .48rem; padding: .16rem .55rem; } .wg-title__c { font-size: 1.6rem; }
  .wg-grid { grid-template-columns: repeat(4, 1fr); gap: 6px; }
  .wg-card { width: 20vw; height: 16vw; }
  .wg-wave-meter { bottom: 8vh; }
}
</style>
