<template>
  <div ref="sectionRef" class="card-depth-parallax">
    <!-- 多层背景 -->
    <div class="depth-bg-layers">
      <div ref="bgStar1Ref" class="bg-stars stars-1"></div>
      <div ref="bgStar2Ref" class="bg-stars stars-2"></div>
      <div ref="bgStar3Ref" class="bg-stars stars-3"></div>
      <div ref="bgNebulaRef" class="bg-nebula"></div>
      <div class="depth-particles" ref="particlesRef"></div>
    </div>

    <!-- 内容区域 -->
    <div class="depth-content">
      <div ref="badgeRef" class="depth-badge">
        <span class="badge-dot"></span>
        DEPTH PARALLAX
        <span class="badge-dot"></span>
      </div>

      <h2 ref="titleRef" class="depth-title">深度视差</h2>

      <p ref="subtitleRef" class="depth-subtitle">探索多层空间交织的视觉深度</p>

      <!-- 深度层级卡片 - 横向排列 -->
      <div ref="cardsContainerRef" class="depth-cards-container">
        <!-- 左装饰线 -->
        <div ref="lineLeftRef" class="depth-line depth-line-left">
          <div class="line-inner"></div>
        </div>

        <!-- 主卡片区域 -->
        <div class="depth-cards-main">
          <div
            v-for="(card, i) in depthCards"
            :key="'card-' + i"
            :ref="el => cardRefs.set(i, el as HTMLElement)"
            class="depth-main-card"
            :class="'card-level-' + (i + 1)"
            :style="{ '--card-hue': card.hue, '--card-index': i }"
            :data-depth="card.depth"
          >
            <div class="card-glow-bg"></div>
            <div class="card-content">
              <div class="card-level-tag">{{ card.level }}</div>
              <div class="card-icon-wrap">
                <div class="card-icon" v-html="card.icon"></div>
              </div>
              <h3 class="card-title">{{ card.title }}</h3>
              <p class="card-desc">{{ card.desc }}</p>
              <div class="card-meta">
                <div class="meta-value">{{ card.value }}</div>
                <div class="meta-label">{{ card.label }}</div>
              </div>
            </div>
            <div class="card-reflection"></div>
            <div class="card-border-glow"></div>
          </div>
        </div>

        <!-- 右装饰线 -->
        <div ref="lineRightRef" class="depth-line depth-line-right">
          <div class="line-inner"></div>
        </div>
      </div>

      <!-- 底部装饰 -->
      <div ref="footerRef" class="depth-footer">
        <div class="footer-line"></div>
        <span class="footer-text">DRAG TO EXPLORE DEPTH</span>
        <div class="footer-line"></div>
      </div>
    </div>

    <!-- 角落装饰 -->
    <div class="depth-corner corner-tl"></div>
    <div class="depth-corner corner-tr"></div>
    <div class="depth-corner corner-bl"></div>
    <div class="depth-corner corner-br"></div>

    <!-- 扫描线 -->
    <div class="scan-line" ref="scanLineRef"></div>

    <!-- 深度指示器 -->
    <div ref="indicatorRef" class="depth-indicator">
      <div class="indicator-dot" v-for="i in 5" :key="i" :class="'dot-' + i"></div>
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
const footerRef = ref<HTMLElement | null>(null)
const lineLeftRef = ref<HTMLElement | null>(null)
const lineRightRef = ref<HTMLElement | null>(null)
const indicatorRef = ref<HTMLElement | null>(null)
const scanLineRef = ref<HTMLElement | null>(null)
const particlesRef = ref<HTMLElement | null>(null)
const bgStar1Ref = ref<HTMLElement | null>(null)
const bgStar2Ref = ref<HTMLElement | null>(null)
const bgStar3Ref = ref<HTMLElement | null>(null)
const bgNebulaRef = ref<HTMLElement | null>(null)
const cardRefs = ref(new Map<number, HTMLElement>())

const depthCards = [
  {
    title: '星际穿越',
    desc: '穿越无限宇宙的边界',
    value: '∞',
    label: '维度空间',
    level: 'LEVEL 01',
    depth: 0.1,
    hue: 270,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>'
  },
  {
    title: '维度之门',
    desc: '开启通往未知的大门',
    value: '4D',
    label: '空间维度',
    level: 'LEVEL 02',
    depth: 0.25,
    hue: 320,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="12" cy="12" r="4"/><path d="M12 3v2m0 14v2m9-9h-2M5 12H3"/></svg>'
  },
  {
    title: '时间漩涡',
    desc: '穿梭于过去与未来之间',
    value: '∞',
    label: '时间流速',
    level: 'LEVEL 03',
    depth: 0.4,
    hue: 190,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/><path d="M2 12h2m16 0h2"/></svg>'
  },
  {
    title: '量子纠缠',
    desc: '跨越时空的神秘联结',
    value: '100%',
    label: '纠缠态',
    level: 'LEVEL 04',
    depth: 0.55,
    hue: 45,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="6" cy="12" r="3"/><circle cx="18" cy="12" r="3"/><path d="M9 12h6"/></svg>'
  },
  {
    title: '能量场域',
    desc: '汇聚宇宙的无限能量',
    value: '10K',
    label: '能量单位',
    level: 'LEVEL 05',
    depth: 0.7,
    hue: 150,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>'
  }
]

const createParticles = () => {
  if (!particlesRef.value) return
  const container = particlesRef.value
  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div')
    particle.className = 'particle'
    particle.style.cssText = `
      position: absolute;
      width: ${Math.random() * 3 + 1}px;
      height: ${Math.random() * 3 + 1}px;
      background: hsla(${Math.random() * 60 + 250}, 70%, 60%, ${Math.random() * 0.5 + 0.3});
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: particleFloat ${Math.random() * 10 + 10}s ease-in-out infinite;
      animation-delay: ${Math.random() * 5}s;
    `
    container.appendChild(particle)
  }
}

const initAnimations = () => {
  if (!sectionRef.value) return

  // 入场动画
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 70%',
      toggleActions: 'play none none none'
    }
  })

  tl.fromTo(badgeRef.value,
    { scale: 0, opacity: 0, y: -30 },
    { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)' }
  )
  .fromTo(titleRef.value,
    { y: 60, opacity: 0, filter: 'blur(15px)' },
    { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out' },
    '-=0.3'
  )
  .fromTo(subtitleRef.value,
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
    '-=0.3'
  )
  .fromTo(lineLeftRef.value,
    { scaleX: 0, opacity: 0 },
    { scaleX: 1, opacity: 1, duration: 0.6, ease: 'power2.out' },
    '-=0.2'
  )
  .fromTo(lineRightRef.value,
    { scaleX: 0, opacity: 0 },
    { scaleX: 1, opacity: 1, duration: 0.6, ease: 'power2.out' },
    '-=0.5'
  )

  // 卡片入场
  const cards = cardRefs.value
  cards.forEach((card, i) => {
    if (!card) return
    const depth = depthCards[i]?.depth || 0.3
    gsap.set(card, {
      opacity: 0,
      y: 80 * (1 - depth),
      scale: 0.8 + depth * 0.2,
      filter: `blur(${(1 - depth) * 8}px)`,
      rotateY: 15 * (i % 2 === 0 ? 1 : -1)
    })
    tl.to(card,
      {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        rotateY: 0,
        duration: 0.7,
        ease: 'power3.out'
      },
      `-=${0.4 - i * 0.05}`
    )
  })

  tl.fromTo(footerRef.value,
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
    '-=0.2'
  )

  cleanupFns.push(() => tl.kill())

  // 背景星星视差
  const starLayers = [
    { ref: bgStar1Ref, depth: 0.02 },
    { ref: bgStar2Ref, depth: 0.05 },
    { ref: bgStar3Ref, depth: 0.08 }
  ]

  starLayers.forEach(({ ref, depth }) => {
    if (!ref?.value) return
    const st = ScrollTrigger.create({
      trigger: sectionRef.value,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 2,
      onUpdate: (self) => {
        gsap.set(ref.value, {
          y: self.progress * -100 * depth * 100,
          scale: 1 + self.progress * 0.2
        })
      }
    })
    cleanupFns.push(() => st.kill())
  })

  // 星云效果
  if (bgNebulaRef.value) {
    const nebulaSt = ScrollTrigger.create({
      trigger: sectionRef.value,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.5,
      onUpdate: (self) => {
        gsap.set(bgNebulaRef.value, {
          x: self.progress * -80,
          scale: 1 + self.progress * 0.3,
          opacity: 0.5 + self.progress * 0.4
        })
      }
    })
    cleanupFns.push(() => nebulaSt.kill())
  }

  // 标题滚动效果
  if (titleRef.value) {
    const titleSt = ScrollTrigger.create({
      trigger: titleRef.value,
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1.2,
      onUpdate: (self) => {
        gsap.set(titleRef.value, {
          y: -60 * self.progress,
          opacity: 1 - self.progress * 1.5,
          scale: 1 - self.progress * 0.1
        })
      }
    })
    cleanupFns.push(() => titleSt.kill())
  }

  // 副标题滚动效果
  if (subtitleRef.value) {
    const subSt = ScrollTrigger.create({
      trigger: subtitleRef.value,
      start: 'top 80%',
      end: 'top 25%',
      scrub: 1,
      onUpdate: (self) => {
        gsap.set(subtitleRef.value, {
          y: -30 * self.progress,
          opacity: 1 - self.progress * 1.2
        })
      }
    })
    cleanupFns.push(() => subSt.kill())
  }

  // 卡片滚动视差
  cards.forEach((card, i) => {
    if (!card) return
    const depth = parseFloat(card.dataset.depth || '0.3')
    const yRange = (1 - depth) * 100

    const cardSt = ScrollTrigger.create({
      trigger: card,
      start: 'top 85%',
      end: 'bottom 15%',
      scrub: 1.5,
      onUpdate: (self) => {
        gsap.set(card, {
          y: (self.progress - 0.5) * yRange,
          scale: 1 - (1 - depth) * 0.1 * Math.abs(self.progress - 0.5) * 2,
          filter: `brightness(${1 + (1 - depth) * 0.3 * Math.abs(self.progress - 0.5) * 2})`
        })
      }
    })
    cleanupFns.push(() => cardSt.kill())
  })

  // 扫描线
  if (scanLineRef.value) {
    gsap.to(scanLineRef.value, {
      top: '100%',
      duration: 3,
      ease: 'none',
      repeat: -1,
      repeatDelay: 2
    })
  }

  // 鼠标交互
  cards.forEach((card) => {
    if (!card) return
    card.addEventListener('mousemove', (e: Event) => {
      const mouseEvent = e as MouseEvent
      const rect = card.getBoundingClientRect()
      const x = (mouseEvent.clientX - rect.left) / rect.width - 0.5
      const y = (mouseEvent.clientY - rect.top) / rect.height - 0.5

      gsap.to(card, {
        rotateY: x * 12,
        rotateX: -y * 12,
        duration: 0.4,
        ease: 'power2.out'
      })
    })

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)'
      })
    })
  })

  // 粒子动画
  gsap.to(particlesRef.value, {
    y: -15,
    duration: 3,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1
  })
}

onMounted(() => {
  createParticles()
  initAnimations()
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
.card-depth-parallax {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 40%, #16213e 70%, #0f0f23 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

// 多层背景
.depth-bg-layers {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.bg-stars {
  position: absolute;
  inset: -50px;
  background-repeat: repeat;
}

.stars-1 {
  background-image:
    radial-gradient(1.5px 1.5px at 20px 30px, white, transparent),
    radial-gradient(1px 1px at 40px 70px, rgba(255,255,255,0.8), transparent),
    radial-gradient(1px 1px at 50px 160px, rgba(255,255,255,0.6), transparent),
    radial-gradient(1px 1px at 90px 40px, white, transparent),
    radial-gradient(2px 2px at 130px 80px, rgba(167, 139, 250, 0.8), transparent);
  background-size: 180px 180px;
  opacity: 0.5;
}

.stars-2 {
  background-image:
    radial-gradient(1px 1px at 10px 10px, rgba(167, 139, 250, 0.6), transparent),
    radial-gradient(1px 1px at 30px 50px, rgba(255,255,255,0.5), transparent),
    radial-gradient(2px 2px at 70px 90px, rgba(236, 72, 153, 0.5), transparent);
  background-size: 140px 140px;
  opacity: 0.35;
}

.stars-3 {
  background-image:
    radial-gradient(1px 1px at 25px 25px, rgba(6, 182, 212, 0.4), transparent),
    radial-gradient(2px 2px at 55px 75px, rgba(167, 139, 250, 0.3), transparent);
  background-size: 100px 100px;
  opacity: 0.25;
}

.bg-nebula {
  position: absolute;
  width: 700px;
  height: 700px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(ellipse at center,
    rgba(139, 92, 246, 0.2) 0%,
    rgba(236, 72, 153, 0.1) 40%,
    transparent 70%
  );
  filter: blur(60px);
}

.depth-particles {
  position: absolute;
  inset: 0;
}

// 内容区域
.depth-content {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 40px;
  max-width: 1400px;
  width: 100%;
}

.depth-badge {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 10px 28px;
  background: rgba(139, 92, 246, 0.12);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 30px;
  color: #c4b5fd;
  font-size: 11px;
  letter-spacing: 4px;
  font-weight: 600;
  margin-bottom: 20px;
  backdrop-filter: blur(10px);

  .badge-dot {
    width: 6px;
    height: 6px;
    background: #8b5cf6;
    border-radius: 50%;
    animation: badgePulse 2s ease-in-out infinite;
  }
}

@keyframes badgePulse {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

.depth-title {
  font-family: 'Orbitron', 'Rajdhani', sans-serif;
  font-size: 56px;
  font-weight: 900;
  letter-spacing: 12px;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #fff 0%, #c4b5fd 50%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 40px rgba(139, 92, 246, 0.4));
}

.depth-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.45);
  letter-spacing: 4px;
  margin-bottom: 50px;
}

// 卡片容器
.depth-cards-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 20px 0;
}

.depth-line {
  width: 60px;
  height: 200px;
  position: relative;
  flex-shrink: 0;

  .line-inner {
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(to bottom,
      transparent 0%,
      rgba(139, 92, 246, 0.3) 30%,
      rgba(139, 92, 246, 0.5) 50%,
      rgba(139, 92, 246, 0.3) 70%,
      transparent 100%
    );
    transform: translateX(-50%);

    &::before,
    &::after {
      content: '';
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      width: 6px;
      height: 6px;
      background: #8b5cf6;
      border-radius: 50%;
    }

    &::before { top: 0; }
    &::after { bottom: 0; }
  }
}

.depth-cards-main {
  display: flex;
  gap: 24px;
  justify-content: center;
}

// 主卡片样式
.depth-main-card {
  position: relative;
  width: 200px;
  height: 320px;
  background: linear-gradient(145deg,
    rgba(30, 30, 60, 0.9) 0%,
    rgba(15, 15, 35, 0.95) 100%
  );
  border-radius: 20px;
  border: 1px solid rgba(139, 92, 246, 0.2);
  overflow: hidden;
  cursor: pointer;
  transform-style: preserve-3d;
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  &:hover {
    transform: translateY(-15px) scale(1.03);
    border-color: hsla(var(--card-hue), 70%, 60%, 0.5);
    box-shadow:
      0 30px 60px rgba(0, 0, 0, 0.4),
      0 0 50px hsla(var(--card-hue), 70%, 60%, 0.15);
  }

  .card-glow-bg {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at top,
      hsla(var(--card-hue), 70%, 60%, 0.15) 0%,
      transparent 60%
    );
    pointer-events: none;
  }

  .card-content {
    position: relative;
    z-index: 2;
    padding: 24px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
  }

  .card-level-tag {
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 3px;
    color: hsla(var(--card-hue), 70%, 60%, 0.7);
    margin-bottom: 16px;
    padding: 4px 12px;
    background: hsla(var(--card-hue), 70%, 60%, 0.1);
    border-radius: 4px;
    border: 1px solid hsla(var(--card-hue), 70%, 60%, 0.2);
  }

  .card-icon-wrap {
    width: 60px;
    height: 60px;
    margin-bottom: 16px;
    background: linear-gradient(135deg,
      hsla(var(--card-hue), 70%, 60%, 0.2) 0%,
      hsla(var(--card-hue), 70%, 50%, 0.1) 100%
    );
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid hsla(var(--card-hue), 70%, 60%, 0.2);
    transition: all 0.3s;

    .card-icon {
      width: 32px;
      height: 32px;
      color: hsla(var(--card-hue), 70%, 70%, 1);

      :deep(svg) {
        width: 100%;
        height: 100%;
      }
    }
  }

  &:hover .card-icon-wrap {
    transform: scale(1.1) rotate(5deg);
    background: linear-gradient(135deg,
      hsla(var(--card-hue), 70%, 60%, 0.3) 0%,
      hsla(var(--card-hue), 70%, 50%, 0.2) 100%
    );
  }

  .card-title {
    font-size: 18px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 10px;
    letter-spacing: 1px;
  }

  .card-desc {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.5);
    line-height: 1.6;
    text-align: center;
    flex: 1;
  }

  .card-meta {
    margin-top: auto;
    padding-top: 16px;
    border-top: 1px solid rgba(139, 92, 246, 0.15);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;

    .meta-value {
      font-family: 'Orbitron', sans-serif;
      font-size: 24px;
      font-weight: 700;
      color: hsla(var(--card-hue), 70%, 70%, 1);
    }

    .meta-label {
      font-size: 10px;
      color: rgba(255, 255, 255, 0.4);
      letter-spacing: 2px;
      text-transform: uppercase;
    }
  }

  .card-reflection {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60%;
    background: linear-gradient(to top,
      hsla(var(--card-hue), 70%, 60%, 0.08) 0%,
      transparent 100%
    );
    pointer-events: none;
  }

  .card-border-glow {
    position: absolute;
    inset: -1px;
    border-radius: 20px;
    background: linear-gradient(135deg,
      hsla(var(--card-hue), 70%, 60%, 0.3) 0%,
      transparent 50%,
      hsla(var(--card-hue), 70%, 60%, 0.1) 100%
    );
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:hover .card-border-glow {
    opacity: 1;
  }
}

// 底部装饰
.depth-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 40px;

  .footer-line {
    width: 80px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.3), transparent);
  }

  .footer-text {
    font-size: 10px;
    letter-spacing: 4px;
    color: rgba(255, 255, 255, 0.3);
  }
}

// 角落装饰
.depth-corner {
  position: absolute;
  width: 60px;
  height: 60px;
  border: 1px solid rgba(139, 92, 246, 0.15);
  pointer-events: none;

  &.corner-tl {
    top: 25px;
    left: 25px;
    border-right: none;
    border-bottom: none;
  }

  &.corner-tr {
    top: 25px;
    right: 25px;
    border-left: none;
    border-bottom: none;
  }

  &.corner-bl {
    bottom: 25px;
    left: 25px;
    border-right: none;
    border-top: none;
  }

  &.corner-br {
    bottom: 25px;
    right: 25px;
    border-left: none;
    border-top: none;
  }
}

// 扫描线
.scan-line {
  position: absolute;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.3), transparent);
  pointer-events: none;
  z-index: 20;
}

// 深度指示器
.depth-indicator {
  position: absolute;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 12px;

  .indicator-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(139, 92, 246, 0.3);
    border: 1px solid rgba(139, 92, 246, 0.5);
    transition: all 0.3s;

    &.dot-1 { --dot-hue: 270; }
    &.dot-2 { --dot-hue: 320; }
    &.dot-3 { --dot-hue: 190; }
    &.dot-4 { --dot-hue: 45; }
    &.dot-5 { --dot-hue: 150; }

    &:hover {
      background: hsla(var(--dot-hue), 70%, 60%, 0.8);
      transform: scale(1.3);
      box-shadow: 0 0 15px hsla(var(--dot-hue), 70%, 60%, 0.5);
    }
  }
}

// 粒子动画
:global(.particle) {
  animation: particleFloat 15s ease-in-out infinite;
}

@keyframes particleFloat {
  0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
  25% { transform: translateY(-20px) translateX(10px); opacity: 0.6; }
  50% { transform: translateY(-15px) translateX(-5px); opacity: 0.4; }
  75% { transform: translateY(-30px) translateX(5px); opacity: 0.5; }
}

// 响应式
@media (max-width: 1200px) {
  .depth-cards-main {
    flex-wrap: wrap;
    max-width: 700px;
  }

  .depth-main-card {
    width: 180px;
    height: 280px;
  }
}

@media (max-width: 768px) {
  .depth-title {
    font-size: 36px;
    letter-spacing: 6px;
  }

  .depth-subtitle {
    font-size: 13px;
    letter-spacing: 2px;
  }

  .depth-cards-container {
    flex-direction: column;
  }

  .depth-line {
    width: 200px;
    height: 40px;

    .line-inner {
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      bottom: auto;
      width: auto;
      height: 2px;
      transform: translateY(-50%);
      background: linear-gradient(to right,
        transparent 0%,
        rgba(139, 92, 246, 0.3) 30%,
        rgba(139, 92, 246, 0.5) 50%,
        rgba(139, 92, 246, 0.3) 70%,
        transparent 100%
      );

      &::before,
      &::after {
        left: auto;
        top: 50%;
        transform: translateY(-50%);
      }

      &::before { left: 0; }
      &::after { right: 0; left: auto; }
    }
  }

  .depth-main-card {
    width: 160px;
    height: 250px;
  }

  .depth-indicator {
    display: none;
  }
}
</style>
