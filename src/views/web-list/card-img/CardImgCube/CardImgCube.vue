<template>
  <div ref="parentRef" class="card-img-cube">
    <!-- 背景层 -->
    <div class="cube-background">
      <div class="bg-gradient"></div>
      <div class="bg-particles" ref="particlesRef"></div>
    </div>

    <!-- 多张3D卡片 -->
    <div class="cards-stage">
      <!-- 卡片1 - 左上 -->
      <div ref="card1Ref" class="card-item card-1">
        <div class="card-wrapper">
          <div class="cube">
            <div class="cube-face cube-front">
              <img
                class="cube-image"
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
                alt="Mountain"
              />
              <div class="cube-image-overlay"></div>
              <div class="cube-label">
                <span class="label-icon">⛰</span>
                <span class="label-text">群山</span>
              </div>
            </div>
            <div class="cube-face cube-back"></div>
            <div class="cube-face cube-top"></div>
            <div class="cube-face cube-bottom"></div>
            <div class="cube-face cube-left"></div>
            <div class="cube-face cube-right"></div>
          </div>
        </div>
        <div ref="shadow1Ref" class="card-shadow"></div>
      </div>

      <!-- 卡片2 - 中间主卡片 -->
      <div ref="card2Ref" class="card-item card-2">
        <div class="card-wrapper">
          <div class="cube">
            <div class="cube-face cube-front">
              <img
                class="cube-image"
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80"
                alt="Ocean"
              />
              <div class="cube-image-overlay"></div>
              <div class="cube-label">
                <span class="label-icon">🌊</span>
                <span class="label-text">海岸</span>
              </div>
            </div>
            <div class="cube-face cube-back"></div>
            <div class="cube-face cube-top"></div>
            <div class="cube-face cube-bottom"></div>
            <div class="cube-face cube-left"></div>
            <div class="cube-face cube-right"></div>
          </div>
        </div>
        <div ref="shadow2Ref" class="card-shadow"></div>
      </div>

      <!-- 卡片3 - 右下 -->
      <div ref="card3Ref" class="card-item card-3">
        <div class="card-wrapper">
          <div class="cube">
            <div class="cube-face cube-front">
              <img
                class="cube-image"
                src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80"
                alt="Forest"
              />
              <div class="cube-image-overlay"></div>
              <div class="cube-label">
                <span class="label-icon">🌲</span>
                <span class="label-text">森林</span>
              </div>
            </div>
            <div class="cube-face cube-back"></div>
            <div class="cube-face cube-top"></div>
            <div class="cube-face cube-bottom"></div>
            <div class="cube-face cube-left"></div>
            <div class="cube-face cube-right"></div>
          </div>
        </div>
        <div ref="shadow3Ref" class="card-shadow"></div>
      </div>
    </div>

    <!-- 顶部标签 -->
    <div class="scene-badge">
      <span class="badge-line"></span>
      <span class="badge-text">光影魔方 · 多卡展示</span>
      <span class="badge-line"></span>
    </div>

    <!-- 底部信息 -->
    <div class="scene-info">
      <div class="info-stat">
        <span class="stat-num">3</span>
        <span class="stat-label">卡片</span>
      </div>
      <div class="info-divider"></div>
      <div class="info-stat">
        <span class="stat-num">360°</span>
        <span class="stat-label">旋转</span>
      </div>
      <div class="info-divider"></div>
      <div class="info-stat">
        <span class="stat-num">3D</span>
        <span class="stat-label">视差</span>
      </div>
    </div>

    <!-- 鼠标光晕 -->
    <div ref="cursorRef" class="cursor-glow"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []

const parentRef = ref<HTMLElement | null>(null)
const particlesRef = ref<HTMLElement | null>(null)
const card1Ref = ref<HTMLElement | null>(null)
const card2Ref = ref<HTMLElement | null>(null)
const card3Ref = ref<HTMLElement | null>(null)
const shadow1Ref = ref<HTMLElement | null>(null)
const shadow2Ref = ref<HTMLElement | null>(null)
const shadow3Ref = ref<HTMLElement | null>(null)
const cursorRef = ref<HTMLElement | null>(null)

// 卡片数据
const cardRefs = [card1Ref, card2Ref, card3Ref]
const shadowRefs = [shadow1Ref, shadow2Ref, shadow3Ref]
const cardImages = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80'
]
const cardLabels = [
  { icon: '⛰', text: '群山' },
  { icon: '🌊', text: '海岸' },
  { icon: '🌲', text: '森林' }
]

// 入场动画
function initEntryAnimation() {
  cardRefs.forEach((cardRef, index) => {
    if (!cardRef.value || !shadowRefs[index].value) return

    const delay = index * 0.15
    const xOffset = (index - 1) * 100

    gsap.set(cardRef.value, {
      opacity: 0,
      scale: 0.5,
      y: 100 + index * 30,
      x: xOffset
    })
    gsap.set(shadowRefs[index].value, {
      opacity: 0,
      scaleX: 0.3
    })

    gsap.to(cardRef.value, {
      opacity: 1,
      scale: 1,
      y: 0,
      x: 0,
      duration: 1,
      delay,
      ease: 'back.out(1.7)'
    })
    gsap.to(shadowRefs[index].value, {
      opacity: 1,
      scaleX: 1,
      duration: 1,
      delay,
      ease: 'back.out(1.7)'
    })
  })
}

// 各自旋转动画
function initRotationAnimations() {
  const rotations = [
    { yDuration: 12, yDelay: 0, xDuration: 6, xDelay: 2 },
    { yDuration: 10, yDelay: 1, xDuration: 5, xDelay: 0 },
    { yDuration: 14, yDelay: 2, xDuration: 7, xDelay: 1 }
  ]

  cardRefs.forEach((cardRef, index) => {
    if (!cardRef.value) return
    const rot = rotations[index]

    // Y轴旋转
    gsap.to(cardRef.value, {
      rotateY: 360,
      duration: rot.yDuration,
      repeat: -1,
      ease: 'none',
      delay: rot.yDelay
    })

    // X轴俯仰
    gsap.to(cardRef.value, {
      rotateX: 8,
      duration: rot.xDuration,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: rot.xDelay
    })
  })
}

// 投影跟随
function initShadowsFollow() {
  cardRefs.forEach((cardRef, index) => {
    if (!cardRef.value || !shadowRefs[index].value) return

    ScrollTrigger.create({
      trigger: parentRef.value,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress
        const angle = progress * 360
        const skewX = Math.sin((angle * Math.PI) / 180) * 12
        const scaleX = 0.9 + Math.cos((angle * Math.PI) / 180) * 0.1
        const opacity = 0.5 - Math.abs(Math.sin((angle * Math.PI) / 180)) * 0.15

        gsap.set(shadowRefs[index].value, {
          skewX,
          scaleX,
          opacity
        })
      }
    })
  })
}

// 鼠标交互 - 各自独立响应
function initMouseInteraction() {
  if (!parentRef.value || !cursorRef.value) return

  cardRefs.forEach((cardRef, index) => {
    if (!cardRef.value || !shadowRefs[index].value) return

    const card = cardRef.value
    const shadow = shadowRefs[index].value

    card.addEventListener('mousemove', (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const offsetX = (e.clientX - centerX) / (rect.width / 2)
      const offsetY = (e.clientY - centerY) / (rect.height / 2)

      // 各自独立旋转
      gsap.to(card, {
        rotateY: 15 * offsetX,
        rotateX: -10 * offsetY,
        duration: 0.4,
        ease: 'power2.out'
      })

      // 投影跟随
      gsap.to(shadow, {
        x: offsetX * 25,
        y: offsetY * 8,
        duration: 0.4,
        ease: 'power2.out'
      })
    })

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)'
      })
      gsap.to(shadow, {
        x: 0,
        y: 0,
        skewX: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)'
      })
    })
  })

  // 背景光晕跟随
  function handleMouseMove(e: MouseEvent) {
    gsap.to(cursorRef.value, {
      x: e.clientX - 100,
      y: e.clientY - 100,
      duration: 0.5
    })
  }

  parentRef.value.addEventListener('mousemove', handleMouseMove)
  cleanupFns.push(() => {
    parentRef.value?.removeEventListener('mousemove', handleMouseMove)
  })
}

// 浮动动画
function initFloatAnimation() {
  cardRefs.forEach((cardRef, index) => {
    if (!cardRef.value) return

    gsap.to(cardRef.value, {
      y: -15,
      duration: 2 + index * 0.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: index * 0.3
    })
  })
}

// 视差滚动
function initParallaxScroll() {
  cardRefs.forEach((cardRef, index) => {
    if (!cardRef.value) return

    const speed = [0.1, 0.15, 0.08][index]

    gsap.to(cardRef.value, {
      yPercent: -speed * 100,
      ease: 'none',
      scrollTrigger: {
        trigger: parentRef.value,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5
      }
    })
  })
}

onMounted(() => {
  initEntryAnimation()
  initRotationAnimations()
  initShadowsFollow()
  initMouseInteraction()
  initFloatAnimation()
  initParallaxScroll()
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0
  ScrollTrigger.getAll().forEach(st => st.kill())
  gsap.killTweensOf('*')
})
</script>

<style scoped lang="scss">
.card-img-cube {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    #0a0a1a 0%,
    #12122a 20%,
    #1a1a3a 40%,
    #12122a 60%,
    #0a0a1a 80%,
    #080818 100%
  );
}

// 背景层
.cube-background {
  position: absolute;
  inset: 0;
  z-index: 1;
  overflow: hidden;
}

.bg-gradient {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 600px 500px at 20% 30%, rgba(100, 150, 255, 0.08) 0%, transparent 60%),
    radial-gradient(ellipse 500px 400px at 80% 70%, rgba(150, 100, 255, 0.06) 0%, transparent 60%),
    radial-gradient(ellipse 400px 300px at 50% 50%, rgba(100, 200, 255, 0.04) 0%, transparent 50%);
  animation: bgPulse 8s ease-in-out infinite;
}

@keyframes bgPulse {
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
}

.bg-particles {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(2px 2px at 20% 30%, rgba(255, 255, 255, 0.3), transparent),
    radial-gradient(2px 2px at 40% 70%, rgba(255, 255, 255, 0.2), transparent),
    radial-gradient(1px 1px at 60% 40%, rgba(255, 255, 255, 0.3), transparent),
    radial-gradient(2px 2px at 80% 60%, rgba(255, 255, 255, 0.2), transparent),
    radial-gradient(1px 1px at 10% 80%, rgba(255, 255, 255, 0.3), transparent),
    radial-gradient(2px 2px at 90% 20%, rgba(255, 255, 255, 0.2), transparent);
  animation: particleFloat 20s linear infinite;
}

@keyframes particleFloat {
  0% { transform: translateY(0); }
  100% { transform: translateY(-100px); }
}

// 卡片舞台
.cards-stage {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  perspective: 1500px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
}

// 卡片项
.card-item {
  position: relative;
  transform-style: preserve-3d;
  cursor: pointer;
}

.card-1 {
  transform: translateY(20px) rotateZ(-3deg);
}

.card-2 {
  transform: translateY(-30px) rotateZ(2deg);
  z-index: 2;
}

.card-3 {
  transform: translateY(10px) rotateZ(-2deg);
}

// 卡片包装器
.card-wrapper {
  perspective: 1200px;
}

.cube {
  position: relative;
  width: 260px;
  height: 360px;
  transform-style: preserve-3d;
}

// 卡片各面
.cube-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  border-radius: 16px;
}

.cube-front {
  background: #1a1a2a;
  overflow: hidden;
  transform: translateZ(18px);
  box-shadow:
    inset 0 0 0 2px rgba(255, 255, 255, 0.12),
    0 10px 40px rgba(0, 0, 0, 0.4);
}

.cube-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cube-image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.08) 0%,
    transparent 40%,
    rgba(0, 0, 0, 0.1) 100%
  );
  pointer-events: none;
}

.cube-label {
  position: absolute;
  bottom: 16px;
  left: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 20px;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.label-icon {
  font-size: 14px;
}

.label-text {
  font-size: 12px;
  font-weight: 500;
  color: #fff;
  letter-spacing: 1px;
}

.cube-back {
  background: linear-gradient(145deg, #0f0f1a, #1a1a2a);
  transform: translateZ(-18px) rotateY(180deg);
  box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.04);
}

.cube-top {
  height: 36px;
  top: 0;
  left: 0;
  background: linear-gradient(
    90deg,
    #0f0f1a 0%,
    rgba(200, 200, 220, 0.35) 30%,
    rgba(255, 255, 255, 0.5) 50%,
    rgba(200, 200, 220, 0.35) 70%,
    #0f0f1a 100%
  );
  background-size: 200% 100%;
  border-radius: 16px 16px 0 0;
  transform: rotateX(90deg);
  transform-origin: center bottom;
  animation: shimmer 3s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.cube-bottom {
  height: 36px;
  bottom: 0;
  left: 0;
  background: linear-gradient(90deg, #0a0a12, #1a1a2a, #0a0a12);
  border-radius: 0 0 16px 16px;
  transform: rotateX(-90deg);
  transform-origin: center top;
}

.cube-left {
  width: 36px;
  top: 0;
  left: 0;
  background: linear-gradient(
    180deg,
    rgba(180, 180, 200, 0.25) 0%,
    rgba(150, 150, 170, 0.15) 50%,
    rgba(180, 180, 200, 0.25) 100%
  );
  border-radius: 16px 0 0 16px;
  transform: rotateY(-90deg);
  transform-origin: center right;
}

.cube-right {
  width: 36px;
  top: 0;
  right: 0;
  background: linear-gradient(
    180deg,
    rgba(100, 100, 120, 0.2) 0%,
    rgba(80, 80, 100, 0.12) 50%,
    rgba(100, 100, 120, 0.2) 100%
  );
  border-radius: 0 16px 16px 0;
  transform: rotateY(90deg);
  transform-origin: center left;
}

// 投影
.card-shadow {
  position: absolute;
  width: 260px;
  height: 160px;
  bottom: -60px;
  left: 50%;
  transform: translateX(-50%);
  background: radial-gradient(
    ellipse at center,
    rgba(0, 0, 0, 0.5) 0%,
    rgba(0, 0, 0, 0.2) 40%,
    transparent 70%
  );
  filter: blur(25px);
  transform-origin: center top;
}

// 顶部标签
.scene-badge {
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 16px;
  z-index: 20;
}

.badge-line {
  width: 60px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
}

.badge-text {
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 4px;
  text-transform: uppercase;
}

// 底部信息
.scene-info {
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 30px;
  padding: 20px 40px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 50px;
  backdrop-filter: blur(12px);
  z-index: 20;
}

.info-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-num {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  font-family: 'SF Mono', monospace;
}

.stat-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 1px;
}

.info-divider {
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.15);
}

// 鼠标光晕
.cursor-glow {
  position: fixed;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(100, 180, 255, 0.1) 0%,
    rgba(150, 100, 255, 0.05) 40%,
    transparent 70%
  );
  pointer-events: none;
  z-index: 100;
  opacity: 0;
  transition: opacity 0.3s;
}

.card-img-cube:hover .cursor-glow {
  opacity: 1;
}
</style>
