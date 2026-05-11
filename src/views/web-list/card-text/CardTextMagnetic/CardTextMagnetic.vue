<template>
  <div 
    ref="parentRef" 
    class="magnetic-section-246"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <!-- 磁场背景 -->
    <div class="magnetic-bg-246">
      <div class="field-lines-246"></div>
      <div class="magnetic-glow-246"></div>
    </div>

    <!-- 粒子画布 -->
    <canvas ref="particleCanvasRef" class="magnetic-particle-canvas-246"></canvas>

    <!-- 字符容器 -->
    <div class="magnetic-char-container-246" ref="charContainerRef">
      <span
        v-for="(item, index) in charData"
        :key="item.key"
        :ref="el => setCharRef(el as HTMLElement, index)"
        class="magnetic-char-246"
        :style="{
          '--polarity': index % 2 === 0 ? '1' : '-1'
        }"
      >{{ item.char }}</span>
    </div>

    <!-- 副标题 -->
    <p class="magnetic-subtitle-246" ref="subtitleRef">{{ subtitle }}</p>

    <!-- 磁场线装饰 -->
    <svg class="field-decor-246" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice">
      <path
        v-for="i in 12"
        :key="i"
        :d="`M 0 ${50 * i} Q 600 ${50 * i + (i % 2 === 0 ? -100 : 100)} 1200 ${50 * i}`"
        fill="none"
        stroke="rgba(100, 150, 255, 0.1)"
        stroke-width="1"
        class="field-path-246"
      />
    </svg>

    <!-- 进度条 -->
    <div class="magnetic-progress-246" :style="{ width: progress + '%' }"></div>
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
  magneticStrength?: number
}

const props = withDefaults(defineProps<Props>(), {
  title: '磁力线场',
  subtitle: '同性相斥 · 异极相吸',
  magneticStrength: 1
})

// Refs
const parentRef = ref<HTMLElement | null>(null)
const charContainerRef = ref<HTMLElement | null>(null)
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
    key: `magnetic-char-${index}`
  }))
})

// 磁场粒子
interface FieldParticle {
  x: number
  y: number
  vx: number
  vy: number
  polarity: number
  size: number
  alpha: number
  trail: { x: number, y: number }[]
}

const fieldParticles: FieldParticle[] = []

// 鼠标状态
let mouseX = 0
let mouseY = 0
let isNear = false

// 清理函数
type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []
let ctx: gsap.Context | null = null
let scrollTriggerInstance: ScrollTrigger | null = null
let animationFrameId: number | null = null
let charAnimations: gsap.core.Tween[] = []

// 设置字符 ref
function setCharRef(el: HTMLElement | null, index: number) {
  if (el) {
    charRefs.value.set(index, el)
  }
}

// 初始化磁场粒子
function initFieldParticles() {
  if (!parentRef.value) return
  
  const rect = parentRef.value.getBoundingClientRect()
  
  for (let i = 0; i < 150; i++) {
    const polarity = Math.random() > 0.5 ? 1 : -1
    fieldParticles.push({
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      vx: 0,
      vy: 0,
      polarity,
      size: Math.random() * 3 + 1,
      alpha: Math.random() * 0.4 + 0.2,
      trail: []
    })
  }
}

// 动画磁场粒子
function animateFieldParticles() {
  const canvas = particleCanvasRef.value
  if (!canvas) return
  
  const ctx2d = canvas.getContext('2d')
  if (!ctx2d) return
  
  const rect = parentRef.value?.getBoundingClientRect()
  if (!rect) return
  
  canvas.width = rect.width
  canvas.height = rect.height
  
  const centerX = rect.width / 2
  const centerY = rect.height / 2
  const time = Date.now() * 0.001
  
  ctx2d.clearRect(0, 0, canvas.width, canvas.height)
  
  fieldParticles.forEach(p => {
    // 存储轨迹
    p.trail.push({ x: p.x, y: p.y })
    if (p.trail.length > 10) p.trail.shift()
    
    // 磁场力计算
    const dx = mouseX - p.x
    const dy = mouseY - p.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    
    // 同性相斥，异性相吸
    let force = 0
    if (isNear && dist < 300) {
      force = (300 - dist) / 300 * 2 * props.magneticStrength
      
      // 靠近时相吸
      if (dist < 100) {
        p.vx += (dx / dist) * force * 0.5
        p.vy += (dy / dist) * force * 0.5
      } else {
        // 远离时相斥
        p.vx -= (dx / dist) * force
        p.vy -= (dy / dist) * force
      }
    }
    
    // 中心吸引力
    const centerDx = centerX - p.x
    const centerDy = centerY - p.y
    const centerDist = Math.sqrt(centerDx * centerDx + centerDy * centerDy)
    
    p.vx += (centerDx / centerDist) * 0.02 * props.magneticStrength
    p.vy += (centerDy / centerDist) * 0.02 * props.magneticStrength
    
    // 螺旋运动
    const angle = Math.atan2(p.vy, p.vx) + 0.1 * p.polarity
    const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
    p.vx = Math.cos(angle) * speed * 0.99
    p.vy = Math.sin(angle) * speed * 0.99
    
    // 阻力
    p.vx *= 0.98
    p.vy *= 0.98
    
    // 更新位置
    p.x += p.vx
    p.y += p.vy
    
    // 边界反弹
    if (p.x < 0 || p.x > rect.width) p.vx *= -1
    if (p.y < 0 || p.y > rect.height) p.vy *= -1
    p.x = Math.max(0, Math.min(rect.width, p.x))
    p.y = Math.max(0, Math.min(rect.height, p.y))
    
    // 闪烁
    const pulse = Math.sin(time * 3 + p.x * 0.01) * 0.3 + 0.7
    
    // 绘制轨迹
    ctx2d.beginPath()
    ctx2d.strokeStyle = `rgba(100, 150, 255, ${p.alpha * pulse * 0.3})`
    ctx2d.lineWidth = p.size * 0.5
    ctx2d.moveTo(p.trail[0]?.x || p.x, p.trail[0]?.y || p.y)
    p.trail.forEach(t => ctx2d.lineTo(t.x, t.y))
    ctx2d.stroke()
    
    // 绘制粒子
    const color = p.polarity > 0 ? `rgba(100, 200, 255, ${p.alpha * pulse})` : `rgba(255, 100, 150, ${p.alpha * pulse})`
    const gradient = ctx2d.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4)
    gradient.addColorStop(0, color)
    gradient.addColorStop(1, 'transparent')
    
    ctx2d.beginPath()
    ctx2d.fillStyle = gradient
    ctx2d.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2)
    ctx2d.fill()
  })
  
  animationFrameId = requestAnimationFrame(animateFieldParticles)
}

// 鼠标移动
function handleMouseMove(e: MouseEvent) {
  if (!parentRef.value) return
  
  const rect = parentRef.value.getBoundingClientRect()
  mouseX = e.clientX - rect.left
  mouseY = e.clientY - rect.top
  
  // 检测是否靠近字符
  const chars = Array.from(charRefs.value.values())
  chars.forEach((char, index) => {
    const charRect = char.getBoundingClientRect()
    const charCenterX = charRect.left + charRect.width / 2 - rect.left
    const charCenterY = charRect.top + charRect.height / 2 - rect.top
    
    const dx = mouseX - charCenterX
    const dy = mouseY - charCenterY
    const dist = Math.sqrt(dx * dx + dy * dy)
    
    const polarity = index % 2 === 0 ? 1 : -1
    
    if (dist < 200) {
      isNear = true
      const force = (200 - dist) / 200 * 30 * props.magneticStrength
      const angle = Math.atan2(dy, dx)
      
      // 异性相吸，同性相斥
      gsap.to(char, {
        x: -Math.cos(angle) * force * polarity,
        y: -Math.sin(angle) * force * polarity * 0.5,
        scale: 1 + (200 - dist) / 200 * 0.2,
        duration: 0.3,
        ease: 'power2.out'
      })
    } else {
      gsap.to(char, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)'
      })
    }
  })
}

// 鼠标离开
function handleMouseLeave() {
  isNear = false
  
  const chars = Array.from(charRefs.value.values())
  chars.forEach(char => {
    gsap.to(char, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: 'elastic.out(1, 0.5)'
    })
  })
}

// 入场动画
function playEntryAnimation() {
  const chars = Array.from(charRefs.value.values())
  
  // 初始状态 - 粒子态
  chars.forEach((char, index) => {
    gsap.set(char, {
      opacity: 0,
      scale: 0,
      filter: 'blur(20px) brightness(2)'
    })
  })
  
  if (subtitleRef.value) {
    gsap.set(subtitleRef.value, {
      opacity: 0,
      y: 20,
      filter: 'blur(10px)'
    })
  }
  
  // 汇聚成型
  gsap.to(chars, {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px) brightness(1)',
    duration: 1.2,
    stagger: 0.1,
    ease: 'elastic.out(1, 0.6)'
  })
  
  // 副标题动画
  if (subtitleRef.value) {
    gsap.to(subtitleRef.value, {
      opacity: 0.7,
      y: 0,
      filter: 'blur(0px)',
      duration: 1,
      delay: chars.length * 0.1 + 0.3,
      ease: 'power2.out'
    })
  }
}

// 初始化
onMounted(() => {
  if (!parentRef.value) return
  
  // 初始化粒子
  initFieldParticles()
  
  setTimeout(() => {
    ctx = gsap.context(() => {
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
        },
        onEnter: () => {
          playEntryAnimation()
        },
        onLeaveBack: () => {
          const chars = Array.from(charRefs.value.values())
          chars.forEach(char => {
            gsap.set(char, {
              opacity: 0,
              scale: 0,
              filter: 'blur(20px) brightness(2)'
            })
          })
          
          if (subtitleRef.value) {
            gsap.set(subtitleRef.value, { opacity: 0, y: 20, filter: 'blur(10px)' })
          }
        }
      })
      
      cleanupFns.push(() => scrollTriggerInstance?.kill())
    }, parentRef.value)
  }, 100)
  
  // 启动粒子动画
  animateFieldParticles()
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
  
  charAnimations.forEach(t => t.kill())
  charAnimations = []
  
  scrollTriggerInstance?.kill()
  ScrollTrigger.getAll().forEach(st => st.kill())
  
  fieldParticles.length = 0
  charRefs.value.clear()
})
</script>

<style scoped>
.magnetic-section-246 {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: radial-gradient(
    ellipse at 50% 50%,
    #0a1020 0%,
    #050810 50%,
    #020408 100%
  );
  font-family: 'Orbitron', 'Rajdhani', sans-serif;
}

/* 磁场背景 */
.magnetic-bg-246 {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.field-lines-246 {
  position: absolute;
  inset: 0;
  background: 
    repeating-linear-gradient(
      0deg,
      transparent 0px,
      transparent 49px,
      rgba(100, 150, 255, 0.03) 50px
    ),
    repeating-linear-gradient(
      90deg,
      transparent 0px,
      transparent 49px,
      rgba(100, 150, 255, 0.03) 50px
    );
}

.magnetic-glow-246 {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 600px;
  height: 600px;
  transform: translate(-50%, -50%);
  background: radial-gradient(
    circle,
    rgba(100, 150, 255, 0.1) 0%,
    transparent 70%
  );
  animation: magnetic-pulse-246 4s ease-in-out infinite;
}

@keyframes magnetic-pulse-246 {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
  50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.8; }
}

/* 粒子画布 */
.magnetic-particle-canvas-246 {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 5;
}

/* 字符容器 */
.magnetic-char-container-246 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 0.1em;
  z-index: 10;
}

.magnetic-char-246 {
  display: inline-block;
  font-size: clamp(3rem, 10vw, 6rem);
  font-weight: 700;
  background: linear-gradient(
    135deg,
    rgba(100, 200, 255, calc(var(--polarity) * 0.5 + 0.5)) 0%,
    rgba(255, 150, 200, calc(-1 * var(--polarity) * 0.5 + 0.5)) 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: none;
  filter: drop-shadow(0 0 20px rgba(100, 150, 255, 0.8));
  user-select: none;
  will-change: transform;
  cursor: default;
}

/* 副标题 */
.magnetic-subtitle-246 {
  position: absolute;
  top: calc(50% + 120px);
  left: 50%;
  transform: translateX(-50%);
  font-size: clamp(0.75rem, 1.5vw, 1rem);
  color: rgba(150, 180, 255, 0.6);
  letter-spacing: 0.5em;
  white-space: nowrap;
  z-index: 10;
}

/* 磁场线装饰 */
.field-decor-246 {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  opacity: 0.5;
}

.field-path-246 {
  animation: field-pulse-246 3s ease-in-out infinite;
}

@keyframes field-pulse-246 {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
}

/* 进度条 */
.magnetic-progress-246 {
  position: fixed;
  top: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, 
    rgba(100, 150, 255, 0.5), 
    rgba(150, 200, 255, 0.8),
    rgba(100, 150, 255, 0.6));
  z-index: 100;
  transition: width 0.1s ease;
  box-shadow: 0 0 15px rgba(100, 150, 255, 0.5);
}

/* 响应式 */
@media (max-width: 768px) {
  .magnetic-char-container-246 {
    flex-wrap: wrap;
    justify-content: center;
    max-width: 90vw;
  }

  .magnetic-char-246 {
    font-size: clamp(2rem, 12vw, 4rem);
  }

  .magnetic-subtitle-246 {
    letter-spacing: 0.2em;
    font-size: 0.7rem;
  }
}
</style>
