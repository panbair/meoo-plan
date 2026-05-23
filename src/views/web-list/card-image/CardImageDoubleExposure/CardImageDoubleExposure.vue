<template>
  <section ref="parentRef" class="de-container">
    <!-- ==================== SVG 滤镜 & 蒙版定义 ==================== -->
    <svg class="de-svg-defs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" aria-hidden="true">
      <defs>
        <!-- === 亮度提取 + 反转 + 对比度增强：生成双曝光人像轮廓蒙版 === -->
        <filter id="exposure-luminance" x="-5%" y="-5%" width="110%" height="110%"
          color-interpolation-filters="sRGB">
          <!-- 步骤1：提取亮度值（ITU-R BT.709 权重） -->
          <feColorMatrix
            type="matrix"
            values="0.2126 0.7152 0.0722 0 0
                    0.2126 0.7152 0.0722 0 0
                    0.2126 0.7152 0.0722 0 0
                    0       0       0       1 0"
            in="SourceGraphic"
            result="grayscale"
          />
          <!-- 步骤2：反转亮度（暗部→亮部=不透明，亮部→暗部=透明） -->
          <feColorMatrix
            type="matrix"
            values="-1 0 0 0 1
                     0 -1 0 0 1
                     0 0 -1 0 1
                     0 0 0 1 0"
            in="grayscale"
            result="inverted"
          />
          <!-- 步骤3：对比度增强 + 阈值压缩，锐化轮廓边缘 -->
          <feComponentTransfer in="inverted" result="contrast">
            <feFuncR type="linear" slope="2.2" intercept="-0.45" />
            <feFuncG type="linear" slope="2.2" intercept="-0.45" />
            <feFuncB type="linear" slope="2.2" intercept="-0.45" />
          </feComponentTransfer>
        </filter>

        <!-- === 蒙版：黑色=透明（显示背后风景），白色=不透明（人像剪影区域） === -->
        <mask id="exposure-mask" maskUnits="objectBoundingBox">
          <!-- 覆盖层：白色=全幅可见，随滚动过程 opacity 被 GSAP 控制渐变 → transparent -->
          <rect x="0" y="0" width="1" height="1" fill="white"
            class="mask-base-rect"
          />
          <!-- 反转蒙版：黑色区域（人像背景部分）置于下方，遮挡白色覆盖 -->
          <image
            x="0" y="0" width="1" height="1"
            preserveAspectRatio="xMidYMid slice"
            class="mask-portrait-img"
            filter="url(#exposure-luminance)"
          />
        </mask>

        <!-- === 胶片颗粒噪点纹理 === -->
        <filter id="film-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            seed="3"
            result="noise"
          />
          <feColorMatrix
            type="saturate"
            values="0"
            in="noise"
            result="mono-noise"
          />
          <feComponentTransfer in="mono-noise" result="grain">
            <feFuncR type="linear" slope="0.08" />
            <feFuncG type="linear" slope="0.08" />
            <feFuncB type="linear" slope="0.08" />
            <feFuncA type="linear" slope="0.2" />
          </feComponentTransfer>
        </filter>

        <!-- === 人像边缘柔光（羽化效果） === -->
        <filter id="edge-glow" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <!-- === 动态模糊（用于过渡时的场景溶解） === -->
        <filter id="scene-blur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0" />
        </filter>

        <!-- === 暗角效果 === -->
        <radialGradient id="vignette-grad" cx="50%" cy="50%" r="70%">
          <stop offset="40%" stop-color="rgba(0,0,0,0)" />
          <stop offset="75%" stop-color="rgba(0,0,0,0.15)" />
          <stop offset="100%" stop-color="rgba(0,0,0,0.5)" />
        </radialGradient>

        <!-- === 漏光渐变（模拟胶片漏光） === -->
        <linearGradient id="light-leak-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="rgba(255,200,100,0)" />
          <stop offset="50%" stop-color="rgba(255,180,80,0.12)" />
          <stop offset="100%" stop-color="rgba(255,120,40,0)" />
        </linearGradient>

        <linearGradient id="light-leak-2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="rgba(100,180,255,0)" />
          <stop offset="60%" stop-color="rgba(80,150,255,0.08)" />
          <stop offset="100%" stop-color="rgba(60,100,255,0)" />
        </linearGradient>
      </defs>
    </svg>

    <!-- ==================== Layer 1: 背景风景图（底层全彩） ==================== -->
    <div ref="bgLayerRef" class="de-bg-layer">
      <img :src="landscapeUrl" alt="landscape" class="de-img" />
      <div class="de-vignette-bg"></div>
    </div>

    <!-- ==================== Layer 2: 前景人像图（蒙版裁剪 + 动态混合模式） ==================== -->
    <div ref="fgLayerRef" class="de-fg-layer">
      <img :src="portraitUrl" alt="portrait" class="de-img portrait-src" />
      <!-- 混合模式叠加层（用于 blend-mode 动画） -->
      <div ref="blendOverlayRef" class="de-blend-overlay">
        <img :src="portraitUrl" alt="portrait-blend" class="de-img" />
      </div>
      <!-- 色彩着色层（营造胶片色调） -->
      <div ref="toneRef" class="de-tone-overlay"></div>
    </div>

    <!-- ==================== Layer 3: 人像剪影边缘发光层（轮廓高光） ==================== -->
    <div ref="edgeGlowRef" class="de-edge-glow-layer">
      <img :src="portraitUrl" alt="" class="de-img" />
    </div>

    <!-- ==================== Layer 4: 胶片颗粒噪点层 ==================== -->
    <div ref="grainRef" class="de-grain-layer">
      <canvas ref="grainCanvasRef" class="de-grain-canvas"></canvas>
    </div>

    <!-- 漏光效果 -->
    <div ref="lightLeak1Ref" class="de-light-leak de-leak-1"></div>
    <div ref="lightLeak2Ref" class="de-light-leak de-leak-2"></div>

    <!-- 暗角框架 -->
    <div ref="vignetteRef" class="de-vignette"></div>

    <!-- ==================== Layer 5: 文字信息 ==================== -->
    <div ref="infoRef" class="de-info-layer">
      <span class="de-label">DOUBLE EXPOSURE</span>
      <h2 class="de-title">双重曝光</h2>
      <p class="de-subtitle">Portrait · Landscape · Fusion</p>
      <div class="de-divider"></div>
      <p class="de-desc">人像与风景的胶片融合</p>
    </div>

    <!-- 进度指示器 -->
    <div ref="progressRef" class="de-progress">
      <div ref="progressBarRef" class="de-progress-bar"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ======== 类型定义 ========
type TweenCleanup = () => void

// ======== 模板引用 ========
const parentRef = ref<HTMLElement | null>(null)
const bgLayerRef = ref<HTMLElement | null>(null)
const fgLayerRef = ref<HTMLElement | null>(null)
const blendOverlayRef = ref<HTMLElement | null>(null)
const toneRef = ref<HTMLElement | null>(null)
const edgeGlowRef = ref<HTMLElement | null>(null)
const grainRef = ref<HTMLElement | null>(null)
const grainCanvasRef = ref<HTMLCanvasElement | null>(null)
const lightLeak1Ref = ref<HTMLElement | null>(null)
const lightLeak2Ref = ref<HTMLElement | null>(null)
const vignetteRef = ref<HTMLElement | null>(null)
const infoRef = ref<HTMLElement | null>(null)
const progressRef = ref<HTMLElement | null>(null)
const progressBarRef = ref<HTMLElement | null>(null)

const cleanupFns: TweenCleanup[] = []

// ======== 图片资源 ========
// 风景图（背景层）：山脉湖泊日出全景
const landscapeUrl = 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1920&q=80'

// 人像图（前景层）：人物肖像特写
const portraitUrl = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1920&q=80'

// ======== 胶片颗粒 Canvas 绘制 ========
let grainAnimId = 0
const drawGrain = (canvas: HTMLCanvasElement, intensity: number) => {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const w = canvas.width
  const h = canvas.height
  const imageData = ctx.createImageData(w, h)
  const data = imageData.data

  for (let i = 0; i < w * h; i++) {
    const noise = (Math.random() * 255 * intensity) | 0
    const idx = i * 4
    data[idx] = noise
    data[idx + 1] = noise
    data[idx + 2] = noise
    data[idx + 3] = (noise * 0.3) | 0
  }

  ctx.putImageData(imageData, 0, 0)
}

const animateGrain = () => {
  const canvas = grainCanvasRef.value
  if (!canvas) return
  drawGrain(canvas, 0.35)
  grainAnimId = requestAnimationFrame(animateGrain)
}

// ======== 初始化 ========
onMounted(() => {
  if (!parentRef.value) return
  requestAnimationFrame(() => setup())
})

const setup = () => {
  const container = parentRef.value
  if (!container) return

  // ===== Canvas 初始化 =====
  const grainCanvas = grainCanvasRef.value
  if (grainCanvas) {
    grainCanvas.width = window.innerWidth
    grainCanvas.height = window.innerHeight
    animateGrain()
  }

  // ===== 初始状态 =====
  // 背景层：略微放大，制造缓慢的 Ken Burns 效果
  gsap.set(bgLayerRef.value, { scale: 1.08, filter: 'brightness(0.55) blur(1px)' })
  // 前景人像层：正常大小，蒙版不透明
  gsap.set(fgLayerRef.value, {
    opacity: 1,
    scale: 1,
    '-webkit-mask-image': 'url(#exposure-mask)',
    'mask-image': 'url(#exposure-mask)',
  })
  // 混合叠加层：multiply 模式
  gsap.set(blendOverlayRef.value, { opacity: 0.85, mixBlendMode: 'multiply' })
  // 色调层
  gsap.set(toneRef.value, { opacity: 0.6 })
  // 边缘发光：初始暗淡
  gsap.set(edgeGlowRef.value, {
    opacity: 0.15,
    '-webkit-mask-image': 'url(#exposure-mask)',
    'mask-image': 'url(#exposure-mask)',
  })
  // 漏光
  gsap.set(lightLeak1Ref.value, { opacity: 0.15 })
  gsap.set(lightLeak2Ref.value, { opacity: 0.08 })
  // 暗角
  gsap.set(vignetteRef.value, { opacity: 0.8 })
  // 颗粒层
  gsap.set(grainRef.value, { opacity: 0.55 })
  // 文字
  gsap.set(infoRef.value, { opacity: 0, y: 40 })
  // 进度条
  gsap.set(progressBarRef.value, { width: '0%' })

  // ===== 设置 SVG mask 中的图片源 =====
  const maskImg = container.querySelector('.mask-portrait-img') as SVGImageElement
  if (maskImg) {
    maskImg.setAttribute('href', portraitUrl)
  }

  // ===== 主时间线 =====
  const mainTl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top 85%',
      end: 'bottom 15%',
      scrub: 1.2,
    },
  })

  // ---- 阶段1 (0-12%): 初始双曝光状态稳固，微动 ----
  // 背景微亮
  mainTl.to(
    bgLayerRef.value,
    { filter: 'brightness(0.6) blur(0.8px)', scale: 1.07, duration: 0.12 },
    0,
  )

  // 人像蒙版层微缩
  mainTl.to(
    fgLayerRef.value,
    { scale: 1.02, duration: 0.12, ease: 'power2.out' },
    0,
  )

  // 混合叠加强化
  mainTl.to(
    blendOverlayRef.value,
    { opacity: 0.9, duration: 0.1 },
    0.02,
  )

  // 暗角微减弱
  mainTl.to(
    vignetteRef.value,
    { opacity: 0.6, duration: 0.1 },
    0.02,
  )

  // ---- 阶段2 (12-35%): 开始溶解 —— 蒙版透明度降低，混合模式转换 ----
  // 前景人像蒙版层开始消退（剪影透明度降低）
  mainTl.to(
    fgLayerRef.value,
    { opacity: 0.7, scale: 1.04, duration: 0.22, ease: 'power2.inOut' },
    0.12,
  )

  // 混合模式从 multiply → overlay（让中间调开始显现）
  mainTl.to(
    blendOverlayRef.value,
    {
      opacity: 0.55,
      duration: 0.18,
      ease: 'power2.inOut',
    },
    0.15,
  )
  // 切换混合模式
  mainTl.set(
    blendOverlayRef.value,
    { mixBlendMode: 'soft-light' },
    0.25,
  )

  // 边缘发光增强（人像剪影边缘开始发光）
  mainTl.to(
    edgeGlowRef.value,
    { opacity: 0.35, scale: 1.02, duration: 0.18, ease: 'power2.out' },
    0.15,
  )

  // 背景亮度开始恢复
  mainTl.to(
    bgLayerRef.value,
    { filter: 'brightness(0.72) blur(0.3px)', scale: 1.04, duration: 0.2, ease: 'power2.out' },
    0.14,
  )

  // 色调层减弱
  mainTl.to(
    toneRef.value,
    { opacity: 0.3, duration: 0.16 },
    0.16,
  )

  // 漏光增强
  mainTl.to(
    lightLeak1Ref.value,
    { opacity: 0.3, duration: 0.12 },
    0.2,
  )

  // ---- 阶段3 (35-60%): 主要转场 —— 人像快速消失，风景全面曝光 ----
  // 前景人像几乎完全透明
  mainTl.to(
    fgLayerRef.value,
    { opacity: 0.15, scale: 1.06, duration: 0.22, ease: 'power3.inOut' },
    0.35,
  )

  // 混合叠加层几乎消失
  mainTl.to(
    blendOverlayRef.value,
    { opacity: 0.1, duration: 0.2, ease: 'power2.in' },
    0.35,
  )
  mainTl.set(
    blendOverlayRef.value,
    { mixBlendMode: 'screen' },
    0.48,
  )

  // 边缘发光先增后减（剪影最后的闪光）
  mainTl.to(
    edgeGlowRef.value,
    { opacity: 0.6, scale: 1.04, duration: 0.1, ease: 'power3.out' },
    0.38,
  )
  mainTl.to(
    edgeGlowRef.value,
    { opacity: 0.05, scale: 1.08, duration: 0.15, ease: 'power2.in' },
    0.5,
  )

  // 背景完全清晰
  mainTl.to(
    bgLayerRef.value,
    { filter: 'brightness(0.95) blur(0px)', scale: 1.01, duration: 0.2, ease: 'power2.out' },
    0.38,
  )

  // 色调层完全消失
  mainTl.to(
    toneRef.value,
    { opacity: 0, duration: 0.18 },
    0.38,
  )

  // 暗角进一步减弱
  mainTl.to(
    vignetteRef.value,
    { opacity: 0.25, duration: 0.18 },
    0.42,
  )

  // 漏光峰值后消退
  mainTl.to(
    lightLeak1Ref.value,
    { opacity: 0.5, duration: 0.08 },
    0.4,
  )
  mainTl.to(
    lightLeak1Ref.value,
    { opacity: 0.05, duration: 0.14 },
    0.48,
  )
  mainTl.to(
    lightLeak2Ref.value,
    { opacity: 0.2, duration: 0.1 },
    0.45,
  )

  // 颗粒减少
  mainTl.to(
    grainRef.value,
    { opacity: 0.15, duration: 0.18 },
    0.42,
  )

  // ---- 阶段4 (60-85%): 风景完全展现，人像残影保留 ----
  // 背景完美展示
  mainTl.to(
    bgLayerRef.value,
    { filter: 'brightness(1) blur(0px)', scale: 1.0, duration: 0.2, ease: 'power2.out' },
    0.6,
  )

  // 人像残存微弱的鬼影
  mainTl.to(
    fgLayerRef.value,
    { opacity: 0.04, scale: 1.08, duration: 0.2 },
    0.62,
  )

  // 第二次英文漏光
  mainTl.to(
    lightLeak2Ref.value,
    { opacity: 0.35, duration: 0.08 },
    0.65,
  )
  mainTl.to(
    lightLeak2Ref.value,
    { opacity: 0, duration: 0.12 },
    0.72,
  )

  // 暗角微回弹（营造照片结束感）
  mainTl.to(
    vignetteRef.value,
    { opacity: 0.35, duration: 0.12 },
    0.7,
  )

  // 边缘光完全消失
  mainTl.to(
    edgeGlowRef.value,
    { opacity: 0, duration: 0.1 },
    0.6,
  )

  // ---- 阶段5 (85-100%): 文字入场 + 最终呈现 ----
  // 文字层渐入
  mainTl.to(
    infoRef.value,
    { opacity: 1, y: 0, duration: 0.1, ease: 'power2.out' },
    0.85,
  )

  // 背景 Ken Burns 微移收束
  mainTl.to(
    bgLayerRef.value,
    { scale: 1.01, duration: 0.12, ease: 'power1.out' },
    0.88,
  )

  // 暗角最终稳定
  mainTl.to(
    vignetteRef.value,
    { opacity: 0.4, duration: 0.08 },
    0.9,
  )

  // ===== 进度条动画 =====
  mainTl.to(
    progressBarRef.value,
    { width: '100%', duration: 0.95, ease: 'none' },
    0,
  )

  cleanupFns.push(() => {
    mainTl.scrollTrigger?.kill()
    mainTl.kill()
  })
}

// ======== 清理 ========
onUnmounted(() => {
  if (grainAnimId) {
    cancelAnimationFrame(grainAnimId)
  }
  cleanupFns.forEach((fn) => fn())
})
</script>

<style lang="scss" scoped>
/* ==================== 容器 ==================== */
.de-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #0a0a0c;
}

/* ==================== 隐藏 SVG 定义 ==================== */
.de-svg-defs {
  position: absolute;
  width: 0;
  height: 0;
  pointer-events: none;
  z-index: 0;
}

/* ==================== 通用图片 ==================== */
.de-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* ==================== Layer 1: 背景风景图 ==================== */
.de-bg-layer {
  position: absolute;
  inset: 0;
  z-index: 1;
  will-change: transform, filter;
  overflow: hidden;
}

.de-vignette-bg {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background: radial-gradient(
    ellipse 65% 50% at 50% 45%,
    transparent 35%,
    rgba(10, 8, 6, 0.2) 60%,
    rgba(8, 6, 4, 0.4) 85%,
    rgba(6, 4, 2, 0.55) 100%
  );
  mix-blend-mode: multiply;
}

/* ==================== Layer 2: 前景人像图（蒙版 + 混合） ==================== */
.de-fg-layer {
  position: absolute;
  inset: 0;
  z-index: 3;
  // mask-image 通过 JS inline style 动态设置 url(#exposure-mask)
  mask-size: cover;
  -webkit-mask-size: cover;
  mask-repeat: no-repeat;
  -webkit-mask-repeat: no-repeat;
  will-change: transform, opacity;
}

.de-blend-overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  will-change: opacity;
}

.de-tone-overlay {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  background: linear-gradient(
    135deg,
    rgba(10, 20, 40, 0.25) 0%,
    rgba(30, 15, 10, 0.35) 30%,
    rgba(15, 25, 20, 0.3) 60%,
    rgba(8, 12, 18, 0.4) 100%
  );
  mix-blend-mode: multiply;
  will-change: opacity;
}

/* ==================== Layer 3: 人像剪影边缘发光 ==================== */
.de-edge-glow-layer {
  position: absolute;
  inset: 0;
  z-index: 4;
  pointer-events: none;
  mask-size: cover;
  -webkit-mask-size: cover;
  mask-repeat: no-repeat;
  -webkit-mask-repeat: no-repeat;
  will-change: transform, opacity;
  filter: url(#edge-glow) brightness(1.5);
}

/* ==================== Layer 4: 胶片颗粒 ==================== */
.de-grain-layer {
  position: absolute;
  inset: 0;
  z-index: 15;
  pointer-events: none;
  mix-blend-mode: overlay;
  will-change: opacity;
}

.de-grain-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

/* ==================== 漏光效果 ==================== */
.de-light-leak {
  position: absolute;
  inset: 0;
  z-index: 6;
  pointer-events: none;
  mix-blend-mode: screen;
  will-change: opacity;
}

.de-leak-1 {
  background: linear-gradient(
    135deg,
    rgba(255, 160, 60, 0) 0%,
    rgba(255, 140, 40, 0) 40%,
    rgba(255, 120, 30, 0.3) 65%,
    rgba(255, 180, 80, 0.15) 100%
  );
}

.de-leak-2 {
  background: linear-gradient(
    225deg,
    rgba(60, 140, 255, 0) 0%,
    rgba(40, 120, 255, 0) 50%,
    rgba(80, 180, 255, 0.25) 75%,
    rgba(60, 150, 255, 0.1) 100%
  );
}

/* ==================== 暗角框架 ==================== */
.de-vignette {
  position: absolute;
  inset: 0;
  z-index: 7;
  pointer-events: none;
  background: radial-gradient(
    ellipse 70% 55% at 50% 45%,
    transparent 38%,
    rgba(4, 3, 2, 0.25) 62%,
    rgba(6, 4, 2, 0.5) 82%,
    rgba(8, 6, 4, 0.7) 100%
  );
  will-change: opacity;
}

/* ==================== Layer 5: 文字信息 ==================== */
.de-info-layer {
  position: absolute;
  inset: 0;
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  will-change: transform, opacity;
}

.de-label {
  font-size: 12px;
  font-weight: 600;
  font-family: 'Helvetica Neue', 'Arial', sans-serif;
  letter-spacing: 0.5em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 16px;
  text-shadow: 0 0 20px rgba(255, 200, 100, 0.2);
}

.de-title {
  font-size: clamp(28px, 5vw, 56px);
  font-weight: 900;
  font-family: 'STKaiti', 'KaiTi', '楷体', 'Noto Serif SC', 'Georgia', serif;
  color: rgba(255, 255, 255, 0.95);
  margin: 0 0 8px 0;
  letter-spacing: 0.2em;
  text-shadow:
    0 0 30px rgba(255, 180, 100, 0.25),
    0 2px 8px rgba(0, 0, 0, 0.5),
    0 0 60px rgba(255, 255, 255, 0.1);
}

.de-subtitle {
  font-size: 14px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.55);
  letter-spacing: 0.25em;
  margin: 0 0 20px 0;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
}

.de-divider {
  width: 80px;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 200, 120, 0.4) 20%,
    rgba(255, 200, 120, 0.7) 50%,
    rgba(255, 200, 120, 0.4) 80%,
    transparent
  );
  margin-bottom: 16px;
}

.de-desc {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.35);
  letter-spacing: 0.15em;
  margin: 0;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

/* ==================== 进度指示器 ==================== */
.de-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  z-index: 25;
  background: rgba(255, 255, 255, 0.06);
}

.de-progress-bar {
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(255, 140, 60, 0.5),
    rgba(255, 200, 100, 0.7),
    rgba(255, 255, 255, 0.5)
  );
  will-change: width;
  box-shadow: 0 0 8px rgba(255, 180, 100, 0.4);
}

/* ==================== 响应式适配 ==================== */
@media (max-width: 768px) {
  .de-title {
    font-size: clamp(22px, 6vw, 36px);
  }

  .de-label {
    font-size: 10px;
    letter-spacing: 0.35em;
  }

  .de-subtitle {
    font-size: 11px;
  }

  .de-desc {
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .de-title {
    font-size: clamp(18px, 7vw, 28px);
    letter-spacing: 0.12em;
  }
}
</style>
