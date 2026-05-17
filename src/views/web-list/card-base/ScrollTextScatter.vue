<template>
  <div class="text-scatter-143" ref="componentRoot">
    <div class="ts-container-143">
      <h2 class="ts-title-143">✨ 文字散射</h2>
      <p class="ts-desc-143">滚动触发文字爆炸散开再重组</p>
      
      <div class="ts-stage-143">
        <div class="ts-text-wrapper-143" ref="textWrapper">
          <div class="ts-char-143" v-for="(char, index) in text" :key="index">
            {{ char }}
          </div>
        </div>
        
        <div class="ts-glow-143"></div>
      </div>
      
      <div class="ts-hint-143">滚动触发文字爆炸效果</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const componentRoot = ref<HTMLElement>()
const textWrapper = ref<HTMLElement>()

const text = 'SCROLL TO EXPLODE'

let ctx: any = null

onMounted(() => {
  ctx = gsap.context(() => {
    // 初始状态
    gsap.set('.ts-char-143', {
      transformOrigin: 'center center'
    })

    // 字符爆炸效果
    gsap.to('.ts-char-143', {
      scrollTrigger: {
        trigger: '.ts-stage-143',
        start: 'top 60%',
        end: 'center center',
        scrub: 1
      },
      x: () => gsap.utils.random(-200, 200),
      y: () => gsap.utils.random(-150, 150),
      rotation: () => gsap.utils.random(-360, 360),
      scale: () => gsap.utils.random(0.5, 2),
      opacity: 0.8,
      duration: 1,
      ease: 'power2.inOut',
      stagger: {
        each: 0.02,
        from: 'center'
      }
    })

    // 重组效果
    gsap.to('.ts-char-143', {
      scrollTrigger: {
        trigger: '.ts-stage-143',
        start: 'center center',
        end: 'bottom 20%',
        scrub: 1
      },
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      opacity: 1,
      duration: 1,
      ease: 'power2.inOut',
      stagger: {
        each: 0.02,
        from: 'center'
      }
    })

    // 发光效果
    gsap.to('.ts-glow-143', {
      scrollTrigger: {
        trigger: '.ts-stage-143',
        start: 'top 60%',
        end: 'bottom 40%',
        scrub: 1
      },
      scale: 3,
      opacity: 0,
      duration: 1
    })

    // 标题动画
    gsap.from('.ts-title-143', {
      scrollTrigger: {
        trigger: '.ts-container-143',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      y: -50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    })

    // 描述动画
    gsap.from('.ts-desc-143', {
      scrollTrigger: {
        trigger: '.ts-container-143',
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
    gsap.from('.ts-hint-143', {
      scrollTrigger: {
        trigger: '.ts-stage-143',
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

.text-scatter-143 {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;

  opacity: 1 !important;}

.ts-container-143 {
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  align-items: center;

  opacity: 1 !important;}

.ts-title-143 {
  font-size: clamp(2rem, 5vw, 3.5rem);
  color: #fff;
  margin-bottom: 10px;
  text-align: center;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);

  opacity: 1 !important;}

.ts-desc-143 {
  font-size: clamp(0.9rem, 2vw, 1.2rem);
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 60px;
  text-align: center;

  opacity: 1 !important;}

.ts-stage-143 {
  width: 100%;
  max-width: 700px;
  height: 500px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.3);
  overflow: hidden;

  opacity: 1 !important;}

.ts-text-wrapper-143 {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px;
  z-index: 10;
}

.ts-char-143 {
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: bold;
  color: #fff;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  will-change: transform, opacity;
  display: inline-block;
  padding: 2px;

  opacity: 1 !important;}

.ts-glow-143 {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 70%);
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 5;

  opacity: 1 !important;}

.ts-hint-143 {
  margin-top: 30px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;

  opacity: 1 !important;}

@media (max-width: 768px) {
  .ts-stage-143 {
    height: 400px;
  
  opacity: 1 !important;}
  
  .ts-char-143 {
    font-size: clamp(1.5rem, 3vw, 2rem);
  
  opacity: 1 !important;}
}
</style>
