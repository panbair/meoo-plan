<template>
  <div ref="sectionRef" class="rasterize-section">
    <!-- 全息网格背景 -->
    <div class="raster-bg">
      <div class="bg-grid"></div>
      <div class="bg-glow"></div>
      <div ref="particlesRef" class="raster-particles"></div>
    </div>

    <!-- 内容区域 -->
    <div class="raster-content">
      <div ref="badgeRef" class="raster-badge">
        <span class="badge-bracket">[</span>
        RASTERIZE ENTRY
        <span class="badge-bracket">]</span>
      </div>

      <h2 ref="titleRef" class="raster-title">栅格化入场</h2>

      <p ref="subtitleRef" class="raster-subtitle">线条重组 · 全息凝聚</p>

      <!-- 栅格化卡片组 -->
      <div ref="cardsContainerRef" class="raster-cards-container">
        <div
          v-for="(card, i) in rasterCards"
          :key="'card-' + i"
          class="raster-card"
          :ref="el => cardRefs.set(i, el as HTMLElement)"
          :style="{ '--raster-color': card.color }"
        >
          <!-- 栅格线条层 -->
          <div :ref="el => lineRefs.set(i, el as HTMLElement)" class="raster-lines">
            <div
              v-for="n in 20"
              :key="n"
              class="raster-line"
              :data-line="n"
            ></div>
          </div>

          <!-- 卡片内容 -->
          <div :ref="el => contentRefs.set(i, el as HTMLElement)" class="raster-card-content">
            <div class="content-icon" v-html="card.icon"></div>
            <h3 class="content-title">{{ card.title }}</h3>
            <p class="content-desc">{{ card.desc }}</p>
            <div class="content-value">{{ card.value }}</div>
          </div>

          <!-- 扫描线 -->
          <div class="card-scan"></div>

          <!-- 边框 -->
          <div class="card-border"></div>
        </div>
      </div>

      <!-- 进度指示器 -->
      <div ref="progressRef" class="raster-progress">
        <div class="progress-label">RASTERIZATION</div>
        <div class="progress-track">
          <div ref="progressFillRef" class="progress-fill"></div>
        </div>
      </div>
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
const cardsContainerRef = ref<HTMLElement | null>(null)
const particlesRef = ref<HTMLElement | null>(null)
const progressRef = ref<HTMLElement | null>(null)
const progressFillRef = ref<HTMLElement | null>(null)

const cardRefs = ref(new Map<number, HTMLElement>())
const lineRefs = ref(new Map<number, HTMLElement>())
const contentRefs = ref(new Map<number, HTMLElement>())

const rasterCards = [
  {
    title: '数据流',
    desc: '量子比特的信息传输',
    value: '10^12',
    color: '#00f5ff',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>'
  },
  {
    title: '全息场',
    desc: '光子矩阵的空间映射',
    value: '360°',
    color: '#b388ff',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>'
  },
  {
    title: '时空门',
    desc: '维度折叠的瞬间穿越',
    value: 'c → ∞',
    color: '#69f0ae',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v18"/></svg>'
  },
  {
    title: '意识网',
    desc: '神经网络的全域互联',
    value: '100B',
    color: '#ff6e40',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><circle cx="4" cy="6" r="2"/><circle cx="20" cy="6" r="2"/><circle cx="4" cy="18" r="2"/><circle cx="20" cy="18" r="2"/><path d="M6 7l4 3.5M18 7l-4 3.5M6 17l4-3.5M18 17l-4-3.5"/></svg>'
  }
]

const createParticles = () => {
  if (!particlesRef.value) return
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div')
    particle.className = 'raster-particle'
    particle.style.cssText = `
      position: absolute;
      width: ${Math.random() * 2 + 1}px;
      height: ${Math.random() * 2 + 1}px;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      background: rgba(0, 245, 255, ${Math.random() * 0.5 + 0.2});
      border-radius: 50%;
    `
    particlesRef.value.appendChild(particle)
  }
  cleanupFns.push(() => {
    if (particlesRef.value) {
      particlesRef.value.innerHTML = ''
    }
  })
}

const initAnimations = () => {
  if (!sectionRef.value) return

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 70%',
      toggleActions: 'play none none none'
    }
  })

  // Badge 入场
  if (badgeRef.value) {
    tl.fromTo(badgeRef.value,
      { scale: 0, opacity: 0, y: -30 },
      { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.7)' }
    )
  }

  // 标题入场
  if (titleRef.value) {
    tl.fromTo(titleRef.value,
      { y: 60, opacity: 0, filter: 'blur(10px)' },
      { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.6, ease: 'power3.out' },
      '-=0.3'
    )
  }

  // 副标题入场
  if (subtitleRef.value) {
    tl.fromTo(subtitleRef.value,
      { y: 30, opacity: 0, letterSpacing: '30px' },
      { y: 0, opacity: 1, letterSpacing: '6px', duration: 0.5, ease: 'power2.out' },
      '-=0.3'
    )
  }

  // 栅格化卡片入场 - 核心效果
  cardRefs.value.forEach((card, cardIndex) => {
    if (!card) return

    const lines = card.querySelectorAll('.raster-line')
    const content = contentRefs.value.get(cardIndex)

    if (!content) return

    // 初始状态：线条随机偏移，内容隐藏
    gsap.set(lines, {
      x: () => gsap.utils.random(-200, 200),
      opacity: () => gsap.utils.random(0.1, 0.5),
      scaleX: () => gsap.utils.random(0.2, 1.8)
    })

    gsap.set(content, {
      opacity: 0,
      scale: 0.7,
      filter: 'blur(15px)'
    })

    // 创建卡片入场 Timeline
    const cardTl = gsap.timeline()

    // 1. 线条归位汇聚
    cardTl.to(lines, {
      x: 0,
      opacity: 0.12,
      scaleX: 1,
      stagger: {
        each: 0.025,
        from: 'center'
      },
      ease: 'power3.inOut',
      duration: 0.8
    })

    // 2. 内容从虚空中凝聚
    .to(content, {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.4')

    // 3. 线条完全淡出
    .to(lines, {
      opacity: 0,
      stagger: {
        each: 0.015,
        from: 'edges'
      },
      duration: 0.3
    }, '-=0.2')

    tl.add(cardTl, cardIndex * 0.2)
  })

  // 进度指示器
  if (progressRef.value) {
    tl.fromTo(progressRef.value,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
      '-=0.2'
    )
  }

  cleanupFns.push(() => tl.kill())

  // 进度条动画
  if (progressFillRef.value) {
    const progressTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 60%',
        end: 'top 30%',
        scrub: 1
      }
    })

    progressTl.to(progressFillRef.value, {
      width: '100%',
      ease: 'none'
    })

    cleanupFns.push(() => progressTl.kill())
  }

  // 标题滚动效果
  if (titleRef.value) {
    const titleSt = ScrollTrigger.create({
      trigger: titleRef.value,
      start: 'top 75%',
      end: 'top 25%',
      scrub: 1,
      onUpdate: (self) => {
        if (titleRef.value) {
          gsap.set(titleRef.value, {
            y: -50 * self.progress,
            opacity: 1 - self.progress * 1.5
          })
        }
      }
    })
    cleanupFns.push(() => titleSt.kill())
  }

  // 卡片组滚动进入
  if (cardsContainerRef.value) {
    const cardsSt = ScrollTrigger.create({
      trigger: cardsContainerRef.value,
      start: 'top 65%',
      end: 'top 35%',
      scrub: 1,
      onEnter: () => {
        cardRefs.value.forEach((card, cardIndex) => {
          if (!card) return

          const lines = card.querySelectorAll('.raster-line')
          const content = contentRefs.value.get(cardIndex)

          if (!content) return

          gsap.set(lines, {
            x: () => gsap.utils.random(-200, 200),
            opacity: () => gsap.utils.random(0.1, 0.5),
            scaleX: () => gsap.utils.random(0.2, 1.8)
          })
          gsap.set(content, {
            opacity: 0,
            scale: 0.7,
            filter: 'blur(15px)'
          })

          const enterTl = gsap.timeline()
          enterTl.to(lines, {
              x: 0, opacity: 0.12, scaleX: 1,
              stagger: { each: 0.025, from: 'center' },
              ease: 'power3.inOut', duration: 0.8
            })
            .to(content, {
              opacity: 1, scale: 1, filter: 'blur(0px)',
              duration: 0.6, ease: 'power3.out'
            }, '-=0.4')
            .to(lines, {
              opacity: 0,
              stagger: { each: 0.015, from: 'edges' },
              duration: 0.3
            }, '-=0.2')

          gsap.delayedCall(cardIndex * 0.2, () => enterTl.play())
        })
      }
    })
    cleanupFns.push(() => cardsSt.kill())
  }
}

onMounted(() => {
  createParticles()
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
.rasterize-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #0a0a12 0%, #0d1117 50%, #0a0a12 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.raster-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0, 245, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 245, 255, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
}

.bg-glow {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 40%;
  background: radial-gradient(
    ellipse at center,
    rgba(0, 245, 255, 0.1) 0%,
    rgba(179, 136, 255, 0.05) 50%,
    transparent 70%
  );
  filter: blur(60px);
}

.raster-particles {
  position: absolute;
  inset: 0;
}

.raster-content {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 0 40px;
  max-width: 1200px;
  width: 100%;
}

.raster-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  background: rgba(0, 245, 255, 0.08);
  border: 1px solid rgba(0, 245, 255, 0.2);
  border-radius: 4px;
  color: #00f5ff;
  font-family: 'JetBrains Mono', 'Courier New', monospace;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 2px;
  margin-bottom: 30px;
}

.badge-bracket {
  color: rgba(0, 245, 255, 0.5);
}

.raster-title {
  font-family: 'Noto Sans SC', 'PingFang SC', sans-serif;
  font-size: clamp(36px, 8vw, 72px);
  font-weight: 700;
  color: #fff;
  margin: 0 0 15px 0;
  letter-spacing: 10px;
  text-shadow:
    0 0 30px rgba(0, 245, 255, 0.3),
    0 0 60px rgba(179, 136, 255, 0.2);
}

.raster-subtitle {
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0 0 50px 0;
  letter-spacing: 6px;
}

.raster-cards-container {
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 50px;
}

.raster-card {
  position: relative;
  width: 260px;
  min-height: 320px;
  background: linear-gradient(145deg, rgba(15, 15, 25, 0.9), rgba(5, 5, 10, 0.95));
  border: 1px solid rgba(0, 245, 255, 0.15);
  border-radius: 12px;
  overflow: hidden;
  padding: 25px;
  transition: transform 0.3s ease, border-color 0.3s ease;
}

.raster-card:hover {
  transform: translateY(-8px);
  border-color: rgba(0, 245, 255, 0.4);
}

.raster-lines {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 10px 0;
  pointer-events: none;
  overflow: hidden;
}

.raster-line {
  width: 100%;
  height: 3px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--raster-color, #00f5ff) 20%,
    var(--raster-color, #00f5ff) 80%,
    transparent
  );
  transform-origin: center;
}

.raster-card-content {
  position: relative;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.content-icon {
  width: 48px;
  height: 48px;
  color: var(--raster-color, #00f5ff);
  margin-bottom: 18px;
  filter: drop-shadow(0 0 12px currentColor);
}

.content-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.content-title {
  font-family: 'Noto Sans SC', 'PingFang SC', sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 12px 0;
  letter-spacing: 4px;
}

.content-desc {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0 0 20px 0;
  line-height: 1.6;
}

.content-value {
  font-family: 'JetBrains Mono', 'Courier New', monospace;
  font-size: 28px;
  font-weight: 700;
  color: var(--raster-color, #00f5ff);
  text-shadow: 0 0 20px currentColor;
}

.card-scan {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--raster-color, #00f5ff), transparent);
  opacity: 0;
  animation: scan 3s linear infinite;
  pointer-events: none;
}

@keyframes scan {
  0% {
    top: 0;
    opacity: 0;
  }
  10% {
    opacity: 0.8;
  }
  90% {
    opacity: 0.8;
  }
  100% {
    top: 100%;
    opacity: 0;
  }
}

.card-border {
  position: absolute;
  inset: 0;
  border-radius: 12px;
  border: 1px solid transparent;
  background: linear-gradient(135deg, var(--raster-color, #00f5ff) 0%, transparent 50%, var(--raster-color, #00f5ff) 100%) border-box;
  -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  opacity: 0.3;
}

.raster-progress {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.progress-label {
  font-family: 'JetBrains Mono', 'Courier New', monospace;
  font-size: 10px;
  color: rgba(0, 245, 255, 0.5);
  letter-spacing: 3px;
}

.progress-track {
  width: 200px;
  height: 2px;
  background: rgba(0, 245, 255, 0.1);
  border-radius: 1px;
  overflow: hidden;
}

.progress-fill {
  width: 0;
  height: 100%;
  background: linear-gradient(90deg, #00f5ff, #b388ff);
  border-radius: 1px;
}
</style>
