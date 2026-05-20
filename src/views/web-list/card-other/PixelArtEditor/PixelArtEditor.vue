<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed, watch } from 'vue'
import { gsap } from 'gsap'

// ==================== 配置 ====================
const GRID_SIZES = [8, 16, 24, 32]
const gridSize = ref(16)

const tools = [
  { id: 'brush', icon: '✏️', label: '画笔' },
  { id: 'eraser', icon: '🧽', label: '橡皮擦' },
  { id: 'fill', icon: '🪣', label: '填充' },
  { id: 'picker', icon: '💉', label: '取色' },
]

const palette = [
  '#000000', '#ffffff', '#ff0000', '#ff8800', '#ffff00', '#00ff00',
  '#00ffff', '#0088ff', '#0000ff', '#8800ff', '#ff00ff', '#ff0088',
  '#884400', '#888888', '#444444', '#cccccc',
]

// ==================== 状态 ====================
const containerRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const previewCanvasRef = ref<HTMLCanvasElement | null>(null)

const activeTool = ref('brush')
const currentColor = ref('#000000')
const brushSize = ref(1)
const showGrid = ref(true)

// Frames
interface Frame {
  id: number
  pixels: string[][]
}

let frameIdCounter = 1
const frames = reactive<Frame[]>([])
const activeFrameIdx = ref(0)
const isPlaying = ref(false)
const fps = ref(4)
let playTimer: number | null = null

const isDrawing = ref(false)

// ==================== 帧管理 ====================
function createEmptyPixels(): string[][] {
  const n = gridSize.value
  return Array.from({ length: n }, () => Array(n).fill(''))
}

function addFrame() {
  const newFrame: Frame = {
    id: frameIdCounter++,
    pixels: createEmptyPixels(),
  }
  frames.push(newFrame)
  activeFrameIdx.value = frames.length - 1
}

function duplicateFrame() {
  const src = frames[activeFrameIdx.value]
  if (!src) {
    return
  }
  const newFrame: Frame = {
    id: frameIdCounter++,
    pixels: src.pixels.map((row) => [...row]),
  }
  frames.splice(activeFrameIdx.value + 1, 0, newFrame)
  activeFrameIdx.value++
}

function deleteFrame() {
  if (frames.length <= 1) {
    return
  }
  frames.splice(activeFrameIdx.value, 1)
  if (activeFrameIdx.value >= frames.length) {
    activeFrameIdx.value = frames.length - 1
  }
}

function clearFrame() {
  const frame = frames[activeFrameIdx.value]
  if (!frame) {
    return
  }
  frame.pixels = createEmptyPixels()
}

// ==================== 绘制逻辑 ====================
function getPixelCoords(e: MouseEvent): { r: number; c: number } | null {
  if (!canvasRef.value) {
    return null
  }
  const rect = canvasRef.value.getBoundingClientRect()
  const n = gridSize.value
  const cs = Math.min(rect.width, rect.height) / n
  const ox = (rect.width - n * cs) / 2
  const oy = (rect.height - n * cs) / 2
  const mx = e.clientX - rect.left - ox
  const my = e.clientY - rect.top - oy
  const c = Math.floor(mx / cs)
  const r = Math.floor(my / cs)
  if (r < 0 || r >= n || c < 0 || c >= n) {
    return null
  }
  return { r, c }
}

function applyTool(r: number, c: number) {
  const frame = frames[activeFrameIdx.value]
  if (!frame) {
    return
  }

  if (activeTool.value === 'brush') {
    const size = brushSize.value
    for (let dr = 0; dr < size; dr++) {
      for (let dc = 0; dc < size; dc++) {
        const rr = r + dr
        const cc = c + dc
        if (rr < gridSize.value && cc < gridSize.value) {
          frame.pixels[rr][cc] = currentColor.value
        }
      }
    }
  } else if (activeTool.value === 'eraser') {
    frame.pixels[r][c] = ''
  } else if (activeTool.value === 'fill') {
    floodFill(frame.pixels, r, c, frame.pixels[r][c], currentColor.value)
  } else if (activeTool.value === 'picker') {
    const color = frame.pixels[r][c]
    if (color) {
      currentColor.value = color
      activeTool.value = 'brush'
    }
  }
}

function floodFill(pixels: string[][], r: number, c: number, target: string, replacement: string) {
  if (target === replacement) {
    return
  }
  const n = gridSize.value
  const stack: [number, number][] = [[r, c]]

  while (stack.length > 0) {
    const [cr, cc] = stack.pop()!
    if (cr < 0 || cr >= n || cc < 0 || cc >= n) {
      continue
    }
    if (pixels[cr][cc] !== target) {
      continue
    }
    pixels[cr][cc] = replacement
    stack.push([cr - 1, cc], [cr + 1, cc], [cr, cc - 1], [cr, cc + 1])
  }
}

function handleMouseDown(e: MouseEvent) {
  isDrawing.value = true
  const pos = getPixelCoords(e)
  if (pos) {
    applyTool(pos.r, pos.c)
  }
}

function handleMouseMove(e: MouseEvent) {
  if (!isDrawing.value) {
    return
  }
  const pos = getPixelCoords(e)
  if (pos) {
    applyTool(pos.r, pos.c)
  }
}

function handleMouseUp() {
  isDrawing.value = false
}

// ==================== 动画播放 ====================
function togglePlay() {
  isPlaying.value = !isPlaying.value
  if (isPlaying.value) {
    startPlay()
  } else {
    stopPlay()
  }
}

function startPlay() {
  stopPlay()
  playTimer = window.setInterval(() => {
    activeFrameIdx.value = (activeFrameIdx.value + 1) % frames.length
  }, 1000 / fps.value)
}

function stopPlay() {
  if (playTimer) {
    clearInterval(playTimer)
    playTimer = null
  }
}

watch(fps, () => {
  if (isPlaying.value) {
    startPlay()
  }
})

// ==================== 渲染 ====================
function render() {
  if (!canvasRef.value) {
    return
  }
  const ctx = canvasRef.value.getContext('2d')
  if (!ctx) {
    return
  }

  const w = canvasRef.value.width
  const h = canvasRef.value.height
  ctx.clearRect(0, 0, w, h)

  const n = gridSize.value
  const cs = Math.min(w, h) / n
  const ox = (w - n * cs) / 2
  const oy = (h - n * cs) / 2

  // Background
  ctx.fillStyle = '#1a1a2e'
  ctx.fillRect(ox, oy, n * cs, n * cs)

  // Checkerboard for transparency
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if ((r + c) % 2 === 0) {
        ctx.fillStyle = '#1f1f3a'
      } else {
        ctx.fillStyle = '#1a1a2e'
      }
      ctx.fillRect(ox + c * cs, oy + r * cs, cs, cs)
    }
  }

  // Pixels
  const frame = frames[activeFrameIdx.value]
  if (frame) {
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        const color = frame.pixels[r]?.[c]
        if (color) {
          ctx.fillStyle = color
          ctx.fillRect(ox + c * cs, oy + r * cs, cs, cs)
        }
      }
    }
  }

  // Grid lines
  if (showGrid.value && cs > 4) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)'
    ctx.lineWidth = 0.5
    for (let i = 0; i <= n; i++) {
      ctx.beginPath()
      ctx.moveTo(ox + i * cs, oy)
      ctx.lineTo(ox + i * cs, oy + n * cs)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(ox, oy + i * cs)
      ctx.lineTo(ox + n * cs, oy + i * cs)
      ctx.stroke()
    }
  }

  // Border
  ctx.strokeStyle = '#334155'
  ctx.lineWidth = 2
  ctx.strokeRect(ox, oy, n * cs, n * cs)

  requestAnimationFrame(render)
}

// ==================== 导出 ====================
function exportPNG() {
  const n = gridSize.value
  const scale = 16
  const exportCanvas = document.createElement('canvas')
  exportCanvas.width = n * scale
  exportCanvas.height = n * scale
  const ectx = exportCanvas.getContext('2d')!

  const frame = frames[activeFrameIdx.value]
  if (!frame) {
    return
  }

  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const color = frame.pixels[r][c]
      if (color) {
        ectx.fillStyle = color
        ectx.fillRect(c * scale, r * scale, scale, scale)
      }
    }
  }

  const link = document.createElement('a')
  link.download = 'pixel-art.png'
  link.href = exportCanvas.toDataURL()
  link.click()
}

// ==================== 初始化 ====================
function initScene() {
  if (!canvasRef.value || !containerRef.value) {
    return
  }
  const dpr = window.devicePixelRatio || 1
  const size = Math.min(containerRef.value.clientWidth - 300, containerRef.value.clientHeight - 120)
  canvasRef.value.width = size * dpr
  canvasRef.value.height = size * dpr
  canvasRef.value.style.width = size + 'px'
  canvasRef.value.style.height = size + 'px'
  const ctx = canvasRef.value.getContext('2d')
  if (ctx) {
    ctx.scale(dpr, dpr)
  }

  if (frames.length === 0) {
    addFrame()
  }

  render()
}

function changeGridSize(size: number) {
  gridSize.value = size
  frames.length = 0
  frameIdCounter = 1
  addFrame()
}

onMounted(() => {
  initScene()
  window.addEventListener('resize', initScene)
})

onUnmounted(() => {
  stopPlay()
  window.removeEventListener('resize', initScene)
})
</script>

<template>
  <div ref="containerRef" class="pixel-art-editor">
    <div class="title-bar">
      <h2>🎨 像素画编辑器</h2>
    </div>

    <div class="editor-layout">
      <!-- Toolbar -->
      <div class="toolbar">
        <!-- Tools -->
        <div class="tool-section">
          <div class="section-title">工具</div>
          <div class="tool-grid">
            <button
              v-for="t in tools"
              :key="t.id"
              class="tool-btn"
              :class="{ active: activeTool === t.id }"
              :title="t.label"
              @click="activeTool = t.id"
            >
              {{ t.icon }}
            </button>
          </div>
        </div>

        <!-- Brush size -->
        <div class="tool-section">
          <div class="section-title">笔刷 {{ brushSize }}px</div>
          <input v-model.number="brushSize" type="range" min="1" max="4" step="1" class="slider" />
        </div>

        <!-- Color -->
        <div class="tool-section">
          <div class="section-title">颜色</div>
          <div class="current-color" :style="{ background: currentColor }"></div>
          <input v-model="currentColor" type="color" class="color-input" />
          <div class="palette">
            <div
              v-for="c in palette"
              :key="c"
              class="palette-color"
              :class="{ active: currentColor === c }"
              :style="{ background: c }"
              @click="currentColor = c"
            ></div>
          </div>
        </div>

        <!-- Grid size -->
        <div class="tool-section">
          <div class="section-title">网格</div>
          <div class="size-btns">
            <button
              v-for="s in GRID_SIZES"
              :key="s"
              class="sz-btn"
              :class="{ active: gridSize === s }"
              @click="changeGridSize(s)"
            >
              {{ s }}
            </button>
          </div>
          <label class="grid-toggle">
            <input v-model="showGrid" type="checkbox" />
            <span>网格线</span>
          </label>
        </div>

        <!-- Actions -->
        <div class="tool-section">
          <button class="act-btn" @click="clearFrame">🗑️ 清除</button>
          <button class="act-btn export" @click="exportPNG">📥 导出PNG</button>
        </div>
      </div>

      <!-- Canvas -->
      <div class="canvas-area">
        <canvas
          ref="canvasRef"
          @mousedown="handleMouseDown"
          @mousemove="handleMouseMove"
          @mouseup="handleMouseUp"
          @mouseleave="handleMouseUp"
        ></canvas>
      </div>
    </div>

    <!-- Frame timeline -->
    <div class="timeline">
      <div class="timeline-controls">
        <button class="tl-btn" @click="togglePlay">
          {{ isPlaying ? '⏸' : '▶' }}
        </button>
        <span class="fps-label">{{ fps }} FPS</span>
        <input v-model.number="fps" type="range" min="1" max="12" step="1" class="fps-slider" />
        <button class="tl-btn" @click="addFrame">＋</button>
        <button class="tl-btn" @click="duplicateFrame">📋</button>
        <button class="tl-btn" :disabled="frames.length <= 1" @click="deleteFrame">🗑</button>
      </div>
      <div class="frame-list">
        <div
          v-for="(f, i) in frames"
          :key="f.id"
          class="frame-thumb"
          :class="{ active: activeFrameIdx === i }"
          @click="activeFrameIdx = i"
        >
          <span class="frame-num">{{ i + 1 }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pixel-art-editor {
  width: 100vw;
  height: 100vh;
  background: #0b0b1a;
  position: relative;
  overflow: hidden;
  font-family: 'Microsoft YaHei', sans-serif;
  display: flex;
  flex-direction: column;
}

.title-bar {
  text-align: center;
  padding: 12px;
  flex-shrink: 0;
}

.title-bar h2 {
  color: #e2e8f0;
  font-size: 18px;
  margin: 0;
}

.editor-layout {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.toolbar {
  width: 200px;
  background: #0f0f24;
  border-right: 1px solid #1e293b;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow-y: auto;
  flex-shrink: 0;
}

.tool-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.section-title {
  color: #64748b;
  font-size: 11px;
  text-transform: uppercase;
}

.tool-grid {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.tool-btn {
  width: 38px;
  height: 38px;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 6px;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.tool-btn:hover {
  background: #334155;
}

.tool-btn.active {
  background: #3b82f6;
  border-color: #3b82f6;
}

.slider {
  width: 100%;
  height: 4px;
  appearance: none;
  background: #1e293b;
  border-radius: 2px;
  outline: none;
}

.slider::-webkit-slider-thumb {
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
}

.current-color {
  width: 100%;
  height: 28px;
  border-radius: 4px;
  border: 2px solid #334155;
}

.color-input {
  width: 100%;
  height: 28px;
  border: none;
  background: transparent;
  cursor: pointer;
}

.palette {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 3px;
}

.palette-color {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 3px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.15s;
}

.palette-color.active {
  border-color: #fff;
}

.palette-color:hover {
  border-color: #94a3b8;
}

.size-btns {
  display: flex;
  gap: 4px;
}

.sz-btn {
  flex: 1;
  padding: 4px;
  background: #1e293b;
  border: 1px solid #334155;
  color: #94a3b8;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
  transition: all 0.15s;
}

.sz-btn.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: #fff;
}

.grid-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #94a3b8;
  font-size: 12px;
  cursor: pointer;
}

.act-btn {
  padding: 6px 12px;
  background: #1e293b;
  border: 1px solid #334155;
  color: #94a3b8;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.15s;
  width: 100%;
}

.act-btn:hover {
  background: #334155;
  color: #e2e8f0;
}

.act-btn.export {
  border-color: #10b981;
  color: #10b981;
}

.canvas-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

canvas {
  cursor: crosshair;
  image-rendering: pixelated;
}

.timeline {
  background: #0f0f24;
  border-top: 1px solid #1e293b;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.timeline-controls {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.tl-btn {
  width: 32px;
  height: 32px;
  background: #1e293b;
  border: 1px solid #334155;
  color: #94a3b8;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.tl-btn:hover:not(:disabled) {
  background: #334155;
  color: #e2e8f0;
}

.tl-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.fps-label {
  color: #64748b;
  font-size: 11px;
  min-width: 40px;
}

.fps-slider {
  width: 60px;
  height: 3px;
  appearance: none;
  background: #1e293b;
  border-radius: 2px;
}

.fps-slider::-webkit-slider-thumb {
  appearance: none;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
}

.frame-list {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  flex: 1;
}

.frame-thumb {
  width: 48px;
  height: 48px;
  background: #1e293b;
  border: 2px solid #334155;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s;
}

.frame-thumb.active {
  border-color: #3b82f6;
}

.frame-thumb:hover {
  border-color: #64748b;
}

.frame-num {
  color: #64748b;
  font-size: 12px;
}
</style>

