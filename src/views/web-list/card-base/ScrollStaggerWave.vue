<template>
  <div class="ssw-section-106">
    <div class="ssw-header-106">
      <h2 class="ssw-title-106">交错动画效果</h2>
      <p class="ssw-desc-106">元素依次进入的优雅节奏</p>
    </div>
    <div class="ssw-grid-106">
      <div class="ssw-item-106" v-for="(_, index) in 12" :key="index">
        <span class="ssw-number-106">{{ String(index + 1).padStart(2, '0') }}</span>
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

let ctx: gsap.Context | null = null

onMounted(() => {
  ctx = gsap.context(() => {
    gsap.fromTo('.ssw-title-106, .ssw-desc-106',
      { y: 100, opacity: 0, scale: 0.7 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.ssw-header-106',
          start: 'top 90%'
        }
      }
    )

    gsap.fromTo('.ssw-item-106',
      {
        y: 150,
        opacity: 0,
        scale: 0.2,
        rotation: index => index % 2 === 0 ? 45 : -45
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.8,
        ease: 'back.out(1.5)',
        stagger: {
          each: 0.08,
          from: 'edges'
        },
        scrollTrigger: {
          trigger: '.ssw-grid-106',
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
.ssw-section-106 {
  padding: 100px 20px;
  background: rgba(0, 0, 0, 0.15);
}

.ssw-header-106 {
  text-align: center;
  margin-bottom: 60px;
}

.ssw-title-106 {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.ssw-desc-106 {
  font-size: 1.2rem;
  color: #a0aec0;
  font-weight: 300;
}

.ssw-grid-106 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.ssw-item-106 {
  aspect-ratio: 1;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  border: 2px solid rgba(102, 126, 234, 0.5);
  transition: all 0.3s ease;
}

.ssw-item-106:hover {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.5) 0%, rgba(118, 75, 162, 0.5) 100%);
  transform: scale(1.1);
}

.ssw-number-106 {
  font-size: 1.5rem;
  font-weight: 700;
}
</style>
