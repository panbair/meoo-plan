<template>
  <div ref="parentRef" class="moonlight-embroider-229">
    <!-- 深色夜空织料背景 -->
    <div class="embroider-bg-229">
      <div class="fabric-texture-229"></div>
      <div class="starlight-layer-229"></div>
    </div>

    <!-- 星尘粒子画布 -->
    <canvas ref="particleCanvasRef" class="embroider-particle-canvas-229"></canvas>

    <!-- 刺绣文字 SVG -->
    <div class="embroider-text-container-229">
      <svg
        ref="textSvgRef"
        class="embroider-svg-229"
        viewBox="0 0 600 200"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <!-- 月光渐变 -->
          <linearGradient id="moonlightGradient-229" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#e8f4fc" />
            <stop offset="50%" stop-color="#b8d4e8" />
            <stop offset="100%" stop-color="#7eb8da" />
          </linearGradient>

          <!-- 丝线光晕 -->
          <filter id="threadGlow-229" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <!-- 星尘滤镜 -->
          <filter id="starDust-229" x="-100%" y="-100%" width="300%" height="300%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
          </filter>
        </defs>

        <!-- 文字路径 -->
        <path
          ref="textPathRef"
          id="embroiderPath-229"
          :d="textPath"
          fill="none"
          stroke="transparent"
          stroke-width="3"
        />

        <!-- 丝线轨迹 -->
        <path
          ref="threadPathRef"
          :d="textPath"
          fill="none"
          stroke="url(#moonlightGradient-229)"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          filter="url(#threadGlow-229)"
          class="embroider-thread-229"
        />

        <!-- 针尖光点 -->
        <circle
          ref="needleRef"
          r="4"
          fill="#ffffff"
          filter="url(#threadGlow-229)"
          class="embroider-needle-229"
        />

        <!-- 刺绣节点闪光 -->
        <g ref="nodesGroupRef" class="embroider-nodes-229"></g>
      </svg>

      <!-- 最终文字显示 -->
      <div class="embroider-final-text-229" ref="finalTextRef">
        <span
          v-for="(char, index) in displayText.split('')"
          :key="index"
          class="embroider-char-229"
          :data-index="index"
        >{{ char }}</span>
      </div>
    </div>

    <!-- 织物涟漪效果 -->
    <div class="embroider-ripples-229">
      <div v-for="i in 5" :key="i" class="embroider-ripple-229"></div>
    </div>

    <!-- 状态指示器 -->
    <div class="embroider-status-229">
      <div class="status-progress-229">
        <span class="status-label-229">EMBROIDERY</span>
        <div class="status-track-229">
          <div class="status-fill-229" :style="{ width: progressPercent + '%' }"></div>
        </div>
        <span class="status-value-229">{{ Math.round(progressPercent) }}%</span>
      </div>
    </div>

    <!-- 装饰月亮 -->
    <div class="embroider-moon-229">
      <svg viewBox="0 0 100 100">
        <defs>
          <radialGradient id="moonGlow-229" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9" />
            <stop offset="70%" stop-color="#e8f4fc" stop-opacity="0.3" />
            <stop offset="100%" stop-color="#7eb8da" stop-opacity="0" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="40" fill="url(#moonGlow-229)" />
        <circle cx="50" cy="50" r="25" fill="#f5f9fc" opacity="0.8" />
        <circle cx="42" cy="45" r="3" fill="#d4e4ed" opacity="0.5" />
        <circle cx="58" cy="55" r="2" fill="#d4e4ed" opacity="0.4" />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin)

// Refs
const parentRef = ref<HTMLElement | null>(null)
const particleCanvasRef = ref<HTMLCanvasElement | null>(null)
const textSvgRef = ref<HTMLElement | null>(null)
const textPathRef = ref<SVGPathElement | null>(null)
const threadPathRef = ref<SVGPathElement | null>(null)
const needleRef = ref<SVGCircleElement | null>(null)
const nodesGroupRef = ref<SVGGElement | null>(null)
const finalTextRef = ref<HTMLElement | null>(null)

// 数据
const displayText = 'MOONLIGHT'
const progressPercent = ref(0)

// 动画状态
let tl: gsap.core.Timeline | null = null
let cleanupFns: (() => void)[] = []
let particleAnimationId: number | null = null
let breathTimeline: gsap.core.Tween | null = null

// 星尘粒子
interface StardustParticle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  life: number
  maxLife: number
}

let stardustParticles: StardustParticle[] = []

// 计算文字路径
const textPath = computed(() => {
  // 使用简单的波浪线作为文字替代路径
  const width = 600
  const height = 200
  const centerY = height / 2
  const amplitude = 30

  let path = `M 50 ${centerY}`

  // 创建文字形状的波浪路径
  for (let i = 1; i <= 7; i++) {
    const x = 50 + (i * (width - 100) / 7)
    const y = centerY + Math.sin(i * 0.8) * amplitude
    path += ` Q ${x - 30} ${centerY - amplitude} ${x} ${y}`
  }

  return path
})

// 生成星尘粒子
function createStardust(x: number, y: number, count: number = 10) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2
    const speed = Math.random() * 3 + 1

    stardustParticles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1, // 轻微上升
      size: Math.random() * 2 + 1,
      alpha: 1,
      life: Math.floor(Math.random() * 30) + 20,
      maxLife: 50
    })
  }
}

// 绘制星尘
function drawStardust(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.clearRect(0, 0, width, height)

  stardustParticles = stardustParticles.filter(p => {
    p.life--

    // 重力与阻力
    p.vy += 0.05
    p.vx *= 0.98
    p.vy *= 0.98

    p.x += p.vx
    p.y += p.vy

    p.alpha = p.life / p.maxLife

    if (p.life <= 0) return false

    // 绘制星尘
    ctx.beginPath()
    ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`
    ctx.shadowBlur = 10
    ctx.shadowColor = '#e8f4fc'
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    ctx.fill()

    return true
  })
}

// 开始星尘动画
function startStardustAnimation() {
  const canvas = particleCanvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const animate = () => {
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height

    drawStardust(ctx, canvas.width, canvas.height)
    particleAnimationId = requestAnimationFrame(animate)
  }

  animate()
}

// 创建节点闪光
function createNodeSparkles() {
  if (!nodesGroupRef.value) return

  const path = textPathRef.value
  if (!path) return

  // 获取路径上的点
  const pathLength = path.getTotalLength()
  const nodeCount = 8

  for (let i = 0; i < nodeCount; i++) {
    const point = path.getPointAtLength((pathLength / nodeCount) * i + pathLength / (nodeCount * 2))

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    circle.setAttribute('cx', point.x.toString())
    circle.setAttribute('cy', point.y.toString())
    circle.setAttribute('r', '3')
    circle.setAttribute('fill', '#ffffff')
    circle.classList.add('embroider-node-229')

    nodesGroupRef.value.appendChild(circle)
  }
}

// 主入场动画
function createEntryAnimation() {
  if (!parentRef.value || !needleRef.value || !threadPathRef.value ||
      !finalTextRef.value) return

  const needle = needleRef.value
  const thread = threadPathRef.value
  const finalText = finalTextRef.value
  const chars = finalText.querySelectorAll('.embroider-char-229')
  const nodes = nodesGroupRef.value?.querySelectorAll('.embroider-node-229')

  // 初始状态
  gsap.set(needle, {
    x: 0,
    y: 0,
    scale: 0,
    opacity: 0
  })

  gsap.set(thread, {
    strokeDashoffset: 1000,
    strokeDasharray: 1000
  })

  gsap.set(chars, {
    opacity: 0,
    filter: 'blur(10px)'
  })

  gsap.set(nodes, {
    scale: 0,
    opacity: 0
  })

  tl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1.5,
      id: 'moonlight-embroider-trigger',
      onUpdate: (self) => {
        progressPercent.value = self.progress * 100
      }
    }
  })

  // 保存 ScrollTrigger 清理函数
  cleanupFns.push(() => {
    const st = ScrollTrigger.getById('moonlight-embroider-trigger')
    if (st) st.kill()
  })

  // 阶段1：针尖出现
  tl.to(needle, {
    scale: 1,
    opacity: 1,
    duration: 0.3,
    ease: 'back.out(2)'
  }, 0)

  // 阶段2：针尖沿路径移动 + 丝线绘制
  tl.to(needle, {
    motionPath: {
      path: '#embroiderPath-229',
      align: '#embroiderPath-229',
      alignOrigin: [0.5, 0.5]
    },
    duration: 1.2,
    ease: 'none',
    onUpdate: function() {
      // 在移动过程中创建星尘
      if (Math.random() > 0.7) {
        const needleX = needle.getAttribute('x') || '0'
        const needleY = needle.getAttribute('y') || '0'
        const canvas = particleCanvasRef.value
        if (canvas) {
          const rect = canvas.getBoundingClientRect()
          const svgRect = textSvgRef.value?.getBoundingClientRect()
          if (svgRect) {
            createStardust(
              rect.width / 2 + parseFloat(needleX),
              rect.height / 2 + parseFloat(needleY),
              3
            )
          }
        }
      }
    }
  }, 0.2)

  tl.to(thread, {
    strokeDashoffset: 0,
    duration: 1.2,
    ease: 'none'
  }, 0.2)

  // 阶段3：文字浮现
  tl.to(chars, {
    opacity: 1,
    filter: 'blur(0px)',
    duration: 0.4,
    stagger: 0.05,
    ease: 'power2.out'
  }, 1.0)

  // 阶段4：节点闪光
  if (nodes) {
    tl.to(nodes, {
      scale: 1,
      opacity: 1,
      duration: 0.3,
      stagger: 0.05,
      ease: 'back.out(2)'
    }, 1.2)
  }

  // 阶段5：织物呼吸效果
  tl.call(() => {
    setupBreathingEffect()
    setupMouseInteraction()
  }, [], 1.4)

  return tl
}

// 织物呼吸效果
function setupBreathingEffect() {
  const chars = finalTextRef.value?.querySelectorAll('.embroider-char-229')
  if (!chars) return

  breathTimeline = gsap.to(chars, {
    opacity: (i) => 0.7 + Math.sin(i * 0.5) * 0.3,
    duration: 3,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1
  })
}

// 鼠标交互 - 丝线微颤
function setupMouseInteraction() {
  const chars = finalTextRef.value?.querySelectorAll('.embroider-char-229')
  if (!chars) return

  chars.forEach((char, index) => {
    char.addEventListener('mouseenter', () => {
      gsap.to(char, {
        y: -5,
        duration: 0.3,
        ease: 'power2.out'
      })
    })

    char.addEventListener('mouseleave', () => {
      gsap.to(char, {
        y: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)'
      })
    })

    char.addEventListener('mousemove', (e: MouseEvent) => {
      const rect = char.getBoundingClientRect()
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height

      gsap.to(char, {
        skewX: x * 10,
        skewY: y * 5,
        duration: 0.2,
        ease: 'power2.out'
      })
    })
  })
}

// 初始化
onMounted(() => {
  if (!parentRef.value) return

  // 启动星尘动画
  startStardustAnimation()
  cleanupFns.push(() => {
    if (particleAnimationId !== null) {
      cancelAnimationFrame(particleAnimationId)
    }
  })

  // 创建节点闪光元素
  createNodeSparkles()

  // 创建入场动画
  createEntryAnimation()
})

// 清理
onUnmounted(() => {
  // 清理 ScrollTrigger
  ScrollTrigger.getAll().forEach(st => {
    if (st.vars.id?.includes('moonlight-embroider')) {
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

  // 执行所有清理函数
  cleanupFns.forEach(fn => fn())
  cleanupFns = []
})
</script>

<style scoped lang="scss">
.moonlight-embroider-229 {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(
    180deg,
    #0a0f1a 0%,
    #0d1525 30%,
    #111c30 60%,
    #0a0f1a 100%
  );
  overflow: hidden;
  font-family: 'Cormorant Garamond', 'Georgia', serif;
}

// 深色夜空织料背景
.embroider-bg-229 {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.fabric-texture-229 {
  position: absolute;
  inset: 0;
  background-image:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(255, 255, 255, 0.01) 2px,
      rgba(255, 255, 255, 0.01) 4px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 2px,
      rgba(255, 255, 255, 0.01) 2px,
      rgba(255, 255, 255, 0.01) 4px
    );
  animation: fabric-shift-229 20s linear infinite;
}

@keyframes fabric-shift-229 {
  0% { background-position: 0 0; }
  100% { background-position: 100px 100px; }
}

.starlight-layer-229 {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at 30% 20%,
    rgba(126, 184, 218, 0.05) 0%,
    transparent 50%
  );
  animation: starlight-pulse-229 8s ease-in-out infinite;
}

@keyframes starlight-pulse-229 {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

// 星尘粒子画布
.embroider-particle-canvas-229 {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 5;
}

// 刺绣文字容器
.embroider-text-container-229 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}

.embroider-svg-229 {
  width: clamp(400px, 60vw, 800px);
  height: auto;
  overflow: visible;
}

.embroider-thread-229 {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
}

.embroider-needle-229 {
  opacity: 0;
}

.embroider-node-229 {
  opacity: 0;
}

// 最终文字显示
.embroider-final-text-229 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 10px;
  white-space: nowrap;
}

.embroider-char-229 {
  font-size: clamp(48px, 8vw, 100px);
  font-weight: 400;
  color: #e8f4fc;
  text-shadow:
    0 0 10px rgba(232, 244, 252, 0.5),
    0 0 20px rgba(126, 184, 218, 0.3),
    0 0 30px rgba(126, 184, 218, 0.2);
  letter-spacing: 0.15em;
  cursor: pointer;
  transition: text-shadow 0.3s ease;
}

// 织物涟漪效果
.embroider-ripples-229 {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 3;
}

.embroider-ripple-229 {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100px;
  height: 100px;
  border: 1px solid rgba(232, 244, 252, 0.1);
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  opacity: 0;
  animation: ripple-expand-229 8s ease-out infinite;

  @for $i from 1 through 5 {
    &:nth-child(#{$i}) {
      animation-delay: #{$i * 1.6}s;
    }
  }
}

@keyframes ripple-expand-229 {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0.3;
  }
  100% {
    transform: translate(-50%, -50%) scale(20);
    opacity: 0;
  }
}

// 状态指示器
.embroider-status-229 {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
}

.status-progress-229 {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px 20px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(232, 244, 252, 0.1);
  border-radius: 30px;
  backdrop-filter: blur(10px);
}

.status-label-229 {
  font-size: 10px;
  color: rgba(232, 244, 252, 0.6);
  letter-spacing: 3px;
  font-weight: 600;
}

.status-track-229 {
  width: 120px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.status-fill-229 {
  height: 100%;
  background: linear-gradient(
    90deg,
    #e8f4fc,
    #7eb8da
  );
  transition: width 0.1s ease;
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(232, 244, 252, 0.5);
}

.status-value-229 {
  font-size: 12px;
  color: #e8f4fc;
  font-family: 'Courier New', monospace;
  min-width: 40px;
  text-align: right;
}

// 装饰月亮
.embroider-moon-229 {
  position: absolute;
  top: 40px;
  right: 60px;
  width: 80px;
  height: 80px;
  opacity: 0.6;
  animation: moon-glow-229 6s ease-in-out infinite;
  z-index: 15;

  svg {
    width: 100%;
    height: 100%;
  }
}

@keyframes moon-glow-229 {
  0%, 100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.05);
  }
}

// 响应式
@media (max-width: 768px) {
  .embroider-final-text-229 {
    gap: 5px;
  }

  .embroider-char-229 {
    font-size: clamp(32px, 8vw, 60px);
  }

  .embroider-moon-229 {
    top: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
  }

  .embroider-status-229 {
    bottom: 20px;
  }

  .status-track-229 {
    width: 80px;
  }
}
</style>
