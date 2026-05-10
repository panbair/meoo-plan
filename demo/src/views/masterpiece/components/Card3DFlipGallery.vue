<template>
  <div ref="containerRef" class="card3d-container">
    <div class="card3d-title">3D卡片翻转画廊</div>
    <div class="cards-wrapper" ref="cardsWrapper">
      <div
        v-for="(card, index) in cards"
        :key="index"
        :ref="el => { if (el) cardRefs[index] = el as HTMLElement }"
        class="card-container"
        @click="flipCard(index)"
      >
        <div class="card" :class="{ flipped: card.flipped }">
          <div class="card-front">
            <div class="card-icon">{{ card.icon }}</div>
            <h3 class="card-title">{{ card.title }}</h3>
            <p class="card-desc">{{ card.frontDesc }}</p>
          </div>
          <div class="card-back" :style="{ background: card.backGradient }">
            <h3 class="card-title">{{ card.title }}</h3>
            <p class="card-desc">{{ card.backDesc }}</p>
            <div class="card-stats">
              <div class="stat-item">
                <span class="stat-value">{{ card.stat1 }}</span>
                <span class="stat-label">{{ card.statLabel1 }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ card.stat2 }}</span>
                <span class="stat-label">{{ card.statLabel2 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card3d-controls">
      <button @click="flipAll" class="btn-primary">全部翻转</button>
      <button @click="resetAll" class="btn-secondary">重置</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

const containerRef = ref<HTMLElement>()
const cardsWrapper = ref<HTMLElement>()
const cardRefs = ref<HTMLElement[]>([])

interface Card {
  icon: string
  title: string
  frontDesc: string
  backDesc: string
  backGradient: string
  stat1: number
  stat2: number
  statLabel1: string
  statLabel2: string
  flipped: boolean
}

const cards = ref<Card[]>([
  {
    icon: '🚀',
    title: '创新',
    frontDesc: '探索无限可能',
    backDesc: '引领科技前沿，创造未来价值',
    backGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    stat1: 98,
    stat2: 85,
    statLabel1: '创新度',
    statLabel2: '影响力'
  },
  {
    icon: '💡',
    title: '智慧',
    frontDesc: '洞察本质规律',
    backDesc: '数据驱动决策，智能优化流程',
    backGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    stat1: 95,
    stat2: 92,
    statLabel1: '智商',
    statLabel2: '效率'
  },
  {
    icon: '🌟',
    title: '卓越',
    frontDesc: '追求极致品质',
    backDesc: '精益求精态度，打造完美作品',
    backGradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    stat1: 99,
    stat2: 88,
    statLabel1: '质量',
    statLabel2: '满意度'
  },
  {
    icon: '🎯',
    title: '专注',
    frontDesc: '聚焦核心价值',
    backDesc: '深耕垂直领域，打造专业能力',
    backGradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    stat1: 96,
    stat2: 90,
    statLabel1: '专注度',
    statLabel2: '执行力'
  }
])

const flipCard = (index: number) => {
  const card = cards.value[index]
  card.flipped = !card.flipped
  
  // GSAP动画
  const cardEl = cardRefs.value[index]
  if (cardEl) {
    gsap.to(cardEl, {
      scale: 1.05,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut'
    })
  }
}

const flipAll = () => {
  cards.value.forEach((card, index) => {
    setTimeout(() => {
      flipCard(index)
    }, index * 150)
  })
}

const resetAll = () => {
  cards.value.forEach(card => {
    card.flipped = false
  })
  
  // GSAP重置动画
  cardRefs.value.forEach((cardEl, index) => {
    gsap.fromTo(cardEl,
      { rotationY: 180 },
      { rotationY: 0, duration: 0.6, delay: index * 0.1, ease: 'back.out(1.7)' }
    )
  })
}

let entranceTimeline: gsap.core.Timeline

const initEntranceAnimation = () => {
  entranceTimeline = gsap.timeline()
  
  // 入场动画
  cardRefs.value.forEach((cardEl, index) => {
    gsap.fromTo(cardEl,
      {
        y: 100,
        opacity: 0,
        rotationX: 45
      },
      {
        y: 0,
        opacity: 1,
        rotationX: 0,
        duration: 0.8,
        delay: index * 0.15,
        ease: 'back.out(1.5)'
      }
    )
  })
  
  // 持续的悬浮动画
  cardRefs.value.forEach((cardEl, index) => {
    gsap.to(cardEl, {
      y: '+=10',
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: index * 0.2
    })
  })
}

const onMouseMove = (e: MouseEvent) => {
  if (!cardsWrapper.value) return
  
  const rect = cardsWrapper.value.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  
  const mouseX = e.clientX - centerX
  const mouseY = e.clientY - centerY
  
  const rotateX = -mouseY / 30
  const rotateY = mouseX / 30
  
  gsap.to(cardsWrapper.value, {
    rotateX,
    rotateY,
    duration: 0.3,
    ease: 'power2.out'
  })
}

onMounted(() => {
  initEntranceAnimation()
  if (containerRef.value) {
    containerRef.value.addEventListener('mousemove', onMouseMove)
  }
})

onUnmounted(() => {
  if (entranceTimeline) {
    entranceTimeline.kill()
  }
  gsap.killTweensOf(cardRefs.value)
  if (containerRef.value) {
    containerRef.value.removeEventListener('mousemove', onMouseMove)
  }
})
</script>

<style scoped lang="scss">
.card3d-container {
  position: relative;
  width: 100%;
  height: 600px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 0 60px rgba(102, 126, 234, 0.3);
  perspective: 1500px;
}

.card3d-title {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 2rem;
  font-weight: bold;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 40px rgba(102, 126, 234, 0.5);
  z-index: 10;
  letter-spacing: 4px;
}

.cards-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
  height: 100%;
  padding: 100px 40px;
  transform-style: preserve-3d;
  transition: transform 0.3s ease;
}

.card-container {
  width: 250px;
  height: 350px;
  perspective: 1500px;
  cursor: pointer;
}

.card {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.card.flipped {
  transform: rotateY(180deg);
}

.card-front,
.card-back {
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

.card-front {
  background: linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%);
  border: 2px solid rgba(102, 126, 234, 0.2);
}

.card-back {
  transform: rotateY(180deg);
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.card-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  animation: iconFloat 3s ease-in-out infinite;
}

@keyframes iconFloat {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-10px) scale(1.05); }
}

.card-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 12px;
  text-align: center;
}

.card-back .card-title {
  color: #fff;
}

.card-desc {
  font-size: 0.9rem;
  color: #666;
  text-align: center;
  line-height: 1.6;
}

.card-back .card-desc {
  color: rgba(255, 255, 255, 0.9);
}

.card-stats {
  display: flex;
  gap: 40px;
  margin-top: 30px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.stat-label {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.card3d-controls {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 20px;
  z-index: 10;
}

.btn-primary,
.btn-secondary {
  padding: 12px 30px;
  border: none;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
  }

  &:active {
    transform: translateY(0);
  }
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 2px solid rgba(255, 255, 255, 0.3);

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
}

.card-container:hover {
  .card {
    box-shadow: 0 25px 70px rgba(0, 0, 0, 0.5);
  }
}
</style>
