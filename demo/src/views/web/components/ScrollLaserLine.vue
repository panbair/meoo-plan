<template>
  <div class="sll-section-112">
    <div class="sll-header-112">
      <h2 class="sll-title-112">激光扫描效果</h2>
      <p class="sll-desc-112">未来感的扫描线动画</p>
    </div>
    <div class="sll-container-112">
      <div class="sll-item-112" v-for="(item, index) in items" :key="index">
        <div class="sll-card-112">
          <div class="sll-image-112">
            <img :src="item.src" :alt="item.title" class="sll-img-112">
            <div class="sll-scanner-112"></div>
          </div>
          <div class="sll-info-112">
            <h3 class="sll-title-text-112">{{ item.title }}</h3>
            <p class="sll-desc-text-112">{{ item.desc }}</p>
          </div>
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

const items = [
  { src: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=200&fit=crop', title: 'AI芯片', desc: '人工智能核心' },
  { src: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=300&h=200&fit=crop', title: '量子计算', desc: '下一代计算' },
  { src: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&h=200&fit=crop', title: '太空探索', desc: '星际航行技术' }
]

let ctx: gsap.Context | null = null

onMounted(() => {
  ctx = gsap.context(() => {
    gsap.fromTo('.sll-title-112, .sll-desc-112',
      { y: 100, opacity: 0, scale: 0.7 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.sll-header-112',
          start: 'top 90%'
        }
      }
    )

    gsap.fromTo('.sll-card-112',
      {
        y: 200,
        opacity: 0,
        scale: 0.8,
        skewX: -10
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        skewX: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: '.sll-container-112',
          start: 'top 85%'
        }
      }
    )

    gsap.fromTo('.sll-scanner-112',
      {
        y: '-100%',
        opacity: 0
      },
      {
        y: '100%',
        opacity: 1,
        duration: 2,
        ease: 'none',
        stagger: 0.3,
        scrollTrigger: {
          trigger: '.sll-container-112',
          start: 'top 85%'
        }
      }
    )

    gsap.fromTo('.sll-img-112',
      { filter: 'brightness(0) blur(5px)' },
      {
        filter: 'brightness(1) blur(0px)',
        duration: 1.5,
        ease: 'power2.out',
        stagger: 0.2,
        delay: 0.5,
        scrollTrigger: {
          trigger: '.sll-container-112',
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
.sll-section-112 {
  padding: 100px 20px;
  background: rgba(0, 0, 0, 0.25);
}

.sll-header-112 {
  text-align: center;
  margin-bottom: 60px;
}

.sll-title-112 {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #00d4ff 0%, #7b2ff7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.sll-desc-112 {
  font-size: 1.2rem;
  color: #a0aec0;
  font-weight: 300;
}

.sll-container-112 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.sll-item-112 {
  perspective: 1000px;
}

.sll-card-112 {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.sll-card-112:hover {
  transform: translateY(-10px) rotateX(5deg);
  box-shadow: 0 20px 40px rgba(0, 212, 255, 0.2);
}

.sll-image-112 {
  position: relative;
  aspect-ratio: 3/2;
  overflow: hidden;
}

.sll-img-112 {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sll-scanner-112 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, transparent, #00d4ff, transparent);
  box-shadow: 0 0 20px #00d4ff, 0 0 40px #00d4ff;
  z-index: 10;
}

.sll-info-112 {
  padding: 24px;
}

.sll-title-text-112 {
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #00d4ff;
}

.sll-desc-text-112 {
  font-size: 1rem;
  color: #a0aec0;
}
</style>
