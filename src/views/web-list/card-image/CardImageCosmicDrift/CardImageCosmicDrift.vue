<template>
  <div class="cd-section" ref="sectionRef">
    <div class="cd-bg"></div>
    <canvas ref="starsCanvasRef" class="cd-stars-canvas"></canvas>
    <div class="cd-supernova" ref="supernovaRef"></div>

    <div class="cd-stage" ref="stageRef">
      <div
        v-for="(photo, idx) in photos"
        :key="photo.id"
        class="cd-photo"
        :ref="(el: any) => { if (el) photoRefs[idx] = el }"
        :class="{ active: idx === activePhotoIdx }"
      >
        <div class="cd-aura" :ref="(el: any) => { if (el) auraRefs[idx] = el }"></div>
        <div class="cd-photo-inner">
          <img :src="photo.url" :alt="photo.title" class="cd-photo-img" crossorigin="anonymous" />
          <div class="cd-photo-tint"></div>
        </div>
        <div class="cd-label">{{ photo.title }}</div>
        <div class="cd-ring"></div>
      </div>
    </div>

    <div class="cd-vignette" ref="vignetteRef"></div>

    <div class="cd-progress" ref="progressRef">
      <div class="cd-progress-dots">
        <span v-for="n in photos.length" :key="n" class="cd-dot" :class="{ active: n <= activePhotoIdx + 1 }"></span>
      </div>
      <span class="cd-progress-name">{{ photos[activePhotoIdx]?.title || 'Cosmos' }}</span>
    </div>

    <div class="cd-title-area" ref="titleAreaRef">
      <h2 class="cd-title" ref="titleRef">宇宙漂流</h2>
      <div class="cd-line" ref="lineRef"></div>
      <p class="cd-subtitle" ref="subtitleRef">Cosmic Drift Gallery</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type CleanupFn = () => void

interface PhotoItem {
  id: number
  url: string
  title: string
}

const photoUrls = [
  'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1457364887197-9150188c107b?w=600&h=400&fit=crop',
]

const titles = [
  '猎户星云', '仙女星系', '蓝月亮', '玫瑰星云',
  '创生之柱', '银河之心', '极光星海', '黑洞边界',
  '超新星遗迹', '量子涟漪'
]

const photos = ref<PhotoItem[]>(
  photoUrls.map((url, i) => ({ id: i + 1, url, title: titles[i] }))
)

const sectionRef = ref<HTMLElement | null>(null)
const stageRef = ref<HTMLElement | null>(null)
const starsCanvasRef = ref<HTMLCanvasElement | null>(null)
const supernovaRef = ref<HTMLElement | null>(null)
const vignetteRef = ref<HTMLElement | null>(null)
const progressRef = ref<HTMLElement | null>(null)
const titleAreaRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const lineRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const photoRefs = ref<(HTMLElement | null)[]>([])
const auraRefs = ref<(HTMLElement | null)[]>([])

const activePhotoIdx = ref(0)

let cleanupFns: CleanupFn[] = []

// ==================== 星场系统 ====================
interface Star {
  x: number; y: number
  size: number
  opacity: number
  twinkle: number; phase: number; speed: number
}

let starsAnimId = 0
let stars: Star[] = []
let sCW = 0; let sCH = 0

function initStarfield() {
  const canvas = starsCanvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  sCW = window.innerWidth
  sCH = window.innerHeight
  canvas.width = sCW
  canvas.height = sCH

  stars = []
  for (let i = 0; i < 350; i++) {
    stars.push({
      x: Math.random() * sCW,
      y: Math.random() * sCH,
      size: Math.random() * 1.6 + 0.3,
      opacity: Math.random() * 0.7 + 0.15,
      twinkle: 0,
      phase: Math.random() * Math.PI * 2,
      speed: 0.01 + Math.random() * 0.03,
    })
  }

  function animate() {
    if (!ctx || !starsCanvasRef.value) return
    ctx.clearRect(0, 0, sCW, sCH)
    for (const s of stars) {
      s.twinkle = Math.sin(s.phase) * 0.5 + 0.5
      s.phase += s.speed
      const alpha = s.opacity * (0.4 + s.twinkle * 0.6)
      if (alpha > 0.01) {
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(200,210,255,${alpha.toFixed(3)})`
        ctx.fill()
        if (s.size > 1.0 && s.twinkle > 0.6) {
          ctx.beginPath()
          ctx.arc(s.x, s.y, s.size * 2.5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(140,160,255,${(alpha * 0.12).toFixed(4)})`
          ctx.fill()
        }
      }
    }
    ctx.fillStyle = 'rgba(80,40,120,0.008)'
    ctx.beginPath(); ctx.arc(sCW * 0.65, sCH * 0.4, sCW * 0.35, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = 'rgba(30,60,140,0.006)'
    ctx.beginPath(); ctx.arc(sCW * 0.3, sCH * 0.6, sCW * 0.28, 0, Math.PI * 2); ctx.fill()

    starsAnimId = requestAnimationFrame(animate)
  }
  animate()
}

// ==================== 挂载 ====================
onMounted(() => {
  if (!sectionRef.value) return
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      initStarfield()
      setupAnimation()
    })
  })
})

// ==================== 主动画 ====================
function setupAnimation() {
  const container = sectionRef.value
  const stage = stageRef.value
  if (!container || !stage) return

  const total = photos.value.length
  const stageW = stage.getBoundingClientRect().width
  const stageH = stage.getBoundingClientRect().height

  // 散布位置
  const scatterPositions: { x: number; y: number; r: number; s: number }[] = []
  for (let i = 0; i < total; i++) {
    const angle = (i / total) * Math.PI * 2 + Math.random() * 0.5
    const radius = stageW * (0.45 + Math.random() * 0.4)
    scatterPositions.push({
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius * 0.7 - stageH * 0.15,
      r: (Math.random() - 0.5) * 60,
      s: 0.3 + Math.random() * 0.3,
    })
  }

  // 弧形排列位置
  const targetPositions: { x: number; y: number; r: number; s: number }[] = []
  const arcRadius = stageW * 0.38
  const startAngle = -Math.PI * 0.85
  const endAngle = Math.PI * 0.85
  for (let i = 0; i < total; i++) {
    const a = startAngle + (i / (total - 1)) * (endAngle - startAngle)
    const wobbleY = Math.sin(i * 1.3) * 18
    targetPositions.push({
      x: Math.cos(a) * arcRadius,
      y: Math.sin(a) * arcRadius * 0.55 + wobbleY,
      r: (i - (total - 1) / 2) * 2.8,
      s: 1,
    })
  }

  // 初始散布
  photoRefs.value.forEach((el, i) => {
    if (!el) return
    const pos = scatterPositions[i]
    gsap.set(el, {
      x: pos.x, y: pos.y,
      rotation: pos.r,
      scale: pos.s,
      opacity: 0.25,
      filter: 'blur(6px) brightness(0.4)',
    })
  })
  auraRefs.value.forEach(el => {
    if (el) gsap.set(el, { opacity: 0, scale: 0.5 })
  })
  gsap.set(supernovaRef.value, { opacity: 0 })
  gsap.set(vignetteRef.value, { opacity: 0.85 })
  gsap.set(progressRef.value, { opacity: 0, y: 10 })

  // 主 ScrollTrigger
  const mainSt = ScrollTrigger.create({
    trigger: container,
    start: 'top 88%',
    end: 'bottom 12%',
    scrub: 1.5,
    onUpdate(self) {
      const p = clamp(self.progress, 0, 1)
      const eased = 1 - Math.pow(1 - p, 2.5)

      photoRefs.value.forEach((el, i) => {
        if (!el) return
        const from = scatterPositions[i]
        const to = targetPositions[i]

        const x = from.x + (to.x - from.x) * eased
        const y = from.y + (to.y - from.y) * eased
        const r = from.r + (to.r - from.r) * eased
        const s = from.s + (to.s - from.s) * eased
        const blur = 6 * (1 - eased)
        const brightness = 0.4 + 0.6 * eased
        const opacity = 0.25 + 0.75 * eased

        el.style.transform = `translate(${x}px, ${y}px) rotate(${r.toFixed(1)}deg) scale(${s.toFixed(3)})`
        el.style.filter = `blur(${blur.toFixed(1)}px) brightness(${brightness.toFixed(2)})`
        el.style.opacity = String(opacity.toFixed(3))
      })

      const idx = Math.min(total - 1, Math.floor(eased * total))
      activePhotoIdx.value = idx
      auraRefs.value.forEach((aura, i) => {
        if (!aura) return
        const diff = Math.abs(i - idx)
        const auraAlpha = diff === 0 ? 0.7 : Math.max(0, 0.35 - diff * 0.12)
        aura.style.opacity = String(auraAlpha.toFixed(3))
        aura.style.transform = 'scale(' + (diff === 0 ? 1.1 + Math.sin(p * 6) * 0.1 : 0.6).toFixed(3) + ')'
      })

      if (supernovaRef.value) {
        supernovaRef.value.style.opacity = String((eased * 0.22 + Math.sin(p * 2.5) * 0.06).toFixed(3))
      }
      if (vignetteRef.value) {
        vignetteRef.value.style.opacity = String((0.85 - eased * 0.25).toFixed(3))
      }
      if (progressRef.value) {
        const showProg = p > 0.08
        progressRef.value.style.opacity = showProg ? '1' : '0'
        progressRef.value.style.transform = showProg ? 'translateY(0)' : 'translateY(10px)'
      }
    },
    onLeaveBack() {
      activePhotoIdx.value = 0
      photoRefs.value.forEach((el, i) => {
        if (!el) return
        const pos = scatterPositions[i]
        el.style.transform = `translate(${pos.x}px, ${pos.y}px) rotate(${pos.r.toFixed(1)}deg) scale(${pos.s.toFixed(3)})`
        el.style.filter = 'blur(6px) brightness(0.4)'
        el.style.opacity = '0.25'
      })
      auraRefs.value.forEach(el => { if (el) { el.style.opacity = '0'; el.style.transform = 'scale(0.5)' } })
      if (supernovaRef.value) supernovaRef.value.style.opacity = '0'
      if (vignetteRef.value) vignetteRef.value.style.opacity = '0.85'
      if (progressRef.value) { progressRef.value.style.opacity = '0'; progressRef.value.style.transform = 'translateY(10px)' }
    },
  })
  cleanupFns.push(() => mainSt.kill())

  // 标题入场
  if (titleAreaRef.value) {
    const titleTl = gsap.timeline({
      scrollTrigger: { trigger: container, start: 'top 70%', end: 'top 22%', scrub: 0.8 },
    })
    cleanupFns.push(() => titleTl.kill())
    titleTl.fromTo(titleAreaRef.value,
      { opacity: 0, y: 18, filter: 'blur(4px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', ease: 'expo.out' }, 0)
    if (titleRef.value) titleTl.fromTo(titleRef.value,
      { opacity: 0, y: 12, letterSpacing: '0.5em' },
      { opacity: 1, y: 0, letterSpacing: '0.15em', ease: 'power3.out' }, 0.04)
    if (lineRef.value) titleTl.fromTo(lineRef.value,
      { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, ease: 'power3.out' }, 0.08)
    if (subtitleRef.value) titleTl.fromTo(subtitleRef.value,
      { opacity: 0, y: 6 }, { opacity: 1, y: 0, ease: 'power3.out' }, 0.12)
  }
}

function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)) }

let resizeTimer: number | null = null
function handleResize() {
  if (resizeTimer) clearTimeout(resizeTimer)
  resizeTimer = window.setTimeout(() => {
    const canvas = starsCanvasRef.value
    if (canvas) {
      sCW = window.innerWidth; sCH = window.innerHeight
      canvas.width = sCW; canvas.height = sCH
      stars = []
      for (let i = 0; i < 350; i++) {
        stars.push({
          x: Math.random() * sCW, y: Math.random() * sCH,
          size: Math.random() * 1.6 + 0.3,
          opacity: Math.random() * 0.7 + 0.15,
          twinkle: 0, phase: Math.random() * Math.PI * 2,
          speed: 0.01 + Math.random() * 0.03,
        })
      }
    }
  }, 500)
}
window.addEventListener('resize', handleResize)

onUnmounted(() => {
  if (resizeTimer) clearTimeout(resizeTimer)
  window.removeEventListener('resize', handleResize)
  cleanupFns.forEach(fn => fn())
  cancelAnimationFrame(starsAnimId)
})
</script>

<style scoped lang="scss">
.cd-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #03020a;
}

.cd-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(ellipse at 35% 40%, rgba(30, 20, 90, 0.18) 0%, transparent 55%),
    radial-gradient(ellipse at 70% 55%, rgba(20, 40, 100, 0.12) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 70%, rgba(60, 20, 80, 0.08) 0%, transparent 45%),
    linear-gradient(180deg, #050315 0%, #07041e 35%, #0a0525 65%, #05031a 100%);
}

.cd-stars-canvas {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.cd-supernova {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  height: 500px;
  z-index: 2;
  pointer-events: none;
  background: radial-gradient(circle,
    rgba(140, 100, 255, 0.08) 0%,
    rgba(80, 60, 200, 0.04) 30%,
    rgba(40, 80, 180, 0.015) 55%,
    transparent 75%
  );
  border-radius: 50%;
  filter: blur(40px);
}

.cd-stage {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 82vw;
  height: 75vh;
  max-width: 1100px;
  max-height: 700px;
  z-index: 3;
}

.cd-photo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: center center;
  will-change: transform, filter, opacity;
  pointer-events: none;
}

.cd-aura {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.5);
  width: 130%;
  height: 120%;
  border-radius: 50%;
  opacity: 0;
  background: radial-gradient(ellipse at center,
    rgba(140, 120, 255, 0.35) 0%,
    rgba(100, 80, 220, 0.12) 40%,
    rgba(60, 120, 200, 0.04) 70%,
    transparent 100%
  );
  filter: blur(12px);
  transition: opacity 0.5s ease, transform 0.5s ease;
  pointer-events: none;
  z-index: -1;
}

.cd-photo-inner {
  position: relative;
  width: 200px;
  height: 134px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow:
    0 0 30px rgba(80, 60, 180, 0.2),
    0 4px 20px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(100, 80, 220, 0.12);
}

.cd-photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.cd-photo-tint {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(135deg, rgba(100, 70, 200, 0.08) 0%, transparent 50%),
    linear-gradient(to bottom, transparent 55%, rgba(20, 10, 60, 0.25) 100%);
  border-radius: 8px;
}

.cd-label {
  position: absolute;
  bottom: -22px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.08em;
  color: rgba(180, 160, 240, 0.5);
  white-space: nowrap;
  text-shadow: 0 0 8px rgba(120, 80, 220, 0.3);
}

.cd-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotateX(70deg);
  width: 120%;
  height: 100%;
  border-radius: 50%;
  border: 1px solid rgba(100, 70, 200, 0.06);
  pointer-events: none;
}

.cd-vignette {
  position: absolute;
  inset: 0;
  z-index: 8;
  pointer-events: none;
  background: radial-gradient(ellipse at center,
    transparent 28%,
    rgba(3, 2, 15, 0.2) 48%,
    rgba(3, 2, 15, 0.5) 68%,
    rgba(2, 1, 10, 0.85) 90%
  );
}

.cd-progress {
  position: absolute;
  bottom: 6%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 16;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  pointer-events: none;
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.cd-progress-dots {
  display: flex;
  gap: 8px;
}

.cd-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: rgba(120, 90, 200, 0.18);
  transition: all 0.4s ease;

  &.active {
    background: rgba(180, 150, 255, 0.7);
    box-shadow: 0 0 10px rgba(140, 100, 240, 0.4);
  }
}

.cd-progress-name {
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.06em;
  color: rgba(160, 140, 220, 0.45);
  text-shadow: 0 0 6px rgba(100, 70, 200, 0.2);
}

.cd-title-area {
  position: absolute;
  top: 8%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 14;
  text-align: center;
  pointer-events: none;
}

.cd-title {
  font-size: clamp(1.8rem, 5vw, 3.4rem);
  font-weight: 200;
  letter-spacing: 0.15em;
  color: #d4c8f0;
  text-shadow:
    0 0 30px rgba(140, 100, 220, 0.3),
    0 0 60px rgba(100, 60, 200, 0.12);
  margin: 0 0 10px;
}

.cd-line {
  width: 100px;
  height: 1px;
  margin: 0 auto 10px;
  background: linear-gradient(90deg,
    rgba(130, 90, 210, 0.1),
    rgba(170, 140, 240, 0.4),
    rgba(130, 90, 210, 0.1)
  );
  border-radius: 1px;
  transform-origin: center;
}

.cd-subtitle {
  font-size: clamp(0.6rem, 1vw, 0.78rem);
  font-weight: 400;
  letter-spacing: 0.06em;
  color: rgba(160, 130, 200, 0.3);
  margin: 0;
  font-family: 'Courier New', monospace;
}
</style>
