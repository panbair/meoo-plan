<template>
  <div class="olt-overlapping-timeline-section-56">
    <div class="olt-section-header-56">
      <h2 class="olt-title-56">OVERLAPPING</h2>
      <p class="olt-subtitle-56">重叠时间轴动画</p>
    </div>

    <div class="olt-overlapping-container-56">
      <div class="olt-overlap-card-56" v-for="(card, index) in cards" :key="index">
        <div class="olt-card-visual-56">
          <div class="olt-card-image-56" :style="{ backgroundImage: `url(${card.image})` }"></div>
          <div class="olt-card-badge-56">{{ index + 1 }}</div>
        </div>
        <div class="olt-card-text-56">
          <h3>{{ card.title }}</h3>
          <p>{{ card.description }}</p>
        </div>
      </div>
    </div>

    <div class="olt-timeline-controls-56">
      <button class="olt-control-btn-56" @click="playPhase(1)">阶段1</button>
      <button class="olt-control-btn-56" @click="playPhase(2)">阶段2</button>
      <button class="olt-control-btn-56" @click="playPhase(3)">阶段3</button>
      <button class="olt-control-btn-56 full-56" @click="playAll">全部播放</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const cards = ref([
  { image: new URL('@/assets/image/1.png', import.meta.url).href, title: 'Phase A-1', description: '第一阶段A' },
  { image: new URL('@/assets/image/2.png', import.meta.url).href, title: 'Phase A-2', description: '第一阶段B' },
  { image: new URL('@/assets/image/3.png', import.meta.url).href, title: 'Phase B-1', description: '第二阶段A' },
  { image: new URL('@/assets/image/4.png', import.meta.url).href, title: 'Phase B-2', description: '第二阶段B' },
  { image: new URL('@/assets/image/5.png', import.meta.url).href, title: 'Phase C-1', description: '第三阶段A' },
  { image: new URL('@/assets/image/6.png', import.meta.url).href, title: 'Phase C-2', description: '第三阶段B' }
])

let ctx: gsap.Context
let mainTimeline: gsap.core.Timeline | null = null
let phase1Timeline: gsap.core.Timeline | null = null
let phase2Timeline: gsap.core.Timeline | null = null
let phase3Timeline: gsap.core.Timeline | null = null

const createPhase1 = () => {
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } })

  // 第一阶段：卡片1和2
  tl.to('.olt-overlap-card-56:nth-child(1)', {
    scale: 1.1,
    rotation: 5,
    duration: 0.4
  })
  tl.to('.olt-overlap-card-56:nth-child(1) .olt-card-image-56', {
    scale: 1.2,
    duration: 0.3
  }, '<') // 同时执行

  tl.to('.olt-overlap-card-56:nth-child(2)', {
    scale: 1.1,
    rotation: -5,
    duration: 0.4
  }, '-=0.2') // 重叠0.2秒

  tl.to('.olt-overlap-card-56:nth-child(2) .olt-card-image-56', {
    scale: 1.2,
    duration: 0.3
  }, '<')
  
  return tl
}

const createPhase2 = () => {
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } })

  // 第二阶段：卡片3和4
  tl.to('.olt-overlap-card-56:nth-child(3)', {
    y: -20,
    scale: 1.1,
    duration: 0.4
  })
  tl.to('.olt-overlap-card-56:nth-child(3) .olt-card-image-56', {
    scale: 1.15,
    duration: 0.3
  }, '<')

  tl.to('.olt-overlap-card-56:nth-child(4)', {
    y: 20,
    scale: 1.1,
    duration: 0.4
  }, '-=0.2')

  tl.to('.olt-overlap-card-56:nth-child(4) .olt-card-image-56', {
    scale: 1.15,
    duration: 0.3
  }, '<')
  
  return tl
}

const createPhase3 = () => {
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } })

  // 第三阶段：卡片5和6
  tl.to('.olt-overlap-card-56:nth-child(5)', {
    rotation: 10,
    scale: 1.1,
    duration: 0.4
  })
  tl.to('.olt-overlap-card-56:nth-child(5) .olt-card-badge-56', {
    scale: 1.5,
    rotation: 45,
    duration: 0.3
  }, '<')

  tl.to('.olt-overlap-card-56:nth-child(6)', {
    rotation: -10,
    scale: 1.1,
    duration: 0.4
  }, '-=0.2')

  tl.to('.olt-overlap-card-56:nth-child(6) .olt-card-badge-56', {
    scale: 1.5,
    rotation: -45,
    duration: 0.3
  }, '<')
  
  return tl
}

const createMainTimeline = () => {
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } })

  // 主时间轴 - 包含所有阶段
  tl.from('.olt-title-56', {
    y: 60,
    opacity: 0,
    duration: 0.6
  })

  tl.from('.olt-subtitle-56', {
    y: 40,
    opacity: 0,
    duration: 0.5
  }, '-=0.3')

  // 卡片入场
  tl.from('.olt-overlap-card-56', {
    y: 100,
    opacity: 0,
    scale: 0.8,
    stagger: 0.1,
    duration: 0.6
  }, '-=0.2')

  tl.from('.olt-card-image-56', {
    scale: 1.5,
    opacity: 0,
    stagger: 0.1,
    duration: 0.5
  }, '-=0.4')

  tl.from('.olt-card-badge-56', {
    scale: 0,
    rotation: -180,
    stagger: 0.1,
    duration: 0.4,
    ease: 'back.out(1.7)'
  }, '-=0.5')

  tl.from('.olt-card-text-56', {
    x: -50,
    opacity: 0,
    stagger: 0.1,
    duration: 0.5
  }, '-=0.4')

  // 按钮动画
  tl.from('.olt-control-btn-56', {
    y: 30,
    opacity: 0,
    stagger: 0.08,
    duration: 0.5
  }, '-=0.2')

  return tl
}

const playPhase = (phase: number) => {
  switch(phase) {
    case 1:
      phase1Timeline?.restart()
      break
    case 2:
      phase2Timeline?.restart()
      break
    case 3:
      phase3Timeline?.restart()
      break
  }
}

const playAll = () => {
  mainTimeline?.restart()
  setTimeout(() => {
    phase1Timeline?.play()
    setTimeout(() => {
      phase2Timeline?.play()
      setTimeout(() => {
        phase3Timeline?.play()
      }, 800)
    }, 800)
  }, 1000)
}

const initAnimations = () => {
  ctx = gsap.context(() => {
    // 创建所有时间轴
    mainTimeline = createMainTimeline()
    phase1Timeline = createPhase1()
    phase2Timeline = createPhase2()
    phase3Timeline = createPhase3()

    // 滚动触发
    ScrollTrigger.create({
      trigger: '.olt-overlapping-timeline-section-56',
      start: 'top 70%',
      onEnter: () => {
        mainTimeline?.play()
        setTimeout(() => phase1Timeline?.play(), 1200)
        setTimeout(() => phase2Timeline?.play(), 2000)
        setTimeout(() => phase3Timeline?.play(), 2800)
      }
    })

    // 滚动视差
    gsap.to('.olt-card-image-56', {
      scrollTrigger: {
        trigger: '.olt-overlapping-container-56',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      },
      y: (i) => (i % 2 === 0 ? -20 : 20),
      ease: 'none'
    })

    // 悬停效果 - 使用gsap.context自动清理
    gsap.utils.toArray('.olt-overlap-card-56').forEach((card: Element) => {
      const cardEl = card as HTMLElement
      cardEl.addEventListener('mouseenter', () => {
        gsap.to(cardEl.querySelector('.olt-card-image-56'), {
          scale: 1.25,
          duration: 0.4,
          ease: 'power2.out'
        })
        gsap.to(cardEl.querySelector('.olt-card-badge-56'), {
          scale: 1.6,
          rotation: 90,
          duration: 0.3,
          ease: 'back.out(1.7)'
        })
      })

      cardEl.addEventListener('mouseleave', () => {
        gsap.to(cardEl.querySelector('.olt-card-image-56'), {
          scale: 1,
          duration: 0.4,
          ease: 'power2.out'
        })
        gsap.to(cardEl.querySelector('.olt-card-badge-56'), {
          scale: 1,
          rotation: 0,
          duration: 0.3,
          ease: 'power2.out'
        })
      })
    })
  })
}

onMounted(() => {
  initAnimations()
})

onUnmounted(() => {
  ctx?.revert()
  mainTimeline?.kill()
  phase1Timeline?.kill()
  phase2Timeline?.kill()
  phase3Timeline?.kill()
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
})
</script>

<style scoped>
/* GSAP opacity fix: ensure content is always visible */

.overlapping-timeline-section-56 {
  min-height: 100vh;
  padding: 80px 40px;
  background: linear-gradient(135deg, #0d1b2a 0%, #1b263b 50%, #415a77 100%);
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.olt-section-header-56 {
  text-align: center;
  margin-bottom: 80px;

  opacity: 1 !important;}

.olt-title-56 {
  font-size: 56px;
  font-weight: 900;
  color: #fff;
  letter-spacing: 6px;
  text-transform: uppercase;
  text-shadow: 0 0 30px rgba(65, 90, 119, 0.5);

  opacity: 1 !important;}

.olt-subtitle-56 {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 16px;
  letter-spacing: 3px;
  text-transform: uppercase;

  opacity: 1 !important;}

.olt-overlapping-container-56 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 32px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 0;

  opacity: 1 !important;}

.olt-overlap-card-56 {
  display: flex;
  gap: 20px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: box-shadow 0.4s ease;

  opacity: 1 !important;}

.olt-overlap-card-56:hover {
  box-shadow: 0 15px 40px rgba(65, 90, 119, 0.3);
}

.olt-card-visual-56 {
  position: relative;
  flex-shrink: 0;
  width: 140px;
  height: 140px;
  border-radius: 16px;
  overflow: hidden;

  opacity: 1 !important;}

.olt-card-image-56 {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transition: transform 0.4s ease;

  opacity: 1 !important;}

.olt-card-badge-56 {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 36px;
  height: 36px;
  background: rgba(65, 90, 119, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  border: 2px solid rgba(65, 90, 119, 0.5);
  transition: all 0.4s ease;

  opacity: 1 !important;}

.olt-card-text-56 {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
}

.olt-card-text-56 h3 {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 6px;
}

.olt-card-text-56 p {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
}

.olt-timeline-controls-56 {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 60px;
  flex-wrap: wrap;
}

.olt-control-btn-56 {
  padding: 14px 32px;
  border: none;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 2px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 2px solid rgba(255, 255, 255, 0.2);

  opacity: 1 !important;}

.olt-control-btn-56:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(65, 90, 119, 0.3);
}

.olt-control-btn.full-56 {
  background: linear-gradient(135deg, #415a77 0%, #778da9 100%);
  border-color: transparent;
  box-shadow: 0 10px 30px rgba(65, 90, 119, 0.3);

  opacity: 1 !important;}

.olt-control-btn.full-56:hover {
  box-shadow: 0 15px 40px rgba(65, 90, 119, 0.4);
}

@media (max-width: 768px) {
  .olt-title-56 {
    font-size: 32px;
    letter-spacing: 3px;
  
  opacity: 1 !important;}

  .olt-subtitle-56 {
    font-size: 14px;
  
  opacity: 1 !important;}

  .olt-overlap-card-56 {
    flex-direction: column;
    gap: 12px;
  }

  .olt-card-visual-56 {
    width: 100%;
    height: 180px;
  
  opacity: 1 !important;}
}
</style>
