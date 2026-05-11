<template>
  <div class="sweep-section-109" ref="sectionRef">
    <!-- 背景装饰 -->
    <div class="sweep-bg-decor-109"></div>
    
    <!-- 内容层 -->
    <div class="sweep-content-109" ref="contentRef">
      <!-- 副标题 -->
      <p v-if="subtitle" class="sweep-subtitle-109">
        {{ subtitle }}
      </p>

      <!-- 主标题 -->
      <h1 class="sweep-title-109" ref="titleRef">
        {{ title }}
      </h1>

      <!-- 分隔线 -->
      <div class="sweep-divider-109" ref="dividerRef"></div>

      <!-- 段落 -->
      <div class="sweep-paragraphs-109">
        <p
          v-for="(para, index) in paragraphs"
          :key="index"
          class="sweep-paragraph-109"
          :ref="el => setParaRef(el, index)"
        >
          {{ para }}
        </p>
      </div>
    </div>

    <!-- 进度条 -->
    <div class="sweep-progress-109" :style="{ width: progress + '%' }"></div>

    <!-- 控制按钮 -->
    <div class="sweep-controls-109">
      <button class="sweep-btn-109" @click="handleReplay" title="重播">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
        </svg>
      </button>
    </div>

    <!-- 滚动提示 -->
    <div class="sweep-scroll-hint-109" :class="{ hidden: scrollHintHidden }">
      <span>向下滚动</span>
      <div class="sweep-scroll-arrow">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
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
  fontSize?: string
  fontWeight?: number
  autoPlay?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'ELEGANT',
  subtitle: '',
  paragraphs: () => [],
  fontSize: 'clamp(2.5rem, 8vw, 5rem)',
  fontWeight: 600,
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
const contentRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const dividerRef = ref<HTMLElement | null>(null)
const paraRefs = ref<HTMLElement[]>([])

// 状态
const progress = ref(0)
const scrollHintHidden = ref(false)

// 清理函数
const cleanupFns: (() => void)[] = []
let scrollTriggerInstance: ScrollTrigger | null = null

// 设置段落 ref
const setParaRef = (el: HTMLElement | null, index: number) => {
  if (el) {
    paraRefs.value[index] = el
  }
}

// 重播动画
const handleReplay = () => {
  resetAndPlay()
}

// 重置并播放
const resetAndPlay = () => {
  // 重置标题
  if (titleRef.value) {
    gsap.set(titleRef.value, {
      opacity: 0,
      y: 60,
      skewX: -5,
      filter: 'blur(10px)'
    })
  }
  
  // 重置分隔线
  if (dividerRef.value) {
    gsap.set(dividerRef.value, {
      scaleX: 0,
      opacity: 0
    })
  }
  
  // 重置段落
  paraRefs.value.forEach((el, index) => {
    if (el) {
      gsap.set(el, {
        opacity: 0,
        y: 40,
        filter: 'blur(8px)'
      })
    }
  })
  
  // 播放动画
  setTimeout(() => playAnimation(), 50)
}

// 播放动画
const playAnimation = () => {
  emit('animation-start')
  
  const tl = gsap.timeline({
    onComplete: () => emit('animation-complete')
  })
  
  // 标题动画
  if (titleRef.value) {
    tl.to(titleRef.value, {
      opacity: 1,
      y: 0,
      skewX: 0,
      filter: 'blur(0px)',
      duration: 1.2,
      ease: 'power4.out'
    })
  }
  
  // 分隔线动画
  if (dividerRef.value) {
    tl.to(dividerRef.value, {
      scaleX: 1,
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.6')
  }
  
  // 段落动画
  paraRefs.value.forEach((el, index) => {
    if (el) {
      tl.to(el, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.8,
        ease: 'power3.out'
      }, `-=0.4`)
    }
  })
  
  cleanupFns.push(() => tl.kill())
}

onMounted(() => {
  const rootEl = sectionRef.value
  if (!rootEl) return

  // 等待 DOM 渲染
  nextTick(() => {
    setTimeout(() => {
      // 检查元素
      if (!titleRef.value) {
        console.warn('CardTextSweep: title not ready, retrying...')
        setTimeout(() => onMounted(), 100)
        return
      }
      
      // 初始状态
      gsap.set(titleRef.value, {
        opacity: 0,
        y: 60,
        skewX: -5,
        filter: 'blur(10px)'
      })
      
      if (dividerRef.value) {
        gsap.set(dividerRef.value, {
          scaleX: 0,
          opacity: 0,
          transformOrigin: 'left center'
        })
      }
      
      paraRefs.value.forEach(el => {
        if (el) {
          gsap.set(el, {
            opacity: 0,
            y: 40,
            filter: 'blur(8px)'
          })
        }
      })
      
      // ScrollTrigger
      scrollTriggerInstance = ScrollTrigger.create({
        trigger: rootEl,
        start: 'top 80%',
        end: 'top 20%',
        onUpdate: (self) => {
          progress.value = self.progress * 100
          emit('scroll-progress', self.progress)
          
          if (self.progress > 0.05) {
            scrollHintHidden.value = true
          }
        },
        onEnter: () => {
          if (props.autoPlay) {
            playAnimation()
          }
        },
        onLeaveBack: () => {
          // 重置
          if (titleRef.value) {
            gsap.set(titleRef.value, {
              opacity: 0,
              y: 60,
              skewX: -5,
              filter: 'blur(10px)'
            })
          }
          
          if (dividerRef.value) {
            gsap.set(dividerRef.value, {
              scaleX: 0,
              opacity: 0
            })
          }
          
          paraRefs.value.forEach(el => {
            if (el) {
              gsap.set(el, {
                opacity: 0,
                y: 40,
                filter: 'blur(8px)'
              })
            }
          })
        }
      })
      
      cleanupFns.push(() => scrollTriggerInstance?.kill())
    }, 200)
  })
  
  // 窗口大小变化
  const handleResize = () => {
    ScrollTrigger.refresh()
  }
  window.addEventListener('resize', handleResize)
  cleanupFns.push(() => window.removeEventListener('resize', handleResize))
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0
  
  scrollTriggerInstance?.kill()
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style scoped>
.sweep-section-109 {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, #fafbff 0%, #f0f2f8 50%, #fafbff 100%);
}

/* 背景装饰 */
.sweep-bg-decor-109 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.05) 0%, transparent 50%);
  pointer-events: none;
}

/* 内容层 */
.sweep-content-109 {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 60px 20px;
  max-width: 900px;
  margin: 0 auto;
}

/* 副标题 */
.sweep-subtitle-109 {
  font-size: clamp(0.875rem, 2vw, 1.125rem);
  color: rgba(99, 102, 241, 0.7);
  letter-spacing: 0.3em;
  text-transform: uppercase;
  margin-bottom: 16px;
  font-weight: 400;
  opacity: 0;
}

/* 主标题 */
.sweep-title-109 {
  font-size: v-bind(fontSize);
  font-weight: v-bind(fontWeight);
  color: #1a1a2e;
  text-align: center;
  margin: 0;
  line-height: 1.2;
  opacity: 0;
}

/* 分隔线 */
.sweep-divider-109 {
  width: 120px;
  height: 3px;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  border-radius: 2px;
  margin: 30px 0;
  opacity: 0;
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.4);
}

/* 段落容器 */
.sweep-paragraphs-109 {
  max-width: 700px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 段落 */
.sweep-paragraph-109 {
  font-size: clamp(1rem, 2vw, 1.125rem);
  line-height: 1.9;
  color: #4a4a5a;
  text-align: center;
  margin: 0;
  padding: 24px 32px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  border: 1px solid rgba(99, 102, 241, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
  opacity: 0;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.sweep-paragraph-109:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(99, 102, 241, 0.15);
}

/* 进度条 */
.sweep-progress-109 {
  position: fixed;
  top: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa);
  z-index: 1000;
  transition: width 0.1s linear;
  box-shadow: 0 0 15px rgba(99, 102, 241, 0.5);
}

/* 控制按钮 */
.sweep-controls-109 {
  position: fixed;
  bottom: 30px;
  right: 30px;
  display: flex;
  gap: 12px;
  z-index: 100;
}

.sweep-btn-109 {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(99, 102, 241, 0.2);
  color: #6366f1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.sweep-btn-109:hover {
  background: #6366f1;
  color: white;
  transform: scale(1.1);
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.35);
}

.sweep-btn-109:active {
  transform: scale(0.95);
}

/* 滚动提示 */
.sweep-scroll-hint-109 {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: #6366f1;
  font-size: 14px;
  z-index: 100;
  transition: opacity 0.5s ease;
}

.sweep-scroll-hint-109.hidden {
  opacity: 0;
  pointer-events: none;
}

.sweep-scroll-arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.sweep-scroll-arrow span {
  width: 20px;
  height: 20px;
  border-right: 2px solid #6366f1;
  border-bottom: 2px solid #6366f1;
  transform: rotate(45deg);
  animation: scrollArrow 1.5s ease-in-out infinite;
}

.sweep-scroll-arrow span:nth-child(2) {
  animation-delay: 0.15s;
  opacity: 0.7;
}

.sweep-scroll-arrow span:nth-child(3) {
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
  .sweep-btn-109 {
    width: 44px;
    height: 44px;
  }

  .sweep-controls-109 {
    bottom: 20px;
    right: 20px;
  }

  .sweep-paragraph-109 {
    padding: 20px 24px;
  }

  .sweep-paragraphs-109 {
    margin-top: 16px;
    gap: 16px;
  }
}
</style>
