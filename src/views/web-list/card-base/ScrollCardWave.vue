<template>
  <section class="scw-scroll-card-wave-126">
    <div class="scw-container-126">
      <h2 class="scw-section-title-126">滚动卡片波浪</h2>
      <p class="scw-section-subtitle-126">Scroll Card Wave Animation</p>

      <div class="scw-wave-container-126">
        <div
          v-for="(card, index) in cardData"
          :key="index"
          class="scw-card-126"
          :data-index="index"
          ref="cards"
        >
          <div class="scw-card-inner-126">
            <div class="scw-card-front-126">
              <div class="scw-card-icon-126">
                <span class="scw-icon-126">{{ card.icon }}</span>
              </div>
              <h3 class="scw-card-title-126">{{ card.title }}</h3>
              <p class="scw-card-desc-126">{{ card.description }}</p>
              <div class="scw-card-number-126">{{ String(index + 1).padStart(2, '0') }}</div>
            </div>
            <div class="scw-card-back-126">
              <div class="scw-back-content-126">
                <h4>{{ card.title }}</h4>
                <p>{{ card.detail }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const cards = ref<HTMLElement[]>([])

const cardData = [
  {
    icon: '✨',
    title: '创意设计',
    description: '打破常规，创造独特',
    detail: '每个设计都是独特的艺术表达，融合创意与功能，创造令人惊叹的视觉体验。'
  },
  {
    icon: '🚀',
    title: '性能优化',
    description: '极致体验，流畅交互',
    detail: '通过精细的动画优化和性能调优，确保每一次交互都丝般顺滑。'
  },
  {
    icon: '🎨',
    title: '视觉美学',
    description: '精致细节，完美呈现',
    detail: '注重视觉的每一个细节，从色彩到排版，从动画到布局，追求完美。'
  },
  {
    icon: '💡',
    title: '智能交互',
    description: '自然流畅，直觉操作',
    detail: '设计直观的交互方式，让用户轻松理解和使用，提升整体体验。'
  },
  {
    icon: '🌟',
    title: '用户至上',
    description: '以人为本，用心服务',
    detail: '以用户需求为中心，通过深入的调研和理解，创造真正有价值的产品。'
  }
]

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 标题动画 - 波浪效果
    gsap.from('.scw-section-title-126', {
      scrollTrigger: {
        trigger: '.scw-scroll-card-wave-126',
        start: 'top 85%',
        end: 'top 35%',
        scrub: 1.5
      },
      y: 100,
      rotationX: -30,
      opacity: 0.4,
      filter: 'blur(8px)',
      ease: 'power3.out'
    })

    // 副标题波浪
    gsap.from('.scw-section-subtitle-126', {
      scrollTrigger: {
        trigger: '.scw-scroll-card-wave-126',
        start: 'top 85%',
        end: 'top 35%',
        scrub: 1.5
      },
      y: 80,
      opacity: 0.3,
      filter: 'blur(6px)',
      ease: 'power3.out'
    })

    cards.value.forEach((card, index) => {
      const cardInner = card.querySelector('.scw-card-inner-126') as HTMLElement
      const icon = card.querySelector('.scw-icon-126') as HTMLElement
      const title = card.querySelector('.scw-card-title-126') as HTMLElement
      const desc = card.querySelector('.scw-card-desc-126') as HTMLElement
      const number = card.querySelector('.scw-card-number-126') as HTMLElement

      // 计算波浪偏移
      const xOffset = Math.sin(index * 0.8) * 100
      const yOffset = Math.cos(index * 0.8) * 50

      // 初始状态 - 波浪分布（半可见状态）
      gsap.set(card, {
        x: xOffset,
        y: yOffset,
        scale: 0.8 + (index % 2) * 0.1,
        rotation: (index - 2) * 5,
        opacity: 0.5,
        filter: 'blur(4px)'
      })

      gsap.set(icon, { scale: 0.5, rotation: -90 })
      gsap.set(title, { y: 50, opacity: 0.4 })
      gsap.set(desc, { y: 40, opacity: 0.3 })
      gsap.set(number, { scale: 0.5, opacity: 0.3 })

      // 波浪入场动画
      gsap.to(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 100%',
          end: 'top 35%',
          scrub: 2,
          toggleActions: 'play none none reverse'
        },
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
        opacity: 1,
        filter: 'blur(0px)',
        ease: 'elastic.out(1, 0.8)'
      })

      // 图标弹跳入场
      gsap.to(icon, {
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          end: 'top 50%',
          scrub: 1.5
        },
        scale: 1,
        rotation: 0,
        ease: 'back.out(2)'
      })

      // 标题滑入
      gsap.to(title, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          end: 'top 45%',
          scrub: 1.5
        },
        y: 0,
        opacity: 1,
        ease: 'power3.out'
      })

      // 描述淡入
      gsap.to(desc, {
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          end: 'top 40%',
          scrub: 1.5
        },
        y: 0,
        opacity: 1,
        ease: 'power2.out'
      })

      // 数字放大
      gsap.to(number, {
        scrollTrigger: {
          trigger: card,
          start: 'top 75%',
          end: 'top 35%',
          scrub: 1.5
        },
        scale: 1,
        opacity: 1,
        ease: 'elastic.out(1, 0.5)'
      })

      // 持续波浪动画
      gsap.to(card, {
        y: (index % 2 === 0 ? 15 : -15),
        duration: 2 + index * 0.3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: index * 0.2
      })

      // 图标持续旋转
      gsap.to(icon, {
        rotation: 360,
        duration: 10 + index * 2,
        repeat: -1,
        ease: 'none',
        delay: index * 0.3
      })

      // 悬停效果
      card.addEventListener('mouseenter', () => {
        gsap.to(cardInner, {
          rotateY: 180,
          duration: 0.6,
          ease: 'power3.inOut'
        })
        gsap.to(card, {
          scale: 1.05,
          boxShadow: '0 20px 60px rgba(168, 85, 247, 0.4)',
          duration: 0.4,
          ease: 'power2.out'
        })
      })

      card.addEventListener('mouseleave', () => {
        gsap.to(cardInner, {
          rotateY: 0,
          duration: 0.6,
          ease: 'power3.inOut'
        })
        gsap.to(card, {
          scale: 1,
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
          duration: 0.4,
          ease: 'power2.out'
        })
      })
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.scw-scroll-card-wave-126 {
  min-height: 100vh;
  padding: 100px 20px;
  background: linear-gradient(180deg, #0a0a1a 0%, #1e1e3f 50%, #0a0a1a 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(ellipse at 30% 50%, rgba(59, 130, 246, 0.06) 0%, transparent 60%),
      radial-gradient(ellipse at 70% 50%, rgba(236, 72, 153, 0.06) 0%, transparent 60%);
    pointer-events: none;
  
  opacity: 1 !important;}
}

.scw-container-126 {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.scw-section-title-126 {
  text-align: center;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 900;
  color: #fff;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #3b82f6, #ec4899, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 60px rgba(59, 130, 246, 0.4);

  opacity: 1 !important;}

.scw-section-subtitle-126 {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 120px;
  letter-spacing: 0.2em;
  text-transform: uppercase;

  opacity: 1 !important;}

.scw-wave-container-126 {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 40px;
  perspective: 2000px;
}

.scw-card-126 {
  flex: 0 0 280px;
  height: 380px;
  position: relative;
  perspective: 1500px;

  opacity: 1 !important;}

.scw-card-inner-126 {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s ease;

  opacity: 1 !important;}

.scw-card-front-126,
.scw-card-back-126 {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);

  opacity: 1 !important;}

.scw-card-front-126 {
  background: linear-gradient(135deg, rgba(30, 30, 63, 0.9) 0%, rgba(15, 15, 47, 0.9) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 40px 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: box-shadow 0.4s ease, border-color 0.4s ease;

  opacity: 1 !important;}

.scw-card-126:hover .scw-card-front-126 {
  border-color: rgba(168, 85, 247, 0.5);
  box-shadow: 0 0 30px rgba(168, 85, 247, 0.2), inset 0 0 30px rgba(168, 85, 247, 0.05);

  opacity: 1 !important;}

.scw-card-back-126 {
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.9) 0%, rgba(168, 85, 247, 0.9) 100%);
  transform: rotateY(180deg);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  border: 1px solid rgba(255, 255, 255, 0.2);

  opacity: 1 !important;}

.scw-card-icon-126 {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  border: 2px solid rgba(59, 130, 246, 0.3);

  opacity: 1 !important;}

.scw-icon-126 {
  font-size: 2.5rem;

  opacity: 1 !important;}

.scw-card-title-126 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 16px;

  opacity: 1 !important;}

.scw-card-desc-126 {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  margin-bottom: auto;

  opacity: 1 !important;}

.scw-card-number-126 {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 2.5rem;
  font-weight: 900;
  color: transparent;
  -webkit-text-stroke: 2px rgba(255, 255, 255, 0.2);
  font-family: 'Arial', sans-serif;

  opacity: 1 !important;}

.scw-back-content-126 {
  text-align: center;
  color: #fff;

  opacity: 1 !important;}

.scw-back-content-126 h4 {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 16px;
}

.scw-back-content-126 p {
  font-size: 0.9rem;
  line-height: 1.6;
  opacity: 0.9;
}

@media (max-width: 768px) {
  .scw-wave-container-126 {
    gap: 30px;
  }

  .scw-card-126 {
    flex: 0 0 250px;
    height: 340px;
  
  opacity: 1 !important;}

  .scw-card-front-126 {
    padding: 30px 20px;
  
  opacity: 1 !important;}

  .scw-card-icon-126 {
    width: 70px;
    height: 70px;
    margin-bottom: 20px;
  
  opacity: 1 !important;}

  .scw-icon-126 {
    font-size: 2rem;
  
  opacity: 1 !important;}

  .scw-card-title-126 {
    font-size: 1.3rem;
  
  opacity: 1 !important;}

  .scw-card-desc-126 {
    font-size: 0.85rem;
  
  opacity: 1 !important;}

  .scw-section-title-126 {
    margin-bottom: 80px;
  }

  .scw-section-subtitle-126 {
    margin-bottom: 60px;
    font-size: 0.9rem;
  
  opacity: 1 !important;}

  .scw-container-126 {
    padding: 0 20px;
  
  opacity: 1 !important;}
}
</style>
