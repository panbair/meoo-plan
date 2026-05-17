<template>
  <div class="sfp-section-109">
    <div class="sfp-header-109">
      <h2 class="sfp-title-109">流光分割效果</h2>
      <p class="sfp-desc-109">优雅的线条分割揭示动画</p>
    </div>
    <div class="sfp-container-109">
      <div class="sfp-card-109" v-for="(item, index) in cardItems" :key="index">
        <div class="sfp-image-109">
          <img :src="item.src" :alt="item.title" class="sfp-img-109">
          <div class="sfp-line-1-109"></div>
          <div class="sfp-line-2-109"></div>
        </div>
        <div class="sfp-content-109">
          <h3 class="sfp-card-title-109">{{ item.title }}</h3>
          <p class="sfp-card-desc-109">{{ item.desc }}</p>
        </div>
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

const cardItems = [
  { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', title: '山川之美', desc: '探索壮丽山河' },
  { src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop', title: '云海奇观', desc: '云端之上的美景' },
  { src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop', title: '森林秘境', desc: '深入原始森林' }
]

let ctx: gsap.Context | null = null

onMounted(() => {
  ctx = gsap.context(() => {
    gsap.fromTo('.sfp-title-109, .sfp-desc-109',
      { y: 100, opacity: 0, scale: 0.7 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.sfp-header-109',
          start: 'top 90%'
        }
      }
    )

    gsap.fromTo('.sfp-card-109',
      {
        y: 300,
        opacity: 0,
        scale: 0.7
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.sfp-container-109',
          start: 'top 85%'
        }
      }
    )

    gsap.fromTo('.sfp-line-1-109',
      { scaleY: 0 },
      {
        scaleY: 1,
        duration: 0.8,
        ease: 'power4.inOut',
        stagger: 0.15,
        scrollTrigger: {
          trigger: '.sfp-container-109',
          start: 'top 85%'
        }
      }
    )

    gsap.fromTo('.sfp-line-2-109',
      { scaleY: 0 },
      {
        scaleY: 1,
        duration: 0.8,
        ease: 'power4.inOut',
        stagger: 0.15,
        delay: 0.3,
        scrollTrigger: {
          trigger: '.sfp-container-109',
          start: 'top 85%'
        }
      }
    )

    gsap.fromTo('.sfp-img-109',
      { scale: 1.3, filter: 'blur(10px)' },
      {
        scale: 1,
        filter: 'blur(0px)',
        duration: 1.2,
        ease: 'power2.out',
        stagger: 0.15,
        delay: 0.5,
        scrollTrigger: {
          trigger: '.sfp-container-109',
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
.sfp-section-109 {
  padding: 100px 20px;
  background: rgba(0, 0, 0, 0.15);
}

.sfp-header-109 {
  text-align: center;
  margin-bottom: 60px;
}

.sfp-title-109 {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.sfp-desc-109 {
  font-size: 1.2rem;
  color: #a0aec0;
  font-weight: 300;
}

.sfp-container-109 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 40px;
  max-width: 1400px;
  margin: 0 auto;
}

.sfp-card-109 {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.sfp-card-109:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.sfp-image-109 {
  position: relative;
  aspect-ratio: 4/3;
  overflow: hidden;
}

.sfp-img-109 {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sfp-line-1-109,
.sfp-line-2-109 {
  position: absolute;
  width: 2px;
  height: 100%;
  background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.8), transparent);
  transform-origin: center;
}

.sfp-line-1-109 {
  left: 30%;
}

.sfp-line-2-109 {
  right: 30%;
}

.sfp-content-109 {
  padding: 24px;
}

.sfp-card-title-109 {
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #f093fb;
}

.sfp-card-desc-109 {
  font-size: 1rem;
  color: #a0aec0;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .sfp-container-109 {
    grid-template-columns: 1fr;
  }

  .sfp-line-1-109 {
    left: 25%;
  }

  .sfp-line-2-109 {
    right: 25%;
  }
}
</style>
