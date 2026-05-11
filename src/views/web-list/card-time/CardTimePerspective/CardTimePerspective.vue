<template>
  <div ref="sectionRef" class="card-perspective">
    <!-- 背景效果 -->
    <div class="perspective-bg">
      <div class="bg-grid"></div>
      <div class="bg-glow glow-1"></div>
      <div class="bg-glow glow-2"></div>
    </div>

    <!-- 内容区域 -->
    <div class="perspective-content">
      <div ref="badgeRef" class="perspective-badge">3D PERSPECTIVE</div>
      <h2 ref="titleRef" class="perspective-title">透视空间</h2>
      <p ref="subtitleRef" class="perspective-subtitle">穿越维度的视觉体验 · 沉浸式的3D之旅</p>

      <!-- 透视卡片容器 -->
      <div ref="cardsWrapRef" class="perspective-cards">
        <div
          v-for="(card, i) in perspectiveCards"
          :key="i"
          :ref="el => cardRefs.set(i, el as HTMLElement)"
          class="perspective-card"
        >
          <div class="card-inner">
            <div class="card-front">
              <div class="card-depth-layer"></div>
              <div class="card-number">{{ String(i + 1).padStart(2, '0') }}</div>
              <div class="card-icon-wrapper">
                <div class="card-icon" v-html="card.icon"></div>
              </div>
              <h3 class="card-title">{{ card.title }}</h3>
            </div>
            <div class="card-back">
              <div class="card-back-content">
                <p class="card-desc">{{ card.desc }}</p>
                <div class="card-stats">
                  <div class="stat">
                    <span class="stat-value">{{ card.stat1 }}</span>
                    <span class="stat-label">{{ card.label1 }}</span>
                  </div>
                  <div class="stat">
                    <span class="stat-value">{{ card.stat2 }}</span>
                    <span class="stat-label">{{ card.label2 }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="card-shadow"></div>
        </div>
      </div>

      <div ref="footerRef" class="perspective-footer">
        <span>探索三维空间的奥秘</span>
      </div>
    </div>

    <!-- 装饰元素 -->
    <div class="perspective-deco deco-1"></div>
    <div class="perspective-deco deco-2"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []

const sectionRef = ref<HTMLElement | null>(null)
const badgeRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const cardRefs = ref(new Map<number, HTMLElement>())

// 卡片数据
const perspectiveCards = [
  {
    title: '维度突破',
    desc: '突破空间限制，开启无限可能',
    stat1: '∞',
    stat2: '360°',
    label1: '维度',
    label2: '视角',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>'
  },
  {
    title: '空间折叠',
    desc: '将遥远的距离折叠在掌心之间',
    stat1: '4D',
    stat2: '10x',
    label1: '维度',
    label2: '压缩',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>'
  },
  {
    title: '时间涟漪',
    desc: '穿越时空的光影波动',
    stat1: '穿越',
    stat2: '∞',
    label1: '状态',
    label2: '循环',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>'
  },
  {
    title: '全息投影',
    desc: '虚实交错的视觉盛宴',
    stat1: '8K',
    stat2: '120Hz',
    label1: '分辨率',
    label2: '刷新率',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>'
  }
]

const initAnimations = () => {
  if (!sectionRef.value) return

  // ========== 入场动画 - 3D 翻转卡片 ==========
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 75%',
      toggleActions: 'play none none none'
    }
  })

  tl.fromTo(badgeRef.value,
    { scale: 0, opacity: 0, rotateY: 180 },
    { scale: 1, opacity: 1, rotateY: 0, duration: 0.8, ease: 'back.out(1.7)' }
  )
  .fromTo(titleRef.value,
    { y: 60, opacity: 0, rotateX: -30, filter: 'blur(10px)' },
    { y: 0, opacity: 1, rotateX: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out' },
    '-=0.4'
  )
  .fromTo(subtitleRef.value,
    { y: 40, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
    '-=0.3'
  )

  // 卡片 3D 翻转入场 - 从底部立起
  const cards = cardRefs.value
  cards.forEach((card, i) => {
    if (!card) return
    gsap.set(card, {
      opacity: 0,
      rotateX: 40,
      y: 60,
      scale: 0.85,
      transformPerspective: 800,
      transformOrigin: 'center bottom'
    })
    tl.to(card,
      {
        opacity: 1,
        rotateX: 0,
        y: 0,
        scale: 1,
        duration: 0.7,
        ease: 'power3.out'
      },
      `-=${0.5 - i * 0.08}`
    )
  })

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
          opacity: Math.max(0, 1 - self.progress * 2),
          rotateX: -30 * self.progress,
          filter: `blur(${self.progress * 8}px)`
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
          y: -50 * self.progress,
          opacity: Math.max(0, 1 - self.progress * 2),
          scale: 1 - self.progress * 0.2
        })
      }
    })
    cleanupFns.push(() => st2.kill())
  }

  // 卡片滚动动画 - 3D 翻转效果
  cards.forEach((card, i) => {
    if (!card) return

    const st = ScrollTrigger.create({
      trigger: card,
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1.5,
      onUpdate: (self) => {
        gsap.set(card, {
          rotateX: 20 * self.progress,
          y: -50 * self.progress,
          scale: 1 - self.progress * 0.15,
          filter: `brightness(${1 + self.progress * 0.3})`
        })
      }
    })
    cleanupFns.push(() => st.kill())
  })

  // 背景光晕滚动效果
  const glows = sectionRef.value.querySelectorAll('.bg-glow')
  glows.forEach((glow, i) => {
    gsap.to(glow, {
      x: 50 * (i % 2 === 0 ? 1 : -1),
      y: 30,
      duration: 4 + i,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
  })
}

onMounted(() => {
  // 延迟初始化以确保懒加载时 DOM 已完全渲染
  setTimeout(initAnimations, 100)
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
})
</script>

<style scoped lang="scss">
@use 'sass:math';

.card-perspective {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #0c0c1d 0%, #1a1a3e 50%, #0c0c1d 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.perspective-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(139, 92, 246, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(139, 92, 246, 0.05) 1px, transparent 1px);
  background-size: 50px 50px;
  transform: perspective(500px) rotateX(60deg);
  transform-origin: center bottom;
}

.bg-glow {
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.3;
}

.glow-1 {
  top: -100px;
  left: -100px;
  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
}

.glow-2 {
  bottom: -100px;
  right: -100px;
  background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
}

.perspective-content {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 60px;
  perspective: 1200px;
}

.perspective-badge {
  display: inline-block;
  padding: 8px 24px;
  background: rgba(139, 92, 246, 0.2);
  border: 1px solid rgba(139, 92, 246, 0.4);
  border-radius: 30px;
  color: #a78bfa;
  font-size: 12px;
  letter-spacing: 4px;
  margin-bottom: 30px;
  backdrop-filter: blur(10px);
}

.perspective-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 64px;
  font-weight: 900;
  letter-spacing: 10px;
  background: linear-gradient(180deg, #fff 0%, #a78bfa 50%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 20px;
  filter: drop-shadow(0 0 30px rgba(139, 92, 246, 0.5));
  transform-style: preserve-3d;
}

.perspective-subtitle {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 4px;
  margin-bottom: 60px;
}

.perspective-cards {
  display: flex;
  gap: 30px;
  justify-content: center;
  flex-wrap: wrap;
  perspective: 800px;
}

.perspective-card {
  position: relative;
  width: 260px;
  height: 340px;
  cursor: pointer;
  transform-style: preserve-3d;
  transform-origin: center bottom;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.6s ease;
}

.perspective-card:hover .card-inner {
  transform: rotateY(180deg);
}

.card-front,
.card-back {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  border-radius: 20px;
  overflow: hidden;
}

.card-front {
  background: linear-gradient(145deg, rgba(30, 30, 60, 0.9) 0%, rgba(20, 20, 40, 0.95) 100%);
  border: 1px solid rgba(139, 92, 246, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
}

.card-depth-layer {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg,
    rgba(139, 92, 246, 0.1) 0%,
    transparent 50%,
    rgba(139, 92, 246, 0.05) 100%
  );
  pointer-events: none;
}

.card-number {
  position: absolute;
  top: 20px;
  left: 20px;
  font-family: 'Orbitron', sans-serif;
  font-size: 48px;
  font-weight: 700;
  color: rgba(139, 92, 246, 0.2);
}

.card-icon-wrapper {
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(99, 102, 241, 0.2) 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.4s;
}

.card-icon {
  width: 45px;
  height: 45px;
  color: #a78bfa;

  :deep(svg) {
    width: 100%;
    height: 100%;
  }
}

.perspective-card:hover .card-icon-wrapper {
  transform: scale(1.1) rotate(5deg);
}

.card-title {
  font-size: 22px;
  font-weight: 600;
  color: #fff;
  text-align: center;
}

.card-back {
  background: linear-gradient(145deg, #1a1a3e 0%, #0c0c1d 100%);
  border: 1px solid rgba(139, 92, 246, 0.5);
  transform: rotateY(180deg);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
}

.card-back-content {
  text-align: center;
}

.card-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  margin-bottom: 30px;
}

.card-stats {
  display: flex;
  gap: 30px;
  justify-content: center;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.stat-value {
  font-family: 'Orbitron', sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #a78bfa;
}

.stat-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.card-shadow {
  position: absolute;
  bottom: -20px;
  left: 10%;
  right: 10%;
  height: 40px;
  background: radial-gradient(ellipse, rgba(139, 92, 246, 0.4) 0%, transparent 70%);
  filter: blur(15px);
  transform: translateZ(-50px);
}

.perspective-footer {
  margin-top: 50px;
  color: rgba(255, 255, 255, 0.4);
  font-size: 14px;
  letter-spacing: 3px;
}

.perspective-deco {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(139, 92, 246, 0.2);
  pointer-events: none;
}

.deco-1 {
  width: 200px;
  height: 200px;
  top: 10%;
  right: 10%;
  animation: decoRotate 20s linear infinite;
}

.deco-2 {
  width: 150px;
  height: 150px;
  bottom: 15%;
  left: 5%;
  animation: decoRotate 15s linear infinite reverse;
}

@keyframes decoRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .perspective-title {
    font-size: 36px;
    letter-spacing: 5px;
  }

  .perspective-subtitle {
    font-size: 14px;
    letter-spacing: 2px;
  }

  .perspective-cards {
    gap: 20px;
  }

  .perspective-card {
    width: 200px;
    height: 280px;
  }

  .card-icon-wrapper {
    width: 60px;
    height: 60px;
  }

  .card-icon {
    width: 35px;
    height: 35px;
  }
}
</style>
