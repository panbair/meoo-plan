<template>
  <div class="ps-section" ref="sectionRef">
    <!-- 暖色背景 -->
    <div class="ps-bg"></div>

    <!-- 灰尘粒子 Canvas -->
    <canvas ref="dustCanvasRef" class="ps-dust"></canvas>

    <!-- 宝丽来卡片容器 -->
    <div class="ps-stage" ref="stageRef">
      <div
        v-for="(photo, idx) in photos"
        :key="photo.id"
        class="ps-polaroid"
        :ref="el => { if (el) polaroidRefs[idx] = el as HTMLElement }"
      >
        <!-- 照片区域 -->
        <div class="ps-photo-area">
          <img :src="photo.url" :alt="photo.title" class="ps-photo-img" crossorigin="anonymous" />
          <!-- 光晕叠加 -->
          <div class="ps-photo-glare"></div>
        </div>
        <!-- 底部文字区 -->
        <div class="ps-caption">
          <span class="ps-caption-text">{{ photo.title }}</span>
          <span class="ps-caption-date">{{ photo.date }}</span>
        </div>
        <!-- 图钉 -->
        <div class="ps-pin" :style="{ transform: `rotate(${photo.pinAngle}deg)` }">
          <div class="ps-pin-head"></div>
        </div>
      </div>
    </div>

    <!-- 暗角 -->
    <div class="ps-vignette" ref="vignetteRef"></div>

    <!-- 进度指示器 -->
    <div class="ps-progress" ref="progressRef">
      <div class="ps-progress-label">{{ Math.round(progress * 100) }}% · {{ gridReady ? 'ARRANGED' : 'SCATTERED' }}</div>
      <div class="ps-progress-track">
        <div class="ps-progress-bar" ref="progressBarRef"></div>
      </div>
    </div>

    <!-- 内容覆盖 -->
    <div class="ps-content" ref="contentRef">
      <h2 class="ps-title" ref="titleRef">时光宝丽来</h2>
      <div class="ps-divider" ref="dividerRef"></div>
      <p class="ps-sub" ref="subRef">Polaroid Spread · Memories Float into Place</p>
      <p class="ps-hint" ref="hintRef">↻ SCROLL TO ARRANGE ↺</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void

// ==================== Props ====================
withDefaults(defineProps<{
  imageUrl?: string
  title?: string
  subtitle?: string
}>(), {
  imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=600&fit=crop',
  title: '时光宝丽来',
  subtitle: 'Polaroid Spread'
})

// ==================== 照片数据 ====================
interface PhotoItem {
  id: number
  url: string
  title: string
  date: string
  pinAngle: number
  scatteredX: number
  scatteredY: number
  scatteredRot: number
  scatteredScale: number
  gridCol: number
  gridRow: number
  finalRot: number
}

const photoUrls = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=750&fit=crop',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=750&fit=crop',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=750&fit=crop',
  'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&h=750&fit=crop',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=750&fit=crop',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=750&fit=crop',
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&h=750&fit=crop',
  'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600&h=750&fit=crop',
  'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=600&h=750&fit=crop',
  'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=600&h=750&fit=crop',
  'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=600&h=750&fit=crop',
  'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=600&h=750&fit=crop',
]

const titles = [
  '山间晨光', '森林小径', '海边日落', '海浪拍岸',
  '林间光影', '远山淡影', '秋日草原', '瀑布飞流',
  '星轨夜空', '春日花海', '湖畔倒影', '沙漠孤烟'
]

const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
const days = ['05', '12', '18', '23', '08', '15', '20', '28', '03', '10', '17', '25']

// 生成照片数据，包含散落位置和目标网格位置
const gridCols = 4
const gridRows = 3

function generatePhotos(): PhotoItem[] {
  return photoUrls.map((url, i) => {
    const col = i % gridCols
    const row = Math.floor(i / gridCols)

    // 散落位置：3D 空间随机分布
    const scatteredX = (Math.random() - 0.5) * 70 + (col - 1.5) * 18
    const scatteredY = (Math.random() - 0.5) * 60 + (row - 1) * 22
    const scatteredRot = (Math.random() - 0.5) * 60
    const scatteredScale = 0.55 + Math.random() * 0.3

    // 最终摆放时的小角度偏差，保持自然感
    const finalRot = (Math.random() - 0.5) * 8

    return {
      id: i + 1,
      url,
      title: titles[i],
      date: `2026.${months[i]}.${days[i]}`,
      pinAngle: (Math.random() - 0.5) * 45,
      scatteredX,
      scatteredY,
      scatteredRot,
      scatteredScale,
      gridCol: col,
      gridRow: row,
      finalRot,
    }
  })
}

const photos = ref<PhotoItem[]>(generatePhotos())

// ==================== Refs ====================
const sectionRef = ref<HTMLElement | null>(null)
const stageRef = ref<HTMLElement | null>(null)
const dustCanvasRef = ref<HTMLCanvasElement | null>(null)
const vignetteRef = ref<HTMLElement | null>(null)
const progressRef = ref<HTMLElement | null>(null)
const progressBarRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const dividerRef = ref<HTMLElement | null>(null)
const subRef = ref<HTMLElement | null>(null)
const hintRef = ref<HTMLElement | null>(null)
const polaroidRefs = ref<(HTMLElement | null)[]>([])

const progress = ref(0)
const gridReady = ref(false)

let cleanupFns: TweenCleanup[] = []

// ==================== 粉尘粒子 ====================
interface DustParticle {
  x: number; y: number; size: number
  vx: number; vy: number; opacity: number; hue: number; wobble: number
}
let dustParticles: DustParticle[] = []
let dustAnimId = 0
let dustCW = 0
let dustCH = 0
let dustTime = 0

function initDust() {
  const canvas = dustCanvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  dustCW = window.innerWidth
  dustCH = window.innerHeight
  canvas.width = dustCW
  canvas.height = dustCH

  dustParticles = Array.from({ length: 60 }, () => ({
    x: Math.random() * dustCW,
    y: Math.random() * dustCH,
    size: Math.random() * 1.8 + 0.3,
    vx: (Math.random() - 0.5) * 0.2,
    vy: (Math.random() - 0.5) * 0.2 - 0.1,
    opacity: Math.random() * 0.25 + 0.03,
    hue: Math.random() * 30 + 35,
    wobble: Math.random() * Math.PI * 2,
  }))

  function animate() {
    if (!ctx || !dustCanvasRef.value) return
    dustTime += 0.016
    ctx.clearRect(0, 0, dustCW, dustCH)

    dustParticles.forEach(p => {
      p.x += p.vx + Math.sin(dustTime * 2 + p.wobble) * 0.15
      p.y += p.vy + Math.cos(dustTime * 1.7 + p.wobble) * 0.1

      if (p.x < -20) p.x = dustCW + 20
      if (p.x > dustCW + 20) p.x = -20
      if (p.y < -20) p.y = dustCH + 20
      if (p.y > dustCH + 20) p.y = -20

      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fillStyle = `hsla(${p.hue}, 40%, 85%, ${p.opacity})`
      ctx.fill()
    })

    dustAnimId = requestAnimationFrame(animate)
  }
  animate()
}

// ==================== 格式化百分比 ====================
function clampedProgress(raw: number): number {
  return Math.max(0, Math.min(1, raw))
}

// ==================== 安装 ====================
onMounted(() => {
  if (!sectionRef.value) return

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      initDust()
      setupScrollAnimation()
    })
  })
})

function setupScrollAnimation() {
  const container = sectionRef.value
  if (!container) return

  const stage = stageRef.value
  if (!stage) return

  // ===== 计算网格参数 =====
  const stageRect = stage.getBoundingClientRect()
  const stageW = stageRect.width
  const stageH = stageRect.height

  // 卡片单元尺寸
  const cardW = 168
  const cardH = 210
  const gapX = 32
  const gapY = 36
  const totalGW = gridCols * cardW + (gridCols - 1) * gapX
  const totalGH = gridRows * cardH + (gridRows - 1) * gapY

  const originX = (stageW - totalGW) / 2
  const originY = (stageH - totalGH) / 2

  // ===== 初始状态 =====
  gsap.set(vignetteRef.value, { opacity: 0.55 })
  gsap.set(progressBarRef.value, { width: '0%' })
  gsap.set(contentRef.value, { opacity: 0, y: 25 })
  gsap.set(hintRef.value, { opacity: 0.7 })

  // 设置每张卡片初始散落位置
  polaroidRefs.value.forEach((el, i) => {
    if (!el) return
    const photo = photos.value[i]
    if (!photo) return

    const xPct = 50 + photo.scatteredX
    const yPct = 50 + photo.scatteredY

    el.style.position = 'absolute'
    el.style.left = `${xPct}%`
    el.style.top = `${yPct}%`
    el.style.transform = `translate(-50%, -50%) rotate(${photo.scatteredRot}deg) scale(${photo.scatteredScale})`
    el.style.zIndex = String(Math.round(photo.scatteredY + 20))
    el.style.opacity = '0.6'
    el.style.filter = 'blur(1px) brightness(0.85)'
  })

  progress.value = 0
  gridReady.value = false

  // ===== 主 ScrollTrigger =====
  const mainSt = ScrollTrigger.create({
    trigger: container,
    start: 'top 92%',
    end: 'bottom 18%',
    scrub: 1.5,
    onUpdate(self) {
      const p = clampedProgress(self.progress)
      progress.value = p

      // easeOutBack 式缓动
      const t = 1 - Math.pow(1 - p, 3)
      gridReady.value = p >= 0.98

      // 更新每张卡片
      polaroidRefs.value.forEach((el, i) => {
        if (!el) return
        const photo = photos.value[i]
        if (!photo) return

        // 目标网格位置
        const targetLeft = originX + photo.gridCol * (cardW + gapX)
        const targetTop = originY + photo.gridRow * (cardH + gapY)
        const targetLeftPct = (targetLeft / stageW) * 100
        const targetTopPct = (targetTop / stageH) * 100

        // 散落位置
        const scatterLeftPct = 50 + photo.scatteredX
        const scatterTopPct = 50 + photo.scatteredY

        // 插值
        const leftPct = scatterLeftPct + (targetLeftPct - scatterLeftPct) * t
        const topPct = scatterTopPct + (targetTopPct - scatterTopPct) * t
        const rot = photo.scatteredRot + (photo.finalRot - photo.scatteredRot) * t
        const scl = photo.scatteredScale + (1.0 - photo.scatteredScale) * t
        const opacity = 0.6 + 0.4 * t
        const blurVal = (1 - t) * 1
        const brightness = 0.85 + 0.15 * t

        el.style.left = `${leftPct}%`
        el.style.top = `${topPct}%`
        el.style.transform = `translate(-50%, -50%) rotate(${rot}deg) scale(${scl})`
        el.style.opacity = String(opacity.toFixed(3))
        el.style.filter = `blur(${blurVal.toFixed(2)}px) brightness(${brightness.toFixed(3)})`
        el.style.zIndex = String(Math.round(i + photo.scatteredY * (1 - t) * 2))
      })

      // 暗角减弱
      if (vignetteRef.value) {
        vignetteRef.value.style.opacity = String((0.55 * (1 - p * 0.75)).toFixed(3))
      }

      // 进度条
      if (progressBarRef.value) {
        progressBarRef.value.style.width = `${p * 100}%`
      }

      // 提示淡出
      if (hintRef.value) {
        hintRef.value.style.opacity = String((0.7 * (1 - p)).toFixed(3))
      }
    },
    onLeaveBack() {
      // 重置所有卡片
      polaroidRefs.value.forEach((el, i) => {
        if (!el) return
        const photo = photos.value[i]
        if (!photo) return
        el.style.left = `${50 + photo.scatteredX}%`
        el.style.top = `${50 + photo.scatteredY}%`
        el.style.transform = `translate(-50%, -50%) rotate(${photo.scatteredRot}deg) scale(${photo.scatteredScale})`
        el.style.opacity = '0.6'
        el.style.filter = 'blur(1px) brightness(0.85)'
        el.style.zIndex = String(Math.round(photo.scatteredY + 20))
      })
      if (vignetteRef.value) vignetteRef.value.style.opacity = '0.55'
      if (progressBarRef.value) progressBarRef.value.style.width = '0%'
      if (hintRef.value) hintRef.value.style.opacity = '0.7'
      progress.value = 0
      gridReady.value = false
    },
  })
  cleanupFns.push(() => mainSt.kill())

  // ===== 文字入场 =====
  if (contentRef.value) {
    const textTl = gsap.timeline({
      scrollTrigger: { trigger: container, start: 'top 68%', end: 'top 22%', scrub: 0.9 },
    })
    cleanupFns.push(() => textTl.kill())

    textTl.fromTo(contentRef.value, { opacity: 0, y: 25 }, { opacity: 1, y: 0, ease: 'power3.out' }, 0)
    if (titleRef.value) textTl.fromTo(titleRef.value, { opacity: 0, y: 16, filter: 'blur(4px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', ease: 'expo.out' }, 0.04)
    if (dividerRef.value) textTl.fromTo(dividerRef.value, { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, ease: 'power3.out' }, 0.08)
    if (subRef.value) textTl.fromTo(subRef.value, { opacity: 0, y: 8 }, { opacity: 1, y: 0, ease: 'power3.out' }, 0.12)
  }
}

// ==================== 窗口缩放 ====================
let resizeTimer: number | null = null
function handleResize() {
  if (resizeTimer) clearTimeout(resizeTimer)
  resizeTimer = window.setTimeout(() => {
    const canvas = dustCanvasRef.value
    if (canvas) {
      dustCW = window.innerWidth
      dustCH = window.innerHeight
      canvas.width = dustCW
      canvas.height = dustCH
    }
  }, 400)
}
window.addEventListener('resize', handleResize)

// ==================== 清理 ====================
onUnmounted(() => {
  if (resizeTimer) clearTimeout(resizeTimer)
  window.removeEventListener('resize', handleResize)
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(st => { if (st.vars.trigger === sectionRef.value) st.kill() })
  cancelAnimationFrame(dustAnimId)
})
</script>

<style scoped lang="scss">
// ==================== 容器 ====================
.ps-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #1a1812;
}

// ==================== 暖色背景 ====================
.ps-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(ellipse at 35% 30%, rgba(180, 140, 80, 0.07) 0%, transparent 55%),
    radial-gradient(ellipse at 65% 60%, rgba(200, 160, 90, 0.04) 0%, transparent 50%),
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(255, 240, 200, 0.008) 2px,
      rgba(255, 240, 200, 0.008) 3px
    );
}

// ==================== 粉尘粒子 ====================
.ps-dust {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

// ==================== 舞台 ====================
.ps-stage {
  position: absolute;
  inset: 6%;
  z-index: 2;
  overflow: visible;
}

// ==================== 宝丽来卡片 ====================
.ps-polaroid {
  position: absolute;
  width: 168px;
  height: 210px;
  background: #fafaf7;
  border-radius: 2px;
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.12),
    0 8px 30px rgba(0, 0, 0, 0.18),
    0 1px 0 rgba(255, 255, 255, 0.4) inset;
  will-change: transform, opacity, filter, left, top;
  cursor: default;
  transition: box-shadow 0.5s ease;
  overflow: visible;

  &::after {
    content: '';
    position: absolute;
    inset: -3px;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.04);
    pointer-events: none;
    z-index: 5;
  }
}

// 照片区域
.ps-photo-area {
  position: relative;
  width: 148px;
  height: 148px;
  margin: 10px 10px 0 10px;
  overflow: hidden;
  border-radius: 1px;
}

.ps-photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

// 照片光晕叠加
.ps-photo-glare {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.06) 0%,
    rgba(255, 255, 255, 0.01) 30%,
    transparent 60%,
    rgba(0, 0, 0, 0.02) 100%
  );
  pointer-events: none;
}

// 底部文字区
.ps-caption {
  position: relative;
  width: 148px;
  height: 44px;
  margin: 0 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2px;
}

.ps-caption-text {
  font-family: 'Georgia', 'Noto Serif SC', serif;
  font-size: 12px;
  font-style: italic;
  color: #4a4a44;
  letter-spacing: 0.04em;
  line-height: 1.2;
}

.ps-caption-date {
  font-family: 'Courier New', 'Consolas', monospace;
  font-size: 9px;
  color: #a0a098;
  letter-spacing: 0.08em;
}

// 图钉
.ps-pin {
  position: absolute;
  top: -6px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  pointer-events: none;
}

.ps-pin-head {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #d4a574, #b8744a);
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.4),
    inset 0 1px 1px rgba(255, 255, 255, 0.3);
}

// ==================== 暗角 ====================
.ps-vignette {
  position: absolute;
  inset: 0;
  z-index: 8;
  pointer-events: none;
  background: radial-gradient(ellipse at center,
    transparent 40%,
    rgba(10, 8, 4, 0.2) 62%,
    rgba(10, 8, 4, 0.45) 78%,
    rgba(10, 8, 4, 0.75) 92%,
    rgba(8, 6, 3, 0.9) 100%
  );
}

// ==================== 进度 ====================
.ps-progress {
  position: absolute;
  bottom: 8%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 15;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  pointer-events: none;
}

.ps-progress-label {
  font-family: 'Courier New', monospace;
  font-size: 10px;
  letter-spacing: 2px;
  color: rgba(210, 190, 150, 0.5);
  text-transform: uppercase;
}

.ps-progress-track {
  width: 180px;
  height: 1.5px;
  background: rgba(200, 170, 120, 0.08);
  border-radius: 2px;
  overflow: hidden;
}

.ps-progress-bar {
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg,
    rgba(180, 140, 90, 0.35),
    rgba(210, 170, 110, 0.65),
    rgba(180, 140, 90, 0.35)
  );
  border-radius: 2px;
  box-shadow: 0 0 6px rgba(190, 150, 100, 0.25);
}

// ==================== 内容覆盖 ====================
.ps-content {
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 14;
  text-align: center;
  pointer-events: none;
}

.ps-title {
  font-size: clamp(1.8rem, 5.5vw, 3.8rem);
  font-weight: 300;
  letter-spacing: 0.12em;
  color: #f5ead6;
  text-shadow:
    0 0 20px rgba(220, 180, 120, 0.3),
    0 0 50px rgba(180, 140, 80, 0.15);
  margin: 0 0 10px;
  line-height: 1.2;
  font-family: 'Georgia', 'Noto Serif SC', serif;
}

.ps-divider {
  width: 80px;
  height: 1px;
  margin: 0 auto 10px;
  background: linear-gradient(90deg,
    rgba(180, 140, 80, 0.15),
    rgba(220, 190, 130, 0.5),
    rgba(180, 140, 80, 0.15)
  );
  border-radius: 1px;
  transform-origin: center;
}

.ps-sub {
  font-size: clamp(0.65rem, 1.1vw, 0.82rem);
  font-weight: 400;
  font-family: 'Georgia', serif;
  font-style: italic;
  letter-spacing: 0.04em;
  color: rgba(200, 170, 120, 0.4);
  margin: 0;
}

.ps-hint {
  margin: 16px 0 0;
  font-family: 'Courier New', monospace;
  font-size: 11px;
  letter-spacing: 3px;
  color: rgba(180, 150, 100, 0.35);
  text-transform: uppercase;
  animation: hintPulse 3s ease-in-out infinite;
}

@keyframes hintPulse {
  0%, 100% { opacity: 0.25; }
  50% { opacity: 0.55; }
}
</style>
