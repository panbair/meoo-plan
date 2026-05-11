<template>
  <div ref="parentRef" class="galaxy-section-242">
    <!-- 星空背景 -->
    <div class="galaxy-bg-242">
      <div class="star-field-242"></div>
      <div class="nebula-242 nebula-1"></div>
      <div class="nebula-242 nebula-2"></div>
      <div class="nebula-242 nebula-3"></div>
    </div>

    <!-- 粒子画布 -->
    <canvas ref="particleCanvasRef" class="galaxy-particle-canvas-242"></canvas>

    <!-- 字符容器 -->
    <div class="galaxy-char-container-242" ref="charContainerRef">
      <span
        v-for="(item, index) in charData"
        :key="item.key"
        :ref="el => setCharRef(el as HTMLElement, index)"
        class="galaxy-char-242"
        :style="{
          '--star-color': `hsl(${(item.index * 40) + 200}, 80%, 70%)`
        }"
      >{{ item.char }}</span>
    </div>

    <!-- 副标题 -->
    <p class="galaxy-subtitle-242" ref="subtitleRef">{{ subtitle }}</p>

    <!-- 进度条 -->
    <div class="galaxy-progress-242" :style="{ width: progress + '%' }"></div>
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
  galaxyIntensity?: number
}

const props = withDefaults(defineProps<Props>(), {
  title: '银河星尘',
  subtitle: '穿越时空的永恒之光',
  galaxyIntensity: 1
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
    key: `galaxy-char-${index}`
  }))
})

// 星尘粒子
interface Stardust {
  x: number
  y: number
  z: number
  size: number
  alpha: number
  speed: number
  color: string
  twinklePhase: number
}

const stardust: Stardust[] = []

// 清理函数
type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []
let ctx: gsap.Context | null = null
let scrollTriggerInstance: ScrollTrigger | null = null
let animationFrameId: number | null = null

// 设置字符 ref
function setCharRef(el: HTMLElement | null, index: number) {
  if (el) {
    charRefs.value.set(index, el)
  }
}

// 初始化星尘
function initStardust() {
  if (!parentRef.value) return
  
  const rect = parentRef.value.getBoundingClientRect()
  const colors = [
    'rgba(200, 180, 255, 0.8)',
    'rgba(150, 200, 255, 0.7)',
    'rgba(255, 200, 220, 0.6)',
    'rgba(180, 220, 255, 0.8)',
    'rgba(255, 180, 150, 0.5)'
  ]
  
  for (let i = 0; i < 400; i++) {
    stardust.push({
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      z: Math.random() * 500,
      size: Math.random() * 3 + 1,
      alpha: Math.random() * 0.5 + 0.5,
      speed: (Math.random() * 0.5 + 0.2) * props.galaxyIntensity,
      color: colors[Math.floor(Math.random() * colors.length)],
      twinklePhase: Math.random() * Math.PI * 2
    })
  }
}

// 动画星尘
function animateStardust() {
  const canvas = particleCanvasRef.value
  if (!canvas) return
  
  const ctx2d = canvas.getContext('2d')
  if (!ctx2d) return
  
  const rect = parentRef.value?.getBoundingClientRect()
  if (!rect) return
  
  canvas.width = rect.width
  canvas.height = rect.height
  
  const time = Date.now() * 0.001
  
  ctx2d.clearRect(0, 0, canvas.width, canvas.height)
  
  stardust.forEach(star => {
    // 星星闪烁
    star.alpha = 0.3 + Math.sin(time * 2 + star.twinklePhase) * 0.3
    
    // 缓慢漂浮
    star.x += Math.sin(time * 0.5 + star.twinklePhase) * 0.2
    star.y += star.speed * 0.1
    
    // 边界重生
    if (star.y > rect.height) {
      star.y = -10
      star.x = Math.random() * rect.width
    }
    if (star.x < 0) star.x = rect.width
    if (star.x > rect.width) star.x = 0
    
    // 绘制
    const gradient = ctx2d.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 4)
    gradient.addColorStop(0, star.color.replace('0.8', String(star.alpha)))
    gradient.addColorStop(0.3, star.color.replace('0.8', String(star.alpha * 0.5)))
    gradient.addColorStop(1, 'transparent')
    
    ctx2d.beginPath()
    ctx2d.fillStyle = gradient
    ctx2d.arc(star.x, star.y, star.size * 4, 0, Math.PI * 2)
    ctx2d.fill()
    
    // 核心亮点
    ctx2d.beginPath()
    ctx2d.fillStyle = `rgba(255, 255, 255, ${star.alpha})`
    ctx2d.arc(star.x, star.y, star.size * 0.5, 0, Math.PI * 2)
    ctx2d.fill()
  })
  
  animationFrameId = requestAnimationFrame(animateStardust)
}

// 入场动画
function playEntryAnimation() {
  const chars = Array.from(charRefs.value.values())
  
  // 初始状态 - 星尘汇聚
  chars.forEach((char, index) => {
    gsap.set(char, {
      opacity: 0,
      scale: 0,
      filter: 'blur(30px) brightness(2)',
      textShadow: '0 0 50px rgba(200, 180, 255, 1)'
    })
  })
  
  if (subtitleRef.value) {
    gsap.set(subtitleRef.value, {
      opacity: 0,
      y: 20,
      filter: 'blur(10px)'
    })
  }
  
  // 星尘汇聚动画
  gsap.to(chars, {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px) brightness(1)',
    textShadow: `
      0 0 10px var(--star-color),
      0 0 20px var(--star-color),
      0 0 40px var(--star-color)
    `,
    duration: 1.5,
    stagger: 0.12,
    ease: 'power3.out'
  })
  
  // 副标题动画
  if (subtitleRef.value) {
    gsap.to(subtitleRef.value, {
      opacity: 0.6,
      y: 0,
      filter: 'blur(0px)',
      duration: 1,
      delay: chars.length * 0.12 + 0.5,
      ease: 'power2.out'
    })
  }
}

// 初始化
onMounted(() => {
  if (!parentRef.value) return
  
  // 初始化星尘
  initStardust()
  
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
          chars.forEach((char, index) => {
            gsap.set(char, {
              opacity: 0,
              scale: 0,
              filter: 'blur(30px) brightness(2)'
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
  
  // 启动星尘动画
  animateStardust()
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
  
  scrollTriggerInstance?.kill()
  ScrollTrigger.getAll().forEach(st => st.kill())
  
  stardust.length = 0
  charRefs.value.clear()
})
</script>

<style scoped>
.galaxy-section-242 {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: radial-gradient(
    ellipse at 50% 50%,
    #0a0a1a 0%,
    #050510 50%,
    #020208 100%
  );
  font-family: 'Cinzel', 'Playfair Display', serif;
}

/* 星空背景 */
.galaxy-bg-242 {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.star-field-242 {
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(2px 2px at 10% 20%, rgba(255, 255, 255, 0.8), transparent),
    radial-gradient(1px 1px at 30% 40%, rgba(255, 255, 255, 0.6), transparent),
    radial-gradient(2px 2px at 50% 10%, rgba(255, 255, 255, 0.7), transparent),
    radial-gradient(1px 1px at 70% 60%, rgba(255, 255, 255, 0.5), transparent),
    radial-gradient(2px 2px at 90% 30%, rgba(255, 255, 255, 0.8), transparent),
    radial-gradient(1px 1px at 15% 80%, rgba(255, 255, 255, 0.6), transparent),
    radial-gradient(2px 2px at 85% 70%, rgba(255, 255, 255, 0.7), transparent);
  animation: star-twinkle-242 5s ease-in-out infinite;
}

@keyframes star-twinkle-242 {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}

.nebula-242 {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.3;
}

.nebula-1 {
  top: 20%;
  left: 20%;
  width: 400px;
  height: 300px;
  background: radial-gradient(ellipse, rgba(100, 60, 150, 0.4) 0%, transparent 70%);
  animation: nebula-drift-242 30s ease-in-out infinite;
}

.nebula-2 {
  bottom: 30%;
  right: 15%;
  width: 350px;
  height: 400px;
  background: radial-gradient(ellipse, rgba(60, 100, 180, 0.3) 0%, transparent 70%);
  animation: nebula-drift-242 25s ease-in-out infinite reverse;
}

.nebula-3 {
  top: 50%;
  left: 50%;
  width: 500px;
  height: 500px;
  background: radial-gradient(ellipse, rgba(150, 80, 120, 0.2) 0%, transparent 70%);
  animation: nebula-drift-242 35s ease-in-out infinite;
}

@keyframes nebula-drift-242 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(30px, -20px) scale(1.1); }
  50% { transform: translate(-20px, 30px) scale(0.95); }
  75% { transform: translate(-30px, -10px) scale(1.05); }
}

/* 粒子画布 */
.galaxy-particle-canvas-242 {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 5;
}

/* 字符容器 */
.galaxy-char-container-242 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 0.1em;
  z-index: 10;
}

.galaxy-char-242 {
  display: inline-block;
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: 400;
  color: rgba(220, 210, 255, 0.95);
  text-shadow: 
    0 0 10px var(--star-color),
    0 0 20px var(--star-color),
    0 0 40px var(--star-color);
  user-select: none;
  will-change: transform, filter, textShadow;
  animation: char-glow-242 3s ease-in-out infinite;
}

@keyframes char-glow-242 {
  0%, 100% { text-shadow: 0 0 10px var(--star-color), 0 0 20px var(--star-color), 0 0 40px var(--star-color); }
  50% { text-shadow: 0 0 15px var(--star-color), 0 0 30px var(--star-color), 0 0 60px var(--star-color); }
}

/* 副标题 */
.galaxy-subtitle-242 {
  position: absolute;
  top: calc(50% + 100px);
  left: 50%;
  transform: translateX(-50%);
  font-size: clamp(0.875rem, 1.5vw, 1.125rem);
  color: rgba(200, 190, 230, 0.6);
  letter-spacing: 0.4em;
  white-space: nowrap;
  z-index: 10;
}

/* 进度条 */
.galaxy-progress-242 {
  position: fixed;
  top: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, 
    rgba(150, 120, 200, 0.5), 
    rgba(200, 180, 255, 0.8),
    rgba(120, 150, 200, 0.6));
  z-index: 100;
  transition: width 0.1s ease;
  box-shadow: 0 0 15px rgba(150, 120, 200, 0.5);
}

/* 响应式 */
@media (max-width: 768px) {
  .galaxy-char-container-242 {
    flex-wrap: wrap;
    justify-content: center;
    max-width: 90vw;
  }

  .galaxy-char-242 {
    font-size: clamp(2rem, 10vw, 3.5rem);
  }

  .galaxy-subtitle-242 {
    letter-spacing: 0.2em;
    font-size: 0.75rem;
  }

  .nebula-242 {
    filter: blur(50px);
  }
}
</style>
