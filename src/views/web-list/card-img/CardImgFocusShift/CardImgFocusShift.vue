<template>
  <section ref="focusShiftRef" class="focus-shift-section">
    <!-- 深空粒子背景 -->
    <div class="focus-bg">
      <div
        v-for="i in 50"
        :key="i"
        :ref="el => setBgParticleRef(el, i)"
        class="bg-particle"
      ></div>
      <div class="bg-macro-gradient"></div>
      <div class="bg-bokeh-ring"></div>
    </div>

    <!-- 微距镜头光晕 -->
    <div ref="lensGlowRef" class="lens-glow"></div>

    <!-- 焦点指示器 -->
    <div ref="focusIndicatorRef" class="focus-indicator">
      <div class="focus-ring"></div>
      <span class="focus-label">FOCAL PLANE</span>
    </div>

    <!-- 微距移轴容器 -->
    <div ref="macroContainerRef" class="macro-container">
      <!-- 前景层 -->
      <div
        v-for="(img, i) in focusImages"
        :key="`front-${img.id}`"
        :ref="el => setFrontLayerRef(el, i)"
        class="macro-layer macro-layer-front"
      >
        <img :src="img.url" :alt="img.title" class="layer-image" />
        <div class="layer-depth-indicator front-indicator"></div>
      </div>

      <!-- 主体层 -->
      <div
        v-for="(img, i) in focusImages"
        :key="`main-${img.id}`"
        :ref="el => setMainLayerRef(el, i)"
        class="macro-layer macro-layer-main"
      >
        <img :src="img.url" :alt="img.title" class="layer-image" />
        <div class="layer-content">
          <span class="layer-number">{{ String(i + 1).padStart(2, '0') }}</span>
          <h3 class="layer-title">{{ img.title }}</h3>
          <p class="layer-desc">{{ img.description }}</p>
        </div>
        <div class="layer-depth-indicator main-indicator"></div>
      </div>

      <!-- 背景层 -->
      <div
        v-for="(img, i) in focusImages"
        :key="`back-${img.id}`"
        :ref="el => setBackLayerRef(el, i)"
        class="macro-layer macro-layer-back"
      >
        <img :src="img.url" :alt="img.title" class="layer-image" />
        <div class="layer-depth-indicator back-indicator"></div>
      </div>
    </div>

    <!-- 散景装饰 -->
    <div ref="bokehLayerRef" class="bokeh-layer">
      <div
        v-for="i in 30"
        :key="`bokeh-${i}`"
        :ref="el => setBokehRef(el, i)"
        class="bokeh-circle"
      ></div>
    </div>

    <!-- 暗角遮罩 -->
    <div class="vignette-overlay"></div>

    <!-- 色温呼吸光晕 -->
    <div ref="warmthGlowRef" class="warmth-glow"></div>

    <!-- 景深参数显示 -->
    <div ref="dofDisplayRef" class="dof-display">
      <div class="dof-item">
        <span class="dof-label">DEPTH</span>
        <span class="dof-value">{{ currentDepth }}</span>
      </div>
      <div class="dof-item">
        <span class="dof-label">BLUR</span>
        <span class="dof-value">{{ currentBlur }}</span>
      </div>
      <div class="dof-item">
        <span class="dof-label">PLANE</span>
        <span class="dof-value">{{ currentPlane }}</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ==================== 类型定义 ====================
interface FocusImage {
  id: number
  url: string
  title: string
  description: string
}

// ==================== Refs ====================
const focusShiftRef = ref<HTMLElement>()
const macroContainerRef = ref<HTMLElement>()
const lensGlowRef = ref<HTMLElement>()
const focusIndicatorRef = ref<HTMLElement>()
const bokehLayerRef = ref<HTMLElement>()
const warmthGlowRef = ref<HTMLElement>()
const dofDisplayRef = ref<HTMLElement>()

const frontLayerRefs = ref<HTMLElement[]>([])
const mainLayerRefs = ref<HTMLElement[]>([])
const backLayerRefs = ref<HTMLElement[]>([])
const bgParticleRefs = ref<HTMLElement[]>([])
const bokehRefs = ref<HTMLElement[]>([])

const setFrontLayerRef = (el: any, i: number) => { if (el) frontLayerRefs.value[i] = el }
const setMainLayerRef = (el: any, i: number) => { if (el) mainLayerRefs.value[i] = el }
const setBackLayerRef = (el: any, i: number) => { if (el) backLayerRefs.value[i] = el }
const setBgParticleRef = (el: any, i: number) => { if (el) bgParticleRefs.value[i - 1] = el }
const setBokehRef = (el: any, i: number) => { if (el) bokehRefs.value[i - 1] = el }

// ==================== 状态 ====================
const currentDepth = ref('∞')
const currentBlur = ref('0px')
const currentPlane = ref('MAIN')

// ==================== 微距移轴图片数据 ====================
const focusImages = reactive<FocusImage[]>([
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=85',
    title: '极光幻境',
    description: '穿越时空的巍峨巅峰'
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=85',
    title: '永恒峰峦',
    description: '宇宙深处的绚烂光辉'
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&q=85',
    title: '星河漩涡',
    description: '亿万星辰的永恒舞蹈'
  }
])

// ==================== 动画清理 ====================
let cleanupFns: Array<() => void> = []
let mouseX = 0
let mouseY = 0
let setRotateX: ((value: number) => void) | null = null
let setRotateY: ((value: number) => void) | null = null
let currentRotateX = 0
let currentRotateY = 0

function initFocusShiftAnimation() {
  const container = focusShiftRef.value
  const macroContainer = macroContainerRef.value
  const lensGlow = lensGlowRef.value
  const focusIndicator = focusIndicatorRef.value
  const bokehLayer = bokehLayerRef.value
  const warmthGlow = warmthGlowRef.value

  if (!container || !macroContainer) return

  const allFrontLayers = frontLayerRefs.value.filter(Boolean)
  const allMainLayers = mainLayerRefs.value.filter(Boolean)
  const allBackLayers = backLayerRefs.value.filter(Boolean)
  const allBgParticles = bgParticleRefs.value.filter(Boolean)
  const allBokeh = bokehRefs.value.filter(Boolean)

  // ========== 1. 初始状态设置 ==========
  gsap.set(macroContainer, {
    transformStyle: 'preserve-3d',
    transformOrigin: 'center center',
    perspective: 1200
  })

  // 前景层 - Z轴最前 (translateZ: 80px, scale: 1.26)
  allFrontLayers.forEach((layer, i) => {
    gsap.set(layer, {
      position: 'absolute',
      left: '50%',
      top: '50%',
      xPercent: -50,
      yPercent: -50,
      translateX: (i - 1) * 400,
      translateY: (i - 1) * -100,
      translateZ: 80,
      scale: 1.26,
      opacity: 0,
      filter: 'blur(12px) brightness(0.7)',
      transformStyle: 'preserve-3d'
    })
  })

  // 主体层 - Z轴中间 (translateZ: 0px, scale: 1)
  allMainLayers.forEach((layer, i) => {
    gsap.set(layer, {
      position: 'absolute',
      left: '50%',
      top: '50%',
      xPercent: -50,
      yPercent: -50,
      translateX: (i - 1) * 400,
      translateY: (i - 1) * -100,
      translateZ: 0,
      scale: 1,
      opacity: 0,
      filter: 'blur(8px) brightness(0.8)',
      transformStyle: 'preserve-3d'
    })
  })

  // 背景层 - Z轴最后 (translateZ: -80px, scale: 0.79)
  allBackLayers.forEach((layer, i) => {
    gsap.set(layer, {
      position: 'absolute',
      left: '50%',
      top: '50%',
      xPercent: -50,
      yPercent: -50,
      translateX: (i - 1) * 400,
      translateY: (i - 1) * -100,
      translateZ: -80,
      scale: 0.79,
      opacity: 0,
      filter: 'blur(15px) brightness(0.6)',
      transformStyle: 'preserve-3d'
    })
  })

  // 背景粒子初始状态
  allBgParticles.forEach((particle, i) => {
    const angle = (i / allBgParticles.length) * Math.PI * 2
    const radius = 200 + Math.random() * 300
    gsap.set(particle, {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      scale: 0,
      opacity: 0
    })
  })

  // 散景粒子初始
  allBokeh.forEach((bokeh, i) => {
    gsap.set(bokeh, {
      x: (Math.random() - 0.5) * window.innerWidth * 2,
      y: (Math.random() - 0.5) * window.innerHeight * 2,
      scale: 0,
      opacity: 0
    })
  })

  // ========== 2. 创建主时间线 - 滚动驱动 ==========
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top 80%',
      end: 'bottom -100%',
      scrub: 1.5,
      anticipatePin: 1,
      toggleActions: 'play reverse play reverse'
    }
  })

  // 阶段A: 背景粒子淡入
  tl.to(allBgParticles, {
    scale: 1,
    opacity: 0.6,
    duration: 0.2,
    ease: 'power2.in'
  }, 0)

  // 阶段B: 散景粒子出现
  tl.to(allBokeh, {
    scale: (i) => 0.3 + Math.random() * 0.7,
    opacity: (i) => 0.2 + Math.random() * 0.4,
    duration: 0.3,
    stagger: 0.02,
    ease: 'power2.out'
  }, 0.05)

  // 阶段C: 三层图片依次展开 (前景 -> 主体 -> 背景)
  // 前景层
  tl.to(allFrontLayers, {
    opacity: 1,
    duration: 0.2,
    ease: 'power3.out'
  }, 0.1)

  // 主体层
  tl.to(allMainLayers, {
    opacity: 1,
    duration: 0.2,
    ease: 'power3.out'
  }, 0.15)

  // 背景层
  tl.to(allBackLayers, {
    opacity: 1,
    duration: 0.2,
    ease: 'power3.out'
  }, 0.2)

  // ========== 3. 焦点切换动画 ==========
  // 创建循环的焦点切换
  const focusLayers = [allFrontLayers, allMainLayers, allBackLayers]
  const focusNames = ['FRONT', 'MAIN', 'BACK']
  const blurValues = [
    { inFocus: 0, outFocus: 12 },
    { inFocus: 0, outFocus: 8 },
    { inFocus: 0, outFocus: 15 }
  ]

  let currentFocusIndex = 1 // 从主体层开始

  // 创建焦点切换时间线
  const focusTl = gsap.timeline({ repeat: -1 })

  for (let cycle = 0; cycle < 3; cycle++) {
    focusLayers.forEach((layers, layerIndex) => {
      if (layerIndex === currentFocusIndex) {
        // 当前焦点层 - 清晰
        focusTl.to(layers, {
          filter: `blur(${blurValues[layerIndex].inFocus}px) brightness(1) saturate(1.1)`,
          duration: 0.8,
          ease: 'power2.inOut'
        }, cycle * 2.4 + layerIndex * 0.8)
      } else {
        // 非焦点层 - 模糊
        const blurAmount = blurValues[layerIndex].outFocus
        focusTl.to(layers, {
          filter: `blur(${blurAmount}px) brightness(0.7) saturate(0.8)`,
          duration: 0.8,
          ease: 'power2.inOut'
        }, cycle * 2.4 + layerIndex * 0.8)
      }
    })

    // 更新焦点指示器
    focusTl.to({}, {
      duration: 0.1,
      onStart: () => {
        currentPlane.value = focusNames[currentFocusIndex]
        currentBlur.value = `${blurValues[currentFocusIndex].inFocus}px`
        currentDepth.value = focusNames[currentFocusIndex] === 'FRONT' ? '0.3m' : focusNames[currentFocusIndex] === 'MAIN' ? '1.2m' : '5.0m'
      }
    }, cycle * 2.4)

    // 切换到下一个焦点
    currentFocusIndex = (currentFocusIndex + 1) % 3
  }

  // ========== 4. 鼠标移动视差效果 ==========
  if (macroContainer) {
    // 使用 quickSetter 替代 quickTo，避免 rotateX/Y reset 警告
    setRotateX = gsap.quickSetter(macroContainer, 'rotateX', 'deg')
    setRotateY = gsap.quickSetter(macroContainer, 'rotateY', 'deg')
  }

  // 鼠标移动监听
  const handleMouseMove = (e: MouseEvent) => {
    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2

    const targetRotateY = ((e.clientX - centerX) / centerX) * 8
    const targetRotateX = -((e.clientY - centerY) / centerY) * 6

    // 使用 gsap.to 实现平滑过渡
    gsap.to({ rotateX: currentRotateX, rotateY: currentRotateY }, {
      rotateX: targetRotateX,
      rotateY: targetRotateY,
      duration: 0.8,
      ease: 'power3.out',
      onUpdate: function() {
        currentRotateX = this.targets()[0].rotateX
        currentRotateY = this.targets()[0].rotateY
        if (setRotateX) setRotateX(currentRotateX)
        if (setRotateY) setRotateY(currentRotateY)
      },
      overwrite: 'auto'
    })
  }

  container.addEventListener('mousemove', handleMouseMove)
  cleanupFns.push(() => container.removeEventListener('mousemove', handleMouseMove))

  // ========== 5. 镜头光晕呼吸 ==========
  if (lensGlow) {
    gsap.to(lensGlow, {
      scale: 1.3,
      opacity: 0.5,
      rotation: 360,
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
    cleanupFns.push(() => gsap.killTweensOf(lensGlow))
  }

  // ========== 6. 色温呼吸光晕 ==========
  if (warmthGlow) {
    const warmthTl = gsap.timeline({ repeat: -1, yoyo: true })

    warmthTl.to(warmthGlow, {
      background: 'radial-gradient(circle, rgba(255, 180, 100, 0.15) 0%, transparent 60%)',
      duration: 4,
      ease: 'sine.inOut'
    })
    .to(warmthGlow, {
      background: 'radial-gradient(circle, rgba(100, 180, 255, 0.12) 0%, transparent 60%)',
      duration: 4,
      ease: 'sine.inOut'
    }, '<')

    cleanupFns.push(() => warmthTl.kill())
  }

  // ========== 7. 焦点指示器动画 ==========
  if (focusIndicator) {
    gsap.to(focusIndicator, {
      scale: 1.2,
      opacity: 0.8,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
    cleanupFns.push(() => gsap.killTweensOf(focusIndicator))
  }

  // ========== 8. 入场动画 ==========
  gsap.fromTo(container, {
    opacity: 0
  }, {
    opacity: 1,
    duration: 1,
    ease: 'power2.out'
  })

  // ========== 9. 保存清理函数 ==========
  cleanupFns.push(() => {
    tl.kill()
    focusTl.kill()
    ScrollTrigger.getAll().forEach(st => {
      if (st.vars.trigger === container) {
        st.kill()
      }
    })
  })
}

// ==================== 生命周期 ====================
onMounted(async () => {
  await nextTick()
  setTimeout(() => {
    initFocusShiftAnimation()
  }, 100)
})

onUnmounted(() => {
  // 清理所有动画
  cleanupFns.forEach(fn => fn())
  cleanupFns = []

  // 清理 ScrollTrigger
  ScrollTrigger.getAll().forEach(st => st.kill())

  // 清理 GSAP 动画
  setRotateX = null
  setRotateY = null
  gsap.killTweensOf('*')

  // 清理 DOM 属性
  if (focusShiftRef.value) {
    gsap.set(focusShiftRef.value, { clearProps: 'all' })
  }
})
</script>

<style lang="scss" scoped>
// ==================== 变量 ====================
$macro-amber: #ffb366;
$macro-cyan: #66d9ff;
$macro-violet: #9966ff;
$macro-gold: #ffd700;
$macro-dark: #0a0812;

// ==================== 主容器 ====================
.focus-shift-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(160deg, #0a0812 0%, #120a1a 40%, #0a1220 100%);
  font-family: 'Rajdhani', 'Orbitron', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
}

// ==================== 深空背景 ====================
.focus-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.bg-particle {
  position: absolute;
  width: 3px;
  height: 3px;
  background: white;
  border-radius: 50%;
  left: 50%;
  top: 50%;
}

.bg-macro-gradient {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 30% 40%, rgba($macro-amber, 0.08) 0%, transparent 35%),
    radial-gradient(ellipse at 70% 60%, rgba($macro-cyan, 0.06) 0%, transparent 35%),
    radial-gradient(ellipse at 50% 30%, rgba($macro-violet, 0.05) 0%, transparent 40%);
  animation: macroPulse 10s ease-in-out infinite;
}

@keyframes macroPulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

.bg-bokeh-ring {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 100%;
  height: 100%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: radial-gradient(
    circle,
    transparent 20%,
    rgba($macro-cyan, 0.02) 40%,
    transparent 60%
  );
  animation: bokehRotate 30s linear infinite;
}

@keyframes bokehRotate {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

// ==================== 微距镜头光晕 ====================
.lens-glow {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 300px;
  height: 300px;
  background: radial-gradient(
    circle,
    rgba($macro-amber, 0.2) 0%,
    rgba($macro-cyan, 0.1) 30%,
    transparent 60%
  );
  border-radius: 50%;
  transform: translate(-50%, -50%);
  filter: blur(40px);
  pointer-events: none;
  z-index: 5;
}

// ==================== 色温呼吸光晕 ====================
.warmth-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at 50% 50%,
    rgba($macro-amber, 0.1) 0%,
    transparent 50%
  );
  pointer-events: none;
  z-index: 4;
  mix-blend-mode: screen;
}

// ==================== 焦点指示器 ====================
.focus-indicator {
  position: absolute;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  z-index: 30;
}

.focus-ring {
  width: 60px;
  height: 60px;
  border: 2px solid rgba($macro-cyan, 0.6);
  border-radius: 50%;
  animation: focusPulse 2s ease-in-out infinite;

  &::before {
    content: '';
    position: absolute;
    inset: 4px;
    border: 1px solid rgba($macro-amber, 0.4);
    border-radius: 50%;
  }
}

@keyframes focusPulse {
  0%, 100% {
    transform: scale(1);
    border-color: rgba($macro-cyan, 0.6);
  }
  50% {
    transform: scale(1.1);
    border-color: rgba($macro-amber, 0.8);
  }
}

.focus-label {
  font-size: 10px;
  letter-spacing: 4px;
  color: rgba(white, 0.5);
  text-transform: uppercase;
  font-family: 'Courier New', monospace;
}

// ==================== 微距移轴容器 ====================
.macro-container {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  will-change: transform;
  z-index: 10;
}

// ==================== 微距图层 ====================
.macro-layer {
  position: absolute;
  transform-style: preserve-3d;
  will-change: transform, opacity, filter;
  will-change: transform, opacity, filter;
  backface-visibility: hidden;
}

.macro-layer-front {
  z-index: 30;
}

.macro-layer-main {
  z-index: 20;
}

.macro-layer-back {
  z-index: 10;
}

.layer-image {
  width: 550px;
  height: 380px;
  object-fit: cover;
  border-radius: 20px;
  transition: transform 0.6s ease;
}

.macro-layer:hover .layer-image {
  transform: scale(1.03);
}

.layer-content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0.3) 50%,
    transparent 100%
  );
  border-radius: 20px;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.macro-layer-main:hover .layer-content {
  opacity: 1;
}

.layer-number {
  font-size: 56px;
  font-weight: 700;
  font-family: 'Orbitron', sans-serif;
  color: rgba($macro-cyan, 0.9);
  text-shadow: 0 0 40px rgba($macro-cyan, 0.6);
  line-height: 1;
  margin-bottom: 12px;
}

.layer-title {
  font-size: 32px;
  font-weight: 700;
  letter-spacing: 8px;
  text-transform: uppercase;
  margin: 0 0 10px;
  color: white;
  text-shadow: 0 0 30px rgba(white, 0.3);
}

.layer-desc {
  font-size: 14px;
  color: rgba(white, 0.7);
  margin: 0;
  letter-spacing: 3px;
  font-style: italic;
}

// 景深指示器
.layer-depth-indicator {
  position: absolute;
  bottom: -25px;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 12px;
  font-size: 9px;
  letter-spacing: 3px;
  text-transform: uppercase;
  border-radius: 10px;
  font-family: 'Courier New', monospace;
}

.front-indicator {
  background: rgba($macro-amber, 0.3);
  color: $macro-amber;
  border: 1px solid rgba($macro-amber, 0.5);
}

.main-indicator {
  background: rgba($macro-cyan, 0.3);
  color: $macro-cyan;
  border: 1px solid rgba($macro-cyan, 0.5);
}

.back-indicator {
  background: rgba($macro-violet, 0.3);
  color: $macro-violet;
  border: 1px solid rgba($macro-violet, 0.5);
}

// ==================== 散景层 ====================
.bokeh-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 15;
}

.bokeh-circle {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba($macro-cyan, 0.3) 0%,
    rgba($macro-amber, 0.15) 40%,
    transparent 70%
  );
  filter: blur(8px);
  will-change: transform, opacity;
}

// ==================== 暗角遮罩 ====================
.vignette-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at center,
    transparent 40%,
    rgba(0, 0, 0, 0.4) 100%
  );
  pointer-events: none;
  z-index: 25;
  animation: vignettePulse 6s ease-in-out infinite;
}

@keyframes vignettePulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.85; }
}

// ==================== 景深参数显示 ====================
.dof-display {
  position: absolute;
  bottom: 40px;
  right: 40px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 30;
  padding: 16px 20px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba($macro-cyan, 0.3);
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.dof-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.dof-label {
  font-size: 10px;
  letter-spacing: 3px;
  color: rgba(white, 0.5);
  text-transform: uppercase;
  font-family: 'Courier New', monospace;
}

.dof-value {
  font-size: 14px;
  font-weight: 600;
  color: $macro-cyan;
  font-family: 'Orbitron', sans-serif;
  text-shadow: 0 0 15px rgba($macro-cyan, 0.5);
}

// ==================== 响应式 ====================
@media (max-width: 1200px) {
  .layer-image {
    width: 450px;
    height: 310px;
  }

  .layer-number {
    font-size: 44px;
  }

  .layer-title {
    font-size: 26px;
    letter-spacing: 6px;
  }

  .dof-display {
    bottom: 25px;
    right: 25px;
  }
}

@media (max-width: 900px) {
  .layer-image {
    width: 360px;
    height: 250px;
  }

  .layer-number {
    font-size: 36px;
  }

  .layer-title {
    font-size: 20px;
    letter-spacing: 4px;
  }

  .layer-desc {
    font-size: 12px;
  }

  .layer-content {
    padding: 20px;
  }

  .focus-indicator {
    top: 25px;
  }

  .focus-ring {
    width: 45px;
    height: 45px;
  }
}

@media (max-width: 600px) {
  .layer-image {
    width: 280px;
    height: 195px;
  }

  .layer-number {
    font-size: 28px;
  }

  .layer-title {
    font-size: 16px;
    letter-spacing: 2px;
  }

  .layer-desc {
    display: none;
  }

  .layer-content {
    padding: 15px;
  }

  .layer-depth-indicator {
    display: none;
  }

  .dof-display {
    bottom: 15px;
    right: 15px;
    padding: 10px 14px;
  }

  .dof-item {
    gap: 12px;
  }

  .dof-label {
    font-size: 8px;
    letter-spacing: 2px;
  }

  .dof-value {
    font-size: 11px;
  }
}
</style>
