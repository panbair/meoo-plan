<template>
  <section ref="rootRef" class="mr-root">
    <div ref="glowA" class="mr-glow mr-glow--a"></div>
    <div ref="glowB" class="mr-glow mr-glow--b"></div>

    <!-- 镜面地平面线 -->
    <div class="mr-floor-line"></div>

    <div ref="scrollRef" class="mr-scroll">
      <div ref="trackRef" class="mr-track" :style="{ height: trackHeight }">
        <div class="mr-sticky">

          <header ref="headerRef" class="mr-header">
            <span class="mr-kicker">◈ CSS3 3D · 镜像翻转 · 视错觉倒影 ◈</span>
            <h1 class="mr-title">
              <span ref="tc1" class="mr-title__c">镜</span>
              <span ref="tc2" class="mr-title__c mr-title__c--mirror">像</span>
              <span ref="tc3" class="mr-title__c">倒</span>
              <span ref="tc4" class="mr-title__c mr-title__c--mirror">影</span>
            </h1>
            <div ref="dividerRef" class="mr-divider"></div>
            <p ref="subRef" class="mr-sub">
              向下滚动 · scaleY(-1) 翻转倒影 · 同步反向透视 · 镜面视错觉
            </p>
          </header>

          <!-- ════════════════ 3D 镜像场景 ════════════════ -->
          <div ref="sceneRef" class="mr-scene">
            <div ref="stageRef" class="mr-stage">

              <!-- ═══════════════ 地平面上的物体 (5个) + 倒影 ═══════════════ -->
              <div
                v-for="(item, i) in items"
                :key="'g'+i"
                class="mr-group"
                :style="groupBaseStyle(i)"
              >
                <!-- 🔑 主体 (地面以上) -->
                <div
                  :ref="el => { mainRefs[i] = el as HTMLElement | null }"
                  class="mr-object"
                >
                  <img :src="item.url" :alt="item.label" class="mr-object__img" loading="lazy" />
                  <span class="mr-object__label">{{ item.label }}</span>
                </div>

                <!-- 🔑 倒影 (地面以下, scaleY(-1) + 透明度渐变) -->
                <div
                  :ref="el => { reflRefs[i] = el as HTMLElement | null }"
                  class="mr-reflection"
                >
                  <img :src="item.url" :alt="''" class="mr-reflection__img" aria-hidden="true" />
                  <!-- 🔑 透明度渐变遮罩 — 倒影越远越淡 -->
                  <div class="mr-reflection__fade"></div>
                </div>
              </div>

            </div>
          </div>

          <!-- 视角指示 -->
          <div ref="viewIndicator" class="mr-view-info">
            <span class="mr-view-info__dot"></span>
            <span class="mr-view-info__text">镜面视角 · 倾角 {{ Math.round(currentTilt) }}°</span>
          </div>

          <div class="mr-progress"><div ref="progRef" class="mr-progress__fill"></div></div>
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
//  CardImage3DMirrorRealm — CSS3 3D 镜像翻转 · 视错觉倒影
//
//  核心概念：scaleY(-1) + 同步反向3D变换 = 完美镜面倒影
//
//  镜面倒影技术栈：
//  1. scaleY(-1) — Y轴翻转，制造倒影
//  2. opacity 渐变叠加 — 倒影越远越淡 (模拟镜面反射衰减)
//  3. z-index 层级 — 倒影在主体下方
//  4. 🔑 反向3D变换 — 主体 rotateY(+X) → 倒影 rotateY(-X)
//     主体 translateZ(+Z) → 倒影 translateZ(-Z)
//  5. 镜面地平面线 — 视觉分隔线
//
//  设计风格：暗色镜面空间 · 画廊展示 · 高端产品
// ═══════════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

interface MirrorItem {
  id: number; label: string; url: string
  baseY: number; baseZ: number; baseRotateY: number
}

const items: MirrorItem[] = [
  { id: 0, label: 'AURORA',  url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80', baseY: -28, baseZ: -150, baseRotateY: -20 },
  { id: 1, label: 'ETHEREAL',url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80', baseY: -12, baseZ: -60,  baseRotateY: -10 },
  { id: 2, label: 'CELESTIA',url: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=600&q=80', baseY: 5,   baseZ: 40,   baseRotateY: 5 },
  { id: 3, label: 'LUMIERE', url: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=600&q=80', baseY: 20,  baseZ: 130,  baseRotateY: 15 },
  { id: 4, label: 'NOVALIS', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80', baseY: 30,  baseZ: 200,  baseRotateY: 25 },
]

const ITEM_COUNT = items.length
const TILT_STAGES = 5
const trackHeight = `${(TILT_STAGES + 1) * 100}vh`

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
const mainRefs = ref<(HTMLElement | null)[]>(Array(ITEM_COUNT).fill(null))
const reflRefs = ref<(HTMLElement | null)[]>(Array(ITEM_COUNT).fill(null))
const glowA = ref<HTMLElement | null>(null)
const glowB = ref<HTMLElement | null>(null)
const viewIndicator = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)

const currentTilt = ref(0)
const cleanupFns: TweenCleanup[] = []

// 🔑 主体/倒影基础位置
function groupBaseStyle(i: number) {
  const item = items[i]
  return {
    transform: `translateY(${item.baseY}vh) translateZ(${item.baseZ}px) rotateY(${item.baseRotateY}deg)`,
  }
}

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

// ═══════════════════════ 🔑 镜像倒影核心动画 ═══════════════════════
function setupMirrorRealm() {
  if (!scrollRef.value || !trackRef.value || !stageRef.value) return
  const scroller = scrollRef.value; const track = trackRef.value; const stage = stageRef.value
  const D = TILT_STAGES

  gsap.set(stage, { rotateX: 0, rotateY: 0 })

  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.4,
      onUpdate(self) {
        currentTilt.value = Math.round(self.progress * 40 - 20) // -20 ~ 20
      },
    },
  })

  // ═══════════════ 场景倾斜 + 恢复 (模拟观察者移动) ═══════════════
  // 场景先向右倾 → 仰视 → 左倾 → 回归

  // Phase 0→1: 场景右倾 → 展示倒影的侧视角度
  master.to(stage, { rotateY: 15, rotateX: 5, duration: 1.2, ease: 'power2.inOut' }, 0)

  // Phase 1→2: 仰视角度 → 倒影拉伸变形
  master.to(stage, { rotateY: -5, rotateX: -10, duration: 1.2, ease: 'power2.inOut' }, 1)

  // Phase 2→3: 左倾观察 → 倒影与主体交错
  master.to(stage, { rotateY: -18, rotateX: 2, duration: 1.2, ease: 'power2.inOut' }, 2)

  // Phase 3→4: 俯视 → 倒影压缩
  master.to(stage, { rotateY: 5, rotateX: 12, duration: 1.2, ease: 'power2.inOut' }, 3)

  // Phase 4→5: 回归正面
  master.to(stage, { rotateY: 0, rotateX: 0, duration: 1.0, ease: 'power2.inOut' }, 4)

  // ═══════════════ 🔑 主体旋转 + 倒影反向同步 ═══════════════
  for (let i = 0; i < ITEM_COUNT; i++) {
    const mainEl = mainRefs.value[i]
    const reflEl = reflRefs.value[i]
    const item = items[i]

    if (mainEl && reflEl) {
      // 🔑 主体：正向3D旋转
      master.to(mainEl, {
        rotateY: item.baseRotateY + 25,
        rotateX: -8,
        translateZ: 30,
        duration: D * 0.5, ease: 'sine.inOut',
      }, 0)
      master.to(mainEl, {
        rotateY: item.baseRotateY - 20,
        rotateX: 10,
        translateZ: -20,
        duration: D * 0.5, ease: 'sine.inOut',
      }, D * 0.5)

      // 🔑 倒影：反向3D旋转 (scaleY(-1) 已在CSS设置)
      //    旋转方向与主体相反，模拟镜面反射
      master.to(reflEl, {
        rotateY: -(item.baseRotateY + 25),  // 🔑 取反!
        rotateX: 8,                          // 🔑 rotateX取反!
        translateZ: -30,                     // 🔑 translateZ取反!
        duration: D * 0.5, ease: 'sine.inOut',
      }, 0)
      master.to(reflEl, {
        rotateY: -(item.baseRotateY - 20),
        rotateX: -10,
        translateZ: 20,
        duration: D * 0.5, ease: 'sine.inOut',
      }, D * 0.5)
    }
  }

  // 环境光
  if (glowA.value) master.to(glowA.value, { x: '5vw', y: '-3vh', scale: 1.2, duration: D }, 0)
  if (glowB.value) master.to(glowB.value, { x: '-3vw', y: '4vh', scale: 1.15, duration: D }, 0)

  // 视角指示器
  if (viewIndicator.value) {
    for (let i = 0; i < TILT_STAGES; i++) {
      master.to(viewIndicator.value, { scale: 1.1, opacity: 1, duration: .08, ease: 'power2.out' }, i + .45)
      master.to(viewIndicator.value, { scale: 1, opacity: .65, duration: .2, ease: 'power2.in' }, i + .53)
    }
  }

  if (progRef.value) master.to(progRef.value, { width: '100%', duration: D }, 0)

  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }

onMounted(() => {
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupMirrorRealm() }))
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
/* ═══════════════════════ 镜面暗室空间 ═══════════════════════ */
.mr-root {
  position: relative; width: 100vw; height: 100vh; overflow: hidden;
  // 🔑 上半暗色、下半极暗 — 模拟镜面地平面
  background: linear-gradient(180deg, #0c0a14 0%, #0a0812 40%, #06040c 60%, #020106 100%);
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif;
}

.mr-glow { position: absolute; border-radius: 50%; filter: blur(65px); pointer-events: none; will-change: transform; z-index: 0; }
.mr-glow--a { width: 28vw; height: 28vw; top: 5vh; left: 20vw; background: radial-gradient(circle, rgba(100,160,220,.1) 0%, transparent 70%); }
.mr-glow--b { width: 24vw; height: 24vw; bottom: 15vh; right: 18vw; background: radial-gradient(circle, rgba(140,100,200,.08) 0%, transparent 70%); }

/* 🔑 镜面地平面线 */
.mr-floor-line {
  position: absolute; top: 52vh; left: 0; right: 0; height: 1px; z-index: 3; pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(120,160,220,.15) 30%, rgba(140,180,240,.25) 50%, rgba(120,160,220,.15) 70%, transparent);
  box-shadow: 0 0 20px rgba(100,140,220,.1);
}

/* ── 滚动 ── */
.mr-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 5;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(100,150,210,.1); }
}
.mr-track { position: relative; width: 100%; }
.mr-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

/* ── 标题 ── */
.mr-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 40; text-align: center; width: min(92vw, 800px); pointer-events: none; }
.mr-kicker { display: inline-block; font-size: .56rem; font-weight: 700; letter-spacing: .24em; color: rgba(120,160,220,.6); background: rgba(80,130,210,.04); backdrop-filter: blur(8px); border: 1px solid rgba(80,130,210,.1); border-radius: 999px; padding: .2rem 1rem; margin-bottom: .48rem; }
.mr-title { margin: 0; display: flex; justify-content: center; gap: .06em; }
.mr-title__c { display: inline-block; font-size: clamp(2.2rem, 5.5vw, 4.6rem); font-weight: 900; color: #7898c8; will-change: transform,opacity,filter;
  &--mirror {
    background: linear-gradient(150deg, #6098e0 0%, #90c8f8 30%, #c080e0 60%, #e0b0f8 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    filter: drop-shadow(0 2px 10px rgba(100,160,230,.5));
    // 🔑 标题自身也有微妙的倒影感 — 下方文字渐变
  }
}
.mr-divider { width: 110px; height: 2px; margin: .4rem auto .5rem; border-radius: 2px; background: linear-gradient(90deg, transparent, #6098e0, #c080e0, #6098e0, transparent); transform-origin: center; }
.mr-sub { margin: 0; font-size: clamp(.62rem, 1vw, .78rem); color: rgba(100,150,210,.3); max-width: 500px; margin-inline: auto; }

/* ═══════════════════════ CSS3 3D 场景 ═══════════════════════ */
.mr-scene {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 0; height: 0; z-index: 10;
  perspective: 1100px;
  perspective-origin: 50% 48%;
  will-change: transform;
}
.mr-stage {
  position: absolute; width: 0; height: 0;
  transform-style: preserve-3d;
  will-change: transform;
}

/* ═══════════════════════ 物体+倒影组 ═══════════════════════ */
.mr-group {
  position: absolute; width: 0; height: 0;
  transform-style: preserve-3d;
}

/* ── 主体 (地面以上) ── */
.mr-object {
  position: absolute; will-change: transform;
  backface-visibility: hidden;
  width: min(28vw, 220px); height: min(18vw, 150px);
  margin-left: calc(min(28vw, 220px) / -2);
  margin-top: calc(min(18vw, 150px) / -2);
  border-radius: 8px; overflow: hidden; z-index: 10;
  box-shadow: 0 10px 36px rgba(0,0,0,.4), 0 0 0 1px rgba(255,255,255,.06);
}
.mr-object__img { width: 100%; height: 100%; object-fit: cover; display: block; filter: brightness(1.05); }
.mr-object__label { position: absolute; bottom: 6px; left: 50%; transform: translateX(-50%); font-size: .5rem; font-weight: 700; letter-spacing: .18em; color: #fff; text-shadow: 0 2px 6px rgba(0,0,0,.5); z-index: 2; white-space: nowrap; }

/* ═══════════════ 🔑 倒影 (地面以下) ═══════════════ */
.mr-reflection {
  position: absolute;
  width: min(28vw, 220px); height: min(18vw, 150px);
  margin-left: calc(min(28vw, 220px) / -2);
  // 🔑 倒影从地平面线开始向下延伸
  margin-top: calc(min(18vw, 150px) / 2 + 4px);
  border-radius: 8px; overflow: hidden; z-index: 2; // 在主体下方
  will-change: transform;
  backface-visibility: hidden;
  // 🔑 scaleY(-1) = 核心镜像翻转
  transform: scaleY(-1);
  // 倒影初始微暗
  filter: brightness(0.5);
}

/* 🔑 倒影图像 (与主体相同) */
.mr-reflection__img {
  width: 100%; height: 100%; object-fit: cover; display: block;
  filter: brightness(0.6) saturate(0.8);
}

/* 🔑 透明度渐变遮罩 — 倒影越远越淡 (模拟镜面反射衰减) */
.mr-reflection__fade {
  position: absolute; inset: 0; pointer-events: none; z-index: 2;
  // 🔑 从上到下：半透明 → 完全透明
  background: linear-gradient(180deg,
    rgba(6,4,12,.05) 0%,    // 靠近镜面处 — 几乎不遮挡
    rgba(6,4,12,.2) 25%,    // 渐渐变暗
    rgba(6,4,12,.5) 55%,    // 中段半透明
    rgba(6,4,12,.8) 80%,    // 远处几乎消失
    rgba(6,4,12,.95) 100%   // 完全融入背景
  );
}

/* ── 视角指示器 ── */
.mr-view-info { position: absolute; bottom: 10vh; left: 50%; transform: translateX(-50%); z-index: 35; pointer-events: none; display: flex; align-items: center; gap: .4rem; opacity: .65; will-change: transform,opacity; }
.mr-view-info__dot { width: 7px; height: 7px; border-radius: 50%; background: radial-gradient(circle, #6098e0, #c080e0); box-shadow: 0 0 10px rgba(100,160,220,.4); animation: mr-dot 2s ease-in-out infinite; }
@keyframes mr-dot { 0%,100% { transform: scale(1); } 50% { transform: scale(1.4); } }
.mr-view-info__text { font-size: .54rem; font-weight: 600; letter-spacing: .12em; color: rgba(110,150,210,.55); font-family: 'Courier New', monospace; background: rgba(6,4,12,.5); backdrop-filter: blur(8px); border-radius: 999px; padding: .15rem .7rem; border: 1px solid rgba(80,130,210,.1); }

.mr-progress { position: absolute; left: 0; bottom: 0; z-index: 40; width: 100%; height: 2px; background: rgba(80,130,210,.02); }
.mr-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #6098e0, #c080e0, #6098e0); box-shadow: 0 0 6px rgba(100,160,220,.15); }

@media (max-width: 768px) {
  .mr-header { top: 2vh; } .mr-kicker { font-size: .4rem; } .mr-title__c { font-size: 1.5rem; }
  .mr-scene { perspective: 800px; }
  .mr-object, .mr-reflection { width: 36vw; height: 24vw; margin-left: -18vw; }
  .mr-reflection { margin-top: calc(24vw / 2 + 2px); }
}
</style>
