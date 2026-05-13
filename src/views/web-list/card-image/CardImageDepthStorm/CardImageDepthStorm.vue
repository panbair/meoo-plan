<template>
  <section ref="parentRef" class="depth-storm-container">
    <!-- 底层完整图片 -->
    <div class="base-image-layer">
      <img :src="imageUrl" alt="背景图" class="base-image" />
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
        <div class="fragment-inner" :style="fragment.innerStyle">
          <img :src="imageUrl" alt="" />
        </div>
        <div class="fragment-edge"></div>
      </div>
    </div>

    <!-- 深度光效 -->
    <div ref="depthGlowRef" class="depth-glow"></div>

    <!-- 最终合成闪光 -->
    <div ref="flashRef" class="synthesis-flash"></div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void

const parentRef = ref<HTMLElement | null>(null)
const shatterLayerRef = ref<HTMLElement | null>(null)
const depthGlowRef = ref<HTMLElement | null>(null)
const flashRef = ref<HTMLElement | null>(null)

const fragmentRefs: HTMLElement[] = []
const cleanupFns: TweenCleanup[] = []

const COLS = 5
const ROWS = 4
const CENTER_X = (COLS - 1) / 2
const CENTER_Y = (ROWS - 1) / 2

const imageUrl = 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&q=80'

interface Fragment {
  style: Record<string, string>
  innerStyle: Record<string, string>
  explodeX: number
  explodeY: number
  explodeZ: number
  rotateX: number
  rotateY: number
  rotateZ: number
  scale: number
  blur: number
  layer: number
}

const fragments = reactive<Fragment[]>([])

let seed = 54321
const random = () => {
  seed = (seed * 9301 + 49297) % 233280
  return seed / 233280
}
const randRange = (min: number, max: number) => min + random() * (max - min)

const initFragments = () => {
  fragments.length = 0
  seed = 54321

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cellW = 100 / COLS
      const cellH = 100 / ROWS
      const top = row * cellH
      const left = col * cellW

      // 计算到中心距离
      const dx = col - CENTER_X
      const dy = row - CENTER_Y
      const dist = Math.sqrt(dx * dx + dy * dy)
      const maxDist = Math.sqrt(CENTER_X * CENTER_X + CENTER_Y * CENTER_Y)
      const layer = Math.ceil(dist)

      // 爆炸方向（从中心向外）
      const angle = Math.atan2(dy, dx)
      const force = 80 + randRange(30, 100) * (dist / maxDist)

      const explodeX = Math.cos(angle) * force + randRange(-50, 50)
      const explodeY = Math.sin(angle) * force + randRange(-50, 50)
      const explodeZ = randRange(-40, 60)

      const rotateX = randRange(-12, 12)
      const rotateY = randRange(-12, 12)
      const rotateZ = randRange(-20, 20)

      // 前景/中景/远景缩放
      const scale = dist > maxDist * 0.6
        ? randRange(0.9, 1.0)  // 远景缩小
        : dist < maxDist * 0.3
          ? randRange(1.05, 1.15)  // 前景放大
          : 1.0

      // 远景模糊
      const blur = dist > maxDist * 0.5 ? randRange(0.5, 1.5) : 0

      fragments.push({
        style: {
          '--frag-x': `${left}%`,
          '--frag-y': `${top}%`,
        },
        innerStyle: {
          width: `${cellW * 10}%`,
          height: `${cellH * 10}%`,
          left: `${-col * 100}%`,
          top: `${-row * 100}%`,
        },
        explodeX,
        explodeY,
        explodeZ,
        rotateX,
        rotateY,
        rotateZ,
        scale,
        blur,
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

  // ========== 阶段1: 爆炸散开 ==========
  const explodeTl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 80%',
      end: 'top 40%',
      scrub: 1.2,
    },
  })

  // 碎片初始状态
  fragmentRefs.forEach((frag) => {
    if (!frag) return
    gsap.set(frag, {
      x: 0,
      y: 0,
      z: 0,
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      scale: 1,
      filter: 'blur(0px)',
      opacity: 0,
    })
  })

  // 碎片爆炸
  fragmentRefs.forEach((frag, idx) => {
    if (!frag) return
    const fragData = fragments[idx]
    if (!fragData) return

    const delay = fragData.layer * 0.04

    explodeTl.to(frag, {
      x: fragData.explodeX,
      y: fragData.explodeY,
      z: fragData.explodeZ,
      rotationX: fragData.rotateX,
      rotationY: fragData.rotateY,
      rotationZ: fragData.rotateZ,
      scale: fragData.scale,
      filter: `blur(${fragData.blur}px)`,
      opacity: 1,
      duration: 0.5,
      ease: 'power3.out',
    }, delay)
  })

  // 深度光效
  if (depthGlowRef.value) {
    gsap.set(depthGlowRef.value, { opacity: 0, scale: 0.5 })
    explodeTl.to(depthGlowRef.value, {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      ease: 'power2.out',
    }, 0.1)
    explodeTl.to(depthGlowRef.value, {
      opacity: 0.3,
      scale: 1.3,
      duration: 0.6,
      ease: 'power2.inOut',
    }, 0.3)
  }

  cleanupFns.push(() => explodeTl.scrollTrigger?.kill())
  cleanupFns.push(() => explodeTl.kill())

  // ========== 阶段2: 归位重组 ==========
  const returnTl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 35%',
      end: 'center center',
      scrub: 1.5,
    },
  })

  const maxLayer = Math.ceil(Math.sqrt(CENTER_X * CENTER_X + CENTER_Y * CENTER_Y))

  fragmentRefs.forEach((frag, idx) => {
    if (!frag) return
    const fragData = fragments[idx]
    if (!fragData) return

    const delay = (maxLayer - fragData.layer) * 0.08

    // 归位动画
    returnTl.to(frag, {
      x: 0,
      y: 0,
      z: 0,
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      scale: 1,
      filter: 'blur(0px)',
      duration: 0.7,
      ease: 'back.out(1.2)',
    }, delay)

    // 边缘闪光
    const edge = frag.querySelector('.fragment-edge') as HTMLElement
    if (edge) {
      gsap.set(edge, { opacity: 0 })
      returnTl.to(edge, { opacity: 1, duration: 0.05 }, delay + 0.4)
      returnTl.to(edge, { opacity: 0, duration: 0.25 }, delay + 0.45)
    }
  })

  cleanupFns.push(() => returnTl.scrollTrigger?.kill())
  cleanupFns.push(() => returnTl.kill())

  // ========== 阶段3: 合成闪光 ==========
  if (flashRef.value) {
    gsap.set(flashRef.value, { opacity: 0 })

    const flashTl = gsap.timeline({
      scrollTrigger: {
        trigger: parentRef.value,
        start: 'center center-10%',
        end: 'center center+10%',
        scrub: 0.5,
      },
    })

    flashTl.to(flashRef.value, { opacity: 1, duration: 0.1 }, 0)
    flashTl.to(flashRef.value, { opacity: 0, duration: 0.4 }, 0.1)

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
      { filter: 'brightness(0.7) saturate(1.2)' },
      { filter: 'brightness(1.1) saturate(1)', duration: 1 }
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
.depth-storm-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #0a0a14;
}

// 底层图片
.base-image-layer {
  position: absolute;
  inset: 0;
  z-index: 1;

  .base-image {
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
  left: var(--frag-x);
  top: var(--frag-y);
  transform-style: preserve-3d;
  will-change: transform, filter, opacity;

  .fragment-inner {
    position: absolute;
    overflow: hidden;

    img {
      position: absolute;
      object-fit: cover;
    }
  }

  .fragment-edge {
    position: absolute;
    inset: 0;
    border: 1px solid rgba(100, 180, 255, 0.7);
    box-shadow:
      inset 0 0 8px rgba(100, 180, 255, 0.5),
      0 0 10px rgba(100, 180, 255, 0.3);
    pointer-events: none;
  }
}

// 深度光效
.depth-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  transform: translate(-50%, -50%);
  background: radial-gradient(
    ellipse at center,
    rgba(80, 140, 220, 0.15) 0%,
    rgba(60, 100, 180, 0.08) 40%,
    transparent 70%
  );
  pointer-events: none;
  z-index: 5;
  filter: blur(30px);
  mix-blend-mode: screen;
}

// 合成闪光
.synthesis-flash {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at center,
    rgba(255, 255, 255, 0.9) 0%,
    rgba(200, 220, 255, 0.5) 20%,
    rgba(150, 180, 220, 0.2) 50%,
    transparent 70%
  );
  z-index: 100;
  pointer-events: none;
  mix-blend-mode: overlay;
}
</style>
