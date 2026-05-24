<template>
  <section ref="sectionRef" class="archive-section">
    <!-- 深空背景 -->
    <div class="archive-bg">
      <div class="bg-nebula bg-nebula-1"></div>
      <div class="bg-nebula bg-nebula-2"></div>
      <div class="bg-nebula bg-nebula-3"></div>
      <div class="bg-grid-3d"></div>
    </div>

    <!-- 星空 -->
    <div class="starfield">
      <div
        v-for="i in 60"
        :key="i"
        :ref="el => { if (el) starRefs[i - 1] = el as HTMLElement }"
        class="star"
      ></div>
    </div>

    <!-- 标题区 -->
    <div ref="titleRef" class="archive-title">
      <span class="title-badge">STELLAR ARCHIVE</span>
      <h2 class="title-text">星际档案馆</h2>
      <p class="subtitle">3D Matrix · Holographic Data · Scroll Explore</p>
    </div>

    <!-- 3D 矩阵容器 -->
    <div ref="matrixContainerRef" class="matrix-container">
      <div ref="matrixCoreRef" class="matrix-core">
        <!-- 12 张照片：3层深度 × 4列 -->
        <div
          v-for="(card, index) in archiveCards"
          :key="card.id"
          :ref="el => { if (el) cardRefs[index] = el as HTMLElement }"
          class="archive-card"
          :class="`card-layer-${card.depthLayer}`"
          @mouseenter="onCardHover(index)"
          @mouseleave="onCardLeave(index)"
        >
          <div class="card-inner">
            <!-- 照片 -->
            <div class="card-image-wrap">
              <img :src="card.image" :alt="card.title" class="card-image" />
              <div class="card-gradient" :style="{ background: card.gradient }"></div>
            </div>
            <!-- 照片信息 -->
            <div class="card-info">
              <span class="card-index">{{ String(card.id).padStart(2, '0') }}</span>
              <h3 class="card-title">{{ card.title }}</h3>
              <p class="card-desc">{{ card.description }}</p>
            </div>
            <!-- 边框发光 -->
            <div class="card-border-glow"></div>
            <!-- 玻璃反光 -->
            <div class="card-glass-shine"></div>
          </div>
        </div>

        <!-- 粒子连线层 -->
        <div ref="connectionLinesRef" class="connection-lines">
          <svg ref="connectionSvgRef" class="connection-svg">
            <line
              v-for="(line, i) in connectionPairs"
              :key="`line-${i}`"
              :ref="el => { if (el) lineRefs[i] = el as SVGLineElement }"
              :x1="line.x1" :y1="line.y1"
              :x2="line.x2" :y2="line.y2"
              class="conn-line"
              :stroke="line.color"
            />
          </svg>
        </div>
      </div>
    </div>

    <!-- 粒子画布 -->
    <canvas ref="particleCanvasRef" class="particle-canvas"></canvas>

    <!-- 底部滚动提示 -->
    <div ref="scrollTipRef" class="scroll-tip">
      <div class="tip-arrow">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
      </div>
      <span class="tip-text">SCROLL TO EXPLORE ARCHIVE</span>
    </div>

    <!-- 进度指示器 -->
    <div ref="progressRef" class="archive-progress">
      <div class="progress-ring">
        <svg viewBox="0 0 100 100">
          <defs>
            <linearGradient id="archiveProgressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#a78bfa"/>
              <stop offset="50%" stop-color="#60a5fa"/>
              <stop offset="100%" stop-color="#34d399"/>
            </linearGradient>
          </defs>
          <circle class="progress-bg" cx="50" cy="50" r="45" fill="none" stroke-width="4"/>
          <circle
            ref="progressCircleRef"
            class="progress-fill"
            cx="50" cy="50" r="45"
            fill="none" stroke-width="4"
            stroke-linecap="round"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="progressOffset"
          />
        </svg>
      </div>
      <span class="progress-value">{{ Math.round(currentProgress * 100) }}%</span>
    </div>

    <!-- 层深指示 -->
    <div ref="depthIndicatorRef" class="depth-indicator">
      <span class="depth-label">DEPTH LAYER</span>
      <div class="depth-dots">
        <span
          v-for="layer in 3"
          :key="layer"
          class="depth-dot"
          :class="{ active: currentDepthLayer === layer }"
        ></span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ==================== 类型定义 ====================
interface ArchiveCard {
  id: number
  title: string
  description: string
  image: string
  gradient: string
  color: string
  depthLayer: number // 1-3: 前景/中景/远景
}

interface ConnectionPair {
  x1: number; y1: number
  x2: number; y2: number
  color: string
}

// ==================== Refs ====================
const sectionRef = ref<HTMLElement>()
const matrixContainerRef = ref<HTMLElement>()
const matrixCoreRef = ref<HTMLElement>()
const titleRef = ref<HTMLElement>()
const particleCanvasRef = ref<HTMLCanvasElement>()
const scrollTipRef = ref<HTMLElement>()
const progressRef = ref<HTMLElement>()
const progressCircleRef = ref<SVGElement>()
const connectionLinesRef = ref<HTMLElement>()
const connectionSvgRef = ref<SVGElement>()
const depthIndicatorRef = ref<HTMLElement>()
const cardRefs = ref<HTMLElement[]>([])
const starRefs = ref<HTMLElement[]>([])
const lineRefs = ref<SVGLineElement[]>([])

// ==================== 状态 ====================
const currentProgress = ref(0)
const currentDepthLayer = ref(1)
const circumference = 2 * Math.PI * 45
const progressOffset = computed(() => circumference * (1 - currentProgress.value))

// 12 张 Unsplash 照片数据
const archiveCards = reactive<ArchiveCard[]>([
  {
    id: 1, title: '星云诞辰', description: 'NGC 3372 船底座星云',
    image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&h=400&fit=crop',
    gradient: 'linear-gradient(180deg, transparent 50%, rgba(139, 92, 246, 0.7) 100%)',
    color: '#8b5cf6', depthLayer: 1
  },
  {
    id: 2, title: '极光帷幕', description: '冰岛绿色极光',
    image: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=600&h=400&fit=crop',
    gradient: 'linear-gradient(180deg, transparent 50%, rgba(34, 211, 238, 0.7) 100%)',
    color: '#22d3ee', depthLayer: 1
  },
  {
    id: 3, title: '银河之心', description: '银河系中心黑洞',
    image: 'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=600&h=400&fit=crop',
    gradient: 'linear-gradient(180deg, transparent 50%, rgba(244, 114, 182, 0.7) 100%)',
    color: '#f472b6', depthLayer: 1
  },
  {
    id: 4, title: '日冕风暴', description: '太阳表面磁暴',
    image: 'https://images.unsplash.com/photo-1614642264762-d0a3b8bf3700?w=600&h=400&fit=crop',
    gradient: 'linear-gradient(180deg, transparent 50%, rgba(251, 191, 36, 0.7) 100%)',
    color: '#fbbf24', depthLayer: 1
  },
  {
    id: 5, title: '火星地貌', description: '红色星球表面',
    image: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=600&h=400&fit=crop',
    gradient: 'linear-gradient(180deg, transparent 50%, rgba(248, 113, 113, 0.7) 100%)',
    color: '#f87171', depthLayer: 2
  },
  {
    id: 6, title: '土星环带', description: '土星的壮丽环带',
    image: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=600&h=400&fit=crop',
    gradient: 'linear-gradient(180deg, transparent 50%, rgba(167, 139, 250, 0.7) 100%)',
    color: '#a78bfa', depthLayer: 2
  },
  {
    id: 7, title: '木星红斑', description: '木星大气风暴',
    image: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=600&h=400&fit=crop',
    gradient: 'linear-gradient(180deg, transparent 50%, rgba(252, 165, 165, 0.7) 100%)',
    color: '#fca5a5', depthLayer: 2
  },
  {
    id: 8, title: '月球背面', description: '神秘的月球背面',
    image: 'https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=600&h=400&fit=crop',
    gradient: 'linear-gradient(180deg, transparent 50%, rgba(147, 197, 253, 0.7) 100%)',
    color: '#93c5fd', depthLayer: 2
  },
  {
    id: 9, title: '黑洞视界', description: '事件视界望远镜',
    image: 'https://images.unsplash.com/photo-1504333639802-0e3404bcffe8?w=600&h=400&fit=crop',
    gradient: 'linear-gradient(180deg, transparent 50%, rgba(165, 180, 252, 0.7) 100%)',
    color: '#a5b4fc', depthLayer: 3
  },
  {
    id: 10, title: '彗星轨迹', description: 'NEOWISE 彗星',
    image: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&h=400&fit=crop',
    gradient: 'linear-gradient(180deg, transparent 50%, rgba(96, 165, 250, 0.7) 100%)',
    color: '#60a5fa', depthLayer: 3
  },
  {
    id: 11, title: '仙女星系', description: 'M31 仙女座大星系',
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&h=400&fit=crop',
    gradient: 'linear-gradient(180deg, transparent 50%, rgba(196, 181, 253, 0.7) 100%)',
    color: '#c4b5fd', depthLayer: 3
  },
  {
    id: 12, title: '创生之柱', description: '鹰状星云 M16',
    image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&h=400&fit=crop',
    gradient: 'linear-gradient(180deg, transparent 50%, rgba(94, 234, 212, 0.7) 100%)',
    color: '#5eead4', depthLayer: 3
  }
])

// 卡片之间连线对（同层相邻列连线 + 不同层对应位置连线）
const connectionPairs = computed<ConnectionPair[]>(() => {
  const pairs: ConnectionPair[] = []
  const cols = 4
  const rows = 3

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c
      // 同一层向右连线
      if (c < cols - 1) {
        pairs.push({
          x1: 0, y1: 0, x2: 0, y2: 0,
          color: archiveCards[idx]?.color || '#a78bfa'
        })
      }
      // 不同层向下一层连线
      const nextLayer = r < rows - 1 ? idx + cols : -1
      if (nextLayer >= 0 && nextLayer < archiveCards.length) {
        pairs.push({
          x1: 0, y1: 0, x2: 0, y2: 0,
          color: archiveCards[idx]?.color || '#60a5fa'
        })
      }
    }
  }
  return pairs
})

// ==================== 粒子系统 ====================
let particleCtx: CanvasRenderingContext2D | null = null
let particles: Array<{
  x: number; y: number; z: number
  vx: number; vy: number; vz: number
  size: number; color: string; alpha: number
}> = []
let particleAnimId: number | null = null

function initParticles() {
  const canvas = particleCanvasRef.value
  if (!canvas) return
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  particleCtx = canvas.getContext('2d')

  const colors = ['#a78bfa', '#60a5fa', '#34d399', '#f472b6', '#fbbf24', '#22d3ee']

  particles = Array.from({ length: 100 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    z: Math.random() * 300 - 150,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    vz: (Math.random() - 0.5) * 0.2,
    size: Math.random() * 2.5 + 0.8,
    color: colors[Math.floor(Math.random() * colors.length)],
    alpha: Math.random() * 0.5 + 0.25
  }))
}

function animateParticles(progress: number) {
  if (!particleCtx || !particleCanvasRef.value) return
  const canvas = particleCanvasRef.value
  particleCtx.clearRect(0, 0, canvas.width, canvas.height)

  particles.forEach(p => {
    p.x += p.vx * (1 + progress * 0.8)
    p.y += p.vy * (1 + progress * 0.8)
    p.z += p.vz

    if (p.z > 200 || p.z < -200) p.vz *= -1
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1

    const scale = 1 + p.z / 300
    const screenX = (p.x - canvas.width / 2) * scale + canvas.width / 2
    const screenY = (p.y - canvas.height / 2) * scale + canvas.height / 2

    particleCtx!.beginPath()
    particleCtx!.arc(screenX, screenY, p.size * scale, 0, Math.PI * 2)
    particleCtx!.fillStyle = p.color
    particleCtx!.globalAlpha = p.alpha * (1 - Math.abs(p.z) / 200)
    particleCtx!.fill()
  })

  particleCtx.globalAlpha = 1
}

function killParticles() {
  if (particleAnimId !== null) {
    cancelAnimationFrame(particleAnimId)
    particleAnimId = null
  }
}

// ==================== 连线坐标更新 ====================
function updateConnectionLines() {
  if (!connectionSvgRef.value || !cardRefs.value.length) return

  const svg = connectionSvgRef.value
  const cards = cardRefs.value
  const cols = 4
  const rows = 3

  lineRefs.value.forEach((line, idx) => {
    if (!line) return
    let pairIdx = -1

    // 推算这条线连接的是哪两张卡片
    let lineCount = 0
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cardIdx = r * cols + c
        // 向右连线
        if (c < cols - 1) {
          if (lineCount === idx) {
            const nextCard = cardIdx + 1
            const rect1 = cards[cardIdx]?.getBoundingClientRect()
            const rect2 = cards[nextCard]?.getBoundingClientRect()
            const svgRect = svg.getBoundingClientRect()
            if (rect1 && rect2) {
              line.setAttribute('x1', String(cards[cardIdx].offsetLeft + cards[cardIdx].offsetWidth / 2))
              line.setAttribute('y1', String(cards[cardIdx].offsetTop + cards[cardIdx].offsetHeight / 2))
              line.setAttribute('x2', String(cards[nextCard].offsetLeft + cards[nextCard].offsetWidth / 2))
              line.setAttribute('y2', String(cards[nextCard].offsetTop + cards[nextCard].offsetHeight / 2))
            }
            return
          }
          lineCount++
        }
        // 向下连线
        if (r < rows - 1) {
          if (lineCount === idx) {
            const nextCard = cardIdx + cols
            const rect1 = cards[cardIdx]?.getBoundingClientRect()
            const rect2 = cards[nextCard]?.getBoundingClientRect()
            if (rect1 && rect2) {
              line.setAttribute('x1', String(cards[cardIdx].offsetLeft + cards[cardIdx].offsetWidth / 2))
              line.setAttribute('y1', String(cards[cardIdx].offsetTop + cards[cardIdx].offsetHeight / 2))
              line.setAttribute('x2', String(cards[nextCard].offsetLeft + cards[nextCard].offsetWidth / 2))
              line.setAttribute('y2', String(cards[nextCard].offsetTop + cards[nextCard].offsetHeight / 2))
            }
            return
          }
          lineCount++
        }
      }
    }
  })
}

// ==================== 悬停效果 ====================
function onCardHover(index: number) {
  const card = cardRefs.value[index]
  if (!card) return

  gsap.to(card, {
    z: 120,
    scale: 1.12,
    boxShadow: `0 0 60px ${archiveCards[index].color}66, 0 0 120px ${archiveCards[index].color}22`,
    duration: 0.4,
    ease: 'back.out(1.5)',
    overwrite: 'auto'
  })
}

function onCardLeave(index: number) {
  const card = cardRefs.value[index]
  if (!card) return

  gsap.to(card, {
    z: 0,
    scale: 1,
    boxShadow: `0 0 30px ${archiveCards[index].color}22, 0 4px 30px rgba(0,0,0,0.4)`,
    duration: 0.5,
    ease: 'power2.out',
    overwrite: 'auto'
  })
}

// ==================== 主动画 ====================
let archiveTimeline: gsap.core.Timeline | null = null
let scrollTriggers: ScrollTrigger[] = []

function initAnimations() {
  if (!sectionRef.value || !matrixCoreRef.value || !cardRefs.value.length) return

  const section = sectionRef.value
  const core = matrixCoreRef.value
  const cards = cardRefs.value

  // 设置3D空间
  gsap.set(section, {
    perspective: 2000,
    transformStyle: 'preserve-3d'
  })

  gsap.set(core, {
    transformStyle: 'preserve-3d',
    transformOrigin: 'center center'
  })

  // 每张卡的初始 3D 位置（4列 × 3行 矩阵，X偏移 + Y偏移 + 层深Z）
  const cols = 4
  const rows = 3
  const spacingX = 280
  const spacingY = 220
  const depthSpacing = 200

  cards.forEach((card, i) => {
    const col = i % cols
    const row = Math.floor(i / cols)
    const centerCol = (cols - 1) / 2
    const centerRow = (rows - 1) / 2

    const offsetX = (col - centerCol) * spacingX
    const offsetY = (row - centerRow) * spacingY
    // 不同层深：row 0=前景(近), row 1=中景, row 2=远景(远)
    const depthZ = -(row * depthSpacing + 100)

    gsap.set(card, {
      x: offsetX,
      y: offsetY,
      z: depthZ,
      scale: 1 - row * 0.08,
      opacity: 0.85,
      transformOrigin: 'center center',
      willChange: 'transform'
    })
  })

  // 滚动动画：整个矩阵从平铺视角旋转到俯视视角
  archiveTimeline = gsap.timeline({ paused: true })

  // 阶段 1：各卡片逐个浮现
  archiveTimeline.to(cards, {
    opacity: 1,
    scale: (i: number) => {
      const row = Math.floor(i / cols)
      return 1 - row * 0.05
    },
    duration: 0.6,
    stagger: { each: 0.06, from: 'center' },
    ease: 'power2.out'
  })

  // 阶段 2：矩阵在 3D 空间中变换 — 核心创新：X轴倾斜 + Y轴旋转 + 剖面展开
  archiveTimeline.to(cards, {
    // 每张卡向四周散开更多距离
    x: (i: number) => {
      const col = i % cols
      const centerCol = (cols - 1) / 2
      return (col - centerCol) * spacingX * 1.2
    },
    y: (i: number) => {
      const row = Math.floor(i / cols)
      const centerRow = (rows - 1) / 2
      return (row - centerRow) * spacingY * 1.1
    },
    // 远景层 Z 值先缩近再推远，产生涟漪般的深度波动
    z: (i: number) => {
      const row = Math.floor(i / cols)
      return -(row * depthSpacing + 80) + i * 15
    },
    // 旋转：每张卡片绕自身轴微旋转，产生翻书感
    rotateX: (i: number) => {
      const row = Math.floor(i / cols)
      return (row - 1) * 6
    },
    rotateY: (i: number) => {
      const col = i % cols
      const centerCol = (cols - 1) / 2
      return (col - centerCol) * 5
    },
    rotateZ: (i: number) => (i % 2 === 0 ? 4 : -4),
    stagger: { each: 0.04, from: 'edges' },
    duration: 1.6,
    ease: 'expo.inOut'
  }, '-=0.2')

  // 阶段 3：矩阵整体 3D 变换 — 平铺 → 俯视透视
  archiveTimeline.to(core, {
    rotateX: -45,  // 整体向后倾斜，展现俯视视角
    rotateY: 15,   // 略微右旋，增加立体感
    rotateZ: 2,
    duration: 1.8,
    ease: 'power3.inOut'
  }, '-=0.4')

  // 阶段 4：悬浮呼吸
  archiveTimeline.to(cards, {
    z: '+=15',
    rotateX: '+=2',
    rotateY: '+=2',
    repeat: -1,
    yoyo: true,
    stagger: { each: 0.06, from: 'random' },
    duration: 2.5,
    ease: 'sine.inOut'
  }, '-=0.3')

  // ScrollTrigger 驱动
  const scrollTrigger = ScrollTrigger.create({
    trigger: section,
    start: 'top 80%',
    end: 'top 5%',
    scrub: 1.8,
    animation: archiveTimeline,
    toggleActions: 'play reverse play reverse',
    immediateRender: false,
    onUpdate: (self) => {
      currentProgress.value = self.progress
      animateParticles(self.progress)
      // 根据滚动进度切换层深指示
      currentDepthLayer.value = self.progress < 0.33 ? 1 : self.progress < 0.66 ? 2 : 3
    }
  })

  scrollTriggers.push(scrollTrigger)

  // 同步连线位置更新
  gsap.ticker.add(updateConnectionLines)

  // 标题入场
  if (titleRef.value) {
    gsap.fromTo(
      titleRef.value.children,
      { opacity: 0, y: 50, rotationX: -30 },
      {
        opacity: 1, y: 0, rotationX: 0,
        stagger: 0.12,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        }
      }
    )
  }

  // 星空闪烁
  if (starRefs.value.length) {
    gsap.to(starRefs.value, {
      scale: 1.8,
      opacity: 0.7,
      duration: 2,
      stagger: { each: 0.04, from: 'random' },
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
  }

  // 连线显示
  if (lineRefs.value.length) {
    gsap.fromTo(lineRefs.value,
      { opacity: 0 },
      {
        opacity: 0.4,
        duration: 1,
        stagger: 0.03,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 82%',
          toggleActions: 'play none none reverse'
        }
      }
    )
  }
}

// ==================== 生命周期 ====================
onMounted(async () => {
  await nextTick()

  initParticles()
  initAnimations()

  // 整体入场
  gsap.fromTo(
    matrixContainerRef.value,
    { opacity: 0, scale: 0.7 },
    {
      opacity: 1, scale: 1,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    }
  )

  // 底部提示和进度入场
  gsap.set([scrollTipRef.value, progressRef.value, depthIndicatorRef.value], {
    opacity: 0, y: 15
  })
  gsap.to([scrollTipRef.value, progressRef.value, depthIndicatorRef.value], {
    opacity: 1, y: 0,
    duration: 0.7,
    stagger: 0.12,
    delay: 0.4
  })
})

onUnmounted(() => {
  // 清理连线更新
  gsap.ticker.remove(updateConnectionLines)

  // 清理 ScrollTrigger
  scrollTriggers.forEach(st => st.kill())
  scrollTriggers = []

  // 清理时间线
  if (archiveTimeline) {
    archiveTimeline.kill()
    archiveTimeline = null
  }

  // 清理粒子
  killParticles()

  // 清理所有 GSAP
  ScrollTrigger.getAll().forEach(st => st.kill())
  gsap.killTweensOf('*')

  // 清理卡片样式
  if (cardRefs.value.length) {
    gsap.set(cardRefs.value, { clearProps: 'all' })
  }
})
</script>

<style lang="scss" scoped>
// ==================== 变量 ====================
$archive-bg: #070712;
$archive-purple: #a78bfa;
$archive-blue: #60a5fa;
$archive-teal: #34d399;
$archive-pink: #f472b6;

// ==================== 主容器 ====================
.archive-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  min-height: 800px;
  overflow: hidden;
  background: radial-gradient(ellipse at 30% 50%, #1a1030 0%, $archive-bg 70%, #0a0a18 100%);
  font-family: 'Inter', 'SF Pro Display', -apple-system, sans-serif;
  transform-style: preserve-3d;
}

// ==================== 深空背景 ====================
.archive-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.bg-nebula {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.25;
  animation: nebula-drift 20s ease-in-out infinite;

  &.bg-nebula-1 {
    width: 700px; height: 700px;
    background: radial-gradient(circle, $archive-purple 0%, transparent 70%);
    top: -200px; left: -100px;
  }
  &.bg-nebula-2 {
    width: 600px; height: 600px;
    background: radial-gradient(circle, $archive-blue 0%, transparent 70%);
    bottom: -150px; right: -100px;
    animation-delay: -7s;
  }
  &.bg-nebula-3 {
    width: 500px; height: 500px;
    background: radial-gradient(circle, $archive-teal 0%, transparent 70%);
    top: 40%; left: 40%;
    animation-delay: -14s;
  }
}

@keyframes nebula-drift {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(40px, -30px) scale(1.05); }
  50% { transform: translate(-20px, 25px) scale(0.95); }
  75% { transform: translate(-35px, -15px) scale(1.03); }
}

.bg-grid-3d {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(167, 139, 250, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(167, 139, 250, 0.04) 1px, transparent 1px);
  background-size: 80px 80px;
  transform: perspective(800px) rotateX(55deg);
  transform-origin: center bottom;
  mask-image: linear-gradient(to top, transparent 0%, rgba(0,0,0,0.6) 30%, rgba(0,0,0,1) 60%, transparent 100%);
}

// ==================== 星空 ====================
.starfield {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.star {
  position: absolute;
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;
  opacity: 0.5;

  @for $i from 1 through 60 {
    &:nth-child(#{$i}) {
      left: random(100) * 1%;
      top: random(100) * 1%;
      animation-delay: random(4) * 1s;
      animation-duration: (random(3) + 2) * 1s;
      width: (random(3) + 1) * 1px;
      height: (random(3) + 1) * 1px;
    }
  }

  animation: star-twinkle 3.5s ease-in-out infinite;

  @keyframes star-twinkle {
    0%, 100% { opacity: 0.25; transform: scale(0.8); }
    50% { opacity: 0.9; transform: scale(1.3); }
  }
}

// ==================== 标题 ====================
.archive-title {
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 20;
  perspective: 600px;
}

.title-badge {
  display: inline-block;
  padding: 7px 22px;
  background: linear-gradient(90deg, $archive-purple, $archive-blue, $archive-teal);
  border-radius: 24px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: white;
  margin-bottom: 16px;
  box-shadow: 0 4px 30px rgba($archive-purple, 0.3);
}

.title-text {
  font-size: clamp(38px, 6vw, 64px);
  font-weight: 900;
  background: linear-gradient(135deg, #ffffff 0%, $archive-blue 40%, $archive-purple 80%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 10px;
  letter-spacing: -1.5px;
}

.subtitle {
  font-size: 12px;
  color: rgba(white, 0.45);
  letter-spacing: 5px;
  text-transform: uppercase;
  margin: 0;
}

// ==================== 3D 矩阵容器 ====================
.matrix-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -55%);
  width: 1100px;
  height: 700px;
  transform-style: preserve-3d;
  z-index: 10;
}

.matrix-core {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  display: flex;
  align-items: center;
  justify-content: center;
}

// ==================== 卡片 ====================
.archive-card {
  position: absolute;
  width: 240px;
  height: 340px;
  cursor: pointer;
  transform-style: preserve-3d;
  will-change: transform;
  transition: filter 0.4s ease;

  &:hover {
    z-index: 100 !important;
    filter: brightness(1.15);
  }
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
  transform-style: preserve-3d;
  box-shadow:
    0 4px 30px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.08) inset;
  background: rgba(15, 15, 35, 0.6);
  backdrop-filter: blur(2px);
}

.card-image-wrap {
  position: absolute;
  inset: 0;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.85;
  transition: opacity 0.4s, transform 0.4s;

  .archive-card:hover & {
    opacity: 1;
    transform: scale(1.04);
  }
}

.card-gradient {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.card-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24px 20px;
  z-index: 2;
  background: linear-gradient(0deg, rgba(0,0,0,0.75) 0%, transparent 100%);
}

.card-index {
  font-size: 10px;
  font-weight: 700;
  color: rgba(white, 0.5);
  letter-spacing: 2px;
  display: block;
  margin-bottom: 6px;
}

.card-title {
  font-size: 16px;
  font-weight: 700;
  color: white;
  margin: 0 0 4px;
  text-shadow: 0 2px 8px rgba(0,0,0,0.5);
}

.card-desc {
  font-size: 11px;
  color: rgba(white, 0.65);
  margin: 0;
  line-height: 1.4;
}

.card-border-glow {
  position: absolute;
  inset: 0;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.4s, box-shadow 0.4s;

  .archive-card:hover & {
    opacity: 1;
    box-shadow: inset 0 0 30px rgba(167, 139, 250, 0.15);
  }
}

.card-glass-shine {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.08) 0%,
    transparent 50%,
    rgba(255, 255, 255, 0.03) 100%
  );
  pointer-events: none;
  border-radius: 16px;
}

// ==================== 层深标记 ====================
.card-layer-1 { z-index: 30; }  // 前景
.card-layer-2 { z-index: 20; }  // 中景
.card-layer-3 { z-index: 10; }  // 远景

// ==================== 连线层 ====================
.connection-lines {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 5;
}

.connection-svg {
  width: 100%;
  height: 100%;
}

.conn-line {
  stroke-width: 1;
  stroke-dasharray: 4 6;
  opacity: 0.3;
}

// ==================== 粒子画布 ====================
.particle-canvas {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 8;
}

// ==================== 底部提示 ====================
.scroll-tip {
  position: absolute;
  bottom: 45px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  z-index: 20;
}

.tip-arrow {
  width: 26px;
  height: 26px;
  color: $archive-blue;
  animation: bounce-arrow 2.2s ease-in-out infinite;

  svg { width: 100%; height: 100%; }

  @keyframes bounce-arrow {
    0%, 100% { transform: translateY(0); opacity: 0.8; }
    50% { transform: translateY(7px); opacity: 0.35; }
  }
}

.tip-text {
  font-size: 9px;
  letter-spacing: 5px;
  color: rgba(white, 0.4);
  text-transform: uppercase;
}

// ==================== 进度指示器 ====================
.archive-progress {
  position: absolute;
  bottom: 45px;
  right: 50px;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 20;
}

.progress-ring {
  width: 56px;
  height: 56px;
  transform: rotate(-90deg);
}

.progress-bg {
  stroke: rgba(255, 255, 255, 0.06);
}

.progress-fill {
  stroke: url(#archiveProgressGrad);
  transition: stroke-dashoffset 0.15s ease;
}

.progress-value {
  font-size: 13px;
  font-weight: 700;
  color: white;
  font-variant-numeric: tabular-nums;
}

// ==================== 深度指示器 ====================
.depth-indicator {
  position: absolute;
  top: 50%;
  right: 30px;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  z-index: 20;
}

.depth-label {
  font-size: 8px;
  letter-spacing: 3px;
  color: rgba(white, 0.35);
  writing-mode: vertical-rl;
  text-transform: uppercase;
}

.depth-dots {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.depth-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(white, 0.15);
  transition: all 0.4s ease;

  &.active {
    background: $archive-purple;
    box-shadow: 0 0 12px rgba($archive-purple, 0.6);
    transform: scale(1.4);
  }
}

// ==================== 响应式 ====================
@media (max-width: 1024px) {
  .matrix-container {
    width: 900px;
    height: 600px;
  }

  .archive-card {
    width: 200px;
    height: 280px;
  }
}

@media (max-width: 768px) {
  .archive-title {
    top: 30px;
  }

  .title-text {
    font-size: 28px;
  }

  .subtitle {
    font-size: 10px;
    letter-spacing: 3px;
  }

  .matrix-container {
    width: 340px;
    height: 500px;
    transform: translate(-50%, -50%);
  }

  .archive-card {
    width: 150px;
    height: 210px;
  }

  .card-info {
    padding: 16px 12px;
  }

  .card-title {
    font-size: 13px;
  }

  .card-desc {
    font-size: 10px;
  }

  .archive-progress {
    bottom: 30px;
    right: 16px;
  }

  .progress-ring {
    width: 42px;
    height: 42px;
  }

  .depth-indicator {
    display: none;
  }

  .scroll-tip {
    bottom: 25px;
  }
}
</style>
