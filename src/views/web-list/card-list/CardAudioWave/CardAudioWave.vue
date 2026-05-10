<template>
  <section class="audio-section">
    <!-- 背景波形 -->
    <div class="wave-bg">
      <canvas ref="bgCanvas" class="wave-canvas"></canvas>
    </div>

    <!-- 网格线 -->
    <div class="grid-overlay"></div>

    <!-- 频谱光效 -->
    <div class="spectrum-glow" ref="spectrumGlow"></div>

    <div class="audio-container">
      <div
        v-for="(card, index) in cards"
        :key="card.id"
        class="audio-card"
        :ref="(el) => setCardRef(el, index)"
        :style="{ '--audio-color': card.color }"
      >
        <!-- 波形可视化 -->
        <div class="waveform-visual" :ref="(el) => setWaveRef(el, index)">
          <canvas :ref="(el) => setCanvasRef(el, index)" class="wave-canvas-card"></canvas>
        </div>

        <!-- 圆形频谱 -->
        <div class="circle-spectrum" :ref="(el) => setCircleRef(el, index)">
          <div
            v-for="i in 32"
            :key="i"
            class="spectrum-bar"
            :ref="(el) => setBarRef(el, index, i)"
            :style="{ '--bar-index': i }"
          ></div>
        </div>

        <!-- 圆形中心 -->
        <div class="circle-center">
          <div class="center-icon" :ref="(el) => setIconRef(el, index)">
            {{ card.icon }}
          </div>
        </div>

        <!-- 内容 -->
        <div class="audio-content" :ref="(el) => setContentRef(el, index)">
          <h3 class="audio-title" :ref="(el) => setTitleRef(el, index)">{{ card.title }}</h3>
          <p class="audio-desc" :ref="(el) => setDescRef(el, index)">{{ card.desc }}</p>
          <div class="audio-bars" :ref="(el) => setAudioBarsRef(el, index)">
            <span v-for="i in 5" :key="i" class="audio-bar"></span>
          </div>
        </div>

        <!-- 扫描线 -->
        <div class="scan-line" :ref="(el) => setScanRef(el, index)"></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * CardAudioWave - 音频可视化卡片组件
 * @description 波形、频谱、圆形可视化等音频风格的动画效果
 */

import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ============================================================
// 类型定义
// ============================================================
interface AudioCard {
  id: string
  icon: string
  title: string
  desc: string
  color: string
}

// ============================================================
// 数据
// ============================================================
const CARDS_DATA: AudioCard[] = [
  {
    id: 'audio-1',
    icon: '🎵',
    title: 'Bass Boost',
    desc: 'Feel the deep rhythm of low frequencies',
    color: '#e74c3c'
  },
  {
    id: 'audio-2',
    icon: '🎸',
    title: 'Mid Range',
    desc: 'Crystal clear mid-frequency vocals',
    color: '#3498db'
  },
  {
    id: 'audio-3',
    icon: '🎹',
    title: 'High Notes',
    desc: 'Crisp and sparkling high frequencies',
    color: '#2ecc71'
  }
]

// ============================================================
// 响应式数据
// ============================================================
const cards = ref<AudioCard[]>(CARDS_DATA)
const cardRefsMap = ref(new Map<number, HTMLElement>())
const waveRefsMap = ref(new Map<number, HTMLElement>())
const canvasRefsMap = ref(new Map<number, HTMLCanvasElement>())
const circleRefsMap = ref(new Map<number, HTMLElement>())
const barRefsMap = ref(new Map<string, HTMLElement>())
const iconRefsMap = ref(new Map<number, HTMLElement>())
const contentRefsMap = ref(new Map<number, HTMLElement>())
const titleRefsMap = ref(new Map<number, HTMLElement>())
const descRefsMap = ref(new Map<number, HTMLElement>())
const audioBarsRefsMap = ref(new Map<number, HTMLElement>())
const scanRefsMap = ref(new Map<number, HTMLElement>())
const spectrumGlow = ref<HTMLElement | null>(null)
const bgCanvas = ref<HTMLCanvasElement | null>(null)
const cleanupFns: (() => void)[] = []
let bgCtx: CanvasRenderingContext2D | null = null
let animationFrame: number
let audioAnimations: gsap.core.Tween[] = []

// ============================================================
// 模板引用
// ============================================================
const setCardRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  const element = el instanceof Element ? el : (el as any)?.$el
  if (element) cardRefsMap.value.set(index, element as HTMLElement)
  else cardRefsMap.value.delete(index)
}

const setWaveRef = (el: Element | null, index: number) => {
  if (el instanceof HTMLElement) waveRefsMap.value.set(index, el)
  else waveRefsMap.value.delete(index)
}

const setCanvasRef = (el: Element | null, index: number) => {
  if (el instanceof HTMLCanvasElement) canvasRefsMap.value.set(index, el)
  else canvasRefsMap.value.delete(index)
}

const setCircleRef = (el: Element | null, index: number) => {
  if (el instanceof HTMLElement) circleRefsMap.value.set(index, el)
  else circleRefsMap.value.delete(index)
}

const setBarRef = (el: Element | null, index: number, barIndex: number) => {
  if (el instanceof HTMLElement) barRefsMap.value.set(`${index}-${barIndex}`, el)
  else barRefsMap.value.delete(`${index}-${barIndex}`)
}

const setIconRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  const element = el instanceof Element ? el : (el as any)?.$el
  if (element) iconRefsMap.value.set(index, element as HTMLElement)
  else iconRefsMap.value.delete(index)
}

const setContentRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  const element = el instanceof Element ? el : (el as any)?.$el
  if (element) contentRefsMap.value.set(index, element as HTMLElement)
  else contentRefsMap.value.delete(index)
}

const setTitleRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  const element = el instanceof Element ? el : (el as any)?.$el
  if (element) titleRefsMap.value.set(index, element as HTMLElement)
  else titleRefsMap.value.delete(index)
}

const setDescRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  const element = el instanceof Element ? el : (el as any)?.$el
  if (element) descRefsMap.value.set(index, element as HTMLElement)
  else descRefsMap.value.delete(index)
}

const setAudioBarsRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  const element = el instanceof Element ? el : (el as any)?.$el
  if (element) audioBarsRefsMap.value.set(index, element as HTMLElement)
  else audioBarsRefsMap.value.delete(index)
}

const setScanRef = (el: Element | null, index: number) => {
  if (el instanceof HTMLElement) scanRefsMap.value.set(index, el)
  else scanRefsMap.value.delete(index)
}

// ============================================================
// 背景波形动画
// ============================================================
const initBackgroundWaves = () => {
  const canvas = bgCanvas.value
  if (!canvas) return

  bgCtx = canvas.getContext('2d')
  if (!bgCtx) return

  const resize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  resize()
  window.addEventListener('resize', resize)

  let phase = 0
  const animate = () => {
    if (!bgCtx || !canvas) return

    bgCtx.fillStyle = 'rgba(5, 5, 15, 0.1)'
    bgCtx.fillRect(0, 0, canvas.width, canvas.height)

    const colors = ['#e74c3c', '#3498db', '#2ecc71']
    colors.forEach((color, i) => {
      bgCtx.beginPath()
      bgCtx.strokeStyle = color
      bgCtx.lineWidth = 2
      bgCtx.globalAlpha = 0.3

      for (let x = 0; x < canvas.width; x++) {
        const y = canvas.height / 2 +
          Math.sin((x * 0.01) + phase + (i * 0.5)) * 50 +
          Math.sin((x * 0.02) + phase * 1.5) * 30

        if (x === 0) bgCtx.moveTo(x, y + (i - 1) * 100)
        else bgCtx.lineTo(x, y + (i - 1) * 100)
      }
      bgCtx.stroke()
    })

    bgCtx.globalAlpha = 1
    phase += 0.02
    animationFrame = requestAnimationFrame(animate)
  }
  animate()
}

// ============================================================
// 波形绘制
// ============================================================
const drawWaveform = (canvas: HTMLCanvasElement, color: string) => {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const resize = () => {
    canvas.width = canvas.offsetWidth * 2
    canvas.height = canvas.offsetHeight * 2
    ctx.scale(2, 2)
  }
  resize()

  let phase = Math.random() * Math.PI * 2

  const animate = () => {
    const width = canvas.offsetWidth
    const height = canvas.offsetHeight

    ctx.clearRect(0, 0, width, height)

    // 主波形
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.shadowBlur = 10
    ctx.shadowColor = color

    for (let x = 0; x < width; x++) {
      const y = height / 2 +
        Math.sin((x * 0.05) + phase) * (height * 0.3) +
        Math.sin((x * 0.1) + phase * 2) * (height * 0.15)

      if (x === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()

    // 镜像波形
    ctx.globalAlpha = 0.3
    ctx.beginPath()
    for (let x = 0; x < width; x++) {
      const y = height / 2 -
        Math.sin((x * 0.05) + phase) * (height * 0.3) -
        Math.sin((x * 0.1) + phase * 2) * (height * 0.15)

      if (x === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
    ctx.globalAlpha = 1

    phase += 0.05
    animationFrame = requestAnimationFrame(animate)
  }
  animate()
}

// ============================================================
// 入场动画
// ============================================================
const initEntryAnimation = () => {
  // 卡片入场
  cardRefsMap.value.forEach((card, index) => {
    gsap.fromTo(card,
      {
        y: 100,
        opacity: 0,
        scale: 0.5,
        rotateX: -30
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        rotateX: 0,
        duration: 1.2,
        delay: index * 0.2,
        ease: 'back.out(1.4)'
      }
    )
  })

  // 内容入场
  contentRefsMap.value.forEach((content, index) => {
    gsap.fromTo(content,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: 0.4 + index * 0.2,
        ease: 'power3.out'
      }
    )
  })

  // 图标入场
  iconRefsMap.value.forEach((icon, index) => {
    gsap.fromTo(icon,
      { scale: 0, rotate: -180 },
      {
        scale: 1,
        rotate: 0,
        duration: 0.8,
        delay: 0.5 + index * 0.2,
        ease: 'elastic.out(1, 0.5)'
      }
    )
  })

  // 标题入场
  titleRefsMap.value.forEach((title, index) => {
    gsap.fromTo(title,
      { x: -30, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.6,
        delay: 0.6 + index * 0.2,
        ease: 'power2.out'
      }
    )
  })
}

// ============================================================
// 滚动动画
// ============================================================
const initScrollAnimations = () => {
  // 1. 卡片上下波动
  cardRefsMap.value.forEach((card, index) => {
    const direction = index % 2 === 0 ? 1 : -1
    const trigger = ScrollTrigger.create({
      trigger: card,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.5,
      onUpdate: (self) => {
        const p = self.progress
        const translateY = Math.sin(p * Math.PI * 2) * 40 * direction
        const rotateZ = Math.sin(p * Math.PI) * 5 * direction
        const scale = 1 + Math.sin(p * Math.PI) * 0.08

        gsap.to(card, {
          y: translateY,
          rotateZ: rotateZ,
          scale: scale,
          duration: 0.1
        })
      }
    })
    cleanupFns.push(() => trigger.kill())
  })

  // 2. 频谱条动画
  barRefsMap.value.forEach((bar, key) => {
    const [index] = key.split('-').map(Number)
    const barIndex = parseInt(key.split('-')[1])
    const color = CARDS_DATA[index].color
    const height = 10 + Math.random() * 50

    gsap.to(bar, {
      height: `${height}px`,
      backgroundColor: color,
      boxShadow: `0 0 10px ${color}`,
      duration: 0.2 + Math.random() * 0.3,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay: barIndex * 0.05
    })
  })

  // 3. 圆形频谱旋转
  circleRefsMap.value.forEach((circle, index) => {
    gsap.to(circle, {
      rotation: 360,
      duration: 10 + index * 2,
      ease: 'none',
      repeat: -1,
      transformOrigin: 'center center'
    })
  })

  // 4. 扫描线动画
  scanRefsMap.value.forEach((scan, index) => {
    const color = CARDS_DATA[index].color
    gsap.to(scan, {
      top: '0%',
      opacity: 0.8,
      duration: 2,
      ease: 'power1.in',
      repeat: -1,
      onRepeat: () => {
        gsap.set(scan, { top: '-10%', opacity: 0 })
      }
    })
  })

  // 5. 图标脉冲
  iconRefsMap.value.forEach((icon, index) => {
    const color = CARDS_DATA[index].color
    const trigger = ScrollTrigger.create({
      trigger: icon,
      start: 'top 80%',
      end: 'top 30%',
      scrub: 1,
      onUpdate: (self) => {
        const scale = 1 + Math.sin(self.progress * Math.PI) * 0.3
        const glow = 10 + self.progress * 25
        gsap.to(icon, {
          scale: scale,
          filter: `drop-shadow(0 0 ${glow}px ${color})`,
          duration: 0.1
        })
      }
    })
    cleanupFns.push(() => trigger.kill())
  })

  // 6. 音频条动画
  audioBarsRefsMap.value.forEach((container) => {
    const bars = container.querySelectorAll('.audio-bar')
    bars.forEach((bar, i) => {
      gsap.to(bar, {
        scaleY: 'random(0.3, 1.5)',
        duration: 'random(0.2, 0.5)',
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: i * 0.1
      })
    })
  })

  // 7. 卡片间距
  const container = document.querySelector('.audio-container') as HTMLElement
  if (container) {
    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top center',
      end: 'bottom center',
      scrub: 2,
      onUpdate: (self) => {
        const spread = Math.sin(self.progress * Math.PI) * 60
        gsap.to(container, {
          gap: `${40 + spread}px`,
          duration: 0.1
        })
      }
    })
    cleanupFns.push(() => trigger.kill())
  }

  // 8. 背景光效
  if (spectrumGlow.value) {
    gsap.to(spectrumGlow.value, {
      opacity: 0.8,
      scale: 1.2,
      duration: 3,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    })
  }
}

// ============================================================
// 初始化波形画布
// ============================================================
const initWaveformCanvases = () => {
  canvasRefsMap.value.forEach((canvas, index) => {
    const color = CARDS_DATA[index].color
    drawWaveform(canvas, color)
  })
}

// ============================================================
// 生命周期
// ============================================================
onMounted(() => {
  requestAnimationFrame(() => {
    initBackgroundWaves()
    initEntryAnimation()
    initScrollAnimations()
    initWaveformCanvases()
  })
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(t => t.kill())
  cancelAnimationFrame(animationFrame)
  audioAnimations.forEach(anim => anim.kill())
})
</script>

<style scoped lang="scss">
// ============================================================
// 主体
// ============================================================
.audio-section {
  width: 100vw;
  height: 100vh;
  padding: 60px 40px;
  background: #050510;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

// ============================================================
// 背景波形
// ============================================================
.wave-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.wave-canvas {
  width: 100%;
  height: 100%;
}

// ============================================================
// 网格覆盖层
// ============================================================
.grid-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 30px 30px;
  z-index: 1;
  pointer-events: none;
}

// ============================================================
// 频谱光效
// ============================================================
.spectrum-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 600px;
  height: 600px;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(255, 100, 100, 0.2) 0%, transparent 70%);
  z-index: 1;
  opacity: 0.5;
  pointer-events: none;
}

// ============================================================
// 容器
// ============================================================
.audio-container {
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  z-index: 2;
}

// ============================================================
// 卡片
// ============================================================
.audio-card {
  position: relative;
  width: 280px;
  height: 380px;
  background: linear-gradient(180deg, rgba(15, 15, 35, 0.98) 0%, rgba(10, 10, 25, 0.95) 100%);
  border-radius: 20px;
  overflow: hidden;
  transform-style: preserve-3d;
  perspective: 1000px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, var(--audio-color) 0%, transparent 30%);
    opacity: 0.1;
    z-index: 0;
  }
}

// ============================================================
// 波形可视化
// ============================================================
.waveform-visual {
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  height: 60px;
  z-index: 3;
}

.wave-canvas-card {
  width: 100%;
  height: 100%;
}

// ============================================================
// 圆形频谱
// ============================================================
.circle-spectrum {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px;
  height: 200px;
  transform: translate(-50%, -50%);
  z-index: 4;
}

.spectrum-bar {
  position: absolute;
  width: 4px;
  height: 10px;
  background: var(--audio-color);
  border-radius: 2px;
  left: 50%;
  bottom: 50%;
  transform-origin: center bottom;
  transform: rotate(calc(var(--bar-index) * 11.25deg - 180deg)) translateX(-50%);
  box-shadow: 0 0 5px var(--audio-color);
}

// ============================================================
// 圆形中心
// ============================================================
.circle-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  background: radial-gradient(circle, rgba(20, 20, 40, 0.98) 0%, rgba(10, 10, 30, 0.95) 100%);
  border-radius: 50%;
  border: 2px solid var(--audio-color);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
  box-shadow: 0 0 20px var(--audio-color);
}

.center-icon {
  font-size: 2.5rem;
  filter: drop-shadow(0 0 10px var(--audio-color));
}

// ============================================================
// 内容
// ============================================================
.audio-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 25px;
  background: linear-gradient(to top, rgba(5, 5, 20, 0.98) 0%, transparent 100%);
  z-index: 10;
  text-align: center;
}

.audio-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 8px 0;
  text-shadow: 0 0 10px var(--audio-color);
}

.audio-desc {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 15px 0;
  line-height: 1.4;
}

.audio-bars {
  display: flex;
  justify-content: center;
  gap: 4px;
  height: 30px;
  align-items: flex-end;
}

.audio-bar {
  width: 6px;
  background: var(--audio-color);
  border-radius: 3px;
  transform-origin: bottom;
  box-shadow: 0 0 8px var(--audio-color);
}

// ============================================================
// 扫描线
// ============================================================
.scan-line {
  position: absolute;
  top: -10%;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--audio-color), transparent);
  z-index: 6;
  box-shadow: 0 0 15px var(--audio-color);
  opacity: 0;
}
</style>
