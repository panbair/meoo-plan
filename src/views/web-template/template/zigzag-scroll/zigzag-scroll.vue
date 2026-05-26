<script setup lang="ts">
/**
 * ==================== 之字滚动 (Zigzag Scroll) ====================
 * 竖滚横移 + 横向无限滚动 融合体
 *
 * 3 行 × 3 列 = 9 面板，竖滚驱动逐行横向展开
 *   第 1 行: 左 → 右
 *   第 2 行: 右 → 左 (折返)
 *   第 3 行: 左 → 右 (折返)
 *
 * 核心机制：
 *   1. 外层滚动空间 = (3行) × 100vh
 *   2. 每行是一个 sticky 容器，内嵌 flex-row 的面板轨道
 *   3. GSAP ScrollTrigger 驱动每行轨道水平位移
 *   4. containerAnimation 实现行内面板的入场动画
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ── 配置 ──
const ROWS = 3
const COLS = 3
const totalPanels = ROWS * COLS // 9

const rowData = [
  {
    label: '探索',
    panels: [
      { badge: 'VISION',  title: '愿景与使命',  desc: '改变世界的数字体验' },
      { badge: 'DESIGN',  title: '极简设计',    desc: 'Less is more 设计哲学' },
      { badge: 'CRAFT',   title: '匠心打造',    desc: '每一个像素都在意' },
    ],
  },
  {
    label: '构建',
    panels: [
      { badge: 'DEVELOP', title: '前端工程',    desc: 'Vue 3 + TS 现代化架构' },
      { badge: 'API',     title: '后端服务',    desc: 'Node.js 微服务矩阵' },
      { badge: 'DATA',    title: '数据中台',    desc: '实时数据流处理管道' },
    ],
  },
  {
    label: '交付',
    panels: [
      { badge: 'LAUNCH',  title: '一键部署',    desc: 'CI/CD 流水线自动发布' },
      { badge: 'SCALE',   title: '弹性伸缩',    desc: '容器化自动扩容缩容' },
      { badge: 'SUPPORT', title: '全天守护',    desc: '7×24 小时运维保障' },
    ],
  },
]

// ── 状态 ──
let vw = 0
let vh = 0
let currentPanel = 0 // 全局面板索引 0-8

let scrollArea: HTMLElement | null = null
let progressBar: HTMLElement | null = null
let navDots: HTMLElement | null = null
let mainST: ScrollTrigger | null = null
let panelSTs: ScrollTrigger[] = []

// ── 导航点 ──
function createNavDots() {
  if (!navDots) return
  navDots.innerHTML = ''
  for (let i = 0; i < totalPanels; i++) {
    const dot = document.createElement('button')
    dot.className = 'zz-nav-dot' + (i === 0 ? ' zz-active' : '')
    dot.addEventListener('click', () => goToPanel(i))
    navDots.appendChild(dot)
  }
}

// ── UI 更新 ──
function updateUI(index: number) {
  document.querySelectorAll('.zz-nav-dot').forEach((dot, i) => {
    dot.classList.toggle('zz-active', i === index)
  })
  const el = document.querySelector('.zz-page-indicator .zz-current')
  if (el) el.textContent = String(index + 1)
  // 行标签
  const rowLabels = document.querySelectorAll('.zz-row-label')
  rowLabels.forEach((lbl, rowIdx) => {
    const start = rowIdx * COLS
    const end = start + COLS - 1
    ;(lbl as HTMLElement).classList.toggle('zz-row-active', index >= start && index <= end)
  })
}

// ── 跳转 ──
function goToPanel(index: number) {
  index = Math.max(0, Math.min(index, totalPanels - 1))
  const targetTop = index * vh
  gsap.to(window, {
    scrollTo: { y: targetTop, autoKill: false },
    duration: 0.5,
    ease: 'power2.inOut',
  })
}

// ── 键盘 ──
function onKeydown(e: KeyboardEvent) {
  const map: Record<string, number> = {
    ArrowDown: 1, ArrowRight: 1,
    ArrowUp: -1, ArrowLeft: -1,
    Home: 0, End: totalPanels - 1,
  }
  if (map[e.key] !== undefined) {
    e.preventDefault()
    e.key === 'Home' || e.key === 'End'
      ? goToPanel(map[e.key])
      : goToPanel(currentPanel + map[e.key])
  }
}

let touchStartY = 0
function onTouchStart(e: TouchEvent) { touchStartY = e.touches[0].clientY }
function onTouchEnd(e: TouchEvent) {
  const diff = touchStartY - e.changedTouches[0].clientY
  if (Math.abs(diff) > 50) goToPanel(currentPanel + (diff > 0 ? 1 : -1))
}

// ── 初始化 ──
function init() {
  vw = window.innerWidth
  vh = window.innerHeight

  scrollArea = document.getElementById('zzScrollArea') as HTMLElement
  progressBar = document.getElementById('zzProgressBar')
  navDots = document.getElementById('zzNavDots')
  if (!scrollArea) return

  // ── 构建主时间轴：3 行 × 横向位移 ──
  // 每行 track 在对应时间段平移
  //   行0 (面板0-2):  progress 0.00-0.33
  //   行1 (面板3-5):  progress 0.33-0.66
  //   行2 (面板6-8):  progress 0.66-1.00
  const mainTL = gsap.timeline({ paused: true })

  for (let row = 0; row < ROWS; row++) {
    const trackId = `zzTrack${row}`
    const track = document.getElementById(trackId)
    if (!track) continue

    const isReverse = row % 2 === 1 // 偶数行左→右，奇数行右→左
    const startX = isReverse ? 0 : -(COLS - 1) * vw
    const endX = isReverse ? -(COLS - 1) * vw : 0

    // 每行占 1/ROWS 的进度
    const rowStart = row / ROWS
    const rowEnd = (row + 1) / ROWS

    // 设置 track 初始位置
    gsap.set(track, { x: startX })

    // 在行的时间段内平移
    mainTL.to(track, { x: endX, duration: 1, ease: 'none' }, rowStart)
    mainTL.to(track, {  }, rowEnd) // 占位让后续行开始
  }

  // ── ScrollTrigger 绑定 ──
  mainST = ScrollTrigger.create({
    trigger: scrollArea,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.6,
    animation: mainTL,
    onUpdate: (self) => {
      const idx = Math.round(self.progress * (totalPanels - 1))
      if (idx !== currentPanel) {
        currentPanel = idx
        updateUI(idx)
      }
      if (progressBar) progressBar.style.width = (self.progress * 100) + '%'
    },
  })

  // ── 行内面板内容入场动画 ──
  for (let row = 0; row < ROWS; row++) {
    const track = document.getElementById(`zzTrack${row}`)
    if (!track) continue

    const panels = track.querySelectorAll('.zz-panel') as NodeListOf<HTMLElement>
    panels.forEach((panel, colIdx) => {
      const content = panel.querySelector('.zz-content')
      if (!content) return

      let animated = false
      const animateIn = () => {
        if (animated) return
        animated = true
        gsap.fromTo(content,
          { opacity: 0, y: 40, scale: 0.92 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power2.out' },
        )
      }

      const st = ScrollTrigger.create({
        trigger: panel,
        containerAnimation: row === 0
          ? mainTL.getChildren()[0] as gsap.core.Animation // track0 的 tween
          : undefined,
        start: 'left 70%',
        end: 'left 30%',
        onEnter: animateIn,
        onEnterBack: animateIn,
        onLeave: () => { animated = false },
        onLeaveBack: () => { animated = false },
        // 使用简易标记而非 containerAnimation (兼容性更好)
      })

      // 改用 panel 在视口内的百分比触发
      ScrollTrigger.create({
        trigger: panel,
        start: 'left 75%',
        onEnter: () => {
          if (animated) return
          animated = true
          gsap.fromTo(content,
            { opacity: 0, y: 40, scale: 0.92 },
            { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power2.out' },
          )
        },
        onLeaveBack: () => { animated = false },
      })
      panelSTs.push(st)
    })
  }

  // ── 事件 ──
  document.addEventListener('keydown', onKeydown)
  document.addEventListener('touchstart', onTouchStart, { passive: true })
  document.addEventListener('touchend', onTouchEnd, { passive: true })

  createNavDots()
  updateUI(0)
}

function destroy() {
  mainST?.kill()
  mainST = null
  panelSTs.forEach(st => st.kill())
  panelSTs = []
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('touchstart', onTouchStart)
  document.removeEventListener('touchend', onTouchEnd)
}

onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>

<template>
  <div class="zz-page">
    <!-- 进度条 -->
    <div id="zzProgressBar" class="zz-progress-bar"></div>

    <!-- 行标签导航 -->
    <div class="zz-row-labels">
      <div
        v-for="(rd, ri) in rowData"
        :key="ri"
        class="zz-row-label"
        :class="{ 'zz-row-active': ri === 0 }"
      >
        <span class="zz-row-num">{{ String(ri + 1).padStart(2, '0') }}</span>
        <span class="zz-row-name">{{ rd.label }}</span>
      </div>
    </div>

    <!-- 面板导航点 -->
    <nav id="zzNavDots" class="zz-nav-dots"></nav>

    <!-- 页面指示器 -->
    <div class="zz-page-indicator">
      <span class="zz-current">1</span><span class="zz-total"> / {{ totalPanels }}</span>
    </div>

    <!-- 滚动空间 -->
    <div id="zzScrollArea" class="zz-scroll-area" :style="{ height: totalPanels * 100 + 'vh' }">
      <!-- 行 0 (左→右) -->
      <div class="zz-row-wrapper" :style="{ top: '0vh', height: (COLS * 100) + 'vh' }">
        <div class="zz-row-sticky">
          <div id="zzTrack0" class="zz-track">
            <section
              v-for="(p, pi) in rowData[0].panels"
              :key="pi"
              class="zz-panel"
              :class="'zz-panel-' + (pi % 7)"
            >
              <div class="zz-content">
                <div class="zz-badge">{{ p.badge }}</div>
                <h2>{{ p.title }}</h2>
                <p>{{ p.desc }}</p>
                <div class="zz-panel-num">{{ String(pi + 1).padStart(2, '0') }}</div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <!-- 行 1 (右→左) -->
      <div class="zz-row-wrapper" :style="{ top: (COLS * 100) + 'vh', height: (COLS * 100) + 'vh' }">
        <div class="zz-row-sticky">
          <div id="zzTrack1" class="zz-track">
            <section
              v-for="(p, pi) in rowData[1].panels"
              :key="pi"
              class="zz-panel zz-panel-reverse"
              :class="'zz-panel-' + ((pi + 3) % 7)"
            >
              <div class="zz-content">
                <div class="zz-badge">{{ p.badge }}</div>
                <h2>{{ p.title }}</h2>
                <p>{{ p.desc }}</p>
                <div class="zz-panel-num">{{ String(pi + 4).padStart(2, '0') }}</div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <!-- 行 2 (左→右) -->
      <div class="zz-row-wrapper" :style="{ top: (COLS * 2 * 100) + 'vh', height: (COLS * 100) + 'vh' }">
        <div class="zz-row-sticky">
          <div id="zzTrack2" class="zz-track">
            <section
              v-for="(p, pi) in rowData[2].panels"
              :key="pi"
              class="zz-panel"
              :class="'zz-panel-' + ((pi + 5) % 7)"
            >
              <div class="zz-content">
                <div class="zz-badge">{{ p.badge }}</div>
                <h2>{{ p.title }}</h2>
                <p>{{ p.desc }}</p>
                <div class="zz-panel-num">{{ String(pi + 7).padStart(2, '0') }}</div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.zz-page {
  font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif;
  background: #080c18;
  color: #fff;
}

/* ═══════ 滚动空间 ═══════ */
.zz-scroll-area {
  position: relative;
}

/* ═══════ 行容器 ═══════ */
.zz-row-wrapper {
  position: absolute;
  left: 0;
  width: 100%;
}

.zz-row-sticky {
  position: sticky;
  top: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

/* ═══════ 横向轨道 ═══════ */
.zz-track {
  display: flex;
  will-change: transform;
}

/* ═══════ 面板 ═══════ */
.zz-panel {
  min-width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 20px;
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 20px;
    pointer-events: none;
    z-index: 2;
  }
}

.zz-panel-reverse .zz-content {
  flex-direction: row-reverse;
}

.zz-content {
  text-align: center;
  z-index: 1;
  position: relative;

  h2 {
    font-size: 3.2rem;
    font-weight: 900;
    margin: 0 0 12px;
  }
  p {
    font-size: 1.1rem;
    opacity: 0.5;
    margin: 0;
  }
}

.zz-badge {
  display: inline-block;
  padding: 5px 18px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 18px;
  font-size: 0.7rem;
  letter-spacing: 3px;
  margin-bottom: 18px;
}

.zz-panel-num {
  position: absolute;
  font-size: 14rem;
  font-weight: 900;
  line-height: 1;
  color: rgba(255, 255, 255, 0.025);
  pointer-events: none;
  top: 50%;
  transform: translateY(-50%);
}

/* 编号位置：默认右，反向左 */
.zz-panel:not(.zz-panel-reverse) .zz-panel-num { right: -40px; }
.zz-panel-reverse .zz-panel-num { left: -40px; }
.zz-panel:not(.zz-panel-reverse) .zz-content { padding-right: 80px; }
.zz-panel-reverse .zz-content { padding-left: 80px; }

/* ═══════ 各屏背景渐变 ═══════ */
.zz-panel-0 { background: linear-gradient(135deg, #0a0f24, #1a1a5e); }
.zz-panel-1 { background: linear-gradient(135deg, #0f2027, #2c5364); }
.zz-panel-2 { background: linear-gradient(135deg, #141e30, #243b55); }
.zz-panel-3 { background: linear-gradient(135deg, #1a1a2e, #0f3460); }
.zz-panel-4 { background: linear-gradient(135deg, #0d0d1a, #1a1a3e); }
.zz-panel-5 { background: linear-gradient(135deg, #1a2980, #26d0ce); }
.zz-panel-6 { background: linear-gradient(135deg, #0b1331, #1c2856); }

/* ═══════ 行标签 ═══════ */
.zz-row-labels {
  position: fixed;
  top: 28px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  gap: 12px;
}

.zz-row-label {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(10px);
  transition: all 0.35s ease;
}

.zz-row-label.zz-row-active {
  background: rgba(108, 140, 255, 0.18);
  border-color: rgba(108, 140, 255, 0.4);
  color: #fff;
  box-shadow: 0 0 16px rgba(108, 140, 255, 0.15);
}

.zz-row-num {
  font-weight: 900;
  font-size: 0.78rem;
}

.zz-row-name {
  font-weight: 600;
  letter-spacing: 1px;
}

/* ═══════ 响应式 ═══════ */
@media (max-width: 768px) {
  .zz-content {
    h2 { font-size: 2rem; }
    p { font-size: 0.9rem; }
  }
  .zz-panel-num { font-size: 8rem; }
  .zz-panel:not(.zz-panel-reverse) .zz-panel-num { right: -20px; }
  .zz-panel-reverse .zz-panel-num { left: -20px; }
  .zz-row-labels { gap: 6px; }
  .zz-row-label { padding: 5px 10px; font-size: 0.65rem; }
}
</style>

<style lang="scss">
/* ═══════ 导航点（底部居中，横向排列） ═══════ */
.zz-nav-dots {
  position: fixed;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  gap: 10px;
}

.zz-nav-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.35s ease;

  &:hover { background: rgba(255, 255, 255, 0.5); transform: scale(1.3); }

  &.zz-active {
    background: #6c8cff;
    border-color: rgba(255, 255, 255, 0.4);
    transform: scale(1.5);
    box-shadow: 0 0 18px rgba(108, 140, 255, 0.5);
  }
}

/* 进度条 */
.zz-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #6c8cff, #a78bfa, #f472b6);
  z-index: 1001;
  width: 0%;
  box-shadow: 0 0 10px rgba(108, 140, 255, 0.4);
}

/* 页面指示器 */
.zz-page-indicator {
  position: fixed;
  top: 30px;
  right: 30px;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(12px);
  padding: 7px 18px;
  border-radius: 20px;
  font-size: 0.85rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
}

@media (max-width: 768px) {
  .zz-nav-dots { gap: 8px; overflow-x: auto; max-width: 90vw; padding: 0 8px; }
  .zz-page-indicator { top: auto; bottom: 60px; right: 16px; }
}
</style>
