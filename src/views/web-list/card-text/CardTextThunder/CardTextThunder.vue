<template>
  <div ref="parentRef" class="thunder-text-242">
    <!-- 闪电背景 Canvas -->
    <canvas ref="bgCanvasRef" class="thunder-bg-canvas-242"></canvas>

    <!-- 闪光层 -->
    <div class="thunder-flash-242" ref="flashRef"></div>

    <!-- 主标题字符层 -->
    <div class="thunder-title-wrap-242" ref="titleWrapRef">
      <span
        v-for="(char, index) in titleChars"
        :key="`thunder-char-${index}`"
        :ref="el => setCharRef(el as HTMLElement, index)"
        class="thunder-char-242"
        :class="{ 'is-space': char === ' ' }"
      >{{ char === ' ' ? '\u00A0' : char }}</span>
    </div>

    <!-- 裂缝SVG遮罩 -->
    <svg class="thunder-crack-svg-242" ref="crackSvgRef" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
      <defs>
        <filter id="thunder-glow-242">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <g class="thunder-bolts-242" ref="boltsGroupRef">
        <path
          v-for="(bolt, i) in lightningBolts"
          :key="i"
          :d="bolt.d"
          fill="none"
          :stroke="bolt.stroke"
          :stroke-width="bolt.width"
          stroke-linecap="round"
          filter="url(#thunder-glow-242)"
          :ref="el => setBoltRef(el as SVGPathElement, i)"
          class="thunder-bolt-242"
        />
      </g>
    </svg>

    <!-- 副标题 -->
    <div class="thunder-subtitle-242" ref="subtitleRef">
      <span v-for="(char, i) in subtitle.split('')" :key="i" class="thunder-sub-char-242">{{ char }}</span>
    </div>

    <!-- 底部能量条 -->
    <div class="thunder-energy-bar-242" ref="energyBarRef">
      <div class="thunder-energy-fill-242" ref="energyFillRef"></div>
    </div>

    <!-- 边角装饰 -->
    <div v-for="pos in ['tl', 'tr', 'bl', 'br']" :key="pos" :class="`thunder-corner-242 corner-${pos}`"></div>
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
}

const props = withDefaults(defineProps<Props>(), {
  title: '雷霆万钧',
  subtitle: 'THUNDER · LIGHTNING · POWER · STORM'
})

const parentRef = ref<HTMLElement | null>(null)
const bgCanvasRef = ref<HTMLCanvasElement | null>(null)
const flashRef = ref<HTMLElement | null>(null)
const titleWrapRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const crackSvgRef = ref<SVGElement | null>(null)
const boltsGroupRef = ref<SVGGElement | null>(null)
const energyBarRef = ref<HTMLElement | null>(null)
const energyFillRef = ref<HTMLElement | null>(null)

const charRefs = ref<Map<number, HTMLElement>>(new Map())
const boltRefs = ref<Map<number, SVGPathElement>>(new Map())

const titleChars = computed(() => props.title.split(''))

function setCharRef(el: HTMLElement | null, index: number) {
  if (el) charRefs.value.set(index, el)
}
function setBoltRef(el: SVGPathElement | null, index: number) {
  if (el) boltRefs.value.set(index, el)
}

// 生成闪电路径
function generateBoltPath(x1: number, y1: number, x2: number, y2: number, segments: number): string {
  const dx = (x2 - x1) / segments
  const dy = (y2 - y1) / segments
  let path = `M ${x1} ${y1}`
  for (let i = 1; i < segments; i++) {
    const x = x1 + dx * i + (Math.random() - 0.5) * 80
    const y = y1 + dy * i + (Math.random() - 0.5) * 40
    path += ` L ${x} ${y}`
  }
  path += ` L ${x2} ${y2}`
  return path
}

const lightningBolts = computed(() => {
  const bolts = []
  const positions = [
    { x1: 100, y1: 0, x2: 300, y2: 900 },
    { x1: 400, y1: 0, x2: 600, y2: 900 },
    { x1: 700, y1: 0, x2: 900, y2: 900 },
    { x1: 1000, y1: 0, x2: 1200, y2: 900 },
    { x1: 1300, y1: 0, x2: 1440, y2: 900 },
  ]
  positions.forEach((p, i) => {
    bolts.push({
      d: generateBoltPath(p.x1, p.y1, p.x2, p.y2, 12),
      stroke: i % 2 === 0 ? 'rgba(255, 220, 0, 0.6)' : 'rgba(180, 160, 255, 0.5)',
      width: i === 2 ? 2.5 : 1.5
    })
  })
  return bolts
})

type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []
let ctx: gsap.Context | null = null
let bgAnimId: number | null = null

// Canvas 背景（暗夜雷云）
function initBgCanvas() {
  const canvas = bgCanvasRef.value
  if (!canvas || !parentRef.value) return
  canvas.width = parentRef.value.offsetWidth
  canvas.height = parentRef.value.offsetHeight
  const ctx2d = canvas.getContext('2d')!

  let t = 0
  function draw() {
    t += 0.008
    ctx2d.clearRect(0, 0, canvas!.width, canvas!.height)

    // 暗云渐变
    const grad = ctx2d.createRadialGradient(
      canvas!.width / 2, canvas!.height * 0.3, 50,
      canvas!.width / 2, canvas!.height / 2, canvas!.width * 0.8
    )
    grad.addColorStop(0, '#1a1a2e')
    grad.addColorStop(0.4, '#16213e')
    grad.addColorStop(1, '#0a0a15')
    ctx2d.fillStyle = grad
    ctx2d.fillRect(0, 0, canvas!.width, canvas!.height)

    // 云层效果
    for (let i = 0; i < 5; i++) {
      const x = Math.sin(t * 0.3 + i * 1.2) * canvas!.width * 0.3 + canvas!.width * 0.5
      const y = Math.cos(t * 0.2 + i * 0.8) * 80 + canvas!.height * 0.25
      const radius = 150 + Math.sin(t + i) * 30
      const cloudGrad = ctx2d.createRadialGradient(x, y, 0, x, y, radius)
      cloudGrad.addColorStop(0, `rgba(80, 60, 120, ${0.2 + Math.sin(t * 2 + i) * 0.05})`)
      cloudGrad.addColorStop(1, 'transparent')
      ctx2d.beginPath()
      ctx2d.fillStyle = cloudGrad
      ctx2d.arc(x, y, radius, 0, Math.PI * 2)
      ctx2d.fill()
    }

    // 散落的电弧小粒子
    for (let i = 0; i < 15; i++) {
      const px = Math.sin(t * 1.5 + i * 0.7) * canvas!.width * 0.45 + canvas!.width * 0.5
      const py = Math.random() * canvas!.height
      const alpha = Math.abs(Math.sin(t * 3 + i)) * 0.5
      ctx2d.beginPath()
      ctx2d.fillStyle = `rgba(255, 230, 50, ${alpha})`
      ctx2d.arc(px, py, Math.random() * 2, 0, Math.PI * 2)
      ctx2d.fill()
    }

    bgAnimId = requestAnimationFrame(draw)
  }
  draw()
}

// 闪电入场动画
function playEntrance() {
  const chars = Array.from(charRefs.value.values())
  const boltEls = Array.from(boltRefs.value.values())
  const subChars = subtitleRef.value?.querySelectorAll('.thunder-sub-char-242')

  // 初始状态
  gsap.set(chars, { opacity: 0, y: -60, scale: 1.5, filter: 'blur(10px)', color: '#ffffff' })
  gsap.set(boltEls, { opacity: 0, strokeDasharray: '0 1000' })
  if (subChars) gsap.set(subChars, { opacity: 0, y: 30 })
  if (energyFillRef.value) gsap.set(energyFillRef.value, { width: '0%' })
  if (flashRef.value) gsap.set(flashRef.value, { opacity: 0 })

  const tl = gsap.timeline()

  // 闪光效果
  tl.to(flashRef.value, { opacity: 0.7, duration: 0.05, ease: 'none' })
    .to(flashRef.value, { opacity: 0, duration: 0.15, ease: 'power2.out' })

  // 闪电出现
  tl.to(boltEls, {
    opacity: 1,
    strokeDasharray: '1000 0',
    duration: 0.4,
    stagger: 0.05,
    ease: 'power3.out'
  }, '-=0.1')

  // 字符雷击入场
  tl.to(chars, {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    duration: 0.6,
    stagger: { each: 0.07, from: 'random' },
    ease: 'back.out(2)'
  }, '-=0.2')

  // 字符颜色从白变金黄
  tl.to(chars, {
    color: '#ffe066',
    textShadow: '0 0 20px rgba(255,200,0,0.8), 0 0 50px rgba(255,150,0,0.5)',
    duration: 0.5,
    stagger: 0.04,
    ease: 'power1.inOut'
  }, '-=0.3')

  // 副标题
  if (subChars) {
    tl.to(subChars, {
      opacity: 0.7,
      y: 0,
      duration: 0.5,
      stagger: 0.03,
      ease: 'power2.out'
    }, '-=0.2')
  }

  // 能量条充能
  tl.to(energyFillRef.value, {
    width: '100%',
    duration: 1.2,
    ease: 'power2.inOut'
  }, '-=0.5')

  // 闪电消散
  tl.to(boltEls, {
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power2.in'
  }, '-=0.6')

  cleanupFns.push(() => tl.kill())
}

// 持续闪电闪烁
function startLightningFlicker() {
  const boltEls = Array.from(boltRefs.value.values())
  if (!boltEls.length) return

  function triggerRandomBolt() {
    const randomBolt = boltEls[Math.floor(Math.random() * boltEls.length)]
    const tween = gsap.to(randomBolt, {
      opacity: 0.8,
      duration: 0.05,
      yoyo: true,
      repeat: 3,
      ease: 'none',
      onComplete: () => {
        gsap.set(randomBolt, { opacity: 0 })
        setTimeout(triggerRandomBolt, 1000 + Math.random() * 3000)
      }
    })
    cleanupFns.push(() => tween.kill())
  }

  setTimeout(triggerRandomBolt, 2000)
}

onMounted(() => {
  if (!parentRef.value) return
  initBgCanvas()

  setTimeout(() => {
    ctx = gsap.context(() => {
      playEntrance()
      startLightningFlicker()

      const st = ScrollTrigger.create({
        trigger: parentRef.value,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 1.5,
        onEnter: () => playEntrance(),
        onLeaveBack: () => {
          const chars = Array.from(charRefs.value.values())
          gsap.set(chars, { opacity: 0, y: -60, scale: 1.5, filter: 'blur(10px)' })
          if (energyFillRef.value) gsap.set(energyFillRef.value, { width: '0%' })
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
  boltRefs.value.clear()
})
</script>

<style scoped>
.thunder-text-242 {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: #0a0a15;
  font-family: 'Impact', 'Arial Black', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.thunder-bg-canvas-242 {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.thunder-flash-242 {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.95);
  pointer-events: none;
  z-index: 20;
  opacity: 0;
}

.thunder-crack-svg-242 {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 5;
}

.thunder-bolt-242 {
  opacity: 0;
}

.thunder-title-wrap-242 {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 0.04em;
  margin-bottom: 2rem;
}

.thunder-char-242 {
  display: inline-block;
  font-size: clamp(3.5rem, 10vw, 7rem);
  font-weight: 900;
  color: #ffe066;
  letter-spacing: 0.06em;
  text-shadow:
    0 0 20px rgba(255, 200, 0, 0.8),
    0 0 50px rgba(255, 150, 0, 0.5),
    0 0 80px rgba(200, 100, 0, 0.3),
    2px 2px 0 rgba(0,0,0,0.8);
  will-change: transform, opacity;
  user-select: none;
  cursor: default;
}

.thunder-char-242:hover {
  animation: char-zap-242 0.3s ease-out;
  color: #fff;
  text-shadow:
    0 0 5px #fff,
    0 0 20px rgba(255, 240, 100, 1),
    0 0 50px rgba(255, 200, 0, 0.9);
}

@keyframes char-zap-242 {
  0% { transform: scale(1) skewX(0deg); }
  25% { transform: scale(1.3) skewX(-8deg); }
  50% { transform: scale(0.9) skewX(5deg); }
  75% { transform: scale(1.1) skewX(-3deg); }
  100% { transform: scale(1) skewX(0deg); }
}

.thunder-subtitle-242 {
  position: relative;
  z-index: 10;
  display: flex;
  gap: 0.04em;
  font-family: 'Courier New', monospace;
  font-size: clamp(0.65rem, 1.3vw, 0.9rem);
  color: rgba(255, 200, 50, 0.6);
  letter-spacing: 0.3em;
  text-transform: uppercase;
}

.thunder-sub-char-242 {
  display: inline-block;
}

.thunder-energy-bar-242 {
  position: absolute;
  bottom: 40px;
  left: 10%;
  right: 10%;
  height: 3px;
  background: rgba(255, 200, 0, 0.15);
  border-radius: 2px;
  z-index: 10;
  overflow: hidden;
}

.thunder-energy-fill-242 {
  height: 100%;
  width: 0;
  background: linear-gradient(90deg, rgba(255,200,0,0.8), rgba(255,100,0,1), rgba(255,200,0,0.8));
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(255, 200, 0, 0.8);
  animation: energy-pulse-242 1.5s ease-in-out infinite;
}

@keyframes energy-pulse-242 {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.thunder-corner-242 {
  position: absolute;
  width: 30px;
  height: 30px;
  z-index: 10;
  border-color: rgba(255, 200, 0, 0.5);
  border-style: solid;
}

.corner-tl {
  top: 20px;
  left: 20px;
  border-width: 2px 0 0 2px;
}

.corner-tr {
  top: 20px;
  right: 20px;
  border-width: 2px 2px 0 0;
}

.corner-bl {
  bottom: 20px;
  left: 20px;
  border-width: 0 0 2px 2px;
}

.corner-br {
  bottom: 20px;
  right: 20px;
  border-width: 0 2px 2px 0;
}

@media (max-width: 768px) {
  .thunder-char-242 {
    font-size: clamp(2.5rem, 11vw, 4.5rem);
  }
  .thunder-title-wrap-242 {
    flex-wrap: wrap;
    justify-content: center;
    max-width: 90vw;
  }
  .thunder-subtitle-242 {
    flex-wrap: wrap;
    justify-content: center;
    max-width: 90vw;
    letter-spacing: 0.12em;
    font-size: 0.6rem;
  }
}
</style>

