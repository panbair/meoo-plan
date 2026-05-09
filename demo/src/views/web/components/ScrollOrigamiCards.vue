<template>
  <div class="oc-container-192">
    <h2 class="oc-title-192">折纸卡片滚动动画</h2>
    <div class="oc-stage-192">
      <div class="oc-cards-192">
        <div class="oc-card-192" v-for="(card, index) in cards" :key="index">
          <div class="oc-origami-192">
            <div class="oc-fold-192 oc-fold-1-192"></div>
            <div class="oc-fold-192 oc-fold-2-192"></div>
            <div class="oc-fold-192 oc-fold-3-192"></div>
            <div class="oc-fold-192 oc-fold-4-192"></div>
            <div class="oc-center-192"></div>
          </div>
          <div class="oc-content-192">
            <h3>{{ card.title }}</h3>
            <p>{{ card.description }}</p>
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
  { title: '折纸艺术', description: '传统折纸工艺' },
  { title: '几何美学', description: '完美的几何形状' },
  { title: '折叠创意', description: '无限的创意可能' },
  { title: '手工工艺', description: '精心的折叠制作' }
]

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 标题动画
    gsap.from('.oc-title-192', {
      scrollTrigger: {
        trigger: '.oc-title-192',
        start: 'top bottom-=100',
        toggleActions: 'play none none reverse'
      },
      y: -50,
      opacity: 0,
      rotate: -10,
      duration: 1,
      ease: 'power3.out'
    })

    // 卡片动画
    gsap.utils.toArray<HTMLElement>('.oc-card-192').forEach((card, index) => {
      const origami = card.querySelector('.oc-origami-192') as HTMLElement
      const folds = card.querySelectorAll('.oc-fold-192')
      const center = card.querySelector('.oc-center-192') as HTMLElement

      // 入场动画 - 折纸展开
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top bottom-=100',
          toggleActions: 'play none none reverse'
        },
        scale: 0,
        opacity: 0,
        rotate: 180,
        duration: 1.2,
        ease: 'elastic.out(1, 0.5)',
        delay: index * 0.15
      })

      // 折纸折叠动画 - 滚动触发
      folds.forEach((fold, foldIndex) => {
        gsap.to(fold, {
          scrollTrigger: {
            trigger: card,
            start: 'top center',
            end: 'bottom center',
            scrub: 1
          },
          rotate: foldIndex * 90,
          scale: 0.9,
          ease: 'none'
        })
      })

      // 中心旋转
      gsap.to(center, {
        scrollTrigger: {
          trigger: card,
          start: 'top center',
          end: 'bottom center',
          scrub: 1
        },
        rotate: 360,
        scale: 1.2,
        ease: 'none'
      })

      // 悬停效果
      card.addEventListener('mouseenter', () => {
        gsap.to(origami, {
          rotate: 45,
          scale: 1.1,
          duration: 0.5,
          ease: 'elastic.out(1, 0.5)'
        })
        folds.forEach((fold, i) => {
          gsap.to(fold, {
            rotate: i * 90 + 45,
            duration: 0.5,
            ease: 'elastic.out(1, 0.5)',
            delay: i * 0.05
          })
        })
        gsap.to(center, {
          scale: 1.5,
          duration: 0.3,
          ease: 'elastic.out(1, 0.5)'
        })
      })

      card.addEventListener('mouseleave', () => {
        gsap.to(origami, {
          rotate: 0,
          scale: 1,
          duration: 0.5,
          ease: 'power2.out'
        })
        folds.forEach((fold, i) => {
          gsap.to(fold, {
            rotate: 0,
            duration: 0.5,
            ease: 'power2.out',
            delay: i * 0.05
          })
        })
        gsap.to(center, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        })
      })
    })

    // 整体容器动画
    gsap.from('.oc-cards-192', {
      scrollTrigger: {
        trigger: '.oc-cards-192',
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

.oc-container-192 {
  min-height: 100vh;
  padding: 80px 20px;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1abe 50%, #0a0a0a 100%);
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.oc-container-192::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 40% 60%, rgba(255, 100, 100, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 60% 40%, rgba(100, 255, 100, 0.08) 0%, transparent 50%);
  pointer-events: none;
}

.oc-title-192 {
  text-align: center;
  font-size: 2.5rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: 60px;
  text-shadow: 2px 2px 0 #ff6464, 4px 4px 0 #64ff64;

  opacity: 1 !important;}

.oc-stage-192 {
  max-width: 1400px;
  margin: 0 auto;

  opacity: 1 !important;}

.oc-cards-192 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  perspective: 1000px;
}

.oc-card-192 {
  position: relative;
  padding: 40px 30px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  overflow: hidden;

  opacity: 1 !important;}

.oc-card-192:hover {
  transform: translateY(-10px);
  border-color: rgba(255, 100, 100, 0.5);
  box-shadow: 0 20px 40px rgba(255, 100, 100, 0.2);
}

.oc-origami-192 {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 30px;
  transition: all 0.5s ease;

  opacity: 1 !important;}

.oc-fold-192 {
  position: absolute;
  background: linear-gradient(135deg, rgba(255, 100, 100, 0.6) 0%, rgba(255, 100, 100, 0.3) 100%);
  transition: all 0.5s ease;
  border: 2px solid rgba(255, 255, 255, 0.3);

  opacity: 1 !important;}

.oc-fold-1-192 {
  top: 0;
  left: 0;
  width: 50%;
  height: 50%;
  transform-origin: right bottom;

  opacity: 1 !important;}

.oc-fold-2-192 {
  top: 0;
  right: 0;
  width: 50%;
  height: 50%;
  transform-origin: left bottom;
  background: linear-gradient(135deg, rgba(100, 255, 100, 0.6) 0%, rgba(100, 255, 100, 0.3) 100%);

  opacity: 1 !important;}

.oc-fold-3-192 {
  bottom: 0;
  left: 0;
  width: 50%;
  height: 50%;
  transform-origin: right top;
  background: linear-gradient(135deg, rgba(100, 100, 255, 0.6) 0%, rgba(100, 100, 255, 0.3) 100%);

  opacity: 1 !important;}

.oc-fold-4-192 {
  bottom: 0;
  right: 0;
  width: 50%;
  height: 50%;
  transform-origin: left top;
  background: linear-gradient(135deg, rgba(255, 255, 100, 0.6) 0%, rgba(255, 255, 100, 0.3) 100%);

  opacity: 1 !important;}

.oc-center-192 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 70%);
  border-radius: 50%;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;

  opacity: 1 !important;}

.oc-content-192 {
  text-align: center;

  opacity: 1 !important;}

.oc-content-192 h3 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: 10px;
}

.oc-content-192 p {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
}

@media (max-width: 768px) {
  .oc-title-192 {
    font-size: 1.8rem;
    text-shadow: 1px 1px 0 #ff6464, 2px 2px 0 #64ff64;
  
  opacity: 1 !important;}
  
  .oc-cards-192 {
    grid-template-columns: 1fr;
  }
}
</style>
