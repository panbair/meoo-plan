<template>
  <!--
    ═══════════════════════════════════════════════════════
    CardImage3DScrollNative — 原生 CSS 滚动驱动动画
    ⚡ 零 JS 滚动监听 · animation-timeline: scroll()
    ═══════════════════════════════════════════════════════
  -->
  <section ref="rootRef" class="sn-root">
    <!-- 🔑 滚动进度指示 (纯CSS驱动, 无JS) -->
    <div class="sn-scroll-progress"></div>

    <header ref="headerRef" class="sn-header">
      <span class="sn-kicker">⚡ CSS 原生 · animation-timeline · 告别JS ⚡</span>
      <h1 class="sn-title">
        <span ref="tc1" class="sn-title__c">原</span>
        <span ref="tc2" class="sn-title__c sn-title__c--native">生</span>
        <span ref="tc3" class="sn-title__c">滚</span>
        <span ref="tc4" class="sn-title__c sn-title__c--native">动</span>
      </h1>
      <div ref="dividerRef" class="sn-divider"></div>
      <p ref="subRef" class="sn-sub">
        向下滚动 · animation-timeline:scroll() 驱动3D · 零JS监听 · 黄油顺滑60fps
      </p>
    </header>

    <!-- ════════════════ 3D 场景 ════════════════ -->
    <div class="sn-scene">
      <div class="sn-stage" ref="stageRef">

        <!-- 🔑 卡片1: rotateY 360° — 完整旋转 -->
        <div class="sn-card sn-card--1" :style="cardStyle(0)">
          <img :src="imgs[0]" alt="" class="sn-card__img" loading="lazy" />
          <span class="sn-card__tag">rotateY 360°</span>
        </div>

        <!-- 🔑 卡片2: translateZ + scale — 从远处飞来 -->
        <div class="sn-card sn-card--2" :style="cardStyle(1)">
          <img :src="imgs[1]" alt="" class="sn-card__img" loading="lazy" />
          <span class="sn-card__tag">translateZ + scale</span>
        </div>

        <!-- 🔑 卡片3: rotateX + opacity — 翻转淡入 -->
        <div class="sn-card sn-card--3" :style="cardStyle(2)">
          <img :src="imgs[2]" alt="" class="sn-card__img" loading="lazy" />
          <span class="sn-card__tag">rotateX + fade</span>
        </div>

        <!-- 🔑 卡片4: 组合3D — rotateY + translateZ + scale -->
        <div class="sn-card sn-card--4" :style="cardStyle(3)">
          <img :src="imgs[3]" alt="" class="sn-card__img" loading="lazy" />
          <span class="sn-card__tag">3合1 combo</span>
        </div>

      </div>
    </div>

    <!-- 🔑 纯CSS滚动进度条 (无JS!) -->
    <div class="sn-progress-native"></div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap } from 'gsap'

// ═══════════════════════════════════════════════════════════════════════
//  CardImage3DScrollNative — 原生 CSS animation-timeline: scroll()
//
//  🔑 黑科技：完全不需要 JS 监听滚动事件！
//
//  CSS 原生能力：
//  animation-timeline: scroll(root)  — 绑定动画到根滚动进度
//  animation-timeline: view()        — 绑定动画到元素可见性
//  animation-range: entry/exit/cover — 控制动画触发区间
//
//  浏览器支持: Chrome 115+, Edge 115+ (2023年8月)
//  性能: 浏览器原生合成器线程驱动 → 60fps 零主线程开销
//
//  设计风格：暗色科技 · 原生CSS驱动 · 零JS滚动
// ═══════════════════════════════════════════════════════════════════════

const imgs = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80',
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=600&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80',
]

const rootRef = ref<HTMLElement | null>(null)
const stageRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const subRef = ref<HTMLElement | null>(null)
const dividerRef = ref<HTMLElement | null>(null)
const tc1 = ref<HTMLElement | null>(null); const tc2 = ref<HTMLElement | null>(null)
const tc3 = ref<HTMLElement | null>(null); const tc4 = ref<HTMLElement | null>(null)

const cleanupFns: (() => void)[] = []

const positions = [
  { transform: 'translateZ(-100px) translateY(-16vh) translateX(-16vw)' },
  { transform: 'translateZ(0px) translateY(-4vh) translateX(14vw)' },
  { transform: 'translateZ(60px) translateY(10vh) translateX(-12vw)' },
  { transform: 'translateZ(120px) translateY(18vh) translateX(8vw)' },
]
function cardStyle(i: number) { return positions[i] }

// ═══════════════ 仅入场动画用GSAP (滚动由纯CSS驱动!) ═══════════════
function setupEntrance() {
  if (!headerRef.value) return
  const chars = [tc1.value, tc2.value, tc3.value, tc4.value].filter(Boolean)
  const tl = gsap.timeline()
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: .7, ease: 'power3.out' })
    .fromTo(chars, { autoAlpha: 0, z: -150, scale: .3 }, { autoAlpha: 1, z: 0, scale: 1, duration: .5, stagger: .07, ease: 'back.out(1.5)' }, '-=.3')
    .fromTo(dividerRef.value, { scaleX: 0 }, { scaleX: 1, duration: .4, ease: 'power3.inOut' }, '-=.12')
    .fromTo(subRef.value, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .45, ease: 'power2.out' }, '-=.06')
  cleanupFns.push(() => tl.kill())
}

function handleResize() {}
onMounted(() => { setupEntrance(); window.addEventListener('resize', handleResize) })
onUnmounted(() => { window.removeEventListener('resize', handleResize); cleanupFns.forEach(fn => fn()); cleanupFns.length = 0 })
</script>

<style scoped lang="scss">
/* ═══════════════════════ 原生空间 ═══════════════════════ */
.sn-root {
  position: relative; width: 100vw; height: 400vh; // 🔑 需要滚动空间供animation-timeline使用
  background: radial-gradient(ellipse 55% 45% at 50% 45%, #0c0a18 0%, #04020c 55%, #010004 100%);
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, monospace;
}

/* ═══════════════ 🔑 纯CSS滚动进度条 (零JS!) ═══════════════ */
.sn-scroll-progress {
  position: fixed; top: 0; left: 0; z-index: 100; height: 3px; pointer-events: none;
  background: linear-gradient(90deg, #00e0ff, #d040f0);

  // 🔑 animation-timeline: scroll() — 原生绑定滚动进度!
  animation: sn-prog 1s linear;
  animation-timeline: scroll(root);
  animation-range: 0% 100%;
}
@keyframes sn-prog {
  0%   { width: 0%; }
  100% { width: 100%; }
}

/* ── 标题 ── */
.sn-header { position: fixed; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 40; text-align: center; width: min(92vw, 800px); pointer-events: none; }
.sn-kicker { display: inline-block; font-size: .52rem; font-weight: 700; letter-spacing: .22em; color: rgba(0,210,240,.55); background: rgba(0,160,220,.04); backdrop-filter: blur(8px); border: 1px solid rgba(0,160,220,.1); border-radius: 999px; padding: .16rem .85rem; margin-bottom: .45rem; }
.sn-title { margin: 0; display: flex; justify-content: center; gap: .06em; }
.sn-title__c { display: inline-block; font-size: clamp(2rem, 5.5vw, 4.2rem); font-weight: 900; color: #38b8d0;
  &--native { background: linear-gradient(150deg, #00e0ff 0%, #40f0ff 30%, #d040f0 70%, #f060e0 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 2px 10px rgba(0,220,255,.5)); }
}
.sn-divider { width: 110px; height: 2px; margin: .35rem auto .45rem; background: linear-gradient(90deg, transparent, #00e0ff, #d040f0, #00e0ff, transparent); }
.sn-sub { margin: 0; font-size: clamp(.54rem, 1vw, .7rem); color: rgba(0,200,230,.3); max-width: 520px; margin-inline: auto; }

/* ═══════════════════════ 3D 场景 ═══════════════════════ */
.sn-scene {
  position: fixed; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 0; height: 0; z-index: 10;
  perspective: 900px;
  perspective-origin: 50% 48%;
}
.sn-stage { position: absolute; width: 0; height: 0; transform-style: preserve-3d; }

/* ═══════════════ 🔑 卡片 — 纯CSS animation-timeline 驱动3D ═══════════════ */
.sn-card {
  position: absolute; transform-style: preserve-3d;
  backface-visibility: hidden;
}
.sn-card__img {
  display: block; object-fit: cover; border-radius: 10px;
  width: min(28vw, 220px); height: min(18vw, 150px);
  margin-left: calc(min(28vw, 220px) / -2);
  margin-top: calc(min(18vw, 150px) / -2);
  box-shadow: 0 8px 32px rgba(0,0,0,.35);
}
.sn-card__tag {
  position: absolute; bottom: -18px; left: 50%; transform: translateX(-50%);
  font-size: .44rem; font-weight: 700; letter-spacing: .14em; white-space: nowrap;
  color: rgba(0,200,230,.4); font-family: 'Courier New', monospace;
}

/* ═══════════════════════ 🔑🔑🔑 原生滚动驱动动画 ═══════════════════════ */

/* 卡片1: rotateY 0→360° — 完整旋转 */
.sn-card--1 {
  animation: sn-spin 1s linear;
  animation-timeline: scroll(root);    // 🔑 绑定到根滚动!
  animation-range: 0% 100%;           // 🔑 整个滚动范围
}
@keyframes sn-spin {
  0%   { transform: translateZ(-100px) translateY(-16vh) translateX(-16vw) rotateY(0deg); }
  100% { transform: translateZ(-100px) translateY(-16vh) translateX(-16vw) rotateY(360deg); }
}

/* 卡片2: translateZ + scale — 从远处飞来 */
.sn-card--2 {
  animation: sn-fly 1s linear;
  animation-timeline: scroll(root);
  animation-range: 10% 90%;
}
@keyframes sn-fly {
  0%   { transform: translateZ(-300px) translateY(-4vh) translateX(14vw) scale(.4); opacity: .2; filter: blur(4px); }
  50%  { transform: translateZ(0px) translateY(-4vh) translateX(14vw) scale(1); opacity: 1; filter: blur(0); }
  100% { transform: translateZ(200px) translateY(-4vh) translateX(14vw) scale(1.3); opacity: .5; filter: blur(2px); }
}

/* 卡片3: rotateX + opacity — 翻转淡入 */
.sn-card--3 {
  animation: sn-flip 1s linear;
  animation-timeline: scroll(root);
  animation-range: 20% 100%;
}
@keyframes sn-flip {
  0%   { transform: translateZ(60px) translateY(10vh) translateX(-12vw) rotateX(-90deg); opacity: 0; }
  40%  { transform: translateZ(60px) translateY(10vh) translateX(-12vw) rotateX(0deg); opacity: 1; }
  100% { transform: translateZ(60px) translateY(10vh) translateX(-12vw) rotateX(45deg); opacity: .7; }
}

/* 卡片4: 组合3D — rotateY + translateZ + scale */
.sn-card--4 {
  animation: sn-combo 1s linear;
  animation-timeline: scroll(root);
  animation-range: 0% 100%;
}
@keyframes sn-combo {
  0%   { transform: translateZ(120px) translateY(18vh) translateX(8vw) rotateY(0deg) scale(1); }
  25%  { transform: translateZ(200px) translateY(18vh) translateX(8vw) rotateY(90deg) scale(1.1); }
  50%  { transform: translateZ(80px) translateY(18vh) translateX(8vw) rotateY(180deg) scale(.95); }
  75%  { transform: translateZ(180px) translateY(18vh) translateX(8vw) rotateY(270deg) scale(1.05); }
  100% { transform: translateZ(120px) translateY(18vh) translateX(8vw) rotateY(360deg) scale(1); }
}

/* 🔑 底部原生进度条 */
.sn-progress-native {
  position: fixed; bottom: 0; left: 0; z-index: 100; height: 2px; pointer-events: none;
  background: linear-gradient(90deg, #00e0ff, #d040f0);
  animation: sn-prog2 1s linear;
  animation-timeline: scroll(root);
  animation-range: 0% 100%;
}
@keyframes sn-prog2 { 0% { width: 0%; } 100% { width: 100%; } }

@media (max-width: 768px) {
  .sn-header { top: 2vh; } .sn-kicker { font-size: .34rem; } .sn-title__c { font-size: 1.4rem; }
  .sn-card__img { width: 34vw; height: 22vw; margin-left: -17vw; margin-top: -11vw; }
}
</style>
