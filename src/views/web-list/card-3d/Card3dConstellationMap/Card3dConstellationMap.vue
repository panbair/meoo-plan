<template>
  <section ref="sectionRef" class="constellation-section">
    <!-- 深空背景 -->
    <div class="cosmos-bg">
      <div class="cosmos-nebula cosmos-nebula-1"></div>
      <div class="cosmos-nebula cosmos-nebula-2"></div>
      <div class="cosmos-nebula cosmos-nebula-3"></div>
      <div class="cosmos-dust"></div>
    </div>

    <!-- 星空层 -->
    <div class="star-layer">
      <div v-for="i in 80" :key="i" class="bg-star"
        :style="{
          left: starPositions[i-1]?.x + '%',
          top: starPositions[i-1]?.y + '%',
          animationDelay: starPositions[i-1]?.delay + 's',
          animationDuration: (starPositions[i-1]?.dur || 3) + 's',
          width: (starPositions[i-1]?.size || 2) + 'px',
          height: (starPositions[i-1]?.size || 2) + 'px',
        }"
      ></div>
    </div>

    <!-- 标题 -->
    <div ref="titleRef" class="title-area">
      <span class="title-badge">CONSTELLATION MAP</span>
      <h2 class="title-main">星座星图</h2>
      <p class="title-sub">Stellar Cartography · 3D Constellation · Scroll Navigate</p>
    </div>

    <!-- 3D 星座空间 -->
    <div ref="cosmosRef" class="cosmos-3d">
      <div ref="orbitGroupRef" class="orbit-group">
        <!-- 8 张照片：挂在不规则的星座星点位置 -->
        <div
          v-for="(star, idx) in stars"
          :key="star.id"
          :ref="el => { if (el) photoRefs[idx] = el as HTMLElement }"
          class="star-photo"
          :style="{
            '--star-x': star.pos.x + 'px',
            '--star-y': star.pos.y + 'px',
            '--star-z': star.pos.z + 'px',
            '--star-angle': star.tilt + 'deg',
          }"
          @mouseenter="onPhotoHover(idx)"
          @mouseleave="onPhotoLeave(idx)"
        >
          <!-- 恒星辉光 -->
          <div class="star-glow" :style="{ '--glow-color': star.glowColor }"></div>
          <!-- 照片框 -->
          <div class="photo-frame">
            <img :src="star.image" :alt="star.name" class="photo-img" />
            <div class="photo-tint" :style="{ background: star.tintGradient }"></div>
            <!-- 星点标记 -->
            <div class="star-marker" :style="{ '--marker-color': star.color }"></div>
          </div>
          <!-- 照片标签 -->
          <div class="photo-label">
            <span class="label-id">{{ star.label }}</span>
            <span class="label-name">{{ star.name }}</span>
          </div>
        </div>

        <!-- 星座连线 SVG -->
        <svg ref="constellationSvgRef" class="constellation-lines">
          <line
            v-for="(conn, i) in constellationEdges"
            :key="'edge-'+i"
            :ref="el => { if (el) edgeRefs[i] = el as SVGLineElement }"
            class="star-edge"
            :stroke="conn.color"
          />
        </svg>
      </div>
    </div>

    <!-- 粒子画布 -->
    <canvas ref="particleCanvasRef" class="cosmos-canvas"></canvas>

    <!-- 北/南天极指示 -->
    <div ref="celestialRef" class="celestial-poles">
      <div class="pole pole-north">
        <span class="pole-dot"></span>
        <span class="pole-text">NCP</span>
      </div>
      <div class="pole pole-south">
        <span class="pole-dot"></span>
        <span class="pole-text">SCP</span>
      </div>
    </div>

    <!-- 底部提示 -->
    <div ref="scrollTipRef" class="scroll-hint">
      <div class="hint-arrow">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
      </div>
      <span class="hint-text">SCROLL TO CHART THE STARS</span>
    </div>

    <!-- 进度 -->
    <div ref="progressRef" class="progress-indicator">
      <div class="progress-ring-wrap">
        <svg viewBox="0 0 100 100">
          <defs>
            <linearGradient id="starProgressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#818cf8"/>
              <stop offset="50%" stop-color="#38bdf8"/>
              <stop offset="100%" stop-color="#f472b6"/>
            </linearGradient>
          </defs>
          <circle class="p-ring-bg" cx="50" cy="50" r="45" fill="none" stroke-width="4"/>
          <circle ref="progressCircleRef" class="p-ring-fill" cx="50" cy="50" r="45"
            fill="none" stroke-width="4" stroke-linecap="round"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="progressOffset"
          />
        </svg>
      </div>
      <span class="progress-percent">{{ Math.round(currentProgress * 100) }}%</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ==================== 类型 ====================
interface StarPhoto {
  id: number
  name: string
  label: string // 星表编号
  image: string
  pos: { x: number; y: number; z: number } // 3D 位置
  tilt: number // 自身倾斜角
  color: string
  glowColor: string
  tintGradient: string
}

// ==================== 星空背景星位置（固定随机种子） ====================
const starPositions = Array.from({ length: 80 }, (_, i) => {
  const seed = ((i + 1) * 137.508) % 1
  return {
    x: (seed * 97 + i * 7) % 100,
    y: (seed * 83 + i * 11) % 100,
    delay: (i * 0.37) % 5,
    dur: 2.5 + (i % 3),
    size: 1 + (i % 3),
  }
})

// ==================== Refs ====================
const sectionRef = ref<HTMLElement>()
const cosmosRef = ref<HTMLElement>()
const orbitGroupRef = ref<HTMLElement>()
const titleRef = ref<HTMLElement>()
const particleCanvasRef = ref<HTMLCanvasElement>()
const constellationSvgRef = ref<SVGElement>()
const scrollTipRef = ref<HTMLElement>()
const progressRef = ref<HTMLElement>()
const progressCircleRef = ref<SVGElement>()
const celestialRef = ref<HTMLElement>()
const photoRefs = ref<HTMLElement[]>([])
const edgeRefs = ref<SVGLineElement[]>([])

// ==================== 状态 ====================
const currentProgress = ref(0)
const circumference = 2 * Math.PI * 45
const progressOffset = computed(() => circumference * (1 - currentProgress.value))

// ==================== 8 颗"星"（照片）— 模拟猎户座 + 天狼星区域 ====================
const stars = reactive<StarPhoto[]>([
  {
    id: 1, name: '参宿七 Rigel', label: 'β Ori',
    image: 'https://picsum.photos/seed/cons1/500/350',
    pos: { x: -160, y: -200, z: -40 },
    tilt: -8, color: '#818cf8', glowColor: '#818cf8',
    tintGradient: 'linear-gradient(180deg, transparent 45%, rgba(129,140,248,0.65) 100%)'
  },
  {
    id: 2, name: '参宿四 Betelgeuse', label: 'α Ori',
    image: 'https://picsum.photos/seed/cons2/500/350',
    pos: { x: 90, y: -260, z: -80 },
    tilt: 12, color: '#f87171', glowColor: '#f87171',
    tintGradient: 'linear-gradient(180deg, transparent 45%, rgba(248,113,113,0.65) 100%)'
  },
  {
    id: 3, name: '参宿五 Bellatrix', label: 'γ Ori',
    image: 'https://picsum.photos/seed/cons3/500/350',
    pos: { x: 220, y: -180, z: -20 },
    tilt: 5, color: '#38bdf8', glowColor: '#38bdf8',
    tintGradient: 'linear-gradient(180deg, transparent 45%, rgba(56,189,248,0.65) 100%)'
  },
  {
    id: 4, name: '参宿一 Alnitak', label: 'ζ Ori',
    image: 'https://picsum.photos/seed/cons4/500/350',
    pos: { x: -50, y: -80, z: 30 },
    tilt: -3, color: '#a78bfa', glowColor: '#a78bfa',
    tintGradient: 'linear-gradient(180deg, transparent 45%, rgba(167,139,250,0.65) 100%)'
  },
  {
    id: 5, name: '参宿二 Alnilam', label: 'ε Ori',
    image: 'https://picsum.photos/seed/cons5/500/350',
    pos: { x: 40, y: -60, z: 60 },
    tilt: -6, color: '#c4b5fd', glowColor: '#c4b5fd',
    tintGradient: 'linear-gradient(180deg, transparent 45%, rgba(196,181,253,0.65) 100%)'
  },
  {
    id: 6, name: '参宿三 Mintaka', label: 'δ Ori',
    image: 'https://picsum.photos/seed/cons6/500/350',
    pos: { x: 130, y: -40, z: 90 },
    tilt: 10, color: '#67e8f9', glowColor: '#67e8f9',
    tintGradient: 'linear-gradient(180deg, transparent 45%, rgba(103,232,249,0.65) 100%)'
  },
  {
    id: 7, name: '参宿七 Saiph', label: 'κ Ori',
    image: 'https://picsum.photos/seed/cons7/500/350',
    pos: { x: -200, y: 60, z: -50 },
    tilt: 15, color: '#e879f9', glowColor: '#e879f9',
    tintGradient: 'linear-gradient(180deg, transparent 45%, rgba(232,121,249,0.65) 100%)'
  },
  {
    id: 8, name: '天狼星 Sirius', label: 'α CMa',
    image: 'https://picsum.photos/seed/cons8/500/350',
    pos: { x: 250, y: 180, z: 120 },
    tilt: -12, color: '#fbbf24', glowColor: '#fbbf24',
    tintGradient: 'linear-gradient(180deg, transparent 45%, rgba(251,191,36,0.65) 100%)'
  }
])

// ==================== 星座连线 —— 模拟猎户座结构 ====================
const constellationEdges = reactive([
  // 猎户腰带（参宿一-二-三）
  { from: 3, to: 4, color: '#818cf866' },
  { from: 4, to: 5, color: '#818cf866' },
  // 上身框
  { from: 0, to: 3, color: '#38bdf866' },
  { from: 0, to: 5, color: '#38bdf866' },
  { from: 1, to: 3, color: '#f8717166' },
  { from: 1, to: 5, color: '#f8717166' },
  { from: 2, to: 3, color: '#38bdf866' },
  { from: 2, to: 5, color: '#38bdf866' },
  // 下身
  { from: 3, to: 6, color: '#e879f966' },
  { from: 5, to: 6, color: '#e879f966' },
  // 天狼星独立连线
  { from: 2, to: 7, color: '#fbbf2433' },
  { from: 6, to: 7, color: '#fbbf2433' },
])

// ==================== 粒子系统 ====================
let particleCtx: CanvasRenderingContext2D | null = null
let particles: Array<{
  x: number; y: number; z: number
  vx: number; vy: number; vz: number
  size: number; color: string; alpha: number
}> = []
let particleFrameId: number | null = null

function initParticles() {
  const canvas = particleCanvasRef.value
  if (!canvas) return
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  particleCtx = canvas.getContext('2d')

  const colors = ['#818cf8', '#38bdf8', '#f472b6', '#fbbf24', '#a78bfa', '#67e8f9']

  particles = Array.from({ length: 90 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    z: Math.random() * 250 - 125,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    vz: (Math.random() - 0.5) * 0.2,
    size: Math.random() * 2.2 + 0.6,
    color: colors[Math.floor(Math.random() * colors.length)],
    alpha: Math.random() * 0.45 + 0.2,
  }))
}

function animateParticles(progress: number) {
  if (!particleCtx || !particleCanvasRef.value) return
  const canvas = particleCanvasRef.value
  particleCtx.clearRect(0, 0, canvas.width, canvas.height)

  particles.forEach(p => {
    p.x += p.vx * (1 + progress * 0.6)
    p.y += p.vy * (1 + progress * 0.6)
    p.z += p.vz

    if (p.z > 180 || p.z < -180) p.vz *= -1
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1

    const scale = 1 + p.z / 300
    const sx = (p.x - canvas.width / 2) * scale + canvas.width / 2
    const sy = (p.y - canvas.height / 2) * scale + canvas.height / 2

    particleCtx!.beginPath()
    particleCtx!.arc(sx, sy, p.size * scale, 0, Math.PI * 2)
    particleCtx!.fillStyle = p.color
    particleCtx!.globalAlpha = p.alpha * (1 - Math.abs(p.z) / 180)
    particleCtx!.fill()
  })

  particleCtx.globalAlpha = 1
}

function killParticles() {
  if (particleFrameId !== null) {
    cancelAnimationFrame(particleFrameId)
    particleFrameId = null
  }
}

// ==================== 星座连线实时同步 ====================
let edgeUpdateFrameSkip = 0
const EDGE_SKIP = 3 // 每 3 帧更新一次，减少 getBoundingClientRect 调用

function updateEdges() {
  edgeUpdateFrameSkip++
  if (edgeUpdateFrameSkip % EDGE_SKIP !== 0) return
  if (!constellationSvgRef.value || !photoRefs.value.length) return
  const svg = constellationSvgRef.value
  const svgRect = svg.getBoundingClientRect()

  edgeRefs.value.forEach((line, i) => {
    if (!line) return
    const conn = constellationEdges[i]
    if (!conn) return
    const fromEl = photoRefs.value[conn.from]
    const toEl = photoRefs.value[conn.to]
    if (!fromEl || !toEl) return

    const fromRect = fromEl.getBoundingClientRect()
    const toRect = toEl.getBoundingClientRect()

    line.setAttribute('x1', String(fromRect.left + fromRect.width / 2 - svgRect.left))
    line.setAttribute('y1', String(fromRect.top + fromRect.height / 2 - svgRect.top))
    line.setAttribute('x2', String(toRect.left + toRect.width / 2 - svgRect.left))
    line.setAttribute('y2', String(toRect.top + toRect.height / 2 - svgRect.top))
  })
}

// ==================== 悬停 ====================
function onPhotoHover(idx: number) {
  const el = photoRefs.value[idx]
  if (!el) return
  gsap.to(el, {
    z: 100, scale: 1.18,
    boxShadow: `0 0 70px ${stars[idx].glowColor}55, 0 0 140px ${stars[idx].glowColor}1a`,
    duration: 0.45, ease: 'back.out(1.6)', overwrite: 'auto',
  })
  // 连线加亮
  edgeRefs.value.forEach((line, i) => {
    const conn = constellationEdges[i]
    if (conn && (conn.from === idx || conn.to === idx)) {
      gsap.to(line, { opacity: 0.9, strokeWidth: 2, duration: 0.3, overwrite: 'auto' })
    }
  })
}

function onPhotoLeave(idx: number) {
  const el = photoRefs.value[idx]
  if (!el) return
  gsap.to(el, {
    z: 0, scale: 1,
    boxShadow: `0 0 25px ${stars[idx].glowColor}1a, 0 4px 25px rgba(0,0,0,0.35)`,
    duration: 0.55, ease: 'power2.out', overwrite: 'auto',
  })
  // 连线恢复
  edgeRefs.value.forEach((line, i) => {
    const conn = constellationEdges[i]
    if (conn && (conn.from === idx || conn.to === idx)) {
      gsap.to(line, { opacity: 0.4, strokeWidth: 1, duration: 0.4, overwrite: 'auto' })
    }
  })
}

// ==================== 主动画 ====================
let mainTimeline: gsap.core.Timeline | null = null
let breatheTween: gsap.core.Tween | null = null
let scrollTriggers: ScrollTrigger[] = []

function initAnimations() {
  if (!sectionRef.value || !orbitGroupRef.value || !photoRefs.value.length) return
  const section = sectionRef.value
  const orbit = orbitGroupRef.value
  const photos = photoRefs.value

  // 3D 空间
  gsap.set(orbit, { transformStyle: 'preserve-3d', transformOrigin: 'center center' })

  // 初始化每张照片到其星座位置
  stars.forEach((star, i) => {
    gsap.set(photos[i], {
      x: star.pos.x,
      y: star.pos.y,
      z: star.pos.z,
      scale: 0.85,
      opacity: 0.7,
      rotateZ: star.tilt,
      transformOrigin: 'center center',
      willChange: 'transform',
    })
  })

  // 滚动动画 —— 星系旋转 + 照片深入
  mainTimeline = gsap.timeline({ paused: true })

  // 阶段1：照片浮现（从暗淡到清晰）
  mainTimeline.to(photos, {
    opacity: 1,
    scale: 1,
    duration: 0.6,
    stagger: { each: 0.07, from: 'random' },
    ease: 'power2.out',
  })

  // 阶段2：星座空间变换 —— 核心！
  // 整个 orbitGroup 绕Y轴缓慢旋转，同时整体沿Z轴拉近
  // 每张照片各自微调位置，产生星图漂移感
  mainTimeline.to(orbit, {
    rotateY: 35,     // 星系向右转
    rotateX: 12,     // 略微俯视
    rotateZ: -4,
    duration: 2.0,
    ease: 'power2.inOut',
  }, '-=0.2')

  // 照片自身位置微调（星空漂移）
  mainTimeline.to(photos, {
    x: (i: number) => stars[i].pos.x * 1.1 + (i % 2 === 0 ? 30 : -30),
    y: (i: number) => stars[i].pos.y * 1.05,
    z: (i: number) => stars[i].pos.z + 40 + i * 8,
    rotateZ: (i: number) => stars[i].tilt + (i % 2 === 0 ? 6 : -6),
    stagger: { each: 0.05, from: 'edges' },
    duration: 1.8,
    ease: 'power3.inOut',
  }, '-=0.3')

  // 阶段3：悬浮呼吸（改用独立tween + 触发时暂停，避免与scrub冲突）
  breatheTween = gsap.to(photos, {
    y: '+=12',
    z: '+=20',
    rotateZ: '+=3',
    repeat: -1, yoyo: true,
    stagger: { each: 0.08, from: 'random' },
    duration: 2.8,
    ease: 'sine.inOut',
    paused: false,
  })

  // 阶段2.5：悬浮呼吸（在滚动完成后启动呼吸效果）
  mainTimeline.call(() => {
    breatheTween.play()
  }, undefined, '-=0.4')

  const st = ScrollTrigger.create({
    trigger: section,
    start: 'top 80%',
    end: 'top 5%',
    scrub: 1.8,
    animation: mainTimeline,
    toggleActions: 'play reverse play reverse',
    immediateRender: false,
    onUpdate: (self) => {
      currentProgress.value = self.progress
      animateParticles(self.progress)
    },
    onLeaveBack: () => {
      breatheTween.pause()
      edgeUpdateFrameSkip = 0
    },
  })
  scrollTriggers.push(st)

  // 连线同步到 gsap ticker
  gsap.ticker.add(updateEdges)

  // 标题入场
  if (titleRef.value) {
    gsap.fromTo(titleRef.value.children,
      { opacity: 0, y: 45, rotationX: -25 },
      {
        opacity: 1, y: 0, rotationX: 0,
        stagger: 0.12, duration: 0.85, ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 75%', toggleActions: 'play none none reverse' },
      }
    )
  }

  // 连线淡入
  if (edgeRefs.value.length) {
    gsap.fromTo(edgeRefs.value,
      { opacity: 0 },
      {
        opacity: 0.4, duration: 1.2, stagger: 0.02, ease: 'power2.out',
        scrollTrigger: { trigger: section, start: 'top 82%', toggleActions: 'play none none reverse' },
      }
    )
  }
}

// ==================== 生命周期 ====================
onMounted(async () => {
  await nextTick()
  initParticles()
  initAnimations()

  // 整体入场
  gsap.fromTo(cosmosRef.value,
    { opacity: 0, scale: 0.75 },
    {
      opacity: 1, scale: 1, duration: 1.1, ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.value, start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    }
  )

  // 底部元素渐入
  gsap.set([scrollTipRef.value, progressRef.value, celestialRef.value], { opacity: 0, y: 12 })
  gsap.to([scrollTipRef.value, progressRef.value, celestialRef.value], {
    opacity: 1, y: 0, duration: 0.6, stagger: 0.1, delay: 0.3,
  })
})

onUnmounted(() => {
  gsap.ticker.remove(updateEdges)
  scrollTriggers.forEach(st => st.kill())
  scrollTriggers = []
  if (mainTimeline) { mainTimeline.kill(); mainTimeline = null }
  if (breatheTween) { breatheTween.kill(); breatheTween = null }
  killParticles()
  ScrollTrigger.getAll().forEach(st => st.kill())
  gsap.killTweensOf('*')
  if (photoRefs.value.length) gsap.set(photoRefs.value, { clearProps: 'all' })
})
</script>

<style lang="scss" scoped>
// ==================== 变量 ====================
$bg-deep: #060612;
$purple: #818cf8;
$blue: #38bdf8;
$pink: #f472b6;
$gold: #fbbf24;

// ==================== 主容器 ====================
.constellation-section {
  position: relative;
  width: 100vw; height: 100vh; min-height: 800px;
  overflow: hidden;
  background: radial-gradient(ellipse at 30% 40%, #10132b 0%, $bg-deep 60%, #050510 100%);
  font-family: 'Inter', 'SF Pro Display', -apple-system, sans-serif;
  perspective: 2200px;
}

// ==================== 深空背景 ====================
.cosmos-bg { position: absolute; inset: 0; pointer-events: none; }

.cosmos-nebula {
  position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.18;
  animation: nebula-drift 24s ease-in-out infinite;
  &.cosmos-nebula-1 {
    width: 800px; height: 800px;
    background: radial-gradient(circle, $purple 0%, transparent 70%);
    top: -250px; left: -150px;
  }
  &.cosmos-nebula-2 {
    width: 650px; height: 650px;
    background: radial-gradient(circle, $blue 0%, transparent 70%);
    bottom: -200px; right: -120px; animation-delay: -8s;
  }
  &.cosmos-nebula-3 {
    width: 550px; height: 550px;
    background: radial-gradient(circle, $pink 0%, transparent 70%);
    top: 35%; left: 45%; animation-delay: -16s;
  }
}
@keyframes nebula-drift {
  0%,100% { transform: translate(0,0) scale(1); }
  25% { transform: translate(50px,-40px) scale(1.04); }
  50% { transform: translate(-30px,35px) scale(0.96); }
  75% { transform: translate(-45px,-20px) scale(1.03); }
}

.cosmos-dust {
  position: absolute; inset: 0;
  background-image:
    radial-gradient(1px 1px at 20% 30%, rgba(129,140,248,0.3) 50%, transparent),
    radial-gradient(1px 1px at 60% 70%, rgba(56,189,248,0.3) 50%, transparent),
    radial-gradient(1px 1px at 80% 20%, rgba(244,114,182,0.2) 50%, transparent),
    radial-gradient(1px 1px at 40% 60%, rgba(251,191,36,0.2) 50%, transparent);
  background-size: 200px 200px, 280px 280px, 180px 180px, 240px 240px;
  background-repeat: repeat;
}

// ==================== 背景星空 ====================
.star-layer { position: absolute; inset: 0; pointer-events: none; }
.bg-star {
  position: absolute; background: white; border-radius: 50%; opacity: 0.45;
  animation: bg-star-blink 3s ease-in-out infinite;
}
@keyframes bg-star-blink {
  0%,100% { opacity: 0.2; transform: scale(0.7); }
  50% { opacity: 0.8; transform: scale(1.3); }
}

// ==================== 标题 ====================
.title-area {
  position: absolute; top: 45px; left: 50%; transform: translateX(-50%);
  text-align: center; z-index: 20; perspective: 600px;
}
.title-badge {
  display: inline-block; padding: 7px 22px;
  background: linear-gradient(90deg, $purple, $blue, $pink);
  border-radius: 24px; font-size: 10px; font-weight: 700;
  letter-spacing: 4px; text-transform: uppercase; color: white;
  margin-bottom: 14px; box-shadow: 0 4px 25px rgba($purple, 0.3);
}
.title-main {
  font-size: clamp(36px, 6vw, 62px); font-weight: 900;
  background: linear-gradient(135deg, #fff 0%, $blue 35%, $purple 70%, $pink 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text; margin: 0 0 8px; letter-spacing: -1.5px;
}
.title-sub {
  font-size: 11px; color: rgba(white,0.42); letter-spacing: 5px;
  text-transform: uppercase; margin: 0;
}

// ==================== 3D 星座空间 ====================
.cosmos-3d {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -52%);
  width: 900px; height: 650px;
  transform-style: preserve-3d;
  z-index: 10;
}
.orbit-group {
  position: relative; width: 100%; height: 100%;
  transform-style: preserve-3d;
  display: flex; align-items: center; justify-content: center;
}

// ==================== 恒星照片 ====================
.star-photo {
  position: absolute;
  width: 190px; height: 260px;
  transform-style: preserve-3d;
  cursor: pointer;
  &:hover { filter: brightness(1.2); z-index: 200 !important; }
}

.star-glow {
  position: absolute;
  inset: -20px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--glow-color, #818cf8) 0%, transparent 70%);
  opacity: 0.3;
  filter: blur(20px);
  pointer-events: none;
  animation: glow-pulse 3s ease-in-out infinite;
}
@keyframes glow-pulse {
  0%,100% { opacity: 0.2; transform: scale(0.9); }
  50% { opacity: 0.45; transform: scale(1.15); }
}

.photo-frame {
  position: relative; width: 100%; height: 100%;
  border-radius: 14px; overflow: hidden;
  box-shadow: 0 4px 30px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06) inset;
  background: rgba(10,10,25,0.5);
}

.photo-img {
  width: 100%; height: 100%; object-fit: cover;
  opacity: 0.88; transition: opacity 0.4s, transform 0.4s;
  .star-photo:hover & { opacity: 1; transform: scale(1.05); }
}

.photo-tint {
  position: absolute; inset: 0; pointer-events: none;
}

.star-marker {
  position: absolute; top: 10px; right: 10px;
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--marker-color, white);
  box-shadow: 0 0 10px var(--marker-color, white);
  animation: marker-blink 2s ease-in-out infinite;
}
@keyframes marker-blink {
  0%,100% { opacity: 0.6; box-shadow: 0 0 6px var(--marker-color); }
  50% { opacity: 1; box-shadow: 0 0 16px var(--marker-color), 0 0 30px var(--marker-color); }
}

.photo-label {
  position: absolute; bottom: -38px; left: 50%; transform: translateX(-50%);
  display: flex; flex-direction: column; align-items: center; gap: 2px;
  white-space: nowrap;
}
.label-id {
  font-size: 9px; font-weight: 700; letter-spacing: 2px;
  color: rgba(white, 0.45);
}
.label-name {
  font-size: 11px; font-weight: 600; color: white;
  text-shadow: 0 0 10px rgba(white,0.3);
}

// ==================== 星座连线 ====================
.constellation-lines {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  pointer-events: none;
  z-index: 5;
}
.star-edge {
  stroke-width: 1;
  stroke-dasharray: 3 8;
  opacity: 0.35;
}

// ==================== 粒子画布 ====================
.cosmos-canvas {
  position: absolute; inset: 0; pointer-events: none; z-index: 8;
}

// ==================== 天极指示 ====================
.celestial-poles {
  position: absolute; top: 50%; right: 25px;
  transform: translateY(-50%);
  display: flex; flex-direction: column; gap: 50px;
  z-index: 20;
}
.pole {
  display: flex; flex-direction: column; align-items: center; gap: 4px;
}
.pole-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: rgba(white,0.5); box-shadow: 0 0 8px rgba(white,0.3);
}
.pole-text {
  font-size: 7px; letter-spacing: 2px; color: rgba(white,0.3);
}

// ==================== 底部提示 ====================
.scroll-hint {
  position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%);
  display: flex; flex-direction: column; align-items: center; gap: 8px; z-index: 20;
}
.hint-arrow {
  width: 24px; height: 24px; color: $blue;
  animation: arrow-bounce 2s ease-in-out infinite;
  svg { width: 100%; height: 100%; }
}
@keyframes arrow-bounce {
  0%,100% { transform: translateY(0); opacity: 0.7; }
  50% { transform: translateY(6px); opacity: 0.3; }
}
.hint-text {
  font-size: 8px; letter-spacing: 5px; color: rgba(white,0.35); text-transform: uppercase;
}

// ==================== 进度 ====================
.progress-indicator {
  position: absolute; bottom: 40px; right: 45px;
  display: flex; align-items: center; gap: 8px; z-index: 20;
}
.progress-ring-wrap { width: 52px; height: 52px; transform: rotate(-90deg); }
.p-ring-bg { stroke: rgba(255,255,255,0.05); }
.p-ring-fill { stroke: url(#starProgressGrad); transition: stroke-dashoffset 0.12s ease; }
.progress-percent {
  font-size: 12px; font-weight: 700; color: white; font-variant-numeric: tabular-nums;
}

// ==================== 响应式 ====================
@media (max-width: 1024px) {
  .cosmos-3d { width: 700px; height: 520px; }
  .star-photo { width: 160px; height: 220px; }
  .photo-label { bottom: -32px; }
}

@media (max-width: 768px) {
  .title-area { top: 25px; }
  .title-main { font-size: 26px; }
  .title-sub { font-size: 9px; letter-spacing: 3px; }
  .cosmos-3d {
    width: 340px; height: 450px;
    transform: translate(-50%, -48%);
  }
  .star-photo { width: 130px; height: 180px; }
  .photo-label { bottom: -28px; }
  .label-name { font-size: 10px; }
  .label-id { font-size: 8px; }
  .celestial-poles { display: none; }
  .progress-indicator { bottom: 25px; right: 16px; }
  .progress-ring-wrap { width: 40px; height: 40px; }
  .scroll-hint { bottom: 22px; }
}
</style>
