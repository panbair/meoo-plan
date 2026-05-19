<template>
  <section ref="parentRef" class="black-mirror-container">
    <div class="bm-base-layer">
      <img :src="imageUrl" alt="" class="bm-base-img" />
    </div>
    <!-- 镜面碎片层 -->
    <div ref="shardLayerRef" class="bm-shard-layer">
      <div
        v-for="(shard, index) in shards"
        :key="index"
        :ref="(el) => setShardRef(el, index)"
        class="bm-shard"
        :style="shard.style"
      >
        <div class="bm-shard-inner" :style="shard.innerStyle">
          <img :src="imageUrl" alt="" />
        </div>
        <div class="bm-shard-reflection"></div>
        <div class="bm-shard-crack"></div>
      </div>
    </div>
    <!-- 裂纹SVG -->
    <svg ref="crackSvgRef" class="bm-crack-svg" viewBox="0 0 1000 600" preserveAspectRatio="none">
      <path
        v-for="(crack, i) in cracks"
        :key="`crack-${i}`"
        :ref="(el) => setCrackRef(el, i)"
        :d="crack.d"
        class="bm-crack-line"
      />
    </svg>
    <!-- 冲击点 -->
    <div ref="impactRef" class="bm-impact"></div>
    <div ref="flashRef" class="bm-flash"></div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
type TweenCleanup = () => void

const parentRef = ref<HTMLElement | null>(null)
const shardLayerRef = ref<HTMLElement | null>(null)
const crackSvgRef = ref<SVGElement | null>(null)
const impactRef = ref<HTMLElement | null>(null)
const flashRef = ref<HTMLElement | null>(null)
const shardRefs: HTMLElement[] = []
const crackRefs: (SVGPathElement | null)[] = []
const cleanupFns: TweenCleanup[] = []

const COLS = 5
const ROWS = 4
const imageUrl = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&q=80'

interface Shard {
  style: Record<string, string>
  innerStyle: Record<string, string>
  fallY: number
  fallX: number
  fallRot: number
  delay: number
}

interface CrackLine {
  d: string
}

const shards = reactive<Shard[]>([])
const cracks = reactive<CrackLine[]>([])

let seed = 77788
const random = () => {
  seed = (seed * 9301 + 49297) % 233280
  return seed / 233280
}
const randRange = (a: number, b: number) => a + random() * (b - a)

const initData = () => {
  shards.length = 0
  cracks.length = 0
  seed = 77788

  const cx = 500
  const cy = 300

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cellW = 100 / COLS
      const cellH = 100 / ROWS
      const fragCX = (c + 0.5) * (1000 / COLS)
      const fragCY = (r + 0.5) * (600 / ROWS)
      const dx = fragCX - cx
      const dy = fragCY - cy
      const dist = Math.sqrt(dx * dx + dy * dy)
      const angle = Math.atan2(dy, dx)

      shards.push({
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
        fallY: 200 + dist * 0.3 + randRange(50, 150),
        fallX: Math.cos(angle) * (30 + dist * 0.15) + randRange(-20, 20),
        fallRot: randRange(-15, 15),
        delay: dist * 0.001 + randRange(0, 0.05),
      })
    }
  }

  // 从冲击点发散的裂纹
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2 + randRange(-0.2, 0.2)
    let d = `M ${cx} ${cy}`
    let x = cx
    let y = cy
    const segments = 4 + Math.floor(random() * 4)
    for (let j = 0; j < segments; j++) {
      const stepLen = 60 + randRange(20, 80)
      x += Math.cos(angle + randRange(-0.3, 0.3)) * stepLen
      y += Math.sin(angle + randRange(-0.3, 0.3)) * stepLen
      d += ` L ${x} ${y}`
    }
    cracks.push({ d })
  }
}

const setShardRef = (el: Element | ComponentPublicInstance | null, i: number) => {
  if (el) {
    shardRefs[i] = (el as any).$el || (el as HTMLElement)
  }
}
const setCrackRef = (el: unknown, i: number) => {
  if (el) {
    crackRefs[i] = (el as any).$el || (el as SVGPathElement)
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

  gsap.set(impactRef.value, { opacity: 0, scale: 0 })
  gsap.set(flashRef.value, { opacity: 0 })

  crackRefs.filter(Boolean).forEach((cr) => {
    if (!cr) {
      return
    }
    const len = cr.getTotalLength()
    gsap.set(cr, { strokeDasharray: len, strokeDashoffset: len, opacity: 0 })
  })

  // 碎片初始：正常位置（等待坠落）
  shardRefs.forEach((s) => {
    if (!s) {
      return
    }
    gsap.set(s, { x: 0, y: 0, rotation: 0, opacity: 1 })
    const reflection = s.querySelector('.bm-shard-reflection') as HTMLElement
    if (reflection) {
      gsap.set(reflection, { opacity: 0.3 })
    }
  })

  // ===== 阶段1: 冲击 + 裂纹 =====
  const crackTl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 80%',
      end: 'top 55%',
      scrub: 1,
    },
  })

  // 冲击点
  crackTl.to(impactRef.value, {
    opacity: 1,
    scale: 1.5,
    duration: 0.1,
    ease: 'power3.out',
  }, 0)
  crackTl.to(impactRef.value, {
    opacity: 0,
    scale: 3,
    duration: 0.3,
  }, 0.1)

  // 闪光
  crackTl.to(flashRef.value, { opacity: 0.8, duration: 0.05 }, 0)
  crackTl.to(flashRef.value, { opacity: 0, duration: 0.15 }, 0.05)

  // 裂纹描绘
  crackRefs.filter(Boolean).forEach((cr, i) => {
    if (!cr) {
      return
    }
    crackTl.to(cr, {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 0.2,
      ease: 'power3.out',
    }, i * 0.02)
  })

  cleanupFns.push(() => {
    crackTl.scrollTrigger?.kill()
    crackTl.kill()
  })

  // ===== 阶段2: 碎片坠落 =====
  const fallTl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 58%',
      end: 'top 25%',
      scrub: 1.5,
    },
  })

  shardRefs.forEach((s, idx) => {
    if (!s) {
      return
    }
    const d = shards[idx]
    if (!d) {
      return
    }

    fallTl.to(s, {
      y: d.fallY,
      x: d.fallX,
      rotation: d.fallRot,
      opacity: 0.3,
      duration: 0.5,
      ease: 'power2.in',
    }, d.delay)
  })

  // 裂纹加粗
  crackRefs.filter(Boolean).forEach((cr) => {
    if (!cr) {
      return
    }
    fallTl.to(cr, { strokeWidth: 3, duration: 0.3 }, 0)
  })

  cleanupFns.push(() => {
    fallTl.scrollTrigger?.kill()
    fallTl.kill()
  })

  // ===== 阶段3: 反向重组 =====
  const rebuildTl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 28%',
      end: 'top 0%',
      scrub: 1.8,
    },
  })

  shardRefs.forEach((s, idx) => {
    if (!s) {
      return
    }
    const d = shards[idx]
    if (!d) {
      return
    }

    rebuildTl.to(s, {
      y: 0,
      x: 0,
      rotation: 0,
      opacity: 1,
      duration: 0.5,
      ease: 'back.out(1.2)',
    }, d.delay * 0.8)

    const crack = s.querySelector('.bm-shard-crack') as HTMLElement
    if (crack) {
      gsap.set(crack, { opacity: 0 })
      rebuildTl.to(crack, { opacity: 1, duration: 0.05 }, d.delay * 0.8 + 0.3)
      rebuildTl.to(crack, { opacity: 0, duration: 0.15 }, d.delay * 0.8 + 0.35)
    }
  })

  // 裂纹消退
  crackRefs.filter(Boolean).forEach((cr, i) => {
    if (!cr) {
      return
    }
    rebuildTl.to(cr, { opacity: 0, duration: 0.2 }, 0.3 + i * 0.02)
  })

  // 归位闪光
  rebuildTl.to(flashRef.value, { opacity: 0.5, duration: 0.08 }, 0.5)
  rebuildTl.to(flashRef.value, { opacity: 0, duration: 0.3 }, 0.58)

  cleanupFns.push(() => {
    rebuildTl.scrollTrigger?.kill()
    rebuildTl.kill()
  })
}

onUnmounted(() => {
  cleanupFns.forEach((fn) => fn())
})
</script>

<style lang="scss" scoped>
.black-mirror-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #0a0a0e;
}

.bm-base-layer {
  position: absolute;
  inset: 0;
  z-index: 1;

  .bm-base-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.bm-shard-layer {
  position: absolute;
  inset: 0;
  z-index: 10;
  perspective: 1500px;
}

.bm-shard {
  position: absolute;
  overflow: hidden;
  will-change: transform, opacity;

  .bm-shard-inner {
    position: absolute;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .bm-shard-reflection {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.12) 0%,
      transparent 40%,
      rgba(255, 255, 255, 0.06) 60%,
      transparent 100%
    );
    pointer-events: none;
  }

  .bm-shard-crack {
    position: absolute;
    inset: 0;
    border: 1px solid rgba(200, 220, 255, 0.6);
    box-shadow:
      inset 0 0 6px rgba(200, 220, 255, 0.3),
      0 0 8px rgba(200, 220, 255, 0.2);
    pointer-events: none;
  }
}

.bm-crack-svg {
  position: absolute;
  inset: 0;
  z-index: 12;
  pointer-events: none;
}

.bm-crack-line {
  fill: none;
  stroke: rgba(200, 220, 255, 0.7);
  stroke-width: 1.5;
  stroke-linecap: round;
  filter: drop-shadow(0 0 3px rgba(200, 220, 255, 0.5));
}

.bm-impact {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.9) 0%,
    rgba(200, 220, 255, 0.5) 40%,
    transparent 70%
  );
  z-index: 15;
  pointer-events: none;
}

.bm-flash {
  position: absolute;
  inset: 0;
  z-index: 20;
  background: rgba(220, 230, 255, 0.6);
  pointer-events: none;
}
</style>

