<template>
  <section class="lens-section">
    <!-- 背景效果 -->
    <div class="lens-bg">
      <div class="bg-nebula"></div>
      <div class="bg-stars"></div>
      <div class="bg-grid"></div>
    </div>

    <!-- 引力透镜效果 -->
    <div class="lens-container" ref="lensContainerRef">
      <!-- 引力场指示器 -->
      <div class="gravity-field" ref="gravityFieldRef"></div>

      <!-- 卡片组 -->
      <div
        v-for="(card, index) in cards"
        :key="index"
        class="lens-card"
        :ref="el => { if(el) cardRefs[index] = el as HTMLElement }"
        :style="{ '--i': index, '--hue': card.hue }"
      >
        <div class="card-glow"></div>
        <div class="card-inner">
          <div class="card-icon">{{ card.icon }}</div>
          <div class="card-title">{{ card.title }}</div>
          <div class="card-desc">{{ card.desc }}</div>
          <div class="card-energy">
            <span class="energy-bar"></span>
            <span class="energy-bar"></span>
            <span class="energy-bar"></span>
            <span class="energy-bar"></span>
          </div>
        </div>
        <div class="card-orbit"></div>
      </div>
    </div>

    <!-- 底部信息 -->
    <div class="lens-footer" ref="lensFooterRef">
      <div class="footer-line"></div>
      <p class="footer-text">将鼠标移入引力场</p>
      <p class="footer-hint">时空扭曲 · 引力透镜效应</p>
    </div>

    <!-- 鼠标追踪粒子 -->
    <div class="mouse-tracer" ref="mouseTracerRef"></div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Card {
  icon: string
  title: string
  desc: string
  hue: number
}

const cards: Card[] = [
  { icon: '🕳️', title: '黑洞', desc: '时空奇点', hue: 280 },
  { icon: '⭐', title: '中子星', desc: '致密天体', hue: 220 },
  { icon: '💥', title: '超新星', desc: '恒星爆发', hue: 0 },
  { icon: '🌑', title: '暗物质', desc: '隐形质量', hue: 260 },
  { icon: '🌊', title: '引力波', desc: '时空涟漪', hue: 190 },
  { icon: '⏱️', title: '时空', desc: '时空连续', hue: 30 },
]

// Refs
const lensContainerRef = ref<HTMLElement | null>(null)
const gravityFieldRef = ref<HTMLElement | null>(null)
const lensFooterRef = ref<HTMLElement | null>(null)
const mouseTracerRef = ref<HTMLElement | null>(null)
const cardRefs = ref<HTMLElement[]>([])

// 动画状态
let quickX: gsap.QuickToFunc[] = []
let quickY: gsap.QuickToFunc[] = []
let quickScale: gsap.QuickToFunc[] = []
let quickRotateY: gsap.QuickToFunc[] = []
let quickRotateX: gsap.QuickToFunc[] = []
let cardOrigins: { x: number; y: number; width: number; height: number }[] = []

let mouseX = -1000
let mouseY = -1000
let isActive = false
let animationFrameId: number | null = null

// 清理函数
const cleanupFns: (() => void)[] = []

// 更新卡片原始位置
function updateOrigins() {
  if (!lensContainerRef.value) return
  const containerRect = lensContainerRef.value.getBoundingClientRect()
  cardOrigins = cardRefs.value.map(card => {
    const rect = card.getBoundingClientRect()
    return {
      x: rect.left - containerRect.left + rect.width / 2,
      y: rect.top - containerRect.top + rect.height / 2,
      width: rect.width,
      height: rect.height
    }
  })
}

// 引力透镜动画核心
function animateLens() {
  if (!isActive || !lensContainerRef.value) return

  const maxDist = Math.max(
    lensContainerRef.value.clientWidth,
    lensContainerRef.value.clientHeight
  ) * 0.7
  const gravitationalConstant = 0.7

  cardRefs.value.forEach((card, i) => {
    if (!cardOrigins[i]) return
    const origin = cardOrigins[i]
    const dx = mouseX - origin.x
    const dy = mouseY - origin.y
    const dist = Math.sqrt(dx * dx + dy * dy)

    const pullFactor = Math.max(0, 1 - dist / maxDist)
    const pullStrength = pullFactor * gravitationalConstant * 1.8

    const moveX = dx * pullStrength * 0.4
    const moveY = dy * pullStrength * 0.4
    const scale = 1 + pullStrength * 0.35
    const rotateY = (dx / origin.width) * 8 * pullFactor
    const rotateX = -(dy / origin.height) * 8 * pullFactor

    if (quickX[i]) quickX[i](moveX)
    if (quickY[i]) quickY[i](moveY)
    if (quickScale[i]) quickScale[i](scale)
    if (quickRotateY[i]) quickRotateY[i](rotateY)
    if (quickRotateX[i]) quickRotateX[i](rotateX)
  })

  // 更新引力场位置
  if (gravityFieldRef.value) {
    gravityFieldRef.value.style.left = `${mouseX}px`
    gravityFieldRef.value.style.top = `${mouseY}px`
    gravityFieldRef.value.style.opacity = `${Math.min(0.8, 0.3 + 0.5 * (mouseX > 0 ? 1 : 0))}`
  }

  animationFrameId = requestAnimationFrame(animateLens)
}

// 鼠标追踪粒子效果
function updateTracer(e: MouseEvent) {
  if (!mouseTracerRef.value || !lensContainerRef.value) return
  const rect = lensContainerRef.value.getBoundingClientRect()
  mouseTracerRef.value.style.left = `${e.clientX - rect.left}px`
  mouseTracerRef.value.style.top = `${e.clientY - rect.top}px`
}

onMounted(() => {
  if (!lensContainerRef.value) return

  // 等待 DOM 渲染完成后初始化
  setTimeout(() => {
    updateOrigins()

    // 创建 QuickTo 实例
    cardRefs.value.forEach((card) => {
      quickX.push(gsap.quickTo(card, 'x', { duration: 0.5, ease: 'power3.out' }))
      quickY.push(gsap.quickTo(card, 'y', { duration: 0.5, ease: 'power3.out' }))
      quickScale.push(gsap.quickTo(card, 'scale', { duration: 0.5, ease: 'power3.out' }))
      quickRotateY.push(gsap.quickTo(card, 'rotateY', { duration: 0.5, ease: 'power3.out' }))
      quickRotateX.push(gsap.quickTo(card, 'rotateX', { duration: 0.5, ease: 'power3.out' }))
    })

    // 鼠标移动事件
    const handleMouseMove = (e: MouseEvent) => {
      if (!lensContainerRef.value) return
      const rect = lensContainerRef.value.getBoundingClientRect()
      mouseX = e.clientX - rect.left
      mouseY = e.clientY - rect.top
      updateTracer(e)
      if (!isActive) {
        isActive = true
        animateLens()
      }
    }

    const handleMouseLeave = () => {
      isActive = false
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
      // 恢复原位
      cardRefs.value.forEach((card, i) => {
        if (quickX[i]) quickX[i](0)
        if (quickY[i]) quickY[i](0)
        if (quickScale[i]) quickScale[i](1)
        if (quickRotateY[i]) quickRotateY[i](0)
        if (quickRotateX[i]) quickRotateX[i](0)
      })
      mouseX = -1000
      mouseY = -1000
    }

    const handleResize = () => {
      updateOrigins()
    }

    lensContainerRef.value.addEventListener('mousemove', handleMouseMove)
    lensContainerRef.value.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('resize', handleResize)

    cleanupFns.push(() => {
      lensContainerRef.value?.removeEventListener('mousemove', handleMouseMove)
      lensContainerRef.value?.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('resize', handleResize)
    })

    // 入场动画
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: lensContainerRef.value,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    })

    tl.fromTo('.lens-card',
      {
        opacity: 0,
        scale: 0.3,
        rotateY: 60,
        y: 100
      },
      {
        opacity: 1,
        scale: 1,
        rotateY: 0,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'back.out(1.7)'
      }
    )
    .fromTo(lensFooterRef.value,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6 },
      '-=0.3'
    )

    cleanupFns.push(() => tl.kill())

    // 卡片呼吸效果
    cardRefs.value.forEach((card, i) => {
      gsap.to(card, {
        y: -8,
        duration: 2 + i * 0.3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.2
      })
    })
  }, 100)
})

onUnmounted(() => {
  // 停止动画循环
  isActive = false
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }

  // 执行所有清理
  cleanupFns.forEach(fn => fn())

  // 清理 ScrollTrigger
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style scoped lang="scss">
.lens-section {
  width: 100vw;
  height: 100vh;
  background: #050510;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  perspective: 1500px;
}

.lens-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;

  .bg-nebula {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 30% 20%, rgba(120, 0, 255, 0.15) 0%, transparent 50%),
      radial-gradient(ellipse at 70% 80%, rgba(0, 100, 255, 0.1) 0%, transparent 50%),
      radial-gradient(ellipse at 50% 50%, rgba(255, 0, 100, 0.05) 0%, transparent 70%);
    animation: nebulaPulse 8s ease-in-out infinite;
  }

  .bg-stars {
    position: absolute;
    inset: 0;
    background-image:
      radial-gradient(2px 2px at 20px 30px, rgba(255,255,255,0.8), transparent),
      radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.5), transparent),
      radial-gradient(1px 1px at 90px 40px, rgba(255,255,255,0.6), transparent),
      radial-gradient(2px 2px at 130px 80px, rgba(255,255,255,0.4), transparent),
      radial-gradient(1px 1px at 160px 120px, rgba(255,255,255,0.7), transparent);
    background-size: 200px 200px;
    animation: starTwinkle 4s ease-in-out infinite;
  }

  .bg-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(100, 100, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(100, 100, 255, 0.03) 1px, transparent 1px);
    background-size: 60px 60px;
    transform: perspective(500px) rotateX(60deg) translateY(-50%);
    transform-origin: center bottom;
  }
}

@keyframes nebulaPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.05); }
}

@keyframes starTwinkle {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 0.4; }
}

.lens-container {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 180px);
  gap: 35px;
  padding: 60px;
  transform-style: preserve-3d;
  z-index: 1;
}

.gravity-field {
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(138, 43, 226, 0.2) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 0;
  opacity: 0;
  transition: opacity 0.3s;

  &::before {
    content: '';
    position: absolute;
    inset: 20%;
    border-radius: 50%;
    border: 1px solid rgba(138, 43, 226, 0.4);
    animation: gravityRing 2s ease-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 40%;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(138, 43, 226, 0.5) 0%, transparent 70%);
    animation: gravityCore 1.5s ease-in-out infinite;
  }
}

@keyframes gravityRing {
  0% { transform: scale(0.5); opacity: 1; }
  100% { transform: scale(2); opacity: 0; }
}

@keyframes gravityCore {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.2); opacity: 1; }
}

.lens-card {
  position: relative;
  width: 180px;
  height: 260px;
  transform-style: preserve-3d;
  cursor: pointer;
  will-change: transform;

  .card-glow {
    position: absolute;
    inset: -2px;
    border-radius: 22px;
    background: linear-gradient(
      135deg,
      hsl(var(--hue), 100%, 60%),
      hsl(calc(var(--hue) + 60), 100%, 50%)
    );
    opacity: 0;
    filter: blur(15px);
    transition: opacity 0.3s;
  }

  .card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      145deg,
      rgba(20, 20, 40, 0.95),
      rgba(10, 10, 25, 0.98)
    );
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    box-shadow:
      0 20px 40px rgba(0, 0, 0, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.1),
      inset 0 -1px 0 rgba(0, 0, 0, 0.3);
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.1),
        transparent
      );
      transition: left 0.5s;
    }
  }

  .card-icon {
    font-size: 42px;
    filter: drop-shadow(0 0 10px hsl(var(--hue), 100%, 60%));
    transition: transform 0.3s, filter 0.3s;
  }

  .card-title {
    font-size: 18px;
    font-weight: bold;
    color: #e0e0f0;
    letter-spacing: 2px;
    text-shadow: 0 0 20px hsl(var(--hue), 100%, 60%);
    transition: text-shadow 0.3s;
  }

  .card-desc {
    font-size: 12px;
    color: rgba(200, 200, 220, 0.6);
    letter-spacing: 1px;
  }

  .card-energy {
    display: flex;
    gap: 4px;
    margin-top: 8px;

    .energy-bar {
      width: 4px;
      height: 12px;
      background: hsl(var(--hue), 80%, 50%);
      border-radius: 2px;
      animation: energyPulse 1s ease-in-out infinite;
      animation-delay: calc(var(--i) * 0.15s);

      &:nth-child(2) { height: 16px; }
      &:nth-child(3) { height: 10px; }
      &:nth-child(4) { height: 14px; }
    }
  }

  .card-orbit {
    position: absolute;
    inset: -10px;
    border-radius: 30px;
    border: 1px dashed rgba(138, 43, 226, 0.2);
    animation: orbitRotate 10s linear infinite;
    pointer-events: none;
  }

  &:hover {
    .card-glow { opacity: 0.6; }
    .card-inner::before { left: 100%; }
    .card-icon {
      transform: scale(1.2);
      filter: drop-shadow(0 0 20px hsl(var(--hue), 100%, 70%));
    }
    .card-title {
      text-shadow: 0 0 30px hsl(var(--hue), 100%, 70%);
    }
    .card-orbit {
      border-color: rgba(138, 43, 226, 0.5);
      animation-duration: 3s;
    }
  }
}

@keyframes energyPulse {
  0%, 100% { opacity: 0.4; transform: scaleY(0.8); }
  50% { opacity: 1; transform: scaleY(1); }
}

@keyframes orbitRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.mouse-tracer {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(138, 43, 226, 0.8);
  pointer-events: none;
  z-index: 100;
  transform: translate(-50%, -50%);
  box-shadow:
    0 0 10px rgba(138, 43, 226, 0.8),
    0 0 20px rgba(138, 43, 226, 0.5),
    0 0 30px rgba(138, 43, 226, 0.3);

  &::before {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    border: 1px solid rgba(138, 43, 226, 0.5);
    animation: tracerRipple 1s ease-out infinite;
  }
}

@keyframes tracerRipple {
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(3); opacity: 0; }
}

.lens-footer {
  position: absolute;
  bottom: 60px;
  text-align: center;
  z-index: 1;

  .footer-line {
    width: 1px;
    height: 40px;
    background: linear-gradient(to bottom, transparent, rgba(138, 43, 226, 0.5));
    margin: 0 auto 20px;
  }

  .footer-text {
    font-size: 14px;
    color: rgba(200, 200, 220, 0.6);
    letter-spacing: 3px;
    margin: 0 0 8px;
  }

  .footer-hint {
    font-size: 12px;
    color: rgba(138, 43, 226, 0.6);
    letter-spacing: 2px;
    margin: 0;
    font-family: monospace;
  }
}
</style>
