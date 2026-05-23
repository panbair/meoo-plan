<template>
  <div class="card-image-particle-sculpture" ref="parentRef">
    <!-- Canvas 渲染层 -->
    <canvas class="sculpture-canvas" ref="canvasRef"></canvas>

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
  title: { type: String, default: '粒子雕塑' },
  subtitle: { type: String, default: '3D 点云形态变换' },
})

// ==================== 类型 ====================
type TweenCleanup = { revert: () => void }

interface Vec3 {
  x: number
  y: number
  z: number
}

interface Particle {
  sx: number; sy: number; sz: number // 源形状坐标
  tx: number; ty: number; tz: number // 目标形状坐标
  cx: number; cy: number; cz: number // 当前坐标
  px: number; py: number              // 投影屏幕坐标
  size: number
  alpha: number
  scatterVel: { x: number; y: number; z: number }
  phase: number  // 随机相位偏移
}

interface SpatialBucket {
  particles: number[] // 粒子索引
}

// ==================== 引用 ====================
const parentRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const dividerRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)

// ==================== 状态 ====================
let animationId = 0
let globalTime = 0
let scrollProgress = 0
let displayProgress = 0 // 平滑插值后的进度

// 粒子系统
const PARTICLE_COUNT = 4000
let particles: Particle[] = []

// 空间哈希桶（用于最近邻查询，每帧重建）
let spatialBuckets: SpatialBucket[] = []
const BUCKET_SIZE = 55 // 像素

// Canvas 尺寸
let cw = 0
let ch = 0
let cx = 0
let cy = 0
let dpr = 1
let canvasScale = 1 // 缩放粒子坐标系用

// GSAP 清理
let tweens: TweenCleanup[] = []
let ro: ResizeObserver | null = null

// ==================== 3D 形状生成 ====================

// 斐波那契球面分布（均匀覆盖球面）
function fibonacciSphere(samples: number, radius: number, cx: number, cy: number, cz: number): Vec3[] {
  const points: Vec3[] = []
  const phi = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < samples; i++) {
    const y = 1 - (i / (samples - 1)) * 2 // -1 到 1
    const radiusAtY = Math.sqrt(1 - y * y)
    const theta = phi * i
    points.push({
      x: Math.cos(theta) * radiusAtY * radius + cx,
      y: y * radius + cy,
      z: Math.sin(theta) * radiusAtY * radius + cz,
    })
  }
  return points
}

// 椭球体点
function ellipsoidPoints(samples: number, rx: number, ry: number, rz: number, cx: number, cy: number, cz: number): Vec3[] {
  const points: Vec3[] = []
  const phi = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < samples; i++) {
    const yNorm = 1 - (i / (samples - 1)) * 2
    const rNorm = Math.sqrt(1 - yNorm * yNorm)
    const theta = phi * i
    points.push({
      x: Math.cos(theta) * rNorm * rx + cx,
      y: yNorm * ry + cy,
      z: Math.sin(theta) * rNorm * rz + cz,
    })
  }
  return points
}

// 形状 A：人头/半身像
function generateHeadShape(s: number): Vec3[] {
  const points: Vec3[] = []

  // 头部球体（~60% 粒子）
  const headCount = Math.floor(s * 0.6)
  const headPoints = fibonacciSphere(headCount, 0.85, 0, 0.55, 0)

  // 微调面部特征：鼻子区域向前凸、眼窝内凹
  for (const p of headPoints) {
    // 面部前方区域 (z > 0, |y| < 0.3)
    if (p.z > 0.2 && Math.abs(p.y) < 0.35) {
      // 鼻子区域 (z > 0.5, y ≈ -0.1~0.1, |x| < 0.15)
      if (p.z > 0.45 && Math.abs(p.y) < 0.12 && Math.abs(p.x) < 0.18) {
        p.z += 0.15 // 鼻子突出
      }
      // 眼窝区域 (z > 0.5, y ≈ 0.1~0.25, |x| ≈ 0.15~0.3)
      if (p.z > 0.4 && p.y > 0.08 && p.y < 0.28 && Math.abs(p.x) > 0.12 && Math.abs(p.x) < 0.32) {
        p.z -= 0.08 // 眼窝内凹
        // 眉弓突出
        if (p.y > 0.22) p.z += 0.04
      }
    }
    points.push(p)
  }

  // 颈部圆柱（~15% 粒子）
  const neckCount = Math.floor(s * 0.15)
  for (let i = 0; i < neckCount; i++) {
    const angle = Math.random() * Math.PI * 2
    const r = 0.3 + Math.random() * 0.08
    const y = -0.4 - Math.random() * 0.35
    points.push({
      x: Math.cos(angle) * r,
      y: y,
      z: Math.sin(angle) * r,
    })
  }

  // 肩部椭球（~25% 粒子）
  const shoulderCount = Math.floor(s * 0.25)
  const shoulderPoints = ellipsoidPoints(shoulderCount, 1.0, 0.35, 0.45, 0, -0.85, -0.15)
  points.push(...shoulderPoints)

  return points.slice(0, s)
}

// 形状 B：飞鸟
function generateBirdShape(s: number): Vec3[] {
  const points: Vec3[] = []
  const total = s

  // 身体椭球（~35%）
  const bodyCount = Math.floor(total * 0.35)
  const bodyPoints = ellipsoidPoints(bodyCount, 1.0, 0.28, 0.22, 0, 0.15, 0)
  points.push(...bodyPoints)

  // 头部小球（~10%）
  const headCount = Math.floor(total * 0.1)
  const head = fibonacciSphere(headCount, 0.22, 0.75, 0.25, 0)
  points.push(...head)

  // 左翼（~27%）
  const leftWingCount = Math.floor(total * 0.27)
  for (let i = 0; i < leftWingCount; i++) {
    // 参数化翼面：从身体向外扩展，前缘弯曲
    const t = i / leftWingCount
    const span = 0.1 + t * 1.5   // 翼展方向
    const chord = 0.08 + t * 0.32 // 翼弦方向
    const yOff = -0.02 + t * 0.12
    const zExtent = 0.5 + t * 2.3 // Z方向伸展（屏幕深度）
    // 翼面形状：前缘弧形
    const chordFrac = Math.random()
    const xBody = -0.3 + chordFrac * (0.1 + t * 0.15) // X方向微偏

    points.push({
      x: -span - Math.random() * 0.08 * t,
      y: yOff - chordFrac * chord + Math.random() * 0.04,
      z: -zExtent * (0.4 + Math.random() * 0.6),
    })
  }

  // 右翼（~27%）
  const rightWingCount = Math.floor(total * 0.27)
  for (let i = 0; i < rightWingCount; i++) {
    const t = i / rightWingCount
    const span = 0.1 + t * 1.5
    const chord = 0.08 + t * 0.32
    const yOff = -0.02 + t * 0.12
    const zExtent = 0.5 + t * 2.3
    const chordFrac = Math.random()

    points.push({
      x: span + Math.random() * 0.08 * t,
      y: yOff - chordFrac * chord + Math.random() * 0.04,
      z: -zExtent * (0.4 + Math.random() * 0.6),
    })
  }

  // 尾羽（~1%）
  const tailCount = Math.floor(total * 0.01)
  for (let i = 0; i < tailCount; i++) {
    const t = i / tailCount
    points.push({
      x: (Math.random() - 0.5) * 0.4,
      y: -0.15 - Math.random() * 0.2,
      z: -1.5 - t * 1.0,
    })
  }

  return points.slice(0, s)
}

// ==================== 粒子初始化 ====================
function initParticles(): Particle[] {
  const headShape = generateHeadShape(PARTICLE_COUNT)
  const birdShape = generateBirdShape(PARTICLE_COUNT)

  const result: Particle[] = []
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const hs = headShape[i]
    const bs = birdShape[i]
    result.push({
      sx: hs.x, sy: hs.y, sz: hs.z,
      tx: bs.x, ty: bs.y, tz: bs.z,
      cx: hs.x, cy: hs.y, cz: hs.z,
      px: 0, py: 0,
      size: 0.8 + Math.random() * 1.6,
      alpha: 0.55 + Math.random() * 0.45,
      scatterVel: { x: 0, y: 0, z: 0 },
      phase: Math.random() * Math.PI * 2,
    })
  }
  return result
}

// ==================== 3D → 2D 投影 ====================
function project(p: Particle, rotationY: number, scale: number) {
  // Y 轴旋转
  const cosRY = Math.cos(rotationY)
  const sinRY = Math.sin(rotationY)
  const rx = p.cx * cosRY - p.cz * sinRY
  const rz = p.cx * sinRY + p.cz * cosRY

  // 透视投影（弱透视）
  const persp = 1 / (1 + rz * 0.25)
  p.px = cx + rx * scale * persp
  p.py = cy - p.cy * scale * persp
}

// ==================== 空间哈希 ====================
function buildSpatialHash() {
  const cols = Math.ceil(cw / BUCKET_SIZE)
  const rows = Math.ceil(ch / BUCKET_SIZE)
  const bucketCount = cols * rows
  spatialBuckets = Array.from({ length: bucketCount }, () => ({ particles: [] }))

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i]
    const col = Math.floor(p.px / BUCKET_SIZE)
    const row = Math.floor(p.py / BUCKET_SIZE)
    if (col >= 0 && col < cols && row >= 0 && row < rows) {
      spatialBuckets[row * cols + col].particles.push(i)
    }
  }
}

// ==================== 粒子更新 ====================
function updateParticles(progress: number) {
  // 三阶段过渡
  // Phase 1 (0.0-0.25): 散开阶段 — 粒子从源形状散开
  // Phase 2 (0.25-0.75): 飞行阶段 — 粒子飞向目标形状
  // Phase 3 (0.75-1.0): 聚拢阶段 — 粒子精确就位

  const rotationY = progress * Math.PI * 2.2 // 整体 Y 轴旋转
  const scale = canvasScale

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i]

    if (progress < 0.25) {
      // === 散开阶段 ===
      const phaseProgress = progress / 0.25 // 0→1
      // easeOut 散开
      const t = 1 - Math.pow(1 - phaseProgress, 3)

      // 从源位置向外径向散开
      const dist = Math.sqrt(p.sx * p.sx + p.sy * p.sy + p.sz * p.sz) + 0.01
      const nx = p.sx / dist + (Math.sin(i * 3.7 + p.phase) * 0.5)
      const ny = p.sy / dist + (Math.cos(i * 4.1 + p.phase) * 0.5)
      const nz = p.sz / dist + (Math.sin(i * 2.3 + p.phase) * 0.5)
      const nd = Math.sqrt(nx * nx + ny * ny + nz * nz)
      const scatterDist = t * (1.8 + Math.random() * 0.0) // 固定散开距
      const gravity = t * 0.4 // 微重力下落

      p.cx = p.sx + (nx / nd) * scatterDist
      p.cy = p.sy + (ny / nd) * scatterDist - gravity
      p.cz = p.sz + (nz / nd) * scatterDist
    } else if (progress < 0.75) {
      // === 飞行阶段 ===
      const phaseProgress = (progress - 0.25) / 0.5 // 0→1
      // easeInOut
      const t = phaseProgress < 0.5
        ? 2 * phaseProgress * phaseProgress
        : 1 - Math.pow(-2 * phaseProgress + 2, 2) / 2

      // 从散开位置 → 目标位置
      const scatterDist = 1.8 // 与散开阶段一致
      const dist = Math.sqrt(p.sx * p.sx + p.sy * p.sy + p.sz * p.sz) + 0.01
      const nx = p.sx / dist + (Math.sin(i * 3.7 + p.phase) * 0.5)
      const ny = p.sy / dist + (Math.cos(i * 4.1 + p.phase) * 0.5)
      const nz = p.sz / dist + (Math.sin(i * 2.3 + p.phase) * 0.5)
      const nd = Math.sqrt(nx * nx + ny * ny + nz * nz)

      const fromX = p.sx + (nx / nd) * scatterDist
      const fromY = p.sy + (ny / nd) * scatterDist - 0.4
      const fromZ = p.sz + (nz / nd) * scatterDist

      p.cx = fromX + (p.tx - fromX) * t
      p.cy = fromY + (p.ty - fromY) * t
      p.cz = fromZ + (p.tz - fromZ) * t
    } else {
      // === 聚拢阶段 ===
      const phaseProgress = (progress - 0.75) / 0.25 // 0→1
      // easeOut elastic-like
      const t = 1 - Math.pow(1 - phaseProgress, 4)

      p.cx = p.cx + (p.tx - p.cx) * t * 0.5 // 逐步收敛
      p.cy = p.cy + (p.ty - p.cy) * t * 0.5
      p.cz = p.cz + (p.tz - p.cz) * t * 0.5
    }

    // 投影
    project(p, rotationY, scale)
  }

  // 重建空间哈希（用于连线）
  buildSpatialHash()
}

// ==================== 连线绘制 ====================
function drawConnections(ctx: CanvasRenderingContext2D, progress: number) {
  const cols = Math.ceil(cw / BUCKET_SIZE)
  const rows = Math.ceil(ch / BUCKET_SIZE)
  const connectDist = 38
  const connectDistSq = connectDist * connectDist
  let lineCount = 0
  const maxLines = 800 // 限制最大连线数

  // 连接强度：散开阶段弱，飞行和聚拢阶段强
  let connectStrength: number
  if (progress < 0.25) {
    connectStrength = 0.15 + progress / 0.25 * 0.1 // 0.15→0.25
  } else if (progress < 0.75) {
    connectStrength = 0.25 + (progress - 0.25) / 0.5 * 0.35 // 0.25→0.6
  } else {
    connectStrength = 0.6
  }

  // 遍历每个桶及其邻居
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const bucketIdx = row * cols + col
      const bucket = spatialBuckets[bucketIdx]
      if (bucket.particles.length < 2) continue

      // 与同桶及相邻桶中的粒子配对
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = row + dr
          const nc = col + dc
          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue
          const neighborIdx = nr * cols + nc

          // 仅处理 dr/dc 非负的邻居对（避免重复）
          if (neighborIdx < bucketIdx) continue

          const neighbor = spatialBuckets[neighborIdx]

          for (const ai of bucket.particles) {
            for (const bi of neighbor.particles) {
              if (ai >= bi) continue

              const a = particles[ai]
              const b = particles[bi]
              const dx = a.px - b.px
              const dy = a.py - b.py
              const dSq = dx * dx + dy * dy

              if (dSq < connectDistSq) {
                const dist = Math.sqrt(dSq)
                const alpha = (1 - dist / connectDist) * connectStrength * 0.5
                if (alpha < 0.02) continue

                ctx.beginPath()
                ctx.moveTo(a.px, a.py)
                ctx.lineTo(b.px, b.py)
                ctx.strokeStyle = `rgba(130, 210, 255, ${alpha.toFixed(3)})`
                ctx.lineWidth = 0.35
                ctx.stroke()

                lineCount++
                if (lineCount >= maxLines) return
              }
            }
          }
        }
      }
    }
  }
}

// ==================== 绘制 ====================
function drawBackground(ctx: CanvasRenderingContext2D) {
  const bgGrad = ctx.createLinearGradient(0, 0, 0, ch)
  bgGrad.addColorStop(0, '#0a0d15')
  bgGrad.addColorStop(0.5, '#0d1018')
  bgGrad.addColorStop(1, '#080a10')
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, cw, ch)
}

function drawParticles(ctx: CanvasRenderingContext2D) {
  for (const p of particles) {
    const alpha = p.alpha * (0.6 + 0.2 * Math.sin(globalTime * 4 + p.phase))
    const size = p.size * (0.8 + 0.2 * Math.sin(globalTime * 3 + p.phase * 2))

    // 粒子核心
    ctx.beginPath()
    ctx.arc(p.px, p.py, size, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(200, 235, 255, ${(alpha * 0.85).toFixed(3)})`
    ctx.fill()

    // 较大粒子的光晕
    if (size > 1.2) {
      ctx.beginPath()
      ctx.arc(p.px, p.py, size * 2.5, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(130, 210, 255, ${(alpha * 0.12).toFixed(3)})`
      ctx.fill()
    }
  }
}

// ==================== 主循环 ====================
function render() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  globalTime += 0.016

  // 平滑插值显示进度
  displayProgress += (scrollProgress - displayProgress) * 0.08

  // 更新粒子位置
  updateParticles(displayProgress)

  ctx.clearRect(0, 0, cw, ch)

  // 1. 背景
  drawBackground(ctx)

  // 2. 连线（在粒子下方绘制）
  drawConnections(ctx, displayProgress)

  // 3. 粒子
  drawParticles(ctx)

  animationId = requestAnimationFrame(render)
}

// ==================== 尺寸适配 ====================
function resize() {
  const parent = parentRef.value
  const canvas = canvasRef.value
  if (!parent || !canvas) return

  cw = parent.clientWidth
  ch = parent.clientHeight
  dpr = Math.min(window.devicePixelRatio || 1, 1.5) // 粒子数量多，限制 DPR
  cx = cw * 0.5
  cy = ch * 0.5
  canvasScale = Math.min(cw, ch) * 0.28 // 粒子坐标系缩放因子

  canvas.width = cw * dpr
  canvas.height = ch * dpr
  canvas.style.width = cw + 'px'
  canvas.style.height = ch + 'px'

  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }
}

// ==================== 滚动动画 ====================
function setupScrollTriggers() {
  const parent = parentRef.value
  if (!parent) return

  const st = ScrollTrigger.create({
    trigger: parent,
    start: 'top bottom-=5%',
    end: 'bottom top+=5%',
    scrub: 1.5,
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
  particles = initParticles()

  animationId = requestAnimationFrame(render)

  ro = new ResizeObserver(() => resize())
  if (parentRef.value) ro.observe(parentRef.value)

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
.card-image-particle-sculpture {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: inherit;
  background: #0a0d15;
}

.sculpture-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.content-layer {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 32px;
  pointer-events: none;
}

.title {
  font-size: clamp(20px, 3.5vw, 30px);
  font-weight: 700;
  color: #e0f0ff;
  text-align: center;
  letter-spacing: 0.06em;
  text-shadow:
    0 0 10px rgba(150, 200, 255, 0.5),
    0 0 30px rgba(100, 160, 255, 0.3),
    0 0 60px rgba(60, 120, 240, 0.15);
  margin: 0;
}

.divider {
  width: 60px;
  height: 2px;
  margin: 10px auto;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(130, 180, 240, 0.6),
    rgba(170, 210, 255, 0.8),
    rgba(130, 180, 240, 0.6),
    transparent
  );
  box-shadow: 0 0 8px rgba(100, 160, 255, 0.4);
  transform-origin: center;
}

.subtitle {
  font-size: clamp(12px, 1.8vw, 16px);
  color: rgba(160, 200, 230, 0.75);
  text-align: center;
  letter-spacing: 0.04em;
  text-shadow: 0 0 6px rgba(80, 150, 220, 0.25);
  margin: 0;
}

@media (max-width: 480px) {
  .content-layer {
    padding-top: 20px;
  }
  .title {
    font-size: 18px;
  }
  .subtitle {
    font-size: 12px;
  }
}
</style>
