<template>
  <div class="scroll-tab-switch-section-224">
    <!-- 粒子背景 -->
    <canvas ref="particleCanvas" class="particle-canvas-224"></canvas>

    <!-- 主标题 -->
    <div class="section-header-224">
      <h2 class="section-title-224">标签切换动画</h2>
      <p class="section-subtitle-224">Tab Switch Animation</p>
    </div>

    <!-- 标签切换 1: 基础滑动指示器 -->
    <div class="tab-demo-224 basic-tab-224">
      <div class="demo-label-224">基础滑动指示器</div>
      <div class="tab-container-224" ref="tabContainer1">
        <div class="tab-header-224">
          <div class="tab-indicator-224" id="tab-indicator-224-1"></div>
          <button
            v-for="(tab, index) in tabs1"
            :key="index"
            :class="['tab-button-224', { 'tab-active-224': activeTab1 === index }]"
            @click="activeTab1 = index"
          >
            {{ tab }}
          </button>
        </div>
        <div class="tab-content-224">
          <div class="tab-pane-224 tab-pane-active-224">
            <h3 class="pane-title-224">🎨 设计理念</h3>
            <p class="pane-text-224">通过流畅的动画过渡,提升用户体验。滑动指示器跟随当前标签位置,提供清晰的视觉反馈。</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 标签切换 2: 带图标和徽章 -->
    <div class="tab-demo-224 icon-tab-224">
      <div class="demo-label-224">带图标和徽章</div>
      <div class="tab-container-224">
        <div class="tab-header-224">
          <div class="tab-indicator-224" id="tab-indicator-224-2"></div>
          <button
            v-for="(tab, index) in tabs2"
            :key="index"
            :class="['tab-button-224', { 'tab-active-224': activeTab2 === index }]"
            @click="activeTab2 = index"
          >
            <span class="tab-icon-224">{{ tab.icon }}</span>
            <span class="tab-label-224">{{ tab.label }}</span>
            <span v-if="tab.badge" class="tab-badge-224">{{ tab.badge }}</span>
          </button>
        </div>
        <div class="tab-content-224">
          <div class="tab-pane-224 tab-pane-active-224">
            <h3 class="pane-title-224">{{ tabs2[activeTab2].icon }} {{ tabs2[activeTab2].label }}</h3>
            <p class="pane-text-224">{{ tabs2[activeTab2].content }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 标签切换 3: 垂直标签 -->
    <div class="tab-demo-224 vertical-tab-224">
      <div class="demo-label-224">垂直标签</div>
      <div class="tab-container-224 tab-vertical-224">
        <div class="tab-header-224">
          <div class="tab-indicator-224 tab-indicator-vertical-224" id="tab-indicator-224-3"></div>
          <button
            v-for="(tab, index) in tabs3"
            :key="index"
            :class="['tab-button-224', { 'tab-active-224': activeTab3 === index }]"
            @click="activeTab3 = index"
          >
            <span class="tab-number-224">{{ String(index + 1).padStart(2, '0') }}</span>
            <span class="tab-label-224">{{ tab }}</span>
          </button>
        </div>
        <div class="tab-content-224">
          <div class="tab-pane-224 tab-pane-active-224">
            <h3 class="pane-title-224">{{ tabs3[activeTab3] }}</h3>
            <p class="pane-text-224">垂直布局的标签组件,适合左侧导航或设置面板。指示器在左侧垂直滑动,提供清晰的选中状态。</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 标签切换 4: 圆形标签 -->
    <div class="tab-demo-224 circle-tab-224">
      <div class="demo-label-224">圆形标签</div>
      <div class="tab-container-224">
        <div class="tab-header-224">
          <div class="tab-indicator-224 tab-indicator-circle-224" id="tab-indicator-224-4"></div>
          <button
            v-for="(tab, index) in tabs4"
            :key="index"
            :class="['tab-button-224', 'tab-button-circle-224', { 'tab-active-224': activeTab4 === index }]"
            @click="activeTab4 = index"
          >
            {{ tab }}
          </button>
        </div>
        <div class="tab-content-224">
          <div class="tab-pane-224 tab-pane-active-224">
            <h3 class="pane-title-224">{{ tabs4[activeTab4] }}</h3>
            <p class="pane-text-224">圆形标签设计,适用于现代简洁的界面风格。指示器采用圆形背景,提供柔和的视觉过渡。</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 标签切换 5: 带发光效果的标签 -->
    <div class="tab-demo-224 glow-tab-224">
      <div class="demo-label-224">霓虹发光效果</div>
      <div class="tab-container-224">
        <div class="tab-header-224">
          <div class="tab-indicator-224 tab-indicator-glow-224" id="tab-indicator-224-5"></div>
          <button
            v-for="(tab, index) in tabs5"
            :key="index"
            :class="['tab-button-224', 'tab-button-glow-224', { 'tab-active-224': activeTab5 === index }]"
            @click="activeTab5 = index"
          >
            {{ tab }}
          </button>
        </div>
        <div class="tab-content-224">
          <div class="tab-pane-224 tab-pane-active-224">
            <h3 class="pane-title-224">{{ tabs5[activeTab5] }}</h3>
            <p class="pane-text-224">霓虹发光效果,为标签切换增添科技感。指示器带有动态发光动画,吸引用户注意力。</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const particleCanvas = ref(null)

// 标签数据
const tabs1 = ['首页', '产品', '服务', '关于', '联系']
const activeTab1 = ref(0)

const tabs2 = [
  { icon: '📊', label: '概览', content: '查看整体数据概览和关键指标分析。', badge: '12' },
  { icon: '📈', label: '趋势', content: '分析历史数据和未来趋势预测。', badge: null },
  { icon: '🎯', label: '目标', content: '设置和追踪业务目标完成情况。', badge: '5' },
  { icon: '⚙️', label: '设置', content: '配置系统参数和个性化选项。', badge: null }
]
const activeTab2 = ref(0)

const tabs3 = ['用户管理', '权限设置', '数据备份', '系统日志', '安全中心']
const activeTab3 = ref(0)

const tabs4 = ['日', '周', '月', '季', '年']
const activeTab4 = ref(0)

const tabs5 = ['探索', '创作', '分享', '收藏']
const activeTab5 = ref(0)

// 粒子系统
let particles = []
let animationId = null

const initParticles = () => {
  const canvas = particleCanvas.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  for (let i = 0; i < 80; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedX: Math.random() * 0.5 - 0.25,
      speedY: Math.random() * 0.5 - 0.25,
      opacity: Math.random() * 0.5 + 0.2
    })
  }

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    particles.forEach(p => {
      p.x += p.speedX
      p.y += p.speedY

      if (p.x < 0) p.x = canvas.width
      if (p.x > canvas.width) p.x = 0
      if (p.y < 0) p.y = canvas.height
      if (p.y > canvas.height) p.y = 0

      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(236, 72, 153, ${p.opacity})`
      ctx.fill()
    })

    animationId = requestAnimationFrame(animate)
  }

  animate()
}

// 指示器动画
const updateIndicator = (containerId, indicatorId, activeIndex, isVertical = false) => {
  nextTick(() => {
    const container = document.getElementById(containerId)
    const indicator = document.getElementById(indicatorId)
    
    if (!container || !indicator) return

    const buttons = container.querySelectorAll('.tab-button-224')
    const activeButton = buttons[activeIndex]

    if (!activeButton) return

    const containerRect = container.getBoundingClientRect()
    const buttonRect = activeButton.getBoundingClientRect()

    if (isVertical) {
      const top = buttonRect.top - containerRect.top
      const height = buttonRect.height

      gsap.to(indicator, {
        top: top + 'px',
        height: height + 'px',
        duration: 0.3,
        ease: 'power2.out'
      })
    } else {
      const left = buttonRect.left - containerRect.left
      const width = buttonRect.width

      gsap.to(indicator, {
        left: left + 'px',
        width: width + 'px',
        duration: 0.3,
        ease: 'power2.out'
      })
    }
  })
}

// 监听标签切换
watch(activeTab1, (newVal) => {
  updateIndicator('tab-indicator-224-1', 'tab-indicator-224-1', newVal)
})

watch(activeTab2, (newVal) => {
  updateIndicator('tab-indicator-224-2', 'tab-indicator-224-2', newVal)
})

watch(activeTab3, (newVal) => {
  updateIndicator('tab-indicator-224-3', 'tab-indicator-224-3', newVal, true)
})

watch(activeTab4, (newVal) => {
  updateIndicator('tab-indicator-224-4', 'tab-indicator-224-4', newVal)
})

watch(activeTab5, (newVal) => {
  updateIndicator('tab-indicator-224-5', 'tab-indicator-224-5', newVal)
})

// GSAP动画
const initAnimations = () => {
  // 基础标签动画
  gsap.from('.basic-tab-224 .tab-button-224', {
    scrollTrigger: {
      trigger: '.basic-tab-224',
      start: 'top 80%',
      end: 'bottom 60%',
      scrub: 1
    },
    y: 20,
    opacity: 0,
    stagger: 0.1,
    ease: 'power2.out'
  })

  // 图标标签动画
  gsap.from('.icon-tab-224 .tab-button-224', {
    scrollTrigger: {
      trigger: '.icon-tab-224',
      start: 'top 80%',
      end: 'bottom 60%',
      scrub: 1
    },
    scale: 0.8,
    opacity: 0,
    stagger: 0.1,
    ease: 'back.out(1.7)'
  })

  // 垂直标签动画
  gsap.from('.vertical-tab-224 .tab-button-224', {
    scrollTrigger: {
      trigger: '.vertical-tab-224',
      start: 'top 80%',
      end: 'bottom 60%',
      scrub: 1
    },
    x: -20,
    opacity: 0,
    stagger: 0.1,
    ease: 'power2.out'
  })

  // 圆形标签动画
  gsap.from('.circle-tab-224 .tab-button-224', {
    scrollTrigger: {
      trigger: '.circle-tab-224',
      start: 'top 80%',
      end: 'bottom 60%',
      scrub: 1
    },
    scale: 0,
    opacity: 0,
    stagger: 0.1,
    ease: 'back.out(1.7)'
  })

  // 发光标签动画
  gsap.from('.glow-tab-224 .tab-button-224', {
    scrollTrigger: {
      trigger: '.glow-tab-224',
      start: 'top 80%',
      end: 'bottom 60%',
      scrub: 1
    },
    y: 30,
    opacity: 0,
    stagger: 0.1,
    ease: 'power2.out'
  })

  // 初始化指示器位置
  setTimeout(() => {
    updateIndicator('tab-indicator-224-1', 'tab-indicator-224-1', 0)
    updateIndicator('tab-indicator-224-2', 'tab-indicator-224-2', 0)
    updateIndicator('tab-indicator-224-3', 'tab-indicator-224-3', 0, true)
    updateIndicator('tab-indicator-224-4', 'tab-indicator-224-4', 0)
    updateIndicator('tab-indicator-224-5', 'tab-indicator-224-5', 0)
  }, 100)
}

onMounted(() => {
  initParticles()
  initAnimations()
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
})
</script>

<style scoped>
/* GSAP opacity fix: ensure content is always visible */

.scroll-tab-switch-section-224 {
  min-height: 100vh;
  padding: 80px 20px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.particle-canvas-224 {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;

  opacity: 1 !important;}

.section-header-224 {
  text-align: center;
  margin-bottom: 60px;
  position: relative;
  z-index: 2;

  opacity: 1 !important;}

.section-title-224 {
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, #ec4899 0%, #f472b6 50%, #fb7185 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
  text-shadow: 0 0 40px rgba(236, 72, 153, 0.3);

  opacity: 1 !important;}

.section-subtitle-224 {
  font-size: 1.25rem;
  color: #64748b;
  letter-spacing: 0.2em;
  text-transform: uppercase;

  opacity: 1 !important;}

.tab-demo-224 {
  max-width: 1000px;
  margin: 0 auto 60px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(236, 72, 153, 0.1);
  position: relative;
  z-index: 2;

  opacity: 1 !important;}

.demo-label-224 {
  font-size: 0.875rem;
  color: #ec4899;
  margin-bottom: 24px;
  padding: 8px 16px;
  background: rgba(236, 72, 153, 0.1);
  border-radius: 20px;
  display: inline-block;
  font-weight: 600;
  letter-spacing: 0.05em;

  opacity: 1 !important;}

.tab-container-224 {
  position: relative;
}

.tab-header-224 {
  position: relative;
  display: flex;
  gap: 8px;
  margin-bottom: 32px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  overflow: hidden;

  opacity: 1 !important;}

.tab-indicator-224 {
  position: absolute;
  top: 8px;
  left: 0;
  height: calc(100% - 16px);
  width: 100px;
  background: linear-gradient(135deg, #ec4899 0%, #f472b6 100%);
  border-radius: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(236, 72, 153, 0.3);

  opacity: 1 !important;}

.tab-indicator-glow-224 {
  box-shadow: 0 0 20px rgba(236, 72, 153, 0.6),
              0 0 40px rgba(236, 72, 153, 0.4),
              0 0 60px rgba(236, 72, 153, 0.2);
  animation: glow-pulse-224 2s ease-in-out infinite;
}

@keyframes glow-pulse-224 {
  0%, 100% {
    box-shadow: 0 0 20px rgba(236, 72, 153, 0.6),
                0 0 40px rgba(236, 72, 153, 0.4);
  }
  50% {
    box-shadow: 0 0 30px rgba(236, 72, 153, 0.8),
                0 0 60px rgba(236, 72, 153, 0.6),
                0 0 80px rgba(236, 72, 153, 0.4);
  }
}

.tab-button-224 {
  position: relative;
  flex: 1;
  padding: 14px 20px;
  background: transparent;
  border: none;
  border-radius: 12px;
  color: #94a3b8;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  white-space: nowrap;
  z-index: 1;

  opacity: 1 !important;}

.tab-button-224:hover {
  color: #e2e8f0;
  background: rgba(255, 255, 255, 0.05);
}

.tab-active-224 {
  color: #fff;
  font-weight: 600;

  opacity: 1 !important;}

.tab-icon-224 {
  font-size: 1.1rem;

  opacity: 1 !important;}

.tab-label-224 {
  flex-shrink: 0;
}

.tab-badge-224 {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background: #ec4899;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(236, 72, 153, 0.4);

  opacity: 1 !important;}

.tab-number-224 {
  font-size: 0.875rem;
  font-weight: 700;
  color: #64748b;
  font-family: monospace;

  opacity: 1 !important;}

.tab-active-224 .tab-number-224 {
  color: #ec4899;

  opacity: 1 !important;}

.tab-content-224 {
  padding: 24px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 16px;
  border: 1px solid rgba(236, 72, 153, 0.1);

  opacity: 1 !important;}

.tab-pane-224 {
  animation: fade-in-224 0.3s ease;
}

@keyframes fade-in-224 {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.pane-title-224 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 16px;

  opacity: 1 !important;}

.pane-text-224 {
  font-size: 1rem;
  color: #94a3b8;
  line-height: 1.8;

  opacity: 1 !important;}

/* 垂直标签 */
.tab-vertical-224 {
  display: flex;
  flex-direction: row;
  gap: 32px;
}

.tab-vertical-224 .tab-header-224 {
  flex-direction: column;
  width: 200px;
  min-width: 200px;

  opacity: 1 !important;}

.tab-vertical-224 .tab-button-224 {
  justify-content: flex-start;
  padding: 16px 20px;

  opacity: 1 !important;}

.tab-indicator-vertical-224 {
  width: calc(100% - 16px);
  height: auto;
  left: 8px;
  top: 8px;

  opacity: 1 !important;}

/* 圆形标签 */
.tab-button-circle-224 {
  padding: 14px 28px;

  opacity: 1 !important;}

.tab-indicator-circle-224 {
  border-radius: 20px;
}

/* 发光标签 */
.tab-button-glow-224 {
  font-size: 1rem;
  padding: 16px 24px;

  opacity: 1 !important;}

.tab-button-glow-224:hover {
  color: #ec4899;
  text-shadow: 0 0 10px rgba(236, 72, 153, 0.5);
}

.tab-active-224.tab-button-glow-224 {
  text-shadow: 0 0 15px rgba(236, 72, 153, 0.7);
}

/* 响应式 */
@media (max-width: 768px) {
  .section-title-224 {
    font-size: 2rem;
  
  opacity: 1 !important;}

  .tab-demo-224 {
    padding: 24px;
  
  opacity: 1 !important;}

  .tab-header-224 {
    gap: 4px;
    padding: 6px;
  
  opacity: 1 !important;}

  .tab-indicator-224 {
    top: 6px;
    height: calc(100% - 12px);
  
  opacity: 1 !important;}

  .tab-button-224 {
    padding: 10px 12px;
    font-size: 0.85rem;
  
  opacity: 1 !important;}

  .tab-icon-224 {
    font-size: 1rem;
  
  opacity: 1 !important;}

  .tab-vertical-224 {
    flex-direction: column;
  }

  .tab-vertical-224 .tab-header-224 {
    width: 100%;
    min-width: unset;
    flex-direction: row;
  
  opacity: 1 !important;}

  .tab-vertical-224 .tab-button-224 {
    justify-content: center;
  }

  .tab-indicator-vertical-224 {
    width: auto;
    height: calc(100% - 12px);
    left: 6px;
    top: 6px;
  
  opacity: 1 !important;}
}
</style>
