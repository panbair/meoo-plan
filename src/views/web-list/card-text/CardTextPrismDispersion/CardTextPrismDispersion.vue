<template>
  <div ref="parentRef" class="prism-dispersion-228">
    <!-- 纯黑舞台背景 -->
    <div class="prism-bg-228"></div>

    <!-- 光晕画布 -->
    <canvas ref="glowCanvasRef" class="prism-glow-canvas-228"></canvas>

    <!-- 光谱粒子 -->
    <div class="prism-particles-228">
      <span
        v-for="i in 30"
        :key="i"
        class="prism-particle-228"
        :style="{ '--particle-color': particleColors[i % 3] }"
      ></span>
    </div>

    <!-- 主文字容器 -->
    <div class="prism-text-container-228">
      <div class="prism-text-wrapper-228">
        <!-- 红色层 -->
        <div ref="redLayerRef" class="prism-layer-228 prism-layer-red-228">
          <span class="prism-char-228">{{ displayText }}</span>
        </div>

        <!-- 绿色层 -->
        <div ref="greenLayerRef" class="prism-layer-228 prism-layer-green-228">
          <span class="prism-char-228">{{ displayText }}</span>
        </div>

        <!-- 蓝色层 -->
        <div ref="blueLayerRef" class="prism-layer-228 prism-layer-blue-228">
          <span class="prism-char-228">{{ displayText }}</span>
        </div>

        <!-- 白色最终层 -->
        <div ref="whiteLayerRef" class="prism-layer-228 prism-layer-white-228">
          <span class="prism-char-228">{{ displayText }}</span>
        </div>
      </div>
    </div>

    <!-- 环形眩光 -->
    <div ref="glowRingRef" class="prism-glow-ring-228"></div>

    <!-- 彩虹条纹 -->
    <div class="prism-rainbow-stripes-228">
      <span v-for="i in 12" :key="i" class="prism-stripe-228"></span>
    </div>

    <!-- 状态指示器 -->
    <div class="prism-status-228">
      <div class="status-bar-228">
        <span class="status-label-228">DISPERSION</span>
        <div class="status-track-228">
          <div class="status-fill-228" :style="{ width: dispersionPercent + '%' }"></div>
        </div>
        <span class="status-value-228">{{ Math.round(dispersionPercent) }}%</span>
      </div>
    </div>

    <!-- 棱镜装饰 -->
    <div class="prism-decor-228">
      <svg class="prism-icon-228" viewBox="0 0 100 100">
        <polygon points="50,10 90,90 10,90" fill="none" stroke="currentColor" stroke-width="2"/>
        <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" stroke-width="1" opacity="0.3"/>
      </svg>
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
const glowCanvasRef = ref<HTMLCanvasElement | null>(null)
const redLayerRef = ref<HTMLElement | null>(null)
const greenLayerRef = ref<HTMLElement | null>(null)
const blueLayerRef = ref<HTMLElement | null>(null)
const whiteLayerRef = ref<HTMLElement | null>(null)
const glowRingRef = ref<HTMLElement | null>(null)

// 数据
const displayText = 'PRISM'
const particleColors = ['#ff3366', '#33ff66', '#3366ff']
const dispersionPercent = ref(100)

// 动画状态
let tl: gsap.core.Timeline | null = null
let cleanupFns: (() => void)[] = []
let glowAnimationId: number | null = null
let particleTimelines: gsap.core.Tween[] = []

// 粒子数据
interface GlowParticle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
  alpha: number
  life: number
}

let particles: GlowParticle[] = []

// 彩虹条纹颜色
const rainbowColors = [
  '#ff0000', '#ff7700', '#ffff00', '#00ff00',
  '#00ffff', '#0077ff', '#8800ff', '#ff0088',
  '#ff3300', '#ffcc00', '#00ff66', '#6600ff'
]

// 初始化粒子
function initParticles(count: number, width: number, height: number) {
  particles = []
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2 + 1,
      color: particleColors[Math.floor(Math.random() * 3)],
      alpha: Math.random() * 0.5 + 0.2,
      life: Math.floor(Math.random() * 100) + 50
    })
  }
}

// 绘制光晕粒子
function drawGlowParticles(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.clearRect(0, 0, width, height)

  particles = particles.filter(p => {
    p.life--

    // 布朗运动
    p.vx += (Math.random() - 0.5) * 0.1
    p.vy += (Math.random() - 0.5) * 0.1

    // 阻尼
    p.vx *= 0.99
    p.vy *= 0.99

    p.x += p.vx
    p.y += p.vy

    // 边界检测
    if (p.x < 0 || p.x > width) p.vx *= -1
    if (p.y < 0 || p.y > height) p.vy *= -1

    if (p.life <= 0) {
      // 重生
      p.x = Math.random() * width
      p.y = Math.random() * height
      p.life = Math.floor(Math.random() * 100) + 50
      p.color = particleColors[Math.floor(Math.random() * 3)]
    }

    // 绘制
    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3)
    // 转换 hex 颜色为 rgba 格式
    const hexColor = p.color.replace('#', '')
    const r = parseInt(hexColor.substring(0, 2), 16)
    const g = parseInt(hexColor.substring(2, 4), 16)
    const b = parseInt(hexColor.substring(4, 6), 16)
    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${p.alpha})`)
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

    ctx.beginPath()
    ctx.fillStyle = gradient
    ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2)
    ctx.fill()

    return true
  })
}

// 开始光晕动画
function startGlowAnimation() {
  const canvas = glowCanvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const animate = () => {
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height

    if (particles.length === 0) {
      initParticles(50, canvas.width, canvas.height)
    }

    drawGlowParticles(ctx, canvas.width, canvas.height)
    glowAnimationId = requestAnimationFrame(animate)
  }

  animate()
}

// 创建彩虹条纹动画
function createRainbowStripesAnimation() {
  const stripes = document.querySelectorAll('.prism-stripe-228')
  stripes.forEach((stripe, index) => {
    const tl = gsap.timeline({
      repeat: -1,
      delay: index * 0.1
    })

    tl.fromTo(stripe,
      {
        scaleX: 0,
        opacity: 0
      },
      {
        scaleX: 1,
        opacity: 0.8,
        duration: 0.3,
        ease: 'power2.out'
      }
    )
    .to(stripe, {
      opacity: 0,
      scaleX: 2,
      duration: 0.5,
      ease: 'power2.in'
    })

    particleTimelines.push(tl as unknown as gsap.core.Tween)
  })
}

// 创建主入场动画
function createEntryAnimation() {
  if (!parentRef.value || !redLayerRef.value || !greenLayerRef.value ||
      !blueLayerRef.value || !whiteLayerRef.value) return

  const parent = parentRef.value
  const redLayer = redLayerRef.value
  const greenLayer = greenLayerRef.value
  const blueLayer = blueLayerRef.value
  const whiteLayer = whiteLayerRef.value
  const glowRing = glowRingRef.value

  // 初始状态 - 三色层大幅偏移
  gsap.set(redLayer, {
    x: -400,
    opacity: 0.8,
    filter: 'blur(8px)'
  })

  gsap.set(greenLayer, {
    x: 0,
    opacity: 0,
    scale: 0.8
  })

  gsap.set(blueLayer, {
    x: 400,
    opacity: 0.8,
    filter: 'blur(8px)'
  })

  gsap.set(whiteLayer, {
    opacity: 0,
    scale: 0.5
  })

  gsap.set(glowRing, {
    scale: 0,
    opacity: 0
  })

  tl = gsap.timeline({
    scrollTrigger: {
      trigger: parent,
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1.5,
      onUpdate: (self) => {
        dispersionPercent.value = 100 - self.progress * 100
      }
    }
  })

  // 保存 ScrollTrigger 清理函数
  const scrollTriggerInstance = ScrollTrigger.getById('prism-dispersion-trigger')
  if (scrollTriggerInstance) {
    cleanupFns.push(() => scrollTriggerInstance.kill())
  }

  // 阶段1：三色层入场
  tl.to(redLayer, {
    x: -200,
    opacity: 0.9,
    filter: 'blur(4px)',
    duration: 0.3,
    ease: 'power2.out'
  }, 0)

  tl.to(blueLayer, {
    x: 200,
    opacity: 0.9,
    filter: 'blur(4px)',
    duration: 0.3,
    ease: 'power2.out'
  }, 0)

  // 阶段2：绿层先行归位
  tl.to(greenLayer, {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: 'blur(2px)',
    duration: 0.4,
    ease: 'power2.inOut'
  }, 0.3)

  // 阶段3：彩虹条纹爆发
  tl.call(() => {
    createRainbowStripesAnimation()
  }, [], 0.5)

  // 阶段4：红蓝层滑入归位
  tl.to(redLayer, {
    x: -50,
    opacity: 0.95,
    filter: 'blur(1px)',
    duration: 0.4,
    ease: 'power2.out'
  }, 0.6)

  tl.to(blueLayer, {
    x: 50,
    opacity: 0.95,
    filter: 'blur(1px)',
    duration: 0.4,
    ease: 'power2.out'
  }, 0.65)

  // 阶段5：环形眩光爆发
  tl.to(glowRing, {
    scale: 3,
    opacity: 1,
    duration: 0.3,
    ease: 'power2.out'
  }, 0.9)

  tl.to(glowRing, {
    scale: 4,
    opacity: 0,
    duration: 0.4,
    ease: 'power2.in'
  }, 1.0)

  // 阶段6：白色层最终凝合
  tl.to(whiteLayer, {
    opacity: 1,
    scale: 1,
    duration: 0.3,
    ease: 'power2.out'
  }, 1.0)

  // 阶段7：三色层淡出到边缘
  tl.to([redLayer, blueLayer], {
    opacity: 0.3,
    duration: 0.3,
    ease: 'power2.out'
  }, 1.1)

  // 阶段8：最终纯白带彩色镶边
  tl.to(greenLayer, {
    opacity: 0.1,
    duration: 0.2
  }, 1.2)

  return tl
}

// 鼠标交互 - 局部色散效果
function setupMouseInteraction() {
  const whiteLayer = whiteLayerRef.value
  const redLayer = redLayerRef.value
  const blueLayer = blueLayerRef.value

  if (!whiteLayer || !redLayer || !blueLayer) return

  const handleMouseMove = (e: MouseEvent) => {
    const rect = whiteLayer.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // 计算鼠标相对于中心的偏移
    const offsetX = (x - centerX) / centerX
    const offsetY = (y - centerY) / centerY

    // 应用局部色散效果
    gsap.to(redLayer, {
      x: -50 + offsetX * -100,
      filter: `blur(${1 + Math.abs(offsetX) * 3}px)`,
      duration: 0.2,
      ease: 'power2.out'
    })

    gsap.to(blueLayer, {
      x: 50 + offsetX * 100,
      filter: `blur(${1 + Math.abs(offsetX) * 3}px)`,
      duration: 0.2,
      ease: 'power2.out'
    })
  }

  const handleMouseLeave = () => {
    // 弹性回归
    gsap.to(redLayer, {
      x: -50,
      filter: 'blur(0px)',
      duration: 0.8,
      ease: 'elastic.out(1, 0.5)'
    })

    gsap.to(blueLayer, {
      x: 50,
      filter: 'blur(0px)',
      duration: 0.8,
      ease: 'elastic.out(1, 0.5)'
    })
  }

  whiteLayer.addEventListener('mousemove', handleMouseMove)
  whiteLayer.addEventListener('mouseleave', handleMouseLeave)

  cleanupFns.push(() => {
    whiteLayer.removeEventListener('mousemove', handleMouseMove)
    whiteLayer.removeEventListener('mouseleave', handleMouseLeave)
  })
}

// 初始化
onMounted(() => {
  if (!parentRef.value) return

  // 启动光晕粒子动画
  startGlowAnimation()
  cleanupFns.push(() => {
    if (glowAnimationId !== null) {
      cancelAnimationFrame(glowAnimationId)
    }
  })

  // 创建入场动画
  createEntryAnimation()

  // 设置鼠标交互
  setupMouseInteraction()

  // 粒子浮动动画
  const particleEls = document.querySelectorAll('.prism-particle-228')
  particleEls.forEach((particle, index) => {
    const tl = gsap.timeline({
      repeat: -1,
      delay: index * 0.1
    })

    tl.to(particle, {
      y: 'random(-30, 30)',
      x: 'random(-20, 20)',
      opacity: 'random(0.2, 0.8)',
      duration: 'random(2, 4)',
      ease: 'sine.inOut'
    })
    .to(particle, {
      y: 'random(-30, 30)',
      x: 'random(-20, 20)',
      opacity: 'random(0.2, 0.8)',
      duration: 'random(2, 4)',
      ease: 'sine.inOut'
    })

    particleTimelines.push(tl)
  })
})

// 清理
onUnmounted(() => {
  // 清理 ScrollTrigger
  ScrollTrigger.getAll().forEach(st => {
    if (st.vars.id?.includes('prism-dispersion')) {
      st.kill()
    }
  })

  // 清理 Timeline
  if (tl) {
    tl.kill()
  }

  // 清理粒子动画
  particleTimelines.forEach(t => t.kill())

  // 执行所有清理函数
  cleanupFns.forEach(fn => fn())
  cleanupFns = []
})
</script>

<style scoped lang="scss">
.prism-dispersion-228 {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: #000000;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Montserrat', 'Arial Black', sans-serif;
}

// 纯黑背景
.prism-bg-228 {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at center,
    #0a0a0a 0%,
    #000000 70%,
    #000000 100%
  );
}

// 光晕画布
.prism-glow-canvas-228 {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
}

// 文字容器
.prism-text-container-228 {
  position: relative;
  z-index: 10;
}

.prism-text-wrapper-228 {
  position: relative;
  width: 100%;
  height: 100%;
}

.prism-layer-228 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  will-change: transform, filter, opacity;
}

.prism-char-228 {
  font-size: clamp(60px, 15vw, 180px);
  font-weight: 900;
  letter-spacing: 0.2em;
  white-space: nowrap;
  display: block;
}

// 红色层
.prism-layer-red-228 {
  color: #ff3366;
  mix-blend-mode: screen;
  text-shadow:
    0 0 20px #ff3366,
    0 0 40px #ff3366,
    0 0 80px #ff0000;
}

// 绿色层
.prism-layer-green-228 {
  color: #33ff66;
  mix-blend-mode: screen;
  text-shadow:
    0 0 20px #33ff66,
    0 0 40px #33ff66,
    0 0 80px #00ff00;
}

// 蓝色层
.prism-layer-blue-228 {
  color: #3366ff;
  mix-blend-mode: screen;
  text-shadow:
    0 0 20px #3366ff,
    0 0 40px #3366ff,
    0 0 80px #0000ff;
}

// 白色层
.prism-layer-white-228 {
  color: #ffffff;
  text-shadow:
    0 0 10px #ffffff,
    0 0 20px #ffffff,
    0 0 30px rgba(255, 255, 255, 0.5);

  &::before {
    content: '';
    position: absolute;
    inset: -2px;
    background: linear-gradient(
      90deg,
      #ff3366, #33ff66, #3366ff, #ff3366
    );
    background-size: 300% 100%;
    animation: edge-rainbow-228 3s linear infinite;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    z-index: -1;
    filter: blur(2px);
    opacity: 0.3;
  }
}

@keyframes edge-rainbow-228 {
  0% { background-position: 0% 50%; }
  100% { background-position: 300% 50%; }
}

// 环形眩光
.prism-glow-ring-228 {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px;
  height: 200px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.8) 0%,
    rgba(255, 200, 100, 0.4) 30%,
    rgba(100, 200, 255, 0.2) 60%,
    transparent 100%
  );
  box-shadow:
    0 0 50px rgba(255, 100, 100, 0.5),
    0 0 100px rgba(100, 255, 100, 0.3),
    0 0 150px rgba(100, 100, 255, 0.2);
  z-index: 5;
  pointer-events: none;
}

// 彩虹颜色定义
$rainbowColors: (
  '#ff0000', '#ff7700', '#ffff00', '#00ff00',
  '#00ffff', '#0077ff', '#8800ff', '#ff0088',
  '#ff3300', '#ffcc00', '#00ff66', '#6600ff'
);

// 彩虹条纹
.prism-rainbow-stripes-228 {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 600px;
  height: 600px;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 8;
  opacity: 0;
}

.prism-stripe-228 {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 300px;
  transform-origin: center center;
  border-radius: 2px;

  @for $i from 1 through 12 {
    &:nth-child(#{$i}) {
      background: #{nth($rainbowColors, $i)};
      transform: translate(-50%, -50%) rotate(#{$i * 15}deg);
      box-shadow: 0 0 10px #{nth($rainbowColors, $i)};
    }
  }
}

// 光谱粒子
.prism-particles-228 {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.prism-particle-228 {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--particle-color);
  box-shadow: 0 0 10px var(--particle-color);
  animation: particle-float-228 4s ease-in-out infinite;

  @for $i from 1 through 30 {
    &:nth-child(#{$i}) {
      left: random(100) * 1%;
      top: random(100) * 1%;
      animation-delay: random(4) * 1s;
      animation-duration: (3 + random(3)) * 1s;
    }
  }
}

@keyframes particle-float-228 {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translate(10px, -20px) scale(1.5);
    opacity: 0.8;
  }
}

// 状态指示器
.prism-status-228 {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
}

.status-bar-228 {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 30px;
  backdrop-filter: blur(10px);
}

.status-label-228 {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 3px;
  font-weight: 600;
}

.status-track-228 {
  width: 150px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.status-fill-228 {
  height: 100%;
  background: linear-gradient(
    90deg,
    #ff3366,
    #33ff66,
    #3366ff
  );
  transition: width 0.1s ease;
  border-radius: 2px;
}

.status-value-228 {
  font-size: 12px;
  color: #ffffff;
  font-family: 'Courier New', monospace;
  min-width: 40px;
  text-align: right;
}

// 棱镜装饰
.prism-decor-228 {
  position: absolute;
  top: 30px;
  right: 30px;
  z-index: 20;
}

.prism-icon-228 {
  width: 50px;
  height: 50px;
  color: rgba(255, 255, 255, 0.3);
  animation: prism-rotate-228 20s linear infinite;
}

@keyframes prism-rotate-228 {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

// 响应式
@media (max-width: 768px) {
  .prism-char-228 {
    letter-spacing: 0.1em;
  }

  .prism-layer-red-228,
  .prism-layer-blue-228 {
    filter: blur(6px);
  }

  .prism-status-228 {
    bottom: 20px;
  }

  .status-track-228 {
    width: 100px;
  }

  .prism-decor-228 {
    top: 20px;
    right: 20px;
  }

  .prism-icon-228 {
    width: 40px;
    height: 40px;
  }
}
</style>
