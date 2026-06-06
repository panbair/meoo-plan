<template>
  <section ref="rootRef" class="mf-root">
    <!-- 地板光条 -->
    <div ref="floorLine1" class="mf-floor-line mf-floor-line--1"></div>
    <div ref="floorLine2" class="mf-floor-line mf-floor-line--2"></div>
    <div ref="floorLine3" class="mf-floor-line mf-floor-line--3"></div>
    <div ref="floorLine4" class="mf-floor-line mf-floor-line--4"></div>
    <div ref="floorLine5" class="mf-floor-line mf-floor-line--5"></div>
    <div ref="floorLine6" class="mf-floor-line mf-floor-line--6"></div>

    <!-- 滚动容器 -->
    <div ref="scrollRef" class="mf-scroll">
      <div ref="trackRef" class="mf-track" :style="{ height: trackHeight }">
        <div class="mf-sticky">

          <!-- 标题 -->
          <header ref="headerRef" class="mf-header">
            <span class="mf-kicker">▥ CSS3 3D Mirror Floor · 镜面地板 ◈</span>
            <h1 class="mf-title">
              <span ref="tc1" class="mf-title__c">镜</span>
              <span ref="tc2" class="mf-title__c mf-title__c--mirror">面</span>
              <span ref="tc3" class="mf-title__c">地</span>
              <span ref="tc4" class="mf-title__c mf-title__c--mirror">板</span>
            </h1>
            <div ref="lineRef" class="mf-line"></div>
            <p class="mf-sub">向下滚动 · 图片矗立3D镜面地板之上 · 真实透视倒影 · 如临其境</p>
          </header>

          <!-- 🔑 3D 镜面地板场景 -->
          <div ref="sceneRef" class="mf-scene">
            <!-- 地板平面 -->
            <div ref="floorRef" class="mf-floor"></div>

            <!-- 图片展示架 — 等距排列在Z轴上 -->
            <div
              v-for="(item, idx) in showcases"
              :key="idx"
              :ref="(el) => setShowcaseRef(el as HTMLElement, idx)"
              class="mf-showcase"
              :class="[`mf-showcase--${idx}`, { 'mf-showcase--active': currentActive === idx }]"
            >
              <!-- 主图片（矗立在地板上） -->
              <div class="mf-stand">
                <div class="mf-stand__frame">
                  <img :src="item.image" :alt="item.alt" class="mf-stand__img" />
                  <!-- 画框边框 -->
                  <div class="mf-stand__border"></div>
                </div>

                <!-- 🔑 地板倒影：翻转+透视渐变 -->
                <div class="mf-reflection">
                  <img :src="item.image" :alt="item.alt" class="mf-reflection__img" />
                  <div class="mf-reflection__fade"></div>
                </div>

                <!-- 地面接触点光斑 -->
                <div class="mf-contact-glow"></div>
              </div>

              <!-- 标签 -->
              <div class="mf-label">
                <span class="mf-label__num">{{ String(idx + 1).padStart(2, '0') }}</span>
                <span class="mf-label__text">{{ item.title }}</span>
              </div>
            </div>

            <!-- 光源 -->
            <div ref="spotlight" class="mf-spotlight"></div>
          </div>

          <!-- 当前画框指示 -->
          <div ref="infoRef" class="mf-info">
            <div class="mf-info__dot"></div>
            <h3 class="mf-info__title">{{ showcases[currentActive]?.title }}</h3>
          </div>

          <div class="mf-progress"><div ref="progRef" class="mf-progress__fill"></div></div>
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
//  CardImage3DMirrorFloor — CSS3 3D 镜面地板
//
//  核心概念：3D空间中图片矗立于镜面地板之上，下方产生真实透视倒影
//  1. 地板平面用 rotateX(80deg) 形成纵深地面
//  2. N 个展示架在 Z 轴上等距排列（从近到远）
//  3. 每个展示架：主图片 + 下方翻转镜像（倒影）
//  4. 倒影使用 scaleY(-1) + opacity渐变模拟真实反射
//  5. 用户竖滚 → 相机沿Z轴前进，依次经过每个展示架
//  6. 地板上有透视线增强纵深感
//
//  青春时尚配色：银河蓝 · 极光紫 · 星光银 · 未来白
// ═══════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

interface ShowcaseItem {
  title: string; image: string; alt: string; z: number
}

const showcases: ShowcaseItem[] = [
  { title: '黎明 · Awakening', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', alt: '黎明海滩', z: -300 },
  { title: '远山 · Distance',  image: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=800&q=80', alt: '远山', z: -150 },
  { title: '星辰 · Cosmos',    image: 'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=800&q=80', alt: '星辰', z: 0 },
  { title: '密林 · Forest',    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80', alt: '密林', z: 150 },
  { title: '繁花 · Blossom',   image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80', alt: '繁花', z: 300 },
]

const SHOW_COUNT = showcases.length
const trackHeight = `${(SHOW_COUNT + 2) * 100}vh`

const rootRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const lineRef = ref<HTMLElement | null>(null)
const tc1 = ref<HTMLElement | null>(null); const tc2 = ref<HTMLElement | null>(null)
const tc3 = ref<HTMLElement | null>(null); const tc4 = ref<HTMLElement | null>(null)
const sceneRef = ref<HTMLElement | null>(null)
const floorRef = ref<HTMLElement | null>(null)
const spotlight = ref<HTMLElement | null>(null)
const infoRef = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)
const floorLine1 = ref<HTMLElement | null>(null)
const floorLine2 = ref<HTMLElement | null>(null)
const floorLine3 = ref<HTMLElement | null>(null)
const floorLine4 = ref<HTMLElement | null>(null)
const floorLine5 = ref<HTMLElement | null>(null)
const floorLine6 = ref<HTMLElement | null>(null)

const currentActive = ref(2) // 初始聚焦中间
const showcaseRefs = ref<(HTMLElement | null)[]>([])
const cleanupFns: TweenCleanup[] = []

function setShowcaseRef(el: HTMLElement | null, idx: number) { showcaseRefs.value[idx] = el }

function setupEntrance() {
  if (!scrollRef.value || !headerRef.value || !sceneRef.value) return
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: scrollRef.value, scroller: scrollRef.value,
      start: 'top 75%', toggleActions: 'play none none reverse'
    }
  })
  const chars = [tc1.value, tc2.value, tc3.value, tc4.value]
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: -40 }, { autoAlpha: 1, y: 0, duration: 0.85, ease: 'power3.out' })
    .fromTo(chars, { autoAlpha: 0, y: 100, filter: 'blur(16px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.6, stagger: 0.1, ease: 'power3.out' }, '-=0.45')
    .fromTo(lineRef.value, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power3.inOut' }, '-=0.25')
    .fromTo(sceneRef.value, { autoAlpha: 0, scale: 0.8, rotateX: 20 }, { autoAlpha: 1, scale: 1, rotateX: 0, duration: 0.9, ease: 'power4.out' }, '-=0.4')
  // 展示架交错入场
  const els = showcaseRefs.value.filter(Boolean) as HTMLElement[]
  if (els.length > 0) {
    tl.fromTo(els, { autoAlpha: 0, y: 60, scale: 0.6 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.5)' }, '-=0.6')
  }
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

function setupMirrorFloor() {
  if (!scrollRef.value || !trackRef.value || !sceneRef.value) return
  const scroller = scrollRef.value; const track = trackRef.value; const scene = sceneRef.value

  // 初始状态
  gsap.set(scene, { rotateX: 0 })
  const elRefs = showcaseRefs.value.filter(Boolean) as HTMLElement[]
  elRefs.forEach((el, i) => {
    const sz = showcases[i].z
    // 越远的越小、越暗（用 opacity 模拟大气透视）
    const scale = 1 - Math.abs(sz) / 800
    gsap.set(el, {
      translateZ: sz,
      scale: scale,
      opacity: 0.5 + scale * 0.5,
    })
  })

  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.5,
      onUpdate(self) {
        const idx = Math.min(SHOW_COUNT - 1, Math.max(0, Math.round(self.progress * (SHOW_COUNT - 1))))
        currentActive.value = idx
      },
    },
  })

  // 🎥 场景沿Z轴向前推进（透视效果—远小近大自动产生）
  // 将所有展示架向相机方向移动
  elRefs.forEach((el, i) => {
    const targetZ = showcases[i].z + 450 // 全部向相机推进
    master.to(el, {
      translateZ: targetZ,
      opacity: 1,
      scale: 1.05,
      duration: SHOW_COUNT,
      ease: 'power2.inOut',
    }, 0)
  })

  // 地板透视渐变随滚动变化
  if (floorRef.value) {
    master.to(floorRef.value, {
      rotateX: 85,
      duration: SHOW_COUNT,
      ease: 'sine.inOut',
    }, 0)
  }

  // 地板透视线随滚动移动
  const floorLines = [floorLine1.value, floorLine2.value, floorLine3.value, floorLine4.value, floorLine5.value, floorLine6.value].filter(Boolean)
  floorLines.forEach((line, i) => {
    if (!line) return
    const offset = (i - 2) * 30
    master.to(line, { y: offset + 40, opacity: 0.5 + i * 0.08, duration: SHOW_COUNT, ease: 'sine.inOut' }, 0)
  })

  // 聚光灯扫过
  if (spotlight.value) {
    master.fromTo(spotlight.value,
      { x: '-30vw', opacity: 0.3 },
      { x: '30vw', opacity: 0.7, duration: SHOW_COUNT, ease: 'sine.inOut' },
      0
    )
  }

  // 信息栏
  if (infoRef.value) {
    for (let i = 0; i < SHOW_COUNT; i++) {
      master.to(infoRef.value, { scale: 1.2, opacity: 1, duration: 0.12, ease: 'power2.out' }, i + 0.25)
      master.to(infoRef.value, { scale: 1, opacity: 0.7, duration: 0.3, ease: 'power2.in' }, i + 0.37)
    }
  }

  if (progRef.value) master.to(progRef.value, { width: '100%', duration: SHOW_COUNT }, 0)

  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }

onMounted(() => {
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupMirrorFloor() }))
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
.mf-root {
  position: relative; width: 100vw; height: 100vh; overflow: hidden;
  background: linear-gradient(180deg, #080c1a 0%, #0a0e20 15%, #0c1025 30%, #0e1228 50%, #0c1024 70%, #0a0e20 85%, #080c1a 100%);
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif;
}

/* 地板网格透视线 */
.mf-floor-line {
  position: absolute; left: 0; width: 100%; height: 1px;
  pointer-events: none; z-index: 0; will-change: transform,opacity;
  background: linear-gradient(90deg, transparent 5%, rgba(100,160,240,.08) 20%, rgba(120,180,255,.15) 50%, rgba(100,160,240,.08) 80%, transparent 95%);
  &--1 { top: 58%; } &--2 { top: 62%; } &--3 { top: 66%; }
  &--4 { top: 71%; } &--5 { top: 77%; } &--6 { top: 84%; }
}

.mf-scroll {
  position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 2;
  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(100,160,240,.2); &:hover { background: rgba(100,160,240,.4); } }
}
.mf-track { position: relative; width: 100%; }
.mf-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

.mf-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 30; text-align: center; width: min(92vw, 800px); }
.mf-kicker { display: inline-block; font-size: .62rem; font-weight: 700; letter-spacing: .3em; text-transform: uppercase; color: rgba(120,180,240,.75); background: rgba(80,140,220,.08); backdrop-filter: blur(8px); border: 1px solid rgba(100,160,230,.18); border-radius: 999px; padding: .26rem 1rem; margin-bottom: .5rem; }
.mf-title { margin: 0; display: flex; justify-content: center; gap: .08em; }
.mf-title__c { display: inline-block; font-size: clamp(2rem, 5vw, 4.2rem); font-weight: 900; color: #80b8f0; will-change: transform,opacity,filter;
  &--mirror { background: linear-gradient(135deg, #80b8f0, #c0a0f0, #80d8e0); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 2px 18px rgba(120,180,240,.5)); }
}
.mf-line { width: 90px; height: 2px; margin: .4rem auto .55rem; border-radius: 2px; background: linear-gradient(90deg, transparent, #80b8f0, #c0a0f0, #80d8e0, transparent); transform-origin: center; }
.mf-sub { margin: 0; font-size: clamp(.68rem, .95vw, .82rem); color: rgba(140,180,220,.35); max-width: 520px; margin-inline: auto; }

/* ═══════════════════════ CSS3 3D 镜面地板场景 ═══════════════════════ */
.mf-scene {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  perspective: 800px;
  perspective-origin: 50% 30%; // 视角偏高，能看到更多地板
  will-change: transform, opacity;
}

/* 地板平面 */
.mf-floor {
  position: absolute;
  width: 120vw; height: 80vh;
  left: -60vw; top: -20vh;
  transform: rotateX(82deg);
  transform-origin: 50% 30%;
  background: linear-gradient(
    180deg,
    rgba(20,30,60,.9) 0%,
    rgba(15,25,55,.85) 20%,
    rgba(10,20,50,.8) 50%,
    rgba(8,15,40,.75) 100%
  );
  box-shadow: inset 0 0 200px rgba(80,140,220,.1);
  pointer-events: none;
  will-change: transform;
}

/* 展示架（矗立的画框+倒影） */
.mf-showcase {
  position: absolute;
  top: 0; left: 50%;
  transform-style: preserve-3d;
  will-change: transform, opacity;
}

// 在Z轴上的布局
.mf-showcase--0 { } // z: -300
.mf-showcase--1 { } // z: -150
.mf-showcase--2 { } // z: 0 (锚点)
.mf-showcase--3 { } // z: 150
.mf-showcase--4 { } // z: 300

.mf-stand {
  position: relative;
  width: min(40vw, 340px);
  height: min(30vw, 255px);
  margin-left: calc(min(40vw, 340px) / -2);
  margin-top: calc(min(30vw, 255px) / -2);
  transform-style: preserve-3d;

  &__frame {
    position: relative; width: 100%; height: 100%;
    border-radius: 8px; overflow: hidden;
    backface-visibility: hidden;
    box-shadow: 0 0 50px rgba(0,0,0,.35), 0 0 0 1px rgba(255,255,255,.12);
  }
  &__img { width: 100%; height: 100%; object-fit: cover; display: block; }
  &__border {
    position: absolute; inset: 0;
    border: 2px solid rgba(255,255,255,.08);
    border-radius: 8px; pointer-events: none;
  }
}

/* 🔑 地板倒影 — 核心：翻转+渐变淡出 */
.mf-reflection {
  position: absolute;
  top: 100%; // 紧贴画框底部
  left: 0; width: 100%; height: 100%;
  transform: scaleY(-1); // 垂直翻转
  transform-origin: 50% 0;
  opacity: .35;
  filter: blur(.5px);
  pointer-events: none;
  mask-image: linear-gradient(180deg, rgba(0,0,0,.7) 0%, rgba(0,0,0,.3) 40%, transparent 100%);

  &__img {
    width: 100%; height: 100%;
    object-fit: cover;
    display: block;
  }
  &__fade {
    position: absolute; inset: 0;
    background: linear-gradient(180deg, rgba(10,18,40,0) 0%, rgba(10,18,40,.3) 50%, rgba(10,18,40,.8) 100%);
  }
}

/* 地面接触点光斑 */
.mf-contact-glow {
  position: absolute;
  top: 100%; left: 50%;
  width: 60%; height: 8px;
  margin-left: -30%;
  transform: rotateX(85deg);
  background: radial-gradient(ellipse, rgba(120,180,240,.4) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

/* 标签 */
.mf-label {
  position: absolute;
  top: calc(100% + 40px);
  left: 50%; transform: translateX(-50%);
  display: flex; align-items: center; gap: .4rem;
  pointer-events: none;
  &__num { font-size: 1.4rem; font-weight: 900; color: rgba(120,180,240,.6); font-family: 'Georgia', serif; }
  &__text { font-size: .64rem; font-weight: 600; color: rgba(160,200,240,.5); letter-spacing: .1em; }
}

/* 聚光灯 */
.mf-spotlight {
  position: absolute;
  width: 30vw; height: 30vw;
  top: -10vh; left: 35vw;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(120,180,240,.15) 0%, transparent 70%);
  filter: blur(40px);
  pointer-events: none;
  will-change: transform, opacity;
}

/* 信息栏 */
.mf-info {
  position: absolute; bottom: 10vh; left: 50%; transform: translateX(-50%); z-index: 25;
  display: flex; align-items: center; gap: .5rem;
  pointer-events: none; will-change: transform,opacity; opacity: .7;
}
.mf-info__dot { width: 7px; height: 7px; border-radius: 50%; background: #80b8f0; box-shadow: 0 0 14px rgba(120,180,240,.7); animation: mf-dot-pulse 2.5s ease-in-out infinite; }
@keyframes mf-dot-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(2.2); opacity: .5; } }
.mf-info__title { margin: 0; font-size: .78rem; font-weight: 600; color: rgba(160,200,240,.8); letter-spacing: .15em; }

.mf-progress { position: absolute; left: 0; bottom: 0; z-index: 30; width: 100%; height: 3px; background: rgba(100,160,240,.05); }
.mf-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #80b8f0, #c0a0f0, #80d8e0, #80b8f0); background-size: 200% 100%; box-shadow: 0 0 14px rgba(100,170,240,.5); }

@media (max-width: 768px) {
  .mf-header { top: 2vh; } .mf-kicker { font-size: .48rem; padding: .16rem .55rem; } .mf-title__c { font-size: 1.5rem; }
  .mf-stand { width: 55vw; height: 42vw; margin-left: -27.5vw; margin-top: -21vw; }
  .mf-reflection { opacity: .2; }
  .mf-info { bottom: 7vh; }
}
</style>
