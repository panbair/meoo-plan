<template>
  <section ref="stardustRef" class="stardust-section">
    <!-- 状态指示器 -->
    <div ref="indicatorRef" class="stardust-indicator">
      <span class="indicator-label">{{ phaseLabel }}</span>
      <div class="indicator-bar">
        <div class="indicator-fill" :style="{ width: `${scrollProgress}%` }"></div>
      </div>
      <span class="indicator-value">{{ Math.round(scrollProgress) }}%</span>
    </div>

    <!-- 星空背景 -->
    <div ref="starsBgRef" class="stars-bg">
      <div v-for="i in 80" :key="`bg-star-${i}`" class="bg-star"></div>
    </div>

    <!-- 星尘粒子容器 -->
    <div ref="particleContainerRef" class="particle-container">
      <div
        v-for="(particle, i) in particles"
        :key="`particle-${i}`"
        :ref="el => setParticleRef(el, i)"
        class="stardust-particle"
        :style="{
          '--particle-color': particle.color,
          width: `${particle.size}px`,
          height: `${particle.size}px`
        }"
      ></div>
    </div>

    <!-- 聚合成品图片 -->
    <div ref="rebuiltImageRef" class="rebuilt-image">
      <img :src="mainImage.url" :alt="mainImage.title" class="final-image" />
      <div class="image-shimmer"></div>
    </div>

    <!-- 光晕层 -->
    <div ref="glowLayerRef" class="glow-layer">
      <div v-for="i in 5" :key="`glow-${i}`" class="glow-orb"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ==================== 类型定义 ====================
interface Particle {
  id: number
  x: number
  y: number
  targetX: number
  targetY: number
  color: string
  size: number
  depth: 'front' | 'middle' | 'back'
  delay: number
  duration: number
}

interface StardustImage {
  url: string
  title: string
}

// ==================== Refs ====================
const stardustRef = ref<HTMLElement>()
const particleContainerRef = ref<HTMLElement>()
const rebuiltImageRef = ref<HTMLElement>()
const glowLayerRef = ref<HTMLElement>()
const starsBgRef = ref<HTMLElement>()
const indicatorRef = ref<HTMLElement>()

const particleRefs = ref<HTMLElement[]>([])
const setParticleRef = (el: any, i: number) => { if (el) particleRefs.value[i] = el }

// ==================== 状态 ====================
const scrollProgress = ref(0)
const phase = ref<'idle' | 'assembly' | 'stable' | 'dispersion'>('idle')

const phaseLabel = computed(() => {
  const labels = {
    idle: 'STARDUST STATUS',
    assembly: 'ASSEMBLY',
    stable: 'STABLE',
    dispersion: 'DISPERSION'
  }
  return labels[phase.value]
})

// ==================== 主图片数据 ====================
const mainImage = reactive<StardustImage>({
  url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=85',
  title: '永恒峰峦'
})

// ==================== 粒子数据 ====================
const PARTICLE_COUNT = 500
const particles = reactive<Particle[]>([])

// ==================== 生成粒子 ====================
function generateParticles() {
  const container = particleContainerRef.value
  if (!container) return

  const containerWidth = window.innerWidth
  const containerHeight = window.innerHeight

  // 中心区域
  const centerX = containerWidth / 2
  const centerY = containerHeight / 2
  const imageWidth = 600
  const imageHeight = 400

  particles.length = 0

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    // 目标位置（图片区域内）
    const targetX = centerX - imageWidth / 2 + (i % 40) * (imageWidth / 40)
    const targetY = centerY - imageHeight / 2 + Math.floor(i / 40) * (imageHeight / 12.5)

    // 起始位置（屏幕外随机）
    const angle = Math.random() * Math.PI * 2
    const radius = Math.max(containerWidth, containerHeight) * (0.8 + Math.random() * 0.5)
    const startX = centerX + Math.cos(angle) * radius
    const startY = centerY + Math.sin(angle) * radius

    // 深度分层
    let depth: 'front' | 'middle' | 'back'
    const rand = Math.random()
    if (rand < 0.35) depth = 'front'
    else if (rand < 0.7) depth = 'middle'
    else depth = 'back'

    // 颜色（基于深度）
    const colors = {
      front: '#ffd700',
      middle: '#00f0ff',
      back: '#9966ff'
    }

    particles.push({
      id: i,
      x: startX,
      y: startY,
      targetX,
      targetY,
      color: colors[depth],
      size: depth === 'front' ? 6 : depth === 'middle' ? 4 : 3,
      depth,
      delay: Math.random() * 0.5,
      duration: 2 + Math.random()
    })
  }
}

// ==================== 初始化粒子动画 ====================
let mainTl: gsap.core.Timeline | null = null
let cleanupFns: Array<() => void> = []

function initParticleAnimation() {
  const container = stardustRef.value
  const particleContainer = particleContainerRef.value
  const rebuiltImage = rebuiltImageRef.value
  const starsBg = starsBgRef.value

  if (!container || !particleContainer) return

  const allParticles = particleRefs.value.filter(Boolean)

  // 隐藏重建图片
  if (rebuiltImage) {
    gsap.set(rebuiltImage, { opacity: 0 })
  }

  // 背景星星初始状态
  if (starsBg) {
    gsap.set('.bg-star', { scale: 0, opacity: 0 })
  }

  // 设置粒子初始位置（在屏幕外）
  allParticles.forEach((particle, i) => {
    const p = particles[i]
    if (!p) return

    gsap.set(particle, {
      x: p.x,
      y: p.y,
      scale: 0,
      opacity: 0
    })
  })

  // ========== 创建主时间线 ==========
  mainTl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top 120%',
      end: 'bottom 20%',
      scrub: 2,
      anticipatePin: 1,
      toggleActions: 'play reverse play reverse',
      onUpdate: (self) => {
        scrollProgress.value = self.progress * 100

        // 更新阶段
        if (self.progress < 0.4) {
          phase.value = 'assembly'
        } else if (self.progress < 0.6) {
          phase.value = 'stable'
        } else {
          phase.value = 'dispersion'
        }
      }
    }
  })

  // ========== 阶段1：进入 (0-40%) ==========
  // 星星出现
  mainTl.to('.bg-star', {
    scale: 1,
    opacity: 0.8,
    duration: 0.15,
    stagger: { each: 0.005, from: 'random' },
    ease: 'power2.in'
  }, 0)

  // 粒子聚合
  const frontParticles = allParticles.filter((_, i) => particles[i]?.depth === 'front')
  const middleParticles = allParticles.filter((_, i) => particles[i]?.depth === 'middle')
  const backParticles = allParticles.filter((_, i) => particles[i]?.depth === 'back')

  // 远景粒子（最慢）
  if (backParticles.length) {
    mainTl.to(backParticles, {
      x: (i: number) => particles[i]?.targetX || 0,
      y: (i: number) => particles[i]?.targetY || 0,
      scale: 1,
      opacity: 0.6,
      duration: 0.2,
      stagger: { each: 0.004, from: 'edges' },
      ease: 'power3.out'
    }, 0.05)
  }

  // 中景粒子
  if (middleParticles.length) {
    mainTl.to(middleParticles, {
      x: (i: number) => {
        const idx = allParticles.indexOf(middleParticles[i])
        return particles[idx]?.targetX || 0
      },
      y: (i: number) => {
        const idx = allParticles.indexOf(middleParticles[i])
        return particles[idx]?.targetY || 0
      },
      scale: 1,
      opacity: 0.8,
      duration: 0.18,
      stagger: { each: 0.003, from: 'center' },
      ease: 'power3.out'
    }, 0.1)
  }

  // 前景粒子（最快）
  if (frontParticles.length) {
    mainTl.to(frontParticles, {
      x: (i: number) => {
        const idx = allParticles.indexOf(frontParticles[i])
        return particles[idx]?.targetX || 0
      },
      y: (i: number) => {
        const idx = allParticles.indexOf(frontParticles[i])
        return particles[idx]?.targetY || 0
      },
      scale: 1,
      opacity: 1,
      duration: 0.15,
      stagger: { each: 0.002, from: 'center' },
      ease: 'power3.out'
    }, 0.15)
  }

  // 光晕出现
  mainTl.to('.glow-orb', {
    scale: 1,
    opacity: 0.3,
    duration: 0.15,
    stagger: 0.02,
    ease: 'power2.out'
  }, 0.1)

  // 图片显现
  mainTl.to(rebuiltImage, {
    opacity: 1,
    duration: 0.15,
    ease: 'power2.out'
  }, 0.25)

  // 粒子淡出
  mainTl.to(particleContainer, {
    opacity: 0,
    duration: 0.1,
    ease: 'power2.in'
  }, 0.35)

  // ========== 阶段2：稳定 (40-60%) ==========
  // 图片呼吸效果
  mainTl.fromTo(rebuiltImage,
    { scale: 1 },
    { scale: 1.02, duration: 0.1, yoyo: true, repeat: 1 },
    0.4
  )

  // ========== 阶段3：扩散 (60-100%) ==========
  // 星星消失
  mainTl.to('.bg-star', {
    scale: 0,
    opacity: 0,
    duration: 0.15,
    stagger: { each: 0.003, from: 'random' },
    ease: 'power2.out'
  }, 0.6)

  // 图片消失
  mainTl.to(rebuiltImage, {
    opacity: 0,
    scale: 1.1,
    duration: 0.2,
    ease: 'power2.in'
  }, 0.65)

  // 光晕消失
  mainTl.to('.glow-orb', {
    scale: 0,
    opacity: 0,
    duration: 0.15,
    stagger: 0.02,
    ease: 'power2.in'
  }, 0.7)

  // ========== 保存清理 ==========
  cleanupFns.push(() => {
    if (mainTl) mainTl.kill()
    ScrollTrigger.getAll().forEach(st => {
      if (st.vars.trigger === container) st.kill()
    })
  })
}

// ==================== 背景星星闪烁 ==========
function initStarAnimation() {
  gsap.to('.bg-star', {
    scale: () => 0.5 + Math.random() * 0.5,
    opacity: () => 0.3 + Math.random() * 0.5,
    duration: () => 1 + Math.random() * 2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    stagger: { each: 0.02, from: 'random' }
  })
}

// ==================== 生命周期 ====================
onMounted(async () => {
  await nextTick()

  // 生成粒子
  generateParticles()

  // 等待粒子生成后初始化动画
  setTimeout(() => {
    initParticleAnimation()
    initStarAnimation()
  }, 200)
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  cleanupFns = []
  ScrollTrigger.getAll().forEach(st => st.kill())
  gsap.killTweensOf('*')
  if (stardustRef.value) {
    gsap.set(stardustRef.value, { clearProps: 'all' })
  }
})
</script>

<style lang="scss" scoped>
// ==================== 变量 ====================
$stardust-gold: #ffd700;
$stardust-cyan: #00f0ff;
$stardust-violet: #9966ff;

// ==================== 主容器 ====================
.stardust-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: radial-gradient(ellipse at center, #0a0a15 0%, #000000 100%);
  font-family: 'Orbitron', 'Rajdhani', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
}

// ==================== 星空背景 ====================
.stars-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.bg-star {
  position: absolute;
  width: 3px;
  height: 3px;
  background: white;
  border-radius: 50%;

  @for $i from 1 through 80 {
    &:nth-child(#{$i}) {
      left: random(100) * 1%;
      top: random(100) * 1%;
    }
  }
}

// ==================== 粒子容器 ====================
.particle-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 10;
}

.stardust-particle {
  position: absolute;
  border-radius: 50%;
  background: var(--particle-color);
  box-shadow: 0 0 10px var(--particle-color);
}

// ==================== 重建图片 ====================
.rebuilt-image {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 15;
  pointer-events: none;
}

.final-image {
  max-width: 70%;
  max-height: 70%;
  object-fit: contain;
  border-radius: 8px;
  box-shadow:
    0 0 60px rgba($stardust-gold, 0.3),
    0 0 120px rgba($stardust-cyan, 0.15);
}

.image-shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.15) 50%,
    transparent 100%
  );
  transform: translateX(-100%);
  border-radius: 8px;
  pointer-events: none;
}

// ==================== 光晕层 ====================
.glow-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 5;
}

.glow-orb {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 200px;
  height: 200px;
  margin: -100px 0 0 -100px;
  background: radial-gradient(
    circle,
    rgba($stardust-gold, 0.3) 0%,
    rgba($stardust-cyan, 0.15) 40%,
    transparent 70%
  );
  border-radius: 50%;
  filter: blur(30px);

  @for $i from 1 through 5 {
    &:nth-child(#{$i}) {
      width: #{150 + $i * 30}px;
      height: #{150 + $i * 30}px;
      margin: #{-75 - $i * 15}px 0 0 #{-75 - $i * 15}px;
      opacity: 0.3 - $i * 0.05;
    }
  }
}

// ==================== 状态指示器 ====================
.stardust-indicator {
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
  font-family: 'Courier New', monospace;
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
  background: linear-gradient(90deg, $stardust-cyan, $stardust-gold);
  border-radius: 2px;
  transition: width 0.1s ease;
  box-shadow: 0 0 15px $stardust-gold;
}

.indicator-value {
  font-size: 14px;
  font-weight: 700;
  color: $stardust-gold;
  font-family: 'Orbitron', sans-serif;
  min-width: 45px;
  text-align: right;
}

// ==================== 响应式 ====================
@media (max-width: 900px) {
  .stardust-indicator {
    bottom: 30px;
  }

  .indicator-bar {
    width: 100px;
  }
}
</style>
