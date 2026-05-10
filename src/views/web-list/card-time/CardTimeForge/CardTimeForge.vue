<template>
  <div ref="sectionRef" class="forge-section">
    <!-- 金属纹理背景 -->
    <div class="forge-bg">
      <div class="metal-texture"></div>
      <div class="forge-glow-bg"></div>
      <div ref="particlesRef" class="forge-particles"></div>
    </div>

    <!-- 内容区域 -->
    <div class="forge-content">
      <div ref="badgeRef" class="forge-badge">
        <span class="badge-line"></span>
        LIGHT FORGE
        <span class="badge-line"></span>
      </div>

      <h2 ref="titleRef" class="forge-title">
        <span
          v-for="(word, i) in titleWords"
          :key="i"
          :ref="el => titleWordRefs.set(i, el as HTMLElement)"
          class="title-word"
        >{{ word }}</span>
      </h2>

      <p ref="subtitleRef" class="forge-subtitle">光影雕刻 · 逐字熔铸</p>

      <!-- 锻造卡片组 -->
      <div ref="cardsContainerRef" class="forge-cards-container">
        <div
          v-for="(card, i) in forgeCards"
          :key="'card-' + i"
          class="forge-card"
          :ref="el => cardRefs.set(i, el as HTMLElement)"
          :style="{ '--forge-gold': card.gold }"
        >
          <!-- 金属背景 -->
          <div class="card-metal-bg"></div>

          <!-- 光束 -->
          <div :ref="el => beamRefs.set(i, el as HTMLElement)" class="forge-beam"></div>

          <!-- 灼烧光晕 -->
          <div :ref="el => glowRefs.set(i, el as HTMLElement)" class="forge-glow"></div>

          <!-- 热力波纹 -->
          <div :ref="el => heatRefs.set(i, el as HTMLElement)" class="forge-heat"></div>

          <!-- 卡片内容 -->
          <div :ref="el => contentRefs.set(i, el as HTMLElement)" class="forge-card-content">
            <div class="card-icon" v-html="card.icon"></div>
            <h3 class="card-title">
              <span
                v-for="(char, charIdx) in card.titleChars"
                :key="charIdx"
                class="char"
                :data-char="charIdx"
              >{{ char }}</span>
            </h3>
            <p class="card-desc">{{ card.desc }}</p>
            <div class="card-metrics">
              <div v-for="(metric, mIdx) in card.metrics" :key="mIdx" class="metric">
                <span class="metric-value">{{ metric.value }}</span>
                <span class="metric-label">{{ metric.label }}</span>
              </div>
            </div>
            <div class="card-footer">
              <span class="card-tag">{{ card.tag }}</span>
              <span class="card-arrow">→</span>
            </div>
          </div>

          <!-- 灼烧边框 -->
          <div class="forge-border"></div>
        </div>
      </div>

      <div ref="footerRef" class="forge-footer">
        <span class="footer-line"></span>
        <span class="footer-text">SCROLL TO EXPLORE</span>
        <span class="footer-line"></span>
      </div>
    </div>

    <!-- 滚动进度条 -->
    <div class="scroll-progress">
      <div ref="progressBarRef" class="progress-bar"></div>
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
const progressBarRef = ref<HTMLElement | null>(null)

const titleWordRefs = ref(new Map<number, HTMLElement>())
const cardRefs = ref(new Map<number, HTMLElement>())
const beamRefs = ref(new Map<number, HTMLElement>())
const glowRefs = ref(new Map<number, HTMLElement>())
const heatRefs = ref(new Map<number, HTMLElement>())
const contentRefs = ref(new Map<number, HTMLElement>())

const titleWords = ['LIGHT', 'FORGE']
const forgeCards = [
  {
    title: '光影雕刻',
    titleChars: '光影雕刻'.split(''),
    desc: '通过锥形光束扫描，字符从黑暗中逐字熔铸显现',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>',
    gold: '#ffd700',
    metrics: [
      { value: '12层', label: '光束路径' },
      { value: '0.8s', label: '熔铸时间' },
      { value: '256', label: '色阶精度' }
    ],
    tag: '光影工艺'
  },
  {
    title: '热力熔铸',
    titleChars: '热力熔铸'.split(''),
    desc: '金属灼烧边缘效果，橙金色热力辉光随光束流动',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22c-4.97 0-9-3.58-9-8 0-4.42 4.03-8.87 7.06-12.28.6-.68 1.94.18 1.34.86C8.44 6.06 5 9.56 5 14c0 2.76 2.24 5 5 5 .68 0 1.34-.14 1.94-.4.61-.26 1.27-.19 1.77.15.5.34.77.88.72 1.43-.08 1.01-.85 1.82-1.83 1.82z"/></svg>',
    gold: '#ff8c00',
    metrics: [
      { value: '45°', label: '光束角度' },
      { value: '3层', label: '辉光叠加' },
      { value: '0.6s', label: '热力扩散' }
    ],
    tag: '热力工艺'
  },
  {
    title: '材质觉醒',
    titleChars: '材质觉醒'.split(''),
    desc: '从虚空中凝聚的金属质感，每一处细节都经过精心雕琢',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
    gold: '#ffb347',
    metrics: [
      { value: '8K', label: '材质精度' },
      { value: '360°', label: '光影环绕' },
      { value: '16ms', label: '渲染延迟' }
    ],
    tag: '材质工艺'
  }
]

const createParticles = () => {
  if (!particlesRef.value) return

  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div')
    particle.className = 'particle'
    particle.style.cssText = `
      position: absolute;
      width: ${Math.random() * 3 + 1}px;
      height: ${Math.random() * 3 + 1}px;
      background: rgba(255, 179, 71, ${Math.random() * 0.6 + 0.2});
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: float ${Math.random() * 8 + 6}s ease-in-out infinite;
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

  // 入场 Timeline
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 70%',
      toggleActions: 'play none none none'
    }
  })

  // Badge 入场
  tl.fromTo(badgeRef.value,
    { scale: 0, opacity: 0, y: -30 },
    { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.7)' }
  )

  // 标题逐词入场 - 使用 ref
  const titleWords = titleWordRefs.value
  if (titleWords.size > 0) {
    const words = Array.from(titleWords.values())
    tl.fromTo(words,
      { y: 50, opacity: 0, filter: 'blur(10px)' },
      { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.6, ease: 'power3.out', stagger: 0.15 },
      '-=0.3'
    )
  }

  // 副标题入场
  tl.fromTo(subtitleRef.value,
    { y: 30, opacity: 0, letterSpacing: '20px' },
    { y: 0, opacity: 1, letterSpacing: '6px', duration: 0.5, ease: 'power2.out' },
    '-=0.3'
  )

  // 光影雕刻卡片入场
  cardRefs.value.forEach((card, cardIndex) => {
    if (!card) return

    const beam = beamRefs.value.get(cardIndex)
    const glow = glowRefs.value.get(cardIndex)
    const heat = heatRefs.value.get(cardIndex)
    const content = contentRefs.value.get(cardIndex)
    const chars = card.querySelectorAll('.char')

    if (!beam || !glow || !heat || !content) return

    // 初始状态
    gsap.set(beam, { top: 0, left: 0, opacity: 0 })
    gsap.set(glow, { top: 0, left: 0, opacity: 0 })
    gsap.set(heat, { opacity: 0, scale: 0 })
    gsap.set(chars, { y: 15, opacity: 0, color: '#1a1a1a' })
    gsap.set(content, { opacity: 0, scale: 0.95 })

    // 创建卡片 Timeline
    const cardTl = gsap.timeline()

    // 1. 内容容器先显现
    cardTl.to(content, {
      opacity: 1,
      scale: 1,
      duration: 0.3,
      ease: 'power2.out'
    })

    // 2. 光束出现
    .to(beam, {
      opacity: 0.8,
      duration: 0.15
    })

    // 3. 光束斜向移动，光束经过处字符显现
    .to(beam, {
      top: '100%',
      left: '100%',
      duration: 1.2,
      ease: 'none'
    }, '+=0.1')

    // 4. 灼烧光晕跟随
    .to(glow, {
      opacity: 0.7,
      duration: 1.2,
      ease: 'none'
    }, '-=1.2')

    // 5. 字符随光束进度逐个显现
    .call(() => {
      chars.forEach((char, charIdx) => {
        const delay = charIdx * 0.08
        gsap.to(char, {
          y: 0,
          opacity: 1,
          color: '#ffd700',
          duration: 0.25,
          ease: 'power2.out',
          delay
        })
        gsap.to(char, {
          textShadow: '0 0 20px #ff6b00, 0 0 40px #ff4500',
          duration: 0.3,
          delay: delay + 0.1
        })
      })
    }, [], '-=1.2')

    // 6. 热力波纹
    .to(heat, {
      opacity: 0.6,
      scale: 2,
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.6')

    // 7. 光束和光晕消散
    .to([beam, glow], {
      opacity: 0,
      duration: 0.4
    })

    // 8. 字符稳定为暖金色
    .to(chars, {
      color: '#ffb347',
      textShadow: '0 0 10px rgba(255, 179, 71, 0.5)',
      duration: 0.5,
      stagger: 0.05
    }, '-=0.3')

    // 9. 热力波纹消散
    .to(heat, {
      opacity: 0,
      scale: 3,
      duration: 0.4
    }, '-=0.3')

    tl.add(cardTl, cardIndex * 0.25)
  })

  // 底部入场
  if (footerRef.value) {
    tl.fromTo(footerRef.value,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
      '-=0.2'
    )
  }

  cleanupFns.push(() => tl.kill())

  // 标题滚动效果
  if (titleRef.value) {
    const titleSt = ScrollTrigger.create({
      trigger: titleRef.value,
      start: 'top 75%',
      end: 'top 25%',
      scrub: 1,
      onUpdate: (self) => {
        const titleWords = titleWordRefs.value
        if (titleWords.size > 0) {
          Array.from(titleWords.values()).forEach((word, i) => {
            const progress = Math.min(1, self.progress * 1.5 - i * 0.1)
            gsap.set(word, {
              y: 50 * (1 - progress),
              opacity: progress,
              filter: `blur(${10 * (1 - progress)}px)`
            })
          })
        }
      }
    })
    cleanupFns.push(() => titleSt.kill())
  }

  // 卡片组滚动进入
  if (cardsContainerRef.value) {
    const cardsContainerSt = ScrollTrigger.create({
      trigger: cardsContainerRef.value,
      start: 'top 65%',
      end: 'top 30%',
      scrub: 1,
      onEnter: () => {
        cardRefs.value.forEach((card, index) => {
          if (!card) return
          const beam = beamRefs.value.get(index)
          const glow = glowRefs.value.get(index)
          const heat = heatRefs.value.get(index)
          const content = contentRefs.value.get(index)
          const chars = card.querySelectorAll('.char')

          if (!beam || !glow || !heat || !content) return

          gsap.set(beam, { top: 0, left: 0, opacity: 0 })
          gsap.set(glow, { top: 0, left: 0, opacity: 0 })
          gsap.set(heat, { opacity: 0, scale: 0 })
          gsap.set(chars, { y: 15, opacity: 0, color: '#1a1a1a' })
          gsap.set(content, { opacity: 0, scale: 0.95 })

          const enterTl = gsap.timeline()

          enterTl.to(content, { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' })
            .to(beam, { opacity: 0.8, duration: 0.15 })
            .to(beam, { top: '100%', left: '100%', duration: 1.2, ease: 'none' }, '+=0.1')
            .to(glow, { opacity: 0.7, duration: 1.2, ease: 'none' }, '-=1.2')
            .call(() => {
              chars.forEach((char, charIdx) => {
                gsap.to(char, {
                  y: 0, opacity: 1, color: '#ffd700',
                  duration: 0.25, ease: 'power2.out',
                  delay: charIdx * 0.08
                })
                gsap.to(char, {
                  textShadow: '0 0 20px #ff6b00, 0 0 40px #ff4500',
                  duration: 0.3,
                  delay: charIdx * 0.08 + 0.1
                })
              })
            }, [], '-=1.2')
            .to(heat, { opacity: 0.6, scale: 2, duration: 0.8, ease: 'power2.out' }, '-=0.6')
            .to([beam, glow], { opacity: 0, duration: 0.4 })
            .to(chars, {
              color: '#ffb347',
              textShadow: '0 0 10px rgba(255, 179, 71, 0.5)',
              duration: 0.5,
              stagger: 0.05
            }, '-=0.3')
            .to(heat, { opacity: 0, scale: 3, duration: 0.4 }, '-=0.3')

          gsap.delayedCall(index * 0.3, () => enterTl.play())
        })
      }
    })
    cleanupFns.push(() => cardsContainerSt.kill())
  }

  // 滚动进度条
  if (progressBarRef.value) {
    const progressSt = ScrollTrigger.create({
      trigger: sectionRef.value,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        gsap.set(progressBarRef.value, { scaleY: self.progress })
      }
    })
    cleanupFns.push(() => progressSt.kill())
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
.forge-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #0a0808 0%, #1a1010 50%, #0d0a0a 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.forge-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.metal-texture {
  position: absolute;
  inset: 0;
  background:
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 2px,
      rgba(255, 255, 255, 0.01) 2px,
      rgba(255, 255, 255, 0.01) 4px
    );
  opacity: 0.5;
}

.forge-glow-bg {
  position: absolute;
  top: 20%;
  left: 10%;
  width: 80%;
  height: 60%;
  background: radial-gradient(
    ellipse at center,
    rgba(255, 140, 0, 0.08) 0%,
    transparent 70%
  );
  filter: blur(40px);
}

.forge-particles {
  position: absolute;
  inset: 0;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 0.8;
  }
  50% {
    transform: translateY(-100px) translateX(30px);
    opacity: 0.4;
  }
  90% {
    opacity: 0.6;
  }
}

.forge-content {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 0 40px;
  max-width: 1200px;
  width: 100%;
}

.forge-badge {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 8px 24px;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 140, 0, 0.1));
  border: 1px solid rgba(255, 179, 71, 0.3);
  border-radius: 20px;
  color: #ffd700;
  font-family: 'JetBrains Mono', 'Courier New', monospace;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 3px;
  margin-bottom: 30px;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
}

.badge-line {
  width: 30px;
  height: 1px;
  background: linear-gradient(90deg, transparent, #ffd700);
}

.badge-line:last-child {
  background: linear-gradient(90deg, #ffd700, transparent);
}

.forge-title {
  font-family: 'Cinzel', 'Playfair Display', serif;
  font-size: clamp(48px, 10vw, 96px);
  font-weight: 700;
  color: #fff;
  margin: 0 0 20px 0;
  letter-spacing: 15px;
  text-shadow:
    0 0 40px rgba(255, 179, 71, 0.3),
    0 0 80px rgba(255, 140, 0, 0.2);
}

.title-word {
  display: inline-block;
  margin-right: 20px;
  background: linear-gradient(135deg, #ffd700, #ff8c00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.forge-subtitle {
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 60px 0;
  letter-spacing: 6px;
}

.forge-cards-container {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
  margin-bottom: 60px;
}

.forge-card {
  position: relative;
  width: 320px;
  min-height: 380px;
  background: linear-gradient(145deg, #1a1515 0%, #0d0a0a 100%);
  border: 1px solid rgba(255, 179, 71, 0.2);
  border-radius: 16px;
  overflow: hidden;
  padding: 30px;
  transition: transform 0.3s ease, border-color 0.3s ease;
}

.forge-card:hover {
  transform: translateY(-5px);
  border-color: rgba(255, 179, 71, 0.5);
}

.card-metal-bg {
  position: absolute;
  inset: 0;
  background:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 1px,
      rgba(255, 255, 255, 0.02) 1px,
      rgba(255, 255, 255, 0.02) 2px
    );
  pointer-events: none;
}

.forge-beam {
  position: absolute;
  top: 0;
  left: 0;
  width: 150px;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 215, 0, 0.4) 50%,
    transparent 100%
  );
  transform: skewX(-15deg);
  pointer-events: none;
  filter: blur(10px);
}

.forge-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100px;
  height: 100%;
  background: radial-gradient(
    ellipse at top left,
    rgba(255, 140, 0, 0.5) 0%,
    transparent 60%
  );
  pointer-events: none;
  filter: blur(20px);
}

.forge-heat {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px;
  height: 200px;
  transform: translate(-50%, -50%);
  background: radial-gradient(
    circle,
    rgba(255, 107, 0, 0.4) 0%,
    transparent 70%
  );
  pointer-events: none;
  filter: blur(30px);
}

.forge-card-content {
  position: relative;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.card-icon {
  width: 56px;
  height: 56px;
  color: var(--forge-gold, #ffd700);
  margin-bottom: 20px;
  filter: drop-shadow(0 0 10px currentColor);
}

.card-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.card-title {
  font-family: 'Noto Sans SC', 'PingFang SC', sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 15px 0;
  letter-spacing: 8px;
  min-height: 40px;
}

.char {
  display: inline-block;
  transition: text-shadow 0.3s ease;
}

.card-desc {
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0 0 25px 0;
  line-height: 1.8;
}

.card-metrics {
  display: flex;
  justify-content: space-around;
  width: 100%;
  padding: 15px 0;
  border-top: 1px solid rgba(255, 179, 71, 0.15);
  border-bottom: 1px solid rgba(255, 179, 71, 0.15);
  margin-bottom: 20px;
}

.metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.metric-value {
  font-family: 'JetBrains Mono', 'Courier New', monospace;
  font-size: 16px;
  font-weight: 700;
  color: var(--forge-gold, #ffd700);
}

.metric-label {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.card-tag {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  padding: 4px 12px;
  border: 1px solid rgba(255, 179, 71, 0.2);
  border-radius: 12px;
}

.card-arrow {
  color: var(--forge-gold, #ffd700);
  font-size: 16px;
  transition: transform 0.3s ease;
}

.forge-card:hover .card-arrow {
  transform: translateX(5px);
}

.forge-border {
  position: absolute;
  inset: 0;
  border-radius: 16px;
  border: 1px solid transparent;
  background: linear-gradient(#1a1515, #1a1515) padding-box,
              linear-gradient(135deg, rgba(255, 215, 0, 0.3), transparent, rgba(255, 140, 0, 0.3)) border-box;
  pointer-events: none;
}

.forge-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  color: rgba(255, 255, 255, 0.3);
  font-size: 12px;
  letter-spacing: 3px;
}

.footer-line {
  width: 60px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 179, 71, 0.3), transparent);
}

.scroll-progress {
  position: fixed;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 100px;
  background: rgba(255, 179, 71, 0.1);
  border-radius: 2px;
  overflow: hidden;
  z-index: 100;
}

.progress-bar {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #ffd700, #ff8c00);
  border-radius: 2px;
  transform-origin: top;
}
</style>
