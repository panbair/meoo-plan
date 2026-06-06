<template>
  <section ref="rootRef" class="an-root">
    <div ref="scrollRef" class="an-scroll">
      <div ref="trackRef" class="an-track" :style="{ height: trackHeight }">
        <div class="an-sticky">

          <header ref="headerRef" class="an-header">
            <span class="an-kicker">⚓ CSS 原生 · 锚点定位 · 3D 磁吸 ◈</span>
            <h1 class="an-title">
              <span ref="tc1" class="an-title__c">锚</span>
              <span ref="tc2" class="an-title__c an-title__c--anchor">点</span>
              <span ref="tc3" class="an-title__c">定</span>
              <span ref="tc4" class="an-title__c an-title__c--anchor">位</span>
            </h1>
            <div ref="dividerRef" class="an-divider"></div>
            <p ref="subRef" class="an-sub">
              向下滚动旋转场景 · anchor-name + position-anchor · 标签磁吸跟随3D元素
            </p>
          </header>

          <!-- ════════════════ 3D 场景 ════════════════ -->
          <div ref="sceneRef" class="an-scene">
            <div ref="stageRef" class="an-stage">

              <!-- 🔑 3D卡片 + CSS锚点定位标签 -->
              <div
                v-for="(card, i) in cards"
                :key="card.id"
                :ref="el => { cardRefs[i] = el as HTMLElement | null }"
                class="an-card"
                :style="{ transform: `translateZ(${card.baseZ}px) translateY(${card.baseY}vh) translateX(${card.baseX}vw)` }"
              >
                <!-- 🔑 锚点元素 (被标签挂载的目标) -->
                <div
                  :ref="el => { anchorRefs[i] = el as HTMLElement | null }"
                  class="an-card__anchor"
                  :style="{ anchorName: `--card-${i}` }"
                >
                  <img :src="card.url" :alt="card.label" class="an-card__img" loading="lazy" />
                </div>

                <!-- 🔑 悬浮标签 — CSS锚点定位自动跟随! -->
                <div
                  :ref="el => { tooltipRefs[i] = el as HTMLElement | null }"
                  class="an-tooltip"
                  :class="`an-tooltip--${card.tipPos}`"
                  :style="{ positionAnchor: `--card-${i}` }"
                >
                  <span class="an-tooltip__title">{{ card.label }}</span>
                  <span class="an-tooltip__desc">{{ card.desc }}</span>
                </div>
              </div>

            </div>
          </div>

          <div ref="infoBar" class="an-info">
            <span class="an-info__text">anchor-name + position-anchor · 标签自动磁吸 · 无JS位置计算</span>
          </div>

          <div class="an-progress"><div ref="progRef" class="an-progress__fill"></div></div>
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

type TweenCleanup = () => void

interface AnchorCard {
  id: number; label: string; desc: string; url: string
  baseZ: number; baseY: number; baseX: number; tipPos: string
}

const cards: AnchorCard[] = [
  { id: 0, label: 'NEBULA',  desc: '星云·远景', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=80', baseZ: -200, baseY: -18, baseX: -16, tipPos: 'bottom' },
  { id: 1, label: 'COSMOS',  desc: '宇宙·上层', url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&q=80', baseZ: -60,  baseY: -6,  baseX: 14,  tipPos: 'top' },
  { id: 2, label: 'STELLAR', desc: '恒星·中央', url: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=500&q=80', baseZ: 50,   baseY: 6,   baseX: -12, tipPos: 'left' },
  { id: 3, label: 'PULSAR',  desc: '脉冲·近景', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&q=80', baseZ: 160,  baseY: 16,  baseX: 10,  tipPos: 'right' },
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
const anchorRefs = ref<(HTMLElement | null)[]>(Array(CARD_COUNT).fill(null))
const tooltipRefs = ref<(HTMLElement | null)[]>(Array(CARD_COUNT).fill(null))
const infoBar = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)
const cleanupFns: TweenCleanup[] = []

function setupEntrance() {
  if (!scrollRef.value || !headerRef.value) return
  const scroller = scrollRef.value
  const chars = [tc1.value, tc2.value, tc3.value, tc4.value].filter(Boolean)
  const tl = gsap.timeline({ scrollTrigger: { trigger: scrollRef.value, scroller, start: 'top 75%', toggleActions: 'play none none reverse' } })
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: .7, ease: 'power3.out' })
    .fromTo(chars, { autoAlpha: 0, z: -150, scale: .3 }, { autoAlpha: 1, z: 0, scale: 1, duration: .5, stagger: .07, ease: 'back.out(1.5)' }, '-=.3')
    .fromTo(subRef.value, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .45, ease: 'power2.out' }, '-=.06')
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

function setupScene() {
  if (!scrollRef.value || !trackRef.value || !stageRef.value) return
  const scroller = scrollRef.value; const track = trackRef.value; const stage = stageRef.value
  const D = STAGES
  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.3 },
  })
  // 场景旋转 — 标签磁吸跟随!
  master.to(stage, { rotateX: 15, rotateY: -12, duration: D * .45 }, 0)
  master.to(stage, { rotateX: -10, rotateY: 10, duration: D * .45 }, D * .4)
  master.to(stage, { rotateX: 0, rotateY: 0, duration: D * .2 }, D * .8)
  if (progRef.value) master.to(progRef.value, { width: '100%', duration: D }, 0)
  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }

onMounted(() => {
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupScene() }))
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
.an-root {
  position: relative; width: 100vw; height: 100vh; overflow: hidden;
  background: radial-gradient(ellipse 55% 45% at 50% 48%, #0c0a16 0%, #04020c 55%, #010004 100%);
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, monospace;
}

.an-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 5;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(80,160,220,.08); }
}
.an-track { position: relative; width: 100%; }
.an-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

.an-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 40; text-align: center; width: min(92vw, 800px); pointer-events: none; }
.an-kicker { display: inline-block; font-size: .52rem; font-weight: 700; letter-spacing: .22em; color: rgba(80,160,220,.55); background: rgba(40,120,200,.04); backdrop-filter: blur(8px); border: 1px solid rgba(40,120,200,.1); border-radius: 999px; padding: .16rem .85rem; margin-bottom: .45rem; }
.an-title { margin: 0; display: flex; justify-content: center; gap: .06em; }
.an-title__c { display: inline-block; font-size: clamp(2rem, 5.5vw, 4.2rem); font-weight: 900; color: #4898c8;
  &--anchor { background: linear-gradient(150deg, #3090d0 0%, #60c8f0 30%, #c060e0 60%, #e080f0 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 2px 10px rgba(60,160,220,.5)); }
}
.an-divider { width: 100px; height: 2px; margin: .35rem auto .45rem; background: linear-gradient(90deg, transparent, #3090d0, #c060e0, #3090d0, transparent); }
.an-sub { margin: 0; font-size: clamp(.54rem, 1vw, .7rem); color: rgba(60,140,210,.3); max-width: 520px; margin-inline: auto; }

/* ═══════════════════════ 3D 场景 ═══════════════════════ */
.an-scene {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 0; height: 0; z-index: 10;
  perspective: 900px;
  perspective-origin: 50% 48%;
}
.an-stage { position: absolute; width: 0; height: 0; transform-style: preserve-3d; will-change: transform; }

/* ═══════════════════════ 3D卡片 ═══════════════════════ */
.an-card {
  position: absolute; transform-style: preserve-3d;
  backface-visibility: hidden;
}

/* 🔑 锚点元素 — 标签挂载的目标 */
.an-card__anchor {
  position: absolute;
  width: min(26vw, 200px); height: min(16vw, 130px);
  margin-left: calc(min(26vw, 200px) / -2);
  margin-top: calc(min(16vw, 130px) / -2);
  border-radius: 10px; overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,.35);
}
.an-card__img { width: 100%; height: 100%; object-fit: cover; display: block; }

/* ═══════════════ 🔑🔑🔑 CSS 锚点定位 — 标签磁吸跟随! ═══════════════ */
/*
  以前: JS计算 → getBoundingClientRect() → 数学变换 → 更新位置
  现在: anchor-name + position-anchor → 浏览器原生自动跟随!
*/

.an-tooltip {
  // 🔑 锚点定位 — 浏览器自动计算位置!
  position: absolute; // 或 position: fixed (基于锚点)

  // position-anchor 由 inline style 动态绑定到对应 --card-N

  // 默认定位
  inset: auto;

  // 工具提示样式
  padding: .35rem .7rem; border-radius: 8px; z-index: 30;
  background: rgba(6,4,14,.85); backdrop-filter: blur(12px);
  border: 1px solid rgba(80,160,230,.25);
  box-shadow: 0 4px 20px rgba(0,0,0,.4);
  white-space: nowrap; pointer-events: none;

  // 微动画
  animation: an-pulse 2s ease-in-out infinite;
}
@keyframes an-pulse { 0%,100% { box-shadow: 0 4px 20px rgba(0,0,0,.4); } 50% { box-shadow: 0 4px 28px rgba(60,160,220,.15); } }

.an-tooltip__title { display: block; font-size: .62rem; font-weight: 900; letter-spacing: .1em; color: rgba(80,180,230,.9); font-family: 'Courier New', monospace; }
.an-tooltip__desc  { display: block; font-size: .46rem; font-weight: 500; letter-spacing: .06em; color: rgba(100,150,200,.5); margin-top: 2px; }

/* 🔑 4个方向的锚点定位 */
.an-tooltip--bottom {
  // anchor(bottom) = 锚点元素底部 → 标签出现在锚点下方
  top: calc(anchor(bottom) + 8px);
  left: anchor(center);
  transform: translateX(-50%);
}
.an-tooltip--top {
  bottom: calc(100% - anchor(top) + 8px);
  left: anchor(center);
  transform: translateX(-50%);
}
.an-tooltip--left {
  right: calc(100% - anchor(left) + 8px);
  top: anchor(center);
  transform: translateY(-50%);
}
.an-tooltip--right {
  left: calc(anchor(right) + 8px);
  top: anchor(center);
  transform: translateY(-50%);
}

.an-info { position: absolute; bottom: 10vh; left: 50%; transform: translateX(-50%); z-index: 35; pointer-events: none; }
.an-info__text { font-size: .5rem; font-weight: 600; letter-spacing: .1em; color: rgba(60,140,210,.4); font-family: 'Courier New', monospace; }

.an-progress { position: absolute; left: 0; bottom: 0; z-index: 40; width: 100%; height: 2px; background: rgba(40,120,200,.02); }
.an-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #3090d0, #c060e0, #3090d0); }

@media (max-width: 768px) {
  .an-header { top: 2vh; } .an-kicker { font-size: .34rem; } .an-title__c { font-size: 1.4rem; }
  .an-card__anchor { width: 32vw; height: 20vw; margin-left: -16vw; margin-top: -10vw; }
}
</style>
