<template>
  <section ref="timelineSection" class="section-3 tl-timeline-section-3">
    <h2 class="tl-section-title-3">时间轴</h2>
    <div class="tl-timeline-container-3" ref="timelineContainer">
      <div class="tl-timeline-line-3" ref="timelineLine"></div>
      <div
        v-for="(event, index) in timelineEvents"
        :key="index"
        class="tl-timeline-item-3"
        :ref="el => { if(el) timelineItemRefs[index] = el as HTMLElement }"
      >
        <div class="tl-timeline-dot-3" ref="timelineDot"></div>
        <div class="tl-timeline-content-3">
          <div class="tl-timeline-year-3">{{ event.year }}</div>
          <h3 class="tl-timeline-title-3">{{ event.title }}</h3>
          <p class="tl-timeline-desc-3">{{ event.desc }}</p>
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

const timelineSection = ref<HTMLElement>()
const timelineContainer = ref<HTMLElement>()
const timelineLine = ref<HTMLElement>()
const timelineDot = ref<HTMLElement>()
const timelineItemRefs = ref<HTMLElement[]>([])

const timelineEvents = ref([
  { year: '2012', title: 'GSAP 诞生', desc: 'GreenSock Animation Platform 正式发布，开启了Web动画的新纪元' },
  { year: '2015', title: 'Timeline 引入', desc: '引入时间轴概念，让复杂的序列动画变得简单易用' },
  { year: '2018', title: 'ScrollTrigger', desc: '滚动触发插件发布，将滚动交互提升到新的高度' },
  { year: '2020', title: 'GSAP 3.0', desc: '完全重构的GSAP 3.0发布，性能提升，API更加简洁' },
  { year: '2024', title: 'AI 助手', desc: 'AI驱动的智能动画系统开始兴起，预示着动画的未来' },
  { year: '2026', title: '量子时代', desc: '量子计算时代的动画技术，突破性能极限，创造无限可能' }
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
  if (!timelineContainer.value) return

  if (timelineLine.value) {
    gsap.fromTo(timelineLine.value,
      {
        scaleY: 0,
        transformOrigin: 'top center'
      },
      {
        scaleY: 1,
        duration: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: timelineSection.value,
          start: 'top 60%',
          end: 'bottom 60%',
          scrub: 1
        }
      }
    )
  }

  timelineItemRefs.value.forEach((item, index) => {
    gsap.fromTo(item,
      {
        x: index % 2 === 0 ? -100 : 100,
        opacity: 0
      },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 80%',
          end: 'top 20%',
          toggleActions: 'play none none reverse'
        }
      }
    )
  })

  const dots = timelineItemRefs.value.map(item => item.querySelector('.tl-timeline-dot-3'))
  dots.forEach((dot, index) => {
    if (dot) {
      gsap.fromTo(dot as HTMLElement,
        {
          scale: 0,
          opacity: 0
        },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: 'back.out(2)',
          scrollTrigger: {
            trigger: timelineItemRefs.value[index],
            start: 'top 70%',
            end: 'top 30%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    }
  })
}
</script>

<style scoped lang="scss">
.section-3 {
  min-height: 100vh;
  padding: 100px 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  opacity: 1 !important;}

.tl-section-title-3 {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 60px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;

  opacity: 1 !important;}

.tl-timeline-section-3 {
  background: linear-gradient(180deg, transparent, rgba(236, 72, 153, 0.1), transparent);

  opacity: 1 !important;}

.tl-timeline-container-3 {
  position: relative;
  max-width: 1000px;
  width: 100%;
  padding: 40px;

  opacity: 1 !important;}

.tl-timeline-line-3 {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(to bottom, transparent, rgba(167, 139, 250, 0.5), transparent);
  transform: translateX(-50%);
  transform-origin: top center;

  opacity: 1 !important;}

.tl-timeline-item-3 {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 80px;
  padding: 0 50%;
  opacity: 0;

  &:nth-child(odd) {
    justify-content: flex-start;
    padding: 0 50% 0 0;
    padding-left: 0;

    .tl-timeline-content-3 {
      text-align: right;
    }
  }

  &:nth-child(even) {
    justify-content: flex-end;
    padding: 0 0 0 50%;

    .tl-timeline-content-3 {
      text-align: left;
    
  opacity: 1 !important;}
  }
}

.tl-timeline-dot-3 {
  position: absolute;
  left: 50%;
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  transform: translateX(-50%);
  box-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
  z-index: 1;

  opacity: 1 !important;}

.tl-timeline-content-3 {
  max-width: 400px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  backdrop-filter: blur(10px);

  opacity: 1 !important;}

.tl-timeline-year-3 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 10px;

  opacity: 1 !important;}

.tl-timeline-title-3 {
  font-size: 1.2rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: 8px;

  opacity: 1 !important;}

.tl-timeline-desc-3 {
  font-size: 0.9rem;
  color: #94a3b8;
  line-height: 1.6;

  opacity: 1 !important;}

@media (max-width: 768px) {
  .tl-timeline-line-3 {
    left: 20px;
  }

  .tl-timeline-item-3 {
    padding: 0 0 0 50px !important;
    justify-content: flex-start !important;

    .tl-timeline-content-3 {
      text-align: left !important;
    
  opacity: 1 !important;}
  }

  .tl-timeline-dot-3 {
    left: 20px;
  }
}
</style>
