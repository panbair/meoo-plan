<template>
  <section ref="sectionRef" class="gradient-wave-section">
    <!-- 多层波浪背景 -->
    <div class="wave-bg">
      <div class="wave wave-1"></div>
      <div class="wave wave-2"></div>
      <div class="wave wave-3"></div>
      <div class="wave wave-4"></div>
    </div>

    <!-- 渐变遮罩 -->
    <div class="gradient-overlay"></div>

    <!-- 内容层 -->
    <div class="content-layer">
      <!-- 顶部标题 -->
      <header ref="headerRef" class="wave-header">
        <div class="header-badge wave-badge">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M2 12C2 12 5 8 12 8C19 8 22 12 22 12C22 12 19 16 12 16C5 16 2 12 2 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M2 6C2 6 5 2 12 2C19 2 22 6 22 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
            <path d="M2 18C2 18 5 22 12 22C19 22 22 18 22 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
          </svg>
        </div>

        <div class="title-lines">
          <h1 class="title-line">渐变波浪</h1>
          <h1 class="title-line title-accent">卡片</h1>
        </div>

        <p class="header-subtitle">Gradient Wave Morphing Cards</p>

        <div class="header-decoration">
          <span class="deco-line"></span>
          <span class="deco-dot"></span>
          <span class="deco-line"></span>
        </div>
      </header>

      <!-- 卡片容器 -->
      <div class="wave-cards">
        <!-- 卡片1: 海洋波浪 -->
        <div class="wave-card card-ocean" data-index="0">
          <div class="card-wave-effect"></div>
          <div class="card-content">
            <div class="card-icon-wrap">
              <svg class="wave-icon" viewBox="0 0 64 64" fill="none">
                <path d="M4 32C10 26 16 38 22 32C28 26 34 38 40 32C46 26 52 38 60 32" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
                <path d="M4 42C10 36 16 48 22 42C28 36 34 48 40 42C46 36 52 48 60 42" stroke="currentColor" stroke-width="3" stroke-linecap="round" opacity="0.6"/>
                <path d="M4 22C10 16 16 28 22 22C28 16 34 28 40 22C46 16 52 28 60 22" stroke="currentColor" stroke-width="3" stroke-linecap="round" opacity="0.6"/>
              </svg>
            </div>
            <div class="card-number">01</div>
            <h3 class="card-title">Ocean Wave</h3>
            <p class="card-desc">深海蓝的波浪律动</p>
            <div class="card-waves">
              <span class="wave-pill">深度 5000m</span>
              <span class="wave-pill">流速 2.5节</span>
            </div>
          </div>
          <div class="card-shine"></div>
        </div>

        <!-- 卡片2: 日落余晖 -->
        <div class="wave-card card-sunset" data-index="1">
          <div class="card-wave-effect"></div>
          <div class="card-content">
            <div class="card-icon-wrap">
              <svg class="wave-icon" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="40" r="16" stroke="currentColor" stroke-width="2"/>
                <path d="M32 20V16M20 40H16M48 40H44M24 26L20 22M40 26L44 22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M4 48H60" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="card-number">02</div>
            <h3 class="card-title">Sunset Glow</h3>
            <p class="card-desc">橙红渐变的温暖</p>
            <div class="card-waves">
              <span class="wave-pill">色温 2700K</span>
              <span class="wave-pill">时长 45min</span>
            </div>
          </div>
          <div class="card-shine"></div>
        </div>

        <!-- 卡片3: 森林迷雾 -->
        <div class="wave-card card-forest" data-index="2">
          <div class="card-wave-effect"></div>
          <div class="card-content">
            <div class="card-icon-wrap">
              <svg class="wave-icon" viewBox="0 0 64 64" fill="none">
                <path d="M32 8L48 40H16L32 8Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                <path d="M32 20L44 44H20L32 20Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" opacity="0.7"/>
                <path d="M32 32L40 48H24L32 32Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" opacity="0.5"/>
                <path d="M32 56V44" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <div class="card-number">03</div>
            <h3 class="card-title">Forest Mist</h3>
            <p class="card-desc">翠绿森林的神秘</p>
            <div class="card-waves">
              <span class="wave-pill">湿度 95%</span>
              <span class="wave-pill">海拔 2000m</span>
            </div>
          </div>
          <div class="card-shine"></div>
        </div>

        <!-- 卡片4: 极光天空 -->
        <div class="wave-card card-aurora" data-index="3">
          <div class="card-wave-effect"></div>
          <div class="card-content">
            <div class="card-icon-wrap">
              <svg class="wave-icon" viewBox="0 0 64 64" fill="none">
                <path d="M8 24C16 20 24 32 32 28C40 24 48 36 56 32" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M8 34C16 30 24 42 32 38C40 34 48 46 56 42" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
                <path d="M8 44C16 40 24 52 32 48C40 44 48 56 56 52" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
                <circle cx="52" cy="12" r="4" fill="currentColor"/>
              </svg>
            </div>
            <div class="card-number">04</div>
            <h3 class="card-title">Aurora Sky</h3>
            <p class="card-desc">紫绿极光的绚烂</p>
            <div class="card-waves">
              <span class="wave-pill">强度 KP7</span>
              <span class="wave-pill">可见 北纬65°</span>
            </div>
          </div>
          <div class="card-shine"></div>
        </div>
      </div>
    </div>

    <!-- 底部装饰 -->
    <div ref="footerRef" class="wave-footer">
      <div class="footer-wave"></div>
      <span class="footer-text">Gradient Wave Visualization</span>
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
  // 标题入场动画 - 从两侧飞入
  if (headerRef.value) {
    const tl = gsap.timeline()

    tl.fromTo('.wave-badge',
      { x: -100, opacity: 0, rotation: -90 },
      { x: 0, opacity: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.5)' }
    )
    .fromTo('.title-line:first-child',
      { x: -150, opacity: 0, rotationY: -45 },
      { x: 0, opacity: 1, rotationY: 0, duration: 0.8, ease: 'power3.out' },
      '-=0.4'
    )
    .fromTo('.title-line:last-child',
      { x: 150, opacity: 0, rotationY: 45 },
      { x: 0, opacity: 1, rotationY: 0, duration: 0.8, ease: 'power3.out' },
      '<'
    )
    .fromTo('.header-subtitle',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
      '-=0.4'
    )
    .fromTo('.deco-line',
      { scaleX: 0 },
      { scaleX: 1, duration: 0.5, stagger: 0.1, ease: 'power2.inOut' },
      '-=0.3'
    )
    .fromTo('.deco-dot',
      { scale: 0 },
      { scale: 1, duration: 0.4, ease: 'back.out(3)' },
      '-=0.3'
    )

    cleanupFns.push(() => tl.kill())
  }

  // 波浪背景入场
  gsap.fromTo('.wave',
    { y: '100%', opacity: 0 },
    { y: '0%', opacity: 1, duration: 1.2, stagger: 0.2, ease: 'power2.out', delay: 0.3 }
  )

  // 卡片入场动画
  const cards = document.querySelectorAll('.wave-card')
  if (cards.length > 0) {
    gsap.set(cards, { opacity: 0, y: 100, scale: 0.8, rotation: 0 })

    const cardTl = gsap.timeline()

    // 卡片1: 从下方升起
    cardTl.to(cards[0],
      { opacity: 1, y: 0, scale: 1, rotation: -3, duration: 0.8, ease: 'power2.out' },
      0.5
    )
    // 卡片2: 从下方升起
    .to(cards[1],
      { opacity: 1, y: 0, scale: 1, rotation: 2, duration: 0.8, ease: 'power2.out' },
      0.65
    )
    // 卡片3: 从下方升起
    .to(cards[2],
      { opacity: 1, y: 0, scale: 1, rotation: -2, duration: 0.8, ease: 'power2.out' },
      0.8
    )
    // 卡片4: 从下方升起
    .to(cards[3],
      { opacity: 1, y: 0, scale: 1, rotation: 3, duration: 0.8, ease: 'power2.out' },
      0.95
    )

    cleanupFns.push(() => cardTl.kill())
  }

  // 底部装饰入场
  if (footerRef.value) {
    gsap.fromTo(footerRef.value,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', delay: 1.3 }
    )
  }

  // 滚动动画 - 位移旋转缩放渐变
  if (sectionRef.value) {
    // 卡片滚动动画：位移 + 旋转 + 缩放 + 渐变
    const scrollCards = document.querySelectorAll('.wave-card')
    scrollCards.forEach((card, index) => {
      const direction = index % 2 === 0 ? 1 : -1

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5
        }
      })

      // 位移旋转缩放渐变组合动画
      scrollTl
        // 第一阶段：位移 + 旋转 + 缩放
        .to(card, {
          y: -120 - index * 40,
          rotationY: direction * 180,
          rotationX: direction * 15,
          scale: 0.7 - index * 0.08,
          duration: 1
        })
        // 第二阶段：渐变消失
        .to(card, {
          opacity: 0,
          duration: 0.5
        }, '-=0.3')

      cleanupFns.push(() => scrollTl.kill())
    })

    // 波浪背景滚动加速
    if (sectionRef.value) {
      const wave1St = ScrollTrigger.create({
        trigger: sectionRef.value,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
          gsap.set('.wave-1', { y: -30 * self.progress + '%' })
        }
      })
      cleanupFns.push(() => wave1St.kill())

      const wave2St = ScrollTrigger.create({
        trigger: sectionRef.value,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.8,
        onUpdate: (self) => {
          gsap.set('.wave-2', { y: -50 * self.progress + '%' })
        }
      })
      cleanupFns.push(() => wave2St.kill())

      const wave3St = ScrollTrigger.create({
        trigger: sectionRef.value,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2,
        onUpdate: (self) => {
          gsap.set('.wave-3', { y: -70 * self.progress + '%' })
        }
      })
      cleanupFns.push(() => wave3St.kill())

      // 标题滚动消失：位移 + 旋转 + 缩放 + 渐变
      if (headerRef.value) {
        const headerSt = ScrollTrigger.create({
          trigger: sectionRef.value,
          start: 'top top',
          end: '30% top',
          scrub: 1,
          onUpdate: (self) => {
            gsap.set(headerRef.value, {
              y: -150 * self.progress,
              rotationY: 30 * self.progress,
              rotationX: 10 * self.progress,
              scale: 1 - 0.4 * self.progress,
              opacity: 1 - self.progress
            })
          }
        })
        cleanupFns.push(() => headerSt.kill())
      }

      // 底部装饰滚动消失
      if (footerRef.value) {
        const footerSt = ScrollTrigger.create({
          trigger: sectionRef.value,
          start: 'top top',
          end: '50% top',
          scrub: 1,
          onUpdate: (self) => {
            gsap.set(footerRef.value, {
              y: 100 * self.progress,
              opacity: 1 - self.progress
            })
          }
        })
        cleanupFns.push(() => footerSt.kill())
      }
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
})
</script>

<style lang="scss" scoped>
.gradient-wave-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #0a0a1a;
}

// ============================================================
// 波浪背景
// ============================================================

.wave-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.wave {
  position: absolute;
  width: 200%;
  height: 100%;
  left: -50%;
  background: linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.02) 100%);
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 200px;
    background: inherit;
    left: 0;
  }

  &::before {
    top: 0;
    border-radius: 0 0 50% 50%;
  }

  &::after {
    bottom: 0;
    border-radius: 50% 50% 0 0;
  }
}

.wave-1 {
  top: -50%;
  background: linear-gradient(180deg, 
    rgba(59, 130, 246, 0.3) 0%, 
    rgba(59, 130, 246, 0.1) 50%,
    transparent 100%
  );
  animation: waveFloat1 8s ease-in-out infinite;
}

.wave-2 {
  top: -30%;
  background: linear-gradient(180deg, 
    rgba(139, 92, 246, 0.25) 0%, 
    rgba(139, 92, 246, 0.08) 50%,
    transparent 100%
  );
  animation: waveFloat2 10s ease-in-out infinite;
}

.wave-3 {
  top: -10%;
  background: linear-gradient(180deg, 
    rgba(236, 72, 153, 0.2) 0%, 
    rgba(236, 72, 153, 0.05) 50%,
    transparent 100%
  );
  animation: waveFloat3 12s ease-in-out infinite;
}

.wave-4 {
  top: 10%;
  background: linear-gradient(180deg, 
    rgba(16, 185, 129, 0.15) 0%, 
    rgba(16, 185, 129, 0.03) 50%,
    transparent 100%
  );
  animation: waveFloat4 14s ease-in-out infinite;
}

@keyframes waveFloat1 {
  0%, 100% { transform: translateX(-10%) rotate(-2deg); }
  50% { transform: translateX(10%) rotate(2deg); }
}

@keyframes waveFloat2 {
  0%, 100% { transform: translateX(5%) rotate(1deg); }
  50% { transform: translateX(-5%) rotate(-1deg); }
}

@keyframes waveFloat3 {
  0%, 100% { transform: translateX(-8%) rotate(-1.5deg); }
  50% { transform: translateX(8%) rotate(1.5deg); }
}

@keyframes waveFloat4 {
  0%, 100% { transform: translateX(3%) rotate(0.5deg); }
  50% { transform: translateX(-3%) rotate(-0.5deg); }
}

// 渐变遮罩
.gradient-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 0%, rgba(10, 10, 26, 0.8) 100%);
  pointer-events: none;
  z-index: 1;
}

// ============================================================
// 内容层
// ============================================================

.content-layer {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 80px;
}

// ============================================================
// 头部标题
// ============================================================

.wave-header {
  text-align: center;
  margin-bottom: 50px;
  perspective: 1000px;
}

.header-badge {
  width: 60px;
  height: 60px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899);
  border-radius: 16px;
  color: #fff;
  box-shadow: 0 10px 40px rgba(139, 92, 246, 0.4);

  svg {
    width: 32px;
    height: 32px;
  }
}

.title-lines {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title-line {
  font-size: 56px;
  font-weight: 900;
  letter-spacing: 8px;
  color: #fff;
  margin: 0;
  line-height: 1.1;
  text-shadow: 0 0 40px rgba(255, 255, 255, 0.3);

  &.title-accent {
    font-size: 72px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #f43f5e);
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
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    border-radius: 50%;
    box-shadow: 0 0 10px #8b5cf6;
  }
}

// ============================================================
// 卡片容器
// ============================================================

.wave-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  width: 100%;
  max-width: 850px;
}

// ============================================================
// 波浪卡片
// ============================================================

.wave-card {
  position: relative;
  padding: 28px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  overflow: hidden;
  cursor: pointer;
  transform-style: preserve-3d;
  transition: transform 0.4s ease, box-shadow 0.4s ease;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), transparent 50%, rgba(255, 255, 255, 0.1));
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  &:hover {
    transform: translateY(-10px) rotateX(5deg) rotateY(-5deg);

    &::before {
      opacity: 1;
    }

    .card-wave-effect {
      opacity: 0.6;
    }

    .wave-icon {
      transform: scale(1.1) rotate(5deg);
    }

    .card-shine {
      opacity: 1;
    }
  }

  // 卡片颜色变体
  &.card-ocean {
    .card-wave-effect {
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.4), transparent 60%);
    }
    .card-number { color: #3b82f6; }
    .card-title { color: #3b82f6; }
    .wave-icon { color: #3b82f6; }
    .wave-pill { background: rgba(59, 130, 246, 0.2); border-color: rgba(59, 130, 246, 0.3); }
  }

  &.card-sunset {
    .card-wave-effect {
      background: linear-gradient(135deg, rgba(249, 115, 22, 0.4), transparent 60%);
    }
    .card-number { color: #f97316; }
    .card-title { color: #f97316; }
    .wave-icon { color: #f97316; }
    .wave-pill { background: rgba(249, 115, 22, 0.2); border-color: rgba(249, 115, 22, 0.3); }
  }

  &.card-forest {
    .card-wave-effect {
      background: linear-gradient(135deg, rgba(34, 197, 94, 0.4), transparent 60%);
    }
    .card-number { color: #22c55e; }
    .card-title { color: #22c55e; }
    .wave-icon { color: #22c55e; }
    .wave-pill { background: rgba(34, 197, 94, 0.2); border-color: rgba(34, 197, 94, 0.3); }
  }

  &.card-aurora {
    .card-wave-effect {
      background: linear-gradient(135deg, rgba(168, 85, 247, 0.4), transparent 60%);
    }
    .card-number { color: #a855f7; }
    .card-title { color: #a855f7; }
    .wave-icon { color: #a855f7; }
    .wave-pill { background: rgba(168, 85, 247, 0.2); border-color: rgba(168, 85, 247, 0.3); }
  }
}

// 波浪效果层
.card-wave-effect {
  position: absolute;
  inset: 0;
  opacity: 0.3;
  transition: opacity 0.4s ease;
  animation: wavePulse 3s ease-in-out infinite;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: inherit;
    clip-path: polygon(
      0% 30%, 20% 0%, 40% 30%, 60% 0%, 80% 30%, 100% 0%, 
      100% 100%, 0% 100%
    );
    animation: waveMove 4s ease-in-out infinite;
  }
}

@keyframes wavePulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.5; }
}

@keyframes waveMove {
  0%, 100% { transform: translateX(-5%); }
  50% { transform: translateX(5%); }
}

// 光泽层
.card-shine {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    transparent 30%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 70%
  );
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

// 卡片内容
.card-content {
  position: relative;
  z-index: 2;
}

.card-icon-wrap {
  margin-bottom: 16px;
}

.wave-icon {
  width: 56px;
  height: 56px;
  transition: transform 0.4s ease;
}

.card-number {
  font-size: 42px;
  font-weight: 900;
  opacity: 0.25;
  line-height: 1;
  margin-bottom: 6px;
}

.card-title {
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 6px;
}

.card-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 16px;
}

.card-waves {
  display: flex;
  gap: 10px;
}

.wave-pill {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid;
  color: #fff;
}

// ============================================================
// 底部装饰
// ============================================================

.wave-footer {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 2;
}

.footer-wave {
  width: 200px;
  height: 4px;
  background: linear-gradient(90deg, transparent, #8b5cf6, #3b82f6, transparent);
  margin: 0 auto 16px;
  border-radius: 2px;
}

.footer-text {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.3);
  letter-spacing: 3px;
  text-transform: uppercase;
}
</style>
