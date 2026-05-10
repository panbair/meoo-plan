<template>
  <div class="gradient-flow-145" ref="componentRoot">
    <div class="gf-container-145">
      <h2 class="gf-title-145">🌈 渐变流动</h2>
      <p class="gf-desc-145">滚动触发动态渐变流动效果</p>
      
      <div class="gf-stage-145">
        <div class="gf-layer-145 gf-layer-1-145"></div>
        <div class="gf-layer-145 gf-layer-2-145"></div>
        <div class="gf-layer-145 gf-layer-3-145"></div>
        <div class="gf-layer-145 gf-layer-4-145"></div>
        
        <div class="gf-content-145">
          <div class="gf-card-145">
            <h3 class="gf-card-title-145">流动之美</h3>
            <p class="gf-card-text-145">体验渐变流动的视觉盛宴</p>
          </div>
        </div>
      </div>
      
      <div class="gf-hint-145">滚动感受渐变流动</div>
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
    // 第1层渐变
    gsap.to('.gf-layer-1-145', {
      scrollTrigger: {
        trigger: '.gf-stage-145',
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1.5
      },
      transform: 'translateX(-50%) rotate(180deg)',
      opacity: 0.3,
      duration: 2,
      ease: 'none'
    })

    // 第2层渐变
    gsap.to('.gf-layer-2-145', {
      scrollTrigger: {
        trigger: '.gf-stage-145',
        start: 'top 70%',
        end: 'bottom 30%',
        scrub: 1.5
      },
      transform: 'translateX(50%) rotate(-180deg)',
      opacity: 0.4,
      duration: 2,
      ease: 'none'
    })

    // 第3层渐变
    gsap.to('.gf-layer-3-145', {
      scrollTrigger: {
        trigger: '.gf-stage-145',
        start: 'top 60%',
        end: 'bottom 40%',
        scrub: 1.5
      },
      transform: 'translateX(-30%) rotate(90deg)',
      opacity: 0.5,
      duration: 2,
      ease: 'none'
    })

    // 第4层渐变
    gsap.to('.gf-layer-4-145', {
      scrollTrigger: {
        trigger: '.gf-stage-145',
        start: 'top 50%',
        end: 'bottom 50%',
        scrub: 1.5
      },
      transform: 'translateX(30%) rotate(-90deg)',
      opacity: 0.6,
      duration: 2,
      ease: 'none'
    })

    // 卡片进入
    gsap.from('.gf-card-145', {
      scrollTrigger: {
        trigger: '.gf-stage-145',
        start: 'center center',
        end: 'bottom 30%',
        scrub: 1
      },
      y: 100,
      opacity: 0,
      scale: 0.8,
      duration: 1,
      ease: 'power2.out'
    })

    // 卡片标题动画
    gsap.from('.gf-card-title-145', {
      scrollTrigger: {
        trigger: '.gf-stage-145',
        start: 'bottom 50%',
        toggleActions: 'play none none reverse'
      },
      y: -30,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out'
    })

    // 卡片文字动画
    gsap.from('.gf-card-text-145', {
      scrollTrigger: {
        trigger: '.gf-stage-145',
        start: 'bottom 50%',
        toggleActions: 'play none none reverse'
      },
      y: 30,
      opacity: 0,
      duration: 0.6,
      delay: 0.2,
      ease: 'power3.out'
    })

    // 标题动画
    gsap.from('.gf-title-145', {
      scrollTrigger: {
        trigger: '.gf-container-145',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      y: -50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    })

    // 描述动画
    gsap.from('.gf-desc-145', {
      scrollTrigger: {
        trigger: '.gf-container-145',
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
    gsap.from('.gf-hint-145', {
      scrollTrigger: {
        trigger: '.gf-stage-145',
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

.gradient-flow-145 {
  width: 100%;
  min-height: 100vh;
  background: #000;
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;

  opacity: 1 !important;}

.gf-container-145 {
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  align-items: center;

  opacity: 1 !important;}

.gf-title-145 {
  font-size: clamp(2rem, 5vw, 3.5rem);
  color: #fff;
  margin-bottom: 10px;
  text-align: center;
  background: linear-gradient(90deg, #f093fb, #f5576c, #4facfe, #43e97b);
  background-size: 300% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gfGradientShift-145 3s ease infinite;

  opacity: 1 !important;}

@keyframes gfGradientShift-145 {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.gf-desc-145 {
  font-size: clamp(0.9rem, 2vw, 1.2rem);
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 40px;
  text-align: center;

  opacity: 1 !important;}

.gf-stage-145 {
  width: 100%;
  max-width: 700px;
  height: 600px;
  position: relative;
  background: #0a0a0a;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);

  opacity: 1 !important;}

.gf-layer-145 {
  position: absolute;
  width: 200%;
  height: 200%;
  top: -50%;
  left: -50%;
  opacity: 0.2;
  will-change: transform, opacity;
}

.gf-layer-1-145 {
  background: conic-gradient(from 0deg, #f093fb, #f5576c, #f093fb);
  animation: gfRotate-145 20s linear infinite;

  opacity: 1 !important;}

.gf-layer-2-145 {
  background: conic-gradient(from 90deg, #4facfe, #00f2fe, #4facfe);
  animation: gfRotate-145 25s linear infinite reverse;

  opacity: 1 !important;}

.gf-layer-3-145 {
  background: conic-gradient(from 180deg, #43e97b, #38f9d7, #43e97b);
  animation: gfRotate-145 30s linear infinite;

  opacity: 1 !important;}

.gf-layer-4-145 {
  background: conic-gradient(from 270deg, #fa709a, #fee140, #fa709a);
  animation: gfRotate-145 35s linear infinite reverse;

  opacity: 1 !important;}

@keyframes gfRotate-145 {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.gf-content-145 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;

  opacity: 1 !important;}

.gf-card-145 {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 40px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  text-align: center;

  opacity: 1 !important;}

.gf-card-title-145 {
  font-size: 2rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: 15px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);

  opacity: 1 !important;}

.gf-card-text-145 {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);

  opacity: 1 !important;}

.gf-hint-145 {
  margin-top: 30px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;

  opacity: 1 !important;}

@media (max-width: 768px) {
  .gf-stage-145 {
    height: 500px;
  
  opacity: 1 !important;}
  
  .gf-card-145 {
    padding: 30px;
  
  opacity: 1 !important;}
  
  .gf-card-title-145 {
    font-size: 1.5rem;
  
  opacity: 1 !important;}
  
  .gf-card-text-145 {
    font-size: 0.95rem;
  
  opacity: 1 !important;}
}
</style>
