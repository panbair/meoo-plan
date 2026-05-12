<template>
  <div ref="parentRef" class="holo-section-241">
    <!-- 全息背景 -->
    <div class="holo-bg-241">
      <div class="scan-line-241"></div>
      <div class="grid-floor-241"></div>
      <div class="hologram-glow-241"></div>
    </div>

    <!-- 全息字符 -->
    <div class="holo-char-container-241" ref="charContainerRef">
      <span
        v-for="(item, index) in charData"
        :key="item.key"
        :ref="el => setCharRef(el as HTMLElement, index)"
        class="holo-char-241"
        :style="{
          '--hue': (item.index * 30) + 'deg',
          '--delay': (item.index * 0.1) + 's'
        }"
      >{{ item.char }}</span>
    </div>

    <!-- 副标题 -->
    <p class="holo-subtitle-241" ref="subtitleRef">
      <span v-for="(char, i) in subtitle.split('')" :key="i" class="holo-sub-char-241">{{ char }}</span>
    </p>

    <!-- 装饰线条 -->
    <div class="holo-decor-241">
      <svg viewBox="0 0 1200 60" preserveAspectRatio="none">
        <line x1="0" y1="30" x2="1200" y2="30" stroke="rgba(100, 200, 255, 0.2)" stroke-width="1" />
        <circle v-for="i in 24" :key="i" :cx="i * 50" cy="30" r="2" fill="rgba(100, 200, 255, 0.4)" />
      </svg>
    </div>

    <!-- 进度条 -->
    <div class="holo-progress-241" :style="{ width: progress + '%' }"></div>
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
  intensity?: number
}

const props = withDefaults(defineProps<Props>(), {
  title: '全息投影',
  subtitle: 'HOLOGRAPHIC · PROJECTION',
  intensity: 1
})

// Refs
const parentRef = ref<HTMLElement | null>(null)
const charContainerRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)

const charRefs = ref<Map<number, HTMLElement>>(new Map())

// 状态
const progress = ref(0)

// 字符数据
const charData = computed(() => {
  return props.title.split('').map((char, index) => ({
    char,
    index,
    key: `holo-char-${index}`
  }))
})

// 清理函数
type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []
let ctx: gsap.Context | null = null
let scrollTriggerInstance: ScrollTrigger | null = null
let glitchInterval: number | null = null

// 设置字符 ref
function setCharRef(el: HTMLElement | null, index: number) {
  if (el) {
    charRefs.value.set(index, el)
  }
}

// 故障效果
function triggerGlitch() {
  const chars = Array.from(charRefs.value.values())
  
  chars.forEach(char => {
    const offsetX = (Math.random() - 0.5) * 10 * props.intensity
    const offsetY = (Math.random() - 0.5) * 5 * props.intensity
    
    gsap.to(char, {
      x: offsetX,
      y: offsetY,
      skewX: (Math.random() - 0.5) * 10,
      duration: 0.05,
      ease: 'none',
      onComplete: () => {
        gsap.to(char, {
          x: 0,
          y: 0,
          skewX: 0,
          duration: 0.1
        })
      }
    })
  })
}

// 呼吸效果
function startBreathingEffect() {
  const chars = Array.from(charRefs.value.values())
  
  chars.forEach((char, index) => {
    gsap.to(char, {
      opacity: () => 0.7 + Math.sin(Date.now() * 0.002 + index) * 0.3,
      scale: () => 0.95 + Math.sin(Date.now() * 0.003 + index) * 0.05,
      duration: 2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    })
  })
}

// 入场动画
function playEntryAnimation() {
  const chars = Array.from(charRefs.value.values())
  
  // 初始状态 - 扫描构建
  chars.forEach((char, index) => {
    gsap.set(char, {
      opacity: 0,
      y: -50,
      filter: 'blur(20px) brightness(3)',
      clipPath: 'inset(100% 0 0 0)'
    })
  })
  
  if (subtitleRef.value) {
    const subChars = subtitleRef.value.querySelectorAll('.holo-sub-char-241')
    gsap.set(subChars, {
      opacity: 0,
      filter: 'blur(10px)'
    })
  }
  
  // 逐字扫描入场
  gsap.to(chars, {
    opacity: 1,
    y: 0,
    filter: 'blur(0px) brightness(1)',
    clipPath: 'inset(0% 0 0 0)',
    duration: 1,
    stagger: 0.1,
    ease: 'power2.out'
  })
  
  // 副标题动画
  if (subtitleRef.value) {
    const subChars = subtitleRef.value.querySelectorAll('.holo-sub-char-241')
    gsap.to(subChars, {
      opacity: 0.6,
      filter: 'blur(0px)',
      duration: 0.8,
      stagger: 0.03,
      delay: chars.length * 0.1 + 0.3,
      ease: 'power2.out'
    })
  }
}

// 初始化
onMounted(() => {
  if (!parentRef.value) return
  
  // 随机故障
  glitchInterval = window.setInterval(() => {
    if (Math.random() > 0.85) {
      triggerGlitch()
    }
  }, 2000)
  
  setTimeout(() => {
    ctx = gsap.context(() => {
      // 入场动画
      playEntryAnimation()
      
      // 呼吸效果
      setTimeout(startBreathingEffect, 1500)
      
      // ScrollTrigger
      scrollTriggerInstance = ScrollTrigger.create({
        trigger: parentRef.value,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 1.5,
        onUpdate: (self) => {
          progress.value = self.progress * 100
          
          // 全息强度随滚动变化
          const intensity = 0.5 + self.progress * 0.5
          parentRef.value?.style.setProperty('--holo-intensity', String(intensity))
        },
        onEnter: () => {
          playEntryAnimation()
          setTimeout(startBreathingEffect, 100)
        },
        onLeaveBack: () => {
          const chars = Array.from(charRefs.value.values())
          chars.forEach((char, index) => {
            gsap.set(char, {
              opacity: 0,
              y: -50,
              filter: 'blur(20px) brightness(3)',
              clipPath: 'inset(100% 0 0 0)'
            })
          })
          
          if (subtitleRef.value) {
            const subChars = subtitleRef.value.querySelectorAll('.holo-sub-char-241')
            gsap.set(subChars, { opacity: 0, filter: 'blur(10px)' })
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
  
  scrollTriggerInstance?.kill()
  ScrollTrigger.getAll().forEach(st => st.kill())
  
  if (glitchInterval !== null) {
    clearInterval(glitchInterval)
    glitchInterval = null
  }
  
  charRefs.value.clear()
})
</script>

<style scoped>
.holo-section-241 {
  --holo-intensity: 1;
  
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: radial-gradient(
    ellipse at 50% 30%,
    #0a1628 0%,
    #051020 50%,
    #020810 100%
  );
  font-family: 'Orbitron', 'Rajdhani', sans-serif;
}

/* 全息背景 */
.holo-bg-241 {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.scan-line-241 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(100, 200, 255, 0.4) 50%,
    transparent 100%
  );
  animation: scan-move-241 3s linear infinite;
  box-shadow: 
    0 0 20px rgba(100, 200, 255, 0.5),
    0 0 40px rgba(100, 200, 255, 0.3);
}

@keyframes scan-move-241 {
  0% { top: -4px; }
  100% { top: 100%; }
}

.grid-floor-241 {
  position: absolute;
  bottom: 0;
  left: -50%;
  right: -50%;
  height: 50%;
  background: 
    linear-gradient(90deg, rgba(100, 200, 255, 0.05) 1px, transparent 1px),
    linear-gradient(0deg, rgba(100, 200, 255, 0.05) 1px, transparent 1px);
  background-size: 60px 30px;
  transform: perspective(500px) rotateX(60deg);
  transform-origin: center bottom;
  opacity: calc(0.3 * var(--holo-intensity));
}

.hologram-glow-241 {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80%;
  height: 80%;
  transform: translate(-50%, -50%);
  background: radial-gradient(
    ellipse at center,
    rgba(100, 200, 255, 0.1) 0%,
    transparent 70%
  );
  animation: glow-pulse-241 4s ease-in-out infinite;
}

@keyframes glow-pulse-241 {
  0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.1); }
}

/* 字符容器 */
.holo-char-container-241 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 0.15em;
  z-index: 10;
}

.holo-char-241 {
  display: inline-block;
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: 700;
  color: rgba(100, 200, 255, 0.9);
  text-shadow: 
    0 0 10px rgba(100, 200, 255, 0.8),
    0 0 20px rgba(100, 200, 255, 0.5),
    0 0 40px rgba(100, 200, 255, 0.3),
    2px 0 0 rgba(255, 100, 150, 0.3),
    -2px 0 0 rgba(100, 255, 200, 0.3);
  user-select: none;
  will-change: transform, opacity, filter;
  position: relative;
}

.holo-char-241::before {
  content: attr(class);
  position: absolute;
  inset: 0;
  color: rgba(100, 255, 200, 0.5);
  filter: blur(2px);
  animation: char-glitch-241 0.1s infinite;
  opacity: 0;
}

@keyframes char-glitch-241 {
  0%, 100% { opacity: 0; transform: translate(0, 0); }
  50% { opacity: 0.3; transform: translate(2px, -2px); }
}

/* 副标题 */
.holo-subtitle-241 {
  position: absolute;
  top: calc(50% + 100px);
  left: 50%;
  transform: translateX(-50%);
  font-size: clamp(0.75rem, 1.5vw, 1rem);
  color: rgba(100, 200, 255, 0.6);
  letter-spacing: 0.4em;
  white-space: nowrap;
  z-index: 10;
  display: flex;
}

.holo-sub-char-241 {
  display: inline-block;
}

/* 装饰 */
.holo-decor-241 {
  position: absolute;
  bottom: 25%;
  left: 0;
  right: 0;
  height: 60px;
  z-index: 5;
  opacity: 0.6;

  svg {
    width: 100%;
    height: 100%;
  }
}

/* 进度条 */
.holo-progress-241 {
  position: fixed;
  top: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, 
    rgba(100, 200, 255, 0.5), 
    rgba(150, 255, 220, 0.8),
    rgba(100, 200, 255, 0.6));
  z-index: 100;
  transition: width 0.1s ease;
  box-shadow: 0 0 15px rgba(100, 200, 255, 0.5);
}

/* 响应式 */
@media (max-width: 768px) {
  .holo-char-container-241 {
    flex-wrap: wrap;
    justify-content: center;
    max-width: 90vw;
  }

  .holo-char-241 {
    font-size: clamp(2rem, 10vw, 3.5rem);
  }

  .holo-subtitle-241 {
    letter-spacing: 0.2em;
    font-size: 0.65rem;
  }

  .grid-floor-241 {
    display: none;
  }
}
</style>
