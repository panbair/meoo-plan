<template>
  <section ref="rootRef" class="pg-root">
    <div ref="glowA" class="pg-glow pg-glow--a"></div>
    <div ref="glowB" class="pg-glow pg-glow--b"></div>

    <div ref="scrollRef" class="pg-scroll">
      <div ref="trackRef" class="pg-track" :style="{ height: trackHeight }">
        <div class="pg-sticky">

          <header ref="headerRef" class="pg-header">
            <span class="pg-kicker">◈ CSS @property · 渐变驱动 · 3D 进度条 ◈</span>
            <h1 class="pg-title">
              <span ref="tc1" class="pg-title__c">流</span>
              <span ref="tc2" class="pg-title__c pg-title__c--flow">光</span>
              <span ref="tc3" class="pg-title__c">进</span>
              <span ref="tc4" class="pg-title__c pg-title__c--flow">度</span>
            </h1>
            <div ref="dividerRef" class="pg-divider"></div>
            <p ref="subRef" class="pg-sub">
              向下滚动 · @property 渐变过渡 · 3D立方体液体流光 · preserve-3d 立体进度
            </p>
          </header>

          <!-- ════════════════ 3D 场景 ════════════════ -->
          <div ref="sceneRef" class="pg-scene">
            <div ref="stageRef" class="pg-stage">

              <!-- ═══════════════ 🔑 3D 进度条主体 ═══════════════ -->
              <div ref="barWrapper" class="pg-bar-wrapper">

                <!-- 进度条背面 -->
                <div class="pg-bar-back"></div>

                <!-- 🔑 进度条填充层 — 使用 @property 驱动的流动渐变 -->
                <div ref="barFill" class="pg-bar-fill"></div>

                <!-- 进度条顶面 — 3D厚度 -->
                <div class="pg-bar-top"></div>

                <!-- 进度条前面板 — 透明玻璃 -->
                <div class="pg-bar-front"></div>

                <!-- 🔑 刻度标记 (8个) -->
                <div
                  v-for="tick in 8"
                  :key="tick"
                  class="pg-tick"
                  :style="{ left: `${tick * 12.5}%`, opacity: progress >= tick * 12.5 ? 1 : 0.2 }"
                ></div>

                <!-- 🔑 流动高光点 -->
                <div class="pg-flow-dot" :style="{ left: `${progress}%` }"></div>
              </div>

              <!-- 进度百分比 -->
              <div ref="percentDisplay" class="pg-percent">
                <span class="pg-percent__value">{{ Math.round(progress) }}%</span>
                <span class="pg-percent__label">SYSTEM.CHARGE</span>
              </div>

            </div>
          </div>

          <div class="pg-progress"><div ref="progRef" class="pg-progress__fill"></div></div>
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

// ═══════════════════════════════════════════════════════════════════════
//  CardImage3DPropGradient — CSS @property 渐变驱动 · 3D 进度条
//
//  核心创新：@property 注册自定义变量 → 渐变百分比节点平滑过渡
//
//  传统 CSS 渐变无法动画 → @property 突破限制
//
//  技术栈：
//  1. 🔑 @property --pg-fill 注册 <percentage> 类型
//  2. 🔑 @keyframes 驱动 --pg-fill 0%→100%→0% 循环
//  3. 🔑 linear-gradient 使用 --pg-fill → 渐变像液体流动
//  4. 🔑 @property --pg-shift 色相偏移 → 色彩流动
//  5. preserve-3d 构建3D进度条几何体
//  6. GSAP ScrollTrigger 驱动实际进度值
//  7. 流动渐变 + 立体厚度 + 玻璃面板 = 科技感3D进度
//
//  设计风格：暗色科技 · 流动液体光 · 赛博进度条
// ═══════════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

const PROGRESS_STAGES = 5
const trackHeight = `${(PROGRESS_STAGES + 1) * 100}vh`

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
const stageRef = ref<HTMLElement | null>(null)
const barWrapper = ref<HTMLElement | null>(null)
const barFill = ref<HTMLElement | null>(null)
const percentDisplay = ref<HTMLElement | null>(null)
const glowA = ref<HTMLElement | null>(null)
const glowB = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)

const progress = ref(0)
const cleanupFns: TweenCleanup[] = []

// ═══════════════════════ 入场 ═══════════════════════
function setupEntrance() {
  if (!scrollRef.value || !headerRef.value) return
  const scroller = scrollRef.value
  const chars = [tc1.value, tc2.value, tc3.value, tc4.value].filter(Boolean)
  const tl = gsap.timeline({ scrollTrigger: { trigger: scrollRef.value, scroller, start: 'top 75%', toggleActions: 'play none none reverse' } })
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: .75, ease: 'power3.out' })
    .fromTo(chars, { autoAlpha: 0, z: -200, scale: .3, filter: 'blur(8px)' }, { autoAlpha: 1, z: 0, scale: 1, filter: 'blur(0px)', duration: .55, stagger: .08, ease: 'back.out(1.6)' }, '-=.3')
    .fromTo(dividerRef.value, { scaleX: 0 }, { scaleX: 1, duration: .45, ease: 'power3.inOut' }, '-=.15')
    .fromTo(subRef.value, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .5, ease: 'power2.out' }, '-=.08')
    .fromTo(sceneRef.value, { autoAlpha: 0, scale: .92 }, { autoAlpha: 1, scale: 1, duration: .85, ease: 'power3.out' }, '-=.25')
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

// ═══════════════════════ 进度驱动 ═══════════════════════
function setupProgress() {
  if (!scrollRef.value || !trackRef.value || !barFill.value) return
  const scroller = scrollRef.value; const track = trackRef.value; const fill = barFill.value

  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.2,
      onUpdate(self) {
        progress.value = self.progress * 100
        // 🔑 更新填充宽度
        fill.style.width = `${progress.value}%`
      },
    },
  })

  const D = PROGRESS_STAGES

  // 🔑 3D 进度条旋转展示
  if (barWrapper.value) {
    master.to(barWrapper.value, { rotateX: 5, rotateY: -8, duration: D * .35, ease: 'power2.inOut' }, 0)
    master.to(barWrapper.value, { rotateX: -8, rotateY: 12, duration: D * .35, ease: 'power2.inOut' }, D * .3)
    master.to(barWrapper.value, { rotateX: 0, rotateY: -5, duration: D * .2, ease: 'power2.inOut' }, D * .6)
    master.to(barWrapper.value, { rotateX: 0, rotateY: 0, duration: D * .2, ease: 'back.out(1.2)' }, D * .8)
  }

  // 刻度高亮扫过
  if (percentDisplay.value) {
    for (let i = 0; i <= 4; i++) {
      master.to(percentDisplay.value, { scale: 1.15, duration: .12, ease: 'power2.out' }, i + .3)
      master.to(percentDisplay.value, { scale: 1, duration: .25, ease: 'power2.in' }, i + .42)
    }
  }

  if (glowA.value) master.to(glowA.value, { x: '5vw', y: '-3vh', scale: 1.2, duration: D }, 0)
  if (glowB.value) master.to(glowB.value, { x: '-3vw', y: '3vh', scale: 1.15, duration: D }, 0)
  if (progRef.value) master.to(progRef.value, { width: '100%', duration: D }, 0)

  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }

onMounted(() => {
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupProgress() }))
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
/* ═══════════════════════ 🔑 @property 注册自定义渐变变量 ═══════════════════════ */
/*
  传统 CSS 渐变 (linear-gradient) 的百分比节点无法进行过渡动画。
  @property 规则让浏览器知道 --pg-fill 是一个 <percentage> 类型，
  从而可以平滑插值 0%→100%，实现渐变像液体一样流动！
*/
@property --pg-fill {
  syntax: '<percentage>';
  inherits: false;
  initial-value: 0%;
}

/* 🔑 色相偏移变量 — 让渐变颜色也流动起来 */
@property --pg-shift {
  syntax: '<number>';
  inherits: false;
  initial-value: 0;
}

/* ═══════════════════════ 暗色科技空间 ═══════════════════════ */
.pg-root {
  position: relative; width: 100vw; height: 100vh; overflow: hidden;
  background: radial-gradient(ellipse 55% 45% at 50% 48%, #0c0a14 0%, #050308 55%, #010004 100%);
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, monospace;
}

.pg-glow { position: absolute; border-radius: 50%; filter: blur(65px); pointer-events: none; will-change: transform; z-index: 0; }
.pg-glow--a { width: 30vw; height: 30vw; top: -5vh; left: -3vw; background: radial-gradient(circle, rgba(0,200,240,.12) 0%, transparent 70%); }
.pg-glow--b { width: 28vw; height: 28vw; bottom: -4vh; right: -2vw; background: radial-gradient(circle, rgba(200,0,200,.1) 0%, transparent 70%); }

/* ── 滚动 ── */
.pg-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 5;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(0,200,240,.1); }
}
.pg-track { position: relative; width: 100%; }
.pg-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

/* ── 标题 ── */
.pg-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 40; text-align: center; width: min(92vw, 800px); pointer-events: none; }
.pg-kicker { display: inline-block; font-size: .54rem; font-weight: 700; letter-spacing: .24em; color: rgba(0,210,240,.6); background: rgba(0,180,220,.04); backdrop-filter: blur(8px); border: 1px solid rgba(0,180,220,.12); border-radius: 999px; padding: .18rem .9rem; margin-bottom: .45rem; }
.pg-title { margin: 0; display: flex; justify-content: center; gap: .06em; }
.pg-title__c { display: inline-block; font-size: clamp(2rem, 5.5vw, 4.4rem); font-weight: 900; color: #40c8e0; will-change: transform,opacity,filter;
  &--flow {
    background: linear-gradient(150deg, #00e0ff 0%, #40f0ff 20%, #d040f0 50%, #f060e0 80%, #00e0ff 100%);
    background-size: 200% 100%;
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    filter: drop-shadow(0 2px 12px rgba(0,220,255,.5));
    animation: pg-title-flow 3s linear infinite;
  }
}
@keyframes pg-title-flow { to { background-position: -200% 0; } }
.pg-divider { width: 110px; height: 2px; margin: .35rem auto .45rem; border-radius: 2px; background: linear-gradient(90deg, transparent, #00e0ff, #d040f0, #00e0ff, transparent); }
.pg-sub { margin: 0; font-size: clamp(.6rem, 1vw, .76rem); color: rgba(0,200,230,.3); max-width: 500px; margin-inline: auto; }

/* ═══════════════════════ 3D 场景 ═══════════════════════ */
.pg-scene {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 0; height: 0; z-index: 10;
  perspective: 900px;
  perspective-origin: 50% 48%;
  will-change: transform;
}
.pg-stage {
  position: absolute; width: 0; height: 0;
  transform-style: preserve-3d;
}

/* ═══════════════════════ 🔑 3D 进度条 ═══════════════════════ */
.pg-bar-wrapper {
  position: absolute;
  width: min(70vw, 560px); height: 60px;
  margin-left: calc(min(70vw, 560px) / -2);
  margin-top: -30px;
  transform-style: preserve-3d;
  will-change: transform;
}

/* 进度条背面 (Z:-8px) */
.pg-bar-back {
  position: absolute; inset: 0; border-radius: 8px;
  background: rgba(255,255,255,.03);
  border: 1px solid rgba(255,255,255,.06);
  transform: translateZ(-8px);
  box-shadow: 0 0 30px rgba(0,0,0,.3);
}

/* ═══════════ 🔑 进度条填充 — @property 驱动流动渐变 ═══════════ */
.pg-bar-fill {
  position: absolute; top: 2px; left: 2px; bottom: 2px;
  width: 0%; // JS 动态驱动
  border-radius: 6px; z-index: 2;
  transform: translateZ(0px);

  // 🔑 @property 变量驱动的渐变 — 像液体一样流动!
  background: linear-gradient(90deg,
    rgba(0,220,255,.9) 0%,
    rgba(0,240,255,.8) var(--pg-fill),           // ← 🔑 动画化的渐变节点
    rgba(180,40,240,.75) calc(var(--pg-fill) + 15%),
    rgba(0,220,255,.7) calc(var(--pg-fill) + 30%),
    rgba(0,200,240,.5) 100%
  );

  // 🔑 @property 让渐变动画成为可能
  animation: pg-gradient-flow 3s ease-in-out infinite;

  // 内发光
  box-shadow: inset 0 1px 0 rgba(255,255,255,.15), 0 0 20px rgba(0,220,255,.2);

  // 纹理叠加
  &::after {
    content: ''; position: absolute; inset: 0; border-radius: 6px;
    background: repeating-linear-gradient(90deg,
      transparent, transparent 4px, rgba(255,255,255,.03) 4px, rgba(255,255,255,.03) 6px
    );
    mask-image: linear-gradient(90deg, transparent 0%, rgba(0,0,0,.3) 20%, rgba(0,0,0,.5) 50%, rgba(0,0,0,.3) 80%, transparent 100%);
  }
}

/* 🔑 @keyframes 驱动 --pg-fill 变量 → 渐变节点前后移动 */
@keyframes pg-gradient-flow {
  0%   { --pg-fill: 20%;  --pg-shift: 0; }
  25%  { --pg-fill: 55%;  --pg-shift: 1; }
  50%  { --pg-fill: 80%;  --pg-shift: 2; }
  75%  { --pg-fill: 45%;  --pg-shift: 1; }
  100% { --pg-fill: 20%;  --pg-shift: 0; }
}

/* 进度条顶面 (Z:+4px — 3D厚度) */
.pg-bar-top {
  position: absolute; top: 0; left: 0; right: 0; height: 4px;
  border-radius: 8px 8px 0 0;
  background: linear-gradient(180deg, rgba(255,255,255,.08) 0%, rgba(255,255,255,.02) 100%);
  transform: translateZ(4px) rotateX(-90deg);
  transform-origin: top center;
}

/* 进度条前面板 (玻璃) */
.pg-bar-front {
  position: absolute; inset: 0; border-radius: 8px;
  background: rgba(0,200,240,.03);
  border: 1px solid rgba(0,200,240,.15);
  transform: translateZ(4px);
  box-shadow: inset 0 0 20px rgba(0,200,240,.03);
}

/* 刻度标记 */
.pg-tick {
  position: absolute; top: 50%; width: 1px; height: 14px; margin-top: -7px;
  background: rgba(0,220,240,.4);
  transform: translateZ(5px);
  transition: opacity .3s ease;
  z-index: 3;
}

/* 流动高光点 */
.pg-flow-dot {
  position: absolute; top: 50%; width: 8px; height: 8px; margin-left: -4px; margin-top: -4px;
  border-radius: 50%; z-index: 5;
  background: radial-gradient(circle, rgba(255,255,255,.9) 0%, rgba(0,240,255,.6) 40%, transparent 70%);
  box-shadow: 0 0 16px rgba(0,240,255,.6), 0 0 40px rgba(0,200,255,.3);
  transform: translateZ(6px);
  transition: left .15s ease-out;
}

/* 百分比显示 */
.pg-percent { position: absolute; bottom: -60px; left: 50%; transform: translateX(-50%); text-align: center; z-index: 20; will-change: transform; }
.pg-percent__value { display: block; font-size: 2.2rem; font-weight: 900; font-family: 'Courier New', monospace;
  background: linear-gradient(180deg, #00e0ff 0%, #d040f0 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  filter: drop-shadow(0 0 10px rgba(0,220,255,.4));
}
.pg-percent__label { display: block; font-size: .5rem; font-weight: 700; letter-spacing: .25em; color: rgba(0,200,230,.4); margin-top: 2px; }

.pg-progress { position: absolute; left: 0; bottom: 0; z-index: 40; width: 100%; height: 1px; background: rgba(0,200,240,.03); }
.pg-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #00e0ff, #d040f0); box-shadow: 0 0 6px rgba(0,220,255,.15); }

@media (max-width: 768px) {
  .pg-header { top: 2vh; } .pg-kicker { font-size: .36rem; } .pg-title__c { font-size: 1.4rem; }
  .pg-bar-wrapper { width: 80vw; height: 48px; margin-left: -40vw; margin-top: -24px; }
}
</style>
