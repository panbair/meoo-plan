<template>
  <div class="morph-path-141" ref="componentRoot">
    <div class="mp-container-141">
      <h2 class="mp-title-141">🌊 形状变换</h2>
      <p class="mp-desc-141">滚动触发SVG形状动态变换</p>
      
      <div class="mp-stage-141">
        <svg class="mp-svg-141" viewBox="0 0 600 400">
          <!-- 动态变换形状 -->
          <path 
            class="mp-path-141"
            d="M300,100 C350,100 400,150 400,200 C400,250 350,300 300,300 C250,300 200,250 200,200 C200,150 250,100 300,100"
            fill="url(#mpGradient1-141)"
            stroke="#f5576c"
            stroke-width="3"
          />
          
          <path 
            class="mp-path-2-141"
            d="M150,350 Q300,250 450,350 Q300,450 150,350"
            fill="url(#mpGradient2-141)"
            stroke="#f093fb"
            stroke-width="2"
            opacity="0.7"
          />
          
          <path 
            class="mp-path-3-141"
            d="M100,50 Q300,150 500,50 Q400,150 300,100 Q200,150 100,50"
            fill="url(#mpGradient3-141)"
            stroke="#4facfe"
            stroke-width="2"
            opacity="0.7"
          />
          
          <!-- 渐变定义 -->
          <defs>
            <linearGradient id="mpGradient1-141" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#f5576c;stop-opacity:0.8" />
              <stop offset="100%" style="stop-color:#f093fb;stop-opacity:0.8" />
            </linearGradient>
            <linearGradient id="mpGradient2-141" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#4facfe;stop-opacity:0.6" />
              <stop offset="100%" style="stop-color:#00f2fe;stop-opacity:0.6" />
            </linearGradient>
            <linearGradient id="mpGradient3-141" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#43e97b;stop-opacity:0.6" />
              <stop offset="100%" style="stop-color:#38f9d7;stop-opacity:0.6" />
            </linearGradient>
          </defs>
        </svg>
        
        <div class="mp-particles-141">
          <div v-for="i in 20" :key="i" class="mp-particle-141" :style="{ '--i': i }"></div>
        </div>
      </div>
      
      <div class="mp-hint-141">滚动观看形状变换</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const componentRoot = ref<HTMLElement>()

let ctx: any = null

onMounted(() => {
  ctx = gsap.context(() => {
    // 形状1变换
    gsap.to('.mp-path-141', {
      scrollTrigger: {
        trigger: '.mp-stage-141',
        start: 'top 60%',
        end: 'bottom 40%',
        scrub: 1.5
      },
      attr: {
        d: 'M300,80 Q450,150 500,200 Q450,250 300,320 Q150,250 100,200 Q150,150 300,80'
      },
      ease: 'power1.inOut'
    })

    // 形状2变换
    gsap.to('.mp-path-2-141', {
      scrollTrigger: {
        trigger: '.mp-stage-141',
        start: 'top 50%',
        end: 'bottom 50%',
        scrub: 1.5
      },
      attr: {
        d: 'M100,380 Q300,280 500,380 Q400,480 300,430 Q200,480 100,380'
      },
      rotation: 180,
      ease: 'power1.inOut'
    })

    // 形状3变换
    gsap.to('.mp-path-3-141', {
      scrollTrigger: {
        trigger: '.mp-stage-141',
        start: 'top 40%',
        end: 'bottom 60%',
        scrub: 1.5
      },
      attr: {
        d: 'M50,20 Q300,120 550,20 Q450,120 300,70 Q150,120 50,20'
      },
      scale: 1.2,
      ease: 'power1.inOut'
    })

    // 粒子动画
    gsap.fromTo('.mp-particle-141', 
      {
        scale: 0,
        opacity: 0
      },
      {
        scrollTrigger: {
          trigger: '.mp-stage-141',
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 1
        },
        scale: 1,
        opacity: 1,
        stagger: 0.1,
        ease: 'power2.out'
      }
    )

    // 标题动画
    gsap.from('.mp-title-141', {
      scrollTrigger: {
        trigger: '.mp-container-141',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      y: -50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    })

    // 描述动画
    gsap.from('.mp-desc-141', {
      scrollTrigger: {
        trigger: '.mp-container-141',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      delay: 0.2,
      ease: 'power3.out'
    })

    // 提示动画
    gsap.from('.mp-hint-141', {
      scrollTrigger: {
        trigger: '.mp-stage-141',
        start: 'bottom 20%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 20,
      duration: 0.6
    })
  }, componentRoot.value)
})

onUnmounted(() => {
  if (ctx) ctx.revert()
})
</script>

<style scoped>
/* GSAP opacity fix: ensure content is always visible */

.morph-path-141 {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;

  opacity: 1 !important;}

.mp-container-141 {
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  align-items: center;

  opacity: 1 !important;}

.mp-title-141 {
  font-size: clamp(2rem, 5vw, 3.5rem);
  color: #fff;
  margin-bottom: 10px;
  text-align: center;
  background: linear-gradient(90deg, #4facfe, #00f2fe);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  opacity: 1 !important;}

.mp-desc-141 {
  font-size: clamp(0.9rem, 2vw, 1.2rem);
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 40px;
  text-align: center;

  opacity: 1 !important;}

.mp-stage-141 {
  width: 100%;
  max-width: 700px;
  height: 500px;
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);

  opacity: 1 !important;}

.mp-svg-141 {
  width: 100%;
  height: 100%;
  will-change: transform;

  opacity: 1 !important;}

.mp-path-141,
.mp-path-2-141,
.mp-path-3-141 {
  will-change: d, transform;
  transition: filter 0.3s ease;
}

.mp-particles-141 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;

  opacity: 1 !important;}

.mp-particle-141 {
  position: absolute;
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  will-change: transform, opacity;

  opacity: 1 !important;}

.mp-particle-141:nth-child(1) { top: 10%; left: 10%; }
.mp-particle-141:nth-child(2) { top: 20%; left: 80%; }
.mp-particle-141:nth-child(3) { top: 30%; left: 30%; }
.mp-particle-141:nth-child(4) { top: 40%; left: 60%; }
.mp-particle-141:nth-child(5) { top: 50%; left: 20%; }
.mp-particle-141:nth-child(6) { top: 60%; left: 70%; }
.mp-particle-141:nth-child(7) { top: 70%; left: 40%; }
.mp-particle-141:nth-child(8) { top: 80%; left: 50%; }
.mp-particle-141:nth-child(9) { top: 15%; left: 50%; }
.mp-particle-141:nth-child(10) { top: 35%; left: 85%; }
.mp-particle-141:nth-child(11) { top: 45%; left: 15%; }
.mp-particle-141:nth-child(12) { top: 55%; left: 35%; }
.mp-particle-141:nth-child(13) { top: 65%; left: 65%; }
.mp-particle-141:nth-child(14) { top: 75%; left: 25%; }
.mp-particle-141:nth-child(15) { top: 85%; left: 55%; }
.mp-particle-141:nth-child(16) { top: 25%; left: 45%; }
.mp-particle-141:nth-child(17) { top: 5%; left: 75%; }
.mp-particle-141:nth-child(18) { top: 95%; left: 35%; }
.mp-particle-141:nth-child(19) { top: 50%; left: 90%; }
.mp-particle-141:nth-child(20) { top: 90%; left: 10%; }

.mp-hint-141 {
  margin-top: 30px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;

  opacity: 1 !important;}

@media (max-width: 768px) {
  .mp-stage-141 {
    height: 400px;
  
  opacity: 1 !important;}
  
  .mp-svg-141 {
    transform: scale(0.8);
  }
}
</style>
