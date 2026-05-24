<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type CleanupFn = () => void

// ═══════════════════════════════════════════
//  Prism Reflect Pro — 棱镜折射反射（增强版）
//
//  核心概念:
//  1. 三棱镜分光效果 (RGB色散)
//  2. 多层玻璃折射叠加，创造彩虹光谱
//  3. 碎片化三角形拼接，动态组装
//  4. 镜面倒影 + 光晕散射
//  5. Canvas 粒子系统增强光影效果
//  6. 全屏沉浸式设计 (100vw × 100vh)
// ═══════════════════════════════════════════

const imageA = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80'
const imageB = 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&q=80'

// 三角形网格配置 (12×8 = 96片)
const COLS = 12
const ROWS = 8
const TOTAL = COLS * ROWS

interface PrismFragment {
  id: number
  col: number
  row: number
  offsetX: number // ±100px
  offsetY: number // ±100px
  rotation: number // ±45°
  scale: number // 0.5-0.85
  hue: number // 色相偏移 (0-360)
  delay: number // 动画延迟
}

// 生成三角形碎片数据
const fragments: PrismFragment[] = []
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    fragments.push({
      id: r * COLS + c,
      col: c,
      row: r,
      offsetX: (Math.random() - 0.5) * 200,
      offsetY: (Math.random() - 0.5) * 200,
      rotation: (Math.random() - 0.5) * 90,
      scale: 0.5 + Math.random() * 0.35,
      hue: Math.random() * 360,
      delay: (r / ROWS) * 0.3 + (c / COLS) * 0.3
    })
  }
}

const sectionRef = ref<HTMLElement | null>(null)
const stageRef = ref<HTMLElement | null>(null)
const fragmentRefs = ref<(HTMLElement | null)[]>([])
const canvasRef = ref<HTMLCanvasElement | null>(null)
const heroRef = ref<HTMLElement | null>(null)
const heroTagRef = ref<HTMLElement | null>(null)
const heroTitleRef = ref<HTMLElement | null>(null)
const heroLineRef = ref<HTMLElement | null>(null)
const heroSubRef = ref<HTMLElement | null>(null)

const cleanupFns: CleanupFn[] = []

onMounted(() => {
  if (!sectionRef.value || !stageRef.value) return

  // === Canvas 粒子系统 ===
  const canvas = canvasRef.value
  let cw = 0,
    ch = 0
  let particles: Array<{
    x: number
    y: number
    vx: number
    vy: number
    r: number
    alpha: number
    life: number
    maxLife: number
    hue: number
  }> = []
  let particleAnimId = 0

  if (canvas) {
    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect()
      cw = canvas.width = rect.width
      ch = canvas.height = rect.height
    }
    resize()
    window.addEventListener('resize', resize)

    function spawn(progress: number) {
      if (progress < 0.08 || progress > 0.92) return
      if (Math.random() > progress * 0.4) return

      const count = Math.floor(progress * 3)
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * cw,
          y: ch * (0.85 + Math.random() * 0.15),
          vx: (Math.random() - 0.5) * 1.2,
          vy: -(Math.random() * 1.5 + 0.5),
          r: Math.random() * 2 + 1,
          alpha: Math.random() * 0.7 + 0.3,
          life: 0,
          maxLife: 100 + Math.random() * 150,
          hue: Math.random() * 360
        })
      }
    }

    function draw() {
      if (!canvas) return
      const ctx = canvas.getContext('2d')!
      ctx.clearRect(0, 0, cw, ch)

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.life++
        if (p.life > p.maxLife) {
          particles.splice(i, 1)
          continue
        }

        const t = p.life / p.maxLife
        const a = p.alpha * (1 - t) * (1 - t)
        p.x += p.vx
        p.y += p.vy
        p.vy -= 0.003

        // 绘制彩色光点
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r + t * 2, 0, Math.PI * 2)
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3)
        gradient.addColorStop(0, `hsla(${p.hue}, 100%, 70%, ${a})`)
        gradient.addColorStop(1, `hsla(${p.hue}, 100%, 50%, 0)`)
        ctx.fillStyle = gradient
        ctx.fill()
      }
    }

    ;(globalThis as any).__prismSpawn = spawn

    function loop() {
      draw()
      particleAnimId = requestAnimationFrame(loop)
    }
    particleAnimId = requestAnimationFrame(loop)

    cleanupFns.push(() => {
      cancelAnimationFrame(particleAnimId)
      delete (globalThis as any).__prismSpawn
      window.removeEventListener('resize', resize)
    })
  }

  // === GSAP 动画上下文 ===
  const ctx = gsap.context(() => {
    // === 碎片组装动画 ===
    const fragmentTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.value!,
        start: 'top 70%', // 提前展示
        end: 'bottom 10%',
        scrub: 2, // 更流畅
        toggleActions: 'play none none reverse'
      }
    })

    fragmentTl.fromTo(
      fragmentRefs.value,
      {
        opacity: 0,
        filter: (i: number) => `blur(25px) hue-rotate(${fragments[i].hue}deg)`,
        x: (i: number) => fragments[i].offsetX,
        y: (i: number) => fragments[i].offsetY,
        rotation: (i: number) => fragments[i].rotation,
        scale: (i: number) => fragments[i].scale
      },
      {
        opacity: 1,
        filter: 'blur(0px) hue-rotate(0deg)',
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        duration: 1.5,
        stagger: {
          amount: 1.5,
          grid: [COLS, ROWS],
          from: 'center'
        },
        ease: 'power3.out',
        onUpdate: function () {
          ;(globalThis as any).__prismSpawn?.(this.progress())
        }
      }
    )

    // === 标题入场动画 ===
    if (heroRef.value) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.value!,
          start: 'top 50%',
          end: 'top 10%',
          scrub: 1
        }
      })
      tl.fromTo(heroRef.value, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.2 }, 0)
      tl.fromTo(heroTagRef.value, { opacity: 0, x: -15 }, { opacity: 1, x: 0, duration: 0.7 }, 0.08)
      tl.fromTo(
        heroTitleRef.value,
        { opacity: 0, y: 18, filter: 'blur(4px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9 },
        0.1
      )
      tl.fromTo(
        heroLineRef.value,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.7 },
        0.15
      )
      tl.fromTo(heroSubRef.value, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6 }, 0.18)
      cleanupFns.push(() => tl.kill())
    }
  }, sectionRef.value)

  cleanupFns.push(() => ctx.revert())
})

onUnmounted(() => {
  cleanupFns.forEach((fn) => fn())
  if (sectionRef.value) {
    ScrollTrigger.getAll().forEach((st) => {
      if (st.vars.trigger === sectionRef.value) st.kill()
    })
  }
})
</script>

<template>
  <div class="pr-section" ref="sectionRef">
    <!-- 背景渐变 -->
    <div class="pr-bg"></div>

    <!-- 主舞台 -->
    <div class="pr-stage" ref="stageRef">
      <!-- 三角形碎片网格 -->
      <div
        v-for="(frag, i) in fragments"
        :key="frag.id"
        class="pr-fragment"
        :ref="(el) => (fragmentRefs[i] = el as HTMLElement | null)"
        :style="{
          left: `${(frag.col / COLS) * 100}%`,
          top: `${(frag.row / ROWS) * 100}%`,
          width: `${100 / COLS}%`,
          height: `${100 / ROWS}%`,
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
        }"
      >
        <!-- 正面: 图片A -->
        <div
          class="pr-fragment-face pr-front"
          :style="{
            backgroundImage: `url(${imageA})`,
            backgroundSize: `${COLS * 100}% ${ROWS * 100}%`,
            backgroundPosition: `${(frag.col / (COLS - 1)) * 100}% ${(frag.row / (ROWS - 1)) * 100}%`
          }"
        ></div>
        <!-- 背面: 图片B (hover翻转可见) -->
        <div
          class="pr-fragment-face pr-back"
          :style="{
            backgroundImage: `url(${imageB})`,
            backgroundSize: `${COLS * 100}% ${ROWS * 100}%`,
            backgroundPosition: `${(frag.col / (COLS - 1)) * 100}% ${(frag.row / (ROWS - 1)) * 100}%`
          }"
        ></div>
      </div>

      <!-- Canvas 粒子层 -->
      <canvas class="pr-particles" ref="canvasRef"></canvas>
    </div>

    <!-- 标题区 -->
    <div class="pr-hero" ref="heroRef">
      <div class="pr-hero-tag" ref="heroTagRef">PRISM REFLECT</div>
      <h2 class="pr-hero-title" ref="heroTitleRef">棱镜折射</h2>
      <div class="pr-hero-line" ref="heroLineRef"></div>
      <p class="pr-hero-sub" ref="heroSubRef">Spectrum · Refraction · Rainbow Dispersion</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pr-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #1a0033 0%, #0d001a 50%, #000000 100%);
  font-family: 'Inter', 'PingFang SC', system-ui, sans-serif;
}

.pr-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(ellipse at 30% 20%, rgba(120, 0, 255, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 80%, rgba(255, 0, 128, 0.12) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(0, 128, 255, 0.1) 0%, transparent 60%);
}

// ==== 主舞台 ====
.pr-stage {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(85vw, 1200px);
  aspect-ratio: 16 / 9;
  z-index: 2;
  border-radius: 12px;
  overflow: visible;
  box-shadow:
    0 0 120px rgba(120, 0, 255, 0.08),
    0 0 240px rgba(255, 0, 128, 0.06),
    0 0 360px rgba(0, 128, 255, 0.04);
}

// ==== 三角形碎片 ====
.pr-fragment {
  position: absolute;
  overflow: hidden;
  will-change: transform, opacity, filter;
  transform-style: preserve-3d;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);

  &:hover {
    z-index: 10;
    .pr-front {
      transform: rotateY(180deg);
    }
    .pr-back {
      transform: rotateY(360deg);
    }
  }
}

.pr-fragment-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.pr-front {
  transform: rotateY(0deg);
  filter: brightness(1.1) saturate(1.2);
}

.pr-back {
  transform: rotateY(180deg);
  filter: brightness(0.9) saturate(1.3);
}

// ==== Canvas 粒子层 ====
.pr-particles {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
}

// ==== 标题区 ====
.pr-hero {
  position: absolute;
  top: clamp(18px, 4vh, 44px);
  left: clamp(20px, 8vw, 80px);
  z-index: 15;
  text-align: left;
  opacity: 0;
}

.pr-hero-tag {
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(180, 120, 255, 0.8);
  margin-bottom: 8px;
  text-shadow: 0 0 20px rgba(180, 120, 255, 0.5);
}

.pr-hero-title {
  font-size: clamp(2rem, 5.5vw, 3.6rem);
  font-weight: 800;
  color: #fff;
  margin: 0;
  line-height: 1.1;
  text-shadow:
    0 0 50px rgba(180, 120, 255, 0.6),
    0 0 100px rgba(255, 0, 128, 0.4),
    0 0 150px rgba(0, 128, 255, 0.3);
  letter-spacing: 0.05em;
  background: linear-gradient(90deg, #ff0080, #ff8c00, #40e0d0, #7b68ee);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.pr-hero-line {
  width: clamp(40px, 10vw, 80px);
  height: 3px;
  margin: 10px 0 12px;
  border-radius: 2px;
  background: linear-gradient(
    90deg,
    rgba(255, 0, 128, 0.9),
    rgba(255, 140, 0, 0.7),
    rgba(64, 224, 208, 0.5),
    transparent
  );
  box-shadow: 0 0 15px rgba(255, 0, 128, 0.6);
}

.pr-hero-sub {
  font-size: clamp(0.62rem, 1.4vw, 0.82rem);
  font-weight: 400;
  letter-spacing: 0.14em;
  color: rgba(200, 180, 255, 0.6);
  margin: 0;
}

@media (max-width: 768px) {
  .pr-stage {
    width: 94vw;
  }
  .pr-hero-title {
    font-size: 1.5rem;
  }
  .pr-hero-sub {
    font-size: 0.65rem;
  }
}
</style>
