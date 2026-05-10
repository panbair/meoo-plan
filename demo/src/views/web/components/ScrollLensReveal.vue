<template>
  <div class="lens-reveal-140" ref="componentRoot">
    <div class="lr-container-140">
      <h2 class="lr-title-140">🔍 镜头揭示</h2>
      <p class="lr-desc-140">滚动通过放大镜揭示隐藏内容</p>
      
      <div class="lr-stage-140">
        <div class="lr-background-140">
          <div class="lr-hidden-content-140">
            <img :src="imageList[0]" alt="Hidden" class="lr-bg-image-140" />
            <div class="lr-text-140">隐藏的世界</div>
          </div>
        </div>
        
        <div class="lr-lens-wrapper-140" ref="lensWrapper">
          <div class="lr-lens-140" ref="lens">
            <div class="lr-lens-content-140">
              <img :src="imageList[1]" alt="Revealed" class="lr-lens-image-140" />
              <div class="lr-lens-text-140">揭示</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="lr-hint-140">继续滚动查看效果</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const componentRoot = ref<HTMLElement>()
const lensWrapper = ref<HTMLElement>()
const lens = ref<HTMLElement>()

const imageList = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800'
]

let ctx: any = null

onMounted(() => {
  ctx = gsap.context(() => {
    // 初始状态
    gsap.set('.lr-lens-140', {
      scale: 0,
      x: '50%',
      opacity: 0
    })

    // 镜头揭示动画
    gsap.to('.lr-lens-140', {
      scrollTrigger: {
        trigger: '.lr-stage-140',
        start: 'top center',
        end: 'bottom center',
        scrub: 1
      },
      scale: 3,
      x: '0%',
      opacity: 1,
      ease: 'power2.inOut'
    })

    // 镜头移动路径
    gsap.to('.lr-lens-wrapper-140', {
      scrollTrigger: {
        trigger: '.lr-stage-140',
        start: 'top center',
        end: 'bottom center',
        scrub: 1
      },
      rotation: 360,
      ease: 'power1.inOut'
    })

    // 标题淡入
    gsap.from('.lr-title-140', {
      scrollTrigger: {
        trigger: '.lr-container-140',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      y: -50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    })

    // 描述文字淡入
    gsap.from('.lr-desc-140', {
      scrollTrigger: {
        trigger: '.lr-container-140',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      delay: 0.2,
      ease: 'power3.out'
    })

    // 提示淡入
    gsap.from('.lr-hint-140', {
      scrollTrigger: {
        trigger: '.lr-stage-140',
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

.lr-container-140 {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;

  opacity: 1 !important;}

.lr-title-140 {
  font-size: clamp(2rem, 5vw, 3.5rem);
  color: #fff;
  margin-bottom: 10px;
  text-align: center;
  background: linear-gradient(90deg, #f093fb, #f5576c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  opacity: 1 !important;}

.lr-desc-140 {
  font-size: clamp(0.9rem, 2vw, 1.2rem);
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 40px;
  text-align: center;

  opacity: 1 !important;}

.lr-stage-140 {
  width: 100%;
  max-width: 800px;
  height: 600px;
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  background: #0a0a1a;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);

  opacity: 1 !important;}

.lr-background-140 {
  width: 100%;
  height: 100%;
  position: relative;

  opacity: 1 !important;}

.lr-hidden-content-140 {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.lr-bg-image-140 {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.4) blur(2px);
  transform: scale(1.1);

  opacity: 1 !important;}

.lr-text-140 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: clamp(1.5rem, 3vw, 2.5rem);
  color: rgba(255, 255, 255, 0.3);
  font-weight: bold;
  letter-spacing: 4px;

  opacity: 1 !important;}

.lr-lens-wrapper-140 {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 150px;
  height: 150px;
  transform: translate(-50%, -50%);
  z-index: 10;

  opacity: 1 !important;}

.lr-lens-140 {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #f5576c;
  box-shadow: 
    0 0 0 10px rgba(245, 87, 108, 0.3),
    0 0 30px rgba(245, 87, 108, 0.6),
    inset 0 0 30px rgba(0, 0, 0, 0.5);
  will-change: transform;

  opacity: 1 !important;}

.lr-lens-content-140 {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.lr-lens-image-140 {
  width: 400px;
  height: 400px;
  object-fit: cover;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  opacity: 1 !important;}

.lr-lens-text-140 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1rem;
  color: #fff;
  font-weight: bold;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
  white-space: nowrap;

  opacity: 1 !important;}

.lr-hint-140 {
  margin-top: 30px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;

  opacity: 1 !important;}

@media (max-width: 768px) {
  lr-stage-140 {
    height: 500px;
  }
  
  .lr-lens-wrapper-140 {
    width: 100px;
    height: 100px;
  
  opacity: 1 !important;}
}
</style>
