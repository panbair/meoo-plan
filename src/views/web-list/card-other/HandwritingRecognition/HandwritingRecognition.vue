<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'

// ==================== 状态 ====================
const containerRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

let ctx: CanvasRenderingContext2D | null = null
let canvasW = 0
let canvasH = 0
let isDrawing = false

interface Point {
  x: number
  y: number
  t: number
}

interface Stroke {
  points: Point[]
}

const strokes = reactive<Stroke[]>([])
const currentStroke = reactive<Point[]>([])
const recognizedText = ref('')
const candidates = reactive<string[]>([])
const brushSize = ref(4)
const brushColor = ref('#e2e8f0')

// ==================== 简单字符识别（演示用特征匹配） ====================
// 基于笔画方向直方图的简易识别
function recognizeCharacter(stroke: Stroke): string[] {
  if (stroke.points.length < 5) {
    return ['·']
  }

  const pts = stroke.points
  const minX = Math.min(...pts.map((p) => p.x))
  const maxX = Math.max(...pts.map((p) => p.x))
  const minY = Math.min(...pts.map((p) => p.y))
  const maxY = Math.max(...pts.map((p) => p.y))
  const w = maxX - minX
  const h = maxY - minY
  const ratio = w / (h || 1)

  // Direction histogram
  const dirs = [0, 0, 0, 0, 0, 0, 0, 0] // 8 directions
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i].x - pts[i - 1].x
    const dy = pts[i].y - pts[i - 1].y
    const angle = Math.atan2(dy, dx)
    const dirIdx = Math.round(((angle + Math.PI) / (Math.PI * 2)) * 8) % 8
    dirs[dirIdx]++
  }

  const totalDirs = dirs.reduce((a, b) => a + b, 0) || 1
  const normDirs = dirs.map((d) => d / totalDirs)

  // Simple heuristic matching
  const isHorizontal = normDirs[0] + normDirs[4] > 0.5
  const isVertical = normDirs[2] + normDirs[6] > 0.5
  const isCircular = w > 20 && h > 20 && Math.abs(ratio - 1) < 0.5
  const startEnd = Math.sqrt((pts[0].x - pts[pts.length - 1].x) ** 2 + (pts[0].y - pts[pts.length - 1].y) ** 2)
  const isClosed = startEnd < Math.max(w, h) * 0.3

  if (isClosed && isCircular) {
    return ['O', '0', 'o', '○']
  }
  if (isHorizontal && !isVertical && ratio > 2) {
    return ['一', '-', '—', '_']
  }
  if (isVertical && !isHorizontal && ratio < 0.4) {
    return ['|', '1', 'l', 'I']
  }
  if (normDirs[1] + normDirs[5] > 0.4) {
    return ['/', '7', '\\', 'V']
  }
  if (normDirs[3] + normDirs[7] > 0.4) {
    return ['\\', 'N', 'Z']
  }
  if (w > 30 && h > 30) {
    if (normDirs[0] > 0.15 && normDirs[2] > 0.15) {
      return ['L', 'J', 'U']
    }
    return ['C', 'S', '~']
  }
  if (ratio > 1) {
    return ['~', 'S', 'W', 'M']
  }

  return ['?', '*']
}

// Recognize all strokes
function recognizeAll() {
  if (strokes.length === 0) {
    candidates.length = 0
    recognizedText.value = ''
    return
  }

  const lastStroke = strokes[strokes.length - 1]
  const results = recognizeCharacter({ points: lastStroke.points })
  candidates.length = 0
  results.forEach((r) => candidates.push(r))

  if (results.length > 0) {
    recognizedText.value += results[0]
  }
}

// ==================== Canvas 绘制 ====================
function redrawCanvas() {
  if (!ctx) {
    return
  }
  ctx.clearRect(0, 0, canvasW, canvasH)

  // Draw all strokes
  const allStrokes = [...strokes.map((s) => s.points)]
  if (currentStroke.length > 0) {
    allStrokes.push([...currentStroke])
  }

  allStrokes.forEach((pts) => {
    if (pts.length < 2) {
      return
    }
    ctx!.save()
    ctx!.strokeStyle = brushColor.value
    ctx!.lineWidth = brushSize.value
    ctx!.lineCap = 'round'
    ctx!.lineJoin = 'round'
    ctx!.beginPath()
    ctx!.moveTo(pts[0].x, pts[0].y)

    for (let i = 1; i < pts.length; i++) {
      const xc = (pts[i - 1].x + pts[i].x) / 2
      const yc = (pts[i - 1].y + pts[i].y) / 2
      ctx!.quadraticCurveTo(pts[i - 1].x, pts[i - 1].y, xc, yc)
    }
    ctx!.stroke()
    ctx!.restore()
  })
}

// ==================== 交互 ====================
function getPos(e: MouseEvent | TouchEvent): { x: number; y: number } {
  if (!canvasRef.value) {
    return { x: 0, y: 0 }
  }
  const rect = canvasRef.value.getBoundingClientRect()
  if ('touches' in e) {
    return {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top,
    }
  }
  return {
    x: (e as MouseEvent).clientX - rect.left,
    y: (e as MouseEvent).clientY - rect.top,
  }
}

function handleStart(e: MouseEvent | TouchEvent) {
  if ('touches' in e) {
    e.preventDefault()
  }
  isDrawing = true
  currentStroke.length = 0
  const pos = getPos(e)
  currentStroke.push({ x: pos.x, y: pos.y, t: Date.now() })
}

function handleMove(e: MouseEvent | TouchEvent) {
  if (!isDrawing) {
    return
  }
  if ('touches' in e) {
    e.preventDefault()
  }
  const pos = getPos(e)
  currentStroke.push({ x: pos.x, y: pos.y, t: Date.now() })
  redrawCanvas()
}

function handleEnd() {
  if (!isDrawing) {
    return
  }
  isDrawing = false
  if (currentStroke.length > 2) {
    strokes.push({ points: [...currentStroke] })
    recognizeAll()
  }
  currentStroke.length = 0
  redrawCanvas()
}

function clearCanvas() {
  strokes.length = 0
  currentStroke.length = 0
  recognizedText.value = ''
  candidates.length = 0
  redrawCanvas()
}

function undoStroke() {
  if (strokes.length > 0) {
    strokes.pop()
    // Recalculate recognized text
    recognizedText.value = ''
    strokes.forEach((s) => {
      const results = recognizeCharacter(s)
      if (results.length > 0) {
        recognizedText.value += results[0]
      }
    })
    redrawCanvas()
  }
}

function selectCandidate(c: string) {
  if (recognizedText.value.length > 0) {
    recognizedText.value = recognizedText.value.slice(0, -1) + c
  }
}

// ==================== 初始化 ====================
function initScene() {
  if (!canvasRef.value || !containerRef.value) {
    return
  }
  const canvasArea = containerRef.value.querySelector('.canvas-area') as HTMLElement
  if (!canvasArea) {
    return
  }
  const dpr = window.devicePixelRatio || 1
  canvasW = canvasArea.clientWidth - 2
  canvasH = canvasArea.clientHeight - 40
  canvasRef.value.width = canvasW * dpr
  canvasRef.value.height = canvasH * dpr
  canvasRef.value.style.width = canvasW + 'px'
  canvasRef.value.style.height = canvasH + 'px'
  ctx = canvasRef.value.getContext('2d')
  if (ctx) {
    ctx.scale(dpr, dpr)
  }
  redrawCanvas()
}

onMounted(() => {
  initScene()
  window.addEventListener('resize', initScene)
  gsap.fromTo('.handwriting', { opacity: 0 }, { opacity: 1, duration: 0.4 })
})

onUnmounted(() => {
  window.removeEventListener('resize', initScene)
})
</script>

<template>
  <div ref="containerRef" class="handwriting">
    <div class="top-bar">
      <h2>✍️ 手写识别</h2>
      <div class="top-actions">
        <div class="brush-ctrl">
          <span class="brush-label">笔触</span>
          <input v-model.number="brushSize" type="range" min="2" max="10" step="1" class="brush-slider" />
        </div>
        <button class="undo-btn" @click="undoStroke">↩ 撤销</button>
        <button class="clear-btn" @click="clearCanvas">🗑️ 清除</button>
      </div>
    </div>

    <div class="main-layout">
      <!-- Canvas area -->
      <div class="canvas-area">
        <div class="canvas-header">书写区域 (单笔书写一个字符)</div>
        <canvas
          ref="canvasRef"
          @mousedown="handleStart"
          @mousemove="handleMove"
          @mouseup="handleEnd"
          @mouseleave="handleEnd"
          @touchstart="handleStart"
          @touchmove="handleMove"
          @touchend="handleEnd"
        ></canvas>
      </div>

      <!-- Result panel -->
      <div class="result-panel">
        <!-- Candidates -->
        <div class="section">
          <div class="section-title">候选字</div>
          <div class="candidates">
            <button
              v-for="(c, i) in candidates"
              :key="i"
              class="cand-btn"
              @click="selectCandidate(c)"
            >
              {{ c }}
            </button>
            <span v-if="candidates.length === 0" class="empty-hint">在左侧书写后显示</span>
          </div>
        </div>

        <!-- Recognized text -->
        <div class="section">
          <div class="section-title">识别结果</div>
          <div class="recognized-text">
            {{ recognizedText || '(等待输入...)' }}
          </div>
        </div>

        <!-- Stats -->
        <div class="section">
          <div class="section-title">信息</div>
          <div class="info-row">
            <span>笔画数: {{ strokes.length }}</span>
          </div>
          <div class="info-row">
            <span>字符数: {{ recognizedText.length }}</span>
          </div>
        </div>

        <!-- Instructions -->
        <div class="section">
          <div class="section-title">使用说明</div>
          <ul class="instructions">
            <li>在书写区域用鼠标/触摸写字</li>
            <li>每画一笔自动识别一个字符</li>
            <li>点击候选字可替换最后识别的字</li>
            <li>支持简单几何形状识别</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.handwriting {
  width: 100vw;
  height: 100vh;
  background: #0b1120;
  display: flex;
  flex-direction: column;
  font-family: 'Microsoft YaHei', sans-serif;
  overflow: hidden;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  border-bottom: 1px solid #1e293b;
  flex-shrink: 0;
}

.top-bar h2 {
  color: #e2e8f0;
  font-size: 18px;
  margin: 0;
}

.top-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brush-ctrl {
  display: flex;
  align-items: center;
  gap: 6px;
}

.brush-label {
  color: #64748b;
  font-size: 12px;
}

.brush-slider {
  width: 60px;
  height: 4px;
  appearance: none;
  background: #1e293b;
  border-radius: 2px;
}

.brush-slider::-webkit-slider-thumb {
  appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
}

.undo-btn,
.clear-btn {
  padding: 4px 14px;
  background: #1e293b;
  border: 1px solid #334155;
  color: #94a3b8;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.15s;
}

.undo-btn:hover,
.clear-btn:hover {
  background: #334155;
  color: #e2e8f0;
}

.main-layout {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.canvas-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 12px;
}

.canvas-header {
  color: #475569;
  font-size: 11px;
  margin-bottom: 6px;
}

canvas {
  flex: 1;
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 10px;
  cursor: crosshair;
  touch-action: none;
}

.result-panel {
  width: 260px;
  border-left: 1px solid #1e293b;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  flex-shrink: 0;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.section-title {
  color: #64748b;
  font-size: 11px;
  text-transform: uppercase;
}

.candidates {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.cand-btn {
  width: 44px;
  height: 44px;
  background: #111827;
  border: 1px solid #1e293b;
  color: #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.cand-btn:hover {
  background: #1e293b;
  border-color: #3b82f6;
}

.empty-hint {
  color: #334155;
  font-size: 12px;
}

.recognized-text {
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 8px;
  padding: 12px;
  color: #a5f3fc;
  font-size: 22px;
  min-height: 50px;
  letter-spacing: 4px;
  word-break: break-all;
}

.info-row {
  color: #94a3b8;
  font-size: 12px;
}

.instructions {
  color: #64748b;
  font-size: 12px;
  padding-left: 16px;
  margin: 0;
  line-height: 1.8;
}
</style>

