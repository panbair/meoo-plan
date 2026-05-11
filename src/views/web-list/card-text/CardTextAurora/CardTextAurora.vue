<template>
  <div ref="parentRef" class="aurora-section-ddd">
    <!-- 星空背景 -->
    <div class="aurora-stars-ddd">
      <div 
        v-for="i in 80" 
        :key="'star-'+i" 
        class="aurora-star-ddd"
        :style="{
          left: starPositions[i - 1]?.x + '%',
          top: starPositions[i - 1]?.y + '%',
          animationDelay: (i * 0.1) + 's',
          width: (1 + Math.random()) + 'px',
          height: (1 + Math.random()) + 'px'
        }"
      ></div>
    </div>

    <!-- 极光层 -->
    <div class="aurora-layer-ddd" ref="auroraLayerRef">
      <div 
        v-for="i in curtainCount" 
        :key="'curtain-'+i"
        :ref="el => setCurtainRef(el as HTMLElement, i - 1)"
        class="aurora-curtain-ddd"
        :style="{
          left: getCurtainPosition(i - 1) + '%',
          '--curtain-hue': (120 + i * 15) % 360,
          '--curtain-phase': (i * 0.5),
          height: (60 + Math.random() * 40) + '%'
        }"
      ></div>
    </div>

    <!-- 文字容器 -->
    <div class="aurora-text-container-ddd" ref="textContainerRef">
      <span
        v-for="(char, index) in charData"
        :key="'aurora-char-'+index"
        :ref="el => setCharRef(el as HTMLElement, index)"
        class="aurora-char-ddd"
        :style="{
          '--char-hue': (120 + index * 60) % 360
        }"
      >{{ char }}</span>
    </div>

    <!-- 副标题 -->
    <p class="aurora-subtitle-ddd" ref="subtitleRef">{{ subtitle }}</p>

    <!-- 进度条 -->
    <div class="aurora-progress-ddd" :style="{ width: progress + '%' }"></div>
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
  curtainIntensity?: number
}

const props = withDefaults(defineProps<Props>(), {
  title: '极光帷幕',
  subtitle: '北极之光 · 天幕垂帘',
  curtainIntensity: 1
})

// Refs
const parentRef = ref<HTMLElement | null>(null)
const auroraLayerRef = ref<HTMLElement | null>(null)
const textContainerRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)

const curtainRefs = ref<Map<number, HTMLElement>>(new Map())
const charRefs = ref<Map<number, HTMLElement>>(new Map())

// 状态
const progress = ref(0)
const curtainCount = 60

// 预生成星空位置
const starPositions = Array.from({ length: 80 }, () => ({
  x: Math.random() * 100,
  y: Math.random() * 100
}))

// 字符数据
const charData = computed(() => props.title.split(''))

// 清理函数
type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []
let ctx: gsap.Context | null = null
let scrollTriggerInstance: ScrollTrigger | null = null
let colorAnimationId: number | null = null

// 设置帷幕 ref
function setCurtainRef(el: HTMLElement | null, index: number) {
  if (el) {
    curtainRefs.value.set(index, el)
  }
}

// 设置字符 ref
function setCharRef(el: HTMLElement | null, index: number) {
  if (el) {
    charRefs.value.set(index, el)
  }
}

// 计算帷幕位置
function getCurtainPosition(index: number): number {
  return (index / curtainCount) * 100
}

// 色彩流动动画
function animateColors() {
  const curtains = Array.from(curtainRefs.value.values())
  
  curtains.forEach((curtain, i) => {
    const hue = (120 + i * 15 + Date.now() * 0.02) % 360
    const nextHue = (hue + 60) % 360
    
    curtain.style.background = `
      linear-gradient(
        180deg,
        transparent 0%,
        hsla(${hue}, 80%, 60%, 0.15) 20%,
        hsla(${nextHue}, 70%, 50%, 0.3) 50%,
        hsla(${hue}, 80%, 60%, 0.15) 80%,
        transparent 100%
      )
    `
  })
  
  // 文字色彩
  const chars = Array.from(charRefs.value.values())
  chars.forEach((char, i) => {
    const hue = (120 + i * 60 + Date.now() * 0.01) % 360
    char.style.color = `hsl(${hue}, 80%, 70%)`
    char.style.textShadow = `
      0 0 20px hsla(${hue}, 80%, 60%, 0.8),
      0 0 40px hsla(${hue}, 70%, 50%, 0.6),
      0 0 60px hsla(${hue}, 80%, 50%, 0.4)
    `
  })
  
  colorAnimationId = requestAnimationFrame(animateColors)
}

// 入场动画
function playEntryAnimation() {
  const curtains = Array.from(curtainRefs.value.values())
  const chars = Array.from(charRefs.value.values())
  
  // 初始状态 - 帷幕无序飘荡
  curtains.forEach((curtain, index) => {
    gsap.set(curtain, {
      x: (Math.random() - 0.5) * 100,
      opacity: Math.random() * 0.5 + 0.2,
      scaleX: 0.8 + Math.random() * 0.4
    })
  })
  
  gsap.set(chars, {
    opacity: 0,
    y: 20,
    filter: 'blur(10px)'
  })
  
  if (subtitleRef.value) {
    gsap.set(subtitleRef.value, {
      opacity: 0,
      y: 20
    })
  }
  
  // 创建Timeline
  const tl = gsap.timeline()
  
  // 阶段1: 帷幕开始有序排列
  curtains.forEach((curtain, index) => {
    const targetX = getCurtainPosition(index) * 8 - 4 // 映射到文字区域
    tl.to(curtain, {
      x: targetX,
      opacity: 0.3 + (index % 3) * 0.1,
      scaleX: 1,
      duration: 1.5,
      ease: 'power2.inOut'
    }, index * 0.02)
  })
  
  // 阶段2: 文字显现
  chars.forEach((char, index) => {
    tl.to(char, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.8,
      ease: 'power3.out'
    }, `-=${1}`)
  })
  
  // 阶段3: 帷幕波动
  curtains.forEach((curtain, index) => {
    tl.to(curtain, {
      x: `+=${(Math.sin(index * 0.3) * 20)}`,
      duration: 2,
      ease: 'sine.inOut',
      repeat: 2,
      yoyo: true
    }, `-=${1.5}`)
  })
  
  // 副标题
  tl.to(subtitleRef.value, {
    opacity: 0.8,
    y: 0,
    duration: 0.8,
    ease: 'power2.out'
  }, '-=0.5')
}

// 鼠标交互 - 风吹拂帷幕
function setupMouseInteraction() {
  const curtains = Array.from(curtainRefs.value.values())
  
  parentRef.value?.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX
    const mouseY = e.clientY
    
    curtains.forEach((curtain, index) => {
      const rect = curtain.getBoundingClientRect()
      const curtainCenterX = rect.left + rect.width / 2
      const curtainCenterY = rect.top + rect.height / 2
      
      const distance = Math.sqrt(
        Math.pow(mouseX - curtainCenterX, 2) + 
        Math.pow(mouseY - curtainCenterY, 2)
      )
      
      if (distance < 200) {
        const strength = (200 - distance) / 200
        const offsetX = (mouseX - curtainCenterX) * strength * 0.3
        
        gsap.to(curtain, {
          x: offsetX,
          opacity: 0.3 + strength * 0.4,
          duration: 0.5,
          ease: 'power2.out'
        })
      } else {
        gsap.to(curtain, {
          opacity: 0.3,
          duration: 1,
          ease: 'power2.out'
        })
      }
    })
  })
  
  // 文字hover效果
  const chars = Array.from(charRefs.value.values())
  chars.forEach((char) => {
    char.addEventListener('mouseenter', () => {
      gsap.to(char, {
        scale: 1.1,
        duration: 0.3,
        ease: 'power2.out'
      })
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
  
  // 启动色彩动画
  animateColors()
  
  setTimeout(() => {
    ctx = gsap.context(() => {
      // 入场动画
      playEntryAnimation()
      
      // 鼠标交互
      setupMouseInteraction()
      
      // ScrollTrigger
      scrollTriggerInstance = ScrollTrigger.create({
        trigger: parentRef.value,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 1.5,
        onUpdate: (self) => {
          progress.value = self.progress * 100
          
          // 极光层视差
          if (auroraLayerRef.value) {
            gsap.set(auroraLayerRef.value, {
              x: -self.progress * 30
            })
          }
        },
        onEnter: () => {
          playEntryAnimation()
        },
        onLeaveBack: () => {
          const curtains = Array.from(curtainRefs.value.values())
          const chars = Array.from(charRefs.value.values())
          
          curtains.forEach((curtain, index) => {
            gsap.set(curtain, {
              x: (Math.random() - 0.5) * 100,
              opacity: Math.random() * 0.5 + 0.2,
              scaleX: 0.8 + Math.random() * 0.4
            })
          })
          
          gsap.set(chars, {
            opacity: 0,
            y: 20,
            filter: 'blur(10px)'
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
  
  if (colorAnimationId !== null) {
    cancelAnimationFrame(colorAnimationId)
    colorAnimationId = null
  }
  
  scrollTriggerInstance?.kill()
  ScrollTrigger.getAll().forEach(st => st.kill())
  
  curtainRefs.value.clear()
  charRefs.value.clear()
})
</script>

<style scoped>
.aurora-section-ddd {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(
    180deg,
    #020814 0%,
    #0a1628 30%,
    #0f2847 50%,
    #0a1628 70%,
    #020814 100%
  );
  font-family: 'Noto Serif SC', 'SimSun', serif;
}

/* 星空 */
.aurora-stars-ddd {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.aurora-star-ddd {
  position: absolute;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  animation: star-twinkle-ddd 3s ease-in-out infinite;
}

@keyframes star-twinkle-ddd {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

/* 极光层 */
.aurora-layer-ddd {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  pointer-events: none;
}

.aurora-curtain-ddd {
  position: absolute;
  top: 0;
  width: 3px;
  background: linear-gradient(
    180deg,
    transparent 0%,
    hsla(120, 80%, 60%, 0.2) 20%,
    hsla(180, 70%, 50%, 0.3) 50%,
    hsla(120, 80%, 60%, 0.2) 80%,
    transparent 100%
  );
  filter: blur(2px);
  transform-origin: top center;
  opacity: 0.3;
}

/* 文字容器 */
.aurora-text-container-ddd {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 0.1em;
  z-index: 10;
}

.aurora-char-ddd {
  display: inline-block;
  font-size: clamp(3rem, 10vw, 6rem);
  font-weight: 700;
  color: hsl(120, 80%, 70%);
  text-shadow: 
    0 0 20px hsla(120, 80%, 60%, 0.8),
    0 0 40px hsla(120, 70%, 50%, 0.6),
    0 0 60px hsla(120, 80%, 50%, 0.4);
  user-select: none;
  cursor: pointer;
  transition: transform 0.2s ease;
  filter: blur(0px);
}

.aurora-char-ddd:hover {
  transform: scale(1.1);
}

/* 副标题 */
.aurora-subtitle-ddd {
  position: absolute;
  bottom: 18%;
  left: 50%;
  transform: translateX(-50%);
  font-size: clamp(0.8rem, 1.5vw, 1rem);
  color: rgba(150, 220, 200, 0.7);
  letter-spacing: 0.5em;
  white-space: nowrap;
  z-index: 10;
  text-shadow: 0 2px 10px rgba(0, 100, 80, 0.5);
}

/* 进度条 */
.aurora-progress-ddd {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, 
    #00ff88 0%,
    #00ffcc 50%,
    #88ff00 100%
  );
  z-index: 100;
  transition: width 0.1s ease;
  box-shadow: 0 0 15px rgba(0, 255, 136, 0.6);
}

/* 响应式 */
@media (max-width: 768px) {
  .aurora-char-ddd {
    font-size: clamp(2rem, 12vw, 4rem);
  }

  .aurora-subtitle-ddd {
    letter-spacing: 0.2em;
    font-size: 0.7rem;
    bottom: 12%;
  }

  .aurora-curtain-ddd {
    width: 2px;
  }
}
</style>
