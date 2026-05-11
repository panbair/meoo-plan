<template>
  <div ref="parentRef" class="particle-storm-240">
    <!-- 风暴背景 -->
    <div class="storm-bg-240">
      <div class="storm-vortex-240"></div>
      <div class="storm-lightning-240"></div>
    </div>

    <!-- 粒子画布 -->
    <canvas ref="particleCanvasRef" class="storm-particle-canvas-240"></canvas>

    <!-- 字符容器 -->
    <div class="storm-char-container-240" ref="charContainerRef">
      <span
        v-for="(item, index) in charData"
        :key="item.key"
        :ref="el => setCharRef(el as HTMLElement, index)"
        class="storm-char-240"
        :data-index="index"
      >{{ item.char }}</span>
    </div>

    <!-- 副标题 -->
    <p class="storm-subtitle-240" ref="subtitleRef">{{ subtitle }}</p>

    <!-- 碎片容器 -->
    <div class="shard-container-240" ref="shardContainerRef"></div>

    <!-- 进度条 -->
    <div class="storm-progress-240" :style="{ width: progress + '%' }"></div>
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
  stormIntensity?: number
}

const props = withDefaults(defineProps<Props>(), {
  title: '粒子风暴',
  subtitle: '撕裂 · 重组 · 重生',
  stormIntensity: 1
})

// Refs
const parentRef = ref<HTMLElement | null>(null)
const charContainerRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const particleCanvasRef = ref<HTMLCanvasElement | null>(null)
const shardContainerRef = ref<HTMLElement | null>(null)

const charRefs = ref<Map<number, HTMLElement>>(new Map())

// 状态
const progress = ref(0)

// 字符数据
const charData = computed(() => {
  return props.title.split('').map((char, index) => ({
    char,
    index,
    key: `storm-char-${index}`
  }))
})

// 粒子数据
interface StormParticle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  color: string
  life: number
  angle: number
  spin: number
}

const particles: StormParticle[] = []

// 碎片数据
interface Shard {
  x: number
  y: number
  rotation: number
  scale: number
  opacity: number
  vx: number
  vy: number
  vr: number
  char: string
}

const shards: Shard[] = []

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

// 初始化粒子
function initParticles() {
  if (!parentRef.value) return
  
  const rect = parentRef.value.getBoundingClientRect()
  const centerX = rect.width / 2
  const centerY = rect.height / 2
  
  const colors = [
    'rgba(255, 100, 100, 0.8)',
    'rgba(255, 200, 100, 0.7)',
    'rgba(255, 150, 50, 0.9)',
    'rgba(255, 80, 80, 0.6)',
    'rgba(255, 220, 180, 0.5)'
  ]
  
  for (let i = 0; i < 300; i++) {
    const angle = Math.random() * Math.PI * 2
    const radius = 50 + Math.random() * 500 * props.stormIntensity
    
    particles.push({
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
      vx: (Math.random() - 0.5) * 8 * props.stormIntensity,
      vy: (Math.random() - 0.5) * 8 * props.stormIntensity,
      size: Math.random() * 4 + 2,
      alpha: Math.random() * 0.6 + 0.4,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: Math.random() * 150 + 100,
      angle: angle,
      spin: (Math.random() - 0.5) * 0.3
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
    // 风暴旋转
    const cos = Math.cos(p.angle + time * 0.5)
    const sin = Math.sin(p.angle + time * 0.5)
    
    p.x += p.vx * cos * props.stormIntensity
    p.y += p.vy * sin * props.stormIntensity
    p.angle += p.spin
    
    // 螺旋向心
    const dx = centerX - p.x
    const dy = centerY - p.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    
    if (dist > 30) {
      p.x += dx * 0.02 * props.stormIntensity
      p.y += dy * 0.02 * props.stormIntensity
    }
    
    // 边界重生
    if (p.x < 0 || p.x > rect.width || p.y < 0 || p.y > rect.height) {
      const angle = Math.random() * Math.PI * 2
      const radius = 200 + Math.random() * 300
      p.x = centerX + Math.cos(angle) * radius
      p.y = centerY + Math.sin(angle) * radius
    }
    
    // 闪烁
    p.alpha = 0.3 + Math.sin(time * 5 + p.life) * 0.3
    p.life--
    
    if (p.life <= 0) {
      p.life = Math.random() * 150 + 100
      p.alpha = Math.random() * 0.6 + 0.4
    }
    
    // 绘制
    const gradient = ctx2d.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4)
    gradient.addColorStop(0, p.color.replace('0.8', String(p.alpha)))
    gradient.addColorStop(1, 'transparent')
    
    ctx2d.beginPath()
    ctx2d.fillStyle = gradient
    ctx2d.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2)
    ctx2d.fill()
  })
  
  animationFrameId = requestAnimationFrame(animateParticles)
}

// 创建文字碎片
function createShards() {
  if (!shardContainerRef.value) return
  
  const chars = Array.from(charRefs.value.values())
  
  chars.forEach((char, charIndex) => {
    const rect = char.getBoundingClientRect()
    const shardCount = 8 + Math.floor(Math.random() * 8)
    
    for (let i = 0; i < shardCount; i++) {
      const shard = document.createElement('div')
      shard.className = 'shard-240'
      shard.textContent = char.textContent || ''
      shard.style.fontSize = window.getComputedStyle(char).fontSize
      
      const offsetX = (Math.random() - 0.5) * rect.width
      const offsetY = (Math.random() - 0.5) * rect.height
      
      shard.style.left = (rect.left + rect.width / 2 + offsetX) + 'px'
      shard.style.top = (rect.top + rect.height / 2 + offsetY) + 'px'
      shard.style.setProperty('--tx', (Math.random() - 0.5) * 200 * props.stormIntensity + 'px')
      shard.style.setProperty('--ty', (Math.random() - 0.5) * 200 * props.stormIntensity + 'px')
      shard.style.setProperty('--r', (Math.random() - 0.5) * 720 + 'deg')
      
      shardContainerRef.value?.appendChild(shard)
      
      shards.push({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        rotation: 0,
        scale: 1,
        opacity: 1,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        vr: (Math.random() - 0.5) * 0.5,
        char: char.textContent || ''
      })
    }
  })
}

// 入场动画
function playEntryAnimation() {
  const chars = Array.from(charRefs.value.values())
  
  // 初始状态 - 被风暴撕裂
  chars.forEach((char, index) => {
    gsap.set(char, {
      opacity: 0,
      scale: 0,
      rotation: (Math.random() - 0.5) * 180,
      filter: 'blur(20px) brightness(3)'
    })
  })
  
  if (subtitleRef.value) {
    gsap.set(subtitleRef.value, {
      opacity: 0,
      y: 30,
      filter: 'blur(10px)'
    })
  }
  
  // 风暴聚集动画
  gsap.to(chars, {
    opacity: 1,
    scale: 1,
    rotation: 0,
    filter: 'blur(0px) brightness(1)',
    duration: 1.5,
    stagger: 0.08,
    ease: 'elastic.out(1, 0.6)'
  })
  
  // 副标题动画
  if (subtitleRef.value) {
    gsap.to(subtitleRef.value, {
      opacity: 0.7,
      y: 0,
      filter: 'blur(0px)',
      duration: 1,
      delay: chars.length * 0.08 + 0.5,
      ease: 'power2.out'
    })
  }
}

// 撕裂效果
function triggerStorm() {
  const chars = Array.from(charRefs.value.values())
  
  chars.forEach((char, index) => {
    const angle = Math.random() * Math.PI * 2
    const force = 50 + Math.random() * 100 * props.stormIntensity
    
    gsap.to(char, {
      x: Math.cos(angle) * force,
      y: Math.sin(angle) * force,
      rotation: (Math.random() - 0.5) * 90,
      scale: 0.8,
      filter: `blur(${Math.random() * 10}px) brightness(${1 + Math.random()})`,
      duration: 0.3,
      ease: 'power2.out',
      onComplete: () => {
        gsap.to(char, {
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          filter: 'blur(0px) brightness(1)',
          duration: 1,
          ease: 'elastic.out(1, 0.4)'
        })
      }
    })
  })
}

// 初始化
onMounted(() => {
  if (!parentRef.value) return
  
  // 初始化粒子
  initParticles()
  
  // 键盘/点击触发撕裂
  parentRef.value.addEventListener('click', triggerStorm)
  
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
              rotation: (Math.random() - 0.5) * 180,
              filter: 'blur(20px) brightness(3)'
            })
          })
          
          if (subtitleRef.value) {
            gsap.set(subtitleRef.value, { opacity: 0, y: 30, filter: 'blur(10px)' })
          }
        }
      })
      
      cleanupFns.push(() => scrollTriggerInstance?.kill())
    }, parentRef.value)
  }, 100)
  
  // 启动粒子动画
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
  
  scrollTriggerInstance?.kill()
  ScrollTrigger.getAll().forEach(st => st.kill())
  
  particles.length = 0
  shards.length = 0
  charRefs.value.clear()
  
  // 移除事件监听
  parentRef.value?.removeEventListener('click', triggerStorm)
})
</script>

<style scoped>
.particle-storm-240 {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: radial-gradient(
    ellipse at center,
    #1a0a0a 0%,
    #0d0505 50%,
    #050202 100%
  );
  font-family: 'Bebas Neue', 'Impact', sans-serif;
}

/* 风暴背景 */
.storm-bg-240 {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.storm-vortex-240 {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 150%;
  height: 150%;
  transform: translate(-50%, -50%);
  background: conic-gradient(
    from 0deg,
    transparent 0deg,
    rgba(255, 100, 50, 0.1) 60deg,
    transparent 120deg,
    rgba(255, 150, 50, 0.1) 180deg,
    transparent 240deg,
    rgba(255, 80, 80, 0.1) 300deg,
    transparent 360deg
  );
  animation: vortex-spin-240 20s linear infinite;
}

@keyframes vortex-spin-240 {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}

.storm-lightning-240 {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at 30% 20%,
    rgba(255, 200, 100, 0.1) 0%,
    transparent 50%
  );
  animation: lightning-flash-240 0.1s infinite;
  opacity: 0;
}

@keyframes lightning-flash-240 {
  0%, 90%, 100% { opacity: 0; }
  92%, 94%, 96% { opacity: 0.3; }
  93%, 95% { opacity: 0; }
}

/* 粒子画布 */
.storm-particle-canvas-240 {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 5;
}

/* 字符容器 */
.storm-char-container-240 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 0.1em;
  z-index: 10;
}

.storm-char-240 {
  display: inline-block;
  font-size: clamp(3rem, 10vw, 7rem);
  font-weight: 900;
  color: #fff;
  text-shadow: 
    0 0 20px rgba(255, 100, 50, 0.8),
    0 0 40px rgba(255, 150, 50, 0.6),
    0 0 60px rgba(255, 80, 80, 0.4),
    0 0 80px rgba(255, 200, 100, 0.2);
  user-select: none;
  will-change: transform, filter;
}

/* 副标题 */
.storm-subtitle-240 {
  position: absolute;
  top: calc(50% + 120px);
  left: 50%;
  transform: translateX(-50%);
  font-size: clamp(0.875rem, 2vw, 1.25rem);
  color: rgba(255, 180, 100, 0.7);
  letter-spacing: 0.5em;
  white-space: nowrap;
  z-index: 10;
}

/* 碎片容器 */
.shard-container-240 {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 15;
}

:deep(.shard-240) {
  position: absolute;
  font-weight: 900;
  color: rgba(255, 150, 50, 0.8);
  text-shadow: 0 0 10px rgba(255, 100, 50, 0.6);
  animation: shard-fly-240 1.5s ease-out forwards;
}

@keyframes shard-fly-240 {
  0% {
    opacity: 1;
    transform: translate(0, 0) rotate(0deg) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(var(--tx), var(--ty)) rotate(var(--r)) scale(0.3);
  }
}

/* 进度条 */
.storm-progress-240 {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, 
    rgba(255, 100, 50, 0.5), 
    rgba(255, 200, 100, 0.8),
    rgba(255, 150, 50, 0.6));
  z-index: 100;
  transition: width 0.1s ease;
  box-shadow: 0 0 15px rgba(255, 100, 50, 0.5);
}

/* 响应式 */
@media (max-width: 768px) {
  .storm-char-container-240 {
    flex-wrap: wrap;
    justify-content: center;
    max-width: 90vw;
  }

  .storm-char-240 {
    font-size: clamp(2rem, 12vw, 4rem);
  }

  .storm-subtitle-240 {
    letter-spacing: 0.2em;
    top: calc(50% + 80px);
  }
}
</style>
