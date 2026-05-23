<template>
  <div class="card-image-coral-paradise" ref="parentRef">
    <!-- Canvas 渲染层 -->
    <canvas class="coral-canvas" ref="canvasRef"></canvas>

    <!-- CSS 焦散光斑叠加层 -->
    <div class="caustic-overlay" ref="causticRef"></div>

    <!-- 内容覆盖层 -->
    <div class="content-layer" ref="contentRef">
      <h2 class="title" ref="titleRef">{{ title }}</h2>
      <div class="divider" ref="dividerRef"></div>
      <p class="subtitle" ref="subtitleRef">{{ subtitle }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ==================== Props ====================
defineProps({
  title: { type: String, default: '珊瑚天堂' },
  subtitle: { type: String, default: '深海荧光生态系统' },
})

// ==================== 类型 ====================
type TweenCleanup = { revert: () => void }

interface CoralBranch {
  x: number
  y: number
  angle: number    // 生长方向 (弧度)
  length: number   // 枝长
  width: number    // 枝粗
  depth: number    // 递归深度
  color: string    // 枝颜色
  children: CoralBranch[]
}

interface PlanktonParticle {
  x: number
  y: number
  size: number
  vx: number
  vy: number
  life: number     // 0-1 生命周期
  phase: number    // 相位偏移
  glow: number     // 发光强度 0.5-1.5
  color: string
}

interface Jellyfish {
  x: number
  y: number
  baseY: number
  driftX: number   // 水平漂移偏移
  size: number
  bellPhase: number // 钟状体收缩相位
  tentaclePhases: number[] // 每条触手的相位
  speed: number
  opacity: number
}

interface CausticSpot {
  x: number
  y: number
  size: number
  opacity: number
  phase: number
  verts: { x: number; y: number }[] // 多边形顶点
}

// ==================== 引用 ====================
const parentRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const dividerRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const causticRef = ref<HTMLElement | null>(null)

// ==================== 状态 ====================
let animationId = 0
let globalTime = 0
let scrollProgress = 0

// 珊瑚 L-system
let corals: CoralBranch[] = []
// 预缓存的扁平化珊瑚分支（仅 depth=0 的根节点，避免每帧递归）
let cachedCoralRoots: CoralBranch[] = []
// 荧光浮游生物
let planktons: PlanktonParticle[] = []
// 水母
let jellyfishes: Jellyfish[] = []
// 焦散光斑
let causticSpots: CausticSpot[] = []
// 海底砂粒预生成位置
let sandGrains: { x: number; y: number; r: number }[] = []

// Canvas 尺寸
let cw = 0
let ch = 0
let cx = 0
let cy = 0
let dpr = 1

// GSAP 清理
let tweens: TweenCleanup[] = []
let ro: ResizeObserver | null = null

// ==================== L-System 珊瑚生成 ====================
// 分支规则: F → F[+F]F[-F][F] 概率型
function generateBranch(
  x: number, y: number, angle: number,
  length: number, width: number, depth: number,
  maxDepth: number, baseColor: string
): CoralBranch {
  const branch: CoralBranch = {
    x, y, angle, length, width, depth,
    color: baseColor,
    children: [],
  }

  if (depth >= maxDepth || length < 3 || width < 0.4) return branch

  // 子枝数量：深度越深越少
  const childCount = depth === 0 ? 4 : depth <= 2 ? 3 : 2

  for (let i = 0; i < childCount; i++) {
    // 分支角度偏移
    const spreadAngle = (Math.PI / 5) * (0.6 + Math.random() * 0.8)
    const childAngle = angle - spreadAngle / 2 + (spreadAngle / (childCount - 1)) * i + (Math.random() - 0.5) * 0.25

    // 子枝生长点（沿父枝分布）
    const growthRatio = 0.55 + Math.random() * 0.4
    const childX = x + Math.cos(angle) * length * growthRatio
    const childY = y - Math.sin(angle) * length * growthRatio

    // 子枝长度
    const childLength = length * (0.45 + Math.random() * 0.3)
    // 子枝粗度
    const childWidth = width * 0.65

    // 颜色变化：每次分支微微变亮
    const colorShift = 20 + Math.random() * 20
    const childColor = adjustBrightness(baseColor, colorShift)

    branch.children.push(
      generateBranch(childX, childY, childAngle, childLength, childWidth, depth + 1, maxDepth, childColor)
    )
  }

  return branch
}

function adjustBrightness(hex: string, amount: number): string {
  const r = Math.round(Math.min(255, Math.max(0, parseInt(hex.slice(1, 3), 16) + amount)))
  const g = Math.round(Math.min(255, Math.max(0, parseInt(hex.slice(3, 5), 16) + amount)))
  const b = Math.round(Math.min(255, Math.max(0, parseInt(hex.slice(5, 7), 16) + amount)))
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

// 递归收集所有分支（扁平化用于绘制）
function flattenCorals(root: CoralBranch): CoralBranch[] {
  const result: CoralBranch[] = [root]
  for (const child of root.children) {
    result.push(...flattenCorals(child))
  }
  return result
}

// 生成全部珊瑚丛
function generateAllCorals(): CoralBranch[] {
  const result: CoralBranch[] = []
  const coralDefs = [
    { xPct: 0.18, color: '#e04090', maxDepth: 5 }, // 粉红珊瑚
    { xPct: 0.35, color: '#30d0a0', maxDepth: 6 }, // 荧光绿珊瑚
    { xPct: 0.50, color: '#f060b0', maxDepth: 5 }, // 粉珊瑚
    { xPct: 0.65, color: '#20e8b0', maxDepth: 6 }, // 绿珊瑚
    { xPct: 0.80, color: '#e050a0', maxDepth: 4 }, // 小粉珊瑚
  ]

  for (const def of coralDefs) {
    const x = cx * def.xPct + (Math.random() - 0.5) * 40
    const y = ch * 1.05 // 底部以下
    const angle = Math.PI / 2 + (Math.random() - 0.5) * 0.35 // 朝上为主
    const len = ch * (0.45 + Math.random() * 0.2)
    const wid = 3.5 + Math.random() * 3

    result.push(generateBranch(x, y, angle, len, wid, 0, def.maxDepth, def.color))
  }
  return result
}

// ==================== 粒子系统初始化 ====================
function initPlanktons(): PlanktonParticle[] {
  const count = 200
  const result: PlanktonParticle[] = []
  const colors = [
    '#66ffaa', '#33ee88', '#44ffcc', '#22dd66', '#88ffbb',
    '#44aaff', '#3388ee', '#55ccff', '#2299dd', '#66bbff',
  ]

  for (let i = 0; i < count; i++) {
    result.push({
      x: Math.random() * cw,
      y: Math.random() * ch,
      size: 0.6 + Math.random() * 2.2,
      vx: (Math.random() - 0.5) * 0.35,
      vy: -(Math.random() * 0.25 + 0.05), // 微弱上升流
      life: Math.random(),
      phase: Math.random() * Math.PI * 2,
      glow: 0.5 + Math.random(),
      color: colors[Math.floor(Math.random() * colors.length)],
    })
  }
  return result
}

// ==================== 水母初始化 ====================
function initJellyfishes(): Jellyfish[] {
  const count = 4
  const result: Jellyfish[] = []
  for (let i = 0; i < count; i++) {
    const tentacleCount = 6 + Math.floor(Math.random() * 5)
    result.push({
      x: Math.random() * cw,
      y: ch * (0.2 + Math.random() * 0.5),
      baseY: ch * (0.2 + Math.random() * 0.5),
      driftX: 0,
      size: 0.7 + Math.random() * 1.1,
      bellPhase: Math.random() * Math.PI * 2,
      tentaclePhases: Array.from({ length: tentacleCount }, () => Math.random() * Math.PI * 2),
      speed: 0.15 + Math.random() * 0.3,
      opacity: 0.3 + Math.random() * 0.5,
    })
  }
  return result
}

// ==================== 焦散光斑初始化 ====================
function initCausticSpots(): CausticSpot[] {
  const count = 16
  const result: CausticSpot[] = []
  for (let i = 0; i < count; i++) {
    // 随机多边形顶点
    const vertCount = 4 + Math.floor(Math.random() * 3)
    const verts: { x: number; y: number }[] = []
    for (let v = 0; v < vertCount; v++) {
      const angle = (Math.PI * 2 * v) / vertCount + (Math.random() - 0.5) * 0.4
      const r = 8 + Math.random() * 16
      verts.push({ x: Math.cos(angle) * r, y: Math.sin(angle) * r * (0.5 + Math.random() * 0.5) })
    }
    result.push({
      x: Math.random() * cw,
      y: Math.random() * ch * 0.7,
      size: 6 + Math.random() * 20,
      opacity: 0.05 + Math.random() * 0.18,
      phase: Math.random() * Math.PI * 2,
      verts,
    })
  }
  return result
}

// ==================== 绘制函数 ====================
function drawCoralBranch(ctx: CanvasRenderingContext2D, branch: CoralBranch, progress: number) {
  if (branch.depth > 6) return

  const growthAmount = Math.min(1, Math.max(0, (progress - branch.depth * 0.08) * 3.5))
  if (growthAmount <= 0) return

  const endX = branch.x + Math.cos(branch.angle) * branch.length * growthAmount
  const endY = branch.y - Math.sin(branch.angle) * branch.length * growthAmount

  // 渐变：粗→细
  const growWidth = branch.width * growthAmount
  if (growWidth < 0.15) return

  const grad = ctx.createLinearGradient(branch.x, branch.y, endX, endY)
  grad.addColorStop(0, branch.color)
  const tipColor = lightenColor(branch.color, 30)
  grad.addColorStop(1, tipColor)

  ctx.beginPath()
  ctx.moveTo(branch.x, branch.y)
  ctx.lineTo(endX, endY)
  ctx.strokeStyle = grad
  ctx.lineWidth = growWidth
  ctx.lineCap = 'round'
  ctx.shadowColor = branch.color
  ctx.shadowBlur = growWidth * 3
  ctx.stroke()
  ctx.shadowBlur = 0

  // 分支节点（小圆点连接处）
  ctx.beginPath()
  ctx.arc(branch.x, branch.y, growWidth * 1.5, 0, Math.PI * 2)
  ctx.fillStyle = branch.color
  ctx.fill()

  // 终点荧光亮点
  if (branch.depth >= 4 || branch.children.length === 0) {
    ctx.beginPath()
    ctx.arc(endX, endY, growWidth * 2.2, 0, Math.PI * 2)
    ctx.fillStyle = tipColor
    ctx.shadowColor = tipColor
    ctx.shadowBlur = growWidth * 6
    ctx.fill()
    ctx.shadowBlur = 0
  }

  // 绘制子枝
  for (const child of branch.children) {
    drawCoralBranch(ctx, child, progress)
  }
}

function lightenColor(hex: string, amount: number): string {
  const r = Math.round(Math.min(255, Math.max(0, parseInt(hex.slice(1, 3), 16) + amount)))
  const g = Math.round(Math.min(255, Math.max(0, parseInt(hex.slice(3, 5), 16) + amount)))
  const b = Math.round(Math.min(255, Math.max(0, parseInt(hex.slice(5, 7), 16) + amount)))
  return `rgb(${r},${g},${b})`
}

function drawPlanktons(ctx: CanvasRenderingContext2D, time: number) {
  for (const p of planktons) {
    // 浮游生物脉冲
    const pulse = 0.5 + 0.5 * Math.sin(time * 3 + p.phase)
    const currentSize = p.size * (0.6 + 0.4 * pulse * p.glow)

    if (currentSize < 0.25) continue

    // 核心亮点
    ctx.beginPath()
    ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2)
    const coreAlpha = 0.25 + 0.45 * pulse * p.glow
    ctx.fillStyle = p.color.replace(')', `, ${coreAlpha})`).replace('rgb(', 'rgba(')
    // 仅较大粒子使用阴影（shadowBlur 开销大）
    if (currentSize > 1.2) {
      ctx.shadowColor = p.color
      ctx.shadowBlur = currentSize * 3
    }
    ctx.fill()
    ctx.shadowBlur = 0
  }
}

function drawJellyfish(ctx: CanvasRenderingContext2D, jf: Jellyfish, time: number) {
  const s = jf.size * 50
  const bellContract = 0.5 + 0.5 * Math.sin(time * 3.5 + jf.bellPhase) // 0-1 收缩
  const bellW = s * (0.8 + 0.2 * bellContract)
  const bellH = s * (0.6 + 0.4 * (1 - bellContract))

  ctx.save()
  ctx.globalAlpha = jf.opacity * 0.7

  // 钟状体发光光晕
  const glowGrad = ctx.createRadialGradient(jf.x, jf.y - bellH * 0.4, 0, jf.x, jf.y - bellH * 0.4, bellW * 0.9)
  glowGrad.addColorStop(0, 'rgba(150, 220, 255, 0.25)')
  glowGrad.addColorStop(0.5, 'rgba(100, 180, 255, 0.12)')
  glowGrad.addColorStop(1, 'rgba(50, 120, 255, 0)')

  ctx.beginPath()
  ctx.ellipse(jf.x, jf.y, bellW * 0.9, bellH * 1.2, 0, 0, Math.PI * 2)
  ctx.fillStyle = glowGrad
  ctx.fill()

  // 钟状体主体（半透明渐变，底部开口）
  const bellGrad = ctx.createLinearGradient(jf.x, jf.y - bellH, jf.x, jf.y + bellH * 0.1)
  bellGrad.addColorStop(0, 'rgba(200, 230, 255, 0.5)')
  bellGrad.addColorStop(0.5, 'rgba(150, 200, 255, 0.35)')
  bellGrad.addColorStop(1, 'rgba(100, 160, 255, 0.12)')

  // Bell shape: 上半椭球
  ctx.beginPath()
  ctx.ellipse(jf.x, jf.y, bellW, bellH, 0, Math.PI, Math.PI * 2)
  ctx.fillStyle = bellGrad
  ctx.fill()

  // Bell 边缘高光弧
  ctx.beginPath()
  ctx.ellipse(jf.x, jf.y, bellW * 0.85, bellH * 0.5, 0, Math.PI, Math.PI * 2)
  ctx.strokeStyle = 'rgba(220, 240, 255, 0.5)'
  ctx.lineWidth = 1.2
  ctx.stroke()

  // 触手
  const tentacleCount = jf.tentaclePhases.length
  for (let i = 0; i < tentacleCount; i++) {
    const baseX = jf.x + (i - (tentacleCount - 1) / 2) * (bellW * 1.0 / tentacleCount)
    const baseY = jf.y
    const tLen = s * (0.8 + (jf.tentaclePhases[i] % 1) * 0.05)

    const wave = Math.sin(time * 6 + jf.tentaclePhases[i] * 3) * bellW * 0.2
    const wave2 = Math.sin(time * 4 + jf.tentaclePhases[i] * 1.5) * bellW * 0.08

    ctx.beginPath()
    ctx.moveTo(baseX, baseY)
    // Bezier 曲线模拟触手摆动
    const cp1x = baseX + wave * 0.3
    const cp1y = baseY + tLen * 0.35
    const cp2x = baseX + wave * 0.6 + wave2
    const cp2y = baseY + tLen * 0.7
    const endX = baseX + wave + wave2
    const endY = baseY + tLen

    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY)
    ctx.strokeStyle = `rgba(180, 220, 255, ${0.25 + 0.1 * Math.sin(time * 5 + jf.tentaclePhases[i])})`
    ctx.lineWidth = 0.5 + (0.3 * (1 - (i / tentacleCount) * 0.3))
    ctx.stroke()

    // 触手末端小发光点
    ctx.beginPath()
    ctx.arc(endX, endY, 1.2, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(200, 240, 255, 0.5)'
    ctx.fill()
  }

  ctx.restore()
}

function drawCaustics(ctx: CanvasRenderingContext2D, time: number) {
  for (const spot of causticSpots) {
    const pulse = 0.5 + 0.5 * Math.sin(time * 1.5 + spot.phase)
    const alpha = spot.opacity * (0.5 + 0.5 * pulse)

    if (alpha < 0.02) continue

    ctx.save()
    ctx.translate(spot.x, spot.y)
    ctx.rotate(pulse * 0.3) // 微旋转

    ctx.beginPath()
    ctx.moveTo(spot.verts[0].x, spot.verts[0].y)
    for (let i = 1; i < spot.verts.length; i++) {
      ctx.lineTo(spot.verts[i].x, spot.verts[i].y)
    }
    ctx.closePath()

    // 金色焦散光斑，内亮外暗
    const causticGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, spot.size)
    causticGrad.addColorStop(0, `rgba(255, 240, 200, ${alpha})`)
    causticGrad.addColorStop(0.4, `rgba(255, 220, 150, ${alpha * 0.7})`)
    causticGrad.addColorStop(1, `rgba(255, 200, 100, 0)`)

    ctx.fillStyle = causticGrad
    ctx.fill()

    ctx.restore()
  }
}

// 背景：深海渐变 + 微粒子
function drawBackground(ctx: CanvasRenderingContext2D) {
  // 深海渐变
  const bgGrad = ctx.createLinearGradient(0, 0, 0, ch)
  bgGrad.addColorStop(0, '#051530')
  bgGrad.addColorStop(0.3, '#082040')
  bgGrad.addColorStop(0.6, '#0a2850')
  bgGrad.addColorStop(1, '#041020')
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, cw, ch)

  // 远处光柱 / 体积光
  drawVolumeRays(ctx)
}

function drawVolumeRays(ctx: CanvasRenderingContext2D) {
  const rayCount = 3
  for (let i = 0; i < rayCount; i++) {
    const rx = cw * (0.15 + i * 0.35) + Math.sin(globalTime * 0.3 + i) * 25
    const grad = ctx.createLinearGradient(rx, 0, rx, ch * 0.7)
    grad.addColorStop(0, 'rgba(20, 100, 200, 0.06)')
    grad.addColorStop(0.5, 'rgba(10, 60, 150, 0.03)')
    grad.addColorStop(1, 'rgba(0, 20, 60, 0)')

    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.moveTo(rx - 40, 0)
    ctx.lineTo(rx + 20, ch * 0.7)
    ctx.lineTo(rx + 80, ch * 0.7)
    ctx.lineTo(rx + 20, 0)
    ctx.closePath()
    ctx.fill()
  }
}

// 海底沙地
function generateSandGrains() {
  const h = ch * 0.12
  const y = ch - h
  const result: { x: number; y: number; r: number }[] = []
  for (let i = 0; i < 40; i++) {
    result.push({
      x: Math.random() * cw,
      y: y + Math.random() * h,
      r: 0.4 + Math.random() * 0.6,
    })
  }
  return result
}

function drawSeabed(ctx: CanvasRenderingContext2D) {
  const h = ch * 0.12
  const y = ch - h

  // 沙地渐变
  const sandGrad = ctx.createLinearGradient(0, y, 0, ch)
  sandGrad.addColorStop(0, 'rgba(8, 25, 50, 0.9)')
  sandGrad.addColorStop(0.3, 'rgba(5, 18, 35, 0.95)')
  sandGrad.addColorStop(1, 'rgba(2, 10, 20, 1)')

  ctx.fillStyle = sandGrad
  ctx.fillRect(0, y, cw, h)

  // 微小砂粒（预生成位置，仅闪烁）
  for (let i = 0; i < sandGrains.length; i++) {
    const sg = sandGrains[i]
    const flicker = 0.3 + 0.4 * Math.sin(globalTime * 2 + i * 0.7)
    ctx.beginPath()
    ctx.arc(sg.x, sg.y, sg.r, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(50, 100, 180, ${0.08 * flicker})`
    ctx.fill()
  }
}

// ==================== 主循环 ====================
function updateParticles(time: number) {
  for (const p of planktons) {
    // 布朗运动
    p.vx += (Math.random() - 0.5) * 0.04
    p.vy += (Math.random() - 0.5) * 0.03 - 0.001 // 微上升流

    // 阻尼
    p.vx *= 0.998
    p.vy *= 0.998

    // 避免离开画面太远（除底部外）
    p.x += p.vx
    p.y += p.vy

    if (p.x < -20) p.x = cw + 20
    if (p.x > cw + 20) p.x = -20
    if (p.y < -20) p.y = ch + 20
    if (p.y > ch + 5) {
      p.y = ch + 5
      p.vy *= -0.5
    }

    // 生命周期呼吸
    p.life += 0.002
    if (p.life > 1) p.life -= 1
  }
}

function updateJellyfishes(time: number) {
  for (const jf of jellyfishes) {
    // 水平漂移
    jf.driftX += (Math.sin(time * 0.4 + jf.bellPhase) * 0.3 + Math.sin(time * 0.7 + jf.bellPhase * 2) * 0.15) * jf.speed
    jf.x += jf.driftX * 0.02

    // 垂直轻微摆动
    jf.y = jf.baseY + Math.sin(time * 0.6 + jf.bellPhase * 1.3) * 15 * jf.size
    jf.driftX *= 0.95

    // 边界循环
    if (jf.x < -60) jf.x = cw + 60
    if (jf.x > cw + 60) jf.x = -60

    // 滚动影响：越往下滚动水母越活跃
    const activityBoost = 1 + scrollProgress * 1.5
    jf.opacity = (0.3 + scrollProgress * 0.4) * (0.8 + 0.2 * Math.sin(time * 2 + jf.bellPhase))
  }
}

function updateCaustics(time: number) {
  for (const spot of causticSpots) {
    // 焦散光斑随水流漂移
    spot.x += Math.sin(time * 0.8 + spot.phase) * 0.3
    spot.y += Math.cos(time * 0.6 + spot.phase * 1.5) * 0.2

    if (spot.x < -30) spot.x = cw + 30
    if (spot.x > cw + 30) spot.x = -30
    if (spot.y < -30) spot.y = ch * 0.8
    if (spot.y > ch * 0.85) spot.y = -30
  }
}

function render() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  globalTime += 0.016

  ctx.clearRect(0, 0, cw, ch)

  // 1. 背景
  drawBackground(ctx)

  // 2. 焦散光斑
  drawCaustics(ctx, globalTime)

  // 3. 珊瑚（使用缓存的根节点，递归绘制子枝）
  for (const root of cachedCoralRoots) {
    drawCoralBranch(ctx, root, scrollProgress)
  }

  // 4. 海底沙地
  drawSeabed(ctx)

  // 5. 浮游生物
  drawPlanktons(ctx, globalTime)

  // 6. 水母
  for (const jf of jellyfishes) {
    drawJellyfish(ctx, jf, globalTime)
  }

  // 更新
  updateParticles(globalTime)
  updateJellyfishes(globalTime)
  updateCaustics(globalTime)

  animationId = requestAnimationFrame(render)
}

// ==================== 尺寸适配 ====================
function resize() {
  const parent = parentRef.value
  const canvas = canvasRef.value
  if (!parent || !canvas) return

  cw = parent.clientWidth
  ch = parent.clientHeight
  dpr = Math.min(window.devicePixelRatio || 1, 2)
  cx = cw * 0.5
  cy = ch * 0.5

  canvas.width = cw * dpr
  canvas.height = ch * dpr
  canvas.style.width = cw + 'px'
  canvas.style.height = ch + 'px'

  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  // 重新生成珊瑚
  corals = generateAllCorals()
  // 缓存扁平的珊瑚根节点（depth=0），按深度排序子枝
  const allBranches = corals.flatMap(flattenCorals)
  allBranches.sort((a, b) => a.depth - b.depth)
  cachedCoralRoots = allBranches.filter(b => b.depth === 0)
  // 预生成砂粒位置
  sandGrains = generateSandGrains()
  // 重新分布焦散光斑
  causticSpots = initCausticSpots()
}

// ==================== 滚动动画 ====================
function setupScrollTriggers() {
  const parent = parentRef.value
  if (!parent) return

  // 驱动珊瑚生长进度
  const st = ScrollTrigger.create({
    trigger: parent,
    start: 'top bottom-=10%',
    end: 'bottom top+=10%',
    scrub: 1.2,
    onUpdate: (self) => {
      scrollProgress = self.progress
    },
  })
  tweens.push({ revert: () => st.kill() })

  // 标题入场
  if (titleRef.value) {
    const t = gsap.fromTo(titleRef.value,
      { y: 30, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: parent, start: 'top 75%', toggleActions: 'play none none reverse' },
      }
    )
    tweens.push({ revert: () => t.kill() })
  }
  if (dividerRef.value) {
    const t = gsap.fromTo(dividerRef.value,
      { scaleX: 0 },
      {
        scaleX: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: parent, start: 'top 70%', toggleActions: 'play none none reverse' },
      }
    )
    tweens.push({ revert: () => t.kill() })
  }
  if (subtitleRef.value) {
    const t = gsap.fromTo(subtitleRef.value,
      { y: 20, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: parent, start: 'top 68%', toggleActions: 'play none none reverse' },
      }
    )
    tweens.push({ revert: () => t.kill() })
  }
}

// ==================== 生命周期 ====================
onMounted(() => {
  resize()
  planktons = initPlanktons()
  jellyfishes = initJellyfishes()

  animationId = requestAnimationFrame(render)

  ro = new ResizeObserver(() => resize())
  if (parentRef.value) ro.observe(parentRef.value)

  // 延迟设置滚动触发（确保 DOM 就绪）
  requestAnimationFrame(() => {
    setupScrollTriggers()
  })
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  tweens.forEach(t => t.revert())
  tweens = []
  if (ro) {
    ro.disconnect()
    ro = null
  }
  ScrollTrigger.getAll().forEach(st => {
    if (st.vars.trigger === parentRef.value) st.kill()
  })
})
</script>

<style scoped>
.card-image-coral-paradise {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: inherit;
}

.coral-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.caustic-overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background:
    radial-gradient(ellipse 180px 120px at 30% 25%, rgba(255, 220, 140, 0.04) 0%, transparent 70%),
    radial-gradient(ellipse 120px 80px at 70% 18%, rgba(255, 200, 120, 0.03) 0%, transparent 60%),
    radial-gradient(ellipse 140px 100px at 50% 35%, rgba(255, 230, 160, 0.03) 0%, transparent 65%);
}

.content-layer {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 40px;
  pointer-events: none;
}

.title {
  font-size: clamp(20px, 3.5vw, 30px);
  font-weight: 700;
  color: #e8fff0;
  text-align: center;
  letter-spacing: 0.06em;
  text-shadow:
    0 0 10px rgba(100, 255, 180, 0.6),
    0 0 30px rgba(60, 200, 140, 0.35),
    0 0 60px rgba(30, 150, 100, 0.2);
  margin: 0;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.6));
}

.divider {
  width: 60px;
  height: 2px;
  margin: 12px auto;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(100, 255, 180, 0.7),
    rgba(150, 255, 200, 0.9),
    rgba(100, 255, 180, 0.7),
    transparent
  );
  box-shadow: 0 0 8px rgba(100, 255, 180, 0.4);
  transform-origin: center;
}

.subtitle {
  font-size: clamp(12px, 1.8vw, 16px);
  color: rgba(180, 230, 200, 0.8);
  text-align: center;
  letter-spacing: 0.04em;
  text-shadow: 0 0 8px rgba(80, 200, 140, 0.3);
  margin: 0;
}

/* 响应式 */
@media (max-width: 480px) {
  .content-layer {
    padding-top: 24px;
  }
  .title {
    font-size: 20px;
  }
  .subtitle {
    font-size: 12px;
  }
}
</style>
