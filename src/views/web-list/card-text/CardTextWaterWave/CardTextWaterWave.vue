<template>
  <div
    ref="parentRef"
    class="water-wave-section-238"
    @mousemove="handleMouseMove"
    @click="handleClick"
  >
    <!-- 水面背景 -->
    <div class="water-bg-238">
      <!-- 波浪层 -->
      <div class="wave-layer-238 wave-1-238"></div>
      <div class="wave-layer-238 wave-2-238"></div>
      <div class="wave-layer-238 wave-3-238"></div>
      
      <!-- 水面折射光 -->
      <div class="light-refraction-238"></div>
      
      <!-- 涟漪容器 -->
      <div class="ripple-container-238" ref="rippleContainerRef"></div>
    </div>

    <!-- 字符容器 -->
    <div class="char-container-238" ref="charContainerRef">
      <span
        v-for="(item, index) in charData"
        :key="item.key"
        :ref="el => setCharRef(el as HTMLElement, index)"
        class="char-item-238"
        :data-index="index"
      >{{ item.char }}</span>
    </div>

    <!-- 副标题 -->
    <p class="subtitle-238" ref="subtitleRef">{{ subtitle }}</p>

    <!-- 水纹装饰 -->
    <div class="water-decor-238">
      <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
        <path
          v-for="i in 72"
          :key="i"
          :d="`M ${i * 20} 100 Q ${i * 20 + 10} ${50 + Math.sin(i) * 20} ${i * 20 + 20} 100`"
          fill="none"
          stroke="rgba(120, 180, 200, 0.15)"
          stroke-width="1.5"
        />
      </svg>
    </div>

    <!-- 粒子画布 -->
    <canvas ref="particleCanvasRef" class="particle-canvas-238"></canvas>

    <!-- 进度条 -->
    <div class="progress-238" :style="{ width: progress + '%' }"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Props
interface Props {
  title?: string
  subtitle?: string
  waveIntensity?: number
  fontSize?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '水面文字',
  subtitle: '浅蓝水底 · 油墨漂浮',
  waveIntensity: 1,
  fontSize: 'clamp(2rem, 6vw, 4rem)'
})

// Refs
const parentRef = ref<HTMLElement | null>(null)
const charContainerRef = ref<HTMLElement | null>(null)
const rippleContainerRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const particleCanvasRef = ref<HTMLCanvasElement | null>(null)

const charRefs = ref<Map<number, HTMLElement>>(new Map())

// 状态
const progress = ref(0)

// 字符数据
const charData = computed(() => {
  return props.title.split('').map((char, index) => ({
    char,
    index,
    key: `char-${index}`
  }))
})

// 字符物理数据
interface CharPhysics {
  baseX: number
  baseY: number
  offsetX: number
  offsetY: number
  rotation: number
  velocityX: number
  velocityY: number
  phase: number
  wavePhase: number
}

const charPhysicsMap = new Map<number, CharPhysics>()

// 清理函数
type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []
let ctx: gsap.Context | null = null
let scrollTriggerInstance: ScrollTrigger | null = null
let animationFrameId: number | null = null
let physicsAnimationId: number | null = null

// 设置字符 ref
function setCharRef(el: HTMLElement | null, index: number) {
  if (el) {
    charRefs.value.set(index, el)
  }
}

// 初始化字符物理属性
function initCharPhysics() {
  const chars = Array.from(charRefs.value.values())
  
  chars.forEach((char, index) => {
    const rect = char.getBoundingClientRect()
    const containerRect = charContainerRef.value?.getBoundingClientRect()
    
    if (!containerRect) return
    
    charPhysicsMap.set(index, {
      baseX: rect.left - containerRect.left + rect.width / 2,
      baseY: rect.top - containerRect.top + rect.height / 2,
      offsetX: 0,
      offsetY: 0,
      rotation: 0,
      velocityX: 0,
      velocityY: 0,
      phase: Math.random() * Math.PI * 2,
      wavePhase: Math.random() * Math.PI * 2
    })
  })
}

// 涟漪效果
function createRipple(x: number, y: number) {
  if (!rippleContainerRef.value) return
  
  for (let i = 0; i < 4; i++) {
    const ripple = document.createElement('div')
    ripple.className = 'ripple-238'
    ripple.style.left = x + 'px'
    ripple.style.top = y + 'px'
    rippleContainerRef.value.appendChild(ripple)
    
    gsap.to(ripple, {
      scale: 0.5,
      opacity: 0,
      duration: 1.5,
      delay: i * 0.1,
      ease: 'power2.out',
      onComplete: () => ripple.remove()
    })
  }
}

// 鼠标移动处理
function handleMouseMove(e: MouseEvent) {
  if (!parentRef.value) return
  
  const rect = parentRef.value.getBoundingClientRect()
  const mouseX = e.clientX - rect.left
  const mouseY = e.clientY - rect.top
  
  // 创建涟漪
  if (Math.random() > 0.7) {
    createRipple(mouseX, mouseY)
  }
  
  // 推开字符
  charPhysicsMap.forEach((physics, index) => {
    const el = charRefs.value.get(index)
    if (!el) return
    
    const charX = physics.baseX + physics.offsetX
    const charY = physics.baseY + physics.offsetY
    const dx = mouseX - charX
    const dy = mouseY - charY
    const dist = Math.sqrt(dx * dx + dy * dy)
    
    if (dist < 120) {
      const force = (120 - dist) / 120 * 15 * props.waveIntensity
      const angle = Math.atan2(dy, dx)
      
      gsap.to(physics, {
        offsetX: physics.offsetX - Math.cos(angle) * force,
        offsetY: physics.offsetY - Math.sin(angle) * force * 0.5,
        duration: 0.3,
        ease: 'power2.out'
      })
      
      // 恢复
      gsap.to(physics, {
        offsetX: 0,
        offsetY: 0,
        duration: 1.5,
        delay: 0.3,
        ease: 'elastic.out(1, 0.5)'
      })
    }
  })
}

// 点击处理
function handleClick(e: MouseEvent) {
  if (!parentRef.value) return
  
  const rect = parentRef.value.getBoundingClientRect()
  const mouseX = e.clientX - rect.left
  const mouseY = e.clientY - rect.top
  
  // 大涟漪
  createRipple(mouseX, mouseY)
  setTimeout(() => createRipple(mouseX, mouseY), 100)
  setTimeout(() => createRipple(mouseX, mouseY), 200)
  
  // 推开所有字符
  charPhysicsMap.forEach((physics, index) => {
    const el = charRefs.value.get(index)
    if (!el) return
    
    const charX = physics.baseX + physics.offsetX
    const charY = physics.baseY + physics.offsetY
    const dx = mouseX - charX
    const dy = mouseY - charY
    const dist = Math.sqrt(dx * dx + dy * dy)
    
    if (dist < 300) {
      const force = (300 - dist) / 300 * 30 * props.waveIntensity
      const angle = Math.atan2(dy, dx)
      
      gsap.to(physics, {
        offsetX: -Math.cos(angle) * force,
        offsetY: -Math.sin(angle) * force * 0.7,
        rotation: (Math.random() - 0.5) * 20,
        duration: 0.5,
        ease: 'power2.out'
      })
      
      // 恢复
      gsap.to(physics, {
        offsetX: 0,
        offsetY: 0,
        rotation: 0,
        duration: 2,
        delay: 0.5,
        ease: 'elastic.out(1, 0.3)'
      })
    }
  })
}

// 物理动画循环
function animatePhysics() {
  const time = Date.now() * 0.001
  
  charPhysicsMap.forEach((physics, index) => {
    const el = charRefs.value.get(index)
    if (!el) return
    
    // 水波起伏
    const waveY = Math.sin(time * 1.5 + physics.wavePhase) * 8 * props.waveIntensity
    const waveX = Math.cos(time * 0.8 + physics.wavePhase) * 4 * props.waveIntensity
    const rotation = Math.sin(time * 1.2 + physics.phase) * 5
    
    // 应用变换
    el.style.transform = `translate(${physics.offsetX + waveX}px, ${physics.offsetY + waveY}px) rotate(${physics.rotation + rotation}deg)`
    
    // 透明度波动
    const opacity = 0.7 + Math.sin(time * 2 + physics.phase) * 0.2
    el.style.opacity = opacity.toString()
  })
  
  physicsAnimationId = requestAnimationFrame(animatePhysics)
}

// 粒子效果
interface Particle {
  x: number
  y: number
  size: number
  alpha: number
  speedX: number
  speedY: number
  life: number
}

const particles: Particle[] = []

function initParticles() {
  if (!particleCanvasRef.value) return
  
  const canvas = particleCanvasRef.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  const rect = parentRef.value?.getBoundingClientRect()
  if (!rect) return
  
  canvas.width = rect.width
  canvas.height = rect.height
  
  for (let i = 0; i < 50; i++) {
    particles.push({
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      size: Math.random() * 3 + 1,
      alpha: Math.random() * 0.5 + 0.2,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: Math.random() * 0.3 + 0.1,
      life: Math.random() * 200 + 100
    })
  }
}

function animateParticles() {
  const canvas = particleCanvasRef.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  const time = Date.now() * 0.001
  
  particles.forEach(p => {
    // 漂移
    p.x += p.speedX + Math.sin(time + p.life) * 0.2
    p.y += p.speedY
    p.life--
    
    // 重生
    if (p.y > canvas.height || p.life <= 0) {
      p.y = -10
      p.x = Math.random() * canvas.width
      p.life = Math.random() * 200 + 100
    }
    
    // 绘制
    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3)
    gradient.addColorStop(0, `rgba(180, 220, 240, ${p.alpha})`)
    gradient.addColorStop(1, 'transparent')
    
    ctx.beginPath()
    ctx.fillStyle = gradient
    ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
    ctx.fill()
  })
  
  animationFrameId = requestAnimationFrame(animateParticles)
}

// 入场动画
function playEntryAnimation() {
  const chars = Array.from(charRefs.value.values())
  
  // 初始状态
  chars.forEach((char, index) => {
    gsap.set(char, {
      opacity: 0,
      y: 50 + index * 10,
      rotation: (Math.random() - 0.5) * 30,
      scale: 0.8
    })
  })
  
  if (subtitleRef.value) {
    gsap.set(subtitleRef.value, {
      opacity: 0,
      y: 30
    })
  }
  
  // 入场动画
  gsap.to(chars, {
    opacity: 1,
    y: 0,
    rotation: 0,
    scale: 1,
    duration: 1,
    stagger: 0.1,
    ease: 'power2.out'
  })
  
  if (subtitleRef.value) {
    gsap.to(subtitleRef.value, {
      opacity: 0.7,
      y: 0,
      duration: 1,
      delay: chars.length * 0.1 + 0.3,
      ease: 'power2.out'
    })
  }
}

// 初始化
onMounted(() => {
  if (!parentRef.value) return
  
  // 初始化
  initParticles()
  
  setTimeout(() => {
    ctx = gsap.context(() => {
      // 初始化字符物理
      initCharPhysics()
      
      // 入场动画
      playEntryAnimation()
      
      // ScrollTrigger
      scrollTriggerInstance = ScrollTrigger.create({
        trigger: parentRef.value,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 1.5,
        onUpdate: (self) => {
          progress.value = self.progress * 100
          
          // 水波强度随滚动变化
          const intensity = 1 - self.progress * 0.5
          
          // 背景水色深浅变化
          if (parentRef.value) {
            const hue = 195 + self.progress * 15
            const lightness = 85 - self.progress * 20
            parentRef.value.style.background = `linear-gradient(180deg, 
              hsl(${hue}, 60%, ${lightness}%) 0%, 
              hsl(${hue + 10}, 50%, ${lightness - 10}%) 100%)`
          }
        },
        onEnter: () => {
          playEntryAnimation()
        },
        onLeaveBack: () => {
          // 重置
          const chars = Array.from(charRefs.value.values())
          chars.forEach((char, index) => {
            gsap.set(char, {
              opacity: 0,
              y: 50 + index * 10,
              rotation: (Math.random() - 0.5) * 30,
              scale: 0.8
            })
          })
          
          if (subtitleRef.value) {
            gsap.set(subtitleRef.value, { opacity: 0, y: 30 })
          }
        }
      })
      
      cleanupFns.push(() => scrollTriggerInstance?.kill())
    }, parentRef.value)
  }, 100)
  
  // 启动物理动画
  animatePhysics()
  animateParticles()
})

// 清理
onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0
  
  ctx?.revert()
  ctx = null
  
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
  
  if (physicsAnimationId !== null) {
    cancelAnimationFrame(physicsAnimationId)
    physicsAnimationId = null
  }
  
  scrollTriggerInstance?.kill()
  ScrollTrigger.getAll().forEach(st => st.kill())
  
  particles.length = 0
  charPhysicsMap.clear()
  charRefs.value.clear()
})
</script>

<style scoped>
.water-wave-section-238 {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, hsl(195, 60%, 85%) 0%, hsl(205, 50%, 75%) 100%);
  font-family: 'Noto Serif SC', 'Songti SC', 'SimSun', serif;
}

/* 水面背景 */
.water-bg-238 {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

/* 波浪层 */
.wave-layer-238 {
  position: absolute;
  width: 200%;
  height: 100%;
  left: -50%;
  background-repeat: repeat-x;
  opacity: 0.1;
}

.wave-1-238 {
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(255, 255, 255, 0.3) 25%, 
    transparent 50%);
  animation: wave-drift-238 20s linear infinite;
  top: 20%;
}

.wave-2-238 {
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(200, 240, 255, 0.2) 30%, 
    transparent 60%);
  animation: wave-drift-238 25s linear infinite reverse;
  top: 40%;
}

.wave-3-238 {
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(180, 220, 240, 0.25) 35%, 
    transparent 70%);
  animation: wave-drift-238 18s linear infinite;
  top: 60%;
}

@keyframes wave-drift-238 {
  0% { transform: translateX(0); }
  100% { transform: translateX(50%); }
}

/* 光线折射 */
.light-refraction-238 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 60%;
  background: 
    linear-gradient(135deg, 
      rgba(255, 255, 255, 0.15) 0%, 
      transparent 50%),
    linear-gradient(225deg, 
      rgba(200, 240, 255, 0.1) 0%, 
      transparent 50%);
  animation: light-shimmer-238 8s ease-in-out infinite;
}

@keyframes light-shimmer-238 {
  0%, 100% { opacity: 0.5; transform: translateX(-10px); }
  50% { opacity: 0.8; transform: translateX(10px); }
}

/* 涟漪容器 */
.ripple-container-238 {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

:deep(.ripple-238) {
  position: absolute;
  width: 100px;
  height: 100px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  box-shadow: 
    0 0 20px rgba(255, 255, 255, 0.2),
    inset 0 0 20px rgba(255, 255, 255, 0.1);
}

/* 字符容器 */
.char-container-238 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.15em;
  z-index: 10;
}

.char-item-238 {
  display: inline-block;
  font-size: v-bind(fontSize);
  font-weight: 500;
  color: rgba(30, 60, 90, 0.8);
  text-shadow: 
    0 2px 10px rgba(100, 150, 200, 0.3),
    0 0 30px rgba(200, 230, 250, 0.4);
  user-select: none;
  transition: text-shadow 0.3s ease;
  will-change: transform, opacity;
}

/* 副标题 */
.subtitle-238 {
  position: absolute;
  top: calc(50% + 120px);
  left: 50%;
  transform: translateX(-50%);
  font-size: clamp(0.875rem, 2vw, 1.125rem);
  color: rgba(50, 80, 100, 0.6);
  letter-spacing: 0.5em;
  white-space: nowrap;
  z-index: 10;
}

/* 水纹装饰 */
.water-decor-238 {
  position: absolute;
  bottom: 10%;
  left: 0;
  right: 0;
  height: 100px;
  z-index: 5;
  opacity: 0.5;

  svg {
    width: 100%;
    height: 100%;
  }

  path {
    animation: decor-wave-238 4s ease-in-out infinite;
  }
}

@keyframes decor-wave-238 {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

/* 粒子画布 */
.particle-canvas-238 {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 3;
}

/* 进度条 */
.progress-238 {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, 
    rgba(100, 180, 220, 0.5), 
    rgba(150, 220, 250, 0.8));
  z-index: 100;
  transition: width 0.1s ease;
  box-shadow: 0 0 10px rgba(100, 180, 220, 0.5);
}

/* 响应式 */
@media (max-width: 768px) {
  .char-container-238 {
    gap: 0.1em;
  }

  .subtitle-238 {
    letter-spacing: 0.3em;
  }

  .water-decor-238 {
    bottom: 5%;
  }
}
</style>
