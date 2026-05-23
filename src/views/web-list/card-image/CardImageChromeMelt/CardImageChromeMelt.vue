<template>
  <section ref="sectionRef" class="chrome-melt-section" @mousemove="onMouseMove" @mouseleave="onMouseLeave">
    <!-- 深色背景 -->
    <div class="abyss-bg"></div>

    <!-- 图片层 -->
    <div ref="imageLayerRef" class="image-layer">
      <img :src="imageUrl" alt="" class="main-image" />
    </div>

    <!-- Canvas：汞金属覆盖层 + 汞珠粒子 -->
    <canvas ref="canvasRef" class="mercury-canvas"></canvas>

    <!-- 文字覆盖 -->
    <div ref="contentRef" class="content-overlay">
      <h2 class="title">液态金属融化</h2>
      <p class="subtitle">Chrome Melt · Liquid Mercury Flow</p>
      <div class="divider"></div>
      <p class="desc">镜面反射 · 表面张力凝聚 · 水银流动</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []

const imageUrl = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80'

// ==================== Refs ====================
const sectionRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const imageLayerRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)

// ==================== Canvas 状态 ====================
let ctx: CanvasRenderingContext2D | null = null
let animationId = 0
let cw = 0, ch = 0
let scrollProgress = 0
let targetProgress = 0
let meltTime = 0

// 鼠标（驱动金属微扭曲）
let mouseXRatio = 0.5
let mouseYRatio = 0.5
let targetMRX = 0.5
let targetMRY = 0.5

const onMouseMove = (e: MouseEvent) => {
  targetMRX = e.clientX / window.innerWidth
  targetMRY = e.clientY / window.innerHeight
}
const onMouseLeave = () => {
  targetMRX = 0.5
  targetMRY = 0.5
}

// ==================== 汞珠粒子系统 ====================
const BEAD_COUNT = 42

interface Bead {
  x: number      // 归一化 x (0~1)
  y: number      // Canvas 像素 y
  vy: number     // 垂直速度
  vx: number     // 水平飘移
  size: number   // 半径 px
  life: number   // 0~1 生命值（淡出用）
  born: number   // 出生的 scrollProgress
  merged: boolean
}

function seedRand(s: number): () => number {
  let v = s
  return () => { v = (v * 16807) % 2147483647; return v / 2147483646 }
}

const rng = seedRand(42069)
const beadPool: Bead[] = []

// 初始化汞珠池（挂起状态，等熔化时激活）
for (let i = 0; i < BEAD_COUNT; i++) {
  beadPool.push({
    x: 0.08 + rng() * 0.84,
    y: -40 - rng() * 160, // 起初在画布上方
    vy: 0,
    vx: 0,
    size: 5 + rng() * 14,
    life: 0,
    born: -1,
    merged: false,
  })
}

// ==================== 渲染辅助 ====================
function hslStr(h: number, s: number, l: number, a = 1) {
  return `hsla(${h % 360}, ${s}%, ${l}%, ${a})`
}

// 绘制单个汞珠（3D 金属球体）
function drawBead(b: Bead) {
  if (!ctx || b.life <= 0) return
  const { x, y, size } = b
  const px = x * cw
  const py = y

  // 金属球体高光偏移（统一光源来自左上）
  const hlX = px - size * 0.28
  const hlY = py - size * 0.3

  const grad = ctx.createRadialGradient(
    hlX, hlY, size * 0.03,
    px, py, size,
  )
  grad.addColorStop(0, `rgba(255,255,255,${0.95 * b.life})`)       // 高光点
  grad.addColorStop(0.08, `rgba(240,242,246,${0.9 * b.life})`)     // 次高光
  grad.addColorStop(0.22, `rgba(180,185,195,${0.85 * b.life})`)    // 灰银过渡
  grad.addColorStop(0.4, `rgba(90,95,105,${0.8 * b.life})`)        // 暗部
  grad.addColorStop(0.6, `rgba(60,65,75,${0.78 * b.life})`)        // 暗面
  grad.addColorStop(0.78, `rgba(130,138,148,${0.75 * b.life})`)    // 底部反射
  grad.addColorStop(0.92, `rgba(160,168,178,${0.7 * b.life})`)     // 边缘反射
  grad.addColorStop(1, `rgba(80,85,95,${0.65 * b.life})`)          // 边缘暗

  ctx.beginPath()
  ctx.arc(px, py, size, 0, Math.PI * 2)
  ctx.fillStyle = grad
  ctx.fill()

  // 微光晕
  if (size > 8 && b.life > 0.3) {
    const glowGrad = ctx.createRadialGradient(px, py, size * 0.75, px, py, size * 1.5)
    glowGrad.addColorStop(0, `rgba(200,210,220,${0.08 * b.life})`)
    glowGrad.addColorStop(1, 'transparent')
    ctx.beginPath()
    ctx.arc(px, py, size * 1.5, 0, Math.PI * 2)
    ctx.fillStyle = glowGrad
    ctx.fill()
  }
}

// ==================== 汞金属覆盖层绘制 ====================
function drawMercurySheet(meltRatio: number) {
  if (!ctx) return

  // 熔化线位置（从上往下熔）
  // meltRatio = 0 → 全覆盖，meltRatio = 1 → 全部熔化
  const meltY = ch * meltRatio

  // 熔化边缘锯齿（正弦波叠加，模拟不规则撕裂）
  const jagAmp = 8 + meltRatio * 20 // 越往后越不规则
  const jagFreq = 0.025 + meltRatio * 0.03 + Math.sin(meltTime * 0.7) * 0.008

  // 鼠标驱动的微偏心
  const mouseShift = (mouseXRatio - 0.5) * 18

  ctx.save()
  ctx.beginPath()
  ctx.moveTo(0, meltY)

  // 从左到右绘制锯齿边缘
  for (let xi = 0; xi <= cw; xi += 3) {
    const phase1 = xi * jagFreq + meltTime * 0.6
    const phase2 = xi * jagFreq * 0.7 + meltTime * 0.45
    const amp = jagAmp + Math.sin(xi * 0.008 + meltTime * 1.2) * 4
    const yOff = Math.sin(phase1) * amp * 0.65
               + Math.cos(phase2) * amp * 0.35
               + Math.sin(xi * 0.015 + meltTime * 0.3) * 3
    const meltEdgeY = meltY + mouseShift * (xi / cw - 0.5) + yOff
    ctx.lineTo(xi, meltEdgeY)
  }

  // 下部份（金属覆盖区域——未被熔化的部分）
  ctx.lineTo(cw, ch)
  ctx.lineTo(0, ch)
  ctx.closePath()

  // 汞金属渐变（垂直方向，模拟镜面反射环境）
  const grad = ctx.createLinearGradient(0, meltY - 20, 0, ch)
  grad.addColorStop(0, '#a8b0b8')
  grad.addColorStop(0.06, '#e0e4ec')
  grad.addColorStop(0.14, '#d8dce4')
  grad.addColorStop(0.25, '#505860')
  grad.addColorStop(0.38, '#303840')
  grad.addColorStop(0.48, '#c8d0d8')
  grad.addColorStop(0.56, '#e8ecf4')
  grad.addColorStop(0.65, '#606870')
  grad.addColorStop(0.74, '#404850')
  grad.addColorStop(0.84, '#b8c0c8')
  grad.addColorStop(0.92, '#d0d8e0')
  grad.addColorStop(1, '#707880')

  ctx.fillStyle = grad
  ctx.fill()

  // 熔边高亮条（液态金属边缘的反光）
  ctx.beginPath()
  ctx.moveTo(0, meltY - 2)
  for (let xi = 0; xi <= cw; xi += 3) {
    const phase1 = xi * jagFreq + meltTime * 0.6
    const phase2 = xi * jagFreq * 0.7 + meltTime * 0.45
    const yOff = Math.sin(phase1) * jagAmp * 0.65
               + Math.cos(phase2) * jagAmp * 0.35
               + Math.sin(xi * 0.015 + meltTime * 0.3) * 3
    const meltEdgeY = meltY + mouseShift * (xi / cw - 0.5) + yOff
    ctx.lineTo(xi, meltEdgeY)
  }
  ctx.lineTo(cw, meltY - 2)
  ctx.lineTo(0, meltY - 2)
  ctx.closePath()
  const edgeGrad = ctx.createLinearGradient(0, meltY - 16, 0, meltY + 4)
  edgeGrad.addColorStop(0, 'rgba(255,255,255,0.55)')
  edgeGrad.addColorStop(0.5, 'rgba(220,228,240,0.3)')
  edgeGrad.addColorStop(1, 'rgba(80,85,95,0)')
  ctx.fillStyle = edgeGrad
  ctx.fill()

  ctx.restore()
}

// ==================== 底部汞池 ====================
function drawMercuryPool(meltRatio: number) {
  if (!ctx || meltRatio < 0.15) return
  const poolH = Math.min(meltRatio * 60, 32)
  const poolOpacity = Math.min((meltRatio - 0.15) / 0.5, 1) * 0.9

  const poolGrad = ctx.createLinearGradient(0, ch - poolH, 0, ch)
  poolGrad.addColorStop(0, `rgba(180,188,200,0)`)
  poolGrad.addColorStop(0.3, `rgba(150,158,170,${0.25 * poolOpacity})`)
  poolGrad.addColorStop(0.6, `rgba(120,128,140,${0.5 * poolOpacity})`)
  poolGrad.addColorStop(0.8, `rgba(100,108,120,${0.7 * poolOpacity})`)
  poolGrad.addColorStop(0.95, `rgba(80,88,100,${0.85 * poolOpacity})`)
  poolGrad.addColorStop(1, `rgba(60,68,80,${poolOpacity})`)

  ctx.beginPath()
  // 波浪顶边
  const poolTop = ch - poolH
  ctx.moveTo(0, poolTop)
  for (let xi = 0; xi <= cw; xi += 4) {
    const yOff = Math.sin(xi * 0.02 + meltTime * 1.5) * 6
               + Math.cos(xi * 0.035 + meltTime * 2.2) * 4
    ctx.lineTo(xi, poolTop + yOff)
  }
  ctx.lineTo(cw, ch)
  ctx.lineTo(0, ch)
  ctx.closePath()
  ctx.fillStyle = poolGrad
  ctx.fill()

  // 池面高光
  const hlGrad = ctx.createLinearGradient(0, poolTop - 6, 0, poolTop + 8)
  hlGrad.addColorStop(0, `rgba(255,255,255,${0.18 * poolOpacity})`)
  hlGrad.addColorStop(1, 'transparent')
  ctx.beginPath()
  ctx.moveTo(0, poolTop - 2)
  for (let xi = 0; xi <= cw; xi += 4) {
    const yOff = Math.sin(xi * 0.02 + meltTime * 1.5) * 6
               + Math.cos(xi * 0.035 + meltTime * 2.2) * 4
    ctx.lineTo(xi, poolTop + yOff - 2)
  }
  ctx.lineTo(cw, poolTop - 6)
  ctx.lineTo(0, poolTop - 6)
  ctx.closePath()
  ctx.fillStyle = hlGrad
  ctx.fill()
}

// ==================== 物理更新 ====================
function updateBeads(meltRatio: number) {
  for (let i = 0; i < BEAD_COUNT; i++) {
    const b = beadPool[i]

    // 新汞珠诞生：熔化线经过时激活
    if (b.born < 0 && meltRatio > (0.08 + i * 0.018) && b.life <= 0) {
      b.born = meltRatio
      b.x = 0.08 + rng() * 0.84
      b.y = ch * Math.max(0.02, meltRatio - 0.03) // 在熔化线附近出生
      b.vy = 0.5 + rng() * 2.5
      b.vx = (rng() - 0.5) * 1.2
      b.size = 6 + rng() * 16
      b.life = 0.3 + rng() * 0.7
      b.merged = false
    }

    if (b.life <= 0) continue

    // 仅当熔化率 > born 时才开始物理计算
    if (meltRatio <= b.born) continue

    // 重力加速
    b.vy += 0.22 + b.size * 0.003
    b.vy = Math.min(b.vy, 12)

    // 水平飘移
    b.vx += (rng() - 0.5) * 0.06
    b.vx *= 0.98

    // 位移
    b.x += (b.vx / cw)
    b.y += b.vy

    // 碰撞底部反弹
    const poolTop = ch - Math.min(meltRatio * 60, 32)
    if (b.y + b.size > poolTop) {
      b.y = poolTop - b.size
      b.vy *= -0.3 // 弹性衰减
      b.vx *= 0.7
      if (Math.abs(b.vy) < 0.5) {
        b.vy = 0
        b.vx *= 0.3
        b.life -= 0.003 // 缓慢淡出
      }
    }

    // 超出边界或已落入池中
    if (b.y > ch + b.size * 2) {
      b.life = 0
      b.born = -1
    }

    // 自然衰减
    if (b.y > ch * 0.7) {
      b.life -= 0.0006
    }
  }

  // ===== 表面张力合并 =====
  for (let i = 0; i < BEAD_COUNT; i++) {
    const a = beadPool[i]
    if (a.life <= 0 || a.merged) continue
    for (let j = i + 1; j < BEAD_COUNT; j++) {
      const b = beadPool[j]
      if (b.life <= 0 || b.merged) continue
      const dx = (a.x - b.x) * cw
      const dy = a.y - b.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      const mergeThresh = (a.size + b.size) * 0.6
      if (dist < mergeThresh) {
        // a 吸收 b
        const totalArea = a.size * a.size + b.size * b.size
        a.size = Math.sqrt(totalArea)
        a.size = Math.min(a.size, 30)
        a.vy = (a.vy + b.vy) * 0.5 + 0.5
        a.life = Math.min(a.life + 0.15, 1)
        // 合并后的位置是加权中点
        a.y = (a.y * a.size + b.y * b.size) / (a.size + (b.size || 1))
        a.x = (a.x * a.size + b.x * b.size) / (a.size + (b.size || 1))
        b.life = 0
        b.born = -1
        b.merged = true
      }
    }
  }
}

// ==================== 渲染帧 ====================
function render() {
  if (!ctx || !canvasRef.value) return
  const canvas = canvasRef.value

  scrollProgress += (targetProgress - scrollProgress) * 0.06
  meltTime += 0.016

  mouseXRatio += (targetMRX - mouseXRatio) * 0.05
  mouseYRatio += (targetMRY - mouseYRatio) * 0.05

  // 熔化进度：三段曲线
  // 0-12%：金属开始软化
  // 12-60%：加速熔化
  // 60-100%：完全熔化，收尾
  let meltRatio: number
  const p = scrollProgress
  if (p < 0.12) {
    meltRatio = p * 0.15 / 0.12 // 缓慢开始
  } else if (p < 0.6) {
    const u = (p - 0.12) / 0.48
    meltRatio = 0.15 + u * u * 0.75 // 二次加速
  } else {
    const u = (p - 0.6) / 0.4
    meltRatio = 0.9 + u * 0.1
  }
  meltRatio = Math.min(meltRatio, 1)

  ctx.clearRect(0, 0, cw, ch)

  // ===== 1. 汞金属覆盖层 =====
  drawMercurySheet(meltRatio)

  // ===== 2. 底部汞池 =====
  drawMercuryPool(meltRatio)

  // ===== 3. 物理更新 + 绘制汞珠 =====
  updateBeads(meltRatio)

  // 按 y 排序，远的先画
  const sorted = [...beadPool].filter(b => b.life > 0)
  sorted.sort((a, b) => a.y - b.y)

  for (const b of sorted) {
    drawBead(b)
  }

  // ===== 4. 熔化边缘滴水珠（不断从边缘生成小珠） =====
  if (meltRatio > 0.08 && meltRatio < 0.95) {
    const dripCount = Math.floor(2 + meltRatio * 5)
    for (let d = 0; d < dripCount; d++) {
      const phase = meltTime * 1.8 + d * 2.4
      const dripX = 0.1 + ((Math.sin(phase * 0.7) * 0.5 + 0.5) + (d * 0.18)) % 0.9
      const px = dripX * cw
      const dripY = ch * meltRatio + Math.sin(phase) * 8
      const dripSize = 2 + Math.abs(Math.sin(phase * 1.3)) * 4
      const dripYReal = dripY

      if (dripYReal > 0 && dripYReal < ch) {
        const dGrad = ctx.createRadialGradient(
          px - dripSize * 0.3, dripYReal - dripSize * 0.3, 0,
          px, dripYReal, dripSize,
        )
        dGrad.addColorStop(0, 'rgba(255,255,255,0.8)')
        dGrad.addColorStop(0.35, 'rgba(200,208,220,0.55)')
        dGrad.addColorStop(0.7, 'rgba(100,108,120,0.3)')
        dGrad.addColorStop(1, 'transparent')
        ctx.beginPath()
        ctx.arc(px, dripYReal, dripSize, 0, Math.PI * 2)
        ctx.fillStyle = dGrad
        ctx.fill()
      }
    }
  }

  animationId = requestAnimationFrame(render)
}

// ==================== 尺寸调整 ====================
function resize() {
  if (!canvasRef.value) return
  const canvas = canvasRef.value
  const rect = canvas.getBoundingClientRect()
  cw = rect.width * (window.devicePixelRatio || 1)
  ch = rect.height * (window.devicePixelRatio || 1)
  canvas.width = cw
  canvas.height = ch
  ctx = canvas.getContext('2d')
}

// ==================== 挂载 ====================
onMounted(() => {
  if (!sectionRef.value || !canvasRef.value || !imageLayerRef.value) return

  canvasRef.value.style.width = '100%'
  canvasRef.value.style.height = '100%'
  canvasRef.value.width = canvasRef.value.offsetWidth * (window.devicePixelRatio || 1)
  canvasRef.value.height = canvasRef.value.offsetHeight * (window.devicePixelRatio || 1)
  ctx = canvasRef.value.getContext('2d')
  cw = canvasRef.value.width
  ch = canvasRef.value.height

  window.addEventListener('resize', resize)

  // ========== ScrollTrigger：滚动进度 ==========
  const st = ScrollTrigger.create({
    trigger: sectionRef.value,
    start: 'top 85%',
    end: 'bottom 12%',
    onUpdate(self) {
      targetProgress = self.progress
    },
  })
  cleanupFns.push(() => st.kill())

  // ========== 图片：从暗到亮 ==========
  gsap.set(imageLayerRef.value, { filter: 'brightness(0.35) contrast(1.15)' })
  const imgTl = gsap.timeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 82%',
      end: 'bottom 10%',
      scrub: 1.0,
    },
  })
  imgTl.to(imageLayerRef.value, { filter: 'brightness(1.08) contrast(1.02)', duration: 1 })
  cleanupFns.push(() => { imgTl.scrollTrigger?.kill(); imgTl.kill() })

  // ========== 文字渐显 ==========
  if (contentRef.value) gsap.set(contentRef.value, { opacity: 0, y: 24 })
  const textTl = gsap.timeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 72%',
      end: 'top 26%',
      scrub: 1.0,
    },
  })
  if (contentRef.value) textTl.to(contentRef.value, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' })
  cleanupFns.push(() => { textTl.scrollTrigger?.kill(); textTl.kill() })

  // ========== Canvas 渲染循环 ==========
  animationId = requestAnimationFrame(render)
})

// ==================== 清理 ====================
onUnmounted(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', resize)
  cleanupFns.forEach(fn => fn())
})
</script>

<style lang="scss" scoped>
/* ==================== 容器 ==================== */
.chrome-melt-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #0a0c10;
}

/* ==================== 深色背景 ==================== */
.abyss-bg {
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    radial-gradient(ellipse 100% 75% at 50% 42%, #12141c 0%, #0a0c10 55%, #040508 100%);
}

/* ==================== 图片 ==================== */
.image-layer {
  position: absolute;
  inset: 0;
  z-index: 2;
  will-change: filter;

  .main-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}

/* ==================== Canvas 汞层 ==================== */
.mercury-canvas {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
}

/* ==================== 文字覆盖 ==================== */
.content-overlay {
  position: absolute;
  z-index: 10;
  bottom: 14%;
  left: 8%;
  pointer-events: none;

  .title {
    margin: 0;
    font-family: 'Georgia', 'SimSun', 'Noto Serif SC', serif;
    font-size: clamp(28px, 4.5vmin, 52px);
    color: #e8eaf0;
    letter-spacing: 0.06em;
    text-shadow:
      0 0 20px rgba(160, 180, 210, 0.5),
      0 0 40px rgba(120, 140, 180, 0.25);
    line-height: 1.15;
  }

  .subtitle {
    margin: 8px 0 0;
    font-family: 'Georgia', 'SimSun', 'Noto Serif SC', serif;
    font-size: clamp(13px, 1.8vmin, 18px);
    color: #8890a0;
    letter-spacing: 0.1em;
    font-style: italic;
  }

  .divider {
    width: 60px;
    height: 1px;
    margin: 14px 0;
    background: linear-gradient(90deg, rgba(140, 155, 180, 0.6), transparent 80%);
  }

  .desc {
    margin: 0;
    font-size: clamp(12px, 1.4vmin, 15px);
    color: #6a7284;
    letter-spacing: 0.06em;
  }
}

/* ==================== 响应式 ==================== */
@media (max-width: 768px) {
  .content-overlay {
    bottom: 12%;
    left: 6%;
  }
}

@media (max-width: 480px) {
  .content-overlay {
    bottom: 10%;
    left: 5%;
  }
}
</style>
