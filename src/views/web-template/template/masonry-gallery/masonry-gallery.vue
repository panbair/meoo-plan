<template>
  <div class="mg-wrapper">
    <!-- 顶部进度条 -->
    <div id="mgProgress" class="mg-progress"></div>

    <!-- Header -->
    <header class="mg-header">
      <div class="mg-header-content">
        <span class="mg-header-tag">GALLERY</span>
        <h1 class="mg-header-title">瀑布流画廊</h1>
        <p class="mg-header-desc">滚动浏览精心策划的视觉作品集 · 双列瀑布流布局 · 交错渐现动画</p>
        <div class="mg-header-stats">
          <div class="mg-stat"><span class="mg-stat-num">{{ cards.length }}</span><span class="mg-stat-label">作品</span></div>
          <div class="mg-stat"><span class="mg-stat-num">6</span><span class="mg-stat-label">分类</span></div>
          <div class="mg-stat"><span class="mg-stat-num">∞</span><span class="mg-stat-label">灵感</span></div>
        </div>
      </div>
      <div class="mg-header-scroll-hint">
        <span>向下滚动</span>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
      </div>
    </header>

    <!-- 瀑布流网格 -->
    <div id="mgGrid" class="mg-grid">
      <div
        v-for="(card, ci) in cards"
        :key="ci"
        :ref="el => { if (el) cardRefs[ci] = el }"
        class="mg-card"
        :class="'mg-card-theme-' + (ci % 6)"
        :style="{ height: card.height + 'px' }"
      >
        <div class="mg-card-bg"></div>
        <div class="mg-card-glow"></div>
        <div class="mg-card-overlay"></div>
        <div class="mg-card-body">
          <span class="mg-card-cat">{{ card.cat }}</span>
          <span class="mg-card-icon">{{ card.icon }}</span>
          <h3 class="mg-card-title">{{ card.title }}</h3>
          <p class="mg-card-desc">{{ card.desc }}</p>
          <span class="mg-card-index">{{ String(ci + 1).padStart(2, '0') }}</span>
        </div>
        <div class="mg-card-shine"></div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="mg-footer">
      <p>— 瀑布流画廊 · 无限灵感 —</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const cardRefs = ref([])

const HS = [140, 180, 220, 260, 300, 340, 380, 420, 160, 200, 240, 280, 320, 360, 400, 440, 170, 210, 250, 290]
const cards = generateCards()

function generateCards() {
  const data = [
    { cat: '品牌', icon: '✦', title: '星耀品牌', desc: '科技公司视觉识别系统设计全案' },
    { cat: 'UI', icon: '◈', title: '极简面板', desc: '数据监控仪表盘界面设计' },
    { cat: '插画', icon: '◆', title: '梦境森林', desc: '幻想风格系列插画作品集' },
    { cat: '3D', icon: '◇', title: '赛博城市', desc: '未来都市概念场景建模渲染' },
    { cat: '动效', icon: '○', title: '流动粒子', desc: '交互式粒子动画概念设计' },
    { cat: '品牌', icon: '●', title: '新锐餐饮', desc: '连锁餐饮品牌全案升级' },
    { cat: 'UI', icon: '◈', title: '智能家居', desc: 'IoT 智能家居 App 界面设计' },
    { cat: '插画', icon: '◆', title: '深海秘境', desc: '海洋生物主题插画系列' },
    { cat: '3D', icon: '◇', title: '太空站', desc: '近未来空间站室内场景渲染' },
    { cat: '动效', icon: '○', title: '霓虹律动', desc: '赛博朋克风格动态海报设计' },
    { cat: '品牌', icon: '✦', title: '有机农场', desc: '生态农产品品牌全案策划' },
    { cat: 'UI', icon: '◈', title: '音乐播放器', desc: '沉浸式音频播放界面设计' },
    { cat: '插画', icon: '◆', title: '四季物语', desc: '四季变换主题绘本插画' },
    { cat: '3D', icon: '◇', title: '远古遗迹', desc: '失落文明场景概念设计' },
    { cat: '动效', icon: '○', title: '光影交错', desc: '光与影交互实验动画作品' },
    { cat: '品牌', icon: '✦', title: '极简穿搭', desc: '时尚服饰品牌视觉设计' },
    { cat: 'UI', icon: '◈', title: '健康应用', desc: '健康监测与运动记录界面' },
    { cat: '3D', icon: '◇', title: '浮空岛屿', desc: '幻想世界浮空岛概念图' },
    { cat: '插画', icon: '◆', title: '城市速写', desc: '都市生活场景钢笔淡彩' },
    { cat: '动效', icon: '○', title: '数字花园', desc: '生成式艺术交互体验' }
  ]
  return data.map((d, i) => ({
    ...d,
    height: HS[i]
  }))
}

let gsap, ScrollTrigger
let ctx = null

onMounted(async () => {
  const gsapMod = await import('gsap')
  gsap = gsapMod.default
  const stMod = await import('gsap/ScrollTrigger')
  ScrollTrigger = stMod.ScrollTrigger
  gsap.registerPlugin(ScrollTrigger)
  init()
})

function init() {
  ctx = gsap.context((self) => {
    const grid = document.getElementById('mgGrid')
    const progress = document.getElementById('mgProgress')
    const cardEls = grid ? grid.querySelectorAll(':scope > .mg-card') : []

    // 每张卡片独立渐现动画
    cardEls.forEach((el, i) => {
      gsap.fromTo(el,
        { y: 80, opacity: 0, scale: 0.9 },
        {
          y: 0, opacity: 1, scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom-=10%',
            end: 'top center',
            scrub: false,
            toggleActions: 'play none none reverse'
          }
        }
      )
    })

    // 进度条
    gsap.to({ p: 0 }, {
      p: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: '.mg-wrapper',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3,
        onUpdate: (st) => {
          if (progress) progress.style.width = (st.progress * 100) + '%'
        }
      }
    })

    // 键盘导航
    const onKey = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        window.scrollBy({ top: 600, behavior: 'smooth' })
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        window.scrollBy({ top: -600, behavior: 'smooth' })
      }
    }
    window.addEventListener('keydown', onKey)
    self._onKey = onKey
  })
}

function destroy() {
  if (ctx) {
    if (ctx._onKey) window.removeEventListener('keydown', ctx._onKey)
    ctx.revert()
    ctx = null
  }
}

onUnmounted(destroy)
</script>

<style scoped>
.mg-wrapper {
  --mg-bg: #060610;
  width: 100vw;
  min-height: 100vh;
  background: var(--mg-bg);
  color: #1a1a2e;
  position: relative;
  overflow-x: hidden;
}

/* ===== Header ===== */
.mg-header {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.mg-header::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 35%, rgba(99, 102, 241, 0.1) 0%, transparent 65%),
              radial-gradient(ellipse at 75% 75%, rgba(236, 72, 153, 0.06) 0%, transparent 55%),
              radial-gradient(ellipse at 25% 80%, rgba(6, 182, 212, 0.05) 0%, transparent 50%);
}

.mg-header-content {
  position: relative;
  z-index: 1;
  max-width: 600px;
  padding: 2rem;
}

.mg-header-tag {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.3em;
  color: rgba(26, 26, 46,0.35);
  border: 1px solid rgba(255,255,255,0.1);
  padding: 0.3rem 1rem;
  border-radius: 20px;
  margin-bottom: 1.5rem;
}

.mg-header-title {
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: 900;
  letter-spacing: -2px;
  margin: 0.5rem 0;
  background: linear-gradient(135deg, #667eea, #f093fb, #4facfe);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.mg-header-desc {
  font-size: clamp(0.9rem, 2vw, 1.1rem);
  color: rgba(26, 26, 46,0.5);
  line-height: 1.6;
  margin: 1rem 0 2rem;
}

.mg-header-stats {
  display: flex;
  gap: 2.5rem;
  justify-content: center;
}

.mg-stat {
  text-align: center;
}

.mg-stat-num {
  display: block;
  font-size: 2rem;
  font-weight: 800;
  color: #1a1a2e;
}

.mg-stat-label {
  font-size: 0.75rem;
  color: rgba(26, 26, 46,0.4);
  text-transform: uppercase;
  letter-spacing: 0.2em;
}

.mg-header-scroll-hint {
  position: absolute;
  bottom: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.7rem;
  color: rgba(26, 26, 46,0.3);
  letter-spacing: 0.2em;
  animation: mg-bounce 2s ease-in-out infinite;
}

@keyframes mg-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(8px); }
}

/* ===== 瀑布流网格 ===== */
.mg-grid {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
  columns: 2;
  column-gap: 1.2rem;
}

.mg-card {
  break-inside: avoid;
  margin-bottom: 1.2rem;
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.4s;
  will-change: transform;
}

.mg-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 20px 60px rgba(255, 255, 255, 0.75), 0 0 40px rgba(99,102,241,0.1);
}

.mg-card-bg {
  position: absolute;
  inset: 0;
}

.mg-card-theme-0 .mg-card-bg { background: linear-gradient(160deg, #12103a 0%, #2d1b69 50%, #1a1048 100%); }
.mg-card-theme-1 .mg-card-bg { background: linear-gradient(160deg, #0c1828 0%, #0e3460 50%, #0a2040 100%); }
.mg-card-theme-2 .mg-card-bg { background: linear-gradient(160deg, #0a1e22 0%, #0e4848 50%, #083838 100%); }
.mg-card-theme-3 .mg-card-bg { background: linear-gradient(160deg, #1c0e28 0%, #4a2070 50%, #2a1248 100%); }
.mg-card-theme-4 .mg-card-bg { background: linear-gradient(160deg, #180a20 0%, #4c1638 50%, #2e0c24 100%); }
.mg-card-theme-5 .mg-card-bg { background: linear-gradient(160deg, #1a1808 0%, #3a3010 50%, #282008 100%); }

.mg-card-glow {
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.15;
}

.mg-card-theme-0 .mg-card-glow { background: #667eea; top: -60px; right: -60px; }
.mg-card-theme-1 .mg-card-glow { background: #4facfe; bottom: -60px; left: -60px; }
.mg-card-theme-2 .mg-card-glow { background: #43e97b; top: -40px; left: -40px; }
.mg-card-theme-3 .mg-card-glow { background: #f093fb; bottom: -40px; right: -40px; }
.mg-card-theme-4 .mg-card-glow { background: #f5576c; top: -50px; right: -50px; }
.mg-card-theme-5 .mg-card-glow { background: #fee140; bottom: -50px; left: -50px; }

.mg-card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 40%, rgba(255, 255, 255, 0.75) 100%);
  z-index: 1;
}

.mg-card-body {
  position: relative;
  z-index: 2;
  padding: 1.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.mg-card-cat {
  display: inline-block;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: rgba(26, 26, 46,0.5);
  text-transform: uppercase;
  margin-bottom: 0.3rem;
  background: rgba(26, 26, 46,0.06);
  padding: 0.2rem 0.7rem;
  border-radius: 10px;
  width: fit-content;
}

.mg-card-icon {
  font-size: 2.5rem;
  position: absolute;
  top: 1.2rem;
  right: 1.2rem;
  opacity: 0.25;
  z-index: 0;
}

.mg-card-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0.3rem 0;
  letter-spacing: -0.5px;
  line-height: 1.3;
}

.mg-card-desc {
  font-size: 0.8rem;
  color: rgba(26, 26, 46,0.55);
  line-height: 1.5;
  margin: 0.2rem 0 0;
}

.mg-card-index {
  position: absolute;
  bottom: 1rem;
  right: 1.2rem;
  font-size: 2rem;
  font-weight: 900;
  color: rgba(26, 26, 46,0.06);
  line-height: 1;
  z-index: 1;
}

.mg-card-shine {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
  z-index: 3;
}

/* ===== Footer ===== */
.mg-footer {
  text-align: center;
  padding: 4rem 2rem;
  color: rgba(26, 26, 46,0.2);
  font-size: 0.85rem;
  letter-spacing: 0.2em;
}

/* ===== 响应式 ===== */
@media (min-width: 769px) and (max-width: 1024px) {
  .mg-grid {
    max-width: 900px;
    column-gap: 1rem;
    padding: 1.5rem 1rem 3rem;
  }
}

@media (max-width: 768px) {
  .mg-grid {
    columns: 1;
    max-width: 500px;
    padding: 1rem 1rem 2rem;
  }
  .mg-card {
    margin-bottom: 1rem;
  }
  .mg-header-stats {
    gap: 1.5rem;
  }
}
</style>

<style>
/* 固定 UI */
.mg-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #667eea, #f093fb, #4facfe, #43e97b, #f5576c, #fee140);
  z-index: 1000;
  width: 0%;
  transition: width 0.1s linear;
}
</style>
