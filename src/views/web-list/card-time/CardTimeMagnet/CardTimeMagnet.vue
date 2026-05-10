<template>
  <div ref="containerRef" class="magnet-orbit-container">
    <!-- 背景磁场效果 -->
    <div class="magnetic-field-bg"></div>
    
    <!-- 中心磁场核心 -->
    <div class="magnetic-core">
      <div class="core-ring core-ring-1"></div>
      <div class="core-ring core-ring-2"></div>
      <div class="core-ring core-ring-3"></div>
      <div class="core-pulse"></div>
    </div>
    
    <!-- 卡片轨道容器 -->
    <div ref="orbitRef" class="magnet-orbit">
      <!-- 卡片1 -->
      <div 
        :ref="(el) => setCardRef(0, el as HTMLElement)" 
        class="magnet-card"
        data-index="0"
      >
        <div class="card-glow"></div>
        <div class="card-inner">
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div class="card-title">星际导航</div>
          <div class="card-desc">穿越磁场的精准定位</div>
          <div class="card-badge">01</div>
        </div>
      </div>
      
      <!-- 卡片2 -->
      <div 
        :ref="(el) => setCardRef(1, el as HTMLElement)" 
        class="magnet-card"
        data-index="1"
      >
        <div class="card-glow"></div>
        <div class="card-inner">
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
            </svg>
          </div>
          <div class="card-title">能量核心</div>
          <div class="card-desc">稳定的磁场输出保障</div>
          <div class="card-badge">02</div>
        </div>
      </div>
      
      <!-- 卡片3 -->
      <div 
        :ref="(el) => setCardRef(2, el as HTMLElement)" 
        class="magnet-card"
        data-index="2"
      >
        <div class="card-glow"></div>
        <div class="card-inner">
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"/>
            </svg>
          </div>
          <div class="card-title">量子传输</div>
          <div class="card-desc">跨维度的信息交换</div>
          <div class="card-badge">03</div>
        </div>
      </div>
      
      <!-- 卡片4 -->
      <div 
        :ref="(el) => setCardRef(3, el as HTMLElement)" 
        class="magnet-card"
        data-index="3"
      >
        <div class="card-glow"></div>
        <div class="card-inner">
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="M9 12l2 2 4-4"/>
            </svg>
          </div>
          <div class="card-title">磁场护盾</div>
          <div class="card-desc">智能防御系统</div>
          <div class="card-badge">04</div>
        </div>
      </div>
      
      <!-- 卡片5 -->
      <div 
        :ref="(el) => setCardRef(4, el as HTMLElement)" 
        class="magnet-card"
        data-index="4"
      >
        <div class="card-glow"></div>
        <div class="card-inner">
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="10"/>
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          </div>
          <div class="card-title">引力场域</div>
          <div class="card-desc">空间扭曲的完美平衡</div>
          <div class="card-badge">05</div>
        </div>
      </div>
      
      <!-- 卡片6 -->
      <div 
        :ref="(el) => setCardRef(5, el as HTMLElement)" 
        class="magnet-card"
        data-index="5"
      >
        <div class="card-glow"></div>
        <div class="card-inner">
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
          </div>
          <div class="card-title">脉冲引擎</div>
          <div class="card-desc">磁能驱动的核心动力</div>
          <div class="card-badge">06</div>
        </div>
      </div>
    </div>
    
    <!-- 轨道线 -->
    <svg class="orbit-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
      <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" stroke-width="0.3" stroke-dasharray="2 2" class="orbit-circle"/>
    </svg>
    
    <!-- 磁力粒子 -->
    <div class="magnetic-particles">
      <div v-for="i in 20" :key="i" class="particle" :style="{ '--delay': `${i * 0.2}s`, '--duration': `${3 + Math.random() * 4}s` }"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface TweenCleanup {
  kill: () => void
}

const containerRef = ref<HTMLElement | null>(null)
const orbitRef = ref<HTMLElement | null>(null)
const cardsMap = new Map<number, HTMLElement>()
const tweenCleanups: TweenCleanup[] = []

const CARD_COUNT = 6
const RADIUS = 280

const setCardRef = (index: number, el: HTMLElement | null) => {
  if (el) {
    cardsMap.set(index, el)
  } else {
    cardsMap.delete(index)
  }
}

const getCards = (): HTMLElement[] => {
  const cards: HTMLElement[] = []
  for (let i = 0; i < CARD_COUNT; i++) {
    const card = cardsMap.get(i)
    if (card) cards.push(card)
  }
  return cards
}

let mouseX = 0
let mouseY = 0
let isMouseInContainer = false
let magneticAnimationFrame: number | null = null

const handleMouseMove = (e: MouseEvent) => {
  if (!containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  mouseX = e.clientX - rect.left - rect.width / 2
  mouseY = e.clientY - rect.top - rect.height / 2
  isMouseInContainer = true
}

const handleMouseLeave = () => {
  isMouseInContainer = false
  const cards = getCards()
  const total = cards.length
  
  cards.forEach((card, i) => {
    const angle = (i / total) * Math.PI * 2
    const baseX = Math.cos(angle) * RADIUS
    const baseY = Math.sin(angle) * RADIUS * 0.4
    
    gsap.to(card, {
      x: 0,
      y: 0,
      z: 0,
      rotationX: 0,
      rotationY: 0,
      duration: 1,
      ease: 'power2.out'
    })
  })
}

const updateMagneticPull = () => {
  if (!isMouseInContainer || !orbitRef.value) {
    magneticAnimationFrame = requestAnimationFrame(updateMagneticPull)
    return
  }
  
  const cards = getCards()
  const total = cards.length
  
  cards.forEach((card, i) => {
    const angle = (i / total) * Math.PI * 2
    const baseX = Math.cos(angle) * RADIUS
    const baseY = Math.sin(angle) * RADIUS * 0.4
    
    const dist = Math.hypot(mouseX - baseX, mouseY - baseY)
    const pull = Math.max(0, 1 - dist / 500) * 80
    
    gsap.to(card, {
      x: (mouseX - baseX) * pull * 0.008,
      y: (mouseY - baseY) * pull * 0.008,
      z: pull * 0.5,
      rotationX: (mouseY - baseY) * 0.02,
      rotationY: (mouseX - baseX) * 0.02,
      duration: 0.4,
      overwrite: 'auto'
    })
  })
  
  magneticAnimationFrame = requestAnimationFrame(updateMagneticPull)
}

onMounted(() => {
  if (!containerRef.value || !orbitRef.value) return
  
  const container = containerRef.value
  const orbit = orbitRef.value
  const cards = getCards()
  const total = cards.length
  
  // 初始化卡片位置
  cards.forEach((card, i) => {
    const angle = (i / total) * Math.PI * 2
    const x = Math.cos(angle) * RADIUS
    const y = Math.sin(angle) * RADIUS * 0.4
    const rotationY = (angle * 180) / Math.PI
    
    gsap.set(card, {
      x: 0,
      y: 0,
      z: 0,
      opacity: 0,
      scale: 0.5,
      rotationX: 0,
      rotationY: rotationY,
      transformPerspective: 1000,
      transformOrigin: 'center center'
    })
  })
  
  // 创建入场动画 Timeline
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1.5,
      markers: false
    }
  })
  
  // 阶段1: 整体旋转入场
  tl.to(orbit, {
    rotationZ: 15,
    duration: 1,
    ease: 'power2.inOut'
  })
  .to(cards, {
    opacity: 1,
    scale: 1,
    stagger: 0.1,
    duration: 0.8,
    ease: 'back.out(1.7)'
  }, '<')
  
  // 阶段2: 环绕旋转展示
  tl.to(orbit, {
    rotationZ: 360,
    duration: 4,
    ease: 'none'
  }, '>')
  
  // 阶段3: 磁场脉冲 - 各卡片依次自转弹跳
  cards.forEach((card, i) => {
    tl.to(card, {
      rotationY: '+=360',
      z: 60,
      scale: 1.1,
      duration: 0.5,
      ease: 'power2.inOut'
    }, `<+=${i * 0.15}`)
    .to(card, {
      z: 0,
      scale: 1,
      duration: 0.4,
      ease: 'back.out(2)'
    }, '<+0.25')
  })
  
  // 阶段4: 回归正视
  tl.to(orbit, {
    rotationZ: 0,
    duration: 1.5,
    ease: 'power2.out'
  }, '>-=0.5')
  
  // 阶段5: 最终微调角度
  cards.forEach((card, i) => {
    const finalAngle = (i / total) * Math.PI * 2
    tl.to(card, {
      rotationY: finalAngle * (180 / Math.PI),
      rotationX: 0,
      duration: 0.6,
      ease: 'power2.inOut'
    }, '<')
  })
  
  tweenCleanups.push({
    kill: () => tl.kill()
  })
  
  // 中心磁场核心动画
  const corePulse = container.querySelector('.core-pulse') as HTMLElement
  if (corePulse) {
    const pulseTl = gsap.timeline({ repeat: -1 })
    pulseTl.to(corePulse, {
      scale: 1.5,
      opacity: 0,
      duration: 2,
      ease: 'power2.out'
    }).to(corePulse, {
      scale: 0.5,
      opacity: 0.8,
      duration: 0,
      ease: 'power2.in'
    }, '<')
    
    tweenCleanups.push({
      kill: () => pulseTl.kill()
    })
  }
  
  // 核心环旋转
  const coreRings = container.querySelectorAll('.core-ring')
  coreRings.forEach((ring, i) => {
    const direction = i % 2 === 0 ? 1 : -1
    const ringTl = gsap.to(ring, {
      rotation: direction * 360,
      duration: 3 + i,
      repeat: -1,
      ease: 'none'
    })
    tweenCleanups.push({
      kill: () => ringTl.kill()
    })
  })
  
  // 磁力粒子动画
  const particles = container.querySelectorAll('.particle')
  particles.forEach((particle, i) => {
    const angle = (i / particles.length) * Math.PI * 2
    const particleTl = gsap.to(particle, {
      x: Math.cos(angle) * 150,
      y: Math.sin(angle) * 80,
      opacity: Math.random() * 0.5 + 0.3,
      duration: 2 + Math.random() * 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
    tweenCleanups.push({
      kill: () => particleTl.kill()
    })
  })
  
  // 鼠标交互
  container.addEventListener('mousemove', handleMouseMove)
  container.addEventListener('mouseleave', handleMouseLeave)
  magneticAnimationFrame = requestAnimationFrame(updateMagneticPull)
})

onUnmounted(() => {
  tweenCleanups.forEach(cleanup => cleanup.kill())
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
  
  if (magneticAnimationFrame) {
    cancelAnimationFrame(magneticAnimationFrame)
  }
  
  if (containerRef.value) {
    containerRef.value.removeEventListener('mousemove', handleMouseMove)
    containerRef.value.removeEventListener('mouseleave', handleMouseLeave)
  }
})
</script>

<style scoped lang="scss">
.magnet-orbit-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 50%, #0f0f2a 100%);
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: 
      radial-gradient(circle at 30% 30%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 70% 70%, rgba(168, 85, 247, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
}

.magnetic-field-bg {
  position: absolute;
  inset: 0;
  background: 
    repeating-conic-gradient(
      from 0deg at 50% 50%,
      rgba(99, 102, 241, 0.03) 0deg 15deg,
      transparent 15deg 30deg
    );
  animation: fieldRotate 60s linear infinite;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at center, transparent 30%, rgba(10, 10, 26, 0.8) 100%);
  }
}

@keyframes fieldRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.magnetic-core {
  position: absolute;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
  
  .core-ring {
    position: absolute;
    border-radius: 50%;
    border: 1px solid;
    opacity: 0.4;
    
    &-1 {
      width: 60px;
      height: 60px;
      border-color: rgba(99, 102, 241, 0.6);
    }
    
    &-2 {
      width: 80px;
      height: 80px;
      border-color: rgba(168, 85, 247, 0.4);
    }
    
    &-3 {
      width: 100px;
      height: 100px;
      border-color: rgba(59, 130, 246, 0.3);
    }
  }
  
  .core-pulse {
    position: absolute;
    width: 20px;
    height: 20px;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.9) 0%, rgba(168, 85, 247, 0.5) 50%, transparent 70%);
    border-radius: 50%;
    box-shadow: 
      0 0 20px rgba(99, 102, 241, 0.8),
      0 0 40px rgba(168, 85, 247, 0.5);
  }
}

.magnet-orbit {
  position: relative;
  width: 800px;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-style: preserve-3d;
  z-index: 10;
}

.orbit-lines {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  
  .orbit-circle {
    color: rgba(99, 102, 241, 0.2);
  }
}

.magnet-card {
  position: absolute;
  width: 160px;
  height: 200px;
  cursor: pointer;
  transform-style: preserve-3d;
  will-change: transform;
  
  &:nth-child(1) { transform: translateX(-320px) translateY(-80px); }
  &:nth-child(2) { transform: translateX(-160px) translateY(-140px); }
  &:nth-child(3) { transform: translateX(0px) translateY(-160px); }
  &:nth-child(4) { transform: translateX(160px) translateY(-140px); }
  &:nth-child(5) { transform: translateX(320px) translateY(-80px); }
  &:nth-child(6) { transform: translateX(400px) translateY(20px); }
  
  .card-glow {
    position: absolute;
    inset: -20px;
    background: radial-gradient(
      ellipse at center,
      rgba(99, 102, 241, 0.3) 0%,
      rgba(168, 85, 247, 0.1) 40%,
      transparent 70%
    );
    border-radius: 20px;
    opacity: 0;
    transition: opacity 0.3s ease;
    filter: blur(10px);
  }
  
  &:hover .card-glow {
    opacity: 1;
  }
  
  .card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      145deg,
      rgba(20, 20, 50, 0.9) 0%,
      rgba(30, 30, 70, 0.8) 100%
    );
    border: 1px solid rgba(99, 102, 241, 0.3);
    border-radius: 16px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    backdrop-filter: blur(10px);
    box-shadow: 
      0 10px 40px rgba(0, 0, 0, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
    
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 16px;
      background: linear-gradient(
        135deg,
        rgba(99, 102, 241, 0.1) 0%,
        transparent 50%,
        rgba(168, 85, 247, 0.1) 100%
      );
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    &:hover {
      border-color: rgba(99, 102, 241, 0.6);
      box-shadow: 
        0 15px 50px rgba(0, 0, 0, 0.6),
        0 0 30px rgba(99, 102, 241, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.15);
      
      &::before {
        opacity: 1;
      }
    }
  }
  
  .card-icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(99, 102, 241, 0.9);
    filter: drop-shadow(0 0 10px rgba(99, 102, 241, 0.5));
    
    svg {
      width: 100%;
      height: 100%;
    }
  }
  
  .card-title {
    font-size: 16px;
    font-weight: 700;
    color: #fff;
    text-align: center;
    letter-spacing: 2px;
    text-transform: uppercase;
    text-shadow: 0 2px 10px rgba(99, 102, 241, 0.5);
  }
  
  .card-desc {
    font-size: 11px;
    color: rgba(199, 210, 254, 0.7);
    text-align: center;
    line-height: 1.4;
  }
  
  .card-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    font-size: 24px;
    font-weight: 900;
    color: rgba(99, 102, 241, 0.15);
    letter-spacing: 2px;
  }
  
  // 卡片特有颜色
  &:nth-child(1) .card-inner { border-color: rgba(99, 102, 241, 0.4); }
  &:nth-child(2) .card-inner { border-color: rgba(168, 85, 247, 0.4); }
  &:nth-child(3) .card-inner { border-color: rgba(59, 130, 246, 0.4); }
  &:nth-child(4) .card-inner { border-color: rgba(34, 211, 238, 0.4); }
  &:nth-child(5) .card-inner { border-color: rgba(236, 72, 153, 0.4); }
  &:nth-child(6) .card-inner { border-color: rgba(16, 185, 129, 0.4); }
  
  &:nth-child(1) .card-icon { color: rgba(99, 102, 241, 0.9); }
  &:nth-child(2) .card-icon { color: rgba(168, 85, 247, 0.9); }
  &:nth-child(3) .card-icon { color: rgba(59, 130, 246, 0.9); }
  &:nth-child(4) .card-icon { color: rgba(34, 211, 238, 0.9); }
  &:nth-child(5) .card-icon { color: rgba(236, 72, 153, 0.9); }
  &:nth-child(6) .card-icon { color: rgba(16, 185, 129, 0.9); }
}

.magnetic-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
  
  .particle {
    position: absolute;
    width: 4px;
    height: 4px;
    background: rgba(99, 102, 241, 0.6);
    border-radius: 50%;
    left: 50%;
    top: 50%;
    opacity: 0;
    box-shadow: 0 0 6px rgba(99, 102, 241, 0.8);
    animation: particleFloat var(--duration) ease-in-out var(--delay) infinite;
  }
}

@keyframes particleFloat {
  0%, 100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.5);
  }
  50% {
    opacity: 0.8;
    transform: translate(calc(-50% + var(--tx, 50px)), calc(-50% + var(--ty, 30px))) scale(1);
  }
}
</style>
