<template>
  <section ref="tomeRef" class="tome-section">
    <!-- 深空背景 -->
    <div class="cosmic-void">
      <div class="void-particles"></div>
      <div class="dimensional-rift"></div>
    </div>

    <!-- 书脊辉光 -->
    <div ref="spineGlowRef" class="spine-glow"></div>

    <!-- 标题 -->
    <div ref="titleRef" class="tome-title">
      <span class="title-badge">DIMENSIONAL CODEX</span>
      <h2 class="title-text">维度典籍</h2>
      <p class="subtitle">The Book of Spacetime</p>
    </div>

    <!-- 书册容器 -->
    <div ref="tomeContainerRef" class="tome-container">
      <!-- 页面卡片 -->
      <div
        v-for="(page, i) in tomePages"
        :key="page.id"
        :ref="el => setPageRef(el, i)"
        class="page-card"
        :style="{ '--page-glow': page.glowColor }"
      >
        <div class="card-face">
          <div class="page-edges">
            <div class="edge-top"></div>
            <div class="edge-left"></div>
          </div>
          <div class="page-content">
            <div class="page-header">
              <span class="folio-num">{{ page.folio }}</span>
              <span class="chapter-badge">{{ page.chapter }}</span>
            </div>
            <div class="page-visual">
              <div class="page-icon" v-html="page.icon"></div>
              <div class="page-runes">
                <span v-for="j in 4" :key="j" class="rune">◈</span>
              </div>
            </div>
            <div class="page-body">
              <h3 class="page-title">{{ page.title }}</h3>
              <p class="page-excerpt">{{ page.excerpt }}</p>
            </div>
            <div class="page-footer">
              <div class="page-seal" :style="{ '--seal-color': page.glowColor }"></div>
              <span class="page-sig">{{ page.signature }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 滚动提示 -->
    <div ref="tipRef" class="scroll-tip">
      <span class="tip-text">UNFOLD THE CODEX</span>
    </div>

    <!-- 页码指示 -->
    <div ref="pageIndicatorRef" class="page-indicator">
      <span class="indicator-label">FOLIO</span>
      <span class="indicator-value">{{ displayedPages }}/12</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ==================== 类型定义 ====================
interface TomePage {
  id: number
  folio: string
  chapter: string
  title: string
  excerpt: string
  icon: string
  signature: string
  glowColor: string
}

// ==================== Refs ====================
const tomeRef = ref<HTMLElement>()
const tomeContainerRef = ref<HTMLElement>()
const spineGlowRef = ref<HTMLElement>()
const titleRef = ref<HTMLElement>()
const tipRef = ref<HTMLElement>()
const pageIndicatorRef = ref<HTMLElement>()
const pageRefs = ref<HTMLElement[]>([])
const setPageRef = (el: any, i: number) => { if (el) pageRefs.value[i] = el }

// ==================== 状态 ====================
const displayedPages = ref(0)

// ==================== 典籍页面数据 ====================
const tomePages = reactive<TomePage[]>([
  {
    id: 1,
    folio: 'FOLIO I',
    chapter: 'ORIGIN',
    title: '宇宙起源',
    excerpt: '虚空中诞生的第一缕光芒',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg>',
    signature: '◆',
    glowColor: '#00ffff'
  },
  {
    id: 2,
    folio: 'FOLIO II',
    chapter: 'ENTROPY',
    title: '熵增法则',
    excerpt: '时间单向流逝的宿命',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2v10l4 4"/><circle cx="12" cy="12" r="10"/></svg>',
    signature: '◇',
    glowColor: '#ff00ff'
  },
  {
    id: 3,
    folio: 'FOLIO III',
    chapter: 'VOID',
    title: '虚空之门',
    excerpt: '通往未知维度的裂隙',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/></svg>',
    signature: '○',
    glowColor: '#8800ff'
  },
  {
    id: 4,
    folio: 'FOLIO IV',
    chapter: 'MATTER',
    title: '物质构成',
    excerpt: '万物皆由基本粒子编织',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="3"/><circle cx="6" cy="16" r="3"/><circle cx="18" cy="16" r="3"/><path d="M12 11v2M9.5 14.5l-2-2M14.5 14.5l2-2"/></svg>',
    signature: '◆',
    glowColor: '#00ff88'
  },
  {
    id: 5,
    folio: 'FOLIO V',
    chapter: 'ENERGY',
    title: '能量流转',
    excerpt: '永恒运动的世界本质',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/></svg>',
    signature: '◇',
    glowColor: '#ffff00'
  },
  {
    id: 6,
    folio: 'FOLIO VI',
    chapter: 'GRAVITY',
    title: '引力编织',
    excerpt: '时空弯曲塑造宇宙网',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/></svg>',
    signature: '○',
    glowColor: '#ff8800'
  },
  {
    id: 7,
    folio: 'FOLIO VII',
    chapter: 'QUANTUM',
    title: '量子领域',
    excerpt: '测不准的奇妙王国',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="2"/><circle cx="12" cy="12" r="6" stroke-dasharray="2 2"/><circle cx="12" cy="12" r="10" stroke-dasharray="3 3"/></svg>',
    signature: '◆',
    glowColor: '#00ccff'
  },
  {
    id: 8,
    folio: 'FOLIO VIII',
    chapter: 'DIMENSION',
    title: '维度之门',
    excerpt: '多重宇宙的交汇点',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3l9 4.5v9L12 21l-9-4.5v-9L12 3z"/><path d="M12 12l9-4.5M12 12v9M12 12L3 7.5"/></svg>',
    signature: '◇',
    glowColor: '#ff0088'
  },
  {
    id: 9,
    folio: 'FOLIO IX',
    chapter: 'CONSCIOUS',
    title: '意识之光',
    excerpt: '观测者决定现实态',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v.01M12 8a4 4 0 014 4"/></svg>',
    signature: '○',
    glowColor: '#88ff00'
  },
  {
    id: 10,
    folio: 'FOLIO X',
    chapter: 'INFINITY',
    title: '无限循环',
    excerpt: '永恒回归的时空环',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z"/></svg>',
    signature: '◆',
    glowColor: '#00ffcc'
  },
  {
    id: 11,
    folio: 'FOLIO XI',
    chapter: 'SINGULAR',
    title: '奇点奥秘',
    excerpt: '一切起源与终结之地',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg>',
    signature: '◇',
    glowColor: '#ff4466'
  },
  {
    id: 12,
    folio: 'FOLIO XII',
    chapter: 'TRANSCEND',
    title: '超越永恒',
    excerpt: '超越时空的终极真理',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7l3-7z"/></svg>',
    signature: '○',
    glowColor: '#ffffff'
  }
])

// ==================== 布局常量 ====================
const CARD_W = 200
const CARD_H = 280
const COLS = 4
const ROWS = 3
const GAP_X = 30
const GAP_Y = 25

// ==================== 动画控制 ====================
let scrollTriggers: ScrollTrigger[] = []
let entryAnimations: gsap.core.Tween[] = []
let isExpanded = false // 追踪展开状态

function initTomeAnimation() {
  const tome = tomeRef.value
  const container = tomeContainerRef.value
  const pages = pageRefs.value.filter(Boolean)

  if (!tome || !container || pages.length === 0) return

  const containerRect = container.getBoundingClientRect()

  // 计算最终网格位置（居中）
  const gridTotalW = COLS * CARD_W + (COLS - 1) * GAP_X
  const gridTotalH = ROWS * CARD_H + (ROWS - 1) * GAP_Y
  const gridStartX = (containerRect.width - gridTotalW) / 2
  const gridStartY = (containerRect.height - gridTotalH) / 2

  // 计算每个卡片的网格位置
  const gridPositions = pages.map((_, i) => {
    const col = i % COLS
    const row = Math.floor(i / COLS)
    return {
      x: gridStartX + col * (CARD_W + GAP_X),
      y: gridStartY + row * (CARD_H + GAP_Y),
      z: 0
    }
  })

  // ========== 1. 设置3D透视 ==========
  gsap.set(tome, {
    perspective: 2000
  })

  gsap.set(container, {
    transformStyle: 'preserve-3d'
  })

  // ========== 2. 设置卡片初始状态（书脊姿态 - 居中堆叠） ==========
  const centerX = containerRect.width / 2 - CARD_W / 2
  const centerY = containerRect.height / 2 - CARD_H / 2

  pages.forEach((page, i) => {
    // 书脊效果：Z轴层叠，scale稍小，模拟书本合拢
    const spineZ = (i - pages.length / 2 + 0.5) * 12

    gsap.set(page, {
      position: 'absolute',
      left: 0,
      top: 0,
      x: centerX,
      y: centerY,
      z: spineZ,
      rotateX: 0,
      rotateY: 0,
      scale: 0.88,
      opacity: 0.95,
      transformStyle: 'preserve-3d',
      filter: 'brightness(1.15) saturate(0.95)',
      boxShadow: '0 0 25px rgba(0, 255, 255, 0.25), 0 0 50px rgba(255, 0, 255, 0.15)'
    })
  })

  // ========== 3. 创建展开动画 ==========
  pages.forEach((page, i) => {
    const grid = gridPositions[i]
    const col = i % COLS
    const row = Math.floor(i / COLS)
    // 计算距离中心的曼哈顿距离
    const distFromCenter = Math.abs(col - 1.5) + Math.abs(row - 1)

    // 创建单个卡片的展开动画
    const tween = gsap.to(page, {
      x: grid.x,
      y: grid.y,
      z: 0,
      scale: 1,
      opacity: 1,
      rotateY: 0,
      filter: 'none',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4), inset 0 0 30px rgba(0, 0, 0, 0.2)',
      duration: 1.2,
      ease: 'power4.inOut',
      paused: true, // 默认暂停，由ScrollTrigger控制
      scrollTrigger: {
        trigger: tome,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 1.5,
        toggleActions: 'play reverse play reverse',
        onUpdate: (self) => {
          // 更新显示的页数
          const expandedCount = Math.round(self.progress * pages.length)
          displayedPages.value = expandedCount

          // 更新展开状态
          isExpanded = self.progress > 0.5
        }
      }
    })

    scrollTriggers.push(tween.scrollTrigger!)
  })

  // ========== 4. 书脊辉光动画 ==========
  gsap.to(spineGlowRef.value, {
    scaleY: 1.1,
    opacity: 0.6,
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  })
}

function initEntryAnimations() {
  if (!titleRef.value || !tipRef.value || !pageIndicatorRef.value) return

  // 标题入场
  const titleAnim = gsap.fromTo(
    titleRef.value.children,
    { opacity: 0, y: 50, rotationX: -30 },
    {
      opacity: 1,
      y: 0,
      rotationX: 0,
      stagger: 0.12,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: tomeRef.value,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    }
  )
  entryAnimations.push(titleAnim)

  // 提示入场
  const tipAnim = gsap.fromTo(
    [tipRef.value, pageIndicatorRef.value],
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

  // 延迟初始化，确保 DOM 完全渲染
  setTimeout(() => {
    initTomeAnimation()
    initEntryAnimations()
  }, 100)

  // 入场淡入
  const fadeIn = gsap.fromTo(
    tomeRef.value,
    { opacity: 0 },
    {
      opacity: 1,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: tomeRef.value,
        start: 'top 90%',
        toggleActions: 'play none none reverse'
      }
    }
  )
  entryAnimations.push(fadeIn)
})

onUnmounted(() => {
  // 清理 ScrollTrigger
  scrollTriggers.forEach(st => st && st.kill())
  scrollTriggers = []

  // 清理入场动画
  entryAnimations.forEach(anim => anim.kill())
  entryAnimations = []

  // 清理书脊辉光
  gsap.killTweensOf(spineGlowRef.value)

  // 清理所有 GSAP 实例
  ScrollTrigger.getAll().forEach(st => st.kill())
  gsap.killTweensOf('*')

  // 清理元素样式
  if (pageRefs.value.length > 0) {
    gsap.set(pageRefs.value, { clearProps: 'all' })
  }
})
</script>

<style lang="scss" scoped>
// ==================== 变量 ====================
$cosmic-purple: #1a0a2e;
$page-cyan: #00ffff;
$page-magenta: #ff00ff;
$ancient-gold: #c4a55a;
$void-black: #050510;

// ==================== 主容器 ====================
.tome-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  min-height: 1400px;
  overflow: hidden;
  background: radial-gradient(ellipse at 50% 50%, $cosmic-purple 0%, $void-black 60%, #000 100%);
  font-family: 'Cinzel', 'Times New Roman', serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

// ==================== 深空背景 ====================
.cosmic-void {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.void-particles {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(1px 1px at 20% 30%, rgba(255, 255, 255, 0.3) 0%, transparent 100%),
    radial-gradient(1px 1px at 80% 70%, rgba(255, 255, 255, 0.2) 0%, transparent 100%),
    radial-gradient(1px 1px at 40% 80%, rgba(255, 255, 255, 0.25) 0%, transparent 100%),
    radial-gradient(1px 1px at 60% 20%, rgba(255, 255, 255, 0.2) 0%, transparent 100%);
  animation: voidDrift 60s linear infinite;
}

@keyframes voidDrift {
  0% { transform: translateY(0); }
  100% { transform: translateY(-50%); }
}

.dimensional-rift {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 2px;
  height: 80%;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba($page-cyan, 0.3) 20%,
    rgba($page-magenta, 0.4) 50%,
    rgba($page-cyan, 0.3) 80%,
    transparent 100%
  );
  transform: translate(-50%, -50%);
  filter: blur(1px);
}

// ==================== 书脊辉光 ====================
.spine-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 60%;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba($page-cyan, 0.6),
    rgba($page-magenta, 0.6),
    rgba($page-cyan, 0.6),
    transparent
  );
  transform: translate(-50%, -50%);
  filter: blur(8px);
  z-index: 5;
  pointer-events: none;
}

// ==================== 标题 ====================
.tome-title {
  position: relative;
  top: 40px;
  text-align: center;
  z-index: 30;
  padding: 0 20px;
}

.title-badge {
  display: inline-block;
  padding: 8px 24px;
  background: rgba($page-cyan, 0.08);
  border: 1px solid rgba($page-cyan, 0.25);
  border-radius: 2px;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 6px;
  text-transform: uppercase;
  color: rgba($page-cyan, 0.8);
  margin-bottom: 16px;
  font-family: 'Courier New', monospace;
}

.title-text {
  font-size: clamp(40px, 8vw, 72px);
  font-weight: 900;
  background: linear-gradient(135deg, $ancient-gold 0%, #fff 30%, $ancient-gold 70%, #fff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 10px;
  letter-spacing: 8px;
  text-shadow: 0 0 60px rgba($ancient-gold, 0.5);
}

.subtitle {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.35);
  letter-spacing: 8px;
  text-transform: uppercase;
  margin: 0;
  font-style: italic;
}

// ==================== 书册容器 ====================
.tome-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  max-width: 1100px;
  height: 75vh;
}

// ==================== 页面卡片 ====================
.page-card {
  position: absolute;
  width: 200px;
  height: 280px;
  border-radius: 4px;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  will-change: transform, filter, opacity, box-shadow;
  cursor: pointer;

  &:hover .card-face {
    border-color: rgba($page-cyan, 0.4);
    box-shadow:
      0 20px 50px rgba(0, 0, 0, 0.5),
      0 0 30px rgba(var(--page-glow), 0.3);
  }

  &:hover .page-icon {
    transform: scale(1.1) rotate(5deg);
  }

  &:hover .page-runes .rune {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-face {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    160deg,
    rgba(30, 25, 45, 0.95) 0%,
    rgba(15, 12, 30, 0.98) 100%
  );
  border: 1px solid rgba($page-cyan, 0.15);
  border-radius: 4px;
  overflow: hidden;
  transition: border-color 0.4s, box-shadow 0.4s;
  box-shadow:
    0 10px 40px rgba(0, 0, 0, 0.4),
    inset 0 0 30px rgba(0, 0, 0, 0.2);
}

.page-edges {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.edge-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    var(--page-glow) 30%,
    var(--page-glow) 70%,
    transparent 100%
  );
  opacity: 0.6;
}

.edge-left {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(
    to bottom,
    var(--page-glow) 0%,
    transparent 30%,
    transparent 70%,
    var(--page-glow) 100%
  );
  opacity: 0.3;
}

.page-content {
  height: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.folio-num {
  font-size: 8px;
  font-weight: 600;
  color: rgba($ancient-gold, 0.7);
  letter-spacing: 2px;
  font-family: 'Courier New', monospace;
}

.chapter-badge {
  font-size: 7px;
  font-weight: 600;
  padding: 2px 8px;
  background: rgba(var(--page-glow), 0.15);
  border: 1px solid rgba(var(--page-glow), 0.3);
  border-radius: 2px;
  color: var(--page-glow);
  letter-spacing: 1px;
}

.page-visual {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-icon {
  width: 44px;
  height: 44px;
  color: var(--page-glow);
  opacity: 0.7;
  transition: transform 0.3s ease;
  filter: drop-shadow(0 0 8px var(--page-glow));

  svg {
    width: 100%;
    height: 100%;
  }
}

.page-runes {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;

  .rune {
    font-size: 12px;
    color: var(--page-glow);
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.3s ease;
  }
}

.page-body {
  text-align: center;
}

.page-title {
  font-size: 14px;
  font-weight: 700;
  color: white;
  margin: 0 0 6px;
  letter-spacing: 3px;
}

.page-excerpt {
  font-size: 9px;
  color: rgba(255, 255, 255, 0.4);
  margin: 0;
  line-height: 1.5;
  font-style: italic;
}

.page-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.page-seal {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    var(--seal-color) 0%,
    transparent 70%
  );
  opacity: 0.6;
}

.page-sig {
  font-size: 14px;
  color: var(--page-glow);
  opacity: 0.5;
}

// ==================== 滚动提示 ====================
.scroll-tip {
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 30;
}

.tip-text {
  font-size: 9px;
  letter-spacing: 6px;
  color: rgba(255, 255, 255, 0.25);
  text-transform: uppercase;
  font-family: 'Courier New', monospace;
}

// ==================== 页码指示 ====================
.page-indicator {
  position: absolute;
  bottom: 50px;
  right: 50px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  z-index: 30;
}

.indicator-label {
  font-size: 8px;
  letter-spacing: 3px;
  color: rgba(255, 255, 255, 0.3);
  font-family: 'Courier New', monospace;
}

.indicator-value {
  font-size: 20px;
  font-weight: 700;
  color: $ancient-gold;
  font-family: 'Cinzel', serif;
}

// ==================== 响应式 ====================
@media (max-width: 1024px) {
  .page-card {
    width: 160px;
    height: 220px;
  }
}

@media (max-width: 768px) {
  .tome-title {
    top: 25px;
  }

  .title-text {
    font-size: 32px;
    letter-spacing: 4px;
  }

  .subtitle {
    font-size: 9px;
    letter-spacing: 4px;
  }

  .page-card {
    width: 130px;
    height: 180px;
  }

  .page-content {
    padding: 12px;
  }

  .page-icon {
    width: 32px;
    height: 32px;
  }

  .page-title {
    font-size: 12px;
  }

  .page-excerpt {
    font-size: 8px;
  }

  .page-indicator {
    bottom: 30px;
    right: 20px;
  }

  .scroll-tip {
    bottom: 25px;
  }
}
</style>
