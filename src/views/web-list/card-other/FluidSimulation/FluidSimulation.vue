<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'

// ==================== 流体网格配置 ====================
const N = 128 // grid resolution
const SIZE = N + 2
const DT = 0.1
const DIFF = 0.0001
const VISC = 0.0000

// ==================== 场数组 ====================
let u = new Float32Array(SIZE * SIZE)       // velocity x
let v = new Float32Array(SIZE * SIZE)       // velocity y
let u_prev = new Float32Array(SIZE * SIZE)
let v_prev = new Float32Array(SIZE * SIZE)
let dens = new Float32Array(SIZE * SIZE)    // density r
let dens_prev = new Float32Array(SIZE * SIZE)
let densG = new Float32Array(SIZE * SIZE)   // density g
let densG_prev = new Float32Array(SIZE * SIZE)
let densB = new Float32Array(SIZE * SIZE)   // density b
let densB_prev = new Float32Array(SIZE * SIZE)

function IX(i: number, j: number) { return i + j * SIZE }

// ==================== 求解器 ====================
function addSource(x: Float32Array, s: Float32Array, dt: number) {
  for (let i = 0; i < SIZE * SIZE; i++) x[i] += dt * s[i]
}

function setBnd(b: number, x: Float32Array) {
  for (let i = 1; i <= N; i++) {
    x[IX(0, i)] = b === 1 ? -x[IX(1, i)] : x[IX(1, i)]
    x[IX(N + 1, i)] = b === 1 ? -x[IX(N, i)] : x[IX(N, i)]
    x[IX(i, 0)] = b === 2 ? -x[IX(i, 1)] : x[IX(i, 1)]
    x[IX(i, N + 1)] = b === 2 ? -x[IX(i, N)] : x[IX(i, N)]
  }
  x[IX(0, 0)] = 0.5 * (x[IX(1, 0)] + x[IX(0, 1)])
  x[IX(0, N + 1)] = 0.5 * (x[IX(1, N + 1)] + x[IX(0, N)])
  x[IX(N + 1, 0)] = 0.5 * (x[IX(N, 0)] + x[IX(N + 1, 1)])
  x[IX(N + 1, N + 1)] = 0.5 * (x[IX(N, N + 1)] + x[IX(N + 1, N)])
}

function diffuse(b: number, x: Float32Array, x0: Float32Array, diff: number, dt: number) {
  const a = dt * diff * N * N
  for (let k = 0; k < 4; k++) {
    for (let j = 1; j <= N; j++) {
      for (let i = 1; i <= N; i++) {
        x[IX(i, j)] = (x0[IX(i, j)] + a * (x[IX(i - 1, j)] + x[IX(i + 1, j)] + x[IX(i, j - 1)] + x[IX(i, j + 1)])) / (1 + 4 * a)
      }
    }
    setBnd(b, x)
  }
}

function advect(b: number, d: Float32Array, d0: Float32Array, uu: Float32Array, vv: Float32Array, dt: number) {
  const dt0 = dt * N
  for (let j = 1; j <= N; j++) {
    for (let i = 1; i <= N; i++) {
      let x = i - dt0 * uu[IX(i, j)]
      let y = j - dt0 * vv[IX(i, j)]
      if (x < 0.5) x = 0.5; if (x > N + 0.5) x = N + 0.5
      if (y < 0.5) y = 0.5; if (y > N + 0.5) y = N + 0.5
      const i0 = Math.floor(x), i1 = i0 + 1
      const j0 = Math.floor(y), j1 = j0 + 1
      const s1 = x - i0, s0 = 1 - s1
      const t1 = y - j0, t0 = 1 - t1
      d[IX(i, j)] = s0 * (t0 * d0[IX(i0, j0)] + t1 * d0[IX(i0, j1)]) + s1 * (t0 * d0[IX(i1, j0)] + t1 * d0[IX(i1, j1)])
    }
  }
  setBnd(b, d)
}

function project(uu: Float32Array, vv: Float32Array, p: Float32Array, div: Float32Array) {
  for (let j = 1; j <= N; j++) {
    for (let i = 1; i <= N; i++) {
      div[IX(i, j)] = -0.5 * (uu[IX(i + 1, j)] - uu[IX(i - 1, j)] + vv[IX(i, j + 1)] - vv[IX(i, j - 1)]) / N
      p[IX(i, j)] = 0
    }
  }
  setBnd(0, div); setBnd(0, p)
  for (let k = 0; k < 4; k++) {
    for (let j = 1; j <= N; j++) {
      for (let i = 1; i <= N; i++) {
        p[IX(i, j)] = (div[IX(i, j)] + p[IX(i - 1, j)] + p[IX(i + 1, j)] + p[IX(i, j - 1)] + p[IX(i, j + 1)]) / 4
      }
    }
    setBnd(0, p)
  }
  for (let j = 1; j <= N; j++) {
    for (let i = 1; i <= N; i++) {
      uu[IX(i, j)] -= 0.5 * N * (p[IX(i + 1, j)] - p[IX(i - 1, j)])
      vv[IX(i, j)] -= 0.5 * N * (p[IX(i, j + 1)] - p[IX(i, j - 1)])
    }
  }
  setBnd(1, uu); setBnd(2, vv)
}

function velStep() {
  addSource(u, u_prev, DT)
  addSource(v, v_prev, DT)
  ;[u, u_prev] = [u_prev, u]; diffuse(1, u, u_prev, VISC, DT)
  ;[v, v_prev] = [v_prev, v]; diffuse(2, v, v_prev, VISC, DT)
  project(u, v, u_prev, v_prev)
  ;[u, u_prev] = [u_prev, u]
  ;[v, v_prev] = [v_prev, v]
  advect(1, u, u_prev, u_prev, v_prev, DT)
  advect(2, v, v_prev, u_prev, v_prev, DT)
  project(u, v, u_prev, v_prev)
}

function densStep(d: Float32Array, d0: Float32Array) {
  addSource(d, d0, DT)
  ;[d, d0] = [d0, d]
  diffuse(0, d, d0, DIFF, DT)
  ;[d, d0] = [d0, d]
  advect(0, d, d0, u, v, DT)
  // decay
  for (let i = 0; i < SIZE * SIZE; i++) d[i] *= 0.99
}

// ==================== Vue 状态 ====================
const containerRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const colorMode = ref(0) // 0=rainbow, 1=blue, 2=fire, 3=neon

let ctx: CanvasRenderingContext2D | null = null
let canvasW = 0
let canvasH = 0
let animFrame = 0
let imgData: ImageData | null = null
let mouseDown = false
let prevMX = 0
let prevMY = 0
let hue = 0

const colorModes = [
  { label: '🌈 彩虹', id: 'rainbow' },
  { label: '🔵 深蓝', id: 'blue' },
  { label: '🔥 火焰', id: 'fire' },
  { label: '💜 霓虹', id: 'neon' },
]

// ==================== 渲染 ====================
function renderFluid() {
  if (!ctx || !imgData) return

  // Clear prev sources
  u_prev.fill(0)
  v_prev.fill(0)
  dens_prev.fill(0)
  densG_prev.fill(0)
  densB_prev.fill(0)

  velStep()
  densStep(dens, dens_prev)
  densStep(densG, densG_prev)
  densStep(densB, densB_prev)

  // Draw to ImageData
  const data = imgData.data
  const scaleX = N / canvasW
  const scaleY = N / canvasH

  for (let y = 0; y < canvasH; y++) {
    for (let x = 0; x < canvasW; x++) {
      const gi = Math.min(N, Math.max(1, Math.floor(x * scaleX) + 1))
      const gj = Math.min(N, Math.max(1, Math.floor(y * scaleY) + 1))
      const idx = IX(gi, gj)

      const r = Math.min(255, dens[idx] * 255)
      const g = Math.min(255, densG[idx] * 255)
      const b = Math.min(255, densB[idx] * 255)

      const pi = (y * canvasW + x) * 4
      data[pi] = r
      data[pi + 1] = g
      data[pi + 2] = b
      data[pi + 3] = 255
    }
  }

  ctx.putImageData(imgData, 0, 0)
  animFrame = requestAnimationFrame(renderFluid)
}

// ==================== 交互 ====================
function getGridPos(clientX: number, clientY: number): { gi: number; gj: number } {
  if (!canvasRef.value) return { gi: 1, gj: 1 }
  const rect = canvasRef.value.getBoundingClientRect()
  const mx = clientX - rect.left
  const my = clientY - rect.top
  const gi = Math.min(N, Math.max(1, Math.floor((mx / canvasW) * N) + 1))
  const gj = Math.min(N, Math.max(1, Math.floor((my / canvasH) * N) + 1))
  return { gi, gj }
}

function injectFluid(clientX: number, clientY: number, dx: number, dy: number) {
  const { gi, gj } = getGridPos(clientX, clientY)

  // Inject velocity
  const force = 5
  const radius = 3
  for (let di = -radius; di <= radius; di++) {
    for (let dj = -radius; dj <= radius; dj++) {
      const ii = gi + di, jj = gj + dj
      if (ii < 1 || ii > N || jj < 1 || jj > N) continue
      u[IX(ii, jj)] += dx * force
      v[IX(ii, jj)] += dy * force
    }
  }

  // Inject colored density
  hue = (hue + 0.5) % 360
  let r = 0, g = 0, b = 0
  if (colorMode.value === 0) {
    // Rainbow
    const h = hue / 60
    const c = 1, x = c * (1 - Math.abs(h % 2 - 1))
    if (h < 1) { r = c; g = x }
    else if (h < 2) { r = x; g = c }
    else if (h < 3) { g = c; b = x }
    else if (h < 4) { g = x; b = c }
    else if (h < 5) { r = x; b = c }
    else { r = c; b = x }
  } else if (colorMode.value === 1) {
    r = 0.1; g = 0.4; b = 1
  } else if (colorMode.value === 2) {
    r = 1; g = 0.3; b = 0.05
  } else {
    r = 0.8; g = 0.1; b = 1
  }

  const strength = 8
  for (let di = -radius; di <= radius; di++) {
    for (let dj = -radius; dj <= radius; dj++) {
      const ii = gi + di, jj = gj + dj
      if (ii < 1 || ii > N || jj < 1 || jj > N) continue
      dens[IX(ii, jj)] += r * strength
      densG[IX(ii, jj)] += g * strength
      densB[IX(ii, jj)] += b * strength
    }
  }
}

function handleMouseDown(e: MouseEvent) {
  mouseDown = true
  prevMX = e.clientX
  prevMY = e.clientY
}

function handleMouseMove(e: MouseEvent) {
  if (!mouseDown) return
  const dx = e.clientX - prevMX
  const dy = e.clientY - prevMY
  injectFluid(e.clientX, e.clientY, dx, dy)
  prevMX = e.clientX
  prevMY = e.clientY
}

function handleMouseUp() { mouseDown = false }

function handleTouchStart(e: TouchEvent) {
  e.preventDefault()
  mouseDown = true
  prevMX = e.touches[0].clientX
  prevMY = e.touches[0].clientY
}
function handleTouchMove(e: TouchEvent) {
  e.preventDefault()
  if (!mouseDown) return
  const t = e.touches[0]
  const dx = t.clientX - prevMX
  const dy = t.clientY - prevMY
  injectFluid(t.clientX, t.clientY, dx, dy)
  prevMX = t.clientX
  prevMY = t.clientY
}
function handleTouchEnd() { mouseDown = false }

function clearFluid() {
  u.fill(0); v.fill(0); u_prev.fill(0); v_prev.fill(0)
  dens.fill(0); dens_prev.fill(0)
  densG.fill(0); densG_prev.fill(0)
  densB.fill(0); densB_prev.fill(0)
}

// ==================== 初始化 ====================
function initScene() {
  if (!canvasRef.value || !containerRef.value) return
  // Use lower resolution for performance
  canvasW = Math.min(containerRef.value.clientWidth, 800)
  canvasH = Math.min(containerRef.value.clientHeight, 600)
  canvasRef.value.width = canvasW
  canvasRef.value.height = canvasH
  ctx = canvasRef.value.getContext('2d')
  imgData = ctx!.createImageData(canvasW, canvasH)

  clearFluid()

  // Splash some initial fluid
  for (let k = 0; k < 5; k++) {
    const cx = Math.floor(N * 0.2 + Math.random() * N * 0.6)
    const cy = Math.floor(N * 0.2 + Math.random() * N * 0.6)
    const angle = Math.random() * Math.PI * 2
    for (let di = -4; di <= 4; di++) {
      for (let dj = -4; dj <= 4; dj++) {
        const ii = cx + di, jj = cy + dj
        if (ii < 1 || ii > N || jj < 1 || jj > N) continue
        u[IX(ii, jj)] = Math.cos(angle) * 8
        v[IX(ii, jj)] = Math.sin(angle) * 8
        dens[IX(ii, jj)] = Math.random() * 3
        densG[IX(ii, jj)] = Math.random() * 3
        densB[IX(ii, jj)] = Math.random() * 3
      }
    }
  }

  renderFluid()
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
  <div class="fluid-simulation" ref="containerRef">
    <div class="title-bar">
      <h2>🌊 流体模拟</h2>
      <p>鼠标拖动注入流体 · Navier-Stokes 方程</p>
    </div>

    <canvas
      ref="canvasRef"
      class="fluid-canvas"
      @mousedown="handleMouseDown"
      @mousemove="handleMouseMove"
      @mouseup="handleMouseUp"
      @mouseleave="handleMouseUp"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
    />

    <div class="controls">
      <div class="color-modes">
        <button
          v-for="(m, i) in colorModes"
          :key="i"
          class="mode-btn"
          :class="{ active: colorMode === i }"
          @click="colorMode = i"
        >{{ m.label }}</button>
      </div>
      <button class="clear-btn" @click="clearFluid">🗑️ 清除</button>
    </div>

    <div class="hint">在画布上拖动鼠标创造流体</div>
  </div>
</template>

<style scoped>
.fluid-simulation {
  width: 100vw; height: 100vh; background: #000;
  position: relative; overflow: hidden; font-family: 'Microsoft YaHei', sans-serif;
  display: flex; align-items: center; justify-content: center;
}
.fluid-canvas {
  max-width: 100%; max-height: 100%; cursor: crosshair;
  border-radius: 0;
}
.title-bar {
  position: absolute; top: 24px; left: 50%; transform: translateX(-50%);
  text-align: center; z-index: 10; pointer-events: none;
}
.title-bar h2 { color: #e2e8f0; font-size: 22px; margin: 0; }
.title-bar p { color: #64748b; font-size: 13px; margin: 6px 0 0; }

.controls {
  position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%);
  display: flex; align-items: center; gap: 12px; z-index: 10;
}
.color-modes { display: flex; gap: 6px; }
.mode-btn {
  padding: 6px 14px; background: rgba(20, 20, 30, 0.8);
  border: 1px solid #334155; color: #94a3b8; border-radius: 6px;
  cursor: pointer; font-size: 12px; transition: all 0.2s;
}
.mode-btn:hover { background: #334155; color: #e2e8f0; }
.mode-btn.active { background: #3b82f6; border-color: #3b82f6; color: #fff; }
.clear-btn {
  padding: 6px 14px; background: rgba(20, 20, 30, 0.8);
  border: 1px solid #334155; color: #94a3b8; border-radius: 6px;
  cursor: pointer; font-size: 12px; transition: all 0.2s;
}
.clear-btn:hover { background: #ef4444; border-color: #ef4444; color: #fff; }
.hint {
  position: absolute; bottom: 70px; left: 50%; transform: translateX(-50%);
  color: #334155; font-size: 12px; z-index: 10;
}
</style>

