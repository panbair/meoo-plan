<template>
  <div class="echo-section-141" ref="sectionRef">
    <!-- 背景层 -->
    <div class="echo-bg-141"></div>

    <!-- 声波环画布 -->
    <canvas ref="canvasRef" class="echo-canvas-141"></canvas>

    <!-- 内容区 -->
    <div class="echo-content-141" ref="contentRef">
      <!-- 标题区 -->
      <div class="echo-header-141" ref="headerRef">
        <div class="echo-icon-141" ref="iconRef">
          <div class="echo-icon-ring-141" v-for="i in 4" :key="i" :class="`echo-ring-${i}-141`"></div>
          <div class="echo-icon-dot-141"></div>
        </div>
        <h2 class="echo-title-141" ref="titleRef">
          <span v-for="(char, i) in titleChars" :key="i" class="echo-char-141" :ref="el => setCharRef(el as HTMLElement, i)">{{ char }}</span>
        </h2>
        <p class="echo-subtitle-141" ref="subtitleRef">声音与文字的共鸣，涟漪在空气中传播</p>
      </div>

      <!-- 卡片网格 -->
      <div class="echo-grid-141" ref="gridRef">
        <div
          v-for="(card, i) in cards"
          :key="i"
          class="echo-card-141"
          :ref="el => setCardRef(el as HTMLElement, i)"
        >
          <div class="echo-card-wave-141"></div>
          <div class="echo-card-icon-141">{{ card.icon }}</div>
          <h3 class="echo-card-title-141">{{ card.title }}</h3>
          <p class="echo-card-desc-141">{{ card.desc }}</p>
          <div class="echo-card-freq-141">
            <div v-for="j in 8" :key="j" class="echo-freq-bar-141" :style="{ height: `${Math.random() * 60 + 20}%` }"></div>
          </div>
        </div>
      </div>

      <!-- 底部引言 -->
      <div class="echo-quote-141" ref="quoteRef">
        <span class="echo-quote-mark-141">"</span>
        <p class="echo-quote-text-141">
          每一个字符都是一次振动，每一次振动都在空间中留下涟漪。<br>
          声音消逝，回响永存。
        </p>
        <span class="echo-quote-mark-141 echo-quote-close-141">"</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// 唯一后缀: 141

const sectionRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const iconRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const gridRef = ref<HTMLElement | null>(null)
const quoteRef = ref<HTMLElement | null>(null)

const titleChars = '声波回响'.split('')
const charRefs = ref<(HTMLElement | null)[]>([])
const cardRefs = ref<(HTMLElement | null)[]>([])

const setCharRef = (el: HTMLElement | null, i: number) => { if (el) charRefs.value[i] = el }
const setCardRef = (el: HTMLElement | null, i: number) => { if (el) cardRefs.value[i] = el }

const cards = [
  { icon: '🔊', title: '声波传播', desc: '声音以纵波形式在介质中传播，每个分子的振动将能量向前传递，形成可听见的压力波。' },
  { icon: '🎵', title: '频率共鸣', desc: '当两个振动系统频率相同时，能量传递效率最高，产生共鸣现象，声音得到放大与强化。' },
  { icon: '🌊', title: '回声叠加', desc: '声波遇到障碍物反射，与原声叠加。相位相同时增强，相位相反时抵消，创造复杂的音响效果。' },
  { icon: '✨', title: '驻波现象', desc: '两列频率相同、反向传播的波相遇，形成驻波。波节处静止不动，波腹处振幅最大，呈现美丽的驻波图案。' },
]

type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []
let ctx: gsap.Context | null = null
let animFrameId: number | null = null

// Canvas 声波粒子系统
interface WaveParticle {
  x: number
  y: number
  radius: number
  maxRadius: number
  opacity: number
  speed: number
  color: string
}

const waves: WaveParticle[] = []

const initCanvas = () => {
  const canvas = canvasRef.value
  const section = sectionRef.value
  if (!canvas || !section) return

  const resize = () => {
    canvas.width = section.offsetWidth
    canvas.height = section.offsetHeight
  }
  resize()
  window.addEventListener('resize', resize)
  cleanupFns.push(() => window.removeEventListener('resize', resize))

  const colors = ['rgba(99, 102, 241,', 'rgba(168, 85, 247,', 'rgba(59, 130, 246,', 'rgba(20, 184, 166,']

  // 定期生成新波纹
  const addWave = () => {
    if (waves.length < 12) {
      waves.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 0,
        maxRadius: 150 + Math.random() * 200,
        opacity: 0.6,
        speed: 1 + Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)]
      })
    }
  }

  const waveInterval = setInterval(addWave, 800)
  cleanupFns.push(() => clearInterval(waveInterval))

  const drawCanvas = () => {
    const c = canvas.getContext('2d')
    if (!c) return
    c.clearRect(0, 0, canvas.width, canvas.height)

    waves.forEach((wave, index) => {
      wave.radius += wave.speed
      wave.opacity = Math.max(0, 0.6 * (1 - wave.radius / wave.maxRadius))

      // 绘制多圈同心环
      for (let ring = 0; ring < 3; ring++) {
        const r = wave.radius - ring * 20
        if (r > 0) {
          c.beginPath()
          c.arc(wave.x, wave.y, r, 0, Math.PI * 2)
          c.strokeStyle = `${wave.color}${wave.opacity * (1 - ring * 0.3)})`
          c.lineWidth = 2 - ring * 0.5
          c.stroke()
        }
      }

      if (wave.radius >= wave.maxRadius) {
        waves.splice(index, 1)
      }
    })

    animFrameId = requestAnimationFrame(drawCanvas)
  }
  drawCanvas()

  const handleVisibility = () => {
    if (document.hidden) {
      if (animFrameId) cancelAnimationFrame(animFrameId)
    } else {
      drawCanvas()
    }
  }
  document.addEventListener('visibilitychange', handleVisibility)
  cleanupFns.push(() => document.removeEventListener('visibilitychange', handleVisibility))
}

onMounted(() => {
  const rootEl = sectionRef.value
  if (!rootEl) return

  initCanvas()

  ctx = gsap.context(() => {
    // 图标声波环动画
    const rings = rootEl.querySelectorAll('.echo-icon-ring-141')
    rings.forEach((ring, i) => {
      gsap.to(ring, {
        scale: 1.5 + i * 0.5,
        opacity: 0,
        duration: 1.5 + i * 0.3,
        ease: 'power2.out',
        repeat: -1,
        delay: i * 0.3
      })
    })

    // 标题字符入场
    if (charRefs.value.length > 0) {
      const charTl = gsap.fromTo(
        charRefs.value.filter(Boolean),
        { y: 80, opacity: 0, scale: 0.5, filter: 'blur(15px)' },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1,
          ease: 'back.out(1.7)',
          stagger: 0.1,
          scrollTrigger: {
            trigger: headerRef.value,
            start: 'top 80%',
            end: 'top 30%',
            scrub: 1.5
          }
        }
      )
      cleanupFns.push(() => charTl.kill())
    }

    // 副标题
    if (subtitleRef.value) {
      const subTl = gsap.fromTo(subtitleRef.value,
        { y: 40, opacity: 0, letterSpacing: '0.5em' },
        {
          y: 0,
          opacity: 1,
          letterSpacing: '0.1em',
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.value,
            start: 'top 75%',
            end: 'top 25%',
            scrub: 1.5
          }
        }
      )
      cleanupFns.push(() => subTl.kill())
    }

    // 卡片网格入场
    const validCards = cardRefs.value.filter(Boolean)
    if (validCards.length > 0) {
      const cardTl = gsap.fromTo(
        validCards,
        { y: 100, opacity: 0, scale: 0.85, rotateY: -15 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotateY: 0,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: gridRef.value,
            start: 'top 85%',
            end: 'top 20%',
            scrub: 1.5
          }
        }
      )
      cleanupFns.push(() => cardTl.kill())

      // 卡片频率条动画
      validCards.forEach(card => {
        const bars = card.querySelectorAll('.echo-freq-bar-141')
        gsap.to(bars, {
          scaleY: () => 0.3 + Math.random() * 0.7,
          duration: 0.4,
          ease: 'power1.inOut',
          stagger: 0.05,
          repeat: -1,
          yoyo: true
        })
      })
    }

    // 引言入场
    if (quoteRef.value) {
      const quoteTl = gsap.fromTo(quoteRef.value,
        { y: 60, opacity: 0, filter: 'blur(10px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: quoteRef.value,
            start: 'top 85%',
            end: 'top 30%',
            scrub: 1.5
          }
        }
      )
      cleanupFns.push(() => quoteTl.kill())
    }
  }, rootEl)
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0
  if (animFrameId) cancelAnimationFrame(animFrameId)
  ctx?.revert()
  ctx = null
  charRefs.value = []
  cardRefs.value = []
})
</script>

<style scoped>
.echo-section-141 {
  width: 100vw;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(160deg, #0a0a1a 0%, #0d1b2e 40%, #0a1628 70%, #060d1a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.echo-bg-141 {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 20% 50%, rgba(99, 102, 241, 0.12) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(168, 85, 247, 0.08) 0%, transparent 40%),
    radial-gradient(ellipse at 60% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 45%);
}

.echo-canvas-141 {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.echo-content-141 {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1200px;
  padding: 80px 40px;
  margin: 0 auto;
}

.echo-header-141 {
  text-align: center;
  margin-bottom: 80px;
}

.echo-icon-141 {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.echo-icon-ring-141 {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid rgba(99, 102, 241, 0.6);
}

.echo-icon-dot-141 {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: radial-gradient(circle, #818cf8, #6366f1);
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.8), 0 0 40px rgba(99, 102, 241, 0.4);
}

.echo-title-141 {
  display: flex;
  justify-content: center;
  gap: 0.05em;
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 900;
  letter-spacing: 0.2em;
  margin-bottom: 20px;
}

.echo-char-141 {
  display: inline-block;
  background: linear-gradient(180deg, #c7d2fe 0%, #818cf8 40%, #6366f1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 15px rgba(99, 102, 241, 0.5));
}

.echo-subtitle-141 {
  font-size: 1.1rem;
  color: #94a3b8;
  letter-spacing: 0.1em;
  font-weight: 300;
}

.echo-grid-141 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 60px;
}

@media (max-width: 768px) {
  .echo-grid-141 {
    grid-template-columns: 1fr;
  }
}

.echo-card-141 {
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 16px;
  padding: 28px;
  overflow: hidden;
  transition: border-color 0.3s;
}

.echo-card-141:hover {
  border-color: rgba(99, 102, 241, 0.5);
}

.echo-card-wave-141 {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.05), transparent);
  animation: echo-wave-sweep-141 4s linear infinite;
}

@keyframes echo-wave-sweep-141 {
  0% { left: -100%; }
  100% { left: 100%; }
}

.echo-card-icon-141 {
  font-size: 2rem;
  margin-bottom: 12px;
}

.echo-card-title-141 {
  font-size: 1.2rem;
  font-weight: 700;
  color: #c7d2fe;
  margin-bottom: 10px;
}

.echo-card-desc-141 {
  font-size: 0.95rem;
  color: #94a3b8;
  line-height: 1.7;
  margin-bottom: 16px;
}

.echo-card-freq-141 {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 30px;
}

.echo-freq-bar-141 {
  flex: 1;
  background: linear-gradient(0deg, #6366f1, #818cf8);
  border-radius: 2px;
  transform-origin: bottom;
  min-height: 4px;
}

.echo-quote-141 {
  text-align: center;
  padding: 40px;
  background: rgba(99, 102, 241, 0.05);
  border-radius: 16px;
  border: 1px solid rgba(99, 102, 241, 0.15);
  position: relative;
}

.echo-quote-mark-141 {
  font-size: 4rem;
  color: rgba(99, 102, 241, 0.4);
  font-family: Georgia, serif;
  line-height: 1;
  display: block;
  margin-bottom: -10px;
}

.echo-quote-close-141 {
  margin-bottom: 0;
  margin-top: -10px;
}

.echo-quote-text-141 {
  font-size: 1.1rem;
  color: #cbd5e1;
  line-height: 2;
  font-style: italic;
  padding: 0 20px;
}
</style>

