<template>
  <section ref="containerRef" class="card-time-dimension-fold">
    <!-- 维度裂缝Canvas -->
    <canvas ref="crackCanvasRef" class="crack-canvas"></canvas>

    <!-- 维度背景 -->
    <div ref="dimensionBgRef" class="dimension-bg">
      <div ref="gridLayerRef" class="grid-layer"></div>
      <div ref="energyFieldRef" class="energy-field"></div>
      <div class="dimension-particles">
        <span v-for="i in 40" :key="i" class="dim-particle" :style="getParticleStyle(i)"></span>
      </div>
      <div ref="scanLineRef" class="scan-line"></div>
    </div>

    <!-- 主标题 -->
    <div ref="headerRef" class="fold-header">
      <div ref="badgeRef" class="fold-badge">
        <span class="badge-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
        </span>
        <span class="badge-text">DIMENSIONAL RIFT</span>
      </div>
      <h1 ref="titleRef" class="fold-title">DIMENSION FOLD</h1>
      <p ref="subtitleRef" class="fold-subtitle">
        Witness the dimensional tearing as fragments converge into unity
      </p>
    </div>

    <!-- 折叠卡片容器 -->
    <div ref="foldContainerRef" class="fold-container">
      <div
        v-for="(card, index) in cards"
        :key="index"
        :ref="el => cardRefs[index] = el as HTMLElement"
        class="dimension-card"
        :data-index="index"
      >
        <div class="card-fracture"></div>
        <div class="card-inner">
          <div class="card-portal">
            <div class="portal-ring ring-outer"></div>
            <div class="portal-ring ring-middle"></div>
            <div class="portal-ring ring-inner"></div>
            <div class="portal-core">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path v-if="index % 4 === 0" d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
                <path v-else-if="index % 4 === 1" d="M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18"/>
                <path v-else-if="index % 4 === 2" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                <path v-else d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-6a4 4 0 100-8 4 4 0 000 8z"/>
              </svg>
            </div>
          </div>
          <div class="card-body">
            <span class="card-index">{{ String(index + 1).padStart(2, '0') }}</span>
            <h3 class="card-title">{{ card.title }}</h3>
            <p class="card-desc">{{ card.desc }}</p>
          </div>
          <div class="card-footer">
            <span class="card-tag">{{ card.tag }}</span>
            <div class="card-coordinate">
              <span class="coord-axis">X</span>
              <span class="coord-value">{{ card.coord }}</span>
            </div>
          </div>
        </div>
        <div class="card-edge-glow"></div>
      </div>
    </div>

    <!-- 底部维度指示 -->
    <div ref="footerRef" class="fold-footer">
      <div ref="dimensionBarsRef" class="dimension-bars">
        <span v-for="i in 6" :key="i" class="dim-bar" :style="getBarStyle(i)"></span>
      </div>
      <span ref="footerTextRef" class="footer-text">DIMENSIONAL CONVERGENCE</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'

gsap.registerPlugin(ScrollTrigger, Flip)

type TweenCleanup = () => void

const containerRef = ref<HTMLElement | null>(null)
const crackCanvasRef = ref<HTMLCanvasElement | null>(null)
const dimensionBgRef = ref<HTMLElement | null>(null)
const gridLayerRef = ref<HTMLElement | null>(null)
const energyFieldRef = ref<HTMLElement | null>(null)
const scanLineRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const badgeRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const foldContainerRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const footerTextRef = ref<HTMLElement | null>(null)
const dimensionBarsRef = ref<HTMLElement | null>(null)

const cardRefs = ref<(HTMLElement | null)[]>([])

const cards = [
  { title: 'Fracture', desc: 'Spatial tears in the fabric of reality', tag: 'Rift', coord: '3.14' },
  { title: 'Convergence', desc: 'Parallel dimensions merging as one', tag: 'Union', coord: '2.71' },
  { title: 'Tessellation', desc: 'Perfect geometric harmony of fragments', tag: 'Pattern', coord: '1.41' },
  { title: 'Unfolding', desc: 'Hidden dimensions revealed through space', tag: 'Reveal', coord: '9.81' },
  { title: 'Collapse', desc: 'Dimensional compression into singularity', tag: 'Gravity', coord: '6.28' },
  { title: 'Expansion', desc: 'Space-time stretching beyond perception', tag: 'Cosmic', coord: '4.56' },
  { title: 'Resonance', desc: 'Harmonic frequencies of parallel worlds', tag: 'Wave', coord: '7.89' },
  { title: 'Phase', desc: 'Quantum states of dimensional existence', tag: 'Quantum', coord: '0.58' },
  { title: 'Nexus', desc: 'Connection point of all realities', tag: 'Bridge', coord: '2.99' }
]

const cleanupFns: TweenCleanup[] = []
let ctx: CanvasRenderingContext2D | null = null

const getParticleStyle = (index: number) => {
  const size = Math.random() * 3 + 1
  const delay = Math.random() * 10
  const duration = 8 + Math.random() * 12
  const x = Math.random() * 100
  const y = Math.random() * 100
  const hue = 180 + index * 5
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${x}%`,
    top: `${y}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    background: `hsla(${hue}, 70%, 60%, 0.6)`
  }
}

const getBarStyle = (index: number) => {
  const width = 20 + Math.random() * 40
  const delay = index * 0.1
  return {
    width: `${width}px`,
    animationDelay: `${delay}s`
  }
}

// 生成随机的维度折叠参数（清晰可见，移除blur）
const getRandom3DState = (index: number) => {
  const seed = index * 137.5 // 黄金角度分布
  return {
    // 适度偏移，保持在视口内
    x: Math.sin(seed * 0.1) * 100,
    y: Math.cos(seed * 0.1) * 60,
    z: -50 - Math.abs(Math.sin(seed * 0.05)) * 80,
    rotationX: Math.sin(seed * 0.2) * 15,
    rotationY: Math.cos(seed * 0.15) * 15,
    rotationZ: Math.sin(seed * 0.25) * 10,
    scale: 0.8 + Math.abs(Math.cos(seed * 0.1)) * 0.15, // 0.8~0.95
    opacity: 0.85 + Math.abs(Math.sin(seed * 0.3)) * 0.15, // 0.85~1.0
    brightness: 0.6 + Math.abs(Math.cos(seed * 0.2)) * 0.2 // 0.6~0.8
  }
}

// Canvas绘制维度裂缝
const drawCracks = (progress: number) => {
  if (!crackCanvasRef.value || !ctx) return
  const canvas = crackCanvasRef.value
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  if (progress <= 0 || progress >= 1) return

  const intensity = Math.sin(progress * Math.PI) * 0.9
  const crackCount = Math.floor(intensity * 15)

  ctx.save()
  ctx.strokeStyle = '#00ffff'
  ctx.lineWidth = 1.5
  ctx.shadowColor = '#00ffff'
  ctx.shadowBlur = 15
  ctx.globalAlpha = intensity * 0.7

  for (let i = 0; i < crackCount; i++) {
    const startX = Math.random() * canvas.width
    const startY = Math.random() * canvas.height
    ctx.beginPath()
    ctx.moveTo(startX, startY)

    let x = startX
    let y = startY
    for (let j = 0; j < 3; j++) {
      x += (Math.random() - 0.5) * 200
      y += (Math.random() - 0.5) * 200
      ctx.lineTo(x, y)
    }
    ctx.stroke()

    if (Math.random() > 0.5) {
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + (Math.random() - 0.5) * 80, y + (Math.random() - 0.5) * 80)
      ctx.stroke()
    }
  }
  ctx.restore()
}

// 保存时间轴引用
let introTl: gsap.Timeline | null = null
let foldTl: gsap.Timeline | null = null
let floatTl: gsap.Timeline | null = null

const initAnimation = async () => {
  await nextTick()

  const allCards = cardRefs.value.filter(Boolean) as HTMLElement[]
  if (!allCards.length || !containerRef.value || !foldContainerRef.value) return

  // 设置Canvas尺寸
  if (crackCanvasRef.value) {
    crackCanvasRef.value.width = window.innerWidth
    crackCanvasRef.value.height = window.innerHeight
    ctx = crackCanvasRef.value.getContext('2d')
  }

  const cardInners = allCards.map(card => card.querySelector('.card-inner') as HTMLElement)
  const portalCores = allCards.map(card => card.querySelector('.portal-core') as HTMLElement)
  const cardEdgeGlows = allCards.map(card => card.querySelector('.card-edge-glow') as HTMLElement)
  const portalRings = allCards.map(card => card.querySelectorAll('.portal-ring') as NodeListOf<HTMLElement>)

  // 1. 首先让卡片显示在最终位置，然后获取状态
  gsap.set(allCards, {
    x: 0,
    y: 0,
    z: 0,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    scale: 1,
    opacity: 1,
    filter: 'blur(0px)',
    transformStyle: 'preserve-3d',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)'
  })

  gsap.set(cardInners, {
    background: 'linear-gradient(145deg, rgba(10, 30, 60, 0.95), rgba(20, 50, 80, 0.9))',
    borderColor: 'rgba(0, 255, 255, 0.3)'
  })

  gsap.set(portalCores, {
    scale: 1,
    opacity: 1
  })

  // portal-ring 初始可见状态
  portalRings.forEach((rings) => {
    rings.forEach((ring) => {
      gsap.set(ring, { opacity: 0.3, scale: 0.5 })
    })
  })

  // card-edge-glow 初始可见状态
  gsap.set(cardEdgeGlows, { opacity: 0.2, scale: 0.9 })

  // 2. 记录最终状态
  await nextTick()
  const state = Flip.getState(allCards)

  // 3. 设置3D散射初始状态（清晰效果）
  allCards.forEach((card, i) => {
    const rand = getRandom3DState(i)
    gsap.set(card, {
      x: rand.x,
      y: rand.y,
      z: rand.z,
      rotationX: rand.rotationX,
      rotationY: rand.rotationY,
      rotationZ: rand.rotationZ,
      scale: rand.scale,
      opacity: rand.opacity,
      filter: `brightness(${rand.brightness})`,
      transformStyle: 'preserve-3d',
      force3D: true,
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)'
    })
  })

  gsap.set(cardInners, {
    background: 'linear-gradient(145deg, rgba(0, 20, 40, 0.9), rgba(0, 40, 60, 0.85))',
    borderColor: 'rgba(0, 255, 255, 0.1)'
  })

  gsap.set(portalCores, {
    scale: 0,
    opacity: 0
  })

  // 3D散射状态下隐藏 ring
  portalRings.forEach((rings) => {
    rings.forEach((ring) => {
      gsap.set(ring, { opacity: 0 })
    })
  })

  // 3D散射状态下隐藏 glow
  gsap.set(cardEdgeGlows, { opacity: 0 })

  // 背景初始化
  gsap.set(gridLayerRef.value, {
    opacity: 0.3,
    scale: 1.5
  })

  gsap.set(energyFieldRef.value, {
    opacity: 0.2,
    scale: 1.3
  })

  // 标题初始化
  gsap.set([badgeRef.value, titleRef.value, subtitleRef.value], {
    opacity: 0,
    y: -80,
    filter: 'blur(20px)'
  })

  gsap.set(footerTextRef.value, {
    opacity: 0,
    scale: 0
  })

  // 4. 入场动画：背景和标题
  introTl = gsap.timeline({ paused: true })

  introTl.to(gridLayerRef.value, {
    opacity: 0.4,
    scale: 1.2,
    duration: 3,
    ease: 'power2.inOut'
  }, 0)

  introTl.to(energyFieldRef.value, {
    opacity: 0.3,
    scale: 1.1,
    duration: 2,
    ease: 'power2.inOut'
  }, 0)

  introTl.to([badgeRef.value, titleRef.value, subtitleRef.value], {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    duration: 1,
    stagger: 0.15,
    ease: 'power3.out'
  }, 0.5)

  introTl.to(footerTextRef.value, {
    opacity: 1,
    scale: 1,
    duration: 0.8,
    ease: 'back.out(1.5)'
  }, 1)

  introTl.play()

  // 5. 主时间轴：维度折叠动画
  foldTl = gsap.timeline({
    scrollTrigger: {
      trigger: containerRef.value,
      start: 'top 80%',
      end: 'top 10%',
      scrub: 1.5,
      toggleActions: 'play reverse play reverse',
      onUpdate: (self) => {
        drawCracks(self.progress)
      }
    }
  })

  // 核心：卡片从3D散射状态折叠到2D平面
  foldTl.add(
    Flip.from(state, {
      duration: 2,
      stagger: { each: 0.05, from: 'random' },
      ease: 'power3.inOut',
      absolute: true,
      force3D: true
    }),
    0
  )

  // 卡片内部渐变恢复
  cardInners.forEach((inner, i) => {
    foldTl!.to(inner, {
      background: 'linear-gradient(145deg, rgba(10, 30, 60, 0.95), rgba(20, 50, 80, 0.9))',
      borderColor: 'rgba(0, 255, 255, 0.3)',
      duration: 1.5,
      ease: 'power2.out',
      delay: i * 0.03
    }, 0.3)
  })

  // 传送门核心出现
  portalCores.forEach((core, i) => {
    foldTl!.to(core, {
      scale: 1,
      opacity: 1,
      duration: 0.8,
      ease: 'elastic.out(1, 0.6)',
      delay: i * 0.04
    }, 0.5)
  })

  // 边缘发光
  cardEdgeGlows.forEach((glow, i) => {
    foldTl!.to(glow, {
      opacity: 0.8,
      scale: 1.1,
      duration: 1,
      ease: 'power2.out',
      delay: i * 0.04
    }, 0.6)
  })

  // 背景透视调整
  foldTl.to(gridLayerRef.value, {
    scale: 1,
    opacity: 0.5,
    duration: 2,
    ease: 'power2.inOut'
  }, 0)

  foldTl.to(energyFieldRef.value, {
    scale: 1,
    opacity: 0.4,
    duration: 2,
    ease: 'power2.inOut'
  }, 0)

  // 扫描线效果
  foldTl.fromTo(
    scanLineRef.value,
    { y: '-100%', opacity: 0 },
    { y: '200%', opacity: 0.6, duration: 1.5, ease: 'power2.inOut' },
    0.2
  )

  // 6. 透视动态调整
  ScrollTrigger.create({
    trigger: containerRef.value,
    start: 'top 80%',
    end: 'top 10%',
    scrub: 1,
    onUpdate: (self) => {
      if (foldContainerRef.value) {
        const perspective = 2000 - self.progress * 1200
        foldContainerRef.value.style.perspective = `${perspective}px`
      }
    }
  })

  // 7. 维度条动画
  const dimBars = dimensionBarsRef.value?.querySelectorAll('.dim-bar')
  if (dimBars) {
    dimBars.forEach((bar) => {
      const barAnim = gsap.timeline({ paused: true })
      barAnim.to(bar, {
        height: '100%',
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out'
      })
      barAnim.to(bar, {
        height: '40%',
        opacity: 0.5,
        duration: 0.5,
        ease: 'power2.in',
        repeat: -1,
        yoyo: true
      })

      ScrollTrigger.create({
        trigger: containerRef.value,
        start: 'top 70%',
        onEnter: () => barAnim.play(),
        onLeaveBack: () => barAnim.pause()
      })
    })
  }

  // 8. 卡片悬浮动画
  floatTl = gsap.timeline({ paused: true })

  allCards.forEach((card, i) => {
    floatTl!.to(card, {
      y: () => gsap.utils.random(-12, -4),
      rotateX: () => gsap.utils.random(-3, 3),
      rotateY: () => gsap.utils.random(-3, 3),
      duration: 2.5 + Math.random(),
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    }, i * 0.1)
  })

  ScrollTrigger.create({
    trigger: containerRef.value,
    start: 'top 40%',
    onEnter: () => floatTl!.play(),
    onLeaveBack: () => floatTl!.pause()
  })

  // 保存清理函数
  cleanupFns.push(
    () => {
      introTl?.kill()
      foldTl?.kill()
      floatTl?.kill()
    }
  )
}

onMounted(() => {
  initAnimation()
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  introTl?.kill()
  foldTl?.kill()
  floatTl?.kill()
  ScrollTrigger.getAll().forEach(st => {
    if (st.vars.trigger === containerRef.value) {
      st.kill()
    }
  })
  // 重置卡片样式
  const allCards = cardRefs.value.filter(Boolean)
  if (allCards.length) {
    gsap.set(allCards, { clearProps: 'all' })
  }
})
</script>

<style lang="scss" scoped>
.card-time-dimension-fold {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(180deg, #030810 0%, #0a1628 50%, #030810 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  perspective: 2000px;
}

.crack-canvas {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 25;
}

.dimension-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.grid-layer {
  position: absolute;
  inset: -50%;
  background-image:
    linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 60px 60px;
  transform-style: preserve-3d;
  transform: rotateX(60deg) translateZ(-300px);
}

.energy-field {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 150vmax;
  height: 150vmax;
  transform: translate(-50%, -50%);
  background: conic-gradient(
    from 0deg,
    transparent,
    rgba(0, 255, 255, 0.02),
    rgba(0, 200, 255, 0.03),
    rgba(0, 255, 200, 0.02),
    transparent
  );
  border-radius: 50%;
  filter: blur(80px);
}

.dimension-particles {
  position: absolute;
  inset: 0;

  .dim-particle {
    position: absolute;
    border-radius: 50%;
    animation: particleDrift linear infinite;

    @keyframes particleDrift {
      0% {
        transform: translate(0, 0) scale(1);
        opacity: 0.2;
      }
      50% {
        transform: translate(50px, -80px) scale(1.5);
        opacity: 0.7;
      }
      100% {
        transform: translate(0, 0) scale(1);
        opacity: 0.2;
      }
    }
  }
}

.scan-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(0, 255, 255, 0.8),
    rgba(0, 200, 255, 0.6),
    rgba(0, 255, 255, 0.8),
    transparent
  );
  box-shadow: 0 0 30px rgba(0, 255, 255, 0.5);
  pointer-events: none;
  opacity: 0;
  z-index: 30;
}

.fold-header {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  margin-bottom: 35px;
  z-index: 10;
}

.fold-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: rgba(0, 255, 255, 0.9);
  letter-spacing: 4px;
  text-transform: uppercase;
  padding: 10px 24px;
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 30px;
  background: rgba(0, 255, 255, 0.05);
  backdrop-filter: blur(10px);

  .badge-icon {
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 14px;
      height: 14px;
      color: #00ffff;
    }
  }
}

.fold-title {
  font-family: 'Orbitron', 'Rajdhani', sans-serif;
  font-size: 64px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 12px;
  text-transform: uppercase;
  margin: 0;
  background: linear-gradient(135deg, #ffffff 0%, #00ffff 30%, #00aaff 50%, #00ffff 70%, #ffffff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 50px rgba(0, 255, 255, 0.5);
}

.fold-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 2px;
  margin: 0;
  max-width: 500px;
}

.fold-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  max-width: 900px;
  padding: 20px;
  perspective: 2000px;
  transform-style: preserve-3d;
  z-index: 5;
}

.dimension-card {
  width: 260px;
  height: 300px;
  position: relative;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  cursor: pointer;

  &:hover {
    .card-edge-glow {
      opacity: 1 !important;
      transform: scale(1.15);
    }

    .card-inner {
      border-color: rgba(0, 255, 255, 0.5);
      box-shadow: 0 30px 60px rgba(0, 255, 255, 0.25);
    }

    .portal-core svg {
      filter: drop-shadow(0 0 15px #00ffff);
      transform: scale(1.1);
    }
  }
}

.card-fracture {
  position: absolute;
  inset: -15px;
  background: radial-gradient(
    ellipse at center,
    rgba(0, 255, 255, 0.1) 0%,
    transparent 70%
  );
  filter: blur(15px);
  border-radius: 25px;
  opacity: 0.5;
}

.card-inner {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    145deg,
    rgba(10, 30, 60, 0.95),
    rgba(20, 50, 80, 0.9)
  );
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 255, 255, 0.25);
  border-radius: 18px;
  padding: 22px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
  box-shadow:
    0 20px 50px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(0, 255, 255, 0.6),
      rgba(0, 170, 255, 0.4),
      transparent
    );
  }
}

.card-portal {
  width: 85px;
  height: 85px;
  position: relative;
  margin-bottom: 18px;
  transform-style: preserve-3d;
}

.portal-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(0, 255, 255, 0.15);
  opacity: 0;

  &.ring-outer {
    inset: 0;
    animation: portalRotate 18s linear infinite;
  }

  &.ring-middle {
    inset: 18px;
    animation: portalRotate 12s linear infinite reverse;
    border-color: rgba(0, 170, 255, 0.2);
  }

  &.ring-inner {
    inset: 36px;
    animation: portalRotate 8s linear infinite;
    border-color: rgba(0, 255, 255, 0.25);
  }

  @keyframes portalRotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
}

.portal-core {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 35px;
  height: 35px;
  background: linear-gradient(135deg, rgba(0, 255, 255, 0.2), rgba(0, 170, 255, 0.15));
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(0, 255, 255, 0.3);
  box-shadow: 0 0 25px rgba(0, 255, 255, 0.2);
  opacity: 0;

  svg {
    width: 18px;
    height: 18px;
    color: #00ffff;
    transition: all 0.3s ease;
  }
}

.card-body {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
}

.card-index {
  font-family: 'Orbitron', sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: rgba(0, 255, 255, 0.4);
  letter-spacing: 3px;
}

.card-title {
  font-family: 'Orbitron', 'Rajdhani', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.card-desc {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.5;
  margin: 0;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-top: 14px;
  border-top: 1px solid rgba(0, 255, 255, 0.1);
}

.card-tag {
  font-family: 'Inter', sans-serif;
  font-size: 9px;
  font-weight: 600;
  color: #00ffff;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding: 4px 10px;
  background: rgba(0, 255, 255, 0.1);
  border-radius: 10px;
  border: 1px solid rgba(0, 255, 255, 0.2);
}

.card-coordinate {
  display: flex;
  align-items: center;
  gap: 4px;
}

.coord-axis {
  font-family: 'Orbitron', sans-serif;
  font-size: 10px;
  color: rgba(0, 255, 255, 0.5);
}

.coord-value {
  font-family: 'Orbitron', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #00ffff;
}

.card-edge-glow {
  position: absolute;
  inset: -2px;
  border-radius: 20px;
  background: linear-gradient(
    135deg,
    rgba(0, 255, 255, 0.3),
    rgba(0, 170, 255, 0.2),
    rgba(0, 255, 200, 0.3)
  );
  filter: blur(8px);
  pointer-events: none;
  opacity: 0;
  transition: all 0.4s ease;
  z-index: -1;
}

.fold-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-top: 30px;
  z-index: 10;
}

.dimension-bars {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  height: 30px;

  .dim-bar {
    height: 40%;
    background: linear-gradient(to top, rgba(0, 255, 255, 0.5), rgba(0, 170, 255, 0.3));
    border-radius: 3px 3px 0 0;
    opacity: 0.5;
  }
}

.footer-text {
  font-family: 'Orbitron', sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: rgba(0, 255, 255, 0.5);
  letter-spacing: 4px;
  text-transform: uppercase;
}

@media (max-width: 1000px) {
  .fold-container {
    grid-template-columns: repeat(2, 1fr);
    max-width: 580px;
  }

  .dimension-card {
    width: 240px;
    height: 280px;
  }

  .fold-title {
    font-size: 48px;
    letter-spacing: 10px;
  }
}

@media (max-width: 600px) {
  .fold-container {
    grid-template-columns: 1fr;
    max-width: 300px;
    gap: 16px;
  }

  .dimension-card {
    width: 260px;
    height: 260px;
  }

  .card-portal {
    width: 70px;
    height: 70px;
  }

  .fold-title {
    font-size: 32px;
    letter-spacing: 6px;
  }

  .fold-subtitle {
    font-size: 12px;
    letter-spacing: 1px;
  }
}
</style>
