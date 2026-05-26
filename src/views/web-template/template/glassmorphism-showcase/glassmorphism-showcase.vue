<script setup lang="ts">
/**
 * ==================== 毛玻璃展示 (Glassmorphism Showcase) ====================
 * SaaS 风格产品展示页，全屏毛玻璃卡片 + 流动渐变背景
 * GSAP ScrollTrigger 滚动驱动揭示动画
 */
import { onMounted, onUnmounted, nextTick, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ==================== 数据定义 ====================
const totalSections = 6

const features = [
  { icon: '⚡', title: '极速响应', desc: '毫秒级页面加载，全球 CDN 加速分发' },
  { icon: '🔒', title: '安全可靠', desc: '企业级数据加密，多重防护体系' },
  { icon: '🎨', title: '自由定制', desc: '组件化架构，灵活组装业务模块' },
  { icon: '📊', title: '数据洞察', desc: '实时监控仪表盘，智能分析报告' },
  { icon: '🌐', title: '多端适配', desc: 'Web / 小程序 / App 统一体验' },
  { icon: '🛠', title: '开发者友好', desc: '丰富的 API 和 SDK 生态支持' },
]

const stats = [
  { value: '10M+', label: '全球用户' },
  { value: '99.99%', label: '服务可用性' },
  { value: '200+', label: '企业客户' },
  { value: '50ms', label: '平均延迟' },
]

const works = [
  { tag: '金融', title: '智能投顾平台', desc: 'AI 驱动的个性化投资建议系统', color: '#4facfe' },
  { tag: '教育', title: '在线学习管理系统', desc: '一站式课程管理与协作工具', color: '#f093fb' },
  { tag: '医疗', title: '远程问诊解决方案', desc: '高清视频 + 电子病历无缝对接', color: '#43e97b' },
]

// ==================== 状态 ====================
const progress = ref(0)
let currentIndex = 0
let scrollTriggers: ScrollTrigger[] = []

// ==================== UI 更新 ====================
function updateUI(index: number) {
  progress.value = (index / (totalSections - 1)) * 100
  document.querySelectorAll('.gs-nav-dot').forEach((dot, i) => {
    dot.classList.toggle('gs-active', i === index)
  })
  const el = document.querySelector('.gs-page-indicator .gs-current')
  if (el) el.textContent = String(index + 1)
}

// ==================== 导航跳转 ====================
function goToSection(index: number) {
  index = Math.max(0, Math.min(index, totalSections - 1))
  const target = document.querySelector(`[data-gs-section="${index}"]`)
  if (target) {
    scrollTriggers.forEach((st) => st.disable())
    target.scrollIntoView({ behavior: 'smooth' })
    currentIndex = index
    updateUI(index)
    setTimeout(() => scrollTriggers.forEach((st) => st.enable()), 600)
  }
}

// ==================== 键盘导航 ====================
function onKeydown(e: KeyboardEvent) {
  const keyMap: Record<string, number> = {
    ArrowDown: 1, ArrowRight: 1,
    ArrowUp: -1, ArrowLeft: -1,
    Home: 0, End: totalSections - 1,
  }
  if (keyMap[e.key] !== undefined) {
    e.preventDefault()
    goToSection(e.key === 'Home' || e.key === 'End' ? keyMap[e.key] : currentIndex + keyMap[e.key])
  }
}

// ==================== 触摸滑动 ====================
let touchStartY = 0
function onTouchStart(e: TouchEvent) { touchStartY = e.touches[0].clientY }
function onTouchEnd(e: TouchEvent) {
  const diff = touchStartY - e.changedTouches[0].clientY
  if (Math.abs(diff) > 50) goToSection(currentIndex + (diff > 0 ? 1 : -1))
}

// ==================== 初始化 ====================
function init() {
  // 构建导航点
  const navDots = document.getElementById('gsNavDots')
  if (navDots) {
    navDots.innerHTML = ''
    for (let i = 0; i < totalSections; i++) {
      const dot = document.createElement('button')
      dot.className = 'gs-nav-dot' + (i === 0 ? ' gs-active' : '')
      dot.addEventListener('click', () => goToSection(i))
      navDots.appendChild(dot)
    }
  }

  // 段落标记触发器
  const sections = gsap.utils.toArray('.gs-section') as HTMLElement[]
  sections.forEach((section, i) => {
    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top 40%',
      end: 'bottom 40%',
      onEnter: () => { currentIndex = i; updateUI(i) },
      onEnterBack: () => { currentIndex = i; updateUI(i) },
    })
    scrollTriggers.push(st)

    // 内容入场动画
    const title = section.querySelector('.gs-title')
    const desc = section.querySelector('.gs-desc')
    const cards = section.querySelectorAll('.gs-card')

    if (title || desc || cards.length) {
      gsap.timeline({
        scrollTrigger: { trigger: section, start: 'top 75%', end: 'top 25%', scrub: 0.5 },
      })
        .fromTo(title, { opacity: 0, y: 40 }, { opacity: 1, y: 0 }, 0)
        .fromTo(desc, { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, 0.15)
        .fromTo(cards, { opacity: 0, y: 50, scale: 0.95 }, {
          opacity: 1, y: 0, scale: 1,
          stagger: 0.08, ease: 'power2.out',
        }, 0.3)
    }

    // 视差浮层
    const floatEls = section.querySelectorAll<HTMLElement>('.gs-float-orb')
    floatEls.forEach((el, j) => {
      gsap.timeline({
        scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true },
      }).fromTo(el,
        { y: j % 2 === 0 ? -40 : 40, x: j % 3 === 0 ? -20 : 20, scale: 0.9 },
        { y: j % 2 === 0 ? 40 : -40, x: j % 3 === 0 ? 20 : -20, scale: 1.1, ease: 'none' },
        0,
      )
    })

    // 统计数字动画
    const statValues = section.querySelectorAll('.gs-stat-value')
    if (statValues.length) {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 70%',
        onEnter: () => {
          statValues.forEach((el, k) => {
            gsap.fromTo(el, { scale: 0.3, opacity: 0 }, {
              scale: 1, opacity: 1,
              duration: 0.7, delay: k * 0.15, ease: 'back.out(1.7)',
            })
          })
        },
        once: true,
      })
    }
  })

  // 事件
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
  <div class="gs-page">
    <!-- 顶部进度条 -->
    <div class="gs-progress-bar" :style="{ width: progress + '%' }"></div>

    <!-- 侧边导航点 -->
    <nav id="gsNavDots" class="gs-nav-dots"></nav>

    <!-- 页面指示器 -->
    <div class="gs-page-indicator">
      <span class="gs-current">1</span>
      <span class="gs-total"> / {{ totalSections }}</span>
    </div>

    <!-- ═══════ Hero ═══════ -->
    <section class="gs-section gs-hero" data-gs-section="0">
      <div class="gs-float-orb gs-orb-1"></div>
      <div class="gs-float-orb gs-orb-2"></div>
      <div class="gs-float-orb gs-orb-3"></div>
      <div class="gs-content">
        <div class="gs-badge">GLASSMORPHISM</div>
        <h1 class="gs-title gs-hero-title">毛玻璃展示模板</h1>
        <p class="gs-desc gs-hero-desc">现代 SaaS 风格 · 全屏玻璃卡 · 流动渐变</p>
        <div class="gs-hero-cards">
          <div class="gs-glass-card" v-for="n in 3" :key="n">
            <div class="gs-glass-icon">{{ ['🚀','💡','✨'][n-1] }}</div>
            <span>快速启动</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════ Features ═══════ -->
    <section class="gs-section gs-features" data-gs-section="1">
      <div class="gs-float-orb gs-orb-4"></div>
      <div class="gs-float-orb gs-orb-5"></div>
      <div class="gs-content">
        <div class="gs-badge">FEATURES</div>
        <h2 class="gs-title">核心功能</h2>
        <p class="gs-desc">6 大模块赋能你的业务增长</p>
        <div class="gs-card-grid">
          <div class="gs-card gs-feature-card" v-for="f in features" :key="f.title">
            <div class="gs-fc-icon">{{ f.icon }}</div>
            <h4 class="gs-fc-title">{{ f.title }}</h4>
            <p class="gs-fc-desc">{{ f.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════ Stats ═══════ -->
    <section class="gs-section gs-stats" data-gs-section="2">
      <div class="gs-float-orb gs-orb-6"></div>
      <div class="gs-content">
        <div class="gs-badge">STATISTICS</div>
        <h2 class="gs-title">数据说话</h2>
        <p class="gs-desc">用实力赢得客户信任</p>
        <div class="gs-stats-row">
          <div class="gs-card gs-stat-card" v-for="s in stats" :key="s.label">
            <div class="gs-stat-value">{{ s.value }}</div>
            <div class="gs-stat-label">{{ s.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════ Works ═══════ -->
    <section class="gs-section gs-works" data-gs-section="3">
      <div class="gs-float-orb gs-orb-7"></div>
      <div class="gs-content">
        <div class="gs-badge">WORKS</div>
        <h2 class="gs-title">精选案例</h2>
        <p class="gs-desc">多个行业标杆项目的成功实践</p>
        <div class="gs-works-row">
          <div class="gs-card gs-work-card" v-for="w in works" :key="w.title">
            <div class="gs-work-visual" :style="{ background: `linear-gradient(135deg, ${w.color}, ${w.color}88)` }">
              <div class="gs-work-tag">{{ w.tag }}</div>
            </div>
            <div class="gs-work-body">
              <h4>{{ w.title }}</h4>
              <p>{{ w.desc }}</p>
              <button class="gs-work-btn">查看详情 →</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════ Team ═══════ -->
    <section class="gs-section gs-team" data-gs-section="4">
      <div class="gs-float-orb gs-orb-8"></div>
      <div class="gs-content">
        <div class="gs-badge">TEAM</div>
        <h2 class="gs-title">核心团队</h2>
        <p class="gs-desc">热爱技术的伙伴们</p>
        <div class="gs-team-row">
          <div class="gs-card gs-member-card" v-for="m in [{ role:'前端架构师', name:'Alex' }, { role:'产品设计师', name:'Mia' }, { role:'后端工程师', name:'Leo' }, { role:'项目经理', name:'Eva' }]" :key="m.name">
            <div class="gs-avatar">{{ m.name[0] }}</div>
            <h4>{{ m.name }}</h4>
            <span>{{ m.role }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════ CTA ═══════ -->
    <section class="gs-section gs-cta" data-gs-section="5">
      <div class="gs-float-orb gs-orb-9"></div>
      <div class="gs-content">
        <div class="gs-badge">READY?</div>
        <h2 class="gs-title">准备好打造惊艳体验了吗？</h2>
        <p class="gs-desc">立即开始，与我们共创卓越产品</p>
        <div class="gs-cta-row">
          <button class="gs-cta-btn gs-cta-primary">立即开始</button>
          <button class="gs-cta-btn gs-cta-secondary">预约演示</button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
/* ═══════════════ 全局 ═══════════════ */
.gs-page {
  font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif;
  background: #080c18;
  color: #fff;
  position: relative;
  overflow-x: hidden;
}

/* ═══════════════ 段落通用 ═══════════════ */
.gs-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.gs-content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 80px 40px;
  max-width: 1100px;
  width: 100%;
}

.gs-title {
  font-size: 3rem;
  font-weight: 900;
  margin: 0 0 16px;
  background: linear-gradient(135deg, #e0e7ff, #c4b5fd, #f9a8d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.gs-desc {
  font-size: 1.1rem;
  opacity: 0.55;
  margin: 0 0 48px;
  line-height: 1.6;
}

.gs-badge {
  display: inline-block;
  padding: 5px 18px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  font-size: 0.7rem;
  letter-spacing: 4px;
  margin-bottom: 20px;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.04);
}

/* ═══════════════ 毛玻璃卡片基类 ═══════════════ */
.gs-glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 32px 24px;
  transition: all 0.35s ease;
  cursor: default;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-6px);
    box-shadow: 0 12px 40px rgba(99, 130, 255, 0.15),
                0 0 80px rgba(99, 130, 255, 0.06);
  }
}

/* ═══════════════ Hero ═══════════════ */
.gs-hero {
  background: linear-gradient(180deg, #0a0f24, #1a1a5e, #0f2030);
}

.gs-hero-title {
  font-size: 4.2rem;
  line-height: 1.15;
}

.gs-hero-desc {
  font-size: 1.2rem;
  margin-bottom: 56px;
}

.gs-hero-cards {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;

  .gs-glass-card {
    width: 160px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 28px 20px;
  }
}

.gs-glass-icon {
  font-size: 2.2rem;
}

/* ═══════════════ Features ═══════════════ */
.gs-features {
  background: linear-gradient(135deg, #0f2027 0%, #1a2a40 50%, #16222e 100%);
}

.gs-card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  max-width: 960px;
  margin: 0 auto;
}

.gs-feature-card {
  text-align: center;
  padding: 36px 24px;
}

.gs-fc-icon {
  font-size: 2.4rem;
  margin-bottom: 14px;
}

.gs-fc-title {
  font-size: 1.05rem;
  font-weight: 700;
  margin: 0 0 8px;
}

.gs-fc-desc {
  font-size: 0.85rem;
  opacity: 0.5;
  margin: 0;
  line-height: 1.6;
}

/* ═══════════════ Stats ═══════════════ */
.gs-stats {
  background: linear-gradient(135deg, #141e30, #1a2a4a, #152238);
}

.gs-stats-row {
  display: flex;
  gap: 32px;
  justify-content: center;
  flex-wrap: wrap;
}

.gs-stat-card {
  width: 200px;
  padding: 40px 28px;
  text-align: center;
}

.gs-stat-value {
  font-size: 2.6rem;
  font-weight: 900;
  background: linear-gradient(135deg, #6c8cff, #a78bfa, #f472b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

.gs-stat-label {
  font-size: 0.85rem;
  opacity: 0.45;
  letter-spacing: 1px;
}

/* ═══════════════ Works ═══════════════ */
.gs-works {
  background: linear-gradient(135deg, #0d1a2d, #1a2940, #12203a);
}

.gs-works-row {
  display: flex;
  gap: 24px;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 1000px;
  margin: 0 auto;
}

.gs-work-card {
  width: 300px;
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.gs-work-visual {
  height: 180px;
  display: flex;
  align-items: flex-start;
  padding: 20px;
}

.gs-work-tag {
  padding: 4px 14px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  border-radius: 16px;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 2px;
}

.gs-work-body {
  padding: 20px 24px 24px;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 10px;

  h4 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 700;
  }
  p {
    margin: 0;
    font-size: 0.85rem;
    opacity: 0.5;
    line-height: 1.6;
  }
}

.gs-work-btn {
  align-self: flex-start;
  background: none;
  border: none;
  color: #6c8cff;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  margin-top: 4px;
  transition: all 0.3s;

  &:hover { color: #a78bfa; transform: translateX(4px); }
}

/* ═══════════════ Team ═══════════════ */
.gs-team {
  background: linear-gradient(135deg, #1a1a2e, #232344, #141428);
}

.gs-team-row {
  display: flex;
  gap: 24px;
  justify-content: center;
  flex-wrap: wrap;
}

.gs-member-card {
  width: 160px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 32px 20px;

  h4 { margin: 0; font-size: 1rem; font-weight: 700; }
  span { font-size: 0.78rem; opacity: 0.45; }
}

.gs-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6c8cff, #a78bfa);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 800;
  border: 2px solid rgba(255, 255, 255, 0.15);
}

/* ═══════════════ CTA ═══════════════ */
.gs-cta {
  background: linear-gradient(180deg, #0b1331, #0f1d3d, #1a2a5e);
  min-height: 80vh;
}

.gs-cta-row {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.gs-cta-btn {
  padding: 16px 40px;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.gs-cta-primary {
  background: linear-gradient(135deg, #6c8cff, #a78bfa);
  color: #fff;
  box-shadow: 0 4px 24px rgba(108, 140, 255, 0.35);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 36px rgba(108, 140, 255, 0.55);
  }
}

.gs-cta-secondary {
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    transform: translateY(-3px);
  }
}

/* ═══════════════ 浮动光球 ═══════════════ */
.gs-float-orb {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 1;
}
.gs-orb-1 { width: 500px; height: 500px; top: -180px; left: -150px; background: radial-gradient(circle, rgba(108,140,255,0.12), transparent 70%); }
.gs-orb-2 { width: 300px; height: 300px; top: 40%; right: -80px; background: radial-gradient(circle, rgba(244,114,182,0.1), transparent 70%); }
.gs-orb-3 { width: 200px; height: 200px; bottom: -60px; left: 30%; background: radial-gradient(circle, rgba(167,139,250,0.1), transparent 70%); }
.gs-orb-4 { width: 350px; height: 350px; top: -100px; right: -100px; background: radial-gradient(circle, rgba(67,233,123,0.08), transparent 70%); }
.gs-orb-5 { width: 250px; height: 250px; bottom: -80px; left: -60px; background: radial-gradient(circle, rgba(108,140,255,0.08), transparent 70%); }
.gs-orb-6 { width: 400px; height: 400px; top: 50%; left: 50%; transform: translate(-50%, -50%); background: radial-gradient(circle, rgba(167,139,250,0.1), transparent 65%); }
.gs-orb-7 { width: 300px; height: 300px; top: 20%; right: -100px; background: radial-gradient(circle, rgba(244,114,182,0.09), transparent 70%); }
.gs-orb-8 { width: 350px; height: 350px; bottom: -120px; left: -120px; background: radial-gradient(circle, rgba(108,140,255,0.08), transparent 70%); }
.gs-orb-9 { width: 450px; height: 450px; top: -150px; right: 20%; background: radial-gradient(circle, rgba(249,168,212,0.1), transparent 65%); }

/* ═══════════════ 响应式 ═══════════════ */
@media (max-width: 768px) {
  .gs-hero-title { font-size: 2.2rem; }
  .gs-title { font-size: 2rem; }
  .gs-desc { font-size: 0.95rem; margin-bottom: 32px; }
  .gs-card-grid { grid-template-columns: repeat(2, 1fr); }
  .gs-content { padding: 60px 20px; }
  .gs-hero-cards { gap: 12px; }
  .gs-hero-cards .gs-glass-card { width: 120px; padding: 20px 14px; }
  .gs-stat-card { width: 150px; padding: 28px 18px; }
  .gs-stat-value { font-size: 2rem; }
  .gs-work-card { width: 100%; }
  .gs-stats-row { gap: 16px; }
  .gs-works-row { gap: 16px; }
  .gs-team-row { gap: 16px; }
  .gs-member-card { width: 130px; }
}

@media (max-width: 480px) {
  .gs-card-grid { grid-template-columns: 1fr; }
}
</style>

<style lang="scss">
/* ═══════════════ 全局 UI（非 scoped） ═══════════════ */

/* 导航点 --- 右侧竖排 */
.gs-nav-dots {
  position: fixed;
  right: 28px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.gs-nav-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.35s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.45);
    transform: scale(1.3);
  }

  &.gs-active {
    background: #6c8cff;
    border-color: rgba(255, 255, 255, 0.4);
    transform: scale(1.5);
    box-shadow: 0 0 22px rgba(108, 140, 255, 0.55);
  }
}

/* 进度条 */
.gs-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #6c8cff, #a78bfa, #f472b6);
  z-index: 1001;
  width: 0%;
  box-shadow: 0 0 12px rgba(108, 140, 255, 0.4);
  transition: width 0.4s ease;
}

/* 页面指示器 */
.gs-page-indicator {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(14px);
  padding: 8px 22px;
  border-radius: 25px;
  font-size: 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
}

@media (max-width: 768px) {
  .gs-nav-dots {
    right: 10px;
    gap: 10px;
  }
}
</style>
