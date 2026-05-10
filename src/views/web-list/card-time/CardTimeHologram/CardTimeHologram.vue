<template>
  <div ref="sectionRef" class="hologram-section">
    <!-- 全息扫描背景 -->
    <div class="holo-bg">
      <div class="scan-line"></div>
      <div class="grid-pattern"></div>
      <div class="ambient-glow"></div>
    </div>

    <!-- 全息粒子 -->
    <div ref="particlesRef" class="holo-particles"></div>

    <!-- 内容区域 -->
    <div class="holo-content">
      <div ref="badgeRef" class="holo-badge">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
        </svg>
        <span>HOLOGRAM</span>
      </div>
      
      <h2 ref="titleRef" class="holo-title">全息投影</h2>
      <p ref="subtitleRef" class="holo-subtitle">光与数据的未来 · 虚实交融的界面</p>

      <!-- 全息卡片组 -->
      <div ref="cardsContainerRef" class="holo-cards-container">
        <div
          v-for="(card, index) in holoCards"
          :key="index"
          class="holo-card"
          :ref="el => setCardRef(el, index)"
          :style="{
            '--holo-color': card.color,
            '--holo-hue': card.hue,
            '--card-delay': index * 0.1
          }"
        >
          <!-- 全息扫描层 -->
          <div class="scan-layer">
            <div class="scan-bar"></div>
          </div>
          
          <!-- 全息边框 -->
          <div class="holo-frame">
            <div class="frame-corner tl"></div>
            <div class="frame-corner tr"></div>
            <div class="frame-corner bl"></div>
            <div class="frame-corner br"></div>
          </div>
          
          <!-- 全息光晕 -->
          <div class="holo-glow"></div>
          
          <!-- 卡片内容 -->
          <div class="card-inner">
            <div class="card-icon-wrapper">
              <div class="holo-icon" v-html="card.icon"></div>
              <div class="glitch-layer"></div>
            </div>
            <h3 class="card-title">{{ card.title }}</h3>
            <p class="card-desc">{{ card.desc }}</p>
            <div class="card-metrics">
              <div class="metric" v-for="m in card.metrics" :key="m.label">
                <span class="metric-value" :style="{ color: card.color }">{{ m.value }}</span>
                <span class="metric-label">{{ m.label }}</span>
              </div>
            </div>
          </div>
          
          <!-- RGB偏移层 -->
          <div class="rgb-shift"></div>
        </div>
      </div>

      <div ref="footerRef" class="holo-footer">
        <span class="footer-line"></span>
        <span>全息界面 · 未来已来</span>
        <span class="footer-line"></span>
      </div>
    </div>

    <!-- 全息闪烁效果 -->
    <div class="holo-glitch"></div>
  </div>
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
const badgeRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const cardsContainerRef = ref<HTMLElement | null>(null)
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

// 全息卡片数据
const holoCards = [
  {
    title: '数据核心',
    desc: '量子计算驱动的智能分析引擎',
    color: '#00f5ff',
    hue: 188,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/><path d="M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>',
    metrics: [
      { value: '99.9%', label: '精度' },
      { value: '0.1ms', label: '延迟' }
    ]
  },
  {
    title: '界面矩阵',
    desc: '全息投影技术构建的交互界面',
    color: '#b388ff',
    hue: 270,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M7 8l3 3-3 3M12 14h4"/></svg>',
    metrics: [
      { value: '8K', label: '分辨率' },
      { value: '120Hz', label: '刷新' }
    ]
  },
  {
    title: '意识链接',
    desc: '神经接口实现的意识数据交互',
    color: '#69f0ae',
    hue: 150,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/><path d="M12 14c-4 0-8 2-8 6v2h16v-2c0-4-4-6-8-6z"/><circle cx="9" cy="9" r="1"/><circle cx="15" cy="9" r="1"/></svg>',
    metrics: [
      { value: '1T', label: '带宽' },
      { value: '0ms', label: '同步' }
    ]
  },
  {
    title: '时空折叠',
    desc: '量子态传输实现的即时到达',
    color: '#ff6e40',
    hue: 20,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/><path d="M2 12h2M20 12h2M12 2v2M12 20v2"/></svg>',
    metrics: [
      { value: 'c', label: '速度' },
      { value: '∞', label: '距离' }
    ]
  }
]

// 创建全息粒子
const createHoloParticles = () => {
  if (!particlesRef.value) return

  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div')
    particle.className = 'holo-particle'
    particle.style.left = `${Math.random() * 100}%`
    particle.style.top = `${Math.random() * 100}%`
    particle.style.animationDelay = `${Math.random() * 5}s`
    particle.style.animationDuration = `${3 + Math.random() * 4}s`
    particlesRef.value.appendChild(particle)
    cleanupFns.push(() => particle.remove())
  }
}

// 初始化动画
const initAnimations = () => {
  if (!sectionRef.value) return

  // 创建全息粒子
  createHoloParticles()

  // ========== 入场动画 ==========
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 80%',
      toggleActions: 'play none none none'
    }
  })

  // 徽章动画
  tl.fromTo(badgeRef.value,
    { scale: 0, opacity: 0, rotation: -180 },
    { scale: 1, opacity: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.7)' }
  )
  // 标题动画
  .fromTo(titleRef.value,
    { y: 80, opacity: 0, filter: 'blur(10px)', skewX: -10 },
    { y: 0, opacity: 1, filter: 'blur(0px)', skewX: 0, duration: 0.7, ease: 'back.out(1.4)' },
    '-=0.4'
  )
  // 副标题动画
  .fromTo(subtitleRef.value,
    { y: 50, opacity: 0, letterSpacing: '20px' },
    { y: 0, opacity: 1, letterSpacing: '6px', duration: 0.6, ease: 'power2.out' },
    '-=0.3'
  )

  // 卡片依次入场 - 错落滑落 + 弹性回弹
  const cards = cardRefs.value
  cards.forEach((card, i) => {
    if (!card) return
    gsap.set(card, { 
      opacity: 0, 
      y: -80, 
      scale: 0.92,
      rotation: 5
    })
    
    tl.to(card,
      {
        opacity: 1,
        y: 0,
        scale: 0.92,
        rotation: 0,
        duration: 0.55,
        ease: 'power1.out'
      },
      `-=${0.5 - i * 0.08}`
    )
  })

  // 弹性回弹动画
  cards.forEach((card, i) => {
    if (!card) return
    
    tl.to(card,
      {
        scale: 1.03,
        duration: 0.2,
        ease: 'power2.inOut'
      },
      `-=${0.1 - i * 0.02}`
    )
    
    tl.to(card,
      {
        scale: 1,
        duration: 0.3,
        ease: 'elastic.out(1, 0.5)'
      },
      `-=${0.05}`
    )
  })

  // 底部动画
  tl.fromTo(footerRef.value,
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
    '-=0.2'
  )

  cleanupFns.push(() => tl.kill())

  // ========== 滚动动画 ==========
  // 标题滚动消失
  if (titleRef.value) {
    const st1 = ScrollTrigger.create({
      trigger: titleRef.value,
      start: 'top 80%',
      end: 'top 30%',
      scrub: 1.5,
      onUpdate: (self) => {
        gsap.set(titleRef.value, {
          y: -100 * self.progress,
          opacity: Math.max(0, 1 - self.progress * 2.5),
          filter: `blur(${self.progress * 8}px)`,
          skewX: self.progress * -5
        })
      }
    })
    cleanupFns.push(() => st1.kill())
  }

  // 副标题滚动效果
  if (subtitleRef.value) {
    const st2 = ScrollTrigger.create({
      trigger: subtitleRef.value,
      start: 'top 80%',
      end: 'top 30%',
      scrub: 1.5,
      onUpdate: (self) => {
        gsap.set(subtitleRef.value, {
          y: -60 * self.progress,
          opacity: Math.max(0, 1 - self.progress * 2),
          letterSpacing: `${6 + self.progress * 10}px`
        })
      }
    })
    cleanupFns.push(() => st2.kill())
  }

  // 卡片滚动效果
  cards.forEach((card, i) => {
    if (!card) return

    const st = ScrollTrigger.create({
      trigger: card,
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1.5,
      onUpdate: (self) => {
        const p = self.progress
        gsap.set(card, {
          y: -40 * p,
          rotateY: p * 15,
          rotateX: p * 5,
          scale: 1 + p * 0.05,
          filter: `brightness(${1 + p * 0.3}) hue-rotate(${p * 20}deg)`
        })
      }
    })
    cleanupFns.push(() => st.kill())
  })

  // 全息闪烁效果
  setupGlitchEffect()
}

// 全息闪烁效果
const setupGlitchEffect = () => {
  if (!sectionRef.value) return

  const glitch = sectionRef.value.querySelector('.holo-glitch')
  if (!glitch) return

  // 随机闪烁
  const flicker = () => {
    gsap.to(glitch, {
      opacity: Math.random() * 0.1,
      duration: 0.05,
      onComplete: () => {
        gsap.to(glitch, {
          opacity: 0,
          duration: 0.05,
          onComplete: flicker
        })
      }
    })
  }

  // 每隔一段时间触发一次闪烁
  gsap.to(sectionRef.value, {
    opacity: 0.98,
    duration: 0.1,
    repeat: -1,
    yoyo: true,
    onRepeat: () => {
      if (Math.random() > 0.95) {
        gsap.to(glitch, { opacity: 0.15, duration: 0.05 })
      }
    }
  })
}

onMounted(() => {
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

.hologram-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(180deg, #0a0a0f 0%, #0d1117 40%, #161b22 70%, #0a0a0f 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

// 全息背景
.holo-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;

  .scan-line {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(0, 245, 255, 0.1) 50%, 
      transparent 100%
    );
    animation: scanMove 4s linear infinite;
  }

  .grid-pattern {
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(rgba(0, 245, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 245, 255, 0.03) 1px, transparent 1px);
    background-size: 50px 50px;
    animation: gridPulse 3s ease-in-out infinite;
  }

  .ambient-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 800px;
    height: 800px;
    transform: translate(-50%, -50%);
    background: radial-gradient(
      circle,
      rgba(0, 245, 255, 0.08) 0%,
      rgba(179, 136, 255, 0.04) 50%,
      transparent 70%
    );
    animation: ambientPulse 6s ease-in-out infinite;
  }
}

@keyframes scanMove {
  0% { top: -4px; }
  100% { top: 100%; }
}

@keyframes gridPulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

@keyframes ambientPulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
  50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
}

// 全息粒子
.holo-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

:global(.holo-particle) {
  position: absolute;
  width: 2px;
  height: 2px;
  background: rgba(0, 245, 255, 0.6);
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(0, 245, 255, 0.5);
  animation: particleFloat 5s ease-in-out infinite;
}

@keyframes particleFloat {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-30px) scale(1.5);
    opacity: 1;
  }
}

// 内容区域
.holo-content {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 60px 40px;
}

// 全息徽章
.holo-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 28px;
  background: rgba(0, 245, 255, 0.08);
  border: 1px solid rgba(0, 245, 255, 0.3);
  border-radius: 40px;
  color: #00f5ff;
  font-size: 12px;
  letter-spacing: 5px;
  margin-bottom: 30px;
  backdrop-filter: blur(10px);
  box-shadow: 
    0 0 20px rgba(0, 245, 255, 0.2),
    inset 0 0 20px rgba(0, 245, 255, 0.05);

  svg {
    width: 18px;
    height: 18px;
  }
}

// 标题
.holo-title {
  font-family: 'Orbitron', 'Rajdhani', sans-serif;
  font-size: clamp(48px, 8vw, 72px);
  font-weight: 900;
  letter-spacing: 8px;
  background: linear-gradient(180deg, #fff 0%, #00f5ff 50%, #b388ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 20px;
  filter: drop-shadow(0 0 30px rgba(0, 245, 255, 0.4));
  text-shadow: 
    0 0 40px rgba(0, 245, 255, 0.3),
    2px 2px 0 rgba(179, 136, 255, 0.3),
    -2px -2px 0 rgba(0, 245, 255, 0.3);
}

// 副标题
.holo-subtitle {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 6px;
  margin-bottom: 60px;
}

// 卡片容器
.holo-cards-container {
  display: flex;
  gap: 30px;
  justify-content: center;
  flex-wrap: wrap;
  perspective: 1200px;
  margin: 0 auto;
  max-width: 1200px;
}

// 全息卡片
.holo-card {
  position: relative;
  width: 260px;
  height: 340px;
  background: rgba(10, 15, 20, 0.85);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transform-style: preserve-3d;
  transition: transform 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(0, 245, 255, 0.1) 0%,
      transparent 50%,
      rgba(179, 136, 255, 0.05) 100%
    );
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-15px) rotateX(5deg);

    .holo-glow {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1.2);
    }

    .glitch-layer {
      animation: glitchFlicker 0.3s steps(2) infinite;
    }
  }
}

// 扫描层
.scan-layer {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 5;

  .scan-bar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, 
      transparent, 
      var(--holo-color), 
      transparent
    );
    animation: cardScan 3s linear infinite;
    box-shadow: 0 0 15px var(--holo-color);
  }
}

@keyframes cardScan {
  0% { top: -3px; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}

// 全息边框
.holo-frame {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;

  .frame-corner {
    position: absolute;
    width: 20px;
    height: 20px;
    border: 2px solid var(--holo-color);
    opacity: 0.6;

    &.tl {
      top: 8px;
      left: 8px;
      border-right: none;
      border-bottom: none;
    }

    &.tr {
      top: 8px;
      right: 8px;
      border-left: none;
      border-bottom: none;
    }

    &.bl {
      bottom: 8px;
      left: 8px;
      border-right: none;
      border-top: none;
    }

    &.br {
      bottom: 8px;
      right: 8px;
      border-left: none;
      border-top: none;
    }
  }
}

// 全息光晕
.holo-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200%;
  height: 200%;
  transform: translate(-50%, -50%) scale(0.8);
  background: radial-gradient(
    circle,
    rgba(0, 245, 255, 0.15) 0%,
    transparent 50%
  );
  opacity: 0.5;
  transition: all 0.4s ease;
  pointer-events: none;
  z-index: 1;
}

// 卡片内部
.card-inner {
  position: relative;
  z-index: 3;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 25px;
  text-align: center;
}

.card-icon-wrapper {
  position: relative;
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
}

.holo-icon {
  width: 100%;
  height: 100%;
  color: var(--holo-color);
  filter: drop-shadow(0 0 15px var(--holo-color));
  transition: transform 0.3s;

  svg {
    width: 100%;
    height: 100%;
  }
}

.glitch-layer {
  position: absolute;
  inset: 0;
  background: transparent;
  opacity: 0;

  &::before,
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: inherit;
  }
}

@keyframes glitchFlicker {
  0%, 100% { opacity: 0; }
  50% { opacity: 0.1; transform: translate(2px, -2px); }
}

.card-title {
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 12px;
  letter-spacing: 3px;
  text-shadow: 0 0 20px var(--holo-color);
}

.card-desc {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
  margin-bottom: 20px;
}

.card-metrics {
  display: flex;
  gap: 25px;
  margin-top: auto;
}

.metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.metric-value {
  font-size: 18px;
  font-weight: 800;
  text-shadow: 0 0 10px currentColor;
}

.metric-label {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 1px;
}

// RGB偏移层
.rgb-shift {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 4;
  opacity: 0;
  mix-blend-mode: screen;
  background: linear-gradient(
    45deg,
    rgba(255, 0, 0, 0.1) 0%,
    transparent 50%,
    rgba(0, 255, 255, 0.1) 100%
  );
  transition: opacity 0.3s;

  .holo-card:hover & {
    opacity: 1;
    animation: rgbShift 0.5s steps(3) infinite;
  }
}

@keyframes rgbShift {
  0% { transform: translate(0, 0); }
  33% { transform: translate(2px, -1px); }
  66% { transform: translate(-1px, 2px); }
  100% { transform: translate(0, 0); }
}

// 底部
.holo-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 60px;
  color: rgba(255, 255, 255, 0.4);
  font-size: 14px;
  letter-spacing: 3px;

  .footer-line {
    width: 60px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0, 245, 255, 0.3), transparent);
  }
}

// 全息闪烁效果
.holo-glitch {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 245, 255, 0.03) 2px,
    rgba(0, 245, 255, 0.03) 4px
  );
  pointer-events: none;
  opacity: 0;
  z-index: 20;
}

@media (max-width: 768px) {
  .holo-title {
    font-size: 36px;
    letter-spacing: 4px;
  }

  .holo-subtitle {
    font-size: 14px;
    letter-spacing: 3px;
  }

  .holo-cards-container {
    gap: 20px;
  }

  .holo-card {
    width: 200px;
    height: 280px;
    padding: 20px 15px;
  }

  .card-icon-wrapper {
    width: 60px;
    height: 60px;
  }

  .card-title {
    font-size: 18px;
  }

  .card-desc {
    font-size: 12px;
  }

  .holo-footer {
    flex-direction: column;
    gap: 10px;
    
    .footer-line {
      display: none;
    }
  }
}
</style>
