<template>
  <div class="wavy-text-wrapper-192">
    <div class="wt-stage-192" ref="stageRef">
      <div class="wt-ocean-bg-192">
        <canvas class="wt-wave-canvas-192" ref="waveCanvasRef"></canvas>
        <div class="wt-wave-layers-192">
          <div class="wt-wave-layer-192" v-for="i in 3" :key="i"></div>
        </div>
      </div>
      <div class="wt-bubbles-192">
        <div class="wt-bubble-192" v-for="i in 20" :key="i"></div>
      </div>
      <div class="wt-container-192" ref="containerRef">
        <h2 class="wt-title-192">OCEAN WAVES</h2>
        <div class="wt-text-container-192">
          <div class="wt-wavy-line-192" v-for="(line, lineIndex) in textLines" :key="lineIndex">
            <span
              class="wt-char-192"
              v-for="(char, charIndex) in line.split('')"
              :key="charIndex"
              :style="{ '--char-index': charIndex }"
            >
              {{ char }}
            </span>
          </div>
        </div>
        <div class="wt-wave-indicator-192">
          <div class="wt-wave-bar-192" v-for="i in 10" :key="i"></div>
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
const waveCanvasRef = ref<HTMLCanvasElement>()
const textLines = ref(['RIDE THE WAVES', 'DIVE INTO OCEAN', 'FEEL THE FLOW'])

let waveCtx: CanvasRenderingContext2D | null = null
let animationId: number | null = null
let waveOffset = 0

const initWaveCanvas = () => {
  const canvas = waveCanvasRef.value
  const stage = stageRef.value
  if (!canvas || !stage) return

  canvas.width = stage.offsetWidth
  canvas.height = stage.offsetHeight
  waveCtx = canvas.getContext('2d')
}

const animateWaves = () => {
  const canvas = waveCanvasRef.value
  if (!canvas || !waveCtx) return

  waveCtx.clearRect(0, 0, canvas.width, canvas.height)

  const colors = ['rgba(0, 150, 255, 0.3)', 'rgba(0, 200, 255, 0.2)', 'rgba(100, 200, 255, 0.1)']

  colors.forEach((color, layerIndex) => {
    waveCtx.beginPath()
    waveCtx.strokeStyle = color
    waveCtx.lineWidth = 2

    for (let x = 0; x <= canvas.width; x += 5) {
      const y =
        canvas.height / 2 +
        Math.sin((x + waveOffset * (layerIndex + 1)) * 0.01) * 50 +
        Math.sin((x + waveOffset * (layerIndex + 1)) * 0.02) * 30

      if (x === 0) {
        waveCtx.moveTo(x, y)
      } else {
        waveCtx.lineTo(x, y)
      }
    }

    waveCtx.stroke()
  })

  waveOffset += 2
  animationId = requestAnimationFrame(animateWaves)
}

const initAnimations = () => {
  const stage = stageRef.value
  const container = containerRef.value
  if (!stage || !container) return

  const title = container.querySelector('.wt-title-192')
  const lines = container.querySelectorAll('.wt-wavy-line-192')
  const allChars = container.querySelectorAll('.wt-char-192')
  const bubbles = gsap.utils.toArray('.wt-bubble-192') as HTMLElement[]
  const waveBars = gsap.utils.toArray('.wt-wave-bar-192') as HTMLElement[]
  const waveLayers = gsap.utils.toArray('.wt-wave-layer-192') as HTMLElement[]

  // 初始状态
  gsap.set(title, { opacity: 0, y: -50 })
  gsap.set(lines, { opacity: 0 })
  gsap.set(allChars, { y: 0 })
  gsap.set(bubbles, { opacity: 0, y: 100 })
  gsap.set(waveBars, { scaleY: 0 })
  gsap.set(waveLayers, { y: 100 })

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

  // 波浪层升起
  gsap.to(waveLayers, {
    scrollTrigger: {
      trigger: stage,
      start: 'top 75%',
      end: 'top 50%',
      scrub: 1
    },
    y: 0,
    stagger: 0.3
  })

  // 气泡升起
  gsap.to(bubbles, {
    scrollTrigger: {
      trigger: stage,
      start: 'top 70%',
      end: 'top 40%',
      scrub: 0.5
    },
    opacity: 0.6,
    y: (i) => -50 - i * 10,
    stagger: {
      each: 0.1,
      from: 'random'
    }
  })

  // 持续气泡动画
  bubbles.forEach((bubble, i) => {
    gsap.to(bubble, {
      y: -100 - i * 20,
      duration: 3 + Math.random() * 2,
      repeat: -1,
      ease: 'none'
    })
  })

  // 波浪指示器
  gsap.to(waveBars, {
    scrollTrigger: {
      trigger: stage,
      start: 'top 60%',
      end: 'top 30%',
      scrub: 0.5
    },
    scaleY: 1,
    stagger: 0.1
  })

  // 波浪指示器持续动画
  waveBars.forEach((bar, i) => {
    gsap.to(bar, {
      scaleY: 0.5 + Math.random() * 0.5,
      duration: 1 + i * 0.1,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
  })

  // 逐行显示
  lines.forEach((line, lineIndex) => {
    gsap.to(line, {
      scrollTrigger: {
        trigger: stage,
        start: 'top 65%',
        end: 'top 35%',
        scrub: 1
      },
      opacity: 1
    })

    const chars = line.querySelectorAll('.wt-char-192')
    chars.forEach((char, charIndex) => {
      // 波浪效果
      gsap.to(char, {
        scrollTrigger: {
          trigger: stage,
          start: 'top 60%',
          end: 'bottom 40%',
          scrub: 0.5
        },
        y: (i) => Math.sin(i * 0.5 + charIndex * 0.3) * 30,
        rotation: (i) => Math.sin(i * 0.3 + charIndex * 0.2) * 10
      })

      // 持续波浪动画
      gsap.to(char, {
        y: Math.sin(charIndex * 0.5) * 20,
        duration: 2 + charIndex * 0.1,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })
    })
  })

  // 字符悬停效果
  allChars.forEach(char => {
    char.addEventListener('mouseenter', () => {
      gsap.to(char, {
        scale: 1.3,
        color: '#00bfff',
        textShadow: '0 0 20px rgba(0, 191, 255, 0.8)',
        duration: 0.3
      })
    })

    char.addEventListener('mouseleave', () => {
      gsap.to(char, {
        scale: 1,
        color: '#fff',
        textShadow: 'none',
        duration: 0.3
      })
    })
  })
}

onMounted(() => {
  initWaveCanvas()
  animateWaves()
  initAnimations()
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
})
</script>

<style scoped>
/* GSAP opacity fix: ensure content is always visible */

.wavy-text-wrapper-192 {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(180deg, #001a33 0%, #003366 50%, #004d80 100%);
  overflow: hidden;

  opacity: 1 !important;}

.wt-stage-192 {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;

  opacity: 1 !important;}

.wt-ocean-bg-192 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.wt-wave-canvas-192 {
  width: 100%;
  height: 100%;

  opacity: 1 !important;}

.wt-wave-layers-192 {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 300px;

  opacity: 1 !important;}

.wt-wave-layer-192 {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  background: linear-gradient(90deg, transparent, rgba(0, 150, 255, 0.3), transparent);
  border-radius: 50% 50% 0 0;
  animation: wt-wave-192 3s ease-in-out infinite;

  opacity: 1 !important;}

.wt-wave-layer-192:nth-child(1) {
  opacity: 0.3;
  animation-delay: 0s;
}

.wt-wave-layer-192:nth-child(2) {
  opacity: 0.5;
  animation-delay: 1s;
  height: 80px;
}

.wt-wave-layer-192:nth-child(3) {
  opacity: 0.7;
  animation-delay: 2s;
  height: 60px;
}

@keyframes wt-wave-192 {
  0%, 100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(30px);
  }
}

.wt-bubbles-192 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.wt-bubble-192 {
  position: absolute;
  width: 20px;
  height: 20px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 70%);
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.3);

  opacity: 1 !important;}

.wt-container-192 {
  position: relative;
  text-align: center;
  z-index: 10;
  max-width: 900px;

  opacity: 1 !important;}

.wt-title-192 {
  font-size: 3rem;
  font-weight: 700;
  color: #00bfff;
  margin-bottom: 60px;
  text-shadow: 0 0 30px rgba(0, 191, 255, 0.8);
  letter-spacing: 6px;

  opacity: 1 !important;}

.wt-text-container-192 {
  padding: 40px 60px;
  background: rgba(0, 30, 60, 0.5);
  border-radius: 10px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 191, 255, 0.3);
  margin-bottom: 40px;

  opacity: 1 !important;}

.wt-wavy-line-192 {
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-bottom: 20px;
}

.wt-char-192 {
  display: inline-block;
  font-size: 3rem;
  font-weight: 900;
  color: #fff;
  transition: all 0.3s ease;
  min-width: 20px;

  opacity: 1 !important;}

.wt-wave-indicator-192 {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 8px;
  height: 60px;

  opacity: 1 !important;}

.wt-wave-bar-192 {
  width: 8px;
  background: linear-gradient(180deg, #00bfff, #0066cc);
  border-radius: 4px;
  transform-origin: bottom;

  opacity: 1 !important;}

@media (max-width: 768px) {
  .wt-title-192 {
    font-size: 2rem;
  
  opacity: 1 !important;}

  .wt-char-192 {
    font-size: 2rem;
  
  opacity: 1 !important;}
}
</style>
