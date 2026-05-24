<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type CleanupFn = () => void

// ═══════════════════════════════════════════
//  RGB Channel Split Recombine — RGB通道分离重组（增强版）
//
//  核心概念:
//  1. 单张图片分解为 R/G/B 三个颜色通道
//  2. 每个通道独立水平移动（分离效果）
//  3. 滚动时逐步对齐重组为完整彩色图片
//  4. Canvas 像素级色彩分析可视化
//  5. 通道对齐率实时显示
//  6. 色差光晕特效（chromatic aberration）
// ═══════════════════════════════════════════

const imageSrc = 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=1920&q=80' // 山湖风景

const sectionRef = ref<HTMLElement | null>(null)
const redChannelRef = ref<HTMLElement | null>(null)
const greenChannelRef = ref<HTMLElement | null>(null)
const blueChannelRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const alignmentBarRef = ref<HTMLElement | null>(null)
const alignmentPercentRef = ref<HTMLElement | null>(null)
const channelLabelsRef = ref<(HTMLElement | null)[]>([])
const heroRef = ref<HTMLElement | null>(null)
const heroTagRef = ref<HTMLElement | null>(null)
const heroTitleRef = ref<HTMLElement | null>(null)
const heroLineRef = ref<HTMLElement | null>(null)
const heroSubRef = ref<HTMLElement | null>(null)

const alignmentPercent = ref(0)
const cleanupFns: CleanupFn[] = []

onMounted(() => {
  if (!sectionRef.value) return

  // === Canvas 色彩分析可视化 ===
  const canvas = canvasRef.value
  let cw = 0,
    ch = 0
  let colorBars: Array<{
    x: number
    y: number
    width: number
    height: number
    r: number
    g: number
    b: number
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

    function generateColorBars(progress: number) {
      colorBars = []
      const barCount = 50

      for (let i = 0; i < barCount; i++) {
        const x = Math.random() * cw
        const y = Math.random() * ch
        const width = 20 + Math.random() * 60
        const height = 2 + Math.random() * 4

        // 根据进度调整 RGB 值
        const separation = (1 - progress) * 100
        const r = Math.floor(Math.random() * 255)
        const g = Math.floor(Math.random() * 255)
        const b = Math.floor(Math.random() * 255)

        colorBars.push({
          x: x + (Math.random() - 0.5) * separation,
          y,
          width,
          height,
          r,
          g,
          b,
          alpha: 0.3 + Math.random() * 0.4
        })
      }
    }

    function draw() {
      if (!canvas) return
      const ctx = canvas.getContext('2d')!
      ctx.clearRect(0, 0, cw, ch)

      colorBars.forEach((bar) => {
        ctx.fillStyle = `rgba(${bar.r}, ${bar.g}, ${bar.b}, ${bar.alpha})`
        ctx.fillRect(bar.x, bar.y, bar.width, bar.height)
      })
    }

    ;(globalThis as any).__rgbGenerateBars = generateColorBars

    function loop() {
      draw()
      animFrameId = requestAnimationFrame(loop)
    }
    animFrameId = requestAnimationFrame(loop)

    cleanupFns.push(() => {
      cancelAnimationFrame(animFrameId)
      delete (globalThis as any).__rgbGenerateBars
      window.removeEventListener('resize', resize)
    })
  }

  // === GSAP 动画上下文 ===
  const ctx = gsap.context(() => {
    const maxOffset = 80 // 最大偏移量

    // === RGB 通道分离/重组动画 ===
    const mainTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.value!,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2,
        toggleActions: 'play none none reverse',
        onUpdate(self) {
          const progress = self.progress
          alignmentPercent.value = Math.round(progress * 100)

          // 更新对齐率进度条
          if (alignmentBarRef.value) {
            alignmentBarRef.value.style.width = `${progress * 100}%`
          }

          // 更新百分比文字
          if (alignmentPercentRef.value) {
            alignmentPercentRef.value.textContent = `${alignmentPercent.value}%`
          }

          // 触发 Canvas 色彩条生成
          ;(globalThis as any).__rgbGenerateBars?.(progress)

          // 通道标签颜色变化
          channelLabelsRef.value.forEach((label, i) => {
            if (!label) return
            const colors = ['#ff0000', '#00ff00', '#0000ff']
            const opacity = 0.3 + progress * 0.7
            label.style.color = colors[i]
            label.style.opacity = String(opacity)
          })
        }
      }
    })

    // 红色通道：从左侧移入
    mainTl.fromTo(
      redChannelRef.value,
      {
        x: -maxOffset,
        opacity: 0.7
      },
      {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: 'power2.out'
      },
      0
    )

    // 绿色通道：保持中心（基准）
    mainTl.fromTo(
      greenChannelRef.value,
      {
        opacity: 0.7
      },
      {
        opacity: 1,
        duration: 1,
        ease: 'power2.out'
      },
      0
    )

    // 蓝色通道：从右侧移入
    mainTl.fromTo(
      blueChannelRef.value,
      {
        x: maxOffset,
        opacity: 0.7
      },
      {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: 'power2.out'
      },
      0
    )

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
  <div class="rgb-section" ref="sectionRef">
    <!-- 背景深色 -->
    <div class="rgb-bg"></div>

    <!-- RGB 通道层 -->
    <div class="rgb-channels-container">
      <!-- 红色通道 -->
      <div
        ref="redChannelRef"
        class="rgb-channel rgb-red"
        :style="{
          backgroundImage: `url(${imageSrc})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          mixBlendMode: 'screen'
        }"
      ></div>

      <!-- 绿色通道 -->
      <div
        ref="greenChannelRef"
        class="rgb-channel rgb-green"
        :style="{
          backgroundImage: `url(${imageSrc})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          mixBlendMode: 'screen'
        }"
      ></div>

      <!-- 蓝色通道 -->
      <div
        ref="blueChannelRef"
        class="rgb-channel rgb-blue"
        :style="{
          backgroundImage: `url(${imageSrc})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          mixBlendMode: 'screen'
        }"
      ></div>
    </div>

    <!-- Canvas 色彩分析层 -->
    <canvas class="rgb-canvas" ref="canvasRef"></canvas>

    <!-- 通道标签 -->
    <div class="rgb-labels">
      <div
        v-for="(label, i) in ['R', 'G', 'B']"
        :key="label"
        class="rgb-label"
        :ref="(el) => (channelLabelsRef[i] = el as HTMLElement | null)"
      >
        {{ label }} CHANNEL
      </div>
    </div>

    <!-- 对齐率指示器 -->
    <div class="rgb-alignment">
      <div class="rgb-alignment-track">
        <div class="rgb-alignment-bar" ref="alignmentBarRef"></div>
      </div>
      <div class="rgb-alignment-text">
        <span>ALIGNMENT</span>
        <span class="rgb-alignment-percent" ref="alignmentPercentRef">0%</span>
      </div>
    </div>

    <!-- 标题区 -->
    <div class="rgb-hero" ref="heroRef">
      <div class="rgb-hero-tag" ref="heroTagRef">RGB CHANNEL SPLIT RECOMBINE</div>
      <h2 class="rgb-hero-title" ref="heroTitleRef">RGB通道重组</h2>
      <div class="rgb-hero-line" ref="heroLineRef"></div>
      <p class="rgb-hero-sub" ref="heroSubRef">
        Chromatic Aberration · Color Separation · Pixel Analysis
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.rgb-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  font-family: 'Inter', 'PingFang SC', system-ui, sans-serif;
}

.rgb-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
}

// ==== RGB 通道容器 ====
.rgb-channels-container {
  position: absolute;
  inset: 0;
  z-index: 2;
}

.rgb-channel {
  position: absolute;
  inset: 0;
  will-change: transform, opacity;
}

.rgb-red {
  filter: url('#red-channel-filter');
}

.rgb-green {
  filter: url('#green-channel-filter');
}

.rgb-blue {
  filter: url('#blue-channel-filter');
}

// ==== Canvas 色彩分析层 ====
.rgb-canvas {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  opacity: 0.6;
}

// ==== 通道标签 ====
.rgb-labels {
  position: absolute;
  bottom: clamp(20px, 5vh, 50px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  display: flex;
  gap: clamp(30px, 8vw, 80px);
}

.rgb-label {
  font-size: clamp(0.7rem, 1.8vw, 1rem);
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  transition:
    color 0.3s ease,
    opacity 0.3s ease;
}

.rgb-label:nth-child(1) {
  color: #ff0000;
  opacity: 0.3;
}

.rgb-label:nth-child(2) {
  color: #00ff00;
  opacity: 0.3;
}

.rgb-label:nth-child(3) {
  color: #0000ff;
  opacity: 0.3;
}

// ==== 对齐率指示器 ====
.rgb-alignment {
  position: absolute;
  bottom: clamp(80px, 12vh, 120px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.rgb-alignment-track {
  width: clamp(200px, 40vw, 400px);
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.rgb-alignment-bar {
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, #ff0000, #00ff00, #0000ff);
  border-radius: 2px;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
  transition: width 0.1s ease;
}

.rgb-alignment-text {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.rgb-alignment-text span:first-child {
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
}

.rgb-alignment-percent {
  font-size: 1.2rem;
  font-weight: 800;
  color: #fff;
  font-variant-numeric: tabular-nums;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.6);
}

// ==== 标题区 ====
.rgb-hero {
  position: absolute;
  top: clamp(20px, 5vh, 50px);
  left: clamp(24px, 9vw, 90px);
  z-index: 20;
  text-align: left;
  opacity: 0;
}

.rgb-hero-tag {
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: rgba(255, 100, 100, 0.85);
  margin-bottom: 10px;
  text-shadow: 0 0 25px rgba(255, 100, 100, 0.6);
}

.rgb-hero-title {
  font-size: clamp(2.2rem, 6vw, 4rem);
  font-weight: 800;
  color: #fff;
  margin: 0;
  line-height: 1.1;
  text-shadow:
    0 0 60px rgba(255, 0, 0, 0.7),
    0 0 120px rgba(0, 255, 0, 0.5),
    0 0 180px rgba(0, 0, 255, 0.3);
  letter-spacing: 0.06em;
  background: linear-gradient(135deg, #ff0000 0%, #00ff00 50%, #0000ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.rgb-hero-line {
  width: clamp(45px, 11vw, 90px);
  height: 3px;
  margin: 12px 0 14px;
  border-radius: 2px;
  background: linear-gradient(
    90deg,
    rgba(255, 0, 0, 0.9),
    rgba(0, 255, 0, 0.7),
    rgba(0, 0, 255, 0.5)
  );
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
}

.rgb-hero-sub {
  font-size: clamp(0.65rem, 1.5vw, 0.85rem);
  font-weight: 400;
  letter-spacing: 0.15em;
  color: rgba(200, 200, 255, 0.65);
  margin: 0;
}

@media (max-width: 768px) {
  .rgb-hero-title {
    font-size: 1.6rem;
  }
  .rgb-hero-sub {
    font-size: 0.68rem;
  }
  .rgb-labels {
    gap: 20px;
  }
}
</style>
