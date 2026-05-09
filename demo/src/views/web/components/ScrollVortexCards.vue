<template>
  <div class="vc-container-189">
    <h2 class="vc-title-189">涡旋卡片滚动动画</h2>
    <div class="vc-stage-189">
      <div class="vc-vortex-189" ref="vortexContainer">
        <div class="vc-ring-189 vc-ring-1-189"></div>
        <div class="vc-ring-189 vc-ring-2-189"></div>
        <div class="vc-ring-189 vc-ring-3-189"></div>
        <div class="vc-ring-189 vc-ring-4-189"></div>
        <div class="vc-core-189"></div>
      </div>
      <div class="vc-cards-189">
        <div class="vc-card-189" v-for="(card, index) in cards" :key="index">
          <div class="vc-card-inner-189">
            <div class="vc-icon-189">{{ card.icon }}</div>
            <h3>{{ card.title }}</h3>
            <p>{{ card.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const vortexContainer = ref<HTMLElement | null>(null)

const cards = [
  { icon: '🌀', title: '时空涡旋', description: '穿越时空隧道' },
  { icon: '💫', title: '星云漩涡', description: '宇宙中的旋转' },
  { icon: '🌊', title: '海洋漩涡', description: '深海的神秘力量' },
  { icon: '🔥', title: '火焰漩涡', description: '燃烧的旋转能量' },
  { icon: '⚡', title: '电磁漩涡', description: '电荷的螺旋运动' },
  { icon: '❄️', title: '冰雪漩涡', description: '寒冷的旋转风暴' }
]

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 标题动画
    gsap.from('.vc-title-189', {
      scrollTrigger: {
        trigger: '.vc-title-189',
        start: 'top bottom-=100',
        toggleActions: 'play none none reverse'
      },
      y: -50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    })

    // 涡旋动画 - 滚动触发
    const rings = gsap.utils.toArray('.vc-ring-189')
    rings.forEach((ring, index) => {
      gsap.to(ring, {
        scrollTrigger: {
          trigger: vortexContainer.value,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        },
        rotate: (index + 1) * 720,
        scale: 1.2 + index * 0.1,
        opacity: 0.6,
        ease: 'none'
      })
    })

    // 核心动画
    gsap.to('.vc-core-189', {
      scrollTrigger: {
        trigger: vortexContainer.value,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      },
      rotate: 360,
      scale: 1.5,
      opacity: 0.8,
      ease: 'none'
    })

    // 卡片动画
    gsap.utils.toArray<HTMLElement>('.vc-card-189').forEach((card, index) => {
      const inner = card.querySelector('.vc-card-inner-189') as HTMLElement

      // 入场动画 - 螺旋式
      const angle = index * 60
      const radius = 200
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top bottom-=100',
          toggleActions: 'play none none reverse'
        },
        x: Math.cos(angle * Math.PI / 180) * radius,
        y: Math.sin(angle * Math.PI / 180) * radius,
        scale: 0,
        opacity: 0,
        rotate: -360,
        duration: 1.2,
        ease: 'elastic.out(1, 0.5)',
        delay: index * 0.1
      })

      // 悬停效果
      card.addEventListener('mouseenter', () => {
        gsap.to(inner, {
          rotate: 10,
          scale: 1.1,
          duration: 0.5,
          ease: 'elastic.out(1, 0.5)'
        })
        gsap.to(card.querySelector('.vc-icon-189'), {
          rotate: 360,
          scale: 1.3,
          duration: 0.5,
          ease: 'elastic.out(1, 0.3)'
        })
        gsap.to(card, {
          boxShadow: '0 20px 40px rgba(100, 100, 255, 0.3)',
          duration: 0.3
        })
      })

      card.addEventListener('mouseleave', () => {
        gsap.to(inner, {
          rotate: 0,
          scale: 1,
          duration: 0.5,
          ease: 'power2.out'
        })
        gsap.to(card.querySelector('.vc-icon-189'), {
          rotate: 0,
          scale: 1,
          duration: 0.5,
          ease: 'power2.out'
        })
        gsap.to(card, {
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
          duration: 0.3
        })
      })
    })

    // 整体涡旋入场
    if (vortexContainer.value) {
      gsap.from(vortexContainer.value, {
        scrollTrigger: {
          trigger: vortexContainer.value,
          start: 'top bottom-=100',
          toggleActions: 'play none none reverse'
        },
        scale: 0,
        opacity: 0,
        rotate: -180,
        duration: 1.5,
        ease: 'elastic.out(1, 0.5)'
      })
    }
  })
})
</script>

<style scoped>
/* GSAP opacity fix: ensure content is always visible */

.vc-container-189 {
  min-height: 100vh;
  padding: 80px 20px;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a8e 50%, #0a0a0a 100%);
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.vc-container-189::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 50% 50%, rgba(100, 100, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(255, 100, 255, 0.05) 0%, transparent 70%);
  pointer-events: none;
}

.vc-title-189 {
  text-align: center;
  font-size: 2.5rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: 60px;
  text-shadow: 0 0 30px rgba(100, 100, 255, 0.5), 0 0 60px rgba(255, 100, 255, 0.3);

  opacity: 1 !important;}

.vc-stage-189 {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;

  opacity: 1 !important;}

.vc-vortex-189 {
  position: relative;
  width: 400px;
  height: 400px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;

  opacity: 1 !important;}

.vc-ring-189 {
  position: absolute;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transition: all 0.3s ease;

  opacity: 1 !important;}

.vc-ring-1-189 {
  width: 100px;
  height: 100px;
  border-color: rgba(100, 100, 255, 0.5);
  animation: vc-rotate-189 3s linear infinite;

  opacity: 1 !important;}

.vc-ring-2-189 {
  width: 150px;
  height: 150px;
  border-color: rgba(150, 100, 255, 0.5);
  animation: vc-rotate-189 4s linear infinite reverse;

  opacity: 1 !important;}

.vc-ring-3-189 {
  width: 200px;
  height: 200px;
  border-color: rgba(200, 100, 255, 0.5);
  animation: vc-rotate-189 5s linear infinite;

  opacity: 1 !important;}

.vc-ring-4-189 {
  width: 250px;
  height: 250px;
  border-color: rgba(255, 100, 255, 0.5);
  animation: vc-rotate-189 6s linear infinite reverse;

  opacity: 1 !important;}

@keyframes vc-rotate-189 {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.vc-core-189 {
  position: absolute;
  width: 60px;
  height: 60px;
  background: radial-gradient(circle, rgba(100, 100, 255, 0.8) 0%, transparent 70%);
  border-radius: 50%;
  box-shadow: 0 0 30px rgba(100, 100, 255, 0.5);
  animation: vc-pulse-189 2s ease-in-out infinite;

  opacity: 1 !important;}

@keyframes vc-pulse-189 {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.2); opacity: 1; }
}

.vc-cards-189 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.vc-card-189 {
  position: relative;
  padding: 30px 20px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  overflow: hidden;

  opacity: 1 !important;}

.vc-card-189::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, 
    rgba(100, 100, 255, 0.1) 0%, 
    transparent 50%,
    rgba(255, 100, 255, 0.1) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.vc-card-189:hover::before {
  opacity: 1;
}

.vc-card-189:hover {
  transform: translateY(-5px);
  border-color: rgba(100, 100, 255, 0.5);
}

.vc-card-inner-189 {
  position: relative;
  z-index: 1;
  text-align: center;
  transition: all 0.3s ease;

  opacity: 1 !important;}

.vc-icon-189 {
  font-size: 2.5rem;
  margin-bottom: 15px;
  display: inline-block;
  transition: transform 0.5s ease;

  opacity: 1 !important;}

.vc-card-189 h3 {
  font-size: 1.2rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: 8px;
}

.vc-card-189 p {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

@media (max-width: 1024px) {
  .vc-stage-189 {
    grid-template-columns: 1fr;
  }
  
  .vc-vortex-189 {
    width: 300px;
    height: 300px;
  
  opacity: 1 !important;}
  
  .vc-cards-189 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .vc-title-189 {
    font-size: 1.8rem;
  
  opacity: 1 !important;}
  
  .vc-vortex-189 {
    width: 250px;
    height: 250px;
  
  opacity: 1 !important;}
  
  .vc-cards-189 {
    grid-template-columns: 1fr;
  }
}
</style>
