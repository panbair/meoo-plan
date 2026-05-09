<template>
  <div class="particle-wave-146" ref="componentRoot">
    <div class="pw-container-146">
      <h2 class="pw-title-146">🌊 粒子波浪</h2>
      <p class="pw-desc-146">滚动触发粒子波浪效果</p>
      
      <div class="pw-stage-146">
        <canvas class="pw-canvas-146" ref="canvas"></canvas>
        
        <div class="pw-overlay-146">
          <div class="pw-wave-text-146">WAVE</div>
        </div>
      </div>
      
      <div class="pw-hint-146">滚动触发粒子波浪</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const componentRoot = ref<HTMLElement>()
const canvas = ref<HTMLCanvasElement>()
let ctx: any = null
let particles: any[] = []
let animationId: number | null = null

class Particle {
  x: number
  y: number
  baseY: number
  radius: number
  color: string
  speed: number
  amplitude: number
  phase: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
    this.baseY = y
    this.radius = Math.random() * 3 + 1
    this.color = `hsl(${Math.random() * 60 + 180}, 70%, 60%)`
    this.speed = Math.random() * 0.02 + 0.01
    this.amplitude = Math.random() * 30 + 10
    this.phase = Math.random() * Math.PI * 2
  }

  update(time: number, scrollProgress: number) {
    this.y = this.baseY + Math.sin(time * this.speed + this.phase) * this.amplitude * (1 + scrollProgress * 2)
    this.radius = (Math.random() * 3 + 1) * (1 + scrollProgress)
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = this.color
    ctx.fill()
    ctx.closePath()
  }
}

const createParticles = (width: number, height: number) => {
  particles = []
  const particleCount = 200
  
  for (let i = 0; i < particleCount; i++) {
    const x = (i / particleCount) * width
    const y = height / 2 + Math.sin(i * 0.1) * 50
    particles.push(new Particle(x, y))
  }
}

const animate = (time: number, scrollProgress: number) => {
  const canvasEl = canvas.value
  if (!canvasEl) return
  
  const ctx2d = canvasEl.getContext('2d')
  if (!ctx2d) return
  
  ctx2d.clearRect(0, 0, canvasEl.width, canvasEl.height)
  
  particles.forEach(particle => {
    particle.update(time, scrollProgress)
    particle.draw(ctx2d)
  })
  
  animationId = requestAnimationFrame((t) => animate(t, scrollProgress))
}

onMounted(() => {
  const canvasEl = canvas.value
  if (!canvasEl) return
  
  // 设置canvas尺寸
  canvasEl.width = 700
  canvasEl.height = 400
  
  createParticles(canvasEl.width, canvasEl.height)
  animate(0, 0)

  ctx = gsap.context(() => {
    // 标题动画
    gsap.from('.pw-title-146', {
      scrollTrigger: {
        trigger: '.pw-container-146',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      y: -50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    })

    // 描述动画
    gsap.from('.pw-desc-146', {
      scrollTrigger: {
        trigger: '.pw-container-146',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      delay: 0.2,
      ease: 'power3.out'
    })

    // 波浪文字动画
    gsap.to('.pw-wave-text-146', {
      scrollTrigger: {
        trigger: '.pw-stage-146',
        start: 'top 60%',
        end: 'bottom 40%',
        scrub: 1
      },
      scale: 2,
      opacity: 0.3,
      ease: 'power2.inOut'
    })

    // 更新粒子波浪强度
    gsap.to({}, {
      scrollTrigger: {
        trigger: '.pw-stage-146',
        start: 'top center',
        end: 'bottom center',
        scrub: 1,
        onUpdate: (self) => {
          if (animationId) {
            cancelAnimationFrame(animationId)
            animate(Date.now(), self.progress)
          }
        }
      }
    })

    // 提示动画
    gsap.from('.pw-hint-146', {
      scrollTrigger: {
        trigger: '.pw-stage-146',
        start: 'bottom 20%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 20,
      duration: 0.6
    })
  }, componentRoot.value)
})

onUnmounted(() => {
  if (ctx) ctx.revert()
  if (animationId) cancelAnimationFrame(animationId)
})
</script>

<style scoped>
/* GSAP opacity fix: ensure content is always visible */

.particle-wave-146 {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;

  opacity: 1 !important;}

.pw-container-146 {
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  align-items: center;

  opacity: 1 !important;}

.pw-title-146 {
  font-size: clamp(2rem, 5vw, 3.5rem);
  color: #fff;
  margin-bottom: 10px;
  text-align: center;
  background: linear-gradient(90deg, #00f2fe, #4facfe);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  opacity: 1 !important;}

.pw-desc-146 {
  font-size: clamp(0.9rem, 2vw, 1.2rem);
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 40px;
  text-align: center;

  opacity: 1 !important;}

.pw-stage-146 {
  width: 100%;
  max-width: 700px;
  height: 400px;
  position: relative;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);

  opacity: 1 !important;}

.pw-canvas-146 {
  width: 100%;
  height: 100%;
  display: block;

  opacity: 1 !important;}

.pw-overlay-146 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;

  opacity: 1 !important;}

.pw-wave-text-146 {
  font-size: 4rem;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.5);
  text-shadow: 0 0 30px rgba(79, 172, 254, 0.5);
  will-change: transform, opacity;

  opacity: 1 !important;}

.pw-hint-146 {
  margin-top: 30px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;

  opacity: 1 !important;}

@media (max-width: 768px) {
  .pw-stage-146 {
    height: 300px;
  
  opacity: 1 !important;}
  
  .pw-wave-text-146 {
    font-size: 2.5rem;
  
  opacity: 1 !important;}
}
</style>
