<template>
  <section ref="riftRef" class="rift-section">
    <!-- 状态指示器 -->
    <div ref="indicatorRef" class="rift-indicator">
      <span class="indicator-label">{{ phaseLabel }}</span>
      <div class="indicator-bar">
        <div class="indicator-fill" :style="{ width: `${scrollProgress}%` }"></div>
      </div>
      <span class="indicator-value">{{ Math.round(scrollProgress) }}%</span>
    </div>

    <!-- 裂痕背景 -->
    <svg ref="scarsRef" class="rift-scars" viewBox="0 0 100 100" preserveAspectRatio="none">
      <path v-for="i in 8" :key="`scar-${i}`" :d="scarPaths[i - 1]" class="rift-scar" />
    </svg>

    <!-- 能量涟漪层 -->
    <div ref="ripplesRef" class="energy-ripples">
      <div class="pulse-core"></div>
      <div class="ripple-ring ring-1"></div>
      <div class="ripple-ring ring-2"></div>
      <div class="ripple-ring ring-3"></div>
    </div>

    <!-- 卡片网格容器 -->
    <div ref="gridRef" class="card-grid">
      <div
        v-for="(card, idx) in riftCards"
        :key="card.id"
        :ref="el => setCardRef(el, idx)"
        class="rift-card"
      >
        <div class="card-inner">
          <div class="card-image-wrap">
            <img :src="card.url" :alt="card.title" class="card-image" loading="lazy" />
            <div class="card-glitch"></div>
          </div>
          <div class="card-content">
            <div class="card-header">
              <span class="card-index">{{ String(idx + 1).padStart(2, '0') }}</span>
              <span class="card-tag">{{ card.tag }}</span>
            </div>
            <h3 class="card-title">{{ card.title }}</h3>
            <p class="card-desc">{{ card.description }}</p>
            <div class="card-footer">
              <span class="card-timestamp">{{ card.timestamp }}</span>
            </div>
          </div>
          <div class="card-border"></div>
          <div class="card-particles">
            <span v-for="j in 4" :key="`p-${j}`" class="particle"></span>
          </div>
        </div>
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
interface RiftCard {
  id: number
  url: string
  title: string
  tag: string
  description: string
  timestamp: string
}

// ==================== 常量 ====================
const SCAR_PATHS = [
  'M50,0 L50,100', 'M0,50 L100,50',
  'M0,0 L100,100', 'M100,0 L0,100',
  'M25,0 L75,100', 'M75,0 L25,100',
  'M0,25 L100,75', 'M0,75 L100,25'
]

// ==================== Refs ====================
const riftRef = ref<HTMLElement>()
const gridRef = ref<HTMLElement>()
const ripplesRef = ref<HTMLElement>()
const indicatorRef = ref<HTMLElement>()
const scarsRef = ref<SVGElement>()
const cardRefs = ref<HTMLElement[]>([])

const setCardRef = (el: any, i: number) => { if (el) cardRefs.value[i] = el }

// ==================== 状态 ====================
const scrollProgress = ref(0)
const phase = ref<'idle' | 'convergence' | 'divergence'>('idle')

const phaseLabel = computed(() => {
  if (phase.value === 'convergence') return 'CONVERGENCE'
  if (phase.value === 'divergence') return 'DIVERGENCE'
  return 'RIFT STATUS'
})

// 预计算裂痕路径
const scarPaths = SCAR_PATHS

// ==================== 时空裂隙卡片数据 ====================
const riftCards = reactive<RiftCard[]>([
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=800&q=90',
    title: '时间裂隙',
    tag: 'ANOMALY',
    description: '连接不同时空的能量缝隙',
    timestamp: 'TIMESTAMP: 2847.56'
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=90',
    title: '熵增逆转',
    tag: 'ENTROPY',
    description: '因果律暂时失效的奇异点',
    timestamp: 'TIMESTAMP: 2910.23'
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=800&q=90',
    title: '维度折叠',
    tag: 'DIMENSION',
    description: '高维空间在三维的投影',
    timestamp: 'TIMESTAMP: 3001.89'
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=90',
    title: '视界蒸发',
    tag: 'HORIZON',
    description: '信息逃逸的最后一瞬',
    timestamp: 'TIMESTAMP: 3156.42'
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=90',
    title: '虚时隧道',
    tag: 'TUNNEL',
    description: '通向平行宇宙的入口',
    timestamp: 'TIMESTAMP: 3289.17'
  },
  {
    id: 6,
    url: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=800&q=90',
    title: '量子退相干',
    tag: 'QUANTUM',
    description: '无限可能性的坍缩瞬间',
    timestamp: 'TIMESTAMP: 3421.03'
  }
])

// ==================== 动画清理 ====================
let cleanupFns: Array<() => void> = []
let mainTl: gsap.core.Timeline | null = null

function initRiftAnimation() {
  const rift = riftRef.value
  const grid = gridRef.value
  const ripples = ripplesRef.value
  const scars = scarsRef.value

  if (!rift || !grid) return

  const cardElements = cardRefs.value.filter(Boolean)
  if (!cardElements.length) return

  // 获取容器中心
  const gridRect = grid.getBoundingClientRect()
  const centerX = gridRect.width / 2
  const centerY = gridRect.height / 2

  // 设置卡片初始状态（聚集到中心）
  cardElements.forEach((card, i) => {
    const cardRect = card.getBoundingClientRect()
    const cardCenterX = cardRect.left - gridRect.left + cardRect.width / 2
    const cardCenterY = cardRect.top - gridRect.top + cardRect.height / 2

    gsap.set(card, {
      x: centerX - cardCenterX,
      y: centerY - cardCenterY,
      scale: 0,
      opacity: 0,
      rotation: (i % 2 === 0 ? 1 : -1) * (30 + i * 10)
    })
  })

  // 裂痕初始状态
  if (scars) {
    gsap.set('.rift-scar', { strokeDashoffset: 100, opacity: 0 })
  }

  // ========== 创建主时间线 ==========
  mainTl = gsap.timeline({
    scrollTrigger: {
      trigger: rift,
      start: 'top 120%',
      end: 'bottom 20%',
      scrub: 2.5,
      anticipatePin: 1,
      toggleActions: 'play reverse play reverse',
      onUpdate: (self) => {
        scrollProgress.value = self.progress * 100
        if (self.progress < 0.3) {
          phase.value = 'convergence'
        } else {
          phase.value = 'divergence'
        }
      }
    }
  })

  // ========== 第一阶段：消失 (0-30%) ==========
  // 裂痕闪烁
  mainTl.to('.rift-scar', {
    strokeDashoffset: 0,
    opacity: 0.6,
    duration: 0.1,
    stagger: 0.02,
    ease: 'power1.inOut'
  }, 0)

  mainTl.to('.rift-scar', {
    opacity: 0,
    duration: 0.1
  }, 0.08)

  mainTl.to('.rift-scar', {
    strokeDashoffset: 0,
    opacity: 0.4,
    duration: 0.05
  }, 0.12)

  mainTl.to('.rift-scar', {
    opacity: 0,
    duration: 0.05
  }, 0.15)

  // 卡片聚拢消失
  mainTl.to(cardElements, {
    x: 0,
    y: 0,
    scale: 0,
    opacity: 0,
    rotation: (i: number) => (i % 2 === 0 ? 1 : -1) * 180,
    duration: 0.2,
    stagger: 0.02,
    ease: 'power2.in'
  }, 0)

  // ========== 第二阶段：脉冲 (30-50%) ==========
  // 脉冲核心
  mainTl.to('.pulse-core', {
    scale: 8,
    opacity: 0,
    duration: 0.15,
    ease: 'power2.out'
  }, 0.3)

  // 涟漪环
  mainTl.to('.ring-1', {
    scale: 10,
    opacity: 0,
    borderWidth: 0,
    duration: 0.15,
    ease: 'power2.out'
  }, 0.32)

  mainTl.to('.ring-2', {
    scale: 12,
    opacity: 0,
    borderWidth: 0,
    duration: 0.15,
    ease: 'power2.out'
  }, 0.35)

  mainTl.to('.ring-3', {
    scale: 15,
    opacity: 0,
    borderWidth: 0,
    duration: 0.15,
    ease: 'power2.out'
  }, 0.38)

  // ========== 第三阶段：涌现 (50-100%) ==========
  // 卡片从中心涌现
  mainTl.fromTo(cardElements,
    { x: 0, y: 0, scale: 0, opacity: 0, rotation: (i: number) => (i % 2 === 0 ? -1 : 1) * 360 },
    {
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
      rotation: (i: number) => (i % 2 === 0 ? 1 : -1) * 5,
      duration: 0.35,
      stagger: 0.03,
      ease: 'elastic.out(1, 0.6)'
    },
    0.5
  )

  // 错位调整
  mainTl.to(cardElements.slice(0, 3), {
    y: '-=20',
    duration: 0.1,
    ease: 'power2.out'
  }, 0.7)

  mainTl.to(cardElements.slice(3), {
    y: '+=20',
    duration: 0.1,
    ease: 'power2.out'
  }, 0.7)

  // 最终归位
  mainTl.to(cardElements, {
    y: 0,
    rotation: 0,
    duration: 0.15,
    ease: 'power2.out'
  }, 0.8)

  // 裂痕淡出
  mainTl.to('.rift-scar', {
    strokeDashoffset: 100,
    opacity: 0,
    duration: 0.1
  }, 0.7)

  // ========== 保存清理 ==========
  cleanupFns.push(() => {
    if (mainTl) mainTl.kill()
    ScrollTrigger.getAll().forEach(st => {
      if (st.vars.trigger === rift) st.kill()
    })
  })
}

// ==================== 生命周期 ====================
onMounted(async () => {
  await nextTick()
  setTimeout(() => {
    initRiftAnimation()
  }, 100)
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  cleanupFns = []
  ScrollTrigger.getAll().forEach(st => st.kill())
  gsap.killTweensOf('*')
  if (riftRef.value) {
    gsap.set(riftRef.value, { clearProps: 'all' })
  }
})
</script>

<style lang="scss" scoped>
// ==================== 变量 ====================
$rift-cyan: #00f2fe;
$rift-purple: #a855f7;
$rift-pink: #ec4899;
$rift-dark: #0a0a14;

// ==================== 主容器 ====================
.rift-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, $rift-dark 0%, #0f0a1a 50%, #0a0a14 100%);
  font-family: 'Orbitron', 'Rajdhani', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
}

// ==================== 裂痕背景 ====================
.rift-scars {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.rift-scar {
  fill: none;
  stroke: rgba($rift-cyan, 0.3);
  stroke-width: 0.5;
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  filter: drop-shadow(0 0 5px rgba($rift-cyan, 0.5));
}

// ==================== 能量涟漪层 ====================
.energy-ripples {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  pointer-events: none;
  z-index: 5;
}

.pulse-core {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 40px;
  height: 40px;
  margin: -20px 0 0 -20px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba($rift-cyan, 0.9) 0%,
    rgba($rift-purple, 0.5) 50%,
    transparent 70%
  );
  box-shadow:
    0 0 30px rgba($rift-cyan, 0.8),
    0 0 60px rgba($rift-purple, 0.4);
}

.ripple-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80px;
  height: 80px;
  margin: -40px 0 0 -40px;
  border-radius: 50%;
  border: 2px solid rgba($rift-cyan, 0.6);
  transform: scale(1);
  opacity: 1;

  &.ring-1 {
    border-color: rgba($rift-cyan, 0.6);
  }

  &.ring-2 {
    border-color: rgba($rift-purple, 0.5);
  }

  &.ring-3 {
    border-color: rgba($rift-pink, 0.4);
  }
}

// ==================== 卡片网格 ====================
.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  width: 90%;
  max-width: 1100px;
  perspective: 1200px;
  z-index: 10;

  @media (max-width: 1000px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 25px;
  }

  @media (max-width: 650px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

// ==================== 裂隙卡片 ====================
.rift-card {
  position: relative;
  cursor: default;
}

.card-inner {
  position: relative;
  width: 100%;
  height: auto;
  aspect-ratio: 4 / 5;
  border-radius: 20px;
  overflow: hidden;
  background: rgba(15, 15, 25, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba($rift-cyan, 0.15);
  box-shadow:
    0 25px 80px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.05) inset;
  transition: transform 0.4s ease, box-shadow 0.4s ease;

  &:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow:
      0 40px 100px rgba(0, 0, 0, 0.6),
      0 0 40px rgba($rift-cyan, 0.2),
      0 0 0 1px rgba($rift-cyan, 0.3) inset;
  }
}

.card-border {
  position: absolute;
  inset: 0;
  border-radius: 20px;
  padding: 2px;
  background: linear-gradient(
    135deg,
    rgba($rift-cyan, 0.4),
    transparent 40%,
    transparent 60%,
    rgba($rift-pink, 0.4)
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.card-image-wrap {
  position: relative;
  width: 100%;
  height: 55%;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.card-inner:hover .card-image {
  transform: scale(1.1);
}

.card-glitch {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    transparent 60%,
    rgba($rift-cyan, 0.1) 100%
  );
  animation: glitchScan 3s linear infinite;
}

@keyframes glitchScan {
  0% { background-position: 0 0; opacity: 0.5; }
  50% { opacity: 0.8; }
  100% { background-position: 0 100%; opacity: 0.5; }
}

.card-content {
  position: relative;
  padding: 20px;
  height: 45%;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.card-index {
  font-size: 36px;
  font-weight: 700;
  font-family: 'Orbitron', sans-serif;
  color: rgba($rift-cyan, 0.6);
  line-height: 1;
  text-shadow: 0 0 20px rgba($rift-cyan, 0.3);
}

.card-tag {
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 2px;
  color: rgba($rift-pink, 0.9);
  padding: 4px 10px;
  border: 1px solid rgba($rift-pink, 0.4);
  border-radius: 20px;
  background: rgba($rift-pink, 0.1);
}

.card-title {
  font-size: 22px;
  font-weight: 700;
  color: white;
  margin: 0 0 8px;
  letter-spacing: 3px;
  text-transform: uppercase;
  text-shadow: 0 0 20px rgba(white, 0.2);
}

.card-desc {
  font-size: 13px;
  color: rgba(white, 0.6);
  margin: 0;
  line-height: 1.6;
  flex: 1;
}

.card-footer {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.card-timestamp {
  font-size: 10px;
  font-family: 'Courier New', monospace;
  color: rgba($rift-purple, 0.7);
  letter-spacing: 1px;
}

.card-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: $rift-cyan;
  border-radius: 50%;
  box-shadow: 0 0 10px $rift-cyan;

  @for $i from 1 through 4 {
    &:nth-child(#{$i}) {
      top: random(100) * 1%;
      left: random(100) * 1%;
      animation: particleFloat 2s ease-in-out infinite;
      animation-delay: random(2) * 1s;
    }
  }
}

@keyframes particleFloat {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.8;
  }
  50% {
    transform: translate(random(20) - 10 + px, random(20) - 10 + px) scale(0.5);
    opacity: 0.3;
  }
}

// ==================== 状态指示器 ====================
.rift-indicator {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 15px;
  z-index: 30;
}

.indicator-label {
  font-size: 10px;
  letter-spacing: 3px;
  color: rgba(white, 0.4);
  text-transform: uppercase;
}

.indicator-bar {
  width: 120px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.indicator-fill {
  height: 100%;
  background: linear-gradient(90deg, $rift-cyan, $rift-purple);
  border-radius: 2px;
  transition: width 0.1s ease;
  box-shadow: 0 0 10px rgba($rift-cyan, 0.5);
}

.indicator-value {
  font-size: 14px;
  font-weight: 700;
  font-family: 'Orbitron', sans-serif;
  color: $rift-cyan;
  min-width: 45px;
  text-align: right;
}

// ==================== 响应式 ====================
@media (max-width: 1000px) {
  .card-inner {
    aspect-ratio: 3 / 4;
  }

  .card-index {
    font-size: 28px;
  }

  .card-title {
    font-size: 18px;
  }
}

@media (max-width: 650px) {
  .card-inner {
    aspect-ratio: 4 / 5;
  }

  .card-header {
    margin-bottom: 8px;
  }

  .card-index {
    font-size: 24px;
  }

  .card-tag {
    font-size: 8px;
    padding: 3px 8px;
  }

  .card-title {
    font-size: 16px;
    letter-spacing: 2px;
    margin-bottom: 6px;
  }

  .card-desc {
    font-size: 12px;
  }

  .card-content {
    padding: 15px;
  }

  .rift-indicator {
    bottom: 25px;
    gap: 10px;
  }

  .indicator-bar {
    width: 80px;
  }
}
</style>
