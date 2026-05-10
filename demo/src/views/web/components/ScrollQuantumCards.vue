<template>
  <div class="quantum-cards-container-197">
    <div class="qc-header-197">
      <h2 class="qc-title-197">量子卡片</h2>
      <p class="qc-hint-197">滚动触发量子叠加态效果</p>
    </div>

    <div class="qc-stage-197">
      <div v-for="(card, index) in cards" :key="index" class="qc-card-wrapper-197">
        <div class="qc-card-197" :class="`qc-card-${index}-197`">
          <div class="qc-core-197" :class="`qc-core-${index}-197`"></div>
          <div class="qc-orbit-197" :class="`qc-orbit-${index}-197`">
            <div v-for="i in 8" :key="i" class="qc-electron-197" :class="`qc-electron-${index}-${i}-197`"></div>
          </div>
          <div class="qc-content-197">
            <div class="qc-icon-197">{{ card.icon }}</div>
            <h3 class="qc-card-title-197">{{ card.title }}</h3>
            <p class="qc-card-desc-197">{{ card.desc }}</p>
          </div>
          <div class="qc-ghost-197" :class="`qc-ghost-${index}-197`"></div>
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
  { icon: '⚛️', title: '量子叠加', desc: '同时存在的多重状态' },
  { icon: '🌀', title: '量子纠缠', desc: '超越距离的关联' },
  { icon: '💫', title: '量子隧穿', desc: '突破物理限制' },
  { icon: '🌌', title: '量子场', desc: '时空的波动' }
]

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 核心旋转动画
    gsap.utils.toArray('[class*="qc-core-197"]').forEach((core: any) => {
      gsap.to(core, {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: 'none'
      })
    })

    // 电子轨道动画
    gsap.utils.toArray('[class*="qc-orbit-197"]').forEach((orbit: any) => {
      gsap.to(orbit, {
        rotation: -360,
        duration: 30,
        repeat: -1,
        ease: 'none'
      })
    })

    // 电子动画
    gsap.utils.toArray('[class*="qc-electron-197"]').forEach((electron: any) => {
      gsap.to(electron, {
        rotation: 360,
        duration: 3,
        repeat: -1,
        ease: 'none'
      })
    })

    // 量子态叠加（鬼影效果）
    gsap.utils.toArray('[class*="qc-ghost-197"]').forEach((ghost: any, i) => {
      gsap.to(ghost, {
        scrollTrigger: {
          trigger: ghost.closest('.qc-card-wrapper-197'),
          start: 'top 70%',
          end: 'bottom 30%',
          scrub: 1
        },
        opacity: 0.6,
        x: i % 2 === 0 ? 30 : -30,
        duration: 1
      })
    })

    // 卡片入场动画
    gsap.from('.qc-card-197', {
      scrollTrigger: {
        trigger: '.qc-stage-197',
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1
      },
      y: 150,
      opacity: 0,
      scale: 0.8,
      stagger: 0.2
    })

    // 滚动时量子波动
    gsap.to('.qc-card-197', {
      scrollTrigger: {
        trigger: '.qc-stage-197',
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1
      },
      rotationY: 180,
      ease: 'none'
    })

    // 标题动画
    gsap.from('.qc-title-197', {
      scrollTrigger: {
        trigger: '.qc-header-197',
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

.quantum-cards-container-197 {
  min-height: 100vh;
  background: linear-gradient(180deg, #0a0a0a 0%, #1a0a2a 100%);
  padding: 60px 20px;
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.qc-header-197 {
  text-align: center;
  margin-bottom: 60px;

  opacity: 1 !important;}

.qc-title-197 {
  font-size: 48px;
  font-weight: 700;
  background: linear-gradient(135deg, #00f0ff, #a020ff, #ff00a0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 40px rgba(160, 32, 255, 0.5);
  margin-bottom: 10px;

  opacity: 1 !important;}

.qc-hint-197 {
  font-size: 18px;
  color: #80a0ff;

  opacity: 1 !important;}

.qc-stage-197 {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  padding: 20px;
  perspective: 2000px;

  opacity: 1 !important;}

.qc-card-wrapper-197 {
  height: 450px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  opacity: 1 !important;}

.qc-card-197 {
  position: relative;
  width: 280px;
  height: 400px;
  background: rgba(20, 10, 40, 0.8);
  border: 1px solid rgba(160, 32, 255, 0.3);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  overflow: visible;
  transform-style: preserve-3d;
  transition: box-shadow 0.5s ease;

  opacity: 1 !important;}

.qc-card-197:hover {
  box-shadow: 
    0 0 30px rgba(160, 32, 255, 0.5),
    0 0 60px rgba(0, 240, 255, 0.3);
}

.qc-core-197 {
  position: absolute;
  width: 80px;
  height: 80px;
  background: radial-gradient(circle, rgba(160, 32, 255, 0.8), rgba(0, 240, 255, 0.4), transparent);
  border-radius: 50%;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 0 0 30px rgba(160, 32, 255, 0.8);
  animation: core-pulse-197 2s infinite;

  opacity: 1 !important;}

@keyframes core-pulse-197 {
  0%, 100% { transform: translateX(-50%) scale(1); opacity: 0.8; }
  50% { transform: translateX(-50%) scale(1.2); opacity: 1; }
}

.qc-orbit-197 {
  position: absolute;
  width: 200px;
  height: 200px;
  border: 1px solid rgba(160, 32, 255, 0.2);
  border-radius: 50%;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);

  opacity: 1 !important;}

.qc-electron-197 {
  position: absolute;
  width: 12px;
  height: 12px;
  background: radial-gradient(circle, #00f0ff, rgba(0, 240, 255, 0.6));
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.8);
  top: 50%;
  left: 50%;

  opacity: 1 !important;}

.qc-electron-197:nth-child(1) { transform: rotate(0deg) translateX(100px); }
.qc-electron-197:nth-child(2) { transform: rotate(45deg) translateX(100px); }
.qc-electron-197:nth-child(3) { transform: rotate(90deg) translateX(100px); }
.qc-electron-197:nth-child(4) { transform: rotate(135deg) translateX(100px); }
.qc-electron-197:nth-child(5) { transform: rotate(180deg) translateX(100px); }
.qc-electron-197:nth-child(6) { transform: rotate(225deg) translateX(100px); }
.qc-electron-197:nth-child(7) { transform: rotate(270deg) translateX(100px); }
.qc-electron-197:nth-child(8) { transform: rotate(315deg) translateX(100px); }

.qc-content-197 {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 30px 20px;
  text-align: center;
  z-index: 2;

  opacity: 1 !important;}

.qc-icon-197 {
  font-size: 56px;
  margin-bottom: 15px;
  filter: drop-shadow(0 0 15px rgba(160, 32, 255, 0.8));

  opacity: 1 !important;}

.qc-card-title-197 {
  font-size: 24px;
  font-weight: 600;
  color: #a020ff;
  margin-bottom: 8px;

  opacity: 1 !important;}

.qc-card-desc-197 {
  font-size: 14px;
  color: #80a0ff;
  line-height: 1.5;

  opacity: 1 !important;}

.qc-ghost-197 {
  position: absolute;
  inset: 0;
  background: rgba(160, 32, 255, 0.1);
  border: 1px solid rgba(160, 32, 255, 0.3);
  border-radius: 20px;
  opacity: 0;
  pointer-events: none;
  z-index: 0;
}

@media (max-width: 1024px) {
  .qc-stage-197 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .qc-stage-197 {
    grid-template-columns: 1fr;
  }

  .qc-card-197 {
    width: 240px;
    height: 360px;
  
  opacity: 1 !important;}
}
</style>
