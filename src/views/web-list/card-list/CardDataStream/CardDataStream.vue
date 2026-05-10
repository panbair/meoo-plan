<template>
  <section ref="sectionRef" class="data-stream-section">
    <!-- 背景：数据流效果 -->
    <canvas ref="canvasRef" class="data-canvas"></canvas>

    <!-- 内容层 -->
    <div class="content-layer">
      <!-- 顶部标题 -->
      <header ref="headerRef" class="stream-header">
        <div class="header-badge stream-badge">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
          </svg>
        </div>

        <div class="title-container">
          <h1 class="title-line">数据流</h1>
          <h1 class="title-line title-accent">形变卡片</h1>
        </div>

        <p class="header-subtitle">Dynamic Data Stream Morphing Cards</p>

        <div class="header-decoration">
          <span class="deco-line"></span>
          <span class="deco-dot"></span>
          <span class="deco-line"></span>
        </div>
      </header>

      <!-- 卡片容器 -->
      <div class="stream-cards">
        <!-- 卡片1: 神经网络 -->
        <div class="stream-card morph-card card-neural" data-index="0">
          <div class="card-bg-morph"></div>
          <div class="card-morph-border"></div>
          <div class="card-content">
            <div class="card-visual">
              <svg class="morph-icon" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="12" r="6" stroke="currentColor" stroke-width="2"/>
                <circle cx="12" cy="32" r="6" stroke="currentColor" stroke-width="2"/>
                <circle cx="52" cy="32" r="6" stroke="currentColor" stroke-width="2"/>
                <circle cx="20" cy="52" r="6" stroke="currentColor" stroke-width="2"/>
                <circle cx="44" cy="52" r="6" stroke="currentColor" stroke-width="2"/>
                <path d="M32 18V26M22 32H18M46 32H42M24 50L26 42M40 50L38 42M38 26L44 30M26 26L20 30" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <div class="card-number">01</div>
            <h3 class="card-title">Neural Net</h3>
            <p class="card-desc">神经网络数据处理</p>
            <div class="card-stats">
              <div class="stat-item">
                <span class="stat-value">10B</span>
                <span class="stat-label">参数</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">99.2%</span>
                <span class="stat-label">准确率</span>
              </div>
            </div>
          </div>
          <div class="card-morph-glow"></div>
        </div>

        <!-- 卡片2: 数据流 -->
        <div class="stream-card morph-card card-flow" data-index="1">
          <div class="card-bg-morph"></div>
          <div class="card-morph-border"></div>
          <div class="card-content">
            <div class="card-visual">
              <svg class="morph-icon" viewBox="0 0 64 64" fill="none">
                <path d="M8 16H56" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M8 32H56" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M8 48H56" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <circle cx="20" cy="16" r="4" fill="currentColor"/>
                <circle cx="44" cy="32" r="4" fill="currentColor"/>
                <circle cx="32" cy="48" r="4" fill="currentColor"/>
                <path d="M24 16L24 32L44 32L44 48" stroke="currentColor" stroke-width="2" stroke-dasharray="4 2"/>
              </svg>
            </div>
            <div class="card-number">02</div>
            <h3 class="card-title">Data Flow</h3>
            <p class="card-desc">实时数据流处理</p>
            <div class="card-stats">
              <div class="stat-item">
                <span class="stat-value">1M</span>
                <span class="stat-label">QPS</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">&lt;5ms</span>
                <span class="stat-label">延迟</span>
              </div>
            </div>
          </div>
          <div class="card-morph-glow"></div>
        </div>

        <!-- 卡片3: 云端同步 -->
        <div class="stream-card morph-card card-cloud" data-index="2">
          <div class="card-bg-morph"></div>
          <div class="card-morph-border"></div>
          <div class="card-content">
            <div class="card-visual">
              <svg class="morph-icon" viewBox="0 0 64 64" fill="none">
                <path d="M48 40C52.4183 40 56 36.4183 56 32C56 27.5817 52.4183 24 48 24C47.32 24 46.66 24.12 46.04 24.34C43.36 13.08 33.28 4.8 21.44 5.68C9.6 6.56 0.68 17.12 1.56 28.96C2.44 40.8 13 49.72 24.84 48.84C31.92 48.34 37.96 44.38 41.68 38.68" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M32 52L32 44" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M24 48L28 44" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M40 48L36 44" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="card-number">03</div>
            <h3 class="card-title">Cloud Sync</h3>
            <p class="card-desc">云端数据同步</p>
            <div class="card-stats">
              <div class="stat-item">
                <span class="stat-value">5TB</span>
                <span class="stat-label">存储</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">100%</span>
                <span class="stat-label">同步</span>
              </div>
            </div>
          </div>
          <div class="card-morph-glow"></div>
        </div>

        <!-- 卡片4: AI核心 -->
        <div class="stream-card morph-card card-ai" data-index="3">
          <div class="card-bg-morph"></div>
          <div class="card-morph-border"></div>
          <div class="card-content">
            <div class="card-visual">
              <svg class="morph-icon" viewBox="0 0 64 64" fill="none">
                <polygon points="32,4 60,20 60,44 32,60 4,44 4,20" stroke="currentColor" stroke-width="2"/>
                <polygon points="32,16 48,26 48,38 32,48 16,38 16,26" stroke="currentColor" stroke-width="2" opacity="0.6"/>
                <circle cx="32" cy="32" r="6" fill="currentColor"/>
              </svg>
            </div>
            <div class="card-number">04</div>
            <h3 class="card-title">AI Core</h3>
            <p class="card-desc">AI计算核心引擎</p>
            <div class="card-stats">
              <div class="stat-item">
                <span class="stat-value">1000</span>
                <span class="stat-label">TOPS</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">3nm</span>
                <span class="stat-label">工艺</span>
              </div>
            </div>
          </div>
          <div class="card-morph-glow"></div>
        </div>
      </div>
    </div>

    <!-- 底部装饰 -->
    <div ref="footerRef" class="stream-footer">
      <div class="footer-morph-line"></div>
      <span class="footer-text">Data Stream Visualization</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Refs
const sectionRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

// Cleanup functions
let cleanupFns: (() => void)[] = []
let animationFrameId: number | null = null
let ctx: CanvasRenderingContext2D | null = null
let particles: Particle[] = []

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  color: string
  morphPhase: number
  morphSpeed: number
}

// Canvas setup
const setupCanvas = () => {
  if (!canvasRef.value) return

  const canvas = canvasRef.value
  ctx = canvas.getContext('2d')

  const resize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    initParticles()
  }

  resize()
  window.addEventListener('resize', resize)
  cleanupFns.push(() => window.removeEventListener('resize', resize))
}

const initParticles = () => {
  if (!canvasRef.value) return

  particles = []
  const count = Math.floor((canvasRef.value.width * canvasRef.value.height) / 15000)
  const colors = ['#8b5cf6', '#3b82f6', '#06b6d4', '#f59e0b']

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * (canvasRef.value?.width || 0),
      y: Math.random() * (canvasRef.value?.height || 0),
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 3 + 1,
      alpha: Math.random() * 0.5 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      morphPhase: Math.random() * Math.PI * 2,
      morphSpeed: Math.random() * 0.02 + 0.01
    })
  }
}

const drawParticles = () => {
  if (!ctx || !canvasRef.value) return

  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)

  // Draw particles
  particles.forEach((p, i) => {
    // Update position
    p.x += p.vx
    p.y += p.vy
    p.morphPhase += p.morphSpeed

    // Morph effect - size oscillation
    const morphSize = p.size * (1 + Math.sin(p.morphPhase) * 0.5)

    // Bounce off edges
    if (p.x < 0 || p.x > canvasRef.value!.width) p.vx *= -1
    if (p.y < 0 || p.y > canvasRef.value!.height) p.vy *= -1

    // Draw particle with morph shape (diamond)
    ctx!.save()
    ctx!.translate(p.x, p.y)
    ctx!.rotate(p.morphPhase * 0.5)
    ctx!.beginPath()
    ctx!.moveTo(0, -morphSize * 2)
    ctx!.lineTo(morphSize, 0)
    ctx!.lineTo(0, morphSize * 2)
    ctx!.lineTo(-morphSize, 0)
    ctx!.closePath()
    ctx!.fillStyle = p.color
    ctx!.globalAlpha = p.alpha
    ctx!.fill()
    ctx!.restore()

    // Draw connections
    particles.slice(i + 1).forEach(p2 => {
      const dx = p.x - p2.x
      const dy = p.y - p2.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < 120) {
        ctx!.beginPath()
        ctx!.moveTo(p.x, p.y)
        ctx!.lineTo(p2.x, p2.y)
        ctx!.strokeStyle = p.color
        ctx!.globalAlpha = (1 - dist / 120) * 0.3
        ctx!.lineWidth = 0.5
        ctx!.stroke()
      }
    })
  })

  animationFrameId = requestAnimationFrame(drawParticles)
}

// ============================================================
// GSAP 动画
// ============================================================

const initAnimations = () => {
  // 标题入场动画 - 从中心展开
  if (headerRef.value) {
    const tl = gsap.timeline()

    tl.fromTo('.stream-badge',
      { scale: 0, opacity: 0, rotation: -180 },
      { scale: 1, opacity: 1, rotation: 0, duration: 0.6, ease: 'back.out(2)' }
    )
    .fromTo('.title-container',
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, ease: 'elastic.out(1, 0.5)' },
      '-=0.3'
    )
    .fromTo('.title-line',
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.15, duration: 0.6, ease: 'power2.out' },
      '-=0.5'
    )
    .fromTo('.header-subtitle',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
      '-=0.3'
    )
    .fromTo('.deco-line',
      { scaleX: 0 },
      { scaleX: 1, duration: 0.4, stagger: 0.1, ease: 'power2.inOut' },
      '-=0.2'
    )
    .fromTo('.deco-dot',
      { scale: 0 },
      { scale: 1, duration: 0.3, ease: 'back.out(3)' },
      '-=0.2'
    )

    cleanupFns.push(() => tl.kill())
  }

  // 卡片形变入场动画
  const cards = document.querySelectorAll('.morph-card')
  if (cards.length > 0) {
    // 设置卡片初始形变状态
    gsap.set(cards, {
      opacity: 0,
      scale: 0.2,
      borderRadius: '50%',
      rotation: 0
    })

    const cardTl = gsap.timeline()

    // 卡片1: 从圆形形变展开
    cardTl.to(cards[0],
      {
        opacity: 1,
        scale: 1,
        borderRadius: '24px',
        rotation: -5,
        duration: 1,
        ease: 'elastic.out(1, 0.6)'
      },
      0.4
    )
    // 卡片2: 从椭圆形形变展开
    .fromTo(cards[1],
      { scaleX: 0.3, scaleY: 0.8 },
      {
        opacity: 1,
        scale: 1,
        scaleX: 1,
        scaleY: 1,
        borderRadius: '24px',
        rotation: 3,
        duration: 1,
        ease: 'elastic.out(1, 0.6)'
      },
      0.55
    )
    // 卡片3: 从菱形形变展开
    .to(cards[2],
      {
        opacity: 1,
        scale: 1,
        borderRadius: '24px',
        rotation: -3,
        skewX: 0,
        duration: 1,
        ease: 'elastic.out(1, 0.6)'
      },
      0.7
    )
    // 卡片4: 从六边形形变展开
    .to(cards[3],
      {
        opacity: 1,
        scale: 1,
        borderRadius: '24px',
        rotation: 5,
        duration: 1,
        ease: 'elastic.out(1, 0.6)'
      },
      0.85
    )

    cleanupFns.push(() => cardTl.kill())
  }

  // 底部装饰入场
  if (footerRef.value) {
    gsap.fromTo(footerRef.value,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', delay: 1.2 }
    )
  }

  // 滚动动画
  if (sectionRef.value) {
    // 卡片滚动形变动画
    const scrollCards = document.querySelectorAll('.morph-card')
    scrollCards.forEach((card, index) => {
      const direction = index % 2 === 0 ? 1 : -1

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5
        }
      })

      // 形变 + 位移 + 旋转 + 缩放组合
      scrollTl
        .to(card, {
          y: -100 - index * 30,
          scale: 0.85 - index * 0.05,
          borderRadius: index % 2 === 0 ? '50%' : '10px',
          skewX: direction * 5,
          rotation: direction * (10 + index * 5),
          duration: 1
        })
        .to(card, {
          opacity: 0,
          scale: 0.5,
          duration: 0.5
        }, '-=0.3')

      cleanupFns.push(() => scrollTl.kill())
    })

    // 标题滚动形变消失
    if (headerRef.value) {
      gsap.to(headerRef.value, {
        y: -200,
        opacity: 0,
        scale: 0.8,
        skewX: 10,
        rotation: 5,
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top top',
          end: '30% top',
          scrub: 1
        }
      })
    }

    // 底部装饰滚动消失
    if (footerRef.value) {
      gsap.to(footerRef.value, {
        y: 100,
        opacity: 0,
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top top',
          end: '50% top',
          scrub: 1
        }
      })
    }
  }
}

// ============================================================
// 生命周期
// ============================================================

onMounted(() => {
  setupCanvas()
  drawParticles()
  initAnimations()
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})
</script>

<style lang="scss" scoped>
.data-stream-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%);
}

// ============================================================
// Canvas 背景
// ============================================================

.data-canvas {
  position: absolute;
  inset: 0;
  z-index: 0;
}

// ============================================================
// 内容层
// ============================================================

.content-layer {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 80px;
}

// ============================================================
// 头部标题
// ============================================================

.stream-header {
  text-align: center;
  margin-bottom: 60px;
  perspective: 1000px;
}

.header-badge {
  width: 60px;
  height: 60px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #8b5cf6, #06b6d4);
  border-radius: 16px;
  color: #fff;

  svg {
    width: 32px;
    height: 32px;
  }
}

.title-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  transform-style: preserve-3d;
}

.title-line {
  font-size: 56px;
  font-weight: 900;
  letter-spacing: 8px;
  color: transparent;
  background: linear-gradient(90deg, #8b5cf6, #06b6d4, #f59e0b);
  background-clip: text;
  -webkit-background-clip: text;
  margin: 0;
  line-height: 1.1;

  &.title-accent {
    font-size: 72px;
    background: linear-gradient(90deg, #06b6d4, #8b5cf6, #ec4899);
    background-clip: text;
    -webkit-background-clip: text;
    margin-top: -10px;
  }
}

.header-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 4px;
  margin-top: 20px;
}

.header-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 24px;

  .deco-line {
    width: 80px;
    height: 2px;
    background: linear-gradient(90deg, transparent, #8b5cf6, transparent);
    transform-origin: center;
  }

  .deco-dot {
    width: 8px;
    height: 8px;
    background: #8b5cf6;
    border-radius: 50%;
    box-shadow: 0 0 10px #8b5cf6;
  }
}

// ============================================================
// 卡片容器
// ============================================================

.stream-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
  width: 100%;
  max-width: 900px;
}

// ============================================================
// 形变卡片
// ============================================================

.stream-card {
  position: relative;
  padding: 32px;
  border-radius: 24px;
  background: rgba(15, 15, 26, 0.8);
  backdrop-filter: blur(20px);
  overflow: hidden;
  cursor: pointer;
  transform-style: preserve-3d;
  transition: transform 0.4s ease, box-shadow 0.4s ease;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.3), transparent 50%, rgba(6, 182, 212, 0.3));
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  &:hover {
    transform: translateY(-12px) rotateX(5deg) rotateY(-5deg);

    &::before {
      opacity: 1;
    }

    .card-morph-glow {
      opacity: 0.8;
    }

    .card-bg-morph {
      transform: scale(1.1);
    }

    .morph-icon {
      transform: scale(1.1) rotate(10deg);
    }
  }

  // 卡片颜色变体
  &.card-neural {
    .card-bg-morph { background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(139, 92, 246, 0.05)); }
    .card-morph-glow { background: radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.4), transparent 70%); }
    .card-morph-border { border-color: rgba(139, 92, 246, 0.3); }
    .card-number { color: #8b5cf6; }
    .card-title { color: #8b5cf6; }
    .morph-icon { color: #8b5cf6; }
  }

  &.card-flow {
    .card-bg-morph { background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.05)); }
    .card-morph-glow { background: radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.4), transparent 70%); }
    .card-morph-border { border-color: rgba(59, 130, 246, 0.3); }
    .card-number { color: #3b82f6; }
    .card-title { color: #3b82f6; }
    .morph-icon { color: #3b82f6; }
  }

  &.card-cloud {
    .card-bg-morph { background: linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(6, 182, 212, 0.05)); }
    .card-morph-glow { background: radial-gradient(circle at 50% 0%, rgba(6, 182, 212, 0.4), transparent 70%); }
    .card-morph-border { border-color: rgba(6, 182, 212, 0.3); }
    .card-number { color: #06b6d4; }
    .card-title { color: #06b6d4; }
    .morph-icon { color: #06b6d4; }
  }

  &.card-ai {
    .card-bg-morph { background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.05)); }
    .card-morph-glow { background: radial-gradient(circle at 50% 0%, rgba(245, 158, 11, 0.4), transparent 70%); }
    .card-morph-border { border-color: rgba(245, 158, 11, 0.3); }
    .card-number { color: #f59e0b; }
    .card-title { color: #f59e0b; }
    .morph-icon { color: #f59e0b; }
  }
}

// 卡片背景形变层
.card-bg-morph {
  position: absolute;
  inset: 0;
  transition: transform 0.4s ease;
  clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%);
}

// 卡片边框装饰
.card-morph-border {
  position: absolute;
  inset: 0;
  border: 2px dashed;
  border-radius: 24px;
  opacity: 0.3;
  animation: borderRotate 20s linear infinite;
}

@keyframes borderRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

// 发光层
.card-morph-glow {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

// 卡片内容
.card-content {
  position: relative;
  z-index: 2;
}

.card-visual {
  margin-bottom: 20px;
}

.morph-icon {
  width: 64px;
  height: 64px;
  transition: transform 0.4s ease;
}

.card-number {
  font-size: 48px;
  font-weight: 900;
  opacity: 0.3;
  line-height: 1;
  margin-bottom: 8px;
}

.card-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
}

.card-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 20px;
}

.card-stats {
  display: flex;
  gap: 24px;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
}

.stat-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 1px;
}

// ============================================================
// 底部装饰
// ============================================================

.stream-footer {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 2;
}

.footer-morph-line {
  width: 200px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #8b5cf6, #06b6d4, transparent);
  margin: 0 auto 16px;
}

.footer-text {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.3);
  letter-spacing: 3px;
  text-transform: uppercase;
}
</style>
