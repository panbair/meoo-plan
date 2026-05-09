<template>
  <div class="crystal-shatter-container-196">
    <div class="cs-header-196">
      <h2 class="cs-title-196">水晶碎裂</h2>
      <p class="cs-hint-196">滚动触发水晶碎裂效果</p>
    </div>

    <div class="cs-stage-196">
      <div v-for="(crystal, index) in crystals" :key="index" class="cs-crystal-wrapper-196">
        <div class="cs-crystal-196" :class="`cs-crystal-${index}-196`">
          <div class="cs-shards-196" :class="`cs-shards-${index}-196`"></div>
          <div class="cs-crystal-face-196">
            <div class="cs-crystal-content-196">
              <div class="cs-crystal-icon-196">{{ crystal.icon }}</div>
              <h3 class="cs-crystal-title-196">{{ crystal.title }}</h3>
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

const crystals = [
  { icon: '💎', title: '钻石' },
  { icon: '🔮', title: '水晶球' },
  { icon: '✨', title: '星光' },
  { icon: '🌙', title: '月光' },
  { icon: '⭐', title: '彗星' },
  { icon: '💫', title: '银河' }
]

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 为每个水晶创建碎片
    const wrappers = gsap.utils.toArray('.cs-shards-196')
    wrappers.forEach((wrapper: any, wrapperIndex) => {
      for (let i = 0; i < 30; i++) {
        const shard = document.createElement('div')
        shard.className = 'cs-shard-196'
        const angle = (i / 30) * Math.PI * 2
        const distance = Math.random() * 50 + 50
        shard.style.cssText = `
          position: absolute;
          width: ${Math.random() * 15 + 5}px;
          height: ${Math.random() * 15 + 5}px;
          background: linear-gradient(135deg, rgba(255,255,255,0.8), rgba(200,200,255,0.6));
          clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
          transform: translate(-50%, -50%) rotate(${Math.random() * 360}deg);
          opacity: 0;
          box-shadow: 0 0 10px rgba(255,255,255,0.5);
        `
        gsap.set(shard, {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance
        })
        wrapper.appendChild(shard)
      }
    })

    // 水晶入场动画
    gsap.from('.cs-crystal-196', {
      scrollTrigger: {
        trigger: '.cs-stage-196',
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1
      },
      y: 100,
      opacity: 0,
      scale: 0.5,
      rotation: 180,
      stagger: 0.15
    })

    // 水晶悬停效果
    gsap.utils.toArray('.cs-crystal-196').forEach((crystal: any) => {
      crystal.addEventListener('mouseenter', () => {
        gsap.to(crystal, {
          scale: 1.1,
          duration: 0.5,
          ease: 'back.out(1.7)'
        })
      })

      crystal.addEventListener('mouseleave', () => {
        gsap.to(crystal, {
          scale: 1,
          duration: 0.3
        })
      })
    })

    // 碎片飞出动画
    const shards = gsap.utils.toArray('.cs-shard-196')
    shards.forEach((shard: any, i) => {
      const angle = (i / 30) * Math.PI * 2
      const distance = Math.random() * 100 + 100

      gsap.to(shard, {
        scrollTrigger: {
          trigger: shard.closest('.cs-crystal-wrapper-196'),
          start: 'center center',
          end: 'bottom top',
          scrub: 1
        },
        opacity: 1,
        x: `+=${Math.cos(angle) * distance}`,
        y: `+=${Math.sin(angle) * distance}`,
        rotation: Math.random() * 360 - 180,
        duration: 1
      })
    })

    // 标题动画
    gsap.from('.cs-title-196', {
      scrollTrigger: {
        trigger: '.cs-header-196',
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

.crystal-shatter-container-196 {
  min-height: 100vh;
  background: linear-gradient(180deg, #0a0a20 0%, #1a0a30 100%);
  padding: 60px 20px;
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.cs-header-196 {
  text-align: center;
  margin-bottom: 60px;

  opacity: 1 !important;}

.cs-title-196 {
  font-size: 48px;
  font-weight: 700;
  background: linear-gradient(135deg, #e0e0ff, #8080ff, #4040c0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 40px rgba(128, 128, 255, 0.5);
  margin-bottom: 10px;

  opacity: 1 !important;}

.cs-hint-196 {
  font-size: 18px;
  color: #b0b0ff;

  opacity: 1 !important;}

.cs-stage-196 {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 60px;
  padding: 40px 20px;

  opacity: 1 !important;}

.cs-crystal-wrapper-196 {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 350px;

  opacity: 1 !important;}

.cs-crystal-196 {
  position: relative;
  width: 200px;
  height: 280px;
  cursor: pointer;
  transform-style: preserve-3d;

  opacity: 1 !important;}

.cs-shards-196 {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
}

.cs-crystal-face-196 {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(200, 200, 255, 0.2), rgba(100, 100, 200, 0.4));
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  box-shadow: 
    0 0 40px rgba(128, 128, 255, 0.3),
    inset 0 0 40px rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;

  opacity: 1 !important;}

.cs-crystal-face-196::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(45deg, transparent 40%, rgba(255, 255, 255, 0.4) 50%, transparent 60%);
  animation: crystal-shine-196 3s infinite;
}

@keyframes crystal-shine-196 {
  0% { transform: translateX(-100%) rotate(45deg); }
  100% { transform: translateX(100%) rotate(45deg); }
}

.cs-crystal-content-196 {
  text-align: center;
  z-index: 1;

  opacity: 1 !important;}

.cs-crystal-icon-196 {
  font-size: 72px;
  margin-bottom: 20px;
  filter: drop-shadow(0 0 20px rgba(128, 128, 255, 0.8));

  opacity: 1 !important;}

.cs-crystal-title-196 {
  font-size: 28px;
  font-weight: 600;
  color: #e0e0ff;
  text-shadow: 0 0 20px rgba(128, 128, 255, 0.5);

  opacity: 1 !important;}

@media (max-width: 768px) {
  .cs-stage-196 {
    grid-template-columns: repeat(2, 1fr);
    gap: 40px;
  }
}

@media (max-width: 480px) {
  .cs-stage-196 {
    grid-template-columns: 1fr;
  }

  .cs-crystal-196 {
    width: 160px;
    height: 220px;
  
  opacity: 1 !important;}

  .cs-crystal-icon-196 {
    font-size: 56px;
  
  opacity: 1 !important;}

  .cs-crystal-title-196 {
    font-size: 22px;
  
  opacity: 1 !important;}
}
</style>
