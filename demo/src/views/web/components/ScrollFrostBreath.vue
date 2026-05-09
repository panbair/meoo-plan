<template>
  <div class="frost-breath-container-208">
    <div class="fb-header-208">
      <h2 class="fb-title-208">霜冻呼吸</h2>
      <p class="fb-hint-208">滚动触发霜冻呼吸效果</p>
    </div>

    <div class="fb-stage-208">
      <div v-for="(frost, index) in frosts" :key="index" class="fb-frost-wrapper-208">
        <div class="fb-frost-208" :class="`fb-frost-${index}-208`">
          <canvas class="fb-canvas-208" :class="`fb-canvas-${index}-208`"></canvas>
          <div class="fb-content-208">
            <div class="fb-icon-208">{{ frost.icon }}</div>
            <h3 class="fb-frost-title-208">{{ frost.title }}</h3>
            <p class="fb-frost-desc-208">{{ frost.desc }}</p>
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

const frosts = [
  { icon: '🧊', title: '冰块', desc: '晶莹剔透' },
  { icon: '❄️', title: '雪花', desc: '飘落如诗' },
  { icon: '🌨️', title: '雪球', desc: '圆润饱满' },
  { icon: '🥶', title: '冰霜', desc: '寒冷刺骨' }
]

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 初始化霜冻画布
    const canvases = gsap.utils.toArray('.fb-canvas-208')
    canvases.forEach((canvas: HTMLCanvasElement) => {
      const ctx2d = canvas.getContext('2d')
      if (ctx2d) {
        canvas.width = 300
        canvas.height = 400
        drawFrostBreath(ctx2d, canvas)
      }
    })

    // 等待画布初始化后添加动画
    setTimeout(() => {
      // 霜冻扩散动画
      gsap.utils.toArray('.fb-canvas-208').forEach((canvas: any) => {
        gsap.to(canvas, {
          scrollTrigger: {
            trigger: canvas.closest('.fb-frost-wrapper-208'),
            start: 'top 70%',
            end: 'bottom 30%',
            scrub: 1
          },
          opacity: 0.8
        })
      })

      // 内容浮起效果
      gsap.utils.toArray('.fb-content-208').forEach((content: any) => {
        gsap.to(content, {
          scrollTrigger: {
            trigger: content.closest('.fb-frost-wrapper-208'),
            start: 'top 70%',
            end: 'bottom 30%',
            scrub: 1
          },
          y: -20,
          scale: 1.05
        })
      })
    }, 150)

    // 霜冻入场动画
    gsap.from('.fb-frost-208', {
      scrollTrigger: {
        trigger: '.fb-stage-208',
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1
      },
      y: 100,
      scale: 0.8,
      stagger: 0.2
    })

    // 标题动画
    gsap.from('.fb-title-208', {
      scrollTrigger: {
        trigger: '.fb-header-208',
        start: 'top 80%'
      },
      y: 30,
      duration: 1
    })
  })
})

function drawFrostBreath(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  let frame = 0

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.globalAlpha = 0.5

    // 绘制霜冻纹理
    for (let i = 0; i < 15; i++) {
      const startX = Math.random() * canvas.width
      const startY = Math.random() * canvas.height

      ctx.beginPath()
      ctx.moveTo(startX, startY)

      for (let j = 0; j < 5; j++) {
        const x = startX + (Math.random() - 0.5) * 100
        const y = startY + (Math.random() - 0.5) * 100
        ctx.lineTo(x, y)

        // 绘制分支
        if (Math.random() > 0.5) {
          ctx.moveTo(x, y)
          ctx.lineTo(
            x + (Math.random() - 0.5) * 50,
            y + (Math.random() - 0.5) * 50
          )
        }
      }

      ctx.strokeStyle = `rgba(200, 230, 255, ${0.2 + Math.random() * 0.3})`
      ctx.lineWidth = 1
      ctx.stroke()
    }

    // 绘制冰晶
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const size = Math.random() * 15 + 5

      ctx.beginPath()
      ctx.moveTo(x, y - size)
      ctx.lineTo(x + size * 0.5, y)
      ctx.lineTo(x, y + size)
      ctx.lineTo(x - size * 0.5, y)
      ctx.closePath()
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 + Math.random() * 0.3})`
      ctx.stroke()
    }

    // 绘制雾气
    for (let i = 0; i < 10; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const radius = Math.random() * 50 + 20

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)')
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fillStyle = gradient
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

.frost-breath-container-208 {
  min-height: 100vh;
  background: linear-gradient(180deg, #0a1020 0%, #102030 100%);
  padding: 60px 20px;
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.fb-header-208 {
  text-align: center;
  margin-bottom: 60px;

  opacity: 1 !important;}

.fb-title-208 {
  font-size: 48px;
  font-weight: 700;
  background: linear-gradient(135deg, #e6f2ff, #cce6ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 40px rgba(200, 230, 255, 0.5);
  margin-bottom: 10px;

  opacity: 1 !important;}

.fb-hint-208 {
  font-size: 18px;
  color: #cce6ff;

  opacity: 1 !important;}

.fb-stage-208 {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  padding: 20px;

  opacity: 1 !important;}

.fb-frost-wrapper-208 {
  height: 400px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  opacity: 1 !important;}

.fb-frost-208 {
  position: relative;
  width: 300px;
  height: 400px;
  border-radius: 20px;
  background: rgba(15, 30, 45, 0.8);
  border: 2px solid rgba(200, 230, 255, 0.3);
  overflow: hidden;
  transition: all 0.5s ease;

  opacity: 1 !important;}

.fb-frost-208:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(200, 230, 255, 0.3);
}

.fb-canvas-208 {
  position: absolute;
  inset: 0;
  opacity: 0.15;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.fb-content-208 {
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

.fb-icon-208 {
  font-size: 72px;
  margin-bottom: 20px;
  filter: drop-shadow(0 0 20px rgba(200, 230, 255, 0.8));

  opacity: 1 !important;}

.fb-frost-title-208 {
  font-size: 28px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 10px;
  text-shadow: 0 0 20px rgba(200, 230, 255, 0.5);

  opacity: 1 !important;}

.fb-frost-desc-208 {
  font-size: 14px;
  color: #cce6ff;
  line-height: 1.6;

  opacity: 1 !important;}

@media (max-width: 1024px) {
  .fb-stage-208 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .fb-stage-208 {
    grid-template-columns: 1fr;
  }

  .fb-title-208 {
    font-size: 32px;
  
  opacity: 1 !important;}
}
</style>
