<template>
  <section ref="sectionRef" class="cinematic-section">
    <!-- 电影级光晕背景 -->
    <div class="cinema-bg">
      <div class="bg-vignette"></div>
      <div class="bg-bokeh"></div>
      <div class="light-streaks"></div>
    </div>

    <!-- 粒子层 -->
    <div ref="particlesRef" class="cinema-particles"></div>

    <!-- 主容器 -->
    <div class="cinema-container">
      <!-- 顶部标题区 -->
      <div ref="headerRef" class="cinema-header">
        <div ref="badgeRef" class="header-badge">
          <svg viewBox="0 0 24 24" fill="none">
            <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" stroke-width="1.5"/>
            <path d="M10 9L15 12L10 15V9Z" fill="currentColor"/>
          </svg>
          <span>CINEMATIC</span>
        </div>
        <h2 ref="titleRef" class="cinema-title">光影叙事</h2>
        <p ref="subtitleRef" class="cinema-subtitle">由中心向两侧 · 涟漪般的视觉诗篇</p>
      </div>

      <!-- 5张叙事卡片 -->
      <div ref="cardsWrapRef" class="cinema-cards">
        <div
          v-for="(card, index) in cinemaCards"
          :key="index"
          class="cinema-card"
          :ref="el => setCardRef(el, index)"
          :style="{
            '--card-color': card.color,
            '--card-index': index,
            '--card-z': index === 2 ? 10 : index === 1 || index === 3 ? 8 : index === 0 || index === 4 ? 6 : 4
          }"
        >
          <!-- 卡片光晕 -->
          <div class="card-aura"></div>
          
          <!-- 内部内容 -->
          <div class="card-media">
            <div class="media-icon" v-html="card.icon"></div>
            <div class="media-shimmer"></div>
          </div>
          
          <div class="card-body">
            <h3 class="card-title">{{ card.title }}</h3>
            <p class="card-desc">{{ card.desc }}</p>
          </div>
          
          <div class="card-footer">
            <div class="card-badge">{{ card.tag }}</div>
            <div class="card-progress">
              <div class="progress-fill" :style="{ '--fill': card.progress }"></div>
            </div>
          </div>
          
          <!-- 边框光效 -->
          <div class="card-border-glow"></div>
        </div>
      </div>

      <!-- 底部叙事 -->
      <div ref="footerRef" class="cinema-footer">
        <div class="footer-timeline">
          <span class="timeline-dot active"></span>
          <span class="timeline-line"></span>
          <span class="timeline-dot"></span>
          <span class="timeline-line"></span>
          <span class="timeline-dot"></span>
        </div>
        <p class="footer-text">视觉叙事的艺术 · 每一帧都是故事</p>
      </div>
    </div>

    <!-- 电影遮罩 -->
    <div class="cinema-letterbox"></div>
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
const particlesRef = ref<HTMLElement | null>(null)

const cardRefs = ref<Map<number, HTMLElement>>(new Map())

const setCardRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  const element = el instanceof Element ? el : (el as any)?.$el
  if (element) {
    cardRefs.value.set(index, element as HTMLElement)
  } else {
    cardRefs.value.delete(index)
  }
}

// 5张叙事卡片数据
const cinemaCards = [
  {
    title: '序章',
    desc: '故事的起点，梦想的萌芽之地',
    color: '#6366f1',
    tag: 'PROLOGUE',
    progress: '20',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z"/><path d="M12 12L20 7.5"/><path d="M12 12V21"/><path d="M12 12L4 7.5"/></svg>'
  },
  {
    title: '发展',
    desc: '情节渐入佳境，冲突与成长并存',
    color: '#8b5cf6',
    tag: 'DEVELOPMENT',
    progress: '45',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13 2L3 14H12L11 22L21 10H12L13 2Z"/></svg>'
  },
  {
    title: '高潮',
    desc: '命运的转折点，力量的巅峰汇聚',
    color: '#ec4899',
    tag: 'CLIMAX',
    progress: '80',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6V12L16 14"/></svg>'
  },
  {
    title: '转折',
    desc: '意想不到的变局，故事的分水岭',
    color: '#f59e0b',
    tag: 'TURNING',
    progress: '60',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M23 4V10H17"/><path d="M1 20V14H7"/><path d="M3.51 9A9 9 0 0114.85 3.15L23 10"/><path d="M20.49 15A9 9 0 019.15 20.85L1 14"/></svg>'
  },
  {
    title: '终章',
    desc: '尘埃落定，完美的谢幕演出',
    color: '#10b981',
    tag: 'EPILOGUE',
    progress: '95',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01L9 11.01"/></svg>'
  }
]

// 创建电影粒子
const createCinemaParticles = () => {
  if (!particlesRef.value) return

  for (let i = 0; i < 25; i++) {
    const particle = document.createElement('div')
    particle.className = 'cinema-particle'
    particle.style.left = `${Math.random() * 100}%`
    particle.style.top = `${Math.random() * 100}%`
    particle.style.animationDelay = `${Math.random() * 6}s`
    particle.style.animationDuration = `${4 + Math.random() * 4}s`
    particlesRef.value.appendChild(particle)
    cleanupFns.push(() => particle.remove())
  }
}

// 初始化顶级高阶 GSAP Timeline 动画
const initCinematicAnimation = () => {
  if (!sectionRef.value) return

  createCinemaParticles()

  // 获取所有卡片
  const cards = Array.from(cardRefs.value.values())
  const [c1, c2, c3, c4, c5] = cards

  // ========== 顶级高阶 GSAP Timeline ==========
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 80%',
      toggleActions: 'play none none none'
    }
  })

  // ========== 初始全局状态 ==========
  gsap.set(cards, {
    opacity: 0,
    scale: 0.7,
    y: 80,
    rotateY: 15,
    boxShadow: '0 0 0 rgba(0,0,0,0)'
  })

  // ========== 入场动画：中心向两侧涟漪扩散 ==========
  
  // 1. 中间 C3 (index=2) 优先入场 - 视觉焦点
  tl.to(c3, {
    opacity: 1,
    scale: 1,
    y: 0,
    rotateY: 0,
    ease: 'back.out(1.3)',
    boxShadow: '0 15px 40px rgba(236, 72, 153, 0.3)'
  })

  // 2. 左右第二梯队 C2 C4 同步进场
  tl.to([c2, c4], {
    opacity: 1,
    scale: 1,
    y: 0,
    rotateY: 0,
    ease: 'power3.out',
    boxShadow: '0 12px 35px rgba(0,0,0,0.25)'
  }, '-=0.45')

  // 3. 最外侧 C1 C5 最后涟漪铺开
  tl.to([c1, c5], {
    opacity: 1,
    scale: 1,
    y: 0,
    rotateY: 0,
    ease: 'power3.out',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
  }, '-=0.4')

  // ========== 头部入场动画 ==========
  tl.fromTo(badgeRef.value,
    { scale: 0, opacity: 0, rotation: -90 },
    { scale: 1, opacity: 1, rotation: 0, ease: 'back.out(1.7)' },
    0.2
  )
  .fromTo(titleRef.value,
    { y: 60, opacity: 0, filter: 'blur(15px)' },
    { y: 0, opacity: 1, filter: 'blur(0px)', ease: 'power3.out' },
    '-=0.5'
  )
  .fromTo(subtitleRef.value,
    { y: 40, opacity: 0, letterSpacing: '15px' },
    { y: 0, opacity: 1, letterSpacing: '6px', ease: 'power2.out' },
    '-=0.4'
  )

  // ========== 全局收尾：轻微立体悬浮呼吸动画（永久循环） ==========
  tl.to(cards, {
    y: -10,
    duration: 1.8,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true,
    stagger: {
      each: 0.15,
      from: 'center'
    }
  }, '+=0.25')

  // 底部入场
  tl.fromTo(footerRef.value,
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, ease: 'power2.out' },
    '-=0.3'
  )

  cleanupFns.push(() => tl.kill())

  // ========== 滚动动画 (ScrollTrigger) ==========
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
          letterSpacing: `${6 + self.progress * 8}px`
        })
      }
    })
    cleanupFns.push(() => stSubtitle.kill())
  }

  // 卡片滚动效果
  cards.forEach((card, i) => {
    const st = ScrollTrigger.create({
      trigger: card,
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1.5,
      onUpdate: (self) => {
        const p = self.progress
        // 计算卡片位置对应的3D旋转
        const centerOffset = Math.abs(i - 2)
        const baseRotateY = [8, 5, 0, -5, -8][i]
        
        gsap.set(card, {
          y: -30 * p,
          rotateY: baseRotateY + p * 10,
          rotateX: p * 5,
          scale: 1 - p * 0.08,
          filter: `brightness(${1 + p * 0.4}) saturate(${1 + p * 0.2})`
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
  setTimeout(initCinematicAnimation, 100)
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

.cinematic-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(180deg, #0c0c14 0%, #14141f 40%, #1a1a28 70%, #0c0c14 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

// 电影背景
.cinema-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;

  .bg-vignette {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, 0.6) 100%);
  }

  .bg-bokeh {
    position: absolute;
    inset: 0;
    background: 
      radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.15) 0%, transparent 30%),
      radial-gradient(circle at 80% 70%, rgba(236, 72, 153, 0.1) 0%, transparent 30%),
      radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.08) 0%, transparent 50%);
    animation: bokehFloat 8s ease-in-out infinite;
  }

  .light-streaks {
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      90deg,
      transparent 0%,
      transparent 49%,
      rgba(255, 255, 255, 0.01) 50%,
      transparent 51%,
      transparent 100%
    );
    animation: streaksMove 20s linear infinite;
  }
}

@keyframes bokehFloat {
  0%, 100% { transform: scale(1) translateY(0); opacity: 0.8; }
  50% { transform: scale(1.1) translateY(-20px); opacity: 1; }
}

@keyframes streaksMove {
  0% { transform: translateX(-10%); }
  100% { transform: translateX(10%); }
}

// 粒子
.cinema-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

:global(.cinema-particle) {
  position: absolute;
  width: 3px;
  height: 3px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.8), transparent);
  border-radius: 50%;
  animation: particleDrift 6s ease-in-out infinite;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

@keyframes particleDrift {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-50px) scale(1.5);
    opacity: 0.8;
  }
}

// 主容器
.cinema-container {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 40px;
  max-width: 1400px;
}

// 头部
.cinema-header {
  margin-bottom: 50px;
}

.header-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 28px;
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 40px;
  color: #818cf8;
  font-size: 11px;
  letter-spacing: 5px;
  margin-bottom: 24px;
  backdrop-filter: blur(10px);

  svg {
    width: 16px;
    height: 16px;
  }
}

.cinema-title {
  font-family: 'Playfair Display', 'Noto Serif SC', serif;
  font-size: clamp(48px, 7vw, 80px);
  font-weight: 700;
  letter-spacing: 8px;
  background: linear-gradient(180deg, #fff 0%, #a5b4fc 50%, #6366f1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
  filter: drop-shadow(0 0 40px rgba(99, 102, 241, 0.4));
}

.cinema-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 6px;
  margin: 0;
}

// 卡片容器 - 3D景深关键
.cinema-cards {
  display: flex;
  gap: 24px;
  justify-content: center;
  flex-wrap: wrap;
  perspective: 1200px;
  padding: 20px 0;
}

// 叙事卡片
.cinema-card {
  position: relative;
  width: 200px;
  height: 280px;
  background: linear-gradient(
    180deg,
    rgba(20, 20, 31, 0.9) 0%,
    rgba(15, 15, 25, 0.95) 100%
  );
  border-radius: 24px;
  overflow: hidden;
  cursor: pointer;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);

  // 动态Z轴层级
  z-index: var(--card-z);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.05) 0%,
      transparent 50%
    );
    pointer-events: none;
  }

  &:hover {
    .card-aura {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1.1);
    }

    .media-icon {
      transform: scale(1.1) rotate(5deg);
    }

    .card-border-glow {
      opacity: 1;
    }
  }
}

// 卡片光晕
.card-aura {
  position: absolute;
  top: 30%;
  left: 50%;
  width: 250%;
  height: 250%;
  transform: translate(-50%, -50%) scale(0.9);
  background: radial-gradient(
    circle,
    rgba(var(--card-color-rgb, 99, 102, 241), 0.15) 0%,
    transparent 60%
  );
  opacity: 0.5;
  transition: all 0.5s ease;
  pointer-events: none;
  z-index: 0;
}

// 媒体区
.card-media {
  position: relative;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    180deg,
    rgba(99, 102, 241, 0.1) 0%,
    transparent 100%
  );
  overflow: hidden;
}

.media-icon {
  width: 60px;
  height: 60px;
  color: var(--card-color);
  filter: drop-shadow(0 0 20px var(--card-color));
  transition: transform 0.4s ease;
  z-index: 1;

  svg {
    width: 100%;
    height: 100%;
  }
}

.media-shimmer {
  position: absolute;
  top: -100%;
  left: -100%;
  width: 300%;
  height: 300%;
  background: linear-gradient(
    45deg,
    transparent 40%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 60%
  );
  animation: shimmerSlide 3s ease-in-out infinite;
}

@keyframes shimmerSlide {
  0% { transform: translateX(-100%) translateY(-100%); }
  100% { transform: translateX(100%) translateY(100%); }
}

// 卡片主体
.card-body {
  position: relative;
  z-index: 1;
  padding: 20px 18px;
  text-align: center;
}

.card-title {
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 10px;
  letter-spacing: 4px;
  text-shadow: 0 0 20px var(--card-color);
}

.card-desc {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 1;
}

.card-badge {
  font-size: 9px;
  letter-spacing: 2px;
  color: var(--card-color);
  opacity: 0.8;
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
}

.card-progress {
  width: 60px;
  height: 3px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  width: var(--fill);
  background: linear-gradient(90deg, var(--card-color), rgba(255, 255, 255, 0.8));
  border-radius: 2px;
  box-shadow: 0 0 8px var(--card-color);
}

// 边框光效
.card-border-glow {
  position: absolute;
  inset: 0;
  border-radius: 24px;
  border: 1px solid var(--card-color);
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
  box-shadow: 
    inset 0 0 20px rgba(255, 255, 255, 0.03),
    0 0 30px var(--card-color);
}

// 底部叙事
.cinema-footer {
  margin-top: 50px;
  text-align: center;
}

.footer-timeline {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 20px;
}

.timeline-dot {
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transition: all 0.3s;

  &.active {
    background: #818cf8;
    box-shadow: 0 0 15px #818cf8;
  }
}

.timeline-line {
  width: 40px;
  height: 1px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.2), rgba(129, 140, 248, 0.5));
}

.footer-text {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 3px;
  margin: 0;
}

// 电影遮罩
.cinema-letterbox {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.5) 0%, transparent 100%);
  pointer-events: none;
  z-index: 20;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, transparent 100%);
  }
}

@media (max-width: 1200px) {
  .cinema-cards {
    gap: 20px;
  }
  
  .cinema-card {
    width: 180px;
    height: 260px;
  }
}

@media (max-width: 900px) {
  .cinema-card {
    width: 160px;
    height: 240px;
  }

  .card-media {
    height: 100px;
  }

  .media-icon {
    width: 50px;
    height: 50px;
  }

  .card-title {
    font-size: 18px;
  }
}

@media (max-width: 768px) {
  .cinema-title {
    font-size: 36px;
    letter-spacing: 4px;
  }

  .cinema-subtitle {
    font-size: 12px;
    letter-spacing: 3px;
  }

  .cinema-cards {
    gap: 15px;
  }

  .cinema-card {
    width: 140px;
    height: 220px;
  }

  .card-media {
    height: 80px;
  }

  .media-icon {
    width: 40px;
    height: 40px;
  }

  .card-body {
    padding: 15px 12px;
  }

  .card-title {
    font-size: 16px;
  }

  .card-desc {
    font-size: 10px;
  }

  .cinema-letterbox {
    height: 40px;
  }
}
</style>
