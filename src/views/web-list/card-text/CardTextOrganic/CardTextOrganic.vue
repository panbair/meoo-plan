<template>
  <div 
    class="organic-section-107" 
    ref="sectionRef"
    @mousemove="handleMouseMove"
  >
    <!-- 粒子背景层 -->
    <canvas ref="particlesCanvasRef" class="organic-particles-107"></canvas>

    <!-- 内容层 -->
    <div class="organic-content-107" ref="contentRef">
      <!-- 副标题 -->
      <p
        v-if="subtitle"
        class="organic-subtitle-107"
        ref="subtitleRef"
      >
        {{ subtitle }}
      </p>

      <!-- 主标题容器 -->
      <h1 class="organic-title-container-107" ref="titleContainerRef">
        <span
          v-for="item in titleWords"
          :key="item.key"
          class="organic-word-107"
          :ref="el => setWordRef(el, item.index)"
        >
          <span
            v-for="charItem in item.chars"
            :key="charItem.key"
            class="organic-char-107"
            :ref="el => setCharRef(el, charItem.globalIndex)"
          >
            {{ charItem.char === ' ' ? '\u00A0' : charItem.char }}
          </span>
        </span>
      </h1>

      <!-- 段落卡片 -->
      <div class="organic-paragraphs-107" ref="paragraphsRef">
        <div
          v-for="(para, index) in paragraphs"
          :key="index"
          class="organic-card-107"
          :ref="el => setCardRef(el, index)"
          @mouseenter="handleCardEnter(index)"
          @mouseleave="handleCardLeave(index)"
        >
          <p class="organic-card-text-107">{{ para }}</p>
        </div>
      </div>
    </div>

    <!-- 进度条 -->
    <div
      class="organic-progress-107"
      :style="{ width: progress + '%' }"
    ></div>

    <!-- 控制按钮 -->
    <div class="organic-controls-107">
      <button class="organic-btn-107" @click="handleReplay" title="重播">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
        </svg>
      </button>
      <button
        class="organic-btn-107"
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
    <div class="organic-scroll-hint-107" :class="{ hidden: scrollHintHidden }">
      <span>向下滚动</span>
      <div class="organic-scroll-arrow">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Props 定义
interface Props {
  title?: string
  subtitle?: string
  paragraphs?: string[]
  animationDuration?: number
  staggerDelay?: number
  gravity?: number
  friction?: number
  fontSize?: string
  fontWeight?: number
  autoPlay?: boolean
  enableParticles?: boolean
  enableMouseGravity?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'ORGANIC',
  subtitle: '',
  paragraphs: () => [],
  animationDuration: 1.2,
  staggerDelay: 0.1,
  gravity: 980,
  friction: 0.3,
  fontSize: 'clamp(3rem, 10vw, 7rem)',
  fontWeight: 700,
  autoPlay: true,
  enableParticles: true,
  enableMouseGravity: true
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
const wordRefs = ref<Map<number, HTMLElement>>(new Map())
const charRefs = ref<Map<number, HTMLElement>>(new Map())
const cardRefs = ref<Map<number, HTMLElement>>(new Map())

// 状态
const progress = ref(0)
const isPlaying = ref(true)
const scrollHintHidden = ref(false)
const mousePosition = ref({ x: 0, y: 0 })

// 清理函数类型
type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []
let ctx: gsap.Context | null = null
let scrollTriggerInstance: ScrollTrigger | null = null
let animationFrameId: number | null = null
let particles: OrganicParticle[] = []
let cardVelocities: number[] = []
let cardPositions: number[] = []

interface OrganicParticle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  hue: number
  mass: number
}

// 字符数据 - 按单词分组
const titleWords = computed(() => {
  if (!props.title) return []
  const words = props.title.split(' ')
  let globalIndex = 0

  return words.map((word, wordIndex) => {
    const chars = word.split('').map(char => ({
      char,
      key: `char-${globalIndex}`,
      globalIndex: globalIndex++
    }))
    
    return {
      word,
      chars,
      key: `word-${wordIndex}`,
      index: wordIndex
    }
  })
})

// 设置单词 ref
const setWordRef = (el: HTMLElement | null, index: number) => {
  if (el) {
    wordRefs.value.set(index, el)
  }
}

// 设置字符 ref
const setCharRef = (el: HTMLElement | null, index: number) => {
  if (el) {
    charRefs.value.set(index, el)
  }
}

// 设置卡片 ref
const setCardRef = (el: HTMLElement | null, index: number) => {
  if (el) {
    cardRefs.value.set(index, el)
    if (cardVelocities[index] === undefined) {
      cardVelocities[index] = 0
    }
    if (cardPositions[index] === undefined) {
      cardPositions[index] = 0
    }
  }
}

// 初始化粒子（布朗运动）
const initParticles = () => {
  if (!particlesCanvasRef.value) return

  const canvas = particlesCanvasRef.value
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  particles = []
  const particleCount = Math.min(80, Math.floor(window.innerWidth / 15))

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      size: Math.random() * 4 + 2,
      opacity: Math.random() * 0.4 + 0.2,
      hue: Math.random() * 40 + 30, // 暖白色到琥珀色
      mass: Math.random() * 0.5 + 0.5
    })
  }
}

// 布朗运动粒子动画
const animateParticles = () => {
  if (!particlesCanvasRef.value || !props.enableParticles) return

  const canvas = particlesCanvasRef.value
  const ctx2d = canvas.getContext('2d')
  if (!ctx2d) return

  ctx2d.clearRect(0, 0, canvas.width, canvas.height)

  particles.forEach((particle, i) => {
    // 布朗运动 - 随机扰动
    particle.vx += (Math.random() - 0.5) * 0.1
    particle.vy += (Math.random() - 0.5) * 0.1

    // 阻尼
    particle.vx *= 0.99
    particle.vy *= 0.99

    // 更新位置
    particle.x += particle.vx
    particle.y += particle.vy

    // 边界反弹
    if (particle.x < 0) {
      particle.x = 0
      particle.vx = Math.abs(particle.vx) * 0.8
    }
    if (particle.x > canvas.width) {
      particle.x = canvas.width
      particle.vx = -Math.abs(particle.vx) * 0.8
    }
    if (particle.y < 0) {
      particle.y = 0
      particle.vy = Math.abs(particle.vy) * 0.8
    }
    if (particle.y > canvas.height) {
      particle.y = canvas.height
      particle.vy = -Math.abs(particle.vy) * 0.8
    }

    // 粒子间简化的弹性碰撞
    for (let j = i + 1; j < particles.length; j++) {
      const other = particles[j]
      const dx = other.x - particle.x
      const dy = other.y - particle.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      const minDist = particle.size + other.size + 10

      if (dist < minDist && dist > 0) {
        const overlap = minDist - dist
        const nx = dx / dist
        const ny = dy / dist

        particle.x -= nx * overlap * 0.5
        particle.y -= ny * overlap * 0.5
        other.x += nx * overlap * 0.5
        other.y += ny * overlap * 0.5

        // 交换速度分量
        const dvx = particle.vx - other.vx
        const dvy = particle.vy - other.vy
        const dot = dvx * nx + dvy * ny

        if (dot > 0) {
          particle.vx -= dot * nx * 0.5
          particle.vy -= dot * ny * 0.5
          other.vx += dot * nx * 0.5
          other.vy += dot * ny * 0.5
        }
      }
    }

    // 绘制粒子
    const gradient = ctx2d.createRadialGradient(
      particle.x, particle.y, 0,
      particle.x, particle.y, particle.size * 2
    )
    gradient.addColorStop(0, `hsla(${particle.hue}, 60%, 75%, ${particle.opacity})`)
    gradient.addColorStop(0.5, `hsla(${particle.hue}, 50%, 65%, ${particle.opacity * 0.5})`)
    gradient.addColorStop(1, 'transparent')

    ctx2d.beginPath()
    ctx2d.fillStyle = gradient
    ctx2d.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2)
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

// 鼠标移动处理
const handleMouseMove = (e: MouseEvent) => {
  if (!props.enableMouseGravity || !contentRef.value) return
  
  mousePosition.value = { x: e.clientX, y: e.clientY }
  
  const cardElements = Array.from(cardRefs.value.values())
  const rect = contentRef.value.getBoundingClientRect()
  const mouseY = e.clientY - rect.top

  cardElements.forEach((card, index) => {
    const cardRect = card.getBoundingClientRect()
    const cardY = cardRect.top - rect.top + cardRect.height / 2
    const dx = e.clientX - (cardRect.left + cardRect.width / 2)
    const dy = mouseY - cardY
    const dist = Math.sqrt(dx * dx + dy * dy)

    if (dist < 200) {
      const force = (200 - dist) / 200 * 15
      const angle = Math.atan2(dy, dx)
      
      gsap.to(card, {
        x: Math.cos(angle) * force,
        y: Math.sin(angle) * force * 0.5,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto'
      })
    }
  })
}

// 卡片鼠标进入
const handleCardEnter = (index: number) => {
  const card = cardRefs.value.get(index)
  if (card) {
    gsap.to(card, {
      scale: 1.02,
      boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
      duration: 0.3,
      ease: 'back.out(1.7)'
    })
  }
}

// 卡片鼠标离开
const handleCardLeave = (index: number) => {
  const card = cardRefs.value.get(index)
  if (card) {
    gsap.to(card, {
      x: 0,
      y: 0,
      scale: 1,
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
      duration: 0.6,
      ease: 'elastic.out(1, 0.5)'
    })
  }
}

// 重播动画
const handleReplay = () => {
  const wordElements = Array.from(wordRefs.value.values())
  if (wordElements.length === 0) return

  // 重置单词状态 - 从顶部落下
  wordElements.forEach((word, index) => {
    gsap.set(word, {
      y: -window.innerHeight,
      scaleY: 1.2,
      opacity: 0
    })
  })

  // 重置副标题
  if (subtitleRef.value) {
    gsap.set(subtitleRef.value, {
      scaleX: 2,
      opacity: 0,
      y: 20
    })
  }

  // 重置卡片
  const cardElements = Array.from(cardRefs.value.values())
  cardElements.forEach((card, index) => {
    const dropHeight = 200 + Math.random() * 200
    gsap.set(card, {
      y: -dropHeight,
      scaleY: 1,
      scaleX: 1,
      opacity: 0
    })
    cardVelocities[index] = 0
    cardPositions[index] = 0
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
  const wordElements = Array.from(wordRefs.value.values())
  if (wordElements.length === 0) return

  emit('animation-start')

  // 标题单词自由落体 + 弹性碰撞
  wordElements.forEach((word, index) => {
    const delay = index * props.staggerDelay

    // 自由落体
    gsap.to(word, {
      y: 0,
      opacity: 1,
      scaleY: 1,
      duration: props.animationDuration,
      delay,
      ease: 'bounce.out',
      onComplete: () => {
        // 触碰基线后的弹性形变
        gsap.to(word, {
          scaleY: 0.85,
          scaleX: 1.05,
          duration: 0.08,
          ease: 'power2.out',
          onComplete: () => {
            gsap.to(word, {
              scaleY: 1,
              scaleX: 1,
              duration: 0.15,
              ease: 'elastic.out(1, 0.3)'
            })
          }
        })
      }
    })
  })

  // 副标题橡皮筋伸展
  if (subtitleRef.value) {
    const tl = gsap.timeline({ delay: wordElements.length * props.staggerDelay + 0.3 })

    tl.fromTo(subtitleRef.value,
      {
        scaleX: 2,
        opacity: 0,
        y: 20,
        transformOrigin: 'center center'
      },
      {
        scaleX: 1,
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'back.out(1.7)'
      }
    )

    // 过冲并荡回
    tl.to(subtitleRef.value, {
      scaleX: 0.95,
      duration: 0.1,
      ease: 'power2.in'
    })
    tl.to(subtitleRef.value, {
      scaleX: 1.02,
      duration: 0.15,
      ease: 'elastic.out(1, 0.5)'
    })
    tl.to(subtitleRef.value, {
      scaleX: 1,
      duration: 0.1,
      ease: 'power2.out'
    })
  }

  // 段落卡片天体坠落
  const cardElements = Array.from(cardRefs.value.values())
  cardElements.forEach((card, index) => {
    const dropDelay = (wordElements.length * props.staggerDelay) + 0.5 + (index * 0.1)
    const dropHeight = 200 + Math.random() * 200

    gsap.set(card, {
      y: -dropHeight,
      opacity: 0,
      scaleY: 1,
      scaleX: 1
    })

    gsap.to(card, {
      y: 0,
      opacity: 1,
      duration: props.animationDuration * 0.8,
      delay: dropDelay,
      ease: 'bounce.out',
      onUpdate: function() {
        // 实时计算速度（简化版物理）
        const currentY = gsap.getProperty(card, 'y') as number
        const targetY = 0
        if (currentY > targetY - 50 && currentY < targetY + 10) {
          cardVelocities[index] = currentY - cardPositions[index]
          cardPositions[index] = currentY
        }
      },
      onComplete: () => {
        // 触底形变
        gsap.to(card, {
          scaleY: 0.85,
          scaleX: 1.03,
          duration: 0.06,
          ease: 'power2.out',
          onComplete: () => {
            gsap.to(card, {
              scaleY: 1,
              scaleX: 1,
              duration: 0.2,
              ease: 'elastic.out(1, 0.4)'
            })
          }
        })
      }
    })
  })

  // 动画完成
  const totalDuration = (wordElements.length * props.staggerDelay) + props.animationDuration + (cardElements.length * 0.1) + 1
  setTimeout(() => {
    emit('animation-complete')
  }, totalDuration * 1000)
}

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

  // 初始化卡片速度数组
  const cardElements = Array.from(cardRefs.value.values())
  cardVelocities = new Array(cardElements.length).fill(0)
  cardPositions = new Array(cardElements.length).fill(0)

  // 等待 DOM 渲染
  setTimeout(() => {
    ctx = gsap.context(() => {
      const wordElements = Array.from(wordRefs.value.values())

      // 初始状态 - 单词在顶部隐藏
      wordElements.forEach((word, index) => {
        gsap.set(word, {
          y: -window.innerHeight,
          scaleY: 1.2,
          opacity: 0
        })
      })

      // 副标题初始状态
      if (subtitleRef.value) {
        gsap.set(subtitleRef.value, {
          scaleX: 2,
          opacity: 0,
          y: 20
        })
      }

      // 卡片初始状态
      cardElements.forEach((card, index) => {
        const dropHeight = 200 + Math.random() * 200
        gsap.set(card, {
          y: -dropHeight,
          opacity: 0,
          scaleY: 1,
          scaleX: 1
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

          if (self.progress > 0.1) {
            scrollHintHidden.value = true
          }
        },
        onEnter: () => {
          if (props.autoPlay && isPlaying.value) {
            playAnimation()
          }
        },
        onLeaveBack: () => {
          // 滚动回顶部时重置
          wordElements.forEach((word) => {
            gsap.set(word, {
              y: -window.innerHeight,
              scaleY: 1.2,
              opacity: 0
            })
          })

          if (subtitleRef.value) {
            gsap.set(subtitleRef.value, {
              scaleX: 2,
              opacity: 0,
              y: 20
            })
          }

          cardElements.forEach((card, index) => {
            const dropHeight = 200 + Math.random() * 200
            gsap.set(card, {
              y: -dropHeight,
              opacity: 0,
              scaleY: 1,
              scaleX: 1
            })
            cardVelocities[index] = 0
            cardPositions[index] = 0
          })
        }
      })

      cleanupFns.push(() => scrollTriggerInstance?.kill())
    }, rootEl)
  }, 100)

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

  // 清理 Canvas 动画
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }

  // 清理粒子数组
  particles = []
  cardVelocities = []
  cardPositions = []

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
  wordRefs.value.clear()
  charRefs.value.clear()
  cardRefs.value.clear()

  // 移除事件监听
  window.removeEventListener('resize', initCanvas)
})
</script>

<style scoped>
.organic-section-107 {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(
    180deg,
    #faf8f5 0%,
    #f5f3ef 50%,
    #faf8f5 100%
  );
}

/* 粒子背景 */
.organic-particles-107 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

/* 内容层 */
.organic-content-107 {
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
.organic-subtitle-107 {
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  color: #7c9082;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-bottom: 30px;
  font-weight: 400;
  text-shadow: 0 2px 10px rgba(124, 144, 130, 0.3);
}

/* 标题容器 */
.organic-title-container-107 {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.3em;
  padding: 20px 0;
  margin: 0;
  perspective: 1000px;
}

/* 单词 */
.organic-word-107 {
  display: inline-block;
  will-change: transform, opacity;
  transform-style: preserve-3d;
}

/* 字符 */
.organic-char-107 {
  display: inline-block;
  font-size: v-bind(fontSize);
  font-weight: v-bind(fontWeight);
  background: linear-gradient(
    135deg,
    #c4a574 0%,
    #d4b896 25%,
    #e8d5b5 50%,
    #c9a66b 75%,
    #b8956a 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 2px 4px rgba(180, 150, 100, 0.3));
}

/* 段落卡片容器 */
.organic-paragraphs-107 {
  max-width: 800px;
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 段落卡片 */
.organic-card-107 {
  position: relative;
  padding: 32px 40px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 24px;
  border: 1px solid rgba(196, 165, 116, 0.2);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10px);
  overflow: hidden;
  transform-style: preserve-3d;
  will-change: transform, opacity;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.organic-card-107:hover {
  border-color: rgba(196, 165, 116, 0.4);
}

/* 卡片装饰 */
.organic-card-107::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #c4a574, #d4b896, #e8d5b5);
  opacity: 0.6;
  border-radius: 24px 24px 0 0;
}

/* 卡片文字 */
.organic-card-text-107 {
  font-size: clamp(1rem, 2vw, 1.25rem);
  line-height: 1.9;
  color: #5a5a5a;
  text-align: center;
  margin: 0;
  position: relative;
  z-index: 1;
}

/* 进度条 */
.organic-progress-107 {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #c4a574, #d4b896, #7c9082);
  z-index: 1000;
  transition: width 0.1s linear;
  box-shadow: 0 0 15px rgba(196, 165, 116, 0.5);
}

/* 控制按钮 */
.organic-controls-107 {
  position: fixed;
  bottom: 30px;
  right: 30px;
  display: flex;
  gap: 12px;
  z-index: 100;
}

.organic-btn-107 {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(196, 165, 116, 0.3);
  color: #7c9082;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.organic-btn-107:hover {
  background: rgba(255, 255, 255, 0.95);
  transform: scale(1.1);
  box-shadow: 0 8px 25px rgba(196, 165, 116, 0.3);
}

.organic-btn-107:active {
  transform: scale(0.95);
}

/* 滚动提示 */
.organic-scroll-hint-107 {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: #7c9082;
  font-size: 14px;
  z-index: 100;
  transition: opacity 0.5s ease;
}

.organic-scroll-hint-107.hidden {
  opacity: 0;
  pointer-events: none;
}

.organic-scroll-arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.organic-scroll-arrow span {
  width: 20px;
  height: 20px;
  border-right: 2px solid #7c9082;
  border-bottom: 2px solid #7c9082;
  transform: rotate(45deg);
  animation: scrollArrow 1.5s ease-in-out infinite;
}

.organic-scroll-arrow span:nth-child(2) {
  animation-delay: 0.15s;
  opacity: 0.7;
}

.organic-scroll-arrow span:nth-child(3) {
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
  .organic-btn-107 {
    width: 44px;
    height: 44px;
  }

  .organic-controls-107 {
    bottom: 20px;
    right: 20px;
  }

  .organic-card-107 {
    padding: 24px;
  }

  .organic-paragraphs-107 {
    margin-top: 40px;
    gap: 16px;
  }
}
</style>
