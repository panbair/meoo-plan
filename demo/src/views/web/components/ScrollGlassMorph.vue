<template>
  <div class="gm-container-193">
    <h2 class="gm-title-193">玻璃态滚动动画</h2>
    <div class="gm-stage-193">
      <div class="gm-cards-193">
        <div class="gm-card-193" v-for="(card, index) in cards" :key="index">
          <div class="gm-glass-193">
            <div class="gm-reflection-193"></div>
            <div class="gm-content-193">
              <div class="gm-icon-193">{{ card.icon }}</div>
              <h3>{{ card.title }}</h3>
              <p>{{ card.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const cards = [
  { icon: '🔮', title: '模糊效果', description: '磨砂玻璃质感' },
  { icon: '✨', title: '反射光影', description: '自然光反射效果' },
  { icon: '💎', title: '透明质感', description: '半透明玻璃材质' },
  { icon: '🌈', title: '色彩渐变', description: '优雅的色彩过渡' }
]

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 标题动画
    gsap.from('.gm-title-193', {
      scrollTrigger: {
        trigger: '.gm-title-193',
        start: 'top bottom-=100',
        toggleActions: 'play none none reverse'
      },
      y: -50,
      opacity: 0,
      scale: 1.2,
      duration: 1,
      ease: 'power3.out'
    })

    // 卡片动画
    gsap.utils.toArray<HTMLElement>('.gm-card-193').forEach((card, index) => {
      const glass = card.querySelector('.gm-glass-193') as HTMLElement
      const reflection = card.querySelector('.gm-reflection-193') as HTMLElement

      // 入场动画 - 玻璃显现
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top bottom-=100',
          toggleActions: 'play none none reverse'
        },
        scale: 0,
        opacity: 0,
        rotateY: 90,
        duration: 1.2,
        ease: 'elastic.out(1, 0.5)',
        delay: index * 0.15
      })

      // 反射动画 - 滚动触发
      gsap.to(reflection, {
        scrollTrigger: {
          trigger: card,
          start: 'top center',
          end: 'bottom center',
          scrub: 1
        },
          rotate: 45,
          opacity: 0.8,
          scale: 1.2,
          ease: 'none'
      })

      // 玻璃效果动画
      gsap.to(glass, {
        scrollTrigger: {
          trigger: card,
          start: 'top center',
          end: 'bottom center',
          scrub: 1
        },
          backdropFilter: 'blur(15px)',
          ease: 'none'
      })

      // 悬停效果
      card.addEventListener('mouseenter', () => {
        gsap.to(glass, {
          rotateX: 10,
          rotateY: 10,
          scale: 1.05,
          duration: 0.5,
          ease: 'elastic.out(1, 0.5)'
        })
        gsap.to(reflection, {
          opacity: 1,
          scale: 1.5,
          duration: 0.3,
          ease: 'power2.out'
        })
        gsap.to(card.querySelector('.gm-icon-193'), {
          scale: 1.3,
          rotate: 360,
          duration: 0.5,
          ease: 'elastic.out(1, 0.3)'
        })
      })

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width - 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5

        gsap.to(glass, {
          rotateX: -y * 20,
          rotateY: x * 20,
          duration: 0.3,
          ease: 'power2.out'
        })

        gsap.to(reflection, {
          x: x * 50,
          y: y * 50,
          duration: 0.3,
          ease: 'power2.out'
        })
      })

      card.addEventListener('mouseleave', () => {
        gsap.to(glass, {
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          duration: 0.5,
          ease: 'power2.out'
        })
        gsap.to(reflection, {
          opacity: 0.5,
          scale: 1,
          x: 0,
          y: 0,
          duration: 0.3,
          ease: 'power2.out'
        })
        gsap.to(card.querySelector('.gm-icon-193'), {
          scale: 1,
          rotate: 0,
          duration: 0.5,
          ease: 'power2.out'
        })
      })
    })

    // 整体容器动画
    gsap.from('.gm-cards-193', {
      scrollTrigger: {
        trigger: '.gm-cards-193',
        start: 'top bottom-=50',
        toggleActions: 'play none none reverse'
      },
      scale: 0.8,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    })
  })
})

onUnmounted(() => {
  ctx.revert()
})
</script>

<style scoped>
/* GSAP opacity fix: ensure content is always visible */

.gm-container-193 {
  min-height: 100vh;
  padding: 80px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.gm-container-193::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.2) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.gm-title-193 {
  text-align: center;
  font-size: 2.5rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: 60px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);

  opacity: 1 !important;}

.gm-stage-193 {
  max-width: 1400px;
  margin: 0 auto;

  opacity: 1 !important;}

.gm-cards-193 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  perspective: 1000px;
}

.gm-card-193 {
  perspective: 1000px;
}

.gm-glass-193 {
  position: relative;
  padding: 50px 30px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.5s ease;
  transform-style: preserve-3d;
  overflow: hidden;

  opacity: 1 !important;}

.gm-glass-193::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.2) 0%, 
    transparent 50%, 
    rgba(255, 255, 255, 0.1) 100%);
  border-radius: 20px;
  pointer-events: none;
}

.gm-reflection-193 {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, 
    transparent 40%, 
    rgba(255, 255, 255, 0.3) 50%, 
    transparent 60%);
  opacity: 0.5;
  transition: all 0.3s ease;
  pointer-events: none;
}

.gm-content-193 {
  position: relative;
  z-index: 1;
  text-align: center;
  transform: translateZ(20px);

  opacity: 1 !important;}

.gm-icon-193 {
  font-size: 3rem;
  margin-bottom: 20px;
  display: inline-block;
  transition: transform 0.5s ease;

  opacity: 1 !important;}

.gm-content-193 h3 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: 10px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.gm-content-193 p {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .gm-title-193 {
    font-size: 1.8rem;
  
  opacity: 1 !important;}
  
  .gm-cards-193 {
    grid-template-columns: 1fr;
  }
}
</style>
