<template>
  <div ref="containerRef" class="sink-container">
    <!-- 背景装饰 -->
    <div class="sink-bg">
      <div class="bg-gradient" />
      <div class="bg-glow glow-1" />
      <div class="bg-glow glow-2" />
    </div>

    <!-- 环境光效 -->
    <div class="ambient-effects">
      <div v-for="i in 12" :key="i" class="ambient-orb" :style="getOrbStyle(i)" />
    </div>

    <!-- 主卡片 -->
    <div ref="cardRef" class="sink-card">
      <!-- 暗角遮罩 -->
      <div ref="vignetteRef" class="card-vignette" />

      <!-- 图片区域 -->
      <div class="card-image-area">
        <div class="image-container">
          <img
            ref="imageRef"
            class="card-image"
            src="https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200&q=80"
            alt="Ocean Wave"
          />
          <div class="image-shimmer" />
        </div>

        <!-- 装饰边框 -->
        <div class="frame-decoration">
          <div class="frame-line top" />
          <div class="frame-line bottom" />
        </div>
      </div>

      <!-- 内容区域 -->
      <div ref="contentRef" class="card-content">
        <div class="content-header">
          <div ref="badgeRef" class="content-badge">
            <svg class="badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            <span>PREMIUM</span>
          </div>
        </div>

        <h2 ref="titleRef" class="content-title">Deep Blue</h2>

        <p ref="subtitleRef" class="content-subtitle">
          Where Silence Meets Majesty
        </p>

        <div ref="dividerRef" class="content-divider">
          <div class="divider-line" />
          <div class="divider-diamond" />
          <div class="divider-line" />
        </div>

        <p ref="descRef" class="content-description">
          Embrace the profound tranquility of the ocean depths,
          where light fades into eternal serenity
        </p>

        <div ref="statsRef" class="content-stats">
          <div class="stat-item">
            <span class="stat-value">2,400m</span>
            <span class="stat-label">Depth</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">71%</span>
            <span class="stat-label">Covered</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">∞</span>
            <span class="stat-label">Mystery</span>
          </div>
        </div>

        <div ref="ctaRef" class="content-action">
          <span>Dive Deeper</span>
          <svg class="action-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>

    <!-- 底部装饰 -->
    <div class="sink-footer">
      <div ref="footerRef" class="footer-decoration">
        <div class="footer-waves">
          <svg viewBox="0 0 1440 100" fill="none" preserveAspectRatio="none">
            <path d="M0 50C240 80 480 20 720 50C960 80 1200 20 1440 50V100H0V50Z" fill="url(#waveGradient)" opacity="0.3"/>
            <defs>
              <linearGradient id="waveGradient" x1="0" y1="0" x2="1440" y2="0">
                <stop offset="0%" stop-color="#00d4ff"/>
                <stop offset="50%" stop-color="#7c3aed"/>
                <stop offset="100%" stop-color="#ec4899"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>

    <!-- 进度指示 -->
    <div class="scroll-indicator">
      <div ref="progressRef" class="indicator-fill" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []

const containerRef = ref<HTMLElement | null>(null)
const cardRef = ref<HTMLElement | null>(null)
const imageRef = ref<HTMLElement | null>(null)
const vignetteRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const badgeRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const dividerRef = ref<HTMLElement | null>(null)
const descRef = ref<HTMLElement | null>(null)
const statsRef = ref<HTMLElement | null>(null)
const ctaRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const progressRef = ref<HTMLElement | null>(null)

const getOrbStyle = (i: number) => {
  const colors = [
    'rgba(0, 212, 255, 0.15)',
    'rgba(124, 58, 237, 0.15)',
    'rgba(236, 72, 153, 0.12)',
    'rgba(16, 185, 129, 0.1)'
  ]
  const size = 100 + (i % 5) * 80
  const x = 5 + ((i * 73) % 90)
  const y = 5 + ((i * 47) % 90)
  const duration = 6 + (i % 4) * 2
  const delay = (i * 1.2) % 8
  const color = colors[i % colors.length]

  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${x}%`,
    top: `${y}%`,
    background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`
  }
}

function initAnimations() {
  if (!containerRef.value || !cardRef.value) return

  // 初始状态
  gsap.set(cardRef.value, {
    y: 0,
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)'
  })

  gsap.set(vignetteRef.value, {
    opacity: 0
  })

  gsap.set([badgeRef.value, titleRef.value, subtitleRef.value], {
    opacity: 0,
    y: 40
  })

  gsap.set(dividerRef.value, {
    opacity: 0,
    scaleX: 0
  })

  gsap.set([descRef.value, statsRef.value, ctaRef.value], {
    opacity: 0,
    y: 30
  })

  gsap.set(footerRef.value, {
    opacity: 0,
    y: 20
  })

  gsap.set(progressRef.value, {
    scaleX: 0,
    transformOrigin: 'left center'
  })

  // 入场动画
  const entryTl = gsap.timeline()

  gsap.set(dividerRef.value, { transformOrigin: 'center' })

  entryTl
    .to(badgeRef.value, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power2.out'
    })
    .to(titleRef.value, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, '-=0.3')
    .to(subtitleRef.value, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power2.out'
    }, '-=0.35')
    .to(dividerRef.value, {
      opacity: 1,
      scaleX: 1,
      duration: 0.5,
      ease: 'power2.out'
    }, '-=0.2')
    .to(descRef.value, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power2.out'
    }, '-=0.3')
    .to(statsRef.value, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power2.out'
    }, '-=0.3')
    .to(ctaRef.value, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: 'power2.out'
    }, '-=0.25')
    .to(footerRef.value, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: 'power2.out'
    }, '-=0.2')

  cleanupFns.push(() => entryTl.kill())

  // 滚动沉降动画 - 沉淀离去效果
  const scrollTl = gsap.timeline({
    scrollTrigger: {
      trigger: containerRef.value,
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  })

  cleanupFns.push(() => scrollTl.kill())

  // 核心效果: y沉降 + 透明度渐隐 + 尺寸收缩 + 模糊 + 暗角收拢
  scrollTl
    .to(cardRef.value, {
      y: 50,
      opacity: 0,
      scale: 0.94,
      filter: 'blur(1.2px)',
      ease: 'none',
      duration: 1
    }, 0)
    .to(vignetteRef.value, {
      opacity: 0.25,
      ease: 'none',
      duration: 1
    }, 0)
    .to(contentRef.value, {
      opacity: 0,
      y: 30,
      filter: 'blur(0.8px)',
      ease: 'none',
      duration: 1
    }, 0)

  // 进度指示
  ScrollTrigger.create({
    trigger: containerRef.value,
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,
    onUpdate: (self) => {
      if (progressRef.value) {
        gsap.set(progressRef.value, { scaleX: self.progress })
      }
    }
  })

  // 注册清理
  ScrollTrigger.getAll().forEach(st => {
    cleanupFns.push(() => st.kill())
  })
}

onMounted(() => {
  initAnimations()
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0
})
</script>

<style lang="scss" scoped>
.sink-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(160deg, #0f0f23 0%, #1a1a3e 40%, #0d0d1f 100%);
}

// 背景
.sink-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;

  .bg-gradient {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 30% 20%, rgba(0, 212, 255, 0.08) 0%, transparent 50%),
      radial-gradient(ellipse at 70% 80%, rgba(124, 58, 237, 0.08) 0%, transparent 50%);
  }

  .bg-glow {
    position: absolute;
    border-radius: 50%;
    filter: blur(100px);
    opacity: 0.4;

    &.glow-1 {
      width: 40vw;
      height: 40vw;
      background: radial-gradient(circle, rgba(0, 212, 255, 0.3) 0%, transparent 70%);
      top: -10%;
      right: -5%;
    }

    &.glow-2 {
      width: 35vw;
      height: 35vw;
      background: radial-gradient(circle, rgba(236, 72, 153, 0.25) 0%, transparent 70%);
      bottom: -10%;
      left: -5%;
    }
  }
}

// 环境光效
.ambient-effects {
  position: absolute;
  inset: 0;
  pointer-events: none;

  .ambient-orb {
    position: absolute;
    border-radius: 50%;
    animation: orb-float 8s ease-in-out infinite;
  }
}

@keyframes orb-float {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
  50% { transform: translate(20px, -15px) scale(1.05); opacity: 0.7; }
}

// 主卡片
.sink-card {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(90vw, 1000px);
  height: min(80vh, 620px);
  display: flex;
  background: linear-gradient(135deg, rgba(15, 15, 35, 0.95) 0%, rgba(26, 26, 62, 0.9) 100%);
  border: 1px solid rgba(0, 212, 255, 0.15);
  border-radius: 20px;
  overflow: hidden;
  backdrop-filter: blur(30px);
  box-shadow:
    0 30px 80px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.03) inset;
}

// 暗角遮罩
.card-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at center,
    transparent 30%,
    rgba(0, 0, 0, 0.6) 100%
  );
  pointer-events: none;
  z-index: 5;
  opacity: 0;
}

// 图片区域
.card-image-area {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.image-container {
  position: relative;
  width: 100%;
  height: 100%;

  .card-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.9) saturate(1.1);
  }

  .image-shimmer {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(0, 212, 255, 0.05) 0%,
      transparent 40%,
      rgba(124, 58, 237, 0.05) 100%
    );
    pointer-events: none;
  }
}

.frame-decoration {
  position: absolute;
  inset: 0;
  pointer-events: none;

  .frame-line {
    position: absolute;
    background: linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.6), transparent);

    &.top {
      top: 15px;
      left: 10%;
      right: 10%;
      height: 1px;
    }

    &.bottom {
      bottom: 15px;
      left: 10%;
      right: 10%;
      height: 1px;
    }
  }
}

// 内容区域
.card-content {
  flex: 0.9;
  padding: 50px 45px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 2;
}

.content-header {
  margin-bottom: 20px;
}

.content-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  color: #00d4ff;
  background: rgba(0, 212, 255, 0.1);
  border: 1px solid rgba(0, 212, 255, 0.25);
  padding: 8px 14px;
  text-transform: uppercase;

  .badge-icon {
    width: 14px;
    height: 14px;
  }
}

.content-title {
  font-family: 'Playfair Display', 'Georgia', serif;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 12px 0;
  line-height: 1.1;
  letter-spacing: -0.02em;
  text-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
}

.content-subtitle {
  font-family: 'Inter', -apple-system, sans-serif;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.65);
  margin: 0 0 28px 0;
  font-weight: 300;
  letter-spacing: 0.08em;
}

.content-divider {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 28px;

  .divider-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, rgba(0, 212, 255, 0.4), rgba(124, 58, 237, 0.4));
  }

  .divider-diamond {
    width: 8px;
    height: 8px;
    background: linear-gradient(135deg, #00d4ff, #7c3aed);
    transform: rotate(45deg);
  }
}

.content-description {
  font-family: 'Inter', -apple-system, sans-serif;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 32px 0;
  line-height: 1.75;
  font-weight: 300;
}

.content-stats {
  display: flex;
  gap: 36px;
  margin-bottom: 36px;

  .stat-item {
    display: flex;
    flex-direction: column;
    gap: 6px;

    .stat-value {
      font-family: 'SF Mono', 'Fira Code', monospace;
      font-size: 1.5rem;
      font-weight: 700;
      color: #00d4ff;
      text-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
    }

    .stat-label {
      font-family: 'Inter', sans-serif;
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.4);
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
  }
}

.content-action {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  color: #ffffff;
  cursor: pointer;
  padding: 14px 28px;
  background: linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%);
  border-radius: 50px;
  box-shadow:
    0 8px 30px rgba(0, 212, 255, 0.35),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  transition: all 0.3s ease;
  align-self: flex-start;

  .action-arrow {
    width: 18px;
    height: 18px;
    transition: transform 0.3s ease;
  }

  &:hover {
    transform: translateX(5px);
    box-shadow:
      0 12px 40px rgba(0, 212, 255, 0.45),
      0 0 0 1px rgba(255, 255, 255, 0.15) inset;

    .action-arrow {
      transform: translateX(4px);
    }
  }
}

// 底部装饰
.sink-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  z-index: 10;

  .footer-decoration {
    width: 100%;
    height: 100%;

    .footer-waves {
      width: 100%;
      height: 100%;

      svg {
        width: 100%;
        height: 100%;
      }
    }
  }
}

// 进度指示
.scroll-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(255, 255, 255, 0.05);
  z-index: 20;

  .indicator-fill {
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, #00d4ff 0%, #7c3aed 50%, #ec4899 100%);
    transform-origin: left center;
    transform: scaleX(0);
  }
}

// 响应式
@media (max-width: 850px) {
  .sink-card {
    flex-direction: column;
    width: 92vw;
    height: auto;
    min-height: 90vh;
  }

  .card-image-area {
    flex: none;
    height: 40vh;
  }

  .card-content {
    flex: none;
    padding: 30px 25px;
  }

  .content-title {
    font-size: clamp(2rem, 8vw, 2.8rem);
  }

  .content-stats {
    gap: 24px;
    flex-wrap: wrap;
  }

  .content-action {
    align-self: stretch;
    justify-content: center;
  }
}
</style>
