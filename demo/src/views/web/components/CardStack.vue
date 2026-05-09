<template>
  <div class="cstack-section-70" ref="sectionRoot">
    <!-- 动态背景 -->
    <div class="cs-background-70">
      <div class="cs-grid-70"></div>
      <div class="cs-glow-orbs-70">
        <div class="cs-glow-70 cs-glow-1-70"></div>
        <div class="cs-glow-70 cs-glow-2-70"></div>
        <div class="cs-glow-70 cs-glow-3-70"></div>
      </div>
    </div>

    <!-- 粒子系统 -->
    <div class="cs-particles-70">
      <div v-for="i in 40" :key="i" class="cs-particle-70"></div>
    </div>

    <!-- 标题区域 -->
    <div class="cs-header-70">
      <div class="cs-title-container-70">
        <h2 class="cs-title-70">
          <span class="cs-title-text-70">卡片堆叠</span>
          <span class="cs-title-glow-70"></span>
        </h2>
        <p class="cs-subtitle-70">INTERACTIVE CARD STACK</p>
      </div>
      <div class="cs-title-line-70"></div>
    </div>

    <!-- 卡片堆叠容器 -->
    <div class="cstack-container-70" ref="stackContainer">
      <div
        v-for="(card, index) in cards"
        :key="index"
        :ref="(el: any) => { if (el) cardRefs[index] = el }"
        class="cstack-card-70"
        :class="{ 'cs-active-70': activeIndex === index }"
        :data-index="index"
        @click="activateCard(index)"
        @mouseenter="handleCardHover(index)"
        @mouseleave="handleCardLeave(index)"
      >
        <!-- 卡片光效 -->
        <div class="cs-card-glow-70" :class="`cs-glow-${(index % 5) + 1}-70`"></div>

        <!-- 卡片边框动画 -->
        <div class="cs-card-border-70"></div>

        <!-- 卡片内容 -->
        <div class="cstack-content-70">
          <!-- 图片区域 -->
          <div class="cstack-image-70" :style="{ backgroundImage: `url(${card.image})` }">
            <div class="cstack-image-overlay-70"></div>
            <!-- 动态序号 -->
            <div class="cstack-number-70">
              <span class="cs-number-bg-70">{{ String(index + 1).padStart(2, '0') }}</span>
              <div class="cs-number-ring-70">
                <div class="cs-ring-segment-70"></div>
                <div class="cs-ring-segment-70"></div>
              </div>
            </div>
            <!-- 进度指示器 -->
            <div class="cs-progress-bar-70">
              <div class="cs-progress-fill-70" :style="{ width: progress + '%' }"></div>
            </div>
          </div>

          <!-- 信息区域 -->
          <div class="cstack-info-70">
            <h3 class="cstack-title-70">
              <span class="cs-title-gradient-70">{{ card.title }}</span>
            </h3>
            <p class="cstack-desc-70">{{ card.description }}</p>
            <div class="cstack-tags-70">
              <span
                v-for="(tag, i) in card.tags"
                :key="i"
                class="cstack-tag-70"
                :style="{ '--delay': `${i * 0.08}s` }"
              >
                <span class="cs-tag-dot-70"></span>
                {{ tag }}
              </span>
            </div>
          </div>
        </div>

        <!-- 装饰元素 -->
        <div class="cs-card-decor-70">
          <div class="cs-decor-corner-70 cs-corner-tl-70"></div>
          <div class="cs-decor-corner-70 cs-corner-tr-70"></div>
          <div class="cs-decor-corner-70 cs-corner-bl-70"></div>
          <div class="cs-decor-corner-70 cs-corner-br-70"></div>
        </div>
      </div>
    </div>

    <!-- 控制按钮 -->
    <div class="cs-controls-70">
      <button class="cs-btn-70 cs-btn-prev-70" @click="prevCard" :disabled="activeIndex === 0">
        <span class="cs-btn-icon-70">←</span>
        <span class="cs-btn-text-70">上一个</span>
      </button>

      <!-- 分页指示器 -->
      <div class="cs-dots-70">
        <div
          v-for="(card, index) in cards"
          :key="index"
          class="cs-dot-70"
          :class="{ 'cs-dot-active-70': activeIndex === index }"
          @click="activateCard(index)"
        >
          <span class="cs-dot-fill-70"></span>
        </div>
      </div>

      <button class="cs-btn-70 cs-btn-next-70" @click="nextCard" :disabled="activeIndex === cards.length - 1">
        <span class="cs-btn-text-70">下一个</span>
        <span class="cs-btn-icon-70">→</span>
      </button>
    </div>

    <!-- 滚动提示 -->
    <div class="cs-scroll-hint-70">
      <div class="cs-hint-text-70">滑动或点击卡片切换</div>
      <div class="cs-hint-arrow-70">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const sectionRoot = ref<HTMLElement>()
const stackContainer = ref<HTMLElement>()
const activeIndex = ref(0)
const cardRefs = ref<HTMLElement[]>([])
const progress = ref(0)
let isAnimating = false

const cards = [
  {
    title: '创意设计',
    description: '突破传统思维边界，创造独特视觉体验。通过深入的用户研究和创意洞察，将抽象概念转化为令人惊艳的设计作品，为品牌注入强大的视觉竞争力。',
    image: new URL('@/assets/image/1.png', import.meta.url).href,
    tags: ['UI设计', '品牌视觉', '插画艺术']
  },
  {
    title: '技术开发',
    description: '运用前沿技术栈构建稳定高效的系统架构。从代码质量到性能优化，从前端交互到后端服务，全方位确保产品的流畅运行和卓越体验。',
    image: new URL('@/assets/image/2.png', import.meta.url).href,
    tags: ['前端开发', '后端架构', 'DevOps']
  },
  {
    title: '数据分析',
    description: '深入挖掘数据价值，通过科学分析为商业决策提供有力支撑。利用先进的数据挖掘技术和可视化工具，将复杂数据转化为清晰洞察。',
    image: new URL('@/assets/image/3.png', import.meta.url).href,
    tags: ['大数据', 'AI算法', '可视化']
  },
  {
    title: '用户体验',
    description: '以用户为中心的设计理念，打造符合直觉和习惯的交互方式。通过持续的用户研究和可用性测试，不断优化产品体验。',
    image: new URL('@/assets/image/4.png', import.meta.url).href,
    tags: ['交互设计', '可用性', '用户研究']
  },
  {
    title: '产品管理',
    description: '从需求分析到产品上线，全流程把控产品质量和交付进度。运用敏捷方法论，快速响应市场变化，持续迭代优化。',
    image: new URL('@/assets/image/5.png', import.meta.url).href,
    tags: ['敏捷开发', '产品规划', '迭代优化']
  }
]

let ctx: gsap.Context
let scrollTimeline: gsap.Timeline | null = null

const activateCard = (index: number) => {
  if (isAnimating || index === activeIndex.value) return
  isAnimating = true

  const direction = index > activeIndex.value ? 1 : -1
  activeIndex.value = index

  updateCardStack(direction)
  animateProgress()

  setTimeout(() => {
    isAnimating = false
  }, 700)
}

const prevCard = () => {
  if (activeIndex.value > 0) {
    activateCard(activeIndex.value - 1)
  }
}

const nextCard = () => {
  if (activeIndex.value < cards.length - 1) {
    activateCard(activeIndex.value + 1)
  }
}

const updateCardStack = (direction: number) => {
  cardRefs.value.forEach((card, i) => {
    if (!card) return

    const isActive = i === activeIndex.value
    const distance = i - activeIndex.value
    const absDistance = Math.abs(distance)

    // 计算卡片位置
    const yOffset = isActive ? 0 : distance * 50
    const scale = isActive ? 1 : 1 - Math.min(absDistance * 0.08, 0.4)
    const opacity = isActive ? 1 : Math.max(0, 1 - absDistance * 0.4)
    const rotateZ = isActive ? 0 : distance * 3
    const brightness = isActive ? 1 : Math.max(0.4, 1 - absDistance * 0.3)
    const blur = isActive ? 0 : absDistance * 2

    // 卡片动画
    gsap.to(card, {
      y: yOffset,
      scale: scale,
      opacity: opacity,
      rotationZ: rotateZ,
      filter: `brightness(${brightness}) blur(${blur}px)`,
      zIndex: cards.length - absDistance,
      duration: 0.6,
      ease: 'elastic.out(1, 0.75)'
    })

    // 光效动画
    const glow = card.querySelector('.cs-card-glow-70') as HTMLElement
    if (glow) {
      gsap.to(glow, {
        scale: isActive ? 1.3 : 1,
        opacity: isActive ? 0.6 : 0,
        duration: 0.5,
        ease: 'power2.out'
      })
    }

    // 边框动画
    const border = card.querySelector('.cs-card-border-70') as HTMLElement
    if (border) {
      gsap.to(border, {
        opacity: isActive ? 1 : 0.3,
        width: isActive ? '100%' : '0%',
        duration: 0.5,
        ease: 'power2.out'
      })
    }

    // 内容动画
    const title = card.querySelector('.cstack-title-70') as HTMLElement
    const desc = card.querySelector('.cstack-desc-70') as HTMLElement
    const tags = card.querySelectorAll('.cstack-tag-70')

    if (isActive) {
      // 展开内容
      gsap.to([title, desc], {
        x: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        delay: 0.15,
        ease: 'power3.out'
      })

      gsap.to(tags, {
        x: 0,
        opacity: 1,
        duration: 0.4,
        stagger: 0.06,
        delay: 0.25,
        ease: 'power3.out'
      })
    } else {
      // 收起内容
      gsap.to([title, desc], {
        x: -40,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in'
      })

      gsap.to(tags, {
        x: -40,
        opacity: 0,
        duration: 0.3,
        stagger: 0.04,
        ease: 'power2.in'
      })
    }

    // 序号环动画
    const ring = card.querySelector('.cs-number-ring-70') as HTMLElement
    if (ring) {
      gsap.to(ring, {
        rotation: isActive ? 360 : 0,
        scale: isActive ? 1.1 : 1,
        duration: 0.6,
        ease: 'elastic.out(1, 0.7)'
      })
    }

    // 装饰角动画
    const corners = card.querySelectorAll('.cs-decor-corner-70')
    if (isActive) {
      gsap.to(corners, {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        stagger: 0.05,
        ease: 'power2.out'
      })
    } else {
      gsap.to(corners, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in'
      })
    }
  })

  // 更新分页点
  animateDots()
}

const animateProgress = () => {
  const targetProgress = ((activeIndex.value + 1) / cards.length) * 100
  gsap.to({ value: progress.value }, {
    value: targetProgress,
    duration: 0.5,
    ease: 'power2.out',
    onUpdate: function() {
      progress.value = this.targets()[0].value
    }
  })
}

const animateDots = () => {
  const dots = document.querySelectorAll('.cs-dot-70') as NodeListOf<HTMLElement>
  dots.forEach((dot, i) => {
    const isActive = i === activeIndex.value
    const fill = dot.querySelector('.cs-dot-fill-70') as HTMLElement

    if (isActive) {
      gsap.to(dot, {
        scale: 1.2,
        borderColor: '#38ef7d',
        duration: 0.3,
        ease: 'back.out(1.7)'
      })
      gsap.to(fill, {
        width: '100%',
        duration: 0.3,
        ease: 'power2.out'
      })
    } else {
      gsap.to(dot, {
        scale: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        duration: 0.3,
        ease: 'power2.out'
      })
      gsap.to(fill, {
        width: '0%',
        duration: 0.3,
        ease: 'power2.out'
      })
    }
  })
}

const handleCardHover = (index: number) => {
  if (index !== activeIndex.value || isAnimating) return

  const card = cardRefs.value[index]
  if (!card) return

  gsap.to(card, {
    scale: 1.02,
    rotationZ: -1,
    duration: 0.3,
    ease: 'power2.out'
  })

  gsap.to(card.querySelector('.cs-card-glow-70'), {
    scale: 1.4,
    opacity: 0.7,
    duration: 0.3,
    ease: 'power2.out'
  })
}

const handleCardLeave = (index: number) => {
  if (index !== activeIndex.value || isAnimating) return

  const card = cardRefs.value[index]
  if (!card) return

  gsap.to(card, {
    scale: 1,
    rotationZ: 0,
    duration: 0.3,
    ease: 'power2.out'
  })

  gsap.to(card.querySelector('.cs-card-glow-70'), {
    scale: 1.3,
    opacity: 0.6,
    duration: 0.3,
    ease: 'power2.out'
  })
}

const animateParticles = () => {
  gsap.utils.toArray('.cs-particle-70').forEach((particle: any, i) => {
    gsap.to(particle, {
      y: 'random(-100, -20)',
      x: 'random(-30, 30)',
      opacity: 'random(0.1, 0.6)',
      scale: 'random(0.5, 1.5)',
      duration: 'random(4, 8)',
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: i * 0.03
    })
  })
}

const animateGlowOrbs = () => {
  gsap.to('.cs-glow-1-70', {
    x: '+=40',
    y: '-=30',
    scale: 'random(1, 1.4)',
    duration: 12,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  })

  gsap.to('.cs-glow-2-70', {
    x: '-=30',
    y: '+=40',
    scale: 'random(1, 1.3)',
    duration: 10,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  })

  gsap.to('.cs-glow-3-70', {
    x: '+=20',
    y: '+=20',
    scale: 'random(1, 1.5)',
    duration: 14,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  })
}

const animateGrid = () => {
  gsap.to('.cs-grid-70', {
    backgroundPosition: '0% 100%',
    duration: 20,
    repeat: -1,
    ease: 'none'
  })
}

const setupScrollAnimation = () => {
  if (!stackContainer.value) return

  scrollTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: stackContainer.value,
      start: 'top center',
      end: 'bottom center',
      scrub: 0.3
    }
  })

  // 滚动时触发卡片切换
  scrollTimeline.to({}, {
    duration: 1,
    onUpdate: function() {
      const progress = this.progress()
      const newIndex = Math.floor(progress * cards.length)
      if (newIndex !== activeIndex.value && newIndex >= 0 && newIndex < cards.length) {
        activateCard(newIndex)
      }
    }
  })
}

onMounted(() => {
  ctx = gsap.context(() => {
    // 标题入场动画
    gsap.from('.cs-title-text-70', {
      y: 80,
      opacity: 0,
      scale: 0.8,
      rotationX: -15,
      duration: 1.2,
      ease: 'elastic.out(1, 0.8)'
    })

    gsap.from('.cs-title-glow-70', {
      x: '-200%',
      duration: 2,
      ease: 'power2.out'
    })

    gsap.from('.cs-subtitle-70', {
      y: 40,
      opacity: 0,
      duration: 0.8,
      delay: 0.2,
      ease: 'power3.out'
    })

    // 标题分割线动画
    gsap.from('.cs-title-line-70', {
      width: 0,
      duration: 0.8,
      delay: 0.4,
      ease: 'power2.out'
    })

    // 卡片堆叠入场动画
    gsap.from('.cstack-card-70', {
      scrollTrigger: {
        trigger: '.cstack-container-70',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      y: 150,
      scale: 0.7,
      opacity: 0,
      rotateZ: 15,
      stagger: 0.15,
      duration: 1,
      ease: 'power3.out'
    })

    // 控制按钮入场
    gsap.from('.cs-btn-70', {
      scrollTrigger: {
        trigger: '.cs-controls-70',
        start: 'top 90%',
        toggleActions: 'play none none reverse'
      },
      y: 50,
      opacity: 0,
      scale: 0.9,
      stagger: 0.1,
      duration: 0.7,
      ease: 'back.out(1.7)'
    })

    // 分页点入场
    gsap.from('.cs-dot-70', {
      scrollTrigger: {
        trigger: '.cs-dots-70',
        start: 'top 90%',
        toggleActions: 'play none none reverse'
      },
      scale: 0,
      opacity: 0,
      stagger: 0.08,
      duration: 0.5,
      ease: 'back.out(1.7)'
    })

    // 滚动提示入场
    gsap.from('.cs-scroll-hint-70', {
      scrollTrigger: {
        trigger: '.cs-scroll-hint-70',
        start: 'top 95%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power2.out'
    })

    // 滚动提示箭头动画
    gsap.to('.cs-hint-arrow-70 span', {
      y: -10,
      opacity: 0,
      stagger: 0.15,
      duration: 0.8,
      repeat: -1,
      ease: 'power2.out'
    })

    // 启动背景动画
    animateParticles()
    animateGlowOrbs()
    animateGrid()

    // 初始化卡片位置
    setTimeout(() => {
      updateCardStack(1)
      animateProgress()
    }, 500)

    // 设置滚动动画
    setupScrollAnimation()

  }, sectionRoot.value)
})

onUnmounted(() => {
  ctx?.revert()
  scrollTimeline?.kill()
})
</script>

<style scoped lang="scss">
.cstack-section-70 {
  position: relative;
  min-height: 100vh;
  padding: 80px 40px;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 50%, #0f0f2f 100%);
  overflow: hidden;

  opacity: 1 !important;}

/* 动态背景 */
.cs-background-70 {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.cs-grid-70 {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(17, 153, 142, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(17, 153, 142, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
}

.cs-glow-orbs-70 {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.cs-glow-70 {
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  filter: blur(100px);
  pointer-events: none;

  opacity: 1 !important;}

.cs-glow-1-70 {
  top: -10%;
  left: -10%;
  background: radial-gradient(circle, rgba(17, 153, 142, 0.2), transparent);

  opacity: 1 !important;}

.cs-glow-2-70 {
  bottom: -10%;
  right: -10%;
  background: radial-gradient(circle, rgba(56, 239, 125, 0.15), transparent);

  opacity: 1 !important;}

.cs-glow-3-70 {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(233, 69, 96, 0.1), transparent);

  opacity: 1 !important;}

/* 粒子系统 */
.cs-particles-70 {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;

  opacity: 1 !important;}

.cs-particle-70 {
  position: absolute;
  width: 3px;
  height: 3px;
  background: radial-gradient(circle, rgba(56, 239, 125, 0.8), transparent);
  border-radius: 50%;
  top: 'random(0, 100%)';
  left: 'random(0, 100%)';

  opacity: 1 !important;}

/* 标题区域 */
.cs-header-70 {
  position: relative;
  text-align: center;
  margin-bottom: 60px;
  z-index: 1;

  opacity: 1 !important;}

.cs-title-container-70 {
  display: inline-block;
  position: relative;
}

.cs-title-70 {
  position: relative;
  display: inline-block;
  font-size: 3.5rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 12px;
  overflow: hidden;

  opacity: 1 !important;}

.cs-title-text-70 {
  position: relative;
  z-index: 2;
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 50%, #11998e 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 5s ease infinite;

  opacity: 1 !important;}

@keyframes gradientShift {
  0%, 100% { background-position: 0% center; }
  50% { background-position: 100% center; }
}

.cs-title-glow-70 {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  z-index: 3;

  opacity: 1 !important;}

.cs-subtitle-70 {
  display: block;
  font-size: 0.85rem;
  color: rgba(56, 239, 125, 0.8);
  letter-spacing: 8px;
  text-transform: uppercase;
  font-weight: 600;

  opacity: 1 !important;}

.cs-title-line-70 {
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #38ef7d, transparent);
  margin: 20px auto 0;

  opacity: 1 !important;}

/* 卡片容器 */
.cstack-container-70 {
  position: relative;
  max-width: 520px;
  height: 700px;
  margin: 0 auto;
  perspective: 1500px;
  z-index: 1;

  opacity: 1 !important;}

/* 卡片样式 */
.cstack-card-70 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  transform-style: preserve-3d;

  opacity: 1 !important;}

.cstack-card-70.cs-active-70 {
  cursor: default;
}

/* 卡片光效 */
.cs-card-glow-70 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 140%;
  height: 140%;
  opacity: 0;
  pointer-events: none;
  filter: blur(60px);
}

.cs-glow-1-70 {
  background: radial-gradient(circle, rgba(17, 153, 142, 0.3), transparent 70%);

  opacity: 1 !important;}

.cs-glow-2-70 {
  background: radial-gradient(circle, rgba(56, 239, 125, 0.3), transparent 70%);

  opacity: 1 !important;}

.cs-glow-3-70 {
  background: radial-gradient(circle, rgba(233, 69, 96, 0.3), transparent 70%);

  opacity: 1 !important;}

.cs-glow-4-70 {
  background: radial-gradient(circle, rgba(147, 51, 234, 0.3), transparent 70%);

  opacity: 1 !important;}

.cs-glow-5-70 {
  background: radial-gradient(circle, rgba(249, 115, 22, 0.3), transparent 70%);

  opacity: 1 !important;}

/* 卡片边框 */
.cs-card-border-70 {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  width: 0;
  background: linear-gradient(90deg, #11998e, #38ef7d);
  opacity: 0;
}

/* 卡片内容 */
.cstack-content-70 {
  position: relative;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(15px);
  border-radius: 28px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 25px 80px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);

  opacity: 1 !important;}

/* 图片区域 */
.cstack-image-70 {
  position: relative;
  width: 100%;
  height: 340px;
  background-size: cover;
  background-position: center;
  overflow: hidden;

  opacity: 1 !important;}

.cstack-image-overlay-70 {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.4) 100%);

  opacity: 1 !important;}

/* 序号 */
.cstack-number-70 {
  position: absolute;
  top: 24px;
  right: 24px;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;

  opacity: 1 !important;}

.cs-number-bg-70 {
  position: relative;
  z-index: 2;
  font-size: 1.6rem;
  font-weight: 900;
  color: #38ef7d;
  text-shadow: 0 2px 10px rgba(56, 239, 125, 0.5);

  opacity: 1 !important;}

.cs-number-ring-70 {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 2px solid rgba(56, 239, 125, 0.3);
  border-radius: 12px;

  opacity: 1 !important;}

.cs-ring-segment-70 {
  position: absolute;
  inset: -2px;
  border: 2px solid transparent;
  border-radius: 12px;

  &:first-child {
    border-top-color: #38ef7d;
    border-right-color: #38ef7d;
    transform: rotate(-45deg);
  
  opacity: 1 !important;}

  &:last-child {
    border-bottom-color: #38ef7d;
    border-left-color: #38ef7d;
    transform: rotate(-45deg);
  }
}

/* 进度条 */
.cs-progress-bar-70 {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);

  opacity: 1 !important;}

.cs-progress-fill-70 {
  height: 100%;
  background: linear-gradient(90deg, #11998e, #38ef7d);
  transition: width 0.5s ease;

  opacity: 1 !important;}

/* 信息区域 */
.cstack-info-70 {
  padding: 36px 32px 32px;

  opacity: 1 !important;}

.cstack-title-70 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 16px;

  opacity: 1 !important;}

.cs-title-gradient-70 {
  background: linear-gradient(135deg, #38ef7d, #11998e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  opacity: 1 !important;}

.cstack-desc-70 {
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.8;
  margin-bottom: 24px;
  font-size: 1rem;

  opacity: 1 !important;}

/* 标签 */
.cstack-tags-70 {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.cstack-tag-70 {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  background: rgba(17, 153, 142, 0.15);
  border-radius: 25px;
  font-size: 0.85rem;
  color: #38ef7d;
  border: 1px solid rgba(17, 153, 142, 0.3);
  backdrop-filter: blur(5px);
  animation: fadeInUp 0.5s ease backwards;
  animation-delay: var(--delay, 0s);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(17, 153, 142, 0.25);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(17, 153, 142, 0.3);
  
  opacity: 1 !important;}
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.cs-tag-dot-70 {
  width: 6px;
  height: 6px;
  background: #38ef7d;
  border-radius: 50%;
  box-shadow: 0 0 10px #38ef7d;

  opacity: 1 !important;}

/* 装饰角 */
.cs-card-decor-70 {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.cs-decor-corner-70 {
  position: absolute;
  width: 20px;
  height: 20px;
  border-color: rgba(56, 239, 125, 0.5);
  border-style: solid;
  border-width: 0;

  opacity: 1 !important;}

.cs-corner-tl-70 {
  top: 12px;
  left: 12px;
  border-top-width: 2px;
  border-left-width: 2px;

  opacity: 1 !important;}

.cs-corner-tr-70 {
  top: 12px;
  right: 12px;
  border-top-width: 2px;
  border-right-width: 2px;

  opacity: 1 !important;}

.cs-corner-bl-70 {
  bottom: 12px;
  left: 12px;
  border-bottom-width: 2px;
  border-left-width: 2px;

  opacity: 1 !important;}

.cs-corner-br-70 {
  bottom: 12px;
  right: 12px;
  border-bottom-width: 2px;
  border-right-width: 2px;

  opacity: 1 !important;}

/* 控制区域 */
.cs-controls-70 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  margin-top: 50px;
  position: relative;
  z-index: 1;
}

/* 按钮 */
.cs-btn-70 {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 16px 40px;
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  border: none;
  border-radius: 35px;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 30px rgba(17, 153, 142, 0.4);
  overflow: hidden;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }

  &:not(:disabled) {
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      transition: left 0.5s ease;
    }

    &:hover::before {
      left: 100%;
    }

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(17, 153, 142, 0.5);
    }

    &:active {
      transform: translateY(-2px);
    }
  }
}

.cs-btn-icon-70 {
  font-size: 1.2rem;
  transition: transform 0.3s ease;

  opacity: 1 !important;}

.cs-btn-70:hover .cs-btn-icon-70 {
  transform: scale(1.2);
}

/* 分页点 */
.cs-dots-70 {
  display: flex;
  gap: 10px;
}

.cs-dot-70 {
  position: relative;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;

  &:hover {
    border-color: rgba(56, 239, 125, 0.6);
  
  opacity: 1 !important;}
}

.cs-dot-active-70 {
  border-color: #38ef7d;

  opacity: 1 !important;}

.cs-dot-fill-70 {
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 100%;
  background: #38ef7d;
  border-radius: 50%;
  transition: width 0.3s ease;

  opacity: 1 !important;}

/* 滚动提示 */
.cs-scroll-hint-70 {
  text-align: center;
  margin-top: 40px;
  opacity: 0.7;
  z-index: 1;
}

.cs-hint-text-70 {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 12px;
  letter-spacing: 2px;

  opacity: 1 !important;}

.cs-hint-arrow-70 {
  display: flex;
  justify-content: center;
  gap: 6px;

  span {
    display: block;
    width: 4px;
    height: 4px;
    background: #38ef7d;
    border-radius: 50%;
  
  opacity: 1 !important;}
}

/* 响应式设计 */
@media (max-width: 768px) {
  .cstack-section-70 {
    padding: 60px 20px;
  
  opacity: 1 !important;}

  .cs-title-70 {
    font-size: 2.4rem;
  
  opacity: 1 !important;}

  .cs-subtitle-70 {
    letter-spacing: 4px;
    font-size: 0.75rem;
  
  opacity: 1 !important;}

  .cstack-container-70 {
    height: 600px;
    max-width: 400px;
  
  opacity: 1 !important;}

  .cstack-image-70 {
    height: 280px;
  
  opacity: 1 !important;}

  .cstack-info-70 {
    padding: 28px 24px 24px;
  
  opacity: 1 !important;}

  .cstack-title-70 {
    font-size: 1.4rem;
  
  opacity: 1 !important;}

  .cstack-desc-70 {
    font-size: 0.9rem;
  
  opacity: 1 !important;}

  .cs-controls-70 {
    flex-direction: column;
    gap: 20px;
  }

  .cs-btn-70 {
    width: 100%;
    justify-content: center;
  
  opacity: 1 !important;}

  .cs-number-70 {
    width: 56px;
    height: 56px;
  
  opacity: 1 !important;}

  .cs-number-bg-70 {
    font-size: 1.4rem;
  
  opacity: 1 !important;}
}
</style>
