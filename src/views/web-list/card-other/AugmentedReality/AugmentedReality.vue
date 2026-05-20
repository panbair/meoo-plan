<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'

// ==================== 虚拟物体 ====================
interface VirtualObject {
  id: number
  type: 'cube' | 'sphere' | 'label' | 'particle'
  x: number
  y: number
  rotation: number
  scale: number
  color: string
  label?: string
}

let objIdCounter = 1

const objectTypes = [
  { type: 'cube' as const, icon: '📦', label: '立方体' },
  { type: 'sphere' as const, icon: '🔮', label: '球体' },
  { type: 'label' as const, icon: '🏷️', label: '标签' },
  { type: 'particle' as const, icon: '✨', label: '粒子' },
]

// ==================== 状态 ====================
const containerRef = ref<HTMLElement | null>(null)
const videoRef = ref<HTMLVideoElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

const objects = reactive<VirtualObject[]>([])
const selectedType = ref<'cube' | 'sphere' | 'label' | 'particle'>('cube')
const cameraActive = ref(false)
const cameraError = ref('')
const showControls = ref(true)

let ctx: CanvasRenderingContext2D | null = null
let canvasW = 0
let canvasH = 0
let animFrame = 0
let time = 0

// Camera fallback - animated background
const useFallback = ref(false)

// ==================== 摄像头 ====================
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment', width: 1280, height: 720 },
    })
    if (videoRef.value) {
      videoRef.value.srcObject = stream
      await videoRef.value.play()
      cameraActive.value = true
    }
  } catch {
    cameraError.value = '无法访问摄像头，使用模拟背景'
    useFallback.value = true
    cameraActive.value = true
  }
}

function stopCamera() {
  if (videoRef.value?.srcObject) {
    const stream = videoRef.value.srcObject as MediaStream
    stream.getTracks().forEach((t) => t.stop())
    videoRef.value.srcObject = null
  }
  cameraActive.value = false
}

// ==================== 3D 绘制函数 ====================
function drawCube(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number, color: string) {
  const s = size
  const cos = Math.cos(rotation)
  const sin = Math.sin(rotation)

  // 等轴测立方体
  const faces = [
    // Top face
    [
      { x: 0, y: -s },
      { x: s * 0.6, y: -s * 0.7 },
      { x: 0, y: -s * 0.4 },
      { x: -s * 0.6, y: -s * 0.7 },
    ],
    // Left face
    [
      { x: -s * 0.6, y: -s * 0.7 },
      { x: 0, y: -s * 0.4 },
      { x: 0, y: s * 0.2 },
      { x: -s * 0.6, y: -s * 0.1 },
    ],
    // Right face
    [
      { x: 0, y: -s * 0.4 },
      { x: s * 0.6, y: -s * 0.7 },
      { x: s * 0.6, y: -s * 0.1 },
      { x: 0, y: s * 0.2 },
    ],
  ]

  const colors = [color, shadeColor(color, -30), shadeColor(color, -60)]

  faces.forEach((face, fi) => {
    ctx.beginPath()
    face.forEach((p, i) => {
      const rx = p.x * cos - p.y * sin * 0.3
      const ry = p.x * sin * 0.3 + p.y
      if (i === 0) {
        ctx.moveTo(x + rx, y + ry)
      } else {
        ctx.lineTo(x + rx, y + ry)
      }
    })
    ctx.closePath()
    ctx.fillStyle = colors[fi]
    ctx.globalAlpha = 0.8
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.3)'
    ctx.lineWidth = 1
    ctx.stroke()
  })
  ctx.globalAlpha = 1
}

function drawSphere(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string) {
  const grad = ctx.createRadialGradient(x - radius * 0.3, y - radius * 0.3, radius * 0.1, x, y, radius)
  grad.addColorStop(0, shadeColor(color, 40))
  grad.addColorStop(0.7, color)
  grad.addColorStop(1, shadeColor(color, -40))

  ctx.save()
  ctx.globalAlpha = 0.85
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, Math.PI * 2)
  ctx.fillStyle = grad
  ctx.fill()

  // Highlight
  ctx.beginPath()
  ctx.arc(x - radius * 0.25, y - radius * 0.25, radius * 0.15, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(255,255,255,0.4)'
  ctx.fill()

  ctx.restore()
}

function drawLabel(ctx: CanvasRenderingContext2D, x: number, y: number, text: string, color: string) {
  ctx.save()
  ctx.globalAlpha = 0.9

  const metrics = ctx.measureText(text)
  const pw = metrics.width + 20
  const ph = 28

  // Background
  ctx.fillStyle = color + 'cc'
  ctx.beginPath()
  ctx.roundRect(x - pw / 2, y - ph / 2, pw, ph, 6)
  ctx.fill()

  // Pointer
  ctx.beginPath()
  ctx.moveTo(x - 6, y + ph / 2)
  ctx.lineTo(x, y + ph / 2 + 10)
  ctx.lineTo(x + 6, y + ph / 2)
  ctx.fillStyle = color + 'cc'
  ctx.fill()

  // Text
  ctx.fillStyle = '#fff'
  ctx.font = 'bold 13px "Microsoft YaHei", sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, x, y)

  ctx.restore()
}

function drawParticleEffect(ctx: CanvasRenderingContext2D, x: number, y: number, time: number, color: string) {
  ctx.save()
  for (let i = 0; i < 20; i++) {
    const angle = (i / 20) * Math.PI * 2 + time * 2
    const radius = 15 + Math.sin(time * 3 + i) * 10
    const px = x + Math.cos(angle) * radius
    const py = y + Math.sin(angle) * radius
    const size = 2 + Math.sin(time * 4 + i * 0.5) * 1.5

    ctx.beginPath()
    ctx.arc(px, py, size, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.globalAlpha = 0.4 + Math.sin(time * 5 + i) * 0.3
    ctx.shadowColor = color
    ctx.shadowBlur = 8
    ctx.fill()
  }
  ctx.shadowBlur = 0
  ctx.globalAlpha = 1
  ctx.restore()
}

function shadeColor(color: string, percent: number): string {
  const num = parseInt(color.replace('#', ''), 16)
  const r = Math.min(255, Math.max(0, (num >> 16) + percent))
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + percent))
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + percent))
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

// ==================== 渲染循环 ====================
function render() {
  if (!ctx) {
    return
  }
  time += 0.016

  // Draw video or fallback background
  if (videoRef.value && !useFallback.value && cameraActive.value) {
    ctx.drawImage(videoRef.value, 0, 0, canvasW, canvasH)
  } else if (useFallback.value) {
    // Animated gradient background simulating a scene
    const grad = ctx.createLinearGradient(0, 0, canvasW, canvasH)
    grad.addColorStop(0, '#0f172a')
    grad.addColorStop(0.5, '#1e293b')
    grad.addColorStop(1, '#0f172a')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, canvasW, canvasH)

    // Moving grid
    ctx.save()
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.08)'
    ctx.lineWidth = 0.5
    const offset = (time * 20) % 40
    for (let x = -offset; x < canvasW; x += 40) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvasH)
      ctx.stroke()
    }
    for (let y = -offset; y < canvasH; y += 40) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvasW, y)
      ctx.stroke()
    }
    ctx.restore()
  }

  // Semi-transparent overlay for AR feel
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
  ctx.fillRect(0, 0, canvasW, canvasH)

  // Scan line effect
  const scanY = (time * 100) % canvasH
  ctx.save()
  ctx.strokeStyle = 'rgba(59, 130, 246, 0.15)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, scanY)
  ctx.lineTo(canvasW, scanY)
  ctx.stroke()
  ctx.restore()

  // Draw virtual objects
  objects.forEach((obj) => {
    obj.rotation += 0.01

    ctx!.save()
    if (obj.type === 'cube') {
      drawCube(ctx!, obj.x, obj.y, 30 * obj.scale, obj.rotation, obj.color)
    } else if (obj.type === 'sphere') {
      drawSphere(ctx!, obj.x, obj.y, 22 * obj.scale, obj.color)
    } else if (obj.type === 'label') {
      drawLabel(ctx!, obj.x, obj.y, obj.label || 'AR Label', obj.color)
    } else if (obj.type === 'particle') {
      drawParticleEffect(ctx!, obj.x, obj.y, time, obj.color)
    }

    // Shadow/glow effect
    ctx!.beginPath()
    ctx!.ellipse(obj.x, obj.y + 35 * obj.scale, 20 * obj.scale, 5 * obj.scale, 0, 0, Math.PI * 2)
    ctx!.fillStyle = 'rgba(0,0,0,0.2)'
    ctx!.fill()

    ctx!.restore()
  })

  // AR frame corners
  ctx.save()
  ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)'
  ctx.lineWidth = 2
  const cm = 30
  // Top-left
  ctx.beginPath()
  ctx.moveTo(10, 10 + cm)
  ctx.lineTo(10, 10)
  ctx.lineTo(10 + cm, 10)
  ctx.stroke()
  // Top-right
  ctx.beginPath()
  ctx.moveTo(canvasW - 10 - cm, 10)
  ctx.lineTo(canvasW - 10, 10)
  ctx.lineTo(canvasW - 10, 10 + cm)
  ctx.stroke()
  // Bottom-left
  ctx.beginPath()
  ctx.moveTo(10, canvasH - 10 - cm)
  ctx.lineTo(10, canvasH - 10)
  ctx.lineTo(10 + cm, canvasH - 10)
  ctx.stroke()
  // Bottom-right
  ctx.beginPath()
  ctx.moveTo(canvasW - 10 - cm, canvasH - 10)
  ctx.lineTo(canvasW - 10, canvasH - 10)
  ctx.lineTo(canvasW - 10, canvasH - 10 - cm)
  ctx.stroke()
  ctx.restore()

  // Info overlay
  ctx.save()
  ctx.fillStyle = 'rgba(59, 130, 246, 0.7)'
  ctx.font = '11px monospace'
  ctx.fillText(`AR Objects: ${objects.length}`, 20, canvasH - 20)
  ctx.fillText(`FPS: 60`, canvasW - 80, canvasH - 20)
  ctx.restore()

  animFrame = requestAnimationFrame(render)
}

// ==================== 交互 ====================
function handleCanvasClick(e: MouseEvent) {
  if (!canvasRef.value) {
    return
  }
  const rect = canvasRef.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#a855f7', '#ec4899']
  const color = colors[Math.floor(Math.random() * colors.length)]
  const labels = ['AI核心', '数据节点', '处理中...', '已连接', '模块A', '输出端']

  objects.push({
    id: objIdCounter++,
    type: selectedType.value,
    x,
    y,
    rotation: Math.random() * Math.PI * 2,
    scale: 0.8 + Math.random() * 0.6,
    color,
    label: labels[Math.floor(Math.random() * labels.length)],
  })
}

function clearObjects() {
  objects.length = 0
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

  startCamera()
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
  stopCamera()
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div ref="containerRef" class="augmented-reality">
    <video ref="videoRef" autoplay playsinline muted class="ar-video"></video>
    <canvas ref="canvasRef" class="ar-canvas" @click="handleCanvasClick"></canvas>

    <!-- Controls overlay -->
    <div class="ar-header">
      <h2>📱 AR 叠加层</h2>
      <p>点击画面放置虚拟物体</p>
    </div>

    <div v-if="cameraError" class="camera-error">{{ cameraError }}</div>

    <div class="ar-toolbar">
      <div class="obj-types">
        <button
          v-for="ot in objectTypes"
          :key="ot.type"
          class="obj-btn"
          :class="{ active: selectedType === ot.type }"
          @click="selectedType = ot.type"
        >
          <span class="obj-icon">{{ ot.icon }}</span>
          <span class="obj-label">{{ ot.label }}</span>
        </button>
      </div>
      <button class="clear-obj-btn" @click="clearObjects">🗑️ 清空</button>
    </div>
  </div>
</template>

<style scoped>
.augmented-reality {
  width: 100vw;
  height: 100vh;
  background: #000;
  position: relative;
  overflow: hidden;
  font-family: 'Microsoft YaHei', sans-serif;
}

.ar-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
  display: none;
}

.ar-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  cursor: crosshair;
}

.ar-header {
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 10;
  pointer-events: none;
}

.ar-header h2 {
  color: rgba(255, 255, 255, 0.9);
  font-size: 20px;
  margin: 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.ar-header p {
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
  margin: 4px 0 0;
}

.camera-error {
  position: absolute;
  top: 70px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(245, 158, 11, 0.2);
  border: 1px solid rgba(245, 158, 11, 0.4);
  color: #fbbf24;
  padding: 6px 16px;
  border-radius: 6px;
  font-size: 12px;
  z-index: 10;
}

.ar-toolbar {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 10;
}

.obj-types {
  display: flex;
  gap: 6px;
  background: rgba(0, 0, 0, 0.6);
  padding: 6px;
  border-radius: 10px;
  backdrop-filter: blur(8px);
}

.obj-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 14px;
  background: transparent;
  border: 1px solid transparent;
  color: rgba(255, 255, 255, 0.6);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
}

.obj-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.obj-btn.active {
  background: rgba(59, 130, 246, 0.3);
  border-color: rgba(59, 130, 246, 0.5);
  color: #fff;
}

.obj-icon {
  font-size: 20px;
}

.obj-label {
  font-size: 10px;
}

.clear-obj-btn {
  padding: 10px 16px;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
  backdrop-filter: blur(8px);
  transition: all 0.15s;
}

.clear-obj-btn:hover {
  background: rgba(239, 68, 68, 0.3);
  color: #fff;
}
</style>

