<template>
  <section ref="stageRef" class="entanglement-stage">
    <!-- 深空背景 -->
    <div class="cosmic-bg">
      <div class="nebula-entity"></div>
      <div class="nebula-shadow"></div>
      <div class="grid-floor"></div>
    </div>

    <!-- 粒子效果 -->
    <canvas ref="particleCanvasRef" class="particle-canvas"></canvas>

    <!-- 标题区 -->
    <div ref="titleRef" class="entanglement-title">
      <span class="title-badge">QUANTUM REALITY</span>
      <h2 class="title-text">时空裂隙</h2>
      <p class="subtitle">Entanglement · Collapse · Reconstruction</p>
    </div>

    <!-- 量子容器 -->
    <div ref="quantumContainerRef" class="quantum-container">
      <!-- 最终网格层 -->
      <div class="final-grid">
        <div
          v-for="(card, i) in quantumCards"
          :key="card.id"
          class="card-wrapper"
        >
          <!-- 实体卡片 -->
          <div
            :ref="el => setEntityRef(el, i)"
            class="card-entity"
            :style="{ '--entity-color': card.entityColor }"
          >
            <div class="card-inner">
              <div class="card-particles"></div>
              <div class="card-content">
                <div class="card-index">
                  <span class="index-label">QUBIT</span>
                  <span class="index-value">{{ String(i + 1).padStart(2, '0') }}</span>
                </div>
                <div class="card-icon" v-html="card.icon"></div>
                <h3 class="card-title">{{ card.title }}</h3>
                <p class="card-desc">{{ card.description }}</p>
              </div>
              <div class="entity-glow"></div>
            </div>
          </div>

          <!-- 镜像虚影 -->
          <div
            :ref="el => setShadowRef(el, i)"
            class="card-shadow"
            :style="{ '--shadow-color': card.shadowColor }"
          >
            <div class="card-inner">
              <div class="card-particles"></div>
              <div class="card-content">
                <div class="card-index">
                  <span class="index-label">QUBIT</span>
                  <span class="index-value">{{ String(i + 1).padStart(2, '0') }}</span>
                </div>
                <div class="card-icon" v-html="card.icon"></div>
                <h3 class="card-title">{{ card.title }}</h3>
                <p class="card-desc">{{ card.description }}</p>
              </div>
              <div class="shadow-glow"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 滚动提示 -->
    <div ref="scrollTipRef" class="scroll-tip">
      <span class="tip-text">SCROLL TO COLLAPSE</span>
      <div class="tip-arrow"></div>
    </div>

    <!-- 状态指示 -->
    <div ref="statusRef" class="quantum-status">
      <div class="status-bar">
        <span class="status-label">ENTANGLEMENT</span>
        <div class="status-track">
          <div ref="statusProgressRef" class="status-progress"></div>
        </div>
        <span class="status-value">{{ collapsePercent }}%</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'

gsap.registerPlugin(ScrollTrigger, Flip)

// ==================== 类型定义 ====================
interface QuantumCard {
  id: number
  title: string
  description: string
  icon: string
  entityColor: string
  shadowColor: string
}

// ==================== Refs ====================
const stageRef = ref<HTMLElement>()
const quantumContainerRef = ref<HTMLElement>()
const particleCanvasRef = ref<HTMLCanvasElement>()
const titleRef = ref<HTMLElement>()
const scrollTipRef = ref<HTMLElement>()
const statusRef = ref<HTMLElement>()
const statusProgressRef = ref<HTMLElement>()
const entityRefs = ref<HTMLElement[]>([])
const shadowRefs = ref<HTMLElement[]>([])
const setEntityRef = (el: any, i: number) => { if (el) entityRefs.value[i] = el }
const setShadowRef = (el: any, i: number) => { if (el) shadowRefs.value[i] = el }

// ==================== 状态 ====================
const collapsePercent = ref(0)

// ==================== 卡片数据 ====================
const quantumCards = reactive<QuantumCard[]>([
  {
    id: 1,
    title: '量子叠加',
    description: '同时存在于多种状态的奇异性',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg>',
    entityColor: '#00ffff',
    shadowColor: '#ff00ff'
  },
  {
    id: 2,
    title: '量子纠缠',
    description: '跨越时空的幽灵般的关联',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/><path d="M12 12m-6 0a6 6 0 1 0 12 0a6 6 0 1 0 -12 0"/></svg>',
    entityColor: '#00ccff',
    shadowColor: '#ff0066'
  },
  {
    id: 3,
    title: '波函数坍缩',
    description: '从概率云到确定性的瞬间',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12h4l3-8 4 16 3-8h4"/></svg>',
    entityColor: '#00ffcc',
    shadowColor: '#ff00aa'
  },
  {
    id: 4,
    title: '量子隧穿',
    description: '穿越经典障碍的可能性',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 8v8M8 12h8"/></svg>',
    entityColor: '#00ff88',
    shadowColor: '#ff8800'
  },
  {
    id: 5,
    title: '退相干',
    description: '量子态与环境相互作用的丧失',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24"/></svg>',
    entityColor: '#00eeff',
    shadowColor: '#ff0055'
  },
  {
    id: 6,
    title: '量子比特',
    description: '0与1叠加的信息单元',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z"/></svg>',
    entityColor: '#00aaff',
    shadowColor: '#ff00cc'
  },
  {
    id: 7,
    title: '相位相干',
    description: '量子态之间的一致性保持',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0"/><path d="M12 8v4l2 2"/></svg>',
    entityColor: '#00ddff',
    shadowColor: '#ff00aa'
  },
  {
    id: 8,
    title: '量子泡沫',
    description: '时空本身在微观尺度的涨落',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
    entityColor: '#00ffff',
    shadowColor: '#ff0088'
  },
  {
    id: 9,
    title: '贝尔不等式',
    description: '量子非定域性的实验验证',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/><path d="M12 12m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0"/><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"/></svg>',
    entityColor: '#44ffff',
    shadowColor: '#ff00ff'
  },
  {
    id: 10,
    title: '量子芝诺',
    description: '持续观测使系统保持不变',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
    entityColor: '#00ccdd',
    shadowColor: '#ff0099'
  },
  {
    id: 11,
    title: '量子漫步',
    description: '概率振幅的随机游走演化',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h4l2-8 4 16 2-8h6"/></svg>',
    entityColor: '#00eedd',
    shadowColor: '#ff0077'
  },
  {
    id: 12,
    title: '量子纠错',
    description: '保护量子信息的冗余编码',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    entityColor: '#00ffcc',
    shadowColor: '#ff00bb'
  }
])

// ==================== 粒子系统 ====================
let particleCtx: CanvasRenderingContext2D | null = null
let particles: Array<{
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  alpha: number
}> = []
let particleAnimId: number | null = null

function initParticles() {
  const canvas = particleCanvasRef.value
  if (!canvas) return

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  particleCtx = canvas.getContext('2d')

  const colors = ['#00ffff', '#ff00ff', '#00ccff', '#ff0088']

  particles = Array.from({ length: 80 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2,
    size: Math.random() * 2 + 0.5,
    color: colors[Math.floor(Math.random() * colors.length)],
    alpha: Math.random() * 0.4 + 0.2
  }))
}

function animateParticles(progress: number) {
  if (!particleCtx || !particleCanvasRef.value) return

  const canvas = particleCanvasRef.value
  particleCtx.clearRect(0, 0, canvas.width, canvas.height)

  particles.forEach(p => {
    // 纠缠态时粒子混乱运动
    const chaos = 1 - progress
    p.x += p.vx * (1 + chaos * 4)
    p.y += p.vy * (1 + chaos * 4)

    if (chaos > 0.5) {
      p.x += (Math.random() - 0.5) * chaos * 8
      p.y += (Math.random() - 0.5) * chaos * 8
    }

    if (p.x < 0 || p.x > canvas.width) p.vx *= -1
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1

    particleCtx!.beginPath()
    particleCtx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    particleCtx!.fillStyle = p.color
    particleCtx!.globalAlpha = p.alpha * (0.3 + progress * 0.7)
    particleCtx!.fill()

    // 光晕效果
    if (chaos > 0.3) {
      particleCtx!.beginPath()
      particleCtx!.arc(p.x, p.y, p.size * 6, 0, Math.PI * 2)
      particleCtx!.fillStyle = p.color
      particleCtx!.globalAlpha = p.alpha * chaos * 0.15
      particleCtx!.fill()
    }
  })

  particleCtx.globalAlpha = 1
}

function killParticles() {
  if (particleAnimId !== null) {
    cancelAnimationFrame(particleAnimId)
    particleAnimId = null
  }
}

// ==================== 纠缠参数生成 ====================
interface EntangledParams {
  entity: {
    offsetX: number
    offsetY: number
    depthZ: number
    rotation: number
    filter: string
    boxShadow: string
  }
  shadow: {
    offsetX: number
    offsetY: number
    depthZ: number
    rotation: number
    scaleX: number
    filter: string
    boxShadow: string
    opacity: number
  }
}

function generateEntangledParams(count: number): EntangledParams[] {
  return Array.from({ length: count }, () => ({
    entity: {
      offsetX: -100 - Math.random() * 150,
      offsetY: -80 - Math.random() * 100,
      depthZ: -150 - Math.random() * 200,
      rotation: (Math.random() - 0.5) * 60,
      filter: `blur(4px) brightness(0.7)`,
      boxShadow: `0 0 50px rgba(0, 255, 255, 0.8), 0 0 100px rgba(0, 255, 255, 0.4)`
    },
    shadow: {
      offsetX: 100 + Math.random() * 150,
      offsetY: 80 + Math.random() * 100,
      depthZ: 150 + Math.random() * 200,
      rotation: (Math.random() - 0.5) * 60,
      scaleX: -1,
      filter: `blur(8px) brightness(1.4) hue-rotate(90deg)`,
      boxShadow: `0 0 50px rgba(255, 0, 255, 0.8), 0 0 100px rgba(255, 0, 255, 0.4)`,
      opacity: 0.6
    }
  }))
}

// ==================== 动画控制 ====================
let timeline: gsap.core.Timeline | null = null
let scrollTriggers: ScrollTrigger[] = []
let flipState: string | null = null
let entryAnimations: gsap.core.Tween[] = []

function initEntanglement() {
  const stage = stageRef.value
  const container = quantumContainerRef.value
  const entities = entityRefs.value.filter(Boolean)
  const shadows = shadowRefs.value.filter(Boolean)

  if (!stage || !container || entities.length === 0 || shadows.length === 0) return

  const allCards = [...entities, ...shadows]

  // 记录最终坍缩状态
  flipState = Flip.getState(allCards, { props: 'x,y,z,rotation,scaleX,filter,boxShadow,opacity' })

  // 生成纠缠参数
  const entangled = generateEntangledParams(entities.length)
  const containerRect = container.getBoundingClientRect()

  // 设置纠缠起始态
  entities.forEach((card, i) => {
    const param = entangled[i].entity
    const baseX = containerRect.width / 2 - card.offsetWidth / 2
    const baseY = containerRect.height / 2 - card.offsetHeight / 2

    gsap.set(card, {
      position: 'absolute',
      left: 0,
      top: 0,
      x: baseX + param.offsetX,
      y: baseY + param.offsetY,
      z: param.depthZ,
      rotation: param.rotation,
      scaleX: 1,
      scaleY: 1,
      filter: param.filter,
      boxShadow: param.boxShadow,
      opacity: 1,
      backfaceVisibility: 'hidden',
      transformStyle: 'preserve-3d'
    })
  })

  shadows.forEach((card, i) => {
    const param = entangled[i].shadow
    const baseX = containerRect.width / 2 - card.offsetWidth / 2
    const baseY = containerRect.height / 2 - card.offsetHeight / 2

    gsap.set(card, {
      position: 'absolute',
      left: 0,
      top: 0,
      x: baseX + param.offsetX,
      y: baseY + param.offsetY,
      z: param.depthZ,
      rotation: param.rotation,
      scaleX: param.scaleX,
      scaleY: 1,
      filter: param.filter,
      boxShadow: param.boxShadow,
      opacity: param.opacity,
      backfaceVisibility: 'hidden',
      transformStyle: 'preserve-3d'
    })
  })

  // 创建时间线 + ScrollTrigger
  timeline = gsap.timeline({
    paused: true
  })

  timeline.add(
    Flip.from(flipState!, {
      duration: 1.8,
      stagger: {
        each: 0.08,
        from: 'center'
      },
      ease: 'power3.inOut',
      absolute: true,
      force3D: true,
      props: 'x,y,z,rotation,scaleX,scaleY,filter,boxShadow,opacity'
    }),
    0
  )

  const scrollTrigger = ScrollTrigger.create({
    trigger: stage,
    start: 'top 90%',
    end: 'top 10%',
    scrub: 2,
    animation: timeline,
    toggleActions: 'play reverse play reverse',
    immediateRender: false,
    onUpdate: (self) => {
      collapsePercent.value = Math.round(self.progress * 100)
      animateParticles(self.progress)
    }
  })

  scrollTriggers.push(scrollTrigger)

  // 3D透视配置
  gsap.set(stage, {
    perspective: 1800
  })

  gsap.set(container, {
    transformStyle: 'preserve-3d'
  })

  // 星云动画
  gsap.to('.nebula-entity', {
    scale: 1.15,
    opacity: 0.4,
    duration: 5,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  })

  gsap.to('.nebula-shadow', {
    scale: 1.2,
    opacity: 0.35,
    duration: 6,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  })
}

function initEntryAnimations() {
  if (!titleRef.value || !scrollTipRef.value || !statusRef.value) return

  // 标题入场
  const titleAnim = gsap.fromTo(
    titleRef.value.children,
    { opacity: 0, y: 80, rotationX: -50 },
    {
      opacity: 1,
      y: 0,
      rotationX: 0,
      stagger: 0.12,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: stageRef.value,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    }
  )
  entryAnimations.push(titleAnim)

  // 提示入场
  const tipAnim = gsap.fromTo(
    [scrollTipRef.value, statusRef.value],
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.1,
      delay: 0.5,
      ease: 'power2.out'
    }
  )
  entryAnimations.push(tipAnim)

  // 网格地板动画
  const gridAnim = gsap.fromTo(
    '.grid-floor',
    { opacity: 0, scaleY: 0.5 },
    {
      opacity: 0.3,
      scaleY: 1,
      duration: 1.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: stageRef.value,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    }
  )
  entryAnimations.push(gridAnim)
}

// ==================== 生命周期 ====================
onMounted(async () => {
  await nextTick()

  initParticles()
  initEntanglement()
  initEntryAnimations()

  // 入场淡入
  const fadeIn = gsap.fromTo(
    stageRef.value,
    { opacity: 0 },
    {
      opacity: 1,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: stageRef.value,
        start: 'top 90%',
        toggleActions: 'play none none reverse'
      }
    }
  )
  entryAnimations.push(fadeIn)
})

onUnmounted(() => {
  // 清理时间线
  if (timeline) {
    timeline.kill()
    timeline = null
  }

  // 清理 ScrollTrigger
  scrollTriggers.forEach(st => st.kill())
  scrollTriggers = []

  // 清理入场动画
  entryAnimations.forEach(anim => anim.kill())
  entryAnimations = []

  // 清理粒子
  killParticles()

  // 清理所有 GSAP 动画
  ScrollTrigger.getAll().forEach(st => st.kill())
  gsap.killTweensOf('*')

  // 清理元素样式
  const allRefs = [...entityRefs.value, ...shadowRefs.value]
  if (allRefs.length > 0) {
    gsap.set(allRefs, { clearProps: 'all' })
  }
})
</script>

<style lang="scss" scoped>
// ==================== 变量 ====================
$entity-cyan: #00ffff;
$shadow-magenta: #ff00ff;
$deep-space: #020014;

// ==================== 主容器 ====================
.entanglement-stage {
  position: relative;
  width: 100vw;
  height: 100vh;
  min-height: 1200px;
  overflow: hidden;
  background: radial-gradient(ellipse at 50% 50%, #0a0a2a 0%, $deep-space 60%, #000 100%);
  font-family: 'Inter', -apple-system, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

// ==================== 背景层 ====================
.cosmic-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.nebula-entity {
  position: absolute;
  top: 30%;
  left: 20%;
  width: 600px;
  height: 600px;
  background: radial-gradient(
    circle,
    rgba($entity-cyan, 0.25) 0%,
    rgba($entity-cyan, 0.1) 30%,
    transparent 60%
  );
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.5;
}

.nebula-shadow {
  position: absolute;
  bottom: 20%;
  right: 15%;
  width: 500px;
  height: 500px;
  background: radial-gradient(
    circle,
    rgba($shadow-magenta, 0.3) 0%,
    rgba($shadow-magenta, 0.1) 30%,
    transparent 60%
  );
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.4;
}

.grid-floor {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50%;
  background:
    linear-gradient(to top, rgba($entity-cyan, 0.08) 0%, transparent 100%),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 80px,
      rgba($entity-cyan, 0.1) 80px,
      rgba($entity-cyan, 0.1) 81px
    ),
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 80px,
      rgba($entity-cyan, 0.05) 80px,
      rgba($entity-cyan, 0.05) 81px
    );
  transform: perspective(500px) rotateX(60deg);
  transform-origin: bottom center;
}

// ==================== 粒子画布 ====================
.particle-canvas {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 5;
}

// ==================== 标题 ====================
.entanglement-title {
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 20;
  perspective: 800px;
}

.title-badge {
  display: inline-block;
  padding: 8px 28px;
  background: linear-gradient(90deg, transparent, rgba($entity-cyan, 0.12), transparent);
  border: 1px solid rgba($shadow-magenta, 0.25);
  border-radius: 25px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 5px;
  text-transform: uppercase;
  color: $entity-cyan;
  margin-bottom: 20px;
}

.title-text {
  font-size: clamp(40px, 8vw, 72px);
  font-weight: 900;
  background: linear-gradient(135deg, white 0%, $entity-cyan 35%, #fff 50%, $shadow-magenta 65%, white 100%);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 12px;
  letter-spacing: -2px;
  animation: gradientShift 4s ease infinite;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.subtitle {
  font-size: 11px;
  color: rgba(white, 0.45);
  letter-spacing: 5px;
  text-transform: uppercase;
  margin: 0;
}

// ==================== 量子容器 ====================
.quantum-container {
  position: relative;
  width: 90vw;
  max-width: 1200px;
  height: 70vh;
  z-index: 10;
}

// ==================== 最终网格 ====================
.final-grid {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 20px;
}

// ==================== 卡片包裹器 ====================
.card-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

// ==================== 实体卡片 ====================
.card-entity {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 18px;
  backface-visibility: hidden;
  will-change: transform, filter, box-shadow, opacity;
  transform-style: preserve-3d;

  .card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 18px;
    background: rgba(5, 5, 25, 0.7);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(white, 0.08);
    overflow: hidden;
    transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  &:hover .card-inner {
    transform: translateZ(20px) scale(1.03);
  }

  &:hover .card-icon {
    transform: rotate(12deg) scale(1.15);
  }
}

.entity-glow {
  position: absolute;
  inset: 0;
  border-radius: 18px;
  background: linear-gradient(
    135deg,
    rgba(var(--entity-color), 0.15) 0%,
    transparent 50%
  );
  pointer-events: none;
}

// ==================== 镜像虚影 ====================
.card-shadow {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 18px;
  backface-visibility: hidden;
  will-change: transform, filter, box-shadow, opacity;
  transform-style: preserve-3d;

  .card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 18px;
    background: rgba(15, 5, 20, 0.7);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(white, 0.06);
    overflow: hidden;
  }
}

.shadow-glow {
  position: absolute;
  inset: 0;
  border-radius: 18px;
  background: linear-gradient(
    -135deg,
    rgba(var(--shadow-color), 0.15) 0%,
    transparent 50%
  );
  pointer-events: none;
}

// ==================== 卡片内容 ====================
.card-particles {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.02) 0%, transparent 50%);
  pointer-events: none;
}

.card-content {
  position: relative;
  z-index: 2;
  height: 100%;
  padding: 18px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-index {
  display: flex;
  align-items: center;
  gap: 8px;
}

.index-label {
  font-size: 8px;
  font-weight: 600;
  letter-spacing: 2px;
  color: rgba(white, 0.35);
  text-transform: uppercase;
}

.index-value {
  font-size: 14px;
  font-weight: 700;
  font-family: 'Courier New', monospace;
  color: $entity-cyan;
  text-shadow: 0 0 12px $entity-cyan;
}

.card-icon {
  width: 32px;
  height: 32px;
  color: $entity-cyan;
  filter: drop-shadow(0 0 8px var(--entity-color));
  transition: transform 0.3s ease;

  svg {
    width: 100%;
    height: 100%;
  }
}

.card-title {
  font-size: 15px;
  font-weight: 700;
  color: white;
  margin: 0 0 4px;
}

.card-desc {
  font-size: 10px;
  color: rgba(white, 0.45);
  margin: 0;
  line-height: 1.4;
}

// ==================== 滚动提示 ====================
.scroll-tip {
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  z-index: 20;
}

.tip-text {
  font-size: 9px;
  letter-spacing: 5px;
  color: rgba(white, 0.3);
  text-transform: uppercase;
}

.tip-arrow {
  width: 24px;
  height: 24px;
  border-right: 2px solid rgba($entity-cyan, 0.5);
  border-bottom: 2px solid rgba($entity-cyan, 0.5);
  transform: rotate(45deg);
  animation: arrowPulse 1.5s ease-in-out infinite;
}

@keyframes arrowPulse {
  0%, 100% { opacity: 0.3; transform: rotate(45deg) translateY(0); }
  50% { opacity: 0.8; transform: rotate(45deg) translateY(6px); }
}

// ==================== 状态指示 ====================
.quantum-status {
  position: absolute;
  top: 50px;
  right: 50px;
  z-index: 20;
}

.status-bar {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-label {
  font-size: 8px;
  font-weight: 600;
  letter-spacing: 2px;
  color: rgba(white, 0.4);
  text-transform: uppercase;
  font-family: 'Courier New', monospace;
}

.status-track {
  width: 100px;
  height: 4px;
  background: rgba(white, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.status-progress {
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, $entity-cyan, $shadow-magenta);
  border-radius: 2px;
  transition: width 0.1s ease;
}

.status-value {
  font-size: 12px;
  font-weight: 700;
  font-family: 'Courier New', monospace;
  color: white;
  min-width: 40px;
}

// ==================== 响应式 ====================
@media (max-width: 1024px) {
  .final-grid {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(4, 1fr);
    gap: 16px;
  }
}

@media (max-width: 768px) {
  .entanglement-title {
    top: 30px;
  }

  .title-text {
    font-size: 32px;
  }

  .subtitle {
    font-size: 9px;
    letter-spacing: 3px;
  }

  .final-grid {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(6, 1fr);
    gap: 12px;
  }

  .card-content {
    padding: 14px;
  }

  .card-icon {
    width: 26px;
    height: 26px;
  }

  .card-title {
    font-size: 13px;
  }

  .card-desc {
    font-size: 9px;
  }

  .quantum-status {
    top: 20px;
    right: 20px;
  }

  .status-label {
    display: none;
  }

  .scroll-tip {
    bottom: 30px;
  }
}
</style>
