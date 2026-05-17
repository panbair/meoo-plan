<template>
  <section class="qf-quantum-section-26">
    <div class="qf-content-26">
      <h2 class="qf-section-title-26">量子场</h2>
      <p class="qf-subtitle-26">微观世界的神奇波动</p>

      <div class="qf-quantum-container-26" ref="quantumContainer">
        <div class="qf-quantum-grid-26">
          <div class="qf-grid-node-26" v-for="n in 100" :key="n"
               :style="getGridNodeStyle(n)"></div>
        </div>

        <div class="qf-quantum-connections-26">
          <div class="qf-connection-line-26" v-for="n in 50" :key="n"
               :style="getConnectionStyle(n)"></div>
        </div>

        <div class="qf-quantum-particles-26">
          <div class="qf-particle-26 qf-quantum-particle-26" v-for="n in 30" :key="n"
               :style="getParticleStyle(n)"></div>
        </div>

        <div class="qf-quantum-core-26">
          <div class="qf-core-ring-26 qf-ring-1"></div>
          <div class="qf-core-ring-26 qf-ring-2"></div>
          <div class="qf-core-ring-26 qf-ring-3"></div>
          <div class="qf-core-energy-26"></div>
        </div>

        <div class="qf-quantum-waves-26">
          <div class="qf-wave-26 qf-wave-1"></div>
          <div class="qf-wave-26 qf-wave-2"></div>
          <div class="qf-wave-26 qf-wave-3"></div>
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

const quantumContainer = ref<HTMLElement | null>(null)

const getGridNodeStyle = (index: number) => {
  const x = (index % 10) * 60
  const y = Math.floor(index / 10) * 60
  return {
    left: `${x}px`,
    top: `${y}px`,
    animationDelay: `${index * 0.05}s`
  }
}

const getConnectionStyle = (index: number) => {
  const angle = (index / 50) * 360
  const length = 100 + Math.random() * 100
  return {
    transform: `rotate(${angle}deg)`,
    width: `${length}px`,
    animationDelay: `${index * 0.1}s`
  }
}

const getParticleStyle = (index: number) => {
  const angle = Math.random() * 360
  const radius = 80 + Math.random() * 100
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
    // 网格节点脉动
    gsap.to('.qf-grid-node-26', {
      scale: 1.5,
      opacity: 0.8,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
      stagger: 0.05
    })

    // 连接线闪烁
    gsap.to('.qf-connection-line-26', {
      opacity: 0.3,
      scaleX: 1.2,
      duration: 0.5,
      repeat: -1,
      yoyo: true,
      ease: 'none',
      stagger: 0.1
    })

    // 粒子轨道运动
    gsap.to('.qf-quantum-particle-26', {
      rotation: 360,
      duration: 8,
      repeat: -1,
      ease: 'none',
      stagger: 0.2
    })

    // 核心环旋转
    gsap.to('.qf-core-ring-26', {
      rotation: 360,
      duration: 6,
      repeat: -1,
      ease: 'none',
      stagger: 0.5
    })

    // 核心能量脉动
    gsap.to('.qf-core-energy-26', {
      scale: 1.3,
      opacity: 0.7,
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    })

    // 波浪扩散
    gsap.to('.qf-wave-26', {
      scale: 2,
      opacity: 0,
      duration: 3,
      repeat: -1,
      ease: 'power1.out',
      stagger: 1
    })

    // 滚动效果
    gsap.to('.qf-quantum-container-26', {
      rotationY: 30,
      rotationX: -15,
      duration: 1,
      scrollTrigger: {
        trigger: '.qf-quantum-section-26',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    })

    // 入场动画
    gsap.from('.qf-quantum-container-26', {
      scale: 0.5,
      opacity: 0,
      duration: 1.5,
      ease: 'elastic.out(1, 0.5)',
      scrollTrigger: {
        trigger: '.qf-quantum-section-26',
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
.qf-quantum-section-26 {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  position: relative;
  overflow: hidden;
  background: #0a0a1a;

  opacity: 1 !important;}

.qf-content-26 {
  text-align: center;
  position: relative;

  opacity: 1 !important;}

.qf-section-title-26 {
  font-size: clamp(2rem, 4vw, 2.5rem);
  font-weight: 800;
  margin-bottom: 16px;
  color: #a78bfa;
  text-shadow: 0 0 20px rgba(167, 139, 250, 0.6);

  opacity: 1 !important;}

.qf-subtitle-26 {
  font-size: 1.1rem;
  color: #94a3b8;
  margin-bottom: 60px;

  opacity: 1 !important;}

.qf-quantum-container-26 {
  position: relative;
  width: 600px;
  height: 600px;
  perspective: 1000px;

  opacity: 1 !important;}

.qf-quantum-grid-26 {
  position: absolute;
  inset: 50px;
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(10, 1fr);
  gap: 10px;
}

.qf-grid-node-26 {
  position: relative;
  width: 8px;
  height: 8px;
  background: rgba(139, 92, 246, 0.5);
  border-radius: 50%;
  animation: qfNodePulse 1s ease-in-out infinite;

  opacity: 1 !important;}

@keyframes qfNodePulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.5);
    opacity: 1;
  }
}

.qf-quantum-connections-26 {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.qf-connection-line-26 {
  position: absolute;
  top: 50%;
  left: 50%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.6), transparent);
  transform-origin: left center;
  animation: qfConnectionFlash 0.5s ease-in-out infinite;

  opacity: 1 !important;}

@keyframes qfConnectionFlash {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.8;
  }
}

.qf-quantum-particles-26 {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.qf-quantum-particle-26 {
  position: absolute;
  width: 6px;
  height: 6px;
  background: #a78bfa;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(167, 139, 250, 0.8);
  animation: qfParticleOrbit 4s linear infinite;

  opacity: 1 !important;}

@keyframes qfParticleOrbit {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.qf-quantum-core-26 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;

  opacity: 1 !important;}

.qf-core-ring-26 {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid rgba(139, 92, 246, 0.5);

  opacity: 1 !important;}

.qf-ring-1 {
  transform: rotateX(60deg);
}

.qf-ring-2 {
  transform: rotateX(60deg) rotateY(60deg);
}

.qf-ring-3 {
  transform: rotateX(60deg) rotateY(-60deg);
}

.qf-core-energy-26 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  background: radial-gradient(circle, rgba(167, 139, 250, 0.8), transparent);
  border-radius: 50%;
  box-shadow: 0 0 30px rgba(167, 139, 250, 0.6);

  opacity: 1 !important;}

.qf-quantum-waves-26 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.qf-wave-26 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  border: 2px solid rgba(139, 92, 246, 0.3);
  border-radius: 50%;
  animation: qfWaveExpand 3s ease-out infinite;

  opacity: 1 !important;}

@keyframes qfWaveExpand {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.8;
  }
  100% {
    transform: translate(-50%, -50%) scale(3);
    opacity: 0;
  }
}

@media (max-width: 768px) {
  .qf-quantum-container-26 {
    width: 400px;
    height: 400px;
  
  opacity: 1 !important;}

  .qf-quantum-grid-26 {
    inset: 30px;
  }
}
</style>
