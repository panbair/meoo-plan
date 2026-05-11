<template>
  <div ref="parentRef" class="bio-section-245">
    <!-- 海底背景 -->
    <div class="bio-bg-245">
      <div class="ocean-depth-245"></div>
      <div class="bio-glow-245"></div>
      <div class="seaweed-245">
        <svg viewBox="0 0 200 300" preserveAspectRatio="none">
          <path
            v-for="i in 8"
            :key="i"
            :d="`M ${i * 25} 300 Q ${i * 25 + 10} ${150 + Math.sin(i) * 30} ${i * 25} 0`"
            fill="none"
            stroke="rgba(50, 150, 100, 0.3)"
            stroke-width="4"
            class="seaweed-path-245"
            :style="{ animationDelay: (i * 0.3) + 's' }"
          />
        </svg>
      </div>
    </div>

    <!-- 生物发光粒子 -->
    <canvas ref="particleCanvasRef" class="bio-particle-canvas-245"></canvas>

    <!-- 字符容器 -->
    <div class="bio-char-container-245" ref="charContainerRef">
      <span
        v-for="(item, index) in charData"
        :key="item.key"
        :ref="el => setCharRef(el as HTMLElement, index)"
        class="bio-char-245"
        :style="{
          '--glow-color': glowColors[index % glowColors.length]
        }"
      >{{ item.char }}</span>
    </div>

    <!-- 副标题 -->
    <p class="bio-subtitle-245" ref="subtitleRef">{{ subtitle }}</p>

    <!-- 气泡装饰 -->
    <div class="bubbles-245">
      <span v-for="i in 15" :key="i" class="bubble-245" :style="{
        left: (i * 7) + '%',
        animationDelay: (i * 0.5) + 's',
        animationDuration: (8 + Math.random() * 4) + 's'
      }"></span>
    </div>

    <!-- 进度条 -->
    <div class="bio-progress-245" :style="{ width: progress + '%' }"></div>
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
  glowIntensity?: number
}

const props = withDefaults(defineProps<Props>(), {
  title: '生物发光',
  subtitle: '深海的幽蓝 · 生命的脉动',
  glowIntensity: 1
})

// Refs
const parentRef = ref<HTMLElement | null>(null)
const charContainerRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const particleCanvasRef = ref<HTMLCanvasElement | null>(null)

const charRefs = ref<Map<number, HTMLElement>>(new Map())

// 状态
const progress = ref(0)

// 发光配色
const glowColors = [
  'rgba(0, 255, 200, 0.9)',
  'rgba(100, 255, 200, 0.8)',
  'rgba(0, 200, 255, 0.85)',
  'rgba(150, 255, 220, 0.8)',
  'rgba(50, 255, 180, 0.9)'
]

// 字符数据
const charData = computed(() => {
  return props.title.split('').map((char, index) => ({
    char,
    index,
    key: `bio-char-${index}`
  }))
})

// 发光粒子
interface GlowParticle {
  x: number
  y: number
  size: number
  alpha: number
  pulsePhase: number
  pulseSpeed: number
  color: string
  driftX: number
  driftY: number
}

const glowParticles: GlowParticle[] = []

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

// 初始化发光粒子
function initGlowParticles() {
  if (!parentRef.value) return
  
  const rect = parentRef.value.getBoundingClientRect()
  
  for (let i = 0; i < 80; i++) {
    glowParticles.push({
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      size: Math.random() * 4 + 2,
      alpha: Math.random() * 0.4 + 0.2,
      pulsePhase: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
      color: glowColors[Math.floor(Math.random() * glowColors.length)],
      driftX: (Math.random() - 0.5) * 0.5,
      driftY: -Math.random() * 0.3 - 0.1
    })
  }
}

// 动画发光粒子
function animateGlowParticles() {
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
  
  glowParticles.forEach(p => {
    // 脉冲呼吸
    const pulse = Math.sin(time * p.pulseSpeed * 60 + p.pulsePhase)
    const currentAlpha = p.alpha * (0.5 + pulse * 0.5) * props.glowIntensity
    
    // 漂浮移动
    p.x += p.driftX
    p.y += p.driftY
    
    // 边界重生
    if (p.y < -20) {
      p.y = rect.height + 20
      p.x = Math.random() * rect.width
    }
    if (p.x < -20) p.x = rect.width + 20
    if (p.x > rect.width + 20) p.x = -20
    
    // 绘制发光核心
    const gradient = ctx2d.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 6)
    gradient.addColorStop(0, p.color.replace('0.9', String(currentAlpha)))
    gradient.addColorStop(0.2, p.color.replace('0.9', String(currentAlpha * 0.6)))
    gradient.addColorStop(0.5, p.color.replace('0.9', String(currentAlpha * 0.2)))
    gradient.addColorStop(1, 'transparent')
    
    ctx2d.beginPath()
    ctx2d.fillStyle = gradient
    ctx2d.arc(p.x, p.y, p.size * 6, 0, Math.PI * 2)
    ctx2d.fill()
    
    // 核心亮点
    ctx2d.beginPath()
    ctx2d.fillStyle = `rgba(255, 255, 255, ${currentAlpha * 0.8})`
    ctx2d.arc(p.x, p.y, p.size * 0.3, 0, Math.PI * 2)
    ctx2d.fill()
  })
  
  animationFrameId = requestAnimationFrame(animateGlowParticles)
}

// 字符发光动画
function animateCharGlow() {
  const chars = Array.from(charRefs.value.values())
  
  chars.forEach((char, index) => {
    const color = glowColors[index % glowColors.length]
    const time = Date.now() * 0.001
    const pulse = Math.sin(time * 2 + index * 0.5) * 0.3 + 0.7
    
    gsap.to(char, {
      textShadow: `
        0 0 ${10 * pulse}px ${color},
        0 0 ${20 * pulse}px ${color},
        0 0 ${40 * pulse}px ${color},
        0 0 ${60 * pulse}px ${color.replace('0.9', '0.4')}
      `,
      duration: 0.5,
      ease: 'power1.out'
    })
  })
}

// 入场动画
function playEntryAnimation() {
  const chars = Array.from(charRefs.value.values())
  
  // 初始状态 - 深海沉睡
  chars.forEach((char, index) => {
    gsap.set(char, {
      opacity: 0,
      scale: 0.5,
      filter: 'blur(15px) brightness(0.3)'
    })
  })
  
  if (subtitleRef.value) {
    gsap.set(subtitleRef.value, {
      opacity: 0,
      y: 20,
      filter: 'blur(10px)'
    })
  }
  
  // 逐个唤醒
  gsap.to(chars, {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px) brightness(1)',
    duration: 1.2,
    stagger: 0.15,
    ease: 'power2.out'
  })
  
  // 副标题动画
  if (subtitleRef.value) {
    gsap.to(subtitleRef.value, {
      opacity: 0.6,
      y: 0,
      filter: 'blur(0px)',
      duration: 1,
      delay: chars.length * 0.15 + 0.5,
      ease: 'power2.out'
    })
  }
}

// 初始化
onMounted(() => {
  if (!parentRef.value) return
  
  // 初始化粒子
  initGlowParticles()
  
  // 启动粒子动画
  animateGlowParticles()
  
  // 字符发光动画
  setInterval(animateCharGlow, 500)
  
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
          chars.forEach((char) => {
            gsap.set(char, {
              opacity: 0,
              scale: 0.5,
              filter: 'blur(15px) brightness(0.3)'
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
  
  glowParticles.length = 0
  charRefs.value.clear()
})
</script>

<style scoped>
.bio-section-245 {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(
    180deg,
    #020a15 0%,
    #051520 30%,
    #0a2535 60%,
    #052030 100%
  );
  font-family: 'Noto Serif SC', 'SimSun', serif;
}

/* 海底背景 */
.bio-bg-245 {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.ocean-depth-245 {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40%;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(10, 30, 50, 0.5) 50%,
    rgba(5, 15, 25, 0.8) 100%
  );
}

.bio-glow-245 {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  transform: translate(-50%, -50%);
  background: radial-gradient(
    ellipse at 50% 50%,
    rgba(0, 200, 180, 0.08) 0%,
    transparent 50%
  );
  animation: bio-glow-pulse-245 6s ease-in-out infinite;
}

@keyframes bio-glow-pulse-245 {
  0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.1); }
}

.seaweed-245 {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 300px;
  opacity: 0.6;

  svg {
    width: 100%;
    height: 100%;
  }
}

.seaweed-path-245 {
  animation: seaweed-sway-245 4s ease-in-out infinite;
  transform-origin: bottom center;
}

@keyframes seaweed-sway-245 {
  0%, 100% { transform: rotate(-3deg); }
  50% { transform: rotate(3deg); }
}

/* 粒子画布 */
.bio-particle-canvas-245 {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 5;
}

/* 字符容器 */
.bio-char-container-245 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 0.15em;
  z-index: 10;
}

.bio-char-245 {
  display: inline-block;
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: 400;
  color: rgba(200, 255, 240, 0.95);
  text-shadow: 
    0 0 10px var(--glow-color),
    0 0 20px var(--glow-color),
    0 0 40px var(--glow-color);
  user-select: none;
  will-change: text-shadow;
}

/* 副标题 */
.bio-subtitle-245 {
  position: absolute;
  top: calc(50% + 100px);
  left: 50%;
  transform: translateX(-50%);
  font-size: clamp(0.75rem, 1.5vw, 1rem);
  color: rgba(150, 220, 200, 0.6);
  letter-spacing: 0.5em;
  white-space: nowrap;
  z-index: 10;
}

/* 气泡 */
.bubbles-245 {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 4;
}

.bubble-245 {
  position: absolute;
  bottom: -20px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: radial-gradient(
    circle at 30% 30%,
    rgba(255, 255, 255, 0.4),
    rgba(100, 200, 255, 0.2) 50%,
    transparent
  );
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: bubble-rise-245 linear infinite;
}

@keyframes bubble-rise-245 {
  0% {
    transform: translateY(0) scale(1);
    opacity: 0.6;
  }
  100% {
    transform: translateY(-110vh) scale(0.5);
    opacity: 0;
  }
}

/* 进度条 */
.bio-progress-245 {
  position: fixed;
  top: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, 
    rgba(0, 200, 180, 0.5), 
    rgba(100, 255, 220, 0.8),
    rgba(0, 200, 180, 0.6));
  z-index: 100;
  transition: width 0.1s ease;
  box-shadow: 0 0 15px rgba(0, 200, 180, 0.5);
}

/* 响应式 */
@media (max-width: 768px) {
  .bio-char-container-245 {
    flex-wrap: wrap;
    justify-content: center;
    max-width: 90vw;
  }

  .bio-char-245 {
    font-size: clamp(2rem, 10vw, 3.5rem);
  }

  .bio-subtitle-245 {
    letter-spacing: 0.2em;
    font-size: 0.7rem;
  }
}
</style>
