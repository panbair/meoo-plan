<template>
  <div class="pc-container-190">
    <h2 class="pc-title-190">像素艺术滚动动画</h2>
    <div class="pc-stage-190">
      <div class="pc-pixel-grid-190" ref="pixelGrid"></div>
      <div class="pc-cards-190">
        <div class="pc-card-190" v-for="(card, index) in cards" :key="index">
          <div class="pc-pixel-art-190">
            <div v-for="i in 64" :key="i" class="pc-pixel-190"></div>
          </div>
          <div class="pc-content-190">
            <h3>{{ card.title }}</h3>
            <p>{{ card.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const pixelGrid = ref<HTMLElement | null>(null)

const cards = [
  { title: '8位风格', description: '经典像素艺术' },
  { title: '复古游戏', description: '怀旧游戏时代' },
  { title: '像素世界', description: '数字化方块' },
  { title: '创意设计', description: '独特像素美学' }
]

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 创建像素网格背景
    if (pixelGrid.value) {
      const gridSize = 20
      for (let i = 0; i < gridSize * gridSize; i++) {
        const pixel = document.createElement('div')
        pixel.className = 'pc-bg-pixel-190'
        pixelGrid.value.appendChild(pixel)
      }

      // 像素动画
      gsap.utils.toArray<HTMLElement>('.pc-bg-pixel-190').forEach((pixel, index) => {
        gsap.to(pixel, {
          scrollTrigger: {
            trigger: pixelGrid.value,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          },
          opacity: Math.random() * 0.8 + 0.2,
          scale: Math.random() * 0.5 + 0.5,
          backgroundColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
          ease: 'none',
          delay: Math.random() * 0.1
        })
      })
    }

    // 标题动画
    gsap.from('.pc-title-190', {
      scrollTrigger: {
        trigger: '.pc-title-190',
        start: 'top bottom-=100',
        toggleActions: 'play none none reverse'
      },
      y: -50,
      opacity: 0,
      scale: 2,
      duration: 1,
      ease: 'power3.out'
    })

    // 卡片动画
    gsap.utils.toArray<HTMLElement>('.pc-card-190').forEach((card, index) => {
      const pixelArt = card.querySelector('.pc-pixel-art-190') as HTMLElement
      const pixels = card.querySelectorAll('.pc-pixel-190')

      // 入场动画 - 像素化效果
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top bottom-=100',
          toggleActions: 'play none none reverse'
        },
        scale: 0,
        opacity: 0,
        duration: 1,
        ease: 'elastic.out(1, 0.5)',
        delay: index * 0.2
      })

      // 像素动画
      pixels.forEach((pixel, pixelIndex) => {
        gsap.to(pixel, {
          scrollTrigger: {
            trigger: card,
            start: 'top center',
            end: 'bottom center',
            scrub: 1
          },
          backgroundColor: `hsl(${(index * 90 + pixelIndex * 5) % 360}, 70%, 50%)`,
          scale: 1.1,
          ease: 'none'
        })
      })

      // 悬停效果
      card.addEventListener('mouseenter', () => {
        gsap.to(pixelArt, {
          rotate: 180,
          scale: 1.1,
          duration: 0.5,
          ease: 'elastic.out(1, 0.5)'
        })
        pixels.forEach((pixel, i) => {
          gsap.to(pixel, {
            scale: 1.2,
            duration: 0.3,
            delay: i * 0.01,
            ease: 'power2.out'
          })
        })
      })

      card.addEventListener('mouseleave', () => {
        gsap.to(pixelArt, {
          rotate: 0,
          scale: 1,
          duration: 0.5,
          ease: 'power2.out'
        })
        pixels.forEach((pixel) => {
          gsap.to(pixel, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
          })
        })
      })
    })

    // 整体入场
    gsap.from('.pc-cards-190', {
      scrollTrigger: {
        trigger: '.pc-cards-190',
        start: 'top bottom-=50',
        toggleActions: 'play none none reverse'
      },
      y: 100,
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

.pc-container-190 {
  min-height: 100vh;
  padding: 80px 20px;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a9e 50%, #0a0a0a 100%);
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.pc-container-190::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    linear-gradient(0deg, rgba(0, 0, 0, 0.8) 0%, transparent 50%, rgba(0, 0, 0, 0.8) 100%);
  pointer-events: none;
}

.pc-title-190 {
  text-align: center;
  font-size: 2.5rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: 60px;
  text-transform: uppercase;
  letter-spacing: 3px;
  text-shadow: 4px 4px 0 #ff00ff, 8px 8px 0 #00ffff;

  opacity: 1 !important;}

.pc-stage-190 {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;

  opacity: 1 !important;}

.pc-pixel-grid-190 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: grid;
  grid-template-columns: repeat(20, 1fr);
  gap: 2px;
  pointer-events: none;
  opacity: 0.3;
}

.pc-bg-pixel-190 {
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;

  opacity: 1 !important;}

.pc-cards-190 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  position: relative;
  z-index: 1;
}

.pc-card-190 {
  position: relative;
  padding: 40px 30px;
  background: rgba(0, 0, 0, 0.7);
  border: 4px solid #fff;
  image-rendering: pixelated;
  transition: all 0.3s ease;

  opacity: 1 !important;}

.pc-card-190:hover {
  transform: translateY(-10px);
  border-color: #ff00ff;
  box-shadow: 8px 8px 0 rgba(255, 0, 255, 0.5);
}

.pc-pixel-art-190 {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 2px;
  width: 120px;
  height: 120px;
  margin: 0 auto 30px;
  transition: all 0.5s ease;

  opacity: 1 !important;}

.pc-pixel-190 {
  background: rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;

  opacity: 1 !important;}

.pc-content-190 {
  text-align: center;

  opacity: 1 !important;}

.pc-content-190 h3 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.pc-content-190 p {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
}

@media (max-width: 768px) {
  .pc-title-190 {
    font-size: 1.8rem;
    text-shadow: 2px 2px 0 #ff00ff, 4px 4px 0 #00ffff;
  
  opacity: 1 !important;}
  
  .pc-cards-190 {
    grid-template-columns: 1fr;
  }
  
  .pc-pixel-grid-190 {
    grid-template-columns: repeat(10, 1fr);
  }
}
</style>
