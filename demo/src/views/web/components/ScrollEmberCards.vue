<template>
  <div class="ember-cards-container-194">
    <div class="ec-header-194">
      <h2 class="ec-title-194">余烬卡片</h2>
      <p class="ec-hint-194">向下滚动触发余烬飘散效果</p>
    </div>

    <div class="ec-card-stage-194">
      <div v-for="(card, index) in cards" :key="index" class="ec-card-194">
        <div class="ec-ember-particles-194" :class="`ec-particles-${index}-194`"></div>
        <div class="ec-glow-194" :class="`ec-glow-${index}-194`"></div>
        <div class="ec-content-194">
          <div class="ec-icon-194">{{ card.icon }}</div>
          <h3 class="ec-card-title-194">{{ card.title }}</h3>
          <p class="ec-card-desc-194">{{ card.desc }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const cards = [
  { icon: '🔥', title: '烈焰', desc: '火焰中的能量' },
  { icon: '⚡', title: '闪电', desc: '瞬间的爆发' },
  { icon: '☀️', title: '阳光', desc: '温暖的光芒' },
  { icon: '🌟', title: '星光', desc: '遥远的希望' }
]

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    const cards = gsap.utils.toArray('.ec-card-194')
    const particles = gsap.utils.toArray('[class*="ec-particles-194"]')
    const glows = gsap.utils.toArray('[class*="ec-glow-194"]')

    // 每个卡片创建余烬粒子
    particles.forEach((particle: any) => {
      for (let i = 0; i < 20; i++) {
        const ember = document.createElement('div')
        ember.className = 'ec-ember-194'
        ember.style.cssText = `
          position: absolute;
          width: ${Math.random() * 4 + 2}px;
          height: ${Math.random() * 4 + 2}px;
          background: radial-gradient(circle, ${getEmberColor(i)}, transparent);
          border-radius: 50%;
          opacity: 0;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          box-shadow: 0 0 ${Math.random() * 10 + 5}px ${getEmberColor(i)};
        `
        particle.appendChild(ember)
      }
    })

    // 等待DOM更新后添加余烬动画
    setTimeout(() => {
      const embers = gsap.utils.toArray('.ec-ember-194')

      // 余烬飘散动画
      embers.forEach((ember: any) => {
        gsap.to(ember, {
          opacity: Math.random() * 0.8 + 0.2,
          duration: Math.random() * 2 + 1,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut'
        })
      })

      // 滚动时余烬上升 - 使用数组而非选择器
      if (embers.length > 0) {
        gsap.to(embers, {
          scrollTrigger: {
            trigger: '.ec-card-stage-194',
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 2
          },
          y: -200,
          ease: 'none'
        })
      }
    }, 150)

    // 卡片入场动画
    gsap.from(cards, {
      scrollTrigger: {
        trigger: '.ec-card-stage-194',
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1
      },
      y: 100,
      opacity: 0,
      scale: 0.9,
      stagger: 0.2
    })

    // 发光效果
    glows.forEach((glow: any) => {
      gsap.to(glow, {
        scrollTrigger: {
          trigger: glow,
          start: 'top 90%',
          end: 'bottom 10%',
          scrub: 1
        },
        opacity: 0.6,
        scale: 1.2
      })
    })
  })
})

function getEmberColor(index: number): string {
  const colors = ['#ff4500', '#ff6347', '#ffa500', '#ffb347', '#ff6b6b']
  return colors[index % colors.length]
}

onUnmounted(() => {
  ctx.revert()
})
</script>

<style scoped>
/* GSAP opacity fix: ensure content is always visible */

.ember-cards-container-194 {
  min-height: 100vh;
  background: linear-gradient(180deg, #0a0a0a 0%, #1a0a0a 100%);
  padding: 60px 20px;
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.ec-header-194 {
  text-align: center;
  margin-bottom: 60px;
  position: relative;
  z-index: 2;

  opacity: 1 !important;}

.ec-title-194 {
  font-size: 48px;
  font-weight: 700;
  color: #ff6b6b;
  text-shadow: 0 0 30px rgba(255, 107, 107, 0.5);
  margin-bottom: 10px;

  opacity: 1 !important;}

.ec-hint-194 {
  font-size: 18px;
  color: #ffb347;

  opacity: 1 !important;}

.ec-card-stage-194 {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  padding: 20px;
  position: relative;
  z-index: 2;

  opacity: 1 !important;}

.ec-card-194 {
  position: relative;
  height: 400px;
  background: rgba(20, 10, 10, 0.8);
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: 20px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  transition: transform 0.5s ease, box-shadow 0.5s ease;

  opacity: 1 !important;}

.ec-card-194:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 20px 40px rgba(255, 107, 107, 0.3);
}

.ec-ember-particles-194 {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.ec-glow-194 {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(255, 107, 107, 0.4), transparent 70%);
  opacity: 0;
  transition: opacity 0.5s ease;
  z-index: 0;
}

.ec-content-194 {
  position: relative;
  z-index: 2;
  padding: 40px 30px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;

  opacity: 1 !important;}

.ec-icon-194 {
  font-size: 64px;
  margin-bottom: 20px;
  filter: drop-shadow(0 0 20px rgba(255, 107, 107, 0.8));

  opacity: 1 !important;}

.ec-card-title-194 {
  font-size: 28px;
  font-weight: 600;
  color: #ffb347;
  margin-bottom: 10px;

  opacity: 1 !important;}

.ec-card-desc-194 {
  font-size: 16px;
  color: #ff8c8c;
  line-height: 1.6;

  opacity: 1 !important;}

@media (max-width: 1024px) {
  .ec-card-stage-194 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .ec-card-stage-194 {
    grid-template-columns: 1fr;
  }

  .ec-title-194 {
    font-size: 32px;
  
  opacity: 1 !important;}
}
</style>
