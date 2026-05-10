<template>
  <div class="ts-timeline-sequence-section-55">
    <div class="ts-section-header-55">
      <h2 class="ts-title-55">TIMELINE SEQUENCE</h2>
      <p class="ts-subtitle-55">时间轴序列动画</p>
    </div>

    <div class="ts-sequence-container-55">
      <div class="ts-sequence-item-55" v-for="(item, index) in items" :key="index">
        <div class="ts-item-stage-55">
          <div class="ts-item-number-55">{{ String(index + 1).padStart(2, '0') }}</div>
          <div class="ts-item-image-55" :style="{ backgroundImage: `url(${item.image})` }"></div>
        </div>
        <div class="ts-item-content-55">
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
        </div>
      </div>
    </div>

    <div class="ts-controls-55">
      <button class="ts-play-btn-55" @click="playSequence">播放序列</button>
      <button class="ts-reverse-btn-55" @click="reverseSequence">反向播放</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const items = ref([
  { image: new URL('@/assets/image/1.png', import.meta.url).href, title: 'Step One', description: '第一步' },
  { image: new URL('@/assets/image/2.png', import.meta.url).href, title: 'Step Two', description: '第二步' },
  { image: new URL('@/assets/image/3.png', import.meta.url).href, title: 'Step Three', description: '第三步' },
  { image: new URL('@/assets/image/4.png', import.meta.url).href, title: 'Step Four', description: '第四步' },
  { image: new URL('@/assets/image/5.png', import.meta.url).href, title: 'Step Five', description: '第五步' },
  { image: new URL('@/assets/image/6.png', import.meta.url).href, title: 'Step Six', description: '第六步' }
])

let ctx: gsap.Context
let masterTimeline: gsap.core.Timeline | null = null

const createTimeline = () => {
  const tl = gsap.timeline({
    paused: true,
    defaults: { ease: 'power2.out' }
  })

  // 第一步：标题动画
  tl.from('.ts-title-55', {
    y: 80,
    opacity: 0,
    duration: 0.6
  })

  // 第二步：副标题动画（与第一步重叠0.3秒）
  tl.from('.ts-subtitle-55', {
    y: 50,
    opacity: 0,
    duration: 0.5
  }, '-=0.3')

  // 第三步：容器入场
  tl.from('.ts-sequence-container-55', {
    y: 60,
    opacity: 0,
    duration: 0.8
  }, '-=0.2')

  // 第四步：序列动画 - 使用stagger
  tl.from('.ts-sequence-item-55', {
    x: -150,
    opacity: 0,
    scale: 0.8,
    rotationY: -45,
    stagger: 0.15,
    duration: 0.7
  }, '-=0.4')

  // 第五步：图片渐入
  tl.from('.ts-item-image-55', {
    scale: 1.5,
    opacity: 0,
    stagger: 0.15,
    duration: 0.6
  }, '-=0.6')

  // 第六步：数字旋转入场
  tl.from('.ts-item-number-55', {
    rotation: -180,
    scale: 0,
    opacity: 0,
    stagger: 0.15,
    duration: 0.5,
    ease: 'back.out(1.7)'
  }, '-=0.7')

  // 第七步：内容滑入
  tl.from('.ts-item-content-55', {
    x: -80,
    opacity: 0,
    stagger: 0.15,
    duration: 0.5
  }, '-=0.6')

  // 第八步：按钮动画
  tl.from('.ts-play-btn-55, .ts-reverse-btn-55', {
    y: 40,
    opacity: 0,
    stagger: 0.1,
    duration: 0.5
  }, '-=0.2')

  return tl
}

const playSequence = () => {
  if (masterTimeline) {
    masterTimeline.restart()
  }
}

const reverseSequence = () => {
  if (masterTimeline) {
    masterTimeline.reverse()
  }
}

const initAnimations = () => {
  ctx = gsap.context(() => {
    // 创建主时间轴
    masterTimeline = createTimeline()

    // 滚动触发时间轴
    ScrollTrigger.create({
      trigger: '.ts-timeline-sequence-section-55',
      start: 'top 70%',
      onEnter: () => masterTimeline?.play(),
      onLeaveBack: () => masterTimeline?.reverse()
    })

    // 滚动时的独立动画
    gsap.to('.ts-item-image-55', {
      scrollTrigger: {
        trigger: '.ts-sequence-container-55',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      },
      scale: 1.1,
      ease: 'none'
    })

    // 悬停效果 - 使用gsap.utils.toArray自动清理
    gsap.utils.toArray('.ts-sequence-item-55').forEach((item: Element) => {
      const itemEl = item as HTMLElement
      itemEl.addEventListener('mouseenter', () => {
        gsap.to(itemEl.querySelector('.ts-item-image-55'), {
          scale: 1.2,
          rotation: 5,
          duration: 0.4,
          ease: 'power2.out'
        })
        gsap.to(itemEl.querySelector('.ts-item-number-55'), {
          scale: 1.3,
          rotation: 15,
          duration: 0.3,
          ease: 'back.out(1.7)'
        })
      })

      itemEl.addEventListener('mouseleave', () => {
        gsap.to(itemEl.querySelector('.ts-item-image-55'), {
          scale: 1,
          rotation: 0,
          duration: 0.4,
          ease: 'power2.out'
        })
        gsap.to(itemEl.querySelector('.ts-item-number-55'), {
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
  masterTimeline?.kill()
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
})
</script>

<style scoped>
/* GSAP opacity fix: ensure content is always visible */

.ts-timeline-sequence-section-55 {
  min-height: 100vh;
  padding: 80px 40px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.ts-section-header-55 {
  text-align: center;
  margin-bottom: 80px;

  opacity: 1 !important;}

.ts-title-55 {
  font-size: 56px;
  font-weight: 900;
  color: #fff;
  letter-spacing: 6px;
  text-transform: uppercase;
  text-shadow: 0 0 30px rgba(15, 52, 96, 0.5);

  opacity: 1 !important;}

.ts-subtitle-55 {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 16px;
  letter-spacing: 3px;
  text-transform: uppercase;

  opacity: 1 !important;}

.ts-sequence-container-55 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 32px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 0;

  opacity: 1 !important;}

.ts-sequence-item-55 {
  display: flex;
  gap: 24px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: box-shadow 0.4s ease;

  opacity: 1 !important;}

.ts-sequence-item-55:hover {
  box-shadow: 0 15px 40px rgba(15, 52, 96, 0.3);
}

.ts-item-stage-55 {
  position: relative;
  flex-shrink: 0;
  width: 160px;
  height: 160px;
  border-radius: 16px;
  overflow: hidden;

  opacity: 1 !important;}

.ts-item-image-55 {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transition: transform 0.4s ease;

  opacity: 1 !important;}

.ts-item-number-55 {
  position: absolute;
  top: 12px;
  left: 12px;
  width: 40px;
  height: 40px;
  background: rgba(15, 52, 96, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  border: 2px solid rgba(15, 52, 96, 0.5);
  transition: all 0.4s ease;

  opacity: 1 !important;}

.ts-item-content-55 {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
}

.ts-item-content-55 h3 {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
}

.ts-item-content-55 p {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
}

.ts-controls-55 {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 60px;
}

.ts-play-btn-55, .ts-reverse-btn-55 {
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

.ts-play-btn-55 {
  background: linear-gradient(135deg, #0f3460 0%, #e94560 100%);
  color: #fff;
  box-shadow: 0 10px 30px rgba(233, 69, 96, 0.3);

  opacity: 1 !important;}

.ts-play-btn-55:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(233, 69, 96, 0.4);
}

.ts-reverse-btn-55 {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 2px solid rgba(255, 255, 255, 0.2);

  opacity: 1 !important;}

.ts-reverse-btn-55:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-3px);
}

@media (max-width: 768px) {
  .ts-title-55 {
    font-size: 32px;
    letter-spacing: 3px;
  
  opacity: 1 !important;}

  .ts-subtitle-55 {
    font-size: 14px;
  
  opacity: 1 !important;}

  .ts-sequence-item-55 {
    flex-direction: column;
    gap: 16px;
  }

  .ts-item-stage-55 {
    width: 100%;
    height: 200px;
  
  opacity: 1 !important;}
}
</style>
