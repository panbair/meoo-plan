<template>
  <div class="pe-container-183">
    <h2 class="pe-title-183">粒子爆炸滚动动画</h2>
    <div class="pe-stage-183">
      <div class="pe-canvas-container-183">
        <canvas ref="particleCanvas" class="pe-canvas-183"></canvas>
      </div>
      <div class="pe-cards-183">
        <div class="pe-card-183">
          <div class="pe-icon-183">💥</div>
          <h3>粒子爆发</h3>
          <p>滚动的能量释放</p>
        </div>
        <div class="pe-card-183">
          <div class="pe-icon-183">⚡</div>
          <h3>能量传递</h3>
          <p>滚动触发的连锁反应</p>
        </div>
        <div class="pe-card-183">
          <div class="pe-icon-183">🌟</div>
          <h3>星光闪烁</h3>
          <p>粒子系统的美妙</p>
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

const particleCanvas = ref<HTMLCanvasElement | null>(null)
let ctx: gsap.Context
let animationId: number | null = null

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  alpha: number
}

const particles: Particle[] = []
const colors = ['#00ffff', '#ff00ff', '#ffff00', '#00ff00', '#ff6600']

const createParticle = (x: number, y: number) => {
  const angle = Math.random() * Math.PI * 2
  const speed = Math.random() * 3 + 1
  particles.push({
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    size: Math.random() * 3 + 1,
    color: colors[Math.floor(Math.random() * colors.length)],
    alpha: 1
  })
}

const animate = () => {
  const canvas = particleCanvas.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  particles.forEach((particle, index) => {
    particle.x += particle.vx
    particle.y += particle.vy
    particle.alpha -= 0.005

    if (particle.alpha <= 0) {
      particles.splice(index, 1)
    } else {
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fillStyle = particle.color
      ctx.globalAlpha = particle.alpha
      ctx.fill()
      ctx.globalAlpha = 1
    }
  })

  animationId = requestAnimationFrame(animate)
}

onMounted(() => {
  const canvas = particleCanvas.value
  if (!canvas) return

  const container = canvas.parentElement
  if (!container) return

  canvas.width = container.offsetWidth
  canvas.height = 400

  ctx = gsap.context(() => {
    // 粒子爆炸动画 - 滚动触发
    let lastScrollProgress = 0
    ScrollTrigger.create({
      trigger: '.pe-stage-183',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress
        const delta = Math.abs(progress - lastScrollProgress)
        
        if (delta > 0.01) {
          const centerX = canvas.width / 2
          const centerY = canvas.height / 2
          const particleCount = Math.floor(delta * 50)
          
          for (let i = 0; i < particleCount; i++) {
            createParticle(centerX, centerY)
          }
        }
        
        lastScrollProgress = progress
      }
    })

    // 持续生成粒子
    const continuousGenerate = () => {
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      createParticle(centerX + (Math.random() - 0.5) * 100, centerY + (Math.random() - 0.5) * 100)
      setTimeout(continuousGenerate, 50)
    }
    continuousGenerate()

    animate()

    // 卡片动画
    gsap.utils.toArray<HTMLElement>('.pe-card-183').forEach((card, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top bottom-=100',
          toggleActions: 'play none none reverse'
        },
        scale: 0,
        opacity: 0,
        rotate: 180,
        duration: 1,
        ease: 'elastic.out(1, 0.5)',
        delay: index * 0.2
      })

      card.addEventListener('mouseenter', () => {
        gsap.to(card.querySelector('.pe-icon-183'), {
          scale: 1.5,
          rotate: 360,
          duration: 0.5,
          ease: 'elastic.out(1, 0.3)'
        })
        // 悬停时生成更多粒子
        for (let i = 0; i < 20; i++) {
          createParticle(canvas.width / 2, canvas.height / 2)
        }
      })

      card.addEventListener('mouseleave', () => {
        gsap.to(card.querySelector('.pe-icon-183'), {
          scale: 1,
          rotate: 0,
          duration: 0.5,
          ease: 'power2.out'
        })
      })
    })

    // 标题动画
    gsap.from('.pe-title-183', {
      scrollTrigger: {
        trigger: '.pe-title-183',
        start: 'top bottom-=100',
        toggleActions: 'play none none reverse'
      },
      y: -50,
      opacity: 0,
      scale: 1.5,
      duration: 1,
      ease: 'power3.out'
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})
</script>

<style scoped>
/* GSAP opacity fix: ensure content is always visible */

.pe-container-183 {
  min-height: 100vh;
  padding: 80px 20px;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 50%, #0a0a0a 100%);
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.pe-container-183::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 30% 70%, rgba(255, 0, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 70% 30%, rgba(255, 255, 0, 0.05) 0%, transparent 50%);
  pointer-events: none;
}

.pe-title-183 {
  text-align: center;
  font-size: 2.5rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: 60px;
  text-shadow: 0 0 30px rgba(255, 255, 0, 0.5);

  opacity: 1 !important;}

.pe-stage-183 {
  max-width: 1400px;
  margin: 0 auto;

  opacity: 1 !important;}

.pe-canvas-container-183 {
  position: relative;
  width: 100%;
  height: 400px;
  margin-bottom: 60px;
  border-radius: 20px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.1);

  opacity: 1 !important;}

.pe-canvas-183 {
  display: block;
  width: 100%;
  height: 100%;

  opacity: 1 !important;}

.pe-cards-183 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.pe-card-183 {
  position: relative;
  padding: 40px 30px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  text-align: center;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  overflow: hidden;

  opacity: 1 !important;}

.pe-card-183::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #ff00ff, #ffff00, #00ffff);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.pe-card-183:hover::before {
  transform: scaleX(1);
}

.pe-card-183:hover {
  transform: translateY(-10px);
  border-color: rgba(255, 255, 255, 0.4);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.pe-icon-183 {
  font-size: 3rem;
  margin-bottom: 20px;
  display: inline-block;
  transition: transform 0.3s ease;

  opacity: 1 !important;}

.pe-card-183 h3 {
  font-size: 1.6rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: 10px;
}

.pe-card-183 p {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.7);
}

@media (max-width: 768px) {
  .pe-title-183 {
    font-size: 1.8rem;
  
  opacity: 1 !important;}
  
  .pe-canvas-container-183 {
    height: 300px;
  
  opacity: 1 !important;}
  
  .pe-cards-183 {
    grid-template-columns: 1fr;
  }
}
</style>
