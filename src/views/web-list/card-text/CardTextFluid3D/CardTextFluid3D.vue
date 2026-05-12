<template>
  <div 
    ref="parentRef" 
    class="fluid-3d-section-244"
    @mousemove="handleMouseMove"
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
    @mouseleave="handleMouseLeave"
  >
    <!-- 流体背景 -->
    <div class="fluid-bg-244">
      <div class="fluid-layer-244 layer-1"></div>
      <div class="fluid-layer-244 layer-2"></div>
      <div class="fluid-layer-244 layer-3"></div>
      <div class="caustics-244"></div>
    </div>

    <!-- 3D舞台 -->
    <div class="stage-3d-244" ref="stageRef">
      <!-- 字符容器 -->
      <div class="char-stage-244" ref="charStageRef">
        <span
          v-for="(item, index) in charData"
          :key="item.key"
          :ref="el => setCharRef(el as HTMLElement, index)"
          class="char-3d-244"
          :style="{
            '--char-z': (item.index * 30 - 60) + 'px',
            '--char-delay': (item.index * 0.15) + 's',
            '--char-color': colorPalette[index % colorPalette.length]
          }"
        >
          <span class="char-face-244">{{ item.char }}</span>
          <span class="char-glow-244">{{ item.char }}</span>
        </span>
      </div>
    </div>

    <!-- 副标题 -->
    <p class="fluid-subtitle-244" ref="subtitleRef">
      <span v-for="(char, i) in subtitle.split('')" :key="i" class="subtitle-char-244">{{ char }}</span>
    </p>

    <!-- 湍流指示器 -->
    <div class="turbulence-indicator-244" :class="{ active: isTurbulence }">
      <span class="indicator-dot-244"></span>
    </div>

    <!-- 进度条 -->
    <div class="fluid-progress-244" :style="{ width: progress + '%' }"></div>
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
  fluidIntensity?: number
}

const props = withDefaults(defineProps<Props>(), {
  title: '立体涡流',
  subtitle: '三维空间 · 流体剧场',
  fluidIntensity: 1
})

// Refs
const parentRef = ref<HTMLElement | null>(null)
const stageRef = ref<HTMLElement | null>(null)
const charStageRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)

const charRefs = ref<Map<number, HTMLElement>>(new Map())

// 状态
const progress = ref(0)
const isTurbulence = ref(false)

// 配色方案
const colorPalette = [
  'rgba(100, 200, 255, 0.9)',
  'rgba(150, 180, 255, 0.85)',
  'rgba(200, 150, 255, 0.8)',
  'rgba(255, 150, 200, 0.85)',
  'rgba(255, 200, 150, 0.9)'
]

// 字符数据
const charData = computed(() => {
  return props.title.split('').map((char, index) => ({
    char,
    index,
    key: `fluid-char-${index}`
  }))
})

// 字符物理数据
interface CharPhysics {
  rotX: number
  rotY: number
  rotZ: number
  translateZ: number
  velocityX: number
  velocityY: number
  velocityZ: number
  phase: number
  vortexPhase: number
}

const charPhysicsMap = new Map<number, CharPhysics>()

// 鼠标状态
const mouseState = {
  x: 0,
  y: 0,
  prevX: 0,
  prevY: 0,
  velocityX: 0,
  velocityY: 0,
  isDown: false
}

// 清理函数
type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []
let ctx: gsap.Context | null = null
let scrollTriggerInstance: ScrollTrigger | null = null
let vortexAnimationId: number | null = null
let turbulenceTimelines: gsap.core.Tween[] = []

// 设置字符 ref
function setCharRef(el: HTMLElement | null, index: number) {
  if (el) {
    charRefs.value.set(index, el)
  }
}

// 初始化字符物理属性
function initCharPhysics() {
  const chars = Array.from(charRefs.value.values())
  
  chars.forEach((char, index) => {
    const zOffset = (index * 30 - 60) * props.fluidIntensity
    
    charPhysicsMap.set(index, {
      rotX: 0,
      rotY: 0,
      rotZ: 0,
      translateZ: zOffset,
      velocityX: 0,
      velocityY: 0,
      velocityZ: 0,
      phase: Math.random() * Math.PI * 2,
      vortexPhase: (index / chars.length) * Math.PI * 2
    })
    
    // 设置初始 transform-origin
    gsap.set(char, {
      transformPerspective: 1000,
      transformOrigin: 'center center'
    })
  })
}

// 涡流动画
function animateVortex() {
  const chars = Array.from(charRefs.value.values())
  const stage = charStageRef.value
  if (!stage) return
  
  const time = Date.now() * 0.001
  
  chars.forEach((char, index) => {
    const physics = charPhysicsMap.get(index)
    if (!physics) return
    
    // 三维涡流运动 - 从左下向右上螺旋
    const vortexStrength = props.fluidIntensity
    
    // X轴旋转 - 俯仰
    physics.rotX = Math.sin(time * 0.8 + physics.vortexPhase) * 25 * vortexStrength
    physics.rotX += Math.sin(time * 1.5 + physics.phase) * 10
    
    // Y轴旋转 - 偏航
    physics.rotY = Math.cos(time * 0.6 + physics.vortexPhase) * 35 * vortexStrength
    physics.rotY += Math.cos(time * 1.2 + physics.phase) * 15
    
    // Z轴旋转 - 翻滚
    physics.rotZ = Math.sin(time * 1 + physics.phase) * 15 * vortexStrength
    
    // 深度漂移
    physics.translateZ = Math.sin(time * 0.7 + physics.vortexPhase) * 40 * vortexStrength
    
    // 应用变换
    gsap.set(char, {
      rotateX: physics.rotX,
      rotateY: physics.rotY,
      rotateZ: physics.rotZ,
      z: physics.translateZ,
      scale: () => 1 + (physics.translateZ / 500) * 0.3
    })
  })
  
  // 舞台整体旋转
  gsap.set(stage, {
    rotateY: Math.sin(time * 0.3) * 5,
    rotateX: Math.cos(time * 0.4) * 3
  })
  
  vortexAnimationId = requestAnimationFrame(animateVortex)
}

// 鼠标移动处理
function handleMouseMove(e: MouseEvent) {
  if (!parentRef.value) return
  
  const rect = parentRef.value.getBoundingClientRect()
  const mouseX = e.clientX - rect.left
  const mouseY = e.clientY - rect.top
  
  // 计算鼠标速度
  mouseState.velocityX = mouseX - mouseState.prevX
  mouseState.velocityY = mouseY - mouseState.prevY
  mouseState.prevX = mouseX
  mouseState.prevY = mouseY
  mouseState.x = mouseX
  mouseState.y = mouseY
  
  // 鼠标在舞台中心的位置
  const stageRect = stageRef.value?.getBoundingClientRect()
  if (!stageRect) return
  
  const stageCenterX = stageRect.left + stageRect.width / 2 - rect.left
  const stageCenterY = stageRect.top + stageRect.height / 2 - rect.top
  
  // 检测是否在舞台上
  const isOverStage = 
    mouseX > stageRect.left - rect.left && 
    mouseX < stageRect.right - rect.left &&
    mouseY > stageRect.top - rect.top && 
    mouseY < stageRect.bottom - rect.top
  
  if (isOverStage || mouseState.isDown) {
    isTurbulence.value = true
    
    // 局部湍流效果
    charPhysicsMap.forEach((physics, index) => {
      const el = charRefs.value.get(index)
      if (!el) return
      
      const elRect = el.getBoundingClientRect()
      const elCenterX = elRect.left + elRect.width / 2 - rect.left
      const elCenterY = elRect.top + elRect.height / 2 - rect.top
      
      const dx = mouseX - elCenterX
      const dy = mouseY - elCenterY
      const dist = Math.sqrt(dx * dx + dy * dy)
      
      if (dist < 200) {
        const force = (200 - dist) / 200 * 20 * props.fluidIntensity
        
        // 围绕光标轴线翻转
        const axisAngle = Math.atan2(mouseState.velocityY, mouseState.velocityX)
        
        gsap.to(physics, {
          rotX: physics.rotX + dy * 0.1 * props.fluidIntensity,
          rotY: physics.rotY + dx * 0.1 * props.fluidIntensity,
          rotZ: physics.rotZ + Math.sin(axisAngle) * force,
          translateZ: physics.translateZ + (mouseState.isDown ? force * 2 : 0),
          duration: 0.3,
          ease: 'power2.out'
        })
        
        // 液体阻力恢复
        gsap.to(physics, {
          rotX: () => Math.sin(Date.now() * 0.001 * 0.8 + physics.vortexPhase) * 25 * props.fluidIntensity,
          rotY: () => Math.cos(Date.now() * 0.001 * 0.6 + physics.vortexPhase) * 35 * props.fluidIntensity,
          rotZ: () => Math.sin(Date.now() * 0.001 * 1 + physics.phase) * 15 * props.fluidIntensity,
          translateZ: physics.translateZ,
          duration: mouseState.isDown ? 2 : 1.5,
          ease: 'elastic.out(1, 0.4)',
          delay: 0.1
        })
      }
    })
  } else {
    isTurbulence.value = false
  }
}

// 鼠标按下
function handleMouseDown() {
  mouseState.isDown = true
}

// 鼠标释放
function handleMouseUp() {
  mouseState.isDown = false
  
  // InertiaPlugin 接管衰减
  charPhysicsMap.forEach((physics) => {
    // 衰减动画
    const t1 = gsap.to(physics, {
      velocityX: physics.velocityX * 0.9,
      velocityY: physics.velocityY * 0.9,
      velocityZ: physics.velocityZ * 0.9,
      duration: 0.5,
      ease: 'power2.out'
    })
    turbulenceTimelines.push(t1)
  })
}

// 鼠标离开
function handleMouseLeave() {
  mouseState.isDown = false
  isTurbulence.value = false
}

// 入场动画
function playEntryAnimation() {
  const chars = Array.from(charRefs.value.values())
  
  // 初始状态 - 分散在深水中
  chars.forEach((char, index) => {
    gsap.set(char, {
      opacity: 0,
      scale: 0.3,
      rotateX: () => -90 + Math.random() * 180,
      rotateY: () => -90 + Math.random() * 180,
      rotateZ: () => Math.random() * 360,
      z: () => -200 + Math.random() * 400,
      filter: 'blur(20px) brightness(0.5)'
    })
  })
  
  if (subtitleRef.value) {
    const subChars = subtitleRef.value.querySelectorAll('.subtitle-char-244')
    gsap.set(subChars, {
      opacity: 0,
      y: 30,
      filter: 'blur(10px)'
    })
  }
  
  // 涡流汇聚入场
  gsap.to(chars, {
    opacity: 1,
    scale: 1,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    z: (i: number) => (i * 30 - 60) * props.fluidIntensity,
    filter: 'blur(0px) brightness(1)',
    duration: 1.5,
    stagger: {
      each: 0.1,
      from: 'center',
      ease: 'power2.inOut'
    },
    ease: 'elastic.out(1, 0.6)'
  })
  
  // 副标题动画
  if (subtitleRef.value) {
    const subChars = subtitleRef.value.querySelectorAll('.subtitle-char-244')
    gsap.to(subChars, {
      opacity: 0.7,
      y: 0,
      filter: 'blur(0px)',
      duration: 1,
      stagger: 0.05,
      delay: chars.length * 0.1 + 0.5,
      ease: 'power2.out'
    })
  }
}

// 初始化
onMounted(() => {
  if (!parentRef.value) return
  
  setTimeout(() => {
    ctx = gsap.context(() => {
      // 初始化物理属性
      initCharPhysics()
      
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
          
          // 流体强度随滚动变化
          const intensity = 1 - self.progress * 0.3
          if (parentRef.value) {
            parentRef.value.style.setProperty('--fluid-intensity', String(intensity))
          }
        },
        onEnter: () => {
          playEntryAnimation()
        },
        onLeaveBack: () => {
          const chars = Array.from(charRefs.value.values())
          chars.forEach((char, index) => {
            gsap.set(char, {
              opacity: 0,
              scale: 0.3,
              rotateX: () => -90 + Math.random() * 180,
              rotateY: () => -90 + Math.random() * 180,
              rotateZ: () => Math.random() * 360,
              z: () => -200 + Math.random() * 400,
              filter: 'blur(20px) brightness(0.5)'
            })
          })
          
          if (subtitleRef.value) {
            const subChars = subtitleRef.value.querySelectorAll('.subtitle-char-244')
            gsap.set(subChars, { opacity: 0, y: 30, filter: 'blur(10px)' })
          }
        }
      })
      
      cleanupFns.push(() => scrollTriggerInstance?.kill())
    }, parentRef.value)
  }, 100)
  
  // 启动涡流动画
  animateVortex()
})

// 清理
onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0
  
  ctx?.revert()
  ctx = null
  
  if (vortexAnimationId !== null) {
    cancelAnimationFrame(vortexAnimationId)
    vortexAnimationId = null
  }
  
  turbulenceTimelines.forEach(t => t.kill())
  turbulenceTimelines = []
  
  scrollTriggerInstance?.kill()
  ScrollTrigger.getAll().forEach(st => st.kill())
  
  charPhysicsMap.clear()
  charRefs.value.clear()
})
</script>

<style scoped>
.fluid-3d-section-244 {
  --fluid-intensity: 1;
  
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: radial-gradient(
    ellipse at 30% 70%,
    #0a1a2a 0%,
    #051015 40%,
    #020810 100%
  );
  font-family: 'Noto Sans SC', 'Microsoft YaHei', sans-serif;
  cursor: crosshair;
}

/* 流体背景 */
.fluid-bg-244 {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.fluid-layer-244 {
  position: absolute;
  inset: 0;
  opacity: 0.1;
}

.layer-1 {
  background: linear-gradient(
    135deg,
    rgba(100, 200, 255, 0.3) 0%,
    transparent 50%
  );
  animation: fluid-drift-244 20s ease-in-out infinite;
}

.layer-2 {
  background: linear-gradient(
    225deg,
    rgba(150, 180, 255, 0.2) 0%,
    transparent 50%
  );
  animation: fluid-drift-244 25s ease-in-out infinite reverse;
}

.layer-3 {
  background: radial-gradient(
    ellipse at 70% 30%,
    rgba(200, 150, 255, 0.15) 0%,
    transparent 50%
  );
  animation: fluid-drift-244 30s ease-in-out infinite;
}

@keyframes fluid-drift-244 {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(20px, -30px) rotate(2deg); }
  66% { transform: translate(-20px, 20px) rotate(-2deg); }
}

/* 焦散效果 */
.caustics-244 {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(ellipse at 20% 60%, rgba(100, 200, 255, 0.1) 0%, transparent 40%),
    radial-gradient(ellipse at 80% 40%, rgba(150, 180, 255, 0.08) 0%, transparent 35%);
  animation: caustics-animate-244 8s ease-in-out infinite;
}

@keyframes caustics-animate-244 {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}

/* 3D舞台 */
.stage-3d-244 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transform-style: preserve-3d;
  perspective: 1200px;
}

.char-stage-244 {
  display: flex;
  gap: 0.15em;
  transform-style: preserve-3d;
}

/* 3D字符 */
.char-3d-244 {
  position: relative;
  display: inline-block;
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: 600;
  color: #fff;
  transform-style: preserve-3d;
  will-change: transform;
  cursor: grab;
}

.char-face-244 {
  display: block;
  background: linear-gradient(
    135deg,
    rgba(100, 200, 255, 0.1) 0%,
    rgba(150, 180, 255, 0.05) 50%,
    rgba(100, 200, 255, 0.1) 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: none;
  filter: drop-shadow(0 0 20px var(--char-color));
}

.char-glow-244 {
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  color: var(--char-color);
  opacity: 0.5;
  filter: blur(8px);
  animation: glow-pulse-244 2s ease-in-out infinite;
  animation-delay: var(--char-delay);
}

@keyframes glow-pulse-244 {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.05); }
}

/* 副标题 */
.fluid-subtitle-244 {
  position: absolute;
  top: calc(50% + 120px);
  left: 50%;
  transform: translateX(-50%);
  font-size: clamp(0.75rem, 1.5vw, 1rem);
  color: rgba(150, 200, 255, 0.6);
  letter-spacing: 0.5em;
  white-space: nowrap;
  z-index: 10;
  display: flex;
  gap: 0.1em;
}

.subtitle-char-244 {
  display: inline-block;
}

/* 湍流指示器 */
.turbulence-indicator-244 {
  position: fixed;
  bottom: 30px;
  right: 30px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(100, 200, 255, 0.2);
  border-radius: 20px;
  z-index: 100;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.turbulence-indicator-244.active {
  opacity: 1;
}

.indicator-dot-244 {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(100, 200, 255, 0.5);
  animation: dot-pulse-244 0.5s ease-in-out infinite;
}

@keyframes dot-pulse-244 {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.5); opacity: 1; }
}

/* 进度条 */
.fluid-progress-244 {
  position: fixed;
  top: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, 
    rgba(100, 200, 255, 0.5), 
    rgba(150, 180, 255, 0.8),
    rgba(100, 200, 255, 0.6));
  z-index: 100;
  transition: width 0.1s ease;
  box-shadow: 0 0 15px rgba(100, 200, 255, 0.5);
}

/* 响应式 */
@media (max-width: 768px) {
  .char-stage-244 {
    flex-wrap: wrap;
    justify-content: center;
    max-width: 90vw;
  }

  .char-3d-244 {
    font-size: clamp(2rem, 10vw, 3.5rem);
  }

  .fluid-subtitle-244 {
    letter-spacing: 0.2em;
    font-size: 0.7rem;
    top: calc(50% + 80px);
  }

  .stage-3d-244 {
    perspective: 800px;
  }
}
</style>
