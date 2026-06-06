<template>
  <section ref="rootRef" class="ms-root">
    <div ref="scrollRef" class="ms-scroll">
      <div ref="trackRef" class="ms-track" :style="{ height: trackHeight }">
        <div class="ms-sticky">

          <header ref="headerRef" class="ms-header">
            <span class="ms-kicker">◈ CSS 原生 · 瀑布流 · 3D 错落画廊 ◈</span>
            <h1 class="ms-title">
              <span ref="tc1" class="ms-title__c">瀑</span>
              <span ref="tc2" class="ms-title__c ms-title__c--mason">布</span>
              <span ref="tc3" class="ms-title__c">画</span>
              <span ref="tc4" class="ms-title__c ms-title__c--mason">廊</span>
            </h1>
            <div ref="dividerRef" class="ms-divider"></div>
            <p ref="subRef" class="ms-sub">
              向下滚动 · CSS columns 原生瀑布流 · translateZ 3D错落 · 告别Masonry.js
            </p>
          </header>

          <!-- ════════════════ 3D 瀑布流画廊 ════════════════ -->
          <div ref="sceneRef" class="ms-scene">
            <div ref="stageRef" class="ms-stage">

              <!-- 🔑 原生瀑布流 — CSS columns -->
              <div class="ms-masonry">
                <div
                  v-for="(card, i) in cards"
                  :key="card.id"
                  :ref="el => { cardRefs[i] = el as HTMLElement | null }"
                  class="ms-card"
                  :style="{
                    height: card.height + 'px',
                    '--z': card.z + 'px',
                    '--rot': card.rot + 'deg',
                    '--hue': card.hue,
                  }"
                >
                  <img :src="card.url" :alt="card.label" class="ms-card__img" loading="lazy" />
                  <div class="ms-card__overlay"></div>
                  <div class="ms-card__meta">
                    <span class="ms-card__tag">{{ card.label }}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div ref="infoBar" class="ms-info">
            <span class="ms-info__dot"></span>
            <span class="ms-info__text">{{ CARD_COUNT }}张卡片 · CSS columns原生瀑布流 · 3D错落深度</span>
          </div>

          <div class="ms-progress"><div ref="progRef" class="ms-progress__fill"></div></div>
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

interface MasonryCard {
  id: number; label: string; url: string
  height: number; z: number; rot: number; hue: number
}

function genCards(count: number): MasonryCard[] {
  const hash = (s: number) => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x) }
  const urls = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=80',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&q=80',
    'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=500&q=80',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&q=80',
    'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=500&q=80',
    'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=500&q=80',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&q=80',
    'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&q=80',
    'https://images.unsplash.com/photo-1480497490787-505ec076689f?w=500&q=80',
    'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=500&q=80',
  ]
  const labels = ['AURORA','BEACON','CREST','DRIFT','EMBER','FROST','GLEAM','HAVEN','IVORY','JADE','KARMA','LUMEN','MIST','NOVA','OPAL','PRISM','QUEST','RIDGE','SURGE','TIDAL']
  return Array.from({ length: count }, (_, i) => ({
    id: i, label: labels[i % labels.length],
    url: urls[i % urls.length],
    height: 160 + Math.round(hash(i * 3 + 1) * 220),
    z: Math.round((hash(i * 5 + 2) - .5) * 160),
    rot: Math.round((hash(i * 7 + 3) - .5) * 6),
    hue: Math.round(210 + hash(i * 9 + 4) * 40),
  }))
}

const CARD_COUNT = 20
const cards = ref<MasonryCard[]>(genCards(CARD_COUNT))
const STAGES = 5
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
    .fromTo(dividerRef.value, { scaleX: 0 }, { scaleX: 1, duration: .4, ease: 'power3.inOut' }, '-=.12')
    .fromTo(subRef.value, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .45, ease: 'power2.out' }, '-=.06')
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

function setupMasonryScroll() {
  if (!scrollRef.value || !trackRef.value || !stageRef.value) return
  const scroller = scrollRef.value; const track = trackRef.value; const stage = stageRef.value
  const D = STAGES
  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.3 },
  })
  master.to(stage, { rotateX: 8, rotateY: -5, duration: D * .4 }, 0)
  master.to(stage, { rotateX: -6, rotateY: 6, duration: D * .5 }, D * .35)
  master.to(stage, { rotateX: 0, rotateY: 0, duration: D * .3 }, D * .75)
  if (progRef.value) master.to(progRef.value, { width: '100%', duration: D }, 0)
  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }

onMounted(() => {
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupMasonryScroll() }))
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
/* ═══════════════════════ 画廊暗色空间 ═══════════════════════ */
.ms-root {
  position: relative; width: 100vw; height: 100vh; overflow: hidden;
  background: radial-gradient(ellipse 55% 45% at 50% 45%, #100e18 0%, #08060e 55%, #030208 100%);
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif;
}

.ms-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 5;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(120,160,200,.1); }
}
.ms-track { position: relative; width: 100%; }
.ms-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

.ms-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 40; text-align: center; width: min(92vw, 800px); pointer-events: none; }
.ms-kicker { display: inline-block; font-size: .52rem; font-weight: 700; letter-spacing: .22em; color: rgba(100,150,210,.55); background: rgba(60,120,200,.04); backdrop-filter: blur(8px); border: 1px solid rgba(60,120,200,.1); border-radius: 999px; padding: .15rem .8rem; margin-bottom: .45rem; }
.ms-title { margin: 0; display: flex; justify-content: center; gap: .06em; }
.ms-title__c { display: inline-block; font-size: clamp(2rem, 5.5vw, 4.2rem); font-weight: 900; color: #6898c8;
  &--mason { background: linear-gradient(150deg, #5090d0 0%, #70c0f0 30%, #c070e0 60%, #e090f0 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 2px 8px rgba(80,160,220,.4)); }
}
.ms-divider { width: 100px; height: 2px; margin: .35rem auto .45rem; background: linear-gradient(90deg, transparent, #5090d0, #c070e0, #5090d0, transparent); }
.ms-sub { margin: 0; font-size: clamp(.52rem, 1vw, .68rem); color: rgba(80,140,200,.3); max-width: 500px; margin-inline: auto; }

/* ═══════════════════════ 3D 场景 — 居中! ═══════════════════════ */
.ms-scene {
  // 🔑 绝对定位 + flex 居中
  position: absolute;
  top: 12vh; bottom: 14vh; left: 0; right: 0;
  z-index: 10;
  display: flex; justify-content: center;
  perspective: 800px;
  perspective-origin: 50% 45%;
  overflow: hidden;
}
.ms-stage {
  // 🔑 宽度限制 + 自动居中
  width: min(88vw, 780px);
  transform-style: preserve-3d;
  will-change: transform;
  overflow-y: auto; // 允许内部滚动查看完整瀑布流
  padding: 0 8px;

  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(120,160,200,.08); }
}

/* ═══════════════ 🔑 原生瀑布流 — CSS columns ═══════════════ */
.ms-masonry {
  columns: 4;
  column-gap: 14px;
  transform-style: preserve-3d;
}

/* ═══════════════ 🔑 3D错落卡片 ═══════════════ */
.ms-card {
  --z: 0px; --rot: 0deg; --hue: 220;
  break-inside: avoid;
  margin-bottom: 14px;
  position: relative; border-radius: 8px; overflow: hidden;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  will-change: transform;
  cursor: pointer;

  // 🔑 每张卡片独立 translateZ — 3D错落深度
  transform: translateZ(var(--z)) rotateY(var(--rot));

  // 🔑 hover浮起
  transition: transform .4s cubic-bezier(.23,1,.32,1), box-shadow .35s ease;

  &:hover {
    transform: translateZ(calc(var(--z) + 50px)) rotateY(0deg) scale(1.05);
    z-index: 20;
    box-shadow: 0 20px 60px rgba(0,0,0,.4);
  }

  box-shadow: 0 8px 28px rgba(0,0,0,.3);
}
.ms-card__img {
  width: 100%; height: 100%; object-fit: cover; display: block;
}
.ms-card__overlay {
  position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(180deg,
    rgba(0,0,0,.05) 0%, transparent 35%,
    rgba(0,0,0,.15) 70%, rgba(0,0,0,.35) 100%);
}
.ms-card__meta {
  position: absolute; bottom: 0; left: 0; right: 0;
  padding: 20px 8px 8px;
  background: linear-gradient(0deg, rgba(0,0,0,.5) 0%, transparent 100%);
}
.ms-card__tag {
  font-size: .48rem; font-weight: 700; letter-spacing: .14em;
  color: rgba(255,255,255,.8); font-family: 'Courier New', monospace;
  text-shadow: 0 1px 3px rgba(0,0,0,.4);
}

/* ── 信息栏 ── */
.ms-info { position: absolute; bottom: 8vh; left: 50%; transform: translateX(-50%); z-index: 35; pointer-events: none; display: flex; align-items: center; gap: .4rem; }
.ms-info__dot { width: 5px; height: 5px; border-radius: 50%; background: #60a0d8; box-shadow: 0 0 8px rgba(80,150,220,.4); }
.ms-info__text { font-size: .48rem; font-weight: 600; letter-spacing: .08em; color: rgba(80,140,210,.4); font-family: 'Courier New', monospace; }

.ms-progress { position: absolute; left: 0; bottom: 0; z-index: 40; width: 100%; height: 2px; background: rgba(60,120,200,.02); }
.ms-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #5090d0, #c070e0, #5090d0); }

@media (max-width: 1024px) { .ms-masonry { columns: 3; } }
@media (max-width: 640px)  {
  .ms-masonry { columns: 2; column-gap: 10px; }
  .ms-card { margin-bottom: 10px; }
  .ms-stage { width: 94vw; }
}
</style>
