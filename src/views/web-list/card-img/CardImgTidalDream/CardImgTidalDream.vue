<template>
  <div class="tidal-dream" ref="parentRef">
    <!-- 深邃海底背景层 -->
    <div class="tidal-bg" ref="bgRef">
      <!-- 多层深海渐变 -->
      <div class="deep-layers"></div>
      <!-- 远景发光生物 -->
      <div class="bioluminescence-field" ref="bioRef"></div>
      <!-- 水波折射层 -->
      <div class="caustics-layer" ref="causticsRef"></div>
    </div>

    <!-- 气泡粒子群 -->
    <div class="tidal-bubbles" ref="bubblesRef"></div>

    <!-- 漂浮发光粒子 -->
    <div class="tidal-particles" ref="particlesRef"></div>

    <!-- 主图容器 -->
    <div class="tidal-container" ref="containerRef">
      <!-- 外层光环 -->
      <div class="outer-glow-ring"></div>
      <div class="outer-glow-ring ring-2"></div>

      <!-- 图片容器 -->
      <div class="tidal-image" ref="imageRef">
        <img :src="imageUrl" alt="Deep Sea Treasure" />
        <!-- 内层光线 -->
        <div class="inner-light-rays"></div>
        <!-- 水下散射层 -->
        <div class="underwater-scatter"></div>
      </div>

      <!-- 脉冲光晕 -->
      <div class="pulse-halo"></div>

      <!-- 暗角遮罩 -->
      <div class="tidal-vignette" ref="vignetteRef"></div>

      <!-- 边框装饰 -->
      <div class="frame-corners">
        <div class="corner corner-tl"></div>
        <div class="corner corner-tr"></div>
        <div class="corner corner-bl"></div>
        <div class="corner corner-br"></div>
      </div>
    </div>

    <!-- 水波涟漪 -->
    <div class="water-ripples" ref="ripplesRef"></div>

    <!-- 标题 -->
    <div class="tidal-title" ref="titleRef">
      <span class="title-cn">潮汐入梦</span>
      <span class="title-en">TIDAL DREAM</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface TweenCleanup {
  revert: () => void
}

const imageUrl = 'https://images.unsplash.com/photo-1551244072-5d12893278ab?w=1200&q=80'

const parentRef = ref<HTMLElement | null>(null)
const bgRef = ref<HTMLElement | null>(null)
const bioRef = ref<HTMLElement | null>(null)
const causticsRef = ref<HTMLElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const imageRef = ref<HTMLElement | null>(null)
const vignetteRef = ref<HTMLElement | null>(null)
const bubblesRef = ref<HTMLElement | null>(null)
const particlesRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const ripplesRef = ref<HTMLElement | null>(null)

const cleanupFns: TweenCleanup[] = []

onMounted(() => {
  if (!parentRef.value || !containerRef.value || !imageRef.value) return

  const ctx = gsap.context(() => {
    // 初始化状态 - 入场前隐藏
    gsap.set([containerRef.value, titleRef.value], {
      opacity: 0,
      scale: 0.85,
    })
    gsap.set('.outer-glow-ring', {
      scale: 0.8,
      opacity: 0,
    })
    gsap.set('.pulse-halo', {
      scale: 0.6,
      opacity: 0,
    })

    // 入场动画
    const entryTl = gsap.timeline({
      scrollTrigger: {
        trigger: parentRef.value,
        start: 'top 80%',
        end: 'top 20%',
        toggleActions: 'play none none reverse',
      },
    })

    // 光环旋转入场
    entryTl.to('.outer-glow-ring', {
      scale: 1,
      opacity: 1,
      duration: 1.2,
      stagger: 0.15,
      ease: 'power2.out',
    }, 0)

    // 主图缩放入场
    entryTl.to(containerRef.value, {
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: 'back.out(1.7)',
    }, 0.2)

    // 脉冲光晕入场
    entryTl.to('.pulse-halo', {
      scale: 1,
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out',
    }, 0.5)

    // 标题淡入上移
    entryTl.to(titleRef.value, {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: 'power2.out',
    }, 0.4)

    // 创建发光生物粒子
    if (bioRef.value) {
      for (let i = 0; i < 15; i++) {
        const glow = document.createElement('div')
        glow.className = 'bioluminescent-glow'
        glow.style.cssText = `
          left: ${Math.random() * 100}%;
          top: ${20 + Math.random() * 60}%;
          width: ${3 + Math.random() * 5}px;
          height: ${3 + Math.random() * 5}px;
          animation-duration: ${4 + Math.random() * 6}s;
          animation-delay: ${Math.random() * 4}s;
        `
        bioRef.value.appendChild(glow)
      }
    }

    // 创建增强气泡粒子
    if (bubblesRef.value) {
      for (let i = 0; i < 30; i++) {
        const bubble = document.createElement('div')
        bubble.className = 'tidal-bubble'
        bubble.style.cssText = `
          left: ${5 + Math.random() * 90}%;
          width: ${3 + Math.random() * 6}px;
          height: ${3 + Math.random() * 6}px;
          animation-duration: ${10 + Math.random() * 12}s;
          animation-delay: ${Math.random() * 8}s;
        `
        bubblesRef.value.appendChild(bubble)
      }
    }

    // 创建漂浮发光粒子
    if (particlesRef.value) {
      for (let i = 0; i < 40; i++) {
        const particle = document.createElement('div')
        particle.className = 'floating-particle'
        particle.style.cssText = `
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          width: ${1 + Math.random() * 3}px;
          height: ${1 + Math.random() * 3}px;
          animation-duration: ${8 + Math.random() * 15}s;
          animation-delay: ${Math.random() * 10}s;
        `
        particlesRef.value.appendChild(particle)
      }
    }

    // 创建水波涟漪
    if (ripplesRef.value) {
      for (let i = 0; i < 5; i++) {
        const ripple = document.createElement('div')
        ripple.className = 'water-ripple'
        ripple.style.cssText = `
          left: ${10 + Math.random() * 80}%;
          top: ${10 + Math.random() * 80}%;
          animation-duration: ${6 + Math.random() * 4}s;
          animation-delay: ${i * 2}s;
        `
        ripplesRef.value.appendChild(ripple)
      }
    }

    // 循环呼吸动画 - 独立于 ScrollTrigger
    // 主容器缩放呼吸
    const scaleTl = gsap.timeline({ repeat: -1, yoyo: true })
    scaleTl.to(containerRef.value, {
      scale: 1.03,
      duration: 6,
      ease: 'power1.inOut',
    })

    // 光环反向缩放
    const ringTl = gsap.timeline({ repeat: -1, yoyo: true })
    ringTl.to('.outer-glow-ring', {
      scale: 0.95,
      duration: 6,
      ease: 'power1.inOut',
    })
    ringTl.to('.outer-glow-ring.ring-2', {
      scale: 1.08,
      duration: 6,
      ease: 'power1.inOut',
    }, '<')

    // 脉冲光晕呼吸
    const haloTl = gsap.timeline({ repeat: -1, yoyo: true })
    haloTl.to('.pulse-halo', {
      scale: 1.15,
      opacity: 0.4,
      duration: 3,
      ease: 'power2.inOut',
    })

    // 位移漂移
    const driftTl = gsap.timeline({ repeat: -1, yoyo: true })
    driftTl.to(containerRef.value, {
      x: 4,
      y: 3,
      duration: 8,
      ease: 'sine.inOut',
    })

    // 亮度联动
    const brightnessTl = gsap.timeline({ repeat: -1, yoyo: true })
    brightnessTl.to(imageRef.value, {
      filter: 'brightness(1.1) saturate(1.1)',
      duration: 4.8,
      ease: 'sine.inOut',
    })

    // 暗角涨落
    const vignetteTl = gsap.timeline({ repeat: -1, yoyo: true })
    vignetteTl.to(vignetteRef.value, {
      opacity: 0.8,
      duration: 4.8,
      ease: 'sine.inOut',
    })

    // 水下散射波动
    const scatterTl = gsap.timeline({ repeat: -1, yoyo: true })
    scatterTl.to('.underwater-scatter', {
      opacity: 0.3,
      duration: 5,
      ease: 'sine.inOut',
    })

    // 焦散动画
    const causticsTl = gsap.timeline({ repeat: -1 })
    causticsTl.to(causticsRef.value, {
      backgroundPosition: '200% 200%',
      duration: 15,
      ease: 'none',
    })

    cleanupFns.push(
      { revert: () => entryTl.kill() },
      { revert: () => scaleTl.kill() },
      { revert: () => ringTl.kill() },
      { revert: () => haloTl.kill() },
      { revert: () => driftTl.kill() },
      { revert: () => brightnessTl.kill() },
      { revert: () => vignetteTl.kill() },
      { revert: () => scatterTl.kill() },
      { revert: () => causticsTl.kill() },
    )
  }, parentRef.value)
})

onUnmounted(() => {
  cleanupFns.forEach((fn) => fn.revert())
  ScrollTrigger.getAll().forEach((st) => st.kill())
})
</script>

<style lang="scss" scoped>
.tidal-dream {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(
    180deg,
    #030d1a 0%,
    #061425 20%,
    #0a2845 40%,
    #0d3055 60%,
    #082540 80%,
    #051525 100%
  );
}

.tidal-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.deep-layers {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 120% 80% at 50% -10%, rgba(30, 120, 180, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse 80% 60% at 20% 90%, rgba(10, 80, 140, 0.2) 0%, transparent 40%),
    radial-gradient(ellipse 60% 50% at 80% 70%, rgba(20, 100, 160, 0.12) 0%, transparent 35%),
    radial-gradient(ellipse 100% 100% at 50% 100%, rgba(5, 30, 60, 0.8) 0%, transparent 60%);
}

.caustics-layer {
  position: absolute;
  inset: -50%;
  background:
    radial-gradient(ellipse 30% 20% at 30% 30%, rgba(100, 200, 255, 0.08) 0%, transparent 70%),
    radial-gradient(ellipse 25% 15% at 70% 50%, rgba(80, 180, 255, 0.06) 0%, transparent 60%),
    radial-gradient(ellipse 35% 25% at 50% 70%, rgba(120, 220, 255, 0.07) 0%, transparent 65%);
  animation: causticsWave 20s ease-in-out infinite;
  opacity: 0.7;
}

@keyframes causticsWave {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(3%, 2%) rotate(1deg);
  }
  50% {
    transform: translate(-2%, 4%) rotate(-1deg);
  }
  75% {
    transform: translate(4%, -3%) rotate(2deg);
  }
}

.bioluminescence-field {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.bioluminescent-glow {
  position: absolute;
  background: radial-gradient(circle, rgba(100, 255, 255, 0.9) 0%, rgba(50, 200, 255, 0.4) 40%, transparent 70%);
  border-radius: 50%;
  filter: blur(1px);
  animation: bioGlowPulse ease-in-out infinite;
}

@keyframes bioGlowPulse {
  0%, 100% {
    opacity: 0.2;
    transform: scale(0.8);
    box-shadow: 0 0 5px rgba(100, 255, 255, 0.3);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.2);
    box-shadow: 0 0 15px rgba(100, 255, 255, 0.6), 0 0 30px rgba(100, 255, 255, 0.3);
  }
}

.tidal-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  will-change: transform, opacity;
}

.outer-glow-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 110%;
  height: 110%;
  transform: translate(-50%, -50%);
  border-radius: 20px;
  border: 1px solid rgba(80, 180, 255, 0.2);
  box-shadow:
    0 0 30px rgba(80, 180, 255, 0.15),
    inset 0 0 30px rgba(80, 180, 255, 0.1);
  animation: ringRotate 30s linear infinite;
  will-change: transform, opacity;

  &.ring-2 {
    width: 120%;
    height: 120%;
    border-color: rgba(60, 150, 220, 0.12);
    animation: ringRotateReverse 40s linear infinite;
  }
}

@keyframes ringRotate {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

@keyframes ringRotateReverse {
  from { transform: translate(-50%, -50%) rotate(360deg); }
  to { transform: translate(-50%, -50%) rotate(0deg); }
}

.tidal-image {
  position: relative;
  width: 65vw;
  max-width: 900px;
  aspect-ratio: 16 / 10;
  border-radius: 12px;
  overflow: hidden;
  box-shadow:
    0 25px 80px rgba(0, 0, 0, 0.7),
    0 50px 120px rgba(0, 30, 60, 0.5),
    inset 0 0 80px rgba(0, 60, 120, 0.25);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: saturate(0.9) contrast(1.05);
  }
}

.inner-light-rays {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(100, 200, 255, 0.1) 0%, transparent 35%),
    radial-gradient(ellipse 80% 40% at 50% -10%, rgba(150, 230, 255, 0.12) 0%, transparent 60%);
  pointer-events: none;
  animation: lightWave 8s ease-in-out infinite;
}

@keyframes lightWave {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 0.9; }
}

.underwater-scatter {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 100% 100% at 30% 70%, rgba(100, 180, 255, 0.05) 0%, transparent 50%);
  pointer-events: none;
  animation: scatterShimmer 10s ease-in-out infinite;
}

@keyframes scatterShimmer {
  0%, 100% {
    opacity: 0.1;
    transform: translateX(0);
  }
  50% {
    opacity: 0.25;
    transform: translateX(10px);
  }
}

.pulse-halo {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  transform: translate(-50%, -50%);
  border-radius: 20px;
  background: radial-gradient(ellipse at center, rgba(80, 180, 255, 0.15) 0%, transparent 70%);
  pointer-events: none;
  animation: haloPulse 3s ease-in-out infinite;
  will-change: transform, opacity;
}

@keyframes haloPulse {
  0%, 100% {
    opacity: 0.6;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.05);
  }
}

.tidal-vignette {
  position: absolute;
  inset: 0;
  border-radius: 12px;
  background: radial-gradient(ellipse at center, transparent 30%, rgba(0, 15, 40, 0.75) 100%);
  pointer-events: none;
  will-change: opacity;
}

.frame-corners {
  position: absolute;
  inset: -8px;
  pointer-events: none;
}

.corner {
  position: absolute;
  width: 24px;
  height: 24px;
  border-color: rgba(100, 200, 255, 0.4);
  border-style: solid;

  &.corner-tl {
    top: 0;
    left: 0;
    border-width: 2px 0 0 2px;
  }

  &.corner-tr {
    top: 0;
    right: 0;
    border-width: 2px 2px 0 0;
  }

  &.corner-bl {
    bottom: 0;
    left: 0;
    border-width: 0 0 2px 2px;
  }

  &.corner-br {
    bottom: 0;
    right: 0;
    border-width: 0 2px 2px 0;
  }
}

.tidal-bubbles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.tidal-bubble {
  position: absolute;
  bottom: -15px;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.5), rgba(100, 200, 255, 0.25));
  border-radius: 50%;
  animation: bubbleRise linear infinite;
  filter: blur(0.5px);
}

@keyframes bubbleRise {
  0% {
    transform: translateY(0) translateX(0) scale(1);
    opacity: 0;
  }
  10% {
    opacity: 0.7;
    transform: translateY(-10vh) translateX(5px) scale(1.1);
  }
  50% {
    transform: translateY(-50vh) translateX(-10px) scale(1);
  }
  90% {
    opacity: 0.5;
    transform: translateY(-95vh) translateX(15px) scale(0.9);
  }
  100% {
    transform: translateY(-105vh) translateX(5px);
    opacity: 0;
  }
}

.tidal-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.floating-particle {
  position: absolute;
  background: radial-gradient(circle, rgba(150, 230, 255, 0.8) 0%, rgba(100, 200, 255, 0.3) 50%, transparent 70%);
  border-radius: 50%;
  animation: particleFloat ease-in-out infinite;
  filter: blur(0.3px);
}

@keyframes particleFloat {
  0%, 100% {
    opacity: 0.1;
    transform: translate(0, 0);
  }
  25% {
    opacity: 0.6;
    transform: translate(15px, -20px);
  }
  50% {
    opacity: 0.3;
    transform: translate(-10px, -40px);
  }
  75% {
    opacity: 0.7;
    transform: translate(20px, -25px);
  }
}

.water-ripples {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.water-ripple {
  position: absolute;
  width: 100px;
  height: 100px;
  border: 1px solid rgba(100, 200, 255, 0.15);
  border-radius: 50%;
  animation: rippleExpand ease-out infinite;
}

@keyframes rippleExpand {
  0% {
    transform: scale(0.3);
    opacity: 0.6;
  }
  100% {
    transform: scale(3);
    opacity: 0;
  }
}

.tidal-title {
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 10;
  will-change: transform, opacity;

  .title-cn {
    display: block;
    font-size: 28px;
    font-weight: 600;
    color: #fff;
    letter-spacing: 8px;
    text-shadow:
      0 0 20px rgba(64, 164, 223, 0.6),
      0 0 40px rgba(64, 164, 223, 0.3);
    margin-bottom: 8px;
  }

  .title-en {
    display: block;
    font-size: 12px;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.55);
    letter-spacing: 6px;
    text-transform: uppercase;
  }
}
</style>
