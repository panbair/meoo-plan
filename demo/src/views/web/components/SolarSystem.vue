<template>
  <section class="solar-system-section-28">
    <div class="content-28">
      <h2 class="ss-section-title-28">太阳系</h2>
      <p class="ss-subtitle-28">行星的轨道之舞</p>

      <div class="solar-container-28" ref="solarContainer">
        <div class="stars-background-28">
          <div class="star-bg-28" v-for="n in 200" :key="n"
               :style="getStarBgStyle(n)"></div>
        </div>

        <div class="sun-28">
          <div class="sun-core-28"></div>
          <div class="sun-corona-28"></div>
          <div class="sun-flares-28">
            <div class="flare-28" v-for="n in 12" :key="n"
                 :style="getFlareStyle(n)"></div>
          </div>
        </div>

        <div class="orbits-28">
          <div class="orbit-28 orbit-mercury-28">
            <div class="planet-28 mercury-28">
              <div class="planet-body-28"></div>
            </div>
          </div>
          <div class="orbit-28 orbit-venus-28">
            <div class="planet-28 venus-28">
              <div class="planet-body-28"></div>
            </div>
          </div>
          <div class="orbit-28 orbit-earth-28">
            <div class="planet-28 earth-28">
              <div class="planet-body-28"></div>
              <div class="moon-orbit-28">
                <div class="moon-28"></div>
              </div>
            </div>
          </div>
          <div class="orbit-28 orbit-mars-28">
            <div class="planet-28 mars-28">
              <div class="planet-body-28"></div>
            </div>
          </div>
          <div class="orbit-28 orbit-jupiter-28">
            <div class="planet-28 jupiter-28">
              <div class="planet-body-28"></div>
              <div class="planet-rings-28"></div>
            </div>
          </div>
          <div class="orbit-28 orbit-saturn-28">
            <div class="planet-28 saturn-28">
              <div class="planet-body-28"></div>
              <div class="planet-rings-28 saturn-rings-28"></div>
            </div>
          </div>
          <div class="orbit-28 orbit-uranus-28">
            <div class="planet-28 uranus-28">
              <div class="planet-body-28"></div>
            </div>
          </div>
          <div class="orbit-28 orbit-neptune-28">
            <div class="planet-28 neptune-28">
              <div class="planet-body-28"></div>
            </div>
          </div>
        </div>

        <div class="asteroid-belt-28">
          <div class="asteroid-28" v-for="n in 50" :key="n"
               :style="getAsteroidStyle(n)"></div>
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

const solarContainer = ref<HTMLElement | null>(null)

const getStarBgStyle = (index: number) => {
  return {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 2}s`
  }
}

const getFlareStyle = (index: number) => {
  const angle = (index - 1) * 30
  const height = 20 + Math.random() * 30
  return {
    transform: `rotate(${angle}deg)`,
    height: `${height}px`
  }
}

const getAsteroidStyle = (index: number) => {
  const angle = (index / 50) * 360
  const radius = 180 + Math.random() * 20
  const x = Math.cos(angle * Math.PI / 180) * radius
  const y = Math.sin(angle * Math.PI / 180) * radius
  const size = 2 + Math.random() * 4
  return {
    left: `calc(50% + ${x}px)`,
    top: `calc(50% + ${y}px)`,
    width: `${size}px`,
    height: `${size}px`
  }
}

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 星星闪烁
    gsap.to('.star-bg-28', {
      opacity: 0.2,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: 'none',
      stagger: 0.01
    })

    // 太阳脉动
    gsap.to('.sun-core-28', {
      scale: 1.1,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    })

    // 日冕波动
    gsap.to('.sun-corona-28', {
      scale: 1.2,
      opacity: 0.6,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })

    // 太阳耀斑
    gsap.to('.flare-28', {
      scaleY: 1.5,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
      stagger: 0.1
    })

    // 行星轨道旋转
    gsap.to('.orbit-28', {
      rotation: 360,
      duration: 60,
      repeat: -1,
      ease: 'none'
    })

    // 不同的轨道速度
    gsap.to('.orbit-mercury-28', { rotation: 360, duration: 8, repeat: -1, ease: 'none' })
    gsap.to('.orbit-venus-28', { rotation: 360, duration: 12, repeat: -1, ease: 'none' })
    gsap.to('.orbit-earth-28', { rotation: 360, duration: 16, repeat: -1, ease: 'none' })
    gsap.to('.orbit-mars-28', { rotation: 360, duration: 24, repeat: -1, ease: 'none' })
    gsap.to('.orbit-jupiter-28', { rotation: 360, duration: 40, repeat: -1, ease: 'none' })
    gsap.to('.orbit-saturn-28', { rotation: 360, duration: 50, repeat: -1, ease: 'none' })
    gsap.to('.orbit-uranus-28', { rotation: 360, duration: 70, repeat: -1, ease: 'none' })
    gsap.to('.orbit-neptune-28', { rotation: 360, duration: 90, repeat: -1, ease: 'none' })

    // 月球旋转
    gsap.to('.moon-orbit-28', {
      rotation: 360,
      duration: 3,
      repeat: -1,
      ease: 'none'
    })

    // 小行星带
    gsap.to('.asteroid-belt-28', {
      rotation: 360,
      duration: 20,
      repeat: -1,
      ease: 'none'
    })

    // 行星自转
    gsap.to('.planet-body-28', {
      rotation: 360,
      duration: 10,
      repeat: -1,
      ease: 'none',
      stagger: 1
    })

    // 滚动效果
    gsap.to('.solar-container-28', {
      scale: 0.8,
      rotationY: 30,
      duration: 1,
      scrollTrigger: {
        trigger: '.solar-system-section-28',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    })

    // 入场动画
    gsap.from('.sun-28', {
      scale: 0,
      opacity: 0,
      duration: 1.5,
      ease: 'elastic.out(1, 0.5)',
      scrollTrigger: {
        trigger: '.solar-system-section-28',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    })

    gsap.from('.planet-28', {
      scale: 0,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'back.out',
      scrollTrigger: {
        trigger: '.solar-system-section-28',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
      }
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.solar-system-section-28 {
  min-height: 100vh;
  padding: 60px 20px;
  position: relative;
  overflow: hidden;
  background: #000;

  opacity: 1 !important;}

.content-28 {
  text-align: center;

  opacity: 1 !important;}

.ss-section-title-28 {
  font-size: clamp(2rem, 4vw, 2.5rem);
  font-weight: 800;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #fbbf24, #f97316, #ef4444);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  opacity: 1 !important;}

.ss-subtitle-28 {
  font-size: 1.1rem;
  color: #94a3b8;
  margin-bottom: 40px;

  opacity: 1 !important;}

.solar-container-28 {
  position: relative;
  width: 100%;
  max-width: 800px;
  height: 800px;
  margin: 0 auto;
  border-radius: 50%;
  overflow: hidden;

  opacity: 1 !important;}

.stars-background-28 {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.star-bg-28 {
  position: absolute;
  width: 2px;
  height: 2px;
  background: #fff;
  border-radius: 50%;
  animation: starTwinkle 1s ease-in-out infinite;

  opacity: 1 !important;}

@keyframes starTwinkle {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
}

.sun-28 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  z-index: 10;

  opacity: 1 !important;}

.sun-core-28 {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle, #fff 0%, #fbbf24 30%, #f97316 60%, #ef4444 100%);
  border-radius: 50%;
  box-shadow: 0 0 60px #fbbf24, 0 0 120px #f97316;

  opacity: 1 !important;}

.sun-corona-28 {
  position: absolute;
  inset: -20px;
  background: radial-gradient(circle, rgba(251, 191, 36, 0.3), transparent 70%);
  border-radius: 50%;
  filter: blur(10px);

  opacity: 1 !important;}

.sun-flares-28 {
  position: absolute;
  inset: -30px;
}

.flare-28 {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  transform-origin: bottom center;
  background: linear-gradient(to top, #fbbf24, transparent);
  border-radius: 2px;
  animation: flarePulse 1s ease-in-out infinite;

  opacity: 1 !important;}

@keyframes flarePulse {
  0%, 100% {
    scaleY: 1;
    opacity: 0.8;
  }
  50% {
    scaleY: 1.5;
    opacity: 1;
  }
}

.orbits-28 {
  position: absolute;
  inset: 50px;
}

.orbit-28 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;

  opacity: 1 !important;}

.orbit-mercury-28 { width: 140px; height: 140px; 
  opacity: 1 !important;}
.orbit-venus-28 { width: 180px; height: 180px; 
  opacity: 1 !important;}
.orbit-earth-28 { width: 240px; height: 240px; 
  opacity: 1 !important;}
.orbit-mars-28 { width: 300px; height: 300px; 
  opacity: 1 !important;}
.orbit-jupiter-28 { width: 400px; height: 400px; 
  opacity: 1 !important;}
.orbit-saturn-28 { width: 500px; height: 500px; 
  opacity: 1 !important;}
.orbit-uranus-28 { width: 600px; height: 600px; 
  opacity: 1 !important;}
.orbit-neptune-28 { width: 700px; height: 700px; 
  opacity: 1 !important;}

.planet-28 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.mercury-28 { width: 12px; height: 12px; 
  opacity: 1 !important;}
.venus-28 { width: 18px; height: 18px; 
  opacity: 1 !important;}
.earth-28 { width: 20px; height: 20px; 
  opacity: 1 !important;}
.mars-28 { width: 16px; height: 16px; 
  opacity: 1 !important;}
.jupiter-28 { width: 40px; height: 40px; 
  opacity: 1 !important;}
.saturn-28 { width: 35px; height: 35px; 
  opacity: 1 !important;}
.uranus-28 { width: 28px; height: 28px; 
  opacity: 1 !important;}
.neptune-28 { width: 26px; height: 26px; 
  opacity: 1 !important;}

.planet-body-28 {
  width: 100%;
  height: 100%;
  border-radius: 50%;

  opacity: 1 !important;}

.mercury-28 .planet-body-28 { background: radial-gradient(circle, #9ca3af, #6b7280); 
  opacity: 1 !important;}
.venus-28 .planet-body-28 { background: radial-gradient(circle, #fbbf24, #f59e0b); 
  opacity: 1 !important;}
.earth-28 .planet-body-28 { background: radial-gradient(circle, #3b82f6, #1d4ed8); 
  opacity: 1 !important;}
.mars-28 .planet-body-28 { background: radial-gradient(circle, #ef4444, #dc2626); 
  opacity: 1 !important;}
.jupiter-28 .planet-body-28 { background: radial-gradient(circle, #d97706, #b45309); 
  opacity: 1 !important;}
.saturn-28 .planet-body-28 { background: radial-gradient(circle, #fcd34d, #f59e0b); 
  opacity: 1 !important;}
.uranus-28 .planet-body-28 { background: radial-gradient(circle, #22d3ee, #0891b2); 
  opacity: 1 !important;}
.neptune-28 .planet-body-28 { background: radial-gradient(circle, #3b82f6, #1e40af); 
  opacity: 1 !important;}

.moon-orbit-28 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;

  opacity: 1 !important;}

.moon-28 {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 6px;
  background: #9ca3af;
  border-radius: 50%;

  opacity: 1 !important;}

.planet-rings-28 {
  position: absolute;
  inset: -5px;
  border: 2px solid rgba(252, 211, 77, 0.6);
  border-radius: 50%;
  transform: rotateX(75deg);

  opacity: 1 !important;}

.saturn-rings-28 {
  inset: -8px;
  border-width: 3px;

  opacity: 1 !important;}

.asteroid-belt-28 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 340px;
  height: 340px;
  pointer-events: none;

  opacity: 1 !important;}

.asteroid-28 {
  position: absolute;
  background: #6b7280;
  border-radius: 50%;

  opacity: 1 !important;}

@media (max-width: 768px) {
  .solar-container-28 {
    height: 600px;
  
  opacity: 1 !important;}
}
</style>
