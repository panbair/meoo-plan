<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed, nextTick } from 'vue'
import { gsap } from 'gsap'

// ==================== 工具定义 ====================
const tools = [
  { id: 'brush', label: '画笔', icon: '✏️' },
  { id: 'eraser', label: '橡皮擦', icon: '🧽' }
]

const presetColors = [
  '#000000',
  '#ffffff',
  '#ff4444',
  '#ff8800',
  '#ffcc00',
  '#44cc44',
  '#2299ff',
  '#8844ff',
  '#ff44aa',
  '#888888'
]

// ==================== 响应式状态 ====================
const parentRef = ref<HTMLElement | null>(null)
const toolbarRef = ref<HTMLElement | null>(null)
const canvasAreaRef = ref<HTMLElement | null>(null)
const interactCanvasRef = ref<HTMLCanvasElement | null>(null)
const layerPanelRef = ref<HTMLElement | null>(null)

const activeTool = ref('brush')
const brushSize = ref(6)
const brushColor = ref('#000000')
const layerPanelOpen = ref(true)
const showCursor = ref(false)
const cursorX = ref(0)
const cursorY = ref(0)
const activeLayerIndex = ref(0)

interface Layer {
  id: number
  name: string
  visible: boolean
  opacity: number
  canvas: HTMLCanvasElement | null
}

let layerIdCounter = 1
const layers = reactive<Layer[]>([
  {
    id: layerIdCounter++,
    name: '图层 1',
    visible: true,
    opacity: 1,
    canvas: null
  }
])

const layerCanvasRefs: (HTMLCanvasElement | null)[] = []
const setLayerCanvasRef = (el: any, i: number) => {
  if (el) {
    const canvas = (el as any).$el || el
    layerCanvasRefs[i] = canvas as HTMLCanvasElement
    layers[i].canvas = canvas as HTMLCanvasElement
  }
}

// ==================== 历史记录 ====================
interface HistorySnapshot {
  layerData: { id: number; imageData: ImageData }[]
}

const history: HistorySnapshot[] = []
const historyIndex = ref(-1)
const MAX_HISTORY = 50

const saveSnapshot = () => {
  const snapshot: HistorySnapshot = { layerData: layers.map((layer, i) => {
      const canvas = layerCanvasRefs[i]
      const ctx = canvas?.getContext('2d')
      return { id: layer.id,
        imageData: ctx ? ctx.getImageData(0, 0, canvas!.width, canvas!.height) : new ImageData(1, 1)
      }
    })
  }
  // 截断 redo 部分
  history.splice(historyIndex.value + 1)
  history.push(snapshot)
  if (history.length > MAX_HISTORY) {
    history.shift()
  }
  historyIndex.value = history.length - 1
}

const restoreSnapshot = (snapshot: HistorySnapshot) => {
  snapshot.layerData.forEach((data, i) => {
    const canvas = layerCanvasRefs[i]
    const ctx = canvas?.getContext('2d')
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.putImageData(data.imageData, 0, 0)
    }
  })
}

const undo = () => {
  if (historyIndex.value > 0) {
    historyIndex.value--
    restoreSnapshot(history[historyIndex.value])
  }
}

const redo = () => {
  if (historyIndex.value < history.length - 1) {
    historyIndex.value++
    restoreSnapshot(history[historyIndex.value])
  }
}

// ==================== 画布操作 ====================
let isDrawing = false
let lastX = 0
let lastY = 0
let lastPressure = 0.5
let lastTime = 0
let points: { x: number; y: number; pressure: number }[] = []

const getCanvasCoords = (e: PointerEvent) => {
  const canvas = interactCanvasRef.value
  if (!canvas) {
    return { x: 0, y: 0 }
  }
  const rect = canvas.getBoundingClientRect()
  return { x: (e.clientX - rect.left) * (canvas.width / rect.width),
    y: (e.clientY - rect.top) * (canvas.height / rect.height)
  }
}

const getSimulatedPressure = (x: number, y: number) => {
  const now = Date.now()
  const dt = now - lastTime || 16
  const dx = x - lastX
  const dy = y - lastY
  const speed = Math.sqrt(dx * dx + dy * dy) / dt
  lastTime = now
  // 速度越快线越细，模拟压感
  const pressure = Math.max(0.15, Math.min(1, 1 - speed * 0.3))
  return pressure * 0.6 + lastPressure * 0.4 // 平滑
}

const onPointerDown = (e: PointerEvent) => {
  isDrawing = true
  const { x, y } = getCanvasCoords(e)
  lastX = x
  lastY = y
  lastTime = Date.now()
  lastPressure = 0.5
  points = [{ x, y, pressure: 0.5 }]
  ;(e.target as HTMLElement)?.setPointerCapture?.(e.pointerId)
}

const onPointerMove = (e: PointerEvent) => {
  const { x, y } = getCanvasCoords(e)

  // 更新光标
  if (canvasAreaRef.value) {
    const rect = canvasAreaRef.value.getBoundingClientRect()
    cursorX.value = e.clientX - rect.left
    cursorY.value = e.clientY - rect.top
    showCursor.value = true
  }

  if (!isDrawing) {
    return
  }

  const pressure = e.pressure > 0 && e.pressure < 1 ? e.pressure : getSimulatedPressure(x, y)
  lastPressure = pressure
  points.push({ x, y, pressure })

  // 实时绘制到当前图层
  drawStroke(lastX, lastY, x, y, pressure)
  lastX = x
  lastY = y
}

const onPointerUp = () => {
  if (isDrawing) {
    isDrawing = false
    // 将交互层内容合并到当前图层
    commitStroke()
    saveSnapshot()
    points = []
  }
}

const drawStroke = (x1: number, y1: number, x2: number, y2: number, pressure: number) => {
  const canvas = layerCanvasRefs[activeLayerIndex.value]
  const ctx = canvas?.getContext('2d')
  if (!ctx || !canvas) {
    return
  }

  const size = brushSize.value * pressure
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  if (activeTool.value === 'eraser') {
    ctx.globalCompositeOperation = 'destination-out'
    ctx.strokeStyle = 'rgba(0,0,0,1)'
  } else {
    ctx.globalCompositeOperation = 'source-over'
    ctx.strokeStyle = brushColor.value
  }

  ctx.lineWidth = Math.max(1, size)
  ctx.beginPath()
  ctx.moveTo(x1, y1)

  // 简单贝塞尔平滑
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  ctx.quadraticCurveTo(x1, y1, mx, my)
  ctx.stroke()
}

const commitStroke = () => {
  // 笔画已直接绘制在图层层上，无需额外合并
}

const clearCanvas = () => {
  const canvas = layerCanvasRefs[activeLayerIndex.value]
  const ctx = canvas?.getContext('2d')
  if (ctx && canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    saveSnapshot()
  }
}

const exportPNG = () => {
  // 合并所有可见图层导出
  const w = layerCanvasRefs[0]?.width || 800
  const h = layerCanvasRefs[0]?.height || 600
  const offscreen = document.createElement('canvas')
  offscreen.width = w
  offscreen.height = h
  const ctx = offscreen.getContext('2d')!

  layers.forEach((layer, i) => {
    if (layer.visible && layerCanvasRefs[i]) {
      ctx.globalAlpha = layer.opacity
      ctx.drawImage(layerCanvasRefs[i]!, 0, 0)
    }
  })

  const link = document.createElement('a')
  link.download = 'drawing.png'
  link.href = offscreen.toDataURL('image/png')
  link.click()
}

// ==================== 图层管理 ====================
const addLayer = async () => {
  layers.push({
    id: layerIdCounter++,
    name: `图层 ${layerIdCounter - 1}`,
    visible: true,
    opacity: 1,
    canvas: null
  })
  activeLayerIndex.value = layers.length - 1
  await nextTick()
  resizeCanvases()
  saveSnapshot()
}

const deleteLayer = (index: number) => {
  if (layers.length <= 1) {
    return
  }
  layers.splice(index, 1)
  layerCanvasRefs.splice(index, 1)
  if (activeLayerIndex.value >= layers.length) {
    activeLayerIndex.value = layers.length - 1
  }
  saveSnapshot()
}

const toggleLayerVisibility = (index: number) => {
  layers[index].visible = !layers[index].visible
}

const setLayerOpacity = (index: number, val: number) => {
  layers[index].opacity = val
}

// ==================== 光标样式 ====================
const cursorStyle = computed(() => ({
  left: `${cursorX.value - brushSize.value / 2}px`,
  top: `${cursorY.value - brushSize.value / 2}px`,
  width: `${brushSize.value}px`,
  height: `${brushSize.value}px`,
  borderColor: activeTool.value === 'eraser' ? '#999' : brushColor.value
}))

// ==================== 键盘快捷键 ====================
const onKeyDown = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
    e.preventDefault()
    if (e.shiftKey) {
      redo()
    } else {
      undo()
    }
  }
}

// ==================== Canvas 尺寸 ====================
const resizeCanvases = () => {
  const area = canvasAreaRef.value
  if (!area) {
    return
  }
  const w = area.clientWidth
  const h = area.clientHeight
  const dpr = Math.min(window.devicePixelRatio || 1, 2)

  layerCanvasRefs.forEach((canvas) => {
    if (canvas) {
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      const ctx = canvas.getContext('2d')
      ctx?.scale(dpr, dpr)
    }
  })

  const interact = interactCanvasRef.value
  if (interact) {
    interact.width = w * dpr
    interact.height = h * dpr
    interact.style.width = `${w}px`
    interact.style.height = `${h}px`
    const ctx = interact.getContext('2d')
    ctx?.scale(dpr, dpr)
  }
}

// ==================== 生命周期 ====================
onMounted(async () => {
  await nextTick()
  resizeCanvases()
  saveSnapshot()

  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('resize', resizeCanvases)

  // 工具栏入场动画
  if (toolbarRef.value) {
    gsap.from(toolbarRef.value, {
      y: -60,
      opacity: 0,
      duration: 0.6,
      ease: 'back.out(1.4)'
    })
  }
  if (layerPanelRef.value) {
    gsap.from(layerPanelRef.value, {
      x: 60,
      opacity: 0,
      duration: 0.6,
      delay: 0.2,
      ease: 'power3.out'
    })
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('resize', resizeCanvases)
})
</script>

<template>
  <div ref="parentRef" class="drawing-canvas-container">
    <!-- 工具栏 -->
    <div ref="toolbarRef" class="dc-toolbar">
      <div class="dc-toolbar-inner">
        <!-- 工具选择 -->
        <div class="dc-tool-group">
          <button
            v-for="tool in tools"
            :key="tool.id"
            class="dc-tool-btn"
            :class="{ active: activeTool === tool.id }"
            :title="tool.label"
            @click="activeTool = tool.id"
          >
            <span class="dc-tool-icon" v-html="tool.icon"></span>
          </button>
        </div>

        <div class="dc-divider"></div>

        <!-- 画笔大小 -->
        <div class="dc-size-group">
          <label class="dc-label">大小</label>
          <input v-model.number="brushSize" type="range" min="1" max="50" class="dc-slider" />
          <span class="dc-size-val">{{ brushSize }}px</span>
        </div>

        <div class="dc-divider"></div>

        <!-- 颜色选择 -->
        <div class="dc-color-group">
          <div
            v-for="c in presetColors"
            :key="c"
            class="dc-color-swatch"
            :class="{ active: brushColor === c }"
            :style="{ background: c }"
            @click="brushColor = c"
          ></div>
          <input v-model="brushColor" type="color" class="dc-color-picker" />
        </div>

        <div class="dc-divider"></div>

        <!-- 操作按钮 -->
        <div class="dc-action-group">
          <button class="dc-action-btn" title="撤销" :disabled="historyIndex <= 0" @click="undo">
            <span>↶</span>
          </button>
          <button
            class="dc-action-btn"
            title="重做"
            :disabled="historyIndex >= history.length - 1"
            @click="redo"
          >
            <span>↷</span>
          </button>
          <button class="dc-action-btn" title="清空" @click="clearCanvas">
            <span>🗑</span>
          </button>
          <button class="dc-action-btn" title="导出PNG" @click="exportPNG">
            <span>💾</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 画布区域 -->
    <div ref="canvasAreaRef" class="dc-canvas-area">
      <div class="dc-canvas-bg">
        <div class="dc-grid-pattern"></div>
      </div>
      <!-- 图层画布堆叠 -->
      <canvas
        v-for="(layer, i) in layers"
        :key="layer.id"
        :ref="(el) => setLayerCanvasRef(el, i)"
        class="dc-layer-canvas"
        :class="{ 'active-layer': activeLayerIndex === i }"
        :style="{
          opacity: layer.opacity,
          zIndex: i + 1,
          display: layer.visible ? 'block' : 'none'
        }"
      ></canvas>
      <!-- 交互层 -->
      <canvas
        ref="interactCanvasRef"
        class="dc-interact-canvas"
        :style="{ zIndex: layers.length + 1 }"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointerleave="onPointerUp"
      ></canvas>
      <!-- 光标预览 -->
      <div v-show="showCursor" class="dc-cursor-preview" :style="cursorStyle"></div>
    </div>

    <!-- 图层面板 -->
    <div ref="layerPanelRef" class="dc-layer-panel" :class="{ open: layerPanelOpen }">
      <div class="dc-panel-header">
        <span>图层</span>
        <button class="dc-panel-toggle" @click="layerPanelOpen = !layerPanelOpen">
          {{ layerPanelOpen ? '▸' : '◂' }}
        </button>
      </div>
      <div v-show="layerPanelOpen" class="dc-panel-body">
        <div class="dc-layer-list">
          <div
            v-for="(layer, i) in [...layers].reverse()"
            :key="layer.id"
            class="dc-layer-item"
            :class="{ active: activeLayerIndex === layers.length - 1 - i }"
            @click="activeLayerIndex = layers.length - 1 - i"
          >
            <button class="dc-vis-btn" @click.stop="toggleLayerVisibility(layers.length - 1 - i)">
              {{ layer.visible ? '👁' : '👁‍🗨' }}
            </button>
            <span class="dc-layer-name">{{ layer.name }}</span>
            <input
              type="range"
              :value="layer.opacity"
              min="0"
              max="1"
              step="0.05"
              class="dc-opacity-slider"
              @input="
                setLayerOpacity(layers.length - 1 - i, +($event.target as HTMLInputElement).value)
              "
              @click.stop
            />
            <button
              v-if="layers.length > 1"
              class="dc-del-layer-btn"
              @click.stop="deleteLayer(layers.length - 1 - i)"
            >
              ✕
            </button>
          </div>
        </div>
        <button class="dc-add-layer-btn" @click="addLayer">+ 新图层</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.drawing-canvas-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: #1a1a2e;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  font-family: 'Segoe UI', sans-serif;
  user-select: none;
}

// ==================== 工具栏 ====================
.dc-toolbar {
  position: relative;
  z-index: 100;
  background: rgba(20, 20, 40, 0.85);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding: 8px 16px;
}

.dc-toolbar-inner {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.dc-tool-group {
  display: flex;
  gap: 4px;
}

.dc-tool-btn {
  width: 36px;
  height: 36px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: #ccc;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all 0.2s;

  &.active {
    background: rgba(100, 140, 255, 0.3);
    border-color: rgba(100, 140, 255, 0.6);
    color: #fff;
    box-shadow: 0 0 12px rgba(100, 140, 255, 0.3);
  }

  &:hover:not(.active) {
    background: rgba(255, 255, 255, 0.1);
  }
}

.dc-divider {
  width: 1px;
  height: 28px;
  background: rgba(255, 255, 255, 0.1);
}

.dc-size-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dc-label {
  color: #999;
  font-size: 12px;
  white-space: nowrap;
}

.dc-slider {
  width: 80px;
  accent-color: #648cff;
}

.dc-size-val {
  color: #aaa;
  font-size: 11px;
  min-width: 32px;
}

.dc-color-group {
  display: flex;
  align-items: center;
  gap: 4px;
}

.dc-color-swatch {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.15s;

  &.active {
    border-color: #fff;
    box-shadow: 0 0 8px rgba(255, 255, 255, 0.4);
    transform: scale(1.15);
  }

  &:hover:not(.active) {
    transform: scale(1.1);
  }
}

.dc-color-picker {
  width: 26px;
  height: 26px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  background: none;
  padding: 0;
}

.dc-action-group {
  display: flex;
  gap: 4px;
}

.dc-action-btn {
  width: 32px;
  height: 32px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  color: #ccc;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.12);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
}

// ==================== 画布区域 ====================
.dc-canvas-area {
  flex: 1;
  position: relative;
  overflow: hidden;
  cursor: crosshair;
}

.dc-canvas-bg {
  position: absolute;
  inset: 0;
  background: #fff;
}

.dc-grid-pattern {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.04) 1px, transparent 1px);
  background-size: 20px 20px;
}

.dc-layer-canvas,
.dc-interact-canvas {
  position: absolute;
  top: 0;
  left: 0;
}

.dc-interact-canvas {
  cursor: none;
}

.dc-cursor-preview {
  position: absolute;
  border: 1.5px solid;
  border-radius: 50%;
  pointer-events: none;
  z-index: 999;
  transition:
    width 0.1s,
    height 0.1s;
}

// ==================== 图层面板 ====================
.dc-layer-panel {
  position: absolute;
  right: 0;
  top: 53px;
  bottom: 0;
  width: 200px;
  background: rgba(20, 20, 40, 0.88);
  backdrop-filter: blur(16px);
  border-left: 1px solid rgba(255, 255, 255, 0.08);
  z-index: 90;
  display: flex;
  flex-direction: column;
  transform: translateX(160px);
  transition: transform 0.3s ease;

  &.open {
    transform: translateX(0);
  }
}

.dc-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  color: #ccc;
  font-size: 13px;
  font-weight: 600;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.dc-panel-toggle {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 14px;
}

.dc-panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.dc-layer-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.dc-layer-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.04);
  cursor: pointer;
  transition: background 0.15s;

  &.active {
    background: rgba(100, 140, 255, 0.2);
    border: 1px solid rgba(100, 140, 255, 0.3);
  }

  &:hover:not(.active) {
    background: rgba(255, 255, 255, 0.08);
  }
}

.dc-vis-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 12px;
  padding: 0;
}

.dc-layer-name {
  flex: 1;
  color: #ccc;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dc-opacity-slider {
  width: 40px;
  accent-color: #648cff;
}

.dc-del-layer-btn {
  background: none;
  border: none;
  color: #f66;
  cursor: pointer;
  font-size: 12px;
  padding: 2px 4px;
  border-radius: 4px;

  &:hover {
    background: rgba(255, 100, 100, 0.1);
  }
}

.dc-add-layer-btn {
  width: 100%;
  padding: 8px;
  margin-top: 8px;
  background: rgba(100, 140, 255, 0.15);
  border: 1px dashed rgba(100, 140, 255, 0.3);
  border-radius: 6px;
  color: #8ab;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;

  &:hover {
    background: rgba(100, 140, 255, 0.25);
    color: #fff;
  }
}
</style>


