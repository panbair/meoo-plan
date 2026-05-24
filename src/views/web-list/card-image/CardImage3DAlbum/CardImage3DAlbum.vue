<template>
  <div class="album-3d-section" ref="sectionRef">
    <!-- 背景层 -->
    <div class="album-bg"></div>

    <!-- 粒子背景 -->
    <canvas ref="particleCanvasRef" class="album-particles"></canvas>

    <!-- 3D 场景舞台 -->
    <div class="album-stage" ref="stageRef">
      <div
        class="album-cylinder"
        ref="cylinderRef"
        :style="{ transform: `rotateY(${cylinderAngle}deg)` }"
      >
        <div
          v-for="(photo, idx) in photos"
          :key="photo.id"
          class="album-card"
          :ref="el => { if (el) cardRefs[idx] = el as HTMLElement }"
          :style="getCardStyle(idx)"
        >
          <div class="card-front-face">
            <img :src="photo.url" :alt="photo.title" />
            <div class="card-label">{{ photo.title }}</div>
          </div>
          <div class="card-glass"></div>
          <div class="card-edge-glow"></div>
        </div>
      </div>

      <!-- 中心光柱 -->
      <div class="center-pillar" ref="pillarRef">
        <div class="pillar-beam"></div>
        <div class="pillar-ring" v-for="i in 3" :key="i"></div>
      </div>

      <!-- 地面反射环 -->
      <div class="floor-ring" ref="floorRingRef"></div>
    </div>

    <!-- 快门暗角 -->
    <div class="album-vignette" ref="vignetteRef"></div>

    <!-- 进度指示器 -->
    <div class="album-progress" ref="progressRef">
      <div class="progress-label">PHOTO {{ Math.round(currentIndex + 1) }} / {{ photoCount }}</div>
      <div class="progress-track">
        <div class="progress-bar" ref="progressBarRef"></div>
      </div>
    </div>

    <!-- 内容覆盖 -->
    <div class="album-content" ref="contentRef">
      <h2 class="album-title" ref="titleRef">3D 记忆相册</h2>
      <div class="album-divider" ref="dividerRef"></div>
      <p class="album-sub" ref="subRef">Cylindrical Memory Gallery · Scroll to Rotate</p>
      <p class="album-photo-name" ref="photoNameRef">{{ photos[Math.round(currentIndex)]?.title || 'Memory' }}</p>
    </div>

    <!-- 左右导航提示 -->
    <div class="album-hint" ref="hintRef">
      <span class="hint-arrow">↻</span>
      <span class="hint-text">SCROLL</span>
      <span class="hint-arrow">↺</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void

// ==================== Props ====================
const props = withDefaults(defineProps<{
  imageUrl?: string
  title?: string
  subtitle?: string
}>(), {
  imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=600&fit=crop',
  title: '3D 记忆相册',
  subtitle: 'Cylindrical Memory Gallery'
})

// ==================== 照片数据 ====================
interface PhotoItem {
  id: number
  url: string
  title: string
}

const photoUrls = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=800&h=600&fit=crop',
]

const photos = ref<PhotoItem[]>(
  photoUrls.map((url, i) => ({
    id: i + 1,
    url,
    title: ['山间晨光', '森林小径', '海边日落', '海浪拍岸', '林间光影',
            '远山淡影', '秋日草原', '瀑布飞流', '星轨夜空', '春日花海'][i]
  }))
)

const photoCount = computed(() => photos.value.length)

// ==================== Refs ====================
const sectionRef = ref<HTMLElement | null>(null)
const cylinderRef = ref<HTMLElement | null>(null)
const stageRef = ref<HTMLElement | null>(null)
const particleCanvasRef = ref<HTMLCanvasElement | null>(null)
const pillarRef = ref<HTMLElement | null>(null)
const floorRingRef = ref<HTMLElement | null>(null)
const vignetteRef = ref<HTMLElement | null>(null)
const progressRef = ref<HTMLElement | null>(null)
const progressBarRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const dividerRef = ref<HTMLElement | null>(null)
const subRef = ref<HTMLElement | null>(null)
const photoNameRef = ref<HTMLElement | null>(null)
const hintRef = ref<HTMLElement | null>(null)

const cardRefs = ref<(HTMLElement | null)[]>([])

let cleanupFns: TweenCleanup[] = []

// ==================== 3D 状态 ====================
const currentIndex = ref(0)
const cylinderAngle = ref(0)

const angleStep = computed(() => 360 / photoCount.value)

function getCardStyle(idx: number) {
  const angle = angleStep.value * idx
  const radius = 380
  return {
    transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
  }
}

// ==================== 粒子系统 ====================
interface Particle {
  x: number; y: number; size: number;
  vx: number; vy: number; opacity: number; hue: number
}
let particles: Particle[] = []
let particleAnimId = 0
let canvasW = 0
let canvasH = 0

function initParticles() {
  const canvas = particleCanvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  canvasW = window.innerWidth
  canvasH = window.innerHeight
  canvas.width = canvasW
  canvas.height = canvasH

  particles = Array.from({ length: 50 }, () => ({
    x: Math.random() * canvasW,
    y: Math.random() * canvasH,
    size: Math.random() * 2.5 + 0.8,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    opacity: Math.random() * 0.4 + 0.1,
    hue: Math.random() * 40 + 200,
  }))

  function animate() {
    if (!ctx) return
    ctx.clearRect(0, 0, canvasW, canvasH)

    particles.forEach(p => {
      p.x += p.vx
      p.y += p.vy
      if (p.x < -10) p.x = canvasW + 10
      if (p.x > canvasW + 10) p.x = -10
      if (p.y < -10) p.y = canvasH + 10
      if (p.y > canvasH + 10) p.y = -10

      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fillStyle = `hsla(${p.hue}, 60%, 70%, ${p.opacity})`
      ctx.fill()

      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2)
      ctx.fillStyle = `hsla(${p.hue}, 60%, 70%, ${p.opacity * 0.15})`
      ctx.fill()
    })

    particleAnimId = requestAnimationFrame(animate)
  }
  animate()
}

// ==================== 安装 ====================
onMounted(() => {
  if (!sectionRef.value) return

  nextTick(() => {
    initParticles()
    setupScrollAnimation()
  })
})

function nextTick(fn: () => void) {
  requestAnimationFrame(() => requestAnimationFrame(fn))
}

function setupScrollAnimation() {
  const container = sectionRef.value
  if (!container) return

  // ===== 初始状态 =====
  gsap.set(pillarRef.value, { scale: 0.3, opacity: 0 })
  gsap.set(floorRingRef.value, { scaleX: 0.4, opacity: 0 })
  gsap.set(vignetteRef.value, { opacity: 0.3 })
  gsap.set(progressBarRef.value, { width: '0%' })
  gsap.set(contentRef.value, { opacity: 0, y: 30 })
  gsap.set(hintRef.value, { opacity: 0.5 })
  gsap.set(photoNameRef.value, { opacity: 0, y: 8 })

  // 卡片初始：散开状态（略微随机偏移）
  cardRefs.value.forEach((el, i) => {
    if (!el) return
    const angle = angleStep.value * i
    const rad = (angle * Math.PI) / 180
    const scatteredX = Math.cos(rad) * 30
    const scatteredZ = -20 + Math.random() * 40
    el.style.transform = `rotateY(${angle}deg) translateZ(380px) translateX(${scatteredX}px) translateZ(${scatteredZ}px)`
  })

  // ===== 主 ScrollTrigger =====
  const mainSt = ScrollTrigger.create({
    trigger: container,
    start: 'top 90%',
    end: 'bottom 10%',
    scrub: 1.2,
    onUpdate(self) {
      const p = self.progress

      // 圆柱体旋转：0 → 1 对应旋转 0° → 360°
      const totalRotation = p * 360
      cylinderAngle.value = totalRotation

      // 当前正面的照片索引 (正面的方向为旋转角 + 90° 补偿)
      const faceAngle = totalRotation
      const idx = ((faceAngle / angleStep.value) + photoCount.value) % photoCount.value
      currentIndex.value = idx

      // 高亮正面卡片，渐隐侧面卡片
      cardRefs.value.forEach((el, i) => {
        if (!el) return
        const cardAngle = (angleStep.value * i - faceAngle + 360) % 360
        // 计算卡片与正面的夹角，0°=正面，180°=背面
        let diff = Math.abs(cardAngle)
        if (diff > 180) diff = 360 - diff

        // 亮度：正面最亮(1)，侧面渐暗(0.35)
        const brightness = 0.35 + 0.65 * Math.max(0, 1 - diff / 90)
        const cardEl = el as HTMLElement
        cardEl.style.filter = `brightness(${brightness.toFixed(2)})`
        cardEl.style.zIndex = String(Math.round(brightness * 10))
      })

      // 中心光柱增强
      if (pillarRef.value) {
        pillarRef.value.style.opacity = String(0.15 + p * 0.5)
        pillarRef.value.style.transform = `scale(${0.3 + p * 1.0})`
      }

      // 地面反射环
      if (floorRingRef.value) {
        floorRingRef.value.style.opacity = String(0.1 + p * 0.35)
        floorRingRef.value.style.transform = `scaleX(${0.4 + p * 1.1})`
      }

      // 暗角渐弱
      if (vignetteRef.value) {
        vignetteRef.value.style.opacity = String(0.3 * (1 - p * 0.7))
      }

      // 进度条
      if (progressBarRef.value) {
        progressBarRef.value.style.width = `${p * 100}%`
      }

      // 导航提示淡出
      if (hintRef.value) {
        hintRef.value.style.opacity = String(0.5 * (1 - p))
      }

      // 照片名
      if (photoNameRef.value) {
        const fadeIn = p > 0.1 ? (Math.min(1, (p - 0.1) / 0.15)) : 0
        photoNameRef.value.style.opacity = String(fadeIn)
        photoNameRef.value.style.transform = `translateY(${(1 - fadeIn) * 8}px)`
      }
    },
    onLeaveBack() {
      // 重置状态
      cylinderAngle.value = 0
      currentIndex.value = 0
      cardRefs.value.forEach(el => {
        if (el) {
          el.style.filter = 'brightness(0.35)'
          el.style.zIndex = '1'
        }
      })
      if (pillarRef.value) { pillarRef.value.style.opacity = '0'; pillarRef.value.style.transform = 'scale(0.3)' }
      if (floorRingRef.value) { floorRingRef.value.style.opacity = '0'; floorRingRef.value.style.transform = 'scaleX(0.4)' }
      if (vignetteRef.value) vignetteRef.value.style.opacity = '0.3'
      if (progressBarRef.value) progressBarRef.value.style.width = '0%'
      if (hintRef.value) hintRef.value.style.opacity = '0.5'
      if (photoNameRef.value) { photoNameRef.value.style.opacity = '0'; photoNameRef.value.style.transform = 'translateY(8px)' }
    },
  })
  cleanupFns.push(() => mainSt.kill())

  // ===== 文字入场 =====
  if (contentRef.value) {
    const textTl = gsap.timeline({
      scrollTrigger: { trigger: container, start: 'top 70%', end: 'top 20%', scrub: 0.8 },
    })
    cleanupFns.push(() => textTl.kill())

    textTl.fromTo(contentRef.value, { opacity: 0, y: 30 }, { opacity: 1, y: 0, ease: 'power3.out' }, 0)
    if (titleRef.value) textTl.fromTo(titleRef.value, { opacity: 0, y: 18, filter: 'blur(6px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', ease: 'expo.out' }, 0.04)
    if (dividerRef.value) textTl.fromTo(dividerRef.value, { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, ease: 'power3.out' }, 0.08)
    if (subRef.value) textTl.fromTo(subRef.value, { opacity: 0, y: 10 }, { opacity: 1, y: 0, ease: 'power3.out' }, 0.12)
  }
}

// ==================== 窗口缩放 ====================
let resizeTimer: number | null = null
function handleResize() {
  if (resizeTimer) clearTimeout(resizeTimer)
  resizeTimer = window.setTimeout(() => {
    const canvas = particleCanvasRef.value
    if (canvas) {
      canvasW = window.innerWidth
      canvasH = window.innerHeight
      canvas.width = canvasW
      canvas.height = canvasH
    }
  }, 300)
}
window.addEventListener('resize', handleResize)

// ==================== 清理 ====================
onUnmounted(() => {
  if (resizeTimer) clearTimeout(resizeTimer)
  window.removeEventListener('resize', handleResize)
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(st => { if (st.vars.trigger === sectionRef.value) st.kill() })
  cancelAnimationFrame(particleAnimId)
})
</script>

<style scoped lang="scss">
// ==================== 容器 ====================
.album-3d-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: radial-gradient(ellipse at 50% 45%, #14142a 0%, #0c0c1a 45%, #060610 100%);
}

// ==================== 背景 ====================
.album-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(ellipse at 50% 40%, rgba(40, 80, 180, 0.06) 0%, transparent 60%),
    radial-gradient(ellipse at 30% 60%, rgba(120, 60, 200, 0.03) 0%, transparent 50%);
}

// ==================== 粒子 ====================
.album-particles {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

// ==================== 3D 舞台 ====================
.album-stage {
  position: absolute;
  inset: 0;
  z-index: 2;
  perspective: 1400px;
  perspective-origin: 50% 42%;
}

// ==================== 圆柱体 ====================
.album-cylinder {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  transform-style: preserve-3d;
  transition: filter 0.3s ease;
}

// ==================== 卡片 ====================
.album-card {
  position: absolute;
  width: 240px;
  height: 340px;
  left: -120px;
  top: -170px;
  transform-style: preserve-3d;
  transition: filter 0.4s ease, z-index 0.4s ease;
  cursor: default;
}

.card-front-face {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
  box-shadow:
    0 15px 50px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}

.card-label {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 14px 16px;
  background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-shadow: 0 0 10px rgba(100, 160, 255, 0.4);
}

.card-glass {
  position: absolute;
  inset: 0;
  border-radius: 16px;
  background: linear-gradient(135deg,
    rgba(140, 200, 255, 0.06) 0%,
    rgba(100, 160, 255, 0.02) 40%,
    rgba(180, 130, 255, 0.04) 70%,
    rgba(80, 120, 220, 0.01) 100%
  );
  pointer-events: none;
}

.card-edge-glow {
  position: absolute;
  inset: -1px;
  border-radius: 17px;
  border: 1px solid rgba(120, 180, 255, 0.2);
  box-shadow:
    inset 0 0 8px rgba(130, 180, 255, 0.08),
    0 0 15px rgba(100, 150, 255, 0.1);
  pointer-events: none;
  transition: all 0.4s ease;
}

// ==================== 中心光柱 ====================
.center-pillar {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 3;
}

.pillar-beam {
  width: 80px;
  height: 400px;
  background: radial-gradient(ellipse at center,
    rgba(80, 140, 255, 0.15) 0%,
    rgba(100, 160, 255, 0.05) 30%,
    transparent 70%
  );
  transform: translate(-50%, -50%);
  filter: blur(30px);
}

.pillar-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  border: 1px solid rgba(100, 150, 255, 0.12);
  transform: translate(-50%, -50%);
  pointer-events: none;
  animation: ringPulse 4s ease-in-out infinite;

  &:nth-child(2) {
    width: 120px;
    height: 120px;
    animation-delay: 0s;
  }
  &:nth-child(3) {
    width: 200px;
    height: 200px;
    animation-delay: 1.3s;
  }
  &:nth-child(4) {
    width: 300px;
    height: 300px;
    animation-delay: 2.6s;
  }
}

@keyframes ringPulse {
  0%, 100% { opacity: 0.15; transform: translate(-50%, -50%) scale(0.95); }
  50% { opacity: 0.35; transform: translate(-50%, -50%) scale(1.05); }
}

// ==================== 地面反射环 ====================
.floor-ring {
  position: absolute;
  bottom: 8%;
  left: 50%;
  width: 500px;
  height: 80px;
  transform: translate(-50%, 0) scaleX(0.4);
  transform-origin: center;
  border-radius: 50%;
  background: radial-gradient(ellipse at center,
    rgba(60, 120, 220, 0.18) 0%,
    rgba(40, 90, 180, 0.06) 40%,
    transparent 70%
  );
  filter: blur(20px);
  pointer-events: none;
}

// ==================== 暗角 ====================
.album-vignette {
  position: absolute;
  inset: 0;
  z-index: 8;
  pointer-events: none;
  background: radial-gradient(ellipse at center,
    transparent 45%,
    rgba(0, 0, 0, 0.1) 62%,
    rgba(0, 0, 0, 0.25) 78%,
    rgba(0, 0, 0, 0.55) 92%,
    rgba(0, 0, 0, 0.8) 100%
  );
}

// ==================== 进度 ====================
.album-progress {
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 15;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  pointer-events: none;
}

.progress-label {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  letter-spacing: 2px;
  color: rgba(130, 180, 240, 0.6);
  text-transform: uppercase;
}

.progress-track {
  width: 200px;
  height: 2px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg,
    rgba(60, 140, 240, 0.4),
    rgba(100, 180, 255, 0.7),
    rgba(160, 210, 255, 0.6),
    rgba(100, 180, 255, 0.4)
  );
  border-radius: 2px;
  box-shadow: 0 0 8px rgba(60, 150, 240, 0.3);
}

// ==================== 内容文字 ====================
.album-content {
  position: absolute;
  bottom: 18%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 14;
  text-align: center;
  pointer-events: none;
}

.album-title {
  font-size: clamp(2rem, 5vw, 3.8rem);
  font-weight: 800;
  letter-spacing: 0.05em;
  color: #fff;
  text-shadow:
    0 0 30px rgba(60, 140, 240, 0.5),
    0 0 60px rgba(100, 120, 230, 0.3),
    0 0 100px rgba(40, 90, 200, 0.15);
  margin: 0 0 12px;
  line-height: 1.15;
}

.album-divider {
  width: 60px;
  height: 2px;
  margin: 0 auto 10px;
  background: linear-gradient(90deg,
    rgba(40, 130, 220, 0.2),
    rgba(80, 170, 240, 0.6),
    rgba(40, 130, 220, 0.2)
  );
  border-radius: 2px;
  transform-origin: center;
}

.album-sub {
  font-size: clamp(0.62rem, 1.1vw, 0.8rem);
  font-weight: 400;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.06em;
  color: rgba(120, 170, 230, 0.45);
  margin: 0 0 6px;
}

.album-photo-name {
  font-size: clamp(0.85rem, 1.4vw, 1.1rem);
  font-weight: 600;
  letter-spacing: 0.08em;
  color: rgba(180, 210, 255, 0.7);
  text-shadow: 0 0 15px rgba(80, 160, 240, 0.3);
  margin: 4px 0 0;
  transition: all 0.3s ease;
}

// ==================== 滚动提示 ====================
.album-hint {
  position: absolute;
  bottom: 4%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 14;
  display: flex;
  align-items: center;
  gap: 10px;
  pointer-events: none;
  color: rgba(255, 255, 255, 0.3);
  font-family: 'Courier New', monospace;
  font-size: 11px;
  letter-spacing: 4px;
  text-transform: uppercase;

  .hint-arrow {
    font-size: 16px;
    animation: hintBounce 2s ease-in-out infinite;
    &:last-child { animation-delay: 1s; }
  }

  .hint-text {
    animation: hintBlink 2.5s ease-in-out infinite;
  }
}

@keyframes hintBounce {
  0%, 100% { transform: translateX(0); opacity: 0.4; }
  50% { transform: translateX(6px); opacity: 1; }
}

@keyframes hintBlink {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.7; }
}
</style>
