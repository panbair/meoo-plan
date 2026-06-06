<template>
  <section ref="rootRef" class="wh-root">
    <div ref="singularity" class="wh-singularity"></div>
    <div ref="accretionRing" class="wh-accretion"></div>
    <div ref="eventHorizon" class="wh-horizon"></div>

    <div ref="scrollRef" class="wh-scroll">
      <div ref="trackRef" class="wh-track" :style="{ height: trackHeight }">
        <div class="wh-sticky">

          <header ref="headerRef" class="wh-header">
            <span class="wh-kicker">🌀 CSS3 3D Wormhole · 虫洞穿梭 ◈</span>
            <h1 class="wh-title">
              <span ref="tc1" class="wh-title__c">虫</span>
              <span ref="tc2" class="wh-title__c wh-title__c--warp">洞</span>
              <span ref="tc3" class="wh-title__c">穿</span>
              <span ref="tc4" class="wh-title__c wh-title__c--warp">梭</span>
            </h1>
            <div ref="lineRef" class="wh-line"></div>
            <p class="wh-sub">向下滚动 · 时空弯曲 · 图片流向奇点 · 穿越虫洞视界</p>
          </header>

          <div ref="sceneRef" class="wh-scene">
            <div ref="wormholeRef" class="wh-wormhole">
              <!-- 空间弯曲环 — 多层同心环在Z轴上形成隧道壁 -->
              <div
                v-for="ring in warpRings"
                :key="ring.id"
                :ref="(el) => setRingRef(el as HTMLElement, ring.id)"
                class="wh-ring"
                :class="{ 'wh-ring--image': ring.hasImage }"
              >
                <!-- 环上的图片面板（每环4张） -->
                <template v-if="ring.hasImage">
                  <div class="wh-ring__img-panel wh-ring__img-panel--t">
                    <img :src="ring.images[0]" class="wh-ring__img" />
                  </div>
                  <div class="wh-ring__img-panel wh-ring__img-panel--r">
                    <img :src="ring.images[1]" class="wh-ring__img" />
                  </div>
                  <div class="wh-ring__img-panel wh-ring__img-panel--b">
                    <img :src="ring.images[2]" class="wh-ring__img" />
                  </div>
                  <div class="wh-ring__img-panel wh-ring__img-panel--l">
                    <img :src="ring.images[3]" class="wh-ring__img" />
                  </div>
                </template>
                <!-- 环光 -->
                <div class="wh-ring__glow"></div>
              </div>

              <!-- 中心奇异点 — 最终目的地图片 -->
              <div ref="singularityImg" class="wh-singularity-img">
                <img :src="destinationImage" alt="奇异点" class="wh-singularity-img__src" />
                <div class="wh-singularity-img__lens"></div>
              </div>
            </div>
          </div>

          <div ref="whInfo" class="wh-info">
            <span class="wh-info__dot"></span>
            <span class="wh-info__text">穿越视界 · {{ warpLevel }}</span>
          </div>

          <div class="wh-progress"><div ref="progRef" class="wh-progress__fill"></div></div>
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
//  CardImage3DWormhole — CSS3 3D 虫洞穿梭
//
//  核心概念：爱因斯坦-罗森桥的视觉化 — 时空弯曲隧道
//  1. 8层"空间弯曲环"在Z轴排列，每层环有4张图片
//  2. 越靠近奇点的环越紧缩（scale小、弯曲强）
//  3. 用户竖滚 → 所有环向奇点收缩 + 视角经过视界
//  4. 奇点在中心，是一张"终极目的地"图片
//  5. 吸积盘旋转光环围绕
// ═══════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

const RING_COUNT = 10
const trackHeight = `${8 * 100}vh`

const imgPool = [
  ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80', 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=400&q=80', 'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=400&q=80', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80'],
  ['https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&q=80', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80', 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=400&q=80', 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&q=80'],
  ['https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=400&q=80', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80', 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=400&q=80', 'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=400&q=80'],
  ['https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80', 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&q=80', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80', 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=400&q=80'],
]

const warpRings = Array.from({ length: RING_COUNT }, (_, i) => {
  const baseZ = -i * 200 - 100
  const distFromCenter = Math.abs(baseZ) / (RING_COUNT * 200)
  return {
    id: i,
    z: baseZ,
    warp: 1 - distFromCenter * 0.85, // 越近越紧缩
    hasImage: i % 2 === 0, // 每隔一层有图片
    images: imgPool[i % imgPool.length],
    opacity: 0.2 + distFromCenter * 0.6,
  }
})

const destinationImage = 'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=800&q=80'

const rootRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const lineRef = ref<HTMLElement | null>(null)
const tc1 = ref<HTMLElement | null>(null); const tc2 = ref<HTMLElement | null>(null)
const tc3 = ref<HTMLElement | null>(null); const tc4 = ref<HTMLElement | null>(null)
const sceneRef = ref<HTMLElement | null>(null)
const wormholeRef = ref<HTMLElement | null>(null)
const singularity = ref<HTMLElement | null>(null)
const accretionRing = ref<HTMLElement | null>(null)
const eventHorizon = ref<HTMLElement | null>(null)
const singularityImg = ref<HTMLElement | null>(null)
const whInfo = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)

const ringRefs = ref<(HTMLElement | null)[]>([])
const warpLevel = ref('外层空间')
const cleanupFns: TweenCleanup[] = []

function setRingRef(el: HTMLElement | null, idx: number) { ringRefs.value[idx] = el }

function setupEntrance() {
  if (!scrollRef.value || !headerRef.value || !sceneRef.value) return
  const tl = gsap.timeline({ scrollTrigger: { trigger: scrollRef.value, scroller: scrollRef.value, start: 'top 75%', toggleActions: 'play none none reverse' } })
  const chars = [tc1.value, tc2.value, tc3.value, tc4.value]
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out' })
    .fromTo(chars, { autoAlpha: 0, scale: 0.1, filter: 'blur(50px)' }, { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 0.8, stagger: 0.14, ease: 'power4.out' }, '-=0.5')
    .fromTo(lineRef.value, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power3.inOut' }, '-=0.3')
    .fromTo(sceneRef.value, { autoAlpha: 0, scale: 0.3, rotateZ: -20 }, { autoAlpha: 1, scale: 1, rotateZ: 0, duration: 1.2, ease: 'power4.out' }, '-=0.5')
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

function setupWormhole() {
  if (!scrollRef.value || !trackRef.value || !wormholeRef.value) return
  const scroller = scrollRef.value; const track = trackRef.value

  const els = ringRefs.value.filter(Boolean) as HTMLElement[]

  // 初始定位 — 各环在Z轴上弯曲排列
  els.forEach((el, i) => {
    const ring = warpRings[i]
    gsap.set(el, {
      translateZ: ring.z,
      scale: ring.warp,
      rotateX: ring.warp > 0.5 ? (1 - ring.warp) * 30 : (1 - ring.warp) * 60,
      opacity: ring.opacity,
    })
  })

  // 奇点影像在极远处
  if (singularityImg.value) gsap.set(singularityImg.value, { translateZ: -RING_COUNT * 200 - 200, scale: 0.02, opacity: 0.1, filter: 'blur(20px)' })

  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.2,
      onUpdate(self) {
        const p = self.progress
        if (p < 0.3) warpLevel.value = '外层空间'
        else if (p < 0.6) warpLevel.value = '引力透镜区'
        else if (p < 0.85) warpLevel.value = '事件视界'
        else warpLevel.value = '奇点'
      },
    },
  })

  const totalDist = RING_COUNT * 200 * 0.65

  // 🌀 所有环向奇点收缩
  els.forEach((el, i) => {
    const ring = warpRings[i]
    // 越靠近奇点扭曲越大
    const finalScale = ring.warp * 0.3
    const finalRot = ring.warp > 0.5 ? 60 : 90
    master.fromTo(el,
      { translateZ: ring.z, scale: ring.warp, rotateX: ring.warp > 0.5 ? (1 - ring.warp) * 30 : (1 - ring.warp) * 60, opacity: ring.opacity },
      { translateZ: ring.z + totalDist, scale: finalScale, rotateX: finalRot, opacity: 1, duration: 7, ease: 'power3.in' },
      0
    )
  })

  // 🎯 奇点影像从无到有、从小到大
  if (singularityImg.value) {
    master.fromTo(singularityImg.value,
      { translateZ: -2000, scale: 0.02, opacity: 0.1, filter: 'blur(20px)' },
      { translateZ: 50, scale: 1.2, opacity: 1, filter: 'blur(0px)', duration: 6, ease: 'power3.in' },
      1
    )
  }

  // 虫洞整体旋转
  if (wormholeRef.value) {
    master.to(wormholeRef.value, { rotateY: 30, rotateX: -8, duration: 4, ease: 'sine.inOut' }, 0)
    master.to(wormholeRef.value, { rotateY: -25, rotateX: 10, duration: 3, ease: 'sine.inOut' }, 4)
  }

  // 吸积盘旋转
  if (accretionRing.value) {
    master.to(accretionRing.value, { rotateZ: 720, scale: 0.5, opacity: 0.7, duration: 7, ease: 'power2.in' }, 0)
  }
  if (eventHorizon.value) {
    master.to(eventHorizon.value, { scale: 3, opacity: 0.6, duration: 7, ease: 'power3.in' }, 0)
  }
  if (singularity.value) {
    master.to(singularity.value, { scale: 4, opacity: 0.8, duration: 7, ease: 'power3.in' }, 0)
  }

  if (progRef.value) master.to(progRef.value, { width: '100%', duration: 7 }, 0)
  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }
onMounted(() => { requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupWormhole() })); window.addEventListener('resize', handleResize) })
onUnmounted(() => { window.removeEventListener('resize', handleResize); ScrollTrigger.getAll().forEach(st => st.kill()); cleanupFns.forEach(fn => fn()); cleanupFns.length = 0 })
</script>

<style scoped lang="scss">
.wh-root { position: relative; width: 100vw; height: 100vh; overflow: hidden; background: radial-gradient(ellipse at 50% 50%, #060610 0%, #030308 60%, #000 100%); font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif; }
.wh-singularity { position: absolute; width: 6vw; height: 6vw; top: 50%; left: 50%; transform: translate(-50%, -50%); border-radius: 50%; background: radial-gradient(circle, rgba(255,255,255,.9) 0%, rgba(200,150,255,.5) 10%, transparent 40%); filter: blur(30px); pointer-events: none; z-index: 0; will-change: transform,opacity; }
.wh-accretion { position: absolute; width: 60vw; height: 15vw; top: 50%; left: 50%; transform: translate(-50%, -50%); border-radius: 50%; border: 2px solid rgba(255,140,60,.15); box-shadow: 0 0 60px rgba(255,140,60,.1); filter: blur(2px); pointer-events: none; z-index: 0; will-change: transform,opacity; }
.wh-horizon { position: absolute; width: 20vw; height: 20vw; top: 50%; left: 50%; transform: translate(-50%, -50%); border-radius: 50%; border: 1px solid rgba(200,150,255,.2); box-shadow: 0 0 40px rgba(200,150,255,.1); pointer-events: none; z-index: 0; will-change: transform,opacity; }
.wh-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 2; &::-webkit-scrollbar { width: 4px; } &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(200,120,200,.15); } }
.wh-track { position: relative; width: 100%; }
.wh-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }
.wh-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 30; text-align: center; width: min(92vw, 800px); }
.wh-kicker { display: inline-block; font-size: .58rem; font-weight: 700; letter-spacing: .3em; text-transform: uppercase; color: rgba(200,150,240,.7); background: rgba(120,60,200,.08); backdrop-filter: blur(8px); border: 1px solid rgba(160,100,220,.16); border-radius: 999px; padding: .22rem .9rem; margin-bottom: .5rem; }
.wh-title { margin: 0; display: flex; justify-content: center; gap: .08em; }
.wh-title__c { display: inline-block; font-size: clamp(2rem, 5vw, 4.2rem); font-weight: 900; color: #c090e0; will-change: transform,opacity,filter;
  &--warp { background: linear-gradient(135deg, #c090e0, #ff8070, #f0c040); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 2px 20px rgba(200,150,240,.6)); }
}
.wh-line { width: 90px; height: 2px; margin: .4rem auto .55rem; border-radius: 2px; background: linear-gradient(90deg, transparent, #c090e0, #ff8070, #f0c040, transparent); transform-origin: center; }
.wh-sub { margin: 0; font-size: clamp(.64rem, .9vw, .78rem); color: rgba(180,140,220,.3); max-width: 540px; margin-inline: auto; }
.wh-scene { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 10; perspective: 500px; perspective-origin: 50% 50%; will-change: transform,opacity; }
.wh-wormhole { position: relative; width: 0; height: 0; transform-style: preserve-3d; will-change: transform; }

$ringBase: min(52vw, 440px);
.wh-ring {
  position: absolute; width: $ringBase; height: $ringBase;
  margin-left: calc($ringBase / -2); margin-top: calc($ringBase / -2);
  border-radius: 50%; transform-style: preserve-3d;
  will-change: transform, opacity;
  &__glow { position: absolute; inset: 0; border-radius: 50%; border: 1px solid rgba(200,150,240,.15); box-shadow: 0 0 30px rgba(200,150,240,.08); pointer-events: none; }

  &__img-panel {
    position: absolute; width: min(12vw, 100px); height: min(8vw, 70px);
    border-radius: 4px; overflow: hidden;
    box-shadow: 0 0 15px rgba(200,150,240,.2);
    &--t { top: -5px; left: 50%; transform: translateX(-50%); }
    &--b { bottom: -5px; left: 50%; transform: translateX(-50%); }
    &--r { right: -5px; top: 50%; transform: translateY(-50%); }
    &--l { left: -5px; top: 50%; transform: translateY(-50%); }
  }
  &__img { width: 100%; height: 100%; object-fit: cover; display: block; }
}

.wh-singularity-img { position: absolute; width: min(36vw, 300px); height: min(24vw, 200px); margin-left: calc(min(36vw, 300px) / -2); margin-top: calc(min(24vw, 200px) / -2); transform-style: preserve-3d; border-radius: 8px; overflow: hidden; will-change: transform,opacity,filter; box-shadow: 0 0 80px rgba(200,150,240,.4), 0 0 0 2px rgba(255,255,255,.1);
  &__src { width: 100%; height: 100%; object-fit: cover; display: block; }
  &__lens { position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,0,0,.5) 100%); pointer-events: none; }
}

.wh-info { position: absolute; bottom: 10vh; left: 50%; transform: translateX(-50%); z-index: 25; display: flex; align-items: center; gap: .4rem; pointer-events: none; }
.wh-info__dot { width: 5px; height: 5px; border-radius: 50%; background: #c090e0; box-shadow: 0 0 14px rgba(200,150,240,.7); animation: wh-pulse 2s ease-in-out infinite; }
@keyframes wh-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(3); opacity: .3; } }
.wh-info__text { font-size: .6rem; font-weight: 600; color: rgba(200,150,240,.6); letter-spacing: .12em; }
.wh-progress { position: absolute; left: 0; bottom: 0; z-index: 30; width: 100%; height: 3px; background: rgba(160,100,220,.05); }
.wh-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #c090e0, #ff8070, #f0c040, #c090e0); background-size: 200% 100%; box-shadow: 0 0 12px rgba(200,150,240,.5); }

@media (max-width: 768px) { .wh-header { top: 2vh; } .wh-kicker { font-size: .42rem; padding: .1rem .4rem; } .wh-title__c { font-size: 1.3rem; } }
</style>
