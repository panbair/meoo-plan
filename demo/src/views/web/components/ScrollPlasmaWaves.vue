<template>
  <div class="plasma-waves-container-195">
    <div class="pw-header-195">
      <h2 class="pw-title-195">等离子波</h2>
      <p class="pw-hint-195">滚动控制等离子波动强度</p>
    </div>

    <div class="pw-canvas-container-195">
      <canvas ref="canvas" class="pw-canvas-195"></canvas>
    </div>

    <div class="pw-info-195">
      <div class="pw-stat-195">
        <div class="pw-stat-value-195" id="pw-intensity-195">0</div>
        <div class="pw-stat-label-195">波动强度</div>
      </div>
      <div class="pw-stat-195">
        <div class="pw-stat-value-195" id="pw-speed-195">0</div>
        <div class="pw-stat-label-195">波动速度</div>
      </div>
      <div class="pw-stat-195">
        <div class="pw-stat-value-195" id="w-particles-195">0</div>
        <div class="pw-stat-label-195">等离子数</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const canvas = ref<HTMLCanvasElement | null>(null)
let animationFrame: number
let intensity = 0
let speed = 0

interface Particle {
  x: number
  y: number
  size: number
  vx: number
  vy: number
  hue: number
}

let particles: Particle[] = []

onMounted(() => {
  if (!canvas.value) return

  const ctx = canvas.value.getContext('2d')
  if (!ctx) return

  // 设置canvas尺寸
  const resizeCanvas = () => {
    canvas.value!.width = window.innerWidth
    canvas.value!.height = window.innerHeight
  }
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)

  // 创建等离子粒子
  for (let i = 0; i < 150; i++) {
    particles.push({
      x: Math.random() * canvas.value!.width,
      y: Math.random() * canvas.value!.height,
      size: Math.random() * 3 + 1,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      hue: Math.random() * 60 + 280 // 紫色到粉色
    })
  }

  const animate = () => {
    ctx.fillStyle = 'rgba(10, 5, 20, 0.1)'
    ctx.fillRect(0, 0, canvas.value!.width, canvas.value!.height)

    particles.forEach((p, i) => {
      // 更新位置
      p.x += p.vx * (1 + intensity)
      p.y += p.vy * (1 + intensity * 0.5)

      // 边界检测
      if (p.x < 0 || p.x > canvas.value!.width) p.vx *= -1
      if (p.y < 0 || p.y > canvas.value!.height) p.vy *= -1

      // 绘制粒子
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * (1 + intensity))
      gradient.addColorStop(0, `hsla(${p.hue}, 100%, 70%, ${0.8 * intensity})`)
      gradient.addColorStop(0.5, `hsla(${p.hue}, 100%, 50%, ${0.4 * intensity})`)
      gradient.addColorStop(1, 'transparent')

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size * (1 + intensity), 0, Math.PI * 2)
      ctx.fill()

      // 绘制连接线
      particles.forEach((p2, j) => {
        if (i === j) return
        const dx = p.x - p2.x
        const dy = p.y - p2.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < 150) {
          ctx.beginPath()
          ctx.strokeStyle = `hsla(${p.hue}, 100%, 70%, ${(1 - dist / 150) * 0.3 * intensity})`
          ctx.lineWidth = 1
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.stroke()
        }
      })

      // 颜色变化
      p.hue += 0.5 * speed
    })

    // 更新统计
    document.getElementById('pw-intensity-195')!.textContent = (intensity * 100).toFixed(0)
    document.getElementById('pw-speed-195')!.textContent = (speed * 10).toFixed(0)
    document.getElementById('w-particles-195')!.textContent = particles.length.toString()

    animationFrame = requestAnimationFrame(animate)
  }

  animate()

  // 滚动触发动画
  gsap.to(
    { intensity: 0, speed: 0 },
    {
      scrollTrigger: {
        trigger: '.pw-canvas-container-195',
        start: 'top 100%',
        end: 'bottom 0%',
        scrub: 1
      },
      intensity: 1,
      speed: 1,
      onUpdate: function () {
        intensity = this.targets()[0].intensity
        speed = this.targets()[0].speed
      }
    }
  )

  // 标题动画
  gsap.from('.pw-title-195', {
    scrollTrigger: {
      trigger: '.pw-header-195',
      start: 'top 80%'
    },
    y: 50,
    opacity: 0,
    duration: 1
  })
})

onUnmounted(() => {
  cancelAnimationFrame(animationFrame)
  window.removeEventListener('resize', () => {})
  ScrollTrigger.getAll().forEach((st) => st.kill())
})
</script>

<style scoped>
/* GSAP opacity fix: ensure content is always visible */

.plasma-waves-container-195 {
  min-height: 100vh;
  background: #0a0514;
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.pw-header-195 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  text-align: center;
  padding: 60px 20px;
  z-index: 10;
  background: linear-gradient(180deg, rgba(10, 5, 20, 0.9), transparent);

  opacity: 1 !important;}

.pw-title-195 {
  font-size: 56px;
  font-weight: 700;
  background: linear-gradient(135deg, #ff6b9d, #c44cff, #6b9dff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 40px rgba(196, 76, 255, 0.5);
  margin-bottom: 10px;

  opacity: 1 !important;}

.pw-hint-195 {
  font-size: 18px;
  color: #b88cff;

  opacity: 1 !important;}

.pw-canvas-container-195 {
  width: 100%;
  height: 100vh;
  position: relative;

  opacity: 1 !important;}

.pw-canvas-195 {
  width: 100%;
  height: 100%;
  display: block;

  opacity: 1 !important;}

.pw-info-195 {
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 60px;
  background: rgba(10, 5, 20, 0.8);
  padding: 30px 50px;
  border-radius: 20px;
  border: 1px solid rgba(196, 76, 255, 0.3);
  backdrop-filter: blur(10px);
  z-index: 10;

  opacity: 1 !important;}

.pw-stat-195 {
  text-align: center;

  opacity: 1 !important;}

.pw-stat-value-195 {
  font-size: 36px;
  font-weight: 700;
  color: #c44cff;
  margin-bottom: 5px;

  opacity: 1 !important;}

.pw-stat-label-195 {
  font-size: 14px;
  color: #b88cff;
  text-transform: uppercase;
  letter-spacing: 1px;

  opacity: 1 !important;}

@media (max-width: 768px) {
  .pw-title-195 {
    font-size: 36px;
  
  opacity: 1 !important;}

  .pw-info-195 {
    flex-direction: column;
    gap: 20px;
    padding: 20px 30px;
  
  opacity: 1 !important;}
}
</style>
