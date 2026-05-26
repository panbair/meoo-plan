<script setup lang="ts">
/**
 * ==================== 分屏滚动 (Split Scroll) ====================
 * 左侧粘性视觉面板 + 右侧滚动内容面板
 * 适用场景：产品介绍 / 功能展示 / 对比说明
 */
import { onMounted, onUnmounted, nextTick, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const totalSections = 5

const sections = [
  {
    tag: 'DASHBOARD',
    title: '智能仪表盘',
    desc: '一站式数据可视化平台，实时监控业务指标，自定义看板布局，支持拖拽式配置。',
    features: ['实时数据流', '自定义看板', '多维度分析'],
    visual: 'bg-1',
  },
  {
    tag: 'AUTOMATION',
    title: '自动化工作流',
    desc: '拖拽式流程编排引擎，无需编码即可构建复杂业务自动化，集成 200+ 第三方服务。',
    features: ['可视化编排', '200+ 集成', '条件触发'],
    visual: 'bg-2',
  },
  {
    tag: 'COLLABORATE',
    title: '团队协作空间',
    desc: '实时多人协作编辑，版本历史追踪，评论@提及，文件共享管理，高效团队协同。',
    features: ['实时协作', '版本管理', '权限控制'],
    visual: 'bg-3',
  },
  {
    tag: 'ANALYTICS',
    title: 'AI 智能分析',
    desc: '机器学习驱动的用户行为分析，预测性洞察，自动生成分析报告，辅助决策。',
    features: ['行为分析', '预测洞察', '自动报告'],
    visual: 'bg-4',
  },
  {
    tag: 'SECURITY',
    title: '企业级安全',
    desc: 'SOC2 认证，AES-256 加密，单点登录，审计日志，全面保护你的数据安全。',
    features: ['SSO 登录', '数据加密', '审计追踪'],
    visual: 'bg-5',
  },
]

const progress = ref(0)
let currentIndex = 0
let scrollTriggers: ScrollTrigger[] = []

function updateUI(index: number) {
  progress.value = (index / (totalSections - 1)) * 100
  document.querySelectorAll('.ss-nav-dot').forEach((dot, i) => {
    dot.classList.toggle('ss-active', i === index)
  })
  const el = document.querySelector('.ss-page-indicator .ss-current')
  if (el) el.textContent = String(index + 1)
}

function goToSection(index: number) {
  index = Math.max(0, Math.min(index, totalSections - 1))
  const target = document.querySelector(`[data-ss="${index}"]`)
  if (target) {
    scrollTriggers.forEach((st) => st.disable())
    target.scrollIntoView({ behavior: 'smooth' })
    currentIndex = index
    updateUI(index)
    setTimeout(() => scrollTriggers.forEach((st) => st.enable()), 600)
  }
}

function onKeydown(e: KeyboardEvent) {
  const map: Record<string, number> = { ArrowDown: 1, ArrowUp: -1, Home: 0, End: totalSections - 1 }
  if (map[e.key] !== undefined) {
    e.preventDefault()
    goToSection(e.key === 'Home' || e.key === 'End' ? map[e.key] : currentIndex + map[e.key])
  }
}

let touchStartY = 0
function onTouchStart(e: TouchEvent) { touchStartY = e.touches[0].clientY }
function onTouchEnd(e: TouchEvent) {
  const diff = touchStartY - e.changedTouches[0].clientY
  if (Math.abs(diff) > 50) goToSection(currentIndex + (diff > 0 ? 1 : -1))
}

function init() {
  const navDots = document.getElementById('ssNavDots')
  if (navDots) {
    navDots.innerHTML = ''
    for (let i = 0; i < totalSections; i++) {
      const dot = document.createElement('button')
      dot.className = 'ss-nav-dot' + (i === 0 ? ' ss-active' : '')
      dot.addEventListener('click', () => goToSection(i))
      navDots.appendChild(dot)
    }
  }

  // 段落标记
  const sectionEls = gsap.utils.toArray('.ss-section') as HTMLElement[]
  sectionEls.forEach((section, i) => {
    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top 40%',
      end: 'bottom 40%',
      onEnter: () => { currentIndex = i; updateUI(i) },
      onEnterBack: () => { currentIndex = i; updateUI(i) },
    })
    scrollTriggers.push(st)

    // 右侧内容入场动画
    const content = section.querySelector('.ss-panel-content')
    if (content) {
      gsap.timeline({
        scrollTrigger: { trigger: section, start: 'top 75%', end: 'top 30%', scrub: 0.6 },
      })
        .fromTo(content, { opacity: 0, y: 40 }, { opacity: 1, y: 0 }, 0)
    }

    // 左侧视觉面板切换
    const visual = section.querySelector('.ss-visual-inner')
    if (visual) {
      gsap.timeline({
        scrollTrigger: { trigger: section, start: 'top 60%', end: 'bottom 40%', scrub: 0.5 },
      })
        .fromTo(visual, { opacity: 0, scale: 0.95, y: 20 }, { opacity: 1, scale: 1, y: 0 }, 0)
    }
  })

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
    <div class="ss-progress-bar" :style="{ width: progress + '%' }"></div>
    <nav id="ssNavDots" class="ss-nav-dots"></nav>
    <div class="ss-page-indicator">
      <span class="ss-current">1</span><span class="ss-total"> / {{ totalSections }}</span>
    </div>

    <div class="ss-layout">
      <!-- 左侧粘性视觉区 -->
      <div class="ss-visual">
        <div
          v-for="(s, i) in sections"
          :key="i"
          class="ss-visual-inner"
          :class="'ss-' + s.visual"
          :data-ss="i"
        >
          <div class="ss-visual-badge">{{ s.tag }}</div>
          <div class="ss-visual-number">{{ String(i + 1).padStart(2, '0') }}</div>
          <div class="ss-visual-glow"></div>
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
          <div class="ss-panel-content">
            <div class="ss-badge">{{ s.tag }}</div>
            <h2 class="ss-title">{{ s.title }}</h2>
            <p class="ss-desc">{{ s.desc }}</p>
            <div class="ss-features">
              <div class="ss-feat" v-for="f in s.features" :key="f">
                <span class="ss-feat-bullet"></span>
                {{ f }}
              </div>
            </div>
            <button class="ss-action">了解更多 →</button>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ss-page {
  font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif;
  background: #080c18;
  color: #fff;
  overflow-x: hidden;
}

/* ═══════ 分屏布局 ═══════ */
.ss-layout {
  display: flex;
  min-height: 100vh;
}

/* 左侧粘性视觉区 */
.ss-visual {
  position: sticky;
  top: 0;
  width: 50%;
  height: 100vh;
  flex-shrink: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0c1228;
}

.ss-visual-inner {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
}

.ss-visual-badge {
  font-size: 0.7rem;
  letter-spacing: 4px;
  font-weight: 700;
  opacity: 0.6;
  margin-bottom: 12px;
}

.ss-visual-number {
  font-size: 8rem;
  font-weight: 900;
  opacity: 0.06;
  position: absolute;
  line-height: 1;
}

.ss-visual-glow {
  position: absolute;
  width: 350px;
  height: 350px;
  border-radius: 50%;
  pointer-events: none;
}

/* 各屏视觉背景 */
.ss-bg-1 .ss-visual-glow { background: radial-gradient(circle, rgba(108,140,255,0.12), transparent 60%); }
.ss-bg-1 { background: linear-gradient(135deg, #0a0f24, #1a1a5e); }
.ss-bg-2 .ss-visual-glow { background: radial-gradient(circle, rgba(167,139,250,0.12), transparent 60%); }
.ss-bg-2 { background: linear-gradient(135deg, #1a1a3e, #2a1a5e); }
.ss-bg-3 .ss-visual-glow { background: radial-gradient(circle, rgba(244,114,182,0.12), transparent 60%); }
.ss-bg-3 { background: linear-gradient(135deg, #1a0a2e, #3a1a4e); }
.ss-bg-4 .ss-visual-glow { background: radial-gradient(circle, rgba(76,172,254,0.12), transparent 60%); }
.ss-bg-4 { background: linear-gradient(135deg, #0a1a2e, #1a3a5e); }
.ss-bg-5 .ss-visual-glow { background: radial-gradient(circle, rgba(67,233,123,0.12), transparent 60%); }
.ss-bg-5 { background: linear-gradient(135deg, #0a2e1a, #1a4e3a); }

/* 右侧滚动区 */
.ss-scroll {
  width: 50%;
  flex-shrink: 0;
}

.ss-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 60px 50px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.ss-panel-content {
  max-width: 480px;
}

.ss-badge {
  display: inline-block;
  padding: 4px 14px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 14px;
  font-size: 0.65rem;
  letter-spacing: 3px;
  margin-bottom: 20px;
  font-weight: 600;
}

.ss-title {
  font-size: 2.4rem;
  font-weight: 900;
  margin: 0 0 14px;
  line-height: 1.2;
}

.ss-desc {
  font-size: 1rem;
  opacity: 0.55;
  line-height: 1.8;
  margin: 0 0 28px;
}

.ss-features {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 32px;
}

.ss-feat {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  opacity: 0.7;
}

.ss-feat-bullet {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #6c8cff;
  box-shadow: 0 0 8px rgba(108, 140, 255, 0.5);
  flex-shrink: 0;
}

.ss-action {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 12px 30px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(10px);
  border-radius: 26px;
  color: #fff;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(108, 140, 255, 0.4);
    box-shadow: 0 4px 20px rgba(108, 140, 255, 0.15);
    transform: translateX(4px);
  }
}

/* ═══════ 响应式 ═══════ */
@media (max-width: 768px) {
  .ss-layout { flex-direction: column; }
  .ss-visual {
    position: relative;
    width: 100%;
    height: 50vh;
  }
  .ss-scroll { width: 100%; }
  .ss-section { min-height: auto; padding: 50px 24px; }
  .ss-title { font-size: 1.8rem; }
  .ss-visual-number { font-size: 5rem; }
}
</style>

<style lang="scss">
.ss-nav-dots {
  position: fixed;
  right: 28px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.ss-nav-dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.35s ease;

  &:hover { background: rgba(255, 255, 255, 0.5); transform: scale(1.3); }

  &.ss-active {
    background: #6c8cff;
    border-color: rgba(255, 255, 255, 0.4);
    transform: scale(1.5);
    box-shadow: 0 0 20px rgba(108, 140, 255, 0.5);
  }
}

.ss-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #6c8cff, #a78bfa, #f472b6);
  z-index: 1001;
  width: 0%;
  box-shadow: 0 0 10px rgba(108, 140, 255, 0.4);
  transition: width 0.4s ease;
}

.ss-page-indicator {
  position: fixed;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(12px);
  padding: 7px 20px;
  border-radius: 20px;
  font-size: 0.85rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
}

@media (max-width: 768px) {
  .ss-nav-dots { right: 10px; gap: 10px; }
}
</style>
