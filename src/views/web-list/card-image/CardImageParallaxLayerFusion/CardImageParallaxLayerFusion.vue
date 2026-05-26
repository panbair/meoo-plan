<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type CleanupFn = () => void

// ═══════════════════════════════════════════
//  Parallax Layer Fusion Pro — 多层景深视差融合（增强版）
//
//  核心概念:
//  1. 6层图片组合 (前景→背景)
//  2. 每层不同的滚动速度 (0.2x - 2.5x)
//  3. 鼠标交互倾斜 (±15° 3D旋转)
//  4. Canvas 大气粒子系统 (雾效/光斑)
//  5. 景深模糊 (远/近景不同模糊度)
//  6. 动态光晕追踪鼠标位置
// ═══════════════════════════════════════════

// === 6层图片配置 ===
const layers = [
  {
    name: 'foreground',
    url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&q=80', // 水面波纹
    speed: 2.5, // 最快
    z: 80,
    blur: 0,
    opacity: 0.95
  },
  {
    name: 'near-trees',
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80', // 近处树木
    speed: 1.8,
    z: 50,
    blur: 0,
    opacity: 0.9
  },
  {
    name: 'mid-hills',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80', // 中景山丘
    speed: 1.2,
    z: 20,
    blur: 1,
    opacity: 0.85
  },
  {
    name: 'far-mountains',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80', // 远山
    speed: 0.7,
    z: -30,
    blur: 2,
    opacity: 0.8
  },
  {
    name: 'sky-clouds',
    url: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1920&q=80', // 云层
    speed: 0.4,
    z: -70,
    blur: 3,
    opacity: 0.75
  },
  {
    name: 'atmosphere',
    url: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=1920&q=80', // 大气光效
    speed: 0.2, // 最慢
    z: -100,
    blur: 4,
    opacity: 0.6
  }
]

const sectionRef = ref<HTMLElement | null>(null)
const sceneRef = ref<HTMLElement | null>(null)
const layerRefs = ref<(HTMLElement | null)[]>([])
const canvasRef = ref<HTMLCanvasElement | null>(null)
const glowRef = ref<HTMLElement | null>(null)
const heroRef = ref<HTMLElement | null>(null)
const heroTagRef = ref<HTMLElement | null>(null)
const heroTitleRef = ref<HTMLElement | null>(null)
const heroLineRef = ref<HTMLElement | null>(null)
const heroSubRef = ref<HTMLElement | null>(null)

const mouseX = ref(0)
const mouseY = ref(0)

const cleanupFns: CleanupFn[] = []

onMounted(() => {
  if (!sectionRef.value || !sceneRef.value) return

  // === Canvas 大气粒子系统 ===
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
    type: 'fog' | 'light'
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
      if (progress < 0.05 || progress > 0.95) return
      if (Math.random() > progress * 0.3) return

      // 生成雾气粒子
      for (let i = 0; i < 2; i++) {
        particles.push({
          x: Math.random() * cw,
          y: ch * (0.3 + Math.random() * 0.7),
          vx: (Math.random() - 0.5) * 0.3,
          vy: -(Math.random() * 0.2 + 0.1),
          r: 30 + Math.random() * 50,
          alpha: Math.random() * 0.15 + 0.05,
          life: 0,
          maxLife: 200 + Math.random() * 300,
          type: 'fog'
        })
      }

      // 生成光斑粒子
      if (Math.random() > 0.7) {
        particles.push({
          x: Math.random() * cw,
          y: Math.random() * ch,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          r: 2 + Math.random() * 4,
          alpha: Math.random() * 0.6 + 0.3,
          life: 0,
          maxLife: 100 + Math.random() * 150,
          type: 'light'
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

        if (p.type === 'fog') {
          // 绘制雾气（大半径渐变）
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r)
          gradient.addColorStop(0, `rgba(200, 220, 255, ${a})`)
          gradient.addColorStop(1, 'rgba(200, 220, 255, 0)')
          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
          ctx.fill()
        } else {
          // 绘制光斑（小亮点）
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 255, 220, ${a})`
          ctx.fill()
        }
      }
    }

    ;(globalThis as any).__parallaxSpawn = spawn

    function loop() {
      draw()
      particleAnimId = requestAnimationFrame(loop)
    }
    particleAnimId = requestAnimationFrame(loop)

    cleanupFns.push(() => {
      cancelAnimationFrame(particleAnimId)
      delete (globalThis as any).__parallaxSpawn
      window.removeEventListener('resize', resize)
    })
  }

  // === 鼠标交互 ===
  const handleMouseMove = (e: MouseEvent) => {
    const rect = sectionRef.value!.getBoundingClientRect()
    mouseX.value = ((e.clientX - rect.left) / rect.width - 0.5) * 2 // -1 to 1
    mouseY.value = ((e.clientY - rect.top) / rect.height - 0.5) * 2
  }
  sectionRef.value.addEventListener('mousemove', handleMouseMove)

  // === GSAP 动画上下文 ===
  const ctx = gsap.context(() => {
    // === 图层视差滚动动画 ===
    layerRefs.value.forEach((layerEl, i) => {
      if (!layerEl) return

      const layer = layers[i]
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.value!,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          toggleActions: 'play none none reverse'
        }
      })

      // 垂直视差移动（不同速度）
      tl.fromTo(
        layerEl,
        {
          y: `${(layer.speed - 1) * -100}%`
        },
        {
          y: `${(layer.speed - 1) * 100}%`,
          duration: 1,
          ease: 'none'
        }
      )
    })

    // === 3D 鼠标倾斜效果（使用 quickTo 避免每帧创建新 tween）===
    const quickRotateX = gsap.quickTo(sceneRef.value, 'rotateX', { duration: 0.8, ease: 'power2.out' })
    const quickRotateY = gsap.quickTo(sceneRef.value, 'rotateY', { duration: 0.8, ease: 'power2.out' })

    const tiltTickHandler = () => {
      if (!sceneRef.value) return
      quickRotateX(-mouseY.value * 15)
      quickRotateY(mouseX.value * 15)
    }
    gsap.ticker.add(tiltTickHandler)

    // === 动态光晕跟随鼠标（使用 quickTo 避免每帧创建新 tween）===
    let glowTickHandler: (() => void) | null = null
    if (glowRef.value) {
      const quickGlow = gsap.quickTo(glowRef.value, 'backgroundPosition', { duration: 0.5, ease: 'power2.out' })

      glowTickHandler = () => {
        const x = (mouseX.value + 1) * 50 // 0-100%
        const y = (mouseY.value + 1) * 50
        quickGlow(`${x}% ${y}%`)
      }
      gsap.ticker.add(glowTickHandler)
    }

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

  cleanupFns.push(() => {
    gsap.ticker.remove(tiltTickHandler)
    if (glowTickHandler) gsap.ticker.remove(glowTickHandler)
    ctx.revert()
    sectionRef.value?.removeEventListener('mousemove', handleMouseMove)
  })
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
  <div class="plf-section" ref="sectionRef">
    <!-- 背景深色 -->
    <div class="plf-bg"></div>

    <!-- 3D 场景容器 -->
    <div class="plf-scene" ref="sceneRef">
      <!-- 6层图片视差 -->
      <div
        v-for="(layer, i) in layers"
        :key="layer.name"
        class="plf-layer"
        :ref="(el) => (layerRefs[i] = el as HTMLElement | null)"
        :style="{
          zIndex: 10 - i,
          transform: `translateZ(${layer.z}px)`,
          filter: `blur(${layer.blur}px)`,
          opacity: layer.opacity
        }"
      >
        <img :src="layer.url" :alt="layer.name" class="plf-layer-img" />
      </div>

      <!-- Canvas 大气粒子层 -->
      <canvas class="plf-particles" ref="canvasRef"></canvas>

      <!-- 动态光晕层 -->
      <div
        class="plf-glow"
        ref="glowRef"
        :style="{
          background:
            'radial-gradient(circle at 50% 50%, rgba(255,255,200,0.15) 0%, transparent 50%)'
        }"
      ></div>
    </div>

    <!-- 标题区 -->
    <div class="plf-hero" ref="heroRef">
      <div class="plf-hero-tag" ref="heroTagRef">PARALLAX LAYER FUSION</div>
      <h2 class="plf-hero-title" ref="heroTitleRef">多层景深视差</h2>
      <div class="plf-hero-line" ref="heroLineRef"></div>
      <p class="plf-hero-sub" ref="heroSubRef">
        6-Layer · Depth Parallax · Mouse Tilt · Atmospheric Particles
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.plf-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  perspective: 1000px;
  font-family: 'Inter', 'PingFang SC', system-ui, sans-serif;
}

.plf-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: linear-gradient(180deg, #0a0e27 0%, #1a1f3a 50%, #2d1b4e 100%);
}

// ==== 3D 场景 ====
.plf-scene {
  position: absolute;
  inset: 0;
  z-index: 2;
  transform-style: preserve-3d;
  will-change: transform;
}

// ==== 图层样式 ====
.plf-layer {
  position: absolute;
  inset: -20%; // 留出视差移动空间
  width: 140%;
  height: 140%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  will-change: transform, filter, opacity;
}

.plf-layer-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

// ==== Canvas 粒子层 ====
.plf-particles {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
}

// ==== 动态光晕层 ====
.plf-glow {
  position: absolute;
  inset: 0;
  z-index: 4;
  pointer-events: none;
  background-size: 200% 200%;
  mix-blend-mode: screen;
}

// ==== 标题区 ====
.plf-hero {
  position: absolute;
  top: clamp(20px, 5vh, 50px);
  left: clamp(24px, 9vw, 90px);
  z-index: 20;
  text-align: left;
  opacity: 0;
}

.plf-hero-tag {
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: rgba(150, 200, 255, 0.85);
  margin-bottom: 10px;
  text-shadow: 0 0 25px rgba(150, 200, 255, 0.6);
}

.plf-hero-title {
  font-size: clamp(2.2rem, 6vw, 4rem);
  font-weight: 800;
  color: #fff;
  margin: 0;
  line-height: 1.1;
  text-shadow:
    0 0 60px rgba(100, 180, 255, 0.7),
    0 0 120px rgba(150, 130, 255, 0.5),
    0 0 180px rgba(200, 100, 255, 0.3);
  letter-spacing: 0.06em;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.plf-hero-line {
  width: clamp(45px, 11vw, 90px);
  height: 3px;
  margin: 12px 0 14px;
  border-radius: 2px;
  background: linear-gradient(
    90deg,
    rgba(102, 126, 234, 0.9),
    rgba(118, 75, 162, 0.7),
    transparent
  );
  box-shadow: 0 0 20px rgba(102, 126, 234, 0.7);
}

.plf-hero-sub {
  font-size: clamp(0.65rem, 1.5vw, 0.85rem);
  font-weight: 400;
  letter-spacing: 0.15em;
  color: rgba(180, 200, 255, 0.65);
  margin: 0;
}

@media (max-width: 768px) {
  .plf-scene {
    transform: none !important; // 移动端禁用3D倾斜
  }
  .plf-hero-title {
    font-size: 1.6rem;
  }
  .plf-hero-sub {
    font-size: 0.68rem;
  }
}
</style>
