<template>
  <section class="card-3d-section">
    <div class="card-3d-container">
      <div
        v-for="(card, index) in cards"
        :key="card.id"
        :ref="(el) => setItemRef(el, index)"
        class="card-3d-item"
      >
        <div
          :ref="(el) => setInnerRef(el, index)"
          class="card-3d-inner"
        >
          <div class="card-3d-face card-3d-front">
            <span class="card-3d-icon">{{ card.icon }}</span>
            <h3>{{ card.title }}</h3>
            <p>{{ card.desc }}</p>
          </div>
          <div
            class="card-3d-face card-3d-back"
            :style="{ background: card.gradient }"
          >
            <h3>{{ card.title }}</h3>
            <p>{{ card.descBack }}</p>
            <div class="card-3d-stats">
              <div
                v-for="(stat, statIndex) in [card.stats.stat1, card.stats.stat2]"
                :key="statIndex"
                class="card-3d-stat"
              >
                <span class="card-3d-value">{{ stat.value }}</span>
                <span class="card-3d-label">{{ stat.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * Card3DFlipGallery - 3D卡片翻转画廊组件
 * @description 支持滚动触发的3D翻转动画卡片
 */

// ============================================================
// 依赖
// ============================================================
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

// 注册GSAP插件
gsap.registerPlugin(ScrollTrigger)

// ============================================================
// 类型定义
// ============================================================

interface CardStat {
  value: number
  label: string
}

interface Card {
  id: string
  icon: string
  title: string
  desc: string
  descBack: string
  gradient: string
  stats: {
    stat1: CardStat
    stat2: CardStat
  }
}

type TweenCleanup = () => void

// ============================================================
// 常量配置
// ============================================================

/** 卡片数据 */
const CARDS_DATA: Card[] = [
  {
    id: 'innovation',
    icon: '🚀',
    title: '创新',
    desc: '探索无限可能',
    descBack: '引领科技前沿，创造未来价值',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    stats: {
      stat1: { value: 98, label: '创新度' },
      stat2: { value: 85, label: '影响力' }
    }
  },
  {
    id: 'wisdom',
    icon: '💡',
    title: '智慧',
    desc: '洞察本质规律',
    descBack: '数据驱动决策，智能优化流程',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    stats: {
      stat1: { value: 95, label: '智商' },
      stat2: { value: 92, label: '效率' }
    }
  },
  {
    id: 'excellence',
    icon: '🌟',
    title: '卓越',
    desc: '追求极致品质',
    descBack: '精益求精态度，打造完美作品',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    stats: {
      stat1: { value: 99, label: '质量' },
      stat2: { value: 88, label: '满意度' }
    }
  },
  {
    id: 'focus',
    icon: '🎯',
    title: '专注',
    desc: '聚焦核心价值',
    descBack: '深耕垂直领域，打造专业能力',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    stats: {
      stat1: { value: 96, label: '专注度' },
      stat2: { value: 90, label: '执行力' }
    }
  }
]

// ============================================================
// 响应式状态
// ============================================================

const cards = ref(CARDS_DATA)

// 使用Map存储ref，通过index精确控制
const itemRefsMap = ref(new Map<number, HTMLElement>())
const innerRefsMap = ref(new Map<number, HTMLElement>())

// ============================================================
// 模板引用处理
// ============================================================

/**
 * 设置卡片外层元素引用
 * 使用index确保每次渲染都能正确收集
 */
const setItemRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  if (el) {
    const element = el instanceof Element ? el : (el as { $el: Element }).$el
    if (element instanceof HTMLElement) {
      itemRefsMap.value.set(index, element)
    }
  } else {
    itemRefsMap.value.delete(index)
  }
}

/**
 * 设置卡片内层元素引用
 * 使用index确保每次渲染都能正确收集
 */
const setInnerRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  if (el) {
    const element = el instanceof Element ? el : (el as { $el: Element }).$el
    if (element instanceof HTMLElement) {
      innerRefsMap.value.set(index, element)
    }
  } else {
    innerRefsMap.value.delete(index)
  }
}

// ============================================================
// 动画逻辑
// ============================================================

// 保存清理函数
let cleanupFns: TweenCleanup[] = []

/**
 * 初始化入场动画
 * 卡片从下方飞入，带3D透视效果
 */
const initEntryAnimation = () => {
  const elements = Array.from(itemRefsMap.value.values())
  if (elements.length === 0) return

  const tween = gsap.fromTo(
    elements,
    { y: 80, opacity: 0, rotateX: 40 },
    {
      y: 0,
      opacity: 1,
      rotateX: 0,
      duration: 0.8,
      ease: 'back.out(1.7)',
      stagger: 0.15
    }
  )

  cleanupFns.push(() => tween.kill())
}

/**
 * 初始化滚动翻转动画
 * 卡片随滚动进行Y轴180度翻转
 */
const initScrollFlipAnimation = () => {
  innerRefsMap.value.forEach((inner, index) => {
    const parent = inner.parentElement
    if (!parent) return

    const tween = gsap.to(inner, {
      rotateY: 180,
      ease: 'none',
      scrollTrigger: {
        trigger: parent,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 1.5
      }
    })

    cleanupFns.push(() => tween.kill())
  })
}

/**
 * 清理所有动画
 */
const cleanupAnimations = () => {
  // 清理所有ScrollTrigger
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill())

  // 执行所有tween的清理函数
  cleanupFns.forEach((fn) => fn())
  cleanupFns = []

  // 清空ref Map
  itemRefsMap.value.clear()
  innerRefsMap.value.clear()
}

// ============================================================
// 生命周期
// ============================================================

onMounted(() => {
  // 使用requestAnimationFrame确保DOM已完全渲染
  requestAnimationFrame(() => {
    initEntryAnimation()
    initScrollFlipAnimation()
  })
})

onUnmounted(cleanupAnimations)
</script>

<style scoped lang="scss">
// ============================================================
// 变量定义
// ============================================================
$card-width: 280px;
$card-height: 380px;
$card-radius: 20px;
$perspective: 1500px;

// ============================================================
// 布局容器
// ============================================================
.card-3d-section {
  width: 100vw;
  height: 100vh;
  padding: 80px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, transparent, rgba(139, 92, 246, 0.1), transparent);
}

.card-3d-container {
  display: flex;
  //flex-wrap: wrap;
  justify-content: center;
  gap: 40px;
  max-width: 1200px;
  perspective: $perspective;
}

// ============================================================
// 卡片基础
// ============================================================
.card-3d-item {
  width: $card-width;
  height: $card-height;
  perspective: $perspective;
  cursor: pointer;
}

.card-3d-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

// ============================================================
// 卡片正反面
// ============================================================
.card-3d-face {
  position: absolute;
  inset: 0;
  border-radius: $card-radius;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 30px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.card-3d-front {
  background: linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%);
  border: 2px solid rgba(102, 126, 234, 0.2);

  h3 { color: #333; }
  p { color: #666; }
}

.card-3d-back {
  transform: rotateY(180deg);
  border: 2px solid rgba(255, 255, 255, 0.2);

  h3 { color: #fff; }
  p { color: rgba(255, 255, 255, 0.9); }
}

// ============================================================
// 卡片内容
// ============================================================
.card-3d-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

h3 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 12px;
}

p {
  font-size: 0.9rem;
  text-align: center;
  line-height: 1.6;
}

// ============================================================
// 统计数据
// ============================================================
.card-3d-stats {
  display: flex;
  gap: 40px;
  margin-top: 20px;
}

.card-3d-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.card-3d-value {
  font-size: 2rem;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.card-3d-label {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 1px;
}

// ============================================================
// 响应式
// ============================================================
@media (max-width: 768px) {
  .card-3d-container { gap: 20px; }
  .card-3d-item { width: 240px; height: 320px; }
}
</style>
