<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'

// ==================== 模式与主题 ====================
const modes = [
  { id: 'bars', label: '频谱' },
  { id: 'wave', label: '波形' },
  { id: 'circle', label: '环形' },
  { id: 'particles', label: '粒子' }
]

const themes = [
  {
    id: 'neon',
    label: '霓虹',
    preview: 'linear-gradient(90deg, #ff00ff, #00ffff)',
    colors: ['#ff00ff', '#00ffff', '#ffff00']
  },
  {
    id: 'ocean',
    label: '海洋',
    preview: 'linear-gradient(90deg, #0044aa, #00cccc)',
    colors: ['#003388', '#0088aa', '#00cccc']
  },
  {
    id: 'sunset',
    label: '日落',
    preview: 'linear-gradient(90deg, #ff4400, #ffaa00)',
    colors: ['#ff2200', '#ff6600', '#ffaa00']
  },
  {
    id: 'matrix',
    label: '矩阵',
    preview: 'linear-gradient(90deg, #003300, #00ff00)',
    colors: ['#003300', '#00aa00', '#00ff00']
  }
]

// ==================== 状态 ====================
const parentRef = ref<HTMLElement | null>(null)
const controlsRef = ref<HTMLElement | null>(null)
const canvasAreaRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

const isRecording = ref(false)
const activeMode = ref('bars')
const activeTheme = ref('neon')
const sensitivity = ref(1.5)
const volumePercent = ref(0)
const permissionDenied = ref(false)

let audioCtx: AudioContext | null = null
let analyser: AnalyserNode | null = null
let mediaStream: MediaStream | null = null
let rafId = 0
let dataArray: Uint8Array = new Uint8Array(0)
let timeArray: Uint8Array = new Uint8Array(0)

// 粒子系统
interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  life: number
  maxLife: number
  hue: number
}
let particles: Particle[] = []

// ==================== 麦克风控制 ====================
const toggleRecording = async () => {
  if (isRecording.value) {
    stopRecording()
  } else {
    await startRecording()
  }
}

const startRecording = async () => {
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true })
    audioCtx = new AudioContext()
    analyser = audioCtx.createAnalyser()
    analyser.fftSize = 512
    analyser.smoothingTimeConstant = 0.8

    const source = audioCtx.createMediaStreamSource(mediaStream)
    source.connect(analyser)

    const bufferLength = analyser.frequencyBinCount
    dataArray = new Uint8Array(bufferLength)
    timeArray = new Uint8Array(analyser.fftSize)

    isRecording.value = true
    permissionDenied.value = false
    draw()
  } catch {
    permissionDenied.value = true
  }
}

const stopRecording = () => {
  isRecording.value = false
  cancelAnimationFrame(rafId)
  mediaStream?.getTracks().forEach((t) => t.stop())
  audioCtx?.close()
  audioCtx = null
  analyser = null
  mediaStream = null
}

// ==================== 绘制循环 ====================
const draw = () => {
  if (!isRecording.value || !analyser || !canvasRef.value) {
    return
  }

  analyser.getByteFrequencyData(dataArray)
  analyser.getByteTimeDomainData(timeArray)

  // 计算音量
  let sum = 0
  for (let i = 0; i < dataArray.length; i++) {
    sum += dataArray[i]
  }
  volumePercent.value = Math.min(100, (sum / dataArray.length / 255) * 100 * sensitivity.value * 2)

  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')!
  const w = canvas.width
  const h = canvas.height

  ctx.clearRect(0, 0, w, h)

  const theme = themes.find((t) => t.id === activeTheme.value)!
  const colors = theme.colors

  switch (activeMode.value) {
    case 'bars':
      drawBars(ctx, w, h, colors)
      break
    case 'wave':
      drawWave(ctx, w, h, colors)
      break
    case 'circle':
      drawCircle(ctx, w, h, colors)
      break
    case 'particles':
      drawParticles(ctx, w, h, colors)
      break
  }

  rafId = requestAnimationFrame(draw)
}

// ==================== 频谱柱状图 ====================
const drawBars = (ctx: CanvasRenderingContext2D, w: number, h: number, colors: string[]) => {
  const len = dataArray.length
  const barWidth = (w / len) * 2
  const s = sensitivity.value

  for (let i = 0; i < len; i++) {
    const val = dataArray[i] * s
    const barH = (val / 255) * h * 0.85
    const x = i * barWidth
    const t = i / len

    const gradient = ctx.createLinearGradient(x, h, x, h - barH)
    gradient.addColorStop(0, colors[0])
    gradient.addColorStop(0.5, colors[1])
    gradient.addColorStop(1, colors[2])

    ctx.fillStyle = gradient
    ctx.beginPath()
    const r = Math.min(barWidth / 2 - 1, 4)
    const bx = x + 1
    const by = h - barH
    const bw = Math.max(1, barWidth - 2)
    const bh = barH

    if (bh > r * 2) {
      ctx.moveTo(bx + r, by)
      ctx.arcTo(bx + bw, by, bx + bw, by + bh, r)
      ctx.lineTo(bx + bw, by + bh)
      ctx.lineTo(bx, by + bh)
      ctx.arcTo(bx, by, bx + bw, by, r)
    } else {
      ctx.rect(bx, by, bw, bh)
    }
    ctx.fill()

    // 发光
    ctx.shadowColor = colors[1]
    ctx.shadowBlur = 4
    ctx.fill()
    ctx.shadowBlur = 0
  }
}

// ==================== 波形曲线 ====================
const drawWave = (ctx: CanvasRenderingContext2D, w: number, h: number, colors: string[]) => {
  const len = timeArray.length
  const sliceW = w / len
  const s = sensitivity.value

  ctx.lineWidth = 2.5
  const gradient = ctx.createLinearGradient(0, 0, w, 0)
  gradient.addColorStop(0, colors[0])
  gradient.addColorStop(0.5, colors[1])
  gradient.addColorStop(1, colors[2])
  ctx.strokeStyle = gradient

  ctx.beginPath()
  for (let i = 0; i < len; i++) {
    const v = (timeArray[i] / 128.0 - 1) * s
    const y = h / 2 + v * h * 0.4
    if (i === 0) {
      ctx.moveTo(0, y)
    } else {
      ctx.lineTo(i * sliceW, y)
    }
  }
  ctx.stroke()

  // 填充半透明区域
  ctx.lineTo(w, h / 2)
  ctx.lineTo(0, h / 2)
  ctx.closePath()
  ctx.fillStyle = colors[1] + '15'
  ctx.fill()
}

// ==================== 环形频谱 ====================
const drawCircle = (ctx: CanvasRenderingContext2D, w: number, h: number, colors: string[]) => {
  const cx = w / 2
  const cy = h / 2
  const radius = Math.min(w, h) * 0.25
  const len = dataArray.length
  const s = sensitivity.value

  for (let i = 0; i < len; i++) {
    const val = dataArray[i] * s
    const barH = (val / 255) * radius * 0.8
    const angle = (i / len) * Math.PI * 2 - Math.PI / 2
    const t = i / len

    const x1 = cx + Math.cos(angle) * radius
    const y1 = cy + Math.sin(angle) * radius
    const x2 = cx + Math.cos(angle) * (radius + barH)
    const y2 = cy + Math.sin(angle) * (radius + barH)

    const ci = Math.floor(t * (colors.length - 1))
    ctx.strokeStyle = colors[Math.min(ci, colors.length - 1)]
    ctx.lineWidth = Math.max(1, (Math.PI * 2 * radius) / len - 1)
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
  }

  // 中心圆
  ctx.beginPath()
  ctx.arc(cx, cy, radius * 0.3, 0, Math.PI * 2)
  ctx.fillStyle = colors[1] + '20'
  ctx.strokeStyle = colors[1] + '40'
  ctx.lineWidth = 1
  ctx.fill()
  ctx.stroke()
}

// ==================== 粒子反应器 ====================
const drawParticles = (ctx: CanvasRenderingContext2D, w: number, h: number, colors: string[]) => {
  const s = sensitivity.value
  const cx = w / 2
  const cy = h / 2

  // 根据低频能量生成粒子
  let bass = 0
  for (let i = 0; i < 8; i++) {
    bass += dataArray[i]
  }
  bass = (bass / 8 / 255) * s

  if (bass > 0.1) {
    const count = Math.floor(bass * 6)
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = 1 + bass * 4
      particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed * (0.5 + Math.random()),
        vy: Math.sin(angle) * speed * (0.5 + Math.random()),
        size: 2 + bass * 6,
        life: 1,
        maxLife: 40 + Math.random() * 40,
        hue: Math.random() * 360
      })
    }
  }

  // 限制粒子数
  if (particles.length > 500) {
    particles = particles.slice(-500)
  }

  // 更新 & 绘制
  particles = particles.filter((p) => {
    p.x += p.vx
    p.y += p.vy
    p.vx *= 0.99
    p.vy *= 0.99
    p.life++
    const progress = p.life / p.maxLife
    if (progress >= 1) {
      return false
    }

    const alpha = 1 - progress
    const ci = Math.floor((p.hue / 360) * (colors.length - 1))
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size * (1 - progress * 0.5), 0, Math.PI * 2)
    ctx.fillStyle =
      colors[Math.min(ci, colors.length - 1)] +
      Math.round(alpha * 255)
        .toString(16)
        .padStart(2, '0')
    ctx.fill()
    return true
  })
}

// ==================== Canvas 尺寸 ====================
const resizeCanvas = () => {
  const area = canvasAreaRef.value
  const canvas = canvasRef.value
  if (!area || !canvas) {
    return
  }
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = area.clientWidth * dpr
  canvas.height = area.clientHeight * dpr
  canvas.style.width = `${area.clientWidth}px`
  canvas.style.height = `${area.clientHeight}px`
  const ctx = canvas.getContext('2d')
  ctx?.scale(dpr, dpr)
}

// ==================== 生命周期 ====================
onMounted(() => {
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)

  if (controlsRef.value) {
    gsap.from(controlsRef.value, {
      y: -40,
      opacity: 0,
      duration: 0.5,
      ease: 'power3.out'
    })
  }
})

onUnmounted(() => {
  stopRecording()
  window.removeEventListener('resize', resizeCanvas)
})
</script>

<template>
  <div ref="parentRef" class="voice-visualizer">
    <!-- 控制栏 -->
    <div ref="controlsRef" class="vv-controls">
      <button class="vv-mic-btn" :class="{ recording: isRecording }" @click="toggleRecording">
        <span class="vv-mic-icon">{{ isRecording ? '⏹' : '🎤' }}</span>
        <span>{{ isRecording ? '停止' : '开始' }}</span>
      </button>

      <div class="vv-mode-group">
        <button
          v-for="m in modes"
          :key="m.id"
          class="vv-mode-btn"
          :class="{ active: activeMode === m.id }"
          @click="activeMode = m.id"
        >
          {{ m.label }}
        </button>
      </div>

      <div class="vv-theme-group">
        <div
          v-for="t in themes"
          :key="t.id"
          class="vv-theme-dot"
          :class="{ active: activeTheme === t.id }"
          :style="{ background: t.preview }"
          :title="t.label"
          @click="activeTheme = t.id"
        ></div>
      </div>

      <div class="vv-sensitivity">
        <label>灵敏度</label>
        <input
          v-model.number="sensitivity"
          type="range"
          min="0.5"
          max="3"
          step="0.1"
          class="vv-slider"
        />
      </div>
    </div>

    <!-- 可视化画布 -->
    <div ref="canvasAreaRef" class="vv-canvas-area">
      <canvas ref="canvasRef" class="vv-canvas"></canvas>

      <!-- 待机动画 -->
      <div v-show="!isRecording" class="vv-idle">
        <div
          v-for="i in 3"
          :key="i"
          class="vv-idle-ring"
          :style="{ animationDelay: `${i * 0.4}s` }"
        ></div>
        <div class="vv-idle-text">
          {{ permissionDenied ? '🔇 麦克风权限被拒绝' : '点击麦克风开始' }}
        </div>
      </div>

      <!-- 音量指示 -->
      <div v-show="isRecording" class="vv-volume-bar">
        <div class="vv-volume-fill" :style="{ height: volumePercent + '%' }"></div>
        <span class="vv-volume-label">{{ Math.round(volumePercent) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.voice-visualizer {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: radial-gradient(ellipse at 50% 80%, #141432 0%, #0a0a18 100%);
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  font-family: 'Segoe UI', sans-serif;
}

// ==================== 控制栏 ====================
.vv-controls {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 20px;
  background: rgba(10, 10, 30, 0.7);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  flex-wrap: wrap;
  z-index: 10;
}

.vv-mic-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  border: 1px solid rgba(100, 200, 255, 0.25);
  border-radius: 24px;
  background: rgba(100, 200, 255, 0.08);
  color: #8cf;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.25s;

  &:hover {
    background: rgba(100, 200, 255, 0.15);
    box-shadow: 0 0 20px rgba(100, 200, 255, 0.15);
  }

  &.recording {
    background: rgba(255, 80, 80, 0.15);
    border-color: rgba(255, 80, 80, 0.4);
    color: #f88;
    animation: vv-pulse 1.5s ease-in-out infinite;
  }
}

@keyframes vv-pulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(255, 80, 80, 0.3);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(255, 80, 80, 0);
  }
}

.vv-mic-icon {
  font-size: 18px;
}

.vv-mode-group {
  display: flex;
  gap: 4px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 8px;
  padding: 2px;
}

.vv-mode-btn {
  padding: 5px 12px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #889;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s;

  &.active {
    background: rgba(100, 180, 255, 0.2);
    color: #8cf;
  }

  &:hover:not(.active) {
    color: #bbc;
  }
}

.vv-theme-group {
  display: flex;
  gap: 6px;
}

.vv-theme-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s;

  &.active {
    border-color: #fff;
    transform: scale(1.2);
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
  }
}

.vv-sensitivity {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #667;
  font-size: 12px;
  margin-left: auto;
}

.vv-slider {
  width: 70px;
  accent-color: #648cff;
}

// ==================== 画布区域 ====================
.vv-canvas-area {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.vv-canvas {
  position: absolute;
  inset: 0;
}

// ==================== 待机动画 ====================
.vv-idle {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.vv-idle-ring {
  position: absolute;
  width: 100px;
  height: 100px;
  border: 1px solid rgba(100, 180, 255, 0.15);
  border-radius: 50%;
  animation: vv-idle-breathe 3s ease-in-out infinite;
}

@keyframes vv-idle-breathe {
  0%,
  100% {
    transform: scale(0.8);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.3);
    opacity: 0.08;
  }
}

.vv-idle-text {
  position: relative;
  color: #556;
  font-size: 14px;
  z-index: 1;
}

// ==================== 音量指示 ====================
.vv-volume-bar {
  position: absolute;
  right: 16px;
  top: 16px;
  bottom: 16px;
  width: 6px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 3px;
  overflow: hidden;
  display: flex;
  flex-direction: column-reverse;
}

.vv-volume-fill {
  width: 100%;
  background: linear-gradient(to top, #00cc88, #ffcc00, #ff4444);
  border-radius: 3px;
  transition: height 0.1s;
}

.vv-volume-label {
  position: absolute;
  right: 14px;
  top: 4px;
  font-size: 9px;
  color: #556;
  font-family: 'Consolas', monospace;
}
</style>


