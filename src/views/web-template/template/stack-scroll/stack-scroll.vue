<template>
  <div class="sk-wrapper">
    <!-- 进度条 -->
    <div id="skProgress" class="sk-progress"></div>

    <!-- 导航点 -->
    <nav id="skNavDots" class="sk-nav-dots"></nav>

    <!-- 页面指示器 -->
    <div class="sk-page-indicator">
      <span class="sk-current">1</span><span class="sk-total"> / {{ CARDS }}</span>
    </div>

    <!-- 堆叠标签 -->
    <div class="sk-stack-label">DECK</div>

    <!-- 滚动空间 -->
    <div id="skScrollArea" class="sk-scroll-area">

      <div class="sk-sticky-stage">
        <div class="sk-stage">

          <!-- 卡片堆叠区 -->
          <div class="sk-stack" id="skStack">
            <div
              v-for="(card, ci) in cards"
              :key="ci"
              :ref="el => { if (el) cardRefs[ci] = el }"
              class="sk-card"
              :class="'sk-card-' + (ci % 6)"
            >
              <div class="sk-card-bg"></div>
              <div class="sk-card-pattern"></div>
              <div class="sk-card-body">
                <span class="sk-card-num">{{ String(ci + 1).padStart(2, '0') }}</span>
                <div class="sk-card-emoji">{{ card.emoji }}</div>
                <h2 class="sk-card-title">{{ card.title }}</h2>
                <p class="sk-card-desc">{{ card.desc }}</p>
                <span class="sk-card-tag">{{ card.tag }}</span>
              </div>
              <div class="sk-card-bottom-line"></div>
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const CARDS = 8
const cardRefs = ref([])
cardRefs.value = new Array(CARDS).fill(null)

const cards = [
  { emoji: '🎯', title: '精准定位', desc: '多维度用户画像分析，智能识别目标人群特征。', tag: '策略' },
  { emoji: '🎨', title: '创意设计', desc: 'AI 辅助设计系统，3 分钟产出完整视觉方案。', tag: '设计' },
  { emoji: '💻', title: '高效开发', desc: '低代码平台 + 组件市场，开发效率提升 300%。', tag: '工程' },
  { emoji: '📊', title: '数据洞察', desc: '实时数据看板，关键指标一目了然。', tag: '数据' },
  { emoji: '🔄', title: '持续交付', desc: '自动化 CI/CD 管道，分钟级发布到生产环境。', tag: '运维' },
  { emoji: '🌐', title: '全球部署', desc: '跨区域边缘节点，99.99% 可用性保障。', tag: '基础' },
  { emoji: '🤝', title: '团队协作', desc: '多人实时编辑，版本历史与评论系统。', tag: '协作' },
  { emoji: '🔮', title: '智能预测', desc: '基于历史数据的趋势预测与风险预警。', tag: 'AI' }
]

let gsap, ScrollTrigger
let ctx = null

function setCardBaseStyle(el, i) {
  const total = CARDS
  const ratio = 1 - i / total
  el.style.position = 'absolute'
  el.style.width = '100%'
  el.style.height = '100%'
  el.style.top = '0'
  el.style.left = '0'
  el.style.borderRadius = '20px'
  el.style.transformOrigin = 'top center'
  el.style.zIndex = total - i
  el.style.transition = 'none'
}

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
    const scrollArea = document.getElementById('skScrollArea')
    const stack = document.getElementById('skStack')
    const progress = document.getElementById('skProgress')
    const navDots = document.getElementById('skNavDots')
    const total = CARDS

    if (!scrollArea || !stack) return

    // 构建导航点
    if (navDots) {
      for (let i = 0; i < total; i++) {
        const dot = document.createElement('div')
        dot.className = 'sk-dot'
        dot.dataset.index = i
        dot.addEventListener('click', () => {
          window.scrollTo({ top: (i / (total - 1)) * (scrollArea.scrollHeight - window.innerHeight), behavior: 'smooth' })
        })
        navDots.appendChild(dot)
      }
    }

    // 给每张卡片设置初始位置
    const cardEls = stack.querySelectorAll(':scope > .sk-card')
    cardEls.forEach((el, i) => {
      setCardBaseStyle(el, i)
      gsap.set(el, {
        scale: 1 - i * 0.03,
        y: i * 8,
        opacity: 1 - i * 0.12
      })
    })

    const currentEl = document.querySelector('.sk-current')
    const dotEls = document.querySelectorAll('.sk-dot')

    function updateUI(idx) {
      if (currentEl) currentEl.textContent = idx + 1
      dotEls.forEach((d, i) => d.classList.toggle('active', i === idx))
    }

    // 主时间线：每张卡片飞走
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollArea,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        onUpdate: (self) => {
          const raw = self.progress * (total - 1)
          const idx = Math.min(Math.round(raw), total - 1)
          updateUI(idx)
          if (progress) progress.style.width = (self.progress * 100) + '%'
        }
      }
    })

    // 每张卡片：先缩小+上移+淡出，然后移到堆底
    for (let i = 0; i < total - 1; i++) {
      const t = i / (total - 1)
      const nextT = (i + 1) / (total - 1)

      tl.addLabel(`card${i}`, t)

      // 当前卡片飞走
      tl.to(
        cardEls[i],
        {
          scale: 0.85,
          y: -60,
          opacity: 0,
          rotateX: 15,
          duration: 1
        },
        `card${i}`
      )

      // 下一张卡片升到顶部
      if (i < total - 1) {
        tl.fromTo(
          cardEls[i + 1],
          {
            scale: 1 - (i + 1) * 0.03,
            y: (i + 1) * 8
          },
          {
            scale: 1,
            y: 0,
            duration: 1
          },
          `card${i}`
        )
      }
    }

    // 键盘导航
    const onKey = (e) => {
      const st = ScrollTrigger.getAll().find(s => s.trigger === scrollArea)
      if (!st) return
      let idx = Math.round(st.progress * (total - 1))
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') idx = Math.min(idx + 1, total - 1)
      else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') idx = Math.max(idx - 1, 0)
      else return
      e.preventDefault()
      window.scrollTo({ top: (idx / (total - 1)) * (scrollArea.scrollHeight - window.innerHeight), behavior: 'smooth' })
    }
    window.addEventListener('keydown', onKey)
    self._onKey = onKey

    // 触摸
    let touchY = 0
    const onTouch = (e) => { touchY = e.touches[0].clientY }
    const onTouchEnd = (e) => {
      const dy = touchY - e.changedTouches[0].clientY
      if (Math.abs(dy) < 40) return
      const st = ScrollTrigger.getAll().find(s => s.trigger === scrollArea)
      if (!st) return
      let idx = Math.round(st.progress * (total - 1))
      idx = dy > 0 ? Math.min(idx + 1, total - 1) : Math.max(idx - 1, 0)
      window.scrollTo({ top: (idx / (total - 1)) * (scrollArea.scrollHeight - window.innerHeight), behavior: 'smooth' })
    }
    window.addEventListener('touchstart', onTouch, { passive: true })
    window.addEventListener('touchend', onTouchEnd)
    self._onTouch = onTouch
    self._onTouchEnd = onTouchEnd

    updateUI(0)
  })
}

function destroy() {
  if (ctx) {
    if (ctx._onKey) window.removeEventListener('keydown', ctx._onKey)
    if (ctx._onTouch) window.removeEventListener('touchstart', ctx._onTouch)
    if (ctx._onTouchEnd) window.removeEventListener('touchend', ctx._onTouchEnd)
    ctx.revert()
    ctx = null
  }
}

onUnmounted(destroy)
</script>

<style scoped>
.sk-wrapper {
  --sk-bg: #0f0f1a;
  width: 100vw;
  overflow: hidden;
  background: var(--sk-bg);
  color: #fff;
  position: relative;
}

.sk-scroll-area {
  height: calc(var(--vh, 1vh) * 100 * 8);
  position: relative;
}

.sk-sticky-stage {
  position: sticky;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sk-stage {
  width: min(90vw, 600px);
  height: min(75vh, 500px);
  position: relative;
  perspective: 800px;
}

.sk-stack {
  width: 100%;
  height: 100%;
  position: relative;
}

.sk-card {
  position: absolute;
  inset: 0;
  border-radius: 20px;
  overflow: hidden;
  will-change: transform, opacity;
  border: 1px solid rgba(255,255,255,0.06);
  box-shadow: 0 8px 40px rgba(0,0,0,0.4);
}

.sk-card-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.sk-card-0 .sk-card-bg { background: linear-gradient(160deg, #1a1a2e 0%, #16213e 100%); }
.sk-card-1 .sk-card-bg { background: linear-gradient(160deg, #1e1a2e 0%, #0f3460 100%); }
.sk-card-2 .sk-card-bg { background: linear-gradient(160deg, #2e1a2a 0%, #533483 100%); }
.sk-card-3 .sk-card-bg { background: linear-gradient(160deg, #1a2e2a 0%, #0f4c4c 100%); }
.sk-card-4 .sk-card-bg { background: linear-gradient(160deg, #2e1a1a 0%, #4a1a3a 100%); }
.sk-card-5 .sk-card-bg { background: linear-gradient(160deg, #1a2a2e 0%, #1a3a4a 100%); }

.sk-card-pattern {
  position: absolute;
  inset: 0;
  z-index: 1;
  background-image: radial-gradient(circle at 20% 50%, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 30px 30px;
}

.sk-card-body {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
  text-align: center;
}

.sk-card-num {
  position: absolute;
  top: 1rem;
  right: 1.5rem;
  font-size: 3.5rem;
  font-weight: 900;
  opacity: 0.08;
  color: #fff;
  line-height: 1;
}

.sk-card-emoji {
  font-size: 3.5rem;
  margin-bottom: 0.8rem;
  filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));
}

.sk-card-title {
  font-size: clamp(1.8rem, 5vw, 2.8rem);
  font-weight: 800;
  margin: 0.5rem 0;
  letter-spacing: -1px;
}

.sk-card-desc {
  font-size: clamp(0.9rem, 2vw, 1.1rem);
  opacity: 0.7;
  max-width: 400px;
  line-height: 1.6;
  margin: 0.5rem 0 1rem;
}

.sk-card-tag {
  display: inline-block;
  padding: 0.3rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.1);
  letter-spacing: 0.5px;
}

.sk-card-bottom-line {
  position: absolute;
  bottom: 0;
  left: 20%;
  right: 20%;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
  z-index: 2;
}

.sk-stack-label {
  position: fixed;
  top: 2rem;
  left: 2rem;
  z-index: 1000;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.3em;
  color: rgba(255,255,255,0.2);
  text-transform: uppercase;
}
</style>

<style>
.sk-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #533483, #0f3460, #1a3a4a);
  z-index: 1000;
  width: 0%;
  transition: width 0.1s linear;
}

.sk-nav-dots {
  position: fixed;
  right: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.sk-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255,255,255,0.25);
  cursor: pointer;
  transition: all 0.3s;
}

.sk-dot.active {
  background: #fff;
  box-shadow: 0 0 10px rgba(255,255,255,0.5);
  transform: scale(1.4);
}

.sk-page-indicator {
  position: fixed;
  bottom: 2rem;
  left: 2rem;
  z-index: 1000;
  font-size: 0.9rem;
  color: rgba(255,255,255,0.5);
}
.sk-current { color: #fff; font-weight: 700; }

@media (max-width: 768px) {
  .sk-nav-dots { right: 0.6rem; }
  .sk-page-indicator { left: 1rem; bottom: 1rem; }
  .sk-stack-label { left: 1rem; top: 1.5rem; }
  .sk-stage { width: 92vw; height: 65vh; }
}
</style>
