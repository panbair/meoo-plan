<template>
  <div class="stagger-grid-43">
    <div class="sg-container-43">
      <h2 class="sg-section-title-43">错开网格</h2>

      <div class="sg-grid-container-43">
        <div
          class="sg-grid-item-43"
          v-for="(img, index) in images"
          :key="index"
          ref="items"
        >
          <div class="sg-item-inner-43">
            <img :src="img" :alt="`Image ${index + 1}`" />
            <div class="sg-item-overlay-43">
              <span class="sg-item-number-43">{{ index + 1 }}</span>
              <h3 class="sg-item-title-43">Grid {{ index + 1 }}</h3>
            </div>
          </div>
        </div>
      </div>

      <button class="sg-replay-btn-43" @click="replayAnimation">重播动画</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const items = ref<HTMLElement[]>([])
const images = [
  new URL('@/assets/image/1.png', import.meta.url).href,
  new URL('@/assets/image/2.png', import.meta.url).href,
  new URL('@/assets/image/3.png', import.meta.url).href,
  new URL('@/assets/image/4.png', import.meta.url).href,
  new URL('@/assets/image/5.png', import.meta.url).href,
  new URL('@/assets/image/6.png', import.meta.url).href
]

let ctx: gsap.Context
let timeline: gsap.core.Timeline

const replayAnimation = () => {
  if (timeline) {
    timeline.restart()
  }
}

onMounted(() => {
  ctx = gsap.context(() => {
    // 设置初始可见状态和正确的 transform
    gsap.set(items.value, {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateY: 0
    })

    // 标题动画
    gsap.from('.sg-section-title-43', {
      scrollTrigger: {
        trigger: '.sg-section-title-43',
        start: 'top 90%'
      },
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    })

    // 入场错开动画（只做轻微的效果，不影响可见性）
    timeline = gsap.timeline({
      scrollTrigger: {
        trigger: '.sg-grid-container-43',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    })

    timeline.from(items.value, {
      y: -50,
      scale: 0.9,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.out'
    })

    // 滚动触发动画
    items.value.forEach((item, index) => {
      const img = item.querySelector('img') as HTMLElement
      const overlay = item.querySelector('.sg-item-overlay-43') as HTMLElement
      const number = item.querySelector('.sg-item-number-43') as HTMLElement

      // 设置初始状态
      gsap.set(overlay, { opacity: 0.9 })
      gsap.set(number, { opacity: 0.9, rotate: 0, scale: 1 })

      // 图片缩放
      gsap.fromTo(img,
        { scale: 1.1 },
        {
          scale: 1,
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            end: 'top 30%',
            scrub: true
          },
          ease: 'power2.out'
        }
      )

      // 标题滑入
      gsap.from('.sg-item-title-43', {
        x: -20,
        opacity: 0,
        scrollTrigger: {
          trigger: '.sg-grid-container-43',
          start: 'top 60%',
          end: 'top 20%',
          scrub: true
        },
        stagger: 0.1,
        ease: 'power2.out'
      })
    })

    // 按钮动画
    gsap.from('.sg-replay-btn-43', {
      scrollTrigger: {
        trigger: '.sg-replay-btn-43',
        start: 'top 90%'
      },
      scale: 0,
      opacity: 0,
      duration: 0.6,
      ease: 'back.out(2)'
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.stagger-grid-43 {
  min-height: 100vh;
  padding: 100px 0;
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%);
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
      radial-gradient(circle at 20% 40%, rgba(102, 126, 234, 0.1) 0%, transparent 40%),
      radial-gradient(circle at 80% 60%, rgba(240, 147, 251, 0.1) 0%, transparent 40%);
    pointer-events: none;
  
  opacity: 1 !important;}
}

.sg-container-43 {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.sg-section-title-43 {
  text-align: center;
  font-size: 3.5rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 80px;
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

.sg-grid-container-43 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  padding: 40px 0;

  opacity: 1 !important;}

.sg-grid-item-43 {
  position: relative;
  height: 350px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  background: #fff;
  transition: transform 0.4s ease;

  &:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 30px 70px rgba(0, 0, 0, 0.4);
  
  opacity: 1 !important;}
}

.sg-grid-item-43:hover .sg-item-inner-43 img {
  filter: brightness(1.1) saturate(1.1);
}

.sg-item-inner-43 {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.sg-item-inner-43 img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: filter 0.3s ease;
}

.sg-item-overlay-43 {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.4) 60%, transparent 100%);
  padding: 30px;
  pointer-events: none;

  opacity: 1 !important;}

.sg-item-number-43 {
  display: block;
  font-size: 3.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #667eea 0%, #f093fb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: -15px;
  font-family: 'Arial', sans-serif;
  opacity: 0.9;
}

.sg-item-title-43 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);

  opacity: 1 !important;}

.sg-replay-btn-43 {
  display: block;
  margin: 60px auto 0;
  padding: 15px 40px;
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #667eea 0%, #f093fb 100%);
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
  
  opacity: 1 !important;}

  &:active {
    transform: translateY(-1px);
  }
}

@media (max-width: 1024px) {
  .sg-grid-container-43 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .sg-grid-container-43 {
    grid-template-columns: 1fr;
  }

  .sg-section-title-43 {
    font-size: 2rem;
  
  opacity: 1 !important;}
}
</style>
