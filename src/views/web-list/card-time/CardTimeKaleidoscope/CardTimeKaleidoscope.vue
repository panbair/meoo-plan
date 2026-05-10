<template>
  <div ref="sectionRef" class="kaleido-section">
    <!-- 渐变背景 -->
    <div class="kaleido-bg">
      <div class="bg-gradient"></div>
      <div class="bg-noise"></div>
      <div ref="particlesRef" class="kaleido-particles"></div>
    </div>

    <!-- 内容区域 -->
    <div class="kaleido-content">
      <div ref="badgeRef" class="kaleido-badge">
        <span class="badge-diamond">◆</span>
        KALEIDOSCOPE
        <span class="badge-diamond">◆</span>
      </div>

      <h2 ref="titleRef" class="kaleido-title">万花筒</h2>

      <p ref="subtitleRef" class="kaleido-subtitle">棱镜折射 · 碎片重组</p>

      <!-- 万花筒卡片组 -->
      <div ref="cardsContainerRef" class="kaleido-cards-container">
        <div
          v-for="(card, i) in kaleidoCards"
          :key="'card-' + i"
          class="kaleidoscope-card"
          :ref="el => cardRefs.set(i, el as HTMLElement)"
          :style="{ '--k-primary': card.primary, '--k-secondary': card.secondary }"
        >
          <!-- 碎片层 -->
          <div
            v-for="n in 8"
            :key="'frag-' + n"
            :ref="el => fragmentRefs.set(i * 8 + n - 1, el as HTMLElement)"
            class="kaleido-fragment"
            :data-frag="n"
          ></div>

          <!-- 棱镜光晕 -->
          <div :ref="el => glowRefs.set(i, el as HTMLElement)" class="prism-glow"></div>

          <!-- 卡片内容 -->
          <div :ref="el => contentRefs.set(i, el as HTMLElement)" class="card-content">
            <div class="content-inner">
              <div class="content-icon" v-html="card.icon"></div>
              <h3 class="content-title">{{ card.title }}</h3>
              <p class="content-desc">{{ card.desc }}</p>
              <div class="content-tags">
                <span v-for="(tag, tIdx) in card.tags" :key="tIdx" class="tag">{{ tag }}</span>
              </div>
            </div>
          </div>

          <!-- 边框 -->
          <div class="card-border"></div>
        </div>
      </div>

      <!-- 底部装饰 -->
      <div ref="footerRef" class="kaleido-footer">
        <div class="footer-prism">
          <div class="prism-face face-1"></div>
          <div class="prism-face face-2"></div>
          <div class="prism-face face-3"></div>
        </div>
        <span class="footer-text">PRISM REFRACTION</span>
      </div>
    </div>

    <!-- 滚动提示 -->
    <div class="scroll-hint">
      <span>SCROLL</span>
      <div class="hint-line"></div>
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
const footerRef = ref<HTMLElement | null>(null)

const cardRefs = ref(new Map<number, HTMLElement>())
const fragmentRefs = ref(new Map<number, HTMLElement>())
const glowRefs = ref(new Map<number, HTMLElement>())
const contentRefs = ref(new Map<number, HTMLElement>())

// 8个碎片的最终位置配置
const fragmentPositions = [
  { x: -25, y: -25, rotate: 0, clip: 'polygon(0 0, 50% 0, 0 50%)' },
  { x: 25, y: -25, rotate: 0, clip: 'polygon(50% 0, 100% 0, 100% 50%, 50% 50%)' },
  { x: -25, y: 25, rotate: 0, clip: 'polygon(0 50%, 50% 50%, 0 100%)' },
  { x: 25, y: 25, rotate: 0, clip: 'polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%)' },
  { x: -12, y: -12, rotate: 0, clip: 'polygon(25% 25%, 75% 25%, 50% 50%)' },
  { x: 12, y: -12, rotate: 0, clip: 'polygon(50% 50%, 75% 25%, 75% 75%)' },
  { x: -12, y: 12, rotate: 0, clip: 'polygon(25% 75%, 50% 50%, 25% 25%)' },
  { x: 12, y: 12, rotate: 0, clip: 'polygon(50% 50%, 75% 75%, 25% 75%)' }
]

const kaleidoCards = [
  {
    title: '光谱裂变',
    desc: '白光穿透棱镜，分解为七彩虹光',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2v20M2 12h20M5.5 5.5l13 13M18.5 5.5l-13 13"/></svg>',
    primary: '#ff6b6b',
    secondary: '#feca57',
    tags: ['折射', '色散', '光谱']
  },
  {
    title: '镜像对称',
    desc: '万花筒中的无限延伸与重复',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 2c5.5 0 10 4.5 10 10s-4.5 10-10 10"/><path d="M12 2c-5.5 0-10 4.5-10 10s4.5 10 10 10"/></svg>',
    primary: '#48dbfb',
    secondary: '#0abde3',
    tags: ['对称', '镜像', '无限']
  },
  {
    title: '碎片重组',
    desc: '混沌中的秩序，重建完整图景',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="12 2 15 9 22 9 17 14 19 21 12 17 5 21 7 14 2 9 9 9"/></svg>',
    primary: '#ff9ff3',
    secondary: '#f368e0',
    tags: ['重组', '秩序', '完整']
  }
]

const createParticles = () => {
  if (!particlesRef.value) return

  for (let i = 0; i < 40; i++) {
    const particle = document.createElement('div')
    const hue = Math.random() * 60 + 300 // 粉紫色范围
    particle.className = 'kaleido-particle'
    particle.style.cssText = `
      position: absolute;
      width: ${Math.random() * 3 + 1}px;
      height: ${Math.random() * 3 + 1}px;
      background: hsla(${hue}, 80%, 60%, ${Math.random() * 0.5 + 0.3});
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      filter: blur(${Math.random() * 2}px);
      animation: float-particle ${Math.random() * 10 + 8}s ease-in-out infinite;
      animation-delay: ${Math.random() * 5}s;
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
      { scale: 0, opacity: 0, y: -20 },
      { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.7)' }
    )
  }

  // 标题入场
  if (titleRef.value) {
    tl.fromTo(titleRef.value,
      { y: 60, opacity: 0, filter: 'blur(10px)', scale: 0.8 },
      { y: 0, opacity: 1, filter: 'blur(0px)', scale: 1, duration: 0.6, ease: 'power3.out' },
      '-=0.3'
    )
  }

  // 副标题入场
  if (subtitleRef.value) {
    tl.fromTo(subtitleRef.value,
      { y: 30, opacity: 0, letterSpacing: '30px' },
      { y: 0, opacity: 1, letterSpacing: '8px', duration: 0.5, ease: 'power2.out' },
      '-=0.3'
    )
  }

  // 万花筒卡片入场 - 核心效果
  cardRefs.value.forEach((card, cardIndex) => {
    if (!card) return

    const glow = glowRefs.value.get(cardIndex)
    const content = contentRefs.value.get(cardIndex)

    // 获取该卡片的所有碎片
    const fragments: HTMLElement[] = []
    for (let j = 0; j < 8; j++) {
      const frag = fragmentRefs.value.get(cardIndex * 8 + j)
      if (frag) fragments.push(frag)
    }

    if (!glow || !content || fragments.length === 0) return

    // 初始：随机散布
    fragments.forEach((frag, i) => {
      const pos = fragmentPositions[i]
      gsap.set(frag, {
        x: gsap.utils.random(-350, 350),
        y: gsap.utils.random(-450, 450),
        scale: gsap.utils.random(0.3, 0.8),
        rotation: gsap.utils.random(-180, 180),
        filter: 'blur(8px)',
        opacity: 0.5,
        clipPath: pos.clip
      })
    })
    gsap.set(content, { scale: 0.85, opacity: 0 })
    gsap.set(glow, { opacity: 0, scale: 0.3 })

    // 创建卡片入场 Timeline
    const cardTl = gsap.timeline()

    // 碎片聚拢：旋转着飞到目标位置
    cardTl.to(fragments, {
      x: (i: number) => fragmentPositions[i].x,
      y: (i: number) => fragmentPositions[i].y,
      scale: 1,
      rotation: 0,
      filter: 'blur(0px)',
      opacity: 0.9,
      duration: 0.9,
      stagger: { amount: 0.35, from: 'random' },
      ease: 'back.out(1.7)'
    })

    // 拼合瞬间：棱镜光晕爆发
    .to(glow, {
      opacity: 1,
      scale: 3,
      duration: 0.4,
      ease: 'power2.out'
    })

    .to(glow, {
      opacity: 0,
      scale: 1.5,
      duration: 0.5,
      ease: 'power2.in'
    }, '-=0.2')

    // 内容显现
    .to(content, {
      opacity: 1,
      scale: 1,
      duration: 0.5,
      ease: 'power3.out'
    }, '-=0.4')

    // 碎片淡出
    .to(fragments, {
      opacity: 0,
      duration: 0.3,
      stagger: 0.03
    }, '-=0.2')

    tl.add(cardTl, cardIndex * 0.3)
  })

  // 底部装饰入场
  if (footerRef.value) {
    tl.fromTo(footerRef.value,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
      '-=0.2'
    )
  }

  cleanupFns.push(() => tl.kill())

  // 标题滚动效果
  if (titleRef.value) {
    const titleSt = ScrollTrigger.create({
      trigger: titleRef.value,
      start: 'top 75%',
      end: 'top 20%',
      scrub: 1,
      onUpdate: (self) => {
        if (titleRef.value) {
          gsap.set(titleRef.value, {
            y: -60 * self.progress,
            opacity: 1 - self.progress * 2,
            scale: 1 - self.progress * 0.3,
            filter: `blur(${10 * self.progress}px)`
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
      end: 'top 30%',
      scrub: 1,
      onEnter: () => {
        cardRefs.value.forEach((card, cardIndex) => {
          if (!card) return

          const glow = glowRefs.value.get(cardIndex)
          const content = contentRefs.value.get(cardIndex)

          const fragments: HTMLElement[] = []
          for (let j = 0; j < 8; j++) {
            const frag = fragmentRefs.value.get(cardIndex * 8 + j)
            if (frag) fragments.push(frag)
          }

          if (!glow || !content || fragments.length === 0) return

          // 初始：随机散布
          fragments.forEach((frag, i) => {
            const pos = fragmentPositions[i]
            gsap.set(frag, {
              x: gsap.utils.random(-350, 350),
              y: gsap.utils.random(-450, 450),
              scale: gsap.utils.random(0.3, 0.8),
              rotation: gsap.utils.random(-180, 180),
              filter: 'blur(8px)',
              opacity: 0.5,
              clipPath: pos.clip
            })
          })
          gsap.set(content, { scale: 0.85, opacity: 0 })
          gsap.set(glow, { opacity: 0, scale: 0.3 })

          const enterTl = gsap.timeline()

          enterTl.to(fragments, {
              x: (i: number) => fragmentPositions[i].x,
              y: (i: number) => fragmentPositions[i].y,
              scale: 1, rotation: 0, filter: 'blur(0px)', opacity: 0.9,
              duration: 0.9, stagger: { amount: 0.35, from: 'random' },
              ease: 'back.out(1.7)'
            })
            .to(glow, { opacity: 1, scale: 3, duration: 0.4, ease: 'power2.out' })
            .to(glow, { opacity: 0, scale: 1.5, duration: 0.5, ease: 'power2.in' }, '-=0.2')
            .to(content, { opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' }, '-=0.4')
            .to(fragments, { opacity: 0, duration: 0.3, stagger: 0.03 }, '-=0.2')

          gsap.delayedCall(cardIndex * 0.3, () => enterTl.play())
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
.kaleido-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #1a0a2e 0%, #16213e 50%, #1a0a2e 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.kaleido-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.bg-gradient {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 60% 50% at 20% 30%, rgba(255, 107, 107, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse 50% 40% at 80% 70%, rgba(72, 219, 251, 0.12) 0%, transparent 50%),
    radial-gradient(ellipse 40% 60% at 50% 50%, rgba(255, 159, 243, 0.1) 0%, transparent 50%);
  filter: blur(40px);
}

.bg-noise {
  position: absolute;
  inset: 0;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
}

.kaleido-particles {
  position: absolute;
  inset: 0;
}

@keyframes float-particle {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.3;
  }
  25% {
    transform: translate(30px, -50px) scale(1.2);
    opacity: 0.8;
  }
  50% {
    transform: translate(-20px, -100px) scale(0.8);
    opacity: 0.5;
  }
  75% {
    transform: translate(40px, -60px) scale(1.1);
    opacity: 0.7;
  }
}

.kaleido-content {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 0 40px;
  max-width: 1200px;
  width: 100%;
}

.kaleido-badge {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 10px 24px;
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 159, 243, 0.3);
  border-radius: 30px;
  color: #ff9ff3;
  font-family: 'JetBrains Mono', 'Courier New', monospace;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 3px;
  margin-bottom: 30px;
  text-shadow: 0 0 20px rgba(255, 159, 243, 0.5);
}

.badge-diamond {
  color: #feca57;
  animation: rotate-diamond 4s linear infinite;
}

@keyframes rotate-diamond {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.kaleido-title {
  font-family: 'Noto Sans SC', 'PingFang SC', sans-serif;
  font-size: clamp(42px, 9vw, 84px);
  font-weight: 800;
  color: #fff;
  margin: 0 0 15px 0;
  letter-spacing: 15px;
  background: linear-gradient(135deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3, #f368e0);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradient-shift 8s ease infinite;
}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.kaleido-subtitle {
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0 0 50px 0;
  letter-spacing: 8px;
}

.kaleido-cards-container {
  display: flex;
  justify-content: center;
  gap: 35px;
  flex-wrap: wrap;
  margin-bottom: 60px;
}

.kaleidoscope-card {
  position: relative;
  width: 300px;
  min-height: 380px;
  background: linear-gradient(145deg, rgba(30, 15, 50, 0.9), rgba(15, 10, 30, 0.95));
  border-radius: 20px;
  overflow: hidden;
  transform-style: preserve-3d;
  perspective: 1000px;
  transition: transform 0.4s ease;
}

.kaleidoscope-card:hover {
  transform: translateY(-8px) scale(1.02);
}

.kaleido-fragment {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg,
    rgba(255, 107, 107, 0.15),
    rgba(72, 219, 251, 0.1),
    rgba(255, 159, 243, 0.15)
  );
  pointer-events: none;
  will-change: transform, opacity, filter;
}

.prism-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 150%;
  height: 150%;
  transform: translate(-50%, -50%);
  background: radial-gradient(
    circle,
    rgba(254, 202, 87, 0.6) 0%,
    rgba(255, 107, 107, 0.4) 30%,
    rgba(255, 159, 243, 0.2) 60%,
    transparent 80%
  );
  pointer-events: none;
  filter: blur(30px);
  z-index: 5;
}

.card-content {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 30px;
}

.content-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.content-icon {
  width: 56px;
  height: 56px;
  color: var(--k-primary, #ff6b6b);
  margin-bottom: 20px;
  filter: drop-shadow(0 0 15px currentColor);
}

.content-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.content-title {
  font-family: 'Noto Sans SC', 'PingFang SC', sans-serif;
  font-size: 26px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 12px 0;
  letter-spacing: 5px;
  text-shadow: 0 0 20px rgba(255, 159, 243, 0.4);
}

.content-desc {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 20px 0;
  line-height: 1.7;
}

.content-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.tag {
  padding: 4px 12px;
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 159, 243, 0.2);
  border-radius: 12px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
}

.card-border {
  position: absolute;
  inset: 0;
  border-radius: 20px;
  border: 1px solid transparent;
  background: linear-gradient(135deg,
    var(--k-primary, #ff6b6b),
    var(--k-secondary, #feca57),
    rgba(72, 219, 251, 0.5)
  ) border-box;
  -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  opacity: 0.5;
}

.kaleido-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 25px;
  color: rgba(255, 159, 243, 0.5);
  font-size: 11px;
  letter-spacing: 4px;
}

.footer-prism {
  position: relative;
  width: 30px;
  height: 30px;
}

.prism-face {
  position: absolute;
  width: 100%;
  height: 100%;
}

.face-1 {
  background: linear-gradient(135deg, #ff6b6b, transparent);
  clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
  animation: prism-rotate 6s ease-in-out infinite;
}

.face-2 {
  background: linear-gradient(135deg, #feca57, transparent);
  clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
  transform: rotate(120deg);
  animation: prism-rotate 6s ease-in-out infinite reverse;
}

.face-3 {
  background: linear-gradient(135deg, #48dbfb, transparent);
  clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
  transform: rotate(240deg);
  animation: prism-rotate 6s ease-in-out infinite;
}

@keyframes prism-rotate {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

.scroll-hint {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: rgba(255, 159, 243, 0.4);
  font-size: 10px;
  letter-spacing: 2px;
  z-index: 100;
}

.hint-line {
  width: 1px;
  height: 30px;
  background: linear-gradient(180deg, rgba(255, 159, 243, 0.4), transparent);
  animation: hint-pulse 2s ease-in-out infinite;
}

@keyframes hint-pulse {
  0%, 100% { opacity: 0.3; transform: scaleY(0.6); }
  50% { opacity: 1; transform: scaleY(1); }
}
</style>
