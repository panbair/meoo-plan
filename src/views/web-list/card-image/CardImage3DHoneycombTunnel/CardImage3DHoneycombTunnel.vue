<template>
  <section ref="rootRef" class="hny-root">
    <div ref="honeyGlow" class="hny-glow"></div>
    <div ref="warmAmbient" class="hny-ambient"></div>

    <div ref="scrollRef" class="hny-scroll">
      <div ref="trackRef" class="hny-track" :style="{ height: trackHeight }">
        <div class="hny-sticky">

          <header ref="headerRef" class="hny-header">
            <span class="hny-kicker">🍯 CSS3 3D Honeycomb Tunnel · 蜂巢隧洞 ◈</span>
            <h1 class="hny-title">
              <span ref="tc1" class="hny-title__c">蜂</span>
              <span ref="tc2" class="hny-title__c hny-title__c--honey">巢</span>
              <span ref="tc3" class="hny-title__c">隧</span>
              <span ref="tc4" class="hny-title__c hny-title__c--honey">洞</span>
            </h1>
            <div ref="lineRef" class="hny-line"></div>
            <p class="hny-sub">向下滚动 · 六边形蜂巢隧道 · 每格一张图 · 蜜色暖光 · 自然几何</p>
          </header>

          <div ref="sceneRef" class="hny-scene">
            <div ref="hiveRef" class="hny-hive">
              <!-- 蜂巢环 — 每环由6个六边形巢室组成 -->
              <div
                v-for="ring in hiveRings"
                :key="ring.id"
                :ref="(el) => setRingRef(el as HTMLElement, ring.id)"
                class="hny-ring"
              >
                <!-- 6个六边形巢室 -->
                <div
                  v-for="cell in ring.cells"
                  :key="cell.pos"
                  class="hny-cell"
                  :class="[`hny-cell--${cell.pos}`]"
                >
                  <div class="hny-cell__hex">
                    <img :src="cell.image" :alt="cell.alt" class="hny-cell__img" />
                    <div class="hny-cell__honey"></div>
                  </div>
                </div>
                <!-- 环连接框 -->
                <div class="hny-ring__frame"></div>
              </div>
            </div>
          </div>

          <div ref="hiveInfo" class="hny-info">
            <span class="hny-info__icon">🍯</span>
            <span class="hny-info__text">巢室 {{ visitedCells }}/{{ RING_COUNT * 6 }}</span>
          </div>

          <div class="hny-progress"><div ref="progRef" class="hny-progress__fill"></div></div>
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
//  CardImage3DHoneycombTunnel — CSS3 3D 蜂巢隧洞
//
//  核心概念：六边形蜂巢结构构成隧道内壁
//  1. 7层蜂巢环沿Z轴排列
//  2. 每环含6个六边形巢室（clip-path: polygon六边形）
//  3. 每个巢室贴一张Unsplash图片
//  4. 用户竖滚 → 巢室向相机推进+蜜蜂视角穿梭
//  5. 暖金色蜜调光晕，自然几何美学
// ═══════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

const RING_COUNT = 8
const trackHeight = `${8 * 100}vh`

const cellImagePool = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=350&q=80',
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=350&q=80',
  'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=350&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=350&q=80',
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=350&q=80',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=350&q=80',
  'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=350&q=80',
  'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=350&q=80',
]

const positions = ['top', 'topright', 'bottomright', 'bottom', 'bottomleft', 'topleft'] as const

const hiveRings = Array.from({ length: RING_COUNT }, (_, ringIdx) => ({
  id: ringIdx,
  z: -ringIdx * 230 - 80,
  scale: 1 - ringIdx * 0.13,
  cells: positions.map((pos, cellIdx) => ({
    pos,
    image: cellImagePool[(ringIdx * 6 + cellIdx) % cellImagePool.length],
    alt: `巢室R${ringIdx}C${cellIdx}`,
  })),
}))

const rootRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const lineRef = ref<HTMLElement | null>(null)
const tc1 = ref<HTMLElement | null>(null); const tc2 = ref<HTMLElement | null>(null)
const tc3 = ref<HTMLElement | null>(null); const tc4 = ref<HTMLElement | null>(null)
const sceneRef = ref<HTMLElement | null>(null)
const hiveRef = ref<HTMLElement | null>(null)
const honeyGlow = ref<HTMLElement | null>(null)
const warmAmbient = ref<HTMLElement | null>(null)
const hiveInfo = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)

const ringRefs = ref<(HTMLElement | null)[]>([])
const visitedCells = ref(0)
const cleanupFns: TweenCleanup[] = []

function setRingRef(el: HTMLElement | null, idx: number) { ringRefs.value[idx] = el }

function setupEntrance() {
  if (!scrollRef.value || !headerRef.value || !sceneRef.value) return
  const tl = gsap.timeline({ scrollTrigger: { trigger: scrollRef.value, scroller: scrollRef.value, start: 'top 75%', toggleActions: 'play none none reverse' } })
  const chars = [tc1.value, tc2.value, tc3.value, tc4.value]
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.85, ease: 'power3.out' })
    .fromTo(chars, { autoAlpha: 0, y: 80, filter: 'blur(16px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.6, stagger: 0.1, ease: 'power3.out' }, '-=0.4')
    .fromTo(lineRef.value, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power3.inOut' }, '-=0.25')
    .fromTo(sceneRef.value, { autoAlpha: 0, scale: 0.6, rotateX: -20 }, { autoAlpha: 1, scale: 1, rotateX: -5, duration: 1, ease: 'power4.out' }, '-=0.4')
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

function setupHoneycomb() {
  if (!scrollRef.value || !trackRef.value || !hiveRef.value) return
  const scroller = scrollRef.value; const track = trackRef.value

  const els = ringRefs.value.filter(Boolean) as HTMLElement[]

  // 初始定位
  els.forEach((el, i) => {
    const ring = hiveRings[i]
    gsap.set(el, { translateZ: ring.z, scale: ring.scale, opacity: 0.28 + (1 - i * 0.1) })
  })

  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.3,
      onUpdate(self) { visitedCells.value = Math.min(RING_COUNT * 6, Math.max(1, Math.ceil(self.progress * RING_COUNT * 6))) },
    },
  })

  const totalDist = RING_COUNT * 230 * 0.75

  // 🍯 所有蜂巢环向相机推进
  els.forEach((el, i) => {
    master.fromTo(el,
      { translateZ: hiveRings[i].z, scale: hiveRings[i].scale, opacity: 0.28 + (1 - i * 0.1) },
      { translateZ: hiveRings[i].z + totalDist, scale: 1.1, opacity: 1, duration: 7, ease: 'power2.in' },
      0
    )
  })

  // 整体视角
  if (hiveRef.value) {
    master.to(hiveRef.value, { rotateZ: 60, rotateY: 15, duration: 3.5, ease: 'sine.inOut' }, 0)
    master.to(hiveRef.value, { rotateZ: -30, rotateY: -15, duration: 3.5, ease: 'sine.inOut' }, 3.5)
  }

  // 暖光呼吸
  if (honeyGlow.value) master.to(honeyGlow.value, { scale: 1.8, opacity: 0.6, duration: 7, ease: 'sine.inOut' }, 0)
  if (warmAmbient.value) master.to(warmAmbient.value, { opacity: 0.7, duration: 7 }, 0)
  if (progRef.value) master.to(progRef.value, { width: '100%', duration: 7 }, 0)

  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }
onMounted(() => { requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupHoneycomb() })); window.addEventListener('resize', handleResize) })
onUnmounted(() => { window.removeEventListener('resize', handleResize); ScrollTrigger.getAll().forEach(st => st.kill()); cleanupFns.forEach(fn => fn()); cleanupFns.length = 0 })
</script>

<style scoped lang="scss">
.hny-root { position: relative; width: 100vw; height: 100vh; overflow: hidden; background: linear-gradient(170deg, #1a1410 0%, #221c14 20%, #1e1610 40%, #241c12 60%, #1a120e 80%, #1a1410 100%); font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif; }
.hny-glow { position: absolute; width: 30vw; height: 30vw; top: 50%; left: 50%; transform: translate(-50%, -50%); border-radius: 50%; background: radial-gradient(circle, rgba(255,180,60,.3) 0%, rgba(255,150,30,.1) 40%, transparent 65%); filter: blur(60px); pointer-events: none; z-index: 0; will-change: transform,opacity; }
.hny-ambient { position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 50%, rgba(255,160,40,.04) 0%, transparent 60%); pointer-events: none; z-index: 0; will-change: opacity; }
.hny-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 2; &::-webkit-scrollbar { width: 5px; } &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(255,160,50,.15); } }
.hny-track { position: relative; width: 100%; }
.hny-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }
.hny-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 30; text-align: center; width: min(92vw, 800px); }
.hny-kicker { display: inline-block; font-size: .58rem; font-weight: 700; letter-spacing: .28em; text-transform: uppercase; color: rgba(240,180,80,.75); background: rgba(200,140,40,.08); backdrop-filter: blur(8px); border: 1px solid rgba(220,160,60,.16); border-radius: 999px; padding: .22rem .9rem; margin-bottom: .5rem; }
.hny-title { margin: 0; display: flex; justify-content: center; gap: .08em; }
.hny-title__c { display: inline-block; font-size: clamp(2rem, 5vw, 4.2rem); font-weight: 900; color: #e0a840; will-change: transform,opacity,filter;
  &--honey { background: linear-gradient(135deg, #f0b840, #f09030, #e0c060); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 2px 16px rgba(240,180,60,.5)); }
}
.hny-line { width: 90px; height: 2px; margin: .4rem auto .55rem; border-radius: 2px; background: linear-gradient(90deg, transparent, #f0b840, #f09030, #e0c060, transparent); transform-origin: center; }
.hny-sub { margin: 0; font-size: clamp(.64rem, .9vw, .78rem); color: rgba(220,160,60,.3); max-width: 550px; margin-inline: auto; }

.hny-scene { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 10; perspective: 550px; perspective-origin: 50% 50%; will-change: transform,opacity; }
.hny-hive { position: relative; width: 0; height: 0; transform-style: preserve-3d; will-change: transform; }

$hexSize: min(10vw, 80px);
$ringRadius: min(24vw, 200px);

.hny-ring {
  position: absolute; width: 0; height: 0;
  transform-style: preserve-3d; will-change: transform, opacity;
  &__frame { position: absolute; width: calc($ringRadius * 2); height: calc($ringRadius * 2); margin-left: calc($ringRadius * -1); margin-top: calc($ringRadius * -1); border-radius: 50%; border: 1px solid rgba(240,180,60,.08); pointer-events: none; }
}

// 🍯 六边形巢室
.hny-cell {
  position: absolute; width: $hexSize; height: calc($hexSize * 1.15);
  margin-left: calc($hexSize / -2); margin-top: calc($hexSize * 1.15 / -2);
  transform-style: preserve-3d;

  &__hex {
    width: 100%; height: 100%;
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    overflow: hidden;
    border-radius: 2px;
    box-shadow: 0 0 20px rgba(240,180,60,.15), 0 0 0 1px rgba(240,180,60,.2);
  }
  &__img { width: 100%; height: 100%; object-fit: cover; display: block; }
  &__honey { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(240,180,40,.08) 0%, transparent 40%, rgba(240,150,30,.1) 100%); pointer-events: none; }

  // 六边形在环上的6个位置
  &--top        { margin-top: calc($ringRadius * -1); }
  &--topright   { margin-top: calc($ringRadius * -0.5); margin-left: calc($ringRadius * 0.87 - $hexSize / 2); }
  &--bottomright{ margin-top: calc($ringRadius * 0.5 - $hexSize * 1.15 / 2); margin-left: calc($ringRadius * 0.87 - $hexSize / 2); }
  &--bottom     { margin-top: calc($ringRadius - $hexSize * 1.15 / 2); }
  &--bottomleft { margin-top: calc($ringRadius * 0.5 - $hexSize * 1.15 / 2); margin-left: calc($ringRadius * -0.87 - $hexSize / 2); }
  &--topleft    { margin-top: calc($ringRadius * -0.5); margin-left: calc($ringRadius * -0.87 - $hexSize / 2); }
}

.hny-info { position: absolute; bottom: 10vh; left: 50%; transform: translateX(-50%); z-index: 25; display: flex; align-items: center; gap: .4rem; pointer-events: none; }
.hny-info__icon { font-size: .9rem; }
.hny-info__text { font-size: .6rem; font-weight: 600; color: rgba(240,180,80,.6); letter-spacing: .1em; }
.hny-progress { position: absolute; left: 0; bottom: 0; z-index: 30; width: 100%; height: 3px; background: rgba(220,150,40,.05); }
.hny-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #f0b840, #f09030, #e0c060, #f0b840); background-size: 200% 100%; box-shadow: 0 0 12px rgba(240,180,60,.5); }

@media (max-width: 768px) { .hny-header { top: 2vh; } .hny-kicker { font-size: .42rem; padding: .1rem .4rem; } .hny-title__c { font-size: 1.3rem; } }
</style>
