<template>
  <div class="card-rotate-3d-wrapper-199">
    <div class="cr3d-stage-199" ref="stageRef">
      <div class="cr3d-particles-199">
        <div class="cr3d-particle-199" v-for="i in 60" :key="i"></div>
      </div>
      <div class="cr3d-container-199" ref="containerRef">
        <h2 class="cr3d-title-199">3D ROTATION</h2>
        <p class="cr3d-subtitle-199">Interactive 3D card rotation</p>
        
        <div class="cr3d-cards-scene-199" ref="sceneRef">
          <div 
            v-for="(card, index) in cards"
            :key="card.id"
            class="cr3d-card-199"
            ref="cardRefs"
            :data-index="index"
            @mousemove="onCardMouseMove($event, index)"
            @mouseleave="onCardMouseLeave(index)"
          >
            <div class="cr3d-card-inner-199" :style="cardTransform(index)">
              <div class="cr3d-card-front-199">
                <div class="cr3d-card-icon-199">{{ card.icon }}</div>
                <div class="cr3d-card-title-199">{{ card.title }}</div>
                <div class="cr3d-card-desc-199">{{ card.desc }}</div>
              </div>
              <div class="cr3d-card-back-199">
                <div class="cr3d-card-number-199">{{ String(index + 1).padStart(2, '0') }}</div>
                <div class="cr3d-card-detail-199">{{ card.detail }}</div>
              </div>
            </div>
            <div class="cr3d-card-shadow-199"></div>
          </div>
        </div>

        <div class="cr3d-controls-199">
          <button class="cr3d-btn-199" @click="rotateAllCards(-45)">← Rotate Left</button>
          <button class="cr3d-btn-199" @click="resetRotation()">Reset</button>
          <button class="cr3d-btn-199" @click="rotateAllCards(45)">Rotate Right →</button>
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
const sceneRef = ref<HTMLElement>()
const cardRefs = ref<HTMLElement[]>([])

const cardRotations = ref<number[]>([])
const cardRotationsX = ref<number[]>([])
const cardRotationsY = ref<number[]>([])

const cards = [
  { id: 1, title: 'Vision', desc: 'See the future', icon: '👁️', detail: 'Innovative ideas' },
  { id: 2, title: 'Create', desc: 'Build amazing things', icon: '⚡', detail: 'Powerful tools' },
  { id: 3, title: 'Grow', desc: 'Expand your reach', icon: '🌱', detail: 'Sustainable growth' },
  { id: 4, title: 'Launch', desc: 'Go to market', icon: '🚀', detail: 'Global impact' }
]

// 初始化旋转值
onMounted(() => {
  cards.forEach((_, i) => {
    cardRotations.value.push(i * 90)
    cardRotationsX.value.push(0)
    cardRotationsY.value.push(0)
  })
})

const cardTransform = (index: number) => {
  return {
    transform: `rotateX(${cardRotationsX.value[index]}deg) rotateY(${cardRotationsY.value[index]}deg) rotateZ(${cardRotations.value[index]}deg)`
  }
}

const onCardMouseMove = (event: MouseEvent, index: number) => {
  const card = cardRefs.value[index]
  const rect = card.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  
  const mouseX = event.clientX - centerX
  const mouseY = event.clientY - centerY
  
  const rotateX = (mouseY / rect.height) * -20
  const rotateY = (mouseX / rect.width) * 20
  
  cardRotationsX.value[index] = rotateX
  cardRotationsY.value[index] = rotateY
}

const onCardMouseLeave = (index: number) => {
  gsap.to([cardRotationsX.value, cardRotationsY.value], {
    [index]: 0,
    duration: 0.5,
    ease: 'power2.out'
  })
  cardRotationsX.value[index] = 0
  cardRotationsY.value[index] = 0
}

const rotateAllCards = (angle: number) => {
  cardRefs.value.forEach((card, index) => {
    const newRotation = cardRotations.value[index] + angle
    gsap.to(cardRotations.value, {
      [index]: newRotation,
      duration: 0.8,
      ease: 'back.out(1.7)'
    })
  })
}

const resetRotation = () => {
  cardRefs.value.forEach((card, index) => {
    const targetRotation = index * 90
    gsap.to(cardRotations.value, {
      [index]: targetRotation,
      duration: 0.8,
      ease: 'back.out(1.7)'
    })
  })
}

const initAnimations = () => {
  const stage = stageRef.value
  const container = containerRef.value
  const scene = sceneRef.value
  if (!stage || !container || !scene) return

  const title = container.querySelector('.cr3d-title-199')
  const subtitle = container.querySelector('.cr3d-subtitle-199')
  const particles = gsap.utils.toArray('.cr3d-particle-199') as HTMLElement[]
  const shadows = gsap.utils.toArray('.cr3d-card-shadow-199') as HTMLElement[]

  // 初始状态
  gsap.set(title, { opacity: 0, y: -50, rotationX: -30 })
  gsap.set(subtitle, { opacity: 0, y: -30 })
  gsap.set(cardRefs.value, { opacity: 0, scale: 0.5, rotationX: 45 })
  gsap.set(particles, { opacity: 0, scale: 0 })
  gsap.set(shadows, { opacity: 0, scale: 0.5 })

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
      z: () => (Math.random() - 0.5) * 200,
      duration: 3 + Math.random() * 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
  })

  // 标题3D入场
  gsap.to(title, {
    scrollTrigger: {
      trigger: stage,
      start: 'top 75%',
      end: 'top 60%',
      scrub: 1
    },
    opacity: 1,
    y: 0,
    rotationX: 0
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

  // 卡片3D入场动画
  cardRefs.value.forEach((card, index) => {
    gsap.to(card, {
      scrollTrigger: {
        trigger: stage,
        start: 'top 70%',
        end: 'top 40%',
        scrub: 0.8
      },
      opacity: 1,
      scale: 1,
      rotationX: 0,
      rotationY: index * 90,
      rotationZ: 0,
      duration: 1,
      stagger: 0.15
    })

    // 持续旋转动画
    gsap.to(card, {
      rotationY: index * 90 + 360,
      duration: 20 + index * 2,
      repeat: -1,
      ease: 'none'
    })
  })

  // 阴影动画
  gsap.to(shadows, {
    scrollTrigger: {
      trigger: stage,
      start: 'top 60%',
      end: 'top 30%',
      scrub: 0.5
    },
    opacity: 0.5,
    scale: 1,
    stagger: 0.1
  })

  // 按钮入场
  const buttons = container.querySelectorAll('.cr3d-btn-199')
  gsap.to(buttons, {
    scrollTrigger: {
      trigger: stage,
      start: 'top 40%',
      end: 'top 25%',
      scrub: 0.5
    },
    opacity: 1,
    y: 0,
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

.card-rotate-3d-wrapper-199 {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: radial-gradient(ellipse at center, #1a1a2e 0%, #0f0f1a 100%);
  overflow: hidden;

  opacity: 1 !important;}

.cr3d-stage-199 {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  perspective: 2000px;

  opacity: 1 !important;}

.cr3d-particles-199 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  transform-style: preserve-3d;
}

.cr3d-particle-199 {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(100, 200, 255, 0.6);
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(100, 200, 255, 0.8);

  opacity: 1 !important;}

.cr3d-container-199 {
  position: relative;
  text-align: center;
  z-index: 10;
  max-width: 1200px;

  opacity: 1 !important;}

.cr3d-title-199 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 20px;
  letter-spacing: 6px;
  color: #ffffff;
  text-shadow: 0 0 30px rgba(100, 200, 255, 0.5);
  transform-style: preserve-3d;

  opacity: 1 !important;}

.cr3d-subtitle-199 {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 2px;
  margin-bottom: 60px;
  text-transform: uppercase;

  opacity: 1 !important;}

.cr3d-cards-scene-199 {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  padding: 60px 20px;
  perspective: 3000px;
  transform-style: preserve-3d;

  opacity: 1 !important;}

.cr3d-card-199 {
  width: 220px;
  height: 300px;
  position: relative;
  perspective: 1500px;
  cursor: pointer;
  transform-style: preserve-3d;

  opacity: 1 !important;}

.cr3d-card-inner-199 {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.1s ease;

  opacity: 1 !important;}

.cr3d-card-front-199,
.cr3d-card-back-199 {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;

  opacity: 1 !important;}

.cr3d-card-front-199 {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05));
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(20px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);

  opacity: 1 !important;}

.cr3d-card-back-199 {
  background: linear-gradient(145deg, rgba(100, 200, 255, 0.2), rgba(100, 200, 255, 0.05));
  border: 2px solid rgba(100, 200, 255, 0.4);
  transform: rotateY(180deg);
  backdrop-filter: blur(20px);
  box-shadow: 0 25px 50px rgba(100, 200, 255, 0.3);

  opacity: 1 !important;}

.cr3d-card-icon-199 {
  font-size: 4rem;
  margin-bottom: 20px;
  filter: drop-shadow(0 0 20px rgba(100, 200, 255, 0.6));

  opacity: 1 !important;}

.cr3d-card-title-199 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 10px;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);

  opacity: 1 !important;}

.cr3d-card-desc-199 {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  line-height: 1.5;

  opacity: 1 !important;}

.cr3d-card-number-199 {
  font-size: 4rem;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 0 30px rgba(100, 200, 255, 0.8);
  margin-bottom: 20px;

  opacity: 1 !important;}

.cr3d-card-detail-199 {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 3px;

  opacity: 1 !important;}

.cr3d-card-shadow-199 {
  position: absolute;
  bottom: -30px;
  left: 50%;
  width: 80%;
  height: 20px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 50%;
  filter: blur(20px);
  transform: translateX(-50%) rotateX(90deg);
  transform-style: preserve-3d;

  opacity: 1 !important;}

.cr3d-controls-199 {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 60px;
}

.cr3d-btn-199 {
  padding: 15px 30px;
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  background: linear-gradient(145deg, rgba(100, 200, 255, 0.2), rgba(100, 200, 255, 0.1));
  border: 2px solid rgba(100, 200, 255, 0.4);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  backdrop-filter: blur(10px);

  opacity: 1 !important;}

.cr3d-btn-199:hover {
  background: rgba(100, 200, 255, 0.3);
  border-color: rgba(100, 200, 255, 0.8);
  box-shadow: 0 10px 30px rgba(100, 200, 255, 0.4);
  transform: translateY(-2px);
}

.cr3d-btn-199:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .cr3d-title-199 {
    font-size: 2rem;
  
  opacity: 1 !important;}

  .cr3d-cards-scene-199 {
    gap: 20px;
  }

  .cr3d-card-199 {
    width: 160px;
    height: 220px;
  
  opacity: 1 !important;}

  .cr3d-card-icon-199 {
    font-size: 3rem;
  
  opacity: 1 !important;}

  .cr3d-card-title-199 {
    font-size: 1.4rem;
  
  opacity: 1 !important;}

  .cr3d-controls-199 {
    flex-wrap: wrap;
    gap: 10px;
  }

  .cr3d-btn-199 {
    padding: 12px 20px;
    font-size: 0.9rem;
  
  opacity: 1 !important;}
}
</style>
