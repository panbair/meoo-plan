<template>
  <div class="aurora-night-container-206">
    <div class="an-header-206">
      <h2 class="an-title-206">极光夜空</h2>
      <p class="an-hint-206">滚动触发极光夜空飘动效果</p>
    </div>

    <div class="an-stage-206">
      <div v-for="(aurora, index) in auroras" :key="index" class="an-aurora-wrapper-206">
        <div class="an-aurora-206" :class="`an-aurora-${index}-206`">
          <canvas class="an-canvas-206" :class="`an-canvas-${index}-206`"></canvas>
          <div class="an-content-206">
            <div class="an-icon-206">{{ aurora.icon }}</div>
            <h3 class="an-aurora-title-206">{{ aurora.title }}</h3>
            <p class="an-aurora-desc-206">{{ aurora.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const auroras = [
  { icon: '🌌', title: '星河', desc: '璀璨的星河' },
  { icon: '🌠', title: '流星', desc: '划过天际' },
  { icon: '🌙', title: '月夜', desc: '宁静的月光' },
  { icon: '✨', title: '星光', desc: '闪烁的星芒' }
]

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 初始化极光画布
    const canvases = gsap.utils.toArray('.an-canvas-206')
    canvases.forEach((canvas: HTMLCanvasElement) => {
      const ctx2d = canvas.getContext('2d')
      if (ctx2d) {
        canvas.width = 300
        canvas.height = 400
        drawAuroraNight(ctx2d, canvas)
      }
    })

    // 等待画布初始化后添加动画
    setTimeout(() => {
      // 极光流动动画
      gsap.utils.toArray('.an-canvas-206').forEach((canvas: any) => {
        gsap.to(canvas, {
          scrollTrigger: {
            trigger: canvas.closest('.an-aurora-wrapper-206'),
            start: 'top 70%',
            end: 'bottom 30%',
            scrub: 1
          },
          opacity: 0.8
        })
      })

      // 内容浮起效果
      gsap.utils.toArray('.an-content-206').forEach((content: any) => {
        gsap.to(content, {
          scrollTrigger: {
            trigger: content.closest('.an-aurora-wrapper-206'),
            start: 'top 70%',
            end: 'bottom 30%',
            scrub: 1
          },
          y: -20,
          scale: 1.05
        })
      })
    }, 150)

    // 极光入场动画
    gsap.from('.an-aurora-206', {
      scrollTrigger: {
        trigger: '.an-stage-206',
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1
      },
      y: 100,
      scale: 0.8,
      stagger: 0.2
    })

    // 标题动画
    gsap.from('.an-title-206', {
      scrollTrigger: {
        trigger: '.an-header-206',
        start: 'top 80%'
      },
      y: 30,
      duration: 1
    })
  })
})

function drawAuroraNight(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  let frame = 0

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.globalAlpha = 0.5

    // 绘制极光波浪
    const colors = ['#00ff00', '#00ffff', '#ff00ff', '#ff00ff']
    colors.forEach((color, colorIndex) => {
      ctx.beginPath()
      ctx.moveTo(0, canvas.height)

      for (let x = 0; x <= canvas.width; x += 5) {
        const y = 200 + colorIndex * 30 +
                  Math.sin(x * 0.02 + frame * 0.05 + colorIndex) * 30 +
                  Math.sin(x * 0.01 + frame * 0.03) * 20
        ctx.lineTo(x, y)
      }

      ctx.lineTo(canvas.width, canvas.height)
      ctx.closePath()
      ctx.fillStyle = color + '40'
      ctx.fill()
    })

    // 绘制星星
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height * 0.5
      const size = Math.random() * 2 + 0.5
      const alpha = Math.random() * 0.8 + 0.2

      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
      ctx.fill()
    }

    frame++
    requestAnimationFrame(animate)
  }
  animate()
}

onUnmounted(() => {
  ctx.revert()
})
</script>

<style scoped>
/* GSAP opacity fix: ensure content is always visible */

.aurora-night-container-206 {
  min-height: 100vh;
  background: linear-gradient(180deg, #000011 0%, #000022 100%);
  padding: 60px 20px;
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.an-header-206 {
  text-align: center;
  margin-bottom: 60px;

  opacity: 1 !important;}

.an-title-206 {
  font-size: 48px;
  font-weight: 700;
  background: linear-gradient(135deg, #00ff00, #00ffff, #ff00ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 40px rgba(0, 255, 255, 0.5);
  margin-bottom: 10px;

  opacity: 1 !important;}

.an-hint-206 {
  font-size: 18px;
  color: #00ffff;

  opacity: 1 !important;}

.an-stage-206 {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  padding: 20px;

  opacity: 1 !important;}

.an-aurora-wrapper-206 {
  height: 400px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  opacity: 1 !important;}

.an-aurora-206 {
  position: relative;
  width: 300px;
  height: 400px;
  border-radius: 20px;
  background: rgba(0, 0, 20, 0.8);
  border: 2px solid rgba(0, 255, 255, 0.3);
  overflow: hidden;
  transition: all 0.5s ease;

  opacity: 1 !important;}

.an-aurora-206:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 255, 255, 0.3);
}

.an-canvas-206 {
  position: absolute;
  inset: 0;
  opacity: 0.15;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.an-content-206 {
  position: relative;
  z-index: 2;
  padding: 40px 30px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;

  opacity: 1 !important;}

.an-icon-206 {
  font-size: 72px;
  margin-bottom: 20px;
  filter: drop-shadow(0 0 20px rgba(0, 255, 255, 0.8));

  opacity: 1 !important;}

.an-aurora-title-206 {
  font-size: 28px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 10px;
  text-shadow: 0 0 20px rgba(0, 255, 255, 0.5);

  opacity: 1 !important;}

.an-aurora-desc-206 {
  font-size: 14px;
  color: #00ffff;
  line-height: 1.6;

  opacity: 1 !important;}

@media (max-width: 1024px) {
  .an-stage-206 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .an-stage-206 {
    grid-template-columns: 1fr;
  }

  .an-title-206 {
    font-size: 32px;
  
  opacity: 1 !important;}
}
</style>
