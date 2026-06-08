<template>
  <section ref="rootRef" class="co-root">
    <!-- 星空背景层 -->
    <div class="co-bg">
      <div class="co-nebula nebula-1"></div>
      <div class="co-nebula nebula-2"></div>
      <div class="co-nebula nebula-3"></div>
      <div class="co-stars"></div>
      <div class="co-stars co-stars--mid"></div>
      <div class="co-stars co-stars--near"></div>
      <div class="co-galactic-plane"></div>
    </div>

    <!-- 3D轨道场景 -->
    <div class="co-scene" ref="sceneRef">
      <!-- 轨道环容器 - 3层同心轨道 -->
      <div
        v-for="(ring, ringIdx) in rings"
        :key="'ring-' + ringIdx"
        class="co-ring"
        :ref="(el) => setRingRef(el, ringIdx)"
        :style="{ transform: ringContainerStyle(ringIdx) }"
      >
        <!-- 轨道环可视化线 -->
        <div class="co-ring-line" :style="{ width: ring.radius * 2 + 'px', height: ring.radius * 2 + 'px' }"></div>

        <!-- 每张漂浮的照片 -->
        <div
          v-for="(img, imgIdx) in ring.images"
          :key="img.id"
          class="co-card-slot"
          :ref="(el) => setSlotRef(el, ringIdx, imgIdx)"
          :style="slotTransform(img, ring.radius)"
        >
          <div class="co-card" :ref="(el) => setCardRef(el, ringIdx, imgIdx)">
            <!-- 光晕 -->
            <div class="co-card__glow" :style="{ '--glow-color': img.glowColor }"></div>
            <!-- 主照片 -->
            <div class="co-card__inner">
              <img
                :ref="(el) => setImgRef(el, ringIdx, imgIdx)"
                :src="img.image"
                :alt="img.alt"
                class="co-card__img"
                loading="eager"
              />
              <div class="co-card__border"></div>
            </div>
            <!-- 底部光柱 -->
            <div class="co-card__light-pillar" :style="{ '--glow-color': img.glowColor }"></div>
          </div>
        </div>
      </div>

      <!-- 中央光核 -->
      <div class="co-core" ref="coreRef">
        <div class="co-core__orb"></div>
        <div class="co-core__rays"></div>
      </div>

      <!-- 粒子场 -->
      <div class="co-particles" ref="particlesRef"></div>
    </div>

    <!-- 暗角 + 前景雾 -->
    <div class="co-vignette"></div>
    <div class="co-fog"></div>

    <!-- UI层 -->
    <div ref="scrollRef" class="co-scroll">
      <div ref="trackRef" class="co-track" :style="{ height: trackHeight }">
        <div class="co-sticky">
          <header ref="headerRef" class="co-header">
            <span class="co-kicker">🌌 Constellation Orbit · 星座轨道</span>
            <h1 class="co-title">
              <span ref="tConstellation" class="co-title__w">星座</span>
              <span ref="tOrbit" class="co-title__w co-title__w--alt">轨道</span>
            </h1>
            <div ref="headerLineRef" class="co-line"></div>
            <p class="co-sub">向下滚动 · 三层轨道以不同速度旋转 · 照片在星空深处绽放</p>
          </header>

          <div ref="infoRef" class="co-info">
            <span class="co-info__ring">轨道 {{ currentRing + 1 }}</span>
            <span class="co-info__no">{{ String(currentImgInRing + 1).padStart(2, '0') }}</span>
            <h3>{{ currentImage?.title }}</h3>
            <span class="co-info__depth">{{ ['近景轨道','中景轨道','远景轨道'][currentRing] }}</span>
          </div>

          <div class="co-progress">
            <div ref="progressRef" class="co-progress__fill"></div>
          </div>
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
type TweenCleanup = () => void

// ── 图片配置 ──
interface ImageConfig {
  id: string; title: string; image: string; alt: string
  angle: number      // 基础角度（度）
  yOffset: number    // 垂直偏移（px）
  glowColor: string  // 光晕颜色
}

interface RingConfig {
  radius: number     // 轨道半径（px）
  images: ImageConfig[]
  baseScale: number  // 基础缩放
  rotationSpeed: number // 旋转速度倍率
}

// 3层轨道配置
const rings: RingConfig[] = [
  {
    radius: 380,
    baseScale: 0.9,
    rotationSpeed: 1.0, // 最快旋转
    images: [
      { id:'aurora', title:'极光', image:'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&q=80', alt:'极光', angle:0, yOffset:-60, glowColor:'rgba(100,220,180,0.5)' },
      { id:'ocean', title:'海浪', image:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80', alt:'海浪', angle:90, yOffset:40, glowColor:'rgba(60,160,220,0.5)' },
      { id:'mountains', title:'远山', image:'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80', alt:'远山', angle:180, yOffset:-30, glowColor:'rgba(200,180,140,0.45)' },
      { id:'flowers', title:'繁花', image:'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&q=80', alt:'繁花', angle:270, yOffset:50, glowColor:'rgba(240,140,180,0.5)' },
    ]
  },
  {
    radius: 620,
    baseScale: 0.65,
    rotationSpeed: 0.55, // 中速旋转
    images: [
      { id:'desert', title:'沙漠', image:'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=600&q=80', alt:'沙漠', angle:45, yOffset:-90, glowColor:'rgba(240,180,100,0.4)' },
      { id:'forest', title:'森林', image:'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80', alt:'森林', angle:135, yOffset:70, glowColor:'rgba(80,200,100,0.4)' },
      { id:'valley', title:'峡谷', image:'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80', alt:'峡谷', angle:225, yOffset:-50, glowColor:'rgba(180,150,100,0.35)' },
      { id:'sunrise', title:'日出', image:'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80', alt:'日出', angle:315, yOffset:80, glowColor:'rgba(240,160,80,0.4)' },
    ]
  },
  {
    radius: 880,
    baseScale: 0.45,
    rotationSpeed: 0.28, // 最慢旋转
    images: [
      { id:'stars', title:'星河', image:'https://images.unsplash.com/photo-1502481851512-e9e2529bfbf9?w=600&q=80', alt:'星河', angle:22.5, yOffset:-110, glowColor:'rgba(140,120,220,0.3)' },
      { id:'galaxy', title:'星系', image:'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&q=80', alt:'星系', angle:112.5, yOffset:95, glowColor:'rgba(180,100,200,0.3)' },
      { id:'nebula', title:'星云', image:'https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=600&q=80', alt:'星云', angle:202.5, yOffset:-70, glowColor:'rgba(100,180,220,0.3)' },
      { id:'comet', title:'彗星', image:'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&q=80', alt:'彗星', angle:292.5, yOffset:100, glowColor:'rgba(200,200,240,0.3)' },
    ]
  }
]

const totalImages = rings.reduce((sum, r) => sum + r.images.length, 0)
const trackHeight = `${(totalImages + 2) * 110}vh`

// ── Refs ──
const rootRef = ref<HTMLElement|null>(null)
const scrollRef = ref<HTMLElement|null>(null)
const trackRef = ref<HTMLElement|null>(null)
const sceneRef = ref<HTMLElement|null>(null)
const coreRef = ref<HTMLElement|null>(null)
const particlesRef = ref<HTMLElement|null>(null)
const headerRef = ref<HTMLElement|null>(null)
const headerLineRef = ref<HTMLElement|null>(null)
const tConstellation = ref<HTMLElement|null>(null)
const tOrbit = ref<HTMLElement|null>(null)
const infoRef = ref<HTMLElement|null>(null)
const progressRef = ref<HTMLElement|null>(null)

const ringRefs = ref<HTMLElement[]>([])
const setRingRef = (el: Element|null, i: number) => { if (el instanceof HTMLElement) ringRefs.value[i] = el }

// 2D ref 数组: [ringIdx][imgIdx]
const slotRefs = ref<HTMLElement[][]>([])
const setSlotRef = (el: Element|null, ri: number, ii: number) => {
  if (!slotRefs.value[ri]) slotRefs.value[ri] = []
  if (el instanceof HTMLElement) slotRefs.value[ri][ii] = el
}

const cardRefs = ref<HTMLElement[][]>([])
const setCardRef = (el: Element|null, ri: number, ii: number) => {
  if (!cardRefs.value[ri]) cardRefs.value[ri] = []
  if (el instanceof HTMLElement) cardRefs.value[ri][ii] = el
}

const imgRefs = ref<HTMLImageElement[][]>([])
const setImgRef = (el: Element|null, ri: number, ii: number) => {
  if (!imgRefs.value[ri]) imgRefs.value[ri] = []
  if (el instanceof HTMLImageElement) imgRefs.value[ri][ii] = el
}

const currentRing = ref(0)
const currentImgInRing = ref(0)
const currentImage = ref<ImageConfig|null>(null)
const cleanupFns: TweenCleanup[] = []

// ── 计算属性 ──
/**
 * 为每张图片计算CSS transform: rotateY(θ) → translateZ(r) → rotateY(-θ) → translateY
 * 这是标准的CSS 3D环形布局：将元素放在圆心、旋转到指定角度、推出去、再转回来面对观众
 */
function slotTransform(img: ImageConfig, radius: number): Record<string, string> {
  const rad = radius + 'px'
  return {
    transform: `rotateY(${img.angle}deg) translateZ(${rad}) rotateY(${-img.angle}deg) translateY(${img.yOffset}px)`,
    width: rad, // 占位（实际由 .co-card-slot 样式控制）
  }
}

function ringContainerStyle(ringIdx: number): Record<string, string> {
  return {}
}

// ── 预加载 ──
function preload(): Promise<void[]> {
  const allImages = rings.flatMap(r => r.images)
  return Promise.all(allImages.map(f =>
    new Promise<void>(r => { const i = new Image(); i.onload = () => r(); i.onerror = () => r(); i.src = f.image })
  ))
}

// ── 入场动画 ──
function setupEntrance() {
  if (!scrollRef.value || !headerRef.value || !infoRef.value || !sceneRef.value || !coreRef.value) return
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: scrollRef.value, scroller: scrollRef.value,
      start: 'top 75%', toggleActions: 'play none none reverse'
    }
  })
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 48 }, { autoAlpha: 1, y: 0, duration: .8, ease: 'power3.out' })
    .fromTo(tConstellation.value!, { autoAlpha: 0, x: -40, scale: .5 }, { autoAlpha: 1, x: 0, scale: 1, duration: .6, ease: 'back.out(2)' }, '-=.35')
    .fromTo(tOrbit.value!, { autoAlpha: 0, x: 40, scale: .5 }, { autoAlpha: 1, x: 0, scale: 1, duration: .6, ease: 'back.out(2)' }, '-=.4')
    .fromTo(headerLineRef.value!, { scaleX: 0 }, { scaleX: 1, duration: .5, ease: 'power3.inOut' }, '-=.2')
    .fromTo(sceneRef.value!, { autoAlpha: 0 }, { autoAlpha: 1, duration: .8, ease: 'power2.out' }, '-=.3')
    .fromTo(coreRef.value, { autoAlpha: 0, scale: 0 }, { autoAlpha: 1, scale: 1, duration: 1, ease: 'elastic.out(1, 0.6)' }, '-=.5')
    .fromTo(infoRef.value!, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: .5, ease: 'power2.out' }, '-=.15')

  // 卡片交错入场
  rings.forEach((ring, ri) => {
    ring.images.forEach((_, ii) => {
      const card = cardRefs.value[ri]?.[ii]
      if (card) {
        tl.fromTo(card,
          { autoAlpha: 0, scale: 0.3, rotateX: -30 },
          { autoAlpha: 1, scale: 1, rotateX: 0, duration: .7, ease: 'back.out(1.5)' },
          `-=${.4 + ri * .1}` // 不同轨道稍微错开
        )
      }
    })
  })

  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

// ── 核心：3层轨道差速旋转 ──
function setupOrbitAnimation() {
  if (!scrollRef.value || !trackRef.value) return
  const sc = scrollRef.value
  const track = trackRef.value

  // 每个轨道环的旋转角度范围
  const ringRotations = rings.map((ring) => ring.rotationSpeed * 360)

  const mtl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track, scroller: sc,
      start: 'top top', end: 'bottom bottom', scrub: 1.5,
      onUpdate(self) {
        const progress = self.progress
        // 计算当前聚焦的图片
        const totalIdx = Math.floor(progress * (totalImages - 1))
        let count = 0
        for (let ri = 0; ri < rings.length; ri++) {
          const ringImgCount = rings[ri].images.length
          if (totalIdx < count + ringImgCount) {
            currentRing.value = ri
            currentImgInRing.value = totalIdx - count
            currentImage.value = rings[ri].images[totalIdx - count]
            break
          }
          count += ringImgCount
        }
        if (totalIdx >= totalImages - 1) {
          const lastRing = rings.length - 1
          currentRing.value = lastRing
          currentImgInRing.value = rings[lastRing].images.length - 1
          currentImage.value = rings[lastRing].images[rings[lastRing].images.length - 1]
        }
      },
    },
  })

  // 每个轨道独立旋转
  rings.forEach((ring, ri) => {
    const ringEl = ringRefs.value[ri]
    if (!ringEl) return
    const rotation = ring.rotationSpeed * 360
    mtl.to(ringEl, { rotateY: rotation, duration: totalImages, ease: 'none' }, 0)
  })

  // 中央光核脉动
  if (coreRef.value) {
    mtl.to(coreRef.value, { scale: 1.15, duration: totalImages * 0.5, ease: 'sine.inOut' }, 0)
    mtl.to(coreRef.value, { scale: 0.9, duration: totalImages * 0.5, ease: 'sine.inOut' }, totalImages * 0.5)
  }

  // 场景微缩放（制造"呼吸感"）
  if (sceneRef.value) {
    mtl.to(sceneRef.value, { scale: 0.95, duration: totalImages * 0.5, ease: 'sine.inOut' }, 0)
    mtl.to(sceneRef.value, { scale: 1.0, duration: totalImages * 0.5, ease: 'sine.inOut' }, totalImages * 0.5)
  }

  // 进度条
  if (progressRef.value) {
    mtl.to(progressRef.value, { width: '100%', duration: totalImages }, 0)
  }

  cleanupFns.push(() => { mtl.scrollTrigger?.kill(); mtl.kill() })
}

// ── 粒子系统（CSS动画驱动的浮动光点） ──
function createParticles() {
  if (!particlesRef.value || !rootRef.value) return
  const container = particlesRef.value
  const count = 60

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div')
    particle.className = 'co-particle'
    const size = 1 + Math.random() * 3
    const x = Math.random() * 100
    const y = Math.random() * 100
    const duration = 8 + Math.random() * 16
    const delay = Math.random() * -20
    const opacity = 0.15 + Math.random() * 0.5

    particle.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${x}%; top: ${y}%;
      opacity: ${opacity};
      animation: coParticleFloat ${duration}s linear infinite;
      animation-delay: ${delay}s;
      background: radial-gradient(circle, rgba(180,200,255,0.8), transparent);
      box-shadow: 0 0 ${size * 2}px rgba(150,180,255,0.4);
    `
    container.appendChild(particle)
  }
}

function handleResize() { ScrollTrigger.refresh(true) }

onMounted(async () => {
  await preload()
  createParticles()
  // 设置初始状态
  if (currentImage.value === null && rings[0]?.images[0]) {
    currentImage.value = rings[0].images[0]
  }
  requestAnimationFrame(() => requestAnimationFrame(() => {
    setupEntrance()
    setupOrbitAnimation()
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
/* ── 根容器 ── */
.co-root {
  position: relative; width: 100vw; height: 100vh; overflow: hidden;
  background: #020510;
  font-family: 'Inter', 'PingFang SC', system-ui, sans-serif;
}

/* ══════════════════════════════════════════
   背景 - 深空星野
   ══════════════════════════════════════════ */
.co-bg { position: absolute; inset: 0; z-index: 0; }

/* 星云色块 */
.co-nebula {
  position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.12;
  pointer-events: none; will-change: opacity;
  animation: coNebulaPulse 12s ease-in-out infinite alternate;
}
.nebula-1 {
  width: 70vw; height: 70vw; top: -15%; left: -10%;
  background: radial-gradient(circle, #3a1c71, #1a0a3e 50%, transparent 70%);
}
.nebula-2 {
  width: 60vw; height: 60vw; bottom: -20%; right: -5%;
  background: radial-gradient(circle, #0c2b4f, #061220 50%, transparent 70%);
  animation-delay: -4s;
}
.nebula-3 {
  width: 50vw; height: 50vw; top: 40%; left: 30%;
  background: radial-gradient(circle, #1a1040, #0a0620 60%, transparent 75%);
  animation-delay: -8s; opacity: 0.08;
}

@keyframes coNebulaPulse {
  0% { opacity: 0.08; transform: scale(0.95); }
  100% { opacity: 0.15; transform: scale(1.08); }
}

/* 星星层（3层深度视差） */
.co-stars {
  position: absolute; inset: 0;
  background-image:
    radial-gradient(0.8px 0.8px at 10% 15%, rgba(255,255,255,0.6), transparent),
    radial-gradient(0.6px 0.6px at 25% 35%, rgba(255,255,255,0.5), transparent),
    radial-gradient(1px 1px at 40% 8%, rgba(220,230,255,0.7), transparent),
    radial-gradient(0.5px 0.5px at 55% 45%, rgba(255,255,255,0.4), transparent),
    radial-gradient(0.9px 0.9px at 70% 20%, rgba(200,210,255,0.6), transparent),
    radial-gradient(0.7px 0.7px at 85% 55%, rgba(255,255,255,0.5), transparent),
    radial-gradient(1.1px 1.1px at 15% 70%, rgba(210,220,255,0.7), transparent),
    radial-gradient(0.4px 0.4px at 60% 75%, rgba(255,255,255,0.35), transparent),
    radial-gradient(0.8px 0.8px at 90% 12%, rgba(230,240,255,0.55), transparent),
    radial-gradient(0.6px 0.6px at 35% 80%, rgba(255,255,255,0.45), transparent),
    radial-gradient(0.5px 0.5px at 78% 62%, rgba(200,220,255,0.5), transparent),
    radial-gradient(0.7px 0.7px at 5% 42%, rgba(255,255,255,0.4), transparent);
  pointer-events: none;
}
.co-stars--mid {
  background-image:
    radial-gradient(0.6px 0.6px at 12% 22%, rgba(200,200,255,0.4), transparent),
    radial-gradient(0.5px 0.5px at 32% 18%, rgba(220,220,255,0.35), transparent),
    radial-gradient(0.7px 0.7px at 52% 32%, rgba(180,200,240,0.4), transparent),
    radial-gradient(0.4px 0.4px at 72% 28%, rgba(200,210,240,0.3), transparent),
    radial-gradient(0.6px 0.6px at 8% 65%, rgba(190,200,250,0.35), transparent),
    radial-gradient(0.5px 0.5px at 45% 68%, rgba(210,220,250,0.3), transparent),
    radial-gradient(0.7px 0.7px at 88% 48%, rgba(180,200,240,0.4), transparent),
    radial-gradient(0.4px 0.4px at 22% 88%, rgba(200,210,240,0.3), transparent);
  opacity: 0.6;
}
.co-stars--near {
  background-image:
    radial-gradient(1.2px 1.2px at 18% 30%, rgba(240,240,255,0.8), transparent),
    radial-gradient(0.9px 0.9px at 48% 12%, rgba(230,240,255,0.7), transparent),
    radial-gradient(1.4px 1.4px at 68% 42%, rgba(220,230,255,0.8), transparent),
    radial-gradient(0.8px 0.8px at 82% 18%, rgba(240,240,255,0.65), transparent),
    radial-gradient(1px 1px at 28% 58%, rgba(210,220,250,0.7), transparent),
    radial-gradient(1.3px 1.3px at 58% 72%, rgba(230,240,255,0.75), transparent);
  opacity: 0.7;
}

/* 银河平面辉光 */
.co-galactic-plane {
  position: absolute; left: -10%; top: 38%; width: 120%; height: 24%;
  background: radial-gradient(ellipse 80% 50% at 50% 50%, rgba(60,80,160,0.06), transparent 70%);
  transform: rotate(-8deg); pointer-events: none;
}

/* ══════════════════════════════════════════
   3D场景
   ══════════════════════════════════════════ */
.co-scene {
  position: absolute; inset: 0; z-index: 2;
  perspective: 1200px;
  perspective-origin: 50% 42%;
  transform-style: preserve-3d;
  pointer-events: none;
  will-change: transform;
}

/* ── 中央光核 ── */
.co-core {
  position: absolute; top: 50%; left: 50%; width: 0; height: 0;
  transform-style: preserve-3d; z-index: 10; will-change: transform;
}
.co-core__orb {
  position: absolute; width: 30px; height: 30px;
  margin-left: -15px; margin-top: -15px;
  background: radial-gradient(circle, rgba(200,220,255,0.9) 0%, rgba(120,160,240,0.4) 40%, transparent 70%);
  border-radius: 50%;
  box-shadow:
    0 0 30px rgba(150,180,240,0.4),
    0 0 80px rgba(100,140,220,0.2),
    0 0 150px rgba(80,100,200,0.1);
  animation: coCorePulse 3s ease-in-out infinite alternate;
}
@keyframes coCorePulse {
  0% { box-shadow: 0 0 20px rgba(150,180,240,0.3), 0 0 60px rgba(100,140,220,0.15), 0 0 100px rgba(80,100,200,0.08); }
  100% { box-shadow: 0 0 45px rgba(150,180,240,0.6), 0 0 110px rgba(100,140,220,0.3), 0 0 200px rgba(80,100,200,0.15); }
}
.co-core__rays {
  position: absolute; width: 300px; height: 300px;
  margin-left: -150px; margin-top: -150px;
  background: conic-gradient(
    from 0deg,
    transparent 0deg, rgba(120,150,220,0.03) 15deg, transparent 30deg,
    transparent 60deg, rgba(100,140,210,0.02) 75deg, transparent 90deg,
    transparent 120deg, rgba(120,160,230,0.03) 135deg, transparent 150deg,
    transparent 180deg, rgba(110,150,220,0.02) 195deg, transparent 210deg,
    transparent 240deg, rgba(130,160,220,0.03) 255deg, transparent 270deg,
    transparent 300deg, rgba(100,140,210,0.02) 315deg, transparent 330deg,
    transparent 360deg
  );
  border-radius: 50%;
  animation: coRaysSpin 24s linear infinite;
}
@keyframes coRaysSpin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* ── 轨道环 ── */
.co-ring {
  position: absolute; top: 50%; left: 50%; width: 0; height: 0;
  transform-style: preserve-3d;
  will-change: transform;
}
/* 轨道线圆环 */
.co-ring-line {
  position: absolute;
  top: 50%; left: 50%;
  border: 1px solid rgba(140,170,220,0.08);
  border-radius: 50%;
  transform: translate(-50%, -50%) rotateX(75deg); // 接近平面椭圆
  pointer-events: none;
}

/* ── 照片插槽（环形布局关键） ── */
.co-card-slot {
  position: absolute; top: 50%; left: 50%;
  width: 0; height: 0;
  transform-style: preserve-3d;
}

/* ── 照片卡片 ── */
.co-card {
  position: absolute;
  width: clamp(140px, 20vw, 240px);
  height: clamp(233px, 33.3vw, 400px);
  margin-left: calc(clamp(140px, 20vw, 240px) / -2);
  margin-top: calc(clamp(233px, 33.3vw, 400px) / -2);
  transform-style: preserve-3d;
  will-change: transform, filter, opacity;
}

/* 光晕 */
.co-card__glow {
  position: absolute; inset: -15px; border-radius: 6px; z-index: -1;
  background: radial-gradient(ellipse 70% 60% at 50% 50%, var(--glow-color, rgba(100,160,220,0.3)), transparent 75%);
  filter: blur(12px); opacity: 0.6;
  transition: opacity 0.5s ease;
}

/* 照片主体 */
.co-card__inner {
  position: relative; width: 100%; height: 100%; border-radius: 3px;
  overflow: hidden;
  box-shadow:
    0 15px 40px rgba(0,0,0,0.45),
    0 0 0 3px rgba(255,255,255,0.15),
    0 0 0 5px rgba(0,0,0,0.2);
}
.co-card__img {
  width: 100%; height: 100%; object-fit: cover; display: block;
  will-change: transform;
}
.co-card__border {
  position: absolute; inset: 0; pointer-events: none;
  border: 1px solid rgba(255,255,255,0.1); border-radius: 3px;
}

/* 底部光柱（替代原版的镜面倒影）
   从卡片底部向下投射一道柔光，模拟星光洒落 */
.co-card__light-pillar {
  position: absolute; top: 100%; left: 15%; width: 70%;
  height: 60%; // 光柱长度
  background: linear-gradient(
    to bottom,
    var(--glow-color, rgba(100,160,220,0.25)) 0%,
    transparent 100%
  );
  transform: rotateX(40deg);
  transform-origin: top center;
  filter: blur(8px); opacity: 0.5;
  pointer-events: none; border-radius: 0 0 50% 50%;
}

/* ══════════════════════════════════════════
   粒子场
   ══════════════════════════════════════════ */
.co-particles {
  position: absolute; inset: 0; pointer-events: none;
}
.co-particle {
  position: absolute; border-radius: 50%; pointer-events: none;
  will-change: transform, opacity;
}
@keyframes coParticleFloat {
  0%   { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
  10%  { opacity: var(--peak-opacity, 0.5); }
  90%  { opacity: var(--peak-opacity, 0.5); }
  100% { transform: translateY(-100vh) translateX(20px) scale(0.3); opacity: 0; }
}

/* ══════════════════════════════════════════
   大气效果
   ══════════════════════════════════════════ */
.co-vignette {
  position: absolute; inset: 0; z-index: 4; pointer-events: none;
  background: radial-gradient(ellipse 55% 45% at 50% 42%, transparent 35%, rgba(3,5,15,0.6) 100%);
}
.co-fog {
  position: absolute; inset: 0; z-index: 3; pointer-events: none;
  background:
    radial-gradient(ellipse 40% 30% at 50% 55%, rgba(20,30,60,0.12), transparent 60%),
    radial-gradient(ellipse 30% 20% at 50% 35%, rgba(30,20,50,0.08), transparent 50%);
}

/* ══════════════════════════════════════════
   滚动容器 & UI
   ══════════════════════════════════════════ */
.co-scroll {
  position: relative; width: 100%; height: 100%;
  overflow-x: hidden; overflow-y: auto;
  overscroll-behavior-y: auto; z-index: 1;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(255,255,255,.06); }
}
.co-track { position: relative; width: 100%; }
.co-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

/* ── 标题 ── */
.co-header {
  position: absolute; top: 3.5vh; left: 50%; transform: translateX(-50%);
  z-index: 30; text-align: center; width: min(90vw, 640px);
}
.co-kicker {
  display: inline-block; font-size: .54rem; font-weight: 700; letter-spacing: .22em;
  text-transform: uppercase; color: rgba(160,190,230,.55);
  background: rgba(255,255,255,.03); backdrop-filter: blur(6px);
  border: 1px solid rgba(255,255,255,.06); border-radius: 999px;
  padding: .16rem .75rem; margin-bottom: .3rem;
}
.co-title { margin: 0; display: flex; justify-content: center; gap: .08em; }
.co-title__w {
  font-size: clamp(1.5rem, 3.8vw, 2.8rem); font-weight: 900;
  color: #c0d0e8; text-shadow: 0 0 15px rgba(120,150,210,.25);
  will-change: transform, opacity;
}
.co-title__w--alt {
  background: linear-gradient(180deg, #c8d8f8, #7090c0, #4868a0);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.co-line {
  width: 50px; height: 1.5px; margin: .2rem auto .25rem; border-radius: 2px;
  background: linear-gradient(90deg, transparent, #6080b0, #80a0d0, transparent);
  transform-origin: center;
}
.co-sub {
  margin: 0; font-size: clamp(.5rem, .7vw, .6rem);
  color: rgba(120,150,190,.3); line-height: 1.4; max-width: 300px; margin-inline: auto;
}

/* ── 信息面板 ── */
.co-info {
  position: absolute; bottom: 6vh; left: 50%; transform: translateX(-50%);
  z-index: 30; text-align: center; display: flex; flex-direction: column; align-items: center; gap: .1rem;
}
.co-info__ring {
  font-size: .55rem; font-weight: 600; letter-spacing: .18em;
  color: rgba(140,170,210,.4); text-transform: uppercase;
}
.co-info__no {
  font-size: .65rem; font-weight: 300; letter-spacing: .12em;
  color: rgba(180,200,225,.3); font-family: 'Georgia', serif;
}
.co-info h3 { margin: 0; font-size: clamp(.7rem, 1.3vw, .95rem); font-weight: 600; color: rgba(160,190,220,.55); letter-spacing: .05em; }
.co-info__depth { font-size: .5rem; color: rgba(120,140,180,.25); margin-top: .05rem; }

/* ── 进度条 ── */
.co-progress {
  position: absolute; left: 0; bottom: 0; z-index: 30;
  width: 100%; height: 1.5px; background: rgba(255,255,255,.015);
}
.co-progress__fill {
  width: 0; height: 100%;
  background: linear-gradient(90deg, #4068a0, #6888c0, #4068a0);
  background-size: 200% 100%;
}

/* ── 响应式 ── */
@media (max-width: 768px) {
  .co-card {
    width: 120px; height: 200px;
    margin-left: -60px; margin-top: -100px;
  }
  .co-title__w { font-size: 1.2rem; }
  .co-core__orb { width: 20px; height: 20px; margin-left: -10px; margin-top: -10px; }
  .co-ring-line { display: none; }
}
</style>
