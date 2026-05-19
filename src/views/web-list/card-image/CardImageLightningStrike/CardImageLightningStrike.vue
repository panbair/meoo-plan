<template>
  <section ref="parentRef" class="lightning-container">
    <div class="ls-base-layer">
      <img :src="imageUrl" alt="" class="ls-base-img" />
    </div>
    <div ref="fragLayerRef" class="ls-frag-layer">
      <div
        v-for="(frag, index) in fragments"
        :key="index"
        :ref="(el) => setFragRef(el, index)"
        class="ls-fragment"
        :style="frag.style"
      >
        <div class="ls-frag-inner" :style="frag.innerStyle">
          <img :src="imageUrl" alt="" />
        </div>
        <div class="ls-frag-spark"></div>
      </div>
    </div>
    <svg ref="svgRef" class="ls-lightning-svg" viewBox="0 0 1000 1000" preserveAspectRatio="none">
      <path
        v-for="(bolt, i) in bolts"
        :key="`bolt-${i}`"
        :ref="(el) => setBoltRef(el, i)"
        :d="bolt.d"
        class="ls-bolt"
        :style="{ stroke: bolt.color, strokeWidth: bolt.width }"
      />
    </svg>
    <div ref="flashRef" class="ls-flash"></div>
    <div ref="glowRef" class="ls-glow"></div>
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
const flashRef = ref<HTMLElement | null>(null)
const glowRef = ref<HTMLElement | null>(null)
const fragRefs: HTMLElement[] = []
const boltRefs: (SVGPathElement | null)[] = []
const cleanupFns: TweenCleanup[] = []

const COLS = 6
const ROWS = 5
const imageUrl = 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=1920&q=80'

interface Fragment {
  style: Record<string, string>
  innerStyle: Record<string, string>
  ejectX: number
  ejectY: number
  rot: number
  scale: number
  blur: number
  delay: number
}
interface Bolt { d: string; color: string; width: string }

const fragments = reactive<Fragment[]>([])
const bolts = reactive<Bolt[]>([])

let seed = 88888
const random = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280 }
const randRange = (a: number, b: number) => a + random() * (b - a)

// 生成锯齿闪电路径
const generateBoltPath = (startX: number, startY: number, endX: number, endY: number, segments: number) => {
  let d = `M ${startX} ${startY}`
  const dx = (endX - startX) / segments
  const dy = (endY - startY) / segments
  for (let i = 1; i < segments; i++) {
    const jx = randRange(-40, 40)
    const jy = randRange(-15, 15)
    d += ` L ${startX + dx * i + jx} ${startY + dy * i + jy}`
  }
  d += ` L ${endX} ${endY}`
  return d
}

const initData = () => {
  fragments.length = 0
  bolts.length = 0
  seed = 88888

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cellW = 100 / COLS
      const cellH = 100 / ROWS
      const cx = (c + 0.5) / COLS - 0.5
      const cy = (r + 0.5) / ROWS - 0.5
      const angle = Math.atan2(cy, cx)
      const dist = Math.sqrt(cx * cx + cy * cy)
      const force = 80 + dist * 150
      fragments.push({
        style: {
          left: `${c * cellW}%`, top: `${r * cellH}%`,
          width: `${cellW}%`, height: `${cellH}%`,
        },
        innerStyle: {
          width: `${COLS * 100}%`, height: `${ROWS * 100}%`,
          left: `${-c * 100}%`, top: `${-r * 100}%`,
        },
        ejectX: Math.cos(angle) * force + randRange(-30, 30),
        ejectY: Math.sin(angle) * force + randRange(-30, 30),
        rot: randRange(-25, 25),
        scale: 1 + randRange(0.05, 0.15),
        blur: 2 + dist * 6,
        delay: dist * 0.08,
      })
    }
  }

  // 生成3条主闪电 + 分支
  const mainBolts = [
    { sx: 500, sy: 0, ex: 500, ey: 1000, w: '3', color: 'rgba(180,200,255,0.9)' },
    { sx: 500, sy: 0, ex: 300, ey: 800, w: '2', color: 'rgba(150,180,255,0.7)' },
    { sx: 500, sy: 0, ex: 700, ey: 850, w: '2', color: 'rgba(150,180,255,0.7)' },
  ]
  mainBolts.forEach((b) => {
    bolts.push({
      d: generateBoltPath(b.sx, b.sy, b.ex, b.ey, 12),
      color: b.color, width: b.w,
    })
  })

  // 分支
  for (let i = 0; i < 5; i++) {
    const sx = 400 + randRange(-100, 100)
    const sy = 200 + i * 120
    bolts.push({
      d: generateBoltPath(sx, sy, sx + randRange(-200, 200), sy + randRange(80, 200), 6),
      color: 'rgba(140,170,255,0.5)', width: '1.5',
    })
  }
}

const setFragRef = (el: Element | ComponentPublicInstance | null, i: number) => {
  if (el) { fragRefs[i] = (el as any).$el || (el as HTMLElement) }
}
const setBoltRef = (el: unknown, i: number) => {
  if (el) { boltRefs[i] = (el as any).$el || (el as SVGPathElement) }
}

onMounted(() => {
  if (!parentRef.value) { return }
  initData()
  requestAnimationFrame(() => setup())
})

const setup = () => {
  if (!parentRef.value) { return }

  if (flashRef.value) { gsap.set(flashRef.value, { opacity: 0 }) }
  if (glowRef.value) { gsap.set(glowRef.value, { opacity: 0 }) }

  // 闪电线初始化
  boltRefs.filter(Boolean).forEach((b) => {
    if (!b) { return }
    const len = b.getTotalLength()
    gsap.set(b, { strokeDasharray: len, strokeDashoffset: len, opacity: 0 })
  })

  // ===== 阶段1: 闪电劈下 + 闪光 =====
  const boltTl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 80%',
      end: 'top 55%',
      scrub: 1,
    },
  })

  // 全屏闪光
  if (flashRef.value) {
    boltTl.to(flashRef.value, { opacity: 1, duration: 0.08 }, 0)
    boltTl.to(flashRef.value, { opacity: 0, duration: 0.15 }, 0.08)
    boltTl.to(flashRef.value, { opacity: 0.6, duration: 0.05 }, 0.25)
    boltTl.to(flashRef.value, { opacity: 0, duration: 0.1 }, 0.3)
  }

  // 闪电描绘
  boltRefs.filter(Boolean).forEach((b, i) => {
    if (!b) { return }
    boltTl.to(b, {
      strokeDashoffset: 0, opacity: 1, duration: 0.2, ease: 'power3.out',
    }, i * 0.03)
  })

  // 底光
  if (glowRef.value) {
    boltTl.to(glowRef.value, { opacity: 0.5, duration: 0.3 }, 0.05)
  }

  cleanupFns.push(() => { boltTl.scrollTrigger?.kill(); boltTl.kill() })

  // ===== 阶段2: 碎片飞散 → 聚合 =====
  const fragTl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 58%',
      end: 'top 10%',
      scrub: 1.8,
    },
  })

  fragRefs.forEach((frag, idx) => {
    if (!frag) { return }
    const d = fragments[idx]
    if (!d) { return }
    gsap.set(frag, {
      x: d.ejectX, y: d.ejectY, rotation: d.rot,
      scale: d.scale, opacity: 0, filter: `blur(${d.blur}px)`,
    })
    const spark = frag.querySelector('.ls-frag-spark') as HTMLElement
    if (spark) { gsap.set(spark, { opacity: 0 }) }

    fragTl.to(frag, {
      x: 0, y: 0, rotation: 0, scale: 1, opacity: 1,
      filter: 'blur(0px)', duration: 0.6, ease: 'expo.out',
    }, d.delay)

    if (spark) {
      fragTl.to(spark, { opacity: 1, duration: 0.05 }, d.delay + 0.3)
      fragTl.to(spark, { opacity: 0, duration: 0.2 }, d.delay + 0.35)
    }
  })

  // 闪电消退
  boltRefs.filter(Boolean).forEach((b, i) => {
    if (!b) { return }
    fragTl.to(b, { opacity: 0, duration: 0.2 }, 0.3 + i * 0.02)
  })
  if (glowRef.value) {
    fragTl.to(glowRef.value, { opacity: 0, duration: 0.3 }, 0.4)
  }

  cleanupFns.push(() => { fragTl.scrollTrigger?.kill(); fragTl.kill() })
}

onUnmounted(() => { cleanupFns.forEach((fn) => fn()) })
</script>

<style lang="scss" scoped>
.lightning-container {
  position: relative;
  width: 100vw; height: 100vh;
  overflow: hidden; background: #050510;
}
.ls-base-layer {
  position: absolute; inset: 0; z-index: 1;
  .ls-base-img { width: 100%; height: 100%; object-fit: cover; }
}
.ls-frag-layer {
  position: absolute; inset: 0; z-index: 10;
}
.ls-fragment {
  position: absolute; overflow: hidden;
  will-change: transform, opacity, filter;
  .ls-frag-inner {
    position: absolute; overflow: hidden;
    img { width: 100%; height: 100%; object-fit: cover; }
  }
  .ls-frag-spark {
    position: absolute; inset: 0;
    border: 1px solid rgba(180, 200, 255, 0.7);
    box-shadow: inset 0 0 8px rgba(150, 180, 255, 0.4), 0 0 15px rgba(150, 180, 255, 0.3);
    pointer-events: none;
  }
}
.ls-lightning-svg {
  position: absolute; inset: 0; z-index: 15;
  pointer-events: none;
}
.ls-bolt {
  fill: none; stroke-linecap: round;
  filter: drop-shadow(0 0 6px rgba(150, 180, 255, 0.6));
}
.ls-flash {
  position: absolute; inset: 0; z-index: 20;
  background: rgba(200, 220, 255, 0.95);
  pointer-events: none;
}
.ls-glow {
  position: absolute; inset: 0; z-index: 3;
  background: linear-gradient(0deg, rgba(120, 150, 255, 0.15) 0%, transparent 50%);
  pointer-events: none;
}
</style>

