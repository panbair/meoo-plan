<template>
  <section ref="parentRef" class="shatter-container">
    <!-- 主图片层 - 完整展示 -->
    <div ref="imageLayerRef" class="image-layer">
      <img :src="imageUrl" alt="主图" class="main-image" />
    </div>

    <!-- 碎片覆盖层 -->
    <div ref="shatterLayerRef" class="shatter-layer">
      <div
        v-for="(fragment, index) in fragments"
        :key="index"
        :ref="(el) => setFragmentRef(el, index)"
        class="fragment"
        :style="fragment.style"
      >
        <div class="fragment-image-wrapper" :style="fragment.wrapperStyle">
          <img :src="imageUrl" :style="fragment.imgStyle" alt="" />
        </div>
        <!-- 碎片边缘高光 -->
        <div class="fragment-edge"></div>
      </div>
    </div>

    <!-- 冲击波效果 -->
    <div ref="impactWaveRef" class="impact-wave"></div>

    <!-- 中心爆点 -->
    <div ref="impactCoreRef" class="impact-core"></div>

    <!-- 最终合成光效 -->
    <div ref="synthesisFlashRef" class="synthesis-flash"></div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void

// Refs
const parentRef = ref<HTMLElement | null>(null)
const imageLayerRef = ref<HTMLElement | null>(null)
const shatterLayerRef = ref<HTMLElement | null>(null)
const impactWaveRef = ref<HTMLElement | null>(null)
const impactCoreRef = ref<HTMLElement | null>(null)
const synthesisFlashRef = ref<HTMLElement | null>(null)

const fragmentRefs: HTMLElement[] = []
const cleanupFns: TweenCleanup[] = []

// 配置
const COLS = 5
const ROWS = 4
const TOTAL = COLS * ROWS
const CENTER_X = (COLS - 1) / 2
const CENTER_Y = (ROWS - 1) / 2
const MAX_LAYER = Math.ceil(Math.sqrt(CENTER_X * CENTER_X + CENTER_Y * CENTER_Y))

// 图片URL - 色彩丰富震撼的图像
const imageUrl = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80'

interface Fragment {
  style: Record<string, string>
  wrapperStyle: Record<string, string>
  imgStyle: Record<string, string>
  // 爆炸参数
  explodeX: number
  explodeY: number
  explodeRotate: number
  explodeScale: number
  // 归位层级
  layer: number
}

const fragments = reactive<Fragment[]>([])

// 伪随机数生成
let seed = 12345
const random = () => {
  seed = (seed * 9301 + 49297) % 233280
  return seed / 233280
}
const randRange = (min: number, max: number) => min + random() * (max - min)

const initFragments = () => {
  fragments.length = 0
  seed = 12345

  const maxDist = Math.sqrt(CENTER_X * CENTER_X + CENTER_Y * CENTER_Y)

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const index = row * COLS + col
      const cellW = 100 / COLS
      const cellH = 100 / ROWS

      // 计算到中心距离确定层级
      const dx = col - CENTER_X
      const dy = row - CENTER_Y
      const dist = Math.sqrt(dx * dx + dy * dy)
      const layer = Math.ceil(dist)

      // 计算爆炸方向和距离
      const angle = Math.atan2(dy, dx)
      const force = 80 + randRange(40, 120) * (dist / maxDist)

      const explodeX = Math.cos(angle) * force + randRange(-40, 40)
      const explodeY = Math.sin(angle) * force + randRange(-40, 40)
      const explodeRotate = randRange(-25, 25)
      const explodeScale = 1 + randRange(0.1, 0.25)

      fragments.push({
        style: {
          '--cell-w': `${cellW}%`,
          '--cell-h': `${cellH}%`,
          '--col': `${col}`,
          '--row': `${row}`,
          '--offset-x': `${(col - COLS / 2) * cellW * 0.1}px`,
          '--offset-y': `${(row - ROWS / 2) * cellH * 0.1}px`,
        },
        wrapperStyle: {
          width: `${cellW * 10}%`,
          height: `${cellH * 10}%`,
          left: `${col * cellW * 10}%`,
          top: `${row * cellH * 10}%`,
        },
        imgStyle: {
          width: `${100 / cellW * 100}%`,
          height: `${100 / cellH * 100}%`,
          left: `${-col * 100}%`,
          top: `${-row * 100}%`,
        },
        explodeX,
        explodeY,
        explodeRotate,
        explodeScale,
        layer,
      })
    }
  }
}

const setFragmentRef = (el: Element | null, index: number) => {
  if (el) fragmentRefs[index] = el as HTMLElement
}

onMounted(() => {
  if (!parentRef.value) return
  initFragments()
  requestAnimationFrame(() => setupAnimations())
})

const setupAnimations = () => {
  if (!parentRef.value || !shatterLayerRef.value) return

  // ========== 阶段1: 图片入场 ==========
  const entryTl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 80%',
      end: 'top 60%',
      scrub: 1,
    },
  })

  if (imageLayerRef.value) {
    gsap.set(imageLayerRef.value, { opacity: 0, scale: 1.1 })
    entryTl.to(imageLayerRef.value, {
      opacity: 1,
      scale: 1,
      duration: 0.5,
      ease: 'power2.out',
    })
  }

  // ========== 阶段2: 爆炸碎裂 ==========
  const explodeTl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 55%',
      end: 'top 30%',
      scrub: 1.2,
    },
  })

  // 碎片初始状态（在位）
  fragmentRefs.forEach((frag) => {
    if (!frag) return
    gsap.set(frag, {
      x: 0,
      y: 0,
      rotationZ: 0,
      scale: 1,
      opacity: 1,
    })
  })

  // 冲击波
  if (impactWaveRef.value) {
    gsap.set(impactWaveRef.value, { scale: 0, opacity: 0 })
    explodeTl.fromTo(
      impactWaveRef.value,
      { scale: 0, opacity: 1 },
      { scale: 4, opacity: 0, duration: 0.4, ease: 'power2.out' },
      0
    )
  }

  // 爆心
  if (impactCoreRef.value) {
    gsap.set(impactCoreRef.value, { scale: 0, opacity: 0 })
    explodeTl.fromTo(
      impactCoreRef.value,
      { scale: 0, opacity: 1 },
      { scale: 3, opacity: 0, duration: 0.3, ease: 'power3.out' },
      0
    )
  }

  // 碎片爆炸
  fragmentRefs.forEach((frag, idx) => {
    if (!frag) return
    const fragData = fragments[idx]
    if (!fragData) return

    const delay = fragData.layer * 0.03

    explodeTl.to(
      frag,
      {
        x: fragData.explodeX,
        y: fragData.explodeY,
        rotationZ: fragData.explodeRotate,
        scale: fragData.explodeScale,
        duration: 0.5,
        ease: 'power3.out',
      },
      delay
    )
  })

  cleanupFns.push(() => explodeTl.scrollTrigger?.kill())
  cleanupFns.push(() => explodeTl.kill())

  // ========== 阶段3: 归位重组 ==========
  const returnTl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 25%',
      end: 'center center',
      scrub: 1.5,
    },
  })

  // 按层级从外到内归位
  fragmentRefs.forEach((frag, idx) => {
    if (!frag) return
    const fragData = fragments[idx]
    if (!fragData) return

    const delay = (MAX_LAYER - fragData.layer) * 0.06

    // 快速归位
    returnTl.to(
      frag,
      {
        x: 0,
        y: 0,
        rotationZ: 0,
        scale: 1,
        duration: 0.6,
        ease: 'back.out(1.5)',
      },
      delay
    )

    // 边缘闪光
    const edge = frag.querySelector('.fragment-edge') as HTMLElement
    if (edge) {
      gsap.set(edge, { opacity: 0 })
      returnTl.to(
        edge,
        { opacity: 1, duration: 0.05 },
        delay + 0.3
      )
      returnTl.to(
        edge,
        { opacity: 0, duration: 0.2 },
        delay + 0.35
      )
    }
  })

  cleanupFns.push(() => returnTl.scrollTrigger?.kill())
  cleanupFns.push(() => returnTl.kill())

  // ========== 阶段4: 合成闪光 ==========
  if (synthesisFlashRef.value) {
    gsap.set(synthesisFlashRef.value, { opacity: 0 })

    const flashTl = gsap.timeline({
      scrollTrigger: {
        trigger: parentRef.value,
        start: 'center center-10%',
        end: 'center center+10%',
        scrub: 0.5,
      },
    })

    flashTl.to(synthesisFlashRef.value, { opacity: 1, duration: 0.1 }, 0)
    flashTl.to(synthesisFlashRef.value, { opacity: 0, duration: 0.4 }, 0.1)

    cleanupFns.push(() => flashTl.scrollTrigger?.kill())
    cleanupFns.push(() => flashTl.kill())
  }

  // ========== 亮度动画 ==========
  if (shatterLayerRef.value) {
    const brightnessTl = gsap.timeline({
      scrollTrigger: {
        trigger: parentRef.value,
        start: 'top 80%',
        end: 'center center',
        scrub: 1.5,
      },
    })

    brightnessTl.fromTo(
      shatterLayerRef.value,
      { filter: 'brightness(0.7) saturate(1.3)' },
      { filter: 'brightness(1.15) saturate(1)', duration: 1 }
    )

    cleanupFns.push(() => brightnessTl.scrollTrigger?.kill())
    cleanupFns.push(() => brightnessTl.kill())
  }
}

onUnmounted(() => {
  cleanupFns.forEach((fn) => fn())
  ScrollTrigger.getAll().forEach((st) => st.kill())
  gsap.killTweensOf('*')
})
</script>

<style scoped lang="scss">
.shatter-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #0a0a14;
}

// 主图片层
.image-layer {
  position: absolute;
  inset: 0;
  z-index: 1;

  .main-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

// 碎片层
.shatter-layer {
  position: absolute;
  inset: 0;
  z-index: 10;
  perspective: 2000px;
}

// 单个碎片
.fragment {
  position: absolute;
  width: calc(100% / 5);
  height: calc(100% / 4);
  left: calc(var(--col) * 100% / 5);
  top: calc(var(--row) * 100% / 4);
  transform-style: preserve-3d;
  will-change: transform;

  .fragment-image-wrapper {
    position: absolute;
    overflow: hidden;

    img {
      position: absolute;
      object-fit: cover;
    }
  }

  // 碎片边缘高光
  .fragment-edge {
    position: absolute;
    inset: 0;
    border: 1px solid rgba(255, 120, 100, 0.8);
    box-shadow:
      inset 0 0 8px rgba(255, 120, 100, 0.5),
      0 0 12px rgba(255, 120, 100, 0.4);
    pointer-events: none;
  }
}

// 冲击波
.impact-wave {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 300px;
  height: 300px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  border: 3px solid rgba(255, 150, 80, 0.8);
  box-shadow:
    0 0 30px rgba(255, 100, 50, 0.6),
    inset 0 0 30px rgba(255, 100, 50, 0.3);
  z-index: 20;
  pointer-events: none;
}

// 爆心
.impact-core {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 150px;
  height: 150px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 200, 150, 1) 0%,
    rgba(255, 120, 80, 0.8) 30%,
    rgba(255, 80, 50, 0) 70%
  );
  z-index: 21;
  pointer-events: none;
  filter: blur(3px);
}

// 合成闪光
.synthesis-flash {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at center,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(255, 220, 180, 0.6) 20%,
    rgba(255, 150, 100, 0.2) 50%,
    transparent 70%
  );
  z-index: 100;
  pointer-events: none;
  mix-blend-mode: overlay;
}
</style>
