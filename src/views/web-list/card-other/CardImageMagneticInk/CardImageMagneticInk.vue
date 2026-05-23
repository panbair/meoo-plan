<template>
  <div class="card-image-magnetic-ink" ref="parentRef">
    <!-- Canvas 渲染层 -->
    <canvas
      class="ink-canvas"
      ref="canvasRef"
    ></canvas>

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

// ==================== 类型 ====================
type TweenCleanup = { revert: () => void }

interface Vec2 {
  x: number
  y: number
}

interface IronParticle {
  x: number
  y: number
  life: number
  maxLife: number
  // 种子数据：相对于液滴中心的标准化位置
  seedAngle: number
  seedDist: number
}

// ==================== Props ====================
const props = withDefaults(defineProps<{
  imageUrl?: string
  title?: string
  subtitle?: string
}>(), {
  title: '磁性墨水',
  subtitle: 'Magnetic Ferrofluid'
})

// ==================== Refs ====================
const parentRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const dividerRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)

let cleanupFns: TweenCleanup[] = []

// ==================== 常量 ====================
const DROPLET_SAMPLES = 72      // 液滴边缘采样点
const DROPLET_BASE_R = 130      // 液滴基础半径
const MAX_SPIKE = 75            // 最大尖刺长度
const FIELD_LINES = 22          // 磁感线数量
const FIELD_TRACE_STEPS = 80   // 每条磁感线追踪步数
const IRON_PARTICLE_COUNT = 90 // 铁屑粒子数量

// ==================== 运行时状态 ====================
let animationId = 0
let canvasW = 0
let canvasH = 0
let centerX = 0
let centerY = 0
let dpr = 1

// 液滴变形后的顶点（每帧重新计算）
let dropletVertices: Vec2[] = []

// 铁屑粒子池
let ironParticles: IronParticle[] = []

// ==================== 磁铁参数（ScrollTrigger 驱动） ====================
const magnetState = { orbitAngle: 0 }

// ==================== 2D 磁偶极子场 ====================
/**
 * B(r) = (3(m̂·r̂)r̂ - m̂) / r³
 * 返回磁场向量和场强
 */
function magneticField(px: number, py: number, mx: number, my: number, mAngle: number): { bx: number; by: number; mag: number } {
  const dx = px - mx
  const dy = py - my
  const r2 = dx * dx + dy * dy
  const r = Math.sqrt(r2)
  if (r < 2) return { bx: 0, by: 0, mag: 0 }

  const rHatX = dx / r
  const rHatY = dy / r
  const mHatX = Math.cos(mAngle)
  const mHatY = Math.sin(mAngle)

  const dot = mHatX * rHatX + mHatY * rHatY
  const r3 = r2 * r

  const bx = (3 * dot * rHatX - mHatX) / r3
  const by = (3 * dot * rHatY - mHatY) / r3
  const mag = Math.sqrt(bx * bx + by * by)

  return { bx, by, mag }
}

// ==================== 磁感线追踪 ====================
function traceFieldLine(
  startX: number, startY: number,
  mx: number, my: number, mAngle: number,
  steps: number, stepSize: number, forward: boolean
): Vec2[] {
  const pts: Vec2[] = []
  let x = startX
  let y = startY

  for (let i = 0; i < steps; i++) {
    const { bx, by, mag } = magneticField(x, y, mx, my, mAngle)
    if (mag < 1e-8) break

    const dir = forward ? 1 : -1
    const len = Math.sqrt(bx * bx + by * by)
    x += (bx / len) * stepSize * dir
    y += (by / len) * stepSize * dir

    // 超出画布就停
    if (x < -100 || x > canvasW + 100 || y < -100 || y > canvasH + 100) break

    pts.push({ x, y })
  }

  return pts
}

// ==================== 计算液滴变形顶点 ====================
function computeDropletVertices(dcX: number, dcY: number, mx: number, my: number, mAngle: number): Vec2[] {
  const verts: Vec2[] = []

  for (let i = 0; i < DROPLET_SAMPLES; i++) {
    const a = (i / DROPLET_SAMPLES) * Math.PI * 2
    const normalX = Math.cos(a)
    const normalY = Math.sin(a)

    const surfaceX = dcX + normalX * DROPLET_BASE_R
    const surfaceY = dcY + normalY * DROPLET_BASE_R

    const { bx, by } = magneticField(surfaceX, surfaceY, mx, my, mAngle)

    // 磁场在表面法向上的分量
    const bNormal = bx * normalX + by * normalY

    // 位移：正向（向外）推尖刺，负向（向内）压缩
    const displacement = bNormal * DROPLET_BASE_R * DROPLET_BASE_R * 0.012
    const clamped = Math.max(-DROPLET_BASE_R * 0.35, Math.min(MAX_SPIKE, displacement))

    verts.push({
      x: dcX + normalX * (DROPLET_BASE_R + clamped),
      y: dcY + normalY * (DROPLET_BASE_R + clamped),
    })
  }

  // 平滑处理：相邻顶点做加权平均，防止锯齿
  const smoothed: Vec2[] = []
  for (let i = 0; i < verts.length; i++) {
    const prev = verts[(i - 1 + verts.length) % verts.length]
    const curr = verts[i]
    const next = verts[(i + 1) % verts.length]
    smoothed.push({
      x: prev.x * 0.2 + curr.x * 0.6 + next.x * 0.2,
      y: prev.y * 0.2 + curr.y * 0.6 + next.y * 0.2,
    })
  }

  return smoothed
}

// ==================== 初始化铁屑粒子 ====================
function initIronParticles() {
  ironParticles = []
  for (let i = 0; i < IRON_PARTICLE_COUNT; i++) {
    ironParticles.push({
      x: 0,
      y: 0,
      life: 0,
      maxLife: 1.5 + Math.random() * 2.5,
      seedAngle: Math.random() * Math.PI * 2,
      seedDist: 0.3 + Math.random() * 1.6, // 半径倍数
    })
  }
}

// ==================== Canvas 渲染 ====================
function render() {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const dt = 0.016
  const cx = centerX
  const cy = centerY

  // ---- 磁铁位置（绕液滴下方轨道运动） ----
  const orbitR = 260
  const magnetDepth = 180 // 液滴下方距离
  const mx = cx + Math.cos(magnetState.orbitAngle) * orbitR
  const my = cy + magnetDepth + Math.sin(magnetState.orbitAngle) * orbitR * 0.4
  // 磁矩方向始终指向液滴中心
  const mAngle = Math.atan2(cy - my, cx - mx)

  // ---- 液滴位置（微调：轻微随磁场偏移） ----
  const { bx: pullBx, by: pullBy } = magneticField(cx, cy, mx, my, mAngle)
  const pullStrength = Math.min(1, Math.sqrt(pullBx * pullBx + pullBy * pullBy) * 20000)
  const dcX = cx - pullBx * 3000 * pullStrength
  const dcY = cy - pullBy * 3000 * pullStrength

  // ---- 计算液滴变形 ----
  dropletVertices = computeDropletVertices(dcX, dcY, mx, my, mAngle)

  // ---- 更新铁屑粒子 ----
  for (const p of ironParticles) {
    p.life -= dt
    if (p.life <= 0) {
      // 重生：随机放置在液滴周围
      p.seedAngle = Math.random() * Math.PI * 2
      p.seedDist = 0.3 + Math.random() * 1.6
      p.life = p.maxLife
      p.maxLife = 1.5 + Math.random() * 2.5
    }

    // 粒子位置沿磁感线漂移
    const baseX = dcX + Math.cos(p.seedAngle) * DROPLET_BASE_R * p.seedDist
    const baseY = dcY + Math.sin(p.seedAngle) * DROPLET_BASE_R * p.seedDist
    const { bx, by, mag } = magneticField(baseX, baseY, mx, my, mAngle)

    if (mag > 1e-10) {
      const len = Math.sqrt(bx * bx + by * by)
      const flowSpeed = 0.5 + mag * 8000
      p.x = baseX + (bx / len) * (Math.sin(Date.now() * 0.001 + p.seedAngle * 7) * 20)
      p.y = baseY + (by / len) * (Math.cos(Date.now() * 0.0013 + p.seedAngle * 5) * 20)
    } else {
      p.x = baseX
      p.y = baseY
    }
  }

  // ========== 开始绘制 ==========
  ctx.clearRect(0, 0, canvasW, canvasH)

  // --- 1. 磁感线（先画，最底层） ---
  const northOffset = 12
  for (let i = 0; i < FIELD_LINES; i++) {
    // 北极端点附近均匀分布起点
    const spreadAngle = mAngle + (i / FIELD_LINES - 0.5) * Math.PI * 0.8
    const startX = mx + Math.cos(spreadAngle) * northOffset
    const startY = my + Math.sin(spreadAngle) * northOffset

    // 前向追踪（N→S 方向）
    const forwardPts = traceFieldLine(startX, startY, mx, my, mAngle, FIELD_TRACE_STEPS, 4, true)
    // 反向追踪
    const backwardPts = traceFieldLine(startX, startY, mx, my, mAngle, FIELD_TRACE_STEPS, 4, false)

    const allPts = [...backwardPts.reverse(), { x: startX, y: startY }, ...forwardPts]
    if (allPts.length < 3) continue

    // 绘制发光磁感线
    ctx.save()

    // 主线条
    ctx.beginPath()
    ctx.moveTo(allPts[0].x, allPts[0].y)
    for (let j = 1; j < allPts.length; j++) {
      ctx.lineTo(allPts[j].x, allPts[j].y)
    }

    // 渐变描边：冷白→紫
    const gradient = ctx.createLinearGradient(
      allPts[0].x, allPts[0].y,
      allPts[allPts.length - 1].x, allPts[allPts.length - 1].y
    )
    gradient.addColorStop(0, 'rgba(200,210,255,0.05)')
    gradient.addColorStop(0.25, 'rgba(180,200,255,0.25)')
    gradient.addColorStop(0.5, 'rgba(160,170,255,0.55)')
    gradient.addColorStop(0.75, 'rgba(130,110,220,0.22)')
    gradient.addColorStop(1, 'rgba(100,60,200,0.04)')

    ctx.strokeStyle = gradient
    ctx.lineWidth = 0.8

    // 双层发光
    ctx.shadowColor = 'rgba(150,170,255,0.5)'
    ctx.shadowBlur = 4
    ctx.globalAlpha = 0.6
    ctx.stroke()

    // 细发光芯
    ctx.shadowBlur = 2
    ctx.shadowColor = 'rgba(200,220,255,0.7)'
    ctx.globalAlpha = 0.4
    ctx.lineWidth = 0.4
    ctx.stroke()

    ctx.restore()
  }

  // --- 2. 铁屑粒子（液滴周围发光小点） ---
  for (const p of ironParticles) {
    const progress = p.life / p.maxLife
    const alpha = 0.15 + progress * 0.65
    const sz = 0.6 + progress * 1.8

    // 距离液滴中心的距离决定颜色
    const dd = Math.sqrt(
      (p.x - dcX) ** 2 + (p.y - dcY) ** 2
    ) / DROPLET_BASE_R

    ctx.save()
    ctx.globalAlpha = alpha
    ctx.fillStyle = dd < 0.9
      ? 'rgba(255,255,255,0.85)'
      : dd < 1.3
        ? 'rgba(180,200,255,0.7)'
        : 'rgba(130,160,240,0.5)'
    ctx.shadowColor = dd < 1.0
      ? 'rgba(200,220,255,0.9)'
      : 'rgba(140,160,240,0.5)'
    ctx.shadowBlur = sz * 4 + 2
    ctx.beginPath()
    ctx.arc(p.x, p.y, sz, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  // --- 3. 液滴本体（铁磁流体黑色液团） ---
  if (dropletVertices.length > 3) {
    // 3a. 液滴投影光晕（软阴影，模拟底部发光）
    ctx.save()
    const shadowGrad = ctx.createRadialGradient(dcX, dcY, DROPLET_BASE_R * 0.3, dcX, dcY, DROPLET_BASE_R * 1.8)
    shadowGrad.addColorStop(0, 'rgba(60,80,180,0.08)')
    shadowGrad.addColorStop(0.5, 'rgba(30,40,120,0.04)')
    shadowGrad.addColorStop(1, 'transparent')
    ctx.fillStyle = shadowGrad
    ctx.beginPath()
    const firstV = dropletVertices[0]
    ctx.moveTo(firstV.x, firstV.y)
    for (let i = 1; i < dropletVertices.length; i++) {
      ctx.lineTo(dropletVertices[i].x, dropletVertices[i].y)
    }
    ctx.closePath()
    ctx.fill()
    ctx.restore()

    // 3b. 液滴主体（纯黑 + 微弱紫色渐变）
    ctx.save()
    const bodyGrad = ctx.createRadialGradient(dcX - 10, dcY - 15, DROPLET_BASE_R * 0.1, dcX, dcY, DROPLET_BASE_R * 1.2)
    bodyGrad.addColorStop(0, '#0a0a14')
    bodyGrad.addColorStop(0.6, '#04040c')
    bodyGrad.addColorStop(0.85, '#020208')
    bodyGrad.addColorStop(1, '#010104')

    ctx.fillStyle = bodyGrad
    ctx.beginPath()
    ctx.moveTo(dropletVertices[0].x, dropletVertices[0].y)
    for (let i = 1; i < dropletVertices.length; i++) {
      ctx.lineTo(dropletVertices[i].x, dropletVertices[i].y)
    }
    ctx.closePath()
    ctx.fill()

    // 液滴边缘高光（冷白→紫）
    ctx.strokeStyle = 'rgba(150,170,240,0.25)'
    ctx.lineWidth = 1.5
    ctx.shadowColor = 'rgba(130,150,240,0.35)'
    ctx.shadowBlur = 8
    ctx.stroke()

    // 内发光细线
    ctx.strokeStyle = 'rgba(190,210,255,0.12)'
    ctx.lineWidth = 0.8
    ctx.shadowBlur = 2
    ctx.shadowColor = 'rgba(170,200,255,0.2)'
    ctx.stroke()
    ctx.restore()

    // 3c. 液滴表面反射高光
    ctx.save()
    const highlightGrad = ctx.createRadialGradient(dcX - 25, dcY - 40, DROPLET_BASE_R * 0.05, dcX - 10, dcY - 20, DROPLET_BASE_R * 0.7)
    highlightGrad.addColorStop(0, 'rgba(200,215,255,0.14)')
    highlightGrad.addColorStop(0.3, 'rgba(150,170,240,0.05)')
    highlightGrad.addColorStop(1, 'transparent')
    ctx.fillStyle = highlightGrad
    ctx.beginPath()
    ctx.moveTo(dropletVertices[0].x, dropletVertices[0].y)
    for (let i = 1; i < dropletVertices.length; i++) {
      ctx.lineTo(dropletVertices[i].x, dropletVertices[i].y)
    }
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }

  // --- 4. 磁铁位置标记（不可见磁铁，画微弱脉冲环） ---
  ctx.save()
  const pulseR = 6 + Math.sin(Date.now() * 0.004) * 2
  ctx.globalAlpha = 0.18
  ctx.strokeStyle = '#8090d0'
  ctx.lineWidth = 0.8
  ctx.shadowColor = 'rgba(140,160,240,0.4)'
  ctx.shadowBlur = 10
  ctx.beginPath()
  ctx.arc(mx, my, pulseR, 0, Math.PI * 2)
  ctx.stroke()
  ctx.restore()

  animationId = requestAnimationFrame(render)
}

// ==================== 画布尺寸适配 ====================
function updateCanvasSize() {
  const canvas = canvasRef.value
  const container = parentRef.value
  if (!canvas || !container) return

  dpr = Math.min(window.devicePixelRatio || 1, 2)
  const rect = container.getBoundingClientRect()
  canvasW = rect.width
  canvasH = rect.height
  canvas.width = canvasW * dpr
  canvas.height = canvasH * dpr
  canvas.style.width = canvasW + 'px'
  canvas.style.height = canvasH + 'px'

  const ctx = canvas.getContext('2d')
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  centerX = canvasW / 2
  centerY = canvasH / 2
}

let resizeObserver: ResizeObserver | null = null

// ==================== 生命周期 ====================
onMounted(() => {
  if (!parentRef.value || !canvasRef.value) return

  updateCanvasSize()
  initIronParticles()

  // Resize 监听
  if (parentRef.value) {
    resizeObserver = new ResizeObserver(() => {
      updateCanvasSize()
    })
    resizeObserver.observe(parentRef.value)
  }

  // 启动渲染循环
  animationId = requestAnimationFrame(render)

  // ===== ScrollTrigger 驱动磁铁轨道 =====
  const ctx = gsap.context(() => {
    // 磁铁轨道角度 0 → 2π（绕一圈）
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: parentRef.value,
        start: 'top 85%',
        end: 'bottom 30%',
        scrub: 1.5,
      },
    })
    cleanupFns.push({ revert: () => tl.kill() })

    tl.fromTo(magnetState, { orbitAngle: 0 }, {
      orbitAngle: Math.PI * 2,
      duration: 1,
      ease: 'none',
    })

    // ===== 文字入场 =====
    if (contentRef.value) {
      const ct = gsap.timeline({
        scrollTrigger: {
          trigger: parentRef.value,
          start: 'top 75%',
          end: 'top 25%',
          scrub: 1,
        },
      })
      cleanupFns.push({ revert: () => ct.kill() })

      if (titleRef.value) {
        ct.fromTo(titleRef.value,
          { opacity: 0, y: 30, filter: 'blur(10px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', ease: 'expo.out', duration: 0.8 },
          0.2
        )
      }
      if (dividerRef.value) {
        ct.fromTo(dividerRef.value,
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, ease: 'power3.out', duration: 0.55 },
          0.28
        )
      }
      if (subtitleRef.value) {
        ct.fromTo(subtitleRef.value,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, ease: 'power3.out', duration: 0.65 },
          0.34
        )
      }
    }
  }, parentRef.value)
})

// ==================== 清理 ====================
onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
  cleanupFns.forEach(fn => fn.revert?.())
  ScrollTrigger.getAll().forEach(st => {
    if (st.vars.trigger === parentRef.value) st.kill()
  })
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
})
</script>

<style scoped lang="scss">
// ==================== 容器 ====================
.card-image-magnetic-ink {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: radial-gradient(ellipse at 50% 55%, #0c0c20 0%, #060612 40%, #020208 75%, #010104 100%);
}

// ==================== Canvas ====================
.ink-canvas {
  position: absolute;
  inset: 0;
  display: block;
  z-index: 1;
}

// ==================== 内容覆盖层 ====================
.content-layer {
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  text-align: center;
  pointer-events: none;

  .title {
    font-size: clamp(2rem, 5vw, 4rem);
    font-weight: 800;
    letter-spacing: .06em;
    color: #fff;
    margin: 0 0 16px;
    line-height: 1.2;
    text-shadow:
      0 0 12px rgba(200,210,255,.5),
      0 0 30px rgba(150,170,255,.35),
      0 0 55px rgba(120,100,240,.25);
  }

  .divider {
    width: 110px;
    height: 3px;
    margin: 0 auto 16px;
    background: linear-gradient(90deg,
      rgba(200,210,255,.15),
      rgba(160,180,255,.65),
      rgba(130,100,230,.8),
      rgba(160,180,255,.65),
      rgba(200,210,255,.15)
    );
    border-radius: 2px;
    transform-origin: center;
    box-shadow: 0 0 8px rgba(140,160,240,.3);
  }

  .subtitle {
    font-size: clamp(.85rem, 1.5vw, 1.2rem);
    font-weight: 400;
    letter-spacing: .1em;
    text-transform: uppercase;
    color: rgba(180,200,255,.78);
    text-shadow: 0 0 14px rgba(140,170,240,.4);
    margin: 0;
  }
}
</style>
