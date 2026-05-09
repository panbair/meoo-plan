<template>
  <section ref="ballSection" class="bb-section-9 bb-ball-section-9">
    <div class="bb-header-9">
      <h2 class="bb-section-title-9">弹性球动画</h2>
      <p class="bb-subtitle-9">Physics-based Bouncing Balls</p>
    </div>

    <div class="bb-ball-container-9" ref="ballContainer">
      <!-- 轨道网格 -->
      <div class="bb-track-grid-9">
        <div v-for="i in 5" :key="i" class="bb-track-line-9" :style="{ left: `${i * 20}%` }"></div>
      </div>

      <!-- 地面 -->
      <div class="bb-ground-9">
        <div class="bb-ground-line-9"></div>
        <div class="bb-ground-glow-9"></div>
      </div>

      <!-- 弹性球 -->
      <div class="bb-balls-wrapper-9">
        <div
          v-for="(ball, index) in balls"
          :key="index"
          class="bb-ball-9"
          :class="`bb-ball-${index + 1}`"
          :style="{
            '--ball-color': ball.color,
            '--ball-size': ball.size + 'px',
            '--ball-index': index
          }"
        >
          <div class="bb-ball-inner-9">
            <div class="bb-ball-highlight-9"></div>
            <div class="bb-ball-shadow-9"></div>
          </div>
        </div>
      </div>

      <!-- 球体阴影 -->
      <div class="bb-shadows-wrapper-9">
        <div
          v-for="(ball, index) in balls"
          :key="`shadow-${index}`"
          class="bb-shadow-9"
          :style="{
            '--shadow-color': ball.color,
            '--shadow-size': ball.size + 'px',
            '--shadow-index': index
          }"
        ></div>
      </div>

      <!-- 装饰粒子 -->
      <div class="bb-particles-9" ref="particles">
        <div v-for="i in 30" :key="i" class="bb-particle-9" :style="getParticleStyle(i)"></div>
      </div>

      <!-- 能量条 -->
      <div class="bb-energy-bars-9">
        <div v-for="i in 5" :key="i" class="bb-energy-bar-9" :style="{ '--delay': i * 0.1 + 's' }">
          <div class="bb-bar-fill-9"></div>
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

const ballSection = ref<HTMLElement>()
const ballContainer = ref<HTMLElement>()
const particles = ref<HTMLElement>()
const infoPanel = ref<HTMLElement>()

const balls = [
  { color: '#ff6b6b', size: 50 },
  { color: '#4ecdc4', size: 60 },
  { color: '#ffe66d', size: 70 },
  { color: '#95e1d3', size: 55 },
  { color: '#f38181', size: 65 }
]

const getParticleStyle = (index: number) => {
  const size = Math.random() * 4 + 2
  const left = Math.random() * 100
  const top = Math.random() * 100
  const delay = Math.random() * 2
  const duration = Math.random() * 2 + 1

  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${left}%`,
    top: `${top}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  }
}

onMounted(() => {
  setTimeout(() => {
    initAnimations()
  }, 100)
})

onUnmounted(() => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
  gsap.killTweensOf('*')
})

const initAnimations = () => {
  if (!ballSection.value) return

  // 球体弹跳动画
  gsap.utils.toArray<HTMLElement>('.bb-ball-9').forEach((ball, index) => {
    const bounceHeight = 250 - index * 30
    const duration = 0.8 + index * 0.1

    gsap.to(ball, {
      y: -bounceHeight,
      duration: duration,
      ease: 'power1.in',
      scrollTrigger: {
        trigger: ballSection.value,
        start: 'top 70%',
        end: 'bottom 30%',
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress
          const shadowIndex = index
          const shadow = document.querySelectorAll('.bb-shadow-9')[shadowIndex] as HTMLElement

          if (shadow) {
            const scale = 1 - (progress * 0.7)
            const opacity = 0.8 - (progress * 0.6)
            gsap.set(shadow, {
              scale: scale,
              opacity: opacity
            })
          }
        }
      }
    })
  })

  // 球体挤压效果
  gsap.utils.toArray<HTMLElement>('.bb-ball-9').forEach((ball) => {
    gsap.to(ball, {
      scaleX: 1.2,
      scaleY: 0.8,
      duration: 0.1,
      repeat: 1,
      yoyo: true,
      scrollTrigger: {
        trigger: ballSection.value,
        start: 'top 30%',
        end: 'top 28%',
        scrub: true
      }
    })
  })

  // 粒子漂浮动画
  gsap.utils.toArray<HTMLElement>('.bb-particle-9').forEach((particle, i) => {
    gsap.to(particle, {
      y: -50 - Math.random() * 100,
      x: (Math.random() - 0.5) * 100,
      opacity: 0,
      duration: 3 + Math.random() * 2,
      ease: 'power2.out',
      repeat: -1,
      delay: i * 0.05
    })
  })

  // 能量条动画
  gsap.utils.toArray<HTMLElement>('.bb-bar-fill-9').forEach((bar, i) => {
    gsap.to(bar, {
      width: '100%',
      duration: 1 + i * 0.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: ballSection.value,
        start: 'top 80%'
      }
    })
  })

  // 轨道线出现
  gsap.from('.bb-track-line-9', {
    scaleY: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: ballSection.value,
      start: 'top 75%'
    }
  })

  // 地面光晕脉冲
  gsap.to('.bb-ground-glow-9', {
    opacity: 0.6,
    scale: 1.1,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  })
}
</script>

<style scoped lang="scss">
.bb-section-9 {
  min-height: 100vh;
  padding: 80px 20px 100px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(180deg, #0a0a1a 0%, #1a1a3a 50%, #0a0a1a 100%);
  overflow: hidden;

  opacity: 1 !important;}

.bb-header-9 {
  text-align: center;
  margin-bottom: 60px;
  z-index: 10;

  opacity: 1 !important;}

.bb-section-title-9 {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 50%, #ffe66d 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 2px;

  opacity: 1 !important;}

.bb-subtitle-9 {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 300;
  letter-spacing: 4px;
  text-transform: uppercase;

  opacity: 1 !important;}

.bb-ball-container-9 {
  position: relative;
  width: 100%;
  max-width: 1200px;
  height: 500px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  margin-bottom: 60px;

  opacity: 1 !important;}

// 轨道网格
.bb-track-grid-9 {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;

  opacity: 1 !important;}

.bb-track-line-9 {
  position: absolute;
  bottom: 0;
  width: 1px;
  height: 100%;
  background: linear-gradient(to top, rgba(255, 255, 255, 0.1), transparent);

  opacity: 1 !important;}

// 地面
.bb-ground-9 {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 100px;
  display: flex;
  align-items: flex-end;
  justify-content: center;

  opacity: 1 !important;}

.bb-ground-line-9 {
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);

  opacity: 1 !important;}

.bb-ground-glow-9 {
  position: absolute;
  bottom: -20px;
  width: 80%;
  height: 40px;
  background: radial-gradient(ellipse, rgba(102, 126, 234, 0.3) 0%, transparent 70%);
  filter: blur(20px);
  opacity: 0.4;
}

// 球体容器
.bb-balls-wrapper-9 {
  position: absolute;
  bottom: 100px;
  display: flex;
  gap: 40px;
  z-index: 5;
}

.bb-ball-9 {
  position: relative;
  width: var(--ball-size);
  height: var(--ball-size);
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  
  opacity: 1 !important;}
}

.bb-ball-inner-9 {
  position: relative;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8) 0%, var(--ball-color) 50%, rgba(0, 0, 0, 0.3) 100%);
  border-radius: 50%;
  box-shadow:
    0 0 30px var(--ball-color),
    0 0 60px var(--ball-color),
    inset 0 -10px 20px rgba(0, 0, 0, 0.3);
  animation: ballGlow 2s ease-in-out infinite;

  opacity: 1 !important;}

.bb-ball-highlight-9 {
  position: absolute;
  top: 15%;
  left: 20%;
  width: 30%;
  height: 20%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, transparent 70%);
  border-radius: 50%;

  opacity: 1 !important;}

.bb-ball-shadow-9 {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 20%;
  background: radial-gradient(ellipse, rgba(0, 0, 0, 0.4) 0%, transparent 70%);
  filter: blur(5px);

  opacity: 1 !important;}

@keyframes ballGlow {
  0%, 100% {
    box-shadow:
      0 0 30px var(--ball-color),
      0 0 60px var(--ball-color),
      inset 0 -10px 20px rgba(0, 0, 0, 0.3);
  }
  50% {
    box-shadow:
      0 0 40px var(--ball-color),
      0 0 80px var(--ball-color),
      inset 0 -10px 20px rgba(0, 0, 0, 0.3);
  }
}

// 阴影容器
.bb-shadows-wrapper-9 {
  position: absolute;
  bottom: 95px;
  display: flex;
  gap: 40px;
  z-index: 3;
}

.bb-shadow-9 {
  width: var(--shadow-size);
  height: calc(var(--shadow-size) * 0.3);
  background: radial-gradient(ellipse, var(--shadow-color) 0%, transparent 70%);
  filter: blur(8px);
  opacity: 0.8;
  transform-origin: center;
}

// 粒子
.bb-particles-9 {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;

  opacity: 1 !important;}

.bb-particle-9 {
  position: absolute;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: floatParticle infinite ease-in-out;

  opacity: 1 !important;}

@keyframes floatParticle {
  0% {
    transform: translateY(0) rotate(0deg);
  }
  100% {
    transform: translateY(-100px) rotate(360deg);
  }
}

// 能量条
.bb-energy-bars-9 {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.bb-energy-bar-9 {
  width: 120px;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;

  opacity: 1 !important;}

.bb-bar-fill-9 {
  height: 100%;
  width: 0;
  background: linear-gradient(90deg, #ff6b6b, #4ecdc4);
  border-radius: 3px;

  opacity: 1 !important;}


.bb-info-card-9 {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: transform 0.3s ease, background 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.08);
  
  opacity: 1 !important;}
}

.bb-info-icon-9 {
  font-size: 2.5rem;

  opacity: 1 !important;}

.bb-info-text-9 {
  flex: 1;
}

.bb-info-value-9 {
  font-size: 1.2rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: 4px;

  opacity: 1 !important;}

.bb-info-desc-9 {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);

  opacity: 1 !important;}

@media (max-width: 1024px) {
  .bb-balls-wrapper-9 {
    gap: 30px;
  }

  .bb-shadows-wrapper-9 {
    gap: 30px;
  }
}

@media (max-width: 768px) {
  .bb-section-title-9 {
    font-size: 2rem;
  
  opacity: 1 !important;}

  .bb-ball-container-9 {
    height: 400px;
  
  opacity: 1 !important;}

  .bb-balls-wrapper-9 {
    gap: 20px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .bb-shadows-wrapper-9 {
    gap: 20px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .bb-info-panel-9 {
    grid-template-columns: 1fr;
    gap: 15px;
    padding: 25px;
  
  opacity: 1 !important;}

  .bb-energy-bars-9 {
    top: 10px;
    right: 10px;
  }

  .bb-energy-bar-9 {
    width: 80px;
  
  opacity: 1 !important;}
}
</style>
