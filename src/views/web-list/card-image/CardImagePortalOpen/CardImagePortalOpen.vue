<template>
  <section ref="parentRef" class="portal-container">
    <div class="po-base-layer">
      <img :src="imageUrl" alt="" class="po-base-img" />
    </div>
    <!-- 传送门环 -->
    <div ref="portalRef" class="po-portal">
      <div ref="ring1Ref" class="po-ring po-ring-1"></div>
      <div ref="ring2Ref" class="po-ring po-ring-2"></div>
      <div ref="ring3Ref" class="po-ring po-ring-3"></div>
      <div ref="vortexRef" class="po-vortex"></div>
    </div>
    <!-- 图片碎片从门内浮现 -->
    <div ref="fragLayerRef" class="po-frag-layer">
      <div
        v-for="(frag, index) in fragments"
        :key="index"
        :ref="(el) => setFragRef(el, index)"
        class="po-fragment"
        :style="frag.style"
      >
        <div class="po-frag-inner" :style="frag.innerStyle">
          <img :src="imageUrl" alt="" />
        </div>
        <div class="po-frag-edge"></div>
      </div>
    </div>
    <!-- 能量粒子 -->
    <div class="po-particles">
      <div
        v-for="i in 30"
        :key="`p-${i}`"
        :ref="(el) => setParticleRef(el, i - 1)"
        class="po-particle"
      ></div>
    </div>
    <div ref="flashRef" class="po-flash"></div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
type TweenCleanup = () => void

const parentRef = ref<HTMLElement | null>(null)
const portalRef = ref<HTMLElement | null>(null)
const ring1Ref = ref<HTMLElement | null>(null)
const ring2Ref = ref<HTMLElement | null>(null)
const ring3Ref = ref<HTMLElement | null>(null)
const vortexRef = ref<HTMLElement | null>(null)
const fragLayerRef = ref<HTMLElement | null>(null)
const flashRef = ref<HTMLElement | null>(null)
const fragRefs: HTMLElement[] = []
const particleRefs: HTMLElement[] = []
const cleanupFns: TweenCleanup[] = []

const COLS = 5
const ROWS = 4
const imageUrl = 'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=1920&q=80'

interface Fragment {
  style: Record<string, string>
  innerStyle: Record<string, string>
  delay: number
  dist: number
}

const fragments = reactive<Fragment[]>([])

let seed = 11223
const random = () => {
  seed = (seed * 9301 + 49297) % 233280
  return seed / 233280
}
const randRange = (a: number, b: number) => a + random() * (b - a)

const initFragments = () => {
  fragments.length = 0
  seed = 11223
  const cx = (COLS - 1) / 2
  const cy = (ROWS - 1) / 2
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cellW = 100 / COLS
      const cellH = 100 / ROWS
      const dx = c - cx
      const dy = r - cy
      const dist = Math.sqrt(dx * dx + dy * dy)
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
        delay: dist * 0.08 + randRange(0, 0.05),
        dist,
      })
    }
  }
}

const setFragRef = (el: Element | ComponentPublicInstance | null, i: number) => {
  if (el) {
    fragRefs[i] = (el as any).$el || (el as HTMLElement)
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
  initFragments()
  requestAnimationFrame(() => setup())
})

const setup = () => {
  if (!parentRef.value) {
    return
  }

  // 初始：传送门不可见，碎片缩在中心
  gsap.set(portalRef.value, { opacity: 0, scale: 0 })
  gsap.set(ring1Ref.value, { rotation: 0 })
  gsap.set(ring2Ref.value, { rotation: 0 })
  gsap.set(ring3Ref.value, { rotation: 0 })
  gsap.set(vortexRef.value, { opacity: 0, scale: 0 })
  gsap.set(flashRef.value, { opacity: 0 })

  fragRefs.forEach((frag) => {
    if (!frag) {
      return
    }
    gsap.set(frag, {
      opacity: 0,
      scale: 0.2,
      x: 0,
      y: 0,
      filter: 'blur(8px)',
      transformOrigin: 'center center',
    })
    const edge = frag.querySelector('.po-frag-edge') as HTMLElement
    if (edge) {
      gsap.set(edge, { opacity: 0 })
    }
  })

  particleRefs.filter(Boolean).forEach((p) => {
    const angle = random() * Math.PI * 2
    const dist = 20 + random() * 60
    gsap.set(p, {
      opacity: 0,
      scale: 0,
      left: `calc(50% + ${Math.cos(angle) * dist}px)`,
      top: `calc(50% + ${Math.sin(angle) * dist}px)`,
      width: 3 + random() * 5,
      height: 3 + random() * 5,
    })
  })

  // ===== 阶段1: 传送门打开 =====
  const portalTl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 82%',
      end: 'top 50%',
      scrub: 1.2,
    },
  })

  portalTl.to(portalRef.value, {
    opacity: 1,
    scale: 1,
    duration: 0.4,
    ease: 'back.out(1.5)',
  }, 0)

  portalTl.to(vortexRef.value, {
    opacity: 0.6,
    scale: 1,
    duration: 0.3,
  }, 0.1)

  portalTl.to(ring1Ref.value, { rotation: 360, duration: 1, ease: 'none' }, 0)
  portalTl.to(ring2Ref.value, { rotation: -270, duration: 1, ease: 'none' }, 0)
  portalTl.to(ring3Ref.value, { rotation: 180, duration: 1, ease: 'none' }, 0)

  // 粒子环绕
  particleRefs.filter(Boolean).forEach((p, i) => {
    const angle = (i / 30) * Math.PI * 2
    const radius = 120 + random() * 80
    portalTl.to(p, {
      opacity: 0.7,
      scale: 1,
      left: `calc(50% + ${Math.cos(angle) * radius}px)`,
      top: `calc(50% + ${Math.sin(angle) * radius}px)`,
      duration: 0.3,
    }, i * 0.01)
  })

  cleanupFns.push(() => {
    portalTl.scrollTrigger?.kill()
    portalTl.kill()
  })

  // ===== 阶段2: 碎片从传送门中浮现归位 =====
  const emergeTl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 55%',
      end: 'top 5%',
      scrub: 1.8,
    },
  })

  fragRefs.forEach((frag, idx) => {
    if (!frag) {
      return
    }
    const d = fragments[idx]
    if (!d) {
      return
    }

    emergeTl.to(frag, {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      duration: 0.5,
      ease: 'expo.out',
    }, d.delay)

    const edge = frag.querySelector('.po-frag-edge') as HTMLElement
    if (edge) {
      emergeTl.to(edge, { opacity: 1, duration: 0.06 }, d.delay + 0.3)
      emergeTl.to(edge, { opacity: 0, duration: 0.15 }, d.delay + 0.36)
    }
  })

  // 传送门消退
  emergeTl.to(portalRef.value, {
    opacity: 0,
    scale: 2,
    duration: 0.3,
  }, 0.5)

  // 粒子消退
  particleRefs.filter(Boolean).forEach((p, i) => {
    const angle = (i / 30) * Math.PI * 2
    const radius = 300 + random() * 200
    emergeTl.to(p, {
      opacity: 0,
      left: `calc(50% + ${Math.cos(angle) * radius}px)`,
      top: `calc(50% + ${Math.sin(angle) * radius}px)`,
      duration: 0.3,
    }, 0.4 + i * 0.008)
  })

  // 闪光
  emergeTl.to(flashRef.value, { opacity: 0.6, duration: 0.08 }, 0.55)
  emergeTl.to(flashRef.value, { opacity: 0, duration: 0.3 }, 0.63)

  cleanupFns.push(() => {
    emergeTl.scrollTrigger?.kill()
    emergeTl.kill()
  })
}

onUnmounted(() => {
  cleanupFns.forEach((fn) => fn())
})
</script>

<style lang="scss" scoped>
.portal-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #040410;
}

.po-base-layer {
  position: absolute;
  inset: 0;
  z-index: 1;

  .po-base-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.po-portal {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 280px;
  height: 280px;
  z-index: 15;
  pointer-events: none;
}

.po-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid transparent;
}

.po-ring-1 {
  border-color: rgba(120, 80, 255, 0.5);
  box-shadow:
    0 0 15px rgba(120, 80, 255, 0.3),
    inset 0 0 15px rgba(120, 80, 255, 0.15);
}

.po-ring-2 {
  inset: 20px;
  border-color: rgba(80, 200, 255, 0.4);
  box-shadow: 0 0 12px rgba(80, 200, 255, 0.25);
}

.po-ring-3 {
  inset: 40px;
  border-color: rgba(200, 100, 255, 0.5);
  box-shadow: 0 0 10px rgba(200, 100, 255, 0.2);
  border-style: dashed;
}

.po-vortex {
  position: absolute;
  inset: 50px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(100, 50, 200, 0.6) 0%,
    rgba(60, 30, 150, 0.3) 40%,
    rgba(20, 10, 80, 0.1) 70%,
    transparent 100%
  );
  box-shadow: 0 0 40px rgba(100, 50, 200, 0.3);
}

.po-frag-layer {
  position: absolute;
  inset: 0;
  z-index: 10;
}

.po-fragment {
  position: absolute;
  overflow: hidden;
  will-change: transform, opacity, filter;

  .po-frag-inner {
    position: absolute;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .po-frag-edge {
    position: absolute;
    inset: 0;
    border: 1px solid rgba(140, 100, 255, 0.6);
    box-shadow:
      inset 0 0 6px rgba(120, 80, 255, 0.3),
      0 0 10px rgba(120, 80, 255, 0.2);
    pointer-events: none;
  }
}

.po-particles {
  position: absolute;
  inset: 0;
  z-index: 12;
  pointer-events: none;
}

.po-particle {
  position: absolute;
  border-radius: 50%;
  will-change: transform, opacity, left, top;
}

.po-particle:nth-child(odd) {
  background: rgba(140, 100, 255, 0.8);
  box-shadow: 0 0 6px rgba(140, 100, 255, 0.5);
}

.po-particle:nth-child(even) {
  background: rgba(80, 200, 255, 0.7);
  box-shadow: 0 0 6px rgba(80, 200, 255, 0.4);
}

.po-particle:nth-child(3n) {
  background: rgba(200, 100, 255, 0.8);
  box-shadow: 0 0 8px rgba(200, 100, 255, 0.5);
}

.po-flash {
  position: absolute;
  inset: 0;
  z-index: 20;
  background: radial-gradient(
    ellipse at center,
    rgba(160, 120, 255, 0.9) 0%,
    rgba(100, 60, 200, 0.4) 30%,
    transparent 70%
  );
  pointer-events: none;
  mix-blend-mode: screen;
}
</style>

