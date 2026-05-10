<template>
  <section class="gg-glass-gallery-section-16">
    <div class="gg-content-16">
      <h2 class="gg-section-title-16">玻璃态画廊</h2>
      <p class="gg-subtitle-16">毛玻璃效果与动态模糊</p>

      <div class="gg-gallery-grid-16">
        <div class="gg-glass-card-16" v-for="(card, index) in cards" :key="index" :ref="el => cardRefs[index] = el">
          <div class="gg-card-image-16" :style="{ backgroundImage: `linear-gradient(135deg, ${card.color1}, ${card.color2})` }">
            <div class="gg-image-overlay-16"></div>
          </div>
          <div class="gg-card-content-16">
            <h3>{{ card.title }}</h3>
            <p>{{ card.description }}</p>
            <div class="gg-card-meta-16">
              <span class="gg-tag-16" v-for="tag in card.tags" :key="tag">{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const cardRefs = ref<(HTMLElement | null)[]>([])

const cards = [
  { title: '光影效果', description: '动态光效与阴影渲染', color1: '#8b5cf6', color2: '#3b82f6', tags: ['3D', 'Light'] },
  { title: '粒子系统', description: '实时粒子碰撞模拟', color1: '#ec4899', color2: '#f43f5e', tags: ['Particle', 'Physics'] },
  { title: '流体动力学', description: '逼真的液体流动效果', color1: '#06b6d4', color2: '#10b981', tags: ['Fluid', 'Realistic'] },
  { title: '材质渲染', description: 'PBR材质与纹理映射', color1: '#f59e0b', color2: '#ef4444', tags: ['PBR', 'Texture'] },
  { title: '变形动画', description: '平滑的形状转换', color1: '#a855f7', color2: '#6366f1', tags: ['Morph', 'Smooth'] },
  { title: '音频响应', description: '音乐驱动的可视化', color1: '#14b8a6', color2: '#0ea5e9', tags: ['Audio', 'Viz'] }
]

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 标题入场动画
    gsap.from('.gg-section-title-16', {
      y: 100,
      opacity: 0,
      scale: 0.8,
      rotationX: -20,
      duration: 1.5,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: '.gg-glass-gallery-section-16',
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    })

    // 副标题入场
    gsap.from('.gg-subtitle-16', {
      y: 80,
      opacity: 0,
      scale: 0.8,
      duration: 1.2,
      delay: 0.2,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: '.gg-glass-gallery-section-16',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    })

    cardRefs.value.forEach((card, index) => {
      if (!card) return

      const image = card.querySelector('.gg-card-image-16') as HTMLElement
      const content = card.querySelector('.gg-card-content-16') as HTMLElement

      // 入场动画 - 增强效果
      gsap.from(card, {
        y: 250,
        opacity: 0,
        scale: 0.6,
        rotateX: 45,
        rotateY: -15,
        duration: 1.5,
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          end: 'top 40%',
          toggleActions: 'play none none reverse'
        },
        ease: 'back.out(1.7)'
      })

      // 图片视差
      gsap.to(image, {
        y: -50,
        scale: 1.2,
        duration: 1.5,
        scrollTrigger: {
          trigger: card,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5
        }
      })

      // 悬停效果
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -30,
          scale: 1.05,
          rotationX: 5,
          duration: 0.5,
          ease: 'power3.out'
        })

        gsap.to(image, {
          scale: 1.25,
          duration: 0.5,
          ease: 'power3.out'
        })

        gsap.to(content, {
          y: -15,
          duration: 0.5,
          ease: 'power3.out'
        })
      })

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          rotationX: 0,
          duration: 0.5,
          ease: 'power3.out'
        })

        gsap.to(image, {
          scale: 1.2,
          duration: 0.5,
          ease: 'power3.out'
        })

        gsap.to(content, {
          y: 0,
          duration: 0.5,
          ease: 'power3.out'
        })
      })
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.gg-glass-gallery-section-16 {
  min-height: 100vh;
  padding: 100px 20px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, #0a0a1a 0%, #1a1a3a 50%, #0a0a1a 100%);

  opacity: 1 !important;}

.gg-content-16 {
  max-width: 1400px;
  margin: 0 auto;

  opacity: 1 !important;}

.gg-section-title-16 {
  font-size: clamp(2rem, 4vw, 2.5rem);
  font-weight: 800;
  margin-bottom: 16px;
  text-align: center;
  background: linear-gradient(135deg, #c084fc, #60a5fa, #34d399);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  opacity: 1 !important;}

.gg-subtitle-16 {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  margin-bottom: 80px;

  opacity: 1 !important;}

.gg-gallery-grid-16 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
}

.gg-glass-card-16 {
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  overflow: hidden;
  cursor: pointer;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transform-style: preserve-3d;
  perspective: 1000px;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), transparent);
    pointer-events: none;
  
  opacity: 1 !important;}

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.6s ease;
    pointer-events: none;
  }

  &:hover::after {
    left: 100%;
  }
}

.gg-card-image-16 {
  position: relative;
  height: 220px;
  overflow: hidden;

  opacity: 1 !important;}

.gg-image-overlay-16 {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.6));

  opacity: 1 !important;}

.gg-card-content-16 {
  position: relative;
  padding: 24px;
  background: linear-gradient(to bottom, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.95));
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  opacity: 1 !important;}

.gg-card-content-16 h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #f1f5f9;
  margin-bottom: 8px;
}

.gg-card-content-16 p {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  margin-bottom: 16px;
}

.gg-card-meta-16 {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.gg-tag-16 {
  padding: 4px 12px;
  background: rgba(139, 92, 246, 0.2);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 20px;
  font-size: 0.8rem;
  color: #c4b5fd;
  font-weight: 500;

  opacity: 1 !important;}

@media (max-width: 768px) {
  .gg-gallery-grid-16 {
    grid-template-columns: 1fr;
  }
}
</style>
