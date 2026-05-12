<template>
  <div ref="containerRef" class="feather-container">
    <!-- 柔和背景 -->
    <div class="feather-bg">
      <div class="bg-aurora aurora-1" />
      <div class="bg-aurora aurora-2" />
      <div class="bg-aurora aurora-3" />
    </div>

    <!-- 装饰粒子 -->
    <div class="ambient-particles">
      <div v-for="i in 20" :key="i" class="ambient-particle" :style="getParticleStyle(i)" />
    </div>

    <!-- 主内容卡片 -->
    <div ref="cardRef" class="feather-card">
      <!-- 图片区域 -->
      <div class="card-image-section">
        <div class="image-frame">
          <div class="frame-corner top-left" />
          <div class="frame-corner top-right" />
          <div class="frame-corner bottom-left" />
          <div class="frame-corner bottom-right" />

          <div class="image-wrapper">
            <img
              ref="imageRef"
              class="card-image"
              src="https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=1200&q=80"
              alt="Feather Light"
            />
            <div class="image-overlay" />
          </div>
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="card-content-section">
        <div ref="contentRef" class="card-content">
          <div ref="tagRef" class="content-tag">SOFT TRANSITION</div>

          <h2 ref="titleRef" class="content-title">
            Gentle Breeze
          </h2>

          <p ref="descRef" class="content-description">
            Like a feather drifting on the wind,<br />
            gracefully ascending into the light
          </p>

          <div ref="metaRef" class="content-meta">
            <div class="meta-item">
              <span class="meta-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M12 3v1m0 16v1m-8-9H3m18 0h-1m-2.636-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707" />
                  <circle cx="12" cy="12" r="4" />
                </svg>
              </span>
              <span class="meta-text">Ambient Light</span>
            </div>
            <div class="meta-item">
              <span class="meta-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
                  <line x1="16" y1="8" x2="2" y2="22" />
                  <line x1="17.5" y1="15" x2="9" y2="15" />
                </svg>
              </span>
              <span class="meta-text">Soft Focus</span>
            </div>
          </div>

          <div ref="ctaRef" class="content-action">
            <span class="action-text">Experience More</span>
            <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部装饰 -->
    <div class="feather-footer">
      <div ref="footerLineRef" class="footer-line" />
      <div ref="footerDotsRef" class="footer-dots">
        <span v-for="i in 5" :key="i" class="footer-dot" />
      </div>
    </div>

    <!-- 进度指示 -->
    <div class="scroll-progress">
      <div ref="progressFillRef" class="progress-fill" />
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
const contentRef = ref<HTMLElement | null>(null)
const tagRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const descRef = ref<HTMLElement | null>(null)
const metaRef = ref<HTMLElement | null>(null)
const ctaRef = ref<HTMLElement | null>(null)
const footerLineRef = ref<HTMLElement | null>(null)
const footerDotsRef = ref<HTMLElement | null>(null)
const progressFillRef = ref<HTMLElement | null>(null)

const getParticleStyle = (i: number) => {
  const colors = [
    'rgba(255, 107, 157, 0.4)',
    'rgba(108, 92, 231, 0.4)',
    'rgba(162, 155, 254, 0.3)',
    'rgba(255, 159, 128, 0.3)',
    'rgba(116, 185, 255, 0.4)'
  ]
  const size = 2 + (i % 4) * 2
  const x = 10 + ((i * 47) % 80)
  const y = 15 + ((i * 31) % 70)
  const delay = (i * 0.3) % 5
  const duration = 4 + (i % 3)
  const color = colors[i % colors.length]

  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${x}%`,
    top: `${y}%`,
    background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  }
}

function initAnimations() {
  if (!containerRef.value || !cardRef.value) return

  // 初始状态 - 卡片完全可见
  gsap.set(cardRef.value, {
    y: 0,
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)'
  })

  // 内容元素初始位置
  gsap.set([tagRef.value, titleRef.value, descRef.value, metaRef.value, ctaRef.value], {
    opacity: 0,
    y: 30
  })

  // 底部装饰初始
  gsap.set([footerLineRef.value, footerDotsRef.value], {
    opacity: 0,
    scaleX: 0
  })

  gsap.set(progressFillRef.value, {
    scaleX: 0,
    transformOrigin: 'left center'
  })

  // 入场动画
  const entryTl = gsap.timeline()

  gsap.set(footerLineRef.value, { transformOrigin: 'left center' })

  entryTl
    .to([tagRef.value, titleRef.value], {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out'
    })
    .to([descRef.value, metaRef.value], {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power2.out'
    }, '-=0.3')
    .to(ctaRef.value, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: 'power2.out'
    }, '-=0.2')
    .to(footerLineRef.value, {
      opacity: 1,
      scaleX: 1,
      duration: 0.6,
      ease: 'power2.out'
    }, '-=0.3')
    .to('.footer-dot', {
      opacity: 0.6,
      duration: 0.3,
      stagger: 0.05,
      ease: 'power2.out'
    }, '-=0.4')

  cleanupFns.push(() => entryTl.kill())

  // 滚动退出动画 - 轻羽上浮效果
  const scrollTl = gsap.timeline({
    scrollTrigger: {
      trigger: containerRef.value,
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  })

  cleanupFns.push(() => scrollTl.kill())

  // 核心效果: y上浮 + 透明度渐隐 + 缩放微缩 + 轻微模糊
  scrollTl
    .to(cardRef.value, {
      y: -40,
      opacity: 0,
      scale: 0.96,
      filter: 'blur(1.5px)',
      ease: 'none',
      duration: 1
    })
    // 内容同步淡出
    .to([contentRef.value], {
      opacity: 0,
      y: -20,
      filter: 'blur(1px)',
      ease: 'none',
      duration: 1
    }, 0)

  // 进度条跟随
  ScrollTrigger.create({
    trigger: containerRef.value,
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,
    onUpdate: (self) => {
      if (progressFillRef.value) {
        gsap.set(progressFillRef.value, { scaleX: self.progress })
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
.feather-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}

// 背景极光
.feather-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;

  .bg-aurora {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.3;

    &.aurora-1 {
      width: 60vw;
      height: 60vw;
      background: radial-gradient(circle, rgba(255, 107, 157, 0.4) 0%, transparent 70%);
      top: -20%;
      left: -10%;
      animation: float-aurora 8s ease-in-out infinite;
    }

    &.aurora-2 {
      width: 50vw;
      height: 50vw;
      background: radial-gradient(circle, rgba(108, 92, 231, 0.4) 0%, transparent 70%);
      bottom: -15%;
      right: -10%;
      animation: float-aurora 10s ease-in-out infinite reverse;
    }

    &.aurora-3 {
      width: 40vw;
      height: 40vw;
      background: radial-gradient(circle, rgba(162, 155, 254, 0.3) 0%, transparent 70%);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      animation: pulse-aurora 6s ease-in-out infinite;
    }
  }
}

@keyframes float-aurora {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(30px, -20px) scale(1.1); }
}

@keyframes pulse-aurora {
  0%, 100% { opacity: 0.2; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.4; transform: translate(-50%, -50%) scale(1.2); }
}

// 环境粒子
.ambient-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;

  .ambient-particle {
    position: absolute;
    border-radius: 50%;
    animation: particle-float 5s ease-in-out infinite;
  }
}

@keyframes particle-float {
  0%, 100% { transform: translateY(0) scale(1); opacity: 0.4; }
  50% { transform: translateY(-20px) scale(1.2); opacity: 0.7; }
}

// 主卡片
.feather-card {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(90vw, 1100px);
  height: min(85vh, 700px);
  display: flex;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  overflow: hidden;
  backdrop-filter: blur(20px);
  box-shadow:
    0 25px 80px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.05) inset;
}

// 图片区域
.card-image-section {
  flex: 1.2;
  padding: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-frame {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  overflow: hidden;

  .frame-corner {
    position: absolute;
    width: 30px;
    height: 30px;
    z-index: 2;
    pointer-events: none;

    &::before,
    &::after {
      content: '';
      position: absolute;
      background: linear-gradient(135deg, #ff6b9d 0%, #c44569 100%);
    }

    &::before {
      width: 100%;
      height: 2px;
    }

    &::after {
      width: 2px;
      height: 100%;
    }

    &.top-left {
      top: 12px;
      left: 12px;
      &::before { top: 0; left: 0; }
      &::after { top: 0; left: 0; }
    }

    &.top-right {
      top: 12px;
      right: 12px;
      &::before { top: 0; right: 0; }
      &::after { top: 0; right: 0; }
    }

    &.bottom-left {
      bottom: 12px;
      left: 12px;
      &::before { bottom: 0; left: 0; }
      &::after { bottom: 0; left: 0; }
    }

    &.bottom-right {
      bottom: 12px;
      right: 12px;
      &::before { bottom: 0; right: 0; }
      &::after { bottom: 0; right: 0; }
    }
  }
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 107, 157, 0.1) 0%,
    transparent 50%,
    rgba(108, 92, 231, 0.1) 100%
  );
  pointer-events: none;
}

// 内容区域
.card-content-section {
  flex: 1;
  padding: 50px 40px;
  display: flex;
  align-items: center;
}

.card-content {
  max-width: 400px;
}

.content-tag {
  display: inline-block;
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.25em;
  color: #ff6b9d;
  background: rgba(255, 107, 157, 0.12);
  border: 1px solid rgba(255, 107, 157, 0.25);
  padding: 8px 16px;
  margin-bottom: 24px;
  text-transform: uppercase;
}

.content-title {
  font-family: 'Playfair Display', 'Georgia', serif;
  font-size: clamp(2rem, 4vw, 3.2rem);
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 20px 0;
  line-height: 1.15;
  letter-spacing: -0.02em;
}

.content-description {
  font-family: 'Inter', -apple-system, sans-serif;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 32px 0;
  line-height: 1.7;
  font-weight: 300;
}

.content-meta {
  display: flex;
  gap: 24px;
  margin-bottom: 36px;

  .meta-item {
    display: flex;
    align-items: center;
    gap: 10px;

    .meta-icon {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;

      svg {
        width: 18px;
        height: 18px;
        color: #c44569;
      }
    }

    .meta-text {
      font-family: 'Inter', sans-serif;
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.6);
      font-weight: 400;
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
  background: linear-gradient(135deg, #ff6b9d 0%, #c44569 100%);
  border-radius: 50px;
  box-shadow:
    0 8px 30px rgba(255, 107, 157, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  transition: all 0.3s ease;

  .action-icon {
    width: 18px;
    height: 18px;
    transition: transform 0.3s ease;
  }

  &:hover {
    transform: translateX(5px);
    box-shadow:
      0 12px 40px rgba(255, 107, 157, 0.5),
      0 0 0 1px rgba(255, 255, 255, 0.15) inset;

    .action-icon {
      transform: translateX(4px);
    }
  }
}

// 底部装饰
.feather-footer {
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  .footer-line {
    width: 1px;
    height: 60px;
    background: linear-gradient(to bottom, rgba(255, 107, 157, 0.6), transparent);
  }

  .footer-dots {
    display: flex;
    gap: 12px;

    .footer-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      opacity: 0;

      &:nth-child(2) { opacity: 0.5; }
      &:nth-child(3) { opacity: 0.7; }
      &:nth-child(4) { opacity: 0.5; }
    }
  }
}

// 滚动进度
.scroll-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(255, 255, 255, 0.05);

  .progress-fill {
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, #ff6b9d 0%, #c44569 50%, #6c5ce7 100%);
    transform-origin: left center;
    transform: scaleX(0);
  }
}

// 响应式
@media (max-width: 900px) {
  .feather-card {
    flex-direction: column;
    height: auto;
    min-height: 90vh;
    width: 92vw;
  }

  .card-image-section {
    flex: none;
    height: 45vh;
    padding: 20px;
  }

  .card-content-section {
    flex: none;
    padding: 30px 25px;
  }

  .card-content {
    max-width: 100%;
  }

  .content-title {
    font-size: clamp(1.8rem, 5vw, 2.5rem);
  }

  .content-meta {
    flex-wrap: wrap;
    gap: 16px;
  }
}
</style>
