<template>
  <section ref="rootRef" class="fp-root">
    <div ref="glowA" class="fp-glow fp-glow--a"></div>
    <div ref="glowB" class="fp-glow fp-glow--b"></div>

    <div ref="scrollRef" class="fp-scroll">
      <div ref="trackRef" class="fp-track" :style="{ height: trackHeight }">
        <div class="fp-sticky">

          <header ref="headerRef" class="fp-header">
            <span class="fp-kicker">📄 CSS3 3D · 纸张折叠 · 物理锚点控制 📄</span>
            <h1 class="fp-title">
              <span ref="tc1" class="fp-title__c">纸</span>
              <span ref="tc2" class="fp-title__c fp-title__c--fold">张</span>
              <span ref="tc3" class="fp-title__c">折</span>
              <span ref="tc4" class="fp-title__c fp-title__c--fold">叠</span>
            </h1>
            <div ref="dividerRef" class="fp-divider"></div>
            <p ref="subRef" class="fp-sub">
              向下滚动 · transform-origin 锚定折痕 · 对开门式折叠 · 物理折纸仿真
            </p>
          </header>

          <!-- ════════════════ 3D 折叠场景 ════════════════ -->
          <div ref="sceneRef" class="fp-scene">
            <div ref="stageRef" class="fp-stage">

              <!-- ═══════════════ 三面板对开门折页 ═══════════════ -->

              <!-- 🔑 左面板 — transform-origin: right center (以右边缘为轴折叠) -->
              <div
                ref="leftPanelRef"
                class="fp-panel fp-panel--left"
                :style="{ backgroundImage: `url(${imageUrl})`, backgroundPosition: 'left center', backgroundSize: `${PANELS * 100}% 100%` }"
              >
                <div class="fp-panel__face">
                  <img :src="imageUrl" :alt="'left'" class="fp-panel__img" loading="lazy"
                    style="object-position: left center; object-fit: cover; width: 300%; height: 100%;" />
                </div>
                <!-- 折痕阴影 -->
                <div class="fp-crease fp-crease--left"></div>
                <span class="fp-panel__tag">LEFT FOLD</span>
              </div>

              <!-- 🔑 中间面板 — 固定不动 (基底) -->
              <div
                ref="centerPanelRef"
                class="fp-panel fp-panel--center"
                :style="{ backgroundImage: `url(${imageUrl})`, backgroundPosition: 'center center', backgroundSize: `${PANELS * 100}% 100%` }"
              >
                <div class="fp-panel__face">
                  <img :src="imageUrl" :alt="'center'" class="fp-panel__img" loading="lazy"
                    style="object-position: center center; object-fit: cover; width: 300%; height: 100%;" />
                </div>
                <span class="fp-panel__tag fp-panel__tag--center">CENTER · {{ Math.round(foldAngle) }}°</span>
              </div>

              <!-- 🔑 右面板 — transform-origin: left center (以左边缘为轴折叠) -->
              <div
                ref="rightPanelRef"
                class="fp-panel fp-panel--right"
                :style="{ backgroundImage: `url(${imageUrl})`, backgroundPosition: 'right center', backgroundSize: `${PANELS * 100}% 100%` }"
              >
                <div class="fp-panel__face">
                  <img :src="imageUrl" :alt="'right'" class="fp-panel__img" loading="lazy"
                    style="object-position: right center; object-fit: cover; width: 300%; height: 100%;" />
                </div>
                <div class="fp-crease fp-crease--right"></div>
                <span class="fp-panel__tag">RIGHT FOLD</span>
              </div>

              <!-- 🔑 顶部横幅 — 上下折叠 (transform-origin: bottom center) -->
              <div
                ref="topBannerRef"
                class="fp-banner fp-banner--top"
              >
                <div class="fp-banner__content">
                  <span class="fp-banner__text">CREATIVE FOLD POSTER</span>
                </div>
                <div class="fp-crease fp-crease--top"></div>
              </div>

            </div>
          </div>

          <!-- 折叠角度指示 -->
          <div ref="foldIndicator" class="fp-fold-info">
            <span class="fp-fold-info__dot"></span>
            <span class="fp-fold-info__text">
              折叠角度 {{ Math.round(foldAngle) }}° · {{ foldState }}
            </span>
          </div>

          <div class="fp-progress"><div ref="progRef" class="fp-progress__fill"></div></div>
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
//  CardImage3DFoldPaper — CSS3 3D 纸张折叠 · 物理锚点控制
//
//  核心概念：transform-origin 精确锚定折痕 → 模拟真实纸张折叠
//
//  折叠技术栈：
//  1. 三面板对开门布局 — 左/中/右面板共享一张大图
//  2. 🔑 transform-origin 物理锚点：
//     · 左面板: right center  — 以右边缘为轴折叠
//     · 右面板: left center   — 以左边缘为轴折叠
//     · 顶部横幅: bottom center — 以上边缘为轴折叠
//  3. 反向 rotateY — 左面板 +Y, 右面板 -Y → 对折
//  4. 折痕阴影 — 在折叠边缘的渐变暗角
//  5. 折叠→展开→反向折叠 循环
//
//  设计风格：创意海报 · 折纸艺术 · 暖色纸张质感
// ═══════════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

const PANELS = 3
const imageUrl = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1500&q=80'

const FOLD_STAGES = 5
const trackHeight = `${(FOLD_STAGES + 1) * 100}vh`

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
const leftPanelRef = ref<HTMLElement | null>(null)
const centerPanelRef = ref<HTMLElement | null>(null)
const rightPanelRef = ref<HTMLElement | null>(null)
const topBannerRef = ref<HTMLElement | null>(null)
const glowA = ref<HTMLElement | null>(null)
const glowB = ref<HTMLElement | null>(null)
const foldIndicator = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)

const foldAngle = ref(0)
const foldState = ref('展开')
const foldStates = ['完全展开', '半折叠', '完全折叠', '反向半折', '重新展开']
const cleanupFns: TweenCleanup[] = []

// ═══════════════════════ 入场 ═══════════════════════
function setupEntrance() {
  if (!scrollRef.value || !headerRef.value) return
  const scroller = scrollRef.value
  const chars = [tc1.value, tc2.value, tc3.value, tc4.value].filter(Boolean)
  const tl = gsap.timeline({ scrollTrigger: { trigger: scrollRef.value, scroller, start: 'top 75%', toggleActions: 'play none none reverse' } })
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.75, ease: 'power3.out' })
    .fromTo(chars, { autoAlpha: 0, z: -200, scale: 0.3, filter: 'blur(8px)' }, { autoAlpha: 1, z: 0, scale: 1, filter: 'blur(0px)', duration: 0.55, stagger: 0.08, ease: 'back.out(1.6)' }, '-=0.3')
    .fromTo(dividerRef.value, { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: 'power3.inOut' }, '-=0.15')
    .fromTo(subRef.value, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.08')
    .fromTo(sceneRef.value, { autoAlpha: 0, scale: 0.92 }, { autoAlpha: 1, scale: 1, duration: 0.85, ease: 'power3.out' }, '-=0.25')
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

// ═══════════════════════ 🔑 纸张折叠核心动画 ═══════════════════════
function setupFoldPaper() {
  if (!scrollRef.value || !trackRef.value || !stageRef.value) return
  const scroller = scrollRef.value; const track = trackRef.value; const stage = stageRef.value
  const D = FOLD_STAGES

  // 🔑 初始状态：所有面板展开
  gsap.set(leftPanelRef.value, { rotateY: 0 })
  gsap.set(rightPanelRef.value, { rotateY: 0 })
  gsap.set(topBannerRef.value, { rotateX: 0 })

  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.3,
      onUpdate(self) {
        const idx = Math.min(FOLD_STAGES, Math.max(0, Math.round(self.progress * FOLD_STAGES)))
        foldState.value = foldStates[idx] || '重新展开'
        foldAngle.value = Math.round(self.progress * 180 - 90) // -90 ~ 90
      },
    },
  })

  // ═══════════════ 折叠循环 ═══════════════

  // 🔑 Phase 0→1: 左右面板向内折叠 (对开门关闭)
  //   左面板: rotateY 0° → +85° (以右边缘为轴, 向右后方折叠)
  //   右面板: rotateY 0° → -85° (以左边缘为轴, 向左后方折叠)
  master.to(leftPanelRef.value, {
    rotateY: 85, duration: 1.0, ease: 'power3.inOut',
  }, 0)
  master.to(rightPanelRef.value, {
    rotateY: -85, duration: 1.0, ease: 'power3.inOut',
  }, 0)
  // 顶部横幅向下折叠
  master.to(topBannerRef.value, {
    rotateX: 80, duration: 1.0, ease: 'power3.inOut',
  }, 0)

  // 🔑 Phase 1→2: 完全折叠 (面板贴近)
  master.to(leftPanelRef.value, {
    rotateY: 130, duration: 0.6, ease: 'power2.in',
  }, 1.2)
  master.to(rightPanelRef.value, {
    rotateY: -130, duration: 0.6, ease: 'power2.in',
  }, 1.2)
  master.to(topBannerRef.value, {
    rotateX: 110, duration: 0.6, ease: 'power2.in',
  }, 1.2)

  // 🔑 Phase 2→3: 保持折叠 + 展示折痕
  // 微微弹回 — 模拟纸张弹性
  master.to(leftPanelRef.value, {
    rotateY: 120, duration: 1.0, ease: 'elastic.out(1, 0.4)',
  }, 1.8)
  master.to(rightPanelRef.value, {
    rotateY: -120, duration: 1.0, ease: 'elastic.out(1, 0.4)',
  }, 1.8)

  // 🔑 Phase 3→4: 反向折叠 (面板向后折)
  master.to(leftPanelRef.value, {
    rotateY: -40, duration: 1.0, ease: 'power3.inOut',
  }, 2.8)
  master.to(rightPanelRef.value, {
    rotateY: 40, duration: 1.0, ease: 'power3.inOut',
  }, 2.8)
  master.to(topBannerRef.value, {
    rotateX: -30, duration: 1.0, ease: 'power3.inOut',
  }, 2.8)

  // 🔑 Phase 4→5: 重新展开 (弹性归位)
  master.to(leftPanelRef.value, {
    rotateY: 0, duration: 1.0, ease: 'back.out(1.4)',
  }, 3.8)
  master.to(rightPanelRef.value, {
    rotateY: 0, duration: 1.0, ease: 'back.out(1.4)',
  }, 3.8)
  master.to(topBannerRef.value, {
    rotateX: 0, duration: 1.0, ease: 'back.out(1.4)',
  }, 3.8)

  // 环境光 + 指示器
  if (glowA.value) master.to(glowA.value, { x: '4vw', y: '-3vh', scale: 1.15, duration: D }, 0)
  if (glowB.value) master.to(glowB.value, { x: '-3vw', y: '3vh', scale: 1.1, duration: D }, 0)
  if (foldIndicator.value) {
    for (let i = 0; i <= FOLD_STAGES; i++) {
      master.to(foldIndicator.value, { scale: 1.1, opacity: 1, duration: .07, ease: 'power2.out' }, i + .4)
      master.to(foldIndicator.value, { scale: 1, opacity: .65, duration: .2, ease: 'power2.in' }, i + .47)
    }
  }
  if (progRef.value) master.to(progRef.value, { width: '100%', duration: D }, 0)

  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }

onMounted(() => {
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupFoldPaper() }))
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
/* ═══════════════════════ 纸张空间 ═══════════════════════ */
.fp-root {
  position: relative; width: 100vw; height: 100vh; overflow: hidden;
  background: linear-gradient(170deg, #f8f4ee 0%, #f5f0e8 30%, #faf6f0 60%, #f3efe6 100%);
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif;
}

.fp-glow { position: absolute; border-radius: 50%; filter: blur(60px); pointer-events: none; will-change: transform; z-index: 0; }
.fp-glow--a { width: 28vw; height: 28vw; top: -5vh; left: -3vw; background: radial-gradient(circle, rgba(200,160,120,.15) 0%, transparent 70%); }
.fp-glow--b { width: 24vw; height: 24vw; bottom: -4vh; right: -2vw; background: radial-gradient(circle, rgba(180,140,100,.12) 0%, transparent 70%); }

/* ── 滚动 ── */
.fp-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 5;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(180,140,100,.15); }
}
.fp-track { position: relative; width: 100%; }
.fp-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

/* ── 标题 ── */
.fp-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 40; text-align: center; width: min(92vw, 800px); pointer-events: none; }
.fp-kicker { display: inline-block; font-size: .56rem; font-weight: 700; letter-spacing: .24em; color: rgba(160,120,90,.65); background: rgba(200,150,110,.06); backdrop-filter: blur(8px); border: 1px solid rgba(180,130,100,.12); border-radius: 999px; padding: .2rem 1rem; margin-bottom: .48rem; }
.fp-title { margin: 0; display: flex; justify-content: center; gap: .06em; }
.fp-title__c { display: inline-block; font-size: clamp(2.2rem, 5.5vw, 4.6rem); font-weight: 900; color: #b89870; will-change: transform,opacity,filter;
  &--fold {
    background: linear-gradient(150deg, #d4a870 0%, #e8c090 25%, #c89860 55%, #e0b880 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    filter: drop-shadow(0 2px 8px rgba(200,150,100,.4));
  }
}
.fp-divider { width: 100px; height: 2px; margin: .4rem auto .5rem; border-radius: 2px; background: linear-gradient(90deg, transparent, #d4a870, #e0b880, #d4a870, transparent); transform-origin: center; }
.fp-sub { margin: 0; font-size: clamp(.62rem, 1vw, .78rem); color: rgba(160,120,90,.35); max-width: 500px; margin-inline: auto; }

/* ═══════════════════════ CSS3 3D 场景 ═══════════════════════ */
.fp-scene {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 0; height: 0; z-index: 10;
  perspective: 1000px;
  perspective-origin: 50% 48%;
  will-change: transform;
}
.fp-stage {
  position: absolute; width: 0; height: 0;
  transform-style: preserve-3d;
}

/* ═══════════════════════ 🔑 三面板 ═══════════════════════ */
.fp-panel {
  position: absolute; will-change: transform;
  backface-visibility: hidden;
  width: min(28vw, 240px); height: min(40vw, 340px);
  margin-top: calc(min(40vw, 340px) / -2);
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,.12);
}

.fp-panel__face { position: absolute; inset: 0; overflow: hidden; }
.fp-panel__img { display: block; }

.fp-panel__tag {
  position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%);
  font-size: .48rem; font-weight: 700; letter-spacing: .16em; white-space: nowrap;
  color: rgba(255,255,255,.8); text-shadow: 0 1px 3px rgba(0,0,0,.4); z-index: 3;
  font-family: 'Courier New', monospace;
}
.fp-panel__tag--center {
  color: rgba(60,40,20,.6); text-shadow: none;
  background: rgba(255,255,255,.5); border-radius: 999px; padding: .06rem .55rem;
}

/* 🔑 左面板 — transform-origin: right center (以右边缘为轴) */
.fp-panel--left {
  margin-left: calc(min(28vw, 240px) / -2 - min(28vw, 240px) / 2);
  transform-origin: right center; // 🔑 物理锚点：右边缘
  border-radius: 6px 0 0 6px;
  z-index: 12; // 折叠时在上层
}

/* 🔑 中间面板 — 固定 */
.fp-panel--center {
  margin-left: calc(min(28vw, 240px) / -2);
  border-radius: 0;
  z-index: 10; // 底层
}

/* 🔑 右面板 — transform-origin: left center (以左边缘为轴) */
.fp-panel--right {
  margin-left: calc(min(28vw, 240px) / -2 + min(28vw, 240px) / 2);
  transform-origin: left center; // 🔑 物理锚点：左边缘
  border-radius: 0 6px 6px 0;
  z-index: 12; // 折叠时在上层
}

/* ═══════════════ 🔑 折痕阴影 ═══════════════ */
.fp-crease {
  position: absolute; top: 0; bottom: 0; width: 8px; z-index: 5; pointer-events: none;
  background: linear-gradient(90deg, rgba(0,0,0,.06) 0%, rgba(0,0,0,.12) 50%, rgba(0,0,0,.04) 100%);
}
.fp-crease--left { right: 0; background: linear-gradient(90deg, transparent 0%, rgba(0,0,0,.08) 50%, rgba(0,0,0,.15) 100%); }
.fp-crease--right { left: 0; background: linear-gradient(90deg, rgba(0,0,0,.15) 0%, rgba(0,0,0,.08) 50%, transparent 100%); }

/* ═══════════════ 顶部横幅 (上下折叠) ═══════════════ */
.fp-banner {
  position: absolute; will-change: transform;
  backface-visibility: hidden;
  width: min(40vw, 320px); height: 60px;
  margin-left: calc(min(40vw, 320px) / -2);
  margin-top: calc(min(40vw, 340px) / -2 - 50px);
  z-index: 15;
  background: linear-gradient(135deg, #d4a870, #e0b880);
  border-radius: 6px 6px 0 0;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 20px rgba(0,0,0,.1);
  // 🔑 物理锚点：底边缘 (以底边为轴向上折叠)
  transform-origin: bottom center;
}
.fp-banner__content { text-align: center; }
.fp-banner__text { font-size: .7rem; font-weight: 900; letter-spacing: .3em; color: #fff; text-shadow: 0 1px 3px rgba(0,0,0,.15); }
.fp-crease--top { position: absolute; bottom: 0; left: 0; right: 0; height: 6px; background: linear-gradient(180deg, transparent 0%, rgba(0,0,0,.1) 100%); }

/* ── 折叠指示器 ── */
.fp-fold-info { position: absolute; bottom: 10vh; left: 50%; transform: translateX(-50%); z-index: 35; pointer-events: none; display: flex; align-items: center; gap: .4rem; opacity: .65; will-change: transform,opacity; }
.fp-fold-info__dot { width: 7px; height: 7px; border-radius: 50%; background: radial-gradient(circle, #d4a870, #c89860); box-shadow: 0 0 10px rgba(200,150,100,.4); animation: fp-dot 2s ease-in-out infinite; }
@keyframes fp-dot { 0%,100% { transform: scale(1); } 50% { transform: scale(1.4); } }
.fp-fold-info__text { font-size: .54rem; font-weight: 600; letter-spacing: .12em; color: #b89870; font-family: 'Courier New', monospace; background: rgba(255,255,255,.5); backdrop-filter: blur(8px); border-radius: 999px; padding: .15rem .7rem; border: 1px solid rgba(180,130,100,.15); }

.fp-progress { position: absolute; left: 0; bottom: 0; z-index: 40; width: 100%; height: 2px; background: rgba(180,130,100,.04); }
.fp-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #d4a870, #e0b880, #d4a870); box-shadow: 0 0 6px rgba(200,150,100,.2); }

@media (max-width: 768px) {
  .fp-header { top: 2vh; } .fp-kicker { font-size: .4rem; } .fp-title__c { font-size: 1.5rem; }
  .fp-scene { perspective: 700px; }
  .fp-panel { width: 32vw; height: 46vw; margin-top: -23vw; }
  .fp-panel--left { margin-left: calc(32vw / -2 - 32vw / 2); }
  .fp-panel--center { margin-left: calc(32vw / -2); }
  .fp-panel--right { margin-left: calc(32vw / -2 + 32vw / 2); }
  .fp-banner { width: 50vw; }
}
</style>
