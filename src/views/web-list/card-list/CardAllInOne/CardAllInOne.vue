<template>
  <section ref="sectionRef" class="allinone-section">
    <!-- 背景网格 -->
    <div class="grid-bg"></div>

    <!-- 顶部标题 -->
    <header ref="headerRef" class="allinone-header">
      <div class="header-badge">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2"/>
          <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2"/>
          <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2"/>
        </svg>
      </div>

      <div class="title-wrapper">
        <h1 class="title-line">全能动画</h1>
        <h1 class="title-line title-accent">卡片集合</h1>
      </div>

      <p class="header-subtitle">12 Amazing Scroll Animations</p>

      <div class="header-decoration">
        <span class="deco-line"></span>
        <span class="deco-dot"></span>
        <span class="deco-line"></span>
      </div>
    </header>

    <!-- 卡片网格 - 4列3行 -->
    <div class="cards-grid">
      <!-- 卡片1: 从两边边缘进入 + 位移 -->
      <div class="allinone-card card-01" data-index="0">
        <div class="card-glow"></div>
        <div class="card-content">
          <span class="card-num">01</span>
          <h3 class="card-title">边缘位移</h3>
          <p class="card-desc">从两边边缘进入，滚动时位移消失</p>
        </div>
      </div>

      <!-- 卡片2: 渐变出来 + 渐变 -->
      <div class="allinone-card card-02" data-index="1">
        <div class="card-glow"></div>
        <div class="card-content">
          <span class="card-num">02</span>
          <h3 class="card-title">渐变消失</h3>
          <p class="card-desc">从透明渐变出现，滚动时渐变消失</p>
        </div>
      </div>

      <!-- 卡片3: 形变出来 + 形变 -->
      <div class="allinone-card card-03" data-index="2">
        <div class="card-glow"></div>
        <div class="card-content">
          <span class="card-num">03</span>
          <h3 class="card-title">形变效果</h3>
          <p class="card-desc">从椭圆形变出现，滚动时持续形变</p>
        </div>
      </div>

      <!-- 卡片4: 淡入淡出 + 淡出 -->
      <div class="allinone-card card-04" data-index="3">
        <div class="card-glow"></div>
        <div class="card-content">
          <span class="card-num">04</span>
          <h3 class="card-title">淡入淡出</h3>
          <p class="card-desc">淡入展示，滚动时淡出消失</p>
        </div>
      </div>

      <!-- 卡片5: 旋转进入 + 旋转 -->
      <div class="allinone-card card-05" data-index="4">
        <div class="card-glow"></div>
        <div class="card-content">
          <span class="card-num">05</span>
          <h3 class="card-title">旋转动画</h3>
          <p class="card-desc">旋转入场，滚动时持续旋转</p>
        </div>
      </div>

      <!-- 卡片6: 缩放进入 + 缩放 -->
      <div class="allinone-card card-06" data-index="5">
        <div class="card-glow"></div>
        <div class="card-content">
          <span class="card-num">06</span>
          <h3 class="card-title">缩放效果</h3>
          <p class="card-desc">缩放入场，滚动时缩放消失</p>
        </div>
      </div>

      <!-- 卡片7: 位移进入 + 位移 -->
      <div class="allinone-card card-07" data-index="6">
        <div class="card-glow"></div>
        <div class="card-content">
          <span class="card-num">07</span>
          <h3 class="card-title">位移效果</h3>
          <p class="card-desc">从底部位移进入，滚动时位移消失</p>
        </div>
      </div>

      <!-- 卡片8: 旋转缩放位移 + 旋转缩放位移 -->
      <div class="allinone-card card-08" data-index="7">
        <div class="card-glow"></div>
        <div class="card-content">
          <span class="card-num">08</span>
          <h3 class="card-title">旋转缩放位移</h3>
          <p class="card-desc">组合动画入场，三重效果组合</p>
        </div>
      </div>

      <!-- 卡片9: 位移旋转缩放 + 位移旋转缩放 -->
      <div class="allinone-card card-09" data-index="8">
        <div class="card-glow"></div>
        <div class="card-content">
          <span class="card-num">09</span>
          <h3 class="card-title">位移旋转缩放</h3>
          <p class="card-desc">不同顺序的组合动画</p>
        </div>
      </div>

      <!-- 卡片10: 位移旋转缩放渐变 + 位移旋转缩放渐变 -->
      <div class="allinone-card card-10" data-index="9">
        <div class="card-glow"></div>
        <div class="card-content">
          <span class="card-num">10</span>
          <h3 class="card-title">位移旋转缩放渐变</h3>
          <p class="card-desc">四重效果组合动画</p>
        </div>
      </div>

      <!-- 卡片11: 位移旋转缩放渐变旋转缩放位移 + 位移旋转缩放渐变旋转缩放位移 -->
      <div class="allinone-card card-11" data-index="10">
        <div class="card-glow"></div>
        <div class="card-content">
          <span class="card-num">11</span>
          <h3 class="card-title">六重效果组合A</h3>
          <p class="card-desc">位移→旋转→缩放→渐变→旋转→位移</p>
        </div>
      </div>

      <!-- 卡片12: 位移旋转缩放渐变旋转缩放位移旋转缩放渐变 + 位移旋转缩放渐变旋转缩放位移旋转缩放渐变 -->
      <div class="allinone-card card-12" data-index="11">
        <div class="card-glow"></div>
        <div class="card-content">
          <span class="card-num">12</span>
          <h3 class="card-title">九重效果组合</h3>
          <p class="card-desc">最复杂的九重动画组合</p>
        </div>
      </div>
    </div>

    <!-- 底部装饰 -->
    <div ref="footerRef" class="allinone-footer">
      <div class="footer-line"></div>
      <span class="footer-text">12 Amazing Scroll Animations</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Refs
const sectionRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)

// Cleanup functions
let cleanupFns: (() => void)[] = []

// ============================================================
// GSAP 动画
// ============================================================

const initAnimations = () => {
  // 标题入场动画
  if (headerRef.value) {
    const tl = gsap.timeline()

    tl.fromTo('.header-badge',
      { scale: 0, opacity: 0, rotation: -180 },
      { scale: 1, opacity: 1, rotation: 0, duration: 0.6, ease: 'back.out(2)' }
    )
    .fromTo('.title-line:first-child',
      { x: -200, opacity: 0, rotationY: -90 },
      { x: 0, opacity: 1, rotationY: 0, duration: 0.8, ease: 'power3.out' },
      '-=0.3'
    )
    .fromTo('.title-line:last-child',
      { x: 200, opacity: 0, rotationY: 90 },
      { x: 0, opacity: 1, rotationY: 0, duration: 0.8, ease: 'power3.out' },
      '<'
    )
    .fromTo('.header-subtitle',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
      '-=0.3'
    )
    .fromTo('.deco-line',
      { scaleX: 0 },
      { scaleX: 1, duration: 0.4, stagger: 0.1, ease: 'power2.inOut' },
      '-=0.2'
    )
    .fromTo('.deco-dot',
      { scale: 0 },
      { scale: 1, duration: 0.3, ease: 'back.out(3)' },
      '-=0.2'
    )

    cleanupFns.push(() => tl.kill())
  }

  // 12张卡片的不同入场动画
  const cards = document.querySelectorAll('.allinone-card')
  
  // 卡片1: 从两边边缘进入（左侧滑入）
  gsap.fromTo(cards[0],
    { x: -200, opacity: 0 },
    { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.4 }
  )

  // 卡片2: 渐变出来
  gsap.fromTo(cards[1],
    { opacity: 0, filter: 'brightness(2) blur(10px)' },
    { opacity: 1, filter: 'brightness(1) blur(0px)', duration: 1, ease: 'power2.out', delay: 0.5 }
  )

  // 卡片3: 形变出来（从椭圆形变）
  gsap.fromTo(cards[2],
    { scaleX: 0.3, scaleY: 0.7, borderRadius: '50%' },
    { scaleX: 1, scaleY: 1, borderRadius: '16px', duration: 1, ease: 'elastic.out(1, 0.6)', delay: 0.55 }
  )

  // 卡片4: 淡入淡出
  gsap.fromTo(cards[3],
    { opacity: 0 },
    { opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.6 }
  )

  // 卡片5: 旋转进入
  gsap.fromTo(cards[4],
    { rotation: -180, opacity: 0 },
    { rotation: 0, opacity: 1, duration: 1, ease: 'back.out(1.5)', delay: 0.65 }
  )

  // 卡片6: 缩放进入
  gsap.fromTo(cards[5],
    { scale: 0, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(2)', delay: 0.7 }
  )

  // 卡片7: 位移进入（从下方）
  gsap.fromTo(cards[6],
    { y: 150, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.75 }
  )

  // 卡片8: 旋转缩放位移（从右上角）
  gsap.fromTo(cards[7],
    { x: 150, y: -150, rotation: 90, scale: 0.5 },
    { x: 0, y: 0, rotation: 0, scale: 1, duration: 1, ease: 'power3.out', delay: 0.8 }
  )

  // 卡片9: 位移旋转缩放（从左下角，不同顺序）
  gsap.fromTo(cards[8],
    { x: -150, y: 150, scale: 1.5, rotation: -45 },
    { x: 0, y: 0, scale: 1, rotation: 0, duration: 1, ease: 'power3.out', delay: 0.85 }
  )

  // 卡片10: 位移旋转缩放渐变（从下方，完整组合）
  gsap.fromTo(cards[9],
    { y: 200, rotation: -30, scale: 0.5, opacity: 0 },
    { y: 0, rotation: 0, scale: 1, opacity: 1, duration: 1.2, ease: 'power3.out', delay: 0.9 }
  )

  // 卡片11: 六重效果组合A（从右边）
  gsap.fromTo(cards[10],
    { x: 300, rotation: 45, scale: 0.3, opacity: 0, skewX: 30 },
    { x: 0, rotation: 0, scale: 1, opacity: 1, skewX: 0, duration: 1.4, ease: 'elastic.out(1, 0.5)', delay: 0.95 }
  )

  // 卡片12: 九重效果组合（从上方）
  gsap.fromTo(cards[11],
    { y: -300, rotationX: 90, rotation: 720, scale: 0, opacity: 0 },
    { y: 0, rotationX: 0, rotation: 0, scale: 1, opacity: 1, duration: 1.6, ease: 'elastic.out(1, 0.4)', delay: 1 }
  )

  // 底部装饰入场
  if (footerRef.value) {
    gsap.fromTo(footerRef.value,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', delay: 1.5 }
    )
  }

  // 滚动动画 - 每张卡片不同的滚动效果
  if (sectionRef.value) {
    // 卡片1: 位移消失（向上）
    gsap.to(cards[0], {
      y: -200,
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5
      }
    })

    // 卡片2: 渐变消失
    gsap.to(cards[1], {
      opacity: 0,
      filter: 'blur(20px)',
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5
      }
    })

    // 卡片3: 形变消失（变回椭圆形）
    gsap.to(cards[2], {
      scaleX: 0.5,
      scaleY: 0.3,
      borderRadius: '50%',
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5
      }
    })

    // 卡片4: 淡出消失
    gsap.to(cards[3], {
      opacity: 0,
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5
      }
    })

    // 卡片5: 旋转消失
    gsap.to(cards[4], {
      rotation: 360,
      opacity: 0,
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5
      }
    })

    // 卡片6: 缩放消失
    gsap.to(cards[5], {
      scale: 0,
      opacity: 0,
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5
      }
    })

    // 卡片7: 位移消失（向右）
    gsap.to(cards[6], {
      x: 200,
      y: -100,
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5
      }
    })

    // 卡片8: 旋转缩放位移消失
    gsap.to(cards[7], {
      y: -150,
      rotation: 180,
      scale: 0.5,
      x: -100,
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5
      }
    })

    // 卡片9: 位移旋转缩放消失
    gsap.to(cards[8], {
      y: -150,
      x: 100,
      rotation: -180,
      scale: 0.5,
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5
      }
    })

    // 卡片10: 位移旋转缩放渐变消失
    gsap.to(cards[9], {
      y: -200,
      rotation: 180,
      scale: 0.3,
      opacity: 0,
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5
      }
    })

    // 卡片11: 六重效果消失
    gsap.to(cards[10], {
      y: -250,
      x: 150,
      rotation: 360,
      scale: 0.2,
      skewX: 45,
      opacity: 0,
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5
      }
    })

    // 卡片12: 九重效果消失
    gsap.to(cards[11], {
      y: -300,
      x: -200,
      rotationX: 180,
      rotation: 1080,
      scale: 0,
      opacity: 0,
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5
      }
    })

    // 标题滚动消失
    if (headerRef.value) {
      gsap.to(headerRef.value, {
        y: -150,
        opacity: 0,
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top top',
          end: '30% top',
          scrub: 1
        }
      })
    }

    // 底部装饰滚动消失
    if (footerRef.value) {
      gsap.to(footerRef.value, {
        y: 100,
        opacity: 0,
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top top',
          end: '50% top',
          scrub: 1
        }
      })
    }
  }
}

// ============================================================
// 生命周期
// ============================================================

onMounted(() => {
  // 延迟初始化以确保懒加载时 DOM 已完全渲染
  setTimeout(initAnimations, 100)
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style lang="scss" scoped>
.allinone-section {
  position: relative;
  width: 100vw;
  min-height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #0a0a14 0%, #1a1a2e 50%, #0f0f23 100%);
  padding: 80px 60px;
}

// ============================================================
// 背景网格
// ============================================================

.grid-bg {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(139, 92, 246, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(139, 92, 246, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
}

// ============================================================
// 头部标题
// ============================================================

.allinone-header {
  text-align: center;
  margin-bottom: 60px;
  perspective: 1000px;
}

.header-badge {
  width: 60px;
  height: 60px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #8b5cf6, #06b6d4);
  border-radius: 16px;
  color: #fff;
  box-shadow: 0 10px 40px rgba(139, 92, 246, 0.4);

  svg {
    width: 32px;
    height: 32px;
  }
}

.title-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title-line {
  font-size: 48px;
  font-weight: 900;
  letter-spacing: 6px;
  color: #fff;
  margin: 0;
  line-height: 1.1;

  &.title-accent {
    font-size: 64px;
    background: linear-gradient(90deg, #8b5cf6, #06b6d4, #f472b6);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-top: -5px;
  }
}

.header-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 4px;
  margin-top: 20px;
}

.header-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 24px;

  .deco-line {
    width: 80px;
    height: 2px;
    background: linear-gradient(90deg, transparent, #8b5cf6, transparent);
    transform-origin: center;
  }

  .deco-dot {
    width: 8px;
    height: 8px;
    background: #8b5cf6;
    border-radius: 50%;
    box-shadow: 0 0 10px #8b5cf6;
  }
}

// ============================================================
// 卡片网格
// ============================================================

.cards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

// ============================================================
// 卡片样式
// ============================================================

.allinone-card {
  position: relative;
  padding: 24px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  cursor: pointer;
  transform-style: preserve-3d;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-8px) rotateX(5deg) rotateY(-5deg);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);

    .card-glow {
      opacity: 1;
    }
  }

  // 不同卡片的发光颜色
  &.card-01 { .card-glow { background: radial-gradient(circle, rgba(239, 68, 68, 0.4), transparent 70%); } .card-num { color: #ef4444; } }
  &.card-02 { .card-glow { background: radial-gradient(circle, rgba(249, 115, 22, 0.4), transparent 70%); } .card-num { color: #f97316; } }
  &.card-03 { .card-glow { background: radial-gradient(circle, rgba(234, 179, 8, 0.4), transparent 70%); } .card-num { color: #eab308; } }
  &.card-04 { .card-glow { background: radial-gradient(circle, rgba(34, 197, 94, 0.4), transparent 70%); } .card-num { color: #22c55e; } }
  &.card-05 { .card-glow { background: radial-gradient(circle, rgba(6, 182, 212, 0.4), transparent 70%); } .card-num { color: #06b6d4; } }
  &.card-06 { .card-glow { background: radial-gradient(circle, rgba(59, 130, 246, 0.4), transparent 70%); } .card-num { color: #3b82f6; } }
  &.card-07 { .card-glow { background: radial-gradient(circle, rgba(139, 92, 246, 0.4), transparent 70%); } .card-num { color: #8b5cf6; } }
  &.card-08 { .card-glow { background: radial-gradient(circle, rgba(168, 85, 247, 0.4), transparent 70%); } .card-num { color: #a855f7; } }
  &.card-09 { .card-glow { background: radial-gradient(circle, rgba(236, 72, 153, 0.4), transparent 70%); } .card-num { color: #ec4899; } }
  &.card-10 { .card-glow { background: radial-gradient(circle, rgba(244, 63, 94, 0.4), transparent 70%); } .card-num { color: #f43f5e; } }
  &.card-11 { .card-glow { background: radial-gradient(circle, rgba(225, 29, 72, 0.4), transparent 70%); } .card-num { color: #e11d48; } }
  &.card-12 { .card-glow { background: radial-gradient(circle, rgba(99, 102, 241, 0.4), transparent 70%); } .card-num { color: #6366f1; } }
}

.card-glow {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  border-radius: inherit;
}

.card-content {
  position: relative;
  z-index: 1;
}

.card-num {
  font-size: 36px;
  font-weight: 900;
  opacity: 0.3;
  line-height: 1;
  margin-bottom: 8px;
  display: block;
}

.card-title {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
}

.card-desc {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.5;
}

// ============================================================
// 底部装饰
// ============================================================

.allinone-footer {
  text-align: center;
  margin-top: 60px;
}

.footer-line {
  width: 200px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #8b5cf6, transparent);
  margin: 0 auto 16px;
}

.footer-text {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.3);
  letter-spacing: 3px;
  text-transform: uppercase;
}

// ============================================================
// 响应式
// ============================================================

@media (max-width: 1200px) {
  .cards-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .title-line {
    font-size: 36px;
    &.title-accent { font-size: 48px; }
  }
}

@media (max-width: 600px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }

  .allinone-section {
    padding: 60px 20px;
  }
}
</style>
