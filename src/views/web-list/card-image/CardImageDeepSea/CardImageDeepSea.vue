<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type CleanupFn = () => void

// ==================== 照片数据 ====================
interface PhotoItem {
  id: number
  url: string
  title: string
  depth: number
}

const photoUrls = [
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1540206395-68808572332f?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1551244072-5d12893278ab?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1468581264429-2548ef9eb732?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1468581264429-2548ef9eb732?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1468581264429-2548ef9eb732?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1484821582734-6c6c9f99a672?w=600&h=400&fit=crop'
]

const titles = [
  '珊瑚花园',
  '蓝洞深渊',
  '浅滩日光',
  '深海水母',
  '浪涌泡沫',
  '远洋孤帆',
  '海底断崖',
  '潮间带',
  '暮光之海',
  '鲸落'
]

const depths = [8, 35, 2, 120, 15, 60, 200, 5, 80, 400]

const photos = ref<PhotoItem[]>(
  photoUrls.map((url, i) => ({ id: i + 1, url, title: titles[i], depth: depths[i] }))
)

// ==================== Refs ====================
const sectionRef = ref<HTMLElement | null>(null)
const stageRef = ref<HTMLElement | null>(null)
const bubbleCanvasRef = ref<HTMLCanvasElement | null>(null)
const raysRef = ref<HTMLElement | null>(null)
const surfaceRef = ref<HTMLElement | null>(null)
const vignetteRef = ref<HTMLElement | null>(null)
const gaugeRef = ref<HTMLElement | null>(null)
const titleAreaRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const lineRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const photoRefs = ref<(HTMLElement | null)[]>([])
const activePhotoIdx = ref(0)

const cleanupFns: CleanupFn[] = []

// ==================== 光线样式 ====================
function rayStyle(n: number) {
  const left = 10 + (n - 1) * 10 + (Math.random() - 0.5) * 6
  const angle = -8 + (n - 1) * 2 + (Math.random() - 0.5) * 4
  const width = 20 + Math.random() * 25
  const delay = Math.random() * 0.5
  return {
    left: left + '%',
    width: width + 'px',
    transform: 'rotate(' + angle.toFixed(1) + 'deg)',
    animationDelay: delay + 's',
    opacity: 0.04 + Math.random() * 0.06
  }
}

// ==================== 气泡系统 ====================
interface Bubble {
  x: number
  y: number
  r: number
  opacity: number
  speed: number
  wobble: number
  phase: number
}
let bubbles: Bubble[] = []
let bubbleAnimId = 0
let bCW = 0
let bCH = 0

function initBubbles() {
  const canvas = bubbleCanvasRef.value
  if (!canvas) {
    return
  }
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return
  }

  bCW = window.innerWidth
  bCH = window.innerHeight
  canvas.width = bCW
  canvas.height = bCH

  bubbles = []
  for (let i = 0; i < 70; i++) {
    bubbles.push({
      x: Math.random() * bCW,
      y: Math.random() * bCH * 1.3 - bCH * 0.1,
      r: Math.random() * 2.2 + 0.6,
      opacity: Math.random() * 0.18 + 0.04,
      speed: 0.3 + Math.random() * 0.8,
      wobble: 0.3 + Math.random() * 0.9,
      phase: Math.random() * Math.PI * 2
    })
  }

  function animate() {
    if (!ctx || !bubbleCanvasRef.value) {
      return
    }
    ctx.clearRect(0, 0, bCW, bCH)

    for (const b of bubbles) {
      b.y -= b.speed * 0.6
      b.phase += 0.02
      b.x += Math.sin(b.phase) * b.wobble * 0.3
      if (b.y < -20) {
        b.y = bCH + 20
        b.x = Math.random() * bCW
      }
      if (b.x < -20) {
        b.x = bCW + 20
      }
      if (b.x > bCW + 20) {
        b.x = -20
      }

      const alpha = b.opacity * (b.y / bCH)
      if (alpha > 0.003) {
        ctx.beginPath()
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(180,220,255,${alpha.toFixed(4)})`
        ctx.lineWidth = 0.5
        ctx.stroke()
        // 气泡高光
        ctx.beginPath()
        ctx.arc(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.25, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(220,240,255,${(alpha * 0.7).toFixed(4)})`
        ctx.fill()
      }
    }
    bubbleAnimId = requestAnimationFrame(animate)
  }
  animate()
}

// ==================== 挂载 ====================
onMounted(() => {
  if (!sectionRef.value) {
    return
  }
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      initBubbles()
      setupAnimation()
    })
  })
})

// ==================== 主动画 ====================
function setupAnimation() {
  const container = sectionRef.value
  const stage = stageRef.value
  if (!container || !stage) {
    return
  }

  const total = photos.value.length
  const stageW = stage.getBoundingClientRect().width
  const stageH = stage.getBoundingClientRect().height

  // 散布位置：根据深度散布在不同Y层，更深的位置偏下
  photoRefs.value.forEach((el, i) => {
    if (!el) {
      return
    }
    const photo = photos.value[i]
    const depthRatio = photo.depth / 400 // 0~1
    const baseY = stageH * (depthRatio * 0.7 + 0.05)
    const scatterX = (Math.random() - 0.5) * stageW * 0.7
    const scatterY = baseY + (Math.random() - 0.5) * 160
    const blur = 3 + depthRatio * 5
    const brightness = 0.35 - depthRatio * 0.2
    gsap.set(el, {
      x: scatterX,
      y: scatterY,
      scale: 0.6 + Math.random() * 0.2,
      rotation: (Math.random() - 0.5) * 20,
      opacity: 0.25 + depthRatio * 0.2,
      filter: `blur(${blur.toFixed(1)}px) brightness(${brightness.toFixed(2)})`
    })
  })

  // 目标排列
  const positions: {
    x: number
    y: number
    r: number
    s: number
    blur: number
    brightness: number
  }[] = []
  const cols = 5,
    rows = 2
  const cellW = stageW / cols
  const cellH = stageH / rows
  for (let i = 0; i < total; i++) {
    const col = i % cols
    const row = Math.floor(i / cols)
    positions.push({
      x: col * cellW + cellW / 2 - stageW / 2,
      y: row * cellH + cellH / 2 - stageH / 2,
      r: 0,
      s: 1,
      blur: 0,
      brightness: 1
    })
  }

  gsap.set(surfaceRef.value, { opacity: 0.12 })
  gsap.set(vignetteRef.value, { opacity: 0.8 })
  gsap.set(gaugeRef.value, { opacity: 0, y: 10 })

  // ===== 主 ScrollTrigger =====
  const mainSt = ScrollTrigger.create({
    trigger: container,
    start: 'top 90%',
    end: 'bottom 10%',
    scrub: 1.4,
    onUpdate(self) {
      const p = clamp(self.progress, 0, 1)
      const eased = 1 - Math.pow(1 - p, 2.0)

      photoRefs.value.forEach((el, i) => {
        if (!el) {
          return
        }
        const from = {
          x: parseFloat(el.dataset.ox || '0'),
          y: parseFloat(el.dataset.oy || '0')
        }
        const to = positions[i]

        const x = from.x + (to.x - from.x) * eased
        const y = from.y + (to.y - from.y) * eased
        const r = (gsap.getProperty(el, 'rotation') as number) || 0
        const s = 0.7 + 0.3 * eased

        el.style.transform = `translate(${x}px, ${y}px) rotate(${(r * (1 - eased)).toFixed(1)}deg) scale(${s.toFixed(3)})`
        el.style.filter = `blur(${(3 * (1 - eased)).toFixed(1)}px) brightness(${(0.45 + 0.55 * eased).toFixed(2)})`
        el.style.opacity = String((0.3 + 0.7 * eased).toFixed(3))
      })

      const idx = Math.min(total - 1, Math.floor(eased * total))
      activePhotoIdx.value = idx

      // 水面光线
      if (surfaceRef.value) {
        surfaceRef.value.style.opacity = String((0.12 + eased * 0.25).toFixed(3))
      }
      // 暗角
      if (vignetteRef.value) {
        vignetteRef.value.style.opacity = String((0.8 - eased * 0.3).toFixed(3))
      }
      // 深度计
      if (gaugeRef.value) {
        const show = p > 0.06
        gaugeRef.value.style.opacity = show ? '1' : '0'
        gaugeRef.value.style.transform = show ? 'translateY(0)' : 'translateY(10px)'
      }
    },
    onLeaveBack() {
      activePhotoIdx.value = 0
      photoRefs.value.forEach((el, i) => {
        if (!el) {
          return
        }
        const photo = photos.value[i]
        const depthRatio = photo.depth / 400
        const baseY = stageH * (depthRatio * 0.7 + 0.05)
        el.style.transform = `translate(${(Math.random() - 0.5) * stageW * 0.7}px, ${baseY + (Math.random() - 0.5) * 160}px) rotate(0deg) scale(0.7)`
        el.style.filter = `blur(${(3 + depthRatio * 5).toFixed(1)}px) brightness(${(0.35 - depthRatio * 0.2).toFixed(2)})`
        el.style.opacity = String((0.25 + depthRatio * 0.2).toFixed(3))
      })
      if (surfaceRef.value) {
        surfaceRef.value.style.opacity = '0.12'
      }
      if (vignetteRef.value) {
        vignetteRef.value.style.opacity = '0.8'
      }
      if (gaugeRef.value) {
        gaugeRef.value.style.opacity = '0'
        gaugeRef.value.style.transform = 'translateY(10px)'
      }
    }
  })
  cleanupFns.push(() => mainSt.kill())

  // 保存初始位置到 dataset
  photoRefs.value.forEach((el) => {
    if (!el) {
      return
    }
    const style = window.getComputedStyle(el)
    const t = style.transform
    const m = t.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/)
    el.dataset.ox = m ? m[1] : '0'
    el.dataset.oy = m ? m[2] : '0'
  })

  // ===== 标题入场 =====
  if (titleAreaRef.value) {
    const titleTl = gsap.timeline({
      scrollTrigger: { trigger: container, start: 'top 68%', end: 'top 20%', scrub: 0.8 }
    })
    cleanupFns.push(() => titleTl.kill())
    titleTl.fromTo(
      titleAreaRef.value,
      { opacity: 0, y: 20, filter: 'blur(3px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', ease: 'expo.out' },
      0
    )
    if (titleRef.value) {
      titleTl.fromTo(
        titleRef.value,
        { opacity: 0, y: 10, letterSpacing: '0.4em' },
        { opacity: 1, y: 0, letterSpacing: '0.12em', ease: 'power3.out' },
        0.04
      )
    }
    if (lineRef.value) {
      titleTl.fromTo(
        lineRef.value,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, ease: 'power3.out' },
        0.08
      )
    }
    if (subtitleRef.value) {
      titleTl.fromTo(
        subtitleRef.value,
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, ease: 'power3.out' },
        0.12
      )
    }
  }
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v))
}

// ==================== 窗口缩放 ====================
let resizeTimer: number | null = null
function handleResize() {
  if (resizeTimer) {
    clearTimeout(resizeTimer)
  }
  resizeTimer = window.setTimeout(() => {
    const canvas = bubbleCanvasRef.value
    if (canvas) {
      bCW = window.innerWidth
      bCH = window.innerHeight
      canvas.width = bCW
      canvas.height = bCH
    }
  }, 500)
}
window.addEventListener('resize', handleResize)

onUnmounted(() => {
  if (resizeTimer) {
    clearTimeout(resizeTimer)
  }
  window.removeEventListener('resize', handleResize)
  cleanupFns.forEach((fn) => fn())
  cancelAnimationFrame(bubbleAnimId)
})
</script>

<template>
  <div ref="sectionRef" class="ds-section">
    <!-- 深海背景 -->
    <div class="ds-bg"></div>

    <!-- 光线层 -->
    <div ref="raysRef" class="ds-light-rays">
      <div v-for="n in 8" :key="n" class="ds-ray" :style="rayStyle(n)"></div>
    </div>

    <!-- 气泡 / 海洋雪 Canvas -->
    <canvas ref="bubbleCanvasRef" class="ds-bubbles"></canvas>

    <!-- 照片悬浮区 -->
    <div ref="stageRef" class="ds-stage">
      <div
        v-for="(photo, idx) in photos"
        :key="photo.id"
        :ref="
          (el: any) => {
            if (el) photoRefs[idx] = el
          }
        "
        class="ds-photo"
        :class="{ active: idx === activePhotoIdx }"
      >
        <div class="ds-photo-inner">
          <img :src="photo.url" :alt="photo.title" class="ds-photo-img" crossorigin="anonymous" />
          <!-- 水面光纹叠加 -->
          <div class="ds-caustics"></div>
          <div class="ds-depth-tint"></div>
        </div>
        <div class="ds-label">{{ photo.title }}</div>
        <div class="ds-depth">{{ photo.depth }}m</div>
      </div>
    </div>

    <!-- 水面波纹顶部覆盖 -->
    <div ref="surfaceRef" class="ds-surface"></div>

    <!-- 暗角 -->
    <div ref="vignetteRef" class="ds-vignette"></div>

    <!-- 深度计 -->
    <div ref="gaugeRef" class="ds-gauge">
      <div class="ds-gauge-dial">
        <div
          class="ds-gauge-needle"
          :style="{
            transform: 'rotate(' + ((activePhotoIdx / (photos.length - 1)) * 180 - 90) + 'deg)'
          }"
        ></div>
      </div>
      <span class="ds-gauge-label">{{ photos[activePhotoIdx]?.depth || 0 }}m</span>
    </div>

    <!-- 标题 -->
    <div ref="titleAreaRef" class="ds-title-area">
      <h2 ref="titleRef" class="ds-title">深海潜游</h2>
      <div ref="lineRef" class="ds-line"></div>
      <p ref="subtitleRef" class="ds-subtitle">Abyssal Gallery</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ds-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #001018;
}

// ==================== 背景 ====================
.ds-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background:
    // 海面微光
    radial-gradient(ellipse at 50% -5%, rgba(60, 140, 180, 0.15) 0%, transparent 30%),
    radial-gradient(ellipse at 50% 30%, rgba(20, 90, 140, 0.06) 0%, transparent 50%),
    // 深海渐变
    linear-gradient(
        180deg,
        #001d2e 0%,
        #001828 15%,
        #001020 40%,
        #000c18 65%,
        #000810 85%,
        #00060e 100%
      );
}

// ==================== 光线 ====================
.ds-light-rays {
  position: absolute;
  top: -20%;
  left: 0;
  width: 100%;
  height: 130%;
  z-index: 1;
  pointer-events: none;
  overflow: hidden;
}

.ds-ray {
  position: absolute;
  top: 0;
  height: 100%;
  background: linear-gradient(
    180deg,
    rgba(180, 220, 255, 0.18) 0%,
    rgba(120, 190, 230, 0.06) 25%,
    rgba(40, 120, 180, 0.015) 55%,
    transparent 80%
  );
  transform-origin: top center;
  animation: rayShimmer 8s ease-in-out infinite alternate;
  mix-blend-mode: screen;
}

@keyframes rayShimmer {
  0% {
    opacity: 0.5;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 0.4;
  }
}

// ==================== 气泡 Canvas ====================
.ds-bubbles {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
}

// ==================== 舞台 ====================
.ds-stage {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 84vw;
  height: 70vh;
  max-width: 1200px;
  max-height: 680px;
  z-index: 3;
}

// ==================== 照片 ====================
.ds-photo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: center center;
  will-change: transform, filter, opacity;
  pointer-events: none;
}

.ds-photo-inner {
  position: relative;
  width: 210px;
  height: 140px;
  border-radius: 6px;
  overflow: hidden;
  box-shadow:
    0 0 40px rgba(20, 100, 160, 0.15),
    0 6px 24px rgba(0, 8, 20, 0.55),
    0 0 0 1px rgba(40, 120, 180, 0.1);
}

.ds-photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

// 水面光纹
.ds-caustics {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    repeating-linear-gradient(
      230deg,
      rgba(180, 220, 255, 0.07) 0px,
      transparent 3px,
      rgba(160, 200, 240, 0.04) 6px,
      transparent 8px
    ),
    repeating-linear-gradient(
      -35deg,
      rgba(140, 200, 230, 0.05) 0px,
      transparent 4px,
      rgba(170, 210, 245, 0.03) 7px,
      transparent 10px
    );
  animation: causticDrift 12s linear infinite;
  mix-blend-mode: screen;
}

@keyframes causticDrift {
  0% {
    background-position:
      0 0,
      0 0;
  }
  100% {
    background-position:
      40px 20px,
      -30px -15px;
  }
}

.ds-depth-tint {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    180deg,
    rgba(10, 50, 80, 0.08) 0%,
    rgba(0, 30, 60, 0.15) 50%,
    rgba(0, 15, 40, 0.25) 100%
  );
}

.ds-label {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.06em;
  color: rgba(140, 200, 230, 0.45);
  white-space: nowrap;
  text-shadow: 0 0 8px rgba(40, 120, 180, 0.25);
}

.ds-depth {
  position: absolute;
  top: -18px;
  right: 4px;
  font-size: 10px;
  font-weight: 400;
  color: rgba(120, 180, 210, 0.35);
  font-family: 'Courier New', monospace;
}

// ==================== 水面 ====================
.ds-surface {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 28%;
  z-index: 7;
  pointer-events: none;
  background: linear-gradient(
    180deg,
    rgba(120, 200, 240, 0.18) 0%,
    rgba(80, 170, 220, 0.08) 30%,
    rgba(30, 100, 160, 0.03) 60%,
    transparent 100%
  );
}

// ==================== 暗角 ====================
.ds-vignette {
  position: absolute;
  inset: 0;
  z-index: 8;
  pointer-events: none;
  background: radial-gradient(
    ellipse at center,
    transparent 30%,
    rgba(0, 4, 12, 0.25) 50%,
    rgba(0, 4, 12, 0.55) 72%,
    rgba(0, 2, 8, 0.85) 92%
  );
}

// ==================== 深度计 ====================
.ds-gauge {
  position: absolute;
  bottom: 5%;
  right: 6%;
  z-index: 16;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  pointer-events: none;
  transition:
    opacity 0.4s ease,
    transform 0.4s ease;
}

.ds-gauge-dial {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 1.5px solid rgba(80, 160, 200, 0.25);
  background: rgba(0, 15, 30, 0.4);
  position: relative;
  box-shadow:
    0 0 14px rgba(30, 100, 150, 0.15),
    inset 0 0 10px rgba(30, 100, 150, 0.08);
}

.ds-gauge-needle {
  position: absolute;
  bottom: 50%;
  left: 50%;
  width: 1.5px;
  height: 18px;
  background: rgba(160, 220, 250, 0.6);
  transform-origin: bottom center;
  transition: transform 0.5s ease;
  border-radius: 1px;
  box-shadow: 0 0 6px rgba(140, 210, 250, 0.3);
}

.ds-gauge-label {
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.04em;
  color: rgba(120, 180, 210, 0.4);
  font-family: 'Courier New', monospace;
}

// ==================== 标题 ====================
.ds-title-area {
  position: absolute;
  top: 7%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 14;
  text-align: center;
  pointer-events: none;
}

.ds-title {
  font-size: clamp(1.7rem, 4.5vw, 3.1rem);
  font-weight: 200;
  letter-spacing: 0.12em;
  color: #b8daf0;
  text-shadow:
    0 0 30px rgba(80, 160, 210, 0.3),
    0 0 50px rgba(40, 120, 180, 0.12);
  margin: 0 0 10px;
}

.ds-line {
  width: 90px;
  height: 1px;
  margin: 0 auto 10px;
  background: linear-gradient(
    90deg,
    rgba(60, 140, 190, 0.1),
    rgba(120, 190, 230, 0.4),
    rgba(60, 140, 190, 0.1)
  );
  border-radius: 1px;
  transform-origin: center;
}

.ds-subtitle {
  font-size: clamp(0.55rem, 0.95vw, 0.74rem);
  font-weight: 400;
  letter-spacing: 0.05em;
  color: rgba(120, 180, 210, 0.28);
  margin: 0;
  font-family: 'Courier New', monospace;
}
</style>
