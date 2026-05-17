<template>
  <section class="dna-helix-section-22">
    <div class="content-22">
      <h2 class="section-title-22">DNA双螺旋</h2>
      <p class="subtitle-22">生命之链的完美螺旋</p>

      <div class="dna-container-22" ref="dnaContainer">
        <div class="dna-helix-22">
          <div class="dna-strand-22 strand-1">
            <div class="base-pair-22" v-for="n in 20" :key="n"
                 :style="getBasePairStyle(n, 'a')">
              <div class="base-22 base-a-22"></div>
              <div class="connection-22"></div>
              <div class="base-22 base-t-22"></div>
            </div>
          </div>

          <div class="dna-strand-22 strand-2">
            <div class="base-pair-22" v-for="n in 20" :key="n"
                 :style="getBasePairStyle(n, 'c')">
              <div class="base-22 base-c-22"></div>
              <div class="connection-22"></div>
              <div class="base-22 base-g-22"></div>
            </div>
          </div>

          <div class="dna-particles-22">
            <div class="dna-particle-22" v-for="n in 30" :key="n"
                 :style="getDNAParticleStyle(n)"></div>
          </div>
        </div>

        <div class="dna-info-22">
          <div class="info-card-22">
            <h3>ATCG</h3>
            <p>腺嘌呤 胸腺嘧啶 胞嘧啶 鸟嘌呤</p>
          </div>
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

const dnaContainer = ref<HTMLElement | null>(null)

const getBasePairStyle = (index: number, type: string) => {
  const angle = index * 30
  const translateY = index * 30
  const rotate = type === 'a' ? angle : angle + 180
  return {
    transform: `rotateY(${rotate}deg) translateY(${translateY}px)`,
    animationDelay: `${index * 0.1}s`
  }
}

const getDNAParticleStyle = (index: number) => {
  const angle = (index / 30) * Math.PI * 2
  const radius = 100 + Math.random() * 50
  const x = Math.cos(angle) * radius
  const y = (Math.random() - 0.5) * 600
  const z = Math.sin(angle) * radius
  return {
    left: `calc(50% + ${x}px)`,
    top: `calc(50% + ${y}px)`,
    transform: `translateZ(${z}px)`,
    animationDelay: `${Math.random() * 2}s`
  }
}

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 标题入场动画 - 增强效果
    gsap.from('.section-title-22', {
      y: 150,
      opacity: 0,
      scale: 0.6,
      rotationX: -30,
      duration: 1.5,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: '.dna-helix-section-22',
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    })

    // 副标题入场 - 增强效果
    gsap.from('.subtitle-22', {
      y: 120,
      opacity: 0,
      scale: 0.6,
      duration: 1.2,
      delay: 0.2,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: '.dna-helix-section-22',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    })

    // 双螺旋旋转
    gsap.to('.dna-strand-22', {
      rotationY: 360,
      duration: 10,
      repeat: -1,
      ease: 'none'
    })

    // 碱基对脉动
    gsap.to('.base-22', {
      scale: 1.4,
      opacity: 0.9,
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
      stagger: 0.1
    })

    // 连接线闪烁
    gsap.to('.connection-22', {
      opacity: 0.5,
      duration: 0.6,
      repeat: -1,
      yoyo: true,
      ease: 'none',
      stagger: 0.06
    })

    // 粒子漂浮
    gsap.to('.dna-particle-22', {
      y: '-=30',
      opacity: 0.7,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
      stagger: 0.08
    })

    // 滚动时DNA展开 - 增强效果
    gsap.to('.dna-helix-22', {
      rotationX: 45,
      scale: 1.4,
      duration: 1.5,
      scrollTrigger: {
        trigger: '.dna-container-22',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5
      }
    })

    // 入场动画 - 增强效果
    gsap.from('.dna-helix-22', {
      y: 400,
      opacity: 0,
      scale: 0.4,
      rotationY: 180,
      duration: 2,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: '.dna-helix-22',
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    })

    // 碱基对入场 - 增强效果
    gsap.from('.base-pair-22', {
      scale: 0,
      opacity: 0,
      rotateZ: 180,
      stagger: 0.03,
      duration: 1,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: '.dna-helix-22',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    })

    // 信息卡片入场 - 增强效果
    gsap.from('.info-card-22', {
      x: -200,
      opacity: 0,
      scale: 0.6,
      rotationY: -45,
      duration: 1.5,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: '.dna-info-22',
        start: 'top 85%',
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
.dna-helix-section-22 {
  min-height: 100vh;
  padding: 100px 20px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, #0a0a1a, #1a0a2a, #0a0a1a);

  opacity: 1 !important;}

.content-22 {
  text-align: center;
  position: relative;

  opacity: 1 !important;}

.section-title-22 {
  font-size: clamp(2rem, 4vw, 2.5rem);
  font-weight: 800;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #06b6d4, #8b5cf6, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  opacity: 1 !important;}

.subtitle-22 {
  font-size: 1.1rem;
  color: #94a3b8;
  margin-bottom: 80px;

  opacity: 1 !important;}

.dna-container-22 {
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 60px;
  perspective: 1000px;

  opacity: 1 !important;}

.dna-helix-22 {
  position: relative;
  width: 300px;
  height: 700px;
  transform-style: preserve-3d;

  opacity: 1 !important;}

.dna-strand-22 {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
}

.strand-2 {
  transform: rotateY(180deg);
}

.base-pair-22 {
  position: absolute;
  left: 50%;
  top: 50%;
  transform-style: preserve-3d;
  width: 200px;
  height: 20px;
  margin-left: -100px;
  margin-top: -10px;

  opacity: 1 !important;}

.base-22 {
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  transform-style: preserve-3d;

  opacity: 1 !important;}

.base-a-22 {
  left: 0;
  background: radial-gradient(circle, #06b6d4, #0891b2);
  box-shadow: 0 0 15px rgba(6, 182, 212, 0.6);

  opacity: 1 !important;}

.base-t-22 {
  right: 0;
  background: radial-gradient(circle, #8b5cf6, #7c3aed);
  box-shadow: 0 0 15px rgba(139, 92, 246, 0.6);

  opacity: 1 !important;}

.base-c-22 {
  left: 0;
  background: radial-gradient(circle, #ec4899, #db2777);
  box-shadow: 0 0 15px rgba(236, 72, 153, 0.6);

  opacity: 1 !important;}

.base-g-22 {
  right: 0;
  background: radial-gradient(circle, #10b981, #059669);
  box-shadow: 0 0 15px rgba(16, 185, 129, 0.6);

  opacity: 1 !important;}

.connection-22 {
  position: absolute;
  left: 20px;
  right: 20px;
  top: 50%;
  height: 2px;
  background: linear-gradient(90deg, rgba(6, 182, 212, 0.5), rgba(139, 92, 246, 0.5));
  transform: translateY(-50%);

  opacity: 1 !important;}

.dna-particles-22 {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.dna-particle-22 {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(139, 92, 246, 0.6);
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(139, 92, 246, 0.4);
  animation: particleFloat 3s ease-in-out infinite;

  opacity: 1 !important;}

@keyframes particleFloat {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-30px) scale(1.5);
    opacity: 0.8;
  }
}

.dna-info-22 {
  position: relative;
}

.info-card-22 {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 30px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);

  h3 {
    font-size: 2rem;
    font-weight: 800;
    margin-bottom: 16px;
    background: linear-gradient(135deg, #06b6d4, #8b5cf6, #ec4899);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  
  opacity: 1 !important;}

  p {
    font-size: 1rem;
    color: #94a3b8;
    line-height: 1.6;
  }
}

@media (max-width: 768px) {
  .dna-container-22 {
    flex-direction: column;
  }

  .dna-helix-22 {
    width: 200px;
    height: 500px;
  
  opacity: 1 !important;}

  .base-pair-22 {
    width: 140px;
    margin-left: -70px;
  
  opacity: 1 !important;}
}
</style>
