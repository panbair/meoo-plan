<template>
  <div class="fa-section" ref="sectionRef">
    <!-- 深色背景 -->
    <div class="fa-bg"></div>

    <!-- 图片舞台 -->
    <div class="fa-stage" ref="stageRef">
      <!-- Layer 1: 图片A - 左上半 (白天都市) -->
      <div
        class="fa-img-a"
        ref="imgARef"
        :style="{ backgroundImage: `url(${imageA})` }"
      ></div>

      <!-- Layer 2: 图片B - 右下半 (赛博夜晚) -->
      <div
        class="fa-img-b"
        ref="imgBRef"
        :style="{ backgroundImage: `url(${imageB})` }"
      ></div>

      <!-- Layer 6: 分裂线能量溢出光晕带 -->
      <div class="fa-energy-band" ref="energyBandRef">
        <div class="fa-energy-inner"></div>
      </div>

      <!-- Layer 3: SVG 分裂线 (锯齿 + 发光) -->
      <svg
        class="fa-split-svg"
        ref="splitSvgRef"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="split-glow-ms" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur2" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="24" result="blur3" />
            <feMerge>
              <feMergeNode in="blur3" />
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="split-glow-outer-ms" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="30" result="blur" />
            <feColorMatrix in="blur" type="matrix"
              values="0 0 0 0 0.4
                      0 0 0 0 0.7
                      0 0 0 0 1.0
                      0 0 0 0.6 0" />
          </filter>
        </defs>
        <!-- 外层发光 -->
        <path class="fa-split-outer" ref="splitOuterRef" d="" />
        <!-- 主分裂线 -->
        <path class="fa-split-main" ref="splitMainRef" d="" />
      </svg>
    </div>

    <!-- Layer 4: 左侧冷色调粒子 Canvas -->
    <canvas class="fa-particles-left" ref="particlesLeftRef"></canvas>

    <!-- Layer 5: 右侧暖色调粒子 Canvas -->
    <canvas class="fa-particles-right" ref="particlesRightRef"></canvas>

    <!-- Layer 7: 世界标签 -->
    <div class="fa-label-left" ref="labelLeftRef">
      <span class="fa-label-text">REALITY</span>
      <span class="fa-label-sub">real world</span>
    </div>
    <div class="fa-label-right" ref="labelRightRef">
      <span class="fa-label-text">DIGITAL</span>
      <span class="fa-label-sub">cyber space</span>
    </div>

    <!-- 进度指示器 -->
    <div class="fa-progress" ref="progressRef">
      <div class="fa-progress-track">
        <div class="fa-progress-bar" ref="progressBarRef"></div>
      </div>
      <div class="fa-progress-label">
        <span class="fa-progress-val" ref="progressValRef">50</span>
        <span class="fa-progress-unit">% SPLIT</span>
      </div>
    </div>

    <!-- 内容覆盖 -->
    <div class="fa-content" ref="contentRef">
      <h2 class="fa-title" ref="titleRef">镜像维度分裂</h2>
      <div class="fa-divider" ref="dividerRef"></div>
      <p class="fa-sub">Mirror Split · Dual World Contrast</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void

// ==================== 图片资源 ====================
// 图A：白天繁华都市 (左上半)
const imageA = 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=1920&q=80'
// 图B：夜晚赛博世界 (右下半)
const imageB = 'https://images.unsplash.com/photo-1563089145-599997674d42?w=1920&q=80'

// ==================== Refs ====================
const sectionRef = ref<HTMLElement | null>(null)
const stageRef = ref<HTMLElement | null>(null)
const imgARef = ref<HTMLElement | null>(null)
const imgBRef = ref<HTMLElement | null>(null)
const splitSvgRef = ref<SVGSVGElement | null>(null)
const splitMainRef = ref<SVGPathElement | null>(null)
const splitOuterRef = ref<SVGPathElement | null>(null)
const energyBandRef = ref<HTMLElement | null>(null)
const particlesLeftRef = ref<HTMLCanvasElement | null>(null)
const particlesRightRef = ref<HTMLCanvasElement | null>(null)
const labelLeftRef = ref<HTMLElement | null>(null)
const labelRightRef = ref<HTMLElement | null>(null)
const progressBarRef = ref<HTMLElement | null>(null)
const progressValRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const dividerRef = ref<HTMLElement | null>(null)

let cleanupFns: TweenCleanup[] = []

// ==================== Canvas 状态 ====================
interface Particle {
  x: number
  y: number
  r: number
  vx: number
  vy: number
  a: number
  hue: number
  pulsePhase: number
  pulseSpeed: number
}

let leftParticles: Particle[] = []
let rightParticles: Particle[] = []
const PARTICLE_BUDGET = 60
let leftCtx: CanvasRenderingContext2D | null = null
let rightCtx: CanvasRenderingContext2D | null = null
let leftW = 0
let leftH = 0
let rightW = 0
let rightH = 0
let leftAnimId = 0
let rightAnimId = 0
let stageW = 0
let stageH = 0

// ==================== SVG 分裂线状态 ====================
let splitJitterSeed = 4567

// ==================== 辅助函数 ====================
function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)) }

/**
 * 分裂线移动缓动曲线（先慢后快再稳）
 */
function splitEase(t: number): number {
  if (t <= 0) return 0
  if (t >= 1) return 1
  return t < 0.4
    ? (t / 0.4) * (t / 0.4) * 0.3
    : 0.3 + (1 - Math.pow(1 - (t - 0.4) / 0.6, 2.8)) * 0.7
}

/**
 * 生成锯齿分裂线的 SVG path d 属性
 * split ∈ [0, 100]，分裂线从 (split%, 0) 连到 (0, split%) 带锯齿
 */
function generateSplitPath(split: number): string {
  const segs = 28 // 28 段锯齿
  splitJitterSeed = (splitJitterSeed * 16807) % 2147483647
  let seed = splitJitterSeed
  const prng = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646 }

  // 起点: (split%, 0)，终点: (0, split%)
  const sx = split
  const sy = 0
  const ex = 0
  const ey = split

  let d = `M ${sx.toFixed(1)},${sy.toFixed(1)} `

  const jitterAmp = clamp(split * 0.08, 0.3, 3.5) // 锯齿幅度随 split 增大

  for (let i = 1; i < segs; i++) {
    const t = i / segs
    const lx = sx + (ex - sx) * t
    const ly = sy + (ey - sy) * t

    // 垂直偏移（垂直于对角线方向）
    const nx = 1 // 对角线法线
    const ny = 1
    const jitter = (prng() - 0.5) * jitterAmp * 2

    const px = lx + nx * jitter
    const py = ly + ny * jitter

    d += `L ${px.toFixed(1)},${py.toFixed(1)} `
  }

  d += `L ${ex.toFixed(1)},${ey.toFixed(1)}`
  return d
}

// ==================== 粒子初始化 ====================
function initParticlesCanvas(canvas: HTMLCanvasElement, isLeft: boolean) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const dpr = window.devicePixelRatio || 1
  const w = canvas.offsetWidth
  const h = canvas.offsetHeight
  canvas.width = w * dpr
  canvas.height = h * dpr
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  return ctx
}

function spawnParticles(isLeft: boolean): Particle[] {
  const w = stageW || 800
  const h = stageH || 600
  const particles: Particle[] = []

  for (let i = 0; i < PARTICLE_BUDGET; i++) {
    let x: number, y: number

    if (isLeft) {
      // 优先分布在左上三角区域
      const r1 = Math.random()
      const r2 = Math.random()
      x = r1 * r2 * w
      y = (1 - r1) * r2 * h + r1 * (1 - r2) * 0.3 * h
    } else {
      // 优先分布在右下区域
      const r1 = Math.random()
      const r2 = Math.random()
      x = w - r1 * r2 * w
      y = h - r1 * r2 * h + r1 * r2 * 0.2 * h
    }

    particles.push({
      x: clamp(x, 0, w),
      y: clamp(y, 0, h),
      r: 0.6 + Math.random() * 2.2,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35 - 0.15,
      a: 0.15 + Math.random() * 0.4,
      hue: isLeft ? (190 + Math.random() * 30) : (25 + Math.random() * 25),
      pulsePhase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.01 + Math.random() * 0.03,
    })
  }
  return particles
}

function drawParticles(
  ctx: CanvasRenderingContext2D | null,
  canvas: HTMLCanvasElement | null,
  particles: Particle[],
  time: number,
) {
  if (!ctx || !canvas) return
  const w = canvas.offsetWidth
  const h = canvas.offsetHeight

  ctx.clearRect(0, 0, w, h)

  particles.forEach(p => {
    // 移动
    p.x += p.vx
    p.y += p.vy

    // 边界回绕
    if (p.x < -10) p.x = w + 10
    if (p.x > w + 10) p.x = -10
    if (p.y < -10) p.y = h + 10
    if (p.y > h + 10) p.y = -10

    // 脉冲
    const pulse = 0.5 + 0.5 * Math.sin(time * p.pulseSpeed * 1000 + p.pulsePhase)
    const alpha = p.a * (0.6 + pulse * 0.4)

    // 辉光
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2)
    ctx.fillStyle = `hsla(${p.hue}, 70%, 70%, ${(alpha * 0.25).toFixed(3)})`
    ctx.fill()

    // 核心
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
    ctx.fillStyle = `hsla(${p.hue}, 60%, 80%, ${alpha.toFixed(3)})`
    ctx.fill()
  })
}

function animateLeftParticles(time: number) {
  if (leftParticles.length > 0) {
    drawParticles(leftCtx, particlesLeftRef.value, leftParticles, time)
  }
  leftAnimId = requestAnimationFrame(animateLeftParticles)
}

function animateRightParticles(time: number) {
  if (rightParticles.length > 0) {
    drawParticles(rightCtx, particlesRightRef.value, rightParticles, time)
  }
  rightAnimId = requestAnimationFrame(animateRightParticles)
}

// ==================== 挂载 ====================
onMounted(async () => {
  if (!sectionRef.value || !stageRef.value) return
  await nextTick()

  const stageRect = stageRef.value.getBoundingClientRect()
  stageW = stageRect.width
  stageH = stageRect.height

  // 初始化粒子系统
  setTimeout(() => {
    if (particlesLeftRef.value) {
      leftCtx = initParticlesCanvas(particlesLeftRef.value, true)
      leftParticles = spawnParticles(true)
      leftW = particlesLeftRef.value.offsetWidth
      leftH = particlesLeftRef.value.offsetHeight
    }
    if (particlesRightRef.value) {
      rightCtx = initParticlesCanvas(particlesRightRef.value, false)
      rightParticles = spawnParticles(false)
      rightW = particlesRightRef.value.offsetWidth
      rightH = particlesRightRef.value.offsetHeight
    }
  }, 400)

  leftAnimId = requestAnimationFrame(animateLeftParticles)
  rightAnimId = requestAnimationFrame(animateRightParticles)

  const ctx = gsap.context(() => {
    const mainSt = ScrollTrigger.create({
      trigger: sectionRef.value!,
      start: 'top 92%',
      end: 'bottom 18%',
      scrub: 1.2,
      onUpdate(self) {
        const p = self.progress
        const eased = splitEase(p)
        // split: 从 8 → 92 (分裂线从左上移向右下)
        const split = 8 + eased * 84

        // Layer 1: 图片A clip-path (左上半三角形)
        if (imgARef.value) {
          imgARef.value.style.clipPath = `polygon(0% 0%, ${split}% 0%, 0% ${split}%)`
        }

        // Layer 2: 图片B clip-path (右下半区域)
        if (imgBRef.value) {
          imgBRef.value.style.clipPath =
            `polygon(100% 100%, 100% 0%, ${split}% 0%, 0% ${split}%, 0% 100%)`
        }

        // Layer 4/5: 左右粒子 Canvas 的 clip-path
        if (particlesLeftRef.value) {
          particlesLeftRef.value.style.clipPath = `polygon(0% 0%, ${split}% 0%, 0% ${split}%)`
        }
        if (particlesRightRef.value) {
          particlesRightRef.value.style.clipPath =
            `polygon(100% 100%, 100% 0%, ${split}% 0%, 0% ${split}%, 0% 100%)`
        }

        // Layer 3: SVG 分裂线
        const pathD = generateSplitPath(split)
        if (splitMainRef.value) {
          splitMainRef.value.setAttribute('d', pathD)
        }
        if (splitOuterRef.value) {
          splitOuterRef.value.setAttribute('d', pathD)
        }

        // Layer 6: 能量溢出光晕带（定位跟随对角线）
        if (energyBandRef.value) {
          // 能量带中心在分裂线中点
          const midPercent = split / 2
          energyBandRef.value.style.left = `${midPercent}%`
          energyBandRef.value.style.top = `${midPercent}%`
          const bandAlpha = clamp((split - 8) / 30, 0, 0.8) * clamp((92 - split) / 30, 0, 1)
          energyBandRef.value.style.opacity = String(bandAlpha)
        }

        // Layer 7: 标签
        if (labelLeftRef.value) {
          labelLeftRef.value.style.opacity = String(clamp((split - 20) / 30, 0, 1))
        }
        if (labelRightRef.value) {
          labelRightRef.value.style.opacity = String(clamp((72 - split) / 30, 0, 1))
        }

        // 进度条
        const splitPct = Math.round((split - 8) / 84 * 100)
        if (progressBarRef.value) {
          progressBarRef.value.style.width = `${splitPct}%`
        }
        if (progressValRef.value) {
          progressValRef.value.textContent = String(splitPct)
        }
      },
      onLeaveBack() {
        if (imgARef.value) imgARef.value.style.clipPath = 'polygon(0% 0%, 8% 0%, 0% 8%)'
        if (imgBRef.value) imgBRef.value.style.clipPath = 'polygon(100% 100%, 100% 0%, 8% 0%, 0% 8%, 0% 100%)'
      },
    })
    cleanupFns.push(() => mainSt.kill())

    // ===== 文字入场 =====
    if (contentRef.value) {
      const textTl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.value!, start: 'top 58%', end: 'top 18%', scrub: 0.9 },
      })
      cleanupFns.push(() => textTl.kill())

      textTl.fromTo(contentRef.value, { opacity: 0, y: 32 }, { opacity: 1, y: 0, ease: 'power3.out' }, 0)
      if (titleRef.value) {
        textTl.fromTo(titleRef.value, { opacity: 0, y: 18, filter: 'blur(4px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', ease: 'expo.out' }, 0.05)
      }
      if (dividerRef.value) {
        textTl.fromTo(dividerRef.value, { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, ease: 'power3.out' }, 0.1)
      }
    }
  }, sectionRef.value)
})

// ==================== 清理 ====================
onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(st => { if (st.vars.trigger === sectionRef.value) st.kill() })
  cancelAnimationFrame(leftAnimId)
  cancelAnimationFrame(rightAnimId)
})
</script>

<style scoped lang="scss">
// ==================== 容器 ====================
.fa-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #060b14;
}

// ==================== 深色背景 ====================
.fa-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(ellipse at 20% 20%, rgba(120, 160, 200, 0.05) 0%, transparent 50%),
    radial-gradient(ellipse at 75% 75%, rgba(200, 100, 50, 0.06) 0%, transparent 50%);
}

// ==================== 图片舞台 ====================
.fa-stage {
  position: absolute;
  inset: 4%;
  z-index: 2;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 0 80px rgba(0, 0, 0, 0.4);
}

// Layer 1: 图片A — 左上半 (白天都市)
.fa-img-a {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  clip-path: polygon(0% 0%, 8% 0%, 0% 8%);
  filter: saturate(0.82) brightness(1.08);
  z-index: 1;
  will-change: clip-path;
}

// Layer 2: 图片B — 右下半 (赛博夜晚)
.fa-img-b {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  clip-path: polygon(100% 100%, 100% 0%, 8% 0%, 0% 8%, 0% 100%);
  filter: hue-rotate(120deg) contrast(1.35) brightness(0.9);
  z-index: 2;
  will-change: clip-path;
}

// ==================== Layer 6: 能量溢出光晕带 ====================
.fa-energy-band {
  position: absolute;
  z-index: 4;
  width: 60%;
  height: 200%;
  transform: translate(-50%, -50%) rotate(-45deg);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s;
}

.fa-energy-inner {
  position: absolute;
  top: 45%;
  left: 0;
  width: 100%;
  height: 10%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(80, 180, 255, 0) 30%,
    rgba(100, 200, 255, 0.4) 47%,
    rgba(180, 230, 255, 0.7) 50%,
    rgba(100, 200, 255, 0.4) 53%,
    rgba(80, 180, 255, 0) 70%,
    transparent 100%
  );
  filter: blur(16px);
}

// ==================== Layer 3: SVG 分裂线 ====================
.fa-split-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  pointer-events: none;
  overflow: visible;
}

.fa-split-outer {
  fill: none;
  stroke: rgba(100, 180, 255, 0.5);
  stroke-width: 8;
  stroke-linecap: round;
  stroke-linejoin: round;
  filter: url(#split-glow-outer-ms);
}

.fa-split-main {
  fill: none;
  stroke: rgba(180, 220, 255, 0.85);
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  filter: url(#split-glow-ms);
}

// ==================== Layer 4/5: 粒子 Canvas ====================
.fa-particles-left {
  position: absolute;
  inset: 4%;
  z-index: 5;
  pointer-events: none;
  clip-path: polygon(0% 0%, 8% 0%, 0% 8%);
  will-change: clip-path;
}

.fa-particles-right {
  position: absolute;
  inset: 4%;
  z-index: 5;
  pointer-events: none;
  clip-path: polygon(100% 100%, 100% 0%, 8% 0%, 0% 8%, 0% 100%);
  will-change: clip-path;
}

// ==================== Layer 7: 世界标签 ====================
.fa-label-left,
.fa-label-right {
  position: absolute;
  z-index: 10;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0;
  transition: opacity 0.4s;
}

.fa-label-left {
  top: 12%;
  left: 12%;
}

.fa-label-right {
  bottom: 12%;
  right: 12%;
}

.fa-label-text {
  font-size: clamp(0.9rem, 2vw, 1.5rem);
  font-weight: 800;
  letter-spacing: 0.2em;
  text-shadow: 0 0 20px currentColor;
}

.fa-label-left .fa-label-text {
  color: rgba(180, 215, 250, 0.9);
  text-shadow:
    0 0 20px rgba(100, 180, 240, 0.6),
    0 0 50px rgba(60, 150, 230, 0.3);
}

.fa-label-right .fa-label-text {
  color: rgba(250, 160, 80, 0.9);
  text-shadow:
    0 0 20px rgba(240, 120, 40, 0.6),
    0 0 50px rgba(220, 90, 20, 0.3);
}

.fa-label-sub {
  font-size: clamp(0.52rem, 0.9vw, 0.7rem);
  font-weight: 300;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  margin-top: 4px;
}

.fa-label-left .fa-label-sub {
  color: rgba(140, 190, 230, 0.45);
}

.fa-label-right .fa-label-sub {
  color: rgba(230, 140, 80, 0.45);
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
  width: 220px;
  height: 2px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 2px;
  overflow: hidden;
}

.fa-progress-bar {
  height: 100%;
  width: 50%;
  background: linear-gradient(90deg,
    rgba(80, 170, 240, 0.5),
    rgba(160, 210, 255, 0.8),
    rgba(230, 140, 60, 0.7),
    rgba(240, 120, 40, 0.5)
  );
  border-radius: 2px;
  box-shadow: 0 0 12px rgba(100, 180, 240, 0.4);
}

.fa-progress-label {
  display: flex;
  align-items: baseline;
  gap: 4px;
  font-family: 'Courier New', monospace;
}

.fa-progress-val {
  font-size: 1.5rem;
  font-weight: 700;
  color: rgba(170, 215, 255, 0.9);
  text-shadow: 0 0 12px rgba(80, 170, 240, 0.4);
  min-width: 28px;
  text-align: right;
}

.fa-progress-unit {
  font-size: 0.64rem;
  letter-spacing: 0.15em;
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
  font-size: clamp(1.8rem, 5vw, 3.5rem);
  font-weight: 800;
  letter-spacing: 0.05em;
  color: #fff;
  text-shadow:
    0 0 30px rgba(80, 170, 245, 0.5),
    0 0 60px rgba(120, 120, 230, 0.3),
    0 0 100px rgba(50, 90, 210, 0.18);
  margin: 0 0 10px;
  line-height: 1.15;
}

.fa-divider {
  width: 72px;
  height: 2px;
  margin: 0 auto 8px;
  background: linear-gradient(90deg,
    rgba(60, 155, 235, 0.2),
    rgba(100, 195, 250, 0.6),
    rgba(60, 155, 235, 0.2)
  );
  border-radius: 2px;
  transform-origin: center;
}

.fa-sub {
  font-size: clamp(0.68rem, 1.2vw, 0.88rem);
  font-weight: 400;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.06em;
  color: rgba(130, 185, 240, 0.55);
  margin: 0;
}
</style>
