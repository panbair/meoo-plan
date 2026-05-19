<template>
  <section ref="parentRef" class="fiber-optic-container">
    <div class="fo-base-layer">
      <img :src="imageUrl" alt="" class="fo-base-img" />
    </div>
    <!-- 光纤碎片层 -->
    <div ref="fragLayerRef" class="fo-frag-layer">
      <div
        v-for="(frag, index) in fragments"
        :key="index"
        :ref="(el) => setFragRef(el, index)"
        class="fo-fragment"
        :style="frag.style"
      >
        <div class="fo-frag-inner" :style="frag.innerStyle">
          <img :src="imageUrl" alt="" />
        </div>
        <div class="fo-frag-glow"></div>
      </div>
    </div>
    <!-- 光纤线路SVG -->
    <svg ref="svgRef" class="fo-fiber-svg" viewBox="0 0 1000 600" preserveAspectRatio="none">
      <path
        v-for="(fiber, i) in fibers"
        :key="`fiber-${i}`"
        :ref="(el) => setFiberRef(el, i)"
        :d="fiber.d"
        class="fo-fiber-line"
        :style="{ stroke: fiber.color }"
      />
    </svg>
    <!-- 数据流粒子 -->
    <div ref="particleLayerRef" class="fo-particle-layer">
      <div
        v-for="i in 40"
        :key="`p-${i}`"
        :ref="(el) => setParticleRef(el, i - 1)"
        class="fo-particle"
      ></div>
    </div>
    <!-- 中心汇聚点 -->
    <div ref="hubRef" class="fo-hub">
      <div class="fo-hub-ring fo-ring-1"></div>
      <div class="fo-hub-ring fo-ring-2"></div>
      <div class="fo-hub-core"></div>
    </div>
    <div ref="flashRef" class="fo-flash"></div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
type TweenCleanup = () => void

const parentRef = ref<HTMLElement | null>(null)
const fragLayerRef = ref<HTMLElement | null>(null)
const svgRef = ref<SVGElement | null>(null)
const particleLayerRef = ref<HTMLElement | null>(null)
const hubRef = ref<HTMLElement | null>(null)
const flashRef = ref<HTMLElement | null>(null)
const fragRefs: HTMLElement[] = []
const fiberRefs: (SVGPathElement | null)[] = []
const particleRefs: HTMLElement[] = []
const cleanupFns: TweenCleanup[] = []

const COLS = 6
const ROWS = 4
const imageUrl = 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1920&q=80'

interface Fragment {
  style: Record<string, string>
  innerStyle: Record<string, string>
  originX: number
  originY: number
  blur: number
  delay: number
}

interface Fiber {
  d: string
  color: string
}

const fragments = reactive<Fragment[]>([])
const fibers = reactive<Fiber[]>([])

let seed = 66677
const random = () => {
  seed = (seed * 9301 + 49297) % 233280
  return seed / 233280
}
const randRange = (a: number, b: number) => a + random() * (b - a)

const initData = () => {
  fragments.length = 0
  fibers.length = 0
  seed = 66677

  // 碎片
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cellW = 100 / COLS
      const cellH = 100 / ROWS
      const cx = (c + 0.5) / COLS
      const cy = (r + 0.5) / ROWS
      // 从边缘沿光纤路径汇入中心
      const edgeSide = random()
      let originX = 0
      let originY = 0
      if (edgeSide < 0.25) {
        originX = -200 - randRange(0, 100)
        originY = randRange(-200, 200)
      } else if (edgeSide < 0.5) {
        originX = 200 + randRange(0, 100)
        originY = randRange(-200, 200)
      } else if (edgeSide < 0.75) {
        originX = randRange(-200, 200)
        originY = -200 - randRange(0, 100)
      } else {
        originX = randRange(-200, 200)
        originY = 200 + randRange(0, 100)
      }

      fragments.push({
        style: {
          left: `${c * cellW}%`,
          top: `${r * cellH}%`,
          width: `${cellW}%`,
          height: `${cellH}%`,
        },
        innerStyle: {
          width: `${COLS * 100}%`,
          height: `${ROWS * 100}%`,
          left: `${-c * 100}%`,
          top: `${-r * 100}%`,
        },
        originX,
        originY,
        blur: 4 + random() * 4,
        delay: random() * 0.3,
      })
    }
  }

  // 光纤线路
  const hues = [190, 210, 230, 250, 170, 200, 220, 240, 180, 260]
  for (let i = 0; i < 10; i++) {
    const angle = (i / 10) * Math.PI * 2
    const edgeX = 500 + Math.cos(angle) * 600
    const edgeY = 300 + Math.sin(angle) * 400
    const cp1x = 500 + Math.cos(angle) * 300 + randRange(-80, 80)
    const cp1y = 300 + Math.sin(angle) * 200 + randRange(-60, 60)
    fibers.push({
      d: `M ${edgeX} ${edgeY} Q ${cp1x} ${cp1y}, 500 300`,
      color: `hsla(${hues[i]}, 80%, 60%, 0.5)`,
    })
  }
}

const setFragRef = (el: Element | ComponentPublicInstance | null, i: number) => {
  if (el) {
    fragRefs[i] = (el as any).$el || (el as HTMLElement)
  }
}
const setFiberRef = (el: unknown, i: number) => {
  if (el) {
    fiberRefs[i] = (el as any).$el || (el as SVGPathElement)
  }
}
const setParticleRef = (el: unknown, i: number) => {
  if (el) {
    particleRefs[i] = (el as any).$el || (el as HTMLElement)
  }
}

onMounted(() => {
  if (!parentRef.value) {
    return
  }
  initData()
  requestAnimationFrame(() => setup())
})

const setup = () => {
  if (!parentRef.value) {
    return
  }

  gsap.set(hubRef.value, { opacity: 0, scale: 0 })
  gsap.set(flashRef.value, { opacity: 0 })

  // 光纤线初始化
  fiberRefs.filter(Boolean).forEach((f) => {
    if (!f) {
      return
    }
    const len = f.getTotalLength()
    gsap.set(f, { strokeDasharray: len, strokeDashoffset: len, opacity: 0 })
  })

  // 粒子初始化
  particleRefs.filter(Boolean).forEach((p) => {
    const angle = random() * Math.PI * 2
    const dist = 300 + random() * 200
    gsap.set(p, {
      opacity: 0,
      scale: 0,
      left: `calc(50% + ${Math.cos(angle) * dist}px)`,
      top: `calc(50% + ${Math.sin(angle) * dist}px)`,
      width: 3 + random() * 4,
      height: 3 + random() * 4,
    })
  })

  // ===== 阶段1: 光纤线描绘 + 中心汇聚点 =====
  const fiberTl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 82%',
      end: 'top 50%',
      scrub: 1.2,
    },
  })

  // 中心hub
  fiberTl.to(hubRef.value, {
    opacity: 1,
    scale: 1,
    duration: 0.3,
    ease: 'back.out(1.5)',
  }, 0)

  // 光纤线描绘
  fiberRefs.filter(Boolean).forEach((f, i) => {
    if (!f) {
      return
    }
    fiberTl.to(f, {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 0.4,
      ease: 'power2.inOut',
    }, i * 0.04)
  })

  cleanupFns.push(() => {
    fiberTl.scrollTrigger?.kill()
    fiberTl.kill()
  })

  // ===== 阶段2: 数据流粒子 + 碎片汇聚 =====
  const assembleTl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 55%',
      end: 'top 5%',
      scrub: 1.8,
    },
  })

  // 粒子沿光纤汇入中心
  particleRefs.filter(Boolean).forEach((p, i) => {
    assembleTl.to(p, {
      opacity: 0.8,
      scale: 1,
      left: '50%',
      top: '50%',
      duration: 0.4,
      ease: 'power2.in',
    }, i * 0.015)
    assembleTl.to(p, {
      opacity: 0,
      scale: 0,
      duration: 0.1,
    }, i * 0.015 + 0.35)
  })

  // 碎片从边缘沿光纤路径归位
  fragRefs.forEach((frag, idx) => {
    if (!frag) {
      return
    }
    const d = fragments[idx]
    if (!d) {
      return
    }
    gsap.set(frag, {
      x: d.originX,
      y: d.originY,
      opacity: 0,
      filter: `blur(${d.blur}px)`,
      scale: 0.7,
    })
    const glow = frag.querySelector('.fo-frag-glow') as HTMLElement
    if (glow) {
      gsap.set(glow, { opacity: 0 })
    }

    assembleTl.to(frag, {
      x: 0,
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      scale: 1,
      duration: 0.5,
      ease: 'expo.out',
    }, d.delay + 0.1)

    if (glow) {
      assembleTl.to(glow, { opacity: 1, duration: 0.06 }, d.delay + 0.4)
      assembleTl.to(glow, { opacity: 0, duration: 0.15 }, d.delay + 0.46)
    }
  })

  // 光纤线消退
  fiberRefs.filter(Boolean).forEach((f, i) => {
    if (!f) {
      return
    }
    assembleTl.to(f, { opacity: 0, duration: 0.2 }, 0.5 + i * 0.02)
  })

  // hub消退
  assembleTl.to(hubRef.value, {
    opacity: 0,
    scale: 2,
    duration: 0.2,
  }, 0.6)

  // 闪光
  assembleTl.to(flashRef.value, { opacity: 0.6, duration: 0.08 }, 0.65)
  assembleTl.to(flashRef.value, { opacity: 0, duration: 0.3 }, 0.73)

  cleanupFns.push(() => {
    assembleTl.scrollTrigger?.kill()
    assembleTl.kill()
  })
}

onUnmounted(() => {
  cleanupFns.forEach((fn) => fn())
})
</script>

<style lang="scss" scoped>
.fiber-optic-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #040608;
}

.fo-base-layer {
  position: absolute;
  inset: 0;
  z-index: 1;

  .fo-base-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.fo-frag-layer {
  position: absolute;
  inset: 0;
  z-index: 10;
}

.fo-fragment {
  position: absolute;
  overflow: hidden;
  will-change: transform, opacity, filter;

  .fo-frag-inner {
    position: absolute;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .fo-frag-glow {
    position: absolute;
    inset: 0;
    border: 1px solid rgba(80, 180, 255, 0.5);
    box-shadow:
      inset 0 0 6px rgba(80, 180, 255, 0.25),
      0 0 10px rgba(80, 180, 255, 0.2);
    pointer-events: none;
  }
}

.fo-fiber-svg {
  position: absolute;
  inset: 0;
  z-index: 8;
  pointer-events: none;
}

.fo-fiber-line {
  fill: none;
  stroke-width: 1.5;
  stroke-linecap: round;
  filter: drop-shadow(0 0 4px rgba(80, 180, 255, 0.4));
}

.fo-particle-layer {
  position: absolute;
  inset: 0;
  z-index: 12;
  pointer-events: none;
}

.fo-particle {
  position: absolute;
  border-radius: 50%;
  will-change: transform, opacity, left, top;
}

.fo-particle:nth-child(odd) {
  background: rgba(100, 200, 255, 0.9);
  box-shadow: 0 0 6px rgba(100, 200, 255, 0.5);
}

.fo-particle:nth-child(even) {
  background: rgba(150, 220, 255, 0.8);
  box-shadow: 0 0 6px rgba(150, 220, 255, 0.4);
}

.fo-particle:nth-child(3n) {
  background: rgba(200, 240, 255, 0.9);
  box-shadow: 0 0 8px rgba(200, 240, 255, 0.5);
}

.fo-hub {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  z-index: 14;
  pointer-events: none;

  .fo-hub-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 1.5px solid rgba(80, 180, 255, 0.4);
  }

  .fo-ring-1 {
    animation: fo-spin 4s linear infinite;
  }

  .fo-ring-2 {
    inset: 12px;
    animation: fo-spin 2.5s linear infinite reverse;
    border-color: rgba(100, 220, 255, 0.5);
  }

  .fo-hub-core {
    position: absolute;
    inset: 28px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(150, 220, 255, 0.9) 0%,
      rgba(80, 160, 255, 0.5) 50%,
      transparent 80%
    );
    box-shadow: 0 0 25px rgba(100, 200, 255, 0.5);
  }
}

@keyframes fo-spin {
  to {
    transform: rotate(360deg);
  }
}

.fo-flash {
  position: absolute;
  inset: 0;
  z-index: 20;
  background: radial-gradient(
    ellipse at center,
    rgba(150, 220, 255, 0.9) 0%,
    rgba(80, 180, 255, 0.4) 30%,
    transparent 70%
  );
  pointer-events: none;
  mix-blend-mode: screen;
}
</style>

