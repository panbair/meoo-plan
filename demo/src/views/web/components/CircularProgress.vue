<template>
  <section ref="circleSection" class="section-10 circle-section-10">
    <h2 class="section-title-10">圆形进度</h2>
    <div class="circle-container-10" ref="circleContainer">
      <div class="circle-item-10" v-for="(circle, index) in circles" :key="index">
        <svg class="circle-svg-10" viewBox="0 0 200 200">
          <circle
            class="circle-bg-10"
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            stroke-width="10"
          />
          <circle
            :ref="el => { if(el) circleRefs[index] = el as HTMLElement }"
            class="circle-progress-10"
            cx="100"
            cy="100"
            r="90"
            fill="none"
            :stroke="circle.color"
            stroke-width="10"
            stroke-linecap="round"
            stroke-dasharray="565.48"
            stroke-dashoffset="565.48"
            transform="rotate(-90 100 100)"
          />
        </svg>
        <div class="circle-label-10">{{ circle.label }}</div>
        <div class="circle-value-10" :ref="el => { if(el) circleValueRefs[index] = el as HTMLElement }">0%</div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const circleSection = ref<HTMLElement>()
const circleContainer = ref<HTMLElement>()
const circleRefs = ref<HTMLElement[]>([])
const circleValueRefs = ref<HTMLElement[]>([])

const circles = ref([
  { label: '性能', color: '#667eea', target: 95 },
  { label: '体验', color: '#f093fb', target: 88 },
  { label: '创新', color: '#4facfe', target: 92 },
  { label: '满意', color: '#43e97b', target: 96 }
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
  gsap.from('.section-title-10', {
    y: 150,
    opacity: 0,
    scale: 0.7,
    rotationX: -30,
    duration: 1.5,
    ease: 'back.out(1.7)',
    scrollTrigger: {
      trigger: circleSection.value,
      start: 'top 85%',
      toggleActions: 'play none none reverse'
    }
  })

  // 圆形容器入场动画
  const circleItems = gsap.utils.toArray('.circle-item-10')
  gsap.from(circleItems, {
    y: 200,
    opacity: 0,
    scale: 0.5,
    rotationZ: 180,
    stagger: 0.15,
    duration: 1.3,
    ease: 'back.out(1.7)',
    scrollTrigger: {
      trigger: circleContainer.value,
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    }
  })

  // SVG入场
  gsap.from('.circle-svg-10', {
    scale: 0,
    opacity: 0,
    stagger: 0.15,
    duration: 0.8,
    delay: 0.3,
    ease: 'back.out(1.7)',
    scrollTrigger: {
      trigger: circleContainer.value,
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    }
  })

  // 标签入场
  gsap.from('.circle-label-10', {
    y: 30,
    opacity: 0,
    stagger: 0.15,
    duration: 0.8,
    delay: 0.5,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: circleContainer.value,
      start: 'top 75%',
      toggleActions: 'play none none reverse'
    }
  })

  // 圆形进度条和数值动画
  circleRefs.value.forEach((circleEl, index) => {
    const circle = circles.value[index]
    const valueRef = circleValueRefs.value[index]

    gsap.to(circleEl,
      {
        strokeDashoffset: 565.48 - (565.48 * circle.target / 100),
        duration: 2.5,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: circleSection.value,
          start: 'top 70%',
          end: 'top 20%',
          scrub: 1.5
        }
      }
    )

    if (valueRef) {
      gsap.to(valueRef,
        {
          innerText: circle.target,
          duration: 2.5,
          snap: { innerText: 1 },
          scrollTrigger: {
            trigger: circleSection.value,
            start: 'top 70%',
            end: 'top 20%',
            scrub: 1.5
          }
        }
      )
    }
  })
}
</script>

<style scoped lang="scss">
.section-10 {
  min-height: 100vh;
  padding: 100px 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  opacity: 1 !important;}

.section-title-10 {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 60px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;

  opacity: 1 !important;}

.circle-section-10 {
  background: linear-gradient(180deg, transparent, rgba(236, 72, 153, 0.1), transparent);

  opacity: 1 !important;}

.circle-container-10 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  max-width: 1000px;
  width: 100%;

  opacity: 1 !important;}

.circle-item-10 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.circle-svg-10 {
  width: 150px;
  height: 150px;
  transform: rotate(-90deg);

  opacity: 1 !important;}

.circle-progress-10 {
  transition: stroke-dashoffset 0.3s;
}

.circle-label-10 {
  font-size: 1rem;
  color: #94a3b8;

  opacity: 1 !important;}

.circle-value-10 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;

  opacity: 1 !important;}

@media (max-width: 768px) {
  .circle-container-10 {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  .circle-svg-10 {
    width: 120px;
    height: 120px;
  
  opacity: 1 !important;}
}
</style>
