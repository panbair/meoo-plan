<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type CleanupFn = () => void

// ═══════════════════════════════════════════
//  Spacetime Fold Projection — 时空折叠投影（增强版）
//
//  核心概念:
//  1. 9张图片组成3×3网格（同一场景的不同时刻）
//  2. 每层不同的景深和模糊度
//  3. 滚动时网格折叠成立方体3D结构
//  4. Canvas 时空扭曲特效（网格线+光点）
//  5. 透视变换 + 旋转组合动画
//  6. 时间标签动态切换
// ═══════════════════════════════════════════

// === 9张不同时间的图片（日出→日落）===
const timeImages = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', // 清晨
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80', // 早晨
  'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80', // 上午
  'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80', // 中午
  'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=800&q=80', // 下午
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80', // 傍晚
  'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&q=80', // 黄昏
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80', // 夜晚
  'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=800&q=80' // 深夜
]

const timeLabels = ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']

// === 3×3网格配置 ===
interface GridCell {
  id: number
  row: number
  col: number
  z: number
  rotateX: number
  rotateY: number
  scale: number
  blur: number
}

const cells: GridCell[] = []
for (let row = 0; row < 3; row++) {
  for (let col = 0; col < 3; col++) {
    const id = row * 3 + col
    cells.push({
      id,
      row,
      col,
      z: 0,
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      blur: 0
    })
  }
}

const sectionRef = ref<HTMLElement | null>(null)
const cellRefs = ref<(HTMLElement | null)[]>([])
const canvasRef = ref<HTMLCanvasElement | null>(null)
const timeIndicatorRef = ref<HTMLElement | null>(null)
const heroRef = ref<HTMLElement | null>(null)
const heroTagRef = ref<HTMLElement | null>(null)
const heroTitleRef = ref<HTMLElement | null>(null)
const heroLineRef = ref<HTMLElement | null>(null)
const heroSubRef = ref<HTMLElement | null>(null)

const cleanupFns: CleanupFn[] = []

onMounted(() => {
  if (!sectionRef.value) {
    return
  }

  // === Canvas 时空扭曲特效 ===
  const canvas = canvasRef.value
  let cw = 0,
    ch = 0
  let gridLines: Array<{
    x1: number
    y1: number
    x2: number
    y2: number
    alpha: number
    color: string
  }> = []
  let lightPoints: Array<{
    x: number
    y: number
    r: number
    alpha: number
    pulse: number
  }> = []
  let animFrameId = 0

  if (canvas) {
    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect()
      cw = canvas.width = rect.width
      ch = canvas.height = rect.height
    }
    resize()
    window.addEventListener('resize', resize)

    function generateGrid(progress: number) {
      gridLines = []
      lightPoints = []

      const cols = 20
      const rows = 20
      const cellWidth = cw / cols
      const cellHeight = ch / rows

      // 生成扭曲的网格线
      for (let i = 0; i <= cols; i++) {
        const x = i * cellWidth
        const distortion = Math.sin(i * 0.5 + progress * Math.PI * 4) * 20 * progress

        gridLines.push({
          x1: x + distortion,
          y1: 0,
          x2: x - distortion,
          y2: ch,
          alpha: 0.1 + progress * 0.3,
          color: `hsl(${200 + progress * 60}, 100%, 70%)`
        })
      }

      for (let j = 0; j <= rows; j++) {
        const y = j * cellHeight
        const distortion = Math.cos(j * 0.5 + progress * Math.PI * 4) * 20 * progress

        gridLines.push({
          x1: 0,
          y1: y + distortion,
          x2: cw,
          y2: y - distortion,
          alpha: 0.1 + progress * 0.3,
          color: `hsl(${200 + progress * 60}, 100%, 70%)`
        })
      }

      // 生成光点
      for (let i = 0; i < 30; i++) {
        lightPoints.push({
          x: Math.random() * cw,
          y: Math.random() * ch,
          r: 2 + Math.random() * 4,
          alpha: 0.3 + Math.random() * 0.5,
          pulse: Math.random() * Math.PI * 2
        })
      }
    }

    function draw() {
      if (!canvas) {
        return
      }
      const ctx = canvas.getContext('2d')!
      ctx.clearRect(0, 0, cw, ch)

      // 绘制网格线
      gridLines.forEach((line) => {
        ctx.beginPath()
        ctx.moveTo(line.x1, line.y1)
        ctx.lineTo(line.x2, line.y2)
        ctx.strokeStyle = line.color
        ctx.lineWidth = 1
        ctx.globalAlpha = line.alpha
        ctx.stroke()
        ctx.globalAlpha = 1
      })

      // 绘制光点
      const time = Date.now() * 0.001
      lightPoints.forEach((point) => {
        const pulse = Math.sin(time * 2 + point.pulse) * 0.3 + 0.7
        ctx.beginPath()
        ctx.arc(point.x, point.y, point.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(100, 200, 255, ${point.alpha * pulse})`
        ctx.fill()
      })
    }

    ;(globalThis as any).__spacetimeGenerate = generateGrid

    function loop() {
      draw()
      animFrameId = requestAnimationFrame(loop)
    }
    animFrameId = requestAnimationFrame(loop)

    cleanupFns.push(() => {
      cancelAnimationFrame(animFrameId)
      delete (globalThis as any).__spacetimeGenerate
      window.removeEventListener('resize', resize)
    })
  }

  // === GSAP 动画上下文 ===
  const ctx = gsap.context(() => {
    // === 3D折叠动画 ===
    const mainTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.value!,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2,
        toggleActions: 'play none none reverse',
        onUpdate(self) {
          const progress = self.progress

          // 触发 Canvas 网格生成
          ;(globalThis as any).__spacetimeGenerate?.(progress)

          // 更新时间指示器
          if (timeIndicatorRef.value) {
            const labelIndex = Math.min(8, Math.floor(progress * 9))
            timeIndicatorRef.value.textContent = timeLabels[labelIndex]
          }
        }
      }
    })

    // 为每个单元格创建3D变换动画
    cellRefs.value.forEach((cellEl, i) => {
      if (!cellEl) {
        return
      }

      const cell = cells[i]
      const row = cell.row
      const col = cell.col

      // 计算3D位置
      const zOffset = (row - 1) * 50 + (col - 1) * 50
      const rotateX = (row - 1) * 15
      const rotateY = (col - 1) * 15

      mainTl.fromTo(
        cellEl,
        {
          z: 0,
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          filter: 'blur(0px)',
          opacity: 1
        },
        {
          z: zOffset,
          rotateX,
          rotateY,
          scale: 0.85,
          filter: 'blur(2px)',
          opacity: 0.9,
          duration: 1,
          ease: 'power2.inOut'
        },
        0
      )
    })

    // === 标题入场动画 ===
    if (heroRef.value) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.value!,
          start: 'top 40%',
          end: 'top 5%',
          scrub: 1
        }
      })
      tl.fromTo(heroRef.value, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.2 }, 0)
      tl.fromTo(heroTagRef.value, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.8 }, 0.1)
      tl.fromTo(
        heroTitleRef.value,
        { opacity: 0, y: 20, filter: 'blur(5px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1 },
        0.15
      )
      tl.fromTo(
        heroLineRef.value,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.8 },
        0.2
      )
      tl.fromTo(heroSubRef.value, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.7 }, 0.25)
      cleanupFns.push(() => tl.kill())
    }
  }, sectionRef.value)

  cleanupFns.push(() => ctx.revert())
})

onUnmounted(() => {
  cleanupFns.forEach((fn) => fn())
  if (sectionRef.value) {
    ScrollTrigger.getAll().forEach((st) => {
      if (st.vars.trigger === sectionRef.value) {
        st.kill()
      }
    })
  }
})
</script>

<template>
  <div ref="sectionRef" class="sf-section">
    <!-- 背景深色 -->
    <div class="sf-bg"></div>

    <!-- 3×3网格容器 -->
    <div class="sf-grid-container">
      <div
        v-for="(cell, i) in cells"
        :key="cell.id"
        :ref="(el) => (cellRefs[i] = el as HTMLElement | null)"
        class="sf-cell"
        :style="{
          left: `${(cell.col / 3) * 100}%`,
          top: `${(cell.row / 3) * 100}%`,
          width: '33.333%',
          height: '33.333%'
        }"
      >
        <img :src="timeImages[i]" :alt="timeLabels[i]" class="sf-cell-img" />
        <div class="sf-cell-overlay">
          <span class="sf-cell-time">{{ timeLabels[i] }}</span>
        </div>
      </div>
    </div>

    <!-- Canvas 时空扭曲层 -->
    <canvas ref="canvasRef" class="sf-canvas"></canvas>

    <!-- 时间指示器 -->
    <div class="sf-time-indicator">
      <span ref="timeIndicatorRef">06:00</span>
    </div>

    <!-- 标题区 -->
    <div ref="heroRef" class="sf-hero">
      <div ref="heroTagRef" class="sf-hero-tag">SPACETIME FOLD PROJECTION</div>
      <h2 ref="heroTitleRef" class="sf-hero-title">时空折叠投影</h2>
      <div ref="heroLineRef" class="sf-hero-line"></div>
      <p ref="heroSubRef" class="sf-hero-sub">
        9-Grid · 3D Fold · Time Sequence · Spacetime Distortion
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.sf-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  perspective: 2000px;
  font-family: 'Inter', 'PingFang SC', system-ui, sans-serif;
}

.sf-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 50%, #2d1b4e 100%);
}

// ==== 网格容器 ====
.sf-grid-container {
  position: absolute;
  inset: 0;
  z-index: 2;
  transform-style: preserve-3d;
}

.sf-cell {
  position: absolute;
  overflow: hidden;
  will-change: transform, filter, opacity;
  transform-style: preserve-3d;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.sf-cell-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.sf-cell-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
}

.sf-cell-time {
  font-size: 0.9rem;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

// ==== Canvas 时空扭曲层 ====
.sf-canvas {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
}

// ==== 时间指示器 ====
.sf-time-indicator {
  position: absolute;
  top: clamp(20px, 5vh, 50px);
  right: clamp(24px, 9vw, 90px);
  z-index: 20;
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  color: #fff;
  text-shadow: 0 0 30px rgba(100, 200, 255, 0.8);
  font-variant-numeric: tabular-nums;
}

// ==== 标题区 ====
.sf-hero {
  position: absolute;
  top: clamp(20px, 5vh, 50px);
  left: clamp(24px, 9vw, 90px);
  z-index: 20;
  text-align: left;
  opacity: 0;
}

.sf-hero-tag {
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: rgba(100, 200, 255, 0.85);
  margin-bottom: 10px;
  text-shadow: 0 0 25px rgba(100, 200, 255, 0.6);
}

.sf-hero-title {
  font-size: clamp(2.2rem, 6vw, 4rem);
  font-weight: 800;
  color: #fff;
  margin: 0;
  line-height: 1.1;
  text-shadow:
    0 0 60px rgba(100, 200, 255, 0.7),
    0 0 120px rgba(150, 100, 255, 0.5),
    0 0 180px rgba(200, 100, 255, 0.3);
  letter-spacing: 0.06em;
  background: linear-gradient(135deg, #64c8ff 0%, #9664ff 50%, #c864ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.sf-hero-line {
  width: clamp(45px, 11vw, 90px);
  height: 3px;
  margin: 12px 0 14px;
  border-radius: 2px;
  background: linear-gradient(
    90deg,
    rgba(100, 200, 255, 0.9),
    rgba(150, 100, 255, 0.7),
    transparent
  );
  box-shadow: 0 0 20px rgba(100, 200, 255, 0.7);
}

.sf-hero-sub {
  font-size: clamp(0.65rem, 1.5vw, 0.85rem);
  font-weight: 400;
  letter-spacing: 0.15em;
  color: rgba(180, 200, 255, 0.65);
  margin: 0;
}

@media (max-width: 768px) {
  .sf-hero-title {
    font-size: 1.6rem;
  }
  .sf-hero-sub {
    font-size: 0.68rem;
  }
  .sf-time-indicator {
    font-size: 2rem;
  }
}
</style>
