<template>
  <section ref="rootRef" class="lf-root">
    <div ref="glowA" class="lf-glow lf-glow--a"></div>
    <div ref="glowB" class="lf-glow lf-glow--b"></div>

    <div ref="scrollRef" class="lf-scroll">
      <div ref="trackRef" class="lf-track" :style="{ height: trackHeight }">
        <div class="lf-sticky">

          <header ref="headerRef" class="lf-header">
            <span class="lf-kicker">◈ CSS @property · 光影流转 · 3D 立方体 ◈</span>
            <h1 class="lf-title">
              <span ref="tc1" class="lf-title__c">光</span>
              <span ref="tc2" class="lf-title__c lf-title__c--flow">影</span>
              <span ref="tc3" class="lf-title__c">流</span>
              <span ref="tc4" class="lf-title__c lf-title__c--flow">转</span>
            </h1>
            <div ref="dividerRef" class="lf-divider"></div>
            <p ref="subRef" class="lf-sub">
              向下滚动旋转立方体 · @property conic-gradient 高光 · 金属光影流动
            </p>
          </header>

          <!-- ════════════════ 3D 场景 ════════════════ -->
          <div ref="sceneRef" class="lf-scene">
            <!-- 🔑 立方体 — 6面各用conic-gradient + @property高光 -->
            <div ref="cubeRef" class="lf-cube">
              <div class="lf-face lf-face--front">
                <img :src="images[0]" alt="" class="lf-face__img" loading="lazy" />
                <div class="lf-face__sheen lf-face__sheen--front"></div>
              </div>
              <div class="lf-face lf-face--back">
                <img :src="images[1]" alt="" class="lf-face__img" loading="lazy" />
                <div class="lf-face__sheen lf-face__sheen--back"></div>
              </div>
              <div class="lf-face lf-face--right">
                <img :src="images[2]" alt="" class="lf-face__img" loading="lazy" />
                <div class="lf-face__sheen lf-face__sheen--right"></div>
              </div>
              <div class="lf-face lf-face--left">
                <img :src="images[3]" alt="" class="lf-face__img" loading="lazy" />
                <div class="lf-face__sheen lf-face__sheen--left"></div>
              </div>
              <div class="lf-face lf-face--top">
                <img :src="images[4]" alt="" class="lf-face__img" loading="lazy" />
                <div class="lf-face__sheen lf-face__sheen--top"></div>
              </div>
              <div class="lf-face lf-face--bottom">
                <img :src="images[5]" alt="" class="lf-face__img" loading="lazy" />
                <div class="lf-face__sheen lf-face__sheen--bottom"></div>
              </div>
            </div>
          </div>

          <div ref="infoPanel" class="lf-info">
            <span class="lf-info__text">光源角度 · @property 连续旋转 · 金属高光</span>
          </div>

          <div class="lf-progress"><div ref="progRef" class="lf-progress__fill"></div></div>
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

const images = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80',
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=600&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80',
  'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=600&q=80',
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&q=80',
]

const CUBE_SIZE = 260
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
const cubeRef = ref<HTMLElement | null>(null)
const glowA = ref<HTMLElement | null>(null)
const glowB = ref<HTMLElement | null>(null)
const infoPanel = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)
const cleanupFns: TweenCleanup[] = []

function setupEntrance() {
  if (!scrollRef.value || !headerRef.value) return
  const scroller = scrollRef.value
  const chars = [tc1.value, tc2.value, tc3.value, tc4.value].filter(Boolean)
  const tl = gsap.timeline({ scrollTrigger: { trigger: scrollRef.value, scroller, start: 'top 75%', toggleActions: 'play none none reverse' } })
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: .75, ease: 'power3.out' })
    .fromTo(chars, { autoAlpha: 0, z: -200, scale: .3, filter: 'blur(8px)' }, { autoAlpha: 1, z: 0, scale: 1, filter: 'blur(0px)', duration: .55, stagger: .08, ease: 'back.out(1.6)' }, '-=.3')
    .fromTo(dividerRef.value, { scaleX: 0 }, { scaleX: 1, duration: .45, ease: 'power3.inOut' }, '-=.15')
    .fromTo(subRef.value, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .5, ease: 'power2.out' }, '-=.08')
    .fromTo(sceneRef.value, { autoAlpha: 0, scale: .9 }, { autoAlpha: 1, scale: 1, duration: .85, ease: 'power3.out' }, '-=.25')
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

function setupCubeRotation() {
  if (!scrollRef.value || !trackRef.value || !cubeRef.value) return
  const scroller = scrollRef.value; const track = trackRef.value; const cube = cubeRef.value
  const D = STAGES

  gsap.set(cube, { rotateX: -20, rotateY: 25 })

  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.2 },
  })

  // 立方体旋转 — 展示各个面
  master.to(cube, { rotateY: 380, rotateX: -20, duration: D * .4 }, 0)
  master.to(cube, { rotateX: -80, rotateY: 380, duration: D * .3 }, D * .35)
  master.to(cube, { rotateX: -80, rotateY: 740, duration: D * .3 }, D * .65)

  if (glowA.value) master.to(glowA.value, { x: '4vw', y: '-3vh', duration: D }, 0)
  if (glowB.value) master.to(glowB.value, { x: '-3vw', y: '3vh', duration: D }, 0)
  if (progRef.value) master.to(progRef.value, { width: '100%', duration: D }, 0)

  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }

onMounted(() => {
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupCubeRotation() }))
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
/* ═══════════════════════ 🔑 @property 注册光影角度变量 ═══════════════════════ */
/*
  普通 CSS 渐变无法动画，@property 打破铁律：
  注册 --light-angle 为 <angle> 类型 → 浏览器平滑插值 0deg→360deg
  应用到 conic-gradient → 高光在3D表面连续流转
*/
@property --light-angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

/* 🔑 第二光源 — 反向旋转产生复杂光影交错 */
@property --light-angle2 {
  syntax: '<angle>';
  inherits: false;
  initial-value: 180deg;
}

/* ═══════════════════════ 暗色金属空间 ═══════════════════════ */
.lf-root {
  position: relative; width: 100vw; height: 100vh; overflow: hidden;
  background: radial-gradient(ellipse 55% 45% at 50% 48%, #0e0c16 0%, #06040c 55%, #020106 100%);
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif;
}

.lf-glow { position: absolute; border-radius: 50%; filter: blur(60px); pointer-events: none; will-change: transform; z-index: 0; }
.lf-glow--a { width: 28vw; height: 28vw; top: -5vh; left: -3vw; background: radial-gradient(circle, rgba(200,160,100,.1) 0%, transparent 70%); }
.lf-glow--b { width: 24vw; height: 24vw; bottom: -4vh; right: -2vw; background: radial-gradient(circle, rgba(160,120,200,.08) 0%, transparent 70%); }

/* ── 滚动 ── */
.lf-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 5;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(200,160,100,.1); }
}
.lf-track { position: relative; width: 100%; }
.lf-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

/* ── 标题 ── */
.lf-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 40; text-align: center; width: min(92vw, 800px); pointer-events: none; }
.lf-kicker { display: inline-block; font-size: .54rem; font-weight: 700; letter-spacing: .24em; color: rgba(200,160,100,.6); background: rgba(200,150,100,.04); backdrop-filter: blur(8px); border: 1px solid rgba(180,130,100,.1); border-radius: 999px; padding: .18rem .9rem; margin-bottom: .45rem; }
.lf-title { margin: 0; display: flex; justify-content: center; gap: .06em; }
.lf-title__c { display: inline-block; font-size: clamp(2rem, 5.5vw, 4.4rem); font-weight: 900; color: #c8a878;
  &--flow {
    background: linear-gradient(150deg, #e8c080 0%, #d4a060 25%, #f0d090 50%, #c89850 75%, #e8c080 100%);
    background-size: 200% 100%;
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    filter: drop-shadow(0 2px 8px rgba(220,180,120,.5));
    animation: lf-title-flow 3s linear infinite;
  }
}
@keyframes lf-title-flow { to { background-position: -200% 0; } }
.lf-divider { width: 100px; height: 2px; margin: .35rem auto .45rem; background: linear-gradient(90deg, transparent, #e8c080, #c89850, #e8c080, transparent); }
.lf-sub { margin: 0; font-size: clamp(.56rem, 1vw, .72rem); color: rgba(180,140,100,.3); max-width: 500px; margin-inline: auto; }

/* ═══════════════════════ 3D 场景 ═══════════════════════ */
.lf-scene {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 0; height: 0; z-index: 10;
  perspective: 1000px;
  perspective-origin: 50% 48%;
}
.lf-cube {
  position: absolute; width: 0; height: 0;
  transform-style: preserve-3d;
  will-change: transform;
}

/* ═══════════════════════ 立方体面 ═══════════════════════ */
$size: 260px;
$half: calc($size / 2);

.lf-face {
  position: absolute;
  width: $size; height: $size;
  margin-left: -$half; margin-top: -$half;
  backface-visibility: hidden;
  overflow: hidden; border-radius: 8px;
  box-shadow: 0 0 0 1px rgba(255,255,255,.06), 0 12px 40px rgba(0,0,0,.3);
}
.lf-face__img { width: 100%; height: 100%; object-fit: cover; display: block; filter: brightness(.75) saturate(.8); }

/* ═══════════════ 🔑 高光层 — @property 驱动的conic-gradient ═══════════════ */
.lf-face__sheen {
  position: absolute; inset: 0; pointer-events: none; z-index: 2;
  mix-blend-mode: soft-light;

  // 🔑 conic-gradient 使用 --light-angle → 高光环绕表面旋转!
  background:
    // 主光源高光 — conic-gradient 锥形光斑
    conic-gradient(
      from var(--light-angle) at 50% 50%,
      transparent 0deg,
      transparent 300deg,
      rgba(255,255,255,.12) 320deg,
      rgba(255,255,255,.3) 340deg,
      rgba(255,255,255,.15) 350deg,
      transparent 360deg
    ),
    // 辅助环境光反射
    radial-gradient(ellipse 40% 30% at 30% 30%, rgba(255,255,255,.06) 0%, transparent 60%);

  // 🔑 @property 让这个动画成为可能!
  animation: lf-light-spin 4s linear infinite;
}

// 各面微调高光
.lf-face__sheen--front  { animation-delay: 0s; }
.lf-face__sheen--back   { animation-delay: -0.67s; }
.lf-face__sheen--right  { animation-delay: -1.33s; }
.lf-face__sheen--left   { animation-delay: -2s; }
.lf-face__sheen--top    { animation-delay: -2.67s; }
.lf-face__sheen--bottom { animation-delay: -3.33s; }

/* 🔑 @keyframes 驱动 --light-angle 0deg→360deg */
@keyframes lf-light-spin {
  0%   { --light-angle: 0deg;   --light-angle2: 180deg; }
  50%  { --light-angle: 180deg; --light-angle2: 360deg; }
  100% { --light-angle: 360deg; --light-angle2: 540deg; }
}

/* 6面3D定位 */
.lf-face--front  { transform: translateZ($half); }
.lf-face--back   { transform: translateZ(-$half) rotateY(180deg); }
.lf-face--right  { transform: translateX($half) rotateY(90deg); }
.lf-face--left   { transform: translateX(-$half) rotateY(-90deg); }
.lf-face--top    { transform: translateY(-$half) rotateX(90deg); }
.lf-face--bottom { transform: translateY($half) rotateX(-90deg); }

/* ── 信息面板 ── */
.lf-info { position: absolute; bottom: 10vh; left: 50%; transform: translateX(-50%); z-index: 35; pointer-events: none; }
.lf-info__text { font-size: .56rem; font-weight: 600; letter-spacing: .14em; color: rgba(200,160,100,.5); font-family: 'Courier New', monospace; background: rgba(8,4,2,.5); backdrop-filter: blur(8px); border-radius: 999px; padding: .15rem .85rem; border: 1px solid rgba(180,130,100,.1); }

.lf-progress { position: absolute; left: 0; bottom: 0; z-index: 40; width: 100%; height: 2px; background: rgba(200,150,100,.02); }
.lf-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #e8c080, #c89850, #e8c080); }

@media (max-width: 768px) {
  .lf-header { top: 2vh; } .lf-kicker { font-size: .38rem; } .lf-title__c { font-size: 1.4rem; }
  .lf-scene { perspective: 700px; }
  .lf-face { width: 180px; height: 180px; margin-left: -90px; margin-top: -90px; }
  .lf-face--front  { transform: translateZ(90px); }
  .lf-face--back   { transform: translateZ(-90px) rotateY(180deg); }
  .lf-face--right  { transform: translateX(90px) rotateY(90deg); }
  .lf-face--left   { transform: translateX(-90px) rotateY(-90deg); }
  .lf-face--top    { transform: translateY(-90px) rotateX(90deg); }
  .lf-face--bottom { transform: translateY(90px) rotateX(-90deg); }
}
</style>
