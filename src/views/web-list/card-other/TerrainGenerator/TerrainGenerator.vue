<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'

// ==================== Simplex Noise ====================
class SimplexNoise {
  private perm: number[] = []
  constructor(seed = Math.random() * 65536) {
    const p: number[] = []
    for (let i = 0; i < 256; i++) p[i] = i
    let s = seed
    for (let i = 255; i > 0; i--) {
      s = (s * 16807) % 2147483647
      const j = s % (i + 1)
      ;[p[i], p[j]] = [p[j], p[i]]
    }
    for (let i = 0; i < 512; i++) this.perm[i] = p[i & 255]
  }
  private grad(hash: number, x: number, y: number): number {
    const h = hash & 7
    const u = h < 4 ? x : y
    const v = h < 4 ? y : x
    return ((h & 1) ? -u : u) + ((h & 2) ? -2 * v : 2 * v)
  }
  noise2D(x: number, y: number): number {
    const F2 = 0.5 * (Math.sqrt(3) - 1)
    const G2 = (3 - Math.sqrt(3)) / 6
    const s = (x + y) * F2
    const i = Math.floor(x + s)
    const j = Math.floor(y + s)
    const t = (i + j) * G2
    const x0 = x - (i - t)
    const y0 = y - (j - t)
    const i1 = x0 > y0 ? 1 : 0
    const j1 = x0 > y0 ? 0 : 1
    const x1 = x0 - i1 + G2
    const y1 = y0 - j1 + G2
    const x2 = x0 - 1 + 2 * G2
    const y2 = y0 - 1 + 2 * G2
    const ii = i & 255
    const jj = j & 255
    let n0 = 0, n1 = 0, n2 = 0
    let t0 = 0.5 - x0 * x0 - y0 * y0
    if (t0 > 0) { t0 *= t0; n0 = t0 * t0 * this.grad(this.perm[ii + this.perm[jj]], x0, y0) }
    let t1 = 0.5 - x1 * x1 - y1 * y1
    if (t1 > 0) { t1 *= t1; n1 = t1 * t1 * this.grad(this.perm[ii + i1 + this.perm[jj + j1]], x1, y1) }
    let t2 = 0.5 - x2 * x2 - y2 * y2
    if (t2 > 0) { t2 *= t2; n2 = t2 * t2 * this.grad(this.perm[ii + 1 + this.perm[jj + 1]], x2, y2) }
    return 70 * (n0 + n1 + n2)
  }
  octave(x: number, y: number, octaves: number, persistence: number): number {
    let total = 0, freq = 1, amp = 1, maxVal = 0
    for (let i = 0; i < octaves; i++) {
      total += this.noise2D(x * freq, y * freq) * amp
      maxVal += amp
      amp *= persistence
      freq *= 2
    }
    return total / maxVal
  }
}

// ==================== 状态 ====================
const containerRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

const params = reactive({
  gridSize: 80,
  frequency: 0.04,
  amplitude: 1,
  octaves: 4,
  persistence: 0.5,
  speed: 0.3,
  rotationX: 55,
  rotationZ: 45,
  zoom: 1,
  renderMode: 'wire' as 'wire' | 'solid' | 'height',
  animate: true,
})

const globalAmplitude = ref(0) // for entrance animation

let ctx: CanvasRenderingContext2D | null = null
let canvasW = 0
let canvasH = 0
let animFrame = 0
let noise = new SimplexNoise()
let time = 0
let isDragging = false
let lastMX = 0
let lastMY = 0

// ==================== 高度颜色映射 ====================
function heightColor(h: number): string {
  const t = (h + 1) / 2 // normalize to 0-1
  if (t < 0.2) return `rgb(10, ${30 + t * 300}, ${80 + t * 400})`
  if (t < 0.4) return `rgb(${t * 100}, ${120 + t * 200}, ${60 + t * 200})`
  if (t < 0.6) return `rgb(${50 + t * 300}, ${180 + t * 100}, ${30})`
  if (t < 0.8) return `rgb(${200 + t * 50}, ${200 - t * 100}, ${20})`
  return `rgb(${220 + t * 35}, ${100 - t * 80}, ${20})`
}

// ==================== 3D 投影 ====================
function project(x: number, y: number, z: number): { px: number; py: number } {
  const radX = (params.rotationX * Math.PI) / 180
  const radZ = (params.rotationZ * Math.PI) / 180

  // Rotate around Z axis
  const x1 = x * Math.cos(radZ) - y * Math.sin(radZ)
  const y1 = x * Math.sin(radZ) + y * Math.cos(radZ)

  // Rotate around X axis
  const y2 = y1 * Math.cos(radX) - z * Math.sin(radX)
  const z2 = y1 * Math.sin(radX) + z * Math.cos(radX)

  const scale = params.zoom * Math.min(canvasW, canvasH) * 0.004
  return {
    px: canvasW / 2 + x1 * scale,
    py: canvasH / 2 + y2 * scale,
  }
}

// ==================== 渲染 ====================
function render() {
  if (!ctx) return
  ctx.clearRect(0, 0, canvasW, canvasH)

  const gs = params.gridSize
  const half = gs / 2
  const cellSize = 5
  const amp = params.amplitude * globalAmplitude.value * 40

  if (params.animate) time += params.speed * 0.01

  // Generate height map
  const heights: number[][] = []
  for (let i = 0; i <= gs; i++) {
    heights[i] = []
    for (let j = 0; j <= gs; j++) {
      const nx = (i - half) * params.frequency + time
      const ny = (j - half) * params.frequency
      heights[i][j] = noise.octave(nx, ny, params.octaves, params.persistence)
    }
  }

  // Draw grid - back to front
  for (let i = 0; i < gs; i++) {
    for (let j = 0; j < gs; j++) {
      const x0 = (i - half) * cellSize
      const y0 = (j - half) * cellSize
      const x1 = (i + 1 - half) * cellSize
      const y1 = (j + 1 - half) * cellSize

      const h00 = heights[i][j] * amp
      const h10 = heights[i + 1][j] * amp
      const h01 = heights[i][j + 1] * amp
      const h11 = heights[i + 1][j + 1] * amp
      const avgH = (h00 + h10 + h01 + h11) / 4

      const p00 = project(x0, y0, h00)
      const p10 = project(x1, y0, h10)
      const p01 = project(x0, y1, h01)
      const p11 = project(x1, y1, h11)

      if (params.renderMode === 'solid' || params.renderMode === 'height') {
        const normH = avgH / amp
        ctx.beginPath()
        ctx.moveTo(p00.px, p00.py)
        ctx.lineTo(p10.px, p10.py)
        ctx.lineTo(p11.px, p11.py)
        ctx.lineTo(p01.px, p01.py)
        ctx.closePath()

        if (params.renderMode === 'height') {
          ctx.fillStyle = heightColor(normH)
        } else {
          const bright = Math.max(0, Math.min(255, 30 + (normH + 1) * 60))
          ctx.fillStyle = `rgb(${bright * 0.3}, ${bright * 0.6}, ${bright})`
        }
        ctx.fill()
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.15)'
        ctx.lineWidth = 0.3
        ctx.stroke()
      } else {
        // Wire mode
        const normH = (avgH / amp + 1) / 2
        const alpha = 0.2 + normH * 0.6
        ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`
        ctx.lineWidth = 0.8
        ctx.beginPath()
        ctx.moveTo(p00.px, p00.py)
        ctx.lineTo(p10.px, p10.py)
        ctx.lineTo(p11.px, p11.py)
        ctx.lineTo(p01.px, p01.py)
        ctx.closePath()
        ctx.stroke()
      }
    }
  }

  animFrame = requestAnimationFrame(render)
}

// ==================== 交互 ====================
function handleMouseDown(e: MouseEvent) {
  isDragging = true
  lastMX = e.clientX
  lastMY = e.clientY
}
function handleMouseMove(e: MouseEvent) {
  if (!isDragging) return
  const dx = e.clientX - lastMX
  const dy = e.clientY - lastMY
  params.rotationZ += dx * 0.3
  params.rotationX = Math.max(10, Math.min(89, params.rotationX - dy * 0.3))
  lastMX = e.clientX
  lastMY = e.clientY
}
function handleMouseUp() { isDragging = false }
function handleWheel(e: WheelEvent) {
  e.preventDefault()
  params.zoom = Math.max(0.3, Math.min(3, params.zoom - e.deltaY * 0.001))
}

function setRenderMode(mode: 'wire' | 'solid' | 'height') { params.renderMode = mode }
function regenerate() { noise = new SimplexNoise(); time = 0 }

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

  gsap.to(globalAmplitude, { value: 1, duration: 2, ease: 'power2.out' })
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
  <div class="terrain-generator" ref="containerRef">
    <div class="title-bar">
      <h2>🏔️ 3D 地形生成器</h2>
      <p>Simplex Noise 实时地形 · 拖拽旋转 · 滚轮缩放</p>
    </div>

    <canvas
      ref="canvasRef"
      @mousedown="handleMouseDown"
      @mousemove="handleMouseMove"
      @mouseup="handleMouseUp"
      @mouseleave="handleMouseUp"
      @wheel="handleWheel"
    />

    <!-- Controls -->
    <div class="controls">
      <div class="ctrl-group">
        <label>渲染模式</label>
        <div class="btn-group">
          <button :class="{ active: params.renderMode === 'wire' }" @click="setRenderMode('wire')">线框</button>
          <button :class="{ active: params.renderMode === 'solid' }" @click="setRenderMode('solid')">实体</button>
          <button :class="{ active: params.renderMode === 'height' }" @click="setRenderMode('height')">高度</button>
        </div>
      </div>
      <div class="ctrl-group">
        <label>频率 {{ params.frequency.toFixed(3) }}</label>
        <input type="range" min="0.01" max="0.1" step="0.002" v-model.number="params.frequency" />
      </div>
      <div class="ctrl-group">
        <label>振幅 {{ params.amplitude.toFixed(1) }}</label>
        <input type="range" min="0.2" max="3" step="0.1" v-model.number="params.amplitude" />
      </div>
      <div class="ctrl-group">
        <label>层级 {{ params.octaves }}</label>
        <input type="range" min="1" max="8" step="1" v-model.number="params.octaves" />
      </div>
      <div class="ctrl-group">
        <label>速度 {{ params.speed.toFixed(1) }}</label>
        <input type="range" min="0" max="2" step="0.1" v-model.number="params.speed" />
      </div>
      <div class="ctrl-group">
        <button class="regen-btn" @click="regenerate">🔄 重新生成</button>
        <button class="regen-btn" @click="params.animate = !params.animate">
          {{ params.animate ? '⏸ 暂停' : '▶ 播放' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.terrain-generator {
  width: 100vw;
  height: 100vh;
  background: #060a14;
  position: relative;
  overflow: hidden;
  font-family: 'Microsoft YaHei', sans-serif;
}
canvas { position: absolute; top: 0; left: 0; width: 100%; height: 100%; cursor: grab; }
canvas:active { cursor: grabbing; }

.title-bar {
  position: absolute; top: 24px; left: 50%; transform: translateX(-50%);
  text-align: center; z-index: 10; pointer-events: none;
}
.title-bar h2 { color: #e2e8f0; font-size: 22px; margin: 0; }
.title-bar p { color: #64748b; font-size: 13px; margin: 6px 0 0; }

.controls {
  position: absolute; right: 20px; top: 50%; transform: translateY(-50%);
  background: rgba(10, 15, 30, 0.85); border: 1px solid #1e293b; border-radius: 10px;
  padding: 16px; z-index: 10; display: flex; flex-direction: column; gap: 12px; width: 200px;
}
.ctrl-group { display: flex; flex-direction: column; gap: 4px; }
.ctrl-group label { color: #94a3b8; font-size: 11px; }
.ctrl-group input[type="range"] {
  width: 100%; height: 4px; appearance: none; background: #1e293b; border-radius: 2px; outline: none;
}
.ctrl-group input[type="range"]::-webkit-slider-thumb {
  appearance: none; width: 14px; height: 14px; border-radius: 50%;
  background: #3b82f6; cursor: pointer;
}
.btn-group { display: flex; gap: 4px; }
.btn-group button {
  flex: 1; padding: 4px 8px; background: #1e293b; border: 1px solid #334155;
  color: #94a3b8; border-radius: 4px; cursor: pointer; font-size: 11px; transition: all 0.2s;
}
.btn-group button.active { background: #3b82f6; border-color: #3b82f6; color: #fff; }
.btn-group button:hover { background: #334155; color: #e2e8f0; }
.regen-btn {
  padding: 6px 12px; background: #1e293b; border: 1px solid #334155;
  color: #94a3b8; border-radius: 6px; cursor: pointer; font-size: 12px; transition: all 0.2s;
}
.regen-btn:hover { background: #334155; color: #e2e8f0; }
</style>

