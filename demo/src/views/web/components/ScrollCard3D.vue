<template>
  <div class="sc3d-section-103">
    <div class="sc3d-header-103">
      <h2 class="sc3d-title-103">卡片动画效果</h2>
      <p class="sc3d-desc-103">交错的3D卡片进入动画</p>
    </div>
    <div class="sc3d-grid-103">
      <div class="sc3d-card-103" v-for="(card, index) in cardItems" :key="index">
        <div class="sc3d-icon-103">{{ card.icon }}</div>
        <h3 class="sc3d-card-title-103">{{ card.title }}</h3>
        <p class="sc3d-card-desc-103">{{ card.desc }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

ScrollTrigger.config({
  ignoreMobileResize: true,
  autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load'
})

const cardItems = ref([
  { icon: '🚀', title: '高性能', desc: 'GSAP提供业界领先的动画性能' },
  { icon: '🎨', title: '易用性', desc: '简洁的API，快速上手' },
  { icon: '⚡', title: '灵活性', desc: '丰富的配置选项满足各种需求' },
  { icon: '📱', title: '响应式', desc: '完美适配各种设备尺寸' },
  { icon: '🎯', title: '精准控制', desc: '精确控制每一个动画细节' },
  { icon: '🌟', title: '社区支持', desc: '活跃的社区提供持续支持' }
])

let ctx: gsap.Context | null = null

onMounted(() => {
  ctx = gsap.context(() => {
    gsap.fromTo('.sc3d-title-103, .sc3d-desc-103',
      { y: 100, opacity: 0, scale: 0.7 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.sc3d-header-103',
          start: 'top 90%'
        }
      }
    )

    gsap.fromTo('.sc3d-card-103',
      {
        y: 200,
        opacity: 0,
        rotationX: 90,
        rotationY: 45,
        scale: 0.3
      },
      {
        y: 0,
        opacity: 1,
        rotationX: 0,
        rotationY: 0,
        scale: 1,
        duration: 1.2,
        ease: 'back.out(1.5)',
        stagger: { each: 0.15, from: 'center' },
        scrollTrigger: {
          trigger: '.sc3d-grid-103',
          start: 'top 85%'
        }
      }
    )
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped>
.sc3d-section-103 {
  padding: 100px 20px;
  background: rgba(0, 0, 0, 0.15);
}

.sc3d-header-103 {
  text-align: center;
  margin-bottom: 60px;
}

.sc3d-title-103 {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.sc3d-desc-103 {
  font-size: 1.2rem;
  color: #a0aec0;
  font-weight: 300;
}

.sc3d-grid-103 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.sc3d-card-103 {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  border-radius: 20px;
  padding: 40px 30px;
  text-align: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.sc3d-card-103:hover {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%);
  transform: translateY(-5px);
  border-color: rgba(102, 126, 234, 0.5);
}

.sc3d-icon-103 {
  font-size: 3rem;
  margin-bottom: 20px;
}

.sc3d-card-title-103 {
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 12px;
  color: #f093fb;
}

.sc3d-card-desc-103 {
  font-size: 1rem;
  color: #a0aec0;
  line-height: 1.6;
}
</style>
