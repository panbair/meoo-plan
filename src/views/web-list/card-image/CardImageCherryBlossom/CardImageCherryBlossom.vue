<template>
  <section ref="parentRef" class="cherry-blossom-container">
    <div class="cb-base-layer">
      <img :src="imageUrl" alt="" class="cb-base-img" />
    </div>
    <!-- 花瓣碎片层 -->
    <div ref="petalLayerRef" class="cb-petal-layer">
      <div
        v-for="(petal, index) in petals"
        :key="index"
        :ref="(el) => setPetalRef(el, index)"
        class="cb-petal"
        :style="petal.style"
      >
        <div class="cb-petal-inner" :style="petal.innerStyle">
          <img :src="imageUrl" alt="" />
        </div>
        <div class="cb-petal-bloom"></div>
      </div>
    </div>
    <!-- 粉色粒子 -->
    <div class="cb-particle-layer">
      <div
        v-for="i in 50"
        :key="`p-${i}`"
        :ref="(el) => setParticleRef(el, i - 1)"
        class="cb-particle"
      ></div>
    </div>
    <!-- 花瓣装饰 -->
    <div class="cb-decor-layer">
      <div
        v-for="i in 15"
        :key="`d-${i}`"
        :ref="(el) => setDecorRef(el, i - 1)"
        class="cb-decor-petal"
      ></div>
    </div>
    <div ref="glowRef" class="cb-glow"></div>
    <div ref="flashRef" class="cb-flash"></div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
type TweenCleanup = () => void

const parentRef = ref<HTMLElement | null>(null)
const petalLayerRef = ref<HTMLElement | null>(null)
const glowRef = ref<HTMLElement | null>(null)
const flashRef = ref<HTMLElement | null>(null)
const petalRefs: HTMLElement[] = []
const particleRefs: HTMLElement[] = []
const decorRefs: HTMLElement[] = []
const cleanupFns: TweenCleanup[] = []

const COLS = 6
const ROWS = 5
const imageUrl = 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=1920&q=80'

interface Petal {
  style: Record<string, string>
  innerStyle: Record<string, string>
  fallY: number
  swayX: number
  rot: number
  delay: number
}

const petals = reactive<Petal[]>([])

let seed = 88899
const random = () => {
  seed = (seed * 9301 + 49297) % 233280
  return seed / 233280
}
const randRange = (a: number, b: number) => a + random() * (b - a)

const initPetals = () => {
  petals.length = 0
  seed = 88899
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cellW = 100 / COLS
      const cellH = 100 / ROWS
      petals.push({
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
        fallY: -(100 + randRange(60, 200)),
        swayX: randRange(-60, 60),
        rot: randRange(-30, 30),
        delay: randRange(0, 0.3),
      })
    }
  }
}

const setPetalRef = (el: Element | ComponentPublicInstance | null, i: number) => {
  if (el) {
    petalRefs[i] = (el as any).$el || (el as HTMLElement)
  }
}
const setParticleRef = (el: unknown, i: number) => {
  if (el) {
    particleRefs[i] = (el as any).$el || (el as HTMLElement)
  }
}
const setDecorRef = (el: unknown, i: number) => {
  if (el) {
    decorRefs[i] = (el as any).$el || (el as HTMLElement)
  }
}

onMounted(() => {
  if (!parentRef.value) {
    return
  }
  initPetals()
  requestAnimationFrame(() => setup())
})

const setup = () => {
  if (!parentRef.value) {
    return
  }

  gsap.set(glowRef.value, { opacity: 0 })
  gsap.set(flashRef.value, { opacity: 0 })

  // 粒子初始
  particleRefs.filter(Boolean).forEach((p) => {
    const size = 2 + random() * 5
    gsap.set(p, {
      opacity: 0,
      scale: 0,
      left: `${random() * 100}%`,
      top: `${random() * 100}%`,
      width: size,
      height: size,
    })
  })

  // 装饰花瓣初始
  decorRefs.filter(Boolean).forEach((d) => {
    gsap.set(d, {
      opacity: 0,
      left: `${random() * 100}%`,
      top: `${-10 - random() * 20}%`,
      rotation: random() * 360,
      scale: 0.5 + random() * 0.5,
    })
  })

  // 碎片初始：飘散在上方
  petalRefs.forEach((p, i) => {
    if (!p) {
      return
    }
    const d = petals[i]
    if (!d) {
      return
    }
    gsap.set(p, {
      x: d.swayX,
      y: d.fallY,
      rotation: d.rot,
      opacity: 0,
      filter: 'blur(3px)',
    })
    const bloom = p.querySelector('.cb-petal-bloom') as HTMLElement
    if (bloom) {
      gsap.set(bloom, { opacity: 0 })
    }
  })

  // ===== 阶段1: 樱花粒子飘落 =====
  const particleTl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 85%',
      end: 'top 30%',
      scrub: 1.5,
    },
  })

  // 粉色光晕
  particleTl.to(glowRef.value, { opacity: 0.4, duration: 0.3 }, 0)

  // 装饰花瓣飘落
  decorRefs.filter(Boolean).forEach((d, i) => {
    particleTl.to(d, {
      opacity: 0.6,
      top: `${110 + random() * 20}%`,
      rotation: `+=${200 + random() * 300}`,
      duration: 0.8,
      ease: 'none',
    }, i * 0.03)
  })

  // 粉色粒子
  particleRefs.filter(Boolean).forEach((p, i) => {
    particleTl.to(p, {
      opacity: 0.5 + random() * 0.4,
      scale: 1,
      y: `+=${30 + random() * 60}`,
      duration: 0.3,
    }, i * 0.01)
    particleTl.to(p, {
      opacity: 0,
      scale: 0.3,
      duration: 0.2,
    }, i * 0.01 + 0.4)
  })

  particleTl.to(glowRef.value, { opacity: 0, duration: 0.3 }, 0.6)

  cleanupFns.push(() => {
    particleTl.scrollTrigger?.kill()
    particleTl.kill()
  })

  // ===== 阶段2: 碎片归位 =====
  const assembleTl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 60%',
      end: 'top 10%',
      scrub: 1.8,
    },
  })

  petalRefs.forEach((p, i) => {
    if (!p) {
      return
    }
    const d = petals[i]
    if (!d) {
      return
    }

    assembleTl.to(p, {
      x: 0,
      y: 0,
      rotation: 0,
      opacity: 1,
      filter: 'blur(0px)',
      duration: 0.6,
      ease: 'expo.out',
    }, d.delay)

    const bloom = p.querySelector('.cb-petal-bloom') as HTMLElement
    if (bloom) {
      assembleTl.to(bloom, { opacity: 1, duration: 0.06 }, d.delay + 0.35)
      assembleTl.to(bloom, { opacity: 0, duration: 0.2 }, d.delay + 0.41)
    }
  })

  // 闪光
  assembleTl.to(flashRef.value, { opacity: 0.5, duration: 0.08 }, 0.5)
  assembleTl.to(flashRef.value, { opacity: 0, duration: 0.3 }, 0.58)

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
.cherry-blossom-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #0e0608;
}

.cb-base-layer {
  position: absolute;
  inset: 0;
  z-index: 1;

  .cb-base-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.cb-petal-layer {
  position: absolute;
  inset: 0;
  z-index: 10;
}

.cb-petal {
  position: absolute;
  overflow: hidden;
  will-change: transform, opacity, filter;

  .cb-petal-inner {
    position: absolute;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .cb-petal-bloom {
    position: absolute;
    inset: 0;
    border: 1px solid rgba(255, 150, 180, 0.5);
    box-shadow:
      inset 0 0 8px rgba(255, 130, 170, 0.3),
      0 0 12px rgba(255, 130, 170, 0.2);
    pointer-events: none;
  }
}

.cb-particle-layer {
  position: absolute;
  inset: 0;
  z-index: 8;
  pointer-events: none;
}

.cb-particle {
  position: absolute;
  border-radius: 50%;
  will-change: transform, opacity;
}

.cb-particle:nth-child(odd) {
  background: rgba(255, 180, 200, 0.7);
  box-shadow: 0 0 6px rgba(255, 150, 180, 0.4);
}

.cb-particle:nth-child(even) {
  background: rgba(255, 200, 220, 0.6);
  box-shadow: 0 0 5px rgba(255, 180, 200, 0.3);
}

.cb-particle:nth-child(3n) {
  background: rgba(255, 220, 230, 0.8);
  box-shadow: 0 0 8px rgba(255, 200, 220, 0.5);
}

.cb-decor-layer {
  position: absolute;
  inset: 0;
  z-index: 6;
  pointer-events: none;
}

.cb-decor-petal {
  position: absolute;
  width: 12px;
  height: 14px;
  background: rgba(255, 180, 200, 0.5);
  border-radius: 50% 50% 50% 0;
  will-change: transform, opacity;
  filter: blur(1px);
}

.cb-glow {
  position: absolute;
  inset: 0;
  z-index: 5;
  background: radial-gradient(
    ellipse at 50% 30%,
    rgba(255, 150, 180, 0.15) 0%,
    rgba(255, 180, 200, 0.08) 40%,
    transparent 70%
  );
  pointer-events: none;
}

.cb-flash {
  position: absolute;
  inset: 0;
  z-index: 20;
  background: radial-gradient(
    ellipse at center,
    rgba(255, 200, 220, 0.8) 0%,
    rgba(255, 150, 180, 0.3) 30%,
    transparent 70%
  );
  pointer-events: none;
  mix-blend-mode: screen;
}
</style>

