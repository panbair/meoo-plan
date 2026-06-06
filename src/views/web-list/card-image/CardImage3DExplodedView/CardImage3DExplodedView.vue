<template>
  <section ref="rootRef" class="ex-root">
    <!-- 光效粒子背景 -->
    <div ref="particleA" class="ex-particle ex-particle--a"></div>
    <div ref="particleB" class="ex-particle ex-particle--b"></div>
    <div ref="particleC" class="ex-particle ex-particle--c"></div>

    <!-- 滚动容器 -->
    <div ref="scrollRef" class="ex-scroll">
      <div ref="trackRef" class="ex-track" :style="{ height: trackHeight }">
        <div class="ex-sticky">

          <!-- 标题 -->
          <header ref="headerRef" class="ex-header">
            <span class="ex-kicker">◈ CSS3 3D Exploded View · 图层炸裂 ◈</span>
            <h1 class="ex-title">
              <span ref="tc1" class="ex-title__c">图</span>
              <span ref="tc2" class="ex-title__c ex-title__c--z">层</span>
              <span ref="tc3" class="ex-title__c">炸</span>
              <span ref="tc4" class="ex-title__c ex-title__c--z">裂</span>
            </h1>
            <div ref="lineRef" class="ex-line"></div>
            <p class="ex-sub">向下滚动 · Z轴分层炸开 · 5层图片碎片在3D空间中分离重组</p>
          </header>

          <!-- 🔑 爆炸视图3D场景 -->
          <div ref="sceneRef" class="ex-scene">
            <div ref="layersRef" class="ex-layers">
              <div
                v-for="(layer, idx) in layers"
                :key="idx"
                :ref="(el) => setLayerRef(el as HTMLElement, idx)"
                class="ex-layer"
                :class="[`ex-layer--${idx}`, { 'ex-layer--main': idx === 2 }]"
              >
                <div class="ex-layer__slice">
                  <img :src="layer.image" :alt="layer.alt" class="ex-layer__img" />
                  <div class="ex-layer__tint" :style="{ background: layer.tint }"></div>
                  <span class="ex-layer__tag">{{ layer.tag }}</span>
                </div>
                <!-- Z轴连接线 -->
                <div v-if="idx < layers.length - 1" class="ex-connector" :class="`ex-connector--${idx}`">
                  <div class="ex-connector__line"></div>
                  <div class="ex-connector__dot"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- 图例 -->
          <div ref="legendRef" class="ex-legend">
            <span
              v-for="(layer, idx) in layers"
              :key="idx"
              class="ex-legend__item"
              :class="{ 'ex-legend__item--active': currentLayer === idx }"
            >
              <span class="ex-legend__dot" :style="{ background: layer.dotColor }"></span>
              {{ layer.name }}
            </span>
          </div>

          <div class="ex-progress"><div ref="progRef" class="ex-progress__fill"></div></div>
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
//  CardImage3DExplodedView — CSS3 3D 图层炸裂视图
//
//  核心概念：同一张图片的不同"深度切片"在Z轴上分离
//  1. 5层图片切片堆叠在一起（初始重叠=完整图）
//  2. 用户竖滚 → 各层向Z轴方向分离（translateZ递增）
//  3. 分离后可以看到每层之间的连接线和标签
//  4. 每层带有不同色调的半透明覆盖，增加层次感
//  5. 反向滚动 → 各层合拢恢复完整图
//
//  青春时尚配色：电光紫 · 极光青 · 珊瑚粉 · 霓虹蓝 · 活力橙
// ═══════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

interface LayerData {
  name: string; tag: string; image: string; alt: string
  tint: string; dotColor: string; zOffset: number
}

const layers: LayerData[] = [
  { name: '前景层', tag: 'Foreground', image: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=900&q=80', alt: '前景', tint: 'rgba(255,120,140,.08)', dotColor: '#ff6b8a', zOffset: 0 },
  { name: '中前景', tag: 'Mid-Front',  image: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=900&q=80', alt: '中前景', tint: 'rgba(100,200,230,.08)', dotColor: '#5ab8f0', zOffset: 60 },
  { name: '核心层', tag: 'Core',      image: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=900&q=80', alt: '核心', tint: 'rgba(255,200,80,.08)', dotColor: '#ffc850', zOffset: 120 },
  { name: '中后景', tag: 'Mid-Back',  image: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=900&q=80', alt: '中后景', tint: 'rgba(140,220,160,.08)', dotColor: '#5ce0a0', zOffset: 180 },
  { name: '背景层', tag: 'Background',image: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=900&q=80', alt: '背景', tint: 'rgba(180,130,230,.08)', dotColor: '#c08af0', zOffset: 240 },
]

const LAYER_COUNT = layers.length
const trackHeight = `${(LAYER_COUNT + 2) * 100}vh`

const rootRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const lineRef = ref<HTMLElement | null>(null)
const tc1 = ref<HTMLElement | null>(null); const tc2 = ref<HTMLElement | null>(null)
const tc3 = ref<HTMLElement | null>(null); const tc4 = ref<HTMLElement | null>(null)
const sceneRef = ref<HTMLElement | null>(null)
const layersRef = ref<HTMLElement | null>(null)
const legendRef = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)
const particleA = ref<HTMLElement | null>(null)
const particleB = ref<HTMLElement | null>(null)
const particleC = ref<HTMLElement | null>(null)

const currentLayer = ref(2) // 初始在核心层
const layerRefs = ref<(HTMLElement | null)[]>([])
const cleanupFns: TweenCleanup[] = []

function setLayerRef(el: HTMLElement | null, idx: number) { layerRefs.value[idx] = el }

function setupEntrance() {
  if (!scrollRef.value || !headerRef.value || !sceneRef.value) return
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: scrollRef.value, scroller: scrollRef.value,
      start: 'top 75%', toggleActions: 'play none none reverse'
    }
  })
  const chars = [tc1.value, tc2.value, tc3.value, tc4.value]
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out' })
    .fromTo(chars, { autoAlpha: 0, z: -400, scale: 0.1, rotateY: 180 }, { autoAlpha: 1, z: 0, scale: 1, rotateY: 0, duration: 0.65, stagger: 0.09, ease: 'back.out(2.5)' }, '-=0.45')
    .fromTo(lineRef.value, { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: 'power3.inOut' }, '-=0.25')
    .fromTo(sceneRef.value, { autoAlpha: 0, rotateX: 30, y: 100 }, { autoAlpha: 1, rotateX: -10, y: 0, duration: 0.9, ease: 'power4.out' }, '-=0.35')
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

function setupExplodedView() {
  if (!scrollRef.value || !trackRef.value || !layersRef.value) return
  const scroller = scrollRef.value; const track = trackRef.value

  // 初始：所有层堆叠在一起（在核心层位置）
  const layerEls = layerRefs.value.filter(Boolean) as HTMLElement[]
  layerEls.forEach((el, i) => {
    gsap.set(el, { translateZ: 0, rotateX: 0, rotateY: 0, scale: 1 })
  })
  // 场景初始俯视角度
  if (sceneRef.value) gsap.set(sceneRef.value, { rotateX: -10, rotateY: 5 })

  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.5,
      onUpdate(self) {
        const idx = Math.min(LAYER_COUNT - 1, Math.max(0, Math.round(self.progress * (LAYER_COUNT - 1))))
        currentLayer.value = idx
      },
    },
  })

  // 💥 爆炸：各层沿Z轴分离
  // 同时每层有微小的倾斜角，增加立体感
  layerEls.forEach((el, i) => {
    const zDistance = layers[i].zOffset
    // 奇数层略微正向旋转，偶数层负向旋转
    const tiltY = i % 2 === 0 ? -6 : 6
    const tiltX = i < 2 ? -4 : i > 2 ? 4 : 0

    master.to(el, {
      translateZ: zDistance,
      rotateY: tiltY,
      rotateX: tiltX,
      scale: i === 2 ? 1.08 : 0.92, // 核心层略大
      duration: 2.0,
      ease: 'power2.inOut'
    }, 0)

    // 每个层在中段微微弹跳
    master.to(el, {
      translateZ: zDistance + 15,
      duration: 0.3,
      ease: 'sine.inOut'
    }, i * 0.5 + 0.4)
    master.to(el, {
      translateZ: zDistance,
      duration: 0.35,
      ease: 'sine.inOut'
    }, i * 0.5 + 0.7)
  })

  // 场景整体轻微旋转，展示3D层次
  if (sceneRef.value) {
    master.to(sceneRef.value, { rotateY: 25, rotateX: -20, duration: LAYER_COUNT, ease: 'sine.inOut' }, 0)
  }

  // 粒子漂移
  if (particleA.value) master.to(particleA.value, { x: '12vw', y: '-8vh', opacity: 0.7, duration: LAYER_COUNT }, 0)
  if (particleB.value) master.to(particleB.value, { x: '-10vw', y: '6vh', opacity: 0.8, duration: LAYER_COUNT }, 0)
  if (particleC.value) master.to(particleC.value, { x: '5vw', y: '-12vh', opacity: 0.65, duration: LAYER_COUNT }, 0)

  if (legendRef.value) {
    master.fromTo(legendRef.value, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.5)
  }

  if (progRef.value) master.to(progRef.value, { width: '100%', duration: LAYER_COUNT }, 0)

  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }

onMounted(() => {
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupExplodedView() }))
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
.ex-root {
  position: relative; width: 100vw; height: 100vh; overflow: hidden;
  background: linear-gradient(155deg, #0c0b18 0%, #100f22 20%, #0e1025 40%, #110f24 60%, #0d0b1a 85%, #0c0b18 100%);
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif;
}

.ex-particle {
  position: absolute; border-radius: 50%; filter: blur(50px); pointer-events: none; will-change: transform,opacity; z-index: 0;
  &--a { width: 25vw; height: 20vw; top: -6vh; left: 10vw; background: radial-gradient(circle, rgba(200,100,220,.35) 0%, transparent 70%); }
  &--b { width: 22vw; height: 18vw; bottom: -5vh; right: 8vw; background: radial-gradient(circle, rgba(100,200,180,.35) 0%, transparent 70%); }
  &--c { width: 18vw; height: 16vw; top: 45vh; left: 55vw; background: radial-gradient(circle, rgba(255,150,100,.3) 0%, transparent 70%); }
}

.ex-scroll {
  position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 2;
  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(200,120,220,.25); &:hover { background: rgba(200,120,220,.45); } }
}
.ex-track { position: relative; width: 100%; }
.ex-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

.ex-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 30; text-align: center; width: min(92vw, 800px); }
.ex-kicker { display: inline-block; font-size: .62rem; font-weight: 700; letter-spacing: .3em; text-transform: uppercase; color: rgba(200,140,230,.8); background: rgba(180,100,220,.08); backdrop-filter: blur(8px); border: 1px solid rgba(180,100,220,.2); border-radius: 999px; padding: .26rem 1rem; margin-bottom: .5rem; }
.ex-title { margin: 0; display: flex; justify-content: center; gap: .08em; }
.ex-title__c { display: inline-block; font-size: clamp(2rem, 5vw, 4.2rem); font-weight: 900; color: #c078e0; will-change: transform,opacity;
  &--z { background: linear-gradient(135deg, #c870e0, #5cd8c0, #ff9666); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 2px 16px rgba(180,100,220,.5)); }
}
.ex-line { width: 90px; height: 2px; margin: .4rem auto .55rem; border-radius: 2px; background: linear-gradient(90deg, transparent, #c870e0, #5cd8c0, #ff9666, transparent); transform-origin: center; }
.ex-sub { margin: 0; font-size: clamp(.68rem, .95vw, .82rem); color: rgba(180,140,210,.4); max-width: 500px; margin-inline: auto; }

/* ═══════════════════════ CSS3 3D 爆炸场景 ═══════════════════════ */
.ex-scene {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 0; height: 0;
  z-index: 10;
  perspective: 800px;
  perspective-origin: 50% 50%;
  will-change: transform, opacity;
}

.ex-layers {
  position: absolute;
  width: 0; height: 0;
  transform-style: preserve-3d;
}

.ex-layer {
  position: absolute;
  width: min(60vw, 440px);
  height: min(42vw, 310px);
  margin-left: calc(min(60vw, 440px) / -2);
  margin-top: calc(min(42vw, 310px) / -2);
  transform-style: preserve-3d;
  will-change: transform;
  cursor: default;

  &__slice {
    position: relative; width: 100%; height: 100%;
    border-radius: 12px; overflow: hidden;
    box-shadow: 0 0 50px rgba(0,0,0,.25), 0 0 0 1px rgba(255,255,255,.1);
    backface-visibility: hidden;
  }
  &__img { width: 100%; height: 100%; object-fit: cover; display: block; }
  &__tint { position: absolute; inset: 0; }
  &__tag {
    position: absolute; top: 12px; right: 14px; z-index: 2;
    font-size: .6rem; font-weight: 700; letter-spacing: .18em;
    color: #fff; background: rgba(0,0,0,.35); backdrop-filter: blur(6px);
    border-radius: 6px; padding: .15rem .6rem;
  }

  // 核心层有金色边框
  &--main .ex-layer__slice { box-shadow: 0 0 60px rgba(255,200,80,.2), 0 0 0 2px rgba(255,200,80,.5); }
}

/* Z轴连接线 */
.ex-connector {
  position: absolute;
  top: 50%; left: 50%;
  transform-style: preserve-3d;
  pointer-events: none;
  &__line {
    width: 2px; height: 60px;
    margin-left: -1px;
    background: linear-gradient(180deg, rgba(255,255,255,.5), rgba(255,255,255,.05));
    transform: rotateX(90deg) translateZ(30px);
    transform-origin: center;
  }
  &__dot {
    width: 6px; height: 6px; border-radius: 50%;
    margin-left: -3px; margin-top: -3px;
    background: rgba(255,255,255,.7);
    box-shadow: 0 0 10px rgba(255,255,255,.4);
    transform: rotateX(90deg);
  }
}

/* 图例 */
.ex-legend {
  position: absolute; bottom: 14vh; left: 50%; transform: translateX(-50%); z-index: 25;
  display: flex; gap: 1rem; pointer-events: none;
  will-change: transform, opacity;
}
.ex-legend__item {
  display: flex; align-items: center; gap: .3rem;
  font-size: .64rem; font-weight: 600; color: rgba(255,255,255,.45);
  transition: color .3s;
  &--active { color: rgba(255,255,255,.9); }
}
.ex-legend__dot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; }

.ex-progress { position: absolute; left: 0; bottom: 0; z-index: 30; width: 100%; height: 3px; background: rgba(200,120,220,.06); }
.ex-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #c870e0, #5cd8c0, #ff9666, #c870e0); background-size: 200% 100%; box-shadow: 0 0 14px rgba(180,100,220,.5); }

@media (max-width: 768px) {
  .ex-header { top: 2vh; } .ex-kicker { font-size: .48rem; padding: .16rem .55rem; } .ex-title__c { font-size: 1.6rem; }
  .ex-layer { width: 75vw; height: 52vw; margin-left: -37.5vw; margin-top: -26vw; }
  .ex-legend { bottom: 10vh; gap: .5rem; flex-wrap: wrap; justify-content: center; }
}
</style>
