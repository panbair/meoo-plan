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
  title: '黄沙漫天',
  subtitle: 'SANDSTORM · DESERT · WIND · EROSION'
})

const parentRef = ref<HTMLElement | null>(null)
const sandCanvasRef = ref<HTMLCanvasElement | null>(null)
const dustRef = ref<HTMLElement | null>(null)
const titleWrapRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const dunePath1Ref = ref<SVGPathElement | null>(null)
const dunePath2Ref = ref<SVGPathElement | null>(null)

const charRefs = ref<Map<number, HTMLElement>>(new Map())

const titleChars = computed(() => props.title.split(''))

function setCharRef(el: HTMLElement | null, index: number) {
  if (el) {
    charRefs.value.set(index, el)
  }
}

type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []
let ctx: gsap.Context | null = null
let sandAnimId: number | null = null

interface SandParticle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  color: string
  life: number
  maxLife: number
}

const sandParticles: SandParticle[] = []

function initSandCanvas() {
  const canvas = sandCanvasRef.value
  if (!canvas || !parentRef.value) {
    return
  }
  canvas.width = parentRef.value.offsetWidth
  canvas.height = parentRef.value.offsetHeight

  const ctx2d = canvas.getContext('2d')!
  const w = canvas.width
  const h = canvas.height

  const colors = [
    'rgba(210, 165, 70, 0.7)',
    'rgba(230, 190, 100, 0.6)',
    'rgba(195, 140, 50, 0.8)',
    'rgba(245, 200, 120, 0.5)',
    'rgba(160, 110, 35, 0.7)'
  ]

  // 初始化沙粒
  for (let i = 0; i < 300; i++) {
    sandParticles.push({
      x: Math.random() * w * 1.5 - w * 0.25,
      y: Math.random() * h,
      vx: (Math.random() * 2 + 1) * 1.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.6 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: Math.random() * 200,
      maxLife: 200 + Math.random() * 200
    })
  }

  function draw() {
    ctx2d.clearRect(0, 0, w, h)

    // 沙漠背景渐变
    const grad = ctx2d.createLinearGradient(0, 0, 0, h)
    grad.addColorStop(0, '#2a1a05')
    grad.addColorStop(0.3, '#4a2e0a')
    grad.addColorStop(0.7, '#7a4e1a')
    grad.addColorStop(1, '#5a3a0f')
    ctx2d.fillStyle = grad
    ctx2d.fillRect(0, 0, w, h)

    // 沙粒动画
    sandParticles.forEach((p) => {
      p.x += p.vx
      p.y += p.vy + Math.sin(p.life * 0.05) * 0.3
      p.life++

      if (p.x > w + 20 || p.life > p.maxLife) {
        p.x = -20
        p.y = Math.random() * h
        p.life = 0
        p.vx = (Math.random() * 2 + 1) * 1.5
      }

      ctx2d.beginPath()
      ctx2d.fillStyle = p.color.replace(
        /[\d.]+\)$/,
        `${p.alpha * (1 - (p.life / p.maxLife) * 0.3)})`
      )
      ctx2d.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx2d.fill()
    })

    // 沙尘流线
    for (let i = 0; i < 8; i++) {
      const yPos = h * 0.3 + i * (h * 0.08)
      const speed = 0.001 + i * 0.0005
      const xOffset = (Date.now() * speed * 60) % w

      ctx2d.beginPath()
      ctx2d.strokeStyle = `rgba(200, 155, 60, ${0.08 + i * 0.02})`
      ctx2d.lineWidth = 0.8 + i * 0.3
      ctx2d.moveTo(0, yPos)
      for (let x = 0; x <= w; x += 20) {
        const y = yPos + Math.sin((x + xOffset) * 0.02) * 5
        ctx2d.lineTo(x, y)
      }
      ctx2d.stroke()
    }

    sandAnimId = requestAnimationFrame(draw)
  }
  draw()
}

function playEntrance() {
  const chars = Array.from(charRefs.value.values())
  const subChars = subtitleRef.value?.querySelectorAll('.sand-sub-char-243')

  // 初始：被沙尘掩埋
  gsap.set(chars, {
    opacity: 0,
    filter: 'blur(15px)',
    y: 30,
    color: '#4a2e0a',
    scale: 0.9
  })
  if (dustRef.value) {
    gsap.set(dustRef.value, { opacity: 0.9 })
  }
  if (subChars) {
    gsap.set(subChars, { opacity: 0, x: 20 })
  }

  const tl = gsap.timeline()

  // 沙尘消散
  tl.to(dustRef.value, { opacity: 0, duration: 1.5, ease: 'power2.inOut' })

  // 文字从沙中浮现
  tl.to(
    chars,
    {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      color: '#e8c060',
      scale: 1,
      duration: 1.0,
      stagger: {
        each: 0.1,
        from: 'start'
      },
      ease: 'power2.out'
    },
    '-=1.0'
  )

  // 文字侵蚀颤动
  tl.to(
    chars,
    {
      x: () => (Math.random() - 0.5) * 3,
      duration: 0.1,
      stagger: { each: 0.05, repeat: 3 },
      ease: 'none'
    },
    '-=0.3'
  )

  tl.to(chars, { x: 0, duration: 0.2 })

  if (subChars) {
    tl.to(
      subChars,
      {
        opacity: 0.7,
        x: 0,
        duration: 0.8,
        stagger: 0.04,
        ease: 'power1.out'
      },
      '-=0.4'
    )
  }

  cleanupFns.push(() => tl.kill())
}

// 沙丘路径动画
function animateDunes() {
  if (!dunePath1Ref.value || !dunePath2Ref.value) {
    return
  }

  const t1 = gsap.timeline({ repeat: -1 })
  t1.to(dunePath1Ref.value, {
    attr: {
      d: 'M0,130 Q200,60 400,110 Q600,160 800,90 Q1000,40 1200,100 Q1340,140 1440,80 L1440,200 L0,200 Z'
    },
    duration: 4,
    ease: 'sine.inOut'
  }).to(dunePath1Ref.value, {
    attr: {
      d: 'M0,150 Q200,80 400,130 Q600,180 800,110 Q1000,60 1200,120 Q1340,160 1440,100 L1440,200 L0,200 Z'
    },
    duration: 4,
    ease: 'sine.inOut'
  })

  const t2 = gsap.timeline({ repeat: -1, delay: 2 })
  t2.to(dunePath2Ref.value, {
    attr: {
      d: 'M0,155 Q300,100 500,140 Q700,175 900,125 Q1100,85 1300,130 L1440,105 L1440,200 L0,200 Z'
    },
    duration: 5,
    ease: 'sine.inOut'
  }).to(dunePath2Ref.value, {
    attr: {
      d: 'M0,170 Q300,120 500,155 Q700,190 900,140 Q1100,100 1300,145 L1440,120 L1440,200 L0,200 Z'
    },
    duration: 5,
    ease: 'sine.inOut'
  })

  cleanupFns.push(() => {
    t1.kill()
    t2.kill()
  })
}

// 持续沙侵效果（轻微颤动）
function startErosionEffect() {
  const chars = Array.from(charRefs.value.values())
  chars.forEach((char, i) => {
    const t = gsap.to(char, {
      filter: 'blur(0.5px)',
      duration: 0.8 + Math.random() * 0.5,
      yoyo: true,
      repeat: -1,
      delay: i * 0.2,
      ease: 'sine.inOut'
    })
    cleanupFns.push(() => t.kill())
  })
}

onMounted(() => {
  if (!parentRef.value) {
    return
  }
  initSandCanvas()
  animateDunes()

  setTimeout(() => {
    ctx = gsap.context(() => {
      playEntrance()
      startErosionEffect()

      const st = ScrollTrigger.create({
        trigger: parentRef.value,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 1.5,
        onEnter: () => playEntrance(),
        onLeaveBack: () => {
          const chars = Array.from(charRefs.value.values())
          gsap.set(chars, { opacity: 0, filter: 'blur(15px)', y: 30, color: '#4a2e0a', scale: 0.9 })
          if (dustRef.value) {
            gsap.set(dustRef.value, { opacity: 0.9 })
          }
        }
      })
      cleanupFns.push(() => st.kill())
    }, parentRef.value)
  }, 100)
})

onUnmounted(() => {
  cleanupFns.forEach((fn) => fn())
  cleanupFns.length = 0
  ctx?.revert()
  ctx = null
  if (sandAnimId !== null) {
    cancelAnimationFrame(sandAnimId)
  }
  ScrollTrigger.getAll().forEach((st) => st.kill())
  charRefs.value.clear()
  sandParticles.length = 0
})
</script>

<template>
  <div ref="parentRef" class="sandstorm-text-243">
    <!-- 沙粒 Canvas -->
    <canvas ref="sandCanvasRef" class="sandstorm-canvas-243"></canvas>

    <!-- 沙尘遮罩层 -->
    <div ref="dustRef" class="sandstorm-dust-243"></div>

    <!-- 主标题文字 -->
    <div ref="titleWrapRef" class="sandstorm-title-wrap-243">
      <span
        v-for="(char, index) in titleChars"
        :key="`sand-${index}`"
        :ref="(el) => setCharRef(el as HTMLElement, index)"
        class="sandstorm-char-243"
        >{{ char === ' ' ? '\u00A0' : char }}</span
      >
    </div>

    <!-- 副标题 -->
    <div ref="subtitleRef" class="sandstorm-subtitle-243">
      <span v-for="(char, i) in subtitle.split('')" :key="i" class="sand-sub-char-243">{{
        char
      }}</span>
    </div>

    <!-- 沙丘轮廓装饰 -->
    <svg class="sandstorm-dune-svg-243" viewBox="0 0 1440 200" preserveAspectRatio="none">
      <path
        ref="dunePath1Ref"
        d="M0,150 Q200,80 400,130 Q600,180 800,110 Q1000,60 1200,120 Q1340,160 1440,100 L1440,200 L0,200 Z"
        fill="rgba(200,150,50,0.2)"
      />
      <path
        ref="dunePath2Ref"
        d="M0,170 Q300,120 500,155 Q700,190 900,140 Q1100,100 1300,145 L1440,120 L1440,200 L0,200 Z"
        fill="rgba(180,120,30,0.15)"
      />
    </svg>

    <!-- 底部沙粒细节 -->
    <div class="sandstorm-ground-243"></div>
  </div>
</template>

<style scoped>
.sandstorm-text-243 {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: #4a2e0a;
  font-family: 'Palatino Linotype', 'Georgia', serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.sandstorm-canvas-243 {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.sandstorm-dust-243 {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at 60% 40%,
    rgba(200, 150, 50, 0.6) 0%,
    rgba(180, 120, 30, 0.4) 40%,
    rgba(120, 80, 20, 0.2) 70%,
    transparent 100%
  );
  pointer-events: none;
  z-index: 8;
  opacity: 0;
}

.sandstorm-title-wrap-243 {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 0.04em;
  margin-bottom: 2rem;
}

.sandstorm-char-243 {
  display: inline-block;
  font-size: clamp(3rem, 9vw, 6.5rem);
  font-weight: 700;
  color: #e8c060;
  letter-spacing: 0.05em;
  text-shadow:
    0 0 15px rgba(220, 170, 60, 0.7),
    0 0 40px rgba(180, 120, 20, 0.4),
    2px 3px 8px rgba(0, 0, 0, 0.7);
  will-change: transform, opacity, filter;
  user-select: none;
  cursor: default;
}

.sandstorm-char-243:hover {
  color: #fff;
  text-shadow:
    0 0 10px rgba(255, 220, 100, 1),
    0 0 30px rgba(220, 170, 50, 0.8),
    0 0 60px rgba(180, 120, 20, 0.5);
  animation: sand-erode-243 0.5s ease-out;
}

@keyframes sand-erode-243 {
  0%,
  100% {
    transform: translateY(0) skewX(0deg);
  }
  25% {
    transform: translateY(-8px) skewX(3deg);
  }
  50% {
    transform: translateY(3px) skewX(-2deg);
  }
  75% {
    transform: translateY(-4px) skewX(1deg);
  }
}

.sandstorm-subtitle-243 {
  position: relative;
  z-index: 10;
  display: flex;
  gap: 0.04em;
  font-family: 'Courier New', monospace;
  font-size: clamp(0.6rem, 1.2vw, 0.85rem);
  color: rgba(220, 175, 80, 0.6);
  letter-spacing: 0.3em;
  text-transform: uppercase;
}

.sand-sub-char-243 {
  display: inline-block;
}

.sandstorm-dune-svg-243 {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 200px;
  pointer-events: none;
  z-index: 7;
}

.sandstorm-ground-243 {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40px;
  background: linear-gradient(0deg, rgba(160, 110, 30, 0.6), transparent);
  pointer-events: none;
  z-index: 9;
}

@media (max-width: 768px) {
  .sandstorm-char-243 {
    font-size: clamp(2.5rem, 11vw, 4.5rem);
  }
  .sandstorm-title-wrap-243 {
    flex-wrap: wrap;
    justify-content: center;
    max-width: 90vw;
  }
  .sandstorm-subtitle-243 {
    flex-wrap: wrap;
    justify-content: center;
    max-width: 90vw;
    letter-spacing: 0.1em;
    font-size: 0.55rem;
  }
}
</style>
