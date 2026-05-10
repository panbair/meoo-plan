<template>
  <div class="lava-flow-container-209">
    <div class="lf-header-209">
      <h2 class="lf-title-209">岩浆流动</h2>
      <p class="lf-hint-209">滚动触发岩浆流动效果</p>
    </div>

    <div class="lf-stage-209">
      <div v-for="(lava, index) in lavas" :key="index" class="lf-lava-wrapper-209">
        <div class="lf-lava-209" :class="`lf-lava-${index}-209`">
          <canvas class="lf-canvas-209" :class="`lf-canvas-${index}-209`"></canvas>
          <div class="lf-content-209">
            <div class="lf-icon-209">{{ lava.icon }}</div>
            <h3 class="lf-lava-title-209">{{ lava.title }}</h3>
            <p class="lf-lava-desc-209">{{ lava.desc }}</p>
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

const lavas = [
  { icon: '🌋', title: '火山', desc: '喷发的力量' },
  { icon: '🔥', title: '火焰', desc: '燃烧的热度' },
  { icon: '💥', title: '爆炸', desc: '爆发的能量' },
  { icon: '☄️', title: '陨石', desc: '坠落的火球' }
]

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 初始化岩浆画布
    const canvases = gsap.utils.toArray('.lf-canvas-209')
    canvases.forEach((canvas: HTMLCanvasElement) => {
      const ctx2d = canvas.getContext('2d')
      if (ctx2d) {
        canvas.width = 300
        canvas.height = 400
        drawLavaFlow(ctx2d, canvas)
      }
    })

    // 等待画布初始化后添加动画
    setTimeout(() => {
      // 岩浆流动动画
      gsap.utils.toArray('.lf-canvas-209').forEach((canvas: any) => {
        gsap.to(canvas, {
          scrollTrigger: {
            trigger: canvas.closest('.lf-lava-wrapper-209'),
            start: 'top 70%',
            end: 'bottom 30%',
            scrub: 1
          },
          opacity: 0.8
        })
      })

      // 内容浮起效果
      gsap.utils.toArray('.lf-content-209').forEach((content: any) => {
        gsap.to(content, {
          scrollTrigger: {
            trigger: content.closest('.lf-lava-wrapper-209'),
            start: 'top 70%',
            end: 'bottom 30%',
            scrub: 1
          },
          y: -20,
          scale: 1.05
        })
      })
    }, 150)

    // 岩浆入场动画
    gsap.from('.lf-lava-209', {
      scrollTrigger: {
        trigger: '.lf-stage-209',
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1
      },
      y: 100,
      scale: 0.8,
      stagger: 0.2
    })

    // 标题动画
    gsap.from('.lf-title-209', {
      scrollTrigger: {
        trigger: '.lf-header-209',
        start: 'top 80%'
      },
      y: 30,
      duration: 1
    })
  })
})

function drawLavaFlow(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  let frame = 0

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.globalAlpha = 0.5

    // 绘制岩浆波浪
    const colors = ['#ff4500', '#ff6600', '#ff8c00', '#ffcc00']
    colors.forEach((color, colorIndex) => {
      ctx.beginPath()
      ctx.moveTo(0, canvas.height)

      for (let x = 0; x <= canvas.width; x += 5) {
        const y = 300 + colorIndex * 20 +
                  Math.sin(x * 0.03 + frame * 0.05 + colorIndex) * 25 +
                  Math.sin(x * 0.02 + frame * 0.03) * 15
        ctx.lineTo(x, y)
      }

      ctx.lineTo(canvas.width, canvas.height)
      ctx.closePath()
      ctx.fillStyle = color + '50'
      ctx.fill()
    })

    // 绘制热气
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * canvas.width
      const y = 300 + Math.random() * 100
      const radius = Math.random() * 30 + 10

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
      gradient.addColorStop(0, 'rgba(255, 200, 0, 0.4)')
      gradient.addColorStop(1, 'rgba(255, 100, 0, 0)')

      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()
    }

    // 绘制火花
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const size = Math.random() * 4 + 2

      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255, ${200 + Math.random() * 55}, 0, ${Math.random() * 0.6 + 0.2})`
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

.lava-flow-container-209 {
  min-height: 100vh;
  background: linear-gradient(180deg, #1a0500 0%, #2a0a00 100%);
  padding: 60px 20px;
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.lf-header-209 {
  text-align: center;
  margin-bottom: 60px;

  opacity: 1 !important;}

.lf-title-209 {
  font-size: 48px;
  font-weight: 700;
  background: linear-gradient(135deg, #ff6600, #ffcc00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 40px rgba(255, 100, 0, 0.5);
  margin-bottom: 10px;

  opacity: 1 !important;}

.lf-hint-209 {
  font-size: 18px;
  color: #ff8c00;

  opacity: 1 !important;}

.lf-stage-209 {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  padding: 20px;

  opacity: 1 !important;}

.lf-lava-wrapper-209 {
  height: 400px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  opacity: 1 !important;}

.lf-lava-209 {
  position: relative;
  width: 300px;
  height: 400px;
  border-radius: 20px;
  background: rgba(30, 10, 0, 0.8);
  border: 2px solid rgba(255, 100, 0, 0.3);
  overflow: hidden;
  transition: all 0.5s ease;

  opacity: 1 !important;}

.lf-lava-209:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(255, 100, 0, 0.3);
}

.lf-canvas-209 {
  position: absolute;
  inset: 0;
  opacity: 0.2;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.lf-content-209 {
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

.lf-icon-209 {
  font-size: 72px;
  margin-bottom: 20px;
  filter: drop-shadow(0 0 20px rgba(255, 100, 0, 0.8));

  opacity: 1 !important;}

.lf-lava-title-209 {
  font-size: 28px;
  font-weight: 600;
  color: #ffcc00;
  margin-bottom: 10px;
  text-shadow: 0 0 20px rgba(255, 100, 0, 0.5);

  opacity: 1 !important;}

.lf-lava-desc-209 {
  font-size: 14px;
  color: #ff8c00;
  line-height: 1.6;

  opacity: 1 !important;}

@media (max-width: 1024px) {
  .lf-stage-209 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .lf-stage-209 {
    grid-template-columns: 1fr;
  }

  .lf-title-209 {
    font-size: 32px;
  
  opacity: 1 !important;}
}
</style>
