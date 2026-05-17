<template>
  <div class="liquid-cards-178" ref="componentRoot">
    <div class="lc-container-178">
      <h2 class="lc-title-178">💧 液体卡片</h2>
      <p class="lc-desc-178">滚动触发液体流动效果</p>
      
      <div class="lc-stage-178" ref="stageRef">
        <div 
          v-for="(card, index) in cards" 
          :key="index"
          class="lc-card-178"
          :data-index="index"
          :style="{ '--card-color': card.color }"
        >
          <div class="lc-card-inner-178">
            <div class="lc-liquid-178">
              <div class="lc-liquid-wave-178"></div>
            </div>
            <div class="lc-content-178">
              <div class="lc-icon-178">{{ card.icon }}</div>
              <div class="lc-card-title-178">{{ card.title }}</div>
              <div class="lc-card-desc-178">{{ card.desc }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="lc-hint-178">滚动体验液体流动</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const componentRoot = ref<HTMLElement>()
const stageRef = ref<HTMLElement>()

const cards = [
  {
    icon: '🌊',
    title: '流动',
    desc: '自然流动',
    color: '#00d2ff'
  },
  {
    icon: '💫',
    title: '闪耀',
    desc: '光芒四射',
    color: '#ff6b6b'
  },
  {
    icon: '🔥',
    title: '热情',
    desc: '活力无限',
    color: '#feca57'
  },
  {
    icon: '🌸',
    title: '温柔',
    desc: '柔美动人',
    color: '#ff9ff3'
  }
]

let ctx: any = null

onMounted(() => {
  ctx = gsap.context(() => {
    // 初始状态
    gsap.set('.lc-card-178', {
      y: 150,
      opacity: 0,
      scale: 0.9
    })

    gsap.set('.lc-liquid-wave-178', {
      y: '100%'
    })

    // 卡片依次出现
    cards.forEach((_, index) => {
      const card = `.lc-card-178:nth-child(${index + 1})`
      const wave = `${card} .lc-liquid-wave-178`

      gsap.to(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          end: 'top 20%',
          toggleActions: 'play none none reverse'
        },
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1,
        delay: index * 0.15,
        ease: 'power3.out'
      })

      // 液体波浪动画
      gsap.to(wave, {
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          end: 'top 20%',
          toggleActions: 'play none none reverse'
        },
        y: '0%',
        duration: 1.2,
        delay: index * 0.15 + 0.1,
        ease: 'power2.inOut'
      })

      // 持续波动动画
      gsap.to(wave, {
        y: '-20%',
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: index * 0.2 + 1
      })

      // 悬停效果
      const cardEl = document.querySelector(card)
      if (cardEl) {
        cardEl.addEventListener('mouseenter', () => {
          gsap.to(cardEl, {
            y: -10,
            scale: 1.05,
            duration: 0.3,
            ease: 'power2.out'
          })
        })

        cardEl.addEventListener('mouseleave', () => {
          gsap.to(cardEl, {
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
          })
        })
      }
    })

    // 标题动画
    gsap.from('.lc-title-178', {
      scrollTrigger: {
        trigger: '.lc-container-178',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      y: -50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    })

    // 描述动画
    gsap.from('.lc-desc-178', {
      scrollTrigger: {
        trigger: '.lc-container-178',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      delay: 0.2,
      ease: 'power3.out'
    })

    // 提示动画
    gsap.from('.lc-hint-178', {
      scrollTrigger: {
        trigger: '.lc-stage-178',
        start: 'bottom 20%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 20,
      duration: 0.6
    })
  }, componentRoot.value)
})

onUnmounted(() => {
  if (ctx) ctx.revert()
})
</script>

<style scoped>
.lc-container-178 {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
}

.lc-title-178 {
  font-size: clamp(2rem, 5vw, 3.5rem);
  color: #fff;
  margin-bottom: 10px;
  text-align: center;
  background: linear-gradient(90deg, #00d2ff, #3a7bd5, #00d2ff);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 3s linear infinite;
}

@keyframes shimmer {
  to { background-position: 200% center; }
}

.lc-desc-178 {
  font-size: clamp(0.9rem, 2vw, 1.2rem);
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 40px;
  text-align: center;
}

.lc-stage-178 {
  width: 100%;
  max-width: 1000px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  padding: 20px;
}

.lc-card-178 {
  position: relative;
  height: 350px;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  will-change: transform;
}

.lc-card-inner-178 {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  overflow: hidden;
}

.lc-liquid-178 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  border-radius: 20px;
}

.lc-liquid-wave-178 {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: var(--card-color);
  border-radius: 40%;
  animation: wave 6s linear infinite;
  will-change: transform;
  opacity: 0.3;
}

.lc-liquid-wave-178::before {
  content: '';
  position: absolute;
  top: 5%;
  left: 5%;
  width: 90%;
  height: 90%;
  background: var(--card-color);
  border-radius: 38%;
  animation: wave 5s linear infinite;
  opacity: 0.4;
}

.lc-liquid-wave-178::after {
  content: '';
  position: absolute;
  top: 10%;
  left: 10%;
  width: 80%;
  height: 80%;
  background: var(--card-color);
  border-radius: 36%;
  animation: wave 7s linear infinite;
  opacity: 0.3;
}

@keyframes wave {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.lc-content-178 {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 30px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
}

.lc-icon-178 {
  font-size: 4rem;
  margin-bottom: 20px;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.lc-card-title-178 {
  font-size: 1.8rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: 10px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.lc-card-desc-178 {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
}

.lc-hint-178 {
  margin-top: 30px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
}

@media (max-width: 768px) {
  .lc-stage-178 {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 20px;
  }
  
  .lc-card-178 {
    height: 300px;
  }
  
  .lc-icon-178 {
    font-size: 3rem;
  }
  
  .lc-card-title-178 {
    font-size: 1.5rem;
  }
}
</style>
