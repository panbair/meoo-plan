<template>
  <div class="parallax-depth-174" ref="componentRoot">
    <div class="pd-container-174">
      <h2 class="pd-title-174">🌊 视差深度</h2>
      <p class="pd-desc-174">多层视差深度效果</p>
      
      <div class="pd-stage-174">
        <div class="pd-layer-174 pd-layer-back-174">
          <div class="pd-shape-174 pd-shape-back-1-174"></div>
          <div class="pd-shape-174 pd-shape-back-2-174"></div>
        </div>
        
        <div class="pd-layer-174 pd-layer-mid-174">
          <div class="pd-shape-174 pd-shape-mid-1-174"></div>
          <div class="pd-shape-174 pd-shape-mid-2-174"></div>
          <div class="pd-shape-174 pd-shape-mid-3-174"></div>
        </div>
        
        <div class="pd-layer-174 pd-layer-front-174">
          <div class="pd-shape-174 pd-shape-front-1-174"></div>
          <div class="pd-shape-174 pd-shape-front-2-174"></div>
          <div class="pd-shape-174 pd-shape-front-3-174"></div>
          <div class="pd-shape-174 pd-shape-front-4-174"></div>
        </div>
        
        <div class="pd-center-174">
          <div class="pd-circle-174"></div>
          <div class="pd-ring-174"></div>
        </div>
      </div>
      
      <div class="pd-hint-174">滚动体验视差深度效果</div>
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
    // 初始状态
    gsap.set('.pd-layer-174', { opacity: 0 })
    gsap.set('.pd-center-174', { scale: 0, opacity: 0 })

    // 背景层视差
    gsap.to('.pd-layer-back-174', {
      scrollTrigger: {
        trigger: '.pd-stage-174',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5
      },
      y: -100,
      rotation: -15,
      opacity: 1,
      ease: 'none'
    })

    // 中间层视差
    gsap.to('.pd-layer-mid-174', {
      scrollTrigger: {
        trigger: '.pd-stage-174',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      },
      y: -50,
      rotation: 10,
      opacity: 1,
      ease: 'none'
    })

    // 前景层视差
    gsap.to('.pd-layer-front-174', {
      scrollTrigger: {
        trigger: '.pd-stage-174',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.5
      },
      y: 50,
      rotation: -5,
      opacity: 1,
      ease: 'none'
    })

    // 中心圆环动画
    gsap.to('.pd-circle-174', {
      scrollTrigger: {
        trigger: '.pd-stage-174',
        start: 'top center',
        end: 'bottom center',
        scrub: 1
      },
      scale: 1,
      rotation: 180,
      opacity: 1,
      ease: 'power2.inOut'
    })

    gsap.to('.pd-ring-174', {
      scrollTrigger: {
        trigger: '.pd-stage-174',
        start: 'top center',
        end: 'bottom center',
        scrub: 1
      },
      scale: 1.5,
      rotation: -180,
      opacity: 1,
      ease: 'power2.inOut'
    })

    // 形状浮动动画
    gsap.utils.toArray<HTMLElement>('.pd-shape-174').forEach((shape, index) => {
      gsap.to(shape, {
        scrollTrigger: {
          trigger: '.pd-stage-174',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        },
        y: -30 + (index * 20),
        rotation: 30 + (index * 20),
        ease: 'none'
      })
    })

    // 标题动画
    gsap.from('.pd-title-174', {
      scrollTrigger: {
        trigger: '.pd-container-174',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      y: -50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    })

    // 描述动画
    gsap.from('.pd-desc-174', {
      scrollTrigger: {
        trigger: '.pd-container-174',
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
    gsap.from('.pd-hint-174', {
      scrollTrigger: {
        trigger: '.pd-stage-174',
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

.pd-container-174 {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;

  opacity: 1 !important;}

.pd-title-174 {
  font-size: clamp(2rem, 5vw, 3.5rem);
  color: #fff;
  margin-bottom: 10px;
  text-align: center;
  background: linear-gradient(90deg, #00d2ff, #3a7bd5, #00d2ff);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 3s linear infinite;

  opacity: 1 !important;}

@keyframes shimmer {
  to { background-position: 200% center; }
}

.pd-desc-174 {
  font-size: clamp(0.9rem, 2vw, 1.2rem);
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 40px;
  text-align: center;

  opacity: 1 !important;}

.pd-stage-174 {
  width: 100%;
  max-width: 900px;
  height: 700px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1000px;

  opacity: 1 !important;}

.pd-layer-174 {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  will-change: transform, opacity;

  opacity: 1 !important;}

.pd-shape-174 {
  position: absolute;
  border-radius: 20px;
  will-change: transform;
}

.pd-shape-back-1-174 {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, rgba(0, 210, 255, 0.3), rgba(58, 123, 213, 0.3));
  top: 15%;
  left: 20%;
  box-shadow: 0 10px 30px rgba(0, 210, 255, 0.2);

  opacity: 1 !important;}

.pd-shape-back-2-174 {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, rgba(255, 105, 180, 0.3), rgba(255, 20, 147, 0.3));
  bottom: 20%;
  right: 25%;
  box-shadow: 0 10px 30px rgba(255, 105, 180, 0.2);

  opacity: 1 !important;}

.pd-shape-mid-1-174 {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, rgba(0, 255, 136, 0.4), rgba(0, 200, 83, 0.4));
  top: 25%;
  right: 15%;
  box-shadow: 0 10px 30px rgba(0, 255, 136, 0.3);

  opacity: 1 !important;}

.pd-shape-mid-2-174 {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.4), rgba(255, 152, 0, 0.4));
  top: 55%;
  left: 15%;
  box-shadow: 0 10px 30px rgba(255, 193, 7, 0.3);

  opacity: 1 !important;}

.pd-shape-mid-3-174 {
  width: 90px;
  height: 90px;
  background: linear-gradient(135deg, rgba(156, 39, 176, 0.4), rgba(123, 31, 162, 0.4));
  bottom: 15%;
  left: 35%;
  box-shadow: 0 10px 30px rgba(156, 39, 176, 0.3);

  opacity: 1 !important;}

.pd-shape-front-1-174 {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, rgba(233, 30, 99, 0.5), rgba(194, 24, 91, 0.5));
  top: 40%;
  right: 10%;
  box-shadow: 0 10px 30px rgba(233, 30, 99, 0.4);

  opacity: 1 !important;}

.pd-shape-front-2-174 {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, rgba(0, 150, 136, 0.5), rgba(0, 121, 107, 0.5));
  top: 65%;
  right: 20%;
  box-shadow: 0 10px 30px rgba(0, 150, 136, 0.4);

  opacity: 1 !important;}

.pd-shape-front-3-174 {
  width: 55px;
  height: 55px;
  background: linear-gradient(135deg, rgba(255, 87, 34, 0.5), rgba(230, 81, 0, 0.5));
  top: 30%;
  left: 30%;
  box-shadow: 0 10px 30px rgba(255, 87, 34, 0.4);

  opacity: 1 !important;}

.pd-shape-front-4-174 {
  width: 65px;
  height: 65px;
  background: linear-gradient(135deg, rgba(63, 81, 181, 0.5), rgba(48, 63, 159, 0.5));
  bottom: 35%;
  right: 35%;
  box-shadow: 0 10px 30px rgba(63, 81, 181, 0.4);

  opacity: 1 !important;}

.pd-center-174 {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  will-change: transform, opacity;
}

.pd-circle-174 {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00d2ff, #3a7bd5);
  box-shadow: 
    0 0 60px rgba(0, 210, 255, 0.6),
    0 0 100px rgba(58, 123, 213, 0.4),
    inset 0 0 30px rgba(255, 255, 255, 0.3);
  will-change: transform;

  opacity: 1 !important;}

.pd-ring-174 {
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 3px solid rgba(0, 210, 255, 0.5);
  box-shadow: 0 0 40px rgba(0, 210, 255, 0.3);
  will-change: transform;

  opacity: 1 !important;}

.pd-hint-174 {
  margin-top: 30px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;

  opacity: 1 !important;}

@media (max-width: 768px) {
  .pd-stage-174 {
    height: 500px;
  
  opacity: 1 !important;}
  
  .pd-circle-174 {
    width: 100px;
    height: 100px;
  
  opacity: 1 !important;}
  
  .pd-ring-174 {
    width: 140px;
    height: 140px;
  
  opacity: 1 !important;}
  
  .pd-shape-174 {
    transform: scale(0.7);
  }
}
</style>
