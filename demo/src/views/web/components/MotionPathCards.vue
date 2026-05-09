<template>
  <div class="mp-motion-path-section-61">
    <div class="mp-section-header-61">
      <h2 class="mp-title-61">MOTION PATH</h2>
      <p class="mp-subtitle-61">路径运动动画</p>
    </div>

    <div class="mp-path-container-61">
      <svg class="mp-path-svg-61" viewBox="0 0 1400 600">
        <!-- S型曲线路径 - 添加id以便引用 -->
        <path id="motionPath1" class="mp-motion-path-61" d="M 100 300 Q 350 100, 700 300 T 1300 300" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="2" stroke-dasharray="5,5"/>

        <!-- 运动元素 -->
        <circle v-for="(dot, index) in dots" :key="index" class="mp-motion-dot-61" :cx="100" :cy="300" :r="12 + index * 2" :fill="dot.color"/>
      </svg>
    </div>

    <div class="mp-path-controls-61">
      <button class="mp-control-btn-61" @click="playMotion">播放路径</button>
      <button class="mp-control-btn-61" @click="reverseMotion">反向播放</button>
      <button class="mp-control-btn-61" @click="toggleSpeed">{{ speed === 1 ? '2x速度' : '1x速度' }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(MotionPathPlugin, ScrollTrigger)

const dots = ref([
  { color: '#ff6b6b' },
  { color: '#4ecdc4' },
  { color: '#ffe66d' },
  { color: '#95e1d3' },
  { color: '#f38181' },
  { color: '#aa96da' }
])

const speed = ref(1)
let ctx: gsap.Context
let motionTween: gsap.core.Tween | null = null

const playMotion = () => {
  motionTween?.restart()
}

const reverseMotion = () => {
  motionTween?.reverse()
}

const toggleSpeed = () => {
  speed.value = speed.value === 1 ? 2 : 0.5
  motionTween?.timeScale(speed.value)
}

const initAnimations = () => {
  ctx = gsap.context(() => {
    // 标题动画 - 增强效果
    gsap.from('.mp-motion-path-section-61 .mp-title-61', {
      scrollTrigger: {
        trigger: '.mp-motion-path-section-61',
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      y: 150,
      opacity: 0,
      scale: 0.7,
      rotationX: -30,
      ease: 'back.out(1.7)',
      duration: 1.5
    })

    // 副标题动画 - 增强效果
    gsap.from('.mp-motion-path-section-61 .mp-subtitle-61', {
      scrollTrigger: {
        trigger: '.mp-motion-path-section-61',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      y: 120,
      opacity: 0,
      scale: 0.7,
      ease: 'back.out(1.7)',
      duration: 1.2,
      delay: 0.2
    })

    // 使用 MotionPath 沿 SVG 路径运动
    motionTween = gsap.to('.mp-motion-dot-61', {
      motionPath: {
        path: '#motionPath1',  // 使用选择器引用路径
        align: '#motionPath1',
        alignOrigin: [0.5, 0.5],
        autoRotate: true
      },
      duration: 3,
      ease: 'power1.inOut',
      paused: true,
      stagger: 0.3,
      repeat: -1,
      yoyo: true
    })

    // 点的入场动画 - 增强效果
    gsap.from('.mp-motion-dot-61', {
      scrollTrigger: {
        trigger: '.mp-path-container-61',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      scale: 0,
      opacity: 0,
      y: 150,
      rotation: 180,
      stagger: 0.15,
      ease: 'back.out(1.7)',
      duration: 1.2
    })

    // 滚动控制 - 使用不同的时间轴
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.mp-path-container-61',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5
      }
    })

    scrollTl.to('.mp-motion-dot-61', {
      motionPath: {
        path: '#motionPath1',
        align: '#motionPath1',
        alignOrigin: [0.5, 0.5],
        autoRotate: true
      },
      duration: 1.5,
      stagger: 0.1,
      ease: 'none'
    })

    // 按钮动画 - 增强效果
    gsap.from('.mp-control-btn-61', {
      scrollTrigger: {
        trigger: '.mp-path-controls-61',
        start: 'top 90%',
        toggleActions: 'play none none reverse'
      },
      y: 80,
      opacity: 0,
      scale: 0.7,
      stagger: 0.12,
      ease: 'back.out(1.7)',
      duration: 1
    })
  })
}

onMounted(() => {
  initAnimations()
})

onUnmounted(() => {
  ctx?.revert()
  motionTween?.kill()
})
</script>

<style scoped>
/* GSAP opacity fix: ensure content is always visible */

.mp-motion-path-section-61 {
  min-height: 100vh;
  padding: 80px 40px;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #2d1b69 100%);
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.mp-section-header-61 {
  text-align: center;
  margin-bottom: 60px;

  opacity: 1 !important;}

.mp-title-61 {
  font-size: 56px;
  font-weight: 900;
  color: #fff;
  letter-spacing: 6px;
  text-transform: uppercase;
  text-shadow: 0 0 30px rgba(45, 27, 105, 0.5);

  opacity: 1 !important;}

.mp-subtitle-61 {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 16px;
  letter-spacing: 3px;
  text-transform: uppercase;

  opacity: 1 !important;}

.mp-path-container-61 {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 0;

  opacity: 1 !important;}

.mp-path-svg-61 {
  width: 100%;
  height: 600px;

  opacity: 1 !important;}

.mp-motion-path-61 {
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
}

.mp-motion-dot-61 {
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
  cursor: pointer;
  transition: filter 0.3s ease;
}

.mp-motion-dot-61:hover {
  filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.8));
}

.mp-path-controls-61 {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 40px;
}

.mp-control-btn-61 {
  padding: 16px 40px;
  background: linear-gradient(135deg, #2d1b69 0%, #5c3d7a 100%);
  border: none;
  border-radius: 30px;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 2px;
  box-shadow: 0 10px 30px rgba(45, 27, 105, 0.3);

  opacity: 1 !important;}

.mp-control-btn-61:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(45, 27, 105, 0.4);
}

@media (max-width: 768px) {
  .mp-title-61 {
    font-size: 32px;
    letter-spacing: 3px;
  
  opacity: 1 !important;}

  .mp-subtitle-61 {
    font-size: 14px;
  
  opacity: 1 !important;}

  .mp-path-svg-61 {
    height: 400px;
  
  opacity: 1 !important;}
}
</style>
