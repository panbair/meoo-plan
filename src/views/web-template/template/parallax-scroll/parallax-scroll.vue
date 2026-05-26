<script setup lang="ts">
import { onMounted, onUnmounted, nextTick, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ==================== 状态 ====================
const totalSections = 5
let currentIndex = 0
let scrollTriggers: ScrollTrigger[] = []
const progress = ref(0)

// ==================== UI 更新 ====================
function updateUI(index: number) {
  progress.value = ((index + 1) / totalSections) * 100
  document.querySelectorAll('.parallax-nav-dot').forEach((dot, i) => {
    dot.classList.toggle('parallax-active', index === i)
  })
  const currentEl = document.querySelector('.parallax-page-indicator .parallax-current')
  if (currentEl) currentEl.textContent = String(index + 1)
}

// ==================== 页面跳转 ====================
function goToSection(index: number) {
  index = Math.max(0, Math.min(index, totalSections - 1))
  const target = document.querySelector(`[data-section="${index}"]`)
  if (target) {
    scrollTriggers.forEach((st) => st.disable())
    target.scrollIntoView({ behavior: 'smooth' })
    currentIndex = index
    updateUI(index)
    setTimeout(() => scrollTriggers.forEach((st) => st.enable()), 600)
  }
}

// ==================== 初始化 ====================
function init() {
  // 导航点
  const navDots = document.getElementById('parallaxNavDots')
  if (navDots) {
    navDots.innerHTML = ''
    for (let i = 0; i < totalSections; i++) {
      const dot = document.createElement('button')
      dot.className = 'parallax-nav-dot' + (i === 0 ? ' parallax-active' : '')
      dot.addEventListener('click', () => goToSection(i))
      navDots.appendChild(dot)
    }
  }

  // 段落入场动画
  const sections = gsap.utils.toArray('.parallax-section') as HTMLElement[]
  sections.forEach((section, i) => {
    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top 50%',
      end: 'bottom 50%',
      onEnter: () => {
        currentIndex = i
        updateUI(i)
      },
      onEnterBack: () => {
        currentIndex = i
        updateUI(i)
      }
    })
    scrollTriggers.push(st)

    // 每段内容入场动画
    const title = section.querySelector('.parallax-title')
    const desc = section.querySelector('.parallax-desc')
    const cards = section.querySelectorAll('.parallax-card')

    if (title || desc || cards.length) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          end: 'top 25%',
          scrub: 0.5
        }
      })
      if (title) tl.fromTo(title, { opacity: 0, y: 30 }, { opacity: 1, y: 0 })
      if (desc) tl.fromTo(desc, { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, '-=0.3')
      if (cards.length) {
        tl.fromTo(cards, { opacity: 0, y: 40, scale: 0.9 }, {
          opacity: 1, y: 0, scale: 1,
          stagger: 0.12, duration: 0.5, ease: 'power2.out'
        }, '-=0.2')
      }
    }

    // 视差层
    const bgLayer = section.querySelector('.parallax-bg-layer') as HTMLElement
    const midLayer = section.querySelector('.parallax-mid-layer') as HTMLElement
    const fgLayer = section.querySelector('.parallax-fg-layer') as HTMLElement

    if (bgLayer || midLayer || fgLayer) {
      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      })
      .fromTo(bgLayer, { y: -60 }, { y: 60, ease: 'none' }, 0)
      .fromTo(midLayer, { y: -30 }, { y: 30, ease: 'none' }, 0)
      .fromTo(fgLayer, { y: -15 }, { y: 15, ease: 'none' }, 0)
    }
  })

  // 页面指示器
  updateUI(0)
}

function destroy() {
  scrollTriggers.forEach((st) => st.kill())
  scrollTriggers = []
}

onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>

<template>
  <div class="parallax-brand-page">
    <!-- 进度条 -->
    <div class="parallax-progress-bar" :style="{ width: progress + '%' }"></div>

    <!-- 导航点 -->
    <nav id="parallaxNavDots" class="parallax-nav-dots"></nav>

    <!-- 页面指示器 -->
    <div class="parallax-page-indicator">
      <span class="parallax-current">1</span><span class="parallax-total"> / {{ totalSections }}</span>
    </div>

    <!-- 第1段 -->
    <section class="parallax-section parallax-section-hero" data-section="0">
      <div class="parallax-bg-layer"><div class="parallax-bg-circle circle-1"></div><div class="parallax-bg-circle circle-2"></div></div>
      <div class="parallax-mid-layer"><div class="parallax-bg-shape shape-1"></div></div>
      <div class="parallax-fg-layer">
        <div class="parallax-content">
          <div class="parallax-badge">HERO</div>
          <h2 class="parallax-title">视差滚动模板</h2>
          <p class="parallax-desc">多层深度视差，打造沉浸式叙事体验</p>
        </div>
      </div>
    </section>

    <!-- 第2段 -->
    <section class="parallax-section parallax-section-cards" data-section="1">
      <div class="parallax-bg-layer"><div class="parallax-bg-circle circle-3"></div></div>
      <div class="parallax-mid-layer"><div class="parallax-dots-grid"><span v-for="n in 25" :key="n" class="dot"></span></div></div>
      <div class="parallax-fg-layer">
        <div class="parallax-content">
          <div class="parallax-badge">FEATURES</div>
          <h2 class="parallax-title">核心功能</h2>
          <p class="parallax-desc">展示你的产品核心亮点</p>
          <div class="parallax-card-row">
            <div class="parallax-card" v-for="i in 3" :key="i">
              <div class="parallax-card-icon">{{ ['🚀','💎','⚡'][i-1] }}</div>
              <h4>功能 {{ i }}</h4>
              <p>描述文案占位，替换为你的实际内容</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 第3段 -->
    <section class="parallax-section parallax-section-work" data-section="2">
      <div class="parallax-bg-layer"><div class="parallax-bg-circle circle-4"></div><div class="parallax-bg-circle circle-5"></div></div>
      <div class="parallax-mid-layer"><div class="parallax-wave-1"></div></div>
      <div class="parallax-fg-layer">
        <div class="parallax-content">
          <div class="parallax-badge">WORKS</div>
          <h2 class="parallax-title">精选作品</h2>
          <p class="parallax-desc">我们的优秀项目案例</p>
          <div class="parallax-card-row">
            <div class="parallax-card parallax-card-wide" v-for="i in 2" :key="i">
              <div class="parallax-card-img"></div>
              <h4>项目 {{ ['A','B'][i-1] }}</h4>
              <p>项目描述文案占位</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 第4段 -->
    <section class="parallax-section parallax-section-stats" data-section="3">
      <div class="parallax-bg-layer"><div class="parallax-rings"><div class="ring r1"></div><div class="ring r2"></div></div></div>
      <div class="parallax-mid-layer"><div class="parallax-gradient-bar"></div></div>
      <div class="parallax-fg-layer">
        <div class="parallax-content">
          <div class="parallax-badge">STATS</div>
          <h2 class="parallax-title">数据统计</h2>
          <p class="parallax-desc">用数字说话</p>
          <div class="parallax-stats-row">
            <div class="parallax-stat" v-for="s in [{v:'500+',l:'项目'},{v:'99%',l:'满意度'},{v:'50+',l:'团队成员'},{v:'24/7',l:'支持'}]" :key="s.l">
              <div class="parallax-stat-value">{{ s.v }}</div>
              <div class="parallax-stat-label">{{ s.l }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 第5段 -->
    <section class="parallax-section parallax-section-contact" data-section="4">
      <div class="parallax-bg-layer"><div class="parallax-bg-circle circle-6"></div></div>
      <div class="parallax-mid-layer"><div class="parallax-wave-2"></div></div>
      <div class="parallax-fg-layer">
        <div class="parallax-content">
          <div class="parallax-badge">CONTACT</div>
          <h2 class="parallax-title">联系我们</h2>
          <p class="parallax-desc">开始你的项目之旅</p>
          <button class="parallax-cta">立即咨询</button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.parallax-brand-page {
  font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif;
  background: #0a0a0f;
  color: #fff;
  position: relative;
}

/* ===== 段落容器 ===== */
.parallax-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 20px;
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 20px;
    pointer-events: none;
    z-index: 10;
  }
}

/* ===== 视差层 ===== */
.parallax-bg-layer,
.parallax-mid-layer,
.parallax-fg-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.parallax-fg-layer {
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
}

/* ===== 内容区 ===== */
.parallax-content {
  text-align: center;
  z-index: 1;
  padding: 60px 40px;
}

.parallax-title {
  font-size: 3.2rem;
  font-weight: 900;
  margin: 0 0 16px;
}
.parallax-desc {
  font-size: 1.15rem;
  opacity: 0.55;
  margin: 0 0 40px;
}

.parallax-badge {
  display: inline-block;
  padding: 5px 18px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 20px;
  font-size: 0.7rem;
  letter-spacing: 3px;
  margin-bottom: 20px;
}

/* ===== 卡片行 ===== */
.parallax-card-row {
  display: flex;
  gap: 24px;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 960px;
  margin: 0 auto;
}

.parallax-card {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 32px 28px;
  width: 240px;
  text-align: center;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-4px);
    border-color: rgba(108, 140, 255, 0.4);
    box-shadow: 0 8px 30px rgba(108, 140, 255, 0.2);
  }

  h4 { margin: 12px 0 8px; font-size: 1.1rem; }
  p { font-size: 0.85rem; opacity: 0.5; margin: 0; }
}

.parallax-card-wide {
  width: 320px;
  padding: 0;
  overflow: hidden;
}
.parallax-card-img {
  height: 160px;
  background: linear-gradient(135deg, rgba(108, 140, 255, 0.3), rgba(244, 114, 182, 0.3));
}
.parallax-card-wide h4 { padding: 0 20px; }
.parallax-card-wide p { padding: 0 20px 20px; }

.parallax-card-icon {
  font-size: 2.2rem;
  margin-bottom: 8px;
}

/* ===== 统计行 ===== */
.parallax-stats-row {
  display: flex;
  gap: 40px;
  justify-content: center;
  flex-wrap: wrap;
}

.parallax-stat {
  text-align: center;
}
.parallax-stat-value {
  font-size: 2.8rem;
  font-weight: 900;
  background: linear-gradient(135deg, #6c8cff, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.parallax-stat-label {
  font-size: 0.85rem;
  opacity: 0.45;
  margin-top: 4px;
}

/* ===== CTA 按钮 ===== */
.parallax-cta {
  display: inline-block;
  padding: 14px 40px;
  background: linear-gradient(135deg, #6c8cff, #a78bfa);
  border: none;
  border-radius: 30px;
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(108, 140, 255, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(108, 140, 255, 0.5);
  }
}

/* ===== 背景装饰元素 ===== */
.parallax-bg-circle {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.06);
}
.circle-1 { width: 500px; height: 500px; left: -200px; top: -150px; }
.circle-2 { width: 300px; height: 300px; right: -100px; bottom: -80px; border-width: 2px; }
.circle-3 { width: 400px; height: 400px; right: -150px; top: -100px; }
.circle-4 { width: 350px; height: 350px; left: -120px; top: 50%; transform: translateY(-50%); }
.circle-5 { width: 200px; height: 200px; right: 10%; bottom: 10%; }
.circle-6 { width: 450px; height: 450px; left: 50%; top: 50%; transform: translate(-50%, -50%); border-style: dashed; }

.parallax-bg-shape {
  position: absolute;
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, rgba(108, 140, 255, 0.1), rgba(244, 114, 182, 0.1));
  border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
  right: 10%;
  top: 30%;
}

.parallax-dots-grid {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 60px;
  padding: 60px;
  .dot {
    width: 4px;
    height: 4px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 50%;
  }
}

.parallax-rings {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  .ring {
    position: absolute;
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 50%;
  }
  .r1 { width: 300px; height: 300px; }
  .r2 { width: 500px; height: 500px; border-style: dashed; }
}

.parallax-gradient-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(108,140,255,0.05) 50%, rgba(0,0,0,0) 100%);
}

.parallax-wave-1,
.parallax-wave-2 {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120px;
}
.parallax-wave-1 {
  background: linear-gradient(180deg, transparent 0%, rgba(108,140,255,0.06) 100%);
}
.parallax-wave-2 {
  background: linear-gradient(180deg, transparent 0%, rgba(244,114,182,0.06) 100%);
}

/* ===== 各段背景 ===== */
.parallax-section-hero {
  background: linear-gradient(180deg, #0a0f24, #1a1a5e);
}
.parallax-section-cards {
  background: linear-gradient(135deg, #0f2027, #2c5364);
}
.parallax-section-work {
  background: linear-gradient(135deg, #141e30, #243b55);
}
.parallax-section-stats {
  background: linear-gradient(135deg, #1a1a2e, #16213e);
}
.parallax-section-contact {
  background: linear-gradient(135deg, #0b1331, #1c2856);
}

@media (max-width: 768px) {
  .parallax-title { font-size: 2rem; }
  .parallax-desc { font-size: 0.95rem; }
  .parallax-card { width: 100%; }
  .parallax-card-wide { width: 100%; }
  .parallax-stat-value { font-size: 2rem; }
  .parallax-stats-row { gap: 24px; }
}
</style>

<style lang="scss">
/* 导航点 */
.parallax-nav-dots {
  position: fixed;
  right: 28px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.parallax-nav-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.5);
    transform: scale(1.3);
  }

  &.parallax-active {
    background: #6c8cff;
    border-color: rgba(255, 255, 255, 0.4);
    transform: scale(1.4);
    box-shadow: 0 0 20px rgba(108, 140, 255, 0.5);
  }
}

/* 进度条 */
.parallax-progress-bar {
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
.parallax-page-indicator {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(12px);
  padding: 8px 22px;
  border-radius: 25px;
  font-size: 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
}

@media (max-width: 768px) {
  .parallax-nav-dots {
    right: 12px;
    gap: 10px;
  }
}
</style>
