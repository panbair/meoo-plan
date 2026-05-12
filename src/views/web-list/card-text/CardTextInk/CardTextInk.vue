<template>
  <div
    class="ink-calligraphy-section-108"
    ref="sectionRef"
    @mousemove="handleMouseMove"
  >
    <!-- 远山剪影 SVG -->
    <svg class="ink-mountains-108" ref="mountainsRef" viewBox="0 0 1440 320" preserveAspectRatio="none">
      <path
        class="ink-mountain-1-108"
        d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        fill="rgba(180,160,140,0.05)"
      />
      <path
        class="ink-mountain-2-108"
        d="M0,256L48,261.3C96,267,192,277,288,261.3C384,245,480,203,576,202.7C672,203,768,245,864,266.7C960,288,1056,288,1152,266.7C1248,245,1344,203,1392,181.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        fill="rgba(160,140,120,0.04)"
      />
    </svg>

    <!-- 金箔飘屑 -->
    <div class="ink-gold-foil-container-108" ref="goldFoilContainerRef">
      <div
        v-for="foil in goldFoils"
        :key="foil.id"
        class="ink-gold-foil-108"
        :ref="el => setFoilRef(el, foil.id)"
        :style="{
          left: foil.x + '%',
          top: foil.y + '%',
          width: foil.size + 'px',
          height: foil.size + 'px',
          transform: `rotate(${foil.rotation}deg)`
        }"
      ></div>
    </div>

    <!-- 涟漪容器 -->
    <div class="ink-ripple-container-108" ref="rippleContainerRef"></div>

    <!-- 墨滴粒子 -->
    <canvas ref="inkParticlesCanvasRef" class="ink-particles-108"></canvas>

    <!-- 内容层 -->
    <div class="ink-content-108" ref="contentRef">
      <!-- 副标题 -->
      <p
        v-if="subtitle"
        class="ink-subtitle-108"
        ref="subtitleRef"
      >
        {{ subtitle }}
      </p>

      <!-- 主标题容器 -->
      <h1 class="ink-title-container-108" ref="titleContainerRef">
        <span
          v-for="item in titleChars"
          :key="item.key"
          class="ink-char-wrapper-108"
        >
          <span
            class="ink-char-108"
            :ref="el => setCharRef(el, item.index)"
          >
            {{ item.char }}
          </span>
        </span>
      </h1>

      <!-- 段落纸卡 -->
      <div class="ink-paragraphs-108" ref="paragraphsRef">
        <div
          v-for="(para, index) in paragraphs"
          :key="index"
          class="ink-paper-card-108"
          :ref="el => setCardRef(el, index)"
        >
          <div class="ink-paper-texture-108"></div>
          <p class="ink-paper-text-108">{{ para }}</p>
        </div>
      </div>

      <!-- 卷轴墨线 -->
      <div class="ink-scroll-line-108" ref="scrollLineRef"></div>
    </div>

    <!-- 进度条 -->
    <div
      class="ink-progress-108"
      :style="{ width: progress + '%' }"
    ></div>

    <!-- 控制按钮 -->
    <div class="ink-controls-108">
      <button class="ink-btn-108" @click="handleReplay" title="重播">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
        </svg>
      </button>
      <button
        class="ink-btn-108"
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
    <div class="ink-scroll-hint-108" :class="{ hidden: scrollHintHidden }">
      <span>向下滚动</span>
      <div class="ink-scroll-arrow">
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
  fontSize?: string
  fontWeight?: number
  autoPlay?: boolean
  enableParticles?: boolean
  enableGoldFoil?: boolean
  enableRipple?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '墨韵流芳',
  subtitle: '',
  paragraphs: () => [],
  animationDuration: 2.0,
  staggerDelay: 0.15,
  fontSize: 'clamp(2.5rem, 8vw, 5rem)',
  fontWeight: 600,
  autoPlay: true,
  enableParticles: true,
  enableGoldFoil: true,
  enableRipple: true
})

// Emits 定义
const emit = defineEmits<{
  'animation-start': []
  'animation-complete': []
  'scroll-progress': [progress: number]
}>()

// Refs
const sectionRef = ref<HTMLElement | null>(null)
const mountainsRef = ref<HTMLElement | null>(null)
const goldFoilContainerRef = ref<HTMLElement | null>(null)
const rippleContainerRef = ref<HTMLElement | null>(null)
const inkParticlesCanvasRef = ref<HTMLCanvasElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const titleContainerRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const paragraphsRef = ref<HTMLElement | null>(null)
const scrollLineRef = ref<HTMLElement | null>(null)
const charRefs = ref<Map<number, HTMLElement>>(new Map())
const cardRefs = ref<Map<number, HTMLElement>>(new Map())
const foilRefs = ref<Map<number, HTMLElement>>(new Map())

// 状态
const progress = ref(0)
const isPlaying = ref(true)
const scrollHintHidden = ref(false)
const scrollProgress = ref(0)

// 清理函数类型
type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []
let ctx: gsap.Context | null = null
let scrollTriggerInstance: ScrollTrigger | null = null
let animationFrameId: number | null = null
let inkParticles: InkParticle[] = []
let ripples: Ripple[] = []
let goldFoils: GoldFoil[] = []

interface InkParticle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  life: number
}

interface Ripple {
  x: number
  y: number
  scale: number
  opacity: number
  element: HTMLElement | null
}

interface GoldFoil {
  id: number
  x: number
  y: number
  size: number
  rotation: number
  vx: number
  vy: number
  vr: number
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

// 设置卡片 ref
const setCardRef = (el: HTMLElement | null, index: number) => {
  if (el) {
    cardRefs.value.set(index, el)
  }
}

// 设置金箔 ref
const setFoilRef = (el: HTMLElement | null, id: number) => {
  if (el) {
    foilRefs.value.set(id, el)
  }
}

// 初始化金箔
const initGoldFoils = () => {
  goldFoils = []
  const count = Math.min(30, Math.floor(window.innerWidth / 50))

  for (let i = 0; i < count; i++) {
    goldFoils.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 3,
      rotation: Math.random() * 360,
      vx: (Math.random() - 0.5) * 0.3,
      vy: Math.random() * 0.2 + 0.1,
      vr: (Math.random() - 0.5) * 2
    })
  }
}

// 初始化墨滴粒子
const initInkParticles = () => {
  if (!inkParticlesCanvasRef.value) return

  const canvas = inkParticlesCanvasRef.value
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  inkParticles = []
  for (let i = 0; i < 20; i++) {
    inkParticles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: 0,
      vy: 0,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.3 + 0.1,
      life: 0
    })
  }
}

// 创建涟漪
const createRipple = (x: number, y: number) => {
  if (!props.enableRipple || !rippleContainerRef.value) return

  for (let i = 0; i < 3; i++) {
    const ripple = document.createElement('div')
    ripple.className = 'ink-ripple-108'
    ripple.style.left = x + 'px'
    ripple.style.top = y + 'px'
    rippleContainerRef.value.appendChild(ripple)

    gsap.to(ripple, {
      scale: 1.5,
      opacity: 0,
      duration: 1.2,
      delay: i * 0.15,
      ease: 'power2.out',
      onComplete: () => {
        ripple.remove()
      }
    })
  }
}

// 墨滴粒子动画
const animateInkParticles = () => {
  if (!inkParticlesCanvasRef.value || !props.enableParticles) return

  const canvas = inkParticlesCanvasRef.value
  const ctx2d = canvas.getContext('2d')
  if (!ctx2d) return

  ctx2d.clearRect(0, 0, canvas.width, canvas.height)

  inkParticles.forEach(particle => {
    // 墨滴飞溅效果
    if (particle.life > 0) {
      particle.x += particle.vx
      particle.y += particle.vy
      particle.vy += 0.1 // 轻微重力
      particle.life -= 0.02
      particle.opacity = particle.life * 0.3

      if (particle.life <= 0) {
        particle.life = 0
        particle.opacity = 0
      }
    }

    // 绘制
    if (particle.opacity > 0) {
      const gradient = ctx2d.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size * 2
      )
      gradient.addColorStop(0, `rgba(40, 35, 30, ${particle.opacity})`)
      gradient.addColorStop(1, 'transparent')

      ctx2d.beginPath()
      ctx2d.fillStyle = gradient
      ctx2d.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2)
      ctx2d.fill()
    }
  })

  animationFrameId = requestAnimationFrame(animateInkParticles)
}

// 墨滴飞溅
const emitInkSplash = (x: number, y: number) => {
  inkParticles.forEach(particle => {
    if (particle.life === 0) {
      particle.x = x + (Math.random() - 0.5) * 20
      particle.y = y + (Math.random() - 0.5) * 20
      particle.vx = (Math.random() - 0.5) * 3
      particle.vy = (Math.random() - 0.5) * 3 - 1
      particle.life = Math.random() * 0.5 + 0.3
      particle.size = Math.random() * 4 + 1
    }
  })
}

// 初始化 Canvas
const initCanvas = () => {
  if (!inkParticlesCanvasRef.value) return
  inkParticlesCanvasRef.value.width = window.innerWidth
  inkParticlesCanvasRef.value.height = window.innerHeight
}

// 鼠标移动处理
const handleMouseMove = (e: MouseEvent) => {
  if (!props.enableRipple) return

  // 创建涟漪
  createRipple(e.clientX, e.clientY)

  // 墨滴飞溅
  if (Math.random() > 0.7) {
    emitInkSplash(e.clientX, e.clientY)
  }

  // 卡片轻微吸引
  if (contentRef.value) {
    const cardElements = Array.from(cardRefs.value.values())
    cardElements.forEach(card => {
      const rect = card.getBoundingClientRect()
      const cardCenterX = rect.left + rect.width / 2
      const cardCenterY = rect.top + rect.height / 2
      const dx = e.clientX - cardCenterX
      const dy = e.clientY - cardCenterY
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < 150) {
        const force = (150 - dist) / 150 * 8
        const angle = Math.atan2(dy, dx)

        gsap.to(card, {
          x: Math.cos(angle) * force,
          y: Math.sin(angle) * force * 0.3,
          duration: 0.4,
          ease: 'power2.out',
          overwrite: 'auto'
        })
      }
    })
  }
}

// 重播动画
const handleReplay = () => {
  const charElements = Array.from(charRefs.value.values())
  if (charElements.length === 0) return

  // 重置字符
  charElements.forEach(char => {
    gsap.set(char, {
      filter: 'blur(20px)',
      opacity: 0,
      y: 20,
      scaleY: 1.3
    })
  })

  // 重置副标题
  if (subtitleRef.value) {
    gsap.set(subtitleRef.value, {
      filter: 'blur(15px)',
      opacity: 0,
      color: 'rgba(120, 120, 120, 0.5)'
    })
  }

  // 重置卡片
  const cardElements = Array.from(cardRefs.value.values())
  cardElements.forEach((card, index) => {
    gsap.set(card, {
      y: -300 - index * 50,
      rotation: (Math.random() - 0.5) * 30,
      opacity: 0,
      scale: 0.9
    })
  })

  // 重置卷轴线
  if (scrollLineRef.value) {
    gsap.set(scrollLineRef.value, {
      scaleX: 0,
      opacity: 0
    })
  }

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
  const charElements = Array.from(charRefs.value.values())
  if (charElements.length === 0) return

  emit('animation-start')

  // 标题逐字挥毫生成 - 模拟毛笔书写
  charElements.forEach((char, index) => {
    const delay = index * props.staggerDelay

    // 笔锋压感效果
    gsap.fromTo(char,
      {
        filter: 'blur(20px)',
        opacity: 0,
        y: 20,
        scaleY: 1.3,
        transformOrigin: 'bottom center'
      },
      {
        filter: 'blur(0px)',
        opacity: 1,
        y: 0,
        scaleY: 1,
        duration: props.animationDuration * 0.6,
        delay,
        ease: 'power2.out'
      }
    )

    // 墨点飞溅
    setTimeout(() => {
      if (char) {
        const rect = char.getBoundingClientRect()
        emitInkSplash(rect.left + rect.width / 2, rect.top + rect.height / 2)
      }
    }, (delay + props.animationDuration * 0.3) * 1000)
  })

  // 副标题墨韵晕染
  if (subtitleRef.value) {
    const subtitleDelay = charElements.length * props.staggerDelay + 0.3

    gsap.to(subtitleRef.value, {
      filter: 'blur(0px)',
      opacity: 1,
      color: '#3d3d3d',
      duration: props.animationDuration,
      delay: subtitleDelay,
      ease: 'power2.out'
    })
  }

  // 段落纸卡古法悬浮下落
  const cardElements = Array.from(cardRefs.value.values())
  cardElements.forEach((card, index) => {
    const cardDelay = (charElements.length * props.staggerDelay) + 0.5 + (index * 0.2)

    gsap.to(card, {
      y: 0,
      rotation: 0,
      opacity: 1,
      scale: 1,
      duration: props.animationDuration * 1.2,
      delay: cardDelay,
      ease: 'bounce.out'
    })
  })

  // 卷轴墨线绘制
  if (scrollLineRef.value && cardElements.length > 0) {
    const lineDelay = (charElements.length * props.staggerDelay) + (cardElements.length * 0.2) + 1

    gsap.to(scrollLineRef.value, {
      scaleX: 1,
      opacity: 1,
      duration: 1.5,
      delay: lineDelay,
      ease: 'power2.inOut'
    })
  }

  // 动画完成
  const totalDuration = (charElements.length * props.staggerDelay) + props.animationDuration + 2
  setTimeout(() => {
    emit('animation-complete')
  }, totalDuration * 1000)
}

// 背景色彩渐进
const updateBackgroundColor = (progressValue: number) => {
  if (!sectionRef.value) return

  // 从清水色调到旧宣纸色
  const colors = [
    { pos: 0, color: 'rgba(250, 248, 245, 1)' },      // 顶部清水
    { pos: 0.5, color: 'rgba(245, 240, 235, 1)' },    // 中间暖灰
    { pos: 1, color: 'rgba(240, 235, 225, 1)' }      // 底部旧宣纸
  ]

  // 根据进度选择颜色
  let topColor = colors[0].color
  let bottomColor = colors[colors.length - 1].color

  if (progressValue < 0.5) {
    bottomColor = colors[1].color
  } else {
    topColor = colors[1].color
  }

  gsap.to(sectionRef.value, {
    background: `linear-gradient(180deg, ${topColor} 0%, ${bottomColor} 100%)`,
    duration: 0.1
  })
}

onMounted(() => {
  const rootEl = sectionRef.value
  if (!rootEl) return

  // 初始化
  initCanvas()
  initInkParticles()
  initGoldFoils()

  // 启动粒子动画
  if (props.enableParticles) {
    animateInkParticles()
  }

  // 等待 DOM 渲染
  setTimeout(() => {
    ctx = gsap.context(() => {
      const charElements = Array.from(charRefs.value.values())

      // 初始字符状态
      charElements.forEach(char => {
        gsap.set(char, {
          filter: 'blur(20px)',
          opacity: 0,
          y: 20,
          scaleY: 1.3,
          transformOrigin: 'bottom center'
        })
      })

      // 副标题初始状态
      if (subtitleRef.value) {
        gsap.set(subtitleRef.value, {
          filter: 'blur(15px)',
          opacity: 0,
          color: 'rgba(120, 120, 120, 0.5)'
        })
      }

      // 卡片初始状态
      const cardElements = Array.from(cardRefs.value.values())
      cardElements.forEach((card, index) => {
        gsap.set(card, {
          y: -300 - index * 50,
          rotation: (Math.random() - 0.5) * 30,
          opacity: 0,
          scale: 0.9,
          transformOrigin: 'center center'
        })
      })

      // 卷轴线初始状态
      if (scrollLineRef.value) {
        gsap.set(scrollLineRef.value, {
          scaleX: 0,
          opacity: 0,
          transformOrigin: 'left center'
        })
      }

      // ScrollTrigger 控制
      scrollTriggerInstance = ScrollTrigger.create({
        trigger: rootEl,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 1.5,
        onUpdate: (self) => {
          progress.value = self.progress * 100
          scrollProgress.value = self.progress
          emit('scroll-progress', self.progress)

          if (self.progress > 0.1) {
            scrollHintHidden.value = true
          }

          // 背景色彩渐进
          updateBackgroundColor(self.progress)

          // 远山视差
          if (mountainsRef.value) {
            const mountain1 = mountainsRef.value.querySelector('.ink-mountain-1-108')
            const mountain2 = mountainsRef.value.querySelector('.ink-mountain-2-108')

            if (mountain1) {
              gsap.set(mountain1, { x: -self.progress * 50 })
            }
            if (mountain2) {
              gsap.set(mountain2, { x: -self.progress * 30 })
            }
          }
        },
        onEnter: () => {
          if (props.autoPlay && isPlaying.value) {
            playAnimation()
          }
        },
        onLeaveBack: () => {
          // 重置
          charElements.forEach(char => {
            gsap.set(char, {
              filter: 'blur(20px)',
              opacity: 0,
              y: 20,
              scaleY: 1.3
            })
          })

          if (subtitleRef.value) {
            gsap.set(subtitleRef.value, {
              filter: 'blur(15px)',
              opacity: 0,
              color: 'rgba(120, 120, 120, 0.5)'
            })
          }

          cardElements.forEach((card, index) => {
            gsap.set(card, {
              y: -300 - index * 50,
              rotation: (Math.random() - 0.5) * 30,
              opacity: 0,
              scale: 0.9
            })
          })

          if (scrollLineRef.value) {
            gsap.set(scrollLineRef.value, {
              scaleX: 0,
              opacity: 0
            })
          }
        }
      })

      cleanupFns.push(() => scrollTriggerInstance?.kill())

      // 金箔飘落动画
      if (props.enableGoldFoil) {
        const animateGoldFoils = () => {
          goldFoils.forEach(foil => {
            const foilEl = foilRefs.value.get(foil.id)
            if (!foilEl) return

            foil.x += foil.vx
            foil.y += foil.vy
            foil.rotation += foil.vr

            // 边界反弹
            if (foil.y > 100) {
              foil.y = -5
              foil.x = Math.random() * 100
            }
            if (foil.x < 0) foil.x = 100
            if (foil.x > 100) foil.x = 0

            gsap.set(foilEl, {
              x: foil.x + '%',
              y: foil.y + '%',
              rotation: foil.rotation
            })
          })

          requestAnimationFrame(animateGoldFoils)
        }
        animateGoldFoils()
      }
    }, rootEl)
  }, 100)

  // 窗口大小变化
  window.addEventListener('resize', () => {
    initCanvas()
    initInkParticles()
    initGoldFoils()
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

  // 清理粒子
  inkParticles = []
  ripples = []
  goldFoils = []

  // 清理 Canvas 内容
  if (inkParticlesCanvasRef.value) {
    const ctx2d = inkParticlesCanvasRef.value.getContext('2d')
    if (ctx2d) {
      ctx2d.clearRect(0, 0, inkParticlesCanvasRef.value.width, inkParticlesCanvasRef.value.height)
    }
  }

  // 清理涟漪容器
  if (rippleContainerRef.value) {
    rippleContainerRef.value.innerHTML = ''
  }

  // 清理 ScrollTrigger
  scrollTriggerInstance?.kill()
  ScrollTrigger.getAll().forEach(st => st.kill())

  // 清理 ref
  charRefs.value.clear()
  cardRefs.value.clear()
  foilRefs.value.clear()

  // 移除事件监听
  window.removeEventListener('resize', initCanvas)
})
</script>

<style scoped>
.ink-calligraphy-section-108 {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, #faf8f5 0%, #f5f0eb 100%);
  transition: background 0.3s ease;
}

/* 远山剪影 */
.ink-mountains-108 {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 200%;
  height: 40%;
  pointer-events: none;
  z-index: 1;
}

/* 金箔飘屑容器 */
.ink-gold-foil-container-108 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
}

.ink-gold-foil-108 {
  position: absolute;
  background: linear-gradient(135deg, #d4af37, #f5d76e, #d4af37);
  opacity: 0.4;
  border-radius: 2px;
  box-shadow: 0 0 5px rgba(212, 175, 55, 0.3);
}

/* 涟漪容器 */
.ink-ripple-container-108 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 3;
}

:deep(.ink-ripple-108) {
  position: absolute;
  width: 60px;
  height: 60px;
  border: 2px solid rgba(80, 70, 60, 0.2);
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  box-shadow:
    0 0 10px rgba(80, 70, 60, 0.1),
    inset 0 0 10px rgba(80, 70, 60, 0.05);
}

/* 墨滴粒子 */
.ink-particles-108 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 4;
}

/* 内容层 */
.ink-content-108 {
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
.ink-subtitle-108 {
  font-size: clamp(0.875rem, 2vw, 1.125rem);
  color: rgba(120, 120, 120, 0.5);
  letter-spacing: 0.3em;
  text-transform: uppercase;
  margin-bottom: 30px;
  font-weight: 400;
  filter: blur(15px);
  opacity: 0;
}

/* 标题容器 */
.ink-title-container-108 {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.1em;
  padding: 20px 0;
  margin: 0;
}

/* 字符包装 */
.ink-char-wrapper-108 {
  display: inline-block;
}

/* 字符 */
.ink-char-108 {
  display: inline-block;
  font-size: v-bind(fontSize);
  font-weight: v-bind(fontWeight);
  color: #2d2d2d;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  filter: blur(20px);
  opacity: 0;
  transform-origin: bottom center;
  position: relative;
}

/* 段落纸卡容器 */
.ink-paragraphs-108 {
  max-width: 700px;
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 段落纸卡 */
.ink-paper-card-108 {
  position: relative;
  padding: 32px 40px;
  background: rgba(255, 252, 248, 0.9);
  border-radius: 4px;
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.05),
    0 8px 20px rgba(0, 0, 0, 0.03);
  overflow: hidden;
  transform-style: preserve-3d;
  will-change: transform, opacity;
  cursor: default;
  border: 1px solid rgba(200, 190, 180, 0.3);
}

/* 纸张纹理 */
.ink-paper-texture-108 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
  pointer-events: none;
  opacity: 0.5;
}

/* 撕边效果 */
.ink-paper-card-108::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(200, 190, 180, 0.2) 2%,
    transparent 4%,
    rgba(200, 190, 180, 0.15) 6%,
    transparent 8%
  );
  pointer-events: none;
}

/* 卡片文字 */
.ink-paper-text-108 {
  font-size: clamp(1rem, 2vw, 1.125rem);
  line-height: 2;
  color: #4a4a4a;
  text-align: center;
  margin: 0;
  position: relative;
  z-index: 1;
  letter-spacing: 0.05em;
}

/* 卷轴墨线 */
.ink-scroll-line-108 {
  position: absolute;
  bottom: 20%;
  left: 10%;
  right: 10%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #3d3d3d, transparent);
  transform-origin: left center;
  transform: scaleX(0);
  opacity: 0;
  box-shadow: 0 0 10px rgba(61, 61, 61, 0.3);
}

/* 进度条 */
.ink-progress-108 {
  position: fixed;
  top: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #8b7355, #a08060, #c4a574);
  z-index: 1000;
  transition: width 0.1s linear;
  box-shadow: 0 0 10px rgba(139, 115, 85, 0.5);
}

/* 控制按钮 */
.ink-controls-108 {
  position: fixed;
  bottom: 30px;
  right: 30px;
  display: flex;
  gap: 12px;
  z-index: 100;
}

.ink-btn-108 {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 252, 248, 0.9);
  border: 1px solid rgba(200, 190, 180, 0.4);
  color: #8b7355;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.ink-btn-108:hover {
  background: rgba(255, 252, 248, 0.95);
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(139, 115, 85, 0.2);
}

.ink-btn-108:active {
  transform: scale(0.95);
}

/* 滚动提示 */
.ink-scroll-hint-108 {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: #a08060;
  font-size: 14px;
  z-index: 100;
  transition: opacity 0.5s ease;
}

.ink-scroll-hint-108.hidden {
  opacity: 0;
  pointer-events: none;
}

.ink-scroll-arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.ink-scroll-arrow span {
  width: 20px;
  height: 20px;
  border-right: 2px solid #a08060;
  border-bottom: 2px solid #a08060;
  transform: rotate(45deg);
  animation: scrollArrow 1.5s ease-in-out infinite;
}

.ink-scroll-arrow span:nth-child(2) {
  animation-delay: 0.15s;
  opacity: 0.7;
}

.ink-scroll-arrow span:nth-child(3) {
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
  .ink-btn-108 {
    width: 44px;
    height: 44px;
  }

  .ink-controls-108 {
    bottom: 20px;
    right: 20px;
  }

  .ink-paper-card-108 {
    padding: 24px;
  }

  .ink-paragraphs-108 {
    margin-top: 40px;
    gap: 16px;
  }
}
</style>
