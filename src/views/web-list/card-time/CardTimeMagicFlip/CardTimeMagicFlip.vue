<template>
  <div ref="sectionRef" class="card-magic-flip">
    <!-- 背景效果 -->
    <div class="magic-bg">
      <div ref="bgGlow1Ref" class="bg-glow glow-1"></div>
      <div ref="bgGlow2Ref" class="bg-glow glow-2"></div>
      <div ref="particlesRef" class="magic-particles"></div>
      <div ref="gridLinesRef" class="bg-grid-lines"></div>
    </div>

    <!-- 内容区域 -->
    <div class="magic-content">
      <div ref="badgeRef" class="magic-badge">
        <span class="badge-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </span>
        FLIP ANIMATION
      </div>

      <h2 ref="titleRef" class="magic-title">
        <span class="title-word" v-for="(word, i) in titleWords" :key="i" :style="{ '--word-delay': i * 0.1 }">{{ word }}</span>
      </h2>

      <p ref="subtitleRef" class="magic-subtitle">滚动解锁 · 卡片展开的魔法瞬间</p>

      <!-- 卡片堆叠区域 -->
      <div ref="stackContainerRef" class="magic-stack-container">
        <div ref="cardsStackRef" class="cards-stack" :class="{ 'is-expanded': isExpanded }">
          <div
            v-for="(card, i) in magicCards"
            :key="'flip-card-' + i"
            :ref="el => cardRefs.set(i, el as HTMLElement)"
            class="flip-card"
            :style="{ '--card-index': i, '--card-hue': card.hue }"
            :data-card-id="i"
          >
            <div class="card-inner">
              <div class="card-header">
                <span class="card-number">{{ String(i + 1).padStart(2, '0') }}</span>
                <span class="card-tag">{{ card.tag }}</span>
              </div>
              <div class="card-icon">
                <div v-html="card.icon"></div>
              </div>
              <h3 class="card-title">{{ card.title }}</h3>
              <p class="card-desc">{{ card.desc }}</p>
              <div class="card-stats">
                <div class="stat-item">
                  <span class="stat-value">{{ card.value }}</span>
                  <span class="stat-label">{{ card.label }}</span>
                </div>
              </div>
              <div class="card-footer">
                <div class="card-progress">
                  <div class="progress-bar" :style="{ width: card.progress + '%' }"></div>
                </div>
                <span class="progress-text">{{ card.progress }}%</span>
              </div>
            </div>
            <div class="card-shine"></div>
            <div class="card-border"></div>
          </div>
        </div>
      </div>

      <!-- 展开提示 -->
      <div ref="hintRef" class="magic-hint">
        <div class="hint-arrow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14m-7-7l7 7 7-7"/>
          </svg>
        </div>
        <span>滚动展开卡片</span>
      </div>

      <!-- 底部信息 -->
      <div ref="footerRef" class="magic-footer">
        <div class="footer-deco"></div>
        <span class="footer-text">STACKED TO GRID · FLIP TRANSITION</span>
      </div>
    </div>

    <!-- 角落装饰 -->
    <div class="magic-corner corner-tl"></div>
    <div class="magic-corner corner-tr"></div>
    <div class="magic-corner corner-bl"></div>
    <div class="magic-corner corner-br"></div>

    <!-- 扫描效果 -->
    <div class="scan-effect" ref="scanEffectRef"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

// @ts-ignore
import Flip from 'gsap/Flip'

gsap.registerPlugin(ScrollTrigger, Flip)

type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []

const sectionRef = ref<HTMLElement | null>(null)
const badgeRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const stackContainerRef = ref<HTMLElement | null>(null)
const cardsStackRef = ref<HTMLElement | null>(null)
const hintRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const particlesRef = ref<HTMLElement | null>(null)
const gridLinesRef = ref<HTMLElement | null>(null)
const bgGlow1Ref = ref<HTMLElement | null>(null)
const bgGlow2Ref = ref<HTMLElement | null>(null)
const scanEffectRef = ref<HTMLElement | null>(null)
const cardRefs = ref(new Map<number, HTMLElement>())

const isExpanded = ref(false)
const titleWords = ['堆叠', '魔法', '·', '展开']

const magicCards = [
  {
    title: '星际之门',
    desc: '开启通往宇宙深处的传送门',
    tag: 'PORTAL',
    value: '∞',
    label: '传送门',
    progress: 85,
    hue: 270,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>'
  },
  {
    title: '时间沙漏',
    desc: '掌握过去与未来的流动法则',
    tag: 'TEMPORAL',
    value: '365',
    label: '天循环',
    progress: 72,
    hue: 320,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/></svg>'
  },
  {
    title: '量子矩阵',
    desc: '编织无限可能的数据网络',
    tag: 'QUANTUM',
    value: '99.9%',
    label: '精确度',
    progress: 95,
    hue: 190,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/></svg>'
  },
  {
    title: '能量核心',
    desc: '汇聚宇宙的无限能量源泉',
    tag: 'ENERGY',
    value: '10K',
    label: '能量单位',
    progress: 60,
    hue: 45,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>'
  },
  {
    title: '全息投影',
    desc: '虚实交织的沉浸式体验',
    tag: 'HOLOGRAM',
    value: '8K',
    label: '分辨率',
    progress: 88,
    hue: 150,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3l9 4.5v9L12 21l-9-4.5v-9L12 3z"/><path d="M12 12l9-4.5"/><path d="M12 12v9"/><path d="M12 12L3 7.5"/></svg>'
  },
  {
    title: '暗物质场',
    desc: '探索宇宙中隐藏的神秘力量',
    tag: 'DARK',
    value: '27%',
    label: '宇宙质量',
    progress: 45,
    hue: 280,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><path d="M12 2v4"/><path d="M12 18v4"/><path d="M2 12h4"/><path d="M18 12h4"/></svg>'
  }
]

const createParticles = () => {
  if (!particlesRef.value) return
  const container = particlesRef.value
  for (let i = 0; i < 40; i++) {
    const particle = document.createElement('div')
    particle.className = 'magic-particle'
    particle.style.cssText = `
      position: absolute;
      width: ${Math.random() * 3 + 1}px;
      height: ${Math.random() * 3 + 1}px;
      background: hsla(${Math.random() * 60 + 250}, 80%, 65%, ${Math.random() * 0.6 + 0.2});
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: magicParticleFloat ${Math.random() * 8 + 6}s ease-in-out infinite;
      animation-delay: ${Math.random() * 4}s;
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
      start: 'top 75%',
      toggleActions: 'play none none none'
    }
  })

  tl.fromTo(badgeRef.value,
    { scale: 0, opacity: 0, rotateY: 90 },
    { scale: 1, opacity: 1, rotateY: 0, duration: 0.6, ease: 'back.out(1.7)' }
  )
  .fromTo(titleRef.value,
    { y: 50, opacity: 0, filter: 'blur(10px)' },
    { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out' },
    '-=0.3'
  )
  .fromTo(subtitleRef.value,
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
    '-=0.3'
  )
  .fromTo(hintRef.value,
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
    '-=0.2'
  )
  .fromTo(footerRef.value,
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
    '-=0.2'
  )

  cleanupFns.push(() => tl.kill())

  // 背景光晕动画
  if (bgGlow1Ref.value) {
    gsap.to(bgGlow1Ref.value, {
      x: 60,
      y: 40,
      duration: 5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    })
  }
  if (bgGlow2Ref.value) {
    gsap.to(bgGlow2Ref.value, {
      x: -50,
      y: -30,
      duration: 6,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    })
  }

  // 网格线动画
  if (gridLinesRef.value) {
    gsap.fromTo(gridLinesRef.value,
      { opacity: 0 },
      { opacity: 0.3, duration: 1.5, ease: 'power2.out' }
    )
  }

  // 扫描效果
  if (scanEffectRef.value) {
    gsap.to(scanEffectRef.value, {
      top: '100%',
      duration: 2.5,
      ease: 'none',
      repeat: -1,
      repeatDelay: 1.5
    })
  }

  // 粒子漂浮
  if (particlesRef.value) {
    gsap.to(particlesRef.value, {
      y: -20,
      duration: 3.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    })
  }

  // 标题滚动效果
  if (titleRef.value) {
    const titleSt = ScrollTrigger.create({
      trigger: titleRef.value,
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1,
      onUpdate: (self) => {
        gsap.set(titleRef.value, {
          y: -40 * self.progress,
          opacity: 1 - self.progress * 1.5
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
          y: -20 * self.progress,
          opacity: 1 - self.progress * 1.2
        })
      }
    })
    cleanupFns.push(() => subSt.kill())
  }

  // 卡片展开动画 - 使用 Flip
  setupFlipAnimation()
}

const setupFlipAnimation = () => {
  if (!cardsStackRef.value) return

  nextTick(() => {
    const cards = cardsStackRef.value.querySelectorAll('.flip-card')
    if (cards.length === 0) return

    // 获取初始状态（堆叠状态）
    const state = Flip.getState(cards)

    // 添加展开类
    cardsStackRef.value.classList.add('is-expanded')

    // Flip 动画 - 使用 scrub 模式实现双向动画
    Flip.from(state, {
      duration: 1.5,
      stagger: {
        each: 0.08,
        from: 'end' // 从最后一个开始展开，收起时从最后一个开始
      },
      ease: 'power2.inOut',
      absolute: true,
      spin: true,
      scrollTrigger: {
        trigger: cardsStackRef.value,
        start: 'top 75%',
        end: 'top 15%',
        scrub: 2, // 增大数值让动画更平滑
        onUpdate: (self) => {
          // 提示文字渐隐/渐现
          if (hintRef.value) {
            const hintOpacity = self.progress < 0.1 ? 1 : (self.progress > 0.9 ? 1 : 0)
            gsap.set(hintRef.value, { opacity: hintOpacity })
          }
          // 更新展开状态
          isExpanded.value = self.progress > 0.5
        },
        onToggle: (self) => {
          // 切换时同步状态
          isExpanded.value = self.isActive
        }
      }
    })

    // 卡片悬停效果
    cards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          scale: 1.05,
          z: 20,
          duration: 0.3,
          ease: 'power2.out'
        })
      })

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          scale: 1,
          z: 0,
          duration: 0.4,
          ease: 'elastic.out(1, 0.5)'
        })
      })

      card.addEventListener('mousemove', (e: Event) => {
        const mouseEvent = e as MouseEvent
        const rect = card.getBoundingClientRect()
        const x = (mouseEvent.clientX - rect.left) / rect.width - 0.5
        const y = (mouseEvent.clientY - rect.top) / rect.height - 0.5

        gsap.to(card, {
          rotateY: x * 8,
          rotateX: -y * 8,
          duration: 0.3,
          ease: 'power2.out'
        })
      })
    })
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
.card-magic-flip {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #0d0d1a 0%, #1a1a2e 50%, #0f0f23 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

// 背景效果
.magic-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.bg-glow {
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.25;
}

.glow-1 {
  top: -100px;
  left: -100px;
  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
}

.glow-2 {
  bottom: -100px;
  right: -100px;
  background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%);
}

.bg-grid-lines {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(139, 92, 246, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(139, 92, 246, 0.03) 1px, transparent 1px);
  background-size: 60px 60px;
  opacity: 0.3;
}

.magic-particles {
  position: absolute;
  inset: 0;
}

// 内容区域
.magic-content {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 40px;
  max-width: 1200px;
  width: 100%;
}

.magic-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 24px;
  background: rgba(139, 92, 246, 0.12);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 30px;
  color: #c4b5fd;
  font-size: 11px;
  letter-spacing: 3px;
  font-weight: 600;
  margin-bottom: 20px;
  backdrop-filter: blur(10px);

  .badge-icon {
    width: 16px;
    height: 16px;
    color: #8b5cf6;
    animation: starSpin 4s linear infinite;

    svg {
      width: 100%;
      height: 100%;
    }
  }
}

@keyframes starSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.magic-title {
  font-family: 'Orbitron', 'Rajdhani', sans-serif;
  font-size: 52px;
  font-weight: 900;
  letter-spacing: 8px;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #fff 0%, #c4b5fd 50%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 30px rgba(139, 92, 246, 0.4));
  display: flex;
  justify-content: center;
  gap: 15px;

  .title-word {
    display: inline-block;
    opacity: 0;
    animation: wordFadeIn 0.5s ease-out forwards;
    animation-delay: var(--word-delay);

    &:nth-child(3) {
      background: none;
      -webkit-text-fill-color: #8b5cf6;
    }
  }
}

@keyframes wordFadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.magic-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 4px;
  margin-bottom: 50px;
}

// 卡片堆叠容器
.magic-stack-container {
  position: relative;
  min-height: 340px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
}

.cards-stack {
  position: relative;
  width: 100%;
  max-width: 280px;
  height: 320px;
  transition: all 0.3s ease;

  // 展开后的网格布局 - 作为默认状态
  &.is-expanded {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    max-width: 860px;
    height: auto;

    .flip-card {
      position: relative;
      top: auto;
      left: auto;
      margin: 0;
      transform: none;
      opacity: 1;
    }
  }

  // 堆叠状态 - 非展开时
  &:not(.is-expanded) {
    .flip-card {
      position: absolute;
      top: 10px;
      left: 10px;
      margin: 0;
      opacity: 1;
      z-index: calc(10 - var(--card-index));

      // 使用 CSS 变量精确控制偏移
      --stack-rotate: calc((var(--card-index) - 2.5) * 5deg);
      --stack-scale: calc(1 - abs(var(--card-index) - 2.5) * 0.06);
      --stack-x: calc((var(--card-index) - 2.5) * 8px);
      --stack-y: calc((var(--card-index) - 2.5) * 6px);

      transform: rotate(var(--stack-rotate)) scale(var(--stack-scale)) translateX(var(--stack-x)) translateY(var(--stack-y));
    }
  }
}

// 翻转卡片
.flip-card {
  width: 260px;
  height: 300px;
  margin: 0 auto;
  background: linear-gradient(145deg,
    rgba(30, 30, 60, 0.92) 0%,
    rgba(15, 15, 35, 0.95) 100%
  );
  border-radius: 20px;
  border: 1px solid hsla(var(--card-hue), 70%, 60%, 0.2);
  overflow: hidden;
  cursor: pointer;
  transform-style: preserve-3d;
  transition: border-color 0.3s, box-shadow 0.3s;

  // 默认状态：无 transform
  transform: none;

  &:hover {
    border-color: hsla(var(--card-hue), 70%, 60%, 0.5);
    box-shadow:
      0 20px 50px rgba(0, 0, 0, 0.4),
      0 0 40px hsla(var(--card-hue), 70%, 60%, 0.15);
  }

  // 展开状态下的悬停效果
  .cards-stack.is-expanded &:hover {
    transform: translateY(-8px) scale(1.02) !important;
  }

  .card-inner {
    position: relative;
    z-index: 2;
    padding: 24px 20px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .card-number {
      font-family: 'Orbitron', sans-serif;
      font-size: 32px;
      font-weight: 700;
      color: hsla(var(--card-hue), 70%, 60%, 0.2);
    }

    .card-tag {
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 2px;
      color: hsla(var(--card-hue), 70%, 70%, 0.9);
      padding: 4px 10px;
      background: hsla(var(--card-hue), 70%, 60%, 0.1);
      border: 1px solid hsla(var(--card-hue), 70%, 60%, 0.2);
      border-radius: 4px;
    }
  }

  .card-icon {
    width: 50px;
    height: 50px;
    margin-bottom: 16px;
    background: linear-gradient(135deg,
      hsla(var(--card-hue), 70%, 60%, 0.2) 0%,
      hsla(var(--card-hue), 70%, 50%, 0.1) 100%
    );
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: hsla(var(--card-hue), 70%, 70%, 1);
    transition: transform 0.3s;

    :deep(svg) {
      width: 26px;
      height: 26px;
    }

    &:hover {
      transform: scale(1.1) rotate(5deg);
    }
  }

  .card-title {
    font-size: 18px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 8px;
    letter-spacing: 1px;
  }

  .card-desc {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.5);
    line-height: 1.6;
    flex: 1;
  }

  .card-stats {
    margin-top: auto;
    padding-top: 16px;
    border-top: 1px solid hsla(var(--card-hue), 70%, 60%, 0.1);

    .stat-item {
      display: flex;
      align-items: baseline;
      gap: 8px;
    }

    .stat-value {
      font-family: 'Orbitron', sans-serif;
      font-size: 24px;
      font-weight: 700;
      color: hsla(var(--card-hue), 70%, 70%, 1);
    }

    .stat-label {
      font-size: 11px;
      color: rgba(255, 255, 255, 0.4);
      letter-spacing: 1px;
    }
  }

  .card-footer {
    margin-top: 16px;
    display: flex;
    align-items: center;
    gap: 10px;

    .card-progress {
      flex: 1;
      height: 4px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 2px;
      overflow: hidden;

      .progress-bar {
        height: 100%;
        background: linear-gradient(90deg,
          hsla(var(--card-hue), 70%, 60%, 0.8),
          hsla(var(--card-hue), 70%, 70%, 1)
        );
        border-radius: 2px;
        transition: width 0.5s ease-out;
      }
    }

    .progress-text {
      font-size: 11px;
      color: hsla(var(--card-hue), 70%, 60%, 0.8);
      font-weight: 600;
    }
  }

  .card-shine {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 60%;
    background: linear-gradient(to bottom,
      hsla(var(--card-hue), 70%, 60%, 0.05) 0%,
      transparent 100%
    );
    pointer-events: none;
  }

  .card-border {
    position: absolute;
    inset: 0;
    border-radius: 20px;
    background: linear-gradient(135deg,
      hsla(var(--card-hue), 70%, 60%, 0.15) 0%,
      transparent 50%,
      hsla(var(--card-hue), 70%, 60%, 0.1) 100%
    );
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:hover .card-border {
    opacity: 1;
  }
}

// 展开提示
.magic-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 30px;

  .hint-arrow {
    width: 24px;
    height: 24px;
    color: rgba(139, 92, 246, 0.5);
    animation: bounceDown 1.5s ease-in-out infinite;

    svg {
      width: 100%;
      height: 100%;
    }
  }

  span {
    font-size: 11px;
    letter-spacing: 3px;
    color: rgba(255, 255, 255, 0.3);
  }
}

@keyframes bounceDown {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(8px); }
}

// 底部信息
.magic-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;

  .footer-deco {
    width: 40px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.3), transparent);
  }

  .footer-text {
    font-size: 10px;
    letter-spacing: 3px;
    color: rgba(255, 255, 255, 0.25);
  }
}

// 角落装饰
.magic-corner {
  position: absolute;
  width: 50px;
  height: 50px;
  border: 1px solid rgba(139, 92, 246, 0.15);
  pointer-events: none;

  &.corner-tl {
    top: 20px;
    left: 20px;
    border-right: none;
    border-bottom: none;
  }

  &.corner-tr {
    top: 20px;
    right: 20px;
    border-left: none;
    border-bottom: none;
  }

  &.corner-bl {
    bottom: 20px;
    left: 20px;
    border-right: none;
    border-top: none;
  }

  &.corner-br {
    bottom: 20px;
    right: 20px;
    border-left: none;
    border-top: none;
  }
}

// 扫描效果
.scan-effect {
  position: absolute;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(139, 92, 246, 0.4) 50%,
    transparent 100%
  );
  pointer-events: none;
  z-index: 20;
}

// 粒子动画
:global(.magic-particle) {
  animation: magicParticleFloat 12s ease-in-out infinite;
}

@keyframes magicParticleFloat {
  0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; }
  25% { transform: translateY(-30px) scale(1.2); opacity: 0.6; }
  50% { transform: translateY(-20px) scale(0.9); opacity: 0.4; }
  75% { transform: translateY(-40px) scale(1.1); opacity: 0.5; }
}

// 响应式
@media (max-width: 1024px) {
  .cards-stack.is-expanded {
    grid-template-columns: repeat(2, 1fr);
  }

  .flip-card {
    width: 220px;
    height: 260px;
  }
}

@media (max-width: 768px) {
  .magic-title {
    font-size: 32px;
    letter-spacing: 4px;
    flex-wrap: wrap;
  }

  .magic-subtitle {
    font-size: 13px;
    letter-spacing: 2px;
  }

  .cards-stack {
    height: auto;
    min-height: auto;

    &:not(.is-expanded) {
      .flip-card {
        position: relative;
        top: auto;
        left: auto;
        transform: none !important;
      }
    }
  }

  .cards-stack.is-expanded {
    grid-template-columns: 1fr;
  }

  .flip-card {
    width: 280px;
    height: auto;
    min-height: 200px;
  }
}
</style>
