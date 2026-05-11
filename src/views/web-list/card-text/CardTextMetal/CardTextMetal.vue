<template>
  <div 
    ref="parentRef" 
    class="metal-section-249"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <!-- 深灰隔热台面背景 -->
    <div class="workbench-249">
      <div class="bench-surface-249"></div>
      <div class="bench-grid-249"></div>
    </div>

    <!-- 热浪波纹容器 -->
    <div class="heat-waves-249" ref="heatWavesRef">
      <svg 
        v-for="i in 5" 
        :key="'wave-' + i"
        :ref="el => setWaveRef(el as SVGSVGElement, i)"
        class="heat-ring-249"
        :viewBox="`0 0 400 400`"
      >
        <circle cx="200" cy="200" r="100" fill="none" />
      </svg>
    </div>

    <!-- 金属丝 SVG -->
    <svg 
      ref="metalCanvasRef" 
      class="metal-svg-249"
      :viewBox="`0 0 ${svgWidth} ${svgHeight}`"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <!-- 金属渐变 -->
        <linearGradient id="metalGradient-249" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" :stop-color="currentColors[0]" />
          <stop offset="50%" :stop-color="currentColors[1]" />
          <stop offset="100%" :stop-color="currentColors[2]" />
        </linearGradient>
        
        <!-- 发光效果 -->
        <filter id="metalGlow-249">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        
        <!-- 热辐射滤镜 -->
        <filter id="heatBlur-249">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>
      
      <!-- 金属丝群 -->
      <g class="wires-group-249" ref="wiresGroupRef">
        <path
          v-for="(wire, index) in wireData"
          :key="'wire-' + index"
          :ref="el => setWireRef(el as SVGPathElement, index)"
          :d="wire.currentPath"
          class="metal-wire-249"
          :style="{
            '--wire-color': currentColors[1],
            '--wire-index': index
          }"
        />
      </g>
      
      <!-- 文字路径（用于参考） -->
      <text
        ref="svgTextRef"
        :x="svgWidth / 2"
        :y="svgHeight / 2"
        text-anchor="middle"
        dominant-baseline="middle"
        class="metal-text-ref-249"
      >{{ title }}</text>
    </svg>

    <!-- 文字覆盖 -->
    <div class="text-overlay-249" ref="textOverlayRef">
      <h1 class="metal-title-249" ref="titleRef">{{ title }}</h1>
      <p class="metal-subtitle-249" ref="subtitleRef">{{ subtitle }}</p>
    </div>

    <!-- 温度指示器 -->
    <div class="temp-indicator-249" ref="tempIndicatorRef">
      <div class="temp-label-249">温度</div>
      <div class="temp-bar-249">
        <div class="temp-fill-249" :style="{ width: temperature + '%' }"></div>
      </div>
    </div>

    <!-- 进度条 -->
    <div class="metal-progress-249" :style="{ width: progress + '%' }"></div>
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
}

const props = withDefaults(defineProps<Props>(), {
  title: '记忆合金',
  subtitle: '热激活 · 形状记忆'
})

// Refs
const parentRef = ref<HTMLElement | null>(null)
const metalCanvasRef = ref<SVGSVGElement | null>(null)
const wiresGroupRef = ref<SVGGElement | null>(null)
const textOverlayRef = ref<HTMLElement | null>(null)
const svgTextRef = ref<SVGTextElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const heatWavesRef = ref<HTMLElement | null>(null)
const tempIndicatorRef = ref<HTMLElement | null>(null)

const wireRefs = ref<Map<number, SVGPathElement>>(new Map())
const waveRefs = ref<Map<number, SVGSVGElement>>(new Map())

// 状态
const progress = ref(0)
const temperature = ref(0)
const svgWidth = 1200
const svgHeight = 500

// 当前颜色
const currentColors = ref(['#8a8a8a', '#7a7a7a', '#6a6a6a'])

// 金属丝颜色阶段
const colorStages = [
  ['#5a5a5a', '#4a4a4a', '#3a3a3a'], // 冷：暗银
  ['#8a4a4a', '#7a3a3a', '#6a2a2a'], // 热：暗红
  ['#ff8a4a', '#ff7a3a', '#ff6a2a'], // 高温：橙黄
  ['#c0c0c0', '#b0b0b0', '#a0a0a0'], // 冷：银白
]

// 金属丝数据
interface WireData {
  id: number
  messyPath: string
  targetPath: string
  currentPath: string
  delay: number
  charIndex: number
}

const wireData = ref<WireData[]>([])

// 鼠标状态
let mouseX = 0
let mouseY = 0
let isHovering = false

// 清理函数
type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []
let ctx: gsap.Context | null = null
let scrollTriggerInstance: ScrollTrigger | null = null
let colorAnimationId: number | null = null

// 设置线 ref
function setWireRef(el: SVGPathElement | null, index: number) {
  if (el) {
    wireRefs.value.set(index, el)
  }
}

// 设置波纹 ref
function setWaveRef(el: SVGSVGElement | null, index: number) {
  if (el) {
    waveRefs.value.set(index, el)
  }
}

// 生成混乱路径
function generateMessyPath(x: number, y: number, width: number): string {
  const segments = 5 + Math.floor(Math.random() * 5)
  let path = `M ${x} ${y}`
  
  for (let i = 1; i <= segments; i++) {
    const offsetX = (Math.random() - 0.5) * width * 1.5
    const offsetY = (Math.random() - 0.5) * 80 + (i % 2 === 0 ? 30 : -30)
    const nextX = x + (width / segments) * i + offsetX
    const nextY = y + offsetY
    
    path += ` Q ${x + (width / segments) * (i - 0.5) + offsetX * 0.5} ${y + offsetY * 0.5} ${nextX} ${nextY}`
  }
  
  return path
}

// 生成目标路径（沿文字方向）
function generateTargetPath(x: number, y: number, width: number): string {
  const midY = y
  const cpY1 = y - 20
  const cpY2 = y + 20
  
  return `M ${x} ${midY} Q ${x + width * 0.25} ${cpY1} ${x + width * 0.5} ${midY} Q ${x + width * 0.75} ${cpY2} ${x + width} ${midY}`
}

// 生成金属丝数据
function generateWires() {
  if (!metalCanvasRef.value) return
  
  const charCount = props.title.length
  const charWidth = 100
  const totalWidth = charCount * charWidth
  const startX = (svgWidth - totalWidth) / 2
  const centerY = svgHeight / 2
  
  const wires: WireData[] = []
  
  // 为每个字符生成多条金属丝
  for (let c = 0; c < charCount; c++) {
    const charX = startX + c * charWidth + charWidth / 2
    
    // 每字符 2-3 条丝
    const wireCount = 2 + Math.floor(Math.random() * 2)
    
    for (let w = 0; w < wireCount; w++) {
      const wireWidth = 40 + Math.random() * 30
      const offsetX = (Math.random() - 0.5) * 20
      const offsetY = (Math.random() - 0.5) * 40
      
      wires.push({
        id: c * 3 + w,
        messyPath: generateMessyPath(charX + offsetX - wireWidth / 2, centerY + offsetY, wireWidth),
        targetPath: generateTargetPath(charX + offsetX - wireWidth / 2, centerY + offsetY, wireWidth),
        currentPath: generateMessyPath(charX + offsetX - wireWidth / 2, centerY + offsetY, wireWidth),
        delay: c * 200 + w * 100,
        charIndex: c
      })
    }
  }
  
  wireData.value = wires
}

// 颜色插值
function lerpColor(color1: string, color2: string, t: number): string {
  const c1 = parseInt(color1.slice(1), 16)
  const c2 = parseInt(color2.slice(1), 16)
  
  const r1 = (c1 >> 16) & 255
  const g1 = (c1 >> 8) & 255
  const b1 = c1 & 255
  
  const r2 = (c2 >> 16) & 255
  const g2 = (c2 >> 8) & 255
  const b2 = c2 & 255
  
  const r = Math.round(r1 + (r2 - r1) * t)
  const g = Math.round(g1 + (g2 - g1) * t)
  const b = Math.round(b1 + (b2 - b1) * t)
  
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

// 更新金属颜色
function updateMetalColor(progress: number) {
  let stageIndex: number
  let stageProgress: number
  
  if (progress < 0.3) {
    stageIndex = 0
    stageProgress = progress / 0.3
  } else if (progress < 0.5) {
    stageIndex = 1
    stageProgress = (progress - 0.3) / 0.2
  } else if (progress < 0.7) {
    stageIndex = 2
    stageProgress = (progress - 0.5) / 0.2
  } else {
    stageIndex = 3
    stageProgress = Math.min(1, (progress - 0.7) / 0.3)
  }
  
  const nextStage = Math.min(3, stageIndex + 1)
  const t = stageProgress
  
  currentColors.value = [
    lerpColor(colorStages[stageIndex][0], colorStages[nextStage][0], t),
    lerpColor(colorStages[stageIndex][1], colorStages[nextStage][1], t),
    lerpColor(colorStages[stageIndex][2], colorStages[nextStage][2], t)
  ]
}

// 鼠标移动
function handleMouseMove(e: MouseEvent) {
  if (!parentRef.value) return
  
  const rect = parentRef.value.getBoundingClientRect()
  mouseX = e.clientX - rect.left
  mouseY = e.clientY - rect.top
  
  // 计算温度
  const centerX = rect.width / 2
  const centerY = rect.height / 2
  const dx = mouseX - centerX
  const dy = mouseY - centerY
  const dist = Math.sqrt(dx * dx + dy * dy)
  const maxDist = Math.max(rect.width, rect.height) / 2
  
  temperature.value = Math.max(0, Math.min(100, 100 - (dist / maxDist) * 100))
  
  // 局部加热效果
  wireRefs.value.forEach((wire, index) => {
    const wireDataItem = wireData.value[index]
    if (!wireDataItem) return
    
    const scaleX = rect.width / svgWidth
    const scaleY = rect.height / svgHeight
    const wireCenterX = rect.width / 2 + (wireDataItem.charIndex - props.title.length / 2) * 80 * scaleX
    const wireCenterY = rect.height / 2
    
    const wdx = mouseX - wireCenterX
    const wdy = mouseY - wireCenterY
    const wDist = Math.sqrt(wdx * wdx + wdy * wdy)
    const maxWDist = 150
    
    if (wDist < maxWDist) {
      const heat = (maxWDist - wDist) / maxWDist * 0.3
      const heatPath = lerpPath(wireDataItem.messyPath, wireDataItem.targetPath, 0.2)
      
      gsap.to(wire, {
        attr: { d: heatPath },
        fill: lerpColor('#7a7a7a', '#ff8a4a', heat),
        duration: 0.3
      })
    } else {
      gsap.to(wire, {
        attr: { d: wireDataItem.targetPath },
        fill: currentColors.value[1],
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)'
      })
    }
  })
}

// 鼠标离开
function handleMouseLeave() {
  temperature.value = 0
  isHovering = false
  
  wireData.value.forEach((wireItem, index) => {
    const wire = wireRefs.value.get(index)
    if (wire) {
      gsap.to(wire, {
        attr: { d: wireItem.targetPath },
        fill: currentColors.value[1],
        duration: 1,
        ease: 'elastic.out(1, 0.5)'
      })
    }
  })
}

// 路径插值（简化版）
function lerpPath(path1: string, path2: string, t: number): string {
  return t < 0.5 ? path1 : path2
}

// 入场动画
function playEntryAnimation() {
  // 初始状态
  wireRefs.value.forEach((wire, index) => {
    const wireItem = wireData.value[index]
    if (!wireItem) return
    
    gsap.set(wire, {
      attr: { d: wireItem.messyPath },
      fill: colorStages[0][1],
      opacity: 0.5,
      strokeWidth: 0
    })
  })
  
  // 文字初始状态
  if (titleRef.value) {
    gsap.set(titleRef.value, {
      opacity: 0,
      filter: 'blur(10px)',
      scale: 0.8
    })
  }
  
  if (subtitleRef.value) {
    gsap.set(subtitleRef.value, {
      opacity: 0,
      y: 30,
      filter: 'blur(10px)'
    })
  }
  
  // 创建时间线
  const tl = gsap.timeline()
  
  // 阶段1：加热
  tl.to(wireData.value, {
    duration: 2,
    currentPath: (i: number, target: WireData) => wireData.value[i].targetPath,
    onUpdate: function(this: gsap.core.Tween) {
      const progress = this.progress()
      updateMetalColor(progress * 0.7)
      temperature.value = progress * 70
      
      wireRefs.value.forEach((wire, index) => {
        const wireItem = wireData.value[index]
        if (wireItem) {
          gsap.set(wire, { attr: { d: wireItem.targetPath } })
        }
      })
    },
    ease: 'power1.inOut'
  }, 0)
  
  // 阶段2：跳变瞬间
  tl.to({}, {
    duration: 0.3,
    onStart: () => {
      // 触发热浪波纹
      waveRefs.value.forEach((wave, index) => {
        const delay = index * 0.1
        
        gsap.set(wave, { scale: 1, opacity: 0.8 })
        gsap.to(wave, {
          scale: 3,
          opacity: 0,
          duration: 1.5,
          delay: delay,
          ease: 'power2.out'
        })
        
        // 波纹颜色
        const circle = wave.querySelector('circle')
        if (circle) {
          gsap.to(circle, {
            stroke: '#ff8a4a',
            strokeWidth: 3,
            duration: 0.3,
            delay: delay
          })
        }
      })
    }
  })
  
  // 阶段3：冷却
  tl.to({}, {
    duration: 1.5,
    onUpdate: function(this: gsap.core.Tween) {
      const progress = this.progress()
      updateMetalColor(0.7 + progress * 0.3)
      temperature.value = 70 - progress * 70
    }
  })
  
  // 阶段4：文字显现
  tl.to(titleRef.value, {
    opacity: 1,
    filter: 'blur(0px)',
    scale: 1,
    textShadow: '0 0 20px rgba(192, 192, 192, 0.5), 0 2px 10px rgba(0, 0, 0, 0.5)',
    duration: 1,
    ease: 'power2.out'
  }, '-=1')
  
  tl.to(subtitleRef.value, {
    opacity: 0.6,
    y: 0,
    filter: 'blur(0px)',
    duration: 0.8,
    ease: 'power2.out'
  }, '-=0.5')
  
  // 保存清理函数
  cleanupFns.push(() => tl.kill())
}

// 初始化
onMounted(() => {
  if (!parentRef.value) return
  
  // 生成金属丝
  setTimeout(() => {
    generateWires()
  }, 50)
  
  setTimeout(() => {
    ctx = gsap.context(() => {
      // 入场动画
      playEntryAnimation()
      
      // ScrollTrigger
      scrollTriggerInstance = ScrollTrigger.create({
        trigger: parentRef.value,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 1.5,
        onUpdate: (self) => {
          progress.value = self.progress * 100
          
          // 根据进度更新动画
          const wires = Array.from(wireRefs.value.values())
          wires.forEach((wire, index) => {
            const wireItem = wireData.value[index]
            if (!wireItem) return
            
            const wireProgress = Math.min(1, self.progress * 1.2)
            const currentPath = wireProgress < 0.8
              ? wireItem.messyPath
              : wireItem.targetPath
            
            gsap.to(wire, {
              attr: { d: currentPath },
              duration: 0.5
            })
          })
          
          updateMetalColor(self.progress)
        },
        onEnter: () => {
          playEntryAnimation()
        },
        onLeaveBack: () => {
          wireRefs.value.forEach(wire => {
            gsap.set(wire, { opacity: 0 })
          })
          
          if (titleRef.value) {
            gsap.set(titleRef.value, { opacity: 0 })
          }
          
          if (subtitleRef.value) {
            gsap.set(subtitleRef.value, { opacity: 0 })
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
  
  if (colorAnimationId !== null) {
    cancelAnimationFrame(colorAnimationId)
    colorAnimationId = null
  }
  
  scrollTriggerInstance?.kill()
  ScrollTrigger.getAll().forEach(st => st.kill())
  
  wireRefs.value.clear()
  waveRefs.value.clear()
  wireData.value = []
})
</script>

<style scoped>
.metal-section-249 {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(
    180deg,
    #1a1a1a 0%,
    #2a2a2a 30%,
    #3a3a3a 50%,
    #2a2a2a 70%,
    #1a1a1a 100%
  );
  font-family: 'Rajdhani', 'Noto Sans SC', sans-serif;
}

/* 隔热台面 */
.workbench-249 {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.bench-surface-249 {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(
      ellipse at 50% 50%,
      rgba(60, 60, 60, 0.3) 0%,
      transparent 70%
    );
}

.bench-grid-249 {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(80, 80, 80, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(80, 80, 80, 0.05) 1px, transparent 1px);
  background-size: 20px 20px;
}

/* 热浪波纹 */
.heat-waves-249 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: 400px;
  pointer-events: none;
  z-index: 5;
}

.heat-ring-249 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
}

.heat-ring-249 circle {
  stroke: #ff6a2a;
  stroke-width: 2;
  fill: none;
  filter: blur(2px);
}

/* 金属丝 SVG */
.metal-svg-249 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 50%;
  z-index: 10;
}

.metal-wire-249 {
  fill: none;
  stroke: v-bind('currentColors[1]');
  stroke-width: 4;
  stroke-linecap: round;
  stroke-linejoin: round;
  filter: url(#metalGlow-249);
}

.metal-text-ref-249 {
  font-size: 200px;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 700;
  fill: transparent;
  stroke: transparent;
}

/* 文字叠加 */
.text-overlay-249 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 15;
  pointer-events: none;
}

.metal-title-249 {
  font-size: clamp(3rem, 12vw, 7rem);
  font-weight: 700;
  color: #c0c0c0;
  text-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.8),
    0 0 30px rgba(192, 192, 192, 0.3);
  letter-spacing: 0.15em;
  margin: 0;
  background: linear-gradient(
    135deg,
    #e0e0e0 0%,
    #a0a0a0 50%,
    #d0d0d0 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.metal-subtitle-249 {
  font-size: clamp(0.8rem, 2vw, 1.2rem);
  color: rgba(160, 160, 160, 0.6);
  letter-spacing: 0.5em;
  margin-top: 1.5rem;
  white-space: nowrap;
}

/* 温度指示器 */
.temp-indicator-249 {
  position: absolute;
  bottom: 40px;
  right: 40px;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 20;
}

.temp-label-249 {
  font-size: 0.75rem;
  color: rgba(255, 138, 74, 0.8);
  letter-spacing: 0.1em;
}

.temp-bar-249 {
  width: 100px;
  height: 4px;
  background: rgba(60, 60, 60, 0.8);
  border-radius: 2px;
  overflow: hidden;
}

.temp-fill-249 {
  height: 100%;
  background: linear-gradient(
    90deg,
    #5a5a5a 0%,
    #ff6a2a 50%,
    #ff8a4a 100%
  );
  transition: width 0.1s ease;
  box-shadow: 0 0 10px rgba(255, 106, 42, 0.5);
}

/* 进度条 */
.metal-progress-249 {
  position: fixed;
  top: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, 
    rgba(160, 160, 160, 0.5), 
    rgba(192, 192, 192, 0.8),
    rgba(160, 160, 160, 0.6));
  z-index: 100;
  transition: width 0.1s ease;
  box-shadow: 0 0 15px rgba(192, 192, 192, 0.5);
}

/* 响应式 */
@media (max-width: 768px) {
  .metal-svg-249 {
    width: 95%;
    height: 40%;
  }

  .metal-subtitle-249 {
    letter-spacing: 0.2em;
    font-size: 0.7rem;
  }

  .temp-indicator-249 {
    bottom: 20px;
    right: 20px;
  }
}
</style>
