<template>
  <div class="hr-section" ref="sectionRef">
    <!-- 背景层 -->
    <div class="hr-bg"></div>

    <!-- Canvas 粒子背景 -->
    <canvas ref="canvasRef" class="hr-particles"></canvas>

    <!-- 前景暗角 -->
    <div class="hr-vignette"></div>

    <!-- 标题区 -->
    <div class="hr-header" ref="headerRef">
      <span class="hr-badge">IMAGE HOVER</span>
      <h2 class="hr-title">光效揭示</h2>
      <div class="hr-line"></div>
      <p class="hr-subtitle">鼠标悬停 — 图片放大 · 光效扫过 · 亮度提升</p>
    </div>

    <!-- 图片卡片网格 -->
    <div class="hr-gallery" ref="galleryRef">
      <div
        v-for="(item, index) in cards"
        :key="item.id"
        class="hr-card"
        :ref="(el) => setCardRef(el, index)"
        @mouseenter="(e) => onCardEnter(e, index)"
        @mouseleave="(e) => onCardLeave(e, index)"
        @mousemove="(e) => onCardMove(e, index)"
      >
        <!-- 图片容器 -->
        <div class="hr-image-wrap" :ref="(el) => setImgWrapRef(el, index)">
          <img
            :src="item.image"
            :alt="item.title"
            class="hr-image"
            :ref="(el) => setImgRef(el, index)"
            crossorigin="anonymous"
          />
          <!-- 光效扫过层 -->
          <div class="hr-shine" :ref="(el) => setShineRef(el, index)"></div>
        </div>

        <!-- 卡片内容 -->
        <div class="hr-card-body">
          <div class="hr-card-icon">{{ item.icon }}</div>
          <h3 class="hr-card-title">{{ item.title }}</h3>
          <p class="hr-card-desc">{{ item.desc }}</p>
        </div>

        <!-- 底部光条 -->
        <div class="hr-card-glow" :ref="(el) => setGlowRef(el, index)"></div>
      </div>
    </div>

    <!-- 底部指示器 -->
    <div class="hr-indicator" ref="indicatorRef">
      <div class="hr-indicator-track">
        <div class="hr-indicator-fill" ref="indicatorFillRef"></div>
      </div>
      <span class="hr-indicator-text">{{ cards.length }} 张图片 · 光效揭示</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type CleanupFn = () => void
const cleanupFns: CleanupFn[] = []

// ═══════════════════════════════════════════
//  Hover Light Reveal — 光效揭示图片卡片
//
//  核心特性:
//  1. 8张图片卡片网格布局 (4x2)
//  2. 滚动入场：卡片依次从下方飞入 + 淡入
//  3. 鼠标悬停：图片放大 1.12x + 提亮 + 光效扫过
//  4. 鼠标移动：3D 倾斜感应（微调）
//  5. 底部发光条跟随动画
//  6. Canvas 粒子背景增强沉浸感
//  7. 渐变紫蓝配色，科技感光效
// ═══════════════════════════════════════════

// ==== 图片数据 ====
interface CardItem {
  id: number
  image: string
  icon: string
  title: string
  desc: string
}

const cards: CardItem[] = [
  { id: 1, image: 'https://picsum.photos/seed/mountain/600/400', icon: '🏔️', title: '山峦叠嶂', desc: '自然景观 · 壮丽山峰' },
  { id: 2, image: 'https://picsum.photos/seed/ocean/600/400', icon: '🌊', title: '碧海蓝天', desc: '海岸风光 · 浪花飞溅' },
  { id: 3, image: 'https://picsum.photos/seed/forest/600/400', icon: '🌲', title: '森林秘境', desc: '原始森林 · 阳光斑驳' },
  { id: 4, image: 'https://picsum.photos/seed/city/600/400', icon: '🌃', title: '城市夜景', desc: '霓虹闪烁 · 夜幕降临' },
  { id: 5, image: 'https://picsum.photos/seed/desert/600/400', icon: '🏜️', title: '沙漠绿洲', desc: '金色沙丘 · 绿洲奇景' },
  { id: 6, image: 'https://picsum.photos/seed/stars/600/400', icon: '✨', title: '星空之下', desc: '银河璀璨 · 斗转星移' },
  { id: 7, image: 'https://picsum.photos/seed/flowers/600/400', icon: '🌸', title: '花海漫野', desc: '春意盎然 · 繁花盛开' },
  { id: 8, image: 'https://picsum.photos/seed/lake/600/400', icon: '🛶', title: '湖光山色', desc: '宁静湖面 · 倒影如画' },
]

// ==== Refs ====
const sectionRef = ref<HTMLElement | null>(null)
const galleryRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const indicatorRef = ref<HTMLElement | null>(null)
const indicatorFillRef = ref<HTMLElement | null>(null)

const cardRefs = ref<HTMLElement[]>([])
const imgWrapRefs = ref<HTMLElement[]>([])
const imgRefs = ref<HTMLElement[]>([])
const shineRefs = ref<HTMLElement[]>([])
const glowRefs = ref<HTMLElement[]>([])

const setCardRef = (el: any, index: number) => { if (el) cardRefs.value[index] = el }
const setImgWrapRef = (el: any, index: number) => { if (el) imgWrapRefs.value[index] = el }
const setImgRef = (el: any, index: number) => { if (el) imgRefs.value[index] = el }
const setShineRef = (el: any, index: number) => { if (el) shineRefs.value[index] = el }
const setGlowRef = (el: any, index: number) => { if (el) glowRefs.value[index] = el }

// ==== 鼠标交互 ====
const onCardEnter = (e: MouseEvent, index: number) => {
  const img = imgRefs.value[index]
  const shine = shineRefs.value[index]
  const glow = glowRefs.value[index]
  const card = cardRefs.value[index]

  if (!img || !shine || !glow || !card) return

  // 图片放大 + 提亮
  gsap.to(img, {
    scale: 1.12,
    filter: 'brightness(1.15) saturate(1.2)',
    duration: 0.45,
    ease: 'power2.out',
    overwrite: 'auto'
  })

  // 光效扫过（从左到右）
  gsap.fromTo(shine,
    { x: '-120%', opacity: 0 },
    {
      x: '120%',
      opacity: 0.35,
      duration: 0.7,
      ease: 'power2.inOut',
      overwrite: 'auto',
      onComplete: () => {
        gsap.set(shine, { x: '120%', opacity: 0 })
      }
    }
  )

  // 底部光条亮起
  gsap.to(glow, {
    opacity: 1,
    scaleX: 1,
    duration: 0.4,
    ease: 'power2.out',
    overwrite: 'auto'
  })

  // 卡片微微上浮
  gsap.to(card, {
    y: -8,
    boxShadow: '0 20px 50px rgba(100, 130, 255, 0.25)',
    duration: 0.4,
    ease: 'power2.out',
    overwrite: 'auto'
  })
}

const onCardLeave = (_e: MouseEvent, index: number) => {
  const img = imgRefs.value[index]
  const shine = shineRefs.value[index]
  const glow = glowRefs.value[index]
  const card = cardRefs.value[index]

  if (!img || !shine || !glow || !card) return

  // 图片恢复
  gsap.to(img, {
    scale: 1,
    filter: 'brightness(1) saturate(1)',
    duration: 0.5,
    ease: 'power3.out',
    overwrite: 'auto'
  })

  // 光效消失
  gsap.to(shine, {
    opacity: 0,
    duration: 0.3,
    overwrite: 'auto'
  })

  // 底部光条熄灭
  gsap.to(glow, {
    opacity: 0,
    scaleX: 0.3,
    duration: 0.4,
    ease: 'power2.in',
    overwrite: 'auto'
  })

  // 卡片回位
  gsap.to(card, {
    y: 0,
    rotateX: 0,
    rotateY: 0,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
    duration: 0.5,
    ease: 'power3.out',
    overwrite: 'auto'
  })
}

const onCardMove = (e: MouseEvent, index: number) => {
  const card = cardRefs.value[index]
  if (!card) return

  const rect = card.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width - 0.5
  const y = (e.clientY - rect.top) / rect.height - 0.5

  // 轻微3D倾斜
  gsap.to(card, {
    rotateY: x * 6,
    rotateX: -y * 4,
    duration: 0.3,
    ease: 'power1.out',
    overwrite: 'auto'
  })
}

// ==== Canvas 粒子系统 ====
interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  life: number
  maxLife: number
}

let particles: Particle[] = []
let animId = 0
let canvasCtx: CanvasRenderingContext2D | null = null
let canvasW = 0
let canvasH = 0

function initParticles() {
  const canvas = canvasRef.value
  if (!canvas) return
  canvasCtx = canvas.getContext('2d')
  if (!canvasCtx) return

  const resizeCanvas = () => {
    canvasW = window.innerWidth
    canvasH = window.innerHeight
    canvas.width = canvasW
    canvas.height = canvasH
  }
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
  cleanupFns.push(() => window.removeEventListener('resize', resizeCanvas))

  // 初始粒子
  for (let i = 0; i < 40; i++) {
    particles.push(createParticle())
  }

  function createParticle(): Particle {
    return {
      x: Math.random() * canvasW,
      y: Math.random() * canvasH,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -(Math.random() * 0.6 + 0.2),
      size: Math.random() * 3 + 1,
      alpha: Math.random() * 0.4 + 0.1,
      life: 0,
      maxLife: Math.random() * 200 + 150
    }
  }

  function animate() {
    if (!canvasCtx) return
    canvasCtx.clearRect(0, 0, canvasW, canvasH)

    // 补充粒子
    if (particles.length < 40 && Math.random() < 0.3) {
      particles.push(createParticle())
    }

    particles = particles.filter(p => {
      p.life++
      if (p.life >= p.maxLife) return false

      p.x += p.vx
      p.y += p.vy

      const progress = p.life / p.maxLife
      const fadeOut = progress > 0.7 ? 1 - (progress - 0.7) / 0.3 : 1

      canvasCtx!.beginPath()
      canvasCtx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      canvasCtx!.fillStyle = `rgba(130, 160, 255, ${p.alpha * fadeOut})`
      canvasCtx!.fill()

      return true
    })

    animId = requestAnimationFrame(animate)
  }

  animate()
}

// ==== 滚动入场动画 ====
function setupScrollAnimation() {
  const container = sectionRef.value
  if (!container) return

  // 标题入场
  if (headerRef.value) {
    const headerEls = headerRef.value.querySelectorAll<HTMLElement>('.hr-badge, .hr-title, .hr-line, .hr-subtitle')
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top 80%',
        end: 'top 40%',
        scrub: false,
        toggleActions: 'play none none none'
      }
    })
    tl.fromTo(headerEls, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' })
    const st = ScrollTrigger.getAll().pop()
    if (st) cleanupFns.push(() => st.kill())
  }

  // 卡片依次入场
  const cardEls = cardRefs.value.filter(Boolean)
  cardEls.forEach((card, i) => {
    const st = ScrollTrigger.create({
      trigger: container,
      start: `top ${80 - i * 3}%`,
      end: 'top 30%',
      toggleActions: 'play none none none',
      onEnter: () => {
        gsap.fromTo(card,
          { y: 60, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, duration: 0.6, delay: i * 0.08, ease: 'back.out(1.4)' }
        )
      }
    })
    cleanupFns.push(() => st.kill())
  })

  // 进度条
  if (indicatorFillRef.value) {
    const st = ScrollTrigger.create({
      trigger: container,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.5,
      onUpdate(self) {
        const p = Math.min(1, Math.max(0, self.progress))
        if (indicatorFillRef.value) {
          indicatorFillRef.value.style.transform = `scaleX(${p * 100}%)`
        }
      }
    })
    cleanupFns.push(() => st.kill())
  }
}

// ==== 生命周期 ====
onMounted(() => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      initParticles()
      setupScrollAnimation()
    })
  })
})

onUnmounted(() => {
  cancelAnimationFrame(animId)
  cleanupFns.forEach(fn => fn())
})
</script>

<style scoped lang="scss">
/* ═══════════════════════════════════════════
   Hover Reveal — 光效揭示
   类名前缀: hr-
   ═══════════════════════════════════════════ */

.hr-section {
  position: relative;
  width: 100vw;
  min-height: 100vh;
  overflow: hidden;
  background: #080c1a;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0 60px;
}

/* ===== 背景 ===== */
.hr-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(ellipse 80% 60% at 50% 0%, rgba(100, 130, 255, 0.08) 0%, transparent 60%),
    radial-gradient(ellipse 60% 50% at 20% 80%, rgba(120, 80, 220, 0.06) 0%, transparent 50%),
    radial-gradient(ellipse 60% 50% at 80% 70%, rgba(80, 160, 240, 0.05) 0%, transparent 50%),
    linear-gradient(180deg, #0a0e1f 0%, #080c1a 40%, #060a16 100%);
}

/* ===== Canvas 粒子 ===== */
.hr-particles {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

/* ===== 前景暗角 ===== */
.hr-vignette {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background: radial-gradient(ellipse 70% 80% at 50% 50%, transparent 50%, rgba(4, 6, 18, 0.5) 100%);
}

/* ===== 标题区 ===== */
.hr-header {
  position: relative;
  z-index: 3;
  text-align: center;
  margin-bottom: 40px;
  padding-top: 20px;
}

.hr-badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 3px;
  color: #8899ee;
  background: rgba(100, 130, 255, 0.1);
  border: 1px solid rgba(100, 130, 255, 0.2);
  border-radius: 50px;
  padding: 6px 20px;
  margin-bottom: 16px;
  text-transform: uppercase;
}

.hr-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 12px;
  letter-spacing: 2px;
  background: linear-gradient(135deg, #a8c0ff, #c4b5fd);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hr-line {
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(100, 130, 255, 0.6), transparent);
  margin: 0 auto 16px;
}

.hr-subtitle {
  font-size: 14px;
  color: rgba(180, 200, 240, 0.7);
  font-weight: 400;
  letter-spacing: 1px;
  margin: 0;
}

/* ===== 图片画廊 ===== */
.hr-gallery {
  position: relative;
  z-index: 3;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  width: 90vw;
  max-width: 1300px;
  padding: 0 20px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

/* ===== 卡片 ===== */
.hr-card {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  background: rgba(20, 30, 60, 0.5);
  border: 1px solid rgba(100, 130, 255, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transform-style: preserve-3d;
  transition: border-color 0.3s ease;
  will-change: transform, box-shadow;

  &:hover {
    border-color: rgba(100, 130, 255, 0.3);
  }
}

/* ===== 图片容器 ===== */
.hr-image-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 2;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 60%, rgba(8, 12, 26, 0.6) 100%);
    z-index: 2;
    pointer-events: none;
  }
}

.hr-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
  will-change: transform, filter;
}

/* ===== 光效扫过层 ===== */
.hr-shine {
  position: absolute;
  top: 0;
  left: 0;
  width: 80%;
  height: 100%;
  z-index: 3;
  pointer-events: none;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0) 30%,
    rgba(255, 255, 255, 0.15) 45%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0.15) 55%,
    rgba(255, 255, 255, 0) 70%,
    transparent 100%
  );
  transform: skewX(-20deg);
  opacity: 0;
}

/* ===== 卡片内容 ===== */
.hr-card-body {
  position: relative;
  z-index: 4;
  padding: 14px 16px;
}

.hr-card-icon {
  font-size: 20px;
  margin-bottom: 6px;
}

.hr-card-title {
  font-size: 15px;
  font-weight: 600;
  color: #e8ecff;
  margin: 0 0 4px;
}

.hr-card-desc {
  font-size: 12px;
  color: rgba(160, 180, 220, 0.7);
  margin: 0;
  letter-spacing: 0.5px;
}

/* ===== 底部光条 ===== */
.hr-card-glow {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%) scaleX(0.3);
  width: 80%;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(100, 150, 255, 0.8), transparent);
  opacity: 0;
  z-index: 5;
  border-radius: 2px;
}

/* ===== 底部指示器 ===== */
.hr-indicator {
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-top: 40px;
}

.hr-indicator-track {
  width: 180px;
  height: 2px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 1px;
  overflow: hidden;
}

.hr-indicator-fill {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, rgba(100, 130, 255, 0.6), rgba(150, 180, 255, 0.8));
  border-radius: 1px;
  transform-origin: left;
  transform: scaleX(0);
}

.hr-indicator-text {
  font-size: 11px;
  color: rgba(160, 180, 220, 0.5);
  letter-spacing: 1.5px;
}
</style>
