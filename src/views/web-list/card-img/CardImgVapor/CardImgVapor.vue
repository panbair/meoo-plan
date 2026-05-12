<template>
  <div ref="containerRef" class="vapor-container">
    <!-- 背景 -->
    <div class="vapor-bg">
      <div class="bg-sun" />
      <div class="bg-rays">
        <div v-for="i in 12" :key="i" class="sun-ray" :style="getRayStyle(i)" />
      </div>
    </div>

    <!-- 升华粒子 -->
    <div ref="particlesRef" class="vapor-particles">
      <div
        v-for="i in 40"
        :key="i"
        :ref="el => setParticleRef(el, i)"
        class="vapor-particle"
        :style="getParticleStyle(i)"
      />
    </div>

    <!-- 主卡片 -->
    <div ref="cardRef" class="vapor-card">
      <!-- 金色光晕 -->
      <div ref="haloRef" class="card-halo" />

      <!-- 三层纵向分区 -->
      <div ref="layerTopRef" class="card-layer layer-top">
        <div class="layer-content">
          <div ref="tagRef" class="content-tag">SUBLIMATION</div>
          <h2 ref="titleRef" class="content-title">Morning Light</h2>
        </div>
      </div>

      <div ref="layerMidRef" class="card-layer layer-mid">
        <div class="layer-content">
          <div ref="imageWrapperRef" class="image-container">
            <img
              ref="imageRef"
              class="card-image"
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80"
              alt="Mountain Sunrise"
            />
            <div class="image-glow" />
          </div>
        </div>
      </div>

      <div ref="layerBottomRef" class="card-layer layer-bottom">
        <div class="layer-content">
          <p ref="subtitleRef" class="content-subtitle">
            Where Dreams Rise and Become Light
          </p>
          <p ref="descRef" class="content-description">
            Like morning frost beneath the first rays of dawn,
            gently ascending into eternal serenity
          </p>
          <div ref="ctaRef" class="content-action">
            <span>Ascend Together</span>
            <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- 装饰元素 -->
    <div class="vapor-decorations">
      <div class="corner-accent top-left" />
      <div class="corner-accent top-right" />
      <div class="corner-accent bottom-left" />
      <div class="corner-accent bottom-right" />
    </div>

    <!-- 底部进度 -->
    <div class="vapor-progress">
      <div ref="progressRef" class="progress-fill" />
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
const haloRef = ref<HTMLElement | null>(null)
const layerTopRef = ref<HTMLElement | null>(null)
const layerMidRef = ref<HTMLElement | null>(null)
const layerBottomRef = ref<HTMLElement | null>(null)
const imageRef = ref<HTMLElement | null>(null)
const imageWrapperRef = ref<HTMLElement | null>(null)
const tagRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const descRef = ref<HTMLElement | null>(null)
const ctaRef = ref<HTMLElement | null>(null)
const particlesRef = ref<HTMLElement | null>(null)
const progressRef = ref<HTMLElement | null>(null)

// 粒子 refs
const particleRefs: (HTMLElement | null)[] = []
const setParticleRef = (el: unknown, i: number) => {
  particleRefs[i] = el as HTMLElement | null
}

const getRayStyle = (i: number) => {
  const angle = (i / 12) * 360
  const delay = (i * 0.5) % 3
  return {
    transform: `rotate(${angle}deg)`,
    animationDelay: `${delay}s`
  }
}

const getParticleStyle = (i: number) => {
  const colors = [
    'rgba(255, 215, 0, 0.6)',
    'rgba(255, 183, 77, 0.5)',
    'rgba(255, 236, 179, 0.4)',
    'rgba(255, 245, 157, 0.5)'
  ]
  const size = 2 + (i % 4)
  const x = 20 + ((i * 37) % 60)
  const color = colors[i % colors.length]

  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${x}%`,
    bottom: `${-10 - (i % 30)}px`,
    background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
    opacity: 0,
    transform: `scale(0)`
  }
}

function initAnimations() {
  if (!containerRef.value || !cardRef.value) return

  // 初始状态
  gsap.set([layerTopRef.value, layerMidRef.value, layerBottomRef.value], {
    y: 0,
    opacity: 1
  })

  gsap.set(haloRef.value, {
    opacity: 0
  })

  gsap.set([tagRef.value, titleRef.value], {
    opacity: 0,
    y: 40
  })

  gsap.set([subtitleRef.value, descRef.value], {
    opacity: 0,
    y: 30
  })

  gsap.set(ctaRef.value, {
    opacity: 0,
    y: 25
  })

  gsap.set(progressRef.value, {
    scaleX: 0,
    transformOrigin: 'left center'
  })

  // 初始化粒子
  particleRefs.forEach((particle, i) => {
    if (particle) {
      gsap.set(particle, {
        opacity: 0,
        scale: 0,
        y: 0,
        x: 0
      })
    }
  })

  // 入场动画
  const entryTl = gsap.timeline()

  entryTl
    // 背景日出
    .from('.bg-sun', {
      scale: 0,
      opacity: 0,
      duration: 1,
      ease: 'power2.out'
    }, 0)
    // 光晕出现
    .to(haloRef.value, {
      opacity: 0.15,
      duration: 0.8,
      ease: 'power2.out'
    }, 0.2)
    // 内容依次显现
    .to(tagRef.value, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power2.out'
    }, 0.4)
    .to(titleRef.value, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, 0.5)
    .to(subtitleRef.value, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power2.out'
    }, 0.7)
    .to(descRef.value, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power2.out'
    }, 0.8)
    .to(ctaRef.value, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: 'power2.out'
    }, 0.95)

  cleanupFns.push(() => entryTl.kill())

  // 升华退场动画 - 滚动驱动
  const scrollTl = gsap.timeline({
    scrollTrigger: {
      trigger: containerRef.value,
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  })

  cleanupFns.push(() => scrollTl.kill())

  // 分层升华效果 - 自下而上 stagger
  scrollTl
    // 底部先升华
    .to(layerBottomRef.value, {
      y: -80,
      opacity: 0,
      filter: 'blur(3px)',
      ease: 'none',
      duration: 1
    }, 0)
    // 中部紧随
    .to(layerMidRef.value, {
      y: -60,
      opacity: 0,
      filter: 'blur(2px)',
      ease: 'none',
      duration: 1
    }, 0.05)
    // 顶部最后散逸
    .to(layerTopRef.value, {
      y: -40,
      opacity: 0,
      filter: 'blur(1px)',
      ease: 'none',
      duration: 1
    }, 0.1)
    // 光晕变化
    .to(haloRef.value, {
      opacity: 0.4,
      duration: 0.5,
      ease: 'none'
    }, 0)
    .to(haloRef.value, {
      opacity: 0,
      duration: 0.5,
      ease: 'none'
    }, 0.5)

  // 粒子升华效果
  const createParticleAnimation = (progress: number) => {
    const particleCount = Math.floor(progress * 40)

    particleRefs.forEach((particle, i) => {
      if (particle) {
        if (i < particleCount && progress > 0.1) {
          const randomX = (Math.random() - 0.5) * 60
          const randomY = -(Math.random() * 150 + 50)
          const randomRotate = Math.random() * 360

          gsap.to(particle, {
            opacity: 0.8,
            scale: 1,
            y: randomY,
            x: randomX,
            rotation: randomRotate,
            duration: 1.5,
            ease: 'power1.out'
          })
        } else {
          gsap.to(particle, {
            opacity: 0,
            scale: 0,
            duration: 0.3
          })
        }
      }
    })
  }

  // 滚动时更新粒子
  ScrollTrigger.create({
    trigger: containerRef.value,
    start: 'top top',
    end: 'bottom top',
    scrub: true,
    onUpdate: (self) => {
      if (self.progress > 0.1 && self.progress < 0.9) {
        createParticleAnimation(self.progress)
      } else if (self.progress <= 0.1) {
        particleRefs.forEach(particle => {
          if (particle) {
            gsap.set(particle, { opacity: 0, scale: 0 })
          }
        })
      }
    }
  })

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
.vapor-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(180deg, #1a0a2e 0%, #16213e 50%, #0f3460 100%);
}

// 背景
.vapor-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;

  .bg-sun {
    position: absolute;
    bottom: -20%;
    left: 50%;
    transform: translateX(-50%);
    width: 80vw;
    height: 80vw;
    background: radial-gradient(
      circle,
      rgba(255, 215, 0, 0.3) 0%,
      rgba(255, 183, 77, 0.2) 30%,
      rgba(255, 236, 179, 0.1) 50%,
      transparent 70%
    );
    border-radius: 50%;
    filter: blur(60px);
  }

  .bg-rays {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 150%;
    height: 150%;
    transform: translate(-50%, -50%);
    pointer-events: none;

    .sun-ray {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 2px;
      height: 100%;
      transform-origin: center top;
      background: linear-gradient(
        to bottom,
        rgba(255, 215, 0, 0.15) 0%,
        transparent 60%
      );
      animation: ray-pulse 4s ease-in-out infinite;
    }
  }
}

@keyframes ray-pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
}

// 升华粒子
.vapor-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 15;

  .vapor-particle {
    position: absolute;
    border-radius: 50%;
    filter: blur(1px);
  }
}

// 主卡片
.vapor-card {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(88vw, 900px);
  height: min(80vh, 600px);
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, rgba(26, 10, 46, 0.9) 0%, rgba(22, 33, 62, 0.85) 100%);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 24px;
  overflow: hidden;
  backdrop-filter: blur(20px);
  box-shadow:
    0 25px 80px rgba(0, 0, 0, 0.5),
    0 0 100px rgba(255, 215, 0, 0.1);
}

// 金色光晕
.card-halo {
  position: absolute;
  inset: -20px;
  background: radial-gradient(
    ellipse at center,
    rgba(255, 215, 0, 0.15) 0%,
    rgba(255, 183, 77, 0.08) 40%,
    transparent 70%
  );
  pointer-events: none;
  z-index: 0;
  opacity: 0;
}

// 三层分区
.card-layer {
  position: relative;
  z-index: 1;
}

.layer-top {
  flex: 0.3;
  padding: 35px 40px 15px;
  display: flex;
  align-items: center;
}

.layer-mid {
  flex: 0.5;
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.layer-bottom {
  flex: 0.5;
  padding: 15px 40px 35px;
}

.layer-content {
  width: 100%;
}

.content-tag {
  display: inline-block;
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.25em;
  color: #ffd700;
  background: rgba(255, 215, 0, 0.12);
  border: 1px solid rgba(255, 215, 0, 0.25);
  padding: 8px 16px;
  margin-bottom: 16px;
  text-transform: uppercase;
}

.content-title {
  font-family: 'Playfair Display', 'Georgia', serif;
  font-size: clamp(2.2rem, 5vw, 3.5rem);
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  line-height: 1.1;
  letter-spacing: -0.02em;
  text-shadow: 0 4px 30px rgba(255, 215, 0, 0.3);
}

.image-container {
  position: relative;
  width: 100%;
  height: 280px;
  border-radius: 16px;
  overflow: hidden;

  .card-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(1.05) saturate(1.15);
  }

  .image-glow {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      transparent 60%,
      rgba(255, 215, 0, 0.15) 100%
    );
    pointer-events: none;
  }
}

.content-subtitle {
  font-family: 'Playfair Display', 'Georgia', serif;
  font-size: 1.15rem;
  font-style: italic;
  color: rgba(255, 215, 0, 0.9);
  margin: 0 0 12px 0;
  font-weight: 400;
  letter-spacing: 0.02em;
}

.content-description {
  font-family: 'Inter', -apple-system, sans-serif;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 24px 0;
  line-height: 1.7;
  font-weight: 300;
}

.content-action {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  color: #1a0a2e;
  cursor: pointer;
  padding: 14px 28px;
  background: linear-gradient(135deg, #ffd700 0%, #ffb347 100%);
  border-radius: 50px;
  box-shadow:
    0 8px 30px rgba(255, 215, 0, 0.4),
    0 0 0 2px rgba(255, 255, 255, 0.2) inset;
  transition: all 0.3s ease;

  .action-icon {
    width: 18px;
    height: 18px;
    transition: transform 0.3s ease;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow:
      0 12px 40px rgba(255, 215, 0, 0.5),
      0 0 0 2px rgba(255, 255, 255, 0.3) inset;

    .action-icon {
      transform: translateY(-3px);
    }
  }
}

// 装饰元素
.vapor-decorations {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 5;

  .corner-accent {
    position: absolute;
    width: 50px;
    height: 50px;

    &::before,
    &::after {
      content: '';
      position: absolute;
      background: linear-gradient(135deg, rgba(255, 215, 0, 0.6), rgba(255, 183, 77, 0.4));
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
      top: 25px;
      left: 25px;
      &::before { top: 0; left: 0; }
      &::after { top: 0; left: 0; }
    }

    &.top-right {
      top: 25px;
      right: 25px;
      &::before { top: 0; right: 0; }
      &::after { top: 0; right: 0; }
    }

    &.bottom-left {
      bottom: 25px;
      left: 25px;
      &::before { bottom: 0; left: 0; }
      &::after { bottom: 0; left: 0; }
    }

    &.bottom-right {
      bottom: 25px;
      right: 25px;
      &::before { bottom: 0; right: 0; }
      &::after { bottom: 0; right: 0; }
    }
  }
}

// 进度指示
.vapor-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(255, 255, 255, 0.05);
  z-index: 20;

  .progress-fill {
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, #ffd700 0%, #ffb347 50%, #ff6b6b 100%);
    transform-origin: left center;
    transform: scaleX(0);
  }
}

// 响应式
@media (max-width: 768px) {
  .vapor-card {
    width: 92vw;
    height: auto;
    min-height: 85vh;
  }

  .layer-top {
    padding: 25px 25px 10px;
  }

  .layer-mid {
    padding: 0 25px;
  }

  .layer-bottom {
    padding: 10px 25px 25px;
  }

  .content-title {
    font-size: clamp(1.8rem, 7vw, 2.5rem);
  }

  .image-container {
    height: 200px;
  }
}
</style>
