<template>
  <div 
    ref="parentRef" 
    class="mycelium-section-248"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <!-- 腐殖土背景 -->
    <div class="forest-floor-248">
      <div class="substrate-layer-248"></div>
      <div class="decay-particles-248"></div>
    </div>

    <!-- 菌丝 SVG 画布 -->
    <svg 
      ref="svgCanvasRef" 
      class="mycelium-svg-248"
      :viewBox="`0 0 ${svgWidth} ${svgHeight}`"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <!-- 菌丝渐变 -->
        <linearGradient id="hyphaeGradient-248" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1a3a1a" />
          <stop offset="50%" stop-color="#2d5a2d" />
          <stop offset="100%" stop-color="#1a3a1a" />
        </linearGradient>
        
        <!-- 荧光渐变 -->
        <radialGradient id="sporeGlow-248" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#88ff88" stop-opacity="1" />
          <stop offset="50%" stop-color="#44ff44" stop-opacity="0.6" />
          <stop offset="100%" stop-color="#00ff00" stop-opacity="0" />
        </radialGradient>
        
        <!-- 发光滤镜 -->
        <filter id="biolumFilter-248">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      <!-- 菌丝网络 -->
      <g class="hyphae-group-248" ref="hyphaeGroupRef">
        <path
          v-for="(line, index) in hyphaeLines"
          :key="'line-' + index"
          :ref="el => setHyphaRef(el as SVGPathElement, index)"
          :d="line.path"
          class="hypha-line-248"
          :style="{
            '--line-delay': line.delay + 'ms',
            '--start-x': line.x1,
            '--start-y': line.y1,
            '--end-x': line.x2,
            '--end-y': line.y2
          }"
        />
      </g>
      
      <!-- 荧光节点 -->
      <g class="spore-group-248" ref="sporeGroupRef">
        <circle
          v-for="(node, index) in sporeNodes"
          :key="'spore-' + index"
          :ref="el => setSporeRef(el as SVGCircleElement, index)"
          :cx="node.x"
          :cy="node.y"
          :r="node.r"
          :fill="node.color"
          :style="{ '--node-delay': node.delay + 'ms' }"
        />
      </g>
      
      <!-- 文字路径 -->
      <text
        ref="svgTextRef"
        :x="svgWidth / 2"
        :y="svgHeight / 2"
        text-anchor="middle"
        dominant-baseline="middle"
        class="mycelium-text-248"
      >{{ title }}</text>
    </svg>

    <!-- 孢子粒子画布 -->
    <canvas ref="sporeCanvasRef" class="spore-canvas-248"></canvas>

    <!-- 文字叠加 -->
    <div class="text-overlay-248" ref="textOverlayRef">
      <h1 class="mycelium-title-248" ref="titleRef">{{ title }}</h1>
      <p class="mycelium-subtitle-248" ref="subtitleRef">{{ subtitle }}</p>
    </div>

    <!-- 进度条 -->
    <div class="mycelium-progress-248" :style="{ width: progress + '%' }"></div>
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
  title: '菌丝网络',
  subtitle: '黑暗森林 · 生命的网络'
})

// Refs
const parentRef = ref<HTMLElement | null>(null)
const svgCanvasRef = ref<SVGSVGElement | null>(null)
const hyphaeGroupRef = ref<SVGGElement | null>(null)
const sporeGroupRef = ref<SVGGElement | null>(null)
const sporeCanvasRef = ref<HTMLCanvasElement | null>(null)
const textOverlayRef = ref<HTMLElement | null>(null)
const svgTextRef = ref<SVGTextElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)

const hyphaRefs = ref<Map<number, SVGPathElement>>(new Map())
const sporeRefs = ref<Map<number, SVGCircleElement>>(new Map())

// 状态
const progress = ref(0)
const svgWidth = 1200
const svgHeight = 600

// 菌丝线数据
interface HyphaLine {
  x1: number
  y1: number
  x2: number
  y2: number
  path: string
  delay: number
}

const hyphaeLines = ref<HyphaLine[]>([])

// 孢子节点
interface SporeNode {
  x: number
  y: number
  r: number
  delay: number
  color: string
}

const sporeNodes = ref<SporeNode[]>([])

// 孢子粒子
interface SporeParticle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  life: number
  maxLife: number
  originX: number
  originY: number
}

const sporeParticles = ref<SporeParticle[]>([])

// 鼠标状态
let mouseX = 0
let mouseY = 0

// 清理函数
type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []
let ctx: gsap.Context | null = null
let scrollTriggerInstance: ScrollTrigger | null = null
let animationFrameId: number | null = null

// 荧光颜色
const glowColors = ['#88ff88', '#66ff66', '#44ff44', '#33ff33', '#00ff00']

// 设置菌丝 ref
function setHyphaRef(el: SVGPathElement | null, index: number) {
  if (el) {
    hyphaRefs.value.set(index, el)
  }
}

// 设置孢子 ref
function setSporeRef(el: SVGCircleElement | null, index: number) {
  if (el) {
    sporeRefs.value.set(index, el)
  }
}

// 生成菌丝网络
function generateMycelium() {
  if (!svgCanvasRef.value) return
  
  const centerX = svgWidth / 2
  const centerY = svgHeight / 2
  
  // 文字节点位置（基于文字长度）
  const charCount = props.title.length
  const spacing = 80
  const startX = centerX - ((charCount - 1) * spacing) / 2
  
  const charNodes: { x: number; y: number }[] = []
  for (let i = 0; i < charCount; i++) {
    charNodes.push({
      x: startX + i * spacing,
      y: centerY
    })
  }
  
  // 生成菌丝线
  const lines: HyphaLine[] = []
  
  // 水平连接
  for (let i = 0; i < charCount - 1; i++) {
    const x1 = charNodes[i].x
    const y1 = charNodes[i].y
    const x2 = charNodes[i + 1].x
    const y2 = charNodes[i + 1].y
    
    // 主线
    lines.push({
      x1, y1, x2, y2,
      path: `M ${x1} ${y1} Q ${(x1 + x2) / 2} ${y1 - 30} ${x2} ${y2}`,
      delay: i * 150
    })
    
    // 分支
    for (let j = 0; j < 3; j++) {
      const branchX = x1 + (x2 - x1) * (0.3 + j * 0.2)
      const branchY = y1 - 30 + (Math.random() - 0.5) * 60
      const endX = branchX + (Math.random() - 0.5) * 100
      const endY = branchY + 40 + Math.random() * 80
      
      lines.push({
        x1: branchX, y1: branchY, x2: endX, y2: endY,
        path: `M ${branchX} ${branchY} Q ${(branchX + endX) / 2} ${(branchY + endY) / 2 - 20} ${endX} ${endY}`,
        delay: i * 150 + 100 + j * 50
      })
    }
  }
  
  // 添加从中心向外的菌丝
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2
    const startX = centerX + Math.cos(angle) * 50
    const startY = centerY + Math.sin(angle) * 30
    const endX = centerX + Math.cos(angle) * (200 + Math.random() * 150)
    const endY = centerY + Math.sin(angle) * (120 + Math.random() * 100)
    
    lines.push({
      x1: startX, y1: startY, x2: endX, y2: endY,
      path: `M ${startX} ${startY} Q ${(startX + endX) / 2} ${(startY + endY) / 2 + (Math.random() - 0.5) * 50} ${endX} ${endY}`,
      delay: charCount * 150 + i * 100
    })
  }
  
  hyphaeLines.value = lines
  
  // 生成孢子节点
  const nodes: SporeNode[] = []
  
  // 在文字节点处
  charNodes.forEach((node, index) => {
    nodes.push({
      x: node.x,
      y: node.y,
      r: 8 + Math.random() * 4,
      delay: index * 200 + 500,
      color: glowColors[Math.floor(Math.random() * glowColors.length)]
    })
  })
  
  // 在菌丝交汇处
  lines.slice(charCount - 1, charCount + 5).forEach((line, index) => {
    nodes.push({
      x: (line.x1 + line.x2) / 2,
      y: line.y1 - 30 + (Math.random() - 0.5) * 60,
      r: 4 + Math.random() * 4,
      delay: charCount * 150 + index * 100 + 500,
      color: glowColors[Math.floor(Math.random() * glowColors.length)]
    })
  })
  
  // 在边缘
  for (let i = 0; i < 8; i++) {
    const x = 150 + Math.random() * (svgWidth - 300)
    const y = 150 + Math.random() * (svgHeight - 300)
    nodes.push({
      x, y,
      r: 2 + Math.random() * 3,
      delay: 1500 + i * 100,
      color: glowColors[Math.floor(Math.random() * glowColors.length)]
    })
  }
  
  sporeNodes.value = nodes
}

// 初始化孢子粒子
function initSporeParticles() {
  for (let i = 0; i < 100; i++) {
    const angle = Math.random() * Math.PI * 2
    const dist = 50 + Math.random() * 150
    const originX = svgWidth / 2 + Math.cos(angle) * dist
    const originY = svgHeight / 2 + Math.sin(angle) * dist * 0.6
    
    sporeParticles.value.push({
      x: originX,
      y: originY,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.5 - 0.2,
      size: 1 + Math.random() * 2,
      alpha: 0,
      life: 0,
      maxLife: 200 + Math.random() * 300,
      originX,
      originY
    })
  }
}

// 动画孢子粒子
function animateSporeParticles() {
  const canvas = sporeCanvasRef.value
  if (!canvas) return
  
  const ctx2d = canvas.getContext('2d')
  if (!ctx2d) return
  
  const parent = parentRef.value
  if (!parent) return
  
  canvas.width = parent.clientWidth
  canvas.height = parent.clientHeight
  
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2
  const scaleX = canvas.width / svgWidth
  const scaleY = canvas.height / svgHeight
  
  ctx2d.clearRect(0, 0, canvas.width, canvas.height)
  
  sporeParticles.value.forEach(p => {
    // 更新生命周期
    p.life++
    
    if (p.life < p.maxLife * 0.2) {
      // 渐入
      p.alpha = p.life / (p.maxLife * 0.2)
    } else if (p.life > p.maxLife * 0.8) {
      // 渐出
      p.alpha = (p.maxLife - p.life) / (p.maxLife * 0.2)
    } else {
      p.alpha = 1
    }
    
    // 更新位置
    p.x += p.vx
    p.y += p.vy
    p.vx += (Math.random() - 0.5) * 0.02 // 水平漂移
    p.vy *= 0.99 // 阻力
    
    // 重置
    if (p.life >= p.maxLife) {
      p.life = 0
      const angle = Math.random() * Math.PI * 2
      const dist = 50 + Math.random() * 150
      p.originX = svgWidth / 2 + Math.cos(angle) * dist
      p.originY = svgHeight / 2 + Math.sin(angle) * dist * 0.6
      p.x = p.originX
      p.y = p.originY
      p.vx = (Math.random() - 0.5) * 0.3
      p.vy = -Math.random() * 0.5 - 0.2
    }
    
    // 绘制
    const screenX = centerX + (p.x - svgWidth / 2) * scaleX
    const screenY = centerY + (p.y - svgHeight / 2) * scaleY
    
    const gradient = ctx2d.createRadialGradient(
      screenX, screenY, 0,
      screenX, screenY, p.size * 3
    )
    gradient.addColorStop(0, `rgba(136, 255, 136, ${p.alpha})`)
    gradient.addColorStop(1, 'transparent')
    
    ctx2d.beginPath()
    ctx2d.fillStyle = gradient
    ctx2d.arc(screenX, screenY, p.size * 3, 0, Math.PI * 2)
    ctx2d.fill()
  })
  
  animationFrameId = requestAnimationFrame(animateSporeParticles)
}

// 鼠标移动
function handleMouseMove(e: MouseEvent) {
  if (!parentRef.value) return
  
  const rect = parentRef.value.getBoundingClientRect()
  mouseX = e.clientX - rect.left
  mouseY = e.clientY - rect.top
  
  // 扰动附近菌丝
  const scaleX = rect.width / svgWidth
  const scaleY = rect.height / svgHeight
  
  hyphaRefs.value.forEach((path, index) => {
    const line = hyphaeLines.value[index]
    if (!line) return
    
    const midX = (line.x1 + line.x2) / 2
    const midY = (line.y1 + line.y2) / 2
    const screenX = rect.width / 2 + (midX - svgWidth / 2) * scaleX
    const screenY = rect.height / 2 + (midY - svgHeight / 2) * scaleY
    
    const dx = mouseX - screenX
    const dy = mouseY - screenY
    const dist = Math.sqrt(dx * dx + dy * dy)
    const maxDist = 200
    
    if (dist < maxDist) {
      const force = (maxDist - dist) / maxDist * 10
      const angle = Math.atan2(dy, dx)
      
      gsap.to(path, {
        attr: {
          d: `M ${line.x1} ${line.y1} Q ${midX + Math.cos(angle) * force} ${midY + Math.sin(angle) * force} ${line.x2} ${line.y2}`
        },
        duration: 0.3
      })
    } else {
      gsap.to(path, {
        attr: { d: line.path },
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)'
      })
    }
  })
  
  // 扰动孢子节点
  sporeRefs.value.forEach((circle, index) => {
    const node = sporeNodes.value[index]
    if (!node) return
    
    const screenX = rect.width / 2 + (node.x - svgWidth / 2) * scaleX
    const screenY = rect.height / 2 + (node.y - svgHeight / 2) * scaleY
    
    const dx = mouseX - screenX
    const dy = mouseY - screenY
    const dist = Math.sqrt(dx * dx + dy * dy)
    const maxDist = 150
    
    if (dist < maxDist) {
      const force = (maxDist - dist) / maxDist * 15
      
      gsap.to(circle, {
        attr: {
          cx: node.x + (dx / dist) * force,
          cy: node.y + (dy / dist) * force
        },
        duration: 0.3
      })
    } else {
      gsap.to(circle, {
        attr: { cx: node.x, cy: node.y },
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)'
      })
    }
  })
}

// 鼠标离开
function handleMouseLeave() {
  // 恢复所有菌丝
  hyphaeLines.value.forEach((line, index) => {
    const path = hyphaRefs.value.get(index)
    if (path) {
      gsap.to(path, {
        attr: { d: line.path },
        duration: 1,
        ease: 'elastic.out(1, 0.5)'
      })
    }
  })
  
  // 恢复所有孢子
  sporeNodes.value.forEach((node, index) => {
    const circle = sporeRefs.value.get(index)
    if (circle) {
      gsap.to(circle, {
        attr: { cx: node.x, cy: node.y },
        duration: 1,
        ease: 'elastic.out(1, 0.5)'
      })
    }
  })
}

// 入场动画
function playEntryAnimation() {
  // 菌丝生长
  const hyphae = Array.from(hyphaRefs.value.values())
  hyphae.forEach((path, index) => {
    const line = hyphaeLines.value[index]
    if (!line) return
    
    const length = path.getTotalLength?.() || 200
    
    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length,
      opacity: 0.3
    })
    
    gsap.to(path, {
      strokeDashoffset: 0,
      opacity: 0.8,
      duration: 1.5,
      delay: line.delay / 1000,
      ease: 'power2.inOut'
    })
  })
  
  // 孢子节点
  const spores = Array.from(sporeRefs.value.values())
  spores.forEach((spore, index) => {
    const node = sporeNodes.value[index]
    if (!node) return
    
    gsap.set(spore, {
      attr: { r: 0 },
      opacity: 0,
      filter: 'blur(10px)'
    })
    
    gsap.to(spore, {
      attr: { r: node.r },
      opacity: 1,
      filter: 'blur(0px)',
      duration: 0.8,
      delay: node.delay / 1000,
      ease: 'elastic.out(1, 0.6)'
    })
  })
  
  // 文字
  if (titleRef.value) {
    gsap.set(titleRef.value, {
      opacity: 0,
      filter: 'blur(30px)',
      scale: 1.2
    })
    
    gsap.to(titleRef.value, {
      opacity: 1,
      filter: 'blur(0px)',
      scale: 1,
      duration: 1.5,
      delay: 1.5,
      ease: 'power2.out'
    })
  }
  
  if (subtitleRef.value) {
    gsap.set(subtitleRef.value, {
      opacity: 0,
      y: 20,
      filter: 'blur(10px)'
    })
    
    gsap.to(subtitleRef.value, {
      opacity: 0.7,
      y: 0,
      filter: 'blur(0px)',
      duration: 1,
      delay: 2,
      ease: 'power2.out'
    })
  }
}

// 初始化
onMounted(() => {
  if (!parentRef.value) return
  
  // 生成菌丝
  generateMycelium()
  
  // 初始化粒子
  initSporeParticles()
  
  setTimeout(() => {
    ctx = gsap.context(() => {
      // 入场动画
      playEntryAnimation()
      
      // 菌丝脉动
      const hyphae = Array.from(hyphaRefs.value.values())
      hyphae.forEach((path, index) => {
        const delay = index * 0.05
        gsap.to(path, {
          opacity: 0.5 + Math.random() * 0.3,
          duration: 2 + Math.random(),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: delay
        })
      })
      
      // ScrollTrigger
      scrollTriggerInstance = ScrollTrigger.create({
        trigger: parentRef.value,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 1.5,
        onUpdate: (self) => {
          progress.value = self.progress * 100
        },
        onEnter: () => {
          playEntryAnimation()
        },
        onLeaveBack: () => {
          const hyphae = Array.from(hyphaRefs.value.values())
          hyphae.forEach(path => {
            gsap.set(path, { opacity: 0 })
          })
          
          const spores = Array.from(sporeRefs.value.values())
          spores.forEach(spore => {
            gsap.set(spore, { opacity: 0, attr: { r: 0 } })
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
  }, 100)
  
  // 启动孢子动画
  animateSporeParticles()
})

// 清理
onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0
  
  ctx?.revert()
  ctx = null
  
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
  
  scrollTriggerInstance?.kill()
  ScrollTrigger.getAll().forEach(st => st.kill())
  
  hyphaRefs.value.clear()
  sporeRefs.value.clear()
  hyphaeLines.value = []
  sporeNodes.value = []
  sporeParticles.value = []
})
</script>

<style scoped>
.mycelium-section-248 {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(
    180deg,
    #050a05 0%,
    #0a1a0a 30%,
    #0d1f0d 50%,
    #0a1a0a 70%,
    #050a05 100%
  );
  font-family: 'Crimson Text', 'Noto Serif SC', serif;
}

/* 腐殖土背景 */
.forest-floor-248 {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.substrate-layer-248 {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(
      ellipse at 50% 80%,
      rgba(30, 50, 30, 0.3) 0%,
      transparent 50%
    ),
    repeating-linear-gradient(
      0deg,
      transparent 0px,
      transparent 3px,
      rgba(20, 40, 20, 0.1) 3px,
      rgba(20, 40, 20, 0.1) 4px
    );
}

.decay-particles-248 {
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(1px 1px at 20% 30%, rgba(50, 80, 50, 0.3), transparent),
    radial-gradient(1px 1px at 40% 70%, rgba(40, 70, 40, 0.3), transparent),
    radial-gradient(1px 1px at 60% 40%, rgba(50, 80, 50, 0.3), transparent),
    radial-gradient(1px 1px at 80% 60%, rgba(40, 70, 40, 0.3), transparent);
  animation: decay-float-248 20s linear infinite;
}

@keyframes decay-float-248 {
  0% { transform: translateY(0); }
  100% { transform: translateY(-100px); }
}

/* 菌丝 SVG */
.mycelium-svg-248 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 60%;
  z-index: 5;
}

.hypha-line-248 {
  fill: none;
  stroke: url(#hyphaeGradient-248);
  stroke-width: 2;
  stroke-linecap: round;
  opacity: 0;
  filter: drop-shadow(0 0 2px rgba(68, 255, 68, 0.3));
}

.spore-group-248 circle {
  filter: url(#biolumFilter-248);
}

/* 孢子画布 */
.spore-canvas-248 {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 6;
}

/* 文字叠加 */
.text-overlay-248 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 10;
  pointer-events: none;
}

.mycelium-title-248 {
  font-size: clamp(3rem, 10vw, 6rem);
  font-weight: 400;
  color: #88ff88;
  text-shadow: 
    0 0 10px rgba(136, 255, 136, 0.8),
    0 0 20px rgba(136, 255, 136, 0.6),
    0 0 40px rgba(136, 255, 136, 0.4),
    0 0 80px rgba(68, 255, 68, 0.2);
  letter-spacing: 0.2em;
  margin: 0;
}

.mycelium-subtitle-248 {
  font-size: clamp(0.8rem, 2vw, 1.1rem);
  color: rgba(136, 255, 136, 0.6);
  letter-spacing: 0.5em;
  margin-top: 1.5rem;
  white-space: nowrap;
}

/* 进度条 */
.mycelium-progress-248 {
  position: fixed;
  top: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, 
    rgba(136, 255, 136, 0.5), 
    rgba(68, 255, 68, 0.8),
    rgba(136, 255, 136, 0.6));
  z-index: 100;
  transition: width 0.1s ease;
  box-shadow: 0 0 15px rgba(136, 255, 136, 0.5);
}

/* 响应式 */
@media (max-width: 768px) {
  .mycelium-svg-248 {
    width: 95%;
    height: 50%;
  }

  .mycelium-subtitle-248 {
    letter-spacing: 0.2em;
    font-size: 0.7rem;
  }
}
</style>
