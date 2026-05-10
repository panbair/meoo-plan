<template>
  <div class="card-morph-wrapper-201">
    <div class="cm-stage-201" ref="stageRef">
      <div class="cm-bg-particles-201">
        <div class="cm-particle-201" v-for="i in 40" :key="i"></div>
      </div>
      <div class="cm-container-201" ref="containerRef">
        <h2 class="cm-title-201">SHAPE MORPH</h2>
        <p class="cm-subtitle-201">Dynamic card transformation</p>
        
        <div class="cm-shapes-scene-201">
          <div 
            v-for="(card, index) in cards"
            :key="card.id"
            class="cm-shape-card-201"
            ref="cardRefs"
            :data-index="index"
            :style="cardStyle(index)"
          >
            <div class="cm-shape-inner-201">
              <div class="cm-shape-icon-201">{{ card.icon }}</div>
              <div class="cm-shape-title-201">{{ card.title }}</div>
              <div class="cm-shape-desc-201">{{ card.desc }}</div>
            </div>
            <div class="cm-shape-glow-201"></div>
          </div>
        </div>

        <div class="cm-morph-indicator-201">
          <div 
            v-for="(shape, index) in shapes"
            :key="index"
            class="cm-indicator-shape-201"
            :class="{ active: currentShape === index }"
            @click="morphTo(index)"
          >
            <div class="cm-indicator-label-201">{{ shape.name }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const stageRef = ref<HTMLElement>()
const containerRef = ref<HTMLElement>()
const cardRefs = ref<HTMLElement[]>([])
const currentShape = ref(0)

const shapes = [
  { name: 'Circle', borderRadius: '50%' },
  { name: 'Square', borderRadius: '10%' },
  { name: 'Pill', borderRadius: '50px' },
  { name: 'Diamond', borderRadius: '0%', clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }
]

const cards = [
  { id: 1, title: 'Adapt', desc: 'Flexible approach', icon: '🔄' },
  { id: 2, title: 'Transform', desc: 'Evolve constantly', icon: '✨' },
  { id: 3, title: 'Innovate', desc: 'Break boundaries', icon: '💡' },
  { id: 4, title: 'Create', desc: 'Design freely', icon: '🎨' }
]

const cardStyle = (index: number) => {
  const shape = shapes[currentShape.value]
  return {
    borderRadius: shape.borderRadius,
    clipPath: shape.clipPath || 'none'
  }
}

const morphTo = (shapeIndex: number) => {
  currentShape.value = shapeIndex
  const shape = shapes[shapeIndex]
  
  cardRefs.value.forEach((card, index) => {
    gsap.to(card, {
      borderRadius: shape.borderRadius,
      duration: 0.8,
      ease: 'elastic.out(1, 0.7)'
    })

    if (shape.clipPath) {
      gsap.to(card, {
        clipPath: shape.clipPath,
        duration: 0.8,
        ease: 'power2.inOut'
      })
    } else {
      gsap.to(card, {
        clipPath: 'none',
        duration: 0.8,
        ease: 'power2.inOut'
      })
    }
  })
}

const initAnimations = () => {
  const stage = stageRef.value
  const container = containerRef.value
  if (!stage || !container) return

  const title = container.querySelector('.cm-title-201')
  const subtitle = container.querySelector('.cm-subtitle-201')
  const particles = gsap.utils.toArray('.cm-particle-201') as HTMLElement[]
  const indicators = gsap.utils.toArray('.cm-indicator-shape-201') as HTMLElement[]

  // 初始状态
  gsap.set(title, { opacity: 0, y: -50, rotation: -10 })
  gsap.set(subtitle, { opacity: 0, y: -30 })
  gsap.set(cardRefs.value, { opacity: 0, scale: 0.5, borderRadius: '50%' })
  gsap.set(particles, { opacity: 0, scale: 0 })
  gsap.set(indicators, { opacity: 0, scale: 0.8 })

  // 粒子背景
  gsap.to(particles, {
    scrollTrigger: {
      trigger: stage,
      start: 'top 80%',
      end: 'top 50%',
      scrub: 1
    },
    opacity: 0.4,
    scale: 1,
    stagger: { each: 0.02, from: 'random' }
  })

  particles.forEach((particle, i) => {
    gsap.to(particle, {
      x: () => (Math.random() - 0.5) * 100,
      y: () => (Math.random() - 0.5) * 100,
      duration: 3 + Math.random() * 2,
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
    y: 0,
    rotation: 0
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

  // 卡片变形动画
  cardRefs.value.forEach((card, index) => {
    const glow = card.querySelector('.cm-shape-glow-201')
    
    gsap.set(glow, { opacity: 0, scale: 0.5 })

    gsap.to(card, {
      scrollTrigger: {
        trigger: stage,
        start: `top ${70 - index * 8}%`,
        end: `top ${40 - index * 6}%`,
        scrub: 0.8
      },
      opacity: 1,
      scale: 1,
      borderRadius: '50%',
      duration: 1
    })

    // 持续变形动画
    gsap.to(card, {
      borderRadius: ['50%', '30%', '50%', '70%', '50%'],
      duration: 4,
      repeat: -1,
      ease: 'power2.inOut',
      delay: index * 0.2
    })

    gsap.to(glow, {
      scrollTrigger: {
        trigger: stage,
        start: `top ${65 - index * 8}%`,
        end: `top ${35 - index * 6}%`,
        scrub: 0.6
      },
      opacity: 0.3,
      scale: 1
    })

    // 悬停效果
    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        scale: 1.1,
        rotate: 15,
        duration: 0.3,
        ease: 'back.out(1.7)'
      })
      gsap.to(glow, { opacity: 0.6, duration: 0.3 })
    })

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        scale: 1,
        rotate: 0,
        duration: 0.3
      })
      gsap.to(glow, { opacity: 0.3, duration: 0.3 })
    })
  })

  // 指示器
  gsap.to(indicators, {
    scrollTrigger: {
      trigger: stage,
      start: 'top 45%',
      end: 'top 35%',
      scrub: 0.5
    },
    opacity: 1,
    scale: 1,
    stagger: 0.1
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

.card-morph-wrapper-201 {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%);
  overflow: hidden;

  opacity: 1 !important;}

.cm-stage-201 {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;

  opacity: 1 !important;}

.cm-bg-particles-201 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.cm-particle-201 {
  position: absolute;
  width: 6px;
  height: 6px;
  background: rgba(100, 200, 255, 0.5);
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(100, 200, 255, 0.6);

  opacity: 1 !important;}

.cm-container-201 {
  position: relative;
  text-align: center;
  z-index: 10;
  max-width: 1200px;

  opacity: 1 !important;}

.cm-title-201 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 20px;
  letter-spacing: 6px;
  color: #ffffff;
  text-shadow: 0 0 30px rgba(100, 200, 255, 0.5);

  opacity: 1 !important;}

.cm-subtitle-201 {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 2px;
  margin-bottom: 60px;
  text-transform: uppercase;

  opacity: 1 !important;}

.cm-shapes-scene-201 {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 50px;
  padding: 60px 20px;
  flex-wrap: wrap;

  opacity: 1 !important;}

.cm-shape-card-201 {
  width: 200px;
  height: 200px;
  position: relative;
  background: linear-gradient(145deg, rgba(100, 200, 255, 0.2), rgba(100, 200, 255, 0.05));
  backdrop-filter: blur(20px);
  border: 2px solid rgba(100, 200, 255, 0.4);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  opacity: 1 !important;}

.cm-shape-inner-201 {
  text-align: center;
  padding: 20px;

  opacity: 1 !important;}

.cm-shape-icon-201 {
  font-size: 3rem;
  margin-bottom: 15px;

  opacity: 1 !important;}

.cm-shape-title-201 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8px;
  text-shadow: 0 0 15px rgba(255, 255, 255, 0.5);

  opacity: 1 !important;}

.cm-shape-desc-201 {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);

  opacity: 1 !important;}

.cm-shape-glow-201 {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(100, 200, 255, 0.4) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  pointer-events: none;

  opacity: 1 !important;}

.cm-morph-indicator-201 {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 60px;
  flex-wrap: wrap;
}

.cm-indicator-shape-201 {
  padding: 15px 30px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  opacity: 1 !important;}

.cm-indicator-shape-201:hover {
  background: rgba(100, 200, 255, 0.1);
  border-color: rgba(100, 200, 255, 0.4);
  transform: translateY(-2px);
}

.cm-indicator-shape-201.active {
  background: rgba(100, 200, 255, 0.2);
  border-color: rgba(100, 200, 255, 0.8);
  box-shadow: 0 0 20px rgba(100, 200, 255, 0.4);

  opacity: 1 !important;}

.cm-indicator-label-201 {
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 1px;

  opacity: 1 !important;}

@media (max-width: 768px) {
  .cm-title-201 {
    font-size: 2rem;
  
  opacity: 1 !important;}

  .cm-shapes-scene-201 {
    gap: 30px;
  }

  .cm-shape-card-201 {
    width: 150px;
    height: 150px;
  
  opacity: 1 !important;}

  .cm-shape-icon-201 {
    font-size: 2.5rem;
  
  opacity: 1 !important;}

  .cm-shape-title-201 {
    font-size: 1.2rem;
  
  opacity: 1 !important;}

  .cm-morph-indicator-201 {
    gap: 10px;
  }

  .cm-indicator-shape-201 {
    padding: 12px 20px;
  
  opacity: 1 !important;}
}
</style>
