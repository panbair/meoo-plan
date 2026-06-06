<template>
  <section ref="rootRef" class="ks-root">
    <div ref="glowA" class="ks-glow ks-glow--a"></div>
    <div ref="glowB" class="ks-glow ks-glow--b"></div>

    <div ref="scrollRef" class="ks-scroll">
      <div ref="trackRef" class="ks-track" :style="{ height: trackHeight }">
        <div class="ks-sticky">

          <header ref="headerRef" class="ks-header">
            <span class="ks-kicker">✧ CSS3 3D · 万花筒切片破碎 · 碎片重组 ✧</span>
            <h1 class="ks-title">
              <span ref="tc1" class="ks-title__c">切</span>
              <span ref="tc2" class="ks-title__c ks-title__c--shatter">片</span>
              <span ref="tc3" class="ks-title__c">重</span>
              <span ref="tc4" class="ks-title__c ks-title__c--shatter">组</span>
            </h1>
            <div ref="dividerRef" class="ks-divider"></div>
            <p ref="subRef" class="ks-sub">
              向下滚动 · 6×4切片破碎 · 错时rotateY+translateZ · 万花筒碎片悬浮
            </p>
          </header>

          <!-- ════════════════ 3D 碎片场景 ════════════════ -->
          <div ref="sceneRef" class="ks-scene">
            <div ref="stageRef" class="ks-stage">

              <!-- 🔑 24个切片 (6列×4行) — 每个都是独立3D碎片 -->
              <div
                v-for="slice in slices"
                :key="slice.id"
                :ref="el => { sliceRefs[slice.id] = el as HTMLElement | null }"
                class="ks-slice"
                :style="{
                  width: sliceW + 'px',
                  height: sliceH + 'px',
                  marginLeft: (sliceW / -2) + 'px',
                  marginTop: (sliceH / -2) + 'px',
                  backgroundImage: `url(${imageUrl})`,
                  backgroundPosition: `${slice.bgX}% ${slice.bgY}%`,
                  backgroundSize: `${COLS * 100}% ${ROWS * 100}%`,
                }"
              >
                <!-- 🔑 半透明叠加 — 展示内部3D空间关系 -->
                <div class="ks-slice__glass"></div>
                <!-- 🔑 碎片边缘光 -->
                <div class="ks-slice__edge"></div>
              </div>

            </div>
          </div>

          <!-- 碎片状态 -->
          <div ref="statusBar" class="ks-status">
            <span class="ks-status__dot"></span>
            <span class="ks-status__text">
              {{ statusText }} · 碎片 {{ SLICE_COUNT }}片
            </span>
          </div>

          <div class="ks-progress"><div ref="progRef" class="ks-progress__fill"></div></div>
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
//  CardImage3DKaleidoShatter — CSS3 3D 万花筒切片破碎
//
//  核心概念：完整图片 → 切割为24个碎片 → 3D破碎 → 重组
//
//  技术栈：
//  1. background-position 切片 — 每个div显示图片的不同区域
//  2. 错时(staggered) rotateY + translateZ — 碎片3D分离
//  3. 半透明rgba覆盖 — 展示内部空间关系
//  4. 碎片边缘光 — 模拟玻璃断面折射
//  5. 径向破碎模式 — 中心先碎、边缘后碎
//  6. 万花筒重组 — 碎片旋转归位
//
//  设计风格：暗色空间 · 玻璃碎片 · 万花筒色彩
// ═══════════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

const COLS = 6
const ROWS = 4
const SLICE_COUNT = COLS * ROWS // 24
const sliceW = 200
const sliceH = 130
const imageUrl = 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=1200&q=80'

interface SliceData {
  id: number; col: number; row: number
  bgX: number; bgY: number
  // 🔑 碎片参数
  centerDist: number  // 距中心距离 (0~1)
  shatterAngle: number // 破碎方向角度
}
const slices: SliceData[] = []
const cx = (COLS - 1) / 2
const ry = (ROWS - 1) / 2
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    const id = r * COLS + c
    slices.push({
      id, col: c, row: r,
      bgX: (c / (COLS - 1)) * 100,
      bgY: (r / (ROWS - 1)) * 100,
      centerDist: Math.sqrt((c - cx) ** 2 + (r - ry) ** 2) / Math.sqrt(cx ** 2 + ry ** 2),
      shatterAngle: Math.atan2(r - ry, c - cx),
    })
  }
}

const SHATTER_STAGES = 5
const trackHeight = `${(SHATTER_STAGES + 1) * 100}vh`

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
const sliceRefs = ref<(HTMLElement | null)[]>(Array(SLICE_COUNT).fill(null))
const glowA = ref<HTMLElement | null>(null)
const glowB = ref<HTMLElement | null>(null)
const statusBar = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)

const statusText = ref('完整图像')
const statusLabels = ['完整图像', '开始龟裂', '碎片飞散', '万花筒悬浮', '碎片回流', '重组归位']
const cleanupFns: TweenCleanup[] = []

// ═══════════════════════ 入场 ═══════════════════════
function setupEntrance() {
  if (!scrollRef.value || !headerRef.value) return
  const scroller = scrollRef.value
  const chars = [tc1.value, tc2.value, tc3.value, tc4.value].filter(Boolean)
  const tl = gsap.timeline({ scrollTrigger: { trigger: scrollRef.value, scroller, start: 'top 75%', toggleActions: 'play none none reverse' } })
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.75, ease: 'power3.out' })
    .fromTo(chars, { autoAlpha: 0, z: -200, scale: 0.3, filter: 'blur(8px)' }, { autoAlpha: 1, z: 0, scale: 1, filter: 'blur(0px)', duration: 0.55, stagger: 0.08, ease: 'back.out(1.8)' }, '-=0.3')
    .fromTo(dividerRef.value, { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: 'power3.inOut' }, '-=0.15')
    .fromTo(subRef.value, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.08')
    .fromTo(sceneRef.value, { autoAlpha: 0, scale: 0.92 }, { autoAlpha: 1, scale: 1, duration: 0.85, ease: 'power3.out' }, '-=0.25')
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

// ═══════════════════════ 🔑 切片破碎核心动画 ═══════════════════════
function setupShatter() {
  if (!scrollRef.value || !trackRef.value || !stageRef.value) return
  const scroller = scrollRef.value; const track = trackRef.value; const stage = stageRef.value
  const D = SHATTER_STAGES

  gsap.set(stage, { rotateX: 0, rotateY: 0 })

  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.4,
      onUpdate(self) {
        const idx = Math.min(SHATTER_STAGES, Math.max(0, Math.round(self.progress * SHATTER_STAGES)))
        statusText.value = statusLabels[idx] || '重组归位'
      },
    },
  })

  // 场景微倾 — 增强3D透视感
  master.to(stage, { rotateX: 8, duration: D * 0.3, ease: 'power2.inOut' }, 0)
  master.to(stage, { rotateX: -5, duration: D * 0.4, ease: 'power2.inOut' }, D * 0.3)
  master.to(stage, { rotateX: 0, duration: D * 0.3, ease: 'power2.inOut' }, D * 0.7)

  // ═══════════════ 🔑 每个切片的破碎动画 ═══════════════
  slices.forEach((slice) => {
    const el = sliceRefs.value[slice.id]
    if (!el) return

    // 🔑 错时(stagger)：距中心越近越先碎
    const stagger = slice.centerDist * 0.5

    // 🔑 碎片爆炸方向 (径向向外)
    const dx = Math.cos(slice.shatterAngle)
    const dy = Math.sin(slice.shatterAngle)

    // ── Phase 0: 完整 → 微裂 (stagger开始) ──
    master.to(el, {
      translateZ: 15 * slice.centerDist,
      rotateY: dx * 15,
      rotateX: -dy * 10,
      filter: 'brightness(1.05)',
      duration: 0.5, ease: 'power2.out',
    }, stagger)

    // ── Phase 1: 碎片飞散 (最大破碎) ──
    master.to(el, {
      translateZ: 80 + slice.centerDist * 200,
      translateX: dx * 60 * slice.centerDist,
      translateY: dy * 40 * slice.centerDist,
      rotateY: dx * 45 * slice.centerDist,
      rotateX: -dy * 35 * slice.centerDist,
      rotateZ: (slice.col % 2 === 0 ? 1 : -1) * 15 * slice.centerDist,
      filter: 'brightness(1.2) drop-shadow(0 8px 24px rgba(0,0,0,.4))',
      duration: 1.2, ease: 'power3.inOut',
    }, 0.8 + stagger)

    // ── Phase 2: 万花筒悬浮 (碎片在空间中旋转) ──
    master.to(el, {
      translateZ: 50 + slice.centerDist * 150,
      translateX: dx * 40 * slice.centerDist,
      translateY: dy * 30 * slice.centerDist,
      rotateY: dx * 60 * slice.centerDist,
      rotateX: -dy * 45 * slice.centerDist,
      rotateZ: (slice.row % 2 === 0 ? 1 : -1) * 25 * slice.centerDist,
      duration: 1.5, ease: 'power2.inOut',
    }, 2.2 + stagger * 0.5)

    // ── Phase 3: 碎片回流 ──
    master.to(el, {
      translateZ: 10 * slice.centerDist,
      translateX: 0, translateY: 0,
      rotateY: dx * 8,
      rotateX: -dy * 5,
      rotateZ: 0,
      filter: 'brightness(1.02)',
      duration: 1.0, ease: 'power2.inOut',
    }, 3.6 + stagger * 0.3)

    // ── Phase 4: 重组归位 ──
    master.to(el, {
      translateZ: 0, translateX: 0, translateY: 0,
      rotateY: 0, rotateX: 0, rotateZ: 0,
      filter: 'brightness(1)',
      duration: 0.8, ease: 'back.out(1.2)',
    }, 4.5)
  })

  // 环境光
  if (glowA.value) master.to(glowA.value, { x: '5vw', y: '-3vh', scale: 1.2, duration: D }, 0)
  if (glowB.value) master.to(glowB.value, { x: '-3vw', y: '4vh', scale: 1.15, duration: D }, 0)

  // 状态指示
  if (statusBar.value) {
    for (let i = 0; i <= SHATTER_STAGES; i++) {
      master.to(statusBar.value, { scale: 1.12, opacity: 1, duration: 0.08, ease: 'power2.out' }, i + 0.4)
      master.to(statusBar.value, { scale: 1, opacity: .65, duration: 0.2, ease: 'power2.in' }, i + 0.48)
    }
  }

  if (progRef.value) master.to(progRef.value, { width: '100%', duration: D }, 0)

  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }

onMounted(() => {
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupShatter() }))
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
/* ═══════════════════════ 暗色空间 ═══════════════════════ */
.ks-root {
  position: relative; width: 100vw; height: 100vh; overflow: hidden;
  background: radial-gradient(ellipse 55% 45% at 50% 48%, #100e18 0%, #08060e 55%, #040208 100%);
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif;
}

.ks-glow { position: absolute; border-radius: 50%; filter: blur(65px); pointer-events: none; will-change: transform; z-index: 0; }
.ks-glow--a { width: 30vw; height: 30vw; top: -5vh; left: -3vw; background: radial-gradient(circle, rgba(100,140,220,.12) 0%, transparent 70%); }
.ks-glow--b { width: 28vw; height: 28vw; bottom: -4vh; right: -2vw; background: radial-gradient(circle, rgba(200,100,180,.1) 0%, transparent 70%); }

/* ── 滚动 ── */
.ks-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 5;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(100,140,220,.1); }
}
.ks-track { position: relative; width: 100%; }
.ks-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

/* ── 标题 ── */
.ks-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 40; text-align: center; width: min(92vw, 800px); pointer-events: none; }
.ks-kicker { display: inline-block; font-size: .56rem; font-weight: 700; letter-spacing: .24em; color: rgba(120,160,220,.6); background: rgba(80,120,200,.04); backdrop-filter: blur(8px); border: 1px solid rgba(80,120,200,.1); border-radius: 999px; padding: .2rem 1rem; margin-bottom: .48rem; }
.ks-title { margin: 0; display: flex; justify-content: center; gap: .06em; }
.ks-title__c { display: inline-block; font-size: clamp(2.2rem, 5.5vw, 4.6rem); font-weight: 900; color: #7898c8; will-change: transform,opacity,filter;
  &--shatter {
    background: linear-gradient(150deg, #5088d8 0%, #70b8f0 20%, #e060a0 50%, #f090c0 80%, #70b8f0 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    filter: drop-shadow(0 2px 10px rgba(100,150,220,.5));
  }
}
.ks-divider { width: 110px; height: 2px; margin: .4rem auto .5rem; border-radius: 2px; background: linear-gradient(90deg, transparent, #5088d8, #e060a0, #5088d8, transparent); transform-origin: center; }
.ks-sub { margin: 0; font-size: clamp(.62rem, 1vw, .78rem); color: rgba(100,150,210,.3); max-width: 500px; margin-inline: auto; }

/* ═══════════════════════ CSS3 3D 场景 ═══════════════════════ */
.ks-scene {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 0; height: 0; z-index: 10;
  perspective: 1000px;
  perspective-origin: 50% 48%;
  will-change: transform;
}
.ks-stage {
  position: absolute; width: 0; height: 0;
  transform-style: preserve-3d;
  will-change: transform;
}

/* ═══════════════════════ 🔑 碎片切片 ═══════════════════════ */
.ks-slice {
  position: absolute;
  backface-visibility: hidden;
  will-change: transform, filter;
  border-radius: 3px;
  // 🔑 半透明覆盖层下方是图片 (background-image)
  // 碎片分离时，半透明边缘展示内部3D空间关系
  box-shadow: 0 0 0 1px rgba(255,255,255,.06);
}

/* 🔑 半透明玻璃覆盖 — 展示3D空间中的碎片内部 */
.ks-slice__glass {
  position: absolute; inset: 0; border-radius: 3px; pointer-events: none;
  // 🔑 半透明渐变 — 碎片边缘变暗，中心透亮
  background:
    linear-gradient(135deg,
      rgba(255,255,255,.08) 0%,
      rgba(255,255,255,.02) 30%,
      transparent 50%,
      rgba(0,0,0,.04) 70%,
      rgba(0,0,0,.12) 100%
    );
  // 边缘微光 — 模拟玻璃断面
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.08);
}

/* 🔑 碎片边缘光 — 3D旋转时断面发光 */
.ks-slice__edge {
  position: absolute; inset: 0; border-radius: 3px; pointer-events: none;
  box-shadow:
    inset 1px 0 0 rgba(255,255,255,.06),
    inset -1px 0 0 rgba(0,0,0,.1),
    inset 0 1px 0 rgba(255,255,255,.04),
    inset 0 -1px 0 rgba(0,0,0,.08);
}

/* ── 状态指示 ── */
.ks-status { position: absolute; bottom: 10vh; left: 50%; transform: translateX(-50%); z-index: 35; pointer-events: none; display: flex; align-items: center; gap: .4rem; opacity: .65; will-change: transform,opacity; }
.ks-status__dot { width: 7px; height: 7px; border-radius: 50%; background: radial-gradient(circle, #70b8f0, #e060a0); box-shadow: 0 0 10px rgba(120,180,240,.4); animation: ks-dot 2s ease-in-out infinite; }
@keyframes ks-dot { 0%,100% { transform: scale(1); } 50% { transform: scale(1.4); } }
.ks-status__text { font-size: .56rem; font-weight: 600; letter-spacing: .12em; color: rgba(120,160,210,.55); font-family: 'Courier New', monospace; background: rgba(6,4,12,.55); backdrop-filter: blur(8px); border-radius: 999px; padding: .15rem .75rem; border: 1px solid rgba(80,130,200,.1); }

.ks-progress { position: absolute; left: 0; bottom: 0; z-index: 40; width: 100%; height: 2px; background: rgba(80,120,200,.02); }
.ks-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #5088d8, #e060a0, #5088d8); box-shadow: 0 0 6px rgba(100,150,220,.15); }

@media (max-width: 768px) {
  .ks-header { top: 2vh; } .ks-kicker { font-size: .4rem; } .ks-title__c { font-size: 1.5rem; }
  .ks-scene { perspective: 700px; }
}
</style>
