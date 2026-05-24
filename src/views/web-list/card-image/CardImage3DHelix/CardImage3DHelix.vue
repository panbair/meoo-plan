<template>
  <div class="dh-section" ref="sectionRef">
    <!-- 深空背景 -->
    <div class="dh-bg"></div>

    <!-- 分子粒子 Canvas -->
    <canvas ref="particleCanvasRef" class="dh-particles"></canvas>

    <!-- 3D 场景 -->
    <div class="dh-scene" ref="sceneRef">
      <div class="dh-helix" ref="helixRef" :style="{ transform: 'rotateY(' + helixRotation + 'deg)' }">
        <!-- 照片对 -->
        <template v-for="pairIdx in pairCount" :key="pairIdx">
          <!-- DNA 链 A -->
          <div
            class="dh-photo-wrap dh-strand-a"
            :ref="(el: any) => { if (el) photoARefs[pairIdx - 1] = el }"
            :style="photoStylesA[pairIdx - 1]"
            :data-pair="pairIdx"
            :data-strand="'A'"
          >
            <div class="dh-photo-frame">
              <img
                :src="photosA[pairIdx - 1].url"
                :alt="photosA[pairIdx - 1].title"
                class="dh-photo-img"
                crossorigin="anonymous"
              />
              <div class="dh-photo-glow"></div>
            </div>
            <span class="dh-photo-label">{{ photosA[pairIdx - 1].label }}</span>
          </div>

          <!-- 桥接对 -->
          <div
            class="dh-bridge"
            :ref="(el: any) => { if (el) bridgeRefs[pairIdx - 1] = el }"
            :style="bridgeStyles[pairIdx - 1]"
          >
            <div class="dh-bridge-bar"></div>
          </div>

          <!-- DNA 链 B -->
          <div
            class="dh-photo-wrap dh-strand-b"
            :ref="(el: any) => { if (el) photoBRefs[pairIdx - 1] = el }"
            :style="photoStylesB[pairIdx - 1]"
            :data-pair="pairIdx"
            :data-strand="'B'"
          >
            <div class="dh-photo-frame">
              <img
                :src="photosB[pairIdx - 1].url"
                :alt="photosB[pairIdx - 1].title"
                class="dh-photo-img"
                crossorigin="anonymous"
              />
              <div class="dh-photo-glow"></div>
            </div>
            <span class="dh-photo-label">{{ photosB[pairIdx - 1].label }}</span>
          </div>
        </template>
      </div>
    </div>

    <!-- 前景暗角 -->
    <div class="dh-vignette"></div>

    <!-- 标题 -->
    <div class="dh-header" ref="headerRef">
      <span class="dh-badge">GENOME GALLERY</span>
      <h2 class="dh-title">双螺旋</h2>
      <div class="dh-line"></div>
      <p class="dh-subtitle">DNA Double Helix · 3D Gallery</p>
    </div>

    <!-- 底部配对指示器 -->
    <div class="dh-indicator" ref="indicatorRef">
      <div class="dh-pair-dots">
        <span
          v-for="n in pairCount"
          :key="n"
          class="dh-dot"
          :class="{ active: activePair === n - 1 }"
        ></span>
      </div>
      <span class="dh-pair-name">{{ activePairName }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type CleanupFn = () => void

// ==================== 照片数据：5对 × 2链 = 10张 ====================
interface PhotoItem {
  id: number
  url: string
  title: string
  label: string
}

const photoUrlPool = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=340&fit=crop',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&h=340&fit=crop',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500&h=340&fit=crop',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=340&fit=crop',
  'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=500&h=340&fit=crop',
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=500&h=340&fit=crop',
  'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=500&h=340&fit=crop',
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&h=340&fit=crop',
  'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=500&h=340&fit=crop',
  'https://images.unsplash.com/photo-1502481851512-e9e2529bfbf9?w=500&h=340&fit=crop',
]

const titlePool = [
  '山间', '林径', '远山', '晨曦', '瀑布',
  '原野', '海浪', '星云', '湖面', '小径'
]

const labelPool = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']

const pairCount = 5

const photosA = ref<PhotoItem[]>(
  Array.from({ length: pairCount }, (_, i) => ({
    id: i + 1,
    url: photoUrlPool[i * 2],
    title: titlePool[i * 2],
    label: `Chain-A · ${labelPool[i * 2]}`,
  }))
)
const photosB = ref<PhotoItem[]>(
  Array.from({ length: pairCount }, (_, i) => ({
    id: i + pairCount + 1,
    url: photoUrlPool[i * 2 + 1],
    title: titlePool[i * 2 + 1],
    label: `Chain-B · ${labelPool[i * 2 + 1]}`,
  }))
)

// ==================== 螺旋参数 ====================
const helixRadius = 280        // 螺旋半径 px
const helixTotalTurns = 2.5    // 总螺旋圈数
const helixYAmplitude = 230    // 垂直振幅 px
const photoW = 145
const photoH = 100

// ==================== 计算每个 pair 的 CSS 样式 ====================
function computeStyles(pairIndex: number) {
  const k = pairIndex // 0..4
  const angleRad = (k / pairCount) * Math.PI * 2
  const angleDeg = (angleRad * 180) / Math.PI
  const totalAngleRad = angleRad * helixTotalTurns
  const yOffsetA = Math.sin(totalAngleRad) * helixYAmplitude
  const yOffsetB = Math.sin(totalAngleRad + Math.PI) * helixYAmplitude

  const transformA = `rotateY(${angleDeg.toFixed(1)}deg) translateZ(${helixRadius}px) translateY(${yOffsetA.toFixed(1)}px)`
  const transformB = `rotateY(${(angleDeg + 180).toFixed(1)}deg) translateZ(${helixRadius}px) translateY(${yOffsetB.toFixed(1)}px)`
  const bridgeTransform = `rotateY(${angleDeg.toFixed(1)}deg) translateZ(${helixRadius}px) translateY(${((yOffsetA + yOffsetB) / 2).toFixed(1)}px) rotateX(90deg)`

  return { transformA, transformB, bridgeTransform }
}

const photoStylesA = computed(() =>
  Array.from({ length: pairCount }, (_, i) => ({ transform: computeStyles(i).transformA }))
)
const photoStylesB = computed(() =>
  Array.from({ length: pairCount }, (_, i) => ({ transform: computeStyles(i).transformB }))
)
const bridgeStyles = computed(() =>
  Array.from({ length: pairCount }, (_, i) => ({ transform: computeStyles(i).bridgeTransform }))
)

const activePairName = computed(() => {
  const k = activePair.value
  if (k < 0 || k >= pairCount) return ''
  return `${photosA.value[k].title} ⇌ ${photosB.value[k].title}`
})

// ==================== Refs ====================
const sectionRef = ref<HTMLElement | null>(null)
const sceneRef = ref<HTMLElement | null>(null)
const helixRef = ref<HTMLElement | null>(null)
const particleCanvasRef = ref<HTMLCanvasElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const indicatorRef = ref<HTMLElement | null>(null)
const photoARefs = ref<(HTMLElement | null)[]>([])
const photoBRefs = ref<(HTMLElement | null)[]>([])
const bridgeRefs = ref<(HTMLElement | null)[]>([])

const helixRotation = ref(0)
const activePair = ref(0)

let cleanupFns: CleanupFn[] = []

// ==================== 分子粒子 Canvas ====================
interface Particle {
  x: number; y: number; r: number; opacity: number; vy: number; vx: number; life: number; age: number; color: string
}
let particles: Particle[] = []
let animId = 0
let cw = 0; let ch = 0

function initParticles() {
  const canvas = particleCanvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  cw = window.innerWidth; ch = window.innerHeight
  canvas.width = cw; canvas.height = ch

  particles = []
  const colors = ['rgba(0,229,255,', 'rgba(0,204,255,', 'rgba(80,255,200,', 'rgba(120,200,255,']

  function spawn(n: number) {
    for (let i = 0; i < n; i++) {
      particles.push({
        x: cw * 0.2 + Math.random() * cw * 0.6,
        y: ch * 0.1 + Math.random() * ch * 0.7,
        r: Math.random() * 1.6 + 0.4,
        opacity: Math.random() * 0.14 + 0.03,
        vy: -0.2 - Math.random() * 0.5,
        vx: (Math.random() - 0.5) * 0.4,
        life: 3 + Math.random() * 5,
        age: 0,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }
    if (particles.length > 160) particles = particles.slice(-130)
  }
  spawn(50)

  function animate() {
    if (!ctx || !particleCanvasRef.value) return
    ctx.clearRect(0, 0, cw, ch)
    if (Math.random() < 0.35) spawn(1)
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]
      p.x += p.vx; p.y += p.vy; p.age += 0.016
      if (p.age > p.life || p.y < ch * 0.05) { particles.splice(i, 1); continue }
      const a = p.opacity * (1 - p.age / p.life)
      if (a > 0.002) {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.color + a.toFixed(4) + ')'
        ctx.fill()
        // 发光
        if (p.r > 1.0) {
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2)
          ctx.fillStyle = p.color + (a * 0.2).toFixed(4) + ')'
          ctx.fill()
        }
      }
    }
    animId = requestAnimationFrame(animate)
  }
  animate()
}

// ==================== 挂载 ====================
onMounted(() => {
  if (!sectionRef.value) return
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      initParticles()
      setupAnimation()
    })
  })
})

// ==================== 主动画 ====================
function setupAnimation() {
  const container = sectionRef.value
  const helix = helixRef.value
  if (!container || !helix) return

  // 初始透明度
  gsap.set(headerRef.value, { opacity: 0, y: 24, filter: 'blur(3px)' })
  gsap.set(indicatorRef.value, { opacity: 0, y: 8 })

  // 初始：所有照片稍暗模糊
  const allARefs = photoARefs.value
  const allBRefs = photoBRefs.value
  const allBridges = bridgeRefs.value

  allARefs.forEach(el => { if (el) gsap.set(el, { opacity: 0.35, filter: 'blur(2px) brightness(0.6)' }) })
  allBRefs.forEach(el => { if (el) gsap.set(el, { opacity: 0.35, filter: 'blur(2px) brightness(0.6)' }) })
  allBridges.forEach(el => { if (el) gsap.set(el, { opacity: 0.15 }) })

  // ===== 主 ScrollTrigger =====
  const mainSt = ScrollTrigger.create({
    trigger: container,
    start: 'top 92%',
    end: 'bottom 8%',
    scrub: 1.5,
    onUpdate(self) {
      const p = clamp(self.progress, 0, 1)
      const eased = 1 - Math.pow(1 - p, 2.8)

      // 螺旋旋转：2 圈完整旋转
      helixRotation.value = eased * 720

      // 更新每张照片的可见度
      const totalPairs = pairCount
      const pairIdx = Math.min(totalPairs - 1, Math.floor(eased * totalPairs))
      activePair.value = pairIdx

      // 每对照片根据距离当前活跃对来调整可见度
      for (let k = 0; k < totalPairs; k++) {
        const diff = Math.abs(k - pairIdx)
        const f = clamp(1 - diff / 2.5, 0.08, 1)

        const elA = allARefs[k]; const elB = allBRefs[k]; const bridge = allBridges[k]
        const op = 0.25 + f * 0.75
        const blurAmt = 3.5 * (1 - f)
        const brightnessAmt = 0.35 + f * 0.65

        if (elA) {
          elA.style.opacity = String(op.toFixed(3))
          elA.style.filter = `blur(${blurAmt.toFixed(1)}px) brightness(${brightnessAmt.toFixed(2)})`
          elA.style.zIndex = k === pairIdx ? '8' : k === pairIdx + 1 || k === pairIdx - 1 ? '4' : '1'
        }
        if (elB) {
          elB.style.opacity = String(op.toFixed(3))
          elB.style.filter = `blur(${blurAmt.toFixed(1)}px) brightness(${brightnessAmt.toFixed(2)})`
          elB.style.zIndex = k === pairIdx ? '8' : k === pairIdx + 1 || k === pairIdx - 1 ? '4' : '1'
        }
        if (bridge) {
          bridge.style.opacity = String((0.12 + f * 0.88).toFixed(3))
          bridge.style.zIndex = k === pairIdx ? '6' : '2'
        }
      }
    },
    onLeaveBack() {
      helixRotation.value = 0
      activePair.value = 0
      allARefs.forEach(el => { if (el) { el.style.opacity = '0.3'; el.style.filter = 'blur(3px) brightness(0.4)'; el.style.zIndex = '1' } })
      allBRefs.forEach(el => { if (el) { el.style.opacity = '0.3'; el.style.filter = 'blur(3px) brightness(0.4)'; el.style.zIndex = '1' } })
      allBridges.forEach(el => { if (el) { el.style.opacity = '0.12'; el.style.zIndex = '1' } })
    },
  })
  cleanupFns.push(() => mainSt.kill())

  // ===== 标题 =====
  const headerSt = ScrollTrigger.create({
    trigger: container,
    start: 'top 72%',
    end: 'top 28%',
    scrub: 0.8,
    onUpdate(self) {
      const p = clamp(self.progress, 0, 1)
      const eased = Math.pow(p, 0.65)
      if (!headerRef.value) return
      headerRef.value.style.opacity = String(eased.toFixed(3))
      headerRef.value.style.transform = `translateY(${(24 * (1 - eased)).toFixed(1)}px)`
      headerRef.value.style.filter = `blur(${(3 * (1 - eased)).toFixed(1)}px)`
    },
  })
  cleanupFns.push(() => headerSt.kill())

  // ===== 指示器 =====
  const indicatorSt = ScrollTrigger.create({
    trigger: container,
    start: 'top 50%',
    end: 'top 15%',
    scrub: 0.6,
    onUpdate(self) {
      const p = clamp(self.progress, 0, 1)
      if (!indicatorRef.value) return
      indicatorRef.value.style.opacity = String(p.toFixed(3))
      indicatorRef.value.style.transform = `translateY(${(8 * (1 - p)).toFixed(1)}px)`
    },
  })
  cleanupFns.push(() => indicatorSt.kill())
}

function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)) }

// ==================== 清理 ====================
let resizeTimer: number | null = null
function handleResize() {
  if (resizeTimer) clearTimeout(resizeTimer)
  resizeTimer = window.setTimeout(() => {
    const c = particleCanvasRef.value
    if (c) { cw = window.innerWidth; ch = window.innerHeight; c.width = cw; c.height = ch }
  }, 500)
}
window.addEventListener('resize', handleResize)

onUnmounted(() => {
  if (resizeTimer) clearTimeout(resizeTimer)
  window.removeEventListener('resize', handleResize)
  cleanupFns.forEach(fn => fn())
  cancelAnimationFrame(animId)
})
</script>

<style scoped lang="scss">
.dh-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #050a14;
}

// ==================== 背景 ====================
.dh-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(ellipse at 50% 48%, rgba(0, 120, 180, 0.06) 0%, transparent 50%),
    radial-gradient(ellipse at 58% 44%, rgba(0, 180, 200, 0.03) 0%, transparent 35%),
    linear-gradient(180deg,
      #050c1a 0%, #060e1e 30%, #040b18 60%, #020810 100%
    );
}

// ==================== 粒子 ====================
.dh-particles {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

// ==================== 3D 场景 ====================
.dh-scene {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 700px;
  height: 600px;
  z-index: 4;
  perspective: 1600px;
  perspective-origin: 50% 45%;
}

.dh-helix {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  transform-style: preserve-3d;
  will-change: transform;
}

// ==================== 照片包装 ====================
.dh-photo-wrap {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 145px;
  height: 100px;
  margin-left: -72.5px;
  margin-top: -50px;
  transform-style: preserve-3d;
  will-change: transform, opacity, filter;
  pointer-events: none;
}

// ==================== 照片框 ====================
.dh-photo-frame {
  position: relative;
  width: 145px;
  height: 100px;
  border-radius: 4px;
  overflow: hidden;
  background: #081420;
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.5),
    0 0 0 1.5px rgba(0, 200, 230, 0.15);
}

.dh-photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.dh-photo-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    135deg,
    rgba(0, 229, 255, 0.05) 0%,
    transparent 50%,
    rgba(0, 240, 200, 0.03) 100%
  );
}

// ==================== 照片标签 ====================
.dh-photo-label {
  position: absolute;
  bottom: -18px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 9px;
  letter-spacing: 0.06em;
  color: rgba(0, 200, 230, 0.3);
  font-family: 'Courier New', monospace;
  white-space: nowrap;
}

// ==================== 桥接对 ====================
.dh-bridge {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 145px;
  height: 4px;
  margin-left: -72.5px;
  margin-top: -2px;
  transform-style: preserve-3d;
  will-change: transform, opacity;
  pointer-events: none;
}

.dh-bridge-bar {
  width: 100%;
  height: 100%;
  border-radius: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(0, 229, 255, 0.15) 20%,
    rgba(0, 255, 200, 0.25) 50%,
    rgba(0, 229, 255, 0.15) 80%,
    transparent
  );
  box-shadow:
    0 0 4px rgba(0, 200, 230, 0.12),
    0 0 8px rgba(0, 240, 200, 0.06);
}

// ==================== 暗角 ====================
.dh-vignette {
  position: absolute;
  inset: 0;
  z-index: 8;
  pointer-events: none;
  background: radial-gradient(
    ellipse at center,
    transparent 20%,
    rgba(3, 6, 16, 0.2) 42%,
    rgba(2, 4, 12, 0.55) 68%,
    rgba(1, 3, 10, 0.8) 90%
  );
}

// ==================== 标题 ====================
.dh-header {
  position: absolute;
  top: 6%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 12;
  text-align: center;
  pointer-events: none;
}

.dh-badge {
  display: inline-block;
  font-size: 10.5px;
  font-weight: 500;
  letter-spacing: 0.18em;
  color: rgba(0, 220, 240, 0.5);
  border: 0.5px solid rgba(0, 200, 230, 0.2);
  padding: 4px 14px;
  border-radius: 20px;
  margin-bottom: 16px;
  font-family: 'Courier New', monospace;
}

.dh-title {
  font-size: clamp(1.8rem, 5vw, 3.5rem);
  font-weight: 200;
  letter-spacing: 0.12em;
  color: #d0e8ff;
  margin: 0 0 12px;
  text-shadow:
    0 0 30px rgba(0, 180, 220, 0.2),
    0 0 60px rgba(0, 140, 200, 0.1);
}

.dh-line {
  width: 80px;
  height: 1px;
  margin: 0 auto 12px;
  background: linear-gradient(90deg,
    transparent,
    rgba(0, 200, 220, 0.35) 40%,
    rgba(0, 230, 240, 0.25) 60%,
    transparent
  );
}

.dh-subtitle {
  font-size: clamp(0.58rem, 0.95vw, 0.76rem);
  font-weight: 400;
  letter-spacing: 0.06em;
  color: rgba(130, 190, 210, 0.4);
  margin: 0;
  font-family: 'Courier New', monospace;
}

// ==================== 指示器 ====================
.dh-indicator {
  position: absolute;
  bottom: 6%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 12;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  pointer-events: none;
}

.dh-pair-dots {
  display: flex;
  gap: 10px;
}

.dh-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(0, 180, 210, 0.2);
  transition: all 0.5s ease;

  &.active {
    background: rgba(0, 229, 255, 0.7);
    box-shadow:
      0 0 8px rgba(0, 229, 255, 0.5),
      0 0 16px rgba(0, 180, 220, 0.25);
    transform: scale(1.4);
  }
}

.dh-pair-name {
  font-size: 11px;
  letter-spacing: 0.08em;
  color: rgba(160, 210, 230, 0.4);
  font-family: 'Courier New', monospace;
}
</style>
