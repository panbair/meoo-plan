<template>
  <div ref="parentRef" class="meltdown-text-245">
    <!-- 熔岩 Canvas -->
    <canvas ref="lavaCanvasRef" class="meltdown-lava-canvas-245"></canvas>

    <!-- 热气效果层 -->
    <div class="meltdown-heat-245" ref="heatRef"></div>

    <!-- 主标题文字 -->
    <div class="meltdown-title-wrap-245" ref="titleWrapRef">
      <span
        v-for="(char, index) in titleChars"
        :key="`melt-${index}`"
        :ref="el => setCharRef(el as HTMLElement, index)"
        class="meltdown-char-245"
      >{{ char === ' ' ? '\u00A0' : char }}</span>
    </div>

    <!-- 熔融进度条 -->
    <div class="meltdown-meter-245" ref="meterRef">
      <div class="meltdown-meter-fill-245" ref="meterFillRef"></div>
      <span class="meltdown-meter-label-245">TEMP: <span ref="tempValRef">0</span>°C</span>
    </div>

    <!-- 副标题 -->
    <div class="meltdown-subtitle-245" ref="subtitleRef">
      <span v-for="(char, i) in subtitle.split('')" :key="i" class="melt-sub-char-245">{{ char }}</span>
    </div>

    <!-- 熔岩滴落装饰 -->
    <div class="meltdown-drips-245" ref="dripsRef">
      <div v-for="i in 8" :key="i" :class="`melt-drip-245 drip-${i}`"></div>
    </div>

    <!-- 底部熔岩层 -->
    <svg class="meltdown-lava-floor-245" viewBox="0 0 1440 120" preserveAspectRatio="none">
      <defs>
        <linearGradient id="lava-grad-245" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="rgba(255,80,0,0.8)"/>
          <stop offset="50%" stop-color="rgba(255,140,0,0.6)"/>
          <stop offset="100%" stop-color="rgba(200,40,0,0.9)"/>
        </linearGradient>
      </defs>
      <path ref="lavaPath1Ref" d="M0,60 Q180,30 360,60 Q540,90 720,55 Q900,25 1080,60 Q1260,90 1440,55 L1440,120 L0,120 Z" fill="url(#lava-grad-245)"/>
      <path ref="lavaPath2Ref" d="M0,80 Q200,55 400,75 Q600,95 800,70 Q1000,50 1200,75 Q1340,90 1440,70 L1440,120 L0,120 Z" fill="rgba(255,60,0,0.4)"/>
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
  maxTemp?: number
}

const props = withDefaults(defineProps<Props>(), {
  title: '熔岩重铸',
  subtitle: 'MELTDOWN · FORGE · REBIRTH · MAGMA',
  maxTemp: 1300
})

const parentRef = ref<HTMLElement | null>(null)
const lavaCanvasRef = ref<HTMLCanvasElement | null>(null)
const heatRef = ref<HTMLElement | null>(null)
const titleWrapRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const meterRef = ref<HTMLElement | null>(null)
const meterFillRef = ref<HTMLElement | null>(null)
const tempValRef = ref<HTMLElement | null>(null)
const dripsRef = ref<HTMLElement | null>(null)
const lavaPath1Ref = ref<SVGPathElement | null>(null)
const lavaPath2Ref = ref<SVGPathElement | null>(null)

const charRefs = ref<Map<number, HTMLElement>>(new Map())

const titleChars = computed(() => props.title.split(''))

function setCharRef(el: HTMLElement | null, index: number) {
  if (el) charRefs.value.set(index, el)
}

type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []
let ctx: gsap.Context | null = null
let lavaAnimId: number | null = null

interface LavaBlob {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  color: string
  alpha: number
  temperature: number
}

const lavaBlobs: LavaBlob[] = []

function initLavaCanvas() {
  const canvas = lavaCanvasRef.value
  if (!canvas || !parentRef.value) return
  canvas.width = parentRef.value.offsetWidth
  canvas.height = parentRef.value.offsetHeight

  const ctx2d = canvas.getContext('2d')!
  const w = canvas.width
  const h = canvas.height

  // 初始化熔岩团
  for (let i = 0; i < 15; i++) {
    const temp = Math.random() * 0.5 + 0.5
    lavaBlobs.push({
      x: Math.random() * w,
      y: h * 0.6 + Math.random() * h * 0.3,
      vx: (Math.random() - 0.5) * 0.8,
      vy: -(Math.random() * 0.4 + 0.2),
      r: Math.random() * 60 + 30,
      color: temp > 0.8 ? '#ff5500' : temp > 0.6 ? '#ff8800' : '#cc2200',
      alpha: 0.6 + temp * 0.2,
      temperature: temp
    })
  }

  let t = 0
  function draw() {
    t += 0.01
    ctx2d.clearRect(0, 0, w, h)

    // 暗红背景
    const bgGrad = ctx2d.createLinearGradient(0, 0, 0, h)
    bgGrad.addColorStop(0, '#0a0000')
    bgGrad.addColorStop(0.5, '#1a0500')
    bgGrad.addColorStop(1, '#2a0800')
    ctx2d.fillStyle = bgGrad
    ctx2d.fillRect(0, 0, w, h)

    // 熔岩流动底部
    const lavaGrad = ctx2d.createLinearGradient(0, h * 0.7, 0, h)
    lavaGrad.addColorStop(0, 'rgba(255, 80, 0, 0.3)')
    lavaGrad.addColorStop(0.5, 'rgba(255, 60, 0, 0.5)')
    lavaGrad.addColorStop(1, 'rgba(200, 30, 0, 0.8)')
    ctx2d.fillStyle = lavaGrad
    ctx2d.fillRect(0, h * 0.7, w, h * 0.3)

    // 熔岩团
    lavaBlobs.forEach(blob => {
      blob.x += blob.vx + Math.sin(t + blob.temperature) * 0.3
      blob.y += blob.vy * 0.5
      blob.r += Math.sin(t * 2 + blob.temperature * 5) * 0.3

      // 到达顶部重置
      if (blob.y < h * 0.4) {
        blob.y = h * 0.7 + Math.random() * h * 0.2
        blob.x = Math.random() * w
      }

      const grad = ctx2d.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.r)
      const bright = 0.5 + Math.sin(t * 3 + blob.temperature) * 0.2
      grad.addColorStop(0, `rgba(255, ${Math.round(100 * bright)}, 0, ${blob.alpha})`)
      grad.addColorStop(0.5, `rgba(200, ${Math.round(50 * bright)}, 0, ${blob.alpha * 0.6})`)
      grad.addColorStop(1, 'transparent')

      ctx2d.beginPath()
      ctx2d.fillStyle = grad
      ctx2d.arc(blob.x, blob.y, blob.r, 0, Math.PI * 2)
      ctx2d.fill()
    })

    // 火花粒子
    for (let i = 0; i < 20; i++) {
      const x = Math.sin(t * 1.5 + i * 0.8) * w * 0.45 + w * 0.5
      const y = h * 0.5 - Math.abs(Math.sin(t * 2 + i * 0.5)) * h * 0.3
      const size = Math.random() * 2 + 0.5
      const alpha = Math.abs(Math.sin(t * 4 + i)) * 0.7
      ctx2d.beginPath()
      ctx2d.fillStyle = `rgba(255, ${Math.round(150 + Math.random() * 105)}, 0, ${alpha})`
      ctx2d.arc(x, y, size, 0, Math.PI * 2)
      ctx2d.fill()
    }

    lavaAnimId = requestAnimationFrame(draw)
  }
  draw()
}

function playEntrance() {
  const chars = Array.from(charRefs.value.values())
  const subChars = subtitleRef.value?.querySelectorAll('.melt-sub-char-245')
  const drips = dripsRef.value?.querySelectorAll('.melt-drip-245')

  // 初始：熔化状态
  gsap.set(chars, {
    opacity: 0,
    scaleY: 2,
    scaleX: 0.7,
    y: 50,
    filter: 'blur(8px)',
    color: '#ff3300'
  })
  if (subChars) gsap.set(subChars, { opacity: 0, y: 30 })
  if (meterFillRef.value) gsap.set(meterFillRef.value, { width: '0%' })
  if (drips) gsap.set(drips, { y: -20, opacity: 0 })
  if (heatRef.value) gsap.set(heatRef.value, { opacity: 0.8 })

  const tempObj = { val: 0 }

  const tl = gsap.timeline()

  // 温度升高
  tl.to(tempObj, {
    val: props.maxTemp,
    duration: 1.5,
    ease: 'power2.in',
    onUpdate: () => {
      if (tempValRef.value) {
        tempValRef.value.textContent = Math.round(tempObj.val).toString()
      }
    }
  })

  // 仪表充能
  tl.to(meterFillRef.value, {
    width: '100%',
    duration: 1.5,
    ease: 'power2.in'
  }, 0)

  // 热气消散
  tl.to(heatRef.value, { opacity: 0, duration: 1, ease: 'power2.out' }, '-=1')

  // 字符从熔融中凝固重铸
  tl.to(chars, {
    opacity: 1,
    scaleY: 1,
    scaleX: 1,
    y: 0,
    filter: 'blur(0px)',
    color: '#ff8844',
    duration: 1.0,
    stagger: {
      each: 0.1,
      from: 'start'
    },
    ease: 'back.out(1.8)'
  }, '-=0.8')

  // 冷却变色
  tl.to(chars, {
    color: '#ffffff',
    textShadow: '0 0 15px rgba(255,100,20,0.6), 0 0 40px rgba(255,60,0,0.3)',
    duration: 0.8,
    stagger: 0.06,
    ease: 'power1.out'
  })

  // 温度冷却
  tl.to(tempObj, {
    val: 25,
    duration: 1.0,
    ease: 'power2.out',
    onUpdate: () => {
      if (tempValRef.value) {
        tempValRef.value.textContent = Math.round(tempObj.val).toString()
      }
    }
  }, '-=0.4')

  tl.to(meterFillRef.value, { width: '5%', duration: 1.0, ease: 'power2.out' }, '-=1.0')

  // 熔岩滴落
  if (drips) {
    tl.to(drips, {
      y: 30,
      opacity: 0.8,
      duration: 0.5,
      stagger: 0.08,
      ease: 'power2.in'
    }, '-=0.8')
  }

  if (subChars) {
    tl.to(subChars, {
      opacity: 0.7,
      y: 0,
      duration: 0.7,
      stagger: 0.04,
      ease: 'power2.out'
    }, '-=0.3')
  }

  cleanupFns.push(() => tl.kill())
}

// 熔岩路径动画
function animateLavaFloor() {
  if (!lavaPath1Ref.value || !lavaPath2Ref.value) return

  const t1 = gsap.timeline({ repeat: -1 })
  t1.to(lavaPath1Ref.value, {
    attr: { d: 'M0,45 Q180,15 360,45 Q540,75 720,40 Q900,10 1080,45 Q1260,75 1440,40 L1440,120 L0,120 Z' },
    duration: 2.5, ease: 'sine.inOut'
  }).to(lavaPath1Ref.value, {
    attr: { d: 'M0,60 Q180,30 360,60 Q540,90 720,55 Q900,25 1080,60 Q1260,90 1440,55 L1440,120 L0,120 Z' },
    duration: 2.5, ease: 'sine.inOut'
  })

  const t2 = gsap.timeline({ repeat: -1, delay: 1 })
  t2.to(lavaPath2Ref.value, {
    attr: { d: 'M0,65 Q200,40 400,60 Q600,80 800,55 Q1000,35 1200,60 Q1340,75 1440,55 L1440,120 L0,120 Z' },
    duration: 3, ease: 'sine.inOut'
  }).to(lavaPath2Ref.value, {
    attr: { d: 'M0,80 Q200,55 400,75 Q600,95 800,70 Q1000,50 1200,75 Q1340,90 1440,70 L1440,120 L0,120 Z' },
    duration: 3, ease: 'sine.inOut'
  })

  cleanupFns.push(() => { t1.kill(); t2.kill() })
}

// 字符持续的热量脉动
function startHeatPulse() {
  const chars = Array.from(charRefs.value.values())
  chars.forEach((char, i) => {
    const t = gsap.to(char, {
      textShadow: '0 0 25px rgba(255,80,0,0.8), 0 0 60px rgba(255,40,0,0.5)',
      duration: 0.6 + Math.random() * 0.4,
      yoyo: true,
      repeat: -1,
      delay: i * 0.15,
      ease: 'sine.inOut'
    })
    cleanupFns.push(() => t.kill())
  })
}

onMounted(() => {
  if (!parentRef.value) return
  initLavaCanvas()
  animateLavaFloor()

  setTimeout(() => {
    ctx = gsap.context(() => {
      playEntrance()
      startHeatPulse()

      const st = ScrollTrigger.create({
        trigger: parentRef.value,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 1.5,
        onEnter: () => playEntrance(),
        onLeaveBack: () => {
          const chars = Array.from(charRefs.value.values())
          gsap.set(chars, { opacity: 0, scaleY: 2, scaleX: 0.7, y: 50, filter: 'blur(8px)' })
          if (meterFillRef.value) gsap.set(meterFillRef.value, { width: '0%' })
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
  if (lavaAnimId !== null) cancelAnimationFrame(lavaAnimId)
  ScrollTrigger.getAll().forEach(st => st.kill())
  charRefs.value.clear()
  lavaBlobs.length = 0
})
</script>

<style scoped>
.meltdown-text-245 {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: #0a0000;
  font-family: 'Arial Black', 'Impact', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.meltdown-lava-canvas-245 {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.meltdown-heat-245 {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at 50% 60%,
    rgba(255, 80, 0, 0.4) 0%,
    rgba(200, 40, 0, 0.2) 40%,
    transparent 70%
  );
  pointer-events: none;
  z-index: 8;
  opacity: 0;
  animation: heat-shimmer-245 2s ease-in-out infinite;
}

@keyframes heat-shimmer-245 {
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(1.02) translateY(-3px); }
}

.meltdown-title-wrap-245 {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 0.04em;
  margin-bottom: 1.5rem;
}

.meltdown-char-245 {
  display: inline-block;
  font-size: clamp(3rem, 9vw, 6.5rem);
  font-weight: 900;
  color: #fff;
  letter-spacing: 0.05em;
  text-shadow:
    0 0 15px rgba(255, 100, 0, 0.7),
    0 0 40px rgba(255, 60, 0, 0.4),
    0 0 80px rgba(200, 30, 0, 0.2);
  will-change: transform, opacity, filter;
  user-select: none;
  cursor: default;
}

.meltdown-char-245:hover {
  animation: char-melt-245 0.5s ease-in-out;
  color: #ffaa44;
  text-shadow:
    0 0 10px rgba(255, 150, 0, 0.9),
    0 0 30px rgba(255, 80, 0, 0.7),
    0 0 60px rgba(200, 40, 0, 0.5);
}

@keyframes char-melt-245 {
  0% { transform: scaleY(1) scaleX(1); }
  30% { transform: scaleY(1.2) scaleX(0.85); }
  60% { transform: scaleY(0.9) scaleX(1.05); }
  80% { transform: scaleY(1.05) scaleX(0.98); }
  100% { transform: scaleY(1) scaleX(1); }
}

/* 温度仪表 */
.meltdown-meter-245 {
  position: relative;
  z-index: 10;
  width: clamp(200px, 40vw, 350px);
  height: 6px;
  background: rgba(255, 50, 0, 0.15);
  border-radius: 3px;
  margin-bottom: 2rem;
  overflow: visible;
}

.meltdown-meter-fill-245 {
  height: 100%;
  width: 0;
  background: linear-gradient(90deg, #cc2200, #ff5500, #ff9900, #ffcc00);
  border-radius: 3px;
  box-shadow: 0 0 12px rgba(255, 100, 0, 0.8);
  position: relative;
}

.meltdown-meter-fill-245::after {
  content: '';
  position: absolute;
  right: 0;
  top: -4px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #ffcc00;
  box-shadow: 0 0 8px rgba(255, 200, 0, 0.9);
}

.meltdown-meter-label-245 {
  position: absolute;
  top: 10px;
  right: 0;
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  color: rgba(255, 120, 50, 0.8);
  letter-spacing: 0.1em;
  white-space: nowrap;
}

/* 副标题 */
.meltdown-subtitle-245 {
  position: relative;
  z-index: 10;
  display: flex;
  gap: 0.04em;
  font-family: 'Courier New', monospace;
  font-size: clamp(0.6rem, 1.2vw, 0.85rem);
  color: rgba(255, 120, 50, 0.6);
  letter-spacing: 0.3em;
  text-transform: uppercase;
}

.melt-sub-char-245 {
  display: inline-block;
}

/* 熔岩滴落 */
.meltdown-drips-245 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  pointer-events: none;
  z-index: 6;
}

.melt-drip-245 {
  position: absolute;
  top: 0;
  width: 6px;
  height: 20px;
  border-radius: 0 0 50% 50%;
  background: linear-gradient(180deg, rgba(255,100,0,0.6), rgba(255,60,0,0.3));
  opacity: 0;
}

.drip-1 { left: 10%; }
.drip-2 { left: 20%; }
.drip-3 { left: 33%; }
.drip-4 { left: 45%; }
.drip-5 { left: 55%; }
.drip-6 { left: 68%; }
.drip-7 { left: 80%; }
.drip-8 { left: 90%; }

/* 熔岩底部 */
.meltdown-lava-floor-245 {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 120px;
  pointer-events: none;
  z-index: 7;
}

@media (max-width: 768px) {
  .meltdown-char-245 {
    font-size: clamp(2.5rem, 11vw, 4.5rem);
  }
  .meltdown-title-wrap-245 {
    flex-wrap: wrap;
    justify-content: center;
    max-width: 90vw;
  }
  .meltdown-subtitle-245 {
    flex-wrap: wrap;
    justify-content: center;
    max-width: 90vw;
    letter-spacing: 0.1em;
    font-size: 0.55rem;
  }
  .meltdown-meter-245 {
    width: 80vw;
  }
}
</style>

