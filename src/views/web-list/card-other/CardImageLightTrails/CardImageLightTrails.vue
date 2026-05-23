<template>
  <div class="card-image-light-trails" ref="parentRef">
    <!-- Canvas 粒子拖尾画布 -->
    <canvas
      class="trail-canvas"
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
import { ref, onMounted, onUnmounted, computed } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ==================== 类型 ====================
type TweenCleanup = { revert: () => void }

interface OrbConfig {
  id: number
  speed: number
  baseRadius: number
  phase: number
  hue: number
  size: number
}

interface TrailPoint {
  x: number
  y: number
}

interface OrbState {
  x: number
  y: number
  trail: TrailPoint[]
  glowRadius: number
}

interface SparkParticle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
}

// ==================== Props ====================
const props = withDefaults(defineProps<{
  imageUrl?: string
  title?: string
  subtitle?: string
}>(), {
  title: '流光拖尾轨道',
  subtitle: 'Light Trails Orbit'
})

// ==================== Refs ====================
const parentRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const dividerRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)

let cleanupFns: TweenCleanup[] = []

// ==================== 轨道球体配置 ====================
const ORB_COUNT = 5
const TRAIL_LENGTH = 50
const COLLISION_THRESHOLD = 70
const SPARK_PER_COLLISION = 18
const MAX_SPARKS = 120

const orbConfigs: OrbConfig[] = [
  { id: 0, speed: 1.0, baseRadius: 0.55, phase: 0.0,     hue: 190, size: 7  },  // 青色
  { id: 1, speed: 1.3, baseRadius: 0.42, phase: Math.PI * 0.4, hue: 330, size: 6  },  // 品红
  { id: 2, speed: 0.85,baseRadius: 0.50, phase: Math.PI * 0.7, hue: 45,  size: 8  },  // 金色
  { id: 3, speed: 1.15,baseRadius: 0.38, phase: Math.PI * 1.1, hue: 140, size: 6.5 },  // 青柠
  { id: 4, speed: 0.95,baseRadius: 0.46, phase: Math.PI * 1.5, hue: 270, size: 7  },  // 紫色
]

// ==================== 运行时状态 ====================
let orbs: OrbState[] = []
let sparks: SparkParticle[] = []
let animationId = 0
let canvasW = 0
let canvasH = 0
let centerX = 0
let centerY = 0
let dpr = 1
let globalTime = 0

// 轨道形状混合 —— ScrollTrigger 驱动
let orbitShape = 0   // 0=circle → 0.33=ellipse → 0.66=figure8 → 1=lissajous

// ==================== 轨道数学 ====================
/**
 * 根据形状混合值，计算球体在标准化坐标系 (-1~1) 上的位置
 */
function getOrbitPosition(config: OrbConfig, t: number, shape: number): { x: number; y: number } {
  const phi = config.phase
  const r = config.baseRadius
  const st = t * config.speed

  // 圆 / 椭圆 —— 通过椭圆比来混合
  const circleRatio = 1.0 - Math.min(1, shape * 3)           // 1→0 across circle phase
  const ellipseRatio = Math.min(1, Math.max(0, shape * 3))   // 0→1

  // 椭圆比：从 1.0（正圆）混合到 1.6（扁椭圆）
  const er = 1.0 + ellipseRatio * 0.6

  // ∞字形 —— 从 shape=0.33 开始介入
  const fig8Ratio = Math.min(1, Math.max(0, (shape - 0.33) * 3))       // 0.33~0.66
  // 利萨如 —— 从 shape=0.66 开始介入
  const lissajousRatio = Math.min(1, Math.max(0, (shape - 0.66) * 3)) // 0.66~1.0

  const baseX = Math.cos(st + phi)
  const baseY = Math.sin(st + phi)

  // 椭圆：x 拉伸，y 压缩
  const ellipseX = baseX * er
  const ellipseY = baseY / er

  // ∞字形：x = sin(t), y = sin(2t)
  const fig8X = Math.sin(st + phi)
  const fig8Y = Math.sin(2 * (st + phi))

  // 利萨如：x = cos(3t+φ), y = cos(2t)
  const lissajousX = Math.cos(3 * st + phi)
  const lissajousY = Math.cos(2 * st)

  // 层层混合：圆形→椭圆→∞字→利萨如
  let x: number, y: number
  if (shape <= 0.33) {
    // 圆 + 少量椭圆
    const t2 = shape / 0.33
    x = baseX * (1 - t2) + ellipseX * t2
    y = baseY * (1 - t2) + ellipseY * t2
  } else if (shape <= 0.66) {
    // 椭圆 → ∞字形
    const t3 = (shape - 0.33) / 0.33
    x = ellipseX * (1 - t3) + fig8X * t3
    y = ellipseY * (1 - t3) + fig8Y * t3
  } else {
    // ∞字形 → 利萨如
    const t4 = Math.min(1, (shape - 0.66) / 0.34)
    x = fig8X * (1 - t4) + lissajousX * t4
    y = fig8Y * (1 - t4) + lissajousY * t4
  }

  return { x: x * r, y: y * r }
}

// ==================== 碰撞检测 & 火花生成 ====================
function checkCollisions(cx: number, cy: number, scale: number) {
  for (let i = 0; i < ORB_COUNT; i++) {
    for (let j = i + 1; j < ORB_COUNT; j++) {
      const dx = (orbs[i].x - orbs[j].x) * scale
      const dy = (orbs[i].y - orbs[j].y) * scale
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < COLLISION_THRESHOLD) {
        // 碰撞中点
        const mx = (orbs[i].x + orbs[j].x) / 2 * scale + cx
        const my = (orbs[i].y + orbs[j].y) / 2 * scale + cy
        const intensity = 1 - dist / COLLISION_THRESHOLD

        // 生成火花（限制总数）
        const count = Math.floor(SPARK_PER_COLLISION * intensity)
        for (let k = 0; k < count && sparks.length < MAX_SPARKS; k++) {
          const angle = Math.random() * Math.PI * 2
          const speed = 80 + Math.random() * 250 * intensity
          sparks.push({
            x: mx + (Math.random() - 0.5) * 10,
            y: my + (Math.random() - 0.5) * 10,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 0.5 + Math.random() * 0.8 * intensity,
            maxLife: 0.5 + Math.random() * 0.8 * intensity,
            size: 1 + Math.random() * 3 * intensity,
          })
        }
      }
    }
  }
}

// ==================== Canvas 渲染 ====================
function render(timestamp: number) {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const dt = 0.016 // 约 60fps
  globalTime += dt

  const scale = Math.min(canvasW, canvasH) * 0.44  // 轨道半径基数（像素）
  const cx = centerX
  const cy = centerY

  // 更新球体位置
  for (let i = 0; i < ORB_COUNT; i++) {
    const pos = getOrbitPosition(orbConfigs[i], globalTime, orbitShape)
    const px = pos.x * scale + cx
    const py = pos.y * scale + cy

    // 记录轨迹
    const trail = orbs[i].trail
    trail.push({ x: px, y: py })
    if (trail.length > TRAIL_LENGTH) trail.shift()

    orbs[i].x = px
    orbs[i].y = py
  }

  // 碰撞检测
  checkCollisions(cx, cy, scale)

  // 清空画布
  ctx.clearRect(0, 0, canvasW, canvasH)

  // --- 绘制暗色背景放射线 ---
  ctx.save()
  ctx.globalAlpha = 0.03
  ctx.strokeStyle = '#4080c0'
  ctx.lineWidth = 0.5
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(cx + Math.cos(a) * Math.max(canvasW, canvasH), cy + Math.sin(a) * Math.max(canvasW, canvasH))
    ctx.stroke()
  }
  ctx.restore()

  // --- 绘制拖尾 ---
  for (let i = 0; i < ORB_COUNT; i++) {
    const cfg = orbConfigs[i]
    const trail = orbs[i].trail
    if (trail.length < 2) continue

    const hue = cfg.hue

    // 拖尾光带（宽渐变线条）
    ctx.save()
    ctx.globalAlpha = 0.18
    ctx.strokeStyle = `hsl(${hue}, 100%, 65%)`
    ctx.lineWidth = 5
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.shadowColor = `hsl(${hue}, 100%, 60%)`
    ctx.shadowBlur = 12
    ctx.beginPath()
    ctx.moveTo(trail[0].x, trail[0].y)
    for (let j = 1; j < trail.length; j++) {
      ctx.lineTo(trail[j].x, trail[j].y)
    }
    ctx.stroke()
    ctx.restore()

    // 拖尾点阵（逐个点，近处亮远处暗）
    for (let j = 0; j < trail.length; j++) {
      const alpha = 0.05 + (j / trail.length) * 0.55
      const dotSize = 1.5 + (j / trail.length) * 3

      ctx.save()
      ctx.globalAlpha = alpha
      ctx.fillStyle = `hsl(${hue}, 90%, 70%)`
      ctx.shadowColor = `hsl(${hue}, 100%, 60%)`
      ctx.shadowBlur = dotSize * 3 + (j / trail.length) * 6
      ctx.beginPath()
      ctx.arc(trail[j].x, trail[j].y, dotSize, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }
  }

  // --- 绘制球体（多层光晕） ---
  for (let i = 0; i < ORB_COUNT; i++) {
    const cfg = orbConfigs[i]
    const orb = orbs[i]
    const hue = cfg.hue

    // 外层大光晕
    ctx.save()
    const g1 = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, cfg.size * 4)
    g1.addColorStop(0, `hsla(${hue}, 100%, 75%, 0.5)`)
    g1.addColorStop(0.35, `hsla(${hue}, 90%, 60%, 0.2)`)
    g1.addColorStop(0.7, `hsla(${hue}, 80%, 50%, 0.05)`)
    g1.addColorStop(1, 'transparent')
    ctx.fillStyle = g1
    ctx.beginPath()
    ctx.arc(orb.x, orb.y, cfg.size * 4, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()

    // 中间发光层
    ctx.save()
    const g2 = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, cfg.size * 1.8)
    g2.addColorStop(0, `hsla(${hue}, 100%, 90%, 0.9)`)
    g2.addColorStop(0.4, `hsla(${hue}, 100%, 70%, 0.55)`)
    g2.addColorStop(0.75, `hsla(${hue}, 90%, 55%, 0.15)`)
    g2.addColorStop(1, 'transparent')
    ctx.fillStyle = g2
    ctx.shadowColor = `hsl(${hue}, 100%, 65%)`
    ctx.shadowBlur = 20
    ctx.beginPath()
    ctx.arc(orb.x, orb.y, cfg.size * 1.8, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()

    // 核心白亮
    ctx.save()
    const g3 = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, cfg.size)
    g3.addColorStop(0, 'rgba(255,255,255,0.95)')
    g3.addColorStop(0.5, `hsla(${hue}, 100%, 80%, 0.6)`)
    g3.addColorStop(1, 'transparent')
    ctx.fillStyle = g3
    ctx.beginPath()
    ctx.arc(orb.x, orb.y, cfg.size, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  // --- 绘制火花粒子 ---
  for (let i = sparks.length - 1; i >= 0; i--) {
    const sp = sparks[i]
    sp.life -= dt
    if (sp.life <= 0) {
      sparks.splice(i, 1)
      continue
    }

    sp.x += sp.vx * dt
    sp.y += sp.vy * dt
    sp.vx *= 0.96   // 阻尼
    sp.vy *= 0.96

    const progress = sp.life / sp.maxLife
    // 金色 → 橙红 → 消失
    const hue = 40 - progress * 25
    const alpha = progress * 0.85
    const sz = sp.size * progress

    ctx.save()
    ctx.globalAlpha = alpha
    ctx.fillStyle = `hsl(${hue}, 100%, ${55 + progress * 30}%)`
    ctx.shadowColor = `hsl(${hue}, 100%, 55%)`
    ctx.shadowBlur = sz * 5 + 2
    ctx.beginPath()
    ctx.arc(sp.x, sp.y, sz, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  animationId = requestAnimationFrame(render)
}

// ==================== 画布尺寸适配 ====================
function updateCanvasSize() {
  const canvas = canvasRef.value
  const container = parentRef.value
  if (!canvas || !container) return

  dpr = Math.min(window.devicePixelRatio || 1, 2) // 限制最大 2x
  const rect = container.getBoundingClientRect()
  canvasW = rect.width
  canvasH = rect.height
  canvas.width = canvasW * dpr
  canvas.height = canvasH * dpr
  canvas.style.width = canvasW + 'px'
  canvas.style.height = canvasH + 'px'

  centerX = canvasW / 2
  centerY = canvasH / 2
}

let resizeObserver: ResizeObserver | null = null

// ==================== 生命周期 ====================
onMounted(() => {
  if (!parentRef.value || !canvasRef.value) return

  // 初始化球体状态
  orbs = orbConfigs.map(() => ({
    x: centerX,
    y: centerY,
    trail: [] as TrailPoint[],
    glowRadius: 0,
  }))

  // 画布尺寸初始化
  updateCanvasSize()

  // Resize 监听
  if (parentRef.value) {
    resizeObserver = new ResizeObserver(() => {
      updateCanvasSize()
    })
    resizeObserver.observe(parentRef.value)
  }

  // 启动渲染循环
  animationId = requestAnimationFrame(render)

  // ===== ScrollTrigger 驱动轨道变形 =====
  const ctx = gsap.context(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: parentRef.value,
        start: 'top 85%',
        end: 'bottom 30%',
        scrub: 1.5,
      },
    })
    cleanupFns.push({ revert: () => tl.kill() })

    // 轨道形状 0→1（圆形→椭圆→∞字→利萨如）
    tl.fromTo({ shape: 0 }, { shape: 1 }, {
      duration: 1,
      ease: 'none',
      onUpdate: function () {
        orbitShape = (this.targets() as any)[0].shape
      },
      onUpdateParams: ['{self}'],
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
          { opacity: 0, y: 35, filter: 'blur(12px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', ease: 'expo.out', duration: 0.8 },
          0.2
        )
      }
      if (dividerRef.value) {
        ct.fromTo(dividerRef.value,
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, ease: 'power3.out', duration: 0.6 },
          0.28
        )
      }
      if (subtitleRef.value) {
        ct.fromTo(subtitleRef.value,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, ease: 'power3.out', duration: 0.7 },
          0.35
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
.card-image-light-trails {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: radial-gradient(ellipse at 50% 50%, #070c1a 0%, #040810 40%, #020510 80%, #000208 100%);
}

// ==================== Canvas ====================
.trail-canvas {
  position: absolute;
  inset: 0;
  display: block;
  z-index: 1;
}

// ==================== 内容覆盖层 ====================
.content-layer {
  position: absolute;
  bottom: 12%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  text-align: center;
  pointer-events: none;

  .title {
    font-size: clamp(2rem, 5vw, 4rem);
    font-weight: 800;
    letter-spacing: .05em;
    color: #fff;
    margin: 0 0 16px;
    line-height: 1.2;
    // 七彩霓虹文字阴影（对应五个球体颜色）
    text-shadow:
      0 0 10px rgba(0, 229, 255, .5),
      0 0 25px rgba(255, 0, 128, .4),
      0 0 40px rgba(255, 170, 0, .35),
      0 0 55px rgba(0, 255, 136, .3),
      0 0 70px rgba(168, 85, 247, .3);
  }

  .divider {
    width: 100px;
    height: 3px;
    margin: 0 auto 16px;
    background: linear-gradient(90deg,
      rgba(0, 229, 255, .4),
      rgba(255, 0, 128, .6),
      rgba(255, 170, 0, .8),
      rgba(0, 255, 136, .6),
      rgba(168, 85, 247, .4)
    );
    border-radius: 2px;
    transform-origin: center;
  }

  .subtitle {
    font-size: clamp(.85rem, 1.5vw, 1.2rem);
    font-weight: 400;
    letter-spacing: .1em;
    text-transform: uppercase;
    color: rgba(180, 220, 255, .8);
    text-shadow: 0 0 16px rgba(0, 200, 255, .45);
    margin: 0;
  }
}
</style>
