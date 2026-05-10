<template>
  <div class="magnetic-field-179" ref="componentRoot">
    <div class="mf-container-179">
      <h2 class="mf-title-179">🧲 磁场卡片</h2>
      <p class="mf-desc-179">磁场跟随交互效果</p>
      
      <div class="mf-stage-179">
        <div 
          v-for="(card, index) in cards" 
          :key="index"
          class="mf-card-179"
          :data-index="index"
          ref="cardsRef"
        >
          <div class="mf-card-inner-179">
            <div class="mf-card-content-179">
              <div class="mf-card-icon-179">{{ card.icon }}</div>
              <div class="mf-card-title-179">{{ card.title }}</div>
              <div class="mf-card-desc-179">{{ card.desc }}</div>
            </div>
            <div class="mf-card-bg-179"></div>
          </div>
        </div>
      </div>
      
      <div class="mf-hint-179">移动鼠标体验磁场效果</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const componentRoot = ref<HTMLElement>()
const cardsRef = ref<HTMLElement[]>([])

const cards = [
  {
    icon: '⚡',
    title: '能量',
    desc: '快速响应'
  },
  {
    icon: '🎯',
    title: '精准',
    desc: '精确控制'
  },
  {
    icon: '🌟',
    title: '创意',
    desc: '无限可能'
  },
  {
    icon: '🚀',
    title: '速度',
    desc: '极致性能'
  },
  {
    icon: '💎',
    title: '品质',
    desc: '卓越体验'
  },
  {
    icon: '🔮',
    title: '未来',
    desc: '前沿技术'
  }
]

let ctx: any = null

onMounted(() => {
  ctx = gsap.context(() => {
    // 初始状态
    gsap.set('.mf-card-179', {
      scale: 0.8,
      opacity: 0,
      rotateX: 20
    })

    // 卡片入场动画
    gsap.to('.mf-card-179', {
      scrollTrigger: {
        trigger: '.mf-stage-179',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
      },
      scale: 1,
      opacity: 1,
      rotateX: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'back.out(1.7)'
    })

    // 标题动画
    gsap.from('.mf-title-179', {
      scrollTrigger: {
        trigger: '.mf-container-179',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      y: -50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    })

    // 描述动画
    gsap.from('.mf-desc-179', {
      scrollTrigger: {
        trigger: '.mf-container-179',
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
    gsap.from('.mf-hint-179', {
      scrollTrigger: {
        trigger: '.mf-stage-179',
        start: 'bottom 20%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 20,
      duration: 0.6
    })

    // 鼠标移动交互
    const handleMouseMove = (e: MouseEvent) => {
      const mouseX = e.clientX
      const mouseY = e.clientY

      cardsRef.value.forEach(card => {
        if (!card) return
        
        const rect = card.getBoundingClientRect()
        const cardCenterX = rect.left + rect.width / 2
        const cardCenterY = rect.top + rect.height / 2
        
        const deltaX = mouseX - cardCenterX
        const deltaY = mouseY - cardCenterY
        
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
        const maxDistance = 400
        const intensity = Math.max(0, 1 - distance / maxDistance)
        
        const moveX = deltaX * 0.1 * intensity
        const moveY = deltaY * 0.1 * intensity
        
        const rotateX = -deltaY * 0.05 * intensity
        const rotateY = deltaX * 0.05 * intensity
        
        gsap.to(card, {
          x: moveX,
          y: moveY,
          rotateX: rotateX,
          rotateY: rotateY,
          duration: 0.3,
          ease: 'power2.out'
        })
      })
    }

    const handleMouseLeave = () => {
      cardsRef.value.forEach(card => {
        if (!card) return
        gsap.to(card, {
          x: 0,
          y: 0,
          rotateX: 0,
          rotateY: 0,
          duration: 0.5,
          ease: 'power2.out'
        })
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    // 清理
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, componentRoot.value)
})

onUnmounted(() => {
  if (ctx) ctx.revert()
})
</script>

<style scoped>
.mf-container-179 {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
}

.mf-title-179 {
  font-size: clamp(2rem, 5vw, 3.5rem);
  color: #fff;
  margin-bottom: 10px;
  text-align: center;
  background: linear-gradient(90deg, #ff6b6b, #feca57, #48dbfb);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 3s linear infinite;
}

@keyframes shimmer {
  to { background-position: 200% center; }
}

.mf-desc-179 {
  font-size: clamp(0.9rem, 2vw, 1.2rem);
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 40px;
  text-align: center;
}

.mf-stage-179 {
  width: 100%;
  max-width: 1000px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  padding: 20px;
  perspective: 1000px;
}

.mf-card-179 {
  position: relative;
  height: 320px;
  perspective: 1000px;
  will-change: transform;
  transform-style: preserve-3d;
}

.mf-card-inner-179 {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  will-change: transform;
}

.mf-card-content-179 {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 0 30px rgba(255, 255, 255, 0.05);
  transform-style: preserve-3d;
}

.mf-card-bg-179 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 20px;
  background: linear-gradient(135deg, 
    rgba(255, 107, 107, 0.3),
    rgba(254, 202, 87, 0.3),
    rgba(72, 219, 251, 0.3)
  );
  filter: blur(20px);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.mf-card-179:hover .mf-card-bg-179 {
  opacity: 1;
}

.mf-card-icon-179 {
  font-size: 4rem;
  margin-bottom: 20px;
  transform: translateZ(30px);
}

.mf-card-title-179 {
  font-size: 1.8rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: 10px;
  transform: translateZ(20px);
}

.mf-card-desc-179 {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  transform: translateZ(15px);
}

.mf-hint-179 {
  margin-top: 30px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
}

@media (max-width: 768px) {
  .mf-stage-179 {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 20px;
  }
  
  .mf-card-179 {
    height: 280px;
  }
  
  .mf-card-icon-179 {
    font-size: 3rem;
  }
  
  .mf-card-title-179 {
    font-size: 1.5rem;
  }
}
</style>
