<template>
  <section class="cyberpunk-section-21">
    <div class="content-21">
      <h2 class="section-title-21">赛博朋克城市</h2>
      <p class="subtitle-21">霓虹灯闪烁的未来都市</p>

      <div class="city-container-21" ref="cityContainer">
        <div class="city-skyline-21">
          <div class="building-21" v-for="(building, index) in buildings" :key="index"
               :class="`building-${index + 1}`"
               :style="{ height: building.height, left: building.left }">
            <div class="building-windows-21">
              <div class="window-21" v-for="n in building.windows" :key="n"
                   :class="{ 'window-lit': Math.random() > 0.7 }"></div>
            </div>
            <div class="building-neon-21" :style="{ background: building.neonColor }"></div>
          </div>
        </div>

        <div class="city-rain-21">
          <div class="rain-drop-21" v-for="n in 100" :key="n"
               :style="getRainStyle(n)"></div>
        </div>

        <div class="city-ground-21">
          <div class="ground-neon-21"></div>
          <div class="ground-reflection-21"></div>
        </div>

        <div class="flying-car-21" v-for="n in 5" :key="n"
             :style="getCarStyle(n)">
          <div class="car-body-21"></div>
          <div class="car-lights-21"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const cityContainer = ref<HTMLElement | null>(null)

const buildings = Array.from({ length: 12 }, (_, i) => ({
  height: `${200 + Math.random() * 300}px`,
  left: `${i * 8 + Math.random() * 2}%`,
  windows: Math.floor(15 + Math.random() * 20),
  neonColor: ['#ff00ff', '#00ffff', '#ff0080', '#00ff80', '#ffff00'][Math.floor(Math.random() * 5)]
}))

const getRainStyle = (index: number) => {
  return {
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 2}s`,
    animationDuration: `${0.5 + Math.random() * 0.5}s`
  }
}

const getCarStyle = (index: number) => {
  const speed = 5 + index * 2
  return {
    animationDuration: `${speed}s`,
    animationDelay: `${Math.random() * speed}s`,
    top: `${20 + Math.random() * 40}%`
  }
}

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 建筑入场
    gsap.from('.building-21', {
      y: 600,
      scaleY: 0,
      stagger: 0.1,
      duration: 1.5,
      ease: 'elastic.out(1, 0.5)',
      scrollTrigger: {
        trigger: '.city-skyline-21',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    })

    // 霓虹灯闪烁
    gsap.to('.building-neon-21', {
      opacity: 0.3,
      duration: 0.5,
      repeat: -1,
      yoyo: true,
      ease: 'none',
      stagger: 0.1
    })

    // 雨水滚动效果
    gsap.to('.rain-drop-21', {
      y: 100,
      scrollTrigger: {
        trigger: '.city-container-21',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    })

    // 滚动时城市移动
    gsap.to('.city-skyline-21', {
      x: -100,
      duration: 1,
      scrollTrigger: {
        trigger: '.city-container-21',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    })

    // 窗户灯光随机闪烁 - 使用gsap.utils.toArray自动清理
    gsap.utils.toArray('.window-21').forEach((window: Element) => {
      const isLit = Math.random() > 0.6
      gsap.to(window, {
        opacity: isLit ? 0.9 : 0.1,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: 'none',
        delay: Math.random() * 2
      })
    })

    // 地面霓虹脉动
    gsap.to('.ground-neon-21', {
      scaleX: 1.2,
      opacity: 0.8,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.cyberpunk-section-21 {
  min-height: 100vh;
  padding: 60px 20px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, #0a0a1a 0%, #1a0a2a 50%, #0a0a1a 100%);

  opacity: 1 !important;}

.content-21 {
  text-align: center;

  opacity: 1 !important;}

.section-title-21 {
  font-size: clamp(2rem, 4vw, 2.5rem);
  font-weight: 800;
  margin-bottom: 16px;
  color: #ff00ff;
  text-shadow: 0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 40px #ff00ff;

  opacity: 1 !important;}

.subtitle-21 {
  font-size: 1.1rem;
  color: #00ffff;
  margin-bottom: 40px;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);

  opacity: 1 !important;}

.city-container-21 {
  position: relative;
  width: 100%;
  height: 600px;
  margin-top: 40px;
  overflow: hidden;
  background: linear-gradient(180deg, #0a0a1a 0%, #1a0a2a 60%, #0a0a2a 100%);
  border-radius: 20px;
  box-shadow: 0 0 40px rgba(255, 0, 255, 0.3),
              inset 0 0 60px rgba(0, 0, 0, 0.5);

  opacity: 1 !important;}

.city-skyline-21 {
  position: absolute;
  bottom: 100px;
  left: 0;
  right: 0;
  height: 500px;
  display: flex;
  align-items: flex-end;
  padding: 0 20px;

  opacity: 1 !important;}

.building-21 {
  position: absolute;
  width: 60px;
  background: linear-gradient(180deg, #1a1a3a, #0a0a2a);
  border: 1px solid rgba(255, 0, 255, 0.3);
  border-radius: 4px 4px 0 0;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(255, 0, 255, 0.2);
  transform-origin: bottom;

  opacity: 1 !important;}

.building-windows-21 {
  position: absolute;
  inset: 10px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(6, 1fr);
  gap: 3px;
}

.window-21 {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1px;
  transition: background 0.3s ease;

  &.lit-21 {
    background: rgba(255, 255, 100, 0.8);
    box-shadow: 0 0 10px rgba(255, 255, 100, 0.5);
  
  opacity: 1 !important;}
}

.building-neon-21 {
  position: absolute;
  right: 2px;
  top: 10px;
  bottom: 10px;
  width: 4px;
  opacity: 0.8;
  box-shadow: 0 0 10px currentColor;
  filter: blur(2px);
}

.city-rain-21 {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.rain-drop-21 {
  position: absolute;
  width: 1px;
  height: 20px;
  background: linear-gradient(to bottom, transparent, rgba(0, 255, 255, 0.5));
  animation: rain 1s linear infinite;

  opacity: 1 !important;}

@keyframes rain {
  0% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(600px);
  }
}

.city-ground-21 {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  background: linear-gradient(180deg, transparent, #0a0a1a);

  opacity: 1 !important;}

.ground-neon-21 {
  position: absolute;
  bottom: 20px;
  left: 10%;
  right: 10%;
  height: 4px;
  background: linear-gradient(90deg, #ff00ff, #00ffff, #ff00ff);
  background-size: 200% 100%;
  animation: neonMove 3s linear infinite;
  box-shadow: 0 0 20px #ff00ff, 0 0 40px #00ffff;
  filter: blur(4px);

  opacity: 1 !important;}

@keyframes neonMove {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
}

.ground-reflection-21 {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  background: linear-gradient(180deg, transparent, rgba(255, 0, 255, 0.1));
  filter: blur(10px);

  opacity: 1 !important;}

.flying-car-21 {
  position: absolute;
  width: 60px;
  height: 20px;
  left: -60px;
  animation: fly linear infinite;

  opacity: 1 !important;}

.car-body-21 {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #2a2a4a, #1a1a3a);
  border-radius: 4px;
  border: 1px solid rgba(255, 0, 255, 0.5);
  box-shadow: 0 0 10px rgba(255, 0, 255, 0.3);

  opacity: 1 !important;}

.car-lights-21 {
  position: absolute;
  right: -20px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 4px;
  background: linear-gradient(90deg, rgba(255, 0, 255, 0.8), transparent);
  filter: blur(2px);

  opacity: 1 !important;}

@keyframes fly {
  0% {
    left: -60px;
  }
  100% {
    left: calc(100% + 60px);
  }
}

@media (max-width: 768px) {
  .city-container-21 {
    height: 400px;
  
  opacity: 1 !important;}

  .building-21 {
    width: 40px;
  
  opacity: 1 !important;}
}
</style>
