<template>
  <section ref="sectionRef" class="scratch-section">
    <!-- 暗色背景舞台 -->
    <div class="stage-bg"></div>

    <!-- 主舞台 -->
    <div ref="stageRef" class="scratch-stage">
      <!-- 原始图片 -->
      <img
        ref="imageRef"
        :src="imageUrl"
        alt=""
        class="base-image"
        crossorigin="anonymous"
      />

      <!-- Canvas 涂层蒙版 -->
      <canvas ref="maskCanvas" class="mask-canvas"></canvas>

      <!-- 刮屑粒子容器 -->
      <div ref="particlesRef" class="particles-container"></div>
    </div>

    <!-- SVG 滤镜定义 -->
    <svg class="svg-filters" width="0" height="0">
      <defs>
        <!-- 涂层金属纹理 -->
        <filter id="coating-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="1.2 0.9"
            numOctaves="3"
            seed="7"
            result="noise"
          />
          <feColorMatrix
            type="saturate"
            values="0"
            in="noise"
            result="grayNoise"
          />
          <feBlend
            in="SourceGraphic"
            in2="grayNoise"
            mode="overlay"
            result="blended"
          />
          <feComponentTransfer in="blended">
            <feFuncA type="linear" slope="1" />
          </feComponentTransfer>
        </filter>
        <!-- 刮痕边缘扰动 -->
        <filter id="scratch-rough" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.15 0.2"
            numOctaves="5"
            seed="13"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="6"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>

    <!-- 文字叠加层 -->
    <div ref="contentRef" class="content-overlay">
      <h2 class="title">Scratch & Reveal</h2>
      <p class="subtitle">Lottery Ticket · Silver Coating · Scratch-off</p>
      <div class="divider"></div>
      <p class="desc">刮刮卡揭示 · 银灰涂层 · 随机刮斑扩散 · 惊喜揭露</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []

const imageUrl = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1920&q=80'

// ==================== Refs ====================
const sectionRef   = ref<HTMLElement | null>(null)
const stageRef     = ref<HTMLElement | null>(null)
const imageRef     = ref<HTMLImageElement | null>(null)
const maskCanvas   = ref<HTMLCanvasElement | null>(null)
const particlesRef = ref<HTMLElement | null>(null)
const contentRef   = ref<HTMLElement | null>(null)

// ==================== 刮斑数据 ====================
interface ScratchSpot {
  cx: number   // 归一化中心 x [0,1]
  cy: number   // 归一化中心 y [0,1]
  startP: number  // 该斑开始刮除的进度 [0,1]
  endP: number    // 该斑刮完的进度 [0,1]
  maxR: number    // 最大半径（覆盖全图）
}

function generateSpots(canvasW: number, canvasH: number): ScratchSpot[] {
  const count = 10
  const spots: ScratchSpot[] = []
  // 边缘避免：5% padding
  for (let i = 0; i < count; i++) {
    const row = i % 3
    const col = Math.floor(i / 3)
    const baseCX = 0.15 + col * 0.35
    const baseCY = 0.12 + row * 0.38
    const cx = baseCX + (Math.random() - 0.5) * 0.22
    const cy = baseCY + (Math.random() - 0.5) * 0.28
    // 最大半径：中心到四角最远距离
    const corners = [[0,0],[1,0],[0,1],[1,1]]
    const maxDist = Math.max(...corners.map(([dx,dy]) =>
      Math.hypot((dx - cx) * canvasW, (dy - cy) * canvasH)
    ))
    const startP = 0.05 + i * 0.088   // stagger over ~93%
    const endP   = startP + 0.18       // each spot reveals over 18%
    spots.push({ cx, cy, startP, endP, maxR: maxDist * 1.15 })
  }
  return spots
}

let spots: ScratchSpot[] = []
let offscreenCanvas: HTMLCanvasElement | null = null
let canvasW = 0
let canvasH = 0

// ==================== 预渲染涂层到离屏 Canvas ====================
function renderCoatingOffscreen(w: number, h: number): HTMLCanvasElement {
  const off = document.createElement('canvas')
  off.width = w
  off.height = h
  const octx = off.getContext('2d')!

  // 基底：银灰渐变（模拟金属涂层光泽）
  const grad = octx.createLinearGradient(0, 0, w * 0.7, h * 0.8)
  grad.addColorStop(0,   '#dcdcdc')
  grad.addColorStop(0.25,'#c8c8c8')
  grad.addColorStop(0.5, '#d4d4d4')
  grad.addColorStop(0.7, '#bcbcbc')
  grad.addColorStop(1,   '#cecece')
  octx.fillStyle = grad
  octx.fillRect(0, 0, w, h)

  // 叠加细微噪点纹理
  const imageData = octx.getImageData(0, 0, w, h)
  const data = imageData.data
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 18
    data[i]     = Math.min(255, Math.max(0, data[i] + noise))
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise))
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise))
  }
  octx.putImageData(imageData, 0, 0)

  // 对角高光线（模拟金属反光）
  octx.save()
  octx.globalAlpha = 0.08
  const hlGrad = octx.createLinearGradient(0, 0, w, h)
  hlGrad.addColorStop(0,   'rgba(255,255,255,0.5)')
  hlGrad.addColorStop(0.3, 'rgba(255,255,255,0)')
  hlGrad.addColorStop(0.7, 'rgba(255,255,255,0)')
  hlGrad.addColorStop(1,   'rgba(255,255,255,0.3)')
  octx.fillStyle = hlGrad
  octx.fillRect(0, 0, w, h)
  octx.restore()

  // 刮刮卡常见：小区域标识框
  octx.save()
  octx.globalAlpha = 0.06
  octx.strokeStyle = '#000'
  octx.lineWidth = 1
  octx.setLineDash([4, 8])
  const boxMargin = w * 0.12
  octx.strokeRect(boxMargin, boxMargin, w - boxMargin * 2, h - boxMargin * 2)
  octx.restore()

  return off
}

// ==================== 绘制单个刮斑（不规则形状） ====================
function drawScratchSpot(
  ctx: CanvasRenderingContext2D,
  spotIdx: number,
  cx: number,
  cy: number,
  radius: number
) {
  if (radius <= 0.5) return

  // 主体圆形
  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2)
  ctx.fill()

  // 重叠小圆：创建不规则锯齿边缘（确定性伪随机）
  const overlapCount = Math.max(6, Math.floor(radius / 7))
  for (let i = 0; i < overlapCount; i++) {
    const seedA  = (spotIdx * 31 + i * 17 + 3) % 211
    const seedB  = (spotIdx * 53 + i * 23 + 7) % 199
    const angle  = (seedA / 211) * Math.PI * 2
    const dist   = radius * (0.55 + 0.42 * (seedB / 199))
    const ox     = cx + Math.cos(angle) * dist
    const oy     = cy + Math.sin(angle) * dist
    const or     = radius * (0.08 + 0.28 * ((seedA * seedB) % 73) / 73)
    ctx.beginPath()
    ctx.arc(ox, oy, or, 0, Math.PI * 2)
    ctx.fill()
  }

  // 在刮痕边缘处加一圈小凹痕（模拟指甲/硬币的不规则摩擦）
  const dentCount = Math.max(4, Math.floor(radius / 12))
  for (let i = 0; i < dentCount; i++) {
    const seedC = (spotIdx * 41 + i * 29 + 11) % 179
    const angle = (seedC / 179) * Math.PI * 2
    const dx    = cx + Math.cos(angle) * radius * 0.92
    const dy    = cy + Math.sin(angle) * radius * 0.92
    const dr    = radius * (0.06 + 0.12 * ((seedC * 13) % 67) / 67)
    ctx.beginPath()
    ctx.arc(dx, dy, dr, 0, Math.PI * 2)
    ctx.fill()
  }
}

// ==================== 刷新 Canvas 刮除状态 ====================
function refreshMask(progress: number) {
  const canvas = maskCanvas.value
  if (!canvas || !offscreenCanvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // 1. 绘制完整涂层
  ctx.clearRect(0, 0, canvasW, canvasH)
  ctx.globalCompositeOperation = 'source-over'
  ctx.drawImage(offscreenCanvas, 0, 0)

  // 2. 用 destination-out 刮除各斑
  ctx.globalCompositeOperation = 'destination-out'

  for (let i = 0; i < spots.length; i++) {
    const s = spots[i]
    const localP = Math.max(0, Math.min(1, (progress - s.startP) / (s.endP - s.startP)))
    if (localP <= 0) continue
    // ease: 快起慢收
    const easedP = 1 - Math.pow(1 - localP, 2.5)
    const radius = easedP * s.maxR
    const cx = s.cx * canvasW
    const cy = s.cy * canvasH
    drawScratchSpot(ctx, i, cx, cy, radius)
  }

  ctx.globalCompositeOperation = 'source-over'
}

// ==================== 生成刮屑粒子 ====================
function spawnParticles(progress: number) {
  if (!particlesRef.value) return

  // 寻找当前活跃的刮斑
  const activeSpots = spots.filter(s => {
    const lp = (progress - s.startP) / (s.endP - s.startP)
    return lp >= 0 && lp <= 1.05
  })

  if (activeSpots.length === 0) return

  const container = particlesRef.value
  // 限制粒子总数
  while (container.children.length > 35) {
    container.firstChild?.remove()
  }

  // 为每个活跃斑生成 1-2 个粒子
  activeSpots.forEach(s => {
    const count = Math.random() < 0.4 ? 2 : 1
    for (let j = 0; j < count; j++) {
      const particle = document.createElement('span')
      particle.className = 'scratch-particle'
      const angle = Math.random() * Math.PI * 2
      const dist  = 20 + Math.random() * 50
      particle.style.setProperty('--dx', `${Math.cos(angle) * dist}px`)
      particle.style.setProperty('--dy', `${Math.sin(angle) * dist - 5}px`)
      particle.style.left = `${s.cx * 100}%`
      particle.style.top  = `${s.cy * 100}%`
      container.appendChild(particle)
      // 自动移除
      setTimeout(() => particle.remove(), 900)
    }
  })
}

let lastParticleProgress = 0

// ==================== 挂载 ====================
onMounted(async () => {
  if (!sectionRef.value || !stageRef.value) return
  await nextTick()

  // 延迟确保 image 布局到位
  setTimeout(() => initCanvas(), 200)

  // ========== 文字渐显 ==========
  if (contentRef.value) {
    gsap.set(contentRef.value, { opacity: 0, y: 20 })
    const textTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 58%',
        end: 'top 22%',
        scrub: 1.0,
      },
    })
    textTl.to(contentRef.value, { opacity: 1, y: 0, duration: 1 })
    cleanupFns.push(() => textTl.kill())
  }
})

function initCanvas() {
  const stage = stageRef.value
  const canvas = maskCanvas.value
  if (!stage || !canvas || !sectionRef.value) return

  const rect = stage.getBoundingClientRect()
  canvasW = rect.width
  canvasH = rect.height
  canvas.width  = canvasW
  canvas.height = canvasH

  // 生成刮斑
  spots = generateSpots(canvasW, canvasH)

  // 预渲染涂层
  offscreenCanvas = renderCoatingOffscreen(canvasW, canvasH)

  // 初始：完整涂层
  refreshMask(0)

  // ========== ScrollTrigger 驱动刮除 ==========
  const scratchSt = ScrollTrigger.create({
    trigger: sectionRef.value!,
    start: 'top 75%',
    end: 'bottom 32%',
    scrub: 1.0,
    onUpdate(self) {
      const p = self.progress
      refreshMask(p)
      // 粒子阀值：每次进度变化超过 1.5% 时生成
      if (Math.abs(p - lastParticleProgress) > 0.015 && p < 0.95) {
        spawnParticles(p)
        lastParticleProgress = p
      }
    },
    onLeaveBack() {
      refreshMask(0)
      lastParticleProgress = 0
    },
  })
  cleanupFns.push(() => scratchSt.kill())
}

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
})
</script>

<style scoped>
/* ==================== 容器 ==================== */
.scratch-section {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ==================== 暗色背景 ==================== */
.stage-bg {
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    radial-gradient(ellipse at 50% 45%, #2a2830 0%, #1a1820 60%, #0e0d12 100%);
}

/* ==================== 主舞台 ==================== */
.scratch-stage {
  position: relative;
  z-index: 3;
  width: min(440px, 74vw);
  aspect-ratio: 4 / 3;
  background: #111;
  box-shadow:
    0 8px 40px rgba(0,0,0,0.5),
    0 0 0 1px rgba(255,255,255,0.06);
  overflow: hidden;
}

/* 原始图片 */
.base-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}

/* Canvas 涂层 */
.mask-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  /* SVG 滤镜叠加：金属颗粒纹理 */
  filter: url(#coating-grain);
}

/* ==================== 刮屑粒子 ==================== */
.particles-container {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  overflow: hidden;
}

:global(.scratch-particle) {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(200, 200, 210, 0.9);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: particle-fly 0.85s ease-out forwards;
  pointer-events: none;
}

:global(.scratch-particle)::after {
  content: '';
  position: absolute;
  inset: -1px;
  background: rgba(230, 230, 240, 0.5);
  border-radius: 50%;
  filter: blur(1px);
}

@keyframes particle-fly {
  0% {
    opacity: 0.9;
    transform: translate(-50%, -50%) scale(1);
  }
  30% {
    opacity: 0.7;
  }
  100% {
    opacity: 0;
    transform: translate(
      calc(-50% + var(--dx, 0px)),
      calc(-50% + var(--dy, 0px))
    ) scale(0.2);
  }
}

/* ==================== SVG 滤镜 ==================== */
.svg-filters {
  position: absolute;
  width: 0;
  height: 0;
  visibility: hidden;
}

/* ==================== 文字叠加层 ==================== */
.content-overlay {
  position: absolute;
  z-index: 20;
  bottom: 12%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  pointer-events: none;
}

.title {
  font-family: 'Georgia', 'Times New Roman', serif;
  font-size: clamp(1.8rem, 3.5vw, 2.6rem);
  font-weight: bold;
  color: #e8e4dc;
  margin: 0;
  letter-spacing: 3px;
  text-shadow: 0 2px 8px rgba(0,0,0,0.5);
}

.subtitle {
  font-family: 'Courier New', monospace;
  font-size: clamp(0.68rem, 1.15vw, 0.82rem);
  color: rgba(180,175,165,0.7);
  margin: 6px 0 0;
  letter-spacing: 1px;
}

.divider {
  width: 56px;
  height: 2px;
  background: rgba(180,175,165,0.3);
  margin: 14px auto 0;
}

.desc {
  font-family: 'Georgia', 'Times New Roman', serif;
  font-size: clamp(0.72rem, 1.25vw, 0.85rem);
  color: rgba(170,165,155,0.5);
  margin: 10px 0 0;
  letter-spacing: 1.5px;
}

/* ==================== 响应式 ==================== */
@media (max-width: 768px) {
  .scratch-stage {
    width: 82vw;
    aspect-ratio: 4 / 3.3;
  }
}
</style>
