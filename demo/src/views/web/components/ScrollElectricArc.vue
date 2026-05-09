<template>
  <div class="electric-arc-container-202">
    <div class="ea-header-202">
      <h2 class="ea-title-202">电弧闪电</h2>
      <p class="ea-hint-202">滚动触发闪电电弧效果</p>
    </div>

    <div class="ea-stage-202">
      <div v-for="(arc, index) in arcs" :key="index" class="ea-arc-wrapper-202">
        <div class="ea-arc-202" :class="`ea-arc-${index}-202`">
          <canvas class="ea-canvas-202" :class="`ea-canvas-${index}-202`"></canvas>
          <div class="ea-core-202">
            <div class="ea-icon-202">{{ arc.icon }}</div>
            <h3 class="ea-arc-title-202">{{ arc.title }}</h3>
            <p class="ea-arc-desc-202">{{ arc.desc }}</p>
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

const arcs = [
  { icon: '⚡', title: '闪电', desc: '瞬间的能量释放' },
  { icon: '🔌', title: '能源', desc: '源源不断的动力' },
  { icon: '💡', title: '火花', desc: '点燃创意的灵感' },
  { icon: '🌩️', title: '雷鸣', desc: '震撼人心的力量' }
]

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 初始化电弧画布
    const canvases = gsap.utils.toArray('.ea-canvas-202')
    canvases.forEach((canvas: HTMLCanvasElement) => {
      const ctx2d = canvas.getContext('2d')
      if (ctx2d) {
        canvas.width = 300
        canvas.height = 400
        drawElectricArc(ctx2d, canvas)
      }
    })

    // 等待画布初始化后添加动画
    setTimeout(() => {
      // 电弧闪烁动画
      gsap.utils.toArray('.ea-canvas-202').forEach((canvas: any) => {
        gsap.to(canvas, {
          scrollTrigger: {
            trigger: canvas.closest('.ea-arc-wrapper-202'),
            start: 'top 70%',
            end: 'bottom 30%',
            scrub: 1
          },
          opacity: 1,
          duration: 1
        })
      })

      // 核心发光效果
      gsap.utils.toArray('.ea-core-202').forEach((core: any) => {
        gsap.to(core, {
          scrollTrigger: {
            trigger: core.closest('.ea-arc-wrapper-202'),
            start: 'top 70%',
            end: 'bottom 30%',
            scrub: 1
          },
          scale: 1.1,
          boxShadow: '0 0 40px rgba(255, 255, 0, 0.8)'
        })
      })
    }, 150)

    // 电弧入场动画
    gsap.from('.ea-arc-202', {
      scrollTrigger: {
        trigger: '.ea-stage-202',
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1
      },
      y: 100,
      scale: 0.8,
      stagger: 0.2
    })

    // 标题动画
    gsap.from('.ea-title-202', {
      scrollTrigger: {
        trigger: '.ea-header-202',
        start: 'top 80%'
      },
      y: 30,
      duration: 1
    })
  })
})

function drawElectricArc(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  let frame = 0

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = '#ffff00'
    ctx.lineWidth = 2
    ctx.shadowBlur = 20
    ctx.shadowColor = '#ffff00'
    ctx.globalAlpha = 0.8

    // 绘制主电弧
    ctx.beginPath()
    let x = canvas.width / 2
    let y = 20
    ctx.moveTo(x, y)

    for (let i = 0; i < 20; i++) {
      x += (Math.random() - 0.5) * 40
      y += (canvas.height - 40) / 20
      ctx.lineTo(x, y)
    }
    ctx.stroke()

    // 绘制分支电弧
    for (let j = 0; j < 3; j++) {
      ctx.beginPath()
      let startX = canvas.width / 2 + (Math.random() - 0.5) * 100
      let startY = 50 + Math.random() * 100
      ctx.moveTo(startX, startY)

      for (let k = 0; k < 8; k++) {
        startX += (Math.random() - 0.5) * 30
        startY += (Math.random() - 0.5) * 40
        ctx.lineTo(startX, startY)
      }
      ctx.strokeStyle = `rgba(255, 255, 0, ${0.3 + Math.random() * 0.4})`
      ctx.stroke()
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

.electric-arc-container-202 {
  min-height: 100vh;
  background: linear-gradient(180deg, #0a0a0a 0%, #1a1a00 100%);
  padding: 60px 20px;
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.ea-header-202 {
  text-align: center;
  margin-bottom: 60px;

  opacity: 1 !important;}

.ea-title-202 {
  font-size: 48px;
  font-weight: 700;
  background: linear-gradient(135deg, #ffff00, #ff8c00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 40px rgba(255, 255, 0, 0.5);
  margin-bottom: 10px;

  opacity: 1 !important;}

.ea-hint-202 {
  font-size: 18px;
  color: #ffff00;

  opacity: 1 !important;}

.ea-stage-202 {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  padding: 20px;

  opacity: 1 !important;}

.ea-arc-wrapper-202 {
  height: 400px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  opacity: 1 !important;}

.ea-arc-202 {
  position: relative;
  width: 300px;
  height: 400px;
  border-radius: 20px;
  background: rgba(20, 20, 0, 0.8);
  border: 2px solid rgba(255, 255, 0, 0.3);
  overflow: hidden;
  transition: all 0.5s ease;

  opacity: 1 !important;}

.ea-arc-202:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(255, 255, 0, 0.3);
}

.ea-canvas-202 {
  position: absolute;
  inset: 0;
  opacity: 0.2;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.ea-core-202 {
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

.ea-icon-202 {
  font-size: 72px;
  margin-bottom: 20px;
  filter: drop-shadow(0 0 20px rgba(255, 255, 0, 0.8));
  animation: electric-pulse-202 0.5s infinite;

  opacity: 1 !important;}

@keyframes electric-pulse-202 {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.ea-arc-title-202 {
  font-size: 28px;
  font-weight: 600;
  color: #ffff00;
  margin-bottom: 10px;
  text-shadow: 0 0 20px rgba(255, 255, 0, 0.5);

  opacity: 1 !important;}

.ea-arc-desc-202 {
  font-size: 14px;
  color: #ffcc00;
  line-height: 1.6;

  opacity: 1 !important;}

@media (max-width: 1024px) {
  .ea-stage-202 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .ea-stage-202 {
    grid-template-columns: 1fr;
  }

  .ea-title-202 {
    font-size: 32px;
  
  opacity: 1 !important;}
}
</style>
