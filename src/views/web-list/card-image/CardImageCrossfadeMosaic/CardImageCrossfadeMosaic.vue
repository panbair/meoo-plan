<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type CleanupFn = () => void

// ═══════════════════════════════════════════
//  Fractal Recursive Mosaic — 分形递归马赛克
//
//  核心概念:
//  1. 谢尔宾斯基三角形分形结构 (3层深度 = 40个三角形)
//  2. 递归层级展开动画，从中心向外爆发
//  3. 螺旋旋转 + 缩放组合动画
//  4. 全屏图片拼接显示 (cover + center)
//  5. Canvas 粒子系统增强视觉效果
//  6. 渐变紫蓝配色，科技感十足
// ═══════════════════════════════════════════

const imageA = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80' // 山景
const imageB = 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&q=80' // 谷景

// ==== 分形配置 ====
const FRACTAL_DEPTH = 3 // 递归深度层级
const BASE_SIZE = 1 // 基础尺寸单位

// 生成分形三角形数据
interface FractalTriangle {
  id: string
  level: number // 递归层级 0, 1, 2, 3
  x: number // 相对位置 0-1
  y: number // 相对位置 0-1
  size: number // 相对大小
  delay: number // 动画延迟
}

function generateFractalTriangles(depth: number): FractalTriangle[] {
  const triangles: FractalTriangle[] = []

  function subdivide(x: number, y: number, size: number, level: number, parentId: string = '') {
    if (level > depth) {
      return
    }

    const id = parentId ? `${parentId}-${level}` : `${level}`
    const halfSize = size / 2
    const quarterSize = size / 4

    // 当前三角形
    triangles.push({
      id: `${id}-center`,
      level,
      x,
      y,
      size,
      delay: level * 0.15
    })

    if (level < depth) {
      // 三个子三角形 (谢尔宾斯基模式)
      subdivide(x - quarterSize, y + quarterSize, halfSize, level + 1, id)
      subdivide(x + quarterSize, y + quarterSize, halfSize, level + 1, id)
      subdivide(x, y - quarterSize, halfSize, level + 1, id)
    }
  }

  // 从中心开始生成
  subdivide(0.5, 0.5, BASE_SIZE, 0)

  return triangles
}

const fractalTriangles = generateFractalTriangles(FRACTAL_DEPTH)
const TOTAL_TRIANGLES = fractalTriangles.length

// ==== Refs ====
const sectionRef = ref<HTMLElement | null>(null)
const stageRef = ref<HTMLElement | null>(null)
const triangleRefs = ref<HTMLElement[]>([])
const canvasRef = ref<HTMLCanvasElement | null>(null)
const statusRef = ref<HTMLElement | null>(null)
const statusFillRef = ref<HTMLElement | null>(null)
const statusCountRef = ref<HTMLElement | null>(null)
const heroRef = ref<HTMLElement | null>(null)
const heroTagRef = ref<HTMLElement | null>(null)
const heroTitleRef = ref<HTMLElement | null>(null)
const heroLineRef = ref<HTMLElement | null>(null)
const heroSubRef = ref<HTMLElement | null>(null)
const depthIndicatorRef = ref<HTMLElement | null>(null)

// DOM 缓存
let lastScales: number[] = []
let lastRotations: number[] = []
let lastOpacities: number[] = []

// Canvas 分形粒子
interface FractalParticle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  life: number
  maxLife: number
  level: number
  color: string
}
let particles: FractalParticle[] = []
let animId = 0

// 清理列表
const cleanupFns: CleanupFn[] = []

// ==== 工具函数 ====
function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v))
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function fractalScaleEase(t: number, level: number): number {
  // 分形层级越高，缩放越明显
  const baseScale = 0.01
  const maxScale = 1 + level * 0.15
  const eased = easeInOutCubic(t)
  return baseScale + eased * (maxScale - baseScale)
}

function fractalRotateEase(t: number, level: number): number {
  // 每层不同的旋转角度，创造螺旋效果
  const baseRotation = level * 120
  const rotationRange = 360
  return baseRotation + t * rotationRange
}

function spawnFractalParticles(x: number, y: number, level: number, count: number) {
  const colors = [
    'rgba(100, 200, 255, ', // 蓝色
    'rgba(150, 100, 255, ', // 紫色
    'rgba(255, 100, 200, ', // 粉色
    'rgba(100, 255, 200, ' // 青色
  ]

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5
    const speed = 0.5 + Math.random() * 1.5
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: (3 - level) * 1.5 + Math.random() * 2,
      alpha: 0.8 + Math.random() * 0.2,
      life: 0,
      maxLife: 60 + Math.random() * 40,
      level,
      color: colors[level % colors.length]
    })
  }
}

// ==== 生命周期 ====
onMounted(async () => {
  if (!sectionRef.value || !stageRef.value) {
    return
  }
  await nextTick()
  await nextTick()

  // 缓存分形三角形 DOM
  triangleRefs.value = Array.from(stageRef.value.querySelectorAll('.fractal-triangle'))
  lastScales = new Array(TOTAL_TRIANGLES).fill(0)
  lastRotations = new Array(TOTAL_TRIANGLES).fill(0)
  lastOpacities = new Array(TOTAL_TRIANGLES).fill(0)

  // ==== Canvas 粒子系统 ====
  const canvas = canvasRef.value
  let cw = 0,
    ch = 0
  if (canvas) {
    const rect = canvas.parentElement!.getBoundingClientRect()
    cw = canvas.width = rect.width
    ch = canvas.height = rect.height
    Object.assign(canvas.style, {
      position: 'absolute',
      inset: '0',
      zIndex: '3',
      pointerEvents: 'none'
    })
  }

  // Canvas 粒子绘制函数
  const drawParticles = () => {
    const canvas = canvasRef.value
    if (!canvas) {
      return
    }
    const ctx = canvas.getContext('2d')!
    const cw = canvas.width
    const ch = canvas.height
    ctx.clearRect(0, 0, cw, ch)

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]
      p.life++
      if (p.life > p.maxLife) {
        particles.splice(i, 1)
        continue
      }

      const t = p.life / p.maxLife
      const alpha = p.alpha * (1 - t) * (1 - t)

      p.x += p.vx
      p.y += p.vy
      p.vx *= 0.98 // 摩擦力
      p.vy *= 0.98

      ctx.save()
      ctx.globalAlpha = alpha

      // 绘制分形粒子 (小三角形)
      const size = p.size * (1 - t * 0.5)
      ctx.beginPath()
      ctx.moveTo(p.x, p.y - size)
      ctx.lineTo(p.x - size * 0.866, p.y + size * 0.5)
      ctx.lineTo(p.x + size * 0.866, p.y + size * 0.5)
      ctx.closePath()
      ctx.fillStyle = p.color + alpha + ')'
      ctx.fill()

      // 辉光效果
      ctx.shadowBlur = 10
      ctx.shadowColor = p.color + '0.5)'
      ctx.stroke()

      ctx.restore()
    }
  }

  ;(globalThis as any).__fractalDrawParticles = drawParticles

  const loop = () => {
    drawParticles()
    animId = requestAnimationFrame(loop)
  }
  if (canvasRef.value) {
    animId = requestAnimationFrame(loop)
  }

  // ==== GSAP Context ====
  const ctx = gsap.context(() => {
    // 入场动画
    if (heroRef.value) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.value!,
          start: 'top 70%',
          end: 'top 25%',
          scrub: 0.8
        }
      })
      tl.fromTo(heroRef.value, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1 }, 0)
      tl.fromTo(heroTagRef.value, { opacity: 0, x: -15 }, { opacity: 1, x: 0, duration: 0.5 }, 0.05)
      tl.fromTo(
        heroTitleRef.value,
        { opacity: 0, y: 20, filter: 'blur(4px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8 },
        0.08
      )
      tl.fromTo(
        heroLineRef.value,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.6 },
        0.12
      )
      tl.fromTo(heroSubRef.value, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5 }, 0.15)
      cleanupFns.push(() => tl.kill())
    }

    // 分形三角形动画
    const mainSt = ScrollTrigger.create({
      trigger: sectionRef.value!,
      start: 'top 75%', // 重要内容提前展示
      end: 'bottom 15%',
      scrub: 1.8,
      onUpdate(self) {
        const p = self.progress

        // 计算并更新三角形状态
        let activatedCount = 0
        fractalTriangles.forEach((tri, idx) => {
          const el = triangleRefs.value[idx]
          if (!el) {
            return
          }

          // 根据层级和进度计算激活状态
          const levelDelay = tri.delay
          const levelWindow = 0.25
          const t = clamp((p - levelDelay) / levelWindow, 0, 1)

          const scale = fractalScaleEase(t, tri.level)
          const rotation = fractalRotateEase(t, tri.level)
          const opacity = t > 0.1 ? clamp((t - 0.1) / 0.2, 0, 1) : 0

          // 检查是否需要更新
          if (
            Math.abs(scale - lastScales[idx]) > 0.01 ||
            Math.abs(rotation - lastRotations[idx]) > 0.5 ||
            Math.abs(opacity - lastOpacities[idx]) > 0.01
          ) {
            el.style.transform = `scale(${scale.toFixed(3)}) rotate(${rotation.toFixed(1)}deg)`
            el.style.opacity = opacity.toFixed(2)

            lastScales[idx] = scale
            lastRotations[idx] = rotation
            lastOpacities[idx] = opacity

            // 在激活时生成粒子
            if (opacity > 0.5 && lastOpacities[idx] <= 0.5) {
              const rect = el.getBoundingClientRect()
              const stageRect = stageRef.value!.getBoundingClientRect()
              spawnFractalParticles(
                rect.left - stageRect.left + rect.width / 2,
                rect.top - stageRect.top + rect.height / 2,
                tri.level,
                8 - tri.level * 2
              )
            }
          }

          if (opacity > 0.5) {
            activatedCount++
          }
        })

        // 更新状态栏
        if (statusFillRef.value) {
          statusFillRef.value.style.width = `${(activatedCount / TOTAL_TRIANGLES) * 100}%`
        }
        if (statusCountRef.value) {
          statusCountRef.value.textContent = String(activatedCount)
        }
        if (statusRef.value) {
          statusRef.value.style.opacity = p > 0.05 ? '1' : '0'
        }

        // 更新深度指示器
        if (depthIndicatorRef.value) {
          const currentDepth = Math.floor(p * FRACTAL_DEPTH)
          depthIndicatorRef.value.textContent = `DEPTH: ${currentDepth}/${FRACTAL_DEPTH}`
        }
      },
      onLeaveBack() {
        // 重置所有三角形
        triangleRefs.value.forEach((el, idx) => {
          el.style.transform = 'scale(0) rotate(0deg)'
          el.style.opacity = '0'
          lastScales[idx] = 0
          lastRotations[idx] = 0
          lastOpacities[idx] = 0
        })
        if (statusRef.value) {
          statusRef.value.style.opacity = '0'
        }
        particles = []
      }
    })

    cleanupFns.push(() => mainSt.kill())
  }, sectionRef.value)
})

onUnmounted(() => {
  cleanupFns.forEach((fn) => fn())
  if (sectionRef.value) {
    ScrollTrigger.getAll().forEach((st) => {
      if (st.vars.trigger === sectionRef.value) {
        st.kill()
      }
    })
  }
  cancelAnimationFrame(animId)
  delete (globalThis as any).__fractalDrawParticles
})
</script>

<template>
  <div ref="sectionRef" class="fractal-section">
    <div class="fractal-bg"></div>

    <div ref="stageRef" class="fractal-stage">
      <!-- 分形三角形 -->
      <div
        v-for="tri in fractalTriangles"
        :key="tri.id"
        ref="triangleRefs"
        class="fractal-triangle"
        :data-level="tri.level"
        :style="{
          left: `${tri.x * 100}%`,
          top: `${tri.y * 100}%`,
          width: `${tri.size * 100}%`,
          height: `${tri.size * 100}%`,
          transform: 'scale(0) rotate(0deg)',
          opacity: 0
        }"
      >
        <div class="fractal-triangle-inner">
          <div
            class="fractal-face fractal-front"
            :style="{
              backgroundImage: `url(${imageA})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }"
          ></div>
          <div
            class="fractal-face fractal-back"
            :style="{
              backgroundImage: `url(${imageB})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }"
          ></div>
        </div>
      </div>

      <!-- Canvas 粒子层 -->
      <canvas ref="canvasRef" class="fractal-canvas"></canvas>
    </div>

    <!-- 底部状态栏 -->
    <div ref="statusRef" class="fractal-status">
      <div class="fractal-status-track">
        <div ref="statusFillRef" class="fractal-status-fill"></div>
      </div>
      <div class="fractal-status-info">
        <span ref="statusCountRef" class="fractal-status-count">0</span>
        <span class="fractal-status-label">/ {{ TOTAL_TRIANGLES }} FRACTALS</span>
      </div>
      <div ref="depthIndicatorRef" class="fractal-depth-indicator">
        DEPTH: 0/{{ FRACTAL_DEPTH }}
      </div>
    </div>

    <!-- 标题覆盖 -->
    <div ref="heroRef" class="fractal-hero">
      <div ref="heroTagRef" class="fractal-hero-tag">FRACTAL RECURSIVE</div>
      <h2 ref="heroTitleRef" class="fractal-hero-title">分形递归</h2>
      <div ref="heroLineRef" class="fractal-hero-line"></div>
      <p ref="heroSubRef" class="fractal-hero-sub">
        Self-Similar · Recursive Depth · Infinite Pattern
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
// ═══════════════════════════════════════════
//  Fractal Recursive Mosaic 样式
// ═══════════════════════════════════════════

.fractal-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Inter', 'PingFang SC', system-ui, sans-serif;
}

.fractal-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(ellipse at 30% 20%, rgba(255, 255, 255, 0.15), transparent 50%),
    radial-gradient(ellipse at 70% 80%, rgba(255, 255, 255, 0.1), transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(102, 126, 234, 0.2), transparent 70%);
}

// ==== 舞台 - 全屏 ====
.fractal-stage {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100vw;
  height: 100vh;
  z-index: 2;
  overflow: hidden;
}

// ==== 分形三角形 ====
.fractal-triangle {
  position: absolute;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  transform-origin: center center;
  will-change: transform, opacity;
  pointer-events: none;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

.fractal-triangle-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
}

// ==== 正面 / 背面 ====
.fractal-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  display: block;
  background-repeat: no-repeat;
}

.fractal-front {
  transform: rotateY(0deg) translateZ(1px);
}

.fractal-back {
  transform: rotateY(180deg) translateZ(1px);
  opacity: 0;
  transition: opacity 0.3s ease;
}

// Hover 翻转显示背面
.fractal-triangle:hover .fractal-back {
  opacity: 1;
}

// ==== Canvas 粒子 ====
.fractal-canvas {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
}

// ==== 底部状态栏 ====
.fractal-status {
  position: absolute;
  bottom: clamp(20px, 5vh, 50px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  opacity: 0;
}
.fractal-status-track {
  width: clamp(160px, 30vw, 320px);
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
  backdrop-filter: blur(10px);
}
.fractal-status-fill {
  height: 100%;
  width: 0%;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.95),
    rgba(255, 200, 100, 0.9),
    rgba(255, 100, 200, 0.85)
  );
  border-radius: 2px;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.6);
  transition: width 0.1s linear;
}
.fractal-status-info {
  display: flex;
  align-items: baseline;
  gap: 8px;
}
.fractal-status-count {
  font-size: 1.4rem;
  font-weight: 800;
  color: #fff;
  font-variant-numeric: tabular-nums;
  min-width: 2.5ch;
  text-align: right;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
}
.fractal-status-label {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  color: rgba(255, 255, 255, 0.85);
  text-transform: uppercase;
}
.fractal-depth-indicator {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: rgba(255, 255, 255, 0.9);
  font-family: 'Courier New', monospace;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
}

// ==== 标题 ====
.fractal-hero {
  position: absolute;
  top: clamp(20px, 5vh, 60px);
  left: clamp(20px, 6vw, 80px);
  z-index: 15;
  text-align: left;
  opacity: 0;
}
.fractal-hero-tag {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 10px;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}
.fractal-hero-title {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 900;
  color: #fff;
  margin: 0;
  line-height: 1.1;
  text-shadow:
    0 0 40px rgba(255, 255, 255, 0.6),
    0 0 80px rgba(255, 200, 100, 0.4);
  letter-spacing: 0.05em;
}
.fractal-hero-line {
  width: clamp(50px, 12vw, 90px);
  height: 3px;
  margin: 12px 0 15px;
  border-radius: 2px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.95),
    rgba(255, 200, 100, 0.8),
    transparent
  );
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}
.fractal-hero-sub {
  font-size: clamp(0.65rem, 1.5vw, 0.9rem);
  font-weight: 500;
  letter-spacing: 0.18em;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
}

@media (max-width: 768px) {
  .fractal-hero-title {
    font-size: 2rem;
  }
  .fractal-status-count {
    font-size: 1.1rem;
  }
}
</style>
