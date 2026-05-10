<template>
  <div class="nt-nested-timeline-section-57">
    <div class="nt-section-header-57">
      <h2 class="nt-title-57">NESTED TIMELINE</h2>
      <p class="nt-subtitle-57">嵌套时间轴动画</p>
    </div>

    <div class="nt-nested-container-57">
      <div class="nt-nested-card-57" v-for="(card, index) in cards" :key="index" :class="`nt-card-${index}`">
        <div class="nt-card-wrapper-57">
          <div class="nt-card-inner-57">
            <div class="nt-card-bg-57" :style="{ backgroundImage: `url(${card.image})` }"></div>
            <div class="nt-card-overlay-57">
              <div class="nt-card-number-57">{{ String(index + 1).padStart(2, '0') }}</div>
              <div class="nt-card-content-57">
                <h3>{{ card.title }}</h3>
                <p>{{ card.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="nt-nested-controls-57">
      <button class="nt-play-all-57" @click="playAllNested">播放全部</button>
      <button class="nt-play-random-57" @click="playRandom">随机播放</button>
      <button class="nt-reset-all-57" @click="resetAll">重置</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const cards = ref([
  { image: new URL('@/assets/image/1.png', import.meta.url).href, title: 'Nested One', description: '嵌套动画1' },
  { image: new URL('@/assets/image/2.png', import.meta.url).href, title: 'Nested Two', description: '嵌套动画2' },
  { image: new URL('@/assets/image/3.png', import.meta.url).href, title: 'Nested Three', description: '嵌套动画3' },
  { image: new URL('@/assets/image/4.png', import.meta.url).href, title: 'Nested Four', description: '嵌套动画4' },
  { image: new URL('@/assets/image/5.png', import.meta.url).href, title: 'Nested Five', description: '嵌套动画5' },
  { image: new URL('@/assets/image/6.png', import.meta.url).href, title: 'Nested Six', description: '嵌套动画6' }
])

let ctx: gsap.Context
let masterTimeline: gsap.core.Timeline | null = null
let nestedTimelines: gsap.core.Timeline[] = []

const createNestedTimeline = (index: number) => {
  const tl = gsap.timeline({ paused: true })

  const cards = gsap.utils.toArray(`.nt-nested-card-57.nt-card-${index}`)
  if (!cards.length) return tl

  const card = cards[0] as HTMLElement
  const bg = card.querySelector('.nt-card-bg-57')
  const number = card.querySelector('.nt-card-number-57')
  const content = card.querySelector('.nt-card-content-57')

  // 嵌套时间轴1：背景动画
  if (bg) {
    const bgTl = gsap.timeline()
    bgTl.to(bg, {
      scale: 1.2,
      rotation: 5,
      duration: 0.4,
      ease: 'power2.out'
    })
    tl.add(bgTl)
  }

  // 嵌套时间轴2：数字动画
  if (number) {
    const numTl = gsap.timeline()
    numTl.to(number, {
      scale: 1.5,
      rotation: 45,
      duration: 0.3,
      ease: 'back.out(1.7)'
    })
    tl.add(numTl, '-=0.2')
  }

  // 嵌套时间轴3：内容动画
  if (content) {
    const contentTl = gsap.timeline()
    contentTl.to(content, {
      y: -10,
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out'
    })
    tl.add(contentTl, '-=0.2')
  }

  // 反向动画
  if (bg) {
    tl.to(bg, {
      scale: 1,
      rotation: 0,
      duration: 0.4,
      ease: 'power2.in'
    })
  }
  if (number) {
    tl.to(number, {
      scale: 1,
      rotation: 0,
      duration: 0.3,
      ease: 'power2.in'
    }, '-=0.3')
  }
  if (content) {
    tl.to(content, {
      y: 0,
      duration: 0.3,
      ease: 'power2.in'
    }, '-=0.3')
  }

  return tl
}

const createMasterTimeline = () => {
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } })

  // 主时间轴：标题
  tl.from('.nt-nested-timeline-section-57 .nt-title-57', {
    y: 80,
    opacity: 0,
    duration: 0.6
  })

  tl.from('.nt-nested-timeline-section-57 .nt-subtitle-57', {
    y: 50,
    opacity: 0,
    duration: 0.5
  }, '-=0.3')

  // 卡片入场
  tl.from('.nt-nested-card-57', {
    y: 120,
    opacity: 0,
    scale: 0.7,
    rotationX: 30,
    stagger: 0.12,
    duration: 0.8
  }, '-=0.2')

  // 背景图片入场
  tl.from('.nt-card-bg-57', {
    scale: 1.8,
    opacity: 0,
    stagger: 0.12,
    duration: 0.6
  }, '-=0.7')

  // 叠加层入场
  tl.from('.nt-card-overlay-57', {
    opacity: 0,
    stagger: 0.12,
    duration: 0.5
  }, '-=0.6')

  // 数字入场
  tl.from('.nt-card-number-57', {
    scale: 0,
    rotation: -180,
    stagger: 0.12,
    duration: 0.5,
    ease: 'back.out(1.7)'
  }, '-=0.6')

  // 内容入场
  tl.from('.nt-card-content-57', {
    y: 30,
    opacity: 0,
    stagger: 0.12,
    duration: 0.5
  }, '-=0.5')

  // 按钮入场
  tl.from('.nt-play-all-57, .nt-play-random-57, .nt-reset-all-57', {
    y: 40,
    opacity: 0,
    stagger: 0.1,
    duration: 0.5
  }, '-=0.2')

  return tl
}

const playAllNested = () => {
  masterTimeline?.restart()
  
  // 延迟播放所有嵌套时间轴
  setTimeout(() => {
    nestedTimelines.forEach((tl, i) => {
      setTimeout(() => tl.play(), i * 200)
    })
  }, 1500)
}

const playRandom = () => {
  // 随机播放嵌套时间轴
  const indices = Array.from({ length: nestedTimelines.length }, (_, i) => i)
  indices.sort(() => Math.random() - 0.5)
  
  indices.forEach((index, i) => {
    setTimeout(() => {
      nestedTimelines[index]?.restart()
    }, i * 300)
  })
}

const resetAll = () => {
  masterTimeline?.pause(0)
  nestedTimelines.forEach(tl => tl.pause(0))
}

const initAnimations = () => {
  ctx = gsap.context(() => {
    // 创建所有嵌套时间轴
    cards.value.forEach((_, index) => {
      nestedTimelines.push(createNestedTimeline(index))
    })
    
    // 创建主时间轴
    masterTimeline = createMasterTimeline()
    
    // 滚动触发
    ScrollTrigger.create({
      trigger: '.nt-nested-timeline-section-57',
      start: 'top 70%',
      onEnter: () => {
        masterTimeline?.play()
        setTimeout(() => {
          nestedTimelines.forEach((tl, i) => {
            setTimeout(() => tl.play(), i * 200)
          })
        }, 1500)
      }
    })

    // 滚动视差
    gsap.to('.nt-card-bg-57', {
      scrollTrigger: {
        trigger: '.nt-nested-container-57',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2
      },
      y: (i) => Math.sin(i * 0.5) * 30,
      rotation: (i) => i * 5,
      scale: 1.1,
      ease: 'none'
    })

    // 数字滚动效果
    gsap.to('.nt-card-number-57', {
      scrollTrigger: {
        trigger: '.nt-nested-container-57',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      },
      rotation: 180,
      scale: 1.2,
      ease: 'none'
    })

    // 悬停效果 - 使用gsap.context自动清理
    gsap.utils.toArray('.nt-nested-card-57').forEach((card: Element) => {
      const cardEl = card as HTMLElement
      cardEl.addEventListener('mouseenter', () => {
        gsap.to(cardEl.querySelector('.nt-card-bg-57'), {
          scale: 1.3,
          rotation: 10,
          duration: 0.4,
          ease: 'power2.out'
        })
        gsap.to(cardEl.querySelector('.nt-card-number-57'), {
          scale: 1.6,
          rotation: 90,
          duration: 0.3,
          ease: 'back.out(1.7)'
        })
        gsap.to(cardEl.querySelector('.nt-card-content-57'), {
          y: -15,
          duration: 0.3,
          ease: 'power2.out'
        })
      })

      cardEl.addEventListener('mouseleave', () => {
        gsap.to(cardEl.querySelector('.nt-card-bg-57'), {
          scale: 1,
          rotation: 0,
          duration: 0.4,
          ease: 'power2.out'
        })
        gsap.to(cardEl.querySelector('.nt-card-number-57'), {
          scale: 1,
          rotation: 0,
          duration: 0.3,
          ease: 'power2.out'
        })
        gsap.to(cardEl.querySelector('.nt-card-content-57'), {
          y: 0,
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
  masterTimeline?.kill()
  nestedTimelines.forEach(tl => tl.kill())
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
})
</script>

<style scoped>
/* GSAP opacity fix: ensure content is always visible */

.nt-nested-timeline-section-57 {
  min-height: 100vh;
  padding: 80px 40px;
  background: linear-gradient(135deg, #1a0a2e 0%, #2d1b69 50%, #4a0e4e 100%);
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.nt-section-header-57 {
  text-align: center;
  margin-bottom: 80px;

  opacity: 1 !important;}

.nt-title-57 {
  font-size: 56px;
  font-weight: 900;
  color: #fff;
  letter-spacing: 6px;
  text-transform: uppercase;
  text-shadow: 0 0 30px rgba(74, 14, 78, 0.5);

  opacity: 1 !important;}

.nt-subtitle-57 {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 16px;
  letter-spacing: 3px;
  text-transform: uppercase;

  opacity: 1 !important;}

.nt-nested-container-57 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 32px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 0;

  opacity: 1 !important;}

.nt-nested-card-57 {
  perspective: 1000px;
}

.nt-card-wrapper-57 {
  position: relative;
  height: 400px;
  border-radius: 24px;
  overflow: hidden;
  transform-style: preserve-3d;
  transition: box-shadow 0.4s ease;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);

  opacity: 1 !important;}

.nt-card-wrapper-57:hover {
  box-shadow: 0 20px 60px rgba(74, 14, 78, 0.5);
}

.nt-card-inner-57 {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.nt-card-bg-57 {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transition: transform 0.4s ease;

  opacity: 1 !important;}

.nt-card-overlay-57 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, transparent 0%, rgba(26, 10, 46, 0.9) 100%);
  pointer-events: none;

  opacity: 1 !important;}

.nt-card-number-57 {
  position: absolute;
  top: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  background: rgba(74, 14, 78, 0.8);
  backdrop-filter: blur(12px);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  border: 2px solid rgba(74, 14, 78, 0.5);
  transition: all 0.4s ease;

  opacity: 1 !important;}

.nt-card-content-57 {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 32px;
  transform: translateZ(30px);

  opacity: 1 !important;}

.nt-card-content-57 h3 {
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 10px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.nt-card-content-57 p {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
}

.nt-nested-controls-57 {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 60px;
  flex-wrap: wrap;
}

.nt-play-all-57, .nt-play-random-57, .nt-reset-all-57 {
  padding: 16px 40px;
  border: none;
  border-radius: 30px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 2px;

  opacity: 1 !important;}

.nt-play-all-57 {
  background: linear-gradient(135deg, #4a0e4e 0%, #7b2d8b 100%);
  color: #fff;
  box-shadow: 0 10px 30px rgba(74, 14, 78, 0.4);

  opacity: 1 !important;}

.nt-play-all-57:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(74, 14, 78, 0.5);
}

.nt-play-random-57 {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 2px solid rgba(255, 255, 255, 0.2);

  opacity: 1 !important;}

.nt-play-random-57:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-3px);
}

.nt-reset-all-57 {
  background: transparent;
  color: rgba(255, 255, 255, 0.6);
  border: 2px solid rgba(255, 255, 255, 0.1);

  opacity: 1 !important;}

.nt-reset-all-57:hover {
  border-color: rgba(255, 255, 255, 0.3);
  color: #fff;
}

@media (max-width: 768px) {
  .nt-title-57 {
    font-size: 32px;
    letter-spacing: 3px;
  
  opacity: 1 !important;}

  .nt-subtitle-57 {
    font-size: 14px;
  
  opacity: 1 !important;}

  .nt-card-wrapper-57 {
    height: 320px;
  
  opacity: 1 !important;}
}
</style>
