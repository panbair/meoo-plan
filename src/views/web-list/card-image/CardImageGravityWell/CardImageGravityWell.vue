<template>
  <section ref="parentRef" class="gravity-well-container">
    <div class="gw-base-layer">
      <img :src="imageUrl" alt="" class="gw-base-img" />
    </div>
    <div ref="fragmentLayerRef" class="gw-fragment-layer">
      <div
        v-for="(frag, index) in fragments"
        :key="index"
        :ref="(el) => setFragRef(el, index)"
        class="gw-fragment"
        :style="frag.style"
      >
        <div class="gw-frag-inner" :style="frag.innerStyle">
          <img :src="imageUrl" alt="" />
        </div>
        <div class="gw-frag-edge"></div>
      </div>
    </div>
    <div ref="wellCoreRef" class="gw-well-core">
      <div class="gw-core-ring gw-ring-1"></div>
      <div class="gw-core-ring gw-ring-2"></div>
      <div class="gw-core-ring gw-ring-3"></div>
      <div class="gw-core-center"></div>
    </div>
    <div ref="lensRef" class="gw-lens-distort"></div>
    <div ref="flashRef" class="gw-flash"></div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
type TweenCleanup = () => void

const parentRef = ref<HTMLElement | null>(null)
const fragmentLayerRef = ref<HTMLElement | null>(null)
const wellCoreRef = ref<HTMLElement | null>(null)
const lensRef = ref<HTMLElement | null>(null)
const flashRef = ref<HTMLElement | null>(null)
const fragRefs: HTMLElement[] = []
const cleanupFns: TweenCleanup[] = []

const COLS = 6
const ROWS = 5
const imageUrl = 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=80'

interface Fragment {
  style: Record<string, string>
  innerStyle: Record<string, string>
  swirlX: number
  swirlY: number
  swirlRot: number
  scale: number
  blur: number
  layer: number
}
const fragments = reactive<Fragment[]>([])

let seed = 42424
const random = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280 }
const randRange = (a: number, b: number) => a + random() * (b - a)

const initFragments = () => {
  fragments.length = 0
  seed = 42424
  const cx = (COLS - 1) / 2
  const cy = (ROWS - 1) / 2
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cellW = 100 / COLS
      const cellH = 100 / ROWS
      const dx = c - cx
      const dy = r - cy
      const dist = Math.sqrt(dx * dx + dy * dy)
      const angle = Math.atan2(dy, dx)
      // 螺旋偏移：沿切线方向 + 径向
      const tangent = angle + Math.PI / 2
      const swirlForce = 60 + dist * 30
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
        swirlX: Math.cos(tangent) * swirlForce + randRange(-20, 20),
        swirlY: Math.sin(tangent) * swirlForce + randRange(-20, 20),
        swirlRot: (dist < 1.5 ? 180 : 360) * (random() > 0.5 ? 1 : -1),
        scale: 0.3 + random() * 0.4,
        blur: 4 + dist * 3,
        layer: Math.ceil(dist),
      })
    }
  }
}

const setFragRef = (el: Element | ComponentPublicInstance | null, i: number) => {
  if (el) { fragRefs[i] = (el as any).$el || (el as HTMLElement) }
}

onMounted(() => {
  if (!parentRef.value) { return }
  initFragments()
  requestAnimationFrame(() => setup())
})

const setup = () => {
  if (!parentRef.value) { return }

  // 引力核心初始
  if (wellCoreRef.value) { gsap.set(wellCoreRef.value, { opacity: 0, scale: 0 }) }
  if (lensRef.value) { gsap.set(lensRef.value, { opacity: 0, scale: 0.5 }) }
  if (flashRef.value) { gsap.set(flashRef.value, { opacity: 0 }) }

  // ===== 阶段1: 引力核心出现 =====
  const coreTl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 85%',
      end: 'top 60%',
      scrub: 1.2,
    },
  })
  if (wellCoreRef.value) {
    coreTl.to(wellCoreRef.value, {
      opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.5)',
    }, 0)
  }
  if (lensRef.value) {
    coreTl.to(lensRef.value, {
      opacity: 0.4, scale: 1, duration: 0.6, ease: 'power2.out',
    }, 0.1)
  }
  cleanupFns.push(() => { coreTl.scrollTrigger?.kill(); coreTl.kill() })

  // ===== 阶段2: 碎片螺旋坍缩 → 归位 =====
  const swirlTl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 65%',
      end: 'top 10%',
      scrub: 1.8,
    },
  })

  fragRefs.forEach((frag, idx) => {
    if (!frag) { return }
    const d = fragments[idx]
    if (!d) { return }
    gsap.set(frag, {
      x: d.swirlX, y: d.swirlY, rotation: d.swirlRot,
      scale: d.scale, opacity: 0, filter: `blur(${d.blur}px)`,
    })
    const edge = frag.querySelector('.gw-frag-edge') as HTMLElement
    if (edge) { gsap.set(edge, { opacity: 0 }) }

    const delay = d.layer * 0.06
    swirlTl.to(frag, {
      x: 0, y: 0, rotation: 0, scale: 1, opacity: 1,
      filter: 'blur(0px)', duration: 0.7, ease: 'expo.out',
    }, delay)
    if (edge) {
      swirlTl.to(edge, { opacity: 1, duration: 0.06 }, delay + 0.4)
      swirlTl.to(edge, { opacity: 0, duration: 0.2 }, delay + 0.46)
    }
  })

  // 引力核心消退
  if (wellCoreRef.value) {
    swirlTl.to(wellCoreRef.value, { opacity: 0, scale: 2, duration: 0.3 }, 0.5)
  }
  if (lensRef.value) {
    swirlTl.to(lensRef.value, { opacity: 0, scale: 2, duration: 0.4 }, 0.5)
  }
  cleanupFns.push(() => { swirlTl.scrollTrigger?.kill(); swirlTl.kill() })

  // ===== 阶段3: 合成闪光 =====
  if (flashRef.value) {
    const flashTl = gsap.timeline({
      scrollTrigger: {
        trigger: parentRef.value,
        start: 'top 15%',
        end: 'top 0%',
        scrub: 0.5,
      },
    })
    flashTl.to(flashRef.value, { opacity: 0.8, duration: 0.15 }, 0)
    flashTl.to(flashRef.value, { opacity: 0, duration: 0.5 }, 0.15)
    cleanupFns.push(() => { flashTl.scrollTrigger?.kill(); flashTl.kill() })
  }
}

onUnmounted(() => { cleanupFns.forEach((fn) => fn()) })
</script>

<style lang="scss" scoped>
.gravity-well-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #030308;
}
.gw-base-layer {
  position: absolute; inset: 0; z-index: 1;
  .gw-base-img { width: 100%; height: 100%; object-fit: cover; }
}
.gw-fragment-layer {
  position: absolute; inset: 0; z-index: 10; perspective: 1200px;
}
.gw-fragment {
  position: absolute; overflow: hidden;
  will-change: transform, opacity, filter;
  .gw-frag-inner {
    position: absolute; overflow: hidden;
    img { width: 100%; height: 100%; object-fit: cover; }
  }
  .gw-frag-edge {
    position: absolute; inset: 0;
    border: 1px solid rgba(160, 120, 255, 0.6);
    box-shadow: inset 0 0 8px rgba(140, 100, 255, 0.3), 0 0 12px rgba(140, 100, 255, 0.2);
    pointer-events: none;
  }
}
.gw-well-core {
  position: absolute;
  left: 50%; top: 50%; transform: translate(-50%, -50%);
  width: 160px; height: 160px; z-index: 15; pointer-events: none;
}
.gw-core-ring {
  position: absolute; inset: 0; border-radius: 50%;
  border: 1.5px solid rgba(160, 120, 255, 0.4);
  animation: gw-spin 4s linear infinite;
}
.gw-ring-1 { inset: 0; }
.gw-ring-2 { inset: 15px; animation-duration: 3s; animation-direction: reverse; border-color: rgba(100, 180, 255, 0.4); }
.gw-ring-3 { inset: 30px; animation-duration: 2s; border-color: rgba(200, 100, 255, 0.5); }
.gw-core-center {
  position: absolute; inset: 45px; border-radius: 50%;
  background: radial-gradient(circle, rgba(200, 160, 255, 0.9) 0%, rgba(100, 60, 200, 0.5) 40%, transparent 70%);
  box-shadow: 0 0 30px rgba(160, 120, 255, 0.5), 0 0 60px rgba(120, 80, 255, 0.2);
}
@keyframes gw-spin { to { transform: rotate(360deg); } }
.gw-lens-distort {
  position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
  width: 400px; height: 400px; border-radius: 50%;
  background: radial-gradient(circle, rgba(140, 100, 255, 0.06) 0%, rgba(100, 80, 200, 0.03) 40%, transparent 70%);
  box-shadow: 0 0 80px rgba(140, 100, 255, 0.08);
  z-index: 5; pointer-events: none;
}
.gw-flash {
  position: absolute; inset: 0; z-index: 20;
  background: radial-gradient(ellipse at center, rgba(200, 180, 255, 0.9) 0%, rgba(140, 100, 255, 0.4) 30%, transparent 70%);
  pointer-events: none; mix-blend-mode: screen;
}
</style>

