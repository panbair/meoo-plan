<template>
  <div ref="containerRef" class="tsunami-3d-container">
    <!-- 海洋背景层 -->
    <div ref="oceanBgRef" class="ocean-bg"></div>
    
    <!-- 3D文字容器 -->
    <div ref="textContainerRef" class="text-container"></div>
    
    <!-- 气泡粒子层 -->
    <canvas ref="bubbleCanvasRef" class="bubble-canvas"></canvas>
    
    <!-- 波浪效果层 -->
    <div ref="waveOverlayRef" class="wave-overlay"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// 清理函数数组
const cleanupFns: Array<() => void> = []

// Refs
const containerRef = ref<HTMLElement | null>(null)
const oceanBgRef = ref<HTMLElement | null>(null)
const textContainerRef = ref<HTMLElement | null>(null)
const bubbleCanvasRef = ref<HTMLCanvasElement | null>(null)
const waveOverlayRef = ref<HTMLElement | null>(null)

// 文本内容
const textContent = '惊涛浮字'
const characters: HTMLElement[] = []
let bubbleCtx: CanvasRenderingContext2D | null = null
let bubbles: Array<{
  x: number
  y: number
  radius: number
  speed: number
  wobble: number
  wobbleSpeed: number
  opacity: number
}> = []
let animationFrameId: number | null = null

// 初始化3D文字
const initCharacters = () => {
  if (!textContainerRef.value) return
  
  textContainerRef.value.innerHTML = ''
  characters.length = 0
  
  const chars = textContent.split('')
  const containerWidth = window.innerWidth
  const charWidth = Math.min(80, containerWidth / (chars.length + 2))
  
  chars.forEach((char, index) => {
    const charEl = document.createElement('div')
    charEl.className = `char-item char-${index}`
    charEl.textContent = char
    charEl.style.cssText = `
      font-size: ${charWidth}px;
      font-weight: 900;
      color: #fff;
      text-shadow: 
        0 1px 0 #667eea,
        0 2px 0 #764ba2,
        0 3px 0 #f64f59,
        0 4px 10px rgba(0,0,0,0.4);
      background: linear-gradient(
        135deg,
        rgba(102, 126, 234, 0.9) 0%,
        rgba(118, 75, 162, 0.9) 50%,
        rgba(240, 147, 251, 0.9) 100%
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      padding: 10px 5px;
      transform-style: preserve-3d;
      backface-visibility: hidden;
    `
    textContainerRef.value?.appendChild(charEl)
    characters.push(charEl)
  })
}

// 初始化气泡
const initBubbles = () => {
  const canvas = bubbleCanvasRef.value
  if (!canvas) return
  
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  bubbleCtx = canvas.getContext('2d')
  
  bubbles = []
  for (let i = 0; i < 30; i++) {
    bubbles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 4 + 1,
      speed: Math.random() * 0.5 + 0.2,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.02 + 0.01,
      opacity: Math.random() * 0.3 + 0.1
    })
  }
}

// 绘制气泡
const drawBubbles = () => {
  if (!bubbleCtx || !bubbleCanvasRef.value) return
  
  bubbleCtx.clearRect(0, 0, bubbleCanvasRef.value.width, bubbleCanvasRef.value.height)
  
  bubbles.forEach(bubble => {
    bubbleCtx!.beginPath()
    bubbleCtx!.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2)
    bubbleCtx!.fillStyle = `rgba(255, 255, 255, ${bubble.opacity})`
    bubbleCtx!.fill()
    bubbleCtx!.strokeStyle = `rgba(255, 255, 255, ${bubble.opacity * 0.5})`
    bubbleCtx!.lineWidth = 1
    bubbleCtx!.stroke()
    
    bubble.y -= bubble.speed
    bubble.wobble += bubble.wobbleSpeed
    bubble.x += Math.sin(bubble.wobble) * 0.3
    
    if (bubble.y < -10) {
      bubble.y = bubbleCanvasRef.value!.height + 10
      bubble.x = Math.random() * bubbleCanvasRef.value!.width
    }
  })
  
  animationFrameId = requestAnimationFrame(drawBubbles)
}

// 入场动画
const playEntryAnimation = () => {
  if (characters.length === 0) return
  
  const tl = gsap.timeline()
  
  // 初始状态
  gsap.set(characters, {
    y: 200,
    rotateX: -90,
    opacity: 0,
    scale: 0.5
  })
  
  // 入场动画
  tl.to(characters, {
    y: 0,
    rotateX: 0,
    opacity: 1,
    scale: 1,
    duration: 1.2,
    stagger: 0.1,
    ease: 'elastic.out(1, 0.5)'
  })
  
  // 浮动入场
  characters.forEach((char, index) => {
    gsap.to(char, {
      y: '+=15',
      duration: 2 + Math.random(),
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: index * 0.1
    })
  })
  
  cleanupFns.push(() => {
    tl.kill()
    characters.forEach(char => gsap.killTweensOf(char))
  })
}

// 波浪动画
const createWaveAnimation = () => {
  if (characters.length === 0) return
  
  const tl = gsap.timeline({
    repeat: -1,
    yoyo: true
  })
  
  // 创建波浪效果
  const waveAmplitude = 30
  const waveFrequency = 0.02
  
  characters.forEach((char, index) => {
    const baseY = 0
    const phase = index * waveFrequency * Math.PI * 2
    
    gsap.to(char, {
      y: baseY + Math.sin(phase) * waveAmplitude,
      rotateX: Math.sin(phase) * 15,
      rotateZ: Math.sin(phase) * 5,
      scale: 1 + Math.sin(phase) * 0.1,
      duration: 0.3,
      ease: 'sine.inOut'
    })
  })
  
  cleanupFns.push(() => tl.kill())
}

// ScrollTrigger控制
const initScrollTrigger = () => {
  if (!containerRef.value) return
  
  // 波浪增强
  const waveTrigger = ScrollTrigger.create({
    trigger: containerRef.value,
    start: 'top 80%',
    end: 'top 20%',
    scrub: 1.5,
    onUpdate: (self) => {
      const progress = self.progress
      const amplitude = 20 + progress * 60
      
      characters.forEach((char, index) => {
        const phase = index * 0.15 + progress * Math.PI * 4
        gsap.to(char, {
          y: Math.sin(phase) * amplitude,
          rotateX: Math.sin(phase) * 25,
          rotateY: Math.sin(phase + 1) * 10,
          duration: 0.5,
          overwrite: 'auto'
        })
      })
    }
  })
  
  // 背景颜色变化
  if (oceanBgRef.value) {
    ScrollTrigger.create({
      trigger: containerRef.value,
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1.5,
      onUpdate: (self) => {
        const depth = self.progress
        gsap.to(oceanBgRef.value, {
          backgroundPositionY: `${depth * 100}%`,
          duration: 0.3
        })
      }
    })
  }
  
  cleanupFns.push(() => waveTrigger.kill())
}

// 鼠标点击涟漪效果
const initClickRipple = () => {
  if (!containerRef.value || characters.length === 0) return
  
  const handleClick = (e: MouseEvent) => {
    const clickX = e.clientX
    const clickY = e.clientY
    
    // 创建涟漪元素
    const ripple = document.createElement('div')
    ripple.className = 'click-ripple'
    ripple.style.cssText = `
      position: fixed;
      left: ${clickX}px;
      top: ${clickY}px;
      width: 20px;
      height: 20px;
      border: 3px solid rgba(255, 255, 255, 0.8);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
      z-index: 1000;
    `
    document.body.appendChild(ripple)
    
    gsap.to(ripple, {
      width: 400,
      height: 400,
      opacity: 0,
      duration: 1.5,
      ease: 'power2.out',
      onComplete: () => ripple.remove()
    })
    
    // 推开字符
    characters.forEach((char, index) => {
      const rect = char.getBoundingClientRect()
      const charX = rect.left + rect.width / 2
      const charY = rect.top + rect.height / 2
      
      const dx = charX - clickX
      const dy = charY - clickY
      const distance = Math.sqrt(dx * dx + dy * dy)
      const maxDistance = 400
      
      if (distance < maxDistance) {
        const force = (1 - distance / maxDistance) * 80
        const angle = Math.atan2(dy, dx)
        const pushX = Math.cos(angle) * force
        const pushY = Math.sin(angle) * force
        
        gsap.to(char, {
          x: pushX,
          y: pushY + 30,
          rotateX: force * 0.5,
          duration: 0.5,
          ease: 'power2.out',
          onComplete: () => {
            gsap.to(char, {
              x: 0,
              y: Math.sin(index * 0.5) * 20,
              rotateX: 0,
              duration: 1.5,
              ease: 'elastic.out(1, 0.4)'
            })
          }
        })
      }
    })
  }
  
  containerRef.value.addEventListener('click', handleClick)
  cleanupFns.push(() => containerRef.value?.removeEventListener('click', handleClick))
}

// 挂载时执行
onMounted(() => {
  initCharacters()
  initBubbles()
  drawBubbles()
  
  // 延迟执行动画，确保DOM已渲染
  setTimeout(() => {
    playEntryAnimation()
    createWaveAnimation()
    initScrollTrigger()
    initClickRipple()
  }, 100)
  
  // 窗口调整
  const handleResize = () => {
    initCharacters()
    initBubbles()
  }
  window.addEventListener('resize', handleResize)
  cleanupFns.push(() => window.removeEventListener('resize', handleResize))
})

// 卸载时清理
onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
})
</script>

<style scoped lang="scss">
.tsunami-3d-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(
    180deg,
    #0c1445 0%,
    #1a237e 30%,
    #283593 50%,
    #1e3a5f 70%,
    #0d47a1 100%
  );
}

.ocean-bg {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(ellipse at 30% 70%, rgba(0, 150, 255, 0.2) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 30%, rgba(100, 200, 255, 0.15) 0%, transparent 40%),
    linear-gradient(
      180deg,
      rgba(0, 50, 100, 0.3) 0%,
      rgba(0, 100, 150, 0.2) 50%,
      rgba(0, 150, 200, 0.1) 100%
    );
  animation: oceanShimmer 8s ease-in-out infinite;
}

@keyframes oceanShimmer {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}

.text-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 8px;
  perspective: 800px;
  perspective-origin: center center;
}

.char-item {
  display: inline-block;
  transform-style: preserve-3d;
  will-change: transform, opacity;
}

.bubble-canvas {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.wave-overlay {
  position: absolute;
  inset: 0;
  background: 
    linear-gradient(
      45deg,
      transparent 30%,
      rgba(255, 255, 255, 0.03) 50%,
      transparent 70%
    );
  animation: waveOverlayMove 6s linear infinite;
  pointer-events: none;
}

@keyframes waveOverlayMove {
  0% { transform: translateX(-100%) rotate(0deg); }
  100% { transform: translateX(100%) rotate(0deg); }
}
</style>
