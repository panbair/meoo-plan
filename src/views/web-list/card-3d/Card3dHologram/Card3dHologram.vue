<template>
  <section ref="hologramRef" class="hologram-section">
    <!-- 复古背景 -->
    <div class="retro-bg">
      <div class="scan-grid"></div>
      <div class="vignette-overlay"></div>
      <div class="grain-overlay"></div>
    </div>

    <!-- 扫描光线 -->
    <div ref="scanLineRef" class="scan-line"></div>

    <!-- 标题 -->
    <div ref="titleRef" class="hologram-title">
      <span class="title-badge">HOLOGRAPHIC SCAN</span>
      <h2 class="title-text">复古全息</h2>
      <p class="subtitle">Vintage Film · Scan Projection</p>
    </div>

    <!-- 全息容器 -->
    <div ref="scanContainerRef" class="scan-container">
      <div
        v-for="(card, i) in scanCards"
        :key="card.id"
        :ref="el => setCardRef(el, i)"
        class="scan-card"
        :style="{ '--card-index': i }"
      >
        <div class="card-frame">
          <div class="card-scan-line"></div>
          <div class="card-content">
            <div class="card-header">
              <span class="card-code">{{ card.code }}</span>
              <span class="card-status" :class="`status-${card.status}`">{{ card.statusText }}</span>
            </div>
            <div class="card-visual">
              <div class="visual-icon" v-html="card.icon"></div>
              <div class="visual-grid">
                <div v-for="j in 9" :key="j" class="grid-dot"></div>
              </div>
            </div>
            <div class="card-info">
              <h3 class="card-title">{{ card.title }}</h3>
              <p class="card-meta">{{ card.meta }}</p>
            </div>
            <div class="card-footer">
              <div class="data-bar">
                <div class="data-fill" :style="{ width: card.dataPercent + '%' }"></div>
              </div>
              <span class="data-label">{{ card.dataPercent }}%</span>
            </div>
          </div>
        </div>
        <div class="card-reflection"></div>
      </div>
    </div>

    <!-- 扫描进度 -->
    <div ref="progressRef" class="scan-progress">
      <div class="progress-track">
        <div class="progress-fill"></div>
      </div>
      <span class="progress-text">SCAN {{ scanProgress }}%</span>
    </div>

    <!-- 底部提示 -->
    <div ref="tipRef" class="scan-tip">
      <span>SCROLL TO ACTIVATE</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ==================== 类型定义 ====================
interface ScanCard {
  id: number
  code: string
  title: string
  meta: string
  icon: string
  status: 'active' | 'standby' | 'idle'
  statusText: string
  dataPercent: number
}

// ==================== Refs ====================
const hologramRef = ref<HTMLElement>()
const scanContainerRef = ref<HTMLElement>()
const scanLineRef = ref<HTMLElement>()
const titleRef = ref<HTMLElement>()
const progressRef = ref<HTMLElement>()
const tipRef = ref<HTMLElement>()
const cardRefs = ref<HTMLElement[]>([])
const setCardRef = (el: any, i: number) => { if (el) cardRefs.value[i] = el }

// ==================== 状态 ====================
const scanProgress = ref(0)

// ==================== 卡片数据 ====================
const scanCards = reactive<ScanCard[]>([
  {
    id: 1,
    code: 'SYS-001',
    title: '全息核芯',
    meta: 'HOLOGRAPHIC CORE v3.2',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5"/><line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="8.5" x2="22" y2="15.5"/></svg>',
    status: 'active',
    statusText: 'ACTIVE',
    dataPercent: 94
  },
  {
    id: 2,
    code: 'DAT-002',
    title: '数据矩阵',
    meta: 'DATA MATRIX SCAN',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 7h3v3H7zM14 7h3v3h-3zM7 14h3v3H7zM14 14h3v3h-3z"/></svg>',
    status: 'active',
    statusText: 'ACTIVE',
    dataPercent: 87
  },
  {
    id: 3,
    code: 'SCN-003',
    title: '扫描仪',
    meta: 'SCANNER ARRAY v2.8',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 2v20M2 12h20"/><path d="M12 12l8-8M12 12l-8 8"/></svg>',
    status: 'standby',
    statusText: 'STANDBY',
    dataPercent: 62
  },
  {
    id: 4,
    code: 'PRJ-004',
    title: '投影引擎',
    meta: 'PROJECTION ENGINE',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>',
    status: 'active',
    statusText: 'ACTIVE',
    dataPercent: 78
  },
  {
    id: 5,
    code: 'ANA-005',
    title: '分析模块',
    meta: 'ANALYSIS MODULE',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>',
    status: 'idle',
    statusText: 'IDLE',
    dataPercent: 45
  },
  {
    id: 6,
    code: 'RCP-006',
    title: '重建程序',
    meta: 'RECONSTRUCTION',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>',
    status: 'active',
    statusText: 'ACTIVE',
    dataPercent: 91
  },
  {
    id: 7,
    code: 'ENC-007',
    title: '编码器',
    meta: 'ENCODER v1.9',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4h16v16H4z"/><path d="M9 9h6v6H9z"/><path d="M4 12h3M17 12h3M12 4v3M12 17v3"/></svg>',
    status: 'standby',
    statusText: 'STANDBY',
    dataPercent: 53
  },
  {
    id: 8,
    code: 'SYN-008',
    title: '合成器',
    meta: 'SYNTHESIZER',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>',
    status: 'active',
    statusText: 'ACTIVE',
    dataPercent: 88
  },
  {
    id: 9,
    code: 'LNK-009',
    title: '链路节点',
    meta: 'LINK NODE',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>',
    status: 'active',
    statusText: 'ACTIVE',
    dataPercent: 76
  },
  {
    id: 10,
    code: 'CAL-010',
    title: '校准单元',
    meta: 'CALIBRATION',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
    status: 'idle',
    statusText: 'IDLE',
    dataPercent: 34
  },
  {
    id: 11,
    code: 'TRC-011',
    title: '追踪器',
    meta: 'TRACKING ARRAY',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
    status: 'active',
    statusText: 'ACTIVE',
    dataPercent: 82
  },
  {
    id: 12,
    code: 'PWR-012',
    title: '能量核心',
    meta: 'POWER CORE v4.0',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/></svg>',
    status: 'active',
    statusText: 'ACTIVE',
    dataPercent: 96
  }
])

// ==================== 动画控制 ====================
let timeline: gsap.core.Timeline | null = null
let scrollTriggers: ScrollTrigger[] = []
let entryAnimations: gsap.core.Tween[] = []
let floatTimeline: gsap.core.Timeline | null = null

function initScanAnimation() {
  const container = scanContainerRef.value
  const stage = hologramRef.value
  const cards = cardRefs.value.filter(Boolean)

  if (!container || !stage || cards.length === 0) return

  const containerRect = container.getBoundingClientRect()

  // 1. 初始状态：全息扫描核心（胶片暗调+压缩）
  cards.forEach((card, i) => {
    const col = i % 4
    const row = Math.floor(i / 4)
    const centerX = containerRect.width / 2
    const centerY = containerRect.height / 2
    const cardW = card.offsetWidth || 200
    const cardH = card.offsetHeight || 260

    // 计算每张卡的初始位置（集中在中心）
    const baseX = centerX - cardW / 2
    const baseY = centerY - cardH / 2

    gsap.set(card, {
      position: 'absolute',
      left: 0,
      top: 0,
      x: baseX,
      y: baseY,
      z: -800 - (i % 3) * 100,
      scaleX: 0.3,
      scaleY: 0.4,
      rotateX: 25,
      rotateY: (i % 2 === 0 ? 1 : -1) * 15,
      opacity: 0.2,
      filter: 'brightness(0.3) contrast(1.3) saturate(0.5)',
      transformStyle: 'preserve-3d',
      backfaceVisibility: 'hidden'
    })
  })

  // 2. 扫描展开动画
  timeline = gsap.timeline({ paused: true })

  // 阶段1：预热上浮
  timeline.to(cards, {
    z: -200,
    opacity: 0.5,
    scaleX: 0.6,
    scaleY: 0.7,
    rotateX: 20,
    filter: 'brightness(0.5) contrast(1.2) saturate(0.7)',
    stagger: {
      each: 0.08,
      from: 'center'
    },
    duration: 0.8,
    ease: 'power2.out'
  })

  // 阶段2：扫描展开
  cards.forEach((card, i) => {
    const col = i % 4
    const row = Math.floor(i / 4)
    const containerW = containerRect.width
    const containerH = containerRect.height
    const cardW = card.offsetWidth || 200
    const cardH = card.offsetHeight || 260
    const gapX = (containerW - 4 * cardW) / 5
    const gapY = (containerH - 3 * cardH) / 4

    const targetX = gapX + col * (cardW + gapX)
    const targetY = gapY + row * (cardH + gapY)
    const offsetY = (Math.random() - 0.5) * 30 // 轻微错落

    timeline!.to(card, {
      x: targetX,
      y: targetY + offsetY,
      z: 0,
      scaleX: 1,
      scaleY: 1,
      rotateX: 8,
      rotateY: 0,
      opacity: 1,
      filter: 'brightness(1) contrast(1.1) saturate(1)',
      duration: 1.2,
      ease: 'power3.out'
    }, 0.6 + col * 0.1)
  })

  // 3. ScrollTrigger 驱动
  const scrollTrigger = ScrollTrigger.create({
    trigger: stage,
    start: 'top 90%',
    end: 'top 10%',
    scrub: 2,
    animation: timeline,
    toggleActions: 'play reverse play reverse',
    immediateRender: false,
    onUpdate: (self) => {
      scanProgress.value = Math.round(self.progress * 100)
    }
  })

  scrollTriggers.push(scrollTrigger)

  // 4. 扫描光线动画
  if (scanLineRef.value) {
    gsap.to(scanLineRef.value, {
      top: '100%',
      duration: 2.5,
      ease: 'none',
      repeat: -1,
      repeatDelay: 0.5
    })
  }

  // 5. 3D透视配置
  gsap.set(stage, {
    perspective: 1600
  })

  gsap.set(container, {
    transformStyle: 'preserve-3d'
  })
}

function initFloatingAnimation() {
  const cards = cardRefs.value.filter(Boolean)
  if (cards.length === 0) return

  // 悬浮微动
  floatTimeline = gsap.to(cards, {
    y: '+=6',
    rotateX: '+=2',
    filter: 'brightness(1.05)',
    duration: 3,
    stagger: {
      each: 0.2,
      from: 'random'
    },
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    paused: true
  })
}

function initEntryAnimations() {
  if (!titleRef.value || !tipRef.value || !progressRef.value) return

  // 标题入场
  const titleAnim = gsap.fromTo(
    titleRef.value.children,
    { opacity: 0, y: 60, filter: 'blur(10px)' },
    {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      stagger: 0.1,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: hologramRef.value,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    }
  )
  entryAnimations.push(titleAnim)

  // 底部提示入场
  const tipAnim = gsap.fromTo(
    [tipRef.value, progressRef.value],
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.1,
      delay: 0.3,
      ease: 'power2.out'
    }
  )
  entryAnimations.push(tipAnim)
}

// ==================== 生命周期 ====================
onMounted(async () => {
  await nextTick()

  initScanAnimation()
  initEntryAnimations()

  // 入场淡入
  const fadeIn = gsap.fromTo(
    hologramRef.value,
    { opacity: 0 },
    {
      opacity: 1,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: hologramRef.value,
        start: 'top 90%',
        toggleActions: 'play none none reverse'
      }
    }
  )
  entryAnimations.push(fadeIn)

  // 延迟启动悬浮动画，等待展开完成
  setTimeout(() => {
    if (floatTimeline) {
      floatTimeline.play()
    }
  }, 3000)
})

onUnmounted(() => {
  // 清理主时间线
  if (timeline) {
    timeline.kill()
    timeline = null
  }

  // 清理悬浮动画
  if (floatTimeline) {
    floatTimeline.kill()
    floatTimeline = null
  }

  // 清理 ScrollTrigger
  scrollTriggers.forEach(st => st.kill())
  scrollTriggers = []

  // 清理入场动画
  entryAnimations.forEach(anim => anim.kill())
  entryAnimations = []

  // 清理扫描光线
  gsap.killTweensOf(scanLineRef.value)

  // 清理所有 GSAP 实例
  ScrollTrigger.getAll().forEach(st => st.kill())
  gsap.killTweensOf('*')

  // 清理元素样式
  const allRefs = [...cardRefs.value]
  if (allRefs.length > 0) {
    gsap.set(allRefs, { clearProps: 'all' })
  }
})
</script>

<style lang="scss" scoped>
// ==================== 变量 ====================
$scan-cyan: #78c4ff;
$scan-blue: #4a90d9;
$retro-amber: #ffaa44;
$deep-navy: #0a0f1a;
$frame-gold: #c4a87c;

// ==================== 主容器 ====================
.hologram-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  min-height: 1400px;
  overflow: hidden;
  background: radial-gradient(ellipse at 50% 30%, #121825 0%, $deep-navy 50%, #050810 100%);
  font-family: 'Courier New', 'SF Mono', monospace;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

// ==================== 复古背景 ====================
.retro-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.scan-grid {
  position: absolute;
  inset: 0;
  background:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 60px,
      rgba($scan-cyan, 0.03) 60px,
      rgba($scan-cyan, 0.03) 61px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 60px,
      rgba($scan-cyan, 0.03) 60px,
      rgba($scan-cyan, 0.03) 61px
    );
  opacity: 0.5;
}

.vignette-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at center,
    transparent 0%,
    transparent 40%,
    rgba(0, 0, 0, 0.6) 100%
  );
}

.grain-overlay {
  position: absolute;
  inset: 0;
  opacity: 0.04;
  background-image: url('data:image/svg+xml,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23n)"/></svg>');
  animation: grainShift 0.5s steps(10) infinite;
}

@keyframes grainShift {
  0%, 100% { transform: translate(0, 0); }
  10% { transform: translate(-2%, -2%); }
  20% { transform: translate(2%, 2%); }
  30% { transform: translate(-1%, 1%); }
  40% { transform: translate(1%, -1%); }
  50% { transform: translate(-2%, 2%); }
  60% { transform: translate(2%, -2%); }
  70% { transform: translate(0%, 2%); }
  80% { transform: translate(-2%, 0%); }
  90% { transform: translate(2%, 1%); }
}

// ==================== 扫描光线 ====================
.scan-line {
  position: absolute;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba($scan-cyan, 0.8) 20%,
    rgba($scan-cyan, 1) 50%,
    rgba($scan-cyan, 0.8) 80%,
    transparent 100%
  );
  box-shadow:
    0 0 20px rgba($scan-cyan, 0.8),
    0 0 40px rgba($scan-cyan, 0.4);
  top: 0;
  z-index: 50;
  pointer-events: none;
}

// ==================== 标题 ====================
.hologram-title {
  position: relative;
  top: 50px;
  text-align: center;
  z-index: 30;
  padding: 0 20px;
}

.title-badge {
  display: inline-block;
  padding: 6px 20px;
  background: rgba($scan-cyan, 0.1);
  border: 1px solid rgba($scan-cyan, 0.3);
  border-radius: 3px;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: $scan-cyan;
  margin-bottom: 16px;
}

.title-text {
  font-size: clamp(36px, 7vw, 60px);
  font-weight: 900;
  color: $frame-gold;
  margin: 0 0 10px;
  letter-spacing: 4px;
  text-shadow:
    0 0 30px rgba($retro-amber, 0.5),
    0 2px 0 rgba(0, 0, 0, 0.3);
}

.subtitle {
  font-size: 10px;
  color: rgba($scan-cyan, 0.6);
  letter-spacing: 5px;
  text-transform: uppercase;
  margin: 0;
  font-family: 'Courier New', monospace;
}

// ==================== 全息容器 ====================
.scan-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  max-width: 1000px;
  height: 75vh;
}

// ==================== 扫描卡片 ====================
.scan-card {
  position: absolute;
  width: calc(25% - 20px);
  max-width: 220px;
  height: auto;
  aspect-ratio: 4/5;
  border-radius: 8px;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  will-change: transform, filter, opacity;
  cursor: pointer;

  &:hover .card-frame {
    border-color: rgba($scan-cyan, 0.5);
    box-shadow:
      0 0 30px rgba($scan-cyan, 0.4),
      0 0 60px rgba($scan-cyan, 0.2);
  }

  &:hover .card-scan-line {
    opacity: 1;
  }
}

.card-frame {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    160deg,
    rgba(20, 28, 45, 0.9) 0%,
    rgba(10, 15, 28, 0.95) 100%
  );
  backdrop-filter: blur(12px);
  border: 1px solid rgba($scan-cyan, 0.2);
  border-radius: 8px;
  overflow: hidden;
  transition: border-color 0.3s, box-shadow 0.3s;
  box-shadow:
    0 0 15px rgba($scan-cyan, 0.15),
    inset 0 0 20px rgba($scan-cyan, 0.05);
}

.card-scan-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba($scan-cyan, 0.6) 50%,
    transparent 100%
  );
  opacity: 0;
  transition: opacity 0.3s;
}

.card-content {
  height: 100%;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-code {
  font-size: 9px;
  font-weight: 600;
  color: rgba($scan-cyan, 0.7);
  letter-spacing: 1px;
}

.card-status {
  font-size: 7px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 2px;
  letter-spacing: 1px;

  &.status-active {
    background: rgba($scan-cyan, 0.2);
    color: $scan-cyan;
    border: 1px solid rgba($scan-cyan, 0.3);
  }

  &.status-standby {
    background: rgba($retro-amber, 0.2);
    color: $retro-amber;
    border: 1px solid rgba($retro-amber, 0.3);
  }

  &.status-idle {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
}

.card-visual {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba($scan-cyan, 0.03);
  border-radius: 4px;
  border: 1px solid rgba($scan-cyan, 0.1);
  overflow: hidden;
}

.visual-icon {
  width: 40px;
  height: 40px;
  color: $scan-cyan;
  opacity: 0.8;

  svg {
    width: 100%;
    height: 100%;
  }
}

.visual-grid {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 4px;
  padding: 8px;
  pointer-events: none;
}

.grid-dot {
  border: 1px solid rgba($scan-cyan, 0.1);
  border-radius: 1px;
}

.card-info {
  text-align: center;
}

.card-title {
  font-size: 12px;
  font-weight: 700;
  color: white;
  margin: 0 0 4px;
  letter-spacing: 1px;
}

.card-meta {
  font-size: 8px;
  color: rgba(255, 255, 255, 0.35);
  margin: 0;
  letter-spacing: 1px;
}

.card-footer {
  display: flex;
  align-items: center;
  gap: 8px;
}

.data-bar {
  flex: 1;
  height: 3px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.data-fill {
  height: 100%;
  background: linear-gradient(90deg, $scan-blue, $scan-cyan);
  border-radius: 2px;
}

.data-label {
  font-size: 8px;
  font-weight: 600;
  color: $scan-cyan;
  min-width: 28px;
  text-align: right;
}

.card-reflection {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30%;
  background: linear-gradient(
    to top,
    rgba($scan-cyan, 0.08) 0%,
    transparent 100%
  );
  pointer-events: none;
  border-radius: 0 0 8px 8px;
}

// ==================== 扫描进度 ====================
.scan-progress {
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 30;
}

.progress-track {
  width: 120px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, $retro-amber, $scan-cyan);
  border-radius: 2px;
  transition: width 0.1s linear;
}

.progress-text {
  font-size: 10px;
  font-weight: 600;
  color: rgba($scan-cyan, 0.8);
  letter-spacing: 2px;
}

// ==================== 底部提示 ====================
.scan-tip {
  position: absolute;
  bottom: 25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 9px;
  letter-spacing: 4px;
  color: rgba(255, 255, 255, 0.25);
  text-transform: uppercase;
  z-index: 30;
}

// ==================== 响应式 ====================
@media (max-width: 900px) {
  .scan-card {
    width: calc(33.333% - 16px);
  }
}

@media (max-width: 600px) {
  .hologram-title {
    top: 30px;
  }

  .title-text {
    font-size: 28px;
  }

  .subtitle {
    font-size: 8px;
    letter-spacing: 3px;
  }

  .scan-card {
    width: calc(50% - 12px);
    max-width: 160px;
  }

  .card-content {
    padding: 10px;
  }

  .visual-icon {
    width: 30px;
    height: 30px;
  }

  .card-title {
    font-size: 10px;
  }

  .scan-progress {
    bottom: 40px;
  }

  .scan-tip {
    bottom: 15px;
  }
}
</style>
