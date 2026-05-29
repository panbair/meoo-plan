<script setup lang="ts">
/**
 * ==================== 对比分屏 (Contrast Split) ====================
 * 交错布局分屏 —— Apple 式产品展示页
 * 偶数面板：[视觉/图像 | 文字/内容]  奇数面板：[文字/内容 | 视觉/图像]
 *
 * 核心机制：
 *   1. 每个 section 占满视口，左右各 50%
 *   2. 奇偶交替布局，创造呼吸节奏
 *   3. 两侧独立动画，视觉侧先出现，内容侧延迟 200ms
 *   4. 底部固定进度条 + 侧边导航
 *
 * 与 split-scroll 的区别：
 *   - split-scroll：左侧粘性固定 + 右侧滚动
 *   - contrast-split：两侧平等，都不粘性，通过交错排版制造节奏
 */
import { onMounted, onUnmounted, nextTick, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Section {
  icon:    string
  tag:     string
  title:   string
  desc:    string
  features: string[]
  accent:  string
  accentBg: string
  gradient: string
}

const sections: Section[] = [
  {
    icon: '📊',
    tag: 'REAL-TIME',
    title: '实时数据洞察',
    desc: '毫秒级数据刷新，自定义可视化仪表盘。拖拽式配置，让你的业务指标一目了然，决策快人一步。',
    features: ['多源数据接入', '自定义看板', '智能预警'],
    accent: '#6c8cff',
    accentBg: '#6c8cff15',
    gradient: 'linear-gradient(135deg, #e8ecf8, #d6dcf5)',
  },
  {
    icon: '⚡',
    tag: 'AUTOMATION',
    title: '智能工作流',
    desc: '无代码编排引擎，连接 200+ 应用服务。拖拽节点即可构建复杂业务逻辑，释放团队生产力。',
    features: ['可视化编排', '200+ 集成', '条件路由'],
    accent: '#a78bfa',
    accentBg: '#a78bfa15',
    gradient: 'linear-gradient(225deg, #ede8f8, #ddd4f5)',
  },
  {
    icon: '🤝',
    tag: 'TEAMWORK',
    title: '多人实时协同',
    desc: '实时光标同步，版本历史无限回溯。评论 @提及、权限精细管控，协作效率提升 3 倍。',
    features: ['实时同步', '版本管理', '权限矩阵'],
    accent: '#f472b6',
    accentBg: '#f472b615',
    gradient: 'linear-gradient(135deg, #faf0f7, #f5e0f0)',
  },
  {
    icon: '🧠',
    tag: 'AI INSIGHT',
    title: 'AI 深度分析',
    desc: '机器学习模型自动发现趋势与异常。自然语言生成分析报告，让数据自己讲故事。',
    features: ['趋势预测', '异常检测', 'NLP 报告'],
    accent: '#4cacfe',
    accentBg: '#4cacfe12',
    gradient: 'linear-gradient(225deg, #eef5fd, #daeaf8)',
  },
]

const activeIndex = ref(0)
const progress = ref(0)
const totalSections = sections.length

let scrollTriggers: ScrollTrigger[] = []

function isEven(i: number) { return i % 2 === 0 }
// 偶数：视觉在左；奇数：视觉在右

function updateUI(index: number) {
  activeIndex.value = index
  progress.value = (index / (totalSections - 1)) * 100
}

function goToSection(index: number) {
  const i = Math.max(0, Math.min(index, totalSections - 1))
  const target = document.querySelector(`[data-cs="${i}"]`)
  if (target) {
    scrollTriggers.forEach((st) => st.disable())
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    updateUI(i)
    setTimeout(() => scrollTriggers.forEach((st) => st.enable()), 900)
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
  if (Math.abs(diff) > 60) goToSection(activeIndex.value + (diff > 0 ? 1 : -1))
}

function init() {
  const sectionEls = gsap.utils.toArray('.cs-section') as HTMLElement[]

  sectionEls.forEach((section, i) => {
    // 主触发器
    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top 40%',
      end: 'bottom 40%',
      onEnter: () => updateUI(i),
      onEnterBack: () => updateUI(i),
    })
    scrollTriggers.push(st)

    const even = isEven(i)

    // 视觉侧动画（先出现）
    const visual = section.querySelector('.cs-visual-inner')
    if (visual) {
      gsap.fromTo(visual,
        { opacity: 0, x: even ? -60 : 60, scale: 0.92 },
        {
          opacity: 1, x: 0, scale: 1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 75%', toggleActions: 'play none none reset' },
        },
      )
    }

    // 内容侧动画（稍后出现）
    const content = section.querySelector('.cs-content')
    if (content) {
      gsap.fromTo(content,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0,
          duration: 0.65,
          ease: 'power2.out',
          scrollTrigger: { trigger: section, start: 'top 68%', toggleActions: 'play none none reset' },
        },
      )
    }

    // 特征标签 stagger
    const feats = section.querySelectorAll('.cs-feat')
    if (feats.length) {
      gsap.fromTo(feats,
        { opacity: 0, y: 16, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.4,
          stagger: 0.06,
          ease: 'power2.out',
          scrollTrigger: { trigger: section, start: 'top 62%', toggleActions: 'play none none reset' },
        },
      )
    }
  })

  // 底部进度条全页联动
  gsap.to('.cs-progress-fill', {
    width: '100%',
    ease: 'none',
    scrollTrigger: {
      trigger: '.cs-container',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.3,
    },
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
  <div class="cs-page">
    <!-- 固定进度条 -->
    <div class="cs-progress-bar">
      <div class="cs-progress-fill"></div>
    </div>

    <!-- 导航点 -->
    <nav class="cs-nav">
      <button
        v-for="(s, i) in sections"
        :key="i"
        class="cs-nav-dot"
        :class="{ 'cs-nav-active': activeIndex === i }"
        :style="{ '--accent': s.accent }"
        :title="s.title"
        @click="goToSection(i)"
      >
        <span class="cs-nav-label">{{ String(i + 1).padStart(2, '0') }}</span>
      </button>
    </nav>

    <!-- 主容器 -->
    <div class="cs-container">
      <section
        v-for="(s, i) in sections"
        :key="i"
        class="cs-section"
        :class="{ 'cs-reverse': !isEven(i) }"
        :data-cs="i"
      >
        <!-- 视觉侧 -->
        <div class="cs-visual" :style="{ '--accent': s.accent, '--accent-bg': s.accentBg }">
          <div class="cs-visual-inner">
            <!-- 背景水印序号 -->
            <div class="cs-v-num">{{ String(i + 1).padStart(2, '0') }}</div>

            <!-- 主图标 -->
            <div class="cs-v-icon">{{ s.icon }}</div>

            <!-- 装饰元素：彩色圆 -->
            <div class="cs-v-orb cs-v-orb-1" :style="{ background: `radial-gradient(circle, ${s.accent}20, transparent)` }"></div>
            <div class="cs-v-orb cs-v-orb-2" :style="{ background: `radial-gradient(circle, ${s.accent}15, transparent)` }"></div>
            <div class="cs-v-orb cs-v-orb-3" :style="{ background: `radial-gradient(circle, ${s.accent}10, transparent)` }"></div>

            <!-- 装饰线条 -->
            <div class="cs-v-line" :style="{ background: `linear-gradient(90deg, transparent, ${s.accent}30, transparent)` }"></div>

            <!-- 底部标签 -->
            <div class="cs-v-tag" :style="{ color: s.accent }">{{ s.tag }}</div>
          </div>
        </div>

        <!-- 分隔线 -->
        <div class="cs-divider" :style="{ background: `linear-gradient(to bottom, ${s.accent}08, ${s.accent}18, ${s.accent}08)` }"></div>

        <!-- 内容侧 -->
        <div class="cs-body">
          <div class="cs-content">
            <div class="cs-badge" :style="{ borderColor: s.accent + '50', color: s.accent, background: s.accent + '08' }">
              {{ s.tag }}
            </div>
            <h2 class="cs-title">{{ s.title }}</h2>
            <p class="cs-desc">{{ s.desc }}</p>
            <div class="cs-features">
              <div class="cs-feat" v-for="(f, fi) in s.features" :key="fi">
                <span class="cs-feat-dot" :style="{ background: s.accent }"></span>
                {{ f }}
              </div>
            </div>
            <button class="cs-action" :style="{ '--accent': s.accent }">
              探索更多
              <span class="cs-arrow">→</span>
            </button>
          </div>
        </div>
      </section>

      <!-- 页脚 -->
      <div class="cs-footer">
        <div class="cs-footer-line" :style="{ background: `linear-gradient(to top, transparent, ${sections[sections.length - 1].accent}20, transparent)` }"></div>
        <p>打造你的叙事体验</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* ═══════ 全局 ═══════ */
.cs-page {
  font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif;
  background: #faf8fd;
  color: #1a1a2e;
  overflow-x: hidden;
  position: relative;
}

/* ═══════ 固定进度条 ═══════ */
.cs-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  z-index: 2000;
  pointer-events: none;
}

.cs-progress-fill {
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, #6c8cff, #a78bfa, #f472b6, #4cacfe);
  will-change: width;
  box-shadow: 0 0 10px rgba(108, 140, 255, 0.35);
}

/* ═══════ 侧边导航 ═══════ */
.cs-nav {
  position: fixed;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1500;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cs-nav-dot {
  position: relative;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(26, 26, 46, 0.06);
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.4s ease;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(26, 26, 46, 0.14);
    transform: scale(1.15);
  }

  &.cs-nav-active {
    background: var(--accent, #6c8cff);
    border-color: rgba(26, 26, 46, 0.15);
    transform: scale(1.25);
    box-shadow: 0 0 24px var(--accent, #6c8cff);
  }
}

.cs-nav-label {
  font-size: 0.6rem;
  font-weight: 800;
  color: rgba(26, 26, 46, 0.35);
  transition: color 0.4s;

  .cs-nav-active & {
    color: rgba(255, 255, 255, 0.9);
  }
}

/* ═══════ 分屏容器 ═══════ */
.cs-section {
  display: flex;
  min-height: 100vh;
  position: relative;
}

/* 交错布局：奇数行反转 */
.cs-reverse {
  flex-direction: row-reverse;
}

/* ═══════ 视觉侧 ═══════ */
.cs-visual {
  width: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent-bg, rgba(108, 140, 255, 0.08));
  position: relative;
  overflow: hidden;
}

.cs-visual-inner {
  position: relative;
  width: 320px;
  height: 360px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.cs-v-num {
  position: absolute;
  font-size: 13rem;
  font-weight: 900;
  opacity: 0.025;
  line-height: 1;
  pointer-events: none;
  color: var(--accent, #6c8cff);
  user-select: none;
}

.cs-v-icon {
  font-size: 5rem;
  position: relative;
  z-index: 2;
  filter: drop-shadow(0 12px 32px rgba(0, 0, 0, 0.06));
}

.cs-v-orb {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}
.cs-v-orb-1 {
  width: 240px;
  height: 240px;
  animation: orbPulse 4s ease-in-out infinite;
}
.cs-v-orb-2 {
  width: 160px;
  height: 160px;
  top: 10%;
  right: -10%;
  animation: orbFloat 5s ease-in-out infinite;
}
.cs-v-orb-3 {
  width: 120px;
  height: 120px;
  bottom: 5%;
  left: 0%;
  animation: orbFloat 6s ease-in-out infinite 1s;
}

.cs-v-line {
  position: absolute;
  width: 120%;
  height: 1px;
  bottom: 30%;
  opacity: 0.5;
}

.cs-v-tag {
  position: absolute;
  bottom: 0;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 4px;
  opacity: 0.45;
}

/* ═══════ 分隔线 ═══════ */
.cs-divider {
  width: 1px;
  flex-shrink: 0;
  align-self: stretch;
}

/* ═══════ 内容侧 ═══════ */
.cs-body {
  width: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
}

.cs-content {
  max-width: 440px;
}

.cs-badge {
  display: inline-flex;
  align-items: center;
  padding: 5px 16px;
  border: 1.5px solid;
  border-radius: 14px;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 3px;
  margin-bottom: 20px;
}

.cs-title {
  font-size: 2.5rem;
  font-weight: 900;
  margin: 0 0 16px;
  line-height: 1.15;
  letter-spacing: -0.02em;
}

.cs-desc {
  font-size: 1rem;
  line-height: 1.85;
  color: rgba(26, 26, 46, 0.5);
  margin: 0 0 26px;
}

/* ───── Feature ───── */
.cs-features {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 30px;
}

.cs-feat {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(26, 26, 46, 0.7);
}

.cs-feat-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 0 8px currentColor;
}

/* ───── CTA ───── */
.cs-action {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 13px 32px;
  border: 1.5px solid var(--accent, #6c8cff);
  background: transparent;
  border-radius: 28px;
  color: #1a1a2e;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
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
    box-shadow: 0 8px 32px var(--accent, #6c8cff);

    &::before { opacity: 1; }
    .cs-arrow { transform: translateX(5px); }
  }
}

.cs-arrow {
  transition: transform 0.3s;
  font-size: 1.1rem;
}

/* ═══════ 页脚 ═══════ */
.cs-footer {
  height: 25vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  font-size: 0.82rem;
  color: rgba(26, 26, 46, 0.25);
}

.cs-footer-line {
  width: 1px;
  height: 36px;
}

/* ═══════ 关键帧 ═══════ */
@keyframes orbPulse {
  0%, 100% { transform: scale(1); opacity: 0.4; }
  50% { transform: scale(1.1); opacity: 0.6; }
}

@keyframes orbFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(8px, -12px) scale(1.05); }
}

/* ═══════ 响应式 ═══════ */
@media (max-width: 768px) {
  .cs-section,
  .cs-reverse {
    flex-direction: column;
    min-height: auto;
  }

  .cs-visual {
    width: 100%;
    height: 45vh;
  }

  .cs-visual-inner {
    width: 240px;
    height: 260px;
  }

  .cs-v-icon {
    font-size: 3.5rem;
  }
  .cs-v-num {
    font-size: 8rem;
  }
  .cs-v-orb-1 { width: 160px; height: 160px; }
  .cs-v-orb-2 { width: 110px; height: 110px; }
  .cs-v-orb-3 { width: 80px; height: 80px; }

  .cs-divider {
    width: 100%;
    height: 1px;
    align-self: auto;
  }

  .cs-body {
    width: 100%;
    padding: 48px 28px;
  }

  .cs-content {
    max-width: 100%;
  }

  .cs-title {
    font-size: 1.9rem;
  }

  .cs-nav {
    right: 8px;
    gap: 8px;
  }

  .cs-nav-dot {
    width: 30px;
    height: 30px;
  }
}
</style>
