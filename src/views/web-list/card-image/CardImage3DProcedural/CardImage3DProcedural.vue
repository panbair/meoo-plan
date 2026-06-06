<template>
  <section ref="rootRef" class="pw-root">
    <div ref="scrollRef" class="pw-scroll">
      <div ref="trackRef" class="pw-track" :style="{ height: trackHeight }">
        <div class="pw-sticky">

          <header ref="headerRef" class="pw-header">
            <span class="pw-kicker">🌊 纯CSS 数学建模 · 图片马赛克 · 程序化3D波浪 🌊</span>
            <h1 class="pw-title">
              <span ref="tc1" class="pw-title__c">图</span>
              <span ref="tc2" class="pw-title__c pw-title__c--wave">像</span>
              <span ref="tc3" class="pw-title__c">波</span>
              <span ref="tc4" class="pw-title__c pw-title__c--wave">浪</span>
            </h1>
            <div ref="dividerRef" class="pw-divider"></div>
            <p ref="subRef" class="pw-sub">
              向下滚动 · {{ COLS }}×{{ ROWS }}={{ TOTAL }}图片碎片 · nth-child相位 · 纯CSS 3D马赛克波浪 · 零JS动画
            </p>
          </header>

          <!-- ════════════════ 3D 图片马赛克波浪 ════════════════ -->
          <div ref="sceneRef" class="pw-scene">
            <div ref="stageRef" class="pw-stage">

              <!-- 🔑 {{ TOTAL }}个图片碎片 — 每个显示大图的不同区域, Z轴纯CSS波浪 -->
              <div
                v-for="i in TOTAL"
                :key="i"
                class="pw-node"
                :style="{
                  '--col': (i - 1) % COLS,
                  '--row': Math.floor((i - 1) / COLS),
                  '--bgx': ((i - 1) % COLS) / (COLS - 1) * 100 + '%',
                  '--bgy': Math.floor((i - 1) / COLS) / (ROWS - 1) * 100 + '%',
                  marginLeft: nodeW / -2 + 'px',
                  marginTop: nodeH / -2 + 'px',
                  transform: `translateX(${((i - 1) % COLS - cx) * gapX}px) translateY(${(Math.floor((i - 1) / COLS) - ry) * gapY}px)`,
                }"
              >
                <!-- 🔑 图片碎片 — background-position 显示大图的对应区域 -->
                <div class="pw-node__tile"></div>
                <!-- 3D厚度 -->
                <div class="pw-node__edge"></div>
              </div>

            </div>
          </div>

          <div ref="infoBar" class="pw-info">
            <span class="pw-info__text">纯CSS: {{ TOTAL }}个图片碎片 · nth-child相位注入 · @keyframes 3D波浪 · 零JS动画</span>
          </div>

          <div class="pw-progress"><div ref="progRef" class="pw-progress__fill"></div></div>
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

const COLS = 6; const ROWS = 4; const TOTAL = COLS * ROWS
const nodeW = 260; const nodeH = 180; const gapX = 280; const gapY = 200
const cx = (COLS - 1) / 2; const ry = (ROWS - 1) / 2

const STAGES = 5; const trackHeight = `${(STAGES + 1) * 100}vh`
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
const infoBar = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)
const cleanupFns: (() => void)[] = []

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
  const master = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.3 } })
  master.to(stage, { rotateX: 50, rotateY: -10, duration: D * .4 }, 0)
  master.to(stage, { rotateX: -20, rotateY: 15, duration: D * .5 }, D * .35)
  master.to(stage, { rotateX: 40, rotateY: 0, duration: D * .3 }, D * .7)
  if (progRef.value) master.to(progRef.value, { width: '100%', duration: D }, 0)
  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

onMounted(() => { requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupScene() })) })
onUnmounted(() => { ScrollTrigger.getAll().forEach(st => st.kill()); cleanupFns.forEach(fn => fn()); cleanupFns.length = 0 })
</script>

<style scoped lang="scss">
.pw-root {
  position: relative; width: 100vw; height: 100vh; overflow: hidden;
  background: radial-gradient(ellipse 55% 45% at 50% 48%, #080618 0%, #020108 55%, #000 100%);
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, monospace;
}
.pw-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 5;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(60,140,220,.06); }
}
.pw-track { position: relative; width: 100%; }
.pw-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

.pw-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 40; text-align: center; width: min(92vw, 800px); pointer-events: none; }
.pw-kicker { display: inline-block; font-size: .44rem; font-weight: 700; letter-spacing: .16em; color: rgba(60,160,220,.5); background: rgba(30,120,200,.04); backdrop-filter: blur(8px); border: 1px solid rgba(30,120,200,.08); border-radius: 999px; padding: .1rem .65rem; margin-bottom: .4rem; }
.pw-title { margin: 0; display: flex; justify-content: center; gap: .06em; }
.pw-title__c { display: inline-block; font-size: clamp(2rem, 5.5vw, 4rem); font-weight: 900; color: #3898c8;
  &--wave { background: linear-gradient(150deg, #2098e0 0%, #50d0f8 30%, #c060e0 60%, #e080f0 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 2px 10px rgba(40,160,220,.5)); }
}
.pw-divider { width: 100px; height: 2px; margin: .3rem auto .4rem; background: linear-gradient(90deg, transparent, #2098e0, #c060e0, #2098e0, transparent); }
.pw-sub { margin: 0; font-size: clamp(.46rem, 1vw, .6rem); color: rgba(40,140,210,.3); max-width: 520px; margin-inline: auto; }

/* ═══════════════ 3D 场景 ═══════════════ */
.pw-scene { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(.85); width: 0; height: 0; z-index: 10; perspective: 700px; perspective-origin: 50% 45%; }
.pw-stage { position: absolute; width: 0; height: 0; transform-style: preserve-3d; will-change: transform; }

/* ═══════════════ 🔑 图片碎片节点 ═══════════════ */
.pw-node {
  --col: 0; --row: 0; --bgx: 0%; --bgy: 0%;
  position: absolute; transform-style: preserve-3d;
  will-change: transform;

  // 🔑 纯CSS波浪动画
  animation: pw-wave 5s ease-in-out infinite;
  animation-delay: calc((var(--col) * 0.08s + var(--row) * 0.12s) * -1);
}

/* 🔑 图片碎片 — CSS background显示大图对应区域 */
.pw-node__tile {
  width: 260px; height: 180px; border-radius: 6px;
  // 🔑 大图URL + background-position精确定位每个碎片的图像区域
  background-image: url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80');
  background-size: 600% 400%; // COLS×100% ROWS×100%
  background-position: var(--bgx) var(--bgy);
  box-shadow: 0 6px 24px rgba(0,0,0,.3);
  // 亮度随行变化 — 近处亮远处暗
  filter: brightness(calc(.6 + var(--row) * .07));
}

/* 3D厚度边缘 */
.pw-node__edge {
  position: absolute; top: 0; left: 0; right: 0; height: 8px; border-radius: 6px 6px 0 0;
  background: rgba(0,0,0,.3);
  transform: translateZ(8px) rotateX(-90deg);
  transform-origin: top center;
}

/* ═══════════════ 🔑 @keyframes 波浪 — 纯CSS计算 ═══════════════ */
@keyframes pw-wave {
  0%   { transform: translateZ(calc((var(--col) - 2.5) * 30px + (var(--row) - 1.5) * 20px)); opacity: .6; }
  12.5%{ transform: translateZ(calc((var(--col) - 2.5) * 60px - (var(--row) - 1.5) * 30px + 80px)); opacity: .9; }
  25%  { transform: translateZ(calc((var(--col) - 2.5) * 40px + (var(--row) - 1.5) * 60px + 120px)); opacity: 1; }
  37.5%{ transform: translateZ(calc((var(--col) - 2.5) * 20px + (var(--row) - 1.5) * 30px + 50px)); opacity: .85; }
  50%  { transform: translateZ(calc((var(--col) - 2.5) * -30px - (var(--row) - 1.5) * 20px - 30px)); opacity: .55; }
  62.5%{ transform: translateZ(calc((var(--col) - 2.5) * -50px - (var(--row) - 1.5) * 40px - 90px)); opacity: .75; }
  75%  { transform: translateZ(calc((var(--col) - 2.5) * -40px - (var(--row) - 1.5) * 60px - 120px)); opacity: 1; }
  87.5%{ transform: translateZ(calc((var(--col) - 2.5) * -15px - (var(--row) - 1.5) * 20px - 45px)); opacity: .8; }
  100% { transform: translateZ(calc((var(--col) - 2.5) * 30px + (var(--row) - 1.5) * 20px)); opacity: .6; }
}

.pw-info { position: absolute; bottom: 10vh; left: 50%; transform: translateX(-50%); z-index: 35; pointer-events: none; }
.pw-info__text { font-size: .44rem; font-weight: 600; letter-spacing: .06em; color: rgba(40,140,210,.3); font-family: 'Courier New', monospace; white-space: nowrap; }

.pw-progress { position: absolute; left: 0; bottom: 0; z-index: 40; width: 100%; height: 2px; background: rgba(30,120,200,.02); }
.pw-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #2098e0, #c060e0, #2098e0); }

@media (max-width: 768px) { .pw-scene { transform: translate(-50%, -50%) scale(.5); } .pw-kicker { font-size: .28rem; } .pw-title__c { font-size: 1.3rem; } }
</style>
