<template>
  <section ref="rootRef" class="ds-root" @mousemove="onMouseMove" @mouseleave="onMouseLeave">
    <div ref="scrollRef" class="ds-scroll">
      <div ref="trackRef" class="ds-track" :style="{ height: trackHeight }">
        <div class="ds-sticky">

          <!-- 🔑 5层景深 — 每层包含figure+文字+装饰 -->
          <div ref="sceneRef" class="ds-scene" :style="{ perspectiveOrigin: perspOrigin }">
            <div ref="stageRef" class="ds-stage" :style="{ transform: stageTransform }">

              <figure
                v-for="(layer, i) in layers"
                :key="layer.id"
                :ref="el => { layerRefs[i] = el as HTMLElement | null }"
                class="ds-layer"
                :style="{ transform: `translateZ(${layer.baseZ}px)` }"
              >
                <img :src="layer.url" :alt="layer.title" class="ds-layer__img" loading="lazy" />
                <figcaption class="ds-layer__caption">
                  <span class="ds-layer__title">{{ layer.title }}</span>
                  <span class="ds-layer__desc">{{ layer.desc }}</span>
                </figcaption>
              </figure>

            </div>
          </div>

          <!-- 景深指示 -->
          <div ref="depthBar" class="ds-depth">
            <span
              v-for="(layer, i) in layers" :key="layer.id"
              class="ds-depth__dot"
              :style="{ opacity: currentLayer === i ? 1 : .25, transform: currentLayer === i ? 'scale(1.5)' : 'scale(1)' }"
            ></span>
            <span class="ds-depth__label">{{ layers[currentLayer]?.title }} · f/{{ apertureLabel }}</span>
          </div>

          <div class="ds-progress"><div ref="progRef" class="ds-progress__fill"></div></div>
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

interface DepthLayer {
  id: number; title: string; desc: string; url: string
  baseZ: number; parallaxSpeed: number; baseBlur: number; baseOpacity: number
}

const layers: DepthLayer[] = [
  { id: 0, title: 'FJORD',   desc: '远景 · 峡湾', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', baseZ: -250, parallaxSpeed: 0.15, baseBlur: 4, baseOpacity: .55 },
  { id: 1, title: 'FOREST',  desc: '中远景 · 森林', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80', baseZ: -130, parallaxSpeed: 0.3, baseBlur: 2, baseOpacity: .7 },
  { id: 2, title: 'MEADOW',  desc: '中景 · 草原', url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80', baseZ: 0,   parallaxSpeed: 0.5, baseBlur: 0, baseOpacity: .9 },
  { id: 3, title: 'GARDEN',  desc: '中近景 · 花园', url: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=800&q=80', baseZ: 90,  parallaxSpeed: 0.7, baseBlur: 0, baseOpacity: .95 },
  { id: 4, title: 'BLOOM',   desc: '前景 · 花卉', url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80', baseZ: 180, parallaxSpeed: 1.0, baseBlur: 0, baseOpacity: 1 },
]

const LAYER_COUNT = layers.length
const STAGES = 5
const trackHeight = `${(STAGES + 1) * 100}vh`

// ── 鼠标视差 ──
const mx = ref(0); const my = ref(0); const active = ref(false)
function onMouseMove(e: MouseEvent) { mx.value = (e.clientX / innerWidth - .5) * 2; my.value = (e.clientY / innerHeight - .5) * 2; active.value = true }
function onMouseLeave() { active.value = false }

const perspOrigin = computed(() => `${50 + mx.value * 10}% ${48 + my.value * 8}%`)
const stageTransform = computed(() => `rotateX(${-my.value * 4}deg) rotateY(${mx.value * 5}deg)`)

// 🔑 鼠标视差循环
let rafId = 0
const currentTx = ref(0); const currentTy = ref(0)
function parallaxLoop() {
  const tx = active.value ? mx.value : 0; const ty = active.value ? my.value : 0
  currentTx.value += (tx - currentTx.value) * .08
  currentTy.value += (ty - currentTy.value) * .08
  // 每层独立偏移量
  layerRefs.value.forEach((el, i) => {
    if (!el) return
    const l = layers[i]
    el.style.transform = `translateZ(${l.baseZ}px) translateX(${currentTx.value * 30 * l.parallaxSpeed}px) translateY(${currentTy.value * 20 * l.parallaxSpeed}px)`
  })
  rafId = requestAnimationFrame(parallaxLoop)
}

// ── Refs ──
const rootRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const sceneRef = ref<HTMLElement | null>(null)
const stageRef = ref<HTMLElement | null>(null)
const layerRefs = ref<(HTMLElement | null)[]>(Array(LAYER_COUNT).fill(null))
const depthBar = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)

const currentLayer = ref(2); const apertureLabel = ref('2.8')
const cleanupFns: TweenCleanup[] = []

// ═══════════════ 滚动景深推进 ═══════════════
function setupDepthPush() {
  if (!scrollRef.value || !trackRef.value || !stageRef.value) return
  const scroller = scrollRef.value; const track = trackRef.value; const stage = stageRef.value
  const D = STAGES

  // 初始
  layerRefs.value.forEach((el, i) => {
    if (!el) return
    const l = layers[i]
    el.style.filter = `blur(${l.baseBlur}px)`
    el.style.opacity = String(l.baseOpacity)
  })

  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.3,
      onUpdate(self) {
        currentLayer.value = Math.min(LAYER_COUNT - 1, Math.max(0, Math.round(self.progress * (LAYER_COUNT - 1))))
        const fStop = (2.8 - self.progress * 2.4).toFixed(1)
        apertureLabel.value = fStop // f/2.8 → f/0.4 (景深越来越浅)
        // 动态模糊: 聚焦层清晰, 前后层模糊
        layerRefs.value.forEach((el, i) => {
          if (!el) return
          const l = layers[i]
          const dist = Math.abs(i - currentLayer.value)
          const blur = l.baseBlur + dist * 3 * (1 + self.progress)
          const opacity = l.baseOpacity - dist * .15
          el.style.filter = `blur(${blur}px)`
          el.style.opacity = String(Math.max(.25, opacity))
        })
      },
    },
  })

  // 层间Z轴推进
  master.to(layerRefs.value[0], { translateZ: -380, duration: D }, 0)
  master.to(layerRefs.value[1], { translateZ: -220, duration: D }, 0)
  master.to(layerRefs.value[2], { translateZ: -60,  duration: D }, 0)
  master.to(layerRefs.value[3], { translateZ: 60,   duration: D }, 0)
  master.to(layerRefs.value[4], { translateZ: 220,  duration: D }, 0)

  master.to(stage, { rotateX: 12, rotateY: -8, duration: D * .5 }, 0)
  master.to(stage, { rotateX: -8, rotateY: 6, duration: D * .5 }, D * .5)

  if (progRef.value) master.to(progRef.value, { width: '100%', duration: D }, 0)
  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }

onMounted(() => {
  requestAnimationFrame(() => setupDepthPush())
  window.addEventListener('resize', handleResize)
  rafId = requestAnimationFrame(parallaxLoop)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  cancelAnimationFrame(rafId)
  ScrollTrigger.getAll().forEach(st => st.kill())
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0
})
</script>

<style scoped lang="scss">
/* ═══════════════════════ 画廊空间 ═══════════════════════ */
.ds-root {
  position: relative; width: 100vw; height: 100vh; overflow: hidden;
  background: linear-gradient(170deg, #faf7f2 0%, #f5f1ea 30%, #f8f4ee 60%, #f2efe6 100%);
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, serif;
}

.ds-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 5;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(160,120,80,.12); }
}
.ds-track { position: relative; width: 100%; }
.ds-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

/* ═══════════════════════ 3D 场景 ═══════════════════════ */
.ds-scene {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 0; height: 0; z-index: 10;
  perspective: 900px;
  perspective-origin: 50% 48%;
  will-change: perspective-origin;
}
.ds-stage {
  position: absolute; width: 0; height: 0;
  transform-style: preserve-3d;
  will-change: transform;
  transition: transform .5s cubic-bezier(.25,.1,.25,1);
}

/* ═══════════════ 🔑 景深层 ═══════════════ */
.ds-layer {
  position: absolute; transform-style: preserve-3d;
  will-change: transform, filter, opacity;
  backface-visibility: hidden;
  transition: filter .3s ease, opacity .3s ease;
}
.ds-layer__img {
  display: block; object-fit: cover; border-radius: 8px;
  width: min(40vw, 320px); height: min(50vw, 420px);
  margin-left: calc(min(40vw, 320px) / -2);
  margin-top: calc(min(50vw, 420px) / -2);
  box-shadow: 0 10px 40px rgba(0,0,0,.2), 0 0 0 1px rgba(255,255,255,.15);
}
.ds-layer__caption {
  position: absolute; text-align: center; width: 200px;
  left: 50%; transform: translateX(-50%);
  pointer-events: none;
}
.ds-layer__title {
  display: block; font-size: 1.1rem; font-weight: 900; letter-spacing: .08em;
  color: rgba(60,30,10,.7);
}
.ds-layer__desc {
  display: block; font-size: .6rem; font-weight: 500; letter-spacing: .12em;
  color: rgba(100,60,30,.4); margin-top: 2px;
}

/* 标题在上方 */
.ds-layer:nth-child(odd) .ds-layer__caption { bottom: calc(100% + 14px); }
.ds-layer:nth-child(even) .ds-layer__caption { top: calc(100% + 14px); }

/* ── 景深指示 ── */
.ds-depth { position: absolute; bottom: 10vh; left: 50%; transform: translateX(-50%); z-index: 35; pointer-events: none; display: flex; align-items: center; gap: .35rem; }
.ds-depth__dot { width: 5px; height: 5px; border-radius: 50%; background: #b08050; transition: all .3s ease; }
.ds-depth__label { font-size: .5rem; font-weight: 600; letter-spacing: .1em; color: rgba(120,70,40,.5); font-family: 'Courier New', monospace; margin-left: .3rem; white-space: nowrap; }

.ds-progress { position: absolute; left: 0; bottom: 0; z-index: 40; width: 100%; height: 2px; background: rgba(160,120,80,.03); }
.ds-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #c89860, #a07040, #c89860); }

@media (max-width: 768px) {
  .ds-scene { perspective: 600px; }
  .ds-layer__img { width: 50vw; height: 64vw; margin-left: -25vw; margin-top: -32vw; }
}
</style>
