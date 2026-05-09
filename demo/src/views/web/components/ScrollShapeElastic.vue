<template>
  <div class="sse-section-105">
    <div class="sse-header-105">
      <h2 class="sse-title-105">缩放旋转效果</h2>
      <p class="sse-desc-105">3D空间的弹性进入动画</p>
    </div>
    <div class="sse-shapes-105">
      <div class="sse-shape-105 sse-circle-105" data-label="圆形">
        <span class="sse-inner-105">圆形</span>
      </div>
      <div class="sse-shape-105 sse-square-105" data-label="方形">
        <span class="sse-inner-105">方形</span>
      </div>
      <div class="sse-shape-105 sse-triangle-105" data-label="三角">
        <span class="sse-inner-105">三角</span>
      </div>
      <div class="sse-shape-105 sse-diamond-105" data-label="菱形">
        <span class="sse-inner-105">菱形</span>
      </div>
      <div class="sse-shape-105 sse-hexagon-105" data-label="六边">
        <span class="sse-inner-105">六边</span>
      </div>
      <div class="sse-shape-105 sse-star-105" data-label="星星">
        <span class="sse-inner-105">星星</span>
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
    gsap.fromTo('.sse-title-105, .sse-desc-105',
      { y: 100, opacity: 0, scale: 0.7 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.sse-header-105',
          start: 'top 90%'
        }
      }
    )

    gsap.utils.toArray('.sse-shape-105').forEach((el, index) => {
      gsap.fromTo(el as HTMLElement,
        {
          scale: 0,
          opacity: 0,
          rotation: index % 2 === 0 ? -360 : 360,
          y: 150
        },
        {
          scale: 1,
          opacity: 1,
          rotation: 0,
          y: 0,
          duration: 1,
          ease: 'elastic.out(1, 0.5)',
          stagger: 0.1,
          scrollTrigger: {
            trigger: '.sse-shapes-105',
            start: 'top 85%'
          }
        }
      )
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped>
.sse-section-105 {
  padding: 100px 20px;
  background: rgba(0, 0, 0, 0.2);
}

.sse-header-105 {
  text-align: center;
  margin-bottom: 60px;
}

.sse-title-105 {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.sse-desc-105 {
  font-size: 1.2rem;
  color: #a0aec0;
  font-weight: 300;
}

.sse-shapes-105 {
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
  max-width: 1000px;
  margin: 0 auto;
}

.sse-shape-105 {
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transition: transform 0.3s ease;
  position: relative;
}

.sse-shape-105:hover {
  transform: scale(1.1);
}

.sse-inner-105 {
  color: white;
  z-index: 1;
}

.sse-circle-105 {
  border-radius: 50%;
}

.sse-square-105 {
  border-radius: 12px;
}

.sse-triangle-105 {
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
}

.sse-diamond-105 {
  transform: rotate(45deg);
}

.sse-diamond-105 .sse-inner-105 {
  transform: rotate(-45deg);
}

.sse-hexagon-105 {
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
}

.sse-star-105 {
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
}

@media (max-width: 768px) {
  .sse-shapes-105 {
    gap: 20px;
  }

  .sse-shape-105 {
    width: 80px;
    height: 80px;
    font-size: 0.9rem;
  }
}
</style>
