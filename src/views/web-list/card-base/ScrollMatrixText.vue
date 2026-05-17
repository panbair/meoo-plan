<template>
  <div class="matrix-text-wrapper-176">
    <div class="mt-stage-176" ref="stageRef">
      <canvas class="mt-matrix-canvas-176" ref="canvasRef"></canvas>
      <div class="mt-matrix-container-176" ref="containerRef">
        <h2 class="mt-title-176">MATRIX</h2>
        <div class="mt-binary-stream-176" ref="binaryRef">
          <span class="mt-binary-char-176">{{ binaryText }}</span>
        </div>
        <div class="mt-matrix-text-176">
          <span class="mt-char-176" v-for="(char, i) in text.split('')" :key="i">{{ char }}</span>
        </div>
        <div class="mt-code-columns-176">
          <div class="mt-column-176" v-for="i in 8" :key="i"></div>
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
const canvasRef = ref<HTMLCanvasElement>()
const binaryRef = ref<HTMLElement>()
const text = 'SYSTEM ACTIVE'
let ctx: gsap.Context
let animationFrameId: number

// 生成二进制流
const generateBinary = (length: number) => {
  return Array.from({ length }, () => Math.random() > 0.5 ? '1' : '0').join(' ')
}
const binaryText = generateBinary(100)

// Matrix雨滴效果
const initMatrixRain = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  const stage = stageRef.value
  if (!stage) return

  canvas.width = stage.offsetWidth
  canvas.height = stage.offsetHeight

  const context = canvas.getContext('2d')
  if (!context) return

  const fontSize = 16
  const columns = Math.floor(canvas.width / fontSize)
  const drops: number[] = Array(columns).fill(1)

  const chars = '01アイウエオカキクケコサシスセソタチツテト'

  const draw = () => {
    context.fillStyle = 'rgba(0, 0, 0, 0.05)'
    context.fillRect(0, 0, canvas.width, canvas.height)

    context.fillStyle = '#0f0'
    context.font = `${fontSize}px monospace`

    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)]
      context.fillText(char, i * fontSize, drops[i] * fontSize)

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0
      }
      drops[i]++
    }

    animationFrameId = requestAnimationFrame(draw)
  }

  draw()
}

onMounted(() => {
  ctx = gsap.context(() => {
    const stage = stageRef.value
    const container = containerRef.value
    const binary = binaryRef.value
    if (!stage || !container) return

    initMatrixRain()

    const chars = gsap.utils.toArray('.mt-char-176') as HTMLElement[]
    const columns = gsap.utils.toArray('.mt-column-176') as HTMLElement[]
    const title = stage.querySelector('.mt-title-176')

    // 标题矩阵效果
    if (title) {
      gsap.fromTo(title,
        { opacity: 0, color: '#000' },
        {
          scrollTrigger: {
            trigger: stage,
            start: 'top 80%',
            end: 'top 60%',
            scrub: 1
          },
          opacity: 1,
          color: '#0f0'
        }
      )

      // 标题闪烁
      gsap.to(title, {
        textShadow: '0 0 20px #0f0, 0 0 40px #0f0',
        duration: 0.5,
        repeat: -1,
        yoyo: true
      })
    }

    // 二进制流滚动
    if (binary) {
      gsap.fromTo(binary,
        { opacity: 0, x: -100 },
        {
          scrollTrigger: {
            trigger: stage,
            start: 'top 70%',
            end: 'top 50%',
            scrub: 1
          },
          opacity: 0.8,
          x: 0
        }
      )
    }

    // Matrix文字动画
    gsap.fromTo(chars,
      {
        color: '#003300',
        textShadow: 'none',
        opacity: 0,
        y: -30
      },
      {
        scrollTrigger: {
          trigger: stage,
          start: 'top 60%',
          end: 'center 50%',
          scrub: 1
        },
        color: '#0f0',
        textShadow: '0 0 10px #0f0, 0 0 20px #0f0',
        opacity: 1,
        y: 0,
        stagger: 0.05
      }
    )

    // 字符随机变换效果
    chars.forEach((char, i) => {
      setInterval(() => {
        if (Math.random() > 0.95) {
          const originalChar = char.textContent || ''
          char.textContent = Math.random() > 0.5 ? '1' : '0'
          setTimeout(() => {
            char.textContent = originalChar
          }, 100)
        }
      }, 500)
    })

    // 代码列效果
    gsap.fromTo(columns,
      { scaleY: 0, opacity: 0 },
      {
        scrollTrigger: {
          trigger: stage,
          start: 'top 50%',
          end: 'bottom 30%',
          scrub: 1
        },
        scaleY: 1,
        opacity: 1,
        stagger: 0.15
      }
    )

    columns.forEach((column, i) => {
      gsap.to(column, {
        scaleY: 0.3 + Math.random() * 0.7,
        duration: 0.2 + Math.random() * 0.3,
        repeat: -1,
        yoyo: true,
        delay: i * 0.1
      })
    })

    // 容器边框发光
    gsap.to(container, {
      borderColor: '#0f0',
      boxShadow: '0 0 50px rgba(0, 255, 0, 0.5), inset 0 0 30px rgba(0, 255, 0, 0.1)',
      scrollTrigger: {
        trigger: stage,
        start: 'top 40%',
        end: 'bottom 20%',
        scrub: 1
      }
    })

  }, stageRef.value)
})

onUnmounted(() => {
  ctx?.revert()
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})
</script>

<style scoped lang="scss">
.matrix-text-wrapper-176 {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  overflow: hidden;

  opacity: 1 !important;}

.mt-stage-176 {
  position: relative;
  width: 100%;
  max-width: 1200px;
  padding: 60px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;

  opacity: 1 !important;}

.mt-matrix-canvas-176 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.3;
}

.mt-matrix-container-176 {
  position: relative;
  text-align: center;
  padding: 80px 60px;
  background: rgba(0, 0, 0, 0.85);
  border: 2px solid #0f0;
  border-radius: 5px;
  overflow: hidden;
  backdrop-filter: blur(5px);

  opacity: 1 !important;}

.mt-title-176 {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 900;
  color: #0f0;
  text-transform: uppercase;
  letter-spacing: 8px;
  margin-bottom: 30px;
  font-family: 'Courier New', monospace;

  opacity: 1 !important;}

.mt-binary-stream-176 {
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  color: #0f0;
  opacity: 0.6;
  margin-bottom: 40px;
  overflow: hidden;
  white-space: nowrap;
}

.mt-matrix-text-176 {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 4px;
  margin: 40px 0;

  opacity: 1 !important;}

.mt-char-176 {
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 900;
  text-transform: uppercase;
  position: relative;
  display: inline-block;
  font-family: 'Courier New', monospace;
  transition: all 0.3s ease;

  opacity: 1 !important;}

.mt-char-176:hover {
  transform: scale(1.2);
  text-shadow: '0 0 30px #0f0, 0 0 60px #0f0' !important;
}

.mt-code-columns-176 {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 50px;
}

.mt-column-176 {
  width: 4px;
  height: 120px;
  background: linear-gradient(180deg, transparent, #0f0, transparent);
  transform-origin: center;
  border-radius: 2px;

  opacity: 1 !important;}
</style>
