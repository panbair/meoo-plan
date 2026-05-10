<template>
  <div class="card-border-wrapper-200">
    <div class="cb-stage-200" ref="stageRef">
      <div class="cb-bg-lines-200">
        <div class="cb-bg-line-200" v-for="i in 20" :key="i"></div>
      </div>
      <div class="cb-container-200" ref="containerRef">
        <h2 class="cb-title-200">BORDER GROWTH</h2>
        <p class="cb-subtitle-200">Corner-to-corner border animation</p>
        
        <div class="cb-cards-grid-200">
          <div 
            v-for="(card, index) in cards"
            :key="card.id"
            class="cb-card-200"
            ref="cardRefs"
            :data-index="index"
          >
            <div class="cb-card-inner-200">
              <div class="cb-card-content-200">
                <div class="cb-card-icon-200">{{ card.icon }}</div>
                <div class="cb-card-title-200">{{ card.title }}</div>
                <div class="cb-card-desc-200">{{ card.desc }}</div>
              </div>
              
              <!-- 边框角 -->
              <div class="cb-corner-200 cb-corner-tl-200">
                <div class="cb-corner-line-200 cb-corner-h-200"></div>
                <div class="cb-corner-line-200 cb-corner-v-200"></div>
              </div>
              <div class="cb-corner-200 cb-corner-tr-200">
                <div class="cb-corner-line-200 cb-corner-h-200"></div>
                <div class="cb-corner-line-200 cb-corner-v-200"></div>
              </div>
              <div class="cb-corner-200 cb-corner-bl-200">
                <div class="cb-corner-line-200 cb-corner-h-200"></div>
                <div class="cb-corner-line-200 cb-corner-v-200"></div>
              </div>
              <div class="cb-corner-200 cb-corner-br-200">
                <div class="cb-corner-line-200 cb-corner-h-200"></div>
                <div class="cb-corner-line-200 cb-corner-v-200"></div>
              </div>
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
  { id: 1, title: 'Design', desc: 'Visual aesthetics', icon: '🎨' },
  { id: 2, title: 'Build', desc: 'Core development', icon: '🛠️' },
  { id: 3, title: 'Test', desc: 'Quality assurance', icon: '🧪' },
  { id: 4, title: 'Deploy', desc: 'Production ready', icon: '🚀' },
  { id: 5, title: 'Scale', desc: 'Grow success', icon: '📈' },
  { id: 6, title: 'Evolve', desc: 'Continuous improvement', icon: '🔄' }
]

const initAnimations = () => {
  const stage = stageRef.value
  const container = containerRef.value
  if (!stage || !container) return

  const title = container.querySelector('.cb-title-200')
  const subtitle = container.querySelector('.cb-subtitle-200')
  const bgLines = gsap.utils.toArray('.cb-bg-line-200') as HTMLElement[]

  // 初始状态
  gsap.set(title, { opacity: 0, y: -50 })
  gsap.set(subtitle, { opacity: 0, y: -30 })
  gsap.set(cardRefs.value, { opacity: 0, scale: 0.9 })
  gsap.set(bgLines, { opacity: 0, scaleX: 0 })

  // 背景线动画
  gsap.to(bgLines, {
    scrollTrigger: {
      trigger: stage,
      start: 'top 80%',
      end: 'top 60%',
      scrub: 1
    },
    opacity: 0.1,
    scaleX: 1,
    stagger: 0.05
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

  // 卡片边框动画
  cardRefs.value.forEach((card, index) => {
    const corners = card.querySelectorAll('.cb-corner-200')
    const hLines = card.querySelectorAll('.cb-corner-h-200')
    const vLines = card.querySelectorAll('.cb-corner-v-200')

    gsap.set(corners, { opacity: 0 })
    gsap.set(hLines, { width: 0 })
    gsap.set(vLines, { height: 0 })

    gsap.to(card, {
      scrollTrigger: {
        trigger: stage,
        start: `top ${75 - index * 10}%`,
        end: `top ${50 - index * 8}%`,
        scrub: 0.8
      },
      opacity: 1,
      scale: 1
    })

    // 边框角入场
    gsap.to(corners, {
      scrollTrigger: {
        trigger: stage,
        start: `top ${70 - index * 10}%`,
        end: `top ${45 - index * 8}%`,
        scrub: 0.8
      },
      opacity: 1
    })

    // 边框线生长
    gsap.to(hLines, {
      scrollTrigger: {
        trigger: stage,
        start: `top ${68 - index * 10}%`,
        end: `top ${43 - index * 8}%`,
        scrub: 0.6
      },
      width: '60px',
      stagger: 0.1
    })

    gsap.to(vLines, {
      scrollTrigger: {
        trigger: stage,
        start: `top ${68 - index * 10}%`,
        end: `top ${43 - index * 8}%`,
        scrub: 0.6
      },
      height: '60px',
      stagger: 0.1
    })

    // 悬停效果
    card.addEventListener('mouseenter', () => {
      gsap.to(hLines, { width: '80px', duration: 0.3 })
      gsap.to(vLines, { height: '80px', duration: 0.3 })
      gsap.to(corners, {
        boxShadow: '0 0 20px rgba(100, 200, 255, 0.8)',
        duration: 0.3
      })
    })

    card.addEventListener('mouseleave', () => {
      gsap.to(hLines, { width: '60px', duration: 0.3 })
      gsap.to(vLines, { height: '60px', duration: 0.3 })
      gsap.to(corners, { boxShadow: 'none', duration: 0.3 })
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

.card-border-wrapper-200 {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  overflow: hidden;

  opacity: 1 !important;}

.cb-stage-200 {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;

  opacity: 1 !important;}

.cb-bg-lines-200 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.cb-bg-line-200 {
  position: absolute;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(100, 200, 255, 0.3), transparent);
  transform: translateX(-100%);

  opacity: 1 !important;}

.cb-container-200 {
  position: relative;
  text-align: center;
  z-index: 10;
  max-width: 1200px;

  opacity: 1 !important;}

.cb-title-200 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 20px;
  letter-spacing: 6px;
  color: #ffffff;
  text-shadow: 0 0 30px rgba(100, 200, 255, 0.5);

  opacity: 1 !important;}

.cb-subtitle-200 {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 2px;
  margin-bottom: 60px;
  text-transform: uppercase;

  opacity: 1 !important;}

.cb-cards-grid-200 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  padding: 20px;

  opacity: 1 !important;}

.cb-card-200 {
  position: relative;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.cb-card-200:hover {
  transform: translateY(-10px);
}

.cb-card-inner-200 {
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 40px 30px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;

  opacity: 1 !important;}

.cb-card-content-200 {
  position: relative;
  z-index: 2;
}

.cb-card-icon-200 {
  font-size: 3rem;
  margin-bottom: 20px;

  opacity: 1 !important;}

.cb-card-title-200 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 10px;

  opacity: 1 !important;}

.cb-card-desc-200 {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);

  opacity: 1 !important;}

.cb-corner-200 {
  position: absolute;
  width: 60px;
  height: 60px;
  pointer-events: none;

  opacity: 1 !important;}

.cb-corner-tl-200 {
  top: 0;
  left: 0;
}

.cb-corner-tr-200 {
  top: 0;
  right: 0;
}

.cb-corner-bl-200 {
  bottom: 0;
  left: 0;
}

.cb-corner-br-200 {
  bottom: 0;
  right: 0;
}

.cb-corner-h-200 {
  position: absolute;
  height: 2px;
  background: linear-gradient(90deg, #64c8ff, #96e6a1);
  transition: width 0.3s ease;

  opacity: 1 !important;}

.cb-corner-tl-200 .cb-corner-h-200,
.cb-corner-bl-200 .cb-corner-h-200 {
  left: 0;
  top: 0;
  transform-origin: left;
}

.cb-corner-tr-200 .cb-corner-h-200,
.cb-corner-br-200 .cb-corner-h-200 {
  right: 0;
  top: 0;
  transform-origin: right;
}

.cb-corner-v-200 {
  position: absolute;
  width: 2px;
  background: linear-gradient(180deg, #64c8ff, #96e6a1);
  transition: height 0.3s ease;

  opacity: 1 !important;}

.cb-corner-tl-200 .cb-corner-v-200,
.cb-corner-tr-200 .cb-corner-v-200 {
  left: 0;
  top: 0;
  transform-origin: top;
}

.cb-corner-bl-200 .cb-corner-v-200,
.cb-corner-br-200 .cb-corner-v-200 {
  left: 0;
  bottom: 0;
  transform-origin: bottom;
}

@media (max-width: 768px) {
  .cb-title-200 {
    font-size: 2rem;
  
  opacity: 1 !important;}

  .cb-cards-grid-200 {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  .cb-card-inner-200 {
    padding: 30px 20px;
  
  opacity: 1 !important;}
}
</style>
