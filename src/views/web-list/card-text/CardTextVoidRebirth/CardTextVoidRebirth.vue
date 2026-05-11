<template>
  <div ref="parentRef" class="void-rebirth-239">
    <!-- 黑洞背景 -->
    <div class="void-bg-239">
      <div class="void-core-239"></div>
      <div class="void-ring-239 ring-1"></div>
      <div class="void-ring-239 ring-2"></div>
      <div class="void-ring-239 ring-3"></div>
      <div class="void-particles-239"></div>
    </div>

    <!-- 粒子画布 -->
    <canvas ref="particleCanvasRef" class="void-particle-canvas-239"></canvas>

    <!-- 字符容器 -->
    <div class="void-char-container-239" ref="charContainerRef">
      <span
        v-for="(item, index) in charData"
        :key="item.key"
        :ref="el => setCharRef(el as HTMLElement, index)"
        class="void-char-239"
        :style="{
          '--delay': (index * 0.15) + 's',
          '--angle': (index * 25) + 'deg'
        }"
      >{{ item.char }}</span>
    </div>

    <!-- 副标题 -->
    <p class="void-subtitle-239" ref="subtitleRef">
      <span v-for="(char, i) in subtitle.split('')" :key="i" class="subtitle-char-239">{{ char }}</span>
    </p>

    <!-- 进度条 -->
    <div class="void-progress-239" :style="{ width: progress + '%' }"></div>

    <!-- 装饰线条 -->
    <div class="void-decor-239">
      <svg viewBox="0 0 1200 100" preserveAspectRatio="none">
        <path
          v-for="i in 40"
          :key="i"
          :d="`M ${i * 30} 50 Q ${i * 30 + 15} ${30 + Math.sin(i) * 20} ${i * 30 + 30} 50`"
          fill="none"
          :stroke="`rgba(120, 80, 180, ${0.1 + Math.random() * 0.15})`"
          stroke-width="1"
        />
      </svg>
    </div>
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
  vortexIntensity?: number
}

const props = withDefaults(defineProps<Props>(), {
  title: '时空漩涡',
  subtitle: '从虚无中重生 · 诡异的美感',
  vortexIntensity: 1
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
    key: `void-char-${index}`
  }))
})

// 粒子数据
interface VoidParticle {
  x: number
  y: number
  angle: number
  radius: number
  speed: number
  size: number
  alpha: number
  color: string
  life: number
  targetX: number
  targetY: number
  phase: number
}

const particles: VoidParticle[] = []
const particleRefs: HTMLElement[] = []

// 清理函数
type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []
let ctx: gsap.Context | null = null
let scrollTriggerInstance: ScrollTrigger | null = null
let animationFrameId: number | null = null
let vortexAnimationId: number | null = null

// 设置字符 ref
function setCharRef(el: HTMLElement | null, index: number) {
  if (el) {
    charRefs.value.set(index, el)
  }
}

// 初始化粒子
function initParticles() {
  if (!parentRef.value) return
  
  const rect = parentRef.value.getBoundingClientRect()
  const centerX = rect.width / 2
  const centerY = rect.height / 2
  
  const colors = [
    'rgba(120, 80, 200, 0.8)',
    'rgba(180, 100, 255, 0.6)',
    'rgba(80, 140, 220, 0.7)',
    'rgba(200, 150, 255, 0.5)',
    'rgba(100, 200, 255, 0.6)'
  ]
  
  for (let i = 0; i < 200; i++) {
    const angle = Math.random() * Math.PI * 2
    const radius = 100 + Math.random() * 400 * props.vortexIntensity
    
    particles.push({
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
      angle: angle,
      radius: radius,
      speed: (0.002 + Math.random() * 0.003) * props.vortexIntensity,
      size: Math.random() * 3 + 1,
      alpha: Math.random() * 0.5 + 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: Math.random() * 300 + 200,
      targetX: 0,
      targetY: 0,
      phase: Math.random() * Math.PI * 2
    })
  }
}

// 动画粒子
function animateParticles() {
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
  
  particles.forEach(p => {
    // 螺旋向心运动
    p.angle += p.speed
    p.radius -= 0.3 * props.vortexIntensity
    
    // 重生到外围
    if (p.radius < 20) {
      p.radius = 300 + Math.random() * 200 * props.vortexIntensity
      p.angle = Math.random() * Math.PI * 2
    }
    
    // 计算位置
    const spiralX = centerX + Math.cos(p.angle) * p.radius
    const spiralY = centerY + Math.sin(p.angle) * p.radius
    
    // 添加波动
    p.x = spiralX + Math.sin(time * 2 + p.phase) * 10
    p.y = spiralY + Math.cos(time * 1.5 + p.phase) * 10
    
    // 闪烁
    p.alpha = 0.3 + Math.sin(time * 3 + p.phase) * 0.3
    p.life--
    
    // 绘制
    const gradient = ctx2d.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 5)
    gradient.addColorStop(0, p.color.replace('0.8', String(p.alpha)))
    gradient.addColorStop(1, 'transparent')
    
    ctx2d.beginPath()
    ctx2d.fillStyle = gradient
    ctx2d.arc(p.x, p.y, p.size * 5, 0, Math.PI * 2)
    ctx2d.fill()
  })
  
  vortexAnimationId = requestAnimationFrame(animateParticles)
}

// 字符螺旋动画
function animateCharVortex() {
  const chars = Array.from(charRefs.value.values())
  const container = charContainerRef.value
  if (!container) return
  
  const rect = container.getBoundingClientRect()
  const centerX = rect.width / 2
  const centerY = rect.height / 2
  const time = Date.now() * 0.001
  
  chars.forEach((char, index) => {
    const p = particles[index % particles.length]
    if (!p) return
    
    // 字符跟随粒子位置
    const targetX = p.x - rect.left - centerX
    const targetY = p.y - rect.top - centerY
    
    // 旋转效果
    const rotation = time * 50 + index * 10
    
    char.style.transform = `translate(${targetX}px, ${targetY}px) rotate(${rotation}deg) scale(${0.8 + p.alpha * 0.4})`
    char.style.opacity = String(0.5 + p.alpha * 0.5)
  })
  
  animationFrameId = requestAnimationFrame(animateCharVortex)
}

// 入场动画
function playEntryAnimation() {
  const chars = Array.from(charRefs.value.values())
  
  // 初始状态 - 从黑洞中心爆发
  chars.forEach((char, index) => {
    gsap.set(char, {
      opacity: 0,
      scale: 0,
      rotation: index * 30,
      filter: 'blur(10px)'
    })
  })
  
  if (subtitleRef.value) {
    const subtitleChars = subtitleRef.value.querySelectorAll('.subtitle-char-239')
    gsap.set(subtitleChars, {
      opacity: 0,
      y: 20,
      filter: 'blur(5px)'
    })
  }
  
  // 爆发动画
  gsap.to(chars, {
    opacity: 1,
    scale: 1,
    rotation: '+=360',
    filter: 'blur(0px)',
    duration: 1.5,
    stagger: 0.1,
    ease: 'elastic.out(1, 0.5)'
  })
  
  // 副标题动画
  if (subtitleRef.value) {
    const subtitleChars = subtitleRef.value.querySelectorAll('.subtitle-char-239')
    gsap.to(subtitleChars, {
      opacity: 0.6,
      y: 0,
      filter: 'blur(0px)',
      duration: 1,
      stagger: 0.05,
      delay: chars.length * 0.1,
      ease: 'power2.out'
    })
  }
}

// 初始化
onMounted(() => {
  if (!parentRef.value) return
  
  // 初始化粒子
  initParticles()
  
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
          
          // 漩涡强度变化
          if (parentRef.value) {
            const intensity = 0.5 + self.progress * 1.5
            parentRef.value.style.setProperty('--vortex-intensity', String(intensity))
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
              scale: 0,
              rotation: index * 30,
              filter: 'blur(10px)'
            })
          })
          
          if (subtitleRef.value) {
            const subtitleChars = subtitleRef.value.querySelectorAll('.subtitle-char-239')
            gsap.set(subtitleChars, { opacity: 0, y: 20, filter: 'blur(5px)' })
          }
        }
      })
      
      cleanupFns.push(() => scrollTriggerInstance?.kill())
    }, parentRef.value)
  }, 100)
  
  // 启动动画
  animateParticles()
  animateCharVortex()
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
  
  if (vortexAnimationId !== null) {
    cancelAnimationFrame(vortexAnimationId)
    vortexAnimationId = null
  }
  
  scrollTriggerInstance?.kill()
  ScrollTrigger.getAll().forEach(st => st.kill())
  
  particles.length = 0
  charRefs.value.clear()
})
</script>

<style scoped>
.void-rebirth-239 {
  --vortex-intensity: 1;
  
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: radial-gradient(
    ellipse at center,
    #1a0a2e 0%,
    #0d0518 40%,
    #050208 100%
  );
  font-family: 'Orbitron', 'Rajdhani', sans-serif;
}

/* 黑洞背景 */
.void-bg-239 {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.void-core-239 {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100px;
  height: 100px;
  transform: translate(-50%, -50%);
  background: radial-gradient(
    circle,
    #000 0%,
    #000 40%,
    transparent 70%
  );
  border-radius: 50%;
  box-shadow: 
    0 0 50px 20px rgba(100, 50, 200, 0.3),
    0 0 100px 50px rgba(150, 100, 255, 0.1);
  animation: core-pulse-239 3s ease-in-out infinite;
}

@keyframes core-pulse-239 {
  0%, 100% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(1.2); }
}

.void-ring-239 {
  position: absolute;
  top: 50%;
  left: 50%;
  border: 2px solid;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: ring-rotate-239 20s linear infinite;
}

.ring-1 {
  width: 250px;
  height: 250px;
  border-color: rgba(150, 100, 255, 0.3);
  animation-direction: normal;
}

.ring-2 {
  width: 400px;
  height: 400px;
  border-color: rgba(100, 150, 255, 0.2);
  animation-direction: reverse;
  animation-duration: 30s;
}

.ring-3 {
  width: 550px;
  height: 550px;
  border-color: rgba(200, 150, 255, 0.1);
  animation-duration: 40s;
}

@keyframes ring-rotate-239 {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}

.void-particles-239 {
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(2px 2px at 20px 30px, rgba(150, 100, 255, 0.5), transparent),
    radial-gradient(2px 2px at 40px 70px, rgba(100, 150, 255, 0.3), transparent),
    radial-gradient(1px 1px at 90px 40px, rgba(200, 150, 255, 0.4), transparent);
  background-size: 200px 200px;
  animation: star-drift-239 60s linear infinite;
}

@keyframes star-drift-239 {
  0% { transform: translateY(0); }
  100% { transform: translateY(-200px); }
}

/* 粒子画布 */
.void-particle-canvas-239 {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 5;
}

/* 字符容器 */
.void-char-container-239 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 0.2em;
  z-index: 10;
}

.void-char-239 {
  display: inline-block;
  font-size: clamp(2rem, 7vw, 4.5rem);
  font-weight: 700;
  color: rgba(200, 180, 255, 0.9);
  text-shadow: 
    0 0 20px rgba(150, 100, 255, 0.8),
    0 0 40px rgba(100, 150, 255, 0.5),
    0 0 60px rgba(200, 150, 255, 0.3);
  user-select: none;
  will-change: transform, opacity;
  transition: text-shadow 0.3s ease;
}

/* 副标题 */
.void-subtitle-239 {
  position: absolute;
  top: calc(50% + 100px);
  left: 50%;
  transform: translateX(-50%);
  font-size: clamp(0.75rem, 1.5vw, 1rem);
  color: rgba(150, 120, 200, 0.6);
  letter-spacing: 0.3em;
  white-space: nowrap;
  z-index: 10;
  display: flex;
  gap: 0.1em;
}

.subtitle-char-239 {
  display: inline-block;
}

/* 进度条 */
.void-progress-239 {
  position: fixed;
  top: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, 
    rgba(150, 100, 255, 0.5), 
    rgba(200, 150, 255, 0.8),
    rgba(100, 200, 255, 0.6));
  z-index: 100;
  transition: width 0.1s ease;
  box-shadow: 0 0 15px rgba(150, 100, 255, 0.5);
}

/* 装饰 */
.void-decor-239 {
  position: absolute;
  bottom: 15%;
  left: 0;
  right: 0;
  height: 100px;
  z-index: 3;
  opacity: 0.6;

  svg {
    width: 100%;
    height: 100%;
  }
}

/* 响应式 */
@media (max-width: 768px) {
  .void-char-container-239 {
    flex-wrap: wrap;
    justify-content: center;
    max-width: 90vw;
  }

  .void-char-239 {
    font-size: clamp(1.5rem, 8vw, 3rem);
  }

  .void-subtitle-239 {
    letter-spacing: 0.15em;
    font-size: 0.7rem;
  }

  .void-core-239 {
    width: 60px;
    height: 60px;
  }

  .void-ring-239 {
    display: none;
  }
}
</style>
