<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void

const imageUrl = 'https://images.unsplash.com/photo-1534996858221-380b92700493?w=1920&q=80'

const parentRef = ref<HTMLElement | null>(null)
const mainImageRef = ref<HTMLElement | null>(null)
const prismStageRef = ref<HTMLElement | null>(null)
const layerRedRef = ref<HTMLElement | null>(null)
const layerGreenRef = ref<HTMLElement | null>(null)
const layerBlueRef = ref<HTMLElement | null>(null)
const prismBodyRef = ref<HTMLElement | null>(null)
const beamInRef = ref<HTMLElement | null>(null)
const beamOutRef = ref<HTMLElement | null>(null)
const rainbowRef = ref<HTMLElement | null>(null)
const convergenceRef = ref<HTMLElement | null>(null)
const infoRef = ref<HTMLElement | null>(null)

const rayRefs: HTMLElement[] = []
const flareRefs: HTMLElement[] = []

const cleanupFns: TweenCleanup[] = []

function setRayRef(el: unknown, i: number) {
  if (el) {
    rayRefs[i] = el as HTMLElement
  }
}

function setFlareRef(el: unknown, i: number) {
  if (el) {
    flareRefs[i] = el as HTMLElement
  }
}

onMounted(() => {
  const parent = parentRef.value
  if (!parent) {
    return
  }

  // ===== 初始状态 =====
  gsap.set(mainImageRef.value, { opacity: 1, scale: 1 })
  gsap.set(prismStageRef.value, { opacity: 0 })
  gsap.set([layerRedRef.value, layerGreenRef.value, layerBlueRef.value], {
    x: 0,
    y: 0,
    rotation: 0,
    opacity: 1,
    scale: 1,
  })
  gsap.set(prismBodyRef.value, { opacity: 0, scale: 0.5, rotation: -30 })
  gsap.set(beamInRef.value, { scaleX: 0, opacity: 0 })
  gsap.set(beamOutRef.value, { opacity: 0 })
  rayRefs.filter(Boolean).forEach((r) => {
    gsap.set(r, { scaleX: 0, opacity: 0 })
  })
  gsap.set(rainbowRef.value, { opacity: 0, scaleY: 0 })
  gsap.set(convergenceRef.value, { opacity: 0, scale: 0 })
  gsap.set(infoRef.value, { opacity: 0, y: 40 })
  flareRefs.filter(Boolean).forEach((f) => {
    gsap.set(f, {
      opacity: 0,
      scale: 0,
      x: (Math.random() - 0.5) * 400,
      y: (Math.random() - 0.5) * 300,
    })
  })

  // 用边缘都隐藏
  const edges = parent.querySelectorAll('.hp-layer-edge')
  gsap.set(edges, { opacity: 0 })

  // ===== 阶段1: 完整图展示 + 棱镜入场 (0-15%) =====
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: parent,
      start: 'top 90%',
      end: 'bottom -80%',
      scrub: 1.8,
      toggleActions: 'play reverse play reverse',
    },
  })

  // 棱镜旋转入场
  tl.to(
    prismBodyRef.value,
    { opacity: 1, scale: 1, rotation: 0, duration: 0.12, ease: 'back.out(1.5)' },
    0.03,
  )

  // 入射光束
  tl.to(
    beamInRef.value,
    { scaleX: 1, opacity: 0.9, duration: 0.1, ease: 'power2.out' },
    0.08,
  )

  // ===== 阶段2: 折射分裂 (15-45%) =====
  // 原图淡出，折射层显现
  tl.to(mainImageRef.value, { opacity: 0, duration: 0.08 }, 0.15)
  tl.to(prismStageRef.value, { opacity: 1, duration: 0.08 }, 0.15)

  // 三层RGB分离 — 不同方向偏移
  tl.to(
    layerRedRef.value,
    { x: -90, y: -40, rotation: -3, duration: 0.22, ease: 'power2.out' },
    0.18,
  )
  tl.to(
    layerGreenRef.value,
    { x: 0, y: 50, rotation: 1.5, duration: 0.22, ease: 'power2.out' },
    0.2,
  )
  tl.to(
    layerBlueRef.value,
    { x: 90, y: -20, rotation: 3, duration: 0.22, ease: 'power2.out' },
    0.22,
  )

  // 边缘发光
  tl.to(edges, { opacity: 1, duration: 0.1 }, 0.25)

  // 折射光束扇形展开
  tl.to(beamOutRef.value, { opacity: 1, duration: 0.06 }, 0.2)
  rayRefs.filter(Boolean).forEach((r, i) => {
    tl.to(
      r,
      { scaleX: 1, opacity: 0.7, duration: 0.12, ease: 'power2.out' },
      0.22 + i * 0.015,
    )
  })

  // 彩虹光带
  tl.to(
    rainbowRef.value,
    { opacity: 0.6, scaleY: 1, duration: 0.15, ease: 'power2.out' },
    0.28,
  )

  // ===== 阶段3: 最大分离 + 光斑飞舞 (45-65%) =====
  // 三层继续微漂移
  tl.to(layerRedRef.value, { x: -110, y: -50, duration: 0.2, ease: 'sine.inOut' }, 0.45)
  tl.to(layerGreenRef.value, { x: 5, y: 65, duration: 0.2, ease: 'sine.inOut' }, 0.45)
  tl.to(layerBlueRef.value, { x: 110, y: -30, duration: 0.2, ease: 'sine.inOut' }, 0.45)

  // 光斑粒子
  flareRefs.filter(Boolean).forEach((f, i) => {
    tl.to(
      f,
      { opacity: 0.5 + Math.random() * 0.4, scale: 1, duration: 0.1 },
      0.45 + i * 0.008,
    )
    tl.to(
      f,
      { opacity: 0, scale: 0.5, y: '+=30', duration: 0.15 },
      0.6 + i * 0.005,
    )
  })

  // 棱镜微旋
  tl.to(
    prismBodyRef.value,
    { rotation: 8, duration: 0.2, ease: 'sine.inOut' },
    0.45,
  )

  // ===== 阶段4: 收束归位 (65-85%) =====
  // 折射光束消退
  rayRefs.filter(Boolean).forEach((r, i) => {
    tl.to(
      r,
      { scaleX: 0, opacity: 0, duration: 0.1 },
      0.65 + i * 0.01,
    )
  })

  tl.to(rainbowRef.value, { opacity: 0, scaleY: 0, duration: 0.1 }, 0.68)
  tl.to(beamOutRef.value, { opacity: 0, duration: 0.06 }, 0.72)

  // 三层回归
  tl.to(
    layerRedRef.value,
    { x: 0, y: 0, rotation: 0, duration: 0.18, ease: 'back.out(1.2)' },
    0.7,
  )
  tl.to(
    layerGreenRef.value,
    { x: 0, y: 0, rotation: 0, duration: 0.18, ease: 'back.out(1.2)' },
    0.72,
  )
  tl.to(
    layerBlueRef.value,
    { x: 0, y: 0, rotation: 0, duration: 0.18, ease: 'back.out(1.2)' },
    0.74,
  )

  // 边缘消退
  tl.to(edges, { opacity: 0, duration: 0.08 }, 0.78)

  // 重合闪光
  tl.to(
    convergenceRef.value,
    { opacity: 1, scale: 2, duration: 0.06, ease: 'power3.out' },
    0.82,
  )
  tl.to(
    convergenceRef.value,
    { opacity: 0, scale: 4, duration: 0.1, ease: 'power2.out' },
    0.84,
  )

  // ===== 阶段5: 还原 + 信息 (85-100%) =====
  // 原图回归
  tl.to(prismStageRef.value, { opacity: 0, duration: 0.06 }, 0.84)
  tl.to(mainImageRef.value, { opacity: 1, duration: 0.08 }, 0.85)

  // 入射光束消退
  tl.to(beamInRef.value, { scaleX: 0, opacity: 0, duration: 0.08 }, 0.85)

  // 棱镜退场
  tl.to(
    prismBodyRef.value,
    { opacity: 0, scale: 0.5, rotation: 30, duration: 0.1, ease: 'power2.in' },
    0.86,
  )

  // 信息入场
  tl.to(
    infoRef.value,
    { opacity: 1, y: 0, duration: 0.12, ease: 'power2.out' },
    0.88,
  )

  cleanupFns.push(() => {
    tl.scrollTrigger?.kill()
    tl.kill()
  })
})

onUnmounted(() => {
  cleanupFns.forEach((fn) => fn())
})
</script>

<template>
  <section ref="parentRef" class="hp-container">
    <!-- 背景 -->
    <div class="hp-bg">
      <div class="hp-grid"></div>
    </div>

    <!-- 主图层 -->
    <div ref="mainImageRef" class="hp-main-image">
      <img :src="imageUrl" alt="" class="hp-img" />
    </div>

    <!-- 折射层容器 -->
    <div ref="prismStageRef" class="hp-prism-stage">
      <div ref="layerRedRef" class="hp-refract-layer hp-layer-red">
        <img :src="imageUrl" alt="" class="hp-img" />
        <div class="hp-color-tint tint-red"></div>
        <div class="hp-layer-edge edge-red"></div>
      </div>
      <div ref="layerGreenRef" class="hp-refract-layer hp-layer-green">
        <img :src="imageUrl" alt="" class="hp-img" />
        <div class="hp-color-tint tint-green"></div>
        <div class="hp-layer-edge edge-green"></div>
      </div>
      <div ref="layerBlueRef" class="hp-refract-layer hp-layer-blue">
        <img :src="imageUrl" alt="" class="hp-img" />
        <div class="hp-color-tint tint-blue"></div>
        <div class="hp-layer-edge edge-blue"></div>
      </div>
    </div>

    <!-- 棱镜体 -->
    <div ref="prismBodyRef" class="hp-prism-body">
      <div class="prism-face prism-left"></div>
      <div class="prism-face prism-right"></div>
      <div class="prism-face prism-bottom"></div>
      <div class="prism-highlight"></div>
    </div>

    <!-- 入射光束 -->
    <div ref="beamInRef" class="hp-beam hp-beam-in"></div>

    <!-- 折射光束 -->
    <div ref="beamOutRef" class="hp-beam-out">
      <div
        v-for="i in 7"
        :key="`ray-${i}`"
        :ref="(el) => setRayRef(el, i - 1)"
        class="hp-ray"
        :style="{ '--ray-index': i }"
      ></div>
    </div>

    <!-- 彩虹光带 -->
    <div ref="rainbowRef" class="hp-rainbow-band"></div>

    <!-- 光斑粒子 -->
    <div class="hp-flares">
      <div
        v-for="i in 12"
        :key="`flare-${i}`"
        :ref="(el) => setFlareRef(el, i - 1)"
        class="hp-flare"
      ></div>
    </div>

    <!-- 重合闪光 -->
    <div ref="convergenceRef" class="hp-convergence"></div>

    <!-- 信息层 -->
    <div ref="infoRef" class="hp-info">
      <span class="hp-label">HOLO PRISM</span>
      <h3 class="hp-title">全息棱镜</h3>
      <p class="hp-desc">白光穿越三棱镜，折射出无限光谱</p>
    </div>
  </section>
</template>

<style scoped>
.hp-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #06060e;
}

.hp-bg {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.hp-grid {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(rgba(120, 140, 255, 0.015) 1px, transparent 1px),
    linear-gradient(90deg, rgba(120, 140, 255, 0.015) 1px, transparent 1px);
  background-size: 60px 60px;
}

/* ===== 主图 ===== */
.hp-main-image {
  position: absolute;
  inset: 8%;
  z-index: 5;
  border-radius: 12px;
  overflow: hidden;
}

.hp-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* ===== 折射层舞台 ===== */
.hp-prism-stage {
  position: absolute;
  inset: 8%;
  z-index: 6;
}

/* ===== 折射层 ===== */
.hp-refract-layer {
  position: absolute;
  inset: 0;
  border-radius: 12px;
  overflow: hidden;
  will-change: transform, opacity;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.3);
}

.hp-color-tint {
  position: absolute;
  inset: 0;
  mix-blend-mode: multiply;
  pointer-events: none;
}

.tint-red {
  background: rgba(255, 60, 60, 0.2);
}

.tint-green {
  background: rgba(60, 255, 100, 0.15);
}

.tint-blue {
  background: rgba(60, 100, 255, 0.2);
}

/* 层边缘发光 */
.hp-layer-edge {
  position: absolute;
  inset: -1px;
  border-radius: 13px;
  pointer-events: none;
  will-change: opacity;
}

.edge-red {
  border: 1.5px solid rgba(255, 80, 80, 0.6);
  box-shadow:
    0 0 12px rgba(255, 60, 60, 0.3),
    inset 0 0 8px rgba(255, 60, 60, 0.15);
}

.edge-green {
  border: 1.5px solid rgba(80, 255, 120, 0.5);
  box-shadow:
    0 0 12px rgba(60, 255, 100, 0.25),
    inset 0 0 8px rgba(60, 255, 100, 0.12);
}

.edge-blue {
  border: 1.5px solid rgba(80, 120, 255, 0.6);
  box-shadow:
    0 0 12px rgba(60, 100, 255, 0.3),
    inset 0 0 8px rgba(60, 100, 255, 0.15);
}

/* ===== 棱镜体 ===== */
.hp-prism-body {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  z-index: 20;
  will-change: transform, opacity;
  pointer-events: none;
}

.prism-face {
  position: absolute;
  border-style: solid;
}

/* 用 CSS border trick 画三角形棱镜 */
.prism-left {
  left: 0;
  top: 0;
  width: 0;
  height: 0;
  border-left: 40px solid rgba(200, 220, 255, 0.12);
  border-top: 40px solid transparent;
  border-bottom: 40px solid transparent;
}

.prism-right {
  right: 0;
  top: 0;
  width: 0;
  height: 0;
  border-right: 40px solid rgba(180, 200, 255, 0.08);
  border-top: 40px solid transparent;
  border-bottom: 40px solid transparent;
}

.prism-bottom {
  left: 0;
  bottom: -8px;
  width: 80px;
  height: 0;
  border-bottom: 16px solid rgba(160, 180, 255, 0.06);
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
}

.prism-highlight {
  position: absolute;
  top: 30%;
  left: 25%;
  width: 30%;
  height: 20%;
  background: radial-gradient(
    ellipse,
    rgba(255, 255, 255, 0.4),
    transparent 70%
  );
  border-radius: 50%;
}

/* ===== 入射光束 ===== */
.hp-beam {
  position: absolute;
  z-index: 15;
  pointer-events: none;
  will-change: transform, opacity;
}

.hp-beam-in {
  left: 0;
  top: 50%;
  width: 50%;
  height: 3px;
  transform-origin: left center;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.15) 20%,
    rgba(255, 255, 240, 0.5) 80%,
    rgba(255, 255, 255, 0.9)
  );
  box-shadow: 0 0 12px 3px rgba(255, 255, 200, 0.15);
}

/* ===== 折射光束扇形 ===== */
.hp-beam-out {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 14;
  pointer-events: none;
}

.hp-ray {
  position: absolute;
  left: 0;
  top: 0;
  width: 45vw;
  height: 2px;
  transform-origin: left center;
  transform: rotate(calc((var(--ray-index) - 4) * 5deg));
  will-change: transform, opacity;
  box-shadow: 0 0 6px 1px currentColor;
}

/* 7色光线 */
.hp-ray:nth-child(1) {
  background: linear-gradient(90deg, rgba(255, 0, 0, 0.7), transparent 80%);
  color: rgba(255, 0, 0, 0.2);
}

.hp-ray:nth-child(2) {
  background: linear-gradient(90deg, rgba(255, 127, 0, 0.6), transparent 80%);
  color: rgba(255, 127, 0, 0.15);
}

.hp-ray:nth-child(3) {
  background: linear-gradient(90deg, rgba(255, 255, 0, 0.5), transparent 80%);
  color: rgba(255, 255, 0, 0.12);
}

.hp-ray:nth-child(4) {
  background: linear-gradient(90deg, rgba(0, 255, 0, 0.5), transparent 80%);
  color: rgba(0, 255, 0, 0.12);
}

.hp-ray:nth-child(5) {
  background: linear-gradient(90deg, rgba(0, 150, 255, 0.55), transparent 80%);
  color: rgba(0, 150, 255, 0.15);
}

.hp-ray:nth-child(6) {
  background: linear-gradient(90deg, rgba(75, 0, 130, 0.5), transparent 80%);
  color: rgba(75, 0, 130, 0.12);
}

.hp-ray:nth-child(7) {
  background: linear-gradient(90deg, rgba(148, 0, 211, 0.5), transparent 80%);
  color: rgba(148, 0, 211, 0.12);
}

/* ===== 彩虹光带 ===== */
.hp-rainbow-band {
  position: absolute;
  right: 5%;
  top: 20%;
  width: 8px;
  height: 60%;
  z-index: 12;
  border-radius: 4px;
  background: linear-gradient(
    180deg,
    #ff0000,
    #ff7f00,
    #ffff00,
    #00ff00,
    #0096ff,
    #4b0082,
    #9400d3
  );
  filter: blur(2px);
  transform-origin: center center;
  pointer-events: none;
  will-change: transform, opacity;
}

/* ===== 光斑 ===== */
.hp-flares {
  position: absolute;
  inset: 0;
  z-index: 18;
  pointer-events: none;
}

.hp-flare {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  will-change: transform, opacity;
}

.hp-flare:nth-child(odd) {
  background: rgba(255, 200, 100, 0.8);
  box-shadow: 0 0 8px rgba(255, 200, 100, 0.5);
}

.hp-flare:nth-child(even) {
  background: rgba(100, 200, 255, 0.8);
  box-shadow: 0 0 8px rgba(100, 200, 255, 0.5);
}

.hp-flare:nth-child(3n) {
  background: rgba(255, 100, 200, 0.8);
  box-shadow: 0 0 8px rgba(255, 100, 200, 0.5);
  width: 4px;
  height: 4px;
}

/* ===== 重合闪光 ===== */
.hp-convergence {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(200, 220, 255, 0.6) 30%,
    rgba(150, 180, 255, 0.2) 60%,
    transparent 80%
  );
  z-index: 22;
  pointer-events: none;
  will-change: transform, opacity;
}

/* ===== 信息层 ===== */
.hp-info {
  position: absolute;
  bottom: 5%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 25;
  will-change: opacity, transform;
}

.hp-label {
  display: block;
  font-size: 10px;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: rgba(180, 200, 255, 0.5);
  margin-bottom: 8px;
}

.hp-title {
  font-size: clamp(24px, 4vw, 42px);
  font-weight: 900;
  color: #fff;
  margin: 0 0 6px;
  text-shadow: 0 0 25px rgba(120, 160, 255, 0.3);
}

.hp-desc {
  font-size: clamp(12px, 1.8vw, 15px);
  color: rgba(255, 255, 255, 0.45);
  margin: 0;
}

@media (max-width: 768px) {
  .hp-main-image,
  .hp-prism-stage {
    inset: 3%;
  }

  .hp-prism-body {
    width: 50px;
    height: 50px;
  }

  .hp-rainbow-band {
    width: 5px;
  }
}
</style>


