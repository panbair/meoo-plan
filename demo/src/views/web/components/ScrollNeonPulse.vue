<template>
  <div class="snp-section-115">
    <div class="snp-header-115">
      <h2 class="snp-title-115">霓虹脉冲效果</h2>
      <p class="snp-desc-115">赛博朋克风格的脉冲动画</p>
    </div>
    <div class="snp-container-115">
      <div class="snp-card-115" v-for="(item, index) in cards" :key="index">
        <div class="snp-border-115"></div>
        <div class="snp-glow-115"></div>
        <div class="snp-inner-115">
          <div class="snp-icon-115">{{ item.icon }}</div>
          <h3 class="snp-card-title-115">{{ item.title }}</h3>
          <p class="snp-card-desc-115">{{ item.desc }}</p>
          <div class="snp-lines-115">
            <div class="snp-line-115" v-for="n in 4" :key="n"></div>
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

const cards = [
  { icon: '⚡', title: '能量核心', desc: '高速响应' },
  { icon: '🎯', title: '精准瞄准', desc: '即时反馈' },
  { icon: '🌟', title: '星际链接', desc: '无缝集成' },
  { icon: '💎', title: '钻石品质', desc: '卓越性能' }
]

let ctx: gsap.Context | null = null

onMounted(() => {
  ctx = gsap.context(() => {
    gsap.fromTo('.snp-title-115, .snp-desc-115',
      { y: 120, opacity: 0, scale: 0.7 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.snp-header-115',
          start: 'top 90%'
        }
      }
    )

    gsap.fromTo('.snp-card-115',
      {
        y: 250,
        opacity: 0,
        scale: 0.5,
        rotationX: 90
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        rotationX: 0,
        duration: 1.3,
        ease: 'back.out(2)',
        stagger: 0.15,
        scrollTrigger: {
          trigger: '.snp-container-115',
          start: 'top 85%'
        }
      }
    )

    document.querySelectorAll('.snp-card-115').forEach((card, index) => {
      const border = card.querySelector('.snp-border-115')
      const glow = card.querySelector('.snp-glow-115')
      const lines = card.querySelectorAll('.snp-line-115')

      gsap.fromTo(border,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%'
          }
        }
      )

      gsap.fromTo(glow,
        { scale: 0.5, opacity: 0 },
        {
          scale: 1.5,
          opacity: 0.6,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%'
          }
        }
      )

      const colors = ['#ff00ff', '#00ffff', '#ff6600', '#00ff00']
      const color = colors[index % colors.length]

      gsap.to(glow, {
        opacity: 0.3,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })

      gsap.fromTo(lines,
        { width: '0%', opacity: 0 },
        {
          width: '100%',
          opacity: 1,
          duration: 0.8,
          ease: 'power4.out',
          stagger: 0.1,
          delay: 0.3,
          scrollTrigger: {
            trigger: card,
            start: 'top 85%'
          }
        }
      )

      gsap.fromTo(card.querySelector('.snp-icon-115'),
        { scale: 0, rotation: -180 },
        {
          scale: 1,
          rotation: 0,
          duration: 0.8,
          ease: 'back.out(2)',
          delay: 0.5,
          scrollTrigger: {
            trigger: card,
            start: 'top 85%'
          }
        }
      )

      gsap.to(card.querySelector('.snp-icon-115'), {
        textShadow: `0 0 20px ${color}, 0 0 40px ${color}`,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped>
.snp-section-115 {
  padding: 100px 20px;
  background: rgba(0, 0, 0, 0.3);
  perspective: 1500px;
}

.snp-header-115 {
  text-align: center;
  margin-bottom: 60px;
}

.snp-title-115 {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #ff00ff 0%, #00ffff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 30px rgba(255, 0, 255, 0.5);
}

.snp-desc-115 {
  font-size: 1.2rem;
  color: #a0aec0;
  font-weight: 300;
}

.snp-container-115 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.snp-card-115 {
  position: relative;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 20px;
  padding: 40px;
  perspective: 1000px;
  overflow: hidden;
}

.snp-border-115 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 2px solid;
  border-image: linear-gradient(135deg, #ff00ff, #00ffff, #ff6600) 1;
  border-radius: 20px;
  pointer-events: none;
}

.snp-glow-115 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 80%;
  background: radial-gradient(circle, rgba(255, 0, 255, 0.3) 0%, transparent 70%);
  filter: blur(20px);
  pointer-events: none;
}

.snp-inner-115 {
  position: relative;
  z-index: 2;
  text-align: center;
}

.snp-icon-115 {
  font-size: 4rem;
  margin-bottom: 20px;
  display: inline-block;
}

.snp-card-title-115 {
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 12px;
  color: #fff;
  text-shadow: 0 0 10px rgba(255, 0, 255, 0.8);
}

.snp-card-desc-115 {
  font-size: 1.1rem;
  color: #a0aec0;
  margin-bottom: 24px;
}

.snp-lines-115 {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
}

.snp-line-115 {
  height: 2px;
  background: linear-gradient(90deg, transparent, #00ffff, transparent);
  border-radius: 1px;
}

@media (max-width: 768px) {
  .snp-container-115 {
    grid-template-columns: 1fr;
    gap: 30px;
  }
}
</style>
