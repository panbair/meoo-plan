<template>
  <div class="text-glow-wrapper-197">
    <div class="tg-stage-197" ref="stageRef">
      <div class="tg-glow-orbs-197">
        <div class="tg-glow-orb-197" v-for="i in 6" :key="i"></div>
      </div>
      <div class="tg-container-197" ref="containerRef">
        <h2 class="tg-title-197">BREATHING GLOW</h2>
        <div class="tg-text-stage-197">
          <div class="tg-text-line-197" v-for="(line, lineIndex) in textLines" :key="lineIndex">
            <span
              class="tg-char-197"
              v-for="(char, charIndex) in line.split('')"
              :key="charIndex"
            >
              {{ char }}
            </span>
          </div>
        </div>
        <div class="tg-glow-intensity-197">
          <div class="tg-intensity-bar-197" v-for="i in 12" :key="i"></div>
        </div>
        <p class="tg-hint-197">Breathing animation</p>
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
const textLines = ref(['BREATHING', 'PULSING', 'GLOWING'])

const initAnimations = () => {
  const stage = stageRef.value
  const container = containerRef.value
  if (!stage || !container) return

  const title = container.querySelector('.tg-title-197')
  const lines = container.querySelectorAll('.tg-text-line-197')
  const allChars = container.querySelectorAll('.tg-char-197')
  const glowOrbs = gsap.utils.toArray('.tg-glow-orb-197') as HTMLElement[]
  const intensityBars = gsap.utils.toArray('.tg-intensity-bar-197') as HTMLElement[]

  // 初始状态
  gsap.set(title, { opacity: 0, y: -50, textShadow: 'none' })
  gsap.set(allChars, { opacity: 0, textShadow: 'none' })
  gsap.set(glowOrbs, { opacity: 0, scale: 0 })
  gsap.set(intensityBars, { scaleY: 0 })

  // 发光球体
  gsap.to(glowOrbs, {
    scrollTrigger: {
      trigger: stage,
      start: 'top 80%',
      end: 'top 50%',
      scrub: 1
    },
    opacity: 0.6,
    scale: 1,
    stagger: 0.2
  })

  glowOrbs.forEach((orb, i) => {
    gsap.to(orb, {
      x: () => (Math.random() - 0.5) * 200,
      y: () => (Math.random() - 0.5) * 200,
      duration: 4 + i,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })

    // 呼吸动画
    gsap.to(orb, {
      scale: 0.5 + Math.random() * 0.5,
      duration: 2 + i * 0.3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })

    // 发光脉冲
    gsap.to(orb, {
      boxShadow: '0 0 60px rgba(255, 200, 100, 0.8)',
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
  })

  // 标题呼吸发光
  gsap.to(title, {
    scrollTrigger: {
      trigger: stage,
      start: 'top 75%',
      end: 'top 60%',
      scrub: 1
    },
    opacity: 1,
    y: 0
  })

  gsap.to(title, {
    textShadow: [
      '0 0 10px rgba(255, 255, 255, 0.5)',
      '0 0 30px rgba(255, 255, 255, 0.8)',
      '0 0 50px rgba(255, 200, 100, 1)',
      '0 0 70px rgba(255, 150, 50, 0.8)',
      '0 0 30px rgba(255, 255, 255, 0.8)',
      '0 0 10px rgba(255, 255, 255, 0.5)'
    ],
    duration: 3,
    repeat: -1,
    ease: 'sine.inOut'
  })

  // 强度条
  gsap.to(intensityBars, {
    scrollTrigger: {
      trigger: stage,
      start: 'top 60%',
      end: 'top 40%',
      scrub: 0.5
    },
    scaleY: 1,
    stagger: 0.1
  })

  intensityBars.forEach((bar, i) => {
    gsap.to(bar, {
      scaleY: 0.3 + Math.random() * 0.7,
      duration: 1.5 + i * 0.1,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })

    gsap.to(bar, {
      boxShadow: `0 0 ${10 + i * 3}px rgba(255, 200, 100, 0.8)`,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
  })

  // 逐行呼吸发光
  lines.forEach((line, lineIndex) => {
    const chars = line.querySelectorAll('.tg-char-197')
    
    gsap.to(chars, {
      scrollTrigger: {
        trigger: stage,
        start: `top ${70 - lineIndex * 15}%`,
        end: `top ${40 - lineIndex * 10}%`,
        scrub: 0.8
      },
      opacity: 1,
      stagger: 0.05
    })

    // 字符呼吸动画
    chars.forEach((char: Element, charIndex: number) => {
      const charEl = char as HTMLElement
      
      gsap.to(charEl, {
        textShadow: [
          '0 0 5px rgba(255, 255, 255, 0.3)',
          '0 0 15px rgba(255, 255, 255, 0.6)',
          '0 0 25px rgba(255, 200, 100, 0.9)',
          '0 0 15px rgba(255, 255, 255, 0.6)',
          '0 0 5px rgba(255, 255, 255, 0.3)'
        ],
        duration: 2.5 + charIndex * 0.1,
        repeat: -1,
        ease: 'sine.inOut',
        delay: lineIndex * 0.3
      })

      // 字符悬停效果
      charEl.addEventListener('mouseenter', () => {
        gsap.to(charEl, {
          scale: 1.3,
          textShadow: '0 0 50px rgba(255, 200, 100, 1), 0 0 80px rgba(255, 150, 50, 0.8)',
          duration: 0.3,
          ease: 'back.out(1.7)'
        })
      })

      charEl.addEventListener('mouseleave', () => {
        gsap.to(charEl, {
          scale: 1,
          duration: 0.3
        })
      })
    })
  })

  // 整体氛围呼吸
  gsap.to('.tg-text-stage-197', {
    boxShadow: [
      '0 0 20px rgba(255, 200, 100, 0.2)',
      '0 0 40px rgba(255, 200, 100, 0.4)',
      '0 0 60px rgba(255, 200, 100, 0.6)',
      '0 0 40px rgba(255, 200, 100, 0.4)',
      '0 0 20px rgba(255, 200, 100, 0.2)'
    ],
    duration: 3,
    repeat: -1,
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

.text-glow-wrapper-197 {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: radial-gradient(ellipse at center, #1a1a2e 0%, #0f0f1a 100%);
  overflow: hidden;

  opacity: 1 !important;}

.tg-stage-197 {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;

  opacity: 1 !important;}

.tg-glow-orbs-197 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.tg-glow-orb-197 {
  position: absolute;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 200, 100, 0.6) 0%, transparent 70%);
  filter: blur(20px);

  opacity: 1 !important;}

.tg-container-197 {
  position: relative;
  text-align: center;
  z-index: 10;
  max-width: 900px;

  opacity: 1 !important;}

.tg-title-197 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 60px;
  letter-spacing: 6px;
  color: #ffffff;

  opacity: 1 !important;}

.tg-text-stage-197 {
  padding: 40px 60px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 200, 100, 0.3);
  margin-bottom: 40px;
  transition: all 0.3s ease;

  opacity: 1 !important;}

.tg-text-line-197 {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 35px;
}

.tg-char-197 {
  display: inline-block;
  font-size: 4rem;
  font-weight: 900;
  letter-spacing: 4px;
  color: #ffffff;
  transition: all 0.3s ease;
  min-width: 25px;

  opacity: 1 !important;}

.tg-glow-intensity-197 {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 8px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  backdrop-filter: blur(10px);
  height: 80px;

  opacity: 1 !important;}

.tg-intensity-bar-197 {
  width: 8px;
  height: 100%;
  border-radius: 4px;
  background: linear-gradient(180deg, rgba(255, 200, 100, 0.8), rgba(255, 150, 50, 0.4));
  transform-origin: bottom;

  opacity: 1 !important;}

.tg-hint-197 {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 2px;
  text-transform: uppercase;

  opacity: 1 !important;}

@keyframes breathe {
  0%, 100% {
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  }
  50% {
    text-shadow: 0 0 30px rgba(255, 200, 100, 0.8), 0 0 50px rgba(255, 150, 50, 0.6);
  }
}

@media (max-width: 768px) {
  .tg-title-197 {
    font-size: 2rem;
  
  opacity: 1 !important;}

  .tg-char-197 {
    font-size: 2.5rem;
  
  opacity: 1 !important;}

  .tg-text-stage-197 {
    padding: 30px 20px;
  
  opacity: 1 !important;}
}
</style>
