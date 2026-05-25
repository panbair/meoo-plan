<script setup lang="ts">
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ==================== 状态 ====================
const totalSections = 5
let currentIndex = 0
let vh = 0

let containerEl: HTMLElement | null = null
let progressBar: HTMLElement | null = null
let navDotsContainer: HTMLElement | null = null
let scrollTriggers: ScrollTrigger[] = []

const sections = [
  { num: '01', tag: 'RESEARCH', title: '用户研究', desc: '深度访谈 200+ 目标用户，构建用户画像与旅程地图。发现核心痛点：现有工具操作繁琐、学习成本高、团队协作断裂。', details: ['一对一深度访谈 × 30', '定量问卷 × 500', '竞品分析 × 12', '可用性测试 × 5 轮'] },
  { num: '02', tag: 'DESIGN', title: '交互设计', desc: '从低保真线框图到高保真交互原型，经历 8 轮快速迭代。采用设计系统思维，确保一致性和可扩展性。', details: ['信息架构重构', '200+ 个线框页面', '8 轮设计评审', '高保真可点击原型'] },
  { num: '03', tag: 'DEVELOP', title: '工程落地', desc: '基于 Vue 3 + TypeScript 全栈开发。前端微服务架构，CI/CD 自动化部署流水线。单元测试覆盖率 > 85%。', details: ['Vue 3 + TS 技术栈', '微前端模块拆分', '自动化 CI/CD 管道', 'E2E 测试 200+ 用例'] },
  { num: '04', tag: 'LAUNCH', title: '灰度发布', desc: '分阶段灰度上线：内部测试 → 1% 用户 → 10% → 50% → 全量。实时监控关键指标，快速响应异常。', details: ['5 阶段灰度策略', '实时 A/B 实验', '崩溃率 < 0.01%', '24h 应急响应团队'] },
  { num: '05', tag: 'ITERATE', title: '持续迭代', desc: '上线只是开始。基于数据驱动的迭代策略，每两周一个 Sprint。用户反馈闭环：收集 → 分析 → 排期 → 上线。', details: ['双周 Sprint 迭代', '用户反馈闭环', '数据看板驱动决策', '季度大版本规划'] }
]

// ==================== 导航点 ====================
function createNavDots() {
  if (!navDotsContainer) return
  navDotsContainer.innerHTML = ''
  for (let i = 0; i < totalSections; i++) {
    const dot = document.createElement('button')
    dot.className = 'exp-nav-dot' + (i === 0 ? ' exp-active' : '')
    dot.addEventListener('click', () => goToSection(i))
    navDotsContainer.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.exp-nav-dot').forEach((dot, i) => {
    dot.classList.toggle('exp-active', i === index)
  })
  const currentEl = document.querySelector('.exp-page-indicator .exp-current')
  if (currentEl) currentEl.textContent = String(index + 1)
  if (progressBar) progressBar.style.width = ((index + 1) / totalSections) * 100 + '%'
}

function goToSection(index: number) {
  if (!containerEl) return
  index = ((index % totalSections) + totalSections) % totalSections
  currentIndex = index
  updateUI(index)
  scrollTriggers.forEach(st => st.disable())
  containerEl.scrollTop = index * vh
  requestAnimationFrame(() => scrollTriggers.forEach(st => st.enable()))
}

// ==================== 键盘导航 ====================
function onKeydown(e: KeyboardEvent) {
  const keyMap: Record<string, number> = {
    ArrowDown: 1, PageDown: 1,
    ArrowUp: -1, PageUp: -1,
    Home: 0, End: totalSections - 1
  }
  if (keyMap[e.key] !== undefined) {
    e.preventDefault()
    e.key === 'Home' || e.key === 'End'
      ? goToSection(keyMap[e.key])
      : goToSection(currentIndex + keyMap[e.key])
  }
}

// ==================== 触摸滑动 ====================
let touchStartY = 0
function onTouchStart(e: TouchEvent) { touchStartY = e.touches[0].clientY }
function onTouchEnd(e: TouchEvent) {
  const diff = touchStartY - e.changedTouches[0].clientY
  if (Math.abs(diff) > 40) goToSection(currentIndex + (diff > 0 ? 1 : -1))
}

// ==================== 初始化 / 销毁 ====================
function init() {
  vh = window.innerHeight
  containerEl = document.getElementById('expScrollContainer') as HTMLElement
  progressBar = document.getElementById('expProgressBar')
  navDotsContainer = document.getElementById('expNavDots')
  if (!containerEl) return

  // Snap 全屏吸附
  const snapST = ScrollTrigger.create({
    trigger: containerEl,
    start: 'top top',
    end: `+=${totalSections * 100}%`,
    snap: {
      snapTo: 1 / totalSections,
      duration: { min: 0.2, max: 0.45 },
      delay: 0.05,
      ease: 'power1.inOut'
    }
  })
  scrollTriggers.push(snapST)

  // 每段的展开动画：details 列表逐项滑出
  const panelEls = containerEl.querySelectorAll('.exp-panel')
  panelEls.forEach((panel, i) => {
    const detailsEl = panel.querySelector('.exp-details-list') as HTMLElement
    const detailItems = panel.querySelectorAll('.exp-detail-item')
    if (!detailsEl || detailItems.length === 0) return

    // 初始化隐藏
    gsap.set(detailItems, { opacity: 0, x: -30 })

    const st = ScrollTrigger.create({
      trigger: panel,
      start: 'top 55%',
      onEnter: () => {
        gsap.to(detailItems, {
          opacity: 1, x: 0, duration: 0.5,
          ease: 'power2.out',
          stagger: 0.1,
          overwrite: 'auto'
        })
      },
      onLeaveBack: () => {
        gsap.to(detailItems, {
          opacity: 0, x: -30, duration: 0.3,
          ease: 'power2.in',
          overwrite: 'auto'
        })
      }
    })
    scrollTriggers.push(st)
  })

  // 当前屏追踪
  const panelsArr = gsap.utils.toArray('.exp-panel')
  panelsArr.forEach((panel: any, i: number) => {
    const st = ScrollTrigger.create({
      trigger: panel,
      start: 'top 60%',
      end: 'bottom 40%',
      onEnter: () => { currentIndex = i; updateUI(i) },
      onEnterBack: () => { currentIndex = i; updateUI(i) }
    })
    scrollTriggers.push(st)
  })

  // 事件
  document.addEventListener('keydown', onKeydown)
  document.addEventListener('touchstart', onTouchStart, { passive: true })
  document.addEventListener('touchend', onTouchEnd, { passive: true })

  createNavDots()
  updateUI(0)
}

function destroy() {
  scrollTriggers.forEach(st => st.kill())
  scrollTriggers = []
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('touchstart', onTouchStart)
  document.removeEventListener('touchend', onTouchEnd)
}

onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>

<template>
  <div class="exp-brand-page">
    <div id="expProgressBar" class="exp-progress-bar"></div>
    <nav id="expNavDots" class="exp-nav-dots"></nav>
    <div class="exp-page-indicator">
      <span class="exp-current">1</span><span class="exp-total"> / {{ totalSections }}</span>
    </div>
    <div class="exp-vertical-label">EXPAND</div>

    <div id="expScrollContainer" class="exp-container">
      <section
        v-for="(sec, i) in sections"
        :key="i"
        class="exp-panel"
        :class="'exp-panel-' + i"
        :data-index="i"
      >
        <div class="exp-grid-bg"></div>
        <div class="exp-content">
          <!-- 左侧：编号 + 标题 + 描述 -->
          <div class="exp-main">
            <div class="exp-num-row">
              <span class="exp-num">{{ sec.num }}</span>
              <span class="exp-tag">{{ sec.tag }}</span>
            </div>
            <h2 class="exp-title">{{ sec.title }}</h2>
            <p class="exp-desc">{{ sec.desc }}</p>
          </div>

          <!-- 右侧：可展开的详情列表 -->
          <div class="exp-details">
            <div class="exp-details-label">KEY POINTS</div>
            <ul class="exp-details-list">
              <li v-for="(detail, di) in sec.details" :key="di" class="exp-detail-item">
                <span class="exp-detail-bullet"></span>
                <span>{{ detail }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- 背景装饰 -->
        <div class="exp-ornament">
          <div class="exp-ornament-line l1"></div>
          <div class="exp-ornament-line l2"></div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
.exp-brand-page {
  height: 100vh;
  overflow: hidden;
  font-family: 'PingFang SC', 'Microsoft YaHei', -apple-system, sans-serif;
  background: #060610;
  color: #fff;
}
.exp-container {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}
.exp-panel {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 3rem clamp(1.5rem, 5vw, 4rem);
}
/* 各屏背景 */
.exp-panel-0 { background: linear-gradient(160deg, #080d20 0%, #121840 50%, #080d20 100%); }
.exp-panel-1 { background: linear-gradient(160deg, #20080d 0%, #40121a 50%, #20080d 100%); }
.exp-panel-2 { background: linear-gradient(160deg, #082010 0%, #15302a 50%, #082010 100%); }
.exp-panel-3 { background: linear-gradient(160deg, #201008 0%, #402818 50%, #201008 100%); }
.exp-panel-4 { background: linear-gradient(160deg, #100820 0%, #281840 50%, #100820 100%); }

/* 网格背景 */
.exp-grid-bg {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
  background-size: 60px 60px;
  pointer-events: none;
}

/* 内容布局 */
.exp-content {
  position: relative;
  z-index: 5;
  display: flex;
  gap: clamp(2rem, 6vw, 5rem);
  max-width: 1000px;
  width: 100%;
  align-items: center;
}
.exp-main { flex: 1; }
.exp-details { flex: 1; min-width: 240px; }

/* 左侧主内容 */
.exp-num-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}
.exp-num {
  font-size: 3rem;
  font-weight: 900;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}
.exp-tag {
  font-size: 0.65rem;
  letter-spacing: 0.25em;
  color: rgba(168,85,247,0.6);
  border: 1px solid rgba(168,85,247,0.2);
  padding: 0.2em 0.7em;
  border-radius: 3px;
}
.exp-title {
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  font-weight: 800;
  line-height: 1.2;
  margin: 0 0 1rem;
  background: linear-gradient(135deg, #fff 0%, #c4b5fd 70%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.exp-desc {
  font-size: clamp(0.85rem, 1.3vw, 1rem);
  line-height: 1.7;
  opacity: 0.5;
  margin: 0;
  max-width: 440px;
}

/* 右侧展开列表 */
.exp-details-label {
  font-size: 0.6rem;
  letter-spacing: 0.3em;
  color: rgba(255,255,255,0.2);
  margin-bottom: 1rem;
}
.exp-details-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}
.exp-detail-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: clamp(0.8rem, 1.2vw, 0.95rem);
  color: rgba(255,255,255,0.65);
  padding: 0.6rem 0.8rem;
  border-left: 2px solid rgba(168,85,247,0.25);
  background: rgba(255,255,255,0.02);
  border-radius: 0 8px 8px 0;
  will-change: transform, opacity;
}
.exp-detail-bullet {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #a855f7;
  flex-shrink: 0;
}

/* 装饰 */
.exp-ornament {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.exp-ornament-line {
  position: absolute;
  &.l1 { right: 8%; top: 15%; width: 1px; height: 30%; background: linear-gradient(180deg, transparent, rgba(168,85,247,0.15), transparent); }
  &.l2 { right: 12%; bottom: 20%; width: 1px; height: 20%; background: linear-gradient(180deg, transparent, rgba(99,102,241,0.1), transparent); }
}

@media (max-width: 768px) {
  .exp-panel { padding: 2rem 1.5rem; }
  .exp-content { flex-direction: column; gap: 1.5rem; }
  .exp-details { min-width: unset; width: 100%; }
  .exp-num { font-size: 2.2rem; }
  .exp-title { font-size: clamp(1.4rem, 6vw, 2rem); }
  .exp-desc { max-width: none; }
  .exp-detail-item { font-size: 0.85rem; }
}
</style>

<style lang="scss">
/* 导航点 */
.exp-nav-dots {
  position: fixed;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.exp-nav-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255,255,255,0.18);
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.3s ease;
  &:hover { background: rgba(255,255,255,0.4); transform: scale(1.3); }
  &.exp-active {
    background: #a855f7;
    border-color: rgba(255,255,255,0.3);
    transform: scale(1.4);
    box-shadow: 0 0 16px rgba(168,85,247,0.5);
  }
}
/* 进度条 */
.exp-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #6366f1, #a855f7, #ec4899);
  z-index: 1001;
  width: 0%;
  transition: width 0.3s;
}
/* 页面指示器 */
.exp-page-indicator {
  position: fixed;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  background: rgba(0,0,0,0.35);
  backdrop-filter: blur(10px);
  padding: 6px 18px;
  border-radius: 20px;
  font-size: 0.85rem;
  border: 1px solid rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.7);
}
/* 竖排标签 */
.exp-vertical-label {
  position: fixed;
  left: 16px;
  top: 50%;
  transform: translateY(-50%) rotate(-90deg);
  z-index: 1000;
  font-size: 0.65rem;
  letter-spacing: 0.4em;
  color: rgba(255,255,255,0.1);
  pointer-events: none;
  white-space: nowrap;
}
@media (max-width: 768px) {
  .exp-nav-dots { right: 10px; gap: 8px; }
  .exp-nav-dot { width: 8px; height: 8px; }
  .exp-page-indicator { bottom: 18px; }
  .exp-vertical-label { left: 6px; font-size: 0.55rem; }
}
</style>
