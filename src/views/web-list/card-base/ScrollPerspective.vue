<template>
  <div class="perspective-wrapper-213">
    <div class="ps-container-213">
      <div class="ps-header-213">
        <h2 class="ps-title-213">Perspective Transform</h2>
        <p class="ps-subtitle-213">元素从远处飞向近处</p>
      </div>

      <div class="ps-scene-213">
        <div class="ps-perspective-213" id="ps-perspective-213">
          <div
            v-for="(card, index) in cards"
            :key="card.id"
            class="ps-card-213"
            :class="`ps-card-${card.id}-213`"
            :style="{ transform: `rotateY(${card.rotate}deg) rotateX(${card.rotateX}deg)` }"
          >
            <div class="ps-card-inner-213">
              <div class="ps-card-icon-213">{{ card.icon }}</div>
              <h3 class="ps-card-title-213">{{ card.title }}</h3>
              <p class="ps-card-desc-213">{{ card.desc }}</p>
              <div class="ps-card-depth-213">
                <span class="ps-depth-value-213">{{ card.depth }}</span>
                <span class="ps-depth-label-213">深度</span>
              </div>
            </div>
            <div class="ps-card-glow-213"></div>
          </div>
        </div>
      </div>

      <div class="ps-controls-213">
        <button class="ps-control-btn-213" @click="flyIn">
          飞入
        </button>
        <button class="ps-control-btn-213" @click="flyOut">
          飞出
        </button>
        <button class="ps-control-btn-213" @click="rotatePerspective">
          旋转视角
        </button>
      </div>

      <div class="ps-indicator-213">
        <div class="ps-indicator-bar-213" id="ps-indicator-bar-213"></div>
      </div>
    </div>

    <div class="ps-particles-213" id="ps-particles-213"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const perspective = ref(1000)
let perspectiveTimeline = null

const cards = [
  {
    id: 1,
    icon: '🚀',
    title: '起飞',
    desc: '从远处极速飞来',
    depth: '800px',
    rotate: -15,
    rotateX: 5
  },
  {
    id: 2,
    icon: '✈️',
    title: '飞行',
    desc: '在空中自由翱翔',
    depth: '600px',
    rotate: -5,
    rotateX: -3
  },
  {
    id: 3,
    icon: '🛸',
    title: '飞船',
    desc: '来自未来的科技',
    depth: '900px',
    rotate: 10,
    rotateX: 8
  },
  {
    id: 4,
    icon: '🌍',
    title: '星球',
    desc: '探索未知的世界',
    depth: '700px',
    rotate: 5,
    rotateX: -5
  }
]

const flyIn = () => {
  gsap.utils.toArray('.ps-card-213').forEach((card, index) => {
    gsap.fromTo(
      card,
      {
        z: -2000,
        opacity: 0,
        scale: 0.3
      },
      {
        z: 0,
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: 'power2.out',
        delay: index * 0.2
      }
    )
  })

  gsap.fromTo(
    '.ps-perspective-213',
    { perspective: 500 },
    { perspective: 1000, duration: 1.5, ease: 'power2.out' }
  )
}

const flyOut = () => {
  gsap.utils.toArray('.ps-card-213').forEach((card, index) => {
    gsap.to(card, {
      z: 2000,
      opacity: 0,
      scale: 0.5,
      duration: 1.2,
      ease: 'power2.in',
      delay: index * 0.15
    })
  })
}

const rotatePerspective = () => {
  gsap.to('.ps-perspective-213', {
    rotateX: 15,
    rotateY: 15,
    duration: 1.5,
    ease: 'power2.inOut',
    yoyo: true,
    repeat: 1
  })
}

const createParticles = () => {
  const container = document.getElementById('ps-particles-213')
  if (!container) return

  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div')
    particle.className = 'ps-particle-213'
    particle.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      width: ${2 + Math.random() * 4}px;
      height: ${2 + Math.random() * 4}px;
      background: radial-gradient(circle, rgba(59, 130, 246, 0.8) 0%, transparent 70%);
      border-radius: 50%;
    `
    container.appendChild(particle)

    gsap.to(particle, {
      z: 2000,
      scale: 0,
      opacity: 0,
      duration: 3 + Math.random() * 2,
      repeat: -1,
      delay: Math.random() * 3,
      ease: 'none'
    })
  }
}

const initScrollAnimations = () => {
  perspectiveTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: '.ps-scene-213',
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: 1
    }
  })

  gsap.utils.toArray('.ps-card-213').forEach((card, index) => {
    perspectiveTimeline.fromTo(
      card,
      {
        z: -1500,
        opacity: 0,
        scale: 0.4,
        rotateX: -20
      },
      {
        z: 0,
        opacity: 1,
        scale: 1,
        rotateX: cards[index].rotateX,
        duration: 1.5,
        ease: 'power2.out'
      },
      index * 0.2
    )
  })

  gsap.to('#ps-indicator-bar-213', {
    width: '100%',
    scrollTrigger: {
      trigger: '.ps-container-213',
      start: 'top 70%',
      end: 'bottom 30%',
      scrub: 1
    }
  })

  gsap.utils.toArray('.ps-card-213').forEach((card) => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        rotateX: -10,
        rotateY: 10,
        scale: 1.05,
        duration: 0.4,
        ease: 'power2.out'
      })

      gsap.to(card.querySelector('.ps-card-glow-213'), {
        opacity: 0.5,
        scale: 1.2,
        duration: 0.3
      })
    })

    card.addEventListener('mouseleave', () => {
      const index = parseInt(card.classList[0].split('-')[2])
      gsap.to(card, {
        rotateX: cards[index - 1].rotateX,
        rotateY: cards[index - 1].rotate,
        scale: 1,
        duration: 0.4,
        ease: 'power2.out'
      })

      gsap.to(card.querySelector('.ps-card-glow-213'), {
        opacity: 0.2,
        scale: 1,
        duration: 0.3
      })
    })
  })

  gsap.to({}, {
    duration: 5,
    repeat: -1,
    repeatDelay: 3,
    onRepeat: () => {
      flyIn()
    },
    scrollTrigger: {
      trigger: '.ps-scene-213',
      start: 'top 50%',
      toggleActions: 'play none none reverse'
    }
  })
}

onMounted(() => {
  createParticles()
  initScrollAnimations()
})

onUnmounted(() => {
  if (perspectiveTimeline) perspectiveTimeline.kill()
  ScrollTrigger.getAll().forEach((t) => t.kill())
})
</script>

<style scoped>
/* GSAP opacity fix: ensure content is always visible */

.perspective-wrapper-213 {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%);
  overflow: hidden;
  padding: 60px 20px;

  opacity: 1 !important;}

.ps-container-213 {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  z-index: 10;

  opacity: 1 !important;}

.ps-header-213 {
  text-align: center;
  margin-bottom: 60px;

  opacity: 1 !important;}

.ps-title-213 {
  font-size: 3rem;
  font-weight: 700;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;

  opacity: 1 !important;}

.ps-subtitle-213 {
  font-size: 1.2rem;
  color: #94a3b8;

  opacity: 1 !important;}

.ps-scene-213 {
  position: relative;
  height: 600px;
  margin-bottom: 60px;
  display: flex;
  align-items: center;
  justify-content: center;

  opacity: 1 !important;}

.ps-perspective-213 {
  width: 100%;
  height: 100%;
  perspective: 1000px;
  transform-style: preserve-3d;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;

  opacity: 1 !important;}

.ps-card-213 {
  position: relative;
  width: 280px;
  height: 350px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 30px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transform-style: preserve-3d;
  transform: translateZ(0);
  cursor: pointer;
  transition: border-color 0.3s;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);

  opacity: 1 !important;}

.ps-card-213:hover {
  border-color: rgba(59, 130, 246, 0.5);
}

.ps-card-inner-213 {
  position: relative;
  z-index: 2;
  transform: translateZ(20px);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  opacity: 1 !important;}

.ps-card-icon-213 {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  margin-bottom: 20px;
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4);

  opacity: 1 !important;}

.ps-card-title-213 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 10px;

  opacity: 1 !important;}

.ps-card-desc-213 {
  font-size: 1rem;
  color: #94a3b8;
  margin-bottom: 20px;
  line-height: 1.6;

  opacity: 1 !important;}

.ps-card-depth-213 {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.ps-depth-value-213 {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  opacity: 1 !important;}

.ps-depth-label-213 {
  font-size: 0.8rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 1px;

  opacity: 1 !important;}

.ps-card-glow-213 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  background: radial-gradient(
    circle,
    rgba(59, 130, 246, 0.3) 0%,
    transparent 70%
  );
  border-radius: 50%;
  opacity: 0.2;
  pointer-events: none;
  filter: blur(20px);
}

.ps-controls-213 {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.ps-control-btn-213 {
  padding: 15px 30px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border: none;
  border-radius: 30px;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;

  opacity: 1 !important;}

.ps-control-btn-213:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4);
}

.ps-indicator-213 {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;

  opacity: 1 !important;}

.ps-indicator-bar-213 {
  width: 0;
  height: 100%;
  background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 2px;

  opacity: 1 !important;}

.ps-particles-213 {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  perspective: 1000px;
  transform-style: preserve-3d;

  opacity: 1 !important;}

.ps-particle-213 {
  position: absolute;
}

@media (max-width: 768px) {
  .ps-title-213 {
    font-size: 2rem;
  
  opacity: 1 !important;}

  .ps-scene-213 {
    height: 800px;
  
  opacity: 1 !important;}

  .ps-perspective-213 {
    gap: 20px;
  }

  .ps-card-213 {
    width: 240px;
    height: 300px;
  
  opacity: 1 !important;}
}
</style>
