<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'

// ==================== 配置 ====================
const COLS = 52 // weeks
const ROWS = 7  // days
const CELL_W = 14
const CELL_H = 14
const CELL_GAP = 3
const ISO_ANGLE = 0.5 // isometric tilt
const MAX_HEIGHT = 40

const categories = [
  { id: 'code', label: '代码提交', color: '#3b82f6' },
  { id: 'train', label: '模型训练', color: '#10b981' },
  { id: 'deploy', label: '部署上线', color: '#f59e0b' },
  { id: 'bugfix', label: 'Bug修复', color: '#ef4444' },
]

interface CellData {
  week: number
  day: number
  date: string
  total: number
  breakdown: Record<string, number>
  height: number
  targetHeight: number
  color: string
  opacity: number
  highlighted: boolean
}

// ==================== 生成模拟数据 ====================
function generateData(): CellData[] {
  const cells: CellData[] = []
  const startDate = new Date(2025, 0, 1)

  for (let w = 0; w < COLS; w++) {
    for (let d = 0; d < ROWS; d++) {
      const date = new Date(startDate.getTime() + (w * 7 + d) * 86400000)
      const isWeekend = d >= 5
      const baseActivity = isWeekend ? 2 : 8
      const seasonBoost = Math.sin((w / COLS) * Math.PI * 2) * 3
      const randomFactor = Math.random()

      const breakdown: Record<string, number> = {}
      let total = 0
      categories.forEach(cat => {
        const val = Math.max(0, Math.round((baseActivity + seasonBoost) * randomFactor * (0.3 + Math.random() * 0.7)))
        breakdown[cat.id] = val
        total += val
      })

      const maxPossible = 60
      const intensity = Math.min(total / maxPossible, 1)

      cells.push({
        week: w,
        day: d,
        date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
        total,
        breakdown,
        height: 0,
        targetHeight: intensity * MAX_HEIGHT,
        color: intensityColor(intensity),
        opacity: 0,
        highlighted: false,
      })
    }
  }
  return cells
}

function intensityColor(t: number): string {
  if (t < 0.1) return '#0f172a'
  if (t < 0.25) return '#1e3a5f'
  if (t < 0.5) return '#1d4ed8'
  if (t < 0.75) return '#3b82f6'
  return '#60a5fa'
}

// ==================== 状态 ====================
const containerRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const cells = reactive<CellData[]>(generateData())
const hoveredCell = ref<CellData | null>(null)
const tooltip = reactive({ show: false, x: 0, y: 0 })
const activeCategory = ref<string | null>(null)
const viewMode = ref<'year' | 'half'>('year')
const waveActive = ref(false)

let ctx: CanvasRenderingContext2D | null = null
let canvasW = 0
let canvasH = 0
let animFrame = 0
let offsetX = 0
let offsetY = 0

// ==================== 等轴测投影 ====================
function isoProject(col: number, row: number, h: number): { x: number; y: number } {
  const cw = CELL_W + CELL_GAP
  const ch = CELL_H + CELL_GAP
  const x = offsetX + (col - row) * cw * 0.6
  const y = offsetY + (col + row) * ch * ISO_ANGLE - h
  return { x, y }
}

// ==================== 渲染 ====================
function render() {
  if (!ctx) return
  ctx.clearRect(0, 0, canvasW, canvasH)

  // Background
  ctx.fillStyle = '#0b1120'
  ctx.fillRect(0, 0, canvasW, canvasH)

  // Sort cells for painter's algorithm (back to front)
  const sorted = [...cells].sort((a, b) => {
    const sa = a.week + a.day
    const sb = b.week + b.day
    return sa - sb
  })

  sorted.forEach(cell => {
    if (cell.opacity <= 0) return
    const { x, y } = isoProject(cell.week, cell.day, cell.height)
    const w = CELL_W
    const h = cell.height
    const isHovered = hoveredCell.value === cell

    ctx!.save()
    ctx!.globalAlpha = cell.opacity

    // Determine color based on active category filter
    let fillColor = cell.color
    if (activeCategory.value) {
      const catVal = cell.breakdown[activeCategory.value] || 0
      const catIntensity = Math.min(catVal / 15, 1)
      const cat = categories.find(c => c.id === activeCategory.value)
      fillColor = cat ? cat.color : cell.color
      ctx!.globalAlpha = cell.opacity * (0.15 + catIntensity * 0.85)
    }

    if (cell.highlighted) {
      fillColor = '#60a5fa'
      ctx!.globalAlpha = 1
    }

    // Top face
    ctx!.fillStyle = isHovered ? '#93c5fd' : fillColor
    ctx!.beginPath()
    ctx!.moveTo(x, y)
    ctx!.lineTo(x + w * 0.6, y - w * ISO_ANGLE * 0.5)
    ctx!.lineTo(x + w * 1.2, y)
    ctx!.lineTo(x + w * 0.6, y + w * ISO_ANGLE * 0.5)
    ctx!.closePath()
    ctx!.fill()

    // Right face (darker)
    if (h > 1) {
      ctx!.fillStyle = isHovered ? '#3b82f6' : shadeColor(fillColor, -30)
      ctx!.beginPath()
      ctx!.moveTo(x + w * 1.2, y)
      ctx!.lineTo(x + w * 0.6, y + w * ISO_ANGLE * 0.5)
      ctx!.lineTo(x + w * 0.6, y + w * ISO_ANGLE * 0.5 + h * 0.3)
      ctx!.lineTo(x + w * 1.2, y + h * 0.3)
      ctx!.closePath()
      ctx!.fill()

      // Left face
      ctx!.fillStyle = isHovered ? '#2563eb' : shadeColor(fillColor, -50)
      ctx!.beginPath()
      ctx!.moveTo(x, y)
      ctx!.lineTo(x + w * 0.6, y + w * ISO_ANGLE * 0.5)
      ctx!.lineTo(x + w * 0.6, y + w * ISO_ANGLE * 0.5 + h * 0.3)
      ctx!.lineTo(x, y + h * 0.3)
      ctx!.closePath()
      ctx!.fill()
    }

    // Glow for high-activity cells
    if (cell.targetHeight > MAX_HEIGHT * 0.7 && !activeCategory.value) {
      ctx!.shadowColor = fillColor
      ctx!.shadowBlur = 8
      ctx!.beginPath()
      ctx!.arc(x + w * 0.6, y, 2, 0, Math.PI * 2)
      ctx!.fillStyle = '#ffffff'
      ctx!.fill()
      ctx!.shadowBlur = 0
    }

    ctx!.restore()
  })

  // Month labels along bottom
  ctx!.save()
  ctx!.fillStyle = '#475569'
  ctx!.font = '11px "Microsoft YaHei", sans-serif'
  ctx!.textAlign = 'center'
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  months.forEach((m, i) => {
    const weekIdx = Math.floor((i / 12) * COLS)
    const { x, y } = isoProject(weekIdx, ROWS + 1, 0)
    ctx!.fillText(m, x + CELL_W * 0.6, y + 20)
  })
  ctx!.restore()

  // Day labels
  ctx!.save()
  ctx!.fillStyle = '#334155'
  ctx!.font = '10px "Microsoft YaHei", sans-serif'
  ctx!.textAlign = 'right'
  const days = ['一', '二', '三', '四', '五', '六', '日']
  days.forEach((d, i) => {
    const { x, y } = isoProject(-2, i, 0)
    ctx!.fillText(d, x, y + 4)
  })
  ctx!.restore()

  animFrame = requestAnimationFrame(render)
}

function shadeColor(color: string, percent: number): string {
  const num = parseInt(color.replace('#', ''), 16)
  const r = Math.min(255, Math.max(0, (num >> 16) + percent))
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + percent))
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + percent))
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

// ==================== 交互 ====================
function handleMouseMove(e: MouseEvent) {
  if (!canvasRef.value) return
  const rect = canvasRef.value.getBoundingClientRect()
  const mx = e.clientX - rect.left
  const my = e.clientY - rect.top

  // Find closest cell using projected positions
  let closest: CellData | null = null
  let minDist = 20

  cells.forEach(cell => {
    const { x, y } = isoProject(cell.week, cell.day, cell.height)
    const cx = x + CELL_W * 0.6
    const cy = y
    const dist = Math.sqrt((mx - cx) ** 2 + (my - cy) ** 2)
    if (dist < minDist) {
      minDist = dist
      closest = cell
    }
  })

  hoveredCell.value = closest
  if (closest) {
    tooltip.show = true
    tooltip.x = e.clientX
    tooltip.y = e.clientY
  } else {
    tooltip.show = false
  }
}

function filterCategory(id: string | null) {
  activeCategory.value = activeCategory.value === id ? null : id
}

function startWave() {
  if (waveActive.value) return
  waveActive.value = true
  cells.forEach(cell => { cell.highlighted = false })

  let waveCol = 0
  const interval = setInterval(() => {
    cells.forEach(c => { if (c.week === waveCol) c.highlighted = true })
    if (waveCol > 2) cells.forEach(c => { if (c.week === waveCol - 3) c.highlighted = false })
    waveCol++
    if (waveCol > COLS + 3) {
      clearInterval(interval)
      cells.forEach(c => { c.highlighted = false })
      waveActive.value = false
    }
  }, 40)
}

// ==================== 初始化 ====================
function initScene() {
  if (!canvasRef.value || !containerRef.value) return
  const dpr = window.devicePixelRatio || 1
  canvasW = containerRef.value.clientWidth
  canvasH = containerRef.value.clientHeight
  canvasRef.value.width = canvasW * dpr
  canvasRef.value.height = canvasH * dpr
  canvasRef.value.style.width = canvasW + 'px'
  canvasRef.value.style.height = canvasH + 'px'
  ctx = canvasRef.value.getContext('2d')
  if (ctx) ctx.scale(dpr, dpr)

  offsetX = canvasW * 0.12
  offsetY = canvasH * 0.35

  // Entrance animation: cells rise up
  cells.forEach((cell, i) => {
    const delay = (cell.week * 0.015) + (cell.day * 0.02)
    gsap.to(cell, { opacity: 1, duration: 0.4, delay, ease: 'power2.out' })
    gsap.to(cell, { height: cell.targetHeight, duration: 0.6, delay: delay + 0.1, ease: 'back.out(1.5)' })
  })

  render()
}

function handleResize() {
  cancelAnimationFrame(animFrame)
  initScene()
}

onMounted(() => {
  initScene()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  cancelAnimationFrame(animFrame)
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div class="timeline-river" ref="containerRef">
    <div class="title-bar">
      <h2>🌊 时间河流活动图</h2>
      <p>2025年 AI 研发团队活动可视化 · {{ cells.reduce((s, c) => s + c.total, 0).toLocaleString() }} 次活动</p>
    </div>

    <canvas
      ref="canvasRef"
      @mousemove="handleMouseMove"
      @mouseleave="tooltip.show = false; hoveredCell = null"
    />

    <!-- Tooltip -->
    <div v-if="tooltip.show && hoveredCell" class="tooltip" :style="{ left: tooltip.x + 16 + 'px', top: tooltip.y - 10 + 'px' }">
      <div class="tt-date">📅 {{ hoveredCell.date }}</div>
      <div class="tt-total">活动总计: {{ hoveredCell.total }}</div>
      <div class="tt-breakdown">
        <div v-for="cat in categories" :key="cat.id" class="tt-cat">
          <span class="tt-dot" :style="{ background: cat.color }"></span>
          {{ cat.label }}: {{ hoveredCell.breakdown[cat.id] || 0 }}
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="controls">
      <div class="cat-filters">
        <button
          v-for="cat in categories"
          :key="cat.id"
          class="cat-btn"
          :class="{ active: activeCategory === cat.id }"
          :style="{ '--cat-color': cat.color } as any"
          @click="filterCategory(cat.id)"
        >
          <span class="cat-dot" :style="{ background: cat.color }"></span>
          {{ cat.label }}
        </button>
      </div>
      <button class="wave-btn" :disabled="waveActive" @click="startWave">
        🌊 {{ waveActive ? '播放中...' : '波纹扫描' }}
      </button>
    </div>

    <!-- Color scale -->
    <div class="scale">
      <span>低</span>
      <div class="scale-bar">
        <div class="scale-block" style="background:#0f172a"></div>
        <div class="scale-block" style="background:#1e3a5f"></div>
        <div class="scale-block" style="background:#1d4ed8"></div>
        <div class="scale-block" style="background:#3b82f6"></div>
        <div class="scale-block" style="background:#60a5fa"></div>
      </div>
      <span>高</span>
    </div>
  </div>
</template>

<style scoped>
.timeline-river {
  width: 100vw;
  height: 100vh;
  background: #0b1120;
  position: relative;
  overflow: hidden;
  font-family: 'Microsoft YaHei', sans-serif;
}

canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.title-bar {
  position: absolute;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 10;
  pointer-events: none;
}
.title-bar h2 { color: #e2e8f0; font-size: 22px; margin: 0; }
.title-bar p { color: #64748b; font-size: 13px; margin: 6px 0 0; }

.tooltip {
  position: fixed;
  z-index: 100;
  background: rgba(15, 23, 42, 0.95);
  border: 1px solid #334155;
  border-radius: 8px;
  padding: 12px 16px;
  pointer-events: none;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  min-width: 160px;
}
.tt-date { color: #e2e8f0; font-size: 14px; font-weight: bold; margin-bottom: 6px; }
.tt-total { color: #3b82f6; font-size: 13px; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px solid #1e293b; }
.tt-cat { display: flex; align-items: center; gap: 6px; color: #94a3b8; font-size: 12px; margin: 3px 0; }
.tt-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

.controls {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 16px;
}
.cat-filters { display: flex; gap: 8px; }
.cat-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #1e293b;
  border: 1px solid #334155;
  color: #94a3b8;
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}
.cat-btn:hover { background: #334155; color: #e2e8f0; }
.cat-btn.active { border-color: var(--cat-color); color: #e2e8f0; background: rgba(59, 130, 246, 0.15); }
.cat-dot { width: 8px; height: 8px; border-radius: 50%; }

.wave-btn {
  background: #1e293b;
  border: 1px solid #334155;
  color: #94a3b8;
  padding: 6px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}
.wave-btn:hover:not(:disabled) { background: #334155; color: #e2e8f0; }
.wave-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.scale {
  position: absolute;
  bottom: 24px;
  right: 24px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #475569;
  font-size: 11px;
  z-index: 10;
}
.scale-bar { display: flex; gap: 2px; }
.scale-block { width: 14px; height: 14px; border-radius: 2px; }
</style>

