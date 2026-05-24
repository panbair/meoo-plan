<template>
  <div class="fs-section" ref="sectionRef">
    <!-- 深色背景 -->
    <div class="fs-bg"></div>

    <!-- 胶片颗粒 Canvas -->
    <canvas ref="grainCanvasRef" class="fs-grain"></canvas>

    <!-- 胶片卷轴舞台 -->
    <div class="fs-stage" ref="stageRef">
      <div class="fs-film-strip" ref="stripRef" :style="{ transform: 'translateX(' + stripTranslateX + 'px)' }">
        <!-- 上排齿孔 -->
        <div class="fs-sprocket-row fs-sprocket-top">
          <span v-for="n in sprocketCount" :key="'t'+n" class="fs-sprocket"></span>
        </div>

        <!-- 胶片帧序列 -->
        <div class="fs-frames-row">
          <div
            v-for="(photo, idx) in photos"
            :key="photo.id"
            class="fs-frame"
            :ref="el => { if (el) frameRefs[idx] = el as HTMLElement }"
          >
            <div class="fs-frame-inner">
              <img :src="photo.url" :alt="photo.title" class="fs-frame-img" crossorigin="anonymous" />
              <div class="fs-frame-tone"></div>
            </div>
            <span class="fs-frame-number" :class="{ active: idx === activeFrameIdx }">
              {{ String(photo.id).padStart(2, '0') }}
            </span>
          </div>
        </div>

        <!-- 下排齿孔 -->
        <div class="fs-sprocket-row fs-sprocket-bottom">
          <span v-for="n in sprocketCount" :key="'b'+n" class="fs-sprocket"></span>
        </div>

        <!-- 漏光效果 -->
        <div class="fs-light-leak" ref="leakLeftRef"></div>
        <div class="fs-light-leak fs-light-leak-right" ref="leakRightRef"></div>
      </div>
    </div>

    <!-- 暗角 -->
    <div class="fs-vignette" ref="vignetteRef"></div>

    <!-- 进度指示器 -->
    <div class="fs-progress" ref="progressRef">
      <div class="fs-progress-frame">
        <span class="fs-progress-label">FRAME {{ String(activeFrameIdx + 1).padStart(2, '0') }}</span>
        <span class="fs-progress-dots">
          <span v-for="n in photos.length" :key="n" class="fs-dot"
            :class="{ active: n <= activeFrameIdx + 1 }"></span>
        </span>
      </div>
      <div class="fs-progress-track">
        <div class="fs-progress-bar" ref="progressBarRef"></div>
      </div>
    </div>

    <!-- 内容覆盖 -->
    <div class="fs-content" ref="contentRef">
      <h2 class="fs-title" ref="titleRef">胶片卷轴</h2>
      <div class="fs-divider" ref="dividerRef"></div>
      <p class="fs-sub" ref="subRef">Film Strip Scroller</p>
      <p class="fs-current" ref="currentRef">{{ photos[activeFrameIdx]?.title || 'Memory' }}</p>
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
withDefaults(defineProps<{
  imageUrl?: string
  title?: string
  subtitle?: string
}>(), {
  imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=600&fit=crop',
  title: '胶片卷轴',
  subtitle: 'Film Strip'
})

// ==================== 照片数据 ====================
interface PhotoItem {
  id: number
  url: string
  title: string
}

const photoUrls = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=700&h=470&fit=crop',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=700&h=470&fit=crop',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&h=470&fit=crop',
  'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=700&h=470&fit=crop',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=700&h=470&fit=crop',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=700&h=470&fit=crop',
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=700&h=470&fit=crop',
  'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=700&h=470&fit=crop',
]

const titles = [
  '山间晨光', '森林小径', '海边日落', '海浪拍岸',
  '林间光影', '远山淡影', '秋日草原', '瀑布飞流'
]

const photos = ref<PhotoItem[]>(
  photoUrls.map((url, i) => ({
    id: i + 1,
    url,
    title: titles[i]
  }))
)

const sprocketCount = 80

// ==================== Refs ====================
const sectionRef = ref<HTMLElement | null>(null)
const stageRef = ref<HTMLElement | null>(null)
const stripRef = ref<HTMLElement | null>(null)
const grainCanvasRef = ref<HTMLCanvasElement | null>(null)
const leakLeftRef = ref<HTMLElement | null>(null)
const leakRightRef = ref<HTMLElement | null>(null)
const vignetteRef = ref<HTMLElement | null>(null)
const progressBarRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const dividerRef = ref<HTMLElement | null>(null)
const subRef = ref<HTMLElement | null>(null)
const currentRef = ref<HTMLElement | null>(null)
const frameRefs = ref<(HTMLElement | null)[]>([])

const activeFrameIdx = ref(0)
const stripTranslateX = ref(0)

let cleanupFns: TweenCleanup[] = []

// ==================== 胶片颗粒 Canvas ====================
interface GrainParticle {
  x: number; y: number; size: number; opacity: number; life: number; age: number
}
let grainParticles: GrainParticle[] = []
let grainAnimId = 0
let grainCW = 0
let grainCH = 0

function initGrain() {
  const canvas = grainCanvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  grainCW = window.innerWidth
  grainCH = window.innerHeight
  canvas.width = grainCW
  canvas.height = grainCH

  function spawnBatch() {
    for (let i = 0; i < 6; i++) {
      grainParticles.push({
        x: Math.random() * grainCW,
        y: Math.random() * grainCH,
        size: Math.random() * 1.2 + 0.3,
        opacity: Math.random() * 0.1 + 0.02,
        life: 1 + Math.random() * 1.5,
        age: 0,
      })
    }
    if (grainParticles.length > 300) grainParticles = grainParticles.slice(-250)
  }

  function animate() {
    if (!ctx || !grainCanvasRef.value) return
    ctx.clearRect(0, 0, grainCW, grainCH)
    if (Math.random() < 0.5) spawnBatch()

    for (let i = grainParticles.length - 1; i >= 0; i--) {
      const p = grainParticles[i]
      p.age += 0.016
      if (p.age >= p.life) { grainParticles.splice(i, 1); continue }
      const alpha = p.opacity * (1 - p.age / p.life)
      if (alpha > 0.005) {
        ctx.fillStyle = `rgba(0,0,0,${alpha.toFixed(3)})`
        ctx.fillRect(p.x, p.y, p.size, p.size)
      }
    }
    grainAnimId = requestAnimationFrame(animate)
  }
  animate()
}

// ==================== 挂载 ====================
onMounted(() => {
  if (!sectionRef.value) return
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      initGrain()
      setupScrollAnimation()
    })
  })
})

function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)) }

function setupScrollAnimation() {
  const container = sectionRef.value
  if (!container) return

  const stage = stageRef.value
  if (!stage) return

  const strip = stripRef.value
  if (!strip) return

  // 等待布局完成后读取尺寸
  const stripWidth = strip.scrollWidth
  const stageWidth = stage.getBoundingClientRect().width
  const totalFrames = photos.value.length

  // 每帧所占胶片宽度的比例
  const frameUnit = stripWidth / totalFrames
  // 初始偏移：第一帧居中，胶片向右偏移
  const startX = stageWidth * 0.35
  // 结束偏移：最后一帧居中，胶片向左偏移
  const endX = -(stripWidth - stageWidth + stageWidth * 0.35)

  // 至少需要能卷动
  if (endX >= startX) {
    // 胶片不够宽，不卷动
    return
  }

  // ===== 初始状态 =====
  stripTranslateX.value = startX
  gsap.set(leakLeftRef.value, { opacity: 0.45 })
  gsap.set(leakRightRef.value, { opacity: 0.12 })
  gsap.set(vignetteRef.value, { opacity: 0.6 })
  gsap.set(progressBarRef.value, { width: '0%' })
  gsap.set(contentRef.value, { opacity: 0, y: 20 })
  gsap.set(currentRef.value, { opacity: 0, y: 6 })

  // 帧初始状态
  frameRefs.value.forEach(el => {
    if (el) el.style.filter = 'brightness(0.55)'
  })
  if (frameRefs.value[0]) frameRefs.value[0].style.filter = 'brightness(1)'

  activeFrameIdx.value = 0
  stripTranslateX.value = startX

  // ===== 主 ScrollTrigger =====
  const mainSt = ScrollTrigger.create({
    trigger: container,
    start: 'top 90%',
    end: 'bottom 10%',
    scrub: 1.3,
    onUpdate(self) {
      const p = clamp(self.progress, 0, 1)

      // 胶片水平位移 (线性插值)
      const x = startX + p * (endX - startX)
      stripTranslateX.value = x

      // 当前帧索引
      const idx = Math.min(totalFrames - 1, Math.floor(p * totalFrames))
      activeFrameIdx.value = idx

      // 帧高亮
      frameRefs.value.forEach((el, i) => {
        if (!el) return
        const diff = Math.abs(i - idx)
        const brightness = i === idx
          ? 1
          : Math.max(0.45, 0.75 - diff * 0.15)
        el.style.filter = `brightness(${brightness.toFixed(2)})`
      })

      // 漏光
      if (leakLeftRef.value) leakLeftRef.value.style.opacity = String((0.12 + Math.sin(p * Math.PI) * 0.33).toFixed(3))
      if (leakRightRef.value) leakRightRef.value.style.opacity = String((0.04 + Math.sin(p * Math.PI + 0.5) * 0.22).toFixed(3))

      // 暗角
      if (vignetteRef.value) vignetteRef.value.style.opacity = String((0.6 - p * 0.18).toFixed(3))

      // 进度条
      if (progressBarRef.value) progressBarRef.value.style.width = `${p * 100}%`

      // 照片标题
      if (currentRef.value) {
        const show = p > 0.06
        currentRef.value.style.opacity = show ? '1' : '0'
        currentRef.value.style.transform = show ? 'translateY(0)' : 'translateY(6px)'
      }
    },
    onLeaveBack() {
      stripTranslateX.value = startX
      activeFrameIdx.value = 0
      frameRefs.value.forEach((el, i) => {
        if (el) el.style.filter = i === 0 ? 'brightness(1)' : 'brightness(0.55)'
      })
      if (leakLeftRef.value) leakLeftRef.value.style.opacity = '0.45'
      if (leakRightRef.value) leakRightRef.value.style.opacity = '0.12'
      if (vignetteRef.value) vignetteRef.value.style.opacity = '0.6'
      if (progressBarRef.value) progressBarRef.value.style.width = '0%'
      if (currentRef.value) { currentRef.value.style.opacity = '0'; currentRef.value.style.transform = 'translateY(6px)' }
    },
  })
  cleanupFns.push(() => mainSt.kill())

  // ===== 文字入场 =====
  if (contentRef.value) {
    const textTl = gsap.timeline({
      scrollTrigger: { trigger: container, start: 'top 72%', end: 'top 24%', scrub: 0.9 },
    })
    cleanupFns.push(() => textTl.kill())

    textTl.fromTo(contentRef.value, { opacity: 0, y: 20 }, { opacity: 1, y: 0, ease: 'power3.out' }, 0)
    if (titleRef.value) textTl.fromTo(titleRef.value, { opacity: 0, y: 14, filter: 'blur(3px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', ease: 'expo.out' }, 0.04)
    if (dividerRef.value) textTl.fromTo(dividerRef.value, { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, ease: 'power3.out' }, 0.08)
    if (subRef.value) textTl.fromTo(subRef.value, { opacity: 0, y: 8 }, { opacity: 1, y: 0, ease: 'power3.out' }, 0.12)
  }
}

// ==================== 窗口缩放 ====================
let resizeTimer: number | null = null
function handleResize() {
  if (resizeTimer) clearTimeout(resizeTimer)
  resizeTimer = window.setTimeout(() => {
    const canvas = grainCanvasRef.value
    if (canvas) {
      grainCW = window.innerWidth
      grainCH = window.innerHeight
      canvas.width = grainCW
      canvas.height = grainCH
    }
  }, 400)
}
window.addEventListener('resize', handleResize)

// ==================== 清理 ====================
onUnmounted(() => {
  if (resizeTimer) clearTimeout(resizeTimer)
  window.removeEventListener('resize', handleResize)
  cleanupFns.forEach(fn => fn())
  cancelAnimationFrame(grainAnimId)
})
</script>

<style scoped lang="scss">
.fs-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #0e0a06;
}

.fs-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(ellipse at 50% 45%, rgba(80, 50, 20, 0.07) 0%, transparent 60%),
    radial-gradient(ellipse at 30% 55%, rgba(60, 35, 15, 0.04) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 40%, rgba(50, 30, 10, 0.03) 0%, transparent 50%);
}

.fs-grain {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  mix-blend-mode: overlay;
}

// ==================== 舞台 ====================
.fs-stage {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 340px;
  transform: translateY(-50%);
  z-index: 2;
  overflow: hidden;
}

// ==================== 胶片卷轴 ====================
.fs-film-strip {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  will-change: transform;
}

// ==================== 齿孔行 ====================
.fs-sprocket-row {
  display: flex;
  gap: 8px;
  height: 24px;
  align-items: center;
  padding: 0 26px;
  background: #1a140c;
  flex-shrink: 0;
}

.fs-sprocket-top {
  border-bottom: 1px solid rgba(60, 40, 15, 0.4);
}
.fs-sprocket-bottom {
  border-top: 1px solid rgba(60, 40, 15, 0.4);
}

.fs-sprocket {
  display: block;
  width: 14px;
  height: 16px;
  border-radius: 2px;
  background: #0a0804;
  border: 1px solid rgba(40, 25, 10, 0.5);
  flex-shrink: 0;
}

// ==================== 帧行 ====================
.fs-frames-row {
  position: relative;
  display: flex;
  gap: 18px;
  align-items: center;
  flex: 1;
  padding: 6px 26px;
  background: linear-gradient(to bottom,
    rgba(20, 14, 8, 0.92),
    rgba(18, 12, 6, 0.88),
    rgba(20, 14, 8, 0.92)
  );
}

// ==================== 帧 ====================
.fs-frame {
  position: relative;
  width: 440px;
  height: 275px;
  flex-shrink: 0;
  border-radius: 3px;
  overflow: visible;
  transition: filter 0.45s ease;
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.45),
    0 1px 0 rgba(120, 90, 50, 0.06) inset;
}

.fs-frame-inner {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 3px;
  overflow: hidden;
  border: 1px solid rgba(60, 40, 15, 0.3);
}

.fs-frame-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.fs-frame-tone {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(135deg, rgba(200, 150, 80, 0.07) 0%, transparent 55%),
    linear-gradient(to bottom, transparent 58%, rgba(30, 15, 5, 0.18) 100%);
}

.fs-frame-number {
  position: absolute;
  bottom: -24px;
  right: 8px;
  font-family: 'Courier New', monospace;
  font-size: 10px;
  letter-spacing: 2px;
  color: rgba(180, 140, 90, 0.35);
  transition: all 0.45s ease;

  &.active {
    color: rgba(240, 200, 120, 0.9);
    text-shadow: 0 0 10px rgba(210, 160, 80, 0.4);
  }
}

// ==================== 漏光 ====================
.fs-light-leak {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 200px;
  z-index: 5;
  pointer-events: none;
  left: 0;
  background: linear-gradient(to right,
    rgba(255, 200, 100, 0.18) 0%,
    rgba(255, 160, 70, 0.06) 35%,
    transparent 100%
  );
  mix-blend-mode: screen;

  &.fs-light-leak-right {
    left: auto;
    right: 0;
    background: linear-gradient(to left,
      rgba(255, 180, 90, 0.1) 0%,
      rgba(255, 140, 50, 0.03) 35%,
      transparent 100%
    );
  }
}

// ==================== 暗角 ====================
.fs-vignette {
  position: absolute;
  inset: 0;
  z-index: 8;
  pointer-events: none;
  background: radial-gradient(ellipse at center,
    transparent 33%,
    rgba(5, 3, 1, 0.12) 52%,
    rgba(5, 3, 1, 0.38) 70%,
    rgba(5, 3, 1, 0.7) 86%,
    rgba(3, 2, 0, 0.9) 100%
  );
}

// ==================== 进度 ====================
.fs-progress {
  position: absolute;
  bottom: 8%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 15;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  pointer-events: none;
}

.fs-progress-frame {
  display: flex;
  align-items: center;
  gap: 14px;
}

.fs-progress-label {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  letter-spacing: 3px;
  color: rgba(200, 160, 100, 0.7);
}

.fs-progress-dots {
  display: flex;
  gap: 6px;
}

.fs-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(140, 100, 50, 0.2);
  transition: all 0.4s ease;

  &.active {
    background: rgba(220, 170, 100, 0.7);
    box-shadow: 0 0 6px rgba(200, 150, 80, 0.35);
  }
}

.fs-progress-track {
  width: 240px;
  height: 1.5px;
  background: rgba(140, 100, 50, 0.08);
  border-radius: 2px;
  overflow: hidden;
}

.fs-progress-bar {
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg,
    rgba(180, 130, 70, 0.4),
    rgba(220, 170, 100, 0.7),
    rgba(180, 130, 70, 0.4)
  );
  border-radius: 2px;
  box-shadow: 0 0 8px rgba(200, 140, 70, 0.25);
}

// ==================== 内容覆盖 ====================
.fs-content {
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 14;
  text-align: center;
  pointer-events: none;
}

.fs-title {
  font-size: clamp(1.6rem, 4.8vw, 3.2rem);
  font-weight: 200;
  letter-spacing: 0.15em;
  color: #ede0c8;
  text-shadow:
    0 0 20px rgba(200, 150, 80, 0.25),
    0 0 50px rgba(160, 110, 50, 0.12);
  margin: 0 0 10px;
  line-height: 1.2;
}

.fs-divider {
  width: 90px;
  height: 1px;
  margin: 0 auto 10px;
  background: linear-gradient(90deg,
    rgba(170, 120, 60, 0.12),
    rgba(210, 160, 100, 0.45),
    rgba(170, 120, 60, 0.12)
  );
  border-radius: 1px;
  transform-origin: center;
}

.fs-sub {
  font-size: clamp(0.6rem, 1.0vw, 0.76rem);
  font-weight: 400;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.05em;
  color: rgba(180, 140, 90, 0.35);
  margin: 0;
}

.fs-current {
  margin: 14px 0 0;
  font-size: clamp(0.72rem, 1.2vw, 0.9rem);
  font-weight: 500;
  letter-spacing: 0.08em;
  color: rgba(210, 170, 110, 0.55);
  text-shadow: 0 0 10px rgba(180, 130, 70, 0.2);
  transition: all 0.3s ease;
}
</style>
