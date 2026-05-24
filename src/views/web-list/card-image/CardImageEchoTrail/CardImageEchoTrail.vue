<template>
  <div class="fa-section" ref="sectionRef">
    <!-- 暗色背景 -->
    <div class="fa-bg"></div>

    <!-- 图片舞台 (作为 background:inherit 的源) -->
    <div
      class="fa-stage"
      ref="stageRef"
      :style="{ backgroundImage: `url(${mainImage})` }"
    >
      <!-- Layer 2-5: 残影层 (从后到前, z-index 递增) -->
      <div
        v-for="i in 4"
        :key="i"
        class="fa-echo"
        :ref="el => { if (el) echoRefs[i-1] = el as HTMLElement }"
      ></div>

      <!-- Layer 1: 基准帧 (最前面) -->
      <div class="fa-base"></div>
    </div>

    <!-- Layer 6: 方向轨迹 Canvas -->
    <canvas class="fa-trails" ref="trailsRef"></canvas>

    <!-- Layer 7: 快门暗角 -->
    <div class="fa-shutter" ref="shutterRef">
      <div class="fa-shutter-inner"></div>
    </div>

    <!-- 进度指示器 -->
    <div class="fa-progress" ref="progressRef">
      <div class="fa-progress-track">
        <div class="fa-progress-bar" ref="progressBarRef"></div>
      </div>
      <div class="fa-progress-label">
        <span class="fa-progress-val" ref="progressValRef">0</span>
        <span class="fa-progress-unit">% EXPOSURE</span>
      </div>
    </div>

    <!-- 内容覆盖 -->
    <div class="fa-content" ref="contentRef">
      <h2 class="fa-title" ref="titleRef">时光残影回声</h2>
      <div class="fa-divider" ref="dividerRef"></div>
      <p class="fa-sub">Echo Trail · Long Exposure Blur</p>
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
const mainImage = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80'

// ==================== Refs ====================
const sectionRef = ref<HTMLElement | null>(null)
const stageRef = ref<HTMLElement | null>(null)
const echoRefs = ref<(HTMLElement | null)[]>([])
const trailsRef = ref<HTMLCanvasElement | null>(null)
const shutterRef = ref<HTMLElement | null>(null)
const progressBarRef = ref<HTMLElement | null>(null)
const progressValRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const dividerRef = ref<HTMLElement | null>(null)

let cleanupFns: TweenCleanup[] = []

// ==================== Canvas 状态 ====================
let trailsCtx: CanvasRenderingContext2D | null = null
let trailsW = 0
let trailsH = 0
let trailsAnimId = 0

// 轨迹粒子
interface TrailDot {
  x: number
  y: number
  r: number
  a: number
  life: number
  age: number
}
let trailDots: TrailDot[] = []
let trailTime = 0

// ==================== 残影配置 ====================
interface EchoConfig {
  maxOffset: number    // 最大偏移量 (px)
  baseOpacity: number  // 基础透明度
  blurBase: number     // 模糊基数
  zLayer: number       // 视觉深度系数
}

const echoConfigs: EchoConfig[] = [
  { maxOffset: 18,  baseOpacity: 0.55, blurBase: 1.5, zLayer: 0.25 },
  { maxOffset: 38,  baseOpacity: 0.35, blurBase: 3.5, zLayer: 0.5  },
  { maxOffset: 62,  baseOpacity: 0.20, blurBase: 6.0, zLayer: 0.75 },
  { maxOffset: 90,  baseOpacity: 0.10, blurBase: 10,  zLayer: 1.0  },
]

// ==================== 辅助函数 ====================
function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)) }
function smoothstep(t: number) { return t * t * (3 - 2 * t) }

/**
 * 残影发散曲线 — boomerang 型 (0 → 1 → 0)
 * 在 t=0.55 处达到峰值（略微偏后，给快门前留空间）
 */
function echoSpread(t: number): number {
  if (t <= 0) return 0
  if (t >= 1) return 0
  if (t < 0.55) return smoothstep(t / 0.55)
  return smoothstep((1 - t) / 0.45)
}

/**
 * 残影运动方向 (角度弧度, 随滚动旋转 270°)
 */
function echoAngle(p: number): number {
  return p * Math.PI * 1.5 // p:0→1, angle:0°→270°
}

// ==================== 轨迹 Canvas ====================
function initTrailsCanvas() {
  const canvas = trailsRef.value
  if (!canvas || !stageRef.value) return
  const rect = stageRef.value.getBoundingClientRect()
  trailsW = rect.width
  trailsH = rect.height
  canvas.width = trailsW
  canvas.height = trailsH
  canvas.style.width = trailsW + 'px'
  canvas.style.height = trailsH + 'px'
  trailsCtx = canvas.getContext('2d')
}

function spawnTrailDots(spread: number, angle: number) {
  if (spread < 0.08) {
    trailDots = []
    return
  }

  const w = trailsW
  const h = trailsH
  const dotCount = Math.floor(spread * 18)

  // 沿着方向在画面中生成轨迹点
  const dirX = Math.cos(angle)
  const dirY = Math.sin(angle)

  for (let i = 0; i < dotCount; i++) {
    // 随机起点在画面中央区域
    const sx = w * (0.2 + Math.random() * 0.6)
    const sy = h * (0.2 + Math.random() * 0.6)
    // 偏移到 echo 方向
    const px = sx + dirX * spread * 80 * (0.3 + Math.random() * 0.7)
    const py = sy + dirY * spread * 80 * (0.3 + Math.random() * 0.7)

    trailDots.push({
      x: clamp(px, 0, w),
      y: clamp(py, 0, h),
      r: 0.8 + Math.random() * 2.5,
      a: spread * (0.15 + Math.random() * 0.3),
      life: 1.5 + Math.random() * 2.0,
      age: 0,
    })
  }

  // 限制总数
  if (trailDots.length > 120) {
    trailDots.sort((a, b) => a.a * (1 - a.age / a.life) - b.a * (1 - b.age / b.life))
    trailDots = trailDots.slice(-100)
  }
}

function drawTrails(dt: number) {
  if (!trailsCtx || !trailsRef.value) return
  const ctx = trailsCtx
  const w = trailsW
  const h = trailsH

  ctx.clearRect(0, 0, w, h)

  // 更新并绘制轨迹点
  for (let i = trailDots.length - 1; i >= 0; i--) {
    const dot = trailDots[i]
    dot.age += dt

    if (dot.age >= dot.life) {
      trailDots.splice(i, 1)
      continue
    }

    const lifePct = 1 - dot.age / dot.life
    const alpha = dot.a * lifePct * lifePct

    // 辉光
    ctx.beginPath()
    ctx.arc(dot.x, dot.y, dot.r * 2.5, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(100,180,240,${(alpha * 0.3).toFixed(3)})`
    ctx.fill()

    // 核心
    ctx.beginPath()
    ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(180,220,255,${alpha.toFixed(3)})`
    ctx.fill()
  }
}

function animateTrails(time: number) {
  const dt = trailsAnimId === 0 ? 0.016 : 0.016
  trailTime = time
  drawTrails(dt)
  trailsAnimId = requestAnimationFrame(animateTrails)
}

// ==================== 挂载 ====================
onMounted(async () => {
  if (!sectionRef.value) return
  await nextTick()
  setTimeout(() => initTrailsCanvas(), 400)
  trailsAnimId = requestAnimationFrame(animateTrails)

  const ctx = gsap.context(() => {
    const mainSt = ScrollTrigger.create({
      trigger: sectionRef.value!,
      start: 'top 92%',
      end: 'bottom 18%',
      scrub: 1.1,
      onUpdate(self) {
        const p = self.progress

        // 残影发散量 (boomerang: 0→1→0)
        const spread = echoSpread(p)

        // 运动方向 (旋转 270°)
        const angle = echoAngle(p)
        const dirX = Math.cos(angle)
        const dirY = Math.sin(angle)

        // 更新 4 层残影
        const validEchoes = echoRefs.value.filter(Boolean) as HTMLElement[]
        for (let i = 0; i < 4 && i < validEchoes.length; i++) {
          const el = validEchoes[i]
          const cfg = echoConfigs[i]

          const offsetX = dirX * cfg.maxOffset * spread
          const offsetY = dirY * cfg.maxOffset * spread
          const opacity = cfg.baseOpacity * spread
          const blur = cfg.blurBase * spread

          el.style.transform = `translate3d(${offsetX.toFixed(1)}px, ${offsetY.toFixed(1)}px, 0)`
          el.style.opacity = String(opacity.toFixed(3))
          el.style.filter = `blur(${blur.toFixed(1)}px)`
        }

        // 轨迹粒子
        spawnTrailDots(spread, angle)

        // 快门效果 (p=0.85~0.95 快速闪烁)
        if (shutterRef.value) {
          if (p >= 0.85 && p <= 0.95) {
            const localT = (p - 0.85) / 0.10
            const flashes = 4 // 4 次闪烁
            const flashPhase = (localT * flashes) % 1
            const shutterAlpha = flashPhase < 0.5 ? 0.7 : 0.05
            shutterRef.value.style.opacity = String(shutterAlpha)
          } else {
            shutterRef.value.style.opacity = '0'
          }
        }

        // 进度条
        const pct = Math.round(p * 100)
        if (progressBarRef.value) progressBarRef.value.style.width = `${pct}%`
        if (progressValRef.value) progressValRef.value.textContent = String(pct)
      },
      onLeaveBack() {
        // 重置所有残影
        const validEchoes = echoRefs.value.filter(Boolean) as HTMLElement[]
        validEchoes.forEach(el => {
          el.style.transform = 'translate3d(0, 0, 0)'
          el.style.opacity = '0'
          el.style.filter = 'blur(0px)'
        })
        trailDots = []
        if (shutterRef.value) shutterRef.value.style.opacity = '0'
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
  cancelAnimationFrame(trailsAnimId)
})
</script>

<style scoped lang="scss">
// ==================== 容器 ====================
.fa-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #080c16;
}

// ==================== 暗色背景 ====================
.fa-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(ellipse at 50% 35%, rgba(25, 80, 150, 0.05) 0%, transparent 55%),
    radial-gradient(ellipse at 30% 60%, rgba(140, 60, 180, 0.03) 0%, transparent 50%);
}

// ==================== 图片舞台 (background:inherit 源) ====================
.fa-stage {
  position: absolute;
  inset: 5%;
  z-index: 2;
  background-size: cover;
  background-position: center;
  overflow: hidden;
  border-radius: 4px;
  box-shadow: 0 0 60px rgba(0, 0, 0, 0.4);
}

// Layer 1: 基准帧 (最前面, 不透明)
.fa-base {
  position: absolute;
  inset: 0;
  background: inherit;
  background-size: cover;
  background-position: center;
  z-index: 5;
}

// Layer 2-5: 残影层 (使用 bg:inherit 共享舞台图)
.fa-echo {
  position: absolute;
  inset: 0;
  background: inherit;
  background-size: cover;
  background-position: center;
  opacity: 0;
  filter: blur(0px);
  will-change: transform, opacity, filter;
  pointer-events: none;
}

// 残影 z-index 从后到前: 1, 2, 3, 4
.fa-echo:nth-of-type(1) { z-index: 1; }
.fa-echo:nth-of-type(2) { z-index: 2; }
.fa-echo:nth-of-type(3) { z-index: 3; }
.fa-echo:nth-of-type(4) { z-index: 4; }

// ==================== Layer 6: 方向轨迹 Canvas ====================
.fa-trails {
  position: absolute;
  inset: 5%;
  z-index: 6;
  pointer-events: none;
}

// ==================== Layer 7: 快门暗角 ====================
.fa-shutter {
  position: absolute;
  inset: 0;
  z-index: 8;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.06s;
}

.fa-shutter-inner {
  width: 100%;
  height: 100%;
  background: radial-gradient(
    ellipse at center,
    transparent 45%,
    rgba(0, 0, 0, 0.15) 62%,
    rgba(0, 0, 0, 0.40) 78%,
    rgba(0, 0, 0, 0.75) 90%,
    rgba(0, 0, 0, 0.95) 100%
  );
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
  width: 0%;
  background: linear-gradient(90deg,
    rgba(50, 155, 235, 0.5),
    rgba(100, 195, 250, 0.8),
    rgba(180, 220, 255, 0.7),
    rgba(100, 195, 250, 0.5)
  );
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(60, 175, 245, 0.45);
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
  color: rgba(160, 215, 255, 0.9);
  text-shadow: 0 0 12px rgba(70, 180, 245, 0.4);
  min-width: 28px;
  text-align: right;
}

.fa-progress-unit {
  font-size: 0.64rem;
  letter-spacing: 0.14em;
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
  font-size: clamp(1.8rem, 5vw, 3.5rem);
  font-weight: 800;
  letter-spacing: 0.05em;
  color: #fff;
  text-shadow:
    0 0 30px rgba(60, 175, 245, 0.5),
    0 0 60px rgba(100, 130, 235, 0.3),
    0 0 100px rgba(40, 100, 220, 0.18);
  margin: 0 0 10px;
  line-height: 1.15;
}

.fa-divider {
  width: 72px;
  height: 2px;
  margin: 0 auto 8px;
  background: linear-gradient(90deg,
    rgba(35, 145, 230, 0.2),
    rgba(85, 185, 245, 0.6),
    rgba(35, 145, 230, 0.2)
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
