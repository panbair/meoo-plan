<template>
  <div ref="sectionRef" class="card-singularity">
    <!-- 深空背景 -->
    <div class="singularity-bg">
      <div ref="nebula1Ref" class="nebula nebula-1"></div>
      <div ref="nebula2Ref" class="nebula nebula-2"></div>
      <div ref="nebula3Ref" class="nebula nebula-3"></div>
      <div ref="starsRef" class="star-field"></div>
      <div ref="wormholeRef" class="wormhole"></div>
    </div>

    <!-- 奇点中心 -->
    <div ref="singularityRef" class="cosmic-singularity">
      <div class="singularity-core"></div>
      <div class="singularity-ring ring-1"></div>
      <div class="singularity-ring ring-2"></div>
      <div class="singularity-ring ring-3"></div>
    </div>

    <!-- 内容区域 -->
    <div class="singularity-content">
      <div ref="badgeRef" class="singularity-badge">
        <span class="badge-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 2v4m0 12v4M2 12h4m12 0h4"/>
            <path d="M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/>
          </svg>
        </span>
        BIG BANG
      </div>

      <h2 ref="titleRef" class="singularity-title">
        <span class="title-word" v-for="(word, i) in titleWords" :key="i" :style="{ '--word-delay': i * 0.1 }">{{ word }}</span>
      </h2>

      <p ref="subtitleRef" class="singularity-subtitle">从虚无爆发 · 星系诞生</p>

      <!-- 涡旋卡片区域 -->
      <div ref="vortexGridRef" class="vortex-grid" :class="{ 'is-exploded': isExploded }">
        <div
          v-for="(card, i) in cosmicCards"
          :key="'vortex-card-' + i"
          :ref="el => cardRefs.set(i, el as HTMLElement)"
          class="vortex-card"
          :style="{ '--card-index': i, '--card-hue': card.hue }"
          :data-card-id="i"
        >
          <div class="card-inner">
            <div class="card-glow-effect"></div>
            <div class="card-icon">
              <div v-html="card.icon"></div>
            </div>
            <div class="card-number">{{ String(i + 1).padStart(2, '0') }}</div>
            <h3 class="card-title">{{ card.title }}</h3>
            <p class="card-desc">{{ card.desc }}</p>
            <div class="card-metric">
              <span class="metric-value">{{ card.value }}</span>
              <span class="metric-label">{{ card.label }}</span>
            </div>
            <div class="card-particles">
              <span v-for="p in 3" :key="p" class="particle" :style="{ '--particle-delay': p * 0.3 }"></span>
            </div>
          </div>
          <div class="card-shimmer"></div>
        </div>
      </div>

      <div ref="footerRef" class="singularity-footer">
        <span>SINGULARITY EXPANSION · COSMIC BIRTH</span>
      </div>
    </div>

    <!-- 能量波纹 -->
    <div ref="ripple1Ref" class="energy-ripple ripple-1"></div>
    <div ref="ripple2Ref" class="energy-ripple ripple-2"></div>
    <div ref="ripple3Ref" class="energy-ripple ripple-3"></div>
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
const footerRef = ref<HTMLElement | null>(null)
const singularityRef = ref<HTMLElement | null>(null)
const vortexGridRef = ref<HTMLElement | null>(null)
const cardRefs = ref(new Map<number, HTMLElement>())
const starsRef = ref<HTMLElement | null>(null)
const nebula1Ref = ref<HTMLElement | null>(null)
const nebula2Ref = ref<HTMLElement | null>(null)
const nebula3Ref = ref<HTMLElement | null>(null)
const wormholeRef = ref<HTMLElement | null>(null)
const ripple1Ref = ref<HTMLElement | null>(null)
const ripple2Ref = ref<HTMLElement | null>(null)
const ripple3Ref = ref<HTMLElement | null>(null)

const isExploded = ref(false)
const titleWords = ['宇宙', '奇点', '·', '涡旋', '扩散']

const cosmicCards = [
  {
    title: '星系',
    desc: '亿万星辰的家园',
    value: '∞',
    label: '恒星数量',
    hue: 240,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-30 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(30 12 12)"/></svg>'
  },
  {
    title: '行星',
    desc: '宇宙中的蓝色弹珠',
    value: '8',
    label: '太阳系行星',
    hue: 200,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c-2 2-3 5-3 9s1 7 3 9"/><ellipse cx="12" cy="12" rx="3" ry="8"/></svg>'
  },
  {
    title: '星云',
    desc: '恒星的诞生之地',
    value: '1K+',
    label: '观测数量',
    hue: 280,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2l2 6 6-1-5 5 2 6-5-3-5 3 2-6-5-5 6 1z"/><circle cx="12" cy="12" r="3"/></svg>'
  },
  {
    title: '黑洞',
    desc: '时空的终极漩涡',
    value: 'M87*',
    label: '首张影像',
    hue: 0,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="2"/></svg>'
  },
  {
    title: '流星',
    desc: '划过夜空的刹那',
    value: '100/s',
    label: '地球接触',
    hue: 35,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3l1 5-4 2 4 2-1 5-4-3 4-3-4-3z"/><path d="M5 16l2-2"/><path d="M19 16l-2-2"/></svg>'
  },
  {
    title: '深空',
    desc: '可观测宇宙边界',
    value: '93B',
    label: '光年之外',
    hue: 180,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/><path d="M12 2v4m0 12v4M2 12h4m12 0h4"/></svg>'
  }
]

const createStarField = () => {
  if (!starsRef.value) return
  const container = starsRef.value
  for (let i = 0; i < 80; i++) {
    const star = document.createElement('div')
    star.className = 'star'
    const size = Math.random() * 2 + 1
    star.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: white;
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      opacity: ${Math.random() * 0.8 + 0.2};
      animation: starTwinkle ${Math.random() * 3 + 2}s ease-in-out infinite;
      animation-delay: ${Math.random() * 3}s;
    `
    container.appendChild(star)
  }
}

const initAnimations = () => {
  if (!sectionRef.value) return

  // 入场动画
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 80%',
      toggleActions: 'play none none none'
    }
  })

  tl.fromTo(badgeRef.value,
    { scale: 0, opacity: 0, rotateZ: 180 },
    { scale: 1, opacity: 1, rotateZ: 0, duration: 0.7, ease: 'back.out(1.7)' }
  )
  .fromTo(titleRef.value,
    { y: 60, opacity: 0, scale: 0.5, filter: 'blur(15px)' },
    { y: 0, opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' },
    '-=0.4'
  )
  .fromTo(subtitleRef.value,
    { y: 40, opacity: 0, letterSpacing: '20px' },
    { y: 0, opacity: 1, letterSpacing: '4px', duration: 0.6, ease: 'power2.out' },
    '-=0.3'
  )
  .fromTo(footerRef.value,
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
    '-=0.2'
  )

  cleanupFns.push(() => tl.kill())

  // 奇点脉冲动画
  if (singularityRef.value) {
    const core = singularityRef.value.querySelector('.singularity-core')
    if (core) {
      gsap.to(core, {
        scale: 1.5,
        opacity: 0.6,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })
    }

    const rings = singularityRef.value.querySelectorAll('.singularity-ring')
    rings.forEach((ring, i) => {
      gsap.to(ring, {
        scale: 1 + (i + 1) * 0.3,
        opacity: 0,
        rotation: (i % 2 === 0 ? 360 : -360),
        duration: 3 + i,
        repeat: -1,
        ease: 'none'
      })
    })
  }

  // 星云动画
  if (nebula1Ref.value) {
    gsap.to(nebula1Ref.value, {
      x: 80,
      y: 60,
      scale: 1.2,
      duration: 12,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    })
  }
  if (nebula2Ref.value) {
    gsap.to(nebula2Ref.value, {
      x: -60,
      y: -40,
      scale: 1.1,
      duration: 10,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    })
  }
  if (nebula3Ref.value) {
    gsap.to(nebula3Ref.value, {
      x: 40,
      y: -80,
      scale: 1.3,
      duration: 15,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    })
  }

  // 虫洞旋转
  if (wormholeRef.value) {
    gsap.to(wormholeRef.value, {
      rotation: 360,
      duration: 20,
      repeat: -1,
      ease: 'none'
    })
  }

  // 能量波纹动画
  ;[ripple1Ref, ripple2Ref, ripple3Ref].forEach((rippleRef, i) => {
    if (rippleRef.value) {
      gsap.to(rippleRef.value, {
        scale: 3,
        opacity: 0,
        duration: 3,
        repeat: -1,
        delay: i * 1,
        ease: 'power2.out'
      })
    }
  })

  // 标题滚动效果
  if (titleRef.value) {
    const st1 = ScrollTrigger.create({
      trigger: titleRef.value,
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1.5,
      onUpdate: (self) => {
        gsap.set(titleRef.value, {
          y: -50 * self.progress,
          opacity: 1 - self.progress * 2,
          scale: 1 - self.progress * 0.2,
          filter: `blur(${self.progress * 10}px)`
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
      end: 'top 25%',
      scrub: 1.5,
      onUpdate: (self) => {
        gsap.set(subtitleRef.value, {
          y: -30 * self.progress,
          opacity: 1 - self.progress * 2,
          rotateX: self.progress * 25
        })
      }
    })
    cleanupFns.push(() => st2.kill())
  }

  // 奇点涡旋扩散动画
  setupVortexAnimation()
}

// ========== 涡旋扩散动画 ==========
const setupVortexAnimation = () => {
  if (!vortexGridRef.value) return

  nextTick(() => {
    const cards = vortexGridRef.value.querySelectorAll('.vortex-card')
    if (cards.length === 0) return

    // 保存卡片宽高
    const cardWidth = 200
    const cardHeight = 240

    // 计算奇点位置（容器中心）
    const gridRect = vortexGridRef.value.getBoundingClientRect()
    const centerX = gridRect.width / 2
    const centerY = gridRect.height / 2

    // 首先将卡片设置为奇点状态（初始隐藏）
    cards.forEach((card, i) => {
      const offsetX = (i % 3 - 1) * 20
      const offsetY = (Math.floor(i / 3) - 0.5) * 20
      gsap.set(card, {
        x: centerX - cardWidth / 2 + offsetX,
        y: centerY - cardHeight / 2 + offsetY,
        scale: 0,
        rotation: (i % 2 === 0 ? 45 : -45),
        opacity: 0,
        transformOrigin: 'center center'
      })
    })

    // 使用 ScrollTrigger + gsap 实现从奇点展开到网格的动画
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: vortexGridRef.value,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 1.5
      }
    })

    // 从奇点状态动画到网格位置
    tl.fromTo(cards,
      {
        x: (i) => {
          const offsetX = (i % 3 - 1) * 20
          return centerX - cardWidth / 2 + offsetX
        },
        y: (i) => {
          const offsetY = (Math.floor(i / 3) - 0.5) * 20
          return centerY - cardHeight / 2 + offsetY
        },
        scale: 0,
        rotation: (i) => (i % 2 === 0 ? 45 : -45),
        opacity: 0
      },
      {
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        stagger: { each: 0.08, from: 'random' }
      }
    )

    // 更新状态
    tl.eventCallback('onUpdate', () => {
      isExploded.value = tl.progress() > 0.3
    })

    // 保存清理函数
    cleanupFns.push(() => tl.kill())

    // 卡片悬停效果
    cards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          scale: 1.05,
          y: -8,
          duration: 0.3,
          ease: 'power2.out'
        })
      })

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          scale: 1,
          y: 0,
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
          rotateY: x * 10,
          rotateX: -y * 10,
          duration: 0.3,
          ease: 'power2.out'
        })
      })
    })
  })
}

onMounted(() => {
  createStarField()
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
@use 'sass:math';

.card-singularity {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(180deg, #000010 0%, #0a0020 30%, #150030 60%, #000010 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

// 深空背景
.singularity-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.star-field {
  position: absolute;
  inset: 0;
}

.star {
  animation: starTwinkle 3s ease-in-out infinite;
}

@keyframes starTwinkle {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.5); }
}

.nebula {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.3;
}

.nebula-1 {
  width: 600px;
  height: 600px;
  top: -200px;
  left: -100px;
  background: radial-gradient(circle, rgba(138, 43, 226, 0.6) 0%, transparent 70%);
}

.nebula-2 {
  width: 500px;
  height: 500px;
  bottom: -150px;
  right: -100px;
  background: radial-gradient(circle, rgba(0, 100, 200, 0.5) 0%, transparent 70%);
}

.nebula-3 {
  width: 400px;
  height: 400px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(255, 50, 100, 0.3) 0%, transparent 70%);
}

.wormhole {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  height: 800px;
  border: 2px solid transparent;
  border-radius: 50%;
  background:
    radial-gradient(circle, transparent 40%, rgba(138, 43, 226, 0.05) 50%, transparent 60%),
    conic-gradient(from 0deg, transparent, rgba(138, 43, 226, 0.1), transparent, rgba(75, 0, 130, 0.1), transparent);
  opacity: 0.5;
}

// 奇点中心
.cosmic-singularity {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  pointer-events: none;
}

.singularity-core {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  background: radial-gradient(circle, #fff 0%, #8b5cf6 50%, transparent 70%);
  border-radius: 50%;
  box-shadow: 0 0 40px #8b5cf6, 0 0 80px #8b5cf6;
}

.singularity-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid rgba(138, 43, 226, 0.4);
  border-radius: 50%;
}

.ring-1 { width: 60px; height: 60px; }
.ring-2 { width: 90px; height: 90px; }
.ring-3 { width: 120px; height: 120px; }

// 内容区域
.singularity-content {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 40px;
  max-width: 1200px;
  width: 100%;
}

.singularity-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 28px;
  background: rgba(138, 43, 226, 0.15);
  border: 1px solid rgba(138, 43, 226, 0.4);
  border-radius: 30px;
  color: #c4b5fd;
  font-size: 11px;
  letter-spacing: 4px;
  font-weight: 600;
  margin-bottom: 24px;
  backdrop-filter: blur(10px);

  .badge-icon {
    width: 16px;
    height: 16px;
    color: #8b5cf6;
    animation: badgePulse 2s ease-in-out infinite;

    svg {
      width: 100%;
      height: 100%;
    }
  }
}

@keyframes badgePulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.8; }
}

.singularity-title {
  font-family: 'Orbitron', 'Rajdhani', sans-serif;
  font-size: 56px;
  font-weight: 900;
  letter-spacing: 6px;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #fff 0%, #e0c3fc 30%, #8b5cf6 60%, #6366f1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 40px rgba(138, 43, 226, 0.5));
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;

  .title-word {
    display: inline-block;
    opacity: 0;
    animation: wordReveal 0.6s ease-out forwards;
    animation-delay: var(--word-delay);

    &:nth-child(4) {
      background: none;
      -webkit-text-fill-color: #8b5cf6;
    }
  }
}

@keyframes wordReveal {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.8);
    filter: blur(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}

.singularity-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 6px;
  margin-bottom: 50px;
}

// 涡旋网格
.vortex-grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  justify-items: center;
  align-items: center;
  min-height: 400px;
  max-width: 720px;
  margin: 0 auto 40px;

  &.is-exploded {
    .vortex-card {
      // 展开后保持相对定位
    }
  }
}

// 涡旋卡片
.vortex-card {
  position: relative;
  width: 200px;
  height: 240px;
  background: linear-gradient(145deg,
    rgba(20, 10, 40, 0.95) 0%,
    rgba(10, 5, 25, 0.98) 100%
  );
  border-radius: 20px;
  border: 1px solid hsla(var(--card-hue), 60%, 60%, 0.2);
  overflow: hidden;
  cursor: pointer;
  transform-style: preserve-3d;

  .card-inner {
    position: relative;
    z-index: 2;
    padding: 24px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .card-glow-effect {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle at center,
      hsla(var(--card-hue), 60%, 50%, 0.1) 0%,
      transparent 50%
    );
    opacity: 0.5;
    transition: opacity 0.3s;
  }

  &:hover {
    .card-glow-effect {
      opacity: 1;
    }
  }

  .card-icon {
    width: 60px;
    height: 60px;
    margin-bottom: 16px;
    background: linear-gradient(135deg,
      hsla(var(--card-hue), 60%, 50%, 0.2) 0%,
      hsla(var(--card-hue), 60%, 30%, 0.1) 100%
    );
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: hsla(var(--card-hue), 60%, 70%, 1);
    transition: transform 0.3s;

    :deep(svg) {
      width: 32px;
      height: 32px;
    }

    &:hover {
      transform: scale(1.1) rotate(10deg);
    }
  }

  .card-number {
    position: absolute;
    top: 12px;
    right: 16px;
    font-family: 'Orbitron', sans-serif;
    font-size: 28px;
    font-weight: 700;
    color: hsla(var(--card-hue), 60%, 50%, 0.15);
  }

  .card-title {
    font-size: 20px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 8px;
    letter-spacing: 2px;
  }

  .card-desc {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
    line-height: 1.5;
    margin-bottom: 16px;
    text-align: center;
  }

  .card-metric {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 16px;
    border-top: 1px solid hsla(var(--card-hue), 60%, 50%, 0.1);

    .metric-value {
      font-family: 'Orbitron', sans-serif;
      font-size: 24px;
      font-weight: 700;
      color: hsla(var(--card-hue), 60%, 70%, 1);
    }

    .metric-label {
      font-size: 10px;
      color: rgba(255, 255, 255, 0.4);
      letter-spacing: 1px;
      margin-top: 4px;
    }
  }

  .card-particles {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 6px;

    .particle {
      width: 4px;
      height: 4px;
      background: hsla(var(--card-hue), 60%, 60%, 0.6);
      border-radius: 50%;
      animation: particleOrbit 2s ease-in-out infinite;
      animation-delay: var(--particle-delay);
    }
  }
}

@keyframes particleOrbit {
  0%, 100% { transform: translateY(0) scale(1); opacity: 0.6; }
  50% { transform: translateY(-8px) scale(1.3); opacity: 1; }
}

.card-shimmer {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  transition: left 0.5s;

  .vortex-card:hover & {
    left: 100%;
  }
}

// 底部信息
.singularity-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;

  span {
    font-size: 10px;
    letter-spacing: 4px;
    color: rgba(255, 255, 255, 0.25);
  }
}

// 能量波纹
.energy-ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  border: 2px solid rgba(138, 43, 226, 0.3);
  border-radius: 50%;
  pointer-events: none;
  opacity: 0;
}

.ripple-1 {
  animation: rippleExpand 3s ease-out infinite;
}

.ripple-2 {
  animation: rippleExpand 3s ease-out infinite 1s;
}

.ripple-3 {
  animation: rippleExpand 3s ease-out infinite 2s;
}

@keyframes rippleExpand {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.6;
  }
  100% {
    transform: translate(-50%, -50%) scale(8);
    opacity: 0;
  }
}

// 响应式
@media (max-width: 1024px) {
  .vortex-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  .vortex-card {
    width: 180px;
    height: 220px;
  }
}

@media (max-width: 768px) {
  .singularity-title {
    font-size: 36px;
    letter-spacing: 4px;
  }

  .singularity-subtitle {
    font-size: 13px;
    letter-spacing: 3px;
  }

  .vortex-grid {
    grid-template-columns: 1fr;
    min-height: auto;
    gap: 16px;

    .vortex-card {
      width: 260px;
      height: 200px;
    }
  }
}
</style>
