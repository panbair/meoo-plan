<script setup lang="ts">
import { onMounted, onUnmounted, nextTick, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ==================== 状态 ====================
const totalSections = 6
const cards = [
  { tag: 'BRANDING',  title: '品牌形象设计',   desc: '从LOGO到VI体系，打造独特品牌识别系统',           img: '1' },
  { tag: 'DEVELOP',   title: '前端开发工程',   desc: 'Vue 3 + TypeScript 现代化前端架构与组件库',     img: '2' },
  { tag: 'MOBILE',    title: '移动端适配方案',  desc: '响应式设计 + 小程序开发，多端统一的用户体验',     img: '3' },
  { tag: 'ANIMATION', title: '交互动效设计',   desc: 'GSAP + Three.js 打造令人惊艳的网页动效',      img: '4' },
  { tag: 'BACKEND',   title: '后端服务架构',   desc: 'Node.js 微服务架构，高性能 API 网关设计',        img: '5' },
  { tag: 'DEVOPS',    title: '自动化部署流程',  desc: 'CI/CD 流水线 + Docker 容器化，持续交付',        img: '6' },
]

let scrollTriggers: ScrollTrigger[] = []
const progress = ref(0)
const activeIndex = ref(0)

// ==================== 页面跳转 ====================
function scrollToCard(index: number) {
  const target = document.querySelector(`[data-card="${index}"]`)
  if (target) {
    scrollTriggers.forEach((st) => st.disable())
    target.scrollIntoView({ behavior: 'smooth', block: 'center' })
    setTimeout(() => scrollTriggers.forEach((st) => st.enable()), 600)
  }
}

// ==================== 初始化 ====================
function init() {
  // 导航点
  const navDots = document.getElementById('staggerNavDots')
  if (navDots) {
    navDots.innerHTML = ''
    for (let i = 0; i < totalSections; i++) {
      const dot = document.createElement('button')
      dot.className = 'stagger-nav-dot' + (i === 0 ? ' stagger-active' : '')
      dot.addEventListener('click', () => scrollToCard(i))
      navDots.appendChild(dot)
    }
  }

  // 卡片入场动画 + 段落标记
  const cardEls = gsap.utils.toArray('.stagger-card') as HTMLElement[]
  const sectionEls = gsap.utils.toArray('.stagger-section') as HTMLElement[]

  sectionEls.forEach((section, i) => {
    // 段落标记 → 更新 UI
    const stMark = ScrollTrigger.create({
      trigger: section,
      start: 'top 40%',
      end: 'bottom 40%',
      onEnter: () => {
        activeIndex.value = i
        progress.value = ((i + 1) / totalSections) * 100
        document.querySelectorAll('.stagger-nav-dot').forEach((dot, j) => {
          dot.classList.toggle('stagger-active', j === i)
        })
        const cur = document.querySelector('.stagger-page-indicator .stagger-current')
        if (cur) cur.textContent = String(i + 1)
      },
      onEnterBack: () => {
        activeIndex.value = i
        progress.value = ((i + 1) / totalSections) * 100
        document.querySelectorAll('.stagger-nav-dot').forEach((dot, j) => {
          dot.classList.toggle('stagger-active', j === i)
        })
        const cur = document.querySelector('.stagger-page-indicator .stagger-current')
        if (cur) cur.textContent = String(i + 1)
      }
    })
    scrollTriggers.push(stMark)
  })

  // 卡片交错入场
  cardEls.forEach((card, i) => {
    const isLeft = i % 2 === 0
    ScrollTrigger.create({
      trigger: card,
      start: 'top 80%',
      end: 'top 30%',
      scrub: 0.6,
      onEnter: () => {
        gsap.fromTo(card, {
          x: isLeft ? -80 : 80,
          opacity: 0,
          scale: 0.92,
          rotateY: isLeft ? 15 : -15
        }, {
          x: 0,
          opacity: 1,
          scale: 1,
          rotateY: 0,
          duration: 0.8,
          ease: 'power3.out'
        })
      },
      onLeaveBack: () => {
        gsap.to(card, {
          x: isLeft ? -80 : 80,
          opacity: 0,
          scale: 0.92,
          rotateY: isLeft ? 15 : -15,
          duration: 0.4,
          ease: 'power2.in'
        })
      }
    })
  })
}

function destroy() {
  scrollTriggers.forEach((st) => st.kill())
  scrollTriggers = []
}

onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>

<template>
  <div class="stagger-brand-page">
    <!-- 进度条 -->
    <div class="stagger-progress-bar" :style="{ width: progress + '%' }"></div>

    <!-- 导航点 -->
    <nav id="staggerNavDots" class="stagger-nav-dots"></nav>

    <!-- 页面指示器 -->
    <div class="stagger-page-indicator">
      <span class="stagger-current">1</span><span class="stagger-total"> / {{ totalSections }}</span>
    </div>

    <!-- Hero 段 -->
    <section class="stagger-section stagger-hero">
      <div class="stagger-hero-content">
        <div class="stagger-badge">PORTFOLIO</div>
        <h1 class="stagger-hero-title">交错渐现模板</h1>
        <p class="stagger-hero-desc">卡片交错入场 · 左右交替布局 · 滚动驱动揭示</p>
        <div class="stagger-hero-scroll">
          <span class="stagger-scroll-icon">↓</span>
          <span class="stagger-scroll-text">向下滚动</span>
        </div>
      </div>
    </section>

    <!-- 卡片列表 -->
    <section
      v-for="(card, i) in cards"
      :key="i"
      class="stagger-section stagger-card-section"
      :class="i % 2 === 0 ? 'stagger-left' : 'stagger-right'"
      :data-card="i"
    >
      <div class="stagger-card">
        <div class="stagger-card-visual" :class="'stagger-img-' + card.img">
          <div class="stagger-card-number">{{ String(i + 1).padStart(2, '0') }}</div>
        </div>
        <div class="stagger-card-body">
          <div class="stagger-tag">{{ card.tag }}</div>
          <h3 class="stagger-card-title">{{ card.title }}</h3>
          <p class="stagger-card-desc">{{ card.desc }}</p>
          <button class="stagger-card-btn">
            了解更多 →
          </button>
        </div>
      </div>
      <div class="stagger-section-number">{{ String(i + 1).padStart(2, '0') }}</div>
    </section>

    <!-- 尾段 -->
    <section class="stagger-section stagger-footer">
      <div class="stagger-footer-content">
        <h2>开始你的项目</h2>
        <p>准备好打造令人惊艳的网页体验了吗？</p>
        <button class="stagger-cta">开始合作</button>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.stagger-brand-page {
  font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif;
  background: #f5f0f8;
  color: #1a1a2e;
}

/* ===== 段落通用 ===== */
.stagger-section {
  position: relative;
  overflow: hidden;
}

/* ===== Hero 段 ===== */
.stagger-hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(ellipse 70% 50% at 40% 30%, rgba(124, 58, 237, 0.1) 0%, transparent 70%),
    radial-gradient(ellipse 50% 40% at 80% 70%, rgba(236, 72, 153, 0.06) 0%, transparent 60%),
    linear-gradient(180deg, #07081c 0%, #0e1240 50%, #161860 80%, #0c0e30 100%);
  text-align: center;
}

.stagger-hero-content {
  position: relative;
  z-index: 1;
  padding: 60px 40px;
}

.stagger-badge {
  display: inline-block;
  padding: 5px 18px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 20px;
  font-size: 0.7rem;
  letter-spacing: 4px;
  margin-bottom: 24px;
}

.stagger-hero-title {
  font-size: 4rem;
  font-weight: 900;
  margin: 0 0 20px;
  background: linear-gradient(135deg, #6c8cff, #a78bfa, #f472b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stagger-hero-desc {
  font-size: 1.15rem;
  opacity: 0.5;
  margin: 0 0 60px;
}

.stagger-hero-scroll {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.stagger-scroll-icon {
  font-size: 1.5rem;
  animation: staggerBounce 1.5s ease-in-out infinite;
}
.stagger-scroll-text {
  font-size: 0.75rem;
  opacity: 0.35;
  letter-spacing: 2px;
}

@keyframes staggerBounce {
  0%, 100% { transform: translateY(0); opacity: 0.4; }
  50% { transform: translateY(8px); opacity: 1; }
}

/* ===== 卡片段落 ===== */
.stagger-card-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 80px 60px;
  position: relative;
}

.stagger-left {
  background:
    radial-gradient(ellipse 60% 50% at 20% 40%, rgba(6, 182, 212, 0.08) 0%, transparent 70%),
    linear-gradient(135deg, #071820 0%, #0e2e40 40%, #164050 70%, #0a2228 100%);
  justify-content: flex-start;
}
.stagger-right {
  background:
    radial-gradient(ellipse 60% 50% at 80% 40%, rgba(139, 92, 246, 0.08) 0%, transparent 70%),
    linear-gradient(135deg, #0c0c24 0%, #e4e8f2 50%, #0e1c48 80%, #0a0e28 100%);
  justify-content: flex-end;
}

.stagger-section-number {
  position: absolute;
  font-size: 16rem;
  font-weight: 900;
  color: rgba(26, 26, 46, 0.03);
  line-height: 1;
  pointer-events: none;
}
.stagger-left .stagger-section-number { right: 40px; top: 50%; transform: translateY(-50%); }
.stagger-right .stagger-section-number { left: 40px; top: 50%; transform: translateY(-50%); }

/* ===== 卡片 ===== */
.stagger-card {
  display: flex;
  gap: 50px;
  max-width: 900px;
  position: relative;
  z-index: 1;
}

.stagger-right .stagger-card {
  flex-direction: row-reverse;
  text-align: right;
}

.stagger-card-visual {
  flex-shrink: 0;
  width: 300px;
  height: 320px;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.3);

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.04);
  }
}

.stagger-card-number {
  position: absolute;
  top: 20px;
  left: 24px;
  font-size: 3rem;
  font-weight: 900;
  color: rgba(26, 26, 46, 0.15);
  z-index: 2;
}

/* 渐变占位图 — 更丰富的色彩层次 */
.stagger-img-1 { background: linear-gradient(135deg, #4f46e5, #7c3aed 50%, #a855f7); }
.stagger-img-2 { background: linear-gradient(135deg, #ec4899, #f43f5e 50%, #fb923c); }
.stagger-img-3 { background: linear-gradient(135deg, #0891b2, #06b6d4 50%, #22d3ee); }
.stagger-img-4 { background: linear-gradient(135deg, #059669, #10b981 50%, #34d399); }
.stagger-img-5 { background: linear-gradient(135deg, #e11d48, #f472b6 50%, #fbbf24); }
.stagger-img-6 { background: linear-gradient(135deg, #8b5cf6, #c084fc 50%, #e879f9); }

.stagger-card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.stagger-tag {
  display: inline-block;
  font-size: 0.65rem;
  letter-spacing: 3px;
  color: #6c8cff;
  margin-bottom: 12px;
  font-weight: 600;
}

.stagger-card-title {
  font-size: 2rem;
  font-weight: 800;
  margin: 0 0 12px;
}

.stagger-card-desc {
  font-size: 0.95rem;
  opacity: 0.5;
  line-height: 1.7;
  margin: 0 0 20px;
}

.stagger-card-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: #6c8cff;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  transition: gap 0.3s;

  &:hover {
    gap: 12px;
  }
}

.stagger-right .stagger-card-btn {
  justify-content: flex-end;
}

/* ===== 尾段 ===== */
.stagger-footer {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(ellipse 60% 40% at 50% 50%, rgba(99, 102, 241, 0.08) 0%, transparent 65%),
    linear-gradient(180deg, #0c1230 0%, #141e4a 50%, #101840 100%);
  text-align: center;
}

.stagger-footer-content {
  padding: 60px 40px;

  h2 {
    font-size: 2.6rem;
    font-weight: 900;
    margin: 0 0 16px;
  }
  p {
    font-size: 1.1rem;
    opacity: 0.5;
    margin: 0 0 32px;
  }
}

.stagger-cta {
  display: inline-block;
  padding: 14px 40px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6, #a78bfa);
  border: none;
  border-radius: 30px;
  color: #1a1a2e;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 24px rgba(99, 102, 241, 0.35);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 36px rgba(99, 102, 241, 0.5);
  }
}

@media (max-width: 768px) {
  .stagger-hero-title { font-size: 2.4rem; }
  .stagger-card-section { padding: 60px 24px; }
  .stagger-card {
    flex-direction: column !important;
    align-items: center;
    text-align: center !important;
    gap: 30px;
  }
  .stagger-card-visual { width: 100%; height: 240px; }
  .stagger-card-title { font-size: 1.5rem; }
  .stagger-section-number { font-size: 10rem; }
  .stagger-right .stagger-card-btn { justify-content: center; }
}
</style>

<style lang="scss">
/* 导航点 */
.stagger-nav-dots {
  position: fixed;
  right: 28px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.stagger-nav-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(26, 26, 46, 0.2);
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(26, 26, 46, 0.5);
    transform: scale(1.3);
  }

  &.stagger-active {
    background: #6c8cff;
    border-color: rgba(26, 26, 46, 0.4);
    transform: scale(1.4);
    box-shadow: 0 0 20px rgba(108, 140, 255, 0.5);
  }
}

/* 进度条 */
.stagger-progress-bar {
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

/* 页面指示器 */
.stagger-page-indicator {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(12px);
  padding: 8px 22px;
  border-radius: 25px;
  font-size: 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(26, 26, 46, 0.8);
}

@media (max-width: 768px) {
  .stagger-nav-dots {
    right: 12px;
    gap: 10px;
  }
}
</style>
