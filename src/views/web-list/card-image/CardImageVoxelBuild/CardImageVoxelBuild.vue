<template>
  <section ref="parentRef" class="voxel-container">
    <!-- 3D 渲染 Canvas -->
    <canvas ref="canvasRef" class="voxel-canvas"></canvas>

    <!-- 文字信息层 -->
    <div ref="overlayRef" class="content-overlay">
      <div class="pixel-icon">
        <div class="pixel-block" v-for="i in 9" :key="i"></div>
      </div>
      <h2 ref="titleRef" class="title">体素堆叠建造</h2>
      <p ref="subRef" class="subtitle">Voxel Build · 3D Pixel Art</p>
      <div class="divider"></div>
      <p ref="descRef" class="desc">8×8 方块阵列 · 逐层飞入 · 视角交互</p>
      <div ref="progressRef" class="progress-info">
        <span class="layer-count">64 Voxels</span>
        <span class="grid-size">Grid 8×8</span>
      </div>
    </div>

    <!-- 底部地面光 -->
    <div ref="groundGlowRef" class="ground-glow"></div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ==================== 类型 ====================
type TweenCleanup = () => void

interface VoxelColor {
  r: number
  g: number
  b: number
}

interface VoxelData {
  gridX: number
  gridY: number
  color: VoxelColor
  zOffset: number
}

// ==================== 常量 ====================
const GRID_SIZE = 8 // 8×8 体素阵列
const VOXEL_UNIT = 1 // 体素世界坐标单位
const FOCAL_LENGTH = 8 // 透视焦距
const Z_DEPTH = 20 // 体素飞入深度

// ==================== 立方体顶点 & 面定义 ====================
const CUBE_VERTICES: [number, number, number][] = [
  [-0.5, -0.5, 0.5], // 0: 前-下-左
  [0.5, -0.5, 0.5], // 1: 前-下-右
  [0.5, 0.5, 0.5], // 2: 前-上-右
  [-0.5, 0.5, 0.5], // 3: 前-上-左
  [-0.5, -0.5, -0.5], // 4: 后-下-左
  [0.5, -0.5, -0.5], // 5: 后-下-右
  [0.5, 0.5, -0.5], // 6: 后-上-右
  [-0.5, 0.5, -0.5], // 7: 后-上-左
]

interface CubeFace {
  name: string
  normal: [number, number, number]
  verts: number[]
  shade: number
  hasEdge: boolean
}

const CUBE_FACES: CubeFace[] = [
  { name: 'front', normal: [0, 0, 1], verts: [0, 1, 2, 3], shade: 1.0, hasEdge: true },
  { name: 'back', normal: [0, 0, -1], verts: [4, 5, 6, 7], shade: 0.35, hasEdge: false },
  { name: 'top', normal: [0, 1, 0], verts: [3, 2, 6, 7], shade: 1.3, hasEdge: true },
  { name: 'bottom', normal: [0, -1, 0], verts: [0, 1, 5, 4], shade: 0.45, hasEdge: false },
  { name: 'right', normal: [1, 0, 0], verts: [1, 2, 6, 5], shade: 0.7, hasEdge: true },
  { name: 'left', normal: [-1, 0, 0], verts: [0, 3, 7, 4], shade: 0.6, hasEdge: true },
]

// ==================== 状态 ====================
const parentRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const overlayRef = ref<HTMLElement | null>(null)
const groundGlowRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subRef = ref<HTMLElement | null>(null)
const descRef = ref<HTMLElement | null>(null)
const progressRef = ref<HTMLElement | null>(null)

let voxels: VoxelData[] = []
let animationId = 0
let cw = 0
let ch = 0
let cx = 0
let cy = 0
let dpr = 1
let screenScale = 1

// 平滑插值变量
let displayProgress = 0
let targetProgress = 0
let mouseX = 0.5
let mouseY = 0.35
let targetMX = 0.5
let targetMY = 0.35

const cleanupFns: TweenCleanup[] = []
let ro: ResizeObserver | null = null

// ==================== 图片 URL ====================
const imageUrl =
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80'

// ==================== 图像颜色采样 ====================
async function sampleImageColors(url: string): Promise<VoxelColor[]> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = GRID_SIZE
      canvas.height = GRID_SIZE
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, GRID_SIZE, GRID_SIZE)
      const imageData = ctx.getImageData(0, 0, GRID_SIZE, GRID_SIZE)
      const colors: VoxelColor[] = []
      for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
          const idx = (y * GRID_SIZE + x) * 4
          colors.push({
            r: imageData.data[idx],
            g: imageData.data[idx + 1],
            b: imageData.data[idx + 2],
          })
        }
      }
      resolve(colors)
    }
    img.onerror = () => resolve([])
    img.src = url
  })
}

// ==================== 3D 投影 ====================
function rotatePoint(
  wx: number,
  wy: number,
  wz: number,
  rotY: number,
  rotX: number,
) {
  const cosY = Math.cos(rotY),
    sinY = Math.sin(rotY)
  const rx1 = wx * cosY - wz * sinY
  const rz1 = wx * sinY + wz * cosY

  const cosX = Math.cos(rotX),
    sinX = Math.sin(rotX)
  const ry2 = wy * cosX - rz1 * sinX
  const rz2 = wy * sinX + rz1 * cosX

  return { rx: rx1, ry: ry2, rz: rz2 }
}

function projectPoint(
  wx: number,
  wy: number,
  wz: number,
  rotY: number,
  rotX: number,
) {
  const { rx, ry, rz } = rotatePoint(wx, wy, wz, rotY, rotX)
  const depthScale = FOCAL_LENGTH / Math.max(FOCAL_LENGTH + rz, 0.5)
  return {
    sx: cx + rx * screenScale * depthScale,
    sy: cy - ry * screenScale * depthScale,
    depth: rz,
  }
}

// ==================== 面可见性判断 ====================
function isFaceVisible(
  nx: number,
  ny: number,
  nz: number,
  rotY: number,
  rotX: number,
): boolean {
  const cosY = Math.cos(rotY),
    sinY = Math.sin(rotY)
  const rnx1 = nx * cosY - nz * sinY
  const rnz1 = nx * sinY + nz * cosY

  const cosX = Math.cos(rotX),
    sinX = Math.sin(rotX)
  const rnz2 = ny * sinX + rnz1 * cosX

  return rnz2 > 0.005
}

// ==================== 工具函数 ====================
function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v))
}

function shadeColor(c: VoxelColor, factor: number): VoxelColor {
  return {
    r: clamp(Math.round(c.r * factor), 0, 255),
    g: clamp(Math.round(c.g * factor), 0, 255),
    b: clamp(Math.round(c.b * factor), 0, 255),
  }
}

function colorStr(c: VoxelColor): string {
  return `rgb(${c.r},${c.g},${c.b})`
}

// ==================== 弹跳缓动 ====================
function bounceOut(t: number): number {
  const n1 = 7.5625
  const d1 = 2.75
  if (t < 1 / d1) return n1 * t * t
  else if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75
  else if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375
  else return n1 * (t -= 2.625 / d1) * t + 0.984375
}

// ==================== 生成体素数据 ====================
function generateVoxels(colors: VoxelColor[]): VoxelData[] {
  const result: VoxelData[] = []
  const half = (GRID_SIZE - 1) / 2
  for (let gy = 0; gy < GRID_SIZE; gy++) {
    for (let gx = 0; gx < GRID_SIZE; gx++) {
      const colorIdx = gy * GRID_SIZE + gx
      result.push({
        gridX: gx - half, // 居中: -3.5 ~ 3.5
        gridY: gy - half,
        color: colors[colorIdx] || { r: 120, g: 120, b: 120 },
        zOffset: -Z_DEPTH, // 初始深度
      })
    }
  }
  return result
}

// ==================== Canvas 调整大小 ====================
function resize() {
  const canvas = canvasRef.value
  const parent = parentRef.value
  if (!canvas || !parent) return

  const rect = parent.getBoundingClientRect()
  cw = rect.width
  ch = rect.height
  dpr = Math.min(window.devicePixelRatio || 1, 2)

  canvas.width = cw * dpr
  canvas.height = ch * dpr
  canvas.style.width = cw + 'px'
  canvas.style.height = ch + 'px'

  cx = cw / 2
  cy = ch / 2
  screenScale = Math.min(cw, ch) / 9.5
}

// ==================== 绘制地面阴影 ====================
function drawGroundShadows(
  ctx: CanvasRenderingContext2D,
  projected: ReturnType<typeof computeProjected>[],
) {
  for (const p of projected) {
    // 跳过相机后方或超出范围的体素（depth <= -FOCAL_LENGTH 导致 scale 为负）
    if (p.depth > 3 || p.depth <= -FOCAL_LENGTH + 1) continue
    const scale = FOCAL_LENGTH / (FOCAL_LENGTH + p.depth)
    const sx = cx + p.centerRx * screenScale * scale
    const sy = cy + screenScale * (GRID_SIZE / 2 + 0.6)
    const shadowW = screenScale * 0.55 * scale
    const shadowH = screenScale * 0.22 * scale

    ctx.beginPath()
    ctx.ellipse(sx, sy, shadowW, shadowH, 0, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(0,0,0,${0.08 + 0.06 * (1 - scale)})`
    ctx.fill()
  }
}

// ==================== 预计算投影数据（用于排序和中枢） ====================
function computeProjected(v: VoxelData, rotY: number, rotX: number) {
  const worldX = v.gridX * VOXEL_UNIT
  const worldY = v.gridY * VOXEL_UNIT
  const worldZ = v.zOffset

  const { rx, ry, rz } = rotatePoint(worldX, worldY, worldZ, rotY, rotX)
  const depthScale = FOCAL_LENGTH / (FOCAL_LENGTH + rz)

  return {
    voxel: v,
    centerRx: rx,
    centerRy: ry,
    depth: rz,
    depthScale,
  }
}

// ==================== 绘制单个体素方块 ====================
function drawVoxelCube(
  ctx: CanvasRenderingContext2D,
  proj: ReturnType<typeof computeProjected>,
  rotY: number,
  rotX: number,
) {
  const v = proj.voxel
  const worldX = v.gridX * VOXEL_UNIT
  const worldY = v.gridY * VOXEL_UNIT
  const worldZ = v.zOffset

  // 投影 8 个顶点
  const projectedVerts = CUBE_VERTICES.map(([vx, vy, vz]) =>
    projectPoint(worldX + vx, worldY + vy, worldZ + vz, rotY, rotX),
  )

  // 绘制每个可见面
  const drawnFaces: { face: CubeFace; polys: typeof projectedVerts }[] = []

  for (const face of CUBE_FACES) {
    if (!isFaceVisible(face.normal[0], face.normal[1], face.normal[2], rotY, rotX))
      continue

    const polys = face.verts.map((i) => projectedVerts[i])
    drawnFaces.push({ face, polys })
  }

  // 按深度排面（底面先画）
  drawnFaces.sort((a, b) => {
    const az =
      a.polys.reduce((s, p) => s + p.depth, 0) / a.polys.length
    const bz =
      b.polys.reduce((s, p) => s + p.depth, 0) / b.polys.length
    return az - bz
  })

  for (const { face, polys } of drawnFaces) {
    const fc = shadeColor(v.color, face.shade)

    // 填充面
    ctx.beginPath()
    ctx.moveTo(polys[0].sx, polys[0].sy)
    for (let i = 1; i < polys.length; i++) {
      ctx.lineTo(polys[i].sx, polys[i].sy)
    }
    ctx.closePath()
    ctx.fillStyle = colorStr(fc)
    ctx.fill()

    // 高光边
    if (face.hasEdge) {
      const outline = shadeColor(v.color, face.shade * 1.08)
      ctx.strokeStyle = colorStr(outline)
      ctx.lineWidth = 0.6
      ctx.stroke()

      // 内部像素感线条
      ctx.strokeStyle = `rgba(255,255,255,0.06)`
      ctx.lineWidth = 0.3
      ctx.stroke()
    }
  }
}

// ==================== 绘制背景粒子 ====================
let dustParticles: { x: number; y: number; r: number; vx: number; vy: number; alpha: number }[] = []

function initDust() {
  dustParticles = []
  for (let i = 0; i < 30; i++) {
    dustParticles.push({
      x: Math.random() * cw,
      y: Math.random() * ch,
      r: 0.5 + Math.random() * 1.2,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -0.2 - Math.random() * 0.4,
      alpha: 0.15 + Math.random() * 0.2,
    })
  }
}

function drawDust(ctx: CanvasRenderingContext2D) {
  for (const d of dustParticles) {
    d.x += d.vx
    d.y += d.vy
    if (d.y < -10) {
      d.y = ch + 10
      d.x = Math.random() * cw
    }
    if (d.x < -10) d.x = cw + 10
    if (d.x > cw + 10) d.x = -10

    ctx.beginPath()
    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(120,180,240,${d.alpha})`
    ctx.fill()
  }
}

// ==================== 主渲染循环 ====================
function render() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // 平滑插值
  displayProgress += (targetProgress - displayProgress) * 0.075
  mouseX += (targetMX - mouseX) * 0.05
  mouseY += (targetMY - mouseY) * 0.05

  // 摄像机旋转（鼠标视差）
  const rotY = (mouseX - 0.5) * 0.65 // -0.325 ~ 0.325
  const rotX = 0.38 + (0.5 - mouseY) * 0.35 // 0.205 ~ 0.555

  ctx.save()
  ctx.scale(dpr, dpr)

  // 背景渐变
  const bgGrad = ctx.createRadialGradient(cx, cy * 0.4, 0, cx, cy, Math.max(cw, ch))
  bgGrad.addColorStop(0, '#1a2230')
  bgGrad.addColorStop(0.5, '#0f151e')
  bgGrad.addColorStop(1, '#080c12')
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, cw, ch)

  // 地面参考线
  ctx.strokeStyle = 'rgba(255,255,255,0.03)'
  ctx.lineWidth = 0.5
  for (let i = -GRID_SIZE; i <= GRID_SIZE; i++) {
    const sx1 = cx + (i - GRID_SIZE / 2) * screenScale * 0.6
    const sy1 = cy + screenScale * (GRID_SIZE / 2 + 0.7)
    const sx2 = cx + (i + GRID_SIZE / 2) * screenScale * 0.6
    const sy2 = cy - screenScale * (GRID_SIZE / 2 - 0.7)
    ctx.beginPath()
    ctx.moveTo(sx1, sy1)
    ctx.lineTo(sx2, sy2)
    ctx.stroke()
  }

  // 更新体素 Z 偏移
  for (const v of voxels) {
    const gyIdx = v.gridY + (GRID_SIZE - 1) / 2 // 恢复到 0~7
    const layerStart = (gyIdx / (GRID_SIZE - 1)) * 0.78
    const dur = 0.24
    const lp = clamp((displayProgress - layerStart) / dur, 0, 1)
    const eased = bounceOut(lp)
    v.zOffset = -Z_DEPTH + Z_DEPTH * eased
  }

  // 计算所有体素的投影
  const projected = voxels.map((v) => computeProjected(v, rotY, rotX))

  // 深度排序（远→近）
  projected.sort((a, b) => a.depth - b.depth)

  // 地面阴影
  drawGroundShadows(ctx, projected)

  // 绘制体素（跳过相机后方的体素）
  for (const p of projected) {
    if (p.depth <= -FOCAL_LENGTH + 0.5) continue
    drawVoxelCube(ctx, p, rotY, rotX)
  }

  // 尘埃粒子
  drawDust(ctx)

  ctx.restore()

  animationId = requestAnimationFrame(render)
}

// ==================== 初始化 ====================
onMounted(async () => {
  if (!parentRef.value) return

  resize()
  initDust()

  // 采样图像颜色
  const colors = await sampleImageColors(imageUrl)
  voxels = generateVoxels(colors)

  // 初始隐藏文字
  gsap.set([overlayRef.value, groundGlowRef.value], { opacity: 0 })
  gsap.set(groundGlowRef.value, { opacity: 0 })

  // ScrollTrigger 驱动进度
  const st = ScrollTrigger.create({
    trigger: parentRef.value,
    start: 'top 85%',
    end: 'bottom 15%',
    onUpdate: (self) => {
      targetProgress = self.progress
    },
  })
  cleanupFns.push(() => st.kill())

  // 文字渐显
  const textTl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 75%',
      end: 'top 30%',
      scrub: 1.2,
    },
  })
  textTl.to(overlayRef.value, { opacity: 1, duration: 0.8 }, 0)
  textTl.to(groundGlowRef.value, { opacity: 0.4, duration: 0.6 }, 0.3)
  cleanupFns.push(() => {
    textTl.scrollTrigger?.kill()
    textTl.kill()
  })

  // 鼠标跟踪
  const onMouse = (e: MouseEvent) => {
    targetMX = e.clientX / window.innerWidth
    targetMY = e.clientY / window.innerHeight
  }
  window.addEventListener('mousemove', onMouse, { passive: true })
  cleanupFns.push(() => window.removeEventListener('mousemove', onMouse))

  // Resize 监听
  ro = new ResizeObserver(() => {
    resize()
    initDust()
  })
  ro.observe(parentRef.value)

  // 启动渲染
  animationId = requestAnimationFrame(render)
})

// ==================== 清理 ====================
onUnmounted(() => {
  cancelAnimationFrame(animationId)
  cleanupFns.forEach((fn) => fn())
  ro?.disconnect()
})
</script>

<style lang="scss" scoped>
/* ==================== 容器 ==================== */
.voxel-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #080c12;
}

.voxel-canvas {
  position: absolute;
  inset: 0;
  z-index: 1;
}

/* ==================== 地面光晕 ==================== */
.ground-glow {
  position: absolute;
  left: 50%;
  bottom: 5%;
  transform: translateX(-50%);
  width: 60vw;
  height: 12vh;
  z-index: 2;
  pointer-events: none;
  background: radial-gradient(
    ellipse 80% 100% at 50% 100%,
    rgba(60, 140, 220, 0.18) 0%,
    rgba(40, 100, 180, 0.08) 50%,
    transparent 100%
  );
  will-change: opacity;
}

/* ==================== 文字信息层 ==================== */
.content-overlay {
  position: absolute;
  inset: 0;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  will-change: opacity;
}

/* 像素图标 */
.pixel-icon {
  display: grid;
  grid-template-columns: repeat(3, 8px);
  grid-template-rows: repeat(3, 8px);
  gap: 2px;
  margin-bottom: 20px;
}

.pixel-block {
  width: 8px;
  height: 8px;
  background: rgba(100, 180, 255, 0.7);
  border-radius: 1px;
  box-shadow: 0 0 6px rgba(100, 180, 255, 0.3);

  &:nth-child(1),
  &:nth-child(3),
  &:nth-child(7),
  &:nth-child(9) {
    background: rgba(80, 160, 240, 0.4);
  }
  &:nth-child(5) {
    background: rgba(140, 210, 255, 0.9);
    box-shadow: 0 0 10px rgba(140, 210, 255, 0.5);
  }
}

/* 标题 */
.title {
  font-size: 2.6rem;
  font-weight: 800;
  font-family: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  color: rgba(200, 230, 255, 0.95);
  text-shadow:
    0 0 30px rgba(60, 140, 220, 0.5),
    0 2px 4px rgba(0, 0, 0, 0.6);
  margin: 0 0 8px 0;
  letter-spacing: 0.1em;
}

/* 副标题 */
.subtitle {
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(140, 200, 240, 0.75);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  letter-spacing: 0.24em;
  text-transform: uppercase;
  margin: 0 0 14px 0;
}

/* 分隔线 */
.divider {
  width: 50px;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(80, 160, 240, 0.5) 30%,
    rgba(120, 200, 255, 0.8) 50%,
    rgba(80, 160, 240, 0.5) 70%,
    transparent
  );
  margin-bottom: 12px;
}

/* 描述 */
.desc {
  font-size: 0.78rem;
  color: rgba(120, 180, 220, 0.6);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
  letter-spacing: 0.15em;
  margin: 0 0 18px 0;
}

/* 进度信息 */
.progress-info {
  display: flex;
  gap: 24px;
  font-size: 0.72rem;
  color: rgba(100, 160, 210, 0.5);
  letter-spacing: 0.1em;

  span {
    padding: 4px 12px;
    border: 1px solid rgba(80, 160, 240, 0.25);
    border-radius: 3px;
    background: rgba(10, 30, 60, 0.5);
  }
}

/* ==================== 响应式 ==================== */
@media (max-width: 768px) {
  .title {
    font-size: 1.9rem;
  }
  .subtitle {
    font-size: 0.75rem;
  }
  .pixel-icon {
    grid-template-columns: repeat(3, 6px);
    grid-template-rows: repeat(3, 6px);
    gap: 1.5px;
    margin-bottom: 14px;
  }
  .pixel-block {
    width: 6px;
    height: 6px;
  }
  .desc {
    font-size: 0.68rem;
  }
  .progress-info {
    gap: 14px;
    font-size: 0.65rem;
  }
}
</style>
