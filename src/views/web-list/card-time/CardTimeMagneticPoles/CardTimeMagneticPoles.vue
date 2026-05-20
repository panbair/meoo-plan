<template>
  <section ref="containerRef" class="magnetic-poles-section">
    <!-- 磁场背景 -->
    <div class="magnetic-bg">
      <div class="field-lines">
        <span v-for="i in 20" :key="i" class="field-line" :style="getFieldLineStyle(i)"></span>
      </div>
      <div class="magnetic-particles">
        <span v-for="i in 40" :key="'p'+i" class="mag-particle" :style="getParticleStyle(i)"></span>
      </div>
    </div>

    <!-- 标题 -->
    <div ref="headerRef" class="magnetic-header">
      <div ref="badgeRef" class="magnetic-badge">
        <span class="badge-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
            <path d="M8 12h8M12 8v8"/>
          </svg>
        </span>
        <span class="badge-text">MAGNETIC FIELD</span>
      </div>
      <h1 ref="titleRef" class="magnetic-title">MAGNETIC POLES</h1>
      <p ref="subtitleRef" class="magnetic-subtitle">同极相斥 · 异极相吸 · 磁力翻转</p>
    </div>

    <!-- 磁极卡片 -->
    <div ref="cardsContainerRef" class="cards-container">
      <div
        v-for="(card, index) in cards"
        :key="index"
        :ref="el => cardRefs[index] = el as HTMLElement"
        class="magnetic-card"
        :class="{ 'pole-s': card.pole === 'S', 'pole-n': card.pole === 'N' }"
        :data-index="index"
      >
        <div class="card-field-aura"></div>
        <div class="card-inner">
          <div class="pole-indicator">
            <span class="pole-label">{{ card.pole }}</span>
            <div class="pole-glow"></div>
          </div>
          <div class="card-body">
            <span class="card-index">{{ String(index + 1).padStart(2, '0') }}</span>
            <h3 class="card-title">{{ card.title }}</h3>
            <p class="card-desc">{{ card.desc }}</p>
          </div>
          <div class="card-footer">
            <span class="card-tag">{{ card.tag }}</span>
            <div class="force-meter">
              <div class="force-fill" :style="{ width: card.force + '%' }"></div>
            </div>
          </div>
        </div>
        <div class="repulsion-wave"></div>
      </div>
    </div>

    <!-- 底部 -->
    <div ref="footerRef" class="magnetic-footer">
      <div class="polarity-indicator">
        <span class="pole-dot s-dot"></span>
        <span class="pole-line"></span>
        <span class="pole-dot n-dot"></span>
      </div>
      <span ref="footerTextRef" class="footer-text">POLARITY REVERSAL</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const containerRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const badgeRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const cardsContainerRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const footerTextRef = ref<HTMLElement | null>(null)
const cardRefs = ref<(HTMLElement | null)[]>([])

const cleanupFns: (() => void)[] = []

const cards = [
  { title: 'Attraction', desc: 'Opposite poles draw together', pole: 'S', tag: 'Force', force: 85 },
  { title: 'Repulsion', desc: 'Like poles push apart', pole: 'N', tag: 'Field', force: 92 },
  { title: 'Flux', desc: 'Magnetic field line density', pole: 'S', tag: 'Density', force: 78 },
  { title: 'Induction', desc: 'Electromagnetic generation', pole: 'N', tag: 'Energy', force: 88 },
  { title: 'Reversal', desc: 'Polarity flip phenomenon', pole: 'S', tag: 'Shift', force: 95 },
  { title: 'Dipole', desc: 'Two-pole magnetic system', pole: 'N', tag: 'System', force: 70 },
]

const getFieldLineStyle = (i: number) => {
  const angle = (i / 20) * 360
  const radius = 200 + Math.sin(i * 0.5) * 100
  return {
    transform: `rotate(${angle}deg)`,
    width: `${radius}px`,
    animationDelay: `${i * 0.15}s`
  }
}

const getParticleStyle = (i: number) => {
  return {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    width: `${2 + Math.random() * 3}px`,
    height: `${2 + Math.random() * 3}px`,
    animationDelay: `${Math.random() * 6}s`,
    animationDuration: `${4 + Math.random() * 6}s`,
    background: i % 2 === 0 ? 'rgba(255, 60, 60, 0.6)' : 'rgba(60, 130, 255, 0.6)'
  }
}

// 计算排斥散射位置
const getRepulsionPos = (index: number, total: number) => {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2
  const radius = 280
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius
  }
}

onMounted(() => {
  const allCards = cardRefs.value.filter(Boolean) as HTMLElement[]
  if (!allCards.length || !containerRef.value) return

  // 初始状态：堆叠在中心
  gsap.set(allCards, {
    x: 0, y: 0, scale: 0.6, opacity: 0,
    rotateY: 0, rotateX: 0, rotateZ: () => gsap.utils.random(-15, 15),
    filter: 'blur(5px)',
    transformOrigin: 'center center',
    force3D: true
  })

  gsap.set([badgeRef.value, titleRef.value, subtitleRef.value], {
    opacity: 0, y: -50, filter: 'blur(15px)'
  })

  gsap.set(footerTextRef.value, { opacity: 0, scale: 0 })

  // 1. 入场动画
  const introTl = gsap.timeline({ paused: true })

  introTl.to([badgeRef.value, titleRef.value, subtitleRef.value], {
    opacity: 1, y: 0, filter: 'blur(0px)',
    duration: 0.8, stagger: 0.15, ease: 'power3.out'
  }, 0)

  introTl.to(footerTextRef.value, {
    opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.5)'
  }, 0.5)

  introTl.play()

  // 2. 滚动动画：排斥 → 翻转 → 吸引归位
  const magnetTl = gsap.timeline({
    scrollTrigger: {
      trigger: containerRef.value,
      start: 'top 80%',
      end: 'top 10%',
      scrub: 1.5,
      toggleActions: 'play reverse play reverse',
      immediateRender: false
    }
  })

  // 阶段1: 卡片出现并堆叠
  magnetTl.to(allCards, {
    opacity: 1, scale: 0.8, filter: 'blur(0px)',
    duration: 0.3, stagger: 0.02, ease: 'power2.out'
  })

  // 阶段2: 同极排斥 - 弹射散开
  allCards.forEach((card, i) => {
    const pos = getRepulsionPos(i, allCards.length)
    magnetTl.to(card, {
      x: pos.x, y: pos.y, scale: 0.9,
      rotateZ: gsap.utils.random(-30, 30),
      duration: 0.4, ease: 'power3.out'
    }, 0.3 + i * 0.02)
  })

  // 排斥波纹
  const waves = allCards.map(c => c.querySelector('.repulsion-wave'))
  magnetTl.to(waves, {
    scale: 2, opacity: 0.6, duration: 0.3,
    stagger: 0.02, ease: 'power2.out'
  }, 0.35)
  magnetTl.to(waves, {
    scale: 0, opacity: 0, duration: 0.2
  }, 0.7)

  // 阶段3: 磁极翻转
  magnetTl.to(allCards, {
    rotateY: 180, duration: 0.3,
    stagger: { each: 0.03, from: 'center' },
    ease: 'power2.inOut'
  }, 0.7)

  // 翻转后极性视觉变化
  magnetTl.to(allCards.filter((_, i) => cards[i].pole === 'S').map(c => c.querySelector('.pole-indicator')), {
    background: 'radial-gradient(circle, rgba(60,130,255,0.3), transparent)',
    duration: 0.1
  }, 0.85)

  // 阶段4: 异极吸引归位
  magnetTl.to(allCards, {
    x: 0, y: 0, scale: 1,
    rotateY: 360, rotateZ: 0,
    duration: 0.5,
    stagger: { each: 0.03, from: 'edges' },
    ease: 'elastic.out(1.2, 0.6)'
  }, 0.9)

  // 归位后光晕
  const auras = allCards.map(c => c.querySelector('.card-field-aura'))
  magnetTl.to(auras, {
    opacity: 0.5, scale: 1.2, duration: 0.3,
    stagger: 0.02, ease: 'power2.out'
  }, 1.3)

  // 内容显现
  const inners = allCards.map(c => c.querySelector('.card-inner'))
  magnetTl.to(inners, {
    opacity: 1, duration: 0.3,
    stagger: 0.02, ease: 'power2.out'
  }, 1.2)

  cleanupFns.push(() => magnetTl.kill())

  // 3. 悬浮呼吸
  allCards.forEach((card, i) => {
    const tween = gsap.to(card, {
      y: `+=${8 + i * 2}`, duration: 2 + i * 0.3,
      repeat: -1, yoyo: true, ease: 'sine.inOut',
      delay: i * 0.2
    })
    cleanupFns.push(() => tween.kill())
  })
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style scoped lang="scss">
.magnetic-poles-section {
  width: 100vw;
  height: 100vh;
  background:
    radial-gradient(circle at 20% 30%, rgba(255, 60, 80, 0.08) 0%, transparent 40%),
    radial-gradient(circle at 80% 70%, rgba(60, 130, 255, 0.08) 0%, transparent 40%),
    radial-gradient(circle at 50% 50%, rgba(140, 80, 255, 0.05) 0%, transparent 50%),
    linear-gradient(135deg, #0a0616 0%, #110a20 40%, #0d0818 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.magnetic-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;

  .field-lines {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);

    .field-line {
      position: absolute;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(140, 80, 255, 0.15), transparent);
      transform-origin: left center;
      animation: fieldPulse 4s ease-in-out infinite;
    }
  }

  .mag-particle {
    position: absolute;
    border-radius: 50%;
    animation: particleFloat 6s ease-in-out infinite;
  }
}

@keyframes fieldPulse {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.6; }
}

@keyframes particleFloat {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
  25% { transform: translate(20px, -30px) scale(1.5); opacity: 0.7; }
  50% { transform: translate(-10px, -60px) scale(0.8); opacity: 0.5; }
  75% { transform: translate(-30px, -20px) scale(1.3); opacity: 0.6; }
}

.magnetic-header {
  position: relative;
  z-index: 10;
  text-align: center;
  margin-bottom: 50px;

  .magnetic-badge {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 10px 28px;
    border-radius: 40px;
    border: 1px solid rgba(140, 80, 255, 0.3);
    background: rgba(140, 80, 255, 0.08);
    backdrop-filter: blur(10px);
    margin-bottom: 24px;
    font-size: 11px;
    letter-spacing: 5px;
    color: rgba(200, 160, 255, 0.9);

    .badge-icon svg {
      width: 16px;
      height: 16px;
      color: rgba(200, 160, 255, 0.8);
    }
  }

  .magnetic-title {
    font-size: clamp(48px, 7vw, 80px);
    font-weight: 800;
    letter-spacing: 8px;
    background: linear-gradient(180deg, #fff 0%, #d0a0ff 50%, #8050ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0 0 16px;
    filter: drop-shadow(0 0 40px rgba(140, 80, 255, 0.4));
  }

  .magnetic-subtitle {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.5);
    letter-spacing: 6px;
    margin: 0;
  }
}

.cards-container {
  position: relative;
  z-index: 10;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  max-width: 1200px;
  width: 90%;
  padding: 20px 0;
  perspective: 1200px;
}

.magnetic-card {
  position: relative;
  border-radius: 24px;
  overflow: visible;
  cursor: pointer;
  transform-style: preserve-3d;

  .card-field-aura {
    position: absolute;
    inset: -20px;
    border-radius: 28px;
    opacity: 0;
    transition: opacity 0.5s ease;
  }

  &.pole-s .card-field-aura {
    background: radial-gradient(ellipse, rgba(255, 60, 80, 0.2), transparent 70%);
  }
  &.pole-n .card-field-aura {
    background: radial-gradient(ellipse, rgba(60, 130, 255, 0.2), transparent 70%);
  }

  .card-inner {
    position: relative;
    z-index: 2;
    padding: 28px 22px;
    border-radius: 24px;
    background: linear-gradient(180deg, rgba(20, 20, 31, 0.9) 0%, rgba(15, 15, 25, 0.95) 100%);
    border: 1px solid rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    min-height: 280px;
    display: flex;
    flex-direction: column;
    gap: 16px;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 24px;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
      pointer-events: none;
    }
  }

  &.pole-s .card-inner {
    border-color: rgba(255, 60, 80, 0.15);
  }
  &.pole-n .card-inner {
    border-color: rgba(60, 130, 255, 0.15);
  }

  .pole-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    position: relative;

    .pole-label {
      font-size: 24px;
      font-weight: 900;
      z-index: 2;
    }

    .pole-glow {
      position: absolute;
      inset: -8px;
      border-radius: 50%;
      animation: poleGlow 2s ease-in-out infinite;
    }
  }

  &.pole-s {
    .pole-indicator {
      background: rgba(255, 60, 80, 0.15);
      .pole-label { color: #ff4060; text-shadow: 0 0 20px rgba(255, 60, 80, 0.5); }
      .pole-glow { background: radial-gradient(circle, rgba(255, 60, 80, 0.3), transparent); }
    }
  }
  &.pole-n {
    .pole-indicator {
      background: rgba(60, 130, 255, 0.15);
      .pole-label { color: #4090ff; text-shadow: 0 0 20px rgba(60, 130, 255, 0.5); }
      .pole-glow { background: radial-gradient(circle, rgba(60, 130, 255, 0.3), transparent); }
    }
  }

  .card-body {
    flex: 1;

    .card-index {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.3);
      letter-spacing: 3px;
    }
    .card-title {
      font-size: 22px;
      font-weight: 700;
      color: #fff;
      margin: 8px 0;
      letter-spacing: 2px;
    }
    .card-desc {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.5);
      line-height: 1.6;
      margin: 0;
    }
  }

  .card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .card-tag {
      font-size: 10px;
      letter-spacing: 3px;
      padding: 5px 14px;
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.05);
      color: rgba(255, 255, 255, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .force-meter {
      width: 80px;
      height: 4px;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 2px;
      overflow: hidden;

      .force-fill {
        height: 100%;
        border-radius: 2px;
        background: linear-gradient(90deg, #ff4060, #4090ff);
        box-shadow: 0 0 8px rgba(140, 80, 255, 0.4);
        transition: width 1s ease;
      }
    }
  }

  .repulsion-wave {
    position: absolute;
    inset: -15px;
    border-radius: 28px;
    border: 2px solid rgba(140, 80, 255, 0.3);
    opacity: 0;
    transform: scale(0);
    pointer-events: none;
  }

  &:hover .card-inner {
    border-color: rgba(140, 80, 255, 0.4);
    box-shadow:
      0 0 40px rgba(140, 80, 255, 0.15),
      inset 0 0 20px rgba(255, 255, 255, 0.03);
  }
}

@keyframes poleGlow {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.3); opacity: 1; }
}

.magnetic-footer {
  position: relative;
  z-index: 10;
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  .polarity-indicator {
    display: flex;
    align-items: center;
    gap: 0;

    .pole-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }
    .s-dot { background: #ff4060; box-shadow: 0 0 15px rgba(255, 60, 80, 0.5); }
    .n-dot { background: #4090ff; box-shadow: 0 0 15px rgba(60, 130, 255, 0.5); }
    .pole-line {
      width: 80px;
      height: 2px;
      background: linear-gradient(90deg, #ff4060, #8050ff, #4090ff);
    }
  }

  .footer-text {
    font-size: 14px;
    letter-spacing: 3px;
    color: rgba(255, 255, 255, 0.4);
  }
}
</style>
