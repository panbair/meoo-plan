<template>
  <section ref="sectionRef" class="wetplate-section">
    <!-- 暗室背景 -->
    <div class="darkroom-bg">
      <div class="darkroom-grad"></div>
      <div class="chemical-vapors"></div>
    </div>

    <!-- 银板基座 -->
    <div class="silver-plate-frame">
      <!-- 金属边框 -->
      <div class="plate-border">
        <div class="border-outer"></div>
        <div class="border-inner"></div>
        <div class="border-bevel"></div>
      </div>

      <!-- 图片容器 -->
      <div class="plate-image-wrapper">
        <img
          ref="imageRef"
          :src="imageUrl"
          alt=""
          class="plate-image"
          crossorigin="anonymous"
        />
      </div>

      <!-- 暗角叠加 -->
      <div ref="vignetteRef" class="vignette-overlay"></div>

      <!-- 银板反射条带 -->
      <div ref="reflectionRef" class="silver-reflection"></div>

      <!-- 划痕和灰尘 -->
      <div ref="scratchesRef" class="scratches-overlay">
        <span
          v-for="(s, i) in scratches"
          :key="'scratch'+i"
          class="scratch-line"
          :style="scratchStyle(s)"
        />
        <span
          v-for="(d, i) in dustParticles"
          :key="'dust'+i"
          class="dust-spot"
          :style="dustStyle(d)"
        />
      </div>
    </div>

    <!-- 博物馆铜牌标签 -->
    <div ref="contentRef" class="content-overlay">
      <h2 class="title">Wet Plate</h2>
      <p class="subtitle">Collodion Photography · Circa 1850</p>
      <div class="divider"></div>
      <p class="desc">湿版火棉胶摄影 · 银板显影 · 蓝紫冷调 · 百年岁月</p>
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
const sectionRef     = ref<HTMLElement | null>(null)
const imageRef       = ref<HTMLImageElement | null>(null)
const vignetteRef    = ref<HTMLElement | null>(null)
const reflectionRef  = ref<HTMLElement | null>(null)
const scratchesRef   = ref<HTMLElement | null>(null)
const contentRef     = ref<HTMLElement | null>(null)

// ==================== 划痕数据 ====================
interface ScratchData {
  top: number; left: number; width: number; height: number
  rotate: number; opacity: number
}

const scratches: ScratchData[] = [
  { top: 8,  left: 12, width: 86,  height: 1.2, rotate: -3,  opacity: 0.35 },
  { top: 22, left: 58, width: 110, height: 1.0, rotate: 7,   opacity: 0.28 },
  { top: 45, left: 6,  width: 62,  height: 1.5, rotate: -8,  opacity: 0.42 },
  { top: 68, left: 42, width: 94,  height: 1.0, rotate: 5,   opacity: 0.30 },
  { top: 85, left: 20, width: 78,  height: 1.3, rotate: -4,  opacity: 0.38 },
  { top: 15, left: 78, width: 52,  height: 0.8, rotate: -12, opacity: 0.25 },
  { top: 55, left: 72, width: 70,  height: 1.1, rotate: 9,   opacity: 0.32 },
  { top: 92, left: 65, width: 58,  height: 0.9, rotate: -6,  opacity: 0.27 },
]

function scratchStyle(s: ScratchData) {
  return {
    top: `${s.top}%`,
    left: `${s.left}%`,
    width: `${s.width}px`,
    height: `${s.height}px`,
    transform: `rotate(${s.rotate}deg)`,
    opacity: `${s.opacity}`,
  }
}

// ==================== 灰尘数据 ====================
interface DustData {
  top: number; left: number; size: number; opacity: number
}

const dustParticles: DustData[] = [
  { top: 10, left: 25, size: 3,  opacity: 0.28 },
  { top: 32, left: 68, size: 2,  opacity: 0.35 },
  { top: 50, left: 15, size: 4,  opacity: 0.22 },
  { top: 72, left: 82, size: 2.5, opacity: 0.30 },
  { top: 88, left: 35, size: 3.5, opacity: 0.25 },
  { top: 18, left: 90, size: 2,  opacity: 0.32 },
  { top: 40, left: 48, size: 5,  opacity: 0.18 },
  { top: 64, left: 8,  size: 3,  opacity: 0.28 },
  { top: 95, left: 55, size: 2,  opacity: 0.35 },
  { top: 25, left: 38, size: 3.5, opacity: 0.20 },
  { top: 58, left: 92, size: 2.5, opacity: 0.33 },
  { top: 78, left: 22, size: 3,  opacity: 0.26 },
]

function dustStyle(d: DustData) {
  return {
    top: `${d.top}%`,
    left: `${d.left}%`,
    width: `${d.size}px`,
    height: `${d.size}px`,
    opacity: `${d.opacity}`,
  }
}

// ==================== 挂载 ====================
onMounted(() => {
  if (!sectionRef.value) return

  // ========== 图片滤镜：模糊→清晰 + 化学色偏 ==========
  if (imageRef.value) {
    gsap.set(imageRef.value, {
      filter: 'blur(20px) contrast(0.5) brightness(0.7) sepia(0) hue-rotate(0deg) saturate(0.5)',
    })
  }
  const filterProxy = { blur: 20, contrast: 0.5, brightness: 0.7, sepia: 0, hueRotate: 0, saturate: 0.5 }

  if (imageRef.value) {
    const filterSt = ScrollTrigger.create({
      trigger: sectionRef.value,
      start: 'top 75%',
      end: 'bottom 25%',
      scrub: 1.5,
      onUpdate(self) {
        const p = self.progress
        // 分阶段：前70%去模糊+提对比，后30%施加化学色偏
        const clarityP = Math.min(p / 0.70, 1)
        const tintP   = Math.max(0, (p - 0.55) / 0.45)

        filterProxy.blur       = 20 * (1 - clarityP)
        filterProxy.contrast   = 0.5 + 0.9 * clarityP
        filterProxy.brightness = 0.7 + 0.45 * clarityP
        filterProxy.sepia      = 0.30 * tintP
        filterProxy.hueRotate  = -30 * tintP
        filterProxy.saturate   = 0.5 + 0.2 * tintP

        imageRef.value!.style.filter =
          `blur(${filterProxy.blur.toFixed(1)}px) ` +
          `contrast(${filterProxy.contrast.toFixed(2)}) ` +
          `brightness(${filterProxy.brightness.toFixed(2)}) ` +
          `sepia(${filterProxy.sepia.toFixed(2)}) ` +
          `hue-rotate(${filterProxy.hueRotate.toFixed(1)}deg) ` +
          `saturate(${filterProxy.saturate.toFixed(2)})`
      },
    })
    cleanupFns.push(() => filterSt.kill())
  }

  // ========== 暗角收缩 (vignette radial-gradient 透明中心扩大) ==========
  if (vignetteRef.value) {
    const vignetteProxy = { size: 40 }
    const vignetteSt = ScrollTrigger.create({
      trigger: sectionRef.value,
      start: 'top 75%',
      end: 'bottom 30%',
      scrub: 1.2,
      onUpdate(self) {
        vignetteProxy.size = 40 + 45 * self.progress
        vignetteRef.value!.style.background =
          `radial-gradient(ellipse 75% 70% at 50% 48%, ` +
          `transparent ${vignetteProxy.size.toFixed(0)}%, ` +
          `rgba(5,3,0,0.65) ${vignetteProxy.size + 6}%, ` +
          `rgba(3,2,0,0.92) 100%)`
      },
    })
    cleanupFns.push(() => vignetteSt.kill())
  }

  // ========== 银板反射（先闪后沉） ==========
  if (reflectionRef.value) gsap.set(reflectionRef.value, { opacity: 0 })
  if (reflectionRef.value) {
    const refTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 55%',
        end: 'bottom 35%',
        scrub: 1.0,
      },
    })
    refTl
      .to(reflectionRef.value, { opacity: 0.55, duration: 0.25, ease: 'power2.in' })
      .to(reflectionRef.value, { opacity: 0.18, duration: 0.75, ease: 'power3.out' })
    cleanupFns.push(() => { refTl.scrollTrigger?.kill(); refTl.kill() })
  }

  // ========== 划痕和灰尘渐显 ==========
  if (scratchesRef.value) gsap.set(scratchesRef.value, { opacity: 0 })
  if (scratchesRef.value) {
    const scrTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 42%',
        end: 'bottom 20%',
        scrub: 0.8,
      },
    })
    scrTl.to(scratchesRef.value, { opacity: 1, duration: 1, ease: 'power2.in' })
    cleanupFns.push(() => { scrTl.scrollTrigger?.kill(); scrTl.kill() })
  }

  // ========== 文字渐显 ==========
  if (contentRef.value) gsap.set(contentRef.value, { opacity: 0, y: 24 })
  if (contentRef.value) {
    const textTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 58%',
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
.wetplate-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #080706;
}

/* ==================== 暗室背景 ==================== */
.darkroom-bg {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.darkroom-grad {
  width: 100%;
  height: 100%;
  background:
    radial-gradient(ellipse 55% 45% at 50% 50%, rgba(25, 20, 35, 0.6) 0%, transparent 55%),
    radial-gradient(ellipse 40% 35% at 48% 50%, rgba(30, 25, 45, 0.3) 0%, transparent 50%),
    radial-gradient(ellipse 90% 80% at 50% 45%, rgba(8, 6, 18, 0.5) 0%, transparent 80%),
    linear-gradient(180deg, #080710 0%, #0a0914 40%, #0c0a12 100%);
}

.chemical-vapors {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 70% 20% at 30% 60%, rgba(60, 45, 90, 0.06) 0%, transparent 60%),
    radial-gradient(ellipse 50% 15% at 70% 40%, rgba(50, 40, 80, 0.05) 0%, transparent 60%);
}

/* ==================== 银板基座 ==================== */
.silver-plate-frame {
  position: absolute;
  top: 50%;
  left: 50%;
  width: min(72vmin, 700px);
  height: min(72vmin, 700px);
  transform: translate(-50%, -50%);
  z-index: 3;
}

/* ==================== 金属边框 ==================== */
.plate-border {
  position: absolute;
  inset: -14px;
  z-index: 4;
  pointer-events: none;
}

.border-outer {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #5a5650 0%, #3a3632 25%, #4e4a44 50%, #2e2a26 75%, #4a4640 100%);
  border-radius: 2px;
  box-shadow:
    inset 0 0 8px rgba(0,0,0,0.5),
    0 1px 3px rgba(0,0,0,0.6);
}

.border-inner {
  position: absolute;
  inset: 5px;
  background: linear-gradient(135deg, #3d3935 0%, #2a2723 30%, #383430 60%, #25231f 100%);
  border-radius: 1px;
  box-shadow:
    inset 0 1px 2px rgba(200,195,185,0.12),
    inset 0 -2px 3px rgba(0,0,0,0.4);
}

.border-bevel {
  position: absolute;
  inset: 9px;
  background: linear-gradient(135deg, #2d2a26 0%, #1f1d1a 40%, #2a2724 100%);
  border-radius: 1px;
  box-shadow: inset 0 1px 0 rgba(180,175,165,0.1);
}

/* ==================== 图片容器 ==================== */
.plate-image-wrapper {
  position: absolute;
  inset: 0;
  z-index: 5;
  overflow: hidden;
  background: #1a1816;
}

.plate-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  will-change: filter;
}

/* ==================== 暗角叠加 ==================== */
.vignette-overlay {
  position: absolute;
  inset: 0;
  z-index: 6;
  pointer-events: none;
  // 初始：暗角覆盖60%视野
  background:
    radial-gradient(ellipse 75% 70% at 50% 48%,
      transparent 40%,
      rgba(5,3,0,0.65) 46%,
      rgba(3,2,0,0.92) 100%);
  will-change: background;
}

/* ==================== 银板反射带 ==================== */
.silver-reflection {
  position: absolute;
  inset: 0;
  z-index: 7;
  pointer-events: none;
  background:
    linear-gradient(
      135deg,
      transparent 0%,
      rgba(220, 225, 235, 0.20) 18%,
      transparent 22%,
      rgba(195, 205, 215, 0.12) 40%,
      transparent 44%,
      rgba(225, 230, 238, 0.18) 62%,
      transparent 66%,
      rgba(210, 218, 228, 0.10) 82%,
      transparent 100%
    );
  // 第二组微弱反射（不同角度）
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background:
      linear-gradient(
        45deg,
        transparent 0%,
        rgba(230, 235, 240, 0.08) 30%,
        transparent 34%,
        rgba(200, 210, 220, 0.06) 55%,
        transparent 58%,
        transparent 100%
      );
  }
}

/* ==================== 划痕和灰尘 ==================== */
.scratches-overlay {
  position: absolute;
  inset: 0;
  z-index: 8;
  pointer-events: none;
  overflow: hidden;
}

.scratch-line {
  position: absolute;
  background: rgba(255, 255, 255, 0.35);
  border-radius: 0.5px;
  box-shadow: 0 0 1px rgba(0,0,0,0.15);
}

.dust-spot {
  position: absolute;
  border-radius: 50%;
  background: rgba(200, 195, 185, 0.3);
  box-shadow: 0 0 1.5px rgba(0,0,0,0.2);
}

/* ==================== 文字覆盖层 ==================== */
.content-overlay {
  position: absolute;
  right: 6%;
  bottom: 8%;
  z-index: 20;
  text-align: right;
  pointer-events: none;
}

.title {
  font-family: 'Georgia', 'Times New Roman', serif;
  font-size: clamp(2rem, 5vw, 3.8rem);
  font-weight: 400;
  letter-spacing: 0.08em;
  color: #d8d0c4;
  margin: 0;
  text-shadow:
    0 0 30px rgba(180, 160, 200, 0.3),
    0 0 10px rgba(140, 120, 160, 0.15);
  line-height: 1.1;
}

.subtitle {
  font-family: 'Georgia', 'Times New Roman', serif;
  font-size: clamp(0.8rem, 1.6vw, 1.15rem);
  font-style: italic;
  color: #9a9088;
  margin: 6px 0 0;
  letter-spacing: 0.05em;
}

.divider {
  width: 120px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(180, 160, 140, 0.35), rgba(140, 120, 100, 0.15));
  margin: 12px 0 12px auto;
}

.desc {
  font-family: 'Georgia', 'Times New Roman', 'SimSun', serif;
  font-size: clamp(0.7rem, 1.2vw, 0.9rem);
  color: #887a6a;
  margin: 0;
  letter-spacing: 0.04em;
  line-height: 1.6;
}
</style>
