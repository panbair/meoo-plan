<template>
  <div ref="sectionRef" class="card-drawer-section">
    <!-- 背景装饰 -->
    <div class="drawer-ambient">
      <div class="ambient-grid"></div>
      <div class="ambient-glow glow-1"></div>
      <div class="ambient-glow glow-2"></div>
    </div>
    
    <!-- 标题区域 -->
    <div ref="headerRef" class="drawer-header">
      <div ref="badgeRef" class="header-badge">
        <span class="badge-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
          </svg>
        </span>
        <span class="badge-text">MEMORY DRAWER</span>
      </div>
      <h2 ref="titleRef" class="header-title">记忆抽屉</h2>
      <p ref="subtitleRef" class="header-subtitle">3D 景深拉出 · 档案展示</p>
    </div>
    
    <!-- 抽屉画廊 -->
    <div ref="drawerGalleryRef" class="drawer-gallery">
      <div
        v-for="(card, i) in archiveCards"
        :key="'drawer-card-' + i"
        :ref="el => cardRefs.set(i, el as HTMLElement)"
        class="drawer-card"
        :style="{ '--card-hue': card.hue, '--card-depth': card.depth, '--card-index': i }"
      >
        <!-- 卡片标签 -->
        <div class="card-tab">
          <span class="tab-icon" v-html="card.icon"></span>
          <span class="tab-label">{{ card.tab }}</span>
        </div>
        
        <!-- 卡片主体 -->
        <div class="card-body">
          <div class="card-header">
            <div class="card-folder-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <div class="card-status">
              <span class="status-dot"></span>
              <span class="status-text">{{ card.status }}</span>
            </div>
          </div>
          
          <div class="card-content">
            <h3 class="card-title">{{ card.title }}</h3>
            <p class="card-desc">{{ card.desc }}</p>
          </div>
          
          <div class="card-footer">
            <div class="card-date">{{ card.date }}</div>
            <div class="card-tag">{{ card.tag }}</div>
          </div>
        </div>
        
        <!-- 卡片阴影层 -->
        <div class="card-shadow"></div>
      </div>
    </div>
    
    <!-- 底部提示 -->
    <div ref="footerRef" class="drawer-footer">
      <span>滚动以拉出每一份记忆</span>
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
const drawerGalleryRef = ref<HTMLElement | null>(null)
const cardRefs = ref(new Map<number, HTMLElement>())

// 数据
const archiveCards = [
  {
    tab: '计划',
    title: '项目计划',
    desc: '未来发展的蓝图与路线图',
    date: '2024.03',
    tag: '战略',
    hue: 210,
    depth: 0,
    status: '进行中',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12l2 2 4-4"/></svg>'
  },
  {
    tab: '实验',
    title: '实验数据',
    desc: '探索未知的数据宝藏',
    date: '2024.06',
    tag: '研发',
    hue: 280,
    depth: 1,
    status: '已归档',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 3h6v4l3 9H6l3-9V3z"/><path d="M6 16h12"/></svg>'
  },
  {
    tab: '报告',
    title: '年度报告',
    desc: '年度总结与未来展望',
    date: '2024.12',
    tag: '总结',
    hue: 40,
    depth: 2,
    status: '已完成',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></svg>'
  },
  {
    tab: '档案',
    title: '个人档案',
    desc: '珍藏的记忆与经历',
    date: '2025.01',
    tag: '个人',
    hue: 160,
    depth: 3,
    status: '私密',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
  },
  {
    tab: '灵感',
    title: '创意笔记',
    desc: '灵感闪现的记录',
    date: '2025.02',
    tag: '创意',
    hue: 330,
    depth: 4,
    status: '收集中',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>'
  }
]

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
  
  // 抽屉卡片动画
  setupDrawerAnimation()
  
  // 滚动效果
  setupScrollEffects()
}

// 抽屉动画
const setupDrawerAnimation = () => {
  nextTick(() => {
    if (!drawerGalleryRef.value) return
    
    const cards = drawerGalleryRef.value.querySelectorAll('.drawer-card')
    
    cards.forEach((card, i) => {
      // 初始状态：向左后方旋转，并向下沉，产生抽屉拉出感
      gsap.set(card, {
        rotateY: -35,
        rotateX: 5,
        z: -120,
        y: 60,
        opacity: 0,
        scale: 0.85
      })
      
      // 滚动触发动画
      const drawerST = ScrollTrigger.create({
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
        onEnter: () => {
          gsap.to(card, {
            rotateY: 0,
            rotateX: 0,
            z: 0,
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            delay: i * 0.1,
            ease: 'power3.out',
            onComplete: () => {
              // 入场后添加悬停效果
              setupCardHover(card as HTMLElement)
            }
          })
        },
        onLeaveBack: () => {
          gsap.to(card, {
            rotateY: -35,
            rotateX: 5,
            z: -120,
            y: 60,
            opacity: 0,
            scale: 0.85,
            duration: 0.5,
            ease: 'power2.in'
          })
        }
      })
      
      cleanupFns.push(() => drawerST.kill())
    })
  })
}

// 卡片悬停效果
const setupCardHover = (card: HTMLElement) => {
  if (!card) return
  
  card.addEventListener('mouseenter', () => {
    gsap.to(card, {
      y: -15,
      rotateY: 5,
      scale: 1.03,
      duration: 0.4,
      ease: 'power2.out'
    })
  })
  
  card.addEventListener('mouseleave', () => {
    gsap.to(card, {
      y: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.5,
      ease: 'elastic.out(1, 0.5)'
    })
  })
  
  card.addEventListener('mousemove', (e: Event) => {
    const mouseEvent = e as MouseEvent
    const rect = card.getBoundingClientRect()
    const x = (mouseEvent.clientX - rect.left) / rect.width - 0.5
    const y = (mouseEvent.clientY - rect.top) / rect.height - 0.5
    
    gsap.to(card, {
      rotateY: x * 15,
      rotateX: -y * 10,
      duration: 0.3,
      ease: 'power2.out'
    })
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
  const glows = sectionRef.value?.querySelectorAll('.ambient-glow')
  if (glows) {
    gsap.to(glows[0], {
      x: 50,
      y: 30,
      scale: 1.2,
      duration: 8,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    })
    gsap.to(glows[1], {
      x: -40,
      y: -30,
      scale: 1.3,
      duration: 10,
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
  
  // 清理 ScrollTrigger
  ScrollTrigger.getAll().forEach(st => {
    if (st.vars.trigger && sectionRef.value?.contains(st.vars.trigger as Element)) {
      st.kill()
    }
  })
})
</script>

<style scoped lang="scss">
.card-drawer-section {
  position: relative;
  width: 100vw;
  min-height: 100vh;
  background: linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 30%, #16213e 60%, #0f0f1a 100%);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

// 背景装饰
.drawer-ambient {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.ambient-grid {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(139, 92, 246, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(139, 92, 246, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
}

.ambient-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.3;
}

.glow-1 {
  width: 500px;
  height: 500px;
  top: -100px;
  left: -100px;
  background: radial-gradient(circle, hsla(210, 70%, 50%, 0.5) 0%, transparent 70%);
}

.glow-2 {
  width: 400px;
  height: 400px;
  bottom: -50px;
  right: -50px;
  background: radial-gradient(circle, hsla(280, 60%, 50%, 0.4) 0%, transparent 70%);
}

// 标题区域
.drawer-header {
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
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(99, 102, 241, 0.1) 100%);
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

// 抽屉画廊
.drawer-gallery {
  position: relative;
  z-index: 10;
  display: flex;
  flex-wrap: wrap;
  gap: 35px;
  justify-content: center;
  padding: 20px;
  perspective: 1200px;
  perspective-origin: center center;
  transform-style: preserve-3d;
}

// 抽屉卡片
.drawer-card {
  position: relative;
  width: 200px;
  height: 280px;
  transform-style: preserve-3d;
  cursor: pointer;
  will-change: transform;
  
  // 卡片标签
  .card-tab {
    position: absolute;
    top: -15px;
    left: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: linear-gradient(135deg, 
      hsla(var(--card-hue), 60%, 45%, 0.9) 0%, 
      hsla(var(--card-hue), 50%, 35%, 0.95) 100%
    );
    border-radius: 8px 8px 0 0;
    color: white;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 1px;
    box-shadow: 
      0 -4px 15px hsla(var(--card-hue), 60%, 40%, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
    z-index: 5;
    
    .tab-icon {
      width: 14px;
      height: 14px;
      opacity: 0.9;
      
      :deep(svg) {
        width: 100%;
        height: 100%;
      }
    }
  }
  
  // 卡片主体
  .card-body {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 12px;
    background: linear-gradient(145deg, 
      rgba(30, 30, 50, 0.95) 0%, 
      rgba(20, 20, 35, 0.98) 100%
    );
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    padding: 30px 20px 20px;
    display: flex;
    flex-direction: column;
    z-index: 2;
    box-shadow: 
      0 20px 50px rgba(0, 0, 0, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
    transition: box-shadow 0.3s;
  }
  
  // 卡片头部
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    
    .card-folder-icon {
      width: 32px;
      height: 32px;
      color: hsla(var(--card-hue), 70%, 60%, 1);
      opacity: 0.7;
      
      svg {
        width: 100%;
        height: 100%;
      }
    }
    
    .card-status {
      display: flex;
      align-items: center;
      gap: 6px;
      
      .status-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: hsla(var(--card-hue), 70%, 60%, 1);
        box-shadow: 0 0 8px hsla(var(--card-hue), 70%, 60%, 0.6);
      }
      
      .status-text {
        font-size: 10px;
        color: rgba(255, 255, 255, 0.5);
        letter-spacing: 1px;
      }
    }
  }
  
  // 卡片内容
  .card-content {
    flex: 1;
    
    .card-title {
      font-size: 20px;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.95);
      letter-spacing: 3px;
      margin-bottom: 12px;
      text-shadow: 0 0 20px hsla(var(--card-hue), 60%, 50%, 0.3);
    }
    
    .card-desc {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.45);
      line-height: 1.6;
      letter-spacing: 0.5px;
    }
  }
  
  // 卡片底部
  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 15px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    
    .card-date {
      font-family: 'Orbitron', monospace;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.4);
      letter-spacing: 1px;
    }
    
    .card-tag {
      padding: 4px 10px;
      background: hsla(var(--card-hue), 60%, 50%, 0.2);
      border: 1px solid hsla(var(--card-hue), 60%, 50%, 0.3);
      border-radius: 12px;
      font-size: 10px;
      color: hsla(var(--card-hue), 70%, 70%, 1);
      letter-spacing: 1px;
    }
  }
  
  // 阴影层
  .card-shadow {
    position: absolute;
    inset: 0;
    border-radius: 12px;
    background: transparent;
    box-shadow: 
      0 30px 60px rgba(0, 0, 0, 0.4),
      0 15px 30px rgba(0, 0, 0, 0.3);
    transform: translateZ(-30px);
    z-index: 1;
    pointer-events: none;
  }
  
  // 悬停效果
  &:hover {
    .card-body {
      border-color: rgba(255, 255, 255, 0.2);
      box-shadow: 
        0 30px 70px rgba(0, 0, 0, 0.6),
        0 0 40px hsla(var(--card-hue), 60%, 40%, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.12);
    }
    
    .card-shadow {
      box-shadow: 
        0 40px 80px rgba(0, 0, 0, 0.5),
        0 20px 40px rgba(0, 0, 0, 0.4),
        0 0 60px hsla(var(--card-hue), 60%, 40%, 0.2);
    }
  }
}

// 底部信息
.drawer-footer {
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
  .drawer-gallery {
    gap: 30px;
  }
  
  .drawer-card {
    width: 180px;
    height: 250px;
  }
  
  .header-title {
    font-size: 40px;
    letter-spacing: 8px;
  }
}

@media (max-width: 600px) {
  .drawer-card {
    width: 160px;
    height: 220px;
  }
  
  .card-title {
    font-size: 16px !important;
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
