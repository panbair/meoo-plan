<template>
  <div
    class="laser-section-111"
    ref="sectionRef"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <!-- 金属纹理背景 -->
    <div class="laser-metal-bg-111"></div>
    
    <!-- 内容层 -->
    <div class="laser-content-111" ref="contentRef">
      <!-- 副标题 -->
      <p
        v-if="subtitle"
        class="laser-subtitle-111"
        ref="subtitleRef"
      >
        {{ subtitle }}
      </p>
      
      <!-- 主标题容器 -->
      <div class="laser-title-container-111" ref="titleContainerRef">
        <!-- 原始文字层 - 下面可见的文字 -->
        <h1 class="laser-title-111" ref="titleRef">
          {{ displayTitle }}
        </h1>
        
        <!-- 激光遮罩层 - 覆盖在上面，逐渐消失 -->
        <div class="laser-mask-111" ref="laserMaskRef"></div>
      </div>
      
      <!-- 激光光束效果 -->
      <div class="laser-beam-111" ref="laserBeamRef"></div>
      
      <!-- 段落卡片 -->
      <div class="laser-paragraphs-111" ref="paragraphsRef">
        <div
          v-for="(para, index) in paragraphs"
          :key="index"
          class="laser-card-111"
          :ref="el => setCardRef(el, index)"
        >
          <p class="laser-card-text-111">{{ para }}</p>
        </div>
      </div>
    </div>
    
    <!-- 火花容器 -->
    <div class="laser-sparks-111" ref="sparksContainerRef"></div>
    
    <!-- 进度条 -->
    <div
      class="laser-progress-111"
      :style="{ width: progress + '%' }"
    ></div>
    
    <!-- 滚动提示 -->
    <div class="laser-scroll-hint-111" :class="{ hidden: scrollHintHidden }">
      <span>向下滚动激活激光</span>
      <div class="laser-scroll-arrow">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
    
    <!-- 余温效果层 -->
    <div 
      class="laser-residual-heat-111" 
      ref="residualHeatRef"
      :style="residualHeatStyle"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Props 定义
interface Props {
  title?: string
  subtitle?: string
  paragraphs?: string[]
  accentColor?: string
  autoPlay?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'LASER',
  subtitle: '',
  paragraphs: () => [],
  accentColor: '#ff6b35',
  autoPlay: true
})

// Emits 定义
const emit = defineEmits<{
  'animation-start': []
  'animation-complete': []
  'scroll-progress': [progress: number]
}>()

// Refs
const sectionRef = ref<HTMLElement | null>(null)
const titleContainerRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const laserMaskRef = ref<HTMLElement | null>(null)
const laserBeamRef = ref<HTMLElement | null>(null)
const paragraphsRef = ref<HTMLElement | null>(null)
const sparksContainerRef = ref<HTMLElement | null>(null)
const residualHeatRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)

// 使用数组存储卡片元素
const cardElementRefs = ref<(HTMLElement | null)[]>([])

// 状态
const progress = ref(0)
const scrollHintHidden = ref(false)
const isEtshed = ref(false)
const displayTitle = ref(props.title)
const residualHeatStyle = ref<Record<string, string>>({})
const isInitialized = ref(false)

// 清理函数类型
type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []
let scrollTriggerInstance: ScrollTrigger | null = null
let animationFrameId: number | null = null
let sparks: Spark[] = []
let mouseX = 0
let mouseY = 0
let residualHeat = 0
let lastTime = 0
let charElements: HTMLElement[] = []

interface Spark {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  element: HTMLElement | null
}

// 设置卡片 ref
const setCardRef = (el: HTMLElement | null, index: number) => {
  cardElementRefs.value[index] = el
}

// 获取所有有效卡片元素
const getCardElements = (): HTMLElement[] => {
  return cardElementRefs.value.filter((el): el is HTMLElement => el !== null)
}

// 创建火花
const createSpark = (x: number, y: number) => {
  if (!sparksContainerRef.value) return
  
  const spark = document.createElement('div')
  spark.className = 'laser-spark-111'
  
  const angle = Math.random() * Math.PI * 2
  const speed = 50 + Math.random() * 150
  const size = 2 + Math.random() * 4
  
  spark.style.cssText = `
    position: absolute;
    left: ${x}px;
    top: ${y}px;
    width: ${size}px;
    height: ${size}px;
    background: radial-gradient(circle, #fff 0%, ${props.accentColor} 50%, transparent 100%);
    border-radius: 50%;
    pointer-events: none;
    box-shadow: 0 0 ${size * 2}px ${props.accentColor};
  `
  
  sparksContainerRef.value.appendChild(spark)
  
  const sparkObj: Spark = {
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed - 50,
    life: 0,
    maxLife: 0.3 + Math.random() * 0.4,
    size,
    element: spark
  }
  
  sparks.push(sparkObj)
}

// 动画火花
const animateSparks = (deltaTime: number) => {
  const gravity = 200
  const friction = 0.98
  
  sparks = sparks.filter(spark => {
    if (!spark.element) return false
    
    spark.life += deltaTime
    
    if (spark.life >= spark.maxLife) {
      spark.element.remove()
      return false
    }
    
    spark.vy += gravity * deltaTime
    spark.vx *= friction
    spark.vy *= friction
    
    spark.x += spark.vx * deltaTime
    spark.y += spark.vy * deltaTime
    
    const lifeRatio = 1 - spark.life / spark.maxLife
    
    spark.element.style.left = `${spark.x}px`
    spark.element.style.top = `${spark.y}px`
    spark.element.style.opacity = String(lifeRatio)
    spark.element.style.transform = `scale(${lifeRatio})`
    
    return true
  })
}

// 鼠标移动处理
const handleMouseMove = (e: MouseEvent) => {
  if (!sectionRef.value) return
  
  const rect = sectionRef.value.getBoundingClientRect()
  mouseX = e.clientX - rect.left
  mouseY = e.clientY - rect.top
  
  if (isEtshed.value) {
    residualHeat = 0.6
  }
}

const handleMouseLeave = () => {
  mouseX = 0
  mouseY = 0
}

// 主循环
const mainLoop = (time: number) => {
  const deltaTime = lastTime ? (time - lastTime) / 1000 : 0
  lastTime = time
  
  animateSparks(deltaTime)
  
  if (isEtshed.value) {
    residualHeat *= 0.95
    residualHeatStyle.value = {
      background: `radial-gradient(circle at ${mouseX}px ${mouseY}px, 
                   rgba(255, 100, 50, ${residualHeat * 0.3}) 0%, 
                   transparent 50%)`,
      pointerEvents: 'none'
    }
  }
  
  animationFrameId = requestAnimationFrame(mainLoop)
}

// 生成遮罩字符
const generateMask = () => {
  if (!laserMaskRef.value || !titleRef.value) return
  
  const text = displayTitle.value
  laserMaskRef.value.innerHTML = ''
  charElements = []
  
  // 创建字符容器
  const charsContainer = document.createElement('div')
  charsContainer.className = 'laser-chars-container-111'
  
  // 为每个字符创建 span
  text.split('').forEach((char) => {
    const span = document.createElement('span')
    span.className = 'laser-char-111'
    span.textContent = char
    // 初始状态：完全不透明，覆盖下面的文字
    span.style.opacity = '1'
    charsContainer.appendChild(span)
    charElements.push(span)
  })
  
  laserMaskRef.value.appendChild(charsContainer)
}

// 激光蚀刻动画
const animateLaserEtsh = (progressVal: number) => {
  if (!sectionRef.value || charElements.length === 0) return
  
  const sectionRect = sectionRef.value.getBoundingClientRect()
  const containerRect = titleContainerRef.value?.getBoundingClientRect()
  
  if (!containerRect) return
  
  // 计算激光位置 - 从标题顶部到底部
  const containerTop = containerRect.top - sectionRect.top
  const containerHeight = containerRect.height
  const laserY = containerTop + containerHeight * Math.min(1, progressVal * 1.1)
  
  // 更新激光光束位置
  if (laserBeamRef.value) {
    laserBeamRef.value.style.top = `${laserY}px`
    laserBeamRef.value.style.opacity = progressVal > 0.02 && progressVal < 0.95 ? '1' : '0'
  }
  
  // 字符蚀刻动画 - 激光经过的字符逐渐消失
  const charCount = charElements.length
  const charsProgress = progressVal * charCount
  
  charElements.forEach((char, index) => {
    // 字符被激光照射时逐渐消失
    const charProgress = charsProgress - index
    
    if (charProgress > 0) {
      // 激光刚照射到字符 - 白炽状态
      if (charProgress < 0.3) {
        char.style.color = '#ffffff'
        char.style.textShadow = `0 0 30px ${props.accentColor}, 0 0 60px ${props.accentColor}, 0 0 90px #ff4500`
        char.style.opacity = String(1 - charProgress * 2)
      }
      // 激光已经经过 - 冷却橙色
      else if (charProgress < 1) {
        char.style.color = '#ff6b35'
        char.style.textShadow = `0 0 15px ${props.accentColor}, 0 0 30px ${props.accentColor}`
        char.style.opacity = '0'
      }
      // 完全蚀刻完成
      else {
        char.style.color = '#8b4513'
        char.style.textShadow = 'none'
        char.style.opacity = '0'
      }
    } else {
      // 未被激光照射的字符 - 保持覆盖状态
      char.style.color = '#1a1a2e'
      char.style.textShadow = 'none'
      char.style.opacity = '1'
    }
  })
  
  // 生成火花
  if (progressVal > 0.02 && progressVal < 0.98 && Math.random() < 0.25) {
    const containerLeft = containerRect.left - sectionRect.left
    const sparkX = containerLeft + Math.random() * containerRect.width
    createSpark(sparkX, laserY)
  }
  
  // 副标题动画
  if (subtitleRef.value) {
    const subtitleOpacity = progressVal > 0.5 ? Math.min(1, (progressVal - 0.5) * 4) : 0
    subtitleRef.value.style.opacity = String(subtitleOpacity)
  }
  
  // 卡片入场动画
  const cardElements = getCardElements()
  cardElements.forEach((card, index) => {
    const cardProgress = Math.max(0, (progressVal - 0.6 - index * 0.1) * 5)
    
    if (cardProgress > 0) {
      const opacity = Math.min(1, cardProgress)
      const y = 50 * (1 - Math.min(1, cardProgress))
      const scale = 0.95 + 0.05 * Math.min(1, cardProgress)
      
      card.style.opacity = String(opacity)
      card.style.transform = `translateY(${y}px) scale(${scale})`
    }
  })
}

// 重置动画
const resetAnimation = () => {
  // 重置所有字符状态
  charElements.forEach((char) => {
    char.style.opacity = '1'
    char.style.color = '#1a1a2e'
    char.style.textShadow = 'none'
  })
  
  if (laserBeamRef.value) {
    laserBeamRef.value.style.opacity = '0'
  }
  
  if (subtitleRef.value) {
    subtitleRef.value.style.opacity = '0'
  }
  
  const cardElements = getCardElements()
  cardElements.forEach(card => {
    card.style.opacity = '0'
    card.style.transform = 'translateY(50px)'
  })
  
  if (sectionRef.value) {
    sectionRef.value.style.filter = 'brightness(1)'
  }
  
  isEtshed.value = false
}

// 初始化组件
const initializeComponent = () => {
  if (isInitialized.value) return
  
  // 检查必要的元素
  if (!sectionRef.value) {
    requestAnimationFrame(initializeComponent)
    return
  }
  
  // 生成遮罩
  generateMask()
  
  // 确保字符元素已创建
  if (charElements.length === 0) {
    requestAnimationFrame(initializeComponent)
    return
  }
  
  isInitialized.value = true
  
  // 初始化卡片状态
  const cardElements = getCardElements()
  cardElements.forEach(card => {
    card.style.opacity = '0'
    card.style.transform = 'translateY(50px)'
  })
  
  // 创建 ScrollTrigger
  scrollTriggerInstance = ScrollTrigger.create({
    trigger: sectionRef.value,
    start: 'top center',
    end: 'center center',
    scrub: 1.5,
    onUpdate: (self) => {
      progress.value = self.progress * 100
      emit('scroll-progress', self.progress)
      
      if (self.progress > 0.02) {
        scrollHintHidden.value = true
      }
      
      animateLaserEtsh(self.progress)
      
      if (self.progress >= 0.98 && !isEtshed.value) {
        isEtshed.value = true
        if (sectionRef.value) {
          sectionRef.value.style.filter = 'brightness(0.95)'
        }
        emit('animation-complete')
      }
    },
    onEnter: () => {
      emit('animation-start')
    },
    onLeaveBack: () => {
      resetAnimation()
    }
  })
  
  cleanupFns.push(() => scrollTriggerInstance?.kill())
  
  // 启动动画循环
  animationFrameId = requestAnimationFrame(mainLoop)
}

onMounted(() => {
  // 等待 DOM 完全渲染
  nextTick(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        initializeComponent()
      })
    })
  })
  
  const handleResize = () => {
    if (isInitialized.value) {
      isInitialized.value = false
      charElements = []
      requestAnimationFrame(initializeComponent)
    }
  }
  
  window.addEventListener('resize', handleResize)
  cleanupFns.push(() => window.removeEventListener('resize', handleResize))
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0
  
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
  }
  
  sparks.forEach(spark => spark.element?.remove())
  sparks = []
  
  if (sparksContainerRef.value) {
    sparksContainerRef.value.innerHTML = ''
  }
  
  scrollTriggerInstance?.kill()
  ScrollTrigger.getAll().forEach(st => st.kill())
  
  cardElementRefs.value = []
  charElements = []
})
</script>

<style scoped>
.laser-section-111 {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: #0a0a12;
}

.laser-metal-bg-111 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 2px,
      rgba(255, 107, 53, 0.02) 2px,
      rgba(255, 107, 53, 0.02) 4px
    ),
    linear-gradient(135deg, #0d0d1a 0%, #1a1a2e 50%, #0d0d1a 100%);
}

.laser-content-111 {
  position: relative;
  z-index: 15;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 60px 20px;
}

.laser-subtitle-111 {
  font-size: clamp(0.75rem, 2vw, 1rem);
  color: rgba(255, 107, 53, 0.9);
  letter-spacing: 0.5em;
  text-transform: uppercase;
  margin-bottom: 20px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-weight: 400;
  opacity: 0;
}

.laser-title-container-111 {
  position: relative;
  display: inline-block;
}

.laser-title-111 {
  font-size: clamp(3rem, 12vw, 8rem);
  font-weight: 900;
  color: #ffffff;
  margin: 0;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  letter-spacing: 0.05em;
  position: relative;
  z-index: 1;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

.laser-mask-111 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
}

.laser-chars-container-111 {
  display: flex;
  gap: 0;
}

.laser-char-111 {
  display: inline-block;
  font-size: clamp(3rem, 12vw, 8rem);
  font-weight: 900;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  letter-spacing: 0.05em;
  color: #1a1a2e;
  /* 初始完全覆盖下面的文字 */
  opacity: 1;
}

/* 激光光束 */
.laser-beam-111 {
  position: absolute;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, 
    transparent 0%,
    rgba(255, 107, 53, 0.3) 20%,
    #ffffff 50%,
    rgba(255, 107, 53, 0.3) 80%,
    transparent 100%
  );
  box-shadow: 
    0 0 15px #ff6b35,
    0 0 30px #ff6b35,
    0 0 60px #ff4500,
    0 0 100px #ff4500;
  z-index: 10;
  pointer-events: none;
  opacity: 0;
}

.laser-beam-111::before,
.laser-beam-111::after {
  content: '';
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100vw;
  height: 200px;
  background: radial-gradient(ellipse at center, 
    rgba(255, 107, 53, 0.2) 0%,
    transparent 70%
  );
  pointer-events: none;
}

.laser-beam-111::before {
  right: 100%;
}

.laser-beam-111::after {
  left: 100%;
}

.laser-paragraphs-111 {
  max-width: 700px;
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.laser-card-111 {
  position: relative;
  padding: 28px 36px;
  background: rgba(26, 26, 46, 0.9);
  border-radius: 4px;
  border: 1px solid rgba(255, 107, 53, 0.3);
  backdrop-filter: blur(10px);
  overflow: hidden;
  opacity: 0;
  transform: translateY(50px);
  transition: transform 0.3s, opacity 0.3s;
}

.laser-card-111::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255, 107, 53, 0.8), transparent);
}

.laser-card-text-111 {
  font-size: clamp(0.875rem, 1.5vw, 1rem);
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.85);
  text-align: center;
  margin: 0;
  font-family: 'JetBrains Mono', monospace;
  position: relative;
  z-index: 1;
}

.laser-sparks-111 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 20;
}

:deep(.laser-spark-111) {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}

.laser-progress-111 {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #ff4500, #ff6b35, #ffaa00);
  z-index: 1000;
  transition: width 0.1s linear;
  box-shadow: 0 0 15px rgba(255, 69, 0, 0.5);
}

.laser-scroll-hint-111 {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: rgba(255, 107, 53, 0.8);
  font-size: 14px;
  z-index: 100;
  transition: opacity 0.5s ease;
  font-family: 'JetBrains Mono', monospace;
}

.laser-scroll-hint-111.hidden {
  opacity: 0;
  pointer-events: none;
}

.laser-scroll-arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.laser-scroll-arrow span {
  width: 20px;
  height: 20px;
  border-right: 2px solid rgba(255, 107, 53, 0.8);
  border-bottom: 2px solid rgba(255, 107, 53, 0.8);
  transform: rotate(45deg);
  animation: laserScrollArrow 1.5s ease-in-out infinite;
}

.laser-scroll-arrow span:nth-child(2) {
  animation-delay: 0.15s;
  opacity: 0.7;
}

.laser-scroll-arrow span:nth-child(3) {
  animation-delay: 0.3s;
  opacity: 0.4;
}

@keyframes laserScrollArrow {
  0%, 100% {
    transform: rotate(45deg) translateY(0);
    opacity: 1;
  }
  50% {
    transform: rotate(45deg) translateY(10px);
    opacity: 0.5;
  }
}

.laser-residual-heat-111 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 25;
  opacity: 0;
  transition: opacity 0.3s ease;
}

@media (max-width: 768px) {
  .laser-card-111 {
    padding: 20px;
  }

  .laser-paragraphs-111 {
    margin-top: 40px;
    gap: 16px;
  }

  .laser-subtitle-111 {
    letter-spacing: 0.3em;
  }
}
</style>
