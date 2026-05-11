<template>
  <div ref="parentRef" class="boil-section-bbb">
    <!-- 烧杯背景 -->
    <div class="beaker-bg-bbb" ref="beakerRef">
      <div class="beaker-liquid-bbb" ref="liquidRef">
        <div class="liquid-surface-bbb"></div>
        <div class="liquid-light-bbb"></div>
      </div>
      <div class="beaker-glass-bbb"></div>
    </div>

    <!-- 气泡容器 -->
    <div class="bubble-container-bbb" ref="bubbleContainerRef"></div>

    <!-- 文字显示 -->
    <div class="text-container-bbb" ref="textContainerRef">
      <span
        v-for="(char, index) in charData"
        :key="'boil-char-'+index"
        :ref="el => setCharRef(el as HTMLElement, index)"
        class="boil-char-bbb"
        :style="{
          '--char-color': bubbleColors[index % bubbleColors.length]
        }"
      >{{ char }}</span>
    </div>

    <!-- 副标题 -->
    <p class="boil-subtitle-bbb" ref="subtitleRef">{{ subtitle }}</p>

    <!-- 进度条 -->
    <div class="boil-progress-bbb" :style="{ width: progress + '%' }"></div>
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
  bubbleIntensity?: number
}

const props = withDefaults(defineProps<Props>(), {
  title: '沸腾气泡',
  subtitle: '化学的魔法 · 液体的诗篇',
  bubbleIntensity: 1
})

// Refs
const parentRef = ref<HTMLElement | null>(null)
const beakerRef = ref<HTMLElement | null>(null)
const liquidRef = ref<HTMLElement | null>(null)
const bubbleContainerRef = ref<HTMLElement | null>(null)
const textContainerRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)

const charRefs = ref<Map<number, HTMLElement>>(new Map())

// 状态
const progress = ref(0)
const bubbles = ref<HTMLElement[]>([])
let bubbleId = 0

// 气泡配色
const bubbleColors = [
  'rgba(100, 200, 255, 0.4)',
  'rgba(150, 220, 255, 0.35)',
  'rgba(200, 240, 255, 0.3)',
  'rgba(120, 210, 255, 0.38)',
  'rgba(180, 230, 255, 0.32)'
]

// 字符数据
const charData = computed(() => props.title.split(''))

// 清理函数
type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []
let ctx: gsap.Context | null = null
let scrollTriggerInstance: ScrollTrigger | null = null
let bubbleAnimationId: number | null = null
let isBoiling = ref(false)
let bubbleRate = 0

// 设置字符 ref
function setCharRef(el: HTMLElement | null, index: number) {
  if (el) {
    charRefs.value.set(index, el)
  }
}

// 创建气泡
function createBubble(startX: number, startY: number) {
  if (!bubbleContainerRef.value) return
  
  const bubble = document.createElement('div')
  bubble.className = 'bubble-bbb'
  
  const size = 4 + Math.random() * 12
  const colorIndex = Math.floor(Math.random() * bubbleColors.length)
  
  bubble.style.cssText = `
    position: absolute;
    left: ${startX}px;
    top: ${startY}px;
    width: ${size}px;
    height: ${size}px;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, 
      rgba(255, 255, 255, 0.8) 0%,
      ${bubbleColors[colorIndex]} 50%,
      rgba(100, 200, 255, 0.2) 100%);
    box-shadow: 
      inset -2px -2px 4px rgba(0, 0, 0, 0.1),
      0 0 10px rgba(100, 200, 255, 0.3);
    pointer-events: none;
    opacity: 0;
  `
  
  bubbleContainerRef.value.appendChild(bubble)
  bubbles.value.push(bubble)
  
  // 气泡动画
  const duration = 2 + Math.random() * 2
  const endX = startX + (Math.random() - 0.5) * 60
  const endY = startY - 200 - Math.random() * 100
  
  gsap.set(bubble, { opacity: 0, scale: 0 })
  
  gsap.to(bubble, {
    opacity: 0.7,
    scale: 1,
    duration: 0.3,
    ease: 'power2.out'
  })
  
  gsap.to(bubble, {
    x: endX - startX,
    y: endY - startY,
    duration: duration,
    ease: 'power1.in',
    onComplete: () => {
      gsap.to(bubble, {
        opacity: 0,
        scale: 0.3,
        duration: 0.3,
        onComplete: () => {
          bubble.remove()
          const idx = bubbles.value.indexOf(bubble)
          if (idx > -1) bubbles.value.splice(idx, 1)
        }
      })
    }
  })
  
  // 水平抖动
  gsap.to(bubble, {
    x: `+=${(Math.random() - 0.5) * 30}`,
    duration: 0.5 + Math.random() * 0.5,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  })
}

// 生成气泡
function spawnBubbles() {
  if (!isBoiling.value) return
  
  const chars = Array.from(charRefs.value.values())
  const parent = parentRef.value
  if (!parent || chars.length === 0) return
  
  const parentRect = parent.getBoundingClientRect()
  
  chars.forEach((char, index) => {
    const rect = char.getBoundingClientRect()
    const centerX = rect.left - parentRect.left + rect.width / 2
    const bottomY = rect.bottom - parentRect.top
    
    // 根据动画进度调整气泡生成率
    const bubbleCount = Math.floor(bubbleRate * (0.5 + Math.random() * 0.5))
    
    for (let i = 0; i < bubbleCount; i++) {
      const offsetX = (Math.random() - 0.5) * rect.width * 0.8
      const offsetY = Math.random() * 20
      createBubble(centerX + offsetX, bottomY + offsetY)
    }
  })
}

// 气泡动画循环
function bubbleLoop() {
  if (isBoiling.value) {
    spawnBubbles()
  }
  bubbleAnimationId = requestAnimationFrame(bubbleLoop)
}

// 入场动画
function playEntryAnimation() {
  const chars = Array.from(charRefs.value.values())
  
  // 初始状态 - 文字分解为气泡
  chars.forEach((char, index) => {
    gsap.set(char, {
      opacity: 0,
      scale: 0,
      filter: 'blur(20px)'
    })
  })
  
  if (subtitleRef.value) {
    gsap.set(subtitleRef.value, {
      opacity: 0,
      y: 20
    })
  }
  
  // 开始沸腾
  isBoiling.value = true
  bubbleRate = 2
  
  // 创建Timeline
  const tl = gsap.timeline()
  
  // 阶段1: 预热 - 少量气泡
  tl.to({}, {
    duration: 1,
    onUpdate: function() {
      bubbleRate = 1 + this.progress() * 2
    }
  })
  
  // 阶段2: 沸腾加剧
  tl.to({}, {
    duration: 1.5,
    onUpdate: function() {
      bubbleRate = 3 + this.progress() * 5
    }
  })
  
  // 阶段3: 临界 - 气泡最密集
  tl.to({}, {
    duration: 1,
    onComplete: () => {
      bubbleRate = 8
    }
  })
  
  // 阶段4: 凝结 - 文字显现
  chars.forEach((char, index) => {
    tl.to(char, {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      duration: 0.6,
      ease: 'back.out(1.7)'
    }, `-=${0.5 + index * 0.05}`)
  })
  
  // 阶段5: 稳定 - 减少气泡
  tl.to({}, {
    duration: 1,
    onUpdate: function() {
      bubbleRate = 8 - this.progress() * 6
    }
  })
  
  // 副标题
  tl.to(subtitleRef.value, {
    opacity: 0.8,
    y: 0,
    duration: 0.8,
    ease: 'power2.out'
  }, '-=0.5')
}

// 鼠标交互 - 搅拌
function setupMouseInteraction() {
  let isDragging = false
  
  parentRef.value?.addEventListener('mousedown', () => {
    isDragging = true
    bubbleRate = 15 // 快速生成气泡
  })
  
  parentRef.value?.addEventListener('mouseup', () => {
    isDragging = false
    bubbleRate = 3 // 恢复正常
  })
  
  parentRef.value?.addEventListener('mouseleave', () => {
    isDragging = false
    bubbleRate = 3
  })
  
  // 文字hover效果
  const chars = Array.from(charRefs.value.values())
  chars.forEach((char, index) => {
    char.addEventListener('mouseenter', () => {
      gsap.to(char, {
        scale: 1.1,
        duration: 0.3,
        ease: 'power2.out'
      })
      
      // 触发局部气泡
      const rect = char.getBoundingClientRect()
      const parent = parentRef.value
      if (parent) {
        const parentRect = parent.getBoundingClientRect()
        for (let i = 0; i < 8; i++) {
          createBubble(
            rect.left - parentRect.left + rect.width / 2 + (Math.random() - 0.5) * 30,
            rect.top - parentRect.top + rect.height / 2 + (Math.random() - 0.5) * 20
          )
        }
      }
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
  
  // 启动气泡循环
  bubbleLoop()
  
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
          
          // 液体波动
          if (liquidRef.value) {
            gsap.set(liquidRef.value, {
              scaleY: 0.95 + self.progress * 0.05,
              y: self.progress * 10
            })
          }
          
          // 气泡速率
          bubbleRate = 2 + self.progress * 6
        },
        onEnter: () => {
          isBoiling.value = true
          playEntryAnimation()
        },
        onLeaveBack: () => {
          const chars = Array.from(charRefs.value.values())
          
          gsap.set(chars, {
            opacity: 0,
            scale: 0,
            filter: 'blur(20px)'
          })
          
          if (subtitleRef.value) {
            gsap.set(subtitleRef.value, { opacity: 0, y: 20 })
          }
          
          // 清除所有气泡
          bubbles.value.forEach(b => b.remove())
          bubbles.value = []
          
          isBoiling.value = false
          bubbleRate = 0
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
  
  if (bubbleAnimationId !== null) {
    cancelAnimationFrame(bubbleAnimationId)
    bubbleAnimationId = null
  }
  
  scrollTriggerInstance?.kill()
  ScrollTrigger.getAll().forEach(st => st.kill())
  
  // 清除所有气泡
  bubbles.value.forEach(b => b.remove())
  bubbles.value = []
  
  isBoiling.value = false
  charRefs.value.clear()
})
</script>

<style scoped>
.boil-section-bbb {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(
    180deg,
    #0a1628 0%,
    #0d1f3c 30%,
    #0a1628 70%,
    #061020 100%
  );
  font-family: 'Noto Serif SC', 'SimSun', serif;
  cursor: grab;
}

.boil-section-bbb:active {
  cursor: grabbing;
}

/* 烧杯背景 */
.beaker-bg-bbb {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.beaker-liquid-bbb {
  position: absolute;
  width: 80%;
  max-width: 800px;
  height: 70%;
  background: linear-gradient(
    180deg,
    rgba(100, 180, 255, 0.08) 0%,
    rgba(60, 140, 220, 0.15) 30%,
    rgba(40, 100, 180, 0.2) 100%
  );
  border-radius: 20px 20px 100px 100px;
  transform-origin: bottom center;
  overflow: hidden;
}

.liquid-surface-bbb {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 20px;
  background: linear-gradient(
    180deg,
    rgba(150, 220, 255, 0.3) 0%,
    rgba(100, 180, 255, 0.1) 100%
  );
  animation: surface-wave-bbb 3s ease-in-out infinite;
}

.liquid-light-bbb {
  position: absolute;
  top: 20%;
  left: 10%;
  width: 30%;
  height: 60%;
  background: linear-gradient(
    135deg,
    rgba(200, 240, 255, 0.1) 0%,
    transparent 60%
  );
  filter: blur(20px);
  animation: light-shimmer-bbb 4s ease-in-out infinite;
}

@keyframes surface-wave-bbb {
  0%, 100% { transform: translateY(0) scaleX(1); }
  50% { transform: translateY(3px) scaleX(0.98); }
}

@keyframes light-shimmer-bbb {
  0%, 100% { opacity: 0.5; transform: translateX(0); }
  50% { opacity: 0.8; transform: translateX(20px); }
}

.beaker-glass-bbb {
  position: absolute;
  width: 82%;
  max-width: 820px;
  height: 72%;
  border: 3px solid rgba(200, 230, 255, 0.15);
  border-radius: 20px 20px 100px 100px;
  background: transparent;
  box-shadow: 
    inset 0 0 30px rgba(100, 180, 255, 0.05),
    0 0 60px rgba(100, 180, 255, 0.1);
}

/* 气泡容器 */
.bubble-container-bbb {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 15;
  overflow: hidden;
}

/* 文字容器 */
.text-container-bbb {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 0.15em;
  z-index: 20;
}

.boil-char-bbb {
  display: inline-block;
  font-size: clamp(3rem, 10vw, 6rem);
  font-weight: 700;
  color: var(--char-color);
  text-shadow: 
    0 0 20px var(--char-color),
    0 0 40px var(--char-color),
    0 0 60px var(--char-color),
    2px 2px 4px rgba(0, 0, 0, 0.5),
    -1px -1px 2px rgba(255, 255, 255, 0.1);
  user-select: none;
  cursor: pointer;
  transition: transform 0.2s ease;
}

/* 副标题 */
.boil-subtitle-bbb {
  position: absolute;
  bottom: 18%;
  left: 50%;
  transform: translateX(-50%);
  font-size: clamp(0.8rem, 1.5vw, 1rem);
  color: rgba(150, 200, 255, 0.7);
  letter-spacing: 0.5em;
  white-space: nowrap;
  z-index: 20;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

/* 进度条 */
.boil-progress-bbb {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, 
    #64c8ff 0%,
    #a0e0ff 50%,
    #64c8ff 100%
  );
  z-index: 100;
  transition: width 0.1s ease;
  box-shadow: 0 0 15px rgba(100, 200, 255, 0.6);
}

/* 响应式 */
@media (max-width: 768px) {
  .beaker-liquid-bbb {
    width: 90%;
    height: 60%;
  }

  .beaker-glass-bbb {
    width: 92%;
    height: 62%;
  }

  .boil-char-bbb {
    font-size: clamp(2rem, 12vw, 4rem);
  }

  .boil-subtitle-bbb {
    letter-spacing: 0.2em;
    font-size: 0.7rem;
    bottom: 12%;
  }
}
</style>
