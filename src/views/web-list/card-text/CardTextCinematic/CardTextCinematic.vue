<template>
  <div class="cinematic-section-106" ref="sectionRef">
    <!-- 粒子背景层 -->
    <canvas ref="particlesCanvasRef" class="cinematic-particles-106"></canvas>

    <!-- 扫描光线效果 -->
    <div class="cinematic-scanline-106" ref="scanlineRef"></div>

    <!-- 径向光晕背景 -->
    <div class="cinematic-halo-106" ref="haloRef"></div>

    <!-- 内容层 -->
    <div class="cinematic-content-106" ref="contentRef">
      <!-- 副标题 -->
      <p
        v-if="subtitle"
        class="cinematic-subtitle-106"
        ref="subtitleRef"
      >
        {{ subtitle }}
      </p>

      <!-- 主标题容器 -->
      <h1 class="cinematic-title-container-106" ref="titleContainerRef">
        <span
          v-for="item in titleChars"
          :key="item.key"
          class="cinematic-char-106"
          :ref="el => setCharRef(el, item.index)"
        >
          {{ item.char === ' ' ? '\u00A0' : item.char }}
        </span>
      </h1>

      <!-- 段落卡片 -->
      <div class="cinematic-paragraphs-106" ref="paragraphsRef">
        <div
          v-for="(para, index) in paragraphs"
          :key="index"
          class="cinematic-card-106"
          :ref="el => setCardRef(el, index)"
        >
          <div class="cinematic-card-shine-106"></div>
          <p class="cinematic-card-text-106">{{ para }}</p>
        </div>
      </div>
    </div>

    <!-- 进度条 -->
    <div
      class="cinematic-progress-106"
      :style="{ width: progress + '%' }"
    ></div>

    <!-- 控制按钮 -->
    <div class="cinematic-controls-106">
      <button class="cinematic-btn-106" @click="handleReplay" title="重播">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
        </svg>
      </button>
      <button
        class="cinematic-btn-106"
        @click="togglePlay"
        :title="isPlaying ? '暂停' : '播放'"
      >
        <svg v-if="isPlaying" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
        </svg>
        <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z"/>
        </svg>
      </button>
    </div>

    <!-- 滚动提示 -->
    <div class="cinematic-scroll-hint-106" :class="{ hidden: scrollHintHidden }">
      <span>向下滚动</span>
      <div class="cinematic-scroll-arrow">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, type ComponentPublicInstance } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// 主题配置
interface ThemeConfig {
  primary: string
  secondary: string
  accent: string
  glow: string
  gradient: string
}

const themes: Record<string, ThemeConfig> = {
  brand: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    accent: '#ec4899',
    glow: 'rgba(99, 102, 241, 0.6)',
    gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)'
  },
  tech: {
    primary: '#00d4ff',
    secondary: '#0099ff',
    accent: '#00ff88',
    glow: 'rgba(0, 212, 255, 0.6)',
    gradient: 'linear-gradient(135deg, #00d4ff, #0099ff, #00ff88)'
  },
  elegant: {
    primary: '#f59e0b',
    secondary: '#ef4444',
    accent: '#10b981',
    glow: 'rgba(245, 158, 11, 0.6)',
    gradient: 'linear-gradient(135deg, #f59e0b, #ef4444, #10b981)'
  }
}

// Props 定义
interface Props {
  title?: string
  subtitle?: string
  paragraphs?: string[]
  animationDuration?: number
  staggerDelay?: number
  theme?: 'brand' | 'tech' | 'elegant'
  fontSize?: string
  fontWeight?: number
  autoPlay?: boolean
  enableParticles?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'CINEMATIC',
  subtitle: '',
  paragraphs: () => [],
  animationDuration: 1.8,
  staggerDelay: 0.06,
  theme: 'brand',
  fontSize: 'clamp(3rem, 10vw, 8rem)',
  fontWeight: 900,
  autoPlay: true,
  enableParticles: true
})

// Emits 定义
const emit = defineEmits<{
  'animation-start': []
  'animation-complete': []
  'scroll-progress': [progress: number]
}>()

// Refs
const sectionRef = ref<HTMLElement | null>(null)
const particlesCanvasRef = ref<HTMLCanvasElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const titleContainerRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const paragraphsRef = ref<HTMLElement | null>(null)
const scanlineRef = ref<HTMLElement | null>(null)
const haloRef = ref<HTMLElement | null>(null)
const charRefs = ref<Map<number, HTMLElement>>(new Map())
const cardRefs = ref<Map<number, HTMLElement>>(new Map())

// 状态
const progress = ref(0)
const isPlaying = ref(true)
const scrollHintHidden = ref(false)

// 清理函数类型
type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []
let ctx: gsap.Context | null = null
let scrollTriggerInstance: ScrollTrigger | null = null
let animationFrameId: number | null = null
let particles: Particle[] = []

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  hue: number
}

// 主题配置
const themeConfig = computed(() => themes[props.theme] || themes.brand)

// 字符数据
const titleChars = computed(() => {
  if (!props.title) return []
  return props.title.split('').map((char, index) => ({
    char,
    index,
    key: `char-${index}`
  }))
})

// 设置字符 ref
const setCharRef = (el: any, index: number) => {
  if (el && el instanceof HTMLElement) {
    charRefs.value.set(index, el)
  }
}

// 设置卡片 ref
const setCardRef = (el: any, index: number) => {
  if (el && el instanceof HTMLElement) {
    cardRefs.value.set(index, el)
  }
}

// 初始化粒子
const initParticles = () => {
  if (!particlesCanvasRef.value) return

  const canvas = particlesCanvasRef.value
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const ctx2d = canvas.getContext('2d')
  if (!ctx2d) return

  particles = []
  const particleCount = Math.min(60, Math.floor(window.innerWidth / 20))

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.2,
      hue: Math.random() * 60 + 240 // 紫色到蓝色范围
    })
  }
}

// 粒子动画
const animateParticles = () => {
  if (!particlesCanvasRef.value || !props.enableParticles) return

  const canvas = particlesCanvasRef.value
  const ctx2d = canvas.getContext('2d')
  if (!ctx2d) return

  ctx2d.clearRect(0, 0, canvas.width, canvas.height)

  particles.forEach(particle => {
    particle.x += particle.speedX
    particle.y += particle.speedY

    // 边界检测
    if (particle.x < 0) particle.x = canvas.width
    if (particle.x > canvas.width) particle.x = 0
    if (particle.y < 0) particle.y = canvas.height
    if (particle.y > canvas.height) particle.y = 0

    // 绘制粒子
    const gradient = ctx2d.createRadialGradient(
      particle.x, particle.y, 0,
      particle.x, particle.y, particle.size * 3
    )
    gradient.addColorStop(0, `hsla(${particle.hue}, 80%, 60%, ${particle.opacity})`)
    gradient.addColorStop(1, 'transparent')

    ctx2d.beginPath()
    ctx2d.fillStyle = gradient
    ctx2d.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2)
    ctx2d.fill()
  })

  animationFrameId = requestAnimationFrame(animateParticles)
}

// 初始化 Canvas
const initCanvas = () => {
  if (!particlesCanvasRef.value) return
  particlesCanvasRef.value.width = window.innerWidth
  particlesCanvasRef.value.height = window.innerHeight
}

// 重播动画
const handleReplay = () => {
  const charElements = Array.from(charRefs.value.values()).filter(el => el !== null)
  if (charElements.length === 0) {
    console.warn('CardTextCinematic: No char elements to replay')
    return
  }

  // 重置状态
  gsap.set(charElements, {
    scale: 0.1,
    rotationX: 90,
    rotationY: 0,
    filter: 'blur(30px)',
    opacity: 0,
    fontWeight: 100
  })

  // 重置副标题
  if (subtitleRef.value) {
    gsap.set(subtitleRef.value, {
      y: 60,
      opacity: 0,
      letterSpacing: '1em',
      filter: 'blur(10px)'
    })
  }

  // 重置卡片
  const cardElements = Array.from(cardRefs.value.values()).filter(el => el !== null)
  cardElements.forEach(card => {
    gsap.set(card, {
      z: -500,
      rotationY: 45,
      opacity: 0,
      filter: 'blur(20px)'
    })
  })

  // 重新播放
  if (isPlaying.value) {
    playAnimation()
  }
}

// 播放/暂停
const togglePlay = () => {
  isPlaying.value = !isPlaying.value
  if (isPlaying.value && scrollTriggerInstance) {
    scrollTriggerInstance.scroll()
  }
}

// 播放动画
const playAnimation = () => {
  const charElements = Array.from(charRefs.value.values()).filter(el => el !== null)
  if (charElements.length === 0) {
    console.warn('CardTextCinematic: No char elements to animate')
    return
  }

  emit('animation-start')

  // 光晕扩散
  if (haloRef.value) {
    gsap.fromTo(haloRef.value,
      { scale: 0, opacity: 0 },
      { scale: 1.5, opacity: 1, duration: 1.5, ease: 'power2.out' }
    )
  }

  // 扫描光线
  if (scanlineRef.value) {
    gsap.fromTo(scanlineRef.value,
      { x: '-100%', opacity: 0 },
      { x: '100%', opacity: 0.8, duration: 1, ease: 'power2.inOut', delay: 0.5 }
    )
  }

  // 副标题动画
  if (subtitleRef.value) {
    gsap.to(subtitleRef.value, {
      y: 0,
      opacity: 1,
      letterSpacing: '0.3em',
      filter: 'blur(0px)',
      duration: 1,
      ease: 'back.out(1.7)',
      delay: 0.3
    })
  }

  // 标题字符景深飞入动画
  const tl = gsap.timeline({
    onComplete: () => {
      emit('animation-complete')
    }
  })

  // 第一阶段：景深飞入
  tl.fromTo(charElements,
    {
      scale: 0.1,
      rotationX: 90,
      filter: 'blur(30px)',
      opacity: 0,
      fontWeight: 100,
      transformPerspective: 1000,
      transformOrigin: 'center center'
    },
    {
      scale: 1,
      rotationX: 0,
      filter: 'blur(0px)',
      opacity: 1,
      fontWeight: props.fontWeight,
      duration: props.animationDuration,
      stagger: {
        each: props.staggerDelay,
        from: 'random'
      },
      ease: 'power4.out'
    }
  )

  // 第二阶段：字体权重变化
  tl.to(charElements,
    {
      fontWeight: props.fontWeight,
      duration: 0.5,
      stagger: 0.02,
      ease: 'power2.inOut'
    },
    '+=0.2'
  )

  // 段落卡片 Z轴旋转上升
  const cardElements = Array.from(cardRefs.value.values()).filter(el => el !== null)
  if (cardElements.length > 0) {
    gsap.fromTo(cardElements,
      {
        z: -500,
        rotationY: 45,
        opacity: 0,
        filter: 'blur(20px)',
        transformPerspective: 1000,
        transformOrigin: 'center center'
      },
      {
        z: 0,
        rotationY: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: props.animationDuration * 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: paragraphsRef.value,
          start: 'top 80%',
          end: 'top 30%',
          scrub: 1.5
        }
      }
    )
  }

  cleanupFns.push(() => tl.kill())
}

// 监听主题变化
watch(() => props.theme, () => {
  // 主题变化时更新粒子颜色
  initParticles()
})

onMounted(() => {
  const rootEl = sectionRef.value
  if (!rootEl) return

  // 初始化 Canvas
  initCanvas()
  initParticles()

  // 启动粒子动画
  if (props.enableParticles) {
    animateParticles()
  }

  // 等待 DOM 渲染完成
  setTimeout(() => {
    // 获取字符元素
    const charElements = Array.from(charRefs.value.values()).filter(el => el !== null)
    
    // 确保字符元素已渲染
    if (charElements.length === 0) {
      console.warn('CardTextCinematic: char elements not ready, retrying...')
      setTimeout(() => {
        onMounted()
      }, 100)
      return
    }
    
    // 获取卡片元素
    const cardElements = Array.from(cardRefs.value.values()).filter(el => el !== null)

    // 初始状态设置 - 只对存在的元素操作
    if (charElements.length > 0) {
      gsap.set(charElements, {
        scale: 0.1,
        rotationX: 90,
        filter: 'blur(30px)',
        opacity: 0,
        fontWeight: 100,
        transformPerspective: 1000,
        transformOrigin: 'center center'
      })
    }

    // 副标题初始状态
    if (subtitleRef.value) {
      gsap.set(subtitleRef.value, {
        y: 60,
        opacity: 0,
        letterSpacing: '1em',
        filter: 'blur(10px)'
      })
    }

    // 卡片初始状态
    cardElements.forEach(card => {
      gsap.set(card, {
        z: -500,
        rotationY: 45,
        opacity: 0,
        filter: 'blur(20px)',
        transformPerspective: 1000,
        transformOrigin: 'center center'
      })
    })

    // ScrollTrigger 控制
    scrollTriggerInstance = ScrollTrigger.create({
      trigger: rootEl,
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1.5,
      onUpdate: (self) => {
        progress.value = self.progress * 100
        emit('scroll-progress', self.progress)

        // 隐藏滚动提示
        if (self.progress > 0.1) {
          scrollHintHidden.value = true
        }

        // 光晕跟随滚动
        if (haloRef.value) {
          gsap.to(haloRef.value, {
            scale: 1 + self.progress * 0.5,
            opacity: 0.3 + self.progress * 0.3,
            duration: 0.1
          })
        }
      },
      onEnter: () => {
        if (props.autoPlay && isPlaying.value) {
          playAnimation()
        }
      },
      onLeaveBack: () => {
        // 滚动回顶部时重置
        if (charElements.length > 0) {
          gsap.set(charElements, {
            scale: 0.1,
            rotationX: 90,
            filter: 'blur(30px)',
            opacity: 0,
            fontWeight: 100
          })
        }

        if (subtitleRef.value) {
          gsap.set(subtitleRef.value, {
            y: 60,
            opacity: 0,
            letterSpacing: '1em',
            filter: 'blur(10px)'
          })
        }

        cardElements.forEach(card => {
          gsap.set(card, {
            z: -500,
            rotationY: 45,
            opacity: 0,
            filter: 'blur(20px)'
          })
        })
      }
    })

    cleanupFns.push(() => scrollTriggerInstance?.kill())

    // 背景呼吸动画
    const bgEl = rootEl.querySelector('.cinematic-halo-106')
    if (bgEl) {
      gsap.to(bgEl, {
        scale: '+=0.1',
        duration: 4,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
      })
    }
  }, 200)

  // 窗口大小变化
  window.addEventListener('resize', () => {
    initCanvas()
    initParticles()
  })
})

onUnmounted(() => {
  // 清理所有动画
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0

  // 清理 gsap.context
  ctx?.revert()
  ctx = null

  // 清理 Canvas
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }

  // 清理粒子数组
  particles = []

  // 清理 Canvas 内容
  if (particlesCanvasRef.value) {
    const ctx2d = particlesCanvasRef.value.getContext('2d')
    if (ctx2d) {
      ctx2d.clearRect(0, 0, particlesCanvasRef.value.width, particlesCanvasRef.value.height)
    }
  }

  // 清理 ScrollTrigger
  scrollTriggerInstance?.kill()
  ScrollTrigger.getAll().forEach(st => st.kill())

  // 清理 ref
  charRefs.value.clear()
  cardRefs.value.clear()

  // 移除事件监听
  window.removeEventListener('resize', initCanvas)
})
</script>

<style scoped>
.cinematic-section-106 {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%);
}

/* 粒子背景 */
.cinematic-particles-106 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

/* 扫描光线 */
.cinematic-scanline-106 {
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(99, 102, 241, 0.1) 45%,
    rgba(139, 92, 246, 0.2) 50%,
    rgba(99, 102, 241, 0.1) 55%,
    transparent 100%
  );
  pointer-events: none;
  z-index: 2;
  transform: translateX(-100%);
}

/* 径向光晕 */
.cinematic-halo-106 {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 150%;
  height: 150%;
  transform: translate(-50%, -50%);
  background: radial-gradient(
    ellipse at center,
    rgba(99, 102, 241, 0.15) 0%,
    rgba(139, 92, 246, 0.1) 30%,
    transparent 70%
  );
  pointer-events: none;
  z-index: 0;
  filter: blur(40px);
}

/* 内容层 */
.cinematic-content-106 {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 60px 20px;
}

/* 副标题 */
.cinematic-subtitle-106 {
  font-size: clamp(0.875rem, 2vw, 1.25rem);
  color: v-bind('themeConfig.secondary');
  letter-spacing: 0.3em;
  text-transform: uppercase;
  margin-bottom: 30px;
  font-weight: 300;
  text-shadow: 0 0 30px v-bind('themeConfig.glow');
}

/* 标题容器 */
.cinematic-title-container-106 {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  perspective: 1000px;
  perspective-origin: center center;
  padding: 20px 0;
  margin: 0;
}

/* 字符 */
.cinematic-char-106 {
  display: inline-block;
  font-size: v-bind(fontSize);
  font-weight: v-bind(fontWeight);
  background: v-bind('themeConfig.gradient');
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transform-style: preserve-3d;
  will-change: transform, filter, opacity;
  padding: 0 4px;
  position: relative;
}

/* 段落卡片容器 */
.cinematic-paragraphs-106 {
  max-width: 900px;
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 段落卡片 */
.cinematic-card-106 {
  position: relative;
  padding: 32px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  overflow: hidden;
  transform-style: preserve-3d;
  will-change: transform, opacity, filter;
}

/* 卡片闪光效果 */
.cinematic-card-shine-106 {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 100%
  );
  pointer-events: none;
}

/* 卡片文字 */
.cinematic-card-text-106 {
  font-size: clamp(1rem, 2vw, 1.25rem);
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  margin: 0;
  position: relative;
  z-index: 1;
}

/* 进度条 */
.cinematic-progress-106 {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: v-bind('themeConfig.gradient');
  z-index: 1000;
  transition: width 0.1s linear;
  box-shadow: 0 0 20px v-bind('themeConfig.glow');
}

/* 控制按钮 */
.cinematic-controls-106 {
  position: fixed;
  bottom: 30px;
  right: 30px;
  display: flex;
  gap: 12px;
  z-index: 100;
}

.cinematic-btn-106 {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.cinematic-btn-106:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: scale(1.1);
  box-shadow: 0 0 30px v-bind('themeConfig.glow');
}

.cinematic-btn-106:active {
  transform: scale(0.95);
}

/* 滚动提示 */
.cinematic-scroll-hint-106 {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  z-index: 100;
  transition: opacity 0.5s ease;
}

.cinematic-scroll-hint-106.hidden {
  opacity: 0;
  pointer-events: none;
}

.cinematic-scroll-arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.cinematic-scroll-arrow span {
  width: 20px;
  height: 20px;
  border-right: 2px solid rgba(255, 255, 255, 0.6);
  border-bottom: 2px solid rgba(255, 255, 255, 0.6);
  transform: rotate(45deg);
  animation: scrollArrow 1.5s ease-in-out infinite;
}

.cinematic-scroll-arrow span:nth-child(2) {
  animation-delay: 0.15s;
  opacity: 0.7;
}

.cinematic-scroll-arrow span:nth-child(3) {
  animation-delay: 0.3s;
  opacity: 0.4;
}

@keyframes scrollArrow {
  0%, 100% {
    transform: rotate(45deg) translateY(0);
    opacity: 1;
  }
  50% {
    transform: rotate(45deg) translateY(10px);
    opacity: 0.5;
  }
}

/* 响应式 */
@media (max-width: 768px) {
  .cinematic-btn-106 {
    width: 44px;
    height: 44px;
  }

  .cinematic-controls-106 {
    bottom: 20px;
    right: 20px;
  }

  .cinematic-card-106 {
    padding: 20px;
  }

  .cinematic-paragraphs-106 {
    margin-top: 40px;
    gap: 16px;
  }
}
</style>
