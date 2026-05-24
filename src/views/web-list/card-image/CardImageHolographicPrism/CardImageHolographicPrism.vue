<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type CleanupFn = () => void

// ═══════════════════════════════════════════
//  Holographic Prism Burst — 全息棱镜爆发（增强版）
//
//  核心概念:
//  1. 主图片被棱镜切割为6个三角形碎片
//  2. 每个碎片显示不同的衍生图片（同一主题）
//  3. 滚动时碎片从中心向外爆发扩散
//  4. Canvas 光效系统（激光束+光晕）
//  5. 碎片旋转 + 缩放 + 透明度组合动画
//  6. 彩虹色边框发光特效
// ═══════════════════════════════════════════

// === 6张相关主题的图片 ===
const images = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', // 山峰1
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80', // 山峰2
  'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80', // 山峰3
  'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80', // 山峰4
  'https://images.unsplash.com/photo-1486870591958-6bde2e414fa4?w=800&q=80', // 山峰5
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80' // 山峰6
]

// === 6个三角形碎片配置（全屏版）===
interface PrismFragment {
  id: number
  clipPath: string
  rotation: number
  scale: number
  x: number
  y: number
  hue: number
  delay: number
}

const fragments: PrismFragment[] = [
  {
    id: 0,
    clipPath: 'polygon(50% 50%, 0% 0%, 100% 0%)', // 上
    rotation: 0,
    scale: 0.2,
    x: 0,
    y: -200,
    hue: 0,
    delay: 0
  },
  {
    id: 1,
    clipPath: 'polygon(50% 50%, 100% 0%, 100% 50%)', // 右上
    rotation: 60,
    scale: 0.2,
    x: 180,
    y: -100,
    hue: 60,
    delay: 0.05
  },
  {
    id: 2,
    clipPath: 'polygon(50% 50%, 100% 50%, 100% 100%)', // 右下
    rotation: 120,
    scale: 0.2,
    x: 180,
    y: 100,
    hue: 120,
    delay: 0.1
  },
  {
    id: 3,
    clipPath: 'polygon(50% 50%, 100% 100%, 0% 100%)', // 下
    rotation: 180,
    scale: 0.2,
    x: 0,
    y: 200,
    hue: 180,
    delay: 0.15
  },
  {
    id: 4,
    clipPath: 'polygon(50% 50%, 0% 100%, 0% 50%)', // 左下
    rotation: 240,
    scale: 0.2,
    x: -180,
    y: 100,
    hue: 240,
    delay: 0.2
  },
  {
    id: 5,
    clipPath: 'polygon(50% 50%, 0% 50%, 0% 0%)', // 左上
    rotation: 300,
    scale: 0.2,
    x: -180,
    y: -100,
    hue: 300,
    delay: 0.25
  }
]

const sectionRef = ref<HTMLElement | null>(null)
const fragmentRefs = ref<(HTMLElement | null)[]>([])
const canvasRef = ref<HTMLCanvasElement | null>(null)
const centerGlowRef = ref<HTMLElement | null>(null)
const heroRef = ref<HTMLElement | null>(null)
const heroTagRef = ref<HTMLElement | null>(null)
const heroTitleRef = ref<HTMLElement | null>(null)
const heroLineRef = ref<HTMLElement | null>(null)
const heroSubRef = ref<HTMLElement | null>(null)

const cleanupFns: CleanupFn[] = []

onMounted(() => {
  if (!sectionRef.value) return

  // === Canvas 光效系统 ===
  const canvas = canvasRef.value
  let cw = 0,
    ch = 0
  let lightBeams: Array<{
    x1: number
    y1: number
    x2: number
    y2: number
    width: number
    color: string
    alpha: number
  }> = []
  let animFrameId = 0

  if (canvas) {
    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect()
      cw = canvas.width = rect.width
      ch = canvas.height = rect.height
    }
    resize()
    window.addEventListener('resize', resize)

    function generateLightBeams(progress: number) {
      lightBeams = []
      const centerX = cw / 2
      const centerY = ch / 2
      const beamCount = 12

      for (let i = 0; i < beamCount; i++) {
        const angle = (i / beamCount) * Math.PI * 2 + progress * Math.PI * 4
        const length = 100 + progress * 300
        const x2 = centerX + Math.cos(angle) * length
        const y2 = centerY + Math.sin(angle) * length

        lightBeams.push({
          x1: centerX,
          y1: centerY,
          x2,
          y2,
          width: 2 + progress * 4,
          color: `hsl(${(i * 30 + progress * 360) % 360}, 100%, 70%)`,
          alpha: 0.3 + progress * 0.5
        })
      }
    }

    function draw() {
      if (!canvas) return
      const ctx = canvas.getContext('2d')!
      ctx.clearRect(0, 0, cw, ch)

      // 绘制激光束
      lightBeams.forEach((beam) => {
        ctx.beginPath()
        ctx.moveTo(beam.x1, beam.y1)
        ctx.lineTo(beam.x2, beam.y2)
        ctx.strokeStyle = beam.color
        ctx.lineWidth = beam.width
        ctx.globalAlpha = beam.alpha
        ctx.stroke()
        ctx.globalAlpha = 1
      })

      // 绘制中心光晕
      const gradient = ctx.createRadialGradient(cw / 2, ch / 2, 0, cw / 2, ch / 2, 100)
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)')
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)')
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(cw / 2, ch / 2, 100, 0, Math.PI * 2)
      ctx.fill()
    }

    ;(globalThis as any).__prismGenerateBeams = generateLightBeams

    function loop() {
      draw()
      animFrameId = requestAnimationFrame(loop)
    }
    animFrameId = requestAnimationFrame(loop)

    cleanupFns.push(() => {
      cancelAnimationFrame(animFrameId)
      delete (globalThis as any).__prismGenerateBeams
      window.removeEventListener('resize', resize)
    })
  }

  // === GSAP 动画上下文 ===
  const ctx = gsap.context(() => {
    // === 碎片爆发动画 ===
    const mainTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.value!,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2,
        toggleActions: 'play none none reverse',
        onUpdate(self) {
          // 触发 Canvas 光束生成
          ;(globalThis as any).__prismGenerateBeams?.(self.progress)

          // 中心光晕缩放
          if (centerGlowRef.value) {
            const scale = 1 + self.progress * 2
            const opacity = 1 - self.progress * 0.8
            gsap.to(centerGlowRef.value, {
              scale,
              opacity,
              duration: 0.1
            })
          }
        }
      }
    })

    // 为每个碎片创建爆发动画
    fragmentRefs.value.forEach((fragEl, i) => {
      if (!fragEl) return

      const frag = fragments[i]

      mainTl.fromTo(
        fragEl,
        {
          rotation: frag.rotation,
          scale: frag.scale,
          x: frag.x,
          y: frag.y,
          opacity: 0,
          filter: `hue-rotate(${frag.hue}deg) blur(10px)`
        },
        {
          rotation: 0,
          scale: 1,
          x: 0,
          y: 0,
          opacity: 1,
          filter: 'hue-rotate(0deg) blur(0px)',
          duration: 1,
          delay: frag.delay,
          ease: 'power3.out'
        },
        0
      )
    })

    // === 标题入场动画 ===
    if (heroRef.value) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.value!,
          start: 'top 40%',
          end: 'top 5%',
          scrub: 1
        }
      })
      tl.fromTo(heroRef.value, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.2 }, 0)
      tl.fromTo(heroTagRef.value, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.8 }, 0.1)
      tl.fromTo(
        heroTitleRef.value,
        { opacity: 0, y: 20, filter: 'blur(5px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1 },
        0.15
      )
      tl.fromTo(
        heroLineRef.value,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.8 },
        0.2
      )
      tl.fromTo(heroSubRef.value, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.7 }, 0.25)
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
  <div class="hp-section" ref="sectionRef">
    <!-- 背景深色 -->
    <div class="hp-bg"></div>

    <!-- 中心光晕 -->
    <div class="hp-center-glow" ref="centerGlowRef"></div>

    <!-- 6个三角形碎片 -->
    <div class="hp-fragments-container">
      <div
        v-for="(frag, i) in fragments"
        :key="frag.id"
        class="hp-fragment"
        :ref="(el) => (fragmentRefs[i] = el as HTMLElement | null)"
        :style="{
          clipPath: frag.clipPath,
          backgroundImage: `url(${images[i]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }"
      >
        <!-- 彩虹边框 -->
        <div
          class="hp-fragment-border"
          :style="{
            clipPath: frag.clipPath
          }"
        ></div>
      </div>
    </div>

    <!-- Canvas 光效层 -->
    <canvas class="hp-canvas" ref="canvasRef"></canvas>

    <!-- 标题区 -->
    <div class="hp-hero" ref="heroRef">
      <div class="hp-hero-tag" ref="heroTagRef">HOLOGRAPHIC PRISM BURST</div>
      <h2 class="hp-hero-title" ref="heroTitleRef">全息棱镜爆发</h2>
      <div class="hp-hero-line" ref="heroLineRef"></div>
      <p class="hp-hero-sub" ref="heroSubRef">
        6-Fragment · Prism Split · Laser Beams · Rainbow Glow
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.hp-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  font-family: 'Inter', 'PingFang SC', system-ui, sans-serif;
}

.hp-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: radial-gradient(circle at center, #1a0033 0%, #0a001a 50%, #000000 100%);
}

// ==== 中心光晕 ====
.hp-center-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  z-index: 2;
  pointer-events: none;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 70%);
  filter: blur(20px);
}

// ==== 碎片容器 ====
.hp-fragments-container {
  position: absolute;
  inset: 0;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hp-fragment {
  position: absolute;
  width: 100vw;
  height: 100vh;
  will-change: transform, opacity, filter;
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
}

.hp-fragment-border {
  position: absolute;
  inset: -2px;
  background: linear-gradient(
    135deg,
    #ff0000,
    #ff8c00,
    #ffff00,
    #00ff00,
    #00ffff,
    #0000ff,
    #ff00ff
  );
  background-size: 400% 400%;
  animation: rainbow-shift 3s ease infinite;
  opacity: 0.8;
}

@keyframes rainbow-shift {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

// ==== Canvas 光效层 ====
.hp-canvas {
  position: absolute;
  inset: 0;
  z-index: 4;
  pointer-events: none;
}

// ==== 标题区 ====
.hp-hero {
  position: absolute;
  top: clamp(20px, 5vh, 50px);
  left: clamp(24px, 9vw, 90px);
  z-index: 20;
  text-align: left;
  opacity: 0;
}

.hp-hero-tag {
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: rgba(255, 150, 255, 0.85);
  margin-bottom: 10px;
  text-shadow: 0 0 25px rgba(255, 150, 255, 0.6);
}

.hp-hero-title {
  font-size: clamp(2.2rem, 6vw, 4rem);
  font-weight: 800;
  color: #fff;
  margin: 0;
  line-height: 1.1;
  text-shadow:
    0 0 60px rgba(255, 0, 255, 0.7),
    0 0 120px rgba(255, 100, 255, 0.5),
    0 0 180px rgba(255, 200, 255, 0.3);
  letter-spacing: 0.06em;
  background: linear-gradient(135deg, #ff00ff 0%, #ff8c00 50%, #00ffff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hp-hero-line {
  width: clamp(45px, 11vw, 90px);
  height: 3px;
  margin: 12px 0 14px;
  border-radius: 2px;
  background: linear-gradient(90deg, rgba(255, 0, 255, 0.9), rgba(255, 140, 0, 0.7), transparent);
  box-shadow: 0 0 20px rgba(255, 0, 255, 0.7);
}

.hp-hero-sub {
  font-size: clamp(0.65rem, 1.5vw, 0.85rem);
  font-weight: 400;
  letter-spacing: 0.15em;
  color: rgba(255, 200, 255, 0.65);
  margin: 0;
}

@media (max-width: 768px) {
  .hp-hero-title {
    font-size: 1.6rem;
  }
  .hp-hero-sub {
    font-size: 0.68rem;
  }
}
</style>
