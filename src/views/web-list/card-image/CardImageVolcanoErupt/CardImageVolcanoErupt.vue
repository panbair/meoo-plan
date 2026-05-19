<template>
  <section ref="parentRef" class="volcano-container">
    <div class="ve-base-layer">
      <img :src="imageUrl" alt="" class="ve-base-img" />
    </div>
    <div ref="fragLayerRef" class="ve-frag-layer">
      <div
        v-for="(frag, index) in fragments"
        :key="index"
        :ref="(el) => setFragRef(el, index)"
        class="ve-fragment"
        :style="frag.style"
      >
        <div class="ve-frag-inner" :style="frag.innerStyle">
          <img :src="imageUrl" alt="" />
        </div>
        <div class="ve-frag-ember"></div>
      </div>
    </div>
    <div class="ve-lava-layer">
      <div
        v-for="i in 40"
        :key="`lava-${i}`"
        :ref="(el) => setLavaRef(el, i - 1)"
        class="ve-lava"
      ></div>
    </div>
    <div ref="magmaRef" class="ve-magma"></div>
    <div ref="smokeRef" class="ve-smoke"></div>
    <div ref="flashRef" class="ve-flash"></div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
type TweenCleanup = () => void

const parentRef = ref<HTMLElement | null>(null)
const magmaRef = ref<HTMLElement | null>(null)
const smokeRef = ref<HTMLElement | null>(null)
const flashRef = ref<HTMLElement | null>(null)
const fragRefs: HTMLElement[] = []
const lavaRefs: HTMLElement[] = []
const cleanupFns: TweenCleanup[] = []

const COLS = 6
const ROWS = 4
const imageUrl = 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=1920&q=80'

interface Fragment {
  style: Record<string, string>
  innerStyle: Record<string, string>
  ejectY: number
  ejectX: number
  rot: number
  delay: number
}

const fragments = reactive<Fragment[]>([])

let seed = 55566
const random = () => {
  seed = (seed * 9301 + 49297) % 233280
  return seed / 233280
}
const randRange = (a: number, b: number) => a + random() * (b - a)

const initData = () => {
  fragments.length = 0
  seed = 55566
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cellW = 100 / COLS
      const cellH = 100 / ROWS
      const rowFactor = (ROWS - 1 - r) / (ROWS - 1)
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
        ejectY: -(100 + rowFactor * 200 + randRange(30, 100)),
        ejectX: randRange(-60, 60),
        rot: randRange(-20, 20),
        delay: rowFactor * 0.15 + randRange(0, 0.05),
      })
    }
  }
}

const setFragRef = (el: Element | ComponentPublicInstance | null, i: number) => {
  if (el) {
    fragRefs[i] = (el as any).$el || (el as HTMLElement)
  }
}
const setLavaRef = (el: unknown, i: number) => {
  if (el) {
    lavaRefs[i] = (el as any).$el || (el as HTMLElement)
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

  gsap.set(magmaRef.value, { opacity: 0 })
  gsap.set(smokeRef.value, { opacity: 0 })
  gsap.set(flashRef.value, { opacity: 0 })

  lavaRefs.filter(Boolean).forEach((l) => {
    const size = 3 + random() * 8
    gsap.set(l, {
      opacity: 0,
      scale: 0,
      left: `${40 + random() * 20}%`,
      bottom: '5%',
      width: size,
      height: size,
    })
  })

  fragRefs.forEach((f, i) => {
    if (!f) {
      return
    }
    const d = fragments[i]
    if (!d) {
      return
    }
    gsap.set(f, {
      x: d.ejectX,
      y: d.ejectY,
      rotation: d.rot,
      opacity: 0,
      filter: 'blur(3px)',
    })
    const ember = f.querySelector('.ve-frag-ember') as HTMLElement
    if (ember) {
      gsap.set(ember, { opacity: 0 })
    }
  })

  // ===== 阶段1: 岩浆涌动 + 熔岩飞溅 =====
  const lavaTl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 82%',
      end: 'top 40%',
      scrub: 1.5,
    },
  })

  lavaTl.to(magmaRef.value, { opacity: 0.5, duration: 0.3 }, 0)
  lavaTl.to(smokeRef.value, { opacity: 0.3, duration: 0.3 }, 0.05)

  lavaRefs.filter(Boolean).forEach((l, i) => {
    const angle = -Math.PI / 2 + randRange(-0.8, 0.8)
    const dist = 150 + random() * 300
    lavaTl.to(l, {
      opacity: 0.8,
      scale: 1,
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      duration: 0.4,
      ease: 'power2.out',
    }, i * 0.012)
    lavaTl.to(l, {
      opacity: 0,
      scale: 0.3,
      y: `+=${50 + random() * 80}`,
      duration: 0.3,
    }, i * 0.012 + 0.35)
  })

  cleanupFns.push(() => {
    lavaTl.scrollTrigger?.kill()
    lavaTl.kill()
  })

  // ===== 阶段2: 碎片坠落归位 =====
  const fallTl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 50%',
      end: 'top 5%',
      scrub: 1.8,
    },
  })

  fragRefs.forEach((f, i) => {
    if (!f) {
      return
    }
    const d = fragments[i]
    if (!d) {
      return
    }

    fallTl.to(f, {
      x: 0,
      y: 0,
      rotation: 0,
      opacity: 1,
      filter: 'blur(0px)',
      duration: 0.6,
      ease: 'bounce.out',
    }, d.delay)

    const ember = f.querySelector('.ve-frag-ember') as HTMLElement
    if (ember) {
      fallTl.to(ember, { opacity: 1, duration: 0.06 }, d.delay + 0.35)
      fallTl.to(ember, { opacity: 0, duration: 0.2 }, d.delay + 0.41)
    }
  })

  fallTl.to(magmaRef.value, { opacity: 0, duration: 0.3 }, 0.4)
  fallTl.to(smokeRef.value, { opacity: 0, y: -40, duration: 0.3 }, 0.45)

  fallTl.to(flashRef.value, { opacity: 0.6, duration: 0.08 }, 0.5)
  fallTl.to(flashRef.value, { opacity: 0, duration: 0.3 }, 0.58)

  cleanupFns.push(() => {
    fallTl.scrollTrigger?.kill()
    fallTl.kill()
  })
}

onUnmounted(() => {
  cleanupFns.forEach((fn) => fn())
})
</script>

<style lang="scss" scoped>
.volcano-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #0a0404;
}

.ve-base-layer {
  position: absolute;
  inset: 0;
  z-index: 1;

  .ve-base-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.ve-frag-layer {
  position: absolute;
  inset: 0;
  z-index: 10;
}

.ve-fragment {
  position: absolute;
  overflow: hidden;
  will-change: transform, opacity, filter;

  .ve-frag-inner {
    position: absolute;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .ve-frag-ember {
    position: absolute;
    inset: 0;
    border: 1px solid rgba(255, 120, 30, 0.6);
    box-shadow:
      inset 0 0 8px rgba(255, 80, 10, 0.3),
      0 0 12px rgba(255, 80, 10, 0.25);
    pointer-events: none;
  }
}

.ve-lava-layer {
  position: absolute;
  inset: 0;
  z-index: 8;
  pointer-events: none;
}

.ve-lava {
  position: absolute;
  border-radius: 50%;
  will-change: transform, opacity;
}

.ve-lava:nth-child(odd) {
  background: rgba(255, 140, 30, 0.9);
  box-shadow: 0 0 8px rgba(255, 100, 10, 0.5);
}

.ve-lava:nth-child(even) {
  background: rgba(255, 200, 50, 0.8);
  box-shadow: 0 0 6px rgba(255, 180, 30, 0.4);
}

.ve-lava:nth-child(3n) {
  background: rgba(255, 80, 10, 0.9);
  box-shadow: 0 0 10px rgba(200, 40, 5, 0.5);
}

.ve-magma {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 20%;
  z-index: 6;
  background: linear-gradient(
    0deg,
    rgba(255, 80, 10, 0.3) 0%,
    rgba(255, 140, 30, 0.15) 40%,
    transparent 100%
  );
  pointer-events: none;
}

.ve-smoke {
  position: absolute;
  left: 20%;
  right: 20%;
  bottom: 15%;
  height: 40%;
  z-index: 5;
  background: radial-gradient(
    ellipse at 50% 80%,
    rgba(80, 40, 20, 0.2) 0%,
    rgba(60, 30, 15, 0.1) 40%,
    transparent 70%
  );
  filter: blur(30px);
  pointer-events: none;
}

.ve-flash {
  position: absolute;
  inset: 0;
  z-index: 20;
  background: radial-gradient(
    ellipse at 50% 80%,
    rgba(255, 180, 80, 0.9) 0%,
    rgba(255, 120, 30, 0.4) 30%,
    transparent 70%
  );
  pointer-events: none;
  mix-blend-mode: screen;
}
</style>

