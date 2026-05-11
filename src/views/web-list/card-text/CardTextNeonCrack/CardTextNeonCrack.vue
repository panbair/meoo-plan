<template>
  <div ref="parentRef" class="neon-crack-243">
    <!-- 裂纹背景 -->
    <div class="crack-bg-243">
      <div class="crack-lines-243" ref="crackLinesRef"></div>
      <div class="energy-pulse-243"></div>
    </div>

    <!-- 粒子画布 -->
    <canvas ref="particleCanvasRef" class="crack-particle-canvas-243"></canvas>

    <!-- 字符容器 -->
    <div class="crack-char-container-243" ref="charContainerRef">
      <span
        v-for="(item, index) in charData"
        :key="item.key"
        :ref="el => setCharRef(el as HTMLElement, index)"
        class="crack-char-243"
        :style="{
          '--char-color': colors[index % colors.length]
        }"
      >{{ item.char }}</span>
    </div>

    <!-- 副标题 -->
    <p class="crack-subtitle-243" ref="subtitleRef">{{ subtitle }}</p>

    <!-- 电弧装饰 -->
    <div class="arc-decor-243">
      <svg viewBox="0 0 1200 100" preserveAspectRatio="none">
        <path
          v-for="i in 6"
          :key="i"
          :d="`M ${200 * i - 100} 50 ${200 * i - 50} ${Math.random() > 0.5 ? 20 : 80} ${200 * i} 50`"
          fill="none"
          stroke="rgba(100, 255, 200, 0.3)"
          stroke-width="2"
          class="arc-path-243"
        />
      </svg>
    </div>

    <!-- 进度条 -->
    <div class="crack-progress-243" :style="{ width: progress + '%' }"></div>
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
  crackIntensity?: number
}

const props = withDefaults(defineProps<Props>(), {
  title: '霓虹裂纹',
  subtitle: '破界 · 绽放 · 电光',
  crackIntensity: 1
})

// Refs
const parentRef = ref<HTMLElement | null>(null)
const charContainerRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const particleCanvasRef = ref<HTMLCanvasElement | null>(null)
const crackLinesRef = ref<HTMLElement | null>(null)

const charRefs = ref<Map<number, HTMLElement>>(new Map())

// 状态
const progress = ref(0)

// 配色
const colors = [
  'rgba(0, 255, 200, 1)',
  'rgba(100, 200, 255, 1)',
  'rgba(200, 100, 255, 1)',
  'rgba(255, 100, 150, 1)',
  'rgba(255, 200, 100, 1)'
]

// 字符数据
const charData = computed(() => {
  return props.title.split('').map((char, index) => ({
    char,
    index,
    key: `crack-char-${index}`
  }))
})

// 电弧粒子
interface ArcParticle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  life: number
  color: string
}

const arcParticles: ArcParticle[] = []

// 清理函数
type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []
let ctx: gsap.Context | null = null
let scrollTriggerInstance: ScrollTrigger | null = null
let animationFrameId: number | null = null
let crackInterval: number | null = null

// 设置字符 ref
function setCharRef(el: HTMLElement | null, index: number) {
  if (el) {
    charRefs.value.set(index, el)
  }
}

// 生成裂纹
function generateCrackLines() {
  if (!crackLinesRef.value) return
  
  const svg = crackLinesRef.value
  svg.innerHTML = ''
  
  const paths: string[] = []
  
  for (let i = 0; i < 8; i++) {
    let path = `M ${Math.random() * 200} ${Math.random() * 100}`
    
    for (let j = 0; j < 8; j++) {
      const x = parseFloat(path.split(' ').slice(-2)[0]) + (Math.random() - 0.5) * 150
      const y = parseFloat(path.split(' ').slice(-1)[0]) + (Math.random() - 0.5) * 100
      path += ` L ${Math.max(0, Math.min(1440, x))} ${Math.max(0, Math.min(900, y))}`
    }
    
    paths.push(path)
    
    const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    pathEl.setAttribute('d', path)
    pathEl.setAttribute('fill', 'none')
    pathEl.setAttribute('stroke', colors[Math.floor(Math.random() * colors.length)].replace('1)', '0.3)'))
    pathEl.setAttribute('stroke-width', (Math.random() * 2 + 1).toString())
    pathEl.classList.add('crack-line-243')
    
    svg.appendChild(pathEl)
  }
}

// 初始化电弧粒子
function initArcParticles() {
  if (!parentRef.value) return
  
  const rect = parentRef.value.getBoundingClientRect()
  
  const colorStrings = colors.map(c => c.replace('1)', '0.8)'))
  
  for (let i = 0; i < 100; i++) {
    arcParticles.push({
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      vx: (Math.random() - 0.5) * 5,
      vy: (Math.random() - 0.5) * 5,
      size: Math.random() * 3 + 1,
      alpha: Math.random() * 0.5 + 0.5,
      life: Math.random() * 100 + 50,
      color: colorStrings[Math.floor(Math.random() * colorStrings.length)]
    })
  }
}

// 动画电弧粒子
function animateArcParticles() {
  const canvas = particleCanvasRef.value
  if (!canvas) return
  
  const ctx2d = canvas.getContext('2d')
  if (!ctx2d) return
  
  const rect = parentRef.value?.getBoundingClientRect()
  if (!rect) return
  
  canvas.width = rect.width
  canvas.height = rect.height
  
  ctx2d.clearRect(0, 0, canvas.width, canvas.height)
  
  const time = Date.now() * 0.001
  
  arcParticles.forEach(p => {
    // 随机运动
    p.x += p.vx + Math.sin(time + p.life) * 2
    p.y += p.vy + Math.cos(time + p.life) * 2
    
    // 闪烁
    p.alpha = 0.3 + Math.sin(time * 5 + p.life) * 0.3
    p.life--
    
    // 重生
    if (p.life <= 0 || p.x < 0 || p.x > rect.width || p.y < 0 || p.y > rect.height) {
      p.x = Math.random() * rect.width
      p.y = Math.random() * rect.height
      p.life = Math.random() * 100 + 50
      p.alpha = Math.random() * 0.5 + 0.5
    }
    
    // 绘制
    const gradient = ctx2d.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 5)
    gradient.addColorStop(0, p.color)
    gradient.addColorStop(1, 'transparent')
    
    ctx2d.beginPath()
    ctx2d.fillStyle = gradient
    ctx2d.arc(p.x, p.y, p.size * 5, 0, Math.PI * 2)
    ctx2d.fill()
    
    // 电弧核心
    ctx2d.beginPath()
    ctx2d.strokeStyle = `rgba(255, 255, 255, ${p.alpha})`
    ctx2d.lineWidth = 0.5
    ctx2d.moveTo(p.x, p.y)
    ctx2d.lineTo(p.x + Math.random() * 10 - 5, p.y + Math.random() * 10 - 5)
    ctx2d.stroke()
  })
  
  animationFrameId = requestAnimationFrame(animateArcParticles)
}

// 入场动画
function playEntryAnimation() {
  const chars = Array.from(charRefs.value.values())
  
  // 初始状态 - 裂纹构建
  chars.forEach((char, index) => {
    gsap.set(char, {
      opacity: 0,
      scale: () => 0.5 + Math.random() * 0.5,
      filter: `blur(${10 + Math.random() * 20}px) brightness(3)`,
      textShadow: '0 0 50px var(--char-color)'
    })
  })
  
  if (subtitleRef.value) {
    gsap.set(subtitleRef.value, {
      opacity: 0,
      y: 20,
      filter: 'blur(10px)'
    })
  }
  
  // 生成裂纹
  generateCrackLines()
  
  // 逐字爆裂入场
  gsap.to(chars, {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px) brightness(1)',
    textShadow: `
      0 0 5px var(--char-color),
      0 0 10px var(--char-color),
      0 0 20px var(--char-color),
      0 0 40px var(--char-color)
    `,
    duration: 0.8,
    stagger: 0.08,
    ease: 'elastic.out(1, 0.5)'
  })
  
  // 副标题动画
  if (subtitleRef.value) {
    gsap.to(subtitleRef.value, {
      opacity: 0.7,
      y: 0,
      filter: 'blur(0px)',
      duration: 1,
      delay: chars.length * 0.08 + 0.3,
      ease: 'power2.out'
    })
  }
}

// 裂纹闪烁
function triggerCrackFlicker() {
  const chars = Array.from(charRefs.value.values())
  
  chars.forEach((char, index) => {
    if (Math.random() > 0.5) {
      gsap.to(char, {
        opacity: () => 0.5 + Math.random() * 0.5,
        filter: () => `brightness(${1 + Math.random() * 2})`,
        duration: 0.05,
        ease: 'none',
        onComplete: () => {
          gsap.to(char, {
            opacity: 1,
            filter: 'brightness(1)',
            duration: 0.1
          })
        }
      })
    }
  })
}

// 初始化
onMounted(() => {
  if (!parentRef.value) return
  
  // 初始化粒子
  initArcParticles()
  
  // 随机裂纹闪烁
  crackInterval = window.setInterval(triggerCrackFlicker, 150)
  
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
              scale: () => 0.5 + Math.random() * 0.5,
              filter: `blur(${10 + Math.random() * 20}px) brightness(3)`
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
  animateArcParticles()
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
  
  if (crackInterval !== null) {
    clearInterval(crackInterval)
    crackInterval = null
  }
  
  scrollTriggerInstance?.kill()
  ScrollTrigger.getAll().forEach(st => st.kill())
  
  arcParticles.length = 0
  charRefs.value.clear()
})
</script>

<style scoped>
.neon-crack-243 {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: radial-gradient(
    ellipse at 50% 50%,
    #0a0a15 0%,
    #050510 50%,
    #020208 100%
  );
  font-family: 'Bebas Neue', 'Oswald', sans-serif;
}

/* 裂纹背景 */
.crack-bg-243 {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.crack-lines-243 {
  position: absolute;
  inset: 0;

  svg {
    width: 100%;
    height: 100%;
  }
}

:deep(.crack-line-243) {
  animation: crack-pulse-243 2s ease-in-out infinite;
}

@keyframes crack-pulse-243 {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
}

.energy-pulse-243 {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  transform: translate(-50%, -50%);
  background: radial-gradient(
    ellipse at center,
    rgba(0, 255, 200, 0.05) 0%,
    transparent 50%
  );
  animation: energy-pulse-243 3s ease-in-out infinite;
}

@keyframes energy-pulse-243 {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
  50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.8; }
}

/* 粒子画布 */
.crack-particle-canvas-243 {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 5;
}

/* 字符容器 */
.crack-char-container-243 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 0.05em;
  z-index: 10;
}

.crack-char-243 {
  display: inline-block;
  font-size: clamp(3rem, 10vw, 6rem);
  font-weight: 700;
  color: #fff;
  text-shadow: 
    0 0 5px var(--char-color),
    0 0 10px var(--char-color),
    0 0 20px var(--char-color),
    0 0 40px var(--char-color);
  user-select: none;
  will-change: transform, filter, textShadow;
  position: relative;
}

.crack-char-243::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    45deg,
    transparent 40%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 60%
  );
  animation: char-shine-243 2s ease-in-out infinite;
}

@keyframes char-shine-243 {
  0%, 100% { transform: translateX(-100%); }
  50% { transform: translateX(100%); }
}

/* 副标题 */
.crack-subtitle-243 {
  position: absolute;
  top: calc(50% + 110px);
  left: 50%;
  transform: translateX(-50%);
  font-size: clamp(0.875rem, 2vw, 1.25rem);
  color: rgba(100, 255, 200, 0.7);
  letter-spacing: 0.5em;
  white-space: nowrap;
  z-index: 10;
}

/* 电弧装饰 */
.arc-decor-243 {
  position: absolute;
  bottom: 20%;
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

.arc-path-243 {
  animation: arc-flash-243 0.2s infinite;
}

@keyframes arc-flash-243 {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.8; }
}

/* 进度条 */
.crack-progress-243 {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, 
    rgba(0, 255, 200, 0.5), 
    rgba(100, 200, 255, 0.8),
    rgba(0, 255, 200, 0.6));
  z-index: 100;
  transition: width 0.1s ease;
  box-shadow: 0 0 15px rgba(0, 255, 200, 0.5);
}

/* 响应式 */
@media (max-width: 768px) {
  .crack-char-container-243 {
    flex-wrap: wrap;
    justify-content: center;
    max-width: 90vw;
  }

  .crack-char-243 {
    font-size: clamp(2rem, 12vw, 4rem);
  }

  .crack-subtitle-243 {
    letter-spacing: 0.2em;
    font-size: 0.75rem;
  }
}
</style>
