<template>
  <section ref="rootRef" class="tun-root">
    <!-- 隧道尽头的光源 -->
    <div ref="vortexGlow" class="tun-vortex"></div>
    <!-- 沿途粒子 -->
    <div ref="particleStream" class="tun-particles"></div>

    <div ref="scrollRef" class="tun-scroll">
      <div ref="trackRef" class="tun-track" :style="{ height: trackHeight }">
        <div class="tun-sticky">

          <header ref="headerRef" class="tun-header">
            <span class="tun-kicker">◈ CSS3 3D Infinity Tunnel · 图片长廊隧道 ◈</span>
            <h1 class="tun-title">
              <span ref="tc1" class="tun-title__c">图</span>
              <span ref="tc2" class="tun-title__c tun-title__c--deep">廊</span>
              <span ref="tc3" class="tun-title__c">隧</span>
              <span ref="tc4" class="tun-title__c tun-title__c--deep">道</span>
            </h1>
            <div ref="lineRef" class="tun-line"></div>
            <p class="tun-sub">向下滚动 · 穿越无尽图片长廊 · 两侧巨幅画面飞掠 · 深处终极影像</p>
          </header>

          <!-- 🔑 3D隧道场景 -->
          <div ref="sceneRef" class="tun-scene">
            <div ref="tunnelRef" class="tun-tunnel">

              <!-- === 隧道结构框（12层） === -->
              <div
                v-for="ring in rings"
                :key="'r'+ring.id"
                :ref="(el) => setRingRef(el as HTMLElement, ring.id)"
                class="tun-ring"
              >
                <!-- 顶部横梁 -->
                <div class="tun-ring__beam tun-ring__beam--top">
                  <img :src="ringImages[ring.id % ringImages.length]" class="tun-ring__beam-img" />
                  <div class="tun-ring__beam-tint"></div>
                </div>
                <!-- 底部横梁 -->
                <div class="tun-ring__beam tun-ring__beam--bottom">
                  <img :src="ringImages[(ring.id + 1) % ringImages.length]" class="tun-ring__beam-img" />
                  <div class="tun-ring__beam-tint"></div>
                </div>
                <!-- 框线光效 -->
                <div class="tun-ring__glow"></div>
              </div>

              <!-- === 左墙巨幅图片面板（6组，每2层框之间一组） === -->
              <div
                v-for="panel in leftPanels"
                :key="'L'+panel.id"
                :ref="(el) => setLeftPanelRef(el as HTMLElement, panel.id)"
                class="tun-wall-panel tun-wall-panel--left"
              >
                <img :src="panel.image" :alt="panel.alt" class="tun-wall-panel__img" />
                <div class="tun-wall-panel__label">{{ panel.label }}</div>
                <div class="tun-wall-panel__vignette"></div>
              </div>

              <!-- === 右墙巨幅图片面板（6组） === -->
              <div
                v-for="panel in rightPanels"
                :key="'R'+panel.id"
                :ref="(el) => setRightPanelRef(el as HTMLElement, panel.id)"
                class="tun-wall-panel tun-wall-panel--right"
              >
                <img :src="panel.image" :alt="panel.alt" class="tun-wall-panel__img" />
                <div class="tun-wall-panel__label">{{ panel.label }}</div>
                <div class="tun-wall-panel__vignette"></div>
              </div>

              <!-- === 隧道深处的终极影像 === -->
              <div ref="destinationRef" class="tun-destination">
                <img :src="destinationImage" alt="终景" class="tun-destination__img" />
                <div class="tun-destination__glow"></div>
                <div class="tun-destination__label">✦ 终景 ✦</div>
              </div>
            </div>
          </div>

          <!-- 当前位置指示 -->
          <div ref="locatorRef" class="tun-locator">
            <span class="tun-locator__dot"></span>
            <span class="tun-locator__text">深度 L{{ depthLevel }}/{{ RING_COUNT }} · {{ currentSideLabel }}</span>
          </div>

          <div class="tun-progress"><div ref="progRef" class="tun-progress__fill"></div></div>
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
//  CardImage3DInfinityTunnel — CSS3 3D 图片长廊隧道
//
//  重新设计 — 强调图片展示：
//  1. 12层结构框在Z轴构成隧道骨架
//  2. 左右墙壁各有6组巨幅图片面板（在框之间）
//  3. 隧道尽头有一张"终极影像"随scroll逐渐靠近
//  4. 用户竖滚 → 所有元素向相机推进 → 飞越画廊体验
//  5. 左右墙壁面板交替展示不同的Unsplash大片
//  6. 隧道有摆动视角，让侧壁图片清晰可见
//
//  青春时尚配色：电光紫 · 霓虹青 · 深空蓝 · 星光银
// ═══════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

const RING_COUNT = 12
const TRACK_MULTIPLIER = 7

const ringImages = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=600&q=80',
  'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=600&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80',
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&q=80',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80',
]

const rings = Array.from({ length: RING_COUNT }, (_, i) => ({
  id: i,
  scale: 1 - i * 0.1,
  z: -i * 250,
}))

// 左墙图片面板 — 在框与框之间的Z轴位置
const panelImagesLeft = [
  { label: '晨曦海滩', alt: '海滩', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80' },
  { label: '山谷暮光', alt: '山谷', image: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=800&q=80' },
  { label: '璀璨星空', alt: '星空', image: 'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=800&q=80' },
  { label: '密林深处', alt: '森林', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80' },
  { label: '繁花似锦', alt: '花朵', image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80' },
  { label: '金色麦浪', alt: '麦田', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80' },
]

const panelImagesRight = [
  { label: '银河拱桥', alt: '银河', image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80' },
  { label: '极光之舞', alt: '极光', image: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=800&q=80' },
  { label: '旭日东升', alt: '日出', image: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=800&q=80' },
  { label: '碧海蓝湾', alt: '海洋', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80' },
  { label: '山巅云海', alt: '山峦', image: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=800&q=80' },
  { label: '花海日暮', alt: '花田', image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80' },
]

const PANEL_COUNT = 6
const leftPanels = Array.from({ length: PANEL_COUNT }, (_, i) => ({
  id: i, ...panelImagesLeft[i], z: -i * 500 - 125,
}))
const rightPanels = Array.from({ length: PANEL_COUNT }, (_, i) => ({
  id: i, ...panelImagesRight[i], z: -i * 500 - 125,
}))

const destinationImage = 'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=1200&q=80'
const trackHeight = `${TRACK_MULTIPLIER * 100}vh`

const rootRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const lineRef = ref<HTMLElement | null>(null)
const tc1 = ref<HTMLElement | null>(null); const tc2 = ref<HTMLElement | null>(null)
const tc3 = ref<HTMLElement | null>(null); const tc4 = ref<HTMLElement | null>(null)
const sceneRef = ref<HTMLElement | null>(null)
const tunnelRef = ref<HTMLElement | null>(null)
const destinationRef = ref<HTMLElement | null>(null)
const vortexGlow = ref<HTMLElement | null>(null)
const particleStream = ref<HTMLElement | null>(null)
const locatorRef = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)

const ringRefs = ref<(HTMLElement | null)[]>([])
const leftPanelRefs = ref<(HTMLElement | null)[]>([])
const rightPanelRefs = ref<(HTMLElement | null)[]>([])
const currentSideLabel = ref('')
const depthLevel = ref(1)
const cleanupFns: TweenCleanup[] = []

function setRingRef(el: HTMLElement | null, idx: number) { ringRefs.value[idx] = el }
function setLeftPanelRef(el: HTMLElement | null, idx: number) { leftPanelRefs.value[idx] = el }
function setRightPanelRef(el: HTMLElement | null, idx: number) { rightPanelRefs.value[idx] = el }

function setupEntrance() {
  if (!scrollRef.value || !headerRef.value || !sceneRef.value) return
  const tl = gsap.timeline({
    scrollTrigger: { trigger: scrollRef.value, scroller: scrollRef.value, start: 'top 75%', toggleActions: 'play none none reverse' }
  })
  const chars = [tc1.value, tc2.value, tc3.value, tc4.value]
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out' })
    .fromTo(chars, { autoAlpha: 0, z: -600, scale: 0.1, filter: 'blur(40px)' }, { autoAlpha: 1, z: 0, scale: 1, filter: 'blur(0px)', duration: 0.8, stagger: 0.12, ease: 'back.out(2.5)' }, '-=0.5')
    .fromTo(lineRef.value, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power3.inOut' }, '-=0.3')
    .fromTo(sceneRef.value, { autoAlpha: 0, scale: 0.5, rotateX: -30 }, { autoAlpha: 1, scale: 1, rotateX: -6, duration: 1.1, ease: 'power4.out' }, '-=0.4')
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

function setupInfinityTunnel() {
  if (!scrollRef.value || !trackRef.value || !tunnelRef.value) return
  const scroller = scrollRef.value; const track = trackRef.value

  // 初始定位所有元素
  const ringEls = ringRefs.value.filter(Boolean) as HTMLElement[]
  ringEls.forEach((el, i) => {
    gsap.set(el, { translateZ: rings[i].z, scale: rings[i].scale, opacity: 0.25 + (1 - i * 0.07) })
  })

  const lPanels = leftPanelRefs.value.filter(Boolean) as HTMLElement[]
  const rPanels = rightPanelRefs.value.filter(Boolean) as HTMLElement[]
  lPanels.forEach((el, i) => gsap.set(el, { translateZ: leftPanels[i].z, scale: 1 - i * 0.12, opacity: 0.25 + (1 - i * 0.12) }))
  rPanels.forEach((el, i) => gsap.set(el, { translateZ: rightPanels[i].z, scale: 1 - i * 0.12, opacity: 0.25 + (1 - i * 0.12) }))

  // 终点影像在极远处
  if (destinationRef.value) gsap.set(destinationRef.value, { translateZ: -RING_COUNT * 250 - 100, scale: 0.1, opacity: 0.3 })

  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.2,
      onUpdate(self) {
        depthLevel.value = Math.min(RING_COUNT, Math.max(1, Math.ceil(self.progress * RING_COUNT)))
        const panelIdx = Math.floor(self.progress * PANEL_COUNT)
        if (panelIdx < PANEL_COUNT) {
          currentSideLabel.value = leftPanels[Math.min(PANEL_COUNT - 1, panelIdx)].label
        }
      },
    },
  })

  const totalDist = RING_COUNT * 250 * 0.85

  // 🌀 结构框向前推进
  ringEls.forEach((el, i) => {
    master.fromTo(el,
      { translateZ: rings[i].z, scale: rings[i].scale, opacity: 0.25 + (1 - i * 0.07) },
      { translateZ: rings[i].z + totalDist, scale: rings[i].scale + (1 - rings[i].scale) * 0.7, opacity: 0.9, duration: TRACK_MULTIPLIER, ease: 'power2.in' },
      0
    )
  })

  // 🖼️ 左墙面板推进
  lPanels.forEach((el, i) => {
    master.fromTo(el,
      { translateZ: leftPanels[i].z, scale: 1 - i * 0.12, opacity: 0.25 + (1 - i * 0.12) },
      { translateZ: leftPanels[i].z + totalDist * 1.1, scale: 1.5, opacity: 1, duration: TRACK_MULTIPLIER, ease: 'power2.in' },
      0
    )
  })

  // 🖼️ 右墙面板推进
  rPanels.forEach((el, i) => {
    master.fromTo(el,
      { translateZ: rightPanels[i].z, scale: 1 - i * 0.12, opacity: 0.25 + (1 - i * 0.12) },
      { translateZ: rightPanels[i].z + totalDist * 1.1, scale: 1.5, opacity: 1, duration: TRACK_MULTIPLIER, ease: 'power2.in' },
      0
    )
  })

  // 🎯 终点影像逐渐变大变清晰（最终到达面前）
  if (destinationRef.value) {
    master.fromTo(destinationRef.value,
      { translateZ: -totalDist * 0.9, scale: 0.05, opacity: 0.2, filter: 'blur(8px)' },
      { translateZ: 100, scale: 1, opacity: 1, filter: 'blur(0px)', duration: TRACK_MULTIPLIER * 0.9, ease: 'power3.in' },
      0
    )
  }

  // 隧道旋转让侧壁可见
  if (tunnelRef.value) {
    master.to(tunnelRef.value, { rotateY: 25, rotateX: -5, duration: TRACK_MULTIPLIER * 0.35, ease: 'sine.inOut' }, 0)
    master.to(tunnelRef.value, { rotateY: -20, rotateX: 4, duration: TRACK_MULTIPLIER * 0.35, ease: 'sine.inOut' }, TRACK_MULTIPLIER * 0.35)
    master.to(tunnelRef.value, { rotateY: 10, rotateX: -2, duration: TRACK_MULTIPLIER * 0.3, ease: 'sine.inOut' }, TRACK_MULTIPLIER * 0.7)
  }

  // 光源呼吸
  if (vortexGlow.value) master.to(vortexGlow.value, { scale: 3, opacity: 0.6, duration: TRACK_MULTIPLIER, ease: 'power2.in' }, 0)
  if (particleStream.value) master.to(particleStream.value, { opacity: 0.7, duration: TRACK_MULTIPLIER }, 0)

  if (progRef.value) master.to(progRef.value, { width: '100%', duration: TRACK_MULTIPLIER }, 0)

  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }

onMounted(() => {
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupInfinityTunnel() }))
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
.tun-root { position: relative; width: 100vw; height: 100vh; overflow: hidden; background: radial-gradient(ellipse at 50% 50%, #0c1028 0%, #080b1c 50%, #040610 100%); font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif; }

.tun-vortex { position: absolute; width: 15vw; height: 15vw; top: 50%; left: 50%; transform: translate(-50%, -50%); border-radius: 50%; background: radial-gradient(circle, rgba(160,120,240,.4) 0%, rgba(80,160,240,.2) 25%, transparent 60%); filter: blur(50px); pointer-events: none; z-index: 0; will-change: transform,opacity; }

.tun-particles {
  position: absolute; inset: 0; z-index: 0; pointer-events: none; opacity: .3;
  background-image:
    radial-gradient(1px 1px at 15% 25%, rgba(200,180,255,.7), transparent),
    radial-gradient(1px 1px at 35% 60%, rgba(150,200,255,.6), transparent),
    radial-gradient(1px 1px at 55% 15%, rgba(180,220,255,.5), transparent),
    radial-gradient(1px 1px at 75% 55%, rgba(200,180,255,.6), transparent),
    radial-gradient(1.5px 1.5px at 25% 80%, rgba(160,200,255,.8), transparent),
    radial-gradient(1px 1px at 65% 35%, rgba(180,200,255,.5), transparent),
    radial-gradient(1.5px 1.5px at 45% 75%, rgba(200,180,255,.7), transparent),
    radial-gradient(1px 1px at 85% 20%, rgba(160,200,255,.6), transparent);
  background-size: 300px 200px; will-change: opacity;
}

.tun-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 2;
  &::-webkit-scrollbar { width: 5px; } &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(140,100,240,.2); &:hover { background: rgba(140,100,240,.4); } }
}
.tun-track { position: relative; width: 100%; }
.tun-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

.tun-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 30; text-align: center; width: min(92vw, 800px); }
.tun-kicker { display: inline-block; font-size: .6rem; font-weight: 700; letter-spacing: .3em; text-transform: uppercase; color: rgba(160,120,240,.75); background: rgba(120,80,200,.08); backdrop-filter: blur(8px); border: 1px solid rgba(140,100,220,.18); border-radius: 999px; padding: .24rem 1rem; margin-bottom: .5rem; }
.tun-title { margin: 0; display: flex; justify-content: center; gap: .08em; }
.tun-title__c { display: inline-block; font-size: clamp(2rem, 5vw, 4.2rem); font-weight: 900; color: #a080e0; will-change: transform,opacity,filter;
  &--deep { background: linear-gradient(135deg, #a080e0, #60b0f0, #50d8c0); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 2px 18px rgba(120,100,220,.6)); }
}
.tun-line { width: 90px; height: 2px; margin: .4rem auto .55rem; border-radius: 2px; background: linear-gradient(90deg, transparent, #a080e0, #60b0f0, #50d8c0, transparent); transform-origin: center; }
.tun-sub { margin: 0; font-size: clamp(.66rem, .9vw, .8rem); color: rgba(160,140,210,.35); max-width: 550px; margin-inline: auto; }

/* ═══════════════════════ CSS3 3D 隧道场景 ═══════════════════════ */
.tun-scene {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  width: 0; height: 0; z-index: 10;
  perspective: 500px;
  perspective-origin: 50% 50%;
  will-change: transform, opacity;
}

.tun-tunnel {
  position: absolute; width: 0; height: 0;
  transform-style: preserve-3d;
  will-change: transform;
}

/* ═══════════ 隧道结构框 ═══════════ */
$baseW: min(58vw, 500px);
$baseH: min(42vw, 360px);
$halfW: calc($baseW / 2);
$halfH: calc($baseH / 2);

.tun-ring {
  position: absolute; width: 0; height: 0;
  transform-style: preserve-3d;
  will-change: transform, opacity;

  &__beam {
    position: absolute; overflow: hidden;
    box-shadow: 0 0 20px rgba(0,0,0,.3);
    // 横梁70px高，图片作为纹理
    &--top {
      width: $baseW; height: 70px;
      margin-left: calc($halfW * -1);
      transform: translateY(calc($halfH * -1)) rotateX(90deg);
      transform-origin: center top;
    }
    &--bottom {
      width: $baseW; height: 70px;
      margin-left: calc($halfW * -1);
      transform: translateY($halfH) rotateX(-90deg);
      transform-origin: center bottom;
    }
  }
  &__beam-img { width: 100%; height: 100%; object-fit: cover; }
  &__beam-tint { position: absolute; inset: 0; background: rgba(20,10,40,.35); }

  &__glow {
    position: absolute; width: $baseW; height: $baseH;
    margin-left: calc($halfW * -1); margin-top: calc($halfH * -1);
    border: 2px solid rgba(120,100,240,.2);
    box-shadow: 0 0 30px rgba(120,100,240,.1), inset 0 0 30px rgba(120,100,240,.04);
    pointer-events: none;
  }
}

/* ═══════════ 墙壁巨幅图片面板 ═══════════ */
.tun-wall-panel {
  position: absolute;
  width: min(22vw, 200px);
  height: $baseH;
  transform-style: preserve-3d;
  backface-visibility: visible;
  will-change: transform, opacity;
  overflow: hidden;
  border-radius: 4px;
  box-shadow: 0 0 30px rgba(0,0,0,.3), 0 0 0 1px rgba(255,255,255,.08);

  &__img { width: 100%; height: 100%; object-fit: cover; display: block; }
  &__label {
    position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); z-index: 2;
    font-size: .6rem; font-weight: 700; letter-spacing: .16em;
    color: #fff; background: rgba(0,0,0,.35); backdrop-filter: blur(4px);
    border-radius: 999px; padding: .15rem .7rem;
    text-shadow: 0 1px 4px rgba(0,0,0,.5);
  }
  &__vignette {
    position: absolute; inset: 0;
    background: linear-gradient(180deg, rgba(0,0,0,.1) 0%, transparent 40%, transparent 60%, rgba(0,0,0,.2) 100%);
    pointer-events: none;
  }

  // 左墙面板
  &--left {
    margin-top: calc($halfH * -1);
    margin-left: calc($halfW * -1 - min(22vw, 200px) - 20px);
    transform-origin: right center;
  }
  // 右墙面板
  &--right {
    margin-top: calc($halfH * -1);
    margin-left: calc($halfW + 20px);
    transform-origin: left center;
  }
}

/* ═══════════ 终点影像 ═══════════ */
.tun-destination {
  position: absolute;
  width: min(40vw, 340px);
  height: min(28vw, 240px);
  margin-left: calc(min(40vw, 340px) / -2);
  margin-top: calc(min(28vw, 240px) / -2);
  transform-style: preserve-3d;
  backface-visibility: visible;
  will-change: transform, opacity, filter;
  border-radius: 10px; overflow: hidden;
  box-shadow: 0 0 60px rgba(160,120,240,.3), 0 0 120px rgba(80,160,240,.15), 0 0 0 2px rgba(255,255,255,.12);

  &__img { width: 100%; height: 100%; object-fit: cover; display: block; }
  &__glow {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(20,10,50,.4) 70%, rgba(10,5,30,.7) 100%);
    pointer-events: none;
  }
  &__label {
    position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%); z-index: 3;
    font-size: .7rem; font-weight: 800; letter-spacing: .2em;
    color: #fff; background: rgba(160,100,240,.4); backdrop-filter: blur(6px);
    border-radius: 999px; padding: .2rem 1rem;
    text-shadow: 0 0 8px rgba(200,160,255,.6);
    border: 1px solid rgba(255,255,255,.2);
  }
}

/* 位置指示 */
.tun-locator { position: absolute; bottom: 10vh; left: 50%; transform: translateX(-50%); z-index: 25; display: flex; align-items: center; gap: .4rem; pointer-events: none; }
.tun-locator__dot { width: 6px; height: 6px; border-radius: 50%; background: #a080e0; box-shadow: 0 0 14px rgba(160,120,240,.7); animation: tun-dot-pulse 2s ease-in-out infinite; }
@keyframes tun-dot-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(2.5); opacity: .4; } }
.tun-locator__text { font-size: .62rem; font-weight: 600; color: rgba(160,140,210,.6); letter-spacing: .1em; }

.tun-progress { position: absolute; left: 0; bottom: 0; z-index: 30; width: 100%; height: 3px; background: rgba(140,100,240,.05); }
.tun-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #a080e0, #60b0f0, #50d8c0, #a080e0); background-size: 200% 100%; box-shadow: 0 0 12px rgba(120,100,240,.5); }

@media (max-width: 768px) {
  .tun-header { top: 2vh; } .tun-kicker { font-size: .44rem; padding: .12rem .45rem; } .tun-title__c { font-size: 1.4rem; }
  .tun-wall-panel { width: 16vw; &--left { margin-left: calc($halfW * -1 - 16vw - 10px); } &--right { margin-left: calc($halfW + 10px); } }
  .tun-destination { width: 50vw; height: 35vw; margin-left: -25vw; margin-top: -17.5vw; }
}
</style>
