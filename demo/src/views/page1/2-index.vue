<template>
  <div id="smooth-wrapper" ref="wrapperRef" class="page1-wrapper">
    <div id="smooth-content" class="smooth-content">

      <!-- ===== Hero Section ===== -->
      <section class="section hero-section">
        <div class="hero-bg">
          <div class="hero-orb orb-1"></div>
          <div class="hero-orb orb-2"></div>
          <div class="hero-orb orb-3"></div>
        </div>
        <div class="hero-content">
          <div class="hero-badge reveal-up">滚动触发动画演示</div>
          <h1 class="hero-title">
            <span class="title-word reveal-up">探索</span>
            <span class="title-word reveal-up gradient-text">GSAP</span>
            <span class="title-word reveal-up">滚动魔法</span>
          </h1>
          <p class="hero-sub reveal-up">向下滚动，让每一个元素随视窗进入而绽放</p>
          <div class="hero-scroll-hint reveal-up">
            <div class="scroll-arrow"></div>
            <span>向下滚动</span>
          </div>
        </div>
        <!-- 进度条 -->
        <div class="scroll-progress-bar">
          <div class="progress-fill" ref="progressBar"></div>
        </div>
      </section>

      <!-- ===== 特性卡片 Section ===== -->
      <section class="section features-section">
        <div class="section-header">
          <p class="section-tag">FEATURES</p>
          <h2 class="section-title">核心能力</h2>
          <p class="section-desc">每张卡片随滚动交错飞入，感受 stagger 的魅力</p>
        </div>
        <div class="features-grid">
          <div class="feature-card" v-for="(feat, i) in features" :key="i" :ref="el => featureCards[i] = el as HTMLElement">
            <div class="card-glow" :style="{ background: feat.glow }"></div>
            <div class="card-icon" :style="{ color: feat.color }">{{ feat.icon }}</div>
            <h3 class="card-title">{{ feat.title }}</h3>
            <p class="card-desc">{{ feat.desc }}</p>
            <div class="card-line" :style="{ background: feat.color }"></div>
          </div>
        </div>
      </section>

      <!-- ===== 水平滑动 Section ===== -->
      <section class="section horizontal-section" ref="horizontalSection">
        <div class="section-header">
          <p class="section-tag">SHOWCASE</p>
          <h2 class="section-title">横向滑动展示</h2>
          <p class="section-desc">滚动时面板从左到右依次推入</p>
        </div>
        <div class="h-track" ref="hTrack">
          <div class="h-panel" v-for="(panel, i) in panels" :key="i" :ref="el => hPanels[i] = el as HTMLElement">
            <div class="panel-inner" :style="{ background: panel.bg }">
              <span class="panel-num">0{{ i + 1 }}</span>
              <h3 class="panel-title">{{ panel.title }}</h3>
              <p class="panel-desc">{{ panel.desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ===== 数字统计 Section ===== -->
      <section class="section stats-section">
        <div class="section-header">
          <p class="section-tag">NUMBERS</p>
          <h2 class="section-title">用数字说话</h2>
        </div>
        <div class="stats-grid">
          <div class="stat-item" v-for="(stat, i) in stats" :key="i" :ref="el => statItems[i] = el as HTMLElement">
            <div class="stat-circle" :style="{ borderColor: stat.color }">
              <span class="stat-num" :data-target="stat.value" :style="{ color: stat.color }">0</span>
              <span class="stat-unit" :style="{ color: stat.color }">{{ stat.unit }}</span>
            </div>
            <p class="stat-label">{{ stat.label }}</p>
          </div>
        </div>
      </section>

      <!-- ===== 图文交替 Section ===== -->
      <section class="section alternating-section">
        <div class="section-header">
          <p class="section-tag">PRODUCTS</p>
          <h2 class="section-title">图文交替入场</h2>
        </div>
        <div class="alt-list">
          <div
            class="alt-item"
            v-for="(item, i) in altItems"
            :key="i"
            :class="i % 2 === 1 ? 'reverse' : ''"
            :ref="el => altRefs[i] = el as HTMLElement"
          >
            <div class="alt-visual">
              <div class="visual-box" :style="{ background: item.bg }">
                <span class="visual-icon">{{ item.icon }}</span>
              </div>
            </div>
            <div class="alt-info">
              <span class="alt-tag" :style="{ color: item.color }">{{ item.tag }}</span>
              <h3 class="alt-title">{{ item.title }}</h3>
              <p class="alt-desc">{{ item.desc }}</p>
              <div class="alt-tags">
                <span class="badge" v-for="t in item.tags" :key="t" :style="{ borderColor: item.color, color: item.color }">{{ t }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ===== 团队 Section ===== -->
      <section class="section team-section">
        <div class="section-header">
          <p class="section-tag">TEAM</p>
          <h2 class="section-title">核心团队</h2>
          <p class="section-desc">随滚动依次弹性入场</p>
        </div>
        <div class="team-grid">
          <div class="member-card" v-for="(m, i) in members" :key="i" :ref="el => memberCards[i] = el as HTMLElement">
            <div class="member-avatar" :style="{ background: m.bg }">
              <span>{{ m.avatar }}</span>
            </div>
            <h3 class="member-name">{{ m.name }}</h3>
            <p class="member-role" :style="{ color: m.color }">{{ m.role }}</p>
            <p class="member-bio">{{ m.bio }}</p>
          </div>
        </div>
      </section>

      <!-- ===== 联系 Section ===== -->
      <section class="section contact-section">
        <div class="contact-inner" ref="contactRef">
          <div class="contact-left">
            <p class="section-tag">CONTACT</p>
            <h2 class="section-title">开始合作</h2>
            <p class="contact-sub">每一次联系，都是一段新动画的开始</p>
            <div class="contact-items">
              <div class="c-item" v-for="c in contacts" :key="c.label">
                <span class="c-icon">{{ c.icon }}</span>
                <div>
                  <p class="c-label">{{ c.label }}</p>
                  <p class="c-val">{{ c.val }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="contact-right">
            <div class="form-box">
              <div class="form-field" v-for="f in formFields" :key="f.placeholder">
                <component
                  :is="f.tag"
                  :placeholder="f.placeholder"
                  :type="f.type"
                  class="form-control"
                  @focus="onFocus"
                  @blur="onBlur"
                />
              </div>
              <button class="submit-btn" @mouseenter="onBtnEnter" @mouseleave="onBtnLeave">
                <span>发送消息</span>
                <span class="btn-arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- 返回顶部 -->
      <button class="back-top" ref="backTopBtn" @click="scrollToTop">↑</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

// ── Refs ──────────────────────────────────────────────
const wrapperRef   = ref<HTMLElement>()
const progressBar  = ref<HTMLElement>()
const hTrack       = ref<HTMLElement>()
const contactRef   = ref<HTMLElement>()
const backTopBtn   = ref<HTMLElement>()

const featureCards = ref<HTMLElement[]>([])
const hPanels      = ref<HTMLElement[]>([])
const statItems    = ref<HTMLElement[]>([])
const altRefs      = ref<HTMLElement[]>([])
const memberCards  = ref<HTMLElement[]>([])

let ctx: gsap.Context

// ── 静态数据 ────────────────────────────────────────────
const features = [
  { icon: '⚡', title: '高性能渲染', desc: '基于 GSAP 引擎，流畅 60fps，GPU 加速，零掉帧体验。', color: '#a78bfa', glow: 'radial-gradient(circle at 30% 30%, rgba(167,139,250,0.15), transparent 70%)' },
  { icon: '🎯', title: '精准触发', desc: 'ScrollTrigger 精准控制每个动画的进入、离开、反向时机。', color: '#34d399', glow: 'radial-gradient(circle at 30% 30%, rgba(52,211,153,0.15), transparent 70%)' },
  { icon: '🌊', title: '交错动画', desc: 'stagger 让一组元素像波浪一样依次入场，节奏感十足。', color: '#60a5fa', glow: 'radial-gradient(circle at 30% 30%, rgba(96,165,250,0.15), transparent 70%)' },
  { icon: '🔮', title: '弹性物理', desc: '内置 elastic、bounce 缓动，模拟真实物理弹簧效果。', color: '#f472b6', glow: 'radial-gradient(circle at 30% 30%, rgba(244,114,182,0.15), transparent 70%)' },
  { icon: '🎬', title: 'Timeline 编排', desc: '用 timeline 精确编排复杂多步动画，如同剪辑电影。', color: '#fb923c', glow: 'radial-gradient(circle at 30% 30%, rgba(251,146,60,0.15), transparent 70%)' },
  { icon: '📱', title: '响应式适配', desc: '自动适配各种屏幕尺寸，移动端与桌面端同样精彩。', color: '#fbbf24', glow: 'radial-gradient(circle at 30% 30%, rgba(251,191,36,0.15), transparent 70%)' },
]

const panels = [
  { bg: 'linear-gradient(135deg,#667eea,#764ba2)', title: '进入视窗', desc: '当元素出现在可见区域时触发动画序列' },
  { bg: 'linear-gradient(135deg,#11998e,#38ef7d)', title: '离开视窗', desc: '元素离开屏幕时可触发反向或消失动画' },
  { bg: 'linear-gradient(135deg,#f7971e,#ffd200)', title: 'Pin 钉住', desc: '在滚动过程中将元素固定，制造故事感' },
  { bg: 'linear-gradient(135deg,#f953c6,#b91d73)', title: 'Scrub 跟随', desc: '动画进度与滚动条完全同步，精确控制' },
]

const stats = [
  { value: 280, unit: '+', label: '动画模板', color: '#a78bfa' },
  { value: 60,  unit: 'fps', label: '流畅帧率', color: '#34d399' },
  { value: 99,  unit: '%', label: '用户满意度', color: '#60a5fa' },
  { value: 10,  unit: 'x', label: '开发提效', color: '#f472b6' },
]

const altItems = [
  { icon: '🚀', title: '创新科技产品', desc: '采用最新 GSAP 4 引擎，提供业界领先的动画性能与开发体验。', bg: 'linear-gradient(135deg,#667eea,#764ba2)', color: '#a78bfa', tag: 'PRODUCT 01', tags: ['高性能', '易集成', '可定制'] },
  { icon: '🤖', title: '智能动画管线', desc: 'AI 辅助生成动画参数，根据设计稿自动推导最佳缓动与时长。', bg: 'linear-gradient(135deg,#11998e,#38ef7d)', color: '#34d399', tag: 'PRODUCT 02', tags: ['AI驱动', '自动化', '智能'] },
  { icon: '🎨', title: '可视化构建器', desc: '拖拽式动画编辑界面，实时预览，所见即所得，无需写一行代码。', bg: 'linear-gradient(135deg,#f7971e,#ffd200)', color: '#fbbf24', tag: 'PRODUCT 03', tags: ['无代码', '实时预览', '导出'] },
]

const members = [
  { name: '张伟', role: '首席技术官', bio: '10 年前端经验，GSAP 深度用户，专注动画性能优化。', avatar: '👨‍💻', bg: 'linear-gradient(135deg,#667eea,#764ba2)', color: '#a78bfa' },
  { name: '李娜', role: '交互设计师', bio: '资深 UI/UX，将动画设计提升为一种视觉叙事语言。', avatar: '👩‍🎨', bg: 'linear-gradient(135deg,#f953c6,#b91d73)', color: '#f472b6' },
  { name: '王强', role: '系统架构师', bio: '构建高可用动画基础设施，让每一帧都有质量保障。', avatar: '👨‍🔬', bg: 'linear-gradient(135deg,#11998e,#38ef7d)', color: '#34d399' },
]

const contacts = [
  { icon: '📞', label: '电话', val: '+86 138 0013 8000' },
  { icon: '📧', label: '邮箱', val: 'contact@gsap-demo.com' },
  { icon: '📍', label: '地址', val: '北京市朝阳区创新大厦' },
]

const formFields = [
  { tag: 'input',    type: 'text',  placeholder: '您的姓名' },
  { tag: 'input',    type: 'email', placeholder: '邮箱地址' },
  { tag: 'textarea', type: '',      placeholder: '留言内容...' },
]

// ── 交互处理 ─────────────────────────────────────────────
const onFocus = (e: Event) => gsap.to(e.target, { scale: 1.02, borderColor: '#a78bfa', duration: 0.25, ease: 'power2.out' })
const onBlur  = (e: Event) => gsap.to(e.target, { scale: 1, borderColor: 'rgba(255,255,255,0.1)', duration: 0.25 })
const onBtnEnter = (e: Event) => gsap.to(e.currentTarget, { scale: 1.06, duration: 0.3, ease: 'back.out(1.7)' })
const onBtnLeave = (e: Event) => gsap.to(e.currentTarget, { scale: 1, duration: 0.3, ease: 'power2.out' })

const scrollToTop = () => {
  gsap.to(window, { duration: 1.2, scrollTo: { y: 0, autoKill: false }, ease: 'power3.inOut' })
}

// ── 主动画初始化 ─────────────────────────────────────────
onMounted(() => {
  ctx = gsap.context(() => {

    // 0. 滚动进度条
    gsap.to(progressBar.value!, {
      width: '100%',
      ease: 'none',
      scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 0.3 }
    })

    // 1. Hero 文字依次飞入（不需要 ScrollTrigger，页面加载直接播放）
    gsap.from('.hero-badge', { y: 30, opacity: 0, duration: 0.6, ease: 'power3.out', delay: 0.2 })
    gsap.from('.title-word', { y: 60, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay: 0.4 })
    gsap.from('.hero-sub',   { y: 30, opacity: 0, duration: 0.6, ease: 'power2.out', delay: 0.9 })
    gsap.from('.hero-scroll-hint', { y: 20, opacity: 0, duration: 0.6, ease: 'power2.out', delay: 1.1 })

    // Hero orb 浮动
    gsap.to('.orb-1', { y: -40, x: 20, duration: 6, repeat: -1, yoyo: true, ease: 'power1.inOut' })
    gsap.to('.orb-2', { y: 30, x: -30, duration: 8, repeat: -1, yoyo: true, ease: 'power1.inOut', delay: 1 })
    gsap.to('.orb-3', { y: -20, x: 40, duration: 5, repeat: -1, yoyo: true, ease: 'power1.inOut', delay: 2 })

    // 滚动箭头循环
    gsap.to('.scroll-arrow', { y: 10, duration: 1, repeat: -1, yoyo: true, ease: 'power1.inOut' })

    // 2. section-header 通用动画（所有 section）
    gsap.utils.toArray<HTMLElement>('.section-tag').forEach(el => {
      gsap.from(el, { y: 20, opacity: 0, duration: 0.5, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' }
      })
    })
    gsap.utils.toArray<HTMLElement>('.section-title').forEach(el => {
      gsap.from(el, { y: 40, opacity: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
      })
    })
    gsap.utils.toArray<HTMLElement>('.section-desc').forEach(el => {
      gsap.from(el, { y: 20, opacity: 0, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
      })
    })

    // 3. 特性卡片交错飞入
    gsap.from(featureCards.value, {
      y: 80, opacity: 0, scale: 0.9,
      duration: 0.7, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: {
        trigger: '.features-grid',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    })

    // 4. 水平面板逐一从右滑入
    hPanels.value.forEach((panel, i) => {
      gsap.from(panel, {
        x: 120, opacity: 0,
        duration: 0.75, delay: i * 0.12, ease: 'power3.out',
        scrollTrigger: {
          trigger: '.h-track',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      })
    })

    // 5. 统计数字滚动计数
    statItems.value.forEach((item) => {
      // 圆圈缩放入场
      gsap.from(item, {
        scale: 0.6, opacity: 0, duration: 0.8, ease: 'back.out(1.7)',
        scrollTrigger: { trigger: item, start: 'top 85%', toggleActions: 'play none none reverse' }
      })

      // 数字递增
      const numEl = item.querySelector('.stat-num') as HTMLElement
      const target = parseInt(numEl.dataset.target || '0')
      const obj = { val: 0 }
      gsap.to(obj, {
        val: target, duration: 2, ease: 'power2.out',
        scrollTrigger: { trigger: item, start: 'top 85%', toggleActions: 'play none none reverse' },
        onUpdate() { numEl.textContent = Math.round(obj.val).toString() }
      })
    })

    // 6. 图文交替 - 图片和文字从两侧飞入
    altRefs.value.forEach((item, i) => {
      const isReverse = i % 2 === 1
      const visual = item.querySelector('.alt-visual') as HTMLElement
      const info   = item.querySelector('.alt-info') as HTMLElement

      gsap.from(visual, {
        x: isReverse ? 100 : -100, opacity: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: item, start: 'top 78%', toggleActions: 'play none none reverse' }
      })
      gsap.from(info, {
        x: isReverse ? -100 : 100, opacity: 0, duration: 0.9, delay: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: item, start: 'top 78%', toggleActions: 'play none none reverse' }
      })
    })

    // 7. 团队成员弹性入场
    gsap.from(memberCards.value, {
      y: 60, opacity: 0, scale: 0.85,
      duration: 0.8, stagger: 0.15, ease: 'back.out(1.4)',
      scrollTrigger: {
        trigger: '.team-grid',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    })

    // 卡片悬停发光（进入时注册）
    memberCards.value.forEach(card => {
      card.addEventListener('mouseenter', () => gsap.to(card, { y: -8, scale: 1.03, duration: 0.3, ease: 'power2.out' }))
      card.addEventListener('mouseleave', () => gsap.to(card, { y: 0, scale: 1, duration: 0.3, ease: 'power2.out' }))
    })

    // 8. 联系区域左右飞入
    if (contactRef.value) {
      gsap.from(contactRef.value.querySelector('.contact-left'), {
        x: -80, opacity: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: contactRef.value, start: 'top 80%', toggleActions: 'play none none reverse' }
      })
      gsap.from(contactRef.value.querySelector('.contact-right'), {
        x: 80, opacity: 0, duration: 0.9, delay: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: contactRef.value, start: 'top 80%', toggleActions: 'play none none reverse' }
      })
    }

    // 9. 返回顶部按钮 - 滚动超过一屏后显示
    ScrollTrigger.create({
      trigger: 'body',
      start: `top+=${window.innerHeight} top`,
      onEnter: () => gsap.to(backTopBtn.value!, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.7)' }),
      onLeaveBack: () => gsap.to(backTopBtn.value!, { opacity: 0, scale: 0.5, duration: 0.3 })
    })

    ScrollTrigger.refresh()
  }, wrapperRef.value)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
* { box-sizing: border-box; }

.page1-wrapper {
  width: 100%;
  background: #0a0a14;
  color: #e2e8f0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  overflow-x: hidden;
}

.smooth-content {
  width: 100%;
}

// ── 通用 ─────────────────────────────────────────────────
.section {
  width: 100%;
  padding: 100px 6%;
  position: relative;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-tag {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 4px;
  color: #a78bfa;
  margin: 0 0 12px;
}

.section-title {
  font-size: clamp(2rem, 4vw, 3.2rem);
  font-weight: 800;
  color: #fff;
  margin: 0 0 16px;
  line-height: 1.2;
}

.section-desc {
  font-size: 1.1rem;
  color: #94a3b8;
  max-width: 500px;
  margin: 0 auto;
}

.gradient-text {
  background: linear-gradient(135deg, #a78bfa, #60a5fa, #34d399);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

// ── Hero ─────────────────────────────────────────────────
.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: radial-gradient(ellipse at 20% 50%, rgba(167,139,250,0.12) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 20%, rgba(96,165,250,0.1) 0%, transparent 50%),
              #0a0a14;
}

.hero-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.hero-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
}
.orb-1 { width: 400px; height: 400px; background: rgba(167,139,250,0.2); top: 10%; left: 5%; }
.orb-2 { width: 300px; height: 300px; background: rgba(96,165,250,0.15); bottom: 15%; right: 8%; }
.orb-3 { width: 200px; height: 200px; background: rgba(52,211,153,0.12); top: 50%; left: 50%; }

.hero-content {
  text-align: center;
  position: relative;
  z-index: 2;
  max-width: 800px;
}

.hero-badge {
  display: inline-block;
  padding: 6px 20px;
  background: rgba(167,139,250,0.15);
  border: 1px solid rgba(167,139,250,0.3);
  border-radius: 999px;
  font-size: 13px;
  color: #a78bfa;
  letter-spacing: 2px;
  margin-bottom: 28px;
}

.hero-title {
  font-size: clamp(3rem, 7vw, 6rem);
  font-weight: 900;
  line-height: 1.1;
  margin: 0 0 24px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.3em;

  .title-word { display: inline-block; color: #fff; }
}

.hero-sub {
  font-size: 1.2rem;
  color: #94a3b8;
  margin-bottom: 48px;
}

.hero-scroll-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #64748b;
  letter-spacing: 2px;
}

.scroll-arrow {
  width: 24px;
  height: 24px;
  border-right: 2px solid #64748b;
  border-bottom: 2px solid #64748b;
  transform: rotate(45deg);
}

// 进度条
.scroll-progress-bar {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 3px;
  background: rgba(255,255,255,0.05);
  z-index: 9999;
}
.progress-fill {
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, #a78bfa, #60a5fa, #34d399);
}

// ── Features ─────────────────────────────────────────────
.features-section {
  background: linear-gradient(180deg, #0a0a14 0%, #0f0f1e 100%);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  position: relative;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 20px;
  padding: 32px;
  overflow: hidden;
  transition: border-color 0.3s;
  cursor: default;

  &:hover { border-color: rgba(167,139,250,0.3); }
}

.card-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.card-icon {
  font-size: 36px;
  margin-bottom: 16px;
  display: block;
}

.card-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 10px;
}

.card-desc {
  font-size: 0.92rem;
  color: #94a3b8;
  line-height: 1.7;
  margin: 0 0 20px;
}

.card-line {
  height: 2px;
  width: 40px;
  border-radius: 2px;
}

// ── Horizontal ────────────────────────────────────────────
.horizontal-section {
  background: #0f0f1e;
}

.h-track {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.h-panel {
  border-radius: 20px;
  overflow: hidden;
  min-height: 280px;
}

.panel-inner {
  height: 100%;
  min-height: 280px;
  padding: 36px 28px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.panel-num {
  font-size: 3rem;
  font-weight: 900;
  opacity: 0.3;
  color: #fff;
  line-height: 1;
  margin-bottom: 12px;
}

.panel-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 8px;
}

.panel-desc {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.75);
  line-height: 1.6;
  margin: 0;
}

// ── Stats ─────────────────────────────────────────────────
.stats-section {
  background: #0a0a14;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
  max-width: 1000px;
  margin: 0 auto;
  text-align: center;
}

.stat-item { }

.stat-circle {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  border: 3px solid;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  background: rgba(255,255,255,0.02);
}

.stat-num {
  font-size: 2.4rem;
  font-weight: 900;
  line-height: 1;
}

.stat-unit {
  font-size: 0.9rem;
  font-weight: 600;
  margin-top: 2px;
}

.stat-label {
  font-size: 0.9rem;
  color: #64748b;
  margin: 0;
  letter-spacing: 1px;
}

// ── Alternating ───────────────────────────────────────────
.alternating-section {
  background: #0f0f1e;
}

.alt-list {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 80px;
}

.alt-item {
  display: flex;
  align-items: center;
  gap: 60px;

  &.reverse { flex-direction: row-reverse; }
}

.alt-visual {
  flex: 0 0 45%;
}

.visual-box {
  border-radius: 24px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.visual-icon {
  font-size: 80px;
}

.alt-info {
  flex: 1;
}

.alt-tag {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 3px;
  display: block;
  margin-bottom: 12px;
}

.alt-title {
  font-size: 2rem;
  font-weight: 800;
  color: #fff;
  margin: 0 0 16px;
}

.alt-desc {
  font-size: 1rem;
  color: #94a3b8;
  line-height: 1.8;
  margin: 0 0 24px;
}

.alt-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.badge {
  padding: 5px 14px;
  border-radius: 999px;
  border: 1px solid;
  font-size: 0.82rem;
  font-weight: 600;
}

// ── Team ──────────────────────────────────────────────────
.team-section {
  background: #0a0a14;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 28px;
  max-width: 1100px;
  margin: 0 auto;
}

.member-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 20px;
  padding: 36px 28px;
  text-align: center;
  cursor: default;
  will-change: transform;
}

.member-avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  margin: 0 auto 20px;
}

.member-name {
  font-size: 1.3rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 6px;
}

.member-role {
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0 0 14px;
}

.member-bio {
  font-size: 0.88rem;
  color: #94a3b8;
  line-height: 1.7;
  margin: 0;
}

// ── Contact ───────────────────────────────────────────────
.contact-section {
  background: linear-gradient(180deg, #0f0f1e, #0a0a14);
}

.contact-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}

.contact-left {
  .section-tag { text-align: left; }
  .section-title { text-align: left; }
}

.contact-sub {
  font-size: 1rem;
  color: #94a3b8;
  margin: 0 0 36px;
  line-height: 1.7;
}

.contact-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.c-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.c-icon { font-size: 22px; }

.c-label {
  font-size: 11px;
  letter-spacing: 2px;
  color: #64748b;
  margin: 0 0 4px;
  text-transform: uppercase;
}

.c-val {
  font-size: 0.95rem;
  color: #e2e8f0;
  margin: 0;
}

.form-box {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 24px;
  padding: 36px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-control {
  width: 100%;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 14px 16px;
  font-size: 0.95rem;
  color: #e2e8f0;
  outline: none;
  resize: vertical;
  min-height: 44px;
  font-family: inherit;
  transition: border-color 0.2s;

  &::placeholder { color: #475569; }
  &:focus { border-color: #a78bfa; }
}

textarea.form-control { min-height: 120px; }

.submit-btn {
  background: linear-gradient(135deg, #7c3aed, #4f46e5);
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 15px 28px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  will-change: transform;
}

.btn-arrow { font-size: 1.2rem; transition: transform 0.3s; }
.submit-btn:hover .btn-arrow { transform: translateX(4px); }

// ── 返回顶部 ──────────────────────────────────────────────
.back-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7c3aed, #4f46e5);
  color: #fff;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  z-index: 999;
  opacity: 0;
  transform: scale(0.5);
  will-change: transform, opacity;
  box-shadow: 0 4px 20px rgba(124,58,237,0.4);
}

// ── 响应式 ────────────────────────────────────────────────
@media (max-width: 768px) {
  .section { padding: 80px 4%; }
  .alt-item, .alt-item.reverse { flex-direction: column !important; gap: 30px; }
  .alt-visual { flex: none; width: 100%; }
  .contact-inner { grid-template-columns: 1fr; gap: 40px; }
  .hero-title { font-size: clamp(2.5rem, 10vw, 4rem); }
}
</style>
