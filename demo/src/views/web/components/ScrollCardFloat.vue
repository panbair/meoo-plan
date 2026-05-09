<template>
  <section class="scf-scroll-card-float-120">
    <div class="scf-container-120">
      <h2 class="scf-section-title-120">滚动卡片浮动</h2>
      <p class="scf-section-subtitle-120">Scroll Card Float Animation</p>

      <div class="scf-cards-grid-120">
        <div
          v-for="(card, index) in cards"
          :key="index"
          class="scf-card-120"
          :ref="el => { if (el) cardsRefs[index] = el as HTMLElement }"
        >
          <div class="scf-card-content-120">
            <div class="scf-card-icon-120">{{ card.icon }}</div>
            <h3 class="scf-card-title-120">{{ card.title }}</h3>
            <p class="scf-card-desc-120">{{ card.desc }}</p>
            <div class="scf-card-progress-120">
              <div class="scf-progress-bar-120" :ref="el => { if (el) progressBars[index] = el as HTMLElement }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 背景粒子 -->
      <div class="scf-particles-120">
        <div class="scf-particle-120" v-for="i in 20" :key="i" :style="getParticleStyle(i)"></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const cardsRefs = ref<HTMLElement[]>([])
const progressBars = ref<HTMLElement[]>([])

const cards = [
  { icon: '🚀', title: '极速响应', desc: '毫秒级加载，极致优化', color: '#a78bfa' },
  { icon: '⚡', title: '强大性能', desc: '流畅动画，丝滑体验', color: '#60a5fa' },
  { icon: '🎨', title: '精美设计', desc: '视觉盛宴，艺术呈现', color: '#f472b6' },
  { icon: '🔒', title: '安全可靠', desc: '多层防护，值得信赖', color: '#34d399' }
]

const getParticleStyle = (index: number) => {
  const angle = (index / 20) * Math.PI * 2
  const radius = 300 + Math.random() * 200
  return {
    left: `calc(50% + ${Math.cos(angle) * radius}px)`,
    top: `calc(50% + ${Math.sin(angle) * radius}px)`,
    animationDelay: `${index * 0.2}s`,
    animationDuration: `${3 + Math.random() * 2}s`
  }
}

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 标题动画
    gsap.from('.scf-section-title-120', {
      scrollTrigger: {
        trigger: '.scf-scroll-card-float-120',
        start: 'top 85%'
      },
      y: 60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    })

    gsap.from('.scf-section-subtitle-120', {
      scrollTrigger: {
        trigger: '.scf-scroll-card-float-120',
        start: 'top 80%'
      },
      y: 40,
      opacity: 0,
      duration: 1,
      delay: 0.2,
      ease: 'power3.out'
    })

    // 卡片浮动动画
    cardsRefs.value.forEach((card, index) => {
      const icon = card.querySelector('.scf-card-icon-120') as HTMLElement

      // 卡片入场 - 从不同方向浮动进来
      const directions = [
        { x: -200, y: 150 },
        { x: 200, y: 150 },
        { x: -200, y: -150 },
        { x: 200, y: -150 }
      ]

      const dir = directions[index % directions.length]

      gsap.set(card, { x: dir.x, y: dir.y, opacity: 0, rotation: -20 })
      gsap.set(icon, { rotation: 0, scale: 0 })
      gsap.set(progressBars.value[index], { width: '0%' })

      // 卡片入场动画
      gsap.to(card, {
        x: 0,
        y: 0,
        opacity: 1,
        rotation: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          toggleActions: 'play none none reverse'
        }
      })

      // 图标旋转动画
      gsap.to(icon, {
        rotation: 360,
        scale: 1,
        duration: 1.5,
        ease: 'back.out(1.7)',
        delay: 0.3,
        scrollTrigger: {
          trigger: card,
          start: 'top 85%'
        }
      })

      // 进度条动画
      gsap.to(progressBars.value[index], {
        width: '100%',
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 75%'
        }
      })

      // 滚动时的浮动效果
      gsap.to(card, {
        y: -30,
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 1
        },
        ease: 'power1.inOut'
      })

      // 悬停效果
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -20,
          scale: 1.05,
          boxShadow: `0 40px 80px rgba(167, 139, 250, 0.4)`,
          duration: 0.5,
          ease: 'power2.out'
        })
        gsap.to(icon, {
          rotation: '+=360',
          scale: 1.3,
          duration: 0.6,
          ease: 'back.out(1.7)'
        })
      })

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)',
          duration: 0.5,
          ease: 'power2.out'
        })
        gsap.to(icon, {
          scale: 1,
          duration: 0.4,
          ease: 'power2.out'
        })
      })
    })

    // 粒子浮动动画
    gsap.from('.scf-particle-120', {
      opacity: 0,
      scale: 0,
      duration: 2,
      ease: 'power2.out',
      stagger: 0.1,
      scrollTrigger: {
        trigger: '.scf-cards-grid-120',
        start: 'top 80%'
      }
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.scf-scroll-card-float-120 {
  min-height: 100vh;
  padding: 100px 0;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 50%, #0f0f2a 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(circle at 50% 50%, rgba(167, 139, 250, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 20% 80%, rgba(96, 165, 250, 0.05) 0%, transparent 50%);
    pointer-events: none;
  
  opacity: 1 !important;}
}

.scf-container-120 {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.scf-section-title-120 {
  text-align: center;
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 800;
  color: #fff;
  margin-bottom: 120px;
  background: linear-gradient(135deg, #60a5fa, #a78bfa, #f472b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 40px rgba(96, 165, 250, 0.5);

  &::after {
    content: '';
    display: block;
    width: 120px;
    height: 4px;
    background: linear-gradient(90deg, #60a5fa, #a78bfa, #f472b6);
    margin: 24px auto 0;
    border-radius: 2px;
  
  opacity: 1 !important;}
}

.scf-cards-grid-120 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  padding: 40px 0;

  opacity: 1 !important;}

.scf-card-120 {
  position: relative;
  padding: 50px 30px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 24px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  transform-style: preserve-3d;
  perspective: 1000px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #60a5fa, #a78bfa, #f472b6);
    opacity: 0.7;
  }
}

.scf-card-content-120 {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;

  opacity: 1 !important;}

.scf-card-icon-120 {
  font-size: 4rem;
  line-height: 1;
  transition: all 0.3s ease;

  opacity: 1 !important;}

.scf-card-title-120 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;

  opacity: 1 !important;}

.scf-card-desc-120 {
  font-size: 0.95rem;
  color: #94a3b8;
  line-height: 1.6;

  opacity: 1 !important;}

.scf-card-progress-120 {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  margin-top: 12px;
  overflow: hidden;

  opacity: 1 !important;}

.scf-progress-bar-120 {
  height: 100%;
  background: linear-gradient(90deg, #60a5fa, #a78bfa, #f472b6);
  border-radius: 2px;
  width: 0;

  opacity: 1 !important;}

.scf-particles-120 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.scf-particle-120 {
  position: absolute;
  width: 8px;
  height: 8px;
  background: rgba(167, 139, 250, 0.4);
  border-radius: 50%;
  animation: float-120 4s ease-in-out infinite;

  opacity: 1 !important;}

@keyframes float-120 {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.4;
  }
  50% {
    transform: translateY(-30px) scale(1.5);
    opacity: 0.8;
  }
}

@media (max-width: 1024px) {
  .scf-cards-grid-120 {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
}

@media (max-width: 640px) {
  .scf-cards-grid-120 {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .scf-card-120 {
    padding: 40px 24px;
  
  opacity: 1 !important;}

  .scf-section-title-120 {
    margin-bottom: 80px;
  }
}
</style>
