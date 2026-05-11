<template>
  <div 
    ref="parentRef" 
    class="spikes-section-247"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <!-- 金属背景 -->
    <div class="metal-bg-247">
      <div class="metal-sheen-247"></div>
    </div>

    <!-- 磁流体容器 -->
    <div class="fluid-container-247" ref="fluidContainerRef">
      <!-- 尖刺网格 -->
      <div class="spikes-grid-247" ref="spikesGridRef">
        <div
          v-for="spike in spikesData"
          :key="spike.id"
          :ref="el => setSpikeRef(el as HTMLElement, spike.id)"
          class="spike-247"
          :data-row="spike.row"
          :data-col="spike.col"
          :data-intensity="spike.intensity"
          :style="{
            '--spike-height': spike.height + 'px',
            '--spike-delay': spike.delay + 'ms',
            '--base-color': spike.color
          }"
        >
          <div class="spike-inner-247"></div>
        </div>
      </div>
      
      <!-- 文字层 -->
      <div class="text-layer-247" ref="textLayerRef">
        <h1 class="spikes-title-247" ref="titleRef">{{ title }}</h1>
        <p class="spikes-subtitle-247" ref="subtitleRef">{{ subtitle }}</p>
      </div>
    </div>

    <!-- 磁场装饰 -->
    <div class="magnetic-field-247"></div>
    
    <!-- 进度条 -->
    <div class="spikes-progress-247" :style="{ width: progress + '%' }"></div>
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
  spikeCount?: number
  maxSpikeHeight?: number
}

const props = withDefaults(defineProps<Props>(), {
  title: '磁流体',
  subtitle: '尖刺文字 · 磁场显形',
  spikeCount: 800,
  maxSpikeHeight: 120
})

// Refs
const parentRef = ref<HTMLElement | null>(null)
const fluidContainerRef = ref<HTMLElement | null>(null)
const spikesGridRef = ref<HTMLElement | null>(null)
const textLayerRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)

const spikeRefs = ref<Map<number, HTMLElement>>(new Map())

// 状态
const progress = ref(0)

// 尖刺数据
interface SpikeData {
  id: number
  row: number
  col: number
  x: number
  y: number
  height: number
  delay: number
  intensity: number
  color: string
}

const spikesData = ref<SpikeData[]>([])

// 鼠标状态
let mouseX = 0
let mouseY = 0
let isNear = false

// 清理函数
type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []
let ctx: gsap.Context | null = null
let scrollTriggerInstance: ScrollTrigger | null = null
let spikeAnimations: gsap.core.Tween[] = []
let trembleIntervals: number[] = []

// 颜色配置
const spikeColors = [
  '#00ffff', // 青色
  '#00ff88', // 绿色
  '#88ff00', // 黄绿
  '#ffffff', // 白色
  '#00aaff', // 蓝色
]

// 设置尖刺 ref
function setSpikeRef(el: HTMLElement | null, id: number) {
  if (el) {
    spikeRefs.value.set(id, el)
  }
}

// 初始化尖刺
function initSpikes() {
  if (!fluidContainerRef.value) return
  
  const container = fluidContainerRef.value
  const rect = container.getBoundingClientRect()
  
  // 计算网格
  const cols = Math.ceil(Math.sqrt(props.spikeCount * (rect.width / rect.height)))
  const rows = Math.ceil(props.spikeCount / cols)
  
  const cellWidth = rect.width / cols
  const cellHeight = rect.height / rows
  
  spikesData.value = []
  
  for (let i = 0; i < props.spikeCount; i++) {
    const row = Math.floor(i / cols)
    const col = i % cols
    
    const x = col * cellWidth + cellWidth / 2
    const y = row * cellHeight + cellHeight / 2
    
    // 随机属性
    const height = Math.random() * props.maxSpikeHeight * 0.3
    const delay = Math.random() * 2000
    const intensity = Math.random()
    const color = spikeColors[Math.floor(Math.random() * spikeColors.length)]
    
    spikesData.value.push({
      id: i,
      row,
      col,
      x,
      y,
      height,
      delay,
      intensity,
      color
    })
  }
}

// 计算文字区域的遮罩
function isInsideText(x: number, y: number, width: number, height: number): boolean {
  if (!textLayerRef.value || !fluidContainerRef.value) return false
  
  const textEl = textLayerRef.value
  const textRect = textEl.getBoundingClientRect()
  const containerRect = fluidContainerRef.value.getBoundingClientRect()
  
  // 转换为相对坐标
  const relX = x + width / 2
  const relY = y + height / 2
  
  const textLeft = textRect.left - containerRect.left
  const textRight = textRect.right - containerRect.left
  const textTop = textRect.top - containerRect.top
  const textBottom = textRect.bottom - containerRect.top
  
  // 扩展区域以包含尖刺
  const padding = props.maxSpikeHeight
  return (
    relX > textLeft - padding &&
    relX < textRight + padding &&
    relY > textTop - padding &&
    relY < textBottom + padding
  )
}

// 鼠标移动
function handleMouseMove(e: MouseEvent) {
  if (!parentRef.value) return
  
  const rect = parentRef.value.getBoundingClientRect()
  mouseX = e.clientX - rect.left
  mouseY = e.clientY - rect.top
  
  // 计算鼠标在容器中的相对位置
  const containerRect = fluidContainerRef.value?.getBoundingClientRect()
  if (!containerRect) return
  
  const relMouseX = mouseX - (containerRect.left - rect.left)
  const relMouseY = mouseY - (containerRect.top - rect.top)
  
  // 影响周围的尖刺
  spikeRefs.value.forEach((spike, id) => {
    const spikeData = spikesData.value.find(s => s.id === id)
    if (!spikeData) return
    
    const dx = relMouseX - spikeData.x
    const dy = relMouseY - spikeData.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    const maxDist = 200
    
    if (dist < maxDist) {
      isNear = true
      const force = (maxDist - dist) / maxDist
      const angle = Math.atan2(dy, dx)
      
      // 尖刺向鼠标偏转
      const rotateZ = Math.cos(angle) * force * 30
      const extraHeight = force * 30
      
      gsap.to(spike, {
        rotateZ: rotateZ,
        scaleY: 1 + extraHeight / props.maxSpikeHeight,
        duration: 0.3,
        ease: 'power2.out'
      })
    } else {
      // 恢复原状
      gsap.to(spike, {
        rotateZ: 0,
        scaleY: 1,
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)'
      })
    }
  })
}

// 鼠标离开
function handleMouseLeave() {
  isNear = false
  
  spikeRefs.value.forEach(spike => {
    gsap.to(spike, {
      rotateZ: 0,
      scaleY: 1,
      duration: 0.8,
      ease: 'elastic.out(1, 0.5)'
    })
  })
}

// 入场动画
function playEntryAnimation() {
  const spikes = Array.from(spikeRefs.value.values())
  
  // 初始状态 - 尖刺平躺
  gsap.set(spikes, {
    scaleY: 0.05,
    opacity: 0.3,
    filter: 'brightness(1.5)'
  })
  
  // 文字初始状态
  if (titleRef.value) {
    gsap.set(titleRef.value, {
      opacity: 0,
      filter: 'blur(20px)'
    })
  }
  
  if (subtitleRef.value) {
    gsap.set(subtitleRef.value, {
      opacity: 0,
      y: 20,
      filter: 'blur(10px)'
    })
  }
  
  // 创建时间线
  const tl = gsap.timeline()
  
  // 第一阶段：尖刺逐渐升起
  spikes.forEach((spike, index) => {
    const spikeData = spikesData.value.find(s => s.id === index)
    if (!spikeData) return
    
    tl.to(spike, {
      scaleY: spikeData.height / props.maxSpikeHeight,
      opacity: 0.4 + spikeData.intensity * 0.6,
      duration: 1.5,
      ease: 'power2.out'
    }, spikeData.delay / 1000 * 0.5)
  })
  
  // 第二阶段：文字显现
  if (titleRef.value) {
    tl.to(titleRef.value, {
      opacity: 1,
      filter: 'blur(0px)',
      duration: 1,
      ease: 'power2.out'
    }, '-=0.5')
  }
  
  // 第三阶段：副标题
  if (subtitleRef.value) {
    tl.to(subtitleRef.value, {
      opacity: 0.6,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.3')
  }
  
  // 保存清理函数
  cleanupFns.push(() => tl.kill())
}

// 尖刺颤动效果
function startTrembleEffect() {
  spikeRefs.value.forEach((spike, id) => {
    const spikeData = spikesData.value.find(s => s.id === id)
    if (!spikeData) return
    
    // 异步开始颤动
    const intervalId = window.setInterval(() => {
      if (isNear) return
      
      const trembleAmount = 2 + Math.random() * 3
      const duration = 0.1 + Math.random() * 0.2
      
      gsap.to(spike, {
        y: trembleAmount,
        duration: duration,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: 1
      })
    }, 1000 + Math.random() * 2000)
    
    trembleIntervals.push(intervalId)
  })
}

// 初始化
onMounted(() => {
  if (!parentRef.value) return
  
  // 初始化尖刺数据
  setTimeout(() => {
    initSpikes()
  }, 50)
  
  setTimeout(() => {
    ctx = gsap.context(() => {
      // 入场动画
      playEntryAnimation()
      
      // 启动颤动效果
      setTimeout(() => {
        startTrembleEffect()
      }, 2000)
      
      // ScrollTrigger
      scrollTriggerInstance = ScrollTrigger.create({
        trigger: parentRef.value,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 1.5,
        onUpdate: (self) => {
          progress.value = self.progress * 100
          
          // 根据进度调整尖刺高度
          const spikes = Array.from(spikeRefs.value.values())
          spikes.forEach((spike, index) => {
            const spikeData = spikesData.value.find(s => s.id === index)
            if (!spikeData) return
            
            const targetScale = self.progress * (spikeData.height / props.maxSpikeHeight)
            gsap.to(spike, {
              scaleY: Math.max(0.05, targetScale),
              duration: 0.5
            })
          })
        },
        onEnter: () => {
          playEntryAnimation()
        },
        onLeaveBack: () => {
          const spikes = Array.from(spikeRefs.value.values())
          gsap.set(spikes, {
            scaleY: 0.05,
            opacity: 0.3
          })
          
          if (titleRef.value) {
            gsap.set(titleRef.value, { opacity: 0, filter: 'blur(20px)' })
          }
          
          if (subtitleRef.value) {
            gsap.set(subtitleRef.value, { opacity: 0, y: 20, filter: 'blur(10px)' })
          }
        }
      })
      
      cleanupFns.push(() => scrollTriggerInstance?.kill())
    }, parentRef.value)
  }, 200)
})

// 清理
onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0
  
  ctx?.revert()
  ctx = null
  
  spikeAnimations.forEach(t => t.kill())
  spikeAnimations = []
  
  trembleIntervals.forEach(id => window.clearInterval(id))
  trembleIntervals = []
  
  scrollTriggerInstance?.kill()
  ScrollTrigger.getAll().forEach(st => st.kill())
  
  spikeRefs.value.clear()
  spikesData.value = []
})
</script>

<style scoped>
.spikes-section-247 {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(
    180deg,
    #0a0a0a 0%,
    #151515 30%,
    #1a1a1a 50%,
    #151515 70%,
    #0a0a0a 100%
  );
  font-family: 'Orbitron', 'Rajdhani', 'Noto Sans SC', sans-serif;
}

/* 金属背景 */
.metal-bg-247 {
  position: absolute;
  inset: 0;
  background: 
    linear-gradient(135deg, rgba(40, 40, 40, 0.8) 0%, rgba(20, 20, 20, 0.9) 100%),
    repeating-linear-gradient(
      90deg,
      transparent 0px,
      transparent 2px,
      rgba(255, 255, 255, 0.02) 2px,
      rgba(255, 255, 255, 0.02) 4px
    );
}

.metal-sheen-247 {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at 50% 0%,
    rgba(100, 100, 100, 0.3) 0%,
    transparent 50%
  );
  animation: metal-shimmer-247 8s ease-in-out infinite;
}

@keyframes metal-shimmer-247 {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
}

/* 磁流体容器 */
.fluid-container-247 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80vw;
  max-width: 1000px;
  height: 50vh;
  max-height: 500px;
}

/* 尖刺网格 */
.spikes-grid-247 {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: repeat(40, 1fr);
  grid-template-rows: repeat(20, 1fr);
  gap: 0;
}

.spike-247 {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  transform-origin: bottom center;
  will-change: transform;
}

.spike-inner-247 {
  width: 3px;
  height: 100%;
  background: linear-gradient(
    to top,
    var(--base-color, #00ffff) 0%,
    rgba(255, 255, 255, 0.8) 50%,
    transparent 100%
  );
  border-radius: 1px 1px 0 0;
  box-shadow: 
    0 0 5px var(--base-color, #00ffff),
    0 0 10px var(--base-color, #00ffff),
    0 0 20px rgba(0, 255, 255, 0.3);
}

/* 文字层 */
.text-layer-247 {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10;
  pointer-events: none;
}

.spikes-title-247 {
  font-size: clamp(3rem, 12vw, 7rem);
  font-weight: 900;
  color: #ffffff;
  text-shadow: 
    0 0 10px rgba(0, 255, 255, 0.8),
    0 0 20px rgba(0, 255, 255, 0.6),
    0 0 40px rgba(0, 255, 255, 0.4),
    0 0 80px rgba(0, 255, 255, 0.2);
  letter-spacing: 0.1em;
  margin: 0;
  background: linear-gradient(
    180deg,
    #ffffff 0%,
    #88ffff 50%,
    #00ffff 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.spikes-subtitle-247 {
  font-size: clamp(0.8rem, 2vw, 1.2rem);
  color: rgba(0, 255, 255, 0.6);
  letter-spacing: 0.5em;
  margin-top: 1rem;
  white-space: nowrap;
}

/* 磁场装饰 */
.magnetic-field-247 {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(
      circle at 50% 50%,
      rgba(0, 255, 255, 0.05) 0%,
      transparent 50%
    );
  pointer-events: none;
  animation: field-pulse-247 3s ease-in-out infinite;
}

@keyframes field-pulse-247 {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

/* 进度条 */
.spikes-progress-247 {
  position: fixed;
  top: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, 
    rgba(0, 255, 255, 0.5), 
    rgba(0, 255, 136, 0.8),
    rgba(0, 255, 255, 0.6));
  z-index: 100;
  transition: width 0.1s ease;
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
}

/* 响应式 */
@media (max-width: 768px) {
  .fluid-container-247 {
    width: 95vw;
    height: 40vh;
  }

  .spikes-grid-247 {
    grid-template-columns: repeat(30, 1fr);
    grid-template-rows: repeat(27, 1fr);
  }

  .spikes-subtitle-247 {
    letter-spacing: 0.2em;
    font-size: 0.7rem;
  }
}
</style>
