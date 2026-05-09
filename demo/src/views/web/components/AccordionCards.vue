<template>
  <div class="accordion-section-65" ref="sectionRoot">
    <!-- 背景粒子效果 -->
    <div class="ac-particles-65">
      <div v-for="i in 30" :key="i" class="ac-particle-65"></div>
    </div>

    <!-- 装饰性光晕 -->
    <div class="ac-glow-orb-65 ac-glow-1-65"></div>
    <div class="ac-glow-orb-65 ac-glow-2-65"></div>

    <div class="ac-header-65">
      <h2 class="ac-title-65">
        <span class="ac-title-bg-65">手风琴卡片</span>
        <span class="ac-title-shimmer-65"></span>
      </h2>
      <p class="ac-subtitle-65">INTERACTIVE ACCORDION</p>
      <div class="ac-title-line-65"></div>
    </div>

    <div class="accordion-container-65">
      <div
        v-for="(item, index) in items"
        :key="index"
        ref="cards"
        class="accordion-card-65"
        :class="{ 'ac-active-65': activeIndex === index }"
        @click="toggleCard(index)"
        @mouseenter="handleCardHover(index)"
        @mouseleave="handleCardLeave(index)"
      >
        <!-- 卡片光效背景 -->
        <div class="ac-card-glow-65" :class="`ac-glow-${index + 1}-65`"></div>

        <!-- 卡片边框动画 -->
        <div class="ac-card-border-65"></div>

        <div class="ac-card-header-65">
          <!-- 动态序号 -->
          <div class="ac-card-number-65">
            <span class="ac-number-bg-65">{{ String(index + 1).padStart(2, '0') }}</span>
            <span class="ac-number-ring-65"></span>
          </div>
          <h3 class="ac-card-title-65">{{ item.title }}</h3>
          <!-- 自定义箭头 -->
          <div class="ac-arrow-65" :class="{ 'ac-arrow-rotate-65': activeIndex === index }">
            <span></span>
            <span></span>
          </div>
        </div>

        <div class="ac-card-content-65" ref="cardContent">
          <div class="ac-content-inner-65">
            <!-- 图片容器带动画 -->
            <div class="ac-content-image-wrapper-65">
              <div class="ac-content-image-65" :style="{ backgroundImage: `url(${item.image})` }"></div>
              <div class="ac-image-overlay-65"></div>
            </div>

            <p class="ac-content-text-65">{{ item.description }}</p>

            <div class="ac-content-features-65">
              <span
                v-for="(feature, i) in item.features"
                :key="i"
                class="ac-feature-tag-65"
                :style="{ '--delay': `${i * 0.1}s` }"
              >
                <span class="ac-feature-dot-65"></span>
                {{ feature }}
              </span>
            </div>

            <!-- 底部装饰线 -->
            <div class="ac-content-line-65"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="ac-controls-65">
      <button class="ac-btn-65 ac-btn-primary-65" @click="expandAll">
        <span class="ac-btn-icon-65">▶</span>
        全部展开
      </button>
      <button class="ac-btn-65 ac-btn-secondary-65" @click="collapseAll">
        <span class="ac-btn-icon-65">◀</span>
        全部收起
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const sectionRoot = ref<HTMLElement>()
const activeIndex = ref(0)
const cards = ref<HTMLElement[]>([])
const cardContent = ref<HTMLElement[]>([])

const items = [
  {
    title: '产品设计',
    image: new URL('@/assets/image/1.png', import.meta.url).href,
    description: '创造美观且实用的用户体验，注重细节和交互设计，打造令人印象深刻的产品界面。通过深入研究用户需求，将创意转化为可落地的设计方案。',
    features: ['用户研究', '原型设计', '视觉设计', '交互设计']
  },
  {
    title: '技术开发',
    image: new URL('@/assets/image/2.png', import.meta.url).href,
    description: '采用最新的技术栈和开发方法，构建高性能、可扩展的应用程序。专注于代码质量和开发效率，确保产品稳定运行。',
    features: ['前端开发', '后端架构', '性能优化', 'DevOps']
  },
  {
    title: '数据分析',
    image: new URL('@/assets/image/3.png', import.meta.url).href,
    description: '深入挖掘数据价值，提供有价值的洞察和建议，助力业务决策。运用先进的数据分析方法，发现隐藏的商业机会。',
    features: ['数据可视化', '趋势分析', '智能预测', '数据建模']
  },
  {
    title: '营销策略',
    image: new URL('@/assets/image/4.png', import.meta.url).href,
    description: '制定全面的营销计划，提升品牌知名度和用户参与度，实现商业目标。结合市场趋势和用户行为，制定精准营销方案。',
    features: ['品牌推广', '内容营销', '增长黑客', '用户运营']
  },
  {
    title: '客户服务',
    image: new URL('@/assets/image/5.png', import.meta.url).href,
    description: '提供优质的客户支持，及时解决问题，提升客户满意度和忠诚度。建立完善的服务体系，打造卓越的客户体验。',
    features: ['快速响应', '问题解决', '持续跟进', '满意度调查']
  }
]

let ctx: gsap.Context
let hoverTimeline: gsap.Timeline | null = null

const toggleCard = (index: number) => {
  const prevIndex = activeIndex.value
  activeIndex.value = activeIndex.value === index ? -1 : index

  cards.value.forEach((card, i) => {
    const content = card.querySelector('.ac-card-content-65') as HTMLElement
    const arrow = card.querySelector('.ac-arrow-65') as HTMLElement
    const inner = card.querySelector('.ac-content-inner-65') as HTMLElement
    const glow = card.querySelector('.ac-card-glow-65') as HTMLElement

    if (i === activeIndex.value) {
      // 展开动画 - 使用弹性和透明度结合
      gsap.set(content, { height: 'auto' })
      const height = content.offsetHeight
      gsap.set(content, { height: 0, opacity: 0 })

      const tl = gsap.timeline()
      tl.to(content, {
        height: height,
        opacity: 1,
        duration: 0.6,
        ease: 'elastic.out(1, 0.75)'
      })
      .fromTo(inner,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
        '-=0.3'
      )

      // 箭头旋转
      gsap.to(arrow, { rotation: 180, duration: 0.4, ease: 'back.out(1.7)' })

      // 光效增强
      gsap.to(glow, {
        scale: 1.2,
        opacity: 0.6,
        duration: 0.4,
        ease: 'power2.out'
      })

      // 特征标签动画
      gsap.fromTo(card.querySelectorAll('.ac-feature-tag-65'),
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.3, stagger: 0.08, ease: 'power2.out' }
      )
    } else {
      // 收起动画
      gsap.to(content, {
        height: 0,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.inOut'
      })
      gsap.to(arrow, { rotation: 0, duration: 0.3, ease: 'power2.out' })
      gsap.to(glow, {
        scale: 1,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out'
      })
    }

    // 非激活卡片的边框动画
    if (i !== activeIndex.value) {
      gsap.to(card.querySelector('.ac-card-border-65'), {
        width: '0%',
        duration: 0.3,
        ease: 'power2.out'
      })
    }
  })

  // 激活卡片边框动画
  if (activeIndex.value !== -1) {
    const activeCard = cards.value[activeIndex.value]
    gsap.to(activeCard.querySelector('.ac-card-border-65'), {
      width: '100%',
      duration: 0.6,
      ease: 'elastic.out(1, 0.6)'
    })
  }
}

const handleCardHover = (index: number) => {
  const card = cards.value[index]
  if (!card) return

  // 悬停时的细微动画
  gsap.to(card, {
    scale: 1.01,
    duration: 0.3,
    ease: 'power2.out'
  })

  gsap.to(card.querySelector('.ac-card-glow-65'), {
    opacity: 0.4,
    scale: 1.05,
    duration: 0.3,
    ease: 'power2.out'
  })
}

const handleCardLeave = (index: number) => {
  const card = cards.value[index]
  if (!card) return

  gsap.to(card, {
    scale: 1,
    duration: 0.3,
    ease: 'power2.out'
  })

  if (activeIndex.value !== index) {
    gsap.to(card.querySelector('.ac-card-glow-65'), {
      opacity: 0,
      scale: 1,
      duration: 0.3,
      ease: 'power2.out'
    })
  }
}

const expandAll = () => {
  cards.value.forEach((card, i) => {
    setTimeout(() => {
      const index = activeIndex.value
      activeIndex.value = i
      const content = card.querySelector('.ac-card-content-65') as HTMLElement
      const arrow = card.querySelector('.ac-arrow-65') as HTMLElement
      const inner = card.querySelector('.ac-content-inner-65') as HTMLElement
      const glow = card.querySelector('.ac-card-glow-65') as HTMLElement

      gsap.set(content, { height: 'auto' })
      const height = content.offsetHeight
      gsap.set(content, { height: 0, opacity: 0 })

      gsap.to(content, {
        height: height,
        opacity: 1,
        duration: 0.6,
        ease: 'elastic.out(1, 0.75)'
      })

      gsap.fromTo(inner,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out', delay: 0.2 }
      )

      gsap.to(arrow, { rotation: 180, duration: 0.4, ease: 'back.out(1.7)' })
      gsap.to(glow, { scale: 1.2, opacity: 0.6, duration: 0.4, ease: 'power2.out' })
    }, i * 80)
  })
}

const collapseAll = () => {
  activeIndex.value = -1
  cards.value.forEach((card) => {
    const content = card.querySelector('.ac-card-content-65') as HTMLElement
    const arrow = card.querySelector('.ac-arrow-65') as HTMLElement
    const glow = card.querySelector('.ac-card-glow-65') as HTMLElement

    gsap.to(content, {
      height: 0,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.inOut'
    })
    gsap.to(arrow, { rotation: 0, duration: 0.3, ease: 'power2.out' })
    gsap.to(glow, {
      scale: 1,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.out'
    })
    gsap.to(card.querySelector('.ac-card-border-65'), {
      width: '0%',
      duration: 0.3,
      ease: 'power2.out'
    })
  })
}

const animateParticles = () => {
  const particles = gsap.utils.toArray('.ac-particle-65', sectionRoot.value)
  particles.forEach((particle: any, i) => {
    gsap.to(particle, {
      y: 'random(-100, -20)',
      x: 'random(-20, 20)',
      opacity: 'random(0.1, 0.5)',
      duration: 'random(3, 6)',
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: i * 0.05
    })
  })
}

const animateGlowOrbs = () => {
  const glow1 = gsap.utils.toArray('.ac-glow-1-65', sectionRoot.value)[0]
  const glow2 = gsap.utils.toArray('.ac-glow-2-65', sectionRoot.value)[0]

  if (glow1) {
    gsap.to(glow1, {
      x: '+=30',
      y: '-=30',
      scale: 'random(1, 1.3)',
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
  }

  if (glow2) {
    gsap.to(glow2, {
      x: '-=30',
      y: '+=30',
      scale: 'random(1, 1.3)',
      duration: 10,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
  }
}

onMounted(() => {
  // 等待 DOM 完全渲染
  nextTick(() => {
    ctx = gsap.context(() => {
      // 初始化卡片内容
      gsap.set('.ac-card-content-65', { height: 0, overflow: 'hidden' })

      // 延迟展开第一个卡片
      setTimeout(() => {
        if (cards.value[0]) {
          toggleCard(0)
        }
      }, 500)

      // 标题入场动画 - 使用 gsap.utils.toArray 安全选择
      const titleEls = gsap.utils.toArray('.ac-title-65', sectionRoot.value)
      titleEls.forEach((title: any) => {
        gsap.from(title, {
          scrollTrigger: {
            trigger: sectionRoot.value,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          },
          y: 80,
          opacity: 0,
          scale: 0.85,
          rotationX: -10,
          duration: 1.2,
          ease: 'elastic.out(1, 0.7)'
        })
      })

      // 标题光效
      const shimmerEls = gsap.utils.toArray('.ac-title-shimmer-65', sectionRoot.value)
      shimmerEls.forEach((shimmer: any) => {
        gsap.to(shimmer, {
          x: '200%',
          duration: 3,
          repeat: -1,
          ease: 'none'
        })
      })

      // 副标题动画
      const subtitleEls = gsap.utils.toArray('.ac-subtitle-65', sectionRoot.value)
      subtitleEls.forEach((subtitle: any) => {
        gsap.from(subtitle, {
          scrollTrigger: {
            trigger: sectionRoot.value,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          y: 50,
          opacity: 0,
          duration: 1,
          delay: 0.15,
          ease: 'power3.out'
        })
      })

      // 标题分割线动画
      const lineEls = gsap.utils.toArray('.ac-title-line-65', sectionRoot.value)
      lineEls.forEach((line: any) => {
        gsap.from(line, {
          scrollTrigger: {
            trigger: sectionRoot.value,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          },
          width: 0,
          duration: 0.8,
          delay: 0.3,
          ease: 'power2.out'
        })
      })

      // 卡片交错入场动画
      const cardEls = gsap.utils.toArray('.accordion-card-65', sectionRoot.value)
      gsap.from(cardEls, {
        scrollTrigger: {
          trigger: gsap.utils.toArray('.accordion-container-65', sectionRoot.value)[0] as Element,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        y: 100,
        opacity: 0,
        scale: 0.9,
        rotationX: 15,
        stagger: 0.1,
        duration: 0.9,
        ease: 'power3.out'
      })

      // 按钮动画
      const btnEls = gsap.utils.toArray('.ac-btn-65', sectionRoot.value)
      gsap.from(btnEls, {
        scrollTrigger: {
          trigger: gsap.utils.toArray('.ac-controls-65', sectionRoot.value)[0] as Element,
          start: 'top 90%',
          toggleActions: 'play none none reverse'
        },
        y: 40,
        opacity: 0,
        scale: 0.9,
        stagger: 0.1,
        duration: 0.7,
        ease: 'back.out(1.7)'
      })

      // 启动粒子动画
      animateParticles()

      // 启动光晕动画
      animateGlowOrbs()

      // 数字序号环动画
      const ringEls = gsap.utils.toArray('.ac-number-ring-65', sectionRoot.value)
      ringEls.forEach((ring: any) => {
        gsap.to(ring, {
          rotation: 360,
          duration: 10,
          repeat: -1,
          ease: 'none'
        })
      })
    }, sectionRoot.value)
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.accordion-section-65 {
  position: relative;
  min-height: 100vh;
  padding: 80px 40px;
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
  overflow: hidden;
}

/* 粒子背景 */
.ac-particles-65 {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  overflow: hidden;
}

.ac-particle-65 {
  position: absolute;
  width: 4px;
  height: 4px;
  background: radial-gradient(circle, rgba(233, 69, 96, 0.8), transparent);
  border-radius: 50%;
  top: 100%;
  left: 'random(0, 100%)';
}

/* 装饰性光晕 */
.ac-glow-orb-65 {
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  z-index: 0;
}

.ac-glow-1-65 {
  top: 10%;
  left: 10%;
  background: radial-gradient(circle, rgba(233, 69, 96, 0.3), transparent);
}

.ac-glow-2-65 {
  bottom: 10%;
  right: 10%;
  background: radial-gradient(circle, rgba(83, 52, 131, 0.3), transparent);
}

/* 标题区域 */
.ac-header-65 {
  position: relative;
  text-align: center;
  margin-bottom: 60px;
  z-index: 1;
}

.ac-title-65 {
  position: relative;
  display: inline-block;
  font-size: 3.5rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 16px;
  overflow: hidden;
}

.ac-title-bg-65 {
  position: relative;
  z-index: 2;
  background: linear-gradient(135deg, #e94560 0%, #533483 50%, #24243e 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 5s ease infinite;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% center; }
  50% { background-position: 100% center; }
}

.ac-title-shimmer-65 {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  z-index: 3;
}

.ac-subtitle-65 {
  font-size: 0.9rem;
  color: rgba(233, 69, 96, 0.7);
  letter-spacing: 8px;
  text-transform: uppercase;
  font-weight: 600;
}

.ac-title-line-65 {
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #e94560, transparent);
  margin: 20px auto 0;
}

/* 卡片容器 */
.accordion-container-65 {
  position: relative;
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  z-index: 1;
}

/* 卡片样式 */
.accordion-card-65 {
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(233, 69, 96, 0.1), rgba(83, 52, 131, 0.1));
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    &::before {
      opacity: 1;
    }
  }

  &.ac-active-65 {
    background: rgba(255, 255, 255, 0.06);
    box-shadow:
      0 20px 60px rgba(233, 69, 96, 0.15),
      0 0 100px rgba(233, 69, 96, 0.05);
  }
}

/* 卡片光效 */
.ac-card-glow-65 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 150%;
  height: 150%;
  background: radial-gradient(circle, rgba(233, 69, 96, 0.15), transparent 70%);
  opacity: 0;
  pointer-events: none;
  transition: all 0.4s ease;
}

/* 卡片边框动画 */
.ac-card-border-65 {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  width: 0;
  background: linear-gradient(90deg, #e94560, #533483);
}

/* 卡片头部 */
.ac-card-header-65 {
  position: relative;
  display: flex;
  align-items: center;
  padding: 28px 36px;
  gap: 24px;
}

/* 序号 */
.ac-card-number-65 {
  position: relative;
  min-width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ac-number-bg-65 {
  position: relative;
  z-index: 2;
  font-size: 1.6rem;
  font-weight: 900;
  color: #e94560;
}

.ac-number-ring-65 {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 2px solid rgba(233, 69, 96, 0.3);
  border-radius: 50%;
  border-top-color: transparent;
  animation: ringRotate 3s linear infinite;
}

@keyframes ringRotate {
  to { transform: rotate(360deg); }
}

/* 标题 */
.ac-card-title-65 {
  flex: 1;
  font-size: 1.35rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
  letter-spacing: 0.5px;
}

/* 自定义箭头 */
.ac-arrow-65 {
  position: relative;
  width: 24px;
  height: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
  transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);

  span {
    display: block;
    width: 12px;
    height: 2px;
    background: #e94560;
    transition: all 0.3s ease;
  }

  span:first-child {
    transform-origin: left center;
  }

  span:last-child {
    transform-origin: right center;
  }
}

.ac-arrow-65.ac-arrow-rotate-65 {
  transform: rotate(180deg);
}

/* 卡片内容 */
.ac-card-content-65 {
  overflow: hidden;
}

.ac-content-inner-65 {
  padding: 0 36px 36px;
}

/* 图片容器 */
.ac-content-image-wrapper-65 {
  position: relative;
  width: 100%;
  height: 220px;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 24px;
}

.ac-content-image-65 {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transform: scale(1.1);
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.ac-card-65:hover .ac-content-image-65 {
  transform: scale(1.15);
}

.ac-image-overlay-65 {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.3), transparent);
}

/* 文本 */
.ac-content-text-65 {
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.8;
  margin-bottom: 20px;
  font-size: 1rem;
}

/* 特征标签 */
.ac-content-features-65 {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.ac-feature-tag-65 {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  background: rgba(233, 69, 96, 0.1);
  border-radius: 25px;
  font-size: 0.85rem;
  color: #e94560;
  border: 1px solid rgba(233, 69, 96, 0.3);
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
  animation: fadeInUp 0.5s ease backwards;
  animation-delay: var(--delay, 0s);

  &:hover {
    background: rgba(233, 69, 96, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(233, 69, 96, 0.3);
  }
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

.ac-feature-dot-65 {
  width: 6px;
  height: 6px;
  background: #e94560;
  border-radius: 50%;
  box-shadow: 0 0 10px #e94560;
}

/* 内容装饰线 */
.ac-content-line-65 {
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(233, 69, 96, 0.3), transparent);
  margin-top: 24px;
}

/* 控制按钮 */
.ac-controls-65 {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 50px;
  position: relative;
  z-index: 1;
}

.ac-btn-65 {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 16px 40px;
  font-size: 0.95rem;
  font-weight: 700;
  border: none;
  border-radius: 35px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }

  &:hover::before {
    left: 100%;
  }
}

.ac-btn-primary-65 {
  background: linear-gradient(135deg, #e94560 0%, #533483 100%);
  color: #fff;
  box-shadow: 0 8px 30px rgba(233, 69, 96, 0.4);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(233, 69, 96, 0.5);
  }
}

.ac-btn-secondary-65 {
  background: transparent;
  color: rgba(255, 255, 255, 0.9);
  border: 2px solid rgba(233, 69, 96, 0.5);

  &:hover {
    background: rgba(233, 69, 96, 0.1);
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(233, 69, 96, 0.2);
  }
}

.ac-btn-icon-65 {
  font-size: 0.9rem;
  transition: transform 0.3s ease;
}

.ac-btn-65:hover .ac-btn-icon-65 {
  transform: scale(1.2);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .accordion-section-65 {
    padding: 60px 20px;
  }

  .ac-title-65 {
    font-size: 2.2rem;
  }

  .ac-subtitle-65 {
    letter-spacing: 4px;
  }

  .ac-card-header-65 {
    padding: 22px 28px;
    gap: 18px;
  }

  .ac-card-number-65 {
    min-width: 48px;
    height: 48px;
  }

  .ac-number-bg-65 {
    font-size: 1.3rem;
  }

  .ac-card-title-65 {
    font-size: 1.15rem;
  }

  .ac-content-inner-65 {
    padding: 0 28px 28px;
  }

  .ac-content-image-wrapper-65 {
    height: 180px;
  }

  .ac-controls-65 {
    flex-direction: column;
    gap: 12px;
  }

  .ac-btn-65 {
    width: 100%;
    justify-content: center;
  }
}
</style>
