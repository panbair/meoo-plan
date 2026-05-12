<template>
  <div
    class="crystal-section-110"
    ref="sectionRef"
    @mousemove="handleMouseMove"
  >
    <!-- 暗物质背景粒子 -->
    <canvas ref="darkMatterCanvasRef" class="crystal-dark-matter-110"></canvas>

    <!-- 能量环容器 -->
    <div class="crystal-rings-container-110" ref="ringsContainerRef"></div>

    <!-- 碎片层 -->
    <div class="crystal-fragments-110" ref="fragmentsRef"></div>

    <!-- 内容层 -->
    <div class="crystal-content-110" ref="contentRef">
      <!-- 副标题 -->
      <p
        v-if="subtitle"
        class="crystal-subtitle-110"
        ref="subtitleRef"
      >
        {{ subtitle }}
      </p>

      <!-- 主标题容器 -->
      <h1 class="crystal-title-110" ref="titleRef">
        <span
          v-for="item in titleChars"
          :key="item.key"
          class="crystal-char-wrapper-110"
          :ref="el => setCharWrapperRef(el, item.index)"
        >
          <span
            class="crystal-char-110"
            :ref="el => setCharRef(el, item.index)"
          >
            {{ item.char }}
          </span>
        </span>
      </h1>

      <!-- 段落卡片 -->
      <div class="crystal-paragraphs-110" ref="paragraphsRef">
        <div
          v-for="(para, index) in paragraphs"
          :key="index"
          class="crystal-card-110"
          :ref="el => setCardRef(el, index)"
        >
          <p class="crystal-card-text-110">{{ para }}</p>
        </div>
      </div>
    </div>

    <!-- 进度条 -->
    <div
      class="crystal-progress-110"
      :style="{ width: progress + '%' }"
    ></div>

    <!-- 控制按钮 -->
    <div class="crystal-controls-110">
      <button class="crystal-btn-110" @click="handleReplay" title="重播">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
        </svg>
      </button>
      <button
        class="crystal-btn-110"
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
    <div class="crystal-scroll-hint-110" :class="{ hidden: scrollHintHidden }">
      <span>向下滚动</span>
      <div class="crystal-scroll-arrow">
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
  fragmentCount?: number
  fontSize?: string
  fontWeight?: number
  enableMouseGravity?: boolean
  autoPlay?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'CRYSTAL',
  subtitle: '',
  paragraphs: () => [],
  animationDuration: 2.0,
  staggerDelay: 0.1,
  fragmentCount: 40,
  fontSize: 'clamp(2.5rem, 8vw, 5rem)',
  fontWeight: 600,
  enableMouseGravity: true,
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
const darkMatterCanvasRef = ref<HTMLCanvasElement | null>(null)
const ringsContainerRef = ref<HTMLElement | null>(null)
const fragmentsRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const paragraphsRef = ref<HTMLElement | null>(null)
const charRefs = ref<Map<number, HTMLElement>>(new Map())
const charWrapperRefs = ref<Map<number, HTMLElement>>(new Map())
const cardRefs = ref<Map<number, HTMLElement>>(new Map())

// 状态
const progress = ref(0)
const isPlaying = ref(true)
const scrollHintHidden = ref(false)
const isReconstructed = ref(false)

// 清理函数类型
type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []
let ctx: gsap.Context | null = null
let scrollTriggerInstance: ScrollTrigger | null = null
let animationFrameId: number | null = null
let darkMatterParticles: DarkMatterParticle[] = []
let fragments: Fragment[] = []
let breathAnimationId: number | null = null

interface DarkMatterParticle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  hue: number
  phase: number
}

interface Fragment {
  id: number
  x: number
  y: number
  targetX: number
  targetY: number
  vx: number
  vy: number
  size: number
  rotation: number
  rotationSpeed: number
  shape: 'triangle' | 'diamond' | 'hexagon'
  layer: number // 0-2: 背景, 中景, 前景
  opacity: number
  color: string
  element: HTMLElement | null
  isReconstructed: boolean
}

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
const setCharRef = (el: HTMLElement | null, index: number) => {
  if (el) {
    charRefs.value.set(index, el)
  }
}

// 设置字符包装器 ref
const setCharWrapperRef = (el: HTMLElement | null, index: number) => {
  if (el) {
    charWrapperRefs.value.set(index, el)
  }
}

// 设置卡片 ref
const setCardRef = (el: HTMLElement | null, index: number) => {
  if (el) {
    cardRefs.value.set(index, el)
  }
}

// 创建碎片
const createFragments = () => {
  if (!fragmentsRef.value || !contentRef.value) return

  fragmentsRef.value.innerHTML = ''
  fragments = []

  const charElements = Array.from(charRefs.value.values())
  let fragmentId = 0

  charElements.forEach((charEl, charIndex) => {
    const rect = charEl.getBoundingClientRect()
    const contentRect = contentRef.value!.getBoundingClientRect()

    const targetX = rect.left + rect.width / 2 - contentRect.left
    const targetY = rect.top + rect.height / 2 - contentRect.top

    // 每个字符创建多个碎片
    const count = Math.floor(props.fragmentCount / charElements.length) || 5

    for (let i = 0; i < count; i++) {
      // 随机初始位置 - 围绕字符的大范围区域
      const angle = Math.random() * Math.PI * 2
      const distance = 200 + Math.random() * 400
      const startX = targetX + Math.cos(angle) * distance
      const startY = targetY + Math.sin(angle) * distance

      // 随机景深层
      const layer = Math.floor(Math.random() * 3)

      // 随机形状
      const shapes: ('triangle' | 'diamond' | 'hexagon')[] = ['triangle', 'diamond', 'hexagon']
      const shape = shapes[Math.floor(Math.random() * shapes.length)]

      // 随机颜色 - 水晶渐变
      const colors = [
        'rgba(147, 197, 253, 0.6)', // 冰蓝
        'rgba(196, 181, 253, 0.6)', // 淡紫
        'rgba(253, 230, 138, 0.5)', // 暖金
        'rgba(167, 243, 208, 0.5)', // 薄荷
        'rgba(252, 165, 165, 0.4)'  // 珊瑚
      ]
      const color = colors[Math.floor(Math.random() * colors.length)]

      // 创建 DOM 元素
      const fragEl = document.createElement('div')
      fragEl.className = `crystal-fragment-110 crystal-${shape}-110`
      fragEl.style.cssText = `
        position: absolute;
        left: ${startX}px;
        top: ${startY}px;
        width: ${4 + Math.random() * 8}px;
        height: ${4 + Math.random() * 8}px;
        background: ${color};
        transform: translateZ(${layer * 50}px);
        opacity: ${0.3 + Math.random() * 0.4};
        filter: blur(${layer * 2}px);
        pointer-events: none;
      `
      fragmentsRef.value.appendChild(fragEl)

      fragments.push({
        id: fragmentId++,
        x: startX,
        y: startY,
        targetX,
        targetY,
        vx: 0,
        vy: 0,
        size: 4 + Math.random() * 8,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        shape,
        layer,
        opacity: 0.3 + Math.random() * 0.4,
        color,
        element: fragEl,
        isReconstructed: false
      })
    }
  })
}

// 初始化暗物质粒子
const initDarkMatter = () => {
  if (!darkMatterCanvasRef.value) return

  const canvas = darkMatterCanvasRef.value
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  darkMatterParticles = []
  const count = Math.min(150, Math.floor(window.innerWidth / 10))

  for (let i = 0; i < count; i++) {
    darkMatterParticles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.2,
      vy: Math.sin(Math.random() * Math.PI * 2) * 0.1,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.3 + 0.1,
      hue: 260 + Math.random() * 40, // 紫色范围
      phase: Math.random() * Math.PI * 2
    })
  }
}

// 暗物质动画
const animateDarkMatter = () => {
  if (!darkMatterCanvasRef.value) return

  const canvas = darkMatterCanvasRef.value
  const ctx2d = canvas.getContext('2d')
  if (!ctx2d) return

  ctx2d.clearRect(0, 0, canvas.width, canvas.height)

  darkMatterParticles.forEach(particle => {
    // 正弦波运动
    particle.phase += 0.01
    particle.x += particle.vx + Math.sin(particle.phase) * 0.1
    particle.y += particle.vy

    // 边界反弹
    if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
    if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

    // 绘制
    const gradient = ctx2d.createRadialGradient(
      particle.x, particle.y, 0,
      particle.x, particle.y, particle.size * 3
    )
    gradient.addColorStop(0, `hsla(${particle.hue}, 50%, 40%, ${particle.opacity})`)
    gradient.addColorStop(1, 'transparent')

    ctx2d.beginPath()
    ctx2d.fillStyle = gradient
    ctx2d.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2)
    ctx2d.fill()
  })

  animationFrameId = requestAnimationFrame(animateDarkMatter)
}

// 创建能量环
const createEnergyRing = (x: number, y: number, color: string) => {
  if (!ringsContainerRef.value) return

  for (let i = 0; i < 4; i++) {
    const ring = document.createElement('div')
    ring.className = 'crystal-energy-ring-110'
    ring.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: 20px;
      height: 20px;
      border: 2px solid ${color};
      border-radius: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
    `
    ringsContainerRef.value.appendChild(ring)

    gsap.to(ring, {
      scale: 3 + i * 0.5,
      opacity: 0,
      duration: 0.4,
      delay: i * 0.05,
      ease: 'power2.out',
      onComplete: () => ring.remove()
    })
  }
}

// 碎片归一化（斥力场效果）
const applyRepulsion = (frag: Fragment, others: Fragment[]) => {
  others.forEach(other => {
    if (other.id === frag.id) return

    const dx = frag.x - other.x
    const dy = frag.y - other.y
    const dist = Math.sqrt(dx * dx + dy * dy)

    if (dist < 30 && dist > 0) {
      const force = (30 - dist) / 30 * 2
      const nx = dx / dist
      const ny = dy / dist

      frag.vx += nx * force
      frag.vy += ny * force
    }
  })
}

// 碎片重构动画
const animateFragments = (progress: number) => {
  if (!isPlaying.value) return

  fragments.forEach((frag, index) => {
    if (frag.isReconstructed || !frag.element) return

    // 根据进度计算目标位置
    const charIndex = Math.floor(index / (props.fragmentCount / titleChars.value.length))
    const charFragments = fragments.filter((_, i) =>
      Math.floor(i / (props.fragmentCount / titleChars.value.length)) === charIndex
    )
    const fragInCharIndex = index % charFragments.length
    const totalFrags = charFragments.length

    // 计算该碎片的飞行进度
    const charProgress = Math.max(0, Math.min(1,
      (progress - charIndex * 0.1) / (1 - charIndex * 0.1)
    ))

    // 非线性引力 - 先慢后快
    const easedProgress = Math.pow(charProgress, 0.7)

    if (easedProgress > 0.1) {
      // 应用斥力
      applyRepulsion(frag, charFragments)

      // 引力向目标
      const dx = frag.targetX - frag.x
      const dy = frag.targetY - frag.y

      frag.vx += dx * 0.02 * easedProgress
      frag.vy += dy * 0.02 * easedProgress

      // 阻力
      frag.vx *= 0.95
      frag.vy *= 0.95

      // 更新位置
      frag.x += frag.vx
      frag.y += frag.vy

      // 旋转
      frag.rotation += frag.rotationSpeed * easedProgress

      // 更新 DOM
      frag.element.style.left = `${frag.x}px`
      frag.element.style.top = `${frag.y}px`
      frag.element.style.transform = `
        translateZ(${frag.layer * 50 * (1 - easedProgress)}px)
        rotate(${frag.rotation}deg)
      `
      frag.element.style.filter = `blur(${frag.layer * 2 * (1 - easedProgress)}px)`
      frag.element.style.opacity = String(frag.opacity * (0.5 + easedProgress * 0.5))

      // 检查是否到达目标
      const distToTarget = Math.sqrt(
        Math.pow(frag.x - frag.targetX, 2) +
        Math.pow(frag.y - frag.targetY, 2)
      )

      if (distToTarget < 2 && !frag.isReconstructed) {
        frag.isReconstructed = true
        frag.x = frag.targetX
        frag.y = frag.targetY
        frag.element.style.opacity = '0'

        // 创建能量环
        createEnergyRing(frag.targetX, frag.targetY, frag.color)
      }
    }
  })
}

// 呼吸光晕动画
const startBreathing = () => {
  const charWrappers = Array.from(charWrapperRefs.value.values()).filter(el => el !== null)
  
  if (charWrappers.length === 0) return

  const animate = () => {
    const time = Date.now() / 1000
    charWrappers.forEach((wrapper, index) => {
      const breath = Math.sin(time * 0.8 + index * 0.3) * 0.15 + 0.35
      wrapper.style.textShadow = `
        0 0 ${20 + breath * 30}px rgba(147, 197, 253, ${breath}),
        0 0 ${40 + breath * 40}px rgba(196, 181, 253, ${breath * 0.5})
      `
    })
    breathAnimationId = requestAnimationFrame(animate)
  }
  animate()
}

// 停止呼吸
const stopBreathing = () => {
  if (breathAnimationId !== null) {
    cancelAnimationFrame(breathAnimationId)
    breathAnimationId = null
  }
}

// 鼠标引力透镜
const handleMouseMove = (e: MouseEvent) => {
  if (!props.enableMouseGravity || !isReconstructed.value) return

  const mouseX = e.clientX
  const mouseY = e.clientY

  fragments.forEach(frag => {
    if (!frag.element || !frag.isReconstructed) return

    const rect = frag.element.getBoundingClientRect()
    const fragX = rect.left + rect.width / 2
    const fragY = rect.top + rect.height / 2

    const dx = mouseX - fragX
    const dy = mouseY - fragY
    const dist = Math.sqrt(dx * dx + dy * dy)

    if (dist < 180 && dist > 0) {
      const force = (180 - dist) / 180 * 15
      const angle = Math.atan2(dy, dx)

      gsap.to(frag.element, {
        x: Math.cos(angle) * force,
        y: Math.sin(angle) * force,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto'
      })
    }
  })
}

// 重播动画
const handleReplay = () => {
  // 获取最新元素
  const charElements = Array.from(charRefs.value.values()).filter(el => el !== null)
  const cardElements = Array.from(cardRefs.value.values()).filter(el => el !== null)
  
  if (charElements.length === 0) {
    console.warn('CardTextCrystal: No char elements to replay')
    return
  }

  // 重置碎片
  fragments.forEach(frag => {
    if (frag.element) {
      gsap.set(frag.element, { opacity: frag.opacity })
    }
    frag.isReconstructed = false
  })

  // 重置字符
  gsap.set(charElements, {
    opacity: 0,
    filter: 'blur(10px)'
  })

  // 重置副标题
  if (subtitleRef.value) {
    gsap.set(subtitleRef.value, { opacity: 0 })
  }

  // 重置卡片
  cardElements.forEach(card => {
    gsap.set(card, { opacity: 0, y: 50 })
  })

  isReconstructed.value = false
  stopBreathing()

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
    console.warn('CardTextCrystal: No char elements to animate')
    return
  }

  emit('animation-start')

  // 字符淡入
  charElements.forEach((char, index) => {
    gsap.to(char, {
      opacity: 1,
      filter: 'blur(0px)',
      duration: props.animationDuration,
      delay: index * props.staggerDelay,
      ease: 'power2.out'
    })
  })

  // 副标题淡入
  if (subtitleRef.value) {
    gsap.to(subtitleRef.value, {
      opacity: 0.8,
      duration: props.animationDuration,
      delay: charElements.length * props.staggerDelay + 0.3,
      ease: 'power2.out'
    })
  }

  // 卡片入场
  const cardElements = Array.from(cardRefs.value.values()).filter(el => el !== null)
  cardElements.forEach((card, index) => {
    gsap.to(card, {
      opacity: 1,
      y: 0,
      duration: props.animationDuration * 0.8,
      delay: charElements.length * props.staggerDelay + 0.5 + index * 0.2,
      ease: 'power3.out'
    })
  })

  // 碎片重构完成
  setTimeout(() => {
    isReconstructed.value = true
    startBreathing()
    emit('animation-complete')
  }, (charElements.length * props.staggerDelay + props.animationDuration) * 1000)
}

onMounted(() => {
  const rootEl = sectionRef.value
  if (!rootEl) return

  // 初始化
  initDarkMatter()
  animateDarkMatter()

  // 等待 DOM 渲染完成
  setTimeout(() => {
    // 获取字符元素
    const charElements = Array.from(charRefs.value.values()).filter(el => el !== null)
    
    // 确保字符元素已渲染
    if (charElements.length === 0) {
      console.warn('CardTextCrystal: char elements not ready, retrying...')
      setTimeout(() => onMounted(), 100)
      return
    }
    
    // 获取卡片元素
    const cardElements = Array.from(cardRefs.value.values()).filter(el => el !== null)
    // 获取字符包装元素
    const charWrapperElements = Array.from(charWrapperRefs.value.values()).filter(el => el !== null)

    // 初始字符状态
    if (charElements.length > 0) {
      gsap.set(charElements, {
        opacity: 0,
        filter: 'blur(10px)'
      })
    }

    // 副标题初始状态
    if (subtitleRef.value) {
      gsap.set(subtitleRef.value, { opacity: 0 })
    }

    // 卡片初始状态
    cardElements.forEach(card => {
      gsap.set(card, {
        opacity: 0,
        y: 50
      })
    })

    // 创建碎片
    createFragments()

    // ScrollTrigger 控制
    scrollTriggerInstance = ScrollTrigger.create({
      trigger: rootEl,
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1.2,
      onUpdate: (self) => {
        progress.value = self.progress * 100
        emit('scroll-progress', self.progress)

        if (self.progress > 0.05) {
          scrollHintHidden.value = true
        }

        // 碎片动画
        animateFragments(self.progress)
      },
      onEnter: () => {
        if (props.autoPlay && isPlaying.value) {
          playAnimation()
        }
      },
      onLeaveBack: () => {
        // 重新获取最新元素
        const currentCharElements = Array.from(charRefs.value.values()).filter(el => el !== null)
        const currentCardElements = Array.from(cardRefs.value.values()).filter(el => el !== null)
        
        // 重置
        currentCharElements.forEach(char => {
          gsap.set(char, {
            opacity: 0,
            filter: 'blur(10px)'
          })
        })

        if (subtitleRef.value) {
          gsap.set(subtitleRef.value, { opacity: 0 })
        }

        currentCardElements.forEach(card => {
          gsap.set(card, {
            opacity: 0,
            y: 50
          })
        })

        // 重置碎片
        fragments.forEach(frag => {
          if (frag.element) {
            gsap.set(frag.element, { opacity: frag.opacity })
          }
          frag.isReconstructed = false
        })

        isReconstructed.value = false
        stopBreathing()
      }
    })

    cleanupFns.push(() => scrollTriggerInstance?.kill())
  }, 200)

  // 窗口大小变化
  window.addEventListener('resize', () => {
    initDarkMatter()
    if (fragmentsRef.value) {
      createFragments()
    }
  })
})

onUnmounted(() => {
  // 清理所有动画
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0

  // 清理 gsap.context
  ctx?.revert()
  ctx = null

  // 清理呼吸动画
  stopBreathing()

  // 清理 Canvas 动画
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }

  // 清理粒子
  darkMatterParticles = []
  fragments = []

  // 清理 Canvas 内容
  if (darkMatterCanvasRef.value) {
    const ctx2d = darkMatterCanvasRef.value.getContext('2d')
    if (ctx2d) {
      ctx2d.clearRect(0, 0, darkMatterCanvasRef.value.width, darkMatterCanvasRef.value.height)
    }
  }

  // 清理能量环
  if (ringsContainerRef.value) {
    ringsContainerRef.value.innerHTML = ''
  }

  // 清理碎片 DOM
  if (fragmentsRef.value) {
    fragmentsRef.value.innerHTML = ''
  }

  // 清理 ScrollTrigger
  scrollTriggerInstance?.kill()
  ScrollTrigger.getAll().forEach(st => st.kill())

  // 清理 ref
  charRefs.value.clear()
  charWrapperRefs.value.clear()
  cardRefs.value.clear()
})
</script>

<style scoped>
.crystal-section-110 {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, #0a0a1a 0%, #12122a 50%, #0a0a1a 100%);
}

/* 暗物质背景 */
.crystal-dark-matter-110 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

/* 能量环容器 */
.crystal-rings-container-110 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 5;
}

/* 碎片层 */
.crystal-fragments-110 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 6;
  perspective: 1000px;
}

/* 三角形碎片 */
:deep(.crystal-triangle-110) {
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
}

/* 菱形碎片 */
:deep(.crystal-diamond-110) {
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
}

/* 六边形碎片 */
:deep(.crystal-hexagon-110) {
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
}

/* 能量环 */
:deep(.crystal-energy-ring-110) {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}

/* 内容层 */
.crystal-content-110 {
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
.crystal-subtitle-110 {
  font-size: clamp(0.875rem, 2vw, 1.125rem);
  color: rgba(196, 181, 253, 0.8);
  letter-spacing: 0.3em;
  text-transform: uppercase;
  margin-bottom: 30px;
  font-weight: 300;
  opacity: 0;
}

/* 主标题 */
.crystal-title-110 {
  font-size: v-bind(fontSize);
  font-weight: v-bind(fontWeight);
  color: #ffffff;
  text-align: center;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.1em;
  perspective: 1000px;
}

/* 字符包装 */
.crystal-char-wrapper-110 {
  display: inline-block;
  position: relative;
}

/* 字符 */
.crystal-char-110 {
  display: inline-block;
  background: linear-gradient(135deg, #93c5fd, #c4b5fd, #fde68a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  opacity: 0;
  position: relative;
  z-index: 1;
}

/* 段落容器 */
.crystal-paragraphs-110 {
  max-width: 800px;
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 段落卡片 */
.crystal-card-110 {
  position: relative;
  padding: 32px 40px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  border: 1px solid rgba(196, 181, 253, 0.2);
  backdrop-filter: blur(20px);
  overflow: hidden;
  transform: translateY(50px);
  opacity: 0;
}

.crystal-card-110::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg,
    rgba(147, 197, 253, 0.1) 0%,
    rgba(196, 181, 253, 0.1) 50%,
    rgba(253, 230, 138, 0.05) 100%
  );
  pointer-events: none;
}

/* 卡片文字 */
.crystal-card-text-110 {
  font-size: clamp(1rem, 2vw, 1.125rem);
  line-height: 1.9;
  color: rgba(255, 255, 255, 0.85);
  text-align: center;
  margin: 0;
  position: relative;
  z-index: 1;
}

/* 进度条 */
.crystal-progress-110 {
  position: fixed;
  top: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #93c5fd, #c4b5fd, #fde68a);
  z-index: 1000;
  transition: width 0.1s linear;
  box-shadow: 0 0 15px rgba(147, 197, 253, 0.5);
}

/* 控制按钮 */
.crystal-controls-110 {
  position: fixed;
  bottom: 30px;
  right: 30px;
  display: flex;
  gap: 12px;
  z-index: 100;
}

.crystal-btn-110 {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(196, 181, 253, 0.3);
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.crystal-btn-110:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: scale(1.1);
  box-shadow: 0 8px 25px rgba(147, 197, 253, 0.3);
}

.crystal-btn-110:active {
  transform: scale(0.95);
}

/* 滚动提示 */
.crystal-scroll-hint-110 {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: rgba(196, 181, 253, 0.8);
  font-size: 14px;
  z-index: 100;
  transition: opacity 0.5s ease;
}

.crystal-scroll-hint-110.hidden {
  opacity: 0;
  pointer-events: none;
}

.crystal-scroll-arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.crystal-scroll-arrow span {
  width: 20px;
  height: 20px;
  border-right: 2px solid rgba(196, 181, 253, 0.8);
  border-bottom: 2px solid rgba(196, 181, 253, 0.8);
  transform: rotate(45deg);
  animation: scrollArrow 1.5s ease-in-out infinite;
}

.crystal-scroll-arrow span:nth-child(2) {
  animation-delay: 0.15s;
  opacity: 0.7;
}

.crystal-scroll-arrow span:nth-child(3) {
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
  .crystal-btn-110 {
    width: 44px;
    height: 44px;
  }

  .crystal-controls-110 {
    bottom: 20px;
    right: 20px;
  }

  .crystal-card-110 {
    padding: 24px;
  }

  .crystal-paragraphs-110 {
    margin-top: 40px;
    gap: 16px;
  }
}
</style>
