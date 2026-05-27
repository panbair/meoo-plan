<script setup lang="ts">
/**
 * ==================== 时间线滚动 (Timeline Scroll) ====================
 * 纵向时间线 + 左右交替事件卡片 + 滚动驱动揭示
 * 适用场景：公司历程 / 发展路线图 / 项目里程碑
 */
import { onMounted, onUnmounted, nextTick, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const totalSections = 8

const timelineEvents = [
  { year: '2018', quarter: 'Q1', tag: '创立', title: '公司成立', desc: '三位创始人在深圳南山创立，首轮天使融资500万', color: '#6c8cff' },
  { year: '2019', quarter: 'Q2', tag: '产品', title: 'v1.0 正式发布', desc: '核心产品 SaaS 平台上线，首批获得 50 家企业客户', color: '#a78bfa' },
  { year: '2020', quarter: 'Q1', tag: '融资', title: 'A 轮融资完成', desc: '获得顶级 VC 投资 3000 万，团队扩张至 80 人', color: '#f472b6' },
  { year: '2020', quarter: 'Q4', tag: '突破', title: '用户突破 100 万', desc: '产品用户量突破百万大关，日活跃用户超 20 万', color: '#4facfe' },
  { year: '2021', quarter: 'Q3', tag: '扩张', title: '海外市场拓展', desc: '进入东南亚及欧美市场，设立 3 个海外办公室', color: '#43e97b' },
  { year: '2022', quarter: 'Q2', tag: '技术', title: 'AI 引擎发布', desc: '自研 AI 推荐引擎上线，点击率提升 340%', color: '#f093fb' },
  { year: '2023', quarter: 'Q1', tag: '荣誉', title: '行业最佳产品奖', desc: '荣获年度 SaaS 最佳产品奖，估值突破 10 亿', color: '#fa709a' },
  { year: '2024', quarter: 'Q3', tag: '愿景', title: '平台生态开放', desc: '开放 API 及开发者平台，构建完整生态体系', color: '#38f9d7' },
]

const progress = ref(0)
let currentIndex = 0
let scrollTriggers: ScrollTrigger[] = []

function updateUI(index: number) {
  progress.value = (index / (totalSections - 1)) * 100
  document.querySelectorAll('.tl-nav-dot').forEach((dot, i) => {
    dot.classList.toggle('tl-active', i === index)
  })
  const el = document.querySelector('.tl-page-indicator .tl-current')
  if (el) el.textContent = String(index + 1)
}

function goToSection(index: number) {
  index = Math.max(0, Math.min(index, totalSections - 1))
  const target = document.querySelector(`[data-tl-section="${index}"]`)
  if (target) {
    scrollTriggers.forEach((st) => st.disable())
    target.scrollIntoView({ behavior: 'smooth', block: 'center' })
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
  const navDots = document.getElementById('tlNavDots')
  if (navDots) {
    navDots.innerHTML = ''
    for (let i = 0; i < totalSections; i++) {
      const dot = document.createElement('button')
      dot.className = 'tl-nav-dot' + (i === 0 ? ' tl-active' : '')
      dot.addEventListener('click', () => goToSection(i))
      navDots.appendChild(dot)
    }
  }

  const sections = gsap.utils.toArray('.tl-section') as HTMLElement[]
  sections.forEach((section, i) => {
    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top 45%',
      end: 'bottom 45%',
      onEnter: () => { currentIndex = i; updateUI(i) },
      onEnterBack: () => { currentIndex = i; updateUI(i) },
    })
    scrollTriggers.push(st)

    // 卡片从左右偏移入场
    const card = section.querySelector('.tl-card')
    const dot = section.querySelector('.tl-dot')
    const isLeft = i % 2 === 0

    if (card) {
      gsap.timeline({
        scrollTrigger: { trigger: section, start: 'top 80%', end: 'top 30%', scrub: 0.7 },
      })
        .fromTo(card,
          { opacity: 0, x: isLeft ? -60 : 60, scale: 0.92 },
          { opacity: 1, x: 0, scale: 1, ease: 'power2.out' },
          0,
        )
    }
    if (dot) {
      gsap.timeline({
        scrollTrigger: { trigger: section, start: 'top 85%', end: 'top 40%', scrub: 0.5 },
      }).fromTo(dot,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, ease: 'back.out(2)' },
        0,
      )
    }

    // 年份前缀动画
    const yearEl = section.querySelector('.tl-year-prefix')
    if (yearEl) {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 75%',
        onEnter: () => gsap.fromTo(yearEl,
          { opacity: 0, letterSpacing: '10px' },
          { opacity: 1, letterSpacing: '4px', duration: 0.8, ease: 'power2.out' },
        ),
        once: true,
      })
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
  <div class="tl-page">
    <div class="tl-progress-bar" :style="{ width: progress + '%' }"></div>
    <nav id="tlNavDots" class="tl-nav-dots"></nav>
    <div class="tl-page-indicator">
      <span class="tl-current">1</span><span class="tl-total"> / {{ totalSections }}</span>
    </div>

    <!-- Hero -->
    <section class="tl-hero">
      <div class="tl-hero-orb"></div>
      <div class="tl-hero-content">
        <div class="tl-badge">TIMELINE</div>
        <h1 class="tl-hero-title">时间线滚动模板</h1>
        <p class="tl-hero-desc">纵向时间轴 · 里程碑展示 · 滚动驱动揭示</p>
        <div class="tl-hero-scroll"><span>↓</span> 向下滑动探索</div>
      </div>
    </section>

    <!-- 时间线 -->
    <div class="tl-timeline-container">
      <div class="tl-line"></div>
      <div
        v-for="(e, i) in timelineEvents"
        :key="i"
        class="tl-section"
        :class="i % 2 === 0 ? 'tl-left' : 'tl-right'"
        :data-tl-section="i"
      >
        <!-- 节点圆点 -->
        <div class="tl-dot-wrap">
          <div
            class="tl-dot"
            :style="{ '--dot-color': e.color }"
          ></div>
        </div>

        <!-- 卡片 -->
        <div class="tl-card">
          <div class="tl-card-line" :style="{ background: `linear-gradient(180deg, ${e.color}, transparent)` }"></div>
          <div class="tl-year-prefix" :style="{ color: e.color }">{{ e.year }}</div>
          <div class="tl-tag" :style="{ background: e.color + '22', color: e.color, borderColor: e.color + '44' }">
            {{ e.tag }}
          </div>
          <h3 class="tl-card-title">{{ e.title }}</h3>
          <p class="tl-card-desc">{{ e.desc }}</p>
          <div class="tl-card-meta">
            <span class="tl-quarter" :style="{ background: e.color + '14', color: e.color }">{{ e.quarter }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 尾段 -->
    <footer class="tl-footer">
      <h2>迈向未来</h2>
      <p>每一个里程碑，都是新的起点</p>
      <button class="tl-cta">一起创造历史 →</button>
    </footer>
  </div>
</template>

<style scoped lang="scss">
.tl-page {
  font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif;
  background: #050810;
  color: #f0f0f8;
  position: relative;
  overflow-x: hidden;
}

/* ═══════ Hero ═══════ */
.tl-hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(ellipse 80% 50% at 50% 30%, rgba(99, 102, 241, 0.08) 0%, transparent 70%),
    radial-gradient(ellipse 50% 40% at 20% 80%, rgba(20, 184, 166, 0.05) 0%, transparent 60%),
    linear-gradient(180deg, #060a1c 0%, #0c1538 40%, #101e48 70%, #0a1530 100%);
  position: relative;
  overflow: hidden;
}

.tl-hero-orb {
  position: absolute;
  width: 600px;
  height: 600px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(99, 102, 241, 0.12), rgba(139, 92, 246, 0.04) 40%, transparent 65%);
  pointer-events: none;
}

.tl-hero-content {
  text-align: center;
  z-index: 1;
  padding: 60px 40px;
}

.tl-badge {
  display: inline-block;
  padding: 5px 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  font-size: 0.7rem;
  letter-spacing: 5px;
  margin-bottom: 24px;
}

.tl-hero-title {
  font-size: 4rem;
  font-weight: 900;
  margin: 0 0 16px;
  background: linear-gradient(135deg, #6c8cff, #a78bfa, #f472b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.tl-hero-desc {
  font-size: 1.15rem;
  opacity: 0.5;
  margin: 0 0 60px;
}

.tl-hero-scroll {
  font-size: 0.8rem;
  opacity: 0.35;
  letter-spacing: 2px;
  animation: tlPulse 2s ease-in-out infinite;

  span {
    display: block;
    font-size: 1.4rem;
    margin-bottom: 6px;
  }
}

@keyframes tlPulse {
  0%, 100% { opacity: 0.3; transform: translateY(0); }
  50% { opacity: 0.7; transform: translateY(6px); }
}

/* ═══════ 时间线容器 ═══════ */
.tl-timeline-container {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 40px 80px;
}

/* 中线 */
.tl-line {
  position: absolute;
  left: 50%;
  top: 60px;
  bottom: 40px;
  width: 2px;
  transform: translateX(-50%);
  background: linear-gradient(180deg,
    rgba(108, 140, 255, 0.3),
    rgba(167, 139, 250, 0.4) 25%,
    rgba(244, 114, 182, 0.3) 50%,
    rgba(76, 172, 254, 0.4) 75%,
    rgba(67, 233, 123, 0.3) 100%
  );
}

/* ═══════ 段落 ═══════ */
.tl-section {
  position: relative;
  min-height: 280px;
  padding: 40px 0;
  display: flex;
  align-items: center;
}

.tl-left { justify-content: flex-start; padding-right: calc(50% + 40px); }
.tl-right { justify-content: flex-end; padding-left: calc(50% + 40px); }

/* 节点圆点 */
.tl-dot-wrap {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;
}

.tl-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--dot-color, #6c8cff);
  border: 3px solid #080c18;
  box-shadow: 0 0 0 4px var(--dot-color, #6c8cff),
              0 0 30px var(--dot-color, #6c8cff);
}

/* ═══════ 卡片 ═══════ */
.tl-card {
  position: relative;
  background: rgba(255, 255, 255, 0.035);
  backdrop-filter: blur(16px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 18px;
  padding: 28px 30px;
  width: 100%;
  max-width: 460px;
  transition: all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.12);
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.03) inset;
    transform: translateY(-4px);
  }
}

.tl-card-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  border-radius: 3px 3px 0 0;
}

.tl-year-prefix {
  font-size: 1.4rem;
  font-weight: 900;
  letter-spacing: 4px;
  margin-bottom: 10px;
}

.tl-tag {
  display: inline-block;
  padding: 3px 12px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 2px;
  border: 1px solid;
  margin-bottom: 14px;
}

.tl-card-title {
  font-size: 1.4rem;
  font-weight: 800;
  margin: 0 0 10px;
}

.tl-card-desc {
  font-size: 0.9rem;
  opacity: 0.55;
  line-height: 1.7;
  margin: 0 0 16px;
}

.tl-card-meta {
  display: flex;
  align-items: center;
}

.tl-quarter {
  padding: 3px 10px;
  border-radius: 10px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 1px;
}

/* ═══════ 尾段 ═══════ */
.tl-footer {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(ellipse 60% 40% at 50% 50%, rgba(99, 102, 241, 0.06) 0%, transparent 60%),
    linear-gradient(180deg, #0a1830 0%, #121e48 50%, #0e1a3c 100%);
  text-align: center;
  padding: 80px 40px;

  h2 { font-size: 2.6rem; font-weight: 900; margin: 0 0 12px; }
  p { font-size: 1.1rem; opacity: 0.45; margin: 0 0 36px; }
}

.tl-cta {
  padding: 14px 40px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 30px;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.35);
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(108, 140, 255, 0.2);
  }
}

/* ═══════ 响应式 ═══════ */
@media (max-width: 768px) {
  .tl-line { left: 30px; }
  .tl-dot-wrap { left: 30px; }
  .tl-section {
    min-height: 220px;
    padding: 30px 0 30px 70px !important;
    justify-content: flex-start !important;
  }
  .tl-card { max-width: 100%; }
  .tl-hero-title { font-size: 2.4rem; }
}
</style>

<style lang="scss">
.tl-nav-dots {
  position: fixed;
  right: 28px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tl-nav-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.35s ease;

  &:hover { background: rgba(255, 255, 255, 0.5); transform: scale(1.3); }

  &.tl-active {
    background: #6c8cff;
    border-color: rgba(255, 255, 255, 0.4);
    transform: scale(1.5);
    box-shadow: 0 0 20px rgba(108, 140, 255, 0.5);
  }
}

.tl-progress-bar {
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

.tl-page-indicator {
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
  .tl-nav-dots { right: 10px; gap: 8px; }
}
</style>
