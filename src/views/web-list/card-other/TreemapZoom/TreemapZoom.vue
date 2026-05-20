<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed, watch } from 'vue'
import { gsap } from 'gsap'

// ==================== 类型定义 ====================
interface TreeNode {
  name: string
  value: number
  color: string
  children?: TreeNode[]
}

interface RectItem {
  node: TreeNode
  x: number
  y: number
  w: number
  h: number
  depth: number
  targetX: number
  targetY: number
  targetW: number
  targetH: number
  opacity: number
  scale: number
}

// ==================== 数据 ====================
const treeData: TreeNode = {
  name: '深圳未来AI科技',
  value: 10000,
  color: '#3b82f6',
  children: [
    {
      name: '研发部',
      value: 4000,
      color: '#3b82f6',
      children: [
        { name: 'NLP团队', value: 1200, color: '#60a5fa', children: [
          { name: '对话系统', value: 500, color: '#93c5fd' },
          { name: '文本分析', value: 400, color: '#93c5fd' },
          { name: '翻译引擎', value: 300, color: '#93c5fd' },
        ]},
        { name: '视觉团队', value: 1000, color: '#60a5fa', children: [
          { name: '图像识别', value: 600, color: '#93c5fd' },
          { name: '视频分析', value: 400, color: '#93c5fd' },
        ]},
        { name: 'MLOps', value: 800, color: '#60a5fa', children: [
          { name: '模型训练', value: 500, color: '#93c5fd' },
          { name: '部署运维', value: 300, color: '#93c5fd' },
        ]},
        { name: '基础架构', value: 1000, color: '#60a5fa', children: [
          { name: '云服务', value: 600, color: '#93c5fd' },
          { name: '数据平台', value: 400, color: '#93c5fd' },
        ]},
      ]
    },
    {
      name: '产品部',
      value: 2500,
      color: '#10b981',
      children: [
        { name: '智能客服产品', value: 1000, color: '#34d399', children: [
          { name: '产品设计', value: 500, color: '#6ee7b7' },
          { name: '用户研究', value: 500, color: '#6ee7b7' },
        ]},
        { name: '数据分析产品', value: 800, color: '#34d399' },
        { name: '自动化平台', value: 700, color: '#34d399' },
      ]
    },
    {
      name: '市场部',
      value: 1800,
      color: '#f59e0b',
      children: [
        { name: '品牌推广', value: 700, color: '#fbbf24' },
        { name: '渠道销售', value: 600, color: '#fbbf24' },
        { name: '客户成功', value: 500, color: '#fbbf24' },
      ]
    },
    {
      name: '运营部',
      value: 1200,
      color: '#ef4444',
      children: [
        { name: '数据运营', value: 500, color: '#f87171' },
        { name: '社区运营', value: 400, color: '#f87171' },
        { name: '内容运营', value: 300, color: '#f87171' },
      ]
    },
    {
      name: '行政人事',
      value: 500,
      color: '#8b5cf6',
      children: [
        { name: '人力资源', value: 300, color: '#a78bfa' },
        { name: '行政管理', value: 200, color: '#a78bfa' },
      ]
    },
  ]
}

// ==================== 状态 ====================
const containerRef = ref<HTMLElement | null>(null)
const rects = reactive<RectItem[]>([])
const breadcrumb = reactive<TreeNode[]>([treeData])
const hoveredRect = ref<RectItem | null>(null)
const tooltip = reactive({ show: false, x: 0, y: 0, name: '', value: 0, percent: '' })
const containerW = ref(0)
const containerH = ref(0)

// ==================== 布局算法 (Squarified Treemap) ====================
function squarify(children: { node: TreeNode; area: number }[], row: { node: TreeNode; area: number }[], w: number, rect: { x: number; y: number; w: number; h: number }, results: RectItem[], depth: number) {
  if (children.length === 0) {
    layoutRow(row, w, rect, results, depth)
    return
  }

  const c = children[0]
  const newRow = [...row, c]

  if (row.length === 0 || worst(newRow, w) <= worst(row, w)) {
    squarify(children.slice(1), newRow, w, rect, results, depth)
  } else {
    const remaining = layoutRow(row, w, rect, results, depth)
    squarify(children, [], Math.min(remaining.w, remaining.h), remaining, results, depth)
  }
}

function worst(row: { node: TreeNode; area: number }[], w: number): number {
  const s = row.reduce((sum, r) => sum + r.area, 0)
  const maxA = Math.max(...row.map(r => r.area))
  const minA = Math.min(...row.map(r => r.area))
  return Math.max((w * w * maxA) / (s * s), (s * s) / (w * w * minA))
}

function layoutRow(row: { node: TreeNode; area: number }[], w: number, rect: { x: number; y: number; w: number; h: number }, results: RectItem[], depth: number): { x: number; y: number; w: number; h: number } {
  const totalArea = row.reduce((s, r) => s + r.area, 0)
  const rowH = totalArea / w
  const isHorizontal = rect.w >= rect.h
  let cx = rect.x
  let cy = rect.y

  row.forEach(item => {
    const itemW = item.area / rowH
    if (isHorizontal) {
      results.push({
        node: item.node,
        x: cx, y: cy, w: itemW, h: rowH,
        targetX: cx, targetY: cy, targetW: itemW, targetH: rowH,
        depth, opacity: 0, scale: 0
      })
      cx += itemW
    } else {
      results.push({
        node: item.node,
        x: cx, y: cy, w: rowH, h: itemW,
        targetX: cx, targetY: cy, targetW: rowH, targetH: itemW,
        depth, opacity: 0, scale: 0
      })
      cy += itemW
    }
  })

  if (isHorizontal) {
    return { x: rect.x, y: rect.y + rowH, w: rect.w, h: rect.h - rowH }
  } else {
    return { x: rect.x + rowH, y: rect.y, w: rect.w - rowH, h: rect.h }
  }
}

function computeLayout(node: TreeNode) {
  const pad = 8
  const topBar = 80
  const w = containerW.value - pad * 2
  const h = containerH.value - topBar - pad * 2
  if (w <= 0 || h <= 0) return

  const children = node.children || []
  if (children.length === 0) return

  const totalVal = children.reduce((s, c) => s + c.value, 0)
  const totalArea = w * h
  const items = children.map(c => ({
    node: c,
    area: (c.value / totalVal) * totalArea,
  })).sort((a, b) => b.area - a.area)

  const newRects: RectItem[] = []
  squarify(items, [], Math.min(w, h), { x: pad, y: topBar + pad, w, h }, newRects, 0)

  // Animate transition
  const oldRects = [...rects]
  rects.length = 0

  newRects.forEach(r => {
    r.opacity = 0
    r.scale = 0.8
    rects.push(r)
  })

  // GSAP animate in
  rects.forEach((r, i) => {
    gsap.to(r, {
      opacity: 1,
      scale: 1,
      duration: 0.5,
      delay: i * 0.04,
      ease: 'back.out(1.2)'
    })
  })
}

// ==================== 交互 ====================
function drillDown(rect: RectItem) {
  if (!rect.node.children || rect.node.children.length === 0) return

  // Animate out
  const tl = gsap.timeline({
    onComplete: () => {
      breadcrumb.push(rect.node)
      computeLayout(rect.node)
    }
  })

  rects.forEach((r, i) => {
    if (r === rect) {
      tl.to(r, { opacity: 0.5, duration: 0.2 }, 0)
    } else {
      tl.to(r, { opacity: 0, scale: 0.8, duration: 0.25 }, i * 0.02)
    }
  })
}

function navigateTo(index: number) {
  if (index === breadcrumb.length - 1) return
  breadcrumb.splice(index + 1)
  computeLayout(breadcrumb[breadcrumb.length - 1])
}

function handleMouseMove(e: MouseEvent) {
  if (!containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  const mx = e.clientX - rect.left
  const my = e.clientY - rect.top

  let found: RectItem | null = null
  for (const r of rects) {
    if (mx >= r.targetX && mx <= r.targetX + r.targetW && my >= r.targetY && my <= r.targetY + r.targetH) {
      found = r
    }
  }

  hoveredRect.value = found

  if (found) {
    const currentNode = breadcrumb[breadcrumb.length - 1]
    const total = (currentNode.children || []).reduce((s, c) => s + c.value, 0)
    tooltip.show = true
    tooltip.x = e.clientX
    tooltip.y = e.clientY
    tooltip.name = found.node.name
    tooltip.value = found.node.value
    tooltip.percent = ((found.node.value / total) * 100).toFixed(1) + '%'
  } else {
    tooltip.show = false
  }
}

function handleClick(e: MouseEvent) {
  if (hoveredRect.value) {
    drillDown(hoveredRect.value)
  }
}

function handleResize() {
  if (!containerRef.value) return
  containerW.value = containerRef.value.clientWidth
  containerH.value = containerRef.value.clientHeight
  computeLayout(breadcrumb[breadcrumb.length - 1])
}

onMounted(() => {
  if (containerRef.value) {
    containerW.value = containerRef.value.clientWidth
    containerH.value = containerRef.value.clientHeight
  }
  computeLayout(treeData)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div class="treemap-zoom" ref="containerRef" @mousemove="handleMouseMove" @click="handleClick" @mouseleave="tooltip.show = false; hoveredRect = null">
    <!-- Breadcrumb -->
    <div class="breadcrumb">
      <span
        v-for="(node, i) in breadcrumb"
        :key="i"
        class="crumb"
        :class="{ active: i === breadcrumb.length - 1 }"
        @click.stop="navigateTo(i)"
      >
        <span v-if="i > 0" class="sep">›</span>
        {{ node.name }}
      </span>
    </div>

    <!-- Treemap rects -->
    <div
      v-for="(r, i) in rects"
      :key="r.node.name + i"
      class="tree-rect"
      :class="{ hovered: hoveredRect === r, hasChildren: r.node.children && r.node.children.length > 0 }"
      :style="{
        left: r.targetX + 'px',
        top: r.targetY + 'px',
        width: r.targetW + 'px',
        height: r.targetH + 'px',
        backgroundColor: r.node.color + '44',
        borderColor: r.node.color,
        opacity: r.opacity,
        transform: `scale(${r.scale})`,
      }"
    >
      <div class="rect-content" v-if="r.targetW > 60 && r.targetH > 40">
        <div class="rect-name">{{ r.node.name }}</div>
        <div class="rect-value">{{ r.node.value.toLocaleString() }}</div>
        <div v-if="r.node.children" class="rect-expand">点击下钻 ↘</div>
      </div>
    </div>

    <!-- Tooltip -->
    <div
      v-if="tooltip.show"
      class="tooltip"
      :style="{ left: tooltip.x + 16 + 'px', top: tooltip.y - 10 + 'px' }"
    >
      <div class="tooltip-name">{{ tooltip.name }}</div>
      <div class="tooltip-val">预算: ¥{{ tooltip.value.toLocaleString() }}万</div>
      <div class="tooltip-pct">占比: {{ tooltip.percent }}</div>
    </div>

    <!-- Info -->
    <div class="info-bar">
      <span>📊 矩形树图 · 点击色块下钻查看子层级</span>
    </div>
  </div>
</template>

<style scoped>
.treemap-zoom {
  width: 100vw;
  height: 100vh;
  background: #0b1120;
  position: relative;
  overflow: hidden;
  font-family: 'Microsoft YaHei', sans-serif;
  cursor: default;
}

.breadcrumb {
  position: absolute;
  top: 16px;
  left: 20px;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(15, 23, 42, 0.85);
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #1e293b;
}
.crumb {
  color: #64748b;
  font-size: 14px;
  cursor: pointer;
  transition: color 0.2s;
}
.crumb:hover { color: #e2e8f0; }
.crumb.active { color: #3b82f6; font-weight: bold; cursor: default; }
.sep { color: #475569; margin: 0 4px; }

.tree-rect {
  position: absolute;
  border: 1.5px solid;
  border-radius: 6px;
  transition: box-shadow 0.2s;
  overflow: hidden;
  transform-origin: center center;
}
.tree-rect.hovered {
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
  z-index: 5;
}
.tree-rect.hasChildren { cursor: pointer; }

.rect-content {
  padding: 8px 10px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.rect-name {
  color: #e2e8f0;
  font-size: 13px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.rect-value {
  color: #94a3b8;
  font-size: 11px;
  margin-top: 2px;
}
.rect-expand {
  color: #3b82f6;
  font-size: 10px;
  margin-top: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}
.tree-rect.hovered .rect-expand { opacity: 1; }

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
.tooltip-name { color: #e2e8f0; font-size: 14px; font-weight: bold; margin-bottom: 4px; }
.tooltip-val { color: #3b82f6; font-size: 13px; }
.tooltip-pct { color: #10b981; font-size: 12px; margin-top: 2px; }

.info-bar {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: #475569;
  font-size: 13px;
  z-index: 10;
}
</style>

