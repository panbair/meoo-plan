<template>
  <div ref="sectionRef" class="cosmic-section">
    <!-- 深空背景 -->
    <div class="cosmic-bg">
      <div class="star-field"></div>
      <div class="nebula-glow"></div>
      <div ref="particlesRef" class="cosmic-particles"></div>
    </div>

    <!-- 内容区域 -->
    <div class="cosmic-content">
      <div ref="badgeRef" class="cosmic-badge">
        <span class="badge-star">✦</span>
        COSMIC REASSEMBLY
        <span class="badge-star">✦</span>
      </div>

      <h2 ref="titleRef" class="cosmic-title">多维星轨</h2>

      <p ref="subtitleRef" class="cosmic-subtitle">空间解构 · 从混沌到秩序</p>

      <!-- 星轨卡片组 -->
      <div ref="cardsContainerRef" class="cosmic-cards-container">
        <div
          v-for="(card, i) in cosmicCards"
          :key="'card-' + i"
          class="cosmic-card"
          :ref="el => cardRefs.set(i, el as HTMLElement)"
          :style="{ '--cosmic-primary': card.primary, '--cosmic-secondary': card.secondary }"
        >
          <!-- 前景切片 -->
          <div :ref="el => frontRefs.set(i, el as HTMLElement)" class="slice-front">
            <div class="slice-icon" v-html="card.icon"></div>
            <div class="slice-title">{{ card.title }}</div>
          </div>

          <!-- 中景切片 -->
          <div :ref="el => midRefs.set(i, el as HTMLElement)" class="slice-mid">
            <p class="slice-desc">{{ card.desc }}</p>
            <div class="slice-metrics">
              <div v-for="(m, mIdx) in card.metrics" :key="mIdx" class="cosmic-metric">
                <span class="metric-num">{{ m.value }}</span>
                <span class="metric-unit">{{ m.unit }}</span>
              </div>
            </div>
          </div>

          <!-- 背景切片 -->
          <div :ref="el => backRefs.set(i, el as HTMLElement)" class="slice-back">
            <div class="slice-decoration">
              <div class="deco-ring ring-1"></div>
              <div class="deco-ring ring-2"></div>
              <div class="deco-ring ring-3"></div>
            </div>
          </div>

          <!-- 粒子光点 -->
          <div :ref="el => particleRefs.set(i, el as HTMLElement)" class="cosmic-particle-container">
            <div v-for="n in 12" :key="n" class="cosmic-particle" :style="{ '--p-angle': n * 30 + 'deg' }"></div>
          </div>

          <!-- 卡片边框 -->
          <div class="card-frame"></div>
        </div>
      </div>

      <!-- 底部装饰 -->
      <div ref="footerRef" class="cosmic-footer">
        <div class="footer-orbit">
          <div class="orbit-line"></div>
          <div class="orbit-dot"></div>
        </div>
        <span class="footer-text">DIMENSIONAL REASSEMBLY</span>
        <div class="footer-orbit reverse">
          <div class="orbit-line"></div>
          <div class="orbit-dot"></div>
        </div>
      </div>
    </div>

    <!-- 滚动指示器 -->
    <div class="scroll-indicator">
      <span class="scroll-text">SCROLL</span>
      <div class="scroll-line"></div>
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
const frontRefs = ref(new Map<number, HTMLElement>())
const midRefs = ref(new Map<number, HTMLElement>())
const backRefs = ref(new Map<number, HTMLElement>())
const particleRefs = ref(new Map<number, HTMLElement>())

const cosmicCards = [
  {
    title: '星际数据',
    desc: '穿越星际的信息洪流，每一比特都是宇宙的记忆',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>',
    primary: '#a855f7',
    secondary: '#6366f1',
    metrics: [
      { value: '10^18', unit: 'bit/s' },
      { value: '4.2', unit: 'ly' },
      { value: '∞', unit: 'dims' }
    ]
  },
  {
    title: '维度折叠',
    desc: '在高维空间中穿梭，瞬间跨越无限可能',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
    primary: '#ec4899',
    secondary: '#f43f5e',
    metrics: [
      { value: '11D', unit: 'space' },
      { value: '0.3', unit: 'ms' },
      { value: '99.9', unit: '%' }
    ]
  },
  {
    title: '量子纠缠',
    desc: '跨越时空的灵魂连接，命运在此交织',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="6" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><path d="M6 9v6c0 3.31 5.1 6 12 6"/><path d="M18 15V9c0-3.31-5.1-6-12-6"/></svg>',
    primary: '#06b6d4',
    secondary: '#14b8a6',
    metrics: [
      { value: '100%', unit: 'sync' },
      { value: 'c', unit: 'limit' },
      { value: 'Ψ', unit: 'state' }
    ]
  }
]

const createParticles = () => {
  if (!particlesRef.value) return

  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div')
    particle.className = 'bg-particle'
    particle.style.cssText = `
      position: absolute;
      width: ${Math.random() * 2 + 0.5}px;
      height: ${Math.random() * 2 + 0.5}px;
      background: rgba(168, 85, 247, ${Math.random() * 0.6 + 0.2});
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: twinkle ${Math.random() * 3 + 2}s ease-in-out infinite;
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
      { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)' }
    )
  }

  // 标题入场
  if (titleRef.value) {
    tl.fromTo(titleRef.value,
      { y: 80, opacity: 0, filter: 'blur(15px)' },
      { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' },
      '-=0.3'
    )
  }

  // 副标题入场
  if (subtitleRef.value) {
    tl.fromTo(subtitleRef.value,
      { y: 40, opacity: 0, letterSpacing: '40px' },
      { y: 0, opacity: 1, letterSpacing: '8px', duration: 0.6, ease: 'power2.out' },
      '-=0.4'
    )
  }

  // 多维星轨卡片入场 - 核心效果
  cardRefs.value.forEach((card, cardIndex) => {
    if (!card) return

    const front = frontRefs.value.get(cardIndex)
    const mid = midRefs.value.get(cardIndex)
    const back = backRefs.value.get(cardIndex)
    const particleContainer = particleRefs.value.get(cardIndex)

    if (!front || !mid || !back) return

    const particles = card.querySelectorAll('.cosmic-particle')

    // 初始散开状态
    gsap.set(front, {
      x: -100, y: -50, rotateY: 30, rotateX: -20,
      filter: 'blur(10px)', opacity: 0.4, scale: 0.9
    })
    gsap.set(mid, {
      x: 0, y: 80, rotateZ: 15,
      filter: 'blur(6px)', opacity: 0.6, scale: 0.95
    })
    gsap.set(back, {
      x: 100, y: -30, rotateY: -40, rotateX: 20,
      filter: 'blur(15px)', opacity: 0.25, scale: 1.05
    })
    gsap.set(particleContainer, { opacity: 0 })
    gsap.set(particles, { scale: 0, opacity: 0 })

    // 创建卡片入场 Timeline
    const cardTl = gsap.timeline()

    // 阶段一：切片聚合
    cardTl.to([front, mid, back], {
      x: 0,
      y: 0,
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      filter: 'blur(0px)',
      opacity: 1,
      scale: 1,
      stagger: 0.1,
      ease: 'power3.out',
      duration: 1.0
    })

    // 粒子容器显现
    .to(particleContainer, {
      opacity: 1,
      duration: 0.2
    }, '-=0.5')

    // 阶段二：聚合瞬间粒子爆发
    .to(particles, {
      scale: 2.5,
      opacity: 1,
      duration: 0.35,
      stagger: { amount: 0.2, from: 'random' },
      ease: 'power2.out'
    })

    .to(particles, {
      scale: 0,
      opacity: 0,
      duration: 0.5,
      stagger: { amount: 0.15, from: 'random' },
      ease: 'power2.in'
    }, '-=0.15')

    // 阶段三：卡片整体微调至完美形态
    .to(card, {
      boxShadow: '0 30px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.15)',
      duration: 0.5,
      ease: 'power2.out'
    }, '-=0.3')

    tl.add(cardTl, cardIndex * 0.25)
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
            y: -80 * self.progress,
            opacity: 1 - self.progress * 2,
            filter: `blur(${15 * self.progress}px)`
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

          const front = frontRefs.value.get(cardIndex)
          const mid = midRefs.value.get(cardIndex)
          const back = backRefs.value.get(cardIndex)
          const particleContainer = particleRefs.value.get(cardIndex)

          if (!front || !mid || !back) return

          const particles = card.querySelectorAll('.cosmic-particle')

          // 初始散开状态
          gsap.set(front, {
            x: -100, y: -50, rotateY: 30, rotateX: -20,
            filter: 'blur(10px)', opacity: 0.4, scale: 0.9
          })
          gsap.set(mid, {
            x: 0, y: 80, rotateZ: 15,
            filter: 'blur(6px)', opacity: 0.6, scale: 0.95
          })
          gsap.set(back, {
            x: 100, y: -30, rotateY: -40, rotateX: 20,
            filter: 'blur(15px)', opacity: 0.25, scale: 1.05
          })
          gsap.set(particleContainer, { opacity: 0 })
          gsap.set(particles, { scale: 0, opacity: 0 })

          const enterTl = gsap.timeline()

          enterTl.to([front, mid, back], {
              x: 0, y: 0, rotateX: 0, rotateY: 0, rotateZ: 0,
              filter: 'blur(0px)', opacity: 1, scale: 1,
              stagger: 0.1, ease: 'power3.out', duration: 1.0
            })
            .to(particleContainer, { opacity: 1, duration: 0.2 }, '-=0.5')
            .to(particles, {
              scale: 2.5, opacity: 1, duration: 0.35,
              stagger: { amount: 0.2, from: 'random' }, ease: 'power2.out'
            })
            .to(particles, {
              scale: 0, opacity: 0, duration: 0.5,
              stagger: { amount: 0.15, from: 'random' }, ease: 'power2.in'
            }, '-=0.15')
            .to(card, {
              boxShadow: '0 30px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.15)',
              duration: 0.5, ease: 'power2.out'
            }, '-=0.3')

          gsap.delayedCall(cardIndex * 0.25, () => enterTl.play())
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
.cosmic-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(180deg, #0a0012 0%, #12001f 50%, #0a0012 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cosmic-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.star-field {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(1px 1px at 20px 30px, rgba(255,255,255,0.8), transparent),
    radial-gradient(1px 1px at 40px 70px, rgba(255,255,255,0.6), transparent),
    radial-gradient(1px 1px at 50px 160px, rgba(255,255,255,0.7), transparent),
    radial-gradient(1px 1px at 90px 40px, rgba(255,255,255,0.5), transparent),
    radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.6), transparent),
    radial-gradient(2px 2px at 160px 120px, rgba(168,85,247,0.8), transparent),
    radial-gradient(1px 1px at 200px 50px, rgba(255,255,255,0.7), transparent),
    radial-gradient(1px 1px at 250px 180px, rgba(255,255,255,0.5), transparent),
    radial-gradient(2px 2px at 300px 90px, rgba(6,182,212,0.7), transparent);
  background-size: 350px 200px;
}

.nebula-glow {
  position: absolute;
  top: 20%;
  left: 10%;
  width: 80%;
  height: 60%;
  background:
    radial-gradient(ellipse at 30% 50%, rgba(168, 85, 247, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 30%, rgba(99, 102, 241, 0.1) 0%, transparent 40%),
    radial-gradient(ellipse at 50% 80%, rgba(236, 72, 153, 0.1) 0%, transparent 45%);
  filter: blur(60px);
}

.cosmic-particles {
  position: absolute;
  inset: 0;
}

@keyframes twinkle {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.5); }
}

.cosmic-content {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 0 40px;
  max-width: 1200px;
  width: 100%;
}

.cosmic-badge {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 10px 24px;
  background: rgba(168, 85, 247, 0.1);
  border: 1px solid rgba(168, 85, 247, 0.3);
  border-radius: 30px;
  color: #a855f7;
  font-family: 'JetBrains Mono', 'Courier New', monospace;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 3px;
  margin-bottom: 30px;
  text-shadow: 0 0 20px rgba(168, 85, 247, 0.5);
}

.badge-star {
  color: #c084fc;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

.cosmic-title {
  font-family: 'Noto Sans SC', 'PingFang SC', sans-serif;
  font-size: clamp(42px, 9vw, 84px);
  font-weight: 800;
  color: #fff;
  margin: 0 0 15px 0;
  letter-spacing: 12px;
  background: linear-gradient(135deg, #a855f7, #6366f1, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: none;
}

.cosmic-subtitle {
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0 0 50px 0;
  letter-spacing: 8px;
}

.cosmic-cards-container {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
  margin-bottom: 60px;
}

.cosmic-card {
  position: relative;
  width: 300px;
  min-height: 400px;
  background: linear-gradient(145deg, rgba(20, 10, 35, 0.9), rgba(10, 5, 20, 0.95));
  border: 1px solid rgba(168, 85, 247, 0.2);
  border-radius: 20px;
  overflow: visible;
  transform-style: preserve-3d;
  perspective: 1000px;
  transition: transform 0.4s ease;
}

.cosmic-card:hover {
  transform: translateY(-10px) rotateX(2deg);
}

.slice-front,
.slice-mid,
.slice-back {
  position: absolute;
  inset: 0;
  border-radius: 20px;
  backface-visibility: hidden;
}

.slice-front {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(99, 102, 241, 0.1));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  z-index: 3;
}

.slice-mid {
  background: linear-gradient(180deg, rgba(15, 8, 28, 0.95), rgba(25, 15, 40, 0.9));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 25px;
  z-index: 2;
}

.slice-back {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.05));
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slice-icon {
  width: 64px;
  height: 64px;
  color: var(--cosmic-primary, #a855f7);
  margin-bottom: 20px;
  filter: drop-shadow(0 0 20px currentColor);
}

.slice-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.slice-title {
  font-family: 'Noto Sans SC', 'PingFang SC', sans-serif;
  font-size: 26px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 6px;
  text-shadow: 0 0 30px rgba(168, 85, 247, 0.5);
}

.slice-desc {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 25px 0;
  line-height: 1.8;
  text-align: center;
}

.slice-metrics {
  display: flex;
  justify-content: space-around;
  width: 100%;
  padding: 15px 0;
  border-top: 1px solid rgba(168, 85, 247, 0.2);
}

.cosmic-metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.metric-num {
  font-family: 'JetBrains Mono', 'Courier New', monospace;
  font-size: 18px;
  font-weight: 700;
  color: var(--cosmic-primary, #a855f7);
}

.metric-unit {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.slice-decoration {
  position: relative;
  width: 150px;
  height: 150px;
}

.deco-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(168, 85, 247, 0.2);
  animation: orbit-spin 20s linear infinite;
}

.ring-1 {
  inset: 0;
  border-color: rgba(168, 85, 247, 0.3);
}

.ring-2 {
  inset: 15px;
  border-color: rgba(99, 102, 241, 0.25);
  animation-direction: reverse;
  animation-duration: 15s;
}

.ring-3 {
  inset: 35px;
  border-color: rgba(236, 72, 153, 0.2);
  animation-duration: 25s;
}

@keyframes orbit-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.cosmic-particle-container {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 10;
}

.cosmic-particle {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 6px;
  height: 6px;
  background: var(--cosmic-primary, #a855f7);
  border-radius: 50%;
  transform: translate(-50%, -50%) rotate(var(--p-angle, 0deg)) translateX(80px);
  box-shadow: 0 0 10px currentColor;
}

.card-frame {
  position: absolute;
  inset: 0;
  border-radius: 20px;
  border: 1px solid transparent;
  background: linear-gradient(135deg, var(--cosmic-primary, #a855f7), var(--cosmic-secondary, #6366f1)) border-box;
  -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  opacity: 0.4;
}

.cosmic-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  color: rgba(168, 85, 247, 0.5);
  font-size: 11px;
  letter-spacing: 4px;
}

.footer-orbit {
  position: relative;
  width: 80px;
  height: 1px;
}

.footer-orbit.reverse {
  transform: scaleX(-1);
}

.orbit-line {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.5), transparent);
}

.orbit-dot {
  position: absolute;
  top: 50%;
  right: 0;
  width: 6px;
  height: 6px;
  background: #a855f7;
  border-radius: 50%;
  transform: translate(50%, -50%);
  box-shadow: 0 0 10px #a855f7;
  animation: orbit-pulse 2s ease-in-out infinite;
}

@keyframes orbit-pulse {
  0%, 100% { opacity: 0.5; transform: translate(50%, -50%) scale(1); }
  50% { opacity: 1; transform: translate(50%, -50%) scale(1.5); }
}

.scroll-indicator {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: rgba(168, 85, 247, 0.5);
  font-size: 10px;
  letter-spacing: 2px;
  z-index: 100;
}

.scroll-line {
  width: 1px;
  height: 40px;
  background: linear-gradient(180deg, rgba(168, 85, 247, 0.5), transparent);
  animation: scroll-anim 2s ease-in-out infinite;
}

@keyframes scroll-anim {
  0%, 100% { opacity: 0.3; transform: scaleY(0.5); }
  50% { opacity: 1; transform: scaleY(1); }
}
</style>
