<template>
  <section class="card-3d-section">
    <h2 class="card-3d-title">3D卡片翻转画廊</h2>
    <div class="card-3d-container">
      <div
        v-for="card in cards"
        :key="card.id"
        class="card-3d-item"
      >
        <div class="card-3d-inner" :ref="el => { if (el) innerRefs.push(el as HTMLElement) }">
          <div class="card-3d-front">
            <span class="card-3d-icon">{{ card.icon }}</span>
            <h3>{{ card.title }}</h3>
            <p>{{ card.desc }}</p>
          </div>
          <div class="card-3d-back" :style="{ background: card.gradient }">
            <h3>{{ card.title }}</h3>
            <p>{{ card.backDesc }}</p>
            <div class="card-3d-stats">
              <div class="card-3d-stat">
                <span class="card-3d-value">{{ card.stat1 }}</span>
                <span class="card-3d-label">{{ card.label1 }}</span>
              </div>
              <div class="card-3d-stat">
                <span class="card-3d-value">{{ card.stat2 }}</span>
                <span class="card-3d-label">{{ card.label2 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card-3d-hint">
      <span>向下滚动查看更多</span>
      <div class="card-3d-arrow"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * Card3DFlipGallery - 3D卡片翻转画廊组件
 * @description 支持滚动触发的3D翻转动画卡片
 */
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// 类型定义
interface Card {
  id: string
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

// 卡片数据
const cards = ref<Card[]>([
  {
    id: 'innovation',
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
    id: 'wisdom',
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
    id: 'excellence',
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
    id: 'focus',
    icon: '🎯',
    title: '专注',
    desc: '聚焦核心价值',
    backDesc: '深耕垂直领域，打造专业能力',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    stat1: 96,
    stat2: 90,
    label1: '专注度',
    label2: '执行力'
  }
])

// Vue3 模板引用 - 替代 document.querySelectorAll
const innerRefs = ref<HTMLElement[]>([])

onMounted(() => {
  // 入场动画 - 页面加载立即执行
  gsap.fromTo(
    '.card-3d-item',
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

  // 滚动翻转动画 - 使用 Vue3 ref
  innerRefs.value.forEach((inner) => {
    gsap.to(inner, {
      rotateY: 180,
      ease: 'none',
      scrollTrigger: {
        trigger: inner.parentElement!,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    })
  })
})

onUnmounted(() => {
  ScrollTrigger.getAll().forEach((t) => t.kill())
  gsap.killTweensOf('.card-3d-item, .card-3d-inner')
})
</script>

<style scoped lang="scss">
// CSS 变量
$card-width: 280px;
$card-height: 380px;
$card-radius: 20px;
$card-gap: 40px;
$perspective: 1500px;

$colors: (
  primary: #667eea,
  secondary: #764ba2,
  text-dark: #333,
  text-light: #666,
  text-white: #fff,
  text-muted: rgba(255, 255, 255, 0.8)
);

.card-3d-section {
  min-height: 100vh;
  padding: 80px 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, transparent, rgba(139, 92, 246, 0.1), transparent);
}

.card-3d-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 60px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
}

.card-3d-container {
  display: flex;
  gap: $card-gap;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 1200px;
  perspective: $perspective;
}

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
  transition: none; // 由 GSAP 控制动画
}

.card-3d-front,
.card-3d-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border-radius: $card-radius;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 30px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.card-3d-front {
  background: linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%);
  border: 2px solid rgba(102, 126, 234, 0.2);
}

.card-3d-back {
  transform: rotateY(180deg);
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.card-3d-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

.card-3d-front h3,
.card-3d-back h3 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 12px;
}

.card-3d-front h3 {
  color: map-get($colors, text-dark);
}

.card-3d-back h3 {
  color: map-get($colors, text-white);
}

.card-3d-front p {
  font-size: 0.9rem;
  color: map-get($colors, text-light);
  text-align: center;
  line-height: 1.6;
}

.card-3d-back p {
  font-size: 0.9rem;
  color: map-get($colors, text-muted);
  text-align: center;
  line-height: 1.6;
  margin-bottom: 30px;
}

.card-3d-stats {
  display: flex;
  gap: 40px;
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
  color: map-get($colors, text-white);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.card-3d-label {
  font-size: 0.8rem;
  color: map-get($colors, text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.card-3d-hint {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: #94a3b8;
}

.card-3d-hint span {
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.card-3d-arrow {
  width: 20px;
  height: 20px;
  border-right: 2px solid #94a3b8;
  border-bottom: 2px solid #94a3b8;
  transform: rotate(45deg);
  animation: scrollBounce 2s ease-in-out infinite;
}

@keyframes scrollBounce {
  0%, 100% {
    transform: rotate(45deg) translateY(0);
  }
  50% {
    transform: rotate(45deg) translateY(10px);
  }
}

@media (max-width: 768px) {
  .card-3d-container {
    gap: 20px;
  }

  .card-3d-item {
    width: 240px;
    height: 320px;
  }
}
</style>
