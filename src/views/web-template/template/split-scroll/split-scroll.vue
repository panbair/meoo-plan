<script setup lang="ts">
/**
 * ==================== 分屏展示台 (Split Showcase) ====================
 * 左侧动态视觉卡片 + 右侧滚动内容面板
 * 适用场景：产品介绍 / 功能展示 / 品牌叙事
 */
import { onMounted, onUnmounted, nextTick, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const sections = [
  {
    icon: '📊',
    tag: 'DASHBOARD',
    title: '智能仪表盘',
    desc: '一站式数据可视化平台，实时监控业务指标。自定义看板布局，拖拽式配置，让你的数据一目了然。',
    features: ['实时数据流', '自定义看板', '多维度分析'],
    colors: ['#6c8cff', '#4f6fdb'],
    shape: 'circle',
  },
  {
    icon: '⚡',
    tag: 'AUTOMATION',
    title: '自动化工作流',
    desc: '拖拽式流程编排引擎，无需编码即可构建复杂业务自动化，集成 200+ 第三方服务。',
    features: ['可视化编排', '200+ 集成', '条件触发'],
    colors: ['#a78bfa', '#7c3aed'],
    shape: 'hexagon',
  },
  {
    icon: '🤝',
    tag: 'COLLABORATE',
    title: '团队协作空间',
    desc: '实时多人协作编辑，版本历史追踪，评论@提及，文件共享管理，高效团队协同。',
    features: ['实时协作', '版本管理', '权限控制'],
    colors: ['#f472b6', '#db2777'],
    shape: 'diamond',
  },
  {
    icon: '🧠',
    tag: 'ANALYTICS',
    title: 'AI 智能分析',
    desc: '机器学习驱动的用户行为分析，预测性洞察，自动生成分析报告，辅助精准决策。',
    features: ['行为分析', '预测洞察', '自动报告'],
    colors: ['#4cacfe', '#2563eb'],
    shape: 'triangle',
  },
  {
    icon: '🔒',
    tag: 'SECURITY',
    title: '企业级安全',
    desc: 'SOC2 认证，AES-256 加密，单点登录，审计日志，全面保护你的数据安全。',
    features: ['SSO 登录', '数据加密', '审计追踪'],
    colors: ['#43e97b', '#38bdf8'],
    shape: 'square',
  },
]

const activeIndex = ref(0)
const progress = ref(0)
const totalSections = sections.length

let scrollTriggers: ScrollTrigger[] = []

function updateUI(index: number) {
  activeIndex.value = index
  progress.value = (index / (totalSections - 1)) * 100
}

function goToSection(index: number) {
  const i = Math.max(0, Math.min(index, totalSections - 1))
  const target = document.querySelector(`[data-ss="${i}"]`)
  if (target) {
    scrollTriggers.forEach((st) => st.disable())
    target.scrollIntoView({ behavior: 'smooth' })
    updateUI(i)
    setTimeout(() => scrollTriggers.forEach((st) => st.enable()), 800)
  }
}

function onKeydown(e: KeyboardEvent) {
  const map: Record<string, number> = { ArrowDown: 1, ArrowUp: -1, Home: 0, End: totalSections - 1 }
  if (map[e.key] !== undefined) {
    e.preventDefault()
    goToSection(e.key === 'Home' || e.key === 'End' ? map[e.key] : activeIndex.value + map[e.key])
  }
}

let touchStartY = 0
function onTouchStart(e: TouchEvent) { touchStartY = e.touches[0].clientY }
function onTouchEnd(e: TouchEvent) {
  const diff = touchStartY - e.changedTouches[0].clientY
  if (Math.abs(diff) > 50) goToSection(activeIndex.value + (diff > 0 ? 1 : -1))
}

function init() {
  const sectionEls = gsap.utils.toArray('.ss-section') as HTMLElement[]

  sectionEls.forEach((section, i) => {
    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top 35%',
      end: 'bottom 35%',
      onEnter: () => updateUI(i),
      onEnterBack: () => updateUI(i),
    })
    scrollTriggers.push(st)

    // 右侧内容入场
    const content = section.querySelector('.ss-content')
    if (content) {
      gsap.fromTo(content,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: section, start: 'top 70%', end: 'top 30%', scrub: false, once: false },
        },
      )
    }

    // feature 标签交错入场
    const feats = section.querySelectorAll('.ss-feat')
    if (feats.length) {
      gsap.fromTo(feats,
        { opacity: 0, x: -20 },
        {
          opacity: 1, x: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out',
          scrollTrigger: { trigger: section, start: 'top 65%', end: 'top 30%', scrub: false, once: false },
        },
      )
    }
  })

  // 左侧视窗内装饰圆环的滚动联动视差
  const leftPanel = document.querySelector('.ss-window') as HTMLElement
  const decoShapes = document.querySelectorAll('.ss-deco-shape')
  if (leftPanel && decoShapes.length) {
    gsap.to(decoShapes, {
      y: (i, el) => (Number((el as HTMLElement).dataset.parallax) || 0.5) * 40,
      rotation: (i, el) => (Number((el as HTMLElement).dataset.parallax) || 0.5) * 15,
      ease: 'none',
      scrollTrigger: {
        trigger: '.ss-scroll',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
      },
    })
  }

  document.addEventListener('keydown', onKeydown)
  document.addEventListener('touchstart', onTouchStart, { passive: true })
  document.addEventListener('touchend', onTouchEnd, { passive: true })
  updateUI(0)
}

function destroy() {
  scrollTriggers.forEach((st) => st.kill())
  scrollTriggers = []
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('touchstart', onTouchStart)
  document.removeEventListener('touchend', onTouchEnd)
}

onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>

<template>
  <div class="ss-page">
    <!-- 进度条 -->
    <div class="ss-progress" :style="{ width: progress + '%' }"></div>

    <!-- 页面指示器 -->
    <div class="ss-indicator">
      <span class="ss-current">{{ activeIndex + 1 }}</span>
      <span class="ss-sep">/</span>
      <span class="ss-total">{{ totalSections }}</span>
    </div>

    <!-- 右侧导航点 -->
    <nav class="ss-nav-dots">
      <button
        v-for="(s, i) in sections"
        :key="i"
        class="ss-nav-dot"
        :class="{ 'ss-active': activeIndex === i }"
        :title="s.title"
        @click="goToSection(i)"
      ></button>
    </nav>

    <div class="ss-layout">
      <!-- 左侧动态视觉视窗 -->
      <div class="ss-visual">
        <div class="ss-window">
          <!-- 浮动装饰形状 -->
          <div
            v-for="(s, i) in sections"
            :key="'card-' + i"
            class="ss-card-layer"
            :class="{ 'ss-card-active': activeIndex === i }"
          >
            <!-- 大图标 -->
            <div class="ss-card-icon">{{ s.icon }}</div>
            <!-- 装饰形状 -->
            <div
              class="ss-card-shape"
              :style="{
                background: `linear-gradient(135deg, ${s.colors[0]}22, ${s.colors[1]}33)`,
                borderColor: s.colors[0] + '44',
              }"
            ></div>
            <!-- 发光球 -->
            <div
              class="ss-card-orb"
              :style="{ background: `radial-gradient(circle, ${s.colors[0]}, transparent)` }"
            ></div>
            <!-- 标签 -->
            <div class="ss-card-label">{{ s.tag }}</div>
          </div>

          <!-- 背景装饰 -->
          <div class="ss-deco-ring ss-deco-ring-1"></div>
          <div class="ss-deco-ring ss-deco-ring-2"></div>
          <div
            class="ss-deco-shape ss-deco-circle"
            data-parallax="0.3"
          ></div>
          <div
            class="ss-deco-shape ss-deco-square"
            data-parallax="0.6"
          ></div>
          <div
            class="ss-deco-shape ss-deco-triangle"
            data-parallax="0.9"
          ></div>
        </div>
      </div>

      <!-- 右侧滚动内容区 -->
      <div class="ss-scroll">
        <section
          v-for="(s, i) in sections"
          :key="i"
          class="ss-section"
          :data-ss="i"
        >
          <div class="ss-content">
            <h2 class="ss-section-number">{{ String(i + 1).padStart(2, '0') }}</h2>
            <div class="ss-badge" :style="{ borderColor: s.colors[0] + '55', color: s.colors[0] }">
              {{ s.tag }}
            </div>
            <h3 class="ss-title">{{ s.title }}</h3>
            <p class="ss-desc">{{ s.desc }}</p>
            <div class="ss-features">
              <div class="ss-feat" v-for="(f, fi) in s.features" :key="fi">
                <span class="ss-feat-icon" :style="{ background: s.colors[0] }">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                {{ f }}
              </div>
            </div>
            <button class="ss-action" :style="{ '--accent': s.colors[0] }">
              了解更多 <span class="ss-arrow">→</span>
            </button>
          </div>
        </section>

        <!-- 底部留白 -->
        <div class="ss-footer">
          <div class="ss-footer-line"></div>
          <p>Start building with us today</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* ═══════ 全局 ═══════ */
.ss-page {
  font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif;
  background: #f8f6fc;
  color: #1a1a2e;
  overflow-x: hidden;
  position: relative;
}

/* ═══════ 固定 UI ═══════ */
.ss-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #6c8cff, #a78bfa, #f472b6, #4cacfe, #43e97b);
  z-index: 1001;
  width: 0%;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 12px rgba(108, 140, 255, 0.3);
}

.ss-indicator {
  position: fixed;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(16px);
  padding: 8px 22px;
  border-radius: 24px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  color: rgba(26, 26, 46, 0.7);
}

.ss-current {
  color: #6c8cff;
  font-weight: 700;
}

.ss-sep {
  opacity: 0.35;
  margin: 0 2px;
}

/* ═══════ 分屏布局 ═══════ */
.ss-layout {
  display: flex;
  min-height: 100vh;
}

/* ───── 左侧视窗 ───── */
.ss-visual {
  position: sticky;
  top: 0;
  width: 50%;
  height: 100vh;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.ss-window {
  position: relative;
  width: 380px;
  height: 420px;
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(20px);
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.5),
    0 20px 60px rgba(108, 140, 255, 0.08),
    0 8px 24px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* ───── 卡片层（多屏切换） ───── */
.ss-card-layer {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: scale(0.9) translateY(20px);
  transition: all 0.55s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}

.ss-card-layer.ss-card-active {
  opacity: 1;
  transform: scale(1) translateY(0);
}

.ss-card-icon {
  font-size: 5.5rem;
  filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.08));
  margin-bottom: 8px;
  position: relative;
  z-index: 2;
}

.ss-card-shape {
  position: absolute;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  border: 1px solid;
  animation: shapePulse 3s ease-in-out infinite;
  z-index: 1;
}

.ss-card-orb {
  position: absolute;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  opacity: 0.08;
  animation: orbFloat 4s ease-in-out infinite;
  top: 20%;
  right: 15%;
  z-index: 0;
}

.ss-card-label {
  position: absolute;
  bottom: 32px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 3px;
  opacity: 0.5;
  z-index: 2;
}

/* ───── 背景装饰 ───── */
.ss-deco-ring {
  position: absolute;
  border-radius: 50%;
  border: 2px solid rgba(108, 140, 255, 0.08);
  pointer-events: none;
}

.ss-deco-ring-1 {
  width: 500px;
  height: 500px;
  top: -60px;
  right: -60px;
  animation: ringRotate 20s linear infinite;
}

.ss-deco-ring-2 {
  width: 600px;
  height: 600px;
  bottom: -100px;
  left: -100px;
  border-color: rgba(167, 139, 250, 0.06);
  animation: ringRotate 25s linear infinite reverse;
}

.ss-deco-shape {
  position: absolute;
  pointer-events: none;
  opacity: 0.07;
}

.ss-deco-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #6c8cff;
  top: 12%;
  left: 8%;
}

.ss-deco-square {
  width: 60px;
  height: 60px;
  background: #a78bfa;
  border-radius: 12px;
  bottom: 15%;
  right: 10%;
}

.ss-deco-triangle {
  width: 0;
  height: 0;
  border-left: 35px solid transparent;
  border-right: 35px solid transparent;
  border-bottom: 60px solid #f472b6;
  background: transparent !important;
  top: 40%;
  right: 5%;
}

/* ───── 右侧滚动区 ───── */
.ss-scroll {
  width: 50%;
  flex-shrink: 0;
}

.ss-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 80px 60px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
}

.ss-content {
  max-width: 460px;
  position: relative;
}

.ss-section-number {
  position: absolute;
  top: -10px;
  left: -20px;
  font-size: 7rem;
  font-weight: 900;
  opacity: 0.03;
  line-height: 1;
  color: #6c8cff;
  pointer-events: none;
  z-index: 0;
}

.ss-badge {
  display: inline-flex;
  align-items: center;
  padding: 5px 16px;
  border: 1.5px solid;
  border-radius: 14px;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 3px;
  margin-bottom: 18px;
  background: rgba(255, 255, 255, 0.6);
  position: relative;
  z-index: 1;
}

.ss-title {
  font-size: 2.6rem;
  font-weight: 900;
  margin: 0 0 16px;
  line-height: 1.15;
  letter-spacing: -0.02em;
  position: relative;
  z-index: 1;
}

.ss-desc {
  font-size: 1.02rem;
  line-height: 1.8;
  color: rgba(26, 26, 46, 0.55);
  margin: 0 0 28px;
  position: relative;
  z-index: 1;
}

/* ───── Feature 标签 ───── */
.ss-features {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 32px;
  position: relative;
  z-index: 1;
}

.ss-feat {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  font-size: 0.85rem;
  font-weight: 500;
  color: rgba(26, 26, 46, 0.75);
  transition: all 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
    transform: translateY(-2px);
  }
}

.ss-feat-icon {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* ───── CTA 按钮 ───── */
.ss-action {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 34px;
  border: 1.5px solid var(--accent, #6c8cff);
  background: transparent;
  border-radius: 30px;
  color: #1a1a2e;
  font-size: 0.92rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 1;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--accent, #6c8cff);
    opacity: 0;
    transition: opacity 0.35s;
    border-radius: inherit;
    z-index: -1;
  }

  &:hover {
    color: #fff;
    transform: translateX(6px);
    box-shadow: 0 8px 30px rgba(108, 140, 255, 0.2);

    &::before { opacity: 1; }

    .ss-arrow { transform: translateX(4px); }
  }
}

.ss-arrow {
  transition: transform 0.3s;
  font-size: 1.1rem;
}

/* ───── 底部 ───── */
.ss-footer {
  height: 30vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: rgba(26, 26, 46, 0.3);
  font-size: 0.85rem;
}

.ss-footer-line {
  width: 1px;
  height: 40px;
  background: linear-gradient(to bottom, transparent, rgba(108, 140, 255, 0.3), transparent);
}

/* ═══════ 关键帧动画 ═══════ */
@keyframes shapePulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.08); opacity: 0.7; }
}

@keyframes orbFloat {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-16px) scale(1.05); }
}

@keyframes ringRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ═══════ 响应式 ═══════ */
@media (max-width: 768px) {
  .ss-layout {
    flex-direction: column;
  }

  .ss-visual {
    position: relative;
    width: 100%;
    height: 45vh;
    top: unset;
  }

  .ss-window {
    width: 280px;
    height: 300px;
    border-radius: 20px;
  }

  .ss-card-icon {
    font-size: 3.8rem;
  }

  .ss-card-shape {
    width: 130px;
    height: 130px;
  }

  .ss-deco-ring-1 {
    width: 350px;
    height: 350px;
  }

  .ss-deco-ring-2 {
    width: 400px;
    height: 400px;
  }

  .ss-scroll {
    width: 100%;
  }

  .ss-section {
    min-height: auto;
    padding: 50px 28px;
  }

  .ss-title {
    font-size: 2rem;
  }

  .ss-section-number {
    font-size: 4.5rem;
    top: -6px;
    left: -10px;
  }
}
</style>

<style lang="scss">
/* ═══════ 导航点（非scoped，因为动态生成） ═══════ */
.ss-nav-dots {
  position: fixed;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ss-nav-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(26, 26, 46, 0.15);
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.4s ease;
  padding: 0;

  &:hover {
    background: rgba(26, 26, 46, 0.4);
    transform: scale(1.4);
  }

  &.ss-active {
    background: #6c8cff;
    border-color: rgba(26, 26, 46, 0.3);
    transform: scale(1.6);
    box-shadow: 0 0 18px rgba(108, 140, 255, 0.45);
  }
}

@media (max-width: 768px) {
  .ss-nav-dots {
    right: 10px;
    gap: 10px;
  }
}
</style>
