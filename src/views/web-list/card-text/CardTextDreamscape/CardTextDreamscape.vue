<template>
  <div ref="parentRef" class="dreamscape-text-244">
    <!-- 梦境背景 Canvas -->
    <canvas ref="dreamCanvasRef" class="dream-canvas-244"></canvas>

    <!-- 浮动泡泡 -->
    <div class="dream-bubbles-244" ref="bubblesContainerRef">
      <div
        v-for="(bubble, i) in bubbles"
        :key="i"
        :ref="el => setBubbleRef(el as HTMLElement, i)"
        class="dream-bubble-244"
        :style="{ left: bubble.x + '%', top: bubble.y + '%', width: bubble.size + 'px', height: bubble.size + 'px' }"
      ></div>
    </div>

    <!-- 主标题文字 -->
    <div class="dream-title-wrap-244" ref="titleWrapRef">
      <span
        v-for="(char, index) in titleChars"
        :key="`dream-${index}`"
        :ref="el => setCharRef(el as HTMLElement, index)"
        class="dream-char-244"
      >{{ char === ' ' ? '\u00A0' : char }}</span>
    </div>

    <!-- 副标题 -->
    <div class="dream-subtitle-244" ref="subtitleRef">
      <span v-for="(char, i) in subtitle.split('')" :key="i" class="dream-sub-char-244">{{ char }}</span>
    </div>

    <!-- 漂浮的几何装饰 -->
    <div class="dream-geo-244" ref="geoRef">
      <div v-for="i in 6" :key="i" :class="`dream-geo-item-244 geo-item-${i}`"></div>
    </div>

    <!-- 星光效果 -->
    <div class="dream-starfield-244" ref="starfieldRef">
      <div v-for="i in 20" :key="i" class="dream-star-244" :style="{ left: Math.random() * 100 + '%', top: Math.random() * 100 + '%' }"></div>
    </div>
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
  title: '梦境流离',
  subtitle: 'DREAMSCAPE · FLOAT · ILLUSION · REVERIE'
})

const parentRef = ref<HTMLElement | null>(null)
const dreamCanvasRef = ref<HTMLCanvasElement | null>(null)
const bubblesContainerRef = ref<HTMLElement | null>(null)
const titleWrapRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const geoRef = ref<HTMLElement | null>(null)
const starfieldRef = ref<HTMLElement | null>(null)

const charRefs = ref<Map<number, HTMLElement>>(new Map())
const bubbleRefs = ref<Map<number, HTMLElement>>(new Map())

const titleChars = computed(() => props.title.split(''))

const bubbles = ref(
  Array.from({ length: 12 }, (_, i) => ({
    x: Math.random() * 90 + 5,
    y: Math.random() * 80 + 10,
    size: Math.random() * 40 + 15
  }))
)

function setCharRef(el: HTMLElement | null, index: number) {
  if (el) charRefs.value.set(index, el)
}
function setBubbleRef(el: HTMLElement | null, index: number) {
  if (el) bubbleRefs.value.set(index, el)
}

type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []
let ctx: gsap.Context | null = null
let dreamAnimId: number | null = null

function initDreamCanvas() {
  const canvas = dreamCanvasRef.value
  if (!canvas || !parentRef.value) return
  canvas.width = parentRef.value.offsetWidth
  canvas.height = parentRef.value.offsetHeight

  const ctx2d = canvas.getContext('2d')!
  const w = canvas.width
  const h = canvas.height
  let t = 0

  function draw() {
    t += 0.008
    ctx2d.clearRect(0, 0, w, h)

    // 梦幻渐变背景
    const grad = ctx2d.createLinearGradient(0, 0, w, h)
    const r = Math.round(60 + Math.sin(t * 0.3) * 20)
    const g = Math.round(20 + Math.sin(t * 0.2) * 10)
    const b = Math.round(100 + Math.sin(t * 0.4) * 30)
    grad.addColorStop(0, `rgb(${r}, ${g}, ${b + 20})`)
    grad.addColorStop(0.5, `rgb(${r - 20}, ${g + 10}, ${b + 40})`)
    grad.addColorStop(1, `rgb(${r - 30}, ${g}, ${b + 60})`)
    ctx2d.fillStyle = grad
    ctx2d.fillRect(0, 0, w, h)

    // 梦幻光晕
    const haloes = [
      { x: 0.3, y: 0.35, r: 250, color: [180, 100, 255] },
      { x: 0.7, y: 0.6, r: 200, color: [100, 150, 255] },
      { x: 0.5, y: 0.2, r: 150, color: [255, 120, 200] }
    ]

    haloes.forEach((h2, i) => {
      const cx = w * (h2.x + Math.sin(t * 0.5 + i) * 0.05)
      const cy = h * (h2.y + Math.cos(t * 0.4 + i) * 0.05)
      const grad2 = ctx2d.createRadialGradient(cx, cy, 0, cx, cy, h2.r)
      grad2.addColorStop(0, `rgba(${h2.color[0]},${h2.color[1]},${h2.color[2]},0.18)`)
      grad2.addColorStop(1, 'transparent')
      ctx2d.beginPath()
      ctx2d.fillStyle = grad2
      ctx2d.arc(cx, cy, h2.r, 0, Math.PI * 2)
      ctx2d.fill()
    })

    // 流动的梦境线条
    for (let i = 0; i < 6; i++) {
      const yBase = h * (0.3 + i * 0.08)
      ctx2d.beginPath()
      ctx2d.strokeStyle = `rgba(200, 160, 255, ${0.05 + i * 0.01})`
      ctx2d.lineWidth = 1
      ctx2d.moveTo(0, yBase)
      for (let x = 0; x <= w; x += 15) {
        const y = yBase + Math.sin(x * 0.01 + t * 1.5 + i * 0.5) * 20
          + Math.cos(x * 0.02 + t * 0.8) * 10
        ctx2d.lineTo(x, y)
      }
      ctx2d.stroke()
    }

    dreamAnimId = requestAnimationFrame(draw)
  }
  draw()
}

function playEntrance() {
  const chars = Array.from(charRefs.value.values())
  const bubbleEls = Array.from(bubbleRefs.value.values())
  const subChars = subtitleRef.value?.querySelectorAll('.dream-sub-char-244')
  const geoItems = geoRef.value?.querySelectorAll('.dream-geo-item-244')

  gsap.set(chars, { opacity: 0, y: 50, scale: 0.6, filter: 'blur(15px)', rotation: () => (Math.random() - 0.5) * 20 })
  gsap.set(bubbleEls, { opacity: 0, scale: 0 })
  if (subChars) gsap.set(subChars, { opacity: 0, y: 20, filter: 'blur(6px)' })
  if (geoItems) gsap.set(geoItems, { opacity: 0, scale: 0, rotation: () => Math.random() * 180 })

  const tl = gsap.timeline()

  // 泡泡浮现
  tl.to(bubbleEls, {
    opacity: 1,
    scale: 1,
    duration: 0.8,
    stagger: { each: 0.06, from: 'random' },
    ease: 'back.out(1.5)'
  })

  // 几何图形
  if (geoItems) {
    tl.to(geoItems, {
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: 'back.out(2)'
    }, '-=0.5')
  }

  // 文字从梦境中凝聚
  tl.to(chars, {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    rotation: 0,
    duration: 1.2,
    stagger: {
      each: 0.09,
      from: 'center'
    },
    ease: 'elastic.out(1, 0.5)'
  }, '-=0.4')

  if (subChars) {
    tl.to(subChars, {
      opacity: 0.7,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.8,
      stagger: 0.04,
      ease: 'power2.out'
    }, '-=0.5')
  }

  cleanupFns.push(() => tl.kill())
}

// 浮游动画
function startFloatingAnimation() {
  const chars = Array.from(charRefs.value.values())
  const bubbleEls = Array.from(bubbleRefs.value.values())

  // 字符梦游漂浮
  chars.forEach((char, i) => {
    const t = gsap.to(char, {
      y: () => Math.sin(i * 0.6) * 12 + 8,
      x: () => Math.cos(i * 0.4) * 5,
      rotation: Math.sin(i * 0.3) * 3,
      duration: 2.5 + i * 0.15,
      yoyo: true,
      repeat: -1,
      delay: i * 0.12,
      ease: 'sine.inOut'
    })
    cleanupFns.push(() => t.kill())
  })

  // 泡泡浮动
  bubbleEls.forEach((bubble, i) => {
    const t = gsap.to(bubble, {
      y: -(Math.random() * 30 + 20),
      x: (Math.random() - 0.5) * 20,
      duration: 3 + Math.random() * 2,
      yoyo: true,
      repeat: -1,
      delay: Math.random() * 2,
      ease: 'sine.inOut'
    })
    cleanupFns.push(() => t.kill())
  })
}

// 几何旋转
function startGeoAnimation() {
  const geoItems = geoRef.value?.querySelectorAll('.dream-geo-item-244')
  if (!geoItems) return

  geoItems.forEach((item, i) => {
    const t = gsap.to(item, {
      rotation: i % 2 === 0 ? 360 : -360,
      duration: 8 + i * 2,
      repeat: -1,
      ease: 'none'
    })
    cleanupFns.push(() => t.kill())
  })
}

onMounted(() => {
  if (!parentRef.value) return
  initDreamCanvas()

  setTimeout(() => {
    ctx = gsap.context(() => {
      playEntrance()
      startFloatingAnimation()
      startGeoAnimation()

      const st = ScrollTrigger.create({
        trigger: parentRef.value,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 1.5,
        onEnter: () => playEntrance(),
        onLeaveBack: () => {
          const chars = Array.from(charRefs.value.values())
          gsap.set(chars, { opacity: 0, y: 50, scale: 0.6, filter: 'blur(15px)' })
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
  if (dreamAnimId !== null) cancelAnimationFrame(dreamAnimId)
  ScrollTrigger.getAll().forEach(st => st.kill())
  charRefs.value.clear()
  bubbleRefs.value.clear()
})
</script>

<style scoped>
.dreamscape-text-244 {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: #3c1464;
  font-family: 'Garamond', 'Georgia', serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.dream-canvas-244 {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

/* 浮动泡泡 */
.dream-bubbles-244 {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.dream-bubble-244 {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(
    circle at 35% 35%,
    rgba(255, 255, 255, 0.3) 0%,
    rgba(180, 140, 255, 0.1) 50%,
    transparent 70%
  );
  border: 1px solid rgba(200, 170, 255, 0.25);
  backdrop-filter: blur(2px);
  will-change: transform;
}

/* 主标题 */
.dream-title-wrap-244 {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 0.04em;
  margin-bottom: 2.5rem;
}

.dream-char-244 {
  display: inline-block;
  font-size: clamp(3rem, 9vw, 6rem);
  font-weight: 700;
  font-style: italic;
  color: rgba(240, 220, 255, 0.95);
  letter-spacing: 0.04em;
  text-shadow:
    0 0 20px rgba(200, 150, 255, 0.8),
    0 0 50px rgba(150, 100, 255, 0.5),
    0 0 100px rgba(100, 50, 200, 0.3);
  will-change: transform, opacity, filter;
  user-select: none;
  cursor: default;
}

.dream-char-244:hover {
  color: #fff;
  text-shadow:
    0 0 10px rgba(255, 255, 255, 0.9),
    0 0 30px rgba(220, 180, 255, 1),
    0 0 60px rgba(180, 120, 255, 0.8);
  animation: dream-drift-244 0.6s ease-out;
}

@keyframes dream-drift-244 {
  0%, 100% { transform: scale(1) rotate(0deg); }
  25% { transform: scale(1.15) rotate(3deg) translateY(-10px); }
  50% { transform: scale(1.05) rotate(-2deg) translateY(-5px); }
  75% { transform: scale(1.1) rotate(1deg) translateY(-8px); }
}

/* 副标题 */
.dream-subtitle-244 {
  position: relative;
  z-index: 10;
  display: flex;
  gap: 0.04em;
  font-family: 'Courier New', monospace;
  font-size: clamp(0.6rem, 1.2vw, 0.85rem);
  color: rgba(200, 170, 255, 0.6);
  letter-spacing: 0.3em;
  text-transform: uppercase;
  font-style: normal;
}

.dream-sub-char-244 {
  display: inline-block;
}

/* 几何装饰 */
.dream-geo-244 {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 5;
}

.dream-geo-item-244 {
  position: absolute;
  border: 1px solid rgba(200, 170, 255, 0.2);
  will-change: transform;
}

.geo-item-1 { width: 60px; height: 60px; top: 10%; left: 8%; border-radius: 8px; transform: rotate(15deg); }
.geo-item-2 { width: 40px; height: 40px; top: 20%; right: 12%; border-radius: 50%; border-color: rgba(180, 140, 255, 0.25); }
.geo-item-3 { width: 80px; height: 80px; bottom: 20%; left: 15%; border-radius: 50%; }
.geo-item-4 { width: 50px; height: 50px; top: 60%; right: 8%; transform: rotate(45deg); }
.geo-item-5 { width: 35px; height: 35px; bottom: 30%; right: 20%; border-radius: 50%; border-color: rgba(220, 190, 255, 0.2); }
.geo-item-6 { width: 70px; height: 70px; top: 40%; left: 5%; border-radius: 12px; transform: rotate(-20deg); }

/* 星光 */
.dream-starfield-244 {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 3;
}

.dream-star-244 {
  position: absolute;
  width: 2px;
  height: 2px;
  border-radius: 50%;
  background: rgba(220, 200, 255, 0.6);
  animation: star-twinkle-244 3s ease-in-out infinite;
  animation-delay: calc(var(--i, 0) * 0.15s);
}

.dream-star-244:nth-child(odd) { animation-duration: 2.5s; background: rgba(255, 220, 255, 0.7); }
.dream-star-244:nth-child(3n) { animation-duration: 4s; background: rgba(200, 230, 255, 0.5); }

@keyframes star-twinkle-244 {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.5); }
}

@media (max-width: 768px) {
  .dream-char-244 {
    font-size: clamp(2rem, 10vw, 3.5rem);
  }
  .dream-title-wrap-244 {
    flex-wrap: wrap;
    justify-content: center;
    max-width: 90vw;
  }
  .dream-subtitle-244 {
    flex-wrap: wrap;
    justify-content: center;
    max-width: 90vw;
    letter-spacing: 0.1em;
    font-size: 0.55rem;
  }
  .dream-geo-item-244 {
    display: none;
  }
}
</style>

