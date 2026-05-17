<template>
  <div class="card-ripple-wrapper-210">
    <div class="cr-container-210">
      <div class="cr-header-210">
        <h2 class="cr-title-210">Card Ripple Effect</h2>
        <p class="cr-subtitle-210">点击卡片产生水波纹扩散效果</p>
      </div>

      <div class="cr-cards-210">
        <div
          v-for="(card, index) in cards"
          :key="card.id"
          class="cr-card-210"
          @click="handleRipple($event, index)"
        >
          <div class="cr-ripple-210" :class="`cr-ripple-${card.id}-210`"></div>
          <div class="cr-card-inner-210">
            <div class="cr-card-icon-210">
              <span>{{ card.icon }}</span>
            </div>
            <h3 class="cr-card-title-210">{{ card.title }}</h3>
            <p class="cr-card-desc-210">{{ card.desc }}</p>
            <div class="cr-card-stats-210">
              <div class="cr-stat-210">
                <span class="cr-stat-value-210">{{ card.value }}</span>
                <span class="cr-stat-label-210">{{ card.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="cr-controls-210">
        <button class="cr-control-btn-210" @click="triggerAllRipples">
          全部触发
        </button>
        <button class="cr-control-btn-210" @click="autoRipple">
          自动触发
        </button>
      </div>

      <div class="cr-progress-210">
        <div class="cr-progress-bar-210" id="cr-progress-bar-210"></div>
      </div>
    </div>

    <div class="cr-particles-210" id="cr-particles-210"></div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const cards = [
  {
    id: 1,
    icon: '🌊',
    title: '海浪',
    desc: '感受水波的温柔',
    value: '98%',
    label: '舒适度'
  },
  {
    id: 2,
    icon: '💧',
    title: '水滴',
    desc: '每一滴都是精华',
    value: '156',
    label: '滴数'
  },
  {
    id: 3,
    icon: '🌊',
    title: '波涛',
    desc: '汹涌澎湃的力量',
    value: '1.2K',
    label: '能量'
  },
  {
    id: 4,
    icon: '🌀',
    title: '漩涡',
    desc: '旋转的神秘',
    value: '88°',
    label: '角度'
  },
  {
    id: 5,
    icon: '⛲',
    title: '喷泉',
    desc: '向上的生命力',
    value: '12m',
    label: '高度'
  },
  {
    id: 6,
    icon: '🎐',
    title: '浪花',
    desc: '绽放的美丽',
    value: '365',
    label: '天数'
  }
]

let rippleTimeline = null
let autoRippleInterval = null

const handleRipple = (event, index) => {
  const card = event.currentTarget
  const ripple = card.querySelector(`.cr-ripple-${index + 1}-210`)

  gsap.fromTo(
    ripple,
    {
      opacity: 0,
      scale: 0,
      borderRadius: '50%'
    },
    {
      opacity: 1,
      scale: 3,
      borderRadius: '50%',
      duration: 1.2,
      ease: 'power2.out'
    }
  )

  gsap.to(ripple, {
    opacity: 0,
    duration: 0.4,
    delay: 0.8,
    ease: 'power2.in'
  })

  gsap.fromTo(
    card.querySelector('.cr-card-inner-210'),
    { scale: 0.95 },
    { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.5)' }
  )
}

const triggerAllRipples = () => {
  gsap.utils.toArray('.cr-card-210').forEach((card, index) => {
    setTimeout(() => {
      card.dispatchEvent(new Event('click'))
    }, index * 100)
  })
}

const autoRipple = () => {
  if (autoRippleInterval) {
    clearInterval(autoRippleInterval)
    autoRippleInterval = null
    return
  }

  autoRippleInterval = setInterval(() => {
    const randomIndex = Math.floor(Math.random() * cards.length)
    const card = document.querySelector(`.cr-card-210:nth-child(${randomIndex + 1})`)
    if (card) card.dispatchEvent(new Event('click'))
  }, 500)
}

const createParticles = () => {
  const container = document.getElementById('cr-particles-210')
  if (!container) return

  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div')
    particle.className = 'cr-particle-210'
    particle.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      width: ${3 + Math.random() * 5}px;
      height: ${3 + Math.random() * 5}px;
      background: radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, transparent 70%);
      border-radius: 50%;
    `
    container.appendChild(particle)

    gsap.to(particle, {
      y: -200 - Math.random() * 300,
      x: (Math.random() - 0.5) * 100,
      opacity: 0,
      duration: 3 + Math.random() * 2,
      repeat: -1,
      delay: Math.random() * 3
    })
  }
}

onMounted(() => {
  rippleTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: '.cr-cards-210',
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: 1
    }
  })

  gsap.utils.toArray('.cr-card-210').forEach((card, index) => {
    rippleTimeline.fromTo(
      card,
      {
        y: 100,
        opacity: 0,
        scale: 0.8
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)'
      },
      index * 0.1
    )
  })

  gsap.to('#cr-progress-bar-210', {
    width: '100%',
    scrollTrigger: {
      trigger: '.cr-container-210',
      start: 'top 70%',
      end: 'bottom 30%',
      scrub: 1
    }
  })

  gsap.utils.toArray('.cr-card-210').forEach((card) => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card.querySelector('.cr-card-icon-210'), {
        scale: 1.2,
        rotate: 15,
        duration: 0.3,
        ease: 'back.out(1.7)'
      })
    })

    card.addEventListener('mouseleave', () => {
      gsap.to(card.querySelector('.cr-card-icon-210'), {
        scale: 1,
        rotate: 0,
        duration: 0.3,
        ease: 'power2.out'
      })
    })
  })

  createParticles()
})

onUnmounted(() => {
  if (rippleTimeline) rippleTimeline.kill()
  if (autoRippleInterval) clearInterval(autoRippleInterval)
  ScrollTrigger.getAll().forEach((t) => t.kill())
})
</script>

<style scoped>
/* GSAP opacity fix: ensure content is always visible */

.card-ripple-wrapper-210 {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  overflow: hidden;
  padding: 60px 20px;

  opacity: 1 !important;}

.cr-container-210 {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  z-index: 10;

  opacity: 1 !important;}

.cr-header-210 {
  text-align: center;
  margin-bottom: 60px;

  opacity: 1 !important;}

.cr-title-210 {
  font-size: 3rem;
  font-weight: 700;
  background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;

  opacity: 1 !important;}

.cr-subtitle-210 {
  font-size: 1.2rem;
  color: #94a3b8;

  opacity: 1 !important;}

.cr-cards-210 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
}

.cr-card-210 {
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 30px;
  cursor: pointer;
  overflow: hidden;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: border-color 0.3s;

  opacity: 1 !important;}

.cr-card-210:hover {
  border-color: rgba(59, 130, 246, 0.5);
}

.cr-ripple-210 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  background: radial-gradient(
    circle,
    rgba(59, 130, 246, 0.4) 0%,
    rgba(59, 130, 246, 0.2) 50%,
    transparent 70%
  );
  pointer-events: none;
  border-radius: 50%;

  opacity: 1 !important;}

.cr-card-inner-210 {
  position: relative;
  z-index: 1;
}

.cr-card-icon-210 {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  margin-bottom: 20px;

  opacity: 1 !important;}

.cr-card-title-210 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 10px;

  opacity: 1 !important;}

.cr-card-desc-210 {
  font-size: 1rem;
  color: #94a3b8;
  margin-bottom: 20px;
  line-height: 1.6;

  opacity: 1 !important;}

.cr-card-stats-210 {
  display: flex;
  gap: 20px;
}

.cr-stat-210 {
  display: flex;
  flex-direction: column;
}

.cr-stat-value-210 {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  opacity: 1 !important;}

.cr-stat-label-210 {
  font-size: 0.9rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 1px;

  opacity: 1 !important;}

.cr-controls-210 {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 40px;
}

.cr-control-btn-210 {
  padding: 15px 30px;
  background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
  border: none;
  border-radius: 30px;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;

  opacity: 1 !important;}

.cr-control-btn-210:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4);
}

.cr-progress-210 {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;

  opacity: 1 !important;}

.cr-progress-bar-210 {
  width: 0;
  height: 100%;
  background: linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%);
  border-radius: 2px;

  opacity: 1 !important;}

.cr-particles-210 {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;

  opacity: 1 !important;}

.cr-particle-210 {
  position: absolute;
}

@media (max-width: 768px) {
  .cr-title-210 {
    font-size: 2rem;
  
  opacity: 1 !important;}

  .cr-cards-210 {
    grid-template-columns: 1fr;
  }
}
</style>
