<template>
  <div class="liquid-metal-container-199">
    <div class="lm-header-199">
      <h2 class="lm-title-199">液态金属</h2>
      <p class="lm-hint-199">滚动触发液态流动效果</p>
    </div>

    <div class="lm-stage-199">
      <div v-for="(item, index) in items" :key="index" class="lm-item-wrapper-199">
        <div class="lm-metal-199" :class="`lm-metal-${index}-199`">
          <div class="lm-droplets-199" :class="`lm-droplets-${index}-199`"></div>
          <div class="lm-surface-199" :class="`lm-surface-${index}-199`">
            <div class="lm-content-199">
              <div class="lm-icon-199">{{ item.icon }}</div>
              <h3 class="lm-item-title-199">{{ item.title }}</h3>
              <p class="lm-item-desc-199">{{ item.desc }}</p>
            </div>
          </div>
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

const items = [
  { icon: '🌊', title: '流动', desc: '无限流动的形态' },
  { icon: '💧', title: '凝聚', desc: '完美的聚合' },
  { icon: '⚗️', title: '转化', desc: '形态的变化' },
  { icon: '🔄', title: '循环', desc: '永恒的流动' }
]

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 创建液滴
    const dropletContainers = gsap.utils.toArray('[class*="lm-droplets-199"]')
    dropletContainers.forEach((container: any) => {
      for (let i = 0; i < 15; i++) {
        const droplet = document.createElement('div')
        droplet.className = 'lm-droplet-199'
        droplet.style.cssText = `
          position: absolute;
          width: ${Math.random() * 8 + 4}px;
          height: ${Math.random() * 8 + 4}px;
          background: radial-gradient(circle at 30% 30%, #e8e8e8, #a0a0a0, #606060);
          border-radius: 50%;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          opacity: 0;
          box-shadow: 
            inset -2px -2px 4px rgba(0,0,0,0.5),
            inset 2px 2px 4px rgba(255,255,255,0.5),
            0 0 10px rgba(192, 192, 192, 0.3);
        `
        container.appendChild(droplet)
      }
    })

    // 等待DOM更新后添加液滴动画
    setTimeout(() => {
      gsap.utils.toArray('.lm-droplet-199').forEach((droplet: any, i) => {
      gsap.to(droplet, {
        scrollTrigger: {
          trigger: droplet.closest('.lm-item-wrapper-199'),
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 1
        },
        opacity: 0.8,
        y: -100 + Math.random() * 200,
        duration: 1
      })
    })
    }, 100)

    // 表面波浪效果
    gsap.utils.toArray('[class*="lm-surface-199"]').forEach((surface: any) => {
      gsap.to(surface, {
        scrollTrigger: {
          trigger: surface.closest('.lm-item-wrapper-199'),
          start: 'top 70%',
          end: 'bottom 30%',
          scrub: 1
        },
        borderRadius: '40%',
        rotation: Math.random() * 20 - 10,
        duration: 1
      })
    })

    // 液态金属入场
    gsap.from('.lm-metal-199', {
      scrollTrigger: {
        trigger: '.lm-stage-199',
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1
      },
      y: 150,
      opacity: 0,
      scale: 0.6,
      stagger: 0.2
    })

    // 滚动时形态变化
    gsap.to('.lm-metal-199', {
      scrollTrigger: {
        trigger: '.lm-stage-199',
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1
      },
      skewY: 5,
      ease: 'none'
    })

    // 悬停效果
    gsap.utils.toArray('.lm-metal-199').forEach((metal: any) => {
      metal.addEventListener('mouseenter', () => {
        gsap.to(metal, {
          scale: 1.05,
          rotation: Math.random() * 10 - 5,
          duration: 0.5,
          ease: 'back.out(1.7)'
        })
      })

      metal.addEventListener('mouseleave', () => {
        gsap.to(metal, {
          scale: 1,
          rotation: 0,
          duration: 0.3
        })
      })
    })

    // 标题动画
    gsap.from('.lm-title-199', {
      scrollTrigger: {
        trigger: '.lm-header-199',
        start: 'top 80%'
      },
      y: 50,
      opacity: 0,
      duration: 1
    })
  })
})

onUnmounted(() => {
  ctx.revert()
})
</script>

<style scoped>
/* GSAP opacity fix: ensure content is always visible */

.liquid-metal-container-199 {
  min-height: 100vh;
  background: linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%);
  padding: 60px 20px;
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.lm-header-199 {
  text-align: center;
  margin-bottom: 60px;

  opacity: 1 !important;}

.lm-title-199 {
  font-size: 48px;
  font-weight: 700;
  background: linear-gradient(135deg, #c0c0c0, #e8e8e8, #ffffff, #c0c0c0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 40px rgba(192, 192, 192, 0.3);
  margin-bottom: 10px;

  opacity: 1 !important;}

.lm-hint-199 {
  font-size: 18px;
  color: #a0a0a0;

  opacity: 1 !important;}

.lm-stage-199 {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  padding: 20px;

  opacity: 1 !important;}

.lm-item-wrapper-199 {
  height: 420px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  opacity: 1 !important;}

.lm-metal-199 {
  position: relative;
  width: 280px;
  height: 380px;
  transition: transform 0.5s ease, box-shadow 0.5s ease;
  transform-style: preserve-3d;

  opacity: 1 !important;}

.lm-droplets-199 {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
  overflow: hidden;
  border-radius: 30px;
}

.lm-surface-199 {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #e8e8e8, #a0a0a0, #606060, #a0a0a0, #e8e8e8);
  background-size: 200% 200%;
  border-radius: 30px;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.5),
    inset 0 2px 10px rgba(255, 255, 255, 0.5),
    inset 0 -2px 10px rgba(0, 0, 0, 0.3);
  transition: all 0.5s ease;
  animation: metal-flow-199 8s ease-in-out infinite;

  opacity: 1 !important;}

@keyframes metal-flow-199 {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.lm-surface-199::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    45deg,
    transparent 40%,
    rgba(255, 255, 255, 0.4) 50%,
    transparent 60%
  );
  animation: metal-shine-199 4s infinite;
}

@keyframes metal-shine-199 {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.lm-content-199 {
  position: relative;
  z-index: 1;
  padding: 40px 30px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  transform: translateZ(20px);

  opacity: 1 !important;}

.lm-icon-199 {
  font-size: 64px;
  margin-bottom: 20px;
  filter: drop-shadow(0 0 15px rgba(192, 192, 192, 0.8));

  opacity: 1 !important;}

.lm-item-title-199 {
  font-size: 26px;
  font-weight: 600;
  color: #404040;
  margin-bottom: 10px;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);

  opacity: 1 !important;}

.lm-item-desc-199 {
  font-size: 14px;
  color: #606060;
  line-height: 1.6;

  opacity: 1 !important;}

@media (max-width: 1024px) {
  .lm-stage-199 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .lm-stage-199 {
    grid-template-columns: 1fr;
  }

  .lm-metal-199 {
    width: 240px;
    height: 340px;
  
  opacity: 1 !important;}
}
</style>
