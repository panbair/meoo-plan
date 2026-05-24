<template>
  <section ref="parentRef" class="vf-container">
    <!-- ==================== 基础场景图像 ==================== -->
    <img
      :src="sceneSrc"
      class="vf-img"
      crossorigin="anonymous"
    />

    <!-- ==================== Layer 1-5: 体积雾景深层 ==================== -->
    <!-- Layer 1: 远景天空 (z: -100px, 雾浓度 80%) -->
    <div ref="fogLayer1Ref" class="vf-fog vf-fog-1">
      <div class="vf-fog-fill"></div>
    </div>

    <!-- Layer 2: 远景山脉 (z: -60px, 雾浓度 60%) -->
    <div ref="fogLayer2Ref" class="vf-fog vf-fog-2">
      <div class="vf-fog-fill"></div>
    </div>

    <!-- Layer 3: 中景建筑 (z: -30px, 雾浓度 40%) -->
    <div ref="fogLayer3Ref" class="vf-fog vf-fog-3">
      <div class="vf-fog-fill"></div>
    </div>

    <!-- Layer 4: 近景树木 (z: 0px, 雾浓度 20%) -->
    <div ref="fogLayer4Ref" class="vf-fog vf-fog-4">
      <div class="vf-fog-fill"></div>
    </div>

    <!-- Layer 5: 前景人物 (z: 30px, 雾浓度 0%) -->
    <div ref="fogLayer5Ref" class="vf-fog vf-fog-5">
      <div class="vf-fog-fill"></div>
    </div>

    <!-- ==================== Layer 6: 体积雾粒子 Canvas ==================== -->
    <canvas ref="particleCanvasRef" class="vf-particles"></canvas>

    <!-- ==================== Layer 7: 上帝光 - SVG 径向光束 ==================== -->
    <svg ref="godRaysRef" class="vf-godrays" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <radialGradient id="vf-ray-grad" cx="50%" cy="0%" r="110%">
          <stop offset="0%" stop-color="rgba(255,255,245,0.35)" />
          <stop offset="8%" stop-color="rgba(255,255,245,0.25)" />
          <stop offset="25%" stop-color="rgba(255,255,240,0.08)" />
          <stop offset="55%" stop-color="rgba(255,255,240,0.02)" />
          <stop offset="100%" stop-color="rgba(255,255,240,0)" />
        </radialGradient>
        <radialGradient id="vf-ray-warm" cx="45%" cy="5%" r="100%">
          <stop offset="0%" stop-color="rgba(255,245,220,0.2)" />
          <stop offset="15%" stop-color="rgba(255,240,210,0.08)" />
          <stop offset="50%" stop-color="rgba(255,240,210,0.01)" />
          <stop offset="100%" stop-color="rgba(255,240,210,0)" />
        </radialGradient>
      </defs>
      <!-- 主光束 -->
      <polygon points="50,0 5,100 95,100" fill="url(#vf-ray-grad)" />
      <polygon points="42,0 -15,100 75,100" fill="url(#vf-ray-grad)" class="vf-ray-secondary" />
      <polygon points="58,0 25,100 115,100" fill="url(#vf-ray-grad)" class="vf-ray-secondary" />
      <!-- 暖色副光束 -->
      <polygon points="35,0 -5,100 60,100" fill="url(#vf-ray-warm)" class="vf-ray-warm" />
      <polygon points="65,0 40,100 105,100" fill="url(#vf-ray-warm)" class="vf-ray-warm" />
      <!-- 窄光束 -->
      <polygon points="48,0 20,100 55,100" fill="url(#vf-ray-grad)" class="vf-ray-narrow" />
      <polygon points="53,0 45,100 80,100" fill="url(#vf-ray-grad)" class="vf-ray-narrow" />
    </svg>

    <!-- ==================== 大气散射色彩覆盖层 ==================== -->
    <div ref="atmoRef" class="vf-atmosphere"></div>

    <!-- ==================== 信息面板 ==================== -->
    <div ref="infoRef" class="vf-info">
      <span class="vf-info-label">VOLUMETRIC FOG</span>
      <h2 class="vf-info-title">体积雾大气透视</h2>
      <div class="vf-info-divider"></div>
      <span class="vf-info-specs">
        雾浓度 {{ fogPercent }}% · 能见度 {{ visibilityPercent }}% · 深度层 {{ activeLayer }}/5
      </span>
    </div>

    <!-- ==================== 深度层级指示器 ==================== -->
    <div ref="depthIndicatorRef" class="vf-depth-indicator">
      <div
        v-for="d in 5"
        :key="d"
        class="vf-depth-dot"
        :class="{ 'vf-depth-dot-active': activeLayer >= d }"
        :style="{ transform: `translateY(${(6-d) * 6}px)` }"
      ></div>
    </div>

    <!-- ==================== 进度条 ==================== -->
    <div ref="progressRef" class="vf-progress">
      <div ref="progressBarRef" class="vf-progress-bar"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ======== 类型 ========
type TweenCleanup = () => void

interface FogParticle {
  x: number
  y: number
  radius: number
  baseRadius: number
  opacity: number
  baseOpacity: number
  speedX: number
  speedY: number
  wobble: number
  wobbleSpeed: number
}

// ======== 模板引用 ========
const parentRef = ref<HTMLElement | null>(null)
const fogLayer1Ref = ref<HTMLElement | null>(null)
const fogLayer2Ref = ref<HTMLElement | null>(null)
const fogLayer3Ref = ref<HTMLElement | null>(null)
const fogLayer4Ref = ref<HTMLElement | null>(null)
const fogLayer5Ref = ref<HTMLElement | null>(null)
const particleCanvasRef = ref<HTMLCanvasElement | null>(null)
const godRaysRef = ref<SVGSVGElement | null>(null)
const atmoRef = ref<HTMLElement | null>(null)
const infoRef = ref<HTMLElement | null>(null)
const depthIndicatorRef = ref<HTMLElement | null>(null)
const progressRef = ref<HTMLElement | null>(null)
const progressBarRef = ref<HTMLElement | null>(null)

// ======== 响应式状态 ========
const fogPercent = ref(100)
const visibilityPercent = ref(0)
const activeLayer = ref(5)

// ======== 场景图片 ========
const sceneSrc = 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1400&q=80'

// ======== 雾层配置：{ 最大密度, 最大模糊(px) } ========
const fogConfig = [
  { density: 0.80, blur: 10, name: '远景天空',   z: -100 },
  { density: 0.60, blur: 7,  name: '远景山脉',   z: -60  },
  { density: 0.40, blur: 5,  name: '中景建筑',   z: -30  },
  { density: 0.20, blur: 3,  name: '近景树木',   z: 0    },
  { density: 0.05, blur: 1,  name: '前景人物',   z: 30   },
]

// ======== 粒子系统 ========
let particles: FogParticle[] = []
let particleIntervalId = 0
let canvasW = 0
let canvasH = 0

const initParticles = () => {
  particles = []
  const count = 90
  for (let i = 0; i < count; i++) {
    // 粒子偏向于上部（雾浓区域）
    const yBias = Math.random() < 0.65
      ? Math.random() * 0.6 * canvasH
      : Math.random() * canvasH

    const baseR = 12 + Math.random() * 50
    particles.push({
      x: Math.random() * canvasW,
      y: yBias,
      radius: baseR,
      baseRadius: baseR,
      opacity: 0.02 + Math.random() * 0.07,
      baseOpacity: 0.02 + Math.random() * 0.07,
      speedX: (Math.random() - 0.5) * 0.25,
      speedY: -(Math.random() * 0.25 + 0.04),
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.003 + Math.random() * 0.012,
    })
  }
}

const renderParticles = (globalFogMultiplier: number) => {
  const canvas = particleCanvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, canvasW, canvasH)

  for (const p of particles) {
    // 移动
    p.wobble += p.wobbleSpeed
    p.x += p.speedX + Math.sin(p.wobble) * 0.15
    p.y += p.speedY

    // 循环边界
    if (p.y < -p.radius * 2) {
      p.y = canvasH + p.radius
      p.x = Math.random() * canvasW
    }
    if (p.x < -p.radius) p.x = canvasW + p.radius
    if (p.x > canvasW + p.radius) p.x = -p.radius

    // 根据雾浓度调整粒子大小和透明度
    const size = p.radius * (0.3 + globalFogMultiplier * 0.7)
    const alpha = p.opacity * (0.2 + globalFogMultiplier * 0.8)

    if (size < 1 || alpha < 0.001) continue

    ctx.beginPath()
    ctx.arc(p.x, p.y, size, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(240, 245, 255, ${alpha})`
    ctx.fill()
  }
}

// ======== 初始化 ========
onMounted(() => {
  if (!parentRef.value) return
  requestAnimationFrame(() => setup())
})

const setup = () => {
  const container = parentRef.value
  if (!container) return

  // ===== Canvas 尺寸 =====
  canvasW = window.innerWidth
  canvasH = window.innerHeight
  const pCanvas = particleCanvasRef.value
  if (pCanvas) {
    pCanvas.width = canvasW
    pCanvas.height = canvasH
  }

  // 初始化粒子
  initParticles()

  // 启动渲染循环
  const fogLayers = [
    fogLayer1Ref.value,
    fogLayer2Ref.value,
    fogLayer3Ref.value,
    fogLayer4Ref.value,
    fogLayer5Ref.value,
  ]

  let currentGlobalFog = 1.0
  renderParticles(currentGlobalFog)
  particleIntervalId = window.setInterval(() => {
    renderParticles(currentGlobalFog)
  }, 40)

  // ===== 初始状态 =====
  // 所有雾层初始为满密度
  fogConfig.forEach((cfg, i) => {
    const layer = fogLayers[i]
    if (layer) {
      layer.style.setProperty('--vf-density', String(cfg.density))
      layer.style.setProperty('--vf-blur', `${cfg.blur}px`)
    }
  })

  gsap.set(godRaysRef.value, { opacity: 0 })
  gsap.set(atmoRef.value, { opacity: 0.4 })
  gsap.set(infoRef.value, { opacity: 0, y: 15 })
  gsap.set(depthIndicatorRef.value, { opacity: 0, x: 15 })
  gsap.set(progressBarRef.value, { width: '0%' })

  fogPercent.value = 100
  visibilityPercent.value = 0
  activeLayer.value = 5

  // ===== 主时间线 =====
  const mainTl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top 85%',
      end: 'bottom 15%',
      scrub: 1.2,
    },
  })

  mainTl.to(
    {},
    {
      duration: 1,
      onUpdate: () => {
        const p = mainTl.progress() // 0 → 1 (浓雾 → 清晰)

        // 各层雾密度：最近层最先消散，最远层最后消散
        fogConfig.forEach((cfg, i) => {
          const layer = fogLayers[i]
          if (!layer) return

          // 每层的消退区间不同：层号越小(越远)越晚消退
          const clearStart = i * 0.15     // 消退起点
          const clearEnd = 0.3 + i * 0.18 // 消退终点
          const layerProgress = Math.max(0, Math.min(1, (p - clearStart) / (clearEnd - clearStart)))

          // 密度和模糊度随 layerProgress 从最大 → 0
          const density = cfg.density * (1 - layerProgress)
          const blur = cfg.blur * (1 - layerProgress)

          layer.style.setProperty('--vf-density', String(density))
          layer.style.setProperty('--vf-blur', `${blur}px`)
        })

        // 全局雾浓度（用于粒子 + UI 显示）
        const globalFog = 1 - p
        currentGlobalFog = globalFog

        // 上帝光：在雾消散中期最明显（丁达尔效应最佳时段）
        const rayOpacity: number = (() => {
          if (p < 0.15) return 0
          if (p < 0.45) return (p - 0.15) / 0.3 * 0.8
          if (p < 0.7)  return 0.8
          return 0.8 * (1 - (p - 0.7) / 0.3)
        })()
        gsap.set(godRaysRef.value, { opacity: rayOpacity })

        // 大气散射层
        const atmoOpacity = 0.4 * (1 - p) + 0.02
        const atmoEl = atmoRef.value
        if (atmoEl) {
          atmoEl.style.opacity = String(atmoOpacity)
          atmoEl.style.background = `linear-gradient(180deg,
            rgba(180,200,230,${0.25 * globalFog}) 0%,
            rgba(200,215,235,${0.12 * globalFog}) 40%,
            rgba(220,230,240,${0.04 * globalFog}) 100%)`
        }

        // UI 更新
        fogPercent.value = Math.round(globalFog * 100)
        visibilityPercent.value = Math.round(p * 100)
        activeLayer.value = Math.max(1, 5 - Math.floor(p * 5))
      },
    },
    0,
  )

  // ===== 信息面板入场 =====
  mainTl.to(infoRef.value, { opacity: 1, y: 0, duration: 0.08, ease: 'power2.out' }, 0.02)
  mainTl.to(depthIndicatorRef.value, { opacity: 1, x: 0, duration: 0.1, ease: 'power2.out' }, 0.04)

  // ===== 进度条 =====
  mainTl.to(progressBarRef.value, { width: '100%', duration: 0.98, ease: 'none' }, 0.01)

  // ===== 注册清理 =====
  cleanupFns.push(() => {
    mainTl.scrollTrigger?.kill()
    mainTl.kill()
  })
}

const cleanupFns: TweenCleanup[] = []

// ======== 窗口缩放 ========
let resizeTimeout: number | null = null
const handleResize = () => {
  if (resizeTimeout) clearTimeout(resizeTimeout)
  resizeTimeout = window.setTimeout(() => {
    canvasW = window.innerWidth
    canvasH = window.innerHeight
    const pCanvas = particleCanvasRef.value
    if (pCanvas) {
      pCanvas.width = canvasW
      pCanvas.height = canvasH
    }
    initParticles()
  }, 300)
}
window.addEventListener('resize', handleResize)

// ======== 卸载 ========
onUnmounted(() => {
  if (resizeTimeout) clearTimeout(resizeTimeout)
  if (particleIntervalId) clearInterval(particleIntervalId)
  window.removeEventListener('resize', handleResize)
  cleanupFns.forEach((fn) => fn())
})
</script>

<style lang="scss" scoped>
/* ==================== 容器 ==================== */
.vf-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #0a0c14;
}

/* ==================== 基础图像 ==================== */
.vf-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}

/* ==================== 体积雾层 (5 层) ==================== */
.vf-fog {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  will-change: opacity;
}

.vf-fog-fill {
  width: 100%;
  height: 100%;
  backdrop-filter: blur(var(--vf-blur, 0px));
  -webkit-backdrop-filter: blur(var(--vf-blur, 0px));
}

.vf-fog-1 {
  z-index: 3;
  .vf-fog-fill {
    background: rgba(240, 245, 255, var(--vf-density, 0));
    mask-image: linear-gradient(
      to bottom,
      black 0%,
      black 70%,
      transparent 100%
    );
    -webkit-mask-image: linear-gradient(
      to bottom,
      black 0%,
      black 70%,
      transparent 100%
    );
  }
}

.vf-fog-2 {
  z-index: 4;
  .vf-fog-fill {
    background: rgba(235, 242, 252, var(--vf-density, 0));
    mask-image: linear-gradient(
      to bottom,
      black 5%,
      black 55%,
      transparent 85%
    );
    -webkit-mask-image: linear-gradient(
      to bottom,
      black 5%,
      black 55%,
      transparent 85%
    );
  }
}

.vf-fog-3 {
  z-index: 5;
  .vf-fog-fill {
    background: rgba(228, 238, 250, var(--vf-density, 0));
    mask-image: linear-gradient(
      to bottom,
      black 15%,
      black 45%,
      transparent 75%
    );
    -webkit-mask-image: linear-gradient(
      to bottom,
      black 15%,
      black 45%,
      transparent 75%
    );
  }
}

.vf-fog-4 {
  z-index: 6;
  .vf-fog-fill {
    background: rgba(220, 232, 248, var(--vf-density, 0));
    mask-image: linear-gradient(
      to bottom,
      black 30%,
      black 35%,
      transparent 65%
    );
    -webkit-mask-image: linear-gradient(
      to bottom,
      black 30%,
      black 35%,
      transparent 65%
    );
  }
}

.vf-fog-5 {
  z-index: 7;
  .vf-fog-fill {
    background: rgba(210, 225, 245, var(--vf-density, 0));
    mask-image: linear-gradient(
      to bottom,
      black 45%,
      black 20%,
      transparent 65%
    );
    -webkit-mask-image: linear-gradient(
      to bottom,
      black 45%,
      black 20%,
      transparent 65%
    );
  }
}

/* ==================== 体积雾粒子 Canvas ==================== */
.vf-particles {
  position: absolute;
  inset: 0;
  z-index: 10;
  pointer-events: none;
  mix-blend-mode: screen;
}

/* ==================== 上帝光 SVG ==================== */
.vf-godrays {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 8;
  pointer-events: none;
  mix-blend-mode: screen;
  will-change: opacity;
}

.vf-ray-secondary {
  opacity: 0.6;
}

.vf-ray-warm {
  opacity: 0.5;
}

.vf-ray-narrow {
  opacity: 0.4;
}

/* ==================== 大气散射层 ==================== */
.vf-atmosphere {
  position: absolute;
  inset: 0;
  z-index: 9;
  pointer-events: none;
  mix-blend-mode: soft-light;
  will-change: opacity, background;
}

/* ==================== 信息面板 ==================== */
.vf-info {
  position: absolute;
  bottom: 10%;
  left: 8%;
  z-index: 20;
  pointer-events: none;
  max-width: 400px;
}

.vf-info-label {
  display: block;
  font-family: 'Courier New', monospace;
  font-size: 11px;
  letter-spacing: 4px;
  color: rgba(180, 210, 255, 0.5);
  text-transform: uppercase;
  margin-bottom: 6px;
}

.vf-info-title {
  margin: 0 0 8px;
  font-size: clamp(22px, 3vw, 34px);
  font-weight: 300;
  color: rgba(220, 235, 255, 0.9);
  letter-spacing: 6px;
  text-shadow: 0 0 20px rgba(200, 220, 255, 0.15);
}

.vf-info-divider {
  width: 40px;
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(160, 200, 240, 0.5),
    rgba(200, 220, 255, 0.2)
  );
  margin: 8px 0 10px;
}

.vf-info-specs {
  font-family: 'Courier New', monospace;
  font-size: 10px;
  letter-spacing: 1.5px;
  color: rgba(160, 200, 240, 0.4);
}

/* ==================== 深度层级指示器 ==================== */
.vf-depth-indicator {
  position: absolute;
  right: 4%;
  top: 50%;
  transform: translateY(-50%);
  z-index: 20;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.vf-depth-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(200, 220, 255, 0.2);
  transition: background 0.6s ease, box-shadow 0.6s ease, width 0.6s ease, height 0.6s ease;

  &.vf-depth-dot-active {
    background: rgba(220, 240, 255, 0.8);
    box-shadow: 0 0 8px rgba(200, 230, 255, 0.5), 0 0 16px rgba(180, 220, 255, 0.2);
    width: 5px;
    height: 12px;
    border-radius: 3px;
  }
}

/* ==================== 进度条 ==================== */
.vf-progress {
  position: absolute;
  bottom: 3%;
  left: 8%;
  right: 8%;
  height: 1.5px;
  background: rgba(200, 220, 255, 0.05);
  z-index: 20;
  pointer-events: none;
}

.vf-progress-bar {
  height: 100%;
  width: 0%;
  background: linear-gradient(
    90deg,
    rgba(180, 210, 240, 0.4),
    rgba(220, 240, 255, 0.6),
    rgba(180, 210, 240, 0.4)
  );
  box-shadow: 0 0 6px rgba(200, 230, 255, 0.3);
  will-change: width;
}

/* ==================== 响应式适配 ==================== */
@media (max-width: 768px) {
  .vf-info {
    bottom: 8%;
    left: 5%;
    max-width: 280px;
  }

  .vf-info-title {
    font-size: clamp(16px, 5vw, 24px);
    letter-spacing: 3px;
  }

  .vf-info-label {
    font-size: 9px;
    letter-spacing: 2px;
  }

  .vf-depth-indicator {
    right: 2%;
    gap: 5px;
  }

  .vf-progress {
    bottom: 2%;
    left: 5%;
    right: 5%;
  }
}
</style>
