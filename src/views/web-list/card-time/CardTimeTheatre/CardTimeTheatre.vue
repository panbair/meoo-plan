<template>
  <div ref="sectionRef" class="card-theatre-section">
    <!-- 背景氛围 -->
    <div class="theatre-ambient">
      <div class="ambient-glow glow-1"></div>
      <div class="ambient-glow glow-2"></div>
    </div>
    
    <!-- 标题区域 -->
    <div ref="headerRef" class="theatre-header">
      <div ref="badgeRef" class="header-badge">
        <span class="badge-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
            <line x1="12" y1="17" x2="12" y2="21"/>
          </svg>
        </span>
        <span class="badge-text">LIGHT THEATRE</span>
      </div>
      <h2 ref="titleRef" class="header-title">光影剧场</h2>
      <p ref="subtitleRef" class="header-subtitle">聚光灯下的叙事诗篇</p>
    </div>
    
    <!-- 光影剧场容器 -->
    <div ref="theatreContainerRef" class="theatre-container">
      <!-- 光束指示器 -->
      <div class="beam-indicator">
        <div ref="beamRef" class="spotlight-beam"></div>
      </div>
      
      <!-- 卡片画廊 - 双层结构 -->
      <div ref="cardGalleryRef" class="card-gallery">
        <!-- 灰度基底层 -->
        <div class="card-layer base-layer">
          <div
            v-for="(card, i) in timelineCards"
            :key="'base-card-' + i"
            :ref="el => baseCardRefs.set(i, el as HTMLElement)"
            class="theatre-card base-card"
            :style="{ '--card-hue': card.hue }"
          >
            <div class="card-year">{{ card.year }}</div>
            <div class="card-title">{{ card.title }}</div>
            <div class="card-desc">{{ card.desc }}</div>
            <div class="card-marker"></div>
          </div>
        </div>
        
        <!-- 彩色光束层 -->
        <div ref="colorLayerRef" class="card-layer color-layer">
          <div
            v-for="(card, i) in timelineCards"
            :key="'color-card-' + i"
            :ref="el => colorCardRefs.set(i, el as HTMLElement)"
            class="theatre-card color-card"
            :style="{ '--card-hue': card.hue }"
          >
            <div class="card-shine"></div>
            <div class="card-year">{{ card.year }}</div>
            <div class="card-title">{{ card.title }}</div>
            <div class="card-desc">{{ card.desc }}</div>
            <div class="card-marker"></div>
            <div class="card-icon" v-html="card.icon"></div>
          </div>
        </div>
      </div>
      
      <!-- 时间线连接线 -->
      <div class="timeline-line">
        <div ref="timelineProgressRef" class="timeline-progress"></div>
      </div>
    </div>
    
    <!-- 底部信息 -->
    <div ref="footerRef" class="theatre-footer">
      <span>滚动以驱动光束 · 照亮每一个时刻</span>
    </div>
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
const theatreContainerRef = ref<HTMLElement | null>(null)
const cardGalleryRef = ref<HTMLElement | null>(null)
const colorLayerRef = ref<HTMLElement | null>(null)
const beamRef = ref<HTMLElement | null>(null)
const timelineProgressRef = ref<HTMLElement | null>(null)
const baseCardRefs = ref(new Map<number, HTMLElement>())
const colorCardRefs = ref(new Map<number, HTMLElement>())

// 数据
const timelineCards = [
  {
    year: '1999',
    title: '启程',
    desc: '梦想的种子',
    hue: 200,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>'
  },
  {
    year: '2005',
    title: '探索',
    desc: '技术的深耕',
    hue: 50,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>'
  },
  {
    year: '2012',
    title: '突破',
    desc: '创新的力量',
    hue: 280,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>'
  },
  {
    year: '2018',
    title: '蜕变',
    desc: '华丽的转身',
    hue: 160,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>'
  },
  {
    year: '2025',
    title: '未来',
    desc: '无限的可能',
    hue: 30,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>'
  }
]

// 光束宽度比例
const BEAM_WIDTH = 0.5

// 初始化动画
const initAnimations = () => {
  if (!sectionRef.value) return
  
  // 入场动画
  const entryTL = gsap.timeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 80%',
      toggleActions: 'play none none none'
    }
  })
  
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
  
  // 卡片入场
  setupCardEntry()
  
  // 光束滚动效果
  setupSpotlightEffect()
  
  // 滚动效果
  setupScrollEffects()
}

// 卡片入场动画
const setupCardEntry = () => {
  nextTick(() => {
    if (!cardGalleryRef.value) return
    
    // 灰度卡片入场
    const baseCards = cardGalleryRef.value.querySelectorAll('.base-card')
    const entryTL = gsap.timeline({
      scrollTrigger: {
        trigger: cardGalleryRef.value,
        start: 'top 75%',
        toggleActions: 'play none none reverse'
      }
    })
    
    baseCards.forEach((card, i) => {
      entryTL.fromTo(card,
        { 
          y: 60, 
          opacity: 0, 
          scale: 0.8,
          filter: 'brightness(0.3)'
        },
        { 
          y: 0, 
          opacity: 1, 
          scale: 1,
          duration: 0.6, 
          ease: 'back.out(1.2)'
        },
        i * 0.15
      )
    })
    
    cleanupFns.push(() => entryTL.kill())
  })
}

// 聚光灯效果
const setupSpotlightEffect = () => {
  nextTick(() => {
    if (!colorLayerRef.value || !theatreContainerRef.value) return
    
    // 初始化 clip-path 为隐藏
    gsap.set(colorLayerRef.value, {
      clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)'
    })
    
    // 聚光灯滚动动画
    const spotlightTL = gsap.to(colorLayerRef.value, {
      scrollTrigger: {
        trigger: theatreContainerRef.value,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.8,
        onUpdate: (self) => {
          const progress = self.progress
          
          // 光束中心位置
          const center = progress
          const startClip = Math.max(0, center - BEAM_WIDTH / 2)
          const endClip = Math.min(1, center + BEAM_WIDTH / 2)
          
          // 转为百分比
          const left = startClip * 100
          const right = endClip * 100
          
          // 梯形光束效果
          const clipPath = `polygon(
            ${left - 5}% 0%, 
            ${right + 5}% 0%, 
            ${right + 10}% 100%, 
            ${left - 10}% 100%
          )`
          
          colorLayerRef.value!.style.clipPath = clipPath
          
          // 更新光束指示器
          if (beamRef.value) {
            gsap.set(beamRef.value, {
              left: `${center * 100}%`
            })
          }
          
          // 更新进度线
          if (timelineProgressRef.value) {
            gsap.set(timelineProgressRef.value, {
              scaleX: progress
            })
          }
        }
      }
    })
    
    cleanupFns.push(() => spotlightTL.kill())
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
    if (!cardGalleryRef.value) return
    
    const cards = cardGalleryRef.value.querySelectorAll('.base-card')
    cards.forEach((card, i) => {
      const breatheST = ScrollTrigger.create({
        trigger: cardGalleryRef.value,
        start: 'top 60%',
        end: 'bottom 40%',
        scrub: 2,
        onUpdate: (self) => {
          const breatheY = Math.sin(self.progress * Math.PI * 2 + i * 0.5) * 5
          gsap.set(card, {
            y: breatheY
          })
        }
      })
      cleanupFns.push(() => breatheST.kill())
    })
  })
}

onMounted(() => {
  // 延迟初始化以确保懒加载时 DOM 已完全渲染
  setTimeout(initAnimations, 100)
})

onUnmounted(() => {
  // 清理所有动画
  cleanupFns.forEach(fn => fn())
  
  // 清理 ScrollTrigger
  ScrollTrigger.getAll().forEach(st => {
    if (st.vars.trigger && sectionRef.value?.contains(st.vars.trigger as Element)) {
      st.kill()
    }
  })
})
</script>

<style scoped lang="scss">
.card-theatre-section {
  position: relative;
  width: 100vw;
  min-height: 100vh;
  background: linear-gradient(180deg, #050508 0%, #0a0a10 30%, #0f0f18 50%, #08080c 100%);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

// 背景氛围
.theatre-ambient {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.ambient-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(150px);
  opacity: 0.15;
}

.glow-1 {
  width: 800px;
  height: 800px;
  top: -300px;
  left: -200px;
  background: radial-gradient(circle, hsla(200, 70%, 60%, 0.5) 0%, transparent 70%);
}

.glow-2 {
  width: 600px;
  height: 600px;
  bottom: -200px;
  right: -100px;
  background: radial-gradient(circle, hsla(50, 80%, 60%, 0.4) 0%, transparent 70%);
}

// 标题区域
.theatre-header {
  position: relative;
  z-index: 10;
  text-align: center;
  margin-bottom: 60px;
}

.header-badge {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 10px 28px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.08) 100%);
  border: 1px solid rgba(139, 92, 246, 0.25);
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
  font-size: 52px;
  font-weight: 900;
  letter-spacing: 12px;
  margin-bottom: 14px;
  background: linear-gradient(135deg, #fff 0%, #c4b5fd 35%, #a78bfa 65%, #818cf8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 30px rgba(167, 139, 250, 0.4));
}

.header-subtitle {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.45);
  letter-spacing: 8px;
}

// 剧场容器
.theatre-container {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 1100px;
  padding: 40px 20px;
}

// 光束指示器
.beam-indicator {
  position: relative;
  height: 4px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 2px;
  margin-bottom: 30px;
  overflow: visible;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: rgba(139, 92, 246, 0.6);
    box-shadow: 0 0 15px rgba(139, 92, 246, 0.8);
  }
  
  &::before { left: 0; }
  &::after { right: 0; }
}

.spotlight-beam {
  position: absolute;
  top: 50%;
  left: 0;
  width: 80px;
  height: 20px;
  transform: translate(-50%, -50%);
  background: radial-gradient(ellipse at center, 
    rgba(167, 139, 250, 0.8) 0%, 
    rgba(139, 92, 246, 0.4) 40%,
    transparent 70%
  );
  filter: blur(8px);
  border-radius: 50%;
  pointer-events: none;
}

// 卡片画廊
.card-gallery {
  position: relative;
  display: flex;
  justify-content: center;
  gap: 24px;
  perspective: 1200px;
}

.card-layer {
  display: flex;
  justify-content: center;
  gap: 24px;
}

// 灰度基底层
.base-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
}

// 彩色光束层
.color-layer {
  position: relative;
  z-index: 2;
  // 初始隐藏
  clip-path: polygon(0 0, 0 0, 0 100%, 0 100%);
}

// 剧场卡片
.theatre-card {
  position: relative;
  width: 160px;
  height: 240px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
  transition: transform 0.3s ease;
  
  // 光泽效果
  .card-shine {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      transparent 0%,
      rgba(255, 255, 255, 0.1) 40%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0.1) 60%,
      transparent 100%
    );
    opacity: 0;
    transition: opacity 0.4s;
    pointer-events: none;
  }
  
  .card-icon {
    position: absolute;
    top: 20px;
    right: 15px;
    width: 24px;
    height: 24px;
    color: rgba(255, 255, 255, 0.6);
    opacity: 0;
    transition: opacity 0.4s, transform 0.4s;
    
    :deep(svg) {
      width: 100%;
      height: 100%;
    }
  }
  
  .card-year {
    font-family: 'Orbitron', monospace;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 2px;
    margin-bottom: 12px;
    opacity: 0.6;
  }
  
  .card-title {
    font-size: 22px;
    font-weight: 700;
    letter-spacing: 4px;
    margin-bottom: 8px;
  }
  
  .card-desc {
    font-size: 12px;
    letter-spacing: 1px;
    opacity: 0.5;
  }
  
  .card-marker {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: 30px;
    height: 3px;
    border-radius: 2px;
    opacity: 0.3;
  }
  
  &:hover {
    transform: translateY(-8px);
    
    .card-shine {
      opacity: 1;
    }
    
    .card-icon {
      opacity: 1;
      transform: rotate(15deg);
    }
  }
}

// 基底卡片样式
.base-card {
  background: linear-gradient(145deg, 
    #1a1a1a 0%, 
    #0d0d0d 100%
  );
  color: #444;
  border: 1px solid #2a2a2a;
  box-shadow: 
    inset 0 0 40px rgba(0, 0, 0, 0.8),
    0 10px 30px rgba(0, 0, 0, 0.5);
  
  .card-year { color: #555; }
  .card-title { color: #3a3a3a; }
  .card-desc { color: #444; }
  .card-marker { background: #333; }
}

// 彩色卡片样式
.color-card {
  background: linear-gradient(145deg, 
    hsl(calc(var(--card-hue) + 20), 70%, 45%) 0%, 
    hsl(var(--card-hue), 70%, 35%) 50%,
    hsl(calc(var(--card-hue) - 20), 70%, 45%) 100%
  );
  background-size: 200% 200%;
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 
    0 25px 50px hsla(var(--card-hue), 60%, 40%, 0.3),
    0 0 60px hsla(var(--card-hue), 70%, 50%, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  animation: gradientShift 6s ease infinite;
  
  .card-year { 
    color: rgba(255, 255, 255, 0.8);
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
  }
  .card-title { 
    color: white;
    text-shadow: 0 0 20px hsla(var(--card-hue), 80%, 70%, 0.8);
  }
  .card-desc { 
    color: rgba(255, 255, 255, 0.7);
  }
  .card-marker { 
    background: rgba(255, 255, 255, 0.6);
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  }
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

// 时间线
.timeline-line {
  position: relative;
  height: 2px;
  background: rgba(255, 255, 255, 0.05);
  margin-top: 30px;
  border-radius: 1px;
}

.timeline-progress {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, 
    hsla(200, 70%, 60%, 0.8) 0%, 
    hsla(50, 80%, 60%, 0.8) 50%,
    hsla(280, 70%, 60%, 0.8) 100%
  );
  transform-origin: left;
  transform: scaleX(0);
  border-radius: 1px;
  box-shadow: 0 0 15px rgba(167, 139, 250, 0.6);
}

// 底部信息
.theatre-footer {
  position: relative;
  z-index: 10;
  margin-top: 50px;
  
  span {
    font-size: 11px;
    letter-spacing: 4px;
    color: rgba(255, 255, 255, 0.25);
  }
}

// 响应式
@media (max-width: 900px) {
  .card-gallery {
    flex-wrap: wrap;
    gap: 20px;
  }
  
  .theatre-card {
    width: 140px;
    height: 200px;
  }
  
  .header-title {
    font-size: 40px;
    letter-spacing: 8px;
  }
}

@media (max-width: 600px) {
  .theatre-card {
    width: 120px;
    height: 180px;
  }
  
  .card-title {
    font-size: 18px !important;
  }
  
  .header-title {
    font-size: 32px;
    letter-spacing: 5px;
  }
  
  .header-subtitle {
    font-size: 12px;
    letter-spacing: 4px;
  }
}
</style>
