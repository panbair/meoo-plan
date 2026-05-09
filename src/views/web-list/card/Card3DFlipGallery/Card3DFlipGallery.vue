<script setup lang="ts">
/**
 * 3D翻转卡片画廊组件
 * @description 支持入场动画和滚动触发的3D翻转卡片展示
 */

import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Props 定义
interface CardItem {
  icon: string
  title: string
  desc: string
  backDesc: string
  gradient: string
  stat1: number
  stat2: number
  label1: string
  label2: string
}

interface Props {
  cards?: CardItem[]
  cardWidth?: number
  cardHeight?: number
  staggerDelay?: number
  animationDuration?: number
}

const props = withDefaults(defineProps<Props>(), {
  cards: () => [
    {
      icon: '🚀',
      title: '创新',
      desc: '探索无限可能',
      backDesc: '引领科技前沿，创造未来价值',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      stat1: 98,
      stat2: 85,
      label1: '创新度',
      label2: '影响力'
    },
    {
      icon: '💡',
      title: '智慧',
      desc: '洞察本质规律',
      backDesc: '数据驱动决策，智能优化流程',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      stat1: 95,
      stat2: 92,
      label1: '智商',
      label2: '效率'
    },
    {
      icon: '🌟',
      title: '卓越',
      desc: '追求极致品质',
      backDesc: '精益求精态度，打造完美作品',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      stat1: 99,
      stat2: 88,
      label1: '质量',
      label2: '满意度'
    },
    {
      icon: '🎯',
      title: '专注',
      desc: '聚焦核心价值',
      backDesc: '深耕垂直领域，打造专业能力',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      stat1: 96,
      stat2: 90,
      label1: '专注度',
      label2: '执行力'
    },
  ],
  cardWidth: 280,
  cardHeight: 380,
  staggerDelay: 0.2,
  animationDuration: 1,
})

const emit = defineEmits<{
  cardClick: [card: CardItem, index: number]
}>()

// Refs
const cardSection = ref<HTMLElement>()
const cardContainer = ref<HTMLElement>()
const allTweens: gsap.core.Tween[] = []

/**
 * 初始化动画
 */
const initAnimations = () => {
  const cardElements = cardContainer.value?.children
  if (!cardElements || cardElements.length === 0) {
    return
  }

  Array.from(cardElements).forEach((card, index) => {
    // 设置初始状态
    gsap.set(card, { opacity: 0, y: 80, rotateX: 45 })

    // 入场动画
    const tween = gsap.to(card, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration: props.animationDuration,
      ease: 'back.out(1.7)',
      delay: index * props.staggerDelay,
    })
    allTweens.push(tween)

    // 翻转动画
    const inner = card.querySelector('.c3d-card-inner') as HTMLElement
    if (inner) {
      gsap.to(inner, {rotateY: 180,
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          start: 'top 65%',
          end: 'center center',
          scrub: 1.5,
        },})
    }
  })
}

/**
 * 卡片点击处理
 */
const handleCardClick = (card: CardItem, index: number) => {
  emit('cardClick', card, index)
}

/**
 * 清理动画
 */
const cleanupAnimations = () => {
  allTweens.forEach((tween) => tween.kill())
  allTweens.length = 0
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
  gsap.killTweensOf('*')
}

onMounted(() => {
  nextTick(() => {
    setTimeout(initAnimations, 200)
  })
})

onUnmounted(() => {
  cleanupAnimations()
})
</script>

<template>
  <section ref="cardSection" class="c3d-section">
    <div ref="cardContainer" class="c3d-card-container">
      <div
        v-for="(card, index) in cards"
        :key="index"
        class="c3d-card"
        :style="{ width: `${cardWidth}px`, height: `${cardHeight}px` }"
        @click="handleCardClick(card, index)"
      >
        <div class="c3d-card-inner">
          <!-- 正面 -->
          <div class="c3d-card-front">
            <div class="c3d-card-icon">{{ card.icon }}</div>
            <h3>{{ card.title }}</h3>
            <p>{{ card.desc }}</p>
          </div>

          <!-- 背面 -->
          <div class="c3d-card-back" :style="{ background: card.gradient }">
            <h3>{{ card.title }}</h3>
            <p>{{ card.backDesc }}</p>
            <div class="c3d-stats">
              <div class="c3d-stat">
                <span class="c3d-value">{{ card.stat1 }}</span>
                <span class="c3d-label">{{ card.label1 }}</span>
              </div>
              <div class="c3d-stat">
                <span class="c3d-value">{{ card.stat2 }}</span>
                <span class="c3d-label">{{ card.label2 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.c3d-section {
  min-height: 100vh;
  width: 100%;
  padding: 100px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, transparent, rgba(139, 92, 246, 0.1), transparent);
}

.c3d-card-container {
  display: flex;
  gap: 40px;
  justify-content: center;
  max-width: 1200px;
  perspective: 1500px;
}

.c3d-card {
  perspective: 1500px;
  cursor: pointer;

  &:hover .c3d-card-inner {
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
  }
}

.c3d-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition:
    transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275),
    box-shadow 0.3s ease;
}

.c3d-card-front,
.c3d-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 30px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
}

.c3d-card-front {
  background: linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%);
  border: 2px solid rgba(102, 126, 234, 0.2);

  h3 {
    font-size: 1.5rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 12px;
  }

  p {
    font-size: 0.9rem;
    color: #666;
    text-align: center;
    line-height: 1.6;
  }
}

.c3d-card-back {
  transform: rotateY(180deg);
  border: 2px solid rgba(255, 255, 255, 0.2);

  h3 {
    font-size: 1.5rem;
    font-weight: bold;
    color: #fff;
    margin-bottom: 12px;
  }

  p {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.9);
    text-align: center;
    line-height: 1.6;
    margin-bottom: 30px;
  }
}

.c3d-card-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

.c3d-stats {
  display: flex;
  gap: 40px;
}

.c3d-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.c3d-value {
  font-size: 2rem;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.c3d-label {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 1px;
}

@media (max-width: 768px) {
  .c3d-card-container {
    gap: 20px;
  }

  .c3d-card {
    width: 240px !important;
    height: 320px !important;
  }
}
</style>
