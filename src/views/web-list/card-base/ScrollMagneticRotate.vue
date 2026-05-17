<template>
  <div class="smr-section-108">
    <div class="smr-header-108">
      <h2 class="smr-title-108">磁性旋转效果</h2>
      <p class="smr-desc-108">跟随鼠标角度的智能旋转动画</p>
    </div>
    <div class="smr-grid-108">
      <div class="smr-card-108" v-for="(item, index) in cardItems" :key="index">
        <div class="smr-inner-108" ref="cardInner">
          <div class="smr-front-108">
            <div class="smr-icon-108">{{ item.icon }}</div>
            <h3 class="smr-card-title-108">{{ item.title }}</h3>
          </div>
          <div class="smr-glow-108"></div>
        </div>
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
  { icon: '🧲', title: '磁力吸引' },
  { icon: '🌀', title: '动态旋转' },
  { icon: '✨', title: '光影效果' },
  { icon: '🎯', title: '精准控制' },
  { icon: '🌟', title: '流畅动画' },
  { icon: '💫', title: '视觉冲击' }
])

const cardInner = ref<HTMLElement[]>([])
let ctx: gsap.Context | null = null
let mouseX = 0
let mouseY = 0

onMounted(() => {
  ctx = gsap.context(() => {
    gsap.fromTo('.smr-title-108, .smr-desc-108',
      { y: 120, opacity: 0, scale: 0.7 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.smr-header-108',
          start: 'top 90%'
        }
      }
    )

    gsap.fromTo('.smr-card-108',
      {
        y: 250,
        opacity: 0,
        rotationX: 90,
        scale: 0.2
      },
      {
        y: 0,
        opacity: 1,
        rotationX: 0,
        scale: 1,
        duration: 1.3,
        ease: 'back.out(2)',
        stagger: { each: 0.12, from: 'center' },
        scrollTrigger: {
          trigger: '.smr-grid-108',
          start: 'top 85%'
        }
      }
    )

    cardInner.value.forEach((el) => {
      el.addEventListener('mousemove', handleMouseMove)
      el.addEventListener('mouseleave', handleMouseLeave)
    })

    window.addEventListener('mousemove', updateMousePosition)
  })
})

const updateMousePosition = (e: MouseEvent) => {
  mouseX = e.clientX
  mouseY = e.clientY
}

const handleMouseMove = (e: MouseEvent) => {
  const el = e.currentTarget as HTMLElement
  const rect = el.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2

  const rotateX = (mouseY - centerY) / 15
  const rotateY = (centerX - mouseX) / 15

  gsap.to(el, {
    rotationX: rotateX,
    rotationY: rotateY,
    duration: 0.4,
    ease: 'power2.out'
  })
}

const handleMouseLeave = (e: MouseEvent) => {
  const el = e.currentTarget as HTMLElement
  gsap.to(el, {
    rotationX: 0,
    rotationY: 0,
    duration: 0.6,
    ease: 'elastic.out(1, 0.5)'
  })
}

onUnmounted(() => {
  ctx?.revert()
  cardInner.value.forEach((el) => {
    el.removeEventListener('mousemove', handleMouseMove)
    el.removeEventListener('mouseleave', handleMouseLeave)
  })
  window.removeEventListener('mousemove', updateMousePosition)
})
</script>

<style scoped>
.smr-section-108 {
  padding: 100px 20px;
  background: rgba(0, 0, 0, 0.2);
  perspective: 1500px;
}

.smr-header-108 {
  text-align: center;
  margin-bottom: 60px;
}

.smr-title-108 {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.smr-desc-108 {
  font-size: 1.2rem;
  color: #a0aec0;
  font-weight: 300;
}

.smr-grid-108 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.smr-card-108 {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  border-radius: 24px;
  padding: 40px;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
}

.smr-inner-108 {
  transform-style: preserve-3d;
  transition: transform 0.1s;
}

.smr-front-108 {
  transform: translateZ(40px);
}

.smr-icon-108 {
  font-size: 4rem;
  margin-bottom: 20px;
}

.smr-card-title-108 {
  font-size: 1.4rem;
  font-weight: 600;
  color: #f093fb;
}

.smr-glow-108 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(102, 126, 234, 0.3) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

.smr-card-108:hover .smr-glow-108 {
  opacity: 1;
}
</style>
