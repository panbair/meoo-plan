<template>
  <div class="spc-section-111">
    <div class="spc-header-111">
      <h2 class="spc-title-111">像素翻转效果</h2>
      <p class="spc-desc-111">数字时代的方块动画</p>
    </div>
    <div class="spc-grid-111">
      <div class="spc-card-111" v-for="(card, index) in cards" :key="index">
        <div class="spc-pixel-grid-111">
          <div class="spc-pixel-111" v-for="n in 16" :key="n" :data-index="n"></div>
        </div>
        <div class="spc-content-111">
          <h3 class="spc-card-title-111">{{ card.title }}</h3>
          <p class="spc-card-text-111">{{ card.text }}</p>
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

const cards = [
  { title: '数字革命', text: '像素化设计' },
  { title: '现代科技', text: '方块美学' },
  { title: '创意无限', text: '翻转动画' }
]

let ctx: gsap.Context | null = null

onMounted(() => {
  ctx = gsap.context(() => {
    gsap.fromTo('.spc-title-111, .spc-desc-111',
      { y: 100, opacity: 0, scale: 0.7 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.spc-header-111',
          start: 'top 90%'
        }
      }
    )

    gsap.fromTo('.spc-card-111',
      {
        y: 200,
        opacity: 0,
        rotationY: 90
      },
      {
        y: 0,
        opacity: 1,
        rotationY: 0,
        duration: 1.2,
        ease: 'back.out(1.5)',
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.spc-grid-111',
          start: 'top 85%'
        }
      }
    )

    document.querySelectorAll('.spc-card-111').forEach((card) => {
      const pixels = card.querySelectorAll('.spc-pixel-111')
      gsap.fromTo(pixels,
        {
          rotationX: 90,
          opacity: 0,
          scale: 0
        },
        {
          rotationX: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: 'back.out(1.7)',
          stagger: {
            each: 0.05,
            from: 'center',
            grid: [4, 4]
          },
          scrollTrigger: {
            trigger: card,
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
.spc-section-111 {
  padding: 100px 20px;
  background: rgba(0, 0, 0, 0.2);
}

.spc-header-111 {
  text-align: center;
  margin-bottom: 60px;
}

.spc-title-111 {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.spc-desc-111 {
  font-size: 1.2rem;
  color: #a0aec0;
  font-weight: 300;
}

.spc-grid-111 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.spc-card-111 {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 30px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  perspective: 1000px;
}

.spc-card-111:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
}

.spc-pixel-grid-111 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  margin-bottom: 20px;
  aspect-ratio: 1;
}

.spc-pixel-111 {
  background: linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%);
  border-radius: 4px;
  transform-style: preserve-3d;
  transition: transform 0.3s ease, background 0.3s ease;
}

.spc-card-111:hover .spc-pixel-111 {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.spc-content-111 {
  text-align: center;
}

.spc-card-title-111 {
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #a78bfa;
}

.spc-card-text-111 {
  font-size: 1rem;
  color: #a0aec0;
}

@media (max-width: 768px) {
  .spc-pixel-grid-111 {
    gap: 4px;
  }

  .spc-pixel-111 {
    border-radius: 2px;
  }
}
</style>
