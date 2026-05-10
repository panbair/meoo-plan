<template>
  <div class="parallax-container" ref="containerRef">
    <div
      v-for="(card, index) in cards"
      :key="index"
      :ref="el => cardRefs[index] = el as HTMLElement"
      class="parallax-card"
      :style="{ '--card-index': index }"
    >
      <div class="card-inner">
        <div class="card-icon">{{ card.icon }}</div>
        <h3 class="card-title">{{ card.title }}</h3>
        <p class="card-desc">{{ card.desc }}</p>
      </div>
      <div class="card-glow" :style="{ '--card-color': card.color }"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Card {
  icon: string
  title: string
  desc: string
  color: string
}

interface Props {
  cards?: Card[]
}

const props = withDefaults(defineProps<Props>(), {
  cards: () => [
    { icon: '🚀', title: '快速启动', desc: '秒级响应，即刻开始', color: '#8b5cf6' },
    { icon: '⚡', title: '高性能', desc: '极致优化，流畅体验', color: '#3b82f6' },
    { icon: '🎨', title: '美观设计', desc: '精心打磨，视觉盛宴', color: '#ec4899' },
    { icon: '🔒', title: '安全可靠', desc: '多层防护，值得信赖', color: '#10b981' }
  ]
})

const containerRef = ref<HTMLElement>()
const cardRefs = ref<HTMLElement[]>([])
let ctx: gsap.Context

onMounted(() => {
  if (!containerRef.value || cardRefs.value.length === 0) return

  ctx = gsap.context(() => {
    cardRefs.value.forEach((card, index) => {
      // 滚动触发视差动画
      gsap.fromTo(card,
        {
          y: 100 + (index * 50),
          opacity: 0,
          rotationX: 45
        },
        {
          y: 0,
          opacity: 1,
          rotationX: 0,
          duration: 1,
          delay: index * 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      )

      // 卡片悬停效果
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -10,
          scale: 1.05,
          duration: 0.4,
          ease: 'power2.out'
        })
        gsap.to(card.querySelector('.card-glow'), {
          opacity: 0.6,
          duration: 0.3
        })
      })

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          duration: 0.4,
          ease: 'power2.out'
        })
        gsap.to(card.querySelector('.card-glow'), {
          opacity: 0,
          duration: 0.3
        })
      })
    })

    // 容器悬停时的整体效果
    containerRef.value.addEventListener('mousemove', (e) => {
      const cards = cardRefs.value
      const rect = containerRef.value!.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      cards.forEach((card, index) => {
        const cardRect = card.getBoundingClientRect()
        const cardCenterX = cardRect.left + cardRect.width / 2
        const cardCenterY = cardRect.top + cardRect.height / 2

        const deltaX = (e.clientX - cardCenterX) / 30
        const deltaY = (e.clientY - cardCenterY) / 30

        gsap.to(card, {
          rotationY: deltaX,
          rotationX: -deltaY,
          duration: 0.5,
          ease: 'power2.out'
        })
      })
    })

    containerRef.value.addEventListener('mouseleave', () => {
      cardRefs.value.forEach(card => {
        gsap.to(card, {
          rotationY: 0,
          rotationX: 0,
          duration: 0.5,
          ease: 'power2.out'
        })
      })
    })
  }, containerRef.value)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.parallax-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  padding: 40px 20px;
  perspective: 1000px;
}

.parallax-card {
  position: relative;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 30px;
  overflow: hidden;
  transform-style: preserve-3d;
  cursor: pointer;
  transition: border-color 0.3s;

  &:hover {
    border-color: rgba(255, 255, 255, 0.3);
  }
}

.card-inner {
  position: relative;
  z-index: 2;
}

.card-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 12px;
}

.card-desc {
  font-size: 1rem;
  color: #94a3b8;
  line-height: 1.6;
}

.card-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, var(--card-color), transparent 70%);
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
  z-index: 1;
}

@media (max-width: 768px) {
  .parallax-container {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}
</style>
