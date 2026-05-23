<template>
  <section ref="parentRef" class="oil-slick-container" @mousemove="onMouseMove" @mouseleave="onMouseLeave">
    <!-- ==================== 第一层：深黑底色 ==================== -->
    <div class="abyss-bg"></div>

    <!-- ==================== 第二层：图片 ==================== -->
    <div ref="imageLayerRef" class="image-layer">
      <img :src="imageUrl" alt="" class="main-image" />
    </div>

    <!-- ==================== 第三层：Canvas 油膜渲染 ==================== -->
    <canvas ref="canvasRef" class="oil-canvas"></canvas>

    <!-- ==================== 第四层：裂口边缘彩虹光 ==================== -->
    <div ref="edgeGlowRef" class="edge-glow-layer">
      <div v-for="(pt, i) in rupturePoints" :key="'glow' + i"
        :ref="(el) => setGlowRef(el, i)"
        class="rupture-glow"
        :style="{ left: pt.x + '%', top: pt.y + '%' }"></div>
    </div>

    <!-- ==================== 第五层：油珠 ==================== -->
    <div class="beads-layer">
      <div v-for="(b, i) in beadData"
        :key="'b' + i"
        :ref="(el) => setBeadRef(el, i)"
        class="oil-bead"
        :style="{ left: b.x + '%', top: b.y + '%', width: b.size + 'px', height: b.size + 'px' }"></div>
    </div>

    <!-- ==================== 第六层：文字信息 ==================== -->
    <div ref="contentRef" class="content-overlay">
      <h2 ref="titleRef" class="title">彩虹油膜</h2>
      <p ref="subRef" class="subtitle">Oil Slick · Iridescent Spectrum</p>
      <div ref="dividerRef" class="divider"></div>
      <p ref="descRef" class="desc">薄膜干涉 · 表面张力破裂 · 七彩光谱</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void

// ==================== 破裂点定义（3 个） ====================
const rupturePoints = [
  { x: 38, y: 32 },
  { x: 66, y: 45 },
  { x: 48, y: 68 },
]

// ==================== 油珠数据（24 颗，沿破裂方向散布） ====================
function seedRand(s: number): () => number {
  let v = s
  return () => { v = (v * 16807) % 2147483647; return v / 2147483646 }
}
const rng = seedRand(42069)
const beadData = Array.from({ length: 24 }, () => {
  const rp = rupturePoints[Math.floor(rng() * rupturePoints.length)]
  const a = rng() * Math.PI * 2
  const d = 2 + rng() * 18
  return {
    x: rp.x + Math.cos(a) * d,
    y: rp.y + Math.sin(a) * d,
    size: 6 + rng() * 16,
    // 飞出方向
    dx: (rng() - 0.5) * 320,
    dy: (rng() - 0.5) * 320,
  }
})

// ==================== 模板引用 ====================
const parentRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const imageLayerRef = ref<HTMLElement | null>(null)
const edgeGlowRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const glowRefs: HTMLElement[] = []
const beadRefs: HTMLElement[] = []
const cleanupFns: TweenCleanup[] = []

const imageUrl = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80'

// ==================== 辅助 ====================
const setGlowRef = (el: unknown, i: number) => { if (el) glowRefs[i] = (el as any).$el || (el as HTMLElement) }
const setBeadRef = (el: unknown, i: number) => { if (el) beadRefs[i] = (el as any).$el || (el as HTMLElement) }

// ==================== Canvas 状态 ====================
let ctx: CanvasRenderingContext2D | null = null
let animationId = 0
let cw = 0, ch = 0
let scrollProgress = 0
let targetProgress = 0
let membraneTime = 0

// 鼠标位置（驱动油膜微扭曲方向）
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
  targetMRY = 0.45
}

// ==================== Canvas 渲染 ====================
function resize() {
  const canvas = canvasRef.value
  if (!canvas) return
  const parent = parentRef.value!
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  cw = parent.clientWidth
  ch = parent.clientHeight
  canvas.width = cw * dpr
  canvas.height = ch * dpr
  canvas.style.width = cw + 'px'
  canvas.style.height = ch + 'px'
  ctx = canvas.getContext('2d')!
  ctx.scale(dpr, dpr)
}

function hslStr(h: number, s: number, l: number, a: number = 1): string {
  return `hsla(${h % 360},${s}%,${l}%,${a})`
}

// ---- 油膜破裂进度曲线（先慢后快，模拟张力临界点） ----
function ruptureProgress(raw: number): number {
  if (raw <= 0) return 0
  const t = raw * 1.15 // 留一点余量让 0.87≈1
  // ease: 慢→临界→剧烈爆发
  if (t < 0.35) return 0.02 * (t / 0.35)
  if (t < 0.6) {
    const u = (t - 0.35) / 0.25
    return 0.02 + 0.13 * u * u
  }
  const u = (t - 0.6) / 0.4
  return 0.15 + 0.85 * u * u * u
}

// ---- 渲染帧 ----
function render() {
  if (!ctx || !canvasRef.value) return
  const canvas = canvasRef.value

  // 平滑插值
  scrollProgress += (targetProgress - scrollProgress) * 0.08
  membraneTime += 0.016

  // 鼠标平滑
  mouseXRatio += (targetMRX - mouseXRatio) * 0.04
  mouseYRatio += (targetMRY - mouseYRatio) * 0.04

  const rup = ruptureProgress(scrollProgress) // 0→1

  ctx.clearRect(0, 0, cw, ch)

  // ===== 油膜基础层：彩虹色 radial gradient 阵列 =====
  // 多层径向光斑构成流动的油膜底色
  const layers = [
    { cx: 0.35, cy: 0.30, r: 0.55, h: 200, s: 80, l: 65, a: 0.55 },
    { cx: 0.62, cy: 0.25, r: 0.48, h: 270, s: 75, l: 60, a: 0.48 },
    { cx: 0.42, cy: 0.58, r: 0.52, h: 140, s: 85, l: 55, a: 0.50 },
    { cx: 0.68, cy: 0.55, r: 0.44, h: 320, s: 70, l: 62, a: 0.46 },
    { cx: 0.28, cy: 0.62, r: 0.42, h: 40, s: 90, l: 58, a: 0.44 },
    { cx: 0.55, cy: 0.45, r: 0.50, h: 180, s: 82, l: 60, a: 0.52 },
  ]

  // 油膜流动色调偏移
  const waveHue = Math.sin(membraneTime * 0.4) * 30
  const waveMX = (mouseXRatio - 0.5) * 0.08
  const waveMY = (mouseYRatio - 0.5) * 0.08

  for (const L of layers) {
    const r = Math.max(L.r * cw * 0.9, 10)
    const grad = ctx.createRadialGradient(
      (L.cx + waveMX) * cw, (L.cy + waveMY) * ch, 0,
      (L.cx + waveMX) * cw, (L.cy + waveMY) * ch, r,
    )
    const h = (L.h + waveHue) % 360
    grad.addColorStop(0, hslStr(h, L.s, L.l, L.a * 0.9))
    grad.addColorStop(0.35, hslStr(h + 40, L.s, L.l - 5, L.a * 0.7))
    grad.addColorStop(0.65, hslStr(h + 80, L.s - 10, L.l - 10, L.a * 0.4))
    grad.addColorStop(1, 'transparent')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, cw, ch)
  }

  // ===== 波浪扭曲纹理：微细的液体波纹 =====
  ctx.globalCompositeOperation = 'overlay'
  for (let yi = 0; yi < ch; yi += 3) {
    const phase = membraneTime * 1.2 + yi * 0.015
    const amp = 1.5 + Math.sin(yi * 0.06 + membraneTime * 0.5) * 0.8
    const xOff = Math.sin(phase) * amp + Math.cos(yi * 0.04 + membraneTime * 0.7) * amp * 0.6
    ctx.strokeStyle = hslStr(
      210 + Math.sin(phase * 0.3) * 60,
      70,
      65,
      0.06,
    )
    ctx.lineWidth = 1
    ctx.beginPath()
    for (let xi = 0; xi <= cw; xi += 6) {
      const yOff = Math.sin((xi + membraneTime * 40) * 0.02) * 1.5 + Math.cos((xi - membraneTime * 25) * 0.025) * 1
      const px = xi + xOff
      const py = yi + yOff
      if (xi === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.stroke()
  }
  ctx.globalCompositeOperation = 'source-over'

  // ===== 高光反射斑 =====
  const hlGrad = ctx.createRadialGradient(
    (0.38 + mouseXRatio * 0.08) * cw,
    (0.28 + mouseYRatio * 0.06) * ch, 0,
    (0.38 + mouseXRatio * 0.08) * cw,
    (0.28 + mouseYRatio * 0.06) * ch, cw * 0.3,
  )
  hlGrad.addColorStop(0, 'rgba(255,255,250,0.15)')
  hlGrad.addColorStop(0.5, 'rgba(220,240,255,0.04)')
  hlGrad.addColorStop(1, 'transparent')
  ctx.fillStyle = hlGrad
  ctx.fillRect(0, 0, cw, ch)

  // ===== 破裂蒙版：在破裂区域擦除油膜（destination-out） =====
  ctx.save()
  ctx.globalCompositeOperation = 'destination-out'

  for (const rp of rupturePoints) {
    const rx = rp.x / 100 * cw
    const ry = rp.y / 100 * ch
    // 每点破裂半径：0 → 覆盖全屏的 85%
    const burstR = rup * Math.max(cw, ch) * 0.7
    if (burstR <= 0) continue

    // 不规则破裂边缘：用多层偏移圆模拟
    const grad = ctx.createRadialGradient(rx, ry, burstR * 0.45, rx, ry, burstR)
    grad.addColorStop(0, 'rgba(0,0,0,1)')
    grad.addColorStop(0.55, 'rgba(0,0,0,0.92)')
    grad.addColorStop(0.78, 'rgba(0,0,0,0.55)')
    grad.addColorStop(0.92, 'rgba(0,0,0,0.12)')
    grad.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, cw, ch)
  }
  ctx.restore()

  // ===== 裂口边缘彩虹辉光 =====
  ctx.save()
  ctx.globalAlpha = rup
  for (const rp of rupturePoints) {
    const rx = rp.x / 100 * cw
    const ry = rp.y / 100 * ch
    const burstR = rup * Math.max(cw, ch) * 0.7
    if (burstR <= 0) continue

    const edgeThickness = 16 + rup * 8
    // 在破裂初期 edgeThickness 可能 > burstR，导致 r0 为负
    const innerR = Math.max(burstR - edgeThickness, 0.5)

    // 绘制裂口边缘彩色光环
    const ringGrad = ctx.createRadialGradient(rx, ry, innerR, rx, ry, burstR + edgeThickness)
    ringGrad.addColorStop(0, 'transparent')
    ringGrad.addColorStop(0.35, hslStr(200 + membraneTime * 50, 100, 65, 0.55))
    ringGrad.addColorStop(0.55, hslStr(40 + membraneTime * 40, 100, 55, 0.45))
    ringGrad.addColorStop(0.7, hslStr(310 + membraneTime * 30, 100, 60, 0.4))
    ringGrad.addColorStop(0.85, hslStr(150 + membraneTime * 45, 100, 50, 0.2))
    ringGrad.addColorStop(1, 'transparent')
    ctx.fillStyle = ringGrad
    ctx.fillRect(0, 0, cw, ch)
  }
  ctx.restore()

  // ===== 顶层薄彩虹覆膜（覆盖全画面，破裂处透过） =====
  ctx.fillStyle = hslStr(
    260 + Math.sin(membraneTime * 0.35) * 40,
    60,
    70,
    0.06 + (1 - rup) * 0.08,
  )
  ctx.fillRect(0, 0, cw, ch)

  animationId = requestAnimationFrame(render)
}

// ==================== GSAP 动画 ====================
onMounted(async () => {
  if (!parentRef.value) return

  resize()
  window.addEventListener('resize', resize)

  // 初始隐藏文字和光斑
  gsap.set(contentRef.value, { opacity: 0, y: 40 })
  gsap.set([...glowRefs.filter(Boolean)], { opacity: 0, scale: 0.3 })
  gsap.set([...beadRefs.filter(Boolean)], { opacity: 0, scale: 0.2 })

  // ScrollTrigger 控制膜破裂进度
  const st = ScrollTrigger.create({
    trigger: parentRef.value,
    start: 'top 85%',
    end: 'bottom 15%',
    onUpdate: (self) => {
      targetProgress = self.progress
    },
  })
  cleanupFns.push(() => st.kill())

  // 裂口边缘光斑：随破裂依次闪现
  const glowTl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: 1.2,
    },
  })
  glowRefs.filter(Boolean).forEach((g, i) => {
    const sp = 0.1 + i * 0.12
    glowTl.to(g, { opacity: 0.9, scale: 1.5, duration: 0.18 }, sp)
    glowTl.to(g, { opacity: 0.5, scale: 1, duration: 0.3 }, sp + 0.18)
    glowTl.to(g, { opacity: 0, scale: 0.8, duration: 0.4 }, sp + 0.48)
  })
  cleanupFns.push(() => { glowTl.scrollTrigger?.kill(); glowTl.kill() })

  // 油珠：依次形成并飞出
  const beadTl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 82%',
      end: 'bottom 18%',
      scrub: 1.1,
    },
  })
  beadRefs.filter(Boolean).forEach((bead, i) => {
    const bd = beadData[i]
    const sp = 0.12 + i * 0.045
    beadTl.to(bead, { opacity: 0.85, scale: 1, duration: 0.08 }, sp)
    beadTl.to(bead, {
      x: bd.dx,
      y: bd.dy,
      scale: 0.15,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.in',
    }, sp + 0.08)
  })
  cleanupFns.push(() => { beadTl.scrollTrigger?.kill(); beadTl.kill() })

  // 图片：随着破裂逐渐显露（brightness 从暗到亮）
  gsap.set(imageLayerRef.value, { filter: 'brightness(0.3)' })
  const imgTl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 82%',
      end: 'bottom 15%',
      scrub: 1.0,
    },
  })
  imgTl.to(imageLayerRef.value, { filter: 'brightness(1.05)', duration: 1 })
  cleanupFns.push(() => { imgTl.scrollTrigger?.kill(); imgTl.kill() })

  // 文字渐显
  const textTl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 75%',
      end: 'top 28%',
      scrub: 1.0,
    },
  })
  textTl.to(contentRef.value, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' })
  cleanupFns.push(() => { textTl.scrollTrigger?.kill(); textTl.kill() })

  // 启动 Canvas 渲染循环
  animationId = requestAnimationFrame(render)
})

// ==================== 清理 ====================
onUnmounted(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', resize)
  cleanupFns.forEach((fn) => fn())
})
</script>

<style lang="scss" scoped>
/* ==================== 容器 ==================== */
.oil-slick-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #06060a;
}

/* ==================== 深黑底色 ==================== */
.abyss-bg {
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    radial-gradient(ellipse 100% 75% at 50% 42%, #0c0e16 0%, #06060a 55%, #020204 100%);
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

/* ==================== Canvas 油膜 ==================== */
.oil-canvas {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
}

/* ==================== 裂口边缘光斑 ==================== */
.edge-glow-layer {
  position: absolute;
  inset: 0;
  z-index: 4;
  pointer-events: none;
}

.rupture-glow {
  position: absolute;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  background:
    radial-gradient(circle, rgba(255,180,100,0.5) 0%, rgba(180,120,255,0.3) 25%, rgba(80,180,255,0.2) 50%, transparent 72%);
  filter: blur(12px);
  will-change: transform, opacity;
}

/* ==================== 油珠 ==================== */
.beads-layer {
  position: absolute;
  inset: 0;
  z-index: 8;
  pointer-events: none;
}

.oil-bead {
  position: absolute;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  background:
    radial-gradient(
      circle at 33% 30%,
      rgba(255,255,240,0.7) 0%,
      rgba(255,180,60,0.55) 18%,
      rgba(100,200,255,0.45) 38%,
      rgba(180,80,220,0.35) 58%,
      rgba(30,20,50,0.55) 82%,
      rgba(6,4,14,0.85) 100%
    );
  box-shadow:
    0 0 8px rgba(120,180,255,0.3),
    0 0 18px rgba(200,100,255,0.15),
    inset 0 0 3px rgba(255,255,255,0.25);
  will-change: transform, opacity;
}

/* ==================== 文字 ==================== */
.content-overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  will-change: transform, opacity;
}

.title {
  font-size: clamp(2.2rem, 6vw, 4rem);
  font-weight: 900;
  color: rgba(255,252,245,0.95);
  margin: 0 0 8px;
  letter-spacing: 0.07em;
  text-shadow:
    0 0 18px rgba(80,160,255,0.45),
    0 0 36px rgba(160,100,255,0.28),
    0 0 55px rgba(255,130,60,0.22),
    0 0 2px rgba(255,255,255,0.6);
}

.subtitle {
  font-size: clamp(0.8rem, 1.4vw, 1rem);
  font-weight: 300;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  color: rgba(150,195,235,0.48);
  margin: 0 0 16px;
}

.divider {
  width: 90px;
  height: 1px;
  margin-bottom: 16px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(100,170,255,0.5),
    rgba(200,110,255,0.6),
    rgba(255,150,60,0.45),
    transparent
  );
}

.desc {
  font-size: clamp(0.7rem, 1vw, 0.85rem);
  font-weight: 300;
  letter-spacing: 0.18em;
  color: rgba(130,170,215,0.38);
  margin: 0;
}
</style>
