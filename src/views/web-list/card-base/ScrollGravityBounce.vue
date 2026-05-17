<template>
  <div class="sgs-section-110">
    <div class="sgs-header-110">
      <h2 class="sgs-title-110">重力弹跳效果</h2>
      <p class="sgs-desc-110">模拟真实物理的弹跳动画</p>
    </div>
    <div class="sgs-container-110">
      <div class="sgs-item-110" v-for="(item, index) in items" :key="index">
        <div class="sgs-circle-110" :style="{ '--delay': index * 0.1 + 's' }"></div>
        <span class="sgs-label-110">{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

ScrollTrigger.config({
  ignoreMobileResize: true,
  autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load'
})

const items = [
  { label: '弹性' },
  { label: '重力' },
  { label: '反弹' },
  { label: '动量' },
  { label: '惯性' },
  { label: '阻尼' }
]

let ctx: gsap.Context | null = null

onMounted(() => {
  ctx = gsap.context(() => {
    gsap.fromTo('.sgs-title-110, .sgs-desc-110',
      { y: 100, opacity: 0, scale: 0.7 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.sgs-header-110',
          start: 'top 90%'
        }
      }
    )

    gsap.fromTo('.sgs-item-110',
      {
        y: -400,
        opacity: 0,
        scale: 0.5
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 2,
        ease: 'bounce.out',
        stagger: {
          each: 0.15,
          from: 'center'
        },
        scrollTrigger: {
          trigger: '.sgs-container-110',
          start: 'top 85%'
        }
      }
    )

    gsap.fromTo('.sgs-circle-110',
      {
        rotation: -720,
        scale: 0
      },
      {
        rotation: 0,
        scale: 1,
        duration: 1.5,
        ease: 'back.out(2)',
        stagger: {
          each: 0.15,
          from: 'center'
        },
        scrollTrigger: {
          trigger: '.sgs-container-110',
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
.sgs-section-110 {
  padding: 100px 20px;
  background: rgba(0, 0, 0, 0.2);
  min-height: 600px;
}

.sgs-header-110 {
  text-align: center;
  margin-bottom: 80px;
}

.sgs-title-110 {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.sgs-desc-110 {
  font-size: 1.2rem;
  color: #a0aec0;
  font-weight: 300;
}

.sgs-container-110 {
  display: flex;
  justify-content: center;
  gap: 50px;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px;
}

.sgs-item-110 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.sgs-circle-110 {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  box-shadow: 0 8px 32px rgba(79, 172, 254, 0.4);
  transition: transform 0.3s ease;
}

.sgs-circle-110:hover {
  transform: scale(1.2);
}

.sgs-label-110 {
  font-size: 1.1rem;
  font-weight: 500;
  color: #e2e8f0;
}

@media (max-width: 768px) {
  .sgs-container-110 {
    gap: 30px;
  }

  .sgs-circle-110 {
    width: 60px;
    height: 60px;
  }

  .sgs-label-110 {
    font-size: 0.9rem;
  }
}
</style>
