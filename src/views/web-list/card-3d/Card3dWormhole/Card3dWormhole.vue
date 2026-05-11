<template>
  <section ref="sectionRef" class="wormhole-section">
    <!-- 时空隧道背景 -->
    <div class="wormhole-bg">
      <!-- 隧道环 -->
      <div class="tunnel-rings">
        <div v-for="i in 12" :key="i" class="tunnel-ring" :style="getRingStyle(i)"></div>
      </div>

      <!-- 星云 -->
      <div class="nebula nebula-1"></div>
      <div class="nebula nebula-2"></div>
      <div class="nebula nebula-3"></div>

      <!-- 能量线 -->
      <div class="energy-lines">
        <div v-for="i in 8" :key="i" class="energy-line" :style="getLineStyle(i)"></div>
      </div>
    </div>

    <!-- 星空背景 -->
    <div class="starfield">
      <div
        v-for="i in 80"
        :key="i"
        :ref="el => { if (el) starRefs[i - 1] = el as HTMLElement }"
        class="star"
      ></div>
    </div>

    <!-- 标题区 -->
    <div ref="titleRef" class="wormhole-title">
      <span class="title-badge">WORMHOLE</span>
      <h2 class="title-text">时空隧道</h2>
      <p class="subtitle">4D Spiral · Space Penetration · Scroll Warp</p>
    </div>

    <!-- 时空隧道容器 -->
    <div ref="wormholeContainerRef" class="wormhole-container">
      <!-- 隧道核心 -->
      <div ref="wormholeCoreRef" class="wormhole-core">
        <!-- 时空卡片 -->
        <div
          v-for="(card, index) in spaceCards"
          :key="card.id"
          :ref="el => { if (el) cardRefs[index] = el as HTMLElement }"
          class="space-card"
        >
          <div class="card-inner">
            <!-- 时空背景 -->
            <div class="card-timeline-bg"></div>
            <div class="card-gradient" :style="{ background: card.gradient }"></div>

            <!-- 卡片内容 -->
            <div class="card-content">
              <div class="card-glow-orb" :style="{ background: card.color }"></div>
              <div class="card-icon" v-html="card.icon"></div>
              <h3 class="card-title">{{ card.title }}</h3>
              <p class="card-desc">{{ card.description }}</p>

              <!-- 时空坐标 -->
              <div class="space-coords">
                <span class="coord-label">SECTOR</span>
                <span class="coord-value">{{ card.sector }}</span>
              </div>
            </div>

            <!-- 时空边框 -->
            <div class="card-border" :style="{ borderColor: card.color }"></div>

            <!-- 穿越轨迹 -->
            <div class="warp-trail"></div>
          </div>
        </div>
      </div>

      <!-- 奇点中心 -->
      <div class="singularity-center">
        <div class="singularity-core"></div>
        <div class="singularity-ring"></div>
      </div>
    </div>

    <!-- 粒子效果 -->
    <canvas ref="particleCanvasRef" class="particle-canvas"></canvas>

    <!-- 滚动提示 -->
    <div ref="scrollTipRef" class="scroll-tip">
      <div class="tip-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" opacity="0.3"/>
          <circle cx="12" cy="12" r="6" opacity="0.5"/>
          <circle cx="12" cy="12" r="2"/>
        </svg>
      </div>
      <span class="tip-text">ENTER THE WORMHOLE</span>
    </div>

    <!-- 进度指示 -->
    <div ref="progressRef" class="warp-progress">
      <div class="progress-bar">
        <div ref="progressFillRef" class="progress-fill"></div>
      </div>
      <span class="progress-label">SPACE WARP {{ Math.round(warpProgress * 100) }}%</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ==================== 类型定义 ====================
interface SpaceCard {
  id: number
  title: string
  description: string
  icon: string
  gradient: string
  color: string
  sector: string
}

// ==================== Refs ====================
const sectionRef = ref<HTMLElement>()
const wormholeContainerRef = ref<HTMLElement>()
const wormholeCoreRef = ref<HTMLElement>()
const titleRef = ref<HTMLElement>()
const particleCanvasRef = ref<HTMLCanvasElement>()
const scrollTipRef = ref<HTMLElement>()
const progressRef = ref<HTMLElement>()
const progressFillRef = ref<HTMLElement>()
const cardRefs = ref<HTMLElement[]>([])
const starRefs = ref<HTMLElement[]>([])

// ==================== 状态 ====================
const warpProgress = ref(0)

const spaceCards = reactive<SpaceCard[]>([
  {
    id: 1,
    title: '阿尔卑斯星门',
    description: '穿越银河系的门户',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="8"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg>',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#764ba2',
    sector: 'ALP-7749'
  },
  {
    id: 2,
    title: '量子传送门',
    description: '超越光速的瞬间移动',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    color: '#f5576c',
    sector: 'QTM-3321'
  },
  {
    id: 3,
    title: '暗能量节点',
    description: '驱动宇宙膨胀的力量',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"/></svg>',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    color: '#00f2fe',
    sector: 'DNM-8890'
  },
  {
    id: 4,
    title: '引力透镜',
    description: '扭曲时空的光线折射',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/></svg>',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    color: '#fee140',
    sector: 'GRL-4455'
  },
  {
    id: 5,
    title: '维度裂缝',
    description: '连接多元宇宙的裂隙',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v18M3 12h18"/><path d="M6 6l12 12M18 6L6 18"/></svg>',
    gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    color: '#fbc2eb',
    sector: 'DIM-6677'
  },
  {
    id: 6,
    title: '真空零点',
    description: '量子涨落的虚空领域',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6" stroke-dasharray="2 2"/><circle cx="12" cy="12" r="2"/></svg>',
    gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    color: '#a855f7',
    sector: 'ZP-0012'
  },
  {
    id: 7,
    title: '宇宙弦',
    description: '宇宙早期的拓扑缺陷',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4c4 4 4 12 8 12s4-8 8-12M4 20c4-4 4-12 8-12s4 8 8 12"/></svg>',
    gradient: 'linear-gradient(135deg, #ff6b6b 0%, #c44569 100%)',
    color: '#c44569',
    sector: 'STR-2233'
  },
  {
    id: 8,
    title: '虫洞端口',
    description: '时空折叠的快捷通道',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="12" rx="8" ry="3"/><ellipse cx="12" cy="12" rx="8" ry="3" transform="rotate(90 12 12)"/><circle cx="12" cy="12" r="2"/></svg>',
    gradient: 'linear-gradient(135deg, #feca57 0%, #ff9f43 100%)',
    color: '#ff9f43',
    sector: 'WH-9900'
  }
])

// ==================== 样式辅助函数 ====================
function getRingStyle(index: number) {
  const size = 100 + index * 60
  const delay = index * 0.15
  const duration = 3 + index * 0.3
  return {
    width: `${size}px`,
    height: `${size}px`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    opacity: 1 - index * 0.07
  }
}

function getLineStyle(index: number) {
  const angle = index * 45
  return {
    transform: `rotate(${angle}deg)`,
    animationDelay: `${index * 0.2}s`
  }
}

// ==================== 粒子系统 ====================
let particleCtx: CanvasRenderingContext2D | null = null
let particles: Array<{
  x: number
  y: number
  z: number
  vx: number
  vy: number
  vz: number
  size: number
  color: string
  alpha: number
}> = []
let particleAnimId: number | null = null

function initParticles() {
  const canvas = particleCanvasRef.value
  if (!canvas) return

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  particleCtx = canvas.getContext('2d')

  const colors = ['#764ba2', '#f5576c', '#00f2fe', '#fee140', '#a855f7', '#c44569']

  particles = Array.from({ length: 100 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    z: Math.random() * 300 - 150,
    vx: (Math.random() - 0.5) * 0.8,
    vy: (Math.random() - 0.5) * 0.8,
    vz: (Math.random() - 0.5) * 0.5,
    size: Math.random() * 4 + 1,
    color: colors[Math.floor(Math.random() * colors.length)],
    alpha: Math.random() * 0.6 + 0.2
  }))
}

function animateParticles(progress: number) {
  if (!particleCtx || !particleCanvasRef.value) return

  const canvas = particleCanvasRef.value
  particleCtx.clearRect(0, 0, canvas.width, canvas.height)

  particles.forEach(p => {
    p.x += p.vx * (1 + progress * 3)
    p.y += p.vy * (1 + progress * 3)
    p.z += p.vz

    if (p.z > 300 || p.z < -300) p.vz *= -1
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1

    const scale = 1 + p.z / 300
    const screenX = (p.x - canvas.width / 2) * scale + canvas.width / 2
    const screenY = (p.y - canvas.height / 2) * scale + canvas.height / 2

    particleCtx!.beginPath()
    particleCtx!.arc(screenX, screenY, p.size * Math.abs(scale), 0, Math.PI * 2)
    particleCtx!.fillStyle = p.color
    particleCtx!.globalAlpha = p.alpha * (1 - Math.abs(p.z) / 300)
    particleCtx!.fill()

    // 绘制轨迹
    if (progress > 0.1) {
      particleCtx!.beginPath()
      particleCtx!.moveTo(screenX, screenY)
      particleCtx!.lineTo(screenX - p.vx * 10, screenY - p.vy * 10)
      particleCtx!.strokeStyle = p.color
      particleCtx!.globalAlpha = p.alpha * 0.3
      particleCtx!.lineWidth = 1
      particleCtx!.stroke()
    }
  })

  particleCtx.globalAlpha = 1
}

function killParticles() {
  if (particleAnimId !== null) {
    cancelAnimationFrame(particleAnimId)
    particleAnimId = null
  }
}

// ==================== 动画控制 ====================
let scrollTriggers: ScrollTrigger[] = []

function initAnimations() {
  if (!sectionRef.value || !wormholeCoreRef.value || !cardRefs.value.length) return

  const core = wormholeCoreRef.value
  const cards = cardRefs.value

  // 开启超3D空间
  gsap.set(sectionRef.value, {
    perspective: 1400,
    transformStyle: 'preserve-3d'
  })

  gsap.set(core, {
    transformStyle: 'preserve-3d',
    transformOrigin: 'center center'
  })

  // 初始状态：时空奇点（卡片藏在深处）
  cards.forEach((card, i) => {
    gsap.set(card, {
      position: 'absolute',
      width: '260px',
      height: '320px',
      left: '50%',
      top: '50%',
      xPercent: -50,
      yPercent: -50,
      z: -1200,
      scale: 0,
      rotationX: 720,
      rotationY: 720,
      rotationZ: 720,
      opacity: 0,
      transformStyle: 'preserve-3d',
      transformOrigin: 'center center',
      force3D: true
    })
  })

  // ========== 8方向散开坐标预计算 ==========
  const spreadPatterns = [
    { x: 320, y: -200, rotZ: -15 },  // 右上
    { x: -320, y: -200, rotZ: 15 },   // 左上
    { x: 320, y: 200, rotZ: -20 },   // 右下
    { x: -320, y: 200, rotZ: 20 },   // 左下
    { x: 350, y: 0, rotZ: 10 },      // 正右
    { x: -350, y: 0, rotZ: -10 },    // 正左
    { x: 0, y: -240, rotZ: 5 },      // 正上
    { x: 0, y: 240, rotZ: -5 }       // 正下
  ]

  // ========== 为每张卡片创建独立滚动控制 ==========
  cards.forEach((card, i) => {
    const pattern = spreadPatterns[i % 8]
    const staggerDelay = i * 0.08  // 每张卡片延迟不同

    // 阶段1：穿透时空隧道
    const tl1 = gsap.timeline({ paused: true })
    tl1.to(card, {
      z: -300,
      scale: 0.3,
      opacity: 0.2,
      rotationX: 180,
      rotationY: 180,
      rotationZ: 180,
      duration: 0.6,
      ease: 'power2.in'
    })

    // 阶段2：空间炸裂飞出
    const tl2 = gsap.timeline({ paused: true })
    tl2.to(card, {
      z: 0,
      x: pattern.x,
      y: pattern.y,
      scale: 1,
      opacity: 1,
      rotationX: 0,
      rotationY: 0,
      rotationZ: pattern.rotZ,
      duration: 1.0,
      ease: 'expo.out'
    })

    // 阶段3：悬浮呼吸
    const tl3 = gsap.timeline({ paused: true })
    tl3.to(card, {
      y: `+=${20 + (i % 3) * 8}`,
      rotationZ: `+=${8 + (i % 2) * 6}`,
      duration: 1.5 + i * 0.1,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    })

    // ScrollTrigger 控制阶段1
    const st1 = ScrollTrigger.create({
      trigger: sectionRef.value,
      start: 'top 80%',
      end: 'top 55%',
      scrub: 1.5,
      animation: tl1,
      toggleActions: 'play reverse play reverse',
      onUpdate: (self) => {
        warpProgress.value = self.progress * 0.3
      }
    })

    // ScrollTrigger 控制阶段2
    const st2 = ScrollTrigger.create({
      trigger: sectionRef.value,
      start: 'top 55%',
      end: 'top 20%',
      scrub: 1.5,
      animation: tl2,
      toggleActions: 'play reverse play reverse',
      onUpdate: (self) => {
        warpProgress.value = 0.3 + self.progress * 0.5
      }
    })

    // ScrollTrigger 控制阶段3
    const st3 = ScrollTrigger.create({
      trigger: sectionRef.value,
      start: 'top 20%',
      end: 'top -50%',
      scrub: 1,
      animation: tl3,
      toggleActions: 'play none none reverse',
      onUpdate: (self) => {
        warpProgress.value = 0.8 + self.progress * 0.2
      }
    })

    scrollTriggers.push(st1, st2, st3)
  })

  // ========== 粒子系统滚动同步 ==========
  ScrollTrigger.create({
    trigger: sectionRef.value,
    start: 'top 80%',
    end: 'top -50%',
    scrub: 0.5,
    onUpdate: (self) => {
      animateParticles(self.progress)
      updateProgressBar(self.progress)
    }
  })

  // 标题动画
  if (titleRef.value) {
    gsap.fromTo(
      titleRef.value.children,
      { opacity: 0, y: 80, rotationX: -60, z: -100 },
      {
        opacity: 1,
        y: 0,
        rotationX: 0,
        z: 0,
        stagger: 0.15,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        }
      }
    )
  }

  // 星空动画
  if (starRefs.value.length) {
    gsap.to(starRefs.value, {
      scale: 2,
      opacity: 0.2,
      duration: 3,
      stagger: { each: 0.03, from: 'random' },
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
  }

  // 隧道环动画
  gsap.to('.tunnel-ring', {
    rotationZ: 360,
    repeat: -1,
    stagger: { each: 0.2, from: 'start' },
    duration: 8,
    ease: 'none'
  })

  // 能量线动画
  gsap.to('.energy-line', {
    scaleY: 1.5,
    opacity: 0.5,
    repeat: -1,
    yoyo: true,
    stagger: { each: 0.1, from: 'random' },
    duration: 1.5,
    ease: 'sine.inOut'
  })

  // 奇点动画
  gsap.to('.singularity-core', {
    scale: 1.2,
    boxShadow: '0 0 80px rgba(168, 85, 247, 0.8)',
    repeat: -1,
    yoyo: true,
    duration: 1.5,
    ease: 'sine.inOut'
  })
}

function updateProgressBar(progress: number) {
  if (progressFillRef.value) {
    progressFillRef.value.style.width = `${progress * 100}%`
  }
}

// ==================== 生命周期 ====================
onMounted(async () => {
  await nextTick()

  initParticles()
  initAnimations()

  // 入场动画
  gsap.fromTo(
    wormholeContainerRef.value,
    { opacity: 0, scale: 0.3, rotationY: 45 },
    {
      opacity: 1,
      scale: 1,
      rotationY: 0,
      duration: 1.5,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    }
  )

  // 提示入场
  gsap.set([scrollTipRef.value, progressRef.value], { opacity: 0, y: 30 })
  gsap.to([scrollTipRef.value, progressRef.value], {
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.15,
    delay: 0.5
  })
})

onUnmounted(() => {
  // 清理所有 ScrollTrigger
  scrollTriggers.forEach(st => st.kill())
  scrollTriggers = []

  // 清理粒子
  killParticles()

  // 清理所有 GSAP 动画
  ScrollTrigger.getAll().forEach(st => st.kill())
  gsap.killTweensOf('*')

  // 清理元素样式
  if (cardRefs.value.length) {
    gsap.set(cardRefs.value, { clearProps: 'all' })
  }
})
</script>

<style lang="scss" scoped>
// ==================== 变量 ====================
$wormhole-purple: #764ba2;
$wormhole-cyan: #00f2fe;
$wormhole-pink: #f5576c;
$wormhole-gold: #fee140;
$wormhole-deep: #1a0a2e;

// ==================== 主容器 ====================
.wormhole-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  min-height: 900px;
  overflow: hidden;
  background: linear-gradient(180deg, #050510 0%, $wormhole-deep 50%, #0a0a1a 100%);
  font-family: 'Inter', -apple-system, sans-serif;
  transform-style: preserve-3d;
}

// ==================== 背景层 ====================
.wormhole-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

// 隧道环
.tunnel-rings {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transform-style: preserve-3d;
}

.tunnel-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid rgba($wormhole-purple, 0.2);
  border-radius: 50%;
  animation: tunnel-rotate 6s linear infinite;

  @keyframes tunnel-rotate {
    from { transform: translate(-50%, -50%) rotateX(70deg) rotateZ(0deg); }
    to { transform: translate(-50%, -50%) rotateX(70deg) rotateZ(360deg); }
  }
}

// 星云
.nebula {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.3;

  &.nebula-1 {
    width: 500px;
    height: 500px;
    background: $wormhole-purple;
    top: -100px;
    left: -150px;
  }

  &.nebula-2 {
    width: 400px;
    height: 400px;
    background: $wormhole-cyan;
    bottom: -100px;
    right: -100px;
  }

  &.nebula-3 {
    width: 300px;
    height: 300px;
    background: $wormhole-pink;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

// 能量线
.energy-lines {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  transform: translate(-50%, -50%);
}

.energy-line {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 2px;
  height: 100%;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba($wormhole-purple, 0.3) 30%,
    rgba($wormhole-cyan, 0.3) 70%,
    transparent 100%
  );
  transform-origin: top center;
}

// ==================== 星空 ====================
.starfield {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.star {
  position: absolute;
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;

  @for $i from 1 through 80 {
    &:nth-child(#{$i}) {
      left: random(100) * 1%;
      top: random(100) * 1%;
    }
  }

  animation: star-twinkle 4s ease-in-out infinite;

  @keyframes star-twinkle {
    0%, 100% { opacity: 0.2; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.5); }
  }
}

// ==================== 标题 ====================
.wormhole-title {
  position: absolute;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 30;
  perspective: 1000px;
}

.title-badge {
  display: inline-block;
  padding: 8px 24px;
  background: linear-gradient(90deg, $wormhole-purple, $wormhole-cyan, $wormhole-pink);
  background-size: 200% 100%;
  border-radius: 25px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: white;
  margin-bottom: 20px;
  animation: badge-shimmer 3s ease infinite;
  box-shadow: 0 4px 30px rgba($wormhole-purple, 0.5);

  @keyframes badge-shimmer {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
}

.title-text {
  font-size: clamp(44px, 8vw, 80px);
  font-weight: 900;
  background: linear-gradient(135deg, white 0%, $wormhole-cyan 30%, $wormhole-purple 60%, $wormhole-pink 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 16px;
  letter-spacing: -3px;
}

.subtitle {
  font-size: 12px;
  color: rgba(white, 0.5);
  letter-spacing: 6px;
  text-transform: uppercase;
  margin: 0;
}

// ==================== 时空隧道容器 ====================
.wormhole-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 600px;
  transform-style: preserve-3d;
}

.wormhole-core {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
}

// ==================== 时空卡片 ====================
.space-card {
  cursor: pointer;
  transform-style: preserve-3d;
  will-change: transform;
  perspective: 1200px;

  &:hover .card-inner {
    transform: translateZ(30px) scale(1.05);
    box-shadow:
      0 30px 80px rgba(0, 0, 0, 0.5),
      0 0 60px rgba($wormhole-purple, 0.4);
  }

  &:hover .card-glow-orb {
    transform: scale(1.5);
    opacity: 0.8;
  }
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  overflow: hidden;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              box-shadow 0.5s ease;
  box-shadow:
    0 15px 50px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.08) inset;
}

.card-timeline-bg {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%),
    linear-gradient(225deg, rgba(255,255,255,0.05) 0%, transparent 50%);
}

.card-gradient {
  position: absolute;
  inset: 0;
  opacity: 0.85;
}

.card-content {
  position: relative;
  z-index: 2;
  padding: 28px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.card-glow-orb {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  filter: blur(15px);
  opacity: 0.5;
  transition: transform 0.4s, opacity 0.4s;
}

.card-icon {
  width: 44px;
  height: 44px;
  margin-bottom: 14px;
  color: white;
  filter: drop-shadow(0 2px 10px rgba(0, 0, 0, 0.3));

  svg {
    width: 100%;
    height: 100%;
  }
}

.card-title {
  font-size: 18px;
  font-weight: 700;
  color: white;
  margin: 0 0 6px;
  text-shadow: 0 2px 15px rgba(0, 0, 0, 0.4);
}

.card-desc {
  font-size: 12px;
  color: rgba(white, 0.75);
  margin: 0 0 16px;
  line-height: 1.5;
}

.space-coords {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
}

.coord-label {
  font-size: 9px;
  letter-spacing: 2px;
  color: rgba(white, 0.5);
  text-transform: uppercase;
}

.coord-value {
  font-size: 11px;
  font-weight: 600;
  color: white;
  font-family: 'Courier New', monospace;
}

.card-border {
  position: absolute;
  inset: 0;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  pointer-events: none;
}

.warp-trail {
  position: absolute;
  inset: 0;
  border-radius: 20px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 30%,
    transparent 70%,
    rgba(255, 255, 255, 0.05) 100%
  );
  pointer-events: none;
}

// ==================== 奇点中心 ====================
.singularity-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  transform-style: preserve-3d;
}

.singularity-core {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  background: radial-gradient(circle, white 0%, $wormhole-purple 50%, transparent 70%);
  border-radius: 50%;
  box-shadow: 0 0 40px rgba($wormhole-purple, 0.6);
}

.singularity-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  border: 2px solid rgba($wormhole-cyan, 0.4);
  border-radius: 50%;
  animation: singularity-pulse 2s ease-in-out infinite;

  @keyframes singularity-pulse {
    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
    50% { transform: translate(-50%, -50%) scale(1.3); opacity: 0.2; }
  }
}

// ==================== 粒子画布 ====================
.particle-canvas {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

// ==================== 滚动提示 ====================
.scroll-tip {
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  z-index: 30;
}

.tip-icon {
  width: 40px;
  height: 40px;
  color: $wormhole-cyan;
  animation: tip-pulse 2s ease-in-out infinite;

  svg {
    width: 100%;
    height: 100%;
  }

  @keyframes tip-pulse {
    0%, 100% { opacity: 0.4; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.1); }
  }
}

.tip-text {
  font-size: 10px;
  letter-spacing: 5px;
  color: rgba(white, 0.4);
  text-transform: uppercase;
}

// ==================== 进度指示 ====================
.warp-progress {
  position: absolute;
  bottom: 60px;
  right: 60px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  z-index: 30;
}

.progress-bar {
  width: 140px;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, $wormhole-purple, $wormhole-cyan, $wormhole-pink);
  background-size: 200% 100%;
  border-radius: 3px;
  transition: width 0.1s ease;
  animation: progress-shimmer 2s linear infinite;
}

@keyframes progress-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.progress-label {
  font-size: 9px;
  letter-spacing: 3px;
  color: rgba(white, 0.4);
  text-transform: uppercase;
  font-family: 'Courier New', monospace;
}

// ==================== 响应式 ====================
@media (max-width: 768px) {
  .wormhole-title {
    top: 40px;
  }

  .title-text {
    font-size: 32px;
  }

  .subtitle {
    font-size: 10px;
    letter-spacing: 3px;
  }

  .wormhole-container {
    width: 380px;
    height: 380px;
  }

  .space-card {
    width: 160px !important;
    height: 200px !important;
  }

  .card-content {
    padding: 16px;
  }

  .card-icon {
    width: 28px;
    height: 28px;
  }

  .card-title {
    font-size: 13px;
  }

  .card-desc {
    font-size: 10px;
    margin-bottom: 10px;
  }

  .space-coords {
    padding-top: 8px;
  }

  .coord-label, .coord-value {
    font-size: 9px;
  }

  .scroll-tip {
    bottom: 40px;
  }

  .warp-progress {
    bottom: 40px;
    right: 20px;
  }

  .progress-bar {
    width: 100px;
  }
}
</style>
