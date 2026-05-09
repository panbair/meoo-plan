<template>
  <div class="slm-section-114">
    <div class="slm-header-114">
      <h2 class="slm-title-114">液体变形效果</h2>
      <p class="slm-desc-114">流动的有机形态动画</p>
    </div>
    <div class="slm-container-114">
      <div class="slm-blob-114" v-for="(item, index) in blobs" :key="index">
        <div class="slm-inner-114">
          <svg class="slm-svg-114" viewBox="0 0 200 200">
            <path class="slm-path-114" :d="item.path" :fill="item.fill"></path>
          </svg>
          <div class="slm-content-114">
            <div class="slm-emoji-114">{{ item.emoji }}</div>
            <h3 class="slm-text-114">{{ item.title }}</h3>
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

const blobs = [
  {
    path: 'M100,20 C150,20 180,50 180,100 C180,150 150,180 100,180 C50,180 20,150 20,100 C20,50 50,20 100,20',
    fill: 'url(#gradient1)',
    emoji: '💧',
    title: '流动'
  },
  {
    path: 'M100,20 C150,20 180,50 180,100 C180,150 150,180 100,180 C50,180 20,150 20,100 C20,50 50,20 100,20',
    fill: 'url(#gradient2)',
    emoji: '🌊',
    title: '波浪'
  },
  {
    path: 'M100,20 C150,20 180,50 180,100 C180,150 150,180 100,180 C50,180 20,150 20,100 C20,50 50,20 100,20',
    fill: 'url(#gradient3)',
    emoji: '🔮',
    title: '融合'
  },
  {
    path: 'M100,20 C150,20 180,50 180,100 C180,150 150,180 100,180 C50,180 20,150 20,100 C20,50 50,20 100,20',
    fill: 'url(#gradient4)',
    emoji: '✨',
    title: '变形'
  }
]

let ctx: gsap.Context | null = null

const morphPaths = [
  'M100,20 C150,20 180,50 180,100 C180,150 150,180 100,180 C50,180 20,150 20,100 C20,50 50,20 100,20',
  'M100,30 C140,30 170,60 170,100 C170,140 140,170 100,170 C60,170 30,140 30,100 C30,60 60,30 100,30',
  'M100,25 C145,25 175,55 175,100 C175,145 145,175 100,175 C55,175 25,145 25,100 C25,55 55,25 100,25',
  'M100,35 C135,35 165,65 165,100 C165,135 135,165 100,165 C65,165 35,135 35,100 C35,65 65,35 100,35'
]

onMounted(() => {
  ctx = gsap.context(() => {
    gsap.fromTo('.slm-title-114, .slm-desc-114',
      { y: 120, opacity: 0, scale: 0.7 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.slm-header-114',
          start: 'top 90%'
        }
      }
    )

    gsap.fromTo('.slm-blob-114',
      {
        y: 400,
        opacity: 0,
        scale: 0.2,
        rotation: Math.random() * 360
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 1.5,
        ease: 'elastic.out(1, 0.5)',
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.slm-container-114',
          start: 'top 85%'
        }
      }
    )

    document.querySelectorAll('.slm-path-114').forEach((path, index) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.slm-container-114',
          start: 'top 85%'
        }
      })

      morphPaths.forEach((d, i) => {
        tl.to(path, {
          attr: { d },
          duration: 0.8,
          ease: 'power2.inOut'
        }, i * 0.8)
      })

      gsap.fromTo(path,
        { opacity: 0 },
        {
          opacity: 0.9,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.slm-container-114',
            start: 'top 85%'
          }
        }
      )
    })

    gsap.fromTo('.slm-content-114',
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.2,
        delay: 1,
        scrollTrigger: {
          trigger: '.slm-container-114',
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
.slm-section-114 {
  padding: 100px 20px;
  background: rgba(0, 0, 0, 0.25);
}

.slm-header-114 {
  text-align: center;
  margin-bottom: 80px;
}

.slm-title-114 {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.slm-desc-114 {
  font-size: 1.2rem;
  color: #a0aec0;
  font-weight: 300;
}

.slm-container-114 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.slm-blob-114 {
  position: relative;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slm-inner-114 {
  position: relative;
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.3));
  transition: transform 0.3s ease;
}

.slm-inner-114:hover {
  transform: scale(1.05);
}

.slm-svg-114 {
  width: 100%;
  height: 100%;
}

.slm-path-114 {
  filter: blur(1px);
  mix-blend-mode: screen;
}

.slm-content-114 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 10;
}

.slm-emoji-114 {
  font-size: 3rem;
  margin-bottom: 8px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

.slm-text-114 {
  font-size: 1.4rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

@media (max-width: 768px) {
  .slm-container-114 {
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
  }
}
</style>
