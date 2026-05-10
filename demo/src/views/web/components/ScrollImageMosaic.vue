<template>
  <div class="image-mosaic-147" ref="componentRoot">
    <div class="im-container-147">
      <h2 class="im-title-147">🧩 图片马赛克</h2>
      <p class="im-desc-147">滚动触发图片马赛克拼图效果</p>
      
      <div class="im-stage-147">
        <div class="im-grid-147">
          <div 
            v-for="(item, index) in gridItems" 
            :key="index"
            class="im-tile-147"
            :style="{ 
              '--row': item.row,
              '--col': item.col,
              '--size': item.size 
            }"
          >
            <img :src="item.image" alt="" class="im-tile-image-147" />
          </div>
        </div>
        
        <div class="im-overlay-147">
          <div class="im-text-147">EXPLORE</div>
        </div>
      </div>
      
      <div class="im-hint-147">滚动查看拼图效果</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const componentRoot = ref<HTMLElement>()

const images = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400',
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400'
]

const gridItems = [
  { row: 1, col: 1, size: 2, image: images[0] },
  { row: 1, col: 3, size: 1, image: images[1] },
  { row: 2, col: 1, size: 1, image: images[2] },
  { row: 2, col: 2, size: 1, image: images[3] },
  { row: 2, col: 3, size: 2, image: images[4] },
  { row: 3, col: 2, size: 1, image: images[5] },
  { row: 3, col: 4, size: 1, image: images[6] },
  { row: 4, col: 1, size: 2, image: images[7] }
]

let ctx: any = null

onMounted(() => {
  ctx = gsap.context(() => {
    // 初始状态 - 紧凑排列
    gsap.set('.im-tile-147', {
      scale: 0.8,
      opacity: 0.5,
      rotation: 0
    })

    // 展开动画
    gsap.to('.im-tile-147', {
      scrollTrigger: {
        trigger: '.im-stage-147',
        start: 'top 70%',
        end: 'bottom 30%',
        scrub: 1
      },
      scale: 1,
      opacity: 1,
      duration: 1,
      ease: 'power2.inOut',
      stagger: {
        each: 0.05,
        from: 'center'
      }
    })

    // 旋转效果
    gsap.to('.im-tile-147', {
      scrollTrigger: {
        trigger: '.im-stage-147',
        start: 'top 50%',
        end: 'bottom 50%',
        scrub: 1
      },
      rotation: (index) => (index % 2 === 0 ? 5 : -5),
      duration: 1,
      ease: 'power1.inOut'
    })

    // 覆盖层文字动画
    gsap.to('.im-text-147', {
      scrollTrigger: {
        trigger: '.im-stage-147',
        start: 'top 60%',
        end: 'bottom 40%',
        scrub: 1
      },
      scale: 3,
      opacity: 0,
      duration: 1,
      ease: 'power2.inOut'
    })

    // 标题动画
    gsap.from('.im-title-147', {
      scrollTrigger: {
        trigger: '.im-container-147',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      y: -50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    })

    // 描述动画
    gsap.from('.im-desc-147', {
      scrollTrigger: {
        trigger: '.im-container-147',
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
    gsap.from('.im-hint-147', {
      scrollTrigger: {
        trigger: '.im-stage-147',
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

.image-mosaic-147 {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #232526 0%, #414345 100%);
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;

  opacity: 1 !important;}

.im-container-147 {
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  align-items: center;

  opacity: 1 !important;}

.im-title-147 {
  font-size: clamp(2rem, 5vw, 3.5rem);
  color: #fff;
  margin-bottom: 10px;
  text-align: center;
  background: linear-gradient(90deg, #ff6b6b, #feca57);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  opacity: 1 !important;}

.im-desc-147 {
  font-size: clamp(0.9rem, 2vw, 1.2rem);
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 40px;
  text-align: center;

  opacity: 1 !important;}

.im-stage-147 {
  width: 100%;
  max-width: 600px;
  height: 600px;
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);

  opacity: 1 !important;}

.im-grid-147 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 10px;
  padding: 20px;
  height: 100%;

  opacity: 1 !important;}

.im-tile-147 {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  will-change: transform, opacity;
}

.im-tile-147:nth-child(1) {
  grid-column: span 2;
  grid-row: span 2;
}

.im-tile-147:nth-child(5) {
  grid-column: span 2;
  grid-row: span 2;
}

.im-tile-147:nth-child(8) {
  grid-column: span 2;
  grid-row: span 2;
}

.im-tile-image-147 {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  opacity: 1 !important;}

.im-tile-147:hover .im-tile-image-147 {
  transform: scale(1.1);
}

.im-overlay-147 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  pointer-events: none;
  z-index: 10;

  opacity: 1 !important;}

.im-text-147 {
  font-size: 2.5rem;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);
  will-change: transform, opacity;

  opacity: 1 !important;}

.im-hint-147 {
  margin-top: 30px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;

  opacity: 1 !important;}

@media (max-width: 768px) {
  .im-stage-147 {
    height: 500px;
  
  opacity: 1 !important;}
  
  .im-grid-147 {
    gap: 8px;
    padding: 15px;
  
  opacity: 1 !important;}
  
  .im-text-147 {
    font-size: 2rem;
  
  opacity: 1 !important;}
}
</style>
