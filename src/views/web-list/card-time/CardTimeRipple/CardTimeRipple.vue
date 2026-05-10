<template>
  <div ref="sectionRef" class="card-ripple-section">
    <!-- 背景粒子层 -->
    <div ref="bgParticlesRef" class="bg-particles"></div>
    
    <!-- 水波纹背景 -->
    <div class="ripple-bg">
      <div class="wave wave-1"></div>
      <div class="wave wave-2"></div>
      <div class="wave wave-3"></div>
    </div>
    
    <!-- 标题区域 -->
    <div ref="headerRef" class="ripple-header">
      <div ref="badgeRef" class="header-badge">
        <span class="badge-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"/>
            <circle cx="12" cy="12" r="6"/>
            <circle cx="12" cy="12" r="2"/>
          </svg>
        </span>
        <span class="badge-text">ELEMENTAL RIPPLE</span>
      </div>
      <h2 ref="titleRef" class="header-title">水波扩散</h2>
      <p ref="subtitleRef" class="header-subtitle">涟漪驱动 · 触感材质</p>
    </div>
    
    <!-- 卡片涟漪场 -->
    <div ref="rippleFieldRef" class="ripple-field">
      <div
        v-for="(card, i) in elementCards"
        :key="'element-card-' + i"
        :ref="el => cardRefs.set(i, el as HTMLElement)"
        class="ripple-card"
        :style="{ '--card-hue': card.hue, '--card-index': i }"
        :data-element="card.element"
      >
        <!-- 卡片涟漪效果 -->
        <div class="card-ripple-effect"></div>
        
        <!-- 卡片光晕 -->
        <div class="card-glow"></div>
        
        <!-- 卡片内容 -->
        <div class="card-inner">
          <div class="card-icon-container">
            <div class="card-icon-ring"></div>
            <div class="card-icon" v-html="card.icon"></div>
          </div>
          
          <div class="card-text">
            <h3 class="card-title">{{ card.title }}</h3>
            <p class="card-subtitle">{{ card.subtitle }}</p>
          </div>
          
          <div class="card-energy">
            <div class="energy-bar"></div>
            <span class="energy-value">{{ card.energy }}</span>
          </div>
        </div>
        
        <!-- 卡片边框 -->
        <div class="card-border"></div>
      </div>
    </div>
    
    <!-- 底部提示 -->
    <div ref="footerRef" class="ripple-footer">
      <span>移动鼠标触发涟漪 · 点击感受触感反馈</span>
    </div>
    
    <!-- 鼠标追踪涟漪 -->
    <div ref="cursorRippleRef" class="cursor-ripple"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []

// DOM refs
const sectionRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const badgeRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const rippleFieldRef = ref<HTMLElement | null>(null)
const cardRefs = ref(new Map<number, HTMLElement>())
const bgParticlesRef = ref<HTMLElement | null>(null)
const cursorRippleRef = ref<HTMLElement | null>(null)

// 数据
const elementCards = [
  {
    element: 'water',
    title: '水',
    subtitle: '至柔至刚',
    energy: '∞',
    hue: 200,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>'
  },
  {
    element: 'fire',
    title: '火',
    subtitle: '燃烧不息',
    energy: '100%',
    hue: 15,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22c4-2 8-6 8-12 0-3-2-5-4-6 0 2-1 3-2 3-2 0-4-2-4-5 0 3-2 5-2 5-3 1-4 3-4 6 0 6 4 10 8 12z"/></svg>'
  },
  {
    element: 'wind',
    title: '风',
    subtitle: '无形之力',
    energy: '∞',
    hue: 160,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/></svg>'
  },
  {
    element: 'earth',
    title: '土',
    subtitle: '厚重沉稳',
    energy: '85%',
    hue: 35,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22V8M5 12H2a10 10 0 0 0 20 0h-3M7 22l5-5 5 5"/></svg>'
  },
  {
    element: 'light',
    title: '光',
    subtitle: '照亮一切',
    energy: 'MAX',
    hue: 50,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
  },
  {
    element: 'dark',
    title: '暗',
    subtitle: '深渊凝视',
    energy: '∞',
    hue: 270,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'
  }
]

// 涟漪动画状态
let mouseX = -1000
let mouseY = -1000
let isMouseActive = false
let rippleRAF: number | null = null

// 创建背景粒子
const createBgParticles = () => {
  if (!bgParticlesRef.value) return
  const container = bgParticlesRef.value
  
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div')
    particle.className = 'bg-particle'
    const size = Math.random() * 3 + 1
    const hue = Math.random() * 360
    particle.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: hsla(${hue}, 70%, 60%, ${Math.random() * 0.5 + 0.3});
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      box-shadow: 0 0 ${size * 3}px hsla(${hue}, 70%, 60%, 0.4);
      animation: particleFloat ${Math.random() * 8 + 6}s ease-in-out infinite;
      animation-delay: ${Math.random() * 5}s;
    `
    container.appendChild(particle)
  }
}

// 涟漪更新函数
const rippleUpdate = () => {
  if (!isMouseActive || !rippleFieldRef.value) return
  
  const fieldWidth = rippleFieldRef.value.clientWidth
  const fieldHeight = rippleFieldRef.value.clientHeight
  const maxDistance = Math.hypot(fieldWidth, fieldHeight) / 2
  
  cardRefs.value.forEach((card) => {
    if (!card) return
    
    const cardRect = card.getBoundingClientRect()
    const fieldRect = rippleFieldRef.value!.getBoundingClientRect()
    const cardCenterX = cardRect.left + cardRect.width / 2 - fieldRect.left
    const cardCenterY = cardRect.top + cardRect.height / 2 - fieldRect.top
    
    const dx = mouseX - cardCenterX
    const dy = mouseY - cardCenterY
    const distance = Math.hypot(dx, dy)
    
    // 映射：距离越近，上浮越高、放大越明显
    const proximity = 1 - Math.min(distance / maxDistance, 1)
    const lift = proximity * 30
    const scale = 1 + proximity * 0.1
    // 延迟：近的先动，远的后动，制造涟漪扩散感
    const delay = proximity * 0.12
    
    gsap.to(card, {
      y: -lift,
      scale: scale,
      duration: 0.4 + proximity * 0.3,
      delay: delay,
      ease: 'power2.out',
      overwrite: 'auto'
    })
  })
  
  rippleRAF = requestAnimationFrame(rippleUpdate)
}

// 鼠标移动处理
const handleMouseMove = (e: MouseEvent) => {
  if (!rippleFieldRef.value) return
  
  const rect = rippleFieldRef.value.getBoundingClientRect()
  mouseX = e.clientX - rect.left
  mouseY = e.clientY - rect.top
  
  // 更新鼠标涟漪效果
  if (cursorRippleRef.value) {
    gsap.to(cursorRippleRef.value, {
      x: mouseX,
      y: mouseY,
      duration: 0.1
    })
  }
  
  if (!isMouseActive) {
    isMouseActive = true
    rippleUpdate()
  }
}

// 鼠标离开处理
const handleMouseLeave = () => {
  isMouseActive = false
  if (rippleRAF) {
    cancelAnimationFrame(rippleRAF)
    rippleRAF = null
  }
  
  // 所有卡片缓动回原位
  cardRefs.value.forEach((card) => {
    if (card) {
      gsap.to(card, {
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: 'elastic.out(1, 0.4)'
      })
    }
  })
}

// 点击强化效果
const handleCardClick = (e: MouseEvent) => {
  const targetCard = (e.target as HTMLElement).closest('.ripple-card')
  if (!targetCard) return
  
  // 按下去
  gsap.to(targetCard, {
    y: 10,
    scale: 0.94,
    duration: 0.2,
    ease: 'power2.in',
    onComplete: () => {
      // 强力弹回
      gsap.to(targetCard, {
        y: -15,
        scale: 1.08,
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)',
        onComplete: () => {
          gsap.to(targetCard, { y: 0, scale: 1, duration: 0.4, ease: 'power3.out' })
        }
      })
    }
  })
  
  // 创建点击涟漪
  createClickRipple(e)
}

// 点击涟漪效果
const createClickRipple = (e: MouseEvent) => {
  if (!rippleFieldRef.value) return
  
  const rect = rippleFieldRef.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  
  const ripple = document.createElement('div')
  ripple.className = 'click-ripple'
  ripple.style.cssText = `
    position: absolute;
    left: ${x}px;
    top: ${y}px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%);
    pointer-events: none;
    transform: translate(-50%, -50%);
  `
  rippleFieldRef.value.appendChild(ripple)
  
  gsap.to(ripple, {
    scale: 15,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out',
    onComplete: () => ripple.remove()
  })
}

// 初始化动画
const initAnimations = () => {
  if (!sectionRef.value) return
  
  // 入场动画时间线
  const entryTL = gsap.timeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 80%',
      toggleActions: 'play none none none'
    }
  })
  
  // 标题入场
  entryTL.fromTo(badgeRef.value,
    { y: -30, opacity: 0, scale: 0.8 },
    { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }
  )
  .fromTo(titleRef.value,
    { y: 50, opacity: 0, filter: 'blur(15px)' },
    { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out' },
    '-=0.3'
  )
  .fromTo(subtitleRef.value,
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
    '-=0.4'
  )
  .fromTo(footerRef.value,
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
    '-=0.2'
  )
  
  cleanupFns.push(() => entryTL.kill())
  
  // 卡片入场动画
  setupCardEntry()
  
  // 滚动效果
  setupScrollEffects()
}

// 卡片入场动画
const setupCardEntry = () => {
  nextTick(() => {
    if (!rippleFieldRef.value) return
    
    const cards = rippleFieldRef.value.querySelectorAll('.ripple-card')
    if (cards.length === 0) return
    
    const entryTL = gsap.timeline({
      scrollTrigger: {
        trigger: rippleFieldRef.value,
        start: 'top 75%',
        toggleActions: 'play none none reverse'
      }
    })
    
    cards.forEach((card, i) => {
      entryTL.fromTo(card,
        { 
          y: 100, 
          opacity: 0, 
          scale: 0.7,
          rotateY: 45,
          filter: 'brightness(0.3)'
        },
        { 
          y: 0, 
          opacity: 1, 
          scale: 1,
          rotateY: 0,
          filter: 'brightness(1)',
          duration: 0.8, 
          ease: 'back.out(1.2)'
        },
        i * 0.1
      )
    })
    
    cleanupFns.push(() => entryTL.kill())
  })
}

// 滚动效果
const setupScrollEffects = () => {
  // 标题滚动淡出
  if (titleRef.value) {
    const titleST = ScrollTrigger.create({
      trigger: titleRef.value,
      start: 'top 80%',
      end: 'top 30%',
      scrub: 1.5,
      onUpdate: (self) => {
        gsap.set(titleRef.value, {
          y: -50 * self.progress,
          opacity: 1 - self.progress * 2,
          scale: 1 - self.progress * 0.1,
          filter: `blur(${self.progress * 8}px)`
        })
      }
    })
    cleanupFns.push(() => titleST.kill())
  }
  
  // 卡片呼吸效果
  nextTick(() => {
    if (!rippleFieldRef.value) return
    
    const cards = rippleFieldRef.value.querySelectorAll('.ripple-card')
    cards.forEach((card, i) => {
      const breatheST = ScrollTrigger.create({
        trigger: rippleFieldRef.value,
        start: 'top 60%',
        end: 'bottom 40%',
        scrub: 2,
        onUpdate: (self) => {
          const breatheScale = 1 + Math.sin(self.progress * Math.PI * 2 + i * 0.5) * 0.03
          const hueShift = Math.sin(self.progress * Math.PI + i * 0.3) * 20
          gsap.set(card, {
            scale: breatheScale,
            filter: `brightness(${0.85 + self.progress * 0.15}) hue-rotate(${hueShift}deg)`
          })
        }
      })
      cleanupFns.push(() => breatheST.kill())
    })
  })
}

// 绑定事件
const bindEvents = () => {
  if (rippleFieldRef.value) {
    rippleFieldRef.value.addEventListener('mousemove', handleMouseMove)
    rippleFieldRef.value.addEventListener('mouseleave', handleMouseLeave)
    rippleFieldRef.value.addEventListener('click', handleCardClick)
  }
}

// 卸载事件
const unbindEvents = () => {
  if (rippleFieldRef.value) {
    rippleFieldRef.value.removeEventListener('mousemove', handleMouseMove)
    rippleFieldRef.value.removeEventListener('mouseleave', handleMouseLeave)
    rippleFieldRef.value.removeEventListener('click', handleCardClick)
  }
}

onMounted(() => {
  createBgParticles()
  initAnimations()
  bindEvents()
})

onUnmounted(() => {
  // 清理动画
  cleanupFns.forEach(fn => fn())
  
  // 清理 ScrollTrigger
  ScrollTrigger.getAll().forEach(st => {
    if (st.vars.trigger && sectionRef.value?.contains(st.vars.trigger as Element)) {
      st.kill()
    }
  })
  
  // 取消 RAF
  if (rippleRAF) {
    cancelAnimationFrame(rippleRAF)
  }
  
  // 移除事件
  unbindEvents()
})
</script>

<style scoped lang="scss">
.card-ripple-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(180deg, #0a0a1a 0%, #111827 50%, #0f172a 100%);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

// 背景粒子
.bg-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

@keyframes particleFloat {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.4;
  }
  50% {
    transform: translateY(-40px) scale(1.5);
    opacity: 0.8;
  }
}

// 水波背景
.ripple-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.wave {
  position: absolute;
  width: 200%;
  height: 200%;
  border-radius: 40%;
  opacity: 0.03;
  animation: waveRotate 30s linear infinite;
  
  &.wave-1 {
    top: -50%;
    left: -50%;
    background: radial-gradient(ellipse at center, hsla(200, 70%, 50%, 0.3) 0%, transparent 70%);
    animation-duration: 25s;
  }
  
  &.wave-2 {
    top: -60%;
    left: -60%;
    background: radial-gradient(ellipse at center, hsla(160, 70%, 50%, 0.2) 0%, transparent 70%);
    animation-duration: 35s;
    animation-direction: reverse;
  }
  
  &.wave-3 {
    top: -40%;
    left: -40%;
    background: radial-gradient(ellipse at center, hsla(50, 70%, 50%, 0.15) 0%, transparent 70%);
    animation-duration: 40s;
  }
}

@keyframes waveRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

// 鼠标涟漪追踪
.cursor-ripple {
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  pointer-events: none;
  opacity: 0;
  transform: translate(-50%, -50%);
  
  &::before {
    content: '';
    position: absolute;
    inset: 10px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.15);
  }
}

// 标题区域
.ripple-header {
  position: relative;
  z-index: 10;
  text-align: center;
  margin-bottom: 50px;
}

.header-badge {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 10px 28px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 30px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 11px;
  letter-spacing: 4px;
  font-weight: 600;
  margin-bottom: 20px;
  backdrop-filter: blur(15px);

  .badge-icon {
    width: 16px;
    height: 16px;
    color: #818cf8;
    animation: badgePulse 2s ease-in-out infinite;

    svg {
      width: 100%;
      height: 100%;
    }
  }
}

@keyframes badgePulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}

.header-title {
  font-family: 'Orbitron', 'Rajdhani', sans-serif;
  font-size: 48px;
  font-weight: 900;
  letter-spacing: 10px;
  margin-bottom: 14px;
  background: linear-gradient(135deg, #fff 0%, #a5b4fc 35%, #818cf8 65%, #c4b5fd 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 30px rgba(129, 140, 248, 0.4));
}

.header-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.45);
  letter-spacing: 6px;
}

// 卡片涟漪场
.ripple-field {
  position: relative;
  z-index: 10;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
  padding: 30px;
  perspective: 1000px;
}

// 涟漪卡片
.ripple-card {
  position: relative;
  width: 160px;
  height: 200px;
  border-radius: 24px;
  cursor: pointer;
  transform-style: preserve-3d;
  will-change: transform;
  
  // 涟漪效果层
  .card-ripple-effect {
    position: absolute;
    inset: 0;
    border-radius: 24px;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      inset: -50%;
      background: conic-gradient(
        from 0deg,
        transparent 0deg,
        hsla(var(--card-hue), 70%, 60%, 0.3) 60deg,
        transparent 120deg
      );
      animation: rippleRotate 4s linear infinite;
      opacity: 0;
      transition: opacity 0.4s;
    }
  }
  
  @keyframes rippleRotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  // 光晕
  .card-glow {
    position: absolute;
    inset: -20px;
    border-radius: 40px;
    background: radial-gradient(ellipse at center,
      hsla(var(--card-hue), 70%, 55%, 0.4) 0%,
      hsla(var(--card-hue), 60%, 45%, 0.2) 40%,
      transparent 70%
    );
    filter: blur(25px);
    opacity: 0;
    transition: opacity 0.5s;
    pointer-events: none;
  }
  
  // 内部内容
  .card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 24px;
    background: linear-gradient(145deg, 
      rgba(30, 41, 59, 0.95) 0%, 
      rgba(15, 23, 42, 0.98) 100%
    );
    border: 1px solid rgba(148, 163, 184, 0.15);
    backdrop-filter: blur(20px);
    box-shadow: 
      0 25px 50px rgba(0, 0, 0, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px;
    transition: box-shadow 0.3s, border-color 0.3s;
  }
  
  // 边框
  .card-border {
    position: absolute;
    inset: 0;
    border-radius: 24px;
    border: 2px solid transparent;
    background: linear-gradient(135deg, 
      hsla(var(--card-hue), 70%, 60%, 0.6) 0%, 
      hsla(calc(var(--card-hue) + 40), 70%, 60%, 0.4) 50%,
      hsla(var(--card-hue), 70%, 60%, 0.6) 100%
    ) border-box;
    -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.4s;
  }
  
  // 图标容器
  .card-icon-container {
    position: relative;
    width: 64px;
    height: 64px;
    margin-bottom: 18px;
    
    .card-icon-ring {
      position: absolute;
      inset: -8px;
      border-radius: 50%;
      border: 1px dashed hsla(var(--card-hue), 60%, 50%, 0.4);
      animation: ringRotate 8s linear infinite;
    }
    
    @keyframes ringRotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    .card-icon {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: hsla(var(--card-hue), 70%, 60%, 1);
      filter: drop-shadow(0 0 12px hsla(var(--card-hue), 70%, 60%, 0.6));
      transition: transform 0.4s, filter 0.4s;
      
      :deep(svg) {
        width: 32px;
        height: 32px;
      }
    }
  }
  
  // 文本
  .card-text {
    text-align: center;
    margin-bottom: 16px;
    
    .card-title {
      font-size: 26px;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.95);
      letter-spacing: 6px;
      margin-bottom: 6px;
      text-shadow: 0 0 20px hsla(var(--card-hue), 70%, 60%, 0.5);
    }
    
    .card-subtitle {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.45);
      letter-spacing: 2px;
    }
  }
  
  // 能量条
  .card-energy {
    display: flex;
    align-items: center;
    gap: 8px;
    padding-top: 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    
    .energy-bar {
      width: 40px;
      height: 3px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 2px;
      overflow: hidden;
      
      &::after {
        content: '';
        display: block;
        width: 70%;
        height: 100%;
        background: linear-gradient(90deg, hsla(var(--card-hue), 70%, 60%, 0.8), hsla(var(--card-hue), 70%, 70%, 1));
        border-radius: 2px;
      }
    }
    
    .energy-value {
      font-family: 'Orbitron', monospace;
      font-size: 11px;
      color: hsla(var(--card-hue), 70%, 65%, 1);
      letter-spacing: 1px;
    }
  }
  
  // 悬停状态
  &:hover {
    .card-glow {
      opacity: 1;
    }
    
    .card-border {
      opacity: 1;
    }
    
    .card-inner {
      border-color: rgba(148, 163, 184, 0.3);
      box-shadow: 
        0 30px 60px rgba(0, 0, 0, 0.6),
        0 0 50px hsla(var(--card-hue), 60%, 50%, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.12);
    }
    
    .card-icon {
      transform: scale(1.15) rotate(10deg);
      filter: drop-shadow(0 0 25px hsla(var(--card-hue), 70%, 60%, 0.9));
    }
    
    .card-ripple-effect::before {
      opacity: 1;
    }
    
    .card-icon-ring {
      animation-duration: 3s;
    }
  }
}

// 底部提示
.ripple-footer {
  position: relative;
  z-index: 10;
  margin-top: 40px;
  
  span {
    font-size: 11px;
    letter-spacing: 3px;
    color: rgba(255, 255, 255, 0.25);
  }
}

// 点击涟漪
:global(.click-ripple) {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, transparent 70%);
  pointer-events: none;
}

// 响应式
@media (max-width: 768px) {
  .ripple-field {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    padding: 20px;
  }
  
  .ripple-card {
    width: 140px;
    height: 180px;
  }
  
  .header-title {
    font-size: 36px;
    letter-spacing: 6px;
  }
  
  .header-subtitle {
    font-size: 12px;
    letter-spacing: 4px;
  }
}

@media (max-width: 480px) {
  .ripple-field {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  
  .ripple-card {
    width: 120px;
    height: 160px;
  }
  
  .card-icon-container {
    width: 48px !important;
    height: 48px !important;
    
    :deep(svg) {
      width: 24px !important;
      height: 24px !important;
    }
  }
  
  .card-title {
    font-size: 20px !important;
  }
}
</style>
