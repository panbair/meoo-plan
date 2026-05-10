<template>
  <div ref="sectionRef" class="gravity-section">
    <!-- 深色背景 -->
    <div class="gravity-bg">
      <div class="bg-gradient"></div>
      <div class="bg-grid"></div>
      <div ref="particlesRef" class="gravity-particles"></div>
    </div>

    <!-- 内容区域 -->
    <div class="gravity-content">
      <div ref="badgeRef" class="gravity-badge">
        <span class="badge-icon">⬡</span>
        GRAVITY COLLAPSE
        <span class="badge-icon">⬡</span>
      </div>

      <h2 ref="titleRef" class="gravity-title">重力崩塌</h2>

      <p ref="subtitleRef" class="gravity-subtitle">物理震撼 · 坠入重组</p>

      <!-- 重力卡片组 -->
      <div ref="cardsContainerRef" class="gravity-cards-container">
        <div
          v-for="(card, i) in gravityCards"
          :key="'card-' + i"
          class="gravity-card"
          :ref="el => cardRefs.set(i, el as HTMLElement)"
          :style="{ '--g-primary': card.primary, '--g-secondary': card.secondary }"
        >
          <!-- 图标 -->
          <div :ref="el => iconRefs.set(i, el as HTMLElement)" class="card-icon" v-html="card.icon"></div>

          <!-- 标题 -->
          <h3 :ref="el => titleRefs.set(i, el as HTMLElement)" class="card-title">{{ card.title }}</h3>

          <!-- 分割线 -->
          <div :ref="el => dividerRefs.set(i, el as HTMLElement)" class="card-divider"></div>

          <!-- 描述 -->
          <p :ref="el => descRefs.set(i, el as HTMLElement)" class="card-desc">{{ card.desc }}</p>

          <!-- 数值 -->
          <div class="card-value">
            <span class="value-num">{{ card.value }}</span>
            <span class="value-unit">{{ card.unit }}</span>
          </div>

          <!-- 标签 -->
          <div class="card-tags">
            <span v-for="(tag, tIdx) in card.tags" :key="tIdx" class="tag">{{ tag }}</span>
          </div>

          <!-- 边框 -->
          <div class="card-border"></div>
        </div>
      </div>

      <!-- 底部装饰 -->
      <div ref="footerRef" class="gravity-footer">
        <div class="footer-gauge">
          <div class="gauge-track">
            <div ref="gaugeFillRef" class="gauge-fill"></div>
          </div>
          <span class="gauge-label">GRAVITY FORCE</span>
        </div>
      </div>
    </div>

    <!-- 滚动指示器 -->
    <div class="scroll-indicator">
      <span>DROP</span>
      <div class="indicator-arrow">↓</div>
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
const gaugeFillRef = ref<HTMLElement | null>(null)

const cardRefs = ref(new Map<number, HTMLElement>())
const iconRefs = ref(new Map<number, HTMLElement>())
const titleRefs = ref(new Map<number, HTMLElement>())
const dividerRefs = ref(new Map<number, HTMLElement>())
const descRefs = ref(new Map<number, HTMLElement>())

const gravityCards = [
  {
    title: '自由落体',
    desc: '失去悬浮支撑的瞬间，重力开始主导一切',
    value: '9.8',
    unit: 'm/s²',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2v20M12 22l-4-4M12 22l4-4M5 12l4-4M5 12l-4 4M19 12l-4-4M19 12l4 4"/></svg>',
    primary: '#64748b',
    secondary: '#475569',
    tags: ['物理', '加速度', '牛顿']
  },
  {
    title: '惯性坠落',
    desc: '高速下落的物体保持着运动的惯性',
    value: '72',
    unit: 'km/h',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
    primary: '#94a3b8',
    secondary: '#64748b',
    tags: ['惯性', '速度', '动量']
  },
  {
    title: '重力回弹',
    desc: '碰撞地面的瞬间，能量以弹性形式释放',
    value: '0.65',
    unit: 'e',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4l7.07 17.07L12 14l7.07 7.07L4 4z"/></svg>',
    primary: '#cbd5e1',
    secondary: '#94a3b8',
    tags: ['弹性', '碰撞', '能量']
  }
]

const createParticles = () => {
  if (!particlesRef.value) return

  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div')
    particle.className = 'gravity-particle'
    particle.style.cssText = `
      position: absolute;
      width: ${Math.random() * 2 + 1}px;
      height: ${Math.random() * 2 + 1}px;
      background: rgba(148, 163, 184, ${Math.random() * 0.4 + 0.1});
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: fall ${Math.random() * 5 + 3}s linear infinite;
      animation-delay: ${Math.random() * 3}s;
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
      { y: 80, opacity: 0, filter: 'blur(10px)' },
      { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out' },
      '-=0.3'
    )
  }

  // 副标题入场
  if (subtitleRef.value) {
    tl.fromTo(subtitleRef.value,
      { y: 40, opacity: 0, letterSpacing: '30px' },
      { y: 0, opacity: 1, letterSpacing: '6px', duration: 0.5, ease: 'power2.out' },
      '-=0.4'
    )
  }

  // 重力卡片入场 - 核心效果
  cardRefs.value.forEach((card, cardIndex) => {
    if (!card) return

    const icon = iconRefs.value.get(cardIndex)
    const title = titleRefs.value.get(cardIndex)
    const divider = dividerRefs.value.get(cardIndex)
    const desc = descRefs.value.get(cardIndex)

    if (!icon || !title || !divider || !desc) return

    // 初始悬浮高度
    gsap.set(card, { y: -100, opacity: 0.6, boxShadow: '0 0px 0px rgba(0,0,0,0)' })
    gsap.set(icon, { y: -50, opacity: 0, scale: 1.4 })
    gsap.set(title, { y: 40, opacity: 0 })
    gsap.set(divider, { scaleX: 0, opacity: 0 })
    gsap.set(desc, { y: 30, opacity: 0 })

    // 创建卡片入场 Timeline
    const cardTl = gsap.timeline()

    // 卡片主体坠入（模拟重力加速度）
    cardTl.to(card, {
      y: 0,
      opacity: 1,
      duration: 0.7,
      ease: 'power4.in',
      onComplete: () => {
        // 落地瞬间阴影炸裂
        gsap.to(card, {
          boxShadow: '0 30px 60px rgba(0,0,0,0.35)',
          duration: 0.3,
          ease: 'power2.out'
        })
      }
    })

    // 图标延迟下落（被震落的感觉）
    .to(icon, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.5,
      ease: 'back.out(2)'
    }, '-=0.35')

    // 标题甩入
    .to(title, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: 'back.out(1.5)'
    }, '-=0.45')

    // 分割线延伸
    .to(divider, {
      scaleX: 1,
      opacity: 1,
      duration: 0.5,
      ease: 'power3.out'
    }, '-=0.35')

    // 描述文字浮现
    .to(desc, {
      y: 0,
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out'
    }, '-=0.3')

    tl.add(cardTl, cardIndex * 0.18)
  })

  // 底部仪表盘入场
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
            y: -80 * self.progress,
            opacity: 1 - self.progress * 2,
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

          const icon = iconRefs.value.get(cardIndex)
          const title = titleRefs.value.get(cardIndex)
          const divider = dividerRefs.value.get(cardIndex)
          const desc = descRefs.value.get(cardIndex)

          if (!icon || !title || !divider || !desc) return

          // 初始悬浮高度
          gsap.set(card, { y: -100, opacity: 0.6, boxShadow: '0 0px 0px rgba(0,0,0,0)' })
          gsap.set(icon, { y: -50, opacity: 0, scale: 1.4 })
          gsap.set(title, { y: 40, opacity: 0 })
          gsap.set(divider, { scaleX: 0, opacity: 0 })
          gsap.set(desc, { y: 30, opacity: 0 })

          const enterTl = gsap.timeline()

          enterTl.to(card, {
              y: 0, opacity: 1, duration: 0.7, ease: 'power4.in',
              onComplete: () => {
                gsap.to(card, {
                  boxShadow: '0 30px 60px rgba(0,0,0,0.35)',
                  duration: 0.3, ease: 'power2.out'
                })
              }
            })
            .to(icon, {
              y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)'
            }, '-=0.35')
            .to(title, {
              y: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.5)'
            }, '-=0.45')
            .to(divider, {
              scaleX: 1, opacity: 1, duration: 0.5, ease: 'power3.out'
            }, '-=0.35')
            .to(desc, {
              y: 0, opacity: 1, duration: 0.5, ease: 'power2.out'
            }, '-=0.3')

          gsap.delayedCall(cardIndex * 0.18, () => enterTl.play())
        })
      }
    })
    cleanupFns.push(() => cardsSt.kill())
  }

  // 仪表盘填充动画
  if (gaugeFillRef.value) {
    const gaugeSt = ScrollTrigger.create({
      trigger: sectionRef.value,
      start: 'top 50%',
      end: 'bottom 80%',
      scrub: 1,
      onUpdate: (self) => {
        if (gaugeFillRef.value) {
          gsap.set(gaugeFillRef.value, { width: `${self.progress * 100}%` })
        }
      }
    })
    cleanupFns.push(() => gaugeSt.kill())
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
.gravity-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(180deg, #0f0f0f 0%, #1a1a1a 50%, #0a0a0a 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gravity-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.bg-gradient {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 60% 40% at 50% 0%, rgba(100, 116, 139, 0.08) 0%, transparent 60%),
    radial-gradient(ellipse 80% 60% at 50% 100%, rgba(71, 85, 105, 0.1) 0%, transparent 50%);
}

.bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(100, 116, 139, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(100, 116, 139, 0.03) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: linear-gradient(180deg, transparent, black 30%, black 70%, transparent);
}

.gravity-particles {
  position: absolute;
  inset: 0;
}

@keyframes fall {
  0% {
    transform: translateY(-20px);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  100% {
    transform: translateY(100vh);
    opacity: 0;
  }
}

.gravity-content {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 0 40px;
  max-width: 1200px;
  width: 100%;
}

.gravity-badge {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 10px 24px;
  background: rgba(100, 116, 139, 0.1);
  border: 1px solid rgba(100, 116, 139, 0.25);
  border-radius: 4px;
  color: #94a3b8;
  font-family: 'JetBrains Mono', 'Courier New', monospace;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 3px;
  margin-bottom: 30px;
}

.badge-icon {
  color: #64748b;
  font-size: 10px;
}

.gravity-title {
  font-family: 'Noto Sans SC', 'PingFang SC', sans-serif;
  font-size: clamp(42px, 9vw, 84px);
  font-weight: 800;
  color: #fff;
  margin: 0 0 15px 0;
  letter-spacing: 12px;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.5);
}

.gravity-subtitle {
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.4);
  margin: 0 0 50px 0;
  letter-spacing: 6px;
}

.gravity-cards-container {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
  margin-bottom: 60px;
}

.gravity-card {
  position: relative;
  width: 280px;
  min-height: 340px;
  background: linear-gradient(145deg, #1a1a1a 0%, #0f0f0f 100%);
  border: 1px solid rgba(100, 116, 139, 0.15);
  border-radius: 12px;
  overflow: hidden;
  padding: 35px 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.3s ease, border-color 0.3s ease;
}

.gravity-card:hover {
  transform: translateY(-5px);
  border-color: rgba(100, 116, 139, 0.3);
}

.card-icon {
  width: 52px;
  height: 52px;
  color: var(--g-primary, #64748b);
  margin-bottom: 20px;
  filter: drop-shadow(0 0 10px currentColor);
}

.card-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.card-title {
  font-family: 'Noto Sans SC', 'PingFang SC', sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 15px 0;
  letter-spacing: 3px;
}

.card-divider {
  width: 60px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--g-primary, #64748b), transparent);
  margin-bottom: 15px;
  transform-origin: center;
}

.card-desc {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0 0 20px 0;
  line-height: 1.7;
  flex-grow: 1;
}

.card-value {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 15px;
}

.value-num {
  font-family: 'JetBrains Mono', 'Courier New', monospace;
  font-size: 32px;
  font-weight: 700;
  color: var(--g-primary, #64748b);
}

.value-unit {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 1px;
}

.card-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.tag {
  padding: 4px 10px;
  background: rgba(100, 116, 139, 0.1);
  border: 1px solid rgba(100, 116, 139, 0.2);
  border-radius: 10px;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.4);
}

.card-border {
  position: absolute;
  inset: 0;
  border-radius: 12px;
  border: 1px solid transparent;
  background: linear-gradient(180deg, var(--g-primary, #64748b), var(--g-secondary, #475569)) border-box;
  -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  opacity: 0.3;
}

.gravity-footer {
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer-gauge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.gauge-track {
  width: 200px;
  height: 4px;
  background: rgba(100, 116, 139, 0.15);
  border-radius: 2px;
  overflow: hidden;
}

.gauge-fill {
  width: 0;
  height: 100%;
  background: linear-gradient(90deg, #475569, #94a3b8, #e2e8f0);
  border-radius: 2px;
  transition: width 0.1s linear;
}

.gauge-label {
  font-family: 'JetBrains Mono', 'Courier New', monospace;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.3);
  letter-spacing: 3px;
}

.scroll-indicator {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: rgba(100, 116, 139, 0.4);
  font-size: 10px;
  letter-spacing: 2px;
  z-index: 100;
}

.indicator-arrow {
  font-size: 16px;
  animation: bounce-down 1.5s ease-in-out infinite;
}

@keyframes bounce-down {
  0%, 100% { transform: translateY(0); opacity: 0.4; }
  50% { transform: translateY(8px); opacity: 1; }
}
</style>
