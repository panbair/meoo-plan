<template>
  <div ref="sectionRef" class="card-cascade">
    <!-- 渐变背景 -->
    <div class="cascade-bg">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="gradient-orb orb-3"></div>
    </div>

    <!-- 内容区域 -->
    <div class="cascade-content">
      <div ref="badgeRef" class="cascade-badge">CASCADE</div>
      <h2 ref="titleRef" class="cascade-title">交替瀑布</h2>
      <p ref="subtitleRef" class="cascade-subtitle">动与静的完美交替 · 视觉的律动之旅</p>

      <!-- 瀑布卡片 -->
      <div ref="cardsWrapRef" class="cascade-cards">
        <div
          v-for="(card, i) in cascadeCards"
          :key="i"
          :ref="el => cardRefs.set(i, el as HTMLElement)"
          class="cascade-item"
          :class="i % 2 === 0 ? 'item-left' : 'item-right'"
        >
          <div class="item-number">{{ String(i + 1).padStart(2, '0') }}</div>
          <div class="item-icon-wrapper">
            <div class="item-icon" v-html="card.icon"></div>
          </div>
          <div class="item-info">
            <h3 class="item-title">{{ card.title }}</h3>
            <p class="item-desc">{{ card.desc }}</p>
            <div class="item-progress">
              <div class="progress-fill" :style="{ width: card.progress }"></div>
            </div>
          </div>
          <div class="item-decoration"></div>
        </div>
      </div>

      <div ref="footerRef" class="cascade-footer">
        <span>体验交替之美</span>
      </div>
    </div>

    <!-- 装饰线条 -->
    <div class="cascade-lines">
      <div class="flow-line line-1"></div>
      <div class="flow-line line-2"></div>
      <div class="flow-line line-3"></div>
    </div>
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
const cascadeCards = [
  {
    title: '初见',
    desc: '一切美好事物的起点',
    progress: '75%',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l2 2"/></svg>'
  },
  {
    title: '相知',
    desc: '深入了解彼此的过程',
    progress: '60%',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
  },
  {
    title: '相守',
    desc: '携手共度的时光',
    progress: '85%',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>'
  },
  {
    title: '相伴',
    desc: '永恒不变的真情',
    progress: '90%',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'
  }
]

const initAnimations = () => {
  if (!sectionRef.value) return

  // ========== 入场动画 - 左右交替滑入 ==========
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 80%',
      toggleActions: 'play none none none'
    }
  })

  tl.fromTo(badgeRef.value,
    { scale: 0, opacity: 0, y: -30 },
    { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)' }
  )
  .fromTo(titleRef.value,
    { y: 50, opacity: 0, filter: 'blur(8px)' },
    { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out' },
    '-=0.3'
  )
  .fromTo(subtitleRef.value,
    { y: 30, opacity: 0, letterSpacing: '20px' },
    { y: 0, opacity: 1, letterSpacing: '4px', duration: 0.5, ease: 'power2.out' },
    '-=0.3'
  )

  // 卡片左右交替滑入
  const cards = cardRefs.value
  cards.forEach((card, i) => {
    if (!card) return
    const fromX = i % 2 === 0 ? -80 : 80
    gsap.set(card, { opacity: 0, x: fromX, y: 30 })
    tl.to(card,
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'power2.out'
      },
      `-=${0.4}`
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
          scale: 1 - self.progress * 0.2
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
          letterSpacing: `${4 + self.progress * 10}px`
        })
      }
    })
    cleanupFns.push(() => st2.kill())
  }

  // 卡片滚动动画 - 左右交替
  cards.forEach((card, i) => {
    if (!card) return
    const scrollDir = i % 2 === 0 ? 1 : -1

    const st = ScrollTrigger.create({
      trigger: card,
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1.5,
      onUpdate: (self) => {
        gsap.set(card, {
          x: scrollDir * 50 * self.progress,
          y: -30 * self.progress,
          rotateY: scrollDir * 10 * self.progress,
          opacity: Math.max(0, 1 - self.progress * 1.5),
          scale: 1 - self.progress * 0.1
        })
      }
    })
    cleanupFns.push(() => st.kill())
  })

  // 装饰线条动画
  const lines = sectionRef.value.querySelectorAll('.flow-line')
  lines.forEach((line, i) => {
    gsap.to(line, {
      y: -100,
      opacity: 0,
      duration: 3 + i * 0.5,
      repeat: -1,
      ease: 'none',
      delay: i * 0.8
    })
  })
}

onMounted(() => {
  initAnimations()
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
})
</script>

<style scoped lang="scss">
@use 'sass:math';

.card-cascade {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cascade-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
}

.orb-1 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
  top: -100px;
  left: -100px;
}

.orb-2 {
  width: 350px;
  height: 350px;
  background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
  bottom: -80px;
  right: -80px;
}

.orb-3 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.cascade-content {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 60px;
  max-width: 1200px;
}

.cascade-badge {
  display: inline-block;
  padding: 8px 24px;
  background: rgba(6, 182, 212, 0.15);
  border: 1px solid rgba(6, 182, 212, 0.3);
  border-radius: 30px;
  color: #06b6d4;
  font-size: 12px;
  letter-spacing: 5px;
  margin-bottom: 30px;
  backdrop-filter: blur(10px);
}

.cascade-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 64px;
  font-weight: 900;
  letter-spacing: 8px;
  background: linear-gradient(180deg, #fff 0%, #06b6d4 50%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 20px;
  filter: drop-shadow(0 0 30px rgba(6, 182, 212, 0.4));
}

.cascade-subtitle {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 4px;
  margin-bottom: 60px;
}

.cascade-cards {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}

.cascade-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 30px;
  width: 90%;
  max-width: 800px;
  padding: 25px 30px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(6, 182, 212, 0.2);
  border-radius: 16px;
  backdrop-filter: blur(20px);
  transform-style: preserve-3d;
  perspective: 1000px;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.5), transparent);
  }

  &:hover {
    border-color: rgba(6, 182, 212, 0.5);
    box-shadow: 0 10px 40px rgba(6, 182, 212, 0.2);

    .item-icon-wrapper {
      transform: scale(1.1) rotate(5deg);
    }

    .item-decoration {
      opacity: 1;
      transform: scaleX(1);
    }
  }

  &.item-left {
    flex-direction: row;

    .item-number {
      order: 1;
    }

    .item-icon-wrapper {
      order: 2;
    }

    .item-info {
      order: 3;
      text-align: left;
    }
  }

  &.item-right {
    flex-direction: row-reverse;

    .item-number {
      order: 1;
    }

    .item-icon-wrapper {
      order: 2;
    }

    .item-info {
      order: 3;
      text-align: right;
    }
  }
}

.item-number {
  font-family: 'Orbitron', sans-serif;
  font-size: 48px;
  font-weight: 700;
  color: rgba(6, 182, 212, 0.15);
  flex-shrink: 0;
}

.item-icon-wrapper {
  width: 70px;
  height: 70px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%);
  border-radius: 16px;
  transition: transform 0.4s;
}

.item-icon {
  width: 40px;
  height: 40px;
  color: #06b6d4;

  :deep(svg) {
    width: 100%;
    height: 100%;
  }
}

.item-info {
  flex: 1;
}

.item-title {
  font-size: 22px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 8px;
}

.item-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 12px;
}

.item-progress {
  height: 4px;
  background: rgba(6, 182, 212, 0.15);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #06b6d4, #3b82f6);
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
}

.item-decoration {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #06b6d4, transparent);
  opacity: 0;
  transform: scaleX(0);
  transition: all 0.4s;
}

.cascade-footer {
  margin-top: 50px;
  color: rgba(255, 255, 255, 0.4);
  font-size: 14px;
  letter-spacing: 3px;
}

.cascade-lines {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.flow-line {
  position: absolute;
  left: 50%;
  width: 2px;
  height: 100px;
  background: linear-gradient(180deg, transparent, rgba(6, 182, 212, 0.3), transparent);
  transform: translateX(-50%);
}

.line-1 {
  top: 0;
}

.line-2 {
  top: 20%;
  width: 1px;
}

.line-3 {
  top: 40%;
  width: 3px;
}

@media (max-width: 768px) {
  .cascade-title {
    font-size: 36px;
    letter-spacing: 4px;
  }

  .cascade-subtitle {
    font-size: 14px;
    letter-spacing: 2px;
  }

  .cascade-item {
    padding: 20px;
    gap: 15px;

    &.item-right {
      flex-direction: column;
      align-items: center;

      .item-info {
        text-align: center;
      }
    }
  }

  .item-number {
    font-size: 32px;
  }

  .item-icon-wrapper {
    width: 50px;
    height: 50px;
  }

  .item-title {
    font-size: 18px;
  }
}
</style>
