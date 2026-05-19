<template>
  <section ref="parentRef" class="nebula-container">
    <div class="nb-base-layer">
      <img :src="imageUrl" alt="" class="nb-base-img" />
    </div>
    <div ref="fragLayerRef" class="nb-frag-layer">
      <div
        v-for="(frag, index) in fragments"
        :key="index"
        :ref="(el) => setFragRef(el, index)"
        class="nb-fragment"
        :style="frag.style"
      >
        <div class="nb-frag-inner" :style="frag.innerStyle">
          <img :src="imageUrl" alt="" />
        </div>
        <div class="nb-frag-glow" :style="frag.glowStyle"></div>
      </div>
    </div>
    <div class="nb-star-layer">
      <div
        v-for="i in 40"
        :key="`star-${i}`"
        :ref="(el) => setStarRef(el, i - 1)"
        class="nb-star"
      ></div>
    </div>
    <div ref="nebula1Ref" class="nb-cloud nb-cloud-1"></div>
    <div ref="nebula2Ref" class="nb-cloud nb-cloud-2"></div>
    <div ref="nebula3Ref" class="nb-cloud nb-cloud-3"></div>
    <div ref="flashRef" class="nb-flash"></div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
type TweenCleanup = () => void

const parentRef = ref<HTMLElement | null>(null)
const nebula1Ref = ref<HTMLElement | null>(null)
const nebula2Ref = ref<HTMLElement | null>(null)
const nebula3Ref = ref<HTMLElement | null>(null)
const flashRef = ref<HTMLElement | null>(null)
const fragRefs: HTMLElement[] = []
const starRefs: HTMLElement[] = []
const cleanupFns: TweenCleanup[] = []

const COLS = 6
const ROWS = 4
const imageUrl = 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=80'

interface Fragment {
  style: Record<string, string>
  innerStyle: Record<string, string>
  glowStyle: Record<string, string>
  driftX: number
  driftY: number
  rot: number
  blur: number
  delay: number
}

const fragments = reactive<Fragment[]>([])

let seed = 99100
const random = () => {
  seed = (seed * 9301 + 49297) % 233280
  return seed / 233280
}
const randRange = (a: number, b: number) => a + random() * (b - a)

const initData = () => {
  fragments.length = 0
  seed = 99100
  const hues = [220, 260, 300, 340, 200, 280]
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cellW = 100 / COLS
      const cellH = 100 / ROWS
      const angle = random() * Math.PI * 2
      const dist = 80 + random() * 120
      const hue = hues[(r * COLS + c) % hues.length]
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
        glowStyle: {
          borderColor: `hsla(${hue}, 60%, 60%, 0.4)`,
          boxShadow: `inset 0 0 8px hsla(${hue}, 60%, 60%, 0.25), 0 0 12px hsla(${hue}, 60%, 60%, 0.2)`,
        },
        driftX: Math.cos(angle) * dist,
        driftY: Math.sin(angle) * dist,
        rot: randRange(-20, 20),
        blur: 3 + random() * 5,
        delay: random() * 0.35,
      })
    }
  }
}

const setFragRef = (el: Element | ComponentPublicInstance | null, i: number) => {
  if (el) {
    fragRefs[i] = (el as any).$el || (el as HTMLElement)
  }
}
const setStarRef = (el: unknown, i: number) => {
  if (el) {
    starRefs[i] = (el as any).$el || (el as HTMLElement)
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

  gsap.set(nebula1Ref.value, { opacity: 0, scale: 0.5 })
  gsap.set(nebula2Ref.value, { opacity: 0, scale: 0.5 })
  gsap.set(nebula3Ref.value, { opacity: 0, scale: 0.5 })
  gsap.set(flashRef.value, { opacity: 0 })

  starRefs.filter(Boolean).forEach((s) => {
    const size = 1 + random() * 3
    gsap.set(s, {
      opacity: 0,
      left: `${random() * 100}%`,
      top: `${random() * 100}%`,
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
      x: d.driftX,
      y: d.driftY,
      rotation: d.rot,
      opacity: 0,
      filter: `blur(${d.blur}px)`,
      scale: 0.6,
    })
    const glow = f.querySelector('.nb-frag-glow') as HTMLElement
    if (glow) {
      gsap.set(glow, { opacity: 0 })
    }
  })

  // ===== 阶段1: 星云色彩 + 星星闪烁 =====
  const nebulaTl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 82%',
      end: 'top 40%',
      scrub: 1.5,
    },
  })

  nebulaTl.to(nebula1Ref.value, { opacity: 0.4, scale: 1, duration: 0.4 }, 0)
  nebulaTl.to(nebula2Ref.value, { opacity: 0.35, scale: 1, duration: 0.4 }, 0.1)
  nebulaTl.to(nebula3Ref.value, { opacity: 0.3, scale: 1, duration: 0.4 }, 0.2)

  starRefs.filter(Boolean).forEach((s, i) => {
    nebulaTl.to(s, {
      opacity: 0.4 + random() * 0.5,
      duration: 0.15,
    }, i * 0.01)
  })

  cleanupFns.push(() => {
    nebulaTl.scrollTrigger?.kill()
    nebulaTl.kill()
  })

  // ===== 阶段2: 碎片凝聚 =====
  const assembleTl = gsap.timeline({
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

    assembleTl.to(f, {
      x: 0,
      y: 0,
      rotation: 0,
      opacity: 1,
      filter: 'blur(0px)',
      scale: 1,
      duration: 0.6,
      ease: 'expo.out',
    }, d.delay)

    const glow = f.querySelector('.nb-frag-glow') as HTMLElement
    if (glow) {
      assembleTl.to(glow, { opacity: 1, duration: 0.06 }, d.delay + 0.35)
      assembleTl.to(glow, { opacity: 0, duration: 0.15 }, d.delay + 0.41)
    }
  })

  // 星云消退
  assembleTl.to(nebula1Ref.value, { opacity: 0, scale: 1.3, duration: 0.3 }, 0.4)
  assembleTl.to(nebula2Ref.value, { opacity: 0, scale: 1.3, duration: 0.3 }, 0.45)
  assembleTl.to(nebula3Ref.value, { opacity: 0, scale: 1.3, duration: 0.3 }, 0.5)

  // 星星消退
  starRefs.filter(Boolean).forEach((s, i) => {
    assembleTl.to(s, { opacity: 0, duration: 0.15 }, 0.5 + i * 0.005)
  })

  assembleTl.to(flashRef.value, { opacity: 0.5, duration: 0.08 }, 0.55)
  assembleTl.to(flashRef.value, { opacity: 0, duration: 0.3 }, 0.63)

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
.nebula-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #030308;
}

.nb-base-layer {
  position: absolute;
  inset: 0;
  z-index: 1;

  .nb-base-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.nb-frag-layer {
  position: absolute;
  inset: 0;
  z-index: 10;
}

.nb-fragment {
  position: absolute;
  overflow: hidden;
  will-change: transform, opacity, filter;

  .nb-frag-inner {
    position: absolute;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .nb-frag-glow {
    position: absolute;
    inset: 0;
    border: 1px solid;
    pointer-events: none;
  }
}

.nb-star-layer {
  position: absolute;
  inset: 0;
  z-index: 6;
  pointer-events: none;
}

.nb-star {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 4px rgba(255, 255, 255, 0.5);
  will-change: opacity;
}

.nb-cloud {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  z-index: 4;
  pointer-events: none;
  will-change: transform, opacity;
}

.nb-cloud-1 {
  left: 15%;
  top: 20%;
  width: 50%;
  height: 40%;
  background: radial-gradient(
    ellipse,
    rgba(100, 50, 200, 0.3) 0%,
    rgba(80, 30, 160, 0.1) 50%,
    transparent 80%
  );
}

.nb-cloud-2 {
  right: 10%;
  top: 30%;
  width: 45%;
  height: 35%;
  background: radial-gradient(
    ellipse,
    rgba(200, 50, 100, 0.25) 0%,
    rgba(180, 30, 80, 0.08) 50%,
    transparent 80%
  );
}

.nb-cloud-3 {
  left: 30%;
  bottom: 15%;
  width: 40%;
  height: 30%;
  background: radial-gradient(
    ellipse,
    rgba(50, 100, 200, 0.25) 0%,
    rgba(30, 80, 180, 0.08) 50%,
    transparent 80%
  );
}

.nb-flash {
  position: absolute;
  inset: 0;
  z-index: 20;
  background: radial-gradient(
    ellipse at center,
    rgba(200, 180, 255, 0.9) 0%,
    rgba(150, 100, 255, 0.4) 30%,
    transparent 70%
  );
  pointer-events: none;
  mix-blend-mode: screen;
}
</style>

