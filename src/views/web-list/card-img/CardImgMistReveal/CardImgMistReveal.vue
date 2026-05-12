<template>
  <div ref="containerRef" class="mist-reveal-container">
    <!-- 背景图片 -->
    <div ref="imageWrapperRef" class="image-wrapper">
      <img
        ref="mainImageRef"
        class="main-image"
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
        alt="Mountain"
      />
    </div>

    <!-- 雾气层 - 多层叠加 -->
    <div ref="mistLayer1Ref" class="mist-layer mist-layer-1" />
    <div ref="mistLayer2Ref" class="mist-layer mist-layer-2" />
    <div ref="mistLayer3Ref" class="mist-layer mist-layer-3" />

    <!-- 中心光柱 -->
    <div ref="lightCoreRef" class="light-core" />
    <div ref="lightGlowRef" class="light-glow" />

    <!-- 雾滴粒子容器 -->
    <div ref="particlesContainerRef" class="particles-container" />

    <!-- 四角残留雾丝 -->
    <div ref="cornerMistRef" class="corner-mist corner-tl" />
    <div ref="cornerMistTrRef" class="corner-mist corner-tr" />
    <div ref="cornerMistBlRef" class="corner-mist corner-bl" />
    <div ref="cornerMistBrRef" class="corner-mist corner-br" />

    <!-- 内容区域 -->
    <div ref="contentRef" class="reveal-content">
      <div class="content-inner">
        <h2 ref="subtitleRef" class="reveal-subtitle">光透雾散</h2>
        <h1 ref="titleRef" class="reveal-title">
          <span class="title-line">迷雾</span>
          <span class="title-line">驱散</span>
        </h1>
        <p ref="descRef" class="reveal-desc">
          一束日光穿透浓雾<br />
          万物渐次显现
        </p>
      </div>
    </div>

    <!-- 底部进度指示 -->
    <div ref="progressRef" class="reveal-progress">
      <div class="progress-track">
        <div ref="progressFillRef" class="progress-fill" />
      </div>
      <span class="progress-label">SCROLL TO REVEAL</span>
    </div>

    <!-- 角落装饰 -->
    <svg ref="cornerSvgRef" class="corner-svg corner-bl" viewBox="0 0 80 80">
      <circle cx="0" cy="0" r="3" fill="currentColor" />
      <circle cx="0" cy="20" r="2" fill="currentColor" />
      <circle cx="0" cy="40" r="1.5" fill="currentColor" />
      <line x1="0" y1="0" x2="0" y2="50" stroke="currentColor" stroke-width="0.5" />
    </svg>
    <svg class="corner-svg corner-tr" viewBox="0 0 80 80">
      <circle cx="80" cy="0" r="3" fill="currentColor" />
      <circle cx="80" cy="20" r="2" fill="currentColor" />
      <line x1="80" y1="0" x2="80" y2="30" stroke="currentColor" stroke-width="0.5" />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface TweenCleanup {
  kill: () => void
}

const containerRef = ref<HTMLElement | null>(null)
const imageWrapperRef = ref<HTMLElement | null>(null)
const mainImageRef = ref<HTMLElement | null>(null)
const mistLayer1Ref = ref<HTMLElement | null>(null)
const mistLayer2Ref = ref<HTMLElement | null>(null)
const mistLayer3Ref = ref<HTMLElement | null>(null)
const lightCoreRef = ref<HTMLElement | null>(null)
const lightGlowRef = ref<HTMLElement | null>(null)
const particlesContainerRef = ref<HTMLElement | null>(null)
const cornerMistRef = ref<HTMLElement | null>(null)
const cornerMistTrRef = ref<HTMLElement | null>(null)
const cornerMistBlRef = ref<HTMLElement | null>(null)
const cornerMistBrRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const descRef = ref<HTMLElement | null>(null)
const progressRef = ref<HTMLElement | null>(null)
const progressFillRef = ref<HTMLElement | null>(null)
const cornerSvgRef = ref<SVGElement | null>(null)

const cleanupFns: TweenCleanup[] = []
let particleInterval: number | null = null
let particleCount = 0
const MAX_PARTICLES = 40

interface Particle {
  el: HTMLElement
  tl: gsap.core.Tween
}

const activeParticles: Particle[] = []

function createParticle() {
  if (!particlesContainerRef.value || particleCount >= MAX_PARTICLES) return

  const particle = document.createElement('div')
  particle.className = 'mist-particle'

  // 随机位置（从中心向边缘）
  const angle = Math.random() * Math.PI * 2
  const distance = 100 + Math.random() * 300
  const x = window.innerWidth / 2 + Math.cos(angle) * distance
  const y = window.innerHeight / 2 + Math.sin(angle) * distance

  particle.style.left = `${x}px`
  particle.style.top = `${y}px`

  // 随机大小
  const size = 20 + Math.random() * 60
  particle.style.width = `${size}px`
  particle.style.height = `${size}px`

  particlesContainerRef.value.appendChild(particle)
  particleCount++

  // 向外飘散并淡出
  const moveX = Math.cos(angle) * (100 + Math.random() * 150)
  const moveY = Math.sin(angle) * (100 + Math.random() * 150) - 50

  const tl = gsap.timeline({
    onComplete: () => {
      particle.remove()
      particleCount--
      const idx = activeParticles.findIndex(p => p.el === particle)
      if (idx > -1) activeParticles.splice(idx, 1)
    }
  })

  tl.to(particle, {
    x: moveX,
    y: moveY,
    opacity: 0,
    scale: 0.3,
    duration: 2 + Math.random() * 2,
    ease: 'power2.out'
  })

  activeParticles.push({ el: particle, tl })
}

function initScrollAnimation() {
  if (!containerRef.value) return

  const ctx = gsap.context(() => {
    // 初始状态 - 雾气全覆盖
    gsap.set(mistLayer1Ref.value, { opacity: 0.85, scale: 1 })
    gsap.set(mistLayer2Ref.value, { opacity: 0.75, scale: 1 })
    gsap.set(mistLayer3Ref.value, { opacity: 0.65, scale: 1 })
    gsap.set(lightCoreRef.value, { opacity: 0, scale: 0 })
    gsap.set(lightGlowRef.value, { opacity: 0, scale: 0 })
    gsap.set(imageWrapperRef.value, { filter: 'brightness(0.6)' })

    // 主滚动动画
    const mainTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.value,
        start: 'top 100%',
        end: 'center center',
        scrub: 1.5
      }
    })

    // 光柱扩张
    mainTl
      .to(lightCoreRef.value, {
        opacity: 0.6,
        scale: 4,
        duration: 1,
        ease: 'power2.inOut'
      }, 0)
      .to(lightGlowRef.value, {
        opacity: 0.4,
        scale: 5,
        duration: 1,
        ease: 'power2.inOut'
      }, 0)

    // 雾气驱散 - 从内到外
    mainTl
      .to(mistLayer3Ref.value, {
        opacity: 0,
        scale: 1.5,
        duration: 1,
        ease: 'power2.inOut'
      }, 0.1)
      .to(mistLayer2Ref.value, {
        opacity: 0.15,
        scale: 1.3,
        duration: 1,
        ease: 'power2.inOut'
      }, 0.2)
      .to(mistLayer1Ref.value, {
        opacity: 0.25,
        scale: 1.2,
        duration: 1,
        ease: 'power2.inOut'
      }, 0.3)

    // 图片亮度恢复
    mainTl.to(imageWrapperRef.value, {
      filter: 'brightness(1)',
      duration: 1,
      ease: 'power2.inOut'
    }, 0)

    cleanupFns.push({ kill: () => mainTl.kill() })

    // 四角雾丝 - 低频呼吸（完成后显示）
    const cornerMistEls = [
      cornerMistRef.value,
      cornerMistTrRef.value,
      cornerMistBlRef.value,
      cornerMistBrRef.value
    ].filter(Boolean)

    cornerMistEls.forEach((el, i) => {
      if (!el) return

      // 入场时显示雾丝
      gsap.set(el, { opacity: 0 })

      const cornerTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.value,
          start: 'center center',
          end: 'bottom bottom',
          scrub: 1
        }
      })

      cornerTl.to(el, {
        opacity: 0.3 + Math.random() * 0.2,
        duration: 1,
        ease: 'power2.out'
      })

      // 呼吸动画
      gsap.to(el, {
        opacity: 0.15 + Math.random() * 0.15,
        duration: 3 + i * 0.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: i * 0.7
      })

      cleanupFns.push({ kill: () => cornerTl.kill() })
    })

    // 内容入场
    const contentTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.value,
        start: 'center center',
        toggleActions: 'play none none reverse'
      }
    })

    contentTl
      .fromTo(subtitleRef.value,
        { opacity: 0, y: 40, letterSpacing: '0.8em' },
        { opacity: 1, y: 0, letterSpacing: '0.3em', duration: 1.2, ease: 'power2.out' }
      )
      .fromTo(titleRef.value,
        { opacity: 0, y: 60, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power2.out' },
        '-=0.6'
      )
      .fromTo(descRef.value,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        '-=0.4'
      )

    cleanupFns.push({ kill: () => contentTl.kill() })

    // 进度条
    ScrollTrigger.create({
      trigger: containerRef.value,
      start: 'top 100%',
      end: 'center center',
      scrub: 1,
      onUpdate: (self) => {
        if (progressFillRef.value) {
          progressFillRef.value.style.width = `${self.progress * 100}%`
        }
      }
    })

    // 内容视差
    const contentParallaxTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.value,
        start: 'top 100%',
        end: 'bottom 20%',
        scrub: 1.5
      }
    })

    contentParallaxTl
      .to(contentRef.value, { y: '-15%', duration: 1 }, 0)
      .to(imageWrapperRef.value, { y: '10%', duration: 1 }, 0)

    cleanupFns.push({ kill: () => contentParallaxTl.kill() })

    // 雾滴粒子效果
    particleInterval = window.setInterval(() => {
      if (particlesContainerRef.value) {
        createParticle()
      }
    }, 150)

  }, containerRef.value)

  cleanupFns.push({ kill: () => ctx.revert() })
}

function handleMouseMove(e: MouseEvent) {
  const x = e.clientX / window.innerWidth
  const y = e.clientY / window.innerHeight

  // 光柱跟随鼠标
  if (lightCoreRef.value) {
    gsap.to(lightCoreRef.value, {
      x: (x - 0.5) * 100,
      y: (y - 0.5) * 80,
      duration: 1.5,
      ease: 'power2.out'
    })
  }

  if (lightGlowRef.value) {
    gsap.to(lightGlowRef.value, {
      x: (x - 0.5) * 120,
      y: (y - 0.5) * 100,
      duration: 2,
      ease: 'power2.out'
    })
  }

  // 雾气轻微扰动
  if (mistLayer1Ref.value) {
    gsap.to(mistLayer1Ref.value, {
      x: (x - 0.5) * -20,
      y: (y - 0.5) * -15,
      duration: 2.5,
      ease: 'power2.out'
    })
  }
}

function handleMouseLeave() {
  if (lightCoreRef.value) {
    gsap.to(lightCoreRef.value, {
      x: 0,
      y: 0,
      duration: 2,
      ease: 'elastic.out(1, 0.5)'
    })
  }

  if (lightGlowRef.value) {
    gsap.to(lightGlowRef.value, {
      x: 0,
      y: 0,
      duration: 2.5,
      ease: 'elastic.out(1, 0.5)'
    })
  }

  if (mistLayer1Ref.value) {
    gsap.to(mistLayer1Ref.value, {
      x: 0,
      y: 0,
      duration: 3,
      ease: 'elastic.out(1, 0.5)'
    })
  }
}

onMounted(() => {
  initScrollAnimation()

  if (containerRef.value) {
    containerRef.value.addEventListener('mousemove', handleMouseMove)
    containerRef.value.addEventListener('mouseleave', handleMouseLeave)
  }
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn.kill())

  // 清理粒子
  if (particleInterval) {
    clearInterval(particleInterval)
  }

  activeParticles.forEach(p => {
    p.tl.kill()
    p.el.remove()
  })

  if (containerRef.value) {
    containerRef.value.removeEventListener('mousemove', handleMouseMove)
    containerRef.value.removeEventListener('mouseleave', handleMouseLeave)
  }

  ScrollTrigger.getAll().forEach(st => {
    if (st.vars.trigger === containerRef.value) {
      st.kill()
    }
  })
})
</script>

<style scoped lang="scss">
.mist-reveal-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    #2a3a4a 0%,
    #3d4d5d 25%,
    #4a5a6a 50%,
    #3d4d5d 75%,
    #2a3a4a 100%
  );
  cursor: crosshair;
}

// 图片包装
.image-wrapper {
  position: absolute;
  inset: 0;
  z-index: 1;

  .main-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.6) saturate(0.9);
  }
}

// 雾气层基础
.mist-layer {
  position: absolute;
  inset: -20%;
  z-index: 5;
  pointer-events: none;
  background: radial-gradient(
    ellipse 80% 80% at 50% 50%,
    rgba(220, 230, 240, 0.9) 0%,
    rgba(200, 215, 230, 0.85) 30%,
    rgba(180, 200, 220, 0.7) 60%,
    rgba(160, 185, 210, 0.5) 100%
  );
  filter: blur(20px);
}

.mist-layer-1 {
  z-index: 6;
  background: radial-gradient(
    ellipse 70% 70% at 45% 55%,
    rgba(230, 238, 245, 0.85) 0%,
    rgba(210, 225, 240, 0.75) 40%,
    rgba(190, 210, 230, 0.6) 70%,
    transparent 100%
  );
  filter: blur(15px);
}

.mist-layer-2 {
  z-index: 7;
  background: radial-gradient(
    ellipse 60% 60% at 55% 45%,
    rgba(240, 245, 250, 0.8) 0%,
    rgba(220, 232, 245, 0.65) 50%,
    transparent 100%
  );
  filter: blur(25px);
}

.mist-layer-3 {
  z-index: 8;
  background: radial-gradient(
    ellipse 50% 50% at 50% 50%,
    rgba(250, 253, 255, 0.75) 0%,
    rgba(235, 245, 252, 0.5) 40%,
    transparent 100%
  );
  filter: blur(30px);
}

// 光柱效果
.light-core {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px;
  height: 200px;
  transform: translate(-50%, -50%);
  z-index: 9;
  pointer-events: none;
  background: radial-gradient(
    circle,
    rgba(255, 255, 250, 0.9) 0%,
    rgba(255, 250, 240, 0.7) 20%,
    rgba(255, 245, 230, 0.4) 40%,
    rgba(255, 240, 220, 0.15) 60%,
    transparent 80%
  );
  border-radius: 50%;
  mix-blend-mode: soft-light;
  filter: blur(10px);
}

.light-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 300px;
  height: 300px;
  transform: translate(-50%, -50%);
  z-index: 4;
  pointer-events: none;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.3) 0%,
    rgba(255, 250, 240, 0.15) 40%,
    transparent 70%
  );
  border-radius: 50%;
  mix-blend-mode: screen;
  filter: blur(40px);
}

// 雾滴粒子
.particles-container {
  position: absolute;
  inset: 0;
  z-index: 15;
  pointer-events: none;
  overflow: hidden;
}

:global(.mist-particle) {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.8) 0%,
    rgba(230, 240, 250, 0.4) 50%,
    transparent 100%
  );
  filter: blur(8px);
  pointer-events: none;
}

// 四角残留雾丝
.corner-mist {
  position: absolute;
  width: 300px;
  height: 300px;
  z-index: 10;
  pointer-events: none;
  filter: blur(40px);

  &.corner-tl {
    top: -100px;
    left: -100px;
    background: radial-gradient(
      ellipse at 0% 0%,
      rgba(220, 235, 248, 0.5) 0%,
      transparent 70%
    );
  }

  &.corner-tr {
    top: -100px;
    right: -100px;
    background: radial-gradient(
      ellipse at 100% 0%,
      rgba(220, 235, 248, 0.5) 0%,
      transparent 70%
    );
  }

  &.corner-bl {
    bottom: -100px;
    left: -100px;
    background: radial-gradient(
      ellipse at 0% 100%,
      rgba(220, 235, 248, 0.5) 0%,
      transparent 70%
    );
  }

  &.corner-br {
    bottom: -100px;
    right: -100px;
    background: radial-gradient(
      ellipse at 100% 100%,
      rgba(220, 235, 248, 0.5) 0%,
      transparent 70%
    );
  }
}

// 内容区域
.reveal-content {
  position: absolute;
  inset: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.content-inner {
  text-align: center;
  padding: 2rem;
}

.reveal-subtitle {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(0.7rem, 1.2vw, 0.9rem);
  font-weight: 400;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 1.5rem 0;
}

.reveal-title {
  font-family: 'Noto Serif SC', 'STSong', Georgia, serif;
  font-size: clamp(3.5rem, 10vw, 7rem);
  font-weight: 200;
  line-height: 1.1;
  color: rgba(255, 255, 255, 0.95);
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.15em;
  text-shadow:
    0 4px 30px rgba(0, 0, 0, 0.3),
    0 0 60px rgba(255, 255, 255, 0.15);

  .title-line {
    display: block;
  }
}

.reveal-desc {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(1rem, 2vw, 1.3rem);
  font-weight: 400;
  line-height: 2;
  color: rgba(255, 255, 255, 0.65);
  margin: 2rem 0 0 0;
  letter-spacing: 0.08em;
}

// 进度指示
.reveal-progress {
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 25;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;

  .progress-track {
    width: 120px;
    height: 2px;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 1px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    width: 0%;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.8));
    border-radius: 1px;
    transition: width 0.1s linear;
  }

  .progress-label {
    font-family: 'Courier New', monospace;
    font-size: 0.6rem;
    letter-spacing: 0.3em;
    color: rgba(255, 255, 255, 0.4);
    text-transform: uppercase;
  }
}

// 角落装饰
.corner-svg {
  position: absolute;
  width: 50px;
  height: 50px;
  color: rgba(255, 255, 255, 0.2);
  z-index: 25;

  &.corner-bl {
    bottom: 30px;
    left: 30px;
  }

  &.corner-tr {
    top: 30px;
    right: 30px;
  }
}
</style>
