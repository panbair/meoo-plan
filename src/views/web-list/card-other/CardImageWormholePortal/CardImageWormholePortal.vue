<template>
  <div class="card-image-wormhole-portal" ref="parentRef">
    <!-- Canvas 渲染层 -->
    <canvas class="wormhole-canvas" ref="canvasRef"></canvas>

    <!-- CSS 光溢出层 -->
    <div class="bloom-overlay" ref="bloomRef"></div>

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

interface DiskParticle {
  r: number          // 当前轨道半径
  angle: number      // 当前角度
  baseR: number      // 平衡轨道半径
  speed: number      // 基础角速度
  height: number     // 垂直偏移（3D 盘厚度）
  size: number       // 粒子大小
  opacity: number    // 基础透明度
  phase: number      // 轨道椭圆相位
  eccentricity: number // 轨道椭圆率
}

interface LensingArc {
  startAngle: number // 弧起始角
  endAngle: number   // 弧结束角
  radius: number     // 弧半径
  thickness: number  // 弧厚度
  opacity: number    // 透明度
  blur: number       // 模糊
}

// ==================== Props ====================
const props = withDefaults(defineProps<{
  imageUrl?: string
  title?: string
  subtitle?: string
}>(), {
  title: '虫洞传送门',
  subtitle: 'Wormhole Portal'
})

// ==================== Refs ====================
const parentRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const bloomRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const dividerRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)

let cleanupFns: TweenCleanup[] = []

// ==================== 常量 ====================
const EVENT_HORIZON_R = 50       // 事件视界半径（视觉）
const PHOTON_SPHERE_R = 78       // 光子球半径（爱因斯坦环）
const INNER_DISK_R = 66          // 吸积盘内缘
const OUTER_DISK_R = 360         // 吸积盘外缘
const DISK_PARTICLE_COUNT = 1200
const BACKGROUND_STAR_COUNT = 180

// ==================== 运行时状态 ====================
let animationId = 0
let canvasW = 0
let canvasH = 0
let centerX = 0
let centerY = 0
let dpr = 1
let globalTime = 0

// 粒子池
let diskParticles: DiskParticle[] = []
// 背景星
let bgStars: { x: number; y: number; size: number; opacity: number; twinklePhase: number }[] = []

// 透镜弧
let lensingArcs: LensingArc[] = []

// ==================== Scroll 驱动变量 ====================
const scrollState = { progress: 0 }

// ==================== 初始化 ====================
function initDiskParticles() {
  diskParticles = []
  for (let i = 0; i < DISK_PARTICLE_COUNT; i++) {
    const t = Math.pow(Math.random(), 0.6) // 内密外疏
    const baseR = INNER_DISK_R + t * (OUTER_DISK_R - INNER_DISK_R)
    const r = baseR + (Math.random() - 0.5) * 30
    diskParticles.push({
      r,
      angle: Math.random() * Math.PI * 2,
      baseR,
      speed: 0.8 + (1 - t) * 4.5,          // 内圈快
      height: (Math.random() - 0.5) * 28,   // 盘厚度
      size: 0.6 + (1 - t) * 2.4,            // 内圈粒子大
      opacity: 0.18 + (1 - t) * 0.72,        // 内圈更亮
      phase: Math.random() * Math.PI * 2,
      eccentricity: 0.02 + Math.random() * 0.14,
    })
  }
}

function initBgStars() {
  bgStars = []
  for (let i = 0; i < BACKGROUND_STAR_COUNT; i++) {
    const angle = Math.random() * Math.PI * 2
    const dist = 0.15 + Math.random() * 0.85
    const maxR = Math.max(canvasW, canvasH) * 0.7
    const r = dist * maxR
    bgStars.push({
      x: centerX + Math.cos(angle) * r,
      y: centerY + Math.sin(angle) * r * (canvasH / canvasW),
      size: 0.4 + Math.random() * 1.3,
      opacity: 0.15 + Math.random() * 0.45,
      twinklePhase: Math.random() * Math.PI * 2,
    })
  }
}

function initLensingArcs() {
  lensingArcs = []
  // 顶部主弧
  for (let i = 0; i < 7; i++) {
    const r = PHOTON_SPHERE_R + 3 + i * 8
    const span = Math.PI * (0.45 + i * 0.04)
    const center = -Math.PI / 2 + (i - 3) * 0.06
    lensingArcs.push({
      startAngle: center - span / 2,
      endAngle: center + span / 2,
      radius: r,
      thickness: 2.5 - i * 0.2,
      opacity: 0.45 - i * 0.05,
      blur: 2 + i * 1.5,
    })
    lensingArcs.push({
      startAngle: center - span / 2,
      endAngle: center + span / 2,
      radius: -r,
      thickness: 2.5 - i * 0.2,
      opacity: 0.45 - i * 0.05,
      blur: 2 + i * 1.5,
    })
  }
}

// ==================== 颜色计算 ====================
function getAccretionColor(normR: number): { fill: string; shadow: string } {
  // normR: 0=内圈热, 1=外圈冷
  if (normR < 0.1)  return { fill: 'rgba(255,252,245,0.92)', shadow: 'rgba(255,245,200,0.8)' }
  if (normR < 0.2)  return { fill: 'rgba(255,245,210,0.85)', shadow: 'rgba(255,220,120,0.7)' }
  if (normR < 0.35) return { fill: 'rgba(255,225,140,0.75)', shadow: 'rgba(255,185,60,0.55)' }
  if (normR < 0.55) return { fill: 'rgba(255,190,70,0.58)',  shadow: 'rgba(255,140,25,0.4)' }
  if (normR < 0.75) return { fill: 'rgba(255,145,30,0.38)',  shadow: 'rgba(240,100,15,0.22)' }
  return { fill: 'rgba(240,95,15,0.18)', shadow: 'rgba(220,70,10,0.08)' }
}

// ==================== Canvas 渲染 ====================
function render() {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const dt = 0.016
  globalTime += dt

  const progress = scrollState.progress
  const rotationMult = 0.25 + progress * 2.5
  const gravityPull = 0.05 + progress * 0.35
  const cx = centerX
  const cy = centerY

  ctx.clearRect(0, 0, canvasW, canvasH)

  // ---- 1. 背景星场 ----
  for (const star of bgStars) {
    const twinkle = 0.6 + 0.4 * Math.sin(globalTime * 2 + star.twinklePhase)
    const alpha = star.opacity * twinkle

    ctx.save()
    ctx.globalAlpha = alpha
    ctx.fillStyle = '#dde4ff'
    ctx.shadowColor = 'rgba(180,200,255,0.5)'
    ctx.shadowBlur = star.size * 2
    ctx.beginPath()
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  // ---- 2. 更新 & 绘制吸积盘粒子 ----
  // 按半径排序（外圈先画，内圈后画覆盖）
  const sortedParticles = [...diskParticles].sort((a, b) => b.r - a.r)

  for (const p of sortedParticles) {
    // 轨道运动
    const keplerSpeed = p.speed / Math.sqrt(Math.max(0.3, (p.r - INNER_DISK_R) / (OUTER_DISK_R - INNER_DISK_R) + 0.15))
    p.angle += keplerSpeed * rotationMult * dt

    // 引力吸入
    const drift = gravityPull * (1 / Math.max(0.2, (p.r - INNER_DISK_R + 10) / OUTER_DISK_R)) * 35 * dt
    p.r -= drift

    // 重生
    if (p.r < INNER_DISK_R - 8) {
      p.r = OUTER_DISK_R - Math.random() * 60
      p.angle = Math.random() * Math.PI * 2
      p.baseR = p.r
      const nt = (p.r - INNER_DISK_R) / (OUTER_DISK_R - INNER_DISK_R)
      p.size = 0.6 + (1 - nt) * 2.4
      p.opacity = 0.18 + (1 - nt) * 0.72
      p.speed = 0.8 + (1 - nt) * 4.5
    }

    const normR = (p.r - INNER_DISK_R) / (OUTER_DISK_R - INNER_DISK_R)
    const clampedNorm = Math.max(0, Math.min(1, normR))
    const { fill, shadow } = getAccretionColor(clampedNorm)

    // 椭圆轨道偏移（模拟 3D 盘面透视）
    const effectiveX = cx + Math.cos(p.angle + p.phase) * p.r * (1 + p.eccentricity * 0.5)
    const effectiveY = cy + Math.sin(p.angle + p.phase) * p.r * (1 - p.eccentricity * 0.5) * 0.6 + p.height

    ctx.save()
    ctx.globalAlpha = p.opacity
    ctx.fillStyle = fill
    ctx.shadowColor = shadow
    ctx.shadowBlur = p.size * 6 + (1 - clampedNorm) * 8
    ctx.beginPath()
    ctx.arc(effectiveX, effectiveY, p.size, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  // ---- 3. 引力透镜弧 ----
  for (const arc of lensingArcs) {
    const isBottom = arc.radius < 0
    const absR = Math.abs(arc.radius)

    // 弧随进度微调
    const sweepDrift = Math.sin(globalTime * 0.7 + (isBottom ? 0 : Math.PI)) * 0.06 * progress
    const sA = arc.startAngle + sweepDrift
    const eA = arc.endAngle + sweepDrift

    ctx.save()
    ctx.globalAlpha = arc.opacity * (0.6 + progress * 0.4)
    ctx.strokeStyle = '#fff8e0'
    ctx.lineWidth = arc.thickness
    ctx.shadowColor = 'rgba(255,220,100,0.8)'
    ctx.shadowBlur = arc.blur + progress * 8
    ctx.beginPath()
    ctx.arc(cx, cy, absR, sA, eA)
    ctx.stroke()

    // 第二层弱光
    ctx.globalAlpha = arc.opacity * 0.4 * (0.5 + progress * 0.5)
    ctx.lineWidth = arc.thickness * 2.8
    ctx.shadowBlur = arc.blur * 2 + progress * 12
    ctx.shadowColor = 'rgba(255,180,40,0.5)'
    ctx.stroke()
    ctx.restore()
  }

  // ---- 4. 爱因斯坦环（光子球） ----
  const ringRotation = globalTime * rotationMult * 2.5
  const ringGlow = 0.55 + progress * 0.45

  // 外环
  ctx.save()
  ctx.globalAlpha = ringGlow * 0.55
  ctx.strokeStyle = '#fffbe6'
  ctx.lineWidth = 3
  ctx.shadowColor = 'rgba(255,240,150,0.9)'
  ctx.shadowBlur = 22 + progress * 14
  ctx.beginPath()
  ctx.arc(cx, cy, PHOTON_SPHERE_R, 0, Math.PI * 2)
  ctx.stroke()
  ctx.restore()

  // 内环（更亮）
  ctx.save()
  ctx.globalAlpha = ringGlow * 0.75
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 1.8
  ctx.shadowColor = 'rgba(255,255,220,0.95)'
  ctx.shadowBlur = 16 + progress * 10
  ctx.beginPath()
  ctx.arc(cx, cy, PHOTON_SPHERE_R - 3, 0, Math.PI * 2)
  ctx.stroke()
  ctx.restore()

  // 环上亮点（光子聚集点）
  const hotspotCount = 5
  for (let i = 0; i < hotspotCount; i++) {
    const ha = ringRotation + (i / hotspotCount) * Math.PI * 2 + Math.sin(globalTime * 1.3 + i) * 0.3
    const hx = cx + Math.cos(ha) * PHOTON_SPHERE_R
    const hy = cy + Math.sin(ha) * PHOTON_SPHERE_R

    ctx.save()
    ctx.globalAlpha = 0.7 + progress * 0.3
    const hg = ctx.createRadialGradient(hx, hy, 0, hx, hy, 16)
    hg.addColorStop(0, 'rgba(255,255,255,0.85)')
    hg.addColorStop(0.4, 'rgba(255,240,180,0.4)')
    hg.addColorStop(1, 'transparent')
    ctx.fillStyle = hg
    ctx.beginPath()
    ctx.arc(hx, hy, 16, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  // ---- 5. 事件视界（纯黑） ----
  ctx.save()
  ctx.fillStyle = '#000000'
  ctx.shadowColor = 'rgba(0,0,0,0.9)'
  ctx.shadowBlur = 30
  ctx.beginPath()
  ctx.arc(cx, cy, EVENT_HORIZON_R, 0, Math.PI * 2)
  ctx.fill()

  // 事件视界边缘微光（引力红移的最后一缕光）
  ctx.strokeStyle = 'rgba(255,180,60,0.35)'
  ctx.lineWidth = 1.2
  ctx.shadowColor = 'rgba(255,150,30,0.45)'
  ctx.shadowBlur = 10
  ctx.stroke()
  ctx.restore()

  // ---- 6. 中心极致光辉 ----
  const innerGlow = 0.15 + progress * 0.35
  ctx.save()
  ctx.globalAlpha = innerGlow
  const ig = ctx.createRadialGradient(cx, cy, EVENT_HORIZON_R * 0.4, cx, cy, PHOTON_SPHERE_R * 0.9)
  ig.addColorStop(0, 'rgba(255,255,240,0.6)')
  ig.addColorStop(0.3, 'rgba(255,220,100,0.2)')
  ig.addColorStop(0.7, 'rgba(255,150,30,0.05)')
  ig.addColorStop(1, 'transparent')
  ctx.fillStyle = ig
  ctx.beginPath()
  ctx.arc(cx, cy, PHOTON_SPHERE_R * 0.9, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  // ---- 7. 相对论喷流（极轴方向） ----
  const jetIntensity = 0.1 + progress * 0.35
  for (const dir of [-1, 1]) {
    ctx.save()
    ctx.globalAlpha = jetIntensity * 0.55
    const jg = ctx.createLinearGradient(cx, cy, cx, cy + dir * 320)
    jg.addColorStop(0, 'rgba(255,255,240,0.6)')
    jg.addColorStop(0.15, 'rgba(255,200,100,0.3)')
    jg.addColorStop(0.4, 'rgba(200,150,200,0.1)')
    jg.addColorStop(0.7, 'rgba(100,80,180,0.04)')
    jg.addColorStop(1, 'transparent')

    ctx.fillStyle = jg
    ctx.beginPath()
    ctx.moveTo(cx - 14, cy)
    ctx.lineTo(cx + 14, cy)
    ctx.lineTo(cx + 3, cy + dir * 320)
    ctx.lineTo(cx - 3, cy + dir * 320)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }

  animationId = requestAnimationFrame(render)
}

// ==================== 画布尺寸 ====================
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
  initDiskParticles()
  initBgStars()
  initLensingArcs()

  if (parentRef.value) {
    resizeObserver = new ResizeObserver(() => {
      updateCanvasSize()
      initBgStars()
      initLensingArcs()
    })
    resizeObserver.observe(parentRef.value)
  }

  animationId = requestAnimationFrame(render)

  // ===== ScrollTrigger =====
  const ctx = gsap.context(() => {
    // 主控：旋转速度 & 引力强度
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: parentRef.value,
        start: 'top 85%',
        end: 'bottom 30%',
        scrub: 1.5,
      },
    })
    cleanupFns.push({ revert: () => tl.kill() })

    tl.fromTo(scrollState, { progress: 0 }, {
      progress: 1,
      duration: 1,
      ease: 'power2.inOut',
    })

    // CSS 光溢出
    if (bloomRef.value) {
      const bt = gsap.timeline({
        scrollTrigger: {
          trigger: parentRef.value,
          start: 'top 85%',
          end: 'top 40%',
          scrub: 1.2,
        },
      })
      cleanupFns.push({ revert: () => bt.kill() })
      bt.fromTo(bloomRef.value, { opacity: 0 }, { opacity: 1, ease: 'power3.out' })
    }

    // 文字入场
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
          { opacity: 0, y: 25, filter: 'blur(8px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', ease: 'expo.out', duration: 0.8 },
          0.18
        )
      }
      if (dividerRef.value) {
        ct.fromTo(dividerRef.value,
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, ease: 'power3.out', duration: 0.55 },
          0.26
        )
      }
      if (subtitleRef.value) {
        ct.fromTo(subtitleRef.value,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, ease: 'power3.out', duration: 0.65 },
          0.32
        )
      }
    }
  }, parentRef.value)
})

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
.card-image-wormhole-portal {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #000103;
}

// ==================== Canvas ====================
.wormhole-canvas {
  position: absolute;
  inset: 0;
  display: block;
  z-index: 2;
}

// ==================== CSS 光溢出层 ====================
.bloom-overlay {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 260px;
  height: 260px;
  border-radius: 50%;
  background: radial-gradient(circle,
    rgba(255,240,200,0.25) 0%,
    rgba(255,200,80,0.12) 20%,
    rgba(255,140,30,0.04) 45%,
    transparent 65%
  );
  filter: blur(35px);
  z-index: 3;
  pointer-events: none;
  opacity: 0;
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
    letter-spacing: .08em;
    color: #fff;
    margin: 0 0 16px;
    line-height: 1.2;
    text-shadow:
      0 0 10px rgba(255,230,150,.55),
      0 0 30px rgba(255,180,60,.35),
      0 0 60px rgba(255,120,20,.2),
      0 0 90px rgba(255,80,10,.12);
  }

  .divider {
    width: 100px;
    height: 3px;
    margin: 0 auto 16px;
    background: linear-gradient(90deg,
      rgba(255,200,100,.15),
      rgba(255,180,60,.7),
      rgba(255,240,180,.85),
      rgba(255,180,60,.7),
      rgba(255,200,100,.15)
    );
    border-radius: 2px;
    transform-origin: center;
    box-shadow: 0 0 8px rgba(255,180,60,.35);
  }

  .subtitle {
    font-size: clamp(.85rem, 1.5vw, 1.2rem);
    font-weight: 400;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: rgba(255,220,160,.78);
    text-shadow: 0 0 14px rgba(255,180,60,.4);
    margin: 0;
  }
}
</style>
