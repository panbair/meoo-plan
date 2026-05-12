<template>
  <div ref="parentRef" class="seismo-section-xyz">
    <!-- 背景纸带 -->
    <div class="seismo-paper-xyz" ref="paperRef">
      <div class="paper-texture-xyz"></div>
      <div class="paper-grid-xyz" ref="gridRef"></div>
    </div>

    <!-- 墨点画布 -->
    <canvas ref="particleCanvasRef" class="seismo-particle-canvas-xyz"></canvas>

    <!-- 主内容区 -->
    <div class="seismo-main-xyz" ref="contentRef">
      <!-- 声波线条 -->
      <div class="wave-lines-xyz" ref="waveContainerRef">
        <svg class="wave-svg-xyz" :viewBox="`0 0 ${svgWidth} 200`" preserveAspectRatio="none">
          <path
            v-for="(path, index) in waveLines"
            :key="'wave-line-'+index"
            :d="path.d"
            class="wave-line-xyz"
            :style="{
              strokeWidth: path.stroke + 'px',
              opacity: path.opacity
            }"
          />
        </svg>
      </div>

      <!-- 文字显示 -->
      <div class="text-display-xyz" ref="textDisplayRef">
        <span
          v-for="(char, index) in charData"
          :key="'text-char-'+index"
          :ref="el => setCharRef(el as HTMLElement, index)"
          class="text-char-xyz"
          :style="{
            '--char-index': index,
            '--char-color': charColors[index % charColors.length]
          }"
        >{{ char }}</span>
      </div>

      <!-- 声波底部装饰 -->
      <div class="wave-decoration-xyz">
        <div v-for="i in 30" :key="'deco-'+i" class="deco-line-xyz" :style="{ '--deco-index': i }"></div>
      </div>
    </div>

    <!-- 副标题 -->
    <p class="seismo-subtitle-xyz" ref="subtitleRef">{{ subtitle }}</p>

    <!-- 进度条 -->
    <div class="seismo-progress-xyz" :style="{ width: progress + '%' }"></div>
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
}

const props = withDefaults(defineProps<Props>(), {
  title: '声波记录',
  subtitle: '振幅的轨迹 · 频率的诗篇',
  waveIntensity: 1
})

// Refs
const parentRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const paperRef = ref<HTMLElement | null>(null)
const gridRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const particleCanvasRef = ref<HTMLCanvasElement | null>(null)
const waveContainerRef = ref<HTMLElement | null>(null)
const textDisplayRef = ref<HTMLElement | null>(null)

const charRefs = ref<Map<number, HTMLElement>>(new Map())

// 状态
const progress = ref(0)
const svgWidth = 800

// 配色方案 - 深色背景配亮色文字
const charColors = [
  '#00d4ff', // 青色
  '#ff6b9d', // 粉色
  '#c44dff', // 紫色
  '#4dffb8', // 绿色
  '#ffb84d'  // 橙色
]

// 字符数据
const charData = computed(() => props.title.split(''))

// 声波线条数据
interface WaveLine {
  d: string
  stroke: number
  opacity: number
}

const waveLines = computed<WaveLine[]>(() => {
  const lines: WaveLine[] = []
  const centerY = 100
  const chars = charData.value
  const charWidth = svgWidth / chars.length
  
  // 生成多层声波
  for (let layer = 0; layer < 3; layer++) {
    let d = `M 0 ${centerY}`
    const amplitude = 30 + layer * 20
    const frequency = 0.02 + layer * 0.01
    
    for (let x = 0; x <= svgWidth; x += 5) {
      const phase = layer * 0.5
      const y = centerY + Math.sin(x * frequency + phase) * amplitude
      d += ` L ${x} ${y}`
    }
    
    lines.push({
      d,
      stroke: 2 - layer * 0.5,
      opacity: 0.6 - layer * 0.15
    })
  }
  
  return lines
})

// 墨点粒子
interface InkParticle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  color: string
  gravity: number
}

const inkParticles: InkParticle[] = []
const particleAnimationId = ref<number | null>(null)

// 清理函数
type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []
let ctx: gsap.Context | null = null
let scrollTriggerInstance: ScrollTrigger | null = null

// 设置字符 ref
function setCharRef(el: HTMLElement | null, index: number) {
  if (el) {
    charRefs.value.set(index, el)
  }
}

// 生成墨点飞溅
function spawnInkBurst(index: number) {
  const chars = Array.from(charRefs.value.values())
  const charEl = chars[index]
  if (!charEl) return
  
  const rect = charEl.getBoundingClientRect()
  const parentRect = parentRef.value?.getBoundingClientRect()
  if (!parentRect) return
  
  const centerX = rect.left - parentRect.left + rect.width / 2
  const centerY = rect.top - parentRect.top + rect.height / 2
  
  const particleCount = 6 + Math.floor(Math.random() * 6)
  const color = charColors[index % charColors.length]
  
  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2
    const speed = 1 + Math.random() * 3
    
    inkParticles.push({
      x: centerX,
      y: centerY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 2 + Math.random() * 3,
      alpha: 1,
      color,
      gravity: 0.05
    })
  }
}

// 动画墨点
function animateInkParticles() {
  const canvas = particleCanvasRef.value
  if (!canvas) return
  
  const ctx2d = canvas.getContext('2d')
  if (!ctx2d) return
  
  const rect = parentRef.value?.getBoundingClientRect()
  if (!rect) return
  
  canvas.width = rect.width
  canvas.height = rect.height
  
  ctx2d.clearRect(0, 0, canvas.width, canvas.height)
  
  inkParticles.forEach((p, idx) => {
    p.x += p.vx
    p.y += p.vy
    p.vy += p.gravity
    p.alpha -= 0.02
    p.size *= 0.97
    
    if (p.alpha <= 0 || p.size < 0.5) {
      inkParticles.splice(idx, 1)
      return
    }
    
    ctx2d.beginPath()
    ctx2d.fillStyle = p.color.replace(')', `, ${p.alpha})`).replace('rgb', 'rgba').replace('#', '')
    
    // 转换 hex 到 rgba
    const hex = p.color.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    ctx2d.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha})`
    
    ctx2d.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    ctx2d.fill()
  })
  
  particleAnimationId.value = requestAnimationFrame(animateInkParticles)
}

// 入场动画
function playEntryAnimation() {
  const chars = Array.from(charRefs.value.values())
  
  // 初始状态 - 文字透明，声波明显
  gsap.set(chars, {
    opacity: 0,
    y: 30,
    scale: 0.8,
    filter: 'blur(10px)'
  })
  
  gsap.set(waveContainerRef.value, {
    opacity: 0.3
  })
  
  if (subtitleRef.value) {
    gsap.set(subtitleRef.value, {
      opacity: 0,
      y: 20
    })
  }
  
  // 创建Timeline
  const tl = gsap.timeline()
  
  // 阶段1: 声波增强
  tl.to(waveContainerRef.value, {
    opacity: 1,
    duration: 0.8,
    ease: 'power2.out'
  })
  
  // 阶段2: 文字逐个显现
  chars.forEach((char, index) => {
    tl.to(char, {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      duration: 0.5,
      ease: 'back.out(1.7)',
      onStart: () => {
        spawnInkBurst(index)
      }
    }, `+=0.1`)
  })
  
  // 阶段3: 声波淡出
  tl.to(waveContainerRef.value, {
    opacity: 0,
    duration: 1,
    ease: 'power2.inOut'
  }, '-=0.5')
  
  // 副标题
  tl.to(subtitleRef.value, {
    opacity: 0.8,
    y: 0,
    duration: 0.8,
    ease: 'power2.out'
  }, '-=0.3')
}

// 鼠标hover效果
function setupHoverEffect() {
  const chars = Array.from(charRefs.value.values())
  
  chars.forEach((char, index) => {
    char.addEventListener('mouseenter', () => {
      // 放大效果
      gsap.to(char, {
        scale: 1.2,
        duration: 0.3,
        ease: 'power2.out'
      })
      
      // 触发墨点
      spawnInkBurst(index)
    })
    
    char.addEventListener('mouseleave', () => {
      gsap.to(char, {
        scale: 1,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)'
      })
    })
  })
}

// 初始化
onMounted(() => {
  if (!parentRef.value) return
  
  // 启动墨点动画
  animateInkParticles()
  
  setTimeout(() => {
    ctx = gsap.context(() => {
      // 入场动画
      playEntryAnimation()
      
      // Hover效果
      setupHoverEffect()
      
      // ScrollTrigger
      scrollTriggerInstance = ScrollTrigger.create({
        trigger: parentRef.value,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 1.5,
        onUpdate: (self) => {
          progress.value = self.progress * 100
          
          // 纸张滚动效果
          if (paperRef.value) {
            gsap.set(paperRef.value, {
              x: -self.progress * 50
            })
          }
          
          // 网格透明度
          if (gridRef.value) {
            gsap.set(gridRef.value, {
              opacity: 0.1 + self.progress * 0.4
            })
          }
        },
        onEnter: () => {
          playEntryAnimation()
        },
        onLeaveBack: () => {
          const chars = Array.from(charRefs.value.values())
          
          gsap.set(chars, {
            opacity: 0,
            y: 30,
            scale: 0.8,
            filter: 'blur(10px)'
          })
          
          gsap.set(waveContainerRef.value, {
            opacity: 0.3
          })
          
          if (subtitleRef.value) {
            gsap.set(subtitleRef.value, { opacity: 0, y: 20 })
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
  
  if (particleAnimationId.value !== null) {
    cancelAnimationFrame(particleAnimationId.value)
    particleAnimationId.value = null
  }
  
  scrollTriggerInstance?.kill()
  ScrollTrigger.getAll().forEach(st => st.kill())
  
  inkParticles.length = 0
  charRefs.value.clear()
})
</script>

<style scoped>
.seismo-section-xyz {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(
    180deg,
    #0a0a12 0%,
    #12121f 30%,
    #0a0a12 70%,
    #080810 100%
  );
  font-family: 'Noto Serif SC', 'SimSun', serif;
}

/* 背景纸带 */
.seismo-paper-xyz {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 900px;
  height: 350px;
  background: linear-gradient(
    180deg,
    #1a1a28 0%,
    #1e1e2e 50%,
    #16162a 100%
  );
  border-radius: 8px;
  box-shadow: 
    0 0 60px rgba(0, 0, 0, 0.8),
    0 0 120px rgba(100, 100, 150, 0.1),
    inset 0 0 80px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.paper-texture-xyz {
  position: absolute;
  inset: 0;
  background: 
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 3px,
      rgba(255, 255, 255, 0.01) 3px,
      rgba(255, 255, 255, 0.01) 4px
    );
}

.paper-grid-xyz {
  position: absolute;
  inset: 0;
  background: 
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 40px,
      rgba(255, 255, 255, 0.03) 40px,
      rgba(255, 255, 255, 0.03) 41px
    ),
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 40px,
      rgba(255, 255, 255, 0.02) 40px,
      rgba(255, 255, 255, 0.02) 41px
    );
  opacity: 0.3;
}

/* 墨点画布 */
.seismo-particle-canvas-xyz {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 30;
}

/* 主内容区 */
.seismo-main-xyz {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 800px;
  z-index: 10;
}

/* 声波线条 */
.wave-lines-xyz {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  height: 200px;
  opacity: 0;
}

.wave-svg-xyz {
  width: 100%;
  height: 100%;
}

.wave-line-xyz {
  fill: none;
  stroke: linear-gradient(90deg, #00d4ff, #ff6b9d, #c44dff);
  stroke-linecap: round;
}

/* 文字显示 */
.text-display-xyz {
  display: flex;
  justify-content: center;
  gap: 0.1em;
  padding: 40px 0;
}

.text-char-xyz {
  display: inline-block;
  font-size: clamp(3rem, 10vw, 6rem);
  font-weight: 700;
  color: var(--char-color);
  text-shadow: 
    0 0 20px var(--char-color),
    0 0 40px var(--char-color),
    0 0 60px var(--char-color),
    0 2px 4px rgba(0, 0, 0, 0.8);
  user-select: none;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.text-char-xyz:hover {
  transform: scale(1.1);
}

/* 声波底部装饰 */
.wave-decoration-xyz {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
  height: 30px;
}

.deco-line-xyz {
  width: 2px;
  height: 100%;
  background: linear-gradient(180deg, 
    transparent 0%,
    rgba(100, 100, 150, 0.5) 50%,
    transparent 100%
  );
  animation: deco-pulse-xyz 1.5s ease-in-out infinite;
  animation-delay: calc(var(--deco-index) * 0.05s);
}

@keyframes deco-pulse-xyz {
  0%, 100% { opacity: 0.3; transform: scaleY(0.8); }
  50% { opacity: 0.8; transform: scaleY(1.2); }
}

/* 副标题 */
.seismo-subtitle-xyz {
  position: absolute;
  bottom: 15%;
  left: 50%;
  transform: translateX(-50%);
  font-size: clamp(0.8rem, 1.5vw, 1rem);
  color: rgba(200, 200, 230, 0.7);
  letter-spacing: 0.5em;
  white-space: nowrap;
  z-index: 10;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
}

/* 进度条 */
.seismo-progress-xyz {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, 
    #00d4ff 0%,
    #c44dff 50%,
    #ff6b9d 100%
  );
  z-index: 100;
  transition: width 0.1s ease;
  box-shadow: 0 0 15px rgba(0, 212, 255, 0.5);
}

/* 响应式 */
@media (max-width: 768px) {
  .seismo-paper-xyz {
    width: 95%;
    height: 280px;
  }

  .text-char-xyz {
    font-size: clamp(2rem, 12vw, 4rem);
  }

  .seismo-subtitle-xyz {
    letter-spacing: 0.2em;
    font-size: 0.7rem;
    bottom: 10%;
  }

  .wave-decoration-xyz {
    gap: 4px;
  }

  .deco-line-xyz {
    width: 1px;
  }
}
</style>
