<template>
  <div ref="parentRef" class="quantum-collapse-230">
    <!-- 深空背景 -->
    <div class="quantum-bg-230">
      <div class="quantum-grid-230"></div>
      <div class="quantum-noise-230"></div>
    </div>

    <!-- 量子波动画布 -->
    <canvas ref="waveCanvasRef" class="quantum-wave-canvas-230"></canvas>

    <!-- 观测波 -->
    <div ref="observeWaveRef" class="observe-wave-230"></div>

    <!-- 文字容器 -->
    <div class="quantum-text-container-230">
      <div
        v-for="(char, charIndex) in displayText.split('')"
        :key="charIndex"
        class="quantum-char-wrapper-230"
        :data-index="charIndex"
      >
        <!-- 概率云副本层 -->
        <div
          v-for="layer in quantumLayers"
          :key="layer"
          class="quantum-layer-230"
          :class="`quantum-layer-${layer}-230`"
          :style="getLayerStyle(charIndex, layer)"
        >
          <span class="quantum-char-230">{{ char }}</span>
        </div>

        <!-- 主层 -->
        <div class="quantum-main-230">
          <span class="quantum-char-230">{{ char }}</span>
        </div>
      </div>
    </div>

    <!-- 量子粒子 -->
    <div class="quantum-particles-230">
      <span v-for="i in 40" :key="i" class="quantum-particle-230"></span>
    </div>

    <!-- 状态指示器 -->
    <div class="quantum-status-230">
      <div class="status-panel-230">
        <span class="status-label-230">COLLAPSE</span>
        <div class="status-bar-230">
          <div class="status-fill-230" :style="{ width: collapsePercent + '%' }"></div>
        </div>
        <span class="status-value-230">{{ Math.round(collapsePercent) }}%</span>
      </div>
      <div class="uncertainty-label-230" :style="{ opacity: uncertaintyOpacity }">
        <span>∆x∆p ≥ ℏ/2</span>
      </div>
    </div>

    <!-- 装饰元素 -->
    <div class="quantum-decor-230">
      <div class="quantum-ring-230"></div>
      <div class="quantum-ring-230 quantum-ring-2-230"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Refs
const parentRef = ref<HTMLElement | null>(null)
const waveCanvasRef = ref<HTMLCanvasElement | null>(null)
const observeWaveRef = ref<HTMLElement | null>(null)

// 数据
const displayText = 'QUANTUM'
const quantumLayers = [1, 2, 3, 4, 5]
const collapsePercent = ref(0)
const uncertaintyOpacity = ref(1)

// 动画状态
let tl: gsap.core.Timeline | null = null
let cleanupFns: (() => void)[] = []
let waveAnimationId: number | null = null
let fluctuationTimeline: gsap.core.Timeline | null = null
let breathTimeline: gsap.core.Tween | null = null

// 存储每个字符的随机偏移
const layerOffsets: { [key: string]: { x: number, y: number }[] } = {}

// 预计算每个字符每层的偏移
function initLayerOffsets() {
  const chars = displayText.split('')
  chars.forEach((_, charIndex) => {
    const offsets: { x: number, y: number }[] = []
    for (let layer = 0; layer <= 5; layer++) {
      offsets.push({
        x: (Math.random() - 0.5) * 100,
        y: (Math.random() - 0.5) * 60
      })
    }
    layerOffsets[charIndex] = offsets
  })
}

initLayerOffsets()

// 获取层样式
function getLayerStyle(charIndex: number, layer: number) {
  const offset = layerOffsets[charIndex]?.[layer] || { x: 0, y: 0 }
  const blur = 6 - layer * 0.8
  const opacity = 0.3 - layer * 0.04

  return {
    '--offset-x': `${offset.x}px`,
    '--offset-y': `${offset.y}px`,
    '--blur': `${Math.max(0, blur)}px`,
    '--layer-opacity': opacity
  }
}

// 量子波动画布
interface WavePoint {
  x: number
  y: number
  baseY: number
  phase: number
  amplitude: number
  frequency: number
}

let wavePoints: WavePoint[] = []

function initWavePoints(count: number, width: number, height: number) {
  wavePoints = []
  for (let i = 0; i < count; i++) {
    wavePoints.push({
      x: (width / count) * i,
      y: height / 2,
      baseY: height / 2,
      phase: Math.random() * Math.PI * 2,
      amplitude: Math.random() * 20 + 5,
      frequency: Math.random() * 0.02 + 0.01
    })
  }
}

function drawQuantumWave(ctx: CanvasRenderingContext2D, width: number, height: number, progress: number) {
  ctx.clearRect(0, 0, width, height)

  if (wavePoints.length === 0) {
    initWavePoints(100, width, height)
  }

  // 绘制量子波
  ctx.beginPath()
  ctx.strokeStyle = `rgba(100, 200, 255, ${0.3 * (1 - progress)})`
  ctx.lineWidth = 1

  for (let i = 0; i < wavePoints.length; i++) {
    const point = wavePoints[i]
    point.y = point.baseY + Math.sin(Date.now() * 0.001 * point.frequency + point.phase) * point.amplitude * (1 - progress)

    if (i === 0) {
      ctx.moveTo(point.x, point.y)
    } else {
      ctx.lineTo(point.x, point.y)
    }
  }
  ctx.stroke()

  // 绘制第二条波
  ctx.beginPath()
  ctx.strokeStyle = `rgba(200, 100, 255, ${0.2 * (1 - progress)})`
  ctx.lineWidth = 1

  for (let i = 0; i < wavePoints.length; i++) {
    const point = wavePoints[i]
    const y = point.baseY + Math.cos(Date.now() * 0.0015 * point.frequency + point.phase) * point.amplitude * 0.5 * (1 - progress)

    if (i === 0) {
      ctx.moveTo(point.x, y)
    } else {
      ctx.lineTo(point.x, y)
    }
  }
  ctx.stroke()
}

function startWaveAnimation() {
  const canvas = waveCanvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const animate = () => {
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height

    if (wavePoints.length === 0) {
      initWavePoints(100, canvas.width, canvas.height)
    }

    drawQuantumWave(ctx, canvas.width, canvas.height, collapsePercent.value / 100)
    waveAnimationId = requestAnimationFrame(animate)
  }

  animate()
}

// 创建坍缩动画
function createCollapseAnimation() {
  if (!parentRef.value || !observeWaveRef.value) return

  const parent = parentRef.value
  const observeWave = observeWaveRef.value

  // 所有副本层
  const allLayers = parent.querySelectorAll('.quantum-layer-230')
  const mainLayers = parent.querySelectorAll('.quantum-main-230')
  const chars = parent.querySelectorAll('.quantum-char-wrapper-230')

  // 初始状态
  gsap.set(allLayers, {
    x: 'var(--offset-x)',
    y: 'var(--offset-y)',
    opacity: 'var(--layer-opacity)',
    filter: 'blur(var(--blur))'
  })

  gsap.set(mainLayers, {
    opacity: 0,
    filter: 'blur(6px)'
  })

  gsap.set(observeWave, {
    scale: 0,
    opacity: 0
  })

  tl = gsap.timeline({
    scrollTrigger: {
      trigger: parent,
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1.5,
      id: 'quantum-collapse-trigger',
      onUpdate: (self) => {
        collapsePercent.value = self.progress * 100
        uncertaintyOpacity.value = 1 - self.progress * 0.8
      }
    }
  })

  // 保存 ScrollTrigger 清理函数
  cleanupFns.push(() => {
    const st = ScrollTrigger.getById('quantum-collapse-trigger')
    if (st) st.kill()
  })

  // 阶段1：副本层向中心收敛
  allLayers.forEach((layer, index) => {
    const delay = index * 0.02

    tl!.to(layer, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: 'power2.inOut'
    }, 0.2 + delay)
  })

  // 阶段2：副本层淡出
  tl.to(allLayers, {
    opacity: 0,
    filter: 'blur(0px)',
    duration: 0.4,
    stagger: 0.03,
    ease: 'power2.out'
  }, 0.5)

  // 阶段3：主层出现 + 量子闪变
  tl.to(mainLayers, {
    opacity: 1,
    filter: 'blur(0px)',
    duration: 0.2,
    ease: 'power2.out'
  }, 0.7)

  // 添加随机闪变
  for (let i = 0; i < 8; i++) {
    tl.to(chars, {
      opacity: () => Math.random() * 0.5 + 0.5,
      duration: 0.05,
      ease: 'none'
    }, 0.75 + i * 0.05)
  }

  // 阶段4：观测波释放
  tl.to(observeWave, {
    scale: 3,
    opacity: 0.8,
    duration: 0.3,
    ease: 'power2.out'
  }, 1.1)

  tl.to(observeWave, {
    scale: 4,
    opacity: 0,
    duration: 0.3,
    ease: 'power2.in'
  }, 1.2)

  // 阶段5：稳定态 + 边缘量子微光
  tl.call(() => {
    setupStableState()
    setupMouseInteraction()
  }, [], 1.3)

  return tl
}

// 稳定态呼吸效果
function setupStableState() {
  const chars = parentRef.value?.querySelectorAll('.quantum-main-230')
  if (!chars) return

  breathTimeline = gsap.to(chars, {
    '--glow-intensity': () => Math.random() * 0.5 + 0.5,
    textShadow: () => '0 0 10px rgba(100, 200, 255, var(--glow-intensity, 0.5))',
    duration: 2,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1
  })
}

// 鼠标交互 - 退相干扰动
function setupMouseInteraction() {
  const charWrappers = parentRef.value?.querySelectorAll('.quantum-char-wrapper-230')
  const allLayers = parentRef.value?.querySelectorAll('.quantum-layer-230')

  if (!charWrappers) return

  charWrappers.forEach((wrapper, index) => {
    wrapper.addEventListener('mouseenter', () => {
      // 重新产生随机副本偏移
      const newOffsets = {
        x: (Math.random() - 0.5) * 60,
        y: (Math.random() - 0.5) * 40
      }

      // 分离效果
      gsap.to(wrapper.querySelectorAll('.quantum-layer-230'), {
        x: () => newOffsets.x + (Math.random() - 0.5) * 30,
        y: () => newOffsets.y + (Math.random() - 0.5) * 20,
        opacity: 0.3,
        duration: 0.2,
        ease: 'power2.out',
        stagger: 0.02
      })

      // 快速再次坍缩
      setTimeout(() => {
        gsap.to(wrapper.querySelectorAll('.quantum-layer-230'), {
          x: 0,
          y: 0,
          opacity: 0,
          duration: 0.3,
          ease: 'elastic.out(1, 0.5)',
          stagger: 0.02
        })
      }, 200)
    })

    wrapper.addEventListener('mouseleave', () => {
      // 恢复
      gsap.to(wrapper.querySelectorAll('.quantum-layer-230'), {
        x: 'var(--offset-x)',
        y: 'var(--offset-y)',
        opacity: 'var(--layer-opacity)',
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)',
        stagger: 0.02
      })
    })
  })
}

// 初始化
onMounted(() => {
  if (!parentRef.value) return

  // 启动量子波动画
  startWaveAnimation()
  cleanupFns.push(() => {
    if (waveAnimationId !== null) {
      cancelAnimationFrame(waveAnimationId)
    }
  })

  // 创建坍缩动画
  createCollapseAnimation()
})

// 清理
onUnmounted(() => {
  // 清理 ScrollTrigger
  ScrollTrigger.getAll().forEach(st => {
    if (st.vars.id?.includes('quantum-collapse')) {
      st.kill()
    }
  })

  // 清理 Timeline
  if (tl) {
    tl.kill()
  }

  // 清理呼吸动画
  if (breathTimeline) {
    breathTimeline.kill()
  }

  if (fluctuationTimeline) {
    fluctuationTimeline.kill()
  }

  // 执行所有清理函数
  cleanupFns.forEach(fn => fn())
  cleanupFns = []
})
</script>

<style scoped lang="scss">
.quantum-collapse-230 {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(
    180deg,
    #050510 0%,
    #0a0a1a 30%,
    #0f0f25 60%,
    #050510 100%
  );
  overflow: hidden;
  font-family: 'JetBrains Mono', 'Courier New', monospace;
}

// 深空背景
.quantum-bg-230 {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.quantum-grid-230 {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(100, 150, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(100, 150, 255, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: grid-shift-230 20s linear infinite;
}

@keyframes grid-shift-230 {
  0% { transform: perspective(500px) rotateX(60deg) translateY(0); }
  100% { transform: perspective(500px) rotateX(60deg) translateY(50px); }
}

.quantum-noise-230 {
  position: absolute;
  inset: 0;
  opacity: 0.03;
  background: url('data:image/svg+xml,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noise)"/></svg>');
  animation: noise-shift-230 0.5s steps(10) infinite;
}

@keyframes noise-shift-230 {
  0% { transform: translate(0, 0); }
  100% { transform: translate(10px, 10px); }
}

// 量子波动画布
.quantum-wave-canvas-230 {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
}

// 观测波
.observe-wave-230 {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 300px;
  height: 300px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  border: 1px solid rgba(100, 200, 255, 0.3);
  box-shadow:
    0 0 30px rgba(100, 200, 255, 0.2),
    inset 0 0 30px rgba(100, 200, 255, 0.1);
  z-index: 5;
  pointer-events: none;
}

// 文字容器
.quantum-text-container-230 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 20px;
  z-index: 10;
}

.quantum-char-wrapper-230 {
  position: relative;
  width: 80px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

// 量子层
.quantum-layer-230 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  will-change: transform, opacity, filter;
}

.quantum-char-230 {
  font-size: clamp(48px, 8vw, 100px);
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.05em;
}

// 副本层样式
@for $i from 1 through 5 {
  .quantum-layer-#{$i}-230 {
    z-index: #{$i};
  }
}

// 主层
.quantum-main-230 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;

  .quantum-char-230 {
    color: #ffffff;
    text-shadow:
      0 0 10px rgba(100, 200, 255, 0.5),
      0 0 20px rgba(100, 200, 255, 0.3),
      0 0 30px rgba(100, 200, 255, 0.2);
  }
}

// 量子粒子
.quantum-particles-230 {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.quantum-particle-230 {
  position: absolute;
  width: 2px;
  height: 2px;
  background: rgba(100, 200, 255, 0.5);
  border-radius: 50%;
  animation: particle-quantum-230 4s ease-in-out infinite;

  @for $i from 1 through 40 {
    &:nth-child(#{$i}) {
      left: random(100) * 1%;
      top: random(100) * 1%;
      animation-delay: random(4) * 1s;
      animation-duration: (3 + random(3)) * 1s;
      opacity: random(50) * 1%;
    }
  }
}

@keyframes particle-quantum-230 {
  0%, 100% {
    transform: scale(1);
    opacity: 0.2;
  }
  50% {
    transform: scale(2);
    opacity: 0.8;
  }
}

// 状态指示器
.quantum-status-230 {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  z-index: 20;
}

.status-panel-230 {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px 20px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(100, 200, 255, 0.2);
  border-radius: 30px;
  backdrop-filter: blur(10px);
}

.status-label-230 {
  font-size: 10px;
  color: rgba(100, 200, 255, 0.7);
  letter-spacing: 3px;
  font-weight: 600;
}

.status-bar-230 {
  width: 120px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.status-fill-230 {
  height: 100%;
  background: linear-gradient(
    90deg,
    #64c8ff,
    #c864ff
  );
  transition: width 0.1s ease;
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(100, 200, 255, 0.5);
}

.status-value-230 {
  font-size: 12px;
  color: #64c8ff;
  font-family: 'Courier New', monospace;
  min-width: 40px;
  text-align: right;
}

.uncertainty-label-230 {
  font-size: 12px;
  color: rgba(200, 100, 255, 0.6);
  letter-spacing: 2px;
  transition: opacity 0.3s ease;
}

// 装饰元素
.quantum-decor-230 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 0;
}

.quantum-ring-230 {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 400px;
  height: 400px;
  transform: translate(-50%, -50%);
  border: 1px solid rgba(100, 200, 255, 0.1);
  border-radius: 50%;
  animation: ring-pulse-230 4s ease-in-out infinite;

  &.quantum-ring-2-230 {
    width: 600px;
    height: 600px;
    animation-delay: 1s;
    border-color: rgba(200, 100, 255, 0.08);
  }
}

@keyframes ring-pulse-230 {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.05);
    opacity: 0.6;
  }
}

// 响应式
@media (max-width: 768px) {
  .quantum-text-container-230 {
    gap: 10px;
  }

  .quantum-char-wrapper-230 {
    width: 50px;
    height: 80px;
  }

  .quantum-char-230 {
    font-size: clamp(28px, 7vw, 48px);
  }

  .quantum-status-230 {
    bottom: 20px;
  }

  .status-bar-230 {
    width: 80px;
  }
}
</style>
