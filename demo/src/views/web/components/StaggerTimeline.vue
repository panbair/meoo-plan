<template>
  <div class="stagger-timeline-44">
    <div class="stl-container-44">
      <h2 class="stl-section-title-44">错开时间轴</h2>

      <div class="stl-timeline-container-44">
        <div
          class="stl-timeline-item-44"
          v-for="(item, index) in timelineItems"
          :key="index"
          :class="{ 'stl-left-44': index % 2 === 0, 'stl-right-44': index % 2 === 1 }"
          ref="items"
        >
          <div class="stl-timeline-dot-44"></div>
          <div class="stl-timeline-content-44">
            <div class="stl-content-inner-44">
              <img :src="item.image" :alt="item.title" />
              <div class="stl-content-info-44">
                <span class="stl-content-year-44">{{ item.year }}</span>
                <h3 class="stl-content-title-44">{{ item.title }}</h3>
                <p class="stl-content-desc-44">{{ item.desc }}</p>
              </div>
            </div>
          </div>
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

interface TimelineItem {
  year: string
  title: string
  desc: string
  image: string
}

const timelineItems: TimelineItem[] = [
  { year: '2020', title: '起源', desc: '一切的开始', image: new URL('@/assets/image/1.png', import.meta.url).href },
  { year: '2021', title: '探索', desc: '不断前行', image: new URL('@/assets/image/2.png', import.meta.url).href },
  { year: '2022', title: '突破', desc: '重大进展', image: new URL('@/assets/image/3.png', import.meta.url).href },
  { year: '2023', title: '创新', desc: '引领未来', image: new URL('@/assets/image/4.png', import.meta.url).href },
  { year: '2024', title: '飞跃', desc: '质的提升', image: new URL('@/assets/image/5.png', import.meta.url).href },
  { year: '2025', title: '巅峰', desc: '达到顶峰', image: new URL('@/assets/image/6.png', import.meta.url).href }
]

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 标题动画
    gsap.from('.stl-section-title-44', {
      scrollTrigger: {
        trigger: '.stl-section-title-44',
        start: 'top 90%'
      },
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    })

    // 时间轴入场 - 错开动画
    gsap.from(items.value, {
      scrollTrigger: {
        trigger: '.stl-timeline-container-44',
        start: 'top 80%'
      },
      y: 100,
      opacity: 0,
      scale: 0.8,
      duration: 1.2,
      stagger: 0.25,
      ease: 'back.out(1.2)'
    })

    // 时间轴点动画 - 错开
    gsap.from('.stl-timeline-dot-44', {
      scrollTrigger: {
        trigger: '.stl-timeline-container-44',
        start: 'top 85%'
      },
      scale: 0,
      duration: 0.6,
      stagger: 0.25,
      ease: 'back.out(2)'
    })

    items.value.forEach((item, index) => {
      const content = item.querySelector('.stl-content-inner-44') as HTMLElement
      const img = item.querySelector('img') as HTMLElement
      const info = item.querySelector('.stl-content-info-44') as HTMLElement
      const year = item.querySelector('.stl-content-year-44') as HTMLElement
      const title = item.querySelector('.stl-content-title-44') as HTMLElement
      const desc = item.querySelector('.stl-content-desc-44') as HTMLElement

      // 内容错开入场
      gsap.fromTo(content,
        { rotateY: index % 2 === 0 ? 20 : -20 },
        {
          rotateY: 0,
          scrollTrigger: {
            trigger: item,
            start: 'top 75%',
            end: 'top 35%',
            scrub: true
          },
          ease: 'power2.out'
        }
      )

      // 图片错开缩放
      gsap.fromTo(img,
        { scale: 1.3, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          scrollTrigger: {
            trigger: item,
            start: 'top 70%',
            end: 'top 30%',
            scrub: true
          },
          ease: 'power2.out'
        }
      )

      // 信息区错开滑入
      gsap.fromTo(info,
        { x: index % 2 === 0 ? -30 : 30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: item,
            start: 'top 65%',
            end: 'top 25%',
            scrub: true
          }
        }
      )

      // 年份错放缩放
      gsap.fromTo(year,
        { scale: 0, rotate: -180 },
        {
          scale: 1,
          rotate: 0,
          scrollTrigger: {
            trigger: item,
            start: 'top 60%',
            end: 'top 20%',
            scrub: true
          },
          ease: 'back.out(1.5)'
        }
      )

      // 标题错开滑入
      gsap.fromTo(title,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: item,
            start: 'top 55%',
            end: 'top 15%',
            scrub: true
          }
        }
      )

      // 描述错开淡入
      gsap.fromTo(desc,
        { y: 15, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: item,
            start: 'top 50%',
            end: 'top 10%',
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
.stagger-timeline-44 {
  min-height: 100vh;
  padding: 100px 0;
  background: linear-gradient(180deg, #0f0f23 0%, #1a1a3e 50%, #0f0f23 100%);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 100%;
    background: linear-gradient(180deg, transparent 0%, #667eea 10%, #f093fb 90%, transparent 100%);
    pointer-events: none;
  
  opacity: 1 !important;}
}

.stl-container-44 {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.stl-section-title-44 {
  text-align: center;
  font-size: 3.5rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 120px;
  background: linear-gradient(135deg, #667eea 0%, #f093fb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 40px rgba(102, 126, 234, 0.5);

  &::after {
    content: '';
    display: block;
    width: 100px;
    height: 4px;
    background: linear-gradient(90deg, #667eea, #f093fb);
    margin: 20px auto 0;
    border-radius: 2px;
  
  opacity: 1 !important;}
}

.stl-timeline-container-44 {
  position: relative;
  padding: 40px 0;

  opacity: 1 !important;}

.stl-timeline-item-44 {
  position: relative;
  margin-bottom: 80px;
  display: flex;
  align-items: center;

  &.stl-left-44 {
    justify-content: flex-start;
    padding-right: 50%;
  }

  &.stl-right-44 {
    justify-content: flex-end;
    padding-left: 50%;
  }

  &:last-child {
    margin-bottom: 0;
  }
}

.stl-timeline-dot-44 {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #667eea 0%, #f093fb 100%);
  border-radius: 50%;
  box-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
  z-index: 2;

  opacity: 1 !important;}

.stl-timeline-content-44 {
  width: 45%;
  padding: 0 40px;

  opacity: 1 !important;}

.stl-content-inner-44 {
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  transition: transform 0.4s ease;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 30px 70px rgba(0, 0, 0, 0.4);
  
  opacity: 1 !important;}
}

.stl-content-inner-44 img {
  width: 100%;
  height: 250px;
  object-fit: cover;
}

.stl-content-info-44 {
  padding: 25px;

  opacity: 1 !important;}

.stl-content-year-44 {
  display: block;
  font-size: 2.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #667eea 0%, #f093fb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: -10px;
  font-family: 'Arial', sans-serif;

  opacity: 1 !important;}

.stl-content-title-44 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 10px;

  opacity: 1 !important;}

.stl-content-desc-44 {
  font-size: 1rem;
  color: #666;
  margin: 0;

  opacity: 1 !important;}

@media (max-width: 768px) {
  .stl-timeline-item-44 {
    &.stl-left-44,
    &.stl-right-44 {
      padding-left: 0;
      padding-right: 0;
      justify-content: flex-start;
    }
  }

  .stl-timeline-content-44 {
    width: 100%;
    padding-left: 50px;
  
  opacity: 1 !important;}

  .stl-section-title-44 {
    font-size: 2rem;
  
  opacity: 1 !important;}
}
</style>
