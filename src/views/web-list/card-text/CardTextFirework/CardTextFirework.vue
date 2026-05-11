<template>
  <div ref="containerRef" class="firework-container">
    <!-- 夜空背景 -->
    <canvas ref="starCanvasRef" class="star-canvas"></canvas>
    
    <!-- 文字层 - 固定显示 -->
    <div ref="textLayerRef" class="text-layer">
      <span v-for="(char, index) in textChars" :key="index" :ref="el => setCharRef(el, index)" class="char-item">
        {{ char }}
      </span>
    </div>
    
    <!-- 烟花粒子层 -->
    <canvas ref="fireworkCanvasRef" class="firework-canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []

// Refs
const containerRef = ref<HTMLElement | null>(null)
const starCanvasRef = ref<HTMLCanvasElement | null>(null)
const textLayerRef = ref<HTMLElement | null>(null)
const fireworkCanvasRef = ref<HTMLCanvasElement | null>(null)

// 文字内容
const textChars = '烟花绽放'.split('')
const charRefs: HTMLElement[] = []

const setCharRef = (el: any, index: number) => {
  if (el) charRefs[index] = el as HTMLElement
}

// 粒子系统
interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  alpha: number
  color: string
  size: number
  life: number
  maxLife: number
  trail: Array<{ x: number; y: number; alpha: number }>
}

interface Firework {
  x: number
  y: number
  targetY: number
  speed: number
  color: string
  exploded: boolean
}

let particles: Particle[] = []
let fireworks: Firework[] = []
let animationFrameId: number | null = null
let starCtx: CanvasRenderingContext2D | null = null
let fwCtx: CanvasRenderingContext2D | null = null
const stars: Array<{ x: number; y: number; size: number; twinkle: number }> = []

// 初始化星空背景
const initStars = () => {
  const canvas = starCanvasRef.value
  if (!canvas) return
  
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  starCtx = canvas.getContext('2d')
  
  stars.length = 0
  for (let i = 0; i < 150; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      twinkle: Math.random() * Math.PI * 2
    })
  }
}

// 绘制星空
const drawStars = () => {
  if (!starCtx || !starCanvasRef.value) return
  
  starCtx.fillStyle = '#0a0a1a'
  starCtx.fillRect(0, 0, starCanvasRef.value.width, starCanvasRef.value.height)
  
  stars.forEach(star => {
    star.twinkle += 0.03
    const alpha = 0.3 + Math.sin(star.twinkle) * 0.4
    starCtx!.beginPath()
    starCtx!.arc(star.x, star.y, star.size, 0, Math.PI * 2)
    starCtx!.fillStyle = `rgba(255, 255, 255, ${alpha})`
    starCtx!.fill()
  })
}

// 创建烟花
const createFirework = (startX: number, startY: number, targetY: number, color: string): Firework => {
  return {
    x: startX,
    y: startY,
    targetY,
    speed: 6 + Math.random() * 4,
    color,
    exploded: false
  }
}

// 爆炸烟花
const explodeFirework = (firework: Firework) => {
  const colors = [
    firework.color,
    '#ffffff',
    '#ffff00',
    '#ff6600',
    '#ff00ff'
  ]
  
  const particleCount = 50 + Math.floor(Math.random() * 30)
  
  for (let i = 0; i < particleCount; i++) {
    const angle = (Math.PI * 2 / particleCount) * i + Math.random() * 0.3
    const speed = 2 + Math.random() * 5
    
    const particle: Particle = {
      x: firework.x,
      y: firework.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      alpha: 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 2 + Math.random() * 3,
      life: 0,
      maxLife: 50 + Math.random() * 30,
      trail: []
    }
    
    particles.push(particle)
  }
}

// 更新粒子
const updateParticles = () => {
  particles = particles.filter(p => {
    p.life++
    
    p.trail.push({ x: p.x, y: p.y, alpha: p.alpha })
    if (p.trail.length > 6) p.trail.shift()
    
    p.x += p.vx
    p.y += p.vy
    p.vy += 0.05
    p.vx *= 0.98
    p.vy *= 0.98
    
    const lifeRatio = p.life / p.maxLife
    p.alpha = 1 - lifeRatio
    p.size *= 0.98
    
    return p.life < p.maxLife
  })
}

// 绘制烟花
const drawFireworks = () => {
  if (!fwCtx || !fireworkCanvasRef.value) return
  
  fwCtx.fillStyle = 'rgba(10, 10, 26, 0.15)'
  fwCtx.fillRect(0, 0, fireworkCanvasRef.value.width, fireworkCanvasRef.value.height)
  
  fireworks.forEach(fw => {
    if (!fw.exploded) {
      fw.y -= fw.speed
      
      fwCtx!.beginPath()
      fwCtx!.arc(fw.x, fw.y, 4, 0, Math.PI * 2)
      const gradient = fwCtx!.createRadialGradient(fw.x, fw.y, 0, fw.x, fw.y, 10)
      gradient.addColorStop(0, '#ffffff')
      gradient.addColorStop(0.3, fw.color)
      gradient.addColorStop(1, 'transparent')
      fwCtx!.fillStyle = gradient
      fwCtx!.fill()
      
      if (fw.y <= fw.targetY) {
        fw.exploded = true
        explodeFirework(fw)
      }
    }
  })
  
  particles.forEach(p => {
    p.trail.forEach((t, i) => {
      const trailAlpha = (i / p.trail.length) * p.alpha * 0.3
      fwCtx!.beginPath()
      fwCtx!.arc(t.x, t.y, p.size * 0.5, 0, Math.PI * 2)
      fwCtx!.fillStyle = `rgba(255, 150, 50, ${trailAlpha})`
      fwCtx!.fill()
    })
    
    fwCtx!.beginPath()
    fwCtx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    fwCtx!.fillStyle = p.color
    fwCtx!.globalAlpha = p.alpha
    fwCtx!.shadowBlur = 8
    fwCtx!.shadowColor = p.color
    fwCtx!.fill()
    fwCtx!.shadowBlur = 0
    fwCtx!.globalAlpha = 1
  })
  
  fireworks = fireworks.filter(fw => !fw.exploded)
}

// 主动画循环
const animate = () => {
  drawStars()
  updateParticles()
  drawFireworks()
  animationFrameId = requestAnimationFrame(animate)
}

// 入场动画
const playEntryAnimation = () => {
  if (charRefs.length === 0) return
  
  // 文字初始状态
  gsap.set(charRefs, {
    opacity: 0,
    scale: 0,
    y: 50
  })
  
  // 依次出现
  charRefs.forEach((char, index) => {
    gsap.to(char, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.6,
      ease: 'back.out(1.7)',
      delay: index * 0.15
    })
  })
  
  // 文字出现后发射烟花
  setTimeout(() => {
    launchShow()
  }, textChars.length * 150 + 500)
}

// 发射表演
const launchShow = () => {
  const colors = ['#ff0000', '#ff6600', '#ffff00', '#00ff00', '#00ffff', '#ff00ff', '#ffffff']
  
  // 逐个字符发射烟花
  charRefs.forEach((char, index) => {
    const rect = char.getBoundingClientRect()
    const charCenterX = rect.left + rect.width / 2
    const targetY = rect.top + rect.height / 2
    
    setTimeout(() => {
      fireworks.push(createFirework(
        charCenterX,
        window.innerHeight + 20,
        targetY,
        colors[index % colors.length]
      ))
    }, index * 200)
  })
  
  // 终场烟花
  setTimeout(() => {
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        const x = 100 + Math.random() * (window.innerWidth - 200)
        fireworks.push(createFirework(
          x,
          window.innerHeight + 20,
          100 + Math.random() * (window.innerHeight - 300),
          colors[Math.floor(Math.random() * colors.length)]
        ))
      }, i * 100)
    }
  }, textChars.length * 200 + 500)
}

// ScrollTrigger控制
const initScrollTrigger = () => {
  if (!containerRef.value) return
  
  ScrollTrigger.create({
    trigger: containerRef.value,
    start: 'top 80%',
    end: 'top 20%',
    scrub: 1.5,
    onUpdate: (self) => {
      const progress = self.progress
      
      // 字符发光增强
      charRefs.forEach(char => {
        const glowIntensity = 15 + progress * 35
        char.style.textShadow = `
          0 0 ${glowIntensity}px #ffd700,
          0 0 ${glowIntensity * 2}px #ff8c00,
          0 0 ${glowIntensity * 3}px #ff4500
        `
      })
      
      // 随机发射烟花
      if (Math.random() < 0.15 * progress) {
        const x = 100 + Math.random() * (window.innerWidth - 200)
        const colors = ['#ff0000', '#ff6600', '#ffff00', '#00ffff', '#ff00ff']
        fireworks.push(createFirework(
          x,
          window.innerHeight + 20,
          100 + Math.random() * (window.innerHeight - 200),
          colors[Math.floor(Math.random() * colors.length)]
        ))
      }
    }
  })
  
  cleanupFns.push(() => ScrollTrigger.getAll().forEach(t => t.kill()))
}

// 鼠标点击
const initClickHandler = () => {
  if (!containerRef.value) return
  
  const handleClick = (e: MouseEvent) => {
    const clickX = e.clientX
    const clickY = e.clientY
    const colors = ['#ff0000', '#ff6600', '#ffff00', '#00ffff', '#ff00ff']
    
    fireworks.push(createFirework(
      clickX,
      window.innerHeight + 20,
      clickY,
      colors[Math.floor(Math.random() * colors.length)]
    ))
  }
  
  containerRef.value.addEventListener('click', handleClick)
  cleanupFns.push(() => containerRef.value?.removeEventListener('click', handleClick))
}

// 挂载
onMounted(() => {
  const canvas = fireworkCanvasRef.value
  if (canvas) {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    fwCtx = canvas.getContext('2d')
  }
  
  initStars()
  animate()
  
  setTimeout(() => {
    playEntryAnimation()
    initScrollTrigger()
    initClickHandler()
  }, 100)
  
  const handleResize = () => {
    initStars()
    if (fireworkCanvasRef.value) {
      fireworkCanvasRef.value.width = window.innerWidth
      fireworkCanvasRef.value.height = window.innerHeight
    }
  }
  window.addEventListener('resize', handleResize)
  cleanupFns.push(() => window.removeEventListener('resize', handleResize))
})

// 卸载
onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
  particles = []
  fireworks = []
})
</script>

<style scoped lang="scss">
.firework-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #0a0a1a;
}

.star-canvas {
  position: absolute;
  inset: 0;
}

.text-layer {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 12px;
  z-index: 10;
}

.char-item {
  font-size: clamp(60px, 12vw, 120px);
  font-weight: 900;
  color: #ffd700;
  text-shadow: 
    0 0 15px #ffd700,
    0 0 30px #ff8c00,
    0 0 45px #ff4500,
    0 0 60px #ff0000;
  display: inline-block;
  will-change: transform, opacity;
}

.firework-canvas {
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;
}
</style>
