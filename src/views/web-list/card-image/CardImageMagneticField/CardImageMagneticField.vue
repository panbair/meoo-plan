<template>
  <section ref="parentRef" class="magnetic-field-container">
    <div class="mf-base-layer">
      <img :src="imageUrl" alt="" class="mf-base-img" />
    </div>
    <div ref="fragmentLayerRef" class="mf-fragment-layer">
      <div
        v-for="(frag, index) in fragments"
        :key="index"
        :ref="(el) => setFragmentRef(el, index)"
        class="mf-fragment"
        :style="frag.style"
      >
        <div class="mf-frag-inner" :style="frag.innerStyle">
          <img :src="imageUrl" alt="" />
        </div>
        <div class="mf-frag-edge"></div>
      </div>
    </div>
    <svg class="mf-field-lines" viewBox="0 0 1000 600" preserveAspectRatio="none">
      <path
        v-for="(line, i) in fieldLines"
        :key="`line-${i}`"
        :ref="(el) => setLineRef(el, i)"
        :d="line.d"
        class="mf-line"
        :style="{ stroke: line.color }"
      />
    </svg>
    <div ref="poleNorthRef" class="mf-pole mf-pole-n"></div>
    <div ref="poleSouthRef" class="mf-pole mf-pole-s"></div>
    <div ref="flashRef" class="mf-flash"></div>
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
const poleNorthRef = ref<HTMLElement | null>(null)
const poleSouthRef = ref<HTMLElement | null>(null)
const flashRef = ref<HTMLElement | null>(null)

const fragmentRefs: HTMLElement[] = []
const lineRefs: (SVGPathElement | null)[] = []
const cleanupFns: TweenCleanup[] = []

const COLS = 6
const ROWS = 4
const imageUrl = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80'

interface Fragment {
  style: Record<string, string>
  innerStyle: Record<string, string>
  arcX: number
  arcY: number
  arcRotate: number
  scale: number
  blur: number
  layer: number
}

interface FieldLine {
  d: string
  color: string
}

const fragments = reactive<Fragment[]>([])
const fieldLines = reactive<FieldLine[]>([])

let seed = 31415
const random = () => {
  seed = (seed * 9301 + 49297) % 233280
  return seed / 233280
}
const randRange = (min: number, max: number) => min + random() * (max - min)

const initFragments = () => {
  fragments.length = 0
  seed = 31415
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cellW = 100 / COLS
      const cellH = 100 / ROWS
      const cx = (col + 0.5) / COLS - 0.5
      const cy = (row + 0.5) / ROWS - 0.5
      const dist = Math.sqrt(cx * cx + cy * cy)
      const angle = Math.atan2(cy, cx)
      const force = 120 + dist * 200

      fragments.push({
        style: {
          left: `${col * cellW}%`,
          top: `${row * cellH}%`,
          width: `${cellW}%`,
          height: `${cellH}%`,
        },
        innerStyle: {
          width: `${COLS * 100}%`,
          height: `${ROWS * 100}%`,
          left: `${-col * 100}%`,
          top: `${-row * 100}%`,
        },
        arcX: Math.cos(angle) * force + randRange(-30, 30),
        arcY: Math.sin(angle) * force * 0.6 + (cy > 0 ? 80 : -80),
        arcRotate: randRange(-15, 15),
        scale: 1 + randRange(0.05, 0.2),
        blur: 3 + dist * 8,
        layer: Math.ceil(dist * 4),
      })
    }
  }
}

const initFieldLines = () => {
  fieldLines.length = 0
  const hues = [200, 220, 260, 280, 310, 180, 240, 290]
  for (let i = 0; i < 8; i++) {
    const startY = 100 + i * 55
    const endY = startY + randRange(-20, 20)
    const midY = startY - 80 - i * 10
    fieldLines.push({
      d: `M -20 ${startY} C ${200 + i * 30} ${midY}, ${800 - i * 30} ${midY}, 1020 ${endY}`,
      color: `hsla(${hues[i % hues.length]}, 85%, 65%, 0.4)`,
    })
  }
}

const setFragmentRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  if (el) {
    fragmentRefs[index] = (el as any).$el || (el as HTMLElement)
  }
}
const setLineRef = (el: unknown, index: number) => {
  if (el) {
    lineRefs[index] = (el as any).$el || (el as SVGPathElement)
  }
}

onMounted(() => {
  if (!parentRef.value) {
    return
  }
  initFragments()
  initFieldLines()
  requestAnimationFrame(() => setupAnimations())
})

const setupAnimations = () => {
  if (!parentRef.value) {
    return
  }

  // 磁力线描绘
  lineRefs.filter(Boolean).forEach((line) => {
    if (!line) {
      return
    }
    const length = line.getTotalLength()
    gsap.set(line, { strokeDasharray: length, strokeDashoffset: length, opacity: 0 })
  })

  const lineTl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 85%',
      end: 'top 50%',
      scrub: 1.5,
    },
  })

  lineRefs.filter(Boolean).forEach((line, i) => {
    if (!line) {
      return
    }
    lineTl.to(
      line,
      { strokeDashoffset: 0, opacity: 1, duration: 0.6, ease: 'power2.inOut' },
      i * 0.06,
    )
  })

  if (poleNorthRef.value) {
    gsap.set(poleNorthRef.value, { opacity: 0, scale: 0.3 })
    lineTl.to(
      poleNorthRef.value,
      { opacity: 0.7, scale: 1, duration: 0.4, ease: 'power2.out' },
      0,
    )
  }
  if (poleSouthRef.value) {
    gsap.set(poleSouthRef.value, { opacity: 0, scale: 0.3 })
    lineTl.to(
      poleSouthRef.value,
      { opacity: 0.7, scale: 1, duration: 0.4, ease: 'power2.out' },
      0.1,
    )
  }

  cleanupFns.push(() => {
    lineTl.scrollTrigger?.kill()
    lineTl.kill()
  })

  // 碎片沿磁力线聚合
  const assembleTl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 60%',
      end: 'top 15%',
      scrub: 1.8,
    },
  })

  fragmentRefs.forEach((frag, idx) => {
    if (!frag) {
      return
    }
    const data = fragments[idx]
    if (!data) {
      return
    }

    gsap.set(frag, {
      x: data.arcX,
      y: data.arcY,
      rotation: data.arcRotate,
      scale: data.scale,
      opacity: 0,
      filter: `blur(${data.blur}px)`,
    })

    const edge = frag.querySelector('.mf-frag-edge') as HTMLElement
    if (edge) {
      gsap.set(edge, { opacity: 0 })
    }

    const delay = data.layer * 0.05

    assembleTl.to(
      frag,
      {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.7,
        ease: 'expo.out',
      },
      delay,
    )

    if (edge) {
      assembleTl.to(edge, { opacity: 1, duration: 0.08 }, delay + 0.4)
      assembleTl.to(edge, { opacity: 0, duration: 0.2 }, delay + 0.5)
    }
  })

  // 磁力线与磁极消退
  lineRefs.filter(Boolean).forEach((line, i) => {
    if (!line) {
      return
    }
    assembleTl.to(line, { opacity: 0, duration: 0.3 }, 0.5 + i * 0.03)
  })

  if (poleNorthRef.value) {
    assembleTl.to(poleNorthRef.value, { opacity: 0, scale: 1.5, duration: 0.3 }, 0.6)
  }
  if (poleSouthRef.value) {
    assembleTl.to(poleSouthRef.value, { opacity: 0, scale: 1.5, duration: 0.3 }, 0.6)
  }

  cleanupFns.push(() => {
    assembleTl.scrollTrigger?.kill()
    assembleTl.kill()
  })

  // 合成闪光
  if (flashRef.value) {
    gsap.set(flashRef.value, { opacity: 0 })
    const flashTl = gsap.timeline({
      scrollTrigger: {
        trigger: parentRef.value,
        start: 'top 20%',
        end: 'top 5%',
        scrub: 0.5,
      },
    })
    flashTl.to(flashRef.value, { opacity: 0.7, duration: 0.2 }, 0)
    flashTl.to(flashRef.value, { opacity: 0, duration: 0.5 }, 0.2)
    cleanupFns.push(() => {
      flashTl.scrollTrigger?.kill()
      flashTl.kill()
    })
  }
}

onUnmounted(() => {
  cleanupFns.forEach((fn) => fn())
})
</script>

<style lang="scss" scoped>
.magnetic-field-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #04040c;
}

.mf-base-layer {
  position: absolute;
  inset: 0;
  z-index: 1;

  .mf-base-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.mf-fragment-layer {
  position: absolute;
  inset: 0;
  z-index: 10;
  perspective: 1500px;
}

.mf-fragment {
  position: absolute;
  overflow: hidden;
  will-change: transform, opacity, filter;

  .mf-frag-inner {
    position: absolute;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .mf-frag-edge {
    position: absolute;
    inset: 0;
    border: 1px solid rgba(100, 180, 255, 0.6);
    box-shadow:
      inset 0 0 6px rgba(100, 180, 255, 0.3),
      0 0 10px rgba(100, 180, 255, 0.25);
    pointer-events: none;
  }
}

.mf-field-lines {
  position: absolute;
  inset: 0;
  z-index: 8;
  pointer-events: none;
}

.mf-line {
  fill: none;
  stroke-width: 1.5;
  stroke-linecap: round;
}

.mf-pole {
  position: absolute;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  z-index: 7;
  pointer-events: none;
}

.mf-pole-n {
  left: -30px;
  top: 50%;
  transform: translateY(-50%);
  background: radial-gradient(
    circle,
    rgba(100, 200, 255, 0.7) 0%,
    rgba(80, 160, 255, 0.3) 40%,
    transparent 70%
  );
  box-shadow: 0 0 40px rgba(80, 160, 255, 0.3);
}

.mf-pole-s {
  right: -30px;
  top: 50%;
  transform: translateY(-50%);
  background: radial-gradient(
    circle,
    rgba(255, 100, 150, 0.7) 0%,
    rgba(255, 80, 120, 0.3) 40%,
    transparent 70%
  );
  box-shadow: 0 0 40px rgba(255, 80, 120, 0.3);
}

.mf-flash {
  position: absolute;
  inset: 0;
  z-index: 20;
  background: radial-gradient(
    ellipse at center,
    rgba(180, 220, 255, 0.9) 0%,
    rgba(100, 180, 255, 0.4) 30%,
    transparent 70%
  );
  pointer-events: none;
  mix-blend-mode: screen;
}
</style>

