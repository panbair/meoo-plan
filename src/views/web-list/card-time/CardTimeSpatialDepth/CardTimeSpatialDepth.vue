<template>
  <div ref="sectionRef" class="card-spatial-depth">
    <!-- 3D 透视背景 -->
    <div class="spatial-bg">
      <div class="bg-grid" ref="gridRef"></div>
      <div class="bg-horizon" ref="horizonRef"></div>
      <div class="bg-particles" ref="particlesRef"></div>
    </div>

    <!-- 内容区域 -->
    <div class="spatial-content">
      <div ref="badgeRef" class="spatial-badge">
        <span class="badge-line"></span>
        SPATIAL 3D
        <span class="badge-line"></span>
      </div>

      <h2 ref="titleRef" class="spatial-title">
        <span class="title-char" v-for="(char, i) in '空间悬浮'" :key="i">{{ char }}</span>
      </h2>

      <p ref="subtitleRef" class="spatial-subtitle">多层次深度交互体验</p>

      <!-- 3D 卡片容器 -->
      <div ref="cardsContainerRef" class="spatial-cards-container" @mousemove="handleMouseMove" @mouseleave="handleMouseLeave">
        <div
          v-for="(card, i) in spatialCards"
          :key="'card-' + i"
          :ref="el => cardRefs.set(i, el as HTMLElement)"
          class="spatial-card"
          :class="'card-z-' + card.zDepth"
          :data-depth="card.zDepth"
        >
          <div class="card-surface card-front">
            <div class="card-depth-indicator">{{ card.zDepth.toFixed(1) }}D</div>
            <div class="card-visual">
              <div class="card-3d-icon" v-html="card.icon"></div>
            </div>
            <h3 class="card-title">{{ card.title }}</h3>
            <p class="card-desc">{{ card.desc }}</p>
            <div class="card-value">{{ card.value }}</div>
          </div>
          <div class="card-reflection"></div>
        </div>
      </div>

      <!-- 深度指示器 -->
      <div ref="depthIndicatorRef" class="spatial-depth-indicator">
        <div class="indicator-label">DEPTH</div>
        <div class="indicator-bar">
          <div ref="indicatorFillRef" class="indicator-fill"></div>
        </div>
      </div>
    </div>

    <!-- 角落装饰 -->
    <div class="spatial-corner corner-tl"></div>
    <div class="spatial-corner corner-tr"></div>
    <div class="spatial-corner corner-bl"></div>
    <div class="spatial-corner corner-br"></div>

    <!-- 扫描线 -->
    <div class="scan-line" ref="scanLineRef"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []

const sectionRef = ref<HTMLElement | null>(null)
const badgeRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const cardsContainerRef = ref<HTMLElement | null>(null)
const depthIndicatorRef = ref<HTMLElement | null>(null)
const indicatorFillRef = ref<HTMLElement | null>(null)
const scanLineRef = ref<HTMLElement | null>(null)
const particlesRef = ref<HTMLElement | null>(null)
const gridRef = ref<HTMLElement | null>(null)
const horizonRef = ref<HTMLElement | null>(null)
const cardRefs = ref(new Map<number, HTMLElement>())

const spatialCards = [
  {
    title: '表层',
    desc: '近景视角',
    value: '0.1',
    zDepth: 0.1,
    hue: 200,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M12 2v4m0 12v4m10-10h-4M6 12H2"/></svg>'
  },
  {
    title: '浅层',
    desc: '轻度景深',
    value: '0.3',
    zDepth: 0.3,
    hue: 240,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 12h16M12 4v16"/></svg>'
  },
  {
    title: '中层',
    desc: '标准视距',
    value: '0.5',
    zDepth: 0.5,
    hue: 280,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="12 2 22 22 2 22"/></svg>'
  },
  {
    title: '深层',
    desc: '纵深空间',
    value: '0.7',
    zDepth: 0.7,
    hue: 320,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>'
  },
  {
    title: '远层',
    desc: '无限深远',
    value: '0.9',
    zDepth: 0.9,
    hue: 30,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>'
  }
]

// quickTo 实例数组（仅用于 x, y, z）
let quickToX: gsap.core.QuickToFunc[] = []
let quickToY: gsap.core.QuickToFunc[] = []
let quickToZ: gsap.core.QuickToFunc[] = []
// 旋转动画的 tween 实例数组（用于清理）
let rotYTweens: gsap.core.Tween[] = []
let rotXTweens: gsap.core.Tween[] = []

const createParticles = () => {
  if (!particlesRef.value) return
  for (let i = 0; i < 25; i++) {
    const particle = document.createElement('div')
    particle.className = 'spatial-particle'
    particle.style.cssText = `
      position: absolute;
      width: ${Math.random() * 2 + 1}px;
      height: ${Math.random() * 2 + 1}px;
      background: hsla(${Math.random() * 60 + 260}, 70%, 60%, ${Math.random() * 0.4 + 0.2});
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
    `
    particlesRef.value.appendChild(particle)
  }
}

const initAnimations = () => {
  if (!sectionRef.value) return

  // 入场 Timeline：从底部深处升起 + 模糊消散
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 70%',
      toggleActions: 'play none none none'
    }
  })

  // badge 入场
  tl.fromTo(badgeRef.value,
    { scale: 0, opacity: 0, y: -20 },
    { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.7)' }
  )

  // 标题字符依次旋转入场
  const chars = titleRef.value?.querySelectorAll('.title-char')
  if (chars) {
    chars.forEach((char, i) => {
      gsap.set(char, { opacity: 0, y: 30, rotateX: -90 })
      tl.to(char,
        { opacity: 1, y: 0, rotateX: 0, duration: 0.4, ease: 'power3.out' },
        `-=${0.3 - i * 0.03}`
      )
    })
  }

  tl.fromTo(subtitleRef.value,
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
    '-=0.2'
  )

  // 卡片从深处升起 + 景深模糊消散
  cardRefs.value.forEach((card, i) => {
    if (!card) return
    const depth = spatialCards[i]?.zDepth || 0.5

    // 初始状态：从深处升起，模糊
    gsap.set(card, {
      opacity: 0,
      y: 150 * (1 - depth + 0.3),
      z: -400 * (1 - depth),
      filter: `blur(${(1 - depth) * 12}px)`,
      rotateY: 15 * (i - 2),
      rotateX: 10
    })

    // 升起到最终位置
    tl.to(card,
      {
        opacity: 1,
        y: 0,
        z: 0,
        filter: 'blur(0px)',
        rotateY: 0,
        rotateX: 0,
        duration: 1,
        ease: 'power3.out'
      },
      `-=${0.6 - i * 0.08}`
    )

    // 初始化 quickTo（仅用于 x, y, z）
    const quickX = gsap.quickTo(card, 'x', { duration: 0.6, ease: 'power2.out' })
    const quickY = gsap.quickTo(card, 'y', { duration: 0.6, ease: 'power2.out' })
    const quickZ = gsap.quickTo(card, 'z', { duration: 0.6, ease: 'power2.out' })

    quickToX.push(quickX)
    quickToY.push(quickY)
    quickToZ.push(quickZ)
  })

  tl.fromTo(depthIndicatorRef.value,
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
    '-=0.2'
  )

  cleanupFns.push(() => tl.kill())

  // 背景网格视差
  if (gridRef.value) {
    const gridSt = ScrollTrigger.create({
      trigger: sectionRef.value,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 2,
      onUpdate: (self) => {
        gsap.set(gridRef.value, {
          y: self.progress * -50,
          scale: 1 + self.progress * 0.2
        })
      }
    })
    cleanupFns.push(() => gridSt.kill())
  }

  // 地平线效果
  if (horizonRef.value) {
    const horizonSt = ScrollTrigger.create({
      trigger: sectionRef.value,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.5,
      onUpdate: (self) => {
        gsap.set(horizonRef.value, {
          opacity: 0.3 + self.progress * 0.4,
          scaleX: 1 + self.progress * 0.3
        })
      }
    })
    cleanupFns.push(() => horizonSt.kill())
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
          y: -50 * self.progress,
          opacity: 1 - self.progress * 1.5
        })
      }
    })
    cleanupFns.push(() => titleSt.kill())
  }

  // 扫描线
  if (scanLineRef.value) {
    const scanAnim = gsap.to(scanLineRef.value, {
      top: '100%',
      duration: 2.5,
      ease: 'none',
      repeat: -1,
      repeatDelay: 1.5
    })
    cleanupFns.push(() => scanAnim.kill())
  }

  // 粒子漂浮
  if (particlesRef.value) {
    const particleAnim = gsap.to(particlesRef.value, {
      y: -20,
      duration: 4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    })
    cleanupFns.push(() => particleAnim.kill())
  }
}

// 鼠标移动处理 - 使用 quickTo 实时交互
const handleMouseMove = (e: MouseEvent) => {
  if (!cardsContainerRef.value) return

  const rect = cardsContainerRef.value.getBoundingClientRect()
  const mouseX = e.clientX - rect.left - rect.width / 2
  const mouseY = e.clientY - rect.top - rect.height / 2

  // 更新深度指示器
  if (indicatorFillRef.value) {
    const fillPercent = ((mouseX + rect.width / 2) / rect.width) * 100
    gsap.to(indicatorFillRef.value, {
      width: `${Math.abs(fillPercent - 50) * 2}%`,
      duration: 0.3
    })
  }

  // 使用 quickTo 驱动所有卡片
  cardRefs.value.forEach((card, i) => {
    if (!card) return
    const depth = spatialCards[i]?.zDepth || 0.5
    const depthMultiplier = 1 - depth // 深度越小，移动越大

    const moveX = mouseX * depthMultiplier * 0.4
    const moveY = mouseY * depthMultiplier * 0.3
    const rotY = mouseX * 0.03 * depthMultiplier
    const rotX = -mouseY * 0.03 * depthMultiplier
    const zShift = 80 * depthMultiplier

    quickToX[i]?.(moveX)
    quickToY[i]?.(moveY)
    quickToZ[i]?.(zShift)
    // 旋转使用 gsap.to（quickTo 不支持 rotateX/rotateY）
    if (card) {
      gsap.to(card, {
        rotateY: rotY,
        rotateX: rotX,
        duration: 0.6,
        ease: 'power2.out',
        overwrite: 'auto'
      })
    }
  })
}

// 鼠标离开 - 回到初始位置
const handleMouseLeave = () => {
  cardRefs.value.forEach((card, i) => {
    if (!card) return

    quickToX[i]?.(0)
    quickToY[i]?.(0)
    quickToZ[i]?.(0)
    // 旋转使用 gsap.to 回到初始位置
    gsap.to(card, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.6,
      ease: 'power2.out',
      overwrite: 'auto'
    })
  })

  // 指示器归零
  if (indicatorFillRef.value) {
    gsap.to(indicatorFillRef.value, {
      width: '0%',
      duration: 0.5
    })
  }
}

onMounted(() => {
  createParticles()
  setTimeout(initAnimations, 100)
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(st => {
    if (st.vars.trigger && sectionRef.value?.contains(st.vars.trigger as Element)) {
      st.kill()
    }
  })
  // 清理 quickTo
  quickToX = []
  quickToY = []
  quickToZ = []
  // 清理旋转 tween
  rotYTweens.forEach(t => t.kill())
  rotXTweens.forEach(t => t.kill())
  rotYTweens = []
  rotXTweens = []
})
</script>

<style scoped lang="scss">
.card-spatial-depth {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0f1a2e 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1200px;
}

// 3D 透视背景
.spatial-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.bg-grid {
  position: absolute;
  inset: -100px;
  background-image:
    linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
  background-size: 80px 80px;
  transform: perspective(500px) rotateX(60deg);
  transform-origin: center top;
}

.bg-horizon {
  position: absolute;
  bottom: 35%;
  left: -10%;
  right: -10%;
  height: 2px;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(59, 130, 246, 0.3) 20%,
    rgba(139, 92, 246, 0.5) 50%,
    rgba(59, 130, 246, 0.3) 80%,
    transparent 100%
  );
  transform-origin: center;
}

.bg-particles {
  position: absolute;
  inset: 0;
}

// 内容区域
.spatial-content {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 40px;
  max-width: 1400px;
  width: 100%;
}

.spatial-badge {
  display: inline-flex;
  align-items: center;
  gap: 16px;
  padding: 8px 24px;
  background: rgba(59, 130, 246, 0.08);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 20px;
  color: #93c5fd;
  font-size: 10px;
  letter-spacing: 4px;
  font-weight: 600;
  margin-bottom: 24px;
  backdrop-filter: blur(10px);

  .badge-line {
    width: 20px;
    height: 1px;
    background: linear-gradient(90deg, transparent, #3b82f6);
  }

  .badge-line:last-child {
    background: linear-gradient(90deg, #3b82f6, transparent);
  }
}

.spatial-title {
  font-family: 'Orbitron', 'Rajdhani', sans-serif;
  font-size: 52px;
  font-weight: 900;
  letter-spacing: 16px;
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
  gap: 4px;
  perspective: 500px;

  .title-char {
    display: inline-block;
    background: linear-gradient(135deg, #fff 0%, #93c5fd 50%, #3b82f6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: none;
  }
}

.spatial-subtitle {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 6px;
  margin-bottom: 60px;
}

// 3D 卡片容器
.spatial-cards-container {
  display: flex;
  gap: 24px;
  justify-content: center;
  transform-style: preserve-3d;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
}

// 3D 卡片
.spatial-card {
  position: relative;
  width: 180px;
  height: 280px;
  background: linear-gradient(160deg,
    rgba(30, 40, 70, 0.95) 0%,
    rgba(15, 20, 40, 0.98) 100%
  );
  border-radius: 18px;
  border: 1px solid rgba(59, 130, 246, 0.15);
  overflow: hidden;
  transform-style: preserve-3d;
  transition: border-color 0.3s;

  &:hover {
    border-color: hsla(var(--card-hue), 70%, 60%, 0.4);
  }

  &.card-z-0\.1 { --card-hue: 200; }
  &.card-z-0\.3 { --card-hue: 240; }
  &.card-z-0\.5 { --card-hue: 280; }
  &.card-z-0\.7 { --card-hue: 320; }
  &.card-z-0\.9 { --card-hue: 30; }

  .card-surface {
    position: relative;
    z-index: 2;
    padding: 24px 18px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .card-depth-indicator {
    position: absolute;
    top: 12px;
    right: 12px;
    font-family: 'Orbitron', sans-serif;
    font-size: 9px;
    color: hsla(var(--card-hue), 70%, 60%, 0.6);
    letter-spacing: 1px;
    padding: 3px 8px;
    background: hsla(var(--card-hue), 70%, 60%, 0.1);
    border-radius: 4px;
    border: 1px solid hsla(var(--card-hue), 70%, 60%, 0.2);
  }

  .card-visual {
    width: 70px;
    height: 70px;
    margin-bottom: 20px;
    background: linear-gradient(135deg,
      hsla(var(--card-hue), 70%, 60%, 0.15) 0%,
      hsla(var(--card-hue), 70%, 50%, 0.08) 100%
    );
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid hsla(var(--card-hue), 70%, 60%, 0.2);

    .card-3d-icon {
      width: 36px;
      height: 36px;
      color: hsla(var(--card-hue), 70%, 70%, 1);

      :deep(svg) {
        width: 100%;
        height: 100%;
      }
    }
  }

  .card-title {
    font-size: 16px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 8px;
    letter-spacing: 2px;
  }

  .card-desc {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.45);
    line-height: 1.5;
    margin-bottom: 16px;
  }

  .card-value {
    font-family: 'Orbitron', sans-serif;
    font-size: 28px;
    font-weight: 700;
    background: linear-gradient(135deg,
      hsla(var(--card-hue), 70%, 80%, 1) 0%,
      hsla(var(--card-hue), 70%, 60%, 1) 100%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .card-reflection {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(to top,
      hsla(var(--card-hue), 70%, 60%, 0.06) 0%,
      transparent 100%
    );
    pointer-events: none;
  }
}

// 深度指示器
.spatial-depth-indicator {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  .indicator-label {
    font-size: 9px;
    letter-spacing: 4px;
    color: rgba(255, 255, 255, 0.3);
  }

  .indicator-bar {
    width: 200px;
    height: 2px;
    background: rgba(59, 130, 246, 0.1);
    border-radius: 1px;
    overflow: hidden;

    .indicator-fill {
      width: 0%;
      height: 100%;
      background: linear-gradient(90deg, #3b82f6, #8b5cf6);
      border-radius: 1px;
    }
  }
}

// 角落装饰
.spatial-corner {
  position: absolute;
  width: 50px;
  height: 50px;
  border: 1px solid rgba(59, 130, 246, 0.12);
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

// 扫描线
.scan-line {
  position: absolute;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.2), transparent);
  pointer-events: none;
  z-index: 20;
  top: 0;
}

// 粒子样式
:global(.spatial-particle) {
  animation: spatialFloat 12s ease-in-out infinite;
}

@keyframes spatialFloat {
  0%, 100% {
    transform: translateY(0) translateX(0);
    opacity: 0.2;
  }
  50% {
    transform: translateY(-30px) translateX(10px);
    opacity: 0.5;
  }
}

// 响应式
@media (max-width: 1200px) {
  .spatial-cards-container {
    flex-wrap: wrap;
    max-width: 600px;
  }
}

@media (max-width: 768px) {
  .spatial-title {
    font-size: 32px;
    letter-spacing: 8px;
  }

  .spatial-subtitle {
    font-size: 12px;
    letter-spacing: 3px;
  }

  .spatial-card {
    width: 150px;
    height: 240px;
  }
}
</style>
