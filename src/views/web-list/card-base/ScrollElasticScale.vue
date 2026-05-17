<template>
  <div class="elastic-scale-wrapper-212">
    <div class="es-container-212">
      <div class="es-header-212">
        <h2 class="es-title-212">Elastic Scale</h2>
        <p class="es-subtitle-212">元素像橡皮筋一样弹性缩放</p>
      </div>

      <div class="es-elements-212">
        <div
          v-for="(el, index) in elements"
          :key="el.id"
          class="es-element-212"
          :class="`es-element-${el.id}-212`"
          @mouseenter="handleMouseEnter($event, index)"
          @mouseleave="handleMouseLeave($event, index)"
        >
          <div class="es-element-inner-212">
            <div class="es-element-icon-212" :style="{ background: el.gradient }">
              <span>{{ el.icon }}</span>
            </div>
            <h3 class="es-element-title-212">{{ el.title }}</h3>
            <p class="es-element-desc-212">{{ el.desc }}</p>
          </div>
        </div>
      </div>

      <div class="es-controls-212">
        <button class="es-control-btn-212" @click="triggerElastic">
          触发弹性
        </button>
        <button class="es-control-btn-212" @click="elasticWave">
          弹性波浪
        </button>
        <button class="es-control-btn-212" @click="elasticPulse">
          脉冲动画
        </button>
      </div>

      <div class="es-info-212">
        <div class="es-info-item-212">
          <span class="es-info-value-212" id="es-scale-value-212">1.0x</span>
          <span class="es-info-label-212">当前缩放</span>
        </div>
        <div class="es-info-item-212">
          <span class="es-info-value-212" id="es-duration-212">0.8s</span>
          <span class="es-info-label-212">动画时长</span>
        </div>
      </div>

      <div class="es-progress-212">
        <div class="es-progress-bar-212" id="es-progress-bar-212"></div>
      </div>
    </div>

    <div class="es-particles-212" id="es-particles-212"></div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const elements = [
  {
    id: 1,
    icon: '🎯',
    title: '精准',
    desc: '弹性缩放带来精准反馈',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)'
  },
  {
    id: 2,
    icon: '⚡',
    title: '快速',
    desc: '橡皮筋般的快速响应',
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)'
  },
  {
    id: 3,
    icon: '🌟',
    title: '流畅',
    desc: '丝滑的动画过渡',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)'
  },
  {
    id: 4,
    icon: '🎨',
    title: '创意',
    desc: '弹性动画激发创意',
    gradient: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)'
  },
  {
    id: 5,
    icon: '🎪',
    title: '有趣',
    desc: '让交互更有趣',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)'
  },
  {
    id: 6,
    icon: '🎭',
    title: '个性',
    desc: '独特的视觉风格',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
  }
]

const handleMouseEnter = (event, index) => {
  const element = event.currentTarget
  gsap.to(element, {
    scale: 1.15,
    duration: 0.6,
    ease: 'elastic.out(1, 0.5)'
  })

  gsap.to(element.querySelector('.es-element-icon-212'), {
    scale: 1.2,
    rotate: 15,
    duration: 0.5,
    ease: 'back.out(1.7)'
  })

  gsap.to('#es-scale-value-212', {
    textContent: '1.15x',
    duration: 0.3,
    snap: { textContent: 0.01 }
  })
}

const handleMouseLeave = (event, index) => {
  const element = event.currentTarget
  gsap.to(element, {
    scale: 1,
    duration: 0.6,
    ease: 'elastic.out(1, 0.5)'
  })

  gsap.to(element.querySelector('.es-element-icon-212'), {
    scale: 1,
    rotate: 0,
    duration: 0.5,
    ease: 'power2.out'
  })

  gsap.to('#es-scale-value-212', {
    textContent: '1.0x',
    duration: 0.3,
    snap: { textContent: 0.01 }
  })
}

const triggerElastic = () => {
  gsap.utils.toArray('.es-element-212').forEach((el, index) => {
    gsap.fromTo(
      el,
      { scale: 0.5 },
      {
        scale: 1.2,
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)',
        delay: index * 0.1
      }
    )

    gsap.to(el, {
      scale: 1,
      duration: 0.6,
      ease: 'elastic.out(1, 0.5)',
      delay: index * 0.1 + 0.8
    })
  })
}

const elasticWave = () => {
  gsap.utils.toArray('.es-element-212').forEach((el, index) => {
    gsap.fromTo(
      el,
      { scale: 0.8, y: -20 },
      {
        scale: 1.3,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)',
        delay: index * 0.1
      }
    )

    gsap.to(el, {
      scale: 1,
      duration: 0.5,
      ease: 'elastic.out(1, 0.5)',
      delay: index * 0.1 + 0.6
    })
  })
}

const elasticPulse = () => {
  gsap.utils.toArray('.es-element-212').forEach((el) => {
    gsap.to(el, {
      scale: 1.1,
      duration: 0.4,
      ease: 'power2.out',
      yoyo: true,
      repeat: 3
    })
  })
}

const createParticles = () => {
  const container = document.getElementById('es-particles-212')
  if (!container) return

  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div')
    particle.className = 'es-particle-212'
    particle.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      width: ${4 + Math.random() * 6}px;
      height: ${4 + Math.random() * 6}px;
      background: radial-gradient(circle, rgba(245, 158, 11, 0.6) 0%, transparent 70%);
      border-radius: 50%;
    `
    container.appendChild(particle)

    gsap.to(particle, {
      x: (Math.random() - 0.5) * 300,
      y: (Math.random() - 0.5) * 300,
      opacity: 0,
      scale: 0,
      duration: 2 + Math.random() * 2,
      repeat: -1,
      delay: Math.random() * 2,
      ease: 'elastic.out(1, 0.5)'
    })
  }
}

onMounted(() => {
  gsap.fromTo(
    '.es-element-212',
    {
      y: 80,
      opacity: 0,
      scale: 0.5
    },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.8,
      stagger: 0.12,
      ease: 'elastic.out(1, 0.5)',
      scrollTrigger: {
        trigger: '.es-elements-212',
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1
      }
    }
  )

  gsap.to('#es-progress-bar-212', {
    width: '100%',
    scrollTrigger: {
      trigger: '.es-container-212',
      start: 'top 70%',
      end: 'bottom 30%',
      scrub: 1
    }
  })

  createParticles()
})

onUnmounted(() => {
  ScrollTrigger.getAll().forEach((t) => t.kill())
})
</script>

<style scoped>
/* GSAP opacity fix: ensure content is always visible */

.elastic-scale-wrapper-212 {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1c1917 50%, #0f172a 100%);
  overflow: hidden;
  padding: 60px 20px;

  opacity: 1 !important;}

.es-container-212 {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  z-index: 10;

  opacity: 1 !important;}

.es-header-212 {
  text-align: center;
  margin-bottom: 60px;

  opacity: 1 !important;}

.es-title-212 {
  font-size: 3rem;
  font-weight: 700;
  background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;

  opacity: 1 !important;}

.es-subtitle-212 {
  font-size: 1.2rem;
  color: #94a3b8;

  opacity: 1 !important;}

.es-elements-212 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
}

.es-element-212 {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 30px;
  cursor: pointer;
  overflow: hidden;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: border-color 0.3s;

  opacity: 1 !important;}

.es-element-212:hover {
  border-color: rgba(245, 158, 11, 0.5);
}

.es-element-inner-212 {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  opacity: 1 !important;}

.es-element-icon-212 {
  width: 90px;
  height: 90px;
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.8rem;
  margin-bottom: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);

  opacity: 1 !important;}

.es-element-title-212 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 10px;

  opacity: 1 !important;}

.es-element-desc-212 {
  font-size: 1rem;
  color: #94a3b8;
  line-height: 1.6;

  opacity: 1 !important;}

.es-controls-212 {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 40px;
}

.es-control-btn-212 {
  padding: 15px 30px;
  background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
  border: none;
  border-radius: 30px;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;

  opacity: 1 !important;}

.es-control-btn-212:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(245, 158, 11, 0.4);
}

.es-info-212 {
  display: flex;
  justify-content: center;
  gap: 60px;
  margin-bottom: 40px;
}

.es-info-item-212 {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.es-info-value-212 {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  opacity: 1 !important;}

.es-info-label-212 {
  font-size: 0.9rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 1px;

  opacity: 1 !important;}

.es-progress-212 {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;

  opacity: 1 !important;}

.es-progress-bar-212 {
  width: 0;
  height: 100%;
  background: linear-gradient(90deg, #f59e0b 0%, #ef4444 100%);
  border-radius: 2px;

  opacity: 1 !important;}

.es-particles-212 {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;

  opacity: 1 !important;}

.es-particle-212 {
  position: absolute;
}

@media (max-width: 768px) {
  .es-title-212 {
    font-size: 2rem;
  
  opacity: 1 !important;}

  .es-elements-212 {
    grid-template-columns: 1fr;
  }

  .es-info-212 {
    gap: 30px;
  }
}
</style>
