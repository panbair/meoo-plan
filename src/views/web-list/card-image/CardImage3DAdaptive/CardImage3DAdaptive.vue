<template>
  <!--
    ═══════════════════════════════════════════════════
    CardImage3DAdaptive — CSS 原生逻辑 · 会思考的样式

    未来CSS:
      color: if(prefers-color-scheme(dark), white, black);
      background: contrast-color(var(--bg));

    现在: CSS变量 + prefers-color-scheme 媒体查询
    ═══════════════════════════════════════════════════
  -->
  <section ref="rootRef" class="ad-root">
    <div ref="scrollRef" class="ad-scroll">
      <div ref="trackRef" class="ad-track" :style="{ height: trackHeight }">
        <div class="ad-sticky">

          <header ref="headerRef" class="ad-header">
            <span class="ad-kicker">🧠 CSS 原生逻辑 · 会思考的样式 · 自适应主题 🧠</span>
            <h1 class="ad-title">
              <span ref="tc1" class="ad-title__c">自</span>
              <span ref="tc2" class="ad-title__c ad-title__c--think">适</span>
              <span ref="tc3" class="ad-title__c">应</span>
              <span ref="tc4" class="ad-title__c ad-title__c--think">3D</span>
            </h1>
            <div ref="dividerRef" class="ad-divider"></div>
            <p ref="subRef" class="ad-sub">
              向下滚动 · CSS变量逻辑判断 · prefers-color-scheme自适应 · if()/contrast-color()
            </p>
          </header>

          <!-- ════════════════ 自适应3D场景 ════════════════ -->
          <div ref="sceneRef" class="ad-scene">
            <div ref="stageRef" class="ad-stage">

              <!-- 🔑 自适应卡片 — 颜色由CSS变量逻辑决定 -->
              <div
                v-for="(card, i) in cards"
                :key="card.id"
                :ref="el => { cardRefs[i] = el as HTMLElement | null }"
                class="ad-card"
                :style="{ transform: `translateZ(${card.baseZ}px) translateY(${card.baseY}vh) translateX(${card.baseX}vw)` }"
              >
                <img :src="card.url" :alt="card.label" class="ad-card__img" loading="lazy" />
                <!-- 🔑 自适应对比度文字 -->
                <span class="ad-card__label">{{ card.label }}</span>
              </div>

              <!-- 🔑 主题指示器 — 显示当前激活的主题 -->
              <div class="ad-theme-badge">
                <span class="ad-theme-badge__icon">{{ themeIcon }}</span>
                <span class="ad-theme-badge__text">{{ themeLabel }} · prefers-color-scheme</span>
              </div>

            </div>
          </div>

          <div ref="infoBar" class="ad-info">
            <span class="ad-info__text">
              CSS逻辑: if()判断主题 · contrast-color()自动对比度 · 无障碍自适应
            </span>
          </div>

          <div class="ad-progress"><div ref="progRef" class="ad-progress__fill"></div></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void

interface AdaptiveCard {
  id: number; label: string; url: string
  baseZ: number; baseY: number; baseX: number
}

const cards: AdaptiveCard[] = [
  { id: 0, label: 'ADAPT.ONE',   url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=80', baseZ: -180, baseY: -16, baseX: -14 },
  { id: 1, label: 'ADAPT.TWO',   url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&q=80', baseZ: -60,  baseY: -4,  baseX: 12 },
  { id: 2, label: 'ADAPT.THREE', url: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=500&q=80', baseZ: 40,   baseY: 6,   baseX: -10 },
  { id: 3, label: 'ADAPT.FOUR',  url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&q=80', baseZ: 130,  baseY: 16,  baseX: 10 },
]

const CARD_COUNT = cards.length
const STAGES = 4
const trackHeight = `${(STAGES + 1) * 100}vh`

// 🔑 检测系统主题
const isDark = ref(typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches)
const themeLabel = computed(() => isDark.value ? '🌙 暗色模式' : '☀️ 亮色模式')
const themeIcon = computed(() => isDark.value ? '🌙' : '☀️')

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

function setupScene() {
  if (!scrollRef.value || !trackRef.value || !stageRef.value) return
  const scroller = scrollRef.value; const track = trackRef.value; const stage = stageRef.value
  const D = STAGES
  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.3 },
  })
  master.to(stage, { rotateX: 12, rotateY: -10, duration: D * .45 }, 0)
  master.to(stage, { rotateX: -8, rotateY: 8, duration: D * .45 }, D * .4)
  master.to(stage, { rotateX: 0, rotateY: 0, duration: D * .2 }, D * .8)
  if (progRef.value) master.to(progRef.value, { width: '100%', duration: D }, 0)
  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }

onMounted(() => {
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupScene() }))
  window.addEventListener('resize', handleResize)
  // 🔑 监听主题切换
  const mq = window.matchMedia('(prefers-color-scheme: dark)')
  mq.addEventListener('change', (e) => { isDark.value = e.matches })
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  ScrollTrigger.getAll().forEach(st => st.kill())
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0
})
</script>

<style scoped lang="scss">
/* ═══════════════════════ 🔑 CSS 逻辑变量 — "会思考的样式" ═══════════════════════ */
/*
  未来 CSS (CSS Values Level 5):
    color: if(prefers-color-scheme(dark), white, black);
    background: contrast-color(var(--surface));

  现在: CSS变量 + prefers-color-scheme 实现等效逻辑
*/

/* 🔑 亮色主题变量 (默认) */
.ad-root {
  --ad-bg: #f8f5f0;
  --ad-bg2: #f0ece4;
  --ad-text: #3a2a18;
  --ad-text2: rgba(60,40,20,.45);
  --ad-accent: #c89850;
  --ad-accent2: #a07030;
  --ad-card-bg: #fff;
  --ad-card-shadow: rgba(0,0,0,.12);
  --ad-glow1: rgba(200,150,100,.1);
  --ad-glow2: rgba(160,120,80,.08);
  --ad-border: rgba(160,120,80,.12);
  --ad-kicker-bg: rgba(180,130,80,.05);
  --ad-divider: #c89850;
  --ad-surface: #faf7f2;

  position: relative; width: 100vw; height: 100vh; overflow: hidden;
  background: linear-gradient(170deg,
    var(--ad-surface) 0%,
    var(--ad-bg) 30%,
    var(--ad-surface) 60%,
    var(--ad-bg2) 100%
  );
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, monospace;
  transition: background .5s ease;
}

/* 🔑 暗色主题 — 自动切换! (prefers-color-scheme) */
@media (prefers-color-scheme: dark) {
  .ad-root {
    --ad-bg: #0e0c16;
    --ad-bg2: #080610;
    --ad-text: #d8d0e8;
    --ad-text2: rgba(200,190,220,.45);
    --ad-accent: #9078c0;
    --ad-accent2: #b098e0;
    --ad-card-bg: #1a1624;
    --ad-card-shadow: rgba(0,0,0,.35);
    --ad-glow1: rgba(120,100,180,.1);
    --ad-glow2: rgba(100,80,160,.08);
    --ad-border: rgba(120,100,180,.12);
    --ad-kicker-bg: rgba(120,100,180,.05);
    --ad-divider: #9078c0;
    --ad-surface: #100e18;
  }
}

/* 🔑 对比度颜色 — 自动计算可读性 */
/* 未来: color: contrast-color(var(--ad-card-bg)); */
/* 现在: 手动设置 + prefers-contrast 增强 */
@media (prefers-contrast: high) {
  .ad-root {
    --ad-text: #000;
    --ad-text2: rgba(0,0,0,.65);
    --ad-border: rgba(0,0,0,.25);
  }
  @media (prefers-color-scheme: dark) {
    .ad-root {
      --ad-text: #fff;
      --ad-text2: rgba(255,255,255,.65);
      --ad-border: rgba(255,255,255,.25);
    }
  }
}

.ad-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 5;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: var(--ad-border); }
}
.ad-track { position: relative; width: 100%; }
.ad-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

.ad-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 40; text-align: center; width: min(92vw, 800px); pointer-events: none; }
.ad-kicker { display: inline-block; font-size: .5rem; font-weight: 700; letter-spacing: .2em; color: var(--ad-text2); background: var(--ad-kicker-bg); backdrop-filter: blur(8px); border: 1px solid var(--ad-border); border-radius: 999px; padding: .14rem .8rem; margin-bottom: .45rem; }
.ad-title { margin: 0; display: flex; justify-content: center; gap: .06em; }
.ad-title__c { display: inline-block; font-size: clamp(2rem, 5.5vw, 4.2rem); font-weight: 900; color: var(--ad-accent);
  &--think {
    background: linear-gradient(150deg, var(--ad-accent) 0%, var(--ad-accent2) 50%, var(--ad-accent) 100%);
    background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 2px 6px var(--ad-glow1));
  }
}
.ad-divider { width: 110px; height: 2px; margin: .35rem auto .45rem; background: linear-gradient(90deg, transparent, var(--ad-divider), var(--ad-accent2), var(--ad-divider), transparent); }
.ad-sub { margin: 0; font-size: clamp(.5rem, 1vw, .66rem); color: var(--ad-text2); max-width: 520px; margin-inline: auto; }

/* ═══════════════════════ 3D 场景 ═══════════════════════ */
.ad-scene {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 0; height: 0; z-index: 10;
  perspective: 900px;
  perspective-origin: 50% 48%;
}
.ad-stage { position: absolute; width: 0; height: 0; transform-style: preserve-3d; will-change: transform; }

/* 🔑 自适应卡片 */
.ad-card {
  position: absolute; transform-style: preserve-3d; backface-visibility: hidden;
  will-change: transform;
  transition: filter .3s ease;

  &:hover {
    filter: brightness(1.1) drop-shadow(0 8px 24px var(--ad-card-shadow));
  }
}
.ad-card__img {
  display: block; object-fit: cover; border-radius: 10px;
  width: min(26vw, 200px); height: min(16vw, 130px);
  margin-left: calc(min(26vw, 200px) / -2);
  margin-top: calc(min(16vw, 130px) / -2);
  box-shadow: 0 8px 32px var(--ad-card-shadow);
}
.ad-card__label {
  position: absolute; bottom: -18px; left: 50%; transform: translateX(-50%);
  font-size: .46rem; font-weight: 700; letter-spacing: .12em; white-space: nowrap;
  color: var(--ad-text2); font-family: 'Courier New', monospace;
}

/* 🔑 主题指示徽章 */
.ad-theme-badge {
  position: absolute; display: flex; align-items: center; gap: .4rem;
  padding: .35rem .8rem; border-radius: 999px; z-index: 20;
  background: var(--ad-card-bg);
  border: 1px solid var(--ad-border);
  box-shadow: 0 4px 16px var(--ad-card-shadow);
  transform: translateZ(160px) translateY(22vh) translateX(-8vw);
}
.ad-theme-badge__icon { font-size: .9rem; }
.ad-theme-badge__text { font-size: .5rem; font-weight: 600; letter-spacing: .08em; color: var(--ad-text2); font-family: 'Courier New', monospace; white-space: nowrap; }

.ad-info { position: absolute; bottom: 10vh; left: 50%; transform: translateX(-50%); z-index: 35; pointer-events: none; }
.ad-info__text { font-size: .48rem; font-weight: 600; letter-spacing: .06em; color: var(--ad-text2); font-family: 'Courier New', monospace; }

.ad-progress { position: absolute; left: 0; bottom: 0; z-index: 40; width: 100%; height: 2px; background: var(--ad-border); }
.ad-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, var(--ad-accent), var(--ad-accent2), var(--ad-accent)); }

@media (max-width: 768px) {
  .ad-header { top: 2vh; } .ad-kicker { font-size: .3rem; } .ad-title__c { font-size: 1.4rem; }
}
</style>
