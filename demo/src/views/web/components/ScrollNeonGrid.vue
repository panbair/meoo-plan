<template>
  <div class="neon-grid-container-203">
    <div class="ng-header-203">
      <h2 class="ng-title-203">霓虹网格</h2>
      <p class="ng-hint-203">滚动触发霓虹网格流动效果</p>
    </div>

    <div class="ng-stage-203">
      <div v-for="(grid, index) in grids" :key="index" class="ng-grid-wrapper-203">
        <div class="ng-grid-203" :class="`ng-grid-${index}-203`">
          <canvas class="ng-canvas-203" :class="`ng-canvas-${index}-203`"></canvas>
          <div class="ng-content-203">
            <div class="ng-icon-203">{{ grid.icon }}</div>
            <h3 class="ng-grid-title-203">{{ grid.title }}</h3>
            <p class="ng-grid-desc-203">{{ grid.desc }}</p>
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

const grids = [
  { icon: '🔷', title: '蓝晶', desc: '深蓝色的能量' },
  { icon: '🔶', title: '橙焰', desc: '热情的橙色光芒' },
  { icon: '🟪', title: '紫韵', desc: '神秘的紫色波动' },
  { icon: '🟩', title: '翠绿', desc: '生命的绿色脉动' }
]

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 初始化网格画布
    const canvases = gsap.utils.toArray('.ng-canvas-203')
    canvases.forEach((canvas: HTMLCanvasElement, index: number) => {
      const ctx2d = canvas.getContext('2d')
      if (ctx2d) {
        canvas.width = 300
        canvas.height = 400
        drawNeonGrid(ctx2d, canvas, index)
      }
    })

    // 等待画布初始化后添加动画
    setTimeout(() => {
      // 网格流动动画
      gsap.utils.toArray('.ng-canvas-203').forEach((canvas: any) => {
        gsap.to(canvas, {
          scrollTrigger: {
            trigger: canvas.closest('.ng-grid-wrapper-203'),
            start: 'top 70%',
            end: 'bottom 30%',
            scrub: 1
          },
          opacity: 0.8
        })
      })

      // 内容浮起效果
      gsap.utils.toArray('.ng-content-203').forEach((content: any) => {
        gsap.to(content, {
          scrollTrigger: {
            trigger: content.closest('.ng-grid-wrapper-203'),
            start: 'top 70%',
            end: 'bottom 30%',
            scrub: 1
          },
          y: -20,
          scale: 1.05
        })
      })
    }, 150)

    // 网格入场动画
    gsap.from('.ng-grid-203', {
      scrollTrigger: {
        trigger: '.ng-stage-203',
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1
      },
      y: 100,
      scale: 0.8,
      stagger: 0.15
    })

    // 标题动画
    gsap.from('.ng-title-203', {
      scrollTrigger: {
        trigger: '.ng-header-203',
        start: 'top 80%'
      },
      y: 30,
      duration: 1
    })
  })
})

function drawNeonGrid(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, index: number) {
  const colors = ['#00ffff', '#ff6600', '#9900ff', '#00ff66']
  const color = colors[index % colors.length]
  let frame = 0

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = color
    ctx.lineWidth = 1
    ctx.shadowBlur = 10
    ctx.shadowColor = color
    ctx.globalAlpha = 0.5

    // 绘制流动网格
    const gridSize = 20
    const offset = (frame * 0.5) % gridSize

    for (let x = offset; x < canvas.width + gridSize; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }

    for (let y = offset; y < canvas.height + gridSize; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }

    // 绘制交叉点光点
    for (let x = offset; x < canvas.width + gridSize; x += gridSize * 2) {
      for (let y = offset; y < canvas.height + gridSize; y += gridSize * 2) {
        const dist = Math.sqrt(
          Math.pow(x - canvas.width / 2, 2) +
          Math.pow(y - canvas.height / 2, 2)
        )
        const alpha = Math.max(0, 1 - dist / 300)
        ctx.globalAlpha = alpha * 0.5
        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()
      }
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

.neon-grid-container-203 {
  min-height: 100vh;
  background: linear-gradient(180deg, #0a0a0a 0%, #0a0a1a 100%);
  padding: 60px 20px;
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.ng-header-203 {
  text-align: center;
  margin-bottom: 60px;

  opacity: 1 !important;}

.ng-title-203 {
  font-size: 48px;
  font-weight: 700;
  background: linear-gradient(135deg, #00ffff, #ff6600);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 40px rgba(0, 255, 255, 0.5);
  margin-bottom: 10px;

  opacity: 1 !important;}

.ng-hint-203 {
  font-size: 18px;
  color: #00ffff;

  opacity: 1 !important;}

.ng-stage-203 {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  padding: 20px;

  opacity: 1 !important;}

.ng-grid-wrapper-203 {
  height: 400px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  opacity: 1 !important;}

.ng-grid-203 {
  position: relative;
  width: 300px;
  height: 400px;
  border-radius: 20px;
  background: rgba(20, 20, 30, 0.8);
  border: 2px solid rgba(0, 255, 255, 0.3);
  overflow: hidden;
  transition: all 0.5s ease;

  opacity: 1 !important;}

.ng-grid-203:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 255, 255, 0.3);
}

.ng-canvas-203 {
  position: absolute;
  inset: 0;
  opacity: 0.15;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.ng-content-203 {
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

.ng-icon-203 {
  font-size: 72px;
  margin-bottom: 20px;
  filter: drop-shadow(0 0 20px rgba(0, 255, 255, 0.8));

  opacity: 1 !important;}

.ng-grid-title-203 {
  font-size: 28px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 10px;
  text-shadow: 0 0 20px rgba(0, 255, 255, 0.5);

  opacity: 1 !important;}

.ng-grid-desc-203 {
  font-size: 14px;
  color: #00ffff;
  line-height: 1.6;

  opacity: 1 !important;}

@media (max-width: 1024px) {
  .ng-stage-203 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .ng-stage-203 {
    grid-template-columns: 1fr;
  }

  .ng-title-203 {
    font-size: 32px;
  
  opacity: 1 !important;}
}
</style>
