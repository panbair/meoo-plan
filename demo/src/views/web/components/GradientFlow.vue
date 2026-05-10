<template>
  <div class="gradient-flow-39">
    <div class="container-39">
      <h2 class="section-title-39">渐变流动</h2>
      
      <div class="flow-container-39" ref="flowContainer">
        <div 
          class="flow-card-39" 
          v-for="(card, index) in cards" 
          :key="index"
          :style="{ background: card.gradient }"
          ref="items"
        >
          <div class="card-content-39">
            <span class="card-number-39">{{ String(index + 1).padStart(2, '0') }}</span>
            <h3 class="card-title-39">{{ card.title }}</h3>
            <p class="card-desc-39">{{ card.desc }}</p>
          </div>
          <div class="card-glow-39"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const items = ref<HTMLElement[]>([])
const flowContainer = ref<HTMLElement | null>(null)

interface Card {
  title: string
  desc: string
  gradient: string
}

const cards: Card[] = [
  { title: 'Sunrise', desc: '温暖橙红', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { title: 'Ocean', desc: '深邃蓝海', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { title: 'Forest', desc: '清新绿意', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
  { title: 'Sunset', desc: '金色黄昏', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
  { title: 'Galaxy', desc: '神秘紫罗兰', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { title: 'Aurora', desc: '极光幻彩', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }
]

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 标题动画 - 增强效果
    gsap.from('.section-title-39', {
      scrollTrigger: {
        trigger: '.section-title-39',
        start: 'top 85%'
      },
      y: 120,
      opacity: 0,
      scale: 0.6,
      rotationX: -30,
      duration: 1.5,
      ease: 'back.out(1.7)'
    })

    items.value.forEach((item, index) => {
      const content = item.querySelector('.card-content-39') as HTMLElement
      const number = item.querySelector('.card-number-39') as HTMLElement
      const title = item.querySelector('.card-title-39') as HTMLElement
      const desc = item.querySelector('.card-desc-39') as HTMLElement
      const glow = item.querySelector('.card-glow-39') as HTMLElement

      // 从左侧滑入 - 增强效果
      gsap.fromTo(item,
        { x: -350, opacity: 0, scale: 0.4, rotateY: 60 },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          rotateY: 0,
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            end: 'top 45%',
            toggleActions: 'play none none reverse'
          },
          duration: 1.5,
          ease: 'back.out(1.7)',
          delay: index * 0.15
        }
      )

      // 滚动时Y轴移动 - 增强效果
      gsap.fromTo(item,
        { y: 0 },
        {
          y: -50,
          scale: 1.03,
          scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1.5,
            toggleActions: 'play reverse play reverse'
          },
          ease: 'power1.inOut'
        }
      )

      // 内容淡入 - 增强效果
      gsap.fromTo(content,
        { opacity: 0, scale: 0.5, rotateX: 45 },
        {
          opacity: 1,
          scale: 1,
          rotateX: 0,
          scrollTrigger: {
            trigger: item,
            start: 'top 75%',
            end: 'top 35%',
            scrub: true
          }
        }
      )

      // 数字缩放旋转 - 增强效果
      gsap.fromTo(number,
        { scale: 0, rotate: -270, opacity: 0, y: 100 },
        {
          scale: 1,
          rotate: 0,
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: item,
            start: 'top 70%',
            end: 'top 30%',
            scrub: true
          }
        }
      )

      // 标题从右滑入 - 增强效果
      gsap.fromTo(title,
        { x: 60, opacity: 0, scale: 0.7 },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          scrollTrigger: {
            trigger: item,
            start: 'top 65%',
            end: 'top 25%',
            scrub: true
          }
        }
      )

      // 描述从下滑入 - 增强效果
      gsap.fromTo(desc,
        { y: 40, opacity: 0, scale: 0.8 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          scrollTrigger: {
            trigger: item,
            start: 'top 60%',
            end: 'top 20%',
            scrub: true
          }
        }
      )

      // 发光效果 - 增强效果
      gsap.fromTo(glow,
        { opacity: 0, scale: 0.3 },
        {
          opacity: 0.8,
          scale: 1.2,
          scrollTrigger: {
            trigger: item,
            start: 'top 60%',
            end: 'top 20%',
            scrub: true
          }
        }
      )
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.gradient-flow-39 {
  min-height: 100vh;
  padding: 100px 0;
  background: linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 30%, rgba(240, 147, 251, 0.1) 0%, transparent 40%),
      radial-gradient(circle at 80% 70%, rgba(79, 172, 254, 0.1) 0%, transparent 40%);
    pointer-events: none;
  
  opacity: 1 !important;}
}

.container-39 {
  width: 100%;
  max-width: 1400px;
  padding: 0 40px;
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.section-title-39 {
  text-align: center;
  font-size: 3.5rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 100px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #4facfe 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 40px rgba(240, 147, 251, 0.5);
  
  &::after {
    content: '';
    display: block;
    width: 100px;
    height: 4px;
    background: linear-gradient(90deg, #f093fb, #f5576c, #4facfe);
    margin: 20px auto 0;
    border-radius: 2px;
  
  opacity: 1 !important;}
}

.flow-container-39 {
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 40px 0;
  perspective: 1000px;

  opacity: 1 !important;}

.flow-card-39 {
  position: relative;
  padding: 50px 40px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  transition: transform 0.4s ease, box-shadow 0.4s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.4);
  
  opacity: 1 !important;}
}

.card-glow-39 {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
  pointer-events: none;
  transition: opacity 0.3s ease;

  opacity: 1 !important;}

.card-content-39 {
  position: relative;
  z-index: 1;
}

.card-number-39 {
  display: block;
  font-size: 5rem;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.3);
  margin-bottom: -30px;
  font-family: 'Arial', sans-serif;

  opacity: 1 !important;}

.card-title-39 {
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 10px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);

  opacity: 1 !important;}

.card-desc-39 {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-weight: 500;

  opacity: 1 !important;}

@media (max-width: 768px) {
  .card-number-39 {
    font-size: 3.5rem;
  
  opacity: 1 !important;}
  
  .card-title-39 {
    font-size: 1.5rem;
  
  opacity: 1 !important;}
  
  .flow-card-39 {
    padding: 35px 25px;
  
  opacity: 1 !important;}
  
  .section-title-39 {
    font-size: 2rem;
  
  opacity: 1 !important;}
}
</style>
