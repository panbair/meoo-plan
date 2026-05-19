<template>
  <section ref="parentRef" class="dna-helix-container">
    <div class="dh-base-layer">
      <img :src="imageUrl" alt="" class="dh-base-img" />
    </div>
    <!-- DNA碎片层 -->
    <div ref="helixLayerRef" class="dh-helix-layer">
      <div
        v-for="(node, index) in nodes"
        :key="index"
        :ref="(el) => setNodeRef(el, index)"
        class="dh-node"
        :style="node.style"
      >
        <div class="dh-node-inner" :style="node.innerStyle">
          <img :src="imageUrl" alt="" />
        </div>
        <div class="dh-node-glow" :style="node.glowColor"></div>
      </div>
    </div>
    <!-- DNA骨架线 -->
    <svg ref="svgRef" class="dh-backbone" viewBox="0 0 1000 1000" preserveAspectRatio="none">
      <path
        v-for="(line, i) in backboneLines"
        :key="`bb-${i}`"
        :ref="(el) => setLineRef(el, i)"
        :d="line.d"
        class="dh-bb-line"
        :style="{ stroke: line.color }"
      />
    </svg>
    <div ref="flashRef" class="dh-flash"></div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
type TweenCleanup = () => void

const parentRef = ref<HTMLElement | null>(null)
const helixLayerRef = ref<HTMLElement | null>(null)
const svgRef = ref<SVGElement | null>(null)
const flashRef = ref<HTMLElement | null>(null)
const nodeRefs: HTMLElement[] = []
const lineRefs: (SVGPathElement | null)[] = []
const cleanupFns: TweenCleanup[] = []

const NODE_COUNT = 24
const imageUrl = 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1920&q=80'

interface HelixNode {
  style: Record<string, string>
  innerStyle: Record<string, string>
  glowColor: Record<string, string>
  helixX: number
  helixY: number
  helixRot: number
  helixScale: number
  delay: number
}

interface BackboneLine {
  d: string
  color: string
}

const nodes = reactive<HelixNode[]>([])
const backboneLines = reactive<BackboneLine[]>([])

let seed = 33344
const random = () => {
  seed = (seed * 9301 + 49297) % 233280
  return seed / 233280
}

const initData = () => {
  nodes.length = 0
  backboneLines.length = 0
  seed = 33344

  // 将图片分成网格，每个碎片沿DNA螺旋排列
  const cols = 6
  const rows = 4
  let idx = 0
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cellW = 100 / cols
      const cellH = 100 / rows
      const t = idx / (cols * rows - 1)
      const strand = idx % 2

      // DNA螺旋位置
      const helixPhase = t * Math.PI * 4
      const helixX = Math.cos(helixPhase + strand * Math.PI) * 200
      const helixY = (t - 0.5) * 600
      const helixScale = 0.5 + Math.abs(Math.cos(helixPhase + strand * Math.PI)) * 0.3

      const hue = strand === 0 ? 200 : 300

      nodes.push({
        style: {
          left: `${c * cellW}%`,
          top: `${r * cellH}%`,
          width: `${cellW}%`,
          height: `${cellH}%`,
        },
        innerStyle: {
          width: `${cols * 100}%`,
          height: `${rows * 100}%`,
          left: `${-c * 100}%`,
          top: `${-r * 100}%`,
        },
        glowColor: {
          borderColor: `hsla(${hue}, 70%, 60%, 0.5)`,
          boxShadow: `inset 0 0 6px hsla(${hue}, 70%, 60%, 0.3), 0 0 10px hsla(${hue}, 70%, 60%, 0.2)`,
        },
        helixX,
        helixY,
        helixRot: (helixPhase * 180) / Math.PI,
        helixScale,
        delay: t * 0.5,
      })
      idx++
    }
  }

  // DNA骨架线（两条螺旋）
  for (let strand = 0; strand < 2; strand++) {
    let d = ''
    for (let i = 0; i <= 40; i++) {
      const t = i / 40
      const phase = t * Math.PI * 4
      const x = 500 + Math.cos(phase + strand * Math.PI) * 200
      const y = 100 + t * 800
      d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`
    }
    backboneLines.push({
      d,
      color: strand === 0 ? 'rgba(100, 180, 255, 0.4)' : 'rgba(200, 100, 255, 0.4)',
    })
  }

  // 横桥（碱基对连接线）
  for (let i = 0; i < 10; i++) {
    const t = (i + 0.5) / 10
    const phase = t * Math.PI * 4
    const x1 = 500 + Math.cos(phase) * 200
    const x2 = 500 + Math.cos(phase + Math.PI) * 200
    const y = 100 + t * 800
    backboneLines.push({
      d: `M ${x1} ${y} L ${x2} ${y}`,
      color: 'rgba(150, 150, 255, 0.25)',
    })
  }
}

const setNodeRef = (el: Element | ComponentPublicInstance | null, i: number) => {
  if (el) {
    nodeRefs[i] = (el as any).$el || (el as HTMLElement)
  }
}
const setLineRef = (el: unknown, i: number) => {
  if (el) {
    lineRefs[i] = (el as any).$el || (el as SVGPathElement)
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

  gsap.set(flashRef.value, { opacity: 0 })

  // 骨架线初始化
  lineRefs.filter(Boolean).forEach((l) => {
    if (!l) {
      return
    }
    const len = l.getTotalLength()
    gsap.set(l, { strokeDasharray: len, strokeDashoffset: len, opacity: 0 })
  })

  // 碎片初始：沿DNA螺旋排列
  nodeRefs.forEach((node, i) => {
    if (!node) {
      return
    }
    const d = nodes[i]
    if (!d) {
      return
    }
    gsap.set(node, {
      x: d.helixX,
      y: d.helixY,
      rotation: d.helixRot,
      scale: d.helixScale,
      opacity: 0,
      filter: 'blur(3px)',
    })
    const glow = node.querySelector('.dh-node-glow') as HTMLElement
    if (glow) {
      gsap.set(glow, { opacity: 0 })
    }
  })

  // ===== 阶段1: DNA骨架描绘 + 碎片显现 =====
  const helixTl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 82%',
      end: 'top 45%',
      scrub: 1.5,
    },
  })

  lineRefs.filter(Boolean).forEach((l, i) => {
    if (!l) {
      return
    }
    helixTl.to(l, {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 0.5,
      ease: 'power2.inOut',
    }, i * 0.03)
  })

  // 碎片在螺旋位置显现
  nodeRefs.forEach((node, i) => {
    if (!node) {
      return
    }
    helixTl.to(node, {
      opacity: 0.8,
      filter: 'blur(1px)',
      duration: 0.2,
    }, 0.1 + i * 0.015)
  })

  cleanupFns.push(() => {
    helixTl.scrollTrigger?.kill()
    helixTl.kill()
  })

  // ===== 阶段2: 解旋归位 =====
  const unwindTl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 48%',
      end: 'top 5%',
      scrub: 1.8,
    },
  })

  nodeRefs.forEach((node, i) => {
    if (!node) {
      return
    }
    const d = nodes[i]
    if (!d) {
      return
    }

    unwindTl.to(node, {
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      opacity: 1,
      filter: 'blur(0px)',
      duration: 0.6,
      ease: 'expo.out',
    }, d.delay * 0.5)

    const glow = node.querySelector('.dh-node-glow') as HTMLElement
    if (glow) {
      unwindTl.to(glow, { opacity: 1, duration: 0.06 }, d.delay * 0.5 + 0.35)
      unwindTl.to(glow, { opacity: 0, duration: 0.15 }, d.delay * 0.5 + 0.41)
    }
  })

  // 骨架消退
  lineRefs.filter(Boolean).forEach((l, i) => {
    if (!l) {
      return
    }
    unwindTl.to(l, { opacity: 0, duration: 0.2 }, 0.4 + i * 0.02)
  })

  // 闪光
  unwindTl.to(flashRef.value, { opacity: 0.5, duration: 0.08 }, 0.6)
  unwindTl.to(flashRef.value, { opacity: 0, duration: 0.3 }, 0.68)

  cleanupFns.push(() => {
    unwindTl.scrollTrigger?.kill()
    unwindTl.kill()
  })
}

onUnmounted(() => {
  cleanupFns.forEach((fn) => fn())
})
</script>

<style lang="scss" scoped>
.dna-helix-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #060610;
}

.dh-base-layer {
  position: absolute;
  inset: 0;
  z-index: 1;

  .dh-base-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.dh-helix-layer {
  position: absolute;
  inset: 0;
  z-index: 10;
}

.dh-node {
  position: absolute;
  overflow: hidden;
  will-change: transform, opacity, filter;

  .dh-node-inner {
    position: absolute;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .dh-node-glow {
    position: absolute;
    inset: 0;
    border: 1px solid;
    pointer-events: none;
  }
}

.dh-backbone {
  position: absolute;
  inset: 0;
  z-index: 8;
  pointer-events: none;
}

.dh-bb-line {
  fill: none;
  stroke-width: 1.5;
  stroke-linecap: round;
  filter: drop-shadow(0 0 3px rgba(150, 150, 255, 0.3));
}

.dh-flash {
  position: absolute;
  inset: 0;
  z-index: 20;
  background: radial-gradient(
    ellipse at center,
    rgba(150, 180, 255, 0.9) 0%,
    rgba(100, 120, 255, 0.4) 30%,
    transparent 70%
  );
  pointer-events: none;
  mix-blend-mode: screen;
}
</style>

