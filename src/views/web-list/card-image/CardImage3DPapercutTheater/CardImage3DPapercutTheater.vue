<template>
  <section ref="rootRef" class="pct-root">
    <!-- 背光光源 -->
    <div ref="backlight" class="pct-backlight"></div>
    <div ref="warmGlow" class="pct-warmglow"></div>

    <div ref="scrollRef" class="pct-scroll">
      <div ref="trackRef" class="pct-track" :style="{ height: trackHeight }">
        <div class="pct-sticky">

          <header ref="headerRef" class="pct-header">
            <span class="pct-kicker">✂ CSS3 3D Papercut Theater · 纸雕剧场 ✂</span>
            <h1 class="pct-title">
              <span ref="tc1" class="pct-title__c">纸</span>
              <span ref="tc2" class="pct-title__c pct-title__c--layer">雕</span>
              <span ref="tc3" class="pct-title__c">剧</span>
              <span ref="tc4" class="pct-title__c pct-title__c--layer">场</span>
            </h1>
            <div ref="lineRef" class="pct-line"></div>
            <p class="pct-sub">向下滚动 · 七层纸雕在Z轴展开 · 背光穿透 · 层层叠影 · 手作温度</p>
          </header>

          <!-- 🔑 3D 纸雕场景 -->
          <div ref="sceneRef" class="pct-scene">
            <div ref="theaterRef" class="pct-theater">
              <!-- 剪纸层 — 每层是不同形状的镂空 -->
              <div
                v-for="(layer, idx) in paperLayers"
                :key="idx"
                :ref="(el) => setLayerRef(el as HTMLElement, idx)"
                class="pct-layer"
                :class="[`pct-layer--${idx}`]"
              >
                <!-- 纸雕框 -->
                <div class="pct-layer__paper">
                  <!-- 镂空窗口 — 通过CSS clip-path实现不同形状 -->
                  <div class="pct-layer__window" :style="{ clipPath: layer.clipPath }">
                    <img :src="layer.image" :alt="layer.alt" class="pct-layer__img" />
                  </div>
                  <!-- 纸张纹理 -->
                  <div class="pct-layer__texture"></div>
                  <!-- 镂空边缘发光 -->
                  <div class="pct-layer__edge"></div>
                </div>
                <!-- Z轴厚度侧边 -->
                <div class="pct-layer__thickness"></div>
              </div>
            </div>
          </div>

          <!-- 层指示 -->
          <div ref="layerInfo" class="pct-layer-info">
            <span class="pct-layer-info__current">{{ currentLayer + 1 }}/7</span>
            <span class="pct-layer-info__name">{{ paperLayers[currentLayer]?.name }}</span>
          </div>

          <div class="pct-progress"><div ref="progRef" class="pct-progress__fill"></div></div>
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
//  CardImage3DPapercutTheater — CSS3 3D 纸雕剧场
//
//  核心概念：多层剪纸艺术在Z轴空间中层叠
//  1. 7层"剪纸"在Z轴上等距排列
//  2. 每层有不同的 clip-path 镂空形状（圆形、菱形、星形...）
//  3. 镂空窗口里展示图片
//  4. 用户竖滚 → 层间距拉开/缩进 + 视角旋转
//  5. 背光穿透所有层，最内层最亮
//  6. 每层纸张有纹理和边缘光效
//
//  青春时尚配色：暖米白 · 手工牛皮纸 · 琥珀光 · 草木绿
// ═══════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

interface PaperLayer {
  name: string; image: string; alt: string
  clipPath: string; z: number; paperColor: string
}

const paperLayers: PaperLayer[] = [
  { name: '圆窗', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', alt: '圆窗·海滩', clipPath: 'circle(38% at 50% 50%)', z: 0, paperColor: '#fdf6ee' },
  { name: '菱格', image: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=800&q=80', alt: '菱格·山谷', clipPath: 'polygon(50% 5%, 95% 50%, 50% 95%, 5% 50%)', z: -40, paperColor: '#fdf5ec' },
  { name: '六边', image: 'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=800&q=80', alt: '六边·星空', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', z: -80, paperColor: '#fcf4ea' },
  { name: '星芒', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80', alt: '星芒·森林', clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)', z: -120, paperColor: '#fcf3e8' },
  { name: '拱门', image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80', alt: '拱门·花朵', clipPath: 'ellipse(35% 42% at 50% 42%)', z: -160, paperColor: '#fbf2e6' },
  { name: '心窗', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80', alt: '心窗·麦田', clipPath: 'polygon(50% 15%, 65% 2%, 85% 10%, 95% 28%, 95% 50%, 50% 95%, 5% 50%, 5% 28%, 15% 10%, 35% 2%)', z: -200, paperColor: '#faf1e4' },
  { name: '方窗', image: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=800&q=80', alt: '方窗·极光', clipPath: 'inset(8% 8% 8% 8% round 18px)', z: -240, paperColor: '#f9efe2' },
]

const LAYER_COUNT = paperLayers.length
const trackHeight = `${(LAYER_COUNT + 2) * 100}vh`

const rootRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const lineRef = ref<HTMLElement | null>(null)
const tc1 = ref<HTMLElement | null>(null); const tc2 = ref<HTMLElement | null>(null)
const tc3 = ref<HTMLElement | null>(null); const tc4 = ref<HTMLElement | null>(null)
const sceneRef = ref<HTMLElement | null>(null)
const theaterRef = ref<HTMLElement | null>(null)
const backlight = ref<HTMLElement | null>(null)
const warmGlow = ref<HTMLElement | null>(null)
const layerInfo = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)

const currentLayer = ref(0)
const layerRefs = ref<(HTMLElement | null)[]>([])
const cleanupFns: TweenCleanup[] = []

function setLayerRef(el: HTMLElement | null, idx: number) { layerRefs.value[idx] = el }

function setupEntrance() {
  if (!scrollRef.value || !headerRef.value || !sceneRef.value) return
  const tl = gsap.timeline({
    scrollTrigger: { trigger: scrollRef.value, scroller: scrollRef.value, start: 'top 75%', toggleActions: 'play none none reverse' }
  })
  const chars = [tc1.value, tc2.value, tc3.value, tc4.value]
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out' })
    .fromTo(chars, { autoAlpha: 0, y: 80, filter: 'blur(12px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.65, stagger: 0.1, ease: 'power3.out' }, '-=0.45')
    .fromTo(lineRef.value, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power3.inOut' }, '-=0.25')
    .fromTo(sceneRef.value, { autoAlpha: 0, scale: 0.85, rotateX: 15 }, { autoAlpha: 1, scale: 1, rotateX: 0, duration: 1, ease: 'power4.out' }, '-=0.45')
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

function setupPapercut() {
  if (!scrollRef.value || !trackRef.value || !theaterRef.value) return
  const scroller = scrollRef.value; const track = trackRef.value

  const els = layerRefs.value.filter(Boolean) as HTMLElement[]

  // 初始：所有层堆叠在一起
  els.forEach((el, i) => {
    gsap.set(el, { translateZ: paperLayers[i].z * 0.3, rotateX: 0, rotateY: 0 })
  })

  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.5,
      onUpdate(self) {
        currentLayer.value = Math.min(LAYER_COUNT - 1, Math.max(0, Math.round(self.progress * (LAYER_COUNT - 1))))
      },
    },
  })

  // ✂ 纸雕展开 — 层与层之间拉开距离
  els.forEach((el, i) => {
    const targetZ = paperLayers[i].z * 1.0 // 完整拉开
    master.fromTo(el,
      { translateZ: paperLayers[i].z * 0.3 },
      { translateZ: targetZ, duration: LAYER_COUNT, ease: 'power2.inOut' },
      0
    )
    // 每层到位后有微小呼吸
    master.to(el, { translateZ: targetZ + 8, duration: 0.3, ease: 'sine.inOut' }, i * 0.6 + 1.2)
    master.to(el, { translateZ: targetZ, duration: 0.35, ease: 'sine.inOut' }, i * 0.6 + 1.5)
  })

  // 整体视角旋转 — 让层次感更明显
  if (theaterRef.value) {
    master.to(theaterRef.value, { rotateY: 15, rotateX: -5, duration: LAYER_COUNT * 0.4, ease: 'power2.inOut' }, 0)
    master.to(theaterRef.value, { rotateY: -15, rotateX: 5, duration: LAYER_COUNT * 0.4, ease: 'power2.inOut' }, LAYER_COUNT * 0.4)
    master.to(theaterRef.value, { rotateY: 0, rotateX: 0, duration: LAYER_COUNT * 0.2, ease: 'power2.inOut' }, LAYER_COUNT * 0.8)
  }

  // 背光呼吸
  if (backlight.value) {
    master.to(backlight.value, { opacity: 0.8, scale: 1.2, duration: LAYER_COUNT * 0.5, ease: 'sine.inOut' }, 0)
    master.to(backlight.value, { opacity: 0.5, scale: 1, duration: LAYER_COUNT * 0.5, ease: 'sine.inOut' }, LAYER_COUNT * 0.5)
  }
  if (warmGlow.value) {
    master.to(warmGlow.value, { y: '-5vh', opacity: 0.7, duration: LAYER_COUNT }, 0)
  }

  // 层指示器呼吸
  if (layerInfo.value) {
    for (let i = 0; i < LAYER_COUNT; i++) {
      master.to(layerInfo.value, { scale: 1.15, opacity: 1, duration: 0.1, ease: 'power2.out' }, i + 0.3)
      master.to(layerInfo.value, { scale: 1, opacity: 0.7, duration: 0.3, ease: 'power2.in' }, i + 0.4)
    }
  }

  if (progRef.value) master.to(progRef.value, { width: '100%', duration: LAYER_COUNT }, 0)

  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }

onMounted(() => {
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupPapercut() }))
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
.pct-root { position: relative; width: 100vw; height: 100vh; overflow: hidden; background: linear-gradient(170deg, #fdf8f2 0%, #faf3e8 20%, #fcf6ee 40%, #faf2e6 60%, #fdf7f0 80%, #fcf5ec 100%); font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', 'Georgia', serif; }

.pct-backlight { position: absolute; width: 30vw; height: 30vw; top: 50%; left: 50%; transform: translate(-50%, -50%); border-radius: 50%; background: radial-gradient(circle, rgba(255,200,140,.4) 0%, rgba(255,180,100,.15) 40%, transparent 70%); filter: blur(50px); pointer-events: none; z-index: 0; will-change: transform,opacity; }
.pct-warmglow { position: absolute; width: 50vw; height: 25vw; top: 10vh; left: 25vw; border-radius: 50%; background: radial-gradient(ellipse, rgba(255,220,180,.2) 0%, transparent 70%); filter: blur(60px); pointer-events: none; z-index: 0; will-change: transform,opacity; }

.pct-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 2;
  &::-webkit-scrollbar { width: 5px; } &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(200,150,100,.2); &:hover { background: rgba(200,150,100,.4); } }
}
.pct-track { position: relative; width: 100%; }
.pct-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

.pct-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 30; text-align: center; width: min(92vw, 800px); }
.pct-kicker { display: inline-block; font-size: .6rem; font-weight: 700; letter-spacing: .28em; text-transform: uppercase; color: rgba(200,140,80,.75); background: rgba(200,140,80,.08); backdrop-filter: blur(8px); border: 1px solid rgba(200,130,70,.16); border-radius: 999px; padding: .24rem 1rem; margin-bottom: .5rem; }
.pct-title { margin: 0; display: flex; justify-content: center; gap: .08em; }
.pct-title__c { display: inline-block; font-size: clamp(2rem, 5vw, 4.2rem); font-weight: 900; color: #c08050; will-change: transform,opacity,filter;
  &--layer { background: linear-gradient(135deg, #d4a060, #e8c880, #c89050); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 2px 12px rgba(200,150,80,.4)); }
}
.pct-line { width: 90px; height: 2px; margin: .4rem auto .55rem; border-radius: 2px; background: linear-gradient(90deg, transparent, #d4a060, #e8c880, #d4a060, transparent); transform-origin: center; }
.pct-sub { margin: 0; font-size: clamp(.66rem, .9vw, .8rem); color: rgba(180,130,80,.4); max-width: 530px; margin-inline: auto; }

/* ═══════════════════════ CSS3 3D 纸雕场景 ═══════════════════════ */
.pct-scene {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  width: 0; height: 0; z-index: 10;
  perspective: 700px;
  perspective-origin: 50% 50%;
  will-change: transform, opacity;
}

.pct-theater {
  position: absolute; width: 0; height: 0;
  transform-style: preserve-3d;
  will-change: transform;
}

$paperW: min(50vw, 400px);
$paperH: min(38vw, 300px);

.pct-layer {
  position: absolute;
  width: $paperW; height: $paperH;
  margin-left: calc($paperW / -2); margin-top: calc($paperH / -2);
  transform-style: preserve-3d;
  will-change: transform;
  backface-visibility: hidden;

  &__paper {
    position: relative; width: 100%; height: 100%;
    background: #fdf7ef;
    border-radius: 6px;
    box-shadow: 0 8px 40px rgba(0,0,0,.12), 0 0 0 1px rgba(200,150,80,.1);
    backface-visibility: hidden;
    overflow: hidden;
  }

  // 🔑 镂空窗口 — clip-path 形状
  &__window {
    position: absolute; inset: 0;
    overflow: hidden;
    // 边缘柔光
    box-shadow: inset 0 0 20px rgba(255,180,100,.3);
  }
  &__img { width: 100%; height: 100%; object-fit: cover; display: block; }

  // 纸张纹理
  &__texture {
    position: absolute; inset: 0; pointer-events: none;
    background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(200,150,80,.02) 2px, rgba(200,150,80,.02) 4px);
    mask-image: radial-gradient(circle at center, black 60%, transparent);
    -webkit-mask-image: radial-gradient(circle at center, black 60%, transparent);
    border-radius: 6px;
  }

  // 镂空边缘发光
  &__edge {
    position: absolute; inset: 0; pointer-events: none;
    box-shadow: inset 0 0 30px rgba(255,180,100,.15), inset 0 0 60px rgba(255,200,120,.08);
    border-radius: 6px;
  }

  // 纸张厚度侧边
  &__thickness {
    position: absolute; top: 0; left: 0; width: 100%; height: 4px;
    transform: rotateX(90deg); transform-origin: top;
    background: linear-gradient(180deg, #e8d0b0, #d4b890);
    border-radius: 0 0 2px 2px;
  }
}

/* 层颜色递变 */
.pct-layer--0 .pct-layer__paper { background: #fefaf4; }
.pct-layer--1 .pct-layer__paper { background: #fdf7ef; }
.pct-layer--2 .pct-layer__paper { background: #fcf5ea; }
.pct-layer--3 .pct-layer__paper { background: #fbf2e6; }
.pct-layer--4 .pct-layer__paper { background: #faf0e2; }
.pct-layer--5 .pct-layer__paper { background: #f9eede; }
.pct-layer--6 .pct-layer__paper { background: #f8ecda; }

/* 层指示器 */
.pct-layer-info { position: absolute; bottom: 10vh; left: 50%; transform: translateX(-50%); z-index: 25; display: flex; align-items: baseline; gap: .4rem; pointer-events: none; will-change: transform,opacity; opacity: .7; }
.pct-layer-info__current { font-size: 1.5rem; font-weight: 900; color: #c08050; font-family: 'Georgia', serif; }
.pct-layer-info__name { font-size: .68rem; font-weight: 600; color: rgba(180,120,60,.6); letter-spacing: .1em; }

.pct-progress { position: absolute; left: 0; bottom: 0; z-index: 30; width: 100%; height: 3px; background: rgba(200,140,80,.05); }
.pct-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #d4a060, #e8c880, #d4a060); background-size: 200% 100%; box-shadow: 0 0 10px rgba(200,150,100,.4); }

@media (max-width: 768px) {
  .pct-header { top: 2vh; } .pct-kicker { font-size: .46rem; padding: .14rem .5rem; } .pct-title__c { font-size: 1.5rem; }
  .pct-layer-info { bottom: 7vh; }
}
</style>
