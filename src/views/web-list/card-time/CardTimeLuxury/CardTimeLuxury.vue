<template>
  <section class="luxury-section" ref="sectionRef">
    <!-- 背景效果 -->
    <div class="luxury-bg">
      <div class="bg-gradient"></div>
      <div class="bg-lines"></div>
      <div class="bg-gold-particles" ref="particlesRef"></div>
    </div>

    <!-- 标题 -->
    <div class="luxury-header" ref="headerRef">
      <h1 class="header-title">
        <span class="title-line"></span>
        <span class="title-text">EXQUISITE</span>
        <span class="title-line"></span>
      </h1>
      <p class="header-subtitle">递进遮罩 · 奢华美学</p>
    </div>

    <!-- 卡片画廊 -->
    <div class="luxury-gallery" ref="galleryRef">
      <div
        v-for="(card, index) in cards"
        :key="index"
        class="luxury-card"
        :ref="el => { if(el) cardRefs[index] = el as HTMLElement }"
        :style="{
          '--i': index,
          '--gold': card.gold,
          '--accent': card.accent,
          '--delay': `${index * 0.15}s`
        }"
      >
        <!-- 遮罩层 -->
        <div class="card-overlay" ref="el => { if(el) overlayRefs[index] = el as HTMLElement }"></div>
        
        <!-- 顶部装饰线 -->
        <div class="card-top-line"></div>
        
        <!-- 序号 -->
        <div class="card-number">{{ String(index + 1).padStart(2, '0') }}</div>
        
        <!-- 主图标 -->
        <div class="card-icon" ref="el => { if(el) iconRefs[index] = el as HTMLElement }">
          <div class="icon-frame">
            <div class="icon-inner">{{ card.icon }}</div>
          </div>
        </div>
        
        <!-- 内容区域 -->
        <div class="card-body" ref="el => { if(el) bodyRefs[index] = el as HTMLElement }">
          <h3 class="card-title">{{ card.title }}</h3>
          <p class="card-desc">{{ card.desc }}</p>
          <div class="card-divider"></div>
          <div class="card-tags">
            <span v-for="tag in card.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>
        
        <!-- 底部装饰 -->
        <div class="card-bottom-line"></div>
        
        <!-- 悬停光效 -->
        <div class="card-glow"></div>
      </div>
    </div>

    <!-- 进度指示 -->
    <div class="luxury-progress" ref="progressRef">
      <div class="progress-track">
        <div class="progress-fill" ref="progressFillRef"></div>
      </div>
      <div class="progress-dots">
        <span v-for="n in 6" :key="n" class="dot" :class="{ active: n <= 4 }"></span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Card {
  icon: string
  title: string
  desc: string
  tags: string[]
  gold: string
  accent: string
}

const cards: Card[] = [
  { icon: '◈', title: '量子领域', desc: '探索微观世界的无限可能', tags: ['量子', '微观'], gold: '#d4af37', accent: '#f5e6c8' },
  { icon: '❖', title: '光影交织', desc: '明暗之间的艺术平衡', tags: ['光线', '阴影'], gold: '#c9a961', accent: '#fff8e7' },
  { icon: '✧', title: '时空编织', desc: '穿越维度的永恒瞬间', tags: ['时间', '空间'], gold: '#e8d5a3', accent: '#fffcf0' },
  { icon: '◇', title: '秩序之美', desc: '对称与和谐的统一', tags: ['对称', '和谐'], gold: '#d4af37', accent: '#f5e6c8' },
]

// Refs
const sectionRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const galleryRef = ref<HTMLElement | null>(null)
const progressRef = ref<HTMLElement | null>(null)
const progressFillRef = ref<HTMLElement | null>(null)
const particlesRef = ref<HTMLElement | null>(null)
const cardRefs = ref<HTMLElement[]>([])
const overlayRefs = ref<HTMLElement[]>([])
const iconRefs = ref<HTMLElement[]>([])
const bodyRefs = ref<HTMLElement[]>([])

// 清理函数
const cleanupFns: (() => void)[] = []

// 随机数工具
function random(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

// 创建金色粒子
function createParticles() {
  if (!particlesRef.value) return
  for (let i = 0; i < 40; i++) {
    const particle = document.createElement('div')
    particle.className = 'gold-particle'
    particle.style.left = `${random(0, 100)}%`
    particle.style.top = `${random(0, 100)}%`
    particle.style.width = `${random(1, 4)}px`
    particle.style.height = particle.style.width
    particle.style.animationDelay = `${random(0, 5)}s`
    particle.style.animationDuration = `${random(3, 8)}s`
    particlesRef.value.appendChild(particle)
  }
}

// 初始化卡片状态
function initCards() {
  cardRefs.value.forEach((card) => {
    gsap.set(card, {
      x: 120,
      opacity: 0,
      rotation: 3,
    })
  })
  
  overlayRefs.value.forEach((overlay) => {
    gsap.set(overlay, {
      opacity: 1,
    })
  })
  
  iconRefs.value.forEach((icon) => {
    gsap.set(icon, {
      opacity: 0,
      scale: 0.5,
      filter: 'blur(10px)',
    })
  })
  
  bodyRefs.value.forEach((body) => {
    gsap.set(body, {
      opacity: 0,
      y: 30,
    })
  })
}

onMounted(() => {
  if (!sectionRef.value) return

  setTimeout(() => {
    // 创建粒子
    createParticles()
    
    // 初始化卡片状态
    initCards()
    
    // 入场动画 - 标题
    gsap.fromTo(
      headerRef.value,
      { opacity: 0, y: -40 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: headerRef.value,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    )
    
    // 标题文字动画
    gsap.fromTo(
      headerRef.value?.querySelectorAll('.title-text, .title-line') || [],
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: headerRef.value,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    )
    
    // 卡片递进滑入动画
    cardRefs.value.forEach((card, index) => {
      const overlay = overlayRefs.value[index]
      const icon = iconRefs.value[index]
      const body = bodyRefs.value[index]
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          end: 'top 25%',
          scrub: 1.5,
        },
      })
      
      // 阶段1：卡片从右滑入
      tl.to(card, {
        x: 0,
        opacity: 1,
        duration: 0.4,
        ease: 'power3.out',
      })
      
      // 阶段2：轻微倾斜修正
      tl.to(card, {
        rotation: 2,
        duration: 0.15,
        ease: 'power2.out',
      })
      tl.to(card, {
        rotation: 0,
        duration: 0.25,
        ease: 'power2.inOut',
      }, '-=0.1')
      
      // 阶段3：遮罩渐显
      if (overlay) {
        tl.to(overlay, {
          opacity: 0,
          duration: 0.4,
          ease: 'power2.out',
        }, 0.2)
      }
      
      // 阶段4：图标动画
      if (icon) {
        tl.to(icon, {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          duration: 0.5,
          ease: 'back.out(1.7)',
        }, '-=0.3')
      }
      
      // 阶段5：内容渐显
      if (body) {
        tl.to(body, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
        }, '-=0.3')
      }
      
      cleanupFns.push(() => tl.kill())
    })
    
    // 卡片悬浮效果
    cardRefs.value.forEach((card, i) => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card.querySelector('.card-glow'), {
          opacity: 1,
          scale: 1.2,
          duration: 0.3,
        })
        gsap.to(card.querySelector('.icon-inner'), {
          scale: 1.1,
          rotation: 5,
          duration: 0.3,
        })
      })
      
      card.addEventListener('mouseleave', () => {
        gsap.to(card.querySelector('.card-glow'), {
          opacity: 0,
          scale: 1,
          duration: 0.3,
        })
        gsap.to(card.querySelector('.icon-inner'), {
          scale: 1,
          rotation: 0,
          duration: 0.3,
        })
      })
      
      cleanupFns.push(() => {
        card.removeEventListener('mouseenter', () => {})
        card.removeEventListener('mouseleave', () => {})
      })
    })
    
    // 进度条动画
    if (progressFillRef.value) {
      gsap.to(progressFillRef.value, {
        width: '100%',
        duration: 1.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: galleryRef.value,
          start: 'top 80%',
          end: 'bottom 30%',
          scrub: true,
        },
      })
    }
    
    // 底部提示入场
    gsap.fromTo(
      progressRef.value,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: progressRef.value,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      }
    )
  }, 100)
})

onUnmounted(() => {
  // 执行所有清理
  cleanupFns.forEach(fn => fn())
  
  // 清理所有 ScrollTrigger
  ScrollTrigger.getAll().forEach(st => st.kill())
  
  // 清理粒子
  if (particlesRef.value) {
    particlesRef.value.innerHTML = ''
  }
})
</script>

<style scoped lang="scss">
.luxury-section {
  width: 100vw;
  min-height: 100vh;
  background: linear-gradient(180deg, #0c0a09 0%, #1a1614 50%, #0c0a09 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
}

.luxury-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;

  .bg-gradient {
    position: absolute;
    inset: 0;
    background: 
      radial-gradient(ellipse at 20% 20%, rgba(212, 175, 55, 0.08) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 80%, rgba(201, 169, 97, 0.06) 0%, transparent 50%);
  }

  .bg-lines {
    position: absolute;
    inset: 0;
    background-image:
      repeating-linear-gradient(
        90deg,
        rgba(212, 175, 55, 0.02) 0px,
        rgba(212, 175, 55, 0.02) 1px,
        transparent 1px,
        transparent 80px
      );
  }

  .bg-gold-particles {
    position: absolute;
    inset: 0;
  }
}

.luxury-header {
  text-align: center;
  margin-bottom: 60px;
  z-index: 1;

  .header-title {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    margin: 0 0 16px;

    .title-line {
      width: 80px;
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--gold, #d4af37), transparent);
      transform-origin: center;
    }

    .title-text {
      font-size: 36px;
      font-weight: 300;
      color: var(--gold, #d4af37);
      letter-spacing: 12px;
      text-shadow: 0 0 40px rgba(212, 175, 55, 0.3);
    }
  }

  .header-subtitle {
    font-size: 14px;
    color: rgba(245, 230, 200, 0.6);
    margin: 0;
    letter-spacing: 6px;
    font-weight: 300;
  }
}

.luxury-gallery {
  display: grid;
  grid-template-columns: repeat(4, 240px);
  gap: 30px;
  z-index: 1;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 240px);
  }
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
}

.luxury-card {
  position: relative;
  width: 240px;
  height: 340px;
  background: linear-gradient(
    145deg,
    rgba(30, 25, 20, 0.95) 0%,
    rgba(20, 18, 15, 0.98) 100%
  );
  border: 1px solid rgba(212, 175, 55, 0.2);
  overflow: hidden;
  cursor: pointer;
  transform-style: preserve-3d;
  perspective: 1000px;
  will-change: transform, opacity;

  .card-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(212, 175, 55, 0.15) 0%,
      rgba(201, 169, 97, 0.1) 50%,
      rgba(212, 175, 55, 0.15) 100%
    );
    pointer-events: none;
    z-index: 5;
  }

  .card-top-line {
    position: absolute;
    top: 0;
    left: 20%;
    width: 60%;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold, #d4af37), transparent);
  }

  .card-number {
    position: absolute;
    top: 16px;
    right: 16px;
    font-size: 48px;
    font-weight: 200;
    color: rgba(212, 175, 55, 0.15);
    font-family: 'Georgia', serif;
    letter-spacing: -2px;
    line-height: 1;
  }

  .card-icon {
    position: absolute;
    top: 40px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;

    .icon-frame {
      width: 80px;
      height: 80px;
      border: 1px solid rgba(212, 175, 55, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;

      &::before {
        content: '';
        position: absolute;
        inset: -4px;
        border: 1px solid rgba(212, 175, 55, 0.1);
      }

      .icon-inner {
        font-size: 36px;
        color: var(--gold, #d4af37);
        text-shadow: 0 0 20px rgba(212, 175, 55, 0.5);
        transition: transform 0.3s;
      }
    }
  }

  .card-body {
    position: absolute;
    bottom: 40px;
    left: 0;
    right: 0;
    padding: 0 24px;
    text-align: center;
    z-index: 3;

    .card-title {
      font-size: 22px;
      font-weight: 400;
      color: var(--accent, #fff8e7);
      margin: 0 0 10px;
      letter-spacing: 4px;
    }

    .card-desc {
      font-size: 13px;
      color: rgba(245, 230, 200, 0.6);
      margin: 0 0 16px;
      line-height: 1.6;
    }

    .card-divider {
      width: 40px;
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--gold, #d4af37), transparent);
      margin: 0 auto 16px;
    }

    .card-tags {
      display: flex;
      justify-content: center;
      gap: 10px;

      .tag {
        font-size: 11px;
        color: rgba(212, 175, 55, 0.7);
        padding: 4px 12px;
        border: 1px solid rgba(212, 175, 55, 0.2);
        letter-spacing: 2px;
        transition: all 0.3s;

        &:hover {
          background: rgba(212, 175, 55, 0.1);
          border-color: rgba(212, 175, 55, 0.4);
        }
      }
    }
  }

  .card-bottom-line {
    position: absolute;
    bottom: 0;
    left: 10%;
    width: 80%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.5), transparent);
  }

  .card-glow {
    position: absolute;
    inset: -50%;
    background: radial-gradient(
      circle at center,
      rgba(212, 175, 55, 0.1) 0%,
      transparent 60%
    );
    opacity: 0;
    pointer-events: none;
    z-index: 1;
    transition: opacity 0.3s;
  }

  &:hover {
    border-color: rgba(212, 175, 55, 0.5);
    box-shadow: 
      0 20px 60px rgba(0, 0, 0, 0.4),
      0 0 40px rgba(212, 175, 55, 0.1);
    
    .card-number {
      color: rgba(212, 175, 55, 0.3);
    }
    
    .tag {
      background: rgba(212, 175, 55, 0.1);
      border-color: rgba(212, 175, 55, 0.4);
    }
  }
}

.luxury-progress {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  .progress-track {
    width: 200px;
    height: 2px;
    background: rgba(212, 175, 55, 0.2);
    position: relative;
    overflow: hidden;

    .progress-fill {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 0;
      background: linear-gradient(90deg, var(--gold, #d4af37), var(--accent, #fff8e7));
    }
  }

  .progress-dots {
    display: flex;
    gap: 12px;

    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: rgba(212, 175, 55, 0.3);
      transition: all 0.3s;

      &.active {
        background: var(--gold, #d4af37);
        box-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
      }
    }
  }
}

// 金色粒子样式
:deep(.gold-particle) {
  position: absolute;
  background: radial-gradient(circle, var(--gold, #d4af37) 0%, transparent 70%);
  border-radius: 50%;
  animation: goldFloat 5s ease-in-out infinite;

  @keyframes goldFloat {
    0%, 100% {
      opacity: 0.2;
      transform: translateY(0) scale(1);
    }
    50% {
      opacity: 0.8;
      transform: translateY(-30px) scale(1.5);
    }
  }
}
</style>
