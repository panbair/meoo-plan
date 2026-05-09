<template>
  <div class="neon-glow-179" ref="componentRoot">
    <div class="ng-container-179">
      <h2 class="ng-title-179">✨ 霓虹发光</h2>
      <p class="ng-desc-179">滚动触发霓虹发光效果</p>
      
      <div class="ng-stage-179">
        <div 
          v-for="(item, index) in items" 
          :key="index"
          class="ng-item-179"
          :data-index="index"
          :style="{ '--neon-color': item.color }"
        >
          <div class="ng-glow-179"></div>
          <div class="ng-content-179">
            <div class="ng-icon-179">{{ item.icon }}</div>
            <div class="ng-item-title-179">{{ item.title }}</div>
            <div class="ng-item-desc-179">{{ item.desc }}</div>
          </div>
        </div>
      </div>
      
      <div class="ng-hint-179">滚动触发霓虹发光</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const componentRoot = ref<HTMLElement>()

const items = [
  {
    icon: '💎',
    title: '璀璨',
    desc: '光芒闪耀',
    color: '#ff6b6b'
  },
  {
    icon: '🌟',
    title: '星光',
    desc: '璀璨夺目',
    color: '#feca57'
  },
  {
    icon: '⚡',
    title: '闪电',
    desc: '电光火石',
    color: '#48dbfb'
  },
  {
    icon: '🔥',
    title: '火焰',
    desc: '热情似火',
    color: '#ff9ff3'
  },
  {
    icon: '💧',
    title: '水晶',
    desc: '晶莹剔透',
    color: '#54a0ff'
  },
  {
    icon: '🌈',
    title: '彩虹',
    desc: '七彩斑斓',
    color: '#5f27cd'
  }
]

let ctx: any = null

onMounted(() => {
  ctx = gsap.context(() => {
    // 初始状态
    gsap.set('.ng-item-179', {
      scale: 0.8,
      opacity: 0,
      filter: 'brightness(0.3)'
    })

    gsap.set('.ng-glow-179', {
      scale: 0,
      opacity: 0
    })

    // 项目依次出现
    items.forEach((_, index) => {
      const item = `.ng-item-179:nth-child(${index + 1})`
      const glow = `${item} .ng-glow-179`

      gsap.to(item, {
        scrollTrigger: {
          trigger: item,
          start: 'top 80%',
          end: 'top 20%',
          toggleActions: 'play none none reverse'
        },
        scale: 1,
        opacity: 1,
        filter: 'brightness(1)',
        duration: 1,
        delay: index * 0.1,
        ease: 'elastic.out(1, 0.6)'
      })

      // 霓虹发光动画
      gsap.to(glow, {
        scrollTrigger: {
          trigger: item,
          start: 'top 80%',
          end: 'top 20%',
          toggleActions: 'play none none reverse'
        },
        scale: 1.5,
        opacity: 0.8,
        duration: 0.8,
        delay: index * 0.1 + 0.2,
        ease: 'power2.out'
      })

      // 持续发光脉冲
      gsap.to(glow, {
        scale: 1.8,
        opacity: 0.6,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: index * 0.15 + 1
      })

      // 悬停效果
      const itemEl = document.querySelector(item)
      if (itemEl) {
        itemEl.addEventListener('mouseenter', () => {
          gsap.to(itemEl, {
            scale: 1.1,
            duration: 0.3,
            ease: 'power2.out'
          })
          gsap.to(glow, {
            scale: 2.2,
            opacity: 1,
            duration: 0.3,
            ease: 'power2.out'
          })
        })

        itemEl.addEventListener('mouseleave', () => {
          gsap.to(itemEl, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
          })
          gsap.to(glow, {
            scale: 1.5,
            opacity: 0.8,
            duration: 0.3,
            ease: 'power2.out'
          })
        })
      }
    })

    // 标题动画
    gsap.from('.ng-title-179', {
      scrollTrigger: {
        trigger: '.ng-container-179',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      y: -50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    })

    // 描述动画
    gsap.from('.ng-desc-179', {
      scrollTrigger: {
        trigger: '.ng-container-179',
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
    gsap.from('.ng-hint-179', {
      scrollTrigger: {
        trigger: '.ng-stage-179',
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
.ng-container-179 {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 50%, #0a0a2a 100%);
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
}

.ng-title-179 {
  font-size: clamp(2rem, 5vw, 3.5rem);
  color: #fff;
  margin-bottom: 10px;
  text-align: center;
  background: linear-gradient(90deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3);
  background-size: 300% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 3s linear infinite;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.5);
}

@keyframes shimmer {
  to { background-position: 300% center; }
}

.ng-desc-179 {
  font-size: clamp(0.9rem, 2vw, 1.2rem);
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 40px;
  text-align: center;
}

.ng-stage-179 {
  width: 100%;
  max-width: 1000px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  padding: 20px;
}

.ng-item-179 {
  position: relative;
  height: 320px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 2px solid var(--neon-color);
  cursor: pointer;
  will-change: transform, filter;
  overflow: hidden;
  box-shadow: 0 0 20px var(--neon-color);
}

.ng-glow-179 {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px;
  height: 200px;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, var(--neon-color) 0%, transparent 70%);
  filter: blur(30px);
  pointer-events: none;
  will-change: transform, opacity;
}

.ng-content-179 {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 30px;
}

.ng-icon-179 {
  font-size: 4rem;
  margin-bottom: 20px;
  filter: drop-shadow(0 0 20px var(--neon-color));
}

.ng-item-title-179 {
  font-size: 1.8rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: 10px;
  text-shadow: 0 0 10px var(--neon-color);
}

.ng-item-desc-179 {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
}

.ng-hint-179 {
  margin-top: 30px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
}

@media (max-width: 768px) {
  .ng-stage-179 {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 20px;
  }
  
  .ng-item-179 {
    height: 280px;
  }
  
  .ng-icon-179 {
    font-size: 3rem;
  }
  
  .ng-item-title-179 {
    font-size: 1.5rem;
  }
}
</style>
