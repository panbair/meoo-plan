<template>
  <section ref="cardSection" class="c3d-section-1 c3d-card-section-1">
    <h2 class="c3d-section-title-1">3D卡片翻转画廊</h2>
    <div ref="cardContainer" class="c3d-card-container-1">
      <div
        v-for="(card, index) in cards"
        :key="index"
        :ref="
          el => {
            if (el) cardRefs[index] = el as HTMLElement
          }
        "
        class="c3d-card3d-1"
      >
        <div class="c3d-card-inner-1">
          <div class="c3d-card-front-1">
            <div class="c3d-card-icon-1">{{ card.icon }}</div>
            <h3>{{ card.title }}</h3>
            <p>{{ card.desc }}</p>
          </div>
          <div class="c3d-card-back-1" :style="{ background: card.gradient }">
            <h3>{{ card.title }}</h3>
            <p>{{ card.backDesc }}</p>
            <div class="c3d-stats-1">
              <div class="c3d-stat-1">
                <span class="c3d-value-1">{{ card.stat1 }}</span>
                <span class="c3d-label-1">{{ card.label1 }}</span>
              </div>
              <div class="c3d-stat-1">
                <span class="c3d-value-1">{{ card.stat2 }}</span>
                <span class="c3d-label-1">{{ card.label2 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="c3d-scroll-hint-1">
      <span class="c3d-scroll-text-1">向下滚动查看更多</span>
      <div class="c3d-scroll-arrow-1"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const cardSection = ref<HTMLElement>()
const cardContainer = ref<HTMLElement>()
const cardRefs = ref<HTMLElement[]>([])

const cards = ref([
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
  }
])

onMounted(() => {
  setTimeout(() => {
    initAnimations()
  }, 100)
})

onUnmounted(() => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
  gsap.killTweensOf('*')
})

const initAnimations = () => {
  if (!cardContainer.value) return

  cardRefs.value.forEach((card, index) => {
    gsap.fromTo(
      card,
      {
        y: 100,
        opacity: 0,
        rotateX: 45
      },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 1,
        ease: 'back.out(1.5)',
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          end: 'top 20%',
          toggleActions: 'play none none reverse'
        }
      }
    )
  })

  cardRefs.value.forEach((card, index) => {
    gsap.to(card.querySelector('.c3d-card-inner-1') as HTMLElement, {
      rotateY: 180,
      scrollTrigger: {
        trigger: card,
        start: 'top 70%',
        end: 'bottom 30%',
        scrub: 1,
        onUpdate: self => {
          if (self.progress >= 1) {
            gsap.set(card.querySelector('.c3d-card-inner-1') as HTMLElement, { rotateY: 180 })
          }
        }
      }
    })
  })
}
</script>

<style scoped lang="scss">
.c3d-section-1 {
  min-height: 100vh;
  padding: 100px 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  opacity: 1 !important;}

.c3d-section-title-1 {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 60px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;

  opacity: 1 !important;}

.c3d-card-section-1 {
  background: linear-gradient(180deg, transparent, rgba(139, 92, 246, 0.1), transparent);

  opacity: 1 !important;}

.c3d-card-container-1 {
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 1200px;
  perspective: 1500px;

  opacity: 1 !important;}

.c3d-card3d-1 {
  width: 280px;
  height: 380px;
  perspective: 1500px;
  cursor: pointer;

  opacity: 1 !important;}

.c3d-card-inner-1 {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  opacity: 1 !important;}

.c3d-card-front-1,
.c3d-card-back-1 {
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

  opacity: 1 !important;}

.c3d-card-front-1 {
  background: linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%);
  border: 2px solid rgba(102, 126, 234, 0.2);

  opacity: 1 !important;}

.c3d-card-back-1 {
  transform: rotateY(180deg);
  border: 2px solid rgba(255, 255, 255, 0.2);

  opacity: 1 !important;}

.c3d-card-icon-1 {
  font-size: 4rem;
  margin-bottom: 20px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));

  opacity: 1 !important;}

.c3d-card-front-1 h3 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 12px;
}

.c3d-card-front-1 p {
  font-size: 0.9rem;
  color: #666;
  text-align: center;
  line-height: 1.6;
}

.c3d-card-back-1 h3 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: 12px;
}

.c3d-card-back-1 p {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  line-height: 1.6;
  margin-bottom: 30px;
}

.c3d-stats-1 {
  display: flex;
  gap: 40px;
}

.c3d-stat-1 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.c3d-stat-1 .c3d-value-1 {
  font-size: 2rem;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

  opacity: 1 !important;}

.c3d-stat-1 .c3d-label-1 {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 1px;

  opacity: 1 !important;}

.c3d-scroll-hint-1 {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: #94a3b8;

  opacity: 1 !important;}

.c3d-scroll-text-1 {
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 2px;

  opacity: 1 !important;}

.c3d-scroll-arrow-1 {
  width: 20px;
  height: 20px;
  border-right: 2px solid #94a3b8;
  border-bottom: 2px solid #94a3b8;
  transform: rotate(45deg);
  animation: scrollBounce 2s ease-in-out infinite;

  opacity: 1 !important;}

@keyframes scrollBounce {
  0%,
  100% {
    transform: rotate(45deg) translateY(0);
  }
  50% {
    transform: rotate(45deg) translateY(10px);
  }
}

@media (max-width: 768px) {
  .c3d-card-container-1 {
    gap: 20px;
  }

  .c3d-card3d-1 {
    width: 240px;
    height: 320px;

  opacity: 1 !important;}
}
</style>
