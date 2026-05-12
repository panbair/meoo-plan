<template>
  <div class="hologram-section-113" ref="sectionRef">
    <!-- 背景暗室效果 -->
    <div class="hologram-dark-room-113"></div>
    
    <!-- 全息基台 -->
    <div class="hologram-platform-113" ref="platformRef">
      <!-- 激光扫描平面 -->
      <div class="hologram-scan-plane-113" ref="scanPlaneRef">
        <div class="hologram-scan-beam-113"></div>
        <div class="hologram-scan-glow-113"></div>
      </div>
      
      <!-- 分层文字容器 -->
      <div class="hologram-text-container-113" ref="textContainerRef">
        <!-- 动态生成多层文字 -->
        <div
          v-for="layer in layers"
          :key="layer.id"
          class="hologram-text-layer-113"
          :ref="el => setLayerRef(el, layer.id)"
          :style="{
            transform: `translateZ(${layer.zOffset}px)`,
            filter: `blur(${layer.blur}px)`,
            opacity: layer.opacity
          }"
        >
          <span class="hologram-char-113">{{ displayTitle }}</span>
        </div>
        
        <!-- 文字主体 -->
        <h1 class="hologram-title-113" ref="titleRef">{{ displayTitle }}</h1>
        
        <!-- 色散效果层 -->
        <div class="hologram-chromatic-113" ref="chromaticRef">
          <span class="hologram-char-r-113">{{ displayTitle }}</span>
          <span class="hologram-char-g-113">{{ displayTitle }}</span>
          <span class="hologram-char-b-113">{{ displayTitle }}</span>
        </div>
      </div>
      
      <!-- 栅格光栅 -->
      <div class="hologram-grating-113" ref="gratingRef"></div>
    </div>
    
    <!-- 内容层 -->
    <div class="hologram-content-113" ref="contentRef">
      <!-- 副标题 -->
      <p v-if="subtitle" class="hologram-subtitle-113" ref="subtitleRef">
        {{ subtitle }}
      </p>
      
      <!-- 段落 -->
      <div class="hologram-paragraphs-113" ref="paragraphsRef">
        <p
          v-for="(para, index) in paragraphs"
          :key="index"
          class="hologram-text-113"
          :ref="el => setParaRef(el, index)"
        >
          {{ para }}
        </p>
      </div>
    </div>
    
    <!-- 粒子效果 -->
    <canvas ref="particlesCanvasRef" class="hologram-particles-113"></canvas>
    
    <!-- 进度条 -->
    <div class="hologram-progress-113" :style="{ width: progress + '%' }"></div>
    
    <!-- 控制按钮 -->
    <div class="hologram-controls-113">
      <button class="hologram-btn-113" @click="handleReplay" title="重播">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
        </svg>
      </button>
    </div>
    
    <!-- 滚动提示 -->
    <div class="hologram-scroll-hint-113" :class="{ hidden: scrollHintHidden }">
      <span>滚动激活全息</span>
      <div class="hologram-scroll-arrow">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Props 定义
interface Props {
  title?: string
  subtitle?: string
  paragraphs?: string[]
  layerCount?: number
  fontSize?: string
  fontWeight?: number
  scanColor?: string
  autoPlay?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'HOLOGRAM',
  subtitle: '',
  paragraphs: () => [],
  layerCount: 20,
  fontSize: 'clamp(3rem, 12vw, 8rem)',
  fontWeight: 700,
  scanColor: '#00ff88',
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
const platformRef = ref<HTMLElement | null>(null)
const textContainerRef = ref<HTMLElement | null>(null)
const scanPlaneRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const paragraphsRef = ref<HTMLElement | null>(null)
const chromaticRef = ref<HTMLElement | null>(null)
const gratingRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const particlesCanvasRef = ref<HTMLCanvasElement | null>(null)

// 图层 refs
const layerRefs = ref<Map<number, HTMLElement>>(new Map())
const paraRefs = ref<HTMLElement[]>([])

// 状态
const progress = ref(0)
const scrollHintHidden = ref(false)
const displayTitle = ref(props.title)

// 清理函数
const cleanupFns: (() => void)[] = []
let scrollTriggerInstance: ScrollTrigger | null = null
let breathAnimationId: number | null = null
let particleAnimationId: number | null = null
let particles: Particle[] = []

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
}

// 计算分层数据
const layers = computed(() => {
  const result = []
  const halfCount = Math.floor(props.layerCount / 2)
  
  for (let i = 0; i < props.layerCount; i++) {
    const zOffset = (i - halfCount) * 15
    const blur = Math.abs(i - halfCount) * 0.3
    const opacity = 0.03 + (1 - Math.abs(i - halfCount) / halfCount) * 0.12
    
    result.push({
      id: i,
      zOffset,
      blur,
      opacity
    })
  }
  
  return result
})

// 设置图层 ref
const setLayerRef = (el: HTMLElement | null, id: number) => {
  if (el) {
    layerRefs.value.set(id, el)
  }
}

// 设置段落 ref
const setParaRef = (el: HTMLElement | null, index: number) => {
  if (el) {
    paraRefs.value[index] = el
  }
}

// 初始化粒子
const initParticles = () => {
  if (!particlesCanvasRef.value) return
  
  const canvas = particlesCanvasRef.value
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  
  particles = []
  const count = 80
  
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5 - 0.3,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.2,
      color: props.scanColor
    })
  }
}

// 粒子动画
const animateParticles = () => {
  if (!particlesCanvasRef.value) return
  
  const canvas = particlesCanvasRef.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  particles.forEach(p => {
    p.x += p.vx
    p.y += p.vy
    
    // 边界检测
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1
    if (p.y < 0 || p.y > canvas.height) {
      p.y = canvas.height
      p.x = Math.random() * canvas.width
    }
    
    // 绘制
    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3)
    gradient.addColorStop(0, `rgba(0, 255, 136, ${p.opacity})`)
    gradient.addColorStop(1, 'transparent')
    
    ctx.beginPath()
    ctx.fillStyle = gradient
    ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
    ctx.fill()
  })
  
  particleAnimationId = requestAnimationFrame(animateParticles)
}

// 呼吸浮动效果
const startBreathing = () => {
  const title = titleRef.value
  const textContainer = textContainerRef.value
  
  const animate = () => {
    const time = Date.now() / 1000
    const breathY = Math.sin(time * 0.8) * 2
    
    if (title) {
      title.style.transform = `translateY(${breathY}px)`
    }
    if (textContainer) {
      textContainer.style.transform = `translateY(${breathY * 0.5}px)`
    }
    
    breathAnimationId = requestAnimationFrame(animate)
  }
  animate()
}

const stopBreathing = () => {
  if (breathAnimationId !== null) {
    cancelAnimationFrame(breathAnimationId)
    breathAnimationId = null
  }
}

// 鼠标视差效果
const handleMouseMove = (e: MouseEvent) => {
  if (!sectionRef.value) return
  
  const rect = sectionRef.value.getBoundingClientRect()
  const centerX = rect.width / 2
  const centerY = rect.height / 2
  const mouseX = e.clientX - rect.left - centerX
  const mouseY = e.clientY - rect.top - centerY
  
  const halfCount = Math.floor(props.layerCount / 2)
  
  // 各层视差偏移
  layerRefs.value.forEach((el, id) => {
    const layer = id - halfCount
    const depth = layer * 3
    const parallaxX = (mouseX / centerX) * depth
    const parallaxY = (mouseY / centerY) * depth
    
    gsap.to(el, {
      x: parallaxX,
      y: parallaxY,
      duration: 0.3,
      ease: 'power2.out'
    })
  })
  
  // 色散层偏移
  if (chromaticRef.value) {
    const rEl = chromaticRef.value.querySelector('.hologram-char-r-113') as HTMLElement
    const gEl = chromaticRef.value.querySelector('.hologram-char-g-113') as HTMLElement
    const bEl = chromaticRef.value.querySelector('.hologram-char-b-113') as HTMLElement
    
    if (rEl) gsap.to(rEl, { x: mouseX * 0.02, duration: 0.3 })
    if (gEl) gsap.to(gEl, { x: mouseX * 0.01, duration: 0.3 })
    if (bEl) gsap.to(bEl, { x: -mouseX * 0.02, duration: 0.3 })
  }
}

const handleMouseLeave = () => {
  // 重置视差
  layerRefs.value.forEach(el => {
    gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'power2.out' })
  })
  
  if (chromaticRef.value) {
    const chars = chromaticRef.value.querySelectorAll('span')
    chars.forEach(char => {
      gsap.to(char, { x: 0, duration: 0.5 })
    })
  }
}

// 重播动画
const handleReplay = () => {
  resetAndPlay()
}

// 重置并播放
const resetAndPlay = () => {
  // 重置图层
  layerRefs.value.forEach(el => {
    gsap.set(el, { opacity: 0 })
  })
  
  // 重置标题
  if (titleRef.value) {
    gsap.set(titleRef.value, { opacity: 0, filter: 'blur(20px)' })
  }
  
  // 重置色散
  if (chromaticRef.value) {
    gsap.set(chromaticRef.value, { opacity: 0 })
  }
  
  // 重置副标题
  if (subtitleRef.value) {
    gsap.set(subtitleRef.value, { opacity: 0, y: 30 })
  }
  
  // 重置段落
  paraRefs.value.forEach(el => {
    if (el) gsap.set(el, { opacity: 0, y: 20 })
  })
  
  // 重置扫描平面
  if (scanPlaneRef.value) {
    gsap.set(scanPlaneRef.value, { yPercent: -100, opacity: 0 })
  }
  
  // 播放
  setTimeout(() => playAnimation(), 50)
}

// 播放动画
const playAnimation = () => {
  emit('animation-start')
  
  const tl = gsap.timeline({
    onComplete: () => {
      emit('animation-complete')
      startBreathing()
    }
  })
  
  // 扫描平面入场
  if (scanPlaneRef.value) {
    tl.to(scanPlaneRef.value, {
      yPercent: 0,
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out'
    })
  }
  
  // 逐层点亮
  layerRefs.value.forEach((el, id) => {
    tl.to(el, {
      opacity: layers.value[id]?.opacity || 0.1,
      duration: 0.05,
      ease: 'none'
    }, `-=0.03`)
  })
  
  // 标题显形
  if (titleRef.value) {
    tl.to(titleRef.value, {
      opacity: 1,
      filter: 'blur(0px)',
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.2')
  }
  
  // 色散效果
  if (chromaticRef.value) {
    tl.to(chromaticRef.value, {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out'
    }, '-=0.3')
  }
  
  // 副标题
  if (subtitleRef.value) {
    tl.to(subtitleRef.value, {
      opacity: 0.8,
      y: 0,
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.2')
  }
  
  // 段落
  paraRefs.value.forEach((el, index) => {
    if (el) {
      tl.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power3.out'
      }, `-=0.3`)
    }
  })
  
  cleanupFns.push(() => tl.kill())
}

// 初始化
const initializeAnimation = () => {
  if (!sectionRef.value) return
  
  // 检查元素
  const title = titleRef.value
  if (!title) {
    console.warn('CardTextHologram: elements not ready, retrying...')
    setTimeout(initializeAnimation, 100)
    return
  }
  
  // 初始状态
  layerRefs.value.forEach(el => {
    gsap.set(el, { opacity: 0 })
  })
  
  if (titleRef.value) {
    gsap.set(titleRef.value, { opacity: 0, filter: 'blur(20px)' })
  }
  
  if (chromaticRef.value) {
    gsap.set(chromaticRef.value, { opacity: 0 })
  }
  
  if (subtitleRef.value) {
    gsap.set(subtitleRef.value, { opacity: 0, y: 30 })
  }
  
  paraRefs.value.forEach(el => {
    if (el) gsap.set(el, { opacity: 0, y: 20 })
  })
  
  if (scanPlaneRef.value) {
    gsap.set(scanPlaneRef.value, { yPercent: -100, opacity: 0 })
  }
  
  // ScrollTrigger
  scrollTriggerInstance = ScrollTrigger.create({
    trigger: sectionRef.value,
    start: 'top 80%',
    end: 'top 20%',
    scrub: 1.5,
    onUpdate: (self) => {
      progress.value = self.progress * 100
      emit('scroll-progress', self.progress)
      
      if (self.progress > 0.05) {
        scrollHintHidden.value = true
      }
      
      // 扫描平面跟随滚动
      if (scanPlaneRef.value) {
        gsap.set(scanPlaneRef.value, {
          yPercent: -100 + self.progress * 200
        })
      }
      
      // 逐层显影
      const layerProgress = self.progress * props.layerCount
      layerRefs.value.forEach((el, id) => {
        const targetOpacity = id < layerProgress 
          ? (layers.value[id]?.opacity || 0.1) 
          : 0
        
        gsap.to(el, {
          opacity: targetOpacity,
          duration: 0.1
        })
      })
      
      // 标题渐显
      if (titleRef.value) {
        const titleOpacity = Math.min(1, Math.max(0, (self.progress - 0.2) * 2))
        gsap.set(titleRef.value, { opacity: titleOpacity })
      }
      
      // 色散渐显
      if (chromaticRef.value) {
        const chromaOpacity = Math.min(1, Math.max(0, (self.progress - 0.4) * 2))
        gsap.set(chromaticRef.value, { opacity: chromaOpacity })
      }
    },
    onEnter: () => {
      stopBreathing()
      if (props.autoPlay) {
        playAnimation()
      }
    },
    onLeaveBack: () => {
      stopBreathing()
      // 重置
      layerRefs.value.forEach(el => {
        gsap.set(el, { opacity: 0 })
      })
      
      if (titleRef.value) {
        gsap.set(titleRef.value, { opacity: 0, filter: 'blur(20px)' })
      }
      
      if (chromaticRef.value) {
        gsap.set(chromaticRef.value, { opacity: 0 })
      }
      
      if (subtitleRef.value) {
        gsap.set(subtitleRef.value, { opacity: 0, y: 30 })
      }
      
      paraRefs.value.forEach(el => {
        if (el) gsap.set(el, { opacity: 0, y: 20 })
      })
      
      if (scanPlaneRef.value) {
        gsap.set(scanPlaneRef.value, { yPercent: -100, opacity: 0 })
      }
    }
  })
  
  cleanupFns.push(() => scrollTriggerInstance?.kill())
}

onMounted(() => {
  // 初始化粒子
  initParticles()
  animateParticles()
  
  // 等待 DOM 渲染
  nextTick(() => {
    setTimeout(initializeAnimation, 200)
  })
  
  // 窗口大小变化
  const handleResize = () => {
    initParticles()
    ScrollTrigger.refresh()
  }
  window.addEventListener('resize', handleResize)
  cleanupFns.push(() => window.removeEventListener('resize', handleResize))
})

// 监听 title 变化
watch(() => props.title, (newTitle) => {
  displayTitle.value = newTitle
})

onUnmounted(() => {
  // 清理所有动画
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0
  
  // 清理呼吸动画
  stopBreathing()
  
  // 清理粒子动画
  if (particleAnimationId !== null) {
    cancelAnimationFrame(particleAnimationId)
    particleAnimationId = null
  }
  
  // 清理 ScrollTrigger
  scrollTriggerInstance?.kill()
  ScrollTrigger.getAll().forEach(st => st.kill())
  
  // 清理 Canvas
  if (particlesCanvasRef.value) {
    const ctx = particlesCanvasRef.value.getContext('2d')
    if (ctx) {
      ctx.clearRect(0, 0, particlesCanvasRef.value.width, particlesCanvasRef.value.height)
    }
  }
  
  // 清理 refs
  layerRefs.value.clear()
  paraRefs.value = []
})
</script>

<style scoped>
.hologram-section-113 {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, #050510 0%, #0a0a1a 50%, #050510 100%);
  font-family: 'Orbitron', 'Rajdhani', 'Segoe UI', sans-serif;
}

/* 暗室背景 */
.hologram-dark-room-113 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(ellipse at center, rgba(0, 255, 136, 0.03) 0%, transparent 70%);
  pointer-events: none;
}

/* 全息基台 */
.hologram-platform-113 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1000px;
  z-index: 5;
}

/* 激光扫描平面 */
.hologram-scan-plane-113 {
  position: absolute;
  left: 0;
  width: 100%;
  height: 300px;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(0, 255, 136, 0.1) 45%,
    rgba(0, 255, 136, 0.3) 50%,
    rgba(0, 255, 136, 0.1) 55%,
    transparent 100%
  );
  transform: translateY(-100%);
  opacity: 0;
  pointer-events: none;
  z-index: 10;
}

.hologram-scan-beam-113 {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 2px;
  background: v-bind(scanColor);
  box-shadow: 
    0 0 20px v-bind(scanColor),
    0 0 40px v-bind(scanColor),
    0 0 60px v-bind(scanColor);
}

.hologram-scan-glow-113 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(0, 255, 136, 0.3) 0%, transparent 70%);
  filter: blur(30px);
}

/* 分层文字容器 */
.hologram-text-container-113 {
  position: relative;
  transform-style: preserve-3d;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 文字图层 */
.hologram-text-layer-113 {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.hologram-char-113 {
  font-size: v-bind(fontSize);
  font-weight: v-bind(fontWeight);
  color: rgba(0, 255, 136, 0.3);
  text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
}

/* 文字主体 */
.hologram-title-113 {
  font-size: v-bind(fontSize);
  font-weight: v-bind(fontWeight);
  color: #00ff88;
  text-shadow: 
    0 0 10px rgba(0, 255, 136, 0.8),
    0 0 20px rgba(0, 255, 136, 0.6),
    0 0 40px rgba(0, 255, 136, 0.4),
    0 0 80px rgba(0, 255, 136, 0.2);
  margin: 0;
  letter-spacing: 0.1em;
  opacity: 0;
  filter: blur(20px);
}

/* 色散效果层 */
.hologram-chromatic-113 {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
}

.hologram-char-r-113,
.hologram-char-g-113,
.hologram-char-b-113 {
  position: absolute;
  font-size: v-bind(fontSize);
  font-weight: v-bind(fontWeight);
  margin: 0;
  letter-spacing: 0.1em;
}

.hologram-char-r-113 {
  color: #ff0040;
  text-shadow: 
    -3px 0 10px #ff0040,
    -6px 0 20px #ff0040;
  transform: translateX(-3px);
}

.hologram-char-g-113 {
  color: #00ff88;
  text-shadow: 0 0 15px #00ff88;
}

.hologram-char-b-113 {
  color: #0080ff;
  text-shadow: 
    3px 0 10px #0080ff,
    6px 0 20px #0080ff;
  transform: translateX(3px);
}

/* 栅格光栅 */
.hologram-grating-113 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 255, 136, 0.02) 2px,
    rgba(0, 255, 136, 0.02) 4px
  );
  pointer-events: none;
  animation: gratingMove 10s linear infinite;
}

@keyframes gratingMove {
  0% { background-position: 0 0; }
  100% { background-position: 0 100px; }
}

/* 内容层 */
.hologram-content-113 {
  position: relative;
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  min-height: 100vh;
  padding: 60px 20px 120px;
  max-width: 800px;
  margin: 0 auto;
}

/* 副标题 */
.hologram-subtitle-113 {
  font-size: clamp(0.75rem, 2vw, 1rem);
  color: rgba(0, 255, 136, 0.7);
  letter-spacing: 0.4em;
  text-transform: uppercase;
  margin-bottom: 20px;
  font-weight: 400;
  opacity: 0;
  transform: translateY(30px);
}

/* 段落 */
.hologram-paragraphs-113 {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

.hologram-text-113 {
  font-size: clamp(0.875rem, 1.5vw, 1rem);
  line-height: 1.9;
  color: rgba(0, 255, 136, 0.8);
  text-align: center;
  margin: 0;
  padding: 20px 30px;
  background: rgba(0, 255, 136, 0.03);
  border: 1px solid rgba(0, 255, 136, 0.15);
  border-radius: 8px;
  opacity: 0;
  transform: translateY(20px);
  backdrop-filter: blur(10px);
}

/* 粒子画布 */
.hologram-particles-113 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

/* 进度条 */
.hologram-progress-113 {
  position: fixed;
  top: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #00ff88, #00cc6a, #009950);
  z-index: 1000;
  transition: width 0.1s linear;
  box-shadow: 0 0 15px rgba(0, 255, 136, 0.5);
}

/* 控制按钮 */
.hologram-controls-113 {
  position: fixed;
  bottom: 30px;
  right: 30px;
  display: flex;
  gap: 12px;
  z-index: 100;
}

.hologram-btn-113 {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(0, 255, 136, 0.1);
  border: 1px solid rgba(0, 255, 136, 0.3);
  color: #00ff88;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0, 255, 136, 0.2);
}

.hologram-btn-113:hover {
  background: rgba(0, 255, 136, 0.2);
  transform: scale(1.1);
  box-shadow: 0 8px 25px rgba(0, 255, 136, 0.4);
}

.hologram-btn-113:active {
  transform: scale(0.95);
}

/* 滚动提示 */
.hologram-scroll-hint-113 {
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
  letter-spacing: 0.2em;
  z-index: 100;
  transition: opacity 0.5s ease;
}

.hologram-scroll-hint-113.hidden {
  opacity: 0;
  pointer-events: none;
}

.hologram-scroll-arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.hologram-scroll-arrow span {
  width: 16px;
  height: 16px;
  border-right: 2px solid rgba(0, 255, 136, 0.8);
  border-bottom: 2px solid rgba(0, 255, 136, 0.8);
  transform: rotate(45deg);
  animation: scrollArrow 1.5s ease-in-out infinite;
}

.hologram-scroll-arrow span:nth-child(2) {
  animation-delay: 0.15s;
  opacity: 0.7;
}

.hologram-scroll-arrow span:nth-child(3) {
  animation-delay: 0.3s;
  opacity: 0.4;
}

@keyframes scrollArrow {
  0%, 100% {
    transform: rotate(45deg) translateY(0);
    opacity: 1;
  }
  50% {
    transform: rotate(45deg) translateY(8px);
    opacity: 0.5;
  }
}

/* 响应式 */
@media (max-width: 768px) {
  .hologram-controls-113 {
    bottom: 20px;
    right: 20px;
  }

  .hologram-btn-113 {
    width: 44px;
    height: 44px;
  }

  .hologram-text-113 {
    padding: 16px 20px;
  }

  .hologram-content-113 {
    padding: 40px 20px 100px;
  }
}
</style>
