<template>
  <div class="rain-text-wrapper-187">
    <div class="rt-stage-187" ref="stageRef">
      <div class="rt-rain-bg-187">
        <canvas class="rt-rain-canvas-187" ref="canvasRef"></canvas>
      </div>
      <div class="rt-ripple-container-187">
        <div class="rt-ripple-187" v-for="i in 15" :key="i"></div>
      </div>
      <div class="rt-rain-container-187" ref="containerRef">
        <h2 class="rt-title-187">RAIN FALLS</h2>
        <div class="rt-rain-drops-187">
          <div class="rt-rain-drop-187" v-for="i in 50" :key="i"></div>
        </div>
        <div class="rt-text-container-187">
          <span class="rt-char-187" v-for="(char, i) in text.split('')" :key="i">{{ char }}</span>
        </div>
        <div class="rt-puddles-187">
          <div class="rt-puddle-187" v-for="i in 5" :key="i"></div>
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
const text = ref('RAINDROPS')

let ctx: CanvasRenderingContext2D | null = null
let animationId: number | null = null
let raindrops: Array<{ x: number; y: number; speed: number; length: number; opacity: number }> = []

const initRainCanvas = () => {
  const canvas = canvasRef.value
  const stage = stageRef.value
  if (!canvas || !stage) return

  canvas.width = stage.offsetWidth
  canvas.height = stage.offsetHeight
  ctx = canvas.getContext('2d')

  // 初始化雨滴
  for (let i = 0; i < 100; i++) {
    raindrops.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: 5 + Math.random() * 10,
      length: 10 + Math.random() * 20,
      opacity: 0.3 + Math.random() * 0.5
    })
  }
}

const animateRain = () => {
  const canvas = canvasRef.value
  if (!canvas || !ctx) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // 绘制雨滴
  ctx.strokeStyle = 'rgba(100, 180, 255, 0.6)'
  ctx.lineWidth = 1

  raindrops.forEach(drop => {
    ctx.beginPath()
    ctx.globalAlpha = drop.opacity
    ctx.moveTo(drop.x, drop.y)
    ctx.lineTo(drop.x, drop.y + drop.length)
    ctx.stroke()

    drop.y += drop.speed

    if (drop.y > canvas.height) {
      drop.y = -drop.length
      drop.x = Math.random() * canvas.width
    }
  })

  ctx.globalAlpha = 1
  animationId = requestAnimationFrame(animateRain)
}

const initAnimations = () => {
  const stage = stageRef.value
  const container = containerRef.value
  if (!stage || !container) return

  const chars = gsap.utils.toArray('.rt-char-187') as HTMLElement[]
  const title = container.querySelector('.rt-title-187')
  const drops = gsap.utils.toArray('.rt-rain-drop-187') as HTMLElement[]
  const ripples = gsap.utils.toArray('.rt-ripple-187') as HTMLElement[]
  const puddles = gsap.utils.toArray('.rt-puddle-187') as HTMLElement[]

  // 初始状态
  gsap.set(chars, { opacity: 0, y: -30, scale: 0.8 })
  gsap.set(title, { opacity: 0, y: -50 })
  gsap.set(drops, { y: -100, opacity: 0 })
  gsap.set(ripples, { scale: 0, opacity: 0 })
  gsap.set(puddles, { scale: 0, opacity: 0 })

  // 标题入场
  gsap.to(title, {
    scrollTrigger: {
      trigger: stage,
      start: 'top 80%',
      end: 'top 50%',
      scrub: 1
    },
    opacity: 1,
    y: 0
  })

  // 雨滴落下
  gsap.to(drops, {
    scrollTrigger: {
      trigger: stage,
      start: 'top 70%',
      end: 'top 30%',
      scrub: 0.5
    },
    y: (i) => 100 + i * 20,
    opacity: 0.6,
    stagger: {
      each: 0.02,
      from: 'random'
    }
  })

  // 文字从雨滴汇聚
  gsap.to(chars, {
    scrollTrigger: {
      trigger: stage,
      start: 'top 60%',
      end: 'center center',
      scrub: 1
    },
    opacity: 1,
    y: 0,
    scale: 1,
    stagger: 0.08
  })

  // 水波纹扩散
  gsap.to(ripples, {
    scrollTrigger: {
      trigger: stage,
      start: 'top 50%',
      end: 'top 20%',
      scrub: 1
    },
    scale: 3,
    opacity: 0,
    duration: 2,
    stagger: 0.3,
    repeat: -1,
    ease: 'none'
  })

  // 水坑出现
  gsap.to(puddles, {
    scrollTrigger: {
      trigger: stage,
      start: 'top 40%',
      end: 'bottom 60%',
      scrub: 1
    },
    scale: 1,
    opacity: 0.8,
    stagger: 0.2
  })

  // 字符悬停效果
  chars.forEach(char => {
    char.addEventListener('mouseenter', () => {
      gsap.to(char, {
        y: -5,
        textShadow: '0 0 20px rgba(100, 180, 255, 0.8), 0 0 40px rgba(100, 180, 255, 0.6)',
        duration: 0.3
      })
    })

    char.addEventListener('mouseleave', () => {
      gsap.to(char, {
        y: 0,
        textShadow: 'none',
        duration: 0.3
      })
    })
  })
}

onMounted(() => {
  initRainCanvas()
  animateRain()
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

.rain-text-wrapper-187 {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(180deg, #1a2a3a 0%, #0d1b2a 50%, #061220 100%);
  overflow: hidden;

  opacity: 1 !important;}

.rt-stage-187 {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;

  opacity: 1 !important;}

.rt-rain-bg-187 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.rt-rain-canvas-187 {
  width: 100%;
  height: 100%;

  opacity: 1 !important;}

.rt-ripple-container-187 {
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  width: 300px;
  height: 150px;
  pointer-events: none;

  opacity: 1 !important;}

.rt-ripple-187 {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 100px;
  height: 50px;
  border: 2px solid rgba(100, 180, 255, 0.6);
  border-radius: 50%;
  transform: translateX(-50%);

  opacity: 1 !important;}

.rt-rain-container-187 {
  position: relative;
  text-align: center;
  z-index: 10;

  opacity: 1 !important;}

.rt-title-187 {
  font-size: 3rem;
  font-weight: 700;
  color: #4fc3f7;
  margin-bottom: 40px;
  text-shadow: 0 0 30px rgba(79, 195, 247, 0.5);
  letter-spacing: 4px;

  opacity: 1 !important;}

.rt-rain-drops-187 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.rt-rain-drop-187 {
  position: absolute;
  width: 2px;
  height: 20px;
  background: linear-gradient(180deg, transparent, rgba(100, 180, 255, 0.8));
  border-radius: 2px;

  opacity: 1 !important;}

.rt-text-container-187 {
  display: inline-block;
  position: relative;
  z-index: 5;
  padding: 30px 50px;
  background: rgba(0, 20, 40, 0.5);
  border-radius: 10px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(100, 180, 255, 0.3);

  opacity: 1 !important;}

.rt-char-187 {
  display: inline-block;
  font-size: 4rem;
  font-weight: 900;
  color: #4fc3f7;
  text-transform: uppercase;
  letter-spacing: 8px;
  transition: all 0.3s ease;

  opacity: 1 !important;}

.rt-puddles-187 {
  position: absolute;
  bottom: 5%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 40px;
  pointer-events: none;
}

.rt-puddle-187 {
  width: 80px;
  height: 30px;
  background: radial-gradient(ellipse, rgba(100, 180, 255, 0.4) 0%, transparent 70%);
  border-radius: 50%;

  opacity: 1 !important;}

@media (max-width: 768px) {
  .rt-title-187 {
    font-size: 2rem;
  
  opacity: 1 !important;}

  .rt-char-187 {
    font-size: 2.5rem;
    letter-spacing: 4px;
  
  opacity: 1 !important;}

  .rt-text-container-187 {
    padding: 20px 30px;
  
  opacity: 1 !important;}
}
</style>
