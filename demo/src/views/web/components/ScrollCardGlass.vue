<template>
  <div class="card-glass-wrapper-202">
    <div class="cg-stage-202" ref="stageRef">
      <div class="cg-glass-bg-202">
        <div class="cg-glass-layer-202" v-for="i in 4" :key="i"></div>
      </div>
      <div class="cg-container-202" ref="containerRef">
        <h2 class="cg-title-202">GLASSMORPHISM</h2>
        <p class="cg-subtitle-202">Frosted glass with glowing borders</p>
        
        <div class="cg-glass-cards-202">
          <div 
            v-for="(card, index) in cards"
            :key="card.id"
            class="cg-glass-card-202"
            ref="cardRefs"
            :data-index="index"
            @mousemove="onCardMouseMove($event, index)"
            @mouseleave="onCardMouseLeave(index)"
          >
            <div class="cg-glass-inner-202">
              <div class="cg-glass-content-202">
                <div class="cg-glass-icon-202">{{ card.icon }}</div>
                <div class="cg-glass-title-202">{{ card.title }}</div>
                <div class="cg-glass-desc-202">{{ card.desc }}</div>
                <div class="cg-glass-stats-202">
                  <div class="cg-stat-202">
                    <span class="cg-stat-value-202">{{ card.stat1 }}</span>
                    <span class="cg-stat-label-202">{{ card.label1 }}</span>
                  </div>
                  <div class="cg-stat-202">
                    <span class="cg-stat-value-202">{{ card.stat2 }}</span>
                    <span class="cg-stat-label-202">{{ card.label2 }}</span>
                  </div>
                </div>
              </div>
              <div class="cg-glass-border-202"></div>
              <div class="cg-glass-highlight-202"></div>
            </div>
          </div>
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
const cardRefs = ref<HTMLElement[]>([])

const cards = [
  { id: 1, title: 'Performance', desc: 'Lightning fast', icon: '⚡', stat1: '98%', label1: 'Speed', stat2: '4.9', label2: 'Rating' },
  { id: 2, title: 'Security', desc: 'Bank-level protection', icon: '🔒', stat1: '256', label1: 'Bit', stat2: '99.9', label2: 'Uptime' },
  { id: 3, title: 'Scalability', desc: 'Grow infinitely', icon: '📈', stat1: '10M', label1: 'Users', stat2: '99', label2: 'Regions' },
  { id: 4, title: 'Reliability', desc: 'Always available', icon: '✅', stat1: '24/7', label1: 'Support', stat2: '5', label2: 'Years' }
]

const onCardMouseMove = (event: MouseEvent, index: number) => {
  const card = cardRefs.value[index]
  const rect = card.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  
  const highlight = card.querySelector('.cg-glass-highlight-202')
  if (highlight) {
    gsap.to(highlight, {
      left: x,
      top: y,
      duration: 0.2
    })
  }
}

const onCardMouseLeave = (index: number) => {
  const card = cardRefs.value[index]
  const highlight = card.querySelector('.cg-glass-highlight-202')
  if (highlight) {
    gsap.to(highlight, {
      left: '50%',
      top: '50%',
      duration: 0.5
    })
  }
}

const initAnimations = () => {
  const stage = stageRef.value
  const container = containerRef.value
  if (!stage || !container) return

  const title = container.querySelector('.cg-title-202')
  const subtitle = container.querySelector('.cg-subtitle-202')
  const glassLayers = gsap.utils.toArray('.cg-glass-layer-202') as HTMLElement[]

  // 初始状态
  gsap.set(title, { opacity: 0, y: -50, filter: 'blur(10px)' })
  gsap.set(subtitle, { opacity: 0, y: -30 })
  gsap.set(cardRefs.value, { opacity: 0, scale: 0.8, filter: 'blur(10px)' })
  gsap.set(glassLayers, { opacity: 0, scale: 1.2 })

  // 玻璃背景层
  gsap.to(glassLayers, {
    scrollTrigger: {
      trigger: stage,
      start: 'top 80%',
      end: 'top 50%',
      scrub: 1
    },
    opacity: 0.5,
    scale: 1,
    stagger: 0.2
  })

  glassLayers.forEach((layer, i) => {
    gsap.to(layer, {
      backgroundPosition: '200% 200%',
      duration: 10 + i * 2,
      repeat: -1,
      ease: 'none'
    })
  })

  // 标题入场（带模糊效果）
  gsap.to(title, {
    scrollTrigger: {
      trigger: stage,
      start: 'top 75%',
      end: 'top 60%',
      scrub: 1
    },
    opacity: 1,
    y: 0,
    filter: 'blur(0px)'
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

  // 玻璃卡片入场
  cardRefs.value.forEach((card, index) => {
    const border = card.querySelector('.cg-glass-border-202')
    const highlight = card.querySelector('.cg-glass-highlight-202')
    
    gsap.set(border, { opacity: 0 })
    gsap.set(highlight, { opacity: 0.5 })

    gsap.to(card, {
      scrollTrigger: {
        trigger: stage,
        start: `top ${70 - index * 8}%`,
        end: `top ${40 - index * 6}%`,
        scrub: 0.8
      },
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      duration: 1
    })

    // 边框发光
    gsap.to(border, {
      scrollTrigger: {
        trigger: stage,
        start: `top ${65 - index * 8}%`,
        end: `top ${35 - index * 6}%`,
        scrub: 0.6
      },
      opacity: 1
    })

    // 边框发光脉冲
    gsap.to(border, {
      boxShadow: [
        '0 0 10px rgba(100, 200, 255, 0.3)',
        '0 0 30px rgba(100, 200, 255, 0.6)',
        '0 0 10px rgba(100, 200, 255, 0.3)'
      ],
      duration: 3,
      repeat: -1,
      ease: 'sine.inOut',
      delay: index * 0.3
    })

    // 悬停效果
    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        scale: 1.05,
        duration: 0.3,
        ease: 'back.out(1.7)'
      })
      gsap.to(border, {
        borderColor: 'rgba(100, 200, 255, 0.8)',
        duration: 0.3
      })
    })

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        scale: 1,
        duration: 0.3
      })
      gsap.to(border, {
        borderColor: 'rgba(255, 255, 255, 0.2)',
        duration: 0.3
      })
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

.card-glass-wrapper-202 {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%);
  overflow: hidden;

  opacity: 1 !important;}

.cg-stage-202 {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;

  opacity: 1 !important;}

.cg-glass-bg-202 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.cg-glass-layer-202 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    rgba(100, 200, 255, 0.1),
    rgba(150, 100, 255, 0.1),
    rgba(200, 100, 255, 0.1),
    rgba(100, 200, 255, 0.1)
  );
  background-size: 400% 400%;
  mix-blend-mode: overlay;

  opacity: 1 !important;}

.cg-container-202 {
  position: relative;
  text-align: center;
  z-index: 10;
  max-width: 1200px;

  opacity: 1 !important;}

.cg-title-202 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 20px;
  letter-spacing: 6px;
  color: #ffffff;
  text-shadow: 0 0 30px rgba(100, 200, 255, 0.5);

  opacity: 1 !important;}

.cg-subtitle-202 {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 2px;
  margin-bottom: 60px;
  text-transform: uppercase;

  opacity: 1 !important;}

.cg-glass-cards-202 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
  padding: 20px;

  opacity: 1 !important;}

.cg-glass-card-202 {
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cg-glass-inner-202 {
  position: relative;
  padding: 40px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;

  opacity: 1 !important;}

.cg-glass-border-202 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 20px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 10px rgba(100, 200, 255, 0.3);
  pointer-events: none;
  transition: all 0.3s ease;

  opacity: 1 !important;}

.cg-glass-highlight-202 {
  position: absolute;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  transition: left 0.2s ease, top 0.2s ease;

  opacity: 1 !important;}

.cg-glass-content-202 {
  position: relative;
  z-index: 2;
}

.cg-glass-icon-202 {
  font-size: 3.5rem;
  margin-bottom: 20px;
  filter: drop-shadow(0 0 20px rgba(100, 200, 255, 0.6));

  opacity: 1 !important;}

.cg-glass-title-202 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 10px;
  text-shadow: 0 0 15px rgba(255, 255, 255, 0.5);

  opacity: 1 !important;}

.cg-glass-desc-202 {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 25px;

  opacity: 1 !important;}

.cg-glass-stats-202 {
  display: flex;
  justify-content: space-around;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.cg-stat-202 {
  text-align: center;

  opacity: 1 !important;}

.cg-stat-value-202 {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: #64c8ff;
  text-shadow: 0 0 15px rgba(100, 200, 255, 0.6);

  opacity: 1 !important;}

.cg-stat-label-202 {
  display: block;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 5px;

  opacity: 1 !important;}

@media (max-width: 768px) {
  .cg-title-202 {
    font-size: 2rem;
  
  opacity: 1 !important;}

  .cg-glass-cards-202 {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .cg-glass-inner-202 {
    padding: 30px;
  
  opacity: 1 !important;}

  .cg-glass-icon-202 {
    font-size: 3rem;
  
  opacity: 1 !important;}

  .cg-glass-title-202 {
    font-size: 1.5rem;
  
  opacity: 1 !important;}
}
</style>
