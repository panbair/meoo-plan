<template>
  <section class="text-columns-section-220">
    <div class="container">
      <div class="title-wrapper-220">
        <h2 class="section-title-220">
          <span class="title-text-220">文字分栏</span>
          <span class="title-subtitle-220">Text Columns</span>
        </h2>
        <p class="description-220">
          文字从单列优雅展开为多列布局
        </p>
      </div>

      <!-- 分栏指示器 -->
      <div class="column-indicator-220" ref="indicator">
        <div class="indicator-bars-220">
          <div 
            v-for="n in 3" 
            :key="n"
            class="indicator-bar-220"
            :class="{ active: currentColumns >= n }"
          >
            <div class="bar-fill-220"></div>
          </div>
        </div>
        <div class="indicator-label-220">
          <span class="label-text-220">当前分栏: <strong>{{ currentColumns }} 列</strong></span>
        </div>
      </div>

      <!-- 分栏展示区域 -->
      <div class="columns-container-220">
        <div 
          v-for="(item, index) in columnItems" 
          :key="index"
          class="column-item-220"
          :class="`column-item-220-${index}`"
          ref="columnItemsRef"
        >
          <div class="column-header-220">
            <h3 class="column-title-220">{{ item.title }}</h3>
            <div class="column-badge-220" :class="`column-badge-220-${index}`">
              <span class="badge-number-220">{{ index + 1 }}</span>
            </div>
          </div>
          
          <div 
            class="column-content-220"
            :class="`column-content-220-${index}`"
            ref="columnContentsRef"
          >
            <p class="column-text-220">{{ item.text }}</p>
            
            <div class="column-tags-220">
              <span 
                v-for="(tag, tagIndex) in item.tags" 
                :key="tagIndex"
                class="column-tag-220"
              >
                {{ tag }}
              </span>
            </div>

            <div class="column-footer-220">
              <button class="column-btn-220" :class="`column-btn-220-${index}`">
                <span class="btn-text-220">了解更多</span>
                <span class="btn-arrow-220">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 进度条 -->
      <div class="progress-bar-220">
        <div class="progress-fill-220" ref="progressFill"></div>
        <div class="progress-labels-220">
          <span class="progress-label-220">单列</span>
          <span class="progress-label-220">双列</span>
          <span class="progress-label-220">三列</span>
        </div>
      </div>

      <!-- 粒子背景 -->
      <canvas class="columns-particles-220" ref="particlesCanvas"></canvas>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const particlesCanvas = ref(null)
const indicator = ref(null)
const progressFill = ref(null)
const columnItemsRef = ref([])
const columnContentsRef = ref([])
let ctx = null
let particles = []
let animationFrame = null

const currentColumns = ref(1)

const columnItems = [
  {
    title: '创意设计',
    text: '在数字时代，创意设计不再局限于传统的平面视觉，而是融合了多媒体、交互式体验和沉浸式美学。我们的设计理念源于对未来的洞察，通过创新的设计语言，将品牌故事以最引人入胜的方式呈现给用户。',
    tags: ['UI/UX', '视觉设计', '品牌设计']
  },
  {
    title: '技术实现',
    text: '前沿技术的应用是项目成功的关键。我们深入研究最新的Web技术栈，包括Vue3、React、GSAP动画引擎、WebGL渲染等，确保每一个项目都能达到技术领先的标准，同时保持优秀的性能表现。',
    tags: ['前端开发', '动画技术', '性能优化']
  },
  {
    title: '用户体验',
    text: '用户体验设计的核心是理解用户需求。通过用户研究、可用性测试和数据分析，我们不断优化产品界面，创造流畅自然的交互体验。每一个细节都经过精心设计，只为给用户带来最佳的体验感受。',
    tags: ['用户研究', '交互设计', '可用性']
  },
  {
    title: '数据分析',
    text: '数据驱动的决策让设计更加精准。我们利用先进的分析工具，收集用户行为数据，分析用户偏好，为设计优化提供客观依据。通过数据洞察，我们能够持续提升产品表现，实现商业目标。',
    tags: ['数据可视化', '用户分析', 'A/B测试']
  },
  {
    title: '品牌策略',
    text: '品牌策略是企业的核心资产。我们帮助客户建立独特的品牌定位，通过一致的品牌视觉和语言，在消费者心中树立强有力的品牌形象。从品牌识别到品牌传播，全方位打造品牌价值。',
    tags: ['品牌定位', '视觉识别', '品牌传播']
  },
  {
    title: '创新驱动',
    text: '创新是持续发展的动力。我们鼓励团队探索新技术、新方法，不断突破传统框架，寻找创新解决方案。每一个项目都是一次创新的尝试，每一次尝试都可能带来突破性的成果。',
    tags: ['技术研发', '创新思维', '持续学习']
  }
]

// 创建粒子
function createParticles() {
  particles = []
  for (let i = 0; i < 60; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.6 + 0.2,
      hue: Math.random() * 60 + 240
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
    '.title-wrapper-220',
    {
      y: -50,
      opacity: 0
    },
    {
      y: 0,
      opacity: 1,
      duration: 1,
      scrollTrigger: {
        trigger: '.text-columns-section-220',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    }
  )

  // 指示器入场
  gsap.fromTo(
    indicator.value,
    {
      y: 30,
      opacity: 0
    },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      scrollTrigger: {
        trigger: indicator.value,
        start: 'top 90%',
        toggleActions: 'play none none reverse'
      }
    }
  )

  // 分栏动画
  columnItemsRef.value.forEach((item, index) => {
    const content = columnContentsRef.value[index]
    
    // 从单列到多列的滚动动画
    gsap.fromTo(
      content,
      {
        columnCount: 1,
        columnGap: '20px'
      },
      {
        columnCount: index % 2 === 0 ? 2 : 3,
        columnGap: '40px',
        duration: 1.5,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: item,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 1
        }
      }
    )

    // 入场动画
    gsap.fromTo(
      item,
      {
        y: 80,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: index * 0.1,
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    )

    // 徽章动画
    gsap.fromTo(
      `.column-badge-220-${index}`,
      {
        scale: 0,
        rotation: -180
      },
      {
        scale: 1,
        rotation: 0,
        duration: 0.6,
        delay: index * 0.1 + 0.3,
        ease: 'elastic.out(1, 0.5)',
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    )

    // 标签动画
    gsap.fromTo(
      `.column-item-220-${index} .column-tag-220`,
      {
        y: 20,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        delay: index * 0.1 + 0.5,
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    )
  })

  // 进度条动画
  gsap.to(progressFill.value, {
    width: '100%',
    duration: 2,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.progress-bar-220',
      start: 'top 90%',
      toggleActions: 'play none none reverse'
    }
  })

  // 更新当前分栏数
  ScrollTrigger.create({
    trigger: '.columns-container-220',
    start: 'top 80%',
    end: 'bottom 20%',
    onUpdate: (self) => {
      if (self.progress < 0.33) {
        currentColumns.value = 1
      } else if (self.progress < 0.66) {
        currentColumns.value = 2
      } else {
        currentColumns.value = 3
      }
    }
  })

  // 按钮悬停效果
  columnItemsRef.value.forEach((item, index) => {
    const btn = item.querySelector('.column-btn-220')
    
    gsap.to(btn, {
      scale: 1.05,
      boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
      duration: 0.3,
      paused: true,
      overwrite: true
    })

    btn.addEventListener('mouseenter', () => {
      gsap.to(btn, {
        scale: 1.05,
        boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
        duration: 0.3
      })
      
      gsap.to(btn.querySelector('.btn-arrow-220'), {
        x: 5,
        duration: 0.3
      })
    })

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        scale: 1,
        boxShadow: '0 5px 20px rgba(102, 126, 234, 0.3)',
        duration: 0.3
      })
      
      gsap.to(btn.querySelector('.btn-arrow-220'), {
        x: 0,
        duration: 0.3
      })
    })
  })
})

onUnmounted(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
})
</script>

<style scoped>
/* GSAP opacity fix: ensure content is always visible */

.text-columns-section-220 {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
  padding: 80px 20px;
  overflow: hidden;

  opacity: 1 !important;}

.container {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.title-wrapper-220 {
  text-align: center;
  margin-bottom: 50px;

  opacity: 1 !important;}

.section-title-220 {
  font-size: 3.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 10px;

  opacity: 1 !important;}

.title-text-220 {
  display: block;
}

.title-subtitle-220 {
  font-size: 1.5rem;
  font-weight: 300;
  color: #667eea;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 0.3em;
}

.description-220 {
  font-size: 1.2rem;
  color: #fff;
  opacity: 0.7;
  margin-top: 20px;
}

.column-indicator-220 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 25px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 50px;

  opacity: 1 !important;}

.indicator-bars-220 {
  display: flex;
  gap: 15px;
}

.indicator-bar-220 {
  width: 80px;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  transition: all 0.3s ease;

  opacity: 1 !important;}

.indicator-bar-220.active {
  background: rgba(102, 126, 234, 0.2);

  opacity: 1 !important;}

.indicator-bar-220.active .bar-fill-220 {
  width: 100%;

  opacity: 1 !important;}

.bar-fill-220 {
  width: 0;
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
  transition: width 0.3s ease;

  opacity: 1 !important;}

.indicator-label-220 {
  font-size: 1rem;
  color: #fff;
  opacity: 0.9;
}

.indicator-label-220 strong {
  color: #667eea;
}

.columns-container-220 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 30px;
  margin-bottom: 50px;
}

.column-item-220 {
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 30px;
  transition: all 0.3s ease;

  opacity: 1 !important;}

.column-item-220:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(102, 126, 234, 0.2);
  border-color: rgba(102, 126, 234, 0.3);
}

.column-header-220 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.column-title-220 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #fff;

  opacity: 1 !important;}

.column-badge-220 {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  color: #fff;
  font-size: 1.5rem;
  font-weight: 800;

  opacity: 1 !important;}

.column-content-220 {
  min-height: 200px;

  opacity: 1 !important;}

.column-text-220 {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.8;
  margin-bottom: 20px;
  column-count: 1;
  column-gap: 20px;
  column-rule: 1px solid rgba(255, 255, 255, 0.1);

  opacity: 1 !important;}

.column-tags-220 {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.column-tag-220 {
  padding: 6px 16px;
  background: rgba(102, 126, 234, 0.2);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 20px;
  color: #667eea;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.3s ease;

  opacity: 1 !important;}

.column-item-220:hover .column-tag-220 {
  background: rgba(102, 126, 234, 0.3);
  transform: scale(1.05);

  opacity: 1 !important;}

.column-footer-220 {
  display: flex;
  justify-content: flex-end;
}

.column-btn-220 {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 25px;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.3);

  opacity: 1 !important;}

.btn-text-220 {
  position: relative;
  top: 1px;
}

.btn-arrow-220 {
  font-size: 1.2rem;
  transition: transform 0.3s ease;

  opacity: 1 !important;}

.progress-bar-220 {
  position: relative;
  padding: 30px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  opacity: 1 !important;}

.progress-fill-220 {
  width: 0;
  height: 6px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 3px;
  margin-bottom: 15px;

  opacity: 1 !important;}

.progress-labels-220 {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.1em;

  opacity: 1 !important;}

.columns-particles-220 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;

  opacity: 1 !important;}

@media (max-width: 768px) {
  .section-title-220 {
    font-size: 2rem;
  
  opacity: 1 !important;}

  .title-subtitle-220 {
    font-size: 1rem;
  
  opacity: 1 !important;}

  .columns-container-220 {
    grid-template-columns: 1fr;
  }

  .column-title-220 {
    font-size: 1.5rem;
  
  opacity: 1 !important;}

  .column-text-220 {
    font-size: 0.9rem;
  
  opacity: 1 !important;}

  .column-indicator-220 {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  
  opacity: 1 !important;}

  .indicator-bars-220 {
    justify-content: center;
  }
}
</style>
