<template>
  <div class="card-zoom-wrapper-198">
    <div class="cz-stage-198" ref="stageRef">
      <div class="cz-bg-effects-198">
        <div class="cz-bg-orb-198" v-for="i in 4" :key="i"></div>
      </div>
      <div class="cz-container-198" ref="containerRef">
        <h2 class="cz-title-198">CARD FOCUS</h2>
        <p class="cz-subtitle-198">Scroll to zoom active card</p>
        
        <div class="cz-cards-wrapper-198" ref="cardsWrapper">
          <div 
            v-for="(card, index) in cards"
            :key="card.id"
            class="cz-card-198"
            :class="{ 'active': activeCard === index }"
            ref="cardRefs"
            :data-index="index"
          >
            <div class="cz-card-inner-198">
              <div class="cz-card-image-198">
                <div class="cz-image-placeholder-198">
                  <span class="cz-icon-198">{{ card.icon }}</span>
                </div>
              </div>
              <div class="cz-card-content-198">
                <div class="cz-card-number-198">{{ String(index + 1).padStart(2, '0') }}</div>
                <div class="cz-card-title-198">{{ card.title }}</div>
                <div class="cz-card-desc-198">{{ card.desc }}</div>
              </div>
              <div class="cz-card-glow-198"></div>
            </div>
          </div>
        </div>

        <div class="cz-indicator-198">
          <div 
            v-for="(card, index) in cards"
            :key="index"
            class="cz-dot-198"
            :class="{ active: activeCard === index }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const stageRef = ref<HTMLElement>()
const containerRef = ref<HTMLElement>()
const cardsWrapper = ref<HTMLElement>()
const cardRefs = ref<HTMLElement[]>([])
const activeCard = ref(0)

const cards = [
  { id: 1, title: 'Design', desc: 'Create stunning visuals', icon: '🎨' },
  { id: 2, title: 'Code', desc: 'Build powerful applications', icon: '💻' },
  { id: 3, title: 'Launch', desc: 'Deploy to the world', icon: '🚀' },
  { id: 4, title: 'Grow', desc: 'Scale your success', icon: '📈' },
  { id: 5, title: 'Innovate', desc: 'Lead the future', icon: '💡' }
]

const updateActiveCard = (progress: number) => {
  const total = cards.length
  const activeIndex = Math.min(Math.floor(progress * total), total - 1)
  activeCard.value = activeIndex

  cardRefs.value.forEach((card, index) => {
    const isActive = index === activeIndex
    const distance = Math.abs(index - activeIndex)
    
    gsap.to(card, {
      scale: isActive ? 1.15 : 1 - distance * 0.15,
      z: isActive ? 100 : -distance * 50,
      opacity: isActive ? 1 : 0.4,
      boxShadow: isActive 
        ? '0 30px 60px rgba(100, 200, 255, 0.4)' 
        : '0 10px 30px rgba(0, 0, 0, 0.3)',
      duration: 0.4,
      ease: 'power2.out'
    })

    const glow = card.querySelector('.cz-card-glow-198')
    if (glow) {
      gsap.to(glow, {
        opacity: isActive ? 1 : 0,
        scale: isActive ? 1.2 : 0.8,
        duration: 0.4
      })
    }
  })
}

const initAnimations = () => {
  const stage = stageRef.value
  const container = containerRef.value
  const wrapper = cardsWrapper.value
  if (!stage || !container || !wrapper) return

  const title = container.querySelector('.cz-title-198')
  const subtitle = container.querySelector('.cz-subtitle-198')
  const bgOrbs = gsap.utils.toArray('.cz-bg-orb-198') as HTMLElement[]
  const dots = gsap.utils.toArray('.cz-dot-198') as HTMLElement[]

  // 初始状态
  gsap.set(title, { opacity: 0, y: -50 })
  gsap.set(subtitle, { opacity: 0, y: -30 })
  gsap.set(cardRefs.value, { scale: 0.8, opacity: 0, z: -100 })
  gsap.set(bgOrbs, { opacity: 0, scale: 0 })
  gsap.set(dots, { opacity: 0, scale: 0.5 })

  // 背景光球
  gsap.to(bgOrbs, {
    scrollTrigger: {
      trigger: stage,
      start: 'top 80%',
      end: 'top 50%',
      scrub: 1
    },
    opacity: 0.3,
    scale: 1,
    stagger: 0.2
  })

  bgOrbs.forEach((orb, i) => {
    gsap.to(orb, {
      x: () => (Math.random() - 0.5) * 100,
      y: () => (Math.random() - 0.5) * 100,
      duration: 5 + i,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
  })

  // 标题入场
  gsap.to(title, {
    scrollTrigger: {
      trigger: stage,
      start: 'top 75%',
      end: 'top 60%',
      scrub: 1
    },
    opacity: 1,
    y: 0
  })

  gsap.to(subtitle, {
    scrollTrigger: {
      trigger: stage,
      start: 'top 70%',
      end: 'top 55%',
      scrub: 1
    },
    opacity: 1,
    y: 0
  })

  // 卡片滚动聚焦效果
  ScrollTrigger.create({
    trigger: stage,
    start: 'top 60%',
    end: 'top 30%',
    scrub: 0.5,
    onUpdate: (self) => {
      updateActiveCard(self.progress)
    }
  })

  // 初始卡片动画
  gsap.to(cardRefs.value, {
    scrollTrigger: {
      trigger: stage,
      start: 'top 65%',
      end: 'top 55%',
      scrub: 0.5
    },
    scale: 1,
    opacity: 1,
    stagger: 0.1
  })

  // 指示器
  gsap.to(dots, {
    scrollTrigger: {
      trigger: stage,
      start: 'top 50%',
      end: 'top 40%',
      scrub: 0.5
    },
    opacity: 1,
    scale: 1,
    stagger: 0.1
  })

  // 卡片悬停效果
  cardRefs.value.forEach((card, index) => {
    card.addEventListener('mouseenter', () => {
      if (activeCard.value !== index) {
        gsap.to(card, {
          scale: 1.1,
          duration: 0.3,
          ease: 'power2.out'
        })
      }
    })

    card.addEventListener('mouseleave', () => {
      if (activeCard.value !== index) {
        const distance = Math.abs(index - activeCard.value)
        gsap.to(card, {
          scale: 1 - distance * 0.15,
          duration: 0.3
        })
      }
    })

    card.addEventListener('click', () => {
      activeCard.value = index
      updateActiveCard((index + 1) / cards.length)
    })
  })
}

onMounted(() => {
  initAnimations()
})

onUnmounted(() => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
})
</script>

<style scoped>
/* GSAP opacity fix: ensure content is always visible */

.card-zoom-wrapper-198 {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  overflow: hidden;

  opacity: 1 !important;}

.cz-stage-198 {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  perspective: 1500px;

  opacity: 1 !important;}

.cz-bg-effects-198 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.cz-bg-orb-198 {
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(100, 200, 255, 0.3) 0%, transparent 70%);
  filter: blur(40px);

  opacity: 1 !important;}

.cz-container-198 {
  position: relative;
  text-align: center;
  z-index: 10;
  max-width: 1200px;

  opacity: 1 !important;}

.cz-title-198 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 20px;
  letter-spacing: 6px;
  color: #ffffff;
  text-shadow: 0 0 30px rgba(100, 200, 255, 0.5);

  opacity: 1 !important;}

.cz-subtitle-198 {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 2px;
  margin-bottom: 60px;
  text-transform: uppercase;

  opacity: 1 !important;}

.cz-cards-wrapper-198 {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
  padding: 40px 20px;
  perspective: 2000px;

  opacity: 1 !important;}

.cz-card-198 {
  width: 200px;
  height: 280px;
  position: relative;
  cursor: pointer;
  transform-style: preserve-3d;
  transition: all 0.4s ease;

  opacity: 1 !important;}

.cz-card-inner-198 {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(20px);
  overflow: hidden;
  transition: all 0.4s ease;

  opacity: 1 !important;}

.cz-card-198.active .cz-card-inner-198 {
  border-color: rgba(100, 200, 255, 0.6);
  box-shadow: 0 30px 60px rgba(100, 200, 255, 0.4);

  opacity: 1 !important;}

.cz-card-image-198 {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(100, 200, 255, 0.2), rgba(150, 100, 255, 0.2));

  opacity: 1 !important;}

.cz-image-placeholder-198 {
  font-size: 3rem;

  opacity: 1 !important;}

.cz-card-content-198 {
  padding: 20px;
  text-align: left;

  opacity: 1 !important;}

.cz-card-number-198 {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.4);
  font-weight: 700;
  margin-bottom: 10px;
  letter-spacing: 2px;

  opacity: 1 !important;}

.cz-card-title-198 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8px;

  opacity: 1 !important;}

.cz-card-desc-198 {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.4;

  opacity: 1 !important;}

.cz-card-glow-198 {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(100, 200, 255, 0.4) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  pointer-events: none;
  opacity: 0;
  transition: all 0.4s ease;
}

.cz-indicator-198 {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 40px;
}

.cz-dot-198 {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  cursor: pointer;

  opacity: 1 !important;}

.cz-dot-198.active {
  background: #64c8ff;
  border-color: #64c8ff;
  box-shadow: 0 0 15px rgba(100, 200, 255, 0.6);
  transform: scale(1.3);

  opacity: 1 !important;}

.cz-dot-198:hover {
  background: rgba(100, 200, 255, 0.5);
}

@media (max-width: 768px) {
  .cz-title-198 {
    font-size: 2rem;
  
  opacity: 1 !important;}

  .cz-cards-wrapper-198 {
    gap: 15px;
  }

  .cz-card-198 {
    width: 150px;
    height: 220px;
  
  opacity: 1 !important;}

  .cz-card-title-198 {
    font-size: 1.2rem;
  
  opacity: 1 !important;}

  .cz-icon-198 {
    font-size: 2.5rem;
  
  opacity: 1 !important;}
}
</style>
