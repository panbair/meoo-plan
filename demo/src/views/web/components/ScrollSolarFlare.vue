<template>
  <div class="solar-flare-container-205">
    <div class="sf-header-205">
      <h2 class="sf-title-205">太阳耀斑</h2>
      <p class="sf-hint-205">滚动触发太阳耀斑爆发效果</p>
    </div>

    <div class="sf-stage-205">
      <div v-for="(flare, index) in flares" :key="index" class="sf-flare-wrapper-205">
        <div class="sf-flare-205" :class="`sf-flare-${index}-205`">
          <canvas class="sf-canvas-205" :class="`sf-canvas-${index}-205`"></canvas>
          <div class="sf-core-205">
            <div class="sf-icon-205">{{ flare.icon }}</div>
            <h3 class="sf-flare-title-205">{{ flare.title }}</h3>
            <p class="sf-flare-desc-205">{{ flare.desc }}</p>
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

const flares = [
  { icon: '☀️', title: '耀斑', desc: '炽热的能量爆发' },
  { icon: '🌅', title: '日出', desc: '新的开始' },
  { icon: '🔆', title: '光芒', desc: '照亮一切' },
  { icon: '🌞', title: '烈日', desc: '无尽的力量' }
]

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 初始化耀斑画布
    const canvases = gsap.utils.toArray('.sf-canvas-205')
    canvases.forEach((canvas: HTMLCanvasElement) => {
      const ctx2d = canvas.getContext('2d')
      if (ctx2d) {
        canvas.width = 300
        canvas.height = 400
        drawSolarFlare(ctx2d, canvas)
      }
    })

    // 等待画布初始化后添加动画
    setTimeout(() => {
      // 耀斑扩散动画
      gsap.utils.toArray('.sf-canvas-205').forEach((canvas: any) => {
        gsap.to(canvas, {
          scrollTrigger: {
            trigger: canvas.closest('.sf-flare-wrapper-205'),
            start: 'top 70%',
            end: 'bottom 30%',
            scrub: 1
          },
          opacity: 0.8
        })
      })

      // 核心脉动效果
      gsap.utils.toArray('.sf-core-205').forEach((core: any) => {
        gsap.to(core, {
          scrollTrigger: {
            trigger: core.closest('.sf-flare-wrapper-205'),
            start: 'top 70%',
            end: 'bottom 30%',
            scrub: 1
          },
          scale: 1.1,
          boxShadow: '0 0 50px rgba(255, 200, 0, 0.8)'
        })
      })
    }, 150)

    // 耀斑入场动画
    gsap.from('.sf-flare-205', {
      scrollTrigger: {
        trigger: '.sf-stage-205',
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1
      },
      y: 100,
      scale: 0.8,
      stagger: 0.2
    })

    // 标题动画
    gsap.from('.sf-title-205', {
      scrollTrigger: {
        trigger: '.sf-header-205',
        start: 'top 80%'
      },
      y: 30,
      duration: 1
    })
  })
})

function drawSolarFlare(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  let frame = 0

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.globalAlpha = 0.6

    // 绘制太阳核心
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2 - 50
    const radius = 60 + Math.sin(frame * 0.1) * 5

    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
    gradient.addColorStop(0, 'rgba(255, 255, 200, 0.8)')
    gradient.addColorStop(0.5, 'rgba(255, 200, 0, 0.6)')
    gradient.addColorStop(1, 'rgba(255, 100, 0, 0.2)')

    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.fillStyle = gradient
    ctx.fill()

    // 绘制耀斑射线
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2 + frame * 0.02
      const length = 80 + Math.sin(frame * 0.1 + i) * 20
      const x = centerX + Math.cos(angle) * length
      const y = centerY + Math.sin(angle) * length

      ctx.beginPath()
      ctx.moveTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius)
      ctx.lineTo(x, y)
      ctx.strokeStyle = `rgba(255, ${150 + Math.random() * 100}, 0, 0.5)`
      ctx.lineWidth = 3
      ctx.stroke()
    }

    // 绘制日冕
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + frame * 0.03
      const dist = 100 + Math.random() * 30
      const x = centerX + Math.cos(angle) * dist
      const y = centerY + Math.sin(angle) * dist

      ctx.beginPath()
      ctx.arc(x, y, 10 + Math.random() * 5, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255, 200, 100, ${0.2 + Math.random() * 0.3})`
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

.solar-flare-container-205 {
  min-height: 100vh;
  background: linear-gradient(180deg, #1a0a00 0%, #2a1500 100%);
  padding: 60px 20px;
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.sf-header-205 {
  text-align: center;
  margin-bottom: 60px;

  opacity: 1 !important;}

.sf-title-205 {
  font-size: 48px;
  font-weight: 700;
  background: linear-gradient(135deg, #ffff00, #ff6600);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 40px rgba(255, 200, 0, 0.5);
  margin-bottom: 10px;

  opacity: 1 !important;}

.sf-hint-205 {
  font-size: 18px;
  color: #ffcc00;

  opacity: 1 !important;}

.sf-stage-205 {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  padding: 20px;

  opacity: 1 !important;}

.sf-flare-wrapper-205 {
  height: 400px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  opacity: 1 !important;}

.sf-flare-205 {
  position: relative;
  width: 300px;
  height: 400px;
  border-radius: 20px;
  background: rgba(30, 15, 0, 0.8);
  border: 2px solid rgba(255, 200, 0, 0.3);
  overflow: hidden;
  transition: all 0.5s ease;

  opacity: 1 !important;}

.sf-flare-205:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(255, 200, 0, 0.3);
}

.sf-canvas-205 {
  position: absolute;
  inset: 0;
  opacity: 0.25;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.sf-core-205 {
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

.sf-icon-205 {
  font-size: 72px;
  margin-bottom: 20px;
  filter: drop-shadow(0 0 20px rgba(255, 200, 0, 0.8));

  opacity: 1 !important;}

.sf-flare-title-205 {
  font-size: 28px;
  font-weight: 600;
  color: #ffcc00;
  margin-bottom: 10px;
  text-shadow: 0 0 20px rgba(255, 200, 0, 0.5);

  opacity: 1 !important;}

.sf-flare-desc-205 {
  font-size: 14px;
  color: #ff9900;
  line-height: 1.6;

  opacity: 1 !important;}

@media (max-width: 1024px) {
  .sf-stage-205 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .sf-stage-205 {
    grid-template-columns: 1fr;
  }

  .sf-title-205 {
    font-size: 32px;
  
  opacity: 1 !important;}
}
</style>
