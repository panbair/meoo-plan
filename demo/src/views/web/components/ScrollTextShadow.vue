<template>
  <div class="text-shadow-wrapper-193">
    <div class="tss-stage-193" ref="stageRef">
      <div class="tss-3d-space-193">
        <div class="tss-grid-floor-193"></div>
        <div class="tss-grid-wall-193"></div>
      </div>
      <div class="tss-container-193" ref="containerRef" style="perspective: 1500px">
        <h2 class="tss-title-193">3D SHADOW</h2>
        <div class="tss-shadow-container-193" ref="shadowContainerRef">
          <div class="tss-text-line-193" v-for="(line, lineIndex) in textLines" :key="lineIndex">
            <span
              class="tss-char-193"
              v-for="(char, charIndex) in line.split('')"
              :key="charIndex"
            >
              <span class="tss-char-front-193">{{ char }}</span>
              <span class="tss-char-shadow-193">{{ char }}</span>
            </span>
          </div>
        </div>
        <div class="tss-shadow-depth-indicator-193">
          <div class="tss-depth-bar-193" v-for="i in 8" :key="i"></div>
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

const stageRef = ref<HTMLElement>()
const containerRef = ref<HTMLElement>()
const shadowContainerRef = ref<HTMLElement>()
const textLines = ref(['SHADOW SEPARATION', 'DEPTH PERCEPTION', '3D DIMENSION'])

const initAnimations = () => {
  const stage = stageRef.value
  const container = containerRef.value
  const shadowContainer = shadowContainerRef.value
  if (!stage || !container || !shadowContainer) return

  const title = container.querySelector('.tss-title-193')
  const lines = shadowContainer.querySelectorAll('.tss-text-line-193')
  const allChars = shadowContainer.querySelectorAll('.tss-char-193')
  const frontChars = shadowContainer.querySelectorAll('.tss-char-front-193')
  const shadowChars = shadowContainer.querySelectorAll('.tss-char-shadow-193')
  const depthBars = gsap.utils.toArray('.tss-depth-bar-193') as HTMLElement[]

  // 初始状态
  gsap.set(title, { opacity: 0, y: -50, rotationX: 90 })
  gsap.set(lines, { opacity: 0 })
  gsap.set(allChars, { opacity: 0 })
  gsap.set(frontChars, {
    transformPerspective: 1000,
    transformOrigin: 'center center'
  })
  gsap.set(shadowChars, {
    transformPerspective: 1000,
    transformOrigin: 'center center',
    translateZ: 50,
    opacity: 0
  })
  gsap.set(depthBars, { scale: 0, opacity: 0 })

  // 标题3D旋转入场
  gsap.to(title, {
    scrollTrigger: {
      trigger: stage,
      start: 'top 80%',
      end: 'top 60%',
      scrub: 1
    },
    opacity: 1,
    y: 0,
    rotationX: 0
  })

  // 逐行显示
  lines.forEach((line, lineIndex) => {
    gsap.to(line, {
      scrollTrigger: {
        trigger: stage,
        start: 'top 70%',
        end: 'top 40%',
        scrub: 1
      },
      opacity: 1
    })

    const chars = line.querySelectorAll('.tss-char-193')
    const fronts = line.querySelectorAll('.tss-char-front-193')
    const shadows = line.querySelectorAll('.tss-char-shadow-193')

    chars.forEach((char, charIndex) => {
      gsap.to(char, {
        scrollTrigger: {
          trigger: stage,
          start: 'top 65%',
          end: 'top 35%',
          scrub: 0.5
        },
        opacity: 1,
        delay: lineIndex * 0.1 + charIndex * 0.02
      })
    })

    fronts.forEach((front, charIndex) => {
      gsap.to(front, {
        scrollTrigger: {
          trigger: stage,
          start: 'top 60%',
          end: 'top 30%',
          scrub: 0.5
        },
        rotationX: 20,
        rotationY: (i) => Math.sin(i * 0.2) * 10,
        delay: lineIndex * 0.1 + charIndex * 0.02
      })
    })

    shadows.forEach((shadow, charIndex) => {
      gsap.to(shadow, {
        scrollTrigger: {
          trigger: stage,
          start: 'top 60%',
          end: 'top 20%',
          scrub: 0.5
        },
          translateZ: 100,
          rotationX: 25,
          rotationY: (i) => Math.sin(i * 0.2) * 15,
          opacity: 0.5,
          color: '#ff6b6b',
        delay: lineIndex * 0.1 + charIndex * 0.02
      })
    })
  })

  // 深度指示器
  gsap.to(depthBars, {
    scrollTrigger: {
      trigger: stage,
      start: 'top 50%',
      end: 'top 20%',
      scrub: 0.5
    },
    scale: 1,
    opacity: 1,
    stagger: 0.1
  })

  // 深度条持续动画
  depthBars.forEach((bar, i) => {
    gsap.to(bar, {
      scaleY: 0.5 + Math.random() * 0.5,
      duration: 1.5 + i * 0.1,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
  })

  // 持续3D摆动
  frontChars.forEach((front, i) => {
    gsap.to(front, {
      rotationX: 20 + Math.sin(i * 0.3) * 10,
      rotationY: Math.sin(i * 0.2) * 15,
      duration: 3 + i * 0.1,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
  })

  // 阴影持续分离动画
  shadowChars.forEach((shadow, i) => {
    gsap.to(shadow, {
      translateZ: 80 + Math.sin(i * 0.3) * 30,
      duration: 2.5 + i * 0.1,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
  })

  // 字符悬停效果
  allChars.forEach((char) => {
    const front = char.querySelector('.tss-char-front-193') as HTMLElement
    const shadow = char.querySelector('.tss-char-shadow-193') as HTMLElement

    char.addEventListener('mouseenter', () => {
      gsap.to(front, {
        rotationX: 0,
        rotationY: 0,
        scale: 1.2,
        textShadow: '0 0 30px rgba(255, 107, 107, 0.8)',
        duration: 0.3
      })

      gsap.to(shadow, {
        translateZ: 150,
        opacity: 0.8,
        color: '#ff4444',
        duration: 0.3
      })
    })

    char.addEventListener('mouseleave', () => {
      gsap.to(front, {
        rotationX: 20,
        rotationY: 0,
        scale: 1,
        textShadow: 'none',
        duration: 0.3
      })

      gsap.to(shadow, {
        translateZ: 100,
        opacity: 0.5,
        color: '#ff6b6b',
        duration: 0.3
      })
    })
  })
}

onMounted(() => {
  initAnimations()
})

onUnmounted(() => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
})
</script>

<style scoped>
/* GSAP opacity fix: ensure content is always visible */

.text-shadow-wrapper-193 {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  overflow: hidden;

  opacity: 1 !important;}

.tss-stage-193 {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  perspective: 1500px;

  opacity: 1 !important;}

.tss-3d-space-193 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.tss-grid-floor-193 {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 49px,
    rgba(255, 107, 107, 0.1) 49px,
    rgba(255, 107, 107, 0.1) 50px
  ),
  repeating-linear-gradient(
    90deg,
    transparent,
    transparent 49px,
    rgba(255, 107, 107, 0.1) 49px,
    rgba(255, 107, 107, 0.1) 50px
  );
  transform: rotateX(60deg);
  transform-origin: bottom center;

  opacity: 1 !important;}

.tss-grid-wall-193 {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 50%;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 49px,
    rgba(255, 107, 107, 0.1) 49px,
    rgba(255, 107, 107, 0.1) 50px
  ),
  repeating-linear-gradient(
    90deg,
    transparent,
    transparent 49px,
    rgba(255, 107, 107, 0.1) 49px,
    rgba(255, 107, 107, 0.1) 50px
  );
  transform: rotateY(-60deg);
  transform-origin: left center;

  opacity: 1 !important;}

.tss-container-193 {
  position: relative;
  text-align: center;
  z-index: 10;
  max-width: 900px;

  opacity: 1 !important;}

.tss-title-193 {
  font-size: 3rem;
  font-weight: 700;
  color: #ff6b6b;
  margin-bottom: 60px;
  text-shadow: 0 0 30px rgba(255, 107, 107, 0.8);
  letter-spacing: 6px;
  transform-style: preserve-3d;

  opacity: 1 !important;}

.tss-shadow-container-193 {
  padding: 40px 60px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 107, 107, 0.3);
  margin-bottom: 40px;
  transform-style: preserve-3d;

  opacity: 1 !important;}

.tss-text-line-193 {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 25px;
  transform-style: preserve-3d;
}

.tss-char-193 {
  position: relative;
  display: inline-block;
  min-width: 20px;
  height: 50px;
  transform-style: preserve-3d;

  opacity: 1 !important;}

.tss-char-front-193,
.tss-char-shadow-193 {
  position: absolute;
  top: 0;
  left: 0;
  font-size: 2.5rem;
  font-weight: 900;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-style: preserve-3d;
  transition: all 0.3s ease;

  opacity: 1 !important;}

.tss-char-front-193 {
  z-index: 2;
}

.tss-char-shadow-193 {
  z-index: 1;
  color: #ff6b6b;
  filter: blur(3px);

  opacity: 1 !important;}

.tss-shadow-depth-indicator-193 {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  backdrop-filter: blur(10px);

  opacity: 1 !important;}

.tss-depth-bar-193 {
  width: 12px;
  height: 60px;
  background: linear-gradient(180deg, #ff6b6b, #ff4444);
  border-radius: 6px;
  transform-origin: bottom;

  opacity: 1 !important;}

@media (max-width: 768px) {
  .tss-title-193 {
    font-size: 2rem;
  
  opacity: 1 !important;}

  .tss-char-front-193,
  .tss-char-shadow-193 {
    font-size: 1.5rem;
  
  opacity: 1 !important;}
}
</style>
