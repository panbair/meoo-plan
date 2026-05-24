<template>
  <section ref="parentRef" class="nv-container">
    <!-- ==================== SVG 噪点滤镜 ==================== -->
    <svg class="nv-svg-defs" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <!-- 夜视噪点 -->
        <filter id="nv-noise" color-interpolation-filters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.65 0.7" numOctaves="3" seed="2" />
          <feColorMatrix type="matrix" values="0 0 0 0 0   0 1 0 0 0   0 0 0 0 0   0 0 0 0.22 0" />
        </filter>
      </defs>
    </svg>

    <!-- ==================== Layer 1: 基础图片 (始终可见) ==================== -->
    <div class="nv-base">
      <img ref="baseImgRef" :src="sceneSrc" class="nv-img" crossorigin="anonymous" />
    </div>

    <!-- ==================== Layer 2: 夜视效果叠加 ==================== -->
    <!-- 灰度+提亮 → 覆盖绿色半透明层 → screen 混合 = 绿色磷光 -->
    <div ref="nightVisionRef" class="nv-night-overlay">
      <img :src="sceneSrc" class="nv-img nv-img-night" crossorigin="anonymous" />
      <div class="nv-night-tint"></div>
    </div>

    <!-- ==================== Layer 3: 热成像 Canvas (预渲染, 替代显示) ==================== -->
    <canvas ref="thermalCanvasRef" class="nv-thermal-canvas"></canvas>

    <!-- ==================== Layer 4: 扫描线 ==================== -->
    <div ref="scanLinesRef" class="nv-scanlines">
      <div ref="scanBarRef" class="nv-scanbar"></div>
    </div>

    <!-- ==================== Layer 5: HUD 界面 ==================== -->
    <div ref="hudRef" class="nv-hud">
      <!-- 四角 -->
      <div class="nv-corner nv-corner-tl"></div>
      <div class="nv-corner nv-corner-tr"></div>
      <div class="nv-corner nv-corner-bl"></div>
      <div class="nv-corner nv-corner-br"></div>

      <!-- 十字准星 -->
      <div ref="crosshairRef" class="nv-crosshair">
        <span class="nv-ch-h"></span>
        <span class="nv-ch-v"></span>
        <span class="nv-ch-ring"></span>
      </div>

      <!-- 模式标签 -->
      <div class="nv-mode-tag">
        <span ref="modeTextRef" class="nv-mode-text">NORMAL</span>
        <span ref="modeDescRef" class="nv-mode-desc">可见光 · 全光谱</span>
      </div>

      <!-- 右上数据 -->
      <div ref="dataPanelRef" class="nv-data">
        <div class="nv-data-item"><b>SYS</b> <span ref="sysRef">ONLINE</span></div>
        <div class="nv-data-item"><b>IR</b> <span ref="irRef">0.00</span></div>
        <div class="nv-data-item"><b>GAIN</b> <span ref="gainRef">1.0x</span></div>
        <div class="nv-data-item"><b>μW</b> <span ref="thermalRef">0.0</span></div>
      </div>
    </div>

    <!-- ==================== Layer 6: 温度标记 ==================== -->
    <div ref="hotspotsRef" class="nv-hotspots">
      <div v-for="i in 3" :key="i" :ref="(el) => { if (el) spotRefs[i-1] = el as HTMLElement }" :class="`nv-spot nv-spot-${i}`">
        <span class="nv-spot-dot"></span>
        <span class="nv-spot-ring"></span>
        <span class="nv-spot-temp">{{ ['38°', '47°', '62°'][i-1] }}</span>
      </div>
    </div>

    <!-- ==================== Layer 7: 噪点 ==================== -->
    <div ref="noiseRef" class="nv-noise-layer">
      <svg viewBox="0 0 200 200" preserveAspectRatio="none">
        <rect width="100%" height="100%" filter="url(#nv-noise)" />
      </svg>
    </div>

    <!-- ==================== Layer 8: 暗角 ==================== -->
    <div ref="vignetteRef" class="nv-vignette-layer"></div>

    <!-- ==================== 底部信息 ==================== -->
    <div ref="infoRef" class="nv-info">
      <span class="nv-info-tag">NIGHT VISION SYSTEM</span>
      <h2 class="nv-info-title">三重视觉模式切换</h2>
      <div class="nv-info-line"></div>
      <span ref="infoSpecsRef" class="nv-info-data">模式 NORMAL · IR 0% · 增益 1.0x</span>
    </div>

    <!-- ==================== 进度条 ==================== -->
    <div ref="progressRef" class="nv-bar">
      <div ref="progressBarRef" class="nv-bar-fill"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void

// ---- 模板引用 ----
const parentRef = ref<HTMLElement | null>(null)
const baseImgRef = ref<HTMLElement | null>(null)
const nightVisionRef = ref<HTMLElement | null>(null)
const thermalCanvasRef = ref<HTMLCanvasElement | null>(null)
const scanLinesRef = ref<HTMLElement | null>(null)
const scanBarRef = ref<HTMLElement | null>(null)
const hudRef = ref<HTMLElement | null>(null)
const crosshairRef = ref<HTMLElement | null>(null)
const modeTextRef = ref<HTMLElement | null>(null)
const modeDescRef = ref<HTMLElement | null>(null)
const dataPanelRef = ref<HTMLElement | null>(null)
const sysRef = ref<HTMLElement | null>(null)
const irRef = ref<HTMLElement | null>(null)
const gainRef = ref<HTMLElement | null>(null)
const thermalRef = ref<HTMLElement | null>(null)
const hotspotsRef = ref<HTMLElement | null>(null)
const noiseRef = ref<HTMLElement | null>(null)
const vignetteRef = ref<HTMLElement | null>(null)
const infoRef = ref<HTMLElement | null>(null)
const infoSpecsRef = ref<HTMLElement | null>(null)
const progressRef = ref<HTMLElement | null>(null)
const progressBarRef = ref<HTMLElement | null>(null)
const spotRefs = ref<HTMLElement[]>([])

const cleanupFns: TweenCleanup[] = []
const sceneSrc = 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1400&q=80'

let canvasW = 0
let canvasH = 0
let thermalReady = false

// ======== 预渲染热成像 ========
const renderThermal = () => {
  const canvas = thermalCanvasRef.value
  if (!canvas) return

  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.src = sceneSrc
  img.onload = () => {
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return

    canvas.width = canvasW
    canvas.height = canvasH

    // cover 模式绘制
    const s = Math.max(canvasW / img.width, canvasH / img.height)
    const dw = img.width * s
    const dh = img.height * s
    const dx = (canvasW - dw) / 2
    const dy = (canvasH - dh) / 2
    ctx.drawImage(img, dx, dy, dw, dh)

    const imgData = ctx.getImageData(0, 0, canvasW, canvasH)
    const d = imgData.data

    for (let i = 0; i < d.length; i += 4) {
      const lum = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]
      const t = lum / 255

      let rr: number, gg: number, bb: number
      if (t < 0.2) {
        const s = t / 0.2
        rr = 0 + s * 30; gg = 0 + s * 8; bb = 40 + s * 80
      } else if (t < 0.4) {
        const s = (t - 0.2) / 0.2
        rr = 30 + s * 180; gg = 8 + s * 15; bb = 120 - s * 70
      } else if (t < 0.6) {
        const s = (t - 0.4) / 0.2
        rr = 210 + s * 45; gg = 23 + s * 120; bb = 50 - s * 35
      } else if (t < 0.8) {
        const s = (t - 0.6) / 0.2
        rr = 255; gg = 143 + s * 90; bb = 15 + s * 25
      } else {
        const s = (t - 0.8) / 0.2
        rr = 255; gg = 233 + s * 22; bb = 40 + s * 210
      }

      d[i] = Math.min(255, Math.max(0, Math.round(rr)))
      d[i + 1] = Math.min(255, Math.max(0, Math.round(gg)))
      d[i + 2] = Math.min(255, Math.max(0, Math.round(bb)))
    }

    ctx.putImageData(imgData, 0, 0)
    thermalReady = true
  }
}

// ======== 启动 ========
onMounted(() => {
  if (!parentRef.value) return
  requestAnimationFrame(() => setup())
})

const setup = () => {
  const c = parentRef.value!
  canvasW = window.innerWidth
  canvasH = window.innerHeight
  renderThermal()

  // ---- 初始：正常模式可见，其他层隐藏 ----
  gsap.set(baseImgRef.value, { opacity: 1 })
  gsap.set(nightVisionRef.value, { opacity: 0 })
  gsap.set(thermalCanvasRef.value, { opacity: 0 })
  gsap.set(scanLinesRef.value, { opacity: 0 })
  gsap.set(scanBarRef.value, { top: '10%' })
  gsap.set(hudRef.value, { opacity: 0.35 })
  gsap.set(crosshairRef.value, { opacity: 0.12, scale: 0.75 })
  gsap.set(hotspotsRef.value, { opacity: 0 })
  gsap.set(noiseRef.value, { opacity: 0 })
  gsap.set(vignetteRef.value, { opacity: 0.15 })
  gsap.set(infoRef.value, { opacity: 0, y: 12 })
  gsap.set(progressBarRef.value, { width: '0%' })
  spotRefs.value.forEach((el) => gsap.set(el, { opacity: 0, scale: 0.4 }))

  // ---- 主时间线 ----
  const tl = gsap.timeline({
    scrollTrigger: { trigger: c, start: 'top 85%', end: 'bottom 15%', scrub: 1.2 },
  })

  tl.to(
    {},
    {
      duration: 1,
      onUpdate: () => {
        const p = Math.max(0, Math.min(1, tl.progress()))

        // ====== 三段权重 ======
        const nvIn    = Math.min(p / 0.25, 1)                               // 夜视渐入 0→1
        const nvPeak  = p > 0.2 ? Math.min((p - 0.2) / 0.15, 1) : 0        // 夜视峰值
        const nvFade  = p > 0.55 ? 1 - Math.min((p - 0.55) / 0.35, 1) : 1  // 夜视消退 1→0
        const thIn    = p > 0.5 ? Math.min((p - 0.5) / 0.4, 1) : 0          // 热成像渐入

        const nvOpacity = nvIn * nvFade
        const thOpacity = thIn

        // ====== Layer 1: 正常模式 — 夜视渐入时变暗褪色 ======
        const baseEl = baseImgRef.value
        if (baseEl) {
          const dim = 1 - nvPeak * 0.3 - thIn * 0.1
          baseEl.style.opacity = String(Math.max(0.65, dim))
          baseEl.style.filter = `saturate(${1 - nvPeak * 0.7 - thIn * 0.2}) brightness(${1 - nvPeak * 0.15 - thIn * 0.1})`
        }

        // ====== Layer 2: 夜视覆盖 ======
        const nvEl = nightVisionRef.value
        if (nvEl) {
          nvEl.style.opacity = String(Math.max(0, Math.min(1, nvOpacity)))
        }

        // ====== Layer 3: 热成像 ======
        const thEl = thermalCanvasRef.value
        if (thEl && thermalReady) {
          thEl.style.opacity = String(Math.max(0, Math.min(1, thOpacity)))
        }

        // ====== Layer 4: 扫描线 + 扫描条 ======
        const slEl = scanLinesRef.value
        if (slEl) slEl.style.opacity = String(nvPeak * nvFade * 0.8)

        const sbEl = scanBarRef.value
        if (sbEl) {
          const barY = 10 + ((p * 1200) % 80)
          sbEl.style.top = `${barY}%`
        }

        // ====== Layer 5: HUD ======
        const hudEl = hudRef.value
        if (hudEl) {
          hudEl.style.opacity = String(0.35 + nvPeak * 0.5 * nvFade + thIn * 0.5)
          const r = 80 + thIn * 175
          const g = 180 + nvPeak * 40 * nvFade - thIn * 100
          const bb = 180 - nvPeak * 40 - thIn * 150
          hudEl.style.setProperty('--hud', `rgba(${r},${g},${bb},0.75)`)
        }

        // 十字准星
        const chEl = crosshairRef.value
        if (chEl) {
          chEl.style.opacity = String(0.12 + nvPeak * nvFade * 0.6 + thIn * 0.5)
          chEl.style.transform = `scale(${0.75 + nvPeak * nvFade * 0.25})`
        }

        // 模式标签
        let mode = 'NORMAL', desc = '可见光 · 全光谱', color = 'rgba(200,225,255,1)'
        if (thIn > 0.45) {
          mode = 'THERMAL'; desc = '热成像 · 红外测温'; color = `rgba(255,${Math.round(150 - thIn * 40)},${Math.round(30 + thIn * 30)},1)`
        } else if (nvIn > 0.4) {
          mode = 'NIGHT'; desc = '夜视 · 磷光增强'; color = `rgba(${Math.round(40 + nvPeak * 30)},${Math.round(200 + nvPeak * 40)},${Math.round(60 + nvPeak * 50)},1)`
        }
        if (modeTextRef.value) { modeTextRef.value.textContent = mode; modeTextRef.value.style.color = color }
        if (modeDescRef.value) modeDescRef.value.textContent = desc

        // 数据面板
        const irVal = thIn * 0.92 + nvPeak * nvFade * 0.25
        const gainVal = 1 + nvPeak * nvFade * 2 + thIn * 1.5
        const thVal = thIn * 80 + nvPeak * nvFade * 15
        if (sysRef.value) sysRef.value.textContent = thIn > 0.3 ? 'IR-ACT' : nvIn > 0.3 ? 'NV-ACT' : 'ONLINE'
        if (irRef.value) irRef.value.textContent = irVal.toFixed(2)
        if (gainRef.value) gainRef.value.textContent = gainVal.toFixed(1) + 'x'
        if (thermalRef.value) thermalRef.value.textContent = thVal.toFixed(1)

        // ====== Layer 7: 噪点 ======
        if (noiseRef.value) noiseRef.value.style.opacity = String(nvPeak * nvFade * 0.5)

        // ====== Layer 8: 暗角 ======
        if (vignetteRef.value) vignetteRef.value.style.opacity = String(0.15 + nvPeak * nvFade * 0.25 + thIn * 0.15)

        // ====== 底部面板 ======
        if (infoSpecsRef.value) {
          infoSpecsRef.value.textContent = `模式 ${mode} · IR ${Math.round(irVal * 100)}% · 增益 ${gainVal.toFixed(1)}x`
        }
      },
    },
    0,
  )

  // 信息面板入场
  tl.to(infoRef.value, { opacity: 1, y: 0, duration: 0.1, ease: 'power2.out' }, 0.04)

  // 进度条
  tl.to(progressBarRef.value, { width: '100%', duration: 0.98, ease: 'none' }, 0.01)

  // 温度热点：热成像阶段依次弹出
  const spots = [
    { el: spotRefs.value[0] as HTMLElement, tIn: 0.52, tOut: 0.72 },
    { el: spotRefs.value[1] as HTMLElement, tIn: 0.6, tOut: 0.82 },
    { el: spotRefs.value[2] as HTMLElement, tIn: 0.68, tOut: 0.93 },
  ]
  for (const s of spots) {
    if (!s.el) continue
    tl.to(s.el, { opacity: 1, scale: 1, duration: 0.04, ease: 'power2.out' }, s.tIn)
    tl.to(s.el, { opacity: 0, scale: 0.4, duration: 0.06, ease: 'power2.in' }, s.tOut)
  }

  // 热点容器
  tl.to(hotspotsRef.value, { opacity: 1, duration: 0.02 }, 0.5)
  tl.to(hotspotsRef.value, { opacity: 0, duration: 0.02 }, 0.94)

  cleanupFns.push(() => {
    tl.scrollTrigger?.kill()
    tl.kill()
  })
}

// ---- 窗口缩放 ----
let rt: number | null = null
window.addEventListener('resize', () => {
  if (rt) clearTimeout(rt)
  rt = window.setTimeout(() => {
    canvasW = window.innerWidth
    canvasH = window.innerHeight
    renderThermal()
  }, 400)
})

onUnmounted(() => {
  if (rt) clearTimeout(rt)
  cleanupFns.forEach((f) => f())
})
</script>

<style lang="scss" scoped>
/* ========== 容器 ========== */
.nv-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #010103;
}

.nv-svg-defs {
  position: absolute;
  width: 0;
  height: 0;
  pointer-events: none;
}

.nv-img {
  display: block;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
}

/* ========== Layer 1: 基础图 ========== */
.nv-base {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.nv-base img {
  transition: filter 0.15s linear;
}

/* ========== Layer 2: 夜视覆盖 ========== */
.nv-night-overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  mix-blend-mode: screen;
  /* CSS 滤镜链制造绿色夜视效果 */
  .nv-img-night {
    filter: grayscale(1) brightness(1.5) contrast(1.15);
  }
}

.nv-night-tint {
  position: absolute;
  inset: 0;
  background: rgba(10, 255, 30, 0.13);
  pointer-events: none;
}

/* ========== Layer 3: 热成像 ========== */
.nv-thermal-canvas {
  position: absolute;
  inset: 0;
  z-index: 3;
  width: 100%;
  height: 100%;
}

/* ========== Layer 4: 扫描线 ========== */
.nv-scanlines {
  position: absolute;
  inset: 0;
  z-index: 4;
  pointer-events: none;
  overflow: hidden;
  /* 密集水平扫描线 */
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 255, 30, 0.04) 2px,
    rgba(0, 255, 30, 0.04) 4px
  );
}

.nv-scanbar {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: rgba(0, 255, 20, 0.35);
  box-shadow:
    0 -1px 8px rgba(0, 255, 0, 0.25),
    0 1px 8px rgba(0, 255, 0, 0.25),
    0 0 2px rgba(0, 255, 0, 0.6);
}

/* ========== Layer 5: HUD ========== */
.nv-hud {
  --hud: rgba(80, 180, 180, 0.75);
  position: absolute;
  inset: 0;
  z-index: 10;
  pointer-events: none;
}

/* 四角 */
.nv-corner {
  position: absolute;
  width: 36px;
  height: 36px;
}
.nv-corner-tl { top: 14px; left: 14px; border-top: 2px solid var(--hud); border-left: 2px solid var(--hud); }
.nv-corner-tr { top: 14px; right: 14px; border-top: 2px solid var(--hud); border-right: 2px solid var(--hud); }
.nv-corner-bl { bottom: 14px; left: 14px; border-bottom: 2px solid var(--hud); border-left: 2px solid var(--hud); }
.nv-corner-br { bottom: 14px; right: 14px; border-bottom: 2px solid var(--hud); border-right: 2px solid var(--hud); }

/* 十字准星 */
.nv-crosshair {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 130px; height: 130px;
}
.nv-ch-h {
  position: absolute; top: 50%; left: 0; right: 0; height: 1px;
  background: var(--hud); transform: translateY(-50%);
}
.nv-ch-v {
  position: absolute; left: 50%; top: 0; bottom: 0; width: 1px;
  background: var(--hud); transform: translateX(-50%);
}
.nv-ch-ring {
  position: absolute; top: 50%; left: 50%; width: 28px; height: 28px;
  transform: translate(-50%, -50%);
  border: 1px solid var(--hud); border-radius: 50%;
}

/* 模式标签 */
.nv-mode-tag {
  position: absolute;
  top: 26px; left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}
.nv-mode-text {
  font-family: 'Courier New', monospace;
  font-size: 14px; font-weight: 700; letter-spacing: 6px;
  color: rgba(200, 225, 255, 1);
  text-shadow: 0 0 10px rgba(80, 200, 255, 0.3);
  transition: color 0.3s;
}
.nv-mode-desc {
  font-family: 'Courier New', monospace;
  font-size: 9px; letter-spacing: 2px;
  color: rgba(170, 210, 230, 0.45);
}

/* 数据面板 */
.nv-data {
  position: absolute;
  top: 26px; right: 26px;
  display: flex; flex-direction: column; gap: 5px;
  min-width: 130px;
}
.nv-data-item {
  display: flex; justify-content: space-between; gap: 18px;
  font-family: 'Courier New', monospace; font-size: 10px;
  color: var(--hud);
  b { font-weight: 700; letter-spacing: 2px; }
  span { color: rgba(220, 240, 255, 0.7); letter-spacing: 1px; }
}

/* ========== Layer 6: 温度标记 ========== */
.nv-hotspots {
  position: absolute;
  inset: 0; z-index: 8;
  pointer-events: none;
}
.nv-spot {
  position: absolute;
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  transform: translate(-50%, -50%);
}
.nv-spot-1 { left: 30%; top: 32%; }
.nv-spot-2 { left: 60%; top: 55%; }
.nv-spot-3 { left: 74%; top: 25%; }

.nv-spot-dot {
  display: block; width: 8px; height: 8px;
  background: rgba(255, 80, 20, 0.9); border-radius: 50%;
  box-shadow: 0 0 14px rgba(255, 60, 10, 0.7), 0 0 28px rgba(255, 40, 0, 0.35);
  animation: nv-dot 2s ease-in-out infinite;
}
.nv-spot-ring {
  position: absolute; top: -14px;
  display: block; width: 36px; height: 36px;
  border: 1.5px solid rgba(255, 80, 20, 0.35); border-radius: 50%;
  animation: nv-ring 2.4s ease-in-out infinite;
}
.nv-spot-temp {
  font-family: 'Courier New', monospace; font-size: 12px; font-weight: 700;
  color: rgba(255, 130, 30, 0.85);
  text-shadow: 0 0 8px rgba(255, 80, 20, 0.5);
}

@keyframes nv-dot {
  0%, 100% { transform: scale(1); opacity: 0.85; }
  50% { transform: scale(1.7); opacity: 0.5; }
}
@keyframes nv-ring {
  0%, 100% { transform: scale(1); opacity: 0.35; }
  50% { transform: scale(1.5); opacity: 0.08; }
}

/* ========== Layer 7: 噪点 ========== */
.nv-noise-layer {
  position: absolute; inset: 0; z-index: 6;
  pointer-events: none;
  mix-blend-mode: screen;
  svg { width: 100%; height: 100%; }
}

/* ========== Layer 8: 暗角 ========== */
.nv-vignette-layer {
  position: absolute; inset: 0; z-index: 9;
  pointer-events: none;
  background: radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 82%, rgba(0,0,0,0.85) 100%);
}

/* ========== 底部信息 ========== */
.nv-info {
  position: absolute;
  left: 28px; bottom: 36px;
  z-index: 12;
  display: flex; flex-direction: column; gap: 4px;
}
.nv-info-tag {
  font-family: 'Courier New', monospace; font-size: 10px; font-weight: 600;
  letter-spacing: 4px; color: rgba(100, 200, 180, 0.5);
}
.nv-info-title {
  margin: 0;
  font-size: 24px; font-weight: 700; letter-spacing: 2px;
  color: rgba(200, 240, 230, 0.9);
  text-shadow: 0 0 16px rgba(80, 200, 180, 0.15);
}
.nv-info-line {
  width: 40px; height: 2px;
  background: linear-gradient(90deg, rgba(80,200,180,0.7), rgba(60,160,140,0.4));
}
.nv-info-data {
  font-family: 'Courier New', monospace; font-size: 10px;
  color: rgba(140, 210, 200, 0.5); letter-spacing: 1px;
}

/* ========== 进度条 ========== */
.nv-bar {
  position: absolute; left: 0; right: 0; bottom: 0; z-index: 20;
  height: 3px; background: rgba(80, 180, 160, 0.06);
}
.nv-bar-fill {
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(80,180,160,0.5) 0%,
    rgba(30,220,100,0.8) 50%,
    rgba(255,140,30,0.8) 75%,
    rgba(255,70,10,0.5) 100%
  );
}
</style>
