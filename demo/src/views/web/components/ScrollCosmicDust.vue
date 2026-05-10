<template>
  <div class="cosmic-dust-container-207">
    <div class="cd-header-207">
      <h2 class="cd-title-207">宇宙尘埃</h2>
      <p class="cd-hint-207">滚动触发宇宙尘埃漂浮效果</p>
    </div>

    <div class="cd-stage-207">
      <div v-for="(dust, index) in dusts" :key="index" class="cd-dust-wrapper-207">
        <div class="cd-dust-207" :class="`cd-dust-${index}-207`">
          <div class="cd-particles-207" :class="`cd-particles-${index}-207`"></div>
          <div class="cd-core-207">
            <div class="cd-icon-207">{{ dust.icon }}</div>
            <h3 class="cd-dust-title-207">{{ dust.title }}</h3>
            <p class="cd-dust-desc-207">{{ dust.desc }}</p>
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

const dusts = [
  { icon: '☄️', title: '彗星', desc: '拖着长尾的使者' },
  { icon: '🪐', title: '行星', desc: '围绕恒星旋转' },
  { icon: '🌌', title: '星云', desc: '美丽的宇宙云雾' },
  { icon: '🔭', title: '星系', desc: '无尽的星际空间' }
]

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 创建尘埃粒子
    const particleContainers = gsap.utils.toArray('[class*="cd-particles-207"]')
    particleContainers.forEach((container: any, containerIndex: number) => {
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div')
        particle.className = 'cd-particle-207'
        const size = Math.random() * 3 + 1
        particle.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          background: rgba(255, 255, 255, ${Math.random() * 0.6 + 0.2});
          border-radius: 50%;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          box-shadow: 0 0 ${Math.random() * 5 + 2}px rgba(255, 255, 255, 0.8);
        `
        container.appendChild(particle)

        // 粒子漂浮动画
        gsap.to(particle, {
          x: (Math.random() - 0.5) * 50,
          y: (Math.random() - 0.5) * 50,
          duration: Math.random() * 3 + 2,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut'
        })
      }
    })

    // 等待粒子创建后添加动画
    setTimeout(() => {
      // 粒子密度动画
      gsap.utils.toArray('.cd-particle-207').forEach((particle: any) => {
        gsap.to(particle, {
          scrollTrigger: {
            trigger: particle.closest('.cd-dust-wrapper-207'),
            start: 'top 70%',
            end: 'bottom 30%',
            scrub: 1
          },
          opacity: 0.8
        })
      })

      // 核心发光效果
      gsap.utils.toArray('.cd-core-207').forEach((core: any) => {
        gsap.to(core, {
          scrollTrigger: {
            trigger: core.closest('.cd-dust-wrapper-207'),
            start: 'top 70%',
            end: 'bottom 30%',
            scrub: 1
          },
          scale: 1.1,
          boxShadow: '0 0 40px rgba(255, 255, 255, 0.5)'
        })
      })
    }, 150)

    // 尘埃入场动画
    gsap.from('.cd-dust-207', {
      scrollTrigger: {
        trigger: '.cd-stage-207',
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1
      },
      y: 100,
      scale: 0.8,
      stagger: 0.2
    })

    // 标题动画
    gsap.from('.cd-title-207', {
      scrollTrigger: {
        trigger: '.cd-header-207',
        start: 'top 80%'
      },
      y: 30,
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

.cosmic-dust-container-207 {
  min-height: 100vh;
  background: linear-gradient(180deg, #050505 0%, #0a0a15 100%);
  padding: 60px 20px;
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.cd-header-207 {
  text-align: center;
  margin-bottom: 60px;

  opacity: 1 !important;}

.cd-title-207 {
  font-size: 48px;
  font-weight: 700;
  background: linear-gradient(135deg, #ffffff, #8888ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 40px rgba(255, 255, 255, 0.5);
  margin-bottom: 10px;

  opacity: 1 !important;}

.cd-hint-207 {
  font-size: 18px;
  color: #aaaaff;

  opacity: 1 !important;}

.cd-stage-207 {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  padding: 20px;

  opacity: 1 !important;}

.cd-dust-wrapper-207 {
  height: 400px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  opacity: 1 !important;}

.cd-dust-207 {
  position: relative;
  width: 300px;
  height: 400px;
  border-radius: 20px;
  background: rgba(10, 10, 20, 0.8);
  border: 2px solid rgba(170, 170, 255, 0.3);
  overflow: hidden;
  transition: all 0.5s ease;

  opacity: 1 !important;}

.cd-dust-207:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(170, 170, 255, 0.3);
}

.cd-particles-207 {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.cd-core-207 {
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

.cd-icon-207 {
  font-size: 72px;
  margin-bottom: 20px;
  filter: drop-shadow(0 0 20px rgba(170, 170, 255, 0.8));

  opacity: 1 !important;}

.cd-dust-title-207 {
  font-size: 28px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 10px;
  text-shadow: 0 0 20px rgba(170, 170, 255, 0.5);

  opacity: 1 !important;}

.cd-dust-desc-207 {
  font-size: 14px;
  color: #aaaaff;
  line-height: 1.6;

  opacity: 1 !important;}

@media (max-width: 1024px) {
  .cd-stage-207 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .cd-stage-207 {
    grid-template-columns: 1fr;
  }

  .cd-title-207 {
    font-size: 32px;
  
  opacity: 1 !important;}
}
</style>
