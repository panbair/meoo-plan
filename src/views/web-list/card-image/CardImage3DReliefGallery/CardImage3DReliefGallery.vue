<template>
  <section ref="rootRef" class="rg-root">
    <div ref="glowA" class="rg-glow rg-glow--a"></div>
    <div ref="glowB" class="rg-glow rg-glow--b"></div>

    <div ref="scrollRef" class="rg-scroll">
      <div ref="trackRef" class="rg-track" :style="{ height: trackHeight }">
        <div class="rg-sticky">

          <!-- ═══════════════ 🔑 浮雕标题 (25层text-shadow) ═══════════════ -->
          <header ref="headerRef" class="rg-header">
            <span class="rg-kicker">◈ CSS 2.5D · 浮雕雕刻 · 景深画廊 ◈</span>
            <h1 class="rg-title">
              <span ref="tc1" class="rg-title__c" :style="{ textShadow: embossShadow }">浮</span>
              <span ref="tc2" class="rg-title__c rg-title__c--accent" :style="{ textShadow: embossShadowAccent }">雕</span>
              <span ref="tc3" class="rg-title__c" :style="{ textShadow: embossShadow }">画</span>
              <span ref="tc4" class="rg-title__c rg-title__c--accent" :style="{ textShadow: embossShadowAccent }">廊</span>
            </h1>
            <div ref="dividerRef" class="rg-divider"></div>
            <p ref="subRef" class="rg-sub" :style="{ textShadow: embossSubShadow }">
              向下滚动 · 25层text-shadow浮雕雕刻 · translateZ景深嵌套 · 悬浮画廊
            </p>
          </header>

          <!-- ════════════════ 3D 景深画廊 ════════════════ -->
          <div ref="sceneRef" class="rg-scene">
            <div ref="stageRef" class="rg-stage">

              <!-- 🔑 5层嵌套figure — translateZ景深堆叠 -->
              <figure
                v-for="(frame, i) in frames"
                :key="frame.id"
                :ref="el => { frameRefs[i] = el as HTMLElement | null }"
                class="rg-frame"
                :style="frameStyle(i)"
              >
                <img :src="frame.url" :alt="frame.label" class="rg-frame__img" loading="lazy" />
                <!-- 画框内衬 -->
                <div class="rg-frame__matte"></div>
                <!-- 画框标签 -->
                <figcaption class="rg-frame__caption">{{ frame.label }}</figcaption>
              </figure>

            </div>
          </div>

          <!-- 景深层指示 -->
          <div ref="depthBar" class="rg-depth-bar">
            <span
              v-for="(frame, i) in frames"
              :key="frame.id"
              class="rg-depth-bar__dot"
              :style="{ opacity: currentLayer === i ? 1 : 0.3, transform: currentLayer === i ? 'scale(1.5)' : 'scale(1)' }"
            ></span>
            <span class="rg-depth-bar__label">层 {{ currentLayer + 1 }}/{{ FRAME_COUNT }} · {{ frames[currentLayer]?.label }}</span>
          </div>

          <div class="rg-progress"><div ref="progRef" class="rg-progress__fill"></div></div>
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

// ═══════════════════════════════════════════════════════════════════════
//  CardImage3DReliefGallery — CSS 2.5D 浮雕雕刻 · 景深画廊
//
//  两大核心技法：
//
//  1. 🔑 25层text-shadow浮雕 — 无需3D模型，2D平面"雕刻"立体文字
//     · 30层text-shadow逐层偏移 (1px增量)
//     · 暗面：逐步变淡的黑色阴影 (模拟凹陷深度)
//     · 亮面：白色高光阴影 (模拟光照凸起)
//     · 光源方向：左上角 (暗面右下, 亮面左上)
//
//  2. 🔑 translateZ嵌套画廊 — 5层figure景深堆叠
//     · 每层translateZ偏移60-80px
//     · opacity + scale 渐变模拟远近
//     · 画框内衬matte + 阴影
//     · 滚动推进摄像机穿越各层
//
//  设计风格：画廊展示 · 古典浮雕 · 温暖色调
// ═══════════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

// ═══════════════ 🔑 生成25层text-shadow浮雕效果 ═══════════════
function generateEmbossShadow(
  depth: number,
  darkColor: string,
  lightColor: string,
  maxAlpha: number,
): string {
  const layers: string[] = []

  // 暗面阴影 (光源左上 → 阴影右下)
  for (let i = 1; i <= depth; i++) {
    const alpha = (maxAlpha * (1 - i / depth)).toFixed(3)
    const offset = i * 1.2
    layers.push(`${offset}px ${offset}px ${i * 0.8}px rgba(${darkColor},${alpha})`)
  }

  // 亮面高光 (光源左上 → 高光左上)
  for (let i = 1; i <= Math.floor(depth / 2); i++) {
    const alpha = (maxAlpha * 0.35 * (1 - i / (depth / 2))).toFixed(3)
    const offset = i * 0.8
    layers.push(`${-offset}px ${-offset}px ${i * 0.5}px rgba(${lightColor},${alpha})`)
  }

  return layers.join(', ')
}

// 标准文字浮雕 (深色底)
const embossShadow = computed(() =>
  generateEmbossShadow(25, '0,0,0', '255,255,255', 0.55)
)

// 强调文字浮雕 (更亮)
const embossShadowAccent = computed(() =>
  generateEmbossShadow(25, '20,10,0', '255,250,240', 0.65)
)

// 副标题微浮雕
const embossSubShadow = computed(() =>
  generateEmbossShadow(8, '0,0,0', '255,255,255', 0.25)
)

// ═══════════════ 景深画廊 ═══════════════
interface FrameData {
  id: number; label: string; url: string
  baseZ: number; baseScale: number; opacity: number
}

const frames: FrameData[] = [
  { id: 0, label: 'DEEP.BG',     url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', baseZ: -240, baseScale: 0.65, opacity: 0.5 },
  { id: 1, label: 'MID.FAR',     url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80', baseZ: -140, baseScale: 0.75, opacity: 0.65 },
  { id: 2, label: 'CENTER.FOCUS',url: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=800&q=80', baseZ: 0,   baseScale: 0.88, opacity: 0.85 },
  { id: 3, label: 'MID.NEAR',    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80', baseZ: 100, baseScale: 0.95, opacity: 0.9 },
  { id: 4, label: 'FRONT.CLOSE', url: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=800&q=80', baseZ: 180, baseScale: 1.0, opacity: 1.0 },
]

const FRAME_COUNT = frames.length
const GALLERY_STAGES = 5
const trackHeight = `${(GALLERY_STAGES + 1) * 100}vh`

function frameStyle(i: number) {
  const f = frames[i]
  return {
    transform: `translateZ(${f.baseZ}px) scale(${f.baseScale})`,
    opacity: f.opacity,
    zIndex: 20 - i,
    filter: i < 2 ? `brightness(${1 + (2-i) * 0.1}) blur(${(2-i) * 1.2}px)` : 'none',
  }
}

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
const frameRefs = ref<(HTMLElement | null)[]>(Array(FRAME_COUNT).fill(null))
const glowA = ref<HTMLElement | null>(null)
const glowB = ref<HTMLElement | null>(null)
const depthBar = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)

const currentLayer = ref(2) // start at center
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

// ═══════════════════════ 景深穿梭 ═══════════════════════
function setupGalleryDepth() {
  if (!scrollRef.value || !trackRef.value || !stageRef.value) return
  const scroller = scrollRef.value; const track = trackRef.value; const stage = stageRef.value
  const D = GALLERY_STAGES

  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.4,
      onUpdate(self) {
        currentLayer.value = Math.min(FRAME_COUNT - 1, Math.max(0, Math.round(self.progress * (FRAME_COUNT - 1))))
      },
    },
  })

  // 相机推入 — 从远景到近景
  // 远景层逐渐模糊退后，近景层逐渐清晰前移
  master.to(frameRefs.value[0], { translateZ: -300, opacity: 0.35, scale: 0.6, filter: 'brightness(1.25) blur(3px)', duration: D }, 0)
  master.to(frameRefs.value[1], { translateZ: -200, opacity: 0.5,  scale: 0.7, filter: 'brightness(1.15) blur(1.5px)', duration: D }, 0)
  master.to(frameRefs.value[2], { translateZ: -60,  opacity: 0.7,  scale: 0.82, filter: 'brightness(1.05) blur(0px)', duration: D }, 0)
  master.to(frameRefs.value[3], { translateZ: 60,   opacity: 0.85, scale: 0.95, filter: 'brightness(1) blur(0px)', duration: D }, 0)
  master.to(frameRefs.value[4], { translateZ: 220,  opacity: 1,    scale: 1.05, filter: 'brightness(0.95) blur(0px)', duration: D }, 0)

  // 场景微倾
  master.to(stage, { rotateX: 6, rotateY: -4, duration: D * .5 }, 0)
  master.to(stage, { rotateX: -4, rotateY: 5, duration: D * .5 }, D * .5)

  if (glowA.value) master.to(glowA.value, { x: '5vw', y: '-3vh', scale: 1.2, duration: D }, 0)
  if (glowB.value) master.to(glowB.value, { x: '-3vw', y: '3vh', scale: 1.15, duration: D }, 0)
  if (depthBar.value) {
    master.fromTo(depthBar.value, { autoAlpha: .3 }, { autoAlpha: .75, duration: 1 }, .5)
  }
  if (progRef.value) master.to(progRef.value, { width: '100%', duration: D }, 0)

  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }

onMounted(() => {
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupGalleryDepth() }))
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
/* ═══════════════════════ 画廊空间 ═══════════════════════ */
.rg-root {
  position: relative; width: 100vw; height: 100vh; overflow: hidden;
  background: linear-gradient(170deg, #f8f4ec 0%, #f5f0e6 25%, #faf6ee 50%, #f3efe4 75%, #f7f3ea 100%);
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif;
}

.rg-glow { position: absolute; border-radius: 50%; filter: blur(60px); pointer-events: none; will-change: transform; z-index: 0; }
.rg-glow--a { width: 28vw; height: 28vw; top: -5vh; left: -3vw; background: radial-gradient(circle, rgba(200,160,120,.12) 0%, transparent 70%); }
.rg-glow--b { width: 24vw; height: 24vw; bottom: -4vh; right: -2vw; background: radial-gradient(circle, rgba(160,140,100,.1) 0%, transparent 70%); }

/* ── 滚动 ── */
.rg-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 5;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(180,140,100,.15); }
}
.rg-track { position: relative; width: 100%; }
.rg-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

/* ── 标题 ── */
.rg-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 40; text-align: center; width: min(92vw, 800px); pointer-events: none; }
.rg-kicker { display: inline-block; font-size: .56rem; font-weight: 700; letter-spacing: .24em; color: rgba(140,100,70,.6); background: rgba(200,150,100,.05); backdrop-filter: blur(8px); border: 1px solid rgba(180,130,90,.1); border-radius: 999px; padding: .18rem .9rem; margin-bottom: .45rem; }

/* ═══════════ 🔑 浮雕标题 — 25层text-shadow JS动态生成 ═══════════ */
.rg-title { margin: 0; display: flex; justify-content: center; gap: .08em; }
.rg-title__c {
  display: inline-block;
  font-size: clamp(2.6rem, 7vw, 5.5rem); font-weight: 900;
  color: #e8dcc8;
  will-change: transform, opacity;
  // 🔑 text-shadow 通过 inline style 绑定 (JS生成25层)
  // 暗面 (右下) + 亮面 (左上) = 光照浮雕
  letter-spacing: .04em;

  &--accent {
    color: #f0e0c8;
    // 强调文字 — 更亮的浮雕
  }
}
.rg-divider { width: 100px; height: 2px; margin: .4rem auto .5rem; border-radius: 2px; background: linear-gradient(90deg, transparent, #c8a878, #e0c898, #c8a878, transparent); }
.rg-sub { margin: 0; font-size: clamp(.62rem, 1vw, .78rem); color: rgba(140,100,70,.45); max-width: 500px; margin-inline: auto; }

/* ═══════════════════════ 3D 景深场景 ═══════════════════════ */
.rg-scene {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 0; height: 0; z-index: 10;
  perspective: 900px;
  perspective-origin: 50% 48%;
  will-change: transform;
}
.rg-stage {
  position: absolute; width: 0; height: 0;
  transform-style: preserve-3d;
  will-change: transform;
}

/* ═══════════════ 🔑 嵌套figure画廊 ═══════════════ */
.rg-frame {
  position: absolute; transform-style: preserve-3d;
  will-change: transform, opacity, filter;
  backface-visibility: hidden;
  border-radius: 6px;
}
.rg-frame__img {
  display: block;
  width: min(44vw, 360px); height: min(30vw, 240px);
  margin-left: calc(min(44vw, 360px) / -2);
  margin-top: calc(min(30vw, 240px) / -2);
  object-fit: cover; border-radius: 4px;
  box-shadow: 0 12px 40px rgba(0,0,0,.25), 0 0 0 1px rgba(0,0,0,.05);
}

/* 🔑 画框内衬matte — 模拟装裱边框的深度 */
.rg-frame__matte {
  position: absolute;
  width: calc(min(44vw, 360px) + 24px);
  height: calc(min(30vw, 240px) + 24px);
  margin-left: calc((min(44vw, 360px) + 24px) / -2);
  margin-top: calc((min(30vw, 240px) + 24px) / -2);
  border-radius: 6px; z-index: -1; pointer-events: none;
  background: linear-gradient(160deg,
    rgba(255,255,255,.4) 0%,
    rgba(240,230,210,.25) 20%,
    rgba(200,180,150,.15) 50%,
    rgba(180,160,130,.1) 70%,
    rgba(160,140,110,.2) 100%
  );
  box-shadow:
    inset 0 0 0 1px rgba(255,255,255,.3),
    inset 0 0 20px rgba(0,0,0,.06),
    0 4px 12px rgba(0,0,0,.08);
}

.rg-frame__caption {
  position: absolute; bottom: -22px; left: 50%; transform: translateX(-50%);
  font-size: .5rem; font-weight: 700; letter-spacing: .18em; white-space: nowrap;
  color: rgba(120,80,50,.5); font-family: 'Courier New', monospace;
}

/* ── 景深层指示 ── */
.rg-depth-bar { position: absolute; bottom: 10vh; left: 50%; transform: translateX(-50%); z-index: 35; pointer-events: none; display: flex; align-items: center; gap: .5rem; will-change: opacity; }
.rg-depth-bar__dot { width: 6px; height: 6px; border-radius: 50%; background: #c8a878; transition: all .3s ease; }
.rg-depth-bar__label { font-size: .52rem; font-weight: 600; letter-spacing: .12em; color: rgba(140,100,70,.5); font-family: 'Courier New', monospace; background: rgba(255,255,255,.45); backdrop-filter: blur(8px); border-radius: 999px; padding: .12rem .65rem; border: 1px solid rgba(180,130,90,.1); }

.rg-progress { position: absolute; left: 0; bottom: 0; z-index: 40; width: 100%; height: 2px; background: rgba(180,130,90,.04); }
.rg-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #c8a878, #e0c898, #c8a878); }

@media (max-width: 768px) {
  .rg-header { top: 2vh; } .rg-kicker { font-size: .4rem; } .rg-title__c { font-size: 1.8rem; }
  .rg-scene { perspective: 600px; }
  .rg-frame__img { width: 56vw; height: 38vw; margin-left: -28vw; margin-top: -19vw; }
  .rg-frame__matte { width: calc(56vw + 20px); height: calc(38vw + 20px); margin-left: calc((56vw + 20px) / -2); margin-top: calc((38vw + 20px) / -2); }
}
</style>
