<template>
  <div class="text-scramble-wrapper-190">
    <div class="ts-stage-190" ref="stageRef">
      <div class="ts-matrix-bg-190">
        <div class="ts-matrix-column-190" v-for="i in 20" :key="i">
          <span class="ts-matrix-char-190" v-for="j in 15" :key="j"></span>
        </div>
      </div>
      <div class="ts-container-190" ref="containerRef">
        <h2 class="ts-title-190">DECODE MESSAGE</h2>
        <div class="ts-content-190">
          <div class="ts-line-190" v-for="(line, lineIndex) in textLines" :key="lineIndex">
            <span class="ts-char-190" v-for="(char, charIndex) in line" :key="charIndex" :data-char="char">
              {{ char }}
            </span>
          </div>
        </div>
        <div class="ts-progress-190">
          <div class="ts-progress-bar-190" ref="progressBarRef"></div>
        </div>
        <div class="ts-indicator-190">
          <div class="ts-dot-190" v-for="i in 5" :key="i" :class="{ active: i <= progress }"></div>
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
const progressBarRef = ref<HTMLElement>()
const textLines = ref([
  'SYSTEM ACCESS GRANTED',
  'DECRYPTING DATA STREAM',
  'BYPASSING SECURITY FIREWALL',
  'EXTRACTING CLASSIFIED FILES'
])
const progress = ref(0)

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()'

const scrambleChar = (element: HTMLElement, finalChar: string, duration: number) => {
  let iterations = 0
  const maxIterations = duration * 30
  let currentString = finalChar

  const interval = setInterval(() => {
    const scrambled = currentString
      .split('')
      .map((char, i) => {
        if (i < iterations / (maxIterations / finalChar.length)) {
          return finalChar[i]
        }
        return chars[Math.floor(Math.random() * chars.length)]
      })
      .join('')

    element.textContent = scrambled
    iterations++

    if (iterations >= maxIterations) {
      element.textContent = finalChar
      clearInterval(interval)
    }
  }, 50)
}

const initAnimations = () => {
  const stage = stageRef.value
  const container = containerRef.value
  const progressBar = progressBarRef.value
  if (!stage || !container || !progressBar) return

  const title = container.querySelector('.ts-title-190')
  const lines = container.querySelectorAll('.ts-line-190')
  const allChars = container.querySelectorAll('.ts-char-190')
  const matrixChars = gsap.utils.toArray('.ts-matrix-char-190') as HTMLElement[]
  const dots = gsap.utils.toArray('.ts-dot-190') as HTMLElement[]

  // 初始状态
  gsap.set(title, { opacity: 0, y: -50 })
  gsap.set(lines, { opacity: 0 })
  gsap.set(allChars, { opacity: 0 })
  gsap.set(matrixChars, { opacity: 0 })
  gsap.set(progressBar, { width: 0 })
  gsap.set(dots, { scale: 0, opacity: 0 })

  // 初始化矩阵背景字符
  matrixChars.forEach(char => {
    char.textContent = chars[Math.floor(Math.random() * chars.length)]
  })

  // 标题解码效果
  gsap.to(title, {
    scrollTrigger: {
      trigger: stage,
      start: 'top 80%',
      end: 'top 60%',
      scrub: 1
    },
    opacity: 1,
    y: 0,
    onUpdate: () => {
      if (title instanceof HTMLElement) {
        const originalText = title.textContent || ''
        let decodedLength = 0
        const interval = setInterval(() => {
          decodedLength++
          const decoded = originalText
            .split('')
            .map((char, i) => (i < decodedLength ? char : chars[Math.floor(Math.random() * chars.length)]))
            .join('')
          title.textContent = decoded
          if (decodedLength >= originalText.length) {
            title.textContent = originalText
            clearInterval(interval)
          }
        }, 50)
      }
    }
  })

  // 矩阵背景
  gsap.to(matrixChars, {
    scrollTrigger: {
      trigger: stage,
      start: 'top 70%',
      end: 'top 30%',
      scrub: 0.5
    },
    opacity: 0.2,
    stagger: {
      each: 0.02,
      from: 'random'
    }
  })

  // 持续矩阵动画
  matrixChars.forEach(char => {
    setInterval(() => {
      char.textContent = chars[Math.floor(Math.random() * chars.length)]
    }, 100 + Math.random() * 200)
  })

  // 进度条指示器
  gsap.to(dots, {
    scrollTrigger: {
      trigger: stage,
      start: 'top 60%',
      end: 'bottom 40%',
      scrub: 1
    },
    scale: 1,
    opacity: 1,
    stagger: 0.15
  })

  // 逐行解码
  lines.forEach((line, lineIndex) => {
    gsap.to(line, {
      scrollTrigger: {
        trigger: stage,
        start: 'top 70%',
        end: 'top 30%',
        scrub: 1
      },
      opacity: 1,
      delay: lineIndex * 0.2
    })

    const charsInLine = line.querySelectorAll('.ts-char-190')
    charsInLine.forEach((charEl, charIndex) => {
      const finalChar = charEl.getAttribute('data-char') || ''

      gsap.to(charEl, {
        scrollTrigger: {
          trigger: stage,
          start: 'top 60%',
          end: 'top 20%',
          scrub: 1
        },
        opacity: 1,
        delay: lineIndex * 0.2 + charIndex * 0.02,
        onUpdate: function () {
          const progress = this.progress()
          if (progress > 0.5 && charEl instanceof HTMLElement && !charEl.dataset.decoded) {
            scrambleChar(charEl, finalChar, 2)
            charEl.dataset.decoded = 'true'
          }
        }
      })
    })
  })

  // 进度条
  gsap.to(progressBar, {
    scrollTrigger: {
      trigger: stage,
      start: 'top 50%',
      end: 'bottom 50%',
      scrub: 1,
      onUpdate: (self) => {
        progress.value = Math.floor(self.progress * 5)
      }
    },
    width: '100%'
  })

  // 字符悬停效果
  allChars.forEach(char => {
    char.addEventListener('mouseenter', () => {
      gsap.to(char, {
        color: '#00ff88',
        textShadow: '0 0 20px rgba(0, 255, 136, 0.8)',
        scale: 1.2,
        duration: 0.2
      })

      if (char instanceof HTMLElement && !char.dataset.decoded) {
        const originalChar = char.getAttribute('data-char') || ''
        scrambleChar(char, originalChar, 0.5)
        char.dataset.decoded = 'true'
      }
    })

    char.addEventListener('mouseleave', () => {
      gsap.to(char, {
        color: '#00ff88',
        textShadow: '0 0 10px rgba(0, 255, 136, 0.5)',
        scale: 1,
        duration: 0.2
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

.text-scramble-wrapper-190 {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(180deg, #000 0%, #0a0a0a 100%);
  overflow: hidden;

  opacity: 1 !important;}

.ts-stage-190 {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;

  opacity: 1 !important;}

.ts-matrix-bg-190 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  pointer-events: none;
  z-index: 1;
}

.ts-matrix-column-190 {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ts-matrix-char-190 {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  color: #00ff88;
  text-shadow: 0 0 5px rgba(0, 255, 136, 0.5);

  opacity: 1 !important;}

.ts-container-190 {
  position: relative;
  text-align: center;
  z-index: 10;
  max-width: 900px;
  padding: 60px 40px;
  background: rgba(0, 20, 0, 0.8);
  border-radius: 10px;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(0, 255, 136, 0.3);

  opacity: 1 !important;}

.ts-title-190 {
  font-size: 3rem;
  font-weight: 700;
  color: #00ff88;
  margin-bottom: 60px;
  text-shadow: 0 0 30px rgba(0, 255, 136, 0.8);
  letter-spacing: 4px;
  font-family: 'Courier New', monospace;

  opacity: 1 !important;}

.ts-content-190 {
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-bottom: 50px;
}

.ts-line-190 {
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.ts-char-190 {
  display: inline-block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #00ff88;
  font-family: 'Courier New', monospace;
  text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
  transition: all 0.3s ease;
  min-width: 12px;

  opacity: 1 !important;}

.ts-progress-190 {
  width: 100%;
  height: 4px;
  background: rgba(0, 255, 136, 0.1);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 30px;

  opacity: 1 !important;}

.ts-progress-bar-190 {
  height: 100%;
  background: linear-gradient(90deg, #00ff88, #00cc6a);
  box-shadow: 0 0 20px rgba(0, 255, 136, 0.8);
  border-radius: 2px;

  opacity: 1 !important;}

.ts-indicator-190 {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.ts-dot-190 {
  width: 12px;
  height: 12px;
  background: rgba(0, 255, 136, 0.2);
  border: 2px solid rgba(0, 255, 136, 0.5);
  border-radius: 50%;
  transition: all 0.3s ease;

  opacity: 1 !important;}

.ts-dot-190.active {
  background: #00ff88;
  box-shadow: 0 0 15px rgba(0, 255, 136, 0.8);

  opacity: 1 !important;}

@media (max-width: 768px) {
  .ts-title-190 {
    font-size: 2rem;
  
  opacity: 1 !important;}

  .ts-char-190 {
    font-size: 1rem;
  
  opacity: 1 !important;}
}
</style>
