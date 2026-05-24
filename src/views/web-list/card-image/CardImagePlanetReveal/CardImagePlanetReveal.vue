<template>
  <div class="fa-section" ref="sectionRef">
    <!-- 深空背景 -->
    <div class="fa-bg"></div>

    <!-- 背景径向光晕 (跟随圆形扩张) -->
    <div class="fa-bg-glow" ref="bgGlowRef"></div>

    <!-- 图片舞台 -->
    <div class="fa-stage" ref="stageRef">
      <!-- Layer 1: 图片A - 基础层，始终显示 -->
      <div class="fa-img-a" :style="{ backgroundImage: `url(${imageA})` }"></div>

      <!-- Layer 2: 图片B - 圆形遮罩揭示 -->
      <div
        class="fa-img-b"
        ref="imgBRef"
        :style="{ backgroundImage: `url(${imageB})` }"
      >
        <!-- 胶片颗粒质感 -->
        <div class="fa-img-grain"></div>
      </div>
    </div>

    <!-- Layer 3-6: 光晕层 + 大气粒子环 (合并在 Canvas) -->
    <canvas class="fa-glow-canvas" ref="glowCanvasRef"></canvas>

    <!-- Layer 6: 星空粒子背景 -->
    <canvas class="fa-stars-canvas" ref="starsCanvasRef"></canvas>

    <!-- 进度指示器 -->
    <div class="fa-progress" ref="progressRef">
      <div class="fa-progress-track">
        <div class="fa-progress-bar" ref="progressBarRef"></div>
      </div>
      <div class="fa-progress-label">
        <span class="fa-progress-val" ref="progressValRef">0</span>
        <span class="fa-progress-unit">% REVEALED</span>
      </div>
    </div>

    <!-- 内容覆盖 -->
    <div class="fa-content" ref="contentRef">
      <h2 class="fa-title" ref="titleRef">行星遮罩揭示</h2>
      <div class="fa-divider" ref="dividerRef"></div>
      <p class="fa-sub">Planet Reveal · Atmospheric Scatter</p>
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
// 图A：都市夜景 (基础层，始终可见)
const imageA = 'https://images.unsplash.com/photo-1477959855577-12b0c0e4f6e3?w=1920&q=80'
// 图B：自然星空 (圆形遮罩揭示)
const imageB = 'https://images.unsplash.com/photo-1444080748397-f442aa95c3e5?w=1920&q=80'

// ==================== Refs ====================
const sectionRef = ref<HTMLElement | null>(null)
const stageRef = ref<HTMLElement | null>(null)
const imgBRef = ref<HTMLElement | null>(null)
const glowCanvasRef = ref<HTMLCanvasElement | null>(null)
const starsCanvasRef = ref<HTMLCanvasElement | null>(null)
const bgGlowRef = ref<HTMLElement | null>(null)
const progressBarRef = ref<HTMLElement | null>(null)
const progressValRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const dividerRef = ref<HTMLElement | null>(null)

let cleanupFns: TweenCleanup[] = []

// ==================== Canvas 状态 ====================
let glowCtx: CanvasRenderingContext2D | null = null
let glowW = 0
let glowH = 0
let glowAnimId = 0

let starsCtx: CanvasRenderingContext2D | null = null
let stars: { x: number; y: number; r: number; a: number; twinkleSpeed: number; twinklePhase: number }[] = []
let starsAnimId = 0

// ==================== 粒子环状态 ====================
interface RingParticle {
  angle: number
  distance: number
  radius: number
  baseAlpha: number
  orbitSpeed: number
  vibrateAmp: number
  vibratePhase: number
  hue: number
}

let ringParticles: RingParticle[] = []
const PARTICLE_COUNT = 60
let currentRadiusPx = 0
let currentProgress = 0

// ==================== 辅助函数 ====================
function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)) }

/**
 * 行星升起曲线（smoothstep + 微偏终段）
 * 模拟光学错觉：行星从地平线升起时看起来慢、中间快、最后稳
 */
function planetRiseCurve(t: number): number {
  if (t <= 0) return 0
  if (t >= 1) return 1
  // 修正 smoothstep：前段更快启动
  return t < 0.35
    ? (t / 0.35) * (t / 0.35) * 0.25  // 前方 0→0.25 慢加速
    : 0.25 + (1 - Math.pow(1 - (t - 0.35) / 0.65, 3)) * 0.75  // 后段 0.25→1 强力加速
}

// ==================== 背景星空 Canvas ====================
function initStarsCanvas() {
  const canvas = starsCanvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const dpr = window.devicePixelRatio || 1
  const w = canvas.offsetWidth
  const h = canvas.offsetHeight
  canvas.width = w * dpr
  canvas.height = h * dpr
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  starsCtx = ctx

  stars = Array.from({ length: 120 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: 0.3 + Math.random() * 1.4,
    a: 0.15 + Math.random() * 0.55,
    twinkleSpeed: 0.004 + Math.random() * 0.02,
    twinklePhase: Math.random() * Math.PI * 2,
  }))
}

function drawStars(time: number) {
  if (!starsCtx || !starsCanvasRef.value) return
  const ctx = starsCtx
  const canvas = starsCanvasRef.value
  const w = canvas.offsetWidth
  const h = canvas.offsetHeight

  ctx.clearRect(0, 0, w, h)

  stars.forEach(s => {
    const twinkle = 0.5 + 0.5 * Math.sin(time * s.twinkleSpeed * 1000 + s.twinklePhase)
    const alpha = s.a * twinkle

    ctx.beginPath()
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(200,220,255,${alpha.toFixed(3)})`
    ctx.fill()

    // 亮星增加十字光芒
    if (s.r > 1.0 && twinkle > 0.85) {
      const glow = (twinkle - 0.85) / 0.15
      ctx.strokeStyle = `rgba(180,210,255,${(glow * 0.3).toFixed(3)})`
      ctx.lineWidth = 0.3
      ctx.beginPath()
      ctx.moveTo(s.x - s.r * 3, s.y)
      ctx.lineTo(s.x + s.r * 3, s.y)
      ctx.moveTo(s.x, s.y - s.r * 3)
      ctx.lineTo(s.x, s.y + s.r * 3)
      ctx.stroke()
    }
  })
}

function animateStars(time: number) {
  drawStars(time)
  starsAnimId = requestAnimationFrame(animateStars)
}

// ==================== 光晕 Canvas ====================
function initGlowCanvas() {
  const canvas = glowCanvasRef.value
  if (!canvas || !stageRef.value) return
  const rect = stageRef.value.getBoundingClientRect()
  const dpr = window.devicePixelRatio || 1
  glowW = rect.width
  glowH = rect.height
  canvas.width = glowW * dpr
  canvas.height = glowH * dpr
  canvas.style.width = glowW + 'px'
  canvas.style.height = glowH + 'px'
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    glowCtx = ctx
  }

  // 初始化粒子环
  let seed = 4242
  const prng = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646 }

  ringParticles = Array.from({ length: PARTICLE_COUNT }, () => ({
    angle: prng() * Math.PI * 2,
    distance: (prng() - 0.5) * 25,
    radius: 1.2 + prng() * 3.0,
    baseAlpha: 0.18 + prng() * 0.45,
    orbitSpeed: 0.08 + prng() * 0.25,
    vibrateAmp: 2 + prng() * 8,
    vibratePhase: prng() * Math.PI * 2,
    hue: 190 + prng() * 40,
  }))
}

/**
 * 绘制光晕主函数 — 包含所有 Layer 3-6 的光晕效果
 */
function drawGlowLayers(time: number) {
  if (!glowCtx || !glowCanvasRef.value) return
  const ctx = glowCtx
  const w = glowW
  const h = glowH
  const cx = w / 2
  const cy = h / 2

  ctx.clearRect(0, 0, w, h)

  if (currentRadiusPx < 2) return

  const r = currentRadiusPx
  const revealAlpha = clamp(currentProgress * 3, 0, 1)

  // ─── Layer 4: 外圈大气散射光晕 (彩色 → 透明，30px 宽) ───
  const outerGrad = ctx.createRadialGradient(cx, cy, r * 0.96, cx, cy, r * 1.14)
  outerGrad.addColorStop(0, 'rgba(80, 160, 240, 0)')
  outerGrad.addColorStop(0.08, `rgba(70, 150, 230, ${(0.15 * revealAlpha).toFixed(3)})`)
  outerGrad.addColorStop(0.25, `rgba(60, 130, 215, ${(0.10 * revealAlpha).toFixed(3)})`)
  outerGrad.addColorStop(0.55, `rgba(40, 100, 190, ${(0.04 * revealAlpha).toFixed(3)})`)
  outerGrad.addColorStop(1, 'rgba(20, 50, 150, 0)')

  ctx.fillStyle = outerGrad
  ctx.beginPath()
  ctx.arc(cx, cy, r * 1.14, 0, Math.PI * 2)
  ctx.arc(cx, cy, r * 0.96, 0, Math.PI * 2, true)
  ctx.fill()

  // ─── Layer 3: 内圈光晕 (白色→透明，10px 宽，高亮边缘) ───
  const innerGrad = ctx.createRadialGradient(cx, cy, r * 0.96, cx, cy, r * 1.02)
  innerGrad.addColorStop(0, 'rgba(255, 255, 255, 0)')
  innerGrad.addColorStop(0.3, `rgba(220, 240, 255, ${(0.5 * revealAlpha).toFixed(3)})`)
  innerGrad.addColorStop(0.6, `rgba(160, 210, 255, ${(0.7 * revealAlpha).toFixed(3)})`)
  innerGrad.addColorStop(0.85, `rgba(90, 160, 230, ${(0.25 * revealAlpha).toFixed(3)})`)
  innerGrad.addColorStop(1, 'rgba(40, 100, 200, 0)')

  ctx.fillStyle = innerGrad
  ctx.beginPath()
  ctx.arc(cx, cy, r * 1.02, 0, Math.PI * 2)
  ctx.arc(cx, cy, r * 0.96, 0, Math.PI * 2, true)
  ctx.fill()

  // ─── Layer 4b: 二次外圈彩色散射 (更宽的半透明环) ───
  const scatterGrad = ctx.createRadialGradient(cx, cy, r * 0.98, cx, cy, r * 1.22)
  scatterGrad.addColorStop(0, 'rgba(120, 190, 255, 0)')
  scatterGrad.addColorStop(0.12, `rgba(100, 170, 245, ${(0.08 * revealAlpha).toFixed(3)})`)
  scatterGrad.addColorStop(0.35, `rgba(70, 140, 220, ${(0.04 * revealAlpha).toFixed(3)})`)
  scatterGrad.addColorStop(1, 'rgba(30, 80, 180, 0)')

  ctx.fillStyle = scatterGrad
  ctx.beginPath()
  ctx.arc(cx, cy, r * 1.22, 0, Math.PI * 2)
  ctx.arc(cx, cy, r * 0.98, 0, Math.PI * 2, true)
  ctx.fill()

  // ─── Layer 5: 大气粒子环 (60 个环绕光点) ───
  // 只在行星有一定大小时才明显
  const particleAlpha = clamp((currentRadiusPx - 10) / 60, 0, 1) * revealAlpha

  if (particleAlpha > 0.02) {
    ctx.globalCompositeOperation = 'lighter'

    ringParticles.forEach(p => {
      // 粒子角度随时间和轨道速度旋转
      const angle = p.angle + time * p.orbitSpeed * 0.002

      // 微小振动偏移
      const vibrate = Math.sin(time * 0.008 + p.vibratePhase) * p.vibrateAmp

      const dist = r + p.distance + vibrate
      const px = cx + Math.cos(angle) * dist
      const py = cy + Math.sin(angle) * dist

      // 越靠近环中心越亮
      const distAlpha = p.baseAlpha * (1 - Math.abs(p.distance) / 30) * particleAlpha

      if (distAlpha < 0.01) return

      // 辉光
      const glowR = p.radius * 3
      const glowGrad = ctx.createRadialGradient(px, py, 0, px, py, glowR)
      glowGrad.addColorStop(0, `hsla(${p.hue}, 75%, 75%, ${(distAlpha * 1.2).toFixed(3)})`)
      glowGrad.addColorStop(0.5, `hsla(${p.hue}, 60%, 65%, ${(distAlpha * 0.4).toFixed(3)})`)
      glowGrad.addColorStop(1, 'rgba(0,0,0,0)')

      ctx.fillStyle = glowGrad
      ctx.beginPath()
      ctx.arc(px, py, glowR, 0, Math.PI * 2)
      ctx.fill()

      // 核心亮点
      ctx.beginPath()
      ctx.arc(px, py, p.radius * 0.7, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255,255,255,${(distAlpha * 0.85).toFixed(3)})`
      ctx.fill()
    })

    ctx.globalCompositeOperation = 'source-over'
  }

  // ─── 行星中心微弱高光 ───
  if (r > 30 && revealAlpha > 0.3) {
    const centerAlpha = clamp((r - 30) / 150, 0, 1) * revealAlpha * 0.08
    const centerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 0.7)
    centerGrad.addColorStop(0, `rgba(200, 230, 255, ${centerAlpha.toFixed(3)})`)
    centerGrad.addColorStop(0.5, `rgba(150, 210, 255, ${(centerAlpha * 0.5).toFixed(3)})`)
    centerGrad.addColorStop(1, 'rgba(80, 150, 220, 0)')

    ctx.fillStyle = centerGrad
    ctx.beginPath()
    ctx.arc(cx, cy, r * 0.7, 0, Math.PI * 2)
    ctx.fill()
  }
}

function animateGlow(time: number) {
  drawGlowLayers(time)
  glowAnimId = requestAnimationFrame(animateGlow)
}

// ==================== 挂载 ====================
onMounted(async () => {
  if (!sectionRef.value) return
  await nextTick()
  setTimeout(() => {
    initGlowCanvas()
    initStarsCanvas()
  }, 400)

  // 启动 Canvas 动画循环
  glowAnimId = requestAnimationFrame(animateGlow)
  starsAnimId = requestAnimationFrame(animateStars)

  const ctx = gsap.context(() => {
    // ===== 主驱动：圆形遮罩扩张 =====
    const mainSt = ScrollTrigger.create({
      trigger: sectionRef.value!,
      start: 'top 92%',
      end: 'bottom 18%',
      scrub: 1.2,
      onUpdate(self) {
        const p = self.progress
        const eased = planetRiseCurve(p)
        const radius = eased * 80 // 0% → 80%

        currentProgress = p
        currentRadiusPx = glowW > 0 ? (radius / 100) * Math.min(glowW, glowH) * 0.42 : 0

        // Layer 2: 更新圆形 clip-path
        if (imgBRef.value) {
          imgBRef.value.style.clipPath = `circle(${radius.toFixed(1)}% at 50% 50%)`
        }

        // Layer 6: 背景径向光晕跟随扩张
        if (bgGlowRef.value) {
          const glowAlpha = clamp(radius / 35, 0, 0.45)
          bgGlowRef.value.style.opacity = String(glowAlpha)
          bgGlowRef.value.style.transform = `translate(-50%, -50%) scale(${0.6 + radius / 80 * 0.8})`
        }

        // 进度指示器
        const revealPercent = Math.round(radius / 80 * 100)
        if (progressBarRef.value) {
          progressBarRef.value.style.width = `${revealPercent}%`
        }
        if (progressValRef.value) {
          progressValRef.value.textContent = String(revealPercent)
        }
      },
      onLeaveBack() {
        if (glowCtx && glowCanvasRef.value) glowCtx.clearRect(0, 0, glowW, glowH)
        currentRadiusPx = 0
        currentProgress = 0
      },
    })
    cleanupFns.push(() => mainSt.kill())

    // ===== 文字入场 =====
    if (contentRef.value) {
      const textTl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.value!, start: 'top 58%', end: 'top 18%', scrub: 0.9 },
      })
      cleanupFns.push(() => textTl.kill())

      textTl.fromTo(
        contentRef.value,
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0, ease: 'power3.out' },
        0,
      )
      if (titleRef.value) {
        textTl.fromTo(
          titleRef.value,
          { opacity: 0, y: 20, filter: 'blur(4px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', ease: 'expo.out' },
          0.05,
        )
      }
      if (dividerRef.value) {
        textTl.fromTo(
          dividerRef.value,
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, ease: 'power3.out' },
          0.1,
        )
      }
    }
  }, sectionRef.value)
})

// ==================== 清理 ====================
onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(st => {
    if (st.vars.trigger === sectionRef.value) st.kill()
  })
  cancelAnimationFrame(glowAnimId)
  cancelAnimationFrame(starsAnimId)
})
</script>

<style scoped lang="scss">
// ==================== 容器 ====================
.fa-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: radial-gradient(ellipse at 50% 40%, #0a101e 0%, #050a16 40%, #020510 75%, #010208 100%);
}

// ==================== 深空背景光晕 ====================
.fa-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(ellipse at 30% 25%, rgba(25, 90, 170, 0.04) 0%, transparent 55%),
    radial-gradient(ellipse at 65% 55%, rgba(120, 60, 170, 0.03) 0%, transparent 50%),
    radial-gradient(ellipse at 20% 70%, rgba(40, 130, 200, 0.03) 0%, transparent 50%);
}

// ==================== 星空 Canvas ====================
.fa-stars-canvas {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

// ==================== 背景径向光晕 (跟随圆形扩张) ====================
.fa-bg-glow {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) scale(0.6);
  width: min(70vw, 70vh);
  height: min(70vw, 70vh);
  border-radius: 50%;
  background: radial-gradient(
    circle at center,
    rgba(80, 160, 240, 0.18) 0%,
    rgba(60, 140, 220, 0.08) 35%,
    rgba(40, 100, 200, 0.02) 60%,
    transparent 78%
  );
  pointer-events: none;
  opacity: 0;
  filter: blur(40px);
  z-index: 1;
  transition: opacity 0.35s;
}

// ==================== 图片舞台 ====================
.fa-stage {
  position: absolute;
  inset: 5%;
  z-index: 2;
  border-radius: 4px;
  overflow: hidden;
  box-shadow:
    0 0 60px rgba(20, 60, 120, 0.15),
    inset 0 0 80px rgba(10, 30, 60, 0.1);
}

// Layer 1: 图片A (基础层)
.fa-img-a {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  z-index: 1;
}

// Layer 2: 图片B (圆形遮罩揭示)
.fa-img-b {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  clip-path: circle(0% at 50% 50%);
  z-index: 2;
  will-change: clip-path;
}

// 胶片颗粒质感 (叠加在 img-b 上)
.fa-img-grain {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 3;
  &:after {
    content: '';
    position: absolute;
    inset: -50%;
    background-image: repeating-radial-gradient(
      circle at center,
      rgba(255,255,255,0.03) 0px,
      rgba(255,255,255,0.01) 1px,
      transparent 2px,
      transparent 4px
    );
  }
}

// ==================== 光晕 Canvas ====================
.fa-glow-canvas {
  position: absolute;
  inset: 5%;
  z-index: 3;
  pointer-events: none;
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
  background: rgba(255, 255, 255, 0.05);
  border-radius: 2px;
  overflow: hidden;
}

.fa-progress-bar {
  height: 100%;
  width: 0%;
  background: linear-gradient(
    90deg,
    rgba(60, 170, 245, 0.6),
    rgba(100, 200, 255, 0.85),
    rgba(150, 220, 255, 0.7),
    rgba(60, 170, 245, 0.6)
  );
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(60, 180, 250, 0.5);
}

.fa-progress-label {
  display: flex;
  align-items: baseline;
  gap: 4px;
  font-family: 'Courier New', monospace;
}

.fa-progress-val {
  font-size: 1.6rem;
  font-weight: 700;
  color: rgba(150, 220, 255, 0.9);
  text-shadow: 0 0 14px rgba(70, 180, 245, 0.4);
  min-width: 32px;
  text-align: right;
}

.fa-progress-unit {
  font-size: 0.66rem;
  letter-spacing: 0.15em;
  color: rgba(120, 170, 215, 0.5);
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
  font-size: clamp(1.9rem, 5vw, 3.6rem);
  font-weight: 800;
  letter-spacing: 0.05em;
  color: #fff;
  text-shadow:
    0 0 30px rgba(60, 175, 250, 0.5),
    0 0 60px rgba(90, 130, 240, 0.3),
    0 0 100px rgba(40, 120, 230, 0.18);
  margin: 0 0 12px;
  line-height: 1.15;
}

.fa-divider {
  width: 72px;
  height: 2px;
  margin: 0 auto 10px;
  background: linear-gradient(
    90deg,
    rgba(40, 150, 235, 0.2),
    rgba(90, 195, 250, 0.65),
    rgba(40, 150, 235, 0.2)
  );
  border-radius: 2px;
  transform-origin: center;
}

.fa-sub {
  font-size: clamp(0.7rem, 1.2vw, 0.9rem);
  font-weight: 400;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.06em;
  color: rgba(130, 190, 240, 0.55);
  margin: 0;
}
</style>
