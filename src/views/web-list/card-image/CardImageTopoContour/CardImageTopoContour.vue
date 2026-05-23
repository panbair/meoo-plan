<template>
  <section ref="sectionRef" class="topo-section">
    <!-- 测绘图深色背景 -->
    <div class="topo-bg">
      <div class="topo-grad"></div>
      <div class="compass-rose">
        <svg viewBox="0 0 80 80" class="compass-svg">
          <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(150,165,180,0.18)" stroke-width="0.8" />
          <circle cx="40" cy="40" r="26" fill="none" stroke="rgba(150,165,180,0.12)" stroke-width="0.5" />
          <polygon points="40,8 44,36 40,40 36,36" fill="rgba(200,60,50,0.55)" />
          <polygon points="40,72 36,44 40,40 44,44" fill="rgba(200,60,50,0.25)" />
          <polygon points="8,40 36,36 40,40 36,44" fill="rgba(180,190,200,0.35)" />
          <polygon points="72,40 44,36 40,40 44,44" fill="rgba(180,190,200,0.2)" />
          <text x="40" y="80" text-anchor="middle" font-size="6" fill="rgba(150,165,180,0.35)" font-family="serif">N</text>
        </svg>
      </div>
    </div>

    <!-- SVG 等高线舞台 -->
    <div class="topo-stage">
      <!-- 鬼影参考底图 -->
      <img ref="ghostRef" :src="imageUrl" alt="" class="ghost-image" />

      <!-- 等高线填充 SVG -->
      <svg
        ref="contourSvgRef"
        class="contour-svg"
        :viewBox="`0 0 ${GRID} ${GRID}`"
        preserveAspectRatio="xMidYMid slice"
      >
        <!-- 最高层先渲染（面积最小），最低层后渲染（面积最大，覆盖） -->
        <g
          v-for="(level, li) in orderedLevels"
          :key="li"
          :class="['contour-fill-group', `level-${li}`]"
        >
          <path
            v-for="(pathStr, pi) in level.paths"
            :key="pi"
            :d="pathStr"
            :fill="level.color"
            fill-rule="evenodd"
            stroke="none"
          />
          <!-- 等高线描边 -->
          <path
            v-for="(pathStr, pi) in level.paths"
            :key="'stroke'+pi"
            :d="pathStr"
            fill="none"
            :stroke="level.strokeColor"
            stroke-width="0.15"
            opacity="0.5"
          />
        </g>
      </svg>

      <!-- 参考网格线 -->
      <div class="topo-grid">
        <span v-for="n in 6" :key="'h'+n" class="grid-line grid-h" :style="{ top: `${n * 16.66}%` }" />
        <span v-for="n in 6" :key="'v'+n" class="grid-line grid-v" :style="{ left: `${n * 16.66}%` }" />
      </div>
    </div>

    <!-- 原图揭示层 -->
    <img ref="revealRef" :src="imageUrl" alt="" class="reveal-image" />

    <!-- 海拔图例 -->
    <div ref="legendRef" class="elevation-legend">
      <div class="legend-bar">
        <span
          v-for="(lc, li) in legendColors"
          :key="li"
          class="legend-swatch"
          :style="{ background: lc }"
        />
      </div>
      <div class="legend-labels">
        <span class="legend-label">0m</span>
        <span class="legend-label">{{ GRID * 10 }}m</span>
      </div>
    </div>

    <!-- 文字覆盖层 -->
    <div ref="contentRef" class="content-overlay">
      <h2 class="title">Topographic</h2>
      <p class="subtitle">Elevation Contour Map</p>
      <div class="divider"></div>
      <p class="desc">地形测绘 · 等高线层叠 · 12级海拔色带</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []

const imageUrl = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80'

// ==================== Refs ====================
const sectionRef    = ref<HTMLElement | null>(null)
const ghostRef      = ref<HTMLImageElement | null>(null)
const contourSvgRef = ref<SVGSVGElement | null>(null)
const revealRef     = ref<HTMLImageElement | null>(null)
const legendRef     = ref<HTMLElement | null>(null)
const contentRef    = ref<HTMLElement | null>(null)

// ==================== 参数 ====================
const GRID = 60 // 降采样网格 (60×60)

// ==================== 12 级海拔色带 ====================
interface ContourLevelData {
  threshold: number
  color: string
  strokeColor: string
  paths: string[]
}

const ELEVATION_COLORS = [
  { color: '#001a33', stroke: '#003366' }, // 0: 深海
  { color: '#003d66', stroke: '#005588' }, // 1: 深蓝
  { color: '#00527a', stroke: '#0077aa' }, // 2: 海洋蓝
  { color: '#006b8f', stroke: '#0099bb' }, // 3: 浅海蓝
  { color: '#008c4a', stroke: '#00aa55' }, // 4: 低地绿
  { color: '#33aa00', stroke: '#55cc22' }, // 5: 草地绿
  { color: '#99cc00', stroke: '#bbdd33' }, // 6: 黄绿
  { color: '#e6cc00', stroke: '#ffdd00' }, // 7: 黄土
  { color: '#ffaa00', stroke: '#ffbb33' }, // 8: 山脊橙
  { color: '#ff6600', stroke: '#ff8833' }, // 9: 火橙
  { color: '#e63946', stroke: '#ff5555' }, // 10: 岩红
  { color: '#f0ede5', stroke: '#ffffff' }, // 11: 雪峰白
]

const legendColors = ELEVATION_COLORS.map(c => c.color)

// 生成的数据
const orderedLevels = ref<ContourLevelData[]>([])
const THRESHOLDS = ELEVATION_COLORS.map((_, i) => Math.round((i + 1) * 255 / 12))

// ==================== 降采样 + 亮度提取 ====================
async function sampleBrightness(): Promise<number[][]> {
  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.src = imageUrl
  try { await img.decode() } catch { return [] }

  const offscreen = document.createElement('canvas')
  offscreen.width = GRID
  offscreen.height = GRID
  const ctx = offscreen.getContext('2d')!
  ctx.drawImage(img, 0, 0, GRID, GRID)
  const data = ctx.getImageData(0, 0, GRID, GRID).data

  const grid: number[][] = []
  for (let y = 0; y < GRID; y++) {
    const row: number[] = []
    for (let x = 0; x < GRID; x++) {
      const i = (y * GRID + x) * 4
      const bri = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
      row.push(bri)
    }
    grid.push(row)
  }
  return grid
}

// ==================== Marching Squares ====================
interface Pt { x: number; y: number }
interface Segment { x1: number; y1: number; x2: number; y2: number }

function padGrid(grid: number[][]): number[][] {
  const rows = grid.length
  const cols = grid[0].length
  const padded: number[][] = []
  padded.push(new Array(cols + 2).fill(0))
  for (let y = 0; y < rows; y++) {
    const row = [0, ...grid[y], 0]
    padded.push(row)
  }
  padded.push(new Array(cols + 2).fill(0))
  return padded
}

function marchingSquaresSegments(
  grid: number[][],
  threshold: number,
): Segment[] {
  const rows = grid.length
  const cols = grid[0].length
  const segments: Segment[] = []

  for (let y = 0; y < rows - 1; y++) {
    for (let x = 0; x < cols - 1; x++) {
      const v = [
        grid[y][x],         // top-left
        grid[y][x + 1],     // top-right
        grid[y + 1][x + 1], // bottom-right
        grid[y + 1][x],     // bottom-left
      ]
      const cp: Pt[] = [{ x, y }, { x: x + 1, y }, { x: x + 1, y: y + 1 }, { x, y: y + 1 }]

      const caseIdx =
        (v[0] >= threshold ? 1 : 0) |
        (v[1] >= threshold ? 2 : 0) |
        (v[2] >= threshold ? 4 : 0) |
        (v[3] >= threshold ? 8 : 0)

      if (caseIdx === 0 || caseIdx === 15) continue

      // 查找四条边的交点
      const pts: Pt[] = []
      for (let e = 0; e < 4; e++) {
        const a = e, b = (e + 1) % 4
        if ((v[a] >= threshold) !== (v[b] >= threshold)) {
          const t = (threshold - v[a]) / (v[b] - v[a])
          pts.push({
            x: cp[a].x + t * (cp[b].x - cp[a].x),
            y: cp[a].y + t * (cp[b].y - cp[a].y),
          })
        }
      }

      if (pts.length === 2) {
        segments.push({ x1: pts[0].x, y1: pts[0].y, x2: pts[1].x, y2: pts[1].y })
      } else if (pts.length === 4) {
        // 鞍点：case 5 (0101) 水平连接, case 10 (1010) 垂直连接
        if (caseIdx === 5) {
          segments.push({ x1: pts[0].x, y1: pts[0].y, x2: pts[1].x, y2: pts[1].y })
          segments.push({ x1: pts[2].x, y1: pts[2].y, x2: pts[3].x, y2: pts[3].y })
        } else {
          segments.push({ x1: pts[0].x, y1: pts[0].y, x2: pts[3].x, y2: pts[3].y })
          segments.push({ x1: pts[1].x, y1: pts[1].y, x2: pts[2].x, y2: pts[2].y })
        }
      }
    }
  }
  return segments
}

/** 将线段追踪为连续路径 */
function tracePaths(segments: Segment[]): string[] {
  if (segments.length === 0) return []

  // 点位 → 线段索引映射
  const ptToSegs = new Map<string, number[]>()
  const key = (x: number, y: number) => `${x.toFixed(4)},${y.toFixed(4)}`

  segments.forEach((s, i) => {
    const k1 = key(s.x1, s.y1), k2 = key(s.x2, s.y2)
    if (!ptToSegs.has(k1)) ptToSegs.set(k1, [])
    if (!ptToSegs.has(k2)) ptToSegs.set(k2, [])
    ptToSegs.get(k1)!.push(i)
    ptToSegs.get(k2)!.push(i)
  })

  const used = new Set<number>()
  const paths: string[] = []

  for (let i = 0; i < segments.length; i++) {
    if (used.has(i)) continue

    const points: Pt[] = []
    let seg = segments[i]
    points.push({ x: seg.x1, y: seg.y1 })
    points.push({ x: seg.x2, y: seg.y2 })
    used.add(i)

    let currentKey = key(seg.x2, seg.y2)
    let found = true
    while (found) {
      found = false
      const connected = ptToSegs.get(currentKey) || []
      for (const si of connected) {
        if (used.has(si)) continue
        const s = segments[si]
        const sk1 = key(s.x1, s.y1), sk2 = key(s.x2, s.y2)
        let next: Pt
        if (sk1 === currentKey) {
          next = { x: s.x2, y: s.y2 }
          currentKey = sk2
        } else {
          next = { x: s.x1, y: s.y1 }
          currentKey = sk1
        }
        used.add(si)
        points.push(next)
        found = true
        break
      }
    }

    if (points.length >= 3) {
      let d = `M ${points[0].x} ${points[0].y}`
      for (let p = 1; p < points.length; p++) {
        const dx = points[p].x - points[p - 1].x
        const dy = points[p].y - points[p - 1].y
        d += ` l ${dx} ${dy}`
      }
      d += ' Z'
      paths.push(d)
    }
  }
  return paths
}

/** 生成所有 12 级等高线 */
function generateAllLevels(brightnessGrid: number[][]): ContourLevelData[] {
  const padded = padGrid(brightnessGrid)
  const levels: ContourLevelData[] = []

  for (let i = 0; i < 12; i++) {
    const threshold = THRESHOLDS[i]
    const segs = marchingSquaresSegments(padded, threshold)
    // 偏移回原始坐标（padded 多了 1px 边距）
    const adjustedSegs = segs.map(s => ({
      x1: s.x1 - 1, y1: s.y1 - 1, x2: s.x2 - 1, y2: s.y2 - 1,
    }))
    const paths = tracePaths(adjustedSegs)
    levels.push({
      threshold,
      color: ELEVATION_COLORS[i].color,
      strokeColor: ELEVATION_COLORS[i].strokeColor,
      paths,
    })
  }
  return levels
}

// ==================== 挂载 ====================
onMounted(async () => {
  if (!sectionRef.value) return

  // 生成等高线数据
  const brigGrid = await sampleBrightness()
  const levels = generateAllLevels(brigGrid)
  // 反转：最高层先渲染（小面积），最低层后渲染（大面积覆盖）
  orderedLevels.value = [...levels].reverse()

  // 等待 DOM 更新
  await new Promise(r => requestAnimationFrame(r))

  // ========== 逐层渐显（level-0 最先 → level-11 最后） ==========
  // .contour-fill-group 按渲染顺序排列（level 11→0），按动画顺序渐显（level 0→11）
  const groups = contourSvgRef.value?.querySelectorAll('.contour-fill-group')
  if (groups) {
    gsap.set(groups, { opacity: 0 })
    const revealSt = ScrollTrigger.create({
      trigger: sectionRef.value,
      start: 'top 75%',
      end: 'bottom 30%',
      scrub: 1.3,
      onUpdate(self) {
        const p = self.progress
        // 反向遍历：groups 是 11→0，进度 0% 应显示 level-11(索引0)，进度 100% 显示全部
        groups.forEach((g, i) => {
          const idx = 11 - i // 映射到实际 level 编号
          const startP = idx / 12
          const endP = (idx + 1.5) / 12
          const localP = Math.max(0, Math.min(1, (p - startP) / (endP - startP)))
          ;(g as HTMLElement).style.opacity = String(localP)
        })
      },
    })
    cleanupFns.push(() => revealSt.kill())
  }

  // ========== 鬼影底图淡出 ==========
  if (ghostRef.value) gsap.set(ghostRef.value, { opacity: 0.22 })
  if (ghostRef.value) {
    const ghostSt = ScrollTrigger.create({
      trigger: sectionRef.value,
      start: 'top 75%',
      end: 'top 38%',
      scrub: 1.5,
      onUpdate(self) {
        if (ghostRef.value) ghostRef.value.style.opacity = String(0.22 * (1 - self.progress))
      },
    })
    cleanupFns.push(() => ghostSt.kill())
  }

  // ========== 原图揭示 ==========
  if (revealRef.value) gsap.set(revealRef.value, { opacity: 0 })
  if (revealRef.value) {
    const revTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 52%',
        end: 'top 18%',
        scrub: 1.0,
      },
    })
    revTl.to(revealRef.value, { opacity: 1, duration: 0.8, ease: 'power2.in' })
    cleanupFns.push(() => { revTl.scrollTrigger?.kill(); revTl.kill() })
  }

  // ========== 图例渐显 ==========
  if (legendRef.value) gsap.set(legendRef.value, { opacity: 0, y: 10 })
  if (legendRef.value) {
    const legTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 64%',
        end: 'top 30%',
        scrub: 0.8,
      },
    })
    legTl.to(legendRef.value, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
    cleanupFns.push(() => { legTl.scrollTrigger?.kill(); legTl.kill() })
  }

  // ========== 文字渐显 ==========
  if (contentRef.value) gsap.set(contentRef.value, { opacity: 0, y: 20 })
  if (contentRef.value) {
    const textTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 58%',
        end: 'top 22%',
        scrub: 1.0,
      },
    })
    textTl.to(contentRef.value, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' })
    cleanupFns.push(() => { textTl.scrollTrigger?.kill(); textTl.kill() })
  }
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
})
</script>

<style lang="scss" scoped>
/* ==================== 容器 ==================== */
.topo-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #0a0d12;
}

/* ==================== 测绘图背景 ==================== */
.topo-bg {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.topo-grad {
  width: 100%;
  height: 100%;
  background:
    radial-gradient(ellipse 55% 45% at 50% 50%, rgba(15, 20, 35, 0.7) 0%, transparent 55%),
    linear-gradient(180deg, #0a0d14 0%, #0d1018 50%, #0c0f15 100%);
}

/* 指北针 */
.compass-rose {
  position: absolute;
  top: 5%;
  right: 8%;
  width: clamp(50px, 8vmin, 80px);
  height: clamp(50px, 8vmin, 80px);
  opacity: 0.6;
}

.compass-svg {
  width: 100%;
  height: 100%;
}

/* ==================== 等高线舞台 ==================== */
.topo-stage {
  position: absolute;
  top: 50%;
  left: 50%;
  width: min(72vmin, 700px);
  height: min(72vmin, 700px);
  transform: translate(-50%, -50%);
  z-index: 3;
  background: #0c0f16;
  box-shadow: 0 0 0 1px rgba(40, 50, 70, 0.3), 0 4px 30px rgba(0, 0, 0, 0.5);
}

/* 鬼影底图 */
.ghost-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.22;
  filter: brightness(0.5) saturate(0.4);
  z-index: 1;
  pointer-events: none;
}

/* SVG 等高线层 */
.contour-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}

/* 参考网格 */
.topo-grid {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
}

.grid-line {
  position: absolute;
  background: rgba(60, 80, 110, 0.12);
  pointer-events: none;

  &.grid-h {
    left: 0;
    right: 0;
    height: 0.5px;
  }

  &.grid-v {
    top: 0;
    bottom: 0;
    width: 0.5px;
  }
}

/* ==================== 原图揭示 ==================== */
.reveal-image {
  position: absolute;
  top: 50%;
  left: 50%;
  width: min(72vmin, 700px);
  height: min(72vmin, 700px);
  transform: translate(-50%, -50%);
  object-fit: cover;
  z-index: 12;
  opacity: 0;
  will-change: opacity;
}

/* ==================== 海拔图例 ==================== */
.elevation-legend {
  position: absolute;
  left: 6%;
  bottom: 8%;
  z-index: 15;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.legend-bar {
  display: flex;
  width: clamp(100px, 16vmin, 160px);
  height: 10px;
  border-radius: 2px;
  overflow: hidden;
  box-shadow: 0 0 0 1px rgba(60, 70, 90, 0.3);
}

.legend-swatch {
  flex: 1;
  height: 100%;
}

.legend-labels {
  display: flex;
  justify-content: space-between;
  width: clamp(100px, 16vmin, 160px);
}

.legend-label {
  font-family: 'Georgia', 'Times New Roman', serif;
  font-size: 0.6rem;
  color: rgba(140, 155, 175, 0.45);
  letter-spacing: 0.05em;
}

/* ==================== 文字覆盖层 ==================== */
.content-overlay {
  position: absolute;
  right: 7%;
  bottom: 9%;
  z-index: 20;
  text-align: right;
  pointer-events: none;
}

.title {
  font-family: 'Georgia', 'Times New Roman', serif;
  font-size: clamp(2rem, 4.8vw, 3.6rem);
  font-weight: 700;
  letter-spacing: 0.06em;
  color: #c8d0d8;
  margin: 0;
  text-shadow:
    0 0 30px rgba(100, 140, 180, 0.2),
    0 2px 4px rgba(0, 0, 0, 0.6);
  line-height: 1.1;
}

.subtitle {
  font-family: 'Georgia', 'Times New Roman', serif;
  font-size: clamp(0.78rem, 1.5vw, 1.1rem);
  font-style: italic;
  color: #8898a8;
  margin: 5px 0 0;
  letter-spacing: 0.04em;
}

.divider {
  width: 100px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(100, 130, 160, 0.25), rgba(80, 100, 130, 0.1));
  margin: 10px 0 10px auto;
}

.desc {
  font-family: 'Georgia', 'Times New Roman', 'SimSun', serif;
  font-size: clamp(0.68rem, 1.1vw, 0.85rem);
  color: #6e7888;
  margin: 0;
  letter-spacing: 0.03em;
  line-height: 1.6;
}
</style>
