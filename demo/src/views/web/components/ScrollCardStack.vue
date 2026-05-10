<template>
  <div class="card-stack-144" ref="componentRoot">
    <div class="cs-container-144">
      <h2 class="cs-title-144">🃏 卡片堆叠</h2>
      <p class="cs-desc-144">滚动展开卡片堆叠效果</p>
      
      <div class="cs-stage-144">
        <div 
          v-for="(card, index) in cards" 
          :key="index"
          class="cs-card-144"
          :style="{ '--index': index, '--total': cards.length }"
          @mouseenter="onCardHover(index)"
          @mouseleave="onCardLeave(index)"
        >
          <div class="cs-card-image-144">
            <img :src="card.image" :alt="card.title" />
          </div>
          <div class="cs-card-content-144">
            <div class="cs-card-title-144">{{ card.title }}</div>
            <div class="cs-card-text-144">{{ card.text }}</div>
          </div>
        </div>
      </div>
      
      <div class="cs-hint-144">滚动展开卡片</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const componentRoot = ref<HTMLElement>()

const cards = [
  {
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    title: '山峰之巅',
    text: '探索自然之美'
  },
  {
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400',
    title: '森林秘境',
    text: '发现神秘森林'
  },
  {
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
    title: '海洋之心',
    text: '感受海洋壮阔'
  },
  {
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400',
    title: '星空之下',
    text: '仰望璀璨星空'
  },
  {
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400',
    title: '日出朝霞',
    text: '迎接第一缕阳光'
  }
]

let ctx: any = null

const onCardHover = (index: number) => {
  gsap.to(`.cs-card-144:nth-child(${index + 1})`, {
    y: -20,
    scale: 1.05,
    duration: 0.3,
    ease: 'power2.out'
  })
}

const onCardLeave = (index: number) => {
  gsap.to(`.cs-card-144:nth-child(${index + 1})`, {
    y: 0,
    scale: 1,
    duration: 0.3,
    ease: 'power2.out'
  })
}

onMounted(() => {
  ctx = gsap.context(() => {
    // 初始状态 - 堆叠在一起
    cards.forEach((_, index) => {
      gsap.set(`.cs-card-144:nth-child(${index + 1})`, {
        y: index * 10,
        scale: 1 - (index * 0.05),
        zIndex: cards.length - index
      })
    })

    // 展开动画
    gsap.to('.cs-card-144', {
      scrollTrigger: {
        trigger: '.cs-stage-144',
        start: 'top 60%',
        end: 'bottom 40%',
        scrub: 1
      },
      y: (index) => index * 130,
      scale: 1,
      duration: 1,
      ease: 'power2.inOut',
      stagger: 0.1
    })

    // 卡片旋转效果
    gsap.to('.cs-card-144', {
      scrollTrigger: {
        trigger: '.cs-stage-144',
        start: 'top 50%',
        end: 'bottom 30%',
        scrub: 1
      },
      rotation: (index) => (index % 2 === 0 ? 3 : -3),
      duration: 1,
      ease: 'power1.inOut'
    })

    // 标题动画
    gsap.from('.cs-title-144', {
      scrollTrigger: {
        trigger: '.cs-container-144',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      y: -50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    })

    // 描述动画
    gsap.from('.cs-desc-144', {
      scrollTrigger: {
        trigger: '.cs-container-144',
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
    gsap.from('.cs-hint-144', {
      scrollTrigger: {
        trigger: '.cs-stage-144',
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

.card-stack-144 {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;

  opacity: 1 !important;}

.cs-container-144 {
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;

  opacity: 1 !important;}

.cs-title-144 {
  font-size: clamp(2rem, 5vw, 3.5rem);
  color: #2c3e50;
  margin-bottom: 10px;
  text-align: center;
  text-shadow: 0 2px 10px rgba(255, 255, 255, 0.5);

  opacity: 1 !important;}

.cs-desc-144 {
  font-size: clamp(0.9rem, 2vw, 1.2rem);
  color: rgba(44, 62, 80, 0.7);
  margin-bottom: 40px;
  text-align: center;

  opacity: 1 !important;}

.cs-stage-144 {
  width: 100%;
  position: relative;
  height: 800px;
  perspective: 1000px;

  opacity: 1 !important;}

.cs-card-144 {
  position: absolute;
  width: 100%;
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  will-change: transform;
  transition: box-shadow 0.3s ease;

  opacity: 1 !important;}

.cs-card-144:hover {
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.cs-card-image-144 {
  width: 100%;
  height: 200px;
  overflow: hidden;

  opacity: 1 !important;}

.cs-card-image-144 img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.cs-card-144:hover .cs-card-image-144 img {
  transform: scale(1.1);
}

.cs-card-content-144 {
  padding: 20px;

  opacity: 1 !important;}

.cs-card-title-144 {
  font-size: 1.3rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 8px;

  opacity: 1 !important;}

.cs-card-text-144 {
  font-size: 0.95rem;
  color: rgba(44, 62, 80, 0.7);

  opacity: 1 !important;}

.cs-hint-144 {
  margin-top: 30px;
  font-size: 0.9rem;
  color: rgba(44, 62, 80, 0.6);
  text-align: center;

  opacity: 1 !important;}

@media (max-width: 768px) {
  .cs-stage-144 {
    height: 700px;
  
  opacity: 1 !important;}
  
  .cs-card-image-144 {
    height: 150px;
  
  opacity: 1 !important;}
}
</style>
