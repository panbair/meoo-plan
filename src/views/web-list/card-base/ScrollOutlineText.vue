<template>
  <div class="outline-text-wrapper-195">
    <div class="ot-stage-195" ref="stageRef">
      <div class="ot-particles-bg-195">
        <div class="ot-particle-195" v-for="i in 50" :key="i"></div>
      </div>
      <div class="ot-container-195" ref="containerRef">
        <h2 class="ot-title-195">OUTLINE FILL</h2>
        <div class="ot-text-stage-195">
          <div class="ot-text-line-195" v-for="(line, lineIndex) in textLines" :key="lineIndex">
            <span
              class="ot-char-195"
              v-for="(char, charIndex) in line.split('')"
              :key="charIndex"
              :data-char="char"
            >
              {{ char }}
            </span>
          </div>
        </div>
        <div class="ot-fill-progress-195">
          <div class="ot-progress-bar-195" ref="progressBar"></div>
        </div>
        <p class="ot-hint-195">Scroll to fill the outline</p>
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
const progressBar = ref<HTMLElement>()
const textLines = ref(['OUTLINE EFFECT', 'FILL GRADUALLY', 'WATCH IT GROW'])

const initAnimations = () => {
  const stage = stageRef.value
  const container = containerRef.value
  const bar = progressBar.value
  if (!stage || !container || !bar) return

  const title = container.querySelector('.ot-title-195')
  const lines = container.querySelectorAll('.ot-text-line-195')
  const allChars = container.querySelectorAll('.ot-char-195')
  const particles = gsap.utils.toArray('.ot-particle-195') as HTMLElement[]

  // 初始状态
  gsap.set(title, { opacity: 0, y: -50 })
  gsap.set(allChars, { color: 'transparent' })
  gsap.set(particles, { opacity: 0, scale: 0 })
  gsap.set(bar, { scaleX: 0 })

  // 粒子背景
  gsap.to(particles, {
    scrollTrigger: {
      trigger: stage,
      start: 'top 100%',
      end: 'bottom 0%',
      scrub: 0.5
    },
    opacity: 0.3,
    scale: 1,
    stagger: { each: 0.02, from: 'random' }
  })

  particles.forEach((particle, i) => {
    gsap.to(particle, {
      x: () => (Math.random() - 0.5) * 100,
      y: () => (Math.random() - 0.5) * 100,
      duration: 3 + Math.random() * 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
  })

  // 标题入场
  gsap.to(title, {
    scrollTrigger: {
      trigger: stage,
      start: 'top 80%',
      end: 'top 60%',
      scrub: 1
    },
    opacity: 1,
    y: 0
  })

  // 进度条
  gsap.to(bar, {
    scrollTrigger: {
      trigger: stage,
      start: 'top 70%',
      end: 'top 30%',
      scrub: 0.5
    },
    scaleX: 1
  })

  // 逐行填充
  lines.forEach((line, lineIndex) => {
    const chars = line.querySelectorAll('.ot-char-195')
    
    gsap.to(chars, {
      scrollTrigger: {
        trigger: stage,
        start: `top ${80 - lineIndex * 15}%`,
        end: `top ${50 - lineIndex * 10}%`,
        scrub: 0.8
      },
      color: '#ffffff',
      textShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
      stagger: 0.05
    })

    // 字符悬停效果
    chars.forEach((char: Element, charIndex: number) => {
      const charEl = char as HTMLElement
      charEl.addEventListener('mouseenter', () => {
        gsap.to(charEl, {
          scale: 1.3,
          textShadow: '0 0 40px rgba(255, 255, 255, 0.9), 0 0 60px rgba(100, 200, 255, 0.5)',
          duration: 0.3,
          ease: 'back.out(1.7)'
        })
      })

      charEl.addEventListener('mouseleave', () => {
        gsap.to(charEl, {
          scale: 1,
          textShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
          duration: 0.3
        })
      })
    })
  })

  // 脉冲动画
  gsap.to(allChars, {
    opacity: 0.9,
    duration: 0.5,
    repeat: -1,
    yoyo: true,
    stagger: {
      each: 0.1,
      from: 'random'
    },
    ease: 'sine.inOut'
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

.outline-text-wrapper-195 {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  overflow: hidden;

  opacity: 1 !important;}

.ot-stage-195 {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;

  opacity: 1 !important;}

.ot-particles-bg-195 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.ot-particle-195 {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;

  opacity: 1 !important;}

.ot-container-195 {
  position: relative;
  text-align: center;
  z-index: 10;
  max-width: 900px;

  opacity: 1 !important;}

.ot-title-195 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 60px;
  letter-spacing: 6px;
  color: #ffffff;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.5);

  opacity: 1 !important;}

.ot-text-stage-195 {
  padding: 40px 60px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 40px;

  opacity: 1 !important;}

.ot-text-line-195 {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 35px;
}

.ot-char-195 {
  display: inline-block;
  font-size: 3.5rem;
  font-weight: 900;
  letter-spacing: 4px;
  -webkit-text-stroke: 2px #ffffff;
  color: transparent;
  transition: all 0.3s ease;
  min-width: 25px;
  position: relative;

  opacity: 1 !important;}

.ot-char-195::before {
  content: attr(data-char);
  position: absolute;
  top: 0;
  left: 0;
  -webkit-text-stroke: 2px #ffffff;
  color: transparent;
}

.ot-fill-progress-195 {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 30px;

  opacity: 1 !important;}

.ot-progress-bar-195 {
  height: 100%;
  width: 100%;
  background: linear-gradient(90deg, #00d9ff, #00ff88, #ff6b6b);
  border-radius: 4px;
  transform-origin: left;

  opacity: 1 !important;}

.ot-hint-195 {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 2px;
  text-transform: uppercase;

  opacity: 1 !important;}

@media (max-width: 768px) {
  .ot-title-195 {
    font-size: 2rem;
  
  opacity: 1 !important;}

  .ot-char-195 {
    font-size: 2rem;
    min-width: 18px;
  
  opacity: 1 !important;}

  .ot-text-stage-195 {
    padding: 30px 20px;
  
  opacity: 1 !important;}
}
</style>
