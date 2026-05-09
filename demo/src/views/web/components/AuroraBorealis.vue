<template>
  <section class="aurora-section-23">
    <div class="content-23">
      <h2 class="section-title-23">极光绚丽</h2>
      <p class="subtitle-23">大自然最壮丽的光之舞</p>

      <div class="aurora-container-23" ref="auroraContainer">
        <div class="aurora-sky-23">
          <div class="star-23" v-for="n in 150" :key="n"
               :style="getStarStyle(n)"></div>
        </div>

        <div class="aurora-waves-23">
          <div class="wave-23 wave-1" ref="wave1">
            <div class="wave-segment-23" v-for="n in 50" :key="n"
                 :style="getWaveSegmentStyle(n, 'wave1')"></div>
          </div>
          <div class="wave-23 wave-2" ref="wave2">
            <div class="wave-segment-23" v-for="n in 50" :key="n"
                 :style="getWaveSegmentStyle(n, 'wave2')"></div>
          </div>
          <div class="wave-23 wave-3" ref="wave3">
            <div class="wave-segment-23" v-for="n in 50" :key="n"
                 :style="getWaveSegmentStyle(n, 'wave3')"></div>
          </div>
        </div>

        <div class="aurora-landscape-23">
          <div class="mountain-23 mountain-1" ref="mountain1"></div>
          <div class="mountain-23 mountain-2" ref="mountain2"></div>
          <div class="mountain-23 mountain-3" ref="mountain3"></div>
        </div>

        <div class="aurora-reflection-23">
          <div class="reflection-wave-23 wave-ref-1"></div>
          <div class="reflection-wave-23 wave-ref-2"></div>
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

const auroraContainer = ref<HTMLElement | null>(null)
const wave1 = ref<HTMLElement | null>(null)
const wave2 = ref<HTMLElement | null>(null)
const wave3 = ref<HTMLElement | null>(null)
const mountain1 = ref<HTMLElement | null>(null)
const mountain2 = ref<HTMLElement | null>(null)
const mountain3 = ref<HTMLElement | null>(null)

const getStarStyle = (index: number) => {
  return {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 60}%`,
    animationDelay: `${Math.random() * 2}s`,
    animationDuration: `${1 + Math.random()}s`
  }
}

const getWaveSegmentStyle = (index: number, waveType: string) => {
  const delay = index * 0.05
  const hue1 = waveType === 'wave1' ? 120 : waveType === 'wave2' ? 180 : 280
  const hue2 = hue1 + 40
  return {
    animationDelay: `${delay}s`,
    background: `linear-gradient(180deg, hsl(${hue1}, 80%, 60%), hsl(${hue2}, 80%, 40%))`
  }
}

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 星星闪烁
    gsap.to('.star-23', {
      opacity: 0.2,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: 'none',
      stagger: 0.05
    })

    // 极光波浪动画
    gsap.to('.wave-23.wave-1', {
      x: '-10%',
      rotation: -5,
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })

    gsap.to('.wave-23.wave-2', {
      x: '10%',
      rotation: 5,
      duration: 10,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 0.5
    })

    gsap.to('.wave-23.wave-3', {
      x: '-5%',
      rotation: 3,
      duration: 12,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 1
    })

    // 波段脉动
    gsap.to('.wave-segment-23', {
      scaleY: 1.5,
      opacity: 0.7,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: 0.02
    })

    // 山脉入场
    gsap.from('.mountain-23', {
      y: 300,
      opacity: 0,
      duration: 1.5,
      stagger: 0.3,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.aurora-landscape-23',
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    })

    // 滚动时极光变化
    gsap.to('.aurora-waves-23', {
      y: 50,
      duration: 1,
      scrollTrigger: {
        trigger: '.aurora-container-23',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    })

    // 颜色变换
    gsap.to('.wave-segment-23', {
      filter: 'hue-rotate(60deg)',
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'none'
    })

    // 倒影动画
    gsap.to('.reflection-wave-23', {
      y: 20,
      opacity: 0.3,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })

    // 滚动时山脉移动
    gsap.to('.mountain-23.mountain-1', {
      x: -30,
      duration: 1,
      scrollTrigger: {
        trigger: '.aurora-container-23',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    })

    gsap.to('.mountain-23.mountain-2', {
      x: 20,
      duration: 1,
      scrollTrigger: {
        trigger: '.aurora-container-23',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    })

    gsap.to('.mountain-23.mountain-3', {
      x: -15,
      duration: 1,
      scrollTrigger: {
        trigger: '.aurora-container-23',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.aurora-section-23 {
  min-height: 100vh;
  padding: 60px 20px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, #0a0a1a 0%, #0a0a2a 40%, #0a1a2a 100%);

  opacity: 1 !important;}

.content-23 {
  text-align: center;

  opacity: 1 !important;}

.section-title-23 {
  font-size: clamp(2rem, 4vw, 2.5rem);
  font-weight: 800;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #4ade80, #22d3ee, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  opacity: 1 !important;}

.subtitle-23 {
  font-size: 1.1rem;
  color: #94a3b8;
  margin-bottom: 40px;

  opacity: 1 !important;}

.aurora-container-23 {
  position: relative;
  width: 100%;
  height: 600px;
  margin-top: 40px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 0 60px rgba(74, 222, 128, 0.2);

  opacity: 1 !important;}

.aurora-sky-23 {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, #0a0a1a 0%, #0a0a2a 60%, #0a1a2a 100%);

  opacity: 1 !important;}

.star-23 {
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
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

.aurora-waves-23 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 350px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  overflow: hidden;

  opacity: 1 !important;}

.wave-23 {
  display: flex;
  align-items: flex-end;
  height: 80px;
  gap: 4px;

  opacity: 1 !important;}

.wave-segment-23 {
  flex: 1;
  height: 60%;
  border-radius: 50% 50% 0 0;
  opacity: 0.8;
  filter: blur(8px);
  animation: wavePulse 2s ease-in-out infinite;
  transition: filter 3s ease;
}

@keyframes wavePulse {
  0%, 100% {
    height: 60%;
  }
  50% {
    height: 100%;
  }
}

.aurora-landscape-23 {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 300px;
  overflow: hidden;

  opacity: 1 !important;}

.mountain-23 {
  position: absolute;
  bottom: 0;
  border-radius: 50% 50% 0 0;
  background: linear-gradient(180deg, #1a1a3a, #0a0a2a);

  opacity: 1 !important;}

.mountain-1 {
  left: -10%;
  width: 60%;
  height: 250px;

  opacity: 1 !important;}

.mountain-2 {
  left: 40%;
  width: 70%;
  height: 280px;

  opacity: 1 !important;}

.mountain-3 {
  left: -20%;
  width: 50%;
  height: 200px;
  z-index: 1;

  opacity: 1 !important;}

.aurora-reflection-23 {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  overflow: hidden;
  pointer-events: none;

  opacity: 1 !important;}

.reflection-wave-23 {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  background: linear-gradient(180deg, transparent, rgba(74, 222, 128, 0.2));
  filter: blur(10px);
  animation: reflectionWave 2s ease-in-out infinite;

  opacity: 1 !important;}

@keyframes reflectionWave {
  0%, 100% {
    transform: translateY(0);
    opacity: 0.2;
  }
  50% {
    transform: translateY(20px);
    opacity: 0.4;
  }
}

@media (max-width: 768px) {
  .aurora-container-23 {
    height: 400px;
  
  opacity: 1 !important;}

  .aurora-waves-23 {
    height: 250px;
  
  opacity: 1 !important;}

  .wave-23 {
    height: 60px;
  
  opacity: 1 !important;}
}
</style>
