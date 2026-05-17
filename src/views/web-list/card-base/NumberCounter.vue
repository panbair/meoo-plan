<template>
  <section ref="counterSection" class="section-8 counter-section-8">
    <h2 class="section-title-8">数字增长</h2>
    <div class="counter-container-8" ref="counterContainer">
      <div class="counter-item-8" v-for="(counter, index) in counters" :key="index">
        <div class="counter-value-8" :ref="el => { if(el) counterRefs[index] = el as HTMLElement }">0</div>
        <div class="counter-label-8">{{ counter.label }}</div>
        <div class="counter-unit-8">{{ counter.unit }}</div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const counterSection = ref<HTMLElement>()
const counterContainer = ref<HTMLElement>()
const counterRefs = ref<HTMLElement[]>([])

const counters = ref([
  { label: '用户', unit: '万', target: 1000 },
  { label: '动画', unit: '个', target: 500 },
  { label: '评分', unit: '分', target: 98 },
  { label: '增长', unit: '%', target: 250 }
])

onMounted(() => {
  setTimeout(() => {
    initAnimations()
  }, 100)
})

onUnmounted(() => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
  gsap.killTweensOf('*')
})

const initAnimations = () => {
  // 标题入场动画
  gsap.from('.section-title-8', {
    y: 150,
    opacity: 0,
    scale: 0.7,
    rotationX: -30,
    duration: 1.5,
    ease: 'back.out(1.7)',
    scrollTrigger: {
      trigger: counterSection.value,
      start: 'top 85%',
      toggleActions: 'play none none reverse'
    }
  })

  // 计数器容器入场动画
  const counterItems = gsap.utils.toArray('.counter-item-8')
  gsap.from(counterItems, {
    y: 200,
    opacity: 0,
    scale: 0.6,
    rotationY: 45,
    stagger: 0.15,
    duration: 1.3,
    ease: 'back.out(1.7)',
    scrollTrigger: {
      trigger: counterContainer.value,
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    }
  })

  // 标签入场
  gsap.from('.counter-label-8', {
    y: 30,
    opacity: 0,
    stagger: 0.15,
    duration: 0.8,
    delay: 0.5,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: counterContainer.value,
      start: 'top 75%',
      toggleActions: 'play none none reverse'
    }
  })

  // 单位入场
  gsap.from('.counter-unit-8', {
    scale: 0,
    opacity: 0,
    stagger: 0.15,
    duration: 0.6,
    delay: 0.7,
    ease: 'back.out(1.7)',
    scrollTrigger: {
      trigger: counterContainer.value,
      start: 'top 75%',
      toggleActions: 'play none none reverse'
    }
  })

  // 数字滚动动画
  counterRefs.value.forEach((counterEl, index) => {
    const counter = counters.value[index]
    gsap.to(counterEl,
      {
        innerText: counter.target,
        duration: 2.5,
        snap: { innerText: 1 },
        scrollTrigger: {
          trigger: counterSection.value,
          start: 'top 70%',
          end: 'top 20%',
          scrub: 1.5
        }
      }
    )
  })
}
</script>

<style scoped lang="scss">
.section-8 {
  min-height: 100vh;
  padding: 100px 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  opacity: 1 !important;}

.section-title-8 {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 60px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;

  opacity: 1 !important;}

.counter-section-8 {
  background: linear-gradient(180deg, transparent, rgba(139, 92, 246, 0.1), transparent);

  opacity: 1 !important;}

.counter-container-8 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  max-width: 1000px;
  width: 100%;

  opacity: 1 !important;}

.counter-item-8 {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-5px);
  
  opacity: 1 !important;}
}

.counter-value-8 {
  font-size: 3rem;
  font-weight: bold;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 10px;

  opacity: 1 !important;}

.counter-label-8 {
  font-size: 1rem;
  color: #94a3b8;
  margin-bottom: 5px;

  opacity: 1 !important;}

.counter-unit-8 {
  font-size: 1.5rem;
  color: #fff;

  opacity: 1 !important;}

@media (max-width: 768px) {
  .counter-container-8 {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  .counter-item-8 {
    padding: 30px;
  
  opacity: 1 !important;}

  .counter-value-8 {
    font-size: 2rem;
  
  opacity: 1 !important;}
}
</style>
