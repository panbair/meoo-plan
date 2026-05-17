<template>
  <div class="ice-crystal-container-204">
    <div class="ic-header-204">
      <h2 class="ic-title-204">冰晶雪花</h2>
      <p class="ic-hint-204">滚动触发冰晶雪花飘落效果</p>
    </div>

    <div class="ic-stage-204">
      <div v-for="(crystal, index) in crystals" :key="index" class="ic-crystal-wrapper-204">
        <div class="ic-crystal-204" :class="`ic-crystal-${index}-204`">
          <div class="ic-snowflakes-204" :class="`ic-snowflakes-${index}-204`"></div>
          <div class="ic-core-204">
            <div class="ic-icon-204">{{ crystal.icon }}</div>
            <h3 class="ic-crystal-title-204">{{ crystal.title }}</h3>
            <p class="ic-crystal-desc-204">{{ crystal.desc }}</p>
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

const crystals = [
  { icon: '❄️', title: '雪花', desc: '优雅的六角形' },
  { icon: '🌨️', title: '雪球', desc: '纯净的白雪' },
  { icon: '🌬️', title: '寒风', desc: '刺骨的寒意' },
  { icon: '🥶', title: '冰霜', desc: '凝结的晶莹' }
]

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 创建雪花
    const snowContainers = gsap.utils.toArray('[class*="ic-snowflakes-204"]')
    snowContainers.forEach((container: any) => {
      for (let i = 0; i < 30; i++) {
        const snowflake = document.createElement('div')
        snowflake.className = 'ic-snowflake-204'
        const size = Math.random() * 8 + 4
        snowflake.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          background: rgba(255, 255, 255, ${Math.random() * 0.6 + 0.2});
          border-radius: 50%;
          left: ${Math.random() * 100}%;
          top: -20px;
          box-shadow: 0 0 ${Math.random() * 10 + 5}px rgba(255, 255, 255, 0.8);
        `
        container.appendChild(snowflake)

        // 雪花下落动画
        gsap.to(snowflake, {
          y: 420,
          x: (Math.random() - 0.5) * 100,
          rotation: Math.random() * 360,
          duration: Math.random() * 5 + 3,
          repeat: -1,
          ease: 'none'
        })
      }
    })

    // 等待雪花创建后添加动画
    setTimeout(() => {
      // 雪花密度动画
      gsap.utils.toArray('.ic-snowflake-204').forEach((snowflake: any) => {
        gsap.to(snowflake, {
          scrollTrigger: {
            trigger: snowflake.closest('.ic-crystal-wrapper-204'),
            start: 'top 70%',
            end: 'bottom 30%',
            scrub: 1
          },
          opacity: 0.8
        })
      })

      // 核心发光效果
      gsap.utils.toArray('.ic-core-204').forEach((core: any) => {
        gsap.to(core, {
          scrollTrigger: {
            trigger: core.closest('.ic-crystal-wrapper-204'),
            start: 'top 70%',
            end: 'bottom 30%',
            scrub: 1
          },
          scale: 1.1,
          boxShadow: '0 0 40px rgba(255, 255, 255, 0.5)'
        })
      })
    }, 150)

    // 冰晶入场动画
    gsap.from('.ic-crystal-204', {
      scrollTrigger: {
        trigger: '.ic-stage-204',
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1
      },
      y: 100,
      scale: 0.8,
      stagger: 0.2
    })

    // 标题动画
    gsap.from('.ic-title-204', {
      scrollTrigger: {
        trigger: '.ic-header-204',
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

.ice-crystal-container-204 {
  min-height: 100vh;
  background: linear-gradient(180deg, #0a0a15 0%, #0a1520 100%);
  padding: 60px 20px;
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.ic-header-204 {
  text-align: center;
  margin-bottom: 60px;

  opacity: 1 !important;}

.ic-title-204 {
  font-size: 48px;
  font-weight: 700;
  background: linear-gradient(135deg, #ffffff, #a0c4ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 40px rgba(255, 255, 255, 0.5);
  margin-bottom: 10px;

  opacity: 1 !important;}

.ic-hint-204 {
  font-size: 18px;
  color: #a0c4ff;

  opacity: 1 !important;}

.ic-stage-204 {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  padding: 20px;

  opacity: 1 !important;}

.ic-crystal-wrapper-204 {
  height: 400px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  opacity: 1 !important;}

.ic-crystal-204 {
  position: relative;
  width: 300px;
  height: 400px;
  border-radius: 20px;
  background: rgba(30, 40, 50, 0.8);
  border: 2px solid rgba(160, 196, 255, 0.3);
  overflow: hidden;
  transition: all 0.5s ease;

  opacity: 1 !important;}

.ic-crystal-204:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(160, 196, 255, 0.3);
}

.ic-snowflakes-204 {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.ic-core-204 {
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

.ic-icon-204 {
  font-size: 72px;
  margin-bottom: 20px;
  filter: drop-shadow(0 0 20px rgba(160, 196, 255, 0.8));

  opacity: 1 !important;}

.ic-crystal-title-204 {
  font-size: 28px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 10px;
  text-shadow: 0 0 20px rgba(160, 196, 255, 0.5);

  opacity: 1 !important;}

.ic-crystal-desc-204 {
  font-size: 14px;
  color: #a0c4ff;
  line-height: 1.6;

  opacity: 1 !important;}

@media (max-width: 1024px) {
  .ic-stage-204 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .ic-stage-204 {
    grid-template-columns: 1fr;
  }

  .ic-title-204 {
    font-size: 32px;
  
  opacity: 1 !important;}
}
</style>
