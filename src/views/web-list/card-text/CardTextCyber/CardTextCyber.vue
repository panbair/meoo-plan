<template>
  <div
    class="cyber-section-112"
    ref="sectionRef"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <!-- 数据流背景 -->
    <canvas ref="dataStreamCanvasRef" class="cyber-canvas-112"></canvas>
    
    <!-- 扫描线 -->
    <div class="cyber-scanline-112" ref="scanlineRef">
      <div class="cyber-scan-beam-112"></div>
    </div>
    
    <!-- 棚格背景 -->
    <div class="cyber-grid-112"></div>
    
    <!-- 内容层 -->
    <div class="cyber-content-112" ref="contentRef">
      <!-- 副标题 -->
      <p
        v-if="subtitle"
        class="cyber-subtitle-112"
        ref="subtitleRef"
      >
        {{ subtitle }}
      </p>
      
      <!-- 主标题 -->
      <h1 class="cyber-title-112" ref="titleRef">
        <span
          v-for="item in titleChars"
          :key="item.key"
          class="cyber-char-112"
          :ref="el => setCharRef(el, item.index)"
          :data-char="item.char"
        >
          <span class="cyber-char-display-112">{{ item.display }}</span>
          <span class="cyber-char-glow-112">{{ item.char }}</span>
        </span>
      </h1>
      
      <!-- 段落 -->
      <div class="cyber-paragraphs-112" ref="paragraphsRef">
        <p
          v-for="(para, index) in paragraphs"
          :key="index"
          class="cyber-text-112"
          :ref="el => setParaRef(el, index)"
          :data-text="para"
        >
          <span class="cyber-text-display-112">{{ para }}</span>
          <span class="cyber-text-glow-112">{{ para }}</span>
        </p>
      </div>
    </div>
    
    <!-- 进度条 -->
    <div
      class="cyber-progress-112"
      :style="{ width: progress + '%' }"
    ></div>
    
    <!-- 终端信息 -->
    <div class="cyber-terminal-112">
      <span class="cyber-terminal-prompt-112">></span>
      <span class="cyber-terminal-text-112">DATA STREAM {{ currentTime }}</span>
    </div>
    
    <!-- 滚动提示 -->
    <div class="cyber-scroll-hint-112" :class="{ hidden: scrollHintHidden }">
      <span>SCROLL TO DECRYPT</span>
      <div class="cyber-scroll-arrow">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
    
    <!-- CRT 干扰效果 -->
    <div class="cyber-crt-112" ref="crtRef"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Props 定义
interface Props {
  title?: string
  subtitle?: string
  paragraphs?: string[]
  glowColor?: string
  scanSpeed?: number
}

const props = withDefaults(defineProps<Props>(), {
  title: 'CYBER',
  subtitle: '',
  paragraphs: () => [],
  glowColor: '#00ff88',
  scanSpeed: 1.5
})

// Emits 定义
const emit = defineEmits<{
  'animation-start': []
  'animation-complete': []
  'scroll-progress': [progress: number]
}>()

// Refs
const sectionRef = ref<HTMLElement | null>(null)
const dataStreamCanvasRef = ref<HTMLCanvasElement | null>(null)
const scanlineRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const paragraphsRef = ref<HTMLElement | null>(null)
const crtRef = ref<HTMLElement | null>(null)
const charRefs = ref<Map<number, HTMLElement>>(new Map())
const paraRefs = ref<Map<number, HTMLElement>>(new Map())

// 状态
const progress = ref(0)
const scrollHintHidden = ref(false)
const currentTime = ref('00:00:00')
const scanlineTop = ref(0)

// 清理函数类型
type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []
let ctx: gsap.Context | null = null
let scrollTriggerInstance: ScrollTrigger | null = null
let animationFrameId: number | null = null
let dataStreamColumns: DataColumn[] = []
let tickerIntervalId: number | null = null
let lastTime = 0

interface DataColumn {
  x: number
  y: number
  speed: number
  chars: string[]
  currentIndex: number
}

// 乱码字符集
const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz<>{}[];'

// 字符数据
const titleChars = computed(() => {
  if (!props.title) return []
  return props.title.split('').map((char, index) => ({
    char,
    index,
    key: `char-${index}`,
    display: char,
    isDecrypted: false
  }))
})

// 设置字符 ref
const setCharRef = (el: HTMLElement | null, index: number) => {
  if (el) {
    charRefs.value.set(index, el)
  }
}

// 设置段落 ref
const setParaRef = (el: HTMLElement | null, index: number) => {
  if (el) {
    paraRefs.value.set(index, el)
  }
}

// 初始化数据流
const initDataStream = () => {
  if (!dataStreamCanvasRef.value) return
  
  const canvas = dataStreamCanvasRef.value
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  
  dataStreamColumns = []
  const columnWidth = 20
  const columnsCount = Math.ceil(canvas.width / columnWidth)
  
  for (let i = 0; i < columnsCount; i++) {
    dataStreamColumns.push({
      x: i * columnWidth,
      y: Math.random() * canvas.height,
      speed: 2 + Math.random() * 4,
      chars: Array.from({ length: 10 + Math.floor(Math.random() * 15) }, () =>
        glitchChars[Math.floor(Math.random() * glitchChars.length)]
      ),
      currentIndex: 0
    })
  }
}

// 动画数据流
const animateDataStream = () => {
  if (!dataStreamCanvasRef.value) return
  
  const canvas = dataStreamCanvasRef.value
  const ctx2d = canvas.getContext('2d')
  if (!ctx2d) return
  
  ctx2d.fillStyle = 'rgba(0, 0, 0, 0.1)'
  ctx2d.fillRect(0, 0, canvas.width, canvas.height)
  
  ctx2d.font = '14px monospace'
  
  dataStreamColumns.forEach(column => {
    // 更新位置
    column.y += column.speed
    
    // 重置到顶部
    if (column.y > canvas.height + 200) {
      column.y = -200
      column.speed = 2 + Math.random() * 4
      column.chars = Array.from({ length: 10 + Math.floor(Math.random() * 15) }, () =>
        glitchChars[Math.floor(Math.random() * glitchChars.length)]
      )
    }
    
    // 绘制字符
    for (let i = 0; i < column.chars.length; i++) {
      const charY = column.y - i * 20
      
      if (charY > 0 && charY < canvas.height) {
        // 头部更亮
        const brightness = i === 0 ? 255 : 100 - i * 5
        ctx2d.fillStyle = `rgba(0, 255, 136, ${brightness / 255})`
        
        // 随机更新字符
        if (Math.random() < 0.05) {
          column.chars[i] = glitchChars[Math.floor(Math.random() * glitchChars.length)]
        }
        
        ctx2d.fillText(column.chars[i], column.x, charY)
      }
    }
  })
  
  animationFrameId = requestAnimationFrame(animateDataStream)
}

// 解密字符动画
const decryptChar = (el: HTMLElement, targetChar: string, duration: number = 0.1) => {
  const displayEl = el.querySelector('.cyber-char-display-112') as HTMLElement
  const glowEl = el.querySelector('.cyber-char-glow-112') as HTMLElement
  
  if (!displayEl || !glowEl) return
  
  const startTime = Date.now()
  
  const intervalId = setInterval(() => {
    const elapsed = (Date.now() - startTime) / 1000
    
    if (elapsed < duration) {
      // 随机显示乱码
      displayEl.textContent = glitchChars[Math.floor(Math.random() * glitchChars.length)]
    } else {
      clearInterval(intervalId)
      displayEl.textContent = targetChar
      glowEl.style.opacity = '1'
      
      // 辉光脉冲
      gsap.fromTo(el,
        { textShadow: `0 0 20px ${props.glowColor}, 0 0 40px ${props.glowColor}` },
        { textShadow: `0 0 8px ${props.glowColor}, 0 0 15px ${props.glowColor}`, duration: 0.5, ease: 'power2.out' }
      )
    }
  }, 30)
}

// 解密段落
const decryptPara = (el: HTMLElement, targetText: string, duration: number = 0.8) => {
  const displayEl = el.querySelector('.cyber-text-display-112') as HTMLElement
  
  if (!displayEl) return
  
  const words = targetText.split('')
  const startTime = Date.now()
  
  const intervalId = setInterval(() => {
    const elapsed = (Date.now() - startTime) / 1000
    
    if (elapsed < duration) {
      // 部分解密
      const progress = elapsed / duration
      const visibleCount = Math.floor(words.length * progress)
      
      let result = ''
      for (let i = 0; i < words.length; i++) {
        if (i < visibleCount) {
          result += words[i]
        } else {
          result += glitchChars[Math.floor(Math.random() * glitchChars.length)]
        }
      }
      displayEl.textContent = result
    } else {
      clearInterval(intervalId)
      displayEl.textContent = targetText
      el.classList.add('decrypted')
    }
  }, 50)
}

// 扫描线动画
const updateScanline = (progressVal: number) => {
  if (!scanlineRef.value || !sectionRef.value) return
  
  const sectionHeight = sectionRef.value.offsetHeight
  scanlineTop.value = progressVal * sectionHeight
  
  gsap.set(scanlineRef.value, { top: `${scanlineTop.value}px` })
}

// 鼠标干扰效果
const handleMouseMove = (e: MouseEvent) => {
  if (!sectionRef.value || !crtRef.value) return
  
  const rect = sectionRef.value.getBoundingClientRect()
  const mouseX = e.clientX - rect.left
  const mouseY = e.clientY - rect.top
  
  // CRT 干扰效果
  const skewX = (mouseX / rect.width - 0.5) * 2
  const hueRotate = Math.abs(skewX) * 30
  
  gsap.to(crtRef.value, {
    background: `radial-gradient(circle at ${mouseX}px ${mouseY}px, 
                 rgba(0, 255, 136, 0.1) 0%, 
                 transparent 50%),
                 repeating-linear-gradient(
                   0deg,
                   transparent,
                   transparent 2px,
                   rgba(0, 255, 136, 0.03) 2px,
                   rgba(0, 255, 136, 0.03) 4px
                 )`,
    duration: 0.1
  })
  
  // 标题字符干扰
  charRefs.value.forEach((el, index) => {
    const dist = Math.abs(mouseX - (index * 50 + 100))
    if (dist < 150) {
      const intensity = (150 - dist) / 150
      gsap.to(el, {
        skewX: intensity * 5 * skewX,
        filter: `hue-rotate(${intensity * hueRotate}deg)`,
        duration: 0.1
      })
    }
  })
}

const handleMouseLeave = () => {
  if (!crtRef.value) return
  
  gsap.to(crtRef.value, {
    background: 'transparent',
    duration: 0.3
  })
  
  charRefs.value.forEach(el => {
    gsap.to(el, {
      skewX: 0,
      filter: 'none',
      duration: 0.3
    })
  })
}

// 更新时间
const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toTimeString().split(' ')[0]
}

// 主循环
const mainLoop = (time: number) => {
  const deltaTime = lastTime ? (time - lastTime) / 1000 : 0
  lastTime = time
  
  animateDataStream()
  
  animationFrameId = requestAnimationFrame(mainLoop)
}

onMounted(() => {
  const rootEl = sectionRef.value
  if (!rootEl) return
  
  // 初始化
  initDataStream()
  updateTime()
  
  // 定时更新
  const timeIntervalId = setInterval(updateTime, 1000)
  cleanupFns.push(() => clearInterval(timeIntervalId))
  
  // 等待 DOM 渲染
  nextTick(() => {
    setTimeout(() => {
      // 获取元素
      const charElements = Array.from(charRefs.value.values()).filter(el => el !== null)
      const paraElements = Array.from(paraRefs.value.values()).filter(el => el !== null)
      
      // 确保元素已渲染
      if (charElements.length === 0) {
        console.warn('CardTextCyber: char elements not ready, retrying...')
        setTimeout(() => onMounted(), 100)
        return
      }
      
      ctx = gsap.context(() => {
        // 初始状态
        charElements.forEach(el => {
          const glowEl = el.querySelector('.cyber-char-glow-112') as HTMLElement
          if (glowEl) glowEl.style.opacity = '0'
          
          // 随机初始字符
          const displayEl = el.querySelector('.cyber-char-display-112') as HTMLElement
          if (displayEl) {
            displayEl.textContent = glitchChars[Math.floor(Math.random() * glitchChars.length)]
          }
        })
        
        // 副标题初始状态
        if (subtitleRef.value) {
          gsap.set(subtitleRef.value, { opacity: 0 })
        }
        
        // 段落初始状态
        paraElements.forEach(el => {
          el.classList.remove('decrypted')
          const displayEl = el.querySelector('.cyber-text-display-112') as HTMLElement
          if (displayEl) {
            displayEl.textContent = Array.from({ length: props.paragraphs[0]?.length || 20 }, () =>
              glitchChars[Math.floor(Math.random() * glitchChars.length)]
            ).join('')
          }
        })
        
        // ScrollTrigger
        scrollTriggerInstance = ScrollTrigger.create({
          trigger: rootEl,
          start: 'top 80%',
          end: 'top 20%',
          scrub: props.scanSpeed,
          onUpdate: (self) => {
            progress.value = self.progress * 100
            emit('scroll-progress', self.progress)
            
            if (self.progress > 0.05) {
              scrollHintHidden.value = true
            }
            
            // 更新扫描线
            updateScanline(self.progress)
            
            // 解密标题
            charElements.forEach((el, index) => {
              const charProgress = (self.progress - index * 0.05) * 5
              if (charProgress > 0.3 && charProgress < 1.2) {
                const targetChar = props.title[index] || ''
                const glowEl = el.querySelector('.cyber-char-glow-112') as HTMLElement
                if (glowEl && glowEl.style.opacity !== '1') {
                  decryptChar(el, targetChar, 0.15)
                }
              }
            })
            
            // 解密副标题
            if (self.progress > 0.4 && subtitleRef.value) {
              gsap.to(subtitleRef.value, { opacity: 1, duration: 0.3 })
            }
            
            // 解密段落
            paraElements.forEach((el, index) => {
              const paraProgress = (self.progress - 0.5 - index * 0.1) * 3
              if (paraProgress > 0 && !el.classList.contains('decrypted')) {
                const targetText = props.paragraphs[index] || ''
                decryptPara(el, targetText, 0.6)
              }
            })
            
            // 完成
            if (self.progress >= 0.98) {
              emit('animation-complete')
            }
          },
          onEnter: () => {
            if (props.glowColor) {
              emit('animation-start')
            }
          },
          onLeaveBack: () => {
            // 重新获取最新元素
            const currentCharElements = Array.from(charRefs.value.values()).filter(el => el !== null)
            const currentParaElements = Array.from(paraRefs.value.values()).filter(el => el !== null)
            
            // 重置
            currentCharElements.forEach(el => {
              const glowEl = el.querySelector('.cyber-char-glow-112') as HTMLElement
              if (glowEl) glowEl.style.opacity = '0'
              
              const displayEl = el.querySelector('.cyber-char-display-112') as HTMLElement
              if (displayEl) {
                displayEl.textContent = glitchChars[Math.floor(Math.random() * glitchChars.length)]
              }
              
              gsap.set(el, { textShadow: 'none', skewX: 0, filter: 'none' })
            })
            
            if (subtitleRef.value) {
              gsap.set(subtitleRef.value, { opacity: 0 })
            }
            
            currentParaElements.forEach(el => {
              el.classList.remove('decrypted')
              const displayEl = el.querySelector('.cyber-text-display-112') as HTMLElement
              if (displayEl) {
                displayEl.textContent = Array.from({ length: 20 }, () =>
                  glitchChars[Math.floor(Math.random() * glitchChars.length)]
                ).join('')
              }
            })
            
            if (scanlineRef.value) {
              gsap.set(scanlineRef.value, { top: 0 })
            }
          }
        })
        
        cleanupFns.push(() => scrollTriggerInstance?.kill())
      }, rootEl)
      
      // 启动数据流动画
      animationFrameId = requestAnimationFrame(mainLoop)
    }, 200)
  })
  
  // 窗口大小变化
  const handleResize = () => {
    initDataStream()
  }
  
  window.addEventListener('resize', handleResize)
  cleanupFns.push(() => window.removeEventListener('resize', handleResize))
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0
  
  ctx?.revert()
  ctx = null
  
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
  
  if (tickerIntervalId !== null) {
    clearInterval(tickerIntervalId)
    tickerIntervalId = null
  }
  
  scrollTriggerInstance?.kill()
  ScrollTrigger.getAll().forEach(st => st.kill())
  
  charRefs.value.clear()
  paraRefs.value.clear()
  dataStreamColumns = []
})
</script>

<style scoped>
.cyber-section-112 {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: #0a0a0f;
  font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
}

/* 数据流画布 */
.cyber-canvas-112 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

/* 扫描线 */
.cyber-scanline-112 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 200px;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(0, 255, 136, 0.1) 45%,
    rgba(0, 255, 136, 0.3) 50%,
    rgba(0, 255, 136, 0.1) 55%,
    transparent 100%
  );
  pointer-events: none;
  z-index: 10;
  transform: translateY(0);
}

.cyber-scan-beam-112 {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(0, 255, 136, 0.8), 
    rgba(0, 255, 136, 1), 
    rgba(0, 255, 136, 0.8), 
    transparent
  );
  box-shadow: 0 0 20px rgba(0, 255, 136, 0.8);
}

/* 栅格背景 */
.cyber-grid-112 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(0, 255, 136, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 136, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  pointer-events: none;
  z-index: 0;
}

/* 内容层 */
.cyber-content-112 {
  position: relative;
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 60px 20px;
}

/* 副标题 */
.cyber-subtitle-112 {
  font-size: clamp(0.75rem, 2vw, 1rem);
  color: rgba(0, 255, 136, 0.8);
  letter-spacing: 0.4em;
  text-transform: uppercase;
  margin-bottom: 20px;
  font-weight: 400;
  opacity: 0;
}

/* 主标题 */
.cyber-title-112 {
  font-size: clamp(3rem, 12vw, 8rem);
  font-weight: 700;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.05em;
}

/* 字符 */
.cyber-char-112 {
  position: relative;
  display: inline-block;
  color: #00ff88;
  text-shadow: 0 0 8px rgba(0, 255, 136, 0.5);
}

.cyber-char-display-112 {
  position: relative;
  z-index: 1;
  transition: color 0.1s;
}

.cyber-char-glow-112 {
  position: absolute;
  top: 0;
  left: 0;
  color: #00ff88;
  filter: blur(8px);
  opacity: 0;
  z-index: 0;
}

/* 段落 */
.cyber-paragraphs-112 {
  max-width: 700px;
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.cyber-text-112 {
  position: relative;
  font-size: clamp(0.875rem, 1.5vw, 1.125rem);
  line-height: 1.9;
  color: rgba(0, 255, 136, 0.9);
  text-align: center;
  margin: 0;
  padding: 20px;
  border: 1px solid rgba(0, 255, 136, 0.2);
  background: rgba(0, 255, 136, 0.02);
}

.cyber-text-display-112 {
  position: relative;
  z-index: 1;
}

.cyber-text-glow-112 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  color: #00ff88;
  filter: blur(15px);
  opacity: 0;
  z-index: 0;
  pointer-events: none;
  padding: 20px;
}

.cyber-text-112.decrypted {
  text-shadow: 0 0 10px rgba(0, 255, 136, 0.3);
  animation: textBreath 3s ease-in-out infinite;
}

@keyframes textBreath {
  0%, 100% {
    text-shadow: 0 0 10px rgba(0, 255, 136, 0.3);
  }
  50% {
    text-shadow: 0 0 20px rgba(0, 255, 136, 0.5);
  }
}

/* 进度条 */
.cyber-progress-112 {
  position: fixed;
  top: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #00ff88, #00cc6a, #009950);
  z-index: 1000;
  transition: width 0.1s linear;
  box-shadow: 0 0 15px rgba(0, 255, 136, 0.5);
}

/* 终端信息 */
.cyber-terminal-112 {
  position: fixed;
  top: 20px;
  left: 20px;
  font-size: 12px;
  color: rgba(0, 255, 136, 0.6);
  z-index: 100;
  display: flex;
  gap: 8px;
}

.cyber-terminal-prompt-112 {
  color: #00ff88;
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  50% { opacity: 0; }
}

/* 滚动提示 */
.cyber-scroll-hint-112 {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: rgba(0, 255, 136, 0.8);
  font-size: 12px;
  letter-spacing: 0.3em;
  z-index: 100;
  transition: opacity 0.5s ease;
}

.cyber-scroll-hint-112.hidden {
  opacity: 0;
  pointer-events: none;
}

.cyber-scroll-arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.cyber-scroll-arrow span {
  width: 16px;
  height: 16px;
  border-right: 2px solid rgba(0, 255, 136, 0.8);
  border-bottom: 2px solid rgba(0, 255, 136, 0.8);
  transform: rotate(45deg);
  animation: cyberScrollArrow 1.5s ease-in-out infinite;
}

.cyber-scroll-arrow span:nth-child(2) {
  animation-delay: 0.15s;
  opacity: 0.7;
}

.cyber-scroll-arrow span:nth-child(3) {
  animation-delay: 0.3s;
  opacity: 0.4;
}

@keyframes cyberScrollArrow {
  0%, 100% {
    transform: rotate(45deg) translateY(0);
    opacity: 1;
  }
  50% {
    transform: rotate(45deg) translateY(8px);
    opacity: 0.5;
  }
}

/* CRT 干扰效果 */
.cyber-crt-112 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 30;
  mix-blend-mode: overlay;
  transition: background 0.1s;
}

/* 响应式 */
@media (max-width: 768px) {
  .cyber-text-112 {
    padding: 16px;
  }

  .cyber-paragraphs-112 {
    margin-top: 40px;
    gap: 16px;
  }

  .cyber-terminal-112 {
    display: none;
  }
}
</style>
