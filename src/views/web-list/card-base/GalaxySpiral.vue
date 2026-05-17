<template>
  <section class="galaxy-section-24">
    <div class="content-24">
      <h2 class="section-title-24">银河漩涡</h2>
      <p class="subtitle-24">星系的壮丽螺旋</p>

      <div class="galaxy-container-24" ref="galaxyContainer">
        <div class="galaxy-core-24">
          <div class="core-glow-24"></div>
          <div class="core-pulse-24"></div>
        </div>

        <div class="galaxy-arms-24">
          <div class="arm-24 arm-1">
            <div class="star-cluster-24" v-for="n in 60" :key="n"
                 :style="getStarStyle(n, 1)"></div>
          </div>
          <div class="arm-24 arm-2">
            <div class="star-cluster-24" v-for="n in 60" :key="n"
                 :style="getStarStyle(n, 2)"></div>
          </div>
          <div class="arm-24 arm-3">
            <div class="star-cluster-24" v-for="n in 60" :key="n"
                 :style="getStarStyle(n, 3)"></div>
          </div>
          <div class="arm-24 arm-4">
            <div class="star-cluster-24" v-for="n in 60" :key="n"
                 :style="getStarStyle(n, 4)"></div>
          </div>
        </div>

        <div class="galaxy-dust-24">
          <div class="dust-particle-24" v-for="n in 100" :key="n"
               :style="getDustStyle(n)"></div>
        </div>

        <div class="galaxy-nebula-24">
          <div class="nebula-cloud-24 nebula-1"></div>
          <div class="nebula-cloud-24 nebula-2"></div>
          <div class="nebula-cloud-24 nebula-3"></div>
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

const galaxyContainer = ref<HTMLElement | null>(null)

const getStarStyle = (index: number, armIndex: number) => {
  const radius = 30 + (index * 3)
  const angleOffset = (armIndex - 1) * 90
  const angle = (index * 6) + angleOffset
  const x = Math.cos(angle * Math.PI / 180) * radius
  const y = Math.sin(angle * Math.PI / 180) * radius
  const size = 2 + Math.random() * 4
  return {
    left: `calc(50% + ${x}px)`,
    top: `calc(50% + ${y}px)`,
    width: `${size}px`,
    height: `${size}px`,
    animationDelay: `${index * 0.02}s`
  }
}

const getDustStyle = (index: number) => {
  const angle = Math.random() * 360
  const radius = 50 + Math.random() * 250
  const x = Math.cos(angle * Math.PI / 180) * radius
  const y = Math.sin(angle * Math.PI / 180) * radius
  return {
    left: `calc(50% + ${x}px)`,
    top: `calc(50% + ${y}px)`,
    animationDelay: `${Math.random() * 2}s`
  }
}

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 银河旋转
    gsap.to('.galaxy-arms-24', {
      rotation: 360,
      duration: 20,
      repeat: -1,
      ease: 'none'
    })

    // 星星闪烁
    gsap.to('.star-cluster-24', {
      opacity: 0.3,
      scale: 0.5,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: 'none',
      stagger: 0.05
    })

    // 核心脉动
    gsap.to('.core-glow-24', {
      scale: 1.5,
      opacity: 0.6,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    })

    // 星云漂浮
    gsap.to('.nebula-cloud-24', {
      x: 30,
      y: 30,
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: 1
    })

    // 尘埃粒子漂浮
    gsap.to('.dust-particle-24', {
      x: '+=10',
      y: '-=10',
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: 0.01
    })

    // 滚动时效果
    gsap.to('.galaxy-container-24', {
      scale: 1.2,
      rotation: 30,
      duration: 1,
      scrollTrigger: {
        trigger: '.galaxy-section-24',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    })

    // 入场动画
    gsap.from('.galaxy-container-24', {
      scale: 0,
      opacity: 0,
      duration: 1.5,
      ease: 'elastic.out(1, 0.5)',
      scrollTrigger: {
        trigger: '.galaxy-section-24',
        start: 'top 80%',
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
.galaxy-section-24 {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  position: relative;
  overflow: hidden;
  background: #000;

  opacity: 1 !important;}

.content-24 {
  text-align: center;
  position: relative;
  z-index: 10;

  opacity: 1 !important;}

.section-title-24 {
  font-size: clamp(2rem, 4vw, 2.5rem);
  font-weight: 800;
  margin-bottom: 16px;
  color: #fff;
  text-shadow: 0 0 20px rgba(139, 92, 246, 0.8),
               0 0 40px rgba(139, 92, 246, 0.5);

  opacity: 1 !important;}

.subtitle-24 {
  font-size: 1.1rem;
  color: #a78bfa;
  margin-bottom: 60px;

  opacity: 1 !important;}

.galaxy-container-24 {
  position: relative;
  width: 600px;
  height: 600px;
  margin: 0 auto;

  opacity: 1 !important;}

.galaxy-core-24 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  z-index: 10;

  opacity: 1 !important;}

.core-glow-24 {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle, rgba(255, 255, 200, 0.9), rgba(255, 200, 100, 0.4), transparent);
  border-radius: 50%;
  box-shadow: 0 0 60px rgba(255, 200, 100, 0.6),
              0 0 120px rgba(255, 200, 100, 0.3);

  opacity: 1 !important;}

.core-pulse-24 {
  position: absolute;
  inset: -10px;
  background: radial-gradient(circle, transparent, rgba(255, 200, 100, 0.1));
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;

  opacity: 1 !important;}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.3);
    opacity: 0;
  }
}

.galaxy-arms-24 {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
}

.arm-24 {
  position: absolute;
  inset: 0;
}

.star-cluster-24 {
  position: absolute;
  border-radius: 50%;
  animation: starTwinkle 1s ease-in-out infinite;
}

.arm-1 .star-cluster-24 {
  background: radial-gradient(circle, #a78bfa, #8b5cf6);
  box-shadow: 0 0 10px rgba(167, 139, 250, 0.6);

  opacity: 1 !important;}

.arm-2 .star-cluster-24 {
  background: radial-gradient(circle, #60a5fa, #3b82f6);
  box-shadow: 0 0 10px rgba(96, 165, 250, 0.6);

  opacity: 1 !important;}

.arm-3 .star-cluster-24 {
  background: radial-gradient(circle, #f472b6, #ec4899);
  box-shadow: 0 0 10px rgba(244, 114, 182, 0.6);

  opacity: 1 !important;}

.arm-4 .star-cluster-24 {
  background: radial-gradient(circle, #34d399, #10b981);
  box-shadow: 0 0 10px rgba(52, 211, 153, 0.6);

  opacity: 1 !important;}

@keyframes starTwinkle {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(0.8);
  }
}

.galaxy-dust-24 {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.dust-particle-24 {
  position: absolute;
  width: 2px;
  height: 2px;
  background: rgba(139, 92, 246, 0.4);
  border-radius: 50%;
  animation: dustFloat 4s ease-in-out infinite;

  opacity: 1 !important;}

@keyframes dustFloat {
  0%, 100% {
    opacity: 0.2;
  }
  50% {
    opacity: 0.5;
  }
}

.galaxy-nebula-24 {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.nebula-cloud-24 {
  position: absolute;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.3;
}

.nebula-1 {
  top: 10%;
  left: 10%;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.4), transparent);

  opacity: 1 !important;}

.nebula-2 {
  bottom: 10%;
  right: 10%;
  background: radial-gradient(circle, rgba(96, 165, 250, 0.4), transparent);

  opacity: 1 !important;}

.nebula-3 {
  top: 50%;
  right: 20%;
  background: radial-gradient(circle, rgba(244, 114, 182, 0.3), transparent);

  opacity: 1 !important;}

@media (max-width: 768px) {
  .galaxy-container-24 {
    width: 400px;
    height: 400px;
  
  opacity: 1 !important;}
}
</style>
