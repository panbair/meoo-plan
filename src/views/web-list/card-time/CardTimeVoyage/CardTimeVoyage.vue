<template>
  <section ref="sectionRef" class="voyage-section">
    <!-- 奢华光晕背景 -->
    <div class="voyage-bg">
      <div class="bg-gradient"></div>
      <div class="bg-particles"></div>
      <div class="ambient-light"></div>
    </div>

    <!-- 主容器 -->
    <div class="voyage-container">
      <!-- 顶部标题区 -->
      <div ref="headerRef" class="voyage-header">
        <div ref="badgeRef" class="header-badge">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
          </svg>
          <span>VOYAGE</span>
        </div>
        <h2 ref="titleRef" class="voyage-title">奢华之旅</h2>
        <p ref="subtitleRef" class="voyage-subtitle">穿越时空的精致旅程 · 每一刻都是永恒</p>
      </div>

      <!-- 5张3D旋转卡片 -->
      <div ref="cardsWrapRef" class="voyage-cards">
        <div
          v-for="(card, index) in voyageCards"
          :key="index"
          class="voyage-card"
          :ref="el => setCardRef(el, index)"
          :style="{
            '--card-color': card.color,
            '--card-index': index
          }"
        >
          <!-- 卡片背景 -->
          <div class="card-bg">
            <div class="card-shine"></div>
          </div>
          
          <!-- 顶部装饰 -->
          <div class="card-header">
            <div class="card-number">{{ String(index + 1).padStart(2, '0') }}</div>
            <div class="card-diamond"></div>
          </div>
          
          <!-- 图标区 -->
          <div class="card-icon-area">
            <div class="icon-container" v-html="card.icon"></div>
            <div class="icon-glow"></div>
          </div>
          
          <!-- 内容 -->
          <div class="card-content">
            <h3 class="card-title">{{ card.title }}</h3>
            <p class="card-desc">{{ card.desc }}</p>
          </div>
          
          <!-- 底部信息 -->
          <div class="card-footer">
            <div class="card-meta">
              <span class="meta-label">{{ card.label }}</span>
              <span class="meta-value">{{ card.value }}</span>
            </div>
            <div class="card-bar">
              <div class="bar-fill" :style="{ '--fill-width': card.percent }"></div>
            </div>
          </div>
          
          <!-- 边框 -->
          <div class="card-frame"></div>
        </div>
      </div>

      <!-- 底部签名 -->
      <div ref="footerRef" class="voyage-footer">
        <div class="footer-ornament">
          <span class="ornament-line"></span>
          <span class="ornament-diamond">◆</span>
          <span class="ornament-line"></span>
        </div>
        <p class="footer-text">探索奢华的极致体验</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []

// Refs
const sectionRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const badgeRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const cardsWrapRef = ref<HTMLElement | null>(null)

const cardRefs = ref<Map<number, HTMLElement>>(new Map())

const setCardRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  const element = el instanceof Element ? el : (el as any)?.$el
  if (element) {
    cardRefs.value.set(index, element as HTMLElement)
  } else {
    cardRefs.value.delete(index)
  }
}

// 5张奢华旅程卡片
const voyageCards = [
  {
    title: '启程',
    desc: '踏上未知的奢华之旅',
    color: '#c9a962',
    label: '出发地',
    value: '上海',
    percent: '30',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7L12 12L22 7L12 2Z"/><path d="M2 17L12 22L22 17"/><path d="M2 12L12 17L22 12"/></svg>'
  },
  {
    title: '探索',
    desc: '发现隐藏的珍宝与惊喜',
    color: '#8b7355',
    label: '目的地',
    value: '巴黎',
    percent: '55',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M2 12H22"/><path d="M12 2C14.5 4.5 16 8 16 12C16 16 14.5 19.5 12 22C9.5 19.5 8 16 8 12C8 8 9.5 4.5 12 2Z"/></svg>'
  },
  {
    title: '沉浸',
    desc: '完全融入当地的文化精髓',
    color: '#d4af37',
    label: '体验度',
    value: '满分',
    percent: '85',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"/><path d="M12 6V12L16 14"/></svg>'
  },
  {
    title: '回味',
    desc: '每一刻都值得铭记在心',
    color: '#b8860b',
    label: '记忆值',
    value: '深刻',
    percent: '70',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61C19.58 3.35 17.91 2.66 16.13 2.66H7.87C6.09 2.66 4.42 3.35 3.16 4.61C1.9 5.87 1.21 7.54 1.21 9.32V14.68C1.21 16.46 1.9 18.13 3.16 19.39C4.42 20.65 6.09 21.34 7.87 21.34H16.13C17.91 21.34 19.58 20.65 20.84 19.39C22.1 18.13 22.79 16.46 22.79 14.68V9.32C22.79 7.54 22.1 5.87 20.84 4.61Z"/><path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"/></svg>'
  },
  {
    title: '珍藏',
    desc: '将美好永远收藏于心底',
    color: '#c9a962',
    label: '完成度',
    value: '100%',
    percent: '100',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61C19.58 3.35 17.91 2.66 16.13 2.66H7.87C6.09 2.66 4.42 3.35 3.16 4.61C1.9 5.87 1.21 7.54 1.21 9.32V14.68C1.21 16.46 1.9 18.13 3.16 19.39C4.42 20.65 6.09 21.34 7.87 21.34H16.13C17.91 21.34 19.58 20.65 20.84 19.39C22.1 18.13 22.79 16.46 22.79 14.68V9.32C22.79 7.54 22.1 5.87 20.84 4.61Z"/><path d="M12 8V12M12 16H12.01"/><path d="M8 12H9M15 12H16"/></svg>'
  }
]

// 创建背景粒子
const createBackgroundParticles = () => {
  if (!sectionRef.value) return
  
  const container = sectionRef.value.querySelector('.bg-particles') as HTMLElement
  if (!container) return

  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div')
    particle.className = 'bg-particle'
    particle.style.left = `${Math.random() * 100}%`
    particle.style.top = `${Math.random() * 100}%`
    particle.style.animationDelay = `${Math.random() * 5}s`
    particle.style.animationDuration = `${4 + Math.random() * 4}s`
    container.appendChild(particle)
    cleanupFns.push(() => particle.remove())
  }
}

// 初始化 3D 景深旋转滑入动画
const initVoyageAnimation = () => {
  if (!sectionRef.value) return

  createBackgroundParticles()

  // 获取所有卡片
  const cards = Array.from(cardRefs.value.values())
  const [c1, c2, c3, c4, c5] = cards

  // ========== 顶级 3D 景深旋转滑入 Timeline ==========
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 80%',
      toggleActions: 'play none none none'
    }
  })

  // ========== 统一初始化：景深、隐藏、下沉、旋转 ==========
  gsap.set(cards, {
    opacity: 0,
    y: 60,
    scale: 0.8,
    rotateY: 25,
    transformOrigin: 'center center',
    boxShadow: '0 0 0 rgba(0,0,0,0)'
  })

  // ========== 入场动画：中心优先、对称扩散 ==========

  // 1. 中心卡片 C3 优先入场（视觉焦点）
  tl.to(c3, {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateY: 0,
    boxShadow: '0 12px 32px rgba(212, 175, 55, 0.25)',
    ease: 'back.out(1.4)'
  })

  // 2. 内侧卡片 C2 C4 同步入场
  tl.to([c2, c4], {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateY: 0,
    boxShadow: '0 10px 28px rgba(0,0,0,0.2)'
  }, '-=0.45')

  // 3. 外侧卡片 C1 C5 收尾入场
  tl.to([c1, c5], {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateY: 0,
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
  }, '-=0.4')

  // 4. 标题入场
  tl.fromTo(badgeRef.value,
    { scale: 0, opacity: 0, rotation: -90 },
    { scale: 1, opacity: 1, rotation: 0, ease: 'back.out(1.7)' },
    0.1
  )
  .fromTo(titleRef.value,
    { y: 50, opacity: 0, filter: 'blur(12px)' },
    { y: 0, opacity: 1, filter: 'blur(0px)', ease: 'power3.out' },
    '-=0.5'
  )
  .fromTo(subtitleRef.value,
    { y: 40, opacity: 0, letterSpacing: '20px' },
    { y: 0, opacity: 1, letterSpacing: '6px', ease: 'power2.out' },
    '-=0.4'
  )

  // 5. 全局悬浮呼吸微动（永久流畅循环）
  tl.to(cards, {
    y: -8,
    duration: 1.8,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true,
    stagger: {
      each: 0.15,
      from: 'center'
    }
  }, '+=0.2')

  // 6. 底部入场
  tl.fromTo(footerRef.value,
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, ease: 'power2.out' },
    '-=0.3'
  )

  cleanupFns.push(() => tl.kill())

  // ========== ScrollTrigger 滚动动画 ==========
  // 标题滚动消失
  if (titleRef.value) {
    const stTitle = ScrollTrigger.create({
      trigger: titleRef.value,
      start: 'top 80%',
      end: 'top 30%',
      scrub: 1.5,
      onUpdate: (self) => {
        gsap.set(titleRef.value, {
          y: -80 * self.progress,
          opacity: Math.max(0, 1 - self.progress * 2),
          filter: `blur(${self.progress * 6}px)`,
          scale: 1 - self.progress * 0.2
        })
      }
    })
    cleanupFns.push(() => stTitle.kill())
  }

  // 副标题滚动
  if (subtitleRef.value) {
    const stSubtitle = ScrollTrigger.create({
      trigger: subtitleRef.value,
      start: 'top 80%',
      end: 'top 30%',
      scrub: 1.5,
      onUpdate: (self) => {
        gsap.set(subtitleRef.value, {
          y: -50 * self.progress,
          opacity: Math.max(0, 1 - self.progress * 1.8),
          letterSpacing: `${6 + self.progress * 10}px`
        })
      }
    })
    cleanupFns.push(() => stSubtitle.kill())
  }

  // 卡片滚动效果 - 3D 旋转
  cards.forEach((card, i) => {
    const st = ScrollTrigger.create({
      trigger: card,
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1.5,
      onUpdate: (self) => {
        const p = self.progress
        // 根据卡片位置计算不同的旋转效果
        const rotateConfigs = [
          { rotateY: 8, rotateX: 3 },
          { rotateY: 4, rotateX: 2 },
          { rotateY: 0, rotateX: 0 },
          { rotateY: -4, rotateX: -2 },
          { rotateY: -8, rotateX: -3 }
        ]
        const config = rotateConfigs[i] || { rotateY: 0, rotateX: 0 }
        
        gsap.set(card, {
          y: -25 * p,
          rotateY: config.rotateY + p * 12,
          rotateX: config.rotateX + p * 5,
          scale: 1 - p * 0.1,
          filter: `brightness(${1 + p * 0.3})`
        })
      }
    })
    cleanupFns.push(() => st.kill())
  })

  // 底部滚动消失
  if (footerRef.value) {
    const stFooter = ScrollTrigger.create({
      trigger: footerRef.value,
      start: 'top 90%',
      end: 'top 50%',
      scrub: 1.5,
      onUpdate: (self) => {
        gsap.set(footerRef.value, {
          y: 40 * self.progress,
          opacity: Math.max(0, 1 - self.progress * 2)
        })
      }
    })
    cleanupFns.push(() => stFooter.kill())
  }
}

onMounted(() => {
  setTimeout(initVoyageAnimation, 100)
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
.voyage-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(180deg, #0f0c09 0%, #1a1510 40%, #252015 70%, #0f0c09 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

// 奢华背景
.voyage-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;

  .bg-gradient {
    position: absolute;
    inset: 0;
    background: 
      radial-gradient(ellipse at 30% 20%, rgba(201, 169, 98, 0.08) 0%, transparent 50%),
      radial-gradient(ellipse at 70% 80%, rgba(212, 175, 55, 0.06) 0%, transparent 50%);
  }

  .bg-particles {
    position: absolute;
    inset: 0;
  }

  .ambient-light {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 1000px;
    height: 1000px;
    transform: translate(-50%, -50%);
    background: radial-gradient(
      circle,
      rgba(201, 169, 98, 0.05) 0%,
      rgba(201, 169, 98, 0.02) 30%,
      transparent 60%
    );
    animation: ambientBreath 6s ease-in-out infinite;
  }
}

:global(.bg-particle) {
  position: absolute;
  width: 2px;
  height: 2px;
  background: rgba(201, 169, 98, 0.6);
  border-radius: 50%;
  animation: particleFloat 5s ease-in-out infinite;
}

@keyframes ambientBreath {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
  50% { transform: translate(-50%, -50%) scale(1.15); opacity: 1; }
}

@keyframes particleFloat {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.2;
  }
  50% {
    transform: translateY(-30px) scale(1.5);
    opacity: 0.8;
  }
}

// 主容器
.voyage-container {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 40px;
  max-width: 1400px;
}

// 头部
.voyage-header {
  margin-bottom: 50px;
}

.header-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 28px;
  background: rgba(201, 169, 98, 0.1);
  border: 1px solid rgba(201, 169, 98, 0.3);
  border-radius: 40px;
  color: #c9a962;
  font-size: 11px;
  letter-spacing: 5px;
  margin-bottom: 24px;
  backdrop-filter: blur(10px);

  svg {
    width: 16px;
    height: 16px;
  }
}

.voyage-title {
  font-family: 'Playfair Display', 'Noto Serif SC', serif;
  font-size: clamp(48px, 7vw, 80px);
  font-weight: 700;
  letter-spacing: 10px;
  background: linear-gradient(180deg, #fff 0%, #d4af37 50%, #c9a962 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
  filter: drop-shadow(0 0 30px rgba(212, 175, 55, 0.4));
}

.voyage-subtitle {
  font-size: 16px;
  color: rgba(201, 169, 98, 0.6);
  letter-spacing: 6px;
  margin: 0;
}

// 卡片容器 - 3D 景深关键
.voyage-cards {
  display: flex;
  gap: 24px;
  justify-content: center;
  flex-wrap: wrap;
  perspective: 1200px;
  padding: 20px 0;
}

// 奢华卡片
.voyage-card {
  position: relative;
  width: 200px;
  height: 300px;
  background: linear-gradient(
    160deg,
    rgba(30, 25, 18, 0.95) 0%,
    rgba(20, 18, 12, 0.98) 100%
  );
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  border: 1px solid rgba(201, 169, 98, 0.15);

  // 卡片背景
  .card-bg {
    position: absolute;
    inset: 0;
    overflow: hidden;

    .card-shine {
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: linear-gradient(
        45deg,
        transparent 40%,
        rgba(201, 169, 98, 0.05) 45%,
        rgba(201, 169, 98, 0.1) 50%,
        rgba(201, 169, 98, 0.05) 55%,
        transparent 60%
      );
      animation: cardShine 4s ease-in-out infinite;
    }
  }

  &:hover {
    .card-frame {
      border-color: var(--card-color);
      box-shadow: 0 0 30px rgba(201, 169, 98, 0.2);
    }

    .icon-container {
      transform: scale(1.1) rotate(5deg);
    }

    .icon-glow {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1.3);
    }
  }
}

@keyframes cardShine {
  0% { transform: translateX(-100%) rotate(0deg); }
  100% { transform: translateX(100%) rotate(0deg); }
}

// 卡片头部
.card-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px;
  z-index: 2;
}

.card-number {
  font-size: 12px;
  color: rgba(201, 169, 98, 0.4);
  font-weight: 300;
  letter-spacing: 2px;
}

.card-diamond {
  width: 8px;
  height: 8px;
  background: var(--card-color);
  transform: rotate(45deg);
  opacity: 0.6;
}

// 图标区
.card-icon-area {
  position: relative;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  z-index: 2;
}

.icon-container {
  width: 50px;
  height: 50px;
  color: var(--card-color);
  filter: drop-shadow(0 0 15px var(--card-color));
  transition: transform 0.4s ease;
  z-index: 1;

  svg {
    width: 100%;
    height: 100%;
  }
}

.icon-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100px;
  height: 100px;
  transform: translate(-50%, -50%) scale(1);
  background: radial-gradient(
    circle,
    rgba(201, 169, 98, 0.2) 0%,
    transparent 70%
  );
  opacity: 0.5;
  transition: all 0.4s ease;
  pointer-events: none;
}

// 卡片内容
.card-content {
  position: relative;
  z-index: 2;
  padding: 0 18px;
  text-align: center;
}

.card-title {
  font-size: 22px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 10px;
  letter-spacing: 6px;
}

.card-desc {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.6;
  margin: 0;
}

// 卡片底部
.card-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px 18px;
  z-index: 2;
}

.card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.meta-label {
  font-size: 10px;
  color: rgba(201, 169, 98, 0.5);
  letter-spacing: 2px;
}

.meta-value {
  font-size: 12px;
  color: var(--card-color);
  font-weight: 600;
  letter-spacing: 1px;
}

.card-bar {
  height: 2px;
  background: rgba(201, 169, 98, 0.15);
  border-radius: 1px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  width: var(--fill-width);
  background: linear-gradient(90deg, var(--card-color), rgba(255, 255, 255, 0.6));
  border-radius: 1px;
  box-shadow: 0 0 8px var(--card-color);
}

// 边框
.card-frame {
  position: absolute;
  inset: 0;
  border-radius: 20px;
  border: 1px solid rgba(201, 169, 98, 0.1);
  pointer-events: none;
  transition: all 0.3s ease;
  z-index: 3;
}

// 底部
.voyage-footer {
  margin-top: 50px;
}

.footer-ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 16px;
}

.ornament-line {
  width: 60px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(201, 169, 98, 0.4), transparent);
}

.ornament-diamond {
  font-size: 8px;
  color: rgba(201, 169, 98, 0.5);
}

.footer-text {
  font-size: 13px;
  color: rgba(201, 169, 98, 0.4);
  letter-spacing: 4px;
  margin: 0;
}

@media (max-width: 1200px) {
  .voyage-cards {
    gap: 20px;
  }
  
  .voyage-card {
    width: 180px;
    height: 280px;
  }
}

@media (max-width: 900px) {
  .voyage-card {
    width: 160px;
    height: 260px;
  }

  .card-icon-area {
    height: 70px;
  }

  .icon-container {
    width: 45px;
    height: 45px;
  }

  .card-title {
    font-size: 18px;
  }
}

@media (max-width: 768px) {
  .voyage-title {
    font-size: 36px;
    letter-spacing: 5px;
  }

  .voyage-subtitle {
    font-size: 12px;
    letter-spacing: 3px;
  }

  .voyage-cards {
    gap: 15px;
  }

  .voyage-card {
    width: 140px;
    height: 240px;
  }

  .card-header {
    padding: 12px 14px;
  }

  .card-icon-area {
    height: 60px;
    margin-bottom: 10px;
  }

  .icon-container {
    width: 40px;
    height: 40px;
  }

  .card-content {
    padding: 0 14px;
  }

  .card-title {
    font-size: 16px;
    letter-spacing: 4px;
  }

  .card-desc {
    font-size: 10px;
  }
}
</style>
