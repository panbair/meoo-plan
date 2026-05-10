<template>
  <div class="geometric-flow-176" ref="componentRoot">
    <div class="gf-container-176">
      <h2 class="gf-title-176">🔷 几何流动</h2>
      <p class="gf-desc-176">滚动触发几何形状流动</p>
      
      <div class="gf-stage-176" ref="stageRef">
        <canvas class="gf-canvas-176" ref="canvasRef"></canvas>
        
        <div class="gf-foreground-176">
          <div 
            v-for="(shape, index) in shapes" 
            :key="index"
            class="gf-shape-176"
            :class="`gf-shape-${shape.type}-176`"
            :style="{ 
              left: shape.x + '%',
              top: shape.y + '%'
            }"
          ></div>
        </div>
        
        <div class="gf-overlay-176">
          <div class="gf-text-176">
            <div class="gf-text-main-176">流动之美</div>
            <div class="gf-text-sub-176">The Beauty of Flow</div>
          </div>
        </div>
      </div>
      
      <div class="gf-hint-176">滚动触发几何流动</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const componentRoot = ref<HTMLElement>()
const stageRef = ref<HTMLElement>()
const canvasRef = ref<HTMLCanvasElement>()

const shapes = [
  { type: 'circle', x: 15, y: 20 },
  { type: 'square', x: 80, y: 15 },
  { type: 'triangle', x: 25, y: 75 },
  { type: 'diamond', x: 75, y: 80 },
  { type: 'circle', x: 50, y: 45 },
  { type: 'square', x: 10, y: 50 },
  { type: 'triangle', x: 90, y: 40 },
  { type: 'diamond', x: 40, y: 10 }
]

let ctx: any = null
let animationFrameId: number | null = null

onMounted(() => {
  ctx = gsap.context(() => {
    // 初始状态
    gsap.set('.gf-shape-176', {
      scale: 0,
      opacity: 0,
      rotation: -180
    })

    gsap.set('.gf-text-main-176', {
      y: 100,
      opacity: 0
    })

    gsap.set('.gf-text-sub-176', {
      y: 80,
      opacity: 0
    })

    // 形状流动动画
    gsap.to('.gf-shape-176', {
      scrollTrigger: {
        trigger: '.gf-stage-176',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      },
      scale: 1,
      opacity: 0.8,
      rotation: 0,
      stagger: 0.1,
      ease: 'power2.inOut'
    })

    // 文字动画
    gsap.to('.gf-text-main-176', {
      scrollTrigger: {
        trigger: '.gf-stage-176',
        start: 'top 40%',
        end: 'bottom 40%',
        scrub: 1
      },
      y: 0,
      opacity: 1,
      ease: 'power2.inOut'
    })

    gsap.to('.gf-text-sub-176', {
      scrollTrigger: {
        trigger: '.gf-stage-176',
        start: 'top 35%',
        end: 'bottom 35%',
        scrub: 1
      },
      y: 0,
      opacity: 0.8,
      ease: 'power2.inOut'
    })

    // 标题动画
    gsap.from('.gf-title-176', {
      scrollTrigger: {
        trigger: '.gf-container-176',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      y: -50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    })

    // 描述动画
    gsap.from('.gf-desc-176', {
      scrollTrigger: {
        trigger: '.gf-container-176',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      delay: 0.2,
      ease: 'power3.out'
    })

    // 提示动画
    gsap.from('.gf-hint-176', {
      scrollTrigger: {
        trigger: '.gf-stage-176',
        start: 'bottom 20%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 20,
      duration: 0.6
    })

    // Canvas 粒子动画
    const canvas = canvasRef.value
    if (!canvas || !stageRef.value) return

    const resizeCanvas = () => {
      canvas.width = stageRef.value!.offsetWidth
      canvas.height = stageRef.value!.offsetHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const particles: Array<{x: number, y: number, vx: number, vy: number, size: number}> = []
    const particleCount = 50

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1
      })
    }

    const animate = () => {
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach(particle => {
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(100, 200, 255, 0.3)'
        ctx.fill()
      })

      // 绘制连线
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(100, 200, 255, ${0.2 * (1 - distance / 100)})`
            ctx.stroke()
          }
        })
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    // 清理
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, componentRoot.value)
})

onUnmounted(() => {
  if (ctx) ctx.revert()
})
</script>

<style scoped>
/* GSAP opacity fix: ensure content is always visible */

.gf-container-176 {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;

  opacity: 1 !important;}

.gf-title-176 {
  font-size: clamp(2rem, 5vw, 3.5rem);
  color: #fff;
  margin-bottom: 10px;
  text-align: center;
  background: linear-gradient(90deg, #e056fd, #686de0, #22a6b3);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 3s linear infinite;

  opacity: 1 !important;}

@keyframes shimmer {
  to { background-position: 200% center; }
}

.gf-desc-176 {
  font-size: clamp(0.9rem, 2vw, 1.2rem);
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 40px;
  text-align: center;

  opacity: 1 !important;}

.gf-stage-176 {
  width: 100%;
  max-width: 1000px;
  height: 700px;
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  background: radial-gradient(circle at center, rgba(100, 200, 255, 0.1) 0%, transparent 70%);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);

  opacity: 1 !important;}

.gf-canvas-176 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;

  opacity: 1 !important;}

.gf-foreground-176 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.gf-shape-176 {
  position: absolute;
  will-change: transform, opacity;
  mix-blend-mode: screen;
}

.gf-shape-circle-176 {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e056fd, #686de0);
  box-shadow: 0 10px 30px rgba(224, 86, 253, 0.4);

  opacity: 1 !important;}

.gf-shape-square-176 {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #22a6b3, #0984e3);
  box-shadow: 0 10px 30px rgba(34, 166, 179, 0.4);

  opacity: 1 !important;}

.gf-shape-triangle-176 {
  width: 0;
  height: 0;
  border-left: 30px solid transparent;
  border-right: 30px solid transparent;
  border-bottom: 52px solid #ff9f43;
  filter: drop-shadow(0 10px 20px rgba(255, 159, 67, 0.4));

  opacity: 1 !important;}

.gf-shape-diamond-176 {
  width: 45px;
  height: 45px;
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  transform: rotate(45deg);
  box-shadow: 0 10px 30px rgba(255, 107, 107, 0.4);

  opacity: 1 !important;}

.gf-overlay-176 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
}

.gf-text-176 {
  text-align: center;
  z-index: 10;

  opacity: 1 !important;}

.gf-text-main-176 {
  font-size: clamp(3rem, 8vw, 5rem);
  font-weight: bold;
  color: #fff;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  margin-bottom: 10px;
  will-change: transform, opacity;

  opacity: 1 !important;}

.gf-text-sub-176 {
  font-size: clamp(1.2rem, 3vw, 2rem);
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 4px;
  text-transform: uppercase;
  will-change: transform, opacity;

  opacity: 1 !important;}

.gf-hint-176 {
  margin-top: 30px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;

  opacity: 1 !important;}

@media (max-width: 768px) {
  .gf-stage-176 {
    height: 500px;
  
  opacity: 1 !important;}
  
  .gf-shape-176 {
    transform: scale(0.7);
  }
}
</style>
