<template>
  <div ref="containerRef" class="origami-container">
    <!-- 背景 -->
    <div ref="bgRef" class="bg-layer"></div>
    
    <!-- 文字层 -->
    <div ref="textLayerRef" class="text-layer">
      <span v-for="(char, index) in textChars" :key="index" :ref="el => setCharRef(el, index)" class="char-item">
        {{ char }}
      </span>
    </div>
    
    <!-- 装饰层 -->
    <div ref="decoRef" class="deco-layer"></div>
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
const bgRef = ref<HTMLElement | null>(null)
const textLayerRef = ref<HTMLElement | null>(null)
const decoRef = ref<HTMLElement | null>(null)

// 字符Refs
const textChars = '折纸艺术'.split('')
const charRefs: HTMLElement[] = []

const setCharRef = (el: any, index: number) => {
  if (el) charRefs[index] = el as HTMLElement
}

// 鼠标状态
let mouseX = window.innerWidth / 2
let mouseY = window.innerHeight / 2

// 入场动画
const playEntryAnimation = () => {
  if (charRefs.length === 0) return
  
  gsap.set(charRefs, {
    opacity: 0,
    y: 80,
    scaleX: 0.3,
    skewX: 45
  })
  
  charRefs.forEach((char, index) => {
    gsap.to(char, {
      opacity: 1,
      y: 0,
      scaleX: 1,
      skewX: 0,
      duration: 0.8,
      ease: 'elastic.out(1, 0.5)',
      delay: index * 0.15
    })
  })
  
  cleanupFns.push(() => {
    charRefs.forEach(char => gsap.killTweensOf(char))
  })
}

// 折痕展开动画
const playCreaseAnimation = () => {
  const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 })
  
  charRefs.forEach((char, index) => {
    tl.to(char, {
      scaleX: 1.05,
      duration: 0.3,
      ease: 'power2.inOut'
    }, index * 0.1)
    .to(char, {
      scaleX: 1,
      duration: 0.3,
      ease: 'power2.inOut'
    }, index * 0.1 + 0.3)
  })
  
  cleanupFns.push(() => tl.kill())
}

// 鼠标跟随效果
const initMouseFollow = () => {
  if (!containerRef.value) return
  
  const handleMouseMove = (e: MouseEvent) => {
    mouseX = e.clientX
    mouseY = e.clientY
    
    if (textLayerRef.value) {
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      
      const rotateY = ((mouseX - centerX) / centerX) * 15
      const rotateX = ((mouseY - centerY) / centerY) * -10
      
      gsap.to(textLayerRef.value, {
        rotateY: rotateY,
        rotateX: rotateX,
        duration: 0.8,
        ease: 'power2.out'
      })
    }
    
    // 更新字符阴影
    charRefs.forEach((char, index) => {
      const rect = char.getBoundingClientRect()
      const charCenterX = rect.left + rect.width / 2
      const charCenterY = rect.top + rect.height / 2
      
      const shadowX = (mouseX - charCenterX) * 0.02
      const shadowY = (mouseY - charCenterY) * 0.02
      
      gsap.to(char, {
        x: shadowX,
        y: shadowY,
        duration: 0.3
      })
    })
  }
  
  containerRef.value.addEventListener('mousemove', handleMouseMove)
  cleanupFns.push(() => containerRef.value?.removeEventListener('mousemove', handleMouseMove))
}

// 装饰动画
const initDecorations = () => {
  if (!decoRef.value) return
  
  // 创建立体方块
  for (let i = 0; i < 6; i++) {
    const box = document.createElement('div')
    box.className = `deco-box deco-${i}`
    box.style.cssText = `
      position: absolute;
      width: ${40 + Math.random() * 40}px;
      height: ${40 + Math.random() * 40}px;
      background: linear-gradient(135deg, 
        rgba(245, 235, 224, 0.9) 0%, 
        rgba(212, 196, 176, 0.8) 100%);
      border: 2px solid #c4b4a0;
      border-radius: 4px;
      box-shadow: 
        inset 0 0 15px rgba(139, 119, 101, 0.1),
        4px 4px 12px rgba(0, 0, 0, 0.2),
        8px 8px 0 rgba(180, 160, 140, 0.3);
      opacity: 0;
      transform: scale(0) rotate(${Math.random() * 30}deg);
    `
    box.style.left = `${10 + Math.random() * 80}%`
    box.style.top = `${10 + Math.random() * 80}%`
    decoRef.value.appendChild(box)
  }
  
  gsap.to('.deco-box', {
    opacity: 1,
    scale: 1,
    duration: 0.6,
    stagger: 0.1,
    ease: 'back.out(1.7)',
    delay: 0.5
  })
}

// ScrollTrigger
const initScrollTrigger = () => {
  if (!containerRef.value) return
  
  ScrollTrigger.create({
    trigger: containerRef.value,
    start: 'top 80%',
    end: 'top 20%',
    scrub: 1.5,
    onUpdate: (self) => {
      const progress = self.progress
      
      charRefs.forEach((char, index) => {
        const offset = Math.sin(progress * Math.PI + index * 0.5) * 8
        gsap.to(char, {
          y: offset,
          duration: 0.5,
          overwrite: 'auto'
        })
      })
    }
  })
  
  cleanupFns.push(() => ScrollTrigger.getAll().forEach(t => t.kill()))
}

// 挂载
onMounted(() => {
  setTimeout(() => {
    playEntryAnimation()
    playCreaseAnimation()
    initDecorations()
    initMouseFollow()
    initScrollTrigger()
  }, 100)
})

// 卸载
onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
})
</script>

<style scoped lang="scss">
.origami-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #1a1a2e;
}

.bg-layer {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(ellipse at 50% 30%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 30% 70%, rgba(139, 92, 246, 0.1) 0%, transparent 40%),
    linear-gradient(180deg, #16213e 0%, #1a1a2e 50%, #0f0f23 100%);
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: 
      radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.03) 0%, transparent 30%),
      radial-gradient(circle at 80% 50%, rgba(255, 255, 255, 0.02) 0%, transparent 25%);
  }
}

.text-layer {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 20px;
  perspective: 800px;
}

.char-item {
  font-size: clamp(70px, 15vw, 140px);
  font-weight: 900;
  font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
  color: #ffffff;
  text-shadow: 
    0 0 10px rgba(167, 139, 250, 0.8),
    0 0 20px rgba(139, 92, 246, 0.6),
    0 0 30px rgba(99, 102, 241, 0.4),
    0 4px 8px rgba(0, 0, 0, 0.5);
  display: inline-block;
  transform-style: preserve-3d;
  will-change: transform, opacity;
  letter-spacing: 8px;
}

.deco-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.deco-box {
  transform-style: preserve-3d;
}
</style>
