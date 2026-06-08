<template>
  <section ref="rootRef" class="lr-root">
    <!-- ═══════════════ 背景：深空大气层 ═══════════════ -->
    <div class="lr-bg">
      <div class="lr-bg__gradient"></div>
      <div class="lr-bg__stars"></div>
      <div class="lr-bg__stars lr-bg__stars--dim"></div>
    </div>

    <!-- ═══════════════ 3D层境场景 ═══════════════ -->
    <div class="lr-scene" ref="sceneRef">
      <!-- 层间大气散射（视觉分隔各层） -->
      <div class="lr-haze lr-haze--near"></div>
      <div class="lr-haze lr-haze--mid"></div>

      <!-- ===== 近景层 (Near Realm) ===== -->
      <div class="lr-plane lr-plane--near" ref="planeNearRef">
        <div
          v-for="img in nearImages"
          :key="img.id"
          class="lr-card-slot"
          :style="{ transform: `translateX(${img.x}) translateY(${img.y})` }"
        >
          <div class="lr-card lr-card--near" :ref="(el) => setCardRef(el, img.id)">
            <div class="lr-card__aura" :style="{ '--aura-color': img.aura }"></div>
            <div class="lr-card__inner">
              <img :src="img.image" :alt="img.alt" class="lr-card__img" loading="eager" />
              <div class="lr-card__border"></div>
            </div>
            <!-- 悬浮光瀑（替代地板倒影） -->
            <div class="lr-card__beam" :style="{ '--beam-color': img.aura }"></div>
          </div>
        </div>
      </div>

      <!-- ===== 中景层 (Mid Realm) ===== -->
      <div class="lr-plane lr-plane--mid" ref="planeMidRef">
        <div
          v-for="img in midImages"
          :key="img.id"
          class="lr-card-slot"
          :style="{ transform: `translateX(${img.x}) translateY(${img.y})` }"
        >
          <div class="lr-card lr-card--mid" :ref="(el) => setCardRef(el, img.id)">
            <div class="lr-card__aura" :style="{ '--aura-color': img.aura }"></div>
            <div class="lr-card__inner">
              <img :src="img.image" :alt="img.alt" class="lr-card__img" loading="eager" />
              <div class="lr-card__border"></div>
            </div>
            <div class="lr-card__beam" :style="{ '--beam-color': img.aura }"></div>
          </div>
        </div>
      </div>

      <!-- ===== 远景层 (Far Realm) ===== -->
      <div class="lr-plane lr-plane--far" ref="planeFarRef">
        <div
          v-for="img in farImages"
          :key="img.id"
          class="lr-card-slot"
          :style="{ transform: `translateX(${img.x}) translateY(${img.y})` }"
        >
          <div class="lr-card lr-card--far" :ref="(el) => setCardRef(el, img.id)">
            <div class="lr-card__aura" :style="{ '--aura-color': img.aura }"></div>
            <div class="lr-card__inner">
              <img :src="img.image" :alt="img.alt" class="lr-card__img" loading="eager" />
              <div class="lr-card__border"></div>
            </div>
            <div class="lr-card__beam" :style="{ '--beam-color': img.aura }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════ 前景效果 ═══════════════ -->
    <div class="lr-vignette"></div>
    <div class="lr-foreground-haze"></div>

    <!-- ═══════════════ 滚动 & UI层 ═══════════════ -->
    <div ref="scrollRef" class="lr-scroll">
      <div ref="trackRef" class="lr-track" :style="{ height: trackHeight }">
        <div class="lr-sticky">
          <header ref="headerRef" class="lr-header">
            <span class="lr-kicker">🌫 Layered Realm · 三重层境</span>
            <h1 class="lr-title">
              <span ref="tLayer" class="lr-title__w">层境</span>
              <span ref="tRealm" class="lr-title__w lr-title__w--alt">画廊</span>
            </h1>
            <div ref="headerLineRef" class="lr-line"></div>
            <p class="lr-sub">向下滚动 · 三重力场以不同速度漂移 · 照片悬浮于层境之间</p>
          </header>

          <div ref="infoRef" class="lr-info">
            <span class="lr-info__realm">{{ currentRealmLabel }}</span>
            <span class="lr-info__no">{{ String(currentRealmImgIdx + 1).padStart(2, '0') }}</span>
            <h3>{{ currentImage?.title || '' }}</h3>
          </div>

          <div class="lr-progress">
            <div ref="progressRef" class="lr-progress__fill"></div>
          </div>
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
type TweenCleanup = () => void

// ── 图片数据模型 ──
interface LayerImage {
  id: string; title: string; image: string; alt: string
  x: string      // CSS translateX (如 '-35vw')
  y: string      // CSS translateY (如 '-8vh')
  aura: string   // 光晕颜色
}

// ═══════════════════════════════════════════
// 三层空间配置
// ═══════════════════════════════════════════
const nearImages: LayerImage[] = [
  { id:'aurora',   title:'极光', image:'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&q=80', alt:'极光', x:'-32vw', y:'-6vh',  aura:'rgba(100,220,180,0.55)' },
  { id:'flowers',  title:'繁花', image:'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&q=80', alt:'繁花', x:'28vw',  y:'5vh',   aura:'rgba(240,140,180,0.55)' },
  { id:'forest',   title:'森林', image:'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80', alt:'森林', x:'-12vw', y:'10vh',  aura:'rgba(80,200,100,0.5)' },
  { id:'sunrise',  title:'日出', image:'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80', alt:'日出', x:'18vw',  y:'-10vh', aura:'rgba(240,160,80,0.5)' },
]

const midImages: LayerImage[] = [
  { id:'ocean',    title:'海浪', image:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80', alt:'海浪', x:'-38vw', y:'8vh',   aura:'rgba(60,160,220,0.4)' },
  { id:'mountains',title:'远山', image:'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80', alt:'远山', x:'33vw',  y:'-7vh',  aura:'rgba(200,180,140,0.4)' },
  { id:'desert',   title:'沙漠', image:'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=600&q=80', alt:'沙漠', x:'-5vw',  y:'-14vh', aura:'rgba(240,180,100,0.35)' },
  { id:'valley',   title:'峡谷', image:'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80', alt:'峡谷', x:'10vw',  y:'13vh',  aura:'rgba(180,150,100,0.35)' },
]

const farImages: LayerImage[] = [
  { id:'stars',    title:'星河', image:'https://images.unsplash.com/photo-1502481851512-e9e2529bfbf9?w=600&q=80', alt:'星河', x:'-28vw', y:'-16vh', aura:'rgba(140,120,220,0.25)' },
  { id:'galaxy',   title:'星系', image:'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&q=80', alt:'星系', x:'22vw',  y:'12vh',  aura:'rgba(180,100,200,0.25)' },
  { id:'nebula',   title:'星云', image:'https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=600&q=80', alt:'星云', x:'-20vw', y:'18vh',  aura:'rgba(100,180,220,0.22)' },
  { id:'comet',    title:'彗星', image:'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&q=80', alt:'彗星', x:'18vw',  y:'-18vh', aura:'rgba(200,200,240,0.22)' },
]

const allImages = [...nearImages, ...midImages, ...farImages]
const totalImages = allImages.length
const trackHeight = `${(totalImages + 2) * 100}vh`

// ── 当前聚焦图片 ──
const currentRealmIdx = ref(0)
const currentRealmImgIdx = ref(0)
const currentImage = ref<LayerImage | null>(nearImages[0])

const currentRealmLabel = computed(() => {
  return ['近景层境 · Near Realm', '中景层境 · Mid Realm', '远景层境 · Far Realm'][currentRealmIdx.value] || ''
})

// ── Refs ──
const rootRef = ref<HTMLElement|null>(null)
const scrollRef = ref<HTMLElement|null>(null)
const trackRef = ref<HTMLElement|null>(null)
const sceneRef = ref<HTMLElement|null>(null)
const planeNearRef = ref<HTMLElement|null>(null)
const planeMidRef = ref<HTMLElement|null>(null)
const planeFarRef = ref<HTMLElement|null>(null)
const headerRef = ref<HTMLElement|null>(null)
const headerLineRef = ref<HTMLElement|null>(null)
const tLayer = ref<HTMLElement|null>(null)
const tRealm = ref<HTMLElement|null>(null)
const infoRef = ref<HTMLElement|null>(null)
const progressRef = ref<HTMLElement|null>(null)
const cardRefs = ref<Record<string, HTMLElement>>({})
const setCardRef = (el: Element|null, id: string) => { if (el instanceof HTMLElement) cardRefs.value[id] = el }
const cleanupFns: TweenCleanup[] = []

// ── 预加载 ──
function preload(): Promise<void[]> {
  return Promise.all(allImages.map(f =>
    new Promise<void>(r => { const i = new Image(); i.onload = () => r(); i.onerror = () => r(); i.src = f.image })
  ))
}

// ── 入场动画 ──
function setupEntrance() {
  if (!scrollRef.value || !headerRef.value || !infoRef.value || !sceneRef.value) return
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: scrollRef.value, scroller: scrollRef.value,
      start: 'top 75%', toggleActions: 'play none none reverse'
    }
  })
  tl.fromTo(headerRef.value, { autoAlpha:0, y:48 }, { autoAlpha:1, y:0, duration:.8, ease:'power3.out' })
    .fromTo(tLayer.value!, { autoAlpha:0, x:-35, scale:.5 }, { autoAlpha:1, x:0, scale:1, duration:.6, ease:'back.out(2)' }, '-=.35')
    .fromTo(tRealm.value!, { autoAlpha:0, x:35, scale:.5 }, { autoAlpha:1, x:0, scale:1, duration:.6, ease:'back.out(2)' }, '-=.4')
    .fromTo(headerLineRef.value!, { scaleX:0 }, { scaleX:1, duration:.5, ease:'power3.inOut' }, '-=.2')
    .fromTo(sceneRef.value!, { autoAlpha:0 }, { autoAlpha:1, duration:.7, ease:'power2.out' }, '-=.25')
    .fromTo(infoRef.value!, { autoAlpha:0, y:20 }, { autoAlpha:1, y:0, duration:.5, ease:'power2.out' }, '-=.15')

  // 各层卡片交错淡入
  const allCards = Object.values(cardRefs.value)
  allCards.forEach((card, i) => {
    const isNear = nearImages.some(img => cardRefs.value[img.id] === card)
    const delay = isNear ? 0 : (i < 8 ? 0.15 : 0.3)
    tl.fromTo(card, { autoAlpha:0, scale:0.6, y:30 }, { autoAlpha:1, scale:1, y:0, duration:.6, ease:'back.out(1.4)' }, `-=${.55 - delay}`)
  })

  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

// ── 核心：三层差速水平漂移 ──
function setupLayerParallax() {
  if (!scrollRef.value || !trackRef.value) return
  const sc = scrollRef.value
  const track = trackRef.value

  const mtl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track, scroller: sc,
      start: 'top top', end: 'bottom bottom', scrub: 1.4,
      onUpdate(self) {
        const p = self.progress
        // 确定当前聚焦图片
        const idx = Math.min(totalImages - 1, Math.max(0, Math.floor(p * totalImages)))
        if (idx < 4) {
          currentRealmIdx.value = 0; currentRealmImgIdx.value = idx; currentImage.value = nearImages[idx]
        } else if (idx < 8) {
          currentRealmIdx.value = 1; currentRealmImgIdx.value = idx - 4; currentImage.value = midImages[idx - 4]
        } else {
          currentRealmIdx.value = 2; currentRealmImgIdx.value = idx - 8; currentImage.value = farImages[idx - 8]
        }
      },
    },
  })

  // 近景层：大范围漂移 (±180px X, ±30px Y)
  if (planeNearRef.value) {
    mtl.fromTo(planeNearRef.value, { x: -180, y: -25 }, { x: 180, y: 25, duration: totalImages, ease: 'none' }, 0)
  }
  // 中景层：中范围漂移 (±90px X, ±15px Y)
  if (planeMidRef.value) {
    mtl.fromTo(planeMidRef.value, { x: -90, y: 15 }, { x: 90, y: -15, duration: totalImages, ease: 'none' }, 0)
  }
  // 远景层：小范围漂移 (±30px X, ±5px Y)
  if (planeFarRef.value) {
    mtl.fromTo(planeFarRef.value, { x: -30, y: -8 }, { x: 30, y: 8, duration: totalImages, ease: 'none' }, 0)
  }

  // 场景微缩呼吸
  if (sceneRef.value) {
    mtl.to(sceneRef.value, { scale: 0.96, duration: totalImages * 0.5, ease: 'sine.inOut' }, 0)
    mtl.to(sceneRef.value, { scale: 1.0, duration: totalImages * 0.5, ease: 'sine.inOut' }, totalImages * 0.5)
  }

  if (progressRef.value) {
    mtl.to(progressRef.value, { width: '100%', duration: totalImages }, 0)
  }

  cleanupFns.push(() => { mtl.scrollTrigger?.kill(); mtl.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }

onMounted(async () => {
  await preload()
  requestAnimationFrame(() => requestAnimationFrame(() => {
    setupEntrance()
    setupLayerParallax()
  }))
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  ScrollTrigger.getAll().forEach(s => s.kill())
  cleanupFns.forEach(f => f()); cleanupFns.length = 0
})
</script>

<style scoped lang="scss">
/* ═══════════════ 根容器 ═══════════════ */
.lr-root {
  position: relative; width: 100vw; height: 100vh; overflow: hidden;
  background: #040a14;
  font-family: 'Inter', 'PingFang SC', system-ui, sans-serif;
}

/* ═══════════════ 背景 ═══════════════ */
.lr-bg { position: absolute; inset: 0; z-index: 0; }
.lr-bg__gradient {
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse 45% 35% at 50% 40%, #0d1a2d 0%, #060d1a 50%, #020610 100%);
}
.lr-bg__stars {
  position: absolute; inset: 0;
  background-image:
    radial-gradient(0.7px 0.7px at 8% 12%, rgba(200,210,240,0.5), transparent),
    radial-gradient(0.5px 0.5px at 22% 28%, rgba(255,255,255,0.4), transparent),
    radial-gradient(0.9px 0.9px at 38% 8%, rgba(180,200,240,0.55), transparent),
    radial-gradient(0.6px 0.6px at 52% 35%, rgba(220,220,250,0.45), transparent),
    radial-gradient(0.8px 0.8px at 68% 15%, rgba(200,210,240,0.5), transparent),
    radial-gradient(0.4px 0.4px at 80% 42%, rgba(255,255,255,0.35), transparent),
    radial-gradient(1px 1px at 15% 55%, rgba(190,200,240,0.6), transparent),
    radial-gradient(0.5px 0.5px at 45% 62%, rgba(210,220,250,0.4), transparent),
    radial-gradient(0.7px 0.7px at 72% 58%, rgba(180,200,240,0.5), transparent),
    radial-gradient(0.6px 0.6px at 92% 22%, rgba(200,210,250,0.45), transparent),
    radial-gradient(0.4px 0.4px at 6% 75%, rgba(255,255,255,0.3), transparent),
    radial-gradient(0.8px 0.8px at 58% 78%, rgba(190,200,240,0.4), transparent);
  pointer-events: none;
}
.lr-bg__stars--dim {
  background-image:
    radial-gradient(0.5px 0.5px at 18% 20%, rgba(180,190,220,0.3), transparent),
    radial-gradient(0.4px 0.4px at 42% 18%, rgba(200,200,230,0.25), transparent),
    radial-gradient(0.6px 0.6px at 62% 32%, rgba(170,190,220,0.3), transparent),
    radial-gradient(0.4px 0.4px at 82% 25%, rgba(190,200,230,0.25), transparent),
    radial-gradient(0.5px 0.5px at 12% 65%, rgba(180,190,220,0.28), transparent),
    radial-gradient(0.4px 0.4px at 55% 70%, rgba(200,210,230,0.22), transparent),
    radial-gradient(0.5px 0.5px at 88% 55%, rgba(170,190,220,0.3), transparent),
    radial-gradient(0.3px 0.3px at 32% 82%, rgba(190,200,230,0.2), transparent);
  opacity: 0.6;
}

/* ═══════════════ 3D场景 ═══════════════ */
.lr-scene {
  position: absolute; inset: 0; z-index: 2;
  perspective: 1100px;
  perspective-origin: 50% 40%;
  transform-style: preserve-3d;
  pointer-events: none;
  will-change: transform;
}

/* ── 层间大气散射（物理分隔各层） ── */
.lr-haze {
  position: absolute; left: -5%; width: 110%; pointer-events: none;
  filter: blur(40px);
}
.lr-haze--near {
  top: 0; height: 55%;
  background: radial-gradient(ellipse 70% 80% at 50% 100%, rgba(30,50,80,0.18), transparent 70%);
  z-index: 5;
}
.lr-haze--mid {
  top: 0; height: 70%;
  background: radial-gradient(ellipse 60% 70% at 50% 100%, rgba(20,35,60,0.22), transparent 65%);
  z-index: 15;
}

/* ── 空间平面容器 ── */
.lr-plane {
  position: absolute; top: 50%; left: 50%; width: 0; height: 0;
  transform-style: preserve-3d;
  will-change: transform;
  z-index: 10;
}
.lr-plane--near  { transform: translateZ(0px);    z-index: 12; }
.lr-plane--mid   { transform: translateZ(-420px); z-index: 11; }
.lr-plane--far   { transform: translateZ(-840px); z-index: 10; }

/* ── 卡片插槽 ── */
.lr-card-slot {
  position: absolute; top: 0; left: 0;
  width: 0; height: 0;
  transform-style: preserve-3d;
}

/* ── 卡片基础 ── */
.lr-card {
  position: absolute;
  transform-style: preserve-3d;
  will-change: transform, filter, opacity;
  /* 每层不同缩放由 CSS 变量控制，fallback 在各类中 */
}

/* ── 近景卡片 (scale=1.0, 清晰锐利, 暖光晕) ── */
.lr-card--near {
  width: clamp(160px, 24vw, 260px);
  height: clamp(267px, 40vw, 433px);
  margin-left: calc(clamp(160px, 24vw, 260px) / -2);
  margin-top: calc(clamp(267px, 40vw, 433px) / -2);
}
.lr-card--near .lr-card__inner {
  box-shadow:
    0 18px 45px rgba(0,0,0,0.5),
    0 0 0 3px rgba(255,255,255,0.18),
    0 0 0 6px rgba(0,0,0,0.18);
}
.lr-card--near .lr-card__aura { opacity: 0.55; filter: blur(14px); }

/* ── 中景卡片 (scale=0.72, 微雾, 中性光晕) ── */
.lr-card--mid {
  width: clamp(115px, 17.3vw, 187px);
  height: clamp(192px, 28.8vw, 312px);
  margin-left: calc(clamp(115px, 17.3vw, 187px) / -2);
  margin-top: calc(clamp(192px, 28.8vw, 312px) / -2);
  filter: contrast(0.92) saturate(0.85);
}
.lr-card--mid .lr-card__inner {
  box-shadow:
    0 12px 30px rgba(0,0,0,0.4),
    0 0 0 2px rgba(255,255,255,0.12),
    0 0 0 4px rgba(0,0,0,0.12);
}
.lr-card--mid .lr-card__aura { opacity: 0.35; filter: blur(18px); }

/* ── 远景卡片 (scale=0.5, 大气雾化, 冷光晕) ── */
.lr-card--far {
  width: clamp(80px, 12vw, 130px);
  height: clamp(133px, 20vw, 217px);
  margin-left: calc(clamp(80px, 12vw, 130px) / -2);
  margin-top: calc(clamp(133px, 20vw, 217px) / -2);
  filter: contrast(0.8) saturate(0.65) brightness(0.85);
}
.lr-card--far .lr-card__inner {
  box-shadow:
    0 8px 20px rgba(0,0,0,0.35),
    0 0 0 1px rgba(255,255,255,0.06),
    0 0 0 2px rgba(0,0,0,0.08);
}
.lr-card--far .lr-card__aura { opacity: 0.2; filter: blur(22px); }

/* ── 光晕（彩色柔光环绕卡片） ── */
.lr-card__aura {
  position: absolute; inset: -18px; border-radius: 5px; z-index: -1;
  background: radial-gradient(ellipse 65% 55% at 50% 50%, var(--aura-color, rgba(100,160,220,0.4)), transparent 75%);
  pointer-events: none;
}

/* ── 照片主体 ── */
.lr-card__inner {
  position: relative; width: 100%; height: 100%; border-radius: 3px;
  overflow: hidden;
}
.lr-card__img {
  width: 100%; height: 100%; object-fit: cover; display: block;
  will-change: transform;
}
.lr-card__border {
  position: absolute; inset: 0; pointer-events: none;
  border: 1px solid rgba(255,255,255,0.08); border-radius: 3px;
}

/* ── 光瀑（卡片底部向下投射的柔光，替代镜面倒影） ── */
.lr-card__beam {
  position: absolute; top: 100%; left: 10%; width: 80%;
  height: 55%;
  background: linear-gradient(
    to bottom,
    var(--beam-color, rgba(100,160,220,0.2)) 0%,
    transparent 100%
  );
  transform: rotateX(35deg);
  transform-origin: top center;
  filter: blur(6px); opacity: 0.45;
  pointer-events: none; border-radius: 0 0 45% 45%;
}

/* ── 卡片悬浮动画（每层不同相位，营造"液体中悬浮"感） ── */
.lr-card--near { animation: lrFloatNear 6s ease-in-out infinite; }
.lr-card--mid  { animation: lrFloatMid 7.5s ease-in-out infinite; }
.lr-card--far  { animation: lrFloatFar 9s ease-in-out infinite; }

@keyframes lrFloatNear {
  0%,100% { transform: translateY(0px) rotateX(1deg); }
  50%     { transform: translateY(-12px) rotateX(-1deg); }
}
@keyframes lrFloatMid {
  0%,100% { transform: translateY(0px) rotateX(0.5deg); }
  33%     { transform: translateY(8px) rotateX(-0.5deg); }
  66%     { transform: translateY(-6px) rotateX(0.5deg); }
}
@keyframes lrFloatFar {
  0%,100% { transform: translateY(0px); }
  50%     { transform: translateY(-5px); }
}

/* ═══════════════ 前景 ═══════════════ */
.lr-vignette {
  position: absolute; inset: 0; z-index: 4; pointer-events: none;
  background: radial-gradient(ellipse 55% 42% at 50% 40%, transparent 30%, rgba(2,5,12,0.65) 100%);
}
.lr-foreground-haze {
  position: absolute; inset: 0; z-index: 3; pointer-events: none;
  background:
    radial-gradient(ellipse 35% 25% at 50% 50%, rgba(15,25,50,0.1), transparent 55%),
    radial-gradient(ellipse 25% 15% at 50% 35%, rgba(20,15,40,0.07), transparent 45%);
}

/* ═══════════════ 滚动 & UI ═══════════════ */
.lr-scroll {
  position: relative; width: 100%; height: 100%;
  overflow-x: hidden; overflow-y: auto;
  overscroll-behavior-y: auto; z-index: 1;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(255,255,255,.05); }
}
.lr-track { position: relative; width: 100%; }
.lr-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

/* ── 标题 ── */
.lr-header {
  position: absolute; top: 3vh; left: 50%; transform: translateX(-50%);
  z-index: 30; text-align: center; width: min(90vw, 640px);
}
.lr-kicker {
  display: inline-block; font-size: .52rem; font-weight: 700; letter-spacing: .2em;
  text-transform: uppercase; color: rgba(140,170,210,.5);
  background: rgba(255,255,255,.025); backdrop-filter: blur(6px);
  border: 1px solid rgba(255,255,255,.05); border-radius: 999px;
  padding: .15rem .7rem; margin-bottom: .28rem;
}
.lr-title { margin: 0; display: flex; justify-content: center; gap: .08em; }
.lr-title__w {
  font-size: clamp(1.4rem, 3.6vw, 2.6rem); font-weight: 900;
  color: #b8cce4; text-shadow: 0 0 10px rgba(100,130,200,.2);
  will-change: transform, opacity;
}
.lr-title__w--alt {
  background: linear-gradient(180deg, #d8e4f8, #7098c0, #4870a0);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.lr-line {
  width: 48px; height: 1.5px; margin: .18rem auto .22rem; border-radius: 2px;
  background: linear-gradient(90deg, transparent, #5880b0, #7898c8, transparent);
  transform-origin: center;
}
.lr-sub {
  margin: 0; font-size: clamp(.48rem, .68vw, .58rem);
  color: rgba(110,140,180,.28); line-height: 1.4; max-width: 300px; margin-inline: auto;
}

/* ── 信息面板 ── */
.lr-info {
  position: absolute; bottom: 5.5vh; left: 50%; transform: translateX(-50%);
  z-index: 30; text-align: center; display: flex; flex-direction: column; align-items: center; gap: .08rem;
}
.lr-info__realm {
  font-size: .5rem; font-weight: 600; letter-spacing: .16em;
  color: rgba(120,150,200,.35); text-transform: uppercase;
}
.lr-info__no {
  font-size: .6rem; font-weight: 300; letter-spacing: .1em;
  color: rgba(160,180,210,.28); font-family: 'Georgia', serif;
}
.lr-info h3 { margin: 0; font-size: clamp(.65rem, 1.2vw, .88rem); font-weight: 600; color: rgba(140,170,210,.5); letter-spacing: .04em; }

/* ── 进度条 ── */
.lr-progress {
  position: absolute; left: 0; bottom: 0; z-index: 30;
  width: 100%; height: 1.5px; background: rgba(255,255,255,.012);
}
.lr-progress__fill {
  width: 0; height: 100%;
  background: linear-gradient(90deg, #4060a0, #6080b8, #4060a0);
  background-size: 200% 100%;
}

/* ── 响应式 ── */
@media (max-width: 768px) {
  .lr-card--near { width: 130px; height: 217px; margin-left: -65px; margin-top: -108px; }
  .lr-card--mid  { width: 94px; height: 157px; margin-left: -47px; margin-top: -78px; }
  .lr-card--far  { width: 65px; height: 108px; margin-left: -32px; margin-top: -54px; }
  .lr-title__w { font-size: 1.1rem; }
  @keyframes lrFloatNear {
    0%,100% { transform: translateY(0px); }
    50%     { transform: translateY(-6px); }
  }
}
</style>
