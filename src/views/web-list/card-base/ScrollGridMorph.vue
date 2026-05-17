<template>
  <section class="sgm-scroll-grid-morph-223">
    <div class="sgm-container-223">
      <div class="sgm-header-223">
        <h2 class="sgm-title-223">网格变形动画</h2>
        <p class="sgm-subtitle-223">CSS Grid Morphing Animation</p>
      </div>

      <!-- 网格展示区域 -->
      <div class="sgm-grid-area-223">
        <div class="sgm-grid-container-223" ref="gridContainer">
          <div
            v-for="(item, index) in gridItems"
            :key="index"
            class="sgm-grid-item-223"
            :class="'sgm-item-' + index"
            :style="{
              background: item.color,
              '--item-index': index
            }"
            @mouseenter="handleItemHover(index)"
          >
            <div class="sgm-item-content-223">
              <span class="sgm-item-number-223">{{ index + 1 }}</span>
              <span class="sgm-item-icon-223">{{ item.icon }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 背景粒子 -->
    <div class="sgm-particles-223" id="sgm-particles-223"></div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const gridContainer = ref(null)
let lastLayoutIndex = -1
const animationTime = ref(0.8)

// 网格项目数据
const gridItems = ref(
  Array.from({ length: 16 }, (_, i) => ({
    icon: ['🔷', '🔶', '🔺', '🔻', '⬡', '⬢', '🔲', '🔳'][i % 8],
    color: `hsl(${(i * 22.5) % 360}, 70%, 60%)`
  }))
)

// 布局模式定义
const layouts = [
  {
    id: 'default',
    name: '默认网格',
    icon: '🔲',
    columns: 'repeat(4, 1fr)',
    rows: 'repeat(4, 1fr)',
    description: '4x4 对称网格'
  },
  {
    id: 'waterfall',
    name: '瀑布流',
    icon: '🌊',
    columns: 'repeat(3, 1fr)',
    rows: 'auto',
    description: '3列自适应高度'
  },
  {
    id: 'bento',
    name: '便当盒',
    icon: '🍱',
    columns: 'repeat(4, 1fr)',
    rows: 'repeat(4, 1fr)',
    description: '不规则网格'
  },
  {
    id: 'masonry',
    name: '砖石',
    icon: '🧱',
    columns: 'repeat(2, 1fr)',
    rows: 'auto',
    description: '2列交错布局'
  },
  {
    id: 'spiral',
    name: '螺旋',
    icon: '🌀',
    columns: 'repeat(3, 1fr)',
    rows: 'repeat(3, 1fr)',
    description: '螺旋排列'
  },
  {
    id: 'asymmetric',
    name: '不对称',
    icon: '⚖️',
    columns: 'repeat(3, 2fr 1fr)',
    rows: 'auto',
    description: '不对称布局'
  }
]

const switchLayout = (layoutId, isScroll = false) => {
  const layout = layouts.find(l => l.id === layoutId)

  if (!layout || !gridContainer.value) return

  // GSAP 动画过渡
  gsap.to(gridContainer.value, {
    '--sgm-columns': layout.columns,
    '--sgm-rows': layout.rows,
    '--sgm-gap': '20px',
    duration: animationTime.value,
    ease: isScroll ? 'power2.inOut' : 'elastic.out(1, 0.5)',
    onUpdate: () => {
      // 更新网格样式
      gridContainer.value.style.gridTemplateColumns = layout.columns
      gridContainer.value.style.gridTemplateRows = layout.rows
      gridContainer.value.style.gap = '20px'
    }
  })

  // 网格项目动画
  const items = gsap.utils.toArray('.sgm-grid-item-223')

  if (isScroll) {
    // 滚动触发：平滑淡入淡出
    gsap.to(items, {
      scale: 0.8,
      opacity: 0.5,
      duration: animationTime.value * 0.5,
      stagger: 0.02,
      ease: 'power1.in',
      onComplete: () => {
        gsap.to(items, {
          scale: 1,
          opacity: 1,
          duration: animationTime.value * 0.5,
          stagger: 0.02,
          ease: 'power1.out'
        })
      }
    })
  } else {
    // 点击触发：弹跳效果
    gsap.to(items, {
      scale: 0,
      rotate: -180,
      duration: animationTime.value * 0.4,
      stagger: 0.03,
      ease: 'power2.in',
      onComplete: () => {
        gsap.to(items, {
          scale: 1,
          rotate: 0,
          duration: animationTime.value * 0.6,
          stagger: 0.03,
          ease: 'elastic.out(1, 0.5)'
        })
      }
    })
  }

  // 特殊布局的额外动画
  if (layoutId === 'bento') {
    applyBentoLayout(items)
  } else if (layoutId === 'spiral') {
    applySpiralLayout(items)
  } else if (layoutId === 'asymmetric') {
    applyAsymmetricLayout(items)
  } else {
    resetGridLayout(items)
  }
}

// 便当盒布局
const applyBentoLayout = (items) => {
  const spans = [
    { row: 1, col: 1, rowspan: 2, colspan: 2 },
    { row: 1, col: 3, rowspan: 1, colspan: 2 },
    { row: 2, col: 3, rowspan: 2, colspan: 2 },
    { row: 3, col: 1, rowspan: 2, colspan: 2 },
    { row: 3, col: 3, rowspan: 1, colspan: 2 },
    { row: 4, col: 3, rowspan: 1, colspan: 2 }
  ]
  
  items.forEach((item, index) => {
    if (spans[index]) {
      const span = spans[index]
      item.style.gridRow = `${span.row} / span ${span.rowspan}`
      item.style.gridColumn = `${span.col} / span ${span.colspan}`
    } else {
      item.style.gridRow = 'auto'
      item.style.gridColumn = 'auto'
    }
  })
}

// 螺旋布局
const applySpiralLayout = (items) => {
  const positions = [
    { row: 2, col: 2 },
    { row: 2, col: 3 },
    { row: 3, col: 3 },
    { row: 3, col: 2 },
    { row: 3, col: 1 },
    { row: 2, col: 1 },
    { row: 1, col: 1 },
    { row: 1, col: 2 },
    { row: 1, col: 3 }
  ]
  
  items.forEach((item, index) => {
    if (positions[index]) {
      item.style.gridRow = positions[index].row
      item.style.gridColumn = positions[index].col
    } else {
      item.style.gridRow = 'auto'
      item.style.gridColumn = 'auto'
    }
  })
}

// 不对称布局
const applyAsymmetricLayout = (items) => {
  items.forEach((item, index) => {
    if (index % 2 === 0) {
      item.style.gridColumn = 'span 2'
    } else {
      item.style.gridColumn = 'span 1'
    }
  })
}

// 重置网格布局
const resetGridLayout = (items) => {
  items.forEach(item => {
    item.style.gridRow = 'auto'
    item.style.gridColumn = 'auto'
  })
}

const handleItemHover = (index) => {
  const item = document.querySelector(`.sgm-grid-item-223.sgm-item-${index}`)
  if (item) {
    gsap.to(item, {
      scale: 1.15,
      rotate: 5,
      zIndex: 10,
      duration: 0.3,
      ease: 'power2.out'
    })
  }
}

const createParticles = () => {
  const container = document.getElementById('sgm-particles-223')
  if (!container) return

  for (let i = 0; i < 40; i++) {
    const particle = document.createElement('div')
    particle.className = 'sgm-particle-223'
    particle.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      width: ${4 + Math.random() * 8}px;
      height: ${4 + Math.random() * 8}px;
      background: ${gridItems.value[Math.floor(Math.random() * gridItems.value.length)].color};
      border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
      opacity: ${0.3 + Math.random() * 0.5};
    `
    container.appendChild(particle)

    gsap.to(particle, {
      y: -80 - Math.random() * 120,
      x: (Math.random() - 0.5) * 100,
      opacity: 0,
      duration: 5 + Math.random() * 4,
      repeat: -1,
      delay: Math.random() * 5,
      ease: 'none'
    })

    gsap.to(particle, {
      rotate: 360,
      duration: 3 + Math.random() * 2,
      repeat: -1,
      delay: Math.random() * 2,
      ease: 'none'
    })
  }
}

const initScrollAnimations = () => {
  // 标题和副标题滚动绑定动画
  gsap.from('.sgm-title-223', {
    scrollTrigger: {
      trigger: '.sgm-scroll-grid-morph-223',
      start: 'top 85%',
      end: 'top 70%',
      scrub: 1
    },
    y: -100,
    opacity: 0,
    scale: 0.8,
    ease: 'power3.out'
  })

  gsap.from('.sgm-subtitle-223', {
    scrollTrigger: {
      trigger: '.sgm-scroll-grid-morph-223',
      start: 'top 80%',
      end: 'top 65%',
      scrub: 1
    },
    y: 60,
    opacity: 0,
    ease: 'power3.out'
  })

  // 网格容器入场动画
  gsap.from('.sgm-grid-container-223', {
    scrollTrigger: {
      trigger: '.sgm-grid-area-223',
      start: 'top 85%',
      end: 'top 60%',
      scrub: 1
    },
    y: 150,
    opacity: 0,
    scale: 0.9,
    rotateX: 15,
    ease: 'power3.out'
  })

  // 网格项目交错入场 - 波浪效果
  gsap.from('.sgm-grid-item-223', {
    scrollTrigger: {
      trigger: '.sgm-grid-container-223',
      start: 'top 80%',
      end: 'top 50%',
      scrub: 1
    },
    y: (index) => {
      const row = Math.floor(index / 4)
      return (row + 1) * 80
    },
    opacity: 0,
    scale: 0,
    rotate: -45,
    stagger: {
      each: 0.03,
      from: 'center'
    },
    ease: 'back.out(1.7)'
  })

  // 滚动控制布局切换 - 第一阶段：默认网格（0-16.6%）
  gsap.timeline({
    scrollTrigger: {
      trigger: '.sgm-scroll-grid-morph-223',
      start: 'top 70%',
      end: 'top 55%',
      scrub: 0.3,
      onUpdate: (self) => {
        const layoutIndex = 0
        if (lastLayoutIndex !== 0) {
          lastLayoutIndex = 0
          switchLayout(layouts[0].id, true)
        }
      }
    }
  })

  // 滚动控制布局切换 - 第二阶段：瀑布流（16.6-33.3%）
  gsap.timeline({
    scrollTrigger: {
      trigger: '.sgm-scroll-grid-morph-223',
      start: 'top 55%',
      end: 'top 40%',
      scrub: 0.3,
      onUpdate: (self) => {
        const layoutIndex = 1
        if (lastLayoutIndex !== 1) {
          lastLayoutIndex = 1
          switchLayout(layouts[1].id, true)
        }
      }
    }
  })

  // 滚动控制布局切换 - 第三阶段：便当盒（33.3-50%）
  gsap.timeline({
    scrollTrigger: {
      trigger: '.sgm-scroll-grid-morph-223',
      start: 'top 40%',
      end: 'center',
      scrub: 0.3,
      onUpdate: (self) => {
        const layoutIndex = 2
        if (lastLayoutIndex !== 2) {
          lastLayoutIndex = 2
          switchLayout(layouts[2].id, true)
        }
      }
    }
  })

  // 滚动控制布局切换 - 第四阶段：砖石（50-66.6%）
  gsap.timeline({
    scrollTrigger: {
      trigger: '.sgm-scroll-grid-morph-223',
      start: 'center',
      end: 'center 35%',
      scrub: 0.3,
      onUpdate: (self) => {
        const layoutIndex = 3
        if (lastLayoutIndex !== 3) {
          lastLayoutIndex = 3
          switchLayout(layouts[3].id, true)
        }
      }
    }
  })

  // 滚动控制布局切换 - 第五阶段：螺旋（66.6-83.3%）
  gsap.timeline({
    scrollTrigger: {
      trigger: '.sgm-scroll-grid-morph-223',
      start: 'center 35%',
      end: 'center 20%',
      scrub: 0.3,
      onUpdate: (self) => {
        const layoutIndex = 4
        if (lastLayoutIndex !== 4) {
          lastLayoutIndex = 4
          switchLayout(layouts[4].id, true)
        }
      }
    }
  })

  // 滚动控制布局切换 - 第六阶段：不对称（83.3-100%）
  gsap.timeline({
    scrollTrigger: {
      trigger: '.sgm-scroll-grid-morph-223',
      start: 'center 20%',
      end: 'bottom 30%',
      scrub: 0.3,
      onUpdate: (self) => {
        const layoutIndex = 5
        if (lastLayoutIndex !== 5) {
          lastLayoutIndex = 5
          switchLayout(layouts[5].id, true)
        }
      }
    }
  })

  // 网格容器视差效果
  gsap.to('.sgm-grid-container-223', {
    scrollTrigger: {
      trigger: '.sgm-scroll-grid-morph-223',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.5
    },
    y: -80,
    rotateX: 5,
    ease: 'none'
  })

  // 网格项目跟随滚动 - 波浪起伏
  gsap.to('.sgm-grid-item-223', {
    scrollTrigger: {
      trigger: '.sgm-scroll-grid-morph-223',
      start: 'top 70%',
      end: 'bottom 30%',
      scrub: 0.5
    },
    y: (index) => {
      const row = Math.floor(index / 4)
      const col = index % 4
      const wave = Math.sin(row * 0.8 + col * 0.6) * 15
      return wave
    },
    rotate: (index) => {
      return (index % 2 === 0 ? 3 : -3) * (Math.random() * 0.5 + 0.5)
    },
    ease: 'none'
  })

  // 网格项目缩放脉冲
  gsap.to('.sgm-grid-item-223', {
    scrollTrigger: {
      trigger: '.sgm-scroll-grid-morph-223',
      start: 'top 70%',
      end: 'bottom 30%',
      scrub: 0.5
    },
    scale: (index) => {
      return 1 + Math.sin(index * 0.5) * 0.05
    },
    ease: 'none'
  })

  // 网格项目颜色渐变动画
  gsap.to('.sgm-grid-item-223', {
    scrollTrigger: {
      trigger: '.sgm-scroll-grid-morph-223',
      start: 'top 70%',
      end: 'bottom 30%',
      scrub: 0.5
    },
    filter: (index) => {
      return `hue-rotate(${index * 22.5}deg) brightness(1 + ${Math.random() * 0.2})`
    },
    ease: 'none'
  })
}

onMounted(() => {
  createParticles()
  initScrollAnimations()

  // 初始化网格样式
  if (gridContainer.value) {
    gridContainer.value.style.gridTemplateColumns = layouts[0].columns
    gridContainer.value.style.gridTemplateRows = layouts[0].rows
    gridContainer.value.style.gap = '20px'
  }

  // 网格项目鼠标离开恢复
  document.querySelectorAll('.sgm-grid-item-223').forEach(item => {
    item.addEventListener('mouseleave', () => {
      gsap.to(item, {
        scale: 1,
        rotate: 0,
        zIndex: 1,
        duration: 0.3,
        ease: 'power2.out'
      })
    })
  })
})

onUnmounted(() => {
  ScrollTrigger.getAll().forEach(t => t.kill())
})
</script>

<style scoped>
/* GSAP opacity fix: ensure content is always visible */

.sgm-scroll-grid-morph-223 {
  min-height: 100vh;
  padding: 60px 20px;
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.sgm-container-223 {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 10;

  opacity: 1 !important;}

.sgm-header-223 {
  text-align: center;
  margin-bottom: 50px;

  opacity: 1 !important;}

.sgm-title-223 {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
  text-shadow: 0 0 60px rgba(59, 130, 246, 0.4);

  opacity: 1 !important;}

.sgm-subtitle-223 {
  font-size: 1.2rem;
  color: #94a3b8;
  letter-spacing: 0.1em;

  opacity: 1 !important;}

.sgm-grid-area-223 {
  width: 100%;
  margin: 0 auto 40px;

  opacity: 1 !important;}

.sgm-grid-container-223 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 20px;
  padding: 20px;
  background: rgba(15, 23, 42, 0.6);
  border-radius: 20px;
  border: 1px solid rgba(148, 163, 184, 0.1);
  backdrop-filter: blur(10px);
  min-height: 500px;
  transition: all 0.5s ease;

  opacity: 1 !important;}

.sgm-grid-item-223 {
  aspect-ratio: 1;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.sgm-grid-item-223::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.sgm-grid-item-223:hover::before {
  opacity: 1;
}

.sgm-grid-item-223:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
  z-index: 10;
}

.sgm-item-content-223 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  z-index: 1;
}

.sgm-item-number-223 {
  font-size: 1.5rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);

  opacity: 1 !important;}

.sgm-item-icon-223 {
  font-size: 2rem;
  filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.3));

  opacity: 1 !important;}

.sgm-particles-223 {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;

  opacity: 1 !important;}

.sgm-particle-223 {
  position: absolute;
  transition: all 0.5s ease;
}

@media (max-width: 768px) {
  .sgm-title-223 {
    font-size: 2rem;
  
  opacity: 1 !important;}

  .sgm-subtitle-223 {
    font-size: 1rem;
  
  opacity: 1 !important;}

  .sgm-grid-container-223 {
    grid-template-columns: repeat(2, 1fr) !important;
    grid-template-rows: auto !important;
    min-height: 400px;
  
  opacity: 1 !important;}
}
</style>
