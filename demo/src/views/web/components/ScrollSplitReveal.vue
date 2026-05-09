<template>
  <div class="split-reveal-wrapper-191">
    <div class="sr-stage-191" ref="stageRef">
      <div class="sr-bg-particles-191">
        <div class="sr-particle-191" v-for="i in 30" :key="i"></div>
      </div>
      <div class="sr-container-191" ref="containerRef">
        <h2 class="sr-title-191">SPLIT REVEAL</h2>
        <div class="sr-text-section-191">
          <div class="sr-direction-label-191">HORIZONTAL</div>
          <div class="sr-split-text-191" ref="horizontalTextRef">
            <span class="sr-word-191" v-for="(word, wordIndex) in horizontalText.split(' ')" :key="wordIndex">
              <span class="sr-char-191" v-for="(char, charIndex) in word.split('')" :key="charIndex">
                <span class="sr-char-top-191">{{ char }}</span>
                <span class="sr-char-bottom-191">{{ char }}</span>
              </span>
            </span>
          </div>
        </div>
        <div class="sr-text-section-191 sr-vertical-section-191">
          <div class="sr-direction-label-191">VERTICAL</div>
          <div class="sr-split-text-191" ref="verticalTextRef">
            <span class="sr-word-191" v-for="(word, wordIndex) in verticalText.split(' ')" :key="wordIndex">
              <span class="sr-char-191" v-for="(char, charIndex) in word.split('')" :key="charIndex">
                <span class="sr-char-left-191">{{ char }}</span>
                <span class="sr-char-right-191">{{ char }}</span>
              </span>
            </span>
          </div>
        </div>
        <div class="sr-divider-191">
          <div class="sr-divider-line-191"></div>
          <div class="sr-divider-center-191"></div>
          <div class="sr-divider-line-191"></div>
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
const horizontalTextRef = ref<HTMLElement>()
const verticalTextRef = ref<HTMLElement>()
const horizontalText = ref('SPLIT IT APART')
const verticalText = ref('REVEAL CONTENT')

const initAnimations = () => {
  const stage = stageRef.value
  const container = containerRef.value
  const hText = horizontalTextRef.value
  const vText = verticalTextRef.value
  if (!stage || !container || !hText || !vText) return

  const title = container.querySelector('.sr-title-191')
  const hChars = hText.querySelectorAll('.sr-char-191')
  const vChars = vText.querySelectorAll('.sr-char-191')
  const particles = gsap.utils.toArray('.sr-particle-191') as HTMLElement[]
  const divider = container.querySelector('.sr-divider-191')
  const dividerLines = gsap.utils.toArray('.sr-divider-line-191') as HTMLElement[]

  // 初始状态
  gsap.set(title, { opacity: 0, y: -50 })
  gsap.set(divider, { scaleX: 0 })
  gsap.set(hChars, { opacity: 0 })
  gsap.set(vChars, { opacity: 0 })

  // 水平分割字符初始状态
  hChars.forEach(char => {
    const top = char.querySelector('.sr-char-top-191') as HTMLElement
    const bottom = char.querySelector('.sr-char-bottom-191') as HTMLElement
    gsap.set(top, { y: '-100%' })
    gsap.set(bottom, { y: '100%' })
  })

  // 垂直分割字符初始状态
  vChars.forEach(char => {
    const left = char.querySelector('.sr-char-left-191') as HTMLElement
    const right = char.querySelector('.sr-char-right-191') as HTMLElement
    gsap.set(left, { x: '-100%' })
    gsap.set(right, { x: '100%' })
  })

  // 粒子
  gsap.set(particles, { opacity: 0, scale: 0 })

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

  // 粒子出现
  gsap.to(particles, {
    scrollTrigger: {
      trigger: stage,
      start: 'top 70%',
      end: 'top 50%',
      scrub: 0.5
    },
    opacity: 0.5,
    scale: 1,
    stagger: {
      each: 0.05,
      from: 'random'
    }
  })

  // 水平分割线
  gsap.to(divider, {
    scrollTrigger: {
      trigger: stage,
      start: 'top 60%',
      end: 'top 40%',
      scrub: 1
    },
    scaleX: 1
  })

  // 分割线扩展
  gsap.to(dividerLines, {
    scrollTrigger: {
      trigger: stage,
      start: 'top 55%',
      end: 'top 35%',
      scrub: 1
    },
    width: 200,
    stagger: 0.2
  })

  // 水平分割文字揭示
  hChars.forEach((char, i) => {
    const top = char.querySelector('.sr-char-top-191') as HTMLElement
    const bottom = char.querySelector('.sr-char-bottom-191') as HTMLElement

    gsap.to(char, {
      scrollTrigger: {
        trigger: stage,
        start: 'top 50%',
        end: 'top 20%',
        scrub: 1
      },
      opacity: 1
    })

    gsap.to(top, {
      scrollTrigger: {
        trigger: stage,
        start: 'top 50%',
        end: 'top 20%',
        scrub: 1
      },
      y: '-10%',
      delay: i * 0.03
    })

    gsap.to(bottom, {
      scrollTrigger: {
        trigger: stage,
        start: 'top 50%',
        end: 'top 20%',
        scrub: 1
      },
      y: '10%',
      delay: i * 0.03
    })
  })

  // 垂直分割文字揭示
  vChars.forEach((char, i) => {
    const left = char.querySelector('.sr-char-left-191') as HTMLElement
    const right = char.querySelector('.sr-char-right-191') as HTMLElement

    gsap.to(char, {
      scrollTrigger: {
        trigger: stage,
        start: 'top 40%',
        end: 'center center',
        scrub: 1
      },
      opacity: 1
    })

    gsap.to(left, {
      scrollTrigger: {
        trigger: stage,
        start: 'top 40%',
        end: 'center center',
        scrub: 1
      },
      x: '-10%',
      delay: i * 0.03
    })

    gsap.to(right, {
      scrollTrigger: {
        trigger: stage,
        start: 'top 40%',
        end: 'center center',
        scrub: 1
      },
      x: '10%',
      delay: i * 0.03
    })
  })

  // 持续动画
  gsap.to(particles, {
    y: -50,
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    stagger: 0.1
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

.split-reveal-wrapper-191 {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  overflow: hidden;

  opacity: 1 !important;}

.sr-stage-191 {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;

  opacity: 1 !important;}

.sr-bg-particles-191 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.sr-particle-191 {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;

  opacity: 1 !important;}

.sr-container-191 {
  position: relative;
  text-align: center;
  z-index: 10;
  max-width: 1000px;

  opacity: 1 !important;}

.sr-title-191 {
  font-size: 3rem;
  font-weight: 700;
  color: #e94560;
  margin-bottom: 60px;
  text-shadow: 0 0 30px rgba(233, 69, 96, 0.5);
  letter-spacing: 8px;

  opacity: 1 !important;}

.sr-text-section-191 {
  margin-bottom: 40px;
  padding: 40px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(233, 69, 96, 0.3);

  opacity: 1 !important;}

.sr-vertical-section-191 {
  border-color: rgba(0, 212, 255, 0.3);

  opacity: 1 !important;}

.sr-direction-label-191 {
  font-size: 0.8rem;
  color: #888;
  margin-bottom: 20px;
  letter-spacing: 4px;
  text-transform: uppercase;

  opacity: 1 !important;}

.sr-split-text-191 {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.sr-word-191 {
  display: flex;
  gap: 2px;
}

.sr-char-191 {
  display: inline-block;
  position: relative;
  overflow: hidden;
  font-size: 3rem;
  font-weight: 900;
  color: #fff;
  min-width: 30px;
  height: 60px;

  opacity: 1 !important;}

.sr-char-top-191,
.sr-char-bottom-191 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  opacity: 1 !important;}

.sr-char-top-191 {
  clip-path: polygon(0 0, 100% 0, 100% 50%, 0 50%);
  border-bottom: 1px solid rgba(233, 69, 96, 0.5);
}

.sr-char-bottom-191 {
  top: 50%;
  clip-path: polygon(0 50%, 100% 50%, 100% 100%, 0 100%);
}

.sr-char-left-191,
.sr-char-right-191 {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  opacity: 1 !important;}

.sr-char-left-191 {
  left: 0;
  clip-path: polygon(0 0, 50% 0, 50% 100%, 0 100%);
  border-right: 1px solid rgba(0, 212, 255, 0.5);
}

.sr-char-right-191 {
  left: 50%;
  clip-path: polygon(50% 0, 100% 0, 100% 100%, 50% 100%);
}

.sr-divider-191 {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 40px 0;
  transform-origin: center;

  opacity: 1 !important;}

.sr-divider-line-191 {
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(233, 69, 96, 0.8), rgba(0, 212, 255, 0.8), transparent);
  transition: width 0.5s ease;

  opacity: 1 !important;}

.sr-divider-center-191 {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(233, 69, 96, 0.8);
  border-radius: 50%;
  margin: 0 20px;
  animation: sr-pulse-191 2s ease-in-out infinite;

  opacity: 1 !important;}

@keyframes sr-pulse-191 {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(233, 69, 96, 0.4);
  }
  50% {
    transform: scale(1.2);
    box-shadow: 0 0 0 10px rgba(233, 69, 96, 0);
  }
}

@media (max-width: 768px) {
  .sr-title-191 {
    font-size: 2rem;
  
  opacity: 1 !important;}

  .sr-char-191 {
    font-size: 2rem;
    min-width: 20px;
    height: 40px;
  
  opacity: 1 !important;}
}
</style>
