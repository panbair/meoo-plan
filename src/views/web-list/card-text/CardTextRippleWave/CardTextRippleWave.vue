<template>
  <div ref="parentRef" class="ripple-wave-241">
    <!-- 水面背景 Canvas -->
    <canvas ref="bgCanvasRef" class="ripple-bg-canvas-241"></canvas>

    <!-- 水波纹涟漪层 -->
    <div class="ripple-rings-241" ref="ringsRef">
      <div v-for="i in 5" :key="i" class="ripple-ring-241" :class="`ring-${i}`"></div>
    </div>

    <!-- 主标题文字容器 -->
    <div class="ripple-title-wrap-241" ref="titleWrapRef">
      <span
        v-for="(char, index) in titleChars"
        :key="`title-${index}`"
        :ref="el => setCharRef(el as HTMLElement, index)"
        class="ripple-char-241"
        :data-index="index"
      >{{ char === ' ' ? '\u00A0' : char }}</span>
    </div>

    <!-- 副标题 -->
    <div class="ripple-subtitle-241" ref="subtitleRef">
      <span v-for="(char, i) in subtitle.split('')" :key="i" class="ripple-sub-char-241">{{ char }}</span>
    </div>

    <!-- 水面光晕 -->
    <div class="ripple-glow-241" ref="glowRef"></div>

    <!-- 底部水波装饰 -->
    <svg class="ripple-wave-svg-241" ref="waveSvgRef" viewBox="0 0 1440 120" preserveAspectRatio="none">
      <path ref="wavePath1Ref" d="M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,120 L0,120 Z" fill="rgba(0,160,255,0.15)"/>
      <path ref="wavePath2Ref" d="M0,80 C360,40 720,120 1080,80 C1260,60 1380,90 1440,80 L1440,120 L0,120 Z" fill="rgba(0,200,255,0.1)"/>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Props {
  title?: string
  subtitle?: string
  rippleColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '水波涟漪',
  subtitle: 'Ripple · Wave · Flow · Ocean',
  rippleColor: '#00c8ff'
})

const parentRef = ref<HTMLElement | null>(null)
const bgCanvasRef = ref<HTMLCanvasElement | null>(null)
const ringsRef = ref<HTMLElement | null>(null)
const titleWrapRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const glowRef = ref<HTMLElement | null>(null)
const waveSvgRef = ref<SVGElement | null>(null)
const wavePath1Ref = ref<SVGPathElement | null>(null)
const wavePath2Ref = ref<SVGPathElement | null>(null)

const charRefs = ref<Map<number, HTMLElement>>(new Map())

const titleChars = computed(() => props.title.split(''))

function setCharRef(el: HTMLElement | null, index: number) {
  if (el) charRefs.value.set(index, el)
}

type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []
let ctx: gsap.Context | null = null
let bgAnimId: number | null = null
let waveTime = 0

// Canvas 水波背景
function initBgCanvas() {
  const canvas = bgCanvasRef.value
  if (!canvas || !parentRef.value) return
  const parent = parentRef.value
  canvas.width = parent.offsetWidth
  canvas.height = parent.offsetHeight

  const ctx2d = canvas.getContext('2d')
  if (!ctx2d) return

  const ripples: { x: number; y: number; r: number; alpha: number; speed: number }[] = []

  // 随机生成涟漪
  for (let i = 0; i < 8; i++) {
    ripples.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 80 + 20,
      alpha: Math.random() * 0.3 + 0.1,
      speed: Math.random() * 0.5 + 0.2
    })
  }

  function draw() {
    ctx2d!.clearRect(0, 0, canvas!.width, canvas!.height)
    waveTime += 0.015

    // 深海渐变背景
    const grad = ctx2d!.createLinearGradient(0, 0, 0, canvas!.height)
    grad.addColorStop(0, '#000d1a')
    grad.addColorStop(0.5, '#001f3f')
    grad.addColorStop(1, '#003366')
    ctx2d!.fillStyle = grad
    ctx2d!.fillRect(0, 0, canvas!.width, canvas!.height)

    // 绘制涟漪
    ripples.forEach(rip => {
      rip.r += rip.speed
      rip.alpha -= 0.002
      if (rip.r > 200 || rip.alpha <= 0) {
        rip.x = Math.random() * canvas!.width
        rip.y = Math.random() * canvas!.height
        rip.r = Math.random() * 20 + 10
        rip.alpha = Math.random() * 0.3 + 0.15
        rip.speed = Math.random() * 0.5 + 0.2
      }

      ctx2d!.beginPath()
      ctx2d!.strokeStyle = `rgba(0, 200, 255, ${rip.alpha})`
      ctx2d!.lineWidth = 1.5
      ctx2d!.arc(rip.x, rip.y, rip.r, 0, Math.PI * 2)
      ctx2d!.stroke()

      // 双圈
      ctx2d!.beginPath()
      ctx2d!.strokeStyle = `rgba(0, 150, 220, ${rip.alpha * 0.5})`
      ctx2d!.arc(rip.x, rip.y, rip.r * 0.6, 0, Math.PI * 2)
      ctx2d!.stroke()
    })

    // 波光粼粼效果
    for (let i = 0; i < 30; i++) {
      const x = (i / 30) * canvas!.width
      const y = Math.sin(waveTime * 2 + i * 0.5) * 20 + canvas!.height * 0.6
      const size = Math.abs(Math.sin(waveTime + i)) * 3 + 1
      ctx2d!.beginPath()
      ctx2d!.fillStyle = `rgba(0, 220, 255, ${0.3 + Math.sin(waveTime + i) * 0.2})`
      ctx2d!.arc(x, y, size, 0, Math.PI * 2)
      ctx2d!.fill()
    }

    bgAnimId = requestAnimationFrame(draw)
  }
  draw()
}

// 字符水波动画（持续）
function startCharWave() {
  const chars = Array.from(charRefs.value.values())
  chars.forEach((char, i) => {
    gsap.to(char, {
      y: () => Math.sin(Date.now() * 0.002 + i * 0.6) * 12,
      duration: 0.1,
      repeat: -1,
      ease: 'none',
      modifiers: {
        y: () => String(Math.sin(Date.now() * 0.002 + i * 0.6) * 12)
      }
    })
  })
}

// 入场动画
function playEntrance() {
  const chars = Array.from(charRefs.value.values())
  const subChars = subtitleRef.value?.querySelectorAll('.ripple-sub-char-241')

  gsap.set(chars, { opacity: 0, y: 80, filter: 'blur(12px)', scale: 0.7 })
  if (subChars) gsap.set(subChars, { opacity: 0, y: 20, filter: 'blur(6px)' })
  if (glowRef.value) gsap.set(glowRef.value, { opacity: 0, scale: 0.5 })

  const tl = gsap.timeline()

  tl.to(glowRef.value, { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' })
    .to(chars, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      scale: 1,
      duration: 1.0,
      stagger: {
        each: 0.08,
        from: 'center'
      },
      ease: 'elastic.out(1, 0.6)'
    }, '-=0.3')

  if (subChars) {
    tl.to(subChars, {
      opacity: 0.8,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.6,
      stagger: 0.04,
      ease: 'power2.out'
    }, '-=0.4')
  }

  cleanupFns.push(() => tl.kill())
}

// 波浪路径动画
function animateWavePaths() {
  if (!wavePath1Ref.value || !wavePath2Ref.value) return

  const tl1 = gsap.timeline({ repeat: -1 })
  tl1.to(wavePath1Ref.value, {
    attr: { d: 'M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,120 L0,120 Z' },
    duration: 3,
    ease: 'sine.inOut'
  }).to(wavePath1Ref.value, {
    attr: { d: 'M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,120 L0,120 Z' },
    duration: 3,
    ease: 'sine.inOut'
  })

  const tl2 = gsap.timeline({ repeat: -1, delay: 1.5 })
  tl2.to(wavePath2Ref.value, {
    attr: { d: 'M0,60 C360,20 720,100 1080,60 C1260,40 1380,70 1440,60 L1440,120 L0,120 Z' },
    duration: 3.5,
    ease: 'sine.inOut'
  }).to(wavePath2Ref.value, {
    attr: { d: 'M0,80 C360,40 720,120 1080,80 C1260,60 1380,90 1440,80 L1440,120 L0,120 Z' },
    duration: 3.5,
    ease: 'sine.inOut'
  })

  cleanupFns.push(() => { tl1.kill(); tl2.kill() })
}

// 字符持续水波运动
function startContinuousWave() {
  const chars = Array.from(charRefs.value.values())
  chars.forEach((char, i) => {
    const tween = gsap.to(char, {
      y: 10,
      duration: 1.2 + i * 0.08,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: i * 0.12
    })
    cleanupFns.push(() => tween.kill())
  })
}

onMounted(() => {
  if (!parentRef.value) return

  initBgCanvas()
  animateWavePaths()

  setTimeout(() => {
    ctx = gsap.context(() => {
      playEntrance()
      startContinuousWave()

      const st = ScrollTrigger.create({
        trigger: parentRef.value,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 1.5,
        onEnter: () => playEntrance(),
        onLeaveBack: () => {
          const chars = Array.from(charRefs.value.values())
          gsap.set(chars, { opacity: 0, y: 80, filter: 'blur(12px)', scale: 0.7 })
        }
      })
      cleanupFns.push(() => st.kill())
    }, parentRef.value)
  }, 100)
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0
  ctx?.revert()
  ctx = null
  if (bgAnimId !== null) cancelAnimationFrame(bgAnimId)
  ScrollTrigger.getAll().forEach(st => st.kill())
  charRefs.value.clear()
})
</script>

<style scoped>
.ripple-wave-241 {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: #000d1a;
  font-family: 'Georgia', serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.ripple-bg-canvas-241 {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.ripple-rings-241 {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.ripple-ring-241 {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  border: 1px solid rgba(0, 200, 255, 0.2);
  transform: translate(-50%, -50%);
  animation: ring-expand-241 4s ease-out infinite;
}

.ring-1 { width: 100px; height: 100px; animation-delay: 0s; }
.ring-2 { width: 100px; height: 100px; animation-delay: 0.8s; }
.ring-3 { width: 100px; height: 100px; animation-delay: 1.6s; }
.ring-4 { width: 100px; height: 100px; animation-delay: 2.4s; }
.ring-5 { width: 100px; height: 100px; animation-delay: 3.2s; }

@keyframes ring-expand-241 {
  0% {
    width: 60px;
    height: 60px;
    opacity: 0.8;
    border-color: rgba(0, 200, 255, 0.6);
  }
  100% {
    width: 600px;
    height: 600px;
    opacity: 0;
    border-color: rgba(0, 200, 255, 0);
  }
}

.ripple-title-wrap-241 {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 0.05em;
  margin-bottom: 2rem;
}

.ripple-char-241 {
  display: inline-block;
  font-size: clamp(3rem, 9vw, 6rem);
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.02em;
  text-shadow:
    0 0 20px rgba(0, 200, 255, 0.8),
    0 0 50px rgba(0, 150, 220, 0.5),
    0 0 80px rgba(0, 100, 200, 0.3);
  will-change: transform, opacity;
  cursor: default;
  user-select: none;
}

.ripple-char-241:hover {
  text-shadow:
    0 0 10px #fff,
    0 0 30px rgba(0, 220, 255, 1),
    0 0 60px rgba(0, 180, 255, 0.8);
  animation: char-splash-241 0.4s ease-out;
}

@keyframes char-splash-241 {
  0% { transform: scale(1); }
  30% { transform: scale(1.4) translateY(-15px); }
  60% { transform: scale(0.9) translateY(5px); }
  100% { transform: scale(1) translateY(0); }
}

.ripple-subtitle-241 {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 0.05em;
  font-size: clamp(0.7rem, 1.5vw, 1rem);
  color: rgba(0, 200, 255, 0.7);
  letter-spacing: 0.35em;
  text-transform: uppercase;
}

.ripple-sub-char-241 {
  display: inline-block;
}

.ripple-glow-241 {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 400px;
  height: 200px;
  transform: translate(-50%, -50%);
  background: radial-gradient(ellipse, rgba(0, 200, 255, 0.12) 0%, transparent 70%);
  pointer-events: none;
  z-index: 5;
}

.ripple-wave-svg-241 {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 120px;
  z-index: 8;
  pointer-events: none;
}

@media (max-width: 768px) {
  .ripple-char-241 {
    font-size: clamp(2rem, 10vw, 3.5rem);
  }
  .ripple-title-wrap-241 {
    flex-wrap: wrap;
    justify-content: center;
    max-width: 90vw;
    gap: 0.03em;
  }
  .ripple-subtitle-241 {
    flex-wrap: wrap;
    justify-content: center;
    max-width: 90vw;
    letter-spacing: 0.15em;
    font-size: 0.65rem;
  }
  .ripple-ring-241 {
    display: none;
  }
}
</style>

