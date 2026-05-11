<template>
  <section class="spacetime-fissure">
    <div ref="containerRef" class="fissure-container">
      <canvas ref="holoCanvasRef" class="holo-canvas"></canvas>

      <div
        v-for="(card, index) in cards"
        :key="card.id"
        :ref="(el) => setCardRef(el, index)"
        class="fissure-card"
      >
        <div class="card-inner">
          <div class="card-scan-line"></div>
          <div class="card-glitch" :data-text="card.code">
            <span class="glitch-text">{{ card.code }}</span>
          </div>
          <div class="card-info">
            <span class="card-phase">{{ card.phase }}</span>
            <h3 class="card-title">{{ card.title }}</h3>
            <p class="card-text">{{ card.text }}</p>
          </div>
          <div class="card-dim-indicator">{{ card.dimension }}D</div>
        </div>
      </div>
    </div>

    <div class="chromatic-overlay"></div>
    <div ref="scanOverlayRef" class="scan-overlay"></div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Card {
  id: number
  code: string
  title: string
  text: string
  phase: string
  dimension: number
}

const cards: Card[] = [
  { id: 1, code: 'DIM-01', title: '碎片场', text: '量子涨落产生的随机碎片', phase: '第一阶段', dimension: 2 },
  { id: 2, code: 'DIM-02', title: '引力旋涡', text: '空间弯曲形成的能量漩涡', phase: '第二阶段', dimension: 3 },
  { id: 3, code: 'DIM-03', title: '时空切片', text: '四维时空的截面投影', phase: '第三阶段', dimension: 4 },
  { id: 4, code: 'DIM-04', title: '光柱通道', text: '高维能量传输的甬道', phase: '第四阶段', dimension: 5 },
  { id: 5, code: 'DIM-05', title: '网格重构', text: '时空结构的自我修复', phase: '第五阶段', dimension: 3 },
  { id: 6, code: 'DIM-06', title: '量子隧穿', text: '穿越势垒的瞬间跃迁', phase: '第六阶段', dimension: 4 },
  { id: 7, code: 'DIM-07', title: '纠缠网络', text: '粒子间的超距连接', phase: '第七阶段', dimension: 5 },
  { id: 8, code: 'DIM-08', title: '真空涨落', text: '虚空中的能量泡沫', phase: '第八阶段', dimension: 2 },
  { id: 9, code: 'DIM-09', title: '维度折叠', text: '空间的自我卷曲', phase: '第九阶段', dimension: 6 },
  { id: 10, code: 'DIM-10', title: '时空连续', text: '宇宙的基本结构', phase: '第十阶段', dimension: 10 },
  { id: 11, code: 'DIM-11', title: '奇点回归', text: '一切归于虚无', phase: '第十一阶段', dimension: 0 },
  { id: 12, code: 'DIM-12', title: '创世重启', text: '从无到有的新生', phase: '第十二阶段', dimension: 11 },
]

const containerRef = ref<HTMLDivElement>()
const holoCanvasRef = ref<HTMLCanvasElement>()
const scanOverlayRef = ref<HTMLDivElement>()
const cardRefs = ref<HTMLDivElement[]>([])
const setCardRef = (el: any, index: number) => {
  if (el) cardRefs.value[index] = el
}

let tl: gsap.Timeline | null = null
let st: ScrollTrigger | null = null
let animationFrameId: number | null = null
let cleanupFns: (() => void)[] = []

const initAnimation = () => {
  const container = containerRef.value
  const canvas = holoCanvasRef.value
  const cards = cardRefs.value.filter(Boolean)
  if (!container || !canvas || !cards.length) return

  // 设置 Canvas 尺寸
  canvas.width = container.offsetWidth
  canvas.height = container.offsetHeight

  const containerRect = container.getBoundingClientRect()
  const Cx = container.offsetWidth / 2
  const Cy = container.offsetHeight / 2

  // 记录最终网格位置
  const finalPositions = cards.map((card) => {
    const rect = card.getBoundingClientRect()
    return {
      x: rect.left - containerRect.left,
      y: rect.top - containerRect.top,
      w: rect.width,
      h: rect.height
    }
  })

  // 阶段0：二维碎片随机散布
  const fragmentPositions = cards.map(() => {
    const angle = Math.random() * Math.PI * 2
    const dist = 350 + Math.random() * 400
    return {
      x: Math.cos(angle) * dist + (Math.random() - 0.5) * 250,
      y: Math.sin(angle) * dist + (Math.random() - 0.5) * 250,
      scale: 0.1 + Math.random() * 0.3,
      rotation: Math.random() * 360,
      opacity: 0.15,
      filter: 'blur(10px) hue-rotate(90deg) brightness(0.5)'
    }
  })

  // 阶段1：三维旋涡聚合
  const vortexPositions = cards.map((_, i) => {
    const angle = (i / cards.length) * Math.PI * 4
    const radius = 100 + i * 10
    const depth = -80 - i * 15
    return {
      x: Cx + Math.cos(angle) * radius - finalPositions[i].w / 2,
      y: Cy + Math.sin(angle) * (radius * 0.6) - finalPositions[i].h / 2 - depth * 0.2,
      z: depth,
      scale: 0.75,
      rotation: angle * 25,
      opacity: 0.85,
      filter: 'blur(2px) hue-rotate(0deg)'
    }
  })

  // 阶段2：二维切片扫描
  const slicePositions = cards.map((_, i) => {
    const totalWidth = finalPositions.reduce((sum, p) => sum + p.w, 0) + (cards.length - 1) * 16
    let offset = -totalWidth / 2
    for (let j = 0; j < i; j++) {
      offset += finalPositions[j].w + 16
    }
    return {
      x: offset + container.offsetWidth / 2 - totalWidth / 2,
      y: Cy - finalPositions[i].h / 2,
      scale: 1,
      rotation: 0,
      opacity: 1,
      filter: 'blur(0px) grayscale(0.8)',
      zIndex: i
    }
  })

  // 阶段3：全息光柱
  const beamPositions = cards.map((_, i) => {
    return {
      x: finalPositions[i].x,
      y: finalPositions[i].y - 60,
      scale: 1.15,
      rotation: 0,
      opacity: 1,
      filter: 'blur(0px) brightness(1.4)',
      zIndex: 50
    }
  })

  // 初始化：所有卡片至碎片状态
  cards.forEach((card, i) => {
    gsap.set(card, {
      ...fragmentPositions[i],
      position: 'absolute',
      left: 0,
      top: 0,
      margin: 0,
      transformStyle: 'preserve-3d',
      force3D: true
    })
  })

  // 主时间轴
  tl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top 85%',
      end: 'bottom bottom',
      scrub: 1.8,
      onUpdate: (self) => drawHolographicOverlay(self.progress)
    }
  })

  // 阶段0 -> 1：碎片聚拢为旋涡
  cards.forEach((card, i) => {
    tl!.to(card, {
      ...vortexPositions[i],
      duration: 0.5,
      ease: 'power2.inOut'
    }, i * 0.025)
  })

  // 阶段1 -> 2：旋涡展开为切片
  cards.forEach((card, i) => {
    tl!.to(card, {
      ...slicePositions[i],
      duration: 0.5,
      ease: 'expo.inOut'
    }, 0.5 + i * 0.015)
  })

  // 阶段2 -> 3：切片升为光柱
  cards.forEach((card, i) => {
    tl!.to(card, {
      ...beamPositions[i],
      duration: 0.4,
      ease: 'back.out(1.7)'
    }, 1.0 + i * 0.02)
  })

  // 阶段3 -> 4：光柱落回网格
  cards.forEach((card, i) => {
    tl!.to(card, {
      x: finalPositions[i].x,
      y: finalPositions[i].y,
      z: 0,
      scale: 1,
      rotation: 0,
      opacity: 1,
      filter: 'blur(0px) brightness(1) hue-rotate(0deg) grayscale(0)',
      duration: 0.7,
      ease: 'elastic.out(1, 0.3)'
    }, 1.4 + i * 0.015)
  })

  // 全局色差
  tl.fromTo(container, {
    '--chroma-offset': 40
  }, {
    '--chroma-offset': 0,
    duration: 2.5,
    ease: 'none'
  }, 0)

  // 扫描线动画
  tl.fromTo(scanOverlayRef.value, {
    opacity: 0
  }, {
    opacity: 1,
    duration: 0.3
  }, 0.2)

  st = tl.scrollTrigger
}

const drawHolographicOverlay = (progress: number) => {
  const canvas = holoCanvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // 扫描线
  const scanPos = (progress * canvas.height * 2) % canvas.height
  ctx.fillStyle = `rgba(0, 255, 255, ${0.06 + Math.sin(progress * 12) * 0.03})`
  for (let y = scanPos; y < canvas.height; y += 6) {
    ctx.fillRect(0, y, canvas.width, 1)
  }

  // 粒子场
  const particleCount = 80
  ctx.fillStyle = '#0ff'
  for (let i = 0; i < particleCount; i++) {
    const angle = (i / particleCount) * Math.PI * 2 + progress * 4
    const radius = canvas.width * 0.45 * (0.25 + progress * 0.25)
    const x = canvas.width / 2 + Math.cos(angle) * radius
    const y = canvas.height / 2 + Math.sin(angle) * radius
    ctx.globalAlpha = 0.3 + Math.sin(progress * 25 + i) * 0.2
    ctx.beginPath()
    ctx.arc(x, y, 2, 0, Math.PI * 2)
    ctx.fill()
  }

  // 中心能量环
  const ringRadius = canvas.width * 0.3 * progress
  ctx.strokeStyle = `rgba(0, 240, 255, ${0.4 * (1 - progress)})`
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(canvas.width / 2, canvas.height / 2, ringRadius, 0, Math.PI * 2)
  ctx.stroke()
}

const handleResize = () => {
  if (st) st.kill()
  if (tl) tl.kill()
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
  initAnimation()
}

onMounted(() => {
  initAnimation()
  window.addEventListener('resize', handleResize, { passive: true })
})

onUnmounted(() => {
  if (tl) tl.kill()
  if (st) st.kill()
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
  ScrollTrigger.getAll().forEach(instance => {
    if (instance.vars.trigger === containerRef.value) {
      instance.kill()
    }
  })
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped lang="scss">
.spacetime-fissure {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(ellipse at center, #0a1628 0%, #050a14 100%),
    linear-gradient(180deg, transparent 0%, rgba(0, 20, 40, 0.5) 100%);
}

.fissure-container {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 16px;
  padding: 32px;
  position: relative;
  perspective: 2000px;
}

.holo-canvas {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 10;
}

.fissure-card {
  position: relative;
  border-radius: 12px;
  cursor: pointer;
}

.card-inner {
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 12px;
  background: linear-gradient(145deg,
    rgba(0, 240, 255, 0.06) 0%,
    rgba(0, 0, 0, 0.4) 100%);
  border: 1px solid rgba(0, 240, 255, 0.15);
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(0, 240, 255, 0.4);
    box-shadow:
      0 0 40px rgba(0, 240, 255, 0.15),
      inset 0 0 30px rgba(0, 240, 255, 0.05);
    transform: translateZ(20px);
  }
}

.card-scan-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(0, 240, 255, 0.8) 50%,
    transparent 100%);
  animation: scanMove 3s linear infinite;
  z-index: 5;
}

@keyframes scanMove {
  0% { top: 0; opacity: 1; }
  100% { top: 100%; opacity: 0.3; }
}

.card-glitch {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 3;
}

.glitch-text {
  font-family: 'Courier New', monospace;
  font-size: 11px;
  font-weight: 700;
  color: rgba(0, 240, 255, 0.6);
  letter-spacing: 2px;

  .card-inner:hover & {
    animation: glitchText 0.3s infinite;
  }
}

@keyframes glitchText {
  0% { text-shadow: 2px 0 #ff0080, -2px 0 #00ffff; }
  50% { text-shadow: -2px 0 #ff0080, 2px 0 #00ffff; }
  100% { text-shadow: 2px 0 #ff0080, -2px 0 #00ffff; }
}

.card-info {
  padding: 20px;
  height: calc(100% - 30px);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.card-phase {
  font-size: 9px;
  font-weight: 600;
  color: rgba(0, 240, 255, 0.5);
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin-bottom: 6px;
}

.card-title {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 8px;
  text-shadow: 0 0 15px rgba(0, 240, 255, 0.3);
}

.card-text {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.4;
  margin: 0;
}

.card-dim-indicator {
  position: absolute;
  top: 16px;
  left: 16px;
  font-family: 'Courier New', monospace;
  font-size: 20px;
  font-weight: 700;
  color: rgba(0, 240, 255, 0.2);
  text-shadow: 0 0 10px rgba(0, 240, 255, 0.3);
}

.chromatic-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(90deg,
      rgba(255, 0, 128, calc(var(--chroma-offset, 0) * 0.01)) 0%,
      transparent 30%,
      transparent 70%,
      rgba(0, 255, 255, calc(var(--chroma-offset, 0) * 0.01)) 100%);
  mix-blend-mode: screen;
  z-index: 20;
}

.scan-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.1) 2px,
    rgba(0, 0, 0, 0.1) 4px
  );
  opacity: 0;
  z-index: 15;
}
</style>
