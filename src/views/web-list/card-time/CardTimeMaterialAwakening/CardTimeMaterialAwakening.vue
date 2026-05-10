<template>
  <div ref="sectionRef" class="card-material-awakening">
    <!-- 动态霓虹网格背景 -->
    <div class="cyber-grid"></div>
    
    <!-- 背景装饰 -->
    <div class="awakening-bg">
      <div ref="glow1Ref" class="bg-glow glow-1"></div>
      <div ref="glow2Ref" class="bg-glow glow-2"></div>
      <div ref="glow3Ref" class="bg-glow glow-3"></div>
      <div class="bg-ring ring-1"></div>
      <div class="bg-ring ring-2"></div>
      <div class="bg-ring ring-3"></div>
    </div>

    <!-- 标题区域 -->
    <div class="awakening-header">
      <div ref="badgeRef" class="awakening-badge">
        <span class="badge-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
          </svg>
        </span>
        <span class="badge-text">MATERIAL AWAKENING</span>
        <span class="badge-dots">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </span>
      </div>
      <h2 ref="titleRef" class="awakening-title">
        <span class="title-line">材质觉醒</span>
        <span class="title-glow"></span>
      </h2>
      <p ref="subtitleRef" class="awakening-subtitle">
        <span class="sub-line">光扫与色彩呼吸</span>
        <span class="sub-divider">·</span>
        <span class="sub-line">材质苏醒的仪式</span>
      </p>
    </div>

    <!-- 卡片画廊 -->
    <div ref="galleryRef" class="awakening-gallery">
      <div
        v-for="(card, i) in awakeningCards"
        :key="'awakening-card-' + i"
        :ref="el => cardRefs.set(i, el as HTMLElement)"
        class="awakening-card"
        :style="{ '--card-hue': card.hue, '--card-index': i }"
      >
        <!-- 外层光环 -->
        <div class="card-aura"></div>
        
        <!-- 脉动边框 -->
        <div class="card-pulse-border"></div>
        
        <!-- 光泽条 -->
        <div :ref="el => shineRefs.set(i, el as HTMLElement)" class="card-shine"></div>
        
        <!-- 玻璃层 -->
        <div class="card-glass">
          <!-- 装饰线条 -->
          <div class="card-decor-line top-left"></div>
          <div class="card-decor-line bottom-right"></div>
          
          <!-- 卡片内容 -->
          <div class="card-content">
            <div class="card-icon-wrap">
              <div class="card-icon-bg"></div>
              <div class="card-icon" v-html="card.icon"></div>
              <div class="card-icon-ring"></div>
            </div>
            
            <h3 class="card-title">{{ card.title }}</h3>
            <p class="card-desc">{{ card.desc }}</p>
            
            <div class="card-divider">
              <span class="divider-dot"></span>
              <span class="divider-line"></span>
              <span class="divider-dot"></span>
            </div>
            
            <div class="card-metric">
              <span class="metric-value">{{ card.value }}</span>
              <span class="metric-label">{{ card.label }}</span>
            </div>
          </div>
          
          <!-- 浮动粒子 -->
          <div class="card-particles">
            <span v-for="n in 6" :key="n" class="micro-particle" :style="{ '--delay': n * 0.5 + 's' }"></span>
          </div>
        </div>
        
        <!-- 底部光效 -->
        <div class="card-bottom-glow"></div>
      </div>
    </div>

    <!-- 底部信息 -->
    <div ref="footerRef" class="awakening-footer">
      <div class="footer-line"></div>
      <span>AWAKENING SEQUENCE · MATERIAL TRANSFORMATION</span>
      <div class="footer-line"></div>
    </div>

    <!-- 粒子效果 -->
    <div ref="particlesRef" class="particles-container"></div>
    
    <!-- 扫描线效果 -->
    <div class="scanline"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []

const sectionRef = ref<HTMLElement | null>(null)
const badgeRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const galleryRef = ref<HTMLElement | null>(null)
const cardRefs = ref(new Map<number, HTMLElement>())
const shineRefs = ref(new Map<number, HTMLElement>())
const glow1Ref = ref<HTMLElement | null>(null)
const glow2Ref = ref<HTMLElement | null>(null)
const glow3Ref = ref<HTMLElement | null>(null)
const particlesRef = ref<HTMLElement | null>(null)

const awakeningCards = [
  {
    title: '暗夜',
    desc: '沉睡中的材质',
    value: '00',
    label: '休眠态',
    hue: 270,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'
  },
  {
    title: '黎明',
    desc: '第一缕光芒',
    value: '01',
    label: '苏醒中',
    hue: 45,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
  },
  {
    title: '正午',
    desc: '完全绽放',
    value: '02',
    label: '觉醒态',
    hue: 50,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="8"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2"/><path d="M12 6l1.5 3 3.5.5-2.5 2.5.5 3.5-3-1.5-3 1.5.5-3.5L7 9.5 10.5 9z"/></svg>'
  },
  {
    title: '黄昏',
    desc: '温柔的过渡',
    value: '03',
    label: '渐变态',
    hue: 20,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 18a5 5 0 0 0-10 0"/><path d="M12 2v7"/><path d="M4.22 10.22l1.42 1.42"/><path d="M1 18h2"/><path d="M21 18h2"/><path d="M18.36 11.64l1.42-1.42"/></svg>'
  },
  {
    title: '极光',
    desc: '色彩呼吸',
    value: '04',
    label: '呼吸态',
    hue: 180,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4h16v16H4z"/><path d="M4 12c4-4 8 4 12 0"/><path d="M4 8c4-4 8 4 12 0"/><path d="M4 16c4-4 8 4 12 0"/></svg>'
  }
]

const createParticles = () => {
  if (!particlesRef.value) return
  const container = particlesRef.value
  
  // 创建大型光点粒子
  for (let i = 0; i < 40; i++) {
    const particle = document.createElement('div')
    particle.className = 'awakening-particle'
    const size = Math.random() * 4 + 2
    const hue = Math.random() * 60 + 240 // 紫色到蓝色范围
    particle.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: radial-gradient(circle, hsla(${hue}, 80%, 60%, 0.8) 0%, transparent 70%);
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      box-shadow: 0 0 ${size * 2}px hsla(${hue}, 80%, 60%, 0.5);
      animation: particleFloat ${Math.random() * 5 + 4}s ease-in-out infinite;
      animation-delay: ${Math.random() * 4}s;
    `
    container.appendChild(particle)
  }
  
  // 创建能量线
  for (let i = 0; i < 8; i++) {
    const line = document.createElement('div')
    line.className = 'energy-line'
    line.style.cssText = `
      position: absolute;
      width: ${Math.random() * 100 + 50}px;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(167, 139, 250, 0.5), transparent);
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: lineFloat ${Math.random() * 8 + 6}s ease-in-out infinite;
      animation-delay: ${Math.random() * 3}s;
    `
    container.appendChild(line)
  }
}

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

  // 徽章入场
  entryTL.fromTo(badgeRef.value,
    { scale: 0, opacity: 0, rotateZ: -180 },
    { scale: 1, opacity: 1, rotateZ: 0, duration: 0.8, ease: 'back.out(1.7)' }
  )
  // 标题入场
  .fromTo(titleRef.value,
    { y: 60, opacity: 0, filter: 'blur(20px)' },
    { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' },
    '-=0.4'
  )
  // 副标题入场
  .fromTo(subtitleRef.value,
    { y: 40, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
    '-=0.3'
  )
  // 底部入场
  .fromTo(footerRef.value,
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
    '-=0.2'
  )

  cleanupFns.push(() => entryTL.kill())

  // 背景光晕动画 - 更复杂的轨迹
  if (glow1Ref.value) {
    gsap.to(glow1Ref.value, {
      x: 150,
      y: 80,
      scale: 1.5,
      rotation: 360,
      duration: 15,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    })
  }
  if (glow2Ref.value) {
    gsap.to(glow2Ref.value, {
      x: -120,
      y: -100,
      scale: 1.3,
      rotation: -180,
      duration: 12,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    })
  }
  if (glow3Ref.value) {
    gsap.to(glow3Ref.value, {
      x: 80,
      y: -60,
      scale: 1.6,
      duration: 18,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    })
  }

  // 环形动画
  const rings = sectionRef.value.querySelectorAll('.bg-ring')
  rings.forEach((ring, i) => {
    gsap.to(ring, {
      rotation: i % 2 === 0 ? 360 : -360,
      duration: 20 + i * 5,
      ease: 'none',
      repeat: -1
    })
  })

  // 标题滚动效果
  if (titleRef.value) {
    const titleST = ScrollTrigger.create({
      trigger: titleRef.value,
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1.5,
      onUpdate: (self) => {
        gsap.set(titleRef.value, {
          y: -50 * self.progress,
          opacity: 1 - self.progress * 2.5,
          scale: 1 - self.progress * 0.2,
          filter: `blur(${self.progress * 10}px)`
        })
      }
    })
    cleanupFns.push(() => titleST.kill())
  }

  // 副标题滚动效果
  if (subtitleRef.value) {
    const subtitleST = ScrollTrigger.create({
      trigger: subtitleRef.value,
      start: 'top 80%',
      end: 'top 25%',
      scrub: 1.5,
      onUpdate: (self) => {
        gsap.set(subtitleRef.value, {
          y: -30 * self.progress,
          opacity: 1 - self.progress * 3,
          rotateX: self.progress * 25
        })
      }
    })
    cleanupFns.push(() => subtitleST.kill())
  }

  // 卡片材质觉醒动画
  setupCardAwakening()
}

const setupCardAwakening = () => {
  nextTick(() => {
    if (!galleryRef.value) return

    const cards = galleryRef.value.querySelectorAll('.awakening-card')
    if (cards.length === 0) return

    // 构建材质觉醒主时间线
    const masterTL = gsap.timeline({
      scrollTrigger: {
        trigger: galleryRef.value,
        start: 'top 75%',
        toggleActions: 'play none none reverse'
      }
    })

    // 为每张卡片创建觉醒动画
    cards.forEach((card, i) => {
      const shine = card.querySelector('.card-shine')
      const aura = card.querySelector('.card-aura')
      
      // 卡片子时间线
      const cardTL = gsap.timeline()

      // 1. 卡片入场：从下方旋转进入
      cardTL.fromTo(card,
        { 
          y: 120, 
          opacity: 0, 
          scale: 0.5,
          rotateY: 90,
          rotateZ: 10,
          filter: 'grayscale(100%) brightness(0.3)'
        },
        { 
          y: 0, 
          opacity: 1, 
          scale: 1,
          rotateY: 0,
          rotateZ: 0,
          filter: 'grayscale(100%) brightness(0.3)',
          duration: 0.8,
          ease: 'back.out(1.2)'
        },
        0
      )

      // 2. 光扫从左到右移动 - 更炫酷的扫光
      if (shine) {
        cardTL.fromTo(shine,
          { left: '-150px', opacity: 0 },
          {
            left: 'calc(100% + 80px)',
            opacity: 1,
            duration: 1.5,
            ease: 'power3.inOut'
          },
          0.4
        )
      }

      // 3. 光环动画
      if (aura) {
        cardTL.fromTo(aura,
          { scale: 0.5, opacity: 0 },
          {
            scale: 1.2,
            opacity: 1,
            duration: 1,
            ease: 'power2.out'
          },
          0.3
        )
      }

      // 4. 颜色觉醒：灰度归零 + 背景变亮
      cardTL.to(card,
        {
          filter: 'grayscale(0%) brightness(1)',
          backgroundColor: 'rgba(20, 20, 35, 0.6)',
          duration: 1.2,
          ease: 'power2.out'
        },
        0.5
      )

      // 添加觉醒 class
      cardTL.add(() => {
        card.classList.add('is-awakened')
      }, 0.6)

      // 5. 底部光效
      const bottomGlow = card.querySelector('.card-bottom-glow')
      if (bottomGlow) {
        cardTL.fromTo(bottomGlow,
          { opacity: 0, scaleX: 0 },
          {
            opacity: 1,
            scaleX: 1,
            duration: 0.6,
            ease: 'power2.out'
          },
          0.7
        )
      }

      // 将卡片动画加入主时间线，错开执行
      masterTL.add(cardTL, i * 0.25)
    })

    // 保存清理函数
    cleanupFns.push(() => masterTL.kill())

    // 卡片悬停效果 - 更炫酷
    cards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          scale: 1.08,
          y: -15,
          duration: 0.4,
          ease: 'power2.out'
        })
        // 光环放大
        const aura = card.querySelector('.card-aura')
        if (aura) {
          gsap.to(aura, {
            scale: 1.4,
            opacity: 0.8,
            duration: 0.4
          })
        }
      })

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          scale: 1,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.5)'
        })
        const aura = card.querySelector('.card-aura')
        if (aura) {
          gsap.to(aura, {
            scale: 1,
            opacity: 0.5,
            duration: 0.5
          })
        }
      })

      card.addEventListener('mousemove', (e: Event) => {
        const mouseEvent = e as MouseEvent
        const rect = card.getBoundingClientRect()
        const x = (mouseEvent.clientX - rect.left) / rect.width - 0.5
        const y = (mouseEvent.clientY - rect.top) / rect.height - 0.5

        gsap.to(card, {
          rotateY: x * 20,
          rotateX: -y * 20,
          duration: 0.3,
          ease: 'power2.out'
        })
      })

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotateY: 0,
          rotateX: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.5)'
        })
      })
    })

    // 滚动驱动的双向动画 - 卡片呼吸效果
    cards.forEach((card, i) => {
      const breatheST = ScrollTrigger.create({
        trigger: galleryRef.value,
        start: 'top 60%',
        end: 'bottom 20%',
        scrub: 2,
        onUpdate: (self) => {
          const breatheScale = 1 + Math.sin(self.progress * Math.PI) * 0.05
          gsap.set(card, {
            scale: breatheScale,
            filter: `grayscale(${Math.max(0, (1 - self.progress) * 50)}%) brightness(${0.6 + self.progress * 0.4})`
          })
        }
      })
      cleanupFns.push(() => breatheST.kill())
    })
  })
}

onMounted(() => {
  // 延迟初始化以确保懒加载时 DOM 已完全渲染
  createParticles()
  setTimeout(initAnimations, 100)
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(st => {
    if (st.vars.trigger && sectionRef.value?.contains(st.vars.trigger as Element)) {
      st.kill()
    }
  })
})
</script>

<style scoped lang="scss">
@use 'sass:math';

.card-material-awakening {
  position: relative;
  width: 100vw;
  min-height: 100vh;
  background: linear-gradient(180deg, #050510 0%, #0a0a1a 30%, #0f0f25 50%, #0a0a18 70%, #050512 100%);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

// 赛博朋克网格背景
.cyber-grid {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(139, 92, 246, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(139, 92, 246, 0.03) 1px, transparent 1px);
  background-size: 60px 60px;
  animation: gridMove 20s linear infinite;
  pointer-events: none;
}

@keyframes gridMove {
  0% { transform: perspective(500px) rotateX(60deg) translateY(0); }
  100% { transform: perspective(500px) rotateX(60deg) translateY(60px); }
}

// 扫描线效果
.scanline {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, transparent, rgba(167, 139, 250, 0.3), transparent);
  animation: scanMove 4s ease-in-out infinite;
  pointer-events: none;
  z-index: 100;
}

@keyframes scanMove {
  0%, 100% { top: -4px; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}

// 背景装饰
.awakening-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.bg-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.5;
}

.glow-1 {
  width: 600px;
  height: 600px;
  top: -200px;
  left: -150px;
  background: radial-gradient(circle, hsla(270, 70%, 50%, 0.6) 0%, transparent 70%);
}

.glow-2 {
  width: 500px;
  height: 500px;
  bottom: -150px;
  right: -100px;
  background: radial-gradient(circle, hsla(45, 80%, 50%, 0.5) 0%, transparent 70%);
}

.glow-3 {
  width: 450px;
  height: 450px;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, hsla(180, 60%, 40%, 0.4) 0%, transparent 70%);
}

// 背景环形装饰
.bg-ring {
  position: absolute;
  border: 1px solid rgba(139, 92, 246, 0.1);
  border-radius: 50%;
  pointer-events: none;
}

.ring-1 {
  width: 800px;
  height: 800px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.ring-2 {
  width: 600px;
  height: 600px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-color: rgba(167, 139, 250, 0.08);
}

.ring-3 {
  width: 1000px;
  height: 1000px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-color: rgba(139, 92, 246, 0.05);
}

// 粒子效果
.particles-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

@keyframes particleFloat {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.4;
  }
  50% {
    transform: translateY(-50px) scale(1.8);
    opacity: 1;
  }
}

@keyframes lineFloat {
  0%, 100% {
    transform: translateX(-50px) rotate(0deg);
    opacity: 0;
  }
  50% {
    transform: translateX(50px) rotate(10deg);
    opacity: 0.6;
  }
}

// 标题区域
.awakening-header {
  position: relative;
  z-index: 10;
  text-align: center;
  margin-bottom: 60px;
}

.awakening-badge {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 12px 32px;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(99, 102, 241, 0.1) 100%);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 40px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 11px;
  letter-spacing: 4px;
  font-weight: 600;
  margin-bottom: 24px;
  backdrop-filter: blur(20px);
  box-shadow: 
    0 0 30px rgba(139, 92, 246, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);

  .badge-icon {
    width: 18px;
    height: 18px;
    color: #fbbf24;
    animation: badgePulse 2s ease-in-out infinite;
    filter: drop-shadow(0 0 8px rgba(251, 191, 36, 0.6));

    svg {
      width: 100%;
      height: 100%;
    }
  }

  .badge-dots {
    display: flex;
    gap: 4px;
    
    .dot {
      width: 4px;
      height: 4px;
      background: #8b5cf6;
      border-radius: 50%;
      animation: dotPulse 1.5s ease-in-out infinite;
      
      &:nth-child(2) { animation-delay: 0.2s; }
      &:nth-child(3) { animation-delay: 0.4s; }
    }
  }
}

@keyframes badgePulse {
  0%, 100% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.2) rotate(180deg); }
}

@keyframes dotPulse {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.5); }
}

.awakening-title {
  font-family: 'Orbitron', 'Rajdhani', sans-serif;
  font-size: 56px;
  font-weight: 900;
  letter-spacing: 12px;
  margin-bottom: 20px;
  position: relative;
  display: inline-block;

  .title-line {
    background: linear-gradient(135deg, #fff 0%, #c4b5fd 30%, #a78bfa 60%, #818cf8 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    position: relative;
    z-index: 1;
  }

  .title-glow {
    position: absolute;
    inset: -20px;
    background: linear-gradient(135deg, rgba(167, 139, 250, 0.3) 0%, transparent 50%);
    filter: blur(30px);
    z-index: 0;
    animation: titleGlowPulse 3s ease-in-out infinite;
  }
}

@keyframes titleGlowPulse {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.1); }
}

.awakening-subtitle {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;

  .sub-line {
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .sub-divider {
    color: rgba(139, 92, 246, 0.6);
    animation: dividerPulse 2s ease-in-out infinite;
  }
}

@keyframes dividerPulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}

// 卡片画廊
.awakening-gallery {
  position: relative;
  z-index: 10;
  display: flex;
  flex-wrap: wrap;
  gap: 35px;
  justify-content: center;
  padding: 30px 0;
  max-width: 1300px;
}

// 觉醒卡片
.awakening-card {
  position: relative;
  width: 220px;
  height: 300px;
  border-radius: 24px;
  cursor: pointer;
  transform-style: preserve-3d;
  perspective: 1200px;
  filter: grayscale(100%) brightness(0.3);
  
  // 光环效果
  .card-aura {
    position: absolute;
    inset: -30px;
    border-radius: 40px;
    background: radial-gradient(ellipse at center, 
      hsla(var(--card-hue), 70%, 50%, 0.4) 0%, 
      hsla(var(--card-hue), 60%, 40%, 0.2) 40%,
      transparent 70%
    );
    opacity: 0;
    filter: blur(20px);
    transition: opacity 0.5s;
    pointer-events: none;
    z-index: -1;
  }
  
  // 脉动边框
  .card-pulse-border {
    position: absolute;
    inset: -2px;
    border-radius: 26px;
    background: linear-gradient(135deg, 
      hsla(var(--card-hue), 70%, 60%, 0.8) 0%, 
      hsla(calc(var(--card-hue) + 60), 70%, 60%, 0.6) 50%,
      hsla(var(--card-hue), 70%, 60%, 0.8) 100%
    );
    opacity: 0;
    z-index: -1;
    animation: borderPulse 2s ease-in-out infinite;
  }
  
  @keyframes borderPulse {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.7; }
  }

  // 玻璃层
  .card-glass {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 24px;
    background: linear-gradient(135deg, 
      rgba(30, 30, 50, 0.8) 0%, 
      rgba(20, 20, 35, 0.9) 100%
    );
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    overflow: hidden;
    box-shadow: 
      0 25px 50px rgba(0, 0, 0, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);

    // 装饰线条
    .card-decor-line {
      position: absolute;
      width: 40px;
      height: 40px;
      opacity: 0.3;
      
      &.top-left {
        top: 12px;
        left: 12px;
        border-top: 2px solid hsla(var(--card-hue), 70%, 60%, 0.8);
        border-left: 2px solid hsla(var(--card-hue), 70%, 60%, 0.8);
      }
      
      &.bottom-right {
        bottom: 12px;
        right: 12px;
        border-bottom: 2px solid hsla(var(--card-hue), 70%, 60%, 0.8);
        border-right: 2px solid hsla(var(--card-hue), 70%, 60%, 0.8);
      }
    }
  }

  // 觉醒状态
  &.is-awakened {
    filter: grayscale(0%) brightness(1);
    
    .card-aura {
      opacity: 0.6;
      animation: auraGlow 3s ease-in-out infinite;
    }
    
    .card-pulse-border {
      opacity: 1;
    }
    
    .card-glass {
      background: linear-gradient(135deg, 
        rgba(25, 25, 45, 0.9) 0%, 
        rgba(15, 15, 30, 0.95) 100%
      );
      border-color: rgba(255, 255, 255, 0.15);
    }
  }
  
  @keyframes auraGlow {
    0%, 100% { opacity: 0.5; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.05); }
  }

  // 光泽条
  .card-shine {
    position: absolute;
    top: 0;
    left: -150px;
    width: 100px;
    height: 100%;
    background: linear-gradient(
      105deg,
      transparent 0%,
      rgba(255, 255, 255, 0.1) 30%,
      rgba(255, 255, 255, 0.4) 50%,
      rgba(255, 255, 255, 0.1) 70%,
      transparent 100%
    );
    transform: skewX(-15deg);
    pointer-events: none;
    z-index: 10;
    filter: blur(2px);
  }

  // 卡片内容
  .card-content {
    position: relative;
    z-index: 5;
    padding: 30px 24px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .card-icon-wrap {
    position: relative;
    width: 70px;
    height: 70px;
    margin-bottom: 24px;
    
    .card-icon-bg {
      position: absolute;
      inset: 0;
      border-radius: 18px;
      background: linear-gradient(135deg, 
        hsla(var(--card-hue), 60%, 50%, 0.2) 0%, 
        hsla(var(--card-hue), 50%, 30%, 0.1) 100%
      );
      border: 1px solid hsla(var(--card-hue), 60%, 50%, 0.3);
      animation: iconBgPulse 3s ease-in-out infinite;
    }
    
    @keyframes iconBgPulse {
      0%, 100% { transform: scale(1); opacity: 0.8; }
      50% { transform: scale(1.05); opacity: 1; }
    }
    
    .card-icon {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: hsla(var(--card-hue), 70%, 60%, 1);
      filter: drop-shadow(0 0 10px hsla(var(--card-hue), 70%, 60%, 0.5));
      transition: transform 0.4s, filter 0.4s;
      
      :deep(svg) {
        width: 36px;
        height: 36px;
      }
    }
    
    .card-icon-ring {
      position: absolute;
      inset: -8px;
      border-radius: 24px;
      border: 1px dashed hsla(var(--card-hue), 60%, 50%, 0.3);
      animation: ringRotate 10s linear infinite;
    }
    
    @keyframes ringRotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  }

  .card-title {
    font-size: 24px;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.95);
    margin-bottom: 10px;
    letter-spacing: 4px;
    text-shadow: 0 0 20px hsla(var(--card-hue), 70%, 50%, 0.5);
    transition: text-shadow 0.4s;
  }

  .card-desc {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.5);
    line-height: 1.6;
    margin-bottom: 20px;
    letter-spacing: 1px;
  }

  .card-divider {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 20px;
    
    .divider-line {
      width: 30px;
      height: 1px;
      background: linear-gradient(90deg, transparent, hsla(var(--card-hue), 60%, 50%, 0.5), transparent);
    }
    
    .divider-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: hsla(var(--card-hue), 70%, 60%, 0.8);
      box-shadow: 0 0 10px hsla(var(--card-hue), 70%, 60%, 0.5);
    }
  }

  .card-metric {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 18px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);

    .metric-value {
      font-family: 'Orbitron', 'Orbitron', monospace;
      font-size: 32px;
      font-weight: 700;
      color: hsla(var(--card-hue), 70%, 65%, 1);
      text-shadow: 0 0 20px hsla(var(--card-hue), 70%, 60%, 0.6);
      letter-spacing: 4px;
    }

    .metric-label {
      font-size: 11px;
      color: rgba(255, 255, 255, 0.4);
      letter-spacing: 3px;
      margin-top: 8px;
      text-transform: uppercase;
    }
  }

  // 浮动粒子
  .card-particles {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
    
    .micro-particle {
      position: absolute;
      width: 3px;
      height: 3px;
      background: hsla(var(--card-hue), 70%, 60%, 0.6);
      border-radius: 50%;
      box-shadow: 0 0 6px hsla(var(--card-hue), 70%, 60%, 0.4);
      animation: microFloat 4s ease-in-out infinite;
      animation-delay: var(--delay);
      
      &:nth-child(1) { left: 10%; top: 20%; }
      &:nth-child(2) { left: 80%; top: 30%; animation-delay: calc(var(--delay) + 0.5s); }
      &:nth-child(3) { left: 20%; top: 70%; animation-delay: calc(var(--delay) + 1s); }
      &:nth-child(4) { left: 70%; top: 80%; animation-delay: calc(var(--delay) + 1.5s); }
      &:nth-child(5) { left: 50%; top: 10%; animation-delay: calc(var(--delay) + 2s); }
      &:nth-child(6) { left: 30%; top: 50%; animation-delay: calc(var(--delay) + 2.5s); }
    }
  }
  
  @keyframes microFloat {
    0%, 100% { 
      transform: translateY(0) scale(1); 
      opacity: 0.3; 
    }
    50% { 
      transform: translateY(-20px) scale(1.5); 
      opacity: 0.8; 
    }
  }

  // 底部光效
  .card-bottom-glow {
    position: absolute;
    bottom: -2px;
    left: 10%;
    right: 10%;
    height: 60px;
    background: linear-gradient(to top, 
      hsla(var(--card-hue), 60%, 50%, 0.3) 0%, 
      transparent 100%
    );
    filter: blur(15px);
    opacity: 0;
    pointer-events: none;
  }

  // 悬停效果
  &:hover {
    .card-icon {
      transform: scale(1.15) rotate(8deg);
      filter: drop-shadow(0 0 20px hsla(var(--card-hue), 70%, 60%, 0.8));
    }
    
    .card-title {
      text-shadow: 0 0 30px hsla(var(--card-hue), 70%, 60%, 0.8);
    }
    
    .card-glass {
      border-color: rgba(255, 255, 255, 0.2);
      box-shadow: 
        0 30px 60px rgba(0, 0, 0, 0.6),
        0 0 40px hsla(var(--card-hue), 60%, 50%, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.15);
    }
    
    .card-icon-ring {
      animation-duration: 3s;
    }
  }
}

// 底部信息
.awakening-footer {
  position: relative;
  z-index: 10;
  margin-top: 50px;
  display: flex;
  align-items: center;
  gap: 20px;

  .footer-line {
    width: 60px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.4), transparent);
  }

  span {
    font-size: 10px;
    letter-spacing: 5px;
    color: rgba(255, 255, 255, 0.25);
  }
}

// 响应式
@media (max-width: 1024px) {
  .awakening-gallery {
    gap: 25px;
  }

  .awakening-card {
    width: 200px;
    height: 280px;
  }
}

@media (max-width: 768px) {
  .awakening-title {
    font-size: 40px;
    letter-spacing: 6px;
  }

  .awakening-subtitle {
    font-size: 12px;
    letter-spacing: 4px;
    flex-direction: column;
    gap: 8px;
    
    .sub-divider { display: none; }
  }

  .awakening-gallery {
    gap: 20px;
  }

  .awakening-card {
    width: 170px;
    height: 250px;
  }
  
  .awakening-footer {
    flex-direction: column;
    gap: 10px;
  }
}

@media (max-width: 480px) {
  .awakening-card {
    width: 150px;
    height: 220px;
  }
  
  .awakening-title {
    font-size: 32px;
    letter-spacing: 4px;
  }
}
</style>
