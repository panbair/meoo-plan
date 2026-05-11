<template>
  <div ref="sectionRef" class="card-book-section">
    <!-- 背景装饰 -->
    <div class="book-ambient">
      <div class="ambient-particles"></div>
      <div class="ambient-glow glow-1"></div>
      <div class="ambient-glow glow-2"></div>
    </div>
    
    <!-- 标题区域 -->
    <div ref="headerRef" class="book-header">
      <div ref="badgeRef" class="header-badge">
        <span class="badge-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
        </span>
        <span class="badge-text">TIME BOOK</span>
      </div>
      <h2 ref="titleRef" class="header-title">时光翻阅</h2>
      <p ref="subtitleRef" class="header-subtitle">堆叠卡片的逐张揭示</p>
    </div>
    
    <!-- 堆叠书本容器 -->
    <div ref="bookContainerRef" class="book-container">
      <div ref="stackBookRef" class="stack-book">
        <div
          v-for="(chapter, i) in chapters"
          :key="'chapter-' + i"
          :ref="el => chapterRefs.set(i, el as HTMLElement)"
          class="stack-card"
          :style="{ '--chapter-hue': chapter.hue, '--z-index': chapters.length - i }"
        >
          <!-- 章节编号 -->
          <div class="card-number">{{ String(i + 1).padStart(2, '0') }}</div>
          
          <!-- 卡片装饰 -->
          <div class="card-decor">
            <div class="decor-line top"></div>
            <div class="decor-line bottom"></div>
          </div>
          
          <!-- 卡片内容 -->
          <div class="card-content">
            <div class="card-icon" v-html="chapter.icon"></div>
            <h3 class="card-title">{{ chapter.title }}</h3>
            <p class="card-chapter">{{ chapter.chapter }}</p>
            <p class="card-desc">{{ chapter.desc }}</p>
          </div>
          
          <!-- 卡片页码 -->
          <div class="card-page">{{ i + 1 }} / {{ chapters.length }}</div>
          
          <!-- 卡片边框 -->
          <div class="card-border"></div>
        </div>
      </div>
      
      <!-- 进度指示器 -->
      <div class="book-progress">
        <div
          v-for="(chapter, i) in chapters"
          :key="'progress-' + i"
          :ref="el => progressRefs.set(i, el as HTMLElement)"
          class="progress-dot"
          :class="{ active: i === 0 }"
        ></div>
      </div>
    </div>
    
    <!-- 底部提示 -->
    <div ref="footerRef" class="book-footer">
      <span>向下滚动翻阅时光</span>
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
const bookContainerRef = ref<HTMLElement | null>(null)
const stackBookRef = ref<HTMLElement | null>(null)
const chapterRefs = ref(new Map<number, HTMLElement>())
const progressRefs = ref(new Map<number, HTMLElement>())

// 数据
const chapters = [
  {
    chapter: '第一章',
    title: '启程',
    desc: '怀揣梦想，踏上未知的旅途',
    hue: 200,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>'
  },
  {
    chapter: '第二章',
    title: '迷雾',
    desc: '在迷雾中探索，寻找方向',
    hue: 260,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2v2m0 16v2M4 12H2m20 0h-2m-2.93-7.07l-1.41 1.41m-9.32 9.32l-1.41 1.41m0-12.14l1.41 1.41m9.32 9.32l1.41 1.41M12 8a4 4 0 100 8 4 4 0 000-8z"/></svg>'
  },
  {
    chapter: '第三章',
    title: '觉醒',
    desc: '顿悟时刻，发现真正的力量',
    hue: 45,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/></svg>'
  },
  {
    chapter: '第四章',
    title: '巅峰',
    desc: '登顶望远，一览众山小',
    hue: 30,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 21l4-10 4 10M12 11V3M3 17l6-6 4 4 8-8"/></svg>'
  },
  {
    chapter: '终章',
    title: '新生',
    desc: '破茧成蝶，迎接全新开始',
    hue: 150,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 6v6l4 2"/></svg>'
  }
]

// 堆叠书本滚动动画
let bookTimeline: gsap.core.Timeline | null = null

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
  
  // 堆叠书本动画
  setupStackAnimation()
  
  // 滚动效果
  setupScrollEffects()
}

// 堆叠书本动画
const setupStackAnimation = () => {
  nextTick(() => {
    if (!stackBookRef.value) return
    
    const cards = stackBookRef.value.querySelectorAll('.stack-card')
    if (cards.length === 0) return
    
    // 设置初始状态
    gsap.set(cards, {
      x: 0,
      y: 0,
      scale: 1,
      rotate: 0,
      opacity: 1,
      zIndex: (i: number) => chapters.length - i
    })
    
    // 创建堆叠翻页时间线
    bookTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: stackBookRef.value,
        start: 'top top',
        end: `+=${chapters.length * 150}%`, // 每张卡片对应 150% 滚动距离
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          // 更新进度指示器
          updateProgress(self.progress)
        }
      }
    })
    
    // 每张卡片依次翻走
    cards.forEach((card, i) => {
      if (i === cards.length - 1) return // 最后一张保留
      
      bookTimeline!.to(card, {
        x: -250,
        y: -50,
        scale: 0.7,
        rotate: -12,
        opacity: 0,
        ease: 'power2.inOut',
        duration: 1
      }, i * 1)
    })
    
    cleanupFns.push(() => bookTimeline?.kill())
  })
}

// 更新进度指示器
const updateProgress = (progress: number) => {
  const cardCount = chapters.length
  const activeIndex = Math.min(Math.floor(progress * cardCount), cardCount - 1)
  
  progressRefs.value.forEach((dot, i) => {
    if (dot) {
      dot.classList.toggle('active', i === activeIndex)
    }
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
  
  // 背景光晕动画
  if (sectionRef.value) {
    const glows = sectionRef.value.querySelectorAll('.ambient-glow')
    gsap.to(glows[0], {
      x: 60,
      y: 40,
      scale: 1.3,
      duration: 10,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    })
    gsap.to(glows[1], {
      x: -50,
      y: -40,
      scale: 1.2,
      duration: 12,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    })
  }
}

onMounted(() => {
  // 延迟初始化以确保懒加载时 DOM 已完全渲染
  setTimeout(initAnimations, 100)
})

onUnmounted(() => {
  // 清理所有动画
  cleanupFns.forEach(fn => fn())
  
  // 清理时间线
  if (bookTimeline) {
    bookTimeline.kill()
  }
  
  // 清理 ScrollTrigger
  ScrollTrigger.getAll().forEach(st => {
    if (st.vars.trigger && sectionRef.value?.contains(st.vars.trigger as Element)) {
      st.kill()
    }
  })
})
</script>

<style scoped lang="scss">
.card-book-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(180deg, #0c0c14 0%, #141428 30%, #1a1a35 50%, #0f0f1f 100%);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

// 背景装饰
.book-ambient {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.ambient-particles {
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(236, 72, 153, 0.05) 0%, transparent 50%);
}

.ambient-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(150px);
  opacity: 0.25;
}

.glow-1 {
  width: 600px;
  height: 600px;
  top: -200px;
  left: -150px;
  background: radial-gradient(circle, hsla(200, 70%, 50%, 0.5) 0%, transparent 70%);
}

.glow-2 {
  width: 500px;
  height: 500px;
  bottom: -150px;
  right: -100px;
  background: radial-gradient(circle, hsla(260, 60%, 50%, 0.4) 0%, transparent 70%);
}

// 标题区域
.book-header {
  position: absolute;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  text-align: center;
}

.header-badge {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 10px 28px;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(99, 102, 241, 0.08) 100%);
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
    color: #a78bfa;
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
  font-size: 42px;
  font-weight: 900;
  letter-spacing: 10px;
  margin-bottom: 12px;
  background: linear-gradient(135deg, #fff 0%, #ddd6fe 35%, #a78bfa 65%, #818cf8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 30px rgba(167, 139, 250, 0.4));
}

.header-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.45);
  letter-spacing: 6px;
}

// 书本容器
.book-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
}

// 堆叠书本
.stack-book {
  position: relative;
  width: 320px;
  height: 420px;
  perspective: 1500px;
}

// 堆叠卡片
.stack-card {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  background: linear-gradient(145deg, 
    rgba(25, 25, 45, 0.98) 0%, 
    rgba(15, 15, 30, 0.99) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 
    0 25px 60px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  will-change: transform, opacity;
  transform-style: preserve-3d;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow 0.3s;
  
  // 章节编号
  .card-number {
    position: absolute;
    top: 25px;
    left: 30px;
    font-family: 'Orbitron', monospace;
    font-size: 14px;
    font-weight: 700;
    color: hsla(var(--chapter-hue), 70%, 60%, 0.6);
    letter-spacing: 2px;
  }
  
  // 装饰线
  .card-decor {
    position: absolute;
    inset: 20px;
    pointer-events: none;
    
    .decor-line {
      position: absolute;
      width: 50px;
      height: 2px;
      background: linear-gradient(90deg, hsla(var(--chapter-hue), 70%, 60%, 0.6), transparent);
      
      &.top {
        top: 0;
        left: 0;
      }
      
      &.bottom {
        bottom: 0;
        right: 0;
        background: linear-gradient(270deg, hsla(var(--chapter-hue), 70%, 60%, 0.6), transparent);
      }
    }
  }
  
  // 卡片内容
  .card-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 40px;
    z-index: 2;
  }
  
  .card-icon {
    width: 80px;
    height: 80px;
    margin-bottom: 30px;
    color: hsla(var(--chapter-hue), 70%, 60%, 1);
    filter: drop-shadow(0 0 20px hsla(var(--chapter-hue), 70%, 60%, 0.5));
    transition: transform 0.4s, filter 0.4s;
    
    :deep(svg) {
      width: 100%;
      height: 100%;
    }
  }
  
  .card-title {
    font-family: 'Orbitron', sans-serif;
    font-size: 42px;
    font-weight: 900;
    color: rgba(255, 255, 255, 0.95);
    letter-spacing: 12px;
    margin-bottom: 16px;
    text-shadow: 0 0 40px hsla(var(--chapter-hue), 70%, 60%, 0.4);
  }
  
  .card-chapter {
    font-size: 13px;
    color: hsla(var(--chapter-hue), 70%, 65%, 0.8);
    letter-spacing: 4px;
    margin-bottom: 20px;
    text-transform: uppercase;
  }
  
  .card-desc {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.5);
    letter-spacing: 1px;
    line-height: 1.8;
    max-width: 240px;
  }
  
  // 页码
  .card-page {
    position: absolute;
    bottom: 25px;
    right: 30px;
    font-family: 'Orbitron', monospace;
    font-size: 11px;
    color: rgba(255, 255, 255, 0.3);
    letter-spacing: 2px;
  }
  
  // 边框光效
  .card-border {
    position: absolute;
    inset: 0;
    border-radius: 20px;
    border: 2px solid transparent;
    background: linear-gradient(135deg, 
      hsla(var(--chapter-hue), 70%, 60%, 0.4) 0%, 
      hsla(calc(var(--chapter-hue) + 30), 70%, 60%, 0.2) 50%,
      hsla(var(--chapter-hue), 70%, 60%, 0.4) 100%
    ) border-box;
    -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.4s;
    pointer-events: none;
  }
  
  // 悬停效果
  &:hover {
    box-shadow: 
      0 35px 80px rgba(0, 0, 0, 0.6),
      0 0 50px hsla(var(--chapter-hue), 60%, 50%, 0.2);
    
    .card-border {
      opacity: 1;
    }
    
    .card-icon {
      transform: scale(1.1);
      filter: drop-shadow(0 0 30px hsla(var(--chapter-hue), 70%, 60%, 0.8));
    }
  }
}

// 进度指示器
.book-progress {
  display: flex;
  gap: 12px;
  position: relative;
  z-index: 100;
}

.progress-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  cursor: pointer;
  
  &.active {
    background: hsla(260, 70%, 60%, 1);
    box-shadow: 0 0 15px hsla(260, 70%, 60%, 0.6);
    transform: scale(1.3);
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.4);
  }
}

// 底部信息
.book-footer {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  
  span {
    font-size: 11px;
    letter-spacing: 4px;
    color: rgba(255, 255, 255, 0.25);
  }
}

// 响应式
@media (max-width: 768px) {
  .stack-book {
    width: 280px;
    height: 380px;
  }
  
  .card-title {
    font-size: 32px !important;
    letter-spacing: 8px !important;
  }
  
  .card-icon {
    width: 60px !important;
    height: 60px !important;
  }
  
  .header-title {
    font-size: 32px;
    letter-spacing: 6px;
  }
}

@media (max-width: 480px) {
  .stack-book {
    width: 240px;
    height: 340px;
  }
  
  .card-title {
    font-size: 28px !important;
  }
  
  .card-desc {
    font-size: 12px !important;
  }
}
</style>
