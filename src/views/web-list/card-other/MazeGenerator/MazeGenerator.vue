<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'

// ==================== 迷宫配置 ====================
const SIZES = [10, 15, 20, 25, 30]
const mazeSize = ref(15)
const cellSize = ref(0)

interface Cell {
  row: number
  col: number
  walls: [boolean, boolean, boolean, boolean] // top, right, bottom, left
  visited: boolean
  inPath: boolean
  isCurrent: boolean
  isStart: boolean
  isEnd: boolean
  distance: number
}

// ==================== 状态 ====================
const containerRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

let ctx: CanvasRenderingContext2D | null = null
let canvasW = 0
let canvasH = 0
let animFrame = 0

const grid = reactive<Cell[][]>([])
const playerPos = reactive({ row: 0, col: 0 })
const isGenerating = ref(false)
const isSolving = ref(false)
const isWon = ref(false)
const moveCount = ref(0)
const showSolution = ref(false)
const solutionPath = reactive<{ row: number; col: number }[]>([])
const genSteps = reactive<{ row: number; col: number }[]>([])

// ==================== 迷宫生成 (递归回溯 DFS) ====================
function initGrid() {
  grid.length = 0
  const n = mazeSize.value
  for (let r = 0; r < n; r++) {
    const row: Cell[] = []
    for (let c = 0; c < n; c++) {
      row.push({
        row: r,
        col: c,
        walls: [true, true, true, true],
        visited: false,
        inPath: false,
        isCurrent: false,
        isStart: r === 0 && c === 0,
        isEnd: r === n - 1 && c === n - 1,
        distance: -1,
      })
    }
    grid.push(row)
  }
}

function getNeighbors(r: number, c: number): Cell[] {
  const n = mazeSize.value
  const neighbors: Cell[] = []
  if (r > 0 && !grid[r - 1][c].visited) {
    neighbors.push(grid[r - 1][c])
  }
  if (c < n - 1 && !grid[r][c + 1].visited) {
    neighbors.push(grid[r][c + 1])
  }
  if (r < n - 1 && !grid[r + 1][c].visited) {
    neighbors.push(grid[r + 1][c])
  }
  if (c > 0 && !grid[r][c - 1].visited) {
    neighbors.push(grid[r][c - 1])
  }
  return neighbors
}

function removeWall(a: Cell, b: Cell) {
  const dr = b.row - a.row
  const dc = b.col - a.col
  if (dr === -1) {
    a.walls[0] = false
    b.walls[2] = false
  }
  if (dc === 1) {
    a.walls[1] = false
    b.walls[3] = false
  }
  if (dr === 1) {
    a.walls[2] = false
    b.walls[0] = false
  }
  if (dc === -1) {
    a.walls[3] = false
    b.walls[1] = false
  }
}

async function generateMaze() {
  isGenerating.value = true
  isWon.value = false
  showSolution.value = false
  solutionPath.length = 0
  moveCount.value = 0
  initGrid()

  const stack: Cell[] = []
  const start = grid[0][0]
  start.visited = true
  stack.push(start)

  while (stack.length > 0) {
    const current = stack[stack.length - 1]
    current.isCurrent = true

    const neighbors = getNeighbors(current.row, current.col)

    if (neighbors.length > 0) {
      const next = neighbors[Math.floor(Math.random() * neighbors.length)]
      removeWall(current, next)
      next.visited = true
      current.isCurrent = false
      stack.push(next)
    } else {
      current.isCurrent = false
      stack.pop()
    }

    // Animate every few steps
    if (stack.length % 3 === 0) {
      await new Promise((resolve) => setTimeout(resolve, 8))
    }
  }

  // Reset visited for gameplay
  grid.forEach((row) =>
    row.forEach((cell) => {
      cell.visited = false
      cell.isCurrent = false
    }),
  )

  playerPos.row = 0
  playerPos.col = 0
  isGenerating.value = false
}

// ==================== 求解 (BFS) ====================
async function solveMaze() {
  if (isSolving.value || isGenerating.value) {
    return
  }
  isSolving.value = true
  showSolution.value = true
  solutionPath.length = 0

  const n = mazeSize.value
  const visited = Array.from({ length: n }, () => Array(n).fill(false))
  const parent: (Cell | null)[][] = Array.from({ length: n }, () => Array(n).fill(null))

  const queue: Cell[] = [grid[0][0]]
  visited[0][0] = true

  while (queue.length > 0) {
    const cur = queue.shift()!
    const { row: r, col: c } = cur

    if (r === n - 1 && c === n - 1) {
      break
    }

    // Check 4 directions: top(0), right(1), bottom(2), left(3)
    const dirs = [
      { dr: -1, dc: 0, wall: 0 },
      { dr: 0, dc: 1, wall: 1 },
      { dr: 1, dc: 0, wall: 2 },
      { dr: 0, dc: -1, wall: 3 },
    ]

    for (const d of dirs) {
      const nr = r + d.dr
      const nc = c + d.dc
      if (nr >= 0 && nr < n && nc >= 0 && nc < n && !visited[nr][nc] && !cur.walls[d.wall]) {
        visited[nr][nc] = true
        parent[nr][nc] = cur
        queue.push(grid[nr][nc])
      }
    }
  }

  // Trace back path
  const path: { row: number; col: number }[] = []
  let cur: Cell | null = grid[n - 1][n - 1]
  while (cur) {
    path.unshift({ row: cur.row, col: cur.col })
    cur = parent[cur.row][cur.col]
  }

  // Animate path
  for (let i = 0; i < path.length; i++) {
    solutionPath.push(path[i])
    grid[path[i].row][path[i].col].inPath = true
    await new Promise((resolve) => setTimeout(resolve, 20))
  }

  isSolving.value = false
}

// ==================== 玩家移动 ====================
function movePlayer(dr: number, dc: number) {
  if (isGenerating.value || isWon.value) {
    return
  }

  const { row: r, col: c } = playerPos
  const nr = r + dr
  const nc = c + dc
  const n = mazeSize.value

  if (nr < 0 || nr >= n || nc < 0 || nc >= n) {
    return
  }

  // Check wall
  let wallIdx = -1
  if (dr === -1) {
    wallIdx = 0
  }
  if (dc === 1) {
    wallIdx = 1
  }
  if (dr === 1) {
    wallIdx = 2
  }
  if (dc === -1) {
    wallIdx = 3
  }

  if (grid[r][c].walls[wallIdx]) {
    return
  }

  playerPos.row = nr
  playerPos.col = nc
  moveCount.value++

  // Check win
  if (nr === n - 1 && nc === n - 1) {
    isWon.value = true
  }
}

function handleKeyDown(e: KeyboardEvent) {
  switch (e.key) {
    case 'ArrowUp':
    case 'w':
    case 'W':
      e.preventDefault()
      movePlayer(-1, 0)
      break
    case 'ArrowRight':
    case 'd':
    case 'D':
      e.preventDefault()
      movePlayer(0, 1)
      break
    case 'ArrowDown':
    case 's':
    case 'S':
      e.preventDefault()
      movePlayer(1, 0)
      break
    case 'ArrowLeft':
    case 'a':
    case 'A':
      e.preventDefault()
      movePlayer(0, -1)
      break
  }
}

// ==================== 渲染 ====================
function render() {
  if (!ctx) {
    return
  }
  ctx.clearRect(0, 0, canvasW, canvasH)

  const n = mazeSize.value
  const cs = cellSize.value
  const ox = (canvasW - n * cs) / 2
  const oy = (canvasH - n * cs) / 2

  // Background
  ctx.fillStyle = '#0b1120'
  ctx.fillRect(0, 0, canvasW, canvasH)

  // Draw grid cells
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const cell = grid[r]?.[c]
      if (!cell) {
        continue
      }

      const x = ox + c * cs
      const y = oy + r * cs

      // Cell background
      if (cell.isStart) {
        ctx.fillStyle = 'rgba(16, 185, 129, 0.2)'
        ctx.fillRect(x, y, cs, cs)
      } else if (cell.isEnd) {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.2)'
        ctx.fillRect(x, y, cs, cs)
      }

      // Solution path
      if (cell.inPath && showSolution.value) {
        ctx.fillStyle = 'rgba(59, 130, 246, 0.15)'
        ctx.fillRect(x, y, cs, cs)

        // Path dot
        ctx.beginPath()
        ctx.arc(x + cs / 2, y + cs / 2, cs * 0.12, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(59, 130, 246, 0.6)'
        ctx.fill()
      }

      // Generation current cell
      if (cell.isCurrent) {
        ctx.fillStyle = 'rgba(245, 158, 11, 0.3)'
        ctx.fillRect(x, y, cs, cs)
      }

      // Walls
      ctx.strokeStyle = '#334155'
      ctx.lineWidth = 2
      ctx.lineCap = 'round'

      if (cell.walls[0]) {
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x + cs, y)
        ctx.stroke()
      }
      if (cell.walls[1]) {
        ctx.beginPath()
        ctx.moveTo(x + cs, y)
        ctx.lineTo(x + cs, y + cs)
        ctx.stroke()
      }
      if (cell.walls[2]) {
        ctx.beginPath()
        ctx.moveTo(x, y + cs)
        ctx.lineTo(x + cs, y + cs)
        ctx.stroke()
      }
      if (cell.walls[3]) {
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x, y + cs)
        ctx.stroke()
      }
    }
  }

  // Start label
  ctx.fillStyle = '#10b981'
  ctx.font = `bold ${Math.max(10, cs * 0.35)}px "Microsoft YaHei", sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('S', ox + cs / 2, oy + cs / 2)

  // End label
  ctx.fillStyle = '#ef4444'
  ctx.fillText('E', ox + (n - 0.5) * cs, oy + (n - 0.5) * cs)

  // Player
  if (!isGenerating.value) {
    const px = ox + playerPos.col * cs + cs / 2
    const py = oy + playerPos.row * cs + cs / 2
    const pr = cs * 0.3

    // Glow
    ctx.save()
    ctx.shadowColor = '#3b82f6'
    ctx.shadowBlur = 15
    ctx.beginPath()
    ctx.arc(px, py, pr, 0, Math.PI * 2)
    ctx.fillStyle = '#3b82f6'
    ctx.fill()
    ctx.restore()

    // Inner
    ctx.beginPath()
    ctx.arc(px, py, pr * 0.6, 0, Math.PI * 2)
    ctx.fillStyle = '#93c5fd'
    ctx.fill()
  }

  // Win overlay
  if (isWon.value) {
    ctx.save()
    ctx.fillStyle = 'rgba(16, 185, 129, 0.15)'
    ctx.fillRect(0, 0, canvasW, canvasH)
    ctx.fillStyle = '#10b981'
    ctx.font = 'bold 36px "Microsoft YaHei", sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.shadowColor = '#10b981'
    ctx.shadowBlur = 20
    ctx.fillText('🎉 恭喜通关！', canvasW / 2, canvasH / 2 - 20)
    ctx.font = '16px "Microsoft YaHei", sans-serif'
    ctx.fillStyle = '#94a3b8'
    ctx.shadowBlur = 0
    ctx.fillText(`步数: ${moveCount.value}`, canvasW / 2, canvasH / 2 + 20)
    ctx.restore()
  }

  animFrame = requestAnimationFrame(render)
}

// ==================== 初始化 ====================
function initScene() {
  if (!canvasRef.value || !containerRef.value) {
    return
  }
  const dpr = window.devicePixelRatio || 1
  canvasW = containerRef.value.clientWidth
  canvasH = containerRef.value.clientHeight
  canvasRef.value.width = canvasW * dpr
  canvasRef.value.height = canvasH * dpr
  canvasRef.value.style.width = canvasW + 'px'
  canvasRef.value.style.height = canvasH + 'px'
  ctx = canvasRef.value.getContext('2d')
  if (ctx) {
    ctx.scale(dpr, dpr)
  }

  const maxCellSize = Math.min((canvasW - 80) / mazeSize.value, (canvasH - 160) / mazeSize.value)
  cellSize.value = Math.floor(maxCellSize)

  generateMaze()
  render()
}

function handleResize() {
  cancelAnimationFrame(animFrame)
  initScene()
}

function newGame() {
  showSolution.value = false
  solutionPath.length = 0
  grid.forEach((row) =>
    row.forEach((cell) => {
      cell.inPath = false
    }),
  )
  generateMaze()
}

function changeSize(size: number) {
  mazeSize.value = size
  handleResize()
}

onMounted(() => {
  initScene()
  window.addEventListener('resize', handleResize)
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  cancelAnimationFrame(animFrame)
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <div ref="containerRef" class="maze-generator">
    <div class="title-bar">
      <h2>🏰 迷宫生成器</h2>
      <p>WASD / 方向键移动 · 从 S 走到 E</p>
    </div>

    <canvas ref="canvasRef" />

    <div class="controls">
      <div class="size-group">
        <span class="label">大小:</span>
        <button
          v-for="s in SIZES"
          :key="s"
          class="size-btn"
          :class="{ active: mazeSize === s }"
          :disabled="isGenerating"
          @click="changeSize(s)"
        >
          {{ s }}×{{ s }}
        </button>
      </div>

      <div class="action-group">
        <button class="action-btn" :disabled="isGenerating" @click="newGame">🔄 新迷宫</button>
        <button class="action-btn solve" :disabled="isGenerating || isSolving" @click="solveMaze">
          🔍 求解
        </button>
      </div>

      <div class="stats">
        <span>步数: {{ moveCount }}</span>
      </div>
    </div>

    <div class="mobile-controls">
      <button class="dir-btn up" @click="movePlayer(-1, 0)">▲</button>
      <div class="dir-row">
        <button class="dir-btn" @click="movePlayer(0, -1)">◀</button>
        <button class="dir-btn" @click="movePlayer(0, 1)">▶</button>
      </div>
      <button class="dir-btn down" @click="movePlayer(1, 0)">▼</button>
    </div>
  </div>
</template>

<style scoped>
.maze-generator {
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
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 10;
  pointer-events: none;
}

.title-bar h2 {
  color: #e2e8f0;
  font-size: 20px;
  margin: 0;
}

.title-bar p {
  color: #64748b;
  font-size: 12px;
  margin: 4px 0 0;
}

.controls {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 16px;
  z-index: 10;
}

.label {
  color: #64748b;
  font-size: 12px;
}

.size-group {
  display: flex;
  align-items: center;
  gap: 4px;
}

.size-btn {
  padding: 4px 10px;
  background: #1e293b;
  border: 1px solid #334155;
  color: #94a3b8;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
  transition: all 0.2s;
}

.size-btn:hover {
  background: #334155;
  color: #e2e8f0;
}

.size-btn.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: #fff;
}

.size-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-group {
  display: flex;
  gap: 6px;
}

.action-btn {
  padding: 6px 14px;
  background: #1e293b;
  border: 1px solid #334155;
  color: #94a3b8;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.action-btn:hover:not(:disabled) {
  background: #334155;
  color: #e2e8f0;
}

.action-btn.solve {
  border-color: #3b82f6;
  color: #3b82f6;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.stats {
  color: #64748b;
  font-size: 13px;
}

.mobile-controls {
  position: absolute;
  right: 24px;
  bottom: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  z-index: 10;
}

.dir-row {
  display: flex;
  gap: 36px;
}

.dir-btn {
  width: 40px;
  height: 40px;
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid #334155;
  color: #94a3b8;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.dir-btn:hover {
  background: #334155;
  color: #e2e8f0;
}

.dir-btn:active {
  background: #3b82f6;
  color: #fff;
}
</style>

