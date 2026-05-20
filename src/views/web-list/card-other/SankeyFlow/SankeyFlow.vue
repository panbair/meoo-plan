<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import { gsap } from 'gsap'

// ==================== 类型定义 ====================
interface SankeyNode {
  id: string
  label: string
  column: number
  value: number
  color: string
  x: number
  y: number
  w: number
  h: number
  opacity: number
  scale: number
}

interface SankeyLink {
  source: string
  target: string
  value: number
  color: string
  opacity: number
  progress: number
}

interface Particle {
  linkIndex: number
  t: number
  speed: number
  size: number
  alpha: number
}

// ==================== 数据定义 ====================
const nodeData: Omit<SankeyNode, 'x' | 'y' | 'w' | 'h' | 'opacity' | 'scale'>[] = [
  // Column 0 - 数据源
  { id: 'users', label: '用户请求', column: 0, value: 1000, color: '#3b82f6' },
  { id: 'sensors', label: '传感器数据', column: 0, value: 600, color: '#06b6d4' },
  { id: 'database', label: '数据库', column: 0, value: 400, color: '#8b5cf6' },
  // Column 1 - 处理层
  { id: 'nlp', label: 'NLP处理', column: 1, value: 500, color: '#10b981' },
  { id: 'cv', label: '计算机视觉', column: 1, value: 450, color: '#f59e0b' },
  { id: 'ml', label: '机器学习', column: 1, value: 550, color: '#ef4444' },
  { id: 'bigdata', label: '大数据分析', column: 1, value: 500, color: '#ec4899' },
  // Column 2 - 输出
  { id: 'chatbot', label: '智能客服', column: 2, value: 350, color: '#14b8a6' },
  { id: 'analytics', label: '数据分析报告', column: 2, value: 400, color: '#a855f7' },
  { id: 'automation', label: '自动化办公', column: 2, value: 300, color: '#f97316' },
  { id: 'security', label: '安全监控', column: 2, value: 250, color: '#64748b' },
  { id: 'recommend', label: '智能推荐', column: 2, value: 350, color: '#06b6d4' },
  { id: 'predict', label: '预测引擎', column: 2, value: 350, color: '#84cc16' },
]

const linkData: Omit<SankeyLink, 'opacity' | 'progress'>[] = [
  { source: 'users', target: 'nlp', value: 350, color: '#3b82f6' },
  { source: 'users', target: 'cv', value: 200, color: '#3b82f6' },
  { source: 'users', target: 'ml', value: 250, color: '#3b82f6' },
  { source: 'users', target: 'bigdata', value: 200, color: '#3b82f6' },
  { source: 'sensors', target: 'cv', value: 250, color: '#06b6d4' },
  { source: 'sensors', target: 'ml', value: 200, color: '#06b6d4' },
  { source: 'sensors', target: 'bigdata', value: 150, color: '#06b6d4' },
  { source: 'database', target: 'nlp', value: 150, color: '#8b5cf6' },
  { source: 'database', target: 'bigdata', value: 150, color: '#8b5cf6' },
  { source: 'database', target: 'ml', value: 100, color: '#8b5cf6' },
  { source: 'nlp', target: 'chatbot', value: 300, color: '#10b981' },
  { source: 'nlp', target: 'analytics', value: 100, color: '#10b981' },
  { source: 'nlp', target: 'recommend', value: 100, color: '#10b981' },
  { source: 'cv', target: 'security', value: 200, color: '#f59e0b' },
  { source: 'cv', target: 'automation', value: 150, color: '#f59e0b' },
  { source: 'cv', target: 'analytics', value: 100, color: '#f59e0b' },
  { source: 'ml', target: 'predict', value: 250, color: '#ef4444' },
  { source: 'ml', target: 'recommend', value: 200, color: '#ef4444' },
  { source: 'ml', target: 'analytics', value: 100, color: '#ef4444' },
  { source: 'bigdata', target: 'analytics', value: 100, color: '#ec4899' },
  { source: 'bigdata', target: 'automation', value: 150, color: '#ec4899' },
  { source: 'bigdata', target: 'predict', value: 100, color: '#ec4899' },
  { source: 'bigdata', target: 'chatbot', value: 50, color: '#ec4899' },
  { source: 'bigdata', target: 'recommend', value: 50, color: '#ec4899' },
  { source: 'bigdata', target: 'security', value: 50, color: '#ec4899' },
]

// ==================== 状态 ====================
const containerRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const tooltipRef = ref<HTMLElement | null>(null)

const nodes = reactive<SankeyNode[]>([])
const links = reactive<SankeyLink[]>([])
const particles = reactive<Particle[]>([])

const hoveredNode = ref<string | null>(null)
const selectedNode = ref<string | null>(null)
const tooltip = reactive({ show: false, x: 0, y: 0, text: '', value: 0 })

let canvasW = 0
let canvasH = 0
let animFrame = 0
let ctx: CanvasRenderingContext2D | null = null

// ==================== 布局计算 ====================
function layoutNodes() {
  const padX = 120
  const padY = 60
  const nodeW = 160
  const colGap = (canvasW - padX * 2 - nodeW) / 2
  const columns: SankeyNode[][] = [[], [], []]

  nodes.forEach(n => columns[n.column].push(n))

  columns.forEach((col, ci) => {
    const totalVal = col.reduce((s, n) => s + n.value, 0)
    const usableH = canvasH - padY * 2
    const gap = 16
    const totalGap = gap * (col.length - 1)
    const scale = (usableH - totalGap) / totalVal
    let curY = padY

    col.forEach(node => {
      node.x = padX + ci * colGap
      node.w = nodeW
      node.h = Math.max(node.value * scale, 24)
      node.y = curY
      curY += node.h + gap
    })
  })
}

function getNodeById(id: string) {
  return nodes.find(n => n.id === id)
}

function bezierPoint(x0: number, y0: number, x1: number, y1: number, t: number) {
  const cx = (x0 + x1) / 2
  const ax = x0 + (cx - x0) * t * 3 * (1 - t) ** 2 + (cx + (x1 - cx)) * 3 * t ** 2 * (1 - t) + x1 * t ** 3
  // simplified cubic bezier
  const bx = x0 * (1 - t) ** 3 + cx * 3 * (1 - t) ** 2 * t + cx * 3 * (1 - t) * t ** 2 + x1 * t ** 3
  const by = y0 * (1 - t) ** 3 + y0 * 3 * (1 - t) ** 2 * t + y1 * 3 * (1 - t) * t ** 2 + y1 * t ** 3
  return { x: bx, y: by }
}

// ==================== 渲染 ====================
function drawLinks() {
  if (!ctx) return
  const maxVal = Math.max(...linkData.map(l => l.value))
  const activeNode = selectedNode.value || hoveredNode.value

  links.forEach((link, i) => {
    const src = getNodeById(link.source)
    const tgt = getNodeById(link.target)
    if (!src || !tgt) return

    const lineW = Math.max((link.value / maxVal) * 30, 3)
    const srcLinks = links.filter(l => l.source === link.source)
    const tgtLinks = links.filter(l => l.target === link.target)
    const srcIdx = srcLinks.indexOf(link)
    const tgtIdx = tgtLinks.indexOf(link)
    const srcOffsetTotal = srcLinks.reduce((s, l) => s + (l.value / maxVal) * 30, 0)
    const tgtOffsetTotal = tgtLinks.reduce((s, l) => s + (l.value / maxVal) * 30, 0)
    let srcOff = -srcOffsetTotal / 2
    for (let j = 0; j < srcIdx; j++) srcOff += (srcLinks[j].value / maxVal) * 30
    srcOff += lineW / 2
    let tgtOff = -tgtOffsetTotal / 2
    for (let j = 0; j < tgtIdx; j++) tgtOff += (tgtLinks[j].value / maxVal) * 30
    tgtOff += lineW / 2

    const x0 = src.x + src.w
    const y0 = src.y + src.h / 2 + srcOff
    const x1 = tgt.x
    const y1 = tgt.y + tgt.h / 2 + tgtOff

    const isActive = activeNode ? (link.source === activeNode || link.target === activeNode) : true
    const alpha = isActive ? 0.5 * link.opacity : 0.08 * link.opacity

    const grad = ctx!.createLinearGradient(x0, y0, x1, y1)
    const srcColor = src.color
    const tgtColor = tgt.color
    grad.addColorStop(0, srcColor)
    grad.addColorStop(1, tgtColor)

    ctx!.save()
    ctx!.globalAlpha = alpha * link.progress
    ctx!.strokeStyle = grad
    ctx!.lineWidth = lineW
    ctx!.lineCap = 'round'
    ctx!.beginPath()
    const cpx = (x0 + x1) / 2
    ctx!.moveTo(x0, y0)
    ctx!.bezierCurveTo(cpx, y0, cpx, y1, x1, y1)
    ctx!.stroke()

    // glow
    if (isActive && activeNode) {
      ctx!.globalAlpha = 0.15 * link.progress
      ctx!.lineWidth = lineW + 8
      ctx!.shadowColor = srcColor
      ctx!.shadowBlur = 20
      ctx!.stroke()
      ctx!.shadowBlur = 0
    }
    ctx!.restore()
  })
}

function drawNodes() {
  if (!ctx) return
  const activeNode = selectedNode.value || hoveredNode.value

  nodes.forEach(node => {
    const isActive = !activeNode || activeNode === node.id ||
      links.some(l => (l.source === activeNode && l.target === node.id) || (l.target === activeNode && l.source === node.id))
    const alpha = isActive ? node.opacity : 0.2 * node.opacity

    ctx!.save()
    ctx!.globalAlpha = alpha * node.scale

    // Node rect
    const r = 8
    const { x, y, w, h } = node
    ctx!.beginPath()
    ctx!.roundRect(x, y, w, h, r)
    ctx!.fillStyle = node.color + '33'
    ctx!.fill()
    ctx!.strokeStyle = node.color
    ctx!.lineWidth = 2
    ctx!.stroke()

    // glow on hover
    if (hoveredNode.value === node.id || selectedNode.value === node.id) {
      ctx!.shadowColor = node.color
      ctx!.shadowBlur = 20
      ctx!.stroke()
      ctx!.shadowBlur = 0
    }

    // label
    ctx!.fillStyle = '#e2e8f0'
    ctx!.font = 'bold 13px "Microsoft YaHei", sans-serif'
    ctx!.textAlign = 'center'
    ctx!.textBaseline = 'middle'
    ctx!.fillText(node.label, x + w / 2, y + h / 2 - 8)
    ctx!.font = '11px "Microsoft YaHei", sans-serif'
    ctx!.fillStyle = '#94a3b8'
    ctx!.fillText(`${node.value}`, x + w / 2, y + h / 2 + 10)

    ctx!.restore()
  })
}

function drawParticles() {
  if (!ctx) return
  const maxVal = Math.max(...linkData.map(l => l.value))
  const activeNode = selectedNode.value || hoveredNode.value

  particles.forEach(p => {
    const link = links[p.linkIndex]
    if (!link) return
    const src = getNodeById(link.source)
    const tgt = getNodeById(link.target)
    if (!src || !tgt) return

    const isActive = !activeNode || link.source === activeNode || link.target === activeNode
    if (!isActive) return

    const lineW = Math.max((link.value / maxVal) * 30, 3)
    const srcLinks = links.filter(l => l.source === link.source)
    const tgtLinks = links.filter(l => l.target === link.target)
    const srcIdx = srcLinks.indexOf(link)
    const tgtIdx = tgtLinks.indexOf(link)
    const srcOT = srcLinks.reduce((s, l) => s + (l.value / maxVal) * 30, 0)
    const tgtOT = tgtLinks.reduce((s, l) => s + (l.value / maxVal) * 30, 0)
    let srcOff = -srcOT / 2
    for (let j = 0; j < srcIdx; j++) srcOff += (srcLinks[j].value / maxVal) * 30
    srcOff += lineW / 2
    let tgtOff = -tgtOT / 2
    for (let j = 0; j < tgtIdx; j++) tgtOff += (tgtLinks[j].value / maxVal) * 30
    tgtOff += lineW / 2

    const x0 = src.x + src.w
    const y0 = src.y + src.h / 2 + srcOff
    const x1 = tgt.x
    const y1 = tgt.y + tgt.h / 2 + tgtOff
    const cpx = (x0 + x1) / 2

    const t = p.t
    const it = 1 - t
    const px = it ** 3 * x0 + 3 * it ** 2 * t * cpx + 3 * it * t ** 2 * cpx + t ** 3 * x1
    const py = it ** 3 * y0 + 3 * it ** 2 * t * y0 + 3 * it * t ** 2 * y1 + t ** 3 * y1

    ctx!.save()
    ctx!.globalAlpha = p.alpha * link.progress
    ctx!.beginPath()
    ctx!.arc(px, py, p.size, 0, Math.PI * 2)
    ctx!.fillStyle = '#ffffff'
    ctx!.shadowColor = src.color
    ctx!.shadowBlur = 12
    ctx!.fill()
    ctx!.restore()
  })
}

function render() {
  if (!ctx) return
  ctx.clearRect(0, 0, canvasW, canvasH)

  // background grid
  ctx.save()
  ctx.strokeStyle = '#1e293b'
  ctx.lineWidth = 0.5
  for (let x = 0; x < canvasW; x += 40) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvasH); ctx.stroke()
  }
  for (let y = 0; y < canvasH; y += 40) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvasW, y); ctx.stroke()
  }
  ctx.restore()

  // Column titles
  ctx.save()
  ctx.fillStyle = '#64748b'
  ctx.font = 'bold 16px "Microsoft YaHei", sans-serif'
  ctx.textAlign = 'center'
  const titles = ['数据源', 'AI 处理层', '业务输出']
  const cols = [0, 1, 2]
  cols.forEach(ci => {
    const colNodes = nodes.filter(n => n.column === ci)
    if (colNodes.length > 0) {
      ctx!.fillText(titles[ci], colNodes[0].x + colNodes[0].w / 2, 30)
    }
  })
  ctx.restore()

  drawLinks()
  drawNodes()
  drawParticles()

  // Update particles
  particles.forEach(p => {
    p.t += p.speed
    if (p.t > 1) {
      p.t = 0
      p.alpha = 0.3 + Math.random() * 0.7
    }
  })

  animFrame = requestAnimationFrame(render)
}

// ==================== 交互 ====================
function handleMouseMove(e: MouseEvent) {
  if (!canvasRef.value) return
  const rect = canvasRef.value.getBoundingClientRect()
  const mx = e.clientX - rect.left
  const my = e.clientY - rect.top

  let found: SankeyNode | null = null
  for (const n of nodes) {
    if (mx >= n.x && mx <= n.x + n.w && my >= n.y && my <= n.y + n.h) {
      found = n
      break
    }
  }

  hoveredNode.value = found?.id || null

  if (found) {
    tooltip.show = true
    tooltip.x = e.clientX
    tooltip.y = e.clientY
    tooltip.text = found.label
    tooltip.value = found.value
    if (canvasRef.value) canvasRef.value.style.cursor = 'pointer'
  } else {
    tooltip.show = false
    if (canvasRef.value) canvasRef.value.style.cursor = 'default'
  }
}

function handleClick(e: MouseEvent) {
  if (!canvasRef.value) return
  const rect = canvasRef.value.getBoundingClientRect()
  const mx = e.clientX - rect.left
  const my = e.clientY - rect.top

  let found: SankeyNode | null = null
  for (const n of nodes) {
    if (mx >= n.x && mx <= n.x + n.w && my >= n.y && my <= n.y + n.h) {
      found = n
      break
    }
  }

  if (found) {
    selectedNode.value = selectedNode.value === found.id ? null : found.id
  } else {
    selectedNode.value = null
  }
}

// ==================== 初始化 ====================
function initParticles() {
  particles.length = 0
  links.forEach((_, i) => {
    const count = 3 + Math.floor(Math.random() * 4)
    for (let j = 0; j < count; j++) {
      particles.push({
        linkIndex: i,
        t: Math.random(),
        speed: 0.002 + Math.random() * 0.004,
        size: 1.5 + Math.random() * 2,
        alpha: 0.3 + Math.random() * 0.7,
      })
    }
  })
}

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

  // Init nodes
  nodes.length = 0
  nodeData.forEach(nd => {
    nodes.push({ ...nd, x: 0, y: 0, w: 0, h: 0, opacity: 0, scale: 0 })
  })

  // Init links
  links.length = 0
  linkData.forEach(ld => {
    links.push({ ...ld, opacity: 0, progress: 0 })
  })

  layoutNodes()
  initParticles()

  // GSAP entrance
  const tl = gsap.timeline()

  // nodes enter by column
  for (let col = 0; col < 3; col++) {
    const colNodes = nodes.filter(n => n.column === col)
    colNodes.forEach((n, i) => {
      tl.to(n, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.5)' }, col * 0.3 + i * 0.08)
    })
  }

  // links appear
  links.forEach((l, i) => {
    tl.to(l, { opacity: 1, progress: 1, duration: 0.6, ease: 'power2.out' }, 0.9 + i * 0.03)
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
  <div class="sankey-flow" ref="containerRef">
    <div class="title-bar">
      <h2>🔗 数据流向可视化</h2>
      <p>AI 数据处理全链路 · 点击节点聚焦关联流</p>
    </div>

    <canvas
      ref="canvasRef"
      @mousemove="handleMouseMove"
      @click="handleClick"
      @mouseleave="tooltip.show = false; hoveredNode = null"
    />

    <!-- Tooltip -->
    <div
      v-if="tooltip.show"
      class="tooltip"
      :style="{ left: tooltip.x + 16 + 'px', top: tooltip.y - 10 + 'px' }"
    >
      <div class="tooltip-title">{{ tooltip.text }}</div>
      <div class="tooltip-value">流量: {{ tooltip.value }}</div>
    </div>

    <!-- Legend -->
    <div class="legend">
      <div class="legend-item" v-for="n in nodes.filter(n => n.column === 0)" :key="n.id">
        <span class="legend-dot" :style="{ background: n.color }"></span>
        {{ n.label }}
      </div>
    </div>

    <!-- Selected info -->
    <div v-if="selectedNode" class="selected-info">
      <div class="selected-label">
        已选中: {{ nodes.find(n => n.id === selectedNode)?.label }}
      </div>
      <button class="clear-btn" @click="selectedNode = null">清除选择</button>
    </div>
  </div>
</template>

<style scoped>
.sankey-flow {
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
.title-bar h2 {
  color: #e2e8f0;
  font-size: 22px;
  margin: 0;
}
.title-bar p {
  color: #64748b;
  font-size: 13px;
  margin: 6px 0 0;
}

.tooltip {
  position: fixed;
  z-index: 100;
  background: rgba(15, 23, 42, 0.95);
  border: 1px solid #334155;
  border-radius: 8px;
  padding: 10px 16px;
  pointer-events: none;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
}
.tooltip-title {
  color: #e2e8f0;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 4px;
}
.tooltip-value {
  color: #3b82f6;
  font-size: 13px;
}

.legend {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 20px;
  z-index: 10;
}
.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #94a3b8;
  font-size: 12px;
}
.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.selected-info {
  position: absolute;
  top: 24px;
  right: 24px;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid #334155;
  border-radius: 8px;
  padding: 12px 16px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 12px;
}
.selected-label {
  color: #e2e8f0;
  font-size: 13px;
}
.clear-btn {
  background: #1e293b;
  border: 1px solid #475569;
  color: #94a3b8;
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}
.clear-btn:hover {
  background: #334155;
  color: #e2e8f0;
}
</style>

