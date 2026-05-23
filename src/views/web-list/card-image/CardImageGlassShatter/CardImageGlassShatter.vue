<template>
  <div class="card-image-glass-shatter" ref="parentRef">
    <!-- 碎片舞台（共享单张背景图） -->
    <div
      class="shards-stage"
      ref="stageRef"
      :style="{ backgroundImage: `url(${imageUrl})` }"
    >
      <div
        v-for="(shard, idx) in shardData"
        :key="idx"
        class="shard"
        :ref="el => { if (el) shardRefs[idx] = el as HTMLElement }"
        :style="{
          clipPath: shard.clipPath,
          '--edge-color': shard.edgeColor
        }"
      ></div>
    </div>

    <!-- 玻璃微尘粒子 -->
    <div class="dust-layer" ref="dustRef">
      <div
        v-for="d in 20"
        :key="'d'+d"
        class="dust-particle"
        :ref="el => { if (el) dustRefs[d-1] = el as HTMLElement }"
        :style="getDustStyle(d)"
      ></div>
    </div>

    <!-- 中心光晕 -->
    <div class="center-glow" ref="glowRef"></div>

    <!-- 内容覆盖层 -->
    <div class="content-layer" ref="contentRef">
      <h2 class="title" ref="titleRef">{{ title }}</h2>
      <div class="divider" ref="dividerRef"></div>
      <p class="subtitle" ref="subtitleRef">{{ subtitle }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ==================== 类型 ====================
type TweenCleanup = { revert: () => void }
interface ShardConfig {
  clipPath: string
  scatterX: number
  scatterY: number
  scatterRotate: number
  scatterScale: number
  scatterOpacity: number
  edgeColor: string
}

// ==================== Props ====================
const props = withDefaults(defineProps<{
  imageUrl?: string
  title?: string
  subtitle?: string
}>(), {
  imageUrl: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=1920&q=80',
  title: '玻璃碎裂重组',
  subtitle: 'Glass Shatter & Rebuild'
})

// ==================== Refs ====================
const parentRef = ref<HTMLElement | null>(null)
const stageRef = ref<HTMLElement | null>(null)
const dustRef = ref<HTMLElement | null>(null)
const glowRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const dividerRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)

const shardRefs = ref<(HTMLElement | null)[]>([])
const dustRefs = ref<(HTMLElement | null)[]>([])

let cleanupFns: TweenCleanup[] = []

// ==================== 碎片数据 ====================
const COLS = 6
const ROWS = 5
const TOTAL_SHARDS = COLS * ROWS // 30 枚碎片

const shardData = computed<ShardConfig[]>(() => {
  const configs: ShardConfig[] = []

  const edgePalette = [
    'rgba(120,200,255,0.8)',
    'rgba(80,160,255,0.7)',
    'rgba(150,130,255,0.75)',
    'rgba(60,200,220,0.7)',
    'rgba(100,170,255,0.75)',
    'rgba(130,120,250,0.7)',
    'rgba(70,190,240,0.8)',
    'rgba(110,150,255,0.75)',
  ]

  const centerC = (COLS - 1) / 2
  const centerR = (ROWS - 1) / 2
  const jitter = 2.5

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      // 基础顶点
      const b = [
        { x: c / COLS * 100, y: r / ROWS * 100 },
        { x: (c + 1) / COLS * 100, y: r / ROWS * 100 },
        { x: (c + 1) / COLS * 100, y: (r + 1) / ROWS * 100 },
        { x: c / COLS * 100, y: (r + 1) / ROWS * 100 },
      ]

      // 随机偏移 → 不规则多边形
      const v = b.map(p => ({
        x: +(p.x + (Math.random() - 0.5) * jitter).toFixed(2),
        y: +(p.y + (Math.random() - 0.5) * jitter).toFixed(2),
      }))

      const clipPath = `polygon(${v.map(p => `${p.x}% ${p.y}%`).join(',')})`

      // 散落偏移：距中心越远散越远
      const dx = (c - centerC) / centerC
      const dy = (r - centerR) / centerR
      const dist = Math.sqrt(dx * dx + dy * dy)
      const factor = 0.6 + dist * 1.2

      const angle = Math.random() * Math.PI * 2
      const d = (80 + Math.random() * 180) * factor

      configs.push({
        clipPath,
        scatterX: Math.cos(angle) * d,
        scatterY: Math.sin(angle) * d,
        scatterRotate: (Math.random() - 0.5) * 150 * factor,
        scatterScale: 0.35 + Math.random() * 0.45,
        scatterOpacity: 0.1 + Math.random() * 0.35,
        edgeColor: edgePalette[Math.floor(Math.random() * edgePalette.length)],
      })
    }
  }
  return configs
})

// ==================== 微尘数据 ====================
const getDustStyle = (i: number) => ({
  '--size': `${1 + (i * 0.7) % 2.5}px`,
  '--hue': i % 2 === 0 ? '200' : '250',
})

const dustScatter = computed(() =>
  Array.from({ length: 20 }, () => {
    const a = Math.random() * Math.PI * 2
    const r = 60 + Math.random() * 200
    return { x: Math.cos(a) * r, y: Math.sin(a) * r }
  })
)

// ==================== 动画 ====================
onMounted(() => {
  if (!parentRef.value) return

  const ctx = gsap.context(() => {
    const validShards = shardRefs.value.filter(Boolean) as HTMLElement[]
    const validDust = dustRefs.value.filter(Boolean) as HTMLElement[]

    // ===== 碎片重组 =====
    if (validShards.length > 0) {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: parentRef.value, start: 'top 85%', end: 'bottom 30%', scrub: 1.5 },
      })
      cleanupFns.push({ revert: () => tl.kill() })

      tl.fromTo(validShards, {
        x: (i) => shardData.value[i]?.scatterX ?? 0,
        y: (i) => shardData.value[i]?.scatterY ?? 0,
        rotate: (i) => shardData.value[i]?.scatterRotate ?? 0,
        scale: (i) => shardData.value[i]?.scatterScale ?? 0.4,
        opacity: (i) => shardData.value[i]?.scatterOpacity ?? 0.2,
      }, {
        x: 0, y: 0, rotate: 0, scale: 1, opacity: 1,
        stagger: { each: 0.025, from: 'random' },
        ease: 'expo.out',
        duration: 1.2,
      }, 0)
    }

    // ===== 微尘回聚 =====
    if (validDust.length > 0) {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: parentRef.value, start: 'top 85%', end: 'bottom 30%', scrub: 1.5 },
      })
      cleanupFns.push({ revert: () => tl.kill() })

      tl.fromTo(validDust, {
        x: (i) => dustScatter.value[i]?.x ?? 0,
        y: (i) => dustScatter.value[i]?.y ?? 0,
        opacity: 0, scale: 0,
      }, {
        x: 0, y: 0, opacity: 1, scale: 1,
        stagger: { each: 0.015, from: 'random' },
        ease: 'power3.out',
        duration: 1,
      }, 0.08)
    }

    // ===== 中心光晕 =====
    if (glowRef.value) {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: parentRef.value, start: 'top 85%', end: 'top 40%', scrub: 1.5 },
      })
      cleanupFns.push({ revert: () => tl.kill() })
      tl.fromTo(glowRef.value, { opacity: 0, scale: 0.5 }, { opacity: 0.4, scale: 1, ease: 'power3.out' }, 0)
    }

    // ===== 文字入场 =====
    if (contentRef.value) {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: parentRef.value, start: 'top 75%', end: 'top 25%', scrub: 1 },
      })
      cleanupFns.push({ revert: () => tl.kill() })
      tl.fromTo(contentRef.value,  { opacity: 0, y: 50 },                  { opacity: 1, y: 0,     ease: 'power3.out' }, 0.2)
      if (titleRef.value)
        tl.fromTo(titleRef.value,    { opacity: 0, y: 30, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', ease: 'expo.out' }, 0.25)
      if (dividerRef.value)
        tl.fromTo(dividerRef.value,  { scaleX: 0, opacity: 0 },             { scaleX: 1, opacity: 1, ease: 'power3.out' }, 0.3)
      if (subtitleRef.value)
        tl.fromTo(subtitleRef.value, { opacity: 0, y: 15 },                 { opacity: 1, y: 0,     ease: 'power3.out' }, 0.35)
    }
  }, parentRef.value)
})

// ==================== 清理 ====================
onUnmounted(() => {
  cleanupFns.forEach(fn => fn.revert?.())
  ScrollTrigger.getAll().forEach(st => { if (st.vars.trigger === parentRef.value) st.kill() })
})
</script>

<style scoped lang="scss">
// ==================== 容器 ====================
.card-image-glass-shatter {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: radial-gradient(ellipse at 50% 50%, #0a1030 0%, #060c20 35%, #030618 65%, #010310 100%);
}

// ==================== 碎片舞台（共享背景图，1次解码） ====================
.shards-stage {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
}

// ==================== 碎片（单元素，伪元素完成玻璃+边缘） ====================
.shard {
  position: absolute;
  inset: 0;
  // 继承舞台背景图 — 同样是 1 次图片解码
  background: inherit;
  background-size: cover;
  background-position: center;
  transform-origin: center center;
  // 玻璃渐变覆层
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg,
      rgba(140,200,255,.18) 0%,
      rgba(100,160,255,.06) 30%,
      rgba(200,140,255,.12) 60%,
      rgba(80,120,220,.04) 100%
    );
    mix-blend-mode: overlay;
    pointer-events: none;
  }
  // 边缘高光线
  &::after {
    content: '';
    position: absolute;
    inset: -1px;
    border: 1px solid var(--edge-color, rgba(120,200,255,.7));
    border-radius: 1px;
    box-shadow: inset 0 0 3px rgba(180,220,255,.25), 0 0 2px rgba(120,200,255,.2);
    pointer-events: none;
  }
}

// ==================== 微尘层 ====================
.dust-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.dust-particle {
  position: absolute;
  left: 50%;
  top: 50%;
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  background: hsl(var(--hue), 80%, 75%);
  box-shadow: 0 0 calc(var(--size) * 2) hsl(var(--hue), 90%, 60%),
              0 0 calc(var(--size) * 4) hsl(var(--hue), 70%, 55%);
}

// ==================== 中心光晕 ====================
.center-glow {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 60vw;
  height: 60vh;
  transform: translate(-50%, -50%);
  background: radial-gradient(ellipse at 50% 50%,
    rgba(100,180,255,.12) 0%,
    rgba(130,100,255,.06) 30%,
    rgba(60,140,220,.02) 55%,
    transparent 75%
  );
  pointer-events: none;
  filter: blur(40px);
  opacity: 0;
}

// ==================== 内容覆盖层 ====================
.content-layer {
  position: absolute;
  bottom: 12%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  text-align: center;
  pointer-events: none;

  .title {
    font-size: clamp(2rem, 5vw, 4.2rem);
    font-weight: 800;
    letter-spacing: .04em;
    color: #fff;
    text-shadow: 0 0 30px rgba(100,200,255,.6),
                 0 0 60px rgba(130,100,255,.4),
                 0 0 100px rgba(80,150,255,.3);
    margin: 0 0 16px;
    line-height: 1.2;
  }

  .divider {
    width: 80px;
    height: 3px;
    margin: 0 auto 16px;
    background: linear-gradient(90deg,
      rgba(100,200,255,.4),
      rgba(160,130,255,.8),
      rgba(100,200,255,.4)
    );
    border-radius: 2px;
    transform-origin: center;
  }

  .subtitle {
    font-size: clamp(.9rem, 1.6vw, 1.3rem);
    font-weight: 400;
    letter-spacing: .08em;
    text-transform: uppercase;
    color: rgba(180,220,255,.85);
    text-shadow: 0 0 20px rgba(100,180,255,.5);
    margin: 0;
  }
}
</style>
