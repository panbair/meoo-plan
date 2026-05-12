<template>
  <section ref="parallaxRef" class="parallax-section">
    <!-- 状态指示器 -->
    <div class="parallax-indicator">
      <span class="indicator-label">{{ phaseLabel }}</span>
      <div class="indicator-bar">
        <div class="indicator-fill" :style="{ width: `${scrollProgress}%` }"></div>
      </div>
      <span class="indicator-value">{{ Math.round(scrollProgress) }}%</span>
    </div>

    <!-- 深空背景 -->
    <div ref="spaceBgRef" class="space-bg">
      <div v-for="i in 120" :key="`bg-${i}`" class="space-particle"></div>
      <div class="nebula nebula-1"></div>
      <div class="nebula nebula-2"></div>
      <div class="nebula nebula-3"></div>
    </div>

    <!-- 3D 场景容器 -->
    <div ref="sceneRef" class="scene-container">
      <!-- 远景层 -->
      <div ref="backLayerRef" class="layer layer-back">
        <div
          v-for="(part, i) in backParts"
          :key="`back-${i}`"
          :ref="el => setPartRef(el, `back-${i}`)"
          class="part-wrapper"
        >
          <div class="part-ring ring-outer"></div>
          <div class="part-ring ring-inner"></div>
          <div class="part-frame">
            <img :src="part.url" :alt="part.name" class="part-image" />
          </div>
          <div class="part-glow"></div>
          <div class="part-label">{{ part.name }}</div>
        </div>
      </div>

      <!-- 中景层 -->
      <div ref="middleLayerRef" class="layer layer-middle">
        <div
          v-for="(part, i) in middleParts"
          :key="`middle-${i}`"
          :ref="el => setPartRef(el, `middle-${i}`)"
          class="part-wrapper"
        >
          <div class="part-ring ring-outer"></div>
          <div class="part-ring ring-inner"></div>
          <div class="part-frame">
            <img :src="part.url" :alt="part.name" class="part-image" />
          </div>
          <div class="part-glow"></div>
          <div class="part-label">{{ part.name }}</div>
        </div>
      </div>

      <!-- 前景层 -->
      <div ref="frontLayerRef" class="layer layer-front">
        <div
          v-for="(part, i) in frontParts"
          :key="`front-${i}`"
          :ref="el => setPartRef(el, `front-${i}`)"
          class="part-wrapper part-clickable"
          @click="handlePartClick(part, 'front', i)"
        >
          <div class="part-ring ring-outer"></div>
          <div class="part-ring ring-inner"></div>
          <div class="part-frame">
            <img :src="part.url" :alt="part.name" class="part-image" />
          </div>
          <div class="part-glow"></div>
          <div class="part-label">{{ part.name }}</div>
        </div>
      </div>

      <!-- 中心主体 -->
      <div ref="coreRef" class="core-container">
        <div class="core-outer"></div>
        <div class="core-middle"></div>
        <div class="core-inner"></div>
        <div class="core-image-wrap">
          <img :src="mainImage.url" :alt="mainImage.title" class="core-image" />
        </div>
        <div class="core-particles">
          <span v-for="i in 24" :key="`core-p-${i}`" class="core-particle"></span>
        </div>
        <div class="core-shield"></div>
      </div>
    </div>

    <!-- 详情面板 -->
    <Transition name="detail">
      <div v-if="selectedPart" class="detail-panel" @click="closeDetail">
        <div class="detail-content" @click.stop>
          <button class="detail-close" @click="closeDetail">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
          <div class="detail-image-wrap">
            <img :src="selectedPart.url" :alt="selectedPart.name" class="detail-image" />
          </div>
          <div class="detail-info">
            <h3 class="detail-title">{{ selectedPart.name }}</h3>
            <p class="detail-desc">{{ selectedPart.description }}</p>
          </div>
        </div>
      </div>
    </Transition>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ==================== 类型定义 ====================
interface PartData {
  id: number
  url: string
  name: string
  description: string
  depth: 'front' | 'middle' | 'back'
}

// ==================== Refs ====================
const parallaxRef = ref<HTMLElement>()
const spaceBgRef = ref<HTMLElement>()
const sceneRef = ref<HTMLElement>()
const backLayerRef = ref<HTMLElement>()
const middleLayerRef = ref<HTMLElement>()
const frontLayerRef = ref<HTMLElement>()
const coreRef = ref<HTMLElement>()

const partRefs = ref<Map<string, HTMLElement>>(new Map())
const setPartRef = (el: any, key: string) => {
  if (el) partRefs.value.set(key, el)
}

// ==================== 状态 ====================
const scrollProgress = ref(0)
const selectedPart = ref<PartData | null>(null)
const phase = ref<'idle' | 'entry' | 'display' | 'exit'>('idle')

const phaseLabel = computed(() => {
  const labels = { idle: 'PARALLAX STATUS', entry: 'ENTRY', display: 'DISPLAY', exit: 'EXIT' }
  return labels[phase.value]
})

// ==================== 主图片 ====================
const mainImage = reactive({
  url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1920&q=80',
  title: '星际核心'
})

// ==================== 零件数据 ====================
const frontParts = reactive<PartData[]>([
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&q=80',
    name: '前沿舱',
    description: '星际飞船的前端护盾系统，配备高能粒子偏转装置，确保穿越小行星带时的安全',
    depth: 'front'
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80',
    name: '能量核心',
    description: '可控核聚变动力源，提供持续推进能量，可支持星际航行数百年',
    depth: 'front'
  }
])

const middleParts = reactive<PartData[]>([
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&q=80',
    name: '主体框架',
    description: '钛合金复合结构，确保整体稳定性与结构完整性',
    depth: 'middle'
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=400&q=80',
    name: '推进系统',
    description: '离子推进引擎，支持亚光速星际航行与轨道调整',
    depth: 'middle'
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&q=80',
    name: '通信阵列',
    description: '量子通信模块，实现跨维度实时联络与数据传输',
    depth: 'middle'
  }
])

const backParts = reactive<PartData[]>([
  {
    id: 6,
    url: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=400&q=80',
    name: '尾翼稳定器',
    description: '星际流体动力学设计，稳定飞行轨迹与姿态控制',
    depth: 'back'
  },
  {
    id: 7,
    url: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=400&q=80',
    name: '观察窗',
    description: '纳米级透明材质，抵御宇宙射线与微陨石撞击',
    depth: 'back'
  },
  {
    id: 8,
    url: 'https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=400&q=80',
    name: '辅助引擎',
    description: '化学推进备份系统，用于紧急机动与降落操作',
    depth: 'back'
  }
])

// ==================== 动画清理 ====================
let cleanupFns: Array<() => void> = []
let mainTl: gsap.core.Timeline | null = null
let mouseMoveTweenX: gsap.core.Tween | null = null
let mouseMoveTweenY: gsap.core.Tween | null = null
let currentRotateX = 0
let currentRotateY = 0

// ==================== 初始化动画 ====================
function initAnimation() {
  const container = parallaxRef.value
  const scene = sceneRef.value
  const core = coreRef.value

  if (!container || !scene) return

  // 初始化零件状态
  const allParts = partRefs.value
  allParts.forEach((el) => {
    gsap.set(el, { scale: 0, opacity: 0, y: 100 })
  })

  if (core) {
    gsap.set(core, { scale: 0, opacity: 0 })
  }

  gsap.set('.space-particle', { scale: 0, opacity: 0 })

  // ========== 创建 ScrollTrigger 时间线 ==========
  mainTl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top 100%',
      end: 'bottom -100%',
      scrub: 1.5,
      anticipatePin: 1,
      toggleActions: 'play reverse play reverse',
      onUpdate: (self) => {
        scrollProgress.value = self.progress * 100

        if (self.progress < 0.25) {
          phase.value = 'entry'
        } else if (self.progress < 0.7) {
          phase.value = 'display'
        } else {
          phase.value = 'exit'
        }
      }
    }
  })

  // ========== 入场阶段 (0-25%) ==========
  // 背景星星
  mainTl.to('.space-particle', {
    scale: 1,
    opacity: 0.7,
    duration: 0.08,
    stagger: { each: 0.005, from: 'random' },
    ease: 'power2.in'
  }, 0)

  // 远景层
  const backEls = Array.from(allParts.entries())
    .filter(([key]) => key.startsWith('back'))
    .map(([, el]) => el)

  mainTl.to(backEls, {
    scale: 1,
    opacity: 0.5,
    y: 0,
    duration: 0.1,
    stagger: 0.05,
    ease: 'power3.out'
  }, 0.05)

  // 中景层
  const middleEls = Array.from(allParts.entries())
    .filter(([key]) => key.startsWith('middle'))
    .map(([, el]) => el)

  mainTl.to(middleEls, {
    scale: 1,
    opacity: 0.75,
    y: 0,
    duration: 0.08,
    stagger: 0.04,
    ease: 'power3.out'
  }, 0.1)

  // 前景层
  const frontEls = Array.from(allParts.entries())
    .filter(([key]) => key.startsWith('front'))
    .map(([, el]) => el)

  mainTl.to(frontEls, {
    scale: 1,
    opacity: 1,
    y: 0,
    duration: 0.06,
    stagger: 0.03,
    ease: 'power3.out'
  }, 0.15)

  // 中心核心
  mainTl.to(core, {
    scale: 1,
    opacity: 1,
    duration: 0.1,
    ease: 'elastic.out(1, 0.6)'
  }, 0.2)

  // ========== 展示阶段 (25-70%) ==========
  // 垂直视差 - 远景
  mainTl.to(backEls, {
    y: -80,
    duration: 0.5,
    ease: 'none'
  }, 0.25)

  // 垂直视差 - 中景
  mainTl.to(middleEls, {
    y: -150,
    duration: 0.5,
    ease: 'none'
  }, 0.25)

  // 垂直视差 - 前景
  mainTl.to(frontEls, {
    y: -220,
    duration: 0.5,
    ease: 'none'
  }, 0.25)

  // 核心脉冲
  mainTl.fromTo(core,
    { scale: 1 },
    { scale: 1.08, duration: 0.2, yoyo: true, repeat: 2 },
    0.4
  )

  // ========== 离场阶段 (70-100%) ==========
  // 前景后退消失
  mainTl.to(frontEls, {
    y: -400,
    scale: 0.5,
    opacity: 0,
    duration: 0.15,
    stagger: 0.02,
    ease: 'power2.in'
  }, 0.7)

  // 中景后退消失
  mainTl.to(middleEls, {
    y: -300,
    scale: 0.4,
    opacity: 0,
    filter: 'blur(5px)',
    duration: 0.12,
    stagger: 0.02,
    ease: 'power2.in'
  }, 0.75)

  // 远景后退消失
  mainTl.to(backEls, {
    y: -200,
    scale: 0.3,
    opacity: 0,
    filter: 'blur(8px)',
    duration: 0.1,
    stagger: 0.02,
    ease: 'power2.in'
  }, 0.8)

  // 核心消失
  mainTl.to(core, {
    scale: 0,
    opacity: 0,
    filter: 'blur(10px)',
    duration: 0.1,
    ease: 'power2.in'
  }, 0.85)

  // 星星消失
  mainTl.to('.space-particle', {
    scale: 0,
    opacity: 0,
    duration: 0.08,
    stagger: { each: 0.003, from: 'random' },
    ease: 'power2.in'
  }, 0.9)

  // 保存清理
  cleanupFns.push(() => {
    if (mainTl) mainTl.kill()
    ScrollTrigger.getAll().forEach(st => {
      if (st.vars.trigger === container) st.kill()
    })
  })
}

// ==================== 悬浮动画 ====================
function initFloatAnimations() {
  const allParts = partRefs.value

  allParts.forEach((el, key) => {
    const depth = key.split('-')[0]
    const floatY = depth === 'front' ? 25 : depth === 'middle' ? 18 : 12
    const floatDuration = 3 + Math.random() * 2

    // 呼吸浮动
    gsap.to(el, {
      y: `+=${floatY}`,
      duration: floatDuration,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })

    // 自转
    if (depth !== 'back') {
      gsap.to(el, {
        rotation: `+=${depth === 'front' ? 12 : 8}`,
        duration: 10 + Math.random() * 5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })
    }
  })

  // 核心脉冲
  if (coreRef.value) {
    gsap.to(coreRef.value, {
      scale: 1.05,
      filter: 'brightness(1.1)',
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
  }

  // 背景闪烁
  gsap.to('.space-particle', {
    scale: () => 0.5 + Math.random() * 0.8,
    opacity: () => 0.3 + Math.random() * 0.4,
    duration: () => 1.5 + Math.random() * 2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    stagger: { each: 0.03, from: 'random' }
  })
}

// ==================== 鼠标视差 ====================
function initMouseParallax() {
  const scene = sceneRef.value
  if (!scene) return

  const handleMouseMove = (e: MouseEvent) => {
    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2

    const targetRotateY = ((e.clientX - centerX) / centerX) * 10
    const targetRotateX = ((e.clientY - centerY) / centerY) * -6

    if (mouseMoveTweenX) mouseMoveTweenX.kill()
    if (mouseMoveTweenY) mouseMoveTweenY.kill()

    mouseMoveTweenX = gsap.to({ val: currentRotateX }, {
      val: targetRotateX,
      duration: 0.8,
      ease: 'power2.out',
      onUpdate: function() {
        currentRotateX = (this.targets()[0] as any).val
        scene.style.transform = `rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`
      }
    })

    mouseMoveTweenY = gsap.to({ val: currentRotateY }, {
      val: targetRotateY,
      duration: 0.8,
      ease: 'power2.out',
      onUpdate: function() {
        currentRotateY = (this.targets()[0] as any).val
        scene.style.transform = `rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`
      }
    })
  }

  scene.addEventListener('mousemove', handleMouseMove)

  cleanupFns.push(() => {
    scene.removeEventListener('mousemove', handleMouseMove)
  })
}

// ==================== 点击交互 ====================
function handlePartClick(part: PartData, layer: string, index: number) {
  const scene = sceneRef.value
  const partEl = partRefs.value.get(`${layer}-${index}`)
  const allParts = partRefs.value

  if (!partEl || !scene) return

  selectedPart.value = part

  // 选中零件
  gsap.to(partEl, {
    scale: 1.8,
    filter: 'brightness(1.3) drop-shadow(0 0 30px rgba(0, 240, 255, 0.8))',
    duration: 0.5,
    ease: 'power2.out'
  })

  // 其他零件虚化
  allParts.forEach((el, key) => {
    if (key !== `${layer}-${index}`) {
      gsap.to(el, {
        scale: 0.7,
        filter: 'blur(10px) brightness(0.4)',
        opacity: 0.3,
        duration: 0.4,
        ease: 'power2.out'
      })
    }
  })

  // 核心虚化
  if (coreRef.value) {
    gsap.to(coreRef.value, {
      scale: 0.6,
      filter: 'blur(8px)',
      opacity: 0.3,
      duration: 0.4,
      ease: 'power2.out'
    })
  }
}

// ==================== 关闭详情 ====================
function closeDetail() {
  const allParts = partRefs.value

  allParts.forEach((el, key) => {
    const layer = key.split('-')[0]
    gsap.to(el, {
      scale: 1,
      filter: 'none',
      opacity: layer === 'front' ? 1 : layer === 'middle' ? 0.75 : 0.5,
      duration: 0.5,
      ease: 'power2.out'
    })
  })

  if (coreRef.value) {
    gsap.to(coreRef.value, {
      scale: 1,
      filter: 'none',
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out'
    })
  }

  selectedPart.value = null
}

// ==================== 生命周期 ====================
onMounted(async () => {
  await nextTick()

  setTimeout(() => {
    initAnimation()
    initFloatAnimations()
    initMouseParallax()
  }, 100)
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  cleanupFns = []
  ScrollTrigger.getAll().forEach(st => st.kill())
  if (mouseMoveTweenX) mouseMoveTweenX.kill()
  if (mouseMoveTweenY) mouseMoveTweenY.kill()
  gsap.killTweensOf('*')
  if (parallaxRef.value) {
    gsap.set(parallaxRef.value, { clearProps: 'all' })
  }
})
</script>

<style lang="scss" scoped>
// ==================== 变量 ====================
$parallax-cyan: #00f0ff;
$parallax-gold: #ffd700;
$parallax-purple: #9966ff;
$parallax-dark: #0a0a12;

$front-size: 160px;
$middle-size: 130px;
$back-size: 100px;

// ==================== 主容器 ====================
.parallax-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(180deg, $parallax-dark 0%, #050508 100%);
  font-family: 'Orbitron', 'Rajdhani', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 2000px;
}

// ==================== 深空背景 ====================
.space-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.space-particle {
  position: absolute;
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;

  @for $i from 1 through 120 {
    &:nth-child(#{$i}) {
      left: random(100) * 1%;
      top: random(100) * 1%;
      opacity: random(60) * 1%;
    }
  }
}

.nebula {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  pointer-events: none;

  &.nebula-1 {
    width: 800px;
    height: 800px;
    left: -20%;
    top: 10%;
    background: radial-gradient(circle, rgba($parallax-purple, 0.12) 0%, transparent 70%);
  }

  &.nebula-2 {
    width: 600px;
    height: 600px;
    right: -15%;
    bottom: 5%;
    background: radial-gradient(circle, rgba($parallax-cyan, 0.08) 0%, transparent 70%);
  }

  &.nebula-3 {
    width: 500px;
    height: 500px;
    left: 30%;
    bottom: -10%;
    background: radial-gradient(circle, rgba($parallax-gold, 0.06) 0%, transparent 70%);
  }
}

// ==================== 3D 场景 ====================
.scene-container {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transform: rotateX(0deg) rotateY(0deg);
}

// ==================== 层级 ====================
.layer {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-style: preserve-3d;
}

.layer-back {
  transform: translateZ(-300px) scale(0.6);
  filter: blur(6px);
}

.layer-middle {
  transform: translateZ(0px) scale(0.85);
  filter: blur(2px);
}

.layer-front {
  transform: translateZ(200px) scale(1.1);
}

// ==================== 零件 ====================
.part-wrapper {
  position: absolute;
  transform-style: preserve-3d;

  &.part-clickable {
    cursor: pointer;
  }

  .layer-front & { width: $front-size; height: $front-size; }
  .layer-middle & { width: $middle-size; height: $middle-size; }
  .layer-back & { width: $back-size; height: $back-size; }
}

.part-ring {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;

  &.ring-outer {
    inset: -20px;
    border: 1px solid rgba($parallax-gold, 0.2);
    animation: ringRotate 12s linear infinite;
  }

  &.ring-inner {
    inset: -10px;
    border: 1px solid rgba($parallax-cyan, 0.3);
    animation: ringRotate 8s linear infinite reverse;
  }
}

@keyframes ringRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.part-frame {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba($parallax-cyan, 0.4);
  box-shadow:
    0 0 30px rgba($parallax-cyan, 0.3),
    inset 0 0 30px rgba($parallax-cyan, 0.1);
}

.part-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.part-glow {
  position: absolute;
  inset: -30px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba($parallax-cyan, 0.15) 0%, transparent 70%);
  pointer-events: none;
}

.part-label {
  position: absolute;
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  letter-spacing: 2px;
  color: rgba(white, 0.5);
  text-transform: uppercase;
  white-space: nowrap;
  text-shadow: 0 0 15px rgba($parallax-cyan, 0.6);
}

// ==================== 中心核心 ====================
.core-container {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 280px;
  height: 280px;
  transform-style: preserve-3d;
}

.core-outer {
  position: absolute;
  inset: -50px;
  border-radius: 50%;
  border: 2px solid rgba($parallax-gold, 0.3);
  animation: corePulse 4s ease-in-out infinite;

  &::before {
    content: '';
    position: absolute;
    inset: -30px;
    border-radius: 50%;
    border: 1px solid rgba($parallax-cyan, 0.2);
  }

  &::after {
    content: '';
    position: absolute;
    inset: -70px;
    border-radius: 50%;
    border: 1px dashed rgba($parallax-purple, 0.2);
    animation: coreRotate 30s linear infinite;
  }
}

.core-middle {
  position: absolute;
  inset: -30px;
  border-radius: 50%;
  border: 1px solid rgba($parallax-cyan, 0.4);
  animation: corePulse 3s ease-in-out infinite reverse;
}

.core-inner {
  position: absolute;
  inset: -15px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba($parallax-gold, 0.2) 0%, transparent 70%);
}

@keyframes corePulse {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.15); opacity: 1; }
}

@keyframes coreRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.core-image-wrap {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid rgba($parallax-gold, 0.5);
  box-shadow:
    0 0 60px rgba($parallax-gold, 0.4),
    0 0 120px rgba($parallax-cyan, 0.2);
}

.core-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.core-shield {
  position: absolute;
  inset: -10px;
  border-radius: 50%;
  background: radial-gradient(circle, transparent 60%, rgba($parallax-cyan, 0.1) 100%);
  pointer-events: none;
}

.core-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.core-particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: $parallax-gold;
  border-radius: 50%;
  box-shadow: 0 0 8px $parallax-gold;

  @for $i from 1 through 24 {
    &:nth-child(#{$i}) {
      left: 50%;
      top: 50%;
      animation: orbit#{$i} #{4 + $i * 0.2}s linear infinite;
    }
  }
}

@for $i from 1 through 24 {
  @keyframes orbit#{$i} {
    from {
      transform: rotate(#{$i * 15}deg) translateX(#{$i * 6}px) scale(1);
    }
    to {
      transform: rotate(#{$i * 15 + 360}deg) translateX(#{$i * 6}px) scale(0.4);
    }
  }
}

// ==================== 指示器 ====================
.parallax-indicator {
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 15px;
  z-index: 30;
}

.indicator-label {
  font-size: 10px;
  letter-spacing: 3px;
  color: rgba(white, 0.4);
  text-transform: uppercase;
}

.indicator-bar {
  width: 150px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.indicator-fill {
  height: 100%;
  background: linear-gradient(90deg, $parallax-cyan, $parallax-gold);
  border-radius: 2px;
  transition: width 0.1s ease;
  box-shadow: 0 0 15px rgba($parallax-cyan, 0.6);
}

.indicator-value {
  font-size: 14px;
  font-weight: 700;
  color: $parallax-gold;
  font-family: 'Orbitron', sans-serif;
  min-width: 45px;
  text-align: right;
}

// ==================== 详情面板 ====================
.detail-panel {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.92);
  backdrop-filter: blur(25px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  cursor: pointer;
}

.detail-content {
  position: relative;
  max-width: 550px;
  width: 90%;
  cursor: default;
}

.detail-close {
  position: absolute;
  top: -55px;
  right: 0;
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: rotate(90deg);
  }
}

.detail-image-wrap {
  border-radius: 20px;
  overflow: hidden;
  border: 2px solid rgba($parallax-cyan, 0.3);
  box-shadow: 0 30px 100px rgba(0, 0, 0, 0.6);
}

.detail-image {
  width: 100%;
  height: 280px;
  object-fit: cover;
}

.detail-info {
  margin-top: 30px;
  text-align: center;
}

.detail-title {
  font-size: 26px;
  font-weight: 700;
  color: white;
  margin: 0 0 15px;
  letter-spacing: 4px;
  text-shadow: 0 0 30px rgba($parallax-cyan, 0.5);
}

.detail-desc {
  font-size: 14px;
  color: rgba(white, 0.7);
  line-height: 1.8;
  margin: 0;
}

// ==================== 过渡 ====================
.detail-enter-active,
.detail-leave-active {
  transition: opacity 0.4s ease;
}

.detail-enter-from,
.detail-leave-to {
  opacity: 0;
}

// ==================== 响应式 ====================
@media (max-width: 1000px) {
  $front-size: 130px;
  $middle-size: 100px;
  $back-size: 75px;

  .layer-front .part-wrapper { width: $front-size; height: $front-size; }
  .layer-middle .part-wrapper { width: $middle-size; height: $middle-size; }
  .layer-back .part-wrapper { width: $back-size; height: $back-size; }

  .core-container { width: 200px; height: 200px; }
  .part-label { display: none; }
}

@media (max-width: 600px) {
  $front-size: 100px;
  $middle-size: 80px;
  $back-size: 60px;

  .layer-front .part-wrapper { width: $front-size; height: $front-size; }
  .layer-middle .part-wrapper { width: $middle-size; height: $middle-size; }
  .layer-back .part-wrapper { width: $back-size; height: $back-size; }

  .core-container { width: 150px; height: 150px; }
  .core-outer { inset: -30px; }
  .core-middle { inset: -20px; }
  .core-inner { inset: -10px; }

  .parallax-indicator {
    bottom: 25px;
    gap: 10px;
  }

  .indicator-bar { width: 80px; }
}
</style>
