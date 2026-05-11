<template>
  <section ref="sectionRef" class="fade-section">
    <div class="bg-gradient"></div>

    <header ref="headerRef" class="section-header">
      <div ref="headerBadgeRef" class="header-badge">
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
          <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2"/>
        </svg>
      </div>
      <h1 ref="titleRef" class="title">淡入淡出</h1>
      <p ref="subtitleRef" class="subtitle">Fade In Out Animation</p>
    </header>

    <div ref="cardsContainerRef" class="cards-container">
      <div ref="card0Ref" class="fade-card" data-index="0">
        <div class="card-glow"></div>
        <div class="card-content">
          <span class="card-num">01</span>
          <h3 class="card-title">纯淡入</h3>
          <p class="card-desc">最简单的透明度动画</p>
        </div>
      </div>

      <div ref="card1Ref" class="fade-card" data-index="1">
        <div class="card-glow"></div>
        <div class="card-content">
          <span class="card-num">02</span>
          <h3 class="card-title">上移淡入</h3>
          <p class="card-desc">配合向上位移的淡入</p>
        </div>
      </div>

      <div ref="card2Ref" class="fade-card" data-index="2">
        <div class="card-glow"></div>
        <div class="card-content">
          <span class="card-num">03</span>
          <h3 class="card-title">缩放淡入</h3>
          <p class="card-desc">配合缩放的淡入效果</p>
        </div>
      </div>
    </div>

    <footer ref="footerRef" class="section-footer">
      <span>CardFadeInOut</span>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const headerBadgeRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const cardsContainerRef = ref<HTMLElement | null>(null)
const card0Ref = ref<HTMLElement | null>(null)
const card1Ref = ref<HTMLElement | null>(null)
const card2Ref = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
let cleanupFns: (() => void)[] = []

const initAnimations = () => {
  // 入场动画 - 页面加载时直接播放
  const tl = gsap.timeline({ delay: 0.3 })
  
  // 标题入场
  if (headerRef.value && headerBadgeRef.value && titleRef.value && subtitleRef.value) {
    tl.fromTo(headerBadgeRef.value,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(2)' }
    )
    .fromTo(titleRef.value,
      { y: -30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
      '-=0.3'
    )
    .fromTo(subtitleRef.value,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
      '-=0.3'
    )
  }

  const cards = [card0Ref.value, card1Ref.value, card2Ref.value]

  // 卡片1: 纯淡入
  if (cards[0]) {
    tl.fromTo(cards[0],
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      '-=0.5'
    )
  }

  // 卡片2: 上移淡入
  if (cards[1]) {
    tl.fromTo(cards[1],
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      '-=0.6'
    )
  }

  // 卡片3: 缩放淡入
  if (cards[2]) {
    tl.fromTo(cards[2],
      { opacity: 0, scale: 0.8, y: 40 },
      { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      '-=0.6'
    )
  }

  // 底部入场
  if (footerRef.value) {
    tl.fromTo(footerRef.value,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5 },
      '-=0.3'
    )
  }

  cleanupFns.push(() => tl.kill())

  // 滚动动画 - 使用每个卡片自己的 trigger
  if (sectionRef.value) {
    // 标题滚动消失
    if (headerRef.value) {
      const st1 = ScrollTrigger.create({
        trigger: sectionRef.value,
        start: 'top top',
        end: '40% top',
        scrub: 1,
        onUpdate: (self) => {
          gsap.set(headerRef.value, {
            y: -80 * self.progress,
            opacity: 1 - self.progress
          })
        }
      })
      cleanupFns.push(() => st1.kill())
    }

    // 卡片1: 向上淡出
    if (cards[0]) {
      const st2 = ScrollTrigger.create({
        trigger: cards[0],
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
          gsap.set(cards[0], {
            y: -50 * self.progress,
            opacity: 1 - 0.5 * self.progress
          })
        }
      })
      cleanupFns.push(() => st2.kill())
    }

    // 卡片2: 向上淡出
    if (cards[1]) {
      const st3 = ScrollTrigger.create({
        trigger: cards[1],
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
          gsap.set(cards[1], {
            y: -50 * self.progress,
            opacity: 1 - 0.5 * self.progress
          })
        }
      })
      cleanupFns.push(() => st3.kill())
    }

    // 卡片3: 向上淡出
    if (cards[2]) {
      const st4 = ScrollTrigger.create({
        trigger: cards[2],
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
          gsap.set(cards[2], {
            y: -50 * self.progress,
            opacity: 1 - 0.5 * self.progress
          })
        }
      })
      cleanupFns.push(() => st4.kill())
    }

    // 底部滚动消失
    if (footerRef.value) {
      const st5 = ScrollTrigger.create({
        trigger: sectionRef.value,
        start: '80% top',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
          gsap.set(footerRef.value, {
            y: 30 * self.progress,
            opacity: 1 - self.progress
          })
        }
      })
      cleanupFns.push(() => st5.kill())
    }
  }
}

onMounted(() => {
  // 延迟初始化以确保懒加载时 DOM 已完全渲染
  setTimeout(initAnimations, 100)
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
})
</script>

<style lang="scss" scoped>
.fade-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #0a0a1a 0%, #0a1a2a 50%, #0a0a1a 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
}

.bg-gradient {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 60%);
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
  position: relative;
  z-index: 1;
}

.header-badge {
  width: 60px;
  height: 60px;
  margin: 0 auto 20px;
  background: linear-gradient(135deg, #3b82f6, #06b6d4);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;

  svg { width: 32px; height: 32px; }
}

.title {
  font-size: 56px;
  font-weight: 900;
  background: linear-gradient(90deg, #3b82f6, #06b6d4);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 4px;
}

.cards-container {
  display: flex;
  gap: 30px;
  position: relative;
  z-index: 1;
}

.fade-card {
  position: relative;
  width: 280px;
  height: 260px;
  padding: 32px;
  background: rgba(15, 20, 35, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 20px;
  cursor: pointer;
  opacity: 1;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(59, 130, 246, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    .card-glow { opacity: 1; }
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6), 0 0 30px rgba(59, 130, 246, 0.2);
  }
}

.card-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.4), transparent 70%);
  opacity: 0;
  transition: opacity 0.3s;
  border-radius: inherit;
}

.card-content {
  position: relative;
  z-index: 1;
}

.card-num {
  font-size: 48px;
  font-weight: 900;
  color: #3b82f6;
  opacity: 0.3;
  line-height: 1;
  display: block;
  margin-bottom: 12px;
}

.card-title {
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
}

.card-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
}

.section-footer {
  position: absolute;
  bottom: 40px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.3);
  letter-spacing: 3px;
}
</style>
