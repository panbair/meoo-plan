<template>
  <section ref="vortexRef" class="vortex-section">
    <!-- 深空粒子背景 -->
    <div class="vortex-bg">
      <div
        v-for="i in 40"
        :key="i"
        :ref="el => setParticleRef(el, i)"
        class="bg-particle"
      ></div>
      <div class="bg-nebula"></div>
      <div class="bg-vortex-ring"></div>
    </div>

    <!-- 漩涡容器 -->
    <div ref="vortexContainerRef" class="vortex-container">
      <!-- 图片展示层 -->
      <div
        v-for="(img, i) in vortexImages"
        :key="img.id"
        :ref="el => setLayerRef(el, i)"
        class="image-card"
      >
        <div class="card-inner">
          <img :src="img.url" :alt="img.title" class="card-image" />
          <div class="card-overlay">
            <div class="card-content">
              <span class="card-number">{{ String(i + 1).padStart(2, '0') }}</span>
              <h3 class="card-title">{{ img.title }}</h3>
              <p class="card-desc">{{ img.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 螺旋粒子效果 -->
      <div ref="particleLayerRef" class="particle-layer">
        <div
          v-for="i in 20"
          :key="`particle-${i}`"
          :ref="el => setVortexParticleRef(el, i)"
          class="vortex-particle"
        ></div>
      </div>
    </div>

    <!-- 漩涡核心光晕 -->
    <div ref="coreGlowRef" class="core-glow"></div>

    <!-- 进度指示器 -->
    <div ref="progressRef" class="vortex-progress">
      <span class="progress-label">DEPTH</span>
      <span class="progress-value">{{ Math.round(scrollDepth) }}%</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ==================== 类型定义 ====================
interface VortexImage {
  id: number
  url: string
  title: string
  description: string
}

// ==================== Refs ====================
const vortexRef = ref<HTMLElement>()
const vortexContainerRef = ref<HTMLElement>()
const coreGlowRef = ref<HTMLElement>()
const particleLayerRef = ref<HTMLElement>()
const progressRef = ref<HTMLElement>()

const layerRefs = ref<HTMLElement[]>([])
const particleRefs = ref<HTMLElement[]>([])
const bgParticleRefs = ref<HTMLElement[]>([])

const setParticleRef = (el: any, i: number) => { if (el) bgParticleRefs.value[i - 1] = el }
const setLayerRef = (el: any, i: number) => { if (el) layerRefs.value[i] = el }
const setVortexParticleRef = (el: any, i: number) => { if (el) particleRefs.value[i - 1] = el }

// ==================== 状态 ====================
const scrollDepth = ref(0)

// ==================== 漩涡图片数据 ====================
const vortexImages = reactive<VortexImage[]>([
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=85',
    title: '永恒峰峦',
    description: '穿越时空的巍峨巅峰'
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=85',
    title: '极光幻境',
    description: '宇宙深处的绚烂光辉'
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&q=85',
    title: '星河漩涡',
    description: '亿万星辰的永恒舞蹈'
  }
])

// ==================== 动画清理 ====================
let cleanupFns: Array<() => void> = []

function initVortexAnimation() {
  const vortex = vortexRef.value
  const container = vortexContainerRef.value
  const coreGlow = coreGlowRef.value

  if (!vortex || !container) return

  const allLayers = layerRefs.value.filter(Boolean)
  const allParticles = particleRefs.value.filter(Boolean)
  const allBgParticles = bgParticleRefs.value.filter(Boolean)

  // ========== 1. 初始状态设置 ==========
  gsap.set(container, {
    transformStyle: 'preserve-3d',
    transformOrigin: 'center center'
  })

  // 图片初始状态 - 中心聚集
  allLayers.forEach((layer, i) => {
    gsap.set(layer, {
      position: 'absolute',
      left: '50%',
      top: '50%',
      xPercent: -50,
      yPercent: -50,
      scale: 0.2,
      opacity: 0,
      rotation: 0,
      z: -150 + i * 30,
      transformStyle: 'preserve-3d'
    })
  })

  // 背景粒子初始
  allBgParticles.forEach((particle) => {
    gsap.set(particle, {
      x: 0,
      y: 0,
      scale: 0,
      opacity: 0
    })
  })

  // 漩涡粒子初始
  allParticles.forEach((particle, i) => {
    const angle = (i / allParticles.length) * Math.PI * 2
    gsap.set(particle, {
      x: Math.cos(angle) * 20,
      y: Math.sin(angle) * 20,
      scale: 0,
      opacity: 0
    })
  })

  // ========== 2. 创建主时间线 ==========
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: vortex,
      start: 'top 100%',
      end: 'bottom -100%',
      scrub: 2,
      anticipatePin: 1,
      toggleActions: 'play reverse play reverse',
      onUpdate: (self) => {
        scrollDepth.value = self.progress * 100
      }
    }
  })

  // 阶段A: 背景粒子聚合
  tl.to(allBgParticles, {
    scale: 1,
    opacity: 0.8,
    duration: 0.25,
    ease: 'power2.in'
  }, 0)

  // 阶段B: 漩涡粒子螺旋扩散
  tl.to(allParticles, {
    x: (i) => {
      const angle = (i / allParticles.length) * Math.PI * 4
      return Math.cos(angle) * (window.innerWidth * 0.4)
    },
    y: (i) => {
      const angle = (i / allParticles.length) * Math.PI * 4
      return Math.sin(angle) * (window.innerWidth * 0.4)
    },
    scale: 1,
    opacity: 0.6,
    rotation: 720,
    duration: 0.4,
    stagger: 0.03,
    ease: 'power3.out'
  }, 0)

  // 阶段C: 图片螺旋展开
  const cardWidth = 500
  const cardHeight = 320
  const gap = 80

  allLayers.forEach((layer, i) => {
    const positions = [
      { x: -cardWidth - gap / 2, y: 0 },      // 左
      { x: 0, y: 0 },                          // 中
      { x: cardWidth + gap / 2, y: 0 }         // 右
    ]
    const pos = positions[i] || positions[1]

    tl.to(layer, {
      xPercent: -50,
      yPercent: -50,
      x: pos.x,
      y: pos.y,
      scale: 1,
      opacity: 1,
      rotation: 0,
      z: 0,
      filter: 'brightness(1) saturate(1)',
      duration: 0.35,
      ease: 'power4.out'
    }, 0.1 + i * 0.08)
  })

  // ========== 3. 核心光晕动画 ==========
  if (coreGlow) {
    gsap.to(coreGlow, {
      scale: 2,
      opacity: 0.6,
      rotation: 360,
      duration: 6,
      repeat: -1,
      ease: 'none'
    })
    cleanupFns.push(() => gsap.killTweensOf(coreGlow))
  }

  // ========== 4. 入场淡入 ==========
  gsap.fromTo(vortex, {
    opacity: 0
  }, {
    opacity: 1,
    duration: 0.8,
    ease: 'power2.out'
  })

  // 保存清理函数
  cleanupFns.push(() => {
    tl.kill()
    ScrollTrigger.getAll().forEach(st => st.kill())
  })
}

// ==================== 生命周期 ====================
onMounted(async () => {
  await nextTick()
  setTimeout(() => {
    initVortexAnimation()
  }, 100)
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  cleanupFns = []
  ScrollTrigger.getAll().forEach(st => st.kill())
  gsap.killTweensOf('*')
  if (vortexRef.value) {
    gsap.set(vortexRef.value, { clearProps: 'all' })
  }
})
</script>

<style lang="scss" scoped>
// ==================== 变量 ====================
$vortex-cyan: #00f2fe;
$vortex-magenta: #ff00ff;
$vortex-purple: #764ba2;
$vortex-dark: #0a0a1a;

// ==================== 主容器 ====================
.vortex-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0a1a2a 100%);
  font-family: 'Rajdhani', 'Orbitron', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
}

// ==================== 深空背景 ====================
.vortex-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.bg-particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: white;
  border-radius: 50%;
  left: 50%;
  top: 50%;
}

.bg-nebula {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 20% 30%, rgba($vortex-cyan, 0.15) 0%, transparent 40%),
    radial-gradient(ellipse at 80% 70%, rgba($vortex-magenta, 0.12) 0%, transparent 40%),
    radial-gradient(ellipse at 50% 50%, rgba($vortex-purple, 0.1) 0%, transparent 50%);
  animation: nebulaPulse 8s ease-in-out infinite;
}

@keyframes nebulaPulse {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
}

.bg-vortex-ring {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 300px;
  height: 300px;
  border: 1px solid rgba($vortex-cyan, 0.15);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: vortexRotate 20s linear infinite;

  &::before, &::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border: 1px solid rgba($vortex-magenta, 0.1);
    border-radius: 50%;
  }

  &::before {
    width: 500px;
    height: 500px;
    animation: vortexRotate 30s linear infinite reverse;
  }

  &::after {
    width: 700px;
    height: 700px;
    animation: vortexRotate 40s linear infinite;
  }
}

@keyframes vortexRotate {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

// ==================== 漩涡核心光晕 ====================
.core-glow {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 150px;
  height: 150px;
  background: radial-gradient(
    circle,
    rgba($vortex-cyan, 0.4) 0%,
    rgba($vortex-magenta, 0.2) 40%,
    transparent 70%
  );
  border-radius: 50%;
  transform: translate(-50%, -50%);
  filter: blur(30px);
  pointer-events: none;
  z-index: 5;
}

// ==================== 漩涡容器 ====================
.vortex-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1500px;
  z-index: 10;
}

// ==================== 图片卡片 ====================
.image-card {
  position: absolute;
  transform-style: preserve-3d;
  will-change: transform, opacity, filter;
}

.card-inner {
  width: 500px;
  height: 320px;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  box-shadow:
    0 30px 80px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  transform-style: preserve-3d;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 16px;
    padding: 2px;
    background: linear-gradient(
      135deg,
      rgba($vortex-cyan, 0.5),
      transparent 50%,
      rgba($vortex-magenta, 0.5)
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
    z-index: 10;
  }
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.2) 40%,
    transparent 100%
  );
  display: flex;
  align-items: flex-end;
  padding: 30px;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.card-inner:hover .card-overlay {
  opacity: 1;
}

.card-inner:hover .card-image {
  transform: scale(1.05);
}

.card-content {
  color: white;
}

.card-number {
  font-size: 48px;
  font-weight: 700;
  font-family: 'Orbitron', sans-serif;
  color: rgba($vortex-cyan, 0.8);
  text-shadow: 0 0 30px rgba($vortex-cyan, 0.5);
  display: block;
  line-height: 1;
  margin-bottom: 10px;
}

.card-title {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 6px;
  text-transform: uppercase;
  margin: 0 0 8px;
  text-shadow: 0 0 20px rgba(white, 0.3);
}

.card-desc {
  font-size: 14px;
  color: rgba(white, 0.7);
  margin: 0;
  letter-spacing: 2px;
  font-style: italic;
}

// ==================== 粒子层 ====================
.particle-layer {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 15;
}

.vortex-particle {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: $vortex-cyan;
  box-shadow: 0 0 15px $vortex-cyan, 0 0 30px rgba($vortex-cyan, 0.5);
  transform-style: preserve-3d;
}

// ==================== 进度指示器 ====================
.vortex-progress {
  position: absolute;
  bottom: 40px;
  right: 40px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  z-index: 30;
}

.progress-label {
  font-size: 10px;
  letter-spacing: 4px;
  color: rgba(white, 0.4);
  text-transform: uppercase;
  font-family: 'Courier New', monospace;
}

.progress-value {
  font-size: 36px;
  font-weight: 700;
  color: $vortex-cyan;
  font-family: 'Orbitron', sans-serif;
  text-shadow: 0 0 20px rgba($vortex-cyan, 0.6);
  line-height: 1;
}

// ==================== 响应式 ====================
@media (max-width: 1200px) {
  .card-inner {
    width: 400px;
    height: 260px;
  }

  .card-title {
    font-size: 22px;
  }

  .card-number {
    font-size: 36px;
  }
}

@media (max-width: 900px) {
  .card-inner {
    width: 320px;
    height: 210px;
  }

  .card-title {
    font-size: 18px;
    letter-spacing: 3px;
  }

  .card-number {
    font-size: 28px;
  }

  .card-desc {
    font-size: 12px;
  }

  .vortex-progress {
    bottom: 25px;
    right: 25px;
  }

  .progress-value {
    font-size: 28px;
  }
}

@media (max-width: 600px) {
  .card-inner {
    width: 260px;
    height: 170px;
  }

  .card-title {
    font-size: 16px;
    letter-spacing: 2px;
  }

  .card-number {
    font-size: 24px;
  }

  .card-desc {
    display: none;
  }

  .card-overlay {
    padding: 15px;
  }
}
</style>
