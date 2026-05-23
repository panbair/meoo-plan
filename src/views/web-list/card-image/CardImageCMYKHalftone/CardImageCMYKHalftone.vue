<template>
  <section ref="sectionRef" class="halftone-section">
    <!-- 白色纸底 -->
    <div class="paper-bg"></div>

    <!-- 网点拼合舞台 -->
    <div class="halftone-stage">
      <!-- 鬼影参考底图（网点散落时可见，拼合后淡出） -->
      <img ref="ghostRef" :src="imageUrl" alt="" class="ghost-image" />

      <!-- C 青色层 (15°) -->
      <canvas ref="canvasCRef" class="halftone-canvas c-layer"></canvas>
      <!-- M 品红层 (75°) -->
      <canvas ref="canvasMRef" class="halftone-canvas m-layer"></canvas>
      <!-- Y 黄色层 (0°) -->
      <canvas ref="canvasYRef" class="halftone-canvas y-layer"></canvas>
      <!-- K 黑色层 (45°) -->
      <canvas ref="canvasKRef" class="halftone-canvas k-layer"></canvas>
    </div>

    <!-- 印刷套准标记 -->
    <div ref="regMarksRef" class="registration-marks">
      <span class="reg-mark reg-tl"></span>
      <span class="reg-mark reg-tr"></span>
      <span class="reg-mark reg-bl"></span>
      <span class="reg-mark reg-br"></span>
    </div>

    <!-- 放大镜装饰 -->
    <div ref="loupeRef" class="loupe-decoration">
      <svg viewBox="0 0 140 140" class="loupe-svg">
        <circle cx="58" cy="58" r="44" fill="none" stroke="#a09880" stroke-width="3.5" opacity="0.45" />
        <circle cx="58" cy="58" r="42" fill="rgba(220,210,190,0.04)" />
        <line x1="90" y1="90" x2="124" y2="124" stroke="#a09880" stroke-width="5" stroke-linecap="round" opacity="0.4" />
        <!-- 镜头内部十字线 -->
        <line x1="58" y1="24" x2="58" y2="92" stroke="#a09880" stroke-width="0.6" opacity="0.2" />
        <line x1="24" y1="58" x2="92" y2="58" stroke="#a09880" stroke-width="0.6" opacity="0.2" />
      </svg>
    </div>

    <!-- 文字覆盖层 -->
    <div ref="contentRef" class="content-overlay">
      <h2 class="title">CMYK Halftone</h2>
      <p class="subtitle">Four-Color Process · Screen Angles</p>
      <div class="divider"></div>
      <p class="desc">CYC15° · MG75° · YLW0° · BLK45°</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []

const imageUrl = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80'

// ==================== Refs ====================
const sectionRef   = ref<HTMLElement | null>(null)
const ghostRef     = ref<HTMLImageElement | null>(null)
const canvasCRef   = ref<HTMLCanvasElement | null>(null)
const canvasMRef   = ref<HTMLCanvasElement | null>(null)
const canvasYRef   = ref<HTMLCanvasElement | null>(null)
const canvasKRef   = ref<HTMLCanvasElement | null>(null)
const regMarksRef  = ref<HTMLElement | null>(null)
const loupeRef     = ref<HTMLElement | null>(null)
const contentRef   = ref<HTMLElement | null>(null)

// ==================== 网点参数 ====================
const RES   = 420       // 内部生成分辨率
const BLOCK = 7         // 网点单元格大小 (60×60 cells)

/** RGB → CMYK 标准转换 */
function rgbToCmyk(r: number, g: number, b: number): { c: number; m: number; y: number; k: number } {
  const rn = r / 255, gn = g / 255, bn = b / 255
  const k = 1 - Math.max(rn, gn, bn)
  if (k >= 0.999) return { c: 0, m: 0, y: 0, k: 255 }
  const d = 1 - k
  const c = (1 - rn - k) / d
  const m = (1 - gn - k) / d
  const y = (1 - bn - k) / d
  return {
    c: Math.round(Math.max(0, Math.min(1, c)) * 255),
    m: Math.round(Math.max(0, Math.min(1, m)) * 255),
    y: Math.round(Math.max(0, Math.min(1, y)) * 255),
    k: Math.round(Math.max(0, Math.min(1, k)) * 255),
  }
}

// ==================== 网点绘制 ====================
async function generateHalftones() {
  // 加载原图
  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.src = imageUrl
  try { await img.decode() } catch { return }

  // 离屏 Canvas 采样像素
  const offscreen = document.createElement('canvas')
  offscreen.width = RES
  offscreen.height = RES
  const offCtx = offscreen.getContext('2d')!
  offCtx.drawImage(img, 0, 0, RES, RES)
  const imageData = offCtx.getImageData(0, 0, RES, RES)

  // 四色配置
  const channels = [
    { key: 'c', ref: canvasCRef, angle: 15 * Math.PI / 180, color: '#00AEEF' },
    { key: 'm', ref: canvasMRef, angle: 75 * Math.PI / 180, color: '#EC008C' },
    { key: 'y', ref: canvasYRef, angle: 0,                      color: '#FFED00' },
    { key: 'k', ref: canvasKRef, angle: 45 * Math.PI / 180, color: '#1A1A1A' },
  ] as const

  const maxRadius = BLOCK * 0.48
  const halfLen = Math.ceil(((RES / BLOCK) * 0.85))

  for (const ch of channels) {
    const canvas = ch.ref.value
    if (!canvas) continue

    canvas.width = RES
    canvas.height = RES
    const ctx = canvas.getContext('2d')!
    ctx.imageSmoothingEnabled = true

    const cosA = Math.cos(ch.angle)
    const sinA = Math.sin(ch.angle)

    // 旋转网格采样（基向量在角度方向对齐）
    for (let i = -halfLen; i <= halfLen; i++) {
      for (let j = -halfLen; j <= halfLen; j++) {
        const gx = RES / 2 + i * BLOCK * cosA + j * BLOCK * sinA
        const gy = RES / 2 - i * BLOCK * sinA + j * BLOCK * cosA

        if (gx < 0 || gx >= RES - 1 || gy < 0 || gy >= RES - 1) continue

        const px = Math.round(gx), py = Math.round(gy)
        const idx = (py * RES + px) * 4
        const rv = imageData.data[idx]
        const gv = imageData.data[idx + 1]
        const bv = imageData.data[idx + 2]
        const cmyk = rgbToCmyk(rv, gv, bv)
        const val = cmyk[ch.key as keyof typeof cmyk]
        const intensity = val / 255

        if (intensity < 0.015) continue

        // 面积比例映射：radius = sqrt(intensity) * maxRadius
        const radius = Math.sqrt(intensity) * maxRadius

        ctx.beginPath()
        ctx.arc(gx, gy, Math.max(0.4, radius), 0, Math.PI * 2)
        ctx.fillStyle = ch.color
        ctx.fill()
      }
    }
  }
}

// ==================== 挂载 ====================
onMounted(async () => {
  if (!sectionRef.value) return

  // 先生成所有网点
  await generateHalftones()

  const canvasC = canvasCRef.value
  const canvasM = canvasMRef.value
  const canvasY = canvasYRef.value
  const canvasK = canvasKRef.value

  // ========== 初始化位置：四色层从四角偏移 ==========
  if (canvasC) gsap.set(canvasC, { x: '-120%', y: '-120%', rotate: -6 })
  if (canvasM) gsap.set(canvasM, { x: '120%',  y: '-120%', rotate: 6 })
  if (canvasY) gsap.set(canvasY, { x: '-120%', y: '120%',  rotate: 5 })
  if (canvasK) gsap.set(canvasK, { x: '120%',  y: '120%',  rotate: -5 })

  // ========== 四色滑入叠合（stagger 分批到达） ==========
  if ([canvasC, canvasM, canvasY, canvasK].some(Boolean)) {
    const slideTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 75%',
        end: 'top 28%',
        scrub: 1.2,
      },
    })
    slideTl
      .to(canvasC, { x: '0%', y: '0%', rotate: 0, duration: 0.55, ease: 'power2.out' }, 0)
      .to(canvasM, { x: '0%', y: '0%', rotate: 0, duration: 0.55, ease: 'power2.out' }, 0.08)
      .to(canvasY, { x: '0%', y: '0%', rotate: 0, duration: 0.55, ease: 'power2.out' }, 0.13)
      .to(canvasK, { x: '0%', y: '0%', rotate: 0, duration: 0.55, ease: 'power2.out' }, 0.18)
      // 末尾微小套准抖动（模拟印刷误差）
      .to(canvasM, { x: '0.25%', y: '-0.15%', duration: 0.03 }, 0.88)
      .to(canvasY, { x: '-0.2%', y: '0.2%', duration: 0.03 }, 0.90)
      .to(canvasM, { x: '0%',   y: '0%',    duration: 0.04 }, 0.94)
      .to(canvasY, { x: '0%',   y: '0%',    duration: 0.04 }, 0.96)
    cleanupFns.push(() => { slideTl.scrollTrigger?.kill(); slideTl.kill() })
  }

  // ========== 鬼影底图淡出 ==========
  if (ghostRef.value) gsap.set(ghostRef.value, { opacity: 0.3 })
  if (ghostRef.value) {
    const ghostSt = ScrollTrigger.create({
      trigger: sectionRef.value,
      start: 'top 75%',
      end: 'top 35%',
      scrub: 1.5,
      onUpdate(self) {
        if (ghostRef.value) ghostRef.value.style.opacity = String(0.3 * (1 - self.progress))
      },
    })
    cleanupFns.push(() => ghostSt.kill())
  }

  // ========== 套准标记渐显 ==========
  if (regMarksRef.value) gsap.set(regMarksRef.value, { opacity: 0, scale: 0.7 })
  if (regMarksRef.value) {
    const marksTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 52%',
        end: 'top 30%',
        scrub: 0.8,
      },
    })
    marksTl.to(regMarksRef.value, { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' })
    cleanupFns.push(() => { marksTl.scrollTrigger?.kill(); marksTl.kill() })
  }

  // ========== 放大镜渐显 ==========
  if (loupeRef.value) gsap.set(loupeRef.value, { opacity: 0, scale: 0.6, rotate: -15 })
  if (loupeRef.value) {
    const loupeTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 46%',
        end: 'top 24%',
        scrub: 0.9,
      },
    })
    loupeTl.to(loupeRef.value, { opacity: 0.5, scale: 1, rotate: 0, duration: 0.7, ease: 'back.out(1.6)' })
    cleanupFns.push(() => { loupeTl.scrollTrigger?.kill(); loupeTl.kill() })
  }

  // ========== 文字渐显 ==========
  if (contentRef.value) gsap.set(contentRef.value, { opacity: 0, y: 20 })
  if (contentRef.value) {
    const textTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 56%',
        end: 'top 22%',
        scrub: 1.0,
      },
    })
    textTl.to(contentRef.value, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' })
    cleanupFns.push(() => { textTl.scrollTrigger?.kill(); textTl.kill() })
  }
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
})
</script>

<style lang="scss" scoped>
/* ==================== 容器 ==================== */
.halftone-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #f8f6f0;
}

/* ==================== 白色纸底 ==================== */
.paper-bg {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background:
    radial-gradient(ellipse 55% 45% at 50% 52%, #fefdfb 0%, transparent 55%),
    radial-gradient(ellipse 70% 60% at 45% 48%, rgba(245, 240, 230, 0.5) 0%, transparent 70%),
    linear-gradient(180deg, #faf8f3 0%, #f4f1eb 40%, #f0ede5 100%);
  // 纸张纤维纹理
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background:
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(0,0,0,0.007) 2px,
        rgba(0,0,0,0.007) 3px
      );
  }
}

/* ==================== 网点舞台 ==================== */
.halftone-stage {
  position: absolute;
  top: 50%;
  left: 50%;
  width: min(72vmin, 700px);
  height: min(72vmin, 700px);
  transform: translate(-50%, -50%);
  z-index: 3;
  background: #fefefe;
  box-shadow: 0 0 0 1px rgba(0,0,0,0.04), 0 4px 20px rgba(0,0,0,0.06);
}

/* 鬼影底图 */
.ghost-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.3;
  filter: saturate(0.6) brightness(1.05);
  z-index: 1;
  pointer-events: none;
  will-change: opacity;
}

/* Canvas 网点层 */
.halftone-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  // 四色层覆盖时自然形成全彩效果
}

.c-layer { mix-blend-mode: multiply; z-index: 3; }
.m-layer { mix-blend-mode: multiply; z-index: 4; }
.y-layer { mix-blend-mode: multiply; z-index: 5; }
.k-layer { mix-blend-mode: multiply; z-index: 6; }

/* ==================== 套准标记 ==================== */
.registration-marks {
  position: absolute;
  top: 50%;
  left: 50%;
  width: min(72vmin, 685px);
  height: min(72vmin, 685px);
  transform: translate(-50%, -50%);
  z-index: 7;
  pointer-events: none;
}

.reg-mark {
  position: absolute;
  width: 18px;
  height: 18px;
  
  &::before, &::after {
    content: '';
    position: absolute;
    background: #1a1a1a;
    opacity: 0.55;
  }
  // 水平线
  &::before {
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    transform: translateY(-50%);
  }
  // 垂直线
  &::after {
    left: 50%;
    top: 0;
    bottom: 0;
    width: 1px;
    transform: translateX(-50%);
  }
}

.reg-tl { top: -14px;  left: -14px; }
.reg-tr { top: -14px;  right: -14px; }
.reg-bl { bottom: -14px; left: -14px; }
.reg-br { bottom: -14px; right: -14px; }

/* ==================== 放大镜装饰 ==================== */
.loupe-decoration {
  position: absolute;
  left: 8%;
  bottom: 10%;
  width: clamp(70px, 12vmin, 120px);
  height: clamp(70px, 12vmin, 120px);
  z-index: 15;
  pointer-events: none;
  opacity: 0;
}

.loupe-svg {
  width: 100%;
  height: 100%;
}

/* ==================== 文字覆盖层 ==================== */
.content-overlay {
  position: absolute;
  right: 7%;
  bottom: 9%;
  z-index: 20;
  text-align: right;
  pointer-events: none;
}

.title {
  font-family: 'Georgia', 'Times New Roman', serif;
  font-size: clamp(2rem, 4.8vw, 3.6rem);
  font-weight: 700;
  letter-spacing: 0.06em;
  color: #2a2520;
  margin: 0;
  text-shadow:
    0 1px 2px rgba(0,0,0,0.06),
    0 0 40px rgba(0, 0, 0, 0.04);
  line-height: 1.1;
}

.subtitle {
  font-family: 'Georgia', 'Times New Roman', serif;
  font-size: clamp(0.78rem, 1.5vw, 1.1rem);
  font-style: italic;
  color: #6b6358;
  margin: 5px 0 0;
  letter-spacing: 0.04em;
}

.divider {
  width: 100px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(60,50,40,0.25), rgba(40,35,30,0.1));
  margin: 10px 0 10px auto;
}

.desc {
  font-family: 'Georgia', 'Times New Roman', 'SimSun', serif;
  font-size: clamp(0.68rem, 1.1vw, 0.85rem);
  color: #8a8070;
  margin: 0;
  letter-spacing: 0.03em;
  line-height: 1.6;
}
</style>
