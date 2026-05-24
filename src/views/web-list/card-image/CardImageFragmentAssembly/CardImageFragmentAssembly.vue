<template>
  <div class="fa-section" ref="sectionRef">
    <!-- 深色星空背景 -->
    <div class="fa-bg"></div>
    <canvas class="fa-particles" ref="bgParticlesRef"></canvas>

    <!-- 碎片舞台 -->
    <div
      class="fa-stage"
      ref="stageRef"
      :style="{ backgroundImage: `url(${mainImageUrl})` }"
    >
      <div
        v-for="(frag, idx) in fragmentData"
        :key="idx"
        class="fa-frag"
        :ref="el => { if (el) fragRefs[idx] = el as HTMLElement }"
        :style="{
          clipPath: frag.clipPath,
        }"
      >
        <!-- 随机图覆盖层（散落状态可见） -->
        <div
          class="fa-rand"
          :style="{
            backgroundImage: `url(${poolImages[frag.poolIdx]})`,
          }"
        ></div>
        <!-- 碎片边框 -->
        <div class="fa-border"></div>
      </div>
    </div>

    <!-- 磁力场 Canvas -->
    <canvas class="fa-field" ref="fieldRef"></canvas>

    <!-- 进度指示器 -->
    <div class="fa-progress" ref="progressRef">
      <div class="fa-progress-track">
        <div class="fa-progress-bar" ref="progressBarRef"></div>
      </div>
      <div class="fa-progress-label">
        <span class="fa-progress-count" ref="countRef">0</span>
        <span class="fa-progress-total">/ 48 FRAGMENTS</span>
      </div>
    </div>

    <!-- 中心光晕 -->
    <div class="fa-core-glow" ref="coreGlowRef"></div>

    <!-- 内容覆盖 -->
    <div class="fa-content" ref="contentRef">
      <h2 class="fa-title">碎片拼图聚合</h2>
      <div class="fa-divider" ref="dividerRef"></div>
      <p class="fa-sub">Fragment Assembly · Magnetic Convergence</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ==================== 类型 ====================
type TweenCleanup = () => void

interface Vertex {
  x: number // 百分比 [0,100]
  y: number
}

interface FragmentConfig {
  col: number
  row: number
  clipPath: string
  poolIdx: number
  scatterX: number
  scatterY: number
  scatterZ: number
  scatterRX: number
  scatterRY: number
  scatterRZ: number
  delay: number
}

// ==================== 图片资源 ====================
const mainImageUrl = 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=1920&q=80'

const poolImages = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
  'https://images.unsplash.com/photo-1509316785289-025f548a1dcb?w=800&q=80',
  'https://images.unsplash.com/photo-1419242902214-272b3ebbb2eb?w=800&q=80',
  'https://images.unsplash.com/photo-1483347756197-8e98cd1b8c60?w=800&q=80',
  'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800&q=80',
]

// ==================== Refs ====================
const sectionRef = ref<HTMLElement | null>(null)
const stageRef = ref<HTMLElement | null>(null)
const fieldRef = ref<HTMLCanvasElement | null>(null)
const bgParticlesRef = ref<HTMLCanvasElement | null>(null)
const progressBarRef = ref<HTMLElement | null>(null)
const countRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const dividerRef = ref<HTMLElement | null>(null)
const coreGlowRef = ref<HTMLElement | null>(null)

const fragRefs = ref<(HTMLElement | null)[]>([])

let cleanupFns: TweenCleanup[] = []

// Canvas 状态
let fieldCtx: CanvasRenderingContext2D | null = null
let fieldW = 0
let fieldH = 0
let fieldRunning = false

let particleCtx: CanvasRenderingContext2D | null = null
let bgParticles: { x: number; y: number; r: number; vx: number; vy: number; a: number }[] = []
let bgParticleAnimId = 0

// ==================== 共享顶点网格（确保碎片完美拼接） ====================
const COLS = 8
const ROWS = 6
const TOTAL = COLS * ROWS // 48
const JITTER = 2.4 // 顶点 jitter 百分比

function generateVertexGrid(): Vertex[][] {
  // 确定性伪随机
  let seed = 12345
  const prng = () => {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  }

  // (COLS+1) × (ROWS+1) = 9 × 7 = 63 个共享顶点
  const grid: Vertex[][] = []

  for (let r = 0; r <= ROWS; r++) {
    const row: Vertex[] = []
    for (let c = 0; c <= COLS; c++) {
      const baseX = (c / COLS) * 100
      const baseY = (r / ROWS) * 100

      // 边界顶点锁定不 jitter（保证外框方正）
      const cx = c === 0 || c === COLS ? baseX : +(baseX + (prng() - 0.5) * JITTER).toFixed(2)
      const cy = r === 0 || r === ROWS ? baseY : +(baseY + (prng() - 0.5) * JITTER).toFixed(2)

      row.push({ x: cx, y: cy })
    }
    grid.push(row)
  }
  return grid
}

const vertexGrid = generateVertexGrid()

const fragmentData = computed<FragmentConfig[]>(() => {
  const configs: FragmentConfig[] = []
  const centerC = (COLS - 1) / 2
  const centerR = (ROWS - 1) / 2
  const maxDist = Math.sqrt(centerC * centerC + centerR * centerR)

  let seed = 7777
  const prng = () => {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  }

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      // 从共享顶点网格取四个角 → 完美拼接
      const tl = vertexGrid[r][c]
      const tr = vertexGrid[r][c + 1]
      const br = vertexGrid[r + 1][c + 1]
      const bl = vertexGrid[r + 1][c]

      const clipPath = `polygon(${tl.x}% ${tl.y}%, ${tr.x}% ${tr.y}%, ${br.x}% ${br.y}%, ${bl.x}% ${bl.y}%)`

      // 图片池分配
      const poolIdx = Math.floor(prng() * poolImages.length)

      // 3D 散落偏移（距中心越远散越远）
      const dx = c - centerC
      const dy = r - centerR
      const dist = Math.sqrt(dx * dx + dy * dy) / maxDist

      const angle = prng() * Math.PI * 2
      const scatterDist = (60 + dist * 380) * (0.85 + prng() * 0.3)

      const scatterX = Math.cos(angle) * scatterDist
      const scatterY = Math.sin(angle) * scatterDist
      const scatterZ = -(80 + dist * 400)
      const scatterRX = (prng() - 0.5) * 100 * dist
      const scatterRY = (prng() - 0.5) * 100 * dist
      const scatterRZ = (prng() - 0.5) * 120 * dist

      // 时序：中心先到，边缘后到
      const delay = dist * 0.5

      configs.push({
        col: c, row: r,
        clipPath, poolIdx,
        scatterX, scatterY, scatterZ,
        scatterRX, scatterRY, scatterRZ,
        delay,
      })
    }
  }
  return configs
})

// ==================== 辅助函数 ====================
function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)) }
function smoothstep(t: number) { return t * t * (3 - 2 * t) }

// 磁力加速度：远距慢移 → 近距快速吸附
function magneticPose(fragP: number): number {
  if (fragP <= 0) return 0
  if (fragP >= 1) return 1
  const k = 0.55 // 慢移段占比
  return fragP < k
    ? smoothstep(fragP / k) * 0.3
    : 0.3 + (1 - Math.pow(1 - (fragP - k) / (1 - k), 3.5)) * 0.7
}

// ==================== 背景粒子 ====================
function initBgParticles() {
  const canvas = bgParticlesRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  canvas.width = canvas.offsetWidth
  canvas.height = canvas.offsetHeight
  particleCtx = ctx

  bgParticles = Array.from({ length: 50 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: 0.4 + Math.random() * 1.4,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35 - 0.1,
    a: 0.1 + Math.random() * 0.25,
  }))

  function draw() {
    if (!particleCtx || !canvas) return
    const w = canvas.width
    const h = canvas.height
    particleCtx.clearRect(0, 0, w, h)

    bgParticles.forEach(p => {
      p.x += p.vx
      p.y += p.vy
      if (p.x < 0) p.x = w
      if (p.x > w) p.x = 0
      if (p.y < -10) p.y = h + 10
      if (p.y > h + 10) p.y = -10

      particleCtx!.beginPath()
      particleCtx!.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      particleCtx!.fillStyle = `rgba(70,150,230,${p.a})`
      particleCtx!.fill()
    })
    bgParticleAnimId = requestAnimationFrame(draw)
  }
  draw()
}

// ==================== 磁力场 Canvas ====================
function initFieldCanvas() {
  const canvas = fieldRef.value
  if (!canvas || !stageRef.value) return
  const rect = stageRef.value.getBoundingClientRect()
  fieldW = rect.width
  fieldH = rect.height
  canvas.width = fieldW
  canvas.height = fieldH
  canvas.style.width = fieldW + 'px'
  canvas.style.height = fieldH + 'px'
  fieldCtx = canvas.getContext('2d')
}

function drawFieldLines(progress: number) {
  if (!fieldCtx || !fieldRef.value) return
  const ctx = fieldCtx
  const w = fieldW
  const h = fieldH
  const cx = w / 2
  const cy = h / 2

  ctx.clearRect(0, 0, w, h)
  if (progress < 0.02 || progress > 0.9) return

  const fadeIn = clamp(progress * 6, 0, 1)
  const fadeOut = clamp((1 - progress) * 6, 0, 1)
  const globalAlpha = Math.min(fadeIn, fadeOut) * 0.55
  if (globalAlpha < 0.02) return

  const frags = fragmentData.value
  const validRefs = fragRefs.value.filter(Boolean) as HTMLElement[]

  // 先画所有弱场线（远距碎片）
  ctx.globalCompositeOperation = 'lighter'

  for (let i = 0; i < frags.length; i++) {
    const frag = frags[i]
    const el = validRefs[i]
    if (!el) continue

    const fragP = clamp((progress - frag.delay) / (1 - frag.delay), 0, 1)
    const pose = magneticPose(fragP)
    if (pose >= 0.9) continue

    const elRect = el.getBoundingClientRect()
    const stageRect = fieldRef.value!.getBoundingClientRect()
    const fx = elRect.left + elRect.width / 2 - stageRect.left + frag.scatterX * (1 - pose) * 0.8
    const fy = elRect.top + elRect.height / 2 - stageRect.top + frag.scatterY * (1 - pose) * 0.8

    const dist = Math.hypot(fx - cx, fy - cy)
    const lineAlpha = globalAlpha * (1 - pose) * clamp(1 - dist / 700, 0.15, 1)
    if (lineAlpha < 0.025) continue

    // 磁感线：贝塞尔曲线带螺旋偏移
    const angle = Math.atan2(cy - fy, cx - fx)
    const spiral = dist * (0.3 + (1 - pose) * 0.4)
    const perpX = Math.sin(angle) * spiral * (frag.col % 3 === 0 ? 1 : frag.col % 3 === 1 ? 0.4 : -0.7)
    const perpY = -Math.cos(angle) * spiral * (frag.row % 3 === 0 ? 1 : frag.row % 3 === 1 ? -0.4 : 0.7)

    const midX = (fx + cx) / 2 + perpX
    const midY = (fy + cy) / 2 + perpY

    ctx.beginPath()
    ctx.moveTo(fx, fy)
    ctx.quadraticCurveTo(midX, midY, cx, cy)
    ctx.strokeStyle = `rgba(40,175,250,${lineAlpha})`
    ctx.lineWidth = 0.5 + (1 - pose) * 1.5
    ctx.stroke()

    // 碎片端光点
    ctx.beginPath()
    ctx.arc(fx, fy, 1.5 + (1 - pose) * 2.5, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(100,210,255,${lineAlpha * 1.5})`
    ctx.fill()
  }

  ctx.globalCompositeOperation = 'source-over'
}

// ==================== 挂载 ====================
onMounted(async () => {
  if (!sectionRef.value) return
  await nextTick()
  setTimeout(() => initFieldCanvas(), 400)
  initBgParticles()

  const ctx = gsap.context(() => {
    const validFrags = fragRefs.value.filter(Boolean) as HTMLElement[]

    // ===== 碎片聚合主驱动 =====
    const mainSt = ScrollTrigger.create({
      trigger: sectionRef.value!,
      start: 'top 92%',
      end: 'bottom 22%',
      scrub: 1.3,
      onUpdate(self) {
        const p = self.progress

        // 更新每个碎片的 3D 位置 + 随机层交叉渐变
        for (let i = 0; i < fragmentData.value.length; i++) {
          const frag = fragmentData.value[i]
          const el = validFrags[i]
          if (!el) continue

          const fragP = clamp((p - frag.delay) / (1 - frag.delay), 0, 1)
          const pose = magneticPose(fragP)

          const x = frag.scatterX * (1 - pose)
          const y = frag.scatterY * (1 - pose)
          const z = frag.scatterZ * (1 - pose)
          const rx = frag.scatterRX * (1 - pose)
          const ry = frag.scatterRY * (1 - pose)
          const rz = frag.scatterRZ * (1 - pose)

          el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,${z.toFixed(1)}px) rotateX(${rx.toFixed(1)}deg) rotateY(${ry.toFixed(1)}deg) rotateZ(${rz.toFixed(1)}deg)`

          // 随机层褪去
          const randLayer = el.querySelector('.fa-rand') as HTMLElement
          if (randLayer) {
            randLayer.style.opacity = String(Math.max(0, (1 - pose * 1.05)))
          }

          // 边框显现
          const borderEl = el.querySelector('.fa-border') as HTMLElement
          if (borderEl) {
            borderEl.style.opacity = String(pose < 0.3 ? 0 : clamp((pose - 0.3) / 0.25, 0, 0.45))
          }
        }

        // 磁力场
        drawFieldLines(p)

        // 进度
        const assembled = Math.floor(clamp(p, 0, 1) * TOTAL)
        if (progressBarRef.value) progressBarRef.value.style.width = `${clamp(p * 100, 0, 100)}%`
        if (countRef.value) countRef.value.textContent = String(assembled)

        // 中心光晕（组装趋完成时出现）
        if (coreGlowRef.value) {
          coreGlowRef.value.style.opacity = String(clamp((p - 0.75) / 0.25, 0, 0.5))
        }
      },
      onLeaveBack() {
        if (fieldCtx && fieldRef.value) fieldCtx.clearRect(0, 0, fieldW, fieldH)
      },
    })
    cleanupFns.push(() => mainSt.kill())

    // ===== 文字入场 =====
    if (contentRef.value) {
      const textTl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.value!, start: 'top 70%', end: 'top 25%', scrub: 1.0 },
      })
      cleanupFns.push(() => textTl.kill())

      textTl.fromTo(contentRef.value, { opacity: 0, y: 40 }, { opacity: 1, y: 0, ease: 'power3.out' }, 0)
      if (titleRef.value)
        textTl.fromTo(titleRef.value, { opacity: 0, y: 24, filter: 'blur(6px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', ease: 'expo.out' }, 0.06)
      if (dividerRef.value)
        textTl.fromTo(dividerRef.value, { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, ease: 'power3.out' }, 0.1)
    }
  }, sectionRef.value)
})

// ==================== 清理 ====================
onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(st => { if (st.vars.trigger === sectionRef.value) st.kill() })
  cancelAnimationFrame(bgParticleAnimId)
})
</script>

<style scoped lang="scss">
// ==================== 容器 ====================
.fa-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: radial-gradient(ellipse at 50% 45%, #0a1228 0%, #060d1e 35%, #030815 65%, #01040e 100%);
  perspective: 1400px;
}

// ==================== 暗色背景 ====================
.fa-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(ellipse at 25% 20%, rgba(35, 105, 185, 0.05) 0%, transparent 55%),
    radial-gradient(ellipse at 70% 60%, rgba(140, 70, 190, 0.04) 0%, transparent 55%);
}

.fa-particles {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

// ==================== 碎片舞台 ====================
.fa-stage {
  position: absolute;
  inset: 6%;
  z-index: 2;
  background-size: cover;
  background-position: center;
  transform-style: preserve-3d;
  border-radius: 2px;
}

// ==================== 单个碎片 ====================
.fa-frag {
  position: absolute;
  inset: 0;
  background: inherit;
  background-size: cover;
  background-position: center;
  transform-origin: center center;
  transform-style: preserve-3d;
  will-change: transform;
  cursor: default;
  transition: filter 0.35s;
}

// ==================== 随机图覆盖层 ====================
.fa-rand {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 1;
  will-change: opacity;
  pointer-events: none;
}

// ==================== 碎片边框（组装后显现） ====================
.fa-border {
  position: absolute;
  inset: 0;
  border: 0.5px solid rgba(120, 195, 255, 0);
  pointer-events: none;
  opacity: 0;
  will-change: opacity;
  transition: border-color 0.4s;
}

.fa-frag:hover .fa-border {
  border-color: rgba(130, 210, 255, 0.7) !important;
  box-shadow: inset 0 0 8px rgba(70, 170, 240, 0.3), 0 0 12px rgba(70, 170, 240, 0.2);
  opacity: 0.55 !important;
}

.fa-frag:hover {
  z-index: 50 !important;
}

// ==================== 磁力场 Canvas ====================
.fa-field {
  position: absolute;
  inset: 6%;
  z-index: 3;
  pointer-events: none;
}

// ==================== 中心光晕 ====================
.fa-core-glow {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 50vw;
  height: 50vh;
  background: radial-gradient(ellipse at center,
    rgba(60, 160, 240, 0.2) 0%,
    rgba(80, 140, 230, 0.08) 30%,
    rgba(40, 100, 200, 0.02) 55%,
    transparent 75%
  );
  pointer-events: none;
  opacity: 0;
  filter: blur(50px);
  z-index: 4;
  transition: opacity 0.4s;
}

// ==================== 进度指示器 ====================
.fa-progress {
  position: absolute;
  bottom: 12%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 15;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  pointer-events: none;
}

.fa-progress-track {
  width: 240px;
  height: 2px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 2px;
  overflow: hidden;
}

.fa-progress-bar {
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg,
    rgba(35, 155, 240, 0.7),
    rgba(110, 200, 255, 0.9),
    rgba(35, 155, 240, 0.7)
  );
  border-radius: 2px;
  box-shadow: 0 0 8px rgba(50, 165, 240, 0.5);
}

.fa-progress-label {
  display: flex;
  align-items: baseline;
  gap: 4px;
  font-family: 'Courier New', monospace;
}

.fa-progress-count {
  font-size: 1.5rem;
  font-weight: 700;
  color: rgba(150, 215, 255, 0.9);
  text-shadow: 0 0 12px rgba(70, 170, 245, 0.4);
  min-width: 28px;
  text-align: right;
}

.fa-progress-total {
  font-size: 0.68rem;
  letter-spacing: 0.14em;
  color: rgba(130, 170, 210, 0.5);
  text-transform: uppercase;
}

// ==================== 内容覆盖 ====================
.fa-content {
  position: absolute;
  bottom: 7%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 14;
  text-align: center;
  pointer-events: none;
}

.fa-title {
  font-size: clamp(2rem, 5vw, 3.8rem);
  font-weight: 800;
  letter-spacing: 0.04em;
  color: #fff;
  text-shadow:
    0 0 30px rgba(50, 165, 245, 0.45),
    0 0 60px rgba(90, 130, 245, 0.25),
    0 0 100px rgba(30, 110, 230, 0.15);
  margin: 0 0 12px;
  line-height: 1.15;
}

.fa-divider {
  width: 72px;
  height: 2px;
  margin: 0 auto 10px;
  background: linear-gradient(90deg,
    rgba(30, 140, 230, 0.25),
    rgba(90, 190, 250, 0.7),
    rgba(30, 140, 230, 0.25)
  );
  border-radius: 2px;
  transform-origin: center;
}

.fa-sub {
  font-size: clamp(0.72rem, 1.3vw, 0.95rem);
  font-weight: 400;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.06em;
  color: rgba(140, 195, 240, 0.6);
  margin: 0;
}
</style>
