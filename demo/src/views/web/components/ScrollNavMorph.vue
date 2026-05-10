<template>
  <section class="nav-morph-section-222">
    <div class="container">
      <div class="title-wrapper-222">
        <h2 class="section-title-222">
          <span class="title-text-222">导航变形</span>
          <span class="title-subtitle-222">Nav Morph</span>
        </h2>
        <p class="description-222">
          菜单项图标和文字的动态变形效果
        </p>
      </div>

      <!-- 导航展示区域 -->
      <div class="nav-container-222">
        <!-- 水平导航 -->
        <div class="nav-wrapper-222 nav-horizontal-222" ref="navHorizontal">
          <div class="nav-label-222">水平导航</div>
          <nav class="nav-222">
            <div 
              v-for="(item, index) in navItems" 
              :key="`horiz-${index}`"
              class="nav-item-222"
              :class="`nav-item-horiz-222-${index}`"
              @mouseenter="handleHover(index, 'horizontal')"
              @mouseleave="handleLeave(index, 'horizontal')"
            >
              <div class="nav-icon-222" :class="`nav-icon-horiz-222-${index}`">
                {{ item.icon }}
              </div>
              <span class="nav-text-222">{{ item.text }}</span>
              <div class="nav-indicator-222" :class="`nav-indicator-horiz-222-${index}`"></div>
            </div>
          </nav>
        </div>

        <!-- 垂直导航 -->
        <div class="nav-wrapper-222 nav-vertical-222" ref="navVertical">
          <div class="nav-label-222">垂直导航</div>
          <nav class="nav-222 nav-vertical-list-222">
            <div 
              v-for="(item, index) in navItems" 
              :key="`vert-${index}`"
              class="nav-item-222 nav-item-vertical-222"
              :class="`nav-item-vert-222-${index}`"
              @mouseenter="handleHover(index, 'vertical')"
              @mouseleave="handleLeave(index, 'vertical')"
            >
              <div class="nav-icon-222" :class="`nav-icon-vert-222-${index}`">
                {{ item.icon }}
              </div>
              <span class="nav-text-222">{{ item.text }}</span>
              <div class="nav-indicator-222" :class="`nav-indicator-vert-222-${index}`"></div>
            </div>
          </nav>
        </div>

        <!-- 圆形导航 -->
        <div class="nav-wrapper-222 nav-circular-222" ref="navCircular">
          <div class="nav-label-222">圆形导航</div>
          <div class="nav-circular-container-222" ref="circularContainer">
            <div 
              v-for="(item, index) in navItems" 
              :key="`circ-${index}`"
              class="nav-item-222 nav-item-circular-222"
              :class="`nav-item-circ-222-${index}`"
              :style="getCircularStyle(index)"
              @mouseenter="handleHover(index, 'circular')"
              @mouseleave="handleLeave(index, 'circular')"
            >
              <div class="nav-icon-222" :class="`nav-icon-circ-222-${index}`">
                {{ item.icon }}
              </div>
              <div class="nav-tooltip-222">{{ item.text }}</div>
            </div>
          </div>
        </div>

        <!-- 标签导航 -->
        <div class="nav-wrapper-222 nav-tabs-222" ref="navTabs">
          <div class="nav-label-222">标签导航</div>
          <nav class="nav-222 nav-tabs-list-222">
            <div 
              v-for="(item, index) in navItems" 
              :key="`tab-${index}`"
              class="nav-item-222 nav-item-tab-222"
              :class="`nav-item-tab-222-${index}`"
              @mouseenter="handleHover(index, 'tab')"
              @mouseleave="handleLeave(index, 'tab')"
            >
              <div class="nav-icon-222" :class="`nav-icon-tab-222-${index}`">
                {{ item.icon }}
              </div>
              <span class="nav-text-222">{{ item.text }}</span>
              <div class="nav-badge-222" :class="`nav-badge-tab-222-${index}`">{{ index + 1 }}</div>
            </div>
          </nav>
        </div>
      </div>

      <!-- 变形预览 -->
      <div class="morph-preview-222" ref="morphPreview">
        <div class="preview-label-222">变形预览</div>
        <div class="preview-content-222">
          <div 
            v-for="(item, index) in navItems.slice(0, 3)" 
            :key="`preview-${index}`"
            class="preview-item-222"
            :class="`preview-item-222-${index}`"
            @mouseenter="previewHover(index)"
            @mouseleave="previewLeave(index)"
          >
            <div class="preview-icon-222" :class="`preview-icon-222-${index}`">
              {{ item.icon }}
            </div>
            <div class="preview-info-222">
              <span class="preview-title-222">{{ item.text }}</span>
              <span class="preview-desc-222">{{ item.description }}</span>
            </div>
            <div class="preview-arrow-222" :class="`preview-arrow-222-${index}`">→</div>
          </div>
        </div>
      </div>

      <!-- 粒子背景 -->
      <canvas class="nav-particles-222" ref="particlesCanvas"></canvas>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const particlesCanvas = ref(null)
const navHorizontal = ref(null)
const navVertical = ref(null)
const navCircular = ref(null)
const navTabs = ref(null)
const morphPreview = ref(null)
const circularContainer = ref(null)
let ctx = null
let particles = []
let animationFrame = null

const navItems = [
  { icon: '🏠', text: '首页', description: '返回主页面' },
  { icon: '📱', text: '产品', description: '查看产品列表' },
  { icon: '🎨', text: '设计', description: '探索设计理念' },
  { icon: '💼', text: '服务', description: '了解服务内容' },
  { icon: '📞', text: '联系', description: '联系我们' }
]

// 获取圆形导航样式
function getCircularStyle(index) {
  const total = navItems.length
  const angle = (index / total) * 2 * Math.PI - Math.PI / 2
  const radius = 100
  const x = Math.cos(angle) * radius
  const y = Math.sin(angle) * radius
  return {
    transform: `translate(${x}px, ${y}px)`
  }
}

// 处理悬停
function handleHover(index, type) {
  const prefix = type === 'horizontal' ? 'horiz' : type === 'vertical' ? 'vert' : type === 'circular' ? 'circ' : 'tab'
  
  // 图标变形
  gsap.to(`.nav-icon-${prefix}-222-${index}`, {
    scale: 1.3,
    rotate: 45,
    duration: 0.3,
    ease: 'power2.out'
  })

  // 文字变形
  const item = document.querySelector(`.nav-item-${prefix}-222-${index}`)
  if (item) {
    gsap.to(item.querySelector('.nav-text-222'), {
      scale: 1.1,
      fontWeight: 700,
      duration: 0.3,
      ease: 'power2.out'
    })
  }

  // 指示器动画
  const indicator = document.querySelector(`.nav-indicator-${prefix}-222-${index}`)
  if (indicator) {
    gsap.to(indicator, {
      scale: 1,
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out'
    })
  }

  // 圆形导航特殊效果
  if (type === 'circular') {
    gsap.to(`.nav-item-${prefix}-222-${index}`, {
      scale: 1.2,
      boxShadow: '0 0 30px rgba(255, 107, 107, 0.5)',
      duration: 0.3,
      ease: 'power2.out'
    })
  }
}

// 处理离开
function handleLeave(index, type) {
  const prefix = type === 'horizontal' ? 'horiz' : type === 'vertical' ? 'vert' : type === 'circular' ? 'circ' : 'tab'
  
  // 图标复位
  gsap.to(`.nav-icon-${prefix}-222-${index}`, {
    scale: 1,
    rotate: 0,
    duration: 0.3,
    ease: 'power2.out'
  })

  // 文字复位
  const item = document.querySelector(`.nav-item-${prefix}-222-${index}`)
  if (item) {
    gsap.to(item.querySelector('.nav-text-222'), {
      scale: 1,
      fontWeight: 400,
      duration: 0.3,
      ease: 'power2.out'
    })
  }

  // 指示器复位
  const indicatorReset = document.querySelector(`.nav-indicator-${prefix}-222-${index}`)
  if (indicatorReset) {
    gsap.to(indicatorReset, {
      scale: 0,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.out'
    })
  }

  // 圆形导航复位
  if (type === 'circular') {
    gsap.to(`.nav-item-${prefix}-222-${index}`, {
      scale: 1,
      boxShadow: '0 5px 15px rgba(255, 255, 255, 0.1)',
      duration: 0.3,
      ease: 'power2.out'
    })
  }
}

// 预览悬停
function previewHover(index) {
  gsap.to(`.preview-icon-222-${index}`, {
    scale: 1.2,
    rotate: 15,
    duration: 0.3,
    ease: 'power2.out'
  })

  gsap.to(`.preview-arrow-222-${index}`, {
    x: 10,
    duration: 0.3,
    ease: 'power2.out'
  })
}

// 预览离开
function previewLeave(index) {
  gsap.to(`.preview-icon-222-${index}`, {
    scale: 1,
    rotate: 0,
    duration: 0.3,
    ease: 'power2.out'
  })

  gsap.to(`.preview-arrow-222-${index}`, {
    x: 0,
    duration: 0.3,
    ease: 'power2.out'
  })
}

// 创建粒子
function createParticles() {
  particles = []
  for (let i = 0; i < 50; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.8,
      speedY: (Math.random() - 0.5) * 0.8,
      opacity: Math.random() * 0.6 + 0.2,
      hue: Math.random() * 60 + 340
    })
  }
}

// 绘制粒子
function drawParticles() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
  
  particles.forEach(particle => {
    ctx.beginPath()
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
    ctx.fillStyle = `hsla(${particle.hue}, 80%, 60%, ${particle.opacity})`
    ctx.fill()
    
    particle.x += particle.speedX
    particle.y += particle.speedY
    
    if (particle.x < 0) particle.x = window.innerWidth
    if (particle.x > window.innerWidth) particle.x = 0
    if (particle.y < 0) particle.y = window.innerHeight
    if (particle.y > window.innerHeight) particle.y = 0
  })
  
  animationFrame = requestAnimationFrame(drawParticles)
}

onMounted(() => {
  // 初始化粒子
  if (particlesCanvas.value) {
    particlesCanvas.value.width = window.innerWidth
    particlesCanvas.value.height = window.innerHeight
    ctx = particlesCanvas.value.getContext('2d')
    createParticles()
    drawParticles()
  }

  // 标题入场
  gsap.fromTo(
    '.title-wrapper-222',
    {
      y: -50,
      opacity: 0
    },
    {
      y: 0,
      opacity: 1,
      duration: 1,
      scrollTrigger: {
        trigger: '.nav-morph-section-222',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    }
  )

  // 导航容器入场
  const wrappers = [navHorizontal.value, navVertical.value, navCircular.value, navTabs.value]
  
  wrappers.forEach((wrapper, index) => {
    gsap.fromTo(
      wrapper,
      {
        y: 60,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: index * 0.15,
        scrollTrigger: {
          trigger: wrapper,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    )
  })

  // 预览入场
  gsap.fromTo(
    morphPreview.value,
    {
      y: 50,
      opacity: 0
    },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      scrollTrigger: {
        trigger: morphPreview.value,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    }
  )

  // 预览项目入场
  gsap.utils.toArray('.preview-item-222').forEach((item, index) => {
    gsap.fromTo(
      item,
      {
        x: -30,
        opacity: 0
      },
      {
        x: 0,
        opacity: 1,
        duration: 0.5,
        delay: index * 0.1,
        scrollTrigger: {
          trigger: item,
          start: 'top 90%',
          toggleActions: 'play none none reverse'
        }
      }
    )
  })

  // 徽章动画
  gsap.fromTo(
    '.nav-badge-222',
    {
      scale: 0,
      rotation: -180
    },
    {
      scale: 1,
      rotation: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'elastic.out(1, 0.5)',
      scrollTrigger: {
        trigger: navTabs.value,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    }
  )
})

onUnmounted(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
})
</script>

<style scoped>
.nav-morph-section-222 {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  padding: 80px 20px;
  overflow: hidden;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.title-wrapper-222 {
  text-align: center;
  margin-bottom: 60px;
}

.section-title-222 {
  font-size: 3.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 10px;
}

.title-text-222 {
  display: block;
}

.title-subtitle-222 {
  font-size: 1.5rem;
  font-weight: 300;
  color: #ff6b6b;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 0.3em;
}

.description-222 {
  font-size: 1.2rem;
  color: #fff;
  opacity: 0.7;
  margin-top: 20px;
}

.nav-container-222 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
  margin-bottom: 50px;
}

.nav-wrapper-222 {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 30px;
  position: relative;
}

.nav-label-222 {
  font-size: 1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 20px;
}

.nav-222 {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.nav-item-222 {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px 25px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 25px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
}

.nav-item-222:hover {
  background: rgba(255, 107, 107, 0.1);
  border-color: rgba(255, 107, 107, 0.3);
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(255, 107, 107, 0.2);
}

.nav-icon-222 {
  font-size: 1.5rem;
  transition: all 0.3s ease;
}

.nav-text-222 {
  font-size: 1rem;
  font-weight: 400;
  transition: all 0.3s ease;
}

.nav-indicator-222 {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 3px;
  background: linear-gradient(90deg, #ff6b6b 0%, #feca57 100%);
  border-radius: 2px;
  transform: translateX(-50%);
  scale: 0;
  opacity: 0;
  transition: all 0.3s ease;
}

.nav-vertical-list-222 {
  flex-direction: column;
  align-items: stretch;
}

.nav-item-vertical-222 {
  justify-content: center;
  width: 100%;
}

.nav-tabs-list-222 {
  flex-wrap: nowrap;
  overflow-x: auto;
}

.nav-item-tab-222 {
  position: relative;
  flex-shrink: 0;
}

.nav-badge-222 {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
  border-radius: 50%;
  color: #fff;
  font-size: 0.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-circular-container-222 {
  position: relative;
  width: 250px;
  height: 250px;
  margin: 0 auto;
}

.nav-item-circular-222 {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(255, 255, 255, 0.1);
}

.nav-item-circular-222:hover {
  background: rgba(255, 107, 107, 0.1);
  border-color: rgba(255, 107, 107, 0.3);
}

.nav-circular-container-222 .nav-icon-222 {
  font-size: 1.8rem;
}

.nav-tooltip-222 {
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.9);
  color: #1a1a2e;
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.nav-item-circular-222:hover .nav-tooltip-222 {
  opacity: 1;
}

.morph-preview-222 {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 30px;
}

.preview-label-222 {
  font-size: 1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 20px;
}

.preview-content-222 {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.preview-item-222 {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.preview-item-222:hover {
  background: rgba(255, 107, 107, 0.05);
  border-color: rgba(255, 107, 107, 0.2);
  transform: translateX(10px);
}

.preview-icon-222 {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 10px;
  font-size: 1.5rem;
  transition: all 0.3s ease;
}

.preview-info-222 {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.preview-title-222 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
}

.preview-desc-222 {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
}

.preview-arrow-222 {
  font-size: 1.5rem;
  color: #ff6b6b;
  transition: transform 0.3s ease;
}

.nav-particles-222 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

@media (max-width: 768px) {
  .section-title-222 {
    font-size: 2rem;
  }

  .title-subtitle-222 {
    font-size: 1rem;
  }

  .nav-container-222 {
    grid-template-columns: 1fr;
  }

  .nav-222 {
    justify-content: center;
  }

  .nav-item-222 {
    padding: 12px 20px;
  }

  .nav-circular-container-222 {
    width: 200px;
    height: 200px;
  }

  .nav-item-circular-222 {
    width: 50px;
    height: 50px;
  }
}
</style>
